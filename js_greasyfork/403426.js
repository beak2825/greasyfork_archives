// ==UserScript==
// @name         Semiauto Steam Discovery Queue
// @description  something aid to accelerate steam discovery queue
// @author       desc_inno
// @namespace    https://github.com/desc70865/Semiauto-Steam-Discovery-Queue
// @supportURL   https://github.com/desc70865/Semiauto-Steam-Discovery-Queue/issues
// @version      0.1.6
// @icon         https://store.steampowered.com/favicon.ico
// @match        https://store.steampowered.com/app/*
// @match        https://store.steampowered.com/explore/*
// @match        https://store.steampowered.com/agecheck/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/403426/Semiauto%20Steam%20Discovery%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/403426/Semiauto%20Steam%20Discovery%20Queue.meta.js
// ==/UserScript==

// default set https://store.steampowered.com/account/languagepreferences both simplified & traditional chinese before use

(function() {
    'use strict';
    window.onload = semiauto();
})();

function semiauto() {
    var reg_error = /Failed to load queue|502 Bad Gateway/g,
        flag_error = (reg_error).test(document.getElementsByTagName('html')[0].outerHTML); // 首先判断是否加载错误,如遇到错误直接刷新,一般两三次即可恢复
    if(flag_error){ // may refresh can work better
        window.location.reload(); // if error, refresh the page
    };
    var path = window.location.pathname.split('/'); // 根据路径选择分支
    switch(path[1]) { // switch by path name
        case 'explore':
            var queue_length = $("div#discovery_queue")[0].childNodes.length; // rest items in queue
            if(queue_length > 0){ // 检测队列剩余长度,如果仍有内容则添加按钮并等待用户操作
                let button = createButton(),
                    reg_appid = /\d+/g;
                document.getElementById('remove_button').addEventListener('click', function() {
                    let appid = document.getElementById("discovery_queue_start_link").href.match(reg_appid)[0];
                    clearAppInQueue(appid);
                });
            }else{ // 否则模拟点击并刷新生成新队列
                let click = $("div.discover_queue_empty_refresh_btn")[0].getElementsByTagName("span")[0].click(),
                    t = setTimeout(window.location.reload(),3000);
            };
            break;
        case 'app':
            var flag_inqueue = (typeof($('.next_in_queue_content')[0]) != "undefined"),
                flag_filter = titleMark(); // 在商店页首先运行标题修饰,返回过滤规则判断结果; 可单独在商店页运行 titleMark() 作为独立功能
            if(flag_inqueue && flag_filter){ // current game in explore queue
                try{ // 如果该游戏在队列中且符合过滤规则,开始自动下一个
                    $("#es_new_queue")[0].click(); // 尝试生成新队列
                }catch(e){ // 正常点击下一个
                    $("div.btn_next_in_queue_trigger")[0].click();
                };
            };
            // let t = setTimeout(backToExplore, 5000); // back to main page in 5 seconds
            break;
        case 'agecheck': // readability
            /*
            document.cookie = "wants_mature_content=1";
            document.cookie = "birthtime=22503171";
            window.open("https://store.steampowered.com/");
            let t = setTimeout(window.location.reload(), 1500);
             */
            break;
        default:{ // 异常页面,返回主页
            let t = setTimeout(backToExplore, 1500);
            break;
        };
    };
};

function titleMark() { // add prefix & suffix to title if u need
    let trade_card = cardDetect(), // if has trade cards
        chinese_support = languageDetect(), // if supports simplified chinese or traditional chinese
        tag_filter = tagsfilter(),
        reviews_ratio = ratioDetect(),
        this_year = new Date().getFullYear(),
        release_year = releaseYearDetect();

    if(( (trade_card + chinese_support + tag_filter) < 1 || reviews_ratio < 60 || release_year < (this_year - 10) ) && reviews_ratio < 90 && release_year < this_year ){ // some rules by costomize
        return true; // 卡牌,语言支持,标签过滤得分至少为1且好评率>60且十年内发售 或 仅为今年的新游戏(也可能是尚未发售)或好评游戏 该规则的目的是探索新游戏并检测一些质量尚可的冷门游戏
    };
    return false;
};

function cardDetect() {
    if((/Steam 集换式卡牌/g).test(document.body.innerText)){
        $('.apphub_AppName')[0].innerHTML = "📇 " + $('.apphub_AppName')[0].innerText; // add emoji to prefix for mark
        return 1;
    };
    return 0;
};

function languageDetect() { // 不支持默认语言时匹配"不支持",同时检测其他语言中包含的辅助语言
    let flag_schinese = $('.game_language_options')[0].innerText.match(/不支持/g) == null,
        flag_tchinese = $('.game_language_options')[0].innerText.match(/繁体中文/g) != null;
    if(flag_schinese == true || flag_tchinese == true){
        $('.apphub_AppName')[0].innerHTML = "🀄️ " + $('.apphub_AppName')[0].innerText; // add emoji to prefix for mark
        return 1;
    };
    return 0;
};

function tagsfilter() {
    let tags = $("div.popular_tags")[0].childNodes, // get tags
        reg_include_tags = /免费/g, // tags you are interested in
        reg_exclude_tags = /大师级|虚拟现实/g, // tags you dont want
        flag_tag_in = tagsReg(tags, reg_include_tags),// if it has sth you need
        flag_tag_ex = tagsReg(tags, reg_exclude_tags); // or just the opposite
    return (flag_tag_in - flag_tag_ex); // range [-1,1]
};

function tagsReg(tags, reg) { // tag detector
    for(let i = 1; i < 6 && i < tags.length; i++){ // search in top 5 tags
        if(reg.test(tags[i].innerText)){
            return 1;
        };
    };
    return 0;
};

function ratioDetect() {
    let rate_panel = $("div.user_reviews_summary_row"), // get reviews panel
        last = rate_panel.length - 1; // if there is recent reviews, it should be 1, or just 0
    if((/%/g).test(rate_panel[0].dataset.tooltipHtml)){ // sometimes there wont be enough reviews
        let reviews_ratio = rate_panel[last].dataset.tooltipHtml.match(/\d+(?=%)/g), // overall percentage
            reviews_total = rate_panel[last].dataset.tooltipHtml.replace(',','').match(/\d+(?= 篇)/g), // a space here / sum of reviews
            reviews_positive = parseInt(reviews_total * reviews_ratio / 100);
        $('.apphub_AppName')[0].innerHTML = $('.apphub_AppName')[0].innerText + " => ("+ reviews_positive + "/" + reviews_total + ") = " + reviews_ratio + "%☆"; // add rate to suffix for mark
        return reviews_ratio;
    };
    return 60; // set the default value by 80 which should below threshold 90
};

function releaseYearDetect() {
    try{
        return document.getElementsByClassName('date')[0].innerHTML.match(/\d{4}/g).toString();
    }catch(e){
        return 2077
    };
};

function backToExplore() { // return if error
    window.location.href = "https://store.steampowered.com/explore/";
};

function clearAppInQueue(appid) { // core
    $J.post('/app/'+appid, {sessionid: g_sessionID, appid_to_clear_from_queue: appid}).done(window.location.reload());
};

function createButton() { // create button for nextAppInQueue at "https://store.steampowered.com/explore/"
    let buttonContainerDiv = document.createElement('div'),
        buttonSpan = document.createElement('span');
    // 设置移除按钮
    buttonSpan.innerHTML = '移除当前游戏';
    buttonSpan.setAttribute('style', 'padding: 0 15% 0 15%; font-size: 15px; line-height: 64px; color: #ffcc6a; font-family: "Motiva Sans", Sans-serif; font-weight: 300;')

    buttonContainerDiv.setAttribute('id', 'remove_button');
    buttonContainerDiv.setAttribute('class', 'next_in_queue_content');
    buttonContainerDiv.setAttribute('style', 'background: url(/public/images/v6/app/queue_next_btn.png) top left no-repeat; width: 144px; height: 64px; cursor: pointer; background-size: 100% 200%; margin-bottom: -26px; margin-right: 0px; margin-top: -9px; float: right;');
    // 并添加节点
    buttonContainerDiv.appendChild(buttonSpan);
    document.getElementsByClassName('discovery_queue_apps')[0].getElementsByClassName('discovery_queue_static')[0].insertAdjacentHTML('afterend', buttonContainerDiv.outerHTML);

    return buttonContainerDiv;
};