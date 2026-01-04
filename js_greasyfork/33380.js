// ==UserScript==
// @description 快速下注，自动签到，查积分，地图通过率
// @icon https://apic.douyucdn.cn/upload/avatar/002/86/30/15_avatar_big.jpg
// @name 斗鱼超级小桀小工具
// @version 1.3.2
// @match https://www.douyu.com/74751
// @match https://www.douyu.com/cave
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @connect xiaojie666.com
// @connect douyucdn.cn
// @namespace https://greasyfork.org/users/153423
// @downloadURL https://update.greasyfork.org/scripts/33380/%E6%96%97%E9%B1%BC%E8%B6%85%E7%BA%A7%E5%B0%8F%E6%A1%80%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/33380/%E6%96%97%E9%B1%BC%E8%B6%85%E7%BA%A7%E5%B0%8F%E6%A1%80%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

//个人习惯优化了一下.主要是不会自动刷新.改成每次发弹幕后.积分变化了才刷新当前积分..去掉了离线签到...感谢原作者的代码~~~
//原作者地址.https://greasyfork.org/users/142968

var dragFlag = false;
var x,y;
var yiqian = true;
var lastText = "";
var nickname = getCookie('acf_nickname');
var ver = "1.3.2";
var zhibo_ing = 0 ;

var div = document.createElement('div');
div.setAttribute('id', 'newDiv');
div.addEventListener('mousedown', down, false);
document.addEventListener('mousemove', move, false);
document.addEventListener('mouseup', up, false);
div.innerHTML = "<input type=\'button\' id=\'bnt_qyl1\' style='width:90px;margin-top:10px;margin-left:7px' value=\'#1 全压了\'><input type=\'button\' id=\'bnt_qyl2\' style='width:90px;margin-left:7px' value=\'#2 全压了\'><input type=\'button\' id=\'bnt_yyb1\' style='width:90px;margin-top:2px;margin-left:7px' value=\'#1 压一半\'><input type=\'button\' id=\'bnt_yyb2\' style='width:90px;margin-left:7px' value=\'#2 压一半\'><input type=\'button\' id=\'bnt_xxlb\' style='width:90px;margin-top:2px;margin-left:7px' value=\'#谢谢老板\'><input type=\'button\' id=\'bnt_qd\' style='width:90px;margin-left:7px' value=\'#入团\'><input type=\'button\' id=\'bnt_sx\' style='width:90px;margin-top:2px;margin-left:7px' value=\'更新一下\'><span style='font-size:14px'><input class='magic-checkbox' type='checkbox' checked='checked' id='autoqd' style='margin-top:2px;margin-left:20px';>&nbsp自动签到</span><textarea id='jifenxianshi'  style='margin-top:7px;height:50px;width:177px;margin-left:7px;line-height:12pt;overflow:hidden' readonly='value'></textarea><textarea id='dituxianshi'  style='margin-top:7px;height:112px;width:177px;margin-left:7px;line-height:12pt;overflow:hidden' readonly='value'></textarea>";
div.style.setProperty('position', 'absolute');
div.style.setProperty('width', '201px');
div.style.setProperty('height', '308px');
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
    $("#bnt_sx").css("margin-top","5px");
    $("#jifenxianshi").css("margin-top","9px");
}
div.style.left = GM_getValue('left','960px');
div.style.top = GM_getValue('top','10px');

var arr=new Array("bnt_qyl1","bnt_qyl2","bnt_yyb1","bnt_yyb2","bnt_xxlb","bnt_qd","#1 老子全压了","#2 老子全压了","#1 老子压一半","#2 老子压一半","#谢谢老板","#入团");

for (var i=0;i<6;i++)
{
    addevent(arr[i],arr[i+6]);
}

document.getElementById('bnt_sx').addEventListener('click', function (event) { chajifen();  chaditu(); }, false);

// chajifen();

cha_zhibo();


setInterval(
    function(){
       if(zhibo_ing == 1){
       chaditu();
       }
        // chaditu();
        if(document.getElementById("autoqd").checked) {
            qd();
        }
    },6666);


function addevent(id,str) {
    document.getElementById(id).addEventListener('click', function (event) { danmu(str); }, false);
}


function down(e) {
    e = e || window.event;
    x = e.clientX - div.offsetLeft;
    y = e.clientY - div.offsetTop;
    div.style.cursor="move";
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
    div.style.cursor="auto";
}


function qd(){
    var date=new Date();
    var m=date.getMinutes();
    var h =date.getHours();
    if( m==0 || m==30){
        if (yiqian) {
            danmu("#签到 " + h + ":" + m + " 小桀v587");
            yiqian = false;
        }
    } else {yiqian = true;}
}


function danmu(str){
    if($('div.b-btn').html() == '发送'){
        if (str == lastText){
            str = str + " " + Math.ceil(Math.random()*1);
        }
        $(".cs-textarea").val(str);
        $('div.b-btn').click();
        lastText = str;
        setTimeout(chajifen,5000);
        setTimeout(chajifen,10000);
    }
}


function chajifen() {
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://api.xiaojie666.com/xiaojie/credit/query.do?nickName=" + nickname,
        onload: function(response) {
            jfjson = JSON.parse(response.responseText);
            $("#jifenxianshi").val("昵称：" + jfjson.nickName + "\n积分：" + jfjson.credit + "\n历史积分：" + jfjson.maxCredit);
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


function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) {
            return c.substring(name.length);
        }
    }
    return "";
}

function cha_zhibo() {
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://open.douyucdn.cn/api/RoomApi/room/74751",
        onload: function(response) {
            json = JSON.parse(response.responseText);
            // $("#dituxianshi").val("状态：" + json.data.room_status);
            zhibo_ing = json.data.room_status ;
        }
    });
}
