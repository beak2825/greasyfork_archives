// ==UserScript==
// @name         FGO Wiki从者NP获取率TOP5显示 for mooncell
// @namespace    https://xianlechuanshuo.github.io/fgo/updatescripts/NP%20top5%20scirpt%20for%20mooncell%20wiki.js
// @version      1.0
// @description  FGO Wiki从者NP获取率TOP5显示(敌补正默认为1，支持宝具NP回收率计算，此外被动Buff也会自动加载)
// @author       xianlechuanshuo
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.js
// @match        *://mooncell.wiki/w/*
// @match        *://fgo.wiki/w/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388555/FGO%20Wiki%E4%BB%8E%E8%80%85NP%E8%8E%B7%E5%8F%96%E7%8E%87TOP5%E6%98%BE%E7%A4%BA%20for%20mooncell.user.js
// @updateURL https://update.greasyfork.org/scripts/388555/FGO%20Wiki%E4%BB%8E%E8%80%85NP%E8%8E%B7%E5%8F%96%E7%8E%87TOP5%E6%98%BE%E7%A4%BA%20for%20mooncell.meta.js
// ==/UserScript==

var jQ1 = jQuery.noConflict();
var Global_wiki={};
jQ1(function() {
        'use strict';
         let no=parseInt(jQ1(".wikitable.nomobile th:contains('No.')").text().replace("No.", ""));

        if (isNaN(no)) {
              console.log(`【${no}】不是数字`);
              return;
        }
        let isOK=loadNpData(no);
        if(!isOK){
            console.log("nps.json文件未更新");
            return;
        };


        let cardBox=jQ1(".wikitable.nomobile th:contains('指令卡')").next();
        let tmpNpObj=Global_wiki.tmpNpObj;
        let npObj = {
               no:no,
                arts: {
                        hit: tmpNpObj.ah,
                        num:cardBox.find("img[data-src*=Arts]").length,
                        np: tmpNpObj.anp
                },
                buster: {
                        hit: tmpNpObj.bh,
                        num: cardBox.find("img[data-src*=Buster]").length,
                        np: tmpNpObj.bnp
                },
                quick: {
                        hit: tmpNpObj.qh,
                        num: cardBox.find("img[data-src*=Quick]").length ,
                        np: tmpNpObj.qnp
                },
                ex: {
                        hit: tmpNpObj.exh,
                        np: tmpNpObj.exnp
                },
                treasure:{
                       hit:tmpNpObj.h,
                       np:tmpNpObj.np,
                       card:tmpNpObj.t
                },
                careerSkill:{
                       artsBuff:tmpNpObj.a,
                       quickBuff:tmpNpObj.q
                }
        };
        Global_wiki.npObj=npObj;


let optionsHtml=`<tr class='trCalcBox' data-show='0'><td colspan='12'>
                        <div class='calcBox'>
                            <ul>
                                <li>BUFF</li>
                                <li>
                                    NP获得提升(%)：<input type='number' id='txtNpBuff' value='0'>
                                    蓝魔放(%)：<input type='number' id='txtArtsBuff' value='0'>
                                    绿魔放(%)：<input type='number' id='txtQuickBuff' value='0'>
                                    <label for='ckSpecialSkill1'><input id='ckSpecialSkill1' type='checkbox'>第五势</label>
                                </li>
                            </ul>
                            <ul>
                                <li>首卡</li>
                                <li>
                                    <label for='ckIsOverkill_first'><input id='ckIsOverkill_first' type='checkbox'>鞭尸</label>
                                </li>
                                <li>
                                    <label for='ckIsCritical_first'><input id='ckIsCritical_first' type='checkbox'>暴击</label>
                                </li>
                            </ul>
                            <ul>
                                <li>次卡</li>
                                <li>
                                    <label for='ckIsOverkill_second'><input id='ckIsOverkill_second' type='checkbox'>鞭尸</label>
                                </li>
                                <li>
                                    <label for='ckIsCritical_second'><input id='ckIsCritical_second' type='checkbox'>暴击</label>
                                </li>
                            </ul>
                            <ul>
                                <li>尾卡</li>
                                <li>
                                    <label for='ckIsOverkill_third'><input id='ckIsOverkill_third' type='checkbox'>鞭尸</label>
                                </li>
                                <li>
                                    <label for='ckIsCritical_third'><input id='ckIsCritical_third' type='checkbox'>暴击</label>
                                </li>
                            </ul>
                            <ul>
                                <li>EX</li>
                                <li>
                                    <label for='ckIsOverkill_ex'><input id='ckIsOverkill_ex' type='checkbox'>鞭尸</label>
                                </li>
                            </ul>
                            <ul class='treasureHit'>
                                <li>
                                宝具Hit数：<input type='number' id='txtTreasureHit' min='${Math.min(1,npObj.treasure.hit)}' max='${npObj.treasure.hit}' value='0' disabled>&nbsp;
                                <label for='ckIsOverkill_treasure'><input id='ckIsOverkill_treasure' type='checkbox'>鞭尸</label>&nbsp;
                                敌人数量：<input id='enemyNum' step='1' type='range' min='1' max='3' value='1'><span id='spanEnemyNum'>1</span>&nbsp;
                                宝具NP回收率(%)：<span id='spanTreasureNP'>0</span>&nbsp;
                                <label for='ckIsIgnoreTreasure'><input id='ckIsIgnoreTreasure' type='checkbox'>忽略宝具组合</label>
                                </li>
                            </ul>
                        </div>
                    </td></tr>`;

        let tempArr = ["宝"],
        a = npObj.arts,
        b = npObj.buster,
        q = npObj.quick;

        for (let i = 0; i < a.num; i++) {
                tempArr.push("A");
        }
        for (let i = 0; i < b.num; i++) {
                tempArr.push("B");
        }
        for (let i = 0; i < q.num; i++) {
                tempArr.push("Q");
        }

        let tempArr1 = tempArr,
        tempArr2 = tempArr.slice(0),
        tempArr3 = tempArr.slice(0),
        cardArr = [];

        tempArr1.forEach(function(a1, i) {
                //i≠j≠k
                tempArr2.forEach(function(b1, j) {
                        tempArr3.forEach(function(q1, k) {
                                if (i != j && i != k && j != k) cardArr.push(a1 + b1 + q1);
                        });
                });
        });
        //总共42或34种组合(去重后)
        cardArr = Array.from(new Set(cardArr));
        Global_wiki.cardArr = cardArr;

        let npArr = [];
        cardArr.forEach(function(res) {
                // abq
                let npObj = calcCardNp(res);
                npArr.push(npObj);
        });

        npArr = npArr.sort(compare("totalNp"));
        let parent = jQ1(".wikitable.nomobile th:contains('指令卡')").parent().parent().eq(0),
        head = jQ1("<tr><td colspan='8' style='background-color:#e6eaeb'>NP获取率TOP<span class='spanTopTimes'>5</span>(敌补正为<span class='spanEnemyCorrections'>1</span>)</td></tr>"),
        contenHtml = "<tr><td colspan='8' class='calcResult'>",
        img = jQ1("<img class='btnCalc' src='https:\/\/xianlechuanshuo.github.io\/photo\/icon\/calc.png'></img>");
        parent.append(head);
        img.css({
                "vertical-align": "middle",
                "width": "27px",
                "height": "27px"
        });
        head.children("td").append(img);
        for (let i = 0; i < npArr.length; i++) {
                let npObj = npArr[i],
                cardStr = npObj.cardStr;
                if (!cardStr.includes("宝")) cardStr = "&nbsp;" + cardStr;
                if (i == 5) break;
                contenHtml+=getContentHtml(cardStr,npObj);
        }
        contenHtml += "</td></tr>";
        head.after(contenHtml);
        head.after(optionsHtml);
        head.after("<datalist id='dlEnemyCorrectionsTips'><option value='1'>默认</option><option value='0.8'>狂</option><option value='0.9'>杀</option><option value='1.1'>骑</option><option value='1.2'>术、月</option></datalist>");

        //设置默认值
        jQ1("#txtTreasureHit").val(npObj.treasure.hit);
        jQ1("#txtArtsBuff").val(npObj.careerSkill.artsBuff);
        jQ1("#txtQuickBuff").val(npObj.careerSkill.quickBuff);

        let treasureNp=calcTreasureNP(npObj.treasure.card);
        jQ1("#spanTreasureNP").text(treasureNp);

        //追加样式
        jQ1(".trCalcBox").css({
                "display": "none"
        });
        jQ1(".calcBox").css({
                "height": "150px",
                "margin": "0 auto",
                "text-align": "left",
                "padding": "10px 0 0 30px"
        });
        jQ1(".calcBox>ul,.calcBox input[type=checkbox]").css({
                "list-style": "none",
                "margin": "0",
                "padding": "0"
        });
        jQ1(".calcBox input[type=number]").css({
                "text-align": "center"
        });
        jQ1(".calcBox>ul:not(:nth-child(1))").css({
                "float": "left",
                "width": "125px"
        });
        jQ1(".calcBox>ul:last-child").css({
                "clear": "both",
                "width": "100%"
        });
        jQ1(".calcBox>ul>li:not(:nth-child(1))").css({
                "padding-left": "30px"
        });
        jQ1(".calcBox input").css({
                "vertical-align": "middle"
        });
        jQ1(".calcBox input[type=number]").css({
                "width": "50px"
        });
        setFixWidth();

        if (no != "153") { //武藏
                jQ1(".calcBox label[for=ckSpecialSkill1]").hide();
        }
        //设置点击计算器图标事件
        jQ1(".btnCalc").click(function() {
                let show = jQ1(".trCalcBox").data("show");
                if (show == "0") { //原本隐藏状态，现在要显示
                        jQ1(".trCalcBox").show();
                        jQ1(".spanTopTimes").html(` <input type='number' id='txtTopTimes' value='5'/>`);
                        jQ1(".spanEnemyCorrections").html(` <input type='number' id='txtEnemyCorrections' step='0.1' value='1' list='dlEnemyCorrectionsTips'/>`);
                        jQ1("#txtTopTimes,#txtEnemyCorrections").bind("input propertychange",
                        function() {
                                reCalc();
                        });
                        jQ1("#txtTopTimes,#txtEnemyCorrections").css({
                                "color": "#000",
                                "width": "50px",
                                "text-align": "center"
                        });
                        let treasureHit = Global_wiki.npObj.treasure.hit;
                        jQ1("#txtTreasureHit").val(treasureHit);


                } else { //原本显示状态，现在要隐藏
                        jQ1("#txtTreasureHit").prop("disabled",true);
                        jQ1(".trCalcBox").hide();
                        jQ1("#txtNpBuff").val("0");
                        jQ1("#txtTreasureHit").val(Global_wiki.npObj.treasure.hit); //恢复宝具Hit数默认值
                        jQ1("#txtArtsBuff").val(Global_wiki.npObj.careerSkill.artsBuff); //恢复被动蓝卡BUFF
                        jQ1("#txtQuickBuff").val(Global_wiki.npObj.careerSkill.quickBuff); //恢复被动绿卡BUFF
                        jQ1(".calcBox input[type=checkbox]").prop("checked", false);
                        jQ1(".spanEnemyCorrections").html("1");
                        jQ1(".spanTopTimes").html("5");
                        jQ1("#enemyNum").val("1");
                        jQ1("#spanEnemyNum").html("1");
                        reCalc();

                }
                jQ1(".trCalcBox").data("show", show == "0" ? "1": "0");

        });

        //绑定【NP获得提升】、【蓝魔放】、【绿魔放】输入内容改变事件
        jQ1(".calcBox input[type=number]").bind("input propertychange",
        function() {
                reCalc();
        });

        //绑定【第五势】勾选状态切换事件
        jQ1("#ckSpecialSkill1").change(function() {
                let checked = jQ1("#ckSpecialSkill1").prop("checked");
                if (checked) {
                        Global_wiki.npObj.arts.hit *= 2;
                        Global_wiki.npObj.buster.hit *= 2;
                        Global_wiki.npObj.quick.hit *= 2;
                        Global_wiki.npObj.ex.hit *= 2;
                } else {
                        Global_wiki.npObj.arts.hit = parseInt(jQ1(".ArtHit").text());
                        Global_wiki.npObj.buster.hit = parseInt(jQ1(".BusterHit").text());
                        Global_wiki.npObj.quick.hit = parseInt(jQ1(".QuickHit").text());
                        Global_wiki.npObj.ex.hit = parseInt(jQ1(".ExtraHit").text());
                }
                reCalc();
        });

        //绑定【鞭尸】、【暴击】、【忽略宝具组合】勾选状态切换事件
        jQ1(".calcBox input[type=checkbox]:not(#ckSpecialSkill1,#ckIsOverkill_treasure)").change(function() {
                reCalc();
        });
        jQ1("#ckIsOverkill_treasure").change(function() {
                let checked=jQ1(this).prop("checked");
                if(!checked){
                    jQ1("#txtTreasureHit").val(jQ1("#txtTreasureHit").prop("max"));
                }
                jQ1("#txtTreasureHit").prop("disabled",!checked);
                reCalc();
        });

        jQ1("#txtTreasureHit").bind("input propertychange",function(){
                    let input=parseInt(jQ1(this).val());
                    let min= jQ1(this).prop("min");
                    let max=jQ1(this).prop("max");
                    if(input<min){
                         jQ1(this).val(min);
                    }
                    else if(input>max){
                         jQ1(this).val(max);
                    }
                    reCalc();
        });

       jQ1("#enemyNum").bind("input propertychange",function(){
             jQ1("#spanEnemyNum").html(jQ1(this).val());
             reCalc();
       });
});


function setFixWidth(){
        jQ1(".fixWidth").css({
            "display":"inline-block",
            "width":"120px",
            "text-align":"left"
        });
}

function getContentHtml(cardStr,npObj){
  return `<span class='fixWidth'>${cardStr}+EX：</span> <span class='fixWidth'>首卡：${npObj.first}</span> <span class='fixWidth'>次卡：${npObj.second}</span> <span class='fixWidth'>尾卡：${npObj.third}</span><span class='fixWidth'> EX：${npObj.ex} </span><span class='fixWidth'>总计:${npObj.totalNp}</span><br>`;
}

function reCalc() {
        'use strict';
        let cardArr = Global_wiki.cardArr;
        let npArr = [];
        cardArr.forEach(function(res) {
                // abq
                if (! (jQ1("#ckIsIgnoreTreasure").prop("checked") && res.includes("宝"))) {
                        let npObj = calcCardNp(res);
                        npArr.push(npObj);
                }
        });
        npArr = npArr.sort(compare("totalNp"));
        jQ1(".calcResult").empty();

        let contenHtml = "";
        for (let i = 0; i < npArr.length; i++) {
                let npObj = npArr[i],
                cardStr = npObj.cardStr;
                if (!cardStr.includes("宝")) cardStr = "&nbsp;" + cardStr;
                let topTimes=jQ1("#txtTopTimes").val();
                topTimes=isNaN(topTimes)?5:topTimes;
                if (i ==topTimes) break;
                contenHtml +=getContentHtml(cardStr,npObj);
        }
        let t = Global_wiki.npObj.treasure,
        treasureNP = calcTreasureNP(t.card);
        jQ1("#spanTreasureNP").text(treasureNP);
        jQ1(".calcResult").html(contenHtml);
        setFixWidth();
}
function loadNpData(no){
       'use strict';
        let isOk = false;
        jQ1.ajaxSettings.async = false; //同步执行
        jQ1.getJSON('https://xianlechuanshuo.github.io/fgo/js/nps.json', {
                rd: Math.random()
        },
        function(data, textStatus) {
                if (textStatus == "success") {
                        for (let i = 0; i < data.length; i++) {
                                if (data[i].n == no) {
                                        Global_wiki.tmpNpObj=data[i];
                                        isOk = true;
                                        break;
                                }
                        }
                   }
          });
        jQ1.ajaxSettings.async = true; //异步执行
        return isOk;
}

function getIsOverkillAndisCritical(position) {
        'use strict';
        let ckIsOverkill_first = jQ1("#ckIsOverkill_first").prop("checked"),
        ckIsCritical_first = jQ1("#ckIsCritical_first").prop("checked"),
        ckIsOverkill_second = jQ1("#ckIsOverkill_second").prop("checked"),
        ckIsCritical_second = jQ1("#ckIsCritical_second").prop("checked"),
        ckIsOverkill_third = jQ1("#ckIsOverkill_third").prop("checked"),
        ckIsCritical_third = jQ1("#ckIsCritical_third").prop("checked"),
        ckIsOverkill_ex = jQ1("#ckIsOverkill_ex").prop("checked"),
        isOverkill = 1,
        isCritical = 1;
        switch (position) {
        case 1:
                //1位
                isOverkill = ckIsOverkill_first === true ? 1.5 : 1;
                isCritical = ckIsCritical_first === true ? 2 : 1;
                break;
        case 2:
                //2位
                isOverkill = ckIsOverkill_second === true ? 1.5 : 1;
                isCritical = ckIsCritical_second === true ? 2 : 1;
                break;
        case 3:
                //3位
                isOverkill = ckIsOverkill_third === true ? 1.5 : 1;
                isCritical = ckIsCritical_third === true ? 2 : 1;
                break;
        case 4:
                //四位EX
                isOverkill = ckIsOverkill_ex === true ? 1.5 : 1;
                break;
        }
        return {
                isOverkill: isOverkill,
                isCritical: isCritical
        };
}

function calcTreasureNP(card) {
        'use strict';
        // NP獲得量 = 基本NP獲得率(baseNp) × [(卡片倍率 x (1 ± 卡片性能Buff)] × (1 + NP獲得量Buff)
        // × Overkill補正 × 攻擊Hit數 × 敌补正(假设为1)
        // console.log("calcTreasureNP card:"+card);
        let cardObj = getTreasureDetials(card);
        // console.log(cardObj);
        let isOverkill = jQ1("#ckIsOverkill_treasure").prop("checked");
        if(isOverkill===undefined) isOverkill=false;

        let enemyNum= jQ1("#enemyNum").val();
        if(enemyNum===undefined)enemyNum=1;

        let totalTreasureNp=0;
        if(isOverkill){
                // isOverkill = jQ1("#ckIsOverkill_treasure").prop("checked") === true ? 1.5 : 1,
                let overkillHits=parseInt(jQ1("#txtTreasureHit").val());
                if(overkillHits<0||overkillHits>cardObj.hit){
                    jQ1("#txtTreasureHit").val(cardObj.hit);
                    overkillHits=cardObj.hit;
                }
                let overkillNp=cardObj.baseNp * [cardObj.cardRate * (1 + cardObj.cardBuff)] * (1 + cardObj.npBuff) * 1.5 * overkillHits * cardObj.enemyCorrections;
                let unoverkillNp=cardObj.baseNp * [cardObj.cardRate * (1 + cardObj.cardBuff)] * (1 + cardObj.npBuff) * 1 * (cardObj.hit-overkillHits) * cardObj.enemyCorrections;
                totalTreasureNp=overkillNp+unoverkillNp;
        }
        else{
               totalTreasureNp=cardObj.baseNp * [cardObj.cardRate * (1 + cardObj.cardBuff)] * (1 + cardObj.npBuff) * 1 * cardObj.hit * cardObj.enemyCorrections;
        }
        return Math.floor(totalTreasureNp * enemyNum * 100) / 100;
}

function getTreasureDetials(card) {
        let t = Global_wiki.npObj.treasure,
        c = Global_wiki.npObj.careerSkill;

        if (card == "宝") card = t.card;

        let treasureHit = t.hit,
        artsBuff = jQ1("#txtArtsBuff").length === 0 ? c.artsBuff / 100 : parseFloat(jQ1("#txtArtsBuff").val()) / 100,
        quickBuff = jQ1("#txtQuickBuff").length === 0 ? c.quickBuff / 100 : parseFloat(jQ1("#txtQuickBuff").val()) / 100,
        cardBuff = 0,
        npBuff = jQ1("#txtNpBuff").length === 0 ? 0 : parseFloat(jQ1("#txtNpBuff").val()) / 100,
        enemyCorrections = jQ1("#txtEnemyCorrections").length === 0 ? 1 : parseFloat(jQ1("#txtEnemyCorrections").val()),
        cardRate = 0;
        switch (card) {
        case "A":
                cardRate = 3;
                cardBuff = artsBuff;
                break;
        case "B":
                cardRate = 0;
                break;
        case "Q":
                cardRate = 1;
                cardBuff = quickBuff;
                break;
        }

        return {
                cardRate: cardRate,
                baseNp: t.np,
                hit: treasureHit,
                cardBuff: cardBuff,
                npBuff: npBuff,
                enemyCorrections: enemyCorrections
        };

}

// 计算单卡NP
function calcSingleCardNp(firstCardReward, card, position) {
        'use strict';
        // NP獲得量 = 基本NP獲得率(baseNp) × [(首卡加成 + 卡片倍率 x (1 ± 卡片性能Buff)] × (1 + NP獲得量Buff)
        // × Critical補正 × Overkill補正 × 攻擊Hit數 × 敌补正(假设为1)
        let cardObj = getCardDetails(card, position);
        let np = cardObj.baseNp * [firstCardReward + cardObj.cardRate * (1 + cardObj.cardBuff)] * (1 + cardObj.npBuff) * cardObj.isCritical * cardObj.isOverkill * cardObj.hit * cardObj.enemyCorrections;

        return Math.floor(np * 100) / 100;
}

function getCardDetails(card, position) {
        'use strict';
        let cardRate = 0,
        a = Global_wiki.npObj.arts,
        b = Global_wiki.npObj.buster,
        q = Global_wiki.npObj.quick,
        e = Global_wiki.npObj.ex,
        c = Global_wiki.npObj.careerSkill,
        artsBuff = jQ1("#txtArtsBuff").length === 0 ? c.artsBuff / 100 : parseFloat(jQ1("#txtArtsBuff").val()) / 100,
        quickBuff = jQ1("#txtQuickBuff").length === 0 ? c.quickBuff / 100 : parseFloat(jQ1("#txtQuickBuff").val()) / 100,
        npBuff = jQ1("#txtNpBuff").length === 0 ? 0 : parseFloat(jQ1("#txtNpBuff").val()) / 100,
        enemyCorrections = jQ1("#txtEnemyCorrections").length === 0 ? 1 : parseFloat(jQ1("#txtEnemyCorrections").val());
        let {
                isOverkill,
                isCritical
        } = getIsOverkillAndisCritical(position);
        switch (card) {
        case "A":
                switch (position) {
                case 1:
                        //1位A卡
                        cardRate = 3;
                        break;
                case 2:
                        //2位A卡
                        cardRate = 4.5;
                        break;
                case 3:
                        //3位A卡
                        cardRate = 6;
                        break;
                }
                return {
                        cardRate: cardRate,
                        baseNp: a.np,
                        hit: a.hit,
                        cardBuff: artsBuff,
                        npBuff: npBuff,
                        isOverkill: isOverkill,
                        isCritical: isCritical,
                        enemyCorrections: enemyCorrections
                };
        case "B":
                return {
                        cardRate:
                        0,
                        baseNp: b.np,
                        hit: b.hit,
                        cardBuff: 0,
                        npBuff: npBuff,
                        isOverkill: isOverkill,
                        isCritical: isCritical,
                        enemyCorrections: enemyCorrections
                };
        case "Q":
                switch (position) {
                case 1:
                        //1位Q卡
                        cardRate = 1;
                        break;
                case 2:
                        //2位Q卡
                        cardRate = 1.5;
                        break;
                case 3:
                        //3位Q卡
                        cardRate = 2;
                        break;
                }
                return {
                        cardRate: cardRate,
                        baseNp: q.np,
                        hit: q.hit,
                        cardBuff: quickBuff,
                        npBuff: npBuff,
                        isOverkill: isOverkill,
                        isCritical: isCritical,
                        enemyCorrections: enemyCorrections
                };
        case "EX":
                return {
                        cardRate:
                        1,
                        baseNp: e.np,
                        hit: e.hit,
                        cardBuff: 0,
                        npBuff: npBuff,
                        isOverkill: isOverkill,
                        isCritical: isCritical,
                        enemyCorrections: enemyCorrections
                };
        }
}


//从大到小排序
function compare(property) {
        'use strict';
        return function(a, b) {
                let value1 = a[property];
                let value2 = b[property];
                return value2 - value1;
        };
}

function calcCardNp(cardStr) {
        'use strict';
        let first = cardStr[0],
        second = cardStr[1],
        third = cardStr[2],
        firstCardReward = 0,
        isCritical = 1,
        isOverkill = 1,
        enemyCorrections = 1,
        ex = 0,
        totalNp = 0,
        t = Global_wiki.npObj.treasure,
        artChainBuff = 0;
        // console.log(t);
        // console.log(`cardStr:${cardStr},first:${first},second:${second},third:${third}`);
        if (first == "A" || (first == "宝" && t.card == "A")) { //首卡加成：1
                firstCardReward = 1;
        }

        if (cardStr == "AAA") artChainBuff = 20;

        let tmpSecond = second,
        tempThird = third;

        let treasureNP = calcTreasureNP("宝");

        first = first == "宝" ? treasureNP: calcSingleCardNp(firstCardReward, first, 1);
        second = second == "宝" ? treasureNP: calcSingleCardNp(firstCardReward, second, 2);
        third = third == "宝" ? treasureNP: calcSingleCardNp(firstCardReward, third, 3);

        //宝具放完NP就清光了_(:з」∠)_
        if (tmpSecond == "宝") { //A宝A，第一位A的NP清零
                first = 0;
        } else if (tempThird == "宝") { //AA宝，第一位和第二位A的NP清零
                first = 0;
                second = 0;
        }
        ex = calcSingleCardNp(firstCardReward, "EX", 4);

        // console.log(`cardStr:${cardStr},first:${first},second:${second},third:${third},artChainBuff:${artChainBuff}`);
        totalNp = Math.floor((first + second + third + ex + artChainBuff) * 100) / 100;
        return {
                cardStr: cardStr,
                first: first,
                second: second,
                third: third,
                ex: ex,
                totalNp: totalNp
        };
}