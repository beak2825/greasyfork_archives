// ==UserScript==
// @name         plug.dj theme_private1
// @namespace    http://tampermonkey.net/
// @version      0.2.9_ct
// @description  plug.dj client-side theme
// @author       SuicidalSheep
// @match        https://plug.dj/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33715/plugdj%20theme_private1.user.js
// @updateURL https://update.greasyfork.org/scripts/33715/plugdj%20theme_private1.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

/*var script = document.createElement('script');
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);*/

/*var script = document.createElement('script');
script.src = 'https://code.jquery.com/ui/1.12.1/jquery-ui.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);*/

// addGlobalStyle('.entryBody { max-width: 900px !important; }');

// start {
addGlobalStyle('#dj-button { background-color: #925aff !important; animation-name: djbutton !important; animation-duration: 2s; animation-iteration-count: infinite !important; animation-direction: alternate; }');

addGlobalStyle('@keyframes djbutton {from {background-color: #925aff;} to {background-color: #5c0aff;}}');

addGlobalStyle('#dj-button .left { background: inherit !important; }');
addGlobalStyle('#dj-button.is-leave .left, #dj-button.is-quit .left { background: inherit !important; }');

addGlobalStyle('#dj-button span { transition: text-shadow 1s !important; transition-timing-function: ease-in-out !important; }');
addGlobalStyle('#dj-button span:hover { text-shadow: 4px 1px 4px #CCCCCC !important; }');

addGlobalStyle('.dialog.destructive .button.submit { background: #F46B40 !important; transition: background 1s !important; transition-timing-function: ease-in-out !important; }');
addGlobalStyle('.dialog.destructive .button.submit:hover { background: #c42e3b !important; }');

addGlobalStyle('#user-rollover .meta.offline {  }');
addGlobalStyle('.offline .thumb { border: 2px solid #555d70!important; animation-name: offlineborder; animation-duration: 3s; animation-iteration-count: infinite!important; animation-direction: alternate; }');
addGlobalStyle('@keyframes offlineborder {from {border: 2px solid #555d70;} to {border: 2px solid #77797e;}}');

addGlobalStyle('#user-rollover .meta.offline .status i { 2px solid #555d70!important; animation-name: offline-circle; animation-duration: 1s; animation-iteration-count: infinite!important; animation-direction: alternate; }');
addGlobalStyle('@keyframes offline-circle {from {border: 2px solid #555d70;} to {border: 2px solid #b00e0e;}}');

addGlobalStyle('#user-rollover .meta.offline .status span {  }');

addGlobalStyle('.thumb { border: 2px solid #00ec03!important; }');

// addBlobalStyle('.badge-box.no-badge i:before { content: "n/a"; }');

/*$("#woot").click(function(){
    $("div").animate({left: '250px'});
});*/

addGlobalStyle('#chat .cm:nth-child(2n+1) { background: rgba(0, 0, 0, 0)!important; }');

/*addGlobalStyle('#chat-messages { transition: background 2.4s; transition-timing-function: cubic-bezier(2,5,4,4) !important; background: -webkit-linear-gradient(left, rgba(255,255,255,.11) 0%, rgba(0,0,0,1) 100%)!important; color: #c8c8c8!important;  }');
addGlobalStyle('#chat-messages:hover { background: #000000!important; }');
*/
addGlobalStyle('#chat-input { background: rgba(40, 44, 47, 0.8)!important; }');

addGlobalStyle('#room .app-right { transition: background 2.4s; transition-timing-function: cubic-bezier(2,5,4,4) !important; background: rgba(0, 0, 0, 0)!important; }');
addGlobalStyle('#room .app-right:hover { background: #000000!important; }');

addGLobalStyle('#vote .crowd-response.disabled { cursor: not-allowed;  }');
// } end