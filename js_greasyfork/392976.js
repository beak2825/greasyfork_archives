// ==UserScript==
// @name         Phill Linked In 2.0
// @namespace    Tehapollo
// @version      2.3
// @description  Easier Copy
// @author       Tehapollo
// @include       *linkedin.com*
// @grant  GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/392976/Phill%20Linked%20In%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/392976/Phill%20Linked%20In%2020.meta.js
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
     
     $('<input type="button" value="work2" id="work2"/>').insertAfter('.pv-profile-section__card-item-v2.pv-profile-section.pv-position-entity.ember-view');
     $(`[class="ph5 pb5"]`).append('<input type="button" value="Education First" id="CopyALL"/>')
     $(`[class="ph5 pb5"]`).append('<input type="button" value="Work Second" id="CopyALL2"/>')
        $('<input type="button" value="Education First" id="CopyALL"/>').insertBefore('section#education-section.pv-profile-section.education-section.ember-view');
     $('<input type="button" value="Work Second" id="CopyALL2"/>').insertBefore('section#education-section.pv-profile-section.education-section.ember-view');


      $("input#Education").click(function() {
           let degree = $(this).parent();
           let data = degree.text();

           let finaltext = data.replace("University of California, Santa Barbara", "University of California Santa Barbara").replace("University of California, Berkeley", "University of California Berkeley").replace("Degree Name", ',').replace("Field Of Study",';').replace(/\s+/g, " ");
           let actualfinal = finaltext.split('Grade')[0]
           datalist.push(actualfinal);
           var dummy = $('<input>').val(datalist).appendTo('body').select()
            document.execCommand('copy')

        });

$("input#work2").click(function() {
           $( ".t-14.t-black.t-bold" ).remove();
           $( "h4.t-14.t-black.t-normal" ).remove();
           $( ".pv-entity__bullet-item-v2").remove();
           $( ".Elevation-0dp.pv-treasury-item.pv-treasury-item--compact.pv-treasury-item--show-summary.ember-view").remove();
           $( ".pv-entity__extra-details.ember-view").remove();
           $( "h4.pv-entity__location.t-14.t-black--light.t-normal.block").remove();
           let degree3 = $(this).parent();
           let data3 = degree3.text();
           let finaltext3 = data3.substring(data3.lastIndexOf("Company Name")).replace(/,/g, '').replace("Company Name", '').replace(/Employment Duration/g,'').replace(/Dates Employed/g,',').replace(/Show fewer roles/g,'').replace(/\s+/g, " ");
           datalist2.push(finaltext3);
           var dummy = $('<input>').val(datalist2).appendTo('body').select()
           document.execCommand('copy')


        });

        $('#CopyALL').on('click',function() {
         $('input#Education').trigger('click');
         $( ".education-section" ).remove();

 });
   $('#CopyALL2').on('click',function() {
         $('input#work2').trigger('click');

 });
    }
    });
    }
})();