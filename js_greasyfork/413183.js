// ==UserScript==
// @name         view_delete_message
// @namespace    http://tampermonkey.net/
// @version      0.112
// @description  try to take over the world!
// @author       Life
// @match        https://shikme.ru/
// @icon         https://shikme.ru/default_images/icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413183/view_delete_message.user.js
// @updateURL https://update.greasyfork.org/scripts/413183/view_delete_message.meta.js
// ==/UserScript==
// updateURL    https://greasyfork.org/scripts/413183-view-delete-message/code/view_delete_message.user.js
/* jshint esversion: 6 */
(function() {
    'use strict';
if (observer) observer.disconnect();
var observer = new MutationObserver(function(mutationList) {
    for (let mutation of mutationList) { /*console.log(mutation); /*removedNodes*/
		if (mutation.previousSibling && mutation.previousSibling.nodeName != "#text") for (let child of mutation.removedNodes) if (child.indexOf&&child.id !='' && (child.indexOf('__') ==-1) && typeof child.length != 'number' && child.children.length>1){
			//var it = child.children[1].innerText.replace(/\x09/g,"").split("\x0a");
			//console.log(it[2]+": "+it[0]+": "+it[1]);
			console.log(mutation);
			console.log(child.children[1].innerText.replace(/\x09/g,""));
			console.log(child);
			if (mutation.nextSibling) mutation.target.insertBefore(child, mutation.nextSibling); else mutation.target.append(child);
			child.setAttribute('style','background: linear-gradient(0deg, #222, #522, #222);' );
			child.id+="_";
        }
    }
});
observer.observe(chat_logs_container, {childList: true, subtree: true});


var a= new Date;
function status(){
    var b= new Date;
    if (!(a.getHours()==b.getHours()&&a.getMinutes()==b.getMinutes() )){

        if (a.getHours()== 8&&a.getMinutes()== 0){ $.post('system/action.php', {update_status: 9, token: utk}, function(response) {console.log('Читаю')}) }
        if (a.getHours()== 8&&a.getMinutes()==15){ $.post('system/action.php', {update_status: 5, token: utk}, function(response) {console.log('Кушаю')}) }
        if (a.getHours()== 8&&a.getMinutes()==30){ $.post('system/action.php', {update_status: 9, token: utk}, function(response) {console.log('Читаю')}) }

        if (a.getHours()==12&&a.getMinutes()==15){ $.post('system/action.php', {update_status: 5, token: utk}, function(response) {console.log('Кушаю')}) }
        if (a.getHours()==12&&a.getMinutes()==30){ $.post('system/action.php', {update_status: 9, token: utk}, function(response) {console.log('Читаю')}) }
        if (a.getHours()==13&&a.getMinutes()== 0){ $.post('system/action.php', {update_status: 8, token: utk}, function(response) {console.log('Сплю')}) }
        if (a.getHours()==14&&a.getMinutes()== 0){ $.post('system/action.php', {update_status: 9, token: utk}, function(response) {console.log('Читаю')}) }

        if (a.getHours()==18&&a.getMinutes()==15){ $.post('system/action.php', {update_status: 5, token: utk}, function(response) {console.log('Кушаю')}) }
        if (a.getHours()==18&&a.getMinutes()==30){ $.post('system/action.php', {update_status: 9, token: utk}, function(response) {console.log('Читаю')}) }
        if (a.getHours()==22&&a.getMinutes()== 0){ $.post('system/action.php', {update_status: 8, token: utk}, function(response) {console.log('Сплю')}) }
    }
    a=b;
}
setInterval(status, 1500);


})();