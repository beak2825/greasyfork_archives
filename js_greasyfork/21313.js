// ==UserScript==
// @name       Show wage on HIT submit (Gershom Fix) Supreme Accuracy
// @namespace  
// @version    0.21
// @description  Wage is based on the hit counter on the page which is more accurate to because it includes how long it took to load the page as well.
// @include    https://www.mturk.com/mturk/accept*
// @include    https://www.mturk.com/mturk/submit*
// @include    https://www.mturk.com/mturk/continue*
// @include    https://www.mturk.com/mturk/previewandaccept*
// @copyright  2016+, Eric Fraze
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/21313/Show%20wage%20on%20HIT%20submit%20%28Gershom%20Fix%29%20Supreme%20Accuracy.user.js
// @updateURL https://update.greasyfork.org/scripts/21313/Show%20wage%20on%20HIT%20submit%20%28Gershom%20Fix%29%20Supreme%20Accuracy.meta.js
// ==/UserScript==

var startTime;

$(document).ready(function() {
    startTime = new Date();
});

window.addEventListener("beforeunload", function(event){
  
   var timesplit = $("#theTime").text().split(':');
   var seconds = ((parseInt(timesplit[0])*3600)+(parseInt(timesplit[1])*60)+(parseInt(timesplit[2])+0));
   var reward = $(".capsule_field_text .reward").text().replace("$", "");
   var wage = parseFloat(reward)*3600/(seconds);

   $("body").append("<div id='wage-wrapper'><div id='wage'>" + '$' + wage.toFixed(2)+ "/h</div></div>");
   
   $("#wage-wrapper").css('position','fixed');
   $("#wage-wrapper").css('width','100%');
   $("#wage-wrapper").css('height','100%');
   $("#wage-wrapper").css('top','0');
   $("#wage-wrapper").css('left','0');
   $("#wage-wrapper").css('background-color','rgba(0,0,0,0.8)');
   
   $("#wage").css('position','absolute');
   $("#wage").css('top','50%');
   $("#wage").css('font-size','50px');
   $("#wage").css('color','white');
   $("#wage").css('width','100%');
   $("#wage").css('text-align','center');
});;