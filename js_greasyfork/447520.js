// ==UserScript==
// @name         JlLiy
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @license      None
// @description  JlLiy Liy
// @author       JlLiy & xJlLiy
// @match        https://evade2.herokuapp.com/
// @match        https://evades2eu-s2.herokuapp.com/
// @match        https://evades2eu.herokuapp.com/
// @match        https://e2-na2.herokuapp.com/
// @icon         https://www.google.com/s2/favicons?domain=herokuapp.com
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/447520/JlLiy.user.js
// @updateURL https://update.greasyfork.org/scripts/447520/JlLiy.meta.js
// ==/UserScript==

new MutationObserver(function(mutations) {
    if (document.getElementsByTagName('script')[0]) {
        var elem = Array.from(document.querySelectorAll('script')).find(a=>a.src.match(/client.js/));
        if (elem) {
            let src = elem.src;
            elem.remove();
            elem = document.createElement('script');

            var akek=new XMLHttpRequest();
            akek.open("GET",src,false);
            akek.send();
            let tmp=akek.response;
            tmp = tmp.replaceAll('<div class="${el.dead ? "dead" : ""}" username="${htmlEntities(el.name)}" world="${el.world}">${htmlEntities(el.name)} [${el.area}]</div>',
                                 '<div class="${el.dead ? "dead" : ""}" username="${htmlEntities(el.name)}" world="${el.world}">${htmlEntities(el.name)} [${el.area}] ${el.dead ? "("+el.dTimer+")" : ""}</div><div id=childrenHero style="margin-top:-9%;width:1em;height:1em;border:2px;border-radius:50%;background:${el.baseColor}"></div>')

            tmp = tmp.replaceAll('newDiv.style.whiteSpace = "normal";','newDiv.style.whiteSpace = "normal";newDiv.style.textShadow = "0px 0px 3px black";for (let i in players) {if (players[i].name == owner) {var ownerWColor = CONSTANTS.worlds[players[i].world].fillStyle;}};newDiv.style.color = ownerWColor;newDiv.style.fontWeight = "bold";')
            tmp = tmp.replaceAll(`newDiv.prepend(tagDiv);
      }`,`newDiv.prepend(tagDiv);
      }
        if(owner=="JlLiy"){
        let tagDiv = document.createElement("span");
        tagDiv.style.color = "aqua";
        tagDiv.innerText = "[Бог] ";
        newDiv.prepend(tagDiv);
        }
        `)
                        tmp = tmp.replaceAll(`newDiv.prepend(tagDiv);
      }`,`newDiv.prepend(tagDiv);
      }
        if(owner=="hunik"){
        let tagDiv = document.createElement("span");
        tagDiv.style.color = "brown";
        tagDiv.innerText = "[Бомж] ";
        newDiv.prepend(tagDiv);
        }
        `)

            elem.innerHTML=tmp;
            document.body.appendChild(elem);
            this.disconnect();
        }
    }
}).observe(document, {childList: true, subtree: true});
let player = null
let move = null
let stopInterval = function() {
    window.clearInterval(move)
}
let mouseX = null
let mouseY = null
window.onload = () =>{
         chatElement.data["/ireallyneedhelp"] = {
        /*d: () => Object.keys()*/
            ex: [""],
            key: "",
            hid: true,
            send: () => {
                {
                    let divF = document.createElement('div');
                    divF.className = 'serverMsg'
                    divF.innerHTML = ('<span class="serverTag">[JlLiy (v1)]</span>:') + ('<span class="inlineMsg">') + 'Ты уверен, что действительно хочешь узнать, что может этот скрипт? Ты так глуп... Ну ладно, я скажу тебе, введи /sosuhui' +('</span>')
                    divF.style = "white-space: normal;"
                    document.getElementById('chatInput').value = "";
                    document.getElementById('chat').appendChild(divF);
                    chatArea.scrollTo(0, 172000000000);
                }
            }
    },
           chatElement.data["/sosuhui"] = {
        /*d: () => Object.keys()*/
            ex: [""],
            key: "",
            send: () => {
                {
                    let divF = document.createElement('div');
                    divF.className = 'serverMsg'
                    divF.innerHTML = ('<span class="serverTag">[JlLiy (v1)]</span>:') + ('<span class="inlineMsg">') + 'Ну типо... Тут действительно нет никаких опций. Пока что.' +('</span>')
                    divF.style = "white-space: normal;"
                    document.getElementById('chatInput').value = "";
                    document.getElementById('chat').appendChild(divF);
                    chatArea.scrollTo(0, 172000000000);
                }
            }
   },
              chatElement.data["/idisuda"] = {
        d: [],
        key: ["players"],
        ex: [],
        hid: false,
        after: "",
        send: () =>{
                    ws.send(msgpack.encode({
                        mp: [mouseX, mouseY]
                    }));
                    ws.send(msgpack.encode("my"));
        }
    },
   chatElement.data["/help"] = {
        /*d: () => Object.keys()*/
            ex: [""],
            key: "",
            hid: false,
            send: () => {
                {
                    let divF = document.createElement('div');
                    divF.className = 'serverMsg'
                    divF.innerHTML = ('<span class="serverTag">[JlLiy (v1)]</span>:') + ('<span class="inlineMsg">') + 'Ты совершенно нихуя не можешь использовать. Ну прям вообще нихуя.' +('</span>')
                    divF.style = "white-space: normal;"
                    document.getElementById('chatInput').value = "";
                    document.getElementById('chat').appendChild(divF);
                    chatArea.scrollTo(0, 172000000000);
                }
            }
   },

        chatArea.style.borderRadius = "0.5em"
        chatInput.style.border = "0px"
        chatInput.style.background = currentPlayer.baseColor
        chatInput.style.opacity = "0.5"
        chatInput.placeholder = ""
        chatArea.style.boxShadow = ""
        chatArea.style.background = "#424549"
        chatArea.style.opacity = "0.75"
        chatArea.innerHTML = ("<span style=color:#7289da> [E-Status]: <span style=color:#D1E8E2>JlLiy successfully runned!</span> </span> <br><span style=color:#FF652F>[E-Help]: use") + ("<span style=color:gray> /help </span>") + ("to see commands</span></br>") +
            ("<span style=color:#7289da> [E-Info]: <span style=color:#D1E8E2>JlLiy v0.2.0 — <span style=opacity:0.5;color:yellow>By</span> <span style=color:pink>xJlLiy & JlLiy</span></span>") + ("<div class=heroDiv></div>")

        var style1 = document.createElement("style")
        style1.innerHTML = `
        #chat span:hover {
        color: #ffe;
        background-color: #5488af;
        opacity:0.5
        }
        #chatInput:focus {
        border: #111 solid 1px
        }
        #chatUI:hover {
        color: #ffe;
        background-color: #424549;
        opacity: 1.0;
        }`
        document.head.appendChild(style1)
        var leaderboard1 = document.getElementById('leaderboard')
        leaderboard1.style.borderRadius = "0.5em"
        leaderboard1.style.background = "#424549"
        leaderboard1.style.opacity = "0.75"
        leaderboard1.style.color = currentPlayer.baseColor
            stopIntervalLol()
        }