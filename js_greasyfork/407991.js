// ==UserScript==
// @name         Magic Pro Tools TTS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://magicprotools.com/deck/show?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407991/Magic%20Pro%20Tools%20TTS.user.js
// @updateURL https://update.greasyfork.org/scripts/407991/Magic%20Pro%20Tools%20TTS.meta.js
// ==/UserScript==

(function(){
    const div = document.querySelector('.altviewlink');

    const btn = document.createElement('a');
    btn.innerText = 'Download TTS';
    btn.setAttribute('class', 'button');
    btn.href = '#';
    btn.onclick = function(){
        const ds = new Date().toLocaleString().replace(/[/:, ]+/g,'_');
        const name = `Draft_${ds}`;
        self.deckName = name;
        downloadSave(name);
    }

    div.append(btn);
})();

function getDeck(){
    const cols = [...document.querySelectorAll('.deckcol')];
    return cols.map(c => {
        const lines = c.innerText.split('\n');
        for(let i = 1; i < lines.length; i ++){
            const [all, num, name ] = lines[i].match(/(\d+)x(.*)/);
            lines[i] = num + ' ' + name;
        }

        if(lines[0] == 'Sideboard')lines[0] = '';
        else lines.shift();

        return lines.join('\n');
    }).join("\n");
}
self.getDeck = getDeck;

function makeCoverBtn(coverCards){
    let select = document.querySelector('.cover-btn');
    if(!select){
        select = document.createElement('select');
        select.setAttribute('class','cover-btn');
        select.style.height = '2.8em';
        select.style.borderRadius = '3px';
        const div = document.querySelector('.altviewlink');
        div.append(select);

        select.onchange = e => {
            const val = e.target.value;
            console.log(val);
            fetch(val).then(res => res.blob()).then(blob => {
                const url = URL.createObjectURL( blob );
                var element = document.createElement('a');
                element.setAttribute('href', url);
                element.setAttribute('download', self.deckName + ".png");
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            });
        }
    }
    select.innerHTML = '';
    select.append(document.createElement('option'));
    coverCards.forEach(card => {
        const e = document.createElement('option');
        e.setAttribute('value', card.obj.image_uris.art_crop);
        e.setAttribute('label', card.obj.name);
        select.append(e);
    });
}

async function collectCards(){
    const decklist = getDeck();
    const cardLines = decklist.split('\n\n').map(sublist => sublist.split('\n'));
    const cards = cardLines.map((cards,group) => {
        return cards.map(line => {
            const [_, num, name] = line.match(/(\d+) (.*)/);
            return {num: parseInt(num), name, main: group == 0, side: group > 0};
        });
    }).flat();

    await collectCardObjects(cards);
//    console.log(cards);

    const coverCards = cards.filter(card => cardRarity(card.obj) >= 2);
    makeCoverBtn(coverCards);

    const appearance = {};
    const related = cards.map(card => (card.obj.all_parts || []).slice(1)).flat().map(c => ({id: c.id, token: true})).filter(
        c => {
            if(appearance[c.id])return false;
            return appearance[c.id] = true;
        }
    );
    await collectCardObjects(related);
//    console.log(related);

    const all = cards.map(card => {
        const copies = [];
        for(let i = 0; i < card.num; i ++)copies.push(card);
        return copies;
    }).flat().concat(related);
    all.forEach(card => {card.card = json2card(card.obj)});
    return all;
}

function cardRarity(card){
   return card.rarity == 'mythic' ? 4 : card.rarity == 'rare' ? 3 : card.rarity == 'uncommon' ? 2 : 1;
}

async function collectCardObjects(cards){
    const query = {identifiers: cards.map(c => {
        let set = undefined;
        if(c.name){
            const trimName = c.name.trim();
            if(trimName == 'Plains')set = 'pana';
            else if(trimName == 'Swamp')set = 'pana';
            else if(trimName == 'Island')set = 'pana';
            else if(trimName == 'Forest')set = 'pana';
            else if(trimName == 'Mountain')set = 'pana';
        }
        return c.name ? {name: c.name, set} : {id:c.id};
    })};
    const headers = {'Content-Type': 'application/json'};
    const body = JSON.stringify(query);
    const res = await fetch('https://api.scryfall.com/cards/collection', {headers, method: 'post', body});
    const json = await res.json();
    cards.forEach((card, i) => {
        card.obj = json.data[i];
    });
    return cards;
}

function json2card(json){
    const imguris = json.image_uris || json.card_faces[0].image_uris;
    const name = json.card_faces ? json.card_faces.map(cf => cf.printed_name || cf.name).join(' // ') : json.printed_name || json.name;
    const cost = json.mana_cost;
    const typeline = json.card_faces ? json.card_faces.map(cf => cf.printed_type_line || cf.type_line).join(' // ') : json.printed_type_line || json.type_line;
    const stats = json.power ? `${json.power}/${json.toughness}` : undefined;
    const oracle = json.card_faces ? json.card_faces.map(cf => cf.printed_text || cf.oracle_text).join(' // ') : json.printed_text || json.oracle_text;
    const head = `[b]${name}[/b] - ${cost}\n${stats || ""} ${typeline}`;
    return [imguris.large, head, oracle];
}

let ci = 1;
function toDeck(name, x, cards){
    const items = cards.map(c => makeTTSCard({name: c[1], oracle: c[2], face: c[0], id: ci++}));
    const deck = makeTTSDeck(items);
    if(deck != items[0])deck.Nickname = name;
    deck.Transform.posX = x;
    return deck;
}

async function downloadSave(name){
    const cards = await collectCards();

    const mainCards = cards.filter(c => c.main).map(c => c.card);
    const sideCards = cards.filter(c => c.side).map(c => c.card);
    const tokenCards = cards.filter(c => c.token).map(c => c.card);

    const confirmed = window.confirm(`Download deck with ${mainCards.length} maindeck, ${sideCards.length} sideboard, ${tokenCards.length} related cards?`);
    if(!confirmed)return;

    const deck = toDeck("Main", 6, mainCards);
    const tokensDeck = toDeck("Tokens", 3, tokenCards);
    const sideDeck = toDeck("Sideboard", 0, sideCards);

    const save = makeTTSSave(sideDeck, tokensDeck, deck);

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