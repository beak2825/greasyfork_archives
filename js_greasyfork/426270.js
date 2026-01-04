// ==UserScript==
// @name         JIRA My Transition Button
// @version      1.2
// @description  Add transition buttons for JIRA
// @license MIT
// @author       zhuojun
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require      https://update.greasyfork.org/scripts/383527/701631/Wait_for_key_elements.js
// @grant        GM_xmlhttpRequest
// @match        https://*/secure/RapidBoard.*
// @namespace https://greasyfork.org/users/770429
// @downloadURL https://update.greasyfork.org/scripts/426270/JIRA%20My%20Transition%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/426270/JIRA%20My%20Transition%20Button.meta.js
// ==/UserScript==
var issueUrl = document.location.origin + "/rest/api/latest/issue/"

waitForKeyElements(
    ".ghx-swimlane-header",
    addButtons
)

waitForKeyElements(
    ".ghx-backlog-container",
    addCopyButtons
)

function addCopyButtons(jNode) {
    let sprint = jNode[0]
    let issueList = ''
    const issues = sprint.getElementsByClassName('ghx-issue-content')
    for (const issue of issues) {
        const issueKey = issue.getElementsByClassName('ghx-key')[0].innerText.split('-')[1]
        const summary = issue.getElementsByClassName('ghx-summary')[0].innerText
        issueList += `${issueKey}\t${summary}\n`
    }
    var button = document.createElement('button');
    button.style = "margin-left:2px";
    button.issueList = issueList
    button.setAttribute("class", "aui-button");
    var span = document.createElement('span');
    span.innerText = 'Copy Issues';
    button.appendChild(span);
    button.onclick = function () {
        let input = document.createElement('textarea')
        input.setAttribute('readonly', 'readonly')
        input.value = issueList
        document.body.appendChild(input)
        input.select()
        if (document.execCommand('copy'))
            document.execCommand('copy')
        document.body.removeChild(input)
    }
    jNode[0].getElementsByClassName('ghx-controls aui-group')[0].appendChild(button)
}

function addButtons(jNode) {
    var issuekey = jNode[0].getAttribute("data-issue-key")
    GM_xmlhttpRequest({
        method: 'GET',
        url: issueUrl + issuekey + "/transitions",
        onload: function (res) {
            if (res.status == 200) {
                var text = res.responseText;
                var json = JSON.parse(text);
                json.transitions.forEach(function (transition) {
                    var button = document.createElement('button');
                    button.setAttribute('id', 'test' + issuekey + transition.name);
                    button.setAttribute("class", "aui-button " + issuekey);
                    button.setAttribute('data-issue-key', issuekey);
                    button.setAttribute('transition', transition.name);
                    button.style = "margin-left:2px";
                    var span = document.createElement('span');
                    span.innerText = transition.name;
                    button.appendChild(span);
                    button.onclick = function () {
                        console.log(issuekey + transition.name)
                        window.event.cancelBubble = true;
                        var data = {
                            "transition": {
                                "id": transition.id
                            }
                        };
                        GM_xmlhttpRequest({
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                "Content-Type": "application/json",
                                "User-Agent": "lolol"
                            },
                            url: issueUrl + issuekey + "/transitions",
                            dataType: 'json',
                            contentType: 'application/json',
                            overrideMimeType: 'application/json',
                            data: JSON.stringify(data),
                            onload: function (response) {
                                console.log(response);
                                if (response.status == 204) {
                                    var buttons = jNode[0].getElementsByClassName(issuekey);
                                    while (buttons.length != 0) {
                                        buttons[0].remove();
                                    }
                                    jNode[0].children[0].children[3].children[0].innerText = transition.to.name
                                    addButtons(jNode);
                                    //document.getElementsByClassName("aui-nav-selected")[0].children[0].click()
                                }
                            }
                        })
                    };
                    jNode[0].children[0].appendChild(button)
                })
            }
        }
    })
}
