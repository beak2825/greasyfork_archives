// ==UserScript==
// @name superfish
// @namespace whatever
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @include https://www.mturkcontent.com/dynamic*
// @description Assists with Superfish hits on Amazon Mechanical Turk
// @version 1.3
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/2861/superfish.user.js
// @updateURL https://update.greasyfork.org/scripts/2861/superfish.meta.js
// ==/UserScript==

$('img').each(function(){
    $(this).click(function(){
        $(this).next().next().click();
    });
}); 

if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
    this.GM_getValue=function (key,def) {
        return localStorage[key] || def;
        };
    this.GM_setValue=function (key,value) {
        return localStorage[key]=value;
        };
    this.GM_deleteValue = function(key) {
        return localStorage.removeItem(key);
    };
}

if (GM_getValue("superfish")){
    $('input').each(function(){
        if ($(this).attr("type") == "checkbox" && $(this).attr("id") != "assignmentId" && $(this).attr("value") != "none" && $(this).attr("id") != "submitButton")
            $(this).click();
    });
}

document.onkeydown = showkeycode;
function showkeycode(evt){
    var keycode = evt.keyCode;
    switch (keycode) {
        case 13: //enter
            document.getElementById("mturk_form").submit();
            break;
        case 192: //`
            $('input').each(function(){
                if ($(this).attr("type") == "checkbox" && $(this).attr("id") != "assignmentId" && $(this).attr("value") != "none" && $(this).attr("id") != "submitButton")
                    $(this).click();
            });
            if (GM_getValue("superfish"))
                GM_deleteValue("superfish");
            else
            	GM_setValue("superfish",1);
            break;
    }}