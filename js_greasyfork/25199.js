// ==UserScript==
// @name        Post count
// @namespace   HLN
// @description HL post count script
// @include     http://www.harrylatino.org/*
// @version     2
// @grant       none
// @Author      Nox
// @downloadURL https://update.greasyfork.org/scripts/25199/Post%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/25199/Post%20count.meta.js
// ==/UserScript==

function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        iPos = [],
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
            iPos.push(pos);
        } else break;
    }
    return iPos;
}

function foo(arr) {
    var a = [], b = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    return [a, b];
}

var Data = '<span itemprop="creator name" class="author vcard">';
var iDom = document.getElementById("content");
var Nicks = [];




iDom = iDom.innerHTML;

var Posiciones = occurrences(iDom, Data);

for (i = 0; i < Posiciones.length; i++) {
    var temp = "";
    var pos = 0;
    temp = iDom.substr(Posiciones[i], 300);
    pos = temp.indexOf('<span itemprop="name">');
    temp = temp.substr(pos+22,300);
    pos = temp.indexOf('<');
    temp = temp.substr(0, pos);
    Nicks.push(temp);
}

var Col = foo(Nicks);
var Salida = "";
for (i = 0; i< Col[0].length; i++){
  Salida += Col[0][i] + "  <span style='float:right;'>" + Col[1][i] + " Post.</span><br>";
}
navbar = document.getElementById('branding');
if (navbar) {
    newElement = document.createElement('div');
    newElement.innerHTML = '<div style="color:white; position:absolute; right: 0; margin-top:-150px;width: 200px;height: 200px; font-family:tahoma,helvetica,arial,sans-serif; padding:5px;">'+ Salida +'</div>';
    navbar.parentNode.insertBefore(newElement, navbar.nextSibling);
}