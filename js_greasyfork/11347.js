// ==UserScript==      
// @name         [VK] FastMessage
// @namespace    Komdosh
// @homepage     https://greasyfork.org/ru/users/13829-komdosh
// @version      1.02
// @description  Быстрая отправка сообщений в ВК
// @author       Komdosh
// @match        vk.com/i*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11347/%5BVK%5D%20FastMessage.user.js
// @updateURL https://update.greasyfork.org/scripts/11347/%5BVK%5D%20FastMessage.meta.js
// ==/UserScript==

var Message = "ФРАЗА СООБЩЕНИЯ, ЗАМЕНИТЬ НА СВОЮ";

var div = document.getElementById("im_send_wrap");
var button = document.createElement( 'button' );
button.id = "im_send";
button.className = "flat_button im_send_cont fl_l";
button.onclick = function(){main();};
button.innerHTML = "Fast";
div.appendChild(button);

function main()
{
    document.getElementById("im_editable"+id()).innerHTML+=Message;
    IM.send();
}

function id(){
    var h = window.location.toString();
    if(h.split("sel=c")[1])
        var id = 2000000000+parseInt(h.split("sel=c")[1], 10);
    if(!isNaN(h.split("sel=")[1])) 
        var id = h.split("sel=")[1];
    return id;
}