// ==UserScript==
// @name         John Taylor 1 
// @namespace    http://your.homepage/
// @version      1
// @description  John Taylor - Determine whether a company is a digital marketing agency or not
// @author       saqfish
// @include        https://www.mturkcontent.com/dynamic/hit?*
// @grant        none
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/14158/John%20Taylor%201.user.js
// @updateURL https://update.greasyfork.org/scripts/14158/John%20Taylor%201.meta.js
// ==/UserScript==


$('div.panel-body').hide();

$('div.panel-heading').click(function() {
    
    if($('div.panel-body').is(":visible")){
        $('div.panel-body').hide();
       
    }else{
        $('div.panel-body').show();
        
    }
});
var monkies = [];

$('input[name="Agency?"]').each(function(h){
    monkies.push($(this));
});
window.onkeydown = function(e) {

      
        if ((e.keyCode === 49) || (e.keyCode === 97) || (e.altKey && e.keyCode === 97)) {
           monkies[0].prop('checked',true);
            
        }

        
        if ((e.keyCode === 50) || (e.keyCode === 98) || (e.altKey && e.keyCode === 98)) {
         monkies[1].prop('checked',true);
           
        }
}
