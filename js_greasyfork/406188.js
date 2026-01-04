// ==UserScript==
// @name         Scryfall TTS Save Generator
// @namespace    http://scryfall.com/
// @version      0.4
// @description  Generate Tabletop Simulator save json from Scryfall
// @author       hyper
// @match        https://scryfall.com/*/decks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406188/Scryfall%20TTS%20Save%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/406188/Scryfall%20TTS%20Save%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const controls = document.querySelectorAll('.deck-controls-group')[1];
    controls.append(createSaveButton());
    controls.append(createSuffixButton());
})();

function createSaveButton(){
    const btn = document.createElement('button');
    btn.className = 'button-n tiny bp-mid-only';
    btn.type = 'button';
    btn.innerHTML = '<b>TTS Save</b>';

    btn.onclick = () => downloadSave();
    return btn;
}

function createSuffixButton(){
    const btn = document.createElement('button');
    btn.className = 'button-n tiny bp-mid-only';
    btn.type = 'button';

    const suffix = localStorage.getItem("card_url_suffix");
    btn.innerHTML = `<b>TTS Suffix: ${suffix}</b>`;

    btn.onclick = () => {
        const suffix = prompt("set card url suffix (e.x. /zhs to down load all cards in Simplified Chinese")
        if(null === suffix)return;
        localStorage.setItem("card_url_suffix", suffix);
        btn.innerHTML = `<b>TTS Suffix: ${suffix}</b>`;
    }
    return btn;
}

async function loadCard(url){
    const res = await fetch(url);
    const json = await res.json();
    const suffix = localStorage.getItem("card_url_suffix");
    if(suffix){
        const ress = await fetch(url + suffix);
        const jsons = await ress.json();
        for(const key in jsons)json[key] = jsons[key];
    }
    const imguris = json.image_uris || json.card_faces[0].image_uris;
    const related = (json.all_parts || []).slice(1);
    const name = json.card_faces ? json.card_faces.map(cf => cf.printed_name || cf.name).join(' // ') : json.printed_name || json.name;
    const cost = json.mana_cost;
    const typeline = json.card_faces ? json.card_faces.map(cf => cf.printed_type_line || cf.type_line).join(' // ') : json.printed_type_line || json.type_line;
    const stats = json.power ? `${json.power}/${json.toughness}` : undefined;
    const oracle = json.card_faces ? json.card_faces.map(cf => cf.printed_text || cf.oracle_text).join(' // ') : json.printed_text || json.oracle_text;
    const head = `${name} - ${cost}\n${stats || ""} ${typeline}`;
    return [imguris.large, related, head, oracle];
}

async function collectCards(){
    const cards = [...document.querySelectorAll('.deck-list-entry')].map(
        async item => {
            const seg = item.parentElement.parentElement.firstElementChild.innerText;
            const side = seg.startsWith('SIDEBOARD');
            const maybe = seg.startsWith('MAYBE');
            const num = parseInt(item.querySelector('.deck-list-entry-count').innerText);
            const cardUrl = item.querySelector('a').href;
            const url = cardUrl.slice(0, cardUrl.lastIndexOf('/')).replace('scryfall', 'api.scryfall').replace('/card/', '/cards/');
            const card = await loadCard(url);
            const cards = [];

            if(!maybe){
                for(let i = 0; i < num; i ++)
                    cards.push({card, main:!side, side});
            }

            const tokens = card[1];
            const loaded = tokens.map(c => loadCard(c.uri).then(card => ({card, token:true})));
            cards.push(...await Promise.all(loaded));
            return cards;
        }
    );
    return (await Promise.all(cards)).flat();
}

let ci = 1;
function toDeck(name, x, cards){
    const items = cards.map(c => makeTTSCard({name: c[2], oracle: c[3], face: c[0], id: ci++}));
    const deck = makeTTSDeck(items);
    if(deck != items[0])deck.Nickname = name;
    deck.Transform.posX = x;
    return deck;
}

async function downloadSave(){
    const cards = await collectCards();

    const mainCards = cards.filter(c => c.main).map(c => c.card);
    const sideCards = cards.filter(c => c.side).map(c => c.card);
    const tokenCards = cards.filter(c => c.token).map(c => c.card);

    const confirmed = window.confirm(`Download deck with ${mainCards.length} maindeck, ${sideCards.length} sideboard, ${tokenCards.length} related cards?`);
    if(!confirmed)return;

    const deck = toDeck("Main", 0, mainCards);
    const sideDeck = toDeck("Sideboard", 3, sideCards);
    const tokensDeck = toDeck("Tokens", 6, tokenCards);

    const save = makeTTSSave(deck, sideDeck, tokensDeck);
    const name = document.querySelector(".deck-details-title").innerText.trim();

    download(name + ".json", JSON.stringify(save, null, 4));
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
    const card = {...TTSCard};
    card.Transform = {...card.Transform};
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
    if(cards.length == 1)return cards[0];

    const deck = {...TTSDeck};
    deck.Transform = {...deck.Transform};
    deck.DeckIDs = cards.map(c => c.CardID);
    deck.CustomDeck = cards.reduce((a,b) => ({...a, ...b.CustomDeck}), {});
    deck.ContainedObjects = cards;
    deck.GUID = Math.random().toString(16).slice(-6);
    return deck;
}

function makeTTSSave(...ObjectStates){
    return {...TTS, ObjectStates};
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