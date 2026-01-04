// ==UserScript==
// @name        PH Downloader - pornhubpremium.com
// @namespace   Violentmonkey Scripts
// @match       https://www.pornhubpremium.com/view_video.php
// @match       https://www.pornhub.com/view_video.php*
// @match       *://www.pornhub.com/view_video.php*
// @match       *://*.pornhub.com/view_video.php*
// @match       *://pornhub.com/view_video.php*
// @match       https://www.pornhubpremium.com/view_video.php*
// @match       *://www.pornhubpremium.com/view_video.php*
// @match       *://*.pornhubpremium.com/view_video.php*
// @match       *://pornhubpremium.com/view_video.php*
// @grant       none
// @version     1.0
// @author      -
// @description 3/12/2020, 10:56:35 PM
// @downloadURL https://update.greasyfork.org/scripts/534136/PH%20Downloader%20-%20pornhubpremiumcom.user.js
// @updateURL https://update.greasyfork.org/scripts/534136/PH%20Downloader%20-%20pornhubpremiumcom.meta.js
// ==/UserScript==

// First find the name of the flashvar variable in one of the scripts on the page:
var start = document.documentElement.innerHTML.indexOf('var flashvars_') + 'var '.length;
var tempDoc = document.documentElement.innerHTML.substr(start);
var end = tempDoc.indexOf(' =');
var flashVarsName = tempDoc.substr(0, end);
var flashVars = unsafeWindow[flashVarsName];


// Create a new tab element on the page:
var tabs = document.getElementsByClassName('video-actions-tabs')[0];
var tab = document.createElement('div');
tab.className = 'video-action-tab my-custom-tab';
tabs.appendChild(tab);

var title = document.createElement('div');
title.className = 'title';
title.innerText = 'Use right click and "Save as..." to download.';
tab.appendChild(title);

for(var i = 0; i < flashVars.mediaDefinitions.length; i++) {
  var definition = flashVars.mediaDefinitions[i];
  if (definition.format === 'hls') {
    continue;
  }
  
  console.log(definition);
  var container = document.createElement('div');
  var a = document.createElement('a');
  a.innerText = 'Download (' + definition.quality + 'p, .' + definition.format + ')';
  a.dataset.videoUrl = definition.videoUrl;
  a.href = definition.videoUrl;
  a.download = 'test-' + definition.quality + '.' + definition.format;
  a.target = '_blank';
  
  a.style.fontSize = '140%';
  container.style.marginBottom = '6px';
  
  container.appendChild(a);
  tab.appendChild(container);
}


// Create a new menu item, which opens the new tab:
var menu = document.getElementsByClassName('tab-menu-wrapper-row')[0];
var newItem = document.createElement('div');
var sub = document.createElement('div');
var icon = document.createElement('i');
var text = document.createElement('span');
text.innerText = 'Download (GM)';
icon.className = 'main-sprite-dark-2';
sub.className = 'tab-menu-item tooltipTrig';
sub.dataset.title = 'Download (GM)';
sub.dataset.tab = 'my-custom-tab';
sub.appendChild(icon);
sub.appendChild(text);
newItem.className = 'tab-menu-wrapper-cell';
newItem.appendChild(sub);
menu.appendChild(newItem);
