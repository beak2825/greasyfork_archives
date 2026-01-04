// ==UserScript==
// @name         Chat GPT Promt Manager
// @namespace    http://tampermonkey.net/
// @version      2024-01-09
// @description  Promt Manager for ChatGPT with variable support
// @author       Doesn't matter
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484396/Chat%20GPT%20Promt%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/484396/Chat%20GPT%20Promt%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tamper = {}

    tamper.timeout = 0;
    console.log('Promt Manager loaded')

    tamper.prompts = [
        [
            'Sentence Structure',
            'Can you break down the structure of the following Japanese sentence in English and show me all phrase which represents a distinct unit of meaning within the sentence: "{Sentence}"?'
        ]
    ]

    tamper.observ = () =>{
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const Promt_Manager = document.querySelector('.Promt_Manager');
                    if (Promt_Manager == null) {
                        clearTimeout(tamper.timeout);
                        tamper.timeout = setTimeout(() => {
                            tamper.build();
                        }, 100);
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    tamper.build = () =>{
        const main = document.querySelector('#prompt-textarea');
        if (!main) return;
        const frame = document.createElement("div"); frame.className = 'Promt_Manager';

        const promts = document.createElement("div"); promts.className = 'Promts';
        frame.appendChild(promts);
        tamper.prompts.forEach((data)=>{
            const promt = document.createElement("button"); promt.className = 'Promt';
            promt.innerText = data[0]
            promt.onclick = ()=>{tamper.openVariableBoxes(data[1])};
            promts.appendChild(promt);
        })

        tamper.extra = document.createElement("div"); tamper.extra.className = 'Extra';
        frame.appendChild(tamper.extra);

        main.parentElement.parentElement.parentElement.parentElement.parentElement.before(frame);
        tamper.applyCSS();

        document.querySelector('button[data-testid="send-button"]').onclick = () =>{
            tamper.extra.innerHTML = '';
        }
    }

    tamper.openVariableBoxes = (text) => {
        tamper.extra.innerHTML = '';
        tamper.extraData = [];
        tamper.extraBase = text;

        text.match(/{(.*?)}/g).forEach((data, index)=>{
            tamper.extraData[index] = data.substring(1,data.length -1);
            const extra = document.createElement("input"); extra.className = 'Extras';
            extra.placeholder = data.substring(1,data.length -1);
            $(extra).on("change keyup paste", (value) =>{
                tamper.updateExtra(value, index)
            })
            tamper.extra.appendChild(extra);
        });

        tamper.writeToChat(
            tamper.formatString(tamper.extraBase,tamper.extraData)
        );
        document.querySelector('.Extras').focus();
    }

    tamper.updateExtra = (value, index) =>{
        tamper.extraData[index] = value.target.value;
        tamper.writeToChat(
            tamper.formatString(tamper.extraBase,tamper.extraData)
        );
        if (value.keyCode == 13){
            document.querySelector('button[data-testid="send-button"]').click();
        }
    }

    tamper.writeToChat = (text)=>{
        var area = document.querySelector('#prompt-textarea')
        area.value = text;
        area.dispatchEvent(new Event('input', { bubbles: true }))
    }

    tamper.formatString = (template, args) => {
        var ret = template;
        template.match(/{(.*?)}/g).forEach((data, index)=>{
            ret = ret.replace(data, args[index]);
        })
        return ret
    }

    tamper.applyCSS = () => { var el = document.createElement('style');
                             el.type = 'text/css';
                             el.innerText = `
.Promt_Manager {
    background-color: #343541;
    border-radius: 7px;
    width: calc(100% - 0.5rem);
    margin-left: auto;
    margin-right: auto;
    max-width: 42rem;
}
.Promts {
    display: flex;
    justify-content: center;
}
.Promt {
    background-color: #343541;
    border: 1px solid grey;
    border-radius: 7px;
    margin: 3px;
    padding: 1px 6px;
}
.Extras{
    border-radius: 5px;
    margin: 10px 0;
    border: 0.1px solid #8e8ea0;
    width: 99%;
    padding-left: 10px;
}
.Promt:hover {
    background-color: #34355D
}
        `;
                             document.head.appendChild(el);
                            }


    tamper.observ();
})();