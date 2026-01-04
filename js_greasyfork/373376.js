// ==UserScript==
// @name         ePort Go
// @namespace    http://tubo.nz/
// @version      0.3
// @description  Complete your ePort!
// @author       Tubo
// @match        https://eport.nz/Interns/SkillLog.aspx
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/373376/ePort%20Go.user.js
// @updateURL https://update.greasyfork.org/scripts/373376/ePort%20Go.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const current_date = new Date();
  const q1 = new Date('2017-11-30'), q2 = new Date('2018-02-26'),
        q3 = new Date('2018-05-28'), q4 = new Date('2018-08-27');
  
  
  function format_date(start, end) {
    const date_diff = end.getTime() - start.getTime();
    const date = new Date(Math.floor(Math.random() * date_diff + start.getTime()))
    
    let y = String(date.getFullYear()),
        m = date.getMonth() + 1,
        d = date.getDate() + 1;
    
    m = m < 10 ? '0' + m : String(m);
    d = d < 10 ? '0' + d : String(d);
    
    return y + '/' + m + '/' + d;
  };
  
  
  $('#MainContent_SkillsListHolder').hide();
  
  
  var $achieved_date = $('#AchievedDate')
  
  $("<button>", {
  	html: "Q4",
    "class": "btn btn-default"
  }).insertAfter($achieved_date).click(function(evt) {
    evt.preventDefault();
    $achieved_date.val(format_date(q4, current_date))
  });
    
  $("<button>", {
  	html: "Q3",
    "class": "btn btn-default"
  }).insertAfter($achieved_date).click(function(evt) {
    evt.preventDefault();
    $achieved_date.val(format_date(q3, current_date))
  });
    
  $("<button>", {
  	html: "Q2",
    "class": "btn btn-default"
  }).insertAfter($achieved_date).click(function(evt) {
    evt.preventDefault();
    $achieved_date.val(format_date(q2, q3))
  });
    
  $("<button>", {
  	html: "Q1",
    "class": "btn btn-default"
  }).insertAfter($achieved_date).click(function(evt) {
    evt.preventDefault();
    $achieved_date.val(format_date(q1, q2))
  });
  
  $('#MainContent_AchievmentEditor_MethodDD > option[value=1]').attr('selected', 'selected');
  $('#MainContent_AchievmentEditor_RelatedRunDD > option[value=10960]').attr('selected', 'selected');
  $('#MainContent_AchievmentEditor_Comments').val(" ");
  var submit_button = $('#MainContent_AchievmentEditor_SaveAchievement');

  
  
  var skills = $('#MainContent_SkillsListHolder > a');
  skills.css("display", "block");
  skills.insertAfter("#Form1 > div.container.banner > div.col-lg-12 > div.TopBar");
  
  // auto scroll to modal box
  $('#modal').on('shown.bs.modal', function () {
    $('#modal').animate({ scrollTop: 0 }, 'slow');
});	
  $('.SkillDone').hide();

})();