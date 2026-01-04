// ==UserScript==
// @name         Voca Test Cheat Mode12
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  어디서 내가 바꿔놓은 걸 롤백하려고 ㅋㅋ
// @author       You
// @match        https://chamstudyland.com/vokok/desktop/user_stat.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chamstudyland.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479605/Voca%20Test%20Cheat%20Mode12.user.js
// @updateURL https://update.greasyfork.org/scripts/479605/Voca%20Test%20Cheat%20Mode12.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    function show_ranking1(){
	hide_stat();
	$("#ranking").show();
	$("#btn_stat_ranking").addClass("stat_menu_selected");
	print_ranking();
}

    function render_ranking1(limit){
  var sortingField = "total_point";
  point_data.sort(function(a, b) {
      return b[sortingField] - a[sortingField];
  });
  $("#loading2").hide();
  //1st
  $("#ranker_name1").text(scale_id(point_data[0].id));
  $("#ranker_point1").text(add_comma(point_data[0].total_point));

  //2nd
  $("#ranker_name2").text(scale_id(point_data[1].id));
  $("#ranker_point2").text(add_comma(point_data[1].total_point));
  //3rd
  $("#ranker_name3").text(scale_id(point_data[2].id));
  $("#ranker_point3").text(add_comma(point_data[2].total_point));

  $("#rank_inner").empty();
  for(i=0;i<point_data.length;i++){
    if(limit && i>=20){
      if(point_data[i].id == user_id){
        mydata = {"rank":(i+1), "data" : point_data[i]};
        render_detail_info("my");
      }
      continue;
    }
    if(point_data[i].id == user_id){
      $("#rank_inner").append('<div class="rank_elem_my">'+(i+1)+'</div>');
      $("#rank_inner").append('<div id="name'+i+'" class="rank_elem_my rank_elem_name">'+point_data[i].id+'</div>');
      $("#rank_inner").append('<div class="rank_elem_my">'+add_comma(point_data[i].word_point)+'</div>');
      $("#rank_inner").append('<div class="rank_elem_my">'+add_comma(point_data[i].record_point)+'</div>');
      $("#rank_inner").append('<div class="rank_elem_my">'+add_comma(point_data[i].total_point)+'</div>');
      mydata = {"rank":(i+1), "data" : point_data[i]};
      render_detail_info("my");
    }else{
      $("#rank_inner").append('<div class="rank_elem">'+(i+1)+'</div>');
      $("#rank_inner").append('<div id="name'+i+'" class="rank_elem rank_elem_name">'+point_data[i].name+'</div>');
      $("#rank_inner").append('<div class="rank_elem">'+add_comma(point_data[i].word_point)+'</div>');
      $("#rank_inner").append('<div class="rank_elem">'+add_comma(point_data[i].record_point)+'</div>');
      $("#rank_inner").append('<div class="rank_elem">'+add_comma(point_data[i].total_point)+'</div>');
    }
    $("#name"+i).hover(function(e){
      render_detail_info("other", e.target.id);
    }, function(e){
      render_detail_info("my");
    });
  }
}
    window.show_ranking = show_ranking1;
    window.render_ranking = render_ranking1;
})();