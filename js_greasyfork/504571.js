// ==UserScript==
// @name         MrMenu
// @version      1.38
// @description  Best Manager bonk.io
// @author       MrBonkeiro
// @namespace    https://greasyfork.org/en/scripts/504571-mrmenu
// @match        https://bonk.io/
// @match        https://bonk.io/*
// @match        https://bonkisback.io/*
// @match        https://multiplayer.gg/physics/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @grant        none
// @unwrap
// @namespace https://greasyfork.org/users/1355760
// @downloadURL https://update.greasyfork.org/scripts/504571/MrMenu.user.js
// @updateURL https://update.greasyfork.org/scripts/504571/MrMenu.meta.js
// ==/UserScript==

function ScriptInjector(f)
{
    if (window.location.href == `https://bonk.io/gameframe-release.html`)
    {
        if (document.readyState == 'complete'){ setTimeout(f, 300); }
        else
        { document.addEventListener('readystatechange', function () { setTimeout(f, 1500); }); }
    }
}

function addCSS(ID, cssString, replace = false)
{
    let styleElement = document.getElementById(ID);

    if (styleElement) {
        if (replace) {
            styleElement.innerHTML = cssString;
        } else {
            styleElement.innerHTML += `\n${cssString}`;
        }
    } else {
        styleElement = document.createElement('style');
        styleElement.id = ID;
        styleElement.innerHTML = cssString;
        document.head.appendChild(styleElement);
    }
}

function addHTML(htmlString, selector, beforeSelector = null)
{
    const targetElement = document.querySelector(selector);
    if (!targetElement) { return; }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const newElements = Array.from(doc.body.childNodes);

    if (beforeSelector) {
        const beforeElement = document.querySelector(beforeSelector);
        if (!beforeElement) { return; }
        newElements.forEach(node => {
            beforeElement.parentNode.insertBefore(node, beforeElement);
        });
    } else {
        newElements.forEach(node => {
            targetElement.appendChild(node);
        });
    }
}

let bonkWSS;
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

let UI =
    {
        main: `
    <div id="MrMenuUI">
        <div id="Mrtitlebar">
            <label>MrMenu by MrBonkeiro v1.38</label>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position:absolute; top:10px; right:10px; cursor:pointer;"> <line x1="18" y1="6" x2="6" y2="18">
                </line> <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </div>
        <div id="MrArea">
            <div id="Mrsidebar">
                <button data-tab="tab1">Host Manager</button>
                <button data-tab="tab2">XP Involker</button>
                <button data-tab="tab3">Chat Manager</button>
                <button data-tab="tab4">IP Logger</button>
                <button>Settings</button>
                <button data-tab="report">Report</button>
            </div>
            <div id="Mrcontent">
            </div>
        </div>
    </div>`,
        tab:
        {
            tab1:
            `<div data-tab="tab1">
                <div class="row">
                   <div class="info">
                      <label>Freejoin</label>
                      <p>When you are a host and activated, players can join without restarting the room</p>
                   </div>
                   <div class="action">
                      <button>Enable</button>
                      <button class="active">Disable</button>
                   </div>
                </div>
                <div class="row">
                   <div class="info">
                      <label>Freejoin - Guest</label>
                      <p>When you are a host and activated, players can join without restarting the room</p>
                   </div>
                   <div class="action">
                      <button>YES</button>
                      <button class="active">NO</button>
                   </div>
                </div>
                <div class="row">
                   <div class="info">
                      <label>Room Search</label>
                      <p>Search room name using searchbox</p>
                   </div>
                   <div class="action">
                      <button id="MrHostSearchRoomE">YES</button>
                      <button class="active" id="MrHostSearchRoomD">NO</button>
                   </div>
                </div>
              </div>`,
            tab2:
            `<div data-tab="tab2">
                <div class="row">
                   <div class="info">
                      <label>XP Farm</label>
                      <p>When you are in a match and enabled, you start with +100 XP</p>
                   </div>
                   <div class="action">
                      <button id="MrXPE">Enable</button>
                      <button id="MrXPD" class="active">Disable</button>
                   </div>
                </div>
                <div class="row">
                   <div class="info">
                      <label>Delay: <span id="MrMenuXPDelayms">18500 ms</span></label>
                      <p>Defines an interval in milliseconds if 'Farm XP' is activated</p>
                   </div>
                   <div class="action">
                      <input type="range" min="7000" max="30000" value="18500" step="500" id="MrMenuXPinputRangeDelay">
                   </div>
                </div>
            </div>`,
            tab3:
            `<div data-tab="tab3">
                <div class="row">
                   <div class="info">
                      <label>FullScreen</label>
                      <p>Define bonk.io fullscreen</p>
                   </div>
                   <div class="action">
                      <button id="MrFullScreen">toggle</button>
                   </div>
                </div>
                <div class="row">
                   <div class="info">
                      <label>Chat ingame visibility</label>
                      <p>Activate/deactivate chat in a match.</p>
                   </div>
                   <div class="action">
                      <button id="MrChatVisibilyE" class="active">Enable</button>
                      <button id="MrChatVisibilyD">Disable</button>
                   </div>
                </div>
                <div class="row">
                   <div class="info">
                      <label>Chat Position</label>
                      <p>Activate/deactivate chat in a match.</p>
                   </div>
                   <div class="action" style="flex-direction: row-reverse;">
                      <select id="MrChatPositionV">
                         <option value="top">Top</option>
                         <option value="bottom" selected>Bottom</option>
                      </select>
                      <select id="MrChatPositionH">
                         <option value="left" selected>Left</option>
                         <option value="right">Right</option>
                      </select>
                   </div>
                </div>
                <div class="row">
                   <div class="info">
                      <label>Chat Color</label>
                      <p>Activate/deactivate chat in a match.</p>
                   </div>
                   <div class="action" style="flex-direction: row-reverse;">
                      <div id="MrChatBgColorbg" style="border-radius:50%; height:40px; width: 40px;background-color:red; border: 1px solid #cccc; margin-left: 5px;"></div>
                      <div id="MrChatBgColorFont" style="border-radius:50%; height:40px; width: 40px;background-color:white; border: 1px solid #cccc;"></div>
                      <input type="color" style="visibility: hidden;" id="MrChatBgColorbgbase">
                      <input type="color" style="visibility: hidden;" id="MrChatBgColorFontbase">
                   </div>
                </div>
                <div class="row">
                   <div class="info">
                      <label>Transparency</label>
                      <p>Set in-game chat background transparency</p>
                   </div>
                   <div class="action">
                      <input type="range" min="0" max="100" value="100" step="1" id="MrChattransparency">
                   </div>
                </div>
                <div class="row">
                   <div class="info">
                      <label>Links in chat game</label>
                      <p>Enable link support in the chat.</p>
                   </div>
                   <div class="action">
                      <button id="MrChatLinkE">Enable</button>
                      <button class="active" id="MrChatLinkD">Disable</button>
                   </div>
                </div>
                <div class="row">
                   <div class="info">
                      <label>Emoji</label>
                      <p>Enable Emoji support in the chat.</p>
                   </div>
                   <div class="action">
                      <button id="MrChatEmojiE">Enable</button>
                      <button class="active" id="MrChatEmojiD">Disable</button>
                   </div>
                </div>
            </div>`,
        },
    }

let UICSS =
    `
@import url('https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400..700;1,400..700&display=swap');

#MrMenuUI
{
    display: flex;
    position: absolute;
    flex-direction: column;
    top: 50%;
    left: 50%;
    width: calc(95% - 50px);
    height: calc(95% - 50px);
    transform: translate(-50%, -50%);
    user-select: none;
    box-sizing: border-box;
    font-family: 'Arimo';
    background-color: #1f1f1f;
    color: white;
    border: 1px solid #cccc;
    border-radius: 15px;
}

#MrMenuUI > #Mrtitlebar
{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 44px;
    border-bottom: 1px solid #cccc;
}

#MrMenuUI > #MrArea
{
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100% - 44px);
    box-sizing: border-box;
}

#MrMenuUI > #MrArea > #Mrsidebar
{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 250px;
    height: 100%;
    border-radius: 0px 0px 0px 15px;
    border-right: 1px solid #cccc;
    padding: 5px;
    box-sizing: border-box;

}

#MrMenuUI > #MrArea > #Mrsidebar > button
{
    outline: none;
    height: 40px;
    width: 220px;
    background-color: #1f1f1f;
    color: white;
    border: none;
    font-size: 13px;
    margin-top: 12px;
}

#MrMenuUI > #MrArea > #Mrsidebar > button:hover
{
    background-color: #333;
}

#MrMenuUI > #MrArea > #Mrsidebar > button.active
{
    background-color: #2A51F4;
    border-radius: 7px;
}

#MrMenuUI > #MrArea > #Mrcontent
{

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: calc(100% - 250px);;
    height: 100%;
    border-radius: 0px 0px 15px 0px;
    padding: 5px;
    box-sizing: border-box;
}

#MrMenuUI > #MrArea > #Mrcontent > div
{
    display: none;
    //background-color: #272626;
    margin: 15px;
    width: calc(100% - 16px);
    height: 100%;
    box-sizing: border-box;
    overflow-x: auto;
}

#MrMenuUI > #MrArea > #Mrcontent > div.active
{
    display: block;
}

#MrMenuUI > #MrArea > #Mrcontent > div > div.row
{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

#MrMenuUI > #MrArea > #Mrcontent > div > div.row:not(last-child)
{
    margin-bottom: 14px;
}
#MrMenuUI > #MrArea > #Mrcontent > div > div.row > div.info
{
    display: flex;
    flex-direction: column;
    width: 55%;
}

#MrMenuUI > #MrArea > #Mrcontent > div > div.row > div.action
{
    display: flex;
    flex-direction: row;
    width: 45%;
}

#MrMenuUI > #MrArea > #Mrcontent > div > div.row > div.info > label
{
    font-size: 17px;
    font-weight: bold;
}

#MrMenuUI > #MrArea > #Mrcontent > div > div.row > div.info > p
{
    font-size: 13px;
    color: #C1C1C1;
}

#MrMenuUI > #MrArea > #Mrcontent > div > div.row > div:has(button:nth-of-type(2)) button
{
    background-color: #333333;
    outline: none;
    color: white;
    width: 45%;
    height: 40px;
    border: 1px solid #434343;
    margin: 3px;
    border-radius: 5px;
}

#MrMenuUI > #MrArea > #Mrcontent > div > div.row > div:has(button:nth-of-type(1)) button
{
    background-color: #333333;
    outline: none;
    color: white;
    width: 100%;
    height: 40px;
    border: 1px solid #434343;
    margin: 3px;
    border-radius: 5px;
}


#MrMenuUI > #MrArea > #Mrcontent > div > div.row > div:has(button:nth-of-type(2)) button.active
{
    background-color: #2A51F4;
}

#MrMenuUI > #MrArea > #Mrcontent > div > div.row > div > input[type="range"]
{
    appearance: none;
    width: 100%;
    padding: 10px; border-radius: 6px;
    border: 1px solid #555;
    background-color: #333;
    transition: background-color 0.3s,
    border-color 0.3s;
}

#MrMenuUI > #MrArea > #Mrcontent > div > div.row > div:has(select:nth-of-type(2)) select
{
    background-color: #333333;
    outline: none;
    color: white;
    width: 100%;
    height: 40px;
    border: 1px solid #434343;
    margin: 3px;
    border-radius: 5px;
    text-align: center;
}


`;



/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


function EventUItoggleMenu()
{
    const menu = document.querySelector('div#MrMenuUI');
    const visible = window.getComputedStyle(menu).visibility === 'visible';

    menu.style.visibility = visible ? 'hidden' : 'visible';
    menu.style.opacity = visible ? '0' : '1';
    menu.style.zIndex = visible ? '-100' : '100';
}

function EventUItoggleEmoji()
{
    const menu = document.querySelector('div#Mremoji-container');
    const visible = window.getComputedStyle(menu).visibility === 'visible';

    menu.style.visibility = visible ? 'hidden' : 'visible';
    menu.style.opacity = visible ? '0' : '1';
    menu.style.zIndex = visible ? '-100' : '100';
}

function EventUIsidebar(event)
{
    if (event.target.tagName === 'BUTTON')
    {
        const dataTab = event.target.getAttribute('data-tab');
        if (dataTab == 'report')
        {
            window.open(`https://greasyfork.org/en/scripts/504571-mrmenu/feedback`, '_blank');
            return;
        }

        document.querySelectorAll("div#MrMenuUI > div#MrArea > div#Mrcontent > div[data-tab]").forEach(item => {
            item.classList.remove('active');
        });

        const activeItem = document.querySelector(`div#MrMenuUI > div#MrArea > div#Mrcontent > div[data-tab="${dataTab}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        document.querySelectorAll("div#MrMenuUI > div#MrArea > div#Mrsidebar > button").forEach(item => {
            item.classList.remove('active');
        });
        event.target.classList.add('active')
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


function linkifyText(text)
{
    const urlPattern = /(?:https?:\/\/)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/gi;
    const matches = text.match(urlPattern);

    if (!matches) {
        return null;
    }

    let modifiedText = matches.map(match => {
        let url = match.startsWith('http://') || match.startsWith('https://') ? match : 'http://' + match;
        return `<a href="${url}" target="_blank">${url}</a>`;
    }).join(' ');

    return `<span>${modifiedText}</span>`;
}

function packet(args)
{
    return ({data:args});
};

function getPlay()
{
    return document.getElementById("gamerenderer").style["visibility"] !== "hidden";
}

function updateCSSRule(s, p, v)
{
    let sheets = [...document.styleSheets];
    let ruleExists = false;

    sheets.forEach(sheet => {
        let rules = [...sheet.cssRules];
        rules.forEach(r => {
            if (r.selectorText === s) {
                r.style.setProperty(p, v, 'important');
                ruleExists = true;
            }
        });
    });

    if (!ruleExists) {
        sheets[0].insertRule(`${s} { ${p}: ${v} !important; }`, sheets[0].cssRules.length);
    }
}

function ActionFreejoin(nick, guest, ID)
{
    if(window.MrMenu.data.flags.freejoin && window.MrMenu.data.HostID !== null)
    {
        if(window.MrMenu.data.ID == window.MrMenu.data.HostID && getPlay() == true)
        {
            bonkWSS.send(`42[18,` + ID + `,1]`);
            bonkWSS.onmessage(packet(`42[18,` + ID + `,1]`));

            setTimeout(function()
                       {
                document.getElementById("newbonklobby_editorbutton").click();
                document.getElementById("mapeditor_close").click();
                document.getElementById("newbonklobby").style["display"] = "none";
                document.getElementById("newbonklobby").style["opacity"] = "0";
                document.getElementById("mapeditor_midbox_testbutton").click();
            }, 166);
        }
    }
}

let intervalXP = null;

function ActionXP(event)
{
    try
    {
        if (event.readyState !== WebSocket.CLOSING && event.readyState !== WebSocket.CLOSED)
        {

            if(window.MrMenu.data.flags.xp == true && getPlay() == true && bonkWSS !== null)
            {
                bonkWSS.send(`42[38]`);
            }
        }
    }
    catch(error) { }
}

function ActionXPclick(event)
{
    if(event.target.id == 'MrXPE')
    {
        window.MrMenu.data.flags.xp = true;
        intervalXP = setInterval(() => { ActionXP(event); }, document.getElementById(`MrMenuXPinputRangeDelay`).value );
        document.getElementById('xpbarfill').style.backgroundColor = `#44bd32`;
    }

    if(event.target.id == 'MrXPD')
    {
        window.MrMenu.data.flags.xp = false;
        clearInterval(intervalXP);
        intervalXP = null;
        document.getElementById('xpbarfill').style.backgroundColor = `#473aaf`;
    }
}

function ActionXPRange(event)
{
    document.getElementById(`MrMenuXPDelayms`).innerHTML = event.target.value + " ms";
    document.getElementById(`MrXPE`).classList.remove('active');
    document.getElementById(`MrXPD`).classList.add('active');
    window.MrMenu.data.flags.xp = false;
    clearInterval(intervalXP);
    intervalXP = null;
    document.getElementById('xpbarfill').style.backgroundColor = `#473aaf`;
}


function ActionChatVisibility(event)
{
    if(event.target.id == 'MrChatVisibilyE')
    {
        document.getElementById('ingamechatcontent').style.visibility = ``;
    }

    if(event.target.id == 'MrChatVisibilyD')
    {
        document.getElementById('ingamechatcontent').style.visibility = `hidden`;
    }
}

function ActionChatPosition(event)
{
    const chatBox = document.getElementById('ingamechatbox');

    if(event.target.id == 'MrChatPositionV')
    {

        if (event.target.value == 'top')
        {
            chatBox.style.top = `50px`;
            chatBox.style.bottom = `auto`;
        }
        else if (event.target.value == 'bottom')
        {
            chatBox.style.top = `auto`;
            chatBox.style.bottom = `50px`;
        }
    }

    if(event.target.id == 'MrChatPositionH')
    {
        if (event.target.value == 'left')
        {
            chatBox.style.left = `10px`;
            chatBox.style.right = `auto`;
        }
        else if (event.target.value == 'right')
        {
            chatBox.style.left = `auto`;
            chatBox.style.right = `10px`;
        }
    }

}

function ActionChatColor(event)
{
    let color;
    if(event.target.id == 'MrChatBgColorbg')
    {
        color = document.getElementById('MrChatBgColorbgbase');
        color.click();
    }
    if(event.target.id == 'MrChatBgColorFont')
    {
        color = document.getElementById('MrChatBgColorFontbase');
        color.click();
    }

}

const hexToRGBA = (hex, alpha) => {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function ActionChatColorFinal(event)
{

    if(event.target.id == 'MrChatBgColorbgbase')
    {
        if (event.target.value)
        {
            const color = document.getElementById('MrChatBgColorbgbase').value;
            const transparency = document.getElementById('MrChattransparency').value / 100;
            const rgbaColor = hexToRGBA(color, transparency)

            updateCSSRule('#ingamechatbox', 'background-color', rgbaColor);
        }
    }
    if(event.target.id == 'MrChatBgColorFontbase')
    {
        if (event.target.value)
        {
            const color = event.target.value;
            const transparency = document.getElementById('MrChattransparency').value / 100;
            const rgbaColor = hexToRGBA(color, transparency)

            updateCSSRule('.ingamechatname', 'color', rgbaColor);
        }
    }
}


function ActionChatransparency(event)
{
    if (event.target.value)
    {
        const color = document.getElementById('MrChatBgColorbgbase').value;
        const transparency = event.target.value / 100;
        const rgbaColor = hexToRGBA(color, transparency)

        updateCSSRule('#ingamechatbox', 'background-color', rgbaColor);
    }
}

function ActionChatNicks() {
    const chatContainer = document.querySelector('#newbonklobby_chat_content');
    
    if (!chatContainer) return; // Garante que o container do chat existe

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Verifica se é um nó do tipo elemento
                    // Seleciona diretamente os últimos 3 elementos
                    const recentMessages = chatContainer.querySelectorAll('div:nth-last-child(-n+3)');

                    recentMessages.forEach((msgNode) => {
                        const nameSpan = msgNode.querySelector('span.newbonklobby_chat_msg_name');
                        if (nameSpan && nameSpan.innerHTML.includes('MrBonkeiro') && !nameSpan.classList.contains('MrBonkeiro')) {
                            nameSpan.classList.add('MrBonkeiro');
                        }
                    });
                }
            });
        });
    });

    observer.observe(chatContainer, { childList: true });
}

function ActionChatUrls()
{
    let urlskMr = setInterval(() => {
        let msgLast = document.querySelectorAll(`#newbonklobby_chat_content > div:nth-last-child(-n+3) > span.newbonklobby_chat_msg_txt`);

        const urlPattern = /(?:https?:\/\/|www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g;

        msgLast.forEach(msg => {
            if (!msg.innerHTML.includes('<a')) {
                msg.innerHTML = msg.innerHTML.replace(urlPattern, (url) => {
                    let href = url.startsWith('http') ? url : `http://${url}`;
                    return `<a href="${href}" target="_blank">${url}</a>`;
                });
            }
        });
        clearInterval(urlskMr);
    }, 8);
}

function ActionChatremoveEmoji()
{
    const emojiContainer = document.querySelector('#newbonklobby_chatbox > div.emoji-container');
    const emojiContainer2 = document.querySelector('#newbonklobby_chat_input > div.emoji-container');
    if (emojiContainer) { emojiContainer.remove(); }
    if (emojiContainer2) { emojiContainer2.remove(); }
}

function ActionChataddEmoji()
{
    let emojifiles = [
        "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😶‍🌫️", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "😵‍💫", "🤯", "🤠", "🥳", "🥸", "😎", "🤓", "🧐", "😕", "🫤", "😟", "🙁", "☹️", "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹", "👺", "👻", "👽", "👾", "🤖", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🙈", "🙉", "🙊", "💋", "💌", "💘", "💝", "💖", "💗", "💓", "💞", "💕", "💟", "❣️", "💔", "❤️‍🔥", "❤️‍🩹", "❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍", "💯", "💢", "💥", "💫", "💦", "💨", "🕳️", "💣", "💬", "👁️‍🗨️", "🗨️", "🗯️", "💭", "💤",,
        "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🦷", "🦴", "👀", "👁️", "👅", "👄", "👶", "🧒", "👦", "👧", "🧑", "👱", "👨", "🧔", "🧔‍♂️", "🧔‍♀️", "👨‍🦰", "👨‍🦱", "👨‍🦳", "👨‍🦲", "👩", "👩‍🦰", "🧑‍🦰", "👩‍🦱", "🧑‍🦱", "👩‍🦳", "🧑‍🦳", "👩‍🦲", "🧑‍🦲", "👱‍♀️", "👱‍♂️", "🧓", "👴", "👵", "🙍", "🙍‍♂️", "🙍‍♀️", "🙎", "🙎‍♂️", "🙎‍♀️", "🙅", "🙅‍♂️", "🙅‍♀️", "🙆", "🙆‍♂️", "🙆‍♀️", "💁", "💁‍♂️", "💁‍♀️", "🙋", "🙋‍♂️", "🙋‍♀️", "🧏", "🧏‍♂️", "🧏‍♀️", "🙇", "🙇‍♂️", "🙇‍♀️", "🤦", "🤦‍♂️", "🤦‍♀️", "🤷", "🤷‍♂️", "🤷‍♀️", "🧑‍⚕️", "👨‍⚕️", "👩‍⚕️", "🧑‍🎓", "👨‍🎓", "👩‍🎓", "🧑‍🏫", "👨‍🏫", "👩‍🏫", "🧑‍⚖️", "👨‍⚖️", "👩‍⚖️", "🧑‍🌾", "👨‍🌾", "👩‍🌾", "🧑‍🍳", "👨‍🍳", "👩‍🍳", "🧑‍🔧", "👨‍🔧", "👩‍🔧", "🧑‍🏭", "👨‍🏭", "👩‍🏭", "🧑‍💼", "👨‍💼", "👩‍💼", "🧑‍🔬", "👨‍🔬", "👩‍🔬", "🧑‍💻", "👨‍💻", "👩‍💻", "🧑‍🎤", "👨‍🎤", "👩‍🎤", "🧑‍🎨", "👨‍🎨", "👩‍🎨", "🧑‍✈️", "👨‍✈️", "👩‍✈️", "🧑‍🚀", "👨‍🚀", "👩‍🚀", "🧑‍🚒", "👨‍🚒", "👩‍🚒", "👮", "👮‍♂️", "👮‍♀️", "🕵️", "🕵️‍♂️", "🕵️‍♀️", "💂", "💂‍♂️", "💂‍♀️", "👷", "👷‍♂️", "👷‍♀️", "🤴", "👸", "👳", "👳‍♂️", "👳‍♀️", "👲", "🧕", "🤵", "🤵‍♂️", "🤵‍♀️", "👰", "👰‍♂️", "👰‍♀️", "🤰", "🤱", "👩‍🍼", "👨‍🍼", "🧑‍🍼", "👼", "🎅", "🤶", "🧑‍🎄", "🦸", "🦸‍♂️", "🦸‍♀️", "🦹", "🦹‍♂️", "🦹‍♀️", "🧙", "🧙‍♂️", "🧙‍♀️", "🧚", "🧚‍♂️", "🧚‍♀️", "🧛", "🧛‍♂️", "🧛‍♀️", "🧜", "🧜‍♂️", "🧜‍♀️", "🧝", "🧝‍♂️", "🧝‍♀️", "🧞", "🧞‍♂️", "🧞‍♀️", "🧟", "🧟‍♂️", "🧟‍♀️", "💆", "💆‍♂️", "💆‍♀️", "💇", "💇‍♂️", "💇‍♀️", "🚶", "🚶‍♂️", "🚶‍♀️", "🧍", "🧍‍♂️", "🧍‍♀️", "🧎", "🧎‍♂️", "🧎‍♀️", "🧑‍🦯", "👨‍🦯", "👩‍🦯", "🧑‍🦼", "👨‍🦼", "👩‍🦼", "🧑‍🦽", "👨‍🦽", "👩‍🦽", "🏃", "🏃‍♂️", "🏃‍♀️", "💃", "🕺", "🕴️", "👯", "👯‍♂️", "👯‍♀️", "🧖", "🧖‍♂️", "🧖‍♀️", "🧗", "🧗‍♂️", "🧗‍♀️", "🤺", "🏇", "⛷️", "🏂", "🏌️", "🏌️‍♂️", "🏌️‍♀️", "🏄", "🏄‍♂️", "🏄‍♀️", "🚣", "🚣‍♂️", "🚣‍♀️", "🏊", "🏊‍♂️", "🏊‍♀️", "⛹️", "⛹️‍♂️", "⛹️‍♀️", "🏋️", "🏋️‍♂️", "🏋️‍♀️", "🚴", "🚴‍♂️", "🚴‍♀️", "🚵", "🚵‍♂️", "🚵‍♀️", "🤸", "🤸‍♂️", "🤸‍♀️", "🤼", "🤼‍♂️", "🤼‍♀️", "🤽", "🤽‍♂️", "🤽‍♀️", "🤾", "🤾‍♂️", "🤾‍♀️", "🤹", "🤹‍♂️", "🤹‍♀️", "🧘", "🧘‍♂️", "🧘‍♀️", "🛀", "🛌", "🧑‍🤝‍🧑", "👭", "👫", "👬", "💏", "👩‍❤️‍💋‍👨", "👨‍❤️‍💋‍👨", "👩‍❤️‍💋‍👩", "💑", "👩‍❤️‍👨", "👨‍❤️‍👨", "👩‍❤️‍👩", "👪", "👨‍👩‍👦", "👨‍👩‍👧", "👨‍👩‍👧‍👦", "👨‍👩‍👦‍👦", "👨‍👩‍👧‍👧", "👨‍👨‍👦", "👨‍👨‍👧", "👨‍👨‍👧‍👦", "👨‍👨‍👦‍👦", "👨‍👨‍👧‍👧", "👩‍👩‍👦", "👩‍👩‍👧", "👩‍👩‍👧‍👦", "👩‍👩‍👦‍👦", "👩‍👩‍👧‍👧", "👨‍👦", "👨‍👦‍👦", "👨‍👧", "👨‍👧‍👦", "👨‍👧‍👧", "👩‍👦", "👩‍👦‍👦", "👩‍👧", "👩‍👧‍👦", "👩‍👧‍👧", "🗣️", "👤", "👥", "🫂", "👣", "🦰", "🦱", "🦳", "🦲",
        "🐵", "🐒", "🦍", "🦧", "🐶", "🐕", "🦮", "🐕‍🦺", "🐩", "🐺", "🦊", "🦝", "🐱", "🐈", "🐈‍⬛", "🦁", "🐯", "🐅", "🐆", "🐴", "🐎", "🦄", "🦓", "🦌", "🐮", "🐂", "🐃", "🐄", "🐷", "🐖", "🐗", "🐽", "🐏", "🐑", "🐐", "🐪", "🐫", "🦙", "🦒", "🐘", "🦏", "🦛", "🐭", "🐁", "🐀", "🐹", "🐰", "🐇", "🐿️", "🦔", "🦇", "🐻", "🐻‍❄️", "🐨", "🐼", "🦥", "🦦", "🦨", "🦘", "🦡", "🐾", "🦃", "🐔", "🐓", "🐣", "🐤", "🐥", "🐦", "🐧", "🕊️", "🦅", "🦆", "🦢", "🦉", "🦩", "🦚", "🦜", "🐸", "🐊", "🐢", "🦎", "🐍", "🐲", "🐉", "🦕", "🦖", "🐳", "🐋", "🐬", "🐟", "🐠", "🐡", "🦈", "🐙", "🐚", "🐌", "🦋", "🐛", "🐜", "🐝", "🐞", "🦗", "🕷️", "🕸️", "🦂", "🦟", "🦠", "💐", "🌸", "💮", "🏵️", "🌹", "🥀", "🌺", "🌻", "🌼", "🌷", "🌱", "🌲", "🌳", "🌴", "🌵", "🌾", "🌿", "☘️", "🍀", "🍁", "🍂", "🍃",
        "🍇", "🍈", "🍉", "🍊", "🍋", "🍌", "🍍", "🥭", "🍎", "🍏", "🍐", "🍑", "🍒", "🍓", "🥝", "🍅", "🥥", "🥑", "🍆", "🥔", "🥕", "🌽", "🌶️", "🥒", "🥬", "🥦", "🧄", "🧅", "🍄", "🥜", "🌰", "🍞", "🥐", "🥖", "🥨", "🥯", "🥞", "🧇", "🧀", "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🥙", "🧆", "🥚", "🍳", "🥘", "🍲", "🥣", "🥗", "🍿", "🧈", "🧂", "🥫", "🍱", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍠", "🍢", "🍣", "🍤", "🍥", "🥮", "🍡", "🥟", "🥠", "🥡", "🦀", "🦞", "🦐", "🦑", "🦪", "🍦", "🍧", "🍨", "🍩", "🍪", "🎂", "🍰", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼", "🥛", "☕", "🍵", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻", "🥂", "🥃", "🥤", "🧃", "🧉", "🧊", "🥢", "🍽️", "🍴", "🥄", "🔪", "🏺",
        "🌍", "🌎", "🌏", "🌐", "🗺️", "🗾", "🧭", "🏔️", "⛰️", "🌋", "🗻", "🏕️", "🏖️", "🏜️", "🏝️", "🏞️", "🏟️", "🏛️", "🏗️", "🧱", "🏘️", "🏚️", "🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭", "🏯", "🏰", "💒", "🗼", "🗽", "⛪", "🕌", "🛕", "🕍", "⛩️", "🕋", "⛲", "⛺", "🌁", "🌃", "🏙️", "🌄", "🌅", "🌆", "🌇", "🌉", "♨️", "🎠", "🎡", "🎢", "💈", "🎪", "🚂", "🚃", "🚄", "🚅", "🚆", "🚇", "🚈", "🚉", "🚊", "🚝", "🚞", "🚋", "🚌", "🚍", "🚎", "🚐", "🚑", "🚒", "🚓", "🚔", "🚕", "🚖", "🚗", "🚘", "🚙", "🚚", "🚛", "🚜", "🏎️", "🏍️", "🛵", "🦽", "🦼", "🛺", "🚲", "🛴", "🛹", "🚏", "🛣️", "🛤️", "🛢️", "⛽", "🚨", "🚥", "🚦", "🛑", "🚧", "⚓", "⛵", "🛶", "🚤", "🛳️", "⛴️", "🛥️", "🚢", "✈️", "🛩️", "🛫", "🛬", "🪂", "💺", "🚁", "🚟", "🚠", "🚡", "🛰️", "🚀", "🛸", "🛎️", "🧳", "⌛", "⏳", "⌚", "⏰", "⏱️", "⏲️", "🕰️", "🕛", "🕧", "🕐", "🕜", "🕑", "🕝", "🕒", "🕞", "🕓", "🕟", "🕔", "🕠", "🕕", "🕡", "🕖", "🕢", "🕗", "🕣", "🕘", "🕤", "🕙", "🕥", "🕚", "🕦", "🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌙", "🌚", "🌛", "🌜", "🌡️", "☀️", "🌝", "🌞", "🪐", "⭐", "🌟", "🌠", "🌌", "☁️", "⛅", "⛈️", "🌤️", "🌥️", "🌦️", "🌧️", "🌨️", "🌩️", "🌪️", "🌫️", "🌬️", "🌀", "🌈", "🌂", "☂️", "☔", "⛱️", "⚡", "❄️", "☃️", "⛄", "☄️", "🔥", "💧", "🌊",
        "🎃", "🎄", "🎆", "🎇", "🧨", "✨", "🎈", "🎉", "🎊", "🎋", "🎍", "🎎", "🎏", "🎐", "🎑", "🧧", "🎀", "🎁", "🎗️", "🎟️", "🎫", "🎖️", "🏆", "🏅", "🥇", "🥈", "🥉", "⚽", "⚾", "🥎", "🏀", "🏐", "🏈", "🏉", "🎾", "🥏", "🎳", "🏏", "🏑", "🏒", "🥍", "🏓", "🏸", "🥊", "🥋", "🥅", "⛳", "⛸️", "🎣", "🤿", "🎽", "🎿", "🛷", "🥌", "🎯", "🪀", "🪁", "🎱", "🔮", "🧿", "🎮", "🕹️", "🎰", "🎲", "🧩", "🧸", "♠️", "♥️", "♦️", "♣️", "♟️", "🃏", "🀄", "🎴", "🎭", "🖼️", "🎨", "🧵", "🪡", "🧶",
        "👓", "🕶️", "🥽", "🥼", "🦺", "👔", "👕", "👖", "🧣", "🧤", "🧥", "🧦", "👗", "👘", "🥻", "🩱", "🩲", "🩳", "👙", "👚", "👛", "👜", "👝", "🛍️", "🎒", "👞", "👟", "🥾", "🥿", "👠", "👡", "🩰", "👢", "👑", "👒", "🎩", "🎓", "🧢", "⛑️", "📿", "💄", "💍", "💎", "🔇", "🔈", "🔉", "🔊", "📢", "📣", "📯", "🔔", "🔕", "🎼", "🎵", "🎶", "🎙️", "🎚️", "🎛️", "🎤", "🎧", "📻", "🎷", "🎸", "🎹", "🎺", "🎻", "🪕", "🥁", "📱", "📲", "☎️", "📞", "📟", "📠", "🔋", "🔌", "💻", "🖥️", "🖨️", "⌨️", "🖱️", "🖲️", "💽", "💾", "💿", "📀", "🧮", "🎥", "🎞️", "📽️", "🎬", "📺", "📷", "📸", "📹", "📼", "🔍", "🔎", "🕯️", "💡", "🔦", "🏮", "🪔", "📔", "📕", "📖", "📗", "📘", "📙", "📚", "📓", "📒", "📃", "📜", "📄", "📰", "🗞️", "📑", "🔖", "🏷️", "💰", "💴", "💵", "💶", "💷", "💸", "💳", "🧾", "💹", "✉️", "📧", "📨", "📩", "📤", "📥", "📦", "📫", "📪", "📬", "📭", "📮", "🗳️", "✏️", "✒️", "🖋️", "🖊️", "🖌️", "🖍️", "📝", "💼", "📁", "📂", "🗂️", "📅", "📆", "🗒️", "🗓️", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇️", "📏", "📐", "✂️", "🗃️", "🗄️", "🗑️", "🔒", "🔓", "🔏", "🔐", "🔑", "🗝️", "🔨", "🪓", "⛏️", "⚒️", "🛠️", "🗡️", "⚔️", "🔫", "🏹", "🛡️", "🔧", "🔩", "⚙️", "🗜️", "⚖️", "🦯", "🔗", "⛓️", "🧰", "🧲", "⚗️", "🧪", "🧫", "🧬", "🔬", "🔭", "📡", "💉", "🩸", "💊", "🩹", "🩺", "🚪", "🛏️", "🛋️", "🪑", "🚽", "🚿", "🛁", "🪒", "🧴", "🧷", "🧹", "🧺", "🧻", "🧼", "🧽", "🧯", "🛒", "🚬", "⚰️", "⚱️", "🗿",
        "🏧", "🚮", "🚰", "♿", "🚹", "🚺", "🚻", "🚼", "🚾", "🛂", "🛃", "🛄", "🛅", "⚠️", "🚸", "⛔", "🚫", "🚳", "🚭", "🚯", "🚱", "🚷", "📵", "🔞", "☢️", "☣️", "⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️", "↕️", "↔️", "↩️", "↪️", "⤴️", "⤵️", "🔃", "🔄", "🔙", "🔚", "🔛", "🔜", "🔝", "🛐", "⚛️", "🕉️", "✡️", "☸️", "☯️", "✝️", "☦️", "☪️", "☮️", "🕎", "🔯", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "⛎", "🔀", "🔁", "🔂", "▶️", "⏩", "⏭️", "⏯️", "◀️", "⏪", "⏮️", "🔼", "⏫", "🔽", "⏬", "⏸️", "⏹️", "⏺️", "⏏️", "🎦", "🔅", "🔆", "📶", "📳", "📴", "♀️", "♂️", "⚧️", "✖️", "➕", "➖", "➗", "🟰", "♾️", "‼️", "⁉️", "❓", "❔", "❕", "❗", "〰️", "💱", "💲", "⚕️", "♻️", "⚜️", "🔱", "📛", "🔰", "⭕", "✅", "☑️", "✔️", "❌", "❎", "➰", "➿", "〽️", "✳️", "✴️", "❇️", "©️", "®️", "™️", "#️⃣", "*️⃣", "0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🔠", "🔡", "🔢", "🔣", "🔤", "🅰️", "🆎", "🅱️", "🆑", "🆒", "🆓", "ℹ️", "🆔", "Ⓜ️", "🆕", "🆖", "🅾️", "🆗", "🅿️", "🆘", "🆙", "🆚", "🈁", "🈂️", "🈷️", "🈶", "🈯", "🉐", "🈹", "🈚", "🈲", "🉑", "🈸", "🈴", "🈳", "㊗️", "㊙️", "🈺", "🈵", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "🟤", "⚫", "⚪", "🟥", "🟧", "🟨", "🟩", "🟦", "🟪", "🟫", "⬛", "⬜", "◼️", "◻️", "◾", "◽", "▪️", "▫️", "🔶", "🔷", "🔸", "🔹", "🔺", "🔻", "💠", "🔘", "🔳", "🔲",
        "🏁", "🚩", "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏳️‍⚧️", "🏴‍☠️", "🇦🇨", "🇦🇩", "🇦🇪", "🇦🇫", "🇦🇬", "🇦🇮", "🇦🇱", "🇦🇲", "🇦🇴", "🇦🇶", "🇦🇷", "🇦🇸", "🇦🇹", "🇦🇺", "🇦🇼", "🇦🇽", "🇦🇿", "🇧🇦", "🇧🇧", "🇧🇩", "🇧🇪", "🇧🇫", "🇧🇬", "🇧🇭", "🇧🇮", "🇧🇯", "🇧🇱", "🇧🇲", "🇧🇳", "🇧🇴", "🇧🇶", "🇧🇷", "🇧🇸", "🇧🇹", "🇧🇻", "🇧🇼", "🇧🇾", "🇧🇿", "🇨🇦", "🇨🇨", "🇨🇩", "🇨🇫", "🇨🇬", "🇨🇭", "🇨🇮", "🇨🇰", "🇨🇱", "🇨🇲", "🇨🇳", "🇨🇴", "🇨🇵", "🇨🇷", "🇨🇺", "🇨🇻", "🇨🇼", "🇨🇽", "🇨🇾", "🇨🇿", "🇩🇪", "🇩🇬", "🇩🇯", "🇩🇰", "🇩🇲", "🇩🇴", "🇩🇿", "🇪🇦", "🇪🇨", "🇪🇪", "🇪🇬", "🇪🇭", "🇪🇷", "🇪🇸", "🇪🇹", "🇪🇺", "🇫🇮", "🇫🇯", "🇫🇰", "🇫🇲", "🇫🇴", "🇫🇷", "🇬🇦", "🇬🇧", "🇬🇩", "🇬🇪", "🇬🇫", "🇬🇬", "🇬🇭", "🇬🇮", "🇬🇱", "🇬🇲", "🇬🇳", "🇬🇵", "🇬🇶", "🇬🇷", "🇬🇸", "🇬🇹", "🇬🇺", "🇬🇼", "🇬🇾", "🇭🇰", "🇭🇲", "🇭🇳", "🇭🇷", "🇭🇹", "🇭🇺", "🇮🇨", "🇮🇩", "🇮🇪", "🇮🇱", "🇮🇲", "🇮🇳", "🇮🇴", "🇮🇶", "🇮🇷", "🇮🇸", "🇮🇹", "🇯🇪", "🇯🇲", "🇯🇴", "🇯🇵", "🇰🇪", "🇰🇬", "🇰🇭", "🇰🇮", "🇰🇲", "🇰🇳", "🇰🇵", "🇰🇷", "🇰🇼", "🇰🇾", "🇰🇿", "🇱🇦", "🇱🇧", "🇱🇨", "🇱🇮", "🇱🇰", "🇱🇷", "🇱🇸", "🇱🇹", "🇱🇺", "🇱🇻", "🇱🇾", "🇲🇦", "🇲🇨", "🇲🇩", "🇲🇪", "🇲🇫", "🇲🇬", "🇲🇭", "🇲🇰", "🇲🇱", "🇲🇲", "🇲🇳", "🇲🇴", "🇲🇵", "🇲🇶", "🇲🇷", "🇲🇸", "🇲🇹", "🇲🇺", "🇲🇻", "🇲🇼", "🇲🇽", "🇲🇾", "🇲🇿", "🇳🇦", "🇳🇨", "🇳🇪", "🇳🇫", "🇳🇬", "🇳🇮", "🇳🇱", "🇳🇴", "🇳🇵", "🇳🇷", "🇳🇺", "🇳🇿", "🇴🇲", "🇵🇦", "🇵🇪", "🇵🇫", "🇵🇬", "🇵🇭", "🇵🇰", "🇵🇱", "🇵🇲", "🇵🇳", "🇵🇷", "🇵🇸", "🇵🇹", "🇵🇼", "🇵🇾", "🇶🇦", "🇷🇪", "🇷🇴", "🇷🇸", "🇷🇺", "🇷🇼", "🇸🇦", "🇸🇧", "🇸🇨", "🇸🇩", "🇸🇪", "🇸🇬", "🇸🇭", "🇸🇮", "🇸🇯", "🇸🇰", "🇸🇱", "🇸🇲", "🇸🇳", "🇸🇴", "🇸🇷", "🇸🇸", "🇸🇹", "🇸🇻", "🇸🇽", "🇸🇾", "🇸🇿", "🇹🇦", "🇹🇨", "🇹🇩", "🇹🇫", "🇹🇬", "🇹🇭", "🇹🇯", "🇹🇰", "🇹🇱", "🇹🇲", "🇹🇳", "🇹🇴", "🇹🇷", "🇹🇹", "🇹🇻", "🇹🇼", "🇹🇿", "🇺🇦", "🇺🇬", "🇺🇲", "🇺🇳", "🇺🇸", "🇺🇾", "🇺🇿", "🇻🇦", "🇻🇨", "🇻🇪", "🇻🇬", "🇻🇮", "🇻🇳", "🇻🇺", "🇼🇫", "🇼🇸", "🇽🇰", "🇾🇪", "🇹🇿", "🇦🇿", "🇲🇿", "🇼🇿", "🏴", "🏴", "🏴",
        '👋🏻', '👋🏼', '👋🏽', '👋🏾', '👋🏿', '🤚🏻', '🤚🏼', '🤚🏽', '🤚🏾', '🤚🏿', '🖐🏻', '🖐🏼', '🖐🏽', '🖐🏾', '🖐🏿', '✋🏻', '✋🏼', '✋🏽', '✋🏾', '✋🏿', '🖖🏻', '🖖🏼', '🖖🏽', '🖖🏾', '🖖🏿', '👌🏻', '👌🏼', '👌🏽', '👌🏾', '👌🏿', '🤏🏻', '🤏🏼', '🤏🏽', '🤏🏾', '🤏🏿', '✌🏻', '✌🏼', '✌🏽', '✌🏾', '✌🏿', '🤞🏻', '🤞🏼', '🤞🏽', '🤞🏾', '🤞🏿', '🤟🏻', '🤟🏼', '🤟🏽', '🤟🏾', '🤟🏿', '🤘🏻', '🤘🏼', '🤘🏽', '🤘🏾', '🤘🏿', '🤙🏻', '🤙🏼', '🤙🏽', '🤙🏾', '🤙🏿', '👈🏻', '👈🏼', '👈🏽', '👈🏾', '👈🏿', '👉🏻', '👉🏼', '👉🏽', '👉🏾', '👉🏿', '👆🏻', '👆🏼', '👆🏽', '👆🏾', '👆🏿', '🖕🏻', '🖕🏼', '🖕🏽', '🖕🏾', '🖕🏿', '👇🏻', '👇🏼', '👇🏽', '👇🏾', '👇🏿', '☝🏻', '☝🏼', '☝🏽', '☝🏾', '☝🏿', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿', '👎🏻', '👎🏼', '👎🏽', '👎🏾', '👎🏿', '✊🏻', '✊🏼', '✊🏽', '✊🏾', '✊🏿', '👊🏻', '👊🏼', '👊🏽', '👊🏾', '👊🏿', '🤛🏻', '🤛🏼', '🤛🏽', '🤛🏾', '🤛🏿', '🤜🏻', '🤜🏼', '🤜🏽', '🤜🏾', '🤜🏿', '👏🏻', '👏🏼', '👏🏽', '👏🏾', '👏🏿', '🙌🏻', '🙌🏼', '🙌🏽', '🙌🏾', '🙌🏿', '👐🏻', '👐🏼', '👐🏽', '👐🏾', '👐🏿', '🤲🏻', '🤲🏼', '🤲🏽', '🤲🏾', '🤲🏿', '🤝🏻', '🤝🏼', '🤝🏽', '🤝🏾', '🤝🏿', '🙏🏻', '🙏🏼', '🙏🏽', '🙏🏾', '🙏🏿', '✍🏻', '✍🏼', '✍🏽', '✍🏾', '✍🏿', '💅🏻', '💅🏼', '💅🏽', '💅🏾', '💅🏿', '🤳🏻', '🤳🏼', '🤳🏽', '🤳🏾', '🤳🏿', '💪🏻', '💪🏼', '💪🏽', '💪🏾', '💪🏿', '🦵🏻', '🦵🏼', '🦵🏽', '🦵🏾', '🦵🏿', '🦶🏻', '🦶🏼', '🦶🏽', '🦶🏾', '🦶🏿', '👂🏻', '👂🏼', '👂🏽', '👂🏾', '👂🏿', '🦻🏻', '🦻🏼', '🦻🏽', '🦻🏾', '🦻🏿', '👃🏻', '👃🏼', '👃🏽', '👃🏾', '👃🏿', '👶🏻', '👶🏼', '👶🏽', '👶🏾', '👶🏿', '🧒🏻', '🧒🏼', '🧒🏽', '🧒🏾', '🧒🏿', '👦🏻', '👦🏼', '👦🏽', '👦🏾', '👦🏿', '👧🏻', '👧🏼', '👧🏽', '👧🏾', '👧🏿', '🧑🏻', '🧑🏼', '🧑🏽', '🧑🏾', '🧑🏿', '👱🏻', '👱🏼', '👱🏽', '👱🏾', '👱🏿', '👨🏻', '👨🏼', '👨🏽', '👨🏾', '👨🏿', '🧔🏻', '🧔🏼', '🧔🏽', '🧔🏾', '🧔🏿', '🧔🏻‍♂️', '🧔🏼‍♂️', '🧔🏽‍♂️', '🧔🏾‍♂️', '🧔🏿‍♂️', '🧔🏻‍♀️', '🧔🏼‍♀️', '🧔🏽‍♀️', '🧔🏾‍♀️', '🧔🏿‍♀️', '👨🏻‍🦰', '👨🏼‍🦰', '👨🏽‍🦰', '👨🏾‍🦰', '👨🏿‍🦰', '👨🏻‍🦱', '👨🏼‍🦱', '👨🏽‍🦱', '👨🏾‍🦱', '👨🏿‍🦱', '👨🏻‍🦳', '👨🏼‍🦳', '👨🏽‍🦳', '👨🏾‍🦳', '👨🏿‍🦳', '👨🏻‍🦲', '👨🏼‍🦲', '👨🏽‍🦲', '👨🏾‍🦲', '👨🏿‍🦲', '👩🏻', '👩🏼', '👩🏽', '👩🏾', '👩🏿', '👩🏻‍🦰', '👩🏼‍🦰', '👩🏽‍🦰', '👩🏾‍🦰', '👩🏿‍🦰', '🧑🏻‍🦰', '🧑🏼‍🦰', '🧑🏽‍🦰', '🧑🏾‍🦰', '🧑🏿‍🦰', '👩🏻‍🦱', '👩🏼‍🦱', '👩🏽‍🦱', '👩🏾‍🦱', '👩🏿‍🦱', '🧑🏻‍🦱', '🧑🏼‍🦱', '🧑🏽‍🦱', '🧑🏾‍🦱', '🧑🏿‍🦱', '👩🏻‍🦳', '👩🏼‍🦳', '👩🏽‍🦳', '👩🏾‍🦳', '👩🏿‍🦳', '🧑🏻‍🦳', '🧑🏼‍🦳', '🧑🏽‍🦳', '🧑🏾‍🦳', '🧑🏿‍🦳', '👩🏻‍🦲', '👩🏼‍🦲', '👩🏽‍🦲', '👩🏾‍🦲', '👩🏿‍🦲', '🧑🏻‍🦲', '🧑🏼‍🦲', '🧑🏽‍🦲', '🧑🏾‍🦲', '🧑🏿‍🦲', '👩🏻‍🦰', '👩🏼‍🦰', '👩🏽‍🦰', '👩🏾‍🦰', '👩🏿‍🦰', '👩🏻‍🦱', '👩🏼‍🦱', '👩🏽‍🦱', '👩🏾‍🦱', '👩🏿‍🦱', '👩🏻‍🦳', '👩🏼‍🦳', '👩🏽‍🦳', '👩🏾‍🦳', '👩🏿‍🦳', '👩🏻‍🦲', '👩🏼‍🦲', '👩🏽‍🦲', '👩🏾‍🦲', '👩🏿‍🦲', '👩🏻‍🦳', '👩🏼‍🦳', '👩🏽‍🦳', '👩🏾‍🦳', '👩🏿‍🦳', '🧑🏻‍🦰', '🧑🏼‍🦰', '🧑🏽‍🦰', '🧑🏾‍🦰', '🧑🏿‍🦰', '🧑🏻‍🦱', '🧑🏼‍🦱', '🧑🏽‍🦱', '🧑🏾‍🦱', '🧑🏿‍🦱', '🧑🏻‍🦳', '🧑🏼‍🦳', '🧑🏽‍🦳', '🧑🏾‍🦳', '🧑🏿‍🦳', '🧑🏻‍🦲', '🧑🏼‍🦲', '🧑🏽‍🦲', '🧑🏾‍🦲', '🧑🏿‍🦲', '👩🏻‍🦰', '👩🏼‍🦰', '👩🏽‍🦰', '👩🏾‍🦰', '👩🏿‍🦰', '👩🏻‍🦱', '👩🏼‍🦱', '👩🏽‍🦱', '👩🏾‍🦱', '👩🏿‍🦱', '👩🏻‍🦳', '👩🏼‍🦳', '👩🏽‍🦳', '👩🏾‍🦳', '👩🏿‍🦳', '👩🏻‍🦲', '👩🏼‍🦲', '👩🏽‍🦲', '👩🏾‍🦲', '👩🏿‍🦲'
    ];

    function addEmojiContainers()
    {
        let icon =
            `<div class="emoji-container" style="position: absolute; width: 20px; height: 20px; bottom: 2px; left: auto; right: 10px; margin: auto; visibility: inherit;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1zm0 20a9 9 0 1 1 9-9 9.01 9.01 0 0 1-9 9zm4.632-6.775a1 1 0 0 1 .143 1.407A6.036 6.036 0 0 1 12 18a1 1 0 0 1 0-2 4.045 4.045 0 0 0 3.225-1.632 1 1 0 0 1 1.407-.143zM18 8a1 1 0 0 1 1 1 4 4 0 0 1-4 4 2 2 0 0 1-2-2v-1h-2v1a2 2 0 0 1-2 2 4 4 0 0 1-4-4 1 1 0 0 1 1-1h4a1 1 0 0 1 1 1h2a1 1 0 0 1 1-1z" fill="black"></path></svg></div>`;


        addHTML(icon, `#newbonklobby_chatbox`);
        document.getElementById('newbonklobby_chat_input').style.pointerEvents = 'auto';

        addHTML(icon, `#ingamechatbox`);
        document.getElementById('ingamechatbox').style.pointerEvents = 'auto';

        document.querySelectorAll('.emoji-container').forEach(container => {
            container.addEventListener('click', (event) => {
                document.getElementById('newbonklobby_chat_lowerinstruction').innerHTML = ``;
                EventUItoggleEmoji()

            });
        });

    }
    function hiddenIcon()
    {
        document.getElementById('ingamechatinputtext').addEventListener('keydown', function() {
            const emojiContainer = document.querySelector('#ingamechatbox .emoji-container');
            setTimeout(() => {
                emojiContainer.style.display = this.classList.contains('ingamechatinputtextbg') ? 'block' : 'none';
            }, 30);
        });
    }

    function addStyles() {
        addCSS(`MrMenuUICSS`, `
            @keyframes colorEmoji {
                0%, 50%, 100% { fill: black; }
                25%, 75% { fill: white; }
            }
            .emoji-container > svg > path { animation: colorEmoji 4s infinite; }
        `);

        addCSS(`MrMenuUIemoji`, `
            #Mremoji-container {
                visibility: hidden; opacity: 0; z-index: -100;
                display: flex; position: absolute; top: 50%; left: 50%;
                width: calc(90% - 50px); height: calc(90% - 50px);
                transform: translate(-50%, -50%); margin: 12px;
                flex-wrap: wrap; justify-content: flex-start;align-content: flex-start; padding: 10px;
                background-color: #1f1f1f; border: 2px solid #ccc;
                border-radius: 10px; overflow-y: auto;
            }
            .emoji { font-size: 40px; width: 60px; height: 60px; }
            .emoji:hover { transform: scale(1.2); }
        `);
    }

    function addEmojiPicker()
    {
        const emojiHTML = emojifiles.map(emoji => `<div class="emoji">${emoji}</div>`).join('');
        const emojiContainer = `<div id="Mremoji-container">${emojiHTML}</div>`;
        addHTML(emojiContainer, '#bonkiocontainer');
    }

    function addEmojiClickEvent()
    {
        document.querySelector('#Mremoji-container').addEventListener('click', function(event) {
            if (event.target.classList.contains('emoji')) {
                const chatInputId = getPlay() ? 'ingamechatinputtext' : 'newbonklobby_chat_input';
                const chatInput = document.getElementById(chatInputId);

                chatInput.value += ` ${event.target.textContent}`;
                chatInput.setSelectionRange(chatInput.value.length, chatInput.value.length);
                chatInput.focus();

                EventUItoggleEmoji();
            }
        });
    }


    addEmojiContainers();
    hiddenIcon();
    addStyles();
    addEmojiPicker();
    addEmojiPicker();
    addEmojiClickEvent();
}

function ActionResetData(event)
{
    window.MrMenu.data.HostID = null;
    window.MrMenu.data.ID = null;
    window.MrMenu.data.players = [];
}

function ActionIPLoggerClick(event)
{
    function IPLoggerAddIP(ip)
    {
        if (!window.MrMenu.IPLogger.IPs.some(item => item.IP === ip))
        {
            window.MrMenu.IPLogger.IPs.push({ IP: ip, loc: '' });
        }
    }

    function addPlayer(nick, ip)
    {
        const ipEntry = window.MrMenu.IPLogger.IPs.find(item => item.IP === ip);
        if (!ipEntry) return console.error(`IP ${ip} does not exist. Add the IP first.`);

        const playerEntry = window.MrMenu.IPLogger.players.find(player => player.nick === nick);
        if (playerEntry) {
            const ipRecord = playerEntry.ips.find(record => record.ip === ip);
            if (ipRecord) ipRecord.hit++;
            else playerEntry.ips.push({ ip, hit: 1 });
        } else {
            window.MrMenu.IPLogger.players.push({ nick, ips: [{ ip, hit: 1 }] });
        }
    }

    RTCPeerConnection.prototype.addIceCandidate2 = null;

    function enable()
    {
        RTCPeerConnection.prototype.addIceCandidate = function(...args) {
            if (!args[0].address.includes(".local"))
            {
                IPLoggerAddIP(args[0].address);

                if (window.MrMenu && window.MrMenu.data && window.MrMenu.data.players) {
                    for (let n = 0; n < window.MrMenu.data.players.length; n++) {
                        let nick = window.MrMenu.data.players[n].nick;
                        addPlayer(nick, args[0].address);
                    }
                }
            }

            this.addIceCandidate2(...args);
        };
    }

    function disable()
    {
        if(RTCPeerConnection.prototype.addIceCandidate2 !== null)
        {
            RTCPeerConnection.prototype.addIceCandidate = RTCPeerConnection.prototype.addIceCandidate2;
            RTCPeerConnection.prototype.addIceCandidate2 = null;
        }
    }

    if(event.target.id == 'IPLoggerE')
    {
        window.MrMenu.data.flags.iplogger = true;
        enable();
    }
    if(event.target.id == 'IPLoggerD')
    {
        window.MrMenu.data.flags.iplogger = false;
        disable();
    }
}


function toggleFullscreen() {
    const el = document.getElementById('bonkiocontainer');
    if (el) {
        try {
            if (!document.fullscreenElement) {
                el.requestFullscreen?.() || el.mozRequestFullScreen?.() || el.webkitRequestFullscreen?.() || el.msRequestFullscreen?.();
            } else {
                document.exitFullscreen?.() || document.mozCancelFullScreen?.() || document.webkitExitFullscreen?.() || document.msExitFullscreen?.();
            }
        } catch (error) {
        }
    }
}

function SearchRoom()
{
    function addSearchBox()
    {
        addHTML('<div id="MrSearchBox" style=" display: flex; height: 40px; align-items: center; justify-content: center;"><input type="text" style=" height: 30px; width: 45%; outline: none; border: 1px solid #cccc; border-radius: 30px; background-color: #c1cdd2; color: black; text-align: center; "></div>', `div#roomlisttopbar`);

        document.getElementById('MrSearchBox').addEventListener('input', function(event) {
            const filterValue = event.target.value.toLowerCase();
            const rows = document.querySelectorAll('#roomlisttable > tbody > tr');

            rows.forEach(row => {
                const cellText = row.querySelector('td').textContent.toLowerCase();
                if (filterValue === "" || cellText.includes(filterValue)) {
                    row.style.display = 'table-row';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    function removeSearchBox()
    {
        const emojiContainer = document.querySelector('div#roomlisttopbar > div#MrSearchBox');
        if (emojiContainer) {
            emojiContainer.remove();
        }
    }

    if(event.target.id == `MrHostSearchRoomE`)
    {
        if(document.getElementById('MrSearchBox') == null)
        {
            addSearchBox();
        }
    }
    if(event.target.id == `MrHostSearchRoomD`)
    {

        removeSearchBox();

    }
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

function ManagerWSS(event)
{
    if(event.data && event.data.startsWith("42[3,")) { Event_Roomjoin(event); }
    if(event.data && event.data.startsWith("42[4,")) { Event_Playerjoin(event); }
    if(event.data && event.data.startsWith("42[5,")) { Event_Playerleave(event); }
    if(event.data && event.data.startsWith("42[20,")) { Event_ChatMessage(event); }
    if(event.data && event.data.startsWith("42[33,")) { Event_MapSuggest(event); }

}

function Event_Roomjoin(event)
{
    let vdata;
    try
    {
        vdata = JSON.parse(event.data.slice(2));
        let ID = vdata[1];
        let HostID = vdata[2];

        window.MrMenu.data.HostID = HostID;
        window.MrMenu.data.ID = ID;
    } catch (error) { }
}

function Event_Playerjoin(event)
{
    let vdata;
    try
    {
        vdata = JSON.parse(event.data.slice(2));
        let ID = vdata[1];
        let PeerID = vdata[2];
        let Nick = vdata[3];
        let guest = vdata[4];
        let newPlayer = { id: ID, peerID: PeerID, nick: Nick, guest: guest };

        let isUnique = !window.MrMenu.data.players.some(player => player.id === newPlayer.id);

        if (isUnique)
        {
            window.MrMenu.data.players.push(newPlayer);
        }

        if(window.MrMenu.data.flags.freejoin == true)
        {
            if(window.MrMenu.data.flags.freejoinguest == true && guest == true)
            {
                ActionFreejoin(Nick, guest, ID);
            }
            if(guest == false)
            {
                ActionFreejoin(Nick, guest, ID);
            }
        }

    } catch (error) { }
}

function Event_Playerleave(event)
{
    let vdata;
    try
    {
        vdata = JSON.parse(event.data.slice(2));
        let ID = vdata[1];
        if(window.MrMenu.data.ID == ID)
        {
            ActionResetData(event);
        }
        else
        {
            let playerIndex = window.MrMenu.data.players.findIndex(player => player.id === ID);

            if (playerIndex !== -1)
            {
                window.MrMenu.data.players.splice(playerIndex, 1);
            }
        }

    } catch (error) { }
}


function Event_ChatMessage(event)
{

    let vdata;
    try
    {
        vdata = JSON.parse(event.data.slice(2));
        let ID = vdata[1];
        let MSG = vdata[2];
        if(window.MrMenu.data.lastmsg !== MSG)
        {
            if(window.MrMenu.data.flags.linkmsg == true)
            {
                ActionChatUrls();

            }
            if(!getPlay())
            {
                ActionChatNicks();
            }
        }

    } catch (error) { }
}


function Event_MapSuggest(event)
{
    let vdata;
    try
    {
        vdata = JSON.parse(event.data.slice(2));
        let map = vdata[1];
        let ID = vdata[2];
    } catch (error) { }
}


/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

function InterceptWSS()
{
    window.MrMenu = {};
    window.MrMenu.data = {
        HostID: null,
        ID: null,
        lastmsg:null,
        players: [],
        IPLogger : { IPs: [], players: [] },
        flags:
        {
            freejoin: false,
            freejoinguest: false,
            xp: false,
            linkmsg: false,
            iplogger: false,
        }
    };

    var originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function(args)
    {
        if (this.readyState == WebSocket.OPEN)
        {
            bonkWSS = this;
        }

        var originalReceive = this.onmessage;

        this.onmessage = function(event)
        {
            ManagerWSS(event);
            return originalReceive.call(this, event);
        };
        return originalSend.call(this, args);
    }
}


function Init()
{
    InterceptWSS();

    addCSS(`MrMenuUICSS`, UICSS);
    addHTML(UI.main, `#bonkiocontainer`);
    for (let key in UI.tab)
    {
        if (typeof UI.tab[key] === 'string')
        {
            addHTML(UI.tab[key], `#MrArea > #Mrcontent`);
        }
    }

    updateCSSRule('.ingamechatname.MrBonkeiro::before', 'content', '"👑 "');
    updateCSSRule('.newbonklobby_chat_msg_name.MrBonkeiro::before', 'content', '"👑 "');

    EventUItoggleMenu();

    document.querySelector("body").addEventListener("keydown", (event) => { if (event.key === 'Delete') { EventUItoggleMenu(); } });
    document.querySelector(`div#pretty_top_name`).addEventListener(`click`, () => { EventUItoggleMenu();});
    document.querySelector(`#Mrtitlebar > svg`).addEventListener(`click`, () => { EventUItoggleMenu();});


    document.querySelector(`div#MrMenuUI > div#MrArea > div#Mrsidebar`).addEventListener("click", (event) => {
        EventUIsidebar(event);
        const actionElements = document.querySelectorAll("#Mrcontent > div.active > div > div.action");

        actionElements.forEach(actionElement => {
            actionElement.addEventListener("click", (event) => {
                if (event.target.tagName === 'BUTTON') {
                    event.target.parentElement.querySelectorAll("button").forEach(button => {
                        button.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            });
        });

    });

    document.querySelector(`button#MrXPE`).addEventListener("click", (event) => { ActionXPclick(event); });
    document.querySelector(`button#MrXPD`).addEventListener("click", (event) => { ActionXPclick(event) });

    document.querySelector(`#MrMenuXPinputRangeDelay`).addEventListener("input", (event) => { ActionXPRange(event); });


    document.querySelector(`button#MrChatVisibilyE`).addEventListener("click", (event) => { ActionChatVisibility(event); });
    document.querySelector(`button#MrChatVisibilyD`).addEventListener("click", (event) => { ActionChatVisibility(event); });

    document.querySelector(`select#MrChatPositionH`).addEventListener("change", (event) => { ActionChatPosition(event); });
    document.querySelector(`select#MrChatPositionV`).addEventListener("change", (event) => { ActionChatPosition(event); });


    document.querySelector(`div#MrChatBgColorbg`).addEventListener("click", (event) => { ActionChatColor(event); });
    document.querySelector(`div#MrChatBgColorFont`).addEventListener("click", (event) => { ActionChatColor(event); });
    document.querySelector(`input#MrChatBgColorbgbase`).addEventListener("input", (event) => { document.getElementById('MrChatBgColorbg').style.backgroundColor = event.target.value; ActionChatColorFinal(event);});
    document.querySelector(`input#MrChatBgColorFontbase`).addEventListener("input", (event) => { document.getElementById('MrChatBgColorFont').style.backgroundColor = event.target.value; ActionChatColorFinal(event);});

    document.querySelector(`input#MrChattransparency`).addEventListener('input', (event) => { ActionChatransparency(event);});

    document.querySelector(`button#MrChatLinkE`).addEventListener("click", (event) => { window.MrMenu.data.flags.linkmsg = true; });
    document.querySelector(`button#MrChatLinkD`).addEventListener("click", (event) => { window.MrMenu.data.flags.linkmsg = false; });

    document.querySelector(`button#MrChatEmojiE`).addEventListener("click", (event) => { ActionChataddEmoji(); });
    document.querySelector(`button#MrChatEmojiD`).addEventListener("click", (event) => { ActionChatremoveEmoji(); });

    document.querySelector(`button#MrHostSearchRoomE`).addEventListener("click", (event) => { SearchRoom(); });
    document.querySelector(`button#MrHostSearchRoomD`).addEventListener("click", (event) => { SearchRoom(); });

    document.querySelector(`#bonkiocontainer`).addEventListener("click", (event) => { if(event.target.id == `leaveconfirmwindow_okbutton`){ ActionResetData(event); } });

    document.querySelector(`button#MrFullScreen`).addEventListener("click", (event) => { toggleFullscreen(); });

    EventUItoggleMenu();
}

ScriptInjector(Init);