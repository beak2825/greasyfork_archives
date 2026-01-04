// ==UserScript==
// @name         Confile jumper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Confile net jumper
// @author       john_dow
// @match        https://confile.net/blog/*
// @match        https://confile.net/drive/d/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/387110/Confile%20jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/387110/Confile%20jumper.meta.js
// ==/UserScript==


var siteCheck = 'https://confile.net/blog/';
var downSite = 'https://confile.net/drive/d';
var siteAll = window.location.href;
var kk=document.getElementsByClassName('dlgo bg-dblue');

function isInHumanVerification()
{
    var inText = "VERIFICATION";
    if (kk[0].innerText.includes(inText)) { return true;}
    else {return false;}
}

function myClick() {
  setTimeout
  (
    function()
      {
          var dd=document.getElementsByClassName('dlgo bg-dblue');
          window.location = dd[0].href;
      }, 7000
  );
}

if (siteAll.includes(siteCheck))
{
    try
    {
        if (isInHumanVerification)
        {
            kk[0].click();
        }
    }
    catch(err)
    {
        window.onloadeddata = myClick()
    }
}

if (siteAll.includes(downSite))
{
    var btnClass = document.getElementsByClassName('btn bg-dblue')
    btnClass[0].click();
}





