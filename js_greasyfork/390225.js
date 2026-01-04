// ==UserScript==
// @name       Expand Trello Cards (fixed)
// @namespace  https://github.com/sudokai
// @version    2019.09.26
// @description  Expands Trello cards for better viewing and editing on bigger screens.
// @match      https://trello.com/*
// @author       flipxfx, sudokai (https://github.com/sudokai)
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390225/Expand%20Trello%20Cards%20%28fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/390225/Expand%20Trello%20Cards%20%28fixed%29.meta.js
// ==/UserScript==

//Add style to expand card and comment textareas
var style = document.createElement('style')
style.type = 'text/css'
style.innerHTML = '.js-text { height: 500px !important; } .window { bottom: auto !important; left: auto !important; margin: 30px auto 30px auto !important; padding: 0 !important; position: relative !important; right: auto !important; top: auto !important; width: 95% !important; } div.window-main-col { width: 80% !important; } div.window-sidebar { width: 15% !important; position: relative !important;}';
document.getElementsByTagName('head')[0].appendChild(style);