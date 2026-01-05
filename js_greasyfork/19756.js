// ==UserScript==
// @name		    TM_Transfer_Topics
// @version			2017050901
// @description		论坛页面直通各国交易地址，方便宣传外援
// @author          andrizz aka banana aka jimmy il fenomeno （太原FC fixed）
// @include         *trophymanager.com/forum/*
// @namespace https://greasyfork.org/users/15590
// @downloadURL https://update.greasyfork.org/scripts/19756/TM_Transfer_Topics.user.js
// @updateURL https://update.greasyfork.org/scripts/19756/TM_Transfer_Topics.meta.js
// ==/UserScript==

//SCEGLI IL TIPO DI ICONE: 
//var flag = "http://trophymanager.com/pics/flags/gradient/"; //link bandiere quadrate
var flag = "http://static.trophymanager.com/pics/nt_logos/25px/"; //link bandiere tonde

var forum = "http://trophymanager.com/forum/";

//LINKS TO TRANSFER AND OPEN TOPICS:
//EUROPA
var s1 = "al"; //sigla nazione
var n1 = "阿尔巴尼亚"; //nome esteso nazione
var t1 = "261450"; //transfer topic nazione
var o1 = "32464"; //open topic nazione

var s2 = "ad";
var n2 = "安道尔";
var t2 = "5969";
var o2 = "5960";

var s3 = "am";
var n3 = "亚美尼亚";
var t3 = "14133";
var o3 = "192430";

var s4 = "at";
var n4 = "奥地利";
var t4 = "8748";
var o4 = "35843";

var s5 = "az";
var n5 = "阿塞拜疆";
var t5 = "192445";
var o5 = "192442";

var s6 = "be";
var n6 = "比利时";
var t6 = "2718";
var o6 = "24523";

var s7 = "by";
var n7 = "白俄罗斯";
var t7 = "14165";
var o7 = "232297";

var s8 = "ba";
var n8 = "波斯尼亚和黑山";
var t8 = "2102";
var o8 = "19352";

var s9 = "bg";
var n9 = "保加利亚";
var t9 = "2250";
var o9 = "71945";

var s10 = "cy";
var n10 = "塞浦路斯";
var t10 = "8309";
var o10 = "39077";

var s11 = "hr";
var n11 = "克罗地亚";
var t11 = "327305"; //aggiornato
var o11 = "327314"; //ag.

var s12 = "dk";
var n12 = "丹麦";
var t12 = "368147"; //ag.
var o12 = "1934";

var s13 = "ee";
var n13 = "爱沙尼亚";
var t13 = "6895";
var o13 = "11566";

var s14 = "fi";
var n14 = "芬兰";
var t14 = "3993";
var o14 = "15148";

var s15 = "fr";
var n15 = "法国";
var t15 = "166141";
var o15 = "322672";

var s16 = "wa";
var n16 = "威尔士";
var t16 = "2343";
var o16 = "2349";

var s17 = "ge";
var n17 = "格鲁吉亚";
var t17 = "1315";
var o17 = "1321";

var s18 = "de";
var n18 = "德国";
var t18 = "1572";
var o18 = "1573";

var s19 = "gr";
var n19 = "希腊";
var t19 = "2770";
var o19 = "7814";

var s20 = "en";
var n20 = "英格兰";
var t20 = "2121";
var o20 = "319791"; //cambia ogni stagione

var s21 = "ie";
var n21 = "爱尔兰";
var t21 = "1924";
var o21 = "1925";

var s22 = "rt";
var n22 = "北爱尔兰";
var t22 = "5516";
var o22 = "5542";

var s23 = "is";
var n23 = "冰岛";
var t23 = "66267";
var o23 = "66274";

var s24 = "fo";
var n24 = "法罗群岛";
var t24 = "14168";
var o24 = "20830";

var s25 = "il";
var n25 = "以色列";
var t25 = "258092";
var o25 = "4128";

var s26 = "it";
var n26 = "意大利";
var t26 = "258737"; //cambia ogni stagione
var o26 = "342146"; //cambia ogni stagione

var s27 = "kz";
var n27 = "哈萨克斯坦";
var t27 = "33868";
var o27 = "19171";

var s28 = "lv";
var n28 = "拉脱维亚";
var t28 = "14306";
var o28 = "122680";

var s29 = "lt";
var n29 = "立陶宛";
var t29 = "2020";
var o29 = "9598";

var s30 = "lu";
var n30 = "卢森堡";
var t30 = "1294";
var o30 = "1295";

var s31 = "mk";
var n31 = "马其顿";
var t31 = "258757";
var o31 = "1743";

var s32 = "mt";
var n32 = "马耳他";
var t32 = "2527";
var o32 = "6561";

var s33 = "md";
var n33 = "摩尔多瓦";
var t33 = "1450";
var o33 = "1567";

var s34 = "me";
var n34 = "黑山";
var t34 = "184810";
var o34 = "131517";

var s35 = "no";
var n35 = "挪威";
var t35 = "2957";
var o35 = "2967";

var s36 = "nl";
var n36 = "荷兰";
var t36 = "358673";
var o36 = "185987";

var s37 = "pl";
var n37 = "波兰";
var t37 = "8029";
var o37 = "8031";

var s38 = "pt";
var n38 = "葡萄牙";
var t38 = "42188";
var o38 = "8597";

var s39 = "cz";
var n39 = "捷克";
var t39 = "3484";
var o39 = "5482";

var s40 = "ro";
var n40 = "罗马尼亚";
var t40 = "258366";
var o40 = "1484";

var s41 = "ru";
var n41 = "俄罗斯";
var t41 = "1719";
var o41 = "1717";

var s42 = "sm";
var n42 = "圣马力诺";
var t42 = "16938";
var o42 = "16940";

var s43 = "ct";
var n43 = "苏格兰";
var t43 = "2283";
var o43 = "11696";

var s44 = "cs";
var n44 = "塞尔维亚";
var t44 = "260351";
var o44 = "260369";

var s45 = "sk";
var n45 = "斯洛文尼亚";
var t45 = "2092";
var o45 = "2156";

var s46 = "si";
var n46 = "Slovenia";
var t46 = "5182";
var o46 = "5190";

var s47 = "es";
var n47 = "西班牙";
var t47 = "197416";
var o47 = "250879";

var s48 = "se";
var n48 = "瑞典";
var t48 = "2023";
var o48 = "2025";

var s49 = "he";
var n49 = "瑞士";
var t49 = "218482";
var o49 = "218487";

var s50 = "tr";
var n50 = "土耳其";
var t50 = "310694";
var o50 = "310691";

var s51 = "ua";
var n51 = "乌克兰";
var t51 = "267945";
var o51 = "312631";

var s52 = "hu";
var n52 = "匈牙利";
var t52 = "1828";
var o52 = "1830";

//北美
var s53 = "bz";
var n53 = "伯利兹";
var t53 = "8658";
var o53 = "8666";

var s54 = "ca";
var n54 = "加拿大";
var t54 = "2116";
var o54 = "9337";

var s55 = "cr";
var n55 = "哥斯达黎加";
var t55 = "6020";
var o55 = "6019";

var s56 = "cu";
var n56 = "古巴";
var t56 = "6043";
var o56 = "6047";

var s57 = "sv";
var n57 = "萨尔瓦多";
var t57 = "6054";
var o57 = "6052";

var s58 = "jm";
var n58 = "牙买加";
var t58 = "308298";
var o58 = "35833";

var s59 = "gt";
var n59 = "危地马拉";
var t59 = "6061";
var o59 = "6057";

var s60 = "hn";
var n60 = "洪都拉斯";
var t60 = "7024";
var o60 = "7023";

var s61 = "vc";
var n61 = "西印度群岛";
var t61 = "1049";
var o61 = "181920";

var s62 = "mx";
var n62 = "墨西哥";
var t62 = "7030";
var o62 = "7029";

var s63 = "pa";
var n63 = "巴拿马";
var t63 = "7035";
var o63 = "7034";

var s64 = "pr";
var n64 = "波多黎各";
var t64 = "7038";
var o64 = "7037";

var s65 = "do";
var n65 = "多米尼加";
var t65 = "6049";
var o65 = "6048";

var s66 = "tt";
var n66 = "特立尼达和多巴哥";
var t66 = "9933";
var o66 = "9935";

var s67 = "us";
var n67 = "美国";
var t67 = "316532";
var o67 = "1777";

//ASIA
var s68 = "af";
var n68 = "阿富汗";
var t68 = "247251";
var o68 = ""; //non esiste

var s69 = "sa";
var n69 = "沙特阿拉伯";
var t69 = "6280";
var o69 = "156511";

var s70 = "bh";
var n70 = "巴林";
var t70 = "148674";
var o70 = ""; // non esiste

var s71 = "bd";
var n71 = "孟加拉国";
var t71 = "211552";
var o71 = "19668";

var s72 = "bn";
var n72 = "文莱";
var t72 = "314428";
var o72 = "314429";

var s73 = "cn";
var n73 = "中国";
var t73 = "313981";
var o73 = ""; // non esiste

var s74 = "kr";
var n74 = "韩国";
var t74 = "221608";
var o74 = "241894";

var s75 = "ae";
var n75 = "阿联酋";
var t75 = "277240";
var o75 = "277239";

var s76 = "ph";
var n76 = "菲律宾";
var t76 = "327452"; //ag.
var o76 = "304000";

var s77 = "jp";
var n77 = "日本";
var t77 = "13461";
var o77 = "13464";

var s78 = "jo";
var n78 = "约旦";
var t78 = "37916";
var o78 = "37918";

var s79 = "hk";
var n79 = "中国香港";
var t79 = "1720";
var o79 = "1721";

var s80 = "in";
var n80 = "印度";
var t80 = "12357";
var o80 = "20087";

var s81 = "id";
var n81 = "印度尼西亚";
var t81 = "2322";
var o81 = "31015";

var s82 = "ir";
var n82 = "伊朗";
var t82 = "370617";
var o82 = "370615";

var s83 = "iq";
var n83 = "伊拉克";
var t83 = "304217";
var o83 = ""; // non esiste

var s84 = "kw";
var n84 = "科威特";
var t84 = "295597";
var o84 = "295596";

var s85 = "lb";
var n85 = "黎巴嫩";
var t85 = "180082";
var o85 = "324221"; 

var s86 = "my";
var n86 = "马来西亚";
var t86 = "3126";
var o86 = "9356";

var s87 = "np";
var n87 = "尼泊尔";
var t87 = "304019";
var o87 = ""; // non esiste

var s88 = "om";
var n88 = "阿曼";
var t88 = "281416";
var o88 = "255078"; 

var s89 = "pk";
var n89 = "巴基斯坦";
var t89 = "99504";
var o89 = "100330";

var s90 = "qa";
var n90 = "卡塔尔";
var t90 = "144540";
var o90 = "144541";

var s91 = "sg";
var n91 = "新加坡";
var t91 = "2896";
var o91 = "2906";

var s92 = "sy";
var n92 = "叙利亚";
var t92 = "323992"; //ag.
var o92 = "5448";

var s93 = "tw";
var n93 = "中华台北";
var t93 = "241713";
var o93 = "241716";

var s94 = "th";
var n94 = "泰国";
var t94 = "4420";
var o94 = "118113";

var s95 = "vn";
var n95 = "越南";
var t95 = "4097";
var o95 = "4101";

// OCEANIA
var s96 = "au";
var n96 = "澳大利亚";
var t96 = "4426";
var o96 = "9877";

var s97 = "fj";
var n97 = "斐济";
var t97 = "65565";
var o97 = "66223";

var s98 = "nz";
var n98 = "新西兰";
var t98 = "241227";
var o98 = "7497";

var s99 = "oc";
var n99 = "大洋洲群岛";
var t99 = "58085";
var o99 = "58092";

// SUD AMERICA
var s100 = "ar";
var n100 = "阿根廷";
var t100 = "1440";
var o100 = "5066";

var s101 = "bo";
var n101 = "玻利维亚";
var t101 = "5982";
var o101 = "5979";

var s102 = "br";
var n102 = "巴西";
var t102 = "3185";
var o102 = "3203";

var s103 = "cl";
var n103 = "智利";
var t103 = "5988";
var o103 = "5987";

var s104 = "co";
var n104 = "哥伦比亚";
var t104 = "6002";
var o104 = "6000";

var s105 = "ec";
var n105 = "厄瓜多尔";
var t105 = "6007";
var o105 = "6006";

var s106 = "py";
var n106 = "巴拉圭";
var t106 = "3062";
var o106 = "3064";

var s107 = "pe";
var n107 = "秘鲁";
var t107 = "4632";
var o107 = "4630";

var s108 = "uy";
var n108 = "乌拉圭";
var t108 = "6974";
var o108 = "188518";

var s109 = "ve";
var n109 = "委内瑞拉";
var t109 = "6015";
var o109 = "6014";

// AFRICA
var s110 = "dz";
var n110 = "阿尔及利亚";
var t110 = "2080";
var o110 = "263205";

var s111 = "ao";
var n111 = "安哥拉";
var t111 = "8052";
var o111 = "37716";

var s112 = "bw";
var n112 = "博茨瓦纳";
var t112 = "12477";
var o112 = "105901";

var s113 = "cm";
var n113 = "喀麦隆";
var t113 = "7297";
var o113 = ""; // non esiste

var s114 = "td";
var n114 = "乍得";
var t114 = "23570";
var o114 = "51318";

var s115 = "ci";
var n115 = "科特迪瓦";
var t115 = "258538";
var o115 = "270101";

var s116 = "eg";
var n116 = "埃及";
var t116 = "2925";
var o116 = "2956";

var s117 = "gh";
var n117 = "加纳";
var t117 = "14751";
var o117 = "190105";

var s118 = "ly";
var n118 = "利比亚";
var t118 = "2302";
var o118 = ""; // non esiste

var s119 = "ma";
var n119 = "摩洛哥";
var t119 = "285979";
var o119 = "3731";

var s120 = "ng";
var n120 = "尼日利亚";
var t120 = "1817";
var o120 = "1818";

var s121 = "so";
var n121 = "巴勒斯坦";
var t121 = "6148";
var o121 = "6151";

var s122 = "sn";
var n122 = "塞内加尔";
var t122 = "35803";
var o122 = "182606";

var s123 = "za";
var n123 = "南非";
var t123 = "8568";
var o123 = "9534";

var s124 = "tn";
var n124 = "突尼斯";
var t124 = "215999"; //stesso topic per transfer e open
var o124 = "215999";
// FINE LINK

var div = document.createElement('div');
	appdiv = document.body.appendChild(div);
appdiv.innerHTML = '<div id="tbuddy" style="opacity:.9;-moz-opacity:.9;position:fixed;z-index:1000;top:8px;left:5px;height:auto;width:140px;text-align:left;border:2px #275502 outset;display:inline;background-color:#333333;padding-top:3px;padding-bottom:3px;"><span style="position:relative;"><a href="http://trophymanager.com/forum/int/transfer/" target="_self" style="margin-left:-5px;" title="点击进入"><img src="http://static.trophymanager.com/pics/cf_mini_arrow_right.png"/> 国际市场</a><img src="http://trophymanager.com/pics/flags/gradient/int.png" style="float:right;margin-right:5px;margin-top:3px;"/></span><hr style="background-color:#ccff00;color:#ccff00;height:2px;line-height:0;margin-left:5px;margin-right:5px;margin-top:7px;text-align:center;"/><span style="position:relative;"><a id="linkTran" style="margin-left:-5px;" title="Show/Hide"><img src="http://static.trophymanager.com/pics/cf_mini_arrow_right.png"/> 各国转会市场</a><img src="http://trophymanager.com/pics/auction_hammer_small.png" style="float:right;margin-right:5px;margin-top:3px;"/></br><ul id="divTran" style="display:none;list-style-type:disc;margin-top:4px;margin-bottom:4px;padding-left:12px;"><li><a id="linkEU" style="font-size: 10px; color: gold;" title=""><img src="http://trophymanager.cn/tools/Transfer_Topics/image/E.png" style="width:23px;vertical-align:middle;margin-bottom:3px;"/> 欧洲 </a></br><div id="divEU" style="display:none;position:relative; top:0px;left:0px"><a href="' + forum + s1 + '/general/' + t1 + '/last/#last"><img src="' + flag + '/' + s1 + '.png" title="' + n1 + '"></a>&nbsp;<a href="' + forum + s2 + '/general/' + t2 + '/last/#last"><img src="' + flag + '/' + s2 + '.png" title="' + n2 + '"></a>&nbsp;<a href="' + forum + s3 + '/general/' + t3 + '/last/#last"><img src="' + flag + '/' + s3 + '.png" title="' + n3 + '"></a>&nbsp;<a href="' + forum + s4 + '/general/' + t4 + '/last/#last"><img src="' + flag + '/' + s4 + '.png" title="' + n4 + '"></a>&nbsp;<a href="' + forum + s5 + '/general/' + t5 + '/last/#last"><img src="' + flag + '/' + s5 + '.png" title="' + n5 + '"></a>&nbsp;<a href="' + forum + s6 + '/general/' + t6 + '/last/#last"><img src="' + flag + '/' + s6 + '.png" title="' + n6 + '"></a>&nbsp;<a href="' + forum + s7 + '/general/' + t7 + '/last/#last"><img src="' + flag + '/' + s7 + '.png" title="' + n7 + '"></a>&nbsp;<a href="' + forum + s8 + '/general/' + t8 + '/last/#last"><img src="' + flag + '/' + s8 + '.png" title="' + n8 + '"></a>&nbsp;<a href="' + forum + s9 + '/general/' + t9 + '/last/#last"><img src="' + flag + '/' + s9 + '.png" title="' + n9 + '"></a>&nbsp;<a href="' + forum + s10 + '/general/' + t10 + '/last/#last"><img src="' + flag + '/' + s10 + '.png" title="' + n10 + '"></a>&nbsp;<a href="' + forum + s11 + '/general/' + t11 + '/last/#last"><img src="' + flag + '/' + s11 + '.png" title="' + n11 + '"></a>&nbsp;<a href="' + forum + s12 + '/general/' + t12 + '/last/#last"><img src="' + flag + '/' + s12 + '.png" title="' + n12 + '"></a>&nbsp;<a href="' + forum + s13 + '/general/' + t13 + '/last/#last"><img src="' + flag + '/' + s13 + '.png" title="' + n13 + '"></a>&nbsp;<a href="' + forum + s14 + '/general/' + t14 + '/last/#last"><img src="' + flag + '/' + s14 + '.png" title="' + n14 + '"></a>&nbsp;<a href="' + forum + s15 + '/general/' + t15 + '/last/#last"><img src="' + flag + '/' + s15 + '.png" title="' + n15 + '"></a>&nbsp;<a href="' + forum + s16 + '/general/' + t16 + '/last/#last"><img src="' + flag + '/' + s16 + '.png" title="' + n16 + '"></a>&nbsp;<a href="' + forum + s17 + '/general/' + t17 + '/last/#last"><img src="' + flag + '/' + s17 + '.png" title="' + n17 + '"></a>&nbsp;<a href="' + forum + s18 + '/general/' + t18 + '/last/#last"><img src="' + flag + '/' + s18 + '.png" title="' + n18 + '"></a>&nbsp;<a href="' + forum + s19 + '/general/' + t19 + '/last/#last"><img src="' + flag + '/' + s19 + '.png" title="' + n19 + '"></a>&nbsp;<a href="' + forum + s20 + '/general/' + t20 + '/last/#last"><img src="' + flag + '/' + s20 + '.png" title="' + n20 + '"></a>&nbsp;<a href="' + forum + s21 + '/general/' + t21 + '/last/#last"><img src="' + flag + '/' + s21 + '.png" title="' + n21 + '"></a>&nbsp;<a href="' + forum + s22 + '/general/' + t22 + '/last/#last"><img src="' + flag + '/' + s22 + '.png" title="' + n22 + '"></a>&nbsp;<a href="' + forum + s23 + '/general/' + t23 + '/last/#last"><img src="' + flag + '/' + s23 + '.png" title="' + n23 + '"></a>&nbsp;<a href="' + forum + s24 + '/general/' + t24 + '/last/#last"><img src="' + flag + '/' + s24 + '.png" title="' + n24 + '"></a>&nbsp;<a href="' + forum + s25 + '/general/' + t25 + '/last/#last"><img src="' + flag + '/' + s25 + '.png" title="' + n25 + '"></a>&nbsp;<a href="' + forum + s26 + '/general/' + t26 + '/last/#last"><img src="' + flag + '/' + s26 + '.png" title="' + n26 + '"></a>&nbsp;<a href="' + forum + s27 + '/general/' + t27 + '/last/#last"><img src="' + flag + '/' + s27 + '.png" title="' + n27 + '"></a>&nbsp;<a href="' + forum + s28 + '/general/' + t28 + '/last/#last"><img src="' + flag + '/' + s28 + '.png" title="' + n28 + '"></a>&nbsp;<a href="' + forum + s29 + '/general/' + t29 + '/last/#last"><img src="' + flag + '/' + s29 + '.png" title="' + n29 + '"></a>&nbsp;<a href="' + forum + s30 + '/general/' + t30 + '/last/#last"><img src="' + flag + '/' + s30 + '.png" title="' + n30 + '"></a>&nbsp;<a href="' + forum + s31 + '/general/' + t31 + '/last/#last"><img src="' + flag + '/' + s31 + '.png" title="' + n31 + '"></a>&nbsp;<a href="' + forum + s32 + '/general/' + t32 + '/last/#last"><img src="' + flag + '/' + s32 + '.png" title="' + n32 + '"></a>&nbsp;<a href="' + forum + s33 + '/general/' + t33 + '/last/#last"><img src="' + flag + '/' + s33 + '.png" title="' + n33 + '"></a>&nbsp;<a href="' + forum + s34 + '/general/' + t34 + '/last/#last"><img src="' + flag + '/' + s34 + '.png" title="' + n34 + '"></a>&nbsp;<a href="' + forum + s35 + '/general/' + t35 + '/last/#last"><img src="' + flag + '/' + s35 + '.png" title="' + n35 + '"></a>&nbsp;<a href="' + forum + s36 + '/general/' + t36 + '/last/#last"><img src="' + flag + '/' + s36 + '.png" title="' + n36 + '"></a>&nbsp;<a href="' + forum + s37 + '/general/' + t37 + '/last/#last"><img src="' + flag + '/' + s37 + '.png" title="' + n37 + '"></a>&nbsp;<a href="' + forum + s38 + '/general/' + t38 + '/last/#last"><img src="' + flag + '/' + s38 + '.png" title="' + n38 + '"></a>&nbsp;<a href="' + forum + s39 + '/general/' + t39 + '/last/#last"><img src="' + flag + '/' + s39 + '.png" title="' + n39 + '"></a>&nbsp;<a href="' + forum + s40 + '/general/' + t40 + '/last/#last"><img src="' + flag + '/' + s40 + '.png" title="' + n40 + '"></a>&nbsp;<a href="' + forum + s41 + '/general/' + t41 + '/last/#last"><img src="' + flag + '/' + s41 + '.png" title="' + n41 + '"></a>&nbsp;<a href="' + forum + s42 + '/general/' + t42 + '/last/#last"><img src="' + flag + '/' + s42 + '.png" title="' + n42 + '"></a>&nbsp;<a href="' + forum + s43 + '/general/' + t43 + '/last/#last"><img src="' + flag + '/' + s43 + '.png" title="' + n43 + '"></a>&nbsp;<a href="' + forum + s44 + '/general/' + t44 + '/last/#last"><img src="' + flag + '/' + s44 + '.png" title="' + n44 + '"></a>&nbsp;<a href="' + forum + s45 + '/general/' + t45 + '/last/#last"><img src="' + flag + '/' + s45 + '.png" title="' + n45 + '"></a>&nbsp;<a href="' + forum + s46 + '/general/' + t46 + '/last/#last"><img src="' + flag + '/' + s46 + '.png" title="' + n46 + '"></a>&nbsp;<a href="' + forum + s47 + '/general/' + t47 + '/last/#last"><img src="' + flag + '/' + s47 + '.png" title="' + n47 + '"></a>&nbsp;<a href="' + forum + s48 + '/general/' + t48 + '/last/#last"><img src="' + flag + '/' + s48 + '.png" title="' + n48 + '"></a>&nbsp;<a href="' + forum + s49 + '/general/' + t49 + '/last/#last"><img src="' + flag + '/' + s49 + '.png" title="' + n49 + '"></a>&nbsp;<a href="' + forum + s50 + '/general/' + t50 + '/last/#last"><img src="' + flag + '/' + s50 + '.png" title="' + n50 + '"></a>&nbsp;<a href="' + forum + s51 + '/general/' + t51 + '/last/#last"><img src="' + flag + '/' + s51 + '.png" title="' + n51 + '"></a>&nbsp;<a href="' + forum + s52 + '/general/' + t52 + '/last/#last"><img src="' + flag + '/' + s52 + '.png" title="' + n52 + '"></a>&nbsp;</div></li><li><a id="linkNA" style="font-size: 10px; color: gold;" title=""><img src="http://trophymanager.cn/tools/Transfer_Topics/image/NA.png" style="width:23px;vertical-align:middle;margin-bottom:3px;"/> 北美洲 </a></br><div id="divNA" style="display:none;position:relative; top:0px;left:0px"><a href="' + forum + s53 + '/general/' + t53 + '/last/#last"><img src="' + flag + '/' + s53 + '.png" title="' + n53 + '"></a>&nbsp;<a href="' + forum + s54 + '/general/' + t54 + '/last/#last"><img src="' + flag + '/' + s54 + '.png" title="' + n54 + '"></a>&nbsp;<a href="' + forum + s55 + '/general/' + t55 + '/last/#last"><img src="' + flag + '/' + s55 + '.png" title="' + n55 + '"></a>&nbsp;<a href="' + forum + s56 + '/general/' + t56 + '/last/#last"><img src="' + flag + '/' + s56 + '.png" title="' + n56 + '"></a>&nbsp;<a href="' + forum + s57 + '/general/' + t57 + '/last/#last"><img src="' + flag + '/' + s57 + '.png" title="' + n57 + '"></a>&nbsp;<a href="' + forum + s58 + '/general/' + t58 + '/last/#last"><img src="' + flag + '/' + s58 + '.png" title="' + n58 + '"></a>&nbsp;<a href="' + forum + s59 + '/general/' + t59 + '/last/#last"><img src="' + flag + '/' + s59 + '.png" title="' + n59 + '"></a>&nbsp;<a href="' + forum + s60 + '/general/' + t60 + '/last/#last"><img src="' + flag + '/' + s60 + '.png" title="' + n60 + '"></a>&nbsp;<a href="' + forum + s61 + '/general/' + t61 + '/last/#last"><img src="' + flag + '/' + s61 + '.png" title="' + n61 + '"></a>&nbsp;<a href="' + forum + s62 + '/general/' + t62 + '/last/#last"><img src="' + flag + '/' + s62 + '.png" title="' + n62 + '"></a>&nbsp;<a href="' + forum + s63 + '/general/' + t63 + '/last/#last"><img src="' + flag + '/' + s63 + '.png" title="' + n63 + '"></a>&nbsp;<a href="' + forum + s64 + '/general/' + t64 + '/last/#last"><img src="' + flag + '/' + s64 + '.png" title="' + n64 + '"></a>&nbsp;<a href="' + forum + s65 + '/general/' + t65 + '/last/#last"><img src="' + flag + '/' + s65 + '.png" title="' + n65 + '"></a>&nbsp;<a href="' + forum + s66 + '/general/' + t66 + '/last/#last"><img src="' + flag + '/' + s66 + '.png" title="' + n66 + '"></a>&nbsp;<a href="' + forum + s67 + '/general/' + t67 + '/last/#last"><img src="' + flag + '/' + s67 + '.png" title="' + n67 + '"></a></div></li><li><a id="linkAS" style="font-size: 10px; color: gold;" title=""><img src="http://trophymanager.cn/tools/Transfer_Topics/image/AS.png" style="width:23px;vertical-align:middle;margin-bottom:3px;"/> 亚洲 </a></br><div id="divAS" style="display:none;position:relative; top:0px;left:0px"><a href="' + forum + s68 + '/general/' + t68 + '/last/#last"><img src="' + flag + '/' + s68 + '.png" title="' + n68 + '"></a>&nbsp;<a href="' + forum + s69 + '/general/' + t69 + '/last/#last"><img src="' + flag + '/' + s69 + '.png" title="' + n69 + '"></a>&nbsp;<a href="' + forum + s70 + '/general/' + t70 + '/last/#last"><img src="' + flag + '/' + s70 + '.png" title="' + n70 + '"></a>&nbsp;<a href="' + forum + s71 + '/general/' + t71 + '/last/#last"><img src="' + flag + '/' + s71 + '.png" title="' + n71 + '"></a>&nbsp;<a href="' + forum + s72 + '/general/' + t72 + '/last/#last"><img src="' + flag + '/' + s72 + '.png" title="' + n72 + '"></a>&nbsp;<a href="' + forum + s73 + '/general/' + t73 + '/last/#last"><img src="' + flag + '/' + s73 + '.png" title="' + n73 + '"></a>&nbsp;<a href="' + forum + s74 + '/general/' + t74 + '/last/#last"><img src="' + flag + '/' + s74 + '.png" title="' + n74 + '"></a>&nbsp;<a href="' + forum + s75 + '/general/' + t75 + '/last/#last"><img src="' + flag + '/' + s75 + '.png" title="' + n75 + '"></a>&nbsp;<a href="' + forum + s76 + '/general/' + t76 + '/last/#last"><img src="' + flag + '/' + s76 + '.png" title="' + n76 + '"></a>&nbsp;<a href="' + forum + s77 + '/general/' + t77 + '/last/#last"><img src="' + flag + '/' + s77 + '.png" title="' + n77 + '"></a>&nbsp;<a href="' + forum + s78 + '/general/' + t78 + '/last/#last"><img src="' + flag + '/' + s78 + '.png" title="' + n78 + '"></a>&nbsp;<a href="' + forum + s79 + '/general/' + t79 + '/last/#last"><img src="' + flag + '/' + s79 + '.png" title="' + n79 + '"></a>&nbsp;<a href="' + forum + s80 + '/general/' + t80 + '/last/#last"><img src="' + flag + '/' + s80 + '.png" title="' + n80 + '"></a>&nbsp;<a href="' + forum + s81 + '/general/' + t81 + '/last/#last"><img src="' + flag + '/' + s81 + '.png" title="' + n81 + '"></a>&nbsp;<a href="' + forum + s82 + '/general/' + t82 + '/last/#last"><img src="' + flag + '/' + s82 + '.png" title="' + n82 + '"></a>&nbsp;<a href="' + forum + s83 + '/general/' + t83 + '/last/#last"><img src="' + flag + '/' + s83 + '.png" title="' + n83 + '"></a>&nbsp;<a href="' + forum + s84 + '/general/' + t84 + '/last/#last"><img src="' + flag + '/' + s84 + '.png" title="' + n84 + '"></a>&nbsp;<a href="' + forum + s85 + '/general/' + t85 + '/last/#last"><img src="' + flag + '/' + s85 + '.png" title="' + n85 + '"></a>&nbsp;<a href="' + forum + s86 + '/general/' + t86 + '/last/#last"><img src="' + flag + '/' + s86 + '.png" title="' + n86 + '"></a>&nbsp;<a href="' + forum + s87 + '/general/' + t87 + '/last/#last"><img src="' + flag + '/' + s87 + '.png" title="' + n87 + '"></a>&nbsp;<a href="' + forum + s88 + '/general/' + t88 + '/last/#last"><img src="' + flag + '/' + s88 + '.png" title="' + n88 + '"></a>&nbsp;<a href="' + forum + s89 + '/general/' + t89 + '/last/#last"><img src="' + flag + '/' + s89 + '.png" title="' + n89 + '"></a>&nbsp;<a href="' + forum + s90 + '/general/' + t90 + '/last/#last"><img src="' + flag + '/' + s90 + '.png" title="' + n90 + '"></a>&nbsp;<a href="' + forum + s91 + '/general/' + t91 + '/last/#last"><img src="' + flag + '/' + s91 + '.png" title="' + n91 + '"></a>&nbsp;<a href="' + forum + s92 + '/general/' + t92 + '/last/#last"><img src="' + flag + '/' + s92 + '.png" title="' + n92 + '"></a>&nbsp;<a href="' + forum + s93 + '/general/' + t93 + '/last/#last"><img src="http://trophymanager.cn/tools/Transfer_Topics/image/tw.png" title="' + n93 + '"></a>&nbsp;<a href="' + forum + s94 + '/general/' + t94 + '/last/#last"><img src="' + flag + '/' + s94 + '.png" title="' + n94 + '"></a>&nbsp;<a href="' + forum + s95 + '/general/' + t95 + '/last/#last"><img src="' + flag + '/' + s95 + '.png" title="' + n95 + '"></a></div></li><li><a id="linkOC" style="font-size: 10px; color: gold;" title=""><img src="http://trophymanager.cn/tools/Transfer_Topics/image/O.png" style="width:23px;vertical-align:middle;margin-bottom:3px;"/> 大洋洲 </a></br><div id="divOC" style="display:none;position:relative; top:0px;left:0px"><a href="' + forum + s96 + '/general/' + t96 + '/last/#last"><img src="' + flag + '/' + s96 + '.png" title="' + n96 + '"></a>&nbsp;<a href="' + forum + s97 + '/general/' + t97 + '/last/#last"><img src="' + flag + '/' + s97 + '.png" title="' + n97 + '"></a>&nbsp;<a href="' + forum + s98 + '/general/' + t98 + '/last/#last"><img src="' + flag + '/' + s98 + '.png" title="' + n98 + '"></a>&nbsp;<a href="' + forum + s99 + '/general/' + t99 + '/last/#last"><img src="' + flag + '/' + s99 + '.png" title="' + n99 + '"></a></div></li><li><a id="linkSA" style="font-size: 10px; color: gold;" title=""><img src="http://trophymanager.cn/tools/Transfer_Topics/image/SA.png" style="width:23px;vertical-align:middle;margin-bottom:3px;"/> 南美洲 </a></br><div id="divSA" style="display:none;position:relative; top:0px;left:0px"><a href="' + forum + s100 + '/general/' + t100 + '/last/#last"><img src="' + flag + '/' + s100 + '.png" title="' + n100 + '"></a>&nbsp;<a href="' + forum + s101 + '/general/' + t101 + '/last/#last"><img src="' + flag + '/' + s101 + '.png" title="' + n101 + '"></a>&nbsp;<a href="' + forum + s102 + '/general/' + t102 + '/last/#last"><img src="' + flag + '/' + s102 + '.png" title="' + n102 + '"></a>&nbsp;<a href="' + forum + s103 + '/general/' + t103 + '/last/#last"><img src="' + flag + '/' + s103 + '.png" title="' + n103 + '"></a>&nbsp;<a href="' + forum + s104 + '/general/' + t104 + '/last/#last"><img src="' + flag + '/' + s104 + '.png" title="' + n104 + '"></a>&nbsp;<a href="' + forum + s105 + '/general/' + t105 + '/last/#last"><img src="' + flag + '/' + s105 + '.png" title="' + n105 + '"></a>&nbsp;<a href="' + forum + s106 + '/general/' + t106 + '/last/#last"><img src="' + flag + '/' + s106 + '.png" title="' + n106 + '"></a>&nbsp;<a href="' + forum + s107 + '/general/' + t107 + '/last/#last"><img src="' + flag + '/' + s107 + '.png" title="' + n107 + '"></a>&nbsp;<a href="' + forum + s108 + '/general/' + t108 + '/last/#last"><img src="' + flag + '/' + s108 + '.png" title="' + n108 + '"></a>&nbsp;<a href="' + forum + s109 + '/general/' + t109 + '/last/#last"><img src="' + flag + '/' + s109 + '.png" title="' + n109 + '"></a></div></li><li><a id="linkAF" style="font-size: 10px; color: gold;" title=""><img src="http://trophymanager.cn/tools/Transfer_Topics/image/AF.png" style="width:23px;vertical-align:middle;margin-bottom:3px;"/> 非洲 </a></br><div id="divAF" style="display:none;position:relative; top:0px;left:0px"><a href="' + forum + s110 + '/general/' + t110 + '/last/#last"><img src="' + flag + '/' + s110 + '.png" title="' + n110 + '"></a>&nbsp;<a href="' + forum + s111 + '/general/' + t111 + '/last/#last"><img src="' + flag + '/' + s111 + '.png" title="' + n111 + '"></a>&nbsp;<a href="' + forum + s112 + '/general/' + t112 + '/last/#last"><img src="' + flag + '/' + s112 + '.png" title="' + n112 + '"></a>&nbsp;<a href="' + forum + s113 + '/general/' + t113 + '/last/#last"><img src="' + flag + '/' + s113 + '.png" title="' + n113 + '"></a>&nbsp;<a href="' + forum + s114 + '/general/' + t114 + '/last/#last"><img src="' + flag + '/' + s114 + '.png" title="' + n114 + '"></a>&nbsp;<a href="' + forum + s115 + '/general/' + t115 + '/last/#last"><img src="' + flag + '/' + s115 + '.png" title="' + n115 + '"></a>&nbsp;<a href="' + forum + s116 + '/general/' + t116 + '/last/#last"><img src="' + flag + '/' + s116 + '.png" title="' + n116 + '"></a>&nbsp;<a href="' + forum + s117 + '/general/' + t117 + '/last/#last"><img src="' + flag + '/' + s117 + '.png" title="' + n117 + '"></a>&nbsp;<a href="' + forum + s118 + '/general/' + t118 + '/last/#last"><img src="' + flag + '/' + s118 + '.png" title="' + n118 + '"></a>&nbsp;<a href="' + forum + s119 + '/general/' + t119 + '/last/#last"><img src="' + flag + '/' + s119 + '.png" title="' + n119 + '"></a>&nbsp;<a href="' + forum + s120 + '/general/' + t120 + '/last/#last"><img src="' + flag + '/' + s120 + '.png" title="' + n120 + '"></a>&nbsp;<a href="' + forum + s121 + '/general/' + t121 + '/last/#last"><img src="' + flag + '/' + s121 + '.png" title="' + n121 + '"></a>&nbsp;<a href="' + forum + s122 + '/general/' + t122 + '/last/#last"><img src="' + flag + '/' + s122 + '.png" title="' + n122 + '"></a>&nbsp;<a href="' + forum + s123 + '/general/' + t123 + '/last/#last"><img src="' + flag + '/' + s123 + '.png" title="' + n123 + '"></a>&nbsp;<a href="' + forum + s124 + '/general/' + t124 + '/last/#last"><img src="' + flag + '/' + s124 + '.png" title="' + n124 + '"></a></div></li></ul></span><hr style="background-color:#ccff00;color:#ccff00;height:2px;line-height:0;margin-left:5px;margin-right:5px;margin-top:7px;text-align:center;"/><span style="position:relative;"><a id="linkOpen" style="margin-left:-5px;" title="Show/Hide"><img src="http://static.trophymanager.com/pics/cf_mini_arrow_right.png"/> 各国开放市场</a><img src="http://trophymanager.com/pics/icons/button_yellow.gif" style="float:right;margin-right:6px;margin-top:6px;"/></br><ul id="divOpen" style="display:none;list-style-type:disc;margin-top:4px;margin-bottom:4px;padding-left:12px;"><li><a id="OlinkEU" style="font-size: 10px; color: gold;" title=""><img src="http://trophymanager.cn/tools/Transfer_Topics/image/E.png" style="width:23px;vertical-align:middle;margin-bottom:3px;"/> 欧洲 </a></br><div id="OdivEU" style="display:none;position:relative; top:0px;left:0px"><a href="' + forum + s1 + '/general/' + o1 + '/last/#last"><img src="' + flag + '/' + s1 + '.png" title="' + n1 + '"></a>&nbsp;<a href="' + forum + s2 + '/general/' + o2 + '/last/#last"><img src="' + flag + '/' + s2 + '.png" title="' + n2 + '"></a>&nbsp;<a href="' + forum + s3 + '/general/' + o3 + '/last/#last"><img src="' + flag + '/' + s3 + '.png" title="' + n3 + '"></a>&nbsp;<a href="' + forum + s4 + '/general/' + o4 + '/last/#last"><img src="' + flag + '/' + s4 + '.png" title="' + n4 + '"></a>&nbsp;<a href="' + forum + s5 + '/general/' + o5 + '/last/#last"><img src="' + flag + '/' + s5 + '.png" title="' + n5 + '"></a>&nbsp;<a href="' + forum + s6 + '/general/' + o6 + '/last/#last"><img src="' + flag + '/' + s6 + '.png" title="' + n6 + '"></a>&nbsp;<a href="' + forum + s7 + '/general/' + o7 + '/last/#last"><img src="' + flag + '/' + s7 + '.png" title="' + n7 + '"></a>&nbsp;<a href="' + forum + s8 + '/general/' + o8 + '/last/#last"><img src="' + flag + '/' + s8 + '.png" title="' + n8 + '"></a>&nbsp;<a href="' + forum + s9 + '/general/' + o9 + '/last/#last"><img src="' + flag + '/' + s9 + '.png" title="' + n9 + '"></a>&nbsp;<a href="' + forum + s10 + '/general/' + o10 + '/last/#last"><img src="' + flag + '/' + s10 + '.png" title="' + n10 + '"></a>&nbsp;<a href="' + forum + s11 + '/general/' + o11 + '/last/#last"><img src="' + flag + '/' + s11 + '.png" title="' + n11 + '"></a>&nbsp;<a href="' + forum + s12 + '/general/' + o12 + '/last/#last"><img src="' + flag + '/' + s12 + '.png" title="' + n12 + '"></a>&nbsp;<a href="' + forum + s13 + '/general/' + o13 + '/last/#last"><img src="' + flag + '/' + s13 + '.png" title="' + n13 + '"></a>&nbsp;<a href="' + forum + s14 + '/general/' + o14 + '/last/#last"><img src="' + flag + '/' + s14 + '.png" title="' + n14 + '"></a>&nbsp;<a href="' + forum + s15 + '/general/' + o15 + '/last/#last"><img src="' + flag + '/' + s15 + '.png" title="' + n15 + '"></a>&nbsp;<a href="' + forum + s16 + '/general/' + o16 + '/last/#last"><img src="' + flag + '/' + s16 + '.png" title="' + n16 + '"></a>&nbsp;<a href="' + forum + s17 + '/general/' + o17 + '/last/#last"><img src="' + flag + '/' + s17 + '.png" title="' + n17 + '"></a>&nbsp;<a href="' + forum + s18 + '/general/' + o18 + '/last/#last"><img src="' + flag + '/' + s18 + '.png" title="' + n18 + '"></a>&nbsp;<a href="' + forum + s19 + '/general/' + o19 + '/last/#last"><img src="' + flag + '/' + s19 + '.png" title="' + n19 + '"></a>&nbsp;<a href="' + forum + s20 + '/general/' + o20 + '/last/#last"><img src="' + flag + '/' + s20 + '.png" title="' + n20 + '"></a>&nbsp;<a href="' + forum + s21 + '/general/' + o21 + '/last/#last"><img src="' + flag + '/' + s21 + '.png" title="' + n21 + '"></a>&nbsp;<a href="' + forum + s22 + '/general/' + o22 + '/last/#last"><img src="' + flag + '/' + s22 + '.png" title="' + n22 + '"></a>&nbsp;<a href="' + forum + s23 + '/general/' + o23 + '/last/#last"><img src="' + flag + '/' + s23 + '.png" title="' + n23 + '"></a>&nbsp;<a href="' + forum + s24 + '/general/' + o24 + '/last/#last"><img src="' + flag + '/' + s24 + '.png" title="' + n24 + '"></a>&nbsp;<a href="' + forum + s25 + '/general/' + o25 + '/last/#last"><img src="' + flag + '/' + s25 + '.png" title="' + n25 + '"></a>&nbsp;<a href="' + forum + s26 + '/general/' + o26 + '/last/#last"><img src="' + flag + '/' + s26 + '.png" title="' + n26 + '"></a>&nbsp;<a href="' + forum + s27 + '/general/' + o27 + '/last/#last"><img src="' + flag + '/' + s27 + '.png" title="' + n27 + '"></a>&nbsp;<a href="' + forum + s28 + '/general/' + o28 + '/last/#last"><img src="' + flag + '/' + s28 + '.png" title="' + n28 + '"></a>&nbsp;<a href="' + forum + s29 + '/general/' + o29 + '/last/#last"><img src="' + flag + '/' + s29 + '.png" title="' + n29 + '"></a>&nbsp;<a href="' + forum + s30 + '/general/' + o30 + '/last/#last"><img src="' + flag + '/' + s30 + '.png" title="' + n30 + '"></a>&nbsp;<a href="' + forum + s31 + '/general/' + o31 + '/last/#last"><img src="' + flag + '/' + s31 + '.png" title="' + n31 + '"></a>&nbsp;<a href="' + forum + s32 + '/general/' + o32 + '/last/#last"><img src="' + flag + '/' + s32 + '.png" title="' + n32 + '"></a>&nbsp;<a href="' + forum + s33 + '/general/' + o33 + '/last/#last"><img src="' + flag + '/' + s33 + '.png" title="' + n33 + '"></a>&nbsp;<a href="' + forum + s34 + '/general/' + o34 + '/last/#last"><img src="' + flag + '/' + s34 + '.png" title="' + n34 + '"></a>&nbsp;<a href="' + forum + s35 + '/general/' + o35 + '/last/#last"><img src="' + flag + '/' + s35 + '.png" title="' + n35 + '"></a>&nbsp;<a href="' + forum + s36 + '/general/' + o36 + '/last/#last"><img src="' + flag + '/' + s36 + '.png" title="' + n36 + '"></a>&nbsp;<a href="' + forum + s37 + '/general/' + o37 + '/last/#last"><img src="' + flag + '/' + s37 + '.png" title="' + n37 + '"></a>&nbsp;<a href="' + forum + s38 + '/general/' + o38 + '/last/#last"><img src="' + flag + '/' + s38 + '.png" title="' + n38 + '"></a>&nbsp;<a href="' + forum + s39 + '/general/' + o39 + '/last/#last"><img src="' + flag + '/' + s39 + '.png" title="' + n39 + '"></a>&nbsp;<a href="' + forum + s40 + '/general/' + o40 + '/last/#last"><img src="' + flag + '/' + s40 + '.png" title="' + n40 + '"></a>&nbsp;<a href="' + forum + s41 + '/general/' + o41 + '/last/#last"><img src="' + flag + '/' + s41 + '.png" title="' + n41 + '"></a>&nbsp;<a href="' + forum + s42 + '/general/' + o42 + '/last/#last"><img src="' + flag + '/' + s42 + '.png" title="' + n42 + '"></a>&nbsp;<a href="' + forum + s43 + '/general/' + o43 + '/last/#last"><img src="' + flag + '/' + s43 + '.png" title="' + n43 + '"></a>&nbsp;<a href="' + forum + s44 + '/general/' + o44 + '/last/#last"><img src="' + flag + '/' + s44 + '.png" title="' + n44 + '"></a>&nbsp;<a href="' + forum + s45 + '/general/' + o45 + '/last/#last"><img src="' + flag + '/' + s45 + '.png" title="' + n45 + '"></a>&nbsp;<a href="' + forum + s46 + '/general/' + o46 + '/last/#last"><img src="' + flag + '/' + s46 + '.png" title="' + n46 + '"></a>&nbsp;<a href="' + forum + s47 + '/general/' + o47 + '/last/#last"><img src="' + flag + '/' + s47 + '.png" title="' + n47 + '"></a>&nbsp;<a href="' + forum + s48 + '/general/' + o48 + '/last/#last"><img src="' + flag + '/' + s48 + '.png" title="' + n48 + '"></a>&nbsp;<a href="' + forum + s49 + '/general/' + o49 + '/last/#last"><img src="' + flag + '/' + s49 + '.png" title="' + n49 + '"></a>&nbsp;<a href="' + forum + s50 + '/general/' + o50 + '/last/#last"><img src="' + flag + '/' + s50 + '.png" title="' + n50 + '"></a>&nbsp;<a href="' + forum + s51 + '/general/' + o51 + '/last/#last"><img src="' + flag + '/' + s51 + '.png" title="' + n51 + '"></a>&nbsp;<a href="' + forum + s52 + '/general/' + o52 + '/last/#last"><img src="' + flag + '/' + s52 + '.png" title="' + n52 + '"></a>&nbsp;</div></li><li><a id="OlinkNA" style="font-size: 10px; color: gold;" title=""><img src="http://trophymanager.cn/tools/Transfer_Topics/image/NA.png" style="width:23px;vertical-align:middle;margin-bottom:3px;"/> 北美洲 </a></br><div id="OdivNA" style="display:none;position:relative; top:0px;left:0px"><a href="' + forum + s53 + '/general/' + o53 + '/last/#last"><img src="' + flag + '/' + s53 + '.png" title="' + n53 + '"></a>&nbsp;<a href="' + forum + s54 + '/general/' + o54 + '/last/#last"><img src="' + flag + '/' + s54 + '.png" title="' + n54 + '"></a>&nbsp;<a href="' + forum + s55 + '/general/' + o55 + '/last/#last"><img src="' + flag + '/' + s55 + '.png" title="' + n55 + '"></a>&nbsp;<a href="' + forum + s56 + '/general/' + o56 + '/last/#last"><img src="' + flag + '/' + s56 + '.png" title="' + n56 + '"></a>&nbsp;<a href="' + forum + s57 + '/general/' + o57 + '/last/#last"><img src="' + flag + '/' + s57 + '.png" title="' + n57 + '"></a>&nbsp;<a href="' + forum + s58 + '/general/' + o58 + '/last/#last"><img src="' + flag + '/' + s58 + '.png" title="' + n58 + '"></a>&nbsp;<a href="' + forum + s59 + '/general/' + o59 + '/last/#last"><img src="' + flag + '/' + s59 + '.png" title="' + n59 + '"></a>&nbsp;<a href="' + forum + s60 + '/general/' + o60 + '/last/#last"><img src="' + flag + '/' + s60 + '.png" title="' + n60 + '"></a>&nbsp;<a href="' + forum + s61 + '/general/' + o61 + '/last/#last"><img src="' + flag + '/' + s61 + '.png" title="' + n61 + '"></a>&nbsp;<a href="' + forum + s62 + '/general/' + o62 + '/last/#last"><img src="' + flag + '/' + s62 + '.png" title="' + n62 + '"></a>&nbsp;<a href="' + forum + s63 + '/general/' + o63 + '/last/#last"><img src="' + flag + '/' + s63 + '.png" title="' + n63 + '"></a>&nbsp;<a href="' + forum + s64 + '/general/' + o64 + '/last/#last"><img src="' + flag + '/' + s64 + '.png" title="' + n64 + '"></a>&nbsp;<a href="' + forum + s65 + '/general/' + o65 + '/last/#last"><img src="' + flag + '/' + s65 + '.png" title="' + n65 + '"></a>&nbsp;<a href="' + forum + s66 + '/general/' + o66 + '/last/#last"><img src="' + flag + '/' + s66 + '.png" title="' + n66 + '"></a>&nbsp;<a href="' + forum + s67 + '/general/' + o67 + '/last/#last"><img src="' + flag + '/' + s67 + '.png" title="' + n67 + '"></a></div></li><li><a id="OlinkAS" style="font-size: 10px; color: gold;" title=""><img src="http://trophymanager.cn/tools/Transfer_Topics/image/AS.png" style="width:23px;vertical-align:middle;margin-bottom:3px;"/> 亚洲 </a></br><div id="OdivAS" style="display:none;position:relative; top:0px;left:0px"><a href="' + forum + s68 + '/general/' + o68 + '/last/#last"><img src="' + flag + '/' + s68 + '.png" title="' + n68 + '"></a>&nbsp;<a href="' + forum + s69 + '/general/' + o69 + '/last/#last"><img src="' + flag + '/' + s69 + '.png" title="' + n69 + '"></a>&nbsp;<a href="' + forum + s70 + '/general/' + o70 + '/last/#last"><img src="' + flag + '/' + s70 + '.png" title="' + n70 + '"></a>&nbsp;<a href="' + forum + s71 + '/general/' + o71 + '/last/#last"><img src="' + flag + '/' + s71 + '.png" title="' + n71 + '"></a>&nbsp;<a href="' + forum + s72 + '/general/' + o72 + '/last/#last"><img src="' + flag + '/' + s72 + '.png" title="' + n72 + '"></a>&nbsp;<a href="' + forum + s73 + '/general/' + o73 + '/last/#last"><img src="' + flag + '/' + s73 + '.png" title="' + n73 + '"></a>&nbsp;<a href="' + forum + s74 + '/general/' + o74 + '/last/#last"><img src="' + flag + '/' + s74 + '.png" title="' + n74 + '"></a>&nbsp;<a href="' + forum + s75 + '/general/' + o75 + '/last/#last"><img src="' + flag + '/' + s75 + '.png" title="' + n75 + '"></a>&nbsp;<a href="' + forum + s76 + '/general/' + o76 + '/last/#last"><img src="' + flag + '/' + s76 + '.png" title="' + n76 + '"></a>&nbsp;<a href="' + forum + s77 + '/general/' + o77 + '/last/#last"><img src="' + flag + '/' + s77 + '.png" title="' + n77 + '"></a>&nbsp;<a href="' + forum + s78 + '/general/' + o78 + '/last/#last"><img src="' + flag + '/' + s78 + '.png" title="' + n78 + '"></a>&nbsp;<a href="' + forum + s79 + '/general/' + o79 + '/last/#last"><img src="' + flag + '/' + s79 + '.png" title="' + n79 + '"></a>&nbsp;<a href="' + forum + s80 + '/general/' + o80 + '/last/#last"><img src="' + flag + '/' + s80 + '.png" title="' + n80 + '"></a>&nbsp;<a href="' + forum + s81 + '/general/' + o81 + '/last/#last"><img src="' + flag + '/' + s81 + '.png" title="' + n81 + '"></a>&nbsp;<a href="' + forum + s82 + '/general/' + o82 + '/last/#last"><img src="' + flag + '/' + s82 + '.png" title="' + n82 + '"></a>&nbsp;<a href="' + forum + s83 + '/general/' + o83 + '/last/#last"><img src="' + flag + '/' + s83 + '.png" title="' + n83 + '"></a>&nbsp;<a href="' + forum + s84 + '/general/' + o84 + '/last/#last"><img src="' + flag + '/' + s84 + '.png" title="' + n84 + '"></a>&nbsp;<a href="' + forum + s85 + '/general/' + o85 + '/last/#last"><img src="' + flag + '/' + s85 + '.png" title="' + n85 + '"></a>&nbsp;<a href="' + forum + s86 + '/general/' + o86 + '/last/#last"><img src="' + flag + '/' + s86 + '.png" title="' + n86 + '"></a>&nbsp;<a href="' + forum + s87 + '/general/' + o87 + '/last/#last"><img src="' + flag + '/' + s87 + '.png" title="' + n87 + '"></a>&nbsp;<a href="' + forum + s88 + '/general/' + o88 + '/last/#last"><img src="' + flag + '/' + s88 + '.png" title="' + n88 + '"></a>&nbsp;<a href="' + forum + s89 + '/general/' + o89 + '/last/#last"><img src="' + flag + '/' + s89 + '.png" title="' + n89 + '"></a>&nbsp;<a href="' + forum + s90 + '/general/' + o90 + '/last/#last"><img src="' + flag + '/' + s90 + '.png" title="' + n90 + '"></a>&nbsp;<a href="' + forum + s91 + '/general/' + o91 + '/last/#last"><img src="' + flag + '/' + s91 + '.png" title="' + n91 + '"></a>&nbsp;<a href="' + forum + s92 + '/general/' + o92 + '/last/#last"><img src="' + flag + '/' + s92 + '.png" title="' + n92 + '"></a>&nbsp;<a href="' + forum + s93 + '/general/' + o93 + '/last/#last"><img src="http://trophymanager.cn/tools/Transfer_Topics/image/tw.png" title="' + n93 + '"></a>&nbsp;<a href="' + forum + s94 + '/general/' + o94 + '/last/#last"><img src="' + flag + '/' + s94 + '.png" title="' + n94 + '"></a>&nbsp;<a href="' + forum + s95 + '/general/' + o95 + '/last/#last"><img src="' + flag + '/' + s95 + '.png" title="' + n95 + '"></a></div></li><li><a id="OlinkOC" style="font-size: 10px; color: gold;" title=""><img src="http://trophymanager.cn/tools/Transfer_Topics/image/O.png" style="width:23px;vertical-align:middle;margin-bottom:3px;"/> 大洋洲 </a></br><div id="OdivOC" style="display:none;position:relative; top:0px;left:0px"><a href="' + forum + s96 + '/general/' + o96 + '/last/#last"><img src="' + flag + '/' + s96 + '.png" title="' + n96 + '"></a>&nbsp;<a href="' + forum + s97 + '/general/' + o97 + '/last/#last"><img src="' + flag + '/' + s97 + '.png" title="' + n97 + '"></a>&nbsp;<a href="' + forum + s98 + '/general/' + o98 + '/last/#last"><img src="' + flag + '/' + s98 + '.png" title="' + n98 + '"></a>&nbsp;<a href="' + forum + s99 + '/general/' + o99 + '/last/#last"><img src="' + flag + '/' + s99 + '.png" title="' + n99 + '"></a></div></li><li><a id="OlinkSA" style="font-size: 10px; color: gold;" title=""><img src="http://trophymanager.cn/tools/Transfer_Topics/image/SA.png" style="width:23px;vertical-align:middle;margin-bottom:3px;"/> 南美洲 </a></br><div id="OdivSA" style="display:none;position:relative; top:0px;left:0px"><a href="' + forum + s100 + '/general/' + o100 + '/last/#last"><img src="' + flag + '/' + s100 + '.png" title="' + n100 + '"></a>&nbsp;<a href="' + forum + s101 + '/general/' + o101 + '/last/#last"><img src="' + flag + '/' + s101 + '.png" title="' + n101 + '"></a>&nbsp;<a href="' + forum + s102 + '/general/' + o102 + '/last/#last"><img src="' + flag + '/' + s102 + '.png" title="' + n102 + '"></a>&nbsp;<a href="' + forum + s103 + '/general/' + o103 + '/last/#last"><img src="' + flag + '/' + s103 + '.png" title="' + n103 + '"></a>&nbsp;<a href="' + forum + s104 + '/general/' + o104 + '/last/#last"><img src="' + flag + '/' + s104 + '.png" title="' + n104 + '"></a>&nbsp;<a href="' + forum + s105 + '/general/' + o105 + '/last/#last"><img src="' + flag + '/' + s105 + '.png" title="' + n105 + '"></a>&nbsp;<a href="' + forum + s106 + '/general/' + o106 + '/last/#last"><img src="' + flag + '/' + s106 + '.png" title="' + n106 + '"></a>&nbsp;<a href="' + forum + s107 + '/general/' + o107 + '/last/#last"><img src="' + flag + '/' + s107 + '.png" title="' + n107 + '"></a>&nbsp;<a href="' + forum + s108 + '/general/' + o108 + '/last/#last"><img src="' + flag + '/' + s108 + '.png" title="' + n108 + '"></a>&nbsp;<a href="' + forum + s109 + '/general/' + o109 + '/last/#last"><img src="' + flag + '/' + s109 + '.png" title="' + n109 + '"></a></div></li><li><a id="OlinkAF" style="font-size: 10px; color: gold;" title=""><img src="http://trophymanager.cn/tools/Transfer_Topics/image/AF.png" style="width:23px;vertical-align:middle;margin-bottom:3px;"/> 非洲 </a></br><div id="OdivAF" style="display:none;position:relative; top:0px;left:0px"><a href="' + forum + s110 + '/general/' + o110 + '/last/#last"><img src="' + flag + '/' + s110 + '.png" title="' + n110 + '"></a>&nbsp;<a href="' + forum + s111 + '/general/' + o111 + '/last/#last"><img src="' + flag + '/' + s111 + '.png" title="' + n111 + '"></a>&nbsp;<a href="' + forum + s112 + '/general/' + o112 + '/last/#last"><img src="' + flag + '/' + s112 + '.png" title="' + n112 + '"></a>&nbsp;<a href="' + forum + s113 + '/general/' + o113 + '/last/#last"><img src="' + flag + '/' + s113 + '.png" title="' + n113 + '"></a>&nbsp;<a href="' + forum + s114 + '/general/' + o114 + '/last/#last"><img src="' + flag + '/' + s114 + '.png" title="' + n114 + '"></a>&nbsp;<a href="' + forum + s115 + '/general/' + o115 + '/last/#last"><img src="' + flag + '/' + s115 + '.png" title="' + n115 + '"></a>&nbsp;<a href="' + forum + s116 + '/general/' + o116 + '/last/#last"><img src="' + flag + '/' + s116 + '.png" title="' + n116 + '"></a>&nbsp;<a href="' + forum + s117 + '/general/' + o117 + '/last/#last"><img src="' + flag + '/' + s117 + '.png" title="' + n117 + '"></a>&nbsp;<a href="' + forum + s118 + '/general/' + o118 + '/last/#last"><img src="' + flag + '/' + s118 + '.png" title="' + n118 + '"></a>&nbsp;<a href="' + forum + s119 + '/general/' + o119 + '/last/#last"><img src="' + flag + '/' + s119 + '.png" title="' + n119 + '"></a>&nbsp;<a href="' + forum + s120 + '/general/' + o120 + '/last/#last"><img src="' + flag + '/' + s120 + '.png" title="' + n120 + '"></a>&nbsp;<a href="' + forum + s121 + '/general/' + o121 + '/last/#last"><img src="' + flag + '/' + s121 + '.png" title="' + n121 + '"></a>&nbsp;<a href="' + forum + s122 + '/general/' + o122 + '/last/#last"><img src="' + flag + '/' + s122 + '.png" title="' + n122 + '"></a>&nbsp;<a href="' + forum + s123 + '/general/' + o123 + '/last/#last"><img src="' + flag + '/' + s123 + '.png" title="' + n123 + '"></a>&nbsp;<a href="' + forum + s124 + '/general/' + o124 + '/last/#last"><img src="' + flag + '/' + s124 + '.png" title="' + n124 + '"></a></div></li></ul></span></div>';

$(document).ready(function(){
    $("#linkEU").click(function(){
        $("#divEU").fadeToggle("fast"); //durata effetto fade
    });
    $("#linkNA").click(function(){
        $("#divNA").fadeToggle("fast");
    });
    $("#linkAS").click(function(){
        $("#divAS").fadeToggle("fast");
    });    
    $("#linkOC").click(function(){
        $("#divOC").fadeToggle("fast"); 
    });
    $("#linkSA").click(function(){
        $("#divSA").fadeToggle("fast"); 
    });
    $("#linkAF").click(function(){
        $("#divAF").fadeToggle("fast");
    });  
    $("#OlinkEU").click(function(){
        $("#OdivEU").fadeToggle("fast"); //durata effetto fade: "fast" "slow" o millisecondi senza virgolette
    });
    $("#OlinkNA").click(function(){
        $("#OdivNA").fadeToggle("fast");
    });
    $("#OlinkAS").click(function(){
        $("#OdivAS").fadeToggle("fast");
    });    
    $("#OlinkOC").click(function(){
        $("#OdivOC").fadeToggle("fast"); 
    });
    $("#OlinkSA").click(function(){
        $("#OdivSA").fadeToggle("fast"); 
    });
    $("#OlinkAF").click(function(){
        $("#OdivAF").fadeToggle("fast"); 
    });
    $("#linkTran").click(function(){
        $("#divTran").fadeToggle(1500); 
    }); 
    $("#linkOpen").click(function(){
        $("#divOpen").fadeToggle(1500);    
    });    
});