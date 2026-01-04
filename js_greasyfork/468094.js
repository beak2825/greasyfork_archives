// ==UserScript==
// @name        ArcaTL++
// @namespace   Violentmonkey Scripts
// @match       https://arca.live/*
// @grant       None
// @license     MIT
// @version     1.3
// @author      PetricaT
// @description USE ALONGSIDE THE DEFAULT ENGLISH TRANSLATION FROM BOTTOM RIGHT COG WHEEL SETTINGS MENU
// @downloadURL https://update.greasyfork.org/scripts/468094/ArcaTL%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/468094/ArcaTL%2B%2B.meta.js
// ==/UserScript==

// Make sure to choose how you want these things to be called
const defaultVars = false;
// I DONT KNOW HOW TO GET USER VARS WITH THE API, IT BROKEY
if(defaultVars){
  // These are the default translations and nothing has been modified
  window.boardOrChannel = "Channel";
  window.falloutAbbr = "Fallout";
  window.screenshotEmoji = "✅";
} else {
  // My personal tweaks
  window.boardOrChannel = "Board";
  window.falloutAbbr = "FO";
  window.screenshotEmoji = "📷";
}


function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function subButton(){
  const sub = document.querySelector('span.subscribe span.text');
  sub.textContent = 'Subscribed';
  const subbed = document.querySelector('span.subscribed span.text');
  subbed.textContent = 'Subscribed';
  const unsub = document.querySelector('span.unsubscribe span.text');
  unsub.textContent = 'Unsubscribe';
}

function notifButton(){
  const notif = document.querySelector('span.notificate span.text');
  notif.textContent = 'Notifications'
  const notificated = document.querySelector('span.notificated span.text');
  notificated.textContent = 'Notifications'
  const unnotif = document.querySelector('span.unnotificate span.text');
  unnotif.textContent = 'Disable'
}

function wiki(){
  // Getting bored with naming these elements
  const element = document.querySelector('.btn.btn-sm span.text');
  element.textContent = `${boardOrChannel} Wiki`
  const element2 = document.querySelector('.nav-item.d-block .nav-link span');
  element2.textContent = 'Wiki'
  const news = document.querySelector('.nav-item.d-none.d-sm-block .nav-link span');
  news.textContent = 'News'
}

function buttons(){
  // Translation for the compose/write/post/make post button
  const create = document.querySelector('.float-right .btn.btn-sm.btn-arca.btn-arca-article-write');
  create.innerHTML = '<span class="ion-compose"></span> Write';
  // Didn't know you can just write plain html into a element like this, I like JS :)
}

function title(){
  // Translates the title and description of the board if you're on Tullius
  //--Title
  const title = document.querySelector('a.title');
  title.innerHTML = `<span title="툴리우스 채널">Tullius ${boardOrChannel}</span>`;
  //--Description
  const desc = document.querySelector('div.description');
  const descDivs = desc.querySelectorAll('div');
  const descText = descDivs[1].textContent;
  if(descText.trim() == '엘더스크롤 / 폴아웃 모드관련 채널, 공지에서 규칙 읽자'){
    descDivs[1].textContent = 'Elder Scrolls / Fallout mod-related channel, read the rules in the announcement.';
  }
}

function subbedChannels(){
  // Renames the channel using the href already included in the tag, horay!
  const channel = document.querySelector('a.dropdown-item.d-flex.align-items-center');
  const href = channel.getAttribute('href');
  var text = href.replace('/b/', '');
  const channelText = channel.querySelector('span.mr-auto');
  text = capitalizeFirstLetter(text);
  text = text + ' ' + boardOrChannel;
  channelText.textContent = text;
}

function translateCategory(text){
  switch(text){
    case '질문':
      return '❔ Questions';
    case '프리셋':
      return '👤 Preset';
    case '동료':
      return '👭 Follower'
    case '모드/번역':
      return '🇰🇷 Mod/Translation'
    case '의상':
      return '🦺 Armor'
    case '정보':
      return 'ℹ️ Information'
    case '폴모드':
      return `⚛ ${falloutAbbr} Mods`
    case '폴의상':
      return `⚛🦺 ${falloutAbbr} Armor`
    case '폴정보':
      return `⚛ℹ️ ${falloutAbbr} Information`
    case '✅스샷':
      return `${screenshotEmoji} Screenshots`
    case '🔞스샷':
      return `🔞${screenshotEmoji} Screenshots`
    case '🔞기타':
      return '🔞 Other'
    case '피드백':
      return '💬 Feedback'
    case '💎대회':
      return '💎 Contests'
    case '연재':
      return 'Series/Stories'
    case '리소스':
      return 'Modding Resources'
    case '스필 모드/번역':
      return 'Starfield/Translation (🇰🇷)'
    case '스필 정보':
      return 'Starfield General'
    case '크래쉬로그':
      return 'Crashlogs'
    case '운영':
      return 'Operations'
    default:
      return text;
  }
}

function categories(){
  // Trasnlates the filters with hardcoded words instead of relying on TWB
  const elements = document.querySelectorAll('div.board-category.hide-scrollbar span.item');
  console.log(`Found ${elements.length} elements`);
  for(let i = 0; i < elements.length; i++){
    let temp = elements[i].querySelector('a');
    let reply = translateCategory(temp.innerHTML)
    temp.innerHTML = reply;
  }
}

function multiLineMenu(){
  // Transforms the menu into a more friendly 2 line view to see all the board filters at the same time
  const element = document.querySelector('div.board-category.hide-scrollbar');
  element.style.height = 'auto';
  element.style.flexWrap = 'wrap';
}

function showComments(){
  const comSec = document.getElementById('comment');
  comSec.style.visibility = 'visible';
  comSec.style.scrollbar = 'hidden'
  comSec.style.height = 'fit-content';
}

function hideComments(){
  // const comSec = document.querySelector('div.comment');
  const comSec = document.getElementById('comment');
  comSec.style.visibility = 'hidden';
  comSec.style.height = '0px';
}

function hideCommentsButton(){
  const articleMenu = document.querySelector('div.article-menu.mt-2');
  const button = document.createElement('button');
  hideComments();
  button.innerText = 'Show comments';
  var clicked = false;
  articleMenu.appendChild(button);
  button.addEventListener('click', () => {
    if(clicked){
    button.innerText = 'Show comments';
      clicked = false;
      hideComments();
    } else {
    button.innerText = 'Hide comments';
      clicked = true;
      showComments();
    }
  })
}

// Use number keys 2 3 and 4 to navigate: top, bottom and feed
document.addEventListener('keydown', function(event) {
  if(event.keyCode == 52){
    // 4
    document.getElementById('goListBtn').click();
  }
  if(event.keyCode == 50){
    // 2
    document.getElementById('goTopBtn').click();
  }
  if(event.keyCode == 51){
    // 3
    document.getElementById('goBottomBtn').click();
  }
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// !!!ALL THE FUNCTIONS THAT ENABLE THE FIXES AND PATCHES AND STUFF GO HERE!!!!
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Simply comment out the stuff you don't want! =)
function miscFixes(){
  multiLineMenu();
  // hideCommentsButton(); BROKEN
}

function translateMain(){
  subbedChannels();
}

function translateTullius(){
  subButton();
  notifButton();
  wiki();
  buttons();
  title();
  categories();
}

function Main(){
  translateMain();
  translateTullius();
  miscFixes();
}

window.onload = Main;
