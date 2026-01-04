// ==UserScript==
// @name         idlepoe小助手
// @namespace
// @version      1.0.6
// @description  idlepoe小助手，走起！！！
// @author       iuv@喝水  @觅雪
// @match        *://*.idlepoe.com/*
// @match        *://idlepoe.com/*
// @match        *://poe.faith.wang/*
// @icon         https://www.google.com/s2/favicons?domain=idlepoe.com
// @grant        unsafeWindow
// @license      MIT
// @namespace https://idlepoe.com
// @downloadURL https://update.greasyfork.org/scripts/478116/idlepoe%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/478116/idlepoe%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //装备数组
    var ES = {"头部":3,"胸甲":4,"腰带":5,"手套":6,"鞋子":7,"项链":8,"戒指":910,"饰品":11}
    var PSL = 0;
    var AUTO_DEL_STATUS=0;// 自动删除启动状态
    var ROLL_STATUS=0;// 自动改造启用状态
    var BACKPACK_ES; // 缓存查找背包装备数据
    var BACKPACK_INDEX; // 查找背包索引
    var BACKPACK_KEY; // 缓存查找背包装备关键字
    var BACKPACK_NAME; // 缓存查找背包装备名字
    var BACKPACK_STATUS = 0; //查找背包状态
    // 同步显示装备属性bug版本
    /*setInterval(function(){
        let ps = document.getElementsByClassName("stats");
        if(ps && ps.length>0){
            //console.log(ps.length+":"+PSL);
            if(ps.length>PSL){
                //清空准备区属性层
                for(let i=1;i<12;i++){
                    hideProperty(i);
                }
                ps = document.getElementsByClassName("stats");
                PSL=ps.length;
                let type = ps[ps.length-1].getElementsByClassName("property")[0].innerHTML;
                let e = ES[type];
                //console.log(type+":"+e);
                if(e){
                    if(e==910){
                        showProperty(9);
                        showProperty(10);
                    }else{
                        showProperty(e);
                    }
                }else{
                    showProperty(1);
                    showProperty(2);
                }
            }else if(ps.length<PSL){
                //console.log("clr");
                PSL=0;
                //清空准备区属性层
                for(let i=1;i<12;i++){
                    hideProperty(i);
                }
            }
        }
    },100);*/
    function showProperty(i){
        let em = document.querySelector("#rc-tabs-0-panel-0 > div.group-pane > div:nth-child("+i+") > div.equipment-container");
        if(em){
            em.dispatchEvent(new Event("mouseenter"));
        }
    }
    function hideProperty(i){
        let em = document.querySelector("#rc-tabs-0-panel-0 > div.group-pane > div:nth-child("+i+") > div.equipment-container");
        if(em){
            em.dispatchEvent(new Event("mouseleave"));
        }
    }
    // 设置id对应显示内容
    function setTxt(id, txt){

        document.getElementById(id).innerText = txt;
    }
    // help
    unsafeWindow.help = function help(){
        let html = "<div id='ixxhelp' style='position: absolute;top: 40px;left: 10px;z-index:99999;background:#222;text-align:left;color:#c1ae85'>";
        html += "工匠石：重置插槽数量<br/>";
        html += "幻色石：随机插槽颜色<br/>";
        html += "链接石：随机连接插槽<br/>";
        html += "脱变石：<span style='color:#aaa'>普通</span>升<span style='color:#88f'>魔法</span>装备<br/>";
        html += "机会石：<span style='color:#aaa'>普通</span>随机升<span style='color:#88f'>魔法</span>、<span style='color:#ff7'>稀有</span>、<span style='color:orange'>传奇</span><br/>";
        html += "点金石：<span style='color:#aaa'>普通</span>升<span style='color:#ff7'>稀有</span>装备<br/>";
        html += "增幅石：为<span style='color:#88f'>魔法</span>装备添加词条<br/>";
        html += "改造石：重置<span style='color:#88f'>魔法</span>装备词条<br/>";
        html += "重铸石：还原为<span style='color:#aaa'>普通</span><br/>";
        html += "富豪石：<span style='color:#88f'>魔法</span>升<span style='color:#ff7'>稀有</span><br/>";
        html += "混沌石：重置<span style='color:#ff7'>稀有</span>物品词条<br/>";
        html += "崇高石：<span style='color:#ff6'>稀有</span>装备添加词条<br/>";
        html += "神圣石：重铸装备上词条数值<br/>";
        html += "<button onclick='closeHelp();'>关闭</button></div>";
        let p = document.createElement("div");
        p.innerHTML = html;
        byId("app").appendChild(p);
    }
    unsafeWindow.closeHelp = function closeHelp(){
        byId("ixxhelp").remove();
    }
    // roll属性
    function check(){
        let ta = document.getElementsByClassName("stats")[0].innerHTML;
        let names = byClass("affixes");
        let name =  names[0].innerText;
        //let name = names[names.length-1].innerText;
        let t=ta.substr(ta.lastIndexOf("separator"))
        console.log(t);
        let rolltxt = getVal("rolltxt");
        let rollname = getVal("rollname");

        // 判断名字和属性是否都为空为空则停止
        if(!rollname && !rolltxt){
            roll(1);//停止
        }


        var selectElement = document.getElementById("andor");
        var xyt = selectElement.value;
        if(xyt == 0 ){
            if(rollname){
                if(checkAll_and(rollname, name)){
                    roll();
                } else {
                    roll(1);//停止
                }
            } else {
                if(checkAll_and(rolltxt, t)){
                    roll();
                } else {
                    roll(1);//停止
                }
            }
        }else if(xyt == 1 ){
            if(rollname){
                if(checkAll(rollname, name)){
                    roll();
                } else {
                    roll(1);//停止
                }
            } else {
                if(checkAll(rolltxt, t)){
                    roll();
                } else {
                    roll(1);//停止
                }
            }
        }else if (xyt > 1){
            if(rollname){
                if(checkAll_num(rollname, name,xyt)){
                    roll();
                } else {
                    roll(1);//停止
                }
            } else {
                roll(1);//停止
            }
        }
    }
    function checkAll(rolltxt, t){

        let rolltxts = rolltxt.split(",");
        for(let i=0;i<rolltxts.length;i++){
            if(rolltxts[i] && t.indexOf(rolltxts[i])>=0){
                return 0;
            }
        }
        return 1;
    }

    function checkAll_and(rolltxt, t){
        let rolltxts = rolltxt.split(",");
        let flag = 0;
        for(let i=0;i<rolltxts.length;i++){
            if(rolltxts[i] && t.indexOf(rolltxts[i])>=0){

            }else{
               flag = 1;
            }
        }
        return flag;
    }

    function checkAll_num(rolltxt, t,num){
        let rolltxts = rolltxt.split(",");
        let flag = 0;
        let x = 0;
        for(let i=0;i<rolltxts.length;i++){
            if(rolltxts[i] && t.indexOf(rolltxts[i])>=0){
                x++;
            }
        }
        if(x<num){
            flag = 1;
        }
        return flag;
    }

    unsafeWindow.roll = function roll(status){
        if(status){
            let txts = ["自动改造","停止改造"];
            ROLL_STATUS = (ROLL_STATUS+1)%2;
            setTxt("rollbtn",txts[ROLL_STATUS]);
        }
        if(ROLL_STATUS){
            var selectElement = document.getElementById("shit");
            var xyt = selectElement.value;
            click(byClass("actions")[0].getElementsByTagName("button")[xyt]);
            if(xyt==9){
                setTimeout(zfClick, 1000);
            }else{
                setTimeout(check, 1000);
            }
            
        }
    }

    function zfClick(){
        debugger
        let names = byClass("affixes");
        let name =  names[0].innerText;
        let xyxts = name.split("\n");
        let rollname = getVal("rollname");
        if(xyxts.length==1 && !checkAll(rollname, name)){
            click(byClass("actions")[0].getElementsByTagName("button")[8]);
        }

        setTimeout(check, 1000);
    }

    unsafeWindow.stopRoll = function stopRoll(){
        click(byClass("actions")[0].getElementsByTagName("button")[7]);
        setTimeout(check, 1000);
    }
    // 搜索本页面装备属性
    unsafeWindow.search = function search(){
        BACKPACK_STATUS = 0;
        BACKPACK_ES = byClass("backpack")[0].querySelectorAll("div.equip-name");
        BACKPACK_KEY = getVal("rolltxt");
        BACKPACK_NAME = getVal("rollname");
        BACKPACK_INDEX = 0;
        nextSearch();
    }
    unsafeWindow.nextSearch = function nextSearch(){
        if(BACKPACK_STATUS){
            return;
        }
        if(BACKPACK_INDEX>0){
            mouseLeave(BACKPACK_ES[BACKPACK_INDEX-1].parentElement);
        }
        if(BACKPACK_INDEX>=BACKPACK_ES.length){
            let np = document.getElementsByClassName("ant-pagination-next")[0];
            if(np.outerHTML.indexOf("aria-disabled=\"false\"")>0){
                np.dispatchEvent(new Event("click"));
                setTimeout(search, 1000);
                return;
            } else {
                return;
            }
        }
        mouseEnter(BACKPACK_ES[BACKPACK_INDEX++].parentElement);
        setTimeout(checkSearch, 300);
    }
    unsafeWindow.stopSearch = function stopSearch(){
        BACKPACK_STATUS = 1;
    }
    function checkSearch(){
        let txts = byClass("stats");
        let txtAll = txts[txts.length-1].innerText;
        let names = byClass("title-bar");
        let name = names[names.length-1].innerText;
        let txt = txtAll.substr(txtAll.indexOf("需求"));
        console.log(txt);
        let keys = BACKPACK_KEY.split(",");
        if(!BACKPACK_NAME || name.indexOf(BACKPACK_NAME)<0){
            if(!BACKPACK_KEY){
                setTimeout(nextSearch,100);
                return;
            }
            for(let i=0;i<keys.length;i++){
                if(txt.indexOf(keys[i])<0){
                    setTimeout(nextSearch,100);
                    return;
                }
            }
        }
    }
    // 基础方法
    function byId(id){
        return document.getElementById(id);
    }
    function byClass(cls){
        return document.getElementsByClassName(cls);
    }
    function mouseEnter(dom){
        dom.dispatchEvent(new Event("mouseenter"));
    }
    function mouseLeave(dom){
        dom.dispatchEvent(new Event("mouseleave"));
    }
    function click(dom){
        dom.dispatchEvent(new Event("click"));
    }
    function getVal(id){
        return byId(id).value;
    }
    // init
    setTimeout(function(){
        console.log("init...");
        let html = "<div style='position: absolute;top: 10px;left: 10px;z-index:99999'>";
        html+="词缀关键字：<input style='width:100px' id='rollname' />";
        html+="属性关键字：<input style='width:100px' id='rolltxt' /><select id='andor'><option value=0>and</option><option value=1 selected>or</option>"
        html+="<option value=2 >=2</option><option value=3 >=3</option><option value=4>=4</option></select>"
        html+="<select id='shit'><option value=9 selected>改造</option><option value=12 >混沌</option></select>"
        html+="<button id='rollbtn' onclick='roll(1)'>自动改造</button>";
        //html+="<button id='searchBtn' onclick='window.search()'>查找背包</button><button id='nextSearchBtn' onclick='window.nextSearch()'>下一个</button>";
       // html+="<button id='stopSearchBtn' onclick='window.stopSearch()'>停止查找</button>";
        html+="</div>";
        //let appHtml = document.getElementById("app").innerHTML;
        //document.getElementById("app").innerHTML = html+appHtml;
        let p = document.createElement("div");
        p.innerHTML = html;
        document.getElementById("app").appendChild(p);
    },3000);

})();