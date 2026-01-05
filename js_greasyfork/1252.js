// ==UserScript==
// @name       spoiler tmd
// @description  postul #0 in spoiler
// @version    0.3
// @description  enter something useful
// @include     *torrentsmd.com/forum.php*
// @include     *torrentsmd.*/forum.php*
// @include     *torrentsmoldova.*/forum.php*
// @copyright   2012+, XXN
// @icon         http://s017.radikal.ru/i432/1308/7b/34fa18a96812.png
// @namespace https://greasyfork.org/users/213
// @downloadURL https://update.greasyfork.org/scripts/1252/spoiler%20tmd.user.js
// @updateURL https://update.greasyfork.org/scripts/1252/spoiler%20tmd.meta.js
// ==/UserScript==

if (cc = document.getElementById('forumPosts_first').getElementsByClassName('comment')[0])
    { cc.innerHTML= 
      '<div id="my_click"  style="font-weight: bold;">[Spoiler]</div>'
    + '<div id="my_spoiler" style="display: none;">' +cc.innerHTML +'</div>'       
   
    document.getElementById('my_click').onclick = function (e)
    {    el=document.getElementById('my_spoiler');           
      if ( el.style.display=='none') {el.style.display= ''    }
      else                          {el.style.display= 'none'}
    }
    $j('div.sp-head').toggleClass('jsClickEvAttached',false); $j('div.sp-head').unbind()
    $j('div.sp-foot').toggleClass('jsClickEvAttached',false); $j('div.sp-foot').unbind()
    initSpoilers()
    }