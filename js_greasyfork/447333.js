// ==UserScript==
// @name         Enhance Tool III
// @namespace    http://tampermonkey.net/
// @version      0.8.2
// @description  RT
// @author       lyscop
// @match        *
// @include      *
// @grant        none
// ==/UserScript==
 
 
    // dps显示x
    var DPSx=0;
    unsafeWindow.dpsx = function dpsx(){
        var aps = document.getElementsByClassName("ant-tabs-tabpane ant-tabs-tabpane-active")[0].getElementsByTagName("p");
        if(aps.length<20){
            return;
        }
        //计算是物理还是法术
        for(var p=0; p<aps.length; p++) {
            if(aps[p].innerHTML.split('：')[0] == '物理攻击') {
                var wgs = aps[p].innerText.split("：")[1].split("-");
            }
            if(aps[p].innerHTML.split('：')[0] == '物理暴击几率') {
                var wgjl = aps[p].innerText.split("：")[1].split("%")[0];
            }
            if(aps[p].innerHTML.split('：')[0] == '物理暴击倍率') {
                var wgbl = aps[p].innerText.split("：")[1].split("%")[0];
            }
            if(aps[p].innerHTML.split('：')[0] == '法术攻击') {
                var fgs = aps[p].innerText.split("：")[1].split("-");
            }
            if(aps[p].innerHTML.split('：')[0] == '法术暴击几率') {
                var fgjl = aps[p].innerText.split("：")[1].split("%")[0];
            }
            if(aps[p].innerHTML.split('：')[0] == '法术暴击倍率') {
                var fgbl = aps[p].innerText.split("：")[1].split("%")[0];
            }
        }
        var d = 0;
        if(wgs.length==1){
            return
        }
        if(parseInt(wgs[1])>parseInt(fgs[1])){
            d = (parseInt(wgs[0])+parseInt(wgs[1]))/2*parseInt(wgjl)*parseInt(wgbl)/10000;
        } else {
            d = (parseInt(fgs[0])+parseInt(fgs[1]))/2*parseInt(fgjl)*parseInt(fgbl)/10000;
        }
        d = d.toFixed(2);
        var txt = ""+d;
        if(DPSx == d){
            return;
        }
        if(DPSx!=0){
            var dx = d-DPSx;
            dx = dx.toFixed(2);
            if(d>DPSx){
                txt += "<span style='color: red;'>&nbsp;&nbsp;+"+dx+"</span>"
            } else {
                txt += "<span style='color: green;'>&nbsp;&nbsp;"+dx+"</span>"
            }
        }
        DPSx = d;
        document.getElementById("dps").innerHTML=txt;
    }
 
    // 升级所需时间x
    function upLevelx(){
        var href = window.location.href;
        if( href.indexOf("login")>0){
            return;
        }
        dpsx();
        //console.log("upup...");
        var ps = document.getElementsByClassName("ant-tabs-tabpane ant-tabs-tabpane-active")[0].getElementsByTagName("p");
        if(ps.length<4){
            return;
        }
        var elem;
        var title;
        for(var p=0; p<ps.length; p++) {
            if(ps[p].innerHTML.split('：')[0] == ' 经验') {
                elem = ps[p];
                title = elem.getAttribute("title");
            }
        }
 
        if(title){
            var all = title.split("/")[1];
            var now = title.split("/")[0];
            var xl = elem.nextSibling.innerText.split("：")[1];
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
            document.getElementById("levelUp").innerHTML=txt;
        }
    }
    setInterval(upLevelx, 5000);//每分钟检查一次
    
 
    // 自动皮卡丘 基尔加丹 巫妖王
    var wsBool = false;
    var gjBool = false;
    var pkqBool = false;
    var jdBool = false;
    var wywBool = false;
    function autoPKQ() {
        var HPP;
        var d = new Date();
        var nowTime;
        var gjmap = document.getElementById("ixxgjmap").value;
        var btns = document.getElementsByClassName("ant-btn ant-btn-primary");
        var btn = btns[btns.length-1];
        var wsEle = document.getElementsByClassName("ant-card-body")[5].getElementsByTagName("input")[7];
        var gjEle = document.getElementById('ixxgj');
        var newMap = document.getElementsByClassName("carddd")[2].getElementsByClassName("ant-card-head-title")[0].innerText.split("：")[0]
        var aps = document.getElementsByClassName("ant-tabs-tabpane ant-tabs-tabpane-active")[0].getElementsByTagName("p");
        for(var p=0; p<aps.length; p++) {
            if(aps[p].innerHTML.split('：')[0] == 'HP') {
                HPP = aps[p].innerText.split("：")[1].split("/")[1];
            }
        }
        if(('0' +d.getHours().toString()).slice(-2) == '13' && ('0' +d.getMinutes().toString()).slice(-2) == '00') {
            //console.log('HP:' + HPP);
            nowTime = ('0' +d.getHours().toString()).slice(-2) + ':' + ('0' +d.getMinutes().toString()).slice(-2);
            if(HPP < 1800) {
                console.log(nowTime + ' 血太少不打皮卡丘')
                showMessage(nowTime + ' 血太少不打皮卡丘');
                pkqBool = true;
                return;
            }
 
            console.log(nowTime + ' 打皮卡丘啦');
            for(var q=0; q<3; q++) {
                showMessage(nowTime + ' 打皮卡丘啦');
            }
 
            if(btn.innerText == "停止挂机"){
                btn.click();
            }
            window.setTimeout(function(){
                // 切换物品
                document.getElementsByClassName("ant-card ant-card-bordered carddd")[1].getElementsByClassName("ant-tabs-tab")[1].click();
                unsafeWindow.chuansong("盟重土城回城石");
                // 点回城按钮
                //document.getElementById('ixxlog').nextSibling.nextSibling.nextSibling.childNodes[5].click();
                //ppx(97,115);
                var ips = document.getElementsByClassName("ant-card-body")[2].getElementsByTagName("input");
                ips[0].value = 97;
                ips[0].dispatchEvent(new Event('input'));
                ips[1].value = 115;
                ips[1].dispatchEvent(new Event('input'));
                setTimeout(function(){
                    var btns = document.getElementsByClassName("ant-card-body")[2].getElementsByTagName("button");
                    btns[btns.length-1].click();
                }, 500);
            }, 300);
            // 显示怪物列表
            document.getElementsByClassName("ant-card-body")[3].getElementsByClassName("ant-tabs-nav ant-tabs-nav-animated")[0].childNodes[1].childNodes[2].click();
            var num1 = 0;
            var timer1 = setInterval(function() {
                num1++;
                if(num1 > 2) {
                    clearInterval(timer1);
                }
                var ele1 = document.getElementsByClassName("ant-card-body")[3].getElementsByTagName("a");
                for(var v=0; v<ele1.length; v++) {
                    if(ele1[v].innerText.split(' ')[1] == '皮卡丘') {
                        ele1[v].parentNode.parentNode.parentNode.nextSibling.nextSibling.childNodes[1].childNodes[0].click();
                    }
                }
            }, 1000);
 
            window.setTimeout(function(){
                var btns = document.getElementsByClassName("ant-btn ant-btn-primary");
                var btn = btns[btns.length-1];
                btn.click();
            }, 7000);
            /*window.setTimeout(function(){
                var btns = document.getElementsByClassName("ant-btn ant-btn-primary");
                var btn = btns[btns.length-1];
                var btnsppx = byClass("ant-card-body")[2].getElementsByTagName("button");
                if(btnsppx[btnsppx.length-1].innerText.indexOf("虾")>0){
                    //btns[btns.length-1].click();
                    console.log(btnsppx[btnsppx.length-1].innerText)
                    btn.click();
                }
            }, 2000);*/
            if(wsEle.checked) {
                wsEle.click();
                wsBool = true;
            }
            if(gjEle.checked) {
                gjEle.click();
                gjBool = true;
            }
            pkqBool = true;
            console.log(nowTime + ' pkqBool '+ pkqBool);
        }
 
        //if(('0' +d.getHours().toString()).slice(-2) == '13' && ('0' +d.getMinutes().toString()).slice(-2) == '35') {
        if(pkqBool && document.getElementById("map").innerText.indexOf("皮卡丘") == -1 && ('0' +d.getMinutes().toString()).slice(-2) > 5) {
 
            pkqBool = false;
            
            nowTime = ('0' +d.getHours().toString()).slice(-2) + ':' + ('0' +d.getMinutes().toString()).slice(-2);
            console.log(nowTime + '打鸡蛋啦');
            console.log(nowTime + ' pkqBool '+ pkqBool);
            for(var r=0; r<3; r++) {
                showMessage(nowTime + ' 打鸡蛋啦');
            }
 
            if(btn.innerText == "停止挂机"){
                btn.click();
            }
            window.setTimeout(function(){
                // 切换物品
                document.getElementsByClassName("ant-card ant-card-bordered carddd")[1].getElementsByClassName("ant-tabs-tab")[1].click();
                unsafeWindow.chuansong("初始大陆回城石");
                // 点回城按钮
                //document.getElementById('ixxlog').nextSibling.nextSibling.nextSibling.childNodes[1].click();
                //ppx(97,115);
                var ips = document.getElementsByClassName("ant-card-body")[2].getElementsByTagName("input");
                ips[0].value = 28;
                ips[0].dispatchEvent(new Event('input'));
                ips[1].value = 28;
                ips[1].dispatchEvent(new Event('input'));
                setTimeout(function(){
                    var btns = document.getElementsByClassName("ant-card-body")[2].getElementsByTagName("button");
                    btns[btns.length-1].click();
                }, 500);
            }, 300);
            // 显示怪物列表
            document.getElementsByClassName("ant-card-body")[3].getElementsByClassName("ant-tabs-nav ant-tabs-nav-animated")[0].childNodes[1].childNodes[2].click();
            var num2 = 0;
            var timer2 = setInterval(function() {
                num2++;
                if(num2 > 2) {
                    clearInterval(timer2);
                }
                var ele2 = document.getElementsByClassName("ant-card-body")[3].getElementsByTagName("a");
                for(var n=0; n<ele2.length; n++) {
                    if(ele2[n].innerText.split(' ')[1] == '基尔加丹') {
                        ele2[n].parentNode.parentNode.parentNode.nextSibling.nextSibling.childNodes[1].childNodes[0].click();
                    }
                }
            }, 1000);
 
            window.setTimeout(function(){
                //console.log('ok')
                var btns = document.getElementsByClassName("ant-btn ant-btn-primary");
                var btn = btns[btns.length-1];
                btn.click();
            }, 25000);
            /*window.setTimeout(function(){
                var btns = document.getElementsByClassName("ant-btn ant-btn-primary");
                var btn = btns[btns.length-1];
                var btnsppx = byClass("ant-card-body")[2].getElementsByTagName("button");
                if(btnsppx[btnsppx.length-1].innerText.indexOf("虾")>0){
                    console.log(btnsppx[btnsppx.length-1].innerText)
                    //btns[btns.length-1].click();
                    btn.click();
                }
            }, 2000);*/
            if(wsEle.checked) {
                wsEle.click();
                wsBool = true;
            }
            if(gjEle.checked) {
                gjEle.click();
                gjBool = true;
            }
            jdBool = true;
            console.log(nowTime + ' jdBool '+ jdBool);
 
        }
        //if(('0' +d.getHours().toString()).slice(-2) == '13' && ('0' + d.getMinutes().toString()).slice(-2) == '35') {
        if(jdBool && document.getElementById("map").innerText.indexOf("基尔加丹") == -1 && ('0' +d.getMinutes().toString()).slice(-2) > 20) {
 
            jdBool = false;
            nowTime = ('0' +d.getHours().toString()).slice(-2) + ':' + ('0' +d.getMinutes().toString()).slice(-2);
            console.log(nowTime + '打巫妖王啦');
            console.log(nowTime + ' jdBool '+jdBool);
            for(var s=0; s<3; s++) {
                showMessage(nowTime + ' 打巫妖王啦');
            }

            if(btn.innerText == "停止挂机"){
                btn.click();
            }
            unsafeWindow.autoGo('终结之地', function(){
                var btns = document.getElementsByClassName("ant-btn ant-btn-primary");
                var btn = btns[btns.length-1];
                btn.click();
            });
 
            if(wsEle.checked) {
                wsEle.click();
                wsBool = true;
            }
            if(gjEle.checked) {
                gjEle.click();
                gjBool = true;
            }
            //wywBool = true;
            //console.log(nowTime + ' wywBool '+wywBool);
            var num3 = 0;
            var timer3 = setInterval(function() {
                num3++;
                if(document.getElementById("map").innerText.indexOf("巫妖王") > 0) {
                    wywBool = true;
                    console.log(nowTime + ' wywBool '+wywBool);
                    clearInterval(timer3);
                }
            }, 1000);
 
        }
        //if(('0' +d.getHours().toString()).slice(-2) == '14' && ('0' +d.getMinutes().toString()).slice(-2) == '00') {
        if(wywBool && document.getElementById("map").innerText.indexOf("巫妖王") == -1 && ('0' +d.getMinutes().toString()).slice(-2) > 35) {
            wywBool = false;
            nowTime = ('0' +d.getHours().toString()).slice(-2) + ':' + ('0' +d.getMinutes().toString()).slice(-2);
 
            console.log(nowTime + ' wywBool ' + wywBool);
 
            var now = document.getElementsByClassName("carddd")[2].getElementsByClassName("ant-card-head-title")[0].innerText.split("：")[0];
 
            // 如果不在挂机地图且挂机中
            if(gjmap != now){
                if(btn.innerText == "停止挂机")
                    // 先停止
                    btn.click();
                // 去挂机地图
                unsafeWindow.autoGo(gjmap, function(){
                    var btns = document.getElementsByClassName("ant-btn ant-btn-primary");
                    var btn = btns[btns.length-1];
                    // 开始挂机
                    btn.click();
                });
            }
            if(wsBool) {
                wsEle.click();
            }
            if(gjBool) {
                gjEle.click();
            }
            console.log(nowTime + ' 挂机');
        }
    }
    //setInterval(autoPKQ, 60000); //每分钟启动一次
 
    var goldDaily;
    var stoneDaily;
    var ypDaily;
    var zfyDaily;
    var strDailyData="<div>";
    function getDailyData(){
        var strDailyData1 = '';
        var d = new Date();
        var nowTime = ('0' +d.getHours().toString()).slice(-2) + ':' + ('0' +d.getMinutes().toString()).slice(-2);
        var elem = document.getElementsByClassName('ant-tabs-tabpane')[0].getElementsByTagName("p");
        var equips = document.getElementsByClassName("equip");
        var goods = equips[equips.length-1].getElementsByClassName("ant-list-item ant-list-item-no-flex");
        if(('0' +d.getHours().toString()).slice(-2) == '21' && ('0' +d.getMinutes().toString()).slice(-2) == '00') {
            if(!GM_getValue('goldDaily')) {
                for(var i=0; i<elem.length; i++) {
                    if(elem[i].innerHTML.split('：')[0] == '金币') {
                        goldDaily = elem[i].innerHTML.split('：')[1];
                    }
                    if(elem[i].innerHTML.split('：')[0] == '灵石') {
                        stoneDaily = elem[i].innerHTML.split('：')[1];
                    }
                }
                for(var j= 0;j<goods.length;j++){
                    if(goods[j].innerText.split(" x ")[0] == '妖魄'){
                        ypDaily = goods[j].innerText.split(" x ")[1].split('\n')[0];
                    }
                    if(goods[j].innerText.split(" x ")[0] == '祝福油'){
                        zfyDaily = goods[j].innerText.split(" x ")[1].split('\n')[0];
                    }
                }
                GM_setValue('goldDaily', goldDaily);
                GM_setValue('stoneDaily', stoneDaily);
                GM_setValue('ypDaily', ypDaily);
                GM_setValue('zfyDaily', zfyDaily);
                strDailyData1 = "<span style='color:orange'>" + nowTime + "</span><br>记录当日数据<br>";
            } else {
                for(var p=0; p<elem.length; p++) {
                    if(elem[p].innerHTML.split('：')[0] == '金币') {
                        goldDaily = elem[p].innerHTML.split('：')[1];
                    }
                    if(elem[p].innerHTML.split('：')[0] == '灵石') {
                        stoneDaily = elem[p].innerHTML.split('：')[1];
                    }
                }
                for(var q= 0;q<goods.length;q++){
                    if(goods[q].innerText.split(" x ")[0] == '妖魄'){
                        ypDaily = goods[q].innerText.split(" x ")[1].split('\n')[0];
                    }
                    if(goods[q].innerText.split(" x ")[0] == '祝福油'){
                        zfyDaily = goods[q].innerText.split(" x ")[1].split('\n')[0];
                    }
                }
                goldData = goldDaily - GM_getValue('goldDaily');
                stoneData = stoneDaily - GM_getValue('stoneDaily');
                ypData = ypDaily - GM_getValue('ypDaily');
                zfyData = zfyDaily - GM_getValue('zfyDaily');

                /*strDailyData1 += "<span style='color:orange'>" + nowTime + "</span><br>每日金币 " + goldData +
                    "<br>每日灵石 "+ stoneData + " / "+ stoneDaily + " - " + GM_getValue('stoneDaily') +
                    "<br>每日妖魄 "+ ypData + " / "+ ypDaily + " - " + GM_getValue('ypDaily') +
                    "<br>每日祝福油 "+ zfyData + " / "+ zfyDaily + " - " + GM_getValue('zfyDaily') + "<br>";*/
                strDailyData1 += "<span style='color:orange'>" + nowTime + "</span><br>每日金币 " + goldData +
                    "<br>每日灵石 "+ stoneData + " / "+ stoneDaily + " - " + GM_getValue('stoneDaily') +
                    "<br>每日妖魄 "+ ypData + " / "+ ypDaily + " - " + GM_getValue('ypDaily') + "<br>";
                GM_setValue('goldDaily', goldDaily);
                GM_setValue('stoneDaily', stoneDaily);
                GM_setValue('ypDaily', ypDaily);
                GM_setValue('zfyDaily', zfyDaily);
            }
            strDailyData = strDailyData1;
            strDailyData +="</div>";
            $("#ixxlog").append(strDailyData);
            var ele = document.getElementById('ixxlog');
            ele.scrollTop = ele.scrollHeight - ele.clientHeight;
        }
    }
 
    var hour1;
    var gold1;
    var stone1;
    var yp1 = 0;
    var zfy1 = 0;
    var hour2;
    var gold2
    var stone2;
    var yp2 = 0;
    var zfy2 = 0;
    var goldData;
    var stoneData;
    var ypData;
    var zfyData;
    var strData="<div>";
    function getData(){
        //getEffData();
        var strData1 = '';
        var d = new Date();
        var nowTime = ('0' +d.getHours().toString()).slice(-2) + ':' + ('0' +d.getMinutes().toString()).slice(-2);
        var elem = document.getElementsByClassName('ant-tabs-tabpane')[0].getElementsByTagName("p");
        var equips = document.getElementsByClassName("equip");
        var goods = equips[equips.length-1].getElementsByClassName("ant-list-item ant-list-item-no-flex");
        if(('0' +d.getMinutes().toString()).slice(-2) == '00') {
            if(!GM_getValue('gold1')) {
                hour1 = ('0' +d.getHours().toString()).slice(-2);
                //gold1 = elem[1].innerHTML.split('：')[1];
                //stone1 = elem[2].innerHTML.split('：')[1];
                for(var i=0; i<elem.length; i++) {
                    if(elem[i].innerHTML.split('：')[0] == '金币') {
                        gold1 = elem[i].innerHTML.split('：')[1];
                    }
                    if(elem[i].innerHTML.split('：')[0] == '灵石') {
                        stone1 = elem[i].innerHTML.split('：')[1];
                    }
                }

                for(var j= 0;j<goods.length;j++){
                    if(goods[j].innerText.split(" x ")[0] == '妖魄'){
                        yp1 = goods[j].innerText.split(" x ")[1].split('\n')[0];
                    }
                    if(goods[j].innerText.split(" x ")[0] == '祝福油'){
                        zfy1 = goods[j].innerText.split(" x ")[1].split('\n')[0];
                    }
                }
                GM_setValue('hour1', hour1);
                GM_setValue('gold1', gold1);
                GM_setValue('stone1', stone1);
                GM_setValue('yp1', yp1);
                GM_setValue('zfy1', zfy1);
                strData1 = "<span style='color:brown'>" + nowTime + "</span><br>记录当前数据<br>";
            } else {
                hour2 = ('0' +d.getHours().toString()).slice(-2);
                //gold2 = elem[1].innerHTML.split('：')[1];
                //stone2 = elem[2].innerHTML.split('：')[1];
                for(var p=0; p<elem.length; p++) {
                    if(elem[p].innerHTML.split('：')[0] == '金币') {
                        gold2 = elem[p].innerHTML.split('：')[1];
                    }
                    if(elem[p].innerHTML.split('：')[0] == '灵石') {
                        stone2 = elem[p].innerHTML.split('：')[1];
                    }
                }
                for(var q= 0;q<goods.length;q++){
                    if(goods[q].innerText.split(" x ")[0] == '妖魄'){
                        yp2 = goods[q].innerText.split(" x ")[1].split('\n')[0];
                    }
                    if(goods[q].innerText.split(" x ")[0] == '祝福油'){
                        zfy2 = goods[q].innerText.split(" x ")[1].split('\n')[0];
                    }
                }
                if(hour2 - GM_getValue('hour1') == 1 || hour2 - GM_getValue('hour1') == -23) {
                    goldData = gold2 - GM_getValue('gold1');
                    stoneData = stone2 - GM_getValue('stone1');
                    ypData = yp2 - GM_getValue('yp1');
                    zfyData = zfy2 - GM_getValue('zfy1');
                    if(goldData < 0) {
                        goldData = 0;
                        GM_setValue('gold1', gold2);
                    }
                    if(stoneData < 0) {
                        stoneData = 0;
                        GM_setValue('stone1', stone2);
                    }

                    if(ypData < 0) {
                        ypData = 0;
                        GM_setValue('yp1', yp2);
                    }
                    if(zfyData < 0) {
                        zfyData = 0;
                        GM_setValue('zfy1', zfy2);
                    }
                    /*strData1 += "<span style='color:brown'>" + nowTime + "</span><br>每小时金币 " + goldData +
                        "<br>每小时灵石 " + stoneData + " / " + stone2 + " - " + GM_getValue('stone1') +
                         "<br>每小时妖魄 " + ypData + " / " + yp2 + " - " + GM_getValue('yp1') +
                         "<br>每小时祝福油 " + zfyData + " / " + zfy2 + " - " + GM_getValue('zfy1') + "<br>";*/
                    strData1 += "<span style='color:brown'>" + nowTime + "</span><br>每小时金币 " + goldData +
                        "<br>每小时灵石 " + stoneData + " / " + stone2 + " - " + GM_getValue('stone1') +
                        "<br>每小时妖魄 " + ypData + " / " + yp2 + " - " + GM_getValue('yp1') + "<br>";
                    GM_setValue('hour1', hour2);
                    GM_setValue('gold1', gold2);
                    GM_setValue('stone1', stone2);
                    GM_setValue('yp1', yp2);
                    GM_setValue('zfy1', zfy2);

                } else {
                    GM_setValue('hour1', hour2);
                    GM_setValue('gold1', gold2);
                    GM_setValue('stone1', stone2);
                    GM_setValue('yp1', yp2);
                    GM_setValue('zfy1', zfy2);
                    strData1 += "<span style='color:brown'>" + nowTime + "</span><br>记录当前数据<br>";
                }
            }
            strData = strData1
            strData +="</div>";
            $("#ixxlog").append(strData);
            var ele = document.getElementById('ixxlog');
            //ele.scrollTop=500
            ele.scrollTop = ele.scrollHeight;
        }
    }
    //setInterval(getData, 60000); //每分钟启动一次
    
    // 计算效率
    var goldEff;
    var stoneEff;
    var hourEff;
    var minEff;
    var leave1;
    var leave2;
    var firstTime;
    var firstGold;
    var firstStone;
    var goldElt;
    var stoneElt;
    var resetAll = document.createElement('a');
    var goldTag = document.createElement('p');
    var stoneTag = document.createElement('p');
    var timeTag = document.createElement('p');
    function getEffDataInit() {
        var href = window.location.href;
        if( href.indexOf("login")>0){
            setTimeout(getEffDataInit, 1500);
            return;
        }
        var elt = document.getElementsByClassName('ant-tabs-tabpane')[0].getElementsByTagName("p");
        firstTime = Date.parse(new Date());
        for(var i=0; i<elt.length; i++) {
            if(elt[i].innerHTML.split('：')[0] == '金币') {
                goldElt = elt[i];
                //console.log(goldElt);
                firstGold = elt[i].innerHTML.split('：')[1];
            }
            if(elt[i].innerHTML.split('：')[0] == '灵石') {
                stoneElt = elt[i];
                //console.log(goldElt);
                firstStone = elt[i].innerHTML.split('：')[1];
            }
        }
        resetAll.href = '#';
        //resetAll.onclick = 'resetAllData()'
        resetAll.onclick = function(){
            resetAllData()
        };
        resetAll.innerText = ' 重置All';
        goldTag.innerText = ' 效率：0/小时';
        stoneTag.innerText = ' 效率：0/小时';
        timeTag.innerText = ' 时长：0小时 0分钟';
        elt[0].append(resetAll);
        goldElt.nextSibling.parentNode.insertBefore(goldTag, goldElt.nextSibling);
        stoneElt.nextSibling.parentNode.insertBefore(stoneTag, stoneElt.nextSibling);
        elt[0].nextSibling.parentNode.insertBefore(timeTag, elt[0].nextSibling);
        GM_setValue('firstTime', firstTime);
        GM_setValue('firstGold', firstGold);
        GM_setValue('firstStone', firstStone);
        //console.log(firstGold + firstStone)
    }
    window.setTimeout(getEffDataInit, 2000);
 
    function resetAllData() {
        var newGoldEffTag;
        var newStoneTag;
 
        var elt = document.getElementsByClassName('ant-tabs-tabpane')[0].getElementsByTagName("p");
        for(var h =0; h<elt.length; h++) {
            if(elt[h].innerHTML.split('：')[0] == '金币') {
                newGoldEffTag = elt[h].nextSibling;
            }
            if(elt[h].innerHTML.split('：')[0] == '灵石') {
                newStoneTag = elt[h].nextSibling;
            }
        }
        newGoldEffTag.innerHTML = ' 效率：0/小时';
        newStoneTag.innerHTML = ' 效率：0/小时';
        console.log('ok')
        for(var i=0; i<elt.length; i++) {
            if(elt[i].innerHTML.split('：')[0] == ' 经验') {
                elt[i].nextSibling.childNodes[1].click();
            }
        }
        clearInterval(effData);
        effData = setInterval(getEffData, 60000);
    }
 
    function getEffData(){
        var href = window.location.href;
        if( href.indexOf("login")>0){
            return;
        }
        getData();
        autoPKQ();
        getDailyData();
        
        var elt = document.getElementsByClassName('ant-tabs-tabpane')[0].getElementsByTagName("p");
        var nowTime = Date.parse(new Date());
        var nowGold;
        var nowStone;
        var newGoldEffTag;
        var newStoneTag;
        var newTimeTag;
        for(var j=0; j<elt.length; j++) {
            if(elt[j].innerHTML.split('：')[0] == '金币') {
                newGoldEffTag = elt[j].nextSibling;
                nowGold = elt[j].innerHTML.split('：')[1];
            }
            if(elt[j].innerHTML.split('：')[0] == '灵石') {
                newStoneTag = elt[j].nextSibling;
                nowStone = elt[j].innerHTML.split('：')[1];
            }
        }
        goldEff = parseInt((nowGold - GM_getValue('firstGold')) / ((nowTime - GM_getValue('firstTime')) / (3600 * 1000)));
        //console.log(goldEff);
        stoneEff = parseInt((nowStone - GM_getValue('firstStone')) / ((nowTime - GM_getValue('firstTime')) / (3600 * 1000)));
        //console.log(stoneEff);
        if(goldEff < 0) {
            goldEff = 0;
            GM_setValue('firstGold', nowGold);
        }
        if(stoneEff < 0) {
            stoneEff = 0;
            GM_setValue('firstStone', nowStone);
        }
        leave1 = (nowTime - GM_getValue('firstTime')) % (24 * 3600 * 1000);
        hourEff = Math.floor(leave1 / (3600 * 1000));
        leave2 = leave1 % (3600 * 1000);
        minEff = Math.floor(leave2 / (60 * 1000)) + 1;
        //console.log(minEff)
        newGoldEffTag.innerHTML = ' 效率：' + goldEff + '/小时';
        newStoneTag.innerHTML = ' 效率：' + stoneEff + '/小时';
        elt[0].nextSibling.innerHTML = ' 时长：' + hourEff + '小时 ' + minEff + '分钟';
    }
    var effData = setInterval(getEffData, 60000); //每分钟启动一次
    
    var wrapEle = document.createElement('div');
    wrapEle.id = "wrap";
    wrapEle.setAttribute('style', '' +
                         'position:fixed;' +
                         'right:0px;' +
                         'top:0px;' +
                         'width:300px;' +//最大宽度
                         //'padding:40px;' +
                         'background-color:rgba(255,255,255,0)!important;' +
                         'z-index:2147483647!important;' +//显示最顶层
                         '');
 
    //document.body.appendChild(wrapEle);//元素加入body 报错无法加入
    document.documentElement.appendChild(wrapEle);//元素加入body
 
    function showMessage(text) {
        const wrapDiv = document.getElementById("wrap");
        var div = document.createElement('div');
        div.setAttribute('style', '' +
                         'display:none!important;' +//去掉直接显示
                         'left:0px;' +
                         'top:0px;' +
                         'margin-left:auto;' +//table块靠右显示
                         //'position:absolute!important;' +
                         'font-size:22px!important;' +
                         'overflow:auto!important;' +
                         'background-color:rgba(255,255,255,0.7)!important;' +
                         'font-family:sans-serif,Arial!important;' +
                         'font-weight:normal!important;' +
                         'text-align:left!important;' +//左对齐
                         'color:#000!important;' +
                         'padding:0.1em 0.2em!important;' +
                         'border-radius:3px!important;' +
                         'border:1px solid #ccc!important;' +
                         //'max-width:350px!important;' +
                         'max-height:1216px!important;' +
                         'z-index:2147483647!important;' +
                         '');
 
        div.innerHTML = text;
        div.style.display = 'table';// 换行显示结果
        let fc = wrapDiv.firstElementChild
        if (fc) {
            wrapDiv.insertBefore(div,fc)
        } else {
            wrapDiv.appendChild(div);
        }
        setTimeout(() => {
            div.parentNode.removeChild(div);
        },6000)
    }