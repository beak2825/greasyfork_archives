// ==UserScript==
// @name         和谐知乎
// @namespace    https://github.com/iimondo/zhihu
// @version      0.1
// @description  知乎关键字屏蔽
// @author       iimondo
// @match        *://*.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/assets/apple-touch-icon-60.362a8eac.png
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/521655/%E5%92%8C%E8%B0%90%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/521655/%E5%92%8C%E8%B0%90%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let local_filter_keywords = [
        '程序员|裁员', '计算机|中央', '就业|专家', '战争',

        '美|台', '俄|乌', '二十大|中国', '拜登|政府', '政府', '外交部|人民', '加沙|东北', '原神|BBC', '富士康|郑州',

        '立陶宛|韩国', '香港|德国', '越南|叙利亚', '中东|特朗普', '伊朗|日本', '以色列|土耳其', '法国|阿拉伯',

        '(?=.*评价)(?=.*《)', '(?=.*看待)(?=.*《)',

        '(?=.*重庆)(?=.*星巴克)', '千帆|国企', '吴柳芳|封神',
    ];


    // 返回当前列表的容器
    function getContainerElement(){
        let listShortcut = document.querySelector('#TopstoryContent > .ListShortcut');
        let hotList = listShortcut.querySelector('.HotList'); // 热门
        let topstory_recommend = listShortcut.querySelector('.Topstory-recommend'); // 推荐
        let topstory_follow = listShortcut.querySelector('.Topstory-follow'); // 关注

        if(hotList !== null ){
            return hotList.querySelectorAll('section'); // 去除热置顶前5内容

        } else if(topstory_recommend !== null){
            return topstory_recommend.querySelectorAll('.TopstoryItem');

        } else if(topstory_follow !== null){
            return topstory_follow;
        }

        return null;
    }


    // 过滤内容
    function filterHotContent(filterKeyword, elements){
        let removeCartItem = [];

        elements.forEach(item => {
            if(filterHotContent_(filterKeyword, item)){
                removeCartItem.push(item);
            }
        });

        while(removeCartItem.length > 0){
            removeCartItem.pop().remove();
        }
    }


    // 过滤单个内容，返回true则过滤
    function filterHotContent_(filterKeyword, element){
        let cartTitle = element.querySelector('h2');

        if(cartTitle == null){
            console.log('filterHotContent_().cartTitle not found');
            return false;
        }

        // 视频全部过滤
        if(element.querySelector('.VideoAnswerPlayer') != null || element.querySelector('.ZVideoItem-player') != null){
            console.log(`过滤视频：${cartTitle.innerText}`);
            return true;
        }

        // 判断是否要过滤
        const filter_result = filterKeyword.filter(keyword => new RegExp(keyword.replaceAll("/","")).test(cartTitle.innerText));

        // 结果为包含过滤关键字数组
        if(Array.isArray(filter_result) && filter_result.length > 0){
            console.log(`关键字：${JSON.stringify(filter_result)}\n内容：${cartTitle.innerText}\n${element.querySelector('a').href}`);
            return true;
        }
    }


    // 监听导航改变
    (function(){
        function navgation_callback(mutationList, observer) {
            mutationList.forEach((mutation) => {
                switch(mutation.type) {
                    case 'childList':
                        if(mutation.addedNodes.length > 0){
                            filterHotContent(local_filter_keywords, getContainerElement());
                        }

                        // 注册添加监听
                        register_element_observer();
                        break;
                }
            });
        }

        let navgation_observer = new MutationObserver(navgation_callback);
        navgation_observer.observe(document.querySelector('#TopstoryContent'), { attributes: true, childList: true, subtree: false });
    }());


    // 监听动态添加
    function element_callbac(mutationList, observer) {
        mutationList.forEach((mutation) => {
            switch(mutation.type) {
                case 'childList':
                    if(mutation.addedNodes.length > 0){
                        filterHotContent(local_filter_keywords, mutation.addedNodes);
                    }
                    break;
            }
        });
    }

    let element_observer = new MutationObserver(element_callbac);

    function register_element_observer(){
        element_observer.disconnect();

        switch(window.location.href){
            case "https://www.zhihu.com/follow":
                element_observer.observe(
                    document.querySelector('#TopstoryContent > .ListShortcut > .Topstory-follow > div'),
                    { attributes: true, childList: true, subtree: false });
                break;

            case "https://www.zhihu.com/":
                element_observer.observe(
                    document.querySelector('#TopstoryContent > .ListShortcut > .Topstory-recommend > div'),
                    { attributes: true, childList: true, subtree: false });
                break;

            case "https://www.zhihu.com/hot":
                element_observer.observe(
                    document.querySelector('#TopstoryContent > .ListShortcut > .HotList > div'),
                    { attributes: true, childList: true, subtree: false });
                break;
        }
    }


    // init
    filterHotContent(local_filter_keywords, getContainerElement());
    register_element_observer();

})();