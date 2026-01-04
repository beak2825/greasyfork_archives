// ==UserScript==
// @name            梦幻西游藏宝阁助手
// @namespace       https://github.com/ipez/xyqCBGhelper
// @author          ipez
// @description     人物技能修炼花费计算
// @match           *://xyq.cbg.163.com/cgi-bin/query.py?*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         0.3
// @run-at          document-idle
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/401646/%E6%A2%A6%E5%B9%BB%E8%A5%BF%E6%B8%B8%E8%97%8F%E5%AE%9D%E9%98%81%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/401646/%E6%A2%A6%E5%B9%BB%E8%A5%BF%E6%B8%B8%E8%97%8F%E5%AE%9D%E9%98%81%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //输入参数的初始化
    var gold2money = localStorage.TM_gold2money;
    var money2rmb = localStorage.TM_money2rmb;
    var xlgmoney = localStorage.TM_xlgmoney;
    console.log(xlgmoney);
    if(!gold2money){
        gold2money = 0.8;
        localStorage.TM_gold2money = gold2money;
        console.log("初始化转换比："+gold2money);
    }
    if(!money2rmb){
        money2rmb = 285.0;
        localStorage.TM_money2rmb = money2rmb;
        console.log("初始化金价："+money2rmb);
    }
    if(!xlgmoney){
        xlgmoney = 64.0;
        localStorage.TM_xlgmoney = xlgmoney;
        console.log("初始化修炼果单价："+xlgmoney);
    }


    var getMenpaiStr = document.getElementsByClassName('searchForm')[0].getElementsByTagName('th')[0].textContent;
    if(getMenpaiStr == "门派："){     //根据搜索框中的门派字样判断是否为人物页面
        $(document).ready(function(){
        var newElement = "<tr>";
            newElement += "<td colspan='10' align='right'>&nbsp;转换比(现金/储备金)：";
            newElement += "<input type='text' class='txt1' size='3' id='txt_gold2money' value="+gold2money+">";
            newElement += "&nbsp;&nbsp;金价(RMB/三千万MHB)：";
            newElement += "<input type='text' class='txt1' size='6' id='txt_money2rmb' value="+money2rmb+">";
            newElement += "&nbsp;&nbsp;修炼果(万MHB)：";
            newElement += "<input type='text' class='txt1' size='4' id='txt_xlgmoney' value="+xlgmoney+">";
            newElement += "&nbsp;&nbsp;&nbsp;&nbsp; <input type='button' id='helperBtn' class='btn1' value='计算'></td>";
            newElement += "</tr>";
            $("tbody")[0].lastChild.after($(newElement)[0]);
            addBtnEvent("helperBtn");
        });
    }

    var objPrev = {'gold2money':null,'money2rmb':null,'xlgmoney':null}; //全局，保存上次计算参数

    function addBtnEvent(id){
        $("#"+id).bind("click",function(){
            if(isFinish(objPrev) === true){
                alert("计算已经完成");
            }
            else{
                var obj = getInput();
                newPriceList(obj.gold2money,obj.money2rmb,obj.xlgmoney);
                objPrev = obj;
            }
        });
    }

    //判断是否完成计算
    function isFinish(obj){
        var temp1 = parseFloat($("input:text[id='txt_gold2money']").val());
        var temp2 = parseFloat($("input:text[id='txt_money2rmb']").val());
        var temp3 = parseFloat($("input:text[id='txt_xlgmoney']").val());
        if(temp1==obj.gold2money && temp2==obj.money2rmb && temp3==obj.xlgmoney) return true;
        else return false;
    }

    function getInput(){
        var gold2money = null;
        var money2rmb = null;
        var xlgmoney = null;
        var reg = /(^\d+(\.\d+)?$)|(^[0-9]*$)/;  //正浮点数和正整数

        let temp = $("input:text[id='txt_gold2money']").val();
        if(temp=="") {
            gold2money = localStorage.TM_gold2money; //没有输入时的默认值
        }
        else {
            if(reg.test(temp)==true){
                gold2money = parseFloat(temp);
                localStorage.TM_gold2money = gold2money; //变更本地存储
                if(gold2money>1){
                    alert("转换比请取值 0~1 之间");
                    return false;
                }
            }
            else{
                alert("请输入数字");
                return false;
            }
        }

        temp = $("input:text[id='txt_money2rmb']").val(); //每三千万￥285
        if(temp=="") {
            money2rmb = localStorage.TM_money2rmb; //没有输入时的默认值
        }
        else {
            if(reg.test(temp)==true){
                money2rmb = parseFloat(temp);
                localStorage.TM_money2rmb = money2rmb;
                if(money2rmb>1000){
                    alert("金价过高请取 1000 以内");
                    return false;
                }
            }
            else{
                alert("请输入数字");
                return false;
            }
        }

        temp = $("input:text[id='txt_xlgmoney']").val();
        if(temp=="") {
            xlgmoney = localStorage.TM_xlgmoney; //没有输入时的默认值
        }
        else {
            if(reg.test(temp)==true){
                xlgmoney = parseFloat(temp);
                localStorage.TM_xlgmoney = xlgmoney;
                if(xlgmoney>100){
                    alert("修炼果取值过大>100");
                    return false;
                }
                if(xlgmoney<10){
                    alert("修炼果取值过小<10");
                    return false;
                }
            }
            else{
                alert("请输入数字");
                return false;
            }
        }

        return {
            'gold2money': gold2money,
            'money2rmb': money2rmb,
            'xlgmoney': xlgmoney
        }
    }

    // 刷新计算价格列表
    function newPriceList(gold2money,money2rmb,xlgmoney){
        var list = document.getElementById('soldList').getElementsByTagName('tr');
        for (var i=0;i<list.length;i++){
            var price = calPrice(list[i],gold2money,money2rmb,xlgmoney);
            addCalPrice(list[i],price);
        }
    }

    // 角色售价末尾添加计算值
    function addCalPrice(role,price){
        var priceClass = ['p100','p1000','p10000','p100000','p1000000'];
        for (var i=0;i<priceClass.length;i++){
            var oldPrice=role.getElementsByClassName(priceClass[i]);
            if(oldPrice.length > 0 ){
                if(oldPrice[0].parentNode.children[1].nodeName != "SPAN"){ //判断是否存在计算价格
                    let newElement = document.createElement('span');
                    newElement.innerHTML = "【"+price.toFixed(2)+"】";
                    for(let j=4;j>-1;j--){
                        if(price<Math.pow(10,j+2)) newElement.className = priceClass[j];  //可以改变计算价格的显示颜色
                    }
                    oldPrice[0].parentNode.insertBefore(newElement, oldPrice[0].nextSibling); //售价后添加计算值
                    break; //添加价格后立即退出循环
                }
                else {
                    let newElement = document.createElement('span');
                    newElement.innerHTML = "【"+price.toFixed(2)+"】";
                    for(let j=4;j>-1;j--){
                        if(price<Math.pow(10,j+2)) newElement.className = priceClass[j];
                    }
                    oldPrice[0].parentNode.replaceChild(newElement,oldPrice[0].parentNode.children[1]); //售价后添加计算值
                    break;
                }
            }
        }
    }

    // 师门技能学习金钱消耗
    var schoolSkiGold = [6,12,19,28,38,51,67,86,110,139,174,216,266,325,393,472,563,667,786,919,1070,1238,1426,1636,1868,2124,2404,2714,3050,3420,3820,4255,4725,5234,5783,6374,7009,7690,8419,9199,10032,10920,11865,12871,13938,15070,16270,17540,18882,20299,21795,23371,25031,26777,28613,30541,32565,34687,36911,39240,41676,44224,46886,49666,52568,55595,58749,62036,65458,69019,72723,76574,80575,84730,89043,93518,98160,102971,107956,113119,118465,123998,129721,135640,141758,148080,154611,161355,168316,175500,182910,190551,198429,206548,214913,223529,232400,241533,250931,260599,270544,280770,291283,302087,313188,324592,336303,348328,360672,373339,386337,399671,413346,427368,441743,456477,471576,487045,502891,519120,535737,552749,570163,587984,606218,624873,643954,663468,683421,703819,724671,745981,767757,790005,812733,835947,859653,883860,908573,933799,959547,985822,1012633,1039986,1067888,1096347,1125371,1154965,1185139,1215900,2494508,2558419,2623549,2689914,2757527,4239607,4344845,4452027,4561177,4672319,450041,4594563,4680138,4766769,4854465,4943226,5033064,5123985,5215995,5309100,7204407,7331490,7460064,7590129,7721700,9818475,9986727,10156893,10328979,12252600];
    // 修炼所需经验，每点需金钱2w（法抗物抗）3w（攻法猎）
    var exptSkiGold = [15,21,29,39,51,65,81,99,119,141,165,191,219,249,281,315,351,389,429,471,515,561,609,659,711];

    // 角色技能修炼消耗计算
    function calPrice(role,gold2money,money2rmb,xlgmoney){
        var roleInfo = role.getElementsByTagName("textarea");//获得角色基本信息
        var roleObj = JSON.parse(roleInfo[0].value); //转换成对象

        //角色修炼  【gold储备金 money现金 rmb人民币】
        var exptGold = [30000, 20000, 30000, 20000, 30000]; // 攻 防 法 抗法 猎
        var exptSki=[roleObj.iExptSki1,roleObj.iExptSki2,roleObj.iExptSki3,roleObj.iExptSki4,roleObj.iExptSki5];
        var exptSkiGoldSum = 0;
        for(var i=0;i<5;i++) exptSkiGoldSum += exptSkiGold.sum(exptSki[i])*exptGold[i];
        //修炼上限
        var exptSkiMaxGoldSum = 0;
        var iMaxExpt = [roleObj.iMaxExpt1,roleObj.iMaxExpt2,roleObj.iMaxExpt3,roleObj.iMaxExpt4];
        for(i=0;i<4;i++) exptSkiMaxGoldSum += goldLoss(iMaxExpt[i])*exptGold[i]

        function goldLoss(maxExpt){
            var goldLoss = 0;
            switch(maxExpt-20){
                case 0: goldLoss = 0;break;
                case 1: goldLoss = exptSkiGold[12];break; //损失修炼等级13
                case 2: goldLoss = exptSkiGold[12]+exptSkiGold[13];break;
                case 3: goldLoss = exptSkiGold[13]+exptSkiGold[14]+exptSkiGold[15];break;
                case 4: goldLoss = exptSkiGold[14]+exptSkiGold[15]+exptSkiGold[16]+exptSkiGold[17];break;
                case 5: goldLoss = exptSkiGold[14]+exptSkiGold[15]+exptSkiGold[16]+exptSkiGold[17]+exptSkiGold[22];break;
            }
            return goldLoss;
        }

        //宠物修炼
        var beastSki = [roleObj.iBeastSki1,roleObj.iBeastSki2,roleObj.iBeastSki3,roleObj.iBeastSki4];
        var SumExp=0;
        for(i=0;i<4;i++) SumExp += exptSkiGold.sum(beastSki[i]);
        var beastSkiMoney = Math.ceil(SumExp/15)*xlgmoney*10000;

        //角色师门
        var schoolSki = [];
        for(i=1;i<133;i++){
            if(typeof(roleObj.all_skills[i]) == "number"){
                var sn = schoolSki.push(Math.min(roleObj.all_skills[i],180));//技能大于180的为符石加成不考虑，低等级的符石加成暂不处理。
                if(sn == 7)break;  //找到全部7个技能等级跳出循环
            }
        }

        var schoolSkiGoldSum = 0;
        for(i=0;i<7;i++) schoolSkiGoldSum += schoolSkiGold.sum(schoolSki[i]);


        //生活技能 只考虑40级以上  201-218；230//普通，打造技巧，强身，灵石，强壮
            //普通 最大160，前150为师门花费的一半  淬灵之术231 没查到当普通处理
        var comLifeSkiGold = [3,6,9,14,19,25,33,43,55,69,87,108,133,162,196,236,281,333,393,459,535,619,713,818,934,1062,1202,1357,1525,1710,1910,2127,2362,2617,2891,3187,3504,3845,4209,4599,5016,5460,5932,6435,6969,7535,8135,8770,9441,10149,10897,11685,12515,13388,14306,15270,16282,17343,18455,19620,20838,22112,23443,24833,26284,27797,29374,31018,32729,34509,36361,38287,40287,42365,44521,46759,49080,51485,53978,56559,59232,61999,64860,67820,70879,74040,77305,80677,84158,87750,91455,95275,99214,103274,107456,111764,116200,120766,125465,130299,135272,140385,145641,151043,156594,162296,168151,174164,180336,186669,193168,199835,206673,213684,220871,228238,235788,243522,251445,259560,267868,276374,285081,293992,303109,312436,321977,331734,341710,351909,362335,372990,383878,395002,406366,417973,429826,441930,454286,466899,479773,492911,506316,519993,533944,548173,562685,577482,592569,607950,997803,1023367,1049419,1075965,1103010,1695843,1737938,1780810,1824471,1868927];
            //打造204 前150同普通，151-160有区别
        var daZaoGold = [3,6,9,14,19,25,33,43,55,69,87,108,133,162,196,236,281,333,393,459,535,619,713,818,934,1062,1202,1357,1525,1710,1910,2127,2362,2617,2891,3187,3504,3845,4209,4599,5016,5460,5932,6435,6969,7535,8135,8770,9441,10149,10897,11685,12515,13388,14306,15270,16282,17343,18455,19620,20838,22112,23443,24833,26284,27797,29374,31018,32729,34509,36361,38287,40287,42365,44521,46759,49080,51485,53978,56559,59232,61999,64860,67820,70879,74040,77305,80677,84158,87750,91455,95275,99214,103274,107456,111764,116200,120766,125465,130299,135272,140385,145641,151043,156594,162296,168151,174164,180336,186669,193168,199835,206673,213684,220871,228238,235788,243522,251445,259560,267868,276374,285081,293992,303109,312436,321977,331734,341710,351909,362335,372990,383878,395002,406366,417973,429826,441930,454286,466899,479773,492911,506316,519993,533944,548173,562685,577482,592569,607950,623627,639604,655887,672478,689381,706601,724140,742004,760196,778719];
            //强身201 最大140 前120同普通，121-140有区别
        var qiangShenGold = [3,6,9,14,19,25,33,43,55,69,87,108,133,162,196,236,281,333,393,459,535,619,713,818,934,1062,1202,1357,1525,1710,1910,2127,2362,2617,2891,3187,3504,3845,4209,4599,5016,5460,5932,6435,6969,7535,8135,8770,9441,10149,10897,11685,12515,13388,14306,15270,16282,17343,18455,19620,20838,22112,23443,24833,26284,27797,29374,31018,32729,34509,36361,38287,40287,42365,44521,46759,49080,51485,53978,56559,59232,61999,64860,67820,70879,74040,77305,80677,84158,87750,91455,95275,99214,103274,107456,111764,116200,120766,125465,130299,135272,140385,145641,151043,156594,162296,168151,174164,180336,186669,193168,199835,206673,213684,220871,228238,235788,243522,251445,259560,247868,276374,285081,293992,303109,331734,312436,321977,351909,341710,362335,372990,383878,395002,406366,417973,429826,441930,454286,466899];
            //灵石218 最大120
        var lingShiGold = [189,225,267,314,367,428,495,571,654,747,849,962,1085,1220,1368,1528,1702,1890,2093,2313,2549,2803,3076,3367,3679,4012,4368,4746,5148,5575,6028,6508,7015,7552,8119,8718,9348,10012,10711,11445,12216,13026,13875,14764,15696,16670,17689,18754,19866,21027,22237,23499,24814,26183,27607,29089,30629,32230,33892,35617,37407,39264,41188,43182,45247,47386,49599,51888,54256,56703,59232,61844,64542,67326,70200,73164,76220,79371,82619,85965,134117,139440,144919,150558,156359,162326,168462,174769,181252,187913,194755,201782,208997,216403,224003,231802,239802,248007,256421,265046,273886,282945,292227,301734,311472,321442,331649,342097,352790,363731,374923,386372,398080,410052,422291,434802,447588,460654,474003,487640];
            //强壮230 最大40 同神速237
        var qiangZhuangGold = [430000,495000,570000,655000,750000,855000,970000,1095000,1230000,1375000,1530000,1870000,2250000,1695000,2455000,2055000,2670000,2895000,3130000,3375000,3630000,3895000,4455000,4170000,4750000,5055000,5695000,5370000,6030000,6730000,7095000,6375000,7470000,7855000,9070000,8250000,8655000,9495000,9930000,10375000];

        var lifeSki = [];
        //201: "强身术",202: "冥想",203: "暗器技巧",204: "打造技巧",205: "裁缝技巧",206: "中药医理",
        //207: "炼金术",208: "烹饪技巧",209: "追捕技巧",210: "逃离技巧",211: "养生之道",212: "健身术",
        //216: "巧匠之术",217: "熔炼技巧",218: "灵石技巧",230: "强壮",231: "淬灵之术",237: "神速"
        for(i=201;i<218;i++) lifeSki.push(typeof(roleObj.all_skills[i.toString()])==="number"?roleObj.all_skills[i.toString()]:0);
        lifeSki.push(typeof(roleObj.all_skills['231'])==="number"?roleObj.all_skills['231']:0);

        lifeSki.push(typeof(roleObj.all_skills['218'])==="number"?roleObj.all_skills['218']:0);
        lifeSki.push(typeof(roleObj.all_skills['230'])==="number"?roleObj.all_skills['230']:0);
        lifeSki.push(typeof(roleObj.all_skills['237'])==="number"?roleObj.all_skills['237']:0);

        //调整顺序 为强身，打造，暗器，冥想...
        var tem=0;
        tem=lifeSki[1];
        lifeSki[1]=lifeSki[3];
        lifeSki[3]=tem;

        var lifeSkiGoldSum = 0;
        for(i=2;i<lifeSki.length-3;i++) lifeSkiGoldSum += comLifeSkiGold.sum(lifeSki[i]>40?lifeSki[i]:0);
        lifeSkiGoldSum += qiangShenGold.sum(lifeSki[0]>40?lifeSki[0]:0);
        lifeSkiGoldSum += daZaoGold.sum(lifeSki[1]>40?lifeSki[1]:0);
        lifeSkiGoldSum += lingShiGold.sum(lifeSki[lifeSki.length-3]>40?lifeSki[lifeSki.length-3]:0);
        lifeSkiGoldSum += qiangZhuangGold.sum(lifeSki[lifeSki.length-2]);
        lifeSkiGoldSum += qiangZhuangGold.sum(lifeSki[lifeSki.length-1]);

        var lifeBG = [];
        for(i=0;i<160;i++) lifeBG.push(i+1);
        var lifeSkiBGSum = 0;
        for(i=0;i<lifeSki.length;i++) lifeSkiBGSum += lifeBG.sum(lifeSki[i]>40?lifeSki[i]:0);

        //返回金钱总消耗
        var rmbPrice = ((exptSkiGoldSum+schoolSkiGoldSum+exptSkiMaxGoldSum+lifeSkiGoldSum)*gold2money+beastSkiMoney)*money2rmb/3000e4+lifeSkiBGSum/50.0;
        return rmbPrice;

    }

    //数组前 n 项合
    Array.prototype.sum = function(n){
        for(var sum=0,i=0;i<n;i++) sum+=parseInt(this[i]);
        return sum ;
    };



})();
