// ==UserScript==
// @name         New Phil
// @namespace    Tehapollo
// @version      1.0
// @description  Easier Copy
// @author       Tehapollo
// @include       *linkedin.com*
// @grant  GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/402679/New%20Phil.user.js
// @updateURL https://update.greasyfork.org/scripts/402679/New%20Phil.meta.js
// ==/UserScript==

(function() {
 var datalist = []
 var datalist2 = []
 var hide_bullshit = setInterval(function(){ bullshitgone(); }, 500);
 var autoexpan = setInterval(function(){ autoexpander(); }, 500);


function autoexpander(){
  $('button.pv-profile-section__see-more-inline.pv-profile-section__text-truncate-toggle.link.link-without-hover-state').click();
  $(`[class="lt-line-clamp__more"]`).click();
  }






function bullshitgone(){
       while (document.getElementsByClassName('pv-highlights-section pv-profile-section artdeco-container-card ember-view')[0]) {
        document.getElementsByClassName('pv-highlights-section pv-profile-section artdeco-container-card ember-view')[0].remove();
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

 while (document.getElementsByClassName('pv-profile-section volunteering-section ember-view')[0]) {
        document.getElementsByClassName('pv-profile-section volunteering-section ember-view')[0].remove();
    }
while (document.getElementsByClassName('pv-profile-section pv-recommendations-section artdeco-container-card ember-view')[0]) {
        document.getElementsByClassName('pv-profile-section pv-recommendations-section artdeco-container-card ember-view')[0].remove();
    }
    }
setTimeout(function(){

 $(`[class="inline-show-more-text__button link"`).click();
},1000);
   if (window.location.href.indexOf("linkedin") > -1) {
    $(document).keydown(function (keys) {
     if (keys.keyCode == 113){



     $('<input type="button" value="Hover Copy" id="titlecopy"/>').appendTo('h3.t-16.t-black.t-bold');




 $("input#titlecopy").mouseover(function() {
           let degree = $(this).parent().text();
           var dummy = $('<input>').val(degree).appendTo('body').select()
            document.execCommand('copy')

        });




    }
    });
    }
})();