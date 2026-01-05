// ==UserScript==
// @name       運動筆記賽事清單路跑距離篩選
// @namespace  http://blog.darkthread.net/
// @version    0.9.2
// @description  為運動筆記之賽事清單加入路跑距離篩選器 by Jeffrey Lee, 黑暗執行緒
// @match      http://tw.running.biji.co/index.php?q=competition*
// @license    http://creativecommons.tw/cc0
// @downloadURL https://update.greasyfork.org/scripts/10145/%E9%81%8B%E5%8B%95%E7%AD%86%E8%A8%98%E8%B3%BD%E4%BA%8B%E6%B8%85%E5%96%AE%E8%B7%AF%E8%B7%91%E8%B7%9D%E9%9B%A2%E7%AF%A9%E9%81%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/10145/%E9%81%8B%E5%8B%95%E7%AD%86%E8%A8%98%E8%B3%BD%E4%BA%8B%E6%B8%85%E5%96%AE%E8%B7%AF%E8%B7%91%E8%B7%9D%E9%9B%A2%E7%AF%A9%E9%81%B8.meta.js
// ==/UserScript==

//依長度不同區分為六大類
var distCatgs = {
  "5K": "5k", "5K+": "5k-plus", "半馬": "half-ma", 
  "超半馬": "ultra-half-ma", "全馬": "std-ma", "超馬": "ultra-ma" 
};
function scanEvents() {
  //若先前已掃瞄過，略過不處理
  if ($(".com_detail_info:first").hasClass("scan")) return;
  //掃瞄所有賽事，依其距離分類，以class標註於資料列元素
  //場數統計表
  var stats = {}; 
  $(".com_detail_info .competition_event .event_item").each(function() {
    var match = /[0-9.]+K/.exec(this.innerText);
    if (!match) return;
    var dist = match[0];
    var km = parseInt(dist.replace("K", ""));
    // 分類成 5K, 5K+, 半馬, 超半馬, 全馬, 超馬
    var catg = "5K";
    if (km > 5 && km <21) catg = "5K+";
    else if (km == 21) catg = "半馬";
    else if (km > 21 && km < 42) catg = "超半馬";
    else if (km == 42) catg = "全馬";
    else if (km > 42) catg = "超馬";
    // 在資料列元素上以class標示
    $(this).closest(".com_detail_info").addClass(distCatgs[catg]);
    if (stats.hasOwnProperty(catg)) stats[catg]++;
    else stats[catg] = 1;
  });
  console.log("Scanned");
  //更新統計數於篩選鈕後方
  var $fltrBar = $("#distance_filter");
  $.each(Object.keys(distCatgs), function(i, c) {
    $fltrBar.find("." + distCatgs[c] + " .counter").text(stats[c]);
  });
  //在第一筆賽事做記號註記已經掃瞄
  $(".com_detail_info:first").addClass("scanned");
}
// 加入篩選器
$("#distance_filter").remove(); //若已存在先移除之
var h = [];
$.each(Object.keys(distCatgs), function(i, d) {
  h.push(
  '<div class="float_select ' + distCatgs[d] + '" data-catg="' + distCatgs[d] + '">' +
  '<div class="filter_choose_item com_type filter_select_item">' + d + 
  ' <span style="font-size:80%">(<span class="counter"></span>)</span>' +
  '</div>' +
  '<div class="drop_choose fa fa-remove" style="display:block"></div>' +
  '</div>');
});
$("#menu_choose_bar .filter_item:last").before(
  '<div class="filter_item" id="distance_filter">' +
  '<div class="filter_type">距離</div>' +
  '<div class="filter_value">' +
  h.join() +
  '</div></div>');

var $filterBar = $("#distance_filter");
$filterBar.on("click", ".filter_choose_item", function() {
  $(this).addClass("filter_select_item").next().show();
  scanEvents();
  filter();
  return false; //防止觸發原始網頁的查詢
}).on("click", ".fa-remove", function() {
  $(this).hide().prev().removeClass("filter_select_item");
  scanEvents();
  filter();
  return false;
});
//執行篩選
function filter() {
  var $all = $(".com_detail_info");
  $all.removeClass("show").hide(); //先全部隱藏
  var selectedCatgs = $.map($filterBar.find(".filter_select_item"), 
    function(elem) { //有選取的距離加上show
      var catgCss = $(elem).parent().attr("data-catg");
      $all.filter("." + catgCss).addClass("show") 
    });
  $all.filter(".show").show(); //顯示有標上show者
}
scanEvents();
