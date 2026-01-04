// ==UserScript==
// @name         Neon's Hitbox mod but better
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A Mod menu for hitbox.io. press shift+a to open the menu or click the white square on the corner.
// @author       CarManiac
// @match        https://heav.io/game.html
// @match        https://hitbox.io/game.html
// @match        https://heav.io/game2.html
// @match        https://hitbox.io/game2.html
// @match        https://hitbox.io/game-beta.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heav.io
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/523606/Neon%27s%20Hitbox%20mod%20but%20better.user.js
// @updateURL https://update.greasyfork.org/scripts/523606/Neon%27s%20Hitbox%20mod%20but%20better.meta.js
// ==/UserScript==

let modmenu = document.createElement('div');
document.body.appendChild(modmenu);

const feth = window.fetch;
const abcarray = 'a b c d e f g h i j k l m n o p q r s t u v w x y z'.split(' ');
let bold = '𝐚 𝐛 𝐜 𝐝 𝐞 𝐟 𝐠 𝐡 𝐢 𝐣 𝐤 𝐥 𝐦 𝐧 𝐨 𝐩 𝐪 𝐫 𝐬 𝐭 𝐮 𝐯 𝐰 𝐱 𝐲 𝐳'.split(' ');
let italic = '𝙖 𝙗 𝙘 𝙙 𝙚 𝙛 𝙜 𝙝 𝙞 𝙟 𝙠 𝙡 𝙢 𝙣 𝙤 𝙥 𝙦 𝙧 𝙨 𝙩 𝙪 𝙫 𝙬 𝙭 𝙮 𝙯'.split(' ');
let strikethrough = 'a̶ ̶b̶ ̶c̶ ̶d̶ ̶e̶ ̶f̶ ̶g̶ ̶h̶ ̶i̶ ̶j̶ ̶k̶ ̶l̶ ̶m̶ ̶n̶ ̶o̶ ̶p̶ ̶q̶ ̶r̶ ̶s̶ ̶t̶ ̶u̶ ̶v̶ ̶w̶ ̶x̶ ̶y̶ ̶z̶'.split(' ');
let underline = 'a͟ ͟b͟ ͟c͟ ͟d͟ ͟e͟ ͟f͟ ͟g͟ ͟h͟ ͟i͟ ͟j͟ ͟k͟ ͟l͟ ͟m͟ ͟n͟ ͟o͟ ͟p͟ ͟q͟ ͟r͟ ͟s͟ ͟t͟ ͟u͟ ͟v͟ ͟w͟ ͟x͟ ͟y͟ ͟z͟'.split(' ');

function objy(params) {
    let t = {};
    for (let i of params.split('&')) {
        t[i.split('=')[0]] = i.split('=')[1];
    }
    return t;
}

let lastReplay;

window.fetch = async (url,method) => {
    let response = await feth(url,method);
    if (url.endsWith("replay_submit_spice.php")){
        let stream = response.clone();
        let r = objy(method.body);
        console.log(r);
        lastReplay = r;
    }
    return response;
}


let style = document.createElement('style');
style.innerHTML = `
  .styled-check {
  border-radius: 7px;
  vertical-align: middle;
  border: 1px solid black;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  background-color: #3b4353;
  cursor: pointer;
}

.styled-check:checked {
  appearance: none;
  background-color: #537aff;
  border: none;
  outline: none;
}

.styled-button:hover {
background-color: #23262d !important;
cursor: pointer;
}

.styled-text {
border: none;
outline: none;
background-color: #595b65;
color: white;
border-radius: 7px;
}

.selectable-text {
 -moz-user-select: text;
 -khtml-user-select: text;
 -webkit-user-select: text;
 -ms-user-select: text;
 user-select: text;
}
  `;
document.head.appendChild(style);
let botEnabled = false;
let quickplayEnabled = false;
let settings = {};

let echoList = [];

function addElementToKeyList(list,key,element,elements) {
    let divider = document.createElement('div');
    let content = list.querySelector('.content');
    content.appendChild(divider);
    divider.outerHTML = ` <div class="createWindow option divider lol" style="background-color: #17171c; width: calc(100% - 40px); font-size: 15px; height: 20px; margin: 5px; border-radius: 7px;">
    <span class="selectable-text">${window.hescape(`[ ${key} ] = " ${element} ";`)}</span>
    <div class="removeElement" style="cursor: pointer; top: 3px; display: inline-block; position: relative; left: 20px; width: 15px; height: 15px; border-radius: 7px; background-color: red;"></div>
    </div>`
    divider = document.querySelector('.lol');
    divider.classList.remove('lol');
    return divider;
}


function addElementToList(list,element,elements) {
    let divider = document.createElement('div');
    let content = list.querySelector('.content');
    content.appendChild(divider);
    divider.outerHTML = ` <div class="createWindow option divider lol" style="background-color: #17171c; width: calc(100% - 40px); font-size: 15px; height: 20px; margin: 5px; border-radius: 7px;">
    <span class="selectable-text">${window.hescape(element)}</span>
    <div class="removeElement" style="cursor: pointer; top: 3px; display: inline-block; position: relative; left: 20px; width: 15px; height: 15px; border-radius: 7px; background-color: red;"></div>
    </div>`
    divider = document.querySelector('.lol');
    divider.classList.remove('lol');
    return divider;
}

function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

function rgbInt(r,g,b) {
    return 256*256*r+256*g+b;
}

function addKeyList(tab,title,list,change) {
    let listTop = document.createElement('div');
    tab.appendChild(listTop);
    listTop.outerHTML = ` <div class="createWindow option list lol" style="width: calc(100% - 10px); font-size: 25px; min-height: 30px; height: calc(fit-content + 20px); margin: 15px; border-radius: 7px;">
    </p>${title}<p>
    <input placeholder="Key name" type="text" class="createWindow option styled-text key" style="display: block-inline; position: relative; top: -10px; width: 80px; height: 20px;"></input>
     <input placeholder="Key value" type="text" class="createWindow option styled-text value" style="position: relative; left: 10px; top: -10px; width: calc(100% - 120px); height: 20px;"></input>
    <div class="content" style="overflow-y: scroll; max-height: 200px; position: relative; top: 10px; background-color: #292d31; width: calc(100% - 10px); font-size: 20px; height: fit-content; margin: 5px; border-radius: 7px;"></div>
    </div>`
    listTop = document.querySelector('.lol');
    listTop.classList.remove('lol');
    let input = listTop.querySelector('.value');
    listTop.querySelector('.key').onkeydown = (e) => {
        if (e.which == 13) {
            input.focus();
        }
    }

    input.onkeydown = (e) => {
        if (e.which == 13) {
            let key = listTop.querySelector('.key').value;
            if (key.length < 1) {
                listTop.querySelector('.key').focus();
                return;
            }
            if (!list[key]) {
                let value = input.value;
                list[key] = value;
                let element = addElementToKeyList(listTop,key,value,list);
                input.value = '';
                listTop.querySelector('.key').value = '';
                change(list);
                element.children[1].onclick = () => {
                    delete list[key];
                    change(list);
                    element.remove();
                }
                setTimeout(() => {
                    document.activeElement.blur();
                },1);
            }
        }
    }
    for (let x in list) {
        let element = addElementToKeyList(listTop,x,list[x],list);
        input.value = '';
        element.children[1].onclick = () => {
            delete list[x];
            change(list);
            element.remove();
        }
    }
    return listTop;
}

function addList(tab,title,list,change) {
    let listTop = document.createElement('div');
    tab.appendChild(listTop);
    listTop.outerHTML = ` <div class="createWindow option list lol" style="width: calc(100% - 10px); font-size: 25px; min-height: 30px; height: calc(fit-content + 20px); margin: 15px; border-radius: 7px;">
    ${title}
    <input placeholder="add element" type="text" class="createWindow option styled-text" style="position: relative; top: 10px; width: calc(100% - 20px); height: 20px;"></input>
    <div class="content" style="overflow-y: scroll; max-height: 200px; position: relative; top: 10px; background-color: #292d31; width: calc(100% - 10px); font-size: 20px; height: fit-content; margin: 5px; border-radius: 7px;"></div>
    </div>`
    listTop = document.querySelector('.lol');
    listTop.classList.remove('lol');
    let input = listTop.querySelector('.styled-text');
    input.onkeydown = (e) => {
        if (e.which == 13) {
            if (!list.includes(input.value)) {
                let value = input.value;
                list.push(value);
                let element = addElementToList(listTop,value,list);
                input.value = '';
                change(list);
                element.children[1].onclick = () => {
                    list.splice(list.indexOf(value),1);
                    change(list);
                    element.remove();
                }
                setTimeout(() => {
                    document.activeElement.blur();
                },1);
            }
        }
    }
    for (let i of list) {
        let element = addElementToList(listTop,i,list);
        input.value = '';
        element.children[1].onclick = () => {
            list.splice(list.indexOf(i),1);
            change(list);
            element.remove();
        }
    }
    return listTop;
}

window.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName == "INPUT" && e.which != 13) {
        console.log('ha');
        e.stopImmediatePropagation()
        return;
    }
    if (e.which == 65 && e.shiftKey) {
        modmenu.style.display = modmenu.style.display == 'none'? 'block' : 'none';
        window.selectTab(lastTabSelected);
    }

    let comb = ((e.shiftKey? 'shift+' : '')+(e.altKey? 'alt+' : '')+e.key.toLowerCase()).split('+');
    for (let i in macro_scripts) {
        let x = macro_scripts[i];
        let keycomb = i.toLowerCase().split('+');
        let kc = true;
        for (let y of keycomb) {
            if (!comb.includes(y)) {
                kc = false;
                break;
            }
        }
        for (let y of comb) {
            if (!keycomb.includes(y)) {
                kc = false;
                break;
            }
        }
        if (kc) {
            eval(x);
        }
    }
},true)

function addDivider(tab,title) {
    let divider = document.createElement('div');
    tab.appendChild(divider);
    divider.outerHTML = ` <div class="createWindow option divider" style="text-align: center; width: calc(100% - 10px); font-size: 30px; height: 30px; margin: 5px; border-radius: 7px;">${title}</div>`
            }

function addDetail(tab,title) {
    let divider = document.createElement('div');
    tab.appendChild(divider);
    divider.outerHTML = ` <div class="createWindow option detail" style="width: calc(100% - 10px); font-size: 13px; height: 13px; margin: 5px; border-radius: 7px;">${title}</div>`
}


function addButton(tab,title) {
    let btn = document.createElement('div');
    tab.appendChild(btn);
    btn.outerHTML = ` <div class="createWindow option styled-button lol" style="background-color: #3d424d; width: calc(100% - 30px); font-size: 20px; height: 30px; margin-left: 20px; margin-top: 5px; border-radius: 7px;">${title}</div>`
    btn = document.querySelector('.lol');
    btn.classList.remove('lol');
    return btn;
}

function addColorPicker(tab) {
    let div = document.createElement('div');
    tab.appendChild(div);
    div.outerHTML = `<div class="lol">
    <input value="#ffffff" type="color" class="createWindow option styled-button picker" style="background-color: #3d424d; width: 40px; height: 40px; margin-left: 20px; margin-top: 5px; border-radius: 7px;"></input>
    </div>`
    div = document.querySelector('.lol');
    div.classList.remove('lol');
    return div.querySelector('.picker');
}

function addCheckButton(tab,title,checked) {
    let check = document.createElement('div');
    tab.appendChild(check);
    check.outerHTML = ` <div class="createWindow option check lol" style="background-color: #25262a; width: calc(100% - 10px); font-size: 25px; height: 30px; margin: 5px; border-radius: 7px;">${title}</div>`
    check = document.querySelector('.lol');
    check.classList.remove('lol');
    let input = document.createElement('input');
    check.appendChild(input);
    input.outerHTML = ` <input type="checkbox" style="accent-color: #454755; top: -5px; position: relative; width: 20px;height: 20px;" class="styled-check tab input lol"></input>`
    input = document.querySelector('.lol');
    input.classList.remove('lol');
    input.checked = checked;
    return input;
}

let highestMapId = 0;
let bwLIST = JSON.parse(localStorage.getItem('bannedwords') || '[]');
let bLIST = JSON.parse(localStorage.getItem('staffList') || '[]');
let kickAFK = false;
let wList = JSON.parse(localStorage.getItem('JoinList') || '[]');
let levels = (localStorage.getItem('levels') == 'true');
let pingcolor = (localStorage.getItem('pingcolor') == 'true');
let recolorAllPlayers = (localStorage.getItem('recolor') == 'true');
let minmode = (localStorage.getItem('minmode') == 'true');
let playerBox = (localStorage.getItem('playerBox') == 'true');
let trailDisabled = (localStorage.getItem('trailDisabled') == 'true');
let kickLaggy = false;
let macro_scripts = JSON.parse(localStorage.getItem('macros') || '{}');
let custom_emojis = JSON.parse(localStorage.getItem('emojis') || '{}');
let playerPickerColor = localStorage.getItem('playerPickerColor') || "#ffffff";

fetch("https://hitbox.io/scripts/map_get_newest_spice.php", {
    "headers": {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded",
        "priority": "u=1, i",
    },
    "body": "startingfrom=0",
    "method": "POST",
})
    .then(r => r.json())
    .then(r => {
    highestMapId = r.maps[0].id-602;
});

let lastTabSelected = 'Hosting & Utils';

const modMenuTabs = {
    "Hosting & Utils": function (tab) {
        if (myid != hostId) {
            tab.style.opacity = .3;
            tab.style.pointerEvents = 'none';
            addDivider(tab,"You need to be host to use this tab.");
        }
        addDetail(tab,"Press shift+a to open the menu");
        addDivider(tab,"Teams");
        addButton(tab,'Move all Blue').onclick = () => {
            for (let i of users) {
                WSS.send(`42[1,[47,{"i":${i.id},"t":3}]]`)
            }
        };
        addButton(tab,'Move all Red').onclick = () => {
            for (let i of users) {
                WSS.send(`42[1,[47,{"i":${i.id},"t":2}]]`)
            }
        };
        addButton(tab,'Shuffle teams').onclick = () => {
            let teams = [2,3].sort(() => .5 - Math.random());
            let score = [0,0,0,0,0];
            for (let i of [...users].sort(() => .5 - Math.random())) {
                let team = -1;
                let lowest = 1/0;
                for (let x of teams) {
                    if (score[x] < lowest) {
                        lowest = score[x];
                        team = x;
                    }
                }
                score[team] += 1;
                WSS.send(`42[1,[47,{"i":${i.id},"t":${team}}]]`)
            }
        };
        addButton(tab,'Move all Spec').onclick = () => {
            for (let i of users) {
                WSS.send(`42[1,[47,{"i":${i.id},"t":0}]]`)
            }
        };
        addButton(tab,'Move all FFA').onclick = () => {
            for (let i of users) {
                WSS.send(`42[1,[47,{"i":${i.id},"t":1}]]`)
            }
        };
        addDivider(tab,"Auto hosting");
        let qpb = addCheckButton(tab,"Quickplay enabled? | ",quickplayEnabled);
        addDetail(tab,"Idle hosting. automatically starts a new map after round end.");
        qpb.onchange = () => {
            quickplayEnabled = qpb.checked;
        };
if (!document.getElementById('rngMapButton')) {
    let rngMap = document.createElement('button');
    rngMap.textContent = 'Random Map';
    rngMap.id = 'rngMapButton';

    let startButton = document.createElement('button');
    startButton.textContent = 'Start Cycling';
    startButton.id = 'startButton';

    let stopButton = document.createElement('button');
    stopButton.textContent = 'Stop Cycling';
    stopButton.id = 'stopButton';

    let filterInput = document.createElement('input');
    filterInput.id = 'filterInput';
    filterInput.placeholder = 'Filter by Map Name';

    let authorFilterInput = document.createElement('input');
    authorFilterInput.id = 'authorFilterInput';
    authorFilterInput.placeholder = 'Filter by Author Name';

    let filterButton = document.createElement('button');
    filterButton.textContent = 'Apply Filter';
    filterButton.id = 'filterButton';

    rngMap.style.position = 'fixed';
    startButton.style.position = 'fixed';
    stopButton.style.position = 'fixed';
    filterInput.style.position = 'fixed';
    authorFilterInput.style.position = 'fixed';
    filterButton.style.position = 'fixed';

    rngMap.style.top = '10px';
    rngMap.style.left = '10px';

    startButton.style.top = '10px';
    startButton.style.left = '120px';

    stopButton.style.top = '10px';
    stopButton.style.left = '230px';

    filterInput.style.top = '10px';
    filterInput.style.left = '340px';

    authorFilterInput.style.top = '10px';
    authorFilterInput.style.left = '500px';

    filterButton.style.top = '10px';
    filterButton.style.left = '660px';

    document.body.appendChild(rngMap);
    document.body.appendChild(startButton);
    document.body.appendChild(stopButton);
    document.body.appendChild(filterInput);
    document.body.appendChild(authorFilterInput);
    document.body.appendChild(filterButton);
}

let cyclingInterval;
let checkingInterval;
let targetMapName = '';
let targetAuthorName = '';

let rngMap = document.getElementById('rngMapButton');
let startButton = document.getElementById('startButton');
let stopButton = document.getElementById('stopButton');
let filterInput = document.getElementById('filterInput');
let authorFilterInput = document.getElementById('authorFilterInput');
let filterButton = document.getElementById('filterButton');

startButton.onclick = () => {
    if (!cyclingInterval) {
        cyclingInterval = setInterval(() => {
            rngMap.onclick();
        }, 2000);
        console.log('Cycling started.');
    }

    if (!checkingInterval) {
        checkingInterval = setInterval(() => {
            checkForMatch();
        }, 500);
        console.log('Match-checking started.');
    }
};

stopButton.onclick = () => {
    if (cyclingInterval) {
        clearInterval(cyclingInterval);
        cyclingInterval = null;
        console.log('Cycling stopped.');
    }
    if (checkingInterval) {
        clearInterval(checkingInterval);
        checkingInterval = null;
        console.log('Match-checking stopped.');
    }
};

filterButton.onclick = () => {
    targetMapName = filterInput.value.trim().toLowerCase();
    targetAuthorName = authorFilterInput.value.trim().toLowerCase();
    console.log(`Filtering by: Map - ${targetMapName}, Author - ${targetAuthorName}`);
};

rngMap.onclick = () => {
    modmenu.style.display = 'none';
    WSS.send(`42[1,[42,${Math.floor(Math.random() * highestMapId) + 602}]]`);
};

function checkForMatch() {
    let mapNameElement = document.querySelector('.name');
    let authorNameElement = document.querySelector('.author');

    if (mapNameElement && authorNameElement) {
        let mapName = mapNameElement.textContent.trim().toLowerCase();
        let authorName = authorNameElement.textContent.trim().toLowerCase();

        console.log(`Checking Map: ${mapName}, Author: ${authorName}`);
        if (
            (targetMapName && mapName.includes(targetMapName)) ||
            (targetAuthorName && authorName.includes(targetAuthorName))
        ) {
            console.log(`Found match! Map: ${mapName}, Author: ${authorName}`);
            clearInterval(cyclingInterval);
            clearInterval(checkingInterval);
            cyclingInterval = null;
            checkingInterval = null;
            console.log('Stopped all activities due to filter match.');
        }
    } else {
        console.log('Map name or author not found!');
    }
}


        let kkp = addCheckButton(tab,"Auto kick Laggy? (700+ ms) | ",kickLaggy);
        kkp.onchange = () => {
            kickLaggy = kkp.checked;
        };
        let kka = addCheckButton(tab,"Auto kick AFK? (afk for 2 minutes) | ",kickAFK);
        kka.onchange = () => {
            kickAFK = kka.checked;
        };
        addList(tab,"Banned words",bwLIST,(e) => {
            bwLIST = e;
            localStorage.setItem('bannedwords',JSON.stringify(bwLIST));
        });
        addList(tab,"Staff list",bLIST,(e) => {
            for (let i in e) {
                e[i] = e[i].toLowerCase();
            }
            bLIST = e;
            localStorage.setItem('staffList',JSON.stringify(bLIST));
        });

        addDetail(tab,"List of players that are unbannable");
        addDetail(tab,"And allowed to run exclusive bot commands");
        addDetail(tab,"Useful if you don't want certain players affected by anti-afk or anti-ping");
        addList(tab,"Welcome List",wList,(e) => {
            for (let i in e) {
                e[i] = e[i].toLowerCase();
            }
            wList = e;
            localStorage.setItem('JoinList',JSON.stringify(wList));
        });
        addDetail(tab,"List of random messages that are sent when a player joins");
        addDetail(tab,"insert '{{user}}' to say the player's name");
        addDetail(tab,"insert '{{level}}' to say the player's level");
        addDivider(tab,"Settings");
        addButton(tab,'Download Settings').onclick = () => {
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings)));
            element.setAttribute('download', 'game_settings.json');

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        };
        addDetail(tab,"Download current game settings as a file to import later");
        addButton(tab,'Import Settings').onclick = () => {
            let input = document.createElement('input');
            input.setAttribute('accept','.json');
            input.type = 'file';
            input.click();
            input.onchange = (e) => {
                let a = e.target.files[0];
                const reader = new FileReader();
                reader.onload = () => {
                    WSS.send('42'+JSON.stringify([1,[62,JSON.parse(reader.result)]]));
                    WSS.onmessage({data:'42'+JSON.stringify([63,JSON.parse(reader.result)])})
                    modmenu.style.display = 'none';
                }
                reader.readAsText(a);
            }
        }
    },
    "Fun & Misc": function (tab,tabName) {
        addDivider(tab,"Bot");
        let bbn = addCheckButton(tab,"Bot enabled? | ",botEnabled);
        bbn.onchange = () => {
            botEnabled = bbn.checked;
        };
        addDivider(tab,"Chat");
        addList(tab,"Copy players",echoList,(e) => {
            echoList = e;
        });
        addButton(tab,'Clear List').onclick = () => {
            echoList = [];
            window.selectTab(tabName);
        };
        addDetail(tab,"Echo list | Copy any message a player included in the list sends.");
    },
    "Visual": function (tab,tabName) {
        addDivider(tab,"Players");
        let bbn = addCheckButton(tab,"Show player levels ingame",levels);
        bbn.onchange = () => {
            levels = bbn.checked;
            localStorage.setItem('levels',levels);
        };
        addDetail(tab,'Shows levels and indicators next to player names.');
        let bbt = addCheckButton(tab,"Laggy Colors",pingcolor);
        bbt.onchange = () => {
            pingcolor = bbt.checked;
            localStorage.setItem('pingcolor',pingcolor);
        };
        addDetail(tab,'Colors player names based on how laggy they are.');
        let ming = addCheckButton(tab,"Mini display",minmode);
        addDetail(tab,'Shorter player names, Display their ID on the side');
        ming.onchange = () => {
            minmode = ming.checked;
            localStorage.setItem('minmode',minmode);
        };
        let tt = addCheckButton(tab,"Trail disabled",trailDisabled);
        tt.onchange = () => {
            trailDisabled = tt.checked;
            localStorage.setItem('trailDisabled',trailDisabled);
        };
        addDetail(tab,'Disables trails behind players.');
        let pb = addCheckButton(tab,"Jump Box",playerBox);
        pb.onchange = () => {
            playerBox = pb.checked;
            localStorage.setItem('playerBox',playerBox);
        };
        addDetail(tab,'Shows funni box for parkour alignment');
        addDetail(tab,'Recolor players')
        let picker = addColorPicker(tab);
        picker.value = playerPickerColor;
        picker.onchange = () => {
            playerPickerColor = picker.value;
            localStorage.setItem('playerPickerColor',picker.value);
            if (recolorAllPlayers) {
                for (let i in users) {
                    let x = users[i];
                    if (x.id != myid) {
                        WSS.onmessage({data:`42[41, ${x.id}, {"1": ${rgbInt(...hexToRgb(playerPickerColor))}}]`,forged: true});
                    }
                }
            }
        }
        let ccc = addCheckButton(tab,'Recolor Players',recolorAllPlayers);
        addDetail(tab,'All players will be recolored to the color picked above.')
        ccc.onchange = () => {
            recolorAllPlayers = ccc.checked;
            localStorage.setItem('recolor',recolorAllPlayers);
            if (recolorAllPlayers) {
                for (let i in users) {
                    let x = users[i];
                    x.lastcolor = x.color;
                    if (x.id != myid) {
                        WSS.onmessage({data:`42[41, ${x.id}, {"1": ${rgbInt(...hexToRgb(playerPickerColor))}}]`,forged: true});
                    }
                }
            }else{
                for (let i in users) {
                    let x = users[i];
                    if (x.lastcolor) {
                        WSS.onmessage({data:`42[41, ${x.id}, {"1": ${x.lastcolor}}]`,forged: true});
                    }
                }
            }
        }

        addDivider(tab,"World");

    },
    "Replays": function (tab,tabName) {
        addButton(tab,"Download last replay").onclick = () => {
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(lastReplay)));
            element.setAttribute('download', 'replay-'+Date.now()+'.json');

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }
    },
    "Script": function (tab,tabName) {
        addDivider(tab,'Macros');
        addKeyList(tab,"Scripts",macro_scripts,(e) => {
            macro_scripts = e;
            localStorage.setItem('macros',JSON.stringify(e));
        })
        addDetail(tab,'Bind short cuts to scripts')
        addDetail(tab,'Set key to the shortcut and value to your script.');
        addKeyList(tab,"Chat Shortcuts",custom_emojis,(e) => {
            custom_emojis = e;
            localStorage.setItem('emojis',JSON.stringify(e));
        })
        addDetail(tab,'Automatically replace a shortcut when you send a message')
    }
}


function botCommands(user,cmd) {
    if (!botEnabled) return;
}

let modMenuButton = document.createElement('div');
document.body.appendChild(modMenuButton);
modMenuButton.outerHTML = `<div class="modmenubutton" style="position: absolute; right: 15px; top: 50px; width: 30px; height: 30px; border-radius: 10px; background-color: #ffffff;"></div>`

    modmenu.outerHTML = `<div style="opacity: .95; display: none; z-index: 9999999; right: 90px; top: 90px; position: absolute; width: calc(100% - 170px); height: calc(100% - 180px); background-color: #25262a; border-radius: 7px;" class="createWindow modMenu">
       <div class="createWindow modMenuTabs" style="background-color: #131616; position: absolute; top: 20px; left: 20px; width: 200px; height: calc(100% - 40px); border-radius: 7px;"></div>
       <div class="createWindow openTab" style="overflow-x: hidden; background-color: #131616; overflow-y: scroll; position: absolute; top: 20; left: 240px; width: calc(100% - 280px); height: calc(100% - 40px); border-radius: 7px;"></div>
</div>`
    modmenu = document.querySelector('.modMenu');

modMenuButton = document.querySelector(".modmenubutton");
modMenuButton.onclick = () => {
    modmenu.style.display = modmenu.style.display == 'none'? 'block' : 'none';
    window.selectTab(lastTabSelected);
}

const tabs = document.querySelector('.createWindow .modMenuTabs');
const openTab = document.querySelector('.createWindow .openTab');

window.selectTab = (tab) => {
    lastTabSelected = tab;
    openTab.style.opacity = '1';
    openTab.style.pointerEvents = 'all';
    openTab.replaceChildren();
    modMenuTabs[tab](openTab,tab);
}

for (let i in modMenuTabs) {
    let tabButton = document.createElement('div');
    tabs.appendChild(tabButton);
    tabButton.outerHTML = `<div onclick="javascript:window.selectTab('${i}');" class="createWindow tab" style="cursor: pointer; background-color: #25262a; width: calc(100% - 10px); font-size: 25px; height: 30px; margin: 5px; border-radius: 7px;">${i}</div>`
    }

const codeNames = {};
const codeNamesRegex = {
    "simulation": {
        reg: /\];\}.{0,2}\(.{0,3}\) {var .{0,3},.{0,3},.{0,3},.{0,3},.{0,3},.{0,3};(.*?)\{throw new Error\("Failed to simulate(.*?)\);\}(.*?)\.step\((.*?)\);(.*?).{0,2}\(\);(.*?)\}.{0,2}\(\)/ig,
        verify: function(match)
        {
            //console.log(match);
            let world = match[0].match(/this\..{2,2}\.step\(/ig)[0];
            let sim = match[0].split(";}")[1].split("(")[0];
            //console.log(sim);
            let thisses = match[0].split("this.");
            //console.log(thisses);
            for (let i of thisses){
                if (i.match("=")){
                    i = i.split("=")[0];
                }else{
                    i = null;
                }
            }
            thisses.filter(a => a != null);
            //console.log(thisses);
            //console.log([sim,thisses[1].split(".")[0],thisses[1].split(".")[1].split("(")[0]]);
            return [sim,thisses[1].split(".")[0],thisses[1].split(".")[1].split("(")[0],world.split("this.")[1].split(".")[0]];
        }
    },
}


//funny
setInterval(() => {
    if (hostId == myid && kickAFK) {
        for (let i of users) {
            if (Date.now() > i.act+120000 && !bLIST.includes(i.name.toLowerCase())) {
                WSS.send(`42[1,[32,{"id":${i.id},"ban":0}]]`);
            }
        }
    }
},1000);

parent.document.getElementById("adboxverticalright").style.top = "-200%";
parent.document.getElementById("adboxverticalleft").style.top = "-200%";

const lerpNumber = function(a, b, weight) {
    return ((1 - weight) * a + weight * b);
};


let bot = false;
let myid = -1;
let quickplay = false;
let qpdelay = 0;
let hostId = -2;

let DN = [
    "gsFightersCollide",
    "recordMode",
    "o",
    "l",
    "u",
    "m",
    "g",
    "v",
    "k",
    "N",
    "S",
    "M",
    "C",
    "_",
    "T",
    "P",
    "B",
    "I",
    "F",
    "R",
    "O",
    "A",
    "D",
    "L",
    "U",
    "H",
    "J",
    "W",
    "G",
    "Y", // ss
    "V",
    "q",
    "K",
    "X",
    "Z",
    "$",
    "tt",
    "it",
    "st",
    "ht",
    "et",
    "nt",
    "ot",
    "rt",
    "at",
    "lt",
    "ut",
    "ct",
    "dt",
    "wt",
    "ft",
    "gt",
    "bt"
]

let stateMaker;
let mostScore = -1;

for (let a1 in window.multiplayerSession){
    let a = window.multiplayerSession[a1];
    if (typeof a == "object")
    {
        let score = 0;
        for (let x1 in a){
            let x = a[x1];
            if (typeof x == "object")
            {
                if (x.constructor.name == "Array"){

                }
                else
                {
                    let length = 0;
                    for (let y1 in x){
                        let y = x[y1];
                        length++
                        if (length > 2){
                            break;
                        }
                    }
                    if (length == 1){
                        for (let y1 in x){
                            let y = x[y1];
                            if (y.constructor.name == "Map"){
                                score++
                            }
                            break;
                        }
                    }else{
                        let isDN = true;
                        for (let i of DN){
                            if (!i in x){
                                isDN = false;
                                break;
                            }
                        }
                        if (isDN){
                            score+=5;
                        }
                    }
                }
            }
        }
        if (score > mostScore && score < 52){
            mostScore = score;
            stateMaker = a;
        }
    }
}

function buildArray(sample) {
    const sampleVar = String(sample.constructor).match(/this\.(.*?)=/ig);
    const sampleArray = [];
    for (let i of sampleVar) {
        if (i && i.match("=")) {
            sampleArray.push(i.split("this.")[1].split("=")[0]);
        }
    }
    return sampleArray;
}

const KRArray = buildArray(stateMaker);
console.log(KRArray,'krarray');
const HB = stateMaker[KRArray[24]];
const HBArray = buildArray(HB);
console.log(HBArray,'HB');

let plrArray;

HB.rre = HB.render;

// 10 - NameBG
// 11,12 - Stamina
// 14 - jump
// 13 - name
// 0 - trail
// 8 - cube

HB.render = (...args) => {
    const playerArray = HB[HBArray[0]];
    if (playerArray[8]) {
        for (let x in playerArray[8]) {
            let y = playerArray[8][x];
            if (y) {
                if (!plrArray) {
                    plrArray = buildArray(y);
                    console.log(plrArray,'plrArray');
                }
                let user = findUser(x);
                let display = y[plrArray[1]];
                if (display.children[17] && user) {
                    let name = display.children[13];
                    if (playerBox) {
                        let width = (display.children[8]._w || display.children[8].width)*1.2;
                        if (!display.children[8]._w) {
                            display.children[8]._w = width;
                        }
                        if (!user.b || user.b.parent != display.children[8]) {
                            if (user.b) {
                                user.b.destroy();
                                delete user.b;
                            }
                            var b = new PIXI.Graphics();
                            //b.beginFill(0xFFFF00);
                            b.lineStyle(.1, 0xFFFFFF);
                            b.drawRect(-.5, -.5, 1, 1);
                            b.drawRect(-1.7/2, -.05, 1.7, .1);
                            b.drawRect(-.05, -1.7/2, .1, 1.7);

                            display.children[8].addChild(b);
                            user.b = b;
                            user.b.alpha = .25;
                        }
                        user.b.width = width;
                        user.b.height = width;
                        let rot = (Math.round(user.b.angle/45)*45);
                        user.b.tint = rot % 90 != 0? 0xFF0000 : 0xffffff;
                        user.b.angle = -display.children[8].angle;
                    }else{
                        if (user.b) {
                            user.b.destroy();
                            delete user.b;
                        }
                    }
                    let playerName = user.mininame || user.name;
                    if (display.children[0]) {
                        display.children[0].visible = !trailDisabled;
                    }
                    if (minmode) {
                        if (!user.mininame || display.children[10].visible) {
                            playerName = `${user.id}-${user.name.toLowerCase().replaceAll(' ','').replaceAll('_','').slice(0,3)}`;
                            user.mininame = playerName;
                            display.children[10].visible = false;
                            display.children[14].alpha = .25;
                        }
                    }else if (user.mininame){
                        display.children[10].visible = true;
                        display.children[14].alpha = 1;
                        delete user.mininame;
                    }
                    if (name && levels) {
                        name.text = `${playerName}. ${user.lvl}${hostId == user.id? '👑' : ''}`;
                    }else{
                        name.text = playerName;
                    }
                    if (pingcolor && user.LagStrikes) {
                        if (user.LagStrikes > 3) {
                            name.tint = 0xff0000;
                        }else if (user.LagStrikes > 1) {
                            name.tint = 0xffff00;
                        }else{
                            name.tint = 0xffffff;
                        }
                    }
                }
            }
        }
    }
    return HB.rre(...args);
}

/*
    if (this.parent && this._text) {
        let user = findUser(this._text);
        if (!user && this._text.includes('. ')) {
            user = findUser(this._text.split('. ')[0]);
        }
        if (user) {
            if (levels) {
                if (!this._text.includes('. ')) {
                    this.text = user.name+'. '+user.lvl+(myid == user.id? '🔺' : '🔹');
                }
            }else{
                if (this._text.includes('. ')) {
                    this.text = user.name;
                }
            }
            if (pingcolor && user.LagStrikes) {
                if (user.LagStrikes > 3) {
                    this.tint = 0xff0000;
                }else if (user.LagStrikes > 1) {
                    this.tint = 0xffff00;
                }else{
                    this.tint = 0xffffff;
                }
            }
        }
    }
*/

let users = [];

window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
    apply( target, thisArgs, args ) {
        Reflect.apply(...arguments);
    }
})

//Nm vm Sm

const originalSend = window.WebSocket.prototype.send;
const excludewss = [];
let WSS = 0;

function findUser(id){
    return users[id-0] || (() => {
        for (let t in users) {
            let o = users[t];
            if (o.name == id || o.id == id){
                return o;
            }
        }
    })();
}

window.WebSocket.prototype.send = function(args) {
    if(this.url.includes("/socket.io/?EIO=3&transport=websocket&sid=")){
        if(typeof(args) == "string" && !excludewss.includes(this)){
            if (!WSS){
                WSS = this;
                window.WS = this;
            }
            if (WSS == this){
                if (args.startsWith('42[1,[')) {
                    try{
                        let packet = JSON.parse(args.slice(5,-1))
                        if (packet[0] == 62) {
                            settings = packet[1];
                        }
                        if (packet[0] == 28) {
                            let msg = packet[1];
                            for (let i in custom_emojis) {
                             msg = msg.replaceAll(i,custom_emojis[i]);
                            }
                            let matches1 = msg.match(/\*\*(.*?)\*\*/ig);
                            if (matches1) {
                                for (let i of matches1){
                                    let x = i;
                                    for (let y in bold) {
                                        let z = abcarray[y];
                                        let c = bold[y];
                                        x = x.replaceAll(z,c)
                                    }
                                    msg = msg.replace(i,x.slice(2,-2));
                                }
                            }
                            let matches2 = msg.match(/\*(.*?)\*/ig);
                            if (matches2) {
                                for (let i of matches2){
                                    let x = i;
                                    for (let y in italic) {
                                        let z = abcarray[y];
                                        let c = italic[y];
                                        x = x.replaceAll(z,c)
                                    }
                                    msg = msg.replace(i,x.slice(1,-1));
                                }
                            }
                            let matches3 = msg.match(/\~\~(.*?)\~\~/ig);
                            if (matches3) {
                                for (let i of matches3){
                                    let x = i;
                                    for (let y in strikethrough) {
                                        let z = abcarray[y];
                                        let c = strikethrough[y];
                                        x = x.replaceAll(z,c)
                                    }
                                    msg = msg.replace(i,x.slice(2,-2));
                                }
                            }
                            let matches4 = msg.match(/\_\_(.*?)\_\_/ig);
                            if (matches4) {
                                for (let i of matches4){
                                    let x = i;
                                    for (let y in underline) {
                                        let z = abcarray[y];
                                        let c = underline[y];
                                        x = x.replaceAll(z,c)
                                    }
                                    msg = msg.replace(i,x.slice(2,-2));
                                }
                            }
                            args = '42'+JSON.stringify([1,[28,msg]]);
                        }
                        if (quickplayEnabled) {
                            if (packet[0] == 68 && myid == hostId) {
                                WSS.send(`42[1,[42,${Math.floor(Math.random()*highestMapId)+602}]]`);
                                setTimeout(() => {document.querySelector("#appContainer > div.lobbyContainer > div.settingsBox > div.startButton.settingsButton").click();},500);
                            }
                        }
                    }catch(error){}
                }else if (args.startsWith('42[2,')) {
                    myid = 0;
                    hostId = 0;
                }
            }else{
                excludewss.push(this);
            }
            //console.log('SENT',args);
        }
        if (!this.injected){
            this.injected = true;
            const originalClose = this.onclose;
            this.onclose = (...args) => {
                if (WSS == this){
                    WSS = 0;
                    users = [];
                    hostId = -2;
                    quickplay = false;
                }
                originalClose.call(this,...args);
            }
            this.onmessage2 = this.onmessage;
            this.onmessage = function(event){
                if(!excludewss.includes(this) && typeof(event.data) == 'string'){
                    if (event.data.startsWith('42[')){
                        let packet = JSON.parse(event.data.slice(2,event.data.length));
                        if (packet[0] == 16) {
                            settings = packet[1][0];
                        }
                        if (packet[0] == 63) {
                            settings = packet[1];
                        }
                        if (packet[0] == 41 && !event.forged) {
                            let user = findUser(packet[1]);
                            if (user) {
                                user.color = packet[2]["1"];
                                user.lastcolor = packet[2]["1"];
                                if (recolorAllPlayers && user.id !== myid) {
                                    WSS.onmessage({data:`42[41, ${packet[1]}, {"1": ${rgbInt(...hexToRgb(playerPickerColor))}}]`,forged: true});
                                    return;
                                }
                            }
                        }
                        if (packet[0] == 35) {
                            for (let i of packet[1]) {
                                let user = findUser(i.i);
                                if (!user.LagStrikes) {
                                    user.LagStrikes = 0;
                                }
                                if (i.p > 250) {
                                    user.LagStrikes += 1;
                                    if (i.p < 700 && user.LagStrikes > 2) {
                                        user.LagStrikes = 2;
                                    }
                                    if (hostId == myid && user.id != hostId && user.LagStrikes > 6 && !bLIST.includes(user.name.toLowerCase()) && kickLaggy) {
                                        WSS.send(`42[1,[32,{"id":${user.id},"ban":0}]]`);
                                    }
                                }else{
                                    if (user.LagStrikes > 0) {
                                        user.LagStrikes -= .5;
                                    }
                                }
                            }
                        }
                        if (packet[0] == 12) {
                            let user = findUser(packet[1][3]);
                            if (user) {
                                user.act = Date.now();
                            }
                        }
                        if (packet[0] == 7){
                            users = [];
                            myid = packet[1][0]
                            hostId = packet[1][1];
                            for (let i of packet[1][3]){
                                users[i[4]] = ({"act": Date.now(),"team": i[2],"color":(i[7][0] || i[7][1]),"name":i[0],"id":i[4],"lvl":i[6]});
                                if (recolorAllPlayers) {
                                    let user = findUser(i[4]);
                                    user.lastcolor = user.color;
                                    setTimeout(() => {
                                        if (user.id != myid) {
                                            WSS.onmessage({data:`42[41, ${user.id}, {"1": ${rgbInt(...hexToRgb(playerPickerColor))}}]`,forged: true});
                                        }
                                    },10);
                                }
                            }
                        }
                        if (packet[0] == 29) {
                            let user = findUser(packet[1]);
                            user.act = Date.now();
                            if (echoList.includes(user.name)) {
                                WSS.send('42'+JSON.stringify([1,[28,packet[2]]]));
                            }
                            if (hostId == myid && !bLIST.includes(user.name.toLowerCase())) {
                                for (let i of bwLIST) {
                                    if (packet[2].toLowerCase().includes(i.toLowerCase())) {
                                        WSS.send(`42[1,[32,{"id":${user.id},"ban":0}]]`);
                                    }
                                }
                            }
                            botCommands(user,packet[2]);
                        }
                        if (packet[0] == 25){
                            let plr = findUser(packet[1]);
                            if (plr){
                                plr.team = packet[2];
                            }
                        }
                        if (packet[0] == 9){
                            hostId = packet[2];
                            let user = findUser(packet[1]);
                            if (user){
                                if (user.pet){
                                    user.pet.destroy();
                                    user.pet = null;
                                }
                                delete users[packet[1]];
                            }
                        }
                        if (packet[0] == 45){
                            hostId = packet[1];
                            if (hostId != myid){
                                quickplay = false;
                            }
                        }
                        if (packet[0] == 8){
                            users[packet[1][4]] = ({"act": Date.now(),"name":packet[1][0],"color":(packet[7]? (packet[7][1] || packet[7][0]):0),"team":packet[1][2],"id":packet[1][4],"lvl":packet[1][6]});
                            let user = findUser(packet[1][4]);
                            if (hostId == myid) {
                                if (wList.length > 0) {
                                    let msg = wList[Math.floor(Math.random()*wList.length)].replaceAll('{{user}}',user.name).replaceAll('{{level}}',user.lvl);
                                    WSS.send('42'+JSON.stringify([1,[28,msg]]));
                                }
                            }
                            if (recolorAllPlayers) {
                                user.lastcolor = user.color;
                                setTimeout(() => {
                                    if (user.id != myid) {
                                        WSS.onmessage({data:`42[41, ${user.id}, {"1": ${rgbInt(...hexToRgb(playerPickerColor))}}]`,forged: true});
                                    }
                                },100);
                            }
                        }
                    }
                }
                this.onmessage2(event);
            }
        }
    }
    return originalSend.call(this, args);
}

let chats = document.getElementsByClassName('content');
let inputs = document.getElementsByClassName('input');

let chatI = [];

for (let c of inputs){
    if (c.parentElement.classList.contains('inGameChat') || c.parentElement.classList.contains('chatBox')){
        chatI.push(c);
    }
}


window.hescape = (s) => {
    let lookup = {'$':'&#36;','%':'&#37;','.':'&#46;','+':'&#43;','-':'&#45;','&':"&amp;",'"': "&quot;",'\'': "&apos;",'<': "&lt;",'*':'&#42;','=':'&#61;','>': "&gt;",'#':'&#35;',':':'&#58;',';':'&#59;','`':'&#96;'};
    return s.replace( /[\*=%#\-+&"'<>]/g, c => lookup[c] );
}

function getRGBFromNUM(colorID,offset,max){
    const red = (colorID >> 16) & 0xFF;
    const green = (colorID >> 8) & 0xFF;
    const blue = colorID & 0xFF;

    // Construct the RGB color representation
    return `rgb(${Math.max(max || 0,red-(offset || 0))}, ${Math.max(max || 0,green-(offset || 0))}, ${Math.max(max || 0,blue-(offset || 0))})`;
}


function display(text,ingamecolor,lobbycolor,sanitize){
    if (WSS){
        let div = document.createElement('div');
        div.classList.add('statusContainer');
        let span = document.createElement('span');
        span.classList.add('status');
        span.style.color = lobbycolor || "#ffffff";
        if (sanitize != false){
            span.textContent = text;
        }else{
            span.innerHTML = text;
        }
        span.style.backgroundColor = 'rgba(37, 38, 42, 0.768627451)';
        div.style.borderRadius = '7px';
        div.appendChild(span);
        let clone = div.cloneNode(true);
        clone.children[0].style.color = ingamecolor || '#ffffff';
        setTimeout(() => {
            clone.remove();
        },11500);
        for (let i of chats){
            if (i.parentElement.classList.contains('chatBox')){
                i.appendChild(div);
                i.scrollTop = Number.MAX_SAFE_INTEGER;
            }else{
                i.appendChild(clone);
            }
        }
    }
}


