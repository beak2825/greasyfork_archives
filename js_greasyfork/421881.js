// ==UserScript==
// @name        Google Meet Automation Bot
// @namespace   Violentmonkey Scripts
// @match       https://meet.google.com/*
// @grant       none
// @version     1.0
// @author      Jakub Duplaga
// @description  Disable video, audio, auto join and change addres for a new meet 
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/421881/Google%20Meet%20Automation%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/421881/Google%20Meet%20Automation%20Bot.meta.js
// ==/UserScript==


// change the default values here
const DISABLE_VIDEO = true;
const DISABLE_AUDIO = true;
const AUTO_JOIN = true;
const AUTO_REDIRECT = true;
READY = false;
/**
 * if your work email is not the first account (authuser = 0) change the authuser below
 */
const ACCOUNT_SWITCH = {
  enable: false,
  authuser: 1
}
// ------------------------------


const getButtonList = () => {
  const node_list = document.getElementsByTagName('div');
  const button_list = [];
  for (let i = 0; i < node_list.length; i = i + 1) {
    if (node_list[i].getAttribute('role') === 'button')
      button_list.push(node_list[i]);
  }
  return button_list;
}



const getDisc = () => {
  const Dnode_list = document.getElementsByTagName('div');
  const Dbutton_list = [];
  for (let i = 0; i < Dnode_list.length; i = i + 1) {
    if (Dnode_list[i].getAttribute('role') === 'button')
      Dbutton_list.push(Dnode_list[i]);
  }
  Dbutton_list.forEach(button => {
    const aria_label = button.getAttribute('aria-label')
    //alert(aria_label)
    if (aria_label == 'Opuść rozmowę')
      leave = button;
  })
  
  setTimeout(() => plan(),10000)
}



const init_screen_main = () => {
  const button_list = getButtonList();
  const button_map = {
    video: null,
    audio: null,
    join: null
  }

  button_list.forEach(button => {
    const aria_label = button.getAttribute('aria-label')
    if (button.innerText === 'Dołącz')
      button_map.join = button;
    else if (aria_label && ~aria_label.toLowerCase().indexOf('+ d'))
      button_map.audio = button;
    else if (aria_label && ~aria_label.toLowerCase().indexOf('+ e'))
      button_map.video = button;
  })
  
  
  if (DISABLE_VIDEO)
    button_map.video.click()

  if (DISABLE_AUDIO)
    button_map.audio.click()
    
  if (AUTO_JOIN){
    READY = true;
    setTimeout(() => { button_map.join.click(); }, 1000);
    setTimeout(() => getDisc(),180000) //zacznij sprawdzać nastepną lekcje 3 minuty po zaczęciu lekcji
  }

    
  
};


const checkLoad = () => {
  const divs = document.getElementsByTagName('div')
  let loaded = true
  for (let i=0;i<divs.length; i+=1) {
    if (divs[i].getAttribute('data-loadingmessage') === 'Przygotowuję...') { // :/
      loaded = false
    }
  }
  return loaded
}



const checkButtonLoad = () => {
  let clear_interval = false
  const interval_check = setInterval(() => {
    const button_list = getButtonList()
    if (checkLoad()) {
      clearInterval(interval_check)
      setTimeout(() => init_screen_main(),500)
    }
  }, 100)
}

const plan = () => {
  var d = new Date();
  var day = d.getDay();
  var m = d.getMinutes();
  var h = d.getHours();
  var time = ((h * 60) + m);
  
  //linki
  pol = "https://meet.google.com/lookup/cwnbrxn3ku?authuser=1";
  his = "https://meet.google.com/lookup/cg5s227atn?authuser=1";
  ang = "https://meet.google.com/lookup/gmghzy6mjj?authuser=1";
  inf = "https://meet.google.com/lookup/deyxcmxujx?authuser=1";
  mat = "https://meet.google.com/lookup/avb4sxjbpt?authuser=1";
  wf = "https://meet.google.com/lookup/b7yr42y3mq?authuser=1";
  nie = "https://meet.google.com/lookup/dkghxvb3tz?authuser=1";
  
  //lekcje w min
  l1 = 480;
  l2 = 535;
  l3 = 590;
  l3 = 645;
  l4 = 710;
  l5 = 765;
  l6 = 820;
  l7 = 870;
  l8 = 920;
  l9 = 970;
  
  
  //cała logika planu lekcji
  switch (day) {
    case 1: //Poniedziałek
      switch(time){
        case l3:
          window.location.replace(wf);
          break;
        case l4:
          window.location.replace(his);
          break;
        case l6:
          window.location.replace(ang);
          break;
        default:
          break;
      }
      break;
    case 2: //Wtorek
      switch(time){
        case l1:
          window.location.replace(mat);
          break;
        case l3:
          window.location.replace(ang);
          break;
        case l5:
          window.location.replace(pol);
          break;
        case l7:
          window.location.replace(his);
          break;
        default:
          break;
      }
      break;
    case 3: //Środa
      switch(time){
        case l3:
          window.location.replace(mat);
          break;
        case l4:
          window.location.replace(ang);
          break;
        case l6:
          window.location.replace(pol);
          break;
        case l7:
          window.location.replace(wf);
          break;
        case l8:
          window.location.replace(inf);
          break;
        default:
          break;
      }
      break;
    case 4: //Czwartek
      switch(time){
        case l2:
          window.location.replace(nie);
          break;
        case l3:
          window.location.replace(pol);
          break;
        case l5:
          window.location.replace(mat);
          break;
        case l7:
          window.location.replace(ang);
          break;
        case l8:
          window.location.replace(inf);
          break;
        default:
          break;
      }
      break;
    case 5: // Piątek
      switch(time){
        case l1:
          window.location.replace(ang);
          break;
        case l2:
          window.location.replace(nie);
          break;
        case l3:
          window.location.replace(mat);
          break;
        case l6:
          window.location.replace(wf);
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
  setTimeout(() => plan(),60000)
      }



const main = () => {
  window.removeEventListener('load', main);
  checkButtonLoad()
}



window.addEventListener('load', main);

//setTimeout(() => { ; }, 10000);
//setTimeout(() => {  }, 10000);

