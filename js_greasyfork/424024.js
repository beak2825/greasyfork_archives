// ==UserScript==
// @name        Add Video Controls for 9gag.com on hover
// @namespace   Violentmonkey Scripts
// @match       https://9gag.com/*
// @match       https://9gag.com/gag/*
// @grant       none
// @version     1.0
// @author      DeathByte
// @description:en Simple script for adding control elements for videos on 9gag.com and reduce ears pain from sound volume, by setting it to 20 percent
// @description Простой скрипт, добавляющий возможность контроллировать громкость видео на 9gag.com, дополнительно убавляющий ее на старте до 20%
// @downloadURL https://update.greasyfork.org/scripts/424024/Add%20Video%20Controls%20for%209gagcom%20on%20hover.user.js
// @updateURL https://update.greasyfork.org/scripts/424024/Add%20Video%20Controls%20for%209gagcom%20on%20hover.meta.js
// ==/UserScript==

"use strict"

window.onmouseover = function(event){
  const element = event.target;
  if (element.tagName =="VIDEO" && element.hasAttribute("controls") == false) {
    element.setAttribute("controls","");
    element.nextSibling.style.display="none";
    element.volume=0.2;
  }; 
};