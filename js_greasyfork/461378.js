// ==UserScript==
// @name         B站搜索结果过滤
// @namespace    Violentmonkey Scripts
// @version      1.1.230307
// @description  在B站搜索页按UP主、标题、时长过滤搜索结果（仅限视频），需手动点击“过滤本页”按钮
// @author       神豚 with AI
// @match        https://search.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461378/B%E7%AB%99%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/461378/B%E7%AB%99%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
      以下设置参数，所有白名单优先级均高于黑名单
      ***注意自行备份设置，以免脚本更新时被预设值覆盖***
    */

    const author_blacklist = ['影视', '电影', '剪辑', '解说', '说剧', '聊剧', '看剧', '追剧', '剧场', '剧坊', '说影', '谈影', '看影', '观影', '探影', '放映厅', '娱乐', '说娱', '吹娱', 'bili_']; //（黑）设置想过滤的UP主字眼，可写全名也可写部分
    const author_whitelist = ['电影频道融媒体中心']; //（白）设置UP主白名单

    const uid_blacklist = []; //（黑）设置想过滤的UP主uid，无需引号
    const uid_whitelist = [343084292, 385144384, 1955015531]; //（白）设置uid白名单

    const uid_threshold = 3400000000000000; //（黑）过滤uid大于该值的所有新用户，设置0则不启用（新用户uid长度：16，预设值：3400000000000000）

    const title_blacklist = []; //（黑）设置想过滤的标题字眼
    const title_whitelist = []; //（白）设置标题白名单

    const duration_threshold = 900; //（白）不过滤时长大于等于该值的所有长视频，设置0则不启用（单位：秒，预设值：900）

    /*
      以下功能：在“更多筛选”前面增加“过滤本页”按钮，点击时根据上面设置过滤搜索结果并显示过滤数量
    */

    setTimeout(() => {
      let oldbutton = document.querySelector('.vui_button.vui_button--active-shrink.i_button_more');

      let newbutton = document.createElement('button');
      newbutton.className = 'vui_button';
      newbutton.innerHTML = `过滤本页`;

      let textnode = document.createElement('span');
      textnode.id = 'filter-count';
      textnode.style.color = 'rgb(0,174,236)';
      textnode.innerHTML = `待过滤`;

      oldbutton.parentNode.insertBefore(newbutton, oldbutton);
      newbutton.parentNode.insertBefore(textnode, newbutton.nextSibling);

      newbutton.onclick = () => {
            let count = 0;
            let divs = document.querySelectorAll('.video-list-item, .col_3.col_xs_1_5.col_md_2.col_xl_1_7.mb_x40'); //兼容新旧class
            divs.forEach(div => {
                if (![...div.classList].some(className => className.includes('to_hide_md'))) {
                    let author = div.querySelector('.bili-video-card__info--author').innerHTML;
                    let title = div.querySelector('.bili-video-card__info--tit').innerHTML;
                    let uid = div.querySelector('.bili-video-card__info--owner').getAttribute('href').match(/\/\/space\.bilibili\.com\/(\d+)/);

                    let duration = 0;
                    let time_str = div.querySelector('.bili-video-card__stats__duration').textContent.split(':');
                    if (time_str.length == 3) {
                        duration = parseInt(time_str[0]) * 3600 + parseInt(time_str[1]) * 60 + parseInt(time_str[2]);
                    } else if (time_str.length == 2) {
                        duration = parseInt(time_str[0]) * 60 + parseInt(time_str[1]);
                    }

                    let black1 = author && author_blacklist.some(word => author.includes(word));
                    let white1 = author && author_whitelist.some(word => author.includes(word));
                    let black2 = uid && uid_blacklist.includes(parseInt(uid[1]));
                    let white2 = uid && uid_whitelist.includes(parseInt(uid[1]));
                    let black3 = uid_threshold > 0 && uid && parseInt(uid[1]) > uid_threshold;
                    let black4 = title && title_blacklist.some(word => title.includes(word));
                    let white4 = title && title_whitelist.some(word => title.includes(word));
                    let white5 = duration_threshold > 0 && duration >= duration_threshold;
                    if ( ( black1 || black2 || black3 || black4 ) && !( white1 || white2 || white4 || white5 ) ) {
                        div.style.display = 'none';
                        count++;
                    }
                }
            });
            textnode.innerHTML = `已过滤${count}项`;
        };
   }, 500); //页面加载后延迟500毫秒执行，延时太短会失败

    /*
      以下功能：翻页、筛选、重新搜索时重置过滤数量
    */

    function bindButtons() {
        let page_buttons = document.querySelectorAll('.vui_button.vui_pagenation--btn, .vui_button--tab, .search-button, .suggest-item, .history-text, .trending-text');
        page_buttons.forEach(function(page_button) {
            if (!page_button.classList.contains('vui_button--active')) {
                page_button.addEventListener('click', handleClick);
            }
        });

        let search_input = document.querySelector('.search-input-el');
        if (search_input) {
            search_input.addEventListener('keydown', function(event) {
                if (event.key == 'Enter') {
                    handleClick();
                }
            });
        }
    }

    function handleClick() {
        let textnode = document.querySelector('#filter-count');
        if (textnode) {
            textnode.innerHTML = `待过滤`;
        }
    }

    window.addEventListener('load', function() {
        setTimeout(bindButtons, 500);
    });

    let observer = new MutationObserver(bindButtons);
    observer.observe(document.body, {childList: true, subtree: true});

})();