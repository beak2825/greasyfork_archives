// ==UserScript==
// @name        Esc sulkee kaikki popup divit yms - Adminet
// @namespace   Violentmonkey Scripts
// @match       https://adminet.admicom.fi/*
// @grant       none
// @version     1.0
// @author      -
// @description 21.2.2020 klo 19.33.01
// @downloadURL https://update.greasyfork.org/scripts/415610/Esc%20sulkee%20kaikki%20popup%20divit%20yms%20-%20Adminet.user.js
// @updateURL https://update.greasyfork.org/scripts/415610/Esc%20sulkee%20kaikki%20popup%20divit%20yms%20-%20Adminet.meta.js
// ==/UserScript==

window.addEventListener('keyup', ev => {
  if (ev.keyCode === 27) {
    
    // Puukotettu toiminto sulkee akikki popupit
    
    // Class=popup div + bgdiv boxit
    var bgid = $(".popup").attr('id')+'bg';
    $("#"+bgid).remove();
    $(".popup").remove();
    
    // Prompt boxit
    closePromptDivs();
                 
    // Tooltip boxit
    $("[id^=tooltip]").each(function(index, element){ 
      var tooltipid = $( this ).attr('id');
      if (!tooltipid.includes("txtdiv"))
        $( this ).hide();
      });
      
/*
 * Kopioitu Adminetistä

closePromptDivs();
//closePopDivs("purch_shro");



function closePopDivs(pre)
{
	if(!pre)
		pre = 'pop_';
	var d = eById(pre+'div');
	d.parentNode.removeChild(d);
	var bg = eById(pre+'divbg');
	if(bg)
		bg.parentNode.removeChild(bg);
}

*/
  }
                 
})