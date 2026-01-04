// ==UserScript==
// @name         Newrow Multi-Tasker
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Multitask your work by embedding your class connect in the lesson page!
// @author       Chase Davis
// @match        https://smart.newrow.com/*
// @match        https://learning.k12.com/d2l/le/*
// @icon         https://www.google.com/s2/favicons?domain=newrow.com
// @grant        GM_setValue
// @grant        GM_getValue
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/434236/Newrow%20Multi-Tasker.user.js
// @updateURL https://update.greasyfork.org/scripts/434236/Newrow%20Multi-Tasker.meta.js
// ==/UserScript==

(function() {
    'use strict';
jQuery(function($){

    console.log(!document.URL.includes('d2l'))

if (document.URL.includes('/room/') && !document.URL.includes('d2l')) {
    GM_setValue('link', document.URL);
    alert('Link copied, you may now leave and open a lesson.');
};

// ^ If on newrow, copy link. Otherwise, execute this v

if (document.URL.includes('d2l')) {
let link = GM_getValue('link');
if (link.includes('newrow')){
    link == "https://google.com";
    GM_setValue('link', link)
}
console.log(link)

setTimeout(function(){//Make this whole thing take place 1 second after the page loads

    function abort() {
        document.getElementById('newrowFrame').remove();
        alert('This page has iframe protection, rendering this script useless.\n\nTo use this script on this domain you need to install the "Ignore X-Frame Headers" plugin.\n\nYou can find it here: https://chrome.google.com/webstore/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe\n\nThe script will now disable itself to avoid using CPU.');
    };

    document.abort_ = abort;

    $('body').append(`

    <div id="newrowFrame" style="border-radius: 8px; resize: both; overflow: auto; position: absolute; padding: 10px; background-color: #fff; top: 10%; left: 1%; box-shadow: -2px 2px 3px 0px #00000050; border: 1px solid #808080; min-height: 280px; min-width: 365px; z-index: 1000;">
        <div id="newrowFrameDraggable" style="background-color: #f0f0f0; position: relative; width: 95%; height: 5%; border-radius: 8px; font-size: 50%; text-align: center; min-height: 25px;">Click To Drag</div>
        <iframe id="newrowIFrame" src="`+link+`" style="border-radius: 8px; width: 100%; height: 70%;"></iframe><hr>
        <div>
            <p style="margin: 0px; font-size: 70%">Class Link: <input id="link" value="`+link+`"></input> <button onClick="abort_()" id="abort">Not Working?</button></p>
        </div>
    </div>

    `)

    dragElement(document.getElementById("newrowFrameDraggable"));

    function dragElement(elmnt) { // toooooootally not stolen
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(document.getElementById('newrowFrame').id + "header")) {
            document.getElementById(document.getElementById('newrowFrame').id + "header").onmousedown = dragMouseDown;
        } else {
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.getElementById('newrowFrame').style.top = (document.getElementById('newrowFrame').offsetTop - pos2) + "px";
            document.getElementById('newrowFrame').style.left = (document.getElementById('newrowFrame').offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    $('#link').change(function(){
        GM_setValue('link',$('#link').value)
        console.log($('#link').innerHTML)
    })

},1000);



}});
})();