// ==UserScript==
// @name        Github module links
// @namespace   github-module-links
// @description Inserts direct repository links for modules used in source code on github.
// @version     1.0.2
// @author      klntsky
// @license     MIT
// @run-at      document-end
// @include     https://github.com/*
// @include     http://github.com/*
// @grant       GM_xmlhttpRequest
// @connect     registry.npmjs.org
// @downloadURL https://update.greasyfork.org/scripts/36484/Github%20module%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/36484/Github%20module%20links.meta.js
// ==/UserScript==

var config = {
    // Whether to add `target='_blank'` to all of the links inserted
    open_new_tabs: false,
    // Mapping from package names to registry URLs
    registry: (package) => 'https://registry.npmjs.org/' + package,
    // Mapping from package names to package URLs (used as fallback)
    package_url: (package, repository) => 'https://www.npmjs.com/package/' + package,
    // Insert direct github repository links (i.e. if repository link returned
    // by npm API points to github.com, then use it instead of a link returned
    // by config.package_url lambda.
    // Most of the npm package repositories are hosted on github.
    github_repos: true,
    // Whether to allow logging
    log: false,
    holders: {
        'git+https://github.com/npm/deprecate-holder.git': name =>
            'https://www.npmjs.com/package/' + name,
        'git+https://github.com/npm/security-holder.git': name =>
            'https://www.npmjs.com/package/' + name,
    }
}

function update () {
    processImports(getImports());
}

function log () {
    if (config.log)
        console.log.apply(console, arguments);
}

// Get object with package or file names as keys and lists of HTML elements as
// values. If the imports are already processed this function will not return
// them.
function getImports () {
    var list = [];
    var imports = {};

    document.querySelectorAll('.js-file-line > span.pl-c1').forEach(el => {
        var result = { success } = parseRequire(el);
        if (success) {
            list.push(result);
        }
    });

    document.querySelectorAll('.js-file-line > span.pl-smi + span.pl-k + span.pl-s').forEach(el => {
        var result = { success } = parseImport(el);
        if (success) {
            list.push(result);
        }
    });

    list.forEach(entry => {
        if (imports[entry.name] instanceof Array) {
            imports[entry.name].push(entry);
        } else {
            imports[entry.name] = [entry];
        }
    });

    return imports;
}

// Parse `require('some-module')` definition
function parseRequire (el) {
    var fail = { success: false };

    try {
        // Opening parenthesis
        var ob = el.nextSibling;
        // Module name
        var str = ob.nextSibling;
        // Closing parenthesis
        var cb = str.nextSibling;

        if (el.textContent === 'require'
            && ob.nodeType === 3
            && ob.textContent.trim() === '('
            && str.classList.contains('pl-s')
            && cb.nodeType === 3
            && cb.textContent.trim().startsWith(')')) {
            var name = getName(str);
            if (!name) return fail;
            return {
                name: name,
                elem: str,
                success: true,
            };
        }

        return fail;
    } catch (e) {
        return fail;
    }
}

// Parse `import something from 'some-module` defintion
function parseImport (str) {
    var fail = { success: false };

    try {
        var frm = str.previousElementSibling;
        var imp = frm.previousElementSibling;

        while (imp.textContent !== 'import') {
            if (imp.previousElementSibling !== null) {
                imp = imp.previousElementSibling;
            } else {
                return fail;
            }
        }

        if (frm.textContent === 'from' &&
            imp.textContent === 'import') {
            var name = getName(str);
            return {
                name: name,
                elem: str,
                success: true,
            };
        }

        return fail;
    } catch (e) {
        return fail;
    }
}

// Convert element containing module name to the name (strip quotes from textContent)
function getName(str) {
    return str.textContent.substr(1, str.textContent.length - 2);
}

// Add relative links for file imports and call processPackage for each package
// import.
function processImports (imports) {
    var packages = [];
    log('prcessImports', imports);

    for (var imp in imports) {
        if (imports.hasOwnProperty(imp)) {
            // If path is not relative
            if (imp[0] !== '.') {
                packages.push(imp);
            } else {
                imports[imp].forEach(({ elem, name }) => {
                    // Assume the extension is omitted
                    if (!name.endsWith('.js') && !name.endsWith('.json')) {
                        name += '.js';
                    }
                    addLink(elem, name);
                });

            }
        }
    }

    log('processImports', 'packages:', packages);
    packages.forEach(p => processPackage(p, imports));
}


function processPackage (package, imports) {
    new Promise((resolve, reject) => GM_xmlhttpRequest({
        url: config.registry(package),
        timeout: 10000,
        method: 'GET',
        onload: r => {
            try {
                resolve(JSON.parse(r.response));
            } catch (e) {
                reject();
            }
        },
        onabort: reject,
        onerror: reject,
    })).then(response => {
        try {
            var linkURL;
            var url_parts = response.repository.url.split('/');

            if (Object.keys(config.holders)
                      .includes(response.repository.url)) {
                linkURL = config.holders[response.repository.url](package);
            } else if (url_parts.length >= 5) {
                // `new URL(response.repository.url)` incorrectly handles
                // `git+https` protocol.
                var hostname = url_parts[2];
                var username = url_parts[3];
                var repo = url_parts[4];

                if (repo.endsWith('.git') && url_parts.length == 5) {
                    repo = repo.substr(0, repo.length - 4);
                }

                if (hostname == 'github.com' && config.github_repos) {
                    linkURL = 'https://github.com/' + username + '/' + repo + '/';
                } else {
                    linkURL = config.package_url(package, response.repository.url);
                }
            } else {
                return;
            }

            imports[package].forEach(({ elem }) => {
                addLink(elem, linkURL);
            });

        } catch (e) {
            log('processPackage', 'error:', e);
        }
    });
}

function addLink (elem, url) {
    var a = document.createElement('a');
    a.href = url;

    if (config.open_new_tabs) {
        a.target="_blank";
    }

    elem.parentNode.insertBefore(a, elem);
    a.appendChild(elem);
}

function startObserver () {
    var callback = function(mutationsList) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                update();
            }
        }
    };

    var observer = new MutationObserver(callback);
    observer.observe(document.body, { attributes: false,
                                      childList: true });
}

update();
startObserver();
