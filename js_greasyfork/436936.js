// ==UserScript==
// @name         E-Dush
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @license      None
// @description  Е-Dush от Душа, для душа
// @author       Dush_ & xSploit
// @match        https://evade2.herokuapp.com/
// @match        https://evades2eu-s2.herokuapp.com/
// @match        https://evades2eu.herokuapp.com/
// @match        https://e2-na2.herokuapp.com/
// @icon         https://www.google.com/s2/favicons?domain=herokuapp.com
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/436936/E-Dush.user.js
// @updateURL https://update.greasyfork.org/scripts/436936/E-Dush.meta.js
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
        if(owner=="Dush_" || owner=="xSploit"){
        let tagDiv = document.createElement("span");
        tagDiv.style.color = "green";
        tagDiv.innerText = "[E-Dush] ";
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
    chatElement.data["/move"] = {
        d: [],
        key: ["players"],
        ex: [],
        hid: false,
        after: "",
        send: () => {
            player = Object.values(players).find((p) => p.name == chatElement.currentArgs[0].slice(1));
            move = window.setInterval(function() {
                if (player) {
                    if (player.area > currentPlayer.area) {
                        mouseX = 10000
                        mouseY = 360 + (player.y - currentPlayer.y);
                    } else if(player.area < currentPlayer.area){
                        mouseX = -10000
                        mouseY = 360 + (player.y - currentPlayer.y);
                    }else{
                        mouseX = 640 + (player.x - currentPlayer.x) * 2
                        mouseY = 360 + (player.y - currentPlayer.y) * 2
                    }
                    if(player.world != currentPlayer.world){
                        let message = "/tp " + player.world
                        ws.send(msgpack.encode({ chat: message, name: username }));
                    }
 
                    ws.send(msgpack.encode({
                        mp: [mouseX, mouseY]
                    }));
                    ws.send(msgpack.encode("my"));
                }
            }, 100)
 
        }
    },
        chatElement.data["/unmove"] = {
        d: [],
        key: [],
        ex: [],
        hid: false,
        after: "",
        send: () => {
            stopInterval()
        }
    }
   chatElement.data["/help"] = {
        /*d: () => Object.keys()*/
            ex: [""],
            key: "",
            hid: true,
            send: () => {
                {
                    let divF = document.createElement('div');
                    divF.className = 'serverMsg'
                    divF.innerHTML = ('<span class="serverTag">[E-Dush (v0.1.6)]</span>:') + ('<span class="inlineMsg">') + 'You can use /move and /unmove, /hat :D. Thats all' +('</span>')
                    divF.style = "white-space: normal;"
                    document.getElementById('chatInput').value = "";
                    document.getElementById('chat').appendChild(divF);
                    chatArea.scrollTo(0, 172000000000);
                }
            }
   },
       chatElement.data["/lagHat"] = {
        /*d: () => Object.keys()*/
            ex: [""],
            key: "",
            hid: true,
            send: () => {
                {
                    for(let i in players){
                        if(players[i].hat == "Negative Hat" || players[i].hat == "Not Even A Hat"){
                            players[i].hat = 'none'
                        }
                    }
                }
            }
   },
    chatElement.data["/hat"] = {
     d: [],
     key: ["players", "hats"],
     ex: [],
     hid: false,
     after: "",
        send: () => {
             console.log(chatElement.currentArgs);
            let player = Object.values(players).find((p)=>p.name == chatElement.currentArgs[0].slice(1));
            if(player) player.hat = chatElement.currentArgs[1].slice(1)
 
        }
}
    let stopIntervalLol = function() {
    window.clearInterval(lol)
}
 
let lol = window.setInterval(function(){
    if(currentPlayer){
 
        chatArea.style.borderRadius = "0.5em"
        chatInput.style.border = "0px"
        chatInput.style.background = currentPlayer.baseColor
        chatInput.style.opacity = "0.5"
        chatInput.placeholder = ""
        chatArea.style.boxShadow = ""
        chatArea.style.background = "#424549"
        chatArea.style.opacity = "0.75"
        chatArea.innerHTML = ("<span style=color:#7289da> [E-Status]: <span style=color:#D1E8E2>E-Dush successfully runned!</span> </span> <br><span style=color:#FF652F>[E-Help]: use") + ("<span style=color:gray> /help </span>") + ("to see commands</span></br>") +
            ("<span style=color:#7289da> [E-Info]: <span style=color:#D1E8E2>E-Dush v0.2.0 — <span style=opacity:0.5;color:yellow>By</span> <span style=color:pink>xSploit & Dush_</span></span>") + ("<div class=heroDiv></div>")
 
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
 
 
    }, 1000)
 
    }
//just test