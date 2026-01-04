// ==UserScript==
// @name         TAB键聚焦搜索框 for youtube
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tab键聚焦搜索框
// @author       artlan a
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469347/TAB%E9%94%AE%E8%81%9A%E7%84%A6%E6%90%9C%E7%B4%A2%E6%A1%86%20for%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/469347/TAB%E9%94%AE%E8%81%9A%E7%84%A6%E6%90%9C%E7%B4%A2%E6%A1%86%20for%20youtube.meta.js
// ==/UserScript==



window.addEventListener('keydown', function(e) {

    //tab键如果没聚焦就聚焦，聚焦了就不聚焦
    if(e.keyCode == 9){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const elem = document.querySelector('input#search');
        if(elem){
            if (elem === document.activeElement) {
                elem.blur();    //element has focus
            } else {
                setTimeout(function() {
                    elem.focus();
                    moveCursorToEnd(elem);
                }, 30);
            }
        }
    }
    else if(e.ctrlKey && e.keyCode == 79){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const elem = document.querySelector('input#search');
        if(elem){
            setTimeout(function() {
                elem.focus();   //element not focus
                elem.select();
            }, 100);  //等100秒以至于不会双击时单击做的movetoend()跟双击的select()冲突
        }
    }

});

function isURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
                               '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
                               '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                               '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                               '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                               '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

function moveCursorToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}



