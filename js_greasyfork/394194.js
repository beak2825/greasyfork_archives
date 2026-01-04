// ==UserScript==
// @icon             https://www.thfou.com/img/favicon.png
// @name             淘宝天猫阿里巴巴子账号页增强
// @namespace        https://www.thfou.com/
// @version          1.1.1
// @description      统计询盘量，增加旺旺跳转功能等
// @author           头号否
// @match            *://zzh.1688.com/subaccount/monitor/*
// @match            *://zizhanghao.taobao.com/subaccount/monitor/*
// @require          https://libs.baidu.com/jquery/1.10.2/jquery.min.js
// @supportURL       https://www.thfou.com/liuyan
// @compatible	     Chrome
// @compatible	     Firefox
// @compatible	     Edge
// @compatible   	 Safari
// @compatible   	 Opera
// @compatible	     UC
// @license          GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/394194/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%AD%90%E8%B4%A6%E5%8F%B7%E9%A1%B5%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/394194/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%AD%90%E8%B4%A6%E5%8F%B7%E9%A1%B5%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
var style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML="#thfou_xpl{padding:10px;}.kj{float: left; width: 295px;border-right: 1px solid #ececec;}.kjtitle{float: left; width: 100%; height: 30px;}.kjdata{font-size: 28px;color: #333;text-align: center;}.h-wrap{height:65px!important;}.wwuid{width:390px;}";
document.getElementsByTagName('HEAD').item(0).appendChild(style);

var btn = document.createElement('button');
btn.id = 'getdata';
btn.className = 'ui-btn ui-btn-gray btn-search';
btn.innerText = '高级查询';
$('.btn-wrap').append(btn);
$('#getdata').click(function(){
$('#J_SearchBtn').click();
$('#sjtzm').click();
});

var urlpd = document.domain;
var surl = urlpd.split('.')[0];

var wwbtn = document.createElement('button');
wwbtn.id = 'wwbtn';
wwbtn.className = 'ui-btn ui-btn-gray btn-search';
wwbtn.innerText = '联系旺旺';
$('.btn-wrap').append(wwbtn);
$('#wwbtn').click(function(){
    var wwtext = document.getElementById('types');
    var index = wwtext.selectedIndex;
    var zhid = wwtext.options[index].text;
	var nick = zhid;
if(nick == ''){
    alert('请先点击"高级查询"');
} else if ( surl == 'zzh' ) {
 window.open('https://amos.alicdn.com/getcid.aw?spm=a360q.8234005.0.0.43727ac4nMsvXO&v=3&groupid=0&s=1&charset=utf-8&uid=' + nick + '&site=cnalichn&fromid=cnalichn');
} else if ( surl == 'zizhanghao' ) {
 var nicks = encodeURI(nick);
 window.open('https://amos.alicdn.com/getcid.aw?spm=a1z09.1.0.0.6f903606LqQDvI&v=3&groupid=0&s=1&charset=utf-8&uid=' + nicks + '&site=cntaobao&fromid=cntaobao');
}
});

function aliwwdata(){
var all = document.getElementById('J_CustomerList').innerText;
if(all == ''){
  $('#types option').remove();
  document.getElementsByClassName('kjdata')[0].innerText = '0';
}else{
$('#types option').remove();
var aliww = document.querySelectorAll('#J_CustomerList li');
for(var i = 0; i<aliww.length; i++){
aliww[i].index = i;
var aliuid = aliww[i].innerText;
var zhinfo = '<option value="' + aliww[i].index + '">' + aliuid + '</option>';
$('#thfou_wwh select').append(zhinfo);
}

if ( surl == 'zzh' ) {
var alixpl = aliww.length-1;
var alidata = document.createElement('div');
alidata.innerHTML = '<div class="control-wrap btn-wrap h-wrap"><div id="thfou_xpl" class="kj"><span class="kjtitle">询盘量</span><span class="kjdata">' + alixpl + '</span></div></div>';
$('.fm-search').append(alidata);
$('#zzhdata').html(alidata);
} else if ( surl == 'zizhanghao' ) {
var tbxpl = aliww.length;
var tbdata = document.createElement('div');
tbdata.innerHTML = '<div class="control-wrap btn-wrap h-wrap"><div id="thfou_xpl" class="kj"><span class="kjtitle">询盘量</span><span class="kjdata">' + tbxpl + '</span></div></div>';
$('.fm-search').append(tbdata);
$('#zzhdata').html(tbdata);
}
}
}

var kjdata = document.createElement('div');
kjdata.id = 'zzhdata';
kjdata.innerHTML = '<div class="control-wrap btn-wrap h-wrap"><div id="thfou_xpl" class="kj"><span class="kjtitle">询盘量</span><span class="kjdata">0</span></div></div>';
$('.fm-search').append(kjdata);

var dumpww = document.createElement('div');
  dumpww.id = 'thfou_wwh';
  dumpww.className = 'control-wrap ipt-wrap';
  dumpww.innerHTML = '<label class="lb-title">旺旺号：</label><select id="types" name="types" class="wwuid"><option value=""></option></select>';
$('.fm-search .btn-wrap')[0].before(dumpww);

var tips = document.createElement('span');
tips.className = 'help-inline';
tips.style = 'display:block;';
tips.innerHTML = '<b class="red">* </b>' + '请先选择旺旺号，再点击下面“联系旺旺”';
$('#thfou_wwh').append(tips);

var sjtzm = document.createElement('span');
sjtzm.id = 'sjtzm';
sjtzm.className = 'help-inline';
sjtzm.style = 'display:block;';
sjtzm.innerHTML = '<div onclick="sjtzms();">数据统计模块，头号否提供技术支持</div>';
$('.btn-wrap')[0].append(sjtzm);

var sjtzls = document.getElementById('sjtzm');
    sjtzls.addEventListener('click', sjtzms, false);
function sjtzms() {
setTimeout (function () {
aliwwdata();
},100);
}
})();