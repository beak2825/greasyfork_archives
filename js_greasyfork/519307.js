// ==UserScript==
// @name         Hide un-revivables 
// @namespace    gaskarth.revivechecker.torn Fork of oxy.revivechecker.torn
// @version      1.20.14
// @description  Revivers can check an entire faction's member list and hide members with revives disabled (for you). Only works if you have the reviver skill.
// @author       Gaskarth, Oxycodone [2306250], Updated by GPT
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519307/Hide%20un-revivables.user.js
// @updateURL https://update.greasyfork.org/scripts/519307/Hide%20un-revivables.meta.js
// ==/UserScript==
//
// ADD YOUR KEY HERE
const API_KEY = '?????????????'; // Replace with your actual API Key - do not remove the quote marks :)
const debug = false;
//
//
//
//
const pagesToInjectInto =['factions.php?step=profile', 'factions.php?step=your#/tab=info'];
let factionMembers = [];
let buttons=[];

async function fetchData(url) {
    const response = await fetch(url);
    if (debug) console.log(`HideUnRevivables :: URL: ${url}`);
    if (debug) console.log(`HideUnRevivables :: Response.ok:${response.ok}`);
 
    if (!response.ok) {
        console.error(`HideUnRevivables :: Failed to fetch data from the API with your key.  Check your key. Response: ${response.statusText}`);
        return null;
    }
    const json = await response.json();
    if (debug) console.log(`HideUnRevivables :: Response.json():${JSON.stringify(json)}`);

    return json;
}

function raiseError(userMessage, errorMessage){
    alert(userMessage);
    console.error(errorMessage);
    return false;
}

async function getRevivableFactionMembers(factionId) {
    const factionData = await fetchData(`https://api.torn.com/v2/faction/${factionId}/members?key=${API_KEY}&striptags=true`);
    if (!factionData || !factionData.members) 
        return raiseError('HideUnRevivables :: Failed to fetch faction data. Check the console for details.', 'No member data returned:'+ factionData);
    if (debug) console.log(`HideUnRevivables :: factionData: ${JSON.stringify(factionData)}`);    
    return(factionData.members.filter(m=>m.is_revivable===true /* && m.status.state=='Hospital' */).map(m=>m.id));
}

async function clickRevive(factionId) {
    buttons.forEach(b=>{b.el.innerText = 'Busy';b.el.disabled = true;});
    applyReviveFilter( await getRevivableFactionMembers(factionId));
    buttons.forEach(b=>{b.el.innerText = b.defaultLabel + ' √' ; b.el.disabled = false;});
}

function applyReviveFilter(revivesEnabled) {
    document.querySelectorAll('.table-body > li').forEach((row) => {
        // TornTools injects a DIV after the user info row
        let nextSibling = row.nextElementSibling;
        let secondSibling=null;
        nextSibling.classList.contains('tt-last-action')
        if (!nextSibling || !(nextSibling.classList.contains('tt-stats-estimate') || nextSibling.classList.contains('tt-last-action'))) {
            nextSibling=null;
        }else{
            secondSibling=nextSibling?.nextElementSibling;
            if (!secondSibling || !(secondSibling.classList.contains('tt-stats-estimate') || secondSibling.classList.contains('tt-last-action'))) {
                secondSibling=null;
            }
        }
        //
        // Extract the user ID (XID) from the <a> tag inside the row
        const userLink = row.querySelector('a[href^="/profiles.php?XID="]')?.getAttribute('href').split('?')[1];
        if (userLink) {
            const userId = (new URLSearchParams(userLink).get('XID')); // Extracts the user ID as a string value from the URL
            if (userId && +userId && +userId>0 && !revivesEnabled.includes(+userId)) {
                row?.remove();
                nextSibling?.remove();
                secondSibling?.remove();
            }
        }
    });
}

function waitForElement(selector, callback, timeout = 5000) {
    const intervalTime = 100; // Check every 100ms
    const startTime = Date.now();
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval);
            callback(element);
        } else if (Date.now() - startTime > timeout) {
            clearInterval(interval);
            console.error(`HideUnRevivables :: Element not found: ${selector}`);
        }
    }, intervalTime);
}

function makeButton(id,className, label, alt, click){
    const button = document.createElement('button');
    button.id = id;
    button.textContent = label;
    button.alt = alt;
    button.className = className;
    button.addEventListener('click', click);
    return button
}

async function insertButtons(factionId) {
    const button = document.createElement('button');
    buttons=[{id:'revive-check-button1',defaultLabel:'Hide Unrevivables'},
             {id:'revive-check-button2',defaultLabel:'Hide Unrevivables'}];
    const altText='Created by a script, Revive state filter, to hide unrevivable users from a faction list';
    buttons[0]={...buttons[0], el:makeButton(buttons[0].id,'torn-btn',buttons[0].defaultLabel, altText,() => clickRevive(factionId))};
    buttons[1]={...buttons[1], el:makeButton(buttons[1].id,'torn-btn',buttons[1].defaultLabel, altText,() => clickRevive(factionId))};
    //
    if (!document.querySelector('#'+ buttons[0].id)) document.querySelector('.content-title')?.appendChild(buttons[0].el);
    // Find the target element and insert the button above its content
    if (!document.querySelector('#'+ buttons[1].id)) {
        waitForElement('.faction-info-wrap.restyle.another-faction', (targetElement) => {
            targetElement.insertBefore(buttons[1].el, targetElement.firstChild);
        });
    }
}

function getFactionId(){
    const url = window.location.href;
    const factionIdMatch = url.match(/factions\.php\?step=profile\/(\d+)/);
    let factionId = document.querySelector('.view-wars')?.getAttribute('href')?.split('ranked/')[1]
    || document.querySelector('#tt-faction-id')?.innerText.replace(/\D/g, '')
    || ((factionIdMatch?.length>1) && factionIdMatch[1]);
    return factionId;
}

function init(){
    window.addEventListener('hashchange', init);
    run();
}

function run() {
    const factionId = getFactionId();
    if(!factionId){
        console.error("HideUnRevivables :: No faction id found in this page");
        alert("The Faction id could not be found in the page - please report this");
        return;
    }
    if (API_KEY[0] === '?') {
        alert('RTFM — You need to edit this script and add your API key');
        console.error('HideUnRevivables :: No API_KEY supplied');
        return;
    }
    insertButtons(factionId);
}



const url = window.location.href;

if (url.includes('factions.php?step=profile') ) {
    if (document.readyState !== 'complete') {
        window.addEventListener('load', init);
    } else {
        init();
    }
} else {
    if ( url.includes('factions.php?step=your#/tab=info')) {//
        waitForElement('.faction-info-wrap.faction-profile.own-faction-profile', (targetElement) => {
            init();
        });
    }
}
