// ==UserScript==
// @name         Auto Article
// @description  generate game info
// @author       desc_inno
// @namespace    https://github.com/desc70865/Auto-Article/
// @supportURL   https://github.com/desc70865/Auto-Article/issues
// @version      0.2
// @icon         https://store.steampowered.com/favicon.ico
// @match        https://store.steampowered.com/app/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/404115/Auto%20Article.user.js
// @updateURL https://update.greasyfork.org/scripts/404115/Auto%20Article.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("auto start");

    window.setTimeout(print,10000);
})();

function print() {
    // 提取变量

    var table = [];
    var date = new Date();
    var nowMonth = date.getMonth() + 1;
    var strDate = date.getDate();
    var seperator = "-";
    if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = "0" + nowMonth;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;
    var name = jQuery('.apphub_AppName')[0].innerHTML.split('<div')[0];
    var discount = jQuery('.discount_pct')[0].innerHTML;
    var price = jQuery('.discount_final_price')[0].innerHTML;
    var appid = window.location.pathname.split('/')[2];
    var cover = jQuery('.game_header_image_full')[0].src;
    var text = jQuery('.game_description_snippet')[0].innerText;
    var mp4 = jQuery('.highlight_movie')[0].attributes[4].textContent.split('_vp9')[0] + '.mp4';
    var pics = jQuery('.highlight_screenshot_link')
    var details = jQuery('.game_area_description');
    var length_details = details.length;
    var cardText = cardDetect();
    var languageText = languageDetect();
    var ratioText = ratioDetect();

    // 生成代码

    table.push('[b][size=4][' + nowDate + ']' + name + ' ' + discount + '/' + price + '[/size][/b]');
    table.push(' ');
    table.push('[sframe]' + appid + '[/sframe]');
    table.push('[sh1]游戏简介[/sh1]');
    table.push('[img]' + cover + '[/img]');
    table.push('[quote][b][size=3]' + text + '[/size][/b][/quote]');
    table.push('[sh1]游戏视频[/sh1]');
    table.push('[media=webm,500,375]' + mp4 + '[/media]');
    table.push('[sh1]游戏详情[/sh1]');
    for(let j = 0; j < details.length; j++){
        table.push('[quote][b]' + details[j].innerText + '[/b][/quote]');
    }
    table.push('[sh1]游戏截图[/sh1]');
    for(let i = 0; i < pics.length; i++ ){
        // table.push('[img]' + pics[i].childNodes[1].currentSrc + '[/img]'); // 使用这行提取 600x338 的缩略图
        table.push('[img]' + pics[i].childNodes[1].currentSrc.replace('.600x338', '') + '[/img]'); // 使用这行则提取原图,默认
        table.push(' '); // 在图片之间插入空行,若不需要注释即可: 在前方插入"//"
    }

    table.push(' ');
    table.push('[align=center]');
    table.push('[table=93%,silver]');
    table.push('[tr][td]');
    table.push('[align=center][table=90%]');
    table.push('[tr=royalblue][td][align=center][size=5][font=黑体][color=White]《' + name + '》[/color][/font][/size][/align][/td][/tr]');
    table.push('[tr=white][td][align=center][img=640,321]' + cover + '[/img][/align][/td][/tr]');
    table.push('[tr=white][td][align=center][sframe]' + appid + '[/sframe][/align][/td][/tr]');
    table.push('[tr=black][td][align=center][color=White][size=4]' + cardText + '/' + languageText + '/' + ratioText + '[/size][/color][/align][/td][/tr]');
    table.push('[tr=black][td][align=center][color=White][size=4]填写史低信息[/size][/color][/align][/td][/tr]');
    table.push('[tr=black][td][align=center][color=White][size=4]相关链接[/size][/color][/align][/td][/tr]');
    table.push('[tr=white][td][align=center]历史定价图片.jpg[/align][/td][/tr]');
    table.push('[tr=white][td][align=center][img=1920,620]https://steamcdn-a.akamaihd.net/steam/apps/' + appid + '/library_hero.jpg[/img][/align][/td][/tr]');
    table.push('[/table][/align]');
    table.push('[/td][/tr]');
    table.push('[/table]');
    table.push('[/align]');

    // 打印

    console.log(table.join('\n'))
};

// 其他

function cardDetect() { // 提取卡牌信息
    if((/Steam 集换式卡牌/g).test(document.body.innerText)){
        return '有卡';
    };
    return '无卡';
};

function languageDetect() { // 需要设置备用语言为繁体中文
    let flag_schinese = (/不支持/g).test(jQuery('.game_language_options')[0].innerText) == false,
        flag_tchinese = (/繁体中文/g).test(jQuery('.game_language_options')[0].innerText) == true;
    if(flag_schinese == true || flag_tchinese == true){
        return '支持中文';
    };
    return '无中文';
};

function ratioDetect() {
    try{
        return jQuery("span.game_review_summary")[0].innerText;
    }catch(e){
        return '暂无评价';
    }
};