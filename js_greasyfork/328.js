// ==UserScript==
// @name           NexusClashReadableInfusion
// @namespace      http://userscripts.org/users/125692
// @description    Makes infusion numbers readable
// @include        http://nexusclash.com/modules.php?name=Game*
// @include        http://www.nexusclash.com/modules.php?name=Game*
// @exclude        http://nexusclash.com/modules.php?name=Game&op=disconnect
// @exclude        http://www.nexusclash.com/modules.php?name=Game&op=disconnect
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/328/NexusClashReadableInfusion.user.js
// @updateURL https://update.greasyfork.org/scripts/328/NexusClashReadableInfusion.meta.js
// ==/UserScript==
// 1.0  --  altered infusion text to .75em as it was too small.
(function() {
//<div id="Map">
var mapdiv;
if ((document.getElementById('Map'))){
mapdiv=document.getElementById('Map');
var fonttags=mapdiv.getElementsByTagName('font');
var fonttagslength=fonttags.length;
for(i=0;i<fonttagslength;i++){
        if (fonttags[i].parentNode.tagName=="TD"){
            fonttags[i].parentNode.align='left';
            fonttags[i].parentNode.setAttribute('valign','top');
        }
        else if(fonttags[i].parentNode.tagName=="CENTER"){
            fonttags[i].parentNode.parentNode.setAttribute('align','left');
            fonttags[i].parentNode.parentNode.setAttribute('valign','top');
fonttags[i].parentNode.parentNode.innerHTML=fonttags[i].parentNode.parentNode.innerHTML.replace(/<center>/,"").replace(/<\/center>/,"");
        }
}

mapdiv.innerHTML=mapdiv.innerHTML.replace(/<font color="(#[ABCDEF0123456789]{6})">(\(\d+\))<\/font>/g,"<span style='background-color:white;vertical-align:text-top;font-size:.75em;font-weight:900;color:$1'>$2<\span>");

} 

//EOF
})();