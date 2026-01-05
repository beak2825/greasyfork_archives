// ==UserScript==
// @name        BHIN-FINALSTEP
// @namespace   autoklikbhinneka
// @include     https://www.bhinneka.com/mobile/aspx/set_confirmation_shipping.aspx
// @version     1.0.2
// @grant       none
// @description ga ono
// @downloadURL https://update.greasyfork.org/scripts/10508/BHIN-FINALSTEP.user.js
// @updateURL https://update.greasyfork.org/scripts/10508/BHIN-FINALSTEP.meta.js
// ==/UserScript==

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
  // Note, jQ replaces $ to avoid conflicts.
  //alert("There are " + jQ('a').length + " links on this page.");
    
    if (jQ("#ctl00_cphContent_lblStep5SubTotalBelanja").html()== "100,000"||jQ("#ctl00_cphContent_lblStep5SubTotalBelanja").html()== "10,000"){
        jQ("#ctl00_cphContent_btnNext").click();        
    }
    else{
        //jQ("#ctl00_cphContent_btnPrevious").click();
                setTimeout(function(){
    window.open(window.location,"_self");
},1250);
        
        
    }
}

// load jQuery and execute the main function
addJQuery(main);

