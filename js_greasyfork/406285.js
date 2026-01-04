// ==UserScript==
// @name         桌游模拟器营地牌表导出工具
// @namespace    http://www.iyingdi.com/
// @version      0.3
// @description  在营地牌表页添加导出为桌游模拟器存档的按钮
// @author       hyper
// @match        https://www.iyingdi.com/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406285/%E6%A1%8C%E6%B8%B8%E6%A8%A1%E6%8B%9F%E5%99%A8%E8%90%A5%E5%9C%B0%E7%89%8C%E8%A1%A8%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/406285/%E6%A1%8C%E6%B8%B8%E6%A8%A1%E6%8B%9F%E5%99%A8%E8%90%A5%E5%9C%B0%E7%89%8C%E8%A1%A8%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

async function init(){
    let added;
    window.addEventListener("popstate",() => added = undefined);
    while(true){
        await new Promise(r => setTimeout(r, 1000));
        if(added == location.href)continue;
        if(!location.href.match("deck(d|D)etail")){
            added = undefined; continue;
        }

        const actionBox = $('.deck-detail-box .action-box, .mainDeckArea .action-box');
        if(!actionBox.length)continue;
        createSaveBtn(actionBox);
        added = location.href;
    }
}
init();

async function createSaveBtn(actionBox){
    if($("#tts-export").length)return null;
    const [name,data] = await getSave(getCards());
    const href = window.URL.createObjectURL(new Blob([data]), { type: "text/plain" });
    const e = $(`<div id="tts-export" class="btn-item-w"><a href="${href}" download="${name}">导出桌游模拟器存档</a></div>`);
    
    actionBox.append(e);
}

function getCards(){
    const cards = Array.from($('.card.inline-block')).map(c => {
        const sideboard = c.parentElement.previousSibling.innerText.startsWith("备牌");
        const image = c.dataset.image;
        const id = c.dataset.value;
        const num = parseInt(c.querySelector('.count').innerText.slice(1)) || 1;
        return [id, image, sideboard, num];
    });
    return cards;
}

async function getSave(cards){
    const main = [];
    const side = [];
    let s = 1;
    await Promise.all(cards.map(async (c,i) => {
        let [id, image, sideboard, num] = c;
        const url = 'https://www.iyingdi.com/magic/card/' + id;
        const res = await fetch(url);
        const json = await res.json();
        image = image || json.card.img;

        const stats = json.card.clazz == '生物' ? `\n${json.card.attack}/${json.card.defense}` : '\n';
        const nickname = `${json.card.cname || json.card.ename} - ${json.card.mana}${stats}${json.card.mainType} ~ ${json.card.subType}`;
        const description = `${json.card.rule}`;

        for(let j = 0; j < num; j ++){
            const card = makeTTSCard({name: nickname, oracle: description, face: image, id: s++});
            if(sideboard)side.push(card);
            else main.push(card);
        }
    }));

    const md = makeTTSDeck(main);
    md.Nickname = '主牌';

    const sd = makeTTSDeck(side);
    sd.Nickname = '备牌';
    sd.Transform.posX = 3;

    const save = makeTTSSave(md,sd);
    const name = `[${$('.formatName .format, .format-name .format').text()}]${$('.formatName .name.inline-block, .format-name .name.inline-block').text()} - ${$('.basicInfo .player, .deck-info-box .player').text().slice(3)}`;
    //download(name + ".json", JSON.stringify(save, null, 4));
    return [name + ".json", JSON.stringify(save, null, 4)];
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function makeTTSCard({name, oracle, face, id}){
    const card = clone(TTSCard);
    card.Nickname = name;
    card.Description = oracle;
    card.CardID = id * 100;
    card.CustomDeck = {};
    card.CustomDeck[id] = {
        FaceURL: face,
        BackURL: "http://ww1.sinaimg.cn/large/8239391egy1gg9acxj0ryj207d0aldj7.jpg",
        "NumWidth": 1,
        "NumHeight": 1,
        "BackIsHidden": true,
        "UniqueBack": false,
        "Type": 0
    };
    card.GUID = Math.random().toString(16).slice(-6);
    return card;
}

function makeTTSDeck(cards){
    const deck = clone(TTSDeck);
    deck.DeckIDs = cards.map(c => c.CardID);
    deck.CustomDeck = cards.reduce((a,b) => clone(a, b.CustomDeck), {});
    deck.ContainedObjects = cards;
    deck.GUID = Math.random().toString(16).slice(-6);
    return deck;
}

function makeTTSSave(...ObjectStates){
    return clone(TTS, {ObjectStates});
}

const TTS = {
  "SaveName": "",
  "GameMode": "",
  "Date": "",
  "Gravity": 0.5,
  "PlayArea": 0.5,
  "GameType": "",
  "GameComplexity": "",
  "Tags": [],
  "Table": "",
  "Sky": "",
  "Note": "",
  "Rules": "",
  "TabStates": {},
  "LuaScript": "",
  "LuaScriptState": "",
  "XmlUI": "",
  "VersionNumber": "",
}

const TTSDeck = {
    "Name": "Deck",
    "Transform": {
        "posX": 0,
        "posY": 0,
        "posZ": 0,
        "rotX": 0,
        "rotY": 180,
        "rotZ": 180.0,
        "scaleX": 1.0,
        "scaleY": 1.0,
        "scaleZ": 1.0
    },
    "Nickname": "",
    "Description": "",
    "GMNotes": "",
    "ColorDiffuse": {
        "r": 0.713235259,
        "g": 0.713235259,
        "b": 0.713235259
    },
    "Locked": false,
    "Grid": true,
    "Snap": true,
    "IgnoreFoW": false,
    "MeasureMovement": false,
    "DragSelectable": true,
    "Autoraise": true,
    "Sticky": true,
    "Tooltip": true,
    "GridProjection": false,
    "HideWhenFaceDown": true,
    "Hands": false,
    "SidewaysCard": false,
    "LuaScript": "",
    "LuaScriptState": "",
    "XmlUI": "",
}

const TTSCard = {
    "Name": "Card",
    "Transform": {
        "posX": 0,
        "posY": 0,
        "posZ": 0,
        "rotX": 0,
        "rotY": 180,
        "rotZ": 180.0,
        "scaleX": 1.0,
        "scaleY": 1.0,
        "scaleZ": 1.0
    },
    "Nickname": "",
    "Description": "",
    "GMNotes": "",
    "ColorDiffuse": {
        "r": 0.713235259,
        "g": 0.713235259,
        "b": 0.713235259
    },
    "Locked": false,
    "Grid": true,
    "Snap": true,
    "IgnoreFoW": false,
    "MeasureMovement": false,
    "DragSelectable": true,
    "Autoraise": true,
    "Sticky": true,
    "Tooltip": true,
    "GridProjection": false,
    "HideWhenFaceDown": true,
    "Hands": true,
    "CardID": 0,
    "SidewaysCard": false,
    "LuaScript": "",
    "LuaScriptState": "",
    "XmlUI": ""
};

function clone(...objs){
    const obj = {}
    for(const one of objs){
        for(const key in one){
            obj[key] = one[key];
        }
    }
    return obj;
}