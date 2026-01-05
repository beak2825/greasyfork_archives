// ==UserScript==
// @name            ForumEnhancement
// @author          skyboy
// @version         1.0.4.1
// @history         1.0.2 fix - change from eval and unsafeWindow to javascript url
// @history         1.0.0 initial release - Allow tab to be pressed.
// @description     Allow tabbing in forum posting
// @include         *://www.kongregate.com/forums/*/topics/*
// @homepage        http://userscripts-mirror.org/scripts/show/70154
// @namespace https://greasyfork.org/users/32649
// @downloadURL https://update.greasyfork.org/scripts/17719/ForumEnhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/17719/ForumEnhancement.meta.js
// ==/UserScript==

setTimeout(function () {
     window.location.href = "javascript:function replaceSelection(i,rS){if(i.setSelectionRange){var sS=i.selectionStart,sE=i.selectionEnd;i.value=i.value.substring(0,sS)+rS+i.value.substring(sE);if(sS!=sE){setSelectionRange(i,sS,sS + rS.length);}else{setSelectionRange(i,sS+rS.length,sS+rS.length);}}else if(document.selection){var range=document.selection.createRange();if(range.parentElement()==i){var isCollapsed=range.text=='';range.text=rS;if(!isCollapsed){range.moveStart('character',-rS.length);range.select();}}}};function setSelectionRange(i,sS,sE){if(i.setSelectionRange){i.focus();i.setSelectionRange(sS,sE);}else if(i.createTextRange){var range=i.createTextRange();range.collapse(true);range.moveEnd('character',sE);range.moveStart('character',sS);range.select();}};function onKey(item,e,a){if(e.keyCode==Event.KEY_TAB){a=item.scrollTop;replaceSelection(item,String.fromCharCode(9));e.stop();item.scrollTop=a;return false;};return true};try{($('post_body')||$('topic_body')).setAttribute('onkeydown','return onKey(this,event);');$('edit_post_body').setAttribute('onkeydown','return onKey(this,event);')}catch(e){};void(0)";
}, 1250);