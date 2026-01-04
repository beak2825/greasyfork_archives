// ==UserScript==
// @name         dandanzan.continuer
// @namespace    http://4ca.st/dandanzan.continuer
// @version      1.2.2
// @description  dandanzan player continuer
// @author       4cast
// @match        https://www.dandanzan.cc/dianshiju/*.html
// @match        https://www.dandanzan.cc/dianying/*.html
// @match        https://www.dandanzan.cc/zongyi/*.html
// @match        https://www.dandanzan.cc/dongman/*.html
// @icon         https://www.google.com/s2/favicons?domain=dandanzan.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426872/dandanzancontinuer.user.js
// @updateURL https://update.greasyfork.org/scripts/426872/dandanzancontinuer.meta.js
// ==/UserScript==

window.stoKey=0;
$(function() {
    let segs=window.location.href.split('/');
    window.stoKey=segs[segs.length-1];

    var curIndex=getLastPlayIndex(window.stoKey);
    if(curIndex>-1){
        let curbtn=$('#slider li:eq(' + curIndex + ')').find('a');
        if(confirm('上次已看到[' + curbtn.text() + ']是否继续?')){
            curbtn.click();
        }
    }

    $('#video').on('ended',function(e){
        $('#slider li.on').next('li').find('a').click();
    }).on('play',function(e){
        setLastPlayIndex(window.stoKey);
    });
});

function setLastPlayIndex(key){
    let ret=-1;
    if(window.localStorage){
        $.each($('#slider li'),function(i,n){
            if($(n).hasClass('on')){
                ret=i;
                return false;
            }
        });
        window.localStorage.setItem(key,ret);
    }
    return ret;
}

function getLastPlayIndex(key){
    let ret=-1;
    if(window.localStorage){
        if(window.localStorage.getItem(key)){
            ret= window.localStorage.getItem(key);
        }else{
            ret= -1;
        }
    }
    return ret;
}