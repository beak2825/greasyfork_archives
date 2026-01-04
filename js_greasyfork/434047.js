// ==UserScript==
// @name         Gats.io - Multiboxing Script
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Multiboxing script for Gats.
// @author       nitrogem35
// @match        https://gats.io
// @downloadURL https://update.greasyfork.org/scripts/434047/Gatsio%20-%20Multiboxing%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/434047/Gatsio%20-%20Multiboxing%20Script.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    //note for the dev: fix your game lmfao
    var channel = new BroadcastChannel('multibox');
    var main = true;
 
    channel.postMessage('.');
 
    channel.onmessage = function(ev) {
        if(ev.data == '.') {
            main = false;
            document.addEventListener('mousemove', mousemove);
 
            function mousemove(event) {
                channel.postMessage(`m,${event.clientX},${event.clientY}`);
            }
 
            document.addEventListener('mousedown', mousedown);
 
            function mousedown(event) {
                channel.postMessage(`k,${event.clientX},${event.clientY},0`);
            }
 
            document.addEventListener('mouseup', mouseup);
 
            function mouseup(event) {
                channel.postMessage(`k,${event.clientX},${event.clientY},1`);
            }
 
            document.addEventListener('keydown', keydown);
 
            function keydown(event) {
                channel.postMessage(`a,${event.keyCode},1`);
            }
 
            document.addEventListener('keyup', keyup);
 
            function keyup(event) {
                channel.postMessage(`a,${event.keyCode},0`);
            }
        }
        else if(main) {
            if(ev.data.startsWith("m")) {
                var packet = ev.data.split(",");
                packet.shift();
                var mouseMoveEvent = document.createEvent("MouseEvents");
                mouseMoveEvent.initMouseEvent(
                    "mousemove",true,false,unsafeWindow,1,50,50,packet[0],packet[1],false,false,false,false,0,null
                );
                canvas.dispatchEvent(mouseMoveEvent);
            };
 
            if(ev.data.startsWith("k")) {
                var packet = ev.data.split(",")
                packet.shift();
                var mouseClickEvent = document.createEvent("MouseEvents");
                var z = ["mousedown", "mouseup"]
                var type = z[parseInt(packet[2])]
                mouseClickEvent.initMouseEvent(type,true,false,unsafeWindow,1,50,50,packet[0],packet[1],false,false,false,false,0,null);
                canvas.dispatchEvent(mouseClickEvent)
            };
 
            if(ev.data.startsWith("a")) {
                var packet = ev.data.split(",");
                packet.shift();
                if(packet[1] == "1") {
                    var evt = new KeyboardEvent('keydown', {'keyCode': packet[0]});
                }
                else {
                    var evt = new KeyboardEvent('keyup', {'keyCode': packet[0]});
                };
                document.dispatchEvent(evt);
            };
        };
    }
 
})();