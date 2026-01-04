// ==UserScript==
// @name         ECOD-Jira-List-Copier
// @namespace    ecod.jira.list-copy
// @version      1.1.3
// @description  Copy JIRA issues from sprints in one big list
// @author       CRK
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @match        https://jira.fsc.atos-services.net/secure/RapidBoard.jspa?rapidView=2102&projectKey=ECOD&view=planning.nodetail*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487022/ECOD-Jira-List-Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/487022/ECOD-Jira-List-Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hookTheMonkeyForJira() {
        var scriptFunctionCopyList = document.createElement('script');
        scriptFunctionCopyList.innerText = `function copyList(node, $case) {
            let tiles =  node.parentNode.parentNode.parentNode.parentNode.nextElementSibling.querySelectorAll("div[data-issue-key]");
            let listData = [];
            tiles.forEach(function (tile) {
                if(tile.attributes && tile.attributes){
                    let id = tile.attributes['data-issue-key'].value;
                    let issue = '?';
                    let type = '?';
                    let status = '?';
                    let priority = '?';
                    let link = '?';

                    if(tile.childNodes[0] && tile.childNodes[0].attributes && tile.childNodes[0].attributes['aria-label']){
                        issue = tile.childNodes[0].attributes['aria-label'].value;
                    }

                    if(tile.childNodes[1] && tile.childNodes[1].childNodes[0] && tile.childNodes[1].childNodes[0].childNodes[0] && tile.childNodes[1].childNodes[0].childNodes[0].attributes['title']){
                        type = tile.childNodes[1].childNodes[0].childNodes[0].attributes['title'].value;
                    }

                    if(tile.childNodes[1] && tile.childNodes[1].childNodes[0] && tile.childNodes[1].childNodes[0].childNodes[1] && tile.childNodes[1].childNodes[0].childNodes[1].childNodes[0].attributes['title']){
                        priority = tile.childNodes[1].childNodes[0].childNodes[1].childNodes[0].attributes['title'].value;
                    }

                    if(tile.childNodes[1] && tile.childNodes[1].childNodes[0] && tile.childNodes[1].childNodes[0].childNodes[2] && tile.childNodes[1].childNodes[0].childNodes[2].childNodes[0].attributes['href']){
                        link = 'https://jira.fsc.atos-services.net' + tile.childNodes[1].childNodes[0].childNodes[2].childNodes[0].attributes['href'].value;
                    }

                    if(tile.childNodes[1] && tile.childNodes[1].childNodes[1] && tile.childNodes[1].childNodes[1].childNodes[0] && tile.childNodes[1].childNodes[1].childNodes[0].childNodes[0]){
                        status = tile.childNodes[1].childNodes[1].childNodes[0].childNodes[0].innerText;
                    }

                    listData.push({'id': id, 'issue': issue, 'type': type, 'status': status, 'priority': priority, 'link': link});
                }
            });

            listData.sort((a, b) => {
                if (a.type < b.type) return -1;
                if (a.type > b.type) return 1;
                if (a.priority < b.priority) return -1;
                if (a.priority > b.priority) return 1;
                return 0;
            });

            clip = '';

            switch($case){
                case 'simple':
                   listData.forEach((row) => clip += ' - ' + row.issue + '\\r\\n');
                break;
                case 'lines':
                   listData.forEach((row) => clip += '[' + row.type + '] [' + row.priority + '] ' +  row.issue + '\\r\\n');
                break;
                case 'csv':
                   listData.forEach((row) => clip += row.type + ';' + row.priority + ';' +  row.issue + ';' + row.status + ';' + row.link + '\\r\\n');
                break;
                default:
                    listData.forEach((row) => clip += '[' + row.type + '][' + row.priority + ']' +  row.issue + '\\r\\n');

            };

            navigator.clipboard.writeText(_.unescape(clip));
            node.className='monkeyCtlButtons elementToFadeInAndOut';
            setTimeout(
                function(){
                    node.className='monkeyCtlButtons';
                }, 500
            );
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
        .monkeyCtlButtons {
            cursor:pointer;
            background-color: #371cf2;;
            width: auto;
            border-radius: 5px;
            color: white;
            font-size: 12px;
            font-weight: bold;
            padding-top: 2px;
            padding-left: 5px;
            padding-right: 5px;
            padding-bottom: 2px;
            display: inline-block;
        }`;

        document.body.appendChild(scriptFunctionCopyList);
        document.body.appendChild(style);
    }

    function addButtonToNode(node) {
        var copyButton0 = document.createElement('span');
        copyButton0.setAttribute("style" ,"cursor:pointer; display: inline; padding-left: 0px; padding-right: 10px;");
        copyButton0.classList.add('ghx-sprint-info');
        copyButton0.innerHTML = `<span
                                     class='monkeyCtlButtons'
                                     name='copyList'
                                     id='copyList'
                                     onclick='copyList(this, "simple");'
                                     title='Copy list as simple list'>Copy as Simple-list</span>`;

        var copyButton1 = document.createElement('span');
        copyButton1.setAttribute("style" ,"cursor:pointer; display: inline; padding-left: 0px; padding-right: 10px;");
        copyButton1.classList.add('ghx-sprint-info');
        copyButton1.innerHTML = `<span
                                     class='monkeyCtlButtons'
                                     name='copyList'
                                     id='copyList'
                                     onclick='copyList(this, "lines");'
                                     title='Copy list as Detailed List'>Copy as Detailed-list</span>`;

        var copyButton2 = document.createElement('span');
        copyButton2.setAttribute("style" ,"cursor:pointer; display: inline; padding-left: 0px; margin-right:40px;");
        copyButton2.classList.add('ghx-sprint-info');
        copyButton2.innerHTML = `<span
                                     class='monkeyCtlButtons'
                                     name='copyList'
                                     id='copyList'
                                     onclick='copyList(this, "csv");'
                                     title='Copy list as CSV'>Copy as CSV-export</span>`;


        if(node && node.firstChild && node.firstChild.getElementsByClassName('ghx-sprint-info')) {
            let divContainer = document.createElement('div');
            divContainer.appendChild(copyButton0);
            divContainer.appendChild(copyButton1);
            divContainer.appendChild(copyButton2);
            divContainer.setAttribute("style", "margin-left: auto;");
            if(node.firstChild.getElementsByClassName('ghx-sprint-info')[0]){
                node.firstChild.getElementsByClassName('ghx-sprint-info')[0].appendChild(divContainer);
            }
        }
    }

    // Callback function to observe mutations in the DOM
    function handleJiraMutations(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    //console.debug("NODE: ", node.attributes && node.attributes['data-sprint-id']);
                    if (node.attributes && node.attributes['data-sprint-id']) {
                        //console.debug("FOUND: " + node.id);
                        addButtonToNode(node);
                    }
                });
            }
        }
    }

    hookTheMonkeyForJira();
    // Create a new MutationObserver
    var boardObserver = new MutationObserver(handleJiraMutations);

    // Start observing the body for DOM changes
    boardObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

})();