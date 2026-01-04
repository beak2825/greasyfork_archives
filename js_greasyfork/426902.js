// ==UserScript==
// @name        Hide no Catalogo
// @namespace   Violentmonkey Scripts
// @match       https://1500chan.org/*
// @grant       none
// @version     1.0
// @author      -
// @description Enconder fios no catálogo.
// @downloadURL https://update.greasyfork.org/scripts/426902/Hide%20no%20Catalogo.user.js
// @updateURL https://update.greasyfork.org/scripts/426902/Hide%20no%20Catalogo.meta.js
// ==/UserScript==
var locked = false;

function getStoreValue(path) {
return JSON.parse(localStorage[path] || 'null');
}

function setStoreValue(path, val) {
localStorage[path] = JSON.stringify(val);
}

function getThisThreadJSON(cb) {
$.getJSON(location.pathname.replace('.html', '.json'))
.done(function (response) {
if (typeof cb === 'function') {
cb(response.posts);
}
});
}

window.hideThread = function(threadId) {
// console.log("Escondendo fio "+threadId);
let hT = getStoreValue('hiddenThreads');
hT[threadId] = true;
setStoreValue('hiddenThreads', hT);
updateHiddenThreads();
}

window.showAllThreads = function() {
setStoreValue('hiddenThreads', {});
updateHiddenThreads();
}

// Catalog

function makeThreadCatalogControls(threadId) {
let div = document.createElement('div');
div.innerHTML =
"<button style='font-size: 10px;' class='hidde-thread-button' onclick='hideThread("+ threadId +")'>"
+ "Esconder" +
"</button>";

return div;
}

function makeGeneralCatalogControls() {
if (!$('#show-all-threads')[0]) {
$('header').append(
"<button id='show-all-threads' onclick='showAllThreads()'>" +
"Mostrar todas as threads." +
"</button>"
);
}
}

function updateHiddenThreads() {
let oldLockedState = locked;
locked = true;
let hiddenThreads = getStoreValue('hiddenThreads');

$('[data-id]').each(function(index, el) {
let id = el.getAttribute('data-id');
if (hiddenThreads[id]) {
el.style.display = 'none';
} else {
el.style.display = 'inline-block';
}
});

locked = oldLockedState;
}

function setupCatalogUI() {
$('[data-id]').each(function(index, el) {
el.prepend(makeThreadCatalogControls(el.getAttribute('data-id')));
});
makeGeneralCatalogControls();
}

function setupCatalogListeners() {
$('.threads').bind('DOMSubtreeModified', function() {
if (!locked) {
locked = true;
setTimeout(bootstrap, 1000);
}
});
}

function setupUI() {
if (/.\/res\/[0-9]+\.html/.test(location.pathname)) { // Thread
} else if (/catalog\.html$/.test(location.pathname)) { // Catalog
setupCatalogUI();
setupCatalogListeners();
updateHiddenThreads();
} else if (/\/[\w]+\//.test(location.pathname)) { // Pages
}
}

function setupStore() {
if (!getStoreValue('hiddenThreads')) {
setStoreValue('hiddenThreads', {});
}
}

function bootstrap() {
locked = true;
setupStore();
setupUI();
locked = false;
}

$(document).ready(bootstrap);