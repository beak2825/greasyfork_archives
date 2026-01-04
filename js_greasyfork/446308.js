// ==UserScript==
// @name         匿名修仙小帮手
// @namespace
// @version      1.0
// @description  匿名修仙小帮手，走起！！！
// @author       iuv@喝水
// @match        *://*.nimingxx.com/*
// @match        *://nimingxx.com/*
// @icon         https://www.google.com/s2/favicons?domain=nimingxx.com
// @grant        unsafeWindow
// @license      MIT
// @namespace https://nimingxx.com
// @downloadURL https://update.greasyfork.org/scripts/446308/%E5%8C%BF%E5%90%8D%E4%BF%AE%E4%BB%99%E5%B0%8F%E5%B8%AE%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446308/%E5%8C%BF%E5%90%8D%E4%BF%AE%E4%BB%99%E5%B0%8F%E5%B8%AE%E6%89%8B.meta.js
// ==/UserScript==
var ixx = window;
(function() {
    'use strict';
    var m = [];
    m["四季山"]=["陨真禁地"];
    m["陨真禁地"]=["飞羽林","四季山"];
    m["飞羽林"]=["阳城驿站","陨真禁地"];
    m["阳城驿站"]=["飞羽林","阳城"];
    m["阳城"]=["阳城驿站","黑森林"];
    m["黑森林"]=["阳城","红叶林","追风谷"];
    m["红叶林"]=["黑森林"]
    m["追风谷"]=["黑森林","林中栈道"];
    m["林中栈道"]=["追风谷","聚灵城","长树林海","洛月驿站"];
    m["聚灵城"]=["林中栈道"];
    m["长树林海"]=["林中栈道"];
    m["洛月驿站"]=["林中栈道","黑芦森林","碧炎山脉"];
    m["黑芦森林"]=["洛月驿站","黑芦沼泽"];
    m["黑芦沼泽"]=["黑芦森林","沼影岭"];
    m["沼影岭"]=["黑芦沼泽","阴冥界"];
    m["青冥江"]=["阴冥界"];
    m["阴冥界"]=["沼影岭","青冥江"];
    m["碧炎山脉"]=["洛月驿站","炽焰火山","通天道"];
    m["炽焰火山"]=["碧炎山脉","冰莲青湖"];
    m["冰莲青湖"]=["炽焰火山","冰神禁地","青灵城","云凤平原"];
    m["冰神禁地"]=["冰莲青湖","冰神宫"];
    m["冰神宫"]=["冰神禁地"];
    m["青灵城"]=["冰莲青湖","黑市驿站","丹城"];
    m["黑市驿站"]=["青灵城","黑市","丹城"];
    m["黑市"]=["黑市驿站"];
    m["丹城"]=["黑市驿站","青灵城","云凤平原"];
    m["云凤平原"]=["丹城","冰莲青湖","云溪灵湖","云天山峰"];
    m["云溪灵湖"]=["云凤平原","海灵宫","云天山峰"];
    m["海灵宫"]=["云溪灵湖"];
    m["云天山峰"]=["云溪灵湖","云凤平原","无极峰","落樱山脉"];
    m["无极峰"]=["云天山峰","无极宗"];
    m["无极宗"]=["无极峰","镇仙塔"];
    m["镇仙塔"]=["无极宗"];
    m["落樱山脉"]=["云天山峰","凌云山脉","通天道"];
    m["凌云山脉"]=["落樱山脉","凌云剑阁"];
    m["凌云剑阁"]=["凌云山脉"];
    m["通天道"]=["落樱山脉","碧炎山脉","九幽前路"];
    m["九幽前路"]=["通天道","九幽殿"];
    m["九幽殿"]=["九幽前路","九幽后峰"];
    m["九幽后峰"]=["九幽殿"];
    var maps = [];
    maps.push(['四季山','','青冥江','阴冥界','','','','','',''])
    maps.push(['陨真禁地','飞羽林','','沼影岭','','九幽后峰','','','',''])
    maps.push(['','阳城驿站','红叶林','黑芦沼泽','','九幽殿','凌云剑阁','','',''])
    maps.push(['','阳城','黑森林','黑芦森林','','九幽前路','凌云山脉','','',''])
    maps.push(['','','追风谷','','','','','','',''])
    maps.push(['','聚灵城','林中栈道','洛月驿站','碧炎山脉','通天道','落樱山脉','','',''])
    maps.push(['','','长树林海','','炽焰火山','','云天山峰','无极峰','无极宗','镇仙塔'])
    maps.push(['','','冰神禁地','冰莲青湖','云凤平原','云溪灵湖','','','',''])
    maps.push(['','','','冰神宫','青灵城','丹城','海灵宫','','',''])
    maps.push(['','','','','','黑市驿站','','','',''])
    maps.push(['','','','','','黑市','','','','关闭'])
    var ls={"聚灵城":0,
            "林中栈道":1,
            "追风谷":2,
            "洛月驿站":3,
            "黑芦森林":4,
            "黑芦沼泽":5,
            "沼影岭":6,
            "阴冥界":7,
            "碧炎山脉":8,
            "通天道":9,
            "九幽前路":10,
            "九幽殿":11,
            "九幽后峰":12,
            "落樱山脉":13,
            "凌云山脉":14,
            "凌云剑阁":15,
            "炽焰火山":16,
            "冰莲青湖":17,
            "云凤平原":18,
            "云天山峰":19,
            "云溪灵湖":20,
            "海灵宫":21,
            "无极峰":22,
            "无极宗":23,
            "镇仙塔":24,
            "冰神禁地":25,
            "冰神宫":26,
            "青灵城":27,
            "黑市驿站":28,
            "黑市":29,
            "丹城":30,
            "长树林海":31,
            "黑森林":32,
            "红叶林":33,
            "阳城":34,
            "阳城驿站":35,
            "飞羽林":36,
            "陨真禁地":37,
            "四季山":38,
            "青冥江":40
    }
    function byId(id){
        return document.getElementById(id);
    }
    function byClass(id){
        return document.getElementsByClassName(id);
    }
    // 寻路算法
    unsafeWindow.ixxdep = function dep(parent, now ,target){
        var list = m[now];
        var stepNum = 0;
        var next = [];
        for(var i=0;i<list.length;i++){
            var l = list[i]
            if(!parent.includes(l)){
                if(target == l){
                    return [target]
                }
                var tmpParent = Array.from(parent);
                tmpParent.push(l)
                var ret = unsafeWindow.ixxdep(tmpParent, l, target);
                var subStepNum = ret.length;
                if((stepNum == 0 && subStepNum >0) || (subStepNum >0 && subStepNum < stepNum)){
                    stepNum = subStepNum;
                    ret.push(l);
                    next = ret
                }
            }
        }
        return next
    }
    var RET = [];
    // 寻人
    unsafeWindow.ixxgogogo = function gogogo(){
        // 获取下拉选择目标
        var target = byId("gogogo").value;
        if(target == ""){return}
        unsafeWindow.ixxgobase(target);
    }

    // 切换地图基本方法, cb为切换到地图后回调函数
    unsafeWindow.ixxgobase = function gobase(target, cb){
        // 隐藏寻路
        byId("ixxmap").style.display="none";
        if(target == ""){
            if(cb){
                setTimeout(cb, 500);
            }
            return;
        }
        // 判断切换地标签
        var areaBlock = byClass("area-block");
        if(areaBlock.length<=0){
            var tabs = byClass("n-tabs-tab");
            for(var i=0;i<tabs.length;i++){
                if(tabs[i].innerText=="地图"){
                    tabs[i].click();
                    setTimeout(unsafeWindow.ixxgobase,500,target,cb)
                }
            }
        }
        // 获取当前所在地图
        var now = byClass("area-block")[0].innerText.split(":")[2].split("\n")[0];
        var ret = unsafeWindow.ixxdep([now],now,target);
        // 如果开启速力版本，则大于设定的步数使用传送
        var SL = byId("ixxsl").value;
        if(ret.length > SL){
            // 点传送
            byClass("area-block")[1].getElementsByTagName("button")[0].click();
            setTimeout(function(target){byClass("svg-panel")[1].getElementsByTagName("rect")[ls[target]].dispatchEvent(new Event('click'))},300,target)
            setTimeout(cb, 1000);
            return;
        }
        RET = ret;
        // 倒序走
        setTimeout(function(){unsafeWindow.ixxgo(cb)}, 500);
    }
    // 定时走路，等待场景切换
    unsafeWindow.ixxgo = function go(cb){
        if(RET.length<=0){
            if(cb){
                setTimeout(cb, 100);
            }
            return
        }
        // 获取当前所在地图
        var now = byClass("area-block")[0].innerText.split(":")[2].split("\n")[0];
        var next = RET[RET.length-1];
        if(now == next){
            RET.pop();
            if(RET.length<=0){
                // 如果有回调函数，则执行
                if(cb){
                    setTimeout(cb, 100);
                }
                return
            }
            next = RET[RET.length-1];
        }
        console.log("go:"+next);
        byClass("svg-panel")[0].getElementsByTagName("rect")[ls[next]].dispatchEvent(new Event('click'));
        setTimeout(function(){unsafeWindow.ixxgo(cb)}, 1100);
    }
    // 停止走路
    unsafeWindow.ixxstop = function stop(){
        RET = []
    }
    function checkTaskDone(key){
        var tasks = byClass("user-task-info");
        var status = true;
        for(var i=0;i<tasks.length;i++){
            if(tasks[i].innerText.indexOf(key)>=0){
                status = false;
            }
        }
        // 没有任务说明已达上限
        return status;
    }
    // 找药灵
    unsafeWindow.ixxyao = function yao(){
        // 显示任务详情
        showTaskDetail("采药");
        console.log("go yao");
        var status = checkTaskDone("采药");
        // 没有任务说明已达上限
        if(status){return}
        var list = byClass("task-info");
        if(list && list.length>0){
            for(var j=0; j<list.length; j++){
                var name = list[j].innerText.trim();
                if(name.indexOf("击败 药灵")>0){
                    name = name.split("】")[0].split("【")[1];
                    console.log(name);
                    unsafeWindow.ixxgobase(name, unsafeWindow.ixxautoyao, j);
                    return;
                }
            }
        }
        setTimeout(unsafeWindow.ixxyao, 1000);
    }
    // 打药灵
    unsafeWindow.ixxautoyao = function autoyao(){
        // 显示任务详情
        showTaskDetail("采药");
        var ixxid = "";
        var list = byClass("n-row scene-p");
        var taskList = byClass("t-info");
        for(var j=0; j<taskList.length; j++){
            var name = taskList[j].innerText.trim();
            if(name.indexOf("药灵")>0){
                ixxid = name.split("药灵")[1].split("\n")[0];
            }
        }
        console.log("去打药灵"+ixxid);
        for( var i= 0; i< list.length; i++){
            if(list[i].innerText.indexOf("药灵"+ixxid)>=0){
                list[i].getElementsByTagName("svg")[0].dispatchEvent(new Event('click'));
                setTimeout(function(){unsafeWindow.ixxautodancheng(100)},800);
            }
        }
    }

    // 自动回丹城
    unsafeWindow.ixxautodancheng = function autodancheng(num){
        if(num<=0){return}
        num = num-1;
        console.log("自动判断药灵是否被击败，击败回丹城接任务");
        var status = checkTaskDone("采药");
        // 如果有任务等待，没有任务回丹城
        if(status){
            unsafeWindow.ixxgobase("丹城", unsafeWindow.ixxgetyao);
        } else {
            setTimeout(function(){unsafeWindow.ixxautodancheng(num)},800);
        }
    }
    // 回丹城
    unsafeWindow.ixxdancheng = function dancheng(){
        console.log("回丹城接任务");
        unsafeWindow.ixxgobase("丹城", unsafeWindow.ixxgetyao);
    }

    // 接药灵任务
    unsafeWindow.ixxgetyao = function getyao(){
        getTaskBase(0,unsafeWindow.ixxyao);
    }
    // 添加X10，X20, X50使用按钮
    unsafeWindow.ixxbatch = function batch(num){
        var list = byClass("n-popover n-tooltip n-popover--show-arrow");
        var txt = byId("ixxuselist").value;
        for( var i= 0; i< list.length; i++){
            if(list[i].getElementsByTagName("p").length>0){
                var t = list[i].getElementsByTagName("p")[0].innerText;
                if(txt == t){
                    var usebtn = list[i].getElementsByTagName("button")[0];
                    setTimeout(function(){unsafeWindow.ixxbatchbase(usebtn,num)},600);
                }
            }
        }
    }
    // 批量使用基础方法
    unsafeWindow.ixxbatchbase = function batchbase(usebtn, num){
        console.log("批量使用第"+num+"个");
        if(num<=0){return}
        usebtn.click();
        num = num-1;
        setTimeout(function(){unsafeWindow.ixxbatchbase(usebtn,num)},600);
    }
    // 刷新批量使用列表
    unsafeWindow.ixxuselist = function ueslist(){
        var list = byClass("n-popover n-tooltip n-popover--show-arrow");
        var options = "";
        for( var i= 0; i< list.length; i++){
            var btns = list[i].getElementsByTagName("button");
            if(btns.length > 0 && (btns[0].innerText == "使用" || btns[0].innerText == "鉴定")){
                var t = list[i].getElementsByTagName("p")[0].innerText;
                options += "<option value='"+t+"'>"+t+"</option>"
            }
        }
        byId("ixxuselist").innerHTML = options;
    }
    // 接降妖任务
    unsafeWindow.ixxGetXy = function getXy(){
        getTaskBase(1,unsafeWindow.ixxGoXy);
    }
    // 找妖兽
   unsafeWindow.ixxGoXy = function goXy(){
       // 显示任务详情
       showTaskDetail("降妖");
       console.log("去找妖兽");
       var status = checkTaskDone("降妖");
       // 没有降妖任务说明已达上限
       if(status){
           return;
       }
       var list = byClass("t-info");
       if(list && list.length>0){
           for(var j=0; j<list.length; j++){
               var name = list[j].innerText.trim();
               if(name.indexOf("击败 妖兽")>0){
                   name = name.split("】")[0].split("【")[1];
                   console.log(name);
                   unsafeWindow.ixxgobase(name, unsafeWindow.ixxAutoXy);
                   return;
               }
           }
       }
       setTimeout(unsafeWindow.ixxGoXy, 1000);
    }
    // 自动打妖兽
    unsafeWindow.ixxAutoXy = function autoXy(t){
        // 特殊处理切换到地图页面后的调用
        if(t){
            // 获取当着所在
            var root = byClass("area-block")[0].innerText.split(":")[2].split("\n")[0];
            var sides = m[root].slice();
            setTimeout(function(){unsafeWindow.ixxAutoFj(root, sides)},2500);
            return true;
        }
        if(!unsafeWindow.ixxId){
            // 显示任务详情
            showTaskDetail("降妖");
            var taskList = byClass("task-info");
            for(var j=0; j<taskList.length; j++){
                var name = taskList[j].innerText.trim();
                if(name.indexOf("妖兽")>0){
                    unsafeWindow.ixxId = name.split("妖兽")[1].split("\n")[0].split("]")[0];
                }
            }
        }
        console.log("去打妖兽"+unsafeWindow.ixxId);
        // 获取怪物列表
        var list = byClass("n-row scene-p");
        for( var i= 0; i< list.length; i++){
            if(list[i].innerText.indexOf("妖兽"+unsafeWindow.ixxId)>=0){
                list[i].getElementsByTagName("svg")[0].dispatchEvent(new Event('click'));
                // 判断切换地标签
                var areaBlock = byClass("area-block");
                if(areaBlock.length<=0){
                    var tabs = byClass("n-tabs-tab");
                    for(j=0;j<tabs.length;j++){
                        if(tabs[j].innerText=="地图"){
                            tabs[j].click();
                            setTimeout(unsafeWindow.ixxAutoXy,300,1)
                        }
                    }
                }
                // 获取当着所在
                root = byClass("area-block")[0].innerText.split(":")[2].split("\n")[0];
                sides = m[root].slice();
                setTimeout(function(){unsafeWindow.ixxAutoFj(root, sides)},2500);
                return true;
            }
        }
        return false;
    }
    // 附近找找妖兽
    unsafeWindow.ixxAutoFj = function autoFj(root, sides){
        var status = checkTaskDone("降妖");
        if(status){
           unsafeWindow.ixxGoLinZhong();
           return;
        }
        console.log("附近找妖兽中。。。");
        var log = byClass("bat-logs")[0].getElementsByTagName("span")[0].innerText;
        if(log == "结算结束 ..."){
            // 判断切换地标签
            var areaBlock = byClass("area-block");
            if(areaBlock.length<=0){
                var tabs = byClass("n-tabs-tab");
                for(j=0;j<tabs.length;j++){
                    if(tabs[j].innerText=="地图"){
                        tabs[j].click();
                        setTimeout(unsafeWindow.ixxAutoFj,300,root,sides)
                    }
                }
            }
            // 获取当着所在
            var now = byClass("area-block")[0].innerText.split(":")[2].split("\n")[0];
            if(root == now){
                var next = sides.pop();
                if(next){
                    unsafeWindow.ixxgobase(next, function(){unsafeWindow.ixxAutoFj(root,sides)});
                } else {
                    return
                }
            } else {
                var ret = unsafeWindow.ixxAutoXy();
                // 当前场景没找到妖兽
                if(!ret){
                    unsafeWindow.ixxgobase(root, function(){unsafeWindow.ixxAutoFj(root,sides)});
                }
            }
        } else {
            setTimeout(function(){unsafeWindow.ixxAutoFj(root, sides)},1000);
        }
    }
    // 去接降妖任务
    unsafeWindow.ixxGoLinZhong = function goLinZhong(){
       console.log("go linzhong");
       unsafeWindow.ixxgobase("林中栈道", unsafeWindow.ixxGetXy);
    }
    // 去接寻宝任务
    unsafeWindow.ixxGoYangCheng = function goYangCheng(){
       console.log("去阳城寻宝");
       unsafeWindow.ixxgobase("阳城", unsafeWindow.ixxGetXb);
    }
    // 接寻宝任务
    unsafeWindow.ixxGetXb = function getXb(){
        getTaskBase(0,unsafeWindow.ixxGoXb);
    }
    // 接任务基础方法，i为npc索引
    function getTaskBase(i,cb){
        byClass("npc-d")[i].getElementsByTagName("span")[0].click();
        setTimeout(function(){
            var npcBtns = byClass("npc-btn");
            if(npcBtns.length>0){
                npcBtns[0].click();
                setTimeout(cb, 800);
            } else {
                getTaskBase(i,cb);
            }
        },500);
    }
    // 找寻宝小妖
   unsafeWindow.ixxGoXb = function goXb(){
       // 显示任务详情
       showTaskDetail("寻宝");
       console.log("去找寻宝小妖");
       var status = checkTaskDone("寻宝");
       // 没有任务说明已达上限
       if(status){return}
       var list = byClass("task-info");
       if(list && list.length>0){
           for(var j=0; j<list.length; j++){
               var name = list[j].innerText.trim();
               if(name.indexOf("击败 寻宝小妖")>0){
                   name = name.split("】")[0].split("【")[1];
                   console.log(name);
                   unsafeWindow.ixxgobase(name, unsafeWindow.ixxAutoXb, j);
                   return;
               }
           }
       }
       setTimeout(unsafeWindow.ixxGoXb, 1000);
    }
    // 自动打寻宝小妖
    unsafeWindow.ixxAutoXb = function autoXb(){
        if(!unsafeWindow.ixxId){
            // 显示任务详情
            showTaskDetail("寻宝");
            var taskList = byClass("t-info");
            for(var j=0; j<taskList.length; j++){
                var name = taskList[j].innerText.trim();
                if(name.indexOf("寻宝小妖")>0){
                    unsafeWindow.ixxId = name.split("寻宝小妖")[1].split("\n")[0];
                }
            }
        }
        console.log("打寻宝小妖"+unsafeWindow.ixxId);
        // 获取怪物列表
        var list = byClass("n-row scene-p");
        for( var i= 0; i< list.length; i++){
            if(list[i].innerText.indexOf("寻宝小妖"+unsafeWindow.ixxId)>=0){
                list[i].getElementsByTagName("svg")[0].dispatchEvent(new Event('click'));
                setTimeout(function(){unsafeWindow.ixxautoyangcheng(100)},800);
            }
        }
        return false;
    }
    // 自动回阳城接寻宝任务
    unsafeWindow.ixxautoyangcheng = function autoyangcheng(num){
        if(num<=0){return}
        num = num-1;
        console.log("自动判断寻宝小妖是否被击败，击败回阳城接任务");
        var status = checkTaskDone("寻宝");
        if(status){
            unsafeWindow.ixxgobase("阳城", unsafeWindow.ixxGetXb);
        } else {
            setTimeout(function(){unsafeWindow.ixxautoyangcheng(num)},800);
        }
    }
    // 炼丹
    unsafeWindow.ixxLianDan = function liandan(status, num){
        if(num<=0){
            return
        }
        var btns = byId("alchemy").getElementsByTagName("button");
        // action 是开始炼丹
        if(status == "action"){
            if(btns[1].disabled){
                setTimeout(function(){unsafeWindow.ixxLianDan("start", num)}, 1000);
            } else {
                status = "start";
                btns[1].click();
                setTimeout(function(){unsafeWindow.ixxLianDan(status, num)}, 5000);
            }
        // 开始5秒注灵可点说明材料不全
        } else if(status == "start"){
            if(btns[2].getAttribute("class").indexOf("loading") < 0){
                setTimeout(function(){btns[2].click();}, 1000);
                status = "end"
            }
            setTimeout(function(){unsafeWindow.ixxLianDan(status, num)}, 5000);
        } else {
            status = "end"
            if(btns[2].getAttribute("class").indexOf("loading") < 0){
                setTimeout(function(){btns[3].click();}, 1000);
                num = num-1;
                status = "action"
                setTimeout(function(){unsafeWindow.ixxLianDan(status, num)}, 3000);
            } else {
                setTimeout(function(){unsafeWindow.ixxLianDan(status, num)}, 5000);
            }
        }

    }
    // 连点
    var IXX_NEXT_ID;
    var IXX_NEXT_NOTION_ID;
    unsafeWindow.ixxAgainBat = function againBat(){
        var t = byId("ixxbat").value;
        IXX_NEXT_ID = setInterval(()=>{
            document.querySelector('.bat-r').click();
        },t)
        IXX_NEXT_NOTION_ID = setInterval(()=>{
            var notion = byClass("n-notification n-notification--closable n-notification--show-avatar")[0];
            if(notion && notion.innerText && notion.innerText.indexOf("正在战斗中..")>0){
                notion.remove();
            }
        }, 1000);
        byId("ixxbatstart").disabled=true;
        byId("ixxbatstop").disabled=false;
    }
    // 停止连点
    unsafeWindow.ixxStopAgainBat = function stopAgainBat(){
        clearInterval(IXX_NEXT_ID);
        clearInterval(IXX_NEXT_NOTION_ID);
        byId("ixxbatstart").disabled=false;
        byId("ixxbatstop").disabled=true;
    }
    // 宗门任务
    var IXX_SECT_ID;
    var IXX_SECT_NUM=21;
    unsafeWindow.ixxSect = function sect(t){
        var tasks = byClass("user-task-info");
        for(var i=0;i<tasks.length;i++){
            if(tasks[i].innerText.indexOf("青龙")>=0){
                return
            }
        }
        byClass("sect-btn")[1].click();
        if(--IXX_SECT_NUM<0){
            unsafeWindow.ixxSectStop();
        }
        if(t){
            IXX_SECT_ID = setInterval(sect, 1000);
            byId("ixxSectStart").disabled=true;
            byId("ixxSectStop").disabled=false;
        }
    }
    // 宗门任务
    unsafeWindow.ixxSectStop = function sectStop(){
        clearInterval(IXX_SECT_ID);
        IXX_SECT_NUM = 21;
        byId("ixxSectStart").disabled=false;
        byId("ixxSectStop").disabled=true;
    }
    // 后台运行
    function backgroundRun(){
        console.log("启用后台运行功能...");
        // 后台运行js设置，防止节能影响定时任务
        const chromeVersion = /Chrome\/([0-9.]+)/.exec(window?.navigator?.userAgent)?.[1]?.split('.')[0];
        if (chromeVersion && parseInt(chromeVersion, 10) >= 88) {
            const videoDom = document.createElement('video');
            const hiddenCanvas = document.createElement('canvas');

            videoDom.setAttribute('style', 'display:none');
            videoDom.setAttribute('muted', '');
            videoDom.muted = true;
            videoDom.setAttribute('autoplay', '');
            videoDom.autoplay = true;
            videoDom.setAttribute('playsinline', '');
            hiddenCanvas.setAttribute('style', 'display:none');
            hiddenCanvas.setAttribute('width', '1');
            hiddenCanvas.setAttribute('height', '1');
            hiddenCanvas.getContext('2d')?.fillRect(0, 0, 1, 1);
            videoDom.srcObject = hiddenCanvas?.captureStream();
        }
    }
    var TASK_LIST=[];
    // 触发任务详情
    function showTaskDetail(key){
        TASK_LIST = byClass("user-task-info");
        for(var j=0; j<TASK_LIST.length; j++){
            if(TASK_LIST[j].innerText.indexOf(key)>=0){
                TASK_LIST[j].dispatchEvent(new Event('mouseenter'));
            }
        }
    }
    // 控宝
    unsafeWindow.ixxWb = function ixxWb(){
        // 使用宝图
        if(byClass("goods-info").length<=0){
            var list = byClass("el-row goods-list")[0].getElementsByTagName("span");
            for( var i= 0; i< list.length; i++){
                var name = list[i].innerText;
                if(name == "寻宝图"){
                    list[i].click();
                }
            }
        }
        setTimeout(function(){byClass("goods-info")[0].getElementsByTagName("button")[0].click();}, 200);
        setTimeout(ixxWbFind, 800);
    }
    function ixxWbFind(){
        // 寻找宝藏
        var log = byClass("bat-logs")[0].getElementsByTagName("span")[3].innerText;
        if(log.indexOf("宝藏在[")>0){
            var m = log.split("宝藏在[")[1].split("]")[0];
            unsafeWindow.ixxgobase(m,ixxWbCb);
        } else { // 未使用宝图停止挖宝
            return
        }
    }
    // 控宝
    function ixxWbCb(){
        var log = byClass("bat-logs")[0].getElementsByTagName("span")[0].innerText;
        if(log.indexOf("到达寻宝图指定位置")>0){
            byClass("bat-logs")[0].getElementsByTagName("span")[0].getElementsByTagName("a")[0].click();
            setTimeout(unsafeWindow.ixxWb,300);
        }
    }
    // 自动登录
    function autoLogin(){
        var ixxgj = unsafeWindow.localStorage.getItem("ixxgj");
        if(ixxgj=="false"){
            console.log("未开启自动挂机over");
            return;
        }
        var href = window.location.href;
        if( href.indexOf("home")>0 ){
            var notions = byClass("n-notification");
            for(var i=0;i<notions.length;i++){
                var notion = notions[i]
                if(notion && notion.innerText && notion.innerText.indexOf("链接被关闭.")>0){
                    window.location.href="https://nimingxx.com/login";
                    setTimeout(autoLogin,5000);
                }
            }
        } else {
            byClass("login-input")[0].getElementsByTagName("button")[0].click();
        }
    }
    // 是否需要设置技能（打副本后回去挂机第一次要改技能）
    var SET_JI=false;
    // 健康检查
    function ixxcheck(){
        console.log("checking...");
        // 判断是否断线
        autoLogin();
        // 没断线判断是否要自动组队或创建队伍
        var gj = byId("ixxguaji").checked;
        var group = byId("ixxgroup").value;
        var pass = byId("ixxpass").value;
        if(gj){
            // 如果没在组里
            if(byClass("team-uu-info").length<=0){
                // 用户名为空说明是队长，则要创建队伍
                if(group == "" || group.startsWith(",")){
                    // 点击创建队伍
                    byClass("el-row team-list")[0].getElementsByClassName("btn-t")[0].click();
                    setTimeout(createGroup,1000,0,pass);
                } else {// 否则加入队伍
                    byClass("el-tabs__item is-top")[1].click();
                    setTimeout(joinGroup,1000,0);
                }
            } else {
                // 判断在做副本则切换技能
                var map = byClass("area-block")[0].innerText.split(":")[2].split("\n")[0];
                var ji = byId("ixxji").value;
                if(",虚空域,青龙之地,玄武之地,白虎之地,朱雀之地,镇仙塔,".indexOf(map)>0){
                    if(!SET_JI && ji.split("/").length>1){
                        SET_JI = true;
                        ji = ji.split("/")[1];
                        setJi(0,ji);
                    }
                } else if(SET_JI){
                    SET_JI = false;
                    ji = ji.split("/")[0];
                    setJi(0,ji);
                }
                // 如果设置了队员则T出不在组里的队友
                if(group.startsWith(",")){
                    var uus = byClass("team-uu-info");
                    for(var i= 1;i<uus.length;i++){
                        if(group.indexOf(uus[i].getElementsByTagName("span")[1].innerText)<0){
                            uus[i].getElementsByTagName("a")[0].click();
                        }
                    }
                }
            }
        }
    }
    // 设置技能
    function setJi(step,ji){
        var t = 800;
        switch(step){
            case 0: //切换到战斗页面
                var tabs = byClass("n-tabs-tab");
                for(var i=0;i<tabs.length;i++){
                    if(tabs[i].innerText=="战斗"){
                        tabs[i].click();
                    }
                }
                t=800;
                break;
            case 1: //设置循环,选技能
                var jis = byClass("s-info");
                for(i=0;i<jis.length;i++){
                    if(jis[i].innerHTML.indexOf(ji)>0){
                        jis[i].click();
                    }
                }
                t=2000;
                break;
            case 2: //切换到地图页面
                tabs = byClass("n-tabs-tab");
                for(i=0;i<tabs.length;i++){
                    if(tabs[i].innerText=="地图"){
                        tabs[i].click();
                    }
                }
                t=2000;
                break;
            default:
                return;
        }
        setTimeout(setJi, t,step+1, ji);
    }
    // 加入队伍
    function joinGroup(step){
        var t = 800;
        switch(step){
            case 0: //刷新地图tab显示怪
                byClass("el-tabs__item is-top")[0].click()
                t=1000;
                break;
            case 1: //获取队伍列表
                var group = byId("ixxgroup").value;
                var groups = byClass("team-list-row");
                var b = true;
                for(var i=0;i<groups.length;i++){
                    if(groups[i].getElementsByTagName("div")[2].innerText==group){
                        groups[i].getElementsByTagName("a")[0].click();
                        b = false;
                    }
                }
                if(b){
                    return;
                } else {
                    break;
                }
            case 2: // 设置密码
                var pass = byId("ixxpass").value;
                byClass("n-input__input-el")[2].value=pass;
                byClass("n-input__input-el")[2].dispatchEvent(new Event('input'));
                var btns = byClass("n-button n-button--info-type n-button--small-type n-button--ghost");
                btns[btns.length-1].click();
                break;
            case 3: // 设置技能和自动
                createGroup(4);
                t=800;
                break;
        }
        setTimeout(joinGroup, t,step+1);
    }
    // 创建队伍并设置技能和自动
    function createGroup(step, val){
        var t = 800;
        switch(step){
            case 0: //设置密码
                byClass("n-popconfirm ")[0].getElementsByClassName("n-input__input-el")[0].value=val;
                byClass("n-popconfirm ")[0].getElementsByClassName("n-input__input-el")[0].dispatchEvent(new Event('input'));
                break;
            case 1: //点击创建
                byClass("n-popconfirm__action")[0].getElementsByTagName("button")[0].click();
                byClass("el-tabs__item is-top")[1].click();
                break;
            case 2: //刷新地图tab显示怪
                byClass("el-tabs__item is-top")[0].click()
                t=2000;
                break;
            case 3: //打怪
                // 获取怪物列表
                var guai = byId("ixxguai").value;
                var list = byClass("n-row scene-p");
                list[guai].getElementsByTagName("svg")[0].dispatchEvent(new Event('click'));
                t=500;
                break;
            case 4: //切换到战斗页面
                var tabs = byClass("n-tabs-tab");
                for(var i=0;i<tabs.length;i++){
                    if(tabs[i].innerText=="战斗"){
                        tabs[i].click();
                    }
                }
                t=800;
                break;
            case 5: //设置循环,选技能
                byClass("n-switch n-switch--round")[0].click();
                var ji = byId("ixxji").value.split("/")[0];
                var jis = byClass("s-info");
                for(i=0;i<jis.length;i++){
                    if(jis[i].innerHTML.indexOf(ji)>0){
                        jis[i].click();
                    }
                }
                t=800;
                break;
            case 6: //设置自动
                byClass("n-switch n-switch--round")[1].click();
                t=2000;
                break;
            case 7: //切换到战斗页面
                tabs = byClass("n-tabs-tab");
                for(i=0;i<tabs.length;i++){
                    if(tabs[i].innerText=="地图"){
                        tabs[i].click();
                    }
                }
                t=2000;
                break;
            default:
                return;

        }
        setTimeout(createGroup, t,step+1);
    }
    // 保存挂机数据
    unsafeWindow.ixxGuaJi = function ixxGuaJi(){
        var gj = byId("ixxguaji").checked;
        var group = byId("ixxgroup").value;
        var pass = byId("ixxpass").value;
        var ji = byId("ixxji").value;
        var guai = byId("ixxguai").value;
        unsafeWindow.localStorage.setItem("ixxgj",gj);
        unsafeWindow.localStorage.setItem("ixxgroup",group);
        unsafeWindow.localStorage.setItem("ixxpass",pass);
        unsafeWindow.localStorage.setItem("ixxji",ji);
        unsafeWindow.localStorage.setItem("ixxguai",guai);
    }
    // 初始化方法
    function init(){
        // 页面初始化
        var href = window.location.href;
        if( byClass("login-input").length<=0){
            backgroundRun();
            // 扩展功能
            var html = "<div id='ixxdiv' style='color:#000;text-align:left;position: absolute;margin-left: 500px;'>";
            // 添加寻路
            var mapTxt = '<button onclick="document.getElementById(\'ixxmap\').style.display=\'\';">寻路</button><div id="ixxmap" style="display:none;position: fixed; left: 200px; top: 10px;z-index:9999; width: 800px; background: #aaa;">'
            for(var m = 0;m<maps.length;m++){
                var ma = maps[m];
                mapTxt += '<div class="el-row" style="margin-top: 10px;">';
                for(var n= 0;n<ma.length;n++){
                    if(ma[n]){
                        var man = ma[n];
                        if(man=="关闭"){
                            man = "";
                        }
                        mapTxt += '<div style="border: double 1px;cursor: pointer;text-align:center;" style="border:double 1px;cursor: pointer;text-align:center;" class="el-col el-col-2" onclick="window.ixxgobase(\''+man+'\')">'+ma[n]+'</div>';
                    } else {
                        mapTxt += '<div class="el-col el-col-2">&nbsp;</div>';
                    }
                }
                mapTxt += '</div>';
            }
            mapTxt += '</div>';
            html+=mapTxt;
            // 添加寻人
            html+="寻人:<select id='gogogo' onchange='window.ixxgogogo()' style='width:64px'> <option value=''>请选择</option><option value='陨真禁地'>化真雷劫</option><option value='林中栈道'>林中道士</option> <option value='林中栈道'>凌中天</option> <option value='林中栈道'>小道童</option> <option value='聚灵城'>修士接引人</option> <option value='追风谷'>景君宁</option> <option value='黑森林'>白稚君</option> <option value='黑森林'>胡天修士</option> <option value='阳城'>盗极生</option> <option value='阳城'>福顺法师</option> <option value='阴冥界'>鬼影地仙</option> <option value='碧炎山脉'>吕真人</option> <option value='无极峰'>青风道长</option> <option value='无极宗'>无极导师</option> <option value='无极宗'>陆地虎</option> <option value='镇仙塔'>守塔人</option> <option value='丹城'>旭日药师</option> <option value='黑市'>乐古奸商</option> <option value='炽焰火山'>南宫逸</option> <option value='冰神禁地'>天华</option> <option value='冰神宫'>落凡</option> </select>"
            // 挖宝
            html+='<button onclick="window.ixxWb()">挖宝</button>'
            // 停止走路
            html+='<button onclick="window.ixxstop()">停止</button>'
            // 常用地图
            html+='常:<button onclick="window.ixxgobase(\'无极峰\')">无极</button><button onclick="window.ixxgobase(\'沼影岭\')">沼泽</button><button onclick="window.ixxgobase(\'云天山峰\')">云天</button><button onclick="window.ixxgobase(\'镇仙塔\')">塔</button><button onclick="window.ixxgobase(\'林中栈道\')">林中</button>'
            // 接药灵任务
            html+="药灵:<button onclick='window.ixxdancheng()'>接</button>&nbsp;";
            // 打药灵
            html+="<button onclick='window.ixxyao()'>打</button>";
            // 接寻宝任务
            html+="寻宝:<button onclick='window.ixxGoYangCheng()'>接</button>&nbsp;";
            // 打寻宝小妖
            html+="<button onclick='window.ixxGoXb()'>打</button>";
            // 接降妖任务
            html+="降妖:<button onclick='window.ixxGoLinZhong()'>接</button>&nbsp;";
            // 打妖兽
            html+="<button onclick='window.ixxGoXy()'>打</button>&nbsp";
            // 打妖兽
            html+="<button onclick='window.ixxAutoXy(1)'>找</button><br/>";
            // 批量使用
            html+="批量:<select id='ixxuselist' style='width:50px'></select><button onclick='window.ixxuselist()'>刷新</button><button onclick='window.ixxbatch(100)'>X100</button><button onclick='window.ixxbatch(500)'>X500</button><button onclick='window.ixxbatch(1000)'>X1000</button>";
            // 自动炼丹
            html+="炼丹:<button onclick='window.ixxLianDan(\"action\",10)'>X10</button><button onclick='window.ixxLianDan(\"action\",20)'>X20</button><button onclick='window.ixxLianDan(\"action\",30)'>X30</button>";
            // 连点
            html+="连点:<input id='ixxbat' value='2100' style='width:60px'/><button onclick='window.ixxAgainBat()' id='ixxbatstart'>开始</button><button id='ixxbatstop' onclick='window.ixxStopAgainBat()' disabled>停止</button>";
            html+="速力:<input id='ixxsl' style='width:20px' value='3'>";
            // 接宗门
            html+="宗门:<button onclick='window.ixxSect(1)' id='ixxSectStart'>接</button><button onclick='window.ixxSectStop()' id='ixxSectStop' disabled>停</button>";
            html+="挂机:<input id='ixxguaji' type='checkbox'  onclick='window.ixxGuaJi()'/>队:<input id='ixxgroup' onblur='window.ixxGuaJi()' style='width:40px'/>密:<input id='ixxpass' onblur='window.ixxGuaJi()' style='width:30px'/>";
            html+="技:<input id='ixxji' onblur='window.ixxGuaJi()' style='width:40px'/>怪:<input id='ixxguai' onblur='window.ixxGuaJi()' value='0' style='width:10px'/>";
            html+="</div>"
            var h = byClass("header-top")[0].innerHTML;
            byClass("header-top")[0].innerHTML = h+html;
            // 初始化挂机保存数据
            var ixxgj = unsafeWindow.localStorage.getItem("ixxgj");
            var ixxgroup = unsafeWindow.localStorage.getItem("ixxgroup");
            var ixxpass = unsafeWindow.localStorage.getItem("ixxpass");
            var ixxji = unsafeWindow.localStorage.getItem("ixxji");
            var ixxguai = unsafeWindow.localStorage.getItem("ixxguai");
            if(!ixxguai){ixxguai=0}
            byId("ixxguaji").checked = ixxgj=="true";
            byId("ixxgroup").value = ixxgroup;
            byId("ixxpass").value = ixxpass;
            byId("ixxji").value = ixxji;
            byId("ixxguai").value = ixxguai;
            // 启动健康检查
            setInterval(ixxcheck,10000);
        } else {
            setTimeout(autoLogin,3000);
            setTimeout(init,3000);
        }
    }
    setTimeout(init,2500);
})();
