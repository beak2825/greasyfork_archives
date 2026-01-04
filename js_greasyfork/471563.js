// ==UserScript==
// @name              无剑Mud辅助
// @name:zh-TW        無劍Mud輔助
// @description       无剑Mud辅助，由在线版移植而来，順便《略改》
// @description:zh-TW 無劍Mud輔助，由在線版移植而來，順便《略改》
// @namespace         http://tampermonkey.net/
// @version           0.1.18
// @iconURL           http://res.yytou.cn/lunjian_tw/img/icon1.png
// @author            燕飞,東方鳴
// @match             http://swordman-s1.yytou.com/*
// @match             http://swordman-inter.yytou.com/*
// @grant             unsafeWindow
// @grant             GM_info
// @grant             GM_setClipboard
// @grant             GM_xmlhttpRequest
// @connect           greasyfork.org
// @run-at            document-end
// @compatible        Chrome >= 80
// @compatible        Edge >= 80
// @compatible        Firefox PC >= 74
// @compatible        Opera >= 67
// @compatible        Safari MacOS >= 13.1
// @compatible        Firefox Android >= 79
// @compatible        Opera Android >= 57
// @compatible        Safari iOS >= 13.4
// @compatible        WebView Android >= 80  那一堆萬年不更新WebView的國產安卓手機不會在這出問題吧（
// @downloadURL https://update.greasyfork.org/scripts/471563/%E6%97%A0%E5%89%91Mud%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/471563/%E6%97%A0%E5%89%91Mud%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

"use strict";
// 取消屏蔽
var KEYWORD_PATTERNS = g_gmain.KEYWORD_PATTERNS;
g_gmain.KEYWORD_PATTERNS = [];

$(() => {
  function init() {
    PLU.YFUI = YFUI;
    PLU.UTIL = UTIL;
    PLU.YFD = {
      mapsLib: {
        Map: [
          {
            name: "雪亭鎮",
            way: "jh 1;雪亭鎮:飲風客棧^飲風客棧二樓;w;e;n;s;e;w;s;e;s;w;s;n;w;e;e;e;ne;ne;sw;sw;n;w;n;w;e;e;e;n;s;e;e;n;s;s;n;e;w;w;w;w;w;n;w;e;n;w;e;e;e;w;w;n;e;w;w;e;n",
            rank: ["rank go 46;s;w;w;w;w;s;w", "rank go 56;w;s;w", "rank go 65;e;s;w", "rank go 69;w", "rank go 95;w;w;w;s;w"],
            desc: "采集者：王辉",
          },
          {
            name: "洛陽",
            way: "jh 2;n;n;e;s;洛陽:洛水渡口^船塢;n;n;w;n;w;putuan;n;e;e;s;n;w;n;e;s;n;w;w;event_1_98995501;n;w;e;n;e;w;s;s;s;s;w;e;n;e;n;w;s;luoyang111_op1;e;n;w;n;w;get_silver;s;e;n;n;e;get_silver;n;w;s;s;s;e;n;n;w;e;s;s;e;e;n;op1;s;s;e;n;n;w;e;e;n;s;w;n;w;e;n;e;w;n;w;e;s;s;s;s;s;w;w;n;w;e;e;n;s;w;n;e;w;n;w;洛陽:城樓^城樓密室;n;e;e;w;n;e;n;n;n;s;s;s;w;n;w;w;w;w;e;e;e;e;n;n;n;n",
            desc: "采集者：王辉",
          },
          {
            name: "華山村",
            way: "jh 3;n;e;w;s;w;n;s;event_1_59520311;n;n;w;get_silver;s;e;n;n;e;get_silver;n;w;n;e;w;s;s;s;s;s;e;e;s;e;n;s;w;s;e;s;huashancun24_op2;w;n;w;w;n;s;e;s;s;w;get_silver;n;n;s;e;huashancun15_op1;event_1_46902878;;kill?藏劍樓殺手;@藏劍樓殺手的屍體;w;w;s;e;w;nw;n;n;e;get_silver;s;w;n;w;give huashancun_huashancun_fb9;e;e;n;n;w;e;n;s;e",
            desc: "采集者：戴爽",
          },
          {
            name: "華山",
            way: "jh 4;n;n;w;e;n;e;w;n;n;n;n;event_1_91604710;s;s;s;w;get_silver;s;e;s;e;w;n;n;n;n;nw;s;s;w;n;n;w;s;n;w;n;get_xiangnang2;w;s;e;e;n;e;n;n;w;w;event_1_26473707;e;e;e;n;e;s;event_1_11292200;n;n;w;n;e;w;n;s;s;s;s;s;w;n;n;n;w;e;n;get_silver;s;s;e;n;n;s;s;s;s;n;n;w;s;s;w;event_1_30014247;s;w;e;s;e;w;s;s;s;e",
            desc: "采集者：王辉",
          },
          {
            name: "揚州",
            way: "jh 5;n;w;w;n;s;e;e;e;w;n;w;e;e;w;n;w;e;e;n;w;e;n;w;n;get_silver;s;s;e;e;get_silver;n;w;n;n;s;e;w;s;s;s;w;n;w;yangzhou16_op1;e;e;n;e;n;n;n;s;s;w;n;e;n;n;s;s;w;n;n;e;n;n;event_1_89774889;s;s;s;e;s;s;s;w;s;w;w;w;n;n;w;n;n;n;s;s;s;e;n;get_silver;s;s;e;e;w;w;s;s;s;s;n;n;e;e;n;w;e;e;n;n;n;n;s;s;e;w;w;e;s;s;w;n;w;e;e;get_silver;s;w;n;w;w;n;get_silver;s;s;w;s;w;e;e;e;s;s;e;e;s;s;s;n;n;n;w;w;n;n;w;w;n;e;e;e;n;e;s;e;s;s;s;n;n;n;w;n;w;n;ne;sw;s;w;s;n;w;n;w;e;e;w;n;n;w;n;s;e;e;s;n;w;n;s;s;s;s;e;e;s;s;s;w;event_1_69751810",
            desc: "采集者：王辉",
          },
          { name: "丐幫", way: "jh 6;event_1_98623439;s;w;e;n;ne;n;ne;ne;ne;event_1_97428251;n;sw;sw;sw;s;ne;ne;event_1_16841370", desc: "采集者：王辉" },
          {
            name: "喬陰縣",
            way: "jh 7;s;s;s;w;s;w;w;w;e;e;e;e;event_1_65599392;n;s;w;e;ne;s;s;e;n;n;e;w;s;s;w;s;w;w;w;n;s;s;e;n;s;e;ne;s;e;n;e;s;e",
            desc: "采集者：树",
          },
          {
            name: "峨眉山",
            way: "jh 8;w;nw;n;n;n;n;w;e;se;nw;e;n;s;e;n;n;e;;kill?看山弟子;n;n;n;n;e;e;w;w;w;n;n;n;w;w;s;e;w;w;e;s;e;w;w;e;n;n;w;w;n;s;sw;ne;e;e;n;e;w;w;e;n;e;w;w;e;n;w;w;w;n;n;n;s;s;s;e;e;e;e;e;s;s;s;e;e;s;w;e;e;w;s;w;e;e;w;n;n;e;e;w;w;n;w;e;e;w;n;w;e;e;w;n;e;e;w;w;w;w;n;w;w;e;n;s;s;n;e;n;n;n;n;s;s;nw;nw;n;n;s;s;se;sw;w;nw;w;e;se;e;ne;se;ne;se;s;se;nw;n;nw;ne;n;s;se;e",
            desc: "采集者：王辉",
          },
          {
            name: "恆山",
            way: "jh 9;n;w;e;n;e;get_silver;w;w;n;w;e;n;henshan15_op1;e;e;w;n;event_1_85624865;n;w;event_1_27135529;e;e;e;w;n;n;n;s;henshan_zizhiyu11_op1;e;s;s;s;w;n;n;w;n;s;s;n;e;e;e;w;n;s;w;n;n;w;n;e;n;s;w;n;n;w;get_silver;s;e;n",
            desc: "采集者：王辉",
          },
          {
            name: "武當山",
            way: "jh 10;w;n;n;w;w;w;n;n;n;n;e;e;e;e;s;e;s;e;n;s;s;n;e;e;n;s;e;w;s;s;s;n;n;n;w;w;w;n;w;n;w;w;w;w;n;w;n;s;e;e;e;s;n;e;e;w;w;w;w;n;n;n;n;jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;w;nw;sw;ne;n;nw;event_1_5824311",
            desc: "采集者：王辉",
          },
          {
            name: "晚月莊",
            way: "jh 11;e;e;s;sw;se;w;n;s;w;w;s;n;w;e;e;s;w;e;s;e;e;e;w;w;w;w;s;n;w;n;s;s;n;e;e;s;w;w;e;e;e;e;w;w;s;e;e;w;w;n;e;n;n;w;n;n;n;e;e;s;s;s;w;s;s;w;e;se;e;se;ne;n;nw;w;s;s;s;se;s",
            desc: "采集者：戴爽",
          },
          { name: "水煙閣", way: "jh 12;n;e;w;n;n;n;s;w;n;n;e;w;s;nw;e;e;sw;n;s;s;e;w;n;ne;w;n", desc: "采集者：王辉" },
          {
            name: "少林寺",
            way: "jh 13;e;s;s;w;w;w;event_1_38874360;jh 13;n;w;w;n;shaolin012_op1;s;s;e;e;n;w;e;e;w;n;n;w;e;e;w;n;n;w;e;e;w;n;shaolin27_op1;event_1_34680156;s;w;n;w;e;e;w;n;shaolin25_op1;w;n;w;s;s;s;get_silver;w;s;s;s;s;s;n;n;n;n;n;n;n;n;e;e;s;s;s;s;get_silver;w;s;s;s;get_silver;w;s;n;n;n;n;n;n;n;n;w;n;w;e;e;w;n;e;w;w;n;get_silver",
            desc: "采集者：王辉",
          },
          {
            name: "唐門",
            way: "jh 14;e;w;w;n;n;n;n;s;w;n;s;s;n;w;n;s;s;n;w;n;s;s;n;w;e;e;e;e;e;s;n;e;n;e;w;n;n;s;#2 ask tangmen_tangmei;e;e;唐門:拜箭亭^兵器室;n;n;s;s;e",
            desc: "采集者：王辉",
          },
          {
            name: "青城山",
            way: "jh 15;s;ne;sw;s;e;w;w;n;s;e;s;e;w;w;w;n;s;s;s;n;n;w;w;w;n;s;w;e;e;e;e;e;e;s;e;w;w;e;s;e;w;s;w;s;ne;s;s;s;e;s;n;w;n;n;n;n;n;n;n;n;n;n;nw;w;nw;w;s;s;s;;kill?申月富;w;w;n;w;e;e;w;n;w;s;w;s;e;s;n;e;e;e;n;n;n;e;n;event_1_14401179",
            desc: "采集者：東方鳴",
          },
          {
            name: "逍遙林",
            way: "jh 16;s;s;s;s;e;e;s;w;n;s;s;s;n;n;w;n;n;s;s;s;s;n;n;w;w;n;s;s;n;w;e;e;e;e;e;e;n;n;e;event_1_5221690;s;w;event_1_57688376;n;n;w;w;e;n;s;e;e;n;event_1_88625473;event_1_82116250;event_1_90680562;event_1_38586637;s;s;e;n;n;w;n;e;jh 16;s;s;s;s;e;n;e;event_1_56806815;jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;#8 event_1_38333366;",
            desc: "采集者：『空白』",
          },
          {
            name: "開封",
            way: "jh 17;n;w;e;e;s;n;w;n;w;s;n;n;n;s;s;e;e;e;s;n;n;n;s;s;w;s;s;s;w;e;s;w;e;n;e;n;s;s;n;e;e;jh 17;n;n;n;e;w;n;e;w;n;e;se;s;n;nw;n;n;n;event_1_27702191;jh 17;n;n;n;n;w;w;n;s;s;n;w;w;e;n;n;w;e;s;s;s;s;w;jh 17;sw;nw;se;s;sw;nw;ne;event_1_38940168;jh 17;e;s;s;s;e;kaifeng_yuwangtai23_op1;s;w;s;s;w;jh 17;n;n;e;e;n;get_silver",
            desc: "采集者：王辉",
          },
          {
            name: "明教",
            way: "jh 18;w;n;s;e;e;w;n;nw;sw;ne;n;n;w;e;n;n;n;ne;n;n;e;w;w;e;n;e;w;w;e;n;n;e;e;se;se;e;w;nw;nw;n;w;w;w;w;s;s;n;e;w;n;n;n;e;nw;nw;se;se;e;s;w;e;e;w;n;e;e;se;e;w;sw;s;w;w;n;e;w;n;n;n;n;n;w;e;n;event_1_90080676;event_1_56007071;ne;n;nw;se;s;s;e;n;w;nw;sw;se;e;se;nw;s;s;s;s;w;nw;nw;event_1_70957287;event_1_39374335;;kill?九幽毒童;event_1_2077333",
            desc: "采集者：淼淼淼、戴爽",
          },
          {
            name: "全真教",
            way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;w;e;e;w;n;w;w;w;s;n;w;s;n;e;e;e;e;e;n;s;e;n;n;s;s;e;w;w;w;n;n;n;w;e;e;s;n;e;n;n;n;n;s;e;s;n;n;n;w;n;w;w;w;s;s;s;s;s;e;n;n;n;s;w;s;n;w;n;s;s;s;w;n;n;n;s;w;s;s;s;s;e;s;s;n;n;e;s;s;n;n;e;e;n;n;n;n;w;w;w;n;n;e;n;e;e;n;n",
            desc: "采集者：24叶欣贤、戴爽",
          },
          {
            name: "古墓",
            way: "jh 20;s;s;n;n;w;w;s;e;s;s;s;s;s;sw;sw;s;e;se;nw;w;s;w;e;e;w;s;s;w;w;e;e;s;w;sw;ne;e;s;s;s;n;w;w;e;e;e;e;e;e;s;e;w;n;w;n;n;s;e;w;w;s;n;n;event_1_3723773;se;n;e;s;e;s;e",
            desc: "采集者：東方鳴",
          },
          {
            name: "白馱山",
            way: "jh 21;nw;s;n;ne;ne;sw;n;n;ne;w;e;n;n;n;s;w;w;jh 21;nw;w;n;s;w;nw;e;w;nw;nw;n;w;sw;ne;s;event_1_47975698;s;sw;s;ne;e;s;s;jh 21;nw;w;w;nw;n;e;w;n;n;w;e;n;n;e;e;w;nw;se;e;ne;sw;e;se;nw;w;n;s;s;n;w;w;n;n;n;n;s;s;s;s;e;e;e;n;n;w;e;e;e;w;w;n;nw;se;ne;w;e;e;w;n",
            desc: "采集者：王辉",
          },
          {
            name: "嵩山",
            way: "jh 22;n;n;w;w;s;s;e;w;s;s;w;e;s;n;n;n;n;n;e;n;n;n;n;n;e;n;e;e;w;w;n;w;n;s;e;n;n;n;e;songshan33_op1;n;w;w;w;e;n;w;e;n;s;s;e;n;e;w;n;e;w;n;get_silver;jh 22;n;n;n;n;e;n;event_1_1412213;s;event_1_29122616;jh 22;n;n;n;n;n;n;n",
            desc: "采集者：王辉",
          },
          {
            name: "寒梅莊",
            way: "jh 23;n;n;e;w;n;n;n;n;n;w;w;e;e;e;s;n;w;n;w;n;s;w;e;e;e;n;s;w;n;n;e;w;event_1_8188693;n;n;w;e;n;e;n;s;w;n;s;s;s;s;s;w;n",
            desc: "采集者：@远",
          },
          {
            name: "泰山",
            way: "jh 24;se;nw;n;n;n;n;w;e;e;e;w;s;n;w;n;n;w;e;e;w;n;e;w;n;w;n;n;n;n;n;s;s;w;n;s;e;s;s;s;e;n;e;w;n;w;e;n;n;e;s;n;e;n;e;w;n;w;e;e;w;n;n;s;s;s;s;s;w;w;n;n;w;e;e;w;n;n;w;e;e;w;n;s;s;s;s;s;w;n;e;w;n;w;e;n;n;e",
            desc: "采集者：王辉",
          },
          {
            name: "大旗門",
            way: "jh 11;e;e;s;n;nw;w;nw;e;e;e;n;w;e;s;se;jh 25;w;e;e;e;e;e;s;yell;n;s;e;ne;se;e;e;e;e;w;w;w;w;nw;sw;w;s;e;event_1_81629028;s;e;n;w;w;s;w",
            desc: "采集者：24叶欣贤",
          },
          {
            name: "大昭寺",
            way: "jh 26;w;w;w;w;w;n;s;w;s;w;e;e;e;w;w;s;w;w;w;s;n;w;n;n;n;n;n;e;e;e;e;e;w;s;s;w;w;n;w;e;e;w;s;w;n;s;s;n;w;ask?lama_master;event_1_91837538",
            desc: "采集者：王辉",
          },
          {
            name: "魔教",
            way: "jh 27;se;e;e;e;w;w;w;nw;ne;w;e;n;ne;sw;s;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;sw;ne;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;w;e;e;w;n;e;n;s;w;n;nw;n;s;se;ne;n;s;sw;w;ne;n;s;ne;n;n;s;s;nw;n;s;se;w;n;s;e;sw;n;s;ne;se;n;s;nw;e;e;n;s;s;n;e;n;s;s;n;e;n;s;s;n;e;n;s;s;n;e;n;s;s;n;w;w;w;w;w;n;n;n;n;n;w;w;w;w;w;e;e;e;e;e;e;e;e;e;e;w;w;w;w;w;n;n;event_1_57107759;e;e;n;w",
            desc: "采集者：王辉",
          },
          { name: "星宿海", way: "jh 28;sw;nw;sw;se;ne;nw;nw;w;e;e;n;w;w;w;w;n;w;se;n;n;se;n;n;n;n;nw;w;ne;se;n;n;n;n;se", desc: "" },
          { name: "茅山", way: "jh 29;n;n;n;n;event_1_60035830;event_1_65661209;n;n;n;n;n;e;n;n;n;event_1_98579273;w;nw;e;n;e;e", desc: "" },
          { name: "桃花島", way: "jh 30;n;n;ne;n;n;n;w;e;n;n;w;w;e;n;s;n;n;n;w;w;s;s;e;n;s;e;n;e;n;s;nw;w;n;n;n;e;e;n;se;s", desc: "" },
          { name: "鐵雪山莊", way: "jh 31;n;n;n;w;w;w;w;n;n;n;n;w;e", desc: "" },
          {
            name: "慕容山莊",
            way: "jh 32;n;n;se;e;s;s;n;w;ne;n;n;n;e;n;w;s;w;w;n;event_1_72278818;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;w;w;n;e;n;e;n;w;e;n;event_1_55226665;n;event_1_99232080;e;e;s;e;s;e;e;e;n;s",
            desc: "",
          },
          {
            name: "大理",
            way: "jh 33;sw;sw;s;s;s;nw;n;nw;n;n;n;n;n;e;n;s;e;sw;w;w;s;s;e;s;w;se;e;s;s;s;w;w;se;e;s;ne;e;se;n;n;n;n;n;w;ne;se;s;w;w;n;se;w;w;s;nw;n;e;se;n;n;w;se;e;se;e;se;e;e;n;s;e;e;se;e;e;se;n;n;n;n;n;n;e;n;n;n;e;e;se;e;s;ne;e;se;e;e;s;ne;e;n;sw;s;s;e;n;e;n;e;s;e;s;e;e;e;s;w;n;n;s;s;s;w;n;n;n;n;w;e;n;e;n;se;w;n;w;e;n;e;e;s;n;n;w;e;n;ne;n;e;e;n;s;e;ne;se;se;n;n;n;e;s;w;w;e;n;e;s;s;e;n;s;w;n;se;n;ne;s;w;e;n;s;s;e;s;w;se;s;s;s;e;n;sw;sw;w;s;n;n;s;e;n;n;n;s;e;se;s;sw;n;w;s",
            desc: "",
          },
          { name: "斷劍山莊", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;n;n;w;n;e;e;n;n", desc: "" },
          { name: "冰火島", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw;s;s;s;s;s;s;w;w;n;e;n;w;w;s;s", desc: "" },
          { name: "俠客島", way: "", desc: "" },
          {
            name: "絕情谷",
            way: "jh 37;n;e;e;nw;nw;w;n;nw;n;n;ne;n;nw;se;s;sw;s;s;se;e;n;e;e;e;ne;ne;ne;se;s;s;s;w;e;n;n;n;nw;sw;sw;nw;w;n;nw;n;ne;e;ne;se;nw;sw;w;sw;nw;w;n;nw;n;s;se;s;e;n;nw;n;nw;se;s;se;s;ne;n;ne;sw;s;sw;n;ne;e;ne;e;n",
            desc: "",
          },
          {
            name: "碧海山莊",
            way: "jh 38;n;n;n;n;w;w;e;e;n;n;n;w;w;nw;w;w;n;n;s;s;e;e;se;e;e;n;n;e;se;s;e;w;n;nw;w;n;n;e;e;se;se;e;n;n;n;s;s;s;w;nw;nw;w;w;n;n;n;n",
            desc: "",
          },
          { name: "天山", way: "jh 39;ne;e;n;nw;nw;w;s;s;sw;n;nw;e;sw;w;s;w;n;w", desc: "" },
          { name: "苗疆", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se", desc: "" },
          { name: "白帝城", way: "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;e;e;w;w;n;n;n;s;s;s;w;w;w", desc: "" },
          { name: "墨家機關城", way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;w;w;n;n;n;e;w;s;s;s;e;e;e;e;n;n;n;w", desc: "" },
          { name: "掩月城", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se;se;sw;sw;s;e;s;s;s", desc: "" },
          { name: "海雲閣", way: "jh 44;n;n;n;n;w;w;nw;n;n;ne;n;n;e;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se;ne;ne;n;n;n;n;nw", desc: "" },
          { name: "幽冥山莊", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;e;e", desc: "" },
          { name: "花街", way: "jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e;e;e;w;w;w;w;w;w;w;n;n;n;e;e;e;w;w;e;s;n;n", desc: "" },
          { name: "西涼城", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n;n;ne;n", desc: "" },
          { name: "高昌迷宮", way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s;s;s;sw;sw;s;sw;se", desc: "" },
          { name: "京城", way: "", desc: "" },
          { name: "越王劍宮", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n;s;s;s;se;se;se;s;s;s;s;sw;sw;sw;ne;ne;ne;se;se;e;n;n;n;e;w;n;n;n;n;n;w;e;n;n;n", desc: "" },
          {
            name: "江陵",
            way: "jh 51;n;n;w;e;e;w;n;n;w;w;n;n;s;s;e;e;e;e;e;e;s;s;n;n;e;e;e;e;se;e;e;w;w;nw;w;w;s;s;s;se;se;e;e;w;w;nw;nw;n;n;n;w;w;n;n;e;w;w;w;e;e;n;n;nw;n;n;n;e;e",
            desc: "",
          },
          { name: "天龍寺", way: "", desc: "" },
          { name: "西夏", way: "", desc: "" },
          { name: "南詔國", way: "", desc: "" },
        ],
        Labyrinth: {
          雪亭鎮: { "飲風客棧^飲風客棧二樓": "inn_op1", "飲風客棧二樓^飲風客棧": "s" },
          洛陽: { "城樓^城樓密室": "luoyang14_op1", "城樓密室^城樓": "n", "洛水渡口^船塢": "luoyang317_op1", "船塢^洛水渡口": "n" },
          唐門: { "拜箭亭^兵器室": "event_1_8413183;event_1_39383240;e;s;e;n;w", "兵器室^拜箭亭": "e;n;n;n;n;nw;n" },
        },
        Task: {
          雪亭鎮: "jh 1;ask snow_waiter;ask snow_mercenary;e;n;fight snow_worker;n;e;give snow_guard;home",
          洛陽: "jh 2;n;ask luoyang_luoyang18;n;kill luoyang_xiaotou;n;kill luoyang_xiaotou;e;kill luoyang_xiaotou;s;fight luoyang_luoyang27;s;kill luoyang_xiaotou;home",
          華山村:
            "jh 3;ask huashancun_huashancun12;fight huashancun_huashancun12;n;event_1_38583676;#3 s;fight huashancun_popitouzi;s;w;fight huashancun_huashancun1;w;give huashancun_huashancun6;home",
          青城山:
            "jh 15;n;nw;w;nw;w;s;s;fight qingcheng_dizi1;s;kill qingcheng_renjie;w;w;fight qingcheng_renying;w;ask qingcheng_masteryu;#3 e;#3 n;e;se;e;se;#7 s;sw;n;ask qingcheng_mudaoren",
          逍遙林:
            "jh 16;#4 s;e;e;s;w;ask xiaoyao_mengmianr;kill xiaoyao_mengmianr;w;ask xiaoyao_suxinghe;fight xiaoyao_suxinghe;#3 e;n;n;e;w;s;e;s;w;wait#kill xiaoyao_mengmianr;e;e;n;n;e;kill xiaoyao_mengmianr",
          開封: "jh 17;n;e;fight kaifeng_kaifeng19;s;ask kaifeng_kaifeng3;n;w;w;ask kaifeng_kaifeng2;e;#4 n;e;n;n;ask kaifeng_kaifeng28;n;event_1_27702191;ask kaifeng_kaifeng30;fight kaifeng_kaifeng30;w;#3 s;w;#4 s;e;s;ask kaifeng_kaifeng3",
          明教: "jh 18;n;nw;#5 n;ne;#10 n;ask mingjiao_zhang;#6 s;ask mingjiao_weiyixiao;fight mingjiao_weiyixiao;#6 n;ask mingjiao_zhang;s;w;ask mingjiao_longwang;fight mingjiao_longwang;e;n;ask mingjiao_zhang;s;e;ask mingjiao_shiwang;fight mingjiao_shiwang;w;n;ask mingjiao_zhang;s;ask mingjiao_yingwang;fight mingjiao_yingwang",
        },
        Npc: [
          {
            jh: "雪亭鎮",
            loc: "離隱齋",
            name: "金庸大师",
            name_tw: "金庸大師",
            way: "jh 1;w",
            desc: "泱泱中華，上下五千年，朝代更替，江山變換，風雲人物之中，唯有此人開創一全新世界，謂之『江湖』。凡入江湖之人，無能得出。隻緣所聞故事均曲折離奇，所見之人皆栩栩如生，所歷若長江大河一氣呵成，所思無不字字入心繞梁三日。明知在他談笑之間贈予你的，不過是夏日裡的一場春夢，卻鮮有人不癡迷於其斑斕的色彩和無盡的神韻。",
          },
          {
            jh: "雪亭鎮",
            loc: "飛狐外傳",
            name: "胡斐",
            way: "jh 1;w;w;n",
            desc: "這人滿腮虯髯，根根如鐵，一頭濃發，卻不結辮，橫生倒豎般有如亂草，你看到他不禁也是一驚。",
          },
          {
            jh: "雪亭鎮",
            loc: "雪山飛狐",
            name: "苗若兰",
            name_tw: "苗若蘭",
            way: "jh 1;w;w;w;n",
            desc: "膚光勝雪，雙目猶似一泓清水，容貌秀麗之極，當真如明珠生暈，美玉瑩光，眉目間隱隱有一股書卷的清氣，與胡斐同榻時臉蛋羞得如海棠花般，嬌美艷麗，難描難畫，美目流波，俏臉生暈，月光雪光映在身旁苗若蘭皎潔無瑕的臉上，當真是人間仙境，是天仙般的人物。",
          },
          {
            jh: "雪亭鎮",
            loc: "連城訣",
            name: "淩霜华",
            name_tw: "淩霜華",
            way: "jh 1;w;w;w;w;n",
            desc: "隻見一個清秀絕俗的少女正在觀賞菊花，穿一身嫩黃衫子，當真是人淡如菊，怕是你這一生之中，從未見過這般雅緻清麗的姑娘。",
          },
          {
            jh: "雪亭鎮",
            loc: "天龍八部",
            name: "乔峰",
            name_tw: "喬峰",
            way: "jh 1;w;w;w;w;w;n",
            desc: "身材甚是魁偉，三十來歲年紀，身穿灰色舊布袍，已微有破爛，濃眉大眼，高鼻闊口，一張四方的國字臉，頗有風霜之色，顧盼之際，極有威勢。",
          },
          {
            jh: "雪亭鎮",
            loc: "笑傲江湖",
            name: "红叶禅师",
            name_tw: "紅葉禪師",
            way: "jh 1;w;w;s",
            desc: "莆田南少林方丈，收藏《葵花寶典》一書，乃是一位大智大慧的了不起人物。",
          },
          {
            jh: "雪亭鎮",
            loc: "倚天屠龍記",
            name: "赵敏",
            name_tw: "趙敏",
            way: "jh 1;w;w;w;w;w;w;s",
            desc: "汝陽王之女，封號“紹敏郡主”，趙敏是她的漢名。其父在當朝執掌兵馬大權，因此自幼生性好武，內力不深，但見識頗廣。她愛做漢人打扮，活脫脫是個漢人美女。她嬌美無匹，面瑩如玉，眼澄似水，笑意盈盈，不單艷麗不可方物，還自有一番說不盡的嬌媚可愛。",
          },
          { jh: "雪亭鎮", loc: "白馬嘯西風", name: "李文秀", way: "jh 1;w;w;w;w;w;w;w;n", desc: "這是草原上最美麗、最會唱歌的少女。她玉雪可愛，卻不得心上人所愛。" },
          {
            jh: "雪亭鎮",
            loc: "鹿鼎記",
            name: "双儿",
            name_tw: "雙兒",
            way: "jh 1;#8 w;n",
            desc: "重情重義，溫柔善良，善解人意，乖巧聰慧，體貼賢惠，清秀可人，靦腆羞澀，誠實不欺，胸無城府，忠肝義膽，天真純潔。",
          },
          {
            jh: "雪亭鎮",
            loc: "神雕俠侶",
            name: "郭襄",
            way: "jh 1;w;w;w;w;s",
            desc: "少女清雅秀麗，無疑是個美人坯子。穿淡綠緞子皮襖，頸中掛著一串明珠，每顆珠子都一般的小指頭大小，發出淡淡光暈。你不禁為她美貌所懾，住口不言，呆呆望著。",
          },
          {
            jh: "雪亭鎮",
            loc: "俠客行",
            name: "丁丁當當",
            way: "jh 1;w;w;w;w;w;s",
            desc: "一張清麗白膩的臉龐，小嘴邊帶著俏皮微笑，月光照射在她明澈的眼睛之中，宛然便是兩點明星。",
          },
          { jh: "雪亭鎮", loc: "射雕英雄傳", name: "郭靖", way: "jh 1;w;w;w;w;w;w;n", desc: "體格粗壯，濃眉大眼。雖衣著帶幾分土氣，卻難掩大俠風骨。" },
          { jh: "雪亭鎮", loc: "越女劍", name: "阿青", way: "jh 1;#9 w", desc: "這少女一張瓜子臉，睫長眼大，皮膚白晰，容貌甚為秀麗，身材苗條，弱質纖纖。" },
          {
            jh: "雪亭鎮",
            loc: "書劍恩仇錄",
            name: "霍青桐",
            way: "jh 1;w;w;w;s",
            desc: "霍青桐：十八九歲年紀，腰插匕首，長辮垂肩，頭戴金絲繡的小帽，帽邊插一根長長的翠綠羽毛，革履青馬，旖旎如畫。秀美中透著一股英氣，光彩照人，當真是麗若春梅綻雪，神如秋蕙披霜，兩頰融融，霞映澄塘，雙目晶晶，月射寒江。此女乃天山北路回疆部落首領木卓倫之女，霍阿伊之妹，喀絲麗之姐，“天山雙鷹”之徒。一手天山劍法甚是厲害。她相貌出眾，才智過人，愛穿黃衫，帽邊常插一根長長的翠綠羽毛，因此得了個漂亮外號，天山南北武林中人都知道“翠羽黃衫”霍青桐。",
          },
          { jh: "雪亭鎮", loc: "碧血劍", name: "袁承志", way: "jh 1;#7 w;s", desc: "為人沉穩，以國家大義為己任，出生入死；他以其父為標榜，當仁不讓。" },
          { jh: "雪亭鎮", loc: "鴛鴦刀", name: "任飛燕", way: "jh 1;#8 w;s", desc: "一個風程僕僕的俠客。" },
          { jh: "雪亭鎮", loc: "飲風客棧", name: "五一大使", way: "jh 1", desc: "一個風程僕僕的俠客。" },
          {
            jh: "雪亭鎮",
            loc: "飲風客棧",
            name: "小糖人",
            way: "jh 1",
            desc: "小糖人造型多變，本以熬化的蔗糖或麥芽糖做成，一會變成人物、一會變成動物、花草等。據說誕生於宋代春節鬧花燈的集市。",
          },
          { jh: "雪亭鎮", loc: "飲風客棧", name: "光棍", way: "jh 1", desc: "一個風程僕僕的俠客。" },
          {
            jh: "雪亭鎮",
            loc: "飲風客棧",
            name: "陈汤",
            name_tw: "陳湯",
            way: "jh 1",
            desc: "西漢六大名將之一，其句“明犯我強漢者，雖遠必誅”，過了兩千年依然是激動人心。",
          },
          { jh: "雪亭鎮", loc: "飲風客棧", name: "双旦使者", name_tw: "雙旦使者", way: "jh 1", desc: "一個風程僕僕的俠客。" },
          {
            jh: "雪亭鎮",
            loc: "飲風客棧",
            name: "过年小【二】",
            name_tw: "週年小【貳】",
            way: "jh 1",
            desc: "這是論劍兩週年特別形象大使，眉目俊秀，頗有幾分劍大師的風採。",
          },
          {
            jh: "雪亭鎮",
            loc: "飲風客棧",
            name: "逄义",
            name_tw: "逄義",
            way: "jh 1",
            desc: "逄義是封山派中和柳淳風同輩的弟子，但是生性好賭的他並不受師父及同門師兄弟的喜愛，因此輩分雖高，卻未曾擔任門中任何重要職務。逄義經常外出，美其名曰：旅行，實則避債，礙於門規又不敢做那打家劫舍的勾當，因此經常四處尋找賺錢發財的機會。",
          },
          { jh: "雪亭鎮", loc: "飲風客棧", name: "店小二", way: "jh 1", desc: "這位店小二正笑咪咪地忙著，還不時拿起掛在脖子上的抹布擦臉。" },
          { jh: "雪亭鎮", loc: "飲風客棧", name: "剑大师", name_tw: "劍大師", way: "jh 1", desc: "宗之瀟灑美少年舉觴白眼望青天皎如玉樹臨風前" },
          { jh: "雪亭鎮", loc: "廣場", name: "苦力", way: "jh 1;e", desc: "一個苦力打扮的漢子在這裡等人來僱用。" },
          { jh: "雪亭鎮", loc: "城隍廟", name: "庙祝", name_tw: "廟祝", way: "jh 1;e;e", desc: "這個老人看起來七十多歲了，看著他佝僂的身影，你忽然覺得心情沈重了下來。" },
          { jh: "雪亭鎮", loc: "黃土小徑", name: "野狗", way: "jh 1;e;e;s;ne", desc: "一隻渾身臟兮兮的野狗。" },
          { jh: "雪亭鎮", loc: "山路", name: "蒙面剑客", name_tw: "蒙面劍客", way: "jh 1;e;e;s;ne;ne", desc: "蒙著臉，身後背著一把劍，看上去武藝頗為不俗。" },
          {
            jh: "雪亭鎮",
            loc: "淳風武館大門",
            name: "刘安禄",
            name_tw: "劉安祿",
            way: "jh 1;e;n;e",
            desc: "劉安祿是淳風武館的門房，除了館主柳淳風沒有人知道他的出身來歷，隻知到他的武藝不弱，一手快刀在這一帶罕有敵手。",
          },
          { jh: "雪亭鎮", loc: "淳風武館教練場", name: "武馆弟子", name_tw: "武館弟子", way: "jh 1;e;n;e;e", desc: "你看到一位身材高大的漢子，正在辛苦地操練著。" },
          {
            jh: "雪亭鎮",
            loc: "淳風武館教練場",
            name: "李火狮",
            name_tw: "李火獅",
            way: "jh 1;e;n;e;e",
            desc: "李火獅是個孔武有力的大塊頭，他正在訓練他的弟子們習練「柳家拳法」。",
          },
          {
            jh: "雪亭鎮",
            loc: "淳風武館大廳",
            name: "柳淳风",
            name_tw: "柳淳風",
            way: "jh 1;e;n;e;e;e",
            desc: "柳淳風是個相當高大的中年儒生，若不是從他腰間掛著的「玄蘇劍」你大概猜不到眼前這個溫文儒雅的中年人竟是家大武館的館主。",
          },
          { jh: "雪亭鎮", loc: "書房", name: "柳绘心", name_tw: "柳繪心", way: "jh 1;e;n;e;e;e;e;n", desc: "柳繪心是淳風武館館主柳淳風的獨生女。" },
          { jh: "雪亭鎮", loc: "雪亭鎮街道", name: "醉汉", name_tw: "醉漢", way: "jh 1;e;n;n", desc: "一個喝得醉醺醺的年輕人。。。。。" },
          { jh: "雪亭鎮", loc: "雪亭鎮街道", name: "收破烂的", name_tw: "收破爛的", way: "jh 1;e;n;n", desc: "這個人不但自己收破爛，身上也穿得破爛不堪。" },
          { jh: "雪亭鎮", loc: "木屋", name: "花不为", name_tw: "花不為", way: "jh 1;e;n;n;n;n;e", desc: "此人前幾年搬到雪亭鎮來，身世迷糊。" },
          {
            jh: "雪亭鎮",
            loc: "雪亭驛",
            name: "杜宽",
            name_tw: "杜寬",
            way: "jh 1;e;n;n;n;n;w",
            desc: "杜寬擔任雪亭驛的驛長已經有十幾年了，雖然期間有幾次升遷的機會，但是他都因為捨不得離開這個小山村而放棄了，雪亭鎮的居民對杜寬的風評相當不錯，常常會來到驛站跟他聊天。",
          },
          { jh: "雪亭鎮", loc: "雪亭驛", name: "杜宽宽", name_tw: "杜寬寬", way: "jh 1;e;n;n;n;n;w", desc: "不要殺我~~~~~~~~~~" },
          {
            jh: "雪亭鎮",
            loc: "桑鄰藥鋪",
            name: "杨掌柜",
            name_tw: "楊掌櫃",
            way: "jh 1;e;n;n;n;w",
            desc: "楊掌櫃是這附近相當有名的大善人，常常施捨草藥給付不起藥錢的窮人。此外他的醫術也不錯，年輕時曾經跟著山煙寺的玄智和尚學醫，一般的傷寒小病直接問他開藥吃比醫生還靈。",
          },
          { jh: "雪亭鎮", loc: "桑鄰藥鋪", name: "樵夫", way: "jh 1;e;n;n;n;w", desc: "你看到一個粗壯的大漢，身上穿著普通樵夫的衣服。" },
          { jh: "雪亭鎮", loc: "打鐵鋪子", name: "王铁匠", name_tw: "王鐵匠", way: "jh 1;e;n;n;w", desc: "王鐵匠正用鐵鉗夾住一塊紅熱的鐵塊放進爐中。打孔" },
          {
            jh: "雪亭鎮",
            loc: "安記錢莊",
            name: "安惜迩",
            name_tw: "安惜邇",
            way: "jh 1;e;n;w",
            desc: "安惜邇是個看起來相當斯文的年輕人，不過有時候會有些心不在焉的樣子，雪亭鎮的居民對安惜邇都覺得有點神秘莫測的感覺，為什麼他年紀輕輕就身為一家大錢莊的老闆，還有他一身稀奇古怪的武功，所幸安惜邇似乎天性恬淡，甚至有些隱者的風骨，隻要旁人不去惹他，他也絕不會去招惹旁人。",
          },
          { jh: "雪亭鎮", loc: "雪亭鎮街口", name: "黎老八", way: "jh 1;e;s", desc: "這是位生性剛直，嫉惡如仇的丐幫八袋弟子。" },
          { jh: "雪亭鎮", loc: "雪亭鎮街道", name: "老农夫", name_tw: "老農夫", way: "jh 1;e;s;w", desc: "你看到一位面色黝黑的農夫。" },
          { jh: "雪亭鎮", loc: "雪亭鎮街道", name: "农夫", name_tw: "農夫", way: "jh 1;e;s;w", desc: "你看到一位面色黝黑的農夫。" },
          {
            jh: "雪亭鎮",
            loc: "書院",
            name: "魏无极",
            name_tw: "魏無極",
            way: "jh 1;e;s;w;s",
            desc: "魏無極是個博學多聞的教書先生，他年輕時曾經中過舉人，但是因為生性喜愛自由而不願做官，魏無極以教書為業，如果你付他一筆學費，就可以成為他的弟子學習讀書識字。",
          },
          { jh: "雪亭鎮", loc: "青石官道", name: "疯狗", name_tw: "瘋狗", way: "jh 1;e;s;w;w", desc: "一隻渾身臟兮兮的野狗，一雙眼睛正惡狠狠地瞪著你。" },
          { jh: "雪亭鎮", loc: "飲風客棧二樓", name: "星河大师", name_tw: "星河大師", way: "jh 1;雪亭鎮:飲風客棧^飲風客棧二樓", desc: "帥" },
          {
            jh: "雪亭鎮",
            loc: "飲風客棧二樓",
            name: "崔元基",
            way: "jh 1;雪亭鎮:飲風客棧^飲風客棧二樓",
            desc: "此人惡行累累，身背無數血案，其身上布滿刀傷，看上去極為兇神惡煞。",
          },
          {
            jh: "雪亭鎮",
            loc: "飲風客棧二樓",
            name: "神祕男子",
            name_tw: "神秘男子",
            way: "jh 1;雪亭鎮:飲風客棧^飲風客棧二樓",
            desc: "該男子頭頂笠帽，一身勁裝。看不清面容，極為神秘。",
          },
          { jh: "洛陽", loc: "北郊礦山", name: "剑遇北", name_tw: "劍遇北", way: "jh 2;n;n;n;n;n;n;n;n;n;n;w", desc: "一個身受重傷的布衣青年，手持一把染血的佩劍。" },
          {
            jh: "洛陽",
            loc: "礦場",
            name: "矿监",
            name_tw: "礦監",
            way: "jh 2;n;n;n;n;n;n;n;n;n;n;w;w",
            desc: "他身著紅色官袍，方臉闊嘴，下頜一捋長須，不時用那雙小眼睛瞅你。",
          },
          {
            jh: "洛陽",
            loc: "冶煉場",
            name: "邵空子",
            way: "jh 2;n;n;n;n;n;n;n;n;n;n;w;w;w",
            desc: "他穿一件棕布麻衣，身材壯碩，目光炯炯，兩手尤為粗大，負責冶煉數十年，是存世不多的鑄造大師之一。",
          },
          {
            jh: "洛陽",
            loc: "礦洞入口",
            name: "矿洞入口",
            name_tw: "礦洞入口",
            way: "jh 2;n;n;n;n;n;n;n;n;n;n;w;w;w;w",
            desc: "黝黑的洞口深不見底，裡面似乎傳來叮叮噹噹的聲音。根據產出礦品質的不同，礦坑可以分為普通、地品和天品三種。曾經有人在裡面挖出過礦髓，這可是能升級礦脈的好東西。不過地品及天品礦洞必須要有朝廷的許可才能進入。",
          },
          { jh: "洛陽", loc: "南郊小路", name: "农夫", name_tw: "農夫", way: "jh 2;n", desc: "一個戴著斗笠，正在辛勤勞作的農夫。" },
          { jh: "洛陽", loc: "南門", name: "守城士兵", way: "jh 2;n;n", desc: "一個守衛洛陽城的士兵" },
          { jh: "洛陽", loc: "南市", name: "客商", way: "jh 2;n;n;e", desc: "長途跋涉至此的客商。" },
          { jh: "洛陽", loc: "船塢", name: "蓑衣男子", way: "jh 2;n;n;e;s;洛陽:洛水渡口^船塢", desc: "身穿蓑衣坐在船頭的男子，頭上的斗笠壓得很低，你看不見他的臉。" },
          { jh: "洛陽", loc: "南大街", name: "乞丐", way: "jh 2;n;n;n", desc: "一個穿著破破爛爛的乞丐" },
          {
            jh: "洛陽",
            loc: "金刀門",
            name: "金刀门弟子",
            name_tw: "金刀門弟子",
            way: "jh 2;n;n;n;e",
            desc: "這人雖然年紀不大，卻十分傲慢。看來金刀門是上樑不正下樑歪。",
          },
          {
            jh: "洛陽",
            loc: "練武場",
            name: "王霸天",
            way: "jh 2;n;n;n;e;s",
            desc: "王霸天已有七十來歲，滿面紅光，顎下一叢長長的白須飄在胸前，精神矍鑠，左手嗆啷啷的玩著兩枚鵝蛋大小的金膽。",
          },
          { jh: "洛陽", loc: "洛川街", name: "地痞", way: "jh 2;n;n;n;n", desc: "洛陽城裡的地痞，人見人惡。" },
          { jh: "洛陽", loc: "集市", name: "小贩", name_tw: "小販", way: "jh 2;n;n;n;n;e", desc: "起早貪黑養家餬口的小販。" },
          { jh: "洛陽", loc: "豬肉攤", name: "郑屠夫", name_tw: "鄭屠夫", way: "jh 2;n;n;n;n;e;s", desc: "一個唾沫四濺，滿身油星的屠夫。看上去粗陋鄙俗，有些礙眼。" },
          {
            jh: "洛陽",
            loc: "草屋",
            name: "绿袍老者",
            name_tw: "綠袍老者",
            way: "jh 2;n;n;n;n;n;e;e;n;n;e;n",
            desc: "一身綠袍的老人，除了滿頭白發，強健的身姿和矍鑠的眼神都不像一位老者。",
          },
          { jh: "洛陽", loc: "林間石階", name: "山贼", name_tw: "山賊", way: "jh 2;n;n;n;n;n;e;e;n;n;n", desc: "隱藏在密林中打家劫舍的賊匪。" },
          { jh: "洛陽", loc: "登山小徑", name: "守墓人", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n", desc: "負責看守白冢的老人，看起來也是有些功夫的。" },
          { jh: "洛陽", loc: "松風亭", name: "淩云", name_tw: "淩雲", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;e", desc: "敗劍山莊少莊主，跟著父親雲遊四海。" },
          { jh: "洛陽", loc: "松風亭", name: "淩中天", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;e", desc: "好遊山玩水的敗劍山莊莊主。" },
          { jh: "洛陽", loc: "白公墓", name: "黑衣文士", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;n", desc: "看樣子很斯文，不像會欺負人哦～" },
          { jh: "洛陽", loc: "白公墓", name: "盗墓贼", name_tw: "盜墓賊", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;n", desc: "以盜竊古墓財寶為生的人。" },
          {
            jh: "洛陽",
            loc: "墓道",
            name: "黑衣女子",
            way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;n;get_silver",
            desc: "一身緊身黑衣將其身體勾勒的曲線畢露，黑紗遮住了面容，但看那剪水雙眸，已經足以勾魂。",
          },
          { jh: "洛陽", loc: "聽伊亭", name: "白面书生", name_tw: "白面書生", way: "jh 2;n;n;n;n;n;e;e;n;n;n;w", desc: "書生打扮的中年男子，手中的折扇隱露寒光。" },
          { jh: "洛陽", loc: "觀景台", name: "护卫", name_tw: "護衛", way: "jh 2;n;n;n;n;n;e;e;n;n;w", desc: "大戶人家的護衛，一身勁裝。" },
          { jh: "洛陽", loc: "富人莊院", name: "富家公子", way: "jh 2;n;n;n;n;n;e;n", desc: "此人一副風流倜儻的樣子，一看就是個不知天高地厚的公子哥。" },
          { jh: "洛陽", loc: "儲藏室", name: "洪帮主", name_tw: "洪幫主", name_new: "尚鋤姦", way: "jh 2;n;n;n;n;n;e;n;op1", desc: "他就是丐幫幫主。" },
          {
            jh: "洛陽",
            loc: "青石街",
            name: "鲁长老",
            name_tw: "魯長老",
            way: "jh 2;n;n;n;n;n;n;e",
            desc: "魯長老雖然武功算不得頂尖高手，可是在江湖上卻頗有聲望。因為他在丐幫中有仁有義，行事光明磊落，深得洪幫主的器重。",
          },
          { jh: "洛陽", loc: "北大街", name: "卖花姑娘", name_tw: "賣花姑娘", way: "jh 2;n;n;n;n;n;n;n", desc: "她總是甜甜的微笑，讓人不忍拒絕她籃子裡的鮮花。" },
          { jh: "洛陽", loc: "錢莊", name: "刘守财", name_tw: "劉守財", way: "jh 2;n;n;n;n;n;n;n;e", desc: "洛陽城的財主，開了一家錢莊，家財萬貫。" },
          { jh: "洛陽", loc: "北門", name: "守城武将", name_tw: "守城武將", way: "jh 2;n;n;n;n;n;n;n;n", desc: "一個守衛洛陽城的武將" },
          { jh: "洛陽", loc: "北郊小路", name: "疯狗", name_tw: "瘋狗", way: "jh 2;n;n;n;n;n;n;n;n;n", desc: "一隻四處亂竄的瘋狗，頂著一身髒兮兮的的毛發。" },
          { jh: "洛陽", loc: "綠竹林", name: "青竹蛇", way: "jh 2;n;n;n;n;n;n;n;n;n;e", desc: "一條全身翠綠的毒蛇，纏繞在竹枝上。" },
          { jh: "洛陽", loc: "綠竹雅舍", name: "布衣老翁", way: "jh 2;n;n;n;n;n;n;n;n;n;e;n", desc: "一身布衣，面容慈祥的老人。" },
          {
            jh: "洛陽",
            loc: "清響齋",
            name: "萧问天",
            name_tw: "蕭問天",
            way: "jh 2;n;n;n;n;n;n;n;n;n;e;n;n",
            desc: "雖然身居陋室，衣著樸素，眼神的銳利卻讓人不能忽視他的存在。",
          },
          {
            jh: "洛陽",
            loc: "密室",
            name: "藏剑楼首领",
            name_tw: "藏劍樓首領",
            way: "jh 2;n;n;n;n;n;n;n;n;n;e;n;n;n",
            desc: "一名看上去風度非凡之人，正背手閉目養神中好像等候什麼。",
          },
          { jh: "洛陽", loc: "甕城", name: "胡商", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛陽", loc: "明德門", name: "城门卫兵", name_tw: "城門衛兵", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛陽", loc: "天狼閣", name: "江湖大盗", name_tw: "江湖大盜", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;e", desc: "" },
          { jh: "洛陽", loc: "淩煙閣", name: "李贺", name_tw: "李賀", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "" },
          {
            jh: "洛陽",
            loc: "淩煙閣頂",
            name: "云梦璃",
            name_tw: "雲夢璃",
            way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;n;event_1_95312623",
            desc: "",
          },
          { jh: "洛陽", loc: "水榭", name: "游客", name_tw: "遊客", way: "jh 2;n;n;n;n;n;e;e;n", desc: "來白冢遊玩的人，背上的包袱裡鼓鼓囊囊，不知道裝了什麼？" },
          { jh: "洛陽", loc: "承天門大街", name: "游客", name_tw: "遊客", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "一個風程僕僕的俠客。" },
          { jh: "洛陽", loc: "六扇門", name: "捕快", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e", desc: "" },
          { jh: "洛陽", loc: "六扇門", name: "捕快统领", name_tw: "捕快統領", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e", desc: "" },
          { jh: "洛陽", loc: "富貴銀莊", name: "苗一郎", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;e", desc: "" },
          { jh: "洛陽", loc: "東市大街", name: "王府总管", name_tw: "王府總管", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n", desc: "" },
          { jh: "洛陽", loc: "東市大街", name: "王府小厮", name_tw: "王府小廝", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n", desc: "" },
          { jh: "洛陽", loc: "珍玉齋", name: "董老板", name_tw: "董老闆", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;e", desc: "" },
          { jh: "洛陽", loc: "東市大街", name: "龟兹乐师", name_tw: "龜茲樂師", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;n", desc: "" },
          { jh: "洛陽", loc: "羽霓坊", name: "上官小婉", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;n;e", desc: "" },
          { jh: "洛陽", loc: "錦官繡院", name: "龟兹舞女", name_tw: "龜茲舞女", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;n;w", desc: "" },
          { jh: "洛陽", loc: "錦官繡院", name: "卓小妹", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;n;w", desc: "" },
          { jh: "洛陽", loc: "天和當鋪", name: "护国军卫", name_tw: "護國軍衛", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;w", desc: "" },
          { jh: "洛陽", loc: "天和當鋪", name: "朱老板", name_tw: "朱老闆", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;n;w", desc: "" },
          { jh: "洛陽", loc: "山海古玩店", name: "仇老板", name_tw: "仇老闆", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;w", desc: "" },
          { jh: "洛陽", loc: "山海古玩店", name: "顾先生", name_tw: "顧先生", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;n;w", desc: "" },
          { jh: "洛陽", loc: "承天門廣場", name: "独孤须臾", name_tw: "獨孤須臾", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛陽", loc: "玄武門", name: "金甲卫士", name_tw: "金甲衛士", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛陽", loc: "大明宮內庭", name: "独孤皇后", name_tw: "獨孤皇后", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛陽", loc: "雲遠寺大門", name: "刀僧卫", name_tw: "刀僧衛", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w", desc: "" },
          { jh: "洛陽", loc: "誅心樓", name: "镇魂使", name_tw: "鎮魂使", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;s", desc: "" },
          { jh: "洛陽", loc: "招魂台", name: "招魂师", name_tw: "招魂師", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;w", desc: "" },
          { jh: "洛陽", loc: "明月客棧", name: "说书人", name_tw: "說書人", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;n;w", desc: "" },
          { jh: "洛陽", loc: "明月客棧", name: "客栈老板", name_tw: "客棧老闆", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;n;w", desc: "" },
          { jh: "洛陽", loc: "老高鐵鋪", name: "高铁匠", name_tw: "高鐵匠", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;e", desc: "" },
          { jh: "洛陽", loc: "老高鐵鋪", name: "哥舒翰", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;e", desc: "" },
          { jh: "洛陽", loc: "玉門客棧", name: "樊天纵", name_tw: "樊天縱", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;e", desc: "" },
          { jh: "洛陽", loc: "玉門客棧", name: "若羌巨商", name_tw: "若羌鉅商", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;e", desc: "" },
          { jh: "洛陽", loc: "西市大街", name: "乌孙马贩", name_tw: "烏孫馬販", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n", desc: "" },
          { jh: "洛陽", loc: "老孫肉鋪", name: "孙三娘", name_tw: "孫三娘", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;e", desc: "" },
          { jh: "洛陽", loc: "天策大道", name: "白衣少侠", name_tw: "白衣少俠", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n", desc: "" },
          { jh: "洛陽", loc: "天策府大門", name: "玄甲卫兵", name_tw: "玄甲衛兵", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n", desc: "" },
          { jh: "洛陽", loc: "照壁", name: "杜如晦", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;e", desc: "" },
          { jh: "洛陽", loc: "議事廳", name: "秦王", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛陽", loc: "軍機室", name: "翼国公", name_tw: "翼國公", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n;e", desc: "" },
          { jh: "洛陽", loc: "軍機室", name: "尉迟敬德", name_tw: "尉遲敬德", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n;e", desc: "" },
          { jh: "洛陽", loc: "參謀室", name: "程知节", name_tw: "程知節", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n;w", desc: "" },
          { jh: "洛陽", loc: "照壁", name: "房玄龄", name_tw: "房玄齡", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;w", desc: "" },
          { jh: "洛陽", loc: "鐘樓大街", name: "马夫", name_tw: "馬夫", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;n", desc: "" },
          { jh: "洛陽", loc: "鐘樓大街", name: "大宛使者", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;n", desc: "" },
          { jh: "洛陽", loc: "風花酒館", name: "卫青", name_tw: "衛青", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;w", desc: "" },
          { jh: "洛陽", loc: "風花酒館", name: "方秀珣", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;w", desc: "" },
          { jh: "洛陽", loc: "紅雲布莊", name: "杨玄素", name_tw: "楊玄素", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;w", desc: "" },
          { jh: "洛陽", loc: "遊記貨棧", name: "游四海", name_tw: "遊四海", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w", desc: "" },
          { jh: "洛陽", loc: "遊記貨棧", name: "糖人张", name_tw: "糖人張", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w", desc: "" },
          { jh: "洛陽", loc: "南城牆", name: "无影卫", name_tw: "無影衛", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w", desc: "" },
          { jh: "洛陽", loc: "安化門", name: "紫衣追影", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w", desc: "" },
          { jh: "洛陽", loc: "七星角樓", name: "城门禁卫", name_tw: "城門禁衛", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w", desc: "" },
          { jh: "洛陽", loc: "七星角樓", name: "禁卫统领", name_tw: "禁衛統領", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w", desc: "" },
          { jh: "洛陽", loc: "延平門", name: "蓝色城门卫兵", name_tw: "藍色城門衛兵", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n", desc: "" },
          { jh: "洛陽", loc: "金光門", name: "血手天魔", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n", desc: "" },
          { jh: "洛陽", loc: "開遠門", name: "先锋大将", name_tw: "先鋒大將", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛陽", loc: "狼居胥樓", name: "霍骠姚", name_tw: "霍驃姚", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "洛陽", loc: "沙石地", name: "看门人", name_tw: "看門人", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;nw;w;sw;s", desc: "" },
          { jh: "洛陽", loc: "石土場", name: "钦官", name_tw: "欽官", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;nw;w;sw;s;s", desc: "" },
          { jh: "洛陽", loc: "沙石地", name: "督察官", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;nw;w;sw;s;s;event_1_54329477;n", desc: "" },
          { jh: "洛陽", loc: "沙石地", name: "神秘黑衣人", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;nw;w;sw;s;s;event_1_54329477;n", desc: "" },
          {
            jh: "洛陽",
            loc: "城樓密室",
            name: "李元帅",
            name_tw: "李元帥",
            way: "jh 2;n;n;n;n;n;n;n;n;w;洛陽:城樓^城樓密室",
            desc: "吃了敗仗的元帥逃在此密室，卻不知是為了什麼。",
          },
          {
            jh: "洛陽",
            loc: "當鋪",
            name: "陈扒皮",
            name_tw: "陳扒皮",
            way: "jh 2;n;n;n;n;n;n;w",
            desc: "據洛陽城中最小氣的人，號稱陳扒皮，意思是見了誰都想賺個小便宜。",
          },
          { jh: "洛陽", loc: "馬廄", name: "马倌", name_tw: "馬倌", way: "jh 2;n;n;n;n;n;w;n;n;w", desc: "這是是客棧的馬倌，正在悉心照料客人的馬匹。" },
          {
            jh: "洛陽",
            loc: "牡丹園",
            name: "守园老人",
            name_tw: "守園老人",
            way: "jh 2;n;n;n;n;n;w;s",
            desc: "守護牡丹園的老人。因為洛陽城地痞不少，所以這守園老人可不輕鬆。",
          },
          { jh: "洛陽", loc: "牡丹亭", name: "赛牡丹", name_tw: "賽牡丹", way: "jh 2;n;n;n;n;n;w;s;luoyang111_op1", desc: "人稱賽牡丹，自然是個美人兒啦~" },
          { jh: "洛陽", loc: "賭坊大門", name: "黑衣打手", way: "jh 2;n;n;n;n;n;w;w", desc: "一身黑衣的打手，腳下功夫還是有點的。" },
          { jh: "洛陽", loc: "賭坊大廳", name: "小偷", way: "jh 2;n;n;n;n;n;w;w;n", desc: "混跡在賭坊裡的小偷。" },
          { jh: "洛陽", loc: "雅舍", name: "玉娘", way: "jh 2;n;n;n;n;n;w;w;n;n;n;e", desc: "肌膚如白玉般晶瑩的美人，不知道在這賭坊雅舍中等誰？" },
          { jh: "洛陽", loc: "暗道", name: "张逍林", name_tw: "張逍林", way: "jh 2;n;n;n;n;n;w;w;n;w;get_silver", desc: "來洛陽遊玩的遊客，被困在銀鉤賭坊一段時間了。" },
          { jh: "洛陽", loc: "銅駝巷", name: "何九叔", way: "jh 2;n;n;n;n;w", desc: "丐幫5袋弟子，衣著乾淨，看起來是淨衣派的。" },
          { jh: "洛陽", loc: "石街", name: "无赖", name_tw: "無賴", way: "jh 2;n;n;n;n;w;event_1_98995501;n", desc: "洛陽城無賴，專靠耍賴撒潑騙錢。" },
          { jh: "洛陽", loc: "酒肆", name: "甄大海", way: "jh 2;n;n;n;n;w;event_1_98995501;n;n;e", desc: "洛陽地痞無賴頭領，陰險狡黠，手段極其卑鄙。" },
          { jh: "洛陽", loc: "桃花別院", name: "红娘", name_tw: "紅娘", way: "jh 2;n;n;n;n;w;s", desc: "一個肥胖的中年婦女，以做媒為生。" },
          {
            jh: "洛陽",
            loc: "繡樓",
            name: "柳小花",
            way: "jh 2;n;n;n;n;w;s;w",
            desc: "洛陽武館館主的女兒，身材窈窕，面若桃花，十分漂亮。性格卻是驕縱任性，大小姐脾氣。",
          },
          { jh: "洛陽", loc: "洛神廟", name: "庙祝", name_tw: "廟祝", way: "jh 2;n;n;n;w", desc: "洛神廟的廟祝" },
          { jh: "洛陽", loc: "地道", name: "老乞丐", way: "jh 2;n;n;n;w;putuan", desc: "一個穿著破破爛爛的乞丐" },
          { jh: "華山村", loc: "地道", name: "米不为", name_tw: "米不為", way: "", desc: "一名青年男子，衣衫上血跡斑斑，奄奄一息的躺在地上。" },
          { jh: "華山村", loc: "華山村村口", name: "泼皮", name_tw: "潑皮", way: "jh 3", desc: "好吃懶做的無賴，整天無所事事，欺軟怕硬。" },
          { jh: "華山村", loc: "松林小徑", name: "松鼠", way: "jh 3;n", desc: "一隻在松林裡覓食的小松鼠。" },
          { jh: "華山村", loc: "神女塚", name: "野兔", way: "jh 3;n;e", desc: "正在吃草的野兔。" },
          { jh: "華山村", loc: "青石街", name: "泼皮头子", name_tw: "潑皮頭子", way: "jh 3;s", desc: "好吃懶做的無賴，整天無所事事，欺軟怕硬。" },
          { jh: "華山村", loc: "碎石路", name: "采花贼", name_tw: "採花賊", way: "jh 3;s;e", desc: "聲名狼藉的採花賊，一路潛逃來到了華山村。" },
          { jh: "華山村", loc: "打鐵鋪", name: "冯铁匠", name_tw: "馮鐵匠", way: "jh 3;s;e;n", desc: "這名鐵匠看上去年紀也不大，卻是一副飽經滄桑的樣子。" },
          { jh: "華山村", loc: "銀杏廣場", name: "村民", way: "jh 3;s;s", desc: "身穿布衣的村民" },
          { jh: "華山村", loc: "雜貨鋪", name: "方老板", name_tw: "方老闆", way: "jh 3;s;s;e", desc: "平日行蹤有些詭秘，看來雜貨鋪並不是他真正的營生。" },
          { jh: "華山村", loc: "後院", name: "跛脚汉子", name_tw: "跛腳漢子", way: "jh 3;s;s;e;s", desc: "衣著普通的中年男子，右腳有些跛。" },
          {
            jh: "華山村",
            loc: "車廂",
            name: "云含笑",
            name_tw: "雲含笑",
            way: "jh 3;s;s;e;s;huashancun24_op2",
            desc: "眸含秋水清波流盼，香嬌玉嫩，秀靨豔比花嬌，指如削蔥根，口如含朱丹，一顰一笑動人心魂。",
          },
          { jh: "華山村", loc: "石闆橋", name: "英白罗", name_tw: "英白羅", way: "jh 3;s;s;s", desc: "這是華山派弟子，奉師命下山尋找遊玩未歸的小師妹。" },
          { jh: "華山村", loc: "石闆橋", name: "黑狗", way: "jh 3;s;s;s", desc: "一隻黑色毛發的大狗。" },
          { jh: "華山村", loc: "田間小路", name: "刘三", name_tw: "劉三", way: "jh 3;s;s;s;s", desc: "這一代遠近聞名的惡棍，欺男霸女無惡不作" },
          {
            jh: "華山村",
            loc: "油菜花地",
            name: "血尸",
            name_tw: "血屍",
            way: "jh 3;s;s;s;s;huashancun15_op1",
            desc: "這是一具極為可怖的男子屍體，只見他週身腫脹，肌膚崩裂，眼角、鼻子、指甲縫裡都沁出了鮮血，在這片美麗的花海里，這具屍體的出現實在詭異至極。",
          },
          {
            jh: "華山村",
            loc: "油菜花地",
            name: "藏剑楼杀手",
            name_tw: "藏劍樓殺手",
            way: "jh 3;s;s;s;s;huashancun15_op1;event_1_46902878",
            desc: "極為冷酷無情的男人，手上不知道沾滿了多少無辜生命的鮮血。",
          },
          {
            jh: "華山村",
            loc: "練武場",
            name: "丐帮弟子",
            name_tw: "丐幫弟子",
            way: "jh 3;s;s;s;s;huashancun15_op1;event_1_46902878;;kill?藏劍樓殺手;@藏劍樓殺手的屍體;jh 3;s;s;s;s;s;nw;n;n;n;w;give huashancun_huashancun_fb9",
            desc: "一名髒兮兮的人，頗為怕事，顯得特別畏懼。",
          },
          { jh: "華山村", loc: "雜草小路", name: "毒蛇", way: "jh 3;s;s;s;s;s", desc: "一條色彩斑斕的毒蛇" },
          { jh: "華山村", loc: "小茅屋", name: "丐帮长老", name_tw: "丐幫長老", way: "jh 3;s;s;s;s;s;e", desc: "丐幫長老，衣衫襤褸，滿頭白發，看起來精神不錯。" },
          { jh: "華山村", loc: "山腳", name: "小狼", way: "jh 3;s;s;s;s;s;nw", desc: "出來覓食的小狼" },
          { jh: "華山村", loc: "蜿蜒山徑", name: "老狼", way: "jh 3;s;s;s;s;s;nw;n", desc: "在山上覓食的老狼" },
          { jh: "華山村", loc: "清風寨大門", name: "土匪", way: "jh 3;s;s;s;s;s;nw;n;n", desc: "清風寨土匪" },
          { jh: "華山村", loc: "桃花泉", name: "土匪头目", name_tw: "土匪頭目", way: "jh 3;s;s;s;s;s;nw;n;n;e", desc: "清風寨土匪頭目" },
          {
            jh: "華山村",
            loc: "花房",
            name: "玉牡丹",
            way: "jh 3;s;s;s;s;s;nw;n;n;e;get_silver",
            desc: "這是一名看不出年齡的男子，一身皮膚又白又細，宛如良質美玉，竟比閨門處子都要光滑細膩許多。若不是高大身材和臉頰上青色胡茬，他可能會讓大多女子汗顏。",
          },
          { jh: "華山村", loc: "議事廳", name: "刘龟仙", name_tw: "劉龜仙", way: "jh 3;s;s;s;s;s;nw;n;n;n;n", desc: "清風寨軍事，詭計多端。" },
          {
            jh: "華山村",
            loc: "後院",
            name: "萧独眼",
            name_tw: "蕭獨眼",
            way: "jh 3;s;s;s;s;s;nw;n;n;n;n;n",
            desc: "清風寨二當家，一次劫鏢時被刺傷一目，自此成了獨眼龍。",
          },
          { jh: "華山村", loc: "臥房", name: "刘寨主", name_tw: "劉寨主", way: "jh 3;s;s;s;s;s;nw;n;n;n;n;n;n", desc: "清風寨寨主，對手下極為嚴厲。" },
          { jh: "華山村", loc: "廂房", name: "受伤的曲右使", name_tw: "受傷的曲右使", way: "jh 3;s;s;s;s;w;get_silver", desc: "他已經深受重傷，半躺在地上。" },
          { jh: "華山村", loc: "小廳", name: "曲姑娘", way: "jh 3;s;s;s;s;w;n", desc: "這是一名身穿翠綠衣裳的少女，皮膚白皙，臉蛋清秀可愛。" },
          { jh: "華山村", loc: "祠堂大門", name: "朱老伯", way: "jh 3;s;s;w", desc: "一位德高望重的老人，須發已經全白。" },
          { jh: "華山村", loc: "廳堂", name: "剑大师", name_tw: "劍大師", way: "jh 3;s;s;w;n", desc: "宗之瀟灑美少年舉觴白眼望青天皎如玉樹臨風前" },
          { jh: "華山村", loc: "廳堂", name: "方寡妇", name_tw: "方寡婦", way: "jh 3;s;s;w;n", desc: "頗有幾分姿色的女子，是個寡婦。" },
          { jh: "華山村", loc: "杏林", name: "小男孩", way: "jh 3;w", desc: "扎著雙髻的小男孩，正在杏林裡跟小夥伴們捉迷藏。" },
          { jh: "華山村", loc: "土地廟門口", name: "村中地痞", way: "jh 3;w;event_1_59520311", desc: "村內地痞，人見人惡。" },
          { jh: "華山村", loc: "廟堂", name: "抠脚大汉", name_tw: "摳腳大漢", way: "jh 3;w;event_1_59520311;n", desc: "坐在土地面前摳腳的漢子" },
          { jh: "華山村", loc: "地道入口", name: "黑狗", way: "jh 3;w;event_1_59520311;n;n", desc: "兇惡的黑狗，張開的大嘴露出鋒利的獠牙。" },
          { jh: "華山村", loc: "樓梯", name: "青衣守卫", name_tw: "青衣守衛", way: "jh 3;w;event_1_59520311;n;n;n", desc: "身穿青衣的守衛，武功招式看起來有些眼熟。" },
          { jh: "華山村", loc: "大廳", name: "葛不光", way: "jh 3;w;event_1_59520311;n;n;n;n;n", desc: "四十歲左右的中年男子，頗為好色。" },
          { jh: "華山村", loc: "囚室", name: "米义为", name_tw: "米義為", way: "jh 3;w;event_1_59520311;n;n;w;get_silver", desc: "" },
          { jh: "華山村", loc: "茶棚", name: "王老二", way: "jh 3;w;n", desc: "看起來跟普通村民沒什麼不同，但一雙眼睛卻透著狡黠。" },
          { jh: "華山", loc: "書房", name: "陶钧", name_tw: "陶鈞", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e;n;n", desc: "陶鈞是嶽不群的第七位弟子" },
          { jh: "華山", loc: "老君溝", name: "赵辅徳", name_tw: "趙輔徳", way: "jh 4;n;n;n;n;n;n;e;n", desc: "負責打理群仙觀的老人" },
          { jh: "華山", loc: "狹長通道", name: "丛云弃", name_tw: "叢雲棄", way: "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s", desc: "華山派傳人，封劍羽的師弟。" },
          { jh: "華山", loc: "華山山腳", name: "孙驼子", name_tw: "孫駝子", way: "jh 4", desc: "一面容猥瑣可憎，讓人不忍直視，脊背高高隆起的駝子。" },
          { jh: "華山", loc: "莎蘿坪", name: "吕子弦", name_tw: "呂子弦", way: "jh 4;n", desc: "青衣長袍的書生，前來華山遊玩。" },
          { jh: "華山", loc: "雲門", name: "女弟子", way: "jh 4;n;n", desc: "她是華山派女弟子，不施脂粉，衣著素雅。" },
          { jh: "華山", loc: "青柯坪", name: "游客", name_tw: "遊客", way: "jh 4;n;n;n", desc: "這是一名來華山遊玩的中年男子，揹著包裹。" },
          { jh: "華山", loc: "回心石", name: "公平子", way: "jh 4;n;n;n;e", desc: "這是一位仙風道骨的中年道人，早年雲遊四方，性好任俠，公正無私。" },
          { jh: "華山", loc: "蜿蜒山路", name: "白二", way: "jh 4;n;n;n;n;n;n", desc: "山賊頭目，看起來很強壯。" },
          { jh: "華山", loc: "蜿蜒山路", name: "山贼", name_tw: "山賊", way: "jh 4;n;n;n;n;n;n", desc: "攔路搶劫的山賊" },
          { jh: "華山", loc: "群仙觀", name: "李铁嘴", name_tw: "李鐵嘴", way: "jh 4;n;n;n;n;n;n;e", desc: "李鐵嘴是個買卜算卦的江湖術士，兼代客寫書信、條幅。" },
          { jh: "華山", loc: "老君溝", name: "赵辅德", name_tw: "趙輔德", way: "jh 4;n;n;n;n;n;n;e;n", desc: "" },
          { jh: "華山", loc: "上天梯", name: "猿猴", way: "jh 4;n;n;n;n;n;n;n", desc: "華山上的猿猴，時常騷擾過路人" },
          { jh: "華山", loc: "崎嶇山路", name: "剑宗弟子", name_tw: "劍宗弟子", way: "jh 4;n;n;n;n;n;n;n;event_1_91604710", desc: "華山劍宗弟子" },
          { jh: "華山", loc: "狹長通道", name: "从云弃", name_tw: "從雲棄", way: "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s", desc: "" },
          { jh: "華山", loc: "潭畔草地", name: "尘无剑", name_tw: "塵無劍", way: "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s;s", desc: "他是華山控劍宗派的第一高手。" },
          { jh: "華山", loc: "懸崖石洞", name: "封剑羽", name_tw: "封劍羽", way: "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s;s;s;e", desc: "他是華山控劍宗派的第一高手。" },
          { jh: "華山", loc: "松林石徑", name: "大松鼠", way: "jh 4;n;n;n;n;n;n;n;n", desc: "一隻在松林裡覓食的小松鼠。" },
          { jh: "華山", loc: "朝陽峰山道", name: "英黑罗", name_tw: "英黑羅", way: "jh 4;n;n;n;n;n;n;n;n;n", desc: "英白羅是嶽不群的第八位弟子" },
          { jh: "華山", loc: "長空棧道", name: "魔教喽喽", name_tw: "魔教嘍嘍", way: "jh 4;n;n;n;n;n;n;n;n;n;e", desc: "日月神教小嘍嘍嘍" },
          { jh: "華山", loc: "臨淵石台", name: "史大哥", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n", desc: "" },
          { jh: "華山", loc: "臨淵石台", name: "卢大哥", name_tw: "盧大哥", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n", desc: "日月神教教眾" },
          { jh: "華山", loc: "草叢小路", name: "史老三", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n", desc: "日月神教教眾" },
          { jh: "華山", loc: "竹林", name: "闵老二", name_tw: "閔老二", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n", desc: "日月神教教眾" },
          {
            jh: "華山",
            loc: "密洞",
            name: "藏剑楼刺客",
            name_tw: "藏劍樓刺客",
            way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;e;s;event_1_11292200",
            desc: "一名手持利刃身穿夜行衣的男子，眼神極為狠厲無情。",
          },
          { jh: "華山", loc: "空地", name: "戚老四", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n", desc: "日月神教教眾" },
          { jh: "華山", loc: "小木屋", name: "葛长老", name_tw: "葛長老", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n;e", desc: "日月神教教眾" },
          { jh: "華山", loc: "華山之巔", name: "小林子", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n;n", desc: "氣宗傳人小林子，實力已是非同凡響。" },
          {
            jh: "華山",
            loc: "前院",
            name: "高算盘",
            name_tw: "高算盤",
            name_new: "陳飛魚",
            way: "jh 4;n;n;n;n;n;n;n;n;n;n",
            desc: "此人整天拿著算盤，身材高大，長得很胖，但別看他其貌不揚，他在同門中排行第五，是華山派年輕一代中的好手。",
          },
          {
            jh: "華山",
            loc: "正氣堂",
            name: "岳掌门",
            name_tw: "嶽掌門",
            name_new: "許秋雨",
            way: "jh 4;n;n;n;n;n;n;n;n;n;n;n",
            desc: "華山掌門，他今年四十多歲，素以溫文爾雅著稱。",
          },
          { jh: "華山", loc: "後院", name: "舒奇", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n", desc: "華山派小弟子" },
          { jh: "華山", loc: "花園", name: "梁师兄", name_tw: "梁師兄", name_new: "梁迎陽", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e", desc: "他就是華山排行第三的弟子。" },
          { jh: "華山", loc: "長廊", name: "林师弟", name_tw: "林師弟", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e;s", desc: "林師弟是華山眾最小的一個弟子。" },
          { jh: "華山", loc: "臥房", name: "小尼姑", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e;s;s", desc: "一個嬌俏迷人的小尼姑。" },
          { jh: "華山", loc: "凜然軒", name: "劳师兄", name_tw: "勞師兄", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "" },
          {
            jh: "華山",
            loc: "寢室",
            name: "宁女侠",
            name_tw: "寧女俠",
            way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;n;get_silver",
            desc: "華山派掌門的夫人，眉宇間還少不了年輕時的英氣。",
          },
          { jh: "華山", loc: "廚房", name: "小猴", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;w", desc: "這是一隻調皮的小猴子，雖是畜牲，卻喜歡模仿人樣。" },
          { jh: "華山", loc: "練武場", name: "施剑客", name_tw: "施劍客", way: "jh 4;n;n;n;n;n;n;n;n;n;n;w", desc: "同門中排行第四，是華山派年輕一代中的好手。" },
          { jh: "華山", loc: "庫房入口", name: "华山弟子", name_tw: "華山弟子", way: "jh 4;n;n;n;n;n;n;n;n;n;n;w;event_1_30014247", desc: "華山派門下的第子" },
          { jh: "華山", loc: "地道入口", name: "蒙面剑客", name_tw: "蒙面劍客", way: "jh 4;n;n;n;n;n;n;n;n;n;n;w;event_1_30014247;s;s;s;s", desc: "手握長劍的蒙面人" },
          {
            jh: "華山",
            loc: "密室",
            name: "黑衣人",
            way: "jh 4;n;n;n;n;n;n;n;n;n;n;w;event_1_30014247;s;s;s;s;s;e",
            desc: "戴著神秘的黑衣人，壓低的帽簷遮住的他的面容。",
          },
          {
            jh: "華山",
            loc: "玉女祠",
            name: "岳师妹",
            name_tw: "嶽師妹",
            way: "jh 4;n;n;n;n;n;n;n;n;w;s",
            desc: "華山派掌門的愛女。她看起來十多歲，容貌秀麗，雖不是絕代美人，也別有一番可人之處。",
          },
          {
            jh: "華山",
            loc: "思過崖",
            name: "六猴儿",
            name_tw: "六猴兒",
            way: "jh 4;n;n;n;n;n;n;n;n;w;w",
            desc: "六猴兒身材很瘦，又長的尖嘴猴腮的，但別看他其貌不揚，他在同門中排行第六，是華山派年輕一代中的好手。",
          },
          { jh: "華山", loc: "山洞", name: "令狐大师哥", name_tw: "令狐大師哥", way: "jh 4;n;n;n;n;n;n;n;n;w;w;n", desc: "他是華山派的大師兄，英氣逼人。" },
          {
            jh: "華山",
            loc: "石壁",
            name: "风老前辈",
            name_tw: "風老前輩",
            name_new: "獨孤傳人",
            way: "jh 4;n;n;n;n;n;n;n;n;w;w;n;get_xiangnang2",
            desc: "這便是當年名震江湖的華山名宿。他身著青袍，神氣抑鬱臉如金紙。身材瘦長，眉宇間一直籠罩著一股淡淡的憂傷神色。",
          },
          { jh: "華山", loc: "觀瀑台", name: "豪客", way: "jh 4;n;n;w", desc: "一名滿臉彪悍之色的江湖豪客" },
          { jh: "揚州", loc: "飛雪堂", name: "书生", name_tw: "書生", way: "jh 5;n;n;n;n;n;e;n;e;n;w;n;n", desc: "一個搖頭晃腦正在吟詩的書生。" },
          {
            jh: "揚州",
            loc: "揚州港",
            name: "船运东主",
            name_tw: "船運東主",
            way: "jh 5;n;n;n;n;n;n;n;n;n;n;ne",
            desc: "此人一身黝黑的皮膚，幾道深深的歲月的溝壑在他臉上烙下了印記。深邃凹進的眼眶中顯露出幹練的眼神。顯露出不凡的船上閱歷。",
          },
          {
            jh: "揚州",
            loc: "醉仙樓大廳",
            name: "少林恶僧",
            name_tw: "少林惡僧",
            way: "jh 5;n;n;n;n;n;n;e",
            desc: "因嗜酒如命，故從少林叛出，順便盜取些許經書以便拿來換酒。",
          },
          {
            jh: "揚州",
            loc: "太平橋",
            name: "白胡子老头",
            name_tw: "白鬍子老頭",
            way: "jh 5;n;w",
            desc: "一位精神矍鑠的老人，額下有寸許長的白須。在揚州支了個糖畫小攤維持生計，身邊的銅鍋裡面熬著糖液，咕嘟咕嘟冒著大泡，香氣四溢。",
          },
          {
            jh: "揚州",
            loc: "太平橋",
            name: "姜子牙",
            way: "jh 5;n;w",
            desc: "身材高大，面容清秀，額頭寬闊，目光犀利。他常穿著一身簡樸的道袍，手持一把看似普通但實則包含玄機的長劍。頭發自然散落在肩上，整體氣質給人一種淡然、高遠但又不失威嚴的感覺。",
          },
          { jh: "揚州", loc: "小東門橋", name: "斗笠老人", way: "jh 5;n;e", desc: "頭戴斗笠，身形佝僂的老者，但似乎武功高強。" },
          { jh: "揚州", loc: "安定門", name: "官兵", way: "jh 5", desc: "守城的官兵，相貌可長得不好瞧。" },
          { jh: "揚州", loc: "十裡長街3", name: "大黑马", name_tw: "大黑馬", way: "jh 5;n;n", desc: "一匹受驚的大黑馬，一路狂奔到了鬧市街頭。" },
          {
            jh: "揚州",
            loc: "小寶齋",
            name: "双儿",
            name_tw: "雙兒",
            way: "jh 5;n;n;e",
            desc: "柔善良，善解人意，乖巧聰慧，體貼賢惠，清秀可人，靦腆羞澀，似乎男人喜歡的品質都集中在她身上了。",
          },
          { jh: "揚州", loc: "十裡長街2", name: "黑狗子", way: "jh 5;n;n;n", desc: "揚州街頭人見人惡的地痞，嘴角一顆黑色痦子，看起來極為可憎。" },
          { jh: "揚州", loc: "武館大門", name: "武馆护卫", name_tw: "武館護衛", way: "jh 5;n;n;n;e", desc: "一名武館護衛，專門對付那些想混進來鬧事的人。" },
          { jh: "揚州", loc: "武館大院", name: "武馆弟子", name_tw: "武館弟子", way: "jh 5;n;n;n;e;n", desc: "在武館拜師學藝的弟子，看來還是會些基本功。" },
          { jh: "揚州", loc: "武館大廳", name: "方不为", name_tw: "方不為", way: "jh 5;n;n;n;e;n;n", desc: "武館管家，館中大小事務都需要向他稟報。" },
          { jh: "揚州", loc: "長廊", name: "范先生", name_tw: "範先生", way: "jh 5;n;n;n;e;n;n;n", desc: "武館賬房先生，為人極為謹慎，賬房鑰匙通常帶在身上。" },
          { jh: "揚州", loc: "書房", name: "古三通", way: "jh 5;n;n;n;e;n;n;n;e", desc: "一名看起來和藹的老人，手裡拿著一個旱菸袋，據說跟館主頗有淵源。" },
          {
            jh: "揚州",
            loc: "臥室",
            name: "陈有德",
            name_tw: "陳有德",
            way: "jh 5;n;n;n;e;n;n;n;n",
            desc: "這就是武館館主，紫金臉龐，面帶威嚴，威武有力，站在那裡就象是一座鐵塔。",
          },
          { jh: "揚州", loc: "休息室", name: "神秘客", way: "jh 5;n;n;n;e;n;n;w;n;get_silver", desc: "一名四十歲左右的中年男子，臉上一道刀疤給他平添了些許滄桑。" },
          { jh: "揚州", loc: "練武場", name: "王教头", name_tw: "王教頭", way: "jh 5;n;n;n;e;n;w", desc: "一名武館內的教頭，專門負責教新手武功。" },
          { jh: "揚州", loc: "十裡長街1", name: "游客", name_tw: "遊客", way: "jh 5;n;n;n;n", desc: "來揚州遊玩的遊客，背上的包裹看起來有些重。" },
          { jh: "揚州", loc: "中央廣場", name: "空空儿", name_tw: "空空兒", way: "jh 5;n;n;n;n;n", desc: "一個滿臉風霜之色的老乞丐。" },
          { jh: "揚州", loc: "中央廣場", name: "艺人", name_tw: "藝人", way: "jh 5;n;n;n;n;n", desc: "一名四海為家的賣藝人，滿臉滄桑。" },
          { jh: "揚州", loc: "至止堂", name: "朱先生", way: "jh 5;n;n;n;n;n;e;n;n;n", desc: "這就是當今大儒朱先生。" },
          { jh: "揚州", loc: "庭院", name: "管家", way: "jh 5;n;n;n;n;n;e;n;n", desc: "一名瘦小的中年男子走了出來，頦下留著短須，外貌甚是精明，顯然就是管家了。" },
          { jh: "揚州", loc: "十裡長街4", name: "马夫人", name_tw: "馬夫人", way: "jh 5;n;n;n;n;n;n", desc: "一名體格魁梧的婦人，看起來極為彪悍。" },
          { jh: "揚州", loc: "十裡長街4", name: "润玉", name_tw: "潤玉", way: "jh 5;n;n;n;n;n;n", desc: "買花少女，手中的花籃裡裝著時令鮮花。" },
          { jh: "揚州", loc: "十裡長街4", name: "流氓", way: "jh 5;n;n;n;n;n;n", desc: "揚州城裡的流氓，經常四處遊蕩，調戲婦女。" },
          { jh: "揚州", loc: "醉仙樓大廳", name: "醉仙楼伙计", name_tw: "醉仙樓夥計", way: "jh 5;n;n;n;n;n;n;e", desc: "這是醉仙樓夥計，看起來有些功夫。" },
          { jh: "揚州", loc: "樓梯", name: "丰不为", name_tw: "豐不為", way: "jh 5;n;n;n;n;n;n;e;n", desc: "一個常在酒樓混吃混喝的地痞，不知酒店老闆為何不將他逐出。" },
          { jh: "揚州", loc: "二樓大廳", name: "张总管", name_tw: "張總管", way: "jh 5;n;n;n;n;n;n;e;n;n", desc: "一名中年男子，目露兇光。" },
          { jh: "揚州", loc: "芍藥宴廳", name: "胡神医", name_tw: "胡神醫", way: "jh 5;n;n;n;n;n;n;e;n;n;e", desc: "這就是江湖中有名的胡神醫，看起來很普通。" },
          { jh: "揚州", loc: "牡丹宴廳", name: "胖商人", way: "jh 5;n;n;n;n;n;n;e;n;n;n", desc: "一名衣著華麗，體態臃腫，手腳看起來極短的中年男子。" },
          {
            jh: "揚州",
            loc: "觀景台",
            name: "冼老板",
            name_tw: "冼老闆",
            way: "jh 5;n;n;n;n;n;n;e;n;n;n;n",
            desc: "醉仙樓老闆，能將這家祖傳老店買下來，其來歷應該沒那麼簡單。",
          },
          { jh: "揚州", loc: "芙蓉宴廳", name: "计无施", name_tw: "計無施", way: "jh 5;n;n;n;n;n;n;e;n;n;w", desc: "一名劍眉星目的白衣劍客。" },
          { jh: "揚州", loc: "十裡長街5", name: "马员外", name_tw: "馬員外", way: "jh 5;n;n;n;n;n;n;n", desc: "馬員外是揚州有名的善人，看起來有點鬱鬱不樂。" },
          { jh: "揚州", loc: "富春茶社", name: "茶社伙计", name_tw: "茶社夥計", way: "jh 5;n;n;n;n;n;n;n;e", desc: "提著茶壺的夥計，目露精光，看起來不簡單。" },
          { jh: "揚州", loc: "富春茶社", name: "云九天", name_tw: "雲九天", way: "jh 5;n;n;n;n;n;n;n;e", desc: "他是大旗門的掌刑長老，最是嚴厲不過。" },
          {
            jh: "揚州",
            loc: "雅舍",
            name: "柳文君",
            way: "jh 5;n;n;n;n;n;n;n;e;get_silver",
            desc: "茶社老闆娘，揚州聞名的才女，姿色嬌美，精通音律，善彈琴。許多文人墨客慕名前來，茶社總是客滿為患。",
          },
          { jh: "揚州", loc: "十裡長街6", name: "毒蛇", way: "jh 5;n;n;n;n;n;n;n;n", desc: "一條毒蛇草叢竄出，正昂首吐信虎視眈眈地盯著你。" },
          { jh: "揚州", loc: "東關街", name: "小混混", way: "jh 5;n;n;n;n;n;n;n;n;n;e", desc: "揚州城裡的小混混，整天無所事事，四處遊蕩。" },
          { jh: "揚州", loc: "鎮淮門 ", name: "北城门士兵", name_tw: "北城門士兵", way: "jh 5;n;n;n;n;n;n;n;n;n;n", desc: "看守城門的士兵" },
          { jh: "揚州", loc: "禪智寺山門", name: "扫地僧", name_tw: "掃地僧", way: "jh 5;n;n;n;n;n;n;n;n;n;w;w;n", desc: "一名看起來很普通的僧人" },
          { jh: "揚州", loc: "昆丘台", name: "张三", name_tw: "張三", way: "jh 5;n;n;n;n;n;n;n;n;n;w;w;n;e", desc: "看起來很邋遢的道士，似乎有些功夫。" },
          { jh: "揚州", loc: "呂祖照面池", name: "火工僧", way: "jh 5;n;n;n;n;n;n;n;n;n;w;w;n;n;n;e", desc: "禪智寺中專做雜事的火工僧，身體十分地強壯" },
          { jh: "揚州", loc: "竹西亭", name: "柳碧荷", way: "jh 5;n;n;n;n;n;n;n;n;n;w;w;n;w", desc: "來禪智寺上香的女子，頗有幾分姿色。" },
          { jh: "揚州", loc: "虹橋", name: "恶丐", name_tw: "惡丐", way: "jh 5;n;n;n;n;n;n;n;n;w", desc: "看守城門的士兵" },
          { jh: "揚州", loc: "草河北街", name: "顽童", name_tw: "頑童", way: "jh 5;n;n;n;n;n;n;n;n;w;w", desc: "一個頑皮的小童。" },
          { jh: "揚州", loc: "魁星閣", name: "书生", name_tw: "書生", way: "jh 5;n;n;n;n;n;n;n;n;w;w;n", desc: "一個搖頭晃腦正在吟詩的書生。" },
          {
            jh: "揚州",
            loc: "閣樓",
            name: "李丽君",
            name_tw: "李麗君",
            way: "jh 5;n;n;n;n;n;n;n;n;w;w;n;get_silver",
            desc: "女扮男裝的女子，容顏清麗，孤身一身住在魁星閣的閣樓上。",
          },
          { jh: "揚州", loc: "淺月樓", name: "青衣门卫", name_tw: "青衣門衛", way: "jh 5;n;n;n;n;n;n;n;n;w;w;w", desc: "淺月樓門口的侍衛。" },
          {
            jh: "揚州",
            loc: "淺月樓大廳",
            name: "玉娇红",
            name_tw: "玉嬌紅",
            way: "jh 5;n;n;n;n;n;n;n;n;w;w;w;s",
            desc: "淺月樓的老闆娘，看似年不過三十，也是一個頗有姿色的女子。她抬起眼來，黛眉輕掃，紅唇輕啟，嘴角勾起的那抹弧度彷彿還帶著絲絲嘲諷。當她眼波一轉，流露出的風情似可讓人忘記一切。紅色的外袍包裹著潔白細膩的肌膚，她每走一步，都要露出細白水嫩的小腿。腳上的銀鈴也隨著步伐輕輕發出零零碎碎的聲音。",
          },
          { jh: "揚州", loc: "二樓走道", name: "青楼小厮", name_tw: "青樓小廝", way: "jh 5;n;n;n;n;n;n;n;n;w;w;w;s;e", desc: "這是一個青樓的小侍從，不過十五六歲。" },
          {
            jh: "揚州",
            loc: "弦羽閣",
            name: "苏小婉",
            name_tw: "蘇小婉",
            way: "jh 5;n;n;n;n;n;n;n;n;w;w;w;s;e;e;s;s;e;e;s;s;s",
            desc: "名滿天下的第一琴姬，蘇小婉是那種文人夢中的紅顏知己。這樣美貌才智具備的女子，怕是世間幾百年才能出現一位。曾有人替她惋惜，說如若她是一大家閨秀，或許也能尋得一志趣相投之人，也會有“賭書消得潑茶香”的美談。即使她只是一貧家女子，不讀書亦不學藝，縱使是貌勝西子，或許仍可安穩一生。然而命運時常戲弄人，偏偏讓那如花美眷落入淤泥，誤了那似水流年。本想為一人盛開，卻被眾人窺去了芳顏。可她只是微微一笑，說道：『尋一平凡男子，日出而作日落而息，相夫教子，如湮沒於歷史煙塵中的所有女子一般。那樣的生活，不是我做不到，只是不願意。沒有燃燒過的，只是一堆黑色的粉末，哪裡能叫做煙火？』",
          },
          {
            jh: "揚州",
            loc: "淺月樓偏廳",
            name: "赵明诚",
            name_tw: "趙明誠",
            way: "jh 5;n;n;n;n;n;n;n;n;w;w;w;s;w",
            desc: "：當朝僕射，也是一代名士，致力於金石之學，幼而好之，終生不渝。",
          },
          { jh: "揚州", loc: "廣陵當鋪", name: "唐老板", name_tw: "唐老闆", way: "jh 5;n;n;n;n;n;n;n;w", desc: "廣陵當鋪老闆，肩寬體壯，看起來頗為威嚴。" },
          { jh: "揚州", loc: "武廟", name: "刘步飞", name_tw: "劉步飛", way: "jh 5;n;n;n;n;n;n;w", desc: "龍門鏢局的鏢師，正在武廟裡祭拜。" },
          { jh: "揚州", loc: "通泗橋", name: "赤练仙子", name_tw: "赤練仙子", way: "jh 5;n;n;n;n;n;w", desc: "她生得極為美貌，但冰冷的目光讓人不寒而慄。" },
          { jh: "揚州", loc: "衙門大門", name: "衙役", way: "jh 5;n;n;n;n;n;w;w;n", desc: "揚州官衙衙役，看起來一臉疲態。" },
          { jh: "揚州", loc: "正堂", name: "程大人", way: "jh 5;n;n;n;n;n;w;w;n;n;n", desc: "揚州知府，臉色陰沉，微有怒色，" },
          { jh: "揚州", loc: "內室", name: "楚雄霸", way: "jh 5;n;n;n;n;n;w;w;n;n;n;get_silver", desc: "江湖有名的江洋大盜，五短身材，貌不驚人。" },
          { jh: "揚州", loc: "天井", name: "公孙岚", name_tw: "公孫嵐", way: "jh 5;n;n;n;n;n;w;w;n;n;w", desc: "揚州官衙有名的神捕，據說曾經抓獲不少江湖大盜。" },
          { jh: "揚州", loc: "玉器店", name: "白老板", name_tw: "白老闆", way: "jh 5;n;n;n;n;n;w;w;s;s", desc: "玉器店老闆，對珍寶古玩頗為熟稔。" },
          { jh: "揚州", loc: "彥明錢莊", name: "小飞贼", name_tw: "小飛賊", way: "jh 5;n;n;n;n;w", desc: "一個年級尚幼的飛賊。" },
          { jh: "揚州", loc: "彥明錢莊", name: "账房先生", name_tw: "賬房先生", way: "jh 5;n;n;n;n;w", desc: "滿臉精明的中年男子，手裡的算盤撥的飛快。" },
          { jh: "揚州", loc: "銀庫", name: "飞贼", name_tw: "飛賊", way: "jh 5;n;n;n;n;w;yangzhou16_op1", desc: "一身黑色勁裝，黑巾蒙面，眼露兇光。" },
          { jh: "揚州", loc: "黃記雜貨", name: "黄掌柜", name_tw: "黃掌櫃", way: "jh 5;n;n;n;w", desc: "雜貨鋪老闆，看似慵懶，實則精明過人。" },
          { jh: "揚州", loc: "鐵匠鋪", name: "铁匠", name_tw: "鐵匠", way: "jh 5;n;n;w", desc: "看起來很強壯的中年男子" },
          { jh: "揚州", loc: "花店", name: "花店伙计", name_tw: "花店夥計", way: "jh 5;n;w;w;n", desc: "花店的夥計，正忙碌地給花淋水。" },
          { jh: "丐幫", loc: "樹洞內部", name: "裘万家", name_tw: "裘萬家", way: "jh 6", desc: "這是位衣著邋塌，蓬頭垢面的丐幫二袋弟子。" },
          { jh: "丐幫", loc: "樹洞內部", name: "左全", way: "jh 6", desc: "這是位豪爽大方的丐幫七袋弟子，看來是個北地豪傑。" },
          {
            jh: "丐幫",
            loc: "樹洞下",
            name: "梁长老",
            name_tw: "梁長老",
            way: "jh 6;event_1_98623439",
            desc: "梁長老是丐幫出道最久，武功最高的長老，在武林中享名已久。丐幫武功向來較強，近來梁長老一力整頓，更是蒸蒸日上。",
          },
          { jh: "丐幫", loc: "暗道", name: "藏剑楼统领", name_tw: "藏劍樓統領", way: "jh 6;event_1_98623439;ne;n", desc: "此人似乎是這群人的頭目，正在叮囑手下辦事。" },
          { jh: "丐幫", loc: "屋角邊", name: "何不净", name_tw: "何不淨", way: "jh 6;event_1_98623439;ne;n;ne;ne", desc: "這是位衣著邋塌，蓬頭垢面的丐幫七袋弟子。" },
          {
            jh: "丐幫",
            loc: "谷場槐樹邊",
            name: "马俱为",
            name_tw: "馬俱為",
            way: "jh 6;event_1_98623439;ne;n;ne;ne;ne",
            desc: "這是位武藝精強，卻沉默寡言的丐幫八袋弟子。",
          },
          {
            jh: "丐幫",
            loc: "沙丘小洞",
            name: "余洪兴",
            name_tw: "餘洪興",
            way: "jh 6;event_1_98623439;ne;n;ne;ne;ne;event_1_97428251",
            desc: "這是位笑眯眯的丐幫八袋弟子，生性多智，外號小吳用。",
          },
          { jh: "丐幫", loc: "暗道", name: "莫不收", way: "jh 6;event_1_98623439;ne;ne", desc: "這是位衣著邋塌，蓬頭垢面的丐幫三袋弟子。" },
          {
            jh: "丐幫",
            loc: "秘密通道",
            name: "藏剑楼探子",
            name_tw: "藏劍樓探子",
            way: "jh 6;event_1_98623439;ne;ne;ne;event_1_16841370",
            desc: "看上去身手極為敏捷，似乎在此處調查著什麼。",
          },
          {
            jh: "丐幫",
            loc: "儲藏室",
            name: "何一河",
            name_new: "何宏生",
            way: "jh 6;event_1_98623439;s",
            desc: "他是丐幫新近加入的弟子，可也一步步升到了五袋。他長的極其醜陋，臉上坑坑窪窪。",
          },
          {
            jh: "丐幫",
            loc: "密室",
            name: "解九風",
            way: "jh 6;event_1_98623439;s;w",
            desc: "如果說洪七公是丐幫的食神，那麼九風就是丐幫的酒聖，論酒量，無人能比，似乎從來沒有人看到他喝醉過，也被稱為“解酒瘋”。",
          },
          {
            jh: "喬陰縣",
            loc: "樹王墳",
            name: "朦胧鬼影",
            name_tw: "朦朧鬼影",
            way: "jh 3;s;s;s;;kill?黑狗;@黑狗的屍體;jh 7;event_1_57435070;s;s;s;s;event_1_65599392",
            desc: "一個高大的身影，看起來像是個人，不過。。。。",
          },
          {
            jh: "喬陰縣",
            loc: "樹王墳",
            name: "县城官兵",
            name_tw: "縣城官兵",
            way: "",
            desc: "這是個正在執行公務的縣城官兵，雖然和許多武林人物比起來，官兵們的武功實在稀鬆平常，但是他們是有組織、有紀律的戰士，誰也不輕易地招惹他們。",
          },
          { jh: "喬陰縣", loc: "街道", name: "琵琶鬼", way: "jh 3;s;s;s;;kill?黑狗;@黑狗的屍體;jh 7;event_1_57435070;s;s;s;s;s;s;s;sw", desc: "一個風塵僕僕的俠客。。" },
          { jh: "喬陰縣", loc: "喬陰縣城北門", name: "孤魂野鬼", way: "jh 3;s;s;s;;kill?黑狗;@黑狗的屍體;jh 7;event_1_57435070", desc: "一個飄忽不定的朦朧身影。" },
          {
            jh: "喬陰縣",
            loc: "石闆空地",
            name: "藏剑楼学者",
            name_tw: "藏劍樓學者",
            way: "jh 7;s;s;s;w",
            desc: "此人文質彬彬，手持一本書冊，正不斷的翻閱似乎想在裡面找到想要的答案。",
          },
          { jh: "喬陰縣", loc: "休息室", name: "藏剑楼长老", name_tw: "藏劍樓長老", way: "jh 7;s;s;s;s;s;s;e;n;n;e", desc: "一名談吐不凡的中年男子，備受手下尊崇。" },
          {
            jh: "喬陰縣",
            loc: "喬陰縣城北門",
            name: "守城官兵",
            way: "jh 7",
            desc: "這是個正在這裡站崗的守城官兵，雖然和許多武林人物比起來，官兵們的武功實在稀鬆平常，但是他們是有組織、有紀律的戰士，誰也不輕易地招惹他們。",
          },
          {
            jh: "喬陰縣",
            loc: "福林大街",
            name: "陆得财",
            name_tw: "陸得財",
            way: "jh 7;s",
            desc: "陸得財是一個渾身髒兮兮的老丐，一副無精打采要死不活的樣子，可是武林中人人都識得他身上打著二十三個結的皮酒囊，這不但是「花紫會」龍頭的信物，更是名鎮漠南的「黑水伏蛟」獨門兵器，只不過陸得財行蹤詭密，據說各處隨時都有七、八的他的替身在四處活動，所以你也很難確定眼前這個陸得財到底是不是真的。",
          },
          { jh: "喬陰縣", loc: "福林大街", name: "卖饼大叔", name_tw: "賣餅大叔", way: "jh 7;s", desc: "一個相貌樸實的賣餅大叔，憨厚的臉上掛著和藹的笑容。" },
          { jh: "喬陰縣", loc: "福林大街", name: "卖包子的", name_tw: "賣包子的", way: "jh 7;s;s;s", desc: "這個賣包子的小販對你微微一笑，說道：熱騰騰的包子，來一籠吧" },
          { jh: "喬陰縣", loc: "樹王墳內部", name: "怪人", way: "jh 7;s;s;s;s;event_1_65599392;w", desc: "體型與小孩一般，臉上卻滿是皺紋，頭發已經掉光。" },
          {
            jh: "喬陰縣",
            loc: "福林酒樓",
            name: "汤掌柜",
            name_tw: "湯掌櫃",
            way: "jh 7;s;s;s;s;s;s;e",
            desc: "湯掌櫃是這家大酒樓的主人，別看他只是一個小小的酒樓老闆，喬陰縣境內除了知縣老爺以外，恐怕就屬他最財大勢大。",
          },
          { jh: "喬陰縣", loc: "福林酒樓", name: "武官", way: "jh 7;s;s;s;s;s;s;e", desc: "一位相貌威武的武官，獨自一個人站在這裡發呆，似乎正有什麼事困擾著他。" },
          { jh: "喬陰縣", loc: "福林酒樓", name: "家丁", way: "jh 7;s;s;s;s;s;s;e;n", desc: "一個穿著家人服色的男子，必恭必敬地垂手站在一旁。" },
          { jh: "喬陰縣", loc: "福林酒樓", name: "贵公子", name_tw: "貴公子", way: "jh 7;s;s;s;s;s;s;e;n", desc: "一個相貌俊美的年輕貴公子正優雅地欣賞著窗外的景物。" },
          {
            jh: "喬陰縣",
            loc: "福林酒樓",
            name: "酒楼守卫",
            name_tw: "酒樓守衛",
            way: "jh 7;s;s;s;s;s;s;e;n;n",
            desc: "一個身穿藍布衣的人，從他銳利的眼神跟神情，顯然是個練家子。",
          },
          { jh: "喬陰縣", loc: "曲橋", name: "书生", name_tw: "書生", way: "jh 7;s;s;s;s;s;s;s;s;e", desc: "一個看起來相當斯文的書生，正拿著一本書搖頭晃腦地讀著。" },
          { jh: "喬陰縣", loc: "曲橋", name: "官家小姐", way: "jh 7;s;s;s;s;s;s;s;s;e;n;e", desc: "一個看起來像是有錢人家的女子，正在這裡遊湖。" },
          { jh: "喬陰縣", loc: "曲橋", name: "丫鬟", way: "jh 7;s;s;s;s;s;s;s;s;e;n;e", desc: "一個服侍有錢人家小姐的丫鬟，正無聊地玩弄著衣角。" },
          {
            jh: "喬陰縣",
            loc: "曼雲台",
            name: "骆云舟",
            name_tw: "駱雲舟",
            way: "jh 7;s;s;s;s;s;s;s;s;e;n;e;s;e",
            desc: "駱雲舟本是世家公子，因喜愛詩酒劍法，不為家族中人所偏愛。因此他年少離家，常年在外漂泊，時至今日，倒是武有所成，在文學的造詣上，也是深不可測了。",
          },
          {
            jh: "喬陰縣",
            loc: "火龍將軍廟",
            name: "乾瘪老太婆",
            name_tw: "乾癟老太婆",
            way: "jh 7;s;s;s;s;s;s;s;sw;w",
            desc: "這個老太婆懷中抱了個竹簍，似乎在賣什麼東西，也許你可以跟她問問價錢？",
          },
          { jh: "喬陰縣", loc: "火龍將軍廟", name: "妇人", name_tw: "婦人", way: "jh 7;s;s;s;s;s;s;s;sw;w;n", desc: "一個衣飾華麗的婦人正跪在這裡虔誠地膜拜著。" },
          { jh: "峨眉山", loc: "釣魚山腳", name: "先锋敌将", name_tw: "先鋒敵將", way: "jh 8;ne;e;e;e", desc: "攻城先鋒大將，長期毫無進展的戰事讓他難掩煩躁。" },
          { jh: "峨眉山", loc: "軍械庫", name: "乞利", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;e;n", desc: "攻城大將，曾是江湖上一等一的好手。" },
          {
            jh: "峨眉山",
            loc: "打坐室",
            name: "文碧师太",
            name_tw: "文碧師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;e;e;n;w",
            desc: "她是峨眉派的“文”輩弟子。",
          },
          {
            jh: "峨眉山",
            loc: "打坐室",
            name: "静火师太",
            name_tw: "靜火師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;w;w;n;e",
            desc: "她是峨眉派的“靜”輩弟子。",
          },
          {
            jh: "峨眉山",
            loc: "打坐室",
            name: "静鸿师太",
            name_tw: "靜鴻師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;w;w;n;n;e",
            desc: "她是峨眉派的“靜”輩弟子。",
          },
          {
            jh: "峨眉山",
            loc: "打坐室",
            name: "静能师太",
            name_tw: "靜能師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;w;w;s;w",
            desc: "她是峨眉派的“靜”輩弟子。",
          },
          {
            jh: "峨眉山",
            loc: "打坐室",
            name: "文虹师太",
            name_tw: "文虹師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;e;e;s;s;w",
            desc: "她是峨眉派的“文”輩弟子。",
          },
          {
            jh: "峨眉山",
            loc: "峨眉山門",
            name: "赵灵剑",
            name_tw: "趙靈劍",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;e;e;n;e",
            desc: "她是峨嵋派的第四代俗家弟子。",
          },
          {
            jh: "峨眉山",
            loc: "打坐室",
            name: "文好师太",
            name_tw: "文好師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;e;e;n;n;w",
            desc: "她是峨眉派的“文”輩弟子。",
          },
          {
            jh: "峨眉山",
            loc: "俗家弟子房",
            name: "李明霞",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;e;e;s;e",
            desc: "她是峨嵋派的第四代俗家弟子。",
          },
          {
            jh: "峨眉山",
            loc: "接引殿",
            name: "静无师太",
            name_tw: "靜無師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;n",
            desc: "她是峨眉派的“靜”輩弟子。",
          },
          {
            jh: "峨眉山",
            loc: "打坐室",
            name: "静白师太",
            name_tw: "靜白師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;w;w;n;w",
            desc: "她是峨眉派的“靜”輩弟子。",
          },
          {
            jh: "峨眉山",
            loc: "後殿",
            name: "静松师太",
            name_tw: "靜松師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;n;n",
            desc: "她是峨眉派的“靜”輩弟子。",
          },
          {
            jh: "峨眉山",
            loc: "俗家弟子房",
            name: "苏寒清",
            name_tw: "蘇寒清",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;e;e;s;s;e",
            desc: "她是峨嵋派的第四代俗家弟子。",
          },
          {
            jh: "峨眉山",
            loc: "打坐室",
            name: "静身师太",
            name_tw: "靜身師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;w;w;s;s;w",
            desc: "她是峨眉派的“靜”輩弟子。",
          },
          {
            jh: "峨眉山",
            loc: "打坐室",
            name: "静法师太",
            name_tw: "靜法師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;w;w;s;e",
            desc: "她是峨眉派的“靜”輩弟子。",
          },
          {
            jh: "峨眉山",
            loc: "打坐室",
            name: "静尼师太",
            name_tw: "靜尼師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;w;w;s;s;e",
            desc: "她是峨眉派的“靜”輩弟子。",
          },
          {
            jh: "峨眉山",
            loc: "峨眉後山",
            name: "藏剑楼剑客",
            name_tw: "藏劍樓劍客",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;n;n;n;n;n;n;n",
            desc: "此人手持長劍，正虎視眈眈的留神週圍，準備伺機而動。",
          },
          {
            jh: "峨眉山",
            loc: "打坐室",
            name: "文海师太",
            name_tw: "文海師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill emei_shoushan;;n;;n;n;n;w;n;n;n;e;e;s;w",
            desc: "她是峨眉派的“文”輩弟子。",
          },
          { jh: "峨眉山", loc: "護國門", name: "金狼大将", name_tw: "金狼大將", way: "jh 8;ne;e;e;e;n;n;n;n;n", desc: "攻城大將，曾是江湖上一等一的好手。" },
          { jh: "峨眉山", loc: "釣魚山腳", name: "先锋军士", name_tw: "先鋒軍士", way: "jh 8;ne;e;e;e", desc: "攻城大軍的先鋒軍士，滿臉兇狠，卻也掩飾不住疲乏之色。" },
          {
            jh: "峨眉山",
            loc: "敵軍大營",
            name: "耶律霸",
            way: "jh 8;ne;e;e;e;e",
            desc: "遼國皇族後裔，蒙古宰相耶律楚材之子，金狼軍主帥。他驍勇善戰，精通兵法，憑藉著一手堪可開山破嶽的好斧法殺得武林中人無人可擋聞之色變。視天波楊門為心腹之患欲處之而後快。",
          },
          { jh: "峨眉山", loc: "東新城門", name: "赤豹死士", way: "jh 8;ne;e;e;e;n", desc: "攻城大軍的赤豹營死士，戰力蠻橫，重盔重甲，防禦極好。" },
          { jh: "峨眉山", loc: "城南-字牆", name: "守城军士", name_tw: "守城軍士", way: "jh 8;ne;e;e;e;n;n", desc: "守城的軍士，英勇強悍，不畏生死。" },
          { jh: "峨眉山", loc: "鎮西門", name: "黑鹰死士", name_tw: "黑鷹死士", way: "jh 8;ne;e;e;e;n;n;n", desc: "攻城大軍的黑鷹營死士，出手極準。" },
          { jh: "峨眉山", loc: "護國門", name: "金狼死士", way: "jh 8;ne;e;e;e;n;n;n;n;n", desc: "攻城大軍將領的近身精銳。" },
          { jh: "峨眉山", loc: "城中主路", name: "运输兵", name_tw: "運輸兵", way: "jh 8;ne;e;e;e;n;n;n;n;n;e", desc: "負責運送器械的士兵。" },
          {
            jh: "峨眉山",
            loc: "城守府",
            name: "王坚",
            name_tw: "王堅",
            way: "jh 8;ne;e;e;e;n;n;n;n;n;e;e;e",
            desc: "釣魚城守城大將，智勇雙全，有條不紊地指揮著整座城市的防禦工作。",
          },
          { jh: "峨眉山", loc: "城守府", name: "参谋官", name_tw: "參謀官", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;e;e", desc: "守軍參謀軍官，負責傳遞消息和提出作戰意見。" },
          { jh: "峨眉山", loc: "軍械庫", name: "军械官", name_tw: "軍械官", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;e;n", desc: "管理軍械庫的一位中年軍官，健壯有力。" },
          { jh: "峨眉山", loc: "箭樓", name: "神箭手", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;e;s", desc: "釣魚城守城大軍的神箭手，百步穿楊，箭無虛發。" },
          { jh: "峨眉山", loc: "箭樓", name: "黑羽刺客", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;e;s", desc: "攻城黑羽將領的精銳刺客。" },
          { jh: "峨眉山", loc: "箭樓", name: "黑羽敌将", name_tw: "黑羽敵將", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;e;s", desc: "攻城大將，曾是江湖上一等一的好手。" },
          {
            jh: "峨眉山",
            loc: "糧庫",
            name: "粮库主薄",
            name_tw: "糧庫主薄",
            way: "jh 8;ne;e;e;e;n;n;n;n;n;e;n",
            desc: "管理糧庫的軍官，雙眼炯炯有神，一絲一毫的細節都牢記於心。",
          },
          { jh: "峨眉山", loc: "瞭望台", name: "斥候", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;s", desc: "負責偵查敵情的軍士" },
          { jh: "峨眉山", loc: "瞭望台", name: "阿保甲", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;s", desc: "攻城大將，曾是江湖上一等一的好手。" },
          { jh: "峨眉山", loc: "瞭望台", name: "胡族军士", name_tw: "胡族軍士", way: "jh 8;ne;e;e;e;n;n;n;n;n;e;s", desc: "攻城大軍將領的近身精銳。" },
          { jh: "峨眉山", loc: "山腳小路", name: "传令兵", name_tw: "傳令兵", way: "jh 8;ne;e;e;e;s", desc: "釣魚城派往長安求援的傳令兵，行色匆匆，滿面塵土。" },
          { jh: "峨眉山", loc: "峨眉山門", name: "文虚师太", name_tw: "文虛師太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e", desc: "她是峨眉派的“文”輩弟子。" },
          { jh: "峨眉山", loc: "峨眉山門", name: "看山弟子", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e", desc: "一個女弟子，手上拿著一把長劍。" },
          { jh: "峨眉山", loc: "山門廣場", name: "文玉师太", name_tw: "文玉師太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n", desc: "她是峨眉派的“文”輩弟子。" },
          { jh: "峨眉山", loc: "山門廣場", name: "文寒师太", name_tw: "文寒師太", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n", desc: "她是峨眉派的“文”輩弟子。" },
          { jh: "峨眉山", loc: "十二盤", name: "巡山弟子", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n", desc: "一個拿著武器，有點氣勢的巡山弟子。" },
          { jh: "峨眉山", loc: "千佛庵大門", name: "小女孩", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w", desc: "這是個小女孩。" },
          {
            jh: "峨眉山",
            loc: "千佛庵大門",
            name: "小贩",
            name_tw: "小販",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w",
            desc: "峨眉山上做點小生意的小販。",
          },
          {
            jh: "峨眉山",
            loc: "毗盧殿",
            name: "静洪师太",
            name_tw: "靜洪師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n",
            desc: "她是峨眉派的“靜”輩弟子。",
          },
          {
            jh: "峨眉山",
            loc: "文殊殿",
            name: "静雨师太",
            name_tw: "靜雨師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n",
            desc: "她是峨眉派的“靜”輩弟子。",
          },
          {
            jh: "峨眉山",
            loc: "俗家弟子房",
            name: "贝锦瑟",
            name_tw: "貝錦瑟",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;e;e;n;n;e",
            desc: "她是峨嵋派的第四代俗家弟子。",
          },
          { jh: "峨眉山", loc: "峨眉後山", name: "毒蛇", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;n", desc: "一條劇毒的毒蛇。" },
          {
            jh: "峨眉山",
            loc: "狹窄山路",
            name: "护法弟子",
            name_tw: "護法弟子",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;ne",
            desc: "她是一位年輕的師太。是滅絕石台座前的護法弟子。",
          },
          {
            jh: "峨眉山",
            loc: "狹窄山道",
            name: "护法大弟子",
            name_tw: "護法大弟子",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;ne;ne",
            desc: "她是一位年輕的師太。是滅絕石台座前的護法弟子。",
          },
          {
            jh: "峨眉山",
            loc: "靜修後殿",
            name: "方碧翠",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;ne;ne;n",
            desc: "她是峨嵋派的第四代俗家弟子。",
          },
          {
            jh: "峨眉山",
            loc: "靜修後殿",
            name: "灭绝掌门",
            name_tw: "滅絕掌門",
            name_new: "通星師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;ne;ne;n",
            desc: "她是峨嵋派的第三代弟子，現任峨嵋派掌門人。",
          },
          {
            jh: "峨眉山",
            loc: "九王洞",
            name: "静慈师太",
            name_tw: "靜慈師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;n;n;n;n;n;n;ne;ne;se;e",
            desc: "這是一位年紀不算很大的師太。",
          },
          {
            jh: "峨眉山",
            loc: "打坐室",
            name: "静玄师太",
            name_tw: "靜玄師太",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;w;w;n;n;w",
            desc: "她是峨眉派的“靜”輩弟子。",
          },
          { jh: "峨眉山", loc: "風動坡", name: "尼姑", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;w;w;w;w;n", desc: "這是一個年輕尼姑。" },
          {
            jh: "峨眉山",
            loc: "雷動坪",
            name: "尼姑",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;w;w;w;w;sw",
            desc: "這是一個年輕尼姑，似乎有幾手武功。",
          },
          {
            jh: "峨眉山",
            loc: "風動坡",
            name: "女孩",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;w;w;w;w;n",
            desc: "這是個少女，雖然只有十二、三歲，身材已經開始發育。",
          },
          { jh: "峨眉山", loc: "雷動坪", name: "小尼姑", way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;n;n;n;w;w;w;w;sw", desc: "一個年紀賞小的尼姑。" },
          {
            jh: "峨眉山",
            loc: "清音閣",
            name: "青书少侠",
            name_tw: "青書少俠",
            way: "jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;n;e;e",
            desc: "他今年二十歲，乃是武當第三代中出類拔萃的人物。",
          },
          { jh: "峨眉山", loc: "眺望台", name: "白猿", way: "jh 8;w;nw;n;n;n;n;w", desc: "這是一頭全身白色毛發的猿猴。" },
          { jh: "恆山", loc: "眺望台", name: "杀神寨匪首", name_tw: "殺神寨匪首", way: "", desc: "匪寨首領，殺氣騰騰。" },
          {
            jh: "恆山",
            loc: "桃花林",
            name: "嵩山死士",
            way: "jh 9;n;n;n;n;n;event_1_85624865;n;w;event_1_27135529",
            desc: "這是一名狂熱的嵩山弟子，甘願為嵩山付出自己的生命。",
          },
          { jh: "恆山", loc: "桃花林", name: "杀神寨头目", name_tw: "殺神寨頭目", way: "", desc: "匪寨的頭目，目露兇光。" },
          { jh: "恆山", loc: "大字嶺", name: "山盗", name_tw: "山盜", way: "jh 9", desc: "一個盤踞山林的盜匪。" },
          { jh: "恆山", loc: "虎風口", name: "秦卷帘", name_tw: "秦捲簾", way: "jh 9;n", desc: "恆山派俗家弟子，臉上沒有一絲表情，讓人望而卻步。" },
          { jh: "恆山", loc: "果老嶺", name: "郑婉儿", name_tw: "鄭婉兒", way: "jh 9;n;n", desc: "恆山派俗家弟子，看起來清麗可人。" },
          { jh: "恆山", loc: "夕陽嶺", name: "哑太婆", name_tw: "啞太婆", way: "jh 9;n;n;e", desc: "一身黑衣，頭發雖已花白，但俏麗的容顏卻讓人忍不住多看兩眼。" },
          { jh: "恆山", loc: "北嶽廟", name: "云问天", name_tw: "雲問天", way: "jh 9;n;n;n", desc: "身背行囊的遊客，看起來會些功夫。" },
          { jh: "恆山", loc: "北嶽殿", name: "石高达", name_tw: "石高達", way: "jh 9;n;n;n;n", desc: "一名身份可疑的男子，最近常在山上游蕩。" },
          { jh: "恆山", loc: "玉羊遊雲", name: "公孙浩", name_tw: "公孫浩", way: "jh 9;n;n;n;n;e", desc: "一名行走五湖四海的遊俠，看起來功夫還不錯。" },
          {
            jh: "恆山",
            loc: "秘道",
            name: "不可不戒",
            way: "jh 9;n;n;n;n;henshan15_op1",
            desc: "曾經是江湖上有名的採花大盜，被不戒和尚用藥迷倒，剪掉了作案工具，剃度後收為徒弟。",
          },
          { jh: "恆山", loc: "見性峰山道", name: "山蛇", way: "jh 9;n;n;n;n;n", desc: "一條吐著紅舌頭的毒蛇" },
          { jh: "恆山", loc: "見性峰山道", name: "嵩山弟子", way: "jh 9;n;n;n;n;n;event_1_85624865", desc: "嵩山派弟子" },
          { jh: "恆山", loc: "紫芝叢", name: "司马承", name_tw: "司馬承", way: "jh 9;n;n;n;n;n;event_1_85624865;n;e", desc: "嵩山派高手，看起來頗有些修為。" },
          {
            jh: "恆山",
            loc: "千年菩提",
            name: "沙江龙",
            name_tw: "沙江龍",
            way: "jh 9;n;n;n;n;n;event_1_85624865;n;n;n;henshan_zizhiyu11_op1",
            desc: "嵩山派高手，看起來頗有些修為。",
          },
          { jh: "恆山", loc: "雲洞", name: "史师兄", name_tw: "史師兄", way: "jh 9;n;n;n;n;n;event_1_85624865;n;n;n;n", desc: "嵩山派大弟子，武功修為頗高。" },
          { jh: "恆山", loc: "桃花林", name: "赵志高", name_tw: "趙志高", way: "jh 9;n;n;n;n;n;event_1_85624865;n;w", desc: "嵩山派高手，看起來頗有些修為。" },
          {
            jh: "恆山",
            loc: "白雲庵",
            name: "定云师太",
            name_tw: "定雲師太",
            way: "jh 9;n;n;n;n;n;n;n",
            desc: "恆山派白雲菴菴主，外剛內和，脾氣雖然暴躁，心地卻極慈祥。",
          },
          { jh: "恆山", loc: "藏經閣", name: "仪雨", name_tw: "儀雨", way: "jh 9;n;n;n;n;n;n;n;e;e", desc: "恆山派二弟子" },
          { jh: "恆山", loc: "練武房", name: "仪容", name_tw: "儀容", way: "jh 9;n;n;n;n;n;n;n;e;n", desc: "恆山派大弟子" },
          { jh: "恆山", loc: "長廊", name: "吸血蝙蝠", way: "jh 9;n;n;n;n;n;n;n;n", desc: "這是一隻黑色的吸血蝙蝠" },
          {
            jh: "恆山",
            loc: "白雲庵後殿",
            name: "定安师太",
            name_tw: "定安師太",
            way: "jh 9;n;n;n;n;n;n;n;n;n",
            desc: "恆山派掌門，心細如發，雖然平時極少出庵，但於江湖上各門各派的人物，無一不是瞭如指掌，其武功修為極高。",
          },
          { jh: "恆山", loc: "懸空棧道", name: "神教杀手", name_tw: "神教殺手", way: "jh 9;n;n;n;n;n;n;n;n;n;w", desc: "日月神教殺手，手段極其兇殘。" },
          {
            jh: "恆山",
            loc: "小茅屋",
            name: "魔教杀手",
            name_tw: "魔教殺手",
            way: "jh 9;n;n;n;n;n;n;n;n;n;w;n;e;henshan_qinqitai23_op1",
            desc: "魔教殺手，一張黃臉讓人過目難忘。",
          },
          { jh: "恆山", loc: "小茅屋", name: "魔教长老", name_tw: "魔教長老", way: "jh 9;n;n;n;n;n;n;n;n;n;w;n;e;n", desc: "此人衣著非凡，在魔教中頗有地位。" },
          { jh: "恆山", loc: "小茅屋", name: "魔教护卫", name_tw: "魔教護衛", way: "jh 9;n;n;n;n;n;n;n;n;n;w;n;e;n", desc: "一名面容冷峻的帶刀護衛，正警惕的打量四週。" },
          { jh: "恆山", loc: "松樹林", name: "神秘人", way: "jh 9;n;n;n;n;n;n;n;n;n;w;n;event_1_89533343", desc: "一個眼神淩厲的黑衣人，渾身散發著無比殺氣，令人不安。" },
          { jh: "恆山", loc: "琴棋台", name: "魔教头目", name_tw: "魔教頭目", way: "jh 9;n;n;n;n;n;n;n;n;n;w;n;n;n;n", desc: "看起來風流倜儻的中年男子，魔教的小頭目。" },
          { jh: "恆山", loc: "齋堂", name: "小师太", name_tw: "小師太", way: "jh 9;n;n;n;n;n;n;n;w;n", desc: "恆山入門弟子" },
          {
            jh: "恆山",
            loc: "雞叫石",
            name: "柳云烟",
            name_tw: "柳雲煙",
            way: "jh 9;n;n;n;w",
            desc: "一身短裝的女子，頭戴紗帽，一張俏臉在面紗後若隱若現，讓人忍不住想掀開面紗瞧個仔細。",
          },
          { jh: "恆山", loc: "懸根松", name: "九戒大师", name_tw: "九戒大師", way: "jh 9;n;w", desc: "雖著一身袈裟，但一臉絡腮鬍讓他看起來頗有些兇悍。" },
          {
            jh: "武當山",
            loc: "西廂走廊",
            name: "练功弟子",
            name_tw: "練功弟子",
            way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;w",
            desc: "一位正在練功的青年弟子，但似乎很不耐煩。",
          },
          {
            jh: "武當山",
            loc: "藏經閣",
            name: "道德经「上卷」",
            name_tw: "道德經「上卷」",
            way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;w;n",
            desc: "這是一冊道德經「上卷」，由體道第一始至去用第四十止。",
          },
          {
            jh: "武當山",
            loc: "藏經閣",
            name: "道德经「第一章」",
            name_tw: "道德經「第一章」",
            way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;w;n",
            desc: "第一章   道可道，非常道。名可名，非常名。   無名天地之始；有名萬物之母。   故常無，欲以觀其妙；常有，欲以觀其徼。   此兩者，同出而異名，同謂之玄。玄之又玄，眾妙之門。",
          },
          { jh: "武當山", loc: "林中小路", name: "王五", way: "jh 10;w", desc: "一位邋邋遢遢的道士。" },
          { jh: "武當山", loc: "林中小路", name: "土匪头", name_tw: "土匪頭", way: "jh 10", desc: "這傢伙滿臉殺氣，一付凶神惡煞的模樣，令人望而生畏。" },
          { jh: "武當山", loc: "林中小路", name: "土匪", way: "jh 10", desc: "這傢伙滿臉橫肉一付凶神惡煞的模樣，令人望而生畏。" },
          { jh: "武當山", loc: "遇劍閣大門", name: "布衣弟子", way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n", desc: "遇劍閣的一位弟子，不知是哪個長老門下的。" },
          {
            jh: "武當山",
            loc: "閣主樓",
            name: "剑童",
            name_tw: "劍童",
            way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;n;n",
            desc: "遇劍閣的一名劍童，長得十分可愛。",
          },
          {
            jh: "武當山",
            loc: "閣主寢室",
            name: "剑遇安",
            name_tw: "劍遇安",
            way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;n;n;n",
            desc: "一位似乎身重劇毒的老前輩，但仍能看出其健康之時武功不凡。",
          },
          {
            jh: "武當山",
            loc: "小院子",
            name: "剑遇治",
            name_tw: "劍遇治",
            way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;ne;n;n",
            desc: "一位身形肥胖的布衣青年。",
          },
          {
            jh: "武當山",
            loc: "山長老樓",
            name: "剑遇山",
            name_tw: "劍遇山",
            way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;ne;n;n;e",
            desc: "一位看起來非常高傲的老前輩。",
          },
          {
            jh: "武當山",
            loc: "行長老樓",
            name: "剑遇行",
            name_tw: "劍遇行",
            way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;ne;s;e",
            desc: "一問看起來非常慈祥的老前輩",
          },
          {
            jh: "武當山",
            loc: "鳴長老樓",
            name: "剑遇鸣",
            name_tw: "劍遇鳴",
            way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;ne;s;sw",
            desc: "一位看起來非常自負的老前輩。",
          },
          {
            jh: "武當山",
            loc: "小院子",
            name: "剑遇南",
            name_tw: "劍遇南",
            way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;nw;nw",
            desc: "一個布衣青年，腰間繫著一把配劍。",
          },
          {
            jh: "武當山",
            loc: "穆長老樓",
            name: "剑遇穆",
            name_tw: "劍遇穆",
            way: "jh 10;w;n;event_1_74091319;ne;n;sw;nw;w;ne;n;n;n;n;nw;nw;n",
            desc: "一位布衣長者，看起來道風仙骨。",
          },
          { jh: "武當山", loc: "黃土路", name: "野兔", way: "jh 10;w;n;n;w", desc: "一隻好可愛的小野兔。" },
          { jh: "武當山", loc: "武當牌坊", name: "进香客", name_tw: "進香客", way: "jh 10;w;n;n;w;w", desc: "一位前往武當山進香的人。" },
          { jh: "武當山", loc: "武當牌坊", name: "青书少侠", name_tw: "青書少俠", way: "jh 10;w;n;n;w;w", desc: "他今年二十歲，乃是武當第三代中出類拔萃的人物。" },
          { jh: "武當山", loc: "三清殿", name: "知客道长", name_tw: "知客道長", way: "jh 10;w;n;n;w;w;w;n;n;n", desc: "他是武當山的知客道長。" },
          { jh: "武當山", loc: "武當廣場", name: "道童", way: "jh 10;w;n;n;w;w;w;n;n;n;n", desc: "他是武當山的小道童。" },
          { jh: "武當山", loc: "桃園小路", name: "蜜蜂", way: "jh 10;w;n;n;w;w;w;n;n;n;n;e;e;e;e;s;e;s;e;n", desc: "這是一隻蜜蜂，正忙著採蜜。" },
          { jh: "武當山", loc: "桃園小路", name: "小蜜蜂", way: "jh 10;w;n;n;w;w;w;n;n;n;n;e;e;e;e;s;e;s;e;n", desc: "這是一隻蜜蜂，正忙著採蜜。" },
          {
            jh: "武當山",
            loc: "桃園小路",
            name: "猴子",
            way: "jh 10;w;n;n;w;w;w;n;n;n;n;e;e;e;e;s;e;s;e;s",
            desc: "這隻猴子在在桃樹間跳上跳下，還不時津津有味地啃幾口著蜜桃。",
          },
          {
            jh: "武當山",
            loc: "三清殿",
            name: "清虚道长",
            name_tw: "清虛道長",
            way: "jh 10;w;n;n;w;w;w;n;n;n;n;n",
            desc: "他就是清虛道長。他今年四十歲，主管武當派的俗事。",
          },
          {
            jh: "武當山",
            loc: "三清殿",
            name: "宋首侠",
            name_tw: "宋首俠",
            way: "jh 10;w;n;n;w;w;w;n;n;n;n;n",
            desc: "他就是張三豐的大弟子、武當七俠之首。身穿一件乾乾淨淨的灰色道袍。他已年過六十，身材瘦長，滿臉紅光。恬淡沖和，沉默寡言。",
          },
          {
            jh: "武當山",
            loc: "東廂走廊",
            name: "张松溪",
            name_tw: "張松溪",
            way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;e",
            desc: "他就是張三豐的四弟子張松溪。他今年四十歲，精明能幹，以足智多謀著稱。",
          },
          {
            jh: "武當山",
            loc: "比武房",
            name: "俞二侠",
            name_tw: "俞二俠",
            way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;e;e;e;e",
            desc: "服下丹藥之後的他武功似乎提升了不少，實力不容小覷。",
          },
          {
            jh: "武當山",
            loc: "茶室",
            name: "小翠",
            way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;e;e;s",
            desc: "這是個年年齡不大的小姑娘，但寬鬆的道袍也遮不住她過早發育的身體。一臉聰明乖巧，滿口伶牙俐齒。見有人稍微示意，便過去加茶倒水。",
          },
          { jh: "武當山", loc: "茶室", name: "水蜜桃", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;e;e;s", desc: "一碟水靈新鮮的水蜜桃，跟小翠的臉蛋兒一樣紅豔可人。" },
          { jh: "武當山", loc: "茶室", name: "香茶", way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;e;e;s", desc: "一杯熱茶，悠悠地冒著香氣～～～" },
          {
            jh: "武當山",
            loc: "後院",
            name: "俞莲舟",
            name_tw: "俞蓮舟",
            way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;n",
            desc: "他就是張三豐的二弟子俞蓮舟。他今年五十歲，身材魁梧，氣度凝重。雖在武當七俠中排名第二，功夫卻是最精。",
          },
          {
            jh: "武當山",
            loc: "後山小院",
            name: "张三丰",
            name_tw: "張三豐",
            way: "jh 10;w;n;n;w;w;w;n;n;n;n;n;n;n;n;n",
            desc: "他就是武當派開山鼻祖、當今武林的泰山北斗，中華武功承先啟後、繼往開來的大宗師。身穿一件汙穢的灰色道袍，不修邊幅。身材高大，年滿百歲，滿臉紅光，須眉皆白。",
          },
          { jh: "晚月莊", loc: "後山小院", name: "安妮儿", name_tw: "安妮兒", way: "", desc: "一個風塵僕僕的俠客。。" },
          {
            jh: "晚月莊",
            loc: "□香榭",
            name: "颜慧如",
            name_tw: "顏慧如",
            way: "jh 11;e;e;s;sw;se;s;s;s;w;s;s;se",
            desc: "她是一位美女，真是紅顏似玉，綠鬢如雲，明麗的眼睛，潔白的牙齒。容色俊俏，風度飄逸，令人心動。",
          },
          {
            jh: "晚月莊",
            loc: "翠湘閣",
            name: "莫欣芳",
            way: "jh 11;e;e;s;sw;se;w;w;s;s;s;w;n;e;n",
            desc: "她國色天香，嬌麗無倫；溫柔嫻靜，秀絕人寰。她姿容絕美，世所罕見。從她身旁你聞道一寒谷幽香。",
          },
          { jh: "晚月莊", loc: "紫翎小軒", name: "上官钰翎", name_tw: "上官鈺翎", way: "jh 11;e;e;s;sw;se;s;s;s;w;s;s;w", desc: "一個風塵僕僕的俠客。。" },
          { jh: "晚月莊", loc: "暖香榭", name: "美珊", way: "jh 11;e;e;s;sw;se;s;s;s;e;se;s", desc: "她看起來成熟中帶有一些韻味。飄逸的長發十分迷人。" },
          { jh: "晚月莊", loc: "暖香榭", name: "金丝雀", name_tw: "金絲雀", way: "jh 11;e;e;s;sw;se;s;s;s;e;se;s", desc: "一隻羽毛鮮□的小金絲雀。" },
          {
            jh: "晚月莊",
            loc: "沁芳亭",
            name: "袭人",
            name_tw: "襲人",
            way: "jh 11;e;e;s;sw;se;s;s;s;s;s",
            desc: "她有著春花般的臉兒，青山似的眉黛，靈活如秋波的眼睛，高低適宜如玉□的鼻子，珊珊似的小口。她的特點就是清秀大方，如花中之牡丹，鳥中之鸞鳳。",
          },
          { jh: "晚月莊", loc: "紫翎小軒", name: "小金鼠", way: "jh 11;e;e;s;sw;se;s;s;s;w;s;s;w", desc: "一隻可愛的長尾巴的小金鼠。" },
          { jh: "晚月莊", loc: "沐浴更衣室", name: "阮欣郁", name_tw: "阮欣鬱", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w;s;e", desc: "一個風塵僕僕的俠客。。" },
          { jh: "晚月莊", loc: "內廳穿堂", name: "龙韶吟", name_tw: "龍韶吟", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w;s", desc: "一個風塵僕僕的俠客。。" },
          { jh: "晚月莊", loc: "內廳", name: "虞琼衣", name_tw: "虞瓊衣", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w", desc: "一個風塵僕僕的俠客。。" },
          {
            jh: "晚月莊",
            loc: "後廳",
            name: "苗郁手",
            name_tw: "苗鬱手",
            way: "jh 11;e;e;s;sw;se;w;w;s;s;s",
            desc: "她看起來很有活力，兩眼明亮有神。給你一種巾幗不讓須眉的氣勢，但剛毅之中似又隱含著女孩子有的嬌柔。",
          },
          {
            jh: "晚月莊",
            loc: "後廳",
            name: "圆春",
            name_tw: "圓春",
            way: "jh 11;e;e;s;sw;se;w;w;s;s;s",
            desc: "她是惜春的妹妹，跟姐姐從小就在晚月莊長大。因為與雙親失散，被莊主收留。平常幫忙莊內瑣碎事務。",
          },
          {
            jh: "晚月莊",
            loc: "內書房",
            name: "惜春",
            way: "jh 11;e;e;s;sw;se;w;w;s;s;s;w;w",
            desc: "她看起來成熟中帶有一些稚氣。飄逸的長發十分迷人。她是個孤兒，從小與妹妹圓春被莊主收留，她很聰明，在第四代弟子中算是武功很出色的一個。",
          },
          {
            jh: "晚月莊",
            loc: "小花池",
            name: "凤凰",
            name_tw: "鳳凰",
            way: "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w;s;e;e",
            desc: "火神「鳳凰」乃勇士寒於的魂魄所化成的十三個精靈之一。由於其奇異神蹟，被晚月莊供奉為護莊神獸。",
          },
          {
            jh: "晚月莊",
            loc: "小花池",
            name: "金仪彤",
            name_tw: "金儀彤",
            way: "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;w;s;e;e",
            desc: "她國色天香，嬌麗無倫；溫柔嫻靜，秀絕人寰。可惜眉心上有一道地煞紋干犯紫鬥，恐要玉手染血，浩劫武林。",
          },
          { jh: "晚月莊", loc: "東廂房", name: "瑷伦", name_tw: "璦倫", way: "jh 11;e;e;s;sw;se;w;w;s;s;s;e;s;s;e", desc: "她已是步入老年，但仍風采依舊。" },
          {
            jh: "晚月莊",
            loc: "廚房",
            name: "曲馥琪",
            way: "jh 11;e;e;s;sw;se;w;w;s;s;e;e;e",
            desc: "她國色天香，嬌麗無倫；溫柔嫻靜，秀絕人寰。她姿容絕美，世所罕見。從她身旁你聞道一寒谷幽香。",
          },
          { jh: "晚月莊", loc: "上等廂房", name: "梦玉楼", name_tw: "夢玉樓", way: "jh 11;e;e;s;sw;se;w;w;s;s;w;w;s", desc: "一個風塵僕僕的俠客。。" },
          {
            jh: "晚月莊",
            loc: "桂花園",
            name: "蓝小蝶",
            name_tw: "藍小蝶",
            way: "jh 11;e;e;s;sw;se;s;s;s;w;s",
            desc: "她長得十分漂亮！讓你忍不住多瞧她幾眼，從她身上你聞到淡淡的香氣。她很有禮貌的向你點頭，優雅的動作，輕盈的步伐，好美哦!她是晚月莊主藍止萍的養女，平常莊內的接待是看她。",
          },
          { jh: "晚月莊", loc: "", name: "小白兔", way: ".靠謎題飛", desc: "一隻紅眼睛的小白兔。" },
          { jh: "晚月莊", loc: "", name: "风老四", name_tw: "風老四", way: ".靠謎題飛", desc: "風梭風九幽，但他現在走火入魔，一動也不能動了。" },
          { jh: "晚月莊", loc: "", name: "水灵儿", name_tw: "水靈兒", way: ".靠謎題飛", desc: "她滿面愁容，手裡雖然拿著本書，卻只是呆呆的出神。" },
          { jh: "晚月莊", loc: "蜿蜒小徑", name: "蝴蝶", way: "jh 11;e;e;s", desc: "一隻翩翩起舞的小蝴蝶哦!" },
          {
            jh: "晚月莊",
            loc: "小路",
            name: "小贩",
            name_tw: "小販",
            way: "jh 11;e;e;s;n;nw;w;nw;e",
            desc: "這小販左手提著個籃子，右手提著個酒壺。籃上繫著銅鈴，不住叮鐺作響。",
          },
          { jh: "晚月莊", loc: "茅屋內", name: "酒肉和尚", way: "jh 11;e;e;s;n;nw;w;nw;e;e;e;n;w", desc: "這是一個僧不僧俗不俗，滿頭亂發的怪人" },
          {
            jh: "晚月莊",
            loc: "幽州台",
            name: "陈子昂",
            name_tw: "陳子昂",
            way: "jh 11;e;e;s;n;nw;w;nw;e;e;e;se",
            desc: "一個狂放書生，顯是出自豪富之家，輕財好施，慷慨任俠。",
          },
          {
            jh: "晚月莊",
            loc: "晚月莊大門",
            name: "彩衣少女",
            name_tw: "綵衣少女",
            way: "jh 11;e;e;s;sw",
            desc: "小姑娘是晚月莊的女弟子，雖說身形單薄，可眼神裡透出的傲氣讓人感到並不好欺負。",
          },
          { jh: "晚月莊", loc: "晚月莊大廳", name: "婢女", way: "jh 11;e;e;s;sw;se;w", desc: "一個風塵僕僕的俠客。。" },
          {
            jh: "晚月莊",
            loc: "晚月莊大廳",
            name: "蓝止萍",
            name_tw: "藍止萍",
            way: "jh 11;e;e;s;sw;se;w",
            desc: "藍止萍是一個十分出色的美女，她彈的一手琵琶更是聞名千里，許多王侯子弟，富商豪客都為她天下無雙的美貌與琴藝傾倒。",
          },
          {
            jh: "晚月莊",
            loc: "傍廳",
            name: "蓝雨梅",
            name_tw: "藍雨梅",
            way: "jh 11;e;e;s;sw;se;w;n",
            desc: "藍雨梅是晚月莊主藍止萍的養女，由於莊主不信任男子，因此晚月莊接待外賓的工作向來由她負責。",
          },
          {
            jh: "晚月莊",
            loc: "禁閉房",
            name: "芳绫",
            name_tw: "芳綾",
            way: "jh 11;e;e;s;sw;se;w;w;n;w",
            desc: "她看起來像個小靈精，頭上梳兩個小包包頭。她坐在地上，看到你看她便向你作了個鬼臉!你想她一定是調皮才會在這受罰!",
          },
          {
            jh: "晚月莊",
            loc: "夾道",
            name: "昭蓉",
            way: "jh 11;e;e;s;sw;se;w;w;s;s;w",
            desc: "她長得十分漂亮！讓你忍不住多瞧她幾眼，從她身上你聞到淡淡的香氣。她很有禮貌的向你點頭，優雅的動作，輕盈的步伐，好美哦!",
          },
          {
            jh: "晚月莊",
            loc: "後院書房",
            name: "昭仪",
            name_tw: "昭儀",
            way: "jh 11;e;e;s;sw;se;w;w;w;w",
            desc: "她看起來非常可愛。身材玲瓏有致，曲線苗條。第一眼印象，你覺的她舞蹈一定跳的不錯，看她的一舉一動有一種說不出的流暢優雅！",
          },
          {
            jh: "水煙閣",
            loc: "水煙閣正門",
            name: "天邪虎",
            way: "jh 12;n;n;n",
            desc: "這是一隻天邪派的靈獸「天邪虎」，火紅的毛皮上有著如白銀般的白紋，湛藍色的眼珠中散發出妖異的光芒。",
          },
          { jh: "水煙閣", loc: "水煙閣正門", name: "水烟阁武士", name_tw: "水煙閣武士", way: "jh 12;n;n;n", desc: "這是一個水煙閣武士。" },
          {
            jh: "水煙閣",
            loc: "廚房",
            name: "董老头",
            name_tw: "董老頭",
            way: "jh 12;n;n;n;e;n;n",
            desc: "於蘭天武的親兵，追隨於蘭天武多年，如今隱居於水煙閣，繼續保護王爺。",
          },
          {
            jh: "水煙閣",
            loc: "水煙閣正廳",
            name: "潘军禅",
            name_tw: "潘軍禪",
            way: "jh 12;n;n;n;n",
            desc: "潘軍禪是當今武林的一位傳奇性人物，以他僅僅二十八歲的年齡竟能做到水煙閣執法使的職位，著實是一位不簡單的人物。潘軍禪是封山劍派掌門柳淳風的結拜義弟，但是他為人其實十分風趣，又好交朋友，絲毫不會擺出武林執法者的架子。",
          },
          { jh: "水煙閣", loc: "水煙閣正廳", name: "萧辟尘", name_tw: "蕭闢塵", way: "jh 12;n;n;n;n", desc: "蕭闢塵自幼生長於嵐城之中，看起來仙風道骨，不食人間煙火。" },
          {
            jh: "水煙閣",
            loc: "西側廳",
            name: "水烟阁红衣武士",
            name_tw: "水煙閣紅衣武士",
            way: "jh 12;n;n;n;w;n;nw",
            desc: "這個人身著紅色水煙閣武士服色，眼神十分銳利。",
          },
          { jh: "水煙閣", loc: "聆嘯廳", name: "水烟阁司事", name_tw: "水煙閣司事", way: "jh 12;n;n;n;w;n;nw;e", desc: "這個人看起來十分和藹可親，一雙眼睛炯炯有神。" },
          {
            jh: "水煙閣",
            loc: "春秋水色齋",
            name: "於兰天武",
            name_tw: "於蘭天武",
            way: "jh 12;n;n;n;w;n;nw;e;n",
            desc: "於蘭天武是當今皇上的叔父，但是他畢生浸淫武學，甘願拋棄榮華富以換取水煙閣傳功使一職，以便閱讀水煙閣中所藏的武學典籍，無論你有什麼武學上的疑難，他都能為你解答。",
          },
          {
            jh: "少林寺",
            loc: "般若堂五層",
            name: "澄志",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          {
            jh: "少林寺",
            loc: "羅漢堂九層",
            name: "澄和",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s;s;s;s;s;s;s",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          {
            jh: "少林寺",
            loc: "羅漢堂四層",
            name: "澄净",
            name_tw: "澄淨",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s;s",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          {
            jh: "少林寺",
            loc: "臥室",
            name: "道果禅师",
            name_tw: "道果禪師",
            way: "jh 13;n;w;w;n;shaolin012_op1",
            desc: "他是一位身材高大的中年僧人，兩臂粗壯，膀闊腰圓。他手持兵刃，身穿一襲灰布鑲邊袈裟，似乎有一身武藝。",
          },
          {
            jh: "少林寺",
            loc: "般若堂四層",
            name: "澄识",
            name_tw: "澄識",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          {
            jh: "少林寺",
            loc: "般若堂七層",
            name: "澄灵",
            name_tw: "澄靈",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;s;s",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          {
            jh: "少林寺",
            loc: "般若堂六層",
            name: "澄信",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;s",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          {
            jh: "少林寺",
            loc: "羅漢堂一層",
            name: "澄观",
            name_tw: "澄觀",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;e",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          {
            jh: "少林寺",
            loc: "般若堂九層",
            name: "澄尚",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;s;s;s;s",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          {
            jh: "少林寺",
            loc: "羅漢堂八層",
            name: "澄灭",
            name_tw: "澄滅",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s;s;s;s;s;s",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          { jh: "少林寺", loc: "小木屋", name: "乔三槐", name_tw: "喬三槐", way: "jh 13;n;w;w;n", desc: "勤勞樸實的山民，皮膚黝黑粗糙。" },
          { jh: "少林寺", loc: "菩提金剛陣", name: "渡云神识", name_tw: "渡雲神識", way: "jh 13;e;s;s;w;w;w;event_1_38874360", desc: "這是渡雲的神識。" },
          {
            jh: "少林寺",
            loc: "般若堂三層",
            name: "澄思",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          {
            jh: "少林寺",
            loc: "羅漢堂三層",
            name: "澄明",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          { jh: "少林寺", loc: "菩提金剛陣", name: "渡风神识", name_tw: "渡風神識", way: "jh 13;e;s;s;w;w;w;event_1_38874360", desc: "這是渡風的神識。" },
          {
            jh: "少林寺",
            loc: "般若堂八層",
            name: "澄欲",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;s;s;s",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          {
            jh: "少林寺",
            loc: "羅漢堂七層",
            name: "澄寂",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s;s;s;s;s",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          {
            jh: "少林寺",
            loc: "羅漢堂五層",
            name: "澄坚",
            name_tw: "澄堅",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;e;s;s;s;s",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          {
            jh: "少林寺",
            loc: "般若堂二層",
            name: "澄意",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;w;s",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          {
            jh: "少林寺",
            loc: "般若堂一層",
            name: "澄心",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;w",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          { jh: "少林寺", loc: "菩提金剛陣", name: "渡雨神识", name_tw: "渡雨神識", way: "jh 13;e;s;s;w;w;w;event_1_38874360", desc: "這是渡雨的神識。" },
          {
            jh: "少林寺",
            loc: "羅漢堂二層",
            name: "澄知",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;e;s",
            desc: "他是一位須發花白的老僧，身穿一襲金邊黑布袈裟。他身材瘦高，太陽穴高高鼓起，似乎身懷絕世武功。",
          },
          {
            jh: "少林寺",
            loc: "叢林山徑",
            name: "虚通",
            name_tw: "虛通",
            way: "jh 13",
            desc: "他是一位身穿黃布袈裟的青年僧人。臉上稚氣未脫，身手卻已相當矯捷，看來似乎學過一點武功。",
          },
          { jh: "少林寺", loc: "叢林山徑", name: "山猪", name_tw: "山豬", way: "jh 13", desc: "黑色山豬，披著一身剛硬的鬃毛。" },
          {
            jh: "少林寺",
            loc: "金剛伏魔圈",
            name: "渡云",
            name_tw: "渡雲",
            way: "jh 13;e;s;s;w;w;w",
            desc: "這是一個面頰深陷，瘦骨零丁的老僧，他臉色枯黃，如同一段枯木。",
          },
          { jh: "少林寺", loc: "金剛伏魔圈", name: "渡雨", way: "jh 13;e;s;s;w;w;w", desc: "這是一個面頰深陷，瘦骨零丁的老僧，他臉色慘白，象一張紙一樣。" },
          {
            jh: "少林寺",
            loc: "金剛伏魔圈",
            name: "渡风",
            name_tw: "渡風",
            way: "jh 13;e;s;s;w;w;w",
            desc: "這是一個面頰深陷，瘦骨零丁的老僧，他臉色慘白，象一張紙一樣。",
          },
          { jh: "少林寺", loc: "少林寺山門", name: "僧人", way: "jh 13;n", desc: "少林寺僧人，負責看守山門。" },
          {
            jh: "少林寺",
            loc: "少林寺山門",
            name: "虚明",
            name_tw: "虛明",
            way: "jh 13;n",
            desc: "他是一位身穿黃布袈裟的青年僧人。臉上稚氣未脫，身手卻已相當矯捷，看來似乎學過一點武功。",
          },
          { jh: "少林寺", loc: "甬道", name: "慧色尊者", way: "jh 13;n;n", desc: "他是一位兩鬢斑白的老僧，身穿一襲青布鑲邊袈裟。他身材略高，太陽穴微凸，雙目炯炯有神。" },
          { jh: "少林寺", loc: "甬道", name: "扫地和尚", name_tw: "掃地和尚", way: "jh 13;n;n", desc: "一名年輕僧人，身穿灰色僧衣。" },
          { jh: "少林寺", loc: "甬道", name: "慧如尊者", way: "jh 13;n;n", desc: "他是一位兩鬢斑白的老僧，身穿一襲青布鑲邊袈裟。他身材略高，太陽穴微凸，雙目炯炯有神。" },
          { jh: "少林寺", loc: "東碑林", name: "洒水僧", name_tw: "灑水僧", way: "jh 13;n;n;e", desc: "一名年輕僧人，身穿灰色僧衣。" },
          { jh: "少林寺", loc: "天王殿", name: "小北", way: "jh 13;n;n;n", desc: "這是一個天真活潑的小沙彌，剛進寺不久，尚未剃度。" },
          {
            jh: "少林寺",
            loc: "天王殿",
            name: "玄痛大师",
            name_tw: "玄痛大師",
            way: "jh 13;n;n;n",
            desc: "他是一位白須白眉的老僧，身穿一襲銀絲棕黃袈裟。他身材高大，兩手過膝。雙目半睜半閉，卻不時射出一縷精光。",
          },
          {
            jh: "少林寺",
            loc: "廣場",
            name: "慧空尊者",
            way: "jh 13;n;n;n;n",
            desc: "他是一位兩鬢斑白的老僧，身穿一襲青布鑲邊袈裟。他身材略高，太陽穴微凸，雙目炯炯有神。",
          },
          {
            jh: "少林寺",
            loc: "廣場",
            name: "慧名尊者",
            way: "jh 13;n;n;n;n",
            desc: "他是一位兩鬢斑白的老僧，身穿一襲青布鑲邊袈裟。他身材略高，太陽穴微凸，雙目炯炯有神。",
          },
          { jh: "少林寺", loc: "廣場", name: "进香客", name_tw: "進香客", way: "jh 13;n;n;n;n", desc: "來寺裡進香的中年男子，看起來滿臉疲憊。" },
          { jh: "少林寺", loc: "鐘樓", name: "扫地僧", name_tw: "掃地僧", way: "jh 13;n;n;n;n;e", desc: "一個年老的僧人，看上去老態龍鍾，但是雙目間卻有一股精氣？" },
          { jh: "少林寺", loc: "鐘樓", name: "行者", way: "jh 13;n;n;n;n;e", desc: "他是一位雲遊四方的行者，風霜滿面，行色匆匆，似乎正在辦一件急事。" },
          {
            jh: "少林寺",
            loc: "大雄寶殿",
            name: "道象禅师",
            name_tw: "道象禪師",
            way: "jh 13;n;n;n;n;n",
            desc: "他是一位身材高大的中年僧人，兩臂粗壯，膀闊腰圓。他手持兵刃，身穿一襲灰布鑲邊袈裟，似乎有一身武藝。",
          },
          { jh: "少林寺", loc: "大雄寶殿", name: "小南", way: "jh 13;n;n;n;n;n", desc: "青衣小沙彌，尚未剃度。" },
          { jh: "少林寺", loc: "月台", name: "巡寺僧人", way: "jh 13;n;n;n;n;n;n", desc: "身穿黃色僧衣的僧人，負責看守藏經閣。" },
          { jh: "少林寺", loc: "月台", name: "托钵僧", name_tw: "托缽僧", way: "jh 13;n;n;n;n;n;n", desc: "他是一位未通世故的青年和尚，臉上掛著孩兒般的微笑。" },
          { jh: "少林寺", loc: "月台", name: "行者", way: "jh 13;n;n;n;n;n;n", desc: "他是一位雲遊四方的行者，風霜滿面，行色匆匆，似乎正在辦一件急事。" },
          { jh: "少林寺", loc: "東禪房", name: "打坐僧人", way: "jh 13;n;n;n;n;n;n;e", desc: "正在禪室打坐修行的僧人。" },
          {
            jh: "少林寺",
            loc: "藏經閣",
            name: "清晓比丘",
            name_tw: "清曉比丘",
            way: "jh 13;n;n;n;n;n;n;n",
            desc: "他是一位體格強健的壯年僧人，他身得虎背熊腰，全身似乎蘊含著無窮勁力。他身穿一襲白布黑邊袈裟，似乎身懷武藝。",
          },
          { jh: "少林寺", loc: "藏經閣", name: "黑衣大汉", name_tw: "黑衣大漢", way: "jh 13;n;n;n;n;n;n;n", desc: "黑布蒙面，只露出一雙冷電般的眼睛的黑衣大漢。" },
          {
            jh: "少林寺",
            loc: "藏經閣",
            name: "清缘比丘",
            name_tw: "清緣比丘",
            way: "jh 13;n;n;n;n;n;n;n",
            desc: "他是一位體格強健的壯年僧人，他身得虎背熊腰，全身似乎蘊含著無窮勁力。他身穿一襲白布黑邊袈裟，似乎身懷武藝。",
          },
          {
            jh: "少林寺",
            loc: "方丈院",
            name: "清为比丘",
            name_tw: "清為比丘",
            way: "jh 13;n;n;n;n;n;n;n;n",
            desc: "他是一位體格強健的壯年僧人，他身得虎背熊腰，全身似乎蘊含著無窮勁力。他身穿一襲白布黑邊袈裟，似乎身懷武藝。",
          },
          {
            jh: "少林寺",
            loc: "方丈院",
            name: "清无比丘",
            name_tw: "清無比丘",
            way: "jh 13;n;n;n;n;n;n;n;n",
            desc: "他是一位體格強健的壯年僧人，他身得虎背熊腰，全身似乎蘊含著無窮勁力。他身穿一襲白布黑邊袈裟，似乎身懷武藝。",
          },
          { jh: "少林寺", loc: "方丈院", name: "小沙弥", name_tw: "小沙彌", way: "jh 13;n;n;n;n;n;n;n;n", desc: "一名憨頭憨腦的和尚，手裡端著茶盤。" },
          {
            jh: "少林寺",
            loc: "方丈院",
            name: "清闻比丘",
            name_tw: "清聞比丘",
            way: "jh 13;n;n;n;n;n;n;n;n",
            desc: "他是一位體格強健的壯年僧人，他身得虎背熊腰，全身似乎蘊含著無窮勁力。他身穿一襲白布黑邊袈裟，似乎身懷武藝。",
          },
          {
            jh: "少林寺",
            loc: "東廂房",
            name: "玄悲大师",
            name_tw: "玄悲大師",
            way: "jh 13;n;n;n;n;n;n;n;n;e",
            desc: "他是一位白須白眉的老僧，身穿一襲銀絲棕黃袈裟。他身材甚高，但骨瘦如柴，頂門高聳，雙目湛然有神。",
          },
          {
            jh: "少林寺",
            loc: "方丈室",
            name: "玄慈大师",
            name_tw: "玄慈大師",
            way: "jh 13;n;n;n;n;n;n;n;n;n",
            desc: "他是一位白須白眉的老僧，身穿一襲金絲繡紅袈裟。他身材略顯佝僂，但卻滿面紅光，目蘊慈笑，顯得神完氣足。",
          },
          {
            jh: "少林寺",
            loc: "方丈室",
            name: "清乐比丘",
            name_tw: "清樂比丘",
            way: "jh 13;n;n;n;n;n;n;n;n;n",
            desc: "他是一位體格強健的壯年僧人，他身得虎背熊腰，全身似乎蘊含著無窮勁力。他身穿一襲白布黑邊袈裟，似乎身懷武藝。",
          },
          {
            jh: "少林寺",
            loc: "方丈室",
            name: "清善比丘",
            way: "jh 13;n;n;n;n;n;n;n;n;n",
            desc: "他是一位體格強健的壯年僧人，他身得虎背熊腰，全身似乎蘊含著無窮勁力。他身穿一襲白布黑邊袈裟，似乎身懷武藝。",
          },
          {
            jh: "少林寺",
            loc: "立雪亭",
            name: "清法比丘",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n",
            desc: "他是一位體格強健的壯年僧人，他生得虎背熊腰，全身似乎蘊含著無窮勁力。他身穿一襲白布黑邊袈裟，似乎身懷武藝。",
          },
          {
            jh: "少林寺",
            loc: "立雪亭",
            name: "清观比丘",
            name_tw: "清觀比丘",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n",
            desc: "他是一位體格強健的壯年僧人，他身得虎背熊腰，全身似乎蘊含著無窮勁力。他身穿一襲白布黑邊袈裟，似乎身懷武藝。",
          },
          { jh: "少林寺", loc: "立雪亭", name: "立雪亭", way: "jh 13;n;n;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "少林寺", loc: "立雪亭", name: "白眉老僧", way: "jh 13;n;n;n;n;n;n;n;n;n;n", desc: "少林寺高僧，武功修為無人能知。" },
          {
            jh: "少林寺",
            loc: "院落",
            name: "慧真尊者",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;n",
            desc: "他是一位兩鬢斑白的老僧，身穿一襲青布鑲邊袈裟。他身材略高，太陽穴微凸，雙目炯炯有神。",
          },
          {
            jh: "少林寺",
            loc: "院落",
            name: "慧虚尊者",
            name_tw: "慧虛尊者",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;n",
            desc: "他是一位兩鬢斑白的老僧，身穿一襲青布鑲邊袈裟。他身材略高，太陽穴微凸，雙目炯炯有神。",
          },
          { jh: "少林寺", loc: "院落", name: "青松", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n", desc: "天真無邪的小沙彌" },
          {
            jh: "少林寺",
            loc: "白衣殿",
            name: "冷幽兰",
            name_tw: "冷幽蘭",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;e",
            desc: "“吐秀喬林之下，盤根眾草之旁。雖無人而見賞，且得地而含芳。”她如同空谷幽蘭一般素雅靜謐，纖巧削細，面若凝脂，眉目如畫，神若秋水。",
          },
          {
            jh: "少林寺",
            loc: "千佛殿",
            name: "慧修尊者",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;n",
            desc: "他是一位兩鬢斑白的老僧，身穿一襲青布鑲邊袈裟。他身材略高，太陽穴微凸，雙目炯炯有神。",
          },
          { jh: "少林寺", loc: "千佛殿", name: "慧轮", name_tw: "慧輪", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;n", desc: "少林寺弟子，虛竹的師傅，武功修為平平。" },
          { jh: "少林寺", loc: "藥樓", name: "守药僧", name_tw: "守藥僧", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;n;e", desc: "一位守著少林藥樓的高僧。" },
          { jh: "少林寺", loc: "樹林", name: "砍柴僧", way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;n;w", desc: "一名年輕僧人，身穿灰色僧衣。" },
          {
            jh: "少林寺",
            loc: "樹林",
            name: "道相禅师",
            name_tw: "道相禪師",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;n;w",
            desc: "他是一位身材高大的中年僧人，兩臂粗壯，膀闊腰圓。他手持兵刃，身穿一襲灰布鑲邊袈裟，似乎有一身武藝。",
          },
          {
            jh: "少林寺",
            loc: "火龍洞",
            name: "达摩老祖",
            name_tw: "達摩老祖",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;n;w;n;get_silver",
            desc: "這是少林派的開山祖師達摩老祖他身材高大，看起來不知有多大年紀，目光如炬，神光湛然！",
          },
          {
            jh: "少林寺",
            loc: "地藏殿",
            name: "道一禅师",
            name_tw: "道一禪師",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;w",
            desc: "他是一位身材高大的中年僧人，兩臂粗壯，膀闊腰圓。他手持兵刃，身穿一襲灰布鑲邊袈裟，似乎有一身武藝。",
          },
          {
            jh: "少林寺",
            loc: "地藏殿",
            name: "玄难大师",
            name_tw: "玄難大師",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;w",
            desc: "他是一位白須白眉的老僧，身穿一襲銀絲棕黃袈裟。他身材極瘦，兩手更象雞爪一樣。他雙目微閉，一副沒精打采的模樣。",
          },
          {
            jh: "少林寺",
            loc: "地藏殿",
            name: "道正禅师",
            name_tw: "道正禪師",
            way: "jh 13;n;n;n;n;n;n;n;n;n;n;n;w",
            desc: "他是一位身材高大的中年僧人，兩臂粗壯，膀闊腰圓。他手持兵刃，身穿一襲灰布鑲邊袈裟，似乎有一身武藝。",
          },
          {
            jh: "少林寺",
            loc: "茶室",
            name: "叶十二娘",
            name_tw: "葉十二孃",
            way: "jh 13;n;n;n;n;n;n;n;n;n;shaolin25_op1",
            desc: "頗有姿色的中年女子，一雙大眼裡似乎隱藏著無窮愁苦、無限傷心。",
          },
          {
            jh: "少林寺",
            loc: "西廂房",
            name: "玄苦大师",
            name_tw: "玄苦大師",
            way: "jh 13;n;n;n;n;n;n;n;n;w",
            desc: "他是一位白須白眉的老僧，身穿一襲銀絲棕黃袈裟。他身材瘦高，臉上滿布皺紋，手臂處青筋綻露，似乎久經風霜。",
          },
          {
            jh: "少林寺",
            loc: "西廂房",
            name: "慧合尊者",
            way: "jh 13;n;n;n;n;n;n;n;n;w",
            desc: "他是一位兩鬢斑白的老僧，身穿一襲青布鑲邊袈裟。他身材略高，太陽穴微凸，雙目炯炯有神。",
          },
          {
            jh: "少林寺",
            loc: "西廂房",
            name: "慧洁尊者",
            name_tw: "慧潔尊者",
            way: "jh 13;n;n;n;n;n;n;n;n;w",
            desc: "他是一位兩鬢斑白的老僧，身穿一襲青布鑲邊袈裟。他身材略高，太陽穴微凸，雙目炯炯有神。",
          },
          { jh: "少林寺", loc: "藏經閣二樓", name: "灰衣僧", way: "jh 13;n;n;n;n;n;n;n;shaolin27_op1", desc: "一名灰衣僧人，灰布蒙面，一雙眼睛裡透著過人的精明。" },
          {
            jh: "少林寺",
            loc: "藏經閣二樓",
            name: "萧远山",
            name_tw: "蕭遠山",
            way: "jh 13;n;n;n;n;n;n;n;shaolin27_op1",
            desc: "契丹絕頂高手之一，曾隨漢人學武，契丹鷹師總教頭。",
          },
          {
            jh: "少林寺",
            loc: "藏經閣三樓",
            name: "守经僧人",
            name_tw: "守經僧人",
            way: "jh 13;n;n;n;n;n;n;n;shaolin27_op1;event_1_34680156",
            desc: "似乎常年鎮守於藏經閣，稀稀疏疏的幾根長須已然全白，正拿著經書仔細研究。",
          },
          {
            jh: "少林寺",
            loc: "西禪房",
            name: "盈盈",
            way: "jh 13;n;n;n;n;n;n;w",
            desc: "魔教任教主之女，有傾城之貌，閉月之姿，流轉星眸顧盼生輝，發絲隨意披散，慵懶不羈。",
          },
          {
            jh: "少林寺",
            loc: "鼓樓",
            name: "道尘禅师",
            name_tw: "道塵禪師",
            way: "jh 13;n;n;n;n;w",
            desc: "他是一位身材高大的中年僧人，兩臂粗壯，膀闊腰圓。他手持兵刃，身穿一襲灰布鑲邊袈裟，似乎有一身武藝。",
          },
          { jh: "少林寺", loc: "鼓樓", name: "狱卒", name_tw: "獄卒", way: "jh 13;n;n;n;n;w", desc: "一名看起來凶神惡煞的獄卒" },
          {
            jh: "少林寺",
            loc: "西碑林",
            name: "道成禅师",
            name_tw: "道成禪師",
            way: "jh 13;n;n;w",
            desc: "他是一位身材高大的中年僧人，兩臂粗壯，膀闊腰圓。他手持兵刃，身穿一襲灰布鑲邊袈裟，似乎有一身武藝。",
          },
          { jh: "少林寺", loc: "西碑林", name: "挑水僧", way: "jh 13;n;n;w", desc: "一名年輕僧人，身穿灰色僧衣。" },
          {
            jh: "少林寺",
            loc: "土路",
            name: "道品禅师",
            name_tw: "道品禪師",
            way: "jh 13;n;w",
            desc: "他是一位身材高大的中年僧人，兩臂粗壯，膀闊腰圓。他手持兵刃，身穿一襲灰布鑲邊袈裟，似乎有一身武藝。",
          },
          { jh: "少林寺", loc: "土路", name: "田鼠", way: "jh 13;n;w", desc: "一隻髒兮兮的田鼠，正在田間覓食。" },
          {
            jh: "少林寺",
            loc: "小院",
            name: "道觉禅师",
            name_tw: "道覺禪師",
            way: "jh 13;n;w;w",
            desc: "他是一位身材高大的中年僧人，兩臂粗壯，膀闊腰圓。他手持兵刃，身穿一襲灰布鑲邊袈裟，似乎有一身武藝。",
          },
          { jh: "少林寺", loc: "小院", name: "小孩", way: "jh 13;n;w;w", desc: "一個農家小孩，不知道在這裡幹什麼。" },
          { jh: "唐門", loc: "南津關", name: "高一毅", way: "jh 14;e", desc: "五代十國神槍王后人，英氣勃發，目含劍氣。" },
          { jh: "唐門", loc: "張憲祠", name: "张之岳", name_tw: "張之嶽", way: "jh 14;e;event_1_10831808;n", desc: "張憲之子，身形高大，威風凜凜" },
          { jh: "唐門", loc: "", name: "紫衣剑客", name_tw: "紫衣劍客", way: "", desc: "傲然而立，一臉嚴肅，好像是在瞪著你一樣。" },
          { jh: "唐門", loc: "", name: "独臂剑客", name_tw: "獨臂劍客", way: "", desc: "他一生守護在這，劍重要過他的生命。" },
          { jh: "唐門", loc: "", name: "青衣剑客", name_tw: "青衣劍客", way: "", desc: "一個風程僕僕的俠客。" },
          { jh: "唐門", loc: "", name: "黑衣剑客", name_tw: "黑衣劍客", way: "", desc: "一身黑衣，手持長劍，就像世外高人一樣。" },
          { jh: "唐門", loc: "", name: "无情剑客", name_tw: "無情劍客", way: "", desc: "神秘的江湖俠客，如今在這裡不知道作甚麼。" },
          {
            jh: "唐門",
            loc: "浣花劍碑",
            name: "程倾城",
            name_tw: "程傾城",
            way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e",
            desc: "曾是兩淮一代最有天賦的年輕劍客，在觀海莊追殺徽北劇盜之戰一劍破對方七人刀陣，自此“傾城劍客”之名響徹武林。",
          },
          {
            jh: "唐門",
            loc: "浣花劍池入口",
            name: "无名剑客",
            name_tw: "無名劍客",
            way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e",
            desc: "一位沒有名字的劍客，他很可能是曾經冠絕武林的劍術高手。",
          },
          {
            jh: "唐門",
            loc: "瑤光池",
            name: "默剑客",
            name_tw: "默劍客",
            way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e",
            desc: "這是一個沉默不語的劍客，數年來不曾說過一句話，專注地參悟著劍池絕學。",
          },
          {
            jh: "唐門",
            loc: "破軍劍閣",
            name: "竺霁庵",
            name_tw: "竺霽庵",
            way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n",
            desc: "湖竺家一門七進士，竺霽庵更是天子門生獨佔鰲頭，隨身喜攜帶一柄折扇。後因朝廷亂政心灰意冷，棄仕從武，更拜入少林成為俗家弟子。不足二十三歲便學盡少林絕學，武功臻至登峰造極之化境。後在燕北之地追兇時偶遇當時也是少年的鹿熙吟和謝麟玄，三人聯手血戰七日，白袍盡赤，屠盡太行十八夜騎。三人意氣相投，志同道合，結為異姓兄弟，在鹿謝二人引薦下，終成為浣花劍池這一代的破軍劍神。",
          },
          {
            jh: "唐門",
            loc: "武曲劍閣",
            name: "甄不恶",
            name_tw: "甄不惡",
            way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne",
            desc: "他的相貌看起來是那麼寧靜淡泊、眼睛眉毛都透著和氣，嘴角彎彎一看就象個善笑的人。他不象個俠客，倒象一個孤隱的君子。不瞭解的人總是懷疑清秀如竹的他怎麼能拿起手中那把重劍？然而，他確是浣花劍派最嫉惡如仇的劍神，武林奸邪最懼怕的名字，因為當有惡人聽到『甄不惡』被他輕輕從嘴裡吐出，那便往往是他聽到的最後三個字。",
          },
          {
            jh: "唐門",
            loc: "廉貞劍閣",
            name: "素厉铭",
            name_tw: "素厲銘",
            way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e",
            desc: "本是淮南漁家子弟，也並無至高的武學天賦，然其自幼喜觀察魚蟲鳥獸，竟不自覺地悟出了一套氣脈運轉的不上心法。後因此絕學獲難，被千夜旗餘孽追殺，欲奪其心法為己用。上代封山劍主出手相救，並送至廉貞劍神門下，專心修煉內功，最終竟憑藉其一顆不二之心，成就一代劍神。",
          },
          {
            jh: "唐門",
            loc: "七殺劍閣",
            name: "骆祺樱",
            name_tw: "駱祺櫻",
            way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se",
            desc: "塞外武學世家駱家家主的千金，自幼聰慧無比，年紀輕輕便習盡駱家絕學，十八歲通過劍池試煉，成為劍池數百年來最年輕的七殺劍神。她雙眸似水，卻帶著談談的冰冷，似乎能看透一切；四肢纖長，有仙子般脫俗氣質。她一襲白衣委地，滿頭青絲用蝴蝶流蘇淺淺綰起，雖峨眉淡掃，不施粉黛，卻仍然掩不住她的絕世容顏。",
          },
          {
            jh: "唐門",
            loc: "天梁劍閣",
            name: "谢麟玄",
            name_tw: "謝麟玄",
            way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;s;se",
            desc: "一襲青緞長衫，儒雅中透著英氣，好一個翩翩公子。書香門第之後，其劍學領悟大多出自絕世的琴譜，棋譜，和書畫，劍法狂放不羈，處處不合武學常理，卻又有著難以言喻的寫意和瀟灑。他擅長尋找對手的薄弱環節，猛然一擊，敵陣便土崩瓦解。",
          },
          {
            jh: "唐門",
            loc: "巨門劍閣",
            name: "祝公博",
            way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;s;se;e",
            desc: "曾經的湘西農家少年，全家遭遇匪禍，幸得上一代巨門劍神出手相救。劍神喜其非凡的武學天賦和不捨不棄的勤奮，收作關門弟子，最終得以承接巨門劍神衣缽。祝公博嫉惡如仇，公正不阿，視天道正義為世間唯一準則。",
          },
          {
            jh: "唐門",
            loc: "紫薇池",
            name: "黄衫少女",
            name_tw: "黃衫少女",
            way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;s;se;e;ne",
            desc: "身著鵝黃裙衫的少女，一席華貴的栗色秀發真達腰際，碧色的瞳孔隱隱透出神秘。她見你走過來，衝你輕輕一笑。",
          },
          {
            jh: "唐門",
            loc: "貪狼劍閣",
            name: "鹿熙吟",
            way: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e;e;e;n;ne;e;se;s;se;e;ne;n",
            desc: "浣花劍派當世的首席劍神，他身形挺拔，目若朗星。雖然已是中年，但歲月的雕琢更顯出他的氣度。身為天下第一劍派的首席，他待人和善，卻又不怒自威。百曉公見過鹿熙吟之後，驚為天人，三月不知如何下筆，最後據說在百曉圖錄貪狼劍神鹿熙吟那一頁，只留下了兩個字：不凡。他的家世出身是一個迷，從來無人知曉。",
          },
          { jh: "唐門", loc: "唐門牌坊", name: "唐门弟子", name_tw: "唐門弟子", way: "jh 14;w;n", desc: "這是唐門的弟子，不苟言笑。" },
          { jh: "唐門", loc: "唐門廚房", name: "唐门弟子", name_tw: "唐門弟子", way: "jh 14;w;n;n;n;e;s", desc: "這是唐門的弟子，不苟言笑。" },
          {
            jh: "唐門",
            loc: "唐門前院",
            name: "唐风",
            name_tw: "唐風",
            way: "jh 14;w;n;n",
            desc: "唐風是唐門一個神秘之人，世人對他知之甚少。他在唐門默默地傳授武藝，極少說話。",
          },
          { jh: "唐門", loc: "狹長小道", name: "唐看", way: "jh 14;w;n;n;n", desc: "這是嫡系死士之一，一身的功夫卻是不凡。" },
          { jh: "唐門", loc: "練武廣場", name: "黄色唐门弟子", name_tw: "黃色唐門弟子", way: "jh 14;w;n;n;n;e;e;n", desc: "" },
          { jh: "唐門", loc: "練武廣場", name: "唐健", way: "jh 14;w;n;n;n;e;e;n", desc: "他身懷絕技，心氣也甚高。" },
          { jh: "唐門", loc: "練武廣場", name: "(黄色)唐门弟子", name_tw: "(黃色)唐門弟子", way: "jh 14;w;n;n;n;e;e;n", desc: "這是唐門的弟子，不苟言笑。" },
          { jh: "唐門", loc: "授藝亭", name: "唐舌", way: "jh 14;w;n;n;n;e;e;n;e", desc: "這是嫡系死士之一，一身的功夫卻是不凡。用毒高手。" },
          { jh: "唐門", loc: "後院", name: "唐情", way: "jh 14;w;n;n;n;e;e;n;n", desc: "一個小女孩，十分可愛。" },
          { jh: "唐門", loc: "後院", name: "唐刚", name_tw: "唐剛", way: "jh 14;w;n;n;n;e;e;n;n", desc: "一個尚未成年的小男孩，但也已經開始學習唐門的武藝。" },
          {
            jh: "唐門",
            loc: "地室",
            name: "欧阳敏",
            name_tw: "歐陽敏",
            way: "jh 14;w;n;n;n;e;e;n;n;ask tangmen_tangmei;ask tangmen_tangmei;e;唐門:拜箭亭^兵器室;n;n",
            desc: "一個老婦人，眼睛中射出道道精光，一看就是武藝高強之人。",
          },
          { jh: "唐門", loc: "會客室", name: "方媃", way: "jh 14;w;n;n;n;n", desc: "一個美麗的中年婦女，使得一手好暗器。" },
          { jh: "唐門", loc: "會客室", name: "唐怒", way: "jh 14;w;n;n;n;n", desc: "唐門門主，在江湖中地位很高。" },
          { jh: "唐門", loc: "東側房", name: "唐鹤", name_tw: "唐鶴", way: "jh 14;w;n;n;n;w;s", desc: "唐門中的高層，野心很大，一直想將唐門稱霸武林。" },
          { jh: "唐門", loc: "唐鏢臥室", name: "唐镖", name_tw: "唐鏢", way: "jh 14;w;n;n;n;w;w;s", desc: "唐門中所有的絕門鏢法，他都會用。" },
          { jh: "唐門", loc: "唐芳臥室", name: "唐芳", way: "jh 14;w;n;n;n;w;w;w;n", desc: "雖然是一個少女，但武藝已達精進之境界了。" },
          { jh: "唐門", loc: "唐緣臥室", name: "唐缘", name_tw: "唐緣", way: "jh 14;w;n;n;n;w;w;w;s", desc: "人如其名，雖然年幼，但已是能看出美人胚子了。" },
          { jh: "青城山", loc: "練武場", name: "白衣镖师", name_tw: "白衣鏢師", way: "jh 15;s;s;s;w;w;s;s", desc: "這個鏢師穿著一身白衣。" },
          { jh: "青城山", loc: "青城大門", name: "侯老大", way: "jh 15;n;nw;w;nw;w;s;s", desc: "他就是「英雄豪傑，青城四秀」之一，武功也遠高同門。" },
          { jh: "青城山", loc: "福州大街", name: "福州捕快", way: "jh 15;s;s;s;s;s", desc: "福州的捕快，整天懶懶散散，不務正業。" },
          { jh: "青城山", loc: "福州南門", name: "童泽", name_tw: "童澤", way: "jh 15;s;s;s;s;s;s", desc: "一個青年人，眼神有悲傷、亦有仇恨。" },
          { jh: "青城山", loc: "石拱橋", name: "童隆", way: "jh 15;s;s;s;s;s;s;sw", desc: "一個眼神兇惡的老頭，身材有點佝僂。" },
          { jh: "青城山", loc: "", name: "林老镖头", name_tw: "林老鏢頭", way: ".靠謎題飛", desc: "他就是「福武鏢局」的總鏢頭。" },
          { jh: "青城山", loc: "北郊", name: "海公公", way: "jh 15", desc: "海公公是皇帝身邊的紅人，不知為什麼在此？" },
          { jh: "青城山", loc: "小徑", name: "游方郎中", name_tw: "遊方郎中", way: "jh 15;n", desc: "一個到處販賣藥材的赤腳醫生。" },
          {
            jh: "青城山",
            loc: "龍晶石洞",
            name: "孽龙之灵",
            name_tw: "孽龍之靈",
            way: "jh 15;n;nw;w;nw;n;event_1_14401179",
            desc: "當年為害岷水的孽龍，為李冰父子收服，魂魄不散，凝聚於此，看守洞內龍魄。",
          },
          { jh: "青城山", loc: "龍晶石洞", name: "孽龙分身", name_tw: "孽龍分身", way: "jh 15;n;nw;w;nw;n;event_1_14401179", desc: "孽龍分身，不可小視。" },
          { jh: "青城山", loc: "龍晶石洞", name: "暗甲盟主", way: "jh 15;n;nw;w;nw;n;event_1_14401179;event_1_80293122;n;n", desc: "暗誓盟巴蜀據點的盟主。" },
          {
            jh: "青城山",
            loc: "龍晶石洞",
            name: "暗甲将领",
            name_tw: "暗甲將領",
            way: "jh 15;n;nw;w;nw;n;event_1_14401179;event_1_80293122;n;n",
            desc: "一個風程僕僕的俠客。",
          },
          { jh: "青城山", loc: "青城大門", name: "青城弟子", way: "jh 15;n;nw;w;nw;w;s;s", desc: "青城派的弟子，年紀剛過二十，武藝不錯，資質上乘。" },
          { jh: "青城山", loc: "青城大門", name: "严月青", name_tw: "嚴月青", way: "jh 15;n;nw;w;nw;w;s;s", desc: "他就是「英雄豪傑，青城四秀」之一，武功也遠高同門。" },
          { jh: "青城山", loc: "青城大門", name: "青城派弟子", way: "jh 15;n;nw;w;nw;w;s;s", desc: "青城派的弟子，年紀剛過二十，武藝還過得去。" },
          { jh: "青城山", loc: "解劍石", name: "申月富", way: "jh 15;n;nw;w;nw;w;s;s;s", desc: "他就是「英雄豪傑，青城四秀」之一，武功也遠高同門。" },
          { jh: "青城山", loc: "演武堂", name: "吉人英", way: "jh 15;n;nw;w;nw;w;s;s;s;;kill qingcheng_renjie;w;w", desc: "他就是和申人俊焦孟不離的吉人通。" },
          {
            jh: "青城山",
            loc: "小室",
            name: "贾老二",
            name_tw: "賈老二",
            name_new: "孟月城",
            way: "jh 15;n;nw;w;nw;w;s;s;s;;kill qingcheng_renjie;w;w;n",
            desc: "他就是「青城派」中最為同門不齒、最下達的傢伙。",
          },
          {
            jh: "青城山",
            loc: "松風觀",
            name: "余大掌门",
            name_tw: "餘大掌門",
            name_new: "呂朝陽",
            way: "jh 15;n;nw;w;nw;w;s;s;s;;kill qingcheng_renjie;w;w;w",
            desc: "青城派十八代掌門人",
          },
          {
            jh: "青城山",
            loc: "青城走廊",
            name: "黄袍老道",
            name_tw: "黃袍老道",
            way: "jh 15;n;nw;w;nw;w;s;s;s;;kill qingcheng_renjie;w;w;w;n",
            desc: "一個穿著黃色道袍的老道士。",
          },
          { jh: "青城山", loc: "青城走廊", name: "青袍老道", way: "jh 15;n;nw;w;nw;w;s;s;s;;kill qingcheng_renjie;w;w;w;n", desc: "一個穿著青色道袍的老道士。" },
          {
            jh: "青城山",
            loc: "青城山走廊",
            name: "于老三",
            name_tw: "於老三",
            way: "jh 15;n;nw;w;nw;w;s;s;s;;kill qingcheng_renjie;w;w;w;n;w",
            desc: "他就是「英雄豪傑，青城四秀」之一，武功也遠高同門。",
          },
          { jh: "青城山", loc: "義莊", name: "仵作", way: "jh 15;s;ne", desc: "這是福州城外的一個仵作，專門檢驗命案死屍。" },
          { jh: "青城山", loc: "福州大街", name: "恶少", name_tw: "惡少", way: "jh 15;s;s", desc: "這是福州城中人見人惡的惡少，最好別惹。" },
          { jh: "青城山", loc: "福州大街", name: "仆人", name_tw: "僕人", way: "jh 15;s;s", desc: "惡少帶著這個僕人，可是威風得緊的。" },
          { jh: "青城山", loc: "小肉鋪", name: "屠夫", way: "jh 15;s;s;e", desc: "一個賣肉的屠夫。" },
          { jh: "青城山", loc: "四季花店", name: "小甜", way: "jh 15;s;s;s;e", desc: "花店中賣花的姑娘，花襯人臉，果然美不勝收。" },
          { jh: "青城山", loc: "書院", name: "读千里", name_tw: "讀千里", way: "jh 15;s;s;s;s;e", desc: "此人學富五車，搖頭晃腦，只和人談史論經。" },
          { jh: "青城山", loc: "福州官衙", name: "福州府尹", way: "jh 15;s;s;s;s;s;e", desc: "此人官架子很大。" },
          {
            jh: "青城山",
            loc: "劍廬",
            name: "背剑老人",
            name_tw: "背劍老人",
            way: "jh 15;s;s;s;s;s;s;s;s;s;e;s",
            desc: "揹著一把普通的劍，神態自若，似乎有一股劍勢與圍於週身，退隱江湖幾十年，如今沉醉於花道。",
          },
          { jh: "青城山", loc: "小河邊", name: "木道神", name_new: "林長老", way: "jh 15;s;s;s;s;s;s;w", desc: "他是青城山的祖師級人物了，年紀雖大，但看不出歲月滄桑。" },
          { jh: "青城山", loc: "武器店", name: "兵器贩子", name_tw: "兵器販子", way: "jh 15;s;s;s;s;w", desc: "一個販賣兵器的男子，看不出有什麼來歷。" },
          { jh: "青城山", loc: "鏢局車站", name: "阿美", way: "jh 15;s;s;s;w;w;n", desc: "此人三十來歲，專門福州駕駛馬車。" },
          { jh: "青城山", loc: "練武場", name: "红衣镖师", name_tw: "紅衣鏢師", way: "jh 15;s;s;s;w;w;s;s", desc: "這個鏢師穿著一身紅衣。" },
          { jh: "青城山", loc: "練武場", name: "黄衣镖师", name_tw: "黃衣鏢師", way: "jh 15;s;s;s;w;w;s;s", desc: "這個鏢師穿著一身黃衣。" },
          { jh: "青城山", loc: "練武場", name: "镖局弟子", name_tw: "鏢局弟子", way: "jh 15;s;s;s;w;w;s;s", desc: "福威鏢局的弟子。" },
          { jh: "青城山", loc: "內宅", name: "林师弟", name_tw: "林師弟", way: "jh 15;s;s;s;w;w;w;w;w;n", desc: "林師弟是華山眾最小的一個弟子。" },
          { jh: "青城山", loc: "無醉酒家", name: "店小二", way: "jh 15;s;s;w", desc: "這個店小二忙忙碌碌，招待客人手腳利索。" },
          { jh: "青城山", loc: "無醉酒家", name: "酒店老板", name_tw: "酒店老闆", way: "jh 15;s;s;w", desc: "酒店老闆是福州城有名的富人。" },
          { jh: "青城山", loc: "酒家二樓", name: "女侍", way: "jh 15;s;s;w;n", desc: "這是一個女店小二，在福州城內，可是獨一無二哦。" },
          { jh: "青城山", loc: "酒家二樓", name: "酒店女老板", name_tw: "酒店女老闆", way: "jh 15;s;s;w;n", desc: "一個漂亮的女老闆，體格風騷。" },
          {
            jh: "逍遙林",
            loc: "石室",
            name: "逍遥祖师",
            name_tw: "逍遙祖師",
            way: "jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;event_1_38333366;place?石室",
            desc: "他就是逍遙派開山祖師、但是因為逍遙派屬於一個在江湖中的秘密教派，所以他在江湖中不是很多人知道，但其實他的功夫卻是。。。。他年滿七旬，滿臉紅光，須眉皆白。",
          },
          {
            jh: "逍遙林",
            loc: "林間小道",
            name: "吴统领",
            name_tw: "吳統領",
            way: "jh 16;s;s;s;s;e;e;s;w",
            desc: "他雅擅丹青，山水人物，翎毛花卉，並皆精巧。拜入師門之前，在大宋朝廷做過領軍將軍之職，因此大家便叫他吳統領。",
          },
          { jh: "逍遙林", loc: "林間小道", name: "蒙面人", way: "jh 16;s;s;s;s;e;e;s;w", desc: "一個蒙著面部，身穿黑色夜行衣服的神秘人。" },
          { jh: "逍遙林", loc: "石屋", name: "范棋癡", name_tw: "範棋癡", way: "jh 16;s;s;s;s;e;e;s;w;n", desc: "他師從聰辯先生，學的是圍棋，當今天下，少有敵手" },
          {
            jh: "逍遙林",
            loc: "工匠屋",
            name: "冯巧匠",
            name_tw: "馮巧匠",
            way: "jh 16;s;s;s;s;e;e;s;w;s;s",
            desc: "據說他就是魯班的後人，本來是木匠出身。他在精於土木工藝之學，當代的第一巧匠，設計機關的能手。",
          },
          {
            jh: "逍遙林",
            loc: "青草坪",
            name: "苏先生",
            name_tw: "蘇先生",
            way: "jh 16;s;s;s;s;e;e;s;w;w",
            desc: "此人就是蘇先生，據說他能言善辯，是一個武林中的智者，而他的武功也是無人能知。",
          },
          {
            jh: "逍遙林",
            loc: "林間小道",
            name: "石师妹",
            name_tw: "石師妹",
            way: "jh 16;s;s;s;s;e;e;s;w;w;n",
            desc: "師妹，精於蒔花，天下她精於蒔花，天下的奇花異卉，一經她的培植，無不欣欣向榮。",
          },
          { jh: "逍遙林", loc: "小木屋", name: "薛神医", name_tw: "薛神醫", way: "jh 16;s;s;s;s;e;e;s;w;w;n;n", desc: "據說他精通醫理，可以起死回生。" },
          {
            jh: "逍遙林",
            loc: "木屋",
            name: "康琴癫",
            name_tw: "康琴癲",
            way: "jh 16;s;s;s;s;e;e;s;w;w;s;s",
            desc: "只見他高額凸顙，容貌奇古，笑眯眯的臉色極為和謨，手中抱著一具瑤琴。",
          },
          {
            jh: "逍遙林",
            loc: "林間小道",
            name: "苟书癡",
            name_tw: "苟書癡",
            name_new: "張通鑑",
            way: "jh 16;s;s;s;s;e;e;s;w;w;w",
            desc: "他看上去也是幾十歲的人了，性好讀書，諸子百家，無所不窺，是一位極有學問的宿儒，卻是純然一個書呆子的模樣。",
          },
          {
            jh: "逍遙林",
            loc: "酒家",
            name: "李唱戏",
            name_tw: "李唱戲",
            way: "jh 16;s;s;s;s;e;e;s;w;w;w;w;s",
            desc: "他看起來青面獠牙，紅發綠須，形狀可怕之極，直是個妖怪，身穿一件亮光閃閃的錦袍。他一生沉迷扮演戲文，瘋瘋顛顛，於這武學一道，不免疏忽了。",
          },
          {
            jh: "逍遙林",
            loc: "石室",
            name: "天山姥姥",
            name_new: "童冰煙",
            way: "jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w;event_1_57688376;n;n;e;n;event_1_88625473;event_1_82116250;event_1_90680562;event_1_38586637",
            desc: "她乍一看似乎是個十七八歲的女子，可神情卻是老氣橫秋。雙目如電，炯炯有神，向你瞧來時，自有一股淩人的威嚴。",
          },
          { jh: "逍遙林", loc: "馬幫駐地", name: "常一恶", name_tw: "常一惡", way: "jh 16;s;s;s;s;e;n;e;event_1_56806815", desc: "馬幫幫主，總管事，喜歡錢財的老狐狸。" },
          {
            jh: "開封",
            loc: "禦街南",
            name: "白玉堂",
            way: "jh 17;n",
            desc: "金華人氏，因少年華美，氣宇不凡，文武雙全，故人稱'錦毛鼠'。他武藝高強、聰明特達、性情高傲、正邪分明、扶危濟困、行俠仗義、渾身是膽、為國為民，後被宋仁宗讚賞。",
          },
          { jh: "開封", loc: "沿河大街", name: "玄衣少年", way: "jh 17;n;n;e;e", desc: "一身玄衣的一個少年，似乎對開封的繁華十分嚮往。" },
          {
            jh: "開封",
            loc: "禦碑亭",
            name: "七煞堂总舵主",
            name_tw: "七煞堂總舵主",
            way: "jh 17;e;s;s;s;e;kaifeng_yuwangtai23_op1",
            desc: "這是七煞堂總舵主，看起道貌岸然，但眼神藏有極深的戾氣。",
          },
          {
            jh: "開封",
            loc: "禦碑亭",
            name: "七煞堂护法",
            name_tw: "七煞堂護法",
            way: "jh 17;e;s;s;s;e;kaifeng_yuwangtai23_op1",
            desc: "武功高強的護衛，乃總舵主的貼身心腹。",
          },
          { jh: "開封", loc: "貢院", name: "张老知府", name_tw: "張老知府", way: "jh 17;n;n;n;e", desc: "開封的前任知府大人，如今雖退休多年，但仍然憂國憂民。" },
          { jh: "開封", loc: "朱雀門", name: "骆驼", name_tw: "駱駝", way: "jh 17", desc: "這是一條看起來有些疲憊的駱駝。" },
          { jh: "開封", loc: "官道", name: "官兵", way: "jh 17;e", desc: "這是一名官兵，雖然武藝不能跟武林人士比，但他們靠的是人多力量大。" },
          { jh: "開封", loc: "樹林", name: "七煞堂弟子", way: "jh 17;e;s", desc: "江湖上臭名昭著的七煞堂弟子，最近經常聚集在禹王台，不知道有什麼陰謀。" },
          { jh: "開封", loc: "菊園小徑", name: "七煞堂打手", way: "jh 17;e;s;s", desc: "七煞堂打手，還有點功夫的。" },
          { jh: "開封", loc: "前院", name: "七煞堂护卫", name_tw: "七煞堂護衛", way: "jh 17;e;s;s;s;s", desc: "七煞堂護衛，似乎有一身武藝。" },
          { jh: "開封", loc: "禹王廟", name: "七煞堂堂主", way: "jh 17;e;s;s;s;s;s", desc: "這是七煞堂堂主，看起來一表人才，不過據說手段極為殘忍。" },
          { jh: "開封", loc: "羊腸小道", name: "毒蛇", way: "jh 17;event_1_97081006", desc: "一條劇毒的毒蛇。" },
          { jh: "開封", loc: "野豬林入口", name: "野猪", name_tw: "野豬", way: "jh 17;event_1_97081006;s", desc: "一隻四肢強健的野豬，看起來很餓。" },
          { jh: "開封", loc: "荊棘叢", name: "黑鬃野猪", name_tw: "黑鬃野豬", way: "jh 17;event_1_97081006;s;s;s;s", desc: "這是一直體型較大的野豬，一身黑色鬃毛。" },
          {
            jh: "開封",
            loc: "野豬窩",
            name: "野猪王",
            name_tw: "野豬王",
            way: "jh 17;event_1_97081006;s;s;s;s;s",
            desc: "這是野豬比普通野豬體型大了近一倍，一身棕褐色鬃毛豎立著，看起來很兇殘。",
          },
          { jh: "開封", loc: "雜草小路", name: "野猪", name_tw: "野豬", way: "jh 17;event_1_97081006;s;s;s;s;s;w", desc: "一隻四肢強健的野豬，看起來很餓。" },
          {
            jh: "開封",
            loc: "破爛小屋",
            name: "白面人",
            name_tw: "白麵人",
            way: "jh 17;event_1_97081006;s;s;s;s;s;w;kaifeng_yezhulin05_op1",
            desc: "一個套著白色長袍，帶著白色面罩的人，猶如鬼魅，讓人見之心寒。",
          },
          {
            jh: "開封",
            loc: "木屋據點",
            name: "鹤发老人",
            name_tw: "鶴發老人",
            way: "jh 17;event_1_97081006;s;s;s;s;s;w;w",
            desc: "此人愚鈍好酒，但武功卓絕，乃是一代武林高手。經常與鹿杖老人同闖武林。",
          },
          {
            jh: "開封",
            loc: "木屋據點",
            name: "鹿杖老人",
            way: "jh 17;event_1_97081006;s;s;s;s;s;w;w",
            desc: "此人好色奸詐，但武功卓絕，乃是一代武林高手。經常與鶴發老人同闖武林。",
          },
          { jh: "開封", loc: "禦街南", name: "灯笼小贩", name_tw: "燈籠小販", way: "jh 17;n", desc: "這是一個勤勞樸實的手藝人，據說他做的燈籠明亮又防風。" },
          { jh: "開封", loc: "禦街南", name: "小男孩", way: "jh 17;n", desc: "一個衣衫襤褸，面有飢色的10多歲小男孩，正跪在大堂前，眼裡佈滿了絕望！" },
          { jh: "開封", loc: "開封府", name: "欧阳春", name_tw: "歐陽春", way: "jh 17;n;e", desc: "這是大名鼎鼎的北俠。" },
          { jh: "開封", loc: "開封府", name: "展昭", way: "jh 17;n;e", desc: "這就是大名鼎鼎的南俠。" },
          {
            jh: "開封",
            loc: "開封府大堂",
            name: "包拯",
            way: "jh 17;n;e;s",
            desc: "他就是朝中的龍圖大學士包丞相。只見他面色黝黑，相貌清奇，氣度不凡。讓你不由自主，好生敬仰。",
          },
          { jh: "開封", loc: "州橋", name: "皮货商", name_tw: "皮貨商", way: "jh 17;n;n", desc: "這是一位皮貨商，他自己也是滿身皮裘。" },
          { jh: "開封", loc: "汴河大街東", name: "武官", way: "jh 17;n;n;e", desc: "這名武官看起來養尊處優，不知道能不能出征打仗。" },
          { jh: "開封", loc: "沿河大街", name: "菜贩子", name_tw: "菜販子", way: "jh 17;n;n;e;e", desc: "一個老實巴交的農民，賣些新鮮的蔬菜" },
          {
            jh: "開封",
            loc: "汴河碼頭",
            name: "码头工人",
            name_tw: "碼頭工人",
            way: "jh 17;n;n;e;e;n",
            desc: "這是一名膀大腰圓的碼頭工人，也許不會什麼招式，但力氣肯定是有的。",
          },
          {
            jh: "開封",
            loc: "客船",
            name: "落魄书生",
            name_tw: "落魄書生",
            way: "jh 17;n;n;e;e;n;get_silver",
            desc: "一名衣衫襤褸的書生，右手搖著一柄破扇，面色焦黃，兩眼無神。",
          },
          { jh: "開封", loc: "貨運棧", name: "船老大", way: "jh 17;n;n;e;e;n;n", desc: "看起來精明能幹的中年男子，堅毅的眼神讓人心生敬畏。" },
          { jh: "開封", loc: "王家紙馬店", name: "王老板", name_tw: "王老闆", way: "jh 17;n;n;e;e;s", desc: "王家紙馬店老闆，為人熱誠。" },
          { jh: "開封", loc: "石拱門", name: "高衙内", name_tw: "高衙內", way: "jh 17;n;n;e;s", desc: "這就是開封府內惡名遠揚的高衙內，專一愛調戲淫辱良家婦女。" },
          {
            jh: "開封",
            loc: "八寶琉璃殿",
            name: "护寺僧人",
            name_tw: "護寺僧人",
            way: "jh 17;n;n;e;s;s",
            desc: "他是一位身材高大的青年僧人，兩臂粗壯，膀闊腰圓。他手持兵刃，身穿一襲白布鑲邊袈裟，似乎有一身武藝。",
          },
          {
            jh: "開封",
            loc: "後院",
            name: "烧香老太",
            name_tw: "燒香老太",
            way: "jh 17;n;n;e;s;s;s",
            desc: "一個見佛燒香的老太太，花白的頭發鬆散的梳著發髻，滿是皺紋的臉上愁容密佈。",
          },
          { jh: "開封", loc: "明廊", name: "泼皮", name_tw: "潑皮", way: "jh 17;n;n;e;s;s;s;e", desc: "大相國寺附近的潑皮，常到菜園中偷菜。" },
          { jh: "開封", loc: "菜地", name: "老僧人", way: "jh 17;n;n;e;s;s;s;e;e", desc: "一個老朽的僧人，臉上滿是皺紋，眼睛都睜不開來了" },
          { jh: "開封", loc: "柴房", name: "烧火僧人", name_tw: "燒火僧人", way: "jh 17;n;n;e;s;s;s;e;s", desc: "一名專職在灶下燒火的僧人。" },
          {
            jh: "開封",
            loc: "竹林小徑",
            name: "张龙",
            name_tw: "張龍",
            way: "jh 17;n;n;e;s;s;s;s",
            desc: "這便是開封府霍霍有名的捕頭張龍，他身體強壯，看上去武功不錯。",
          },
          { jh: "開封", loc: "放生池", name: "孔大官人", way: "jh 17;n;n;e;s;s;s;s;w", desc: "開封府中的富戶，最近家中似乎有些變故。" },
          { jh: "開封", loc: "素齋廚", name: "素斋师傅", name_tw: "素齋師傅", way: "jh 17;n;n;e;s;s;s;w", desc: "在寺廟中燒飯的和尚。" },
          { jh: "開封", loc: "禦街北", name: "李四", way: "jh 17;n;n;n", desc: "他長得奸嘴猴腮的，一看就不像是個好人。" },
          { jh: "開封", loc: "貢院", name: "陈举人", name_tw: "陳舉人", way: "jh 17;n;n;n;e", desc: "看起來有些酸腐的書生，正在查看貢院佈告牌。" },
          {
            jh: "開封",
            loc: "西角樓大街",
            name: "流浪汉",
            name_tw: "流浪漢",
            way: "jh 17;n;n;n;n",
            desc: "這是一名看上去老實巴交的流浪漢，聽說他跟官府有交情，最好不要招惹。",
          },
          { jh: "開封", loc: "雅瓷軒", name: "富家弟子", way: "jh 17;n;n;n;n;e", desc: "一個白白胖胖的年輕人，一看就知道是嬌生慣養慣的富家子。" },
          { jh: "開封", loc: "天波門", name: "赵虎", name_tw: "趙虎", way: "jh 17;n;n;n;n;n", desc: "這便是開封府霍霍有名的捕頭趙虎，他身體強壯，看上去武功不錯。" },
          { jh: "開封", loc: "溪邊小路", name: "踏青妇人", name_tw: "踏青婦人", way: "jh 17;n;n;n;n;n;e", desc: "春天出來遊玩的婦人，略有姿色。" },
          { jh: "開封", loc: "瓦屋", name: "平夫人", way: "jh 17;n;n;n;n;n;e;n;n", desc: "方面大耳，眼睛深陷，臉上全無血色。" },
          { jh: "開封", loc: "柳樹林", name: "恶狗", name_tw: "惡狗", way: "jh 17;n;n;n;n;n;e;n;n;n", desc: "這是一條看家護院的惡狗。" },
          {
            jh: "開封",
            loc: "煉藥房",
            name: "平怪医",
            name_tw: "平怪醫",
            way: "jh 17;n;n;n;n;n;e;n;n;n;event_1_27702191",
            desc: "他身材矮胖，腦袋極大，生兩撇鼠須，搖頭晃腦，形相十分滑稽。",
          },
          {
            jh: "開封",
            loc: "天波府",
            name: "杨排风",
            name_tw: "楊排風",
            way: "jh 17;n;n;n;n;w",
            desc: "容貌俏麗，風姿綽約，自幼在天波楊門長大，性情爽直勇敢，平日裡常跟穆桂英練功習武，十八般武藝樣樣在行。曾被封為“徵西先鋒將軍”，大敗西夏國元帥殷奇。因為是燒火丫頭出身，且隨身武器是燒火棍，所以被宋仁宗封為“火帥”。又因為，民間稱讚其為“紅顏火帥”。",
          },
          { jh: "開封", loc: "天波府", name: "天波侍卫", name_tw: "天波侍衛", way: "jh 17;n;n;n;n;w", desc: "天波府侍衛，個個均是能征善戰的勇士！" },
          {
            jh: "開封",
            loc: "中院",
            name: "柴郡主",
            way: "jh 17;n;n;n;n;w;w;w",
            desc: "六郎之妻，為後週世宗柴榮之女，宋太祖趙匡胤敕封皇御妹金花郡主。一名巾幗英雄、女中豪傑，成為當時著名的楊門女將之一，有當時天下第一美女之稱。",
          },
          {
            jh: "開封",
            loc: "北院",
            name: "穆桂英",
            way: "jh 17;n;n;n;n;w;w;w;n;n",
            desc: "穆柯寨穆羽之女，有沉魚落雁之容，且武藝超群，巾幗不讓須眉。傳說有神女傳授神箭飛刀之術。因陣前與楊宗保交戰，穆桂英生擒宗保並招之成親，歸於楊家將之列，為楊門女將中的傑出人物。",
          },
          {
            jh: "開封",
            loc: "演兵場",
            name: "杨文姬",
            name_tw: "楊文姬",
            way: "jh 17;n;n;n;n;w;w;w;n;n;w",
            desc: "乃天波楊門么女。體態文秀儒雅、有驚鴻之貌，集萬千寵愛於一身，被楊門一族視為掌上明珠。其武學集楊門之大成，卻又脫胎於楊門自成一格，實屬武林中不可多得的才女。",
          },
          { jh: "開封", loc: "回廊", name: "侍女", way: "jh 17;n;n;n;n;w;w;w;s", desc: "一個豆蔻年華的小姑娘，看其身手似也是有一點武功底子的呢。" },
          {
            jh: "開封",
            loc: "天波碧潭",
            name: "佘太君",
            way: "jh 17;n;n;n;n;w;w;w;s;s;w",
            desc: "名將之女，自幼受其父兄武略的影響，青年時候就成為一名性機敏、善騎射，文武雙全的女將。她與普通的大家閨秀不同，她研習兵法，頗通將略，把戍邊御侵、保衛疆域、守護中原民眾為己任，協助父兄練兵把關，具備巾幗英雄的氣度。夫君邊關打仗，她在楊府內組織男女僕人丫環習武，僕人的武技和忠勇之氣個個都不亞於邊關的士兵。",
          },
          {
            jh: "開封",
            loc: "天波樓",
            name: "杨延昭",
            name_tw: "楊延昭",
            way: "jh 17;n;n;n;n;w;w;w;w",
            desc: "楊延昭是北宋抗遼名將楊業的長子，契丹人認為北斗七星中的第六顆主鎮幽燕北方，是他們的剋星，遼人將他看做是天上的六郎星宿下凡，故稱為楊六郎。",
          },
          { jh: "開封", loc: "汴河大街西", name: "新郎官", way: "jh 17;n;n;w", desc: "這是一名披著大紅花的新郎官，臉上喜氣洋洋。" },
          { jh: "開封", loc: "稻香居", name: "混混张三", name_tw: "混混張三", way: "jh 17;n;n;w;n", desc: "他長得奸嘴猴腮的，一看就不像是個好人。" },
          { jh: "開封", loc: "稻香居二樓", name: "铁翼", name_tw: "鐵翼", way: "jh 17;n;n;w;n;n", desc: "他是大旗門的元老。他剛正不阿，鐵骨諍諍。" },
          { jh: "開封", loc: "稻香居二樓", name: "刘财主", name_tw: "劉財主", way: "jh 17;n;n;w;n;n", desc: "開封府中的富戶，看起來腦滿腸肥，養尊處優。" },
          { jh: "開封", loc: "藥鋪", name: "赵大夫", name_tw: "趙大夫", way: "jh 17;n;w", desc: "趙大夫醫術高明，尤其善治婦科各種疑難雜症。" },
          { jh: "開封", loc: "郊外別院", name: "新娘", way: "jh 17;sw;nw", desc: "新郎官的未婚妻，被高衙內抓到此處。" },
          { jh: "開封", loc: "橋底密室", name: "耶律夷烈", way: "jh 17;sw;s;sw;nw;ne;event_1_38940168", desc: "遼德宗耶律大石之子，身材高大，滿面虯髯。" },
          { jh: "明教", loc: "鏈橋", name: "杨左使", name_tw: "楊左使", name_new: "梁風", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;n;n;n", desc: "明教光明左使。" },
          { jh: "明教", loc: "觀景台", name: "神秘女子", way: "jh 18;n;nw;n;n;w", desc: "這是一個女子" },
          {
            jh: "明教",
            loc: "盜洞",
            name: "蒙面人",
            way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;n;n;n;n;event_1_90080676;event_1_56007071;e;ne;n;nw",
            desc: "用厚厚面巾蒙著臉上的武士，看不清他的真面目。",
          },
          { jh: "明教", loc: "小村", name: "村民", way: "jh 18", desc: "這是村落裡的一個村名。" },
          { jh: "明教", loc: "屋子", name: "沧桑老人", name_tw: "滄桑老人", way: "jh 18;e", desc: "這是一個滿臉滄桑的老人。" },
          { jh: "明教", loc: "巨石", name: "明教小圣使", name_tw: "明教小聖使", way: "jh 18;n;nw;n;n;n;n;n", desc: "他是一個明教小聖使。" },
          { jh: "明教", loc: "巨木旗大廳", name: "闻旗使", name_tw: "聞旗使", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n", desc: "他是明教巨林旗掌旗使。" },
          {
            jh: "明教",
            loc: "明教",
            name: "韦蝠王",
            name_tw: "韋蝠王",
            name_new: "季燕青",
            way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n",
            desc: "明教四大護法之一，傳說喜好吸人鮮血。",
          },
          { jh: "明教", loc: "大空地", name: "彭散玉", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n", desc: "明教五散仙之一。" },
          { jh: "明教", loc: "洪水旗大廳", name: "唐旗使", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e", desc: "他是明教白水旗掌旗使。" },
          { jh: "明教", loc: "大空地", name: "周散仙", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;n", desc: "明教五散仙之一" },
          { jh: "明教", loc: "銳金旗", name: "庄旗使", name_tw: "莊旗使", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;n;n", desc: "明教耀金旗掌旗使。" },
          {
            jh: "明教",
            loc: "大空地",
            name: "冷步水",
            name_new: "冷臉先生",
            way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n",
            desc: "他是明教五散仙之一。在他僵硬的面孔上看不出一點表情。",
          },
          { jh: "明教", loc: "遇水堂", name: "张散仙", name_tw: "張散仙", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;e", desc: "明教五散仙之一。長於風雅之做。" },
          { jh: "明教", loc: "明教偏殿", name: "冷文臻", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n", desc: "冷步水的侄子，較為自傲，且要面子。" },
          {
            jh: "明教",
            loc: "列英堂",
            name: "殷鹰王",
            name_tw: "殷鷹王",
            way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n",
            desc: "他就是赫赫有名的白眉鷹王，張大教主的外公，曾因不滿明教的混亂，獨自創立了飛鷹教，自從其外孫成為教主之後，便迴歸了明教",
          },
          {
            jh: "明教",
            loc: "列英堂",
            name: "明教教众",
            name_tw: "明教教眾",
            way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n",
            desc: "他是身材矮小，兩臂粗壯，膀闊腰圓。他手持兵刃，身穿一黑色聖衣，似乎有一身武藝。",
          },
          {
            jh: "明教",
            loc: "獅王殿",
            name: "谢狮王",
            name_tw: "謝獅王",
            name_new: "仇畢烈",
            way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;e",
            desc: "他就是赫赫有名的金發獅王，張大教主的義父，生性耿直，只因滿心仇恨和脾氣暴躁而做下了許多憾事。",
          },
          {
            jh: "明教",
            loc: "明教大殿",
            name: "张教主",
            name_tw: "張教主",
            name_new: "九陽君",
            way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;n",
            desc: "年方二十多歲的年輕人。明教現今正統教主，武功集各家之長最全面，修為當世之罕見。",
          },
          { jh: "明教", loc: "聖火橋", name: "范右使", name_tw: "範右使", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;n;n", desc: "明教光明右使。" },
          {
            jh: "明教",
            loc: "黑金橋",
            name: "小昭",
            way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;n;n;n",
            desc: "她雙目湛湛有神，修眉端鼻，頰邊微現梨渦，真是秀美無倫，只是年紀幼小，身材尚未長成，雖然容貌絕麗，卻掩不住容顏中的稚氣。",
          },
          {
            jh: "明教",
            loc: "龍王殿",
            name: "黛龙王",
            name_tw: "黛龍王",
            way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w",
            desc: "她就是武林中盛傳的紫衣龍王，她膚如凝脂，杏眼桃腮，容光照人，端麗難言。雖然已年過中年，但仍風姿嫣然。",
          },
          {
            jh: "明教",
            loc: "昆崙墟",
            name: "九幽毒魔",
            way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw;nw;event_1_70957287",
            desc: "千夜旗至尊九長老之一，看似一個面容慈祥的白發老人，鶴發童顏，雙手隱隱的黑霧卻顯露了他不世的毒功！",
          },
          {
            jh: "明教",
            loc: "毒池地牢",
            name: "青衣女孩",
            way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw;nw;event_1_70957287;event_1_39374335;;kill?九幽毒童;event_1_2077333",
            desc: "一個身著青衣的小女孩，被抓來此出準備煉毒之用，雖能感覺到恐懼，但雙眼仍透出不屈的頑強。",
          },
          {
            jh: "明教",
            loc: "九幽毒池",
            name: "九幽毒童",
            way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw;nw;event_1_70957287;event_1_39374335",
            desc: "負責管理九幽毒池的童子們，個個面色陰沉，殘忍好殺。",
          },
          {
            jh: "明教",
            loc: "鐵木長廊",
            name: "明教小喽啰",
            name_tw: "明教小嘍囉",
            way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;w",
            desc: "明教的一個小嘍囉，看起來有點猥瑣，而且還有點陰險。",
          },
          { jh: "明教", loc: "烈火旗大廳", name: "辛旗使", way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;w;w", desc: "他是明教烈焰旗掌旗使。" },
          {
            jh: "明教",
            loc: "大空地",
            name: "布袋大师",
            name_tw: "布袋大師",
            way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;w;w;n",
            desc: "他是明教五散仙之一的布袋大師說不得，腰間歪歪斜斜的掛著幾支布袋。",
          },
          {
            jh: "明教",
            loc: "厚土旗大廳",
            name: "颜旗使",
            name_tw: "顏旗使",
            name_new: "楊塬",
            way: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;w;w;n;n",
            desc: "他是明教深土旗掌旗使。",
          },
          { jh: "明教", loc: "民居", name: "村妇", name_tw: "村婦", way: "jh 18;w", desc: "一個村婦。" },
          { jh: "明教", loc: "臥房", name: "小男孩", way: "jh 18;w;n", desc: "這是個七八歲的小男孩。" },
          { jh: "明教", loc: "臥房", name: "老太婆", way: "jh 18;w;n", desc: "一個滿臉皺紋的老太婆。" },
          { jh: "全真教", loc: "終南石階", name: "终南山游客", name_tw: "終南山遊客", way: "jh 19;s;s;s;sw;s", desc: "一個來終南山遊玩的遊客。" },
          { jh: "全真教", loc: "終南石階", name: "男童", way: "jh 19;s;s;s;sw;s;e;n;nw", desc: "這是一個男童。" },
          { jh: "全真教", loc: "終南石階", name: "全真女弟子", way: "jh 19;s;s;s;sw;s;e;n;nw;n", desc: "這是一個女道姑。" },
          { jh: "全真教", loc: "全真教大門", name: "迎客道长", name_tw: "迎客道長", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n", desc: "他是全真教內負責接待客人的道士。" },
          { jh: "全真教", loc: "萬物堂", name: "程遥伽", name_tw: "程遙伽", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n", desc: "她長相清秀端莊。" },
          {
            jh: "全真教",
            loc: "天心殿",
            name: "尹志平",
            way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n",
            desc: "他是丘處機的得意大弟子尹志平，他粗眉大眼，長的有些英雄氣概，在全真教第三代弟子中算得上年輕有為。身材不高，眉宇間似乎有一股憂鬱之色。長的倒是長眉俊目，容貌秀雅，面白無須，可惜朱雀和玄武稍有不和。",
          },
          { jh: "全真教", loc: "天心殿", name: "练功弟子", name_tw: "練功弟子", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n", desc: "這是全真教的練功弟子。" },
          {
            jh: "全真教",
            loc: "後堂三進",
            name: "孙不二",
            name_tw: "孫不二",
            way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;e;e;e",
            desc: "她就是全真教二代弟子中唯一的女弟子孫不二孫真人。她本是馬鈺入道前的妻子，道袍上繡著一個骷髏頭。",
          },
          { jh: "全真教", loc: "柴房", name: "柴火道士", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;e;e;n;n", desc: "一個負責柴火的道士。" },
          {
            jh: "全真教",
            loc: "靜修室",
            name: "马钰",
            name_tw: "馬鈺",
            way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n",
            desc: "他就是王重陽的大弟子，全真七子之首，丹陽子馬鈺馬真人。他慈眉善目，和藹可親，正笑著看著你。",
          },
          {
            jh: "全真教",
            loc: "小花園",
            name: "丘处机",
            name_tw: "丘處機",
            way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n",
            desc: "他就是江湖上人稱‘長春子’的丘處機丘真人，他方面大耳，滿面紅光，劍目圓睜，雙眉如刀，相貌威嚴，平生疾惡如仇。",
          },
          { jh: "全真教", loc: "勤習堂", name: "老道长", name_tw: "老道長", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;e", desc: "這是一個年老的道人。" },
          {
            jh: "全真教",
            loc: "小花園",
            name: "王处一",
            name_tw: "王處一",
            way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n",
            desc: "他就是全真七子之五王處一王真人。他身材修長，服飾整潔，三綹黑須飄在胸前，神態瀟灑。",
          },
          { jh: "全真教", loc: "小花園", name: "鹿道清", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;e", desc: "他是全真教尹志平門下第四代弟子" },
          { jh: "全真教", loc: "小花園", name: "青年弟子", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n", desc: "一個風程僕僕的俠客。" },
          {
            jh: "全真教",
            loc: "容物堂",
            name: "谭处端",
            name_tw: "譚處端",
            way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;e",
            desc: "他就是全真次徒譚處端譚真人，他身材魁梧，濃眉大眼，嗓音洪亮，拜重陽真人為師前本是鐵匠出身。",
          },
          {
            jh: "全真教",
            loc: "過真殿",
            name: "刘处玄",
            name_tw: "劉處玄",
            way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;e;e",
            desc: "他就是全真三徒劉處玄劉真人，他身材瘦小，但顧盼間自有一種威嚴氣概。",
          },
          { jh: "全真教", loc: "廚房", name: "掌厨道士", name_tw: "掌廚道士", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;e;e;e", desc: "一個負責掌廚的道士。" },
          { jh: "全真教", loc: "大堂一進", name: "小麻雀", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;e;e;e;n", desc: "一隻嘰嘰咋咋的小麻雀。" },
          { jh: "全真教", loc: "肥料房", name: "老人", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "這是一個老人，在全真教內已有幾十年了。" },
          { jh: "全真教", loc: "後花園", name: "挑水道士", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e", desc: "這是全真教內負責挑水的道士。" },
          { jh: "全真教", loc: "樹林", name: "蜜蜂", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;n", desc: "一直忙碌的小蜜蜂。" },
          { jh: "全真教", loc: "會真堂", name: "观想兽", name_tw: "觀想獸", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;w", desc: "一隻只有道家之所才有的怪獸。" },
          {
            jh: "全真教",
            loc: "元始殿",
            name: "赵师兄",
            name_tw: "趙師兄",
            way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;w;n",
            desc: "他就是全真教真人王處一的弟子趙師兄",
          },
          {
            jh: "全真教",
            loc: "藥劑室",
            name: "老顽童",
            name_tw: "老頑童",
            way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;n;w;w;n",
            desc: "此人年齡雖大但卻頑心未改，一頭亂糟糟的花白鬍子，一雙小眼睛透出讓人覺得滑稽的神色。",
          },
          { jh: "全真教", loc: "藏經殿", name: "小道童", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;n;w", desc: "他是全真教的一個小道童。" },
          {
            jh: "全真教",
            loc: "天尊殿",
            name: "重阳祖师",
            name_tw: "重陽祖師",
            way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;w;w;s",
            desc: "他就是全真教的開山祖師，其身材消瘦，精神矍鑠，飄飄然彷彿神仙中人",
          },
          { jh: "全真教", loc: "後堂一進", name: "小道童", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;w;w;w;s", desc: "一個全真教的小道童。" },
          {
            jh: "全真教",
            loc: "大禪房",
            name: "郝大通",
            way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;n;n;w;w;w;w;n;n;n",
            desc: "他就是全真七子中的郝大通郝真人。他身材微胖，象個富翁模樣，身上穿的道袍雙袖皆無。",
          },
          { jh: "全真教", loc: "馬廄", name: "健马", name_tw: "健馬", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;w;w;w;s", desc: "一匹健壯的大馬。" },
          { jh: "全真教", loc: "馬廄", name: "李四", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;n;w;w;w;s", desc: "這是一箇中年道士。" },
          { jh: "全真教", loc: "事為室", name: "小道童", way: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;n;w", desc: "他是全真教的一個小道童。" },
          { jh: "古墓", loc: "事為室", name: "白玉蜂", way: "", desc: "這是一隻玉色的蜜蜂，個頭比普通蜜蜂大得多，翅膀上被人用尖針刺有字" },
          { jh: "古墓", loc: "事為室", name: "红玉蜂", name_tw: "紅玉蜂", way: "", desc: "這是一隻玉色的蜜蜂，個頭比普通蜜蜂大得多，翅膀上被人用尖針刺有字。" },
          { jh: "古墓", loc: "", name: "毒蟒", way: ".樹上", desc: "一條龐大無比，色彩斑斕的巨蟒。渾身發出陣陣強烈的腥臭味。" },
          { jh: "古墓", loc: "小樹林", name: "天蛾", way: "jh 20;w;w;s;e;s;s;s", desc: "蜜蜂的天敵之一。" },
          { jh: "古墓", loc: "小樹林", name: "食虫虻", name_tw: "食蟲虻", way: "jh 20;w;w;s;e;s;s;s;s;s;sw", desc: "食肉昆蟲，蜜蜂的天敵之一。" },
          { jh: "古墓", loc: "草地", name: "玉蜂", way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s", desc: "這是一隻玉色的蜜蜂，個頭比普通蜜蜂大得多，翅膀上被人用尖針刺有字。" },
          {
            jh: "古墓",
            loc: "懸崖",
            name: "玉蜂",
            way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;e",
            desc: "這是一隻玉色的蜜蜂，個頭比普通蜜蜂大得多，翅膀上被人用尖針刺有字。",
          },
          {
            jh: "古墓",
            loc: "中廳",
            name: "龙儿",
            name_tw: "龍兒",
            way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;e;e",
            desc: "盈盈而站著一位秀美絕俗的女子，肌膚間少了一層血色，顯得蒼白異常。披著一襲輕紗般的白衣，猶似身在煙中霧裡。",
          },
          {
            jh: "古墓",
            loc: "密室",
            name: "林祖师",
            name_tw: "林祖師",
            way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;e;e;event_1_3723773;se;n;e;s;e;s;e",
            desc: "她就是古墓派的開山祖師，雖然已經是四十許人，望之卻還如同三十出頭。當年她與全真教主王重陽本是一對癡心愛侶，只可惜有緣無份，只得獨自在這古墓上幽居。",
          },
          {
            jh: "古墓",
            loc: "小屋",
            name: "孙婆婆",
            name_tw: "孫婆婆",
            way: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;s;s;s;e;e;e;e;s;e",
            desc: "這是一位慈祥的老婆婆，正看著你微微一笑。",
          },
          { jh: "白馱山", loc: "小路", name: "雷震天", way: "jh 21;nw;ne;n;n;ne", desc: "雷橫天的兒子，與其父親不同，長得頗為英俊。" },
          { jh: "白馱山", loc: "中軍大帳", name: "军中主帅", name_tw: "軍中主帥", way: "jh 21;n;n;n;n;w;w;w;w", desc: "敵軍主帥，黑盔黑甲，手持長刀。" },
          { jh: "白馱山", loc: "近衛狼營", name: "银狼近卫", name_tw: "銀狼近衛", way: "jh 21;n;n;n;n;w;w;w", desc: "主帥身側的近衛，都是萬里挑一的好手" },
          {
            jh: "白馱山",
            loc: "飛羽箭陣",
            name: "飞羽神箭",
            name_tw: "飛羽神箭",
            way: "jh 21;n;n;n;n;w;w",
            desc: "百發百中的神箭手，難以近身，必須用暗器武學方可隔空攻擊",
          },
          {
            jh: "白馱山",
            loc: "青銅盾陣",
            name: "青衣盾卫",
            name_tw: "青衣盾衛",
            way: "jh 21;n;n;n;n;w",
            desc: "身著青衣，手持巨盾，是敵軍陣前的鐵衛，看起來極難對付。",
          },
          { jh: "白馱山", loc: "戈壁", name: "傅介子", way: "jh 21", desc: "中原朝廷出使西域樓蘭國的使臣，氣宇軒昂，雍容華度，似也會一些武功。" },
          {
            jh: "白馱山",
            loc: "玉門關外",
            name: "玉门守将",
            name_tw: "玉門守將",
            way: "jh 21;n;n;n;n;e",
            desc: "一位身經百戰的將軍，多年駐守此地，臉上滿是大漠黃沙和狂風留下的滄桑。",
          },
          { jh: "白馱山", loc: "玉門關西門", name: "玉门守军", name_tw: "玉門守軍", way: "jh 21;n;n;n;n;e;e", desc: "玉門關的守衛軍士，將軍百戰死，壯士十年歸。" },
          { jh: "白馱山", loc: "西馳馬道", name: "玄甲骑兵", name_tw: "玄甲騎兵", way: "jh 21;n;n;n;n;e;e;e", desc: "黑盔黑甲的天策騎兵，連馬也被鋥亮的鎧甲包裹著。" },
          { jh: "白馱山", loc: "西車道", name: "车夫", name_tw: "車夫", way: "jh 21;n;n;n;n;e;e;e;e", desc: "一名駕車的車夫，塵霜滿面。" },
          {
            jh: "白馱山",
            loc: "守將府",
            name: "天策大将",
            name_tw: "天策大將",
            way: "jh 21;n;n;n;n;e;e;e;e;e",
            desc: "天策府左將軍，英勇善戰，智勇雙全。身穿黑盔黑甲，腰間有一柄火紅的長刀。",
          },
          {
            jh: "白馱山",
            loc: "守將府",
            name: "玄甲参将",
            name_tw: "玄甲參將",
            way: "jh 21;n;n;n;n;e;e;e;e;e",
            desc: "天策玄甲軍的參將，雙目專注，正在認真地看著城防圖。",
          },
          { jh: "白馱山", loc: "戈壁灘", name: "马匪", name_tw: "馬匪", way: "jh 21;n;n;n;n;e;e;e;e;e;e;e;e;e", desc: "這是肆虐戈壁的馬匪，長相兇狠，血債累累。" },
          {
            jh: "白馱山",
            loc: "馬車店",
            name: "醉酒男子",
            way: "jh 21;n;n;n;n;e;e;e;e;e;e;e;s",
            desc: "此人看似已經喝了不少，面前擺著不下七八個空酒罈，兩頰緋紅，然而雙目卻仍是炯炯有神，身長不足七尺，腰別一把看似貴族名士方才有的長劍，談笑之間雄心勃勃，睥睨天下。男子醉言醉語之間，似是自稱青蓮居士。",
          },
          {
            jh: "白馱山",
            loc: "馬車店",
            name: "慕容孤烟",
            name_tw: "慕容孤煙",
            way: "jh 21;n;n;n;n;e;e;e;e;e;e;e;s",
            desc: "英姿颯爽的馬車店女老闆，漢族和鮮卑族混血，雙目深邃，含情脈脈，細卷的栗色長發上夾著一個金色玉蜻蜓。",
          },
          {
            jh: "白馱山",
            loc: "龍門客棧",
            name: "凤七",
            name_tw: "鳳七",
            way: "jh 21;n;n;n;n;e;e;e;e;e;s;s;w",
            desc: "無影樓金鳳堂堂主，武功卓絕自是不在話下，腕上白玉鐲襯出如雪肌膚，腳上一雙鎏金鞋用寶石裝飾。",
          },
          { jh: "白馱山", loc: "絲綢之路驛站", name: "匈奴杀手", name_tw: "匈奴殺手", way: "jh 21;n;n;n;n;e;n;n;n", desc: "匈奴人殺手，手持彎刀，眼露兇光。" },
          { jh: "白馱山", loc: "東街", name: "花花公子", way: "jh 21;nw", desc: "這是個流裡流氣的花花公子。" },
          { jh: "白馱山", loc: "小路", name: "小山贼", name_tw: "小山賊", way: "jh 21;nw;ne;n;n", desc: "這是個尚未成年的小山賊。" },
          { jh: "白馱山", loc: "洞口", name: "山贼", name_tw: "山賊", way: "jh 21;nw;ne;n;n;ne;n", desc: "這是個面目可憎的山賊。" },
          { jh: "白馱山", loc: "洞內", name: "雷横天", name_tw: "雷橫天", way: "jh 21;nw;ne;n;n;ne;n;n", desc: "這是個粗魯的山賊頭。一身膘肉，看上去內力極度強勁！" },
          { jh: "白馱山", loc: "側洞", name: "金花", way: "jh 21;nw;ne;n;n;ne;n;n;w", desc: "一個年少貌美的姑娘。" },
          { jh: "白馱山", loc: "杖場", name: "侍杖", way: "jh 21;nw;ne;n;n;ne;w", desc: "他頭上包著紫布頭巾，一襲紫衫，沒有一絲褶皺。" },
          { jh: "白馱山", loc: "墳地", name: "寡妇", name_tw: "寡婦", way: "jh 21;nw;ne;ne", desc: "一個年輕漂亮又不甘寂寞的小寡婦。" },
          { jh: "白馱山", loc: "打鐵鋪", name: "铁匠", name_tw: "鐵匠", way: "jh 21;nw;s", desc: "鐵匠正用汗流浹背地打鐵。" },
          { jh: "白馱山", loc: "西街", name: "舞蛇人", way: "jh 21;nw;w", desc: "他是一個西域來的舞蛇人。" },
          { jh: "白馱山", loc: "西街", name: "农民", name_tw: "農民", way: "jh 21;nw;w", desc: "一個很健壯的壯年農民。" },
          { jh: "白馱山", loc: "酒店", name: "店小二", way: "jh 21;nw;w;n", desc: "這位店小二正笑咪咪地忙著招呼客人。" },
          { jh: "白馱山", loc: "小橋", name: "村姑", way: "jh 21;nw;w;w", desc: "一個很清秀的年輕農村姑娘，挎著一隻蓋著布小籃子。" },
          { jh: "白馱山", loc: "廣場", name: "小孩", way: "jh 21;nw;w;w;nw", desc: "這是個農家小孩子" },
          { jh: "白馱山", loc: "農舍", name: "农家妇女", name_tw: "農家婦女", way: "jh 21;nw;w;w;nw;e", desc: "一個很精明能幹的農家婦女。" },
          { jh: "白馱山", loc: "大門", name: "门卫", name_tw: "門衛", way: "jh 21;nw;w;w;nw;n;n", desc: "這是個年富力強的衛兵，樣子十分威嚴。" },
          { jh: "白馱山", loc: "大廳", name: "丫环", name_tw: "丫環", way: "jh 21;nw;w;w;nw;n;n;n;n", desc: "一個很能幹的丫環。" },
          {
            jh: "白馱山",
            loc: "大廳",
            name: "欧阳少主",
            name_tw: "歐陽少主",
            name_new: "白鶴軒",
            way: "jh 21;nw;w;w;nw;n;n;n;n",
            desc: "他一身飄逸的白色長衫，手搖折扇，風流儒雅。",
          },
          { jh: "白馱山", loc: "練功場", name: "李教头", name_tw: "李教頭", way: "jh 21;nw;w;w;nw;n;n;n;n;n", desc: "這是個和藹可親的教頭。" },
          { jh: "白馱山", loc: "練功房", name: "教练", name_tw: "教練", way: "jh 21;nw;w;w;nw;n;n;n;n;n;e", desc: "這是個和藹可親的教練。" },
          { jh: "白馱山", loc: "練功室", name: "陪练童子", name_tw: "陪練童子", way: "jh 21;nw;w;w;nw;n;n;n;n;n;e;ne", desc: "這是個陪人練功的陪練童子。" },
          { jh: "白馱山", loc: "門廊", name: "管家", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n", desc: "一個老謀深算的老管家。" },
          { jh: "白馱山", loc: "花園", name: "老毒物", name_new: "白厲峰", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n", desc: "他是白馱山莊主，號稱“老毒物”。" },
          { jh: "白馱山", loc: "花園", name: "白衣少女", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n", desc: "一個聰明伶俐的白衣少女。" },
          { jh: "白馱山", loc: "廚房", name: "肥肥", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;e", desc: "一個肥頭大耳的廚師，兩隻小眼睛不停地眨巴著。" },
          { jh: "白馱山", loc: "柴房", name: "老材", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;e;e", desc: "一個有名的吝嗇鬼，好象他整日看守著柴房也能發財似的。" },
          { jh: "白馱山", loc: "兔苑", name: "白兔", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne", desc: "一隻雪白的小白兔，可愛之致。" },
          {
            jh: "白馱山",
            loc: "蛇園",
            name: "驯蛇人",
            name_tw: "馴蛇人",
            way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;e",
            desc: "蛇園裡面的馴蛇人，替白駝山莊馴養各種毒蛇。",
          },
          { jh: "白馱山", loc: "蛇園", name: "金环蛇", name_tw: "金環蛇", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;e", desc: "一隻讓人看了起毛骨悚然的金環蛇。" },
          { jh: "白馱山", loc: "蛇園", name: "竹叶青蛇", name_tw: "竹葉青蛇", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;e", desc: "一隻讓人看了起雞皮疙瘩的竹葉青蛇。" },
          { jh: "白馱山", loc: "獸舍", name: "野狼", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;w", desc: "一隻獨行的野狼，半張著的大嘴裡露著幾顆獠牙。" },
          { jh: "白馱山", loc: "獸舍", name: "狐狸", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;w", desc: "一隻多疑成性的狐狸。" },
          { jh: "白馱山", loc: "獸舍", name: "雄狮", name_tw: "雄獅", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;w", desc: "一隻矯健的雄獅，十分威風。" },
          { jh: "白馱山", loc: "獸舍", name: "老虎", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;w", desc: "一隻斑斕猛虎，雄偉極了。" },
          { jh: "白馱山", loc: "後院", name: "张妈", name_tw: "張媽", way: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;nw", desc: "一個歷經滄桑的老婆婆。" },
          {
            jh: "白馱山",
            loc: "藥房",
            name: "小青",
            way: "jh 21;nw;w;w;nw;n;n;n;n;n;w;s",
            desc: "這是個聰明乖巧的小姑娘，打扮的很樸素，一襲青衣，卻也顯得落落有致。小青對人非常熱情。你要是跟她打過交道就會理解這一點！",
          },
          { jh: "白馱山", loc: "草叢", name: "黑冠巨蟒", way: "jh 21;nw;w;w;nw;n;n;n;n;n;w;w;w;n", desc: "一隻龐然大物，它眼中噴火，好象要一口把你吞下。" },
          { jh: "白馱山", loc: "岩洞", name: "蟒蛇", way: "jh 21;nw;w;w;nw;n;n;n;n;n;w;w;w;n;n;n", desc: "一隻昂首直立，吐著長舌芯的大蟒蛇。" },
          { jh: "白馱山", loc: "武器庫", name: "仕卫", name_tw: "仕衛", way: "jh 21;nw;w;w;nw;n;n;n;w", desc: "這是個樣子威嚴的仕衛。" },
          { jh: "白馱山", loc: "山路", name: "樵夫", way: "jh 21;nw;w;w;nw;nw;nw", desc: "一個很健壯的樵夫。" },
          { jh: "白馱山", loc: "山莊大門", name: "玄衣中年", way: "jh 21;nw;w;w;nw;nw;nw;n;w;s;event_1_47975698", desc: "一身玄衣的中年人，似乎是這裡山莊的一名守衛" },
          {
            jh: "白馱山",
            loc: "正堂",
            name: "闻人毅",
            name_tw: "聞人毅",
            way: "jh 21;nw;w;w;nw;nw;nw;n;w;s;event_1_47975698;s;sw;s;ne;e;s;s",
            desc: "一位神駿的青年，神情冷峻，週身似乎有一股強烈的劍氣包圍，令人感到非常壓抑。",
          },
          {
            jh: "嵩山",
            loc: "劍池",
            name: "左罗",
            name_tw: "左羅",
            way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n",
            desc: "左掌門的侄子，武功平平，但多謀善斷，有傳聞說他是左掌門的親生兒子。",
          },
          {
            jh: "嵩山",
            loc: "瀑布山洞",
            name: "马帮精锐",
            name_tw: "馬幫精銳",
            way: "jh 22;n;n;n;ss1;n;e;n;event_1_29122616",
            desc: "身材異常高大的男子，眼神中充滿殺氣，臉上滿布虯龍似的傷疤。",
          },
          {
            jh: "嵩山",
            loc: "瀑布山洞",
            name: "枯瘦的人",
            way: "jh 22;n;n;w;w;s;s;s;s;s;event_1_52783704",
            desc: "身形枯瘦，似乎被困於此多年，但眼神中仍有強烈的生存意志",
          },
          { jh: "嵩山", loc: "太室闕", name: "脚夫", name_tw: "腳夫", way: "jh 22", desc: "五大三粗的漢子，看起來會些拳腳功夫。" },
          { jh: "嵩山", loc: "青石大道", name: "风骚少妇", name_tw: "風騷少婦", way: "jh 22;n", desc: "一個風騷的少婦，頗有幾分姿色。" },
          { jh: "嵩山", loc: "青石大道", name: "秋半仙", way: "jh 22;n", desc: "一名算命道士，灰色道袍上綴著幾個補丁。" },
          { jh: "嵩山", loc: "中嶽廟", name: "锦袍老人", name_tw: "錦袍老人", way: "jh 22;n;n", desc: "神情威猛須發花白的老人，看起來武功修為頗高。" },
          { jh: "嵩山", loc: "青崗坪", name: "柳易之", way: "jh 22;n;n;n;n", desc: "朝廷通事舍人，負責傳達皇帝旨意。" },
          { jh: "嵩山", loc: "盧鴻草堂", name: "卢鸿一", name_tw: "盧鴻一", way: "jh 22;n;n;n;n;e", desc: "一名布衣老者，慈眉善目，須發皆白。" },
          {
            jh: "嵩山",
            loc: "盧崖瀑布",
            name: "英元鹤",
            name_tw: "英元鶴",
            way: "jh 22;n;n;n;n;e;n",
            desc: "這是一名枯瘦矮小的黑衣老人，一雙灰白的耳朵看起來有些詭異。",
          },
          { jh: "嵩山", loc: "啟母闕", name: "游客", name_tw: "遊客", way: "jh 22;n;n;w", desc: "來嵩山遊玩的男子，書生打扮，看來來頗為儒雅。" },
          { jh: "嵩山", loc: "嵩嶽山道", name: "野狼", way: "jh 22;n;n;w;n", desc: "山林覓食的野狼，看起來很餓。" },
          { jh: "嵩山", loc: "嵩陽書院", name: "林立德", way: "jh 22;n;n;w;n;n", desc: "在嵩陽書院進學的書生，看起來有些木訥。" },
          { jh: "嵩山", loc: "石階", name: "山贼", name_tw: "山賊", way: "jh 22;n;n;w;n;n;n", desc: "攔路搶劫的山賊" },
          { jh: "嵩山", loc: "無極老姆洞", name: "修行道士", way: "jh 22;n;n;w;n;n;n;n", desc: "在嵩山隱居修行的道士" },
          { jh: "嵩山", loc: "密林小徑", name: "黄色毒蛇", name_tw: "黃色毒蛇", way: "jh 22;n;n;w;n;n;n;n;event_1_88705407", desc: "一條吐舌蛇信子的毒蛇。" },
          { jh: "嵩山", loc: "山溪畔", name: "麻衣刀客", way: "jh 22;n;n;w;n;n;n;n;event_1_88705407;s;s", desc: "一身麻衣，頭戴斗笠的刀客" },
          { jh: "嵩山", loc: "石洞", name: "白板煞星", way: "jh 22;n;n;w;n;n;n;n;event_1_88705407;s;s;s;s", desc: "沒有鼻子，臉孔平平，像一塊白板，看起來極為可怖" },
          { jh: "嵩山", loc: "山楂林", name: "小猴", way: "jh 22;n;n;w;n;n;n;n;n", desc: "這是一隻調皮的小猴子，雖是畜牲，卻喜歡模仿人樣。" },
          { jh: "嵩山", loc: "朝天門", name: "万大平", name_tw: "萬大平", way: "jh 22;n;n;w;n;n;n;n;n;e", desc: "嵩山弟子，看起來很普通。" },
          {
            jh: "嵩山",
            loc: "朝天門",
            name: "芙儿",
            name_tw: "芙兒",
            way: "jh 22;n;n;w;n;n;n;n;n;e;e",
            desc: "一名身穿淡綠衫子的少女，只見她臉如白玉，顏若朝華，真是豔冠群芳的絕色美人。",
          },
          { jh: "嵩山", loc: "峻極山道", name: "嵩山弟子", way: "jh 22;n;n;w;n;n;n;n;n;e;n", desc: "這是一名嵩山弟子，武功看起來稀鬆平常。" },
          { jh: "嵩山", loc: "峻極禪院", name: "史师兄", name_tw: "史師兄", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n", desc: "嵩山派大弟子，武功修為頗高。" },
          { jh: "嵩山", loc: "會盟堂", name: "白头仙翁", name_tw: "白頭仙翁", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n", desc: "嵩山派高手，年紀不大，頭花卻已全白。" },
          { jh: "嵩山", loc: "劍池", name: "左挺", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n", desc: "冷麵短髯，相貌堂皇的青年漢子。" },
          { jh: "嵩山", loc: "東長廊", name: "钟九曲", name_tw: "鍾九曲", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;e", desc: "臉白無須，看起來不像練武之人。" },
          {
            jh: "嵩山",
            loc: "北長廊",
            name: "陆太保",
            name_tw: "陸太保",
            way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;n",
            desc: "面目兇光的中年漢子，雖是所謂名門正派，但手段極為兇殘。",
          },
          { jh: "嵩山", loc: "書齋", name: "高锦毛", name_tw: "高錦毛", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;n;e", desc: "須發火紅的中年漢子" },
          {
            jh: "嵩山",
            loc: "花園",
            name: "邓神鞭",
            name_tw: "鄧神鞭",
            way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;n;n",
            desc: "一名面容黯淡的老人，但看外表，很難想到他是一名內外皆修的高手。",
          },
          {
            jh: "嵩山",
            loc: "臥室",
            name: "聂红衣",
            name_tw: "聶紅衣",
            way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;n;n;e",
            desc: "一名體態風流的少婦，酥胸微露，媚眼勾人。",
          },
          { jh: "嵩山", loc: "獨尊壇", name: "左盟主", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;n;n;n", desc: "身穿杏黃長袍，冷口冷麵，喜怒皆不行於色，心機頗深。" },
          {
            jh: "嵩山",
            loc: "西長廊",
            name: "乐老狗",
            name_tw: "樂老狗",
            way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;w",
            desc: "這人矮矮胖胖，麵皮黃腫，約莫五十來歲年紀，目神光炯炯，凜然生威，兩隻手掌肥肥的又小又厚。",
          },
          { jh: "嵩山", loc: "練武場", name: "冷峻青年", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;w;n;n", desc: "一個風程僕僕的俠客。" },
          {
            jh: "嵩山",
            loc: "廚房",
            name: "伙夫",
            name_tw: "伙夫",
            way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;w;n;w",
            desc: "一名肥頭大耳的伙夫，負責打理嵩山派一眾大小夥食。",
          },
          { jh: "嵩山", loc: "倉庫", name: "沙秃翁", name_tw: "沙禿翁", way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;n;n;n;w;w", desc: "這是一名禿頭老者，一雙鷹眼微閉。" },
          {
            jh: "嵩山",
            loc: "封禪台",
            name: "麻衣汉子",
            name_tw: "麻衣漢子",
            way: "jh 22;n;n;w;n;n;n;n;n;e;n;n;w;n",
            desc: "頭戴斗笠，身材瘦長，一身麻衣的中年男子，看起來有些詭異。",
          },
          { jh: "嵩山", loc: "魔雲洞口", name: "吸血蝙蝠", way: "jh 22;n;n;w;w;s", desc: "一隻體型巨大的吸血蝙蝠。" },
          { jh: "嵩山", loc: "魔雲洞空地", name: "瞎眼剑客", name_tw: "瞎眼劍客", way: "jh 22;n;n;w;w;s;s", desc: "一名黑衣劍客，雙面失明。" },
          { jh: "嵩山", loc: "危崖", name: "瞎眼老者", way: "jh 22;n;n;w;w;s;s;s;s;s", desc: "這是一名黑衣瞎眼老者，看起來武功修為頗高。" },
          { jh: "嵩山", loc: "通天洞", name: "瞎眼刀客", way: "jh 22;n;n;w;w;s;s;s;s;w", desc: "一名黑衣刀客，雙面失明。" },
          {
            jh: "寒梅莊",
            loc: "囚室",
            name: "厉傲天",
            name_tw: "厲傲天",
            way: "jh 23;n;n;n;n;n;n;n;n;n;n;w;n;;kill?夏春雷;@夏春雷的屍體;s;e;s;s;s;w;w;give meizhuang_meizhuang3;n;n;n;n;n;e;event_1_35389772",
            desc: "這名老者身材甚高，一頭黑發，穿的是一襲青衫，長長的臉孔，臉色雪白，更無半分血色，眉目清秀，只是臉色實在白得怕人，便如剛從墳墓中出來的殭屍一般。",
          },
          {
            jh: "寒梅莊",
            loc: "酒室",
            name: "奎孜墨",
            way: "jh 23;n;n;n;n;n;n;n;n;n;n;w;n;;kill?夏春雷;@夏春雷的屍體;s;e;s;s;s;w;w;give meizhuang_meizhuang3;n;n;n;n;n",
            desc: "這是一名身穿黑衣的年輕男子，一張臉甚是蒼白，漆黑的眉毛下是藝術按個深沉的眼睛，深沉的跟他的年齡極不相符。",
          },
          { jh: "寒梅莊", loc: "嶽王廟", name: "武悼", way: "jh 23;n;n;e;event_1_50956819", desc: "一個白發蒼蒼的老人，默默打掃著這萬人景仰的武穆祠堂。" },
          { jh: "寒梅莊", loc: "柳樹林", name: "柳府家丁", way: "jh 23", desc: "這是杭州有名大戶柳府的家丁，穿著一身考究的短衫，一副目中無人的樣子。" },
          { jh: "寒梅莊", loc: "梅林", name: "老者", way: "jh 23;n;n", desc: "一個姓汪的老者，似乎有什麼秘密在身上。" },
          {
            jh: "寒梅莊",
            loc: "梅林",
            name: "柳玥",
            way: "jh 23;n;n",
            desc: "柳府二小姐，只見她眸含秋水清波流盼，香嬌玉嫩，秀靨豔比花嬌，指如削蔥根，口如含朱丹，一顰一笑動人心魂，旖旎身姿在上等絲綢長裙包裹下若隱若現。聽說柳府二千金芳名遠揚，傳聞柳府大小姐月夜逃婚，至今不知下落。",
          },
          {
            jh: "寒梅莊",
            loc: "放鶴亭",
            name: "筱西风",
            name_tw: "筱西風",
            way: "jh 23;n;n;e",
            desc: "這是一名看起來很冷峻的男子，只見他鬢若刀裁，眉如墨畫，身上穿著墨色的緞子衣袍，袍內露出銀色鏤空木槿花的鑲邊，腰上掛著一把長劍。",
          },
          { jh: "寒梅莊", loc: "青石闆大路", name: "梅庄护院", name_tw: "梅莊護院", way: "jh 23;n;n;n", desc: "一身家人裝束的壯漢，要掛寶刀，看起來有些功夫。" },
          { jh: "寒梅莊", loc: "大天井", name: "梅庄家丁", name_tw: "梅莊家丁", way: "jh 23;n;n;n;n;n", desc: "一身家人裝束的男子，看起來有些功夫。" },
          { jh: "寒梅莊", loc: "大廳", name: "施令威", way: "jh 23;n;n;n;n;n;n", desc: "一身家人裝束的老者，目光炯炯，步履穩重，看起來武功不低。" },
          { jh: "寒梅莊", loc: "百木園", name: "丁管家", way: "jh 23;n;n;n;n;n;n;n", desc: "一身家人裝束的老者，目光炯炯，步履穩重，看起來武功不低。" },
          {
            jh: "寒梅莊",
            loc: "棋室",
            name: "玄天指",
            way: "jh 23;n;n;n;n;n;n;n;e;s",
            desc: "這人雖然生的眉清目秀，然而臉色泛白，頭發極黑而臉色極白，像一具殭屍的模樣。據說此人酷愛下棋，為人工於心計。",
          },
          { jh: "寒梅莊", loc: "奇槐坡", name: "瘦小汉子", name_tw: "瘦小漢子", way: "jh 23;n;n;n;n;n;n;n;n", desc: "臉如金紙的瘦小的中年男子，一身黑衣，腰繫黃帶。" },
          {
            jh: "寒梅莊",
            loc: "畫室",
            name: "龙点睛",
            name_tw: "龍點睛",
            way: "jh 23;n;n;n;n;n;n;n;n;e;n",
            desc: "此人髯長及腹，一身酒氣，據說此人極為好酒好丹青，為人豪邁豁達。",
          },
          {
            jh: "寒梅莊",
            loc: "臨水平台",
            name: "上官香云",
            name_tw: "上官香雲",
            way: "jh 23;n;n;n;n;n;n;n;n;n;n",
            desc: "這女子有著傾城之貌，閉月之姿，流轉星眸顧盼生輝，發絲隨意披散，慵懶不羈。她是江南一帶有名的歌妓，據聞琴棋書畫無不精通，文人雅士、王孫公子都想一親芳澤。",
          },
          {
            jh: "寒梅莊",
            loc: "書齋",
            name: "铁笔张",
            name_tw: "鐵筆張",
            way: "jh 23;n;n;n;n;n;n;n;n;n;n;e",
            desc: "這人身型矮矮胖胖，頭頂禿得油光滑亮，看起來沒有半點文人雅緻，卻極為嗜好書法。",
          },
          { jh: "寒梅莊", loc: "杏林", name: "黑衣刀客", way: "jh 23;n;n;n;n;n;n;n;n;n;n;event_1_8188693;n", desc: "一身黑色勁裝，手持大刀，看起來很兇狠。" },
          {
            jh: "寒梅莊",
            loc: "練武場",
            name: "青衣剑客",
            name_tw: "青衣劍客",
            way: "jh 23;n;n;n;n;n;n;n;n;n;n;event_1_8188693;n;n",
            desc: "一身青衣，不知道練得什麼邪門功夫，看起來臉色鐵青。",
          },
          {
            jh: "寒梅莊",
            loc: "菜園",
            name: "黄衫婆婆",
            name_tw: "黃衫婆婆",
            way: "jh 23;n;n;n;n;n;n;n;n;n;n;event_1_8188693;n;n;n;e;n",
            desc: "雖已滿頭白發，但眉眼間依舊可見年輕時的娟秀。",
          },
          {
            jh: "寒梅莊",
            loc: "茅草屋",
            name: "红衣僧人",
            name_tw: "紅衣僧人",
            way: "jh 23;n;n;n;n;n;n;n;n;n;n;event_1_8188693;n;n;n;n",
            desc: "這人雖然身穿紅色僧袍，但面目猙獰，看起來絕非善類。",
          },
          {
            jh: "寒梅莊",
            loc: "涼棚",
            name: "紫袍老者",
            way: "jh 23;n;n;n;n;n;n;n;n;n;n;event_1_8188693;n;n;w",
            desc: "看起來氣度不凡的老人，紫色臉膛在紫袍的襯托下顯得更是威嚴。",
          },
          { jh: "寒梅莊", loc: "琴室", name: "琴童", way: "jh 23;n;n;n;n;n;n;n;n;n;n;w", desc: "這是一名青衣童子，扎著雙髻，眉目清秀。" },
          {
            jh: "寒梅莊",
            loc: "內室",
            name: "夏春雷",
            way: "jh 23;n;n;n;n;n;n;n;n;n;n;w;n",
            desc: "這是一名身型骨瘦如柴的老人，炯炯有神的雙目卻讓內行人一眼看出其不俗的內力。",
          },
          {
            jh: "寒梅莊",
            loc: "酒室",
            name: "地牢看守",
            way: "jh 23;n;n;n;n;n;n;n;n;n;n;w;n;;kill?夏春雷;@夏春雷的屍體;s;e;s;s;s;w;w;give meizhuang_meizhuang3",
            desc: "身穿灰布衣裳，臉色因為常年不見陽光，看起來有些灰白。",
          },
          {
            jh: "寒梅莊",
            loc: "酒室",
            name: "地鼠",
            way: "jh 23;n;n;n;n;n;n;n;n;n;n;w;n;;kill?夏春雷;@夏春雷的屍體;s;e;s;s;s;w;w;give meizhuang_meizhuang3;n;n",
            desc: "一隻肥大的地鼠，正在覓食。",
          },
          {
            jh: "寒梅莊",
            loc: "酒室",
            name: "地鼠",
            way: "jh 23;n;n;n;n;n;n;n;n;n;n;w;n;;kill?夏春雷;@夏春雷的屍體;s;e;s;s;s;w;w;give meizhuang_meizhuang3;n;n;n;n",
            desc: "一隻肥大的地鼠，正在覓食。",
          },
          {
            jh: "寒梅莊",
            loc: "小院",
            name: "柳蓉",
            way: "jh 23;n;n;n;n;n;n;n;n;w",
            desc: "這女子雖是一襲僕人粗布衣裳，卻掩不住其俊俏的容顏。只見那張粉臉如花瓣般嬌嫩可愛，櫻桃小嘴微微輕啟，似是要訴說少女心事。",
          },
          {
            jh: "寒梅莊",
            loc: "廚房",
            name: "丁二",
            way: "jh 23;n;n;n;n;n;n;n;n;w;n",
            desc: "這是一名滿臉油光的中年男子，雖然其貌不揚，據說曾是京城御廚，蒸炒煎炸樣樣拿手。",
          },
          {
            jh: "寒梅莊",
            loc: "偏房",
            name: "聋哑老人",
            name_tw: "聾啞老人",
            way: "jh 23;n;n;n;n;n;n;n;n;w;w",
            desc: "這是一名彎腰曲背的聾啞老人，須發皆白，滿臉皺紋。據說他每天都去湖底地牢送飯。",
          },
          {
            jh: "寒梅莊",
            loc: "酒室",
            name: "庄左使",
            name_tw: "莊左使",
            way: "jh 23;n;n;n;n;n;n;n;w;w",
            desc: "這是一名身穿白袍的老人，容貌清癯，刻頦下疏疏朗朗一縷花白長須，身材高瘦，要掛彎刀。",
          },
          {
            jh: "泰山",
            loc: "木屋",
            name: "铁恶人",
            name_tw: "鐵惡人",
            way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;w;n;n;n;n;e",
            desc: "鐵毅同父異母之弟，為了「大旗門」寶藏，時常算計其大哥鐵毅。",
          },
          { jh: "泰山", loc: "木屋", name: "黑衣人", way: "", desc: "一個風程僕僕的俠客。" },
          { jh: "泰山", loc: "青州城外", name: "镖师", name_tw: "鏢師", way: "jh 24;se", desc: "當地鏢局的鏢師，現在被狼軍士兵團團圍住，難以脫身。" },
          { jh: "泰山", loc: "", name: "铁翼", name_tw: "鐵翼", way: ".位置：地牢，靠謎題飛", desc: "鐵翼是鐵血大旗門的元老。他剛正不阿，鐵骨諍諍，如今被囚禁於此。" },
          { jh: "泰山", loc: "岱宗坊", name: "挑夫", way: "jh 24", desc: "這青年漢子看起來五大三粗，估計會些三腳貓功夫。" },
          { jh: "泰山", loc: "石階", name: "黄衣刀客", name_tw: "黃衣刀客", way: "jh 24;n", desc: "這傢伙滿臉橫肉，一付凶神惡煞的模樣，令人望而生畏。" },
          { jh: "泰山", loc: "一天門", name: "瘦僧人", way: "jh 24;n;n", desc: "他是一位中年遊方和尚，骨瘦如柴，身上的袈裟打滿了補丁。" },
          { jh: "泰山", loc: "天梯", name: "柳安庭", way: "jh 24;n;n;n", desc: "這是個飽讀詩書，卻手無縛雞之力的年輕書生。" },
          { jh: "泰山", loc: "石闆路", name: "石云天", name_tw: "石雲天", way: "jh 24;n;n;n;n", desc: "生性豁達，原本是丐幫弟子，因為風流本性難改，被逐出丐幫。" },
          { jh: "泰山", loc: "彌勒院", name: "朱莹莹", name_tw: "朱瑩瑩", way: "jh 24;n;n;n;n;e", desc: "豔麗的容貌、曼妙的身姿，真是數不盡的萬種風情。" },
          {
            jh: "泰山",
            loc: "小洞天",
            name: "温青青",
            name_tw: "溫青青",
            way: "jh 24;n;n;n;n;e;e",
            desc: "這名女子神態嫻靜淡雅，穿著一身石青色短衫，衣履精緻，一張俏臉白裡透紅，好一個美麗俏佳人。",
          },
          {
            jh: "泰山",
            loc: "小洞天",
            name: "易安居士",
            way: "jh 24;n;n;n;n;e;e",
            desc: "這是有“千古第一才女”之稱的李清照，自幼生活優裕，其父李格非藏書甚豐，小時候就在良好的家庭環境中打下文學基礎。少年時即負文學的盛名，她的詞更是傳誦一時。中國女作家中，能夠在文學史上佔一席地的，必先提李易安。她生活的時代雖在北宋南宋之間，卻不願意隨著當時一般的潮流，而專意於小令的吟詠。她的名作象《醉花陰》，《如夢令》，有佳句象“花自飄零水自流，一種相思兩處閒愁”等等，都膾炙人口。",
          },
          {
            jh: "泰山",
            loc: "白騾塚",
            name: "欧阳留云",
            name_tw: "歐陽留雲",
            way: "jh 24;n;n;n;n;e;s",
            desc: "這是位中年武人，肩背長劍，長長的劍穗隨風飄揚，看來似乎身懷絕藝。",
          },
          {
            jh: "泰山",
            loc: "飛雲閣",
            name: "吕进",
            name_tw: "呂進",
            way: "jh 24;n;n;n;n;n",
            desc: "此人出身神秘，常常獨來獨往，戴一副鐵面具，不讓人看到真面目，師承不明。",
          },
          { jh: "泰山", loc: "萬仙樓", name: "司马玄", name_tw: "司馬玄", way: "jh 24;n;n;n;n;n;n", desc: "這是一名白發老人，慈眉善目，據說此人精通醫術和藥理。" },
          {
            jh: "泰山",
            loc: "三義柏",
            name: "桑不羁",
            name_tw: "桑不羈",
            way: "jh 24;n;n;n;n;n;n;e",
            desc: "此人身似猿猴，動作矯健，因輕功出眾，江湖中難有人可以追的上他，故而以刺探江湖門派消息為生。",
          },
          { jh: "泰山", loc: "鬥母宮", name: "于霸天", name_tw: "於霸天", way: "jh 24;n;n;n;n;n;n;n", desc: "此人身材魁梧，身穿鐵甲，看起來似乎是官府的人。" },
          {
            jh: "泰山",
            loc: "山谷小溪",
            name: "神秘游客",
            name_tw: "神秘遊客",
            way: "jh 24;n;n;n;n;n;n;n;e",
            desc: "此人年紀雖不大，但須發皆白，一身黑袍，看起來氣度不凡。",
          },
          { jh: "泰山", loc: "雲步橋", name: "李三", way: "jh 24;n;n;n;n;n;n;n;n;n", desc: "此人無發無眉，相貌極其醜陋。" },
          { jh: "泰山", loc: "酌泉亭", name: "仇霸", way: "jh 24;n;n;n;n;n;n;n;n;n;e", desc: "此人獨目禿頂，面目兇惡，來官府通緝要犯。" },
          {
            jh: "泰山",
            loc: "五大夫松",
            name: "平光杰",
            name_tw: "平光傑",
            way: "jh 24;n;n;n;n;n;n;n;n;n;n",
            desc: "這是一名身穿粗布衣服的少年，背上揹著一個竹簍，裡面放著一些不知名的藥草。",
          },
          {
            jh: "泰山",
            loc: "十八盤",
            name: "玉师兄",
            name_tw: "玉師兄",
            way: "jh 24;n;n;n;n;n;n;n;n;n;n;n",
            desc: "這人面色灰白，雙眼無神，看起來一副沉溺酒色的模樣。",
          },
          { jh: "泰山", loc: "南天門", name: "玉师伯", name_tw: "玉師伯", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n", desc: "泰山掌門的師叔，此人看起來老奸巨猾。" },
          { jh: "泰山", loc: "天街", name: "任娘子", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e", desc: "這是一名豔麗少婦，勾魂雙面中透出一股殺氣。" },
          { jh: "泰山", loc: "石階", name: "红衣卫士", name_tw: "紅衣衛士", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e", desc: "一身紅色勁裝的衛士，看起來有些功夫。" },
          {
            jh: "泰山",
            loc: "迎旭亭",
            name: "白飞羽",
            name_tw: "白飛羽",
            way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;e",
            desc: "這人算得上是一個美男子，長眉若柳，身如玉樹。",
          },
          {
            jh: "泰山",
            loc: "禪房",
            name: "商鹤鸣",
            name_tw: "商鶴鳴",
            way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;e",
            desc: "這人生的有些難看，黑紅臉膛，白發長眉，看起來有些陰鬱。",
          },
          {
            jh: "泰山",
            loc: "玉皇殿",
            name: "冯太监",
            name_tw: "馮太監",
            way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;n;n",
            desc: "皇帝身邊鶴發童顏的太監，權勢滔天，眼中閃著精光。",
          },
          {
            jh: "泰山",
            loc: "玉皇殿",
            name: "钟逍林",
            name_tw: "鍾逍林",
            way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;n;n",
            desc: "這是一名魁梧的中年男子，看起來內家功夫造詣不淺。",
          },
          {
            jh: "泰山",
            loc: "登封台",
            name: "西门宇",
            name_tw: "西門宇",
            way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;n;n;n",
            desc: "這是一名身材偉岸的中年男子，看起來霸氣逼人。",
          },
          {
            jh: "泰山",
            loc: "望河亭",
            name: "西门允儿",
            name_tw: "西門允兒",
            way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;n;w",
            desc: "這是一名極有靈氣的女子，穿著碧綠紗裙。",
          },
          { jh: "泰山", loc: "雙鞭客棧", name: "黄老板", name_tw: "黃老闆", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;s", desc: "雙鞭客棧老闆，看起來精明過人。" },
          { jh: "泰山", loc: "泰山派山門", name: "迟一城", name_tw: "遲一城", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "泰山弟子，劍眉星目，身姿挺拔如松。" },
          { jh: "泰山", loc: "前院", name: "泰山弟子", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "這是一名青衣弟子，手裡握著一把長劍。" },
          { jh: "泰山", loc: "廂房", name: "建除", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e", desc: "泰山掌門的弟子，身形矯健，看起來武功不錯。" },
          { jh: "泰山", loc: "東靈殿", name: "天柏", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "泰山掌門的師弟，看起來英氣勃勃。" },
          { jh: "泰山", loc: "後院", name: "天松", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n", desc: "泰山掌門的師弟，嫉惡如仇，性子有些急躁。" },
          {
            jh: "泰山",
            loc: "靜觀山房",
            name: "泰山掌门",
            name_tw: "泰山掌門",
            way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n",
            desc: "此人為泰山掌門，此人看起來正氣凜然。",
          },
          { jh: "泰山", loc: "休息室", name: "玉师叔", name_tw: "玉師叔", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w", desc: "泰山掌門的師叔，處事冷靜，極有見識。" },
          { jh: "泰山", loc: "桃花峪入口", name: "黑衣密探", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;w", desc: "這是一名蒙面密探。" },
          { jh: "泰山", loc: "桃花路", name: "毒蛇", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;w;n", desc: "這是一條斑斕的大蛇，一眼看去就知道有劇毒" },
          { jh: "泰山", loc: "垂釣台", name: "筱墨客", way: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;w;n;n;w", desc: "這人臉上掛著難以捉摸的笑容，看起來城府極深。" },
          { jh: "泰山", loc: "望人松", name: "玉师弟", name_tw: "玉師弟", way: "jh 24;n;n;n;n;n;n;n;n;n;n;w", desc: "此人一身道袍，看起來頗為狡詐。" },
          {
            jh: "泰山",
            loc: "翠竹林",
            name: "海棠杀手",
            name_tw: "海棠殺手",
            way: "jh 24;n;n;n;n;n;n;n;n;w",
            desc: "這人的臉上看起來沒有一絲表情，手裡的刀刃閃著寒光。",
          },
          {
            jh: "泰山",
            loc: "石亭",
            name: "路独雪",
            name_tw: "路獨雪",
            way: "jh 24;n;n;n;n;n;n;n;n;w;n;n",
            desc: "這人便是江湖有名的海棠殺手“三劍斷命”，看起來倒也算是一表人才，只是雙目透出的殺氣卻讓人見之膽寒。",
          },
          {
            jh: "泰山",
            loc: "大石坪",
            name: "铁云",
            name_tw: "鐵雲",
            way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n",
            desc: "據說殺手無情便無敵，這人看起來風流倜儻，卻是極為冷血之人。",
          },
          {
            jh: "泰山",
            loc: "百丈崖",
            name: "孔翎",
            way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;n;n",
            desc: "據說他就是海棠殺手組織的首領，不過看他的樣子，似乎不像是一個能統領眾多殺手的人。",
          },
          {
            jh: "泰山",
            loc: "石橋",
            name: "姬梓烟",
            name_tw: "姬梓煙",
            way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w",
            desc: "這是一名極為妖豔的女子，一身黑色的緊身衣將其包裹得曲線畢露，估計十個男人見了十個都會心癢難耐。",
          },
          {
            jh: "泰山",
            loc: "朱櫻林",
            name: "柳兰儿",
            name_tw: "柳蘭兒",
            way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n",
            desc: "這是一個看起來天真爛漫的少女，不過等她的劍刺穿你的身體時，你才會意識到天真是多麼好的偽裝。",
          },
          { jh: "泰山", loc: "朱櫻林", name: "朱樱林", name_tw: "朱櫻林", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n", desc: "" },
          { jh: "泰山", loc: "石門", name: "布衣男子", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870", desc: "這是一名身穿粗布衣服的男子，看起來很強壯。" },
          { jh: "泰山", loc: "巨石廣場", name: "阮小", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n", desc: "這人五短身材，尖嘴猴腮。" },
          {
            jh: "泰山",
            loc: "聚兵房",
            name: "史义",
            name_tw: "史義",
            way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;n;e",
            desc: "這人身穿粗布勁裝，滿臉絡腮鬍，雙眼圓瞪，似乎隨時準備發怒。",
          },
          {
            jh: "泰山",
            loc: "演武場",
            name: "林忠达",
            name_tw: "林忠達",
            way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;n;n;n",
            desc: "這人看起來很普通，是那種見過後便會忘記的人。",
          },
          {
            jh: "泰山",
            loc: "三透天",
            name: "铁面人",
            name_tw: "鐵面人",
            way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;n;n;n;n",
            desc: "這人臉上蒙著一張黑鐵面具，看不見他的模樣，但面具後雙眼卻給人一種滄桑感。",
          },
          {
            jh: "泰山",
            loc: "茅舍",
            name: "司马墉",
            name_tw: "司馬墉",
            way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;n;n;w",
            desc: "這人穿著一身長袍，敏銳的雙眼讓人感覺到他的精明過人。",
          },
          { jh: "泰山", loc: "跑馬場", name: "阮大", way: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;w;n;event_1_15941870;n;w", desc: "這人五短身材，尖嘴猴腮。" },
          { jh: "泰山", loc: "山崖", name: "鲁刚", name_tw: "魯剛", way: "jh 24;n;n;n;n;n;n;w", desc: "一名隱士，據聞此人精通鑄劍。" },
          {
            jh: "泰山",
            loc: "紅門宮",
            name: "程不为",
            name_tw: "程不為",
            way: "jh 24;n;n;n;n;w",
            desc: "此人出身神秘，常常獨來獨往，戴一副鐵面具，不讓人看到真面目，師承不明。",
          },
          { jh: "大旗門", loc: "", name: "卓三娘", way: ".靠謎題飛", desc: "閃電卓三娘輕功世無雙，在碧落賦中排名第三。" },
          { jh: "大旗門", loc: "", name: "小白兔", way: ".靠謎題飛", desc: "小白兔白又白兩隻耳朵豎起來。" },
          { jh: "大旗門", loc: "", name: "朱藻", way: ".靠謎題飛", desc: "風流倜儻" },
          { jh: "大旗門", loc: "", name: "水灵儿", name_tw: "水靈兒", way: ".靠謎題飛", desc: "她滿面愁容，手裡雖然拿著本書，卻只是呆呆的出神。" },
          { jh: "大旗門", loc: "", name: "风老四", name_tw: "風老四", way: ".靠謎題飛", desc: "風梭風九幽，但他現在走火入魔，一動也不能動了。" },
          {
            jh: "大旗門",
            loc: "",
            name: "阴宾",
            name_tw: "陰賓",
            way: ".靠謎題飛",
            desc: "她面上蒙著輕紅羅紗，隱約間露出面容輪廓，當真美得驚人，宛如煙籠芍藥，霧裡看花",
          },
          { jh: "大旗門", loc: "海邊路", name: "渔夫", name_tw: "漁夫", way: "jh 25;e;e;e", desc: "這是一個滿臉風霜的老漁夫。" },
          { jh: "大旗門", loc: "海邊", name: "叶缘", name_tw: "葉緣", way: "jh 25;e;e;e;e;s", desc: "剛拜入大旗門不久的青年。" },
          {
            jh: "大旗門",
            loc: "常春島渡口",
            name: "老婆子",
            way: "jh 25;e;e;e;e;s;yell",
            desc: "她面容被歲月侵蝕，風雨吹打，劃出了千百條皺紋，顯得那麼衰老但一雙眼睛，卻仍亮如閃電，似是隻要一眼瞧過去，任何人的秘密，卻再也休想瞞過她。",
          },
          { jh: "大旗門", loc: "小路", name: "罗少羽", name_tw: "羅少羽", way: "jh 25;e;e;e;e;s;yell;e", desc: "剛拜入大旗門不久的青年。" },
          { jh: "大旗門", loc: "小路", name: "青衣少女", way: "jh 25;e;e;e;e;s;yell;e;ne", desc: "一個身材苗條，身著青衣的少女。" },
          { jh: "大旗門", loc: "觀月頂", name: "青衣少女", way: "jh 25;e;e;e;e;s;yell;e;ne;se;e;e;e;e", desc: "一個身材苗條，身著青衣的少女。" },
          {
            jh: "大旗門",
            loc: "觀月頂",
            name: "日岛主",
            name_tw: "日島主",
            name_new: "鐵夫人",
            way: "jh 25;e;e;e;e;s;yell;e;ne;se;e;e;e;e",
            desc: "日島主乃大旗門第七代掌門人云翼之妻，因看不慣大旗門人對其n妻子的無情，開創常春島一派，以收容世上所有傷心女子。",
          },
          { jh: "大旗門", loc: "礁石", name: "潘兴鑫", name_tw: "潘興鑫", way: "jh 25;e;e;e;e;s;yell;s", desc: "剛到拜入大旗門不久的青年。" },
          {
            jh: "大旗門",
            loc: "洞穴",
            name: "铁掌门",
            name_tw: "鐵掌門",
            name_new: "雷昊陽",
            way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028",
            desc: "他是大旗門的傳人。",
          },
          {
            jh: "大旗門",
            loc: "石屋",
            name: "夜皇",
            name_new: "鐵雍華",
            way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w",
            desc: "他容光煥發，須發有如衣衫般輕柔，看來雖是瀟灑飄逸，又帶有一種不可抗拒之威嚴。",
          },
          {
            jh: "大旗門",
            loc: "秘道",
            name: "红衣少女",
            name_tw: "紅衣少女",
            way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;s;w",
            desc: "她身穿輕紗柔絲，白足如霜，青絲飄揚。",
          },
          { jh: "大旗門", loc: "秘道", name: "紫衣少女", way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;s;w", desc: "她身穿輕紗柔絲，白足如霜，青絲飄揚。" },
          { jh: "大旗門", loc: "秘道", name: "橙衣少女", way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;s;w", desc: "她身穿輕紗柔絲，白足如霜，青絲飄揚。" },
          {
            jh: "大旗門",
            loc: "秘道",
            name: "蓝衣少女",
            name_tw: "藍衣少女",
            way: "jh 25;e;e;e;e;s;yell;s;e;event_1_81629028;s;e;n;w;w;s;w",
            desc: "她身穿輕紗柔絲，白足如霜，藍絲飄揚。",
          },
          { jh: "大旗門", loc: "危崖前", name: "宾奴", name_tw: "賓奴", way: "jh 25;w", desc: "陰賓所養的波斯貓" },
          { jh: "大昭寺", loc: "草原", name: "头狼", name_tw: "頭狼", way: "jh 26;w;w;w;n;w;w;w;n", desc: "狼群之王，體型碩大，狼牙寒鋒畢露。" },
          {
            jh: "大昭寺",
            loc: "陰山",
            name: "李将军",
            name_tw: "李將軍",
            way: "jh 26;w;w;n",
            desc: "一個玄甲黑盔，身披白色披風的少年將軍，雖面容清秀，卻不掩眉宇之間的果決和堅毅。",
          },
          { jh: "大昭寺", loc: "草原", name: "镇魂将", name_tw: "鎮魂將", way: "jh 26;w;w;w;n;w;w;w;n", desc: "金盔金甲的護陵大將。" },
          {
            jh: "大昭寺",
            loc: "草原",
            name: "突厥先锋大将",
            name_tw: "突厥先鋒大將",
            way: "jh 26;w;w;w;n;n",
            desc: "東突厥狼軍先鋒大將，面目兇狠，身披狼皮鎧甲，揹負長弓，手持丈餘狼牙棒。",
          },
          { jh: "大昭寺", loc: "大青山", name: "神秘甲士", way: "jh 26;w;w;n;w", desc: "身披重甲，手持長戟，不許旁人前進一步。" },
          { jh: "大昭寺", loc: "烏拉山", name: "地宫暗哨", name_tw: "地宮暗哨", way: "jh 26;w;w;n;w;w", desc: "黑衣黑靴，一旦有外人靠近地宮，便手中暗器齊發。" },
          { jh: "大昭寺", loc: "狼山", name: "守山力士", way: "jh 26;w;w;n;w;w;w", desc: "他們的雙拳，便是鎮守陵寢最好的武器。" },
          { jh: "大昭寺", loc: "草原", name: "牧羊女", way: "jh 26", desc: "一個天真活潑，美麗大方的少女。" },
          { jh: "大昭寺", loc: "草原", name: "草原狼", way: "jh 26;w", desc: "一直兇殘的草原狼。" },
          { jh: "大昭寺", loc: "草原", name: "小绵羊", name_tw: "小綿羊", way: "jh 26;w", desc: "一隻全身雪白的的綿羊。" },
          { jh: "大昭寺", loc: "草原", name: "牧羊女", way: "jh 26;w;w", desc: "一個牧羊女正在放羊。" },
          { jh: "大昭寺", loc: "草原", name: "大绵羊", name_tw: "大綿羊", way: "jh 26;w;w", desc: "一隻全身雪白的的綿羊。" },
          { jh: "大昭寺", loc: "草原", name: "白衣少年", way: "jh 26;w;w;w", desc: "年紀輕輕的少年，武功了得，卻心狠手辣。" },
          { jh: "大昭寺", loc: "草原", name: "小羊羔", way: "jh 26;w;w;w", desc: "一隻全身雪白的的綿羊。" },
          { jh: "大昭寺", loc: "城門", name: "城卫", name_tw: "城衛", way: "jh 26;w;w;w;w;w", desc: "一個年青的藏僧。" },
          { jh: "大昭寺", loc: "塔頂", name: "紫衣妖僧", way: "jh 26;w;w;w;w;w;n", desc: "附有邪魔之氣的僧人。" },
          { jh: "大昭寺", loc: "塔頂", name: "塔僧", way: "jh 26;w;w;w;w;w;n", desc: "一個負責看管舍利塔的藏僧。" },
          { jh: "大昭寺", loc: "八角街", name: "关外旅客", name_tw: "關外旅客", way: "jh 26;w;w;w;w;w;w", desc: "這是一位來大昭寺遊覽的旅客。" },
          { jh: "大昭寺", loc: "八角街", name: "护寺喇嘛", name_tw: "護寺喇嘛", way: "jh 26;w;w;w;w;w;w", desc: "一個大招寺的藏僧。" },
          { jh: "大昭寺", loc: "八角街", name: "护寺藏尼", name_tw: "護寺藏尼", way: "jh 26;w;w;w;w;w;w;n", desc: "一個大招寺的藏尼。" },
          { jh: "大昭寺", loc: "鷹記商號", name: "卜一刀", way: "jh 26;w;w;w;w;w;w;n;n;e", desc: "他是個看起來相當英俊的年輕人，不過點神秘莫測的感覺。" },
          { jh: "大昭寺", loc: "八角街", name: "疯狗", name_tw: "瘋狗", way: "jh 26;w;w;w;w;w;w;n;n;w", desc: "一隻渾身髒兮兮的野狗，一雙眼睛正惡狠狠地瞪著你。" },
          { jh: "大昭寺", loc: "八角街", name: "余洪兴", name_tw: "餘洪興", way: "jh 26;w;w;w;w;w;w;s", desc: "這是位笑眯眯的丐幫八袋弟子，生性多智，外號小吳用。" },
          { jh: "大昭寺", loc: "迎梅客棧", name: "店老板", name_tw: "店老闆", way: "jh 26;w;w;w;w;w;w;s;e", desc: "這位店老闆正在招呼客人。" },
          {
            jh: "大昭寺",
            loc: "八角街",
            name: "野狗",
            way: "jh 26;w;w;w;w;w;w;s;s;w;w;w;w",
            desc: "一隻渾身髒兮兮的野狗，一雙眼睛正惡狠狠地瞪著你。一隻渾身髒兮兮的野狗。",
          },
          { jh: "大昭寺", loc: "八角街", name: "收破烂的", name_tw: "收破爛的", way: "jh 26;w;w;w;w;w;w;s;s;w;w;w;w", desc: "一個收破爛的。" },
          { jh: "大昭寺", loc: "八角街", name: "樵夫", way: "jh 26;w;w;w;w;w;w;s;s;w;w;w;w", desc: "你看到一個粗壯的大漢，身上穿著普通樵夫的衣服。" },
          { jh: "大昭寺", loc: "八角街", name: "乞丐", way: "jh 26;w;w;w;w;w;w;s;s;w;w;w;w;n;n", desc: "一個滿臉風霜之色的老乞丐。" },
          { jh: "大昭寺", loc: "驛站", name: "陶老大", way: "jh 26;w;w;w;w;w;w;s;w", desc: "這是整天笑咪咪的車老闆，雖然功夫不高，卻也過得自在。" },
          { jh: "大昭寺", loc: "木屋", name: "胭松", way: "jh 26;w;w;w;w;w;w;w;w;n;e", desc: "胭松是葛倫高僧的得意二弟子。" },
          { jh: "大昭寺", loc: "寶塔", name: "塔祝", way: "jh 26;w;w;w;w;w;w;w;w;w", desc: "這個老人看起來七十多歲了，看著他佝僂的身影，你忽然覺得心情沈重了下來。" },
          { jh: "大昭寺", loc: "禪房", name: "灵空", name_tw: "靈空", way: "jh 26;w;w;w;w;w;w;w;w;w;w", desc: "靈空高僧是大昭寺現在的主持。" },
          { jh: "大昭寺", loc: "禪房", name: "护寺藏尼", name_tw: "護寺藏尼", way: "jh 26;w;w;w;w;w;w;w;w;w;w", desc: "一個大招寺的藏尼。" },
          {
            jh: "大昭寺",
            loc: "大昭秘境",
            name: "葛伦",
            name_tw: "葛倫",
            way: "jh 26;w;w;w;w;w;w;w;w;w;w;ask?lama_master;event_1_91837538",
            desc: "葛倫高僧已在大昭寺主持多年。男女弟子遍佈關外。",
          },
          {
            jh: "魔教",
            loc: "風雷堂正殿",
            name: "童长老",
            name_tw: "童長老",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;nw",
            desc: "他使得一手好錘法。",
          },
          { jh: "魔教", loc: "飲馬灘", name: "船夫", name_tw: "船夫", way: "jh 27;ne;nw;w;nw;w;w", desc: "一個船夫。" },
          { jh: "魔教", loc: "黃土小徑", name: "冉无望", name_tw: "冉無望", way: "jh 27;ne;n;ne", desc: "一個面容俊朗的少年，卻眉頭深鎖，面帶殺氣。" },
          { jh: "魔教", loc: "飲馬灘", name: "外面船夫", name_tw: "外面船夫", way: "jh 27;ne;nw;w;nw;w;w", desc: "一個船夫。" },
          {
            jh: "魔教",
            loc: "跪拜坪",
            name: "见钱开",
            name_tw: "見錢開",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;e",
            desc: "此人十分喜好錢財。",
          },
          {
            jh: "魔教",
            loc: "日月神道",
            name: "魔教弟子",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n",
            desc: "這傢伙滿臉橫肉，一付凶神惡煞的模樣，令人望而生畏。",
          },
          {
            jh: "魔教",
            loc: "神教監牢",
            name: "(紫色)魔教犯人",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;e;n",
            desc: "一個魔教的犯人，他們都是到魔教臥底的各大門派弟子事洩被捕的",
          },
          {
            jh: "魔教",
            loc: "神教監牢",
            name: "(青色)魔教犯人",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;e;e;e;n",
            desc: "一個魔教的犯人，他們都是到魔教臥底的各大門派弟子事洩被捕的",
          },
          {
            jh: "魔教",
            loc: "神教監牢",
            name: "(红色)魔教犯人",
            name_tw: "(紅色)魔教犯人",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;e;e;e;e;n",
            desc: "一個魔教的犯人，他們都是到魔教臥底的各大門派弟子事洩被捕的",
          },
          {
            jh: "魔教",
            loc: "神教監牢",
            name: "(蓝色)魔教犯人",
            name_tw: "(藍色)魔教犯人",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;e;e;e;e;e;n",
            desc: "一個魔教的犯人，他們都是到魔教臥底的各大門派弟子事洩被捕的",
          },
          {
            jh: "魔教",
            loc: "神劍閣",
            name: "独孤风",
            name_tw: "獨孤風",
            name_new: "夏侯京",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e",
            desc: "此人是用劍高手。",
          },
          {
            jh: "魔教",
            loc: "魔慶堂",
            name: "杨延庆",
            name_tw: "楊延慶",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e;e",
            desc: "他使得一手好槍法。",
          },
          {
            jh: "魔教",
            loc: "魔松閣",
            name: "范松",
            name_tw: "範松",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e;e;e",
            desc: "他使得一手好斧法。",
          },
          {
            jh: "魔教",
            loc: "魔靈閣",
            name: "巨灵",
            name_tw: "巨靈",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e",
            desc: "他使得一手好錘法。",
          },
          {
            jh: "魔教",
            loc: "魔楚閣",
            name: "楚笑",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e",
            desc: "雖是女子，但武功絕不輸於須眉。",
          },
          {
            jh: "魔教",
            loc: "成德殿",
            name: "莲亭",
            name_tw: "蓮亭",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;n",
            desc: "他身形魁梧，滿臉虯髯，形貌極為雄健。",
          },
          {
            jh: "魔教",
            loc: "成德殿",
            name: "(亮蓝色)魔教弟子",
            name_tw: "(亮藍色)魔教弟子",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;n",
            desc: "",
          },
          {
            jh: "魔教",
            loc: "針線小築",
            name: "东方教主",
            name_tw: "東方教主",
            name_new: "葵花傳人",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;n;n;event_1_57107759;e;e;n;w",
            desc: "他就是日月神教教主。號稱無人可敵。",
          },
          {
            jh: "魔教",
            loc: "魔容閣",
            name: "花想容",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;w",
            desc: "她使得一手好刀法。",
          },
          {
            jh: "魔教",
            loc: "魔洋閣",
            name: "曲右使",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;w;w",
            desc: "他使得一手好鉤法。",
          },
          {
            jh: "魔教",
            loc: "魔風閣",
            name: "张矮子",
            name_tw: "張矮子",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;w;w;w",
            desc: "他使得一手好武功。",
          },
          {
            jh: "魔教",
            loc: "魔雲閣",
            name: "张白发",
            name_tw: "張白發",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w",
            desc: "他使得一手好掌法。",
          },
          {
            jh: "魔教",
            loc: "魔鶴閣",
            name: "赵长老",
            name_tw: "趙長老",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w",
            desc: "他使得一手好叉法。",
          },
          {
            jh: "魔教",
            loc: "風雷堂",
            name: "王诚",
            name_tw: "王誠",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;ne",
            desc: "他使得一手好刀法。",
          },
          {
            jh: "魔教",
            loc: "白虎堂正堂",
            name: "上官云",
            name_tw: "上官雲",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;n",
            desc: "他使得一手好劍法。",
          },
          {
            jh: "魔教",
            loc: "流雲堂",
            name: "桑三娘",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;ne",
            desc: "她使得一手好叉法。",
          },
          {
            jh: "魔教",
            loc: "霸氣堂",
            name: "葛停香",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;nw",
            desc: "他天生神力，勇猛無比。",
          },
          {
            jh: "魔教",
            loc: "白虎堂",
            name: "罗烈",
            name_tw: "羅烈",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;se",
            desc: "他使得一手好槍法。",
          },
          {
            jh: "魔教",
            loc: "朱雀正堂",
            name: "贾布",
            name_tw: "賈布",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;sw",
            desc: "他使得一手好鉤法。",
          },
          {
            jh: "魔教",
            loc: "玄武正堂",
            name: "鲍长老",
            name_tw: "鮑長老",
            way: "jh 27;ne;nw;w;nw;w;w;;kill?船夫;@船夫的屍體;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n;yell;n;n;n;n;n;n;w;w",
            desc: "他一身橫練的功夫，孔武有力。",
          },
          { jh: "魔教", loc: "飲馬灘", name: "里面船夫", name_tw: "裡面船夫", way: "jh 27;ne;nw;w;nw;w;w;yell", desc: "一個船夫。" },
          { jh: "魔教", loc: "步神小道", name: "(青色)魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n", desc: "" },
          { jh: "魔教", loc: "步神小道", name: "青色魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n", desc: "" },
          {
            jh: "魔教",
            loc: "繩索吊橋",
            name: "魔教弟子",
            way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n",
            desc: "這傢伙滿臉橫肉，一付凶神惡煞的模樣，令人望而生畏。",
          },
          { jh: "魔教", loc: "鐵門", name: "白色魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n", desc: "" },
          { jh: "魔教", loc: "鐵門", name: "(白色)魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n", desc: "" },
          { jh: "魔教", loc: "鐵門", name: "(蓝色)魔教弟子", name_tw: "(藍色)魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "魔教", loc: "鐵門", name: "蓝色魔教弟子", name_tw: "藍色魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n", desc: "" },
          { jh: "魔教", loc: "平地", name: "黄色魔教弟子", name_tw: "黃色魔教弟子", way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n", desc: "" },
          {
            jh: "魔教",
            loc: "平地",
            name: "(黄色)魔教弟子",
            name_tw: "(黃色)魔教弟子",
            way: "jh 27;ne;nw;w;nw;w;w;yell;w;nw;n;n;n;n;n;n;n;w;n;n;n;n;n;n;n;n;n;n",
            desc: "",
          },
          { jh: "魔教", loc: "子午樓", name: "店小二", way: "jh 27;ne;w", desc: "這是一個忙忙碌碌的小二。" },
          { jh: "魔教", loc: "子午樓", name: "客店老板", name_tw: "客店老闆", way: "jh 27;ne;w", desc: "一個賊眉鼠眼的商人。" },
          { jh: "魔教", loc: "黑山林", name: "黑熊", way: "jh 27;se;e", desc: "一隻健壯的黑熊。" },
          { jh: "魔教", loc: "林洞", name: "怪人", way: "jh 27;se;e;e;e", desc: "看起來像是隻妖怪一般。" },
          { jh: "星宿海", loc: "山洞", name: "玄衣刀妖", way: "jh 28;n;w;w;w;se", desc: "一個白發老人，身著紫衣，眼神兇狠，太陽穴隆起，顯是有不低的內力修為。" },
          { jh: "星宿海", loc: "小屋", name: "波斯老者", way: "jh 28;nw;sw", desc: "一個老者來自波斯，似乎是一個鐵匠，臉上看起來有點陰險的感覺。" },
          { jh: "星宿海", loc: "天山下", name: "波斯商人", way: "jh 28", desc: "一個高鼻藍眼的波斯商人。他看著你臉上露出狡猾的笑容。" },
          { jh: "星宿海", loc: "天山山路", name: "牧羊人", way: "jh 28;n", desc: "一個老漢，趕著幾十只羊。" },
          {
            jh: "星宿海",
            loc: "天山山路",
            name: "星宿派钹手",
            name_tw: "星宿派鈸手",
            way: "jh 28;n;n",
            desc: "他是星宿派的擊鈸手。他手中拿著一對銅鈸，一邊敲一邊扯著嗓子唱些肉麻的話。",
          },
          { jh: "星宿海", loc: "天山山路", name: "星宿派鼓手", way: "jh 28;n;n", desc: "他是星宿派的吹鼓手。他面前放著一隻銅鼓，一邊敲一邊扯著嗓子唱些肉麻的話。" },
          {
            jh: "星宿海",
            loc: "天山山路",
            name: "狮吼师兄",
            name_tw: "獅吼師兄",
            way: "jh 28;n;n",
            desc: "他就是丁老怪的二弟子。他三十多歲，獅鼻闊口，一望而知不是中土人士。",
          },
          {
            jh: "星宿海",
            loc: "天山山路",
            name: "星宿派号手",
            name_tw: "星宿派號手",
            way: "jh 28;n;n",
            desc: "他是星宿派的吹號手。他手中拿著一隻銅號，鼓足力氣一臉沉醉地吹著。",
          },
          {
            jh: "星宿海",
            loc: "星宿海",
            name: "摘星大师兄",
            name_tw: "摘星大師兄",
            way: "jh 28;n;n;n",
            desc: "他就是丁老怪的大弟子、星宿派大師兄。他三十多歲，臉龐瘦削，眼光中透出一絲乖戾之氣。",
          },
          {
            jh: "星宿海",
            loc: "日月洞",
            name: "丁老怪",
            name_new: "天宿老怪",
            way: "jh 28;n;n;n;n;n",
            desc: "他就是天宿派開山祖師、令正派人士深惡痛絕的天宿老怪。可是他看起來形貌清奇，仙風道骨。",
          },
          {
            jh: "星宿海",
            loc: "石道",
            name: "采花子",
            name_tw: "採花子",
            way: "jh 28;n;n;n;n;nw;w",
            desc: "採花子是星宿派的一個小嘍羅，武功雖不好，但生性淫邪，經常姦淫良家婦女，是官府通緝的犯人，故而星宿派名義上也不承認有這個弟子。",
          },
          { jh: "星宿海", loc: "天山山路", name: "紫姑娘", way: "jh 28;n;w", desc: "她就是丁老怪弟子紫姑娘。她容顏俏麗，可眼神中總是透出一股邪氣。" },
          { jh: "星宿海", loc: "小路", name: "天狼师兄", name_tw: "天狼師兄", way: "jh 28;n;w;n", desc: "他就是丁老怪的三弟子。" },
          { jh: "星宿海", loc: "小路", name: "出尘师弟", name_tw: "出塵師弟", way: "jh 28;n;w;n;n", desc: "他就是丁老怪的八弟子。他身才矮胖，可手中握的鋼杖又長又重。" },
          { jh: "星宿海", loc: "天山山路", name: "采药人", name_tw: "採藥人", way: "jh 28;n;w;w", desc: "一個辛苦工作的採藥人。" },
          {
            jh: "星宿海",
            loc: "天山頂峰",
            name: "周女侠",
            name_tw: "週女俠",
            way: "jh 28;n;w;w;w;w",
            desc: "身形修長，青裙曳地。皮膚白嫩，美若天人。恍若仙子下凡，是人世間極少的絕美女子。其武功修為十分了得。",
          },
          { jh: "星宿海", loc: "天山頂峰", name: "毒蛇", way: "jh 28;n;w;w;w;w", desc: "一隻有著三角形腦袋的蛇，尾巴沙沙做響。" },
          { jh: "星宿海", loc: "百龍山", name: "毒蛇", way: "jh 28;n;w;w;w;w;n", desc: "一隻有著三角形腦袋的蛇，尾巴沙沙做響。" },
          { jh: "星宿海", loc: "野牛溝", name: "牦牛", name_tw: "犛牛", way: "jh 28;n;w;w;w;w;w;w;nw;ne;nw;w", desc: "這是一頭常見的崑崙山野犛牛" },
          { jh: "星宿海", loc: "野牛溝", name: "雪豹", way: "jh 28;n;w;w;w;w;w;w;nw;ne;nw;w", desc: "這是一頭通體雪白的崑崙山雪豹，極為罕有。" },
          { jh: "星宿海", loc: "伊犁", name: "唐冠", way: "jh 28;nw", desc: "唐門中的貴公子，父親是唐門中的高層，看起來極自負。" },
          { jh: "星宿海", loc: "伊犁", name: "伊犁", way: "jh 28;nw", desc: "" },
          { jh: "星宿海", loc: "伊犁", name: "矮胖妇女", name_tw: "矮胖婦女", way: "jh 28;nw", desc: "一個很胖的中年婦女。" },
          { jh: "星宿海", loc: "巴依家院", name: "巴依", way: "jh 28;nw;e", desc: "一個風塵僕僕的俠客。。" },
          { jh: "星宿海", loc: "巴依家院", name: "小孩", way: "jh 28;nw;e", desc: "這是個小孩子" },
          {
            jh: "星宿海",
            loc: "巴依家客廳",
            name: "阿凡提",
            way: "jh 28;nw;e;e",
            desc: "他頭上包著頭巾，長著向上翹的八字鬍，最喜歡捉弄巴依、幫助窮人。他常給別人出謎語。",
          },
          { jh: "星宿海", loc: "賽馬場", name: "伊犁马", name_tw: "伊犁馬", way: "jh 28;nw;nw", desc: "這是一匹雄壯的母馬，四肢發達，毛發油亮。" },
          { jh: "星宿海", loc: "賽馬場", name: "阿拉木罕", way: "jh 28;nw;nw", desc: "她身段不肥也不瘦。她的眉毛像彎月，她的眼睛很多情。" },
          { jh: "星宿海", loc: "雜貨鋪", name: "买卖提", name_tw: "買賣提", way: "jh 28;nw;w", desc: "買賣提是個中年商人，去過幾次中原，能講一點兒漢話。" },
          {
            jh: "星宿海",
            loc: "戈壁山洞",
            name: "天梵密使",
            way: "jh 28;nw;w;buy /map/xingxiu/npc/obj/fire from xingxiu_maimaiti;e;se;sw;event_1_83637364",
            desc: "天梵宗主密使，遮住了容貌，神秘莫測。",
          },
          { jh: "星宿海", loc: "南疆沙漠", name: "梅师姐", name_tw: "梅師姐", way: "jh 28;sw", desc: "此人一臉幹皺的皮膚，雙眼深陷，猶如一具死屍。" },
          { jh: "星宿海", loc: "南疆沙漠", name: "铁尸", name_tw: "鐵屍", way: "jh 28;sw;nw;sw;sw;nw;nw;se;sw", desc: "這人全身乾枯，不像一個人，倒像是一具乾屍。" },
          { jh: "茅山", loc: "南疆沙漠", name: "心魔", way: "", desc: "缺" },
          { jh: "茅山", loc: "山道", name: "野猪", name_tw: "野豬", way: "jh 29;n", desc: "一隻笨笨的野豬" },
          {
            jh: "茅山",
            loc: "龍城道場",
            name: "阳明居士",
            name_tw: "陽明居士",
            way: "jh 29;n;n;n;n;event_1_60035830;place?平台;e",
            desc: "陽明居士瀟灑俊逸，一代鴻儒，學識淵博且深諳武事，有「軍神」之美譽，他開創的「陽明心學」更是打破了朱派獨霸天下的局面。",
          },
          {
            jh: "茅山",
            loc: "",
            name: "张天师",
            name_tw: "張天師",
            way: "jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?無名山峽谷;n",
            desc: "他是龍虎山太乙一派的嫡系傳人，他法力高強，威名遠播。",
          },
          {
            jh: "茅山",
            loc: "",
            name: "万年火龟",
            name_tw: "萬年火龜",
            way: "jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?無名山峽谷;n",
            desc: "一隻尺許大小，通體火紅的烏龜。",
          },
          {
            jh: "茅山",
            loc: "",
            name: "道士",
            way: "jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?洞口;n;n;n;n;n;e;n",
            desc: "茅山派的道士，著一身黑色的道袍",
          },
          {
            jh: "茅山",
            loc: "",
            name: "孙天灭",
            name_tw: "孫天滅",
            way: "jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?洞口;n;n;n;n;n;n;n",
            desc: "孫天滅外號六指小真人，是林忌最喜愛的徒弟。他盡得林忌真傳！",
          },
          {
            jh: "茅山",
            loc: "",
            name: "道灵",
            name_tw: "道靈",
            way: "jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?洞口;n;n;n;n;n;n;n;event_1_98579273",
            desc: "道靈真人是林忌的師弟，也是上代掌門的關門弟子，雖然比林忌小了幾歲，但道行十分高深，「谷衣心法」已修煉到極高境界了。",
          },
          {
            jh: "茅山",
            loc: "",
            name: "林忌",
            way: "jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?洞口;n;n;n;n;n;n;n;event_1_98579273;n",
            desc: "林忌是一位道行十分高深的修道者，你發現他的眼珠一個是黑色的，一個是金色的，這正是「谷衣心法」修煉到極高境界的徵兆。",
          },
          {
            jh: "茅山",
            loc: "",
            name: "护山使者",
            name_tw: "護山使者",
            way: "jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?洞口;n;n;n;n;n;n;n;event_1_98579273;w",
            desc: "護山使者是茅山派的護法，著一身黑色的道袍",
          },
          {
            jh: "桃花島",
            loc: "后院",
            name: "桃花岛弟子",
            name_tw: "桃花島弟子",
            way: "jh 30;n;n;n;n;n;n;n",
            desc: "一個三十出頭的小夥子，身板結實，雙目有神，似乎練過幾年功夫。",
          },
          { jh: "桃花島", loc: "", name: "陆废人", name_tw: "陸廢人", way: "jh 30", desc: "他是黃島主的三弟子。" },
          { jh: "桃花島", loc: "", name: "老渔夫", name_tw: "老漁夫", way: "jh 30;n;n;n;n;n;n", desc: "一個看上去毫不起眼的老漁夫，然而……" },
          {
            jh: "桃花島",
            loc: "习武房",
            name: "桃花岛弟子",
            name_tw: "桃花島弟子",
            way: "jh 30;n;n;n;n;n;n;n;n;n;n;w",
            desc: "一個二十出頭的小夥子，身板結實，雙目有神，似乎練過幾年功夫。",
          },
          { jh: "桃花島", loc: "", name: "曲三", way: "jh 30;n;n;n;n;n;n;n;n;n;n;e;e;n", desc: "他是黃島主的四弟子。" },
          { jh: "桃花島", loc: "", name: "丁高阳", name_tw: "丁高陽", way: "jh 30;n;n;n;n;n;n;n;n;n;n;e;s", desc: "曲三的一位好友，神態似乎非常著急。" },
          {
            jh: "桃花島",
            loc: "",
            name: "黄岛主",
            name_tw: "黃島主",
            name_new: "李奇門",
            way: "jh 30;n;n;n;n;n;n;n;n;n;n;n;n;n;n",
            desc: "他就是桃花島主，喜怒無常，武功深不可測。",
          },
          { jh: "桃花島", loc: "", name: "蓉儿", name_tw: "蓉兒", way: "jh 30;n;n;n;n;n;n;n;n;n;n;n;n;n;n;se;s", desc: "她是黃島主的愛女，長得極為漂亮。" },
          {
            jh: "桃花島",
            loc: "药房",
            name: "桃花岛弟子",
            name_tw: "桃花島弟子",
            way: "jh 30;n;n;n;n;n;n;n;n;n;n;w;w;s",
            desc: "一個二十出頭的小夥子，身板結實，雙目有神，似乎練過幾年功夫。",
          },
          {
            jh: "桃花島",
            loc: "",
            name: "哑仆",
            name_tw: "啞僕",
            way: "jh 30;n;n;n;n;n;n;n;n;n;n;w;w;s",
            desc: "這是一個桃花島的啞僕。他們全是十惡不赦的混蛋，黃藥師刺啞他們，充為下御。",
          },
          { jh: "桃花島", loc: "", name: "哑仆人", name_tw: "啞僕人", way: "jh 30;n;n;n;n;n;n;n;w;w", desc: "又聾又啞，似乎以前曾是一位武林高手。" },
          {
            jh: "桃花島",
            loc: "",
            name: "神雕大侠",
            name_tw: "神雕大俠",
            name_new: "過必修",
            way: "jh 30;n;n;ne",
            desc: "他就是神雕大俠，一張清癯俊秀的臉孔，劍眉入鬢。",
          },
          { jh: "桃花島", loc: "", name: "傻姑", way: "jh 30;yell;w;n", desc: "這位姑娘長相還算端正，就是一副傻頭傻腦的樣子。" },
          {
            jh: "桃花島",
            loc: "",
            name: "戚总兵",
            name_tw: "戚總兵",
            way: "jh 30;yell;w;n;e",
            desc: "此乃東南海防駐軍主將，英武之氣凜凜逼人，威信素著，三軍皆畏其令，從不敢擾民。",
          },
          {
            jh: "鐵雪山莊",
            loc: "",
            name: "小贩",
            name_tw: "小販",
            way: "jh 11;e;e;s;n;nw;w;nw;e",
            desc: "這小販左手提著個籃子，右手提著個酒壺。籃上繫著銅鈴，不住叮鐺作響。",
          },
          { jh: "鐵雪山莊", loc: "", name: "酒肉和尚", way: "jh 11;e;e;s;n;nw;w;nw;e;e;e;n;w", desc: "這是一個僧不僧俗不俗，滿頭亂發的怪人" },
          {
            jh: "鐵雪山莊",
            loc: "野猪岭",
            name: "纵横老野猪\u001b\t",
            name_tw: "縱橫老野豬\u001b\t",
            way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e",
            desc: "兩件普通的黑布衣衫罩在身上，粗獷的眉宇間英華內斂，目光凝實如玉，顯出極高的修行。《參同契》有云：「故鉛外黑，內懷金華，被褐懷玉，外為狂夫」。目睹此人，可窺一斑。",
          },
          { jh: "鐵雪山莊", loc: "", name: "老妖", way: "jh 31;n;se;e;se;s;s;sw;se;se", desc: "一個金眼赤眉的老人，傳說來自遙遠的黑森之山，有著深不可測的妖道修為。" },
          { jh: "鐵雪山莊", loc: "羊肠小道", name: "樵夫", way: "jh 31;n;n;n", desc: "一個砍柴為生的樵夫。" },
          { jh: "鐵雪山莊", loc: "", name: "樵夫", way: "jh 31;n;n;n;w", desc: "一個砍柴為生的樵夫。" },
          { jh: "鐵雪山莊", loc: "世外桃源", name: "欧冶子", name_tw: "歐冶子", way: "jh 31;n;n;n;w;w;w", desc: "華夏鑄劍第一人，許多神劍曾出自他手。" },
          { jh: "鐵雪山莊", loc: "翠竹庄门", name: "老张", name_tw: "老張", way: "jh 31;n;n;n;w;w;w;w;n", desc: "鐵血山莊的門衛。" },
          {
            jh: "鐵雪山莊",
            loc: "山庄前院",
            name: "雪鸳",
            name_tw: "雪鴛",
            way: "jh 31;n;n;n;w;w;w;w;n;n",
            desc: "神秘的綠衣女子，似乎隱居在鐵雪山莊，無人能知其來歷。",
          },
          { jh: "鐵雪山莊", loc: "", name: "小翠", way: "jh 31;n;n;n;w;w;w;w;n;n;n", desc: "鐵雪山莊的一個丫鬟。" },
          {
            jh: "鐵雪山莊",
            loc: "",
            name: "雪蕊儿",
            name_tw: "雪蕊兒",
            way: "jh 31;n;n;n;w;w;w;w;n;n;n",
            desc: "雪蕊兒膚白如雪，很是漂亮。在這鐵雪山莊中，和鐵少過著神仙一般的日子。",
          },
          { jh: "鐵雪山莊", loc: "翠竹屋", name: "铁少", name_tw: "鐵少", way: "jh 31;n;n;n;w;w;w;w;n;n;n", desc: "鐵山是一個風流倜儻的公子。" },
          { jh: "鐵雪山莊", loc: "山庄后院", name: "白袍公", way: "jh 31;n;n;n;w;w;w;w;n;n;n;n", desc: "一個一襲白衣的老翁。" },
          { jh: "鐵雪山莊", loc: "", name: "黑袍公", way: "jh 31;n;n;n;w;w;w;w;n;n;n;n", desc: "一個一襲黑衣的老翁。" },
          { jh: "鐵雪山莊", loc: "洞后营地", name: "黑衣人", way: "jh 31;n;e;n;n;se;sw;s;nw;n", desc: "全身黑衣的青年，現在似乎沒有沒有帶面罩，相貌很不顯眼" },
          {
            jh: "鐵雪山莊",
            loc: "营地大帐",
            name: "黑衣首领",
            name_tw: "黑衣首領",
            way: "jh 31;n;e;n;n;se;sw;s;nw;n;e",
            desc: "看起來像是這裡的首領，身穿黑衣，相貌非常普通",
          },
          {
            jh: "鐵雪山莊",
            loc: "青石溪畔",
            name: "陳小神",
            way: "jh 31;n;se",
            desc: "快活林裡小神仙，一個眉清目秀的江湖新人，據說機緣巧合下得到了不少江湖秘藥，功力非同一般，前途不可限量。",
          },
          { jh: "鐵雪山莊", loc: "", name: "剑荡八荒", name_tw: "劍蕩八荒", way: "jh 31;n;se;e", desc: "虯髯大漢，要憑一把鐵劍戰勝天下高手，八荒無敵。" },
          { jh: "鐵雪山莊", loc: "", name: "魏娇", name_tw: "魏嬌", way: "jh 31;n;se;e;se", desc: "女扮男裝的青衣秀士，手持長劍，英姿颯爽，好一個巾幗不讓須眉。" },
          { jh: "鐵雪山莊", loc: "", name: "神仙姐姐", way: "jh 31;n;se;e;se;s", desc: "白裙襲地，仙氣氤氳，武林中冉冉升起的新星，誓要問鼎至尊榜，執天下之牛耳。" },
          {
            jh: "鐵雪山莊",
            loc: "半山桃林",
            name: "寒夜·斩",
            name_tw: "寒夜·斬",
            way: "jh 31;n;se;e;se;s;s",
            desc: "一副浪蕩書生打扮的中年劍客，據說他也曾是一代高手。",
          },
          {
            jh: "鐵雪山莊",
            loc: "",
            name: "他",
            way: "jh 31;n;se;e;se;s;s;sw",
            desc: "這人的名字頗為奇怪，只一個字。行為也頗為怪誕，總是藏在花叢裡。不過武功底子看起來卻一點都不弱。",
          },
          {
            jh: "鐵雪山莊",
            loc: "",
            name: "出品人◆风云",
            name_tw: "出品人◆風雲",
            way: "jh 31;n;se;e;se;s;s;sw;se",
            desc: "江湖豪門『21世紀影業』的核心長老之一，與幫主番茄攜手打下一片江山，江湖中威震一方的豪傑。",
          },
          {
            jh: "鐵雪山莊",
            loc: "",
            name: "二虎子",
            way: "jh 31;n;se;e;se;s;s;sw;se;se",
            desc: "一個已過盛年的江湖高手，像是曾有過輝煌，卻早已隨風吹雨打去。他曾有過很多名字，現在卻連一個像樣的都沒有留下，只剩下喝醉後嘴裡呢喃不清的“大師”，“二二二”，“泯恩仇”，你也聽不出個所以然。",
          },
          {
            jh: "鐵雪山莊",
            loc: "",
            name: "欢乐剑客",
            name_tw: "歡樂劍客",
            way: "jh 31;n;se;e;se;s;s;sw;se;se;e",
            desc: "『地府』威震江湖的右護法，手中大斧不知道收留了多少江湖高手的亡魂。",
          },
          {
            jh: "鐵雪山莊",
            loc: "",
            name: "黑市老鬼",
            way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw",
            desc: "江湖人無人不知，無人不曉的黑市老鬼頭，包裹裡無奇不有，無所不賣，只要你有錢，什麼稀奇的貨品都有，比如黑鬼的凝視，眼淚，咆哮，微笑。。。一應俱全。",
          },
          {
            jh: "鐵雪山莊",
            loc: "踏云小径",
            name: "无头苍蝇",
            name_tw: "無頭蒼蠅",
            way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne",
            desc: "一個佝僂著身軀的玄衣老頭，從後面看去，似是沒有頭一樣，頗為駭人。",
          },
          {
            jh: "鐵雪山莊",
            loc: "",
            name: "神弑☆铁手",
            name_tw: "神弒☆鐵手",
            way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n",
            desc: "武林中數一數二的後起之秀，和所有崛起的江湖高手一樣，潛心修煉，志氣淩雲。",
          },
          {
            jh: "鐵雪山莊",
            loc: "",
            name: "禅师",
            name_tw: "禪師",
            way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne",
            desc: "一個退隱的禪師，出家人連名字都忘懷了，只剩下眼中隱含的光芒還能看出曾是問鼎武林的高手。",
          },
          {
            jh: "鐵雪山莊",
            loc: "",
            name: "道一",
            way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n",
            desc: "後起之秀，面若中秋之月，色如春曉之花，鬢若刀裁，眉如墨畫。",
          },
          {
            jh: "鐵雪山莊",
            loc: "真龙隐武阁",
            name: "采菊隐士",
            name_tw: "採菊隱士",
            way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n",
            desc: "一個與世無爭的清修高人，無心江湖，潛心修仙。用「美男子」來形容他一點也不為過。身高近七尺，穿著一襲繡綠紋的紫長袍，外罩一件亮綢面的乳白色對襟襖背子。",
          },
          {
            jh: "鐵雪山莊",
            loc: "武神步道",
            name: "【人间】雨修",
            name_tw: "【人間】雨修",
            way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n",
            desc: "曾經的江湖第二豪門『天傲閣』的大當家，武勇過人，修為頗深。怎奈何門派日漸式微，江湖聲望一日不如一日，讓人不禁扼腕嘆息，縱使一方霸主也獨木難支。",
          },
          {
            jh: "鐵雪山莊",
            loc: "无双洞",
            name: "汉时叹",
            name_tw: "漢時嘆",
            way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;e;e;event_1_47175535",
            desc: "身穿水墨色衣、頭戴一片氈巾，生得風流秀氣。『地府』幫的開山祖師，曾是武功橫絕一時的江湖至尊。手中暗器『大巧不工』聞者喪膽，鏢身有字『揮劍訣浮雲』。",
          },
          {
            jh: "鐵雪山莊",
            loc: "破虚石台",
            name: "冷泉心影",
            way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;e;n",
            desc: "『不落皇朝』當之無愧的君主和領袖，致力破除心中習武障魔，參得無上武道。頭上戴著束發嵌寶紫金冠，齊眉勒著二龍搶珠金抹額，如同天上神佛降臨人世。",
          },
          {
            jh: "鐵雪山莊",
            loc: "绣冬堂",
            name: "烽火戏诸侯",
            name_tw: "烽火戲諸侯",
            way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;e;e;event_1_94442590",
            desc: "身軀凜凜，相貌堂堂。一雙眼光射寒星，兩彎眉渾如刷漆。胸脯橫闊，有萬夫難敵之威風。武林至尊榜頂尖劍客，一人一劍，手持『春雷』蕩平天劍谷，天下武林無人不曉！神劍劍身一面刻“鳳年”，一面刻著“天狼”。",
          },
          {
            jh: "鐵雪山莊",
            loc: "燕谿阁",
            name: "阿不",
            way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;w;w;event_1_57281457",
            desc: "器宇軒昂，吐千丈淩雲之志氣。白衣黑發，雙手負於背後，立於巨巖之頂，直似神明降世。這是武林至尊榜第一高手，不世出的天才劍客，率『縱橫天下』幫獨尊江湖。手持一柄『穿林雨』長槍，槍柄上刻著一行小字：『歸去，也無風雨也無晴』。",
          },
          {
            jh: "鐵雪山莊",
            loc: "破虚石台",
            name: "男主角◆番茄",
            way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;w;n",
            desc: "江湖豪門『21世紀影業』的靈魂，當世絕頂高手之一，正在此潛心修練至上武學心法，立志要在這腥風血雨的江湖立下自己的聲威！",
          },
          {
            jh: "鐵雪山莊",
            loc: "沉剑渊",
            name: "剑仙",
            name_tw: "劍仙",
            way: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;w;w;sw",
            desc: "白須白發，仙風道骨，離世獨居的高人。",
          },
          {
            jh: "鐵雪山莊",
            loc: "球霸酒家",
            name: "小飞",
            name_tw: "小飛",
            way: "jh 31;n;se;e;se;s;w",
            desc: "『不落皇朝』的二當家，為人灑脫風趣，酷愛蹴鞠，酒量超群，以球入道。傳聞只要飲下三杯佳釀，帶醉出戰，那麼不論是踢全場、轉花枝、大小出尖，流星趕月，他都能憑藉出色的技藝獨佔鰲頭。",
          },
          { jh: "慕容山莊", loc: "", name: "家丁", way: "jh 32;n;n", desc: "一個穿著僕人服裝的家丁。" },
          { jh: "慕容山莊", loc: "", name: "邓家臣", name_tw: "鄧家臣", way: "jh 32;n;n;se", desc: "他是慕容家四大家臣之首，功力最為深厚。" },
          {
            jh: "慕容山莊",
            loc: "",
            name: "朱姑娘",
            way: "jh 32;n;n;se;e;s;s",
            desc: "這是個身穿紅衣的女郎，大約十七八歲，一臉精靈頑皮的神氣。一張鵝蛋臉，眼珠靈動，別有一番動人風韻。",
          },
          {
            jh: "慕容山莊",
            loc: "",
            name: "船工小厮",
            name_tw: "船工小廝",
            way: "jh 32;n;n;se;e;s;s;event_1_99232080",
            desc: "一位年輕的船工。表情看上去很消沉，不知道發生了什麼。",
          },
          {
            jh: "慕容山莊",
            loc: "",
            name: "芳绫",
            name_tw: "芳綾",
            way: "jh 32;n;n;se;e;s;s;event_1_99232080;e;e;s;e;s;e;e;e",
            desc: "她看起來像個小靈精，頭上梳兩個小包包頭。她坐在地上，看到你看她便向你作了個鬼臉!你想她一定是調皮才會在這受罰!",
          },
          {
            jh: "慕容山莊",
            loc: "",
            name: "无影斥候",
            name_tw: "無影斥候",
            way: "jh 32;n;n;se;e;s;s;event_1_99232080;e;e;s;e;s;e;e;e;n",
            desc: "經常在孔府徘徊的斥候。",
          },
          {
            jh: "慕容山莊",
            loc: "",
            name: "柳掌门",
            name_tw: "柳掌門",
            way: "jh 32;n;n;se;e;s;s;event_1_99232080;e;e;s;e;s;e;e;e;s;s;event_1_92057893;e;s;event_1_8205862",
            desc: "封山劍派掌門，看似中了某種迷香，昏昏沉沉的睡著。",
          },
          {
            jh: "慕容山莊",
            loc: "",
            name: "慕容老夫人",
            way: "jh 32;n;n;se;n",
            desc: "她身穿古銅緞子襖裙，腕帶玉鐲，珠翠滿頭，打扮的雍容華貴，臉上皺紋甚多，眼睛迷迷朦朦，似乎已經看不見東西。",
          },
          { jh: "慕容山莊", loc: "", name: "慕容侍女", way: "jh 32;n;n;se;n", desc: "一個侍女，年齡不大。" },
          { jh: "慕容山莊", loc: "", name: "公冶家臣", way: "jh 32;n;n;se;n;n", desc: "他是慕容家四大家臣之二，為人穩重。" },
          { jh: "慕容山莊", loc: "", name: "包家将", name_tw: "包家將", way: "jh 32;n;n;se;n;n;n;n", desc: "他是慕容家四大家臣之三，生性喜歡饒舌。" },
          { jh: "慕容山莊", loc: "", name: "风波恶", name_tw: "風波惡", way: "jh 32;n;n;se;n;n;n;n;n", desc: "他是慕容家四大家臣之四，最喜歡打架，輕易卻不服輸。" },
          { jh: "慕容山莊", loc: "", name: "慕容公子", way: "jh 32;n;n;se;n;n;n;n;w;w;n", desc: "他是姑蘇慕容的傳人，他容貌俊雅，風度過人，的確非尋常人可比。" },
          {
            jh: "慕容山莊",
            loc: "",
            name: "慕容家主",
            name_new: "燕浩宇",
            way: "jh 32;n;n;se;n;n;n;n;w;w;w;n;event_1_72278818;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;event_1_35141481;w",
            desc: "他是姑蘇慕容的傳人，可以說是自慕容龍城以下武功最為傑出之人。不僅能貫通天下百家之長，更是深為精通慕容家絕技。",
          },
          { jh: "慕容山莊", loc: "", name: "小兰", name_tw: "小蘭", way: "jh 32;n;n;se;n;n;n;n;w;w;w;n;w", desc: "這是一個蔓陀山莊的丫環。" },
          {
            jh: "慕容山莊",
            loc: "",
            name: "神仙姐姐",
            way: "jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;e",
            desc: "她秀美的面龐之上，端莊中帶有稚氣，隱隱含著一絲憂色。見你注目看她不覺低頭輕嘆。只聽得這輕輕一聲嘆息。霎時之間，你不由得全身一震，一顆心怦怦跳動。心想：“這一聲嘆息如此好聽，世上怎能有這樣的聲音？”聽得她唇吐玉音，更是全身熱血如沸！",
          },
          { jh: "慕容山莊", loc: "", name: "小茗", way: "jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;n", desc: "這是一個蔓陀山莊的丫環。" },
          {
            jh: "慕容山莊",
            loc: "",
            name: "王夫人",
            way: "jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;n",
            desc: "她身穿鵝黃綢衫，眉目口鼻均美豔無倫，臉上卻頗有風霜歲月的痕跡。",
          },
          {
            jh: "慕容山莊",
            loc: "",
            name: "严妈妈",
            name_tw: "嚴媽媽",
            way: "jh 32;n;n;se;n;n;n;n;w;w;w;n;w;n;e;n;e;n;w",
            desc: "一箇中年婦女，身上的皮膚黝黑，常年不見天日的結果。",
          },
          {
            jh: "大理",
            loc: "",
            name: "侍从",
            name_tw: "侍從",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;n;w;n",
            desc: "這位倒也打扮的利索，一身短打，白布包頭，翹起的褲腿，一雙潔白的布鞋，格外醒目。他正準備出去籌備白尼族一年一度的大會。",
          },
          { jh: "大理", loc: "", name: "摆夷女子", name_tw: "擺夷女子", way: "jh 33;sw;sw", desc: "她是一個身著白衣的擺夷女子，長發飄飄，身態娥娜。" },
          { jh: "大理", loc: "", name: "士兵", way: "jh 33;sw;sw;s;s", desc: "他是一個大理國禁衛軍士兵，身著錦衣，手執鋼刀，雙目精光炯炯，警惕地巡視著四週的情形。" },
          { jh: "大理", loc: "", name: "武将", name_tw: "武將", way: "jh 33;sw;sw;s;s", desc: "他站在那裡，的確有說不出的威風。" },
          {
            jh: "大理",
            loc: "下关城",
            name: "台夷商贩",
            name_tw: "台夷商販",
            way: "jh 33;sw;sw;s;s;s;nw;n",
            desc: "一位台夷族的商販，正在販賣一竹簍剛打上來的活蹦亂跳的鮮魚。",
          },
          { jh: "大理", loc: "", name: "乌夷商贩", name_tw: "烏夷商販", way: "jh 33;sw;sw;s;s;s;nw;n", desc: "一位烏夷族的商販，挑著一擔皮毛野味在販賣。" },
          { jh: "大理", loc: "", name: "土匪", way: "jh 33;sw;sw;s;s;s;nw;n;ne;n;n;ne", desc: "" },
          { jh: "大理", loc: "", name: "猎人", name_tw: "獵人", way: "jh 33;sw;sw;s;s;s;nw;n;nw;n", desc: "一位身強力壯的烏夷族獵手。" },
          { jh: "大理", loc: "", name: "皮货商", name_tw: "皮貨商", way: "jh 33;sw;sw;s;s;s;nw;n;nw;n", desc: "一位來遠道而來的漢族商人，來此採購皮貨。" },
          { jh: "大理", loc: "", name: "牧羊女", way: "jh 33;sw;sw;s;s;s;nw;n;nw;n;n;n;n;e;e", desc: "她是一個擺夷牧羊女子。" },
          { jh: "大理", loc: "", name: "牧羊人", way: "jh 33;sw;sw;s;s;s;nw;n;nw;n;n;n;n;e;e", desc: "他一個擺夷牧羊男子。" },
          { jh: "大理", loc: "", name: "僧人", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e", desc: "一個精壯僧人。" },
          {
            jh: "大理",
            loc: "",
            name: "贵公子",
            name_tw: "貴公子",
            way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e;e;e;e",
            desc: "這是一介翩翩貴公子，長得到也算玉樹臨風、一表人才，可偏偏一雙眼睛卻愛斜著瞟人。",
          },
          {
            jh: "大理",
            loc: "",
            name: "恶奴",
            name_tw: "惡奴",
            way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e;e;e;e",
            desc: "他看上去膀大腰粗，橫眉怒目，滿面橫肉。看來手下倒也有點功夫。",
          },
          {
            jh: "大理",
            loc: "",
            name: "枯大师",
            name_tw: "枯大師",
            way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;e;e;e;n",
            desc: "他的面容奇特之極，左邊的一半臉色紅潤，皮光肉滑，有如嬰兒，右邊的一半卻如枯骨，除了一張焦黃的麵皮之外全無肌肉，骨頭突了出來，宛然便是半個骷髏骨頭。這是他修習枯榮禪功所致。",
          },
          { jh: "大理", loc: "", name: "平通镖局镖头", name_tw: "平通鏢局鏢頭", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s", desc: "" },
          { jh: "大理", loc: "", name: "「平通镖局」镖头", name_tw: "「平通鏢局」鏢頭", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s", desc: "一個風塵僕僕的俠客。。" },
          {
            jh: "大理",
            loc: "",
            name: "游客",
            name_tw: "遊客",
            way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e",
            desc: "一個遠道來的漢族遊客，風塵僕僕，但顯然為眼前美景所動，興高彩烈。",
          },
          { jh: "大理", loc: "", name: "村妇", name_tw: "村婦", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e", desc: "一個年輕的擺夷村婦。" },
          { jh: "大理", loc: "", name: "段公子", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne", desc: "他是一個身穿青衫的年輕男子。臉孔略尖，自有一股書生的呆氣。" },
          { jh: "大理", loc: "罗伽甸", name: "农夫", name_tw: "農夫", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e", desc: "一位身強體壯的擺夷族農夫。" },
          {
            jh: "大理",
            loc: "阳宗镇",
            name: "台夷商贩",
            name_tw: "台夷商販",
            way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e",
            desc: "一個台夷婦女，揹著個竹簍販賣些絲織物品和手工藝品。",
          },
          { jh: "大理", loc: "", name: "老祭祀", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;ne;e;n", desc: "" },
          {
            jh: "大理",
            loc: "",
            name: "老祭司",
            way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;ne;e;n",
            desc: "一個頗老朽的擺夷老人，穿戴齊整，是本村的祭司，權力頗大，相當於族長。",
          },
          { jh: "大理", loc: "", name: "采桑女", name_tw: "採桑女", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;s", desc: "一個年輕的擺夷採桑姑娘。" },
          {
            jh: "大理",
            loc: "",
            name: "竹叶青蛇",
            name_tw: "竹葉青蛇",
            way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw",
            desc: "一隻讓人看了起雞皮疙瘩的竹葉青蛇。",
          },
          {
            jh: "大理",
            loc: "林中山涧",
            name: "采笋人",
            name_tw: "採筍人",
            way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s",
            desc: "一個壯年村民，住在數里外的村莊，背後背了個竹筐，手拿一把砍柴刀，上山來採竹筍。",
          },
          {
            jh: "大理",
            loc: "",
            name: "砍竹人",
            way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s;s",
            desc: "一個壯年村民，住在山下的村落裡，是上山來砍伐竹子的。",
          },
          {
            jh: "大理",
            loc: "",
            name: "养蚕女",
            name_tw: "養蠶女",
            way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s;s;e;e",
            desc: "一個年輕的擺夷村婦，養蠶紡絲為生。",
          },
          {
            jh: "大理",
            loc: "",
            name: "纺纱女",
            name_tw: "紡紗女",
            way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;e;e;e;ne;e;e;se;e;e;sw;s;s;e;n;e;n",
            desc: "一個年輕的擺夷村婦，心靈手巧，專擅紡紗。",
          },
          { jh: "大理", loc: "", name: "麻雀", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;s", desc: "一隻嘰嘰喳喳，飛來飛去的小麻雀。" },
          { jh: "大理", loc: "玉虚观前", name: "小道姑", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;s;w;n", desc: "玉虛觀的小道姑，她是在這接待香客的。" },
          { jh: "大理", loc: "", name: "刀俏尼", way: "jh 33;sw;sw;s;s;s;s;e;e;e;e;se;s;s;w;n", desc: "這是個容貌秀麗的中年道姑，是個擺夷族女子，頗有雍容氣質。" },
          { jh: "大理", loc: "", name: "毒蜂", way: "jh 33;sw;sw;s;s;s;s;e;e;n", desc: "一隻色彩斑斕大個野蜂，成群結隊的。" },
          { jh: "大理", loc: "", name: "傅护卫", name_tw: "傅護衛", way: "jh 33;sw;sw;s;s;s;s;s;e", desc: "他是大理國四大護衛之一。" },
          {
            jh: "大理",
            loc: "",
            name: "褚护卫",
            name_tw: "褚護衛",
            way: "jh 33;sw;sw;s;s;s;s;s;e;n",
            desc: "他是大理國四大護衛之一。身穿黃衣，臉上英氣逼人。手持一根鐵桿。",
          },
          { jh: "大理", loc: "", name: "家丁", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se", desc: "他是大理國鎮南王府的家丁。" },
          { jh: "大理", loc: "", name: "丹顶鹤", name_tw: "丹頂鶴", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e", desc: "一隻全身潔白的丹頂鶴，看來是修了翅膀，沒法高飛了。" },
          { jh: "大理", loc: "", name: "段王妃", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e", desc: "大理王妃，徐娘半老，風韻猶存。" },
          {
            jh: "大理",
            loc: "",
            name: "养花女",
            name_tw: "養花女",
            way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;e;e",
            desc: "一位養花少女，她每天就是照顧這數也數不清的茶花。",
          },
          { jh: "大理", loc: "", name: "段无畏", name_tw: "段無畏", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n", desc: "他是大理國鎮南王府管家。" },
          { jh: "大理", loc: "", name: "古护卫", name_tw: "古護衛", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n", desc: "" },
          { jh: "大理", loc: "", name: "王府御医", name_tw: "王府御醫", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n;n", desc: "一個風程僕僕的俠客。" },
          { jh: "大理", loc: "", name: "婉清姑娘", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n;n;ne;e;e;n", desc: "" },
          {
            jh: "大理",
            loc: "",
            name: "段皇爷",
            name_tw: "段皇爺",
            way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;n;n;n;ne;n",
            desc: "他就是大理國的鎮南王，當今皇太弟，是有名的愛情聖手。",
          },
          { jh: "大理", loc: "", name: "石人", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;e;e;s", desc: "一個練功用的比武石人，雕鑿得很精細，如同真人一般。" },
          { jh: "大理", loc: "", name: "范司马", name_tw: "範司馬", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;n;e", desc: "他是大理國三公之一。" },
          { jh: "大理", loc: "", name: "巴司空", way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;n;n", desc: "他是大理國三公之一。一個又瘦又黑的漢子，但他的擅長輕功。" },
          {
            jh: "大理",
            loc: "",
            name: "华司徒",
            name_tw: "華司徒",
            way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;n;w",
            desc: "他是大理國三大公之一。華司徒本名阿根，出身貧賤，現今在大理國位列三公，未發跡時，幹部的卻是盜墓掘墳的勾當，最擅長的本領是偷盜王公巨賈的墳墓。這些富貴人物死後，必有珍異寶物殉葬，華阿根從極遠處挖掘地道，通入墳墓，然後盜取寶物。所花的一和雖巨，卻由此而從未為人發覺。有一次他掘入一墳，在棺木中得到了一本殉葬的武功秘訣，依法修習，練成了一身卓絕的外門功夫，便捨棄了這下賤的營生，輔佐保定帝，累立奇功，終於升到司徒之職。",
          },
          {
            jh: "大理",
            loc: "",
            name: "霍先生",
            way: "jh 33;sw;sw;s;s;s;s;s;e;n;se;w",
            desc: "他一身邋遢，形容委瑣，整天迷迷糊糊的睡不醒模樣。可是他的賬務十幾年來無可挑剔。原來他就是伏牛派的崔百泉，為避仇禍隱居於此。",
          },
          { jh: "大理", loc: "", name: "石匠", way: "jh 33;sw;sw;s;s;s;s;s;s;e;e", desc: "他是一個打磨大理石的石匠，身上只穿了一件坎肩，全身佈滿了厚實的肌肉。" },
          {
            jh: "大理",
            loc: "",
            name: "薛老板",
            name_tw: "薛老闆",
            way: "jh 33;sw;sw;s;s;s;s;s;s;e;n",
            desc: "這是一個經驗老到的生意人，一雙精明的眼睛不停的打量著你。",
          },
          {
            jh: "大理",
            loc: "",
            name: "江湖艺人",
            name_tw: "江湖藝人",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s",
            desc: "他是一個外地來的江湖藝人，手裡牽著一隻金絲猴兒，滿臉風塵之色。",
          },
          { jh: "大理", loc: "太和居", name: "店小二", way: "jh 33;sw;sw;s;s;s;s;s;s;s;e", desc: "這位店小二正笑咪咪地忙著，還不時拿起掛在脖子上的抹布擦臉。" },
          { jh: "大理", loc: "", name: "歌女", way: "jh 33;sw;sw;s;s;s;s;s;s;s;e;n", desc: "她是一個賣唱為生的歌女。" },
          {
            jh: "大理",
            loc: "",
            name: "南国姑娘",
            name_tw: "南國姑娘",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;e;s",
            desc: "南國的大姑娘頗帶有當地優美秀麗山水的風韻，甜甜的笑，又有天真的浪漫。她穿著白色上衣，藍色的寬褲，外面套著黑絲絨領褂，頭上纏著彩色的頭巾。",
          },
          {
            jh: "大理",
            loc: "",
            name: "摆夷老叟",
            name_tw: "擺夷老叟",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;e;s",
            desc: "一個擺夷老叟大大咧咧地坐在竹籬板舍門口，甩著三四個巴掌大的棕呂樹葉，瞧著道上來來往往的人們，倒也快活自在。",
          },
          {
            jh: "大理",
            loc: "",
            name: "大土司",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;n;w;n",
            desc: "大土司是擺夷族人氏，是蒼山納蘇系的。他倒是長的肥頭大耳的，每說一句話，每有一點表情，滿臉的肉紋便象是洱海里的波浪一樣。他身著綵綢，頭帶鳳羽，腳踩藤鞋，滿身掛著不同色彩的貝殼。只見他傲氣凜然地高居上座，不把來人看在眼裡。",
          },
          {
            jh: "大理",
            loc: "",
            name: "族头人",
            name_tw: "族頭人",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;n;w;n;se;ne",
            desc: "這位是哈尼的族頭人，哈尼是大理國的第三大族，大多聚在大都附近。此人貌甚精明，身穿對襟衣，亦是白布包頭。他坐在大土司的右下首，對來人細細打量著。",
          },
          {
            jh: "大理",
            loc: "",
            name: "黄衣卫士",
            name_tw: "黃衣衛士",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;n;w;s",
            desc: "這是位黃衣衛士，身著錦衣，手執鋼刀，雙目精光炯炯，警惕地巡視著四週的情形。",
          },
          {
            jh: "大理",
            loc: "",
            name: "盛皮罗客商",
            name_tw: "盛皮羅客商",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s",
            desc: "這是一位從印度來的客商，皮膚黝黑，白布包頭，大理把印度人叫作盛皮羅。",
          },
          { jh: "大理", loc: "客店", name: "店小二", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;e", desc: "這位店小二正笑咪咪地忙著，還不時拿起掛在脖子上的抹布擦臉。" },
          {
            jh: "大理",
            loc: "",
            name: "古灯大师",
            name_tw: "古燈大師",
            name_new: "段氏南僧",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s",
            desc: "他身穿粗布僧袍，兩道長長的白眉從眼角垂了下來，面目慈祥，長須垂肩，眉間雖隱含愁苦，但一番雍容高華的神色，卻是一望而知。大師一生行善，積德無窮。",
          },
          {
            jh: "大理",
            loc: "",
            name: "族长",
            name_tw: "族長",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;e;n;n",
            desc: "一位滿臉皺紋的老年婦女，正是本村的族長。台夷時處母系氏族，族中權貴皆為婦女。",
          },
          {
            jh: "大理",
            loc: "",
            name: "祭司",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;e;n;n;n",
            desc: "一位滿臉皺紋的老年婦女，是本村的大祭司，常年司守祭台。台夷時處母系氏族，祭司要職皆為婦女。",
          },
          { jh: "大理", loc: "", name: "祭祀", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;s;e;n;n;n", desc: "" },
          {
            jh: "大理",
            loc: "",
            name: "渔夫",
            name_tw: "漁夫",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;se;sw;n",
            desc: "一位台夷族的漁夫，扛這兩條竹槳，提著一個魚簍。",
          },
          {
            jh: "大理",
            loc: "",
            name: "台夷猎人",
            name_tw: "台夷獵人",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;se;sw;s",
            desc: "一位台夷族的獵手，擅用短弩，射飛鳥。",
          },
          {
            jh: "大理",
            loc: "",
            name: "台夷妇女",
            name_tw: "台夷婦女",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;s;se;sw;w",
            desc: "一位中年的台夷婦女，上著無領襯花對襟，下穿五色筒裙，正在編織漁網。",
          },
          {
            jh: "大理",
            loc: "",
            name: "台夷姑娘",
            name_tw: "台夷姑娘",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw",
            desc: "一位年輕的台夷姑娘，上著無領襯花對襟，下穿五色筒裙。",
          },
          {
            jh: "大理",
            loc: "竹楼下",
            name: "水牛",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw;n",
            desc: "一頭南方山區常見的水牛，是耕作的主力，也用來拉車載物。由於水草茂盛，長得十分肥壯。",
          },
          {
            jh: "大理",
            loc: "",
            name: "台夷农妇",
            name_tw: "台夷農婦",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw;s",
            desc: "一位年輕的台夷農婦，在田裡辛勤地勞作著。",
          },
          {
            jh: "大理",
            loc: "青竹林",
            name: "采笋人",
            name_tw: "採筍人",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;s;s;s;sw;sw;w",
            desc: "一個盧鹿部的青年台夷婦女，背後背了個竹筐，手拿一把砍柴刀，來採竹筍。",
          },
          { jh: "大理", loc: "", name: "野兔", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;se", desc: "一隻好可愛的小野兔。" },
          { jh: "大理", loc: "", name: "侍者", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se", desc: "他看上去長的眉清目秀。" },
          {
            jh: "大理",
            loc: "",
            name: "高侯爷",
            name_tw: "高侯爺",
            way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n",
            desc: "大理國侯爺，這是位寬袍大袖的中年男子，三縷長髯，形貌高雅",
          },
          { jh: "大理", loc: "", name: "素衣卫士", name_tw: "素衣衛士", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n", desc: "這是位身懷絕技的武士。" },
          { jh: "大理", loc: "", name: "傣族首领", name_tw: "傣族首領", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n;n;e;e;se", desc: "" },
          { jh: "大理", loc: "", name: "陪从", name_tw: "陪從", way: "jh 33;sw;sw;s;s;s;s;s;s;s;s;s;s;w;w;se;n;n;w;se", desc: "" },
          { jh: "大理", loc: "", name: "摆夷小孩", name_tw: "擺夷小孩", way: "jh 33;sw;sw;s;s;s;s;s;s;w", desc: "一個幼小的擺夷兒童。" },
          {
            jh: "大理",
            loc: "",
            name: "锦衣卫士",
            name_tw: "錦衣衛士",
            way: "jh 33;sw;sw;s;s;s;s;s;w",
            desc: "這是位錦衣衛士，身著錦衣，手執鋼刀，雙目精光炯炯，警惕地巡視著四週的情形。",
          },
          { jh: "大理", loc: "", name: "朱护卫", name_tw: "朱護衛", way: "jh 33;sw;sw;s;s;s;s;s;w", desc: "他是大理國四大護衛之一。一副書生酸溜溜的打扮行頭。" },
          { jh: "大理", loc: "", name: "太监", name_tw: "太監", way: "jh 33;sw;sw;s;s;s;s;s;w;n;n", desc: "一個風塵僕僕的俠客。。" },
          {
            jh: "大理",
            loc: "",
            name: "宫女",
            name_tw: "宮女",
            way: "jh 33;sw;sw;s;s;s;s;s;w;n;n;n;n",
            desc: "一位大理皇宮烏夷族宮女，以酥澤發，盤成兩環，一身宮裝，目無表情。",
          },
          { jh: "大理", loc: "", name: "破嗔", way: "jh 33;sw;sw;s;s;s;s;w;w;n", desc: "他是一個和尚，是黃眉大師的二弟子。" },
          { jh: "大理", loc: "", name: "破疑", way: "jh 33;sw;sw;s;s;s;s;w;w;n", desc: "他是一個和尚，是黃眉大師的大弟子。" },
          {
            jh: "大理",
            loc: "",
            name: "段恶人",
            name_tw: "段惡人",
            way: "jh 33;sw;sw;s;s;s;s;w;w;n;se",
            desc: "他身穿一件青布長袍，身高五尺有餘，臉上常年戴一張人皮面具，喜怒哀樂一絲不露。",
          },
          {
            jh: "大理",
            loc: "",
            name: "神农帮弟子",
            name_tw: "神農幫弟子",
            way: "jh 33;sw;sw;s;s;s;s;w;w;s",
            desc: "這是一個神農幫的幫眾，身穿黃衣，肩懸藥囊，手持一柄藥鋤。",
          },
          {
            jh: "大理",
            loc: "",
            name: "无量剑弟子",
            name_tw: "無量劍弟子",
            way: "jh 33;sw;sw;s;s;s;s;w;w;s;nw",
            desc: "這是無量劍派的一名弟子，腰挎一柄長劍，神情有些鬼祟，象是懼怕些什麼。",
          },
          { jh: "大理", loc: "", name: "吴道长", name_tw: "吳道長", way: "jh 33;sw;sw;s;s;s;s;w;w;w;w", desc: "一個看起來道風仙骨的道士。" },
          {
            jh: "大理",
            loc: "",
            name: "(镇雄)农夫",
            name_tw: "(鎮雄)農夫",
            way: "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;e",
            desc: "一位烏夷族的農夫，束發總於腦後，用布紗包著，上半身裸露，下著獸皮。",
          },
          { jh: "大理", loc: "", name: "农夫", name_tw: "農夫", way: "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;e", desc: "" },
          { jh: "大理", loc: "", name: "山羊", way: "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;n", desc: "一頭短角山羊，大理地區常見的家畜。" },
          { jh: "大理", loc: "", name: "少女", way: "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;ne", desc: "一位烏夷族的少女，以酥澤發，盤成兩環，上披藍紗頭巾，飾以花邊。" },
          { jh: "大理", loc: "", name: "乌夷老祭祀", name_tw: "烏夷老祭祀", way: "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;w;se", desc: "" },
          {
            jh: "大理",
            loc: "",
            name: "乌夷老祭司",
            name_tw: "烏夷老祭司",
            way: "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;n;w;se",
            desc: "一個烏夷族的祭司，身披烏夷大麾，戴著頗多金銀飾物，顯示其地位不凡。",
          },
          { jh: "大理", loc: "", name: "孟加拉虎", way: "jh 33;sw;sw;s;s;s;s;w;w;w;w;w;s;s;w;w", desc: "一隻斑斕孟加拉虎，雄偉極了。" },
          { jh: "斷劍山莊", loc: "", name: "黑袍老人", way: "jh 34;ne;e;e;e;e;e;n;e;n", desc: "一生黑裝的老人。" },
          { jh: "斷劍山莊", loc: "", name: "白袍老人", way: "jh 34;ne;e;e;e;e;e;n;e;n", desc: "一生白裝的老人。" },
          { jh: "斷劍山莊", loc: "", name: "尼姑", way: "jh 34;ne;e;e;e;e;e;n;n;n;n;n;n;e", desc: "一個正虔誠唸經的尼姑。" },
          { jh: "斷劍山莊", loc: "", name: "和尚", way: "jh 34;ne;e;e;e;e;e;n;n;n;n;n;w", desc: "出了家的人，唯一做的事就是念經了。" },
          { jh: "斷劍山莊", loc: "", name: "摆渡老人", name_tw: "擺渡老人", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell", desc: "一個飽經風霜的擺渡老人。" },
          {
            jh: "斷劍山莊",
            loc: "",
            name: "天怒剑客",
            name_tw: "天怒劍客",
            way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;e;e",
            desc: "他是獨孤求敗的愛徒，但他和師傅的性格相差極遠。他從不苟言笑，他的臉永遠冰冷，只因他已看透了世界，只因他殺的人已太多。他永遠只在殺人的時候微笑，當劍尖穿過敵人的咽喉，他那燦爛的一笑令人感到溫暖，只因他一向認為——死者無罪！",
          },
          { jh: "斷劍山莊", loc: "", name: "栽花老人", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n", desc: "一個飽經風霜的栽花老人。" },
          { jh: "斷劍山莊", loc: "", name: "背刀人", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;e;e", desc: "此人揹著一把生鏽的刀，他似乎姓浪，武功深不可測。" },
          {
            jh: "斷劍山莊",
            loc: "",
            name: "雁南飞",
            name_tw: "雁南飛",
            way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;e;n;e",
            desc: "這是一個絕美的女子，正在靜靜地望著天上的圓月。她的臉美麗而憂傷，憂傷得令人心碎。",
          },
          { jh: "斷劍山莊", loc: "", name: "剑癡", name_tw: "劍癡", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;n;n;n", desc: "他是劍癡，劍重要過他的生命。" },
          {
            jh: "斷劍山莊",
            loc: "",
            name: "独孤不败",
            name_tw: "獨孤不敗",
            name_new: "劍魔求敗",
            way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;n;n;n;e;e;event_1_10251226",
            desc: "這就是一代劍帝獨孤求敗。獨孤求敗五歲練劍，十歲就已經罕有人能敵。被江湖稱為劍術天才。",
          },
          {
            jh: "斷劍山莊",
            loc: "",
            name: "雾中人",
            name_tw: "霧中人",
            way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;n;n;n;n",
            desc: "這個人全身都是模糊的，彷彿是一個並不真正存在的影子。只因他一生都生活在霧中，霧朦朧，人亦朦朧。",
          },
          {
            jh: "斷劍山莊",
            loc: "",
            name: "梦如雪",
            name_tw: "夢如雪",
            way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;n;n;w;w",
            desc: "這是一個尋夢的人。他已厭倦事實。他只有尋找曾經的夢，不知道這算不算是一種悲哀呢？",
          },
          { jh: "斷劍山莊", loc: "", name: "落魄中年", way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;w;s", desc: "一位落魄的中年人，似乎是一位鐵匠。" },
          {
            jh: "斷劍山莊",
            loc: "",
            name: "摘星老人",
            way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;w;s;w",
            desc: "他站在這裡已經有幾十年了。每天看天上劃過的流星，已經完全忘記了一切……甚至他自己。",
          },
          {
            jh: "斷劍山莊",
            loc: "",
            name: "任笑天",
            way: "jh 34;ne;e;e;e;e;e;n;n;n;w;w;w;n;n;yell;n;n;w;w",
            desc: "這是一箇中年男子。正靜靜地站著，雙目微閉，正在聽海！",
          },
          {
            jh: "冰火島",
            loc: "",
            name: "蓬面老头",
            name_tw: "蓬面老頭",
            way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632",
            desc: "蓬頭垢面，衣服千絲萬縷，顯然被關在這裡已經很久了。",
          },
          {
            jh: "冰火島",
            loc: "",
            name: "火麒麟王",
            way: "jh 35;nw;nw;nw;n;ne;nw",
            desc: "渾身充滿灼熱的氣息，嘴巴可吐出高溫烈焰，擁有強韌的利爪以及鋒利的尖齒，是主宰冰火島上的獸王。島上酷熱的火山地帶便是他的領地，性格極其兇殘，會將所看到闖入其領地的生物物焚燒殆盡。",
          },
          {
            jh: "冰火島",
            loc: "",
            name: "游方道士",
            name_tw: "遊方道士",
            way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e",
            desc: "一名雲遊四海的道士，頭束白色發帶，身上的道袍頗為殘舊，背馱著一個不大的行囊，臉上的皺紋顯示飽經風霜的遊歷，雙目卻清澈異常，彷彿包容了天地。",
          },
          {
            jh: "冰火島",
            loc: "",
            name: "梅花鹿",
            way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e",
            desc: "一身赭黃色的皮毛，背上還有許多像梅花白點。頭上岔立著的一雙犄角，看上去頗有攻擊性。行動十分機敏。",
          },
          {
            jh: "冰火島",
            loc: "大冰原",
            name: "赵郡主",
            name_tw: "趙郡主",
            way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n",
            desc: "天下兵馬大元帥汝陽王之女，大元第一美人。明豔不可方物，豔麗非凡，性格精靈俊秀，直率豪爽，對張大教主一往情深，為愛放棄所有與其共赴冰焰島廝守終身。",
          },
          {
            jh: "冰火島",
            loc: "",
            name: "谢狮王",
            name_tw: "謝獅王",
            way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;ne;n",
            desc: "他就是明教的四大護法之一的金毛獅王。他身材魁偉異常，滿頭金發散披肩頭。但雙目已瞎。在你面前一站，威風凜凜，真如天神一般。",
          },
          {
            jh: "冰火島",
            loc: "",
            name: "白熊",
            way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;ne",
            desc: "全身長滿白色長毛，雙爪極度鋒利，身材頗為剽悍，十分嗜血狂暴。是冰焰島上最強的獵食者。",
          },
          {
            jh: "冰火島",
            loc: "",
            name: "黑衣杀手",
            name_tw: "黑衣殺手",
            way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;nw",
            desc: "穿著極其神秘的黑衣人，黑色的面巾遮住了他的面容。武功十分高強。",
          },
          {
            jh: "冰火島",
            loc: "冰火裂谷",
            name: "杀手头目",
            name_tw: "殺手頭目",
            way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;nw;sw;se;s;sw;sw;se",
            desc: "頗為精明能幹。閃爍的雙眼散發毋容置疑的威望。乃是這群不明來歷黑衣人的統領頭目。",
          },
          {
            jh: "冰火島",
            loc: "冰火裂谷",
            name: "黑衣杀手",
            name_tw: "黑衣殺手",
            way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;nw;sw;se;s;sw;sw;se",
            desc: "穿著極其神秘的黑衣人，黑色的面巾遮住了他的面容。武功十分高強。",
          },
          {
            jh: "冰火島",
            loc: "冰火裂谷",
            name: "元真和尚",
            way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;nw;sw;se;s;sw;sw;se;se",
            desc: "此人武功極高，極富智謀，心狠手辣殺人如麻。因與前明教教主私怨而惱羞成怒，出家剃度意圖挑撥江湖各大派，以達殲滅明教顛覆武林之目的。與謝獅王也有過一段不為人知的恩怨情仇。",
          },
          {
            jh: "冰火島",
            loc: "",
            name: "雪狼",
            way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw",
            desc: "毛色淨白，眼瞳紅如鮮血，牙齒十分銳利，身形巨大強壯，速度極快。天性狡猾，通常都是群體出動。",
          },
          {
            jh: "冰火島",
            loc: "",
            name: "殷夫人",
            way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw;s;s;s;s;s;s;e",
            desc: "此女容貌嬌豔無倫，雖已過中年但風采依稀不減。為人任性長情，智計百出，武功十分了得。立場亦正亦邪。乃張五俠結發妻子，張大教主親生母親。",
          },
          {
            jh: "冰火島",
            loc: "",
            name: "张五侠",
            name_tw: "張五俠",
            way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;s;se;w;nw;s;s;s;s;s;s;w;w;n;e;n;w;w;s;s",
            desc: "在武當七俠之中排行第五，人稱張五俠。雖人已過中年，但臉上依然俊秀。為人彬彬有禮，謙和中又遮不住激情如火的風發意氣。可謂文武雙全，乃現任張大教主的親生父親。",
          },
          {
            jh: "冰火島",
            loc: "",
            name: "火麒麟",
            way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;n;nw",
            desc: "磷甲刀槍不入，四爪孔武有力速度奇快。渾身能散發極高溫的火焰，喜熱厭冷，嗜好吞噬火山晶元。現居於冰焰島火山一側。",
          },
          { jh: "冰火島", loc: "", name: "麒麟幼崽", way: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;n;nw", desc: "火麒麟的愛子，生人勿近。" },
          { jh: "俠客島", loc: "", name: "丁三", way: "", desc: "一個鶴發童顏的老頭，穿得荒誕不經，但看似武功十分了得。" },
          { jh: "俠客島", loc: "", name: "侠客岛厮仆", name_tw: "俠客島廝僕", way: "jh 36;yell", desc: "他是島上的一個僕人，手底下似乎很有兩下子。" },
          { jh: "俠客島", loc: "", name: "黄衣船夫", name_tw: "黃衣船夫", way: "jh 36;yell", desc: "這是個身著黃衣的三十幾歲漢子，手持木槳，面無表情。" },
          {
            jh: "俠客島",
            loc: "",
            name: "张三",
            name_tw: "張三",
            way: "jh 36;yell;e",
            desc: "乃江湖傳聞中賞善罰惡使者之一，其精明能幹，為人大公無私。但平時大大咧咧表情十分滑稽。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "云游高僧",
            name_tw: "雲遊高僧",
            way: "jh 36;yell;e;ne;ne",
            desc: "一位雲遊四方的行者，風霜滿面，行色匆匆，似乎正在辦一件急事。",
          },
          { jh: "俠客島", loc: "", name: "马六", name_tw: "馬六", way: "jh 36;yell;e;ne;ne;ne;e;e", desc: "他身材魁梧，圓臉大耳，笑嘻嘻地和藹可親。" },
          {
            jh: "俠客島",
            loc: "",
            name: "侠客岛弟子",
            name_tw: "俠客島弟子",
            way: "jh 36;yell;e;ne;ne;ne;e;e",
            desc: "這是身材魁梧的壯漢，膀大腰圓，是島主從中原招募來的。力氣十分之大。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "龙岛主",
            name_tw: "龍島主",
            way: "jh 36;yell;e;ne;ne;ne;e;e;e",
            desc: "就是天下聞之色變的俠客島島主，號稱“不死神龍”。他須眉全白，臉色紅潤，有如孩童。看不出他的實際年紀。",
          },
          { jh: "俠客島", loc: "", name: "童子", way: "jh 36;yell;e;ne;ne;ne;e;e;e", desc: "這是一個十五六歲的少年，眉清目秀，聰明伶俐，深得島主喜愛。" },
          { jh: "俠客島", loc: "", name: "侍者", way: "jh 36;yell;e;ne;ne;ne;e;e;e;e", desc: "這是個身著黃衣的三十幾歲漢子，垂手站立，面無表情。" },
          {
            jh: "俠客島",
            loc: "",
            name: "史婆婆",
            way: "jh 36;yell;e;ne;ne;ne;e;e;e;e;e",
            desc: "她是雪山派白掌門的妻子，雖說現在人已顯得蒼老，但幾十年前提起“江湖一枝花”史小妹來，武林中卻是無人不知。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "谢居士",
            name_tw: "謝居士",
            way: "jh 36;yell;e;ne;ne;ne;e;e;e;e;e;e;n;e;e;ne",
            desc: "他就是摩天崖的主人。是個亦正亦邪的高手，但信守承諾，年輕時好武成興，無比驕傲，自認為天下第一。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "矮老者",
            way: "jh 36;yell;e;ne;ne;ne;e;e;e;e;e;e;n;n;n;e;ne;nw",
            desc: "此老身軀矮小，但氣度非凡，令人不敢小窺。他與其師弟高老者閉關已久，江湖上鮮聞其名。武功之高，卻令人震驚。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "高老者",
            way: "jh 36;yell;e;ne;ne;ne;e;e;e;e;e;e;n;n;n;e;ne;nw;w",
            desc: "他身形高大碩狀，滿面紅光。舉止滑稽，帶點傻氣，武功卻是極高。他因不常在江湖上露面，是以並非太多人知聞其名。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "朱熹",
            way: "jh 36;yell;e;ne;ne;ne;e;e;e;e;e;e;n;n;n;w;w",
            desc: "他是個精通詩理的學者，原本是被逼而來到俠客島，但學了武功後死心塌地的留了下來。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "木岛主",
            name_tw: "木島主",
            way: "jh 36;yell;e;ne;ne;ne;e;e;e;fly;e",
            desc: "他就是天下聞之色變的俠客島島主，號稱“葉上秋露”。只見他長須稀稀落落，兀自黑多白少，但一張臉卻滿是皺紋。看不出他的實際年紀。",
          },
          { jh: "俠客島", loc: "", name: "蓝衣弟子", name_tw: "藍衣弟子", way: "jh 36;yell;e;ne;ne;ne;e;e;n", desc: "她是木島主的女弟子，專管傳授島上弟子的基本功夫。" },
          {
            jh: "俠客島",
            loc: "",
            name: "李四",
            way: "jh 36;yell;e;ne;ne;ne;e;e;n",
            desc: "身形甚高，但十分瘦削，留一撇鼠尾須，臉色陰沉。就是江湖傳聞中賞善罰惡使者之一，其精明能幹，但總是陰沉著臉。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "石公子",
            way: "jh 36;yell;e;ne;ne;ne;e;n",
            desc: "這是一個年輕公子，面若中秋之月，色如春曉之花，鬢若刀裁，眉如墨畫，鼻如懸膽，情若秋波，雖怒而時笑，即視而有情。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "书生",
            name_tw: "書生",
            way: "jh 36;yell;e;ne;ne;ne;e;n",
            desc: "他看過去像個落泊的書生，呆頭呆腦的一付書呆子的樣子。但只要你留心，你就發現他兩眼深沉，而且腰掛一把長劍。",
          },
          { jh: "俠客島", loc: "", name: "丁当", name_tw: "丁當", way: "jh 36;yell;e;ne;ne;ne;e;n;n", desc: "一個十七八歲的少女，身穿淡綠衫子，一張瓜子臉，秀麗美豔。" },
          {
            jh: "俠客島",
            loc: "",
            name: "白掌门",
            name_tw: "白掌門",
            way: "jh 36;yell;e;ne;ne;ne;e;n;w",
            desc: "他就是雪山劍派的掌門人，習武成性，自認為天下武功第一，精明能幹，嫉惡如仇，性如烈火。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "白衣弟子",
            way: "jh 36;yell;e;ne;ne;ne;e;s",
            desc: "乃俠客島龍島主門下的一個弟子。身上穿著洗得發白的錦衣，頭上帶著秀才帽，一臉的書呆子氣，怎麼看也不象是個武林中人。",
          },
          { jh: "俠客島", loc: "", name: "王五", way: "jh 36;yell;e;ne;ne;ne;e;s", desc: "他大約二十多歲，精明能幹，笑嘻嘻的和藹可親。" },
          { jh: "俠客島", loc: "", name: "店小二", way: "jh 36;yell;e;ne;ne;ne;e;s;e", desc: "位店小二正笑咪咪地忙著，還不時拿起掛在脖子上的抹布擦臉。" },
          { jh: "俠客島", loc: "", name: "侠客岛闲人", name_tw: "俠客島閒人", way: "jh 36;yell;e;ne;ne;ne;e;s;w", desc: "他是島上一個遊手好閒的人。不懷好意。" },
          { jh: "俠客島", loc: "", name: "小猴子", way: "jh 36;yell;e;se;e", desc: "一隻機靈的猴子，眼巴巴的看著你，大概想討些吃的。" },
          { jh: "俠客島", loc: "", name: "樵夫", way: "jh 36;yell;e;se;e;e", desc: "一個一輩子以砍材為生的老樵夫，由於飽受風霜，顯出與年齡不相稱的衰老。" },
          {
            jh: "俠客島",
            loc: "",
            name: "医者",
            name_tw: "醫者",
            way: "jh 36;yell;e;se;e;e;e;e",
            desc: "一位白發銀須的老者。據說當年曾經是江湖上一位著名的神醫。'但自從來到俠客島上後，隱姓埋名，至今誰也不知道他真名是甚麼了。'他看起來懶洋洋的，你要是想請他療傷的話恐怕不那麼容易。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "石帮主",
            name_tw: "石幫主",
            way: "jh 36;yell;e;se;e;e;n;e;s",
            desc: "為人忠厚老實，性情溫和，天賦極高，記性極好。穿著一身破爛的衣服，卻也擋不住他一身的英氣。似乎身懷絕世武功。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "渔家少女",
            name_tw: "漁家少女",
            way: "jh 36;yell;e;se;e;e;s;s;s;e",
            desc: "這是個漁家少女，雖然只有十二、三歲，但身材已經發育得很好了，眼睛水汪汪很是誘人。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "阅书老者",
            name_tw: "閱書老者",
            way: "jh 36;yell;e;se;e;e;s;s;s;e;ne",
            desc: "一個精神矍爍的老者，他正手持書籍，穩站地上，很有姜太公之風。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "青年海盗",
            name_tw: "青年海盜",
            way: "jh 36;yell;e;se;e;e;s;s;s;e;ne;e;e;n",
            desc: "一個青年海盜，頗為精壯，，眼角中展露出了兇相。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "老海盗",
            name_tw: "老海盜",
            way: "jh 36;yell;e;se;e;e;s;s;s;e;ne;e;e;n;e;n;e;n",
            desc: "一個年老的海盜，雖然鬍子一大把了，但還是兇巴巴的。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "渔夫",
            name_tw: "漁夫",
            way: "jh 36;yell;e;se;e;e;s;s;s;s",
            desc: "看過去像個平平凡凡的漁夫，臉和赤裸的臂膀都曬得黑黑的。但只要你留心，你就發現他兩眼深沉，而且腰掛一把長劍。",
          },
          {
            jh: "俠客島",
            loc: "",
            name: "渔家男孩",
            name_tw: "漁家男孩",
            way: "jh 36;yell;e;se;e;e;s;s;s;w",
            desc: "這是個漁家少年，大概由於長期在室外的緣故，皮膚已曬得黝黑，人也長得很粗壯了。",
          },
          { jh: "俠客島", loc: "", name: "野猪", name_tw: "野豬", way: "jh 36;yell;e;se;e;e;w", desc: "這是一隻兇猛的野豬，長得極為粗壯，嘴裡還不斷發出可怕的哄聲。" },
          { jh: "絕情谷", loc: "", name: "冰蛇", way: "jh 37;n;e;e;nw;nw;w;n;nw;n;n;ne;n;nw;sw;event_1_12492702", desc: "身體猶如冰塊透明般的蛇。" },
          { jh: "絕情谷", loc: "", name: "千年寒蛇", way: "jh 37;n;e;e;nw;nw;w;n;nw;n;n;ne;n;nw;sw;event_1_12492702", desc: "一條通體雪白的大蛇。" },
          { jh: "絕情谷", loc: "", name: "土匪", way: "jh 37;n", desc: "在山谷下燒傷搶掠的惡人。" },
          { jh: "絕情谷", loc: "", name: "村民", way: "jh 37;n;e;e", desc: "世代生活於此的人，每日靠著進山打打獵生活。" },
          {
            jh: "絕情谷",
            loc: "",
            name: "雪若云",
            name_tw: "雪若雲",
            way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;event_1_16813927",
            desc: "身著黑色紗裙，面容精緻秀美，神色冷若冰雪，嘴角卻隱隱透出一股溫暖的笑意。現在似是在被仇家圍攻，已是身受重傷。",
          },
          { jh: "絕情谷", loc: "", name: "养鳄人", name_tw: "養鱷人", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se", desc: "飼養鱷魚的年輕漢子。" },
          {
            jh: "絕情谷",
            loc: "",
            name: "鳄鱼",
            name_tw: "鱷魚",
            way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se",
            desc: "悠閒的在鱷魚潭邊休息，看似人畜無害，但是無人敢靠近它們。",
          },
          {
            jh: "絕情谷",
            loc: "",
            name: "囚犯",
            way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;s;s;s",
            desc: "被關押在暗無天日的地牢內，落魄的樣子無法讓你聯想到他們曾是江湖好漢。",
          },
          { jh: "絕情谷", loc: "", name: "地牢看守", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;s;s;s;w", desc: "看守著地牢的武者，一臉嚴肅，不知道在想些什麼。" },
          {
            jh: "絕情谷",
            loc: "",
            name: "天竺大师",
            name_tw: "天竺大師",
            way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w",
            desc: "在絕情谷中研究怎麼破解情花之毒的醫學聖手。",
          },
          { jh: "絕情谷", loc: "", name: "养花女", name_tw: "養花女", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n", desc: "照顧著絕情谷的花花草草的少女。" },
          { jh: "絕情谷", loc: "", name: "侍女", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n", desc: "好色的絕情谷谷主從來劫來的少女。" },
          {
            jh: "絕情谷",
            loc: "",
            name: "拓跋嗣",
            way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne",
            desc: "鮮卑皇族後裔，自幼就表現出過人的軍事天賦，十七歲時就遠赴河套抗擊柔然騎兵，迫使柔然不敢入侵。",
          },
          {
            jh: "絕情谷",
            loc: "",
            name: "没藏羽无",
            name_tw: "沒藏羽無",
            way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne;e",
            desc: "多權謀，善用計，所率西夏堂刺客素以神鬼莫測著稱，讓對頭心驚膽戰。",
          },
          {
            jh: "絕情谷",
            loc: "",
            name: "野利仁嵘",
            name_tw: "野利仁嶸",
            way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne;e;ne",
            desc: "西夏皇族後裔，黑道威名赫赫的殺手頭領，決策果斷，部署週密，講究戰法，神出鬼沒。",
          },
          {
            jh: "絕情谷",
            loc: "",
            name: "嵬名元昊",
            way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;ne;e;ne;se",
            desc: "一副圓圓的面孔，炯炯的目光下，鷹勾鼻子聳起，剛毅中帶著幾分凜然不可侵犯的神態。中等身材，卻顯得魁梧雄壯，英氣逼人。平素喜穿白色長袖衣，頭戴黑色冠帽，身佩弓矢。此人城府心機深不可測，憑藉一身最驚世駭俗的的錘法位居西夏堂最處尊居顯之位，力圖在天波楊門與燕雲世家三方互相牽制各自鼎立態勢下，為本門謀求最大之利益。",
          },
          {
            jh: "絕情谷",
            loc: "",
            name: "谷主夫人",
            way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw",
            desc: "絕情谷上一任谷主的女兒，被現任谷主所傷，終日只得坐在輪椅之上。",
          },
          {
            jh: "絕情谷",
            loc: "",
            name: "采花贼",
            name_tw: "採花賊",
            way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;ne;e;ne;e;n",
            desc: "聲名狼藉的採花賊，一路潛逃來到了絕情谷。",
          },
          {
            jh: "絕情谷",
            loc: "",
            name: "门卫",
            name_tw: "門衛",
            way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;nw",
            desc: "這是個年富力強的衛兵，樣子十分威嚴。",
          },
          { jh: "絕情谷", loc: "", name: "谷主分身", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;nw;n;nw", desc: "好色、陰險狡詐的獨眼龍。" },
          {
            jh: "絕情谷",
            loc: "",
            name: "绝情谷谷主",
            name_tw: "絕情谷谷主",
            way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;n;nw;n;nw",
            desc: "好色、陰險狡詐的獨眼龍。",
          },
          { jh: "絕情谷", loc: "", name: "白衣女子", way: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;nw;w;n;nw;n;nw;ne;n;ne", desc: "一個宛如仙女般的白衣女子。" },
          { jh: "絕情谷", loc: "", name: "野兔", way: "jh 37;n;e;e;nw;nw;w;n;nw;n;n", desc: "正在吃草的野兔。" },
          {
            jh: "絕情谷",
            loc: "",
            name: "绝情谷弟子",
            name_tw: "絕情谷弟子",
            way: "jh 37;n;e;e;nw;nw;w;n;nw;n;n;ne;n;nw",
            desc: "年紀不大，卻心狠手辣，一直守候在絕情山莊。",
          },
          {
            jh: "碧海山莊",
            loc: "碧海山庄大门",
            name: "护卫",
            name_tw: "護衛",
            way: "jh 38;n;n;n;n;n;n;n",
            desc: "他是一個身材高大的中年男子，看起來凶神惡煞，招惹不得。",
          },
          { jh: "碧海山莊", loc: "前院", name: "家丁", way: "jh 38;n;n;n;n;n;n;n;n", desc: "碧海山莊的家丁。" },
          { jh: "碧海山莊", loc: "", name: "耶律楚歌", way: "jh 38;n;n;n;n;n;n;n;n;n", desc: "" },
          {
            jh: "碧海山莊",
            loc: "碧海山庄大厅、炼丹室",
            name: "护卫总管",
            name_tw: "護衛總管",
            way: "jh 38;n;n;n;n;n;n;n;n;n",
            desc: "身材瘦小，可是一身武藝超群，碧海山莊之內能勝他者不超過五人。",
          },
          {
            jh: "碧海山莊",
            loc: "碧海山庄大厅",
            name: "耶律楚哥",
            way: "jh 38;n;n;n;n;n;n;n;n;n",
            desc: "出身契丹皇族，為人多智謀，善料敵先機，騎術了得，為大遼立下赫赫卓著戰功。故而被奉為燕雲世家之主。與天波楊門纏鬥一生，至死方休。",
          },
          {
            jh: "碧海山莊",
            loc: "厨房",
            name: "易牙传人",
            name_tw: "易牙傳人",
            way: "jh 38;n;n;n;n;n;n;n;n;n;e;se;s",
            desc: "一身廚藝已經傲世天下，煎、熬、燔、炙，無所不精。",
          },
          { jh: "碧海山莊", loc: "柴房", name: "砍柴人", way: "jh 38;n;n;n;n;n;n;n;n;n;e;se;s;e", desc: "碧海山莊所需木柴都由他來供給。" },
          { jh: "碧海山莊", loc: "客房", name: "独孤雄", name_tw: "獨孤雄", way: "jh 38;n;n;n;n;n;n;n;n;n;n;n;e;e;se;se;e;n", desc: "一個風程僕僕的俠客。" },
          {
            jh: "碧海山莊",
            loc: "宅院",
            name: "王子轩",
            name_tw: "王子軒",
            way: "jh 38;n;n;n;n;n;n;n;n;n;n;n;e;e;se;se;e;n;n;n",
            desc: "碧海山莊少莊主，整日沉迷於一些稀奇古怪的玩意。",
          },
          {
            jh: "碧海山莊",
            loc: "炼丹室",
            name: "王昕",
            way: "jh 38;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n",
            desc: "年過半百的中年男子，長相平庸，很難讓人把他與碧海山莊莊主這個身份聯想起來。",
          },
          { jh: "碧海山莊", loc: "碧海亭", name: "侍女", way: "jh 38;n;n;n;n;n;n;n;w;w;nw", desc: "打理碧海山莊上上下下的雜物。" },
          {
            jh: "碧海山莊",
            loc: "小桥",
            name: "尹秋水",
            way: "jh 38;n;n;n;n;n;n;n;w;w;nw;w",
            desc: "她肌膚勝雪，雙目猶似一泓清水，顧盼之際，自有一番清雅高華的氣質，讓人為之所攝、自慚形穢、不敢褻瀆。但那冷傲靈動中頗有勾魂攝魄之態，又讓人不能不魂牽蒙繞。",
          },
          {
            jh: "碧海山莊",
            loc: "花园",
            name: "养花女",
            name_tw: "養花女",
            way: "jh 38;n;n;n;n;n;n;n;w;w;nw;w;w;n;n",
            desc: "一位養花少女，她每天就是照顧這數也數不清的花。",
          },
          { jh: "碧海山莊", loc: "桃花源", name: "隐士", name_tw: "隱士", way: "jh 38;n;n;n;n;w", desc: "厭倦了這世間的紛紛擾擾，隱居於此的世外高人。" },
          { jh: "碧海山莊", loc: "溪流", name: "野兔", way: "jh 38;n;n;n;n;w;w", desc: "正在吃草的兔子。" },
          { jh: "碧海山莊", loc: "龙王殿", name: "僧人", way: "jh 38;n;n;w", desc: "龍王殿僧人，負責每年祭祀龍王。" },
          { jh: "碧海山莊", loc: "龙王殿", name: "法明大师", name_tw: "法明大師", way: "jh 38;n;n;w", desc: "管理龍王殿的高僧，龍王殿大大小小的事物都是他在負責。" },
          { jh: "天山", loc: "官道", name: "周教头", name_tw: "週教頭", way: "jh 39;ne", desc: "大內軍教頭，外表樸實無華，實則鋒芒內斂。有著一腔江湖豪情。" },
          {
            jh: "天山",
            loc: "",
            name: "辛怪人",
            way: "jh 39;ne;e;n;ne",
            desc: "性情古怪，不好交往，喜用新招，每每和對方對招之際，學會對方的招式，然後拿來對付對方，令到對方啼笑皆非。。是個狼養大的孩子，他很能打，打起來不要命，一個性情古怪的人，有著一段謎一樣的過去。",
          },
          {
            jh: "天山",
            loc: "",
            name: "穆小哥",
            way: "jh 39;ne;e;n;ne;ne;n",
            desc: "一個只有十八九歲的小夥子，樂觀豁達，無處世經驗，對情感也茫然無措，擅長進攻，變化奇快。",
          },
          {
            jh: "天山",
            loc: "",
            name: "武壮士",
            name_tw: "武壯士",
            way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n",
            desc: "他身穿一件藏藍色古香緞夾袍，腰間綁著一根青色蟒紋帶，一頭暗紅色的發絲，有著一雙深不可測眼睛，體型挺秀，當真是風度翩翩颯爽英姿。",
          },
          {
            jh: "天山",
            loc: "",
            name: "程首领",
            name_tw: "程首領",
            way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw",
            desc: "她是「靈柩宮」九天九部中鈞天部的副首領。",
          },
          {
            jh: "天山",
            loc: "",
            name: "菊剑",
            name_tw: "菊劍",
            way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;n",
            desc: "這是個容貌姣好的女子，瓜子臉蛋，眼如點漆，清秀絕俗。",
          },
          {
            jh: "天山",
            loc: "",
            name: "兰剑",
            name_tw: "蘭劍",
            way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;s",
            desc: "這是個容貌姣好的女子，瓜子臉蛋。",
          },
          {
            jh: "天山",
            loc: "",
            name: "符针神",
            name_tw: "符針神",
            way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n",
            desc: "她是「靈柩宮」九天九部中陽天部的首領她號稱「針神」",
          },
          {
            jh: "天山",
            loc: "",
            name: "梅剑",
            name_tw: "梅劍",
            way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;e",
            desc: "她有著白皙的面容，猶如梅花般的親麗脫俗，堆雲砌黑的濃發，整個人顯得妍姿俏麗惠質蘭心。",
          },
          {
            jh: "天山",
            loc: "",
            name: "护关弟子",
            name_tw: "護關弟子",
            way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;n;e;e;s",
            desc: "這是掌門最忠心的護衛，武功高深莫測。正用警惕的眼光打量著你。",
          },
          {
            jh: "天山",
            loc: "",
            name: "余婆",
            name_tw: "餘婆",
            way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;n;e;nw",
            desc: "她是「靈柩宮」九天九部中昊天部的首領。她跟隨童姥多年，出生入死，飽經風霜。",
          },
          {
            jh: "天山",
            loc: "",
            name: "九翼",
            way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;n;e;nw;w;ne",
            desc: "他是西夏一品堂禮聘的高手，身材高瘦，臉上總是陰沉沉的他輕功極高，擅使雷公擋，憑一手雷公擋功夫，成為江湖的一流高手。",
          },
          {
            jh: "天山",
            loc: "",
            name: "天山死士",
            way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;n;e;nw;w;nw",
            desc: "是掌門從武林擄掠天資聰明的小孩至天山培養的弟子，自小就相互廝殺，脫穎而出者便會成為天山死士，只聽命於掌門一人，倘若有好事者在天山大動干戈，他將毫不猶豫的將對方動武，至死方休。",
          },
          {
            jh: "天山",
            loc: "",
            name: "天山大剑师",
            name_tw: "天山大劍師",
            way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;n;e;nw;w;nw",
            desc: "棄塵世而深居天山顛峰，數十年成鑄劍宗師，鑄成七把寶劍。此七把劍代表晦明大師在天山上經過的七個不同劍的境界。",
          },
          {
            jh: "天山",
            loc: "",
            name: "竹剑",
            name_tw: "竹劍",
            way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;n;n;w",
            desc: "這是個容貌姣好的女子，瓜子臉蛋，眼如點漆，清秀絕俗。你總覺得在哪見過她。",
          },
          { jh: "天山", loc: "", name: "石嫂", way: "jh 39;ne;e;n;ne;ne;n;ne;nw;event_1_58460791;place?失足岩;nw;n;ne;nw;nw;w;w", desc: "她是[靈柩宮]的廚師。" },
          {
            jh: "天山",
            loc: "",
            name: "楚大师兄",
            name_tw: "楚大師兄",
            way: "jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;place?星星峽",
            desc: "有“塞外第一劍客”之稱、“游龍一出，萬劍臣服”之勇。性傲、極度自信、重情重義、兒女情長，具有英雄氣蓋，但容易感情用事，做事走極端。乃天山派大師兄。",
          },
          {
            jh: "天山",
            loc: "",
            name: "傅奇士",
            way: "jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;place?星星峽;ne;ne;nw",
            desc: "一個三綹長須、面色紅潤、儒冠儒服的老人，不但醫術精妙，天下無匹，而且長於武功，在劍法上有精深造詣。除此之外，他還是書畫名家。",
          },
          {
            jh: "天山",
            loc: "",
            name: "杨英雄",
            name_tw: "楊英雄",
            way: "jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;place?星星峽;ne;ne;nw;nw",
            desc: "一個有情有義的好男兒，他武功高強大義凜然，乃天山派二師兄。",
          },
          {
            jh: "天山",
            loc: "",
            name: "胡大侠",
            name_tw: "胡大俠",
            way: "jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;place?星星峽;ne;ne;nw;nw;nw;w",
            desc: "因其武功高強神出鬼沒。在江湖上人送外號「雪山飛狐」。他身穿一件白色長衫，腰間別著一把看起來很舊的刀。他滿腮虯髯，根根如鐵，一頭濃發，卻不結辮。",
          },
          { jh: "天山", loc: "", name: "波斯商人", way: "jh 39;ne;e;n;ne;ne;se", desc: "這是一位來自波斯的商人，經商手段十分高明。" },
          {
            jh: "天山",
            loc: "",
            name: "铁好汉",
            name_tw: "鐵好漢",
            way: "jh 39;ne;e;n;ne;ne;se;e",
            desc: "邱莫言重金僱傭的綠林好漢，賀蘭山草寇。缺乏主見，使一柄沒有太多特色的單刀，雖是為財而來，卻也不失為江湖義士。",
          },
          { jh: "天山", loc: "", name: "贺好汉", name_tw: "賀好漢", way: "jh 39;ne;e;n;ne;ne;se;e", desc: "乃行走江湖的綠林好漢，脾氣極為暴躁。" },
          { jh: "天山", loc: "", name: "韩马夫", name_tw: "韓馬夫", way: "jh 39;ne;e;n;ne;ne;se;e;e", desc: "一位憨直的漢子，面容普通，但本性古道熱腸，有俠義本色。" },
          { jh: "天山", loc: "", name: "刁屠夫", way: "jh 39;ne;e;n;ne;ne;se;e;n", desc: "乃龍門客棧屠夫，此人憑藉常年累月的剔骨切肉練就一身好刀法。" },
          {
            jh: "天山",
            loc: "",
            name: "金老板",
            name_tw: "金老闆",
            way: "jh 39;ne;e;n;ne;ne;se;e;n",
            desc: "龍門客棧老闆娘，為人八面玲瓏。左手使鏢，右手使刀，體態婀娜多姿，嫵媚潑辣。",
          },
          { jh: "天山", loc: "", name: "蒙面女郎", way: "jh 39;ne;e;n;ne;ne;se;e;s;e;se", desc: "這是個身材嬌好的女郎，輕紗遮面，一雙秀目中透出一絲殺氣。" },
          { jh: "天山", loc: "", name: "牧民", way: "jh 39;ne;e;n;nw", desc: "這是一位邊塞牧民，正在驅趕羊群。" },
          { jh: "天山", loc: "", name: "塞外胡兵", way: "jh 39;ne;e;n;nw;nw;w;s;s", desc: "一副凶神惡煞的長相，來自塞外。以擄掠關外牧民衛生。" },
          {
            jh: "天山",
            loc: "",
            name: "胡兵头领",
            name_tw: "胡兵頭領",
            way: "jh 39;ne;e;n;nw;nw;w;s;s;sw;n;nw;e;sw;w",
            desc: "手持一根狼牙棒，揹負一口長弓。身材高大，面目可憎。",
          },
          {
            jh: "天山",
            loc: "",
            name: "乌刀客",
            name_tw: "烏刀客",
            way: "jh 39;ne;e;n;nw;nw;w;s;s;sw;n;nw;e;sw;w;s;w",
            desc: "他就是名動江湖的烏老大，昔日曾謀反童姥未遂而被囚禁於此。",
          },
          { jh: "天山", loc: "", name: "宝箱", name_tw: "寶箱", way: "jh 39;ne;e;n;nw;nw;w;s;s;sw;n;nw;e;sw;w;s;w;n;w;event_1_69872740", desc: "" },
          { jh: "苗疆", loc: "", name: "温青", name_tw: "溫青", way: "jh 40;s;s;s;s", desc: "此人俊秀異常，個性溫和有風度，喜好遊歷山水是一位姿態優雅的翩翩君子。" },
          { jh: "苗疆", loc: "", name: "田嫂", way: "jh 40;s;s;s;s;e;s;se", desc: "一個白皙豐滿的中年婦人．" },
          { jh: "苗疆", loc: "", name: "金背蜈蚣", way: "jh 40;s;s;s;s;e;s;se;sw;s;s", desc: "一條三尺多長，張牙舞爪的毒蜈蚣。" },
          { jh: "苗疆", loc: "", name: "樵夫", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e", desc: "一位面色黑紅，悠然自得的樵夫．" },
          { jh: "苗疆", loc: "", name: "三足金蟾", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw", desc: "一隻拳頭大小通身金黃的小蟾蜍，據說只有月宮才有。" },
          {
            jh: "苗疆",
            loc: "",
            name: "莽牯朱蛤",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s",
            desc: "一隻拳頭大小，叫聲洪亮的毒蛤蟆。",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "食尸蝎",
            name_tw: "食屍蠍",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;e;n;n;e;s;e;ne;s",
            desc: "一條三尺來長，全身鐵甲的毒蠍子。",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "蛇",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e",
            desc: "一條七尺多長，手腕般粗細的毒蛇。十分駭人。",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "五毒教徒",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw",
            desc: "一個五毒的基層教徒，看來剛入教不久。",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "沙护法",
            name_tw: "沙護法",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n",
            desc: "他就是五毒教的護法弟子，身材魁梧，方面大耳。在教中轉管招募教眾，教授弟子們的入門功夫。",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "五毒弟子",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n",
            desc: "五毒教一個身體強壯的苗族青年，看來武功已小由所成。",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "毒郎中",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;e",
            desc: "一位身穿道服，乾癟黑瘦的中年苗人．",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "毒女",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n",
            desc: "年紀約20歲，冷豔絕倫，背景離奇，混身是毒，外號毒女曼陀羅，涉嫌下毒命案，其實她是個十分善良的女子。與鐵捕快有一段纏綿悱惻的愛情，花耐寒而豔麗。",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "白髯老者",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w;w",
            desc: "一個須發皆白的老者，精神矍鑠，滿面紅光。",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "潘左护法",
            name_tw: "潘左護法",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n",
            desc: "他就是五毒教的左護法，人稱笑面閻羅。別看他一臉笑眯眯的，但是常常殺人於彈指之間，一手五毒鉤法也已達到登峰造極的境界。",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "大祭司",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;e",
            desc: "乃苗疆最為德高望重的祭師。但凡祭祀之事皆是由其一手主持。",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "岑秀士",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;nw",
            desc: "他就是五毒教的右護法，人稱五毒秀士。經常裝扮成一個白衣秀士的模樣，沒事總愛附庸風雅。",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "何教主",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;nw;ne;ne;nw;ne;e",
            desc: "你對面的是一個一身粉紅紗裙，笑靨如花的少女。她長得肌膚雪白，眉目如畫，赤著一雙白嫩的秀足，手腳上都戴著閃閃的金鐲。誰能想到她就是五毒教的教主，武林人士提起她無不膽顫心驚。",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "五毒护法",
            name_tw: "五毒護法",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;nw;ne;ne;nw;ne;e",
            desc: "乃幫主的貼身護法，為人忠心耿耿，武藝深不可測。幫主有難時，會豁盡全力以護佑她人身安全。",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "齐长老",
            name_tw: "齊長老",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;n;n;nw;ne;ne;se;se",
            desc: "他就是五毒教的長老，人稱錦衣毒丐。乃是教主的同門師兄，在教中一向飛揚跋扈，大權獨攬。他長的身材魁梧，面目猙獰，身穿一件五彩錦衣，太陽穴高高墳起。",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "白鬓老者",
            name_tw: "白鬢老者",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w",
            desc: "",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "何长老",
            name_tw: "何長老",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;e;n;n;e;s;e;ne;s;sw;e;e;ne;ne;nw;ne;ne;n;n;w;sw",
            desc: "她就是五毒教的長老，教主的姑姑。隨然是教主的長輩，但功夫卻是一塊跟上代教主學的。據說她曾經被立為教主繼承人，但後來犯下大錯，所以被罰到此處面壁思過，以贖前罪。她穿著一身破舊的衣衫，滿臉疤痕，長得骨瘦如柴，雙目中滿是怨毒之色。",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "阴山天蜈",
            name_tw: "陰山天蜈",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄江南岸;se;s;s;s",
            desc: "一條三寸多長，長有一雙翅膀劇毒蜈蚣。",
          },
          {
            jh: "苗疆",
            loc: "",
            name: "蓝姑娘",
            name_tw: "藍姑娘",
            way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;e;e;sw;se;sw;se;event_1_8004914;place?瀾滄峽;sw",
            desc: "此女千嬌百媚，風韻甚佳，聲音嬌柔宛轉，蕩人心魄。年齡約莫二十三四歲。喜歡養毒蛇，能煉製傳說中苗族人的蠱毒，還善於配置各種劇毒。喜歡吹洞簫，口哨也很好。",
          },
          { jh: "苗疆", loc: "", name: "吸血蜘蛛", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;s;sw", desc: "一隻拳頭大小，全身綠毛的毒蜘蛛。" },
          { jh: "苗疆", loc: "", name: "人面蜘蛛", way: "jh 40;s;s;s;s;e;s;se;sw;s;s;s;s;sw", desc: "一隻面盆大小，長著人樣腦袋的大蜘蛛。" },
          { jh: "苗疆", loc: "", name: "苗村长", name_tw: "苗村長", way: "jh 40;s;s;s;s;w;w;w", desc: "這是本村的村長，凡是村裡各家各戶，老老少少的事他沒有不知道的。" },
          { jh: "苗疆", loc: "", name: "苗家小娃", way: "jh 40;s;s;s;s;w;w;w;n", desc: "此娃肥肥胖胖，走路一晃一晃，甚是可愛。" },
          { jh: "苗疆", loc: "", name: "苗族少女", way: "jh 40;s;s;s;s;w;w;w;w", desc: "一個身穿苗族服飾的妙齡少女。" },
          { jh: "苗疆", loc: "", name: "苗族少年", way: "jh 40;s;s;s;s;w;w;w;w", desc: "一個身穿苗族服飾的英俊少年。" },
          { jh: "白帝城", loc: "", name: "近身侍卫", name_tw: "近身侍衛", way: "jh 41;se;e;e;nw;nw;n;n;e;ne;e", desc: "公孫將軍的近身侍衛，手執長劍。" },
          { jh: "白帝城", loc: "", name: "白衣弟子", way: "jh 41;se;e;e", desc: "身穿白衣的青年弟子，似乎身手不凡，傲氣十足。" },
          { jh: "白帝城", loc: "", name: "镇长", name_tw: "鎮長", way: "jh 41;se;e;e;ne;ne;se;e;e;ne", desc: "白發蒼蒼的鎮長，看起來還挺精神的。" },
          { jh: "白帝城", loc: "", name: "李巡", way: "jh 41;se;e;e;ne;ne;se;e;e;s;w", desc: "白發蒼蒼的老頭，貌似是李峰的父親。" },
          { jh: "白帝城", loc: "", name: "守门士兵", name_tw: "守門士兵", way: "jh 41;se;e;e;nw;nw", desc: "身穿白帝城軍服的士兵。" },
          {
            jh: "白帝城",
            loc: "",
            name: "公孙将军",
            name_tw: "公孫將軍",
            way: "jh 41;se;e;e;nw;nw;n;n;e;ne;e",
            desc: "公孫氏的一位將軍，深受白帝信任，被派到紫陽城擔任守城要務。",
          },
          { jh: "白帝城", loc: "", name: "贴身侍卫", name_tw: "貼身侍衛", way: "jh 41;se;e;e;nw;nw;n;n;e;ne;e", desc: "" },
          { jh: "白帝城", loc: "", name: "粮官", name_tw: "糧官", way: "jh 41;se;e;e;nw;nw;n;n;e;ne;n;nw;n", desc: "負責管理紫陽城的糧倉的官員。" },
          { jh: "白帝城", loc: "", name: "白衣士兵", way: "jh 41;se;e;e;nw;nw;n;n;w;w", desc: "身穿白衣的士兵，正在街上巡邏。" },
          {
            jh: "白帝城",
            loc: "",
            name: "文将军",
            name_tw: "文將軍",
            way: "jh 41;se;e;e;nw;nw;n;n;w;w;n;n;e",
            desc: "白帝城公孫氏的外戚，主要在紫陽城替白帝城防禦外敵。",
          },
          { jh: "白帝城", loc: "", name: "白衣少年", way: "jh 41;se;e;e;se;se;se;se", desc: "身穿白帝城統一服飾的少年，長相雖然一般，但神態看起來有點傲氣。" },
          { jh: "白帝城", loc: "", name: "李峰", way: "jh 41;se;e;e;se;se;se;se;s;s", desc: "精神奕奕的中年漢子，看起來非常自信。" },
          { jh: "白帝城", loc: "", name: "李白", way: "jh 41;se;e;e;se;se;se;se;s;s;s", desc: "字太白，號青蓮居士，又號“謫仙人”，他拿著一壺酒，似乎醉醺醺的樣子。" },
          { jh: "白帝城", loc: "", name: "“妖怪”", way: "jh 41;se;e;e;se;se;se;se;s;s;s;e", desc: "一個公孫氏的紈絝弟子，無聊得假扮妖怪到處嚇人。" },
          { jh: "白帝城", loc: "", name: "庙祝", name_tw: "廟祝", way: "jh 41;se;e;e;se;se;se;se;s;s;s;e;e;ne", desc: "一個風程僕僕的俠客。" },
          {
            jh: "白帝城",
            loc: "",
            name: "鹤发老人",
            name_tw: "鶴發老人",
            way: "jh 41;se;e;e;se;se;se;se;s;s;s;e;e;ne;event_1_7159906;w;nw;n;sw;s;nw;w;w",
            desc: "一頭濃密鶴發，臉上雖然皺紋滿布，但整個人看起來仍然生機勃勃，不知道此人活了多久。",
          },
          { jh: "白帝城", loc: "", name: "练武士兵", name_tw: "練武士兵", way: "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;e;e", desc: "正在奮力操練的士兵。" },
          {
            jh: "白帝城",
            loc: "",
            name: "白帝",
            way: "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n",
            desc: "現任白帝，乃公孫氏族長，看起來威嚴無比，在他身旁能感受到不少壓力。",
          },
          { jh: "白帝城", loc: "", name: "狱卒", name_tw: "獄卒", way: "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;w;w;w", desc: "一個普通的獄卒，似乎在這發呆。" },
          {
            jh: "墨家機關城",
            loc: "",
            name: "索卢参",
            name_tw: "索盧參",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n",
            desc: "此人乃墨子學生，為人特別誠懇，因此被指派負責接待外賓司儀一職。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "墨家弟子",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n",
            desc: "一聲正氣稟然的裝束，乃天下間心存俠義之人仰慕墨家風采而成為其中一員。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "高孙子",
            name_tw: "高孫子",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n",
            desc: "為墨子的學生，口才十分了得。故而負責機關城與外界聯繫。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "黑衣人",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213",
            desc: "一身蒙面黑衣，鬼鬼祟祟，不知是何人。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "随巢子",
            name_tw: "隨巢子",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;e",
            desc: "此人乃墨子的學生，沉迷於打造大型機關獸，木鳶便是出自其手。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "曹公子",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;n;e",
            desc: "早年曾質疑墨子之道，後被博大精深的墨家機關術所折服，專職看守天工塢。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "墨子",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;n;ne",
            desc: "墨家的開山祖師，以一人之力開創出機關流派，須眉皆白，已不知其歲數幾何，但依然滿臉紅光，精神精神煥發。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "耕柱子",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;n;nw",
            desc: "為墨子的學生，此人天資異稟，但驕傲自滿，因此被墨子懲罰到兼愛祠看管。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "鲁班",
            name_tw: "魯班",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;n;w",
            desc: "機關術的專家，以善於發明各種機關而聞名。木匠出身，在機關術上有著天人一般的精湛技藝。如今不知為何來到墨家機關城。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "高何",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;sw",
            desc: "此人乃墨子學生，面相凶神惡煞，因而負責機關城的安全事務。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "随师弟",
            name_tw: "隨師弟",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;sw;sw",
            desc: "隨巢子的師弟，因犯事被暫時關於此地。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "大匠师",
            name_tw: "大匠師",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;n;e;s;e;n;nw;e;nw;w;w",
            desc: "鑄藝高超的墨家宗師，主管墨家兵器打造。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "屈将子",
            name_tw: "屈將子",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;s;e;s;ne;s;sw;nw;s;se;s;e;e",
            desc: "此人乃資深航海師，墨家麾下的殸龍船便是由其掌控。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "偷剑贼",
            name_tw: "偷劍賊",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;s;e;s;ne;s;sw;nw;s;se;s;e;e;e",
            desc: "身穿黑色夜行衣，舉手投足之間盡顯高手風範，實力不容小覷。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "徐夫子",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;event_1_39026213;n;ne;se;s;event_1_623818;e;s;e;s;ne;s;sw;nw;s;se;s;sw;s;s",
            desc: "墨家最優秀的鑄匠，畢生致力精研鑄劍術，很多名震天下的神兵利刃皆是出自他手。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "治徒娱",
            name_tw: "治徒娛",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;n;w",
            desc: "為墨子的學生，有過目不忘之才數目分明之能，因此在節用市坐鎮負責機關城資源調配。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "大博士",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;n;w",
            desc: "對天下學術有著極高造詣的宗師，主管墨家學說的傳承。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "高石子",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;e;e;n;w",
            desc: "此人乃墨子的學生，深受墨子欣賞。曾經當過高官，現主管墨家日常政務。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "荆轲",
            name_tw: "荊軻",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;n;n",
            desc: "墨家絕頂刺客，劍法在墨家中出類拔萃，為人慷慨俠義。備受墨家弟子所敬重。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "燕丹",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;n;n",
            desc: "此人乃前朝皇族，滅國之後投身到墨家麾下四處行俠仗義神秘莫測。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "庖丁",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;n;n;n;n;n",
            desc: "一名憨厚開朗的大胖子，其刀法如神，是個燒遍天下美食的名廚。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "县子硕",
            name_tw: "縣子碩",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;w;w;n;e",
            desc: "此人乃墨子學生，與高何一樣無惡不作，後師從墨子，收心斂性，專職培養墨家人才。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "魏越",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;w;w;n;n;e",
            desc: "為墨子的學生，此人天敏而好學，時常不恥下問，因此被墨子欽點在此顧守書籍。",
          },
          {
            jh: "墨家機關城",
            loc: "",
            name: "公尚过",
            name_tw: "公尚過",
            way: "jh 42;nw;ne;n;e;nw;e;nw;w;ne;se;n;nw;e;n;w;n;n;n;n;w;w;n;n;n;e",
            desc: "墨子的弟子，深得墨子器重，為人大公無私，現主管墨家的檢察維持門內秩序。",
          },
          {
            jh: "掩月城",
            loc: "瀑下石屋（六道探视）",
            name: "雪若云",
            name_tw: "雪若雲",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;se;se;s;s;sw;s;sw;sw;sw;sw;event_1_67934650",
            desc: "這是無影樓長老雪若雲，此刻正在榻上打坐靜養。",
          },
          {
            jh: "掩月城",
            loc: "出云厅",
            name: "执法长老",
            name_tw: "執法長老",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;e",
            desc: "這是出雲莊四大長老之一的執法長老，負責莊中的法規制度的執行，嚴肅公正，一絲不苟。",
          },
          {
            jh: "掩月城",
            loc: "松柏石道",
            name: "狄啸",
            name_tw: "狄嘯",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e",
            desc: "這是一個能征戰四方的將軍，出雲莊的得力大將。",
          },
          {
            jh: "掩月城",
            loc: "风花谷",
            name: "小马驹",
            name_tw: "小馬駒",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se",
            desc: "出生不足一年的小馬駒，雖不知其名，但顯是有著極純正優秀的血統，世人皆說風花牧場盡收天下名駒，此言非虛。",
          },
          {
            jh: "掩月城",
            loc: "",
            name: "宋喉",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;event_1_90371900",
            desc: "武林第一通緝犯，可為何被通緝無人所知。如今藏身於隱秘之所，似是在等待何人。",
          },
          { jh: "掩月城", loc: "越女玉雕", name: "野狗", way: "jh 43", desc: "一條低頭啃著骨頭的野狗。" },
          {
            jh: "掩月城",
            loc: "越女玉雕",
            name: "执定长老",
            name_tw: "執定長老",
            way: "jh 43",
            desc: "出雲閣四大長老之一，負責出雲莊在城中的各種日常事務，也帶一些難得下山的年輕小弟子來城中歷練。雖表情嚴肅，卻深受晚輩弟子的喜愛。",
          },
          {
            jh: "掩月城",
            loc: "越女玉雕",
            name: "佩剑少女",
            name_tw: "佩劍少女",
            way: "jh 43",
            desc: "兩個年方豆蔻的小女孩，身上揹著一把短劍，腰間繫著一塊『出雲』玉牌，臉上全是天真爛漫。",
          },
          { jh: "掩月城", loc: "南岭密道", name: "穿山甲", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne", desc: "這是一隻穿山甲。" },
          { jh: "掩月城", loc: "南岭密道", name: "火狐", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw", desc: "這是一隻紅色皮毛的狐狸。" },
          {
            jh: "掩月城",
            loc: "南岭密道",
            name: "黄鹂",
            name_tw: "黃鸝",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se",
            desc: "這是一隻黃鸝鳥兒，吱吱呀呀地唱著。",
          },
          {
            jh: "掩月城",
            loc: "花海",
            name: "夜攸裳",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se",
            desc: "一個來自波斯國的女子，看似穿著華裙，內中卻是勁衣。頭上扎著一個側髻，斜插著一支金玉雙鳳釵。",
          },
          {
            jh: "掩月城",
            loc: "出云庄、松柏石道",
            name: "云卫",
            name_tw: "雲衛",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n",
            desc: "這是守衛出雲莊大門的守衛，氣度不凡。",
          },
          {
            jh: "掩月城",
            loc: "松柏石道",
            name: "云将",
            name_tw: "雲將",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e",
            desc: "這是統管出雲莊護衛的將領，龍行虎步，神威凜凜。",
          },
          {
            jh: "掩月城",
            loc: "松柏石道",
            name: "女眷",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e",
            desc: "這是出雲莊的女眷，雖為女流，卻精通武藝。",
          },
          {
            jh: "掩月城",
            loc: "松柏石道",
            name: "青云仙子",
            name_tw: "青雲仙子",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e",
            desc: "這是一個遊歷四方的道姑，姿態飄逸，身負古琴，能成為出雲莊的客人，怕也是來頭不小。",
          },
          { jh: "掩月城", loc: "", name: "狄仁啸", name_tw: "狄仁嘯", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e", desc: "" },
          {
            jh: "掩月城",
            loc: "出云厅",
            name: "执剑长老",
            name_tw: "執劍長老",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;e",
            desc: "這是出雲莊四大長老之一的執劍長老，負責傳授莊中武士的武藝，其一身武功之高自是不在話下。",
          },
          {
            jh: "掩月城",
            loc: "出云厅",
            name: "秦东海",
            name_tw: "秦東海",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;e",
            desc: "是出雲莊的主人，也是出雲部軍隊的大統帥。身穿獅頭麒麟鎧，腰佩神劍。",
          },
          {
            jh: "掩月城",
            loc: "出云厅、密室（秦东海推石狮）",
            name: "执典长老",
            name_tw: "執典長老",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;e;e;event_1_89957254;ne;ne;se;s;s;s",
            desc: "這是出雲莊四大長老之一的執典長老，負責維護管理莊中重要的典籍和秘書。",
          },
          {
            jh: "掩月城",
            loc: "冶炼坊",
            name: "莫邪传人",
            name_tw: "莫邪傳人",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;n",
            desc: "這是一個頂尖的鑄煉天匠，據傳曾是莫邪的弟子。",
          },
          {
            jh: "掩月城",
            loc: "九牧溪",
            name: "老仆",
            name_tw: "老僕",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;n;n",
            desc: "一名忠心耿耿的老僕人，一言不發地守在公子身後。",
          },
          {
            jh: "掩月城",
            loc: "甲胄坊",
            name: "制甲师",
            name_tw: "制甲師",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;s",
            desc: "這是一個頂尖的製造甲冑的大師。",
          },
          {
            jh: "掩月城",
            loc: "练武场",
            name: "试剑士",
            name_tw: "試劍士",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;ne;n;nw;ne;e;se;se;se;se;ne;n;n;e;e;e;e;s;s",
            desc: "這是一個試煉各式兵器和器械的武士。",
          },
          { jh: "掩月城", loc: "锁龙潭", name: "黑衣老者", way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;se;se;s;s;sw;s", desc: "一個表情兇狠的黑衣老者，你最好還是不要招惹他。" },
          {
            jh: "掩月城",
            loc: "深山石窟",
            name: "六道禅师",
            name_tw: "六道禪師",
            way: "jh 43;n;ne;ne;n;e;e;se;se;e;ne;se;se;s;s;sw;s;sw;sw;sw;sw",
            desc: "曾經的武林禪宗第一高手，武功修為極高，內力深厚，一身真氣護體的功夫，尋常人難以企及。",
          },
          { jh: "掩月城", loc: "落霞山径", name: "野兔", way: "jh 43;n;ne;ne;n;n;n;nw", desc: "這是一隻灰耳白尾的野兔" },
          { jh: "掩月城", loc: "落霞山径", name: "老烟杆儿", name_tw: "老煙桿兒", way: "jh 43;n;ne;ne;n;n;n;nw;n", desc: "一名白發蒼蒼的老人，手持一柄煙桿兒。" },
          { jh: "掩月城", loc: "落霞山径", name: "杂货脚夫", name_tw: "雜貨腳夫", way: "jh 43;n;ne;ne;n;n;n;nw;n", desc: "一個負責運送日常雜貨的腳夫。" },
          { jh: "掩月城", loc: "落霞山径", name: "短衫剑客", name_tw: "短衫劍客", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne", desc: "一個身著短衫，利落乾淨的劍客。" },
          { jh: "掩月城", loc: "落霞山径", name: "巧儿", name_tw: "巧兒", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne", desc: "一個聰明伶俐，嬌小可愛的小丫頭。" },
          { jh: "掩月城", loc: "落霞山径", name: "青牛", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n", desc: "一頭通體泛青，健碩無比的公牛。" },
          { jh: "掩月城", loc: "落霞山径", name: "骑牛老汉", name_tw: "騎牛老漢", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n", desc: "一個黑衫華發的老人，腰佩長劍。" },
          { jh: "掩月城", loc: "孤鹜枫林", name: "书童", name_tw: "書童", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w", desc: "一名年不及二八的小書童，身上揹著書簍。" },
          {
            jh: "掩月城",
            loc: "孤鹜枫林",
            name: "樊川居士",
            way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw",
            desc: "百年難得一出的天縱英才，詩文當世無二，其詩雄姿英發。而人如其詩，個性張揚，如鶴舞長空，俊朗飄逸。",
          },
          {
            jh: "掩月城",
            loc: "孤鹜枫林",
            name: "青衫女子",
            way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw",
            desc: "一名身著青衫，頭戴碧玉簪的年青女子。手裡拿著一支綠色玉簫。",
          },
          {
            jh: "掩月城",
            loc: "无影楼",
            name: "无影暗侍",
            name_tw: "無影暗侍",
            way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw",
            desc: "這是一個無影樓守門的侍衛，全身黑衣，面帶黑紗。",
          },
          {
            jh: "掩月城",
            loc: "退思台",
            name: "琴仙子",
            way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n",
            desc: "一個身著樸素白裙，滿頭青絲垂下的少女，手指輕動，天籟般的琴音便流淌而出。琴聲之間還包含了極深的內力修為。",
          },
          {
            jh: "掩月城",
            loc: "千叶飞瀑",
            name: "百晓居士",
            name_tw: "百曉居士",
            way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e",
            desc: "這是一個江湖事無所不曉的老頭，總是一副若有所思的樣子。",
          },
          {
            jh: "掩月城",
            loc: "碎影栈道",
            name: "清风童子",
            name_tw: "清風童子",
            way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se",
            desc: "這是無影樓的小侍童。",
          },
          {
            jh: "掩月城",
            loc: "落英小筑",
            name: "刀仆",
            name_tw: "刀僕",
            way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se;se;sw;sw",
            desc: "這是天刀宗師的僕人，忠心耿耿。",
          },
          {
            jh: "掩月城",
            loc: "落英小筑",
            name: "天刀宗师",
            name_tw: "天刀宗師",
            way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se;se;sw;sw",
            desc: "一個白發老人，身形挺拔，傳說這是二十年前突然消失於武林的天下第一刀客。",
          },
          {
            jh: "掩月城",
            loc: "与谁同坐亭（花间回廊入亭赏月）",
            name: "虬髯长老",
            name_tw: "虯髯長老",
            way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e;se;se;se;sw;sw;s;e;s;s;s;event_1_69228002",
            desc: "這是無影閣四大長老之一的虯髯公，滿面赤色的虯髯，腰間一把帝王之劍。",
          },
          { jh: "掩月城", loc: "黑岩溪", name: "赤尾雪狐", way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw", desc: "一隻通體雪白，尾稍赤紅如火的狐狸。" },
          {
            jh: "掩月城",
            loc: "黑岩溪",
            name: "泥鳅",
            name_tw: "泥鰍",
            way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw;sw",
            desc: "一條烏黑油亮的小泥鰍，在溪水中暢快地遊著。",
          },
          {
            jh: "掩月城",
            loc: "黑岩溪",
            name: "灰衣血僧",
            way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw;sw;sw;s;s",
            desc: "一個滿面煞氣，身著灰色僧袍，手持大環刀的中年惡僧。",
          },
          {
            jh: "掩月城",
            loc: "白龙天瀑",
            name: "白鹭",
            name_tw: "白鷺",
            way: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;sw;sw;sw;s;s;s",
            desc: "一隻羽毛如雪的白鷺，雙翅一展有丈許，直欲振翅上九天而去。",
          },
          { jh: "掩月城", loc: "清溪石板路", name: "行脚贩子", name_tw: "行腳販子", way: "jh 43;sw", desc: "這是一個遠道而來的商人，滿面風塵。" },
          { jh: "掩月城", loc: "马车店、铁匠铺", name: "店老板", name_tw: "店老闆", way: "jh 43;sw;sw;sw;s;se;se;se", desc: "馬車店老闆，年近不惑。" },
          { jh: "掩月城", loc: "骡马市", name: "白衣弟子", way: "jh 43;sw;sw;sw;s;se;se;se;e", desc: "出雲莊的年輕弟子，第一次來到市集，看什麼都是新鮮。" },
          {
            jh: "掩月城",
            loc: "铁匠铺",
            name: "青衫铁匠",
            name_tw: "青衫鐵匠",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;e",
            desc: "一個深藏不露的鐵匠，據說能打出最上乘的武器。",
          },
          {
            jh: "掩月城",
            loc: "骡马市",
            name: "黑衣骑士",
            name_tw: "黑衣騎士",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;n",
            desc: "穿著馬靴的黑衣少年，似是在維持市場的秩序。",
          },
          {
            jh: "掩月城",
            loc: "天青原",
            name: "青鬃野马",
            name_tw: "青鬃野馬",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw",
            desc: "野外的空闊遼遠，青鬃馬揚起鬃毛，收腰扎背，四蹄翻飛，跨阡度陌，躍丘越壑，盡情地奔馳在自由的風裡。",
          },
          { jh: "掩月城", loc: "天青原", name: "牧民", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw", desc: "一個風霜滿面卻面帶微笑的中年男子。" },
          {
            jh: "掩月城",
            loc: "风花谷",
            name: "乌骓马",
            name_tw: "烏騅馬",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne",
            desc: "通體黑緞子一樣，油光放亮，唯有四個馬蹄子部位白得賽雪。烏騅背長腰短而平直，四肢關節筋腱發育壯實，這樣的馬有個講頭，名喚“踢雪烏騅”。",
          },
          { jh: "掩月城", loc: "风花谷", name: "的卢幼驹", name_tw: "的盧幼駒", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne", desc: "額上有白點，通體黝黑的神駿幼駒。" },
          {
            jh: "掩月城",
            loc: "风花牧场",
            name: "千小驹",
            name_tw: "千小駒",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s",
            desc: "一個年近弱冠的小孩子，身著皮襖，手拿小鞭，自幼在牧場長大，以馬駒為名，也極善與馬兒相處，據說他能聽懂馬兒說話。",
          },
          {
            jh: "掩月城",
            loc: "风花牧场",
            name: "秦惊烈",
            name_tw: "秦驚烈",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s",
            desc: "一個身高七尺的偉岸男子，腰裡掛著彎刀，明明是滿臉虯髯，臉上卻總是帶著溫和的微笑。",
          },
          {
            jh: "掩月城",
            loc: "风花马道",
            name: "小马驹儿",
            name_tw: "小馬駒兒",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e",
            desc: "一隻剛出生不久的小馬駒，雖步行踉蹌，卻也已能看出純種烈血寶馬的一二分風采。",
          },
          { jh: "掩月城", loc: "风花马道", name: "牧羊犬", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e", desc: "牧民們的牧羊犬，威風凜凜，忠心耿耿。" },
          {
            jh: "掩月城",
            loc: "风花马道",
            name: "追风马",
            name_tw: "追風馬",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e",
            desc: "中原諸侯夢寐以求的軍中良馬，可日行六百，四蹄翻飛，逐風不休。",
          },
          {
            jh: "掩月城",
            loc: "风花马道",
            name: "诸侯秘使",
            name_tw: "諸侯秘使",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne",
            desc: "一個來求購良馬的使者，不知道哪個諸侯派出，身份隱秘。",
          },
          {
            jh: "掩月城",
            loc: "风花马道",
            name: "赤菟马",
            name_tw: "赤菟馬",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne",
            desc: "人中呂布，馬中赤兔，如龍如神，日行千里，紅影震懾千軍陣！",
          },
          {
            jh: "掩月城",
            loc: "风花马道",
            name: "风如斩",
            name_tw: "風如斬",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne",
            desc: "風花牧場上最好的牧人之一，左耳吊墜是一隻狼王之齒，腰間的馬刀也是功勳赫赫！",
          },
          {
            jh: "掩月城",
            loc: "轻舞丘",
            name: "白狐",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne;nw",
            desc: "一隻通體雪白的小狐狸，在樹洞裡伸出頭來看著你。",
          },
          { jh: "掩月城", loc: "轻舞丘", name: "小鹿", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne;nw;nw", desc: "" },
          { jh: "掩月城", loc: "", name: "破石寻花", name_tw: "破石尋花", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;ne;ne;nw;nw;w", desc: "" },
          {
            jh: "掩月城",
            loc: "风花马道",
            name: "爪黄飞电",
            name_tw: "爪黃飛電",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se",
            desc: "據說是魏武帝最愛的名駒，體型高大，氣勢磅礴，萬馬之中也可一眼看出。",
          },
          { jh: "掩月城", loc: "风花马道", name: "黑狗", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s", desc: "一條牧場上的黑狗，汪汪地衝你叫著。" },
          {
            jh: "掩月城",
            loc: "风花马道",
            name: "照夜玉狮子",
            name_tw: "照夜玉獅子",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s",
            desc: "此馬天下無雙，通體上下，一色雪白，沒有半根雜色，渾身雪白，傳說能日行千里，產於西域，是極品中的極品。",
          },
          {
            jh: "掩月城",
            loc: "风花马道",
            name: "鲁总管",
            name_tw: "魯總管",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;se",
            desc: "風花牧場的總管，上上下下的諸多事情都歸他打理，內務外交都會經他之手。他卻一副好整以暇的樣子，似是經緯盡在掌握。",
          },
          {
            jh: "掩月城",
            loc: "风花马道",
            name: "风花侍女",
            name_tw: "風花侍女",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;se",
            desc: "風花牧場的侍女，雖名義上都是僕從，但卻神色輕鬆，喜笑顏開，和主人管事們都親熱非常。",
          },
          {
            jh: "掩月城",
            loc: "天玑台",
            name: "天玑童子",
            name_tw: "天璣童子",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;se;e",
            desc: "天璣樓裡的小童子，身穿青衫，頭系藍色發帶。",
          },
          {
            jh: "掩月城",
            loc: "百里原",
            name: "灰耳兔",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;sw;sw",
            desc: "一隻白色的兔子，耳朵卻是灰色。",
          },
          { jh: "掩月城", loc: "", name: "闻香寻芳", name_tw: "聞香尋芳", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s;e;e;e;ne;se;s;s;sw;sw;sw", desc: "" },
          {
            jh: "掩月城",
            loc: "九牧溪",
            name: "绛衣剑客",
            name_tw: "絳衣劍客",
            way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;se",
            desc: "一名身著絳色短衫的劍客，太陽穴微微鼓起，顯是有著極強內力修為。",
          },
          { jh: "掩月城", loc: "九牧溪", name: "白衣公子", way: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;se;ne", desc: "手持折扇，白衣飄飄的俊美公子，似是女扮男裝。" },
          { jh: "掩月城", loc: "浣衣台", name: "农家少妇", name_tw: "農家少婦", way: "jh 43;sw;sw;sw;w", desc: "附近農家的新婚婦人，一邊帶著孩子，一邊浣洗著衣服。" },
          { jh: "掩月城", loc: "浣衣台", name: "六婆婆", way: "jh 43;sw;sw;sw;w", desc: "年長的婦女，總忍不住要善意地指導一下年輕女孩們的家務。" },
          {
            jh: "掩月城",
            loc: "甜水井",
            name: "青壮小伙",
            name_tw: "青壯小夥",
            way: "jh 43;sw;sw;sw;w;w",
            desc: "在井邊打水的健壯少年，渾身都是緊實的肌肉，總是在有意無意之間展示著自己的力量。",
          },
          { jh: "掩月城", loc: "东林集市", name: "醉酒男子", way: "jh 43;w", desc: "一名喝得酩酊大醉的男子，看起來似是個浪蕩的公子哥。" },
          { jh: "掩月城", loc: "东林集市", name: "仆人", name_tw: "僕人", way: "jh 43;w", desc: "富家公子的僕人，唯唯諾諾地跟在身後。" },
          { jh: "掩月城", loc: "犹怜楼", name: "紫衣仆从", name_tw: "紫衣僕從", way: "jh 43;w;n", desc: "身著紫衣的侍從，不像是青樓守衛，卻更有豪門王府門衛的氣派。" },
          {
            jh: "掩月城",
            loc: "妙玉池",
            name: "轻纱女侍",
            name_tw: "輕紗女侍",
            way: "jh 43;w;n;n",
            desc: "一名身著輕紗的女子，黛眉輕掃，紅唇輕啟，嘴角勾起的那抹弧度彷彿還帶著絲絲嘲諷。眼波一轉。流露出的風情讓人忘記一切。",
          },
          {
            jh: "掩月城",
            loc: "妙玉池",
            name: "抚琴女子",
            name_tw: "撫琴女子",
            way: "jh 43;w;n;n",
            desc: "身著紅衣的撫琴少女，紅色的外袍包裹著潔白細膩的肌膚，她偶爾站起走動，都要露出細白水嫩的小腿。腳上的銀鈴也隨著步伐輕輕發出零零碎碎的聲音。纖細的手指劃過古樸的琵琶。令人騷動的琴聲從弦衫流淌下來。",
          },
          { jh: "掩月城", loc: "曲径", name: "小厮", name_tw: "小廝", way: "jh 43;w;n;n;n", desc: "樓裡的小廝，看起來乖巧得很。" },
          { jh: "掩月城", loc: "曲径", name: "梅映雪", way: "jh 43;w;n;n;n;ne", desc: "一名英姿颯爽的女劍客，身手非凡，負責把守通向後院的小路。" },
          {
            jh: "掩月城",
            loc: "朝暮阁",
            name: "琴楚儿",
            name_tw: "琴楚兒",
            way: "jh 43;w;n;n;n;ne;nw;nw;ne",
            desc: "女子長長的秀發隨著絕美的臉龐自然垂下，月光下，長發上似乎流動著一條清澈的河流，直直瀉到散開的裙角邊，那翠色慾流的玉簫輕輕挨著薄薄的紅唇，蕭聲悽美蒼涼。她的雙手潔白無瑕，輕柔的流動在樂聲中，白色的衣裙，散落的長發，流離悽美。她眉宇間，憂傷像薄薄的晨霧一樣籠罩著。沒有金冠玉飾，沒有尊貴華杉。她卻比任何人都美。",
          },
          { jh: "掩月城", loc: "朝暮阁", name: "寄雪奴儿", name_tw: "寄雪奴兒", way: "jh 43;w;n;n;n;ne;nw;nw;ne", desc: "一條從西域帶來的波斯貓。" },
          {
            jh: "掩月城",
            loc: "荼蘼阁",
            name: "舞眉儿",
            name_tw: "舞眉兒",
            way: "jh 43;w;n;n;n;ne;nw;nw;nw",
            desc: "猶憐樓內最善舞的女子，雲袖輕擺招蝶舞、纖腰慢擰飄絲絛。她似是一隻蝴蝶翩翩飛舞、一片落葉空中搖曳，又似是叢中的一束花、隨著風的節奏扭動腰肢。若有若無的笑容始終盪漾在她臉上，清雅如同夏日荷花。",
          },
          {
            jh: "掩月城",
            loc: "落魂厅",
            name: "黑纱舞女",
            name_tw: "黑紗舞女",
            way: "jh 43;w;n;n;w",
            desc: "一個在大廳中間舞台上表演的舞女，身著黑紗。她玉足輕旋，在地上留下點點畫痕，水袖亂舞，沾染墨汁勾勒眼裡牡丹，裙襬旋舞，朵朵蓮花在她腳底綻放，柳腰輕搖，勾人魂魄，暗送秋波，一時間天地競相為此美色而失色羞愧。可謂是絲竹羅衣舞紛飛！",
          },
          { jh: "掩月城", loc: "落魂厅", name: "女官人", way: "jh 43;w;n;n;w", desc: "猶憐樓的女主事，半老徐娘，風韻猶存。" },
          { jh: "掩月城", loc: "东林集市", name: "老乞丐", way: "jh 43;w;w", desc: "衣衫破爛卻不汙穢的老乞丐，身上有八個口袋，似是丐幫淨衣八袋弟子。" },
          { jh: "掩月城", loc: "东林集市", name: "赤髯刀客", way: "jh 43;w;w", desc: "一名面向粗曠威武的刀客，鬍髯全是火紅之色，似是鍾馗一般。" },
          { jh: "掩月城", loc: "东林集市", name: "华衣女子", name_tw: "華衣女子", way: "jh 43;w;w", desc: "衣著華貴的女子，年紀尚輕，身上似藏有一些秘密。" },
          { jh: "掩月城", loc: "东林集市", name: "马帮弟子", name_tw: "馬幫弟子", way: "jh 43;w;w;w", desc: "漠北馬幫的得力弟子。" },
          { jh: "掩月城", loc: "东林集市", name: "候君凛", name_tw: "候君凜", way: "jh 43;w;w;w", desc: "一名中年男子，雖是平常俠客打扮，卻頗有幾分朝廷中人的氣度。" },
          { jh: "掩月城", loc: "卧马客栈", name: "养马小厮", name_tw: "養馬小廝", way: "jh 43;w;w;w;n", desc: "這是客棧門口負責為客人牽馬餵馬的小廝。" },
          { jh: "掩月城", loc: "客栈大堂", name: "客栈掌柜", name_tw: "客棧掌櫃", way: "jh 43;w;w;w;n;n", desc: "臥馬客棧的大掌櫃的。" },
          { jh: "掩月城", loc: "客栈大堂", name: "店小二", way: "jh 43;w;w;w;n;n", desc: "一個跑前跑後的小二，忙得不可開交。" },
          { jh: "掩月城", loc: "西郊小路", name: "蝮蛇", way: "jh 43;w;w;w;w", desc: "當地特有的毒蛇，嘶嘶地發出警告，你最好不要靠近。" },
          {
            jh: "掩月城",
            loc: "西郊小路",
            name: "东方秋",
            name_tw: "東方秋",
            way: "jh 43;w;w;w;w;nw;n;n",
            desc: "一名年青劍客，腰插一塊顯是王府內的令牌，讓人對其身份產生了好奇。",
          },
          {
            jh: "掩月城",
            loc: "沧浪河渡口西",
            name: "函谷关武官",
            name_tw: "函谷關武官",
            way: "jh 43;w;w;w;w;nw;n;n;nw",
            desc: "函谷關統兵武官，駐守渡口監視著敵人的動向。",
          },
          {
            jh: "掩月城",
            loc: "沧浪河渡口西",
            name: "函谷关官兵",
            name_tw: "函谷關官兵",
            way: "jh 43;w;w;w;w;nw;n;n;nw",
            desc: "這是鎮守函谷關的官兵，在渡口偵探敵情。",
          },
          { jh: "掩月城", loc: "沧浪河谷", name: "长刀敌将", name_tw: "長刀敵將", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw", desc: "這是一名手持長刀的敵將。" },
          { jh: "掩月城", loc: "", name: "黑虎敌将", name_tw: "黑虎敵將", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w", desc: "" },
          { jh: "掩月城", loc: "", name: "长鞭敌将", name_tw: "長鞭敵將", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw", desc: "" },
          { jh: "掩月城", loc: "", name: "巨锤敌将", name_tw: "巨錘敵將", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s", desc: "" },
          { jh: "掩月城", loc: "", name: "狼牙敌将", name_tw: "狼牙敵將", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw", desc: "" },
          { jh: "掩月城", loc: "", name: "金刚敌将", name_tw: "金剛敵將", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw", desc: "" },
          { jh: "掩月城", loc: "", name: "蛮斧敌将", name_tw: "蠻斧敵將", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n", desc: "" },
          { jh: "掩月城", loc: "", name: "血枪敌将", name_tw: "血槍敵將", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw", desc: "" },
          { jh: "掩月城", loc: "", name: "夜魔", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;nw", desc: "" },
          { jh: "掩月城", loc: "", name: "千夜精锐", name_tw: "千夜精銳", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;nw;n", desc: "" },
          { jh: "掩月城", loc: "", name: "胡人王子", way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;nw;n;n;ne", desc: "" },
          {
            jh: "掩月城",
            loc: "",
            name: "夜魔侍从",
            name_tw: "夜魔侍從",
            way: "jh 43;w;w;w;w;nw;n;n;nw;nw;nw;nw;w;sw;nw;sw;s;sw;sw;sw;nw;n;n;n;nw;nw;n;n;ne;ne;ne",
            desc: "",
          },
          {
            jh: "海雲閣",
            loc: "星夜閣4",
            name: "越女",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;w;w;s;s",
            desc: "這是一個隱世劍客，年方十六，眉目之間極為清秀，卻滿懷幽怨，莫不是受了情傷？",
          },
          { jh: "海雲閣", loc: "海云镇", name: "马夫", name_tw: "馬夫", way: "jh 44", desc: "這是一個等候主人的馬夫，耐心地打掃著馬車。" },
          { jh: "海雲閣", loc: "海云镇", name: "野狗", way: "jh 44;n", desc: "一隻渾身髒兮兮的野狗。" },
          { jh: "海雲閣", loc: "海云镇", name: "老镇长", name_tw: "老鎮長", way: "jh 44;n;n", desc: "這是海雲鎮的鎮長，平日裡也沒啥事情可管，便拿著個菸袋閒逛。" },
          { jh: "海雲閣", loc: "晒谷场", name: "烟袋老头", name_tw: "菸袋老頭", way: "jh 44;n;n;w", desc: "一個顯然有著不低功夫底子的老頭子，手拿一個菸袋。" },
          { jh: "海雲閣", loc: "晒谷场", name: "青年女子", way: "jh 44;n;n;w", desc: "一個青年女劍客，年方二八，身姿矯健。" },
          { jh: "海雲閣", loc: "海云镇", name: "背枪客", name_tw: "背槍客", way: "jh 44;n;n;n", desc: "這是一個青年武士，背後揹著一把亮銀長槍。" },
          { jh: "海雲閣", loc: "海云镇", name: "小孩", way: "jh 44;n;n;n;n", desc: "這是海雲鎮的一個小孩子，年方五六歲，天真爛漫。" },
          { jh: "海雲閣", loc: "新月道", name: "野兔", way: "jh 44;n;n;n;n;w;w", desc: "正在吃草的兔子。" },
          { jh: "海雲閣", loc: "满月道", name: "游客", name_tw: "遊客", way: "jh 44;n;n;n;n;e;ne", desc: "這是一個遊客，揹著手享受著山海美景。" },
          {
            jh: "海雲閣",
            loc: "怒龙栈道",
            name: "青年剑客",
            name_tw: "青年劍客",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w",
            desc: "這是一個青年劍客，眼含劍氣。",
          },
          {
            jh: "海雲閣",
            loc: "怒龙栈道",
            name: "九纹龙",
            name_tw: "九紋龍",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w",
            desc: "這是海雲閣四大殺手之一的九紋龍，兇狠非常。",
          },
          {
            jh: "海雲閣",
            loc: "怒龙栈道",
            name: "蟒蛇",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n",
            desc: "一隻昂首直立，吐著長舌芯的大蟒蛇。",
          },
          {
            jh: "海雲閣",
            loc: "临海平台",
            name: "暗哨",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n",
            desc: "這是海雲閣的暗哨，身穿平常的布衣，卻掩飾不了眼神裡的狡黠和敏銳。",
          },
          {
            jh: "海雲閣",
            loc: "怒龙台",
            name: "石邪王",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;e;e;s;s",
            desc: "據說這曾是武林魔道名門掌門，其武學造詣也是登峰造極。",
          },
          {
            jh: "海雲閣",
            loc: "海云门",
            name: "天杀",
            name_tw: "天殺",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e",
            desc: "這是一名海雲閣高級殺手。",
          },
          {
            jh: "海雲閣",
            loc: "海云道",
            name: "地杀",
            name_tw: "地殺",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;wn;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;;s;s",
            desc: "這是一名海雲閣高級殺手。",
          },
          {
            jh: "海雲閣",
            loc: "海云道",
            name: "穿山豹",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;s;s;s;s;s",
            desc: "這事海雲閣四大殺手之一的穿山豹，行動敏捷，狡黠異常。",
          },
          {
            jh: "海雲閣",
            loc: "海云殿",
            name: "海东狮",
            name_tw: "海東獅",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n",
            desc: "這是海雲閣四大殺手之首的海東獅，近十年來從未失手，手底已有數十個江湖名門掌門的性命。",
          },
          {
            jh: "海雲閣",
            loc: "海云殿",
            name: "海云长老",
            name_tw: "海雲長老",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n",
            desc: "這是海雲閣內的長老級殺手。",
          },
          {
            jh: "海雲閣",
            loc: "海云殿",
            name: "红纱舞女",
            name_tw: "紅紗舞女",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n",
            desc: "這是一個身著輕紗的舞女，穿著輕薄，舞姿極盡媚態，眉目輕笑之間卻隱含著淡淡的殺氣。",
          },
          {
            jh: "海雲閣",
            loc: "海云殿",
            name: "青纱舞女",
            name_tw: "青紗舞女",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n",
            desc: "這是一個身著輕紗的舞女，穿著輕薄，舞姿極盡媚態，眉目輕笑之間卻隱含著淡淡的殺氣。",
          },
          {
            jh: "海雲閣",
            loc: "海云殿",
            name: "紫纱舞女",
            name_tw: "紫紗舞女",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n",
            desc: "這是一個身著輕紗的舞女，穿著輕薄，舞姿極盡媚態，眉目輕笑之間卻隱含著淡淡的殺氣。",
          },
          {
            jh: "海雲閣",
            loc: "海云殿",
            name: "白纱舞女",
            name_tw: "白紗舞女",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n",
            desc: "這是一個身著輕紗的舞女，穿著輕薄，舞姿極盡媚態，眉目輕笑之間卻隱含著淡淡的殺氣。",
          },
          {
            jh: "海雲閣",
            loc: "",
            name: "虬髯犯人",
            name_tw: "虯髯犯人",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;e;e;e;n;n;nw;w;w;nw",
            desc: "這人滿臉虯髯，頭發長長的直垂至頸，衣衫破爛不堪，簡直如同荒山中的野人",
          },
          {
            jh: "海雲閣",
            loc: "",
            name: "六如公子",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;n;w;n;n;n;n;w;n;w;w;n;n;n",
            desc: "這是一個隱士，武學修為極高，也似乎並不受海雲閣轄制。",
          },
          {
            jh: "海雲閣",
            loc: "",
            name: "萧秋水",
            name_tw: "蕭秋水",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;n;e;n;n;n;n;n;e;e;n;n",
            desc: "傳聞他出自天下第一名門浣花劍派，卻無人知曉他的名諱。",
          },
          {
            jh: "海雲閣",
            loc: "苍穹栈道",
            name: "啸林虎",
            name_tw: "嘯林虎",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n",
            desc: "這事海雲閣四大殺手之一的嘯林虎，武功極高。",
          },
          {
            jh: "海雲閣",
            loc: "雪山小道",
            name: "陆大刀",
            name_tw: "陸大刀",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e",
            desc: "江湖南四奇之首，人稱仁義陸大刀。",
          },
          {
            jh: "海雲閣",
            loc: "雪山小道",
            name: "水剑侠",
            name_tw: "水劍俠",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne",
            desc: "江湖南四奇之一，外號叫作“冷月劍”",
          },
          {
            jh: "海雲閣",
            loc: "雪山小道",
            name: "乘风客",
            name_tw: "乘風客",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne",
            desc: "江湖南四奇之一，外號叫作“柔雲劍”。",
          },
          {
            jh: "海雲閣",
            loc: "雪山山脚",
            name: "血刀妖僧",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se",
            desc: "「血刀聖教」掌門人，自稱「武林第一邪派高手」，門下都作和尚打扮，但個個都是十惡不赦的淫僧。",
          },
          {
            jh: "海雲閣",
            loc: "山路",
            name: "花铁枪",
            name_tw: "花鐵槍",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se;ne;ne",
            desc: "江湖南四奇之一，外號叫作“中平槍”。",
          },
          {
            jh: "海雲閣",
            loc: "雪洞",
            name: "狄小侠",
            name_tw: "狄小俠",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se;ne;ne;n;n;n;n;nw",
            desc: "其貌不揚，但卻有情有義，敢愛敢恨，性格鮮明。",
          },
          {
            jh: "海雲閣",
            loc: "雪洞",
            name: "水姑娘",
            way: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;e;e;e;e;e;e;n;n;n;n;n;n;n;n;n;n;n;n;n;e;e;ne;ne;e;se;se;se;ne;ne;n;n;n;n;nw",
            desc: "白衫飄飄，樣貌清秀俏麗，人品俊雅，嫉惡如仇。",
          },
          { jh: "幽冥山莊", loc: "幽暗山路", name: "野狗", way: "jh 45;ne", desc: "一條低頭啃著骨頭的野狗。" },
          { jh: "幽冥山莊", loc: "幽暗山路", name: "毒蛇", way: "jh 45;ne;ne;n;n", desc: "當地特有的毒蛇，嘶嘶地發出警告，你最好不要靠近。" },
          {
            jh: "幽冥山莊",
            loc: "五龙堂",
            name: "柳激烟",
            name_tw: "柳激煙",
            way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n",
            desc: "五湖九州、黑白兩道、十二大派都尊稱為“捕神”的六扇門第一把好手。",
          },
          {
            jh: "幽冥山莊",
            loc: "正厅",
            name: "龟敬渊",
            name_tw: "龜敬淵",
            way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n",
            desc: "一名鶉衣百結、滿臉黑須的老人，眼睛瞪得像銅錢一般大，粗眉大目，雖然比較矮，但十分粗壯，就像鐵罩一般，一雙粗手，也比常人粗大一二倍。這人身上並無兵器，但一身硬功，“鐵布衫”橫練，再加上“十三太保”與“童於功”，據說已有十一成的火候，不但刀劍不入，就算一座山塌下來，也未必把他壓得住！",
          },
          {
            jh: "幽冥山莊",
            loc: "正厅",
            name: "淩玉象",
            way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n",
            desc: "銀眉白須，容貌十分清灌，身形頎長，常露慈藹之色，背插長劍",
          },
          {
            jh: "幽冥山莊",
            loc: "正厅",
            name: "慕容水云",
            name_tw: "慕容水雲",
            way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n",
            desc: "一個白發斑斑，但臉色泛紅的老者，腰問一柄薄而利的緬刀，終日不離身，左右太陽穴高高鼓起，顯然內功已入化境。",
          },
          {
            jh: "幽冥山莊",
            loc: "正厅",
            name: "沈错骨",
            name_tw: "沈錯骨",
            way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n",
            desc: "一個裝扮似道非道的老者，黑發長髯，態度冷傲，手中一把拂塵。",
          },
          {
            jh: "幽冥山莊",
            loc: "书房",
            name: "冷血",
            way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;e",
            desc: "善劍法，性堅忍，他的劍法是沒有名堂的，他刺出一劍是一劍，快、準而狠，但都是沒招式名稱的。",
          },
          {
            jh: "幽冥山莊",
            loc: "后花园",
            name: "庄之洞",
            name_tw: "莊之洞",
            way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;n",
            desc: "腰間纏著椎鏈子，一副精明能幹的樣子。",
          },
          {
            jh: "幽冥山莊",
            loc: "后花园",
            name: "高山青",
            way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;n",
            desc: "高頭大馬，高山青拿著的是一條玉一般的桃木棍，棒身細滑，杖尖若刀，長七尺六寸。",
          },
          { jh: "幽冥山莊", loc: "二楼", name: "金盛煌", way: "jh 45;ne;ne;n;n;ne;ne;nw;nw;nw;n;n;n;n;w", desc: "富甲一方，武功蓋世的“三十六手蜈蚣鞭”。" },
          { jh: "幽冥山莊", loc: "幽暗山路", name: "樵夫", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n", desc: "一個砍柴為生的樵夫。" },
          { jh: "幽冥山莊", loc: "火堆", name: "鲍龙", name_tw: "鮑龍", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;e", desc: "虯髯怒目的大漢。" },
          { jh: "幽冥山莊", loc: "火堆", name: "鲍蛇", name_tw: "鮑蛇", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;e", desc: "虯髯怒目的大漢。" },
          { jh: "幽冥山莊", loc: "火堆", name: "鲍虎", name_tw: "鮑虎", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;e", desc: "虯髯怒目的大漢。" },
          {
            jh: "幽冥山莊",
            loc: "山庄石道",
            name: "过之梗",
            name_tw: "過之梗",
            way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne",
            desc: "年約四五十歲，長眉黑髯，樣子十分剛正。",
          },
          { jh: "幽冥山莊", loc: "山庄石道", name: "翁四", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n", desc: "武功不弱，而且為人正義，素得俠名。" },
          {
            jh: "幽冥山莊",
            loc: "小连环坞",
            name: "屈奔雷",
            way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;e",
            desc: "行事於正邪之間，性格剛烈，脾氣古怪，不過從不作傷天害理之事，只是明目張膽的搶劫燒殺，這人可幹得多了；據說他武功很高，內功外功兼備，鐵斧也使得出神入化。",
          },
          { jh: "幽冥山莊", loc: "小连环坞", name: "屈奔雷分身", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;e", desc: "屈奔雷分身，實力不容小視！" },
          {
            jh: "幽冥山莊",
            loc: "枫林小栈",
            name: "伍湘云",
            name_tw: "伍湘雲",
            way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;e;e",
            desc: "一身綵衣，垂發如瀑，腰上挽了一個小花結，結上兩柄玲瓏的小劍，更顯得人嬌如花，容光照人。",
          },
          {
            jh: "幽冥山莊",
            loc: "枫林小栈",
            name: "殷乘风",
            name_tw: "殷乘風",
            way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;e;e",
            desc: "身段頎長而略瘦，但眉宇之間，十分精明銳利，猶如瓊瑤玉樹，豐神英朗",
          },
          {
            jh: "幽冥山莊",
            loc: "山庄石道",
            name: "辛仇",
            way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n",
            desc: "自幼殘肢斷臂，受人歧視，故苦練奇技，仇殺江湖，無人不畏之如神鬼也。",
          },
          { jh: "幽冥山莊", loc: "山庄石道", name: "辛杀", name_tw: "辛殺", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n", desc: "一個風程僕僕的俠客。" },
          {
            jh: "幽冥山莊",
            loc: "山庄石道",
            name: "蔡玉丹",
            way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw",
            desc: "家財萬貫，是絲綢商人，但仁俠異常，喜助人，義疏財，武功很高。",
          },
          {
            jh: "幽冥山莊",
            loc: "山庄石道",
            name: "暗杀",
            name_tw: "暗殺",
            way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n",
            desc: "這是跟隨辛十三孃的殺手。",
          },
          {
            jh: "幽冥山莊",
            loc: "山庄石道",
            name: "辛十三娘",
            way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n",
            desc: "這女魔頭似具有動物的本能護體色，如貼在樹上動也不動，便像一張葉子一般，如坐在地上動也不動，便像一顆岩石一般；在黑夜裡便像是夜色的一部分，在雪地上就變成了雪花，誰也認不出來。",
          },
          {
            jh: "幽冥山莊",
            loc: "暗风岭",
            name: "巴司空",
            way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;w",
            desc: "他是大理國三公之一。一個又瘦又黑的漢子，但他的擅長輕功。",
          },
          {
            jh: "幽冥山莊",
            loc: "山庄石道",
            name: "追命",
            way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e",
            desc: "腳力無雙，所以輕功也奇佳，追蹤術一流，嗜酒如命。",
          },
          {
            jh: "幽冥山莊",
            loc: "山庄石道",
            name: "艳无忧",
            name_tw: "豔無憂",
            way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e",
            desc: "江湖中一大魔頭，年輕貌美，因她擅‘吸血功’，以別人之鮮血，保持她的青春與容貌。",
          },
          {
            jh: "幽冥山莊",
            loc: "山庄石道",
            name: "摄魂鬼杀",
            name_tw: "攝魂鬼殺",
            way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e",
            desc: "這是跟隨豔無憂的殺手，武功頗為高深。",
          },
          { jh: "幽冥山莊", loc: "幽冥山庄", name: "幽冥山庄", name_tw: "幽冥山莊", way: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;e;e", desc: "" },
          { jh: "花街", loc: "花街", name: "尊信门杀手", name_tw: "尊信門殺手", way: "jh 46;e", desc: "尊信門叛將帶領的殺手，個個心狠手辣。" },
          { jh: "花街", loc: "花街", name: "花札敖", way: "jh 46;e", desc: "魔宗長老，紫色瞳孔彰顯他天魔功法已經大成。" },
          { jh: "花街", loc: "花街", name: "山赤岳", name_tw: "山赤嶽", way: "jh 46;e;e", desc: "魔宗長老，使一對八角大錘。" },
          { jh: "花街", loc: "花街", name: "鹰飞", name_tw: "鷹飛", way: "jh 46;e;e;e", desc: "魔宗後起高手，是魔宗的希望。" },
          { jh: "花街", loc: "花街", name: "由蚩敌", name_tw: "由蚩敵", way: "jh 46;e;e;e;e", desc: "蒙古兩大高手之一，擅用連環索。" },
          { jh: "花街", loc: "花街", name: "强望生", name_tw: "強望生", way: "jh 46;e;e;e;e;e", desc: "火須紅發，蒙古兩大高手之一。" },
          { jh: "花街", loc: "花街", name: "莫意闲", name_tw: "莫意閒", way: "jh 46;e;e;e;e;e;e", desc: "江湖黑道邪派高手之一，列名十大高手榜。" },
          { jh: "花街", loc: "花街", name: "甄素善", way: "jh 46;e;e;e;e;e;e;e", desc: "黑道最富有誘惑力的女人，風情萬種。" },
          { jh: "花街", loc: "醉梦楼", name: "谈应手", name_tw: "談應手", way: "jh 46;e;e;e;e;e;e;e;e", desc: "黑道高手，十惡莊莊主，一方霸主。" },
          {
            jh: "花街",
            loc: "大厅",
            name: "方夜羽",
            way: "jh 46;e;e;e;e;e;e;e;e;n",
            desc: "「魔師」龐斑的關門弟子，有「小魔師」之稱，文秀之極，肌膚比少女還滑嫩，但身形頗高，肩寬膊闊，秀氣透出霸氣，造成一種予人文武雙全的感覺。",
          },
          { jh: "花街", loc: "二楼", name: "封寒", way: "jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e", desc: "黑榜天下第二的高手，天下第一刀客。" },
          { jh: "花街", loc: "沁芳阁", name: "寒碧翠", way: "jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;e", desc: "優雅十分，舞姿傾城，據說觀舞可領悟出長生之道。" },
          { jh: "花街", loc: "凝香阁", name: "薄昭如", way: "jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;s", desc: "清雅十分，舞姿傾城，據說觀舞可領悟出防禦之道。" },
          {
            jh: "花街",
            loc: "藏娇阁",
            name: "盈散花",
            way: "jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e;n",
            desc: "據說來自西域，擅長波斯舞，每日來觀舞之人絡繹不絕，雖耗費頗高，但據說觀舞可以領悟出武學攻擊招式的奧秘。",
          },
          { jh: "花街", loc: "花街", name: "怒蛟高手", way: "jh 46;e;e;e;e;e;e;e;e;e", desc: "這是黑道第一大幫-怒蛟幫的頂尖高手。" },
          {
            jh: "花街",
            loc: "花街",
            name: "戚长征",
            name_tw: "戚長征",
            way: "jh 46;e;e;e;e;e;e;e;e;e",
            desc: "江湖中的後起之秀，新一代高手中最好的刀客，得左手刀封寒親傳。",
          },
          { jh: "花街", loc: "花街", name: "韩柏", name_tw: "韓柏", way: "jh 46;e;e;e;e;e;e;e;e;e;e", desc: "陰差陽錯成為高手的小書童。" },
          { jh: "花街", loc: "花街", name: "烈震北", way: "jh 46;e;e;e;e;e;e;e;e;e;e;e", desc: "黑道最負盛名的神醫，義氣幹雲。" },
          { jh: "花街", loc: "花街", name: "赤尊信", way: "jh 46;e;e;e;e;e;e;e;e;e;e;e;e", desc: "尊信門門主，黑榜十大高手之一。" },
          { jh: "花街", loc: "花街", name: "乾罗", name_tw: "乾羅", way: "jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e", desc: "山城門主，黑榜十大高手之一。" },
          {
            jh: "花街",
            loc: "花街",
            name: "厉若海",
            name_tw: "厲若海",
            way: "jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e;e",
            desc: "黑道高手排名第三，也有人說他實力與浪翻雲相較也不差半分。",
          },
          { jh: "花街", loc: "花街", name: "浪翻云", name_tw: "浪翻雲", way: "jh 46;e;e;e;e;e;e;e;e;e;e;e;e;e;e;e", desc: "黑榜之首，江湖第一大幫的核心人物。" },
          { jh: "西涼城", loc: "荒漠", name: "响尾蛇", name_tw: "響尾蛇", way: "jh 47;ne", desc: "一條帶有劇毒，尾環在禦敵時發出嗡嗡響的響尾蛇。" },
          { jh: "西涼城", loc: "荒丘", name: "官差", way: "jh 47;ne;n;n;n;nw", desc: "這是西涼城衙門的一名官差，呆呆的不言不動，只是渾身顫抖。" },
          { jh: "西涼城", loc: "荒丘", name: "官兵", way: "jh 47;ne;n;n;n;nw", desc: "西涼城的官兵，透著幾分疲憊。" },
          { jh: "西涼城", loc: "城外马道", name: "驿卒", name_tw: "驛卒", way: "jh 47;ne;n;n;n;ne;ne;e", desc: "這是別的城市前來此處送信的驛卒，滿面塵土。" },
          { jh: "西涼城", loc: "西凉城门", name: "官兵", way: "jh 47;ne;n;n;n;ne;ne;e;e;e", desc: "西涼城的官兵，透著幾分疲憊。" },
          { jh: "西涼城", loc: "土路", name: "苦力", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne", desc: "一個苦力打扮的漢子在這裡等人來僱用。" },
          { jh: "西涼城", loc: "土路", name: "屠淩心", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se", desc: "身材矮小，一張臉醜陋無比，滿是刀疤傷痕。" },
          { jh: "西涼城", loc: "土路", name: "昆仑杀手", name_tw: "崑崙殺手", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se", desc: "一個風程僕僕的俠客。" },
          { jh: "西涼城", loc: "土路", name: "金淩霜", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s", desc: "六十來歲年紀，雙目神光湛然。" },
          { jh: "西涼城", loc: "土路", name: "醉汉", name_tw: "醉漢", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s", desc: "一個喝得醉醺醺的年輕人。。。。。" },
          { jh: "西涼城", loc: "土路", name: "钱淩异", name_tw: "錢淩異", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s;s", desc: "一名高瘦的漢子，眼神陰毒。" },
          {
            jh: "西涼城",
            loc: "马王庙",
            name: "齐伯川",
            name_tw: "齊伯川",
            way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;se;s;s;s",
            desc: "燕陵鏢局的少鏢頭，平日裡飛揚跋扈，現在卻是一副落魄樣子。",
          },
          { jh: "西涼城", loc: "土路", name: "樵夫", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n", desc: "你看到一個粗壯的大漢，身上穿著普通樵夫的衣服。" },
          {
            jh: "西涼城",
            loc: "土路",
            name: "疯狗",
            name_tw: "瘋狗",
            way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne",
            desc: "一隻渾身髒兮兮的野狗，一雙眼睛正惡狠狠地瞪著你。",
          },
          {
            jh: "西涼城",
            loc: "正殿",
            name: "止观大师",
            name_tw: "止觀大師",
            way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n",
            desc: "一名白衣灰須的老僧，雙眼炯炯有神。",
          },
          {
            jh: "西涼城",
            loc: "正殿",
            name: "止观分身",
            name_tw: "止觀分身",
            way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n",
            desc: "止觀大師的分身，戰鬥力爆棚！",
          },
          { jh: "西涼城", loc: "正殿", name: "慧清", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n", desc: "止觀大師的親傳弟子，灰色衣袍。" },
          {
            jh: "西涼城",
            loc: "殿后小路",
            name: "佛灯",
            name_tw: "佛燈",
            way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;e;e;n;n;n;n;n;n;ne;n",
            desc: "這是一盞佛燈，閃著微弱的青光，照亮著山路。",
          },
          { jh: "西涼城", loc: "土路", name: "野狗", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n", desc: "一隻渾身髒兮兮的野狗。" },
          { jh: "西涼城", loc: "土路", name: "农民", name_tw: "農民", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n", desc: "一個戴著斗笠，正在辛勤勞作的農民。" },
          {
            jh: "西涼城",
            loc: "土路",
            name: "马夫",
            name_tw: "馬夫",
            way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n",
            desc: "這是一個等候主人的馬夫，耐心地打掃著馬車。",
          },
          { jh: "西涼城", loc: "铁剑山庄", name: "管家", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne", desc: "鐵劍山莊管家，約莫五十來歲。" },
          {
            jh: "西涼城",
            loc: "正堂",
            name: "李铁杉",
            name_tw: "李鐵杉",
            way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n",
            desc: "一名紅光滿面的高大老者。",
          },
          {
            jh: "西涼城",
            loc: "燕陵镖局",
            name: "齐润翔",
            name_tw: "齊潤翔",
            way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;nw",
            desc: "一名老者坐在鏢局大廳，須長及胸，生得一張紫膛臉，正是燕陵鏢局的總鏢頭齊潤翔。",
          },
          {
            jh: "西涼城",
            loc: "燕陵镖局",
            name: "黑衣镖师",
            name_tw: "黑衣鏢師",
            way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;nw",
            desc: "身著黑衣的鏢師，一看就是經驗豐富的老江湖。",
          },
          {
            jh: "西涼城",
            loc: "练武场",
            name: "镖师",
            name_tw: "鏢師",
            way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;nw;nw",
            desc: "燕陵鏢局的年青鏢師，正在發呆。",
          },
          { jh: "西涼城", loc: "中堂", name: "捕快", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;w;w", desc: "西涼城的捕快，腰佩單刀。" },
          {
            jh: "西涼城",
            loc: "中堂",
            name: "伍定远",
            name_tw: "伍定遠",
            way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;w;w",
            desc: "黝黑的四方臉上一派威嚴，一望便知是這些官差的頭兒，衙門的捕頭。",
          },
          { jh: "西涼城", loc: "后堂", name: "捕快", way: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;w;w;w", desc: "西涼城的捕快，腰佩單刀。" },
          { jh: "高昌迷宮", loc: "蒙古包", name: "苏普", name_tw: "蘇普", way: "jh 48;e;ne", desc: "年輕俊朗的小夥子，虎背熊腰，是大漠第一勇士蘇魯克的兒子。" },
          {
            jh: "高昌迷宮",
            loc: "蒙古包",
            name: "糟老头子",
            name_tw: "糟老頭子",
            way: "jh 48;e;ne",
            desc: "他滿頭白發，竟無一根是黑的，身材甚是高大，只是弓腰曲背，衰老已極",
          },
          {
            jh: "高昌迷宮",
            loc: "蒙古包",
            name: "陈达海",
            name_tw: "陳達海",
            way: "jh 48;e;ne",
            desc: "一個身穿羊皮襖的高大漢子，虯髯滿腮，他腰間上左右各插著一柄精光閃亮的短劍。兩柄短劍的劍把一柄金色，一柄銀色。",
          },
          { jh: "高昌迷宮", loc: "蒙古包", name: "阿曼", way: "jh 48;e;ne", desc: "貌美如花的哈薩克女子，蘇普的妻子。" },
          { jh: "高昌迷宮", loc: "蒙古包", name: "太行刀手", way: "jh 48;e;ne", desc: "當地的刀功絕活大師，隨便放在江湖中都是個了不起的刀霸。" },
          { jh: "高昌迷宮", loc: "蒙古包", name: "哈卜拉姆", way: "jh 48;e;ne;ne", desc: "鐵延部中精通「可蘭經」、最聰明最有學問的老人。" },
          { jh: "高昌迷宮", loc: "蒙古包", name: "牧民", way: "jh 48;e;ne;ne;se", desc: "哈薩克牧民，正在做著晚餐。" },
          {
            jh: "高昌迷宮",
            loc: "",
            name: "天铃鸟",
            name_tw: "天鈴鳥",
            way: "jh 48;e;ne;ne;s",
            desc: "這鳥兒的歌聲像是天上的銀鈴。它只在晚上唱歌，白天睡覺。有人說，這是天上的星星掉下來之後變的。又有些哈薩克人說，這是草原上一個最美麗、最會唱歌的少女死了之後變的。她的情郎不愛她了，她傷心死的。",
          },
          { jh: "高昌迷宮", loc: "大沙漠", name: "霍元龙", name_tw: "霍元龍", way: "jh 48;e;se", desc: "虯髯大漢，身挎長刀，一臉凶神惡煞。" },
          { jh: "高昌迷宮", loc: "大沙漠", name: "太行刀手", way: "jh 48;e;se", desc: "當地的刀功絕活大師，隨便放在江湖中都是個了不起的刀霸。" },
          { jh: "高昌迷宮", loc: "戈壁滩", name: "恶狼", name_tw: "惡狼", way: "jh 48;e;se;se;e;ne;se", desc: "一頭大灰狼，閃著尖利的牙齒。" },
          { jh: "高昌迷宮", loc: "戈壁滩", name: "响尾蛇", name_tw: "響尾蛇", way: "jh 48;e;se;se;e;ne;se;e", desc: "戈壁灘上的響尾蛇，你要小心了！" },
          { jh: "高昌迷宮", loc: "大沙漠", name: "骆驼", name_tw: "駱駝", way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s", desc: "行走於沙漠的商隊駱駝。" },
          {
            jh: "高昌迷宮",
            loc: "山陵",
            name: "男尸",
            name_tw: "男屍",
            way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s;s;s;sw",
            desc: "一具男屍，看身上的裝束似是中原武士。",
          },
          {
            jh: "高昌迷宮",
            loc: "山洞",
            name: "老翁",
            way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s;s;s;sw;sw;s",
            desc: "身形瘦弱，形容枯槁，愁眉苦臉，身上穿的是漢人裝束，衣帽都已破爛不堪。但他頭發捲曲，卻又不大像漢人。",
          },
          {
            jh: "高昌迷宮",
            loc: "山洞",
            name: "李文秀",
            way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;se;se;s;s;s;sw;sw;s;sw;se",
            desc: "身著哈薩克長袍的漢族少女，眉清目秀，貌美如花。有人說，她唱出的歌聲，便如同那天鈴鳥一般動人。",
          },
          { jh: "高昌迷宮", loc: "甬道", name: "苏鲁克", name_tw: "蘇魯克", way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;ne;event_1_369927", desc: "哈薩克第一勇士，力大無窮。" },
          {
            jh: "高昌迷宮",
            loc: "甬道",
            name: "车尔库",
            name_tw: "車爾庫",
            way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;ne;event_1_369927;n",
            desc: "哈薩克第二勇士，蘇魯克的好朋友。",
          },
          {
            jh: "高昌迷宮",
            loc: "高昌宝藏",
            name: "瓦耳拉齐",
            name_tw: "瓦耳拉齊",
            way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;ne;event_1_369927;n;n;n",
            desc: "白衣白袍的哈薩克高手，為李文秀所救。",
          },
          { jh: "高昌迷宮", loc: "高昌宝藏", name: "分身", way: "jh 48;e;se;se;e;ne;se;e;e;e;ne;ne;event_1_369927;n;n;n", desc: "瓦耳拉齊的分身，十分強悍！" },
          { jh: "京城", loc: "城外山路", name: "贵妇", name_tw: "貴婦", way: "rank go 194;s;se", desc: "城裡大戶人家的貴婦，正要上山拜佛還願。" },
          {
            jh: "京城",
            loc: "城外山路",
            name: "王一通",
            way: "rank go 194;s;se;se",
            desc: "千萬個小人物中的一個，讀過書算過賬，沒有經世致用之才，沒有平定一方之力，匡扶天下他沒有這個志氣，建功立業怕也沒有這個本事。老婆剛又生了個孩子，家裡卻又有債主上門，正急得如熱鍋上的螞蟻。",
          },
          { jh: "京城", loc: "西直门", name: "城门官兵", name_tw: "城門官兵", way: "rank go 194;s;se;se;se;e", desc: "鎮守京城的官兵，銀盔銀甲，威風凜凜。" },
          { jh: "京城", loc: "阜成门", name: "城门官兵", name_tw: "城門官兵", way: "rank go 194;s;se;se;se;e;s;s;s", desc: "鎮守京城的官兵，銀盔銀甲，威風凜凜。" },
          {
            jh: "京城",
            loc: "御花园",
            name: "银川公主",
            name_tw: "銀川公主",
            way: "rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;nw;nw;n",
            desc: "貌美的皇帝長女，奉命西嫁和番，性格仁慈，高貴端麗，讓人不敢輕侮，西疆大戰中，展現出皇家天女的絕代風華，令無數亂臣賊子為之感動敬服。見識卓越，忍人所不能忍，在去西疆途中愛慕盧雲，可為了國家深藏情感。銀川有著極其獨立的人格和無奈得讓人心碎的命運。只因生在帝王家，便要在豆蔻年華永遠放棄自己的愛情和未來，遠嫁異邦，靠自己柔軟無依的肩膀支撐起千萬將士的性命和兩國的和平。都說華夏自古多英豪，為何女子從此不得歸故鄉？",
          },
          {
            jh: "京城",
            loc: "皇极殿",
            name: "柳昂天",
            way: "rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;n;n;n",
            desc: "膽小的大將軍，赳赳武夫，官拜大都督，統領數十萬兵馬，卻是個怯懦政客。他表面是天下英雄的領袖和希望，然而卻一再屈從於強權，虛偽而懦弱。他不是殘害忠良之輩，但也不會為了公道正義損害自己的功名利祿；與奸臣鬥，並非因為伸張正義，而是因為自己也不好過。弱小者的沉默也許還能借口能力有限自身難保，然而處在這樣位高權重的位置，膽小卻是他千秋萬世的罪惡。",
          },
          { jh: "京城", loc: "皇极殿", name: "柳府铁卫", name_tw: "柳府鐵衛", way: "rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;n;n;n", desc: "柳府的私人衛隊。" },
          {
            jh: "京城",
            loc: "皇极殿",
            name: "江充",
            way: "rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;n;n;n",
            desc: "大奸臣，年約五十，十八省總按察，官拜太子太師。陰謀詭詐，多疑善變，是景泰王朝的第一權臣，與東廠劉敬、徵北大都督柳昂天鼎足而立。為一宗多年塵封的舊案屢出天山，威勢所逼，終令朝廷要員棄官亡命，也讓許多江湖人物走投無路。一個沒有武功、沒有文才的矮胖小人，憑著三寸不爛之舌和掌控他人的心理，便能夠驅使天下英傑如驅使豬狗。所有禍端皆應他而起，縱你有神佛之能也要被他誣陷、算計。都說只因奸臣當道，所以才有天下英雄皆不得志。然，哪朝沒有奸臣，何曾有過斷絕？當皇帝被矇蔽、直言之人死於橫禍、天下黎民盡皆哀嚎的時候，為何朝堂之上鴉雀無聲；而元兇授首、挫骨揚灰之際，卻又為何如此人聲鼎沸、爭先恐後？其實，膽怯的我們都曾是小人的幫兇，在每個時代裡，扮演著每一個骯髒的龐然大物的吹鼓手。江充，便是所有沉默的天下人心裡開出的惡之花。",
          },
          {
            jh: "京城",
            loc: "御书房",
            name: "刘敬",
            name_tw: "劉敬",
            way: "rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;ne;ne;n;n;nw",
            desc: "作為朝廷三大派之一的領袖人物，他心機深沉、眼光毒辣、言辭精巧。",
          },
          {
            jh: "京城",
            loc: "御书房",
            name: "小太监",
            name_tw: "小太監",
            way: "rank go 194;s;se;se;se;e;s;s;s;e;se;e;e;n;n;ne;ne;n;n;nw",
            desc: "宮裡的小太監，身著布衣。",
          },
          {
            jh: "京城",
            loc: "正阳门",
            name: "城门官兵",
            name_tw: "城門官兵",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e",
            desc: "鎮守京城的官兵，銀盔銀甲，威風凜凜。",
          },
          {
            jh: "京城",
            loc: "永定大街",
            name: "东厂侍卫",
            name_tw: "東廠侍衛",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s",
            desc: "東廠的鷹犬，怕是又在做什麼壞事。",
          },
          {
            jh: "京城",
            loc: "永定大街",
            name: "九华山女弟子",
            name_tw: "九華山女弟子",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s",
            desc: "九華劍派的女弟子，身姿綽約，腰帶長劍。",
          },
          {
            jh: "京城",
            loc: "永定大街",
            name: "娟儿",
            name_tw: "娟兒",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s",
            desc: "青衣秀士徒弟，豔婷之師妹，對師傅師姐有極強的依賴心，情牽阿傻，然而阿傻恢復記憶後忘記與娟兒的一切經歷，離娟兒而去。",
          },
          { jh: "京城", loc: "永定大街", name: "侯府小姐", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s", desc: "這是一個侯府的小姐，身著華麗，談吐優雅。" },
          {
            jh: "京城",
            loc: "永定大街",
            name: "小丫鬟",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s",
            desc: "一個笑嘻嘻的小丫頭，侯府的丫鬟，跟小姐顯是關係親密。",
          },
          { jh: "京城", loc: "王府后街", name: "莫淩山", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e", desc: "崑崙劍派高手之一，心狠手辣。" },
          {
            jh: "京城",
            loc: "王府后街",
            name: "昆仑弟子",
            name_tw: "崑崙弟子",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e",
            desc: "崑崙劍派的弟子，白衣長劍。",
          },
          { jh: "京城", loc: "王府后街", name: "安道京", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e", desc: "東廠大太監之一，功夫深不可測。" },
          {
            jh: "京城",
            loc: "王府后街",
            name: "东厂高手",
            name_tw: "東廠高手",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e",
            desc: "東廠高手，面目冷漠。",
          },
          {
            jh: "京城",
            loc: "萬福樓",
            name: "伍崇卿",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;s",
            desc: "伍定遠的義子，本為一流浪兒，伍定遠收養了他，並取名伍崇卿。武英帝復辟後為“義勇人”成員。後性情大變，怨伍定遠懦弱退縮。想用自己的方式保護伍定遠。曾在“魁星站五關”後蒙面黑衣獨自一人殺入太醫院，擊敗了包括蘇穎超、哲爾丹在內的眾多高手。",
          },
          {
            jh: "京城",
            loc: "萬福樓",
            name: "苏颖超",
            name_tw: "蘇穎超",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;s",
            desc: "武林四大宗師之一華山派掌門寧不凡嫡傳弟子，寧不凡退隱後，接任華山掌門，為武林新一代的俊傑。才貌雙全的蘇穎超，和「紫雲軒」少閣主瓊芳一見鍾情，可謂青梅竹馬。在太醫院中被黑衣人伍崇卿擊敗後，接著練劍遭遇瓶頸，揹負上了沉重的心理包袱。",
          },
          {
            jh: "京城",
            loc: "萬福樓",
            name: "店伙计",
            name_tw: "店夥計",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;s",
            desc: "一個酒樓的小夥計，十五六歲上下。",
          },
          {
            jh: "京城",
            loc: "萬福樓",
            name: "茶圣-陆羽",
            name_tw: "茶聖-陸羽",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;s",
            desc: "一個酒樓的小夥計，十五六歲上下。",
          },
          {
            jh: "京城",
            loc: "王府后街",
            name: "郝震湘",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e",
            desc: "本是一方名捕，奈何受人冤枉入獄，為保家人性命不得已委身於錦衣衛旗下，滿面惆悵。",
          },
          {
            jh: "京城",
            loc: "王府后街",
            name: "锦衣卫",
            name_tw: "錦衣衛",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e",
            desc: "本是朝廷衛士，卻已受東廠所轄。",
          },
          {
            jh: "京城",
            loc: "王府后街",
            name: "韦子壮",
            name_tw: "韋子壯",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e;e",
            desc: "武當弟子，現為侯府衛士統領，功力深厚。",
          },
          {
            jh: "京城",
            loc: "王府后街",
            name: "王府卫士",
            name_tw: "王府衛士",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e;e",
            desc: "善穆侯府的衛士，雙目炯炯有神，腰掛長刀。",
          },
          {
            jh: "京城",
            loc: "善穆侯府",
            name: "王府卫士",
            name_tw: "王府衛士",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e;e;n",
            desc: "善穆侯府的衛士，雙目炯炯有神，腰掛長刀。",
          },
          {
            jh: "京城",
            loc: "善穆侯府",
            name: "风流司郎中",
            name_tw: "風流司郎中",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;e;e;n",
            desc: "俊俏無比的當朝司郎中，風流倜儻，當朝大學士之子，也是少林天絕神僧關門弟子。",
          },
          {
            jh: "京城",
            loc: "永安大街",
            name: "学士",
            name_tw: "學士",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w",
            desc: "一個在六部任職的學士，雖著便服，但氣度不凡。",
          },
          {
            jh: "京城",
            loc: "永安大街",
            name: "书生",
            name_tw: "書生",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w",
            desc: "一個斯文的書生，穿著有些寒酸。",
          },
          { jh: "京城", loc: "白虎赌坊", name: "荷官", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;s", desc: "白虎賭坊的荷官，身姿曼妙，煙視媚行。" },
          {
            jh: "京城",
            loc: "白虎赌坊",
            name: "胡媚儿",
            name_tw: "胡媚兒",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;s",
            desc: "絕美無比的性感尤物，她雖使毒厲害，但卻是一個極重情義之人。她認死理，為江充辦事，便是一心一意，縱然江充勢敗，也是全力為其尋找玉璽。後來遇見盧雲，兩人日久相處，產生愛意，更是願意為了盧雲犧牲自己的一切。後來在與盧雲返回自己家鄉的途中遭到“鎮國鐵衛”的追殺迫害，不得已成為“鎮國鐵衛”的一員，加入了“客棧”。",
          },
          { jh: "京城", loc: "白虎赌坊", name: "下注血战", name_tw: "下注血戰", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;s", desc: "" },
          { jh: "京城", loc: "青龙赌坊", name: "打手", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;n", desc: "賭坊打手，滿臉橫肉，手持大錘。" },
          {
            jh: "京城",
            loc: "青龙赌坊",
            name: "藏六福",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;n",
            desc: "青龍賭坊的老闆，五十歲上下，腰間繫著一塊絕世玉璧，眼睛裡閃著狡黠的光芒。",
          },
          { jh: "京城", loc: "青龙赌坊", name: "兽雀游戏", name_tw: "獸雀遊戲", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;n", desc: "" },
          {
            jh: "京城",
            loc: "地下格斗场",
            name: "琼芳",
            name_tw: "瓊芳",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;n",
            desc: "她生得明眸皓齒，桃笑李妍，臉頰上帶著兩個深深的酒渦，看來明媚可人，年歲雖小，但已是個十足十的美人胚子。瓊武川的孫女，紫雲軒少閣主，自幼失怙，被瓊國丈當男子養大，倍加寵愛。卻不知為何在這地下格鬥場。",
          },
          {
            jh: "京城",
            loc: "地下格斗场",
            name: "看场打手",
            name_tw: "看場打手",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;n",
            desc: "地下格鬥場的看場打手，面目冷漠。",
          },
          {
            jh: "京城",
            loc: "永安大街",
            name: "杂货贩子",
            name_tw: "雜貨販子",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w",
            desc: "一個賣雜貨的販子，你也許可以看看需要些什麼。",
          },
          { jh: "京城", loc: "永安大街", name: "苦力", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w;w", desc: "進城找活路的苦力，衣著隨便，滿身灰塵。" },
          {
            jh: "京城",
            loc: "京城驿站",
            name: "掌柜",
            name_tw: "掌櫃",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w;w;s",
            desc: "驛站的大掌櫃，眼神深邃。",
          },
          {
            jh: "京城",
            loc: "永安大街",
            name: "醉汉",
            name_tw: "醉漢",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w;w;w",
            desc: "賭坊裡出來的醉漢，嘴裡嘟嘟囔囔些什麼，也許是一些賭坊的秘密。",
          },
          {
            jh: "京城",
            loc: "永安大街",
            name: "游客",
            name_tw: "遊客",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w;w;w;w",
            desc: "來京城遊玩的外地人，對大城市的繁華目不暇接，滿眼都是驚喜的神色。",
          },
          {
            jh: "京城",
            loc: "广和楼",
            name: "顾倩兮",
            name_tw: "顧倩兮",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;w;w;w;w;w;w;n",
            desc: "出生揚州，其父乃景泰朝兵部尚書顧嗣源，未婚夫是景泰朝狀元盧雲，後因為盧雲掉入水瀑音訊全無，一邊撫養盧雲留下的小嬰兒楊神秀，一邊為父親被正統皇帝下獄的事而四處奔波，後因其父在獄中自殺，為繼承父親的志向開辦書林齋，批判朝政，與正統皇帝針鋒相對。後嫁給佛國的創始人楊肅觀。正統十年，再遇盧雲。是典型的學識淵博，見識不凡的奇女子，當之無愧的揚州第一美女。",
          },
          {
            jh: "京城",
            loc: "永定大街",
            name: "武将",
            name_tw: "武將",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;s",
            desc: "京城武將，虎背熊腰，膽大心細。",
          },
          { jh: "京城", loc: "永定大街", name: "捕快", way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;s", desc: "京城的捕快，自是與外地的不同。" },
          {
            jh: "京城",
            loc: "入城大道",
            name: "饥民",
            name_tw: "饑民",
            way: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;s;s;s",
            desc: "天下災荒四起，流民失所，飢腸轆轆，只能上京城來乞食。",
          },
          { jh: "京城", loc: "德胜门", name: "城门官兵", name_tw: "城門官兵", way: "rank go 194;s;se;se;se;e;n;n;ne;e", desc: "鎮守京城的官兵，銀盔銀甲，威風凜凜。" },
          {
            jh: "京城",
            loc: "安定门",
            name: "城门官兵",
            name_tw: "城門官兵",
            way: "rank go 194;s;se;se;se;e;n;n;ne;e;e;e",
            desc: "鎮守京城的官兵，銀盔銀甲，威風凜凜。",
          },
          {
            jh: "京城",
            loc: "玄武门",
            name: "城门官兵",
            name_tw: "城門官兵",
            way: "rank go 194;s;se;se;se;e;n;n;ne;e;e;e;s;s;s",
            desc: "鎮守京城的官兵，銀盔銀甲，威風凜凜。",
          },
          {
            jh: "京城",
            loc: "东直门",
            name: "城门官兵",
            name_tw: "城門官兵",
            way: "rank go 194;s;se;se;se;e;n;n;ne;e;e;e;e;e;e;se;s;s",
            desc: "鎮守京城的官兵，銀盔銀甲，威風凜凜。",
          },
          { jh: "京城", loc: "通天塔", name: "通天塔", way: "rank go 194;s;se;se;se;e;n;n;ne;e;e;e;e;e;e;se;s;s;e;e;e;s;s", desc: "" },
          { jh: "越王劍宮", loc: "欧余山路", name: "樵夫", way: "jh 50", desc: "一個砍柴為生的樵夫。" },
          { jh: "越王劍宮", loc: "欧余山路", name: "毒蛇", way: "jh 50;ne", desc: "一條外表看起來十分花哨的蛇，毒性巨強。" },
          { jh: "越王劍宮", loc: "欧余山路", name: "欧余刀客", name_tw: "歐餘刀客", way: "jh 50;ne;ne", desc: "歐餘山中隱藏的刀客，武功深不可測。" },
          { jh: "越王劍宮", loc: "欧余山路", name: "山狼", way: "jh 50;ne;ne;n;n", desc: "歐餘山中的霸主，山狼，比一般的野狼大一倍有餘。" },
          { jh: "越王劍宮", loc: "欧余山路", name: "山狼王", way: "jh 50;ne;ne;n;n", desc: "歐餘山中的霸主，山狼，比一般的野狼大一倍有餘。" },
          {
            jh: "越王劍宮",
            loc: "欧余山路",
            name: "西施",
            way: "jh 50;ne;ne;n;n",
            desc: "施夷光，天下第一美女，世人稱為西施，尊稱其“西子“。越國苧蘿村浣紗女。她天生麗質、秀媚出眾。",
          },
          { jh: "越王劍宮", loc: "欧余山路", name: "范蠡", way: "jh 50;ne;ne;n;n;n;ne", desc: "越國當朝大夫，越王倚重的重臣。" },
          { jh: "越王劍宮", loc: "欧余山路", name: "欧余刀客", name_tw: "歐餘刀客", way: "jh 50;ne;ne;n;n;n;ne", desc: "歐餘山中隱藏的刀客，武功深不可測。" },
          {
            jh: "越王劍宮",
            loc: "欧余山路",
            name: "吴国暗探",
            name_tw: "吳國暗探",
            way: "jh 50;ne;ne;n;n;n;ne",
            desc: "來自吳國的暗探，隱藏在山中，負責刺探劍宮內的消息。",
          },
          { jh: "越王劍宮", loc: "欧余山路", name: "老奶奶", way: "jh 50;ne;ne;n;n;n;ne;ne;ne", desc: "一個拄著柺杖的老奶奶，似是在等著孫女回家。" },
          { jh: "越王劍宮", loc: "竹林", name: "青竹巨蟒", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;n", desc: "青竹林中的巨型蟒蛇，通體翠綠，隱藏在竹林中，等待獵物自投羅網。" },
          {
            jh: "越王劍宮",
            loc: "竹林",
            name: "青竹巨蟒",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n",
            desc: "青竹林中的巨型蟒蛇，通體翠綠，隱藏在竹林中，等待獵物自投羅網。",
          },
          { jh: "越王劍宮", loc: "竹林", name: "猎人", name_tw: "獵人", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n", desc: "山中的獵戶，正在尋覓今天的收穫。" },
          {
            jh: "越王劍宮",
            loc: "竹林",
            name: "白猿",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;n;n;n",
            desc: "一頭巨大的白猿，若是見生人來了，一聲長嘯，躍上樹梢，接連幾個縱躍，已竄出數十丈外，但聽得嘯聲淒厲，漸漸遠去，山谷間猿嘯回聲，良久不絕。",
          },
          {
            jh: "越王劍宮",
            loc: "欧余山路",
            name: "白猿",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se",
            desc: "一頭巨大的白猿，若是見生人來了，一聲長嘯，躍上樹梢，接連幾個縱躍，已竄出數十丈外，但聽得嘯聲淒厲，漸漸遠去，山谷間猿嘯回聲，良久不絕。",
          },
          { jh: "越王劍宮", loc: "欧余山路", name: "采药人", name_tw: "採藥人", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se", desc: "一個山中的採藥人，年紀近五十了。" },
          { jh: "越王劍宮", loc: "欧余山路", name: "锦衣剑士", name_tw: "錦衣劍士", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se", desc: "越王劍宮的精英劍士，身佩長劍。" },
          {
            jh: "越王劍宮",
            loc: "欧余山路",
            name: "青衣剑士",
            name_tw: "青衣劍士",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se",
            desc: "來自吳國的精英劍士，極度高傲自負。",
          },
          {
            jh: "越王劍宮",
            loc: "欧余山路",
            name: "青竹巨蟒",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s",
            desc: "青竹林中的巨型蟒蛇，通體翠綠，隱藏在竹林中，等待獵物自投羅網。",
          },
          {
            jh: "越王劍宮",
            loc: "欧余山路",
            name: "牧羊少女",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s",
            desc: "這少女一張瓜子臉，睫長眼大，皮膚白晰，容貌甚是秀麗，身材苗條，弱質纖纖，手持一根長竹竿。",
          },
          { jh: "越王劍宮", loc: "欧余山路", name: "山羊", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s", desc: "雪白的羊毛，在少女的馴服下，乖巧在吃草。" },
          {
            jh: "越王劍宮",
            loc: "欧余山路",
            name: "采药少女",
            name_tw: "採藥少女",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s",
            desc: "在山中採藥戶的小女孩，只有十二三歲，卻已能熟練地行走山間，採集藥材。",
          },
          {
            jh: "越王劍宮",
            loc: "欧余山路",
            name: "锦衣剑士",
            name_tw: "錦衣劍士",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s",
            desc: "越王劍宮的精英劍士，身佩長劍。",
          },
          {
            jh: "越王劍宮",
            loc: "欧亭台",
            name: "锦衣剑士",
            name_tw: "錦衣劍士",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;sw;sw;sw",
            desc: "越王劍宮的精英劍士，身佩長劍。",
          },
          {
            jh: "越王劍宮",
            loc: "欧亭台",
            name: "青衣剑士",
            name_tw: "青衣劍士",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;sw;sw;sw",
            desc: "來自吳國的精英劍士，極度高傲自負。",
          },
          {
            jh: "越王劍宮",
            loc: "欧亭台",
            name: "风胡子",
            name_tw: "風胡子",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;sw;sw;sw",
            desc: "楚國鑄劍師，身著玄色短衫，歐冶子的二位弟子之一。",
          },
          {
            jh: "越王劍宮",
            loc: "欧亭台",
            name: "采药少女",
            name_tw: "採藥少女",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;sw;sw;sw",
            desc: "在山中採藥戶的小女孩，只有十二三歲，卻已能熟練地行走山間，採集藥材。",
          },
          {
            jh: "越王劍宮",
            loc: "大夫第",
            name: "山狼",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e",
            desc: "歐餘山中的霸主，山狼，比一般的野狼大一倍有餘",
          },
          {
            jh: "越王劍宮",
            loc: "大夫第",
            name: "锦衣剑士",
            name_tw: "錦衣劍士",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e",
            desc: "越王劍宮的精英劍士，身佩長劍。",
          },
          { jh: "越王劍宮", loc: "大夫第", name: "范蠡", way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e", desc: "越國當朝大夫，越王倚重的重臣。" },
          {
            jh: "越王劍宮",
            loc: "大夫第",
            name: "青衣剑士",
            name_tw: "青衣劍士",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e",
            desc: "來自吳國的精英劍士，極度高傲自負。",
          },
          {
            jh: "越王劍宮",
            loc: "大夫第",
            name: "风胡子",
            name_tw: "風胡子",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e",
            desc: "楚國鑄劍師，身著玄色短衫，歐冶子的二位弟子之一。",
          },
          {
            jh: "越王劍宮",
            loc: "大夫第",
            name: "西施",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;e",
            desc: "施夷光，天下第一美女，世人稱為西施，尊稱其“西子“。越國苧蘿村浣紗女。她天生麗質、秀媚出眾。",
          },
          {
            jh: "越王劍宮",
            loc: "剑宫大门",
            name: "锦衣剑士",
            name_tw: "錦衣劍士",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n",
            desc: "越王劍宮的精英劍士，身佩長劍。",
          },
          {
            jh: "越王劍宮",
            loc: "论剑石台",
            name: "青衣剑士",
            name_tw: "青衣劍士",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n",
            desc: "來自吳國的精英劍士，極度高傲自負。",
          },
          {
            jh: "越王劍宮",
            loc: "论剑石台",
            name: "青衣剑士-御",
            name_tw: "青衣劍士-御",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n",
            desc: "來自吳國的精英劍士，極度高傲自負。",
          },
          {
            jh: "越王劍宮",
            loc: "论剑石台",
            name: "青衣剑士-极",
            name_tw: "青衣劍士-極",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n",
            desc: "來自吳國的精英劍士，極度高傲自負。",
          },
          {
            jh: "越王劍宮",
            loc: "藏虚殿",
            name: "越王",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;n",
            desc: "越王身披錦袍，形貌拙異，頭頸甚長，嘴尖如鳥，對你微微一笑，你卻覺得毛骨悚然。",
          },
          {
            jh: "越王劍宮",
            loc: "藏虚殿",
            name: "金衣剑士",
            name_tw: "金衣劍士",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;n",
            desc: "越國最頂尖的劍士，身著金衣，手持長劍。",
          },
          {
            jh: "越王劍宮",
            loc: "藏虚殿",
            name: "文种",
            name_tw: "文種",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;n",
            desc: "春秋末期著名的謀略家。越王勾踐的謀臣，和范蠡一起為勾踐最終打敗吳王夫差立下赫赫功勞。",
          },
          {
            jh: "越王劍宮",
            loc: "铸剑台",
            name: "铸剑师",
            name_tw: "鑄劍師",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;n;n",
            desc: "一個風程僕僕的俠客。",
          },
          {
            jh: "越王劍宮",
            loc: "铸剑台",
            name: "薛烛",
            name_tw: "薛燭",
            way: "jh 50;ne;ne;n;n;n;ne;ne;ne;se;se;se;s;s;s;s;se;se;e;n;n;n;n;n;n;n;n;n;n;n",
            desc: "二十多歲的年輕人，是歐冶子的二位親傳弟子之一。",
          },
          { jh: "江陵", loc: "长平街", name: "茶叶贩子", name_tw: "茶葉販子", way: "jh 51", desc: "來自外地的茶葉販子，來此收購也販賣茶葉。" },
          { jh: "江陵", loc: "长平街", name: "书生", name_tw: "書生", way: "jh 51;n", desc: "一個年紀輕輕的讀書人，拿著書本，搖頭晃腦。" },
          { jh: "江陵", loc: "长平街", name: "乞丐", way: "jh 51;n;n", desc: "一個衣衫襤褸的乞丐，口中嘟囔著一些模糊的語句。" },
          { jh: "江陵", loc: "江陵米店", name: "米三江", way: "jh 51;n;n;w", desc: "一個青衣小帽的中年商人，是米店的大掌櫃。" },
          { jh: "江陵", loc: "江陵米店", name: "米店伙计", name_tw: "米店夥計", way: "jh 51;n;n;w", desc: "米店的小夥計，正忙的不可開交。" },
          { jh: "江陵", loc: "江陵米店", name: "妇人", name_tw: "婦人", way: "jh 51;n;n;w", desc: "前來買米的婦人，手裡拿著米袋。" },
          {
            jh: "江陵",
            loc: "小倩花店",
            name: "花小倩",
            way: "jh 51;n;n;e",
            desc: "一個二十出頭，笑容動人的少女，有人說她是城中最美麗的少女，每天都會收到不少求愛的信箋呢。",
          },
          { jh: "江陵", loc: "长平街", name: "巡城府兵", way: "jh 51;n;n;n;n", desc: "江陵總兵府的巡城士兵，手持長矛，腰別鋼刀。" },
          { jh: "江陵", loc: "长平街", name: "巡城参将", name_tw: "巡城參將", way: "jh 51;n;n;n;n", desc: "江陵巡城參將，身材高大，腳步沉穩。" },
          {
            jh: "江陵",
            loc: "飞鸿客栈",
            name: "客栈小二",
            name_tw: "客棧小二",
            way: "jh 51;n;n;n;n;w",
            desc: "手拿酒壺菜碟，腳步如飛，忙得不亦樂乎，抬頭看你一眼，飛快地給你指了個座位。",
          },
          { jh: "江陵", loc: "飞鸿客栈", name: "酒保", way: "jh 51;n;n;n;n;w;w", desc: "客棧的小酒保，年紀大約十來歲而已。" },
          { jh: "江陵", loc: "飞鸿客栈", name: "江小酒", way: "jh 51;n;n;n;n;w;w;n", desc: "客棧老闆的女兒，一笑起來臉上就有兩個酒窩。" },
          { jh: "江陵", loc: "后庭", name: "江老板", name_tw: "江老闆", way: "jh 51;n;n;n;n;w;w;n;n", desc: "客棧的老闆，身材不高，卻自有一番氣度。" },
          { jh: "江陵", loc: "落日街", name: "苦力", way: "jh 51;n;n;n;n;e", desc: "一個衣衫襤褸的苦力，正在街角坐著等活兒上門。" },
          { jh: "江陵", loc: "落日街", name: "驿使", name_tw: "驛使", way: "jh 51;n;n;n;n;e;e;e", desc: "一個遠方驛站來的信使，看起來頗為悠閒，應是沒有公務在身。" },
          { jh: "江陵", loc: "落日街", name: "江陵府卫", name_tw: "江陵府衛", way: "jh 51;n;n;n;n;e;e;e;e", desc: "江陵總兵府的衛士，身披軟甲，腰胯長刀。" },
          { jh: "江陵", loc: "江陵府", name: "参将", name_tw: "參將", way: "jh 51;n;n;n;n;e;e;e;e;s", desc: "江陵總兵府的參將，都是蕭勁手下最得力的干將。" },
          { jh: "江陵", loc: "江陵府", name: "萧劲", name_tw: "蕭勁", way: "jh 51;n;n;n;n;e;e;e;e;s", desc: "江陵府總兵，統管兩湖地界，手握數萬大軍。" },
          { jh: "江陵", loc: "演兵场", name: "江陵府兵", way: "jh 51;n;n;n;n;e;e;e;e;s;s", desc: "江陵府統御下的士兵，一舉一動都有幹練之風，看起來頗為訓練得法。" },
          {
            jh: "江陵",
            loc: "霹雳门",
            name: "雷动山",
            name_tw: "雷動山",
            way: "jh 51;n;n;n;n;n;n;w",
            desc: "霹靂門兩湖分舵的舵主，太陽穴高高鼓起，顯然是有極深厚的內功。",
          },
          {
            jh: "江陵",
            loc: "药材店",
            name: "水掌柜",
            name_tw: "水掌櫃",
            way: "jh 51;n;n;n;n;n;n;n;nw;n",
            desc: "江陵府遠近幾百裡最出名的神醫，對藥材和醫理的理解出神入化。",
          },
          { jh: "江陵", loc: "药材店", name: "王铁柱", name_tw: "王鐵柱", way: "jh 51;n;n;n;n;n;n;n;nw;n", desc: "一個前來求藥的莊稼漢，看起來頗為著急。" },
          { jh: "江陵", loc: "北小街", name: "趟子手", way: "jh 51;n;n;n;n;e;e;e;e;n;n", desc: "鏢局的趟子手，是鏢局最低級的打手。" },
          {
            jh: "江陵",
            loc: "江陵镖局",
            name: "萧长河",
            name_tw: "蕭長河",
            way: "jh 51;n;n;n;n;e;e;e;e;n;n;w",
            desc: "江陵鏢局總鏢頭，一身長衫，手握一對鋼珠，頗有威不可犯之風。",
          },
          { jh: "江陵", loc: "江陵镖局", name: "分身", way: "jh 51;n;n;n;n;e;e;e;e;n;n;w", desc: "蕭長河的分身。" },
          {
            jh: "江陵",
            loc: "马厩",
            name: "周长老",
            name_tw: "週長老",
            way: "jh 51;n;n;n;n;e;e;e;e;n;n;w;w",
            desc: "蕭長河相交三十多年的生死之交，也是鏢局日常事務最主要的負責人。",
          },
          { jh: "江陵", loc: "马厩", name: "脱不花马", name_tw: "脫不花馬", way: "jh 51;n;n;n;n;e;e;e;e;n;n;w;w", desc: "大月氏遠道而來的最好的寶馬，可日行八百。" },
          { jh: "江陵", loc: "马厩", name: "分身", way: "jh 51;n;n;n;n;e;e;e;e;n;n;w;w", desc: "週長老的分身。" },
          {
            jh: "江陵",
            loc: "小鱼小食",
            name: "渔老",
            name_tw: "漁老",
            way: "jh 51;n;n;n;n;e;e;e;e;n;n;e",
            desc: "念過半百的老人，精神很好，手中拿著一張漁網在仔細修復。",
          },
          {
            jh: "江陵",
            loc: "小鱼小食",
            name: "余小鱼",
            name_tw: "餘小魚",
            way: "jh 51;n;n;n;n;e;e;e;e;n;n;e",
            desc: "豆蔻年華的小女孩，長得頗為清秀，正在熟練的整理著小食店，一副有條不紊成竹在胸的樣子。",
          },
          { jh: "江陵", loc: "北门", name: "城门守卫", name_tw: "城門守衛", way: "jh 51;n;n;n;n;e;e;e;e;n;n;n;n", desc: "江陵城的守衛士兵，鐵劍鐵甲。" },
          { jh: "江陵", loc: "江边路", name: "截道恶匪", name_tw: "截道惡匪", way: "jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n", desc: "截道的惡匪，正惡狠狠地看著你。" },
          { jh: "江陵", loc: "码头", name: "漕帮好手", name_tw: "漕幫好手", way: "jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n", desc: "漕幫的好手，個個都是浪裡白條。" },
          { jh: "江陵", loc: "江陵水道", name: "扬子鳄", name_tw: "揚子鱷", way: "jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n;e;e", desc: "兇狠的鱷魚，正不懷好意地盯著你。" },
          {
            jh: "江陵",
            loc: "水道暗洞",
            name: "金冠巨蟒",
            way: "jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n;e;e;e;e;e;se;event_1_1065178",
            desc: "一條通體火紅的巨蟒，頭部有金色花紋。",
          },
          { jh: "江陵", loc: "葬剑谷", name: "亡魂分身", way: "jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n;e;e;e;e;e;se;event_1_1065178;se;se", desc: "一個風程僕僕的俠客。" },
          {
            jh: "江陵",
            loc: "葬剑谷",
            name: "剑之亡魂",
            name_tw: "劍之亡魂",
            way: "jh 51;n;n;n;n;e;e;e;e;n;n;n;n;nw;n;n;n;e;e;e;e;e;se;event_1_1065178;se;se",
            desc: "一柄無主之劍。",
          },
          { jh: "江陵", loc: "落日街", name: "醉汉", name_tw: "醉漢", way: "jh 51;n;n;n;n;e;e;e;e;e;e", desc: "一個醉醺醺的男人，嘴裡不知道嘟囔著什麼。" },
          { jh: "江陵", loc: "南小街", name: "黑衣人", way: "jh 51;n;n;n;n;e;e;e;e;e;e;s", desc: "一個鬼鬼祟祟的黑衣人，腰間似乎藏著兵器。" },
          { jh: "江陵", loc: "南门", name: "城门守卫", name_tw: "城門守衛", way: "jh 51;n;n;n;n;e;e;e;e;e;e;s;s;s", desc: "江陵城的守衛士兵，鐵劍鐵甲。" },
          {
            jh: "江陵",
            loc: "城外泥路",
            name: "癞蛤蟆",
            name_tw: "癩蛤蟆",
            way: "jh 51;n;n;n;n;e;e;e;e;e;e;s;s;s;se;se",
            desc: "趴在城外泥路兩旁的沼澤地，正呱呱呱地叫著，真讓人心煩。",
          },
          {
            jh: "江陵",
            loc: "无双窑",
            name: "霍无双",
            name_tw: "霍無雙",
            way: "jh 51;n;n;n;n;e;e;e;e;e;e;s;s;s;se;se;e;e;e",
            desc: "兩湖最好的手藝人，從他手裡出品的瓷器，白若瑞雪，清透如浮雲。",
          },
          { jh: "江陵", loc: "落日街", name: "金莲", name_tw: "金蓮", way: "jh 51;n;n;n;n;e;e;e;e;e;e;e;e", desc: "玉泉酒坊老闆的相好，眉目流媚，身姿誘人。" },
          { jh: "江陵", loc: "深巷", name: "邋遢男子", way: "jh 51;n;n;n;n;e;e;e;e;e;e;e;e;se", desc: "一個醉醺醺的邋遢男子，正在對牆小便，你只想趕緊捂著鼻子走開。" },
          {
            jh: "江陵",
            loc: "玉泉酒坊",
            name: "酒坊伙计",
            name_tw: "酒坊夥計",
            way: "jh 51;n;n;n;n;e;e;e;e;e;e;e;e;se;e;e",
            desc: "酒坊的小夥計，忙得不可開交，瘦骨嶙峋。",
          },
          {
            jh: "江陵",
            loc: "玉泉酒坊",
            name: "九叔",
            way: "jh 51;n;n;n;n;e;e;e;e;e;e;e;e;se;e;e",
            desc: "酒坊現在的老闆，身上一派珠光寶氣，卻有人說他是盜了哥哥的產業。",
          },
          { jh: "天龍寺", loc: "苍山山脚", name: "小女童", way: "jh 52", desc: "一個金釵之年的小女孩。" },
          { jh: "天龍寺", loc: "苍山山脚", name: "小男童", way: "jh 52", desc: "一個垂髻之年的小男孩。" },
          { jh: "天龍寺", loc: "苍山山路", name: "羚牛", way: "jh 52;ne;ne;", desc: "蒼山特有，體形粗大，雌雄均具短角，分佈在蒼山麓密林地區。" },
          {
            jh: "天龍寺",
            loc: "苍山山路",
            name: "点苍派弟子",
            name_tw: "點蒼派弟子",
            way: "jh 52;ne;ne;n;",
            desc: "南詔「七大門派」之一，點蒼山明水秀，四季如春，門下弟子們從小拜師，在這環境中生長，大多數都是溫良如玉的君子，對名利都看得很淡。",
          },
          { jh: "天龍寺", loc: "苍山山路", name: "浮尘子", name_tw: "浮塵子", way: "jh 52;ne;ne;n;n;", desc: "點蒼派三大高手之一，仙風道骨。" },
          { jh: "天龍寺", loc: "苍山山路", name: "浮尘子分身", name_tw: "浮塵子分身", way: "jh 52;ne;ne;n;n;", desc: "浮塵子分身，咄咄逼人！" },
          {
            jh: "天龍寺",
            loc: "苍山山路",
            name: "云豹",
            name_tw: "雲豹",
            way: "jh 52;ne;ne;n;n;n;nw;",
            desc: "蒼山雲豹有著粗短而矯健的四肢，幾乎與身體一樣長而且很粗的尾巴。頭部略圓，口鼻突出，爪子非常大。體色金黃色，並覆蓋有大塊的深色雲狀斑紋，因此稱作“雲豹”。",
          },
          { jh: "天龍寺", loc: "苍山山路", name: "雯姑", way: "jh 52;ne;ne;n;n;n;nw;nw;", desc: "容貌國色天香，即使是嬌豔的花朵見了也要自愧不如。" },
          {
            jh: "天龍寺",
            loc: "苍山山路",
            name: "霞郎",
            way: "jh 52;ne;ne;n;n;n;nw;nw;",
            desc: "忠實善良，吃苦耐勞，心靈手巧，而且他的歌喉也美妙無比，歌聲像百靈一樣的婉轉，像夜鶯一般的悠揚。每當他唱起歌來的時候，山上的百鳥都會安靜下來，默默地傾聽他那美妙動人的歌聲。",
          },
          { jh: "天龍寺", loc: "苍山山路", name: "游客", name_tw: "遊客", way: "jh 52;ne;ne;n;n;n;nw;nw;n;n;", desc: "外地來蒼山的遊客，一副陶醉於美景之態。" },
          {
            jh: "天龍寺",
            loc: "苍山山路",
            name: "南诏公主",
            name_tw: "南詔公主",
            way: "jh 52;ne;ne;n;n;n;ne;ne;",
            desc: "她是身世撲搠的鄭氏南詔公主，從小就被送去水靈山險的苗疆由苗人撫養;她極擅苗人盅毒，並以此為趣。",
          },
          { jh: "天龍寺", loc: "苍山山路", name: "淩霄子", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e", desc: "點蒼劍派三大高手之一，揹負古劍，手持拂塵。" },
          { jh: "天龍寺", loc: "苍山山路", name: "淩霄子分身", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e", desc: "一個風程僕僕的俠客。" },
          {
            jh: "天龍寺",
            loc: "苍山山路",
            name: "点苍派弟子",
            name_tw: "點蒼派弟子",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;",
            desc: "南詔「七大門派」之一，點蒼山明水秀，四季如春，門下弟子們從小拜師，在這環境中生長，大多數都是溫良如玉的君子，對名利都看得很淡。",
          },
          {
            jh: "天龍寺",
            loc: "青石长阶",
            name: "枯叶蝶",
            name_tw: "枯葉蝶",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;",
            desc: "當它闔起兩張翅膀的時候，像生長在樹枝上的一張乾枯了的樹葉。誰也不注意它，誰也不會瞧它一眼。",
          },
          {
            jh: "天龍寺",
            loc: "青石长阶",
            name: "双尾褐凤蝶",
            name_tw: "雙尾褐鳳蝶",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;w",
            desc: "前翅黑色有光澤，有淡黃色細橫帶自前緣直達中脈，後翅狹長黑色，外緣呈扇形。",
          },
          {
            jh: "天龍寺",
            loc: "青石长阶",
            name: "金斑啄凤蝶",
            name_tw: "金斑啄鳳蝶",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;w;nw;nw;n;",
            desc: "南疆八大名貴蝴蝶之首，大理當地人稱之為“夢幻蝴蝶”",
          },
          {
            jh: "天龍寺",
            loc: "青石长阶",
            name: "不孤子",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;w;nw;nw;n;n;",
            desc: "一個年近五旬的劍客，身世極為神秘，內力修為看起來極為深厚。",
          },
          { jh: "天龍寺", loc: "青石长阶", name: "不孤子分身", way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;w;nw;nw;n;n;", desc: "哪怕是分身也爆發出強勁的內功氣場。" },
          {
            jh: "天龍寺",
            loc: "青石长阶",
            name: "玫瑰眼蝶",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;",
            desc: "全翅透明，薄若蟬翼，後翅膀為分散的玫瑰色，眼斑瞳仁上會反光。",
          },
          {
            jh: "天龍寺",
            loc: "牟尼楼",
            name: "打坐老僧",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;event_1_15863945;",
            desc: "一個打坐的老僧人，雙目緊閉，長眉下垂。",
          },
          {
            jh: "天龍寺",
            loc: "青石长阶",
            name: "谢逸紫",
            name_tw: "謝逸紫",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;n;n;",
            desc: "蒼山七劍之一，是雲南最出眾的女劍客，相貌出眾，身姿動人。",
          },
          {
            jh: "天龍寺",
            loc: "崇圣阁",
            name: "龙纹寺僧",
            name_tw: "龍紋寺僧",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;n;n;n;",
            desc: "天龍寺的老寺僧，前臂有飛龍紋身，地位較一般寺僧更高。",
          },
          {
            jh: "天龍寺",
            loc: "崇圣阁",
            name: "天龙方丈",
            name_tw: "天龍方丈",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;n;n;n;n;n;n;n;n;",
            desc: "天龍寺的方丈主持，白發白眉，面目慈祥。",
          },
          {
            jh: "天龍寺",
            loc: "险恶山路",
            name: "白开心",
            name_tw: "白開心",
            way: "rank go 237;nw;n;n;n;n;n;n;nw;nw;n",
            desc: "十大惡人之一，一個喜歡搗蛋的聰明人。",
          },
          {
            jh: "天龍寺",
            loc: "险恶山路",
            name: "剧毒蟒蛇",
            name_tw: "劇毒蟒蛇",
            way: "rank go 237;nw;n;n;n;n;n;n;nw",
            desc: "惡人谷內的劇毒蟒蛇，見人就會攻擊。",
          },
          {
            jh: "天龍寺",
            loc: "村口",
            name: "屠娇娇",
            name_tw: "屠嬌嬌",
            way: "rank go 237;nw;n;n;n;n;n;n",
            desc: "十大惡人之一，易容之術天下無雙。她的武功並不能算高超，但卻是十大惡人中最為智慧的，她是所有計劃的策動者，可說是算無遺策。",
          },
          {
            jh: "天龍寺",
            loc: "村口",
            name: "李大嘴",
            way: "rank go 237;nw;n;n;n;n;n;n",
            desc: "十大惡人之一，卻是一個不折不扣的好人。",
          },
          {
            jh: "天龍寺",
            loc: "土路",
            name: "铁战",
            name_tw: "鐵戰",
            way: "rank go 237;nw;n;n;n;n",
            desc: "十大惡人之一，對武學的癡迷到了忘我的境界，而且所研究的武功都讓人大跌眼鏡。",
          },
          {
            jh: "天龍寺",
            loc: "猛兽屋",
            name: "杜杀",
            name_tw: "杜殺",
            way: "rank go 237;nw;n;n;n;n;w",
            desc: "大惡人之一，面白如雪，身材清瘦。性格說一不二，冷酷勝雪。武功位列十大惡人之首，由於殘忍嗜殺，江湖送名曰——「血手」。",
          },
          {
            jh: "天龍寺",
            loc: "大槐树",
            name: "轩辕三光",
            name_tw: "軒轅三光",
            way: "rank go 237;nw;n;n;e",
            desc: "只要有好玩的事情，老賭鬼就會出現。",
          },
          {
            jh: "天龍寺",
            loc: "大槐树",
            name: "哈哈儿",
            name_tw: "哈哈兒",
            way: "rank go 237;nw;n;n;e",
            desc: "最可怕的不是明眼的惡人，而是明裡笑臉相迎暗地裡磨刀霍霍的笑面虎。十大惡人之一的「笑裡藏刀小彌陀」。",
          },
          {
            jh: "天龍寺",
            loc: "土路",
            name: "恶虎",
            name_tw: "惡虎",
            way: "rank go 237;nw;n",
            desc: "惡人谷內的兇獸，赤額金睛。",
          },
          {
            jh: "天龍寺",
            loc: "南山小院",
            name: "萧咪咪",
            name_tw: "蕭咪咪",
            way: "rank go 237;nw;n;w",
            desc: "十大惡人之一，美豔無雙，和他在一起的男人都不會有好下場。",
          },
          {
            jh: "天龍寺",
            loc: "土路",
            name: "欧阳丁",
            name_tw: "歐陽丁",
            way: "rank go 237;nw",
            desc: "十大惡人中唯一的兩兄弟，擁有著富可敵國的家財卻喜歡偷偷摸摸。",
          },
          {
            jh: "天龍寺",
            loc: "土路",
            name: "欧阳当",
            name_tw: "歐陽當",
            way: "rank go 237;nw",
            desc: "十大惡人中唯一的兩兄弟，擁有著富可敵國的家財卻喜歡偷偷摸摸。",
          },
          {
            jh: "天龍寺",
            loc: "大鹳淜洲",
            name: "柴绍",
            name_tw: "柴紹",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;",
            desc: "出身於將門，自幼便矯捷有勇力，抑強扶弱，聞名天下。",
          },
          {
            jh: "天龍寺",
            loc: "大鹳淜洲",
            name: "李秀宁",
            name_tw: "李秀寧",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;",
            desc: "高祖李淵之女，太宗之妹，自幼習武，且精通琴棋書畫，有著舉世無雙的外交才能。",
          },
          {
            jh: "天龍寺",
            loc: "天龙塔林",
            name: "小沙弥",
            name_tw: "小沙彌",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;w;sw;s;s",
            desc: "打掃塔林的小沙彌，身著灰色僧衣。",
          },
          {
            jh: "天龍寺",
            loc: "天龙塔林",
            name: "护塔僧兵",
            name_tw: "護塔僧兵",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;w;sw;s;s;sw;sw;",
            desc: "塔林的護衛僧兵，手持戒棍，一絲不苟。",
          },
          {
            jh: "天龍寺",
            loc: "天龙塔林",
            name: "护塔僧兵",
            name_tw: "護塔僧兵",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;w;sw;s;s;sw;sw;sw;se;",
            desc: "塔林的護衛僧兵，手持戒棍，一絲不苟。",
          },
          {
            jh: "天龍寺",
            loc: "天龙塔林",
            name: "小沙弥",
            name_tw: "小沙彌",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;w;sw;s;s;sw;sw;sw;se;se;se;",
            desc: "打掃塔林的小沙彌，身著灰色僧衣。",
          },
          {
            jh: "天龍寺",
            loc: "桃溪",
            name: "婠婠",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;",
            desc: "魔門邪派陰癸派的繼承人，為武功超強的蓋代魔女，雖年紀輕輕，有著美麗的容顏，卻是陰癸派有史以來最強傳人。",
          },
          {
            jh: "天龍寺",
            loc: "慈航静斋",
            name: "周老叹",
            name_tw: "週老嘆",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;",
            desc: "前任魔門第一高手，邪帝向雨田的四大弟子之一。",
          },
          {
            jh: "天龍寺",
            loc: "慈航静斋",
            name: "尤鸟倦",
            name_tw: "尤鳥倦",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;",
            desc: "前任魔門第一高手，邪帝向雨田的四大弟子之一。",
          },
          {
            jh: "天龍寺",
            loc: "慈航静斋",
            name: "丁九重",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;",
            desc: "前任魔門第一高手，邪帝向雨田的四大弟子之一。",
          },
          {
            jh: "天龍寺",
            loc: "慈航静斋",
            name: "金环真",
            name_tw: "金環真",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;",
            desc: "前任魔門第一高手，邪帝向雨田的四大弟子之一。",
          },
          {
            jh: "天龍寺",
            loc: "静云小径",
            name: "符瑶红",
            name_tw: "符瑤紅",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;n;n;e;ne;",
            desc: "陰癸派第一高手「血手」厲工的師妹，擅長男女歡合之術。",
          },
          {
            jh: "天龍寺",
            loc: "藏典塔",
            name: "杨虚彦",
            name_tw: "楊虛彥",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;n;n;n;n;n;",
            desc: "隋文帝楊堅之孫，太子楊勇之子，隋煬帝楊廣即位之後被「邪王」所救，由於資質好被其收為徒，並答應為其報仇復國。他不過是石之軒陰暗面的投影，石之軒對他的重用象徵他邪惡的一面佔上風，對侯希白的疼愛象徵善良面的迴歸。",
          },
          {
            jh: "天龍寺",
            loc: "赏雨亭",
            name: "侯希白",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;n;n;n;n;n;",
            desc: "侯希白琴棋書畫、文韜武略樣樣精通，愛流連青樓，自詡為護花使者，綽號乃「多情公子」。傾慕慈航靜齋傳人師妃暄，兩人曾共遊三峽。雖然週旋於眾美之間，卻絕非好色風流之徒。",
          },
          {
            jh: "天龍寺",
            loc: "桃溪",
            name: "『闲钓』",
            name_tw: "『閒釣』",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;",
            desc: "日常",
          },
          {
            jh: "天龍寺",
            loc: "后山茶园",
            name: "『采茶』",
            name_tw: "『採茶』",
            way: "jh 52;ne;ne;n;n;n;ne;ne;e;e;se;se;s;s;s;event_1_83417762;e;ne;ne;n;n;n;ne;ne;nw;ne;n;n;n;e;ne;e;ne;ne;",
            desc: "日常",
          },
        ],
        Npc_New: [
          { jh: "雪亭鎮", loc: "飲風客棧", id: "snow_wuyidashi", way: "jh 1" },
          { jh: "雪亭鎮", loc: "飲風客棧", id: "snow_xiaotangren", way: "jh 1" },
          { jh: "雪亭鎮", loc: "飲風客棧", id: "snow_guanggun", way: "jh 1" },
          { jh: "雪亭鎮", loc: "飲風客棧", id: "snow_mercenary", way: "jh 1" },
          { jh: "雪亭鎮", loc: "飲風客棧", id: "snow_chentang", way: "jh 1" },
          { jh: "雪亭鎮", loc: "飲風客棧", id: "snow_shuangdanshizhe", way: "jh 1" },
          { jh: "雪亭鎮", loc: "飲風客棧", id: "snow_zhounianxiaoer", way: "jh 1" },
          { jh: "雪亭鎮", loc: "飲風客棧", id: "snow_waiter", way: "jh 1" },
          { jh: "雪亭鎮", loc: "飲風客棧", id: "snow_jiandashi", way: "jh 1" },
          { jh: "雪亭鎮", loc: "廣場", id: "snow_worker", way: "jh 1;e" },
          { jh: "雪亭鎮", loc: "城隍廟", id: "snow_keeper", way: "jh 1;e;e" },
          { jh: "雪亭鎮", loc: "黃土小徑", id: "snow_dog", way: "jh 1;e;e;s;ne" },
          { jh: "雪亭鎮", loc: "山路", id: "snow_mengmianjianke", way: "jh 1;e;e;s;ne;ne" },
          { jh: "雪亭鎮", loc: "淳風武館大門", id: "snow_guard", way: "jh 1;e;n;e" },
          { jh: "雪亭鎮", loc: "淳風武館教練場", id: "snow_trainee", way: "jh 1;e;n;e;e" },
          { jh: "雪亭鎮", loc: "淳風武館教練場", id: "snow_fist_trainer", way: "jh 1;e;n;e;e" },
          { jh: "雪亭鎮", loc: "淳風武館大廳", id: "swordsman_master", way: "jh 1;e;n;e;e;e" },
          { jh: "雪亭鎮", loc: "書房", id: "snow_girl", way: "jh 1;e;n;e;e;e;e;n" },
          { jh: "雪亭鎮", loc: "雪亭鎮街道", id: "snow_drunk", way: "jh 1;e;n;n" },
          { jh: "雪亭鎮", loc: "雪亭鎮街道", id: "snow_scavenger", way: "jh 1;e;n;n" },
          { jh: "雪亭鎮", loc: "木屋", id: "snow_chefu", way: "jh 1;e;n;n;n;n;e" },
          { jh: "雪亭鎮", loc: "雪亭驛", id: "snow_dukuankuan", way: "jh 1;e;n;n;n;n;w" },
          { jh: "雪亭鎮", loc: "雪亭驛", id: "snow_post_officer", way: "jh 1;e;n;n;n;n;w" },
          { jh: "雪亭鎮", loc: "桑鄰藥鋪", id: "snow_herbalist", way: "jh 1;e;n;n;n;w" },
          { jh: "雪亭鎮", loc: "桑鄰藥鋪", id: "snow_woodcutter", way: "jh 1;e;n;n;n;w" },
          { jh: "雪亭鎮", loc: "打鐵鋪子", id: "snow_smith", way: "jh 1;e;n;n;w" },
          { jh: "雪亭鎮", loc: "安記錢莊", id: "snow_annihir", way: "jh 1;e;n;w" },
          { jh: "雪亭鎮", loc: "雪亭鎮街口", id: "gaibang_li-sh", way: "jh 1;e;s" },
          { jh: "雪亭鎮", loc: "雪亭鎮街道", id: "snow_farmer", way: "jh 1;e;s;w" },
          { jh: "雪亭鎮", loc: "雪亭鎮街道", id: "snow_old_farmer", way: "jh 1;e;s;w" },
          { jh: "雪亭鎮", loc: "書院", id: "snow_teacher", way: "jh 1;e;s;w;s" },
          { jh: "雪亭鎮", loc: "青石官道", id: "snow_crazy_dog", way: "jh 1;e;s;w;w" },
          { jh: "雪亭鎮", loc: "飲風客棧二樓", id: "snow_xinghedashi", way: "jh 1;雪亭鎮:飲風客棧^飲風客棧二樓" },
          { jh: "洛陽", loc: "礦場", id: "luoyang_kuangjian", way: "jh 2;n;n;n;n;n;n;n;n;n;n;w;w" },
          { jh: "洛陽", loc: "冶煉場", id: "luoyang_heshiwo", way: "jh 2;n;n;n;n;n;n;n;n;n;n;w;w;w" },
          { jh: "洛陽", loc: "南郊小路", id: "luoyang_luoyang18", way: "jh 2;n" },
          { jh: "洛陽", loc: "南門", id: "luoyang_luoyang21", way: "jh 2;n;n" },
          { jh: "洛陽", loc: "南市", id: "luoyang_luoyang13", way: "jh 2;n;n;e" },
          { jh: "洛陽", loc: "船塢", id: "luoyang_luoyang17", way: "jh 2;n;n;e;s;洛陽:洛水渡口^船塢" },
          { jh: "洛陽", loc: "南大街", id: "luoyang_yhsz", way: "jh 2;n;n;n" },
          { jh: "洛陽", loc: "南大街", id: "luoyang_luoyang24", way: "jh 2;n;n;n" },
          { jh: "洛陽", loc: "金刀門", id: "luoyang_luoyang27", way: "jh 2;n;n;n;e" },
          { jh: "洛陽", loc: "練武場", id: "luoyang_luoyang27", way: "jh 2;n;n;n;e;s" },
          { jh: "洛陽", loc: "練武場", id: "luoyang_luoyang16", way: "jh 2;n;n;n;e;s" },
          { jh: "洛陽", loc: "洛川街", id: "luoyang_luoyang26", way: "jh 2;n;n;n;n" },
          { jh: "洛陽", loc: "集市", id: "luoyang_luoyang26", way: "jh 2;n;n;n;n;e" },
          { jh: "洛陽", loc: "集市", id: "luoyang_luoyang12", way: "jh 2;n;n;n;n;e" },
          { jh: "洛陽", loc: "豬肉攤", id: "luoyang_luoyang14", way: "jh 2;n;n;n;n;e;s" },
          { jh: "洛陽", loc: "草屋", id: "luoyang_luoyang_fb8", way: "jh 2;n;n;n;n;n;e;e;n;n;e;n" },
          { jh: "洛陽", loc: "林間石階", id: "luoyang_luoyang_fb9", way: "jh 2;n;n;n;n;n;e;e;n;n;n" },
          { jh: "洛陽", loc: "登山小徑", id: "luoyang_luoyang_fb11", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n" },
          { jh: "洛陽", loc: "松風亭", id: "luoyang_luoyang_fb9", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;e" },
          { jh: "洛陽", loc: "松風亭", id: "luoyang_lingyun", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;e" },
          { jh: "洛陽", loc: "松風亭", id: "luoyang_lingzhongtian", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;e" },
          { jh: "洛陽", loc: "白公墓", id: "luoyang_luoyang_fb12", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;n" },
          { jh: "洛陽", loc: "白公墓", id: "luoyang_heiyiwenshi", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;n" },
          { jh: "洛陽", loc: "墓道", id: "luoyang_luoyang_fb12", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;n;get_silver" },
          { jh: "洛陽", loc: "墓道", id: "luoyang_heiyiwenshi", way: "jh 2;n;n;n;n;n;e;e;n;n;n;n;n;get_silver" },
          { jh: "洛陽", loc: "聽伊亭", id: "luoyang_luoyang_fb10", way: "jh 2;n;n;n;n;n;e;e;n;n;n;w" },
          { jh: "洛陽", loc: "觀景台", id: "luoyang_luoyang_fb7", way: "jh 2;n;n;n;n;n;e;e;n;n;w" },
          { jh: "洛陽", loc: "富人莊院", id: "luoyang_luoyang26", way: "jh 2;n;n;n;n;n;e;n" },
          { jh: "洛陽", loc: "富人莊院", id: "luoyang_luoyang10", way: "jh 2;n;n;n;n;n;e;n" },
          { jh: "洛陽", loc: "儲藏室", id: "luoyang_luoyang26", way: "jh 2;n;n;n;n;n;e;n;op1" },
          { jh: "洛陽", loc: "儲藏室", id: "luoyang_luoyang10", way: "jh 2;n;n;n;n;n;e;n;op1" },
          { jh: "洛陽", loc: "青石街", id: "gaibang_lu", way: "jh 2;n;n;n;n;n;n;e" },
          { jh: "洛陽", loc: "北大街", id: "luoyang_luoyang3", way: "jh 2;n;n;n;n;n;n;n" },
          { jh: "洛陽", loc: "北大街", id: "luoyang_luoyang24", way: "jh 2;n;n;n;n;n;n;n" },
          { jh: "洛陽", loc: "錢莊", id: "luoyang_luoyang4", way: "jh 2;n;n;n;n;n;n;n;e" },
          { jh: "洛陽", loc: "北門", id: "luoyang_luoyang21", way: "jh 2;n;n;n;n;n;n;n;n" },
          { jh: "洛陽", loc: "北門", id: "luoyang_luoyang22", way: "jh 2;n;n;n;n;n;n;n;n" },
          { jh: "洛陽", loc: "北郊小路", id: "luoyang_luoyang19", way: "jh 2;n;n;n;n;n;n;n;n;n" },
          { jh: "洛陽", loc: "綠竹林", id: "luoyang_luoyang20", way: "jh 2;n;n;n;n;n;n;n;n;n;e" },
          { jh: "洛陽", loc: "綠竹雅舍", id: "luoyang_luoyang1", way: "jh 2;n;n;n;n;n;n;n;n;n;e;n" },
          { jh: "洛陽", loc: "清響齋", id: "luoyang_luoyang2", way: "jh 2;n;n;n;n;n;n;n;n;n;e;n;n" },
          { jh: "洛陽", loc: "密室", id: "luoyang_canjianloushouling", way: "jh 2;n;n;n;n;n;n;n;n;n;e;n;n;n" },
          { jh: "洛陽", loc: "沙石地", id: "changan_kanmenren", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;nw;w;sw;s" },
          { jh: "洛陽", loc: "石土場", id: "changan_qinguan", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;nw;w;sw;s;s" },
          { jh: "洛陽", loc: "沙石地", id: "changan_kanmenren", way: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;w;w;n;n;n;n;n;n;nw;w;sw;s;s;event_1_54329477;n" },
          { jh: "洛陽", loc: "城樓密室", id: "luoyang_luoyang23", way: "jh 2;n;n;n;n;n;n;n;n;w;洛陽:城樓^城樓密室" },
          { jh: "洛陽", loc: "當鋪", id: "luoyang_luoyang5", way: "jh 2;n;n;n;n;n;n;w" },
          { jh: "洛陽", loc: "馬廄", id: "luoyang_luoyang6", way: "jh 2;n;n;n;n;n;w;n;n;w" },
          { jh: "洛陽", loc: "牡丹園", id: "luoyang_luoyang7", way: "jh 2;n;n;n;n;n;w;s" },
          { jh: "洛陽", loc: "牡丹亭", id: "luoyang_luoyang8", way: "jh 2;n;n;n;n;n;w;s;luoyang111_op1" },
          { jh: "洛陽", loc: "賭坊大門", id: "luoyang_luoyang_fb3", way: "jh 2;n;n;n;n;n;w;w" },
          { jh: "洛陽", loc: "賭坊大廳", id: "luoyang_luoyang_fb4", way: "jh 2;n;n;n;n;n;w;w;n" },
          { jh: "洛陽", loc: "雅舍", id: "luoyang_luoyang_fb5", way: "jh 2;n;n;n;n;n;w;w;n;n;n;e" },
          { jh: "洛陽", loc: "銅駝巷", id: "luoyang_luoyang_fb3", way: "jh 2;n;n;n;n;w" },
          { jh: "洛陽", loc: "石街", id: "luoyang_luoyang_fb1", way: "jh 2;n;n;n;n;w;event_1_98995501;n" },
          { jh: "洛陽", loc: "石街", id: "luoyang_luoyang26", way: "jh 2;n;n;n;n;w;event_1_98995501;n" },
          { jh: "洛陽", loc: "酒肆", id: "luoyang_luoyang_fb2", way: "jh 2;n;n;n;n;w;event_1_98995501;n;n;e" },
          { jh: "洛陽", loc: "桃花別院", id: "luoyang_hongniang", way: "jh 2;n;n;n;n;w;s" },
          { jh: "洛陽", loc: "繡樓", id: "luoyang_luoyang9", way: "jh 2;n;n;n;n;w;s;w" },
          { jh: "洛陽", loc: "洛神廟", id: "luoyang_luoyang15", way: "jh 2;n;n;n;w" },
          { jh: "洛陽", loc: "地道", id: "luoyang_luoyang15", way: "jh 2;n;n;n;w;putuan" },
          { jh: "俠客島", loc: "", id: "luoyang_luoyang15", way: "" },
          { jh: "華山村", loc: "華山村村口", id: "huashancun_huashancun12", way: "jh 3" },
          { jh: "華山村", loc: "華山村村口", id: "taofan157799344", way: "jh 3" },
          { jh: "華山村", loc: "松林小徑", id: "huashancun_huashancun14", way: "jh 3;n" },
          { jh: "華山村", loc: "神女塚", id: "huashancun_huashancun19", way: "jh 3;n;e" },
          { jh: "華山村", loc: "青石街", id: "huashancun_huashancun12", way: "jh 3;s" },
          { jh: "華山村", loc: "青石街", id: "huashancun_popitouzi", way: "jh 3;s" },
          { jh: "華山村", loc: "碎石路", id: "huashancun_huashancun18", way: "jh 3;s;e" },
          { jh: "華山村", loc: "打鐵鋪", id: "taohua_fengmof", way: "jh 3;s;e;n" },
          { jh: "華山村", loc: "銀杏廣場", id: "huashancun_huashancun1", way: "jh 3;s;s" },
          { jh: "華山村", loc: "雜貨鋪", id: "huashancun_huashancun9", way: "jh 3;s;s;e" },
          { jh: "華山村", loc: "後院", id: "huashancun_huashancun17", way: "jh 3;s;s;e;s" },
          { jh: "華山村", loc: "車廂", id: "huashancun_huashancun3", way: "jh 3;s;s;e;s;huashancun24_op2" },
          { jh: "華山村", loc: "石闆橋", id: "huashancun_huashancun2", way: "jh 3;s;s;s" },
          { jh: "華山村", loc: "石闆橋", id: "huashancun_heigou", way: "jh 3;s;s;s" },
          { jh: "華山村", loc: "田間小路", id: "huashancun_huashancun16", way: "jh 3;s;s;s;s" },
          { jh: "華山村", loc: "油菜花地", id: "huashancun_huashancun20", way: "jh 3;s;s;s;s;huashancun15_op1" },
          { jh: "華山村", loc: "油菜花地", id: "huashancun_huashancun20", way: "jh 3;s;s;s;s;huashancun15_op1;event_1_46902878" },
          { jh: "華山村", loc: "蜿蜒山徑", id: "huashancun_huashancun_fb7", way: "jh 3;s;s;s;s;s;nw;n" },
          { jh: "華山村", loc: "清風寨大門", id: "huashancun_huashancun_fb8", way: "jh 3;s;s;s;s;s;nw;n;n" },
          { jh: "華山村", loc: "桃花泉", id: "huashancun_huashancun_fb9", way: "jh 3;s;s;s;s;s;nw;n;n;e" },
          { jh: "華山村", loc: "花房", id: "huashancun_huashancun_fb9", way: "jh 3;s;s;s;s;s;nw;n;n;e;get_silver" },
          { jh: "華山村", loc: "議事廳", id: "huashancun_huashancun_fb10", way: "jh 3;s;s;s;s;s;nw;n;n;n;n" },
          { jh: "華山村", loc: "後院", id: "huashancun_huashancun_fb11", way: "jh 3;s;s;s;s;s;nw;n;n;n;n;n" },
          { jh: "華山村", loc: "臥房", id: "huashancun_huashancun_fb12", way: "jh 3;s;s;s;s;s;nw;n;n;n;n;n;n" },
          { jh: "華山村", loc: "廂房", id: "huashancun_huashancun5", way: "jh 3;s;s;s;s;w;get_silver" },
          { jh: "華山村", loc: "大廳", id: "huashancun_huashancun_fb5", way: "jh 3;w;event_1_59520311;n;n;n;n;n" },
          { jh: "華山村", loc: "囚室", id: "huashancun_huashancun_fb4", way: "jh 3;w;event_1_59520311;n;n;w;get_silver" },
          { jh: "華山村", loc: "茶棚", id: "huashancun_huashancun13", way: "jh 3;w;n" },
          { jh: "華山", loc: "書房", id: "huashan_huashan6", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e;n;n" },
          { jh: "華山", loc: "老君溝", id: "huashan_huashan11", way: "jh 4;n;n;n;n;n;n;e;n" },
          { jh: "華山", loc: "狹長通道", id: "huashan_huashan_fb5", way: "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s" },
          { jh: "華山", loc: "華山山腳", id: "huashan_huashan14", way: "jh 4" },
          { jh: "華山", loc: "莎蘿坪", id: "huashan_huashan1", way: "jh 4;n" },
          { jh: "華山", loc: "雲門", id: "huashan_huashan2", way: "jh 4;n;n" },
          { jh: "華山", loc: "青柯坪", id: "huashan_huashan9", way: "jh 4;n;n;n" },
          { jh: "華山", loc: "回心石", id: "huashan_huashan4", way: "jh 4;n;n;n;e" },
          { jh: "華山", loc: "蜿蜒山路", id: "huashan_huashan26", way: "jh 4;n;n;n;n;n;n" },
          { jh: "華山", loc: "蜿蜒山路", id: "huashan_huashan25", way: "jh 4;n;n;n;n;n;n" },
          { jh: "華山", loc: "群仙觀", id: "huashan_huashan7", way: "jh 4;n;n;n;n;n;n;e" },
          { jh: "華山", loc: "上天梯", id: "huashan_huashan27", way: "jh 4;n;n;n;n;n;n;n" },
          { jh: "華山", loc: "崎嶇山路", id: "huashan_huashan_fb4", way: "jh 4;n;n;n;n;n;n;n;event_1_91604710" },
          { jh: "華山", loc: "潭畔草地", id: "huashan_chengbuyou", way: "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s;s" },
          { jh: "華山", loc: "懸崖石洞", id: "huashan_fengbuping", way: "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s;s;s;e" },
          { jh: "華山", loc: "松林石徑", id: "huashan_huashan24", way: "jh 4;n;n;n;n;n;n;n;n" },
          { jh: "華山", loc: "朝陽峰山道", id: "huashan_huashan8", way: "jh 4;n;n;n;n;n;n;n;n;n" },
          { jh: "華山", loc: "長空棧道", id: "huashan_huashan_fb8", way: "jh 4;n;n;n;n;n;n;n;n;n;e" },
          { jh: "華山", loc: "臨淵石台", id: "huashan_huashan_fb9", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n" },
          { jh: "華山", loc: "草叢小路", id: "huashan_huashan_fb10", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n" },
          { jh: "華山", loc: "竹林", id: "huashan_huashan_fb11", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n" },
          { jh: "華山", loc: "密洞", id: "zonshi_fengqingyang", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;e;s;event_1_11292200" },
          { jh: "華山", loc: "空地", id: "huashan_huashan_fb12", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n" },
          { jh: "華山", loc: "小木屋", id: "huashan_huashan_fb13", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n;e" },
          { jh: "華山", loc: "華山之巔", id: "huashan_xiaolinzi", way: "jh 4;n;n;n;n;n;n;n;n;n;e;n;n;n;n;n" },
          { jh: "華山", loc: "前院", id: "huashan_gao", way: "jh 4;n;n;n;n;n;n;n;n;n;n" },
          { jh: "華山", loc: "正氣堂", id: "huashan_yue", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n" },
          { jh: "華山", loc: "後院", id: "huashan_huashan5", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n" },
          { jh: "華山", loc: "花園", id: "huashan_liangfa", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e" },
          { jh: "華山", loc: "長廊", id: "huashan_huashan21", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e;s" },
          { jh: "華山", loc: "臥房", id: "huashan_huashan12", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;e;s;s" },
          { jh: "華山", loc: "凜然軒", id: "huashan_lao", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;n" },
          { jh: "華山", loc: "寢室", id: "huashan_lao", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;n;get_silver" },
          { jh: "華山", loc: "廚房", id: "huashan_huashan22", way: "jh 4;n;n;n;n;n;n;n;n;n;n;n;n;w" },
          { jh: "華山", loc: "練武場", id: "huashan_shi", way: "jh 4;n;n;n;n;n;n;n;n;n;n;w" },
          { jh: "華山", loc: "庫房入口", id: "huashan_huashan_fb1", way: "jh 4;n;n;n;n;n;n;n;n;n;n;w;event_1_30014247" },
          { jh: "華山", loc: "地道入口", id: "huashan_huashan_fb2", way: "jh 4;n;n;n;n;n;n;n;n;n;n;w;event_1_30014247;s;s;s;s" },
          { jh: "華山", loc: "密室", id: "huashan_huashan_fb3", way: "jh 4;n;n;n;n;n;n;n;n;n;n;w;event_1_30014247;s;s;s;s;s;e" },
          { jh: "華山", loc: "玉女祠", id: "huashan_yueling", way: "jh 4;n;n;n;n;n;n;n;n;w;s" },
          { jh: "華山", loc: "思過崖", id: "huashan_dayou", way: "jh 4;n;n;n;n;n;n;n;n;w;w" },
          { jh: "華山", loc: "山洞", id: "huashan_linghu", way: "jh 4;n;n;n;n;n;n;n;n;w;w;n" },
          { jh: "華山", loc: "石壁", id: "huashan_linghu", way: "jh 4;n;n;n;n;n;n;n;n;w;w;n;get_xiangnang2" },
          { jh: "華山", loc: "觀瀑台", id: "huashan_huashan18", way: "jh 4;n;n;w" },
          { jh: "揚州", loc: "飛雪堂", id: "yangzhou_yangzhou12", way: "jh 5;n;n;n;n;n;e;n;e;n;w;n;n" },
          { jh: "揚州", loc: "揚州港", id: "yangzhou_chuanyundongzhu", way: "jh 5;n;n;n;n;n;n;n;n;n;n;ne" },
          { jh: "揚州", loc: "醉仙樓大廳", id: "yangzhou_yangzhou_fb10", way: "jh 5;n;n;n;n;n;n;e" },
          { jh: "揚州", loc: "醉仙樓大廳", id: "yangzhou_shijiueseng", way: "jh 5;n;n;n;n;n;n;e" },
          { jh: "揚州", loc: "太平橋", id: "yangzhou_baihuzilaotou", way: "jh 5;n;w" },
          { jh: "揚州", loc: "太平橋", id: "yangzhou_jiangziya", way: "jh 5;n;w" },
          { jh: "揚州", loc: "小東門橋", id: "baidicheng_doulilaoren", way: "jh 5;n;e" },
          { jh: "揚州", loc: "安定門", id: "yangzhou_yangzhou16", way: "jh 5" },
          { jh: "揚州", loc: "十裡長街3", id: "yangzhou_yangzhou20", way: "jh 5;n;n" },
          { jh: "揚州", loc: "小寶齋", id: "yangzhou_yangzhou9", way: "jh 5;n;n;e" },
          { jh: "揚州", loc: "十裡長街2", id: "yangzhou_yangzhou19", way: "jh 5;n;n;n" },
          { jh: "揚州", loc: "武館大門", id: "yangzhou_yangzhou_fb1", way: "jh 5;n;n;n;e" },
          { jh: "揚州", loc: "武館大院", id: "yangzhou_yangzhou_fb2", way: "jh 5;n;n;n;e;n" },
          { jh: "揚州", loc: "武館大廳", id: "yangzhou_yangzhou_fb4", way: "jh 5;n;n;n;e;n;n" },
          { jh: "揚州", loc: "長廊", id: "yangzhou_yangzhou_fb5", way: "jh 5;n;n;n;e;n;n;n" },
          { jh: "揚州", loc: "書房", id: "yangzhou_yangzhou_fb7", way: "jh 5;n;n;n;e;n;n;n;e" },
          { jh: "揚州", loc: "臥室", id: "yangzhou_yangzhou_fb6", way: "jh 5;n;n;n;e;n;n;n;n" },
          { jh: "揚州", loc: "休息室", id: "yangzhou_yangzhou_fb2", way: "jh 5;n;n;n;e;n;n;w;n;get_silver" },
          { jh: "揚州", loc: "練武場", id: "yangzhou_yangzhou_fb2", way: "jh 5;n;n;n;e;n;w" },
          { jh: "揚州", loc: "練武場", id: "yangzhou_yangzhou_fb3", way: "jh 5;n;n;n;e;n;w" },
          { jh: "揚州", loc: "十裡長街1", id: "yangzhou_yangzhou2", way: "jh 5;n;n;n;n" },
          { jh: "揚州", loc: "中央廣場", id: "yangzhou_yangzhou1", way: "jh 5;n;n;n;n;n" },
          { jh: "揚州", loc: "中央廣場", id: "gaibang_kongkong", way: "jh 5;n;n;n;n;n" },
          { jh: "揚州", loc: "至止堂", id: "yangzhou_yangzhou17", way: "jh 5;n;n;n;n;n;e;n;n;n" },
          { jh: "揚州", loc: "庭院", id: "yangzhou_guanjia", way: "jh 5;n;n;n;n;n;e;n;n" },
          { jh: "揚州", loc: "十裡長街4", id: "yangzhou_yangzhou30", way: "jh 5;n;n;n;n;n;n" },
          { jh: "揚州", loc: "十裡長街4", id: "yangzhou_yangzhou5", way: "jh 5;n;n;n;n;n;n" },
          { jh: "揚州", loc: "十裡長街4", id: "yangzhou_yangzhou28", way: "jh 5;n;n;n;n;n;n" },
          { jh: "揚州", loc: "樓梯", id: "yangzhou_yangzhou_fb12", way: "jh 5;n;n;n;n;n;n;e;n" },
          { jh: "揚州", loc: "二樓大廳", id: "yangzhou_yangzhou_fb11", way: "jh 5;n;n;n;n;n;n;e;n;n" },
          { jh: "揚州", loc: "芍藥宴廳", id: "yangzhou_yangzhou_fb14", way: "jh 5;n;n;n;n;n;n;e;n;n;e" },
          { jh: "揚州", loc: "牡丹宴廳", id: "yangzhou_yangzhou_fb15", way: "jh 5;n;n;n;n;n;n;e;n;n;n" },
          { jh: "揚州", loc: "觀景台", id: "yangzhou_yangzhou_fb9", way: "jh 5;n;n;n;n;n;n;e;n;n;n;n" },
          { jh: "揚州", loc: "芙蓉宴廳", id: "yangzhou_yangzhou_fb13", way: "jh 5;n;n;n;n;n;n;e;n;n;w" },
          { jh: "揚州", loc: "十裡長街5", id: "yangzhou_yangzhou6", way: "jh 5;n;n;n;n;n;n;n" },
          { jh: "揚州", loc: "富春茶社", id: "tieflag_yunjiuxiao", way: "jh 5;n;n;n;n;n;n;n;e" },
          { jh: "揚州", loc: "富春茶社", id: "yangzhou_yangzhou22", way: "jh 5;n;n;n;n;n;n;n;e" },
          { jh: "揚州", loc: "雅舍", id: "tieflag_yunjiuxiao", way: "jh 5;n;n;n;n;n;n;n;e;get_silver" },
          { jh: "揚州", loc: "雅舍", id: "yangzhou_yangzhou22", way: "jh 5;n;n;n;n;n;n;n;e;get_silver" },
          { jh: "揚州", loc: "十裡長街6", id: "yangzhou_yangzhou23", way: "jh 5;n;n;n;n;n;n;n;n" },
          { jh: "揚州", loc: "東關街", id: "yangzhou_yangzhou24", way: "jh 5;n;n;n;n;n;n;n;n;n;e" },
          { jh: "揚州", loc: "鎮淮門 ", id: "yangzhou_yangzhou29", way: "jh 5;n;n;n;n;n;n;n;n;n;n" },
          { jh: "揚州", loc: "禪智寺山門", id: "yangzhou_yangzhou26", way: "jh 5;n;n;n;n;n;n;n;n;n;w;w;n" },
          { jh: "揚州", loc: "昆丘台", id: "yangzhou_yangzhou11", way: "jh 5;n;n;n;n;n;n;n;n;n;w;w;n;e" },
          { jh: "揚州", loc: "呂祖照面池", id: "yangzhou_yangzhou27", way: "jh 5;n;n;n;n;n;n;n;n;n;w;w;n;n;n;e" },
          { jh: "揚州", loc: "竹西亭", id: "yangzhou_yangzhou28", way: "jh 5;n;n;n;n;n;n;n;n;n;w;w;n;w" },
          { jh: "揚州", loc: "竹西亭", id: "yangzhou_yangzhou10", way: "jh 5;n;n;n;n;n;n;n;n;n;w;w;n;w" },
          { jh: "揚州", loc: "虹橋", id: "yangzhou_yangzhou31", way: "jh 5;n;n;n;n;n;n;n;n;w" },
          { jh: "揚州", loc: "草河北街", id: "yangzhou_yangzhou13", way: "jh 5;n;n;n;n;n;n;n;n;w;w" },
          { jh: "揚州", loc: "魁星閣", id: "yangzhou_yangzhou12", way: "jh 5;n;n;n;n;n;n;n;n;w;w;n" },
          { jh: "揚州", loc: "閣樓", id: "yangzhou_lilijun", way: "jh 5;n;n;n;n;n;n;n;n;w;w;n;get_silver" },
          { jh: "揚州", loc: "淺月樓", id: "yangzhou_qingyimenwei", way: "jh 5;n;n;n;n;n;n;n;n;w;w;w" },
          { jh: "揚州", loc: "淺月樓大廳", id: "yangzhou_qingyimenwei", way: "jh 5;n;n;n;n;n;n;n;n;w;w;w;s" },
          { jh: "揚州", loc: "二樓走道", id: "yangzhou_qingyimenwei", way: "jh 5;n;n;n;n;n;n;n;n;w;w;w;s;e" },
          { jh: "揚州", loc: "淺月樓偏廳", id: "yangzhou_qingyimenwei", way: "jh 5;n;n;n;n;n;n;n;n;w;w;w;s;w" },
          { jh: "揚州", loc: "廣陵當鋪", id: "yangzhou_yangzhou7", way: "jh 5;n;n;n;n;n;n;n;w" },
          { jh: "揚州", loc: "武廟", id: "yangzhou_yangzhou21", way: "jh 5;n;n;n;n;n;n;w" },
          { jh: "揚州", loc: "武廟", id: "yangzhou_miaozhu", way: "jh 5;n;n;n;n;n;n;w" },
          { jh: "揚州", loc: "武廟", id: "snow_gangdu", way: "jh 5;n;n;n;n;n;n;w" },
          { jh: "揚州", loc: "通泗橋", id: "gumu_limochou", way: "jh 5;n;n;n;n;n;w" },
          { jh: "揚州", loc: "衙門大門", id: "yangzhou_yangzhou_fb16", way: "jh 5;n;n;n;n;n;w;w;n" },
          { jh: "揚州", loc: "正堂", id: "yangzhou_yangzhou_fb18", way: "jh 5;n;n;n;n;n;w;w;n;n;n" },
          { jh: "揚州", loc: "內室", id: "yangzhou_yangzhou_fb18", way: "jh 5;n;n;n;n;n;w;w;n;n;n;get_silver" },
          { jh: "揚州", loc: "天井", id: "yangzhou_yangzhou_fb17", way: "jh 5;n;n;n;n;n;w;w;n;n;w" },
          { jh: "揚州", loc: "玉器店", id: "yangzhou_yangzhou14", way: "jh 5;n;n;n;n;n;w;w;s;s" },
          { jh: "揚州", loc: "彥明錢莊", id: "yangzhou_yangzhou3", way: "jh 5;n;n;n;n;w" },
          { jh: "揚州", loc: "彥明錢莊", id: "yangzhou_xiaofeizei", way: "jh 5;n;n;n;n;w" },
          { jh: "揚州", loc: "銀庫", id: "yangzhou_yangzhou18", way: "jh 5;n;n;n;n;w;yangzhou16_op1" },
          { jh: "揚州", loc: "黃記雜貨", id: "yangzhou_yangzhou4", way: "jh 5;n;n;n;w" },
          { jh: "揚州", loc: "鐵匠鋪", id: "yangzhou_yangzhou25", way: "jh 5;n;n;w" },
          { jh: "揚州", loc: "花店", id: "yangzhou_yangzhou15", way: "jh 5;n;w;w;n" },
          { jh: "丐幫", loc: "樹洞內部", id: "gaibang_qiu-wan", way: "jh 6" },
          { jh: "丐幫", loc: "樹洞內部", id: "gaibang_zuo-qu", way: "jh 6" },
          { jh: "丐幫", loc: "樹洞下", id: "gaibang_liang", way: "jh 6;event_1_98623439" },
          { jh: "丐幫", loc: "暗道", id: "huashancun_cangjianloushouling", way: "jh 6;event_1_98623439;ne;n" },
          { jh: "丐幫", loc: "屋角邊", id: "gaibang_he-bj", way: "jh 6;event_1_98623439;ne;n;ne;ne" },
          { jh: "丐幫", loc: "谷場槐樹邊", id: "gaibang_ma-jw", way: "jh 6;event_1_98623439;ne;n;ne;ne;ne" },
          { jh: "丐幫", loc: "沙丘小洞", id: "gaibang_yu-hx", way: "jh 6;event_1_98623439;ne;n;ne;ne;ne;event_1_97428251" },
          { jh: "丐幫", loc: "暗道", id: "gaibang_mo-bu", way: "jh 6;event_1_98623439;ne;ne" },
          { jh: "丐幫", loc: "儲藏室", id: "gaibang_huo-du", way: "jh 6;event_1_98623439;s" },
          { jh: "丐幫", loc: "密室", id: "zonshi_jiejiufeng", way: "jh 6;event_1_98623439;s;w" },
          { jh: "喬陰縣", loc: "樹王墳", id: "choyin_shadow", way: "jh 3;s;s;s;;kill?黑狗;@黑狗的屍體;jh 7;event_1_57435070;s;s;s;s;event_1_65599392" },
          { jh: "喬陰縣", loc: "喬陰縣城北門", id: "choyin_cityguard", way: "jh 3;s;s;s;;kill?黑狗;@黑狗的屍體;jh 7;event_1_57435070" },
          { jh: "喬陰縣", loc: "喬陰縣城北門", id: "obj_garrison", way: "jh 3;s;s;s;;kill?黑狗;@黑狗的屍體;jh 7;event_1_57435070" },
          { jh: "喬陰縣", loc: "喬陰縣城北門", id: "choyin_ghost", way: "jh 3;s;s;s;;kill?黑狗;@黑狗的屍體;jh 7;event_1_57435070" },
          { jh: "喬陰縣", loc: "石闆空地", id: "choyin_cangjianlouxuezhe", way: "jh 7;s;s;s;w" },
          { jh: "喬陰縣", loc: "休息室", id: "choyin_cangjianlouzhanglao", way: "jh 7;s;s;s;s;s;s;e;n;n;e" },
          { jh: "喬陰縣", loc: "喬陰縣城北門", id: "choyin_cityguard", way: "jh 7" },
          { jh: "喬陰縣", loc: "喬陰縣城北門", id: "choyin_ghost", way: "jh 7" },
          { jh: "喬陰縣", loc: "福林大街", id: "choyin_cake_vendor", way: "jh 7;s" },
          { jh: "喬陰縣", loc: "福林大街", id: "obj_garrison", way: "jh 7;s" },
          { jh: "喬陰縣", loc: "福林大街", id: "zonshi_lujiuyou", way: "jh 7;s" },
          { jh: "喬陰縣", loc: "福林大街", id: "beggar_master", way: "jh 7;s" },
          { jh: "喬陰縣", loc: "福林大街", id: "choyin_dumpling_seller", way: "jh 7;s;s;s" },
          { jh: "喬陰縣", loc: "樹王墳內部", id: "choyin_guairen", way: "jh 7;s;s;s;s;event_1_65599392;w" },
          { jh: "喬陰縣", loc: "福林酒樓", id: "choyin_sergeant", way: "jh 7;s;s;s;s;s;s;e" },
          { jh: "喬陰縣", loc: "福林酒樓", id: "choyin_boss", way: "jh 7;s;s;s;s;s;s;e" },
          { jh: "喬陰縣", loc: "福林酒樓", id: "choyin_youngman", way: "jh 7;s;s;s;s;s;s;e;n" },
          { jh: "喬陰縣", loc: "福林酒樓", id: "choyin_servant", way: "jh 7;s;s;s;s;s;s;e;n" },
          { jh: "喬陰縣", loc: "福林酒樓", id: "choyin_guard", way: "jh 7;s;s;s;s;s;s;e;n;n" },
          { jh: "喬陰縣", loc: "曲橋", id: "choyin_scholar", way: "jh 7;s;s;s;s;s;s;s;s;e" },
          { jh: "喬陰縣", loc: "曲橋", id: "choyin_girl", way: "jh 7;s;s;s;s;s;s;s;s;e;n;e" },
          { jh: "喬陰縣", loc: "曲橋", id: "choyin_maid", way: "jh 7;s;s;s;s;s;s;s;s;e;n;e" },
          { jh: "喬陰縣", loc: "曼雲台", id: "scholar_master", way: "jh 7;s;s;s;s;s;s;s;s;e;n;e;s;e" },
          { jh: "喬陰縣", loc: "火龍將軍廟", id: "choyin_crone", way: "jh 7;s;s;s;s;s;s;s;sw;w" },
        ],
      },
      dailyList: [
        { n: "剑宫白猿", v: "rank go 204;e;s;s;s;s;s;s;s;s;w;w;n;n;n;n;nw;nw;nw;n;n;n;" },
        { n: "云远寺", v: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;s;s;s;s;e;event_1_2215721" },
        { n: "闯入冥庄", v: "jh 45;ne;ne;n;n;ne;ne;e;ne;n;n;n;n;n;ne;ne;n;n;n;nw;nw;n;e;e;e;e;e;event_1_77775145" },
        { n: "西凉铁剑", v: "jh 47;ne;n;n;n;ne;ne;e;e;e;e;ne;n;ne;n;n;n;n;n;nw;nw;ne;n;ne;n;" },
        { n: "四大绝杀", v: "jh 44;n;n;n;n;e;ne;ne;ne;n;n;n;n;n;nw;nw;nw;w;n;n;n;n;e;n;n;n;n;n;w;w;n;n;n;n;n;n;n;n" },
        { n: "十八木人", v: "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n;event_1_91914705;e;e;e" },
        { n: "去通天塔", v: "rank go 193" },
        { n: "去红螺寺", v: "rank go 194" },
        { n: "去越女剑楼", v: "rank go 204" },
        { n: "去铸剑洞", v: "rank go 210" },
        { n: "去霹雳门", v: "rank go 222" },
        { n: "去葬剑谷", v: "rank go 223" },
        { n: "去无湘楼", v: "rank go 231" },
        { n: "去藏典塔", v: "rank go 232" },
        { n: "去魔皇殿", v: "rank go 236" },
        { n: "去名将堂", v: "rank go 262" },
        { n: "去一品堂", v: "rank go 296" },
        { n: "去无为寺", v: "jh 54;#4 nw;#2 w;#8 n;#2 ne;#2 nw;#6 n;" },
        { n: "去石棺", v: "jh 54;#4 nw;#2 w;#8 n;#2 nw;w;nw;#2 n;w;#2 n;" },
        { n: "拱辰楼", v: "jh 54;nw;nw;nw;nw;w;w;n;n;n;n;n;w;w;sw;w;event_1_69046360;;place?狮子口;w;s;s;w;w;w;se;n;nw;s;e;w;sw;w;w;w;n;n;n;n;w;w;w;w;w;w;w;w;n;" },
        { n: "塔林湖畔", v: "rank go 231;s;s;s;se;se;e;s;s;s;s;se;se;s;s;s" },
        { n: "种丹秘境", v: "jh 54;nw;nw;nw;nw;w;w;n;n;n;n;n;w;w;sw;w;event_1_69046360;event_1_30634412;place?巍宝仙踪:2;" },
        { n: "灵鹫宫", v: "rank go 311" },
        { n: "去哈日", v: "rank go 262;e;s;w;w;s;sw;sw;sw;sw;nw;nw;n;nw;ne;" },
      ],
      QuestAnsLibs: {
        "“白玉牌楼”场景是在哪个地图上？": "c",
        "“百龙山庄”场景是在哪个地图上？": "b",
        "“冰火岛”场景是在哪个地图上？": "b",
        "“常春岛渡口”场景是在哪个地图上？": "c",
        "“跪拜坪”场景是在哪个地图上？": "b",
        "“翰墨书屋”场景是在哪个地图上？": "c",
        "“花海”场景是在哪个地图上？": "a",
        "“留云馆”场景是在哪个地图上？": "b",
        "“日月洞”场景是在哪个地图上？": "b",
        "“蓉香榭”场景是在哪个地图上？": "c",
        "“三清殿”场景是在哪个地图上？": "b",
        "“三清宫”场景是在哪个地图上？": "c",
        "“双鹤桥”场景是在哪个地图上？": "b",
        "“无名山脚”场景是在哪个地图上？": "d",
        "“伊犁”场景是在哪个地图上？": "b",
        "“鹰记商号”场景是在哪个地图上？": "d",
        "“迎梅客栈”场景是在哪个地图上？": "d",
        "“子午楼”场景是在哪个地图上？": "c",
        "8级的装备摹刻需要几把刻刀": "a",
        NPC公平子在哪一章地图: "a",
        瑷伦在晚月庄的哪个场景: "b",
        安惜迩是在那个场景: "c",
        "黯然销魂掌有多少招式？": "c",
        黯然销魂掌是哪个门派的技能: "a",
        "八卦迷阵是哪个门派的阵法？": "b",
        八卦迷阵是那个门派的阵法: "a",
        "白金戒指可以在哪位那里获得？": "b",
        "白金戒指可以在哪位npc那里获得？": "b",
        "白金手镯可以在哪位那里获得？": "a",
        "白金手镯可以在哪位npc那里获得？": "a",
        "白金项链可以在哪位那里获得？": "b",
        "白金项链可以在哪位npc那里获得？": "b",
        "白蟒鞭的伤害是多少？": "a",
        白驼山第一位要拜的师傅是谁: "a",
        白银宝箱礼包多少元宝一个: "d",
        "白玉腰束是腰带类的第几级装备？": "b",
        拜师风老前辈需要正气多少: "b",
        拜师老毒物需要蛤蟆功多少级: "a",
        拜师铁翼需要多少内力: "b",
        拜师小龙女需要容貌多少: "c",
        拜师张三丰需要多少正气: "b",
        包家将是哪个门派的师傅: "a",
        包拯在哪一章: "d",
        "宝石合成一次需要消耗多少颗低级宝石？": "c",
        "宝玉帽可以在哪位那里获得？": "d",
        宝玉鞋击杀哪个可以获得: "a",
        宝玉鞋在哪获得: "a",
        "暴雨梨花针的伤害是多少？": "c",
        北斗七星阵是第几个的组队副本: "c",
        北冥神功是哪个门派的技能: "b",
        北岳殿神像后面是哪位: "b",
        匕首加什么属性: "c",
        碧海潮生剑在哪位师傅处学习: "a",
        "碧磷鞭的伤害是多少？": "b",
        镖局保镖是挂机里的第几个任务: "d",
        "冰魄银针的伤害是多少？": "b",
        病维摩拳是哪个门派的技能: "b",
        不可保存装备下线多久会消失: "c",
        不属于白驼山的技能是什么: "b",
        沧海护腰可以镶嵌几颗宝石: "d",
        "沧海护腰是腰带类的第几级装备？": "a",
        藏宝图在哪个NPC处购买: "a",
        藏宝图在哪个处购买: "b",
        藏宝图在哪里那里买: "a",
        "草帽可以在哪位那里获得？": "b",
        成功易容成异性几次可以领取易容成就奖: "b",
        "成长计划第七天可以领取多少元宝？": "d",
        "成长计划六天可以领取多少银两？": "d",
        "成长计划需要多少元宝方可购买？": "a",
        城里打擂是挂机里的第几个任务: "d",
        城里抓贼是挂机里的第几个任务: "b",
        充值积分不可以兑换下面什么物品: "d",
        出生选武学世家增加什么: "a",
        "闯楼第几层可以获得称号“藏剑楼护法”": "b",
        "闯楼第几层可以获得称号“藏剑楼楼主”": "d",
        "闯楼第几层可以获得称号“藏剑楼长老”": "c",
        闯楼每多少层有称号奖励: "a",
        春风快意刀是哪个门派的技能: "b",
        春秋水色斋需要多少杀气才能进入: "d",
        从哪个处进入跨服战场: "a",
        摧心掌是哪个门派的技能: "a",
        达摩在少林哪个场景: "c",
        "达摩杖的伤害是多少？": "d",
        "打开引路蜂礼包可以得到多少引路蜂？": "b",
        "打排行榜每天可以完成多少次？": "a",
        打土匪是挂机里的第几个任务: "c",
        打造刻刀需要多少个玄铁: "a",
        打坐增长什么属性: "a",
        "大保险卡可以承受多少次死亡后不降技能等级？": "b",
        大乘佛法有什么效果: "d",
        大旗门的修养术有哪个特殊效果: "a",
        大旗门的云海心法可以提升哪个属性: "c",
        大招寺的金刚不坏功有哪个特殊效果: "a",
        大招寺的铁布衫有哪个特殊效果: "c",
        "当日最低累积充值多少元即可获得返利？": "b",
        刀法基础在哪掉落: "a",
        倒乱七星步法是哪个门派的技能: "d",
        "等级多少才能在世界频道聊天？": "c",
        第一个副本需要多少等级才能进入: "d",
        "貂皮斗篷是披风类的第几级装备？": "b",
        丁老怪是哪个门派的终极师傅: "a",
        丁老怪在星宿海的哪个场景: "b",
        东方教主在魔教的哪个场景: "b",
        斗转星移是哪个门派的技能: "a",
        斗转星移阵是哪个门派的阵法: "a",
        "毒龙鞭的伤害是多少？": "a",
        毒物阵法是哪个门派的阵法: "b",
        "独孤求败有过几把剑？": "d",
        独龙寨是第几个组队副本: "a",
        "读书写字301-400级在哪里买书": "c",
        读书写字最高可以到多少级: "b",
        端茶递水是挂机里的第几个任务: "b",
        断云斧是哪个门派的技能: "a",
        "锻造一把刻刀需要多少玄铁碎片锻造？": "c",
        "锻造一把刻刀需要多少银两？": "a",
        兑换易容面具需要多少玄铁碎片: "c",
        多少消费积分换取黄金宝箱: "a",
        多少消费积分可以换取黄金钥匙: "b",
        翻译梵文一次多少银两: "d",
        方媃是哪个门派的师傅: "b",
        飞仙剑阵是哪个门派的阵法: "b",
        风老前辈在华山哪个场景: "b",
        风泉之剑加几点悟性: "c",
        "风泉之剑可以在哪位那里获得？": "b",
        "风泉之剑可以在哪位npc那里获得？": "b",
        风泉之剑在哪里获得: "d",
        "疯魔杖的伤害是多少？": "b",
        "伏虎杖的伤害是多少？": "c",
        副本完成后不可获得下列什么物品: "b",
        副本一次最多可以进几人: "a",
        副本有什么奖励: "d",
        富春茶社在哪一章: "c",
        "改名字在哪改？": "d",
        丐帮的绝学是什么: "a",
        丐帮的轻功是哪个: "b",
        干苦力是挂机里的第几个任务: "a",
        "钢丝甲衣可以在哪位那里获得？": "d",
        高级乾坤再造丹加什么: "b",
        "高级乾坤再造丹是增加什么的？": "b",
        高级突破丹多少元宝一颗: "d",
        "割鹿刀可以在哪位npc那里获得？": "b",
        葛伦在大招寺的哪个场景: "b",
        根骨能提升哪个属性: "c",
        功德箱捐香火钱有什么用: "a",
        "功德箱在雪亭镇的哪个场景？": "c",
        "购买新手进阶礼包在挂机打坐练习上可以享受多少倍收益？": "b",
        孤独求败称号需要多少论剑积分兑换: "b",
        孤儿出身增加什么: "d",
        古灯大师是哪个门派的终极师傅: "c",
        古灯大师在大理哪个场景: "c",
        "古墓多少级以后才能进去？": "d",
        寒玉床睡觉修炼需要多少点内力值: "c",
        寒玉床睡觉一次多久: "c",
        寒玉床需要切割多少次: "d",
        寒玉床在哪里切割: "a",
        "寒玉床在那个地图可以找到？": "a",
        黑狗血在哪获得: "b",
        "黑水伏蛟可以在哪位那里获得？": "c",
        红宝石加什么属性: "b",
        洪帮主在洛阳哪个场景: "c",
        "虎皮腰带是腰带类的第几级装备？": "a",
        花不为在哪一章: "a",
        花花公子在哪个地图: "a",
        华山村王老二掉落的物品是什么: "a",
        华山施戴子掉落的物品是什么: "b",
        华山武器库从哪个NPC进: "d",
        黄宝石加什么属性: "c",
        黄岛主在桃花岛的哪个场景: "d",
        黄袍老道是哪个门派的师傅: "c",
        "积分商城在雪亭镇的哪个场景？": "c",
        "技能柳家拳谁教的？": "a",
        技能数量超过了什么消耗潜能会增加: "b",
        嫁衣神功是哪个门派的技能: "b",
        剑冢在哪个地图: "a",
        街头卖艺是挂机里的第几个任务: "a",
        "金弹子的伤害是多少？": "a",
        金刚不坏功有什么效果: "a",
        "金刚杖的伤害是多少？": "a",
        "金戒指可以在哪位npc那里获得？": "d",
        "金手镯可以在哪位npc那里获得？": "b",
        "金丝鞋可以在哪位npc那里获得？": "b",
        "金项链可以在哪位npc那里获得？": "d",
        金玉断云是哪个门派的阵法: "a",
        "锦缎腰带是腰带类的第几级装备？": "a",
        "精铁棒可以在哪位那里获得？": "d",
        九区服务器名称: "d",
        九阳神功是哪个门派的技能: "c",
        九阴派梅师姐在星宿海哪个场景: "a",
        军营是第几个组队副本: "b",
        "开通VIP月卡最低需要当天充值多少元方有购买资格？": "a",
        "可以召唤金甲伏兵助战是哪个门派？": "a",
        客商在哪一章: "b",
        孔雀氅可以镶嵌几颗宝石: "b",
        "孔雀氅是披风类的第几级装备？": "c",
        枯荣禅功是哪个门派的技能: "a",
        跨服是星期几举行的: "b",
        跨服天剑谷每周六几点开启: "a",
        跨服需要多少级才能进入: "c",
        跨服在哪个场景进入: "c",
        兰花拂穴手是哪个门派的技能: "a",
        蓝宝石加什么属性: "a",
        蓝止萍在哪一章: "c",
        蓝止萍在晚月庄哪个小地图: "b",
        老毒物在白驮山的哪个场景: "b",
        老顽童在全真教哪个场景: "b",
        莲花掌是哪个门派的技能: "a",
        烈火旗大厅是那个地图的场景: "c",
        烈日项链可以镶嵌几颗宝石: "c",
        林祖师是哪个门派的师傅: "a",
        灵蛇杖法是哪个门派的技能: "c",
        淩波微步是哪个门派的技能: "b",
        淩虚锁云步是哪个门派的技能: "b",
        "领取消费积分需要寻找哪个NPC？": "c",
        "鎏金缦罗是披风类的第几级装备？": "d",
        柳淳风在哪一章: "c",
        柳淳风在雪亭镇哪个场景: "b",
        柳文君所在的位置: "a",
        六脉神剑是哪个门派的绝学: "a",
        陆得财是哪个门派的师傅: "c",
        陆得财在乔阴县的哪个场景: "a",
        论剑每天能打几次: "a",
        论剑是每周星期几: "c",
        论剑是什么时间点正式开始: "a",
        论剑是星期几进行的: "c",
        论剑是星期几举行的: "c",
        论剑输一场获得多少论剑积分: "a",
        论剑要在晚上几点前报名: "b",
        "论剑在周几进行？": "b",
        论剑中步玄派的师傅是哪个: "a",
        论剑中大招寺第一个要拜的师傅是谁: "c",
        论剑中古墓派的终极师傅是谁: "d",
        论剑中花紫会的师傅是谁: "c",
        论剑中青城派的第一个师傅是谁: "a",
        论剑中青城派的终极师傅是谁: "d",
        论剑中逍遥派的终极师傅是谁: "c",
        论剑中以下不是峨嵋派技能的是哪个: "b",
        论剑中以下不是华山派的人物的是哪个: "d",
        论剑中以下哪个不是大理段家的技能: "c",
        论剑中以下哪个不是大招寺的技能: "b",
        论剑中以下哪个不是峨嵋派可以拜师的师傅: "d",
        论剑中以下哪个不是丐帮的技能: "d",
        论剑中以下哪个不是丐帮的人物: "a",
        论剑中以下哪个不是古墓派的的技能: "b",
        论剑中以下哪个不是华山派的技能的: "d",
        论剑中以下哪个不是明教的技能: "d",
        论剑中以下哪个不是魔教的技能: "a",
        论剑中以下哪个不是魔教的人物: "d",
        论剑中以下哪个不是全真教的技能: "d",
        论剑中以下哪个不是是晚月庄的技能: "d",
        论剑中以下哪个不是唐门的技能: "c",
        论剑中以下哪个不是唐门的人物: "c",
        论剑中以下哪个不是铁雪山庄的技能: "d",
        论剑中以下哪个不是铁血大旗门的技能: "c",
        论剑中以下哪个是大理段家的技能: "a",
        论剑中以下哪个是大招寺的技能: "b",
        论剑中以下哪个是丐帮的技能: "b",
        论剑中以下哪个是花紫会的技能: "a",
        论剑中以下哪个是华山派的技能的: "a",
        论剑中以下哪个是明教的技能: "b",
        论剑中以下哪个是青城派的技能: "b",
        论剑中以下哪个是唐门的技能: "b",
        论剑中以下哪个是天邪派的技能: "b",
        论剑中以下哪个是天邪派的人物: "a",
        论剑中以下哪个是铁雪山庄的技能: "c",
        论剑中以下哪个是铁血大旗门的技能: "b",
        论剑中以下哪个是铁血大旗门的师傅: "a",
        论剑中以下哪个是晚月庄的技能: "a",
        论剑中以下哪个是晚月庄的人物: "a",
        论剑中以下是峨嵋派技能的是哪个: "a",
        论语在哪购买: "a",
        骆云舟在哪一章: "c",
        骆云舟在乔阴县的哪个场景: "b",
        落英神剑掌是哪个门派的技能: "b",
        吕进在哪个地图: "a",
        绿宝石加什么属性: "c",
        漫天花雨匕在哪获得: "a",
        茅山的绝学是什么: "b",
        茅山的天师正道可以提升哪个属性: "d",
        茅山可以招几个宝宝: "c",
        茅山派的轻功是什么: "b",
        茅山天师正道可以提升什么: "c",
        茅山学习什么技能招宝宝: "a",
        茅山在哪里拜师: "c",
        "每次合成宝石需要多少银两？": "a",
        每个玩家最多能有多少个好友: "a",
        vip每天不可以领取什么: "b",
        每天的任务次数几点重置: "d",
        每天分享游戏到哪里可以获得20元宝: "a",
        每天能挖几次宝: "d",
        每天能做多少个谜题任务: "a",
        每天能做多少个谜: "a",
        每天能做多少个师门任务: "c",
        每天微信分享能获得多少元宝: "d",
        每天有几次试剑: "b",
        "每天在线多少个小时即可领取消费积分？": "b",
        每突破一次技能有效系数加多少: "a",
        密宗伏魔是哪个门派的阵法: "c",
        灭绝师太在第几章: "c",
        灭绝师太在峨眉山哪个场景: "a",
        明教的九阳神功有哪个特殊效果: "a",
        "明月帽要多少刻刀摩刻？": "a",
        摹刻10级的装备需要摩刻技巧多少级: "b",
        "摹刻烈日宝链需要多少级摩刻技巧？": "c",
        "摹刻扬文需要多少把刻刀？": "a",
        魔鞭诀在哪里学习: "d",
        魔教的大光明心法可以提升哪个属性: "d",
        莫不收在哪一章: "a",
        "墨磷腰带是腰带类的第几级装备？": "d",
        木道人在青城山的哪个场景: "b",
        慕容家主在慕容山庄的哪个场景: "a",
        慕容山庄的斗转星移可以提升哪个属性: "d",
        哪个NPC掉落拆招基础: "a",
        哪个处可以捏脸: "a",
        哪个分享可以获得20元宝: "b",
        哪个技能不是魔教的: "d",
        哪个门派拜师没有性别要求: "d",
        哪个npc属于全真七子: "b",
        哪样不能获得玄铁碎片: "c",
        能增容貌的是下面哪个技能: "a",
        "捏脸需要花费多少银两？": "c",
        "捏脸需要寻找哪个NPC？": "a",
        "欧阳敏是哪个门派的？": "b",
        欧阳敏是哪个门派的师傅: "b",
        欧阳敏在哪一章: "a",
        欧阳敏在唐门的哪个场景: "c",
        "排行榜最多可以显示多少名玩家？": "a",
        逄义是在那个场景: "a",
        "披星戴月是披风类的第几级装备？": "d",
        劈雳拳套有几个镶孔: "a",
        霹雳掌套的伤害是多少: "b",
        辟邪剑法是哪个门派的绝学技能: "a",
        辟邪剑法在哪学习: "b",
        婆萝蜜多心经是哪个门派的技能: "b",
        七宝天岚舞是哪个门派的技能: "d",
        "七星鞭的伤害是多少？": "c",
        七星剑法是哪个门派的绝学: "a",
        棋道是哪个门派的技能: "c",
        千古奇侠称号需要多少论剑积分兑换: "d",
        乾坤大挪移属于什么类型的武功: "a",
        乾坤一阳指是哪个师傅教的: "a",
        青城派的道德经可以提升哪个属性: "c",
        青城派的道家心法有哪个特殊效果: "a",
        清风寨在哪: "b",
        清风寨在哪个地图: "d",
        清虚道长在哪一章: "d",
        去唐门地下通道要找谁拿钥匙: "a",
        全真的道家心法有哪个特殊效果: "a",
        全真的基本阵法有哪个特殊效果: "b",
        全真的双手互搏有哪个特殊效果: "c",
        日月神教大光明心法可以提升什么: "d",
        "如何将华山剑法从400级提升到440级？": "d",
        如意刀是哪个门派的技能: "c",
        "山河藏宝图需要在哪个NPC手里购买？": "d",
        上山打猎是挂机里的第几个任务: "c",
        少林的混元一气功有哪个特殊效果: "d",
        少林的易筋经神功有哪个特殊效果: "a",
        蛇形刁手是哪个门派的技能: "b",
        什么影响打坐的速度: "c",
        什么影响攻击力: "d",
        什么装备不能镶嵌黄水晶: "d",
        "什么装备都能镶嵌的是什么宝石？": "c",
        什么装备可以镶嵌紫水晶: "c",
        神雕大侠所在的地图: "b",
        神雕大侠在哪一章: "a",
        "神雕侠侣的时代背景是哪个朝代？": "d",
        "神雕侠侣的作者是?": "b",
        升级什么技能可以提升根骨: "a",
        "生死符的伤害是多少？": "a",
        师门磕头增加什么: "a",
        "师门任务每天可以完成多少次？": "a",
        "师门任务每天可以做多少个？": "c",
        "师门任务什么时候更新？": "b",
        师门任务一天能完成几次: "d",
        "师门任务最多可以完成多少个？": "d",
        施令威在哪个地图: "b",
        石师妹哪个门派的师傅: "c",
        "使用朱果经验潜能将分别增加多少？": "a",
        "首次通过乔阴县不可以获得那种奖励？": "a",
        受赠的消费积分在哪里领取: "d",
        "兽皮鞋可以在哪位那里获得？": "b",
        树王坟在第几章节: "c",
        双儿在扬州的哪个小地图: "a",
        孙天灭是哪个门派的师傅: "c",
        踏雪无痕是哪个门派的技能: "b",
        "踏云棍可以在哪位那里获得？": "a",
        唐门的唐门毒经有哪个特殊效果: "a",
        唐门密道怎么走: "c",
        天蚕围腰可以镶嵌几颗宝石: "d",
        "天蚕围腰是腰带类的第几级装备？": "d",
        天山姥姥在逍遥林的哪个场景: "d",
        天山折梅手是哪个门派的技能: "c",
        天师阵法是哪个门派的阵法: "b",
        天邪派在哪里拜师: "b",
        天羽奇剑是哪个门派的技能: "a",
        "铁戒指可以在哪位那里获得？": "a",
        "铁手镯可以在哪位那里获得？": "a",
        铁血大旗门云海心法可以提升什么: "a",
        "通灵需要花费多少银两？": "d",
        "通灵需要寻找哪个NPC？": "c",
        突破丹在哪里购买: "b",
        屠龙刀法是哪个门派的绝学技能: "b",
        屠龙刀是什么级别的武器: "a",
        挖剑冢可得什么: "a",
        "弯月刀可以在哪位那里获得？": "b",
        玩家每天能够做几次正邪任务: "c",
        "玩家想修改名字可以寻找哪个NPC？": "a",
        晚月庄的内功是什么: "b",
        晚月庄的七宝天岚舞可以提升哪个属性: "b",
        晚月庄的小贩在下面哪个地点: "a",
        晚月庄七宝天岚舞可以提升什么: "b",
        晚月庄主线过关要求: "a",
        王铁匠是在那个场景: "b",
        王重阳是哪个门派的师傅: "b",
        "魏无极处读书可以读到多少级？": "a",
        魏无极身上掉落什么装备: "c",
        魏无极在第几章: "a",
        闻旗使在哪个地图: "a",
        "乌金玄火鞭的伤害是多少？": "d",
        "乌檀木刀可以在哪位那里获得？": "d",
        "乌檀木刀可以在哪位npc那里获得？": "d",
        "钨金腰带是腰带类的第几级装备？": "d",
        武当派的绝学技能是以下哪个: "d",
        "武穆兵法提升到多少级才能出现战斗必刷？": "d",
        武穆兵法通过什么学习: "a",
        武学世家加的什么初始属性: "a",
        舞中之武是哪个门派的阵法: "b",
        "西毒蛇杖的伤害是多少？": "c",
        吸血蝙蝠在下面哪个地图: "a",
        "下列哪项战斗不能多个玩家一起战斗？": "a",
        下列装备中不可摹刻的是: "c",
        下面哪个不是古墓的师傅: "d",
        下面哪个不是门派绝学: "d",
        下面哪个不是魔教的: "d",
        下面哪个地点不是乔阴县的: "d",
        下面哪个门派是正派: "a",
        下面哪个是天邪派的师傅: "a",
        下面有什么是寻宝不能获得的: "c",
        "向师傅磕头可以获得什么？": "b",
        逍遥步是哪个门派的技能: "a",
        逍遥林是第几章的地图: "c",
        逍遥林怎么弹琴可以见到天山姥姥: "b",
        逍遥派的绝学技能是以下哪个: "a",
        萧辟尘在哪一章: "d",
        "小李飞刀的伤害是多少？": "d",
        "小龙女住的古墓是谁建造的？": "b",
        小男孩在华山村哪里: "a",
        新人礼包在哪个npc处兑换: "a",
        新手礼包在哪里领取: "a",
        "新手礼包在哪领取？": "c",
        需要使用什么衣服才能睡寒玉床: "a",
        选择孤儿会影响哪个属性: "c",
        选择商贾会影响哪个属性: "b",
        选择书香门第会影响哪个属性: "b",
        选择武学世家会影响哪个属性: "a",
        学习屠龙刀法需要多少内力: "b",
        雪莲有什么作用: "a",
        雪蕊儿是哪个门派的师傅: "a",
        雪蕊儿在铁雪山庄的哪个场景: "d",
        扬文的属性: "a",
        扬州询问黑狗能到下面哪个地点: "a",
        扬州在下面哪个地点的处可以获得玉佩: "c",
        "羊毛斗篷是披风类的第几级装备？": "a",
        阳刚之劲是哪个门派的阵法: "c",
        "杨过小龙女分开多少年后重逢?": "c",
        杨过在哪个地图: "a",
        "夜行披风是披风类的第几级装备？": "a",
        夜皇在大旗门哪个场景: "c",
        一个队伍最多有几个队员: "c",
        一天能完成谜题任务多少个: "b",
        一天能完成师门任务有多少个: "c",
        一天能完成挑战排行榜任务多少次: "a",
        一张分身卡的有效时间是多久: "c",
        一指弹在哪里领悟: "b",
        移开明教石板需要哪项技能到一定级别: "a",
        以下不是步玄派的技能的哪个: "c",
        以下不是天宿派师傅的是哪个: "c",
        以下不是隐藏门派的是哪个: "d",
        以下哪个宝石不能镶嵌到戒指: "c",
        以下哪个宝石不能镶嵌到内甲: "a",
        以下哪个宝石不能镶嵌到披风: "c",
        以下哪个宝石不能镶嵌到腰带: "c",
        以下哪个宝石不能镶嵌到衣服: "a",
        "以下哪个不是道尘禅师教导的武学？": "d",
        "以下哪个不是何不净教导的武学？": "c",
        "以下哪个不是慧名尊者教导的技能？": "d",
        "以下哪个不是空空儿教导的武学？": "b",
        "以下哪个不是梁师兄教导的武学？": "b",
        "以下哪个不是论剑的皮肤？": "d",
        "以下哪个不是全真七子？": "c",
        "以下哪个不是宋首侠教导的武学？": "d",
        "以下哪个不是微信分享好友、朋友圈、QQ空间的奖励？": "a",
        "以下哪个不是岳掌门教导的武学？": "a",
        以下哪个不是在洛阳场景: "d",
        以下哪个不是在雪亭镇场景: "d",
        以下哪个不是在扬州场景: "d",
        "以下哪个不是知客道长教导的武学？": "b",
        "以下哪个门派不是隐藏门派？": "c",
        "以下哪个门派是正派？": "d",
        "以下哪个门派是中立门派？": "a",
        以下哪个是步玄派的祖师: "b",
        以下哪个是封山派的祖师: "c",
        以下哪个是花紫会的祖师: "a",
        以下哪个是晚月庄的祖师: "d",
        "以下哪些物品不是成长计划第二天可以领取的？": "c",
        "以下哪些物品不是成长计划第三天可以领取的？": "d",
        "以下哪些物品不是成长计划第一天可以领取的？": "d",
        "以下哪些物品是成长计划第四天可以领取的？": "a",
        "以下哪些物品是成长计划第五天可以领取的？": "b",
        以下属于邪派的门派是哪个: "b",
        以下属于正派的门派是哪个: "a",
        "以下谁不精通降龙十八掌？": "d",
        "以下有哪些物品不是每日充值的奖励？": "d",
        倚天剑加多少伤害: "d",
        "倚天屠龙记的时代背景哪个朝代？": "a",
        易容后保持时间是多久: "a",
        易容面具需要多少玄铁兑换: "c",
        易容术多少级才可以易容成异性NPC: "a",
        "易容术可以找哪位NPC学习？": "b",
        易容术向谁学习: "a",
        易容术在哪里学习: "a",
        "易容术在哪学习？": "b",
        "银手镯可以在哪位那里获得？": "b",
        "银丝链甲衣可以在哪位npc那里获得？": "a",
        "银项链可以在哪位那里获得？": "b",
        尹志平是哪个门派的师傅: "b",
        隐者之术是那个门派的阵法: "a",
        鹰爪擒拿手是哪个门派的技能: "a",
        "影响你出生的福缘的出生是？": "d",
        油流麻香手是哪个门派的技能: "a",
        游龙散花是哪个门派的阵法: "d",
        玉蜂浆在哪个地图获得: "a",
        玉女剑法是哪个门派的技能: "b",
        岳掌门在哪一章: "a",
        云九天是哪个门派的师傅: "c",
        云问天在哪一章: "a",
        在洛阳萧问天那可以学习什么心法: "b",
        在庙祝处洗杀气每次可以消除多少点: "a",
        "在哪个NPC可以购买恢复内力的药品？": "c",
        在哪个处可以更改名字: "a",
        在哪个处领取免费消费积分: "d",
        在哪个处能够升级易容术: "b",
        "在哪里可以找到“香茶”？": "a",
        在哪里捏脸提升容貌: "d",
        在哪里消杀气: "a",
        在逍遥派能学到的技能是哪个: "a",
        在雪亭镇李火狮可以学习多少级柳家拳: "b",
        在战斗界面点击哪个按钮可以进入聊天界面: "d",
        "在正邪任务中不能获得下面什么奖励？": "d",
        怎么样获得免费元宝: "a",
        赠送李铁嘴银两能够增加什么: "a",
        张教主在明教哪个场景: "d",
        张三丰在哪一章: "d",
        张三丰在武当山哪个场景: "d",
        张松溪在哪个地图: "c",
        张天师是哪个门派的师傅: "a",
        张天师在茅山哪个场景: "d",
        "长虹剑在哪位那里获得？": "a",
        "长剑在哪里可以购买？": "a",
        正邪任务杀死好人增长什么: "b",
        正邪任务一天能做几次: "a",
        正邪任务中客商的在哪个地图: "a",
        正邪任务中卖花姑娘在哪个地图: "b",
        "正邪任务最多可以完成多少个？": "d",
        支线对话书生上魁星阁二楼杀死哪个NPC给10元宝: "a",
        朱姑娘是哪个门派的师傅: "a",
        朱老伯在华山村哪个小地图: "b",
        "追风棍可以在哪位npc那里获得？": "a",
        追风棍在哪里获得: "b",
        紫宝石加什么属性: "d",
        下面哪个npc不是魔教的: "d",
        藏宝图在哪里npc那里买: "a",
        从哪个npc处进入跨服战场: "a",
        钻石项链在哪获得: "a",
        在哪个npc处能够升级易容术: "b",
        扬州询问黑狗子能到下面哪个地点: "a",
        北岳殿神像后面是哪位npc: "b",
        "兽皮鞋可以在哪位npc那里获得？": "b",
        在哪个npc处领取免费消费积分: "d",
        "踏云棍可以在哪位npc那里获得？": "a",
        "钢丝甲衣可以在哪位npc那里获得？": "d",
        "铁手镯可以在哪位npc那里获得？": "a",
        哪个npc处可以捏脸: "a",
        "草帽可以在哪位npc那里获得？": "b",
        "铁戒指可以在哪位npc那里获得？": "a",
        "银项链可以在哪位npc那里获得？": "b",
        在哪个npc处可以更改名字: "a",
        "宝玉帽可以在哪位npc那里获得？": "d",
        论剑中以下哪个不是晚月庄的技能: "d",
        "精铁棒可以在哪位npc那里获得？": "d",
        "弯月刀可以在哪位npc那里获得？": "b",
        藏宝图在哪个npc处购买: "b",
        宝玉鞋击杀哪个npc可以获得: "a",
        "银手镯可以在哪位npc那里获得？": "b",
        扬州在下面哪个地点的npc处可以获得玉佩: "c",
        跨服天剑谷是星期几举行的: "b",
        "长虹剑在哪位npc那里获得？": "a",
        "追风棍在哪里获得？": "b",
        "黑水伏蛟可以在哪位npc那里获得？": "c",
        跨服副本周六几点开启: "a",
        "铁手镯  可以在哪位npc那里获得？": "a",
        "首次通过桥阴县不可以获得那种奖励？": "a",
        "黯然消魂掌有多少招式？": "c",
        论剑一次最多能突破几个技能: "c",
      },
      usualList: [
        { n: "风泉之剑", v: "jh 7;s;s;s;s;s;s;s;s;e;n;e;s;e" },
        { n: "洛阳挖矿", v: "jh 2;n;n;n;n;n;n;n;n;n;n;w;w;w" },
        { n: "青竹蛇", v: "jh 2;n;n;n;n;n;n;n;n;n;e" },
        { n: "武当桃园", v: "jh 10;w;n;n;w;w;w;n;n;n;n;e;e;e;e;s;e;s;e" },
        { n: "小龙女", v: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;s;s;e;e" },
        { n: "㊖游四海", v: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;w", style: { "background-color": "#9FE" } },
        { n: "白驼去星宿", v: "jh 21;nw;w;w;nw;n;n;n;n;n;n;n;n;ne;n;" },
        { n: "峨眉大门", v: "jh 8;w;nw;n;n;n;n;e;e;n;n;e" },
        { n: "全真大门", v: "jh 19;s;s;s;sw;s;e;n;nw;n;n;n;" },
        { n: "乔阴老太婆", v: "jh 7;s;s;s;s;s;s;s;sw;w" },
        { n: "洛阳白冢", v: "jh 2;n;n;n;n;n;e;e;n;n;n;n;" },
        { n: "云梦璃", v: "jh 2;#15 n;#6 e;#14 n;event_1_95312623" },
        { n: "扬州武庙", v: "jh 5;n;n;n;n;n;n;w" },
        { n: "富春茶社", v: "jh 5;n;n;n;n;n;n;n;e;get_silver" },
        { n: "杭界山", v: "jh 2;n;n;e;s;洛陽:洛水渡口^船塢;go_hjs go;se;se;ne;w;n;" },
        { n: "浣花剑碑", v: "jh 14;sw;s;e;s;s;sw;sw;w;w;s;s;e" },
        { n: "京城赌坊", v: "rank go 195" },
        { n: "掩月千小驹", v: "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s" },
        { n: "泰山孔翎", v: "jh 24;n;n;n;n;n;n;n;n;w;n;n;n;n;n" },
        { n: "长安秦王", v: "jh 2;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;n;w;w;w;w;n;n;n;n;;n;n;n;n;n;n;n;n" },
        { n: "百晓居士", v: "jh 43;n;ne;ne;n;n;n;nw;n;ne;ne;n;n;w;nw;nw;n;n;n;n;ne;ne;nw;ne;ne;n;n;ne;e" },
        { n: "去花街", v: "rank go 170" },
        { n: "生死双修", v: "rank go 232;s;s;s;e;ne;" },
        { n: "星宿射雕", v: "jh 28;n;w;w;w;w;w;w;nw;ne;nw;ne;nw;ne;e" },
        { n: "杏花牧童", v: "rank go 184" },
        { n: "真龙隐武阁", v: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n" },
        { n: "过巨石阵", v: "s;sw;s;w;n;nw;w;sw;nw;n;" },
        { n: "天龙闲钓", v: "rank go 232;s;s;s;s;s;s" },
        { n: "天龙采茶", v: "rank go 232;s;s;s;e;ne;e;ne;ne;" },
        { n: "花街醉梦楼", v: "jh 46;e;e;e;e;e;e;e;e;n;n;n;e;e" },
        { n: "去巍山文庙", v: "jh 54;#4 nw;#2 w;#4 n;#2 e;n;#2 e;" },
        { n: "南诏左到右", v: "e;e;e;se;ne;sw;nw;e;ne;e" },
        { n: "马车去文庙", v: "jh 1;e;n;n;n;n;w;event_1_90287255 go 9;n;#5 e;#4 s;e;e;e;e;e;se;ne;sw;nw;e;ne;e;e;n;e;event_1_30634412;e;ne;e;e;s;e;e;n;e;e" },
        { n: "马车去南诏", v: "jh 1;e;n;n;n;n;w;event_1_90287255 go 9;" },
        { n: "萬福樓", v: "rank go 194;s;se;se;se;e;s;s;s;s;sw;e;e;e;e;s;s;s;e;e;s" },
      ],
      pathCmds: { e: "go east", s: "go south", w: "go west", n: "go north", se: "go southeast", sw: "go southwest", ne: "go northeast", nw: "go northwest" },
      cityList: [
        "雪亭鎮",
        "洛陽",
        "華山村",
        "華山",
        "揚州",
        "丐幫",
        "喬陰縣",
        "峨眉山",
        "恆山",
        "武當山",
        "晚月莊",
        "水煙閣",
        "少林寺",
        "唐門",
        "青城山",
        "逍遙林",
        "開封",
        "光明頂",
        "全真教",
        "古墓",
        "白馱山",
        "嵩山",
        "梅莊",
        "泰山",
        "鐵血大旗門",
        "大昭寺",
        "黑木崖",
        "星宿海",
        "茅山",
        "桃花島",
        "鐵雪山莊",
        "慕容山莊",
        "大理",
        "斷劍山莊",
        "冰火島",
        "俠客島",
        "絕情谷",
        "碧海山莊",
        "天山",
        "苗疆",
        "白帝城",
        "墨家機關城",
        "掩月城",
        "海雲閣",
        "幽冥山莊",
        "花街",
        "西涼城",
        "高昌迷宮",
        "京城",
        "越王劍宮",
        "江陵",
        "天龍寺",
        "西夏",
        "南詔國",
      ],
      cityId: {
        baidicheng: "白帝城",
        baituo: "白馱山",
        baizhong: "洛陽",
        banruotang: "少林寺",
        beiyinxiang: "洛陽",
        bihaishanzhuang: "碧海山莊",
        binghuo: "冰火島",
        changan: "洛陽",
        choyin: "喬陰縣",
        dali: "大理",
        duanjian: "斷劍山莊",
        emei: "峨眉山",
        gaibang: "丐幫",
        gaochangmigong: "高昌迷宮",
        guanwai: "大昭寺",
        gumu: "古墓",
        haiyunge: "海雲閣",
        heilongtan: "泰山",
        heimuya: "魔教",
        henshan: "恆山",
        huajie: "花街",
        huashan: "華山",
        huashancun: "華山村",
        hudidinao: "寒梅莊",
        jiangling: "江陵",
        jingcheng: "京城",
        jishanlvgu: "嵩山",
        jueqinggu: "絕情谷",
        kaifeng: "開封",
        latemoon: "晚月莊",
        luohantang: "少林寺",
        luoyang: "洛陽",
        luoyanya: "華山",
        meizhuang: "寒梅莊",
        miaojiang: "苗疆",
        mingjiao: "光明頂",
        mojiajiguancheng: "墨家機關城",
        moyundong: "嵩山",
        murong: "慕容山莊",
        qingcheng: "青城山",
        qingfengzhai: "華山村",
        qinqitai: "恆山",
        quanzhen: "全真教",
        resort: "鐵雪山莊",
        shaolin: "少林寺",
        snow: "雪亭鎮",
        songshan: "嵩山",
        taishan: "泰山",
        tangmen: "唐門",
        taoguan: "茅山",
        taohua: "桃花島",
        tianlongsi: "天龍寺",
        tianshan: "天山",
        tianshengxia: "華山",
        tianshengzhai: "泰山",
        tieflag: "大旗門",
        tudimiao: "華山村",
        waterfog: "水煙閣",
        wudang: "武當山",
        wuguan: "揚州",
        wuqiku: "華山",
        xiakedao: "俠客島",
        xiaoyao: "逍遙林",
        xiliangcheng: "西涼城",
        xinglinxiaoyuan: "寒梅莊",
        xingxiu: "星宿海",
        yangzhou: "揚州",
        yangzhouguanya: "揚州",
        yanyuecheng: "掩月城",
        yezhulin: "開封",
        yingoudufang: "洛陽",
        yuewangjiangong: "越王劍宮",
        yuhuangding: "泰山",
        yuwangtai: "開封",
        zizhiyu: "恆山",
        zuixianlou: "揚州",
      },
      qlList: [
        { n: "書房", v: "jh 1;e;n;e;e;e;e;n" },
        { n: "打鐵鋪子", v: "jh 1;e;n;n;w" },
        { n: "桑鄰藥鋪", v: "jh 1;e;n;n;n;w" },
        { n: "南市", v: "jh 2;n;n;e" },
        { n: "繡樓", v: "jh 2;n;n;n;n;w;s;w" },
        { n: "北大街", v: "jh 2;n;n;n;n;n;n;n" },
        { n: "錢莊", v: "jh 2;n;n;n;n;n;n;n;e" },
        { n: "雜貨鋪", v: "jh 3;s;s;e" },
        { n: "祠堂大門", v: "jh 3;s;s;w" },
        { n: "廳堂", v: "jh 3;s;s;w;n" },
      ],
      mjList: [
        { n: "山坳", v: "jh 1;e;n;n;n;n;n;" },
        { n: "桃花泉", v: "jh 3;s;s;s;s;s;nw;n;n;e" },
        { n: "千尺幢", v: "jh 4;n;n;n;n" },
        { n: "猢猻愁", v: "jh 4;n;n;n;n;n;n;e;n;n;" },
        { n: "潭畔草地", v: "jh 4;n;n;n;n;n;n;n;event_1_91604710;s;s;s" },
        { n: "玉女峰", v: "jh 4;n;n;n;n;n;n;n;n;w" },
        { n: "長空棧道", v: "jh 4;n;n;n;n;n;n;n;n;n;e" },
        { n: "臨淵石台", v: "jh 4;n;n;n;n;n;n;n;n;n;e;n;" },
        { n: "沙丘小洞", v: "jh 6;event_1_98623439;ne;n;#3 ne;event_1_97428251;" },
        { n: "九老洞", v: "jh 8;w;nw;#4 n;e;e;n;n;e;kill emei_shoushan;#4 n;w;#9 n;nw;sw;w;nw;w" },
        { n: "懸根松", v: "jh 9;n;w" },
        { n: "夕陽嶺", v: "jh 9;n;n;e" },
        { n: "青雲坪", v: "jh 13;e;s;s;w;w" },
        { n: "玉壁瀑布", v: "jh 16;s;s;s;s;e;n;e" },
        { n: "湖邊", v: "jh 16;s;s;s;s;e;n;e;event_1_5221690;s;w" },
        { n: "碧水寒潭", v: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;e;e;se;se;e" },
        { n: "寒水潭", v: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;e;se;" },
        { n: "懸崖", v: "jh 20;w;w;s;e;s;s;s;s;s;sw;sw;s;s;e" },
        { n: "戈壁", v: "jh 21;" },
        { n: "盧崖瀑布", v: "jh 22;n;n;n;n;e;n" },
        { n: "啟母石", v: "jh 22;n;n;w;w" },
        { n: "無極老姆洞", v: "jh 22;n;n;w;n;n;n;n;" },
        { n: "山溪畔", v: "jh 22;n;n;w;n;n;n;n;event_1_88705407;s;s" },
        { n: "奇槐坡", v: "jh 23;n;n;n;n;n;n;n;n;" },
        { n: "天梯", v: "jh 24;n;n;n;" },
        { n: "小洞天", v: "jh 24;n;n;n;n;e;e" },
        { n: "雲步橋", v: "jh 24;n;n;n;n;n;n;n;n;n;" },
        { n: "觀景台", v: "jh 24;n;n;n;n;n;n;n;n;n;n;n;n;e;e;n;" },
        { n: "危崖前", v: "jh 25;w" },
        { n: "草原", v: "jh 26;w" },
        { n: "無名山峽谷", v: "jh 29;n;n;n;n;event_1_60035830;place?平台;event_1_65661209;place?無名山峽谷;" },
      ],
      prizeList: [
        [
          "明月鞋",
          "月光寶甲衣",
          "明月戒",
          "明月帽",
          "明月項鍊",
          "明月手鐲",
          "屠龍刀",
          "倚天劍",
          "冰魄銀針",
          "墨玄掌套",
          "碧磷鞭",
          "烈日棍",
          "西毒蛇杖",
          "星月大斧",
          "碧玉錘",
          "霸王槍",
        ],
        [
          "烈日寶靴",
          "日光寶甲衣",
          "烈日寶戒",
          "烈日帽",
          "烈日寶鏈",
          "烈日寶鐲",
          "斬神刀",
          "誅仙劍",
          "暴雨梨花針",
          "龍象拳套",
          "七星鞭",
          "殘陽棍",
          "伏虎杖",
          "破冥斧",
          "撼魂錘",
          "赤焰槍",
        ],
        [
          "斬龍寶靴",
          "龍皮至尊甲衣",
          "斬龍寶戒",
          "斬龍帽",
          "斬龍寶鏈",
          "斬龍寶鐲",
          "飛宇天怒刀",
          "九天龍吟劍",
          "小李飛刀",
          "天罡掌套",
          "烏金玄火鞭",
          "開天寶棍",
          "達摩杖",
          "天雷斷龍斧",
          "燭幽鬼煞錘",
          "斬龍鎏金槍",
        ],
        [
          "君影草",
          "矢車菊",
          "忘憂草",
          "仙客來",
          "雪英",
          "朝開暮落花",
          "夕霧草",
          "鳳凰木",
          "熙顏花",
          "晚香玉",
          "淩霄花",
          "彼岸花",
          "洛神花",
          "百宜雪梅",
          "胤天寶帽碎片",
          "胤天項鍊碎片",
          "胤天寶戒碎片",
          "魚腸碎片",
          "軒轅劍碎片",
          "破嶽拳套碎片",
          "胤天寶鐲碎片",
          "胤天寶靴碎片",
          "胤天紫金衣碎片",
          "昊天龍旋鎧碎片",
          "水羽雲裳碎片",
          "奉天金帶碎片",
          "鳳羽乾坤盾碎片",
          "玄冰凝魄槍碎片",
          "雷霆誅神刀碎片",
          "天雨玄鏢碎片",
          "天神杖碎片",
          "轟天巨棍碎片",
          "神龍怒火鞭碎片",
          "胤武伏魔斧碎片",
          "九天滅世錘碎片",
        ],
      ],
      masterList: [
        { n: _("九阴", "九陰"), in: "九陰派", npc: ["梅師姐", "鐵屍"] },
        { n: _("白驼", "白馱"), in: "白馱山派", npc: ["門衛", "白馱山@管家", "白鶴軒", "白厲峰"] },
        { n: _("唐门", "唐門"), in: "唐門", npc: ["歐陽敏"] },
        { n: "魔教", in: "魔教", npc: ["見錢開", "上官雲", "夏侯京", "楊延慶", "葵花傳人"] },
        { n: "青城", in: "青城派", npc: ["吉人英", "黃袍老道", "呂朝陽", "林長老"] },
        { n: "星宿", in: "天宿派", npc: ["天宿老怪"] },
        { n: "天邪", in: "天邪派", npc: ["於蘭天武"] },
        { n: "大招", in: "大招寺", npc: ["葛倫"] },
        { n: "晚月", in: "晚月莊", npc: ["璦倫"] },
        { n: "花紫", in: "花紫會", npc: ["陸得財"] },
        { n: "少林", in: "少林派", npc: ["清為比丘", "達摩老祖"] },
        { n: _("华山", "華山"), in: "華山派", npc: ["獨孤傳人"] },
        { n: "大理", in: "大理段家", npc: ["段氏南僧"] },
        { n: "武当", in: "武當派", npc: ["張三豐"] },
        { n: "铁旗", in: "大旗門", npc: ["鐵雍華"] },
        { n: "明教", in: "明教", npc: ["楊塬", "冷臉先生", "季燕青", "梁風", "仇畢烈", "九陽君"] },
        { n: "全真", in: "全真派", npc: ["老頑童"] },
        { n: "丐帮", in: "丐幫", npc: ["尚鋤姦"] },
        { n: "峨嵋", in: "峨嵋派", npc: ["通星師太"] },
        { n: "步玄", in: "步玄派", npc: ["駱雲舟"] },
        { n: "逍遥", in: "逍遙派", npc: ["童冰煙"] },
        { n: "慕容", in: "慕容世家", npc: ["燕浩宇"] },
        { n: "古墓", in: "古墓派", npc: ["過必修"] },
        { n: "桃花", in: "桃花島", npc: ["李奇門"] },
        { n: "茅山", in: "茅山派", npc: ["張天師"] },
        { n: "铁雪", in: "鐵雪山莊", npc: ["鐵少", "雪蕊兒"] },
        { n: "封山", in: "封山劍派", npc: ["柳淳風"] },
        { n: "断剑", in: "斷劍山莊", npc: ["劍魔求敗"] },
        { n: "风花", in: "風花牧場", npc: ["宋喉"] },
        { n: "天波", in: "天波楊門", npc: ["楊延昭"] },
        { n: "燕云", in: "燕雲世家", npc: ["耶律楚哥"] },
        { n: "西夏", in: "西夏堂", npc: ["嵬名元昊"] },
        { n: "自动出师", v: "eval_PLU.autoChushi()" },
      ],
      gemPrefix: ["碎裂的", "裂開的", "", "無暇的", "完美的", "君王的", "皇帝的", "天神的"],
      gemType: [
        { name: "紅寶石", key: "hongbaoshi", color: "#F00" },
        { name: "黃寶石", key: "huangbaoshi", color: "#FA0" },
        { name: "綠寶石", key: "lvbaoshi", color: "#0C0" },
        { name: "藍寶石", key: "lanbaoshi", color: "#00F" },
        { name: "紫寶石", key: "zishuijing", color: "#F0F" },
      ],
      qixiaList: [
        "宇文無敵",
        "李玄霸",
        "夏嶽卿",
        "玄月研",
        "穆妙羽",
        "烈九州",
        "厲滄若",
        "八部龍將",
        "妙無心",
        "巫夜姬",
        "狼居胥",
        "風行騅",
        "風無痕",
        "吳縝",
        "狐蒼雁",
        "護竺",
        "李宇飛",
        "龐統",
        "逆風舞",
        "王蓉",
        "浪喚雨",
        "火雲邪神",
        "風南",
        "郭濟",
        "步驚鴻",
      ],
      qixiaFriend: [
        { name: "宇文無敵", skillFN: 40000 },
        { name: "李玄霸", skillFN: 40000 },
        { name: "夏嶽卿", skillFN: 40000 },
        { name: "玄月研", skillFN: 40000 },
        { name: "穆妙羽", skillFN: 40000 },
        { name: "烈九州", skillFN: 40000 },
        { name: "厲滄若", skillFN: 40000 },
        { name: "八部龍將", skillFN: 40000 },
        { name: "妙無心", skillFN: 40000 },
        { name: "巫夜姬", skillFN: 40000 },
        { name: "狼居胥", skillFN: 40000 },
        { name: "風行騅", skillFN: 40000 },
        { name: "風無痕", skillFN: 40000 },
        { name: "吳縝", skillFN: 40000 },
        { name: "狐蒼雁", skillFN: 35000 },
        { name: "護竺", skillFN: 35000 },
        { name: "李宇飛", skillFN: 25000 },
        { name: "龐統", skillFN: 25000 },
        { name: "逆風舞", skillFN: 25000 },
        { name: "王蓉", skillFN: 25000 },
        { name: "浪喚雨", skillFN: 25000 },
        { name: "火雲邪神", skillFN: 25000 },
        { name: "風南", skillFN: 25000 },
        { name: "郭濟", skillFN: 25000 },
        { name: "步驚鴻", skillFN: 25000 },
      ],
      youxiaList: [
        {
          n: "門客",
          v: [
            "王語嫣",
            "範蠡",
            "程靈素",
            "水靈光",
            "霍青桐",
            "石青璇",
            "李紅袖",
            "宋玉緻",
            "華佗",
            "魯妙子",
            "顧倩兮",
            "水笙",
            "林仙兒",
            "郭襄",
            "程瑛",
            "任盈盈",
            "阿朱",
            "袁紫衣",
            "趙敏",
            "小昭",
            "韋小寶",
          ],
        },
        { n: "邪武", v: ["林遠圖", "厲工", "金輪法王", "鳩摩智", "上官金虹", "封寒", "卓淩昭", "厲若海", "乾羅", "孫恩", "婠婠", "練霓裳", "成昆", "侯希白", "夜魔"] },
        {
          n: "俠客",
          v: ["0柯鎮惡", "哈瑪雅", "喬峰", "盧雲", "虛竹", "徐子陵", "虛夜月", "雲夢璃", "花無缺", "風行烈", "黃藥師", "洪七公", "石破天", "寧不凡", "獨孤求敗"],
        },
        { n: "魔尊", v: ["龐斑", "楊肅觀", "歐陽鋒", "葉孤城", "燕狂徒"] },
        { n: "宗師", v: ["宋缺", "逍遙子", "李尋歡", "令東來", "楚留香"] },
      ],
      youxiaSkillMap: [
        {
          skill: "長春不老功",
          name: "逍遙子",
          kind: "宗師",
          type: "內功",
          pre: [
            { skill: "龍象般若功", name: "金輪法王", kind: "邪武", type: "內功", lvl: 40 },
            { skill: "紫血大法", name: "厲工", kind: "邪武", type: "內功", lvl: 40 },
          ],
        },
        {
          skill: "九陰逆",
          name: "歐陽鋒",
          kind: "魔尊",
          type: "內功",
          pre: [
            { skill: "白首太玄經", name: "石破天", kind: "俠客", type: "內功", lvl: 40 },
            { skill: "彈指神通", name: "黃藥師", kind: "俠客", type: "掌法", lvl: 40 },
          ],
        },
        {
          skill: "鳳舞九天",
          name: "宮九",
          kind: "魔尊",
          type: "輕功",
          pre: [
            { skill: "天魔妙舞", name: "婠婠", kind: "邪武", type: "輕功", lvl: 120 },
            { skill: "雲夢歸月", name: "雲夢璃", kind: "俠客", type: "輕功", lvl: 120 },
            { skill: "飛鴻鞭法", name: "哈瑪雅", kind: "俠客", type: "鞭法", lvl: 120 },
            {
              skill: "踏月留香",
              name: "楚留香",
              kind: "宗師",
              type: "輕功",
              lvl: 120,
              pre: [
                { skill: "天魔妙舞", name: "婠婠", kind: "邪武", type: "輕功", lvl: 40 },
                { skill: "雲夢歸月", name: "雲夢璃", kind: "俠客", type: "輕功", lvl: 40 },
                { skill: "降魔杖法", name: "0柯鎮惡", kind: "俠客", type: "杖法", lvl: 40 },
                { skill: "飛鴻鞭法", name: "哈瑪雅", kind: "俠客", type: "鞭法", lvl: 40 },
              ],
            },
          ],
        },
        {
          skill: "無劍之劍",
          name: "白雲天",
          kind: "宗師",
          type: "劍法",
          pre: [
            { skill: "天魔妙舞", name: "婠婠", kind: "邪武", type: "輕功", lvl: 120 },
            { skill: "神劍慧芒", name: "卓淩昭", kind: "邪武", type: "劍法", lvl: 120 },
            { skill: "不凡三劍", name: "寧不凡", kind: "俠客", type: "劍法", lvl: 120 },
            {
              skill: "天外飛仙",
              name: "葉孤城",
              kind: "魔尊",
              type: "劍法",
              lvl: 120,
              pre: [
                { skill: "紫虛辟邪劍", name: "林遠圖", kind: "邪武", type: "劍法", lvl: 40 },
                { skill: "神劍慧芒", name: "卓淩昭", kind: "邪武", type: "劍法", lvl: 40 },
                { skill: "不凡三劍", name: "寧不凡", kind: "俠客", type: "劍法", lvl: 40 },
              ],
            },
          ],
        },
        {
          skill: "披羅紫氣",
          name: "伍定遠",
          kind: "宗師",
          type: "掌法",
          pre: [
            { skill: "雲夢歸月", name: "雲夢璃", kind: "俠客", type: "輕功", lvl: 120 },
            { skill: "降龍廿八掌", name: "喬峰", kind: "俠客", type: "掌法", lvl: 120 },
            { skill: "彈指神通", name: "黃藥師", kind: "俠客", type: "掌法", lvl: 120 },
            {
              skill: "天魔策",
              name: "龐斑",
              kind: "魔尊",
              type: "掌法",
              lvl: 120,
              pre: [
                { skill: "降龍廿八掌", name: "喬峰", kind: "俠客", type: "掌法", lvl: 40 },
                { skill: "無相六陽掌", name: "虛竹", kind: "俠客", type: "掌法", lvl: 40 },
                { skill: "折花百式", name: "侯希白", kind: "邪武", type: "掌法", lvl: 40 },
                { skill: "釋迦拈花指", name: "鳩摩智", kind: "邪武", type: "掌法", lvl: 40 },
              ],
            },
          ],
        },
        {
          skill: "火貪一刀",
          name: "方子敬",
          kind: "魔尊",
          type: "刀法",
          pre: [
            { skill: "天魔妙舞", name: "婠婠", kind: "邪武", type: "輕功", lvl: 120 },
            { skill: "左手刀法", name: "封寒", kind: "邪武", type: "刀法", lvl: 120 },
            { skill: "移花接玉刀", name: "花無缺", kind: "俠客", type: "刀法", lvl: 120 },
            {
              skill: "天刀八訣",
              name: "宋缺",
              kind: "宗師",
              type: "刀法",
              lvl: 120,
              pre: [
                { skill: "左手刀法", name: "封寒", kind: "邪武", type: "刀法", lvl: 40 },
                { skill: "移花接玉刀", name: "花無缺", kind: "俠客", type: "刀法", lvl: 40 },
              ],
            },
          ],
        },
        {
          skill: "天雷落",
          name: "石剛",
          kind: "魔尊",
          type: "暗器",
          pre: [
            { skill: "雲夢歸月", name: "雲夢璃", kind: "俠客", type: "輕功", lvl: 120 },
            { skill: "九字真言印", name: "徐子陵", kind: "俠客", type: "暗器", lvl: 120 },
            { skill: "九星定形針", name: "練霓裳", kind: "邪武", type: "暗器", lvl: 120 },
            {
              skill: "小李飛刀",
              name: "李尋歡",
              kind: "宗師",
              type: "暗器",
              lvl: 120,
              pre: [
                { skill: "九字真言印", name: "徐子陵", kind: "俠客", type: "暗器", lvl: 40 },
                { skill: "九星定形針", name: "練霓裳", kind: "邪武", type: "暗器", lvl: 40 },
                { skill: "子母龍鳳環", name: "上官金虹", kind: "邪武", type: "暗器", lvl: 40 },
              ],
            },
          ],
        },
        {
          skill: "孤帆鞭影",
          name: "陸孤瞻",
          kind: "魔尊",
          type: "鞭法",
          pre: [
            { skill: "彈指神通", name: "黃藥師", kind: "俠客", type: "掌法", lvl: 120 },
            { skill: "降魔杖法", name: "0柯鎮惡", kind: "俠客", type: "杖法", lvl: 120 },
            { skill: "飛鴻鞭法", name: "哈瑪雅", kind: "俠客", type: "鞭法", lvl: 120 },
            { skill: "冰玄鞭法", name: "乾羅", kind: "邪武", type: "鞭法", lvl: 120 },
          ],
        },
        {
          skill: "無雙連錘",
          name: "瓦耳拉齊",
          kind: "魔尊",
          type: "錘法",
          pre: [
            { skill: "游龍劍", name: "孫恩", kind: "邪武", type: "劍法", lvl: 120 },
            { skill: "幻陰指錘", name: "成昆", kind: "邪武", type: "錘法", lvl: 120 },
            { skill: "正道十七", name: "盧雲", kind: "俠客", type: "錘法", lvl: 120 },
            {
              skill: "玉石俱焚",
              name: "燕狂徒",
              kind: "魔尊",
              type: "錘法",
              lvl: 120,
              pre: [
                { skill: "幻陰指錘", name: "成昆", kind: "邪武", type: "錘法", lvl: 40 },
                { skill: "正道十七", name: "盧雲", kind: "俠客", type: "錘法", lvl: 40 },
              ],
            },
          ],
        },
        {
          skill: "暗山神斧",
          name: "0六先生",
          kind: "魔尊",
          type: "斧法",
          pre: [
            { skill: "雲夢歸月", name: "雲夢璃", kind: "俠客", type: "輕功", lvl: 120 },
            { skill: "彈指神通", name: "黃藥師", kind: "俠客", type: "掌法", lvl: 120 },
            { skill: "降魔杖法", name: "0柯鎮惡", kind: "俠客", type: "杖法", lvl: 120 },
            { skill: "獨孤斧訣", name: "獨孤求敗", kind: "俠客", type: "斧法", lvl: 120 },
          ],
        },
        {
          skill: "六道輪迴",
          name: "楊肅觀",
          kind: "魔尊",
          type: "斧法",
          pre: [
            { skill: "天魔妙舞", name: "婠婠", kind: "邪武", type: "輕功", lvl: 40 },
            { skill: "青冥血斧", name: "夜魔", kind: "邪武", type: "斧法", lvl: 40 },
            { skill: "獨孤斧訣", name: "獨孤求敗", kind: "俠客", type: "斧法", lvl: 40 },
          ],
        },
        {
          skill: "溫候戟舞",
          name: "韓毅",
          kind: "魔尊",
          type: "槍法",
          pre: [
            { skill: "彈指神通", name: "黃藥師", kind: "俠客", type: "掌法", lvl: 120 },
            { skill: "冰月破魔槍", name: "風行烈", kind: "俠客", type: "槍法", lvl: 120 },
            { skill: "燎原百擊", name: "厲若海", kind: "邪武", type: "槍法", lvl: 120 },
            {
              skill: "神龍東來",
              name: "令東來",
              kind: "宗師",
              type: "槍法",
              lvl: 120,
              pre: [
                { skill: "冰月破魔槍", name: "風行烈", kind: "俠客", type: "槍法", lvl: 40 },
                { skill: "燎原百擊", name: "厲若海", kind: "邪武", type: "槍法", lvl: 40 },
                { skill: "月夜鬼蕭", name: "虛夜月", kind: "俠客", type: "棍法", lvl: 40 },
              ],
            },
          ],
        },
      ],
    };

    let waitGameSI = setInterval(() => {
      if (g_obj_map && g_obj_map.get("msg_attrs")) {
        clearInterval(waitGameSI);
        PLU.init();
      }
    }, 500);
  }

  // 本地化
  function _(c, t) {
    return navigator.language == "zh-CN" || !t ? c : t;
  }

  class Base64 {
    constructor() {
      let Encoder = new TextEncoder();
      let Decoder = new TextDecoder();
      this.encode = (s) => btoa(Array.from(Encoder.encode(s), (x) => String.fromCodePoint(x)).join(""));
      this.decode = (s) => Decoder.decode(Uint8Array.from(atob(s), (m) => m.codePointAt(0)));
    }
  }
  function attach() {
    let oldWriteToScreen = unsafeWindow.writeToScreen;
    unsafeWindow.writeToScreen = function (a, e, f, g) {
      if (PLU.developerMode) console.debug(a);
      if (e == 2 && a.indexOf("find_task_road") != -1) {
        a = a.replace(/find_task_road3/g, "find_task_road2");
        var puzzleItems = a.split("<br/><br/>");
        var puzzleid = "";
        for (var i = 0; i < puzzleItems.length; i++) {
          if (puzzleItems[i].indexOf("find_task_road") == -1) {
            continue;
          }
          puzzleid = PLU.autoPuzzle.analyzePuzzle(puzzleItems[i]);
          if (PLU.getCache("listenPuzzle") && PLU.TMP.puzzleWating?.puzzleid != puzzleid) {
            if (PLU.getCache("puzzleTimeOut"))
              PLU.TMP.puzzleTimeOut = setTimeout(() => {
                PLU.TMP.puzzleList[puzzleid] = undefined;
                PLU.execActions("home");
              }, PLU.getCache("puzzleTimeOut") * 1000);
            PLU.autoPuzzle.startpuzzle(puzzleid);
          }
          if (puzzleItems[i].indexOf('javascript:go1("cus|startpuzzle|') == -1)
            puzzleItems[i] += " <a class='go-btn' href='javascript:PLU.autoPuzzle.startpuzzle(\"" + puzzleid + "\")'>【GO】</a>";
          else puzzleItems[i] = puzzleItems[i].replace('javascript:go1("cus|startpuzzle|', 'javascript:PLU.autoPuzzle.startpuzzle("');
          if (PLU.TMP.puzzleWating && puzzleid == PLU.TMP.puzzleWating.puzzleid && puzzleItems[i].indexOf("謎題") == -1) {
            PLU.autoPuzzle.startpuzzle(puzzleid);
          }
        }
        a = puzzleItems.join("<br/><br/>");
      } else if (PLU.TMP.puzzleWating) {
        if (e == 2 && a.indexOf("不接受你給的東西。") > -1 && PLU.TMP.puzzleWating.puzzleid && PLU.TMP.puzzleWating.status == "give") {
          PLU.TMP.puzzleWating.waitCount--;
          if (PLU.TMP.puzzleWating.waitCount <= 0) {
            clearTimeout(PLU.TMP.puzzleWating.waitTimer);
            PLU.TMP.puzzleWating.status = "trace";
            PLU.execActions("find_task_road " + PLU.TMP.puzzleWating.puzzleid);
          }
        } else if (
          e == 2 &&
          PLU.TMP.puzzleWating.puzzleid &&
          (PLU.TMP.puzzleWating.status == "wait" || PLU.TMP.puzzleWating.status == "traced") &&
          PLU.TMP.puzzleWating.action == "get" &&
          (a.indexOf("你撿起") > -1 || /你從.*的屍體裏搜出.*。/.test(a) || /你用.*向.*買下.*。/.test(a)) &&
          a.indexOf(PLU.TMP.puzzleWating.target) > -1
        ) {
          PLU.TMP.puzzleWating = {
            puzzleid: PLU.TMP.puzzleWating.puzzleid,
            action: "get",
            actionCode: "give",
            target: PLU.TMP.puzzleList[PLU.TMP.puzzleWating.puzzleid].publisherName,
            status: "return",
          };
          PLU.execActions("find_task_road2 " + PLU.TMP.puzzleWating.puzzleid);
        } else if (e == 2 && a.indexOf("我就不給，你又能怎樣？") > -1 && PLU.TMP.puzzleWating.puzzleid && PLU.TMP.puzzleWating.actionCode == "fight") {
          PLU.autoPuzzle.doPuzzle(PLU.TMP.puzzleWating.puzzleid);
        } else if (e == 2 && PLU.TMP.puzzleWating.puzzleid && /完成謎題\((\d+)\/\d+\)：(.*)的謎題\S*\s*\S*x(\d+)\s*\S*x\d+\s*\S*銀兩x(\d{1,})/.test(a)) {
          clearTimeout(PLU.TMP.puzzleTimeOut);
          if (PLU.getCache("listenPuzzle") && !PLU.TMP.autoscan) {
            PLU.execActions("home");
            return;
          }
          var puzzleFinish = /完成謎題\((\d+)\/\d+\)：(.*)的謎題\S*\s*\S*x(\d+)\s*\S*x\d+\s*\S*銀兩x(\d{1,})/.exec(a);
          puzzleFinish[2] = puzzleFinish[2].replace(/^<\/span>/, "").replace(//g, "");
          if (puzzleFinish[2] == PLU.TMP.puzzleList[PLU.TMP.puzzleWating.puzzleid].firstPublisherName) {
            PLU.TMP.puzzleList[PLU.TMP.puzzleWating.puzzleid].prize = puzzleFinish[0].replace(/<\/?span[^>]*>/g, "").replace(/<br\/>/g, "\n");
            if (+puzzleFinish[4] > 1800) {
              a +=
                "<br><button onClick='PLU.autoPuzzle.puzzlesubmit(\"" +
                PLU.TMP.puzzleWating.puzzleid +
                "\");' style='background: #FF6B00; color: #fff; margin: 5px;'>【發佈】</button>";
              if (PLU.TMP.autoscan) PLU.autoPuzzle.puzzlesubmit(PLU.TMP.puzzleWating.puzzleid);
            }
            if (a.indexOf("當前謎題密碼") >= 0) {
              var mimatext = a.split("當前謎題密碼：")[1].split("<")[0];
              if ((localStorage.getItem("masterAcc") || PLU.accId) == PLU.accId) {
                a +=
                  "<button onClick='PLU.execActions(\"jh 1;e;n;n;n;n;w;event_1_65953349 " +
                  mimatext +
                  ";home\")' style='background: #FF6B00; color: #fff; margin: 5px;'>【交密碼】</button>";
              } else {
                a +=
                  "<button onClick='PLU.execActions(\"tell u" +
                  localStorage.getItem("masterAcc") +
                  " 謎題密碼： " +
                  mimatext +
                  "\")' style='background: #FF6B00; color: #fff; margin: 5px;'>【交密碼】</button>";
              }
            }
            PLU.TMP.puzzleWating = {};
            if (PLU.TMP.autoscan) {
              PLU.TMP.index++;
              PLU.TMP.func();
            }
          }
        }
      }
      oldWriteToScreen(a, e, f, g);
    };
  }
  //=================================================================================
  // UTIL模組
  //=================================================================================
  unsafeWindow.PLU = {
    version: GM_info.script.version + "(v2.72.0622.01)",
    accId: null,
    nickName: null,
    battleData: null,
    MPFZ: {},
    TODO: [], //待辦列表
    STO: {},
    SIT: {},
    ONOFF: {},
    STATUS: {
      inBattle: 0,
      isBusy: 0,
    },
    CACHE: {
      autoDZ: 1,
      autoHYC: 1,
      auto9H: 1,
      autoLX: 1,
      autoBF: 1,
      autoB6: 1,
      autoB5F: 1,
      autoDY: 0,
      develop: 0,
      puzzleTimeOut: 60,
    },
    FLK: null,
    TMP: { autotask: false, iBatchAskModel: 0 },
    logHtml: "",
    signInMaps: null,
    //================================================================================================
    init() {
      this.accId = UTIL.getAccId();
      this.developerMode =
        (UTIL.getMem("CACHE") && JSON.parse(UTIL.getMem("CACHE")).developer) || ["8429379(1)", "8432668(1)", "8432667(1)", "8432616(1)"].includes(this.accId);
      if (this.developerMode) {
        this.GM_info = GM_info;
        UTIL.addSysListener("developer", (b, type, subtype, msg) => {
          if (type && type == "attrs_changed") return;
          if (type && type == "channel" && subtype == "rumor") return;
          console.log(b);
        });
      }
      this.initMenu();
      this.initTickTime();
      this.initStorage();
      this.initHistory();
      this.initSocketMsgEvent();
      this.initVersion();

      addEventListener("keydown", (key) => {
        if (key.altKey || key.ctrlKey || key.metaKey || key.shiftKey) return; // 不考慮組合鍵
        if (document.activeElement && document.activeElement.tagName == "INPUT") return;
        switch (key.keyCode) {
          case 81: // q
            clickButton("nw");
            break;
          case 87: // w
            clickButton("n");
            break;
          case 69: // e
            clickButton("ne");
            break;
          case 65: // a
            clickButton("w");
            break;
          case 83: // s
            clickButton("s");
            break;
          case 68: // d
            clickButton("e");
            break;
          case 90: // z
            clickButton("sw");
            break;
          case 67: // c
            clickButton("se");
            break;
        }
      });
    },

    //================================================================================================
    initVersion() {
      this.nickName = g_obj_map.get("msg_attrs").get("name");
      YFUI.writeToOut(
        `<span style='color:yellow;'>
        +===========================+
        ${_("脚本名称: 无剑Mud辅助", "腳本名稱：無劍Mud輔助")}
        ${_("脚本开发", "腳本開發")}：燕飞,東方鳴
        ${_("脚本版本：", "腳本版本：")}${this.version}
        ${_("当前角色：", "當前角色：")}${this.nickName}${this.developerMode ? _("（已开启开发者模式）", "（已開啓開發者模式）") : ""}
        角 色 ID ：${this.accId}
        +===========================+</span>`,
      );
      YFUI.writeToOut("<span style='color:#FFF;'>" + _("监听设定", "監聽設定") + ":</span>");
      let autosets = "";
      if (PLU.getCache("autoDZ") == 1) autosets += _("连续打坐，", "連續打坐, ");
      if (PLU.getCache("autoHYC") == 1) autosets += _("连续睡床，", "連續睡床, ");
      if (PLU.getCache("auto9H") == 1) autosets += _("持续九花，", "持續九花，");
      if (PLU.getCache("autoDY") == 1) autosets += _("持续钓鱼，", "持續釣魚，");
      if (PLU.getCache("autoLX") == 1) autosets += _("连续练习，", "連續練習, ");
      if (PLU.getCache("autoBF") == 1) autosets += _("加入帮四，", "加入幫四, ");
      if (PLU.getCache("autoB6") == 1) autosets += _("加入帮六，", "加入幫六, ");
      if (PLU.getCache("autoB5F") == 1) autosets += _("帮五跟杀，", "幫五跟殺, ");
      if (PLU.getCache("listenPuzzle") == 1) autosets += _("暴击谜题，", "暴擊謎題, ");
      YFUI.writeToOut("<span style='color:#CFF;'>" + autosets + "</span>");
      if (PLU.getCache("autoTP") == 1) {
        YFUI.writeToOut("<span style='color:#CFF;'>" + _("自动突破", "自動突破") + ": <span style='color:#FF9;'>" + PLU.getCache("autoTP_keys") + "</span></span>");
      }
      if (PLU.getCache("listenQL") == 1) {
        YFUI.writeToOut("<span style='color:#CFF;'>" + _("自动青龙", "自動青龍") + ": <span style='color:#FF9;'>" + PLU.getCache("listenQL_keys") + "</span></span>");
      }
      if (PLU.getCache("listenKFQL") == 1) {
        YFUI.writeToOut("<span style='color:#CFF;'>" + _("跨服青龙", "跨服青龍") + ": <span style='color:#FF9;'>" + PLU.getCache("listenKFQL_keys") + "</span></span>");
      }
      if (PLU.getCache("listenTF") == 1) {
        YFUI.writeToOut("<span style='color:#CFF;'>" + _("自动逃犯", "自動逃犯") + ": <span style='color:#FF9;'>" + PLU.getCache("listenTF_keys") + "</span></span>");
      }
      if (!g_gmain.is_fighting) {
        PLU.getSkillsList((allSkills, tupoSkills) => {
          if (tupoSkills.length > 0) {
            YFUI.writeToOut("<span style='color:white;'>突破中技能:</span>");
            let topos = "";
            tupoSkills.forEach((sk, i) => {
              topos += "<span style='color:#CCF;min-width:100px;display:inline-block;'>" + (i + 1) + " : " + sk.name + "</span>";
            });
            YFUI.writeToOut("<span style='color:#CCF;'> " + topos + "</span>");
            YFUI.writeToOut("<span style='color:yellow;'>+------------------------------+</span>");
          } else {
            YFUI.writeToOut("<span style='color:white;'>突破中技能: " + _("无", "無") + "</span>");
            YFUI.writeToOut("<span style='color:yellow;'>+------------------------------+</span>");
          }
          let lxSkill = g_obj_map.get("msg_attrs")?.get("practice_skill") || 0;
          if (lxSkill) {
            let sk = allSkills.find((s) => s.key == lxSkill);
            if (sk) {
              YFUI.writeToOut(
                "<span style='color:white;'>" + _("练习中的技能", "練習中技能") + ": <span style='color:#F0F;'>" + sk.name + "</span> (" + sk.level + ")</span>",
              );
              YFUI.writeToOut("<span style='color:yellow;'>+------------------------------+</span>");
            }
          } else {
            YFUI.writeToOut("<span style='color:white;'>" + _("练习中的技能：无", "練習中技能：無") + "</span>");
            YFUI.writeToOut("<span style='color:yellow;'>+------------------------------+</span>");
          }
        });
      }
    },
    //================================================================================================
    initSocketMsgEvent() {
      if (!gSocketMsg) {
        console.log("%c%s", "background:#C33;color:#FFF;", " ERROR:Not found gSocketMsg!! ");
        return;
      }
      gSocketMsg.YFBackupDispatchMsg = gSocketMsg.dispatchMessage;
      gSocketMsg.dispatchMessage = (b) => {
        gSocketMsg.YFBackupDispatchMsg(b);
        let type = b.get("type");
        let subtype = b.get("subtype");
        let msg = b.get("msg");
        UTIL.sysDispatchMsg(b, type, subtype, msg);
      };
      gSocketMsg.change_skill_button = function (m, is_del) {
        var m_vs_info = g_obj_map.get("msg_vs_info"),
          m2 = g_obj_map.get("msg_attrs");
        if (!m_vs_info || !m2) return 0;
        if (is_del) {
          g_obj_map.remove("skill_button" + is_del);
          return 1;
        }
        var id = this.get_combat_user_id();
        if (id != m.get("uid")) return 0;
        var pos = parseInt(m.get("pos"));
        if (pos <= 0 || pos > this._skill_btn_cnt) return 0;
        g_obj_map.put("skill_button" + pos, m);
        this.refresh_skill_button();
      };
      PLU.initListeners();
      if (unsafeWindow.clickButton) {
        PLU.Base64 = new Base64();
        var proxy_clickButton = unsafeWindow.clickButton;
        unsafeWindow.clickButton = function () {
          let args = arguments;
          if (PLU.developerMode) {
            console.log(args);
          }
          // 指令录制
          if (
            PLU.TMP.cmds &&
            !g_gmain.is_fighting &&
            ["attrs", "none", "jh", "fb", "prev_combat", "home_prompt", "jhselect", "fbselect", "send_chat"].indexOf(args[0]) < 0 &&
            args[0].indexOf("look_npc ") &&
            !args[0].match(/^(jh|fb)go /) &&
            args[0].indexOf("go_chat")
          ) {
            if (
              args[0].indexOf("go southeast.") == 0 ||
              args[0].indexOf("go southwest.") == 0 ||
              args[0].indexOf("go northeast.") == 0 ||
              args[0].indexOf("go northwest.") == 0
            )
              PLU.TMP.cmds.push(args[0][3] + args[0][8]);
            else if (args[0].indexOf("go east.") == 0 || args[0].indexOf("go west.") == 0 || args[0].indexOf("go south.") == 0 || args[0].indexOf("go north.") == 0)
              PLU.TMP.cmds.push(args[0][3]);
            else PLU.TMP.cmds.push(args[0]);
          }
          if (args[0].indexOf("ask ") == 0) {
            UTIL.addSysListener("ask", (b, type, subtype, msg) => {
              if ((type == "jh" && subtype == "info") || UTIL.inHome()) {
                UTIL.delSysListener("ask");
              }
              if (type != "main_msg" || msg.indexOf("嗯，相遇即是緣，你是練武奇才，我送點東西給你吧。") == -1) return;
              proxy_clickButton(args[0]);
              UTIL.delSysListener("ask");
            });
            setTimeout(() => {
              UTIL.delSysListener("ask");
            }, 500);
            proxy_clickButton(args[0]);
          }
          // 解除聊天屏蔽，對非腳本玩家可用
          else if (PLU.developerMode && args[0].indexOf("chat ") == 0) {
            let msg = args[0].substring(5);
            for (var PATTERN of KEYWORD_PATTERNS) msg = msg.replace(PATTERN, (s) => Array.from(s).join("\f"));
            proxy_clickButton("chat " + msg);
          }
          // 解除四海商店限制
          else if ((args[0].indexOf("reclaim recl ") == 0 || args[0].indexOf("reclaim buy ") == 0) && !args[0].match(" page ")) {
            let cmd = args[0].match(/^reclaim (recl|buy) (\d+) (go )?(.+)$/);
            if (cmd[1]) {
              let n = Number(cmd[2]);
              switch (cmd[1]) {
                case "recl":
                  for (; n > 50000; n -= 50000) {
                    proxy_clickButton(`reclaim recl 50000 go ${cmd[4]}`, 1);
                  }
                  proxy_clickButton(`reclaim recl ${n} go ${cmd[4]}`, 1);
                  break;
                case "buy":
                  for (; n > 50000; n -= 50000) {
                    proxy_clickButton(`reclaim buy 50000 go ${cmd[4]}`, 1);
                  }
                  proxy_clickButton(`reclaim buy ${n} go ${cmd[4]}`, 1);
                  break;
              }
            }
          } else {
            proxy_clickButton(...args);
          }
          if (PLU.TMP.leaderTeamSync) {
            PLU.commandTeam(args);
          }
        };
      }
    },

    //================================================================================================
    initMenu() {
      YFUI.init();
      YFUI.addBtn({
        id: "ro",
        text: _("▲隐", "▲隱"),
        style: {
          width: "30px",
          opacity: ".6",
          background: "#333",
          color: "#FFF",
          border: "1px solid #CCC",
          borderRadius: "8px 0 0 0",
        },
        onclick($btn) {
          $("#pluginMenus").toggle();
          $("#pluginMenus").is(":hidden") ? $btn.text(_("▼显", "▼顯")) : $btn.text(_("▲隐", "▲隱"));
          $(".menu").hide();
        },
      });
      YFUI.addBtnGroup({ id: "pluginMenus" });
      //Paths
      let PathsArray = [];
      PathsArray.push({
        id: "bt_home",
        groupId: "pluginMenus",
        text: _("首页", "首頁"),
        style: { background: "#FFFF99", padding: "5px 2px", width: "40px" },
        onclick(e) {
          $(".menu").hide();
          PLU.STATUS.isBusy = false;
          clickButton("home", 1);
        },
      });
      let citysArray = PLU.YFD.cityList.map((c, i) => {
        return { id: "bt_jh_" + (i + 1), text: c, extend: "jh " + (i + 1) };
      }).concat([{ id: "bt_jh_" + (PLU.YFD.cityList.length + 1), text: _("龙神遗迹", "龍神遺蹟"), extend: "jh 1;e;#4 n;w;event_1_90287255 go go_lsyj" }]);
      PathsArray.push({
        id: "bt_citys",
        text: _("地图", "地圖"),
        style: { background: "#FFE", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "240px", "margin-top": "-25px" },
        children: citysArray,
      });
      let qlArray = PLU.YFD.qlList.map((p, i) => {
        return {
          id: "bt_ql_" + (i + 1),
          text: p.n,
          extend: { func: () => PLU.execActions(PLU.minPath(PLU.queryRoomPath(), p.v)) },
          style: { "background-color": "#CFF" },
        };
      });
      if (PLU.developerMode)
        qlArray.push({
          id: "bt_ql_xunluo",
          text: _("巡逻", "巡邏"),
          extend: { func: PLU.qlxl },
          style: { "background-color": "#CFF" },
        });
      PathsArray.push({
        id: "bt_qls",
        text: _("青龙", "青龍"),
        style: { background: "#DFF", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "160px", "margin-top": "-50px" },
        children: qlArray,
      });

      let mjArray = PLU.YFD.mjList.map((p, i) => {
        return {
          id: "bt_mj_" + (i + 1),
          text: p.n,
          extend: p.v,
          style: { "background-color": "#EFD" },
        };
      });
      PathsArray.push({
        id: "bt_mjs",
        text: "秘境",
        style: { background: "#EFD", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "160px", "margin-top": "-75px" },
        children: mjArray,
      });
      PLU.autoChushi = () => {
        let family = g_obj_map.get("msg_attrs") && g_obj_map.get("msg_attrs").get("family_name");
        let master = PLU.YFD.masterList.slice(0, 32).find((e) => e.in == family);
        if (master == undefined) return;
        let npc = PLU.queryNpc("^" + master.npc.slice(-1)[0] + "$", true);
        if (!npc.length) return;
        let way = npc[0].way;
        //PLU.ONOFF["bt_kg_teamSync"] = 0;
        PLU.execActions(way, () => {
          let npc = UTIL.findRoomNpcReg("^" + master.npc.slice(-1)[0] + "$");
          if (!npc) return;
          let key = npc.key;
          PLU.execActions("apprentice " + key, () => {
            PLU.autoFight({
              targetKey: key,
              fightKind: "fight",
              autoSkill: "multi",
              onEnd() {
                PLU.execActions("chushi " + key, () => {
                  if (family == "鐵雪山莊") PLU.execActions("chushi resort_master");
                });
              },
              onFail() {
                PLU.autoFight({
                  targetKey: key,
                  fightKind: "chushi",
                  autoSkill: "multi",
                  onEnd() {
                    PLU.execActions("chushi " + key);
                  },
                });
              },
            });
          });
        });
      };
      let masterArray = PLU.YFD.masterList.map((p, i) => {
        if (i == 32)
          return {
            id: "bt_master_33",
            text: p.n,
            extend: p.v,
            style: {
              "background-color": "#FBB",
              width: "88px",
              padding: "5px 2px",
            },
          };
        let colr = i < 10 ? "#FCF" : i < 20 ? "#CFF" : "#FFC";
        return {
          id: "bt_master_" + (i + 1),
          text: p.n,
          children: (() => {
            if (!PLU.developerMode) return [];
            return [
              {
                id: "bt_master_" + (i + 1) + "_0",
                text: "拜入" + p.n,
                extend: {
                  func: () => send_prompt(" 是否確定要加入" + p.in + "\n\n\n\n", "home apprentice " + p.in, "確定", 0),
                },
                style: { "background-color": colr },
              },
            ];
          })().concat(
            p.npc.map((name, j) => {
              return {
                id: "bt_master_" + (i + 1) + "_" + (j + 1),
                text: name.split("@").slice(-1)[0],
                extend: PLU.queryNpc(name + "道", true)[0].way,
                style: { "background-color": colr },
              };
            }),
          ),
          style: {
            "background-color": colr,
            width: "40px",
            padding: "5px 2px",
          },
          menuStyle: (function () {
            if (i & 1) return { right: "101px", width: "160px" };
            return { width: "160px" };
          })(),
        };
      });
      PathsArray.push({
        id: "bt_masters",
        text: _("师门", "師門"),
        style: { background: "#FCF", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "96px", "margin-top": "-125px" },
        children: masterArray,
      });

      let dailyArray = PLU.YFD.dailyList.map((p, i) => {
        let colr = i < 6 ? "#FFC" : i < 20 ? "#FCF" : "#CFF";
        return {
          id: "bt_daily_" + (i + 1),
          text: p.n,
          extend: p.v,
          style: { "background-color": colr },
        };
      });
      PathsArray.push({
        id: "bt_daily",
        text: "日常",
        style: { background: "#FED", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "160px", "margin-top": "-125px" },
        children: dailyArray,
      });

      let usualArray = PLU.YFD.usualList.map((p, i) => {
        let sty = p.style || { "background-color": "#CDF" };
        return {
          id: "bt_usual_" + (i + 1),
          text: p.n,
          extend: p.v,
          style: sty,
        };
      });
      PathsArray.push({
        id: "bt_usual",
        text: "常用",
        style: { background: "#CDF", width: "40px", padding: "5px 2px" },
        menuStyle: { width: "160px", "margin-top": "-150px" },
        children: usualArray,
      });

      let cts = [],
        libCity = PLU.YFD.mapsLib.Npc.filter((e) => {
          if (!cts.includes(e.jh)) {
            cts.push(e.jh);
            return true;
          }
          return false;
        }).map((e) => e.jh);
      let queryJHMenu = libCity.map((c, i) => {
        return {
          id: "bt_queryjh_" + (i + 1),
          text: c,
          style: {
            width: "50px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            fontSize: "12px",
          },
          extend: { func: PLU.queryJHMenu, param: c },
        };
      });
      let queryArray = [
        {
          id: "bt_queryJHList",
          text: _("章节", "章節"),
          children: queryJHMenu,
          style: { width: "40px", "background-color": "#9ED" },
          menuStyle: { width: "180px", "margin-top": "-180px" },
        },
        {
          id: "bt_queryHistory",
          text: _("历史", "歷史"),
          style: { width: "40px", "background-color": "#FDD" },
          extend: { func: PLU.toQueryHistory },
        },
        {
          id: "bt_queryNpc",
          text: _("寻人", "尋人"),
          style: { width: "40px", "background-color": "#FDD" },
          extend: { func: PLU.toQueryNpc },
        },
        {
          id: "bt_pathNpc",
          text: _("扫图", "掃圖"),
          style: { width: "40px", "background-color": "#FE9" },
          extend: { func: PLU.toPathNpc },
        },
      ];
      if (PLU.developerMode) {
        queryArray.push({
          id: "bt_pathNpc",
          text: _("谜题", "謎題"),
          style: { width: "40px", "background-color": "#FE9" },
          extend: { func: PLU.toQueryMiTi },
        });
      }
      PathsArray.push({
        id: "bt_query",
        text: "查找",
        style: { background: "#9ED", width: "40px", padding: "5px 2px" },
        menuStyle: { "margin-top": "-30px" },
        children: queryArray,
      });
      YFUI.addMenu({
        id: "m_paths",
        groupId: "pluginMenus",
        text: _("导航", "導航"),
        style: { width: "40px", padding: "5px 2px" },
        multiCol: true,
        menuStyle: { width: "80px", "margin-top": "-25px" },
        children: PathsArray,
        onclick($btn, $box) {
          if ($btn.$extend) {
            $(".menu").hide();
            if ($btn.$extend.func) {
              if ($btn.$extend.param) $btn.$extend.func($btn, $btn.$extend.param);
              else $btn.$extend.func($btn);
              return;
            }
            PLU.execActions($btn.$extend, () => {
              if ($btn.text() == "去哈日") PLU.goHaRi();
              if ($btn.text() == "杭界山") PLU.goHJS();
            });
            // clickButton($btn.$extend)
          }
        },
      });
      let somethingArray = [];
      somethingArray.push({
        id: "bt_autoTeach",
        text: _("传授技能", "傳授技能"),
        extend: { func: PLU.toAutoTeach },
        style: { background: "#BFF" },
      });
      somethingArray.push({
        id: "bt_autoUpgrade",
        text: _("升级游侠", "升級遊俠"),
        extend: { func: PLU.toAutoUpgrade },
        style: { background: "#BFF" },
      });
      somethingArray.push({
        id: "hr_null2",
        text: "",
        style: { display: "none" },
        boxStyle: { display: "block", height: "5px" },
      });
      somethingArray.push({
        id: "bt_autoLearn",
        text: _("一键学习", "一鍵學習"),
        extend: { func: PLU.toAutoLearn },
        style: { background: "#FBF" },
      });
      somethingArray.push({
        id: "bt_autoChuaiMo",
        text: _("自动揣摩", "自動揣摩"),
        extend: { func: PLU.toAutoChuaiMo },
        style: { background: "#FBF" },
      });
      somethingArray.push({
        id: "hr_null2",
        text: "",
        style: { display: "none" },
        boxStyle: { display: "block", height: "5px" },
      });
      somethingArray.push({
        id: "bt_loopScript",
        text: _("循环执行", "循環執行"),
        extend: { func: PLU.toLoopScript },
        style: { background: "#FBB" },
      });
      somethingArray.push({
        id: "bt_loopKillByN",
        text: _("计数击杀", "計數擊殺"),
        extend: { func: PLU.toLoopKillByN },
        style: { background: "#FBB" },
      });
      somethingArray.push({
        id: "bt_waitCDKill",
        text: _("倒计时杀", "倒計時殺"),
        extend: { func: PLU.toWaitCDKill },
        style: { background: "#FBB" },
      });

      somethingArray.push({
        id: "bt_loopKillName",
        text: _("名字连杀", "名字連殺"),
        extend: { func: PLU.toLoopKillName },
        style: { background: "#FBB" },
      });
      somethingArray.push({
        id: "bt_loopClick",
        text: _("自动点击", "自動點擊"),
        extend: { func: PLU.toLoopClick },
        style: { background: "#FBB" },
      });
      somethingArray.push({
        id: "bt_loopSlowClick",
        text: _("慢速点击", "慢速點擊"),
        extend: { func: PLU.toLoopSlowClick },
        style: { background: "#FBB" },
      });
      somethingArray.push({
        id: "bt_record",
        text: _("指令录制", "指令錄製"),
        extend: { func: PLU.toRecord },
        style: { background: "#FBB" },
      });
      somethingArray.push({
        id: "hr_null2",
        text: "",
        style: { display: "none" },
        boxStyle: { display: "block", height: "5px" },
      });
      somethingArray.push({
        id: "bt_sellLaji",
        text: "批量出售",
        extend: { func: PLU.toSellLaji },
        style: { background: "#DEF" },
      });
      somethingArray.push({
        id: "bt_splitItem",
        text: "批量分解",
        extend: { func: PLU.toSplitItem },
        style: { background: "#DEF" },
      });
      somethingArray.push({
        id: "bt_putStore",
        text: _("批量入库", "批量入庫"),
        extend: { func: PLU.toPutStore },
        style: { background: "#DEF" },
      });
      somethingArray.push({
        id: "bt_autoUse",
        text: "批量使用",
        extend: { func: PLU.toAutoUse },
        style: { background: "#DEF" },
      });
      somethingArray.push({
        id: "bt_combineGem",
        text: _("合成宝石", "合成寶石"),
        extend: { func: PLU.openCombineGem },
        style: { background: "#DEF" },
      });
      somethingArray.push({
        id: "bt_autoMasterGem",
        text: _("一键合天神", "一鍵合天神"),
        extend: { func: PLU.autoMasterGem },
        style: { background: "#DEF" },
      });
      somethingArray.push({
        id: "hr_null2",
        text: "",
        style: { display: "none" },
        boxStyle: { display: "block", height: "5px" },
      });
      somethingArray.push({
        id: "bt_autoXTL1",
        text: "刷琅嬛玉洞",
        extend: { func: PLU.autoXTL1 },
        style: { background: "#FED" },
      });
      somethingArray.push({
        id: "bt_autoXTL2",
        text: "刷山崖",
        extend: { func: PLU.autoXTL2 },
        style: { background: "#FED" },
      });
      somethingArray.push({
        id: "bt_autoERG",
        text: "刷恶人谷",
        extend: { func: PLU.autoERG },
        style: { background: "#FED" },
      });
      if (PLU.developerMode)
        somethingArray.push({
          id: "bt_searchBangQS",
          text: _("扫暴击", "掃暴擊"),
          extend: { func: PLU.scanPuzzle },
          style: { background: "#BBF" },
        });
      somethingArray.push({
        id: "hr_null2",
        text: "",
        style: { display: "none" },
        boxStyle: { display: "block", height: "5px" },
      });
      somethingArray.push({
        id: "bt_autoGetKey",
        text: _("自动捡钥匙", "自動撿鑰匙"),
        extend: { func: PLU.toAutoGetKey },
        style: { background: "#EBC" },
      });
      somethingArray.push({
        id: "bt_autoMoke",
        text: _("一键摹刻", "一鍵摹刻"),
        extend: { func: PLU.toAutoMoke },
        style: { background: "#EFD" },
      });
      somethingArray.push({
        id: "bt_autoKillZYY",
        text: "刷祝玉妍",
        extend: { func: PLU.toAutoKillZYY },
        style: { background: "#FBF" },
      });
      somethingArray.push({
        id: "bt_autoJHYL",
        text: "九花原料",
        extend: { func: PLU.buyJHYL },
        style: { background: "#DEF" },
      });
      somethingArray.push({
        id: "bt_checkYouxia",
        text: _("技能检查", "技能檢查"),
        extend: { func: PLU.checkYouxia },
        style: { background: "#DEF" },
      });
      somethingArray.push({
        id: "bt_loopReadBase",
        text: _("读技能书", "讀技能書"),
        extend: { func: PLU.toLoopReadBase },
        style: { background: "#FBB" },
      });
      somethingArray.push({
        id: "bt_searchFamilyQS",
        text: _("搜师门任务", "搜師門任務"),
        extend: { func: PLU.toSearchFamilyQS },
        style: { background: "#BBF" },
      });
      somethingArray.push({
        id: "bt_searchBangQS",
        text: _("搜帮派任务", "搜幫派任務"),
        extend: { func: PLU.toSearchBangQS },
        style: { background: "#BBF" },
      });
      // somethingArray.push({id:"bt_autoFB11", text:"自動本11", extend:{func:PLU.toAutoFB11}, style:{background:"#FC9"}})
      YFUI.addMenu({
        id: "m_autoDoSomething",
        groupId: "pluginMenus",
        text: _("自动", "自動"),
        style: { width: "40px" },
        multiCol: true,
        menuStyle: { width: "160px", "margin-top": "-61px" },
        children: somethingArray,
        onclick($btn, $box) {
          if ($btn.$extend) {
            $(".menu").hide();
            $btn.$extend.func($btn);
          }
        },
      });
      //listens
      let listensArray = [];
      listensArray.push({
        id: "bt_autoBF",
        text: _("自动帮四", "自動幫四"),
        extend: { key: "autoBF" },
        style: { background: "#EDC" },
      });
      listensArray.push({
        id: "bt_autoB6",
        text: _("自动帮六", "自動幫六"),
        extend: { key: "autoB6" },
        style: { background: "#ECD" },
      });
      listensArray.push({
        id: "bt_autoB5F",
        text: _("帮五跟杀", "幫五跟殺"),
        extend: { key: "autoB5F" },
        style: { background: "#CEF" },
      });
      listensArray.push({
        id: "bt_autoDZ",
        text: _("持续打坐", "持續打坐"),
        extend: { key: "autoDZ" },
        style: { background: "#CEC" },
      });
      listensArray.push({
        id: "bt_autoHYC",
        text: _("持续睡床", "持續睡床"),
        extend: { key: "autoHYC" },
        style: { background: "#CEC" },
      });
      listensArray.push({
        id: "bt_auto9H",
        text: _("持续九花", "持續九花"),
        extend: { key: "auto9H" },
        style: { background: "#CEC" },
      });
      listensArray.push({
        id: "bt_autoLX",
        text: _("持续练习", "持續練習"),
        extend: { key: "autoLX" },
        style: { background: "#CEC" },
      });
      listensArray.push({
        id: "bt_autoTP",
        text: _("持续突破", "持續突破"),
        extend: { key: "autoTP" },
        style: { background: "#BEF" },
      });
      listensArray.push({
        id: "bt_autoDY",
        text: _("持续钓鱼", "持續釣魚"),
        extend: { key: "autoDY" },
        style: { background: "#CEC" },
      });
      listensArray.push({
        id: "bt_autoQuitTeam",
        text: _("进塔离队", "進塔離隊"),
        extend: { key: "autoQuitTeam" },
        style: { background: "#EEF" },
      });
      if (PLU.developerMode)
        listensArray.push({
          id: "bt_autoSignIn",
          text: _("定時签到", "定時簽到"),
          extend: { key: "autoSignIn" },
          style: { background: "#BEF" },
        });
      listensArray.push({
        id: "bt_autoConnect",
        text: _("自动重连", "自動重連"),
        extend: { key: "autoConnect" },
        style: { background: "#FED" },
      });
      listensArray.push({
        id: "hr_listen",
        text: "",
        style: { width: "160px", opacity: 0 },
        boxStyle: { "font-size": 0 },
      });
      listensArray.push({
        id: "bt_listenQL",
        text: _("本服青龙", "本服青龍"),
        extend: { key: "listenQL" },
      });
      listensArray.push({
        id: "bt_listenKFQL",
        text: _("跨服青龙", "跨服青龍"),
        extend: { key: "listenKFQL" },
      });
      listensArray.push({
        id: "bt_listenYX",
        text: "遊俠",
        extend: { key: "listenYX" },
      });
      listensArray.push({
        id: "bt_listenTF",
        text: "夜魔逃犯",
        extend: { key: "listenTF" },
      });
      listensArray.push({
        id: "bt_listenPuzzle",
        text: _("暴击谜题", "暴擊謎題"),
        extend: { key: "listenPuzzle" },
      });
      listensArray.push({
        id: "bt_listenChat",
        text: _("闲聊", "閒聊"),
        extend: { key: "listenChat" },
      });
      YFUI.addMenu({
        id: "m_listens",
        groupId: "pluginMenus",
        text: _("监听", "監聽"),
        style: { background: "#DDFFDD", width: "40px" },
        multiCol: true,
        menuStyle: { width: "160px", "margin-top": "-25px" },
        children: listensArray,
        onclick($btn, $box) {
          if ($btn.$extend) PLU.setListen($btn, $btn.$extend.key);
        },
      });

      //fightset
      let fightSetsArray = [];
      fightSetsArray.push({
        id: "bt_enableSkills",
        text: _("技 能 组", "技 能 組"),
        style: { background: "#FBE" },
        menuStyle: { "margin-top": "-25px" },
        children: [
          {
            id: "bt_enableSkill1",
            text: _("技能组1", "技能組1"),
            extend: { key: "enable1" },
          },
          {
            id: "bt_enableSkill2",
            text: _("技能组2", "技能組2"),
            extend: { key: "enable2" },
          },
          {
            id: "bt_enableSkill3",
            text: _("技能组3", "技能組3"),
            extend: { key: "enable3" },
          },
        ],
      });
      fightSetsArray.push({
        id: "bt_wearEquip",
        text: _("装备切换", "裝備切換"),
        style: { background: "#FEB" },
        children: [
          {
            id: "bt_wearEquip1",
            text: _("装备组1", "裝備組1"),
            extend: { key: "equip1" },
            canSet: true,
          },
          {
            id: "bt_wearEquip2",
            text: _("装备组2", "裝備組2"),
            extend: { key: "equip2" },
            canSet: true,
          },
        ],
      });
      fightSetsArray.push({
        id: "bt_followKill",
        text: _("跟杀设置", "跟殺設置"),
        extend: { key: "followKill" },
        style: { background: "#FCC" },
      });
      fightSetsArray.push({
        id: "bt_autoCure",
        text: _("血蓝设置", "血藍設置"),
        extend: { key: "autoCure" },
        style: { background: "#CCF" },
      });
      fightSetsArray.push({
        id: "bt_autoPerform",
        text: _("技能设置", "技能設置"),
        extend: { key: "autoPerform" },
        style: { background: "#CFC" },
      });
      YFUI.addMenu({
        id: "m_fightsets",
        groupId: "pluginMenus",
        text: _("战斗", "戰鬥"),
        style: { background: "#FFDDDD", width: "40px" },
        //multiCol: true,
        menuStyle: { width: "80px", "margin-top": "-50px" },
        children: fightSetsArray,
        onclick($btn, $box, BtnMode) {
          if ($btn.$extend) {
            if ($btn.$extend.key && PLU.getCache($btn.$extend.key) == 0) $(".menu").hide();
            if ($btn.$extend.key.match("enable")) return PLU.setSkillGroup($btn.$extend.key.substr(-1));
            if ($btn.$extend.key.match("equip")) {
              let equipKey = "equip_" + $btn.$extend.key.substr(-1) + "_keys";
              let equipsStr = PLU.getCache(equipKey);
              $(".menu").hide();
              if (equipsStr && BtnMode != "setting") {
                return PLU.wearEquip(equipsStr);
              }
              return PLU.setWearEquip($btn.$extend.key.substr(-1));
            }
            if ($btn.$extend.key == "followKill") return PLU.setFightSets($btn, $btn.$extend.key);
            if ($btn.$extend.key == "autoCure") return PLU.setAutoCure($btn, $btn.$extend.key);
            if ($btn.$extend.key == "autoPerform") return PLU.setAutoPerform($btn, $btn.$extend.key);
          }
        },
      });
      // puzzle
      let puzzleArray = [];
      if (PLU.developerMode)
        puzzleArray.push({
          id: "bt_puzzle_key",
          text: _("通告设置", "通告設置"),
          extend: { key: "" },
        });
      puzzleArray.push({
        id: "bt_puzzle_Key",
        text: _("密码设置", "密碼設置"),
        extend: { func: PLU.puzzleKey },
      });
      if (PLU.developerMode)
        puzzleArray.push({
          id: "bt_puzzle_key",
          text: _("进度设置", "進度設置"),
          extend: { func: PLU.key },
        });
      puzzleArray.push({
        id: "bt_puzzle_key",
        text: _("超时设置", "超時設置"),
        extend: { func: PLU.puzzleTimeOut },
      });
      YFUI.addMenu({
        id: "m_puzzle",
        groupId: "pluginMenus",
        text: _("谜题", "謎題"),
        style: { background: "#CCC", width: "40px" },
        menuStyle: { "margin-top": "-75px" },
        children: puzzleArray,
        onclick($btn, $box) {
          if ($btn.$extend) {
            $(".menu").hide();
            $btn.$extend.func($btn);
          }
        },
      });
      //Sign
      let signArray = [];
      signArray.push({
        id: "bt_autoAskQixia",
        text: _("自动问奇侠", "自動問奇俠"),
        extend: { func: PLU.toAutoAskQixia },
      });
      signArray.push({
        id: "bt_autoVisitQixia",
        text: _("亲近奇侠", "親近奇俠"),
        style: { background: "#CFC" },
        extend: { func: PLU.toAutoVisitQixia },
      });
      signArray.push({
        id: "hr_dlus",
        text: "",
        style: { width: "240px", opacity: 0 },
      });
      signArray.push({
        id: "bt_sign",
        text: _("一键签到", "一鍵簽到"),
        extend: { key: "signIn" },
        style: { background: "#CCFFFF" },
      });
      YFUI.addMenu({
        id: "m_signs",
        groupId: "pluginMenus",
        text: _("签到", "簽到"),
        style: { background: "#DDFFFF", width: "40px" },
        menuStyle: { "margin-top": "-92px" },
        children: signArray,
        onclick($btn, $box) {
          if ($btn.$extend) {
            if ($btn.$extend.key == "signIn") {
              $(".menu").hide();
              return PLU.toSignIn();
            } else if ($btn.$extend.key == "autoSignIn") {
              return PLU.setListen($btn, $btn.$extend.key);
            } else {
              $(".menu").hide();
              $btn.$extend.func($btn);
            }
          }
        },
      });
      //sys
      let sysArray = [];
      sysArray.push({
        id: "bt_openTeam",
        text: _("开队伍", "開隊伍"),
        extend: "team",
      });
      sysArray.push({
        id: "bt_openFudi",
        text: _("开府邸", "開府邸"),
        extend: "fudi",
      });
      sysArray.push({
        id: "bt_openShop",
        text: _("开商城", "開商城"),
        extend: "shop",
      });
      sysArray.push({
        id: "bt_openJFShop",
        text: _("积分商城", "積分商城"),
        extend: "shop xf_shop",
      });
      sysArray.push({
        id: "bt_open4HShop",
        text: _("四海商店", "四海商店"),
        children: [
          {
            id: "bt_open4HShop1",
            text: "回收",
            extend: "reclaim recl",
          },
          {
            id: "bt_open4HShop2",
            text: "兌換",
            extend: "reclaim buy",
          },
        ],
      });
      sysArray.push({
        id: "bt_clanShop",
        text: _("帮派商店	", "幫會商店"),
        extend: "clan;clan_shop",
      });
      sysArray.push({
        id: "hr_sys",
        text: "",
        style: { width: "160px", opacity: 0 },
        boxStyle: { "font-size": 0 },
      });
      sysArray.push({
        id: "bt_cleartask",
        text: _("清谜题", "清謎題"),
        extend: "auto_tasks cancel",
      });
      sysArray.push({
        id: "bt_task",
        text: _("谜题列表", "謎題列表"),
        extend: "task_quest",
      });
      sysArray.push({
        id: "bt_intervene",
        text: _("杀隐藏怪", "殺隱藏怪"),
        extend: { func: PLU.intervene },
      });
      sysArray.push({
        id: "bt_openQixia",
        text: "奇俠列表",
        extend: "open jhqx",
      });
      sysArray.push({
        id: "hr_sys",
        text: "",
        style: { width: "160px", opacity: 0 },
        boxStyle: { "font-size": 0 },
      });
      sysArray.push({
        id: "bt_showMPFZ",
        text: _("纷争显示", "紛爭顯示"),
        extend: { func: PLU.showMPFZ },
        style: { background: "#EEEEFF" },
      });
      sysArray.push({
        id: "bt_log",
        text: _("消息日志", "消息日誌"),
        extend: { func: PLU.showLog },
        style: { background: "#99CC00" },
      });
      sysArray.push({
        id: "bt_upset",
        text: _("备份设置", "備份設置"),
        extend: { func: PLU.backupSetting },
        style: { background: "#FFAAAA" },
      });
      sysArray.push({
        id: "bt_dlset",
        text: _("载入设置", "載入設置"),
        extend: { func: PLU.loadSetting },
        style: { background: "#FFCC00" },
      });
      YFUI.addMenu({
        id: "m_sys",
        groupId: "pluginMenus",
        text: "工具",
        multiCol: true,
        style: { background: "#FFFFDD", width: "40px" },
        menuStyle: { width: "160px", "margin-top": "-117px" },
        children: sysArray,
        onclick($btn, $box) {
          if ($btn.$extend && $btn.$extend.func) {
            $(".menu").hide();
            $btn.$extend.func($btn);
          } else if ($btn.$extend) {
            $(".menu").hide();
            PLU.execActions($btn.$extend);
          }
        },
      });
      //================================================================================
      //  活動
      //================================================================================
      // let activeArray=[]
      // activeArray.push({id:"bt_goShop1", text:"去小二", extend:"jh 1;"})
      // activeArray.push({id:"bt_buyItem1", text:"買四樣", extend:"#21 buy_npc_item go 0;#21 buy_npc_item go 1;#21 buy_npc_item go 2;#21 buy_npc_item go 3;"})
      // activeArray.push({id:"bt_goShop2", text:"去掌櫃", extend:"jh 5;n;n;n;w", style:{background:"#FDD"}})
      // activeArray.push({id:"bt_buyItem2", text:"買紅粉", extend:"#6 buy_npc_item go 0;", style:{background:"#FDD"}})
      // activeArray.push({id:"bt_goShop3", text:"去小販", extend:"jh 2;n;n;n;n;e", style:{background:"#DEF"}})
      // activeArray.push({id:"bt_buyItem3", text:"買黃粉", extend:"#6 event_1_17045611 go 0;", style:{background:"#DEF"}})
      // activeArray.push({id:"bt_goShop4", text:"去峨眉", extend:"jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w", style:{background:"#EFE"}})
      // activeArray.push({id:"bt_buyItem4", text:"買藍粉", extend:"#6 event_1_39153184 go 0;", style:{background:"#EFE"}})
      // activeArray.push({id:"bt_goAll", text:"一鍵買材料", extend:"jh 1;#21 buy_npc_item go 0;#21 buy_npc_item go 1;#21 buy_npc_item go 2;#21 buy_npc_item go 3;jh 5;n;n;n;w;#6 buy_npc_item go 0;jh 2;n;n;n;n;e;#6 event_1_17045611 go 0;jh 8;w;nw;n;n;n;n;e;e;n;n;e;;kill?看山弟子;n;n;n;n;w;#6 event_1_39153184 go 0;", style:{background:"#9F9"}})
      // activeArray.push({id:"bt_goShoot", text:"去放煙花", extend:"jh 2;n;n;n;", style:{background:"#FD9"}})
      // // activeArray.push({id:"bt_n", text:"", style:{opacity:0}})
      // // activeArray.push({id:"hr_sys", text:"", style:{width:"160px",opacity:0}, boxStyle:{"font-size":0}})
      // activeArray.push({id:"bt_goShoot1", text:"一鍵璀璨", extend:"#5 event_1_99582507;#15 event_1_48376442;", style:{background:"#F9D"}})
      // activeArray.push({id:"bt_goShoot2", text:"一鍵四款", extend:"#5 event_1_74166959;#5 event_1_10053782;#5 event_1_25918230;#5 event_1_48376442;", style:{background:"#D9F"}})

      // YFUI.addMenu({
      //     id: "m_active",
      //     groupId:"pluginMenus",
      //     text: "元宵",
      //     multiCol: true,
      //     style:{"background":"#FFFF55","width":"40px","margin-top":"25px"},
      //     menuStyle: {width: "160px","margin-top":"-22px"},
      //     children: activeArray,
      //     onclick($btn,$box){
      //         if($btn.$extend && $btn.$extend.func){
      //             //$(".menu").hide()
      //             $btn.$extend.func($btn)
      //}else if($btn.$extend){
      //             //$(".menu").hide()
      // 			PLU.execActions($btn.$extend,()=>{
      // 				YFUI.writeToOut("<span style='color:#FFF;'>========== OK ==========</span>")
      // 			})
      // 		}
      //}
      //})
      if (PLU.developerMode) {
        let flagArray = [];
        flagArray.push({
          id: "bt_npcDataUpdate",
          text: "npc數據更新",
          extend: { func: PLU.npcDataUpdate },
        });
        YFUI.addMenu({
          id: "m_flag",
          groupId: "pluginMenus",
          text: _("实验", "實驗"),
          multiCol: true,
          style: { background: "#FBB", width: "40px" },
          menuStyle: { width: "160px", "margin-top": "-117px" },
          children: flagArray,
          onclick($btn, $box) {
            if ($btn.$extend && $btn.$extend.func) {
              $(".menu").hide();
              $btn.$extend.func($btn);
            } else if ($btn.$extend) {
              $(".menu").hide();
              PLU.execActions($btn.$extend);
            }
          },
        });
      }
      //================================================================================
      //================================================================================

      let gh = parseInt($("#page").height() * $("#page").height() * 0.00025);
      YFUI.addBtn({
        id: "bt_col_null",
        groupId: "pluginMenus",
        text: "",
        style: {
          background: "transparent",
          height: gh + "px",
          width: "0px",
          visibility: "hidden",
        },
        boxStyle: { "pointer-events": "none" },
      });
      //戰鬥按鈕
      YFUI.addBtn({
        id: "bt_kg_autoEscape",
        groupId: "pluginMenus",
        text: "逃跑",
        style: { background: "#DDCCEE", height: "20px", width: "40px" },
        // boxStyle:{"margin-bottom":"15px"},
        onclick($btn) {
          let btnFlag = PLU.setBtnRed($btn);
          if (btnFlag) {
            PLU.autoEscape({
              onEnd() {
                PLU.setBtnRed($btn);
              },
            });
          } else UTIL.delSysListener("onAutoEscape");
        },
      });
      YFUI.addBtn({
        id: "bt_kg_loopKill",
        groupId: "pluginMenus",
        text: _("循环杀", "循環殺"),
        style: { background: "#EECCCC", height: "20px", width: "40px" },
        // boxStyle:{"margin-bottom":"15px"},
        onclick($btn) {
          PLU.toLoopKill($btn);
        },
      });
      YFUI.addBtn({
        id: "bt_kg_teamSync",
        groupId: "pluginMenus",
        text: "同步",
        style: { background: "#DDCCEE", height: "20px", width: "40px" },
        boxStyle: { "margin-bottom": "15px" },
        onclick($btn) {
          PLU.toggleTeamSync($btn);
        },
      });
      YFUI.addBtn({
        id: "bt_kg_followKill",
        groupId: "pluginMenus",
        text: _("跟杀", "跟殺"),
        style: { background: "#FFDDDD", height: "25px", width: "40px" },
        onclick($btn) {
          PLU.toggleFollowKill($btn, "followKill");
        },
      });
      YFUI.addBtn({
        id: "bt_kg_autoCure",
        groupId: "pluginMenus",
        text: _("血蓝", "血藍"),
        style: { background: "#CCCCFF", height: "25px", width: "40px" },
        onclick($btn) {
          PLU.toggleAutoCure($btn, "autoCure");
        },
      });
      YFUI.addBtn({
        id: "bt_kg_autoPerform",
        groupId: "pluginMenus",
        text: _("连招", "連招"),
        style: { background: "#FFCCFF", height: "25px", width: "40px" },
        onclick($btn) {
          PLU.toggleAutoPerform($btn, "autoPerform");
        },
      });
      //monitor
      let momaxW = $("#page").width() - $("#out").width() > 4 && $("#out").width() > 634 ? 475 : Math.floor($("#out").width() * 0.75);
      let leftSty = $("#page").width() - $("#out").width() > 4 && $("#page").width() > 634 ? "79px" : "12%";
      YFUI.addBtnGroup({
        id: "topMonitor",
        style: {
          position: "fixed",
          top: 0,
          left: leftSty,
          width: "75%",
          height: "15px",
          maxWidth: momaxW + "px",
          lineHeight: "1.2",
          fontSize: "11px",
          textAlign: "left",
          color: "#FF9",
          background: "rgba(0,0,0,0)",
          display: "none",
        },
      });
    },
    //================================================================================================
    getCache(key) {
      return PLU.CACHE[key] ?? "";
    },
    //================================================================================================
    setCache(key, val) {
      PLU.CACHE[key] = val;
      UTIL.setMem("CACHE", JSON.stringify(PLU.CACHE));
      return val;
    },
    //================================================================================================
    initStorage() {
      if (!UTIL.getMem("CACHE")) UTIL.setMem("CACHE", JSON.stringify(PLU.CACHE));
      let caObj,
        ca = UTIL.getMem("CACHE");
      try {
        caObj = JSON.parse(ca);
      } catch (err) { }
      if (caObj) {
        PLU.CACHE = caObj;
        let listen = [
          "listenPuzzle",
          "listenChat",
          "listenQL",
          "listenTF",
          "listenKFQL",
          "listenYX",
          "autoDZ",
          "autoHYC",
          "auto9H",
          "autoDY",
          "autoTP",
          "autoLX",
          "autoBF",
          "autoB5F",
          "autoB6",
          "autoConnect",
          "autoSignIn",
          "autoQuitTeam",
        ];
        for (var i = 0, len = listen.length; i < len; i++) {
          if (PLU.getCache(listen[i]) == 1) PLU.setListen($("#btn_bt_" + listen[i]), listen[i], 1);
        }
        if (PLU.getCache("listenPuzzle") == 0) {
          PLU.TMP.autotask = false;
        }
        if (PLU.getCache("followKill") == 1) {
          PLU.toggleFollowKill($("#btn_bt_kg_followKill"), "followKill", 1);
        }
        if (PLU.getCache("autoCure") == 1) {
          PLU.toggleAutoCure($("#btn_bt_kg_autoCure"), "autoCure", 1);
        }
        if (PLU.getCache("autoPerform") >= 1) {
          PLU.toggleAutoPerform($("#btn_bt_kg_autoPerform"), "autoPerform", PLU.getCache("autoPerform"));
        }
        if (PLU.getCache("showTopMonitor") == 1) {
          PLU.showMPFZ($("#btn_bt_showMPFZ"));
        }
      }
    },
    //================================================================================================
    initHistory() {
      //---------------------
      document.addEventListener("addLog", PLU.updateShowLog);
      //---------------------
      let hisArr = [],
        hstr = UTIL.getMem("HISTORY");
      if (hstr)
        try {
          hisArr = JSON.parse(hstr);
        } catch (err) { }
      if (hisArr && hisArr.length) {
        let nowTs = new Date().getTime();
        let newArr = hisArr.filter((h) => {
          UTIL.log(Object.assign({}, h, { isHistory: true }));
          if (nowTs - h.time > 43200000) return false;
          return true;
        });
        UTIL.logHistory = newArr;
        UTIL.setMem("HISTORY", JSON.stringify(newArr));
      }
      PLU.MPFZ = UTIL.getMem("MPFZ") ? JSON.parse(UTIL.getMem("MPFZ")) : {};
    },
    //================================================================================================
    initListeners() {
      //監聽戰鬥消息
      UTIL.addSysListener("listenAllFight", (b, type, subtype, msg) => {
        if (type == "vs") {
          switch (subtype) {
            case "vs_info":
              if (b.containsKey("is_watcher")) {
                PLU.STATUS.inBattle = 2;
                break;
              }
              PLU.STATUS.inBattle = 1;
              if (!PLU.battleData)
                PLU.battleData = {
                  skills: {},
                  xdz: 0,
                  myPos: 0,
                  mySide: "",
                  performTime: 0,
                  cureTimes: 0,
                };

              for (let i = b.elements.length - 1; i > -1; i--) {
                let val = b.elements[i].value + "";
                if (!val || val.indexOf(PLU.accId) < 0) continue;
                PLU.battleData.myPos = b.elements[i].key.charAt(7);
                PLU.battleData.mySide = b.elements[i].key.substring(0, 3);
                break;
              }
              PLU.STATUS.isBusy = true;
              break;
            case "ready_skill":
              if (b.get("uid").indexOf(PLU.accId) < 0 || b.get("skill") == "fight_item") break;
              if (!PLU.battleData)
                PLU.battleData = {
                  skills: {},
                  xdz: 0,
                  myPos: 0,
                  mySide: "",
                  performTime: 0,
                  cureTimes: 0,
                };
              PLU.battleData.skills[b.get("pos") - 1] = {
                name: UTIL.filterMsg(b.get("name")),
                skill: b.get("skill"),
                xdz: b.get("xdz"),
                key: "playskill " + b.get("pos"),
              };
              break;
            case "add_xdz":
              if (b.get("uid").indexOf(PLU.accId) < 0) break;
              if (!PLU.battleData)
                PLU.battleData = {
                  skills: {},
                  xdz: 0,
                  myPos: 0,
                  mySide: "",
                  performTime: 0,
                  cureTimes: 0,
                };
              PLU.battleData.xdz = parseInt(b.get("xdz"));
              if (PLU.STATUS.inBattle == 1 && PLU.battleData && PLU.battleData.xdz > 1) {
                PLU.checkUseSkills();
              }
              break;
            case "playskill":
              if (b.get("uid").indexOf(PLU.accId) < 0) break;
              if (!PLU.battleData)
                PLU.battleData = {
                  skills: {},
                  xdz: 0,
                  myPos: 0,
                  mySide: "",
                  performTime: 0,
                  cureTimes: 0,
                };
              let x = PLU.battleData.xdz - parseInt(b.get("lose_xdz"));
              if (parseInt(b.get("lose_xdz"))) PLU.battleData.xdz = x > 0 ? x : 0;
              break;
            case "out_watch":
              PLU.STATUS.inBattle = 0;
              PLU.STATUS.isBusy = false;
              break;
            case "combat_result":
              PLU.STATUS.inBattle = 0;
              PLU.battleData = null;

              PLU.STATUS.isBusy = false;
              if (PLU.TMP.loopUseSkill) {
                clearInterval(PLU.TMP.loopUseSkill);
                PLU.TMP.loopUseSkill = null;
              }
              break;
            default:
              break;
          }
          if (PLU.STATUS.inBattle == 1 && !PLU.TMP.loopUseSkill) {
            PLU.TMP.loopUseSkill = setInterval(() => {
              if (PLU.STATUS.inBattle == 1 && PLU.battleData && PLU.battleData.xdz > 1) {
                PLU.checkUseSkills();
              }
            }, 250);
          }
        }
        if (g_gmain.is_fighting && PLU.STATUS.inBattle == 1) {
          if (type == "vs" || type == "attrs_changed") {
            //自動療傷及自動技能
            if (PLU.battleData && PLU.battleData.xdz > 1 && PLU.STATUS.inBattle == 1) {
              PLU.checkUseSkills();
            }
          }
        }
      });
      //監聽場景消息
      UTIL.addSysListener("listenNotice", (b, type, subtype, msg) => {
        if (type != "notice" && type != "main_msg") return;
        if (msg.match(/閒聊|告訴|隊伍/)) return;
        let msgTxt = UTIL.filterMsg(msg);
        if (msgTxt.match("你打坐完畢") && PLU.getCache("autoDZ") == 1) {
          if (UTIL.inHome()) clickButton("exercise", 0);
          else
            PLU.TODO.push({
              type: "cmds",
              cmds: "exercise",
              timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
            });
        } else if ((msgTxt.match("你從寒玉床上爬起") || msgTxt.match("你從地髓石乳中出來")) && PLU.getCache("autoHYC") == 1) {
          if (UTIL.inHome()) PLU.execActions("golook_room;sleep_hanyuchuang;home");
          else
            PLU.TODO.push({
              type: "cmds",
              cmds: "golook_room;sleep_hanyuchuang;home",
              timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
            });
        } else if (msgTxt.match("你今天使用九花玉露丸次數已經達到上限了")) {
          YFUI.writeToOut("<span style='color:yellow;'>九花玉露丸次數已達到上限!取消監聽九花玉露丸...</span>");
          PLU.setListen($("#btn_bt_auto9H"), "auto9H", 0);
        } else if (msgTxt.match("九花玉露丸效果：") && PLU.getCache("auto9H") == 1) {
          PLU.execActions("items use obj_jiuhuayulouwan");
        } else if (msgTxt.match(/你的(.*)成功向前突破了/) && PLU.getCache("autoTP") == 1) {
          if (UTIL.inHome()) PLU.toToPo();
          else {
            let checktp = PLU.TODO.find((e) => e.cmds == "toToPo");
            if (!checktp)
              PLU.TODO.push({
                type: "func",
                cmds: "toToPo",
                timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
              });
          }
        } else if ((msgTxt.match("你現在正突破") && msgTxt.match("同時突破")) || msgTxt.match("此次突破需要")) {
          //突破失敗
          PLU.TMP.stopToPo = true;
        } else if (msgTxt.match("青龍會組織：")) {
          //本服青龍
          let l = msgTxt.match(/青龍會組織：(.*)正在\003href;0;([\w\d\s]+)\003(.*)\0030\003施展力量，本會願出(.*)的戰利品獎勵給本場戰鬥的最終獲勝者。/);
          if (l && l.length > 3) {
            UTIL.log({
              msg: "【青龍】" + l[3].padStart(5) + " - " + l[1].padEnd(4) + "  獎品:" + l[4],
              type: "QL",
              time: new Date().getTime(),
            });
            if (PLU.getCache("listenQL") == 1) {
              let keysStr = PLU.getCache("listenQL_keys")
                .split("|")[1]
                .split(",")
                .map((e) => (e == "*" ? ".*" : e.replace("*", "\\*")))
                .join("|");
              let reg = new RegExp(keysStr);
              if (l[4].match(reg) && UTIL.inHome()) {
                PLU.goQinglong(l[1], l[3], PLU.getCache("listenQL_keys").split("|")[0], false);
              }
            }
          }
        } else if (msgTxt.match("這是你今天完成的第")) {
          //逃犯完成
          let l = msgTxt.match(/這是你今天完成的第(\d)\/\d場逃犯任務/);
          if (l && l.length > 0 && l[1] == 5) {
            YFUI.writeToOut('<span style="color:yellow;">逃犯任務已達到上限!取消逃犯監聽...</span>');
            UTIL.log({
              msg: " 逃犯任務已達到上限!取消逃犯監聽...",
              type: "TIPS",
              time: new Date().getTime(),
            });
            PLU.setListen($("#btn_bt_listenTF"), "listenTF", 0);
          }
        } else if (msgTxt.match("對你悄聲道：你現在去") && !PLU.TMP.autoQixiaMijing) {
          //奇俠說秘境
          let l = msgTxt.match(/(.*)對你悄聲道：你現在去(.*)，應當會有發現/);
          if (l && l.length > 2) {
            let placeData = PLU.YFD.mjList.find((e) => e.n == l[2]);
            if (placeData) {
              YFUI.writeToOut(
                "<span>奇俠秘境: <a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.execActions(\"" +
                placeData.v +
                "\")'>" +
                placeData.n +
                "</a></span>",
              );
              YFUI.showPop({
                title: "奇俠秘境",
                text: "秘境：" + placeData.n,
                okText: "去秘境",
                onOk() {
                  PLU.execActions(placeData.v + ";find_task_road secret;", () => {
                    YFUI.writeToOut(
                      "<span>:: <a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='clickButton(\"open jhqx\", 0)'>奇俠列表</a></span>",
                    );
                  });
                },
                onNo() { },
              });
            }
          }
        } else if (msgTxt.match("你贏了這場寶藏秘圖之戰！")) {
          PLU.execActions("clan bzmt puzz");
        } else if (msgTxt.match("開啟了幫派副本")) {
          if (PLU.getCache("autoBF") == 1) {
            //幫四開啟
            let ll = msg.match(/開啟了幫派副本.*十月圍城.*【(.*)】/);
            if (ll) {
              let n = "一二三".indexOf(ll[1]);
              UTIL.log({
                msg: "【幫四】幫四(" + ll[1] + ")開啟 ",
                type: "BF",
                time: new Date().getTime(),
              });
              if (n >= 0) {
                if (!g_gmain.is_fighting) {
                  PLU.toBangFour(n + 1);
                } else {
                  let checktodo = PLU.TODO.find((e) => e.cmds == "toBangFour");
                  if (!checktodo)
                    PLU.TODO.push({
                      type: "func",
                      cmds: "toBangFour",
                      param: [n + 1],
                      timeout: new Date().getTime() + 5 * 60 * 1000,
                    });
                }
              }
            }
          }
          if (PLU.getCache("autoB6") == 1) {
            //幫六開啟
            let ls = msg.match(/開啟了幫派副本.*蠻荒七神寨.*/);
            if (ls) {
              if (!g_gmain.is_fighting) {
                PLU.toBangSix();
              } else {
                let checktodo = PLU.TODO.find((e) => e.cmds == "toBangSix");
                if (!checktodo)
                  PLU.TODO.push({
                    type: "func",
                    cmds: "toBangSix",
                    param: [""],
                    timeout: new Date().getTime() + 5 * 60 * 1000,
                  });
              }
            }
          }
        } else if (msgTxt.match("十月圍城】幫派副本勝利")) {
          //幫四完成
          PLU.STO.bangFourTo && clearTimeout(PLU.STO.bangFourTo);
          if (!g_gmain.is_fighting) {
            setTimeout(() => {
              PLU.execActions("home;");
            }, 2000);
          }
        } else if (msgTxt.match("蠻荒七神寨】幫派副本勝利")) {
          //幫六完成
          PLU.STO.bangSixTo && clearTimeout(PLU.STO.bangSixTo);
          if (!g_gmain.is_fighting) {
            setTimeout(() => {
              PLU.execActions("home;");
            }, 2000);
          }
        } else if (msgTxt.match("你今天進入此副本的次數已達到上限了")) {
          //幫四六無法進入
          PLU.STO.bangFourTo && clearTimeout(PLU.STO.bangFourTo);
          PLU.STO.bangSixTo && clearTimeout(PLU.STO.bangSixTo);
          UTIL.log({
            msg: " !!副本超量!!",
            type: "TIPS",
            time: new Date().getTime(),
          });
        } else if (msgTxt.match(/你已進入幫派副本\*\*可汗金帳\*\*/) && PLU.getCache("autoB5F") == 1) {
          //幫五進入
          PLU.inBangFiveEvent();
        } else if (msgTxt.match("成功消滅了守將府內的所有敵人")) {
          //幫二完成
          let l = msgTxt.match(/守城成功】(.*)成功消滅了守將府內的所有敵人，幫派副本完成/);
          if (l && l.length > 1 && !g_gmain.is_fighting) {
            setTimeout(() => {
              PLU.execActions("home;");
            }, 3000);
          }
        } else if (msgTxt.match("你沒有精良魚餌，無法釣魚")) {
          //釣魚完成
          if (!UTIL.inHome() && !g_gmain.is_fighting) {
            if (PLU.getCache("autoDY") == 1) {
              let attr = g_obj_map.get("msg_attrs");
              if (attr.get("yuanbao") >= PLU.getCache("autoDY_key") + 50) PLU.execActions("shop buy shop45;diaoyu;");
              else
                setTimeout(() => {
                  PLU.execActions("home;");
                }, 1000);
            }
          } else
            setTimeout(() => {
              PLU.execActions("home;");
            }, 1000);
        }
      });

      //監聽頻道消息
      UTIL.addSysListener("listenChannel", (b, type, subtype, msg) => {
        if (type != "channel" || subtype != "sys") return;
        let msgTxt = UTIL.filterMsg(msg);
        //本服逃犯
        if (msgTxt.match("慌不擇路") && msgTxt.indexOf("跨服") < 0) {
          var l = msgTxt.match(/系統】([\u4e00-\u9fa5|\*]+).*慌不擇路，逃往了(.*)-\003href;0;([\w\d\s]+)\003([\u4e00-\u9fa5]+)/);
          if (l && l.length > 4) {
            UTIL.log({
              msg: "【逃犯】" + l[2] + "-" + l[4] + " : " + l[1],
              type: "TF",
              time: new Date().getTime(),
            });
            if (PLU.getCache("listenTF") == 1 && UTIL.inHome()) {
              if (!PLU.TMP.lis_TF_list) {
                PLU.splitTFParam();
              }
              if (PLU.TMP.lis_TF_list.includes(l[1])) {
                let idx = PLU.TMP.lis_TF_list.findIndex((k) => k == l[1]);
                if (idx >= 0) {
                  let gb = Number(PLU.getCache("listenTF_keys").split("|")[0]) || 0;
                  PLU.goTaofan(l[1], l[2], l[3], gb, PLU.TMP.lis_TF_force[idx]);
                }
              }
            }
          }
        } else if (msgTxt.match("跨服時空")) {
          let l = msgTxt.match(/跨服：(.*)逃到了跨服時空(.*)之中，青龍會組織懸賞(.*)懲治惡人，眾位英雄快來誅殺。/);
          if (l && l.length > 3) {
            UTIL.log({
              msg: "【跨服青龍】" + l[2] + " - " + l[1].padEnd(8) + "  獎品:" + l[3],
              type: "KFQL",
              time: new Date().getTime(),
            });
            if (PLU.getCache("listenKFQL") == 1) {
              let keysStr = PLU.getCache("listenKFQL_keys")
                .split("|")[1]
                .split(",")
                .map((e) => (e == "*" ? ".*" : e.replace("*", "\\*")))
                .join("|");
              let reg = new RegExp(keysStr);
              if (PLU.developerMode && l[3].match(reg) && UTIL.inHome()) {
                UTIL.addSysListener("KuaFu", (b, type, subtype, msg) => {
                  if (b.get("map_id") == "kuafu") {
                    UTIL.delSysListener("KuaFu");
                    PLU.goQinglong(l[1], l[2], PLU.getCache("listenKFQL_keys").split("|")[0], true);
                  }
                });
                setTimeout(() => {
                  clickButton("change_server world;");
                }, 500);
              }
            }
          }
        }
        //江湖紛爭
        else if (msgTxt.match("江湖紛爭")) {
          let fz = msgTxt.match(
            /【江湖紛爭】：(.*)(門派|流派)的(.*)劍客傷害同門，欺師滅組，判師而出，卻有(.*)堅持此種另有別情而強行庇護，兩派紛爭在(.*)-(.*)一觸即發，江湖同門速速支援！/,
          );
          if (!fz) return;
          let ro = fz[3];
          let pl = fz[5] + "-" + fz[6];
          let vs = fz[1] + " VS " + fz[4];
          let tp = fz[2];
          let logType = tp == "門派" ? "MPFZ" : "LPFZ";
          UTIL.log({
            msg: "【" + tp + "之爭】 " + ro + "  地點:[" + pl + "]  " + vs,
            type: logType,
            time: new Date().getTime(),
          });
          if (tp == "門派") {
            let nowTime = new Date().getTime();
            for (let k in PLU.MPFZ) {
              if (k < nowTime) delete PLU.MPFZ[k];
            }
            let extime = new Date().getTime() + 1560000;
            PLU.MPFZ[extime] = { n: ro, p: pl, v: vs, t: new Date().getTime() };
            UTIL.setMem("MPFZ", JSON.stringify(PLU.MPFZ));
          }
        }
        //遊俠
        else if (msgTxt.match("出來闖盪江湖了")) {
          let yx = msgTxt.match(/【系統】遊俠會：聽說(.*)出來闖盪江湖了，目前正在前往(.*)的路上/);
          if (!yx) return;
          let yn = $.trim(yx[1]);
          let yp = yx[2];
          let yr = "";
          PLU.YFD.youxiaList.forEach((g) => {
            if (g.v.includes(yn)) yr = g.n;
          });
          UTIL.log({
            msg: "【遊俠-" + yr + "】 " + yn + "  地點:[" + yp + "]  ",
            type: "YX",
            time: new Date().getTime(),
          });
          if (PLU.getCache("listenYX") == 1 && UTIL.inHome()) {
            if (!PLU.TMP.listenYX_list) {
              PLU.TMP.listenYX_list = PLU.getCache("listenYX_keys").split(",");
            }
            if (PLU.TMP.listenYX_list && PLU.TMP.listenYX_list.includes(yn)) {
              let jhName = PLU.fixJhName(yp);
              let jhMap = PLU.YFD.mapsLib.Map.find((e) => e.name == jhName);
              if (!jhMap) return;
              else {
                let ways = jhMap.way.split(";");
                PLU.goFindYouxia({ paths: ways, idx: 0, objectNPC: yn });
              }
            }
          }
        }
      });
      //監聽場景
      UTIL.addSysListener("listenRoomInfo", (b, type, subtype, msg) => {
        if (type != "jh") return;
        //奇俠加按鈕
        $("#out .out>button.cmd_click3").each((i, e) => {
          if (PLU.YFD.qixiaList.includes(e.innerText)) {
            let snpc = e.outerHTML.match(/clickButton\('look_npc (\w+)'/i);
            if (snpc && snpc.length >= 2) {
              $(e).css({ position: "relative" });
              let $btnAsk = $(
                '<span style="position:absolute;display:inline-block;left:0;top:0;padding:3% 5%;text-align:center;background:#39F;color:#fff;border-radius:3px;font-size:1.2em;">問<span>',
              );
              let $btnGold = $(
                '<span style="position:absolute;display:inline-block;right:0;bottom:0;padding:3% 5%;text-align:center;background:#F93;color:#fff;border-radius:3px;font-size:1.2em;">金<span>',
              );
              $(e).append($btnAsk);
              $(e).append($btnGold);
              $btnAsk.click((e) => {
                e.stopPropagation();
                PLU.execActions("ask " + snpc[1] + ";");
              });
              $btnGold.click((e) => {
                e.stopPropagation();
                let ename = snpc[1].split("_")[0];
                PLU.execActions("auto_zsjd20_" + ename + ";golook_room");
              });
            }
          }
        });
        //監聽入隊靈鷲和塔
        if (type == "jh" && subtype == "info" && PLU.getCache("autoQuitTeam") == 1) {
          let sn = g_obj_map.get("msg_room").get("short");
          if (
            sn.match(/靈鷲宮(\D+)層/) ||
            sn.match(/拱辰樓(\D+)層/) ||
            sn.match(/陳異叔(\D+)層/) ||
            sn.match(/無為寺(\D+)層/) ||
            sn.match(/一品堂(\D+)層/) ||
            sn.match(/名將堂(\D+)層/) ||
            sn.match(/魔皇殿(\D+)層/) ||
            sn.match(/藏典塔(\D+)層/) ||
            sn.match(/無相樓(\D+)層/) ||
            sn.match(/葬劍谷(\D+)層/) ||
            sn.match(/霹靂堂(\D+)層/) ||
            sn.match(/鑄劍洞(\D+)層/) ||
            sn.match(/劍樓(\D+)層/) ||
            sn.match(/紅螺寺(\D+)層/) ||
            sn.match(/通天塔(\D+)層/)
          ) {
            //退出隊伍
            let quitTeamPrevTimeOut = setTimeout(() => {
              UTIL.delSysListener("quitTeamPrev");
            }, 5000);
            UTIL.addSysListener("quitTeamPrev", (b, type, subtype, msg) => {
              if (type == "team" && subtype == "info") {
                UTIL.delSysListener("quitTeamPrev");
                clearTimeout(quitTeamPrevTimeOut);
                clickButton("prev");
              }
            });
            clickButton("team quit");
          }
        }
        //刷新後恢復監聽幫五
        if (type == "jh" && subtype == "info" && PLU.TMP.listenBangFive == undefined) {
          let roomName = UTIL.filterMsg(g_obj_map.get("msg_room").get("short"));
          if (roomName.match(/蒙古高原|成吉思汗的金帳/)) {
            PLU.inBangFiveEvent();
          } else {
            PLU.TMP.listenBangFive = false;
          }
        }
        return;
      });
      UTIL.addSysListener("useCard", (b, type, subtype, msg) => {
        if (type == "notice" && subtype == "notify_fail" && msg.indexOf("今日已達到謎題數量限制。") >= 0) {
          PLU.execActions("items use obj_mitiling;#5 items use miticska");
        }
      });
      // 谜题密码
      UTIL.addSysListener("key", (b, type, subtype, msg) => {
        if (type != "channel" || subtype != "tell") return;
        let key = msg.match(/告訴你：謎題密碼：(\d+)/)[1];
        if (key)
          PLU.TODO.push({
            type: "cmds",
            cmds: "jh 1;e;n;n;n;n;w;event_1_65953349 " + key + ";home;",
            timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
          });
      });
      // 監聽閒聊
      UTIL.addSysListener("listenChat", (b, type, subtype, msg) => {
        if (type != "channel" || subtype != "chat") return;
        /** UNICODE 15.0
         * CJK Radicals Supplement 2E80–2EFF
         * CJK Unified Ideographs (Han) 4E00–9FFF
         * CJK Extension A 3400-4DBF
         * CJK Extension B 20000–2A6DF
         * CJK Extension C 2A700–2B739
         * CJK Extension D 2B740–2B81D
         * CJK Extension E 2B820–2CEA1
         * CJK Extension F 2CEB0–2EBE0
         * CJK Extension G 30000–3134A
         * CJK Extension H 31350–323AF
         */
        msg = msg.replace("\f", "");
        let text = msg.match(/^[^：]+：.*?([\u2E80-\u2EFF\u3400-\u4DBF\u4E00-\u9FFF\-，”'!！]+道：.+)\x1B\[2;37;0m/);
        if (text) {
          text = text[1];
          if (text.match(/柴紹|李秀寧|大鸛淜洲/)) {
            /**
             * 李秀寧昨天撿到了我幾十輛銀子
             * 李秀寧鬼鬼祟祟的叫人生疑
             * 李秀寧竟對我橫眉瞪眼的
             * 竟然吃了李秀寧的虧
             * 李秀寧竟敢得罪我
             * 被李秀寧搶走了
             * 李秀寧好大膽
             * 想找李秀寧
             * 藏在了(天龍寺-)?大鸛淜洲
             * 想要一件天羅紫芳衣
             */
            UTIL.log({
              msg: "【謎題-天命丹】" + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(/陰九幽|潛龍|谷底石室/)) {
            UTIL.log({
              msg: "【謎題-鬼殺劍】" + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(/打坐老僧|牟尼樓|牟尼洞/)) {
            UTIL.log({
              msg: "【謎題-700級讀書識字】" + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(/本恆禪師|無相堂/)) {
            UTIL.log({
              msg: "【謎題-木棉袈裟】" + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(/天羅紫芳衣/)) {
            UTIL.log({
              msg: "【謎題-天命丹】" + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(/鬼殺劍|金鳳翅盔/)) {
            UTIL.log({
              msg: "【謎題-鬼殺劍】" + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(/麻布僧衣/)) {
            UTIL.log({
              msg: "【謎題-700級讀書識字】" + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          } else if (text.match(/追風棍|木棉袈裟/)) {
            UTIL.log({
              msg: "【謎題-木棉袈裟】" + text,
              type: "TIPS",
              time: new Date().getTime(),
            });
          }
        }
        let text2 = msg.match(/[^：]+：(.+)\x1B\[2;37;0m/)[1];
        if (PLU.getCache("listenChat") == 1 && text2 != "哈哈，我也來闖盪江湖啦！" && text2 != "哈哈，我去也……") YFUI.writeToOut(msg);
        let text3 = msg.match(/^[^：]+：(.+道)：(.+)\x1B\[2;37;0m/);
        if (text3) var tmp = PLU.queryNpc(text3[1], true);
        else {
          let text3 = msg.match(/^[^：]+：(.+)的謎題\x1B\[2;37;0m/);
          if (text3) var tmp = PLU.queryNpc(text3[1] + "道", true);
        }

        if (tmp && tmp.length && PLU.getCache("listenPuzzle") == 1) {
          PLU.TMP.autotask = true;
          for (var npc of tmp) {
            PLU.TODO.push({
              type: "func",
              cmds: "execActions",
              param: [
                npc.way,
                (code, name) => {
                  let npcObj = UTIL.findRoomNpc(name, 0, 1);
                  if (npcObj) PLU.execActions("ask " + npcObj.key);
                },
                npc.name_new ?? npc.name_tw ?? npc.name,
              ],
              timeout: new Date().getTime() + 15 * 60 * 1000,
            });
          }
        }
      });
      //監聽練習
      UTIL.addSysListener("listenPractice", (b, type, subtype, msg) => {
        if (type == "practice" && subtype == "stop_practice" && PLU.getCache("autoLX") == 1) {
          let skillId = b.get("sid"),
            lxcmds = "enable " + skillId + ";practice " + skillId;
          if (UTIL.inHome()) PLU.execActions(lxcmds);
          else
            PLU.TODO.push({
              type: "cmds",
              cmds: lxcmds,
              timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
            });
        }
      });
      //監聽劍陣
      UTIL.addSysListener("listenJianzhen", (b, type, subtype, msg) => {
        if (type != "notice") return;
        if (msg.indexOf("陣升級完畢！") < 0) return;
        let msgTxt = UTIL.filterMsg(msg);
        if (msgTxt.match(/(.*)陣升級完畢！成功升級到/)) {
          setTimeout(() => {
            let jzcmds = "hhjz xiulian go;;;hhjz speedup go;";
            let room = g_obj_map.get("msg_room")?.get("short");
            if (room == "桃溪" || room == "後山茶園" || UTIL.inHome()) PLU.execActions(jzcmds);
            else
              PLU.TODO.push({
                type: "cmds",
                cmds: jzcmds,
                timeout: new Date().getTime() + 8 * 60 * 60 * 1000,
              });
          }, 8000);
        }
      });
      //監聽跟殺
      UTIL.addSysListener("listenFightKill", (b, type, subtype, msg) => {
        if (type != "main_msg" || !msg) return;
        if (msg.indexOf("對著") < 0) return;
        if (PLU.getCache("followKill") != 1) return;
        let msgTxt = UTIL.filterMsg(msg);
        var matchKill = msgTxt.match(/(.*)對著(.*)喝道：「(.*)！今日不是你死就是我活！」/);
        if (matchKill && $.trim(matchKill[1]) != "你" && $.trim(matchKill[2]) != "你" && !g_gmain.is_fighting) {
          PLU.toCheckFollowKill($.trim(matchKill[1]), $.trim(matchKill[2]), "kill", msgTxt);
          return;
        }
        var matchFight = msgTxt.match(/(.*)對著(.*)說道：(.*)，領教(.*)的高招！/);
        if (matchFight && $.trim(matchFight[1]) != "你" && $.trim(matchFight[2]) != "你" && !g_gmain.is_fighting) {
          PLU.toCheckFollowKill($.trim(matchFight[1]), $.trim(matchFight[2]), "fight", msgTxt);
          return;
        }
      });
      UTIL.addSysListener("room", (b, type, subtype, msg) => {
        if (type == "jh") {
          if (subtype == "info") {
            unsafeWindow.hasReachRoom = true;
            if (PLU.TMP.puzzleWating.puzzleid) {
              if (PLU.TMP.puzzleWating.status == "trace") {
                PLU.TMP.puzzleWating.status = "traced";
                PLU.autoPuzzle.doPuzzle(PLU.TMP.puzzleWating.puzzleid);
              } else if (PLU.TMP.puzzleWating.status == "return") {
                PLU.TMP.puzzleWating.status = "returned";
                PLU.autoPuzzle.doPuzzle(PLU.TMP.puzzleWating.puzzleid);
              }
            }
          } else if (subtype == "new_item" || subtype == "new_npc") {
            var name = PLU.autoPuzzle.ansiToHtml(b.get("name")),
              plainName = ansi_up.ansi_to_text(b.get("name")),
              id = b.get("id");
            if (PLU.TMP.puzzleWating && PLU.TMP.puzzleWating.puzzleid && PLU.TMP.puzzleWating.status == "wait") {
              if (subtype == "new_npc") {
                if (
                  ["npc_datan", "answer", "ask", "fight", "kill", "give"].indexOf(PLU.TMP.puzzleWating.actionCode) > -1 &&
                  (name == PLU.TMP.puzzleWating.target ||
                    (PLU.TMP.puzzleWating.target == "惡人" && id.indexOf("eren") == 0) ||
                    (PLU.TMP.puzzleWating.target == "捕快" && id.indexOf("bukuai") == 0) ||
                    (["柳繪心", "王鐵匠", "楊掌櫃", "客商", "柳小花", "賣花姑娘", "劉守財", "方老闆", "朱老伯", "方寡婦"].indexOf(PLU.TMP.puzzleWating.target) > -1 &&
                      id.indexOf("bad_target_") == 0))
                ) {
                  PLU.execActions(PLU.TMP.puzzleWating.actionCode + " " + id);
                } else if (PLU.TMP.puzzleWating.actionCode == "killget" && plainName == PLU.TMP.puzzleWating.waitTargetName) {
                  PLU.execActions("kill " + id);
                }
              } else if (
                subtype == "new_item" &&
                ["get"].indexOf(PLU.TMP.puzzleWating.actionCode) > -1 &&
                (name == PLU.TMP.puzzleWating.target ||
                  (PLU.TMP.puzzleWating.target == "惡人" && id.indexOf("eren") == 0) ||
                  (PLU.TMP.puzzleWating.target == "捕快" && id.indexOf("bukuai") == 0) ||
                  (["柳繪心", "王鐵匠", "楊掌櫃", "客商", "柳小花", "賣花姑娘", "劉守財", "方老闆", "朱老伯", "方寡婦"].indexOf(PLU.TMP.puzzleWating.target) > -1 &&
                    id.indexOf("bad_target_") == 0) ||
                  id.indexOf("corpse") > -1)
              ) {
                PLU.execActions("get " + id);
              }
            }
          }
        }
      });
      //test
      UTIL.addSysListener("testListener", (b, type, subtype, msg) => {
        if (type == "g_login" && subtype == "login_ret" && msg == "1") {
          YFUI.writeToOut("<span style='color:#FFF;background:#F00;'>[" + UTIL.getNow() + "] 斷線重連了 </span>");
        }
      });
      UTIL.addSysListener("disconnect", (b, type, subtype, msg) => {
        if (type == "disconnect" && subtype == "change") {
          console.log("%c%s", "color:#F00", ">>>>>>>sock disconnected");
          //sock && sock.close(); sock = 0
          if (PLU.getCache("autoConnect") == 1) {
            let recTime = Number(PLU.getCache("autoConnect_keys"));
            if (recTime) g_gmain.g_delay_connect = recTime;
          }
        }
      });
      unsafeWindow.sock.on("telnet_connected", () => {
        console.log("%c%s", "color:#0F0", ">>>>>>>sock connected");
      });
      UTIL.addSysListener("YXSkillsListener", (b, type, subtype, msg) => {
        if (type != "show_html_page") return;
        if (msg.indexOf("須傳授技能") < 0) return;
        let list = msg.match(/\x1B\[1;36m(\d+)\/(\d+)[\s\S]{1,200}(fudi juxian up_skill .* 10)/g);
        let outList = null;
        if (list && list.length) {
          outList = list.map((s) => {
            let r = s.match(/\x1B\[1;36m(\d+)\/(\d+)[\s\S]{1,200}(fudi juxian up_skill .* 10)/);
            return { lvl: r[1], max: r[2], cmd: r[3] + "0" };
          });
        }
        PLU.TMP.CUR_YX_SKILLS = outList;
        let matchNameLine = msg.match(/<span class="out2">([\s\S]+)<\/span><span class="out2">/);
        let npcNameLine = matchNameLine ? UTIL.filterMsg(matchNameLine[1]) : "";
        let dg = npcNameLine.match(/(\d+)級/)[1];
        PLU.TMP.CUR_YX_LEVEL = Number(dg);
        let nn = msg.match(/fudi juxian upgrade (\S+) 1/)[1];
        PLU.TMP.CUR_YX_ENG = nn;
      });
      UTIL.addSysListener("masterSkillsListener", (b, type, subtype, msg) => {
        if (type != "master_skills" || subtype != "list") return;
        let masterSkills = PLU.parseSkills(b);

        PLU.TMP.MASTER_ID = b.get("id");
        PLU.TMP.MASTER_SKILLS = masterSkills;
      });
    },
    //================================================================================================
    initTickTime() {
      setInterval(() => {
        let nowDate = new Date();
        let nowTime = nowDate.getTime();
        if (PLU.TODO.length > 0 && !PLU.STATUS.isBusy && UTIL.inHome()) {
          //待辦
          let ctd = PLU.TODO.shift();
          if (nowDate.getTime() < ctd.timeout) {
            if (ctd.type == "cmds") {
              PLU.execActions(ctd.cmds);
            } else if (ctd.type == "func") {
              if (ctd.param) PLU[ctd.cmds](...ctd.param);
              else PLU[ctd.cmds]();
            }
          }
        }
        if ($("#topMonitor").text() != "") $("#topMonitor").empty();
        let bi = 0;
        for (let k in PLU.MPFZ) {
          if (k < nowTime) delete PLU.MPFZ[k];
          else {
            let f = PLU.MPFZ[k];
            let dt = Math.floor((k - nowTime) / 1000);
            let flo = bi % 2 == 1 ? "float:right;text-align:right;" : "";
            $("#topMonitor").append(
              `<div title="${f.v}" style="display:inline-block;width:40%;${flo}">${f.n.substr(0, 1)} <span style="color:#9CF;">[${f.p
              }]</span> <span style="color:#DDD;">${dt}</span></div>`,
            );
            bi++;
          }
        }
        if (PLU.ONOFF["btn_bt_waitCDKill"] && PLU.TMP.DATA_MPFZ) PLU.toCheckAndWaitCDKill(nowTime);
      }, 1000);
    },
    //================================================================================================
    toSignIn() {
      if (!this.signInMaps) this.initSignInMaps();
      let ckeds = PLU.getCache("signInArray")?.split(",") || this.signInMaps.map((e, i) => i);

      let htm = '<div style="display:flex;flex-direction:row;flex-wrap: wrap;justify-content: space-between;width: 100%;align-content: flex-start;line-height:2;">';
      this.signInMaps.forEach((e, i) => {
        if (!e.n) htm += '<span style="width:92px;">&nbsp;</span>';
        else
          htm += `<span><button class="signInBtn" data-sid="${i}" style="font-size:12px;padding:1px 2px;cursor:pointer;">GO</button>
            <label data-id="${i}" style="font-size:13px;margin:0 3px 5px 0;">${e.n}<input type="checkbox" name="signInId" value="${i}"
             ${ckeds.includes(i + "") || e.f ? "checked" : ""} ${e.f ? "disabled" : ""} /></label></span>`;
      });
      htm += '</div><button class="signInAll" style="cursor:pointer;position:absolute;left:15px;bottom:10px;">全選</button>';
      YFUI.showPop({
        title: "簽到",
        text: htm,
        width: "360px",
        okText: "一鍵簽到",
        onOk(e) {
          let checkeds = [];
          e.find('input[name="signInId"]:checked').each((i, b) => {
            checkeds.push(b.value);
          });
          PLU.setCache("auto9H", 1);
          PLU.setCache("signInArray", checkeds.join(","));
          PLU.goSign(checkeds);
        },
        onNo() { },
        afterOpen($el) {
          $el.find(".signInBtn").click((e) => {
            let btnSid = $(e.currentTarget).attr("data-sid");
            PLU.goSign(btnSid);
          });
          $el.find(".signInAll").click((e) => {
            $el.find('input[name="signInId"]').each(function () {
              $(this).prop("checked", true);
            });
          });
        },
      });
    },
    //================================================================================================
    autoSwords(callback) {
      UTIL.addSysListener("sword", (b, type, subtype, msg) => {
        if (type != "notice" || msg.indexOf("試劍") == -1) return;
        if (msg.indexOf("5/5") > 0 || !msg.indexOf("你今天試劍次數已達限額")) {
          UTIL.delSysListener("sword");
          callback && callback();
        } else PLU.execActions("swords fight_test go");
      });
      PLU.execActions("swords;swords select_member heimuya_dfbb;swords select_member qingcheng_mudaoren;swords select_member tangmen_madam;swords fight_test go");
    },
    //================================================================================================
    autoGetVipReward(callback) {
      let acts = "";
      let vipInfo = g_obj_map.get("msg_vip");
      if (vipInfo.get("get_vip_drops") == 0) acts += "vip drops;";
      if (vipInfo.get("finish_sort") % 1000 < 5) acts += "#5 vip finish_sort;";
      if (vipInfo.get("finish_dig") % 1000 < 10) acts += "#10 vip finish_dig;";
      if (vipInfo.get("finish_diaoyu") % 1000 < 10) acts += "#10 vip finish_diaoyu;";
      if (vipInfo.get("do_task_num") % 1000 < 10) acts += "#10 vip finish_big_task;";
      if (vipInfo.get("family_quest_count") % 1000 < 25) acts += "#25 vip finish_family;";
      if (g_obj_map.get("msg_clan_view") && vipInfo.get("clan_quest_count") % 1000 < 20) acts += "#20 vip finish_clan;";
      if (vipInfo.get("saodang_fb_1")?.split(",")[2] || 0 % 1000 < 2) acts += "#2 vip finish_fb dulongzhai;";
      if (vipInfo.get("saodang_fb_2")?.split(",")[2] || 0 % 1000 < 2) acts += "#2 vip finish_fb junying;";
      if (vipInfo.get("saodang_fb_3")?.split(",")[2] || 0 % 1000 < 2) acts += "#2 vip finish_fb beidou;";
      if (vipInfo.get("saodang_fb_4")?.split(",")[2] || 0 % 1000 < 2) acts += "#2 vip finish_fb youling;";
      if (vipInfo.get("saodang_fb_5")?.split(",")[2] || 0 % 1000 < 1) acts += "vip finish_fb siyu;";
      if (vipInfo.get("saodang_fb_6")?.split(",")[2] || 0 % 1000 < 1) acts += "vip finish_fb changleweiyang;";
      if (vipInfo.get("saodang_fb_7")?.split(",")[2] || 0 % 1000 < 1) acts += "vip finish_fb heishuihuangling;";
      if (vipInfo.get("saodang_fb_8")?.split(",")[2] || 0 % 1000 < 1) acts += "vip finish_fb jiandangfenglingdu;";
      if (vipInfo.get("saodang_fb_9")?.split(",")[2] || 0 % 1000 < 1) acts += "vip finish_fb tianshanlongxue;";
      if (vipInfo.get("saodang_fb_10")?.split(",")[2] || 0 % 1000 < 1) acts += "vip finish_fb sizhanguangmingding;";
      acts += "home;";
      PLU.execActions(acts, () => {
        callback && callback();
      });
    },
    autoShaodan(callback) {
      let acts = "";
      let vipInfo = g_obj_map.get("msg_vip");
      let isVip = vipInfo.get("vip_tm") > 0;
      if (vipInfo.get("saodang_fb_1")?.split(",")[2] || 0 % 1000 < 2) {
        if (isVip) acts += "#2 vip finish_fb dulongzhai;";
        else
          acts +=
            "team create;fb 1;;kill?獨龍寨土匪;n;;kill?獨龍寨土匪;n;;kill?獨龍寨土匪;n;;kill?獨龍寨土匪;n;;kill?傅一鏢;" +
            "team create;fb 1;;kill?獨龍寨土匪;n;;kill?獨龍寨土匪;n;;kill?獨龍寨土匪;n;;kill?獨龍寨土匪;n;;kill?傅一鏢;";
      }
      if (vipInfo.get("saodang_fb_2")?.split(",")[2] || 0 % 1000 < 2)
        if (isVip) acts += "#2 vip finish_fb junying;";
        else
          acts +=
            "team create;fb 2;;kill?護衛;;kill?小兵;;kill?小兵;e;n;event_1_48728674;fb 2;e;s;event_1_41361248;fb 2;e;e;;kill?護衛;event_1_43484736;;kill?護衛;@赫造基的屍體;@嚴廷殷的屍體;" +
            "team create;fb 2;;kill?護衛;;kill?小兵;;kill?小兵;e;n;event_1_48728674;fb 2;e;s;event_1_41361248;fb 2;e;e;;kill?護衛;event_1_43484736;;kill?護衛;";
      if (vipInfo.get("saodang_fb_3")?.split(",")[2] || 0 % 1000 < 2) {
        if (isVip) acts += "#2 vip finish_fb beidou;";
        else
          acts +=
            "team create;fb 3;w;;kill?天璇劍客;e;s;;kill?玉衡劍客;n;e;;kill?瑤光劍客;event_1_9777898;;kill?天樞劍客;@天樞劍客的屍體;" +
            "team create;fb 3;w;;kill?天璇劍客;e;s;;kill?玉衡劍客;n;e;;kill?瑤光劍客;event_1_9777898;;kill?天樞劍客;";
      }
      if (vipInfo.get("saodang_fb_4")?.split(",")[2] || 0 % 1000 < 2) {
        if (isVip) acts += "#2 vip finish_fb youling;";
        else
          acts +=
            "team create;fb 4;n;;kill?翻雲刀神;n;;kill?織冰女俠;n;;kill?覆雨劍神;n;;kill?排雲狂神;n;;kill?九天老祖;" +
            "team create;fb 4;n;;kill?翻雲刀神;n;;kill?織冰女俠;n;;kill?覆雨劍神;n;;kill?排雲狂神;n;;kill?九天老祖;";
      }
      if (vipInfo.get("saodang_fb_5")?.split(",")[2] || 0 % 1000 < 1) {
        if (isVip) acts += "vip finish_fb siyu;";
        else
          acts +=
            "team create;fb 5;event_1_26662342;;kill?勾陳教香主;se;;kill?勾陳教掌教;nw;nw;event_1_15727082;;kill?紫薇教香主;nw;;kill?紫薇教掌教;se;se;event_1_12238479;;kill?長生教香主;sw;;kill?長生教掌教;ne;ne;event_1_889199;;kill?後土教香主;ne;;kill?後土教掌教;sw;sw;;;;;;;event_1_77337496;;kill?後土真人;";
      }
      if (vipInfo.get("saodang_fb_6")?.split(",")[2] || 0 % 1000 < 1) {
        if (isVip) acts += "vip finish_fb changleweiyang;";
        else
          acts +=
            "team create;fb 6;event_1_94101353;;kill?黃門丞;event_1_8221898;;kill?少府卿;event_1_18437151;;kill?羽林衛;event_1_74386803;;kill?舞樂令;event_1_39816829;event_1_92691681;event_1_19998221;event_1_62689078;;kill?羽林中郎將;event_1_85127800;;ask changleweiyang_jiangzuodajiang;event_1_39026868;;kill?大司馬;s;;kill?未央公主;";
      }
      if (vipInfo.get("saodang_fb_7")?.split(",")[2] || 0 % 1000 < 1)
        if (isVip) acts += "vip finish_fb heishuihuangling;";
        else
          acts +=
            "team create;fb 7;event_1_20980858;;kill?斷龍斧衛;fb 7;event_1_81463220;;kill?金錘力士;fb 7;event_1_5770640;;kill?重甲矛士;fb 7;event_1_56340108;;kill?大夏神箭;event_1_21387224;s;;kill?金錘虎將;event_1_94902320;";
      if (vipInfo.get("saodang_fb_8")?.split(",")[2] || 0 % 1000 < 1)
        if (isVip) acts += "vip finish_fb jiandangfenglingdu;";
        else
          acts +=
            "team create;fb 8;n;;kill?夜傷;n;;kill?百裡傷;fb 8;e;;kill?夜幽女;e;;kill?千夜女使;fb 8;w;kill?夜殺;w;;kill?燭夜長老;fb 8;s;;kill?夜刺;s;;kill?千夜刺將;event_1_28034211;;kill?風陵總管;event_1_17257217;";
      if (vipInfo.get("saodang_fb_9")?.split(",")[2] || 0 % 1000 < 1)
        if (isVip) acts += "vip finish_fb tianshanlongxue;";
        else acts += "team create;fb 9;;kill?劍影;n;;kill?劍浪;n;;kill?劍豹;n;;kill?劍蟒;n;;kill?劍飛;n;;kill?劍神;";
      acts += "home;";
      PLU.execActions(acts, () => {
        callback && callback();
      });
    },
    //================================================================================================
    getClanInfo(callback) {
      let openClanTimeout = setTimeout(() => {
        UTIL.delSysListener("listenOpenClan");
        callback && callback(0);
      }, 5000);
      UTIL.addSysListener("listenOpenClan", (b, type, subtype, msg) => {
        if (type == "clan") {
          UTIL.delSysListener("listenOpenClan");
          clearTimeout(openClanTimeout);
          clickButton("prev");
          //console.log(g_obj_map.get("msg_clan_view"))
          callback && callback(1);
        }
      });
      clickButton("clan");
    },
    getVipInfo(callback) {
      let openVipTimeout = setTimeout(() => {
        UTIL.delSysListener("listenOpenVip");
        callback && callback(0);
      }, 5000);
      UTIL.addSysListener("listenOpenVip", (b, type, subtype, msg) => {
        if (type == "vip") {
          UTIL.delSysListener("listenOpenVip");
          clearTimeout(openVipTimeout);
          clickButton("prev");
          //console.log(g_obj_map.get("msg_vip"))
          callback && callback(1);
        }
      });
      clickButton("vip");
    },
    //================================================================================================
    goSign(param) {
      if (!param) {
        return YFUI.writeToOut("<span style='color:#FFF;'>--結束--</span>");
      } else if (param.length == 0) {
        return YFUI.writeToOut("<span style='color:#FFF;'>--簽到結束--</span>");
      }
      let sid = null;
      if (typeof param == "object") {
        sid = param.shift();
      } else {
        sid = param;
        param = null;
      }
      let signD = PLU.signInMaps[sid];
      if (signD.c != undefined) {
        if (signD.c()) {
          if (signD.fn) {
            signD.fn(() => {
              PLU.goSign(param);
            });
          } else if (signD.go) {
            PLU.execActions(signD.go, () => {
              PLU.goSign(param);
            });
          }
        } else {
          PLU.goSign(param);
        }
      } else {
        if (signD.fn) {
          signD.fn(() => {
            PLU.goSign(param);
          });
        } else if (signD.go) {
          PLU.execActions(signD.go, () => {
            PLU.goSign(param);
          });
        }
      }
    },
    //================================================================================================
    initSignInMaps() {
      let _this = this;
      this.getVipInfo((b) => {
        _this.getClanInfo((a) => { });
      });
      this.signInMaps = [
        {
          n: "揚州簽到",
          f: true,
          go: "jh 5;n;n;n;w;look_npc yangzhou_yangzhou4;sign7;home;",
        },
        {
          n: "每日禮包",
          f: true,
          go: "jh 1;event_1_48246976;event_1_85373703;home;",
        },
        { n: "潛龍禮包", go: "jh 1;w;event_1_76648488;event_1_21318613;home;" },
        { n: "續約會員", go: "jh 1;event_1_45018293;home;" },
        {
          n: "分享獎勵",
          go: "share_ok 1;share_ok 2;share_ok 3;share_ok 4;share_ok 5;share_ok 7;home;",
        },
        {
          n: "南詔投資",
          go: "jh 54;#4 nw;#2 w;#4 n;#2 e;n;#2 e;event_1_62143505 go;;;event_1_62143505 get;event_1_63750325 get;home;",
        },
        {
          n: "消費積分",
          go: "jh 1;e;n;e;e;event_1_44731074;event_1_8041045;event_1_8041045;event_1_29721519;home;",
        },
        { n: "吃九花丸", go: "items use obj_jiuhuayulouwan;" },
        {
          n: "打坐睡床",
          go: "home;exercise stop;exercise;golook_room;sleep_hanyuchuang;home;",
        },
        { n: "買引路蜂", go: "shop money_buy mny_shop2_N_10;home;" },
        {
          n: "領取工資",
          go: "home;work click maikuli;work click duancha;work click dalie;work click baobiao;work click maiyi;work click xuncheng;work click datufei;work click dalei;work click kangjijinbin;work click zhidaodiying;work click dantiaoqunmen;work click shenshanxiulian;work click jianmenlipai;work click dubawulin;work click youlijianghu;work click yibangmaoxiang;work click zhengzhanzhongyuan;work click taofamanyi;public_op3;home;",
        },
        {
          n: "爬樓獎勵",
          go: "home;cangjian get_all;xueyin_shenbinggu blade get_all;xueyin_shenbinggu unarmed get_all;xueyin_shenbinggu throwing get_all;xueyin_shenbinggu spear get_all;xueyin_shenbinggu hammer get_all;xueyin_shenbinggu axe get_all;xueyin_shenbinggu whip get_all;xueyin_shenbinggu stick get_all;xueyin_shenbinggu staff get_all;home;",
        },
        {
          n: "VIP 福利",
          c: function () {
            return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("get_vip_drops") == 0;
          },
          go: "vip drops;",
        },
        {
          n: "VIP 排行",
          c: function () {
            return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("finish_sort") % 1000 < 5;
          },
          go: "#5 vip finish_sort;",
        },
        {
          n: "VIP 尋寶",
          c: function () {
            return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("finish_dig") % 1000 < 10;
          },
          go: "#10 vip finish_dig;",
        },
        {
          n: "VIP 釣魚",
          c: function () {
            return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("finish_diaoyu") % 1000 < 10;
          },
          go: "#10 vip finish_diaoyu;",
        },
        {
          n: "VIP 暴擊",
          c: function () {
            return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("do_task_num") % 1000 < 10;
          },
          go: "#10 vip finish_big_task;",
        },
        {
          n: "VIP 師門",
          c: function () {
            return g_obj_map.get("msg_vip") && g_obj_map.get("msg_vip").get("vip_tm") > 0 && g_obj_map.get("msg_vip").get("family_quest_count") % 1000 < 25;
          },
          go: "#25 vip finish_family;",
        },
        {
          n: "VIP 幫派",
          c: function () {
            return (
              g_obj_map.get("msg_vip") &&
              g_obj_map.get("msg_vip").get("vip_tm") > 0 &&
              g_obj_map.get("msg_clan_view") &&
              g_obj_map.get("msg_vip").get("clan_quest_count") % 1000 < 20
            );
          },
          go: "#20 vip finish_clan;",
        },
        {
          n: "掃盪副本",
          fn: PLU.autoShaodan,
        },
        {
          n: "論劍試劍",
          fn: PLU.autoSwords,
        },
        {
          n: "銀兩上香",
          c: function () {
            return !!g_obj_map.get("msg_clan_view");
          },
          go: "#20 clan incense yx;home;",
        },
        {
          n: "冰火玄鐵",
          go: "jh 35;nw;nw;nw;n;ne;nw;w;nw;e;e;e;e;e;se;n;n;w;n;w;event_1_53278632;sousuo;sousuo;home;",
        },
        {
          n: "俠客看書",
          go: "jh 36;yell;e;ne;ne;ne;e;e;e;event_1_9179222;e;event_1_11720543;home;",
        },
        {
          n: "絕情鱷魚",
          go: "jh 37;n;e;e;nw;nw;w;n;e;n;e;e;e;ne;ne;ne;se;n;event_1_97487911;home;",
        },
        {
          n: "大昭岩畫",
          go: "jh 26;w;w;n;w;w;w;n;n;place?陰山岩畫;event_1_12853448;home;",
        },
        {
          n: "白駝闖陣",
          go: "jh 21;n;n;n;n;w;;kill?青衣盾衛;w;;kill?飛羽神箭;w;;kill?銀狼近衛;w;;fight baituo_junzhongzhushuai;home;",
        },
        {
          n: "青城孽龍",
          go: "jh 15;n;nw;w;nw;n;event_1_14401179;;kill?孽龍之靈;home;",
        },
        {
          n: "峨眉解圍",
          go: "jh 8;ne;e;e;e;n;;kill?赤豹死士;n;n;;kill?黑鷹死士;n;n;;kill?金狼大將;home;",
        },
        {
          n: "破陣採礦",
          go: "jh 26;w;w;n;e;e;event_1_18075497;w;w;n;event_1_14435995;home;",
        },
        { n: "西安採蓮", go: "jh 2;#19 n;e;n;n;n;w;event_1_31320275;home;" },
        { n: "恆山盜賊", go: "jh 9;event_1_20960851;;kill?殺神寨匪首;home;" },
        {
          n: "少林渡劫",
          go: "jh 13;e;s;s;w;w;w;;event_1_38874360;;kill?渡風神識;home;",
        },
        {
          n: "白馱奇襲",
          go: "jh 21;n;n;n;n;e;e;e;e;e;e;e;s;s;event_1_66710076;s;e;ne;e;se;n;event_1_53430818;n;;kill?豹軍主帥;s;s;nw;n;n;;kill?虎軍主帥;s;s;se;e;e;e;;kill?鷹軍主帥;w;w;w;nw;w;nw;event_1_89411813;;kill?頡利;home;",
        },
        { n: "唐門冰月", fn: PLU.autoBingyue },
        {
          n: "明教毒魔",
          go: "jh 18;n;nw;n;n;n;n;n;ne;n;n;n;n;n;n;n;n;n;w;nw;nw;event_1_70957287;;kill?九幽毒魔;home;",
        },
        { n: "天山七侠", fn: PLU.TianShan7Xia },
        {
          n: "十八木人",
          go: "jh 41;se;e;e;se;se;se;se;se;se;event_1_57976870;n;n;n;event_1_91914705;e;e;e;e;#2 vent_1_85950082;home;",
        },
        {
          n: "求教阿不",
          go: "jh 31;n;se;e;se;s;s;sw;se;se;e;nw;e;ne;n;ne;n;n;n;n;n;n;n;n;n;w;w;event_1_57281457;event_1_10395181;home;",
        },

        { n: _("自动答题", "自動答題"), fn: PLU.loopAnswerQues },
        { n: "垂釣一夏", go: "jh 5;n;w;event_1_3144437;home;" },
        {
          n: _("暖冬礼包", "暖冬禮包"),
          go: "jh 1;w;event_1_67976578;home;",
        },
        {
          n: "慶典禮包",
          go: "jh 1;#5 w;n;event_1_66563556",
        },
        { n: "", go: "home" },
      ];
    },
    TianShan7Xia(callback) {
      PLU.execActions("jh 39;ne;e;n;ne;ne;n;ne;nw;ne;nw;event_1_17801939;place?星星峽;ne;ne;nw;nw", () => {
        PLU.autoFight({
          targetKey: "\nevent_1_37376258", // 懒的改函数了，直接注入（
          fightKind: " ",
          onFail() {
            PLU.execActions("home;", () => {
              callback && callback();
            });
          },
          onEnd() {
            PLU.execActions("home;", () => {
              callback && callback();
            });
          },
        });
      });
    },
    loopAnswerQues(callback) {
      let setAnswerTimeout = function () {
        PLU.STO.ansTo && clearTimeout(PLU.STO.ansTo);
        PLU.STO.ansTo = setTimeout(() => {
          UTIL.delSysListener("onAnswerQuestions");
          YFUI.writeToOut("<span style='color:#FFF;'>--答案超時！--</span>");
        }, 5000);
      };
      UTIL.addSysListener("onAnswerQuestions", function (b, type, subtype, msg) {
        if (type == "notice" && msg.indexOf("每日武林知識問答次數已經達到限額") > -1) {
          if (callback) callback();
          else clickButton("home");
          UTIL.delSysListener("onAnswerQuestions");
          PLU.STO.ansTo && clearTimeout(PLU.STO.ansTo);
          return;
        }
        if (type != "show_html_page") return;
        var qs = msg.split("\n");
        if (!qs) return;
        if (qs[0].indexOf("知識問答第") < 0) return;
        setAnswerTimeout();
        var qus = "";
        for (var i = 1; i < qs.length; i++) {
          qus = $.trim(UTIL.filterMsg(qs[i]));
          if (qus.length > 0) break;
        }
        if (qus.indexOf("回答正確") >= 0) {
          clickButton("question");
          return;
        }
        var answer = PLU.getAnswer2Question(qus);
        if (answer == null) {
          UTIL.delSysListener("onAnswerQuestions");
          PLU.STO.ansTo && clearTimeout(PLU.STO.ansTo);
          PLU.setBtnRed($btn, 0);
          YFUI.writeToOut("<span style='color:#FFF;'>--未找到答案：" + qus + "--</span>");
          return;
        }
        setTimeout(() => {
          clickButton("question " + answer);
        }, 300);
      });
      setAnswerTimeout();
      clickButton("question");
    },
    //================================================================================================
    getAnswer2Question(localQuestion) {
      var answer = PLU.YFD.QuestAnsLibs[localQuestion];
      if (answer) return answer;
      var halfQuestion = localQuestion.substring(localQuestion.length / 2);
      for (var quest in PLU.YFD.QuestAnsLibs) {
        if (quest.indexOf(halfQuestion) == 0) {
          return PLU.YFD.QuestAnsLibs[quest];
        }
      }
      return null;
    },
    //================================================================================================
    autoBingyue(callback) {
      PLU.execActions("jh 14;w;n;n;n;n;event_1_32682066;;;", () => {
        setTimeout(() => {
          PLU.killBingYue(() => {
            if (callback) callback();
            else clickButton("home");
          });
        });
      });
    },
    //================================================================================================
    killBingYue(endCallback) {
      if (parseInt(PLU.getCache("autoPerform")) < 1) {
        PLU.toggleAutoPerform($("#btn_bt_kg_autoPerform"), "autoPerform", 1);
      }
      let tryKill = function (kname, cb, er) {
        PLU.autoFight({
          targetName: kname,
          fightKind: "kill",
          onFail() {
            er && er();
          },
          onEnd() {
            cb && cb();
          },
        });
      };
      PLU.execActions("event_1_48044005;;;;", () => {
        tryKill(
          "冰麟獸",
          () => {
            PLU.execActions("event_1_95129086;;;;", () => {
              tryKill(
                "玄武機關獸",
                () => {
                  PLU.execActions("event_1_17623983;event_1_41741346;;;;", () => {
                    tryKill(
                      "九幽魔靈",
                      () => {
                        PLU.execActions("s;;;;", () => {
                          tryKill(
                            "冰月仙人",
                            () => {
                              endCallback && endCallback();
                            },
                            () => {
                              endCallback && endCallback();
                            },
                          );
                        });
                      },
                      () => {
                        endCallback && endCallback();
                      },
                    );
                  });
                },
                () => {
                  endCallback && endCallback();
                },
              );
            });
          },
          () => {
            endCallback && endCallback();
          },
        );
      });
    },
    //================================================================================================
    autoXTL1() {
      clickButton("team create");
      PLU.killLHYD((err) => {
        return YFUI.writeToOut("<span style='color:#FFF;'>結束--" + err + "</span>");
      });
    },
    autoXTL2() {
      clickButton("team create");
      PLU.killSY((err) => {
        return YFUI.writeToOut("<span style='color:#FFF;'>結束--" + err + "</span>");
      });
    },
    autoERG() {
      PLU.killERG((err) => {
        return YFUI.writeToOut("<span style='color:#FFF;'>結束--" + err + "</span>");
      });
    },
    scanPuzzle() {
      PLU.TMP.autoscan = true;
      PLU.TMP.autotask = true;
      UTIL.addSysListener("reload", (b, type, subtype, msg) => {
        if (type == "notice" && subtype == "notify_fail" && msg == "你的背包裡沒有這個物品。\n") location.reload();
      });
      if (!PLU.TMP.index) PLU.TMP.index = 0;
      PLU.TMP.func = () => {
        PLU.execActions(PLU.linkPath(PLU.queryRoomPath(), PLU.YFD.mapsLib.Npc_New[PLU.TMP.index].way), () => {
          PLU.execActions(";;ask " + PLU.YFD.mapsLib.Npc_New[PLU.TMP.index].id, () => {
            PLU.TMP.puzzleTimeOut = setTimeout(() => {
              if (!PLU.TMP.puzzleWating.status) {
                PLU.TMP.index++;
                PLU.TMP.func();
              }
            }, PLU.getCache("puzzleTimeOut") * 1000);
          });
        });
      };
      PLU.TMP.func();
    },
    puzzleKey() {
      YFUI.showInput({
        title: "密碼設置",
        text: "此設置跨角色共享<br>指定暴擊密碼由誰提交(輸入角色ID)",
        value: localStorage.getItem("masterAcc") || PLU.accId,
        onOk(val) {
          localStorage.setItem("masterAcc", String(val));
        },
        onNo() { },
      });
    },
    puzzleTimeOut() {
      YFUI.showInput({
        title: "超時設置",
        text: "一條謎題最多耗時(單位：秒)，0爲不超時，暫不推薦設置爲0",
        value: PLU.getCache("puzzleTimeOut") || 60,
        onOk(val) {
          PLU.setCache("puzzleTimeOut", val);
        },
        onNo() { },
      });
    },
    path4FHMJ(endCallback) {
      PLU.execActions("jh");
      if (g_obj_map.get("msg_jh_list") && g_obj_map.get("msg_jh_list").get("finish43") == 0) {
        return "jh 1;e;n;n;n;n;w;event_1_90287255 go 6;e;s;sw;se;ne;se;s";
      } else {
        return "jh 43;sw;sw;sw;s;se;se;se;e;s;sw;se;ne;se;s";
      }
    },
    //琅嬛玉洞
    killLHYD(endCallback) {
      PLU.execActions(PLU.path4FHMJ() + ";event_1_52732806", (f) => {
        if (!f) return endCallback && endCallback(1);
        PLU.execActions("kill langhuanyudong_qixing;;kill langhuanyudong_benkuangxiao;;sw;;kill murong_tuboguoshi;;;get?吐蕃國師的屍體;;", (f2) => {
          if (!f2) return endCallback && endCallback(2);
          PLU.execActions("ne;n;;event_1_96023188;w;event_1_39972900;w;event_1_92817399;w;event_1_91110342;s;event_1_74276536;se;event_1_14726005;se;se;;;", () => {
            let sd = g_obj_map.get("msg_room").elements.find((e) => e.value.indexOf("掃盪") >= 0);
            if (sd) {
              let cmd_sd = g_obj_map.get("msg_room").get(sd.key.split("_")[0]);
              PLU.doSaoDang("langhuanyudong", cmd_sd, () => {
                PLU.killLHYD(endCallback);
              });
            } else {
              endCallback && endCallback(5);
            }
          });
        });
      });
    },
    //山崖
    killSY(endCallback) {
      PLU.execActions(PLU.path4FHMJ() + "event_1_64526228", (f) => {
        if (!f) return endCallback && endCallback(1);
        PLU.execActions("kill shanya_muzhaoxue;;kill shanya_qiongduwu;;kill shanya_yuanzhenheshang;;;", (f2) => {
          if (!f2) return endCallback && endCallback(2);
          PLU.execActions("w;event_1_61179401;n;event_1_93134350;n;event_1_60227051;n;event_1_66986009;;kill mingjiao_mengmianrentoumu;;;;get?蒙面人頭目的屍體;;", () => {
            PLU.execActions("n;event_1_53067175;n;event_1_58530809;w;event_1_86449371;event_1_66983665;;", () => {
              let sd = g_obj_map.get("msg_room").elements.find((e) => e.value.indexOf("掃盪") >= 0);
              if (sd) {
                let cmd_sd = g_obj_map.get("msg_room").get(sd.key.split("_")[0]);
                PLU.doSaoDang("shanya", cmd_sd, () => {
                  PLU.killSY(endCallback);
                });
              } else {
                endCallback && endCallback(5);
              }
            });
          });
        });
      });
    },
    // 恶人谷
    killERG(endCallback) {
      var flag = false;
      PLU.execActions("rank go 236;", (f) => {
        if (!f) return endCallback && endCallback(1);
        PLU.execActions("nw;n;n;n;n;n;n;wait#kill tianlongsi_lidazui;get?李大嘴的屍體", (f2) => {
          if (!f2) return endCallback && endCallback(2);
          PLU.execActions("nw;nw;n;wait#kill tianlongsi_baikaixin;get?白開心的屍體", (f3) => {
            if (!f3) return endCallback && endCallback(3);
          });
        });
      });
    },
    buyJHYL() {
      UTIL.addSysListener("9HYL", (b, type, subtype, msg) => {
        if (type != "show_html_page") return;
        var sp = msg.match(/你有四海商票\u001b\[1;32mx(\d+)\u001b\[2;37;0m/);
        if (!sp) return;
        sp = sp[1];
        if (sp < 21750) return YFUI.writeToOut("<span style='color:#FF0;'>--你的商票不足21750--</span>");
        else
          PLU.execActions(
            "reclaim buy 27 go 45;" + // 矢車菊
            "reclaim buy 46 go 45;" + // 雪英
            "reclaim buy 45 go 45;" + // 忘憂草
            "reclaim buy 29 go 15;" + // 鳳凰木
            "reclaim buy 36 go 5;" + // 洛神花
            "reclaim buy 31 go 45;" + // 君影草
            "reclaim buy 32 go 45;" + // 仙客來
            "reclaim buy 33 go 15;" + // 淩霄花
            "reclaim buy 34 go 15;" + // 夕霧草
            (UTIL.inHome() ? "go_lookroom" : "home"),
          );
        UTIL.delSysListener("9HYL");
      });
      PLU.execActions("reclaim recl");
    },
    //================================================================================================
    execActions(str, endcallback, params) {
      var acs = str
        .split(";")
        .map((e) => {
          let np = e.match(/^#(\d+)\s(.*)/);
          if (np) {
            let r = [];
            for (let i = 0; i < np[1]; i++) r.push(np[2]);
            return r;
          }
          return e;
        })
        .flat()
        .map((e) => {
          if (PLU.YFD.pathCmds[e]) return PLU.YFD.pathCmds[e] + "." + UTIL.rnd();
          return e;
        });
      PLU.actions({
        paths: acs,
        idx: 0,
        onPathsEnd() {
          PLU.STATUS.isBusy = false;
          endcallback && endcallback(true, params);
        },
        onPathsFail() {
          PLU.STATUS.isBusy = false;
          endcallback && endcallback(false, params);
        },
      });
    },
    //================================================================================================
    actions(params) {
      PLU.STATUS.isBusy = true;
      //params:{paths,idx,onPathsEnd,onPathsFail}
      if (params.idx >= params.paths.length) {
        return params.onPathsEnd && params.onPathsEnd();
      }
      let curAct = params.paths[params.idx];
      //null
      if (!curAct) {
        setTimeout(() => {
          params.idx++;
          PLU.actions(params);
        }, 250);
        return;
      }
      // 等待復活
      if (curAct.indexOf("wait#") > -1 || curAct.indexOf("wait ") > -1) {
        let npc = curAct.substring(curAct.indexOf(" ") + curAct.indexOf("?") + 2);
        if (UTIL.getRoomAllNpc().some((e) => e.name == npc || e.key == npc)) {
          if (params.paths[params.idx].indexOf("wait ") > -1) params.idx++;
          else params.paths[params.idx] = params.paths[params.idx].substring(5);
          PLU.actions(params);
        } else
          UTIL.addSysListener("wait", (b, type, subtype, msg) => {
            if (UTIL.inHome()) {
              UTIL.delSysListener("wait");
              params.idx = params.paths.length;
              PLU.actions(params);
            }
            if (type != "jh") return;
            if (subtype == "info") {
              UTIL.delSysListener("wait");
              params.idx = params.paths.length;
              PLU.actions(params);
            }
            if (subtype != "new_npc") return;
            if (b.get("id") == npc || b.get("name") == npc) {
              UTIL.delSysListener("wait");
              if (curAct.indexOf("wait ") > -1) params.idx++;
              else params.paths[params.idx] = params.paths[params.idx].substring(5);
              PLU.actions(params);
            }
          });
        return;
      }
      //對話
      if (curAct.indexOf("ask#") > -1) {
        if (curAct.indexOf("?") > -1) {
          var npc = UTIL.findRoomNpc(curAct.substring(curAct.indexOf("?") + 1), 0, 1)?.key;
        } else {
          var npc = curAct.substring(curAct.indexOf(" ") + 1);
        }
        npc && clickButton("ask " + npc);
        params.paths[params.idx] = params.paths[params.idx].substring(4);
        PLU.actions(params);
        return;
      }
      //去比試
      if (curAct.indexOf("fight?") > -1 || curAct.indexOf("fight ") > -1) {
        let kt = parseInt(PLU.getCache("autoPerform")) < 1 ? "multi" : "";
        PLU.autoFight({
          targetName: curAct.indexOf("fight?") > -1 ? curAct.substring(6) : null,
          targetKey: curAct.indexOf("fight ") > -1 ? curAct.substring(6) : null,
          fightKind: "fight",
          autoSkill: kt,
          onFail() {
            setTimeout(() => {
              params.idx++;
              PLU.actions(params);
            }, 500);
          },
          onEnd() {
            setTimeout(() => {
              params.idx++;
              PLU.actions(params);
            }, 500);
          },
        });
        return;
      }
      //去殺
      if (curAct.indexOf("kill?") > -1 || curAct.indexOf("kill ") > -1) {
        let kt = parseInt(PLU.getCache("autoPerform")) < 1 ? "multi" : "";
        PLU.autoFight({
          targetName: curAct.indexOf("kill?") > -1 ? curAct.substring(5) : null,
          targetKey: curAct.indexOf("kill ") > -1 ? curAct.substring(5) : null,
          autoSkill: kt,
          onFail() {
            setTimeout(() => {
              params.idx++;
              PLU.actions(params);
            }, 500);
          },
          onEnd() {
            setTimeout(() => {
              params.idx++;
              PLU.actions(params);
            }, 500);
          },
        });
        return;
      }
      // 去摸屍體
      if (curAct.indexOf("get?") > -1) {
        UTIL.getItemFrom(curAct.substring(4));
        setTimeout(() => {
          params.idx++;
          PLU.actions(params);
        }, 500);
        return;
      }
      // 去摸屍體
      if (curAct.indexOf("@") > -1) {
        UTIL.getItemFrom(curAct.substring(1));
        setTimeout(() => {
          params.idx++;
          PLU.actions(params);
        }, 500);
        return;
      }
      // 叫船
      if (curAct.indexOf("yell") > -1) {
        let yellBoatTimeout = setTimeout((e) => {
          clearTimeout(yellBoatTimeout);
          UTIL.delSysListener("goYellBoat");
          params.idx++;
          PLU.actions(params);
        }, 120000);
        UTIL.addSysListener("goYellBoat", function (b, type, subtype, msg) {
          if (type == "main_msg" && msg.indexOf("還沒有達到這") > -1) {
            setTimeout(() => {
              clearTimeout(yellBoatTimeout);
              UTIL.delSysListener("goYellBoat");
              PLU.actions(params);
            }, 2000);
            return;
          }
          if (type == "notice" && msg.indexOf("這兒沒有船可以喊") > -1) {
            setTimeout(() => {
              clearTimeout(yellBoatTimeout);
              UTIL.delSysListener("goYellBoat");
              params.idx++;
              PLU.actions(params);
            }, 500);
            return;
          }
          if (type != "jh" || subtype != "info") return;
          for (var key of b.keys()) {
            var val = b.get(key);
            if (val.indexOf("yell") < 0) continue;
            clearTimeout(yellBoatTimeout);
            UTIL.delSysListener("goYellBoat");
            params.idx++;
            PLU.actions(params);
            break;
          }
        });
        clickButton(curAct);
        return;
      }
      //函式
      if (curAct.indexOf("eval_") > -1) {
        eval(curAct.substring(5));
        setTimeout(() => {
          params.idx++;
          PLU.actions(params);
        }, 500);
        return;
      }
      //檢查地點重走
      if (curAct.indexOf("place?") > -1) {
        var pName = curAct.split(/[?:]/)[1];
        var curName = UTIL.filterMsg(g_obj_map.get("msg_room").get("short") || "");
        var backStep = curAct.split(/[?:]/)[2];
        // 未到達指定地，重新走
        if (pName != curName) {
          if (backStep) {
            //退後幾步
            params.idx -= Number(backStep);
            PLU.actions(params);
            return;
          }
          params.idx = 0;
          PLU.actions(params);
          return;
        }
        // 已到達指定地點，繼續下一個
        params.idx++;
        PLU.actions(params);
        return;
      }

      //迷宫
      if (curAct.match(/^(.+):(.+\^.+)$/)) {
        let cmd = curAct.match(/^(.+):(.+\^.+)$/);
        PLU.execActions(PLU.YFD.mapsLib.Labyrinth[cmd[1]][cmd[2]], () => {
          params.idx++;
          PLU.actions(params);
        });
        return;
      }

      //稱號飛修正
      if (curAct.indexOf("rank go") > -1) {
        let m = curAct.match(/rank go (\d+)/);
        if (m && m[1]) {
          curAct = "rank go " + (Number(m[1]) + 1);
        }
      }

      //look,ask,
      if (curAct.match(/look|ask|get|buy|home|prev|moke|sort|share|sign|sleep|exercise|clan|work|chushi |vip |event_|lq_|wear |wield |remove |unwield/)) {
        if (curAct == "ask?lama_master") {
          UTIL.addSysListener("lama", (b, type, subtype, msg) => {
            if (type == "main_msg")
              if (msg.indexOf("葛倫師傅在幻境之中") == -1) clickButton("ask lama_master");
              else {
                params.idx++;
                PLU.actions(params);
                UTIL.delSysListener("lama");
              }
          });
          clickButton("ask lama_master");
        } else {
          clickButton(curAct);
          setTimeout(() => {
            params.idx++;
            PLU.actions(params);
          }, 300);
        }
        return;
      }
      if (curAct == "飛雪連天射白鹿，笑書神俠倚碧鴛。" || curAct == "飞雪连天射白鹿，笑书神侠倚碧鸳。") {
        if (PLU.developerMode) {
          PLU.setCache("developer", 0);
          YFUI.writeToOut("<span style='color:white;'>==已關閉開發者模式部分功能，刷新後關閉開發者模式全部功能==</span>");
          setTimeout(() => location.reload(), 300);
        } else {
          YFUI.showPop({
            title: "！！！警告！！！",
            text: _(
              "你将开启本脚本开发者模式<br>" +
              "开发者模式功能清单：<br>" +
              "浏览器控制台（F12）输出按键指令、变量g_obj_map的实时变化<br>" +
              "闲聊允许向非脚本玩家打印屏蔽词（屏蔽词不会转为“*”，单字、特殊字符除外）<br>" +
              "可在非首页、非师傅所在地拜入门派，包括未开图的隐藏门派（掌握空间法则（误））<br>" +
              "显示全自动暴击开关（掌握时间法则（延长寿命（<br>" +
              "<b>实验功能可能会导致封号，是否继续？</b>",
              "你將開啟本腳本開發者模式<br>" +
              "開發者模式功能清單：<br>" +
              "瀏覽器控制檯（F12）輸出按鍵指令、變量g_obj_map的實時變化<br>" +
              "閒聊允許向非腳本玩家打印屏蔽詞（屏蔽詞不會轉為“*”，單字、特殊字符除外）<br>" +
              "可在非首頁、非師傅所在地拜入門派，包括未開圖的隱藏門派（掌握空間法則（誤））<br>" +
              "顯示全自動暴擊開關（掌握時間法則（延長壽命（<br>" +
              "<b>實驗功能可能會導致封號，是否繼續？</b>",
            ),
            okText: _("继续", "繼續"),
            onOk() {
              PLU.setCache("developer", 1);
              location.reload();
            },
            onNo() {
              params.idx++;
              PLU.actions(params);
            },
          });
        }
        return;
      }
      //行動
      PLU.go({
        action: curAct,
        onEnd() {
          if (params.idx + 1 >= params.paths.length) {
            return params.onPathsEnd && params.onPathsEnd();
          }
          params.idx++;
          PLU.actions(params);
        },
        onFail(flag) {
          if (flag && PLU.STATUS.inBattle) {
            PLU.autoEscape({
              onEnd() {
                setTimeout(() => {
                  PLU.actions(params);
                }, 1000);
              },
            });
            return;
          } else if (flag) {
            if (PLU.STO.REGO) {
              clearTimeout(PLU.STO.REGO);
              PLU.STO.REGO = null;
            }
            PLU.STO.REGO = setTimeout(() => {
              params.idx++;
              PLU.actions(params);
            }, 1000);
          } else {
            params.onPathsFail && params.onPathsFail();
          }
        },
      });
    },
    //================================================================================================
    go({ action, onEnd, onFail }) {
      if (!action) return onEnd && onEnd(false);
      let clearGoTimeout = function (timeoutKey) {
        clearTimeout(timeoutKey);
        timeoutKey = null;
        UTIL.delSysListener("goMove");
      };
      let goTimeout = setTimeout(function () {
        clearGoTimeout(goTimeout);
        onEnd && onEnd(false);
      }, 2000);
      UTIL.addSysListener("goMove", function (b, type, subtype, msg) {
        if (type == "notice" && subtype == "notify_fail") {
          if (msg.indexOf("你正忙著呢") > -1) {
            clearGoTimeout(goTimeout);
            return onFail && onFail(true);
          }
          if (
            msg.indexOf("無法走動") > -1 ||
            msg.indexOf("沒有這個方向") > -1 ||
            msg.indexOf("只有VIP才可以直接去往此地") > -1 ||
            msg.indexOf("你什麼都沒發覺") > -1 ||
            msg.indexOf("就此鑽入恐有辱墓主") > -1 ||
            msg.indexOf("你雖知這松林內有乾坤，但並沒發現任何線索") > -1 ||
            msg.indexOf("此地圖還未解鎖，請先通關前面的地圖。") > -1
          ) {
            clearGoTimeout(goTimeout);
            return onFail && onFail(false, msg);
          }
        }
        if (type == "unknow_command" || (type == "jh" && subtype == "info")) {
          clearGoTimeout(goTimeout);
          setTimeout(function () {
            onEnd && onEnd(true);
          }, 200);
          return;
        }
      });
      clickButton(action);
    },
    //================================================================================================
    fastExec(str, endcallback) {
      var acs = str
        .split(";")
        .map((e) => {
          let np = e.match(/^#(\d+)\s(.*)/);
          if (np) {
            let r = [];
            for (let i = 0; i < np[1]; i++) r.push(np[2]);
            return r;
          }
          return e;
        })
        .flat()
        .map((e) => {
          if (PLU.YFD.pathCmds[e]) return PLU.YFD.pathCmds[e] + "." + UTIL.rnd();
          return e;
        });
      let fastFunc = (acts, idx) => {
        if (idx >= acts.length) {
          setTimeout(() => {
            endcallback && endcallback(true);
          }, 1000);
          return;
        }
        let curAct = acts[idx];
        if (!curAct) return fastFunc(acts, idx + 1);
        clickButton(curAct);
        setTimeout(() => {
          fastFunc(acts, idx + 1);
        }, 200);
        return;
      };
      fastFunc(acs, 0);
    },
    //================================================================================================
    selectSkills(skillName) {
      if (!PLU.battleData || !PLU.battleData.skills) return null;
      let keys = Object.keys(PLU.battleData.skills);
      if (skillName) {
        for (let i = 0; i < keys.length; i++) {
          let sk = PLU.battleData.skills[keys[i]];
          if (sk && sk.name && sk.name.match(skillName)) return sk;
        }
      } else {
        let n = Math.floor(keys.length * Math.random());
        return PLU.battleData.skills[keys[n]];
      }
      return null;
    },
    //================================================================================================
    autoFight(params) {
      if (PLU.STO.autoF) {
        clearTimeout(PLU.STO.autoF);
        PLU.STO.autoF = null;
      }
      if (!params.targetKey && !params.targetName) {
        params.onFail && params.onFail(0);
        YFUI.writeToOut("<span style='color:#FFF;'>--戰鬥參數缺失--</span>");
        return;
      }
      if (params.targetName && !params.targetKey) {
        let npcObj = UTIL.findRoomNpc(params.targetName, false, true);
        if (npcObj) {
          params.targetKey = npcObj.key;
        } else {
          params.onFail && params.onFail(1);
          YFUI.writeToOut("<span style='color:#FFF;'>--找不到NPC--</span>");
          return;
        }
      }
      let fightAct = params.fightKind ?? "kill";
      let performTime = 0;
      UTIL.addSysListener("onAutoFight", function (b, type, subtype, msg) {
        if (type == "vs" && subtype == "vs_info") {
          setTimeout(() => {
            if (params.autoSkill && PLU.battleData) PLU.battleData.autoSkill = params.autoSkill;
          }, 100);
          if (PLU.TMP.loopCheckFight) {
            clearInterval(PLU.TMP.loopCheckFight);
            PLU.TMP.loopCheckFight = null;
          }
          PLU.TMP.loopCheckFight = setInterval(() => {
            if (!g_gmain.is_fighting) {
              UTIL.delSysListener("onAutoFight");
              if (PLU.STO.autoF) {
                clearTimeout(PLU.STO.autoF);
                PLU.STO.autoF = null;
              }
              if (PLU.TMP.loopCheckFight) {
                clearInterval(PLU.TMP.loopCheckFight);
                PLU.TMP.loopCheckFight = null;
              }
              params.onEnd && params.onEnd();
            }
          }, 2000);
          params.onStart && params.onStart();
        } else if (type == "vs" && (subtype == "add_xdz" || subtype == "text" || subtype == "attack")) {
          let curTime = new Date().getTime();
          if (curTime - performTime < 500) return;
          performTime = curTime;
          let useSkill = null;
          if (params.autoSkill) {
            if (!PLU.battleData || PLU.battleData.xdz < 2) return;
            if (params.autoSkill == "item") {
              if (PLU.battleData.xdz >= 6) useSkill = { key: "playskill 7" };
              else useSkill = {};
            } else if (params.autoSkill == "dodge") {
              if (PLU.battleData.xdz > 9) useSkill = PLU.selectSkills(/乾坤大挪移|淩波微步|無影毒陣|九妙飛天術/);
            } else if (params.autoSkill == "multi") {
              if (PLU.battleData.xdz > 2) useSkill = PLU.selectSkills(/破軍棍法|千影百傷棍|八荒功|月夜鬼蕭|打狗棒法/);
            } else if (params.autoSkill == "fast") {
              if (PLU.battleData.xdz >= 2) useSkill = PLU.selectSkills(/吸星大法|斗轉星移|無影毒陣|空明拳|乾坤大挪移/);
            }
            if (!useSkill) {
              if (PLU.getCache("autoPerform") >= 1) {
                PLU.battleData.autoSkill = "";
                return;
              }
              if (params.autoSkill) PLU.battleData.autoSkill = "";
              useSkill = PLU.selectSkills();
            }
            if (params.onFighting) {
              let block = params.onFighting(useSkill);
              if (block) return;
            }
            useSkill && clickButton(useSkill.key, 0);
          } else {
            params.onFighting && params.onFighting();
          }
        } else if (type == "vs" && subtype == "combat_result") {
          performTime = 0;
          UTIL.delSysListener("onAutoFight");
          if (PLU.STO.autoF) {
            clearTimeout(PLU.STO.autoF);
            PLU.STO.autoF = null;
          }
          if (PLU.TMP.loopCheckFight) {
            clearInterval(PLU.TMP.loopCheckFight);
            PLU.TMP.loopCheckFight = null;
          }
          clickButton("prev_combat");
          params.onEnd && params.onEnd();
        } else if (type == "notice" && subtype == "notify_fail") {
          let errCode = 0;
          if (msg.indexOf("沒有這個人") > -1) {
            errCode = 1;
          } else if (msg.indexOf("你正忙著呢") > -1) {
            errCode = 2;
          } else if (msg.indexOf("已經超量") > -1) {
            errCode = 3;
          } else if (msg.indexOf("已達到上限") > -1) {
            errCode = 4;
          } else if (msg.indexOf("太多人了") > -1) {
            errCode = 5;
          } else if (msg.indexOf("不能戰鬥") > -1) {
            errCode = 6;
          } else if (msg.indexOf("秒後才能攻擊這個人") > -1) {
            let sat = msg.match(/(\d+)秒後才能攻擊這個人/);
            if (sat) errCode = "delay_" + sat[1];
            else errCode = 77;
          } else if (msg.indexOf("先觀察一下") > -1) {
            errCode = 88;
          } else {
            if (!PLU.STATUS.inBattle) {
              errCode = 99;
            }
          }
          UTIL.delSysListener("onAutoFight");
          if (PLU.STO.autoF) {
            clearTimeout(PLU.STO.autoF);
            PLU.STO.autoF = null;
          }
          if (PLU.TMP.loopCheckFight) {
            clearInterval(PLU.TMP.loopCheckFight);
            PLU.TMP.loopCheckFight = null;
          }
          params.onFail && params.onFail(errCode);
        }
      });
      PLU.STO.autoF = setTimeout(() => {
        PLU.STO.autoF = null;
        if (!g_gmain.is_fighting) {
          UTIL.delSysListener("onAutoFight");
          if (PLU.TMP.loopCheckFight) {
            clearInterval(PLU.TMP.loopCheckFight);
            PLU.TMP.loopCheckFight = null;
          }
          return params.onFail && params.onFail(100);
        }
      }, 300000);
      clickButton(fightAct + " " + params.targetKey, 0);
    },
    //================================================================================================
    autoEscape(params) {
      if (!PLU.STATUS.inBattle) return params.onEnd && params.onEnd();
      let lastEscapeTime = new Date().getTime();
      UTIL.addSysListener("onAutoEscape", function (b, type, subtype, msg) {
        if (type == "vs" && subtype == "combat_result") {
          UTIL.delSysListener("onAutoEscape");
          clickButton("prev_combat");
          return params.onEnd && params.onEnd();
        } else if (type == "vs" && (subtype == "add_xdz" || subtype == "text" || subtype == "attack")) {
          let nt = new Date().getTime();
          if (nt - lastEscapeTime > 500) {
            lastEscapeTime = nt;
            clickButton("escape");
          }
        }
      });
    },
    //================================================================================================
    setBtnRed($btn, flag, sColr) {
      if (!PLU.ONOFF[$btn[0].id + "_color"]) {
        PLU.ONOFF[$btn[0].id + "_color"] = $btn.css("background-color");
        let carr = PLU.ONOFF[$btn[0].id + "_color"].split(/[\D\s]+/);
        carr.pop();
        carr.shift();
        if (carr[0] == carr[1] && carr[1] == carr[2]) {
          carr[1] = carr[1] - 32;
          carr[2] = carr[2] - 32;
        }
        let m = carr.reduce((a, b) => (Number(a) + Number(b)) / 2);
        let narr = carr.map((e) => {
          return Math.min(e - 96 + 4 * (e - m), 256);
        });
        PLU.ONOFF[$btn[0].id + "_colorDark"] = "rgb(" + narr.join(",") + ")";
      }
      if (flag == undefined) {
        if (PLU.ONOFF[$btn[0].id]) {
          PLU.ONOFF[$btn[0].id] = 0;
          $btn.css({
            background: PLU.ONOFF[$btn[0].id + "_color"],
            color: "#000",
          });
          return 0;
        } else {
          PLU.ONOFF[$btn[0].id] = 1;
          $btn.css({
            background: PLU.ONOFF[$btn[0].id + "_colorDark"],
            color: "#FFF",
          });
          return 1;
        }
      } else {
        PLU.ONOFF[$btn[0].id] = flag;
        let colr = sColr || PLU.ONOFF[$btn[0].id + "_color"],
          fcolr = "#000";
        if (flag) {
          colr = sColr || PLU.ONOFF[$btn[0].id + "_colorDark"];
          fcolr = "#FFF";
        }
        $btn.css({ background: colr, color: fcolr });
        return flag;
      }
    },
    getBtnRed($btn) {
      if (PLU.ONOFF[$btn[0].id]) return 1;
      return 0;
    },
    //================================================================================================
    toAutoChuaiMo($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.STATUS.isBusy = false;
        PLU.TMP.CMSkill = null;
        return;
      }
      YFUI.showPop({
        title: "自動揣摩技能",
        text: "一鍵自動揣摩所有能揣摩的技能！(除了六陰追魂劍法)",
        onOk() {
          PLU.autoChuaiMo();
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    toAutoGetKey($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        return UTIL.delSysListener("listenGetKey");
      }
      clickButton("get yin yaoshi");
      UTIL.addSysListener("listenGetKey", function (b, type, subtype, msg) {
        if (g_obj_map.get("msg_room") && g_obj_map.get("msg_room").get("short").match(/匾後/)) {
          if (type == "jh") {
            if (subtype == "new_item") {
              if (b.get("id") == "yin yaoshi") clickButton("get yin yaoshi");
            } else if (subtype == "info") {
              clickButton("get yin yaoshi");
            }
          }
        }
      });
    },
    //================================================================================================
    toAutoMoke($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.STATUS.isBusy = false;
        return;
      }
      PLU.getAllItems((list) => {
        let daoItems = list.find((it) => !!it.name.match("玄鐵刻刀"));
        let daoNum = daoItems?.num || 0;
        let eqItems = list.filter((it) => !!(it.key.match(/(equip|weapon)_\S+8/) && !it.key.match("_moke_") && !it.key.match("_xinwu") && !it.key.match("_barcer")));
        let myNum = 0;
        eqItems &&
          eqItems.forEach((eq) => {
            myNum += eq.num;
          });
        console.log(eqItems);
        YFUI.showPop({
          title: "自動摹刻所有明月",
          text:
            "一鍵自動摹刻所有明月裝備！<br><span style='color:#F00;font-weight:bold;'>注意準備足夠的刻刀!!!</span><br>當前玄鐵刻刀數量 <span style='color:#F00;'>" +
            daoNum +
            "</span><br>當前未摹刻明月裝備數量 <span style='color:#F00;'>" +
            myNum +
            "</span>",
          onOk() {
            PLU.autoMoke(eqItems);
          },
          onNo() {
            PLU.setBtnRed($btn, 0);
          },
        });
      });
    },
    autoMoke(eqList) {
      if (!PLU.ONOFF["btn_bt_autoMoke"]) return YFUI.writeToOut("<span style='color:#F0F;'> ==摹刻暫停!== </span>");
      if (eqList && eqList.length > 0) {
        let eq = eqList.pop(),
          mokeCmds = "";
        mokeCmds;
        for (var i = 0; i < eq.num; i++) {
          mokeCmds += "moke " + eq.key + ";";
        }
        PLU.execActions(mokeCmds, () => PLU.autoMoke(eqList));
      } else {
        PLU.setBtnRed($("#btn_bt_autoMoke"), 0);
        YFUI.writeToOut("<span style='color:yellow;'> ==摹刻完畢!== </span>");
      }
    },
    //================================================================================================
    toAutoKillZYY($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        return UTIL.delSysListener("listenLoopKillZYY");
      }
      YFUI.showPop({
        title: "自動去刷祝玉妍",
        text: "自動去刷祝玉妍！<br><span style='color:#FFF;background:#F00;font-weight:bold;'>----- 注意: -----</span><br><span style='color:#F00;font-weight:bold;'>1、準備足夠的邪帝舍利!!!<br>2、不要有隊伍!!!<br>3、切記要打開自動技能陣!!!<br>4、要上足夠的保險卡!!!</span>",
        onOk() {
          PLU.execActions("rank go 232;s;s;;;", () => {
            PLU.loopKillZYY();
          });
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
          UTIL.delSysListener("listenLoopKillZYY");
        },
      });
    },
    loopKillZYY() {
      UTIL.addSysListener("listenLoopKillZYY", function (b, type, subtype, msg) {
        if (type == "vs" && subtype == "combat_result") {
          if (!PLU.ONOFF["btn_bt_autoKillZYY"]) {
            PLU.execActions(";;;n;", () => {
              YFUI.writeToOut("<span style='color:yellow;'>=====刷祝玉妍結束!!=====</span>");
              UTIL.delSysListener("listenLoopKillZYY");
            });
          } else {
            PLU.execActions(";;;n;s");
          }
        }
      });
      clickButton("s");
    },
    //================================================================================================
    toAutoFB11($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        return UTIL.delSysListener("listenFB11");
      }
      YFUI.showPop({
        title: "自動副本11",
        text: `自動打副本11！<br>
					<span style='color:#F00;font-weight:bold;'>----- 選擇要打的門 -----</span><br>
					<div style="font-size:12px;line-height:2;box">
					<label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">8 懶惰<input type="checkbox" name="chkfb11" value="nw" checked/></label>
					<label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">1非時食<input type="checkbox" name="chkfb11" value="n" checked/></label>
					<label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">2 殺生<input type="checkbox" name="chkfb11" value="ne" checked/></label>
					<br>
					<label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">7 奢華<input type="checkbox" name="chkfb11" value="w" checked/></label>
					<span style="display:inline-block;width: 31%;color:#999;text-align:center;border:1px solid transparent;">初心之地</span>
					<label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">3 偷盜<input type="checkbox" name="chkfb11" value="e" checked/></label>
					<br>
					<label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">6 飲酒<input type="checkbox" name="chkfb11" value="sw" checked/></label>
					<label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">5 妄語<input type="checkbox" name="chkfb11" value="s" checked/></label>
					<label style="display:inline-block;width: 31%;text-align:center;border:1px solid #333;">4 淫邪<input type="checkbox" name="chkfb11" value="se" checked/></label><br>
					</div>
					<span style='color:#F00;font-weight:bold;'>1、在副本外開始腳本<br>2、記得要組隊<br></span>`,
        okText: "開始",
        onOk() {
          let chks = $('input[name="chkfb11"]:checked');
          let selects = [];
          $.each(chks, (i, e) => {
            selects.push(e.value);
          });
          if (selects.length == 0) return false;
          console.log(selects);
          //PLU.TMP.chkTmpList=[]
          //PLU.execActions('rank go 232;s;s;;;', ()=>{
          PLU.autoFB11(selects);
          //})
          //UTIL.findRoomNpcReg
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
          UTIL.delSysListener("listenFB11");
        },
      });
    },
    autoFB11() { },
    killAllNpc(callback) {
      let npcObj = UTIL.findRoomNpcReg("");
      if (npcObj) {
        let needAutoSkill = PLU.getCache("autoPerform") >= 1 ? null : "multi";
        PLU.autoFight({
          targetKey: npcObj.key,
          fightKind: "kill",
          autoSkill: needAutoSkill,
          onFail() {
            setTimeout((t) => {
              PLU.killAllNpc(callback);
            }, 1000);
          },
          onEnd() {
            setTimeout((t) => {
              PLU.killAllNpc(callback);
            }, 500);
          },
        });
      } else {
        callback && callback();
      }
    },
    //================================================================================================
    checkYouxia($btn) {
      YFUI.showPop({
        title: "檢查入室遊俠技能",
        text: `選擇需要的對應技能:<br>
				<div style="font-size:15px;">
					<label style="display:inline-block;">內功:<input type="checkbox" name="chkskiyx" value="內功" checked/></label>&nbsp;
					<label style="display:inline-block;">輕功:<input type="checkbox" name="chkskiyx" value="輕功" checked/></label>&nbsp;
					<label style="display:inline-block;">劍法:<input type="checkbox" name="chkskiyx" value="劍法" checked/></label>&nbsp;
					<label style="display:inline-block;">掌法:<input type="checkbox" name="chkskiyx" value="掌法" checked/></label>&nbsp;
					<label style="display:inline-block;">刀法:<input type="checkbox" name="chkskiyx" value="刀法" checked/></label>&nbsp;
					<label style="display:inline-block;">暗器:<input type="checkbox" name="chkskiyx" value="暗器"/></label>&nbsp;
					<label style="display:inline-block;">鞭法:<input type="checkbox" name="chkskiyx" value="鞭法"/></label>&nbsp;
					<label style="display:inline-block;">槍法:<input type="checkbox" name="chkskiyx" value="槍法"/></label>&nbsp;
					<label style="display:inline-block;">錘法:<input type="checkbox" name="chkskiyx" value="錘法"/></label>&nbsp;
					<label style="display:inline-block;">斧法:<input type="checkbox" name="chkskiyx" value="斧法"/></label>
				</div>`,
        onOk() {
          let chks = $('input[name="chkskiyx"]:checked');
          let selects = [];
          PLU.TMP.chkTmpList = [];
          $.each(chks, (i, e) => {
            selects.push(e.value);
          });
          PLU.getSkillsList((allSkills, tupoSkills) => {
            PLU.getYouxiaList((yxs) => {
              PLU.checkMySkills(allSkills, yxs, selects);
            });
          });
        },
        onNo() { },
      });
    },
    checkMySkills(mySkills, myYouxia, checkList) {
      // console.log(mySkills, myYouxia, checkList)
      let clstr = "";
      checkList.forEach((c) => (clstr += "【" + c[0] + "】"));
      YFUI.writeToOut("<span style='color:#FFF;'>--技能檢測 <span style='color:yellow;'>" + clstr + "</span>--</span>");
      checkList.forEach((cn) => {
        let carr = PLU.YFD.youxiaSkillMap.filter((r) => r.type == cn);
        carr.forEach((n) => {
          PLU.checkPreSKill(n, mySkills, myYouxia);
        });
      });
      if (PLU.TMP.chkTmpList.length == 0) {
        YFUI.writeToOut("<span style='color:yellow;'>檢查的技能都準備好了!</span>");
      }
    },
    checkPreSKill(node, mySkills, myYouxia) {
      let ms = mySkills.find((s) => s.name == node.skill);
      if (!ms && !PLU.TMP.chkTmpList.includes(node.skill)) {
        PLU.TMP.chkTmpList.push(node.skill);
        let clr = node.kind == "宗師" || node.kind == "俠客" ? "#E93" : "#36E";
        let htm = '<span style="color:' + clr + ';">【' + node.type[0] + "】" + node.skill + " ";
        // htm+= ms?'<span style="color:#3F3;display:inline-block;">('+ms.level+')</span>':'(缺)';
        htm += '<span style="color:#F00;display:inline-block;">(未學)</span>';
        let myx = myYouxia.find((y) => y.name.match(node.name));
        htm +=
          " - " +
          (myx
            ? '<span style="color:#3F3;display:inline-block;">' + myx.name + "[" + myx.level + "]</span>"
            : '<span style="color:#F36;display:inline-block;">需要：<span style="color:#FFF;background:' +
            clr +
            ';"> ' +
            node.kind +
            "-" +
            node.name +
            " </span></span>");
        htm += "</span>";
        YFUI.writeToOut(htm);
      }
      if (node.pre) {
        node.pre.forEach((n) => {
          PLU.checkPreSKill(n, mySkills, myYouxia);
        });
      }
    },
    getYouxiaList(callback) {
      UTIL.addSysListener("getYouxiaList", function (b, type, subtype, msg) {
        if (type != "fudi" && subtype != "juxian") return;
        UTIL.delSysListener("getYouxiaList");
        clickButton("prev");
        let youxias = [];
        for (var i = 0; i < 41; i++) {
          let str = b.get("yx" + i);
          if (str) {
            let attr = str.split(",");
            let ns = UTIL.filterMsg(attr[1]).split("】");
            let nam = ns.length > 1 ? ns[1] : ns[0];
            youxias.push({
              key: attr[0],
              name: nam,
              level: Number(attr[4]),
              kind: attr[3],
            });
          }
        }
        callback(youxias);
      });
      clickButton("fudi juxian");
    },
    //================================================================================================
    toAutoLearn($btn) {
      if (!PLU.TMP.MASTER_SKILLS) {
        return YFUI.showPop({
          title: "缺少數據",
          text: "需要打開師傅技能界面",
          // onOk(){
          //},
        });
      }
      // console.log(PLU.TMP.MASTER_ID, PLU.TMP.MASTER_SKILLS)
      let needSkills = [];
      PLU.getSkillsList((allSkills, tupoSkills) => {
        PLU.TMP.MASTER_SKILLS.forEach((ms) => {
          let sk = allSkills.find((s) => s.key == ms.key) || { level: 0 };
          if (sk.level < ms.level) {
            needSkills.push({
              key: ms.key,
              name: ms.name,
              lvl: ms.level - sk.level,
              cmd: "learn " + ms.key + " from " + PLU.TMP.MASTER_ID + " to 10",
            });
          }
        });
        //console.log(needSkills.map(e=>e.name))
        loopLearn(needSkills);
      });
      let curSkill = null;
      UTIL.addSysListener("loopLearnSkill", function (b, type, subtype, msg) {
        if (type == "notice" && msg.indexOf("不願意教你") >= 0) {
          //UTIL.delSysListener("loopLearnSkill");
          if (curSkill) curSkill.lvl = -1;
        }
        return;
      });
      let loopLearn = function (list) {
        if (list.length > 0) {
          if (list[0].lvl > 0) {
            list[0].lvl -= 10;
            curSkill = list[0];
            clickButton(list[0].cmd);
          } else {
            list.shift();
          }
          setTimeout(() => {
            loopLearn(list);
          }, 200);
        } else {
          UTIL.delSysListener("loopLearnSkill");
          YFUI.writeToOut("<span style='color:#FFF;'>----自動學習結束,記得檢查噢!----</span>");
        }
      };
    },
    //================================================================================================
    autoChuaiMo() {
      if (!PLU.ONOFF["btn_bt_autoChuaiMo"]) return;
      PLU.STATUS.isBusy = true;
      if (!PLU.TMP.CMSkill) {
        PLU.getSkillsList((allSkills, tupoSkills) => {
          if (!PLU.TMP.CANTCMS) PLU.TMP.CANTCMS = [];
          PLU.TMP.CMSkill = allSkills.find(
            (e) =>
              e.level >= 500 &&
              e.level < 600 &&
              e.name != "六陰追魂劍法" &&
              (e.kind == "attack" || e.kind == "recovery" || e.kind == "force") &&
              !PLU.TMP.CANTCMS.includes(e.name),
          );
          if (!PLU.TMP.CMSkill) {
            PLU.STATUS.isBusy = false;
            PLU.TMP.CMSkill = null;
            PLU.setBtnRed($("#btn_bt_autoChuaiMo"), 0);
          } else {
            clickButton("enable " + PLU.TMP.CMSkill.key);
            UTIL.addSysListener("listenChuaiMo", function (b, type, subtype, msg) {
              if (type == "notice" && (msg.indexOf("揣摩最高等級為") >= 0 || msg.indexOf("這項技能不能揣摩") >= 0)) {
                UTIL.delSysListener("listenChuaiMo");
                if (msg.indexOf("這項技能不能揣摩") >= 0) {
                  PLU.TMP.CANTCMS.push(PLU.TMP.CMSkill.name);
                }
                YFUI.writeToOut("<span style='color:#FFF;'>--揣摩結束--</span>");
                PLU.TMP.CMSkill = null;
              }
              return;
            });
          }
          PLU.autoChuaiMo();
        });
      } else {
        clickButton("chuaimo go," + PLU.TMP.CMSkill.key, 0);
        setTimeout((e) => {
          PLU.autoChuaiMo();
        }, 250);
      }
    },
    //================================================================================================
    toAutoTeach($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.STATUS.isBusy = false;
        PLU.TMP.TeachSkill = null;
        return;
      }
      YFUI.showPop({
        title: "自動傳授遊俠技能",
        text: "一鍵自動傳授遊俠技能！<b style='color:#F00;'>需要點開遊俠技能界面,需要傳授的技能不能為0級</b>",
        onOk() {
          PLU.autoTeach();
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    autoTeach() {
      if (!PLU.ONOFF["btn_bt_autoTeach"]) return;
      PLU.STATUS.isBusy = true;
      if (PLU.TMP.CUR_YX_SKILLS) {
        let ac = PLU.TMP.CUR_YX_SKILLS.find((e) => Number(e.lvl) > 0 && Number(e.lvl) < Number(e.max));
        if (ac) {
          clickButton(ac.cmd, 0);
          setTimeout((e) => {
            PLU.autoTeach();
          }, 200);
        } else {
          YFUI.writeToOut("<span style='color:#FFF;'>--傳授結束--</span>");
          PLU.STATUS.isBusy = false;
          PLU.setBtnRed($("#btn_bt_autoTeach"), 0);
        }
      } else {
        PLU.STATUS.isBusy = false;
        PLU.setBtnRed($("#btn_bt_autoTeach"), 0);
      }
    },
    //================================================================================================
    toAutoUpgrade($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        PLU.STATUS.isBusy = false;
        PLU.TMP.TeachSkill = null;
        return;
      }
      YFUI.showPop({
        title: "自動升級遊俠等級",
        text: "一鍵升級遊俠等級！<b style='color:#F00;'>需要點開遊俠技能界面</b>",
        onOk() {
          PLU.autoUpgrade();
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    // 今天提升鳩摩智等級的次數已達到上限了。
    //不能提升阿朱的等級。
    //遊俠等級超過上限了。
    //================================================================================================
    autoUpgrade() {
      if (!PLU.ONOFF["btn_bt_autoUpgrade"]) return;
      PLU.STATUS.isBusy = true;
      if (PLU.TMP.CUR_YX_LEVEL && PLU.TMP.CUR_YX_SKILLS && PLU.TMP.CUR_YX_ENG) {
        if (PLU.TMP.CUR_YX_SKILLS.length > 4 && PLU.TMP.CUR_YX_LEVEL < 2000) {
          var canUpgrade = true;
          UTIL.addSysListener("listenAutoUpgrade", function (b, type, subtype, msg) {
            if (type == "notice" && (msg.indexOf("等級的次數已達到上限了") >= 0 || msg.indexOf("不能提升") >= 0 || msg.indexOf("等級超過上限了") >= 0)) {
              UTIL.delSysListener("listenAutoUpgrade");
              canUpgrade = false;
              PLU.STATUS.isBusy = false;
              YFUI.writeToOut("<span style='color:#FFF;'>--升級結束--</span>");
              PLU.setBtnRed($("#btn_bt_autoUpgrade"), 0);
            }
            return;
          });
          clickButton("fudi juxian upgrade go " + PLU.TMP.CUR_YX_ENG + " 100");
          setTimeout((e) => {
            if (canUpgrade) PLU.autoUpgrade();
          }, 500);
        } else {
          YFUI.writeToOut("<span style='color:#FFF;'>--升級結束--</span>");
          PLU.STATUS.isBusy = false;
          PLU.setBtnRed($("#btn_bt_autoUpgrade"), 0);
        }
      } else {
        PLU.STATUS.isBusy = false;
        PLU.setBtnRed($("#btn_bt_autoUpgrade"), 0);
      }
    },
    //================================================================================================
    toLoopKillByN($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_loopKillByN").text(_("计数击杀", "計數擊殺"));
        return;
      }
      clickButton("golook_room");
      YFUI.showInput({
        title: "計數擊殺",
        text: "輸入數量，確定後單擊怪!!(數量後帶小數點為比試)",
        value: PLU.getCache("lookKillNum") || 20,
        onOk(val) {
          if (!Number(val)) return;
          setTimeout((o) => {
            $(document).one("click", (o) => {
              let snpc = $(o.target)
                .closest("button")[0]
                .outerHTML.match(/clickButton\('look_npc (\w+)'/i);
              if (snpc && snpc.length >= 2) {
                let kf = String(val).indexOf(".") > 0 ? "fight" : "kill";
                PLU.setCache("lookKillNum", Number(val));
                PLU.loopKillByN(snpc[1], parseInt(val), kf);
              } else {
                PLU.setBtnRed($btn, 0);
              }
            });
          }, 500);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopKillByN(npcId, killN, killorfight) {
      if (killN <= 0 || !PLU.ONOFF["btn_bt_loopKillByN"]) return;
      $("#btn_bt_loopKillByN").text("停(" + killN + ")");
      PLU.autoFight({
        targetKey: npcId,
        fightKind: killorfight,
        autoSkill: "fast",
        onFail() {
          setTimeout((t) => {
            PLU.loopKillByN(npcId, killN, killorfight);
          }, 500);
        },
        onEnd() {
          if (killN <= 1) {
            PLU.setBtnRed($("#btn_bt_loopKillByN"), 0);
            $("#btn_bt_loopKillByN").text(_("计数击杀", "計數擊殺"));
            clickButton("home", 1);
            return;
          } else {
            setTimeout((t) => {
              PLU.loopKillByN(npcId, killN - 1, killorfight);
            }, 500);
          }
        },
      });
    },
    //================================================================================================
    toLoopKillName($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_loopKillName").text(_("名字连杀", "名字連殺"));
        return;
      }
      YFUI.showInput({
        title: "名字連殺",
        text: `格式：次數|人物詞組<br>
						次數：省略則默認1次<br>
						人物詞組：以英文逗號分割多個關鍵詞<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">99|鐵狼軍,銀狼軍,金狼軍,金狼將,十夫長,百夫長,千夫長</span><br>
						[例2] <span style="color:blue;">醉漢,收破爛的</span>;
						`,
        value: PLU.getCache("lookKillNames") || "299|鐵狼軍,銀狼軍,金狼軍,金狼將,十夫長,百夫長,千夫長",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            times = 1,
            names = "",
            arr = str.split("|");
          if (arr.length > 1) {
            times = Number(arr[0]) || 1;
            names = arr[1];
          } else {
            names = arr[0];
          }
          PLU.setCache("lookKillNames", str);
          PLU.loopKillName(names, Number(times));
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopKillName(names, killN) {
      if (killN <= 0 || !PLU.ONOFF["btn_bt_loopKillName"]) return;
      $("#btn_bt_loopKillName").text("停擊殺(" + killN + ")");
      let npcObj = null,
        namesArr = names.split(",");
      for (let i = 0; i < namesArr.length; i++) {
        npcObj = UTIL.findRoomNpc(namesArr[i], false, true);
        if (npcObj) break;
      }
      if (npcObj) {
        let needAutoSkill = PLU.getCache("autoPerform") >= 1 ? null : "multi";
        PLU.autoFight({
          targetKey: npcObj.key,
          fightKind: "kill",
          autoSkill: needAutoSkill,
          onFail() {
            setTimeout((t) => {
              PLU.loopKillName(names, killN);
            }, 1000);
          },
          onEnd() {
            if (killN <= 1) {
              PLU.setBtnRed($("#btn_bt_loopKillName"), 0);
              $("#btn_bt_loopKillName").text("名字連殺");
              return;
            } else {
              setTimeout((t) => {
                PLU.loopKillName(names, killN - 1);
              }, 1000);
            }
          },
        });
      } else {
        setTimeout((t) => {
          PLU.loopKillName(names, killN);
        }, 2000);
      }
    },
    //================================================================================================
    toLoopKill($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        // $("#btn_bt_kg_loopKill").text('循環殺')
        return;
      }
      YFUI.showInput({
        title: "循環殺",
        text: `格式：名字詞組<br>
						名字詞組：以英文逗號分割多個關鍵詞, <b style="color:red;">可模糊匹配!</b><br>
						<span style="color:red;">不需要戰鬥時建議關閉以節省性能!!</span><br>
						[例1] <span style="color:blue;">鐵狼軍,銀狼軍,金狼軍,金狼將,十夫長,百夫長,千夫長,蠻荒鐵,蠻荒銀,蠻荒金,寨近衛,蠻荒近衛</span><br>
						`,
        type: "textarea",
        value: PLU.getCache("lookKillKeys") || "怯薛軍,蒙古突騎,草原槍騎,重裝鐵騎,狼軍,狼將,夫長,蠻荒,近衛",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            names = str.split(/[,，#]/);
          PLU.setCache("lookKillKeys", str);
          PLU.loopKills(str);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopKills(names) {
      if (!PLU.ONOFF["btn_bt_kg_loopKill"]) return;
      // $("#btn_bt_kg_loopKill").text('停循環');
      let npcObj = null,
        namesArr = names.split(/[,，#]/);
      for (let i = 0; i < namesArr.length; i++) {
        npcObj = UTIL.findRoomNpcReg(namesArr[i]);
        if (npcObj) break;
      }
      if (npcObj) {
        let needAutoSkill = PLU.getCache("autoPerform") >= 1 ? null : "multi";
        PLU.autoFight({
          targetKey: npcObj.key,
          fightKind: "kill",
          autoSkill: needAutoSkill,
          onFail() {
            setTimeout((t) => {
              PLU.loopKills(names);
            }, 1000);
          },
          onEnd() {
            setTimeout((t) => {
              PLU.loopKills(names);
            }, 500);
          },
        });
      } else {
        setTimeout((t) => {
          PLU.loopKills(names);
        }, 1000);
      }
    },
    //================================================================================================
    toLoopReadBase($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        // $("#btn_bt_loopReadBase").text('讀技能書')
        return;
      }
      YFUI.showInput({
        title: "讀書還神",
        text: `格式：比試NPC名稱|基礎秘籍名稱<br>
						比試NPC名稱：要比試進行回神的NPC名字<br>
						基礎秘籍名稱：基礎秘籍名稱關鍵詞<br>
						<span style="color:red;">戰鬥必刷道具欄必須用還神丹</span><br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">地痞|基本劍法秘籍</span>
						`,
        value: PLU.getCache("loopReadBase") || "地痞|基本劍法秘籍",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            npcName = "",
            bookName = "",
            arr = str.split("|");
          if (arr.length > 1) {
            npcName = arr[0];
            bookName = arr[1];
            PLU.setCache("loopReadBase", str);
            PLU.getAllItems((list) => {
              let bookItem = list.find((it) => !!it.name.match(bookName));
              let reN = Math.floor(g_obj_map.get("msg_attrs").get("max_shen_value") / 55) || 1;
              console.log(npcName, bookItem.key, reN);
              if (bookItem) {
                PLU.toggleAutoPerform($("#btn_bt_kg_autoPerform"), "autoPerform", 0);
                PLU.loopReadBase(npcName, bookItem.key, reN);
              }
            });
          } else {
            PLU.setBtnRed($btn, 0);
            return;
          }
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    loopReadBase(npcName, bookKey, reN) {
      //你使用了一本

      //你的神值不足：10以上。
      //你目前不能使用
      //使用技能等級為
      if (!PLU.ONOFF["btn_bt_loopReadBase"]) {
        UTIL.delSysListener("listenLoopReadBase");
        YFUI.writeToOut("<span style='color:#FFF;'>--讀基本技能書停止--</span>");
        PLU.setBtnRed($("#btn_bt_loopReadBase"), 0);
        return;
      }
      UTIL.addSysListener("listenLoopReadBase", function (b, type, subtype, msg) {
        if (type == "main_msg" && msg.indexOf("你使用了一本") >= 0) {
          UTIL.delSysListener("listenLoopReadBase");
          setTimeout(() => {
            PLU.loopReadBase(npcName, bookKey, reN);
          }, 500);
        } else if (type == "notice" && msg.indexOf("你的神值不足") >= 0) {
          UTIL.delSysListener("listenLoopReadBase");
          setTimeout(() => {
            let refreshNumber = 0;
            PLU.autoFight({
              targetName: npcName,
              fightKind: "fight",
              autoSkill: "item",
              onStart() {
                console.log("start fight==");
              },
              onFighting(ps) {
                if (refreshNumber >= reN) return true;
                if (ps && ps.key == "playskill 7") {
                  refreshNumber++;
                  console.log(ps.key, refreshNumber, reN);
                  if (refreshNumber >= reN) {
                    PLU.autoEscape({});
                  }
                }
              },
              onFail(err) {
                console.log(err);
                setTimeout(() => {
                  PLU.loopReadBase(npcName, bookKey, reN);
                }, 1000);
              },
              onEnd(e) {
                setTimeout(() => {
                  PLU.loopReadBase(npcName, bookKey, reN);
                }, 1000);
              },
            });
          }, 500);
        } else if (type == "notice" && msg.indexOf("使用技能等級為") >= 0) {
          UTIL.delSysListener("listenLoopReadBase");
          YFUI.writeToOut("<span style='color:#FFF;'>--讀基本技能書結束--</span>");
          PLU.setBtnRed($("#btn_bt_loopReadBase"), 0);
        } else if (type == "notice" && msg.indexOf("你的背包裡沒有這個物品") >= 0) {
          YFUI.writeToOut("<span style='color:#FFF;'>--讀基本技能書停止--</span>");
          PLU.setBtnRed($("#btn_bt_loopReadBase"), 0);
        }
        return;
      });
      let cmds = "items use " + bookKey;
      PLU.execActions(cmds);
    },
    //================================================================================================
    toSearchFamilyQS($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      YFUI.showInput({
        title: "搜索師門任務",
        text: `格式：任務包含的關鍵字,多個以英文逗號分隔<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">硫磺,黝黑山洞</span>
            [例2] <span style="color:blue;">茅山,</span>
						`,
        value: PLU.getCache("searchFamilyQS") || "硫磺,黝黑山洞",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            arr = str.split(",");
          if (arr.length > 1) {
            PLU.setCache("searchFamilyQS", str);
            clickButton("family_quest", 0);
            PLU.TMP.master = g_obj_map?.get("msg_attrs")?.get("master_name");
            PLU.loopSearchFamilyQS(arr);
          } else {
            PLU.setBtnRed($btn, 0);
            return;
          }
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    loopSearchFamilyQS(keys, cmd) {
      if (!PLU.ONOFF["btn_bt_searchFamilyQS"]) {
        UTIL.delSysListener("listenLoopSearchFamilyQS");
        YFUI.writeToOut("<span style='color:#FFF;'>--停止搜索--</span>");
        PLU.setBtnRed($("#btn_bt_searchFamilyQS"), 0);
        return;
      }
      UTIL.addSysListener("listenLoopSearchFamilyQS", function (b, type, subtype, msg) {
        if (type == "main_msg") {
          if (msg.indexOf(`${PLU.TMP.master}一拂袖`) >= 0 || msg.indexOf("你現在沒有師門任務。") >= 0) {
            UTIL.delSysListener("listenLoopSearchFamilyQS");
            setTimeout(() => {
              PLU.loopSearchFamilyQS(keys);
            }, 250);
          } else if (msg.indexOf("你現在的任務是") >= 0 || msg.indexOf(PLU.TMP.master) >= 0) {
            UTIL.delSysListener("listenLoopSearchFamilyQS");
            let qsStr = msg.replace(/\x03(0)?|href;0;|[\033|\27|\0x1b]\[[0-9|;]+m/gi, "");
            for (let i = 0; i < keys.length; i++) {
              let key = $.trim(keys[i]);
              if (key && qsStr.indexOf(key) >= 0) {
                YFUI.writeToOut("<span style='color:#FF0;'>========= 結束搜索 =========</span>");
                delete PLU.TMP.master;
                PLU.setBtnRed($("#btn_bt_searchFamilyQS"), 0);
                break;
              } else {
                setTimeout(() => {
                  PLU.loopSearchFamilyQS(keys, "family_quest cancel go");
                }, 250);
              }
            }
          }
        }
      });
      if (cmd) clickButton(cmd);
      else clickButton("family_quest", 0);
    },
    //================================================================================================
    toSearchBangQS($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      YFUI.showInput({
        title: "搜索幫派任務",
        text: `格式：任務包含的關鍵字,多個以英文逗號分隔<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">硫磺,黝黑山洞</span>
						`,
        value: PLU.getCache("searchBangQS") || "硫磺,黝黑山洞",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            arr = str.split(",");
          if (arr.length > 1) {
            PLU.setCache("searchBangQS", str);
            clickButton("clan scene", 0);
            PLU.loopSearchBangQS(arr);
          } else {
            PLU.setBtnRed($btn, 0);
            return;
          }
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    loopSearchBangQS(keys, cmd) {
      if (!PLU.ONOFF["btn_bt_searchBangQS"]) {
        UTIL.delSysListener("listenLoopSearchBangQS");
        YFUI.writeToOut("<span style='color:#FFF;'>--停止搜索--</span>");
        PLU.setBtnRed($("#btn_bt_searchBangQS"), 0);
        return;
      }
      UTIL.addSysListener("listenLoopSearchBangQS", function (b, type, subtype, msg) {
        if (type == "main_msg") {
          if (msg.indexOf("幫派使者一拂袖") >= 0 || msg.indexOf("幫派使者：現在沒有任務") >= 0) {
            UTIL.delSysListener("listenLoopSearchBangQS");
            setTimeout(() => {
              PLU.loopSearchBangQS(keys);
            }, 250);
          } else if (msg.indexOf("你現在的任務是") >= 0 || msg.indexOf("幫派使者：") >= 0) {
            UTIL.delSysListener("listenLoopSearchBangQS");
            let qsStr = msg.replace(/\x03(0)?|href;0;|[\033|\27|\0x1b]\[[0-9|;]+m/gi, "");
            for (let i = 0; i < keys.length; i++) {
              let key = $.trim(keys[i]);
              if (key && qsStr.indexOf(key) >= 0) {
                YFUI.writeToOut("<span style='color:#FF0;'>========= 結束搜索 =========</span>");
                PLU.setBtnRed($("#btn_bt_searchBangQS"), 0);
                break;
              } else {
                setTimeout(() => {
                  PLU.loopSearchBangQS(keys, "clan cancel_task go");
                }, 250);
              }
            }
          }
        }
      });
      if (cmd) clickButton(cmd);
      else clickButton("clan task", 0);
    },
    //================================================================================================
    toLoopClick($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_loopClick").text("自動點擊");
        return;
      }
      YFUI.showInput({
        title: "自動點擊",
        text: "輸入自動點擊的次數，確定後點擊要點按鈕",
        value: PLU.getCache("autoClickNum") || 20,
        onOk(val) {
          if (!Number(val)) return;
          setTimeout((o) => {
            $(document).one("click", (o) => {
              let snpc = $(o.target)
                .closest("button")[0]
                .outerHTML.match(/clickButton\([\'\"](.+)[\'\"](,\s*(\d+))*\)/i);
              if (snpc && snpc.length >= 2) {
                let param = snpc[3] ?? 0;
                PLU.setCache("autoClickNum", Number(val));
                PLU.loopClick(snpc[1], param, Number(val));
              } else {
                PLU.setBtnRed($btn, 0);
              }
            });
          }, 500);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopClick(btnCmd, param, clickNum) {
      if (!clickNum || clickNum < 1 || !PLU.ONOFF["btn_bt_loopClick"]) {
        PLU.setBtnRed($("#btn_bt_loopClick"), 0);
        $("#btn_bt_loopClick").text(_("连续点击", "連續點擊"));
        return;
      }
      $("#btn_bt_loopClick").text(_("停点击(", "停點擊(") + clickNum + ")");
      clickButton(btnCmd, param);
      clickNum--;
      setTimeout(() => {
        PLU.loopClick(btnCmd, param, clickNum);
      }, 250);
    },
    //================================================================================================
    loopSlowClick(btnCmd, param, clickNum, delay) {
      if (!delay) delay = 1000;
      if (!clickNum || clickNum < 1 || !PLU.ONOFF["btn_bt_loopSlowClick"]) {
        PLU.setBtnRed($("#btn_bt_loopSlowClick"), 0);
        $("#btn_bt_loopSlowClick").text(_("慢速点击", "慢速點擊"));
        return;
      }
      $("#btn_bt_loopSlowClick").text("停(" + clickNum + ")");
      clickButton(btnCmd, param);
      clickNum--;
      setTimeout(() => {
        PLU.loopSlowClick(btnCmd, param, clickNum, delay);
      }, delay);
    },
    //================================================================================================
    toLoopSlowClick($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_loopSlowClick").text(_("自動点击", "自動點擊"));
        return;
      }
      YFUI.showPop({
        title: "自動點擊",
        text: `輸入自動點擊的次數，输入點擊速度，確定後點擊遊戲中要點的按鈕<br>
						<div style='margin:10px 0;'>
							<span>速度(幾秒一次): </span>
							<input id="slowClickSec" value="0.5" style="font-size:16px;height:30px;width:15%;"></input>
							<span>次數: </span>
							<input id="slowClickTimes" value="${PLU.getCache("autoClickNum") || 20}" style="font-size:16px;height:26px;width:40%;"></input>
						</div>`,
        onOk() {
          let times = Number($("#slowClickTimes").val()),
            delay = Number($("#slowClickSec").val());
          if (Number(times) <= 0 || Number(delay) <= 0) return;
          setTimeout((o) => {
            $(document).one("click", (o) => {
              let snpc = $(o.target)
                .closest("button")[0]
                .outerHTML.match(/clickButton\([\'\"](.+)[\'\"](,\s*(\d+))*\)/i);
              if (snpc && snpc.length >= 2) {
                let param = snpc[3] ?? 0;
                PLU.setCache("autoClickNum", times);
                PLU.loopSlowClick(snpc[1], param, times, delay * 1000);
              } else {
                PLU.setBtnRed($btn, 0);
              }
            });
          }, 500);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    toRecord($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (btnFlag) {
        PLU.TMP.cmds = [];
        $("#btn_record").text(_("停止录制", "停止錄製"));
        return;
      }
      let cmds = PLU.TMP.cmds;
      delete PLU.TMP.cmds;
      // 指令壓縮算法
      var count = 1;
      for (var index = 0; index < cmds.length; index++) {
        if (cmds[index] == cmds[index + 1]) {
          count++;
          continue;
        }
        if (count >= 2 + cmds[index].length == 1) {
          index -= count - 1;
          cmds.splice(index, count, "#" + count + " " + cmds[index]);
        }
        count = 1;
      }
      cmds = cmds
        .map((e) => {
          let res = e.match(/#\d+ ((jh|fb) \d+)/);
          return res ? res[1] : e;
        })
        .join(";");
      YFUI.showPop({
        title: "指令详情",
        text: cmds,
        okText: _("复制", "複製"),
        onOk() {
          if (GM_setClipboard) GM_setClipboard(cmds);
          else YFUI.writeToOut("<span>權限不足！</span>");
          $("#btn_record").text(_("指令录制", "指令錄製"));
        },
      });
    },
    //================================================================================================
    autoMasterGem($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_autoMasterGem").text("一鍵合天神");
        return;
      }
      let arr = ["碎裂的", "裂開的", "無前綴", "無暇的", "完美的", "君王的", "皇帝的"];
      let sel1 = '<select id="startGemLvl" style="font-size:16px;height:30px;width:25%;">';
      arr.forEach((p, pi) => {
        sel1 += '<option value="' + pi + '" ' + (pi == 0 ? "selected" : "") + ">" + p + "</option>";
      });
      sel1 += "</select>";
      YFUI.showPop({
        title: "一鍵合天神",
        text: `選擇合成起始寶石等級，選擇速度(請根據網速和遊戲速度選擇)，確定後自動向上合成所有<br>
						<div style='margin:10px 0;'>
							<span>起始等級: </span>${sel1}
							<span>速度(秒): </span>
							<select id="combineSec" style="font-size:16px;height:30px;width:15%;">
								<option selected>0.5</option>
								<option>1</option>
								<option>2</option>
								<option>3</option>
							</select>
						</div>`,
        width: "382px",
        okText: "開始",
        onOk() {
          let startLvl = Number($("#startGemLvl").val()),
            delay = Number($("#combineSec").val());
          PLU.autoCombineMasterGem(startLvl, delay * 1000);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    autoCombineMasterGem(startLvl, delay, gemCode, count) {
      if (!PLU.ONOFF["btn_bt_autoMasterGem"]) {
        PLU.setBtnRed($("#btn_bt_autoMasterGem"), 0);
        $("#btn_bt_autoMasterGem").text("一鍵合天神");
        YFUI.writeToOut("<span style='color:white;'>==停止合成寶石!==</span>");
        return;
      }
      if (!UTIL.sysListeners["listenCombineMasterGem"]) {
        UTIL.addSysListener("listenCombineMasterGem", function (b, type, subtype, msg) {
          if (type == "notice" && msg.indexOf("合成寶石需要") >= 0) {
            UTIL.delSysListener("listenCombineMasterGem");
            YFUI.writeToOut("<span style='color:#F00;'>--缺少銀兩, 合成結束--</span>");
            PLU.setBtnRed($("#btn_bt_autoMasterGem"), 0);
          }
          return;
        });
      }
      //合成寶石需要5萬銀兩。
      //沒有這麼多的完美的藍寶石
      if (!gemCode || count < 3) {
        PLU.getGemList((gemList) => {
          // console.log(gemList)
          let g = gemList.find((e) => e.key.indexOf("" + (startLvl + 1)) > 0 && e.num >= 3);
          if (g) {
            PLU.autoCombineMasterGem(startLvl, delay, g.key, g.num);
          } else {
            if (startLvl < 6) PLU.autoCombineMasterGem(startLvl + 1, delay);
            else {
              PLU.setBtnRed($("#btn_bt_autoMasterGem"), 0);
              YFUI.writeToOut("<span style='color:white;'>==合成寶石結束!==</span>");
            }
          }
        });
      } else {
        let cd = (delay / 4) | 250,
          n = 1;
        cd = cd > 250 ? cd : 250;
        if (count >= 30000) {
          n = 10000;
          cd = delay;
        } else if (count >= 15000) {
          n = 5000;
          cd = delay;
        } else if (count >= 9000) {
          n = 3000;
          cd = delay;
        } else if (count >= 3000) {
          n = 1000;
          cd = delay;
        } else if (count >= 300) {
          n = 100;
          cd = delay;
        } else if (count >= 150) {
          n = 50;
          cd = delay;
        } else if (count >= 90) {
          n = 30;
          cd = (delay / 2) | 0;
        } else if (count >= 30) {
          n = 10;
          cd = (delay / 3) | 0;
        }
        let cmd = "items hecheng " + gemCode + "_N_" + n + "";
        clickButton(cmd);
        setTimeout(() => {
          PLU.autoCombineMasterGem(startLvl, delay, gemCode, count - n * 3);
        }, cd);
      }
    },
    //================================================================================================
    toSellLaji($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        //$("#btn_bt_sellLaji").text('清理垃圾')
        return;
      }
      let defaultList =
        "破爛衣服,水草,木盾,鐵盾,藤甲盾,青銅盾,鞶革,軍袍,麻帶,破披風,長斗篷,牛皮帶,錦緞腰帶,絲質披風,逆鉤匕,匕首,鐵甲,重甲,精鐵甲,逆鉤匕,銀絲甲,梅花匕,軟甲衣,羊角匕,金剛杖,白蟒鞭,天寒項鍊,天寒手鐲,新月棍,天寒戒,天寒帽,天寒鞋,金彈子,拜月掌套";
      YFUI.showInput({
        title: "清理垃圾",
        text: `格式：物品詞組<br>
						物品詞組：以英文逗號分割多個關鍵詞<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">${defaultList}</span><br>
						`,
        value: PLU.getCache("sellItemNames") || defaultList,
        type: "textarea",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val);
          PLU.setCache("sellItemNames", str);
          let keysList = str.split(",");
          let itemsTimeOut = setTimeout(() => {
            UTIL.delSysListener("listItems");
          }, 5000);
          UTIL.addSysListener("listItems", function (b, type, subtype, msg) {
            if (type != "items") return;
            UTIL.delSysListener("listItems");
            clearTimeout(itemsTimeOut);
            clickButton("prev");
            let iId = 1,
              itemList = [];
            while (b.get("items" + iId)) {
              let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
              if (it && it.length > 4 && it[3] == "0" && keysList.includes(it[1]))
                itemList.push({
                  key: it[0],
                  name: it[1],
                  num: Number(it[2]),
                });
              iId++;
            }
            PLU.loopSellItems(itemList);
          });
          clickButton("items", 0);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopSellItems(itemList) {
      if (itemList.length <= 0) {
        PLU.setBtnRed($("#btn_bt_sellLaji"), 0);
        return YFUI.writeToOut("<span style='color:#F66;'>--無出售物件!--</span>");
      }
      let ac = [];
      itemList.forEach((it) => {
        let ct = it.num;
        while (ct > 0) {
          if (ct >= 10000) {
            ac.push("items sell " + it.key + "_N_10000");
            ct -= 10000;
          } else if (ct >= 1000) {
            ac.push("items sell " + it.key + "_N_1000");
            ct -= 1000;
          } else if (ct >= 100) {
            ac.push("items sell " + it.key + "_N_100");
            ct -= 100;
          } else if (ct >= 50) {
            ac.push("items sell " + it.key + "_N_50");
            ct -= 50;
          } else if (ct >= 10) {
            ac.push("items sell " + it.key + "_N_10");
            ct -= 10;
          } else {
            ac.push("items sell " + it.key + "");
            ct -= 1;
          }
        }
      });
      let acs = ac.join(";");
      PLU.fastExec(acs, () => {
        PLU.setBtnRed($("#btn_bt_sellLaji"), 0);
        YFUI.writeToOut("<span style='color:white;'>==出售完成!==</span>");
      });
    },
    //================================================================================================
    toSplitItem($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      let defaultList =
        "玄武盾,破軍盾,金絲寶甲衣,夜行披風,羊毛斗篷,殘雪戒,殘雪項鍊,殘雪手鐲,殘雪鞋,金絲甲,寶玉甲,月光寶甲,虎皮腰帶,滄海護腰,紅光匕,毒龍鞭,玉清棍,霹靂掌套";
      YFUI.showInput({
        title: "分解裝備",
        text: `格式：物品詞組<br>
						物品詞組：以英文逗號分割多個關鍵詞<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">${defaultList}</span><br>
						`,
        value: PLU.getCache("splitItemNames") || defaultList,
        type: "textarea",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val);
          PLU.setCache("splitItemNames", str);
          let keysList = str.split(",");
          let itemsTimeOut = setTimeout(() => {
            UTIL.delSysListener("listItems_si");
          }, 5000);
          UTIL.addSysListener("listItems_si", function (b, type, subtype, msg) {
            if (type != "items") return;
            UTIL.delSysListener("listItems_si");
            clearTimeout(itemsTimeOut);
            clickButton("prev");
            let iId = 1,
              itemList = [];
            while (b.get("items" + iId)) {
              let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
              if (it && it.length > 4 && it[3] == "0" && keysList.includes(it[1]))
                itemList.push({
                  key: it[0],
                  name: it[1],
                  num: Number(it[2]),
                });
              iId++;
            }
            PLU.loopSplitItem(itemList);
          });
          clickButton("items", 0);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopSplitItem(itemList) {
      if (itemList.length <= 0) {
        PLU.setBtnRed($("#btn_bt_splitItem"), 0);
        return YFUI.writeToOut("<span style='color:#F66;'>--無分解物件!--</span>");
      }
      let ac = [];
      itemList.forEach((it) => {
        let ct = it.num;
        while (ct > 0) {
          if (ct >= 100) {
            ac.push("items splite " + it.key + "_N_100");
            ct -= 100;
          } else if (ct >= 50) {
            ac.push("items splite " + it.key + "_N_50");
            ct -= 50;
          } else if (ct >= 10) {
            ac.push("items splite " + it.key + "_N_10");
            ct -= 10;
          } else {
            ac.push("items splite " + it.key + "");
            ct -= 1;
          }
        }
      });
      let acs = ac.join(";");
      PLU.fastExec(acs, () => {
        PLU.setBtnRed($("#btn_bt_splitItem"), 0);
        YFUI.writeToOut("<span style='color:white;'>==分解完成!==</span>");
      });
    },
    //================================================================================================
    toPutStore($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      let defaultList = "樹枝,碎片,璞玉,青玉,墨玉,白玉,秘籍木盒,錦袋,瑞雪針釦,武穆遺書,隱武竹箋,空識卷軸,技能書,開元寶票,霹靂彈,舞鳶尾,百宜雪梅";
      YFUI.showInput({
        title: "物品入庫",
        text: `格式：物品詞組<br>
						物品詞組：以英文逗號分割多個關鍵詞<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">${defaultList}</span><br>
						`,
        value: PLU.getCache("putStoreNames") || defaultList,
        type: "textarea",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val);
          PLU.setCache("putStoreNames", str);
          let keysList = str.split(",").join("|");
          let itemsTimeOut = setTimeout(() => {
            UTIL.delSysListener("listItems_ps");
          }, 5000);
          UTIL.addSysListener("listItems_ps", function (b, type, subtype, msg) {
            if (type != "items") return;
            UTIL.delSysListener("listItems_ps");
            clearTimeout(itemsTimeOut);
            clickButton("prev");
            let iId = 1,
              itemList = [];
            while (b.get("items" + iId)) {
              let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
              if (it && it.length > 4 && it[3] == "0" && it[1].match(keysList) && it[1] != "青龍碎片" && it[1] != "玄鐵碎片")
                itemList.push({
                  key: it[0],
                  name: it[1],
                  num: Number(it[2]),
                });
              iId++;
            }
            PLU.loopPutStore(itemList);
          });
          clickButton("items", 0);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopPutStore(itemList) {
      if (itemList.length <= 0) {
        PLU.setBtnRed($("#btn_bt_putStore"), 0);
        return YFUI.writeToOut("<span style='color:#F66;'>--無物件入庫!--</span>");
      }
      let ac = [];
      itemList.forEach((it) => {
        ac.push("items put_store " + it.key + "");
      });
      PLU.fastExec(ac.join(";"), () => {
        PLU.setBtnRed($("#btn_bt_putStore"), 0);
        YFUI.writeToOut("<span style='color:white;'>==入庫完成!==</span>");
      });
    },
    //================================================================================================
    toAutoUse($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      let defaultList =
        "*神秘寶箱,靈草,紫芝,狂暴丹,小還丹,大還丹,高級大還丹,高級狂暴丹,高級乾坤再造丹,百年靈草,百年紫芝,特級大還丹,特級狂暴丹,特級乾坤再造丹,千年靈草,千年紫芝,頂級大還丹,頂級狂暴補丸,頂級乾坤補丸,萬年靈草,萬年紫芝";
      YFUI.showInput({
        title: "物品使用",
        text: `格式：物品詞組<br>
						物品詞組：以英文逗號分割多個關鍵詞, 只能單個使用的物品前面加*星號<br>
						<span style="color:red;">例如：</span><br>
						[例1] <span style="color:blue;">${defaultList}</span><br>
						`,
        value: PLU.getCache("autoUseNames") || defaultList,
        type: "textarea",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val);
          PLU.setCache("autoUseNames", str);
          let keysList = str.split(",");
          let itemsTimeOut = setTimeout(() => {
            UTIL.delSysListener("listItems_au");
          }, 5000);
          UTIL.addSysListener("listItems_au", function (b, type, subtype, msg) {
            if (type != "items") return;
            UTIL.delSysListener("listItems_au");
            clearTimeout(itemsTimeOut);
            clickButton("prev");
            let iId = 1,
              itemList = [];
            while (b.get("items" + iId)) {
              let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
              if (!it[1]) continue;
              if (it && it.length > 4 && it[3] == "0") {
                if (keysList.includes(it[1]))
                  itemList.push({
                    key: it[0],
                    name: it[1],
                    num: Number(it[2]),
                    multi: true,
                  });
                else if (keysList.includes("*" + it[1]))
                  itemList.push({
                    key: it[0],
                    name: it[1],
                    num: Number(it[2]),
                    multi: false,
                  });
              }
              iId++;
            }
            PLU.loopAutoUse(itemList);
          });
          clickButton("items", 0);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopAutoUse(itemList) {
      if (itemList.length <= 0) {
        PLU.setBtnRed($("#btn_bt_autoUse"), 0);
        return YFUI.writeToOut("<span style='color:#F66;'>--無物件使用!--</span>");
      }
      let ac = [];
      itemList.forEach((it) => {
        let ct = it.num;
        while (ct > 0) {
          if (it.multi && ct >= 100) {
            ac.push("items use " + it.key + "_N_100");
            ct -= 100;
          } else if (it.multi && ct >= 50) {
            ac.push("items use " + it.key + "_N_50");
            ct -= 50;
          } else if (it.multi && ct >= 10) {
            ac.push("items use " + it.key + "_N_10");
            ct -= 10;
          } else {
            ac.push("items use " + it.key + "");
            ct -= 1;
          }
        }
      });
      PLU.fastExec(ac.join(";"), () => {
        PLU.setBtnRed($("#btn_bt_autoUse"), 0);
        YFUI.writeToOut("<span style='color:white;'>==使用完成!==</span>");
      });
    },
    //================================================================================================
    toLoopScript($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#btn_bt_loopScript").text("循環執行");
        PLU.STO.loopScTo && clearTimeout(PLU.STO.loopScTo) && delete PLU.STO.loopScTo;
        return;
      }
      YFUI.showInput({
        title: "循環執行",
        text: `格式：循環次數@時間間隔|執行指令<br>
						循環次數：省略則默認1次<br>
						時間間隔：省略則默認5(5秒)<br>
						執行指令：以分號分隔的指令<br>
						<span style="color:red;">例如</span><br>
						[例1] 3@5|jh 1;e;n;home;<br>
						[例2] jh 5;n;n;n;w;sign7;
						`,
        value: PLU.getCache("loopScript") || "home;",
        type: "textarea",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            scripts = "",
            times = 1,
            interval = 5,
            arr = str.split("|");
          if (arr.length > 1) {
            scripts = arr[1];
            if (arr[0].indexOf("@") >= 0) {
              times = Number(arr[0].split("@")[0]) || 1;
              interval = Number(arr[0].split("@")[1]) || 5;
            } else {
              times = Number(arr[0]) || 1;
            }
          } else {
            scripts = arr[0];
          }
          PLU.setCache("loopScript", str);
          PLU.loopScript(scripts, times, interval);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    loopScript(scripts, times, interval) {
      times--;
      $("#btn_bt_loopScript").text("停執行(" + times + ")");
      PLU.execActions(scripts, () => {
        if (times <= 0 || !PLU.ONOFF["btn_bt_loopScript"]) {
          PLU.setBtnRed($("#btn_bt_loopScript"), 0);
          $("#btn_bt_loopScript").text("循環執行");
          PLU.STO.loopScTo && clearTimeout(PLU.STO.loopScTo) && delete PLU.STO.loopScTo;
          return;
        } else {
          PLU.STO.loopScTo = setTimeout(() => {
            PLU.loopScript(scripts, times, interval);
          }, interval * 1000);
        }
      });
    },
    //================================================================================================
    toAutoAskQixia($btn, autoTime) {
      if (g_gmain.is_fighting) return;
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) return;
      $(".menu").hide();
      YFUI.showPop({
        title: "自動訪問奇俠",
        text: "自動對話所有有親密度的奇俠, 請在做完20次贊助金錠後再進行<br><b style='color:#F00;'>是否現在進行?</b>",
        autoOk: autoTime ?? null,
        onOk() {
          let jhqxTimeOut = setTimeout(() => {
            UTIL.delSysListener("listQixia");
            PLU.setBtnRed($btn, 0);
          }, 5000);
          UTIL.addSysListener("listQixia", function (b, type, subtype, msg) {
            if (type != "show_html_page" || msg.indexOf("江湖奇俠成長信息") < 0) return;
            UTIL.delSysListener("listQixia");
            clearTimeout(jhqxTimeOut);
            let listHtml = msg;
            clickButton("prev");
            let str = "find_task_road qixia (\\d+)\x03(.{2,4})\x030\x03\\((\\d+)\\)(.{15,25}朱果)?.{30,50}已出師",
              rg1 = new RegExp(str, "g"),
              rg2 = new RegExp(str),
              visQxs = [];
            listHtml.match(rg1).forEach((e) => {
              let a = e.match(rg2);
              if (a)
                visQxs.push({
                  key: a[1],
                  name: a[2],
                  num: Number(a[3]),
                  link: "find_task_road qixia " + a[1],
                  fast: a[4] ? "open jhqx " + a[1] : null,
                });
            });
            visQxs = visQxs.sort((a, b) => {
              if (a.fast && b.num >= 25000) return -1;
              else return 2;
            });
            visQxs.reverse();
            PLU.toAskQixia(visQxs, 0);
          });
          clickButton("open jhqx", 0);
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    toAskQixia(qxList, idx) {
      clickButton("home");
      if (idx >= qxList.length || !PLU.ONOFF["btn_bt_autoAskQixia"]) {
        PLU.setBtnRed($("#btn_bt_autoAskQixia"), 0);
        YFUI.writeToOut("<span style='color:#FFF;'>--奇俠訪問結束!--</span>");
        return;
      }
      let qxObj = qxList[idx];
      if (qxObj.fast) {
        clickButton(qxObj.fast, 0);
        setTimeout(() => {
          PLU.toAskQixia(qxList, idx + 1);
        }, 500);
      } else {
        PLU.execActions(qxObj.link + ";golook_room;", () => {
          let objNpc = UTIL.findRoomNpc(qxObj.name, false, true);
          if (objNpc) {
            PLU.execActions("ask " + objNpc.key + ";ask " + objNpc.key + ";ask " + objNpc.key + ";ask " + objNpc.key + ";ask " + objNpc.key + ";golook_room;", () => {
              setTimeout(() => {
                PLU.toAskQixia(qxList, idx + 1);
              }, 500);
            });
          } else {
            YFUI.writeToOut("<span style='color:#FFF;'>--找不到奇俠:" + qxObj.name + "--</span>");
            setTimeout(() => {
              PLU.toAskQixia(qxList, idx + 1);
            }, 500);
          }
        });
      }
    },
    //================================================================================================
    getQixiaList(callback) {
      let jhQixiaTimeOut = setTimeout(() => {
        UTIL.delSysListener("getlistQixia");
      }, 5000);
      UTIL.addSysListener("getlistQixia", function (b, type, subtype, msg) {
        if (type != "show_html_page" || msg.indexOf("江湖奇俠成長信息") < 0) return;
        UTIL.delSysListener("getlistQixia");
        clearTimeout(jhQixiaTimeOut);
        window.ttttt = msg;
        let listHtml = msg.replace(/\x03(0)?|href;0;|[\033|\27|\0x1b]\[[0-9|;]+m/gi, "");
        clickButton("prev");
        let str =
          "find_task_road qixia (\\d+)(.{2,4})(\\((\\d*)\\))?(open jhqx \\d+朱果)?<\\/td><td.{20,35}>(.{1,10})<\\/td><td.{20,35}>(.{1,15})<\\/td><td .{20,40}領悟(.{2,10})<\\/td><\\/tr>";
        let rg1 = new RegExp(str, "g"),
          rg2 = new RegExp(str),
          qxList = [];
        listHtml.match(rg1).forEach((e) => {
          let a = e.match(rg2);
          if (a)
            qxList.push({
              index: a[1],
              name: a[2],
              num: Number(a[4]) || 0,
              link: "find_task_road qixia " + a[1],
              fast: a[5] ? "open jhqx " + a[1] : null,
              inJh: a[6] && a[6].indexOf("未出世") < 0 ? true : false,
            });
        });
        callback && callback(qxList);
      });
      clickButton("open jhqx", 0);
    },
    //================================================================================================
    toAutoVisitQixia($btn) {
      if (g_gmain.is_fighting) return;
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        //$("#btn_bt_autoVisitQixia").text('親近奇俠')
        PLU.TMP.autoQixiaMijing = false;
        return;
      }
      $(".menu").hide();
      clickButton("open jhqx", 0);
      YFUI.showInput({
        title: "奇俠秘境",
        text:
          `請輸入要提升親密度的遊俠的姓名<br>
                        格式：金錠數量|遊俠姓名@目標友好度<br>
						金錠數量：給予1或5或15金錠，可省略則只對話<br>
						遊俠姓名：只能輸入一個遊俠姓名<br>
						目標友好度：省略則以可學技能的友好度為目標<br>
						<span style="color:red;">例如</span><br>
						[例1] 15|風無痕 <span style="color:blue;">訪問風無痕贈與15金錠</span><br>
						[例2] 火雲邪神 <span style="color:blue;">訪問火雲邪神對話</span><br>
						[例2] 15|步驚鴻@30000 <span style="color:blue;">訪問步驚鴻對話贈與15金錠到30000友好度</span><br>
						` +
          '<div style="text-align:right;"><label>自動挖寶:<input type="checkbox" id="if_auto_wb" name="awb" value="1"/></label><label>不要掃盪秘境:<input type="checkbox" id="if_auto_mj" name="noamj" value="1"/></label></div>',
        value: PLU.getCache("visitQixiaName") || "15|風無痕",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val),
            arr = str.split("|"),
            giveNum = 15,
            qxName = "",
            objectFN = 0;
          let ifAutoMj = $("#if_auto_mj").is(":checked");
          let ifAutoWb = $("#if_auto_wb").is(":checked");
          if (arr.length > 1) {
            giveNum = Number(arr[0]) || 15;
            let nn = arr[1].split("@");
            qxName = nn[0].trim();
            if (nn.length > 1) objectFN = Number(nn[1]);
          } else {
            giveNum = 0;
            let nn = arr[0].split("@");
            qxName = nn[0].trim();
            if (nn.length > 1) objectFN = Number(nn[1]);
          }
          PLU.setCache("visitQixiaName", str);
          PLU.TMP.todayGetXT = 0;
          UTIL.delSysListener("listenVisitNotice");
          PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
          PLU.TMP.goingQixiaMijing = false;
          PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, (err) => {
            if (err) {
              if (err.code == 1) {
                PLU.setBtnRed($btn, 0);
                UTIL.delSysListener("listenVisitNotice");
                PLU.toAutoAskQixia($("#btn_bt_autoAskQixia"), 10);
                YFUI.writeToOut("<span style='color:yellow;'> 今日一共獲得玄鐵令x" + PLU.TMP.todayGetXT + "</span>");
                UTIL.log({
                  msg: " 今日一共獲得玄鐵令x " + PLU.TMP.todayGetXT + "  ",
                  type: "TIPS",
                  time: new Date().getTime(),
                });
              } else {
                YFUI.showPop({
                  title: "提示",
                  text: "<b style='color:#F00;'>" + err.msg + "</b>",
                  onOk() {
                    PLU.setBtnRed($btn, 0);
                    PLU.toAutoVisitQixia($btn);
                  },
                  onX() {
                    PLU.setBtnRed($btn, 0);
                  },
                });
              }
            }
          });
        },
        onNo() {
          PLU.setBtnRed($btn, 0);
        },
        onX() {
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback) {
      PLU.TMP.autoQixiaMijing = true;
      //發現
      PLU.getQixiaList((qxlist) => {
        let testDone = qxlist.find((e) => !!e.fast);
        if (testDone) {
          PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
          callback && callback({ code: 1, msg: "今日奇俠友好度操作已經完畢" });
          return;
        }
        let qx = qxlist.find((e) => e.name == qxName);
        if (!qx) {
          callback && callback({ code: 2, msg: "沒有這個奇俠!" });
          return;
        }
        if (!qx.inJh) {
          callback && callback({ code: 3, msg: "這個奇俠還沒出師!" });
          return;
        }
        let objectFriendNum = objectFN ?? PLU.YFD.qixiaFriend.find((e) => e.name == qxName).skillFN;
        if (qx.num >= objectFriendNum) {
          callback && callback({ code: 4, msg: "奇俠友好度已足夠" });
          return;
        }
        let listenVisitTimeout = function () {
          if (!PLU.TMP.goingQixiaMijing) PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
        };
        UTIL.delSysListener("listenVisitNotice");
        //監聽場景消息
        UTIL.addSysListener("listenVisitNotice", function (b, type, subtype, msg) {
          if (type != "notice" && type != "main_msg") return;
          let msgTxt = UTIL.filterMsg(msg);
          if (msgTxt.match("對你悄聲道：你現在去")) {
            //奇俠說秘境
            let l = msgTxt.match(/(.*)對你悄聲道：你現在去(.*)，應當會有發現/);
            if (l && l.length > 2) {
              PLU.TMP.goingQixiaMijing = true;
              let placeData = PLU.YFD.mjList.find((e) => e.n == l[2]);
              if (placeData) {
                PLU.execActions(placeData.v + ";;find_task_road secret;;", () => {
                  setTimeout(() => {
                    let mapid = g_obj_map.get("msg_room").get("map_id");
                    let shortName = g_obj_map.get("msg_room").get("short");
                    YFUI.writeToOut("<span style='color:#FFF;'>--地圖ID:" + mapid + "--</span>");
                    if (mapid == "public") {
                      PLU.execActions("secret_op1;", () => {
                        PLU.TMP.goingQixiaMijing = false;
                        PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
                      });
                    } else if (ifAutoMj) {
                      UTIL.delSysListener("listenVisitNotice");
                      PLU.setBtnRed($("#btn_bt_autoVisitQixia"), 0);
                      YFUI.writeToOut("<span style='color:yellow;'> ===== 進入了秘境! ===== </span>");
                    } else {
                      let ss = g_obj_map.get("msg_room").elements.find((e) => e.value == "仔細搜索");
                      if (ss) {
                        let cmd_ss = g_obj_map.get("msg_room").get(ss.key.split("_")[0]);
                        PLU.execActions(cmd_ss + ";;", () => {
                          if (ifAutoWb) {
                            let wb = g_obj_map.get("msg_room").elements.find((e) => e.value.indexOf("秘境挖寶") >= 0);
                            if (wb) {
                              PLU.execActions("mijing_wb;;");
                            }
                          }

                          let sd = g_obj_map.get("msg_room").elements.find((e) => e.value.indexOf("掃盪") >= 0);
                          if (sd) {
                            let cmd_sd = g_obj_map.get("msg_room").get(sd.key.split("_")[0]);
                            PLU.doSaoDang(mapid, cmd_sd, () => {
                              PLU.TMP.goingQixiaMijing = false;
                              PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
                            });
                          } else if (shortName == "無盡深淵") {
                            PLU.goWuJinShenYuan(() => {
                              PLU.TMP.goingQixiaMijing = false;
                              PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
                            });
                          } else {
                            UTIL.delSysListener("listenVisitNotice");
                            PLU.setBtnRed($("#btn_bt_autoVisitQixia"), 0);
                            YFUI.writeToOut("<span style='color:yellow;'> ===進入了未通關秘境!=== </span>");
                          }
                        });
                      }
                    }
                  }, 1500);
                });
              }
              return;
            }
          }
          let vis = msgTxt.match(/今日親密度操作次數\((\d+)\/20\)/);
          if (vis) {
            PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
            setTimeout(() => {
              if (!PLU.TMP.goingQixiaMijing) {
                PLU.STO.listenVisit = setTimeout(listenVisitTimeout, 4000);
                let objNpc = UTIL.findRoomNpc(qxName, false, true);
                if (objNpc) {
                  PLU.doVisitAction(objNpc.key, giveNum);
                } else {
                  YFUI.writeToOut("<span style='color:#FFF;'>--找不到奇俠!--</span>");
                  setTimeout(() => {
                    PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
                  }, 500);
                }
              }
            }, 500);
            return;
          }
          if (msgTxt.match("今日做了太多關於親密度的操作")) {
            PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
            callback && callback({ code: 1, msg: "今日奇俠友好度操作已經完畢" });
            return;
          }
          if (msgTxt.match(/今日奇俠贈送次數(\d+)\/(\d+)，.*贈送次數(\d+)\/(\d+)/)) {
            PLU.STO.listenVisit && clearTimeout(PLU.STO.listenVisit);
            callback && callback({ code: 1, msg: "今日奇俠友好度操作已經完畢" });
            return;
          }
          if (msgTxt.match("掃盪成功，獲得：")) {
            let xtnum = parseInt(msgTxt.split("、")[0].split("玄鐵令x")[1]);
            if (xtnum) PLU.TMP.todayGetXT += xtnum;
            xtnum && YFUI.writeToOut("<span>--玄鐵令+" + xtnum + "--</span>");
            return;
          }
          if (msgTxt.match("你開始四處搜索……你找到了")) {
            let xtnum = parseInt(msgTxt.split("、")[0].split("玄鐵令x")[1]);
            if (xtnum) PLU.TMP.todayGetXT += xtnum;
            xtnum && YFUI.writeToOut("<span>--玄鐵令+" + xtnum + "--</span>");
            return;
          }
        });
        PLU.execActions(qx.link + ";;", () => {
          let objNpc = UTIL.findRoomNpc(qxName, false, true);
          if (objNpc) {
            PLU.STO.listenVisit = setTimeout(listenVisitTimeout, 3000);
            PLU.doVisitAction(objNpc.key, giveNum);
          } else {
            YFUI.writeToOut("<span style='color:#FFF;'>--找不到奇俠:" + qxName + "--</span>");
            setTimeout(() => {
              PLU.tryVisitQixia(qxName, giveNum, objectFN, ifAutoMj, ifAutoWb, callback);
            }, 500);
          }
        });
      });
    },
    //================================================================================================
    doVisitAction(qxKey, giveNum) {
      if (giveNum == 0) {
        PLU.execActions("ask " + qxKey + ";");
      } else if (giveNum == 1) {
        PLU.execActions("auto_zsjd_" + qxKey.split("_")[0] + ";");
      } else if (giveNum == 5) {
        PLU.execActions("auto_zsjd5_" + qxKey.split("_")[0] + ";");
      } else {
        PLU.execActions("auto_zsjd20_" + qxKey.split("_")[0] + ";");
      }
    },
    //================================================================================================
    doSaoDang(mapid, cmd, callback) {
      UTIL.addSysListener("listenVisitSaodang", function (b, type, subtype, msg) {
        if (type != "prompt") return;
        let xtnum = parseInt(msg.split("、")[0].split("玄鐵令x")[1]);
        if (["yaowanggu", "leichishan"].includes(mapid)) {
          if (xtnum < 5)
            return setTimeout(() => {
              clickButton(cmd);
            }, 300);
        } else if (["liandanshi", "lianhuashanmai", "qiaoyinxiaocun", "duzhanglin", "shanya", "langhuanyudong", "dixiamigong"].includes(mapid)) {
          if (xtnum < 3)
            return setTimeout(() => {
              clickButton(cmd);
            }, 300);
        }
        UTIL.delSysListener("listenVisitSaodang");
        PLU.execActions(cmd + " go;", () => {
          callback && callback();
        });
      });
      setTimeout(() => {
        clickButton(cmd);
      }, 300);
    },
    //================================================================================================
    goWuJinShenYuan(endcallback) {
      //無盡深淵
      let paths = "e;e;s;w;w;s;s;e;n;e;s;e;e;n;w;n;e;n;w".split(";");
      var sidx = 0;
      let gostep = function (pathArray, stepFunc) {
        let ca = pathArray[sidx];
        PLU.execActions(ca + "", () => {
          stepFunc && stepFunc();
          sidx++;
          if (sidx >= pathArray.length) {
            endcallback && endcallback();
          } else {
            setTimeout(() => {
              gostep(pathArray, stepFunc);
            }, 250);
          }
        });
      };
      gostep(paths, () => {
        let fc = g_obj_map.get("msg_room").elements.find((e) => e.value == "翻查");
        if (fc) {
          let cmd_fc = g_obj_map.get("msg_room").get(fc.key.split("_")[0]);
          PLU.execActions(cmd_fc + "");
        }
      });
    },
    //================================================================================================
    toWaitCDKill($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        //$("#btn_bt_waitCDKill").text('')
        return;
      }
      clickButton("golook_room");
      YFUI.showPop({
        title: "倒計時叫殺門派紛爭",
        text: "倒計時最後5秒叫殺最近結束時間的門派紛爭!，確定後單擊NPC<br>",
        onOk() {
          setTimeout((o) => {
            $(document).one("click", (o) => {
              let npcbtn = $(o.target).closest("button");
              let snpc = npcbtn[0].outerHTML.match(/clickButton\('look_npc (\w+)'/i);
              if (snpc && snpc.length >= 2) {
                let nowTime = new Date().getTime(),
                  cMPFZ = null;
                for (let k in PLU.MPFZ) {
                  if (!cMPFZ || cMPFZ.t > PLU.MPFZ[k].t) cMPFZ = PLU.MPFZ[k];
                }
                if (cMPFZ) {
                  PLU.TMP.DATA_MPFZ = Object.assign({}, cMPFZ, {
                    killId: snpc[1],
                  });
                  YFUI.showPop({
                    title: "倒計時叫殺門派紛爭",
                    text:
                      '<div style="line-height:2;">人物：' +
                      npcbtn.text() +
                      "<br>地點：" +
                      PLU.TMP.DATA_MPFZ.p +
                      "<br>對決：" +
                      PLU.mp2icon(PLU.TMP.DATA_MPFZ.v) +
                      "</div>",
                    okText: "好的",
                    onOk() { },
                    onNo() {
                      PLU.TMP.DATA_MPFZ = null;
                      PLU.setBtnRed($btn, 0);
                    },
                  });
                }
              } else {
                PLU.TMP.DATA_MPFZ = null;
                PLU.setBtnRed($btn, 0);
              }
            });
          }, 500);
        },
        onNo() {
          PLU.TMP.DATA_MPFZ = null;
          PLU.setBtnRed($btn, 0);
        },
      });
    },
    //================================================================================================
    mp2icon(mplist) {
      let htm = "",
        zfarr = mplist.split(" VS "),
        zarr = zfarr[0].split("、"),
        farr = zfarr[1].split("、");
      zarr.forEach((zm) => {
        htm += '<span style="display:inline-block;background:#F66;border-radius:2px;padding:0 2px;margin:1px;color:#FFF;">' + zm + "</span>";
      });
      htm += '<span style="color:#FFF;background:#F00;font-weight:bold;border-radius:50%;padding:2px;">VS</span>';
      farr.forEach((fm) => {
        htm += '<span style="display:inline-block;background:#66F;border-radius:2px;padding:0 2px;margin:1px;color:#FFF;">' + fm + "</span>";
      });
      return htm;
    },
    //================================================================================================
    toCheckAndWaitCDKill(nowTime) {
      let k = PLU.TMP.DATA_MPFZ.t + 1560000;
      let dt = Math.floor((k - nowTime) / 1000);
      if (dt == 5) {
        YFUI.writeToOut("<span style='color:#F99;'>--最後5秒,進入戰鬥!--</span>");
        //PLU.TMP.DATA_MPFZ = null
        //PLU.setBtnRed($btn,0)
        PLU.autoFight({
          targetKey: PLU.TMP.DATA_MPFZ.killId,
          fightKind: "kill",
          onFail() {
            PLU.TMP.DATA_MPFZ = null;
            PLU.setBtnRed($("#btn_bt_waitCDKill"), 0);
            setTimeout((t) => {
              PLU.autoChushi();
            }, 500);
          },
          onEnd() {
            PLU.TMP.DATA_MPFZ = null;
            PLU.setBtnRed($("#btn_bt_waitCDKill"), 0);
            setTimeout((t) => {
              PLU.autoChushi();
            }, 500);
          },
        });
      }
    },
    //================================================================================================
    setListen($btn, listenKey, stat) {
      let btnFlag = 0;
      if (stat != undefined) {
        btnFlag = PLU.setBtnRed($btn, stat);
        PLU.setCache(listenKey, stat);
        return;
      } else {
        btnFlag = PLU.setBtnRed($btn);
      }
      if (!btnFlag) {
        PLU.setCache(listenKey, 0);
        return;
      }
      if (listenKey == "listenQL") {
        //監聽青龍
        YFUI.showInput({
          title: "監聽本服青龍",
          text: `格式：擊殺類型|物品詞組<br>
                            擊殺類型：0殺守方(好人)，1殺攻方(壞人)。<br>
                            物品詞組：以英文逗號分割多個關鍵詞<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">0|斬龍,斬龍寶鐲,碎片</span><br>
                            [例2] <span style="color:blue;">1|*</span>;
                            `,
          value: PLU.getCache(listenKey + "_keys") || "0|斬龍,開天寶棍,天罡掌套,龍皮至尊甲衣",
          type: "textarea",
          onOk(val) {
            let str = $.trim(val);
            if (!str || str.indexOf("|") < 0) return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", str);
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "listenTF") {
        //監聽夜魔
        YFUI.showInput({
          title: "監聽逃犯",
          text: `格式：擊殺類型|逃犯詞組<br>
                            擊殺類型：0殺守方(逃犯)，1殺攻方(捕快)。<br>
                            逃犯詞組：以英文逗號分割多個關鍵詞<br>
                            <span style="color:#F00;">【新人】以#開頭則等候他人開殺再進</span><br>
                            <span style="color:#933;">例如：</span><br>
                            [例1] <span style="color:blue;">0|夜魔*段老大,#夜魔*流寇</span>
                            `,
          value: PLU.getCache(listenKey + "_keys") || "0|夜魔*段老大,夜魔*二娘,#夜魔*嶽老三,#夜魔*雲老四,#夜魔*流寇,#夜魔*惡棍,#夜魔*劇盜",
          type: "textarea",
          onOk(val) {
            let str = $.trim(val);
            if (!str || str.indexOf("|") < 0) return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", str);
            PLU.setCache(listenKey, 1);
            PLU.splitTFParam();
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "listenKFQL") {
        //監聽廣場青龍
        YFUI.showInput({
          title: "監聽跨服青龍",
          text: `格式：擊殺類型|物品詞組<br>
                            擊殺類型：0殺守方(好人)，1殺攻方(壞人)。<br>
                            物品詞組：以英文逗號分割多個關鍵詞<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">0|斬龍,斬龍寶鐲,碎片</span><br>
                            [例2] <span style="color:blue;">1|*</span>;
                            `,
          value: PLU.getCache(listenKey + "_keys") || "1|斬龍,開天寶棍,天罡掌套,龍皮至尊甲衣",
          type: "textarea",
          onOk(val) {
            let str = $.trim(val);
            if (!str || str.indexOf("|") < 0) return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", str);
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "listenYX") {
        //監聽遊俠
        YFUI.showInput({
          title: "監聽遊俠",
          text: `格式：遊俠詞組<br>
                            遊俠詞組：以英文逗號分割多個關鍵詞<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">王語嫣,厲工,金輪法王,虛夜月,雲夢璃,葉孤城</span><br>
                            `,
          value: PLU.getCache(listenKey + "_keys") || [].concat(...PLU.YFD.youxiaList.map((e) => e.v)).join(","),
          type: "textarea",
          onOk(val) {
            let str = $.trim(val);
            if (!str) return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", str);
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "autoTP") {
        //監聽突破
        YFUI.showInput({
          title: "持續突破",
          text: `請輸入需要自動突破的技能，以英文逗號分割，自動突破將在當前全部突破完後才開始。<br>
                            以1|開頭使用金剛舍利加速<br>
                            以2|開頭使用通天丸加速<br>
                            以3|開頭使用突破寶典加速<br>
                            以4|開頭使用三生石加速(未開發)<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">千影百傷棍,1|排雲掌法,2|無相金剛掌,3|九天龍吟劍法,獨孤九劍</span>
                            `,
          value: PLU.getCache(listenKey + "_keys") || "1|千影百傷棍,1|排雲掌法,1|不動明王訣",
          type: "textarea",
          onOk(val) {
            let str = $.trim(val);
            if (!str) return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", str);
            PLU.setCache(listenKey, 1);
            PLU.getSkillsList((allSkills, tupoSkills) => {
              if (tupoSkills.length == 0) {
                PLU.toToPo();
              }
            });
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "autoDY") {
        //監聽突破
        YFUI.showInput({
          title: _("持续钓鱼", "持續釣魚"),
          text: _("请输入需要保留的元宝数", "請輸入需要保留的元寶數"),
          value: PLU.getCache(listenKey + "_key") || 100000,
          onOk(val) {
            let num = Number($.trim(val));
            PLU.setCache(listenKey + "_key", num);
            PLU.setCache(listenKey, 1);
            let room = g_obj_map.get("msg_room");
            if (room) room = room.get("short");
            if (room != "桃溪" || UTIL.inHome()) {
              let path = ["rank go 233;#6 s", "sw;se", "sw", "se", "s", "s"];
              // 人满是啥提示...，不知道...（那就随机选位置吧（
              PLU.execActions(path.slice(0, Math.floor(Math.random() * 6) + 1).join(";") + ";diaoyu");
            }
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "autoConnect") {
        YFUI.showInput({
          title: "自動重連",
          text: `請輸入斷線後自動重連的時間，重連方式為到時間自動刷新頁面。<br>單位為秒，0代表不自動重連。<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">60</span> 代表60秒後刷新頁面
                            `,
          value: PLU.getCache(listenKey + "_keys") || "0",
          //type:"textarea",
          onOk(val) {
            let v = Number(val);
            if (val == "") return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey + "_keys", v);
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "autoSignIn") {
        //YFUI.showPop(
        YFUI.showPop({
          title: "定時一鍵簽到",
          text: `請輸入自動簽到的時間。<br>
						<div><span style="font-size:18px;line-height:2;">每日: </span><input id="autoSignInTime" type="time" style="font-size:20px;border-radius:5px;margin:10px 0"/></div>
						`,
          onOk() {
            let v = $.trim($("#autoSignInTime").val());
            if (v == "") return PLU.setBtnRed($btn, 0);
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else if (listenKey == "autoQuitTeam") {
        //進塔離隊
        YFUI.showPop({
          title: "進塔自動離隊",
          text: `是否進塔自動離隊?<br>`,
          onOk() {
            PLU.setCache(listenKey, 1);
          },
          onNo() {
            PLU.setCache(listenKey, 0);
            PLU.setBtnRed($btn, 0);
          },
        });
      } else {
        PLU.setCache(listenKey, 1);
        return;
      }
    },
    //================================================================================================
    splitTFParam() {
      let ltl = (PLU.getCache("listenTF_keys").split("|")[1] || "").split(",");
      PLU.TMP.lis_TF_list = [];
      PLU.TMP.lis_TF_force = [];
      ltl.map((e, i) => {
        if (e.charAt(0) == "#") {
          PLU.TMP.lis_TF_list.push(e.substring(1));
          PLU.TMP.lis_TF_force.push(0);
        } else {
          PLU.TMP.lis_TF_list.push(e);
          PLU.TMP.lis_TF_force.push(1);
        }
      });
    },
    //================================================================================================
    goQinglong(npcName, place, gb, kf) {
      let placeData = PLU.YFD.qlList.find((e) => e.n == place);
      if (kf || (UTIL.inHome() && placeData)) {
        PLU.execActions(placeData.v + ";golook_room", () => {
          let objNpc = UTIL.findRoomNpc(npcName, !Number(gb));
          if (objNpc) {
            PLU.killQinglong(objNpc.key, 0);
          } else {
            YFUI.writeToOut("<span style='color:#FFF;'>--尋找目標失敗!--</span>");
            PLU.execActions("golook_room;home");
          }
        });
      }
    },
    //================================================================================================
    killQinglong(npcId, tryNum) {
      PLU.autoFight({
        targetKey: npcId,
        fightKind: "kill",
        autoSkill: "random",
        onFail(errCode) {
          if (errCode >= 88 && tryNum < 100) {
            setTimeout(() => {
              PLU.killQinglong(npcId, tryNum + 1);
            }, 250);
            return;
          }
          YFUI.writeToOut("<span style='color:#FFF;'>--搶青龍失敗!--</span>");
          PLU.execActions("home;");
        },
        onEnd() {
          PLU.execActions("prev_combat;home;");
        },
      });
    },
    //================================================================================================
    goTaofan(npcName, npcPlace, flyLink, gb, force) {
      if (UTIL.inHome()) {
        let ctn = 0,
          gocmd = flyLink;
        PLU.YFD.cityList.forEach((e, i) => {
          if (e == npcPlace) ctn = i + 1;
        });
        if (ctn > 0) gocmd = "jh " + ctn;
        PLU.execActions(gocmd + ";golook_room;", (e) => {
          setTimeout((t) => {
            PLU.killTaofan(npcName, -Number(gb), force, 0);
          }, 1000);
        });
      }
    },
    //================================================================================================
    killTaofan(npcName, gb, force, tryCount) {
      console.debug(gb);
      let npcObj = UTIL.findRoomNpc(npcName, gb);
      if (npcObj) {
        if (force) {
          PLU.autoFight({
            targetKey: npcObj.key,
            fightKind: "kill",
            autoSkill: "random",
            onFail(errCode) {
              if (errCode == 4) {
                YFUI.writeToOut("<span style='color:#FFF;'>--已達到上限!取消逃犯監聽!--</span>");
                PLU.setListen($("#btn_bt_listenTF"), "listenTF", 0);
              } else if (errCode > 1 && tryCount < 36) {
                setTimeout(() => {
                  PLU.killTaofan(npcName, gb, force, tryCount + 1);
                }, 500);
                return;
              }
              PLU.execActions("golook_room;home;");
            },
            onEnd() {
              PLU.execActions("prev_combat;home;");
            },
          });
        } else {
          PLU.waitDaLaoKill({
            targetId: npcObj.key,
            onFail(ec) { },
            onOk() {
              PLU.autoFight({
                targetKey: npcObj.key,
                fightKind: "kill",
                autoSkill: "random",
                onFail(errCode) {
                  if (errCode == 4) {
                    YFUI.writeToOut("<span style='color:#FFF;'>--已達到上限!取消逃犯監聽--</span>");
                    PLU.setListen($("#btn_bt_listenTF"), "listenTF", 0);
                  } else YFUI.writeToOut("<span style='color:#FFF;'>--'ERR=" + errCode + "--</span>");
                  PLU.execActions("golook_room;home;");
                },
                onEnd() {
                  PLU.execActions("prev_combat;home;");
                },
              });
            },
          });
        }
      } else {
        YFUI.writeToOut("<span style='color:#FFF;'>--找不到NPC!--</span>");
        if (tryCount < 4) {
          return setTimeout(() => {
            PLU.killTaofan(npcName, gb, force, tryCount + 1);
          }, 500);
        }
        PLU.execActions("golook_room;home;");
      }
    },
    //================================================================================================

    waitDaLaoKill({ targetId, onOk, onFail }) {
      let tryTimes = 0;
      UTIL.addSysListener("lookNpcWait", function (b, type, subtype, msg) {
        if (type == "notice" && subtype == "notify_fail" && msg.indexOf("沒有這個人") >= 0) {
          YFUI.writeToOut("<span style='color:#FFF;'>--目標已丟失!--</span>");
          UTIL.delSysListener("lookNpcWait");
          return onFail && onFail(1);
        }
        if (type == "look_npc") {
          let desc = UTIL.filterMsg(b.get("long"));
          let lookInfo = desc.match(/[他|她]正與 (\S*)([\S\s]*) 激烈爭鬥中/);
          if (lookInfo && lookInfo.length > 2 && $.trim(lookInfo[2]) != "") {
            YFUI.writeToOut("<span style='color:#9F9;'>--目標已被大佬攻擊,可以跟進--</span>");
            UTIL.delSysListener("lookNpcWait");
            return onOk && onOk();
          }
          tryTimes++;
          if (tryTimes > 30) {
            UTIL.delSysListener("lookNpcWait");
            return onFail && onFail(30);
          } else {
            setTimeout(() => {
              clickButton("look_npc " + targetId);
            }, 500);
          }
        }
        //如提前進入戰鬥可能是因為殺氣, 逃跑後繼續
        if (type == "vs" && subtype == "vs_info" && b.get("vs2_pos1") != targetId) {
          PLU.autoEscape({
            onEnd() {
              setTimeout(() => {
                clickButton("look_npc " + targetId);
              }, 500);
            },
          });
        }
      });
      clickButton("look_npc " + targetId);
    },

    //================================================================================================
    fixJhName(name) {
      switch (name) {
        case "白駝山":
          return "白馱山";
        case "黑木崖":
          return "魔教";
        case "光明頂":
          return "明教";
        case "鐵血大旗門":
          return "大旗門";
        case "梅莊":
          return "寒梅莊";
      }
      return name;
    },
    //================================================================================================
    goFindYouxia(params) {
      //{paths,idx,objectNPC}
      if (params.idx >= params.paths.length) {
        setTimeout(() => {
          PLU.execActions("home");
        }, 500);
        YFUI.writeToOut("<span style='color:#FFF;'>--找不到遊俠!...已搜索完地圖--</span>");
        return;
      }
      let acs = [params.paths[params.idx]];
      PLU.actions({
        paths: acs,
        idx: 0,
        onPathsEnd() {
          setTimeout(() => {
            let npcObj = UTIL.findRoomNpc(params.objectNPC, false, true);
            if (npcObj) {
              YFUI.writeToOut("<span style='color:#FFF;'>--遊俠已找到--</span>");
              PLU.killYouXia(npcObj.key, 0);
            } else {
              params.idx++;
              PLU.goFindYouxia(params);
            }
          }, 300);
        },
        onPathsFail() {
          setTimeout(() => {
            PLU.execActions("home");
          }, 500);
          YFUI.writeToOut("<span style='color:#FFF;'>--找不到遊俠!...路徑中斷--</span>");
          return;
        },
      });
    },
    //================================================================================================
    killYouXia(npcId, tryNum) {
      PLU.autoFight({
        targetKey: npcId,
        fightKind: "kill",
        autoSkill: "multi",
        onFail(errCode) {
          if (String(errCode).indexOf("delay_") >= 0) {
            let mc = String(errCode).match(/delay_(\d+)/);
            if (mc) {
              let wtime = 500 + 1000 * Number(mc[1]);
              PLU.execActions("follow_play " + npcId + ";");
              YFUI.writeToOut("<span style='color:#FFF;'>▶開始嘗試做遊俠跟班!!</span>");
              setTimeout(() => {
                PLU.execActions("follow_play none", () => {
                  YFUI.writeToOut("<span style='color:#FFF;'>◼停止做遊俠跟班!!準備開殺!!</span>");
                  PLU.killYouXia(npcId, tryNum + 1);
                });
              }, wtime);
              return;
            }
          } else if (errCode >= 88 && tryNum < 44) {
            setTimeout(() => {
              PLU.killYouXia(npcId, tryNum + 1);
            }, 1000);
            return;
          } else if (errCode == 1) {
            YFUI.writeToOut("<span style='color:#F99;'>--現場找不到遊俠了!--</span>");
          } else {
            YFUI.writeToOut("<span style='color:#F99;'>--攻擊遊俠失敗!--</span>");
          }
          PLU.execActions("home;");
        },
        onEnd() {
          PLU.execActions("prev_combat;home;");
        },
      });
    },
    //================================================================================================
    getSkillsList(callback) {
      UTIL.addSysListener("getSkillsList", function (b, type, subtype, msg) {
        if (type != "skills" && subtype != "list") return;
        UTIL.delSysListener("getSkillsList");
        clickButton("prev");
        let all = [],
          tupo = [];
        all = PLU.parseSkills(b);
        all.forEach((skill) => {
          if (skill.state >= 4) {
            tupo.push(skill);
          }
        });
        callback(all, tupo);
      });
      clickButton("skills");
    },
    //================================================================================================
    parseSkills(b) {
      let allSkills = [];
      for (var i = b.elements.length - 1; i > -1; i--) {
        if (b.elements[i].key && b.elements[i].key.match(/skill(\d+)/)) {
          var attr = b.elements[i].value.split(",");
          var skill = {
            key: attr[0],
            name: $.trim(UTIL.filterMsg(attr[1])),
            level: Number(attr[2]),
            kind: attr[4],
            prepare: Number(attr[5]),
            state: Number(attr[6]),
            from: attr[7],
          };
          allSkills.push(skill);
        }
      }
      allSkills = allSkills.sort((a, b) => {
        if (a.kind == "known") return -1;
        else if (b.kind != "known" && a.from == "基礎武功") return -1;
        else if (b.kind != "known" && b.from != "基礎武功" && a.kind == "force") return -1;
        else return 1;
      });
      return allSkills;
    },
    //================================================================================================
    toToPo() {
      setTimeout(function () {
        if (UTIL.inHome()) {
          PLU.getSkillsList((allSkills, tupoSkills) => {
            if (tupoSkills.length > 0) {
              if (PLU.STO.outSkillList) clearTimeout(PLU.STO.outSkillList);
              PLU.STO.outSkillList = setTimeout(() => {
                PLU.STO.outSkillList = null;
                if (!!$("#out_top").height() && $("#out_top .outtitle").text() == "我的技能") clickButton("home");
              }, 200);
              return;
            }
            let tpArr = PLU.getCache("autoTP_keys").split(",");
            let tpList = [];
            tpArr.forEach((s) => {
              let sk = {};
              let cs = s.match(/((\d)\|)?(.*)/);
              if (cs) {
                sk.name = cs[3];
                sk.sp = Number(cs[2]);
              } else {
                sk.name = s;
                sk.sp = 0;
              }
              let skobj = allSkills.find((e) => e.name.match(sk.name));
              if (skobj) tpList.push(Object.assign({}, skobj, sk));
            });
            PLU.TMP.stopToPo = false;
            PLU.toPo(tpList, 0);
          });
        }
      }, 500);
    },
    //================================================================================================
    toPo(tpList, skIdx) {
      if (skIdx < tpList.length && !PLU.TMP.stopToPo) {
        let acts = "enable " + tpList[skIdx].key + ";tupo go," + tpList[skIdx].key + ";";
        if (tpList[skIdx].sp == 1) acts += "tupo_speedup4_1 " + tpList[skIdx].key + " go;";
        else if (tpList[skIdx].sp == 2) acts += "tupo_speedup3_1 " + tpList[skIdx].key + " go;";
        else if (tpList[skIdx].sp == 3) acts += "tupo_up " + tpList[skIdx].key + " go;";
        else if (tpList[skIdx].sp == 4) acts += "items info obj_sanshengshi;event_1_66830905 " + tpList[skIdx].key + " go;";

        PLU.execActions(acts, () => {
          setTimeout(() => {
            if (PLU.STO.outSkillList) clearTimeout(PLU.STO.outSkillList);
            PLU.STO.outSkillList = null;
            PLU.toPo(tpList, skIdx + 1);
          }, 300);
        });
      } else {
        YFUI.writeToOut("<span style='color:yellow;'> ==突破完畢!== </span>");
        clickButton("home");
      }
    },
    //================================================================================================
    toBangFour(n) {
      UTIL.log({
        msg: " 進入幫四(" + n + ") ",
        type: "TIPS",
        time: new Date().getTime(),
      });
      PLU.STO.bangFourTo && clearTimeout(PLU.STO.bangFourTo);
      PLU.STO.bangFourTo = setTimeout(function () {
        clickButton("home");
      }, 30 * 60 * 1000);
      clickButton("clan fb enter shiyueweiqiang-" + n, 0);
    },
    toBangSix() {
      UTIL.log({ msg: " 進入幫六 ", type: "TIPS", time: new Date().getTime() });
      PLU.STO.bangSixTo && clearTimeout(PLU.STO.bangSixTo);
      PLU.STO.bangSixTo = setTimeout(function () {
        clickButton("home");
      }, 30 * 60 * 1000);
      clickButton("clan fb enter manhuanqishenzhai", 0);
    },
    //================================================================================================
    inBangFiveEvent() {
      PLU.toggleFollowKill($("#btn_bt_kg_followKill"), "followKill", 1);
      var moving = false;
      PLU.TMP.listenBangFive = true;
      UTIL.addSysListener("listenBangFive", function (b, type, subtype, msg) {
        if (!moving && type == "jh" && (subtype == "dest_npc" || subtype == "info")) {
          moving = true;
          let roomName = UTIL.filterMsg(g_obj_map.get("msg_room").get("short"));
          if (roomName.match(/蒙古高原|成吉思汗的金帳/) && !UTIL.roomHasNpc()) {
            PLU.execActions(";;n;", () => {
              moving = false;
            });
          } else {
            moving = false;
          }
        }
        /*
        type:main_msg
        msg:你獲得：\x1B[34m三\x1B[2;37;0m\x1B[35m生\x1B[2;37;0m\x1B[31m石
         */

        if (type == "home" && subtype == "index") {
          UTIL.delSysListener("listenBangFive");
          YFUI.writeToOut("<span style='color:white;'> ==幫五完畢!== </span>");
          PLU.execActions("golook_room;home");
        }
      });
    },
    intervene($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        UTIL.delSysListener("intervene");
        UTIL.delSysListener("score");
        return;
      }
      let Fight = function (b, num) {
        PLU.autoFight({
          targetKey: b.get("vs2_pos" + num),
          fightKind: "fight",
          onEnd() {
            UTIL.delSysListener("intervene");
            UTIL.delSysListener("score");
            PLU.setBtnRed($btn);
          },
          onFail() {
            PLU.autoFight({
              targetKey: b.get("vs2_pos" + num),
              onEnd() {
                UTIL.delSysListener("intervene");
                UTIL.delSysListener("score");
                PLU.setBtnRed($btn);
              },
              onFail() {
                if (num <= 7) {
                  Fight(++num);
                } else {
                  UTIL.delSysListener("intervene");
                  UTIL.delSysListener("score");
                }
              },
            });
          },
        });
      };
      UTIL.addSysListener("intervene", (b, type, subtype, msg) => {
        if (type == "vs" && subtype == "vs_info") {
          UTIL.delSysListener("intervene");
          UTIL.delSysListener("score");
          Fight(b, 1);
        }
      });
      UTIL.addSysListener("score", (b, type, subtype, msg) => {
        if (type == "score" && subtype == "user") {
          if (b.get("long").indexOf("激烈爭鬥中...") == -1) {
            PLU.execActions("score " + b.get("id"));
            return;
          }
          UTIL.delSysListener("score");
          PLU.execActions("watch_vs " + b.get("id"));
        }
      });
      YFUI.showPop({
        title: _("杀隐藏怪", "殺隱藏怪"),
        text: _("自动观战，自动加入战斗<br>确认后，点开要跟的玩家页面", "自動觀戰，自動加入戰鬥<br>確認後，點開要跟的玩家頁面"),
        onNo() {
          UTIL.delSysListener("intervene");
          UTIL.delSysListener("score");
          PLU.setBtnRed($btn);
        },
      });
    },
    // 字符串相似度算法
    getSimilarity(str1, str2) {
      let sameNum = 0;
      for (let i = 0; i < str1.length; i++)
        for (let j = 0; j < str2.length; j++)
          if (str1[i] === str2[j]) {
            sameNum++;
            break;
          }
      let length = Math.max(str1.length, str2.length);
      return (sameNum / length) * 100 || 0;
    },
    npcDataUpdate() {
      var wayList = [...new Set(PLU.YFD.mapsLib.Npc.map((e) => e.way))];
      if (PLU.YFD.mapsLib.Npc_New[PLU.YFD.mapsLib.Npc_New.length - 1]) var i = wayList.indexOf(PLU.YFD.mapsLib.Npc_New[PLU.YFD.mapsLib.Npc_New.length - 1].way);
      else var i = 0;
      PLU.UTIL.addSysListener("look_npc", (b, type, subtype, msg) => {
        if (type != "look_npc") return;
        if (b.get("id").indexOf("bad_target_") == 0) return;
        if (b.get("id").indexOf("hero_") == 0) return;
        if (b.get("id").indexOf("eren_") == 0) return;
        if (b.get("id").indexOf("bukuai") == 0) return;
        if (PLU.YFD.qixiaList.includes(ansi_up.ansi_to_text(b.get("name")))) return;
        let roomInfo = g_obj_map.get("msg_room");
        let jh = PLU.YFD.cityId[roomInfo.get("map_id")] ?? roomInfo.get("map_id");
        let curName = UTIL.filterMsg(roomInfo.get("short") || "");
        PLU.YFD.mapsLib.Npc_New.push({
          jh: jh,
          loc: curName,
          name_new: ansi_up.ansi_to_text(b.get("name")),
          id: b.get("id") || "",
          desc: ansi_up.ansi_to_text(b.get("long")?.split("\n")[1]),
          way: wayList[i],
        });
      });

      func = () => {
        PLU.execActions(wayList[i], () => {
          for (var npc of PLU.UTIL.getRoomAllNpc()) PLU.execActions("look_npc " + npc.key);
          setTimeout(() => {
            i++;
            func();
          }, 1500);
        });
      };
      func();
    },
    //================================================================================================
    checkUseSkills() {
      let curTime = new Date().getTime();
      if (!PLU.battleData.performTime || curTime - PLU.battleData.performTime >= 400) {
        PLU.battleData.performTime = curTime;
        if (!PLU.battleData.mySide) {
          let vsInfo = g_obj_map.get("msg_vs_info");
          for (let i = vsInfo.elements.length - 1; i > -1; i--) {
            let val = vsInfo.elements[i].value + "";
            if (!val || val.indexOf(PLU.accId) < 0) continue;
            PLU.battleData.myPos = vsInfo.elements[i].key.charAt(7);
            PLU.battleData.mySide = vsInfo.elements[i].key.substring(0, 3);
            break;
          }
        }
        if (PLU.battleData.mySide) {
          if (PLU.getCache("autoCure") == 1) {
            PLU.checkAutoCure();
          }
          if (PLU.getCache("autoPerform") >= 1) {
            PLU.checkAutoPerform();
          }
        }
      }
    },
    //================================================================================================
    setAutoCure($btn, listenKey, stat) {
      if (listenKey == "autoCure") {
        //自動加血藍
        YFUI.showInput({
          title: "自動加血加藍",
          text: `格式：血百分比|加血技能,藍百分比|加藍技能，以英文逗號分割，每樣只能設置一個技能。<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">50|道種心魔經,10|不動明王訣</span><br> 血低於50%自動加血,藍低於10%自動加藍<br>
                            [例2] <span style="color:blue;">30|紫血大法</span><br> 血低於30%自動加血技能,不自動加藍<br>
                            `,
          value: PLU.getCache(listenKey + "_keys") || "10|道種心魔經,10|不動明王訣",
          onOk(val) {
            let str = $.trim(val);
            PLU.setCache(listenKey + "_keys", str);
            PLU.splitCureSkills();
          },
          onNo() { },
        });
      }
    },
    toggleAutoCure($btn, listenKey, stat) {
      let btnFlag = 0;
      if (stat != undefined) {
        btnFlag = PLU.setBtnRed($btn, stat);
        PLU.setCache(listenKey, stat);
      } else {
        btnFlag = PLU.setBtnRed($btn);
      }
      if (!btnFlag) {
        return PLU.setCache(listenKey, 0);
      } else {
        PLU.setCache(listenKey, 1);
        setTimeout(() => {
          YFUI.writeToOut("<span style='color:yellow;'>自動血藍: " + PLU.getCache(listenKey + "_keys") + " </span>");
        }, 100);
      }
    },
    //================================================================================================
    splitCureSkills() {
      let kf = (PLU.getCache("autoCure_keys") || "").split(",");
      PLU.TMP.autoCure_percent = "";
      PLU.TMP.autoCure_skills = "";
      PLU.TMP.autoCure_force_percent = "";
      PLU.TMP.autoCure_force_skills = "";
      if (kf.length > 0) {
        let acp = kf[0].split("|");
        PLU.TMP.autoCure_percent = Number(acp[0]) || 50;
        PLU.TMP.autoCure_skills = acp[1];
        if (kf.length > 1) {
          let acf = kf[1].split("|");
          PLU.TMP.autoCure_force_percent = Number(acf[0]) || 10;
          PLU.TMP.autoCure_force_skills = acf[1];
        }
      }
    },
    //================================================================================================
    checkAutoCure() {
      let vsInfo = g_obj_map.get("msg_vs_info");
      let userInfo = g_obj_map.get("msg_attrs");
      let keePercent = ((100 * Number(vsInfo.get(PLU.battleData.mySide + "_kee" + PLU.battleData.myPos))) / Number(userInfo.get("max_kee"))).toFixed(2);
      let forcePercent = ((100 * Number(vsInfo.get(PLU.battleData.mySide + "_force" + PLU.battleData.myPos))) / Number(userInfo.get("max_force"))).toFixed(2);
      if (!PLU.TMP.autoCure_percent) {
        PLU.splitCureSkills();
      }
      if (PLU.TMP.autoCure_force_skills && Number(forcePercent) < PLU.TMP.autoCure_force_percent) {
        PLU.autoCureByKills(PLU.TMP.autoCure_force_skills, forcePercent);
      } else if (PLU.TMP.autoCure_skills && Number(keePercent) < PLU.TMP.autoCure_percent && PLU.battleData.cureTimes < 3) {
        PLU.autoCureByKills(PLU.TMP.autoCure_skills, forcePercent);
      }
    },
    //================================================================================================
    autoCureByKills(skill, forcePercent) {
      if (PLU.battleData && PLU.battleData.xdz > 2) {
        let rg = new RegExp(skill);
        let useSkill = PLU.selectSkills(rg);
        if (useSkill) {
          clickButton(useSkill.key, 0);
          if (Number(forcePercent) > 1) PLU.battleData.cureTimes++;
        }
      }
    },
    //================================================================================================
    setAutoPerform($btn, listenKey, stat) {
      if (listenKey == "autoPerform") {
        //自動技能
        let skillsList = [];
        try {
          skillsList = JSON.parse(PLU.getCache(listenKey + "_keysList"));
        } catch (error) {
          skillsList = ["6|千影百傷棍,九天龍吟劍法", "", "", "", "3|九天龍吟劍法"];
        }
        YFUI.showInput({
          title: "自動技能",
          text: `格式：觸發氣值|技能詞組，以英文逗號分割多個關鍵詞。<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">9|千影百傷棍,九天龍吟劍法,排雲掌法</span><br> 氣大於等於9時自動使用技能<br>
                            `,
          value: skillsList,
          inputs: ["技能1", "技能2", "技能3", "技能4"],
          onOk(val) {
            PLU.setCache(listenKey + "_keysList", JSON.stringify(val));
            if (PLU.getCache(listenKey)) {
              PLU.setPerformSkill(PLU.getCache(listenKey));
            }
          },
          onNo() { },
        });
      }
    },
    toggleAutoPerform($btn, listenKey, stat) {
      let curIdx = Number(PLU.getCache(listenKey));
      if (stat != undefined) {
        if (stat > 0) {
          PLU.setBtnRed($btn, 1);
          PLU.setPerformSkill(stat);
        } else PLU.setBtnRed($btn, 0);
        $btn.text([_("连招", "連招"), "技一", "技二", "技三", "技四"][stat]);
        PLU.setCache(listenKey, stat);
        if (stat > 0) PLU.TMP.lastAutoPerformSet = stat;
      } else {
        let nowTime = Date.now();
        if (curIdx == 0 && nowTime - (PLU.TMP.lastClickAutoPerform || 0) < 350) {
          curIdx = PLU.TMP.lastAutoPerformSet || 1;
          curIdx++;
          if (curIdx > 4) curIdx = 1;
        } else {
          curIdx = curIdx == 0 ? PLU.TMP.lastAutoPerformSet || 1 : 0;
        }
        PLU.TMP.lastClickAutoPerform = nowTime;
        if (curIdx > 0) PLU.TMP.lastAutoPerformSet = curIdx;
        PLU.setCache(listenKey, curIdx);
        if (curIdx == 0) {
          PLU.setBtnRed($btn, 0);
          $btn.text("連招");
        } else {
          PLU.setBtnRed($btn, 1);
          $btn.text([_("连招", "連招"), "技一", "技二", "技三", "技四"][curIdx]);
          PLU.setPerformSkill(curIdx);
        }
      }
    },
    setPerformSkill(idx) {
      let skillsList = [];
      idx = idx - 1;
      try {
        skillsList = JSON.parse(PLU.getCache("autoPerform_keysList"));
      } catch (error) {
        skillsList = [];
      }
      let str = skillsList[idx] || "";
      let aps = str.split("|");
      if (aps && aps.length == 2) {
        PLU.TMP.autoPerform_xdz = Number(aps[0]);
        PLU.TMP.autoPerform_skills = aps[1].split(",");
      } else {
        PLU.TMP.autoPerform_xdz = 0;
        PLU.TMP.autoPerform_skills = [];
      }
      setTimeout(() => {
        let setCh = ["一", "二", "三", "四"][idx];
        YFUI.writeToOut(
          "<span style='color:yellow;'>自動技能[" + setCh + "] : " + str + " </span><br><span style='color:white;'>** 雙擊自動技能按鈕切換技能設置 **</span>",
        );
      }, 100);
    },
    //================================================================================================
    checkAutoPerform() {
      // if(PLU.battleData.autoSkill) return;
      if (!PLU.TMP.autoPerform_xdz) return;
      // if(!PLU.TMP.autoPerform_xdz){
      //     let aps = PLU.getCache("autoPerform_keys").split('|')
      //     PLU.TMP.autoPerform_xdz = Number(aps[0])
      //     PLU.TMP.autoPerform_skills = aps[1].split(',')
      //}
      if (PLU.battleData.xdz >= PLU.TMP.autoPerform_xdz) {
        if (PLU.TMP.autoPerform_skills && PLU.TMP.autoPerform_skills.length > 0) {
          PLU.TMP.autoPerform_skills.forEach((skn, idx) => {
            let useSkill = PLU.selectSkills(skn);
            if (useSkill) {
              setTimeout((e) => {
                clickButton(useSkill.key, 0);
              }, idx * 100);
            }
          });
        }
      }
    },
    //================================================================================================
    setFightSets($btn, listenKey, stat) {
      if (listenKey == "followKill") {
        //開跟殺
        YFUI.showInput({
          title: "開跟殺",
          text: `格式：跟殺的人名詞組，以英文逗號分割多個關鍵詞，人名前帶*為反跟殺。<br>
                            <span style="color:red;">例如：</span><br>
                            [例1] <span style="color:blue;">步驚鴻,*醉漢</span><br> 步驚鴻攻擊(殺or比試)誰我攻擊誰；誰攻擊醉漢我攻擊誰<br>
                            `,
          value: PLU.getCache(listenKey + "_keys") || "風,豹,劍,門,豆,七,星,虎,影,貓", // 顺序怎么随口怎么来 XD
          //type:"textarea",
          onOk(val) {
            let str = $.trim(val);
            PLU.setCache(listenKey + "_keys", str);
            PLU.splitFollowKillKeys();
          },
          onNo() { },
        });
      }
    },
    toggleFollowKill($btn, listenKey, stat) {
      let btnFlag = 0;
      if (stat != undefined) {
        btnFlag = PLU.setBtnRed($btn, stat);
        PLU.setCache(listenKey, stat);
      } else {
        btnFlag = PLU.setBtnRed($btn);
      }
      if (!btnFlag) {
        return PLU.setCache(listenKey, 0);
      } else {
        PLU.splitFollowKillKeys();
        PLU.setCache(listenKey, 1);
        setTimeout(() => {
          YFUI.writeToOut("<span style='color:yellow;'>自動跟殺: " + PLU.getCache(listenKey + "_keys") + " </span>");
        }, 100);
      }
    },
    //================================================================================================
    splitFollowKillKeys() {
      let keystr = PLU.getCache("followKill_keys") || "";
      let keys = keystr.split(/[,，]/);
      PLU.FLK = {
        followList: [],
        defendList: [],
      };
      keys.forEach((e) => {
        if (!e) return;
        if (e.charAt(0) == "*") {
          PLU.FLK.defendList.push(e.substring(1));
        } else {
          PLU.FLK.followList.push(e);
        }
      });
    },
    //================================================================================================
    toCheckFollowKill(attacker, defender, fightType, msgText) {
      if (!PLU.FLK) PLU.splitFollowKillKeys();
      for (let i = 0; i < PLU.FLK.followList.length; i++) {
        let flname = PLU.FLK.followList[i];
        if (attacker.match(flname)) {
          PLU.autoFight({
            targetName: defender,
            fightKind: fightType,
            onFail() { },
            onEnd() { },
          });
          return;
        }
      }
      for (let i = 0; i < PLU.FLK.defendList.length; i++) {
        let dfname = PLU.FLK.defendList[i];
        if (defender.match(dfname)) {
          PLU.autoFight({
            targetName: attacker,
            fightKind: fightType,
            onFail() { },
            onEnd() { },
          });
          return;
        }
      }
    },
    //================================================================================================
    startSync($btn) {
      PLU.getTeamInfo((t) => {
        if (!t) PLU.setBtnRed($btn);
        else {
          YFUI.writeToOut("<span style='color:yellow;'>===隊伍同步開始" + (t.is_leader ? ", <b style='color:#F00;'>我是隊長</b>" : "") + " ===</span>");
          PLU.allowedcmds = ["go", "fb", "yell", "rank", "fight", "kill", "escape", "jh", "ask", "npc_datan", "give", "room_sousuo", "change_server"];
          if (t.is_leader) {
            PLU.TMP.leaderTeamSync = true;
          } else {
            PLU.listenTeamSync(t.leaderId);
          }
        }
      });
    },
    toggleTeamSync($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (btnFlag) {
        PLU.TMP.teamSync = true;
        if (PLU.TMP.firstSync) PLU.startSync($btn);
        else {
          YFUI.showPop({
            title: "隊伍同步",
            text: "<b style='color:#F00;'>入隊後再打開隊伍同步!!</b><br>隊長發布指令, 隊員監聽同步指令!",
            okText: "同步",
            onOk(e) {
              PLU.TMP.firstSync = 1;
              PLU.startSync($btn);
            },
            onNo() {
              PLU.setBtnRed($btn);
            },
            onX() {
              PLU.setBtnRed($btn);
            },
          });
        }
      } else {
        PLU.TMP.teamSync = false;
        PLU.TMP.leaderTeamSync = false;
        UTIL.delSysListener("syncTeamChannel");
      }
    },
    //================================================================================================
    commandTeam(args) {
      if (!PLU.TMP.leaderTeamSync) return;
      let cmd = args[0];
      if (
        !g_gmain.is_fighting &&
        (PLU.allowedcmds.indexOf(cmd.split(" ")[0]) > -1 ||
          cmd.indexOf("find_") == 0 ||
          cmd.indexOf("event_") == 0 ||
          cmd.indexOf("give_") == 0 ||
          cmd.indexOf("get_") == 0 ||
          cmd.indexOf("op1") >= 0 ||
          cmd.indexOf("_op2") > 0 ||
          ["nw", "n", "ne", "w", "e", "sw", "s", "se"].includes(cmd))
      ) {
        cmd = PLU.Base64.encode(args[0]).split("").join("-");
        clickButton("team chat " + cmd + "\n");
      }
    },
    //================================================================================================
    listenTeamSync(leaderId) {
      UTIL.addSysListener("syncTeamChannel", (b, type, subtype, msg) => {
        if (type == "channel" && subtype == "team" && msg.indexOf(leaderId) > 0 && msg.indexOf("【隊伍】") > 0) {
          var cmd = PLU.Base64.decode(msg.split("：")[1].replace("\x1B[2;37;0m", "").replace(/-/g, "")).replace(/\n/g, "");
          if (
            PLU.allowedcmds.indexOf(cmd.split(" ")[0]) > -1 ||
            cmd.indexOf("find_") == 0 ||
            cmd.indexOf("event_") == 0 ||
            cmd.indexOf("give_") == 0 ||
            cmd.indexOf("get_") == 0 ||
            cmd.indexOf("op1") >= 0 ||
            cmd.indexOf("_op2") > 0 ||
            ["nw", "n", "ne", "w", "e", "sw", "s", "se"].includes(cmd)
          ) {
            clickButton(cmd);
          }
          /*if (cmd == "change_server world") {
            clickButton("team join " + leaderId + "-1a1a");
}*/
        }
      });
    },
    //================================================================================================
    getTeamInfo(callback) {
      UTIL.addSysListener("checkTeam", (b, type, subtype, msg) => {
        if (type != "team" && subtype != "info") return;
        UTIL.delSysListener("checkTeam");
        if (b.get("team_id")) {
          if (b.get("is_member_of") == "1") {
            callback &&
              callback({
                is_leader: parseInt(b.get("is_leader")),
                leaderId: b.get("member1").split(",")[0],
              });
          } else {
            callback && callback(0);
          }
        } else {
          callback && callback(0);
        }
        clickButton("prev");
      });
      clickButton("team");
    },
    //================================================================================================
    setSkillGroup(idx) {
      if (g_gmain.is_fighting) return;
      $(".menu").hide();
      let lsgTimeOut = setTimeout(() => {
        UTIL.delSysListener("loadSkillGroup");
      }, 5000);
      UTIL.addSysListener("loadSkillGroup", (b, type, subtype, msg) => {
        if (type != "enable" && subtype !== "list") return;
        UTIL.delSysListener("loadSkillGroup");
        clearTimeout(lsgTimeOut);
        clickButton("prev");
      });
      clickButton("enable mapped_skills restore go " + idx);
    },
    //================================================================================================
    setWearEquip(idx) {
      if (g_gmain.is_fighting) return;
      $(".menu").hide();
      let equipKey = "equip_" + idx + "_keys";
      YFUI.showInput({
        title: "裝備組-" + idx,
        text: `格式：武器裝備詞組，以英文逗號分割多個關鍵詞，<br>
						<span style="color:#D60;">武器名前必須帶上*，入脈武器名前帶**。<br>
						卸下武器名前帶上#。</span><br>
                        <span style="color:red;">例如：</span><br>
                        [例1] <span style="color:blue;">#風泉之劍,*離別鉤,*傾宇破穹棍,**馭風騰雲,霸天聖袍,紫貪狼戒</span><br>
                        [例2] <span style="color:blue;">*風泉之劍,**雨葉魔槍,木棉袈裟,龍淵扳指,大士無雙帽,天璣九玄冠,博睿扳指,崆峒不老戒,楊柳怨羌笛,*妙韻梨花蕭</span><br>
                        `,
        value: PLU.getCache(equipKey) || "",
        type: "textarea",
        onOk(val) {
          let str = $.trim(val);
          if (!str) return;
          PLU.setCache(equipKey, str);
          PLU.wearEquip(str);
        },
        onNo() { },
      });
    },
    wearEquip(equipsStr) {
      PLU.getAllItems((list) => {
        let equips = equipsStr.split(","),
          equipCmds = "";
        let equipArr = equips.forEach((e) => {
          let eqObj = {};
          if (e.substr(0, 1) == "#") {
            eqObj = { type: -1, name: e.substr(1) };
          } else if (e.substr(0, 2) == "**") {
            eqObj = { type: 2, name: e.substr(2) };
          } else if (e.substr(0, 1) == "*") {
            eqObj = { type: 1, name: e.substr(1) };
          } else {
            eqObj = { type: 0, name: e };
          }
          let bagItem = list.find((it) => !!it.name.match(eqObj.name));
          if (bagItem) {
            if (eqObj.type == -1) equipCmds += "unwield " + bagItem.key + ";";
            else if (eqObj.type == 2) equipCmds += "wield " + bagItem.key + " rumai;";
            else if (eqObj.type == 1) equipCmds += "wield " + bagItem.key + ";";
            else equipCmds += "wear " + bagItem.key + ";";
          }
        });
        PLU.execActions(equipCmds, () => {
          YFUI.writeToOut("<span style='color:yellow;'> ==裝備完畢!== </span>");
          if (g_gmain.is_fighting) gSocketMsg.go_combat();
        });
      });
    },
    //================================================================================================
    showLog() {
      if ($("#myTools_InfoPanel").length > 0) return $("#myTools_InfoPanel").remove();
      let $logPanel = YFUI.showInfoPanel({
        text: "",
        onOpen() {
          $("#myTools_InfoPanel .infoPanel-wrap").html(PLU.logHtml);
          $("#myTools_InfoPanel .infoPanel-wrap").scrollTop($("#myTools_InfoPanel .infoPanel-wrap")[0].scrollHeight);
        },
        onNo() {
          PLU.logHtml = "";
          UTIL.logHistory = [];
          UTIL.setMem("HISTORY", JSON.stringify(this.logHistory));
          $("#myTools_InfoPanel .infoPanel-wrap").empty();
        },
        onClose() { },
      });
    },
    //================================================================================================
    updateShowLog(e) {
      let html = `<div style="${e.ext.style}">${UTIL.getNow(e.ext.time)} ${e.ext.msg}</div>`;
      PLU.logHtml += html;
      if ($("#myTools_InfoPanel").length < 1) return;
      $("#myTools_InfoPanel .infoPanel-wrap").append(html);
      $("#myTools_InfoPanel .infoPanel-wrap").scrollTop($("#myTools_InfoPanel .infoPanel-wrap")[0].scrollHeight);
    },
    //================================================================================================
    goHJS(where, npc) {
      let roomInfo = g_obj_map.get("msg_room");
      let curName = UTIL.filterMsg(roomInfo.get("short") || "");
      let act = "";
      if (curName == "青苔石階" && roomInfo.get("northwest") == "青苔石階") act = "nw";
      else if (curName == "青苔石階" && roomInfo.get("northeast") == "青苔石階") act = "ne";
      else if (curName == "青苔石階" && roomInfo.get("southwest") == "青苔石階") act = "sw";
      else if (curName == "榆葉林" && roomInfo.get("north") == "榆葉林") act = "n";
      else if (curName == "榆葉林" && roomInfo.get("south") == "榆葉林") act = "s";
      else if (curName == "世外桃源" && where == "鏡星府") act = "nw";
      else if (curName == "世外桃源" && where == "榮威鏢局") act = "ne";
      else if (curName == "世外桃源" && where == "碧落城") act = "s";
      if (act)
        PLU.execActions(act, () => {
          let npcObj = roomInfo.get("npc1");
          if (npcObj) {
            var npcName = npcObj.split(",")[1];
          }
          if (npc && ((npcName && npcName != npc) || !npcObj))
            PLU.execActions("jh 2;n;n;e;s;luoyang317_op1;go_hjs go;se;se;ne;w;n;", () => {
              PLU.goHJS(where, npc);
            });
          else PLU.goHJS(where, npc);
        });
    },
    //================================================================================================
    goHaRi() {
      let roomInfo = g_obj_map.get("msg_room");
      let curName = UTIL.filterMsg(roomInfo.get("short") || "");
      let act = "";
      if (curName == "沙漠迷宮") {
        if (roomInfo.get("east") == "沙漠迷宮") act = "e";
        else if (roomInfo.get("north") == "沙漠迷宮") act = "n";
        else if (roomInfo.get("west") == "沙漠迷宮") act = "w";
        else if (roomInfo.get("south") == "沙漠迷宮") act = "s";
        if (act)
          PLU.execActions(act, () => {
            PLU.goHaRi();
          });
      } else if (curName == "荒漠") {
        PLU.execActions("n;n;nw;n;ne", () => {
          YFUI.writeToOut("<span style='color:#FFF;'>--到達--</span>");
        });
      } else {
        PLU.execActions("rank go 263;e;s;w;w;s;sw;sw;sw;sw;nw;nw;n;nw;ne;", () => {
          PLU.goHaRi();
        });
      }
    },
    //================================================================================================
    queryJHMenu($btn, jhname) {
      let npcList = PLU.YFD.mapsLib.Npc.filter((e) => e.jh == jhname);
      npcList.forEach((e) => {
        let str = [e.jh, e.loc, e.name].filter((s) => !!s).join("-");
        YFUI.writeToOut(
          "<span><a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.goNpcWay(\"" +
          str +
          '","' +
          e.way +
          "\")'>" +
          str +
          "</a> &nbsp;&nbsp;<a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.showNpcWay(\"" +
          str +
          '","' +
          e.way +
          "\")'>路徑詳情</a></span>",
        );
      });
      YFUI.writeToOut("<span>----------</span>");
    },
    //================================================================================================
    toQueryNpc() {
      YFUI.showInput({
        title: "查找NPC",
        text: _(
          "输入NPC名字，可模糊匹配，支持<a target='_blank' href='https://www.runoob.com/regexp/regexp-syntax.html'>正则表达式</a>，同時支持简体（不包括地址名）和繁体<br>" +
          "正则表达式之外语法例子：<br>" +
          "[例1] 開封@毒蛇<br>" +
          "[例2] 星宿海@百龍山@毒蛇",
          "輸入NPC名字，可模糊匹配，支持<a target='_blank' href='https://zh.wikipedia.org/wiki/正則表達式'>正則表達式</a>，同時支持簡體和繁體<br>" +
          "正則表達式之外語法例子：<br>" +
          "[例1] 開封@毒蛇<br>" +
          "[例2] 星宿海@百龍山@毒蛇",
        ),
        value: PLU.getCache("prevSearchStr") || "^.?(男|女)[孩童]",
        onOk(val) {
          if (!$.trim(val)) return;
          let str = $.trim(val);
          PLU.setCache("prevSearchStr", str);
          PLU.queryNpc(str + "道");
        },
        onNo() { },
      });
    },
    // 查询房间路径
    queryRoomPath() {
      if (UTIL.inHome()) return;
      let jh = PLU.YFD.cityId[g_obj_map?.get("msg_room")?.get("map_id")];
      if (jh) {
        let room = ansi_up.ansi_to_text(g_obj_map?.get("msg_room")?.get("short"));
        return PLU.queryNpc(jh + "@" + room + "@.*道", true)[0]?.way;
      }
    },
    // 链接两个路径终点
    linkPath(pathA, pathB) {
      if (!pathA) return pathB;
      let arrayA = pathA.split(";");
      let arrayB = pathB.split(";");
      let len = Math.min(arrayA.length, arrayB.length);
      for (var index = 0; index < len; index++) if (arrayA[index] != arrayB[index]) break;
      if (!index) return pathB;
      return arrayA
        .slice(index)
        .reverse()
        .map((e) => {
          let cmd = e.match(/^(#\d+ )?([ns]?[we]?)$/);
          if (cmd) {
            if (!cmd[1]) cmd[1] = "";
            if (cmd[2].indexOf("n") == 0) {
              var way = cmd[2].replace("n", "s");
            } else {
              var way = cmd[2].replace("s", "n");
            }
            if (way.indexOf("w") >= 0) {
              way = way.replace("w", "e");
            } else {
              way = way.replace("e", "w");
            }
            return cmd[1] + way;
          }
          // 迷宫反走
          cmd = e.match(/^(.+):(.+)\^(.+)$/);
          if (cmd) return cmd[1] + ":" + cmd[3] + "^" + cmd[2];
          return e;
        })
        .concat(arrayB.slice(index))
        .join(";");
    },
    // 最短路径
    minPath(pathA, pathB) {
      let linkPath = PLU.linkPath(pathA, pathB);
      if (linkPath == "" || linkPath == pathB) return linkPath;
      let a = linkPath.split(";");
      let len = a.length;
      for (var index = 0; index < len; index++) {
        let cmd = a[index].match(/^(.+):(.+\^.+)$/);
        if (cmd) a[index] = PLU.YFD.mapsLib.Labyrinth[cmd[1]][cmd[2]];
      }
      a = a.join(";").split(";");
      let b = pathB.split(";");
      len = b.length;
      for (var index = 0; index < len; index++) {
        let cmd = b[index].match(/^(.+):(.+\^.+)$/);
        if (cmd) b[index] = PLU.YFD.mapsLib.Labyrinth[cmd[1]][cmd[2]];
      }
      b = b.join(";").split(";");
      return a.length <= b.length ? linkPath : pathB;
    },
    //================================================================================================
    formatNpcData(text) {
      let npc = text.match(/^(.*)@(.*)@(.*)道$/);
      if (npc) {
        var jh = npc[1];
        var loc = npc[2];
        var name = "^" + npc[3] + "$";
      } else {
        npc = text.match(/^([^*-]*)[@*-](.*)道$/);
        if (npc) {
          if (npc[1] == "茶聖" || npc[1] == "青衣劍士") {
            var name = "^" + npc[1] + "-" + npc[2] + "$";
          } else {
            var jh = npc[1];
            var name = "^" + npc[2] + "$";
          }
        } else {
          npc = text.match(/^(.*)道$/);
          if (npc) {
            var name = npc[1];
          } else {
            var name = text;
          }
        }
      }
      return [jh, loc, name];
    },
    queryNpc(name, quiet) {
      if (!name) return;
      let [jh, loc, tmpName] = PLU.formatNpcData(name);
      name = tmpName;
      let npcLib = PLU.YFD.mapsLib.Npc;
      let findList = npcLib.filter((e) => {
        if (e.jh == jh && e.loc == loc && (e.name.match(name) || (e.name_tw && e.name_tw.match(name)) || (e.name_new && e.name_new.match(name)))) return true;
        return false;
      });
      if (findList.length == 0)
        findList = npcLib.filter((e) => {
          if ((e.jh == jh || !jh) && (e.name.match(name) || (e.name_tw && e.name_tw.match(name)) || (e.name_new && e.name_new.match(name)))) return true;
          return false;
        });
      if (findList.length == 0)
        findList = npcLib.filter((e) => {
          if (e.name.match(name) || (e.name_tw && e.name_tw.match(name)) || (e.name_new && e.name_new.match(name))) return true;
          return false;
        });
      let res = [];
      if (findList && findList.length > 0) {
        findList.forEach((e) => {
          let str = [e.jh, e.loc, _(e.name, e.name_tw)].filter((s) => !!s).join("-");
          if (!quiet)
            YFUI.writeToOut(
              "<span><a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.goNpcWay(\"" +
              str +
              '","' +
              e.way +
              "\")'>" +
              str +
              "</a> &nbsp;&nbsp;<a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.showNpcWay(\"" +
              str +
              '","' +
              e.way +
              "\")'>路徑詳情</a></span>",
            );
          res.push(e);
        });
        if (!quiet) YFUI.writeToOut("<span>----------</span>");
      } else if (!quiet) {
        YFUI.writeToOut("<span style='color:#F66;'>查詢不到相關數據</span>");
      }
      return res;
    },
    //================================================================================================
    toPathNpc() {
      let defaultMapId = PLU.getCache("pathFindMap") || "1";
      let citys = PLU.YFD.cityList
        .map((c, i) => {
          let issel = i + 1 == defaultMapId ? "selected" : "";
          return '<option value="' + (i + 1) + '" ' + issel + ">" + c + "</option>";
        })
        .join("");
      YFUI.showPop({
        title: "全圖找NPC",
        text: `選擇地圖, 輸入NPC名字，可模糊匹配<br>
				<div style='margin:10px 0;'>
					<span>地圖: </span>
					<select id="pathFindMap" style="font-size:15px;height:32px;width:81%;border:1px solid #444;">
						${citys}
					</select>
				</div>
				<div style='margin:10px 0;'>
					<span>名字: </span>
					<input id="pathFindNpc" value="${PLU.getCache("pathFindNpc") || "小龍人"}" style="font-size:14px;height:26px;width:80%;border:1px solid #444;"></input>
				</div>`,
        onOk() {
          let mapStr = $.trim($("#pathFindMap").val()),
            npcStr = $.trim($("#pathFindNpc").val());
          if (!npcStr) return;
          PLU.setCache("pathFindMap", mapStr);
          PLU.setCache("pathFindNpc", npcStr);
          let jhMap = PLU.YFD.mapsLib.Map[parseInt(mapStr) - 1];
          if (!jhMap) {
            return YFUI.writeToOut("<span style='color:#F66;'>---無地圖數據---</span>");
          } else {
            let ways = jhMap.way.split(";");
            console.log({ paths: ways, idx: 0, objectNPC: npcStr });
            PLU.goPathFindNpc({ paths: ways, idx: 0, objectNPC: npcStr });
          }
        },
        onNo() { },
      });
    },
    goPathFindNpc(params) {
      //goFindYouxia
      if (params.idx >= params.paths.length) {
        setTimeout(() => {
          PLU.execActions("home");
        }, 100);
        YFUI.writeToOut("<span style='color:#FFF;'>--找不到目標NPC!...已搜索完地圖--</span>");
        return;
      }
      let acs = [params.paths[params.idx]];
      PLU.actions({
        paths: acs,
        idx: 0,
        onPathsEnd() {
          setTimeout(() => {
            let npcObj = UTIL.findRoomNpcReg(params.objectNPC);
            if (npcObj) {
              YFUI.writeToOut("<span style='color:#FFF;'>--目標NPC已找到--</span>");
            } else {
              params.idx++;
              PLU.goPathFindNpc(params);
            }
          }, 100);
        },
        onPathsFail() {
          setTimeout(() => {
            PLU.execActions("home");
          }, 500);
          YFUI.writeToOut("<span style='color:#FFF;'>--找不到目標NPC!...路徑中斷--</span>");
          return;
        },
      });
    },
    AutoPuzzle() {
      PLU.TMP.puzzleList = {};
      PLU.TMP.puzzleWating = {};
      return {
        //puzzleWating: {},
        analyzePuzzle: function (puzzle) {
          var puzzleid = "";
          var publisherName = "";
          var targetName = "";
          var publisherResult = /<a[^>]*find_task_road2 [^>]*>((?!<a[^>]*>).)+<\/a>/.exec(puzzle);
          if (publisherResult && publisherResult.length > 0) {
            publisherName = publisherResult[0].replace(/<\/?a[^>]*>/g, "");
            if (publisherName.indexOf("-") > -1) {
              publisherName = publisherName.split("-")[1];
            }
            publisherName = publisherName.replace(/\x1B/g, "").replace(/^<\/span>/, "");
            var result1 = /find_task_road2 [^>^']*/.exec(publisherResult[0]);
            puzzleid = result1[0].replace(/find_task_road2 /g, "");
          }
          var targetResult = puzzle.match(/<a[^>]*find_task_road [^>]*>((?!<a[^>]*>).)+<\/a>/g);
          if (targetResult && targetResult.length > 0) {
            var targetInfoIndex = 0;
            if (/搶走了，去替我要回來吧！/.test(puzzle)) {
              targetInfoIndex = targetResult.length - 1;
            }
            targetName = targetResult[targetInfoIndex].replace(/<\/?a[^>]*>/g, "");
            if (targetName.indexOf("-") > -1) {
              targetName = targetName.split("-")[1];
            }
            targetName = targetName.replace(/\x1B/g, "").replace(/^<\/span>/, "");
            if (!puzzleid) {
              var result1 = /find_task_road [^>^']*/.exec(targetResult[targetInfoIndex]);
              puzzleid = result1[0].replace(/find_task_road /g, "");
            }
          }
          if (!puzzleid) {
            return "";
          }
          if (puzzleid in PLU.TMP.puzzleList) {
            $.extend(PLU.TMP.puzzleList[puzzleid], {
              puzzle: puzzle,
              publisherName: publisherName,
              targetName: targetName,
            });
          } else {
            PLU.TMP.puzzleList[puzzleid] = {
              puzzle: puzzle,
              publisherName: publisherName,
              targetName: targetName,
              firstPublisherName: publisherName,
              firstStep: puzzle.replace(/<[^>]*>/g, ""),
              publisherMap: g_obj_map.get("msg_room").get("map_id"),
              publisherRoom: g_obj_map.get("msg_room").get("short"),
            };
          }
          return puzzleid;
        },
        startpuzzle: function (puzzleid) {
          if (!PLU.TMP.puzzleList[puzzleid]) return;
          var puzzle = PLU.TMP.puzzleList[puzzleid].puzzle;
          if (/看上去好生奇怪，/.test(puzzle) || /鬼鬼祟祟的叫人生疑，/.test(puzzle)) {
            PLU.TMP.puzzleWating = {
              puzzleid: puzzleid,
              action: "npc_datan",
              actionCode: "npc_datan",
              target: PLU.TMP.puzzleList[puzzleid].targetName,
              status: "start",
            };
          } else if (
            /你一番打探，果然找到了一些線索，回去告訴/.test(puzzle) ||
            /你一番搜索，果然找到了，回去告訴/.test(puzzle) ||
            /好，我知道了。你回去轉告/.test(puzzle) ||
            /老老實實將東西交了出來，現在可以回去找/.test(puzzle) ||
            /好，好，好，我知錯了……你回去轉告/.test(puzzle) ||
            /腳一蹬，死了。現在可以回去找/.test(puzzle)
          ) {
            PLU.TMP.puzzleWating = {
              puzzleid: puzzleid,
              action: "answer",
              actionCode: "ask",
              target: PLU.TMP.puzzleList[puzzleid].publisherName,
              status: "start",
            };
          } else if (/我想找/.test(puzzle) || /我有個事情想找/.test(puzzle)) {
            PLU.TMP.puzzleWating = {
              puzzleid: puzzleid,
              action: "ask",
              actionCode: "ask",
              target: PLU.TMP.puzzleList[puzzleid].targetName,
              status: "start",
            };
          } else if (
            /我十分討厭那/.test(puzzle) ||
            /好大膽，竟敢拿走了我的/.test(puzzle) ||
            /竟敢得罪我/.test(puzzle) ||
            /搶走了，去替我要回來吧！/.test(puzzle) ||
            /十分囂張，去讓[他她]見識見識厲害！/.test(puzzle)
          ) {
            PLU.TMP.puzzleWating = {
              puzzleid: puzzleid,
              action: "fight",
              actionCode: "fight",
              target: PLU.TMP.puzzleList[puzzleid].targetName,
              status: "start",
            };
          } else if (
            /上次我不小心，竟然吃了/.test(puzzle) ||
            /竟對我橫眉瞪眼的，真想殺掉[他她]！/.test(puzzle) ||
            /昨天撿到了我幾十輛銀子，拒不歸還。錢是小事，但人品可不好。/.test(puzzle)
          ) {
            PLU.TMP.puzzleWating = {
              puzzleid: puzzleid,
              action: "kill",
              actionCode: "kill",
              target: PLU.TMP.puzzleList[puzzleid].targetName,
              status: "start",
            };
          } else if (/銀子/.test(puzzle)) {
            PLU.execActions("auto_tasks cancel");
            PLU.TMP.puzzleWating = {};
            return;
          } else if (/突然想要一/.test(puzzle) || /唉，好想要一/.test(puzzle)) {
            PLU.TMP.puzzleWating = {
              puzzleid: puzzleid,
              action: "get",
              actionCode: "get",
              target: PLU.TMP.puzzleList[puzzleid].targetName,
              status: "start",
            };
          } else if (/可前去尋找/.test(puzzle)) {
            PLU.TMP.puzzleWating = {
              puzzleid: puzzleid,
              action: "room_sousuo",
              actionCode: "room_sousuo",
              target: "",
              status: "start",
            };
          }
          this.gotoPuzzle(puzzleid);
        },
        gotoPuzzle: function (puzzleid) {
          if (puzzleid != PLU.TMP.puzzleWating.puzzleid) return;
          var that = this;
          switch (PLU.TMP.puzzleWating.action) {
            case "npc_datan":
            case "fight":
            case "kill":
            case "ask":
            case "room_sousuo":
              PLU.TMP.puzzleWating.status = "trace";
              PLU.execActions("find_task_road " + puzzleid);
              break;
            case "get":
              if (
                g_obj_map.get("msg_room").get("map_id") == PLU.TMP.puzzleList[puzzleid].publisherMap &&
                g_obj_map.get("msg_room").get("short") == PLU.TMP.puzzleList[puzzleid].publisherRoom
              ) {
                var npc = g_obj_map.get("msg_room").elements.filter(function (item) {
                  return item.key.indexOf("npc") == 0 && that.ansiToHtml(item.value.split(",")[1]) == PLU.TMP.puzzleList[puzzleid].publisherName;
                });
                if (npc.length > 0) {
                  PLU.TMP.puzzleWating.waitTimer = setTimeout(function () {
                    PLU.TMP.puzzleWating.status = "trace";
                    PLU.execActions("find_task_road " + puzzleid);
                  }, 2000);
                  PLU.TMP.puzzleWating.status = "give";
                  var npcArr = {};
                  for (var i = 0; i < npc.length; i++) {
                    var npcinfo = npc[i].value.split(",");
                    npcArr[npcinfo[0]] = npc[i];
                  }
                  PLU.TMP.puzzleWating.waitCount = 0;
                  for (var npcid in npcArr) {
                    PLU.execActions("give " + npc[0].value.split(",")[0]);
                    PLU.TMP.puzzleWating.waitCount++;
                  }
                  return;
                }
              }
              PLU.TMP.puzzleWating.status = "trace";
              PLU.execActions("find_task_road " + puzzleid);
              break;
            case "answer":
              PLU.TMP.puzzleWating.status = "trace";
              PLU.execActions("find_task_road2 " + puzzleid);
              break;
          }
        },
        doPuzzle: function (puzzleid) {
          if (puzzleid != PLU.TMP.puzzleWating.puzzleid) return;
          var that = this;
          switch (PLU.TMP.puzzleWating.action) {
            case "npc_datan":
            case "answer":
            case "ask":
            case "fight":
            case "kill":
              PLU.TMP.puzzleWating.status = "wait";
              var npcs = g_obj_map.get("msg_room").elements.filter(function (item) {
                return (
                  item.key.indexOf("npc") == 0 &&
                  (that.ansiToHtml(item.value.split(",")[1]) == PLU.TMP.puzzleWating.target ||
                    (PLU.TMP.puzzleWating.target == "惡人" && item.value.split(",")[0].indexOf("eren") == 0) ||
                    (PLU.TMP.puzzleWating.target == "捕快" && item.value.split(",")[0].indexOf("bukuai") == 0) ||
                    (["柳繪心", "王鐵匠", "楊掌櫃", "客商", "柳小花", "賣花姑娘", "劉守財", "方老闆", "朱老伯", "方寡婦"].indexOf(PLU.TMP.puzzleWating.target) > -1 &&
                      item.value.split(",")[0].indexOf("bad_target_") == 0))
                );
              });
              if (npcs.length > 0) {
                var distinctNpcs = {};
                for (var i = 0; i < npcs.length; i++) {
                  distinctNpcs[npcs[i].value.split(",")[0]] = 1;
                }
                if (PLU.TMP.puzzleWating.action == "fight") {
                  for (var npcid in distinctNpcs) {
                    PLU.autoFight({
                      targetKey: npcid,
                      fightKind: "fight",
                      autoSkill: "multi",
                      onFail() {
                        PLU.autoFight({
                          targetKey: npcid,
                          fightKind: "kill",
                          autoSkill: "multi",
                        });
                      },
                    });
                  }
                } else {
                  for (var npcid in distinctNpcs) {
                    PLU.execActions(PLU.TMP.puzzleWating.actionCode + " " + npcid);
                  }
                }
              }
              break;
            case "get":
              if (PLU.TMP.puzzleWating.status == "traced") {
                PLU.TMP.puzzleWating.status = "wait";
                var objs = g_obj_map.get("msg_room").elements.filter(function (item) {
                  return item.key.indexOf("item") == 0 && that.ansiToHtml(item.value.split(",")[1]) == PLU.TMP.puzzleWating.target;
                });
                if (objs.length > 0) {
                  for (var index in objs) {
                    PLU.execActions("get " + objs[index].value.split(",")[0]);
                  }
                } else {
                  var npcs = g_obj_map.get("msg_room").elements.filter(function (item) {
                    return (
                      item.key.indexOf("npc") == 0 && !isNaN(item.key.replace("npc", "")) && item.value.indexOf("金甲符兵") == -1 && item.value.indexOf("玄陰符兵") == -1
                    );
                  });
                  that.lookNpcForBuy(
                    npcs,
                    function () {
                      PLU.TMP.puzzleWating.status = "return";
                      PLU.execActions("find_task_road2 " + puzzleid);
                    },
                    function () {
                      npcs = g_obj_map.get("msg_room").elements.filter(function (item) {
                        return (
                          item.key.indexOf("npc") == 0 &&
                          !isNaN(item.key.replace("npc", "")) &&
                          item.value.indexOf("金甲符兵") == -1 &&
                          item.value.indexOf("玄陰符兵") == -1
                        );
                      });
                      that.lookNpcForKillGet(npcs);
                    },
                  );
                }
              } else {
                if (PLU.TMP.puzzleWating.status == "returned") {
                  var npcs = g_obj_map.get("msg_room").elements.filter(function (item) {
                    return item.key.indexOf("npc") == 0 && that.ansiToHtml(item.value.split(",")[1]) == PLU.TMP.puzzleWating.target;
                  });
                  if (npcs.length > 0) {
                    for (var index in npcs) {
                      if (npcs[index].value) PLU.execActions("give " + npcs[index].value.split(",")[0]);
                    }
                  }
                }
              }
              break;
            case "room_sousuo":
              PLU.execActions("room_sousuo");
              break;
          }
        },
        lookNpcForBuy: function (npcs, foundcallback, notfoundcallback) {
          if (PLU.TMP.puzzleWating.actionCode != "get") return;
          if (npcs.length > 0) {
            var that = this;
            var npc = npcs.shift();
            var npcid = npc.value.split(",")[0];
            PLU.execActions("look_npc " + npcid);
            setTimeout(function () {
              that.getNpcInfoForBuy(npcid, npcs, foundcallback, notfoundcallback);
            }, 200);
          } else {
            notfoundcallback && notfoundcallback();
          }
        },
        getNpcInfoForBuy: function (npcid, othernpcs, foundcallback, notfoundcallback) {
          if (PLU.TMP.puzzleWating.actionCode != "get") return;
          var that = this;
          if (!g_obj_map.get("msg_npc") || g_obj_map.get("msg_npc").get("id") != npcid) {
            setTimeout(function () {
              that.getNpcInfoForBuy(npcid, othernpcs, foundcallback, notfoundcallback);
            }, 200);
            return;
          }
          var cmds = g_obj_map.get("msg_npc").elements.filter(function (item) {
            return item.value == "購買";
          });
          if (cmds.length > 0) {
            PLU.execActions("buy " + npcid);
            setTimeout(function () {
              that.getNpcBuyInfo(npcid, othernpcs, foundcallback, notfoundcallback);
            }, 200);
          } else {
            if (othernpcs.length > 0) {
              var npc = othernpcs.shift();
              var npcid = npc.value.split(",")[0];
              PLU.execActions("look_npc " + npcid);
              setTimeout(function () {
                that.getNpcInfoForBuy(npcid, othernpcs, foundcallback, notfoundcallback);
              }, 200);
            } else {
              notfoundcallback && notfoundcallback();
            }
          }
        },
        getNpcBuyInfo: function (npcid, othernpcs, foundcallback, notfoundcallback) {
          if (PLU.TMP.puzzleWating.actionCode != "get") return;
          var that = this;
          if (!g_obj_map.get("msg_buys") || g_obj_map.get("msg_buys").get("npcid") != npcid) {
            setTimeout(function () {
              that.getNpcBuyInfo(npcid, othernpcs, foundcallback, notfoundcallback);
            }, 200);
            return;
          }
          var buyitems = g_obj_map.get("msg_buys").elements.filter(function (item) {
            return item.key.indexOf("item") == 0 && that.ansiToHtml(item.value.split(",")[1]) == PLU.TMP.puzzleWating.target;
          });
          if (buyitems.length > 0) {
            for (var i = 0; i < buyitems.length; i++) {
              PLU.execActions("buy " + buyitems[i].value.split(",")[0] + " from " + npcid);
            }
            foundcallback && foundcallback();
          } else {
            if (othernpcs.length > 0) {
              var npc = othernpcs.shift();
              var npcid = npc.value.split(",")[0];
              PLU.execActions("look_npc " + npcid);
              setTimeout(function () {
                that.getNpcInfoForBuy(npcid, othernpcs, foundcallback, notfoundcallback);
              }, 200);
            } else {
              notfoundcallback && notfoundcallback();
            }
          }
        },
        lookNpcForKillGet: function (npcs, foundcallback, notfoundcallback) {
          if (PLU.TMP.puzzleWating.actionCode != "get") return;
          if (npcs.length > 0) {
            var that = this;
            var npc = npcs.shift();
            var npcid = npc.value.split(",")[0];
            PLU.execActions("look_npc " + npcid);
            setTimeout(function () {
              that.getNpcInfoForKillGet(npcid, npcs, foundcallback, notfoundcallback);
            }, 200);
          } else {
            notfoundcallback && notfoundcallback();
          }
        },
        getNpcInfoForKillGet: function (npcid, othernpcs, foundcallback, notfoundcallback) {
          if (PLU.TMP.puzzleWating.actionCode != "get") return;
          var that = this;
          if (!g_obj_map.get("msg_npc") || g_obj_map.get("msg_npc").get("id") != npcid) {
            setTimeout(function () {
              that.getNpcInfoForKillGet(npcid, othernpcs, foundcallback, notfoundcallback);
            }, 200);
            return;
          }
          var cmds = g_obj_map.get("msg_npc").elements.filter((item) => {
            return item.value == "殺死";
          });
          if (cmds.length > 0 && g_obj_map.get("msg_npc").get("long").indexOf(PLU.TMP.puzzleWating.target) > -1) {
            PLU.TMP.puzzleWating.waitTarget = npcid;
            PLU.execActions("kill " + npcid);
            foundcallback && foundcallback();
          } else {
            if (othernpcs.length > 0) {
              var npc = othernpcs.shift();
              var npcid = npc.value.split(",")[0];
              PLU.execActions("look_npc " + npcid);
              setTimeout(function () {
                that.getNpcInfoForKillGet(npcid, othernpcs, foundcallback, notfoundcallback);
              }, 200);
            } else {
              notfoundcallback && notfoundcallback();
            }
          }
        },
        puzzlekillget: function () {
          var npcname = prompt("請輸入要殺的npc名稱", "");
          if (npcname) {
            PLU.TMP.puzzleWating.actionCode = "killget";
            PLU.TMP.puzzleWating.waitTargetName = npcname;
          }
        },
        ansiToHtml: function (str) {
          return ansi_up.ansi_to_html(str).replace(/\x1B/g, "");
        },
        puzzlesubmit: function (puzzleid) {
          let mapname = PLU.YFD.cityId[PLU.TMP.puzzleList[puzzleid].publisherMap] ?? PLU.TMP.puzzleList[puzzleid].publisherMap;
          let value =
            mapname + "@" + ansi_up.ansi_to_html(PLU.TMP.puzzleList[puzzleid].publisherRoom).replace(/<[^>]*>/g, "") + "@" + PLU.TMP.puzzleList[puzzleid].firstStep;
          if (!PLU.getCache("listenPuzzle")) unsafeWindow.clickButton("chat " + value);
        },
      };
    },

    //================================================================================================
    toQueryMiTi() {
      let defaultMapId = PLU.getCache("pathFindMiTi") || "1";
      let citys = PLU.YFD.cityList
        .map((c, i) => {
          let issel = i + 1 == defaultMapId ? "selected" : "";
          return '<option value="' + (i + 1) + '" ' + issel + ">" + c + "</option>";
        })
        .join("");
      YFUI.showPop({
        title: "全圖找謎題",
        text: `選擇地圖, 輸入關鍵詞（人物，地點，物品）列表（英文逗號隔開）<br>可模糊匹配<br>
            <div style='margin:10px 0;'>
              <span>去哪找: </span>
              <select id="pathFindMap" style="font-size:15px;height:32px;width:81%;border:1px solid #444;">
                ${citys}
              </select>
            </div>
            <div style='margin:10px 0;'>
              <span>要找啥: </span>
              <input id="pathFindKeyword" value="${PLU.getCache("pathFindKeyword") || "柴紹,李秀寧,大鸛淜洲,天羅紫芳衣"
          }" style="font-size:14px;height:26px;width:80%;border:1px solid #444;"></input>
            </div>`,
        onOk() {
          let mapStr = $.trim($("#pathFindMap").val()),
            KeywordStr = $.trim($("#pathFindKeyword").val());
          if (!KeywordStr) return;
          PLU.setCache("pathFindMap", mapStr);
          PLU.setCache("pathFindKeyword", KeywordStr);
          let jhMap = PLU.YFD.mapsLib.Map[parseInt(mapStr) - 1];
          if (!jhMap) {
            return YFUI.writeToOut("<span style='color:#F66;'>---無地圖數據---</span>");
          } else {
            let ways = jhMap.way.split(";");
            console.log({ paths: ways, idx: 0, objectKeyword: KeywordStr });
            PLU.MiTiArray = [];
            PLU.goPathFindMiTi({
              paths: ways,
              idx: 0,
              objectKeyword: KeywordStr,
            });
          }
        },
        onNo() { },
      });
    },
    goPathFindMiTi(params) {
      //goFindYouxia
      if (params.idx >= params.paths.length) {
        setTimeout(() => {
          PLU.execActions("home");
        }, 100);
        YFUI.writeToOut("<span style='color:#FFF;'>--找不到目標謎題!...已搜索完地圖--</span>");
        return;
      }
      let acs = [params.paths[params.idx]];
      PLU.actions({
        paths: acs,
        idx: 0,
        onPathsEnd() {
          let npcArray = UTIL.getRoomAllNpc();
          UTIL.addSysListener("MiTi", (b, type, subtype, msg) => {
            if (type != "main_msg") return;
            if (msg.match(params.objectKeyword)) PLU.MiTiArray.push(msg);
          });
          for (var npc of npcArray) {
            PLU.execActions("auto_tasks cancel;ask " + npc.key);
          }
          UTIL.delSysListener("MiTi");
          if (PLU.MiTiArray.length) {
            YFUI.writeToOut("<span style='color:#FFF;'>--目標謎題已找到--</span>");
            return;
          } else {
            setTimeout(() => {
              params.idx++;
              PLU.goPathFindMiTi(params);
            }, 500);
          }
        },
        onPathsFail() {
          setTimeout(() => {
            PLU.execActions("home");
          }, 500);
          YFUI.writeToOut("<span style='color:#FFF;'>--路徑中斷--</span>");
          return;
        },
      });
    },
    //================================================================================================
    goNpcWay(desc, way) {
      let goList = PLU.getCache("prevQueryList") || [];
      let newList = goList.filter((e) => e.desc != desc);
      let len = newList.unshift({ desc: desc, way: way });
      if (len > 10) newList.length = 10;
      PLU.setCache("prevQueryList", newList);
      PLU.execActions(way);
    },

    //================================================================================================
    //================================================================================================
    showNpcWay(desc, way) {
      let text = "<span style='color:blue;background:rgba(255,255,244,0.8);padding:1px 10px;display:inline-block;word-break:break-all;'>" + way + "</span></br>";
      let way2 = PLU.linkPath(PLU.queryRoomPath(), way);
      let way3 = PLU.minPath(PLU.queryRoomPath(), way);
      if (way != way2) {
        text +=
          "<span style='color:blue;background:rgba(255,255,244,0.8);padding:1px 10px;display:inline-block;word-break:break-all;'>同图路径（？）：" +
          way2 +
          "</span></br>";
        text +=
          "<span style='color:blue;background:rgba(255,255,244,0.8);padding:1px 10px;display:inline-block;word-break:break-all;'>最短路径（？）：" +
          way3 +
          "</span></br>";
      }
      YFUI.showPop({
        title: "路徑詳情：" + desc,
        text: text,
        autoOk: 10,
        okText: "關閉",
        noText: "前往",
        onOk() { },
        onNo() {
          PLU.goNpcWay(desc, way);
        },
      });
    },
    //================================================================================================
    toQueryHistory() {
      let prevList = PLU.getCache("prevQueryList") || [];
      if (prevList.length == 0) return YFUI.writeToOut("<span style='color:#F66;'>---無歷史數據---</span>");
      for (let i = prevList.length - 1; i >= 0; i--) {
        let e = prevList[i];
        YFUI.writeToOut(
          "<span><a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.goNpcWay(\"" +
          e.desc +
          '","' +
          e.way +
          "\")'>" +
          e.desc +
          "</a> &nbsp;&nbsp;<a style='text-decoration:underline;color:yellow;cursor:pointer;' onclick='PLU.showNpcWay(\"" +
          e.desc +
          '","' +
          e.way +
          "\")'>路徑詳情</a></span>",
        );
      }
      YFUI.writeToOut("<span>----------</span>");
    },
    //================================================================================================
    showMPFZ($btn) {
      let btnFlag = PLU.setBtnRed($btn);
      if (!btnFlag) {
        $("#topMonitor").hide();
        $("#btn_bt_showMPFZ").text(_("纷争显示", "紛爭顯示"));
        PLU.setCache("showTopMonitor", 0);
        return;
      }
      $("#topMonitor").show();
      $("#btn_bt_showMPFZ").text(_("纷争隐藏", "紛爭隱藏"));
      PLU.setCache("showTopMonitor", 1);
    },
    //================================================================================================
    openCombineGem() {
      let htm = "<div>";
      PLU.YFD.gemType.forEach((t, ti) => {
        htm += "<div>";
        PLU.YFD.gemPrefix.forEach((p, pi) => {
          if (pi > 2)
            htm +=
              '<button onclick="PLU.combineGem(' +
              ti +
              "," +
              pi +
              ')" style="color:' +
              t.color +
              ';width:18%;margin:2px 1%;padding:3px;">' +
              (p.substr(0, 2) + t.name.substr(0, 1)) +
              "</button>";
        });
        htm += "</div>";
      });
      htm += "</div>";
      htm += `<div style="margin:10px 0 0 3px;position:absolute;left:15px;bottom:10px;">每次連續合成最多 <input id="maxCombine" type="number" value="1" style="width:50px;height:25px;line-height:25px;" maxlength="3" min=1 max=9999 oninput="if(value.length>4)value=value.substr(0,4)"/> 顆寶石。</div>`;
      YFUI.showPop({
        title: "合成寶石",
        text: htm,
        width: "382px",
        okText: "關閉",
        onOk() { },
      });
    },
    //================================================================================================
    combineGem(type, grade) {
      if (PLU.TMP.combineTooFast) return YFUI.writeToOut("<span style='color:#F66;'>--點擊不要太快!--</span>");
      PLU.TMP.combineTooFast = setTimeout(() => {
        PLU.TMP.combineTooFast = null;
      }, 600000);
      let targetNum = parseInt($("#maxCombine").val()) || 1;
      let getNum = 0;
      let countString = (combineNum, gemCode) => {
        let combineStr = "";
        if (combineNum % 3 != 0) return "";
        combineStr += "items hecheng " + gemCode + "_N_" + Math.floor(combineNum / 3) + ";";
        return combineStr;
      };
      let needGem = (gemGrade, needNum, gemList) => {
        if (gemGrade < 0) return null;
        let gemName = PLU.YFD.gemPrefix[gemGrade] + PLU.YFD.gemType[type].name;
        let gemCode = PLU.YFD.gemType[type].key + "" + (gemGrade + 1);
        let objGem = gemList.find((e) => e.name == gemName);
        let gemNum = objGem?.num ?? 0;
        if (gemNum >= needNum) {
          return countString(needNum, gemCode);
        } else {
          let dtNum = needNum - gemNum;
          let next = needGem(gemGrade - 1, 3 * dtNum, gemList);
          if (next) return next + countString(needNum, gemCode);
          return null;
        }
      };
      let countCombine = function (cb) {
        PLU.getGemList((gemList) => {
          let runStr = needGem(grade - 1, 3, gemList);
          if (runStr) {
            PLU.fastExec(runStr + "items", () => {
              YFUI.writeToOut("<span style='color:white;'>==合成寶石x1==</span>");
              getNum++;
              targetNum--;
              if (targetNum > 0) {
                countCombine(() => {
                  cb && cb(true);
                });
              } else {
                cb && cb(true);
              }
            });
          } else {
            YFUI.writeToOut("<span style='color:#F66;'>--沒有足夠的寶石!--</span>");
            cb && cb(false);
          }
        });
      };
      countCombine((end) => {
        clearTimeout(PLU.TMP.combineTooFast);
        PLU.TMP.combineTooFast = null;
        YFUI.writeToOut("<span style='color:white;'>==合成寶石結束! 得到寶石x" + getNum + "==</span>");
      });
    },
    //================================================================================================
    getGemList(callback) {
      let getItemsTimeOut = setTimeout(() => {
        UTIL.delSysListener("getListItems");
      }, 5000);
      UTIL.addSysListener("getListItems", (b, type, subtype, msg) => {
        if (type != "items" || subtype != "list") return;
        UTIL.delSysListener("getListItems");
        clearTimeout(getItemsTimeOut);
        //clickButton("prev");
        let iId = 1,
          itemList = [];
        while (b.get("items" + iId)) {
          let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
          if (it && it.length > 4 && it[3] == "0" && it[1].match("寶石"))
            itemList.push({
              key: it[0],
              name: it[1],
              num: Number(it[2]),
            });
          iId++;
        }
        callback && callback(itemList);
      });
      clickButton("items", 0);
    },
    //================================================================================================
    getAllItems(callback) {
      let getItemsTimeOut = setTimeout(() => {
        UTIL.delSysListener("getListItems");
      }, 5000);
      UTIL.addSysListener("getListItems", (b, type, subtype, msg) => {
        if (type != "items" || subtype != "list") return;
        UTIL.delSysListener("getListItems");
        clearTimeout(getItemsTimeOut);
        clickButton("prev");
        let iId = 1,
          itemList = [];
        while (b.get("items" + iId)) {
          let it = UTIL.filterMsg(b.get("items" + iId)).split(",");
          if (it && it.length > 4)
            itemList.push({
              key: it[0],
              name: it[1],
              num: Number(it[2]),
              equipped: it[3] == "0",
            });
          iId++;
        }
        callback && callback(itemList);
      });
      clickButton("items", 0);
    },
    //================================================================================================
    backupSetting() {
      let config = {};
      config.GM = GM_info;
      config.GM.scriptMetaStr = undefined;
      config.GM.script.header = undefined;
      config.PLU = {};
      config.PLU.CACHE = UTIL.getMem("CACHE");
      config.PLU.HISTORY = UTIL.getMem("HISTORY");
      config.PLU.STATUS = PLU.STATUS;
      config.PLU.TMP = PLU.TMP;
      const reader = new FileReader();
      reader.readAsDataURL(new Blob([JSON.stringify(config)], { type: "application/json" }));
      reader.onload = (e) => {
        let a = document.createElement("a");
        a.download = "無劍配置-" + PLU.accId + "-" + new Date().getTime() + ".json";
        a.style.display = "none";
        a.href = reader.result;
        a.click();
      };
    },
    //================================================================================================
    loadSetting() {
      let input = document.createElement("input");
      input.type = "file";
      input.id = "config";
      input.accept = "application/json";
      input.style.display = "none";
      input.onchange = () => {
        const reader = new FileReader();
        reader.readAsText(input.files[0]);
        reader.onload = (e) => {
          const config = JSON.parse(reader.result);
          UTIL.setMem("CACHE", config.PLU.CACHE);
          UTIL.setMem("HISTORY", config.PLU.HISTORY);
          PLU.initStorage();
          PLU.TMP = config.PLU.TMP;
          PLU.STATUS = config.PLU.STATUS;
          YFUI.writeToOut("<span style='color:yellow;'>==加載完成==</span>");
        };
      };
      input.click();
    },
  };
  //=================================================================================
  // UTIL模塊
  //=================================================================================
  window.UTIL = {
    //================
    accId: null,
    sysListeners: {},
    logHistory: [],
    //================
    getUrlParam(key) {
      let res = null,
        au = location.search.split("?"),
        sts = au[au.length - 1].split("&");
      sts.forEach((p) => {
        if (p.split("=").length > 1 && key == p.split("=")[0]) res = unescape(p.split("=")[1]);
      });
      return res;
    },
    getAccId() {
      this.accId = this.getUrlParam("id");
      return this.accId;
    },
    setMem(key, data) {
      localStorage.setItem("PLU_" + this.accId + "_" + key, data);
    },
    getMem(key) {
      return localStorage.getItem("PLU_" + this.accId + "_" + key);
    },
    rnd() {
      return Math.floor(Math.random() * 1000000);
    },
    getuuid: function () {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    getNow(timestamp) {
      var date = timestamp ? new Date(timestamp) : new Date();
      var Y = date.getFullYear();
      var M = (date.getMonth() + 1 + "").padStart(2, "0");
      var D = (date.getDate() + "").padStart(2, "0");
      var h = (date.getHours() + "").padStart(2, "0");
      var m = (date.getMinutes() + "").padStart(2, "0");
      var s = (date.getSeconds() + "").padStart(2, "0");
      return M + "-" + D + " " + h + ":" + m + ":" + s;
    },
    log({ msg, type, time, isHistory }) {
      let style = "color:#333";
      if (type == "TF") {
        let co = msg.match("夜魔") ? "#F0F" : "#666";
        style = "color:" + co;
      } else if (type == "QL") {
        style = "color:#00F";
      } else if (type == "MPFZ") {
        style = "color:#F60";
      } else if (type == "LPFZ") {
        style = "color:#033";
      } else if (type == "KFQL") {
        style = "color:#F00;background:#FF9;";
      } else if (type == "YX") {
        let co2 = msg.match("宗師】") ? "#00F" : msg.match("俠客】") ? "#08F" : msg.match("魔尊】") ? "#F00" : msg.match("邪武】") ? "#F80" : "#999";
        style = "color:" + co2 + ";background:#CFC;";
      } else if (type == "BF") {
        style = "color:#FFF;background:#93C;";
      } else if (type == "TIPS") {
        style = "color:#29F";
      }
      //console.log('%c%s',style,this.getNow(time)+msg)
      if (!isHistory) {
        this.logHistory.push({ msg, type, time });
        this.setMem("HISTORY", JSON.stringify(this.logHistory));
      }
      let evt = new Event("addLog");
      evt.ext = { msg, type, time, style };
      document.dispatchEvent(evt);
    },
    filterMsg(s) {
      if (typeof s == "string") return s.replace(/[\033|\27|\0x1b]\[[0-9|;]+m/gi, "");
      return "";
    },
    sysDispatchMsg(b, type, subtype, msg) {
      for (var key in this.sysListeners) {
        this.sysListeners[key](b, type, subtype, msg);
      }
    },
    addSysListener(key, fn) {
      this.sysListeners[key] = fn;
    },
    delSysListener(key) {
      delete this.sysListeners[key];
    },
    findRoomNpc(npcName, gb, searchAll) {
      console.debug(npcName);
      let roomInfo = g_obj_map.get("msg_room");
      if (!roomInfo) return null;
      for (let i = roomInfo.elements.length - 1; i >= 0; i--) {
        let bNpc = this.getSpNpcByIdx(roomInfo, i, searchAll);
        if (bNpc && bNpc.name == npcName) {
          if (!gb) return bNpc;
          else {
            let gNpc = this.getSpNpcByIdx(roomInfo, i - gb);
            if (gNpc) return gNpc;
          }
        }
      }
      return null;
    },
    roomHasNpc() {
      let roomInfo = g_obj_map.get("msg_room");
      let res = false;
      if (!roomInfo) return null;
      for (let i = roomInfo.elements.length - 1; i >= 0; i--) {
        if (roomInfo.elements[i].key.match("npc")) {
          res = true;
          break;
        }
      }
      return res;
    },
    getRoomAllNpc() {
      let roomInfo = g_obj_map.get("msg_room");
      let res = [];
      if (!roomInfo) return res;
      for (let i = roomInfo.elements.length - 1; i >= 0; i--) {
        let npc = roomInfo.elements[i].key.match(/npc(\d+)/);
        if (npc) {
          let infoArr = roomInfo.elements[i].value.split(",");
          let name = this.filterMsg(infoArr[1]);
          res.push({ name: name, key: infoArr[0] });
        }
      }
      return res;
    },
    findRoomNpcReg(npcName) {
      let roomInfo = g_obj_map.get("msg_room");
      if (!roomInfo) return null;
      for (let i = roomInfo.elements.length - 1; i >= 0; i--) {
        let npc = roomInfo.elements[i].key.match(/npc(\d+)/);
        if (npc) {
          let infoArr = roomInfo.elements[i].value.split(",");
          let name = this.filterMsg(infoArr[1]);
          if (name.match(npcName)) return { name: name, key: infoArr[0] };
        }
      }
      return null;
    },
    getSpNpcByIdx(roomInfo, idx, searchAll) {
      let npcInfo = roomInfo.get("npc" + idx);
      if (npcInfo) {
        let infoArr = npcInfo.split(",");
        let name = this.filterMsg(infoArr[1]);
        if (searchAll) return { name: name, key: infoArr[0] };
        if (name != infoArr[1]) return { name: name, key: infoArr[0] };
      }
      return null;
    },
    getItemFrom(name) {
      if (g_gmain.is_fighting) return;
      var item = g_obj_map.get("msg_room")?.elements.find((it) => it.key.substring(0, 4) == "item" && it.value.indexOf(name) >= 0);
      if (item) {
        clickButton("get " + item.value.split(",")[0]);
      }
    },
    inHome() {
      return gSocketMsg._is_in_home;
    },
  };
  //=================================================================================
  // UI模塊
  //=================================================================================
  window.YFUI = {
    init() {
      let maxW = $("#out").width() > 634 ? 634 : $("#out").width();
      console.log($("#page").width(), $("#out").width());
      let rightStyle = $("#page").width() - $("#out").width() > 4 ? "left:" + (maxW - 76 + 4) + "px;" : "right:0;";
      this.$Panel = $(
        '<div id="WJPlug_Panel" style="pointer-events:none;position:absolute;z-index:9999;' +
        rightStyle +
        ';top:5.5%;font-size:12px;line-height:1.2;text-align:right;list-style:none;">',
      );
      $("body").append(this.$Panel);
    },
    addBtnGroup({ id, style }) {
      let $box = $('<div id="' + id + '" style="position:relative;"></div>');
      style && $box.css(style);
      this.$Panel.append($box);
      return $box;
    },
    addBtn({ id, groupId, text, onclick, style, boxStyle, extend, children, canSet }) {
      let $box = $('<div id="' + id + '" class="btn-box" style="position:relative;pointer-events:auto;"></div>');
      let $btn = $(
        '<button id="btn_' +
        id +
        '" style="padding:4px 2px;box-sizing:content-box;margin:1px 1px;border:1px solid #333;border-radius:4px;width:68px;">' +
        text +
        "</button>",
      );
      style && $btn.css(style);
      boxStyle && $box.css(boxStyle);
      $btn.$extend = extend;
      $btn.click((e) => {
        onclick && onclick($btn, $box);
      });
      $box.append($btn);
      if (children) $box.append($('<b style="position:absolute;left:1px;top:3px;font-size:12px;">≡</b>'));
      if (canSet) {
        let $setbtn = $(
          '<i style="position:absolute;right:-8px;top:2px;font-size:14px;background:#333;color:#fff;font-style:normal;;line-height:1;border:1px solid #CCC;border-radius:100%;padding:2px 6px;cursor:pointer;">S</i>',
        );
        $box.append($setbtn);
        $setbtn.click((e) => {
          onclick && onclick($btn, $box, "setting");
        });
      }
      groupId ? $("#" + groupId).append($box) : this.$Panel.append($box);
      $box.$button = $btn;
      return $box;
    },
    addMenu({ id, groupId, text, extend, style, menuStyle, multiCol, onclick, children }) {
      //{text,id,btnId}
      let $btnBox = this.addBtn({ id, groupId, text, extend, style, children }),
        _this = this;
      function addMenuToBtn({ btnId, $parent, list, menuStyle }) {
        let $listBox = $('<div id="menu_' + btnId + '" class="menu" style="position:absolute;top:0;right:' + $parent.width() + 'px;display:none;"></div>');
        $parent.append($listBox);
        list &&
          list.forEach((sub) => {
            let btnOpt = Object.assign({}, sub, { groupId: "menu_" + btnId });
            if (!btnOpt.onclick) {
              btnOpt.onclick = onclick;
            }
            if (multiCol) btnOpt.boxStyle = Object.assign({}, { display: "inline-block" }, btnOpt.boxStyle);
            let $subBtnBox = _this.addBtn(btnOpt);
            if (sub.children)
              $subBtnBox.$list = addMenuToBtn({
                btnId: sub.id,
                $parent: $subBtnBox,
                list: sub.children,
                menuStyle: sub.menuStyle,
              });
          });
        $parent.$button.click((e) => {
          $listBox.toggle().css({ right: $parent.width() + 5 });
          menuStyle && $listBox.css(menuStyle);
          $listBox.is(":visible") && $listBox.parent().siblings(".btn-box").find(".menu").hide();
          onclick && onclick($parent.$button, $parent);
        });
        return $listBox;
      }
      $btnBox.$list = addMenuToBtn({
        btnId: id,
        $parent: $btnBox,
        list: children,
        menuStyle: menuStyle,
      });
      return $btnBox;
    },
    showPop(params) {
      if ($("#myTools_popup").length) $("#myTools_popup").remove();
      params = params || {};
      let okText = params.okText || _("确定", "確定"),
        noText = params.noText || "取消",
        _this = this;
      _this.SI_autoOk && clearInterval(_this.SI_autoOk);
      _this.SI_autoOk = null;
      let ph = `<div style="z-index:9999;position:fixed;top: 40%;left:50%;width:100%;height:0;font-size:14px;" id="myTools_popup">
			<div class="popup-content" style="width:${params.width || "70%"
        };max-width:512px;background: rgba(255,255,255,.8);border:1px solid #999999;border-radius: 10px;transform: translate(-50%,-50%) scale(.1,.1);transition:all .1s;">
			<div style="padding: 10px 15px;"><span style="font-weight:700;">${params.title || ""
        }</span><span style="float:right;color:#666;cursor:pointer;" class="btncl">✖</span></div>
			<div style="padding: 0 15px;line-height:1.5;max-height:500px;overflow-y:auto;">${params.text || ""}</div>
			<div style="text-align:right;padding: 10px;">`;
      if (params.onNo) ph += `<button style="margin-right: 15px;padding: 5px 20px;border: 1px solid #000;border-radius:5px;" class="btnno">${noText}</button>`;
      ph += `<button style="padding: 5px 20px;background-color: #963;color:#FFF;border: 1px solid #000;border-radius: 5px;" class="btnok">${okText}</button>
			</div></div></div>`;
      let $ph = $(ph);
      $("body").append($ph);
      setTimeout(() => {
        $ph.find(".popup-content").css({ transform: "translate(-50%,-50%) scale(1,1)" });
        params.afterOpen && params.afterOpen($ph);
      }, 100);
      if (params.autoOk) {
        let autoCloseN = Number(params.autoOk);
        $("#myTools_popup .btnok").text(okText + "(" + autoCloseN + "s)");
        _this.SI_autoOk = setInterval(() => {
          autoCloseN--;
          $("#myTools_popup .btnok").text(okText + "(" + autoCloseN + "s)");
          if (autoCloseN < 1) {
            $ph.find(".btnok").click();
          }
        }, 1000);
      } else if (params.autoNo) {
        let autoCloseN = Number(params.autoNo);
        $("#myTools_popup .btnno").text(noText + "(" + autoCloseN + "s)");
        _this.SI_autoOk = setInterval(() => {
          autoCloseN--;
          $("#myTools_popup .btnno").text(noText + "(" + autoCloseN + "s)");
          if (autoCloseN < 1) {
            $ph.find(".btnno").click();
          }
        }, 1000);
      }
      $ph.find(".btncl").click((e) => {
        _this.SI_autoOk && clearInterval(_this.SI_autoOk);
        params.onX && params.onX();
        $ph.remove();
      });
      $ph.find(".btnno").click((e) => {
        _this.SI_autoOk && clearInterval(_this.SI_autoOk);
        params.onNo && params.onNo();
        $ph.remove();
      });
      $ph.find(".btnok").click((e) => {
        _this.SI_autoOk && clearInterval(_this.SI_autoOk);
        params.onOk && params.onOk($ph);
        $ph.remove();
      });
    },
    showInput(params) {
      let popParams = Object.assign({}, params);
      let inpstyle = "font-size:14px;line-height:1.5;width:100%;padding:5px;border:1px solid #999;border-radius:5px;margin:5px 0;outline:none;box-sizing:border-box;";
      if (params.inputs && params.inputs.length > 1) {
        for (let i = 0; i < params.inputs.length; i++) {
          let val = params.value[i] || "";
          popParams.text += `<div><div style="width:20%;float:left;margin:5px 0;line-height:2;text-align:right;">${params.inputs[i]}: </div><div style="width:73%;margin-left:21%;">`;
          popParams.text +=
            params.type == "textarea"
              ? `<textarea id="myTools_popup_input_${i}" rows="4" style="${inpstyle}">${val}</textarea></div></div>`
              : `<input id="myTools_popup_input_${i}" type="text" value="${val}" style="${inpstyle}"/></div></div>`;
        }
        popParams.onOk = () => {
          let val = [];
          for (let i = 0; i < params.inputs.length; i++) {
            val.push($("#myTools_popup_input_" + i).val());
          }
          params.onOk(val);
        };
      } else {
        popParams.text +=
          params.type == "textarea"
            ? `<div><textarea id="myTools_popup_input" rows="4" style="${inpstyle}">${params.value || ""}</textarea></div>`
            : `<div><input id="myTools_popup_input" type="text" value="${params.value || ""}" style="${inpstyle}"/></div>`;
        popParams.onOk = () => {
          let val = $("#myTools_popup_input").val();
          params.onOk(val);
        };
      }
      this.showPop(popParams);
    },
    showInfoPanel(params) {
      if ($("#myTools_InfoPanel").length) $("#myTools_InfoPanel").remove();
      params = params || {};
      let okText = params.okText || _("关闭", "關閉"),
        noText = params.noText || "清空",
        _this = this;
      let $ph = $(`<div style="z-index:9900;position:fixed;top:10%;left:0;width:100%;height:0;font-size:12px;" id="myTools_InfoPanel">
			<div class="infoPanel-content" style="width:${params.width || "75%"
        };max-width:512px;height:620px;background: rgba(255,255,255,.9);border:1px solid #999;border-radius:0 10px 10px 0;transform: translate(-100%,0);transition:all .1s;">
				<div style="padding: 10px 15px;"><span style="font-weight:700;">${params.title || ""
        }</span><span style="float:right;color:#666;cursor:pointer;" class="btncl">✖</span></div>
				<div style="padding: 0 15px;line-height:1.5;height:550px;overflow-y:auto;" class="infoPanel-wrap">${params.text || ""}</div>
				<div style="text-align:right;padding: 10px;">
				<button style="padding: 5px 20px;background-color: #969;color:#FFF;border: 1px solid #000;border-radius: 5px;margin-right:25px;" class="btnno">${noText}</button>
				<button style="padding: 5px 20px;background-color: #963;color:#FFF;border: 1px solid #000;border-radius: 5px;" class="btnok">${okText}</button>
				</div>
			</div></div>`);
      $("body").append($ph);
      setTimeout(() => {
        $ph.find(".infoPanel-content").css({ transform: "translate(0,0)" });
        params.onOpen && params.onOpen();
      }, 100);
      $ph.find(".btncl").click((e) => {
        params.onClose && params.onClose();
        $ph.remove();
      });
      $ph.find(".btnok").click((e) => {
        params.onOk && params.onOk();
        params.onClose && params.onClose();
        $ph.remove();
      });
      $ph.find(".btnno").click((e) => {
        params.onNo && params.onNo();
      });
      return $ph;
    },
    writeToOut(html) {
      var m = new unsafeWindow.Map();
      m.put("type", "main_msg");
      m.put("subtype", "html");
      m.put("msg", html);
      gSocketMsg.dispatchMessage(m);
    },
  };
  PLU.autoPuzzle = PLU.AutoPuzzle();
  attach();
  init();
});
