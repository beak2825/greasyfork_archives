// ==UserScript==
// @name         FGD
// @version      1.0
// @description  Direct google links with click or hover to copy urls displayed below results   
// @author       Cristo
// @include      *://www.google.*/*
// @grant        GM_setClipboard
// @copyright    2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/3378/FGD.user.js
// @updateURL https://update.greasyfork.org/scripts/3378/FGD.meta.js
// ==/UserScript==
//type can be hover or click. I'll add a button someday
var type = 'hover'



function gready() {
    var page = document.getElementById('ires');
    var linkPac = page.getElementsByClassName("rc");
    for (var g = 0; g < linkPac.length; g++) {
        console.log(linkPac[g].parentNode);
        if(!linkPac[g].parentNode.getElementsByClassName('metoodumb')[0]){//temp fix I hope
            var aTag = linkPac[g].getElementsByClassName('r')[0].firstChild;
            aTag.removeAttribute('onmousedown');
            var p = document.createElement('p');
            p.className = 'metoodumb';
            if(type == 'click'){
            p.style.cursor = 'pointer';
            p.title = 'Click to copy';
            p.addEventListener('click', function(i) {
                GM_setClipboard(i.target.innerHTML);
            }, false);
            } else if(type == 'hover'){
            p.addEventListener("mouseover", overit, false);
            }
            p.innerHTML = aTag.href;
            linkPac[g].parentNode.insertBefore(p, linkPac[g].nextSibling);
        }
    }
}
function overit(){
    var selection = window.getSelection();        
    var range = document.createRange();
    range.selectNodeContents(this);
    selection.removeAllRanges();
    selection.addRange(range);
}

document.addEventListener('DOMSubtreeModified', check, false);

function check(i) {
    if (i.target.tagName == 'DIV' && i.target.id == 'search' && i.target.innerHTML.length > 0) {
        gready();
    }
}
document.onload = gready();