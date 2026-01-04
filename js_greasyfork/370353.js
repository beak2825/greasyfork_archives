// ==UserScript==
// @name         Eureka Tracker zh-CN Toolbox
// @namespace    https://ffxiv-eureka.com
// @version      1.70
// @description  Toolbox of zh-CN to ffxiv-eureka
// @author       Bluefissure
// @match        https://ffxiv-eureka.com/*
// @match        https://eureka.bluefissure.com/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/370353/Eureka%20Tracker%20zh-CN%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/370353/Eureka%20Tracker%20zh-CN%20Toolbox.meta.js
// ==/UserScript==
var style_btn = 'float:center;background:rgba(228,228,228,0.4); cursor:pointer; margin:0px 1px 0px 0px; padding:0px 3px;color:black; border:2px ridge black;border:2px groove black;';
var style_win_top = 'z-index:998; padding:6px 10px 8px 15px;background-color:lightGrey;position:fixed;left:5px;top:5px;border:1px solid grey; ';
var style_win_buttom = 'z-index:998; padding:6px 10px 8px 15px;background-color:lightGrey;position:fixed;right:5px;bottom:5px;border:1px solid grey;  ';
function requestdwz(raw_url){
    GM_xmlhttpRequest({
        method: "GET",
        url: 'http://suo.im/api.php?url='+encodeURIComponent(raw_url),
        headers: {
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36",
            'referer': '',
            'Cookie': document.cookie
        },
        onload: function(response) {
            // console.log(response);
            document.selfurl = response.responseText;
        }
    });
}
function sync_ffxivsc_nm(record, instanceID, password){
    // console.log(instanceID);
    // console.log(password);
    var date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth()+1,
    datec = date.getDate(),
    str_date = year+"-"+month+"-"+datec+" "
    record = record.replace(str_date,"")
    var nmlist = {
            "仙人掌": 1,
            "章鱼": 2,
            "忒勒斯": 3,
            "蜻蜓": 4,
            "巨熊": 5,
            "群偶": 6,
            "哲罕南": 7,
            "阿米特": 8,
            "盖因": 9,
            "庞巴德": 10,
            "皮皮虾": 11,
            "茉莉卡": 12,
            "白骑士": 13,
            "独眼": 14,
            "西牟鸟": 15,
            "肥宅": 16,
            "法夫纳": 17,
            "阿玛洛克": 18,
            "嫂子": 19,
            "帕祖祖": 20,
            "雪之女王": 21,
            "塔克西姆": 22,
            "灰烬龙": 23,
            "异形魔虫": 24,
            "安娜波": 25,
            "白泽": 26,
            "雪屋王": 27,
            "阿萨格": 28,
            "苏罗毗": 29,
            "亚瑟罗王": 30,
            "牛头魔": 31,
            "圣牛": 32,
            "哈达约什": 33,
            "荷鲁斯": 34,
            "安哥拉曼纽": 35,
            "魔花凯西": 36,
            "娄希": 37,
            "琉科西亚": 38,
            "佛劳洛斯": 39,
            "诡辩者": 40,
            "格拉菲亚卡内": 41,
            "阿斯卡拉福斯": 42,
            "巴钦大公爵": 43,
            "埃托洛斯": 44,
            "来萨特": 45,
            "火巨人": 46,
            "伊丽丝": 47,
            "哥布林": 48,
            "闪电督军": 49,
            "垂柳树人": 50,
            "明眸": 51,
            "阴·阳": 52,
            "斯库尔": 53,
            "彭忒西勒亚": 54,
            "卡拉墨鱼": 55,
            "剑齿象": 56,
            "摩洛": 57,
            "皮克萨": 58,
            "霜鬃": 59,
            "达佛涅": 60,
            "戈尔德马王": 61,
            "鲁尔克": 62,
            "琉刻": 62,
            "巴隆": 63,
            "刻托": 64,
            "起源观察者": 65,
        };
    var ws = new WebSocket("wss://"+window.location.host+"/socket/websocket?vsn=2.0.0");
    ws.onopen = function(evt) {
            var msg = '["1","1","instance:'+instanceID+'","phx_join",{"password":"'+password+'"}]';
            // console.log(msg);
            ws.send(msg);
            var tmp_record = record;
            var re = /(\(\d+\)(?<name>([\u4e00-\u9fa5·])+)+\[(?<time>(\d+分|\d+\:\d+))\])/g;
            var result = re.exec(tmp_record);
            while(result!=null){
                var name = result.groups.name;
                var str_time = result.groups.time;
                var id = nmlist[name];
                if(id==null){
                    console.error("无法匹配NM名称："+name);
                }else{
                    if(str_time.indexOf("分") >= 0){
                        var time_ago = 120 - parseInt(str_time.replace("分",""));
                        var time = Date.now() - (time_ago*60*1000);
                        msg = '["1","2","instance:'+instanceID+'","set_kill_time",{"id":'+id+',"time":'+time+'}]';
                        ws.send(msg);
                    }else if(str_time.indexOf(":") >= 0){
                        var segs = str_time.split(":");
                        var hour = segs[0];
                        var minute = segs[1];
                        var d = new Date();
                        d.setHours(hour);
                        d.setMinutes(minute);
                        d.setSeconds(0);
                        var time = d.getTime();
                        msg = '["1","2","instance:'+instanceID+'","set_kill_time",{"id":'+id+',"time":'+time+'}]';
                        ws.send(msg);
                    }
                }
                // console.log(result.groups);
                result = re.exec(tmp_record);
            }
            ws.close();
        };


}
(function() {
    'use strict';
    // Your code here...

    document.nmstatus={};
    var newDiv = document.createElement("div");
    newDiv.id = "controlWindow";
    newDiv.align = "left";
    document.body.appendChild(newDiv);
    GM_addStyle("#controlWindow{" + style_win_top + " }");
    var table = document.createElement("table");
    newDiv.appendChild(table);
    var th = document.createElement("th");
    th.id = "headTd";
    var thDiv = document.createElement("span");
    thDiv.id = "thDiv";
    thDiv.innerHTML = "Tracker Toolbox";
    GM_addStyle("#thDiv{color:red;font-size: 12pt;}");
    th.appendChild(thDiv);
    table.appendChild(th);
    var tr = document.createElement("tr");
    table.appendChild(tr);
    var td = document.createElement("td");
    td.id = "footTd";
    tr.appendChild(td);
    var ffxivsc = document.createElement("span");
    ffxivsc.id = "ffxivsc";
    ffxivsc.innerHTML = "同步ffxivsc";
    ffxivsc.addEventListener("click", function () {
        var tids = document.getElementsByClassName("tracker-id");
        if(tids.length < 3){
            alert("无法获取密码，请输入密码后重试。")
        }else{
            var instanceID = tids[0].textContent;
            var password = tids[1].textContent;
            var record = prompt("请输入ffxivsc的记录","(1)科里多仙人刺[--:--] (2)常风领主[--:--] ...");
            sync_ffxivsc_nm(record, instanceID, password);
        }
    });
    td.appendChild(ffxivsc);
    GM_addStyle("#ffxivsc{" + style_btn + "}");

    var br = document.createElement("br");
    td.appendChild(br);

    var actlink = document.createElement("span");
    actlink.id = "actlink";
    actlink.innerHTML = "获取ACT上报";
    actlink.addEventListener("click", function () {
        var tids = document.getElementsByClassName("tracker-id");
        if(tids.length < 3){
            alert("无法获取密码，请输入密码后重试。")
        }else{
            var instanceID = tids[0].textContent;
            var password = tids[1].textContent;
            var link = 'https://xn--v9x.net/api/?tracker=ffxiv-eureka&instance='+instanceID+'&password='+password;
            var record = prompt("ACTFate插件上报地址如下：", link);
        }
    });
    td.appendChild(actlink);
    GM_addStyle("#actlink{" + style_btn + "}");

    br = document.createElement("br");
    td.appendChild(br);

    var close = document.createElement("span");
    close.id = "close";
    close.innerHTML = "关闭脚本";
    close.addEventListener("click", function () {
        document.body.removeChild(document.getElementById("controlWindow"));
        clearInterval(document.clock);
    }, false);
    td.appendChild(close);
    GM_addStyle("#close{" + style_btn + "}");


})();

