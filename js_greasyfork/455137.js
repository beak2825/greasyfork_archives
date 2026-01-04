// ==UserScript==
// @name         MPP Custom Tags
// @namespace    http://tampermonkey.net/
// @version      1.9.6
// @description  MPP Custom Tags (MPPCT)
// @author       НУУЕ (discord - hyye.xyz)
// @match        *://multiplayerpiano.net/*
// @match        *://multiplayerpiano.org/*
// @match        *://www.multiplayerpiano.org/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=multiplayerpiano.net
// @downloadURL https://update.greasyfork.org/scripts/455137/MPP%20Custom%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/455137/MPP%20Custom%20Tags.meta.js
// ==/UserScript==

/* globals MPP */

console.log('%cLoaded MPPCT! uwu','color:orange; font-size:15px;');
if (!localStorage.tag) localStorage.tag = JSON.stringify({ text: 'None', color: '#000000' });
if (!localStorage.knownTags) localStorage.knownTags = JSON.stringify({});

const ver = '1.9.6';
const knownTags = JSON.parse(localStorage.knownTags)

let tag = JSON.parse(localStorage.tag);

MPP.client.on('hi', () => {
    MPP.client.sendArray([{m: '+custom'}]);
});

function gradientTest(gradient) {
    if (!gradient || typeof gradient != 'string') return false;

    gradient = gradient.toLowerCase();

    const gradients = ['linear-gradient', 'repeating-linear-gradient', 'radial-gradient', 'repeating-radial-gradient', 'conic-gradient', 'repeating-conic-gradient'];

    let gradientAllowed = false;

    if (!gradient.includes('"') && !gradient.includes('\'') && !gradient.includes(';') && !gradient.includes(':') && !gradient.includes('url') && !gradient.includes('img') && !gradient.includes('image')) {
        gradients.forEach((allowedGradient) => {
            if (gradient.startsWith(allowedGradient + '(')) {
                if (gradientAllowed) return;
                else gradientAllowed = true;
            }
        });
    }

    return gradientAllowed;
}

function updtag(text, color, _id, gradient) {
    if (text.length > 50) return;
    if (!MPP.client.ppl[_id]) return;
    if (document.getElementById(`nametag-${_id}`) != null) {
        document.getElementById(`nametag-${_id}`).remove();
    }
    knownTags[_id] = { text: text, color: color };
    let tagDiv = document.createElement('div')
    tagDiv.className = 'nametag';
    tagDiv.id = `nametag-${_id}`;
    tagDiv.style['background-color'] = color;
    if (gradientTest(gradient)) {
        tagDiv.style.background = gradient;
        knownTags[_id].gradient = gradient;
    }
    localStorage.knownTags = JSON.stringify(knownTags);
    tagDiv.innerText = text;
    document.getElementById(`namediv-${_id}`).prepend(tagDiv);
    document.getElementById(`namediv-${_id}`).title = 'This is an MPPCT user.';
}


function sendTag(id) {
    if (id) MPP.client.sendArray([{ m: 'custom', data: { m: 'mppct', text: tag.text, color: tag.color, gradient: tag.gradient }, target: { mode: 'id', id: id } }]);
    else MPP.client.sendArray([{m: 'custom', data: {m: 'mppct', text: tag.text, color: tag.color, gradient: tag.gradient}, target: { mode: 'subscribed' } }]);
}
function askForTags() {
    MPP.client.sendArray([{ m: 'custom', data: { m: 'mppctreq' }, target: { mode: 'subscribed' } }]);
}

MPP.client.on('custom', (c) => {
    const tag = c.data;
    if (tag.m == 'mppct') {
        if (typeof tag.text == 'string' &&
            (typeof tag.color == 'string' ||
             typeof tag.gradient == 'string')
           ) {
            if (MPP.client.ppl[c.p]) {
                updtag(tag.text || 'None', tag.color || '#000000', c.p, tag.gradient);
            }
        }
    }
    if (tag.m == 'mppctreq') {
        if (MPP.client.ppl[c.p]) sendTag(c.p);
    }
});
MPP.client.on('p', (p) => {
    if (p._id == MPP.client.getOwnParticipant()._id) {
        updtag(tag.text, tag.color, MPP.client.getOwnParticipant()._id, tag.gradient);
        sendTag();
    }
});
MPP.client.on('c', () => {
    askForTags();
    sendTag();
    updtag(tag.text, tag.color, MPP.client.getOwnParticipant()._id, tag.gradient);
});

// Tags in chat
function addChatTag(msg) {
    if (msg.m == 'dm') return;
    if (!knownTags[msg.p._id]) return;
    let aTag;
    if (msg.p._id == MPP.client.getOwnParticipant()._id) aTag = tag;
    else aTag = knownTags[msg.p._id];

    let chatMessage = document.getElementById('msg-' + msg.id);
    let Span = document.createElement('span'); // <span style="background-color: ${aTag.color};color:#ffffff;" class="nametag">${aTag.text}</span>
    Span.style['background-color'] = aTag.color;
    if (knownTags[msg.p._id]) Span.style.background = aTag.gradient;
    Span.style.color = '#ffffff';
    Span.className = 'nametag';
    Span.innerText = aTag.text;
    chatMessage.appendChild(Span);
}

MPP.client.on('a', (msg) => {
    addChatTag(msg);
});

MPP.client.on('c', (msg) => {
    if (!Array.isArray(msg.c)) return;
    msg.c.forEach((msg) => {
        addChatTag(msg);
    });
});


// Buttons
const container = document.body.getElementsByClassName('dialog').rename;

const a = document.createElement('input');
a.id = 'tagtext';
a.name = 'tagtext';
a.type = 'text';
a.placeholder = 'Tag';
a.maxLength = '50';
a.className = 'text';
a.style = 'width: 100px; height: 20px;';
container.appendChild(a);

const q = document.createElement('input');
q.id = 'tagcolor';
q.name = 'tagcolor';
q.type = 'color';
q.placeholder = '';
q.maxlength = '7';
q.className = 'color';
container.appendChild(q);

const e = document.createElement('button');
e.addEventListener('click', () => {
    let tagtext = document.getElementById('tagtext');
    let tagcolor = document.getElementById('tagcolor');
    if (tagtext.value == '') return;
    let newTag = JSON.parse(localStorage.tag);
    newTag.text = tagtext.value || 'None';
    newTag.color = tagcolor.value || '#000000';
    localStorage.tag = JSON.stringify(newTag);
    tag = newTag;
    updtag(newTag.text, newTag.color, MPP.client.getOwnParticipant()._id, newTag.gradient);
    sendTag();
});
e.innerText = 'SET TAG';
e.className = 'top-button';
e.style.position = 'fixed';
e.style.height = '30px';
container.appendChild(e);

document.getElementById('tagtext').value = tag.text;
document.getElementById('tagcolor').value = tag.color;


//Version checker
function checkVersion() {
    fetch('https://raw.githubusercontent.com/Hyye123/MPPCT/main/version.json').then(r => r.json().then(json => {
        if (ver != json.latest) {
            setInterval(function() {
                MPP.chat.receive({
                    "m": "a",
                    "t": Date.now(),
                    "a": "Please update MPPCT https://greasyfork.org/ru/scripts/455137-mpp-custom-tags",
                    "p": {
                        "_id": "MPPCT",
                        "name": "MPPCT (eng)",
                        "color": "#ffffff",
                        "id": "MPPCT"
                    }
                });
                MPP.chat.receive({
                    "m": "a",
                    "t": Date.now(),
                    "a": "Пожалуйста, обновите MPPCT https://greasyfork.org/ru/scripts/455137-mpp-custom-tags",
                    "p": {
                        "_id": "MPPCT",
                        "name": "MPPCT (rus)",
                        "color": "#ffffff",
                        "id": "MPPCT"
                    }
                });
            }, 30000);
        }
    }));
}
setInterval(checkVersion, 300000);
setTimeout(checkVersion, 10000);