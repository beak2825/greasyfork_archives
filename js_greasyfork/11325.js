// ==UserScript==
// @name       jawz OCMP14
// @version    1.0
// @description  enter something useful
// @match      
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant      GM_setValue
// @grant      GM_getValue
// @grant      GM_deleteValue
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/11325/jawz%20OCMP14.user.js
// @updateURL https://update.greasyfork.org/scripts/11325/jawz%20OCMP14.meta.js
// ==/UserScript==

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    text = text.replace(/(?:\r\n|\r|\n)/g, ' ').trim();
    return text;
}

document.onkeypress=function(e){
    if (e.keyCode == 49) //1
        GM_setValue('one', getSelectionText());
    else if (e.keyCode == 50) 
        GM_setValue('two', getSelectionText());
    else if (e.keyCode == 51) 
        GM_setValue('three', getSelectionText());
    else if (e.keyCode == 52) 
        GM_setValue('four', getSelectionText());
    else if (e.keyCode == 53) 
        GM_setValue('five', getSelectionText());
    else if (e.keyCode == 54) 
        GM_setValue('six', getSelectionText());
    else if (e.keyCode == 55) 
        GM_setValue('seven', window.location.href);
    else if (e.keyCode == 56) 
        GM_setValue('eight', getSelectionText());
    else if (e.keyCode == 57) //9
        GM_setValue('nine', getSelectionText());
    else if (e.keyCode == 48) //0
        GM_setValue('ten', getSelectionText());
};

if (document.getElementsByClassName("cc-input addrline  address_2nd_pass required  answerInput ").length) {
    var timer = setInterval(function(){ listenFor(); }, 250);
    
    
    var url = $('a').eq(4).html();
    url = url.replace('<br>', '');
    if (url.indexOf('http') < 0) {
        url = $('a').eq(5).html();
        url = "http://www.google.com/search?q=" + url;
        url = url.replace(/[" "]/g, "+").replace("&amp;", "%26")
    }
    
    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
    
    popupX = window.open(url,'remote1','height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
    window.onbeforeunload = function (e) { popupX.close(); }
} else if (document.getElementsByClassName("cc-input text  complete_url main_url_found required answerInput ").length) {
    var url = $('a').eq(5).html();
    url = "http://www.google.com/search?q=" + url;
    url = url.replace(/[" "]/g, "+").replace("&amp;", "%26");

    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
    
    popupX = window.open(url,'remote1','height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
    window.onbeforeunload = function (e) { popupX.close(); }
}else {
    $('a[href*="@"]').each(function() {
        $(this).html($(this).attr('href').replace('mailto:',''));
        $(this).removeAttr('href');
    });
}

function listenFor() {
    if (GM_getValue('one')) {
        console.log(GM_getValue('one'));
        //document.getElementById('employees_company').value = GM_getValue('one')
        //$( "input[name='sub-topic-other']" ).val(GM_getValue('one'))
        $('input[class="cc-input addrline  address_2nd_pass required  answerInput "]').val(GM_getValue('one'));
        GM_deleteValue('one');
    }
    if (GM_getValue('two')) {
        $('input[class="cc-input city  address_2nd_pass required  answerInput "]').val(GM_getValue('two'));
        GM_deleteValue('two');
    }
    if (GM_getValue('three')) {
        $('input[class="cc-input state  address_2nd_pass required  answerInput "]').val(GM_getValue('three'));
        GM_deleteValue('three');
    }
    if (GM_getValue('four')) {
        $('input[class="cc-input zip  address_2nd_pass required  answerInput"]').val(GM_getValue('four'));
        GM_deleteValue('four');
    }
    if (GM_getValue('five')) {
        $('input[class="cc-input phone text phone org_phone required answerInput"]').val(GM_getValue('five'));
        $('a[onclick="toggleUSPhone(this);return false;"]').click();
        GM_deleteValue('five');
    }
    if (GM_getValue('six')) {
        $('input[class="cc-input text    email org_email required answerInput "]').val(GM_getValue('six'));
        GM_deleteValue('six');
    }
    if (GM_getValue('seven')) {
        $('input[class="cc-input text  complete_url source_url required answerInput "]').val(GM_getValue('seven'));
        GM_deleteValue('seven');
    }
    if (GM_getValue('eight')) {
        //document.getElementById('employees_company').value = GM_getValue('eight')
        //$( "input[name='sub-topic-other']" ).val(GM_getValue('eight'))
        GM_deleteValue('eight');
    }
    if (GM_getValue('nine')) {
        //document.getElementById('employees_company').value = GM_getValue('nine')
        //$( "input[name='sub-topic-other']" ).val(GM_getValue('nine'))
        GM_deleteValue('nine');
    }
    if (GM_getValue('ten')) {
        //document.getElementById('employees_company').value = GM_getValue('ten')
        //$( "input[name='sub-topic-other']" ).val(GM_getValue('ten'))
        GM_deleteValue('ten');
    }
}