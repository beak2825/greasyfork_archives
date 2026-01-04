// ==UserScript==
// @name         ECOD-JiraHelper-Copier
// @namespace    ecod.jira.copier
// @version      2.1.3
// @description  Jira ID + Title copy to clipboad feature with various formats. (Note: Jira View Workflow does not work with this extension)
// @author       CRK
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @match        https://*jira.fsc.atos-services.net/browse/*
// @match        https://jira.fsc.atos-services.net/secure/RapidBoard.jspa?rapidView=2102&projectKey=ECOD&view=planning*
// @match        https://*jira.fsc.atos-services.net/projects/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486133/ECOD-JiraHelper-Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/486133/ECOD-JiraHelper-Copier.meta.js
// ==/UserScript==

(function() {
    /* eslint-disable no-implicit-globals */
    const GLOBAL_URL = window.location.href;
    async function fetchGitLabMerges(currentURL) {
        let idReg = /ecod-\d+/i;
        let match = currentURL.match(idReg);
        if (match) {
            let gitLabApiUrl = 'https://gitlab.ecodesigncloud.com/api/v4/merge_requests?scope=all&state=all&search=' + match[0];
            console.debug(gitLabApiUrl);
            fetch(gitLabApiUrl, {
                method: "GET",
                mode: "cors",
                cache: "no-cache",
                credentials: "include"
            }).then((response) => {
                if (!response.ok) {
                    console.error('HTTP error!', response);
                    document.querySelector("#mrDone").style.visibility = "hidden";
                    document.querySelector("#mrMerged").style.visibility = "hidden";
                    document.querySelector("#mrClosed").style.visibility = "hidden";
                }

                return response.json();
            }).then((data) => {
                let mrd = 0;
                let mrm = 0;
                let mrc = 0;
                data.forEach(mr => {
                    if(mr.closed_at === null && mr.merged_at === null) mrd++;
                    if(mr.closed_at !== null) mrc++;
                    if(mr.merged_at !== null) mrm++;
                });

                document.querySelector("#mrDone") ? document.querySelector("#mrDone").innerHTML = mrd : undefined;
                document.querySelector("#mrMerged") ? document.querySelector("#mrMerged").innerHTML = mrm : undefined;
                document.querySelector("#mrClosed") ? document.querySelector("#mrClosed").innerHTML = mrc : undefined;
                document.querySelector("#mrDone").classList.toggle("nonZero", mrd>0);
                document.querySelector("#mrMerged").classList.toggle("nonZero", mrm>0);
                document.querySelector("#mrClosed").classList.toggle("nonZero", mrc>0);
            }).catch(error => {
                console.error('HTTP error!', error);
                document.querySelector("#mrDone").style.visibility = "hidden";
                document.querySelector("#mrMerged").style.visibility = "hidden";
                document.querySelector("#mrClosed").style.visibility = "hidden";
            });
        }
    }

    function hookTheJiraMonkey() {
        var copyIdButton = document.createElement('li');
        copyIdButton.innerHTML = `<span class='monkeyListButtons'
                                       style='cursor:pointer; background-color: darkcyan; width: 20px;'
                                       id='copyId'
                                       name='copyId'
                                       onclick='copyToClipboard(this, "id");'
                                       title='Copy ID'>ID</span>`;

        var copyToClipboardButton = document.createElement('li');
        copyToClipboardButton.innerHTML = `<span class='monkeyListButtons'
                                        style='cursor:pointer; background-color: darkcyan; width: 25px;'
                                        id='copyToClipboard'
                                        name='copyToClipboard'
                                        onclick='copyToClipboard(this);'
                                        title='Copy ID + Title!'>ID+</span>`;

        var copyToClipboard4BranchButton = document.createElement('li');
        copyToClipboard4BranchButton.innerHTML = `<span class='monkeyListButtons'
                                               style='cursor:pointer; background-color: #2e81ff;'
                                               id='copyToClipboard4Branch'
                                               name='copyToClipboard4Branch'
                                               onclick='copyToClipboard(this, "branch");'
                                               title='Copy ID + Title (branch)'>Branch</span>`;

        var copyToClipboard4CommitButton = document.createElement('li');
        copyToClipboard4CommitButton.innerHTML = `<span class='monkeyListButtons'
                                               style='cursor:pointer; background-color: #2e81ff;'
                                               id='copyToClipboard4Commit'
                                               name='copyToClipboard4Commit'
                                               onclick='copyToClipboard(this, "commit");'
                                               title='Copy ID + Title (branch)'>Commit</span>`;

        var copyToClipboard4MergeButton = document.createElement('li');
        copyToClipboard4MergeButton.innerHTML = `<span class='monkeyListButtons'
                                            style='cursor:pointer; background-color: #2e81ff;'
                                            id='copyToClipboard4Git'
                                            name='copyToClipboard4Git'
                                            onclick='copyToClipboard(this, "merge");'
                                            title='Copy ID + Title (GIT)'>Merge</span>`;
        var gotoGitLabButton = document.createElement('li');
        gotoGitLabButton.innerHTML = `<span
                                           class='monkeyListButtons'
                                           style='cursor:pointer; background-color: #be06e4; width: 60px;'
                                           name='gotoGitLab'
                                           id='gotoGitLab'
                                           onclick='goToUrl(this);'
                                           title='Go to Gitlab Merge request'>Goto MR</span>`;

        var shareLinkButton = document.createElement('li');
        shareLinkButton.innerHTML = `<span
                                           class='monkeyListButtons'
                                           style='cursor:pointer; background-color: #04a104; width: 30px; padding: 7px;'
                                           name='shareLink'
                                           id='shareLink'
                                           onclick='copyToClipboard(this, "share");'
                                           title='Sharable link'><span class="icon aui-icon aui-icon-small aui-iconfont-share"></span></span>`;

        var mrDone = document.createElement('li');
        mrDone.innerHTML = `<span
                                           class='monkeyListDisplays'
                                           style='border-color: cyan;'
                                           name='mrDone'
                                           id='mrDone'
                                           title='MR Done'>0</span>`;

        var mrMerged = document.createElement('li');
        mrMerged.innerHTML = `<span
                                           class='monkeyListDisplays'
                                           style='border-color: greenyellow;'
                                           name='mrMerged'
                                           id='mrMerged'
                                           title='MR Merged'>0</span>`;

        var mrClosed = document.createElement('li');
        mrClosed.innerHTML = `<span
                                           class='monkeyListDisplays'
                                           style='border-color: red;'
                                           name='mrClosed'
                                           id='mrClosed'
                                           title='MR Closed'>0</span>`;

        var scriptFunctioncopyToClipboard = document.createElement('script');
        scriptFunctioncopyToClipboard.innerText = `
        function copyToClipboard(el, option) {
            let id = document?.querySelector("a[id='key-val']")?.innerHTML?.trim() ?? 'unknown';
            let parentId = document?.querySelector("a[id='parent_issue_summary']")?.getAttribute('data-issue-key') ?? 'unknown';
            if(id === 'unknown'){
                id = el?.parentNode?.parentNode?.parentNode?.querySelector("[class='ghx-key js-view-in-jira']")?.innerText ?? 'unknown';
            }
            id = _.deburr(_.unescape(id.trim()));
            parentId = _.deburr(_.unescape(parentId.trim()));

            let text4Clipboard = id;

            if(option !== 'id') {
                let title = document?.querySelector("h2[id='summary-val']")?.innerHTML?.trim()?.split('<span')[0] ?? 'unknown';
                if(title === 'unknown'){
                    title = document.querySelector("#summary-val h2")?.innerText ?? 'unknown';
                }
                title = _.deburr(_.unescape(title.trim()));

                text4Clipboard += ' ' + title;

                if(['branch', 'commit', 'merge'].includes(option)) {
                    let type = document.querySelector("span[id='type-val']")?.innerHTML?.trim()?.split('<span')[0]?.split('">')[1]?.trim() ?? 'unknown';
                    let typeBranch = 'feature';

                    switch (type) {
                        case 'Task':
                        case 'Story':
                            type = 'feat';
                            typeBranch = 'feature';
                            break;
                        case 'Bug':
                            type = 'fix';
                            typeBranch = 'bugfix';
                            break;
                        default:
                            type = 'feat';
                            break;
                    };

                    if(option === 'branch') {
                        text4Clipboard = typeBranch + '/' + id.toLowerCase() + '_' + title.replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase().replace(/_+$/, '');
                    }

                    if(option === 'commit') {
                        text4Clipboard = type + '(' + id.toLowerCase() + ')' + ': ' + title.replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase().replace(/_+$/, '');
                    }

                    if(option === 'merge') {
                        text4Clipboard = type + '(' + (parentId !== 'unknown' ? (parentId.toLowerCase() + '|') : '') + id.toLowerCase() + ')' + ': ' + title;
                    }
                }

                if(option === 'share') {
                        let linkText = id.toUpperCase() + ' ' + title.trim();
                        let linkUrl = 'https://jira.fsc.atos-services.net/browse/' + id.toUpperCase();
                        text4Clipboard = '[' + linkText + ']( ' + linkUrl + ' )';
                }
            }

            navigator.clipboard.writeText(text4Clipboard);
            el.className='monkeyListButtons elementToFadeInAndOut';
            setTimeout(
                function(){
                    el.className='monkeyListButtons';
                }, 500
            );
    }

    function goToUrl(el){
    	let baseUrl = 'https://gitlab.ecodesigncloud.com/groups/ecodesign/-/merge_requests?scope=all&state=all&search=';
        let id = document?.querySelector("a[id='key-val']")?.innerHTML?.trim() ?? 'unknown';
        if(id === 'unknown'){
            id = el?.parentNode?.parentNode?.parentNode?.querySelector("[class='ghx-key js-view-in-jira']")?.innerText?.trim() ?? 'unknown';
        }
        if(id !== 'unknown'){
    	    window.open(baseUrl + id, '_blank');
        } else {
            el.style.backgroundColor = 'gray';
        }
    }`;

        var style = document.createElement('style');
        style.innerText = `
        .elementToFadeInAndOut {
            animation: fadeInOut 0.5s linear forwards;
        }
        @keyframes fadeInOut {
            0% { opacity:0; }
            50% { opacity:0.5; }
            100% { opacity:1; }
        }
        .monkeyListButtons {
            display: inline-flex;
            border-radius: 5px;
            padding: 5px;
            color:white;
            font-weight:normal;
            border:0px;
            font-size:14px;
            width: 50px;
            justify-content: center;
            margin-left: 10px;
        }
        .monkeyListDisplays {
            display: inline-flex;
            padding: 5px;
            color:white;
            font-weight: normal;
            font-size:14px;
            justify-content: center;
            margin-left: 10px;
            width: 20px;
            border:3px;
            border-style: groove;
            border-radius: 10px;
            height: 15px;
        }
        .nonZero {
            font-weight: bold;
        }
        .monkeyListButtons:hover {
            font-weight:bold;
        }`;

        document.body.appendChild(scriptFunctioncopyToClipboard);
        document.body.appendChild(style);

        let node = document.querySelector('#create-menu')
        if(node) {
            node.parentNode.appendChild(copyIdButton);
            node.parentNode.appendChild(copyToClipboardButton);
            node.parentNode.appendChild(copyToClipboard4BranchButton);
            node.parentNode.appendChild(copyToClipboard4CommitButton);
            node.parentNode.appendChild(copyToClipboard4MergeButton);
            node.parentNode.appendChild(gotoGitLabButton);
            node.parentNode.appendChild(shareLinkButton);
            node.parentNode.appendChild(mrDone);
            node.parentNode.appendChild(mrMerged);
            node.parentNode.appendChild(mrClosed);
            fetchGitLabMerges(GLOBAL_URL);
        }
    }

    function debounce(func, delay) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }

    const debouncedHookTheJiraMonkey = debounce(function() {
        hookTheJiraMonkey();
        // Callback function to observe mutations in the DOM
        function handleDomMutations(mutationsList, observer) {
            if(GLOBAL_URL !== window.location.href && fetchGitLabMerges){
                console.debug("GLOBAL_URL = " + window.location.href);
                GLOBAL_URL = window.location.href;
                fetchGitLabMerges(GLOBAL_URL);
            }
        }

        // Create a new MutationObserver
        var domObserver = new MutationObserver(handleDomMutations);

        // Start observing the body for DOM changes
        domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }, 1000);

    debouncedHookTheJiraMonkey();

})();