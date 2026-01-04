// ==UserScript==
// @name         Vius Jumper
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Skip https://vius.info/ page
// @author       john_dow
// @match        https://vius.info/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387045/Vius%20Jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/387045/Vius%20Jumper.meta.js
// ==/UserScript==

function jumperHumanVerification()
{
    var txt = "Submit";
    var inputs = document.getElementsByTagName('input');

    for(var i = 0; i < inputs.length; i++)
    {
        if(inputs[i].value == txt)
        {
            inputs[i].form.submit();
        }
    }
}

function jumperAdvertisement()
{
    var txtLink = 'goto/?site='
    var hrefs = document.getElementsByTagName('a')
    var newLink = ""

    for (var i = 0; i < hrefs.length; i++)
    {
        if (hrefs[i].href.includes (txtLink))
        {
            newLink = hrefs[i].href ;
            break;
        }
    }
    window.open(newLink , '_self');
}

var amHuman = document.getElementsByClassName('humancheck').length;

if (amHuman == 1)
{
    jumperHumanVerification();
}

if (amHuman == 0) //advertisement
{
    jumperAdvertisement();
}

