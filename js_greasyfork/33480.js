// ==UserScript==
// @name         EtStats Dark Theme
// @namespace    http://etstats.com/debug.html
// @version      0.3
// @description  Dark theme for EtStats
// @author       Aes Sedai
// @match        http://etstats.com/debug.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33480/EtStats%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/33480/EtStats%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lastFloor = '0';
    var pre = document.getElementsByTagName('pre')[0];
    var blocks = pre.innerText.split('\n\n');
    pre.remove();
    var pqTitle = document.createElement('p');
    pqTitle.innerHTML = 'PQ Levels';
    document.body.appendChild(pqTitle);
    var pqHolder = document.createElement('div');
    pqHolder.className = 'pq-holder';
    document.body.appendChild(pqHolder);
    var towerTitle = document.createElement('p');
    towerTitle.innerHTML = 'Tower Levels';
    document.body.appendChild(towerTitle);
    var towerHolder = document.createElement('div');
    towerHolder.className = 'tower-holder';
    document.body.appendChild(towerHolder);
    var towerLevel = document.createElement('div');
    towerLevel.className = 'tower-level';
    towerHolder.appendChild(towerLevel);
    blocks.map(function(txt) {
        var p = document.createElement('pre');
        p.innerHTML = txt;
        if(txt.includes('Level')) {
            pqHolder.appendChild(p);
        } else if(txt.includes('Tower')) {
            console.log(txt + ' includes? Tower F' + lastFloor + ' : ' + txt.includes('Tower F'+lastFloor));
            if(!txt.includes('Tower F'+lastFloor)) {
                lastFloor = (parseInt(lastFloor) + 1).toString();
                towerLevel = document.createElement('div');
                towerLevel.className = 'tower-level';
                towerHolder.appendChild(towerLevel);
            }
            towerLevel.appendChild(p);
        }
        return p;
    });
})();

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('body { display: flex; flex: 1 1 auto; flex-direction: column; font-family: monospace; background-color: #303030; color: #efefef}');
addGlobalStyle('.pq-holder {display: flex; flex: 1 1 auto; flex-direction: row; flex-wrap: wrap;}');
addGlobalStyle('.tower-holder {display: flex; flex: 1 1 auto; flex-direction: column; flex-wrap: wrap;}');
addGlobalStyle('.tower-level {display: flex; flex: 0 1 auto; flex-direction: row; flex-wrap: nowrap; min-width: 0;}');
addGlobalStyle('pre {padding-left: 8px; padding-right: 8px; overflow: hidden; text-overflow: ellipsis;}');