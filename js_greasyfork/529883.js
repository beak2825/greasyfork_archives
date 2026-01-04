// ==UserScript==

// @name           Fake kick

// @name:tr        Fake kick

// @name:az        Fake kick

// @description    Fake kick at

// @description:tr Fake kick at

// @description:az Fake kick at

// @version        1.0

// @author         AsadovSc

// @license        

// @match          *://gartic.io/*

// @match          *://*/*?__cpo=aHR0cHM6Ly9nYXJ0aWMuaW8

// @icon           https://gartic.io/static/images/avatar/svg/0.svg

// @grant          GM_setValue

// @grant          GM_getValue

// @grant          GM_addValueChangeListener

// @grant          GM_addStyle

// @namespace https://greasyfork.org/users/1220697



// @downloadURL https://update.greasyfork.org/scripts/529883/Fake%20kick.user.js
// @updateURL https://update.greasyfork.org/scripts/529883/Fake%20kick.meta.js
// ==/UserScript==

function fa(hv){return document.querySelectorAll(hv)}

if(window.location.href.indexOf("gartic.io")!=-1){

    let readyc=0,botc=0,otoeven=0,roomusers=[]

    let WebSocket=window.WebSocket

    window.ginterval=0

    window.selectlevel=-1

    let originalSend = WebSocket.prototype.send,setTrue=false;

    window.wsObj={}

    console.log("running")

    WebSocket.prototype.send=function(data){

        originalSend.apply(this, arguments)

        if(Object.keys(window.wsObj).length==0){window.wsObj=this;window.eventAdd()}

    };

    function updatespeckicks(){

        f(".userkickmenu").innerHTML=""

        roomusers.forEach(user=>{

            user.nick.split("‏").join("")!="RED"?f(".userkickmenu").innerHTML+=`<input type="submit" class="kickmenubtn" value="`+user.nick+`" onclick="window.postMessage('kickuser.`+user.id+`','*')">`:0

        })

    }

    window.eventAdd=()=>{

        if(!setTrue){

            setTrue=1

            window.wsObj.addEventListener("message",(msg)=>{

                if(msg.data.indexOf('42["5"')!=-1){

                    let objlist=JSON.parse('["5"'+msg.data.split('42["5"')[1])

                    objlist[5].forEach(item=>{roomusers.push(item)})

                    updatespeckicks()

                    window.addEventListener("message",function(event){

        if(typeof(event.data)==="string"){

            if(event.data.indexOf("kickuser.")!=-1){

                let userid=event.data.split("kickuser.")[1]

            let objlist=JSON.parse('["5"'+msg.data.split('42["5"')[1])

            var longID = objlist[1]

            var id = objlist[2]

            window.wsObj.send('42[45,'+id+',["'+userid+'",true]]')

            window.wsObj.send('42[45,'+id+',["'+userid+'",false]]')

            }

        }

    })

                }

                if(msg.data.indexOf('42["23"')!=-1){

                    let user=JSON.parse("{"+msg.data.split("{")[1].split("}")[0]+"}")

                    roomusers.push(user)

                    updatespeckicks()

                    document.querySelector("body > div:nth-child(19) > input:nth-child(12)").value = user.nick

                }

                if(msg.data.indexOf('42["24"')!=-1){

                    let user=msg.data.split(",")[1].split('"')[1]

                    for(let i=0;i<roomusers.length;i++){

                        typeof(roomusers[i].id)==='undefined'?0:roomusers[i].id==user?roomusers.splice(i,1):0

                    }

                    updatespeckicks()

                }

            })

        }

    }

    let html=`

    <div class="userlist">

    <div class="userkickmenu"></div>

    </div>

    `

    function setCSS(){

        var css = `

        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

        .rb4 *{box-sizing:border-box;}

        .userlist {

            display:block;text-align:center;opacity:none;font-size:10pt;color:#FF0000;font-style:italic;

            position:fixed;left:50%;top:3px;padding:5px 3px !important;margin:0px;background:#000000;font-family: 'Roboto', sans-serif;border:2px solid #303132;

            transform:translate(-50%,0);border-radius:15px;z-index:999999999;display:block !important;height:auto !important;width:200px !important;

        }

        .userlist input[type=text]{height:20px;border-radius:3px;font-size:9pt;background:white;color:white;padding-left:3px;}

        .userlist  input[type=submit]{height:25px;border-radius:3px;background:#FFFFFF;}

        .userlist input[type=checkbox]{margin-top:2px;}

        #background{

        z-index:999;width:0px;height:0px;position:fixed;left:0px;top:0px;

        }

    `;

        GM_addStyle(css);

    }

    setInterval(()=>{

        if(f("#users")){

            fa(".kickmenubtn").forEach(ele=>{

                f(".scrollElements").innerText.indexOf(ele.value)==-1?ele.remove():0

            })

            f("g")?f("g").remove():0;

        }

        if(f("#background")&&!f(".userlist")){

            f("#background").innerHTML+=html

            setCSS()

        }

    },100)

}

let m_s, a_i, m_a, m_z, m_b;

const f = x => document.querySelector(x),

    sendMessage = (inputSelector, mesaj) => {

        a_i = document.querySelector(inputSelector);

        m_a = a_i.value;

        // Add a random invisible character from the list before the message

        const invisibleChars = ["\u200B", "\u200C", "\u200D", "\u2060", "\u180E", "\uFEFF"];

        const randomChar = invisibleChars[Math.floor(Math.random() * invisibleChars.length)];

        a_i.value = randomChar + mesaj + m_a;

        m_z = new Event("input", { bubbles: !0 });

        m_z.simulated = !0;

        m_b = new Event("submit", { bubbles: !0 });

        m_b.simulated = !0;

        m_s = a_i._valueTracker;

        m_s && m_s.setValue(m_a);

        a_i.dispatchEvent(m_z);

        a_i.form.dispatchEvent(m_b);

    },

    rand = x => Math.floor(Math.random() * 1000000),

    GM_onMessage = (label, cb) => GM_addValueChangeListener(label, (_, __, data) => cb(...data)),

    GM_sendMessage = (label, ...data) => GM_setValue(label, data);

GM_onMessage('ucur', (atılacak, _) => {

    atılacak && document.querySelectorAll(".nick").forEach(nick => {

        nick.innerText === atılacak && (nick.click(), f(".ic-votekick")?.click())

    })

});

GM_onMessage('msg', (i, w, _) => {

    sendMessage(i, w)

})

GM_onMessage('skip', (_, __) => {

    let leButton = document.evaluate('//*[@id="notification"]/div/div[2]/div[1]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (leButton) {

        leButton.click();}

    let reportButton = document.evaluate('//*[@id="tools"]/div/div[1]/button[4]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (reportButton) {

        reportButton.click();

        let confirmButton = document.evaluate('//*[@id="popUp"]/div/div/div[3]/button[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (confirmButton) {

            confirmButton.click();

        }

    }

});

GM_onMessage('report', (_, __) => {

    let reportButton = document.evaluate('//*[@id="canvas"]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (reportButton) {

        reportButton.click();

        let confirmButton = document.evaluate('//*[@id="popUp"]/div[1]/div/div[3]/button[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (confirmButton) {

            confirmButton.click();

        }

    }

});

GM_onMessage('exit', (_, __) => {

    let exitButton = document.evaluate('//*[@id="exit"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (exitButton) {

        setTimeout(function () {

            exitButton.click();

            let confirmButton = document.evaluate('//*[@id="popUp"]/div[1]/div/div[3]/button[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (confirmButton) {

                confirmButton.click();

            }

        }, 0); // Delay of 1 second

    }

});

window.onload = function () {

    const roomConsole = document.createElement("div");

    roomConsole.style = "color:#FFD700;margin-top:5px;";

    container.appendChild(roomConsole);

    let currentGarticRoom;

    // Function to check if the current page is a gartic.io room

    function getGarticRoom() {

        let garticRegex = /gartic\.io\/(.+)$/;

        let match = window.location.href.match(garticRegex);

        if (match && match[1]) {

            return match[1];

        }

        return null;

    }

    // Function to update the current gartic.io room

    function updateCurrentRoom() {

        let room = getGarticRoom();

        if (room !== currentGarticRoom) {

            currentGarticRoom = room;

            roomConsole.innerText = `Current Room: ${currentGarticRoom || 'No room found'}`;

        }

    }

    // Update the room initially

    updateCurrentRoom();

    // Check for room changes every 5 seconds

    setInterval(updateCurrentRoom, 1000);

};

function createInput(width, height) {

    const input = document.createElement("input");

    input.style = `width:${width};height:${height};border-radius:5px;padding:5px;border:1px solid #FFD700;background-color:#333333;color:#FFD700;`;

    return input;

}

function createButton(width, height, text, clickHandler) {

    const button = document.createElement("button");

    button.style = `width:${width};height:${height};background-color:#FFD700;color:black;border-radius:5px;border:1px solid black;margin-top:5px;`;

    button.textContent = text;

    button.addEventListener("mousedown", clickHandler);

    return button;

}