// ==UserScript==
// @name          Nathan Fahrenthold
// @description   Find the format of people's email addresses at each company
// @version       0.1
// @include       https://www.mturkcontent.com/dynamic/hit?assignmentId*
// @icon          https://media.giphy.com/media/puuRcLsCclFiE/giphy.gif
// @author        Blank
// @copyright     2012+, You
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/16585/Nathan%20Fahrenthold.user.js
// @updateURL https://update.greasyfork.org/scripts/16585/Nathan%20Fahrenthold.meta.js
// ==/UserScript==

var text = document.getElementsByTagName('b')[4];
var dat_box = document.getElementsByTagName('input')[1];
dat_box.addEventListener('blur',function(){if(this.value.indexOf('@')+1){this.value = this.value.split('@')[1];}}, false);

var a = document.createElement('a');
a.href = 'https://www.google.com/search?q='+text.innerHTML.split(' in ')[0].replace(/ /g,'+');
a.setAttribute('target', '_blank');
text.parentNode.insertBefore(a, text.nextSibling); 
a.appendChild(text);
