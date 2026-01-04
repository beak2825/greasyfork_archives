// ==UserScript==
// @name        [GC] Trouble in Tyrannia Assistant
// @namespace   hanso
// @match       https://www.grundos.cafe/*
// @version     1.2
// @author      hanso
// @description Helps you stay on top of the Trouble in Tyrannia event!
// @grant       GM_getValue
// @grant       GM_setValue
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/507521/%5BGC%5D%20Trouble%20in%20Tyrannia%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/507521/%5BGC%5D%20Trouble%20in%20Tyrannia%20Assistant.meta.js
// ==/UserScript==

function getSecondsTillMidnight() {
  const nstMatch = document.body.innerHTML.match(/<span id="NST_clock_hours">(\d+)<\/span>:<span id="NST_clock_minutes">(\d+)<\/span>:<span id="NST_clock_seconds">(\d+)<\/span> ([ap]m) NST/);
  if(!nstMatch)
    return 86400;
  let zhour = parseInt(nstMatch[1]);
  let zmin = parseInt(nstMatch[2]);
  let zsec = parseInt(nstMatch[3]);
  if (nstMatch[4] === 'pm' && zhour !== 12) {
      zhour += 12;
  } else if (nstMatch[4] === 'am' && zhour === 12) {
      zhour = 0;
  }
  const currentTimeInSeconds = zhour * 3600 + zmin * 60 + zsec;
  return 86400 - currentTimeInSeconds;
}

function showVetTimelies() {
  const timelies = document.querySelector('.timelies .aioImg');
  if(timelies)
    timelies.insertAdjacentHTML('afterbegin', `<div style="order:0"><a href="/prehistoric/village/vet/"><img title="Pacha the Vet" src="https://grundoscafe.b-cdn.net/events/volcano/pacha_vet.gif" style="max-height: 35px"></a></div>`);
}

function formatDuration(duration) {
  duration /= 1000;
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor(duration % 3600 / 60);
  const seconds = Math.ceil(duration % 60);
  return hours + (hours === 1 ? ' hour, ' : ' hours, ') + minutes + (minutes === 1 ? ' minute' : ' minutes') + ', and ' + seconds + (seconds === 1 ? ' second' : ' seconds');
}

function getRemainingTime() {
  return Math.max(0, parseInt(GM_getValue('gc_pachaNextTime', 0)) - (new Date()).getTime());
}

function quickLinkPachaItem(pattern, url) {
  const tgt = Array.from(document.getElementsByTagName('span')).find(span => !span.hasAttribute('style') && pattern.test(span.textContent.trim()));
  if(tgt) {
    tgt.innerHTML = `&#8226; <a href="${url}" target="_blank">${tgt.textContent}</a>`;
  }
}

// check for daily supply run completion message
if(location.href.endsWith('/prehistoric/village/vet/') || location.href.endsWith('/prehistoric/village/vet/submit/')) {
  if(document.body.innerHTML.includes('That should do it for today.')) {
    GM_setValue('gc_pachaNextTime', (new Date()).getTime() + getSecondsTillMidnight() * 1000);
    document.querySelector('.button-group').insertAdjacentHTML('beforebegin',`<p>Come back in <strong>${formatDuration(getRemainingTime())}</strong>.</p>`);
  } else {
    GM_setValue('gc_pachaNextTime', -1);
  }
}

// show timelies icon if necessary
const nextVetTime = GM_getValue('gc_pachaNextTime', -1);
if(nextVetTime === -1 || (new Date()).getTime() >= nextVetTime) {
  showVetTimelies();
}

// show navigation bar
if(location.href.match(/\/prehistoric\/(townhall|village|volcano)\//)) {
  let navLinks = [];
  if(!location.href.includes('/prehistoric/townhall/warroom/'))
    navLinks.push('<a href="/prehistoric/townhall/warroom/">War Room</a>');
  if(!location.href.endsWith('/prehistoric/village/vet/'))
    navLinks.push('<a href="/prehistoric/village/vet/">Pacha the Vet</a>');
  if(!location.href.includes('/prehistoric/village/vet/infirmary/'))
    navLinks.push('<a href="/prehistoric/village/vet/infirmary/">Infirmary</a>');
  if(!location.href.includes('/dome/1p/select/?plot=volcano'))
    navLinks.push('<a href="/dome/1p/select/?plot=volcano">Plot Battledome</a>');
  const navBar = ` - ${navLinks.join(' | ')}`;

  let tgt = document.querySelector('#page_content p > b');
  if(tgt) {
    tgt.insertAdjacentHTML('afterend', navBar);
  } else {
    document.querySelector('#page_content main > h1').innerHTML += navBar;
  }
}

// show link to infirmary tracking sheet
if(location.href.match(/\/prehistoric\/village\/vet\/infirmary\/(\?page=\d+)*$/)) {
  document.getElementById('kad_grid').insertAdjacentHTML('beforebegin', `<a href="https://docs.google.com/spreadsheets/d/17ZFfTBPTRUR4hZtBetjVYBnW34v-L4fPn_Gc3Vtma-Y/edit?gid=1654502719#gid=1654502719" target="_blank">View Infirmary Tracking Spreadsheet</a>`);
  // add LEFT / RIGHT arrow key functionality
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      document.querySelector('a img[src="https://grundoscafe.b-cdn.net/misc/pics_next.gif"]').click();
    } else if(event.key === 'ArrowLeft') {
      document.querySelector('a img[src="https://grundoscafe.b-cdn.net/misc/pics_back.gif"]').click();
    }
  });
} else if(location.href.includes('prehistoric/village/vet/infirmary/visit/?id=')) {
  document.querySelector('.button-group').insertAdjacentHTML('beforeend', `<a href="https://docs.google.com/spreadsheets/d/17ZFfTBPTRUR4hZtBetjVYBnW34v-L4fPn_Gc3Vtma-Y/edit?gid=1654502719#gid=1654502719" target="_blank">View Infirmary Tracking Spreadsheet</a>`);
}

// show item links for Pacha Vet request
if(location.href.includes('/prehistoric/village/vet/')) {
  quickLinkPachaItem(/^Any \d+ omelettes?$/,'https://www.grundos.cafe/safetydeposit/?query=omelette&page=1&category=&type=42&min_rarity=0&max_rarity=999&sort=count&descending=0&descending=1');
  quickLinkPachaItem(/^Any \d+ pharmacy items?$/,'https://www.grundos.cafe/safetydeposit/?query=&page=1&category=9&type=&min_rarity=0&max_rarity=99&sort=count&descending=0&descending=1');
  quickLinkPachaItem(/^Any \d+ healthy foods?$/,'https://www.grundos.cafe/safetydeposit/?query=&page=1&category=&type=16&min_rarity=0&max_rarity=999&sort=count&descending=0&descending=1');
  quickLinkPachaItem(/^Any \d+ Tyrannian foods?$/,'https://www.grundos.cafe/safetydeposit/?query=&page=1&category=&type=42&min_rarity=0&max_rarity=99&sort=count&descending=0&descending=1');
}
