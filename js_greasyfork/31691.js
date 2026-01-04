// ==UserScript==
// @description 快速下注，自动签到，查积分，地图通过率，离线签到
// @icon https://apic.douyucdn.cn/upload/avatar/002/86/30/15_avatar_big.jpg
// @name 斗鱼超级小桀房间工具
// @version 1.3.2
// @match https://www.douyu.com/74751
// @match https://www.douyu.com/cave
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @namespace https://greasyfork.org/users/142968
// @require https://greasyfork.org/scripts/31852-zjyong/code/zjyong.js?version=208667
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @connect xiaojie666.com
// @downloadURL https://update.greasyfork.org/scripts/31691/%E6%96%97%E9%B1%BC%E8%B6%85%E7%BA%A7%E5%B0%8F%E6%A1%80%E6%88%BF%E9%97%B4%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/31691/%E6%96%97%E9%B1%BC%E8%B6%85%E7%BA%A7%E5%B0%8F%E6%A1%80%E6%88%BF%E9%97%B4%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

var dragFlag = false;
var x,y;
var yiqian = true
var lastText = ""
var acf_did = getCookie('acf_did')
var nickname = getCookie('acf_nickname')
var acf_uid = getCookie('acf_username')
var acf_ltkid = getCookie('acf_ltkid')
var acf_stk = getCookie('acf_stk')
var ver = "1.3"
var show_stat = "1"

  var div = document.createElement('div');
  div.setAttribute('id', 'newDiv');
  div.addEventListener('mousedown', down, false);
  document.addEventListener('mousemove', move, false);
  document.addEventListener('mouseup', up, false);
  div.innerHTML = "<input type=\'button\' id=\'bnt_qyl1\' style='width:90px;margin-top:10px;margin-left:7px' value=\'#1 全压了\'><input type=\'button\' id=\'bnt_qyl2\' style='width:90px;margin-left:7px' value=\'#2 全压了\'><input type=\'button\' id=\'bnt_yyb1\' style='width:90px;margin-top:2px;margin-left:7px' value=\'#1 压一半\'><input type=\'button\' id=\'bnt_yyb2\' style='width:90px;margin-left:7px' value=\'#2 压一半\'><input type=\'button\' id=\'bnt_xxlb\' style='width:90px;margin-top:2px;margin-left:7px' value=\'#抢分\'><input type=\'button\' id=\'bnt_qd\' style='width:90px;margin-left:7px' value=\'#入团\'><input type=\'button\' id=\'bnt_yc\' style='width:90px;margin-top:2px;margin-left:7px' value=\'隐藏\'><span style='font-size:14px'><input class='magic-checkbox' type='checkbox' checked='checked' id='autoqd' style='margin-top:2px;margin-left:20px';>&nbsp自动签到</span><textarea id='jifenxianshi'  style='margin-top:7px;height:50px;width:177px;margin-left:7px;line-height:12pt;overflow:hidden' readonly='value'></textarea><textarea id='dituxianshi'  style='margin-top:7px;height:82px;width:177px;margin-left:7px;line-height:12pt;overflow:hidden' readonly='value'></textarea>";
  div.style.setProperty('position', 'absolute');
  div.style.setProperty('width', '201px');
  div.style.setProperty('height', '278px');
  div.style.setProperty('background', '#eff7ff');
  div.style.setProperty('left', '960px');
  div.style.setProperty('top', '10px');
  div.style.setProperty('border', '1px solid #96c2f1');
  div.style.setProperty('z-index', '999');
  div.style.setProperty('box-shadow', '0 1px 5px 4px #888888');
  document.body.appendChild(div);
  
  if (navigator.userAgent.indexOf("Firefox") == -1) {
	  $("#bnt_yyb1").css("margin-top","5px");
	  $("#bnt_xxlb").css("margin-top","5px");
	  $("#bnt_cf").css("margin-top","5px");
	  $("#jifenxianshi").css("margin-top","9px");
  }
  div.style.left = GM_getValue('left','960px');
  div.style.top = GM_getValue('top','10px');
  
  var arr=new Array("bnt_qyl1","bnt_qyl2","bnt_yyb1","bnt_yyb2","bnt_xxlb","bnt_qd","#1 老子全压了","#2 老子全压了","#1 老子压一半","#2 老子压一半","#抢分","#入团");

for (var i=0;i<6;i++) 
  {
    addevent(arr[i],arr[i+6])
  }

  //document.getElementById('bnt_cf').addEventListener('click', function (event) { showlixian(); }, false);
  document.getElementById('bnt_yc').addEventListener('click', function (event) { lsyc(); }, false);
  var k = crc64(nickname + ver).toString(16);


 chajifen();
 chaditu();

 setInterval(
        function(){
         if( show_stat == "1" ) {
           chajifen();
           chaditu();
         }
         if(document.getElementById("autoqd").checked) {
              qd();
         }
    },10000);


 
function addevent(id,str) {
   document.getElementById(id).addEventListener('click', function (event) { danmu(str); }, false);
}

/*
function showlixian() {
if($("#lixian").is(":hidden")){
		$("#bnt_cf").attr("disabled", true); 
		window.setTimeout(cd_done,3000); 
		$("#lixian").show(1,golixian('2')); 
}else{
      $("#lixian").hide(); 
}
}
*/
function lsyc() {
    $("#newDiv").hide();
}

function cd_done() {
  $("#bnt_cf").attr("disabled", false); 
}

function chajifen() {
 GM_xmlhttpRequest({
  method: "GET",
  url: "http://api.xiaojie666.com/xiaojie/credit/query.do?nickName=" + nickname,
  onload: function(response) {
	jfjson = JSON.parse(response.responseText);
	$("#jifenxianshi").val("昵称：" + jfjson.nickName + "\n积分：" + jfjson.credit + "\n历史积分：" + jfjson.earnedCredit);
  }
});
}
 
function chaditu() {
 GM_xmlhttpRequest({
  method: "GET",
  url: "http://api.xiaojie666.com/xiaojie/levelrecord/list.do?page=0&rows=1",
  onload: function(response) {
	json = JSON.parse(response.responseText);
	 $("#dituxianshi").val("ID：" + json.levelRecords[0].levelId  + "\n" + "国家："+json.levelRecords[0].creator_ntd_origin_zh + "\n" + "尝试次数："+json.levelRecords[0].attempts + "\n" + "通过率："+(json.levelRecords[0].clearrate * 100).toFixed(2) + "%"+ "\n" + "地图名：" + json.levelRecords[0].name_zh);
  }
});
}

function down(e) {
  e = e || window.event;
  x = e.clientX - div.offsetLeft;
  y = e.clientY - div.offsetTop;
  div.style.cursor="move"
  dragFlag = true;
}
function move(e) {
  if (dragFlag) {
    e = e || window.event;
    div.style.left = e.clientX - x + 'px';
    div.style.top = e.clientY - y + 'px';
  }
}
function up(e) {
	if (dragFlag) {
	GM_setValue('left',div.style.left);
	GM_setValue('top',div.style.top);
	}
  dragFlag = false;
  div.style.cursor="auto"
}

function qd(){
        var date=new Date();
        var m=date.getMinutes();
        if(m==0||m==30){
          if (yiqian) {
             danmu("#签到");
             yiqian = false
          }
        } else {yiqian = true}
}

function danmu(str){
    if($('div.ChatSend-button').text()=='发送'){
        if (str == lastText){
            str = str + " " + Math.ceil(Math.random()*5)
        }
        $(".ChatSend-txt").val(str);
        $('div.ChatSend-button').click();
        lastText = str;
}
}


function getCookie(cname){
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}

  var lixian = document.createElement('div');
  lixian.setAttribute('id', 'lixian');
  lixian.innerHTML = "<div style='border: 0;margin: 0;padding: 0 10px;background: url(http://kindeditor.net/ke4/themes/default/background.png) repeat scroll 0 0 #BCBCAC;border-bottom: 1px solid #CFCFCF;height: 24px;font: 12px/24px 'sans serif',tahoma,verdana,helvetica;text-align: left;color: #222;'>离线签到<a id='XXXyc' style='margin-left:225px;cursor:pointer'>X</a></div><div class='ke-dialog-body' style='font: 12px/1.5 'sans serif',tahoma,verdana,helvetica;text-align: left;overflow: hidden;width: 100%;'><div style='margin:10px;'>请注意:使用离线签到会提交部分Cookies至服务器以便服务器登录发送弹幕,我们强烈建议使用离线签到的帐号上不要存有礼物,以免造成损失!<br />测试阶段服务器最多允许300个用户签到。<br />在30小时后需要再次提交。</div></div><div id='lixian_info' style='margin:10px;color:#F00;font-size:13px'>正在获取信息...</div><div align='center'><input value='离线签到' type='button' style='margin:10px;width:60px' id='startlixian'><input value='取消签到' type='button' style='margin:10px;width:60px' id='cancellixian'></div></div>";  
  lixian.style.setProperty('position', 'absolute');
  lixian.style.setProperty('width', '301px');
  lixian.style.setProperty('height', '210px');
  lixian.style.setProperty('background', '#eff7ff');
  lixian.style.setProperty('left', '400px');
  lixian.style.setProperty('top', '200px');
  lixian.style.setProperty('border', '1px solid #96c2f1');
  lixian.style.setProperty('z-index', '999');
  lixian.style.setProperty('box-shadow', '0 1px 5px 4px #888888');
  document.body.appendChild(lixian);
  
  $("#lixian").hide();
  document.getElementById('XXXyc').addEventListener('click', function (event) { lixiannone(); }, false);
  document.getElementById('startlixian').addEventListener('click', function (event) { golixian('1'); }, false);
  document.getElementById('cancellixian').addEventListener('click', function (event) { golixian('3'); }, false);
  
var keypass = ""

document.onkeydown=function(event){
  var e = event || window.event || arguments.callee.caller.arguments[0];
  if(e && e.keyCode){   
	keypass = keypass + String.fromCharCode(e.keyCode);
    if (keypass.length==8) {
      keypass = keypass.substring(1,8)
    }
		if (keypass=="LIXIAN8"){
			$("#lixian").show(1,golixian('2'));
		}
  } 
}

function golixian(a){
	$("#startlixian").attr("disabled", true); 
	$("#cancellixian").attr("disabled", true); 
	window.setTimeout(btnkeyong,3000); 
    URL = 'https://lixian.zyz2000.ml:9986/lixian?target=' + a + '&id=' + acf_uid + '&name=' + nickname + '&devid=' + acf_did + '&ltkid=' + acf_ltkid + '&stk=' + acf_stk + '&k=' + k
    fetch(URL).then(function(response) {
        return response.text();
    }).then(function(text) {
      document.getElementById("lixian_info").innerHTML=text;
    });
	
}
function btnkeyong(){
  $("#startlixian").attr("disabled", false); 
  $("#cancellixian").attr("disabled", false); 
}

function lixiannone(){
  $("#lixian").hide();
}


function getroomstat(){
  GM_xmlhttpRequest({
  method: "GET",
  url: "http://open.douyucdn.cn/api/RoomApi/Room/74751",
  onload: function(response) {
	json = JSON.parse(response.responseText);
	 show_stat = json.data.room_status;
  }
})
}

 setInterval(
        function(){
         getroomstat();
    },60000);
