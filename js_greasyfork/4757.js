// ==UserScript==
// @name        Quick & Dirty Colorizer & New Notifier
// @description adds color to notifications
// @namespace   btnui
// @include     https://broadcasthe.net/torrents.php*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4757/Quick%20%20Dirty%20Colorizer%20%20New%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/4757/Quick%20%20Dirty%20Colorizer%20%20New%20Notifier.meta.js
// ==/UserScript==

document.body.innerHTML = document.body.innerHTML.replace(/New!/g, '<font color="red">New!</font>');
document.body.innerHTML = document.body.innerHTML.replace(/Scene/g, '<font color="#95CCB6">Scene</font>');
document.body.innerHTML = document.body.innerHTML.replace(/P2P/g, '<font color="#AE83CC">P2P</font>');
document.body.innerHTML = document.body.innerHTML.replace(/Internal/g, '<font color="#58FF00">Internal</font>');
document.body.innerHTML = document.body.innerHTML.replace(/User]/g, '<font color="#FAF18B">User]</font>');
document.body.innerHTML = document.body.innerHTML.replace(/None/g, '<font color="#E89BA0">None</font>');
//
document.body.innerHTML = document.body.innerHTML.replace(/MKV/g, '<font color="#FF4100">MKV</font>');
document.body.innerHTML = document.body.innerHTML.replace(/MP4/g, '<font color="#BE0000">MP4</font>');
document.body.innerHTML = document.body.innerHTML.replace(/AVI/g, '<font color="#FFAF00">AVI</font>');