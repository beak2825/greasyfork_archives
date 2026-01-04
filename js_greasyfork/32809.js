// ==UserScript==
// @name         MB6 Search BETA
// @namespace    https://edocuments.co.uk/
// @version      1.6
// @description  BETA Quick search for Manual Builder 6
// @author       mbacon@edocuments.co.uk
// @match        https://edocs-site-springboard6.azurewebsites.net/*
// @match        https://edocs-site-springboard6-dev.azurewebsites.net/*
// @match        https://edocs-site-springboard6-test.azurewebsites.net/*
// @match        https://edocs-site-springboard6-staging.azurewebsites.net/*
// @match        https://edocumentsbuild.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32809/MB6%20Search%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/32809/MB6%20Search%20BETA.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';

    var authToken, styleElem, launchElem, overlayElem, searchElem, searchLogin, searchForm, searchInput, searchResults, recentsElem;

    var siteTargets = [
        { name: 'Dashboard', path: 'site-dashboard.htm' },
        { name: 'Management', path: 'site-management.htm#users' }
    ];
    var projectTargets = [
        {
            name: 'Dashboard',
            path: (siteId, projectId) => '/site-dashboard.htm?S='+siteId+'&G='+projectId+'#projects='+projectId
        },
        {
            name: 'Reporting',
            path: (siteId, projectId) => 'https://edocs-site-reporting.azurewebsites.net/#/report/'+projectId
        }
    ];
    var docTargets = [
        { name: 'Dashboard', path: 'document-dashboard.htm' },
        { name: 'Editor', path: 'document-editor.htm' },
        { name: 'Files', path: 'document-files.htm' },
        { name: 'Reporting', path: 'document-reporting.htm' },
        { name: 'Tools', path: 'document-tools.htm' }
    ];

    var logging = false;
    window.enableSearchLogging = function(val) {
        if(typeof val !== 'boolean') val = true;
        logging = val;
    };
    var log = function(msg) {
        if(logging) console.log.apply(console, arguments);
    };
    var error = function(msg) {
        if(logging) console.error.apply(console, arguments);
    };

    var portfolio = [];
    var portfolioBlank = false;
    var gettingPortfolio = false;
    function checkPortfolio() {
        if(portfolio.length > 0 || portfolioBlank) return log('Portfolio already fetched: ', portfolio.length);
        updateAuth();
        if(!authToken) return log('Aborted getting portfolio because authToken is invalid');
        if(gettingPortfolio) return log('Aborted getting portfolio because already in process of getting it');
        gettingPortfolio = true;
        apiRequest('GET', 'Core6', 'Portfolio/ByUserId').then(function(response) {
            gettingPortfolio = false;
            portfolio = response.Result.sites || [];
            //console.log('portfolio', portfolio);
            if(portfolio.length === 0) portfolioBlank = true;
            else
            {
                searchElem.classList.add('ready');
                if(searchInput.value.trim().length) doSearch();
                //searchInput.removeAttribute('disabled');
                //searchInput.placeholder = 'Search site/project/document';
            }
        }).catch(function(err) {
            error('Portfolio get error: ' + err.message);
            gettingPortfolio = false;
        });
    }

    var recents = [];
    var recentsBlank = false;
    var gettingRecents = false;
    function checkRecents() {
        if(recents.length > 0 || recentsBlank) return log('Recents already fetched: ', recents.length);
        updateAuth();
        if(!authToken) return log('Aborted getting recents because authToken is invalid');
        if(gettingRecents) return log('Aborted getting recents because already in process of getting it');
        gettingRecents = true;
        apiRequest('GET', 'Core6', 'Documents/Recent').then(function(response) {
            gettingRecents = false;
            var docs = (response.Result.documents || []).sort((d1,d2) => d1.activityDate < d2.activityDate);
            if(docs.length === 0) recentsBlank = true;
            else
            {
                var prevSite = null;
                var prevProject = null;
                //TODO: Check still in portfolio
                docs.forEach(function(doc, k) {
                    var site = {
                        id: doc.siteId,
                        name: doc.siteName,
                        projects: [
                        ]
                    };
                    if(k>0 && prevSite.id === site.id) site = prevSite;
                    else recents.push(site);
                    prevSite = site;
                    var project = {
                        id: doc.projectId,
                        edocsRef: doc.projectRef,
                        name: doc.projectName,
                        documents: [
                        ]
                    };
                    if(k>0 && prevProject.id === project.id) project = prevProject;
                    if(project !== prevProject) site.projects.push(project);
                    prevProject = project;
                    project.documents.push(
                        {
                            id: doc.documentId,
                            name: doc.documentName,
                            activity: doc.activity,
                            activityDate: doc.activityDate.substr(0,10)
                        }
                    );
                });
            }
            if(recents.length > 0) doSearch();
            //console.log('recents', docs);
        }).catch(function(err) {
            error('Recents get error: ' + err.message);
            gettingRecents = false;
        });
    }

    function getBaseUrl() {
        return window.location.origin;
    }
    function buildUrl(page, siteId, projectId, documentId) {
        var base = getBaseUrl();
        var hash = page.replace(/^.+(#[a-z0-9]+)$/,'$1');
        if(hash !== page) page = page.replace(hash, '');
        else hash = '';
        var url = base + '/' + page + '?S=' + siteId;
        if(projectId) url += '&G='+projectId;
        if(documentId) url += '&W='+documentId;
        if(hash) url += hash;
        return url;
    }
    function buildTargetLink(target, siteId, projectId, documentId) {
        var a = document.createElement('a');
        a.classList.add(sel('result-target'));
        a.href = typeof target.path === 'function' ? target.path(siteId, projectId, documentId) : buildUrl(target.path, siteId, projectId, documentId);
        a.textContent = target.name;
        return a;
    }
    function navigate(siteId, projectId, documentId) {
        window.location.href = buildUrl(documentId ? 'document-dashboard.htm' : 'site-dashboard.htm', siteId, projectId, documentId);
    }

    function openSearch() {
        searchElem.style.display = 'block';
        overlayElem.style.display = 'block';
        checkPortfolio();
        checkRecents();
        searchInput.focus();
    }
    function closeSearch() {
        searchElem.style.display = 'none';
        overlayElem.style.display = 'none';
    }

    function apiRequest(method, api, action, data) {
        var uri = 'https://edocsapi.azurewebsites.net/'+api+'/api/'+action;
        //var uri = 'http://localhost:51670/api/'+action;
        return fetch(uri, {
            method: method,
            mode: 'cors',
            headers: { Authorization: 'Digest username="xbbsz5aj45w" realm="" password="'+authToken+'"', 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            cache: 'default'
        }).then(function(response) {
            if(!response.ok) throw new Error('Request failure: ' + response.statusText);
            return response.json();
        }).catch(function(err) {
            alert('Search BETA - Request error: ' + err.message);
        });
    }

    authToken = '';
    function updateAuth() {
        authToken = (window.whoAmI || {}).apiAccessToken;
    }
    updateAuth();

    var prevTerm = null;
    var doSearch = throttle(function doSearch() {
        var term = searchInput.value.trim().toLowerCase();
        var showRecents = term === '' && recents.length > 0;
        if(term != prevTerm && (portfolio.length || showRecents))
        {
            searchResults.innerHTML = showRecents ? '<strong id="'+sel('recent-title')+'">Recent activity:</strong>' : '';
            var termParts = normTerm(term).split(' ');
            var termMatchesStr = function termMatchesStr(str, all) {
                var strParts = normTerm(str).split(' ');
                var termPartsMatched = [];
                strParts.forEach(function(strPart) {
                    termParts.forEach(function(termPart) {
                        if(strPart.indexOf(termPart) > -1)
                        {
                            if(termPartsMatched.indexOf(termPart) === -1) termPartsMatched.push(termPart);
                        }
                    });
                });
                return termPartsMatched.length > (all ? termParts.length-1 : 0);
            };
            checkPortfolio();
            var matches = [];
            (showRecents ? recents : portfolio).forEach(function(site) {
                var siteMatched = false;
                var siteObj = { id: site.id, name: site.name, projects: [] };
                site.projects.forEach(function(project) {
                    var projectMatched = false;
                    var projectObj = { id: project.id, name: project.name, edocsRef: project.edocsRef, documents: [] };
                    project.documents.forEach(function(document) {
                        if(termMatchesStr(document.name) && termMatchesStr([site.name, project.name, project.edocsRef, document.name].join(' '), true))
                        {
                            projectObj.documents.push(document);
                        }
                    });
                    projectMatched = (termMatchesStr(project.name + ' ' + project.edocsRef) && termMatchesStr(site.name + ' ' + project.name + ' ' + project.edocsRef, true)) || projectObj.documents.length > 0;
                    if(projectMatched)
                    {
                        if(projectObj.documents.length === 0) projectObj.documents = project.documents;
                        siteObj.projects.push(projectObj);
                    }
                });
                siteMatched = termMatchesStr(site.name, true) || siteObj.projects.length > 0;
                if(siteMatched)
                {
                    if(siteObj.projects.length === 0) siteObj.projects = site.projects;
                    matches.push(siteObj);
                }
            });
            matches.forEach(function(site) {
                var resultDiv = document.createElement('div');
                resultDiv.classList.add(sel('search-result'));
                //do site
                var siteDiv = document.createElement('div');
                siteDiv.classList.add(sel('site'),sel('result-item'));
                var siteTitleDiv = document.createElement('div');
                siteTitleDiv.classList.add(sel('result-item-title'));
                var siteName = document.createElement('div');
                siteName.textContent = site.name;
                siteName.classList.add(sel('site-name'),sel('result-item-name'));
                /*siteName.addEventListener('click', function() {
                    navigate(site.id);
                });*/
                var siteTargetsDiv = document.createElement('div');
                siteTargetsDiv.textContent = 'Site: ';
                siteTargetsDiv.classList.add(sel('result-targets'));
                siteTargets.forEach(function(target) {
                    siteTargetsDiv.appendChild(buildTargetLink(target, site.id));
                });
                siteTitleDiv.appendChild(siteName);
                siteTitleDiv.appendChild(siteTargetsDiv);
                siteDiv.appendChild(siteTitleDiv);
                resultDiv.appendChild(siteDiv);
                //do projects
                if(site.projects.length > 0)
                {
                    var projectsDiv = document.createElement('div');
                    projectsDiv.classList.add(sel('projects'),sel('result-children'));
                    siteDiv.appendChild(projectsDiv);
                    site.projects.forEach(function(project) {
                        var projectDiv = document.createElement('div');
                        projectDiv.classList.add(sel('project'),sel('result-item'));
                        var projectTitleDiv = document.createElement('div');
                        projectTitleDiv.classList.add(sel('result-item-title'));
                        var projectName = document.createElement('div');
                        projectName.textContent = (project.edocsRef ? project.edocsRef + ' : ' : '') + project.name;
                        projectName.classList.add(sel('project-name'),sel('result-item-name'));
                        /*projectName.addEventListener('click', function() {
                            navigate(site.id, project.id);
                        });*/
                        var projectTargetsDiv = document.createElement('div');
                        projectTargetsDiv.textContent = 'Project: ';
                        projectTargetsDiv.classList.add(sel('result-targets'));
                        projectTargets.forEach(function(target) {
                            projectTargetsDiv.appendChild(buildTargetLink(target, site.id, project.id));
                        });
                        projectTitleDiv.appendChild(projectName);
                        projectTitleDiv.appendChild(projectTargetsDiv);
                        projectDiv.appendChild(projectTitleDiv);
                        projectsDiv.appendChild(projectDiv);
                        //do documents
                        if(project.documents.length > 0)
                        {
                            var documentsDiv = document.createElement('div');
                            documentsDiv.classList.add(sel('documents'),sel('result-children'));
                            projectDiv.appendChild(documentsDiv);
                            project.documents.forEach(function(doc) {
                                var documentDiv = document.createElement('div');
                                documentDiv.classList.add(sel('document'),sel('result-item'));
                                var documentTitleDiv = document.createElement('div');
                                documentTitleDiv.classList.add(sel('result-item-title'));
                                var documentName = document.createElement('div');
                                documentName.textContent = doc.name;
                                if(showRecents) documentName.textContent += ' ('+niceDate(doc.activityDate)+' - '+doc.activity+')';
                                documentName.classList.add(sel('document-name'),sel('result-item-name'));
                                /*documentName.addEventListener('click', function() {
                                    navigate(site.id, project.id, doc.id);
                                });*/
                                var docTargetsDiv = document.createElement('div');
                                docTargetsDiv.textContent = 'Document: ';
                                docTargetsDiv.classList.add(sel('result-targets'));
                                docTargets.forEach(function(target) {
                                    docTargetsDiv.appendChild(buildTargetLink(target, site.id, project.id, doc.id));
                                });
                                documentTitleDiv.appendChild(documentName);
                                documentTitleDiv.appendChild(docTargetsDiv);
                                documentDiv.appendChild(documentTitleDiv);
                                documentsDiv.appendChild(documentDiv);
                            });
                        }
                    });
                }
                searchResults.appendChild(resultDiv);
            });
            prevTerm = term;
        }
    }, 500);

    var selPrefix = 'mb6sb-';
    function sel(selector) {
        return selPrefix + selector;
    }

    styleElem = document.createElement('style');
    styleElem.type = 'text/css';
    styleElem.rel = 'stylesheet';
    styleElem.innerHTML = `
        #${sel('launch-elem')} {
            top: 10px;
            right: 10px;
            color: #222;
            padding: 10px;
            cursor: pointer;
            position: fixed;
            background: #CCC;
            z-index: 99;
        }
        #${sel('launch-elem')}:hover {
            background: #EEE;
        }

        #${sel('overlay-elem')} {
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 991;
            display: none;
            position: fixed;
            cursor: pointer;
            background: rgba(20,20,20,0.7);
        }

        #${sel('search-elem')} {
            z-index: 992;
            top: 50%;
            left: 50%;
            color: #222;
            width: 700px;
            height: 400px;
            display: none;
            padding: 10px;
            position: fixed;
            background: #EEE;
            transform: translate(-50%, -50%);
        }
            #${sel('recent-title')} {
                padding: 10px 5px;
            }

        #${sel('search-input')} {
            margin: 5px;
            width: 200px;
            font-size: 12px;
            padding: 5px 8px;
            background: #FFF;
            line-height: 15px;
            border: 1px solid #CCC;
        }
            #${sel('search-elem')}.ready #${sel('search-input')} {
                background: #FFF;
            }

        #${sel('search-results')} {
            line-height: 14px;
            overflow-y: auto;
            font-size: 12px;
            height: 360px;
        }
            #${sel('search-results')} .${sel('search-result')} {
                margin: 5px;
                padding: 5px;
                background: #DDD;
            }
                .${sel('result-item')} {
                }
                    .${sel('result-item-title')} {
                        position: relative;
                    }
                    .${sel('result-item-title')} .${sel('result-targets')} {
                        top: 0;
                        right: 0;
                        bottom: 0;
                        left: 150px;
                        padding: 2px;
                        display: none;
                        font-size: 11px;
                        background: #DDD;
                        line-height: 14px;
                        position: absolute;
                        box-shadow: #DDD -15px 0 20px 5px;
                    }
                    .${sel('result-item-title')}:hover > .${sel('result-targets')} {
                        display: block;
                    }
                        .${sel('result-targets')} .${sel('result-target')} {
                            display: inline-block;
                            padding: 2px 4px;
                            margin: 0 5px;
                        }
                    .${sel('result-item')} .${sel('result-item-name')} {
                        padding: 5px;
                    }
                    .${sel('search-result')} .${sel('result-children')} {
                        margin-left: 15px;
                    }
`;
    document.head.appendChild(styleElem);

    searchElem = document.createElement('div');
    searchElem.id = sel('search-elem');

    searchLogin = document.createElement('div');
    searchLogin.id = sel('search-login');
    searchElem.appendChild(searchLogin);

    searchForm = document.createElement('div');
    searchForm.id = sel('search-form');
    searchElem.appendChild(searchForm);

    searchInput = document.createElement('input');
    searchInput.id = sel('search-input');
    //searchInput.disabled = 'disabled';
    //searchInput.placeholder = '.. waiting ..';
    searchForm.appendChild(searchInput);
    searchInput.addEventListener('blur', doSearch);
    searchInput.addEventListener('keyup', doSearch);

    searchResults = document.createElement('div');
    searchResults.id = sel('search-results');
    searchForm.appendChild(searchResults);

    recentsElem = document.createElement('div');
    recentsElem.id = sel('recents');
    searchElem.appendChild(recentsElem);

    overlayElem = document.createElement('div');
    overlayElem.id = sel('overlay-elem');
    overlayElem.addEventListener('click', function() {
        closeSearch();
    });
    document.addEventListener('keyup', function(e) {
        if(e.keyCode === 27) closeSearch();
    });

    launchElem = document.createElement('div');
    launchElem.id = sel('launch-elem');
    launchElem.textContent = 'Search BETA';
    launchElem.addEventListener('click', openSearch);

    tryDo(function(els) {
        var docItem = els[els.length-1];
        document.body.appendChild(launchElem);
        document.body.appendChild(overlayElem);
        document.body.appendChild(searchElem);
    }, function() {
        var navEls = getEls("#navigation .mainNav > li");
        return navEls.length === 0 ? null : navEls;
    }, 30, 250);

    function getEls(sel) {
        return [].slice.call(document.querySelectorAll(sel));
    }

    function normTerm(str) {
        return (str || '').trim().toLowerCase();
    }

    function tryDo(callback, test, maxTries, timeout) {
        var tries = 0;
        maxTries = maxTries || 10;
        timeout = timeout || 150;
        function testWrap() {
            var testResult = test();
            if (testResult)
            {
                callback(testResult);
            }
            else
            {
                tries++;
                if(tries < maxTries)
                {
                    setTimeout(testWrap, timeout);
                }
            }
        }
        setTimeout(testWrap, timeout);
    }

    function niceDate(dateStr) {
        var date = new Date(dateStr);
        var thisYear = (new Date()).getUTCFullYear();
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        var month = months[date.getUTCMonth()];
        return month.substr(0,3) + ' ' + date.getUTCDate() + (date.getUTCFullYear() !== thisYear ? ' ' + date.getUTCFullYear() : '');
    }

    function throttle(func,time,trailing){var t,r=true;return function(){var c=this,a=arguments;if(r){if(trailing)func.apply(c,a);r=false;t=setTimeout(function(){r=true;if(!trailing)func.apply(c,a);},time);}};}

}, 500);
