// ==UserScript==
// @name           OLOAD
// @namespace      OLOAD
// @description    _
// @include        https://oload.fun/embed/*
// @include        https://oload.fun/f/*
// @include        https://oload.fun/*
// @version 0.0.1.20170811143150
// @downloadURL https://update.greasyfork.org/scripts/376051/OLOAD.user.js
// @updateURL https://update.greasyfork.org/scripts/376051/OLOAD.meta.js
// ==/UserScript==
var url = window.location.href;
if(url)
{
    var arrayOfStrings = url.split("/");
    if(arrayOfStrings[4])
    {
        var dossier = arrayOfStrings[4];
        if(arrayOfStrings[5])
        {
            var video = arrayOfStrings[5];
            top.location.href="https://openload.co/f/" + dossier + "/" + video;
        }
        else
        {
            top.location.href="https://openload.co/f/" + dossier;
        }
    }
    else
    {
        alert("error2");
    }
}
else
{
    alert("error1");
}
