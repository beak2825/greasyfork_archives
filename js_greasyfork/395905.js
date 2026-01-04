// ==UserScript==
// @name         GoodsugaGeneralLibrary
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A handy library to work with site automation
// @author       Goodsuga
// @match        https://www.tampermonkey.net/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395905/GoodsugaGeneralLibrary.user.js
// @updateURL https://update.greasyfork.org/scripts/395905/GoodsugaGeneralLibrary.meta.js
// ==/UserScript==


function TypeTextIntoInputField(querry, value)
{
    $(querry).focus().click();
    $(querry).val(value);
    $(querry).keydown();
    $(querry).keyup();
}

function ClickElement(querry)
{
    $(querry).click();
}

function SetStorage(item, value)
{
    window.localStorage.setItem(item, value);
}

function GetStorage(item)
{
    return window.localStorage.getItem(item);
}

function CompareStorage(item, compareToValue, isTypeImportant)
{
    if(isTypeImportant) {
        return window.localStorage.getItem(item) === compareToValue; }
    else {
        return window.localStorage.getItem(item) == compareToValue; }
}

function NavigateToUrl(url)
{
    window.location.href = url;
}

function ForceReloadPage()
{
    window.location.reload(true);
}





(function() {
    'use strict';

    // Your code here...
})();