// ==UserScript==
// @name         GitHub PHP Hyperlinks
// @namespace    https://github.com/Koopzington
// @version      0.7
// @description  Enhances browsing through PHP code on GitHub by linking referenced classes
// @author       koopzington@gmail.com
// @match        https://github.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/21645/GitHub%20PHP%20Hyperlinks.user.js
// @updateURL https://update.greasyfork.org/scripts/21645/GitHub%20PHP%20Hyperlinks.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Also execute this script if content is getting loaded via pjax
    document.addEventListener("pjax:complete", function () {
        start();
    });
    start();

    function start() {
        // Check if currently viewed file is a PHP file
        if (window.location.href.split('.php').length == 2) {
            // Grab reponame
            var repoName = window.location.href.split('/');
            var status = repoName[6];
            repoName = repoName[3] + '/' + repoName[4];
            var nsRoots = [];
            var dependencies = [];
            var imports = [];
            var filenamespace;
            parseFile();
        }

        function parseFile() {
            // Grab namespace of current class
            var namespaceXPath = "//span[@class='pl-k' and .='namespace']/following-sibling::span";
            filenamespace = document.evaluate(namespaceXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            // Check if file is a class or not
            var classCheck = document.evaluate("span[@class ='pl-k' and .='class']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            var useXpath;
            if (classCheck !== null) {
                useXpath = "//span[@class='pl-k' and .='use'][not(preceding::span[@class ='pl-k' and .='class'])]/following-sibling::span[not(contains(.,'')]";
            } else {
                useXpath = "//span[@class='pl-k' and .='use']/following-sibling::span[not(contains(.,'$'))]";
            }
            // Now let's grab all use statements
            var iterator = document.evaluate(useXpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
            var thisNode = iterator.iterateNext();

            while (thisNode) {
                var newImport = {};
                newImport.name = thisNode.textContent;
                thisNode = iterator.iterateNext();
                // Check if use statement has an alias
                if (thisNode && thisNode.textContent == "as") {
                    thisNode = iterator.iterateNext();
                    newImport.alias = thisNode.textContent;
                    thisNode = iterator.iterateNext();
                } else {
                    var split = newImport.name.split('\\');
                    newImport.alias = split[split.length - 1];
                }
                imports.push(newImport);
            }

            // Grab composer.json from current repo
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.github.com/repos/" + repoName + '/contents/composer.json?ref=' + status,
                onload: function (responseDetails) {
                    if (responseDetails.status == 200) {
                        var data = JSON.parse(atob(JSON.parse(responseDetails.responseText).content));
                        var req;
                        checkAutoload(data, repoName);
                        if (data.hasOwnProperty('require')) {
                            for (req in data.require) {
                                dependencies.push(req);
                            }
                        }
                        if (data.hasOwnProperty('require-dev')) {
                            for (req in data['require-dev']) {
                                dependencies.push(req);
                            }
                        }
                        addExternalRoots();
                    }
                }
            });
        }

        function addExternalRoots() {
            var promises = [];
            for (var i = 0; i < dependencies.length; ++i) {
                promises.push(getComposerOf(dependencies[i]));
            }
            Promise.all(promises).then(function () {
                grabFilesOnSameNamespace();
            });
        }

        function grabFilesOnSameNamespace() {
            if (filenamespace !== null) {
                // Find out root namespace of file
                var currentNamespace = filenamespace.innerHTML;
                var currentRoot;
                for (var ns in nsRoots) {
                    if (currentNamespace.substring(0, nsRoots[ns].root.length - 1) + '\\' == nsRoots[ns].root) {
                        currentNamespace = currentNamespace.substring(nsRoots[ns].root.length);
                        currentRoot = nsRoots[ns];
                    }
                }
                // Now we get all classes that are in the same namespace as our current class
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://api.github.com/repos/" + repoName + '/contents/' + currentRoot.path + currentNamespace,
                    onload: function (responseDetails) {
                        if (responseDetails.status == 200) {
                            var data = JSON.parse(responseDetails.responseText);
                            for (var i = 0; i < data.length; ++i) {
                                var classname = data[i].name.split('.php')[0];
                                imports.push({
                                    name: filenamespace.innerHTML + '\\' + classname,
                                    alias: classname
                                });
                            }
                        }
                        editDOM();
                    }
                });
            } else {
                editDOM();
            }
        }

        function getComposerOf(repo) {
            return new Promise(function (resolve) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://packagist.org/p/" + repo + '.json',
                    onload: function (responseDetails) {
                        if (responseDetails.status == 200) {
                            var reqData = JSON.parse(responseDetails.responseText).packages[repo];
                            if (reqData.hasOwnProperty('dev-master')) {
                                checkAutoload(reqData['dev-master']);
                            }
                        }
                        resolve();
                    }
                });
            });
        }

        function checkAutoload(data, repoName) {
            if (data.hasOwnProperty('autoload')) {
                var path;
                var repo;
                var root;
                if (repoName !== undefined) {
                    repo = repoName;
                } else {
                    repo = data.source.url.split('github.com/')[1].split('.git')[0];
                }
                if (data.autoload.hasOwnProperty('psr-4')) {
                    for (var ns4 in data.autoload['psr-4']) {
                        path = data.autoload['psr-4'][ns4];
                        if (path.substring(path.length - 1) != '/') {
                            path = path + '/';
                        }
                        root = ns4;
                        if (ns4.substring(ns4.length -1) != '\\') {
                            root = ns4 + '\\';
                        }
                        nsRoots.push({
                            root: root,
                            path: path,
                            repo: repo
                        });
                    }
                }
                if (data.autoload.hasOwnProperty('psr-0')) {
                    for (var ns0 in data.autoload['psr-0']) {
                        path = data.autoload['psr-0'][ns0];
                        if (path.substring(path.length - 1) != '/') {
                            path = path + '/';
                        }
                        root = ns0;
                        if (ns0.substring(ns0.length -1) != '\\') {
                            root = ns0 + '\\';
                        }
                        path = path + root.substring(0, root.length - 1) + '/';
                        path = path.replace(/\\/g, '/');
                        nsRoots.push({
                            root: root,
                            path: path,
                            repo: repo
                        });
                    }
                }
            }
        }

        function editDOM() {
            var currentRoot;
            var currentNamespace;
            var k;
            var toBeModified;
            var currentStatus;
            var classXpath;
            var anchorStart = '<a style="color: inherit;" href="https://github.com/';
            var ns;
            var hit;

            for (ns in nsRoots) {
                // Find all full qualified class names
                classXpath = "//span[(@class='pl-s1' or @class='pl-c') and contains(.,'\\" + nsRoots[ns].root + "')]";
                toBeModified = findElements(classXpath);
                for (k = 0; k < toBeModified.length; ++k) {
                    // GitHub is splitting FQCNs into 2 spans in code while in comments they're just in one.
                    hit = toBeModified[k].innerText.split('\\' + nsRoots[ns].root)[1].split(' ')[0].split('::')[0].split('\\');
                    var lastPart = hit[hit.length -1];
                    var index = hit.indexOf(hit.length -1);
                    hit.splice(index, 1);
                    hit = hit.join('\\');
                    if (nsRoots[ns].repo == repoName) {
                        currentStatus = status;
                    } else {
                        currentStatus = 'master';
                    }
                    var firstPart = '\\' + nsRoots[ns].root + hit;
                    if (firstPart.substring(firstPart.length -1) != '\\') {
                        firstPart = firstPart + '\\';
                    }
                    var n = toBeModified[k].innerHTML.lastIndexOf(firstPart);
                    // Splitting the innerHTML so classname and path CAN be the same
                    toBeModified[k].innerHTML = toBeModified[k].innerHTML.substring(0, n + firstPart.length) + toBeModified[k].innerHTML.substring(n + firstPart.length).replace(lastPart, anchorStart + nsRoots[ns].repo + '/blob/' + currentStatus + '/' + nsRoots[ns].path + hit + '/' + lastPart + '.php">' + lastPart + '</a>');
                    toBeModified[k].innerHTML = toBeModified[k].innerHTML.replace(firstPart, anchorStart + nsRoots[ns].repo + '/tree/' + currentStatus + '/' + nsRoots[ns].path + hit + '">' + firstPart + '</a>');
                }
            }

            for (var j = 0; j < imports.length; ++j) {
                currentRoot = undefined;
                currentNamespace = undefined;
                for (ns in nsRoots) {
                    if (imports[j].name.substring(0, nsRoots[ns].root.length) == nsRoots[ns].root) {
                        currentNamespace = imports[j].name.substring(nsRoots[ns].root.length);
                        currentRoot = nsRoots[ns];
                    }
                }
                if (currentRoot !== undefined) {
                    if (currentRoot.repo == repoName) {
                        currentStatus = status;
                    } else {
                        currentStatus = 'master';
                    }

                    // Find all direct uses of the classes and replace the content with links (and ignore the ones withe a leading backslash
                    classXpath = "//span[.='" + imports[j].alias + "' and not(preceding-sibling::span[@class='pl-c1' and .='\\'])]";
                    toBeModified = findElements(classXpath);
                    for (k = 0; k < toBeModified.length; ++k) {
                        toBeModified[k].innerHTML = anchorStart + currentRoot.repo + '/blob/' + currentStatus + '/' + currentRoot.path + currentNamespace + '.php">' + toBeModified[k].innerHTML + '</a>';
                    }

                    // Find usages inside DocBlocks
                    classXpath = "//span[@class='pl-c' and (" +
                        "contains(., '@throws') " +
                        "or contains(., '@return') " +
                        "or contains(., '@param') " +
                        "or contains(., '@var')" +
                        "or contains(., '@property')" +
                        ") and (" +
                        "contains(concat(' ', normalize-space(.), ' '), ' " + imports[j].alias + " ') " +
                        "or contains(concat(' ', normalize-space(.), '[] '), ' " + imports[j].alias + "[] ') " +
                        "or contains(concat(' ', normalize-space(.), '\\'), ' " + imports[j].alias + "\\')" +
                        ")]";
                    toBeModified = findElements(classXpath);
                    for (k = 0; k < toBeModified.length; ++k) {
                        // Use innerText (which strips any HTML inside, trim and split by ' ' to get the part after @something and split by '\'
                        hit = toBeModified[k].innerText.trim().split(' ')[2].split('\\');
                        // If hit is just the classname, generate one link, if a subnamespace is in there, generate two links
                        if (hit.length == 1) {
                            toBeModified[k].innerHTML = toBeModified[k].innerHTML.replace(
                                imports[j].alias,
                                anchorStart + currentRoot.repo + '/blob/' + currentStatus + '/' + currentRoot.path + currentNamespace + '.php">' + imports[j].alias + '</a>'
                            );
                        } else if (hit.length == 2) {
                            toBeModified[k].innerHTML = toBeModified[k].innerHTML.replace(
                                hit.join('\\'),
                                anchorStart + currentRoot.repo + '/tree/' + currentStatus + '/' + currentRoot.path + currentNamespace + '">' + hit[0] + '\\' +
                                anchorStart + currentRoot.repo + '/blob/' + currentStatus + '/' + currentRoot.path + hit.join('/') + '.php">' + hit[1] + '</a>'
                            );
                        }
                    }

                    // Find all usages of classes with subnamespaces (e.g. "Foo\Bar")
                    classXpath = "//span[@class='pl-c1' and contains(.,'" + imports[j].alias + "\\') and not(preceding-sibling::span[@class='pl-k' and .='use'])]";
                    toBeModified = findElements(classXpath);
                    for (k = 0; k < toBeModified.length; ++k) {
                        hit = toBeModified[k].innerHTML;
                        toBeModified[k].innerHTML = anchorStart + currentRoot.repo + '/tree/' + currentStatus + '/' + currentRoot.path + hit + '">' + toBeModified[k].innerHTML + '</a>';
                        toBeModified[k].nextSibling.innerHTML = anchorStart + currentRoot.repo + '/blob/' + currentStatus + '/' + currentRoot.path + hit + toBeModified[k].nextSibling.innerHTML + '.php">' + toBeModified[k].nextSibling.innerHTML + '</a>';
                    }

                    // Add a Hyperlink to the use statement
                    classXpath = "//span[@class='pl-c1' and .='" + imports[j].name + "']";
                    var node = document.evaluate(classXpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
                    if (node !== null) {
                        // Use the amount of results of the upper search for subnamespace usages to determine if a link to a directory or to a file should be generated
                        if (toBeModified.length > 0) {
                            node.innerHTML = anchorStart + currentRoot.repo + '/tree/' + currentStatus + '/' + currentRoot.path + currentNamespace + '">' + node.innerHTML + '</a>';
                        } else {
                            node.innerHTML = anchorStart + currentRoot.repo + '/blob/' + currentStatus + '/' + currentRoot.path + currentNamespace + '.php">' + node.innerHTML + '</a>';
                        }
                    }
                }
            }

            // Accepts a xpath query and returns a list of found nodes
            function findElements(queryString) {
                var iterator = document.evaluate(queryString, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
                var thisNode = iterator.iterateNext();
                var toBeModified = [];
                while (thisNode) {
                    toBeModified.push(thisNode);
                    thisNode = iterator.iterateNext();
                }
                return toBeModified;
            }
        }
    }
}());