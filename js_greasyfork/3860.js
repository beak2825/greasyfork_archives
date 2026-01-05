// ==UserScript==
// @name        La Cosa Video&Chat
// @include     http://www.beppegrillo.it/la_cosa/
// @description	Rimpicciolisce il Video e allarga la chat
// @version     1.1
// @grant       none
// @namespace https://greasyfork.org/users/4153
// @downloadURL https://update.greasyfork.org/scripts/3860/La%20Cosa%20VideoChat.user.js
// @updateURL https://update.greasyfork.org/scripts/3860/La%20Cosa%20VideoChat.meta.js
// ==/UserScript==



video = document.getElementById('video-home');
chat = document.getElementById('disqus_thread');
primary = document.getElementById('primary');
secondary = document.getElementById('secondary');


document.getElementById('primary').style.width = '35%';
document.getElementById('primary').style.paddingRight = '0px';
document.getElementById('primary').style.float = 'left';
document.getElementById('primary').style.display = 'block';
document.getElementById('primary').style.position = 'relative';

document.getElementById('secondary').style.width = '65%';
document.getElementById('secondary').style.paddingRight = '0px';
document.getElementById('secondary').style.paddingLeft = '0px';

document.getElementById('message').style.background = 'white';
chat.removeAttribute('class');
chat.setAttribute('style', 'padding:0px;height:800px;overflow-x:scroll;');