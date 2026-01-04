// ==UserScript==
// @name Testing survey - Skip (SSI8)
// @description Переход к следующей странице
// @namespace https://marsurvey.ru/
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @include *marsurvey.ru/*
// @exclude *admin.pl
// @exclude *admin.htm
// @version 0.0.3
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/425681/Testing%20survey%20-%20Skip%20%28SSI8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/425681/Testing%20survey%20-%20Skip%20%28SSI8%29.meta.js
// ==/UserScript==
/*jshint multistr: true */
$(document).ready(function(){
    var btn = document.createElement('input');
    btn.type = 'button';
    btn.className = 'mar-testing';
    btn.value = "Skip";
    $('body').append(btn);

    $(btn).on('click', function(){
        unsafeWindow.SSI_Verify = function(){return true;}
        $("select:visible").val(1)
        $("[type=checkbox]").prop("checked", true)
        $("[type=radio]").prop("checked", true)
        $("[type=text], textarea").val("--")
        $("[type=tel]").val(1)
        SSI_SubmitMe();
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
font-size: 1.2rem;\
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
})