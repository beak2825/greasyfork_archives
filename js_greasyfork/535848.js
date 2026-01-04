// ==UserScript==
// @name         Better MWI Chat
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  Make Chat Great Again!
// @author       VoltaX
// @match        https://www.milkywayidle.com/*
// @icon         http://milkywayidle.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535848/Better%20MWI%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/535848/Better%20MWI%20Chat.meta.js
// ==/UserScript==
let Setting = {
};
//let playerUsername = "";
const LoadSetting = () => {
    try{
        Setting = {...Setting, ...JSON.parse(window.localStorage.getItem("better-chat-settings") ?? "{}")};
    }
    catch(e){
        console.error(e);
    }
};
const SaveSetting = () => window.localStorage.setItem("better-chat-settings", JSON.stringify(Setting));
const css = 
`
.mwibetterchat-invisible{
    opacity: 0;
}
.mwibetterchat-disable{
    display: none;
    opacity: 0;
}
.rotate-left{
    transform: rotate(90deg);
}
.rotate-right{
    transform: rotate(-90deg);
}
div.ChatMessage_chatMessage__2wev4[processed]:not([not-modified]){
    display: flex;
    flex-direction: column;
}
div.chat-message-header{
    padding: 0px 3px;
    display: flex;
    flex-direction: row;
}
div.chat-message-header span.timespan{
    display: none;
}
div.chat-message-header:hover span.timespan{
    display: auto;
}
input.Chat_chatInput__16dhX{
    width: 100%;
}
div.chat-message-body{
    border-radius: 10px;
    margin: 3px;
    background: var(--color-space-600);
    padding: 5px 6px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    flex-shrink: 1;
    width: fit-content;
}
div.chat-message-body.mentioned{
    background: var(--color-ocean-400);
}
div.chat-message-line{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: fit-content;
}
img.chat-image{
    margin: 3px 0px;
    display: block;
    max-width: 100%;
    height: auto;
    border-radius: 5px;
}
div.chat-message-body-wrapper{
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    align-items: end;
}
button.repeat-msg-button:hover, div.chat-message-body-wrapper:hover button.repeat-msg-button, div.ChatMessage_chatMessage__2wev4:hover button.repeat-msg-button{
    opacity: 1;
}
button.repeat-msg-button:hover{
    cursor: pointer;
}
button.repeat-msg-button{
    display: inline-block;
    opacity: 0;
    margin: 3px 3px 6px;
    padding: 0px -2px;
    width: 24px;
    height: 24px;
    line-height: 16px;
    font-size: 10px;
    text-wrap: nowrap;
    border-radius: 12px;
    --repeat-button-color: var(--color-ocean-250);
    border: 2px solid var(--repeat-button-color);
    color: var(--repeat-button-color);
    background: rgba(0, 0, 0, 0);
}
button.interact-user-button{
    margin-left: 6px;
    margin-right: -4px;
    width: 24px;
    height: 20px;
    opacity: 0;
    border: 0px none;
    background: none;
}
div.ChatMessage_chatMessage__2wev4:hover button.interact-user-button{
    opacity: 1;
}
button.interact-user-button:hover{
    cursor: pointer;
}
div.input-wrapper{
    flex-grow: 1;
}
button.input-clear-button{
    position: absolute;
    right: 62px;
    top: 4px;
    background: none;
    border: none;
}
button.input-clear-button:hover{
    cursor: pointer;
}
button.scroll-to-bottom{
    position: absolute;
    height: 40px;
    width: 40px;
    border-radius: 20px;
    border: none;
    background: var(--color-market-buy);
    bottom: 40px;
    right: 10px;
    opacity: 1;
    @starting-style{
        opacity: 0;
    }
    transition: 0.3s ease allow-discrete;
}
button.scroll-to-bottom:hover{
    cursor: pointer;
    background: var(--color-market-buy-hover);
    opacity: 1;
}
`;
const html = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html;
    return t.content.firstElementChild;
};
const svg_cross = html(`<svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" height="20px" focusable="false"> <path fill="currentColor" fillRule="evenodd" d="M11.782 4.032a.575.575 0 1 0-.813-.814L7.5 6.687L4.032 3.218a.575.575 0 0 0-.814.814L6.687 7.5l-3.469 3.468a.575.575 0 0 0 .814.814L7.5 8.313l3.469 3.469a.575.575 0 0 0 .813-.814L8.313 7.5z" clipRule="evenodd"/> </svg>`);
const svg_mention = html(`<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 10.35C12.9113 10.35 13.65 11.0887 13.65 12C13.65 12.9113 12.9113 13.65 12 13.65C11.0887 13.65 10.35 12.9113 10.35 12C10.35 11.0887 11.0887 10.35 12 10.35Z" fill="#ffffff"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM6.75 12C6.75 9.1005 9.1005 6.75 12 6.75C14.8995 6.75 17.25 9.1005 17.25 12C17.25 12.6327 17.1384 13.2376 16.9345 13.7973C16.8991 13.8944 16.8295 13.9989 16.7183 14.1015L16.6377 14.1758C16.3369 14.4533 15.8853 14.4888 15.5448 14.2618C15.2981 14.0974 15.15 13.8206 15.15 13.5241V12C15.15 10.2603 13.7397 8.85 12 8.85C10.2603 8.85 8.85 10.2603 8.85 12C8.85 13.7397 10.2603 15.15 12 15.15C12.7017 15.15 13.3499 14.9205 13.8735 14.5325C14.0557 14.9233 14.3431 15.2635 14.7127 15.5099C15.6294 16.121 16.8451 16.0252 17.6548 15.2783L17.7354 15.204C17.9855 14.9732 18.211 14.6756 18.3439 14.3108C18.6069 13.5889 18.75 12.8103 18.75 12C18.75 8.27208 15.7279 5.25 12 5.25C8.27208 5.25 5.25 8.27208 5.25 12C5.25 15.7279 8.27208 18.75 12 18.75C12.4142 18.75 12.75 18.4142 12.75 18C12.75 17.5858 12.4142 17.25 12 17.25C9.1005 17.25 6.75 14.8995 6.75 12Z" fill="#ffffff"/>
</svg>`)
const svg_whisper = html(`<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 13.8153 2.48451 15.5196 3.33127 16.9883C3.50372 17.2874 3.5333 17.6516 3.38777 17.9647L2.53406 19.8016C2.00986 20.7933 2.72736 22 3.86159 22H12C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM9 9C8.44772 9 8 9.44772 8 10C8 10.5523 8.44772 11 9 11H11C11.5523 11 12 10.5523 12 10C12 9.44772 11.5523 9 11 9H9ZM9 13C8.44772 13 8 13.4477 8 14C8 14.5523 8.44772 15 9 15H15C15.5523 15 16 14.5523 16 14C16 13.4477 15.5523 13 15 13H9Z" fill="#ffffff"/> </svg>`);
const svg_arrow_head = html(`<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 5V19M12 19L6 13M12 19L18 13" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> </svg>`)
const InsertStyleSheet = (style) => {
    const s = new CSSStyleSheet();
    s.replaceSync(style);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, s];
};
InsertStyleSheet(css);
const HTML = (tagname, attrs, ...children) => {
    if(attrs === undefined) return document.createTextNode(tagname);
    const ele = document.createElement(tagname);
    let outputFlag = false;
    let outputTarget = null;
    if(attrs) for(const [key, value] of Object.entries(attrs)){
        if(value === null || value === undefined) continue;
        if(key.charAt(0) === "_"){
            const type = key.slice(1);
            ele.addEventListener(type, value);
        }
        else if(key.charAt(0) === "!"){
            outputFlag = key.slice(1);
            if(typeof(value) === "object") outputTarget = value;
        }
        else if(key === "eventListener"){
            for(const listener of value){
                ele.addEventListener(listener.type, listener.listener, listener.options);
            }
        }
        else ele.setAttribute(key, value);
    }
    for(const child of children) if(child) ele.append(child);
    if(outputFlag && outputTarget) outputTarget[outputFlag] = ele;
    return ele;
};
const KeepAtBottom = (chatMsgDiv, always = false) => {
    const contentHeight = chatMsgDiv.getBoundingClientRect().height;
    const parent = chatMsgDiv.parentElement;
    const flag = always || parent.querySelector(":scope > div:nth-last-child(1)") === chatMsgDiv;
    if(flag && (parent.offsetHeight + parent.scrollTop + contentHeight > parent.scrollHeight)) parent.scrollTop = parent.scrollTop + contentHeight;
};
const ProcessChatMessage = () => {
    document.querySelectorAll("div.ChatHistory_chatHistory__1EiG3 > div.ChatMessage_chatMessage__2wev4:not([processed])").forEach(div => {
        div.setAttribute("processed", "");
        const timeSpan = div.children[0];
        const nameSpan = div.querySelector(":scope span.ChatMessage_name__1W9tB.ChatMessage_clickable__58ej2")?.parentElement?.parentElement?.parentElement;
        if(!nameSpan) {
            div.setAttribute("not-modified", "");
            return;
        }
        timeSpan.remove();
        nameSpan.children[0].children[0].children[1].remove();
        const username = nameSpan.querySelector(":scope .CharacterName_name__1amXp")?.dataset?.name ?? "";
        const nameWrapper = HTML("div", {class: "chat-message-header"});
        nameWrapper.replaceChildren(nameSpan);
        const bubble = HTML("div", {class: "chat-message-body-wrapper"});
        const contentWrapper = HTML("div", {class: "chat-message-body"});
        contentWrapper.replaceChildren(...[...div.children].reduce(({newLine, lines}, ele) => {
            // test if content mentions user
            //if(playerUsername && ele.tagName === "SPAN" && ele.innerText.includes(`@${playerUsername}`)) contentWrapper.classList.add("mentioned");
            // replace img link to <img> element
            if(ele.tagName === "A" && ele.type?.includes("image/") || /\.(?:apng|avif|bmp|gif|ico|jpeg|jpg|png|tif|tiff|webp)$/.test(ele.href)){
                lines.push(HTML("div", {class: "chat-message-line"},
                    HTML("img", {class: "chat-image", src: ele.href, _load: () => KeepAtBottom(div, true)})
                ));
                newLine = true;
            }
            else if(newLine) lines.push(HTML("div", {class: "chat-message-line"}, ele));
            else lines.at(-1).append(ele);
            return {newLine, lines};
        }, {newLine: false, lines: [HTML("div", {class: "chat-message-line"})]}).lines);
        const repeatBtn = HTML("button", {class: "repeat-msg-button", _click: () => {
            const contentBuilder = [];
            [...contentWrapper.children].flatMap(line => [...line.children]).forEach(ele => {
                if(ele.tagName === "SPAN") contentBuilder.push(ele.innerText);
                else if(ele.tagName === "A") contentBuilder.push(ele.getAttribute("href"));
                else if(ele.tagName === "IMG") contentBuilder.push(ele.getAttribute("src"));
                else if(ele.tagName === "DIV" && ele.classList.contains("ChatMessage_linkContainer__18Kv3")){
                    const svg = ele.querySelector(':scope svg[aria-label="Skill"]');
                    if(svg) contentBuilder.push(`[${svg.children[0].getAttribute("href").split("#").at(-1)}]`);
                }
            });
            console.log(contentBuilder);
            const input = document.querySelector("input.Chat_chatInput__16dhX");
            const prevVal = input.value;
            input.value = contentBuilder.join("");
            const ev = new Event("input", {bubbles: true});
            ev.simulated = true;
            const tracker = input._valueTracker;
            if(tracker) tracker.setValue(prevVal);
            input.dispatchEvent(ev);
            input.focus();
        }}, "+1");
        if(username){
            const DoMentionOrWhisper = (isMention) => () => {
                const mentionStr = `@${username}`;
                const input = document.querySelector("input.Chat_chatInput__16dhX");
                const prevVal = input.value;
                input.value = isMention ? `${mentionStr} ${prevVal.replaceAll(/@[a-zA-Z0-9]+/g, "")}` : `/w ${username} ${prevVal.replaceAll(/\/w [a-zA-Z0-9]+/g, "")}`;
                const ev = new Event("input", {bubbles: true});
                ev.simulated = true;
                const tracker = input._valueTracker;
                if(tracker) tracker.setValue(prevVal);
                input.dispatchEvent(ev);
            };
            const mentionBtn = HTML("button", {class: "interact-user-button", _click: DoMentionOrWhisper(true)}, svg_mention.cloneNode(true));
            const whisperBtn = HTML("button", {class: "interact-user-button", _click: DoMentionOrWhisper(false)}, svg_whisper.cloneNode(true));
            nameWrapper.append(mentionBtn, whisperBtn);
        }
        bubble.replaceChildren(contentWrapper, repeatBtn);
        div.replaceChildren(nameWrapper, bubble); 
        KeepAtBottom(div);
    })
};
const AddSwitchButton = (chatDiv) => {
    const collapse = chatDiv.querySelector(":scope div.TabsComponent_expandCollapseButton__6nOWk");
    const collapsedupe = collapse.cloneNode(true);
    const arrowSVG = collapsedupe.children[0];
    arrowSVG.classList.add("rotate-left");
    collapsedupe.addEventListener("click", () => {
        collapse.classList.toggle("mwibetterchat-disable");
        arrowSVG.classList.toggle("rotate-left");
        arrowSVG.classList.toggle("rotate-right");
        MoveChatPannel(false);
    })
    collapse.classList.add("mwibetterchat-disable");
    collapse.insertAdjacentElement("afterend", collapsedupe);
};
const AddToBottomButton = (chatDiv) => {
    chatDiv.insertAdjacentElement("beforeend",
        HTML("button", {class: "scroll-to-bottom", _click: () => {
            const chat = document.querySelector("div.TabPanel_tabPanel__tXMJF:not(.TabPanel_hidden__26UM3) div.ChatHistory_chatHistory__1EiG3");
            console.log(chat);
            if(!chat) return;
            chat.scrollTop = 99999;
        }}, svg_arrow_head.cloneNode(true))
    );
};
const AddToBottomButtonListeners = () => {
    const btn = document.querySelector("button.scroll-to-bottom");
    if(!btn) return;
    document.querySelectorAll("div.ChatHistory_chatHistory__1EiG3:not([listening])").forEach(div => {
        div.setAttribute("listening", "");
        div.addEventListener("scroll", (ev) => {
            const t = ev.target;
            const atBottom = t.offsetHeight + t.scrollTop + 25 > t.scrollHeight;
            if(atBottom) btn.classList.add("mwibetterchat-disable");
            else btn.classList.remove("mwibetterchat-disable");
        })
    });
};
const MoveChatPannel = (firstInvoked = true) => {
    const chatDiv = document.querySelector(`div.Chat_chat__3DQkj${firstInvoked?":not([moved])":""}`);
    const characterDiv = document.querySelector(`div.CharacterManagement_characterManagement__2PhvW${firstInvoked?":not([moved])":""}`);
    if(!chatDiv || !characterDiv) return;
    if(firstInvoked){
        AddSwitchButton(chatDiv);
        AddToBottomButton(chatDiv);
    }
    chatDiv.setAttribute("moved", "");
    characterDiv.setAttribute("moved", "");
    const chatWrapper = chatDiv.parentElement;
    characterDiv.replaceWith(chatDiv);
    chatWrapper.replaceChildren(characterDiv);
};
const ModifyChatInput = () => {
    const input = document.querySelector("input.Chat_chatInput__16dhX:not([clear-button-added])");
    if(!input) return;
    input.setAttribute("clear-button-added", "");
    const wrapper = HTML("div", {class: "input-wrapper"});
    const clearBtn = HTML("button", {class: "input-clear-button", _click: () => {
        const prevVal = input.value;
        input.value = ""
        const ev = new Event("input", {bubbles: true});
        ev.simulated = true;
        const tracker = input._valueTracker;
        if(tracker) tracker.setValue(prevVal);
        input.dispatchEvent(ev);
    }}, svg_cross.cloneNode(true));
    input.replaceWith(wrapper);
    wrapper.replaceChildren(input, clearBtn);
};
/*
const UpdateUsername = () => {
    if(!playerUsername){
        const characterInfoDiv = document.querySelector("div.Header_characterInfo__3ixY8");
        const username = characterInfoDiv?.querySelector(":scope div.CharacterName_name__1amXp")?.dataset?.name;
        if(username) playerUsername = username;
    }
};
*/
const OnMutate = (mutlist, observer) => {
    observer.disconnect();
    //UpdateUsername();
    MoveChatPannel();
    ModifyChatInput();
    AddToBottomButtonListeners();
    ProcessChatMessage();
    observer.observe(document, {subtree: true, childList: true});
};
if(window.matchMedia("only screen and (max-width: 1024px)").matches === false) new MutationObserver(OnMutate).observe(document, {subtree: true, childList: true});