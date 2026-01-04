// ==UserScript==
// @name         Edookit aritmeticky prumer znamek
// @namespace    https://github.com/TheRealOXY
// @version      1.0
// @description  lol
// @author       trouba
// @match        https://zsostrov.edookit.net/evaluation/
// @icon         https://i.redd.it/dadz528j53981.jpg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457492/Edookit%20aritmeticky%20prumer%20znamek.user.js
// @updateURL https://update.greasyfork.org/scripts/457492/Edookit%20aritmeticky%20prumer%20znamek.meta.js
// ==/UserScript==


const l = Array.from({length: document.getElementsByClassName("spacy-grid")[0].childElementCount}, (_, i) => i + 1);
const s = '/html/body/div[3]/div/div[4]/div/div/div/div/section/div[2]/div[1]/div[x]/ul/li[2]/table/tbody/tr[1]/td/div/span';
var a = [];

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function Prumer(){
    for (var n = 0; n < l.length; n++) {
        a.push(parseFloat((getElementByXpath(s.replace('x', l[n])).textContent).replace(',', '.')));
    }
    return Math.round(a.reduce((a, b) => a + b, 0) / l.length * 100) / 100;
}

document.getElementById("header").innerHTML += '<h2 id="xd">Aritmetický průměr všech známek: <b>' + Prumer() + '<b></h2>'; document.getElementById("xd").style.fontWeight = 'normal'; document.getElementById("xd").style.color = '#34495E'; document.getElementById("xd").style.fontSize = '23.2px';