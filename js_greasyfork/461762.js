// ==UserScript==
// @name         Add copy button to Jira
// @namespace    https://www.atlassian.com/
// @version      1.3
// @description  This will add a copy to clipboard button including markup as HTML
// @author       You
// @match        https://jira.keesing.com:8443/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keesing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461762/Add%20copy%20button%20to%20Jira.user.js
// @updateURL https://update.greasyfork.org/scripts/461762/Add%20copy%20button%20to%20Jira.meta.js
// ==/UserScript==


setTimeout(function() {

    var toolbar = document.getElementsByClassName('aui-toolbar2-primary')[0];

    if (toolbar == undefined)
        return;

    var button = createButton();

    document.getElementsByClassName('aui-toolbar2-primary')[0].appendChild(button);


}, 2000);

function createButton() {
    var ticketID = document.getElementsByName('ajs-issue-key')[0].getAttribute('content');
    var button = document.createElement('a');
    button.classList.add('aui-button');
    button.classList.add('toolbar-trigger');
    button.classList.add('issueaction-workflow-transition');
    button.innerHTML = '<span class="trigger-label">📋</span>'
    button.style.border = 'none';
    button.style.borderRadius = '.25rem';
    button.style.marginLeft = '.5rem';
    button.style.cursor = 'pointer';
    button.id = `jira-id-copy-button-${ticketID}`;
    button.onclick = function() { onButtonClick(button); }
    return button;
}

function onButtonClick(button) {
    var ticketID = document.getElementsByName('ajs-issue-key')[0].getAttribute('content');
    var baseUrl = document.getElementsByName('ajs-base-url')[0].getAttribute('content');

    var titles = document.title.split(' - ');
    var title = '';
    for(var i = 0; i < titles.length-1; i++) {
        if (i > 0)
            title += ' - ';
        title += titles[i];
    }

    console.log(`ID ${ticketID} copied`);
    const type = "text/html";
    const blob = new Blob([`<a href="${baseUrl}/browse/${ticketID}">${title}<a/>`], { type });
    const data = [new ClipboardItem({ [type]: blob })];

    navigator.clipboard.write(data).then(
        () => {
            /* success */
            button.innerHTML = '<span class="trigger-label">✔️</span>';
            setTimeout(function() {
                button.innerHTML = '<span class="trigger-label">📋</span>'
            }, 1000);

        },
        (e) => {
            alert(e);
        }
    );
}

