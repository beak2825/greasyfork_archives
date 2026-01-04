// ==UserScript==
// @name         Faction Revive Checker
// @namespace    tenren.revivechecker.torn Fork gaskarth.revivechecker.torn
// @version      1.20.10
// @description  Checks your faction's member list and displays who has their Revive setting set to "Everyone".
// @author       Tenren, Gaskarth, Oxycodone [2306250]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521080/Faction%20Revive%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/521080/Faction%20Revive%20Checker.meta.js
// ==/UserScript==
//
// Modified from https://greasyfork.org/en/scripts/519307-hide-un-revivables-oxy-s-revive-1-2
//
// ADD YOUR KEY HERE
let API_KEY = ''; // Insert your API key here - requires Limited key with Faction AA 
const PDAKey = '###PDA-APIKEY###';

// From https://greasyfork.org/en/scripts/477956-easy-market/
if(PDAKey.charAt(0) !== '#'){
    if(!API_KEY){
        API_KEY = PDAKey;
    }
}
//
//
//
//
const pagesToInjectInto =['factions.php?step=profile', 'factions.php?step=your#/tab=info'];
let factionMembers = [];
let buttons=[];

async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        console.error(`Failed to fetch data from the API with your key.  Check your key. Response: ${response.statusText}`);
        return null;
    }
    return await response.json();
}

function raiseError(userMessage, errorMessage){
    alert(userMessage);
    console.error(errorMessage);
    return false;
}

async function getRevivableFactionMembers() {
    const factionData = await fetchData(`https://api.torn.com/v2/faction/members?key=${API_KEY}&striptags=true&comment=ReviveChecker`);
    if (!factionData || !factionData.members) return raiseError('Failed to fetch faction data. Check the console for details.', 'No member data returned:'+ factionData);
    return(factionData.members.filter(m=>m.revive_setting=='Everyone' /* && m.status.state=='Hospital' */).map(m=>m.id));
}

async function clickRevive(factionId) {
    buttons.forEach(b=>{b.el.innerText = 'Busy';b.el.disabled = true;});
    applyReviveFilter( await getRevivableFactionMembers());
    buttons.forEach(b=>{b.el.innerText = b.defaultLabel + ' √' ; b.el.disabled = false;});
}

function applyReviveFilter(revivesEnabled) {
    document.querySelectorAll('.table-body > li').forEach((row) => {
        // TornTools injects a DIV after the user info row
        let nextSibling = row.nextElementSibling;
        if (!nextSibling || !nextSibling.classList.contains('tt-stats-estimate')) nextSibling=null;
        //
        // Extract the user ID (XID) from the <a> tag inside the row
        const userLink = row.querySelector('a[href^="/profiles.php?XID="]')?.getAttribute('href').split('?')[1];
        if (userLink) {
            const userId = (new URLSearchParams(userLink).get('XID')); // Extracts the user ID as a string value from the URL
            if (userId && +userId && +userId>0 && !revivesEnabled.includes(+userId)) {
                row?.remove();
                nextSibling?.remove();
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
            console.error(`Element not found: ${selector}`);
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
    buttons=[{id:'revive-check-button1',defaultLabel:'Filter for Revive Setting "Everyone"'},
             {id:'revive-check-button2',defaultLabel:'Filter for Revive Setting "Everyone"'}];
    const altText='Created by a script, Revive state filter, to hide unrevivable users from a faction list';
    buttons[0]={...buttons[0], el:makeButton(buttons[0].id,'torn-btn',buttons[0].defaultLabel, altText,() => clickRevive(factionId))};
    buttons[1]={...buttons[1], el:makeButton(buttons[1].id,'torn-btn',buttons[1].defaultLabel, altText,() => clickRevive(factionId))};
    //
    // if (!document.querySelector('#'+ buttons[0].id)) document.querySelector('.content-title')?.appendChild(buttons[0].el);
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
        console.error("No faction id found in this page");
        alert("The Faction id could not be found in the page - please report this");
        return;
    }
    if (!API_KEY) {
        alert('RTFM — You need to edit this script and add your API key');
        console.error('No API_KEY supplied');
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
