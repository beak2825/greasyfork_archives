// ==UserScript==
// @name Testing survey - Skip (SSI6)
// @description Переход к следующей странице
// @namespace http://www.maronline.ru
// @require http://code.jquery.com/jquery-1.9.0.min.js
// @include *.maronline.ru/*
// @exclude *admin.pl
// @exclude *admn.htm
// @version 0.0.2
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/425679/Testing%20survey%20-%20Skip%20%28SSI6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/425679/Testing%20survey%20-%20Skip%20%28SSI6%29.meta.js
// ==/UserScript==
/*jshint multistr: true */

    var btn = document.createElement('input');
    btn.type = 'button';
    btn.className = 'mar-testing';
    btn.value = "Skip";
    $('body').append(btn);

    $(btn).on('click', function(){
        unsafeWindow.SSI_subVerify = function(){return true;}
        SSI_subSubmitMe();
    });

    var head = document.querySelector('head');
    if (head) {
        var style = document.createElement("style");
        style.appendChild(document.createTextNode(
            ".mar-testing{\
position: fixed;\
right:10px;\
top:45%!important;\
cursor: pointer;\
padding: 0.2em 0.4em;\
margin: 0 0.2em;\
font-size: 14px;\
border-radius: 3px;\
font-family: inherit;\
border: 1px solid transparent;\
color: #fff !important;\
background: #ff646d !important;\
border-color: #ff646d !important;\
box-shadow: 0px 0px 0px 0px !important;\
}"
        ));
        head.appendChild(style);
    }
