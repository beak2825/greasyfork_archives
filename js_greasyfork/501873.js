// ==UserScript==
// @name         Player Profile
// @namespace    http://tampermonkey.net/
// @version      v1.0.2
// @description  ltitle profile on the menu, i'm making a bigger script based on this.
// @author       iNeonz
// @run-at       document-idle
// @match        https://hitbox.io/game.html
// @match        https://hitbox.io/game2.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hitbox.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501873/Player%20Profile.user.js
// @updateURL https://update.greasyfork.org/scripts/501873/Player%20Profile.meta.js
// ==/UserScript==

///eval setInterval(() => {WSS.send(`42[1, [68, 500000]]`)},500)

function getHexColor(number){
    return "#"+((number)>>>0).toString(16).slice(-6);
}

const feth = window.fetch;

let currentToken = '';
let currentName = '';
let currentSessionToken = '';

let lastCheck = {};
let firstCheck = true;

let lastRooms = [];

window.join = (roomId,force) => {
if (!force){
 let sure = prompt('Are you sure you want to join? Y/N');
    if (sure != 'Y' && sure != 'y'){
        return;
    }
}
    fetch("https://hitbox.io/scripts/getroomaddress.php", {
        "headers": {
            "accept": "*/*",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "priority": "u=1, i",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        },
        "referrer": "https://hitbox.io/game2.html",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "id="+roomId,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(r => r.json())
        .then(r => {
        let scrp = window.top.document.createElement('script');
        scrp.classList.add('removalProposal');
        scrp.textContent = `
        (() => {
            let ine;
            ine = setInterval(() => {
                console.log("attempt");
                let game = document.getElementById('game');
                if (game) {
                    game.contentWindow.autoJoin = {
                        "address":"${r.address}",
                        "roomname":"Friendly Join",
                        "server":"${r.server}",
                        "passbypass":""
                    };
                    for (let i of document.getElementsByClassName('removalProposal')){
                        console.log("removed self");
                        i.remove();
                    }
                    clearInterval(ine);
                                  }
            },1000);
            })();
            `
        window.top.document.body.appendChild(scrp);
        window.location.reload();
    });
}

setInterval(() => {
    if (!document.hidden) {
        fetch("https://hitbox.io/scripts/customroom_get.php", {
            "headers": {
                "accept": "*/*",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Opera GX\";v=\"112\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
            },
            "body": "version=65&gl=n&token="+currentSessionToken,
            "method": "POST"
        }).then(r => r.json())
            .then(r => {
            let check = lastCheck;
            let checked = {};
            lastRooms = r.rooms;
            //lastCheck = {};
            for (let i of r.friends){
                checked[i.name] = true;
                let room = check[i.name];
                if (!room){
                    lastCheck[i.name] = i.roomid;
                    if (!firstCheck){
                        let room = undefined;
                        for (let t of r.rooms){
                            if (t.id == i.roomid){
                                room = t;
                                break;
                            }
                        }
                        if (room && room.players < room.maxplayers) {
                            notify("your friend "+i.name+" is online and joined '"+room.roomname+"' <a href=\"javascript:window.join("+i.roomid+");\">JOIN</a>");
                        }else if (room){
                            notify("your friend "+i.name+" is online and joined '"+room.roomname+"'");
                        }else{
                            notify("your friend "+i.name+" is online.");
                        }
                    }
                }else if (room != i.roomid){
                    lastCheck[i.name] = i.roomid;
                    if (!firstCheck){
                        let room = undefined;
                        for (let t of r.rooms){
                            if (t.id == i.roomid){
                                room = t;
                                break;
                            }
                        }
                        if (room && room.players < room.maxplayers) {
                            notify("your friend "+i.name+" has just joined '"+room.roomname+"' <a href=\"javascript:window.join("+i.roomid+");\">JOIN</a>");
                        }else if (room){
                            notify("your friend "+i.name+" has just joined '"+room.roomname+"'");
                        }else{
                            notify("your friend "+i.name+" has switched rooms.");
                        }
                    }
                }
            }
            firstCheck = false;
        });
    }
},4000);

const notify = (txt) => {
    const div = document.createElement('div');

    document.body.appendChild(div);
    div.innerHTML = `<div class="notify fade" style="
    flex: initial;
    top: 15;
    width: fit-content;
    display: flex;
    justify-content: center;
    margin: auto;
    align-items: center;
    background: #262626;
    height: fit-content;
    border-radius: 6px;
    pointer-events: all;
    top: 0px;
    position: relative;
"><div class="playerTitle" style="text-align: center; margin: 8px;">${txt}</div></div>`

    setTimeout(() => {
        div.remove();
    },20000);
}

window.fetch = async (url,method) => {
    let response = await feth(url,method);
    if (url.endsWith("login_auto_spice.php") || url.endsWith("login_register_multi.php")){
        let stream = response.clone();
        let r = await stream.json();
        document.querySelector("#appContainer > div.mainMenuFancy > div.playerStat > div.debugIcon > div.box").style.backgroundColor = getHexColor(localStorage.getItem('basic_col_1'));
        document.querySelector("#appContainer > div.mainMenuFancy > div.playerStat > div.debugIcon > div:nth-child(1)").textContent = r.username;
        let xp = r.xp;
        let level = Math.floor(Math.sqrt(xp/100)+1);
        let nextLevel = Math.floor(100 * Math.pow(level+1 - 1, 2));
        currentToken = localStorage.getItem("rememberToken");
        if (r.rememberToken && r.rememberToken.length > 1){
            currentToken = r.rememberToken;
        }
        currentSessionToken = r.token;
        currentName = r.username;
        document.querySelector("#appContainer > div.mainMenuFancy > div.playerStat > div.debugIcon > div.topBar.playerLevel").textContent = "Lv. "+level;
        document.querySelector("#appContainer > div.mainMenuFancy > div.playerStat > div.debugIcon > div:nth-child(4)").textContent = "Xp. "+xp+"/"+nextLevel;
    }
    return response
}

/*<div class="playerProfiles" style="
    position: absolute;
    left: 10px;
    top: 15px;
    width: 300px;
    background: #262626;
    height: 150px;
    border-radius: 25px;
    pointer-events: none;
">

    <div class="debugIcon" style="
    position:  absolute;
    width: 30px;
    height: 30px;
    top: 50px;
    left: 12px;
"><div class="topBar playerTitle" style="
    font-weight: 100;
    left: 25px;
    top: -15px;
">iMeowz</div><div class="box" style="background-color: rgb(41, 42, 46); width: 100%; height: 100%; rotate: 25deg;"></div>

</div></div>*/

let style = `
.profileButton {
    text-align: center;
    vertical-align: middle;
    height: 25px;
    width: 60px;
    font-size: 14px;
    cursor: pointer;
    background-color: #4a7ab1;
    color: #ebebeb;
    border-radius: 2px;
    position: absolute;
    line-height: 30px;
}

.fade {
    animation: fade 1.5s forwards;
}

@keyframes fade {
  0% { top: 0px; }
  100% { top: 80px; }
}
`
let styleSheet = document.createElement("style")
styleSheet.innerHTML = style;
document.head.appendChild(styleSheet)

window.deleteProfile = (x) => {
    let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    let profile = profiles[x];
    if (profile){
        let areyousure = prompt("Are you sure? Y/N");
        if (areyousure == 'Y' || areyousure == 'y' || areyousure == 'Yes' || areyousure == 'yes' || areyousure == 'YES') {
            profiles.splice(x,1);
        }
    }
    localStorage.setItem('profiles',JSON.stringify(profiles));
    document.querySelector("#appContainer > div.mainMenuFancy > div.playerProfiles").outerHTML = makeProfileList();
}

window.useProfile = (x) => {
    let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');

    let profile = profiles[x];
    if (profile){
        localStorage.setItem('rememberToken',profile.token);
        localStorage.setItem('basic_col_1',profile.color);
        location.reload();
    }
    document.querySelector("#appContainer > div.mainMenuFancy > div.playerProfiles").outerHTML = makeProfileList();
}

window.addList = () => {
    let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');

    let color = localStorage.getItem('basic_col_1');

    profiles.push({
        name: currentName,
        token: currentToken,
        color: color
    })

    localStorage.setItem('profiles',JSON.stringify(profiles));
    document.querySelector("#appContainer > div.mainMenuFancy > div.playerProfiles").outerHTML = makeProfileList();
}

const makeFriendList = async () => {
    let fdivs = '';
    if (currentSessionToken != ''){
let r = await fetch("https://hitbox.io/scripts/friends.php", {
  "headers": {
    "accept": "*/*",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "priority": "u=1, i",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site"
  },
  "referrer": "https://hitbox.io/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "token="+currentSessionToken+"&task=friends",
  "method": "POST",
  "mode": "cors",
  "credentials": "omit"
});
r = await r.json();
    }

return `<div class="friendList" style="
    margin: auto auto;
    width: 300px;
    position: relative;
    top: 25%;
    background: #262626;
    height: 500px;
    border-radius: 6px;
    overflow-y: scroll;
    pointer-events: all;
">
<div class="profileButton" onclick="window.refreshFriendlist()" style="opacity: 1; position: absolute; pointer-events: pointer; right: 5px; top: 15px;">Refresh</div>


</div>`
}

window.refreshFriendlist = async () => {
    friendlist = document.querySelector("body > div.friendList");
friendlist.outerHTML = `<div class="friendList" style="
    margin: auto auto;
    width: 300px;
    position: relative;
    top: 25%;
    background: #262626;
    height: 500px;
    border-radius: 6px;
    overflow-y: scroll;
    pointer-events: all;
"></div>`;
    friendlist = document.querySelector("body > div.friendList");
    friendlist.outerHTML = await makeFriendList();
}

const makeProfileList = () => {
    let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    let debugIcons = '';

    for (let x in profiles){
        let i = profiles[x];
        debugIcons += `<div class="debugIcon" style="width: 30px;height: 30px;margin-left: 25px;left: 12px;">
<div class="box" style="position: relative;top: 20px; background-color: ${getHexColor(i.color)}; width: 100%; height: 100%; rotate: 25deg;"></div>

<div class="topBar playerTitle" style="
    position: relative;
    top: -15px;
    left: 15px;
    font-weight: 100;
">${i.name}</div>

<div class="profileButton" onclick = "window.useProfile(${x})" style="position: relative; opacity: 1; left: 130px; top: -50px">USE</div>
<div class="profileButton" onclick = "window.deleteProfile(${x})" style="position: relative; opacity: 1; left: 200px; top: -75px">DELETE</div>

</div>`
    }
    return `<div class="playerProfiles" style="
    position: absolute;
    left: 10px;
    top: 35px;
    width: 300px;
    background: #262626;
    height: 150px;
    border-radius: 6px;
    overflow-y: scroll;
    pointer-events: all;
">

${debugIcons}

</div>`;
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

        let playerProfile = document.createElement('div');
        let friendlist = document.createElement('div');
        let profileList = document.createElement('div');

let a;
a = setInterval(async () => {
    let menuFancy = document.querySelector("#appContainer > div.mainMenuFancy")
    if (menuFancy)
    {
        menuFancy.appendChild(profileList);
        profileList.outerHTML = makeProfileList();
      /*  document.body.appendChild(friendlist);
        friendlist.outerHTML = await makeFriendList();*/
        menuFancy.appendChild(playerProfile);
        playerProfile.outerHTML = `<div class="playerStat" style="
    position: absolute;
    left: 10px;
    bottom: 15px;
    width: 300px;
    background: #262626;
    height: 150px;
    border-radius: 6px;
    pointer-events: all;
">
    <div class="topBar">Player Profile</div>
    <div class="profileButton" onclick="window.addList()" style="opacity: 1; position: absolute; pointer-events: pointer; right: 5px; top: 15px;">Add</div>
    <div class="debugIcon" style="
    position:  absolute;
    width: 30px;
    height: 30px;
    top: 50px;
    left: 12px;
"><div class="topBar playerTitle" style="
    font-weight: 100;
    left: 25px;
    top: -15px;
">loading</div><div class="box" style="background-color: rgb(255, 42, 46);width: 100%;height:  100%;rotate: 25deg;"></div><div class="topBar playerLevel" style="
    font-weight: 100;
    left: 25px;
    top: 10px;
    font-size: 12px;
    width: 300;
">Lv. loading</div>
<div class="topBar playerLevel" style="
    font-weight: 100;
    left: 25px;
    top: 25px;
    width: 300;
    font-size: 12px;
">Xp. loading</div>

</div>`
        clearInterval(a);
    }
},100);