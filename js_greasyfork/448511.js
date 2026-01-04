// ==UserScript==
// @name         Always-Off Ping Reply
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds an option in the reply bar to keep reply pings off automatically.
// @author       TheVoidUnknown
// @match        https://discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448511/Always-Off%20Ping%20Reply.user.js
// @updateURL https://update.greasyfork.org/scripts/448511/Always-Off%20Ping%20Reply.meta.js
// ==/UserScript==

(function() {
    'use strict';
jQuery(function($){

let toggle = GM_getValue('toggle');
let css
let html

if (toggle == null) { // Set toggle switch to true when running for the first time
    GM_setValue('toggle', true);
    toggle = true
}

function define() {
css = `
.switch {
  position: relative;
  display: inline-block;
  width: 35px;
  height: 20px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--text-muted);
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: var(--text-normal);
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--text-link);
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(15px);
  -ms-transform: translateX(15px);
  transform: translateX(15px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
`

html = `
<div id="alwaysOffPings_wrapper" style="padding: 8px;">
    <label id="infoTxt" style="
        font-family: var(--font-primary);
        font-size: 14px;
        line-height: 18px;
        color: var(--header-secondary);
    ">Always Off Pings:
    </label>

    <label class="switch" id="alwaysOffPings">
      <input type="checkbox" id="switchCheckBox" checked=${toggle}>
      <span class="slider round"></span>
    </label>
</div>

<div class="separator" style="width: 1px; height: 20px; background-color: var(--background-modifier-accent);" aria-hidden="true"></div>`
}
define();
// ^ This function is solely to let me minimize these 50 lines

let style = document.createElement("style");
style.id = "epicStyle";
style.innerHTML = css;
document.head.append(style)



// No. Dont say it. I was too lazy to do it the right way.
// If it works it works
let loop = setInterval(function(){

    let replyBar = document.querySelector('[class^="actions-"]');
    let checkbox = document.querySelector('#switchCheckBox');
    let mention = document.querySelector('[class*="mentionButton-"]');

    try{checkbox.addEventListener('change', (event) => {
            GM_setValue('toggle',checkbox.checked);
            toggle = GM_getValue('toggle');
    })}catch{};

    if (replyBar!=null && checkbox==null) {
        $('[class^="actions"]').prepend(html);
    } else if (replyBar!=null && mention.parentElement.ariaChecked == "true" && toggle==true){
        mention.parentElement.click();
    } else if (replyBar!=null && toggle==false) {
        mention.parentElement.style.display = 'block'
    } else if (replyBar!=null && toggle==true) {
        mention.parentElement.style.display = 'none'
    };

},10);

})})();