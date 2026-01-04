// ==UserScript==
// @name         Phill Linked In
// @namespace    Tehapollo
// @version      1.2
// @description  Easier Copy
// @author       Tehapollo
// @include       *linkedin.com*
// @grant  GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/392914/Phill%20Linked%20In.user.js
// @updateURL https://update.greasyfork.org/scripts/392914/Phill%20Linked%20In.meta.js
// ==/UserScript==
(function() {
 var datalist = []
 var datalist2 = []
 var hide_bullshit = setInterval(function(){ bullshitgone(); }, 500);
 var autoexpan = setInterval(function(){ autoexpander(); }, 500);


function autoexpander(){
  $('button.pv-profile-section__see-more-inline.pv-profile-section__text-truncate-toggle.link.link-without-hover-state').click();
    }






function bullshitgone(){
       while (document.getElementsByClassName('pv-highlights-section pv-profile-section artdeco-container-card ember-view')[0]) {
        document.getElementsByClassName('pv-highlights-section pv-profile-section artdeco-container-card ember-view')[0].remove();
    }
  while (document.getElementsByClassName('artdeco-container-card pv-profile-section pv-about-section ember-view')[0]) {
        document.getElementsByClassName('artdeco-container-card pv-profile-section pv-about-section ember-view')[0].remove();
    }
  while (document.getElementsByClassName('pv-profile-section pv-recent-activity-section-v2 artdeco-container-card ember-view')[0]) {
        document.getElementsByClassName('pv-profile-section pv-recent-activity-section-v2 artdeco-container-card ember-view')[0].remove();
    }
  while (document.getElementsByClassName('pv-profile-section pv-skill-categories-section artdeco-container-card ember-view')[0]) {
        document.getElementsByClassName('pv-profile-section pv-skill-categories-section artdeco-container-card ember-view')[0].remove();
    }
   while (document.getElementsByClassName('pv-profile-section pv-accomplishments-section artdeco-container-card ember-view')[0]) {
        document.getElementsByClassName('pv-profile-section pv-accomplishments-section artdeco-container-card ember-view')[0].remove();
    }
 while (document.getElementsByClassName('pv-profile-section pv-recommendations-section artdeco-container-card ember-view')[0]) {
        document.getElementsByClassName('pv-profile-section pv-recommendations-section artdeco-container-card ember-view')[0].remove();
    }
 while (document.getElementsByClassName('pv-profile-section pv-interests-section artdeco-container-card ember-view')[0]) {
        document.getElementsByClassName('pv-profile-section pv-interests-section artdeco-container-card ember-view')[0].remove();
    }
 while (document.getElementsByClassName('pv-profile-section pv-profile-section--certifications-section ember-view')[0]) {
        document.getElementsByClassName('pv-profile-section pv-profile-section--certifications-section ember-view')[0].remove();
    }
 while (document.getElementsByClassName('pv-profile-section volunteering-section ember-view')[0]) {
        document.getElementsByClassName('pv-profile-section volunteering-section ember-view')[0].remove();
    }
while (document.getElementsByClassName('pv-profile-section pv-recommendations-section artdeco-container-card ember-view')[0]) {
        document.getElementsByClassName('pv-profile-section pv-recommendations-section artdeco-container-card ember-view')[0].remove();
    }
    }
setTimeout(function(){

   $('a').contents().unwrap();
},1000);
   if (window.location.href.indexOf("linkedin") > -1) {
    $(document).keydown(function (keys) {
     if (keys.keyCode == 113){

  $('a').contents().unwrap();
     $('<input type="button" value="Education" id="Education"/>').insertAfter('h3.pv-entity__school-name.t-16.t-black.t-bold');
     $('<input type="button" value="work" id="work"/>').insertAfter('div.pv-entity__summary-info.pv-entity__summary-info--background-section');
     $('<input type="button" value="work2" id="work2"/>').insertAfter('div.pv-entity__company-summary-info');
     $('<input type="button" value="work3" id="work3"/>').insertAfter('div.pv-entity__summary-info-v2.pv-entity__summary-info--background-section.pv-entity__summary-info-margin-top');
     $('<input type="button" value="Education First" id="CopyALL"/>').insertBefore('section#education-section.pv-profile-section.education-section.ember-view');
     $('<input type="button" value="Work Second" id="CopyALL2"/>').insertBefore('section#education-section.pv-profile-section.education-section.ember-view');

      $("input#Education").click(function() {
           let degree = $(this).parent();
           let data = degree.text();

           let finaltext = data.replace("Degree Name", ',').replace("Field Of Study",';').replace(/\s+/g, " ");
           let actualfinal = finaltext.split('Grade')[0]
           datalist.push(actualfinal);
           var dummy = $('<input>').val(datalist).appendTo('body').select()
            document.execCommand('copy')

        });
$("input#work").click(function() {
           let degree2 = $(this).parent();
           let data2 = degree2.text();
           let finaltext2 = data2.substring(data2.lastIndexOf("Company Name")).replace(/,/g, '').replace("Company Name", '').replace("Dates Employed", ',').split('Employment Duration')[0].replace(/\s+/g, " ");
           datalist2.push(finaltext2);
            var dummy = $('<input>').val(datalist2).appendTo('body').select()
            document.execCommand('copy')
            $(this).parent().remove();
        });
$("input#work2").click(function() {
           let degree3 = $(this).parent();
           let data3 = degree3.text();
           let finaltext3 = data3.substring(data3.lastIndexOf("Company Name")).replace(/,/g, '').replace("Company Name", '').split('Total Duration')[0].replace(/\s+/g, " ");
           datalist2.push(finaltext3);


        });
$("input#work3").click(function() {
           let degree4 = $(this).parent();
           let data4 = degree4.text();
           let finaltext4 = data4.substring(data4.lastIndexOf("Dates Employed")).replace("Dates Employed", '').split('Employment Duration')[0].replace(/\s+/g, " ");
           datalist2.push(finaltext4);
           var dummy = $('<input>').val(datalist2).appendTo('body').select()
           document.execCommand('copy')

        });
        $('#CopyALL').on('click',function() {
         $('input#Education').trigger('click');
         $( ".education-section" ).remove();

 });
   $('#CopyALL2').on('click',function() {
         $('input#work').trigger('click');

 });
    }
    });
    }
})();