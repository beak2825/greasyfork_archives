// ==UserScript==
// @name         TeaMerryZ
// @namespace    zero.teamerry.torn
// @version      0.4
// @description  adds link to attack
// @author       -zero [2669774]
// @match        https://www.torn.com/factions.php?step=profile*
// @match        https://www.torn.com/loader.php?sid=attack*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/469571/TeaMerryZ.user.js
// @updateURL https://update.greasyfork.org/scripts/469571/TeaMerryZ.meta.js
// ==/UserScript==

const api = '3nTeRYoURAp1K3Y';
var data = localStorage.getItem('teamerrydata') || "{}";
data = JSON.parse(data);

var url = window.location.href;

if (url.includes("faction")){
    insert();
}

function insert(){
    if ($('.f-info > li:nth-child(5) > a:nth-child(2)').length == 0){
        setTimeout(insert, 300);
        return;
    }
    var factionid = $('.f-info > li:nth-child(5) > a:nth-child(2)').attr('href').split("ID=")[1];
    var but = `<button id="zero-faction" class="torn-btn">TeaMerryFaction</button>`;
    $('.content-title').append(but);

    $('#zero-faction').on('click',function(){
        saveZero(factionid);
    });
}

async function saveZero(id){
    var response =await $.getJSON(`https://api.torn.com/faction/${id}?selections=&key=${api}`);


    for (var memberId in response.members){
        data[response.members[memberId].name] = memberId;
    }

    localStorage.setItem("teamerrydata", JSON.stringify(data));
    console.log(localStorage.getItem("teamerrydata"));

}

const participantsNode = "ul[class^='participants']";
const actionLogNode = "ul[class^='list']";

GM_addStyle(`
    .teamerryattacklink {
        color: var(--default-color);
    }`);

function watchParticipants(observeNode) {
    if (!observeNode) return;

    const participantNode = "div[class^= 'playerWrap'] > span[class^= 'playername'";
    observeNode.querySelectorAll(participantNode).forEach((e) => addNameLink(e));

    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            for (const node of mutation.addedNodes) {
                addNameLink(node.querySelector && node.querySelector(participantNode));
            }
        });
    }).observe(observeNode, { childList: true, subtree: true });
}

function addNameLink(node) {
    if (!node) return;
    if (node.querySelector("a")) return;

    var name = node.innerHTML;
    if (data[name]){

        node.innerHTML = `<a class="teamerryattacklink" href="https://www.torn.com/loader.php?sid=attack&user2ID=${data[name]}" target="_blank">${name}</a>`;
    }
    else{
        node.innerHTML = `<a class="teamerryattacklink" href="profiles.php?NID=${name}" target="_blank">${name}</a>`;
    }

}

function watchActionLog(observeNode) {
    if (!observeNode) return;

    const logNode = "span[class^='message'] > span";
    observeNode.querySelectorAll(logNode).forEach((e) => addLogLink(e));

    new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            for (const node of mutation.addedNodes) {
                addLogLink(node.querySelector && node.querySelector(logNode));
            }
        });
    }).observe(observeNode, { childList: true, subtree: true });
}

function addLogLink(node) {
    if (!node) return;
    if (node.querySelector("a")) return;

    node.innerHTML = node.innerHTML
        .replace(/^([^\s]+)/i, function(match, p1){
        if (data[p1]){
            return `<a class="teamerryattacklink" href="https://www.torn.com/loader.php?sid=attack&user2ID=${data[p1]}" target="_blank">${p1}</a>`;
        }
        return `<a class="teamerryattacklink" href="profiles.php?NID=${p1}" target="_blank">${p1}</a>`;
    })
        .replace(/(\s(?:from|hit(?:ting)?|defeated|stalemated\swith|near|against|puncturing|at|damaged|miss(?:ed|ing)|left|mugged|hospitalized|lost\sto)\s)([^\s\,]+)/i,
            function(match, p1, p2){
        if (data[p2]){
            return `<a class="teamerryattacklink" href="https://www.torn.com/loader.php?sid=attack&user2ID=${data[p2]}" target="_blank">${p2}</a>`;
        }
        return `<a class="teamerryattacklink" href="profiles.php?NID=${p2}" target="_blank">${p2}</a>`;
    })
        .replace(/(\s(?:in)\s)([^\s\,]+)(\'s\sface)/i,
            function(match, p1, p2, p3){
        if (data[p2]){
            return `<a class="teamerryattacklink" href="https://www.torn.com/loader.php?sid=attack&user2ID=${data[p2]}" target="_blank">${p2}</a>`;
        }
        return `<a class="teamerryattacklink" href="profiles.php?NID=${p2}" target="_blank">${p2}</a>`;
    });
}

watchActionLog(document.querySelector(actionLogNode));
watchParticipants(document.querySelector(participantsNode));

new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        for (const node of mutation.addedNodes) {
            watchActionLog(node.querySelector && node.querySelector(actionLogNode));
        }
    });
}).observe(document.body, { childList: true, subtree: true });

new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        for (const node of mutation.addedNodes) {
            watchParticipants(node.querySelector && node.querySelector(participantsNode));
        }
    });
}).observe(document.body, { childList: true, subtree: true });

