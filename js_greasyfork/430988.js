// ==UserScript==
// @name         B站大学习
// @namespace    https://github.com/cernard
// @version      0.1
// @description  B站限制访问插件，帮助不自觉的人专注学习
// @author       Cernard
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      http://cdn.staticfile.org/moment.js/2.24.0/moment.js
// @downloadURL https://update.greasyfork.org/scripts/430988/B%E7%AB%99%E5%A4%A7%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/430988/B%E7%AB%99%E5%A4%A7%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==


// const fontColor = '#454644';
const fontColor = '#E5E6E4';
// const bgColor = '#E5E6E4';
const bgColor = '#4b4c4a';
const commonRadius = '10px';
const commonShadow = '0 0 8px 0 rgba(200, 200, 200, 0.5)';

// 励志背景
function bg() {
    let struggleSentences = [
        '请乘理想之马，挥鞭从此起程，路上春色正好，天上太阳正晴。',
        '把细节留给数学 把保护欲用在语文 把占有欲放在英语 把安全感交给成绩',
        '人生没有白走的路 每一步都算数',
        '今日不肯埋头，明日何以抬头',
        '“要努力，但是不要急。繁花锦簇，硕果累累都需要过程 。”',
        '努力追上你的每天都是美好的 因为未来可期',
        '我跑啊跑啊就是为了追上曾经那个被赋予众望的自己',
        '努力的人 终将过上与努力相匹配的生活',
        '种一棵树最好的时间是十年前，其次是现在。',
        '须知少时凌云志，曾许人间第一流。',
        '我不知道什么叫做年少轻狂 我只知道胜者为王',
        '只要你足够努力，阳光会穿破厚厚的云层，照进你的人生。',
        '反正都是要学的，为什么不做好一点呢？',
        '你一个人的努力可以改变三代人的命运',
        '凡事皆有可能，永远别说永远。',
        '天赋决定上限，努力决定下限。',
        '努力让自己变得优秀 然后骄傲的生活',
        '自律＋努力＋方法＋坚持＋时间＝优秀',
        '那些看似不起波澜的日复一日，会突然在某一天让人看到坚持的意义。',
        '回什么头啊',
        '每天努力一点 优秀一点',
        '善良一点 可爱一点',
        '一定能找到更好的',
        '急切地想要认识一下高度自律的自己',
        '努力经营当下 直至未来明朗',
        '你的爱豆都在努力，你还凭什么不去努力？',
        '知足常乐是属于全力以赴后的姿态',
        '你知道人类最大的武器是什么吗？',
        '是豁出去的决心。',
        '——伊坂幸太郎',
        '勇敢的人，不仅仅是不落泪的人，还有愿意含着泪继续奔跑的人。',
        '若你决定灿烂，山无遮，海无拦！',
        '天道酬勤，精益求精，只争朝夕。',
        '失败永远不是终点，放弃才是。',
        '当挫折在脚下堆积成梯，你就获得了进步的机会。',
        '凡是有意义的事都不会容易，哪怕输一百次，也希望你有开始第一百零一次的勇气。',
        '“你要悄悄拔尖 然后惊艳众人”',
        '相信自己，你能作茧自缚，就能化茧成蝶。',
        '别说读书苦，那是你看世界的路。',
        '年轻人 请努力 让自己出色 从能力到容貌',
        '从来不是让你把一次考试当作人生成败的赌注，只是想让你在足够年轻的时候体会一次全力以赴。',
        '你努力的样子可爱极了,像一颗闪着光的小熊软糖',
        '只有保持战斗，才能永远让你跟这个世界旗鼓相当。',
        '如果很容易实现的话，初心就不会这么珍贵。',
        '请优秀，并与优秀者为伍。',
        '请独立，并以逻辑思考为基础。',
        '请热情，并以尊重人性和普世价值为情怀。',
        '请年轻，愿你重山万水，归来依旧少年。',
        '你要暗自努力然后惊艳所有人',
        '世界那么大，我的父母应该去看看。',
        '你一个人的努力可以改变三代人的命运。',
        '我努力奔跑是为了追上那个曾经被寄予厚望的自己。',
        '我认真学习，卖力考试，辛辛苦苦打拼事业，为的就是当我爱的人出现，不管他富甲一方，还是一无所有，我都可以张开双手坦然拥抱他。',
        '同时风华正茂 何甘他人之后。',
        '痛苦不是失败，而是你本可以。',
        '但凡辛苦都是礼物',
        '你继续差吧 我不会等你的',
        '让你变好的事情 过程都不会是轻松的。',
        '努力只能及格 拼命才会优秀',
        '坚持一点 为了妈妈',
        '努力就是为了远离你不喜欢的人',
        '既然做不了富二代 那就自己努力做富一代吧',
        '种一棵树最好的时间十年前，其次就是现在',
        '生活原本沉闷，但跑起来就有风',
        '天赋决定上限，努力决定下限。',
        '或许我坚持完这么多个日夜 可以在我父母想要东西的时候不用考虑我的钱够不够 而是她们能不能买',
        '发奋努力，只是为了证明，我足以与你相配。',
        '读那么多书干什么呢？就是在要紧关头，可以凭意志维持一点自尊：人家不爱我们，我们站起来就走，无谓纠缠。',
        '好运藏在努力里',
        '乾坤未定 你我皆是黑馬',
        '半山腰太挤了要去山顶看看4.愿你相对辛苦但绝对优秀!',
        '有什么一夜成名，其实都是百炼成钢',
        '彼方尚有荣光在',
        '“愿你以渺小启程，以伟大结束。”',
        '梦为努力浇了水',
        '所谓万丈深渊 下去 也是前程万里',
        '你讨厌的人正在努力11.我要优秀到让你想来认识我',
        '在努力，就是去见未来你想见的人',
        '同是寒窗苦读 怎愿甘拜下风',
        '听闻少年二字 应与平庸相斥',
        '这是个第一人称的世界 现在开始由我来论证这一切” ——岳明辉',
        '“先努力让自己发光，对的人才能迎着光而来。”',
        '浪费的日子都是要还的',
        '我要悄悄拔尖 然后惊艳所有人.',
        '“要变得温柔和强大，就算哪天突然孤身一人， 也能平静地活下去，不至于崩溃。”20.十七岁全力以赴，十八岁好好庆祝',
        '生活原本沉闷，但跑起来就有风。',
        '你成功的速度一定要超过父母老去的速度！',
        '一个只记得快乐和知识点的人',
        '41“兵分两路 顶端相见”',
        '不管你被贴上什么标签，只有你才能定义自己',
        '自律即自由',
        '最好的状态是未来可期',
        '你背不下来的书，总有人能背下来，你做不出来的题，总有人能做出来，你愿意拖到明天的事，总有人今天努力做完。那么不好意思，你想去的学校也只能别人去了，你想过的人生也只能别人过了。',
        '一做出成绩来，全世界都会和颜悦色。',
        '人贵在自己争气 。',
        '没有难过 没有抑郁 我很开心 我很快乐 一切最好的都在路上 在坚持一下 就一下 这样 你才值得配的上最好的',
        '你要悄悄地拔尖，然后惊艳所有人',
        '跑步很累 数学很难 听课很困 作业很多 但熬过这些日子就是前程似锦',
        '我希望通过努力，在世界上留下很厉害的痕迹',
        '数学题是很难，但我想带家人去外面看看',
        '少女的征途是星辰大海，而非烟尘人间',
        ' 你一定要优秀，去堵住那些悠悠众口',
        '所有的一切都是为了迎接那封令人羡艳的通知书',
        '不要停止奔跑，不要回顾来路 来路无可眷恋，值得期待的只有前方',
        '希望是我，千万是我，拜托是我，熬到最后一定是我，对不起，这把我要赢',
        '没有自觉和自律，就没有真正的自由和自在',
        ' 数学题很难 笔记也很难记 没有那个他我也很难熬 可我不能让我的妈妈吃苦了 我难熬短时间就算了 妈妈不行.',
        '我当然不会去摘月亮，我要它向我奔来',
        '60 努力是会上瘾的，特别是尝到甜头之后',
    ];

    /**
    // Canvas绘制
    $('body').append('<canvas id="vas" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; background: black"/>');

    const canvas = document.getElementById('vas');
    const ctx = canvas.getContext("2d");
    ctx.translate(0.5, 0.5);
    **/

    function randomStrStyle(str) {

        const randomColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()})`;
        const randomRotate = `rotate(${Math.random() * 360}deg)`;
        const left = Math.random() * $('body').width() + 'px';
        const top = Math.random() * $('body').height() + 'px';
        const fontSize = Math.random() * 40;
        return `<span style="font-size: ${fontSize}px; user-select: none; -webkit-user-select: none; cursor: default; z-index: -1; display: inline-block;color: ${randomColor}; transform:${randomRotate};-webkit-transform:${randomRotate}; position: absolute; left: ${left}; top:${top}">${str}</span>`;

        /**
        // Canvas绘制
        struggleSentences.forEach(str => {
            const width = canvas.width;
            const height = canvas.height;
            const randomColor = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random()})`;
            const randomRotate = (Math.random() + 1) * 360 * Math.PI/180;
            const left = Math.random() * width;
            const top = Math.random() * height;
            const fontSize = Math.random() * 20;

            ctx.fillStyle = randomColor;
            ctx.font = `${fontSize}px Arial`;
            ctx.rotate(randomRotate);
            ctx.fillText(str, left , top)
        });
        **/
    }

    struggleSentences.forEach(str => {
        $('body').append(randomStrStyle(str));
    });
}

function enableStyle() {
    // 清除样式
    /**
    $('.first-screen').remove();
    $('.storey-box').remove();
    $('.international-footer').remove();
    $('.b-wrap').remove();
    $('.bili-banner').remove();
    $('.mini-header__content .nav-link').remove();
    $('.nav-user-center .item:lt(5)').remove();
    $('.nav-user-center .item:gt(1)').remove();
    $('.mini-upload').remove();
*/
    document.title = "B站大学习";

    // 设置样式
    const styleTag = $('<style></style>').text(`
    .first-screen, .storey-box, .international-footer, .bili-banner, .b-wrap, .mini-upload, .nav-link, .nav-user-center .item:nth-child(2), .nav-user-center .item:nth-child(3), .nav-user-center .item:nth-child(4), .nav-user-center .item:nth-child(7) {
        display: none !important;
    }

    body {
    background-color: black !important;
}

#app {
    display: flex !important;
    margin-top: 10% !important;
    align-items: center !important;
    height: 100% !important;
    flex-direction: column !important;
    z-index: 100 !important;
}

.nav-search-btn {
    background-color: ${bgColor} !important
}

.nav-user-center .user-con .item .name {
    color: ${fontColor} !important;
    text-shadow: none !important;
    border-radius: ${commonRadius} !important;
    padding: 10px !important;
    background: ${bgColor} !important;
    box-shadow: ${commonShadow} !important;
}

.mini-header__content {
    justify-content: center !important;
    align-items: center !important;
}

#nav_searchform {
    border-radius: ${commonRadius} !important;
    background-color: ${bgColor} !important;
    box-shadow: ${commonShadow} !important;
}

#nav_searchform .nav-search-btn {
    border-top-right-radius: ${commonRadius} !important;
    border-bottom-right-radius: ${commonRadius} !important;
}

.nav-search-submit {
    color: ${fontColor} !important
}

#app:before {
content: "B站大学习";
color: ${fontColor};
font-size: 66.66px;
margin-bottom: 44.44px;
}

.suggest-wrap {
    background: ${bgColor} !important;
    color: ${fontColor} !important;
    border: none !important;
}

.nav-search-keyword {
    color: ${fontColor} !important;
    height: 44px !important;
}

.history-item {
    background-color: black !important
}

.bili-header-m .nav-search .nav-search-submit, .international-header .nav-search .nav-search-submit{
    position: static !important
}

.bili-header-m .nav-search .nav-search-btn, .international-header .nav-search .nav-search-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 44px;
}
    `);

    $('head').append(styleTag);

    // 设置内联样式
    $(".nav-search").bind("DOMNodeInserted", () => {
        // $('#bilibili-search-history').css({'background': bgColor, 'border-bottom-left-radius': commonRadius, 'border-bottom-right-radius': commonRadius, 'box-shadow': commonShadow});
        // $('#bilibili-search-suggest').css({'background': bgColor, 'border-bottom-left-radius': commonRadius, 'border-bottom-right-radius': commonRadius, 'box-shadow': commonShadow});
        // $('.suggest-wrap').remove();
        //$('.header-search-suggest').css({'background': bgColor, 'border-bottom-left-radius': commonRadius, 'border-bottom-right-radius': commonRadius, 'box-shadow': commonShadow});
        console.log($('.suggest-wrap'));
    });

    $(".nav-search").bind("DOMNodeRemoved", () => console.log("DOM移除"));
}

function showHistory() {
    showLoading(true);
    fetch('https://api.bilibili.com/x/web-interface/history/cursor?type=archive&ps=6', {
        method: 'GET',
        credentials: "include"
    })
    .then(rep => rep.json())
    .then(data => {
        console.log(data);
        const historyList = data.data.list.map(item => {
            const div = `
    <a class="box" href='https://www.bilibili.com/video/${item.history.bvid}' style="max-width: 360px; min-width: 360px; width: 360px; display: inline-flex; flex-direction: column; align-items: center; cursor: pointer; margin: 5px 10px 5px 10px; position: relative">
      <div style="position: relative;" class="cover-box">
        <img class="img" width=340 height=202 src="${item.cover}" alt="" />
        <span style="position: absolute; bottom: 0px; right: 0px; margin: 0 5px 8px 0;background: black; color: white; border-radius: 5px; padding: 5px; font-size: 12px;z-index: 999;color: ${fontColor}">已观看：${(item.progress / item.duration).toFixed(2) * 100}%</span>
      </div>
      <div box style="align-self: flex-start; display: flex; align-items: center">
        <img width=48 height=48 style="border-radius: 64px; margin:10px; color: ${fontColor}" src="${item.author_face}" alt="">
        <div title>
          <div style="color: ${fontColor}; font-size: 16px; font-weight: bold">${item.title}</div>
          <div style="font-size: 12px; opacity: 0.6; color: ${fontColor}">${item.author_name}·${moment(item.view_at * 1000).fromNow()}</div>
        </div>
      </div>
    </a>
            `;
            return div;
        });
        // width = divNum * (divWidth + marginLeft + marginRight + paddingLeft + paddingRight)
        const divBox = $(`<div style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap; width: 1140px; margin-top: 80px; position: relative">
        <style>
        .cover-box:hover::after {
            content: '点击跳转';
            position: absolute;
            display: flex;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background: black;
            opacity: 0.6;
            justify-content: center;
            align-items: center;
            font-size: 16px;
        }
        </style>
        </div>`).append(historyList);
        divBox.append(`<h1 style="font-weight: bold; position: absolute; left: 10px; top: -40px; z-index: 888; color: ${fontColor}">最近浏览历史</h1>`);
        $('#app').append(divBox);
        showLoading(false);
    })
    .catch(err => console.log(err));
}

function showLoading(isShow) {
    if (isShow) {
    $('#app').append(`
    <div id="loading" class="loading">
    <style>.loading{
  width: 80px;
  height: 40px;
  margin: 0 auto;
  margin-top:100px;
}
.loading span{
  display: inline-block;
  width: 8px;
  height: 100%;
  border-radius: 4px;
  background: #E5E6E4;
  -webkit-animation: load 1s ease infinite;
}
@-webkit-keyframes load{
  0%,100%{
    height: 40px;
    background: #E5E6E4;
  }
  50%{
    height: 70px;
    margin: -15px 0;
    background: #4b4c4a;
  }
}
.loading span:nth-child(2){
  -webkit-animation-delay:0.2s;
}
.loading span:nth-child(3){
  -webkit-animation-delay:0.4s;
}
.loading span:nth-child(4){
  -webkit-animation-delay:0.6s;
}
.loading span:nth-child(5){
  -webkit-animation-delay:0.8s;
}</style>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>
    `);
    } else {
        $('#loading').remove();
    }
}

// 好好学习检测
function goodGoodStudyCheck() {
    const whiteList = [
        'https://www.bilibili.com',
        'https://www.bilibili.com/video',
        'https://search.bilibili.com',
    ];

    const curHref = window.location.href;
    const url = curHref.split('//')[1];
    const host = url.split('/')[0];
    const splitedResult = url.split('/');
    const subDomain = url.split('.')[0];

    function close() {
        window.opener=null;
        window.open('','_self');
        window.close();
    }

    switch(subDomain) {
        case 'www':
        case 'bilibili':
            if (splitedResult.length >= 2 && (splitedResult[1] !== "" && splitedResult[1] !== "video" && splitedResult[1] !== "account")) {
                close();
            }
            break;
        case 'search':
        case 'passport':
            break;
        default:
            close();
    }
}

function hideRecomendList() {
    $('head').append(`<style>
    #reco_list, .ad-report {
        display: none !important;
    }

    .multi-page .cur-list .list-box {
        max-height: 927px
    }
    </style>`);
}
(function() {
    'use strict';

    goodGoodStudyCheck();

    // 只有在首页才修改样式
    const indexPageURLs = ['https://www.bilibili.com/', 'https://www.bilibili.com', 'http://www.bilibili.com', 'https://www.bilibili.com/'];
    if (indexPageURLs.includes(window.location.href)) {
      bg();
      enableStyle();
      showHistory();
    } else {
        const curHref = window.location.href;
        const url = curHref.split('//')[1];
        const host = url.split('/')[0];
        const splitedResult = url.split('/');
        const subDomain = url.split('.')[0];
        if (splitedResult.length >= 2 && splitedResult[1] === "video") {
            hideRecomendList();
        }
    }
    // Your code here...
})();