// ==UserScript==
// @name         Google搜索 ad翻页 tab键
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ad翻页，tab键聚焦输入框
// @author       Artana
// @license MIT
// @include      https://www.google.com/search?q=*
// @include      https://www.google.com.hk/search?q=*
// @include      https://www.google.com/search?newwindow=*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464979/Google%E6%90%9C%E7%B4%A2%20ad%E7%BF%BB%E9%A1%B5%20tab%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/464979/Google%E6%90%9C%E7%B4%A2%20ad%E7%BF%BB%E9%A1%B5%20tab%E9%94%AE.meta.js
// ==/UserScript==


/*=================================上下翻页键=========================================*/
window.addEventListener('keydown', function(e) {
    if((e.target == document.body)|| isURL(e.target)) {
        if(e.keyCode == 65) {
            document.querySelector('#pnprev > span.SJajHc.NVbCr').click();
        }
        else if(e.keyCode == 68) {
            document.querySelector('#pnnext > span.SJajHc.NVbCr').click();
        }
    }

    //tab键如果没聚焦就聚焦，聚焦了就不聚焦
    if(e.keyCode == 9){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        var elem = document.querySelector('#tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb >* textarea');
        if(!(elem)){
            elem = document.querySelector('#tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb >* input');
            console.log(elem)
        }


        if(elem){
            if (elem === document.activeElement) {
                elem.blur();    //element has focus
            } else {
                setTimeout(function() {
                    elem.focus();
                    moveCursorToEnd(elem);
                }, 10);     //不写这个timer会莫名有删文字的情况 按的快的时候

            }
        }
        else   //谷歌搜图页面
        {
            const elem = document.querySelector('#sf > div.jOYx5b > div.o6juZc > div > div.dGWkFc> input');
            if(elem){
                if (elem === document.activeElement) {
                    elem.blur();    //element has focus
                } else {
                    setTimeout(function() {
                        elem.focus();
                        moveCursorToEnd(elem);
                    }, 0);     //不写这个timer会莫名有删文字的情况 按的快的时候

                }
            }
        }
    }

    //清空键 ^o   给BTT的双击TAB用
    if(e.ctrlKey && e.keyCode == 79){
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const elem = document.querySelector('#tsf > div:nth-child(1) > div.A8SBwf > div.RNNXgb >* input');
        if(elem){
            setTimeout(function() {
                elem.focus();   //element not focus
                elem.select();
            }, 100);  //等100秒以至于不会双击时单击做的movetoend()跟双击的select()冲突
        }
        else   //谷歌搜图页面
        {
            const elem = document.querySelector('#sf > div.jOYx5b > div.o6juZc > div > div.dGWkFc> input');
            if(elem){
                setTimeout(function() {
                    elem.focus();   //element not focus
                    elem.select();
                }, 100);  //等100秒以至于不会双击时单击做的movetoend()跟双击的select()冲突
            }
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



