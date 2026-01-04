// ==UserScript==
// @name         Canvas ChatGPT
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds ChatGPT into Instructure Canvas
// @author       Riley Campbell
// @match        *.instructure.com/*
// @license      https://opensource.org/license/bsd-3-clause/
// @downloadURL https://update.greasyfork.org/scripts/464934/Canvas%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/464934/Canvas%20ChatGPT.meta.js
// ==/UserScript==
(async function() {
    'use strict';
    if (window.location.href.indexOf("instructure.com") !== -1) {
        if (!window.location.href.includes("conversations")) {
            setInterval(function() {
                window.defaultMessage = {
                    "role": "system",
                    "content": localStorage.getItem('AIprompt')
                }
            }, 1000)
            let prompt = localStorage.getItem('AIprompt')
            if (prompt == null) {
                prompt = ''
                localStorage.setItem('AIprompt', '')
            }
            window.defaultMessage = {
                "role": "system",
                "content": prompt
            }
            window.AImessages = [window.defaultMessage]
            window.renderMessages = function() {
                let container = document.getElementById('container')
                container.innerHTML = ''
                for (let i in window.AImessages) {
                    let message = window.AImessages[i]
                    if (message.role == "system") {
                        continue
                    }
                    container.innerHTML += '<table><tr><th><p>' + message.role.charAt(0).toUpperCase() + message.role.slice(1) + ': </p><button onclick="let message=document.querySelectorAll(`th[data-message-id='+"'"+i.toString()+"'"+']`)[0];message.innerHTML=`<textarea style=\'display: block; width: 95%; height: 100px; resize: none; margin-left: auto; margin-right: auto; margin-top:10px;\'>`+message.innerHTML+`</textarea><button onclick='+"'let message=this.parentElement;let text=message.getElementsByTagName(\\`textarea\\`)[0].value;window.AImessages[parseInt(message.getAttribute(\\`data-message-id\\`))].content=text;message.innerHTML=text'"+'>Save</button>`">Edit</button></th><th data-message-id="'+i.toString()+'" style="white-space: break-spaces;">' + message.content + '</th></tr></table><hr class="solid">'
                }
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth'
                });
            }
            window.sendMessage = async function() {
                document.getElementById('container').innerHTML += '<img style="display: block; width: 20px;margin-left: auto; margin-right: auto; margin-bottom:5px;" src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif">'
                let message = {
                    "role": "user",
                    "content": document.getElementById('myTextArea').value
                }
                window.AImessages.push(message)
                document.getElementById('myTextArea').value = ''
                let messages = [window.defaultMessage, message]
                if (document.getElementById('memory').checked) {
                    messages = window.AImessages
                }
                let response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ` + localStorage.getItem('openaiAPIKey')
                    },
                    body: JSON.stringify({
                        "model": localStorage.getItem('AImodel'),
                        "messages": messages,
                        "temperature": 1
                    })
                });
 
                if (response.ok) {
                    let result = await response.json()
                    window.AImessages.push(result.choices[0].message)
                    window.renderMessages()
                } else {
                    document.getElementById('container').innerHTML = `Error ${response.status}: ${response.statusText} <button onclick="document.getElementById('myTextArea').value=window.AImessages.pop().content;window.sendMessage()">Retry</button>`;
                };
            }
            window.populateModels = async function() {
                let supportedModels = ['gpt-4', 'gpt-4-0314', 'gpt-4-32k', 'gpt-4-32k-0314', 'gpt-3.5-turbo', 'gpt-3.5-turbo-0301']
                let response = await fetch('https://api.openai.com/v1/models', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ` + localStorage.getItem('openaiAPIKey')
                    },
                });
                if (!response.ok) {
                    return 0;
                }
                let options = await response.json()
                let item = null
                let element = null
                let models = document.getElementById('models')
                models.innerHTML = ''
                for (let i = 0; i < options.data.length; i++) {
                    item = options.data[i]
                    if (supportedModels.includes(item.id)) {
                        element = document.createElement("option")
                        element.value = item.id
                        element.innerHTML = item.id
                        models.appendChild(element)
                    }
                }
            }
            let elem = document.createElement('div')
            elem.id='chatGPTbox'
            elem.setAttribute('style','margin-left:auto;margin-right:auto;width:95%')
            document.getElementById('wrapper').appendChild(elem)
            document.getElementById('chatGPTbox').innerHTML = `
<style>
    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px
    }
 
    .switch input {
        opacity: 0;
        width: 0;
        height: 0
    }
 
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s
    }
 
    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: #fff;
        -webkit-transition: .4s;
        transition: .4s
    }
 
    input:checked+.slider {
        background-color: #2196F3
    }
 
    input:focus+.slider {
        box-shadow: 0 0 1px #2196F3
    }
 
    input:checked+.slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px)
    }
 
    .slider.round {
        border-radius: 34px
    }
 
    .slider.round:before {
        border-radius: 50%
    }
 
    input[type="checkbox"] {
        display: none;
    }
 
    .wrap-collabsible {
        margin: 1.2rem 0;
    }
 
    .lbl-toggle {
        display: block;
        font-weight: bold;
        font-family: monospace;
        font-size: 1.2rem;
        text-transform: uppercase;
        text-align: center;
        padding: 1rem;
        color: #DDD;
        background: #0069ff;
        cursor: pointer;
        border-radius: 7px;
        transition: all 0.25s ease-out;
    }
 
    .lbl-toggle:hover {
        color: #FFF;
    }
 
    .lbl-toggle::before {
        content: " ";
        display: inline-block;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 5px solid currentColor;
        vertical-align: middle;
        margin-right: .7rem;
        transform: translateY(-2px);
        transition: transform .2s ease-out;
    }
 
    .toggle:checked+.lbl-toggle::before {
        transform: rotate(90deg) translateX(-3px);
    }
 
    .collapsible-content {
        max-height: 0px;
        overflow: hidden;
        transition: max-height .25s ease-in-out;
    }
 
    .toggle:checked+.lbl-toggle+.collapsible-content {
        max-height: 350px;
    }
 
    .toggle:checked+.lbl-toggle {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
    }
 
    .collapsible-content .content-inner {
        background: rgba(0, 105, 255, .2);
        border-bottom: 1px solid rgba(0, 105, 255, .45);
        border-bottom-left-radius: 7px;
        border-bottom-right-radius: 7px;
        padding: .5rem 1rem;
    }
 
    .collapsible-content p {
        margin-bottom: 0;
    }
</style>
<div class="ic-DashboardCard" style="padding:10px; color: ; margin-bottom:10px; width: 100%;margin-left:auto;margin-right:auto;">
    <div width=100% height=650px style="padding:10px;" id="container"></div>
    <textarea style="display: block; width: 95%; height: 100px; resize: none; margin-left: auto; margin-right: auto; margin-top:10px;" id="myTextArea"></textarea>
    <br>
    <button class="Button button-sidebar-wide" id=\'submitButton\' style="display: block; width: 95%;margin-left: auto; margin-right: auto; margin-top: 5px; margin-botton: 5px;">Clear History</button>
    <br>
    <div class="wrap-collabsible">
        <input id="collapsible" class="toggle" type="checkbox">
        <label for="collapsible" class="lbl-toggle">Settings</label>
        <div class="collapsible-content">
            <div class="content-inner">
                <table style="max-height:34px;">
                    <tr style="max-height:34px;">
                        <td>
                            <label style="display:block; max-height:34px;" class="switch">
                                <input id="memory" type="checkbox">
                                <span class="slider round"></span>
                            </label>
                        </td>
                        <td>
                            <label style="display:block;max-height:34px;text-align: center;margin-top:auto;margin-bottom:auto;">Allow AI to remember past messages. (may incur extra charges)</label>
                        </td>
                    </tr>
                </table>
                <br>
                <label for="models">Model:</label>
                <select name="models" id="models"></select>
                <br>
                <textarea style="display: block; width: 95%; height: 100px; resize: none; margin-left: auto; margin-right: auto; margin-top:10px;" placeholder="Default System Prompt (Requires history to be cleared in order to take effect)" id="systemPrompt">` + localStorage.getItem('AIprompt') + `</textarea>
                <br>
                <input id="key" placeholder="API Key" type="text" style="display:block;float:left;"></input>
                <button class="Button button-sidebar-wide" id="setAPIKey" style="display: block;">Set API Key</button>
            </div>
        </div>
    </div>
</div>
        `
            await window.populateModels()
            document.getElementById('models').value = localStorage.getItem('AImodel')
            let checked = (localStorage.getItem('AImemory') === 'true')
            document.getElementById('memory').checked = checked
            setInterval(function() {
                localStorage.setItem('AImemory', document.getElementById('memory').checked)
                localStorage.setItem('AImodel', document.getElementById('models').value)
                localStorage.setItem('AIprompt', document.getElementById('systemPrompt').value)
            }, 1000)
            document.getElementById('submitButton').onclick = async () => {
                window.AImessages = [window.defaultMessage]
                window.renderMessages()
            };
            document.getElementById('setAPIKey').onclick = async () => {
                localStorage.setItem('openaiAPIKey', document.getElementById('key').value)
                document.getElementById('key').value = ''
                await window.populateModels()
            };
            const myTextarea = document.getElementById("myTextArea");
            myTextarea.addEventListener("keydown", async function(event) {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    await window.sendMessage()
                }
            })
        };
    }
})();