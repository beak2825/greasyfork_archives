// ==UserScript==
// @name            FanFiction DocEdit Toggle Lights
// @namespace       FanFiction
// @author          DragShot
// @oujs:author     TheDragShot
// @released        2015-06-10
// @updated         2022-10-26
// @version         1.3
// @lastchanges     Removed dependency on jQuery, updated some broken identifiers
// @copyright       2022, DragShot
// @homepageURL     https://dragshot.webcindario.com/software/fftoggle.php
// @license         GPL-3.0-only
// @icon            https://www.fanfiction.net/static/images/favicon_2010_iphone.png
// @description     Adds a button to the doc editor toolbar which toggles lights ON (black text on a white background) and OFF (white text on a black background). Mixing this with the fullscreen mode results in a more comfortable writing experience for your eyes.
// @include         *www.fanfiction.net/docs/edit.php*
// @include         *www.fanfiction.net/account/profile.php*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/453758/FanFiction%20DocEdit%20Toggle%20Lights.user.js
// @updateURL https://update.greasyfork.org/scripts/453758/FanFiction%20DocEdit%20Toggle%20Lights.meta.js
// ==/UserScript==

/* CHANGELOG ////////////////////////////////////////

1.3 (10/26/2022)
    - Removed dependency on jQuery.
    - Updated some broken identifiers.
    - Now the script will more carefully check for the availability of the needed components instead of simply waiting for a second.

1.2 (06/29/2015)
    - Now it works in the edit profile section too!

1.1 (06/10/2015)
    - Now the script uses 'localStorage' to remember your choice and apply it in the next session.
    - Minor code cleanups performed.

///////////////////////////////// END OF CHANGELOG */

//$('document').ready(function(){
window.addEventListener('load', function() {
  if(!localStorage.getItem('ds.js.fanfiction.togglelights.lightson')) {
    localStorage.setItem('ds.js.fanfiction.togglelights.lightson',1);
  }
  function createNewNode(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
    }
    return frag;
  }
  function addClass(element, cls) {
    if (!element.classList.contains(cls)) {
      element.classList.add(cls);
    }
  }
  function removeClass(element, cls) {
    element.classList.remove(cls);
  }
  function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
  function toggleClass(element, cls) {
    element.classList.toggle(cls);
  }
  function retryWithDelay(fnc, delay) {
    var res = fnc();
    if (!res) window.setTimeout(() => { retryWithDelay(fnc, delay); }, delay);
  }
  //A timeout set to wait until the editor iframe is available
  //setTimeout(function(){
  retryWithDelay(function() {
    var url = window.location.href;
    var toolBar;
    if (url.indexOf('docs/edit.php') != -1)
      toolBar = document.getElementById('mceu_15-body');
    else
      toolBar = document.getElementById('mceu_19-body');
    var bio_ifr = document.getElementById('bio_ifr').contentDocument;
    var tinymce = bio_ifr.getElementById('tinymce');
    if (!toolBar || !bio_ifr || !tinymce) {
      return false;
    }
    var btn = createNewNode('<div aria-label="Toggle lights" role="button" id="mceu_ds1" class="mce-widget mce-btn" tabindex="-1" aria-labelledby="mceu_ds1"><button role="presentation" type="button" tabindex="-1"><i id="dsico-1" class="mce-ico mce-i-forecolor"></i></button></div>');
    // Using native DOM methods to insert the fragment
    toolBar.insertBefore(btn, toolBar.lastChild);
    btn = toolBar.lastChild.previousElementSibling;
    bio_ifr.head.appendChild(createNewNode('<style>.lightson{background-color: #FFF;color: #000;}.lightsoff{background-color: #3A3A3A;color: #FFF;}</style>'));
    //$('#bio_ifr').contents().find("head").append('<style>.lightson{background-color: #FFF;color: #000;}.lightsoff{background-color: #3A3A3A;color: #FFF;}</style>');
    //$('.lightson').css('background-color','#FFF');
    //$('.lightson').css('color','#000');
    //$('.lightsoff').css('background-color','#3A3A3A');
    //$('.lightsoff').css('color','#FFF');
    var dsico = document.getElementById('dsico-1');
    if (localStorage.getItem('ds.js.fanfiction.togglelights.lightson') == 1) {
      //$(tinymce).toggleClass('lightson',true);
      //$('#dsico-1').toggleClass('mce-i-forecolor',true);
      addClass(tinymce, 'lightson');
      addClass(dsico, 'mce-i-forecolor');
    } else {
      //$(tinymce).toggleClass('lightsoff',true);
      //$('#dsico-1').toggleClass('mce-i-forecolor',false);
      //$('#dsico-1').toggleClass('mce-i-backcolor',true);
      addClass(tinymce, 'lightsoff');
      removeClass(dsico, 'mce-i-forecolor');
      addClass(dsico, 'mce-i-backcolor');
    }
    //btn.onclick = (function() {
    btn.addEventListener('click', function() {
      //$(tinymce).toggleClass('lightson');
      //$(tinymce).toggleClass('lightsoff');
      console.log('btn.onClick()');
      toggleClass(tinymce, 'lightson');
      toggleClass(tinymce, 'lightsoff');
      //$('#dsico-1').toggleClass('mce-i-forecolor');
      //$('#dsico-1').toggleClass('mce-i-backcolor');
      toggleClass(dsico, 'mce-i-forecolor');
      toggleClass(dsico, 'mce-i-backcolor');
      //localStorage.setItem('ds.js.fanfiction.togglelights.lightson',($(tinymce).hasClass('lightson')? 1:0));
      localStorage.setItem('ds.js.fanfiction.togglelights.lightson', (hasClass(tinymce, 'lightson') ? 1 : 0));
    });
    return true;
  //},1000);
  }, 500);
});