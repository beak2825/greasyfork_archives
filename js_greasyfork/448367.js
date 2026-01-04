// ==UserScript==
// @name            hide discord comments
// @description     Hides specific Discord messages at the click of a button
// @version         1.0.0
// @author          infiniteVolatility
// @match           https://*.discord.com/app
// @match           https://*.discord.com/channels/*
// @match           https://*.discord.com/login
// @grant           none
// @namespace https://greasyfork.org/users/938600
// @downloadURL https://update.greasyfork.org/scripts/448367/hide%20discord%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/448367/hide%20discord%20comments.meta.js
// ==/UserScript==

let shush;

const createShush = (html) => {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.removeChild(temp.firstElementChild);
};

shush=createShush(`<svg class=shush aria-hidden="false" width="20" height="20" style="margin-right: 10px; margin-left: 50%; border: 2px solid white; box-shadow: 1px 1px 1px white; cursor: pointer;" role="button">
        <image href="https://pbs.twimg.com/profile_images/2624883867/015_bender-laugh_reasonably_small.gif" width="100%" height="100%"></image>
    </svg>`)

async function shushify(e){
  this.parentNode.style.display="none"
}


function mountShush() {
  const messages = [...document.querySelectorAll('[id^="chat-messages"]')].slice(-10);
  for(let i = 0; i < messages.length; i++){
    if( messages[i].querySelector(".shush") === null){
    messages[i].appendChild(shush.cloneNode(true))
    }
  }
 const shushes = [...document.querySelectorAll('[class^="shush"]')];
  for(let i = 0; i < shushes.length; i++){
    shushes[i].addEventListener('click', shushify, false);
    }
  const repliedShushPreviews = [...document.querySelectorAll('[class^="repliedTextPreview"]')].slice(-10)
  for(let i = 0; i < repliedShushPreviews; i++){
    repliedShushPreviewsstyle.setProperty('width','100%','');
  }
}

const observer = new MutationObserver(mountShush);

function addObserverIfDesiredNodeAvailable() {
    var targetShush = [...document.querySelectorAll('[class^="scrollerInner"]')][0];
    if(!targetShush) {
        window.setTimeout(addObserverIfDesiredNodeAvailable,500);
        return;
    }
    var shushConfig = { childList: true, subtree: true };
    observer.observe(targetShush, shushConfig);
    mountShush();
}
addObserverIfDesiredNodeAvailable();
