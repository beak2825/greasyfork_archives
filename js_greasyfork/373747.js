// ==UserScript==
// @name         Spare5
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://app.spare5.com/fives/tasks
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373747/Spare5.user.js
// @updateURL https://update.greasyfork.org/scripts/373747/Spare5.meta.js
// ==/UserScript==

if(Notification.permission !== 'granted')
        Notification.requestPermission();

check();

function check(){
    let noTask = $('.task-item.error').is(':visible');
    let task = $('.task-details.task-reward').filter((n,e)=>e.innerText.indexOf('$') !== -1).is(':visible');
    if(task) request(); else if(noTask) setTimeout(function(){location.reload();},3000);
    if(!task && !noTask) setTimeout(check,500);
}

function notify() {
    var notification = new Notification('Nueva Tarea!', {
        icon: 'https://app.spare5.com/images/fivesweb/favicon-128.png',
        body: "Clickea la notificación para ir a por ella!\nPreciona la X para descartarla",
        requireInteraction: true
    });
    notification.onclick = function () {
        window.focus();
    };

}

function request(){
    if(Notification.permission !== 'granted')
        Notification.requestPermission().then(function(res){
            if(res === 'granted'){ notify(); }
        });
    else notify();
}