// ==UserScript==
// @name        Hybrid - Check search keywords v2
// @version     1.5
// @author      jawz
// @description Do something
// @match      https://www.gethybrid.io/workers/tasks/*
// @match      https://translate.google.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/23932/Hybrid%20-%20Check%20search%20keywords%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/23932/Hybrid%20-%20Check%20search%20keywords%20v2.meta.js
// ==/UserScript==

if ($('li:contains("Check search keywords")').length) {
    var div = $('div[class^="item-response order-"]');
    var srch = [];
    var current;
    $.each(div,function(index,elem){
        srch[index] = div.eq(index).find('p').eq(0).text();
        var url = 'https://translate.google.com/#auto/en/' + srch[index].slice(3, srch[index].length);
        div.eq(index).find('p').eq(0).html('<a href="'+url+'"><b>'+srch[index]+'</b></a>');
    });
    srch.splice(0, 1);
    srch.splice(20, 1);
    
    radioArray = $('span[class="radio"]');
    
    var count = 1;
    for (i=2;i<22;i++) {
        buildTbl(count+0, count+1, count+2, count+3, i);
        count = count+4;
    }
    count = 1;
    $.each(radioArray,function(index,elem){
        if (elem !== ''){
            $('#'+count+'').append(elem);
            count++;
        }
    });
    
    var url = $('div[class="item-response order-1"]').find('a').eq(2).attr('href');
    if (url.indexOf('google') > -1)
        url = url.replace(/&/g, '%26').replace(/'/g, '%27');
    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
    popupZ = window.open(url, 'remote2', 'height=' + 1 + ',width=' + 1 + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
    GM_setValue('listen',true);
    
    setClick()        
        
    $('div[class^="item-response order-"]').css({
        "marginTop": "0",
        "marginRight": "auto",
        "marginBottom": "0",
        "marginLeft": "auto"
    });
    
    window.addEventListener("message", function(e) { listener(e) ;}, false);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Submit';
    btn.type = "button";
    btn.onclick = function() { $('input[name="commit"]').click(); }
    $('div[class="item-response order-1"]').find('p').eq(3).append('<br>');
    $('div[class="item-response order-1"]').find('p').eq(3).append(btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Skip';
    btn.type = "button";
    btn.onclick = function() { $('input[name="skip"]').click(); }
    $('div[class="item-response order-1"]').find('p').eq(3).append(btn);
}

if (document.URL.indexOf("translate.google.com") >= 0) {
    setInterval(function(){ waiting(); }, 500);
}

function waiting() {
    if (GM_getValue('listen') === true && $('#source').val().length < 200) {
        setTimeout(function(){sendMessage($('#result_box').text()); GM_setValue('listen', false); }, 250);
    } else if (GM_getValue('listen') === true && $('#source').val().length > 200){
        setTimeout(function(){sendMessage($('#result_box').html().substring($('#result_box').html().indexOf('>') + 1).replace(/<span>/g, '').replace(/<span title=/g, '').replace(/<\/span>/g, '').split('<br>')); GM_setValue('listen', false); }, 250);
    }
}

function sendMessage(msg) {
    window.opener.postMessage(msg, '*');
}

function listener(e) {
    var trans = e.data;
    if (trans.constructor === Array) {
        for (i=1;i<21;i++) {
            srch[i] = trans[i-1];
            var url = 'https://translate.google.com/#auto/en/' + srch[i];
            div.eq(i).find('p').eq(0).html('<a href="'+url+'"><b>'+srch[i]+'</b></a>');
        }
        setClick();
    } else
        current.html('<b>' + e.data + '</b>');
}

function buildTbl(id1, id2, id3, id4, div) {
    tbl  = document.createElement('table');
    $('div[class="item-response order-'+div+'').append(tbl);
    for(var i = 0; i < 1; i++) {
        var tr = tbl.insertRow();
        for(var j = 0; j < 4; j++) {
            var td = tr.insertCell();
            td.appendChild(document.createTextNode(''));
            if (j==0) {
                td.id = id1;
                td.style.width = '25%';
            } else if (j==1){
                td.id = id2;
                td.style.width = '35%';
            } else if (j==2){
                td.id = id3;
                td.style.width = '15%';
            } else if (j==3){
                td.id = id4;
                td.style.width = '25%';
            }
        }
    }
}

function buildTbl2(id1, id2, id3, id4, div) {
    tbl  = document.createElement('table');
    $('div[class="item-response order-'+div+'').append(tbl);
    for(var i = 0; i < 2; i++) {
        var tr = tbl.insertRow();
        for(var j = 0; j < 2; j++) {
            var td = tr.insertCell();
            td.appendChild(document.createTextNode(''));
            td.style.width = '50%';
            if (i==0 && j==0)
                td.id = id1;
            else if (i==0 && j==1){
                td.id = id2;
            } else if (i==1 && j==0){
                td.id = id3;
            } else if (i==1 && j==1){
                td.id = id4;
            }
        }
    }
}

function setClick() {
    $('a').click( function() { 
        if (this.href.indexOf('gethybrid') < 0 && this.href.length < 300) {
            var url = this.href;
            if (url.indexOf('google') > -1)
                url = url.replace(/&/g, '%26').replace(/'/g, '%27');
            var wleft = window.screenX;
            var halfScreen = window.outerWidth;
            var windowHeight = window.outerHeight;
            var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
            popupZ = window.open(url, 'remote2', 'height=' + 1 + ',width=' + 1 + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
            GM_setValue('listen',true);
            current = $(this);
            return false;
        }
    });
}