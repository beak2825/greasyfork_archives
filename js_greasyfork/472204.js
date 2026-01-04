// ==UserScript==
// @name ikometa scripts
// @namespace http://tampermonkey.net/
// @version 2.2
// @description Скрипт создан для КХашников и слабых пк.
// @author Kometa Kometa
// @license MIT
// @icon https://4ery.ru/img/favicon.ico
// @run-at document-start
// @match petridish.pw/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/472204/ikometa%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/472204/ikometa%20scripts.meta.js
// ==/UserScript==

var p = {}; var m = { registerObserver: function() {if (typeof(window.WebKitMutationObserver) == 'undefined') return;p.observer = new window.WebKitMutationObserver(function(mutationRecords) { mutationRecords.forEach(function(mutationRecord) { for (var i = 0; i < mutationRecord.addedNodes.length; ++i) { checkNode(mutationRecord.addedNodes[i]); }});}); p.observer.observe(window.document, { subtree: true, childList: true, attribute: false });}}; m.registerObserver(); function checkNode(node) { var tag = node.parentElement ? node.parentElement.tagName : ""; 
if (tag == "SCRIPT" || node.tagName == "SCRIPT") { node.textContent = node.textContent.replace(/ > zoom/g, ' > zoom && false'); // безлимитный зум
node.textContent = node.textContent.replaceAll(` function drawBorders(ctx) {`, `function drawBorders(ctx) { ctx.save();ctx.beginPath();ctx.rect(-mapmaxX, -mapmaxY, mapmaxX * 3, mapmaxY);ctx.rect(mapmaxX, 0, mapmaxX, mapmaxY * 2);ctx.rect(-mapmaxX, 0, mapmaxX, mapmaxY * 2);ctx.rect(0, mapmaxY, mapmaxX, mapmaxY);ctx.fill();ctx.lineWidth = 4;ctx.strokeStyle = '#FFFFFF';ctx.strokeRect(0, 0, mapmaxX, mapmaxY);ctx.restore();`); // границы карты
node.textContent = node.textContent.replaceAll(`if (users[i].name == 'Congratulations') {`, `if (users[i].name == 'Game starting in') {`); // звук на аренах  теперь в конце а не в начале
node.textContent = node.textContent.replace(`'black hole':'blackhole2',`, `'black hole':'geo1',`); // другой скин черной дыры
node.textContent = node.textContent.replaceAll(`setTimeout(function(){jQuery('#specbutton').show();setUnlimitedZoom(false);connnspec($('#region').val(),$('#region option:selected').html()); startthegame();setSpectate(true);}, 200);`, `setTimeout(function(){jQuery('#specbutton').show();setUnlimitedZoom(false);connnspec($('#region').val(),$('#region option:selected').html()); startthegame();setSpectate(true);}, 0);`); // на 200мс быстрее конект к серверу
node.textContent = node.textContent.replaceAll(`setInterval(updateMousePosition, 100);`, `setInterval(updateMousePosition, 0);`); // сервер видит курсор на 100мс быстрее
node.textContent = node.textContent.replaceAll(`var normalizeX = mouseX - width / 2;`,`var normalizeX = mouseX - width / 0.1;`); // середина шара Х видит курсор до 0,1
node.textContent = node.textContent.replaceAll(`var normalizeY = mouseY - height / 2;`,`var normalizeY = mouseY - height / 0.1;`); // середина шара Y видит курсор до 0,1
node.textContent = node.textContent.replaceAll(`"/engine/img/serverlogo_ru.png"`, `"/engine/serverskins/395548.png"`);}}; // ну а тут можешь просто лого своего  скина добавить место сервера

(function() { //  макрос на www кнопка Q или Й
    'use strict'; var socket, feeding; addEventListener('keydown', evt => { if(evt.keyCode == 81) {feeding = true;} });
addEventListener('keyup', evt => { if(evt.keyCode == 81) {feeding = false;} });
const send = WebSocket.prototype.send, feed_msg = Uint8Array.from([21]);
WebSocket.prototype.send = function(packet){ if(packet && packet.constructor === ArrayBuffer){ socket = this;} return send.call(this, packet); };
setInterval(() => { if(feeding){ socket.send(feed_msg); } }, 0);
})();