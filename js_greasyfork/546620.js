// ==UserScript==
// @name         RTT Highlight Search Location
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Highlights searched location in a service detail page
// @author       Mark Sreeves
// @match        https://www.realtimetrains.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=realtimetrains.co.uk
// @grant		GM_getValue
// @grant		GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/546620/RTT%20Highlight%20Search%20Location.user.js
// @updateURL https://update.greasyfork.org/scripts/546620/RTT%20Highlight%20Search%20Location.meta.js
// ==/UserScript==

var url=document.URL;
if(url.indexOf('search')!== -1)
{
    storeLocation()
}
if(url.indexOf('service')!== -1)
{
    highlightRow()
}



function highlightRow()
{try{

    var loc= GM_getValue('loc','XXXXXX')
    var row=document.getElementsByClassName('location')
    if(row.length>0){
        for(var i=0;i<row.length;i++)
        {
            if(row[i].innerHTML.indexOf('gb-nr:' + loc)>=0)
            {
                row[i].style.backgroundColor = "yellow";
            }
        }
    }

 }
  catch(err) {
  alert(err.message + '  highlightRow()');
 }
}

function storeLocation()
{
        const match = url.match(/gb-nr:([^/?]+)/);
        var loc= match ? match[1] :null;

        GM_setValue('loc',loc)
}


