// ==UserScript==
// @name        alertDescriptionHighlight
// @namespace   Violentmonkey Scripts
// @match       https://kaltura.app.opsgenie.com/alert/detail/*/details
// @version     1.2.1
// @author      vludanenkov
// @description updated 
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440704/alertDescriptionHighlight.user.js
// @updateURL https://update.greasyfork.org/scripts/440704/alertDescriptionHighlight.meta.js
// ==/UserScript==

const keys = [
    'env',
    'kubernetes_namespace',
    'namespace',
    'name', 
    'severity',
    'esclation_1st', // this if because of a typo in alert labels
    'escalation_1st',
    'escalate',
    'owner',
    'urgency',
    'impacted',
    'impact',
    'alert_hours',
    'service',
    'subtype',
    'type',
    'instance',
    'job',
    'platform',
    'app',
    'ASAP',
    'support',
    'devops',
    'RnD',
    'report to',
    'engage',
    'immediately',
]

// https://kaltura.atlassian.net/wiki/spaces/XTVEXT/pages/2968784549/General+rules 
const ppf_ignore_channels = [
  'Sat_TV_2160',
  'Novosadska_tv_2035',
  'TV_BOR_2218',
  'TV_Leskovac_2224',
  'Niska_TV_2022',
  'TV_Belle_Amie_2217',
  'TV_Hram_2221',
  'Melos_2226',
  'Dorcel TV',
  'Dusk!',
  'Private TV',
  'Hustler TV HD',
  'Brazzers TV Europe',
  'PINK EROTIC'
]

function colorPPFChannels(channels) {
  const description = document.querySelector(".full-story-hidden > span");
  let new_descr = description.innerHTML;
  
  channels.forEach(el => {
    const reg = new RegExp(`${el}`, "gi");
    new_descr = new_descr.replace(reg, `<span style="background-color:MediumSeaGreen;">Known Problematic Channel: ${el}</span>`);
  })
  
  description.innerHTML = new_descr;
}

function colorWords(keys) {
  const description = document.querySelector(".full-story-hidden > span");
  let new_descr = description.innerHTML;

  keys.forEach(el => {
    const reg = new RegExp(`(${el})(?![^<]*>)`,"gi");
    new_descr = new_descr.replace(reg, `<span style="color:DarkSalmon;font-weight:bold;">${el}</span>`);
  })
  
  description.innerHTML = new_descr;
}

function boldWords(keys) {
  const description = document.querySelector(".full-story-hidden > span");
  let new_descr = description.innerHTML;

  keys.map(el => `- ${el}`).forEach(el => {
    const reg = new RegExp(`${el} = (.*?)<`, "gi");
    new_descr = new_descr.replace(reg, `${el} = <strong>$1</strong><`);
  })
  
  description.innerHTML = new_descr;
}

/*
function focusListener() {
  console.log('hi_focus')
  highlightElem(keys);
  highlightAll(keys);
  console.log('hi_focus after')
  window.removeEventListener("load", loadListener, { once: true});
}
*/

function focusListenerTimeout() {
  setTimeout(() => {
    console.log("Start focus listener")
    boldWords(keys);
    colorWords(keys);
    colorPPFChannels(ppf_ignore_channels);
    window.removeEventListener("load", loadListener, { once: true}); 
  }, 2000)
}

function loadListener() {
  setTimeout(() => {
    console.log("Start load listener")
    boldWords(keys);
    colorWords(keys);
    colorPPFChannels(ppf_ignore_channels);
    //document.removeEventListener('focus', focusListenerTimeout, { once: true});
  }, 3000)
}

function globalListener() {
  if (document.hasFocus()) {
    loadListener()
  }
  else {
      document.addEventListener('focus', focusListenerTimeout, { once: true});
    }
}


window.addEventListener("load", globalListener, { once: true});
















