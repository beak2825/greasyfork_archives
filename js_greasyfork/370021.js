// ==UserScript==
// @name         BuzzerBeater Enhancer
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  some small tweaks for better browsing
// @author       Johann
// @icon         http://www.google.com/s2/favicons?domain=www.buzzerbeater.com
// @match        *://www.buzzerbeater.com/*
// @grant	     GM_addStyle
// @grant		 GM_xmlhttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/370021/BuzzerBeater%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/370021/BuzzerBeater%20Enhancer.meta.js
// ==/UserScript==


GM_addStyle(' \
i, cite, em, var, address, dfn {font-style:normal;} \
#rightColumn table {width:fit-content;} \
a #playerbox {display:none; position:absolute; left:400px; z-index:9999;} \
a #playerbox .boxcontent {border:2.5px solid #ffa500;}');

// 腳本專用選單
$('<div id="enhancedBox" class="noclass" style=""><div class="boxheader" style="border-top-left-radius:4px;border-top-right-radius:4px;padding-left:6px;padding-right:6px;cursor:pointer;">腳本選單 (展開)</div><div class="boxcontent"><ul class="menuList"><div class="boxclear"></div></ul></div></div>').insertBefore('#menuBox');
$('#enhancedBox ul').prepend('<li><input id="playerbox_preview" type="checkbox"><label title="加載球員連結預覽視窗">球員連結預覽</label></input></li>');
$('#enhancedBox ul').prepend('<li><input id="enhanced_tactics" type="checkbox"><label title="陣容設置頁面功能強化">設置陣容強化</label></input></li>');
$('#enhancedBox ul').prepend('<li><input id="enhanced_schedule" type="checkbox"><label title="賽程表頁面功能強化">賽程佈局強化</label></input></li>');
$('#enhancedBox ul').prepend('<li><input id="enhanced_rightColumn" type="checkbox"><label title="右側位置加載聯盟概況">右側聯盟概況</label></input></li>');

$('#playerbox_preview').click(function(){ if(!$(this).hasClass('initialized')){addBoxes();} $(this).addClass('initialized'); $('label:contains("球員連結預覽")').html('球員連結預覽 (√)'); });
$('#enhanced_tactics').click(function(){ if(!$(this).hasClass('initialized')){enhancedTactics();} $(this).addClass('initialized'); $('label:contains("設置陣容強化")').html('設置陣容強化 (√)'); });
$('#enhanced_schedule').click(function(){ if(!$(this).hasClass('initialized')){enhancedSchedule();} $(this).addClass('initialized'); $('label:contains("賽程佈局強化")').html('賽程佈局強化 (√)'); });
$('#enhanced_rightColumn').click(function(){ if(!$(this).hasClass('initialized')){addScriptBoxes();} $(this).addClass('initialized'); $('label:contains("右側聯盟概況")').html('右側聯盟概況 (√)'); });

window.onload = function() {
if($("#playerbox_preview").is(':checked')) { addBoxes(); $('#playerbox_preview').addClass('initialized'); $('label:contains("球員連結預覽")').html('球員連結預覽 (√)'); }
if($("#enhanced_tactics").is(':checked')) { enhancedTactics(); $('#enhanced_tactics').addClass('initialized'); $('label:contains("設置陣容強化")').html('設置陣容強化 (√)'); }
if($("#enhanced_schedule").is(':checked')) { enhancedSchedule(); $('#enhanced_schedule').addClass('initialized'); $('label:contains("賽程佈局強化")').html('賽程佈局強化 (√)'); }
if($("#enhanced_rightColumn").is(':checked')) { addScriptBoxes(); $('#enhanced_rightColumn').addClass('initialized'); $('label:contains("右側聯盟概況")').html('右側聯盟概況 (√)'); }
};

$('#enhancedBox input').on('change', function() {
if(!($("#playerbox_preview").is(':checked'))) { $('label:contains("球員連結預覽")').html('球員連結預覽'); }
if(!($("#enhanced_tactics").is(':checked'))) { $('label:contains("設置陣容強化")').html('設置陣容強化'); }
if(!($("#enhanced_schedule").is(':checked'))) { $('label:contains("賽程佈局強化")').html('賽程佈局強化'); }
if(!($("#enhanced_rightColumn").is(':checked'))) { $('label:contains("右側聯盟概況")').html('右側聯盟概況'); }
});

// set local storage key
var checkboxValues = JSON.parse(localStorage.getItem('checkboxValues')) || {};
var $checkboxes = $("#enhancedBox :checkbox");

$checkboxes.on("change", function(){
  $checkboxes.each(function(){
    checkboxValues[this.id] = this.checked;
  });
  localStorage.setItem("checkboxValues", JSON.stringify(checkboxValues));
});

var checkboxValues = JSON.parse(localStorage.getItem('checkboxValues'));
if (checkboxValues === null){
  checkboxValues = {};
}

$.each(checkboxValues, function(key, value) {
  $("#" + key).prop('checked', value);
});


// 選單改進
$('#ContentBox3').remove();
$('#customMenuBox').insertBefore('#menuBox');
$('#customMenuBox .boxheader').append('(展開)').css('cursor', 'pointer');
$('#customMenuBox .boxcontent, #enhancedBox .boxcontent').hide();

$('#enhancedBox .boxheader').click(function(){ // toggle text
var $this = $(this);
$this.toggleClass('enabled');
if($this.hasClass('enabled')){
$this.text('腳本選單 (閉合)');
$('#enhancedBox .boxcontent').show();}
else {$this.text('腳本選單 (展開)');
$('#enhancedBox .boxcontent').hide();}
});

$('#customMenuBox .boxheader').click(function(){ // toggle text
var $this = $(this);
$this.toggleClass('enabled');
if($this.hasClass('enabled')){
$this.text('自定義選單 (閉合)');
$('#customMenuBox .boxcontent').show();}
else {$this.text('自定義選單 (展開)');
$('#customMenuBox .boxcontent').hide();}
});


$('.clTextDiv a').each(function() {  // 當前出售中球員顯示記號與價格標籤

   var customLink = $(this).attr('href');

      GM_xmlhttpRequest({
	  method: 'GET',
	  url: customLink,
	  onload: function(xhr) {
      $doc = $(new DOMParser().parseFromString(xhr.responseText, "text/html"));

      var price = $doc.find('#ctl00_cphContent_bidsDiv b').text();

      if ( $doc.find('#ctl00_cphContent_forSaleImage').length > 0 ) {
           $('.clTextDiv a[href="' + customLink + '"]').append('<a class="price tag" style="cursor:zoom-in; text-decoration:none" title="' + price + '"> ($) </a>');

      }

      }, });

});


function addBoxes() {

$('a[href*="/player/"]').hover(function() {
// add pop-up preview boxes 滑鼠拖曳至球員姓名超連結時跳出預覽視窗
var playerLink = $(this).not('#ctl00_cphContent_text a[href*="/player/"]');
var listLink = [].slice.call(playerLink);

      $(listLink).each(function () {

      var url = $(this).attr('href');
      var num = url.match(/\d+/);

      GM_xmlhttpRequest({
	  method: 'GET',
	  url: '/player/' + num + '/overview.aspx',
	  onload: function(xhr) {
      parser = new DOMParser();
      var doc = parser.parseFromString(xhr.responseText, "text/html");
      var playerbox = doc.querySelector('#playerbox');
      if($('a[href*="' + num + '"] .widebox').length < 1){ $('a[href*="' + num + '"]').append(playerbox); }
      $('a #playerbox .boxheader').css('width','622px');
      $('a div[style="clear: both"]').nextAll().remove();
      $('#leftColumn').find('a #playerbox').remove();
      $('#iconSet li').find('a #playerbox').remove();

      var history = doc.querySelector('a[title="球員歷史"]').href;

      GM_xmlhttpRequest({
	  method: 'GET',
	  url: history,
	  onload: function(xhr) {
      $doc = $(new DOMParser().parseFromString(xhr.responseText, "text/html"));
      var transfer = $doc.find('tr').has('td:contains("轉會")');
      if($('a[href*="' + num + '"] .widebox .transline').length < 1) {
      $('<div class="transline" style="display:table-row; height:15px"></div>').insertBefore('a[href*="' + url + '"] #playerbox div[style="clear: both"]');
      transfer.insertBefore('a[href*="' + url + '"] #playerbox div[style="clear: both"]'); }
      $('#rightColumn').find('tr').has('td:contains("轉會")').remove();

             },

          });

      },

   });


$('a[href*="/player/"]').mouseover(function() {
$(this).children("#playerbox").show();

}).mouseout(function() {
$(this).children("#playerbox").hide(); });

      });
});
}

var myteampage = $('#menuRoster').attr('href');

if(window.location.href.indexOf(myteampage) > -1) {

// 陣容名稱可以自行變更
$('<span id="mainroster" class="headline" style="float: left; margin-top: 20px; margin-bottom: 20px;">主力陣容：</span>').insertBefore('#playerbox:first');
$('<span id="subroster" class="headline" style="float: left; margin-top: 20px; margin-bottom: 20px;">替補陣容：</span>').insertAfter('#mainroster');
$('<span id="resroster" class="headline" style="float: left; margin-top: 20px; margin-bottom: 20px;">後備陣容：</span>').insertAfter('#subroster');
$('<button class="sort_remover" style="float:right; cursor:pointer" title="清除所有已保存的排序">清除排序</button>').insertBefore('#mainroster');

var nameNum = $('#playerbox div[style="float: left; "]').has('a[href*="/player/"]');
$('<img class="add_sorting_2" style="margin-left:5px; cursor:pointer" src="/images/icons/icon_add_16.png" title="添加至替補"></img>').insertAfter(nameNum);
$('<img class="add_sorting_1" style="margin-left:5px; cursor:pointer" src="/images/icons/icon_add_16.png" title="添加至主力"></img>').insertAfter(nameNum);



$('.sort_remover').click(function() { localStorage.removeItem("playerboxValues1"); localStorage.removeItem("playerboxValues2"); });

$('.add_sorting_1').click(function() {

 $(this).hide(); $(this).parent().find('.add_sorting_2').show();

 var playerboxValues1= $(this).parent()[0].innerText.match(/\d+/)[0];
 var data;

 if (localStorage.getItem("playerboxValues1") === null)
   data = [];

 else
   data = JSON.parse(localStorage.getItem("playerboxValues1"));

 data.push(playerboxValues1);

 localStorage.setItem("playerboxValues1",JSON.stringify(data));

   if(localStorage.getItem("playerboxValues2") !== null) localStorage.setItem('playerboxValues2', localStorage.getItem("playerboxValues2").replace(playerboxValues1,''));

$(JSON.parse(localStorage.getItem("playerboxValues1")).reverse()).each(function () {
$('.widebox').has('.boxheader > div > a[href*="' + this + '"]').insertAfter('#mainroster'); });

});

$('.add_sorting_2').click(function() {

 $(this).hide(); $(this).parent().find('.add_sorting_1').show();

 var playerboxValues2= $(this).parent()[0].innerText.match(/\d+/)[0];
 var data;

 if (localStorage.getItem("playerboxValues2") === null)
   data = [];
 else
   data = JSON.parse(localStorage.getItem("playerboxValues2"));

 data.push(playerboxValues2);

 localStorage.setItem("playerboxValues2",JSON.stringify(data));

  if(localStorage.getItem("playerboxValues1") !== null) localStorage.setItem('playerboxValues1', localStorage.getItem("playerboxValues1").replace(playerboxValues2,''));

$(JSON.parse(localStorage.getItem("playerboxValues2")).reverse()).each(function () {
$('.widebox').has('.boxheader > div > a[href*="' + this + '"]').insertAfter('#subroster'); });

});

var mainplayer = JSON.parse(localStorage.getItem("playerboxValues1")).reverse();
$(mainplayer).each(function () {
$('.widebox').has('.boxheader > div > a[href*="' + this + '"]').insertAfter('#mainroster'); $('.widebox').has('.boxheader > div > a[href*="' + this + '"]').find('.add_sorting_1').hide();
var subplayer = JSON.parse(localStorage.getItem("playerboxValues2")).reverse();
$(subplayer).each(function () {
$('.widebox').has('.boxheader > div > a[href*="' + this + '"]').insertAfter('#subroster'); $('.widebox').has('.boxheader > div > a[href*="' + this + '"]').find('.add_sorting_2').hide();
var resplayer = [];
$(resplayer).each(function () {
$('.widebox').has('.boxheader > div > a[href*="' + this + '"]').insertAfter('#resroster');

      });

    });

  });

}


if(window.location.href.indexOf("/player/") > -1 && window.location.href.indexOf("overview.aspx") > -1) {

GM_addStyle(' \
.centered {text-align:left}');

GM_xmlhttpRequest({
	method: 'GET',
	url: $('td a[title="球員歷史"]').attr('href'),
	onload: function(xhr) {
      $doc = $(new DOMParser().parseFromString(xhr.responseText, "text/html"));
      var transfer = $doc.find('tr').has('td:contains("轉會")');
      transfer.insertBefore('div.line:first');
      $('<br>').insertBefore('div.line:first');
      $('tr').has('.centered').css('background-color','#FFFFFF');
      $('.centered.rightBorder:nth-child(1)').hide();
      $('.centered.rightBorder:nth-child(2)').css('width', '75px');
      $('.centered.rightBorder:nth-child(3)').prepend('賽季 ').css('width', '55px');
      }

  });

}


if(window.location.href.indexOf("transferlist.aspx") > -1) {

$('#ctl00_cphContent_ddlsortBy > option[value="3"]').attr('selected','selected'); // 預設改為由最年輕開始排序
$('#ctl00_cphContent_ddlSkill1Min, #ctl00_cphContent_ddlSkill2Min, #ctl00_cphContent_ddlSkill3Min, #ctl00_cphContent_ddlSkill4Min').removeAttr('disabled');

$('<button id="allround" name="skillset" style="margin-left:5px">全能型</button>').insertBefore('table[style="float:left; width: 420px;"]'); //自行命名技能偏好預設名稱
$('<button id="guard" name="skillset" style="margin-left:5px">後衛型</button>').insertBefore('table[style="float:left; width: 420px;"]');
$('<button id="bigmen" name="skillset" style="margin-left:5px">禁區型</button>').insertBefore('table[style="float:left; width: 420px;"]');
$('td').has('#ctl00_cphContent_ddlCountry').append('<input id="local" name="nation" type="checkbox" style="margin-top:6px; margin-left:6px"><lable for="ctl00$cphContent$local">本國籍</label></input>');


var nationality = $('#titlebar').find('a[href*="/country/"]').attr('title');


$('#allround').on('click', function(){  // 全能型技能篩選，請在 option:contains("") 以及 option[value=""] 內更動自行想要的值

$('#ctl00_cphContent_ddlSkill1 > option:contains("跳投能力"), #ctl00_cphContent_ddlSkill1Min > option[value="13"]').attr('selected','selected');
$('#ctl00_cphContent_ddlSkill2 > option:contains("外線防守"), #ctl00_cphContent_ddlSkill2Min > option[value="13"]').attr('selected','selected');
$('#ctl00_cphContent_ddlSkill3 > option:contains("內線投籃"), #ctl00_cphContent_ddlSkill3Min > option[value="10"]').attr('selected','selected');
$('#ctl00_cphContent_ddlSkill4 > option:contains("內線防守"), #ctl00_cphContent_ddlSkill4Min > option[value="8"]').attr('selected','selected');

});


$('#guard').on('click', function(){  // 後衛型技能篩選，請在 option:contains("") 以及 option[value=""] 內更動自行想要的值

$('#ctl00_cphContent_ddlSkill1 > option:contains("跳投能力"), #ctl00_cphContent_ddlSkill1Min > option[value="16"]').attr('selected','selected');
$('#ctl00_cphContent_ddlSkill2 > option:contains("外線防守"), #ctl00_cphContent_ddlSkill2Min > option[value="16"]').attr('selected','selected');
$('#ctl00_cphContent_ddlSkill3 > option:contains("傳球能力"), #ctl00_cphContent_ddlSkill3Min > option[value="10"]').attr('selected','selected');
$('#ctl00_cphContent_ddlSkill4 > option:contains("內線投籃"), #ctl00_cphContent_ddlSkill4Min > option[value="6"]').attr('selected','selected');

});


$('#bigmen').on('click', function(){  // 禁區型技能篩選，請在 option:contains("") 以及 option[value=""] 內更動自行想要的值

$('#ctl00_cphContent_ddlSkill1 > option:contains("內線投籃"), #ctl00_cphContent_ddlSkill1Min > option[value="16"]').attr('selected','selected');
$('#ctl00_cphContent_ddlSkill2 > option:contains("內線防守"), #ctl00_cphContent_ddlSkill2Min > option[value="13"]').attr('selected','selected');
$('#ctl00_cphContent_ddlSkill3 > option:contains("籃板能力"), #ctl00_cphContent_ddlSkill3Min > option[value="10"]').attr('selected','selected');
$('#ctl00_cphContent_ddlSkill4 > option:contains("外線防守"), #ctl00_cphContent_ddlSkill4Min > option[value="6"]').attr('selected','selected');

});

$('input[name="nation"]').on('change', function() {

if ($('#local').is(":checked")){ // 本土球員篩選

$('#ctl00_cphContent_ddlCountry > option:contains("' + nationality + '")').attr("selected", true);

}

if (!($('#local').is(":checked"))) {

$('#ctl00_cphContent_ddlCountry > option:contains("' + nationality + '")').attr("selected", false);

}

});

}


function enhancedTactics() {

if(window.location.href.indexOf("tactics.aspx") > -1) {

//$('#ctl00_cphContent_skilltable').css('display','block');

GM_addStyle(' \
#ctl00_cphContent_hlWeekStats {color:#ff7f50; font-size:1.2em; font-weight:bold; border:1px solid; padding:5px; cursor:pointer; text-decoration:none;}');

$('<h3 style="text-align: center; margin-top: 5px; margin-bottom: 10px">注意：紅底為上場超過 75 分鐘之球員，綠底為上場未滿 48 分鐘之球員</h3>').insertAfter('#ctl00_cphContent_divLineUnderFormerMatches');


GM_xmlhttpRequest({  // get weekly-stats box
	method: 'GET',
	url: $('#menuWeeklyMinutes').attr('href'),
	onload: function(xhr) {
      parser = new DOMParser();
      var doc = parser.parseFromString(xhr.responseText, "text/html");
      var stats = doc.querySelector('#WeeklyMinutes');
      var choosebox = document.querySelector('#bbChoose12');

      choosebox.append(stats);
      stats.style.display = "none";

      $('td[class=highlightG]').css('color','green');
      $('td[class=highlightR]').css('color','red');

      $('<tr><td colspan="13" align="center"><div class="line"></div></td></tr>').insertAfter($('#WeeklyMinutes tr').has('td:nth-child(2)').filter(function() {
      return parseInt($(this).text().match(/\d+/), 10) > 75;  // 時間可以自行設置
      }).last());

     }
});


// make weekly-stats box togglable
$('#ctl00_cphContent_hlWeekStats').removeAttr('href').text('展開數據統計');
$('<br>').insertBefore('#ctl00_cphContent_hlWeekStats');


$('#ctl00_cphContent_hlWeekStats').click(function(){ // toggle click function
var $this = $(this);
$this.toggleClass('enabled');
if($this.hasClass('enabled')){
$this.text('閉合數據統計');
$('#WeeklyMinutes').show();}
else {$this.text('展開數據統計');
$('#WeeklyMinutes').hide();}
});


// find player age and append to player name
var playerName = document.querySelectorAll('#ctl00_cphContent_skilltable > table >tbody > tr > td:nth-child(1) > a');
var listName = [].slice.call(playerName);
var href = listName.map(function(e) { return e.innerText; }).join("+");

var arrayN = new Array();
arrayN = href.split("+");

$(arrayN).each(function () {

var url = $('tr').has('td:nth-child(1) > a:contains("' + this + '")').find('a').attr('href');
var min = $('tr').has('td:nth-child(1) > a:contains("' + this + '")').find('td:nth-child(3)').text();

$('select > option:contains("' + this + '")').append(' (' + min + ')');

GM_xmlhttpRequest({
	method: 'GET',
	url: url,
	onload: function(xhr) {

      var age = xhr.responseText.split("年齡：").pop().split("<br")[0];
      $('#ctl00_cphContent_skilltable').find('tr td a[href*="' + url + '"]').append(' ' + age + ' 歲');

     },

       onerror: function(xhr) {

       }

  });

});

setInterval(function() { $('option[style="color: yellow;"], option[style="color: yellow; display: block;"]').css('color','black'); }, 1000);

var inactive = ['Gerard Karwan','Ákos Korösi','Peng Peng Heong']; //隱藏出戰清單中戰力外的球員

$(inactive).each(function() {

$('option:contains("' + this + '")').hide();//.css('text-decoration','line-through');

});

$(inactive).each(function() { $('tr').has('td > a:contains("' + this + '")').hide(); });


$('#rostercount').append('<h style="cursor:default"> ------> <a id="hidenames" title="點擊顯示隱藏球員" style="text-decoration:none; cursor:pointer">' + $('#ctl00_cphContent_lbRosterPlayers option[style*="display: none;"]').length + ' 位隱藏</a>');
$('option[style*="display: none;"]').append(' (隱藏)');

       var hideones = false;
        $(document).ready(function() {
        $("#hidenames").on("click", showHide);
        }
      );

       function showHide(){
        hideones = !hideones;
        if(hideones){
        $(inactive).each(function() { $('option:contains("' + this + '")').show(); });
        } else {
        $(inactive).each(function() { $('option:contains("' + this + '")').hide(); });
   }
}


// change color for better management
var undermin = $("#ctl00_cphContent_skilltable tbody tr").has('td:nth-child(3)').filter(function() {
    return parseInt($(this).text().match(/\d+/), 10) < 48;  // 未滿時間可以自行設置
}).find('td:nth-child(1)');

$(undermin).css('background','green');
$('td[style="background: green;"]').find('a').css('color', 'white');

var nodes = undermin;
var list = [].slice.call(nodes);
var innertext = list.map(function(e) { return e.innerText; }).join("+");

var array = new Array();
array = innertext.split("+");

$(array).each(function () {

$('select.fulllist > option:contains("' + this + '")').not('[style="color: rgb(255, 0, 0);"]').css('color','yellow').css('background','green'); //.append(" (未滿)");

});

var uppermin = $("#ctl00_cphContent_skilltable tbody tr").has('td:nth-child(3)').filter(function() {
    return parseInt($(this).text().match(/\d+/), 10) > 75;  // 超時時間可以自行設置
}).find('td:nth-child(1)');

$(uppermin).css('background','crimson');
$('td[style="background: crimson;"]').find('a').css('color', 'white');

var nodes1 = uppermin;
var list1 = [].slice.call(nodes1);
var innertext1 = list1.map(function(e) { return e.innerText; }).join("+");

var array1 = new Array();
array1 = innertext1.split("+");

$(array1).each(function () {

$('select.fulllist > option:contains("' + this + '")').not('[style="color: rgb(255, 0, 0);"]').css('color','yellow').css('background','crimson'); //.append(" (超時)");

});

var goodCondition = $("#ctl00_cphContent_skilltable tbody tr").has('td:nth-child(3)').filter(function() {
    return parseInt($(this).text().match(/\d+/), 10) >= 48 && parseInt($(this).text().match(/\d+/), 10) <= 75;  // add good condition value between
}).find('td:nth-child(1)');

var nodesG = goodCondition;
var listG = [].slice.call(nodesG);
var innertextG = listG.map(function(e) { return e.innerText; }).join("+");

var arrayG = new Array();
arrayG = innertextG.split("+");

$(arrayG).each(function () {

$('select.fulllist > option:contains("' + this + '")').append(" (√)");

});

// prevent reset changes on every player-update
$('input.button[value="<=>"]').click(function() {

  $(array).each(function () {

    $('select.fulllist > option:contains("' + this + '")').not('[style="color: rgb(255, 0, 0);"]').css('color','yellow').css('background','green');

  });

  $(array1).each(function () {

    $('select.fulllist > option:contains("' + this + '")').not('[style="color: rgb(255, 0, 0);"]').css('color','yellow').css('background','crimson');

  });

  $(inactive).each(function() {

    $('#ctl00_cphContent_lbRosterPlayers option:contains("' + this + '")').hide();
    $('#ctl00_cphContent_lbActivePlayers option:contains("' + this + '")').show();

  });

});

}

}


if(window.location.href.indexOf("arena.aspx") > -1) { // 調整細項格式 & 場館最大門票計算器

GM_addStyle ('#ctl00_cphContent_seatingStats tr {font-family:initial; font-size:12px;}');

//$('#selectedArena').attr('src','http://www.buzzerbeater.com/images/ArenaDesign/Asset5.svg');

var maxSales = $('#ctl00_cphContent_lblBleachers').text() * $('#ctl00_cphContent_lblpriceB').text().match(/\d+/) + $('#ctl00_cphContent_lblLowerTier').text() * $('#ctl00_cphContent_lblpriceLT').text().match(/\d+/) + $('#ctl00_cphContent_lblCourtside').text() * $('#ctl00_cphContent_lblpriceC').text().match(/\d+/) + $('#ctl00_cphContent_lblLuxuryBox').text() * $('#ctl00_cphContent_lblpriceLB').text().match(/\d+/);
var table = $('table').has('td:contains("季票持有者")').css('margin-bottom','15px');

$('<tr><td style="padding-right:10px">當前最高門票收入：<td style="padding-right:20px"><b>' + '$ ' + maxSales + '</b></td><td colspan="2">（滿座時）</td></td>').appendTo(table);

$('#ctl00_cphContent_seatingStats tr').find('a').css('font-style', 'initial');
$('#ctl00_cphContent_seatingStats tr').has('td a:contains("票價更新")').css('background', '#FFEAC3'); //.css('font-weight', 'bolder');
$('#ctl00_cphContent_seatingStats tr td a:contains("票價更新")').append(' (update)');
$('#ctl00_cphContent_seatingStats tr').find('td:nth-child(2)').css('width', '150px');

$('b:contains("更改票價")').append('<span class="max_count">'+ ' 【滿座收入：' + '$ ' + maxSales + '】' + '</span>');

$("#ctl00_cphContent_tbBleachers, #ctl00_cphContent_tbLowerTier, #ctl00_cphContent_tbCourtside, #ctl00_cphContent_tbLuxuryBoxes").on('keyup',function(){
        var bleachCount= $('#ctl00_cphContent_lblBleachers').text() * $('#ctl00_cphContent_tbBleachers').val();
        var lowTierCount = $('#ctl00_cphContent_lblLowerTier').text() * $('#ctl00_cphContent_tbLowerTier').val();
        var courtSideCount = $('#ctl00_cphContent_lblCourtside').text() * $('#ctl00_cphContent_tbCourtside').val();
        var luxuryBoxCount = $('#ctl00_cphContent_lblLuxuryBox').text() * $('#ctl00_cphContent_tbLuxuryBoxes').val();
        var totalCount = bleachCount + lowTierCount + courtSideCount + luxuryBoxCount ;
        $(".max_count").html(' 【滿座收入：' + '$ ' + totalCount + '】');
});

}


function enhancedSchedule() {

if(window.location.href.indexOf("schedule.aspx") > -1) {

GM_addStyle (' \
.tactic {padding:5px}');

var pathname = window.location.pathname.split( '/' );
var header = $('.tableHeader.centered');
var team = $('#titlebar h1 a').text();

//$('<div id="team-tactics" style="margin-left:150px; width:350px"><ul class="tactic normal"></ul><ul class="tactic outer"></ul><ul class="tactic inner"></ul><ul class="tactic iso"></ul></div>').insertBefore('#subcontent');

$('<div id="schedule-line" style="margin-top:15px"><input id="all" name="genre" type="radio" style="margin-left:150px">顯示全部</input><input id="regular" name="genre" type="radio" style="margin-left:10px">僅顯示常規賽</input><input id="playoff" name="genre" type="radio" style="margin-left:10px">僅顯示季後賽</input><input id="pos" type="checkbox" style="margin-left:10px">改以同側表示</input></div>').insertBefore('#subcontent');

$('.schedule tr').find('td:nth-child(1)').each(function() {
$(this).text($(this).text().split(" ")[0]); });

$(header).nextAll('.schedule tr').find('td:nth-child(2)').hide();
$(header).nextAll('.schedule tr').find('td:nth-child(5)').hide();
$(header).nextAll('.schedule tr').find('td:nth-child(3)').css('max-width','15ch').addClass('team_away');
$(header).nextAll('.schedule tr').find('td:nth-child(6)').css('max-width','15ch').addClass('team_home');
$(header).hide();

$('.team_home, .team_away').find('a').each(function() { // direct link to opps' schedule
$(this).attr('href', $(this).attr('href').replace('overview.aspx', pathname[3])); });

$('#all').attr('checked','true');

$('input[name="genre"]').on('change', function() {

var $this = $(this);

if ($('#regular').is(":checked")){

$('.schedule tr').not('.scgame, .cup, .plgame, .playoff, .tableHeader').show();
$('.scgame, .cup, .plgame, .playoff').hide();
$('.schedule tr').has('td:contains("Coast")').hide();
$('.tvgame').css('background-color','#ffffff'); }

if ($('#playoff').is(":checked")){

$('.playoff').show();
$('.schedule tr').has('td:contains("Coast")').hide();
$('.schedule tr, .scgame, .cup, .plgame').not('.playoff').hide(); }

if ($('#all').is(":checked")){

$('.schedule tr').has('td:contains("Coast")').show();
$('.schedule tr').not('.tableHeader.centered').show();
$('.tvgame').css('background-color','#f6daf0'); }

});


$('#pos').click(function(){

var $this = $(this);
var team = $('#titlebar h1 a').text();

$this.toggleClass('enabled');

if($this.hasClass('enabled')){

$('.schedule td a:contains("' + team + '")').css('color','crimson').css('font-weight','bolder');

$('.team_home').has('a:contains("' + team + '")').each(function() {
var center = $(this).parent().find('td.centered');
$(this).addClass('insertB').insertBefore(center);
$(this).parent().find('.team_away').addClass('insertA').insertAfter(center.next('td'));
});

}

else {

$('.schedule td a:contains("' + team + '")').removeAttr('style');

$('.insertB').each(function() { var center = $(this).parent().find('td.centered');
$(this).insertAfter(center.next('td'));
$(this).removeClass('insertB');
});

$('.insertA').each(function() { var center = $(this).parent().find('td.centered');
$(this).insertBefore(center);
$(this).removeClass('insertA');
});

}

});


$('.schedule tr').has('a#matchBoxscoreLink').each(function() {

var matchUrl = $(this).find('#matchBoxscoreLink').attr('href');

GM_xmlhttpRequest({
	method: 'GET',
	url: matchUrl,
	onload: function(xhr) {
      $doc = $(new DOMParser().parseFromString(xhr.responseText, "text/html"));
      var awayOS = $doc.find('tr').has('td:contains("進攻策略")').find('td:first').text().replace('戰術', '').replace(' (普林斯頓戰術)','').replace(' (擋拆戰術)','').replace(' (跑轟戰術)','').trim();
      var homeOS = $doc.find('tr').has('td:contains("進攻策略")').find('td:last').text().replace('戰術', '').replace(' (普林斯頓戰術)','').replace(' (擋拆戰術)','').replace(' (跑轟戰術)','').trim();
      var awayDS = $doc.find('tr').has('td:contains("防守戰術")').find('td:first').text().replace('人盯人 / 單對單','單對單').replace('2名外線 - 3名內線的聯防','2-3 聯防').replace('3名外線 - 2名內線的聯防','3-2 聯防').replace('1名外線 - 3名中線 - 1名內線的聯防','1-3-1 聯防').replace('全場緊迫地防守','全場盯人').replace('1盯人（內） - 4聯防','1 內 - 4 聯防').replace('1盯人（外） - 4聯防','1 外 - 4 聯防').trim();
      var homeDS = $doc.find('tr').has('td:contains("防守戰術")').find('td:last').text().replace('人盯人 / 單對單','單對單').replace('2名外線 - 3名內線的聯防','2-3 聯防').replace('3名外線 - 2名內線的聯防','3-2 聯防').replace('1名外線 - 3名中線 - 1名內線的聯防','1-3-1 聯防').replace('全場緊迫地防守','全場盯人').replace('1盯人（內） - 4聯防','1 內 - 4 聯防').replace('1盯人（外） - 4聯防','1 外 - 4 聯防').trim();
      var awayOP = $doc.find('tr').has('td:contains("進攻重心")').find('td:first'); var awayDP = $doc.find('tr').has('td:contains("進攻節奏")').find('td:first');
      var homeOP = $doc.find('tr').has('td:contains("進攻重心")').find('td:last'); var homeDP = $doc.find('tr').has('td:contains("進攻節奏")').find('td:last');
      var effort = $doc.find('#ctl00_cphContent_lblEffort').text(); var team = $('#titlebar h1 a').text();
      $('.schedule tr').has('a[href*="' + matchUrl + '"]').find('.team_away').append('<h1 style="font-size:10px">('+awayOS+')' + ' ('+awayDS+')</h1>').append(awayOP).append(awayDP);
      $('.schedule tr').has('a[href*="' + matchUrl + '"]').find('.team_home').append('<h1 style="font-size:10px">('+homeOS+')' + ' ('+homeDS+')</h1>').append(homeOP).append(homeDP);
      if(effort.indexOf(team + " 在球場上") > -1 ) { $('.schedule tr').has('a[href*="' + matchUrl + '"]').find('td').has('#matchBoxscoreLink').prepend('<img src="http://www.buzzer-manager.com/img/enthousiasme_moins_1.png" title="' + effort + '"></img>'); }
      if(effort.indexOf(team + " 較努力") > -1 ) { $('.schedule tr').has('a[href*="' + matchUrl + '"]').find('td').has('#matchBoxscoreLink').prepend('<img src="http://www.buzzer-manager.com/img/enthousiasme_plus_1.png" title="' + effort + '"></img>'); }
    }
});

});

}

}


function tacticsAnalyst() {

  var team = $('#titlebar h1 a').text();

  var NO = $('.schedule td').has('a:contains("' + team + '")').find('h1:contains("普通進攻")').length; var FP = $('.schedule td').has('a:contains("' + team + '")').find('h1:contains("快速進攻")').length; var NS = $('.schedule td').has('a:contains("' + team + '")').find('h1:contains("一般穩攻")').length;
  var IF = $('.schedule td').has('a:contains("' + team + '")').find('h1:contains("內線快攻")').length; var IS = $('.schedule td').has('a:contains("' + team + '")').find('h1:contains("內線穩攻")').length; var II = $('.schedule td').has('a:contains("' + team + '")').find('h1:contains("內線單打")').length;
  var OF = $('.schedule td').has('a:contains("' + team + '")').find('h1:contains("外線快攻")').length; var OS = $('.schedule td').has('a:contains("' + team + '")').find('h1:contains("外線穩攻")').length; var OI = $('.schedule td').has('a:contains("' + team + '")').find('h1:contains("外線單打")').length;
  var MO = $('.schedule td').has('a:contains("' + team + '")').find('h1:contains("中外線")').length;

  if(FP > 0 || NS > 0 || NO > 0 ) { $('#team-tactics ul.normal').html('快速進攻：' + FP + ' 一般穩攻：' + NS + ' 普通進攻：' + NO).css('border', '1px solid #FF9900'); }
  if(OF > 0 || OS > 0 || MO > 0 ) { $('#team-tactics ul.outer').html('外線快攻：' + OF + ' 外線穩攻：' + OS + ' 中外進攻：' + MO).css('border', '1px solid #FF9900'); }
  if(IS > 0 || IF > 0 ) { $('#team-tactics ul.inner').html('內線快攻：' + IF + ' 內線穩攻：' + IS).css('border', '1px solid #FF9900'); }
  if(II > 0 || OI > 0 ) { $('#team-tactics ul.iso').html('內線單打：' + II + ' 外線單打：' + OI).css('border', '1px solid #FF9900'); }

}



if(window.location.href.indexOf("/manage/overview") > -1) {


$('#HeaderBox6').has('.boxcontent > a > i > span:contains("此項功能只對支持者開放使用")').hide(); // 非支持者自動隱藏無作用區塊


var url = $('#menuArena').attr('href');
var urls = $('#menuWeeklyMinutes').attr('href');
var eco = $('#menuEconomy').attr('href');
var sales = $('#ctl00_cphContent_lblLastAttendance').text().match(/\d+/);
var tdColumn = $('td').has('#ctl00_cphContent_lblLastAttendance');

GM_xmlhttpRequest({  // 添加聯盟平均收入作比照
	method: 'GET',
	url: eco,
	onload: function(xhr) {
      $doc = $(new DOMParser().parseFromString(xhr.responseText, "text/html"));
      $('td').has('#ctl00_cphContent_lblNetWeeklyIncome').append($doc.find('#ctl00_cphContent_lblLeagueAverageNetText')).append($doc.find('#ctl00_cphContent_lblLeagueAverageNet')).css('cursor','zoom-in');
      $('#ctl00_cphContent_lblLeagueAverageNetText, #ctl00_cphContent_lblLeagueAverageNet').css('font-size', '10px').hide();
      $('#ctl00_cphContent_lblLeagueAverageNetText').text(' ｜ 聯盟：');

      $('td').has('#ctl00_cphContent_lblNetWeeklyIncome').click(function(){
      $(this).toggleClass('enabled');
      if($(this).hasClass('enabled')){
      $(this).children("#ctl00_cphContent_lblLeagueAverageNetText, #ctl00_cphContent_lblLeagueAverageNet").show(); $(this).css('cursor','zoom-out'); }
      else {
      $(this).children("#ctl00_cphContent_lblLeagueAverageNetText, #ctl00_cphContent_lblLeagueAverageNet").hide(); $(this).css('cursor','zoom-in'); }
      });

      }
});


GM_xmlhttpRequest({  // 滑鼠拖曳至 [上座率] 時跳出詳細註解
	method: 'GET',
	url: url,
	onload: function(xhr) {
      $doc = $(new DOMParser().parseFromString(xhr.responseText, "text/html"));
      var saler = $doc.find('tr').has('.attendanceTD:contains("' + sales + '")');
      var t1 = saler.find('td:nth-child(3)').text(); var t2 = saler.find('td:nth-child(4)').text(); var t3 = saler.find('td:nth-child(5)').text(); var t4 = saler.find('td:nth-child(6)').text();
      $('#ctl00_cphContent_hlArenaLink').attr("title", "露天看臺: " + t1 + "  下層座位: " + t2 + "  場邊座位: " + t3 + "  貴賓座位: " + t4 );
      }
});

GM_xmlhttpRequest({  // 主頁添加週期數據統計 box
	method: 'GET',
	url: urls,
	onload: function(xhr) {
      parser = new DOMParser();
      var doc = parser.parseFromString(xhr.responseText, "text/html");
      var stats = doc.querySelector('#WeeklyMinutes');
      var calendar = document.getElementById('teamCalendar');
      calendar.parentNode.insertBefore(stats, calendar);

      $('td[class=highlightG]').css('color','green');
      $('td[class=highlightR]').css('color','red');

      $('<tr><td colspan="13" align="center"><div class="line"></div></td></tr>').insertAfter($('#WeeklyMinutes tr').has('td:nth-child(2)').filter(function() {
      return parseInt($(this).text().match(/\d+/), 10) > 75;  // 超過上限時間者以虛線區隔
      }).last());

     }
});

}

function addScriptBoxes() {

if(window.location.href.indexOf("/league/") < 1 && window.location.href.indexOf("/community/forum") < 1 && window.location.href.indexOf("/country/") < 1 ) {

var url = $('#menuTeamLeague').attr('href');

GM_xmlhttpRequest({  // 右側欄增加聯盟傷病與出售中球員概覽
	method: 'GET',
	url: url,
	onload: function(xhr) {
      $doc = $(new DOMParser().parseFromString(xhr.responseText, "text/html"));
      var injurybox = $doc.find('#cbInjuryReport');
      var transbox = $doc.find('#cbTLReport');
      $('#rightColumn').append(injurybox);
      $('#rightColumn').append(transbox);

      var width = $('#rightColumn #cbTLReport table').width();
      $('#rightColumn .boxcontent, #rightColumn .boxheader, #rightColumn table').css('width',width);

      // hightlighted current matchup opponent's team status at rightside column
      if(window.location.href.indexOf("tactics.aspx") > -1) {
      var match_opponent = $('h1 a:not(:contains(' + $('#menuTeamName').text() + '))').attr('href').split('/')[2];  // Defined current matchup opponent
      $('#rightColumn tr').has('a[href*=' + match_opponent + ']').css('background','#ffce8f');
      $('#rightColumn tr').has('a[href*=' + $('#ctl00_bbCountdown_hlNextOpponent').attr('href').split('/')[2] + ']').css('background','#FFEAC3'); }


var playerLink = $('#rightColumn a[href*="/player/"]');
var listLink = [].slice.call(playerLink);

      $(listLink).each(function () {

      var url = $(this).attr('href');
      var num = url.match(/\d+/);

      GM_xmlhttpRequest({
	  method: 'GET',
	  url: '/player/' + num + '/overview.aspx',
	  onload: function(xhr) {
      parser = new DOMParser();
      var doc = parser.parseFromString(xhr.responseText, "text/html");
      var playerbox = doc.querySelector('#playerbox');
      if($('#rightColumn  a[href*="' + num + '"] .widebox').length < 1){ $('#rightColumn a[href*="' + num + '"]').append(playerbox); }
      $('a #playerbox .boxheader').css('width','622px');
      $('a div[style="clear: both"]').nextAll().remove();

      },

   });

$('a[href*="/player/"]').mouseover(function() {
$(this).children("#playerbox").show();

}).mouseout(function() {
$(this).children("#playerbox").hide(); });

      });

     }

  });

}

}