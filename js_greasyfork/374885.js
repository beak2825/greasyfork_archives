// ==UserScript==
// @name         字幕组时间表突出显示
// @namespace    Dexte
// @version      1.1.6
// @description  突出显示字幕组时间表
// @author       Dexte
// @match        *://www.zimuzu.tv/*
// @match        *://www.zimuzu.io/*
// @match        *://www.zmz2019.com/*
// @match        *://www.rrys2019.com/*
// @match        *://www.rrys2020.com/*
// @match        *://www.pogdesign.co.uk/*
// @match        *://huo720.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374885/%E5%AD%97%E5%B9%95%E7%BB%84%E6%97%B6%E9%97%B4%E8%A1%A8%E7%AA%81%E5%87%BA%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/374885/%E5%AD%97%E5%B9%95%E7%BB%84%E6%97%B6%E9%97%B4%E8%A1%A8%E7%AA%81%E5%87%BA%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...



    //tvcat 复写样式
    var a=".day .lastep{box-shadow: inset 0px 0px 25px #f1f1f1, 0px 0px 5px #f1f1f1;background: #f1f1f1;border: 1px solid red;}";
    var b=document.createElement('style');
    b.innerHTML=a;

    var c=".day .firstep {box-shadow: inset 0px 0px 25px #f1f1f1, 0px 0px 5px #f1f1f1;background: #f1f1f1;border: 1px solid yellow;}";
    var d=document.createElement('style');
    d.innerHTML=c;

    var e=".day .myep{box-shadow: inset 0px 0px 25px rgba(200,50,50,0.66), 0px 0px 5px rgba(200,50,50,0.66);background-color: rgba(200,50,50,0.25);}";
    var f=document.createElement('style');
    f.innerHTML=e;

    document.getElementsByTagName('head')[0].appendChild(b);
    document.getElementsByTagName('head')[0].appendChild(d);
    document.getElementsByTagName('head')[0].appendChild(f);

    //tvcat  为关注的追剧标红
    var tvs=$("p a");
    var tvArr=new Array();
    tvArr.push("Supergirl");
    tvArr.push("Doctor Who");
    tvArr.push("The Gifted");
    tvArr.push("Legends of Tomorrow");
    tvArr.push("The Flash");
    tvArr.push("The Librarian");
    tvArr.push("Beyond");
    tvArr.push("Arrow");
    tvArr.push("Supernatural");
    tvArr.push("Agents of S.H.I.E.L.D");
    tvArr.push("Legion");
    tvArr.push("Doom Patrol");
    tvArr.push("Love,Death&Robots");
    tvArr.push("Love Death & Robots");
    tvArr.push("Black Mirror");
    tvArr.push("Black Lightning");
    tvArr.push("Stranger Things");
    tvArr.push("The Boys");
    tvArr.push("The Rook");
    tvArr.push("Wu Assassins");
    tvArr.push("Nightflyers");
    tvArr.push("Batwoman");
    tvArr.push("Titans");
    tvArr.push("Stargirl");
    tvArr.push("Superman & Lois");
    tvArr.push("Ms. Marvel");
    tvArr.push("Moon Knight");
    tvArr.push("Resident Evil");
    tvArr.push("She-Hulk");
    tvArr.push("Naomi");
    tvArr.push("The Peripheral");
    tvArr.push("sicak kafa");
    tvArr.push("Gen V");
    tvArr.push("Loki");
    tvArr.push("What If...");

    var tvIgnores=new Array();
    tvIgnores.push("Teen Titans Go");
    tvIgnores.push("The Rookie");
    tvIgnores.push("Beyond Paradise");
    tvs.each(function(idx,obj){
        for(var i=0;i<tvIgnores.length;i++){
            if($(obj).text().indexOf(tvIgnores[i])>=0){
                return;
            }
        }
        for(var j=0;j<tvArr.length;j++){
            if($(obj).text().indexOf(tvArr[j])>=0){
                $(obj).parent().css("background-color","red");
                $(obj).parent().css("color","white");
            }
        }
    });

    var myArr=new Array();
    myArr.push("超女");
    myArr.push("超级少女");
    myArr.push("神秘博士");
    myArr.push("天赋异禀");
    myArr.push("明日传奇");
    myArr.push("闪电侠");
    myArr.push("图书馆员");
    myArr.push("超越");
    myArr.push("绿箭");
    myArr.push("邪恶力量");
    myArr.push("凶鬼恶灵");
    myArr.push("神盾局");
    myArr.push("大群");
    myArr.push("生活大爆炸");
    myArr.push("末日巡逻队");
    myArr.push("爱、死亡与机器人");
    myArr.push("黑镜");
    myArr.push("黑霹雳");
    myArr.push("怪奇物语");
    myArr.push("黑袍纠察队");
    myArr.push("替身");
    myArr.push("五行刺客");
    myArr.push("夜行者");
    myArr.push("蝙蝠女侠");
    myArr.push("泰坦");
    myArr.push("逐星女");
    myArr.push("超人和露易斯");
    myArr.push("惊奇少女");
    myArr.push("月光骑士");
    myArr.push("生化危机");
    myArr.push("娜奥米");
    myArr.push("边缘世界");
    myArr.push("颅骨印记");

    var ignoreArr=new Array();
    ignoreArr.push("少年泰坦出击");

    //人人字幕组 复写样式
    var x=".play-schedule td.cur{background:blue}.play-schedule td.cur dl dd.even{background:blue}.play-schedule td.cur dl dd{background:royalblue}";
    var y=document.createElement('style');
    y.innerHTML=x;
    document.getElementsByTagName('head')[0].appendChild(y);
    //人人字幕组  为关注的追剧标红
    var mjs=$("dd a");
    mjs.each(function(idx,obj){
         for(var i=0;i<ignoreArr.length;i++){
            if($(obj).text().indexOf(ignoreArr[i])>=0){
                return;
            }
        }
        for(var i=0;i<myArr.length;i++){
            if($(obj).text().indexOf(myArr[i])>=0){
                $(obj).css("background-color","red");
                $(obj).css("color","white");
            }
        }
    });
     //火星影剧  为关注的追剧标红
    var huos=$(".link-dark b");
    huos.each(function(idx,obj){
         for(var i=0;i<ignoreArr.length;i++){
            if($(obj).text().indexOf(ignoreArr[i])>=0){
                return;
            }
        }
        for(var i=0;i<myArr.length;i++){
            if($(obj).text().indexOf(myArr[i])>=0){
                $(obj).css("background-color","red");
                $(obj).siblings().css("background-color","red");
                $(obj).parent().css("background-color","red");
                $(obj).parent().parent().css("background-color","red");
                $(obj).parent().css("color","black");
            }
        }
    });
})();