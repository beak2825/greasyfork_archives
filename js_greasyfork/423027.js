// ==UserScript==
// @name         Lemvor
// @version      0.4.1
// @namespace    github.com/gmiclotte
// @description  lemon
// @author		GMiclotte
// @include		https://melvoridle.com/*
// @include		https://*.melvoridle.com/*
// @exclude		https://melvoridle.com/index.php
// @exclude		https://*.melvoridle.com/index.php
// @exclude		https://wiki.melvoridle.com/*
// @exclude		https://*.wiki.melvoridle.com/*
// @inject-into page
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/423027/Lemvor.user.js
// @updateURL https://update.greasyfork.org/scripts/423027/Lemvor.meta.js
// ==/UserScript==

window.lemvor = {
    lemon: undefined,
    replaceLemon: undefined,
    partyInterval: undefined,
    partyMode(probability, hatProbability) {
        document.getElementsByTagName('img').forEach(img => {
            if (Math.random() > probability) {
                return;
            }
            if (Math.random() > hatProbability) {
                img.src = lemvor.lemon;
                return;
            }
            const hat = lemvor.hats[Math.floor(Math.random() * lemvor.hats.length)];
            img.src = hat;
        });
    },
    itsTimeToParty(probability = .5, hatProbability = 0.1, interval = 500) {
        lemvor.partyInterval = setInterval(() => lemvor.partyMode(probability, hatProbability), interval);
    },
    stopThePartyBooooo() {
        clearInterval(lemvor.partyInterval);
        lemvor.partyInterval = undefined;
    },
    toggleParty() {
        if (lemvor.partyInterval === undefined) {
            lemvor.itsTimeToParty();
        } else {
            lemvor.stopThePartyBooooo();
        }
    }
}

// convert object to array
const unpack = object => Object.getOwnPropertyNames(object).map(prop => object[prop]);
// when life gives you media, make some lemons
lemvor.makeLemon = () => [
    // arrays of objects that have media -> "array"
    game.items.allObjects,
    // objects of objects that have media -> "unpack(array)"

    // objects of arrays of objects that have media -> "...unpack(array)"

].forEach(list => {
    list.forEach(entry => entry._media = lemvor.lemon);
});

// update some lemons
lemvor.updateLemon = () => {
    // update lemons
    document.getElementsByTagName('img').forEach(img => {
        img.src = lemvor.lemon;
    });
}

// add party button
const partyButton = () => {
    return '<div class="dropdown d-inline-block ml-2">'
        + '<button type="button" '
        + 'class="btn btn-sm btn-dual text-combat-smoke" '
        + 'id="page-header-modifiers" '
        + `onclick="window.lemvor.toggleParty();" `
        + 'aria-haspopup="true" '
        + 'aria-expanded="true">'
        + `<img class="skill-icon-xxs" src="${lemvor.lemon}">`
        + '</button>'
        + '</div>';
}

lemvor.setLemon = name => {
    lemvor.lemon = lemvor.mediaBackup[name];
    lemvor.replaceLemon = name === 'Lemon';
    lemvor.makeLemon();
    lemvor.updateLemon();
}

function startLemvor() {
    lemvor.mediaBackup = {};
    game.items.allObjects.forEach(item => lemvor.mediaBackup[item.name] = item.media);
    // hats
    lemvor.hats = [
        'melvorF:Green_Party_Hat',
        'melvorD:Purple_Party_Hat',
        'melvorD:Red_Party_Hat',
        'melvorD:Yellow_Party_Hat',
    ].map(id => game.items.getObjectByID(id).media);
    let node = document.getElementById('page-header-potions-dropdown').parentNode;
    node.parentNode.insertBefore($(partyButton().trim())[0], node);
    lemvor.setLemon('Lemon');
}

mod.register(ctx => {
    ctx.onInterfaceReady(() => {
        startLemvor();
    });
});