// ==UserScript==
// @name            collectGC-Codes
// @author          Confectrician
// @namespace       https://github.com/Confectrician/collect_gc_codes/
// @description     Collect GC-Codes from Searchresult Pages
// @include         http://www.geocaching.com/seek/nearest.aspx*
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           unsafeWindow
// @version         2.01
// @downloadURL https://update.greasyfork.org/scripts/5441/collectGC-Codes.user.js
// @updateURL https://update.greasyfork.org/scripts/5441/collectGC-Codes.meta.js
// ==/UserScript==


var stored;
var gccodes = new Array();
var codehash = new Array();

function clearCollection() {
  GM_setValue("gccodeshashed","");
  alert("GC-Codes cleared");
}

// main()

GM_registerMenuCommand( "GC-Codes clear", clearCollection );

try {
    stored = GM_getValue("gccodeshashed");
    gccodes = stored.split('|');
//  alert(gccodes.length);
    for(var i=0 ; i < gccodes.length ; i++)
    {
        codehash[gccodes[i]]=i;
    }
}
catch (err){
}

try
{
    var b=document.getElementsByTagName("table")[1].getElementsByTagName("tr");
    var anzahl=b.length;
    for(var i=1 ; i < anzahl ; i++)
    {
        var spans = b[i].getElementsByTagName("span");
        var gc=spans[3].innerHTML.split('|')[1].trim();
//      alert(gc);
        codehash[gc]=0;
    }

    stored="";
    var i=0;
    for (var st in codehash) {
     if(i++)
         stored = stored + '|';
     stored = stored + st;
  } 
    GM_setValue("gccodeshashed",stored);
    var Element=document.getElementById('ctl00_divContentSide');
//  Element.innerHTML=Element.innerHTML+'<p>'+stored.replace(/\|/gi,"<br />")+'</p>';
    Element.innerHTML=Element.innerHTML+"<textarea id=\"gm_tb_ta\" cols=\'40\' rows=\'30\'>" +stored.replace(/\|/gi,";")+ '</textarea></div>';
}
catch (err){
}
