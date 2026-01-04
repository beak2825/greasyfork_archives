// ==UserScript==
// @name         自用脚本
// @namespace    http://119.91.99.233:8088/
// @version      1.1
// @description  寻路判断脚本
// @author       madnysky
// @match        http://119.91.99.233:8088/*
// @icon         https://www.google.com/s2/favicons?domain=99.233
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446128/%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/446128/%E8%87%AA%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    var ms ={};
    ms["初始大陆"] = ["东部矿坑,50,25","封魔谷,50,50","血色森林,0,50"]
    ms["盟重土城"] = ["镇妖塔一层,104,97","盟重矿区,98,97","祖玛寺庙一层,180,180"]
    ms["盟重矿区"] = ["盟重土城,0,0","小智,25,25"]
    ms["东部矿坑"] = ["初始大陆,0,20","矿坑北,20,0","矿坑东,40,20"]
    ms["矿坑北"] = ["东部矿坑,10,40","矿坑深处,10,0"]
    ms["矿坑深处"] = ["矿坑北,0,10"]
    ms["矿坑东"] = ["东部矿坑,0,10","神秘坑道,20,0"]
    ms["神秘坑道"] = ["矿坑东,0,1","神秘人,30,1"]
    ms["血色森林"] = ["初始大陆,30,0","血色之证,15,15","环境调查员,1,30"]
    ms["封魔谷"] = ["封魔战场,15,15","封魔矿区,0,15","盟重土城,30,30"]
    ms["封魔矿区"] = ["阴暗洞窟,0,25,1","封魔道,25,50"]
    ms["阴暗洞窟"] = ["封魔矿区,40,5","卡金宝宝,0,5"]
    //ms["封魔道"] = ["封魔道,0,30"]
    ms["封魔道"] = ["霸者大厅,0,30"]
    ms["封魔战场"] = ["终结之地,25,25","兽人锻造大师,50,25"]
    ms["终结之地"] = ["封魔战场,10,10","封魔谷,25,50"]
    ms["镇妖塔一层"] = ["镇妖塔二层,50,50"]
    ms["镇妖塔二层"] = ["镇妖塔三层,50,50"]
    ms["镇妖塔三层"] = ["镇妖塔四层,50,50"]
    ms["镇妖塔四层"] = ["镇妖塔五层,50,50"]
    ms["镇妖塔五层"] = ["镇妖塔六层,50,50"]
    ms["镇妖塔六层"] = ["镇妖塔七层,50,50"]
    ms["镇妖塔七层"] = ["镇妖塔八层,50,50"]
    ms["镇妖塔八层"] = ["镇妖塔九层,50,50"]
    ms["镇妖塔九层"] = ["镇妖塔十层,50,50"]
    ms["祖玛寺庙一层"] = ["祖玛寺庙二层,0,0"]
    ms["祖玛寺庙二层"] = ["祖玛寺庙三层,0,0","祖玛寺庙一层,20,20"]
    ms["祖玛寺庙三层"] = ["祖玛寺庙四层,0,0","祖玛寺庙二层,20,20"]
    ms["祖玛寺庙四层"] = ["祖玛寺庙五层,0,0","祖玛寺庙三层,30,30"]
    ms["祖玛寺庙五层"] = ["祖玛寺庙六层,0,0","祖玛寺庙四层,30,30"]
    ms["祖玛寺庙六层"] = ["祖玛寺庙七层,0,0","祖玛寺庙五层,30,30"]
    ms["祖玛寺庙七层"] = ["祖玛寺庙六层,10,10"]
    ms["霸者大厅"] = []

    var xls = ["5,5","95,5","95,15","5,15","5,25","95,25","95,35","5,35","5,45","95,45","95,55","5,55","5,65","95,65","95,75","5,75","5,85","95,85","95,95","5,95"];
    var idx = 0;
    unsafeWindow.xl = function xl(){
        //点击怪物
        byClass("ant-card-body")[3].getElementsByClassName("ant-tabs-tab")[1].click();
        setTimeout(xunluo(),800);
        setTimeout(refMonster(),800);
    }

    //巡逻镇妖塔
    function xunluo(){
        if(xls.length == idx){
            idx = 0;
            alert("巡逻完成");
            return;
        }
        var ips = byClass("ant-card-body")[2].getElementsByTagName("input");
        ips[0].value = xls[idx].split(",")[0];
        ips[0].dispatchEvent(new Event('input'));
        ips[1].value = xls[idx].split(",")[1];
        ips[1].dispatchEvent(new Event('input'));
        setTimeout(function(){
            var btns = byClass("ant-card-body")[2].getElementsByTagName("button");
            btns[btns.length-1].click();
        }, 500);
        if(idx < xls.length){
            idx++
        }
        var cs = [];
        cs.push([()=>{xunluo()},()=>{return byClass("carddd")[2].getElementsByClassName("ant-card-head-title")[0].innerText.split("：")[1] == xls[idx - 1]},2000]);
        ixx(cs,0);

    }

    //刷新怪物
    function refMonster(){
        var monster = byClass("ant-card-body")[3].getElementsByClassName("ant-list-item-meta-title");
         for(var i= 0;i<monster.length;i++){
             var mm = monster[i].innerText.split(" ")[1];
             console.log(mm);
             if(mm.indexOf("妖王") == 0){
                 setTimeout(function(){
                 var btns = byClass("ant-card-body")[2].getElementsByTagName("button");
                 btns[btns.length-1].click();
                 }, 500);
                 idx = 0;
                 return;
             }
         }
        setTimeout(refMonster,1000);
    }

    function byId(id){
        return document.getElementById(id);
    }
    function byClass(id){
        return document.getElementsByClassName(id);
    }
    // 寻路
    var DS = [];
    function depixx(target,now,idx){
        var base = [];
        if(idx>=0){
            base = DS[idx].slice();
        }
        Object.keys(ms).forEach(function (key) {
            var list = ms[key];
            for(var i = 0; i<list.length;i++){
                var b = false;
                for(var j=0;j<base.length;j++){
                    if(target == base[j].split(",")[0]){
                        b = true;
                    }
                }
                if(b){return}
                if(target == list[i].split(",")[0]){
                    var tmp = base.slice();
                    tmp.push(list[i]);
                    DS.push(tmp)
                    // 如果已经是当前地图
                    if( now == target){
                        return;
                    } else if(",初始大陆,封魔谷,盟重土城,".indexOf(key)>0){//判断key是不是传送石之地
                        DS[DS.length-1].push(key);
                        return;
                    }
                    depixx(key,now,DS.length-1);
                }
            }
        });
    }
    // 自动寻路
    unsafeWindow.autoGo = function autoGo(target,cb){
        byId("ixxmap").style.display='none';
        if(!target){return}
        DS=[];
        var now = byClass("carddd")[2].getElementsByClassName("ant-card-head-title")[0].innerText.split("：")[0];
        if(now == target){
            if(cb){
                cb();
            };
            return
        }
        depixx(target, now,-1);
        var steps =[];var minStep = 100000;
        for(var i=0;i<DS.length;i++){
            var list = DS[i];
            var last = list[list.length-1].split(",")[0];
            if(last == now || ",初始大陆,封魔谷,盟重土城,".indexOf(last)>0){
                if(list.length<minStep){
                    minStep = list.length;
                    steps = list;
                } else if(list.length == minStep && last == now){
                    minStep = list.length;
                    steps = list;
                }
            }
        }
        //console.log(steps)
        if(steps.length == 0){
            alert("呃...无法从"+now+"寻路到"+target);
            return;
        }
        if(target == "霸者大厅"){
            steps.splice(1, 0, "封魔道,0,30");
        }
        var st = steps.pop();
        // 如果最后是使用,分隔则说明是从当前地图可以直接过去，否则是使用传送石
        if(",初始大陆,封魔谷,盟重土城,".indexOf(st.split(",")[0]) < 0){// 不用使用
            autoZL(steps,cb);
        } else { // 使用传送
            if(now != target){
                var ret = unsafeWindow.chuansong(st.split(",")[0]+"回城石");
                if(!ret){return}
            }
            setTimeout(autoZL, 800, steps, cb);
        }
    }
    var ZDD = 0;
    // 自动走路
    function autoZL(steps,cb){
        ZDD = 0;
        var cs = [];
        var parent = "abc";
        for(var i=steps.length-1;i>=0;i--){
            var step = steps[i];
            cs.push(['()=>{unsafeWindow.gogo("'+step+'");}','()=>{var nows = byClass("carddd")[2].getElementsByClassName("ant-card-head-title")[0].innerText.split("：");var now = nows[0];if(now=="封魔道"&&"'+step+'".indexOf("霸者大厅")>=0){if(ZDD<8){ZDD++;console.log(ZDD);return false;}};console.log(now);if(!parent){return false;};return "'+parent+'" == "abc" || "'+parent+'".indexOf(now)>=0;}',1500])
            parent = step;
        }
        if(cb){
            cs.push([cb,,1500]);
        }
        setTimeout(ixx, 1000, cs, 0);
    }
    // cmds is [run, check, time, param]
    function ixx(cmds, i){
        var cmd = cmds[i]
        if(cmds.length<=i){
            return;
        }
        if(cmd[1] && !eval("("+cmd[1]+")()")){
            setTimeout(ixx, cmd[2], cmds, i);
            return;
        } else {
            eval("("+cmd[0]+")()");
            setTimeout(ixx, cmd[2], cmds, i+1);
        }
    }
    // 传送方法（使用传送石）
    unsafeWindow.chuansong = function chuansong(map){
        var goods = byClass("equip")[1].getElementsByClassName("ant-list-item ant-list-item-no-flex");
        for(var i= 0;i<goods.length;i++){
            var name = goods[i].innerText.split(" x")[0];
            if(map == name){
                goods[i].getElementsByTagName("a")[2].click();
                setTimeout(refMap,800);
                return 1;
            }
        }
        alert("没有"+map+"的传送石了！");
        return 0;
    }
    // 刷新可去地图
    function refMap(){
        // 现在的地图
        var txt = "";
        var now = byClass("carddd")[2].getElementsByClassName("ant-card-head-title")[0].innerText.split("：")[0];
        // 获取可以走过去的地图
        var nextmap = ms[now];
        if(nextmap){
            for(var i= 0; i<nextmap.length;i++){
                txt += "<button onclick='window.gogo(\""+nextmap[i]+"\",)'>"+nextmap[i].split(',')[0]+"</button>&nbsp;"
            }
        }
        byId("mv").innerHTML = txt;
    }
    // 去下一个地图
    unsafeWindow.gogo = function gogo(nextmap){
        byClass("ant-card-body")[3].getElementsByClassName("ant-tabs-tab")[0].click();
        var nexts = nextmap.split(",");
        // 设置坐标
        var ips = byClass("ant-card-body")[2].getElementsByTagName("input");
        ips[0].value = nexts[1];
        ips[0].dispatchEvent(new Event('input'));
        ips[1].value = nexts[2];
        ips[1].dispatchEvent(new Event('input'));
        setTimeout(function(){
            var btns = byClass("ant-card-body")[2].getElementsByTagName("button");
            btns[btns.length-1].click();
        }, 500);
        var btnidx = 0;
        if(nexts.length==4){
            btnidx = nexts[3];
        }
        var cs = [];
        cs.push([()=>{byClass("ant-card-body")[3].getElementsByClassName("ant-list-item")[0].getElementsByTagName("a")[1].click();},'()=>{return byClass("carddd")[2].getElementsByClassName("ant-card-head-title")[0].innerText.split("：")[1] == "'+nexts[1]+','+nexts[2]+'"}',1000]);
        cs.push([()=>{},()=>{return byClass("ant-modal-content").length>0},100])
        cs.push(['()=>{byClass("ant-modal-content")[0].getElementsByTagName("button")['+btnidx+'].click();}',()=>{return byClass("ant-modal-content").length>0},300])
        cs.push([()=>{refMap()},()=>{return byClass("ant-modal-content").length==0},300]);
        ixx(cs,0);
    }
    // 挖宝
    unsafeWindow.wb = function wb(){
        // 查询日志
        var now = byClass("carddd")[2].getElementsByClassName("ant-card-head-title")[0].innerText.split("：")[0];
        var logs = byClass("ant-drawer-body")[0].getElementsByTagName("p");
        if(logs.length>0 && logs[logs.length-1].innerText.split("藏宝图上的坐标位于").length>1){
            var log = logs[logs.length-1].innerText.split("藏宝图上的坐标位于");
            var target = log[1].split("的")[0];
            if(now != target){
                setTimeout(wb, 1000);
                return;
            }
            var xy = log[1].split("的")[1];
            var x = xy.split(",")[0];
            var y = xy.split(",")[1];
            // 设置坐标
            var ips = byClass("ant-card-body")[2].getElementsByTagName("input");
            ips[0].value = x;
            ips[0].dispatchEvent(new Event('input'));
            ips[1].value = y;
            ips[1].dispatchEvent(new Event('input'));
            setTimeout(function(){
                var btns = byClass("ant-card-body")[2].getElementsByTagName("button");
                btns[btns.length-1].click();
            }, 500);
            var cs = [];
            cs.push([()=>{
                 // 点使用
                var goods = byClass("equip")[1].getElementsByClassName("ant-list-item ant-list-item-no-flex");
                for(var i= 0;i<goods.length;i++){
                    var name = goods[i].innerText.split(" x")[0];
                    if("藏宝图" == name){
                        goods[i].getElementsByTagName("a")[2].click();
                        setTimeout(wbs,1500);
                        return;
                    }
                }
            },'()=>{return byClass("carddd")[2].getElementsByClassName("ant-card-head-title")[0].innerText.split("：")[1] == "'+xy+'"}',1000]);
            ixx(cs,0);
        } else {
            // 点使用
            var goods = byClass("equip")[1].getElementsByClassName("ant-list-item ant-list-item-no-flex");
            for(var i= 0;i<goods.length;i++){
                var name = goods[i].innerText.split(" x")[0];
                if("藏宝图" == name){
                    goods[i].getElementsByTagName("a")[2].click();
                    return;
                }
            }
            alert("没有藏宝图了！");
        }
    }
    // 寻路地图
    unsafeWindow.wbs = function wbs(){
        // 点使用
        var goods = byClass("equip")[1].getElementsByClassName("ant-list-item ant-list-item-no-flex");
        for(var i= 0;i<goods.length;i++){
            var name = goods[i].innerText.split(" x")[0];
            if("藏宝图" == name){
                goods[i].getElementsByTagName("a")[2].click();
                setTimeout(function(){
                    var logs = byClass("ant-drawer-body")[0].getElementsByTagName("p");
                    if(logs.length>0 && logs[logs.length-1].innerText.split("藏宝图上的坐标位于").length>1){
                        var log = logs[logs.length-1].innerText.split("藏宝图上的坐标位于");
                        var target = log[1].split("的")[0];
                        unsafeWindow.autoGo(target, unsafeWindow.wb);
                    }
                },1500);
                return;
            }
        }
        alert("没有藏宝图了！");

    }
    // 升级时间显示
    function upLevel(){
        //console.log("upup...");
        var title = byClass("ant-tabs-tabpane ant-tabs-tabpane-active")[0].getElementsByTagName("p")[3].getAttribute("title")
        if(title){
            var all = title.split("/")[1];
            var now = title.split("/")[0];
            var xl =  byClass("ant-tabs-tabpane ant-tabs-tabpane-active")[0].getElementsByTagName("p")[4].innerText.split("：")[1];
            xl = xl.split("/")[0];
            var txt = "";
            if(xl>0) {
                var mins = (all-now)/xl;
                if(mins>60){
                    mins = mins/60;
                    txt += mins.toFixed(2)+"小时";
                } else {
                    txt += mins.toFixed(2)+"分钟";
                }
            }
            byId("levelUp").innerHTML=txt;
        }
    }

    function init(){
        var href = window.location.href;
        if( href.indexOf("login")>0){
            setTimeout(init,1500);
            return;
        }
        // 切换物品
        byClass("ant-card ant-card-bordered carddd")[1].getElementsByClassName("ant-tabs-tab")[1].click();
        var name = byClass("ant-card-head")[0];
        var html = "<div>";
        html += "<div id='ixxmap' style='display:none;position: fixed; left: 200px; top: 10px;z-index:9999; width: 300px; background: #aaa;'>";
        Object.keys(ms).forEach(function (key) {
            html += "<button style='margin-bottom:6px;margin-right:6px;' onclick='window.autoGo(\""+key+"\")'>"+key+"</button>";
        });
        html += "<button onclick='window.autoGo()'>关闭</button></div>";
        html += "<div style='font-size:12px;margin-bottom:6px;'>镇妖塔巡逻：<button onclick='window.xl()'>巡逻</button></div>";
        html += "<div style='font-size:12px;margin-bottom:6px;'>传送：<button onclick='window.chuansong(\"初始大陆回城石\");'>初始大陆</button>&nbsp;<button onclick='window.chuansong(\"封魔谷回城石\");'>封魔谷</button>&nbsp;<button onclick='window.chuansong(\"盟重土城回城石\");'>盟重土城</button>&nbsp;</div>";
        html += "<div style='font-size:12px;margin-bottom:6px;'><a href='javascript:window.refMap()'>移动</a>：<span id='mv'></span></div>";
        html += "<div style='font-size:12px;margin-bottom:6px;'>其他：<button onclick=\"document.getElementById('ixxmap').style.display='';\">寻路</button>&nbsp;&nbsp;<button onclick='window.wbs()'>自动挖宝</button>&nbsp;&nbsp;<button onclick='window.wb()'>手动挖宝</button></div>";
        html += "</div>";
        name.innerHTML += html;
        refMap();
        //setInterval(upLevel, 5000);
        // 点击日志
        byClass("ant-card-body")[4].getElementsByTagName("a")[0].click();
        setTimeout(function(){byClass("ant-drawer-close")[0].click();}, 800);
        unsafeWindow.refMap = refMap;

    }
    console.log("init...");
    setTimeout(init,1500);
})();