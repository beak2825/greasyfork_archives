// ==UserScript==
// @name         B站美化显示效果
// @namespace    http://tampermonkey.net/
// @version      1.0.9
// @description  修改的B站显示效果!
// @author       onble
// @match        https://www.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://search.bilibili.com/*
// @icon         https://static.thenounproject.com/png/3355755-200.png
// @grant        GM_addStyle
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504579/B%E7%AB%99%E7%BE%8E%E5%8C%96%E6%98%BE%E7%A4%BA%E6%95%88%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/504579/B%E7%AB%99%E7%BE%8E%E5%8C%96%E6%98%BE%E7%A4%BA%E6%95%88%E6%9E%9C.meta.js
// ==/UserScript==

// TODO:给添加style封装成缓存后统一添加的函数

// 控制参数
var check = true;

// 工具函数
function check_console(...msg) {
    if (check) {
        console.log(`--->${[...msg]}<---`);
    }
}
function clear_object(object) {
    // 清理需要被清理的对象

    if (object.other_css !== undefined) {
        GM_addStyle(`
        ${object.select} {
            display: none !important;
            ${object.other_css}
        }
        `);
        return;
    }
    GM_addStyle(`
    ${object.select} {
        display: none !important;
    }
    `);
}

function list_page_stretch_vodeo_choose_list() {
    // 为list页面进行列表选择适配
    // 适配目标案例1: https://www.bilibili.com/list/ml1337156501

    const video_list = document.querySelector(
        "#playlist-video-action-list-body"
    );
    if (!video_list) {
        check_console("没有找到视频列表");
        return;
    }
    check_console("找到了视频列表");
    //选中下面的推荐视频列表
    const recommend_list = document.querySelector(".recommend-list-container");
    // 获取recomend_list的开了position的父元素
    const top_bar_next_container = document.querySelector(
        ".playlist-container"
    );
    // 获取当前视频列表盒子本身的元素
    const video_list_box = document.querySelector(
        "#playlist-video-action-list-body"
    );
    let video_list_box_height = parseInt(video_list_box.style.height);
    let limit_count = 10;
    function change_height_by_sure_height(height) {
        // 计算可扩展高度
        // 可扩展高度 = 屏幕的高度 - 下面推荐列表的高度位置 - 顶部横栏的高度 + 需要的高度 + 推荐列表的上外边距
        // 这个顶部横栏是最上面的，带有搜索框的固定在最上面的横栏
        let expandable_height =
            window.innerHeight -
            recommend_list.offsetTop -
            top_bar_next_container.offsetTop +
            height +
            22;
        const need_height = parseInt(
            document.querySelector(".action-list-inner").style.height
        );
        if (need_height && expandable_height > need_height) {
            expandable_height = need_height;
        }
        check_console(
            `可扩展高度${expandable_height} = 屏幕的高度${window.innerHeight} - 下面推荐列表的高度位置${recommend_list.offsetTop} - 顶部横栏的高度${top_bar_next_container.offsetTop} + 需要的高度${height} + 推荐列表的上外边距 22
            需要高度:${need_height}
            `
        );
        // 如果需要高度还没加载进来，下面需要再多次调用
        if (window.isNaN(need_height)) {
            check_console("列表需求高度还未确定");
            // TODO:如何再次动态修改列表的高度
        }
        // TODO:尝试更改高度时候使用平滑的增长效果
        GM_addStyle(`
        div#playlist-video-action-list{
                height: ${expandable_height}px !important;
                max-height: none !important;
        }
        #playlist-video-action-list-body{
                max-height: none !important;
        }`);
    }
    if (window.isNaN(video_list_box_height)) {
        check_console("这是一个找不到列表盒子高度的情况");
        // 下面就是循环去找盒子的高度
        const timer = setInterval(function () {
            video_list_box_height = parseInt(video_list_box.offsetHeight);
            if (!video_list_box_height) {
                limit_count--;
                if (limit_count < 0) {
                    clearInterval(timer);
                    check_console("循环检测次数用完，效果未生效");
                }
                return;
            } else {
                clearInterval(timer);
                check_console(
                    `剩余${limit_count}次，offset=${video_list_box_height}`
                );
                change_height_by_sure_height(video_list_box_height);
            }
        }, 1000);
    } else {
        check_console("这是能够找到列表盒子高度的情况");
        // 适配目标案例2： https://www.bilibili.com/video/BV1s64y187Vh
        change_height_by_sure_height(video_list_box_height);
    }
}

function stretch_collection_vodeo_list() {
    // 伸延合集
    // 适配目标案例1: https://www.bilibili.com/video/BV1jT4y117Tn/
    // 适配目标案例2: https://www.bilibili.com/video/BV1s64y187Vh
    // 适配目标案例3: 列表需求长度小于可扩展长度 https://www.bilibili.com/video/BV12T411J7ML/
    // 适配目标案例4: 列表需求长度小于可扩展长度 https://www.bilibili.com/video/BV1jD4y1y78P/
    // 这代码写的好乱--

    const video_list = document.querySelector("div.video-sections-item");
    if (!video_list) {
        check_console("没有找到合集");
        return;
    }
    check_console("找到了合集");
    //选中下面的推荐视频列表
    const recommend_list = document.querySelector("#reco_list");
    // 获取recomend_list的开了position的父元素
    const top_bar_next_container = document.querySelector(
        ".video-container-v1"
    );
    // 获取当前视频列表盒子本身的元素
    const video_list_box = document.querySelector(
        "div.video-sections-content-list"
    );
    let video_list_box_height = parseInt(video_list_box.style.height);
    let limit_count = 10;
    function change_height_by_sure_height(height) {
        // 计算可扩展高度
        // 可扩展高度 = 屏幕的高度 - 下面推荐列表的高度位置 - 顶部横栏的高度 + 需要的高度
        // 这个顶部横栏是最上面的，带有搜索框的固定在最上面的横栏
        let expandable_height =
            window.innerHeight -
            recommend_list.offsetTop -
            top_bar_next_container.offsetTop +
            height;
        let need_height = parseInt(
            document.querySelector("div.video-section-list").style.height
        );
        if (need_height && expandable_height > need_height) {
            expandable_height = need_height;
        }
        check_console(
            `可扩展高度${expandable_height} = 屏幕的高度${window.innerHeight} - 下面推荐列表的高度位置${recommend_list.offsetTop} - 顶部横栏的高度${top_bar_next_container.offsetTop} + 需要的高度${height}
            需要高度:${need_height}
            `
        );
        // 如果需要高度还没加载进来，下面需要再多次调用
        if (window.isNaN(need_height) && limit_count > 0) {
            check_console("列表需求高度还未确定");
            // TODO:如何再次动态修改列表的高度
            // 下面就是循环去找需求的高度
            const timer = setInterval(function () {
                need_height = parseInt(
                    document.querySelector("div.video-section-list").style
                        .height
                );
                if (!need_height) {
                    limit_count--;
                    if (limit_count < 0) {
                        clearInterval(timer);
                        check_console("循环检测次数用完，效果未生效");
                    }
                    return;
                } else {
                    clearInterval(timer);
                    check_console(
                        `剩余${limit_count}次，需求高度=${need_height}`
                    );
                    change_height_by_sure_height(height);
                }
            }, 1000);
        } else {
            // TODO:尝试更改高度时候使用平滑的增长效果
            GM_addStyle(`
        div.video-sections-content-list{
                height: ${expandable_height}px !important;
                max-height: none !important;
        }`);
        }
    }
    if (window.isNaN(video_list_box_height)) {
        check_console("这是一个找不到列表盒子高度的情况");
        // 下面就是循环去找盒子的高度
        const timer = setInterval(function () {
            video_list_box_height = parseInt(video_list_box.offsetHeight);
            if (!video_list_box_height) {
                limit_count--;
                if (limit_count < 0) {
                    clearInterval(timer);
                    check_console("循环检测次数用完，效果未生效");
                }
                return;
            } else {
                clearInterval(timer);
                check_console(
                    `剩余${limit_count}次，offset=${video_list_box_height}`
                );
                change_height_by_sure_height(video_list_box_height);
            }
        }, 1000);
    } else {
        check_console("这是能够找到列表盒子高度的情况");
        // 适配目标案例2： https://www.bilibili.com/video/BV1s64y187Vh
        change_height_by_sure_height(video_list_box_height);
    }
}
function stretch_vodeo_choose_list() {
    // 伸展视频选集列表(带图片的列表)

    const video_list = document.querySelector(".list-box");
    if (!video_list) {
        check_console("没有找到视频选集");
        stretch_collection_vodeo_list();
        return;
    }
    check_console("找到了视频选集");
    //选中下面的推荐视频列表
    const recommend_list = document.querySelector("#reco_list");
    // 查找需求的最大高度
    const need_height = video_list.scrollHeight;
    // 计算可扩展高度
    let expandable_height = window.innerHeight - recommend_list.offsetTop + 340; // TODO: 340是推测的数据，需要再验证
    if (expandable_height > need_height) {
        expandable_height = need_height; // 如果可以扩展的空间大于需求，则根据需求大小进行扩展
    }
    GM_addStyle(`
        .cur-list>ul{
                height: ${expandable_height}px !important;
                max-height: none !important;
        }`);
}
function stretch_collection() {
    // 这个函数的作用是控制视频合集列表的的高度，列表数量多时候，使列表高度的底部到屏幕底端，少的时候根据列表数量弹性增长

    //选中选集列表
    const collection_list = document.querySelector("div.cur-list");
    if (!collection_list) {
        //这一页没有列表元素
        check_console("这一页没有列表元素");
        // 此时找不到合集列表，找找有没有视频选集
        stretch_vodeo_choose_list();
        return;
    }
    check_console("找到了视频列表元素");
    // 主要对 https://www.bilibili.com/video/BV17z4y1X7UZ 这样的页面进行适配
    // 选中下面的推荐视频列表
    const recommend_list = document.querySelector("#reco_list");
    // 计算可扩展高度
    let expandable_height =
        window.innerHeight -
        recommend_list.offsetTop +
        parseInt(collection_list.style.height);
    if (window.isNaN(expandable_height)) {
        expandable_height = window.innerHeight - recommend_list.offsetTop + 285;
        check_console("行内样式没有写height,所以按照285赋值");
    }
    //下面是对合集较少的时候进行处理
    // 有个常数6是推测的
    const list_actual_height =
        document.querySelector("ul.list-box").scrollHeight + 6;
    if (expandable_height > list_actual_height) {
        expandable_height = list_actual_height;
    }
    GM_addStyle(`
    div.cur-list{
        height: ${expandable_height}px !important;
        max-height: none !important;
    }
    `);
}
function stretch_picture_video_list() {
    // 这个函数的作用是控制带图片的个人播放列表的显示高度

    // 计算所需要的高度
    // TODO:计算高度真费劲=-=
    // 将最大限制移除
    //         height: ${expandable_height}px !important;
    GM_addStyle(`
    #playlist-video-action-list{

        max-height: none !important;
    }
    #playlist-video-action-list-body{
        max-height: none !important;
    }
    `);
}
function stop_single_page_continuously_play() {
    // 这个函数的作用是停止单视频的自动连播，这样不影响合集视频的自动连播

    // 监听视频播放完毕
    let elevideo = document.querySelector("video");

    if (elevideo === null) {
        check_console("没有找到停止连播的按钮的盒子video");
        elevideo = document.querySelector("bwp-video");
        if (elevideo === null) {
            // 适配目标： https://www.bilibili.com/video/BV1CK411377T/

            check_console("也没有找到停止连播的按钮的盒子bwp-video");
            return;
        }
    }
    elevideo.addEventListener("ended", function () {
        let cancel_continuously_play_button = document.querySelector(
            "div.bpx-player-ending-related-item-cancel"
        );
        if (!cancel_continuously_play_button) {
            setTimeout(() => {
                cancel_continuously_play_button = document.querySelector(
                    "div.bpx-player-ending-related-item-cancel"
                );
                if (!cancel_continuously_play_button) {
                    check_console("没有找到停止连播的按钮");
                    const continue_button = document.querySelector(
                        "span.switch-button.on"
                    );
                    if (continue_button) {
                        setTimeout(() => {
                            stop_single_page_continuously_play();
                        }, 2000);
                    }
                    return;
                }
                cancel_continuously_play_button.click();
            }, 100);
        } else {
            cancel_continuously_play_button.click();
        }
    });
}
function del_video_page_special_card() {
    // 这个函数用来去除在视频页面的广告

    //TODO:需要将封禁功能进一步提取封装，单独提取各个广告的选择器，然后使用一个函数专门清除元素
    // 右下角的广告应该也是和Vue相关联，所以使用样式进行禁止显示
    // 依次为
    // 右下角视频推荐第一个
    // 右下角视频推荐第一个小的
    // 右下角推荐视频的后面大广告
    // 右边栏最后的直播
    // 弹幕下面的小广告
    // 弹幕下面的新增加的小广告
    // 弹幕下面的大广告
    // 2023/2/14 维护 右边栏最后的直播
    GM_addStyle(`
    .video-page-special-card {
        display: none;
    }
    .video-page-special-card-small{
        display: none;
    }
    #right-bottom-banner {
        display: none;
    }
    #live_recommand_report {
        display: none;
    }
    #slide_ad {
        display: none;
    }
    .video-ad-creative-card{
        display: none;
    }
    .ad-report{
        display: none !important;
    }
    .pop-live-small-mode{
        display: none;
    }
    `);
    const adv_object = [
        {
            select: "div.reply-notice",
            name: "评论区上面的黄色推广栏，例如：凡人修仙传热播中",
        },
    ];
    adv_object.forEach((element) => {
        clear_object(element);
    });
}
function clean_top_nav() {
    // 控制此函数只执行一次
    // if (document.once_clean_top_nav) {
    //     return;
    // } else {
    //     document.once_clean_top_nav = true;
    // }
    // 清理顶部导航栏

    // 因为顶部导航栏的一些功能不常用，所以进行清理
    // 首先清理用不到的垃圾入口
    GM_addStyle(`
    .left-entry>li:not(:nth-child(1)) {
        display: none;
    }
    `);
    // 然后清理搜索框
    GM_addStyle(`
    #nav-searchform>div.nav-search-content>input::placeholder {
        color: rgba(0,0,0,0);
    }
    `);
    // 清理搜索框的placeholder
    // GM_addStyle(`
    //     #nav-searchform>div.nav-search-content>input {
    //         pointer-events: none;
    //     }
    //     `);
    // TODO: 应该尝试如何抓取异步加入的搜索框
    /* // 增强修改搜索框
    // 参考https://www.bilibili.com/video/BV1gZ4y1u7Z1
    // 执行状态：无效，需要动态绑定
    let clear_watcher_max_count = 5;
    let clear_watcher = setInterval(() => {
        if (clear_watcher_max_count < 0) {
            clearInterval(clear_watcher);
        }
        clear_watcher_max_count--;
        // 获取输入框
        let input_box = document.querySelector(".nav-search-input");
        input_box.setAttribute("placeholder", "");
        console.log("im done");
    }, 100); */
    // 清理搜素框中的热搜
    GM_addStyle(`
    .trending {
        display: none;
    }
    `);
    // 清理右边的大会员
    GM_addStyle(`
    .right-entry>li:nth-child(2) {
        display: none;
    }
    `);

    // 清理已经是大会员的人的会员入口
    GM_addStyle(`
    .right-entry a[href='//account.bilibili.com/big'] {
        display: none;
    }
    `);

    // 清理创作中心与投稿
    GM_addStyle(`
    .right-entry-item {
        display: none  !important;
    }
    `);
    //清除小红点
    GM_addStyle(`
    div.red-num--dynamic {
        display: none;
    }
    `);
    //移动动态的详情往左，防止显示不全
    GM_addStyle(`
    a[href="//t.bilibili.com/"]+div.is-bottom {
        margin-left: -40px !important;
    }
    `);
    //移动收藏的详情往左，防止显示不全
    GM_addStyle(`
    #biliMainHeader > div > div > ul.right-entry > li:nth-child(5) > div.v-popover.is-bottom,
    a[href*="space"]+div.is-bottom {
        margin-left: -170px !important;
    }
    `);
    //移动历史的详情往左，防止显示不全
    GM_addStyle(`
    a[href*="history"]+div.is-bottom {
        margin-left: -138px !important;
    }
    `);
    // 更改动态和历史详情页的滑块宽度
    GM_addStyle(`
    .history-panel-popover .header-tabs-panel__content::-webkit-scrollbar, .dynamic-panel-popover .header-tabs-panel__content::-webkit-scrollbar {
        width: 7px !important;
    }
    `);
    // 更改收藏详情页的滑块宽度
    GM_addStyle(`
    .favorite-panel-popover__content .content-scroll::-webkit-scrollbar, .favorite-panel-popover__nav::-webkit-scrollbar {
        width: 7px !important;
    }
    `);
    // 清理头像子菜单里面的大会员购买广告
    GM_addStyle(`
    .vip-entry-containter {
        display: none !important;
    }
    `);
}
function display_bottom_fixed_comment() {
    // 隐藏下面粘性定位在下面的发表评论功能

    GM_addStyle(`
    div.fixed-reply-box {
        display: none;
    }
    `);
}
function display_right_bottom_customer_service() {
    // 隐藏下面迷你播放右边的客服入口

    GM_addStyle(`
    .nav-menu>a:nth-child(2) {
        display: none;
    }
    `);

    // 2023年3月10日更新dom结构
    GM_addStyle(`
    a[title="帮助反馈"] {
        display: none !important;
    }
    `);
}
function video_box_add_box_shadow() {
    // 给播放器和下面的控制弹幕盒子加一个重阴影，将将两者关联起来

    GM_addStyle(`
    div#bilibili-player {
        box-shadow: 2px -1px 10px 4px rgb(150 150 150 / 50%);
    }
    `);
}
function display_charge_button() {
    // 隐藏充电按钮

    GM_addStyle(`
    div[report-id="charge"] {
        display: none !important;
    }
    `);

    // 新的充电按钮
    GM_addStyle(`
    .new-charge-btn {
        display: none !important;
    }
    `);

    // 23-7-5新的充电按钮
    GM_addStyle(`
    .following-charge-btn,.old-charge-btn {
        display: none !important;
    }
    `);
}
function display_copyright_span() {
    // 隐藏视频窗口上的版权提示文字

    GM_addStyle(`
    span.copyright {
        display: none !important;
    }
    `);
}
function widen_list_scrollbar_width(width = 7) {
    // 拓宽右边列表右侧的滑动块的宽度

    GM_addStyle(`
    div.cur-list::-webkit-scrollbar {
        width: ${width}px;
    }
    `);
    // 下面给合集类的视频进行适配
    // https://www.bilibili.com/video/BV1Mb4y1p74R/
    GM_addStyle(`
    div.video-sections-content-list::-webkit-scrollbar {
        width: ${width}px;
    }
    `);
    // 下面给自己列表的合集类的视频进行适配
    // https://www.bilibili.com/list/ml1611399001
    GM_addStyle(`
    #playlist-video-action-list::-webkit-scrollbar {
        width: ${width}px;
    }
    `);
}
function display_share_new_box() {
    // 隐藏当鼠标hover在分享按钮上出现的新box

    GM_addStyle(`
    div.share_dropdown {
        display: none;
    }
    `);

    GM_addStyle(`
    div.video-share-dropdown {
        display: none!important;
    }
    `);

    // 隐藏外面的白框和阴影
    GM_addStyle(`
    .van-popover.video-share-popover {
        display: none!important;
    }
    `);
}
function display_send_info_to_up_button() {
    // 隐藏给up发消息的按钮
    // 维护时间 2023/2/14

    GM_addStyle(`
    a.up-info_right_message {
        display: none;
    }
    `);

    // 适配个人列表
    // 目标案例:https://www.bilibili.com/list/ml1611399001
    GM_addStyle(`
    a.send-msg {
        display: none;
    }
    `);
}
function change_video_below_toolbar() {
    // TODO:这个函数的功能需要等待vue配合，该函数暂不可用
    // TODO:尝试将这些代码进行模块化打包
    // toolbar-right-complaint
    GM_addStyle(`
    .toolbar-right-complaint {
        display: none;
    }
    `);
    // 更改视频下面的工具栏的显示布局
    return;

    // 将稿件投诉与记笔记移动到more栏目下
    // 获取ul对象
    const box = document.querySelector("div.toolbar-right");
    box.addEventListener("mouseover", function create_li(event) {
        const ul_more = document.querySelector("ul.more_dropdown");
        if (ul_more == null) {
            // ul还没有被创建,无法找到
            return;
        }
        // 创建记笔记对象
        const take_notes = document.createElement("li");
        take_notes.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.75 10C6.75 9.58579 7.08579 9.25 7.5 9.25H16.5C16.9142 9.25 17.25 9.58579 17.25 10C17.25 10.4142 16.9142 10.75 16.5 10.75H7.5C7.08579 10.75 6.75 10.4142 6.75 10Z"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.75 14C6.75 13.5858 7.08579 13.25 7.5 13.25H13C13.4142 13.25 13.75 13.5858 13.75 14C13.75 14.4142 13.4142 14.75 13 14.75H7.5C7.08579 14.75 6.75 14.4142 6.75 14Z"></path>
            <path d="M12 5.25C9.48998 5.25 7.29811 5.3777 5.75109 5.50315C4.79223 5.58091 4.05407 6.31053 3.96899 7.25687C3.85555 8.51874 3.75 10.1822 3.75 12C3.75 13.8178 3.85555 15.4813 3.96899 16.7431C4.05408 17.6895 4.79214 18.4191 5.75095 18.4968C7.17292 18.6122 9.14013 18.7294 11.3987 18.7476C11.951 18.752 12.3951 19.2033 12.3906 19.7556C12.3862 20.3079 11.9349 20.752 11.3826 20.7475C9.06584 20.7289 7.04905 20.6087 5.58929 20.4903C3.67182 20.3348 2.15034 18.8499 1.97703 16.9222C1.8597 15.6172 1.75 13.892 1.75 12C1.75 10.108 1.8597 8.38283 1.97703 7.07779C2.15034 5.15 3.67203 3.66518 5.58944 3.50969C7.17721 3.38094 9.42438 3.25 12 3.25C14.5759 3.25 16.8232 3.38096 18.411 3.50973C20.3281 3.6652 21.8497 5.14946 22.0231 7.07716C22.1127 8.07392 22.1977 9.31512 22.233 10.6888C22.2471 11.2409 21.811 11.6999 21.2589 11.7141C20.7068 11.7282 20.2478 11.2921 20.2336 10.74C20.1997 9.41683 20.1177 8.21901 20.0311 7.25626C19.946 6.31026 19.2081 5.58094 18.2494 5.50319C16.7023 5.37772 14.5103 5.25 12 5.25Z" fill-rule="evenodd" clip-rule="evenodd"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.2557 13.3102C19.0368 12.5292 20.3031 12.5292 21.0841 13.3102L22.4983 14.7244C23.2794 15.5055 23.2794 16.7718 22.4983 17.5528L18.5486 21.5026C18.1735 21.8777 17.6648 22.0884 17.1344 22.0884L15.0702 22.0884C14.3246 22.0884 13.7202 21.484 13.7202 20.7384V18.6742C13.7202 18.1437 13.9309 17.635 14.306 17.26L18.2557 13.3102ZM21.0841 16.1386L19.6699 14.7244L15.7202 18.6742L15.7202 20.0884L17.1344 20.0884L21.0841 16.1386Z"></path>
        </svg>记笔记
        `;
        take_notes.classList.add("note-btn");
        take_notes.classList.add("note-btn__blue");
        // 给记笔记增加点击事件
        take_notes.addEventListener("click", function () {
            // 更改笔记盒子的display
            // 获取笔记的盒子
            // 这个直接改样式的方法行不通
            // const write_notes_box = document.querySelector("div.bili-note");
            // write_notes_box.style.display = "";
        });
        ul_more.appendChild(take_notes);
        // 创建li对象
        const li = document.createElement("li");
        li.innerHTML = `稿件投诉`;
        ul_more.appendChild(li);
        // 移除增加元素的事件，防止重复增加事件
        box.removeEventListener("mouseover", create_li);
        document.querySelector("div.note-btn.note-btn__blue");
    });
}
function display_vote_window() {
    // 隐藏视频中的投票框

    GM_addStyle(`
    div.bili-vote {
        display: none;
    }
    `);
}
function display_ad_window() {
    // 隐藏视频中的广告推广框

    GM_addStyle(`
    div.bpx-player-skipcard {
        display: none;
    }
    `);
}
function display_three_consecutive_window() {
    // 隐藏视频中的三连窗口,真讨厌,有什么毛病吧
    GM_addStyle(`
    div.bili-guide-all {
        display: none!important;
    }
    `);
    GM_addStyle(`
    div.bpx-player-cmd-dm-inside {
        display: none!important;
    }
    `);
}
function video_page() {
    // 在video页面进行的操作
    // 适配案例 https://www.bilibili.com/video/BV16a411d72j/
    // 不适配的案例 https://www.bilibili.com/video/BV1QP4y1x7ro/

    clean_top_nav();
    del_video_page_special_card();
    // 因为上面的清理广告函数会影响右边栏目的高度，所以要注意这个函数与stretch_collection函数的先后顺序

    display_charge_button();
    display_bottom_fixed_comment();
    display_right_bottom_customer_service();
    widen_list_scrollbar_width();
    video_box_add_box_shadow();
    display_share_new_box();
    display_send_info_to_up_button();
    display_vote_window();
    display_ad_window();
    display_copyright_span();
    display_three_consecutive_window();
    const oldOnload = window.onload;
    window.onload = function () {
        // 这里面放晚加载的函数
        if (oldOnload) {
            oldOnload();
        }

        stretch_collection();
        change_video_below_toolbar();
        stop_single_page_continuously_play();
    };
}
function medialist_page() {
    // 在medialist页面进行的操作
    // 适配案例 https://www.bilibili.com/medialist/play/1712395

    // 清理最上面的导航栏
    const need_clear_objects = [
        {
            select: "ul.nav-link-ul>li:not(:nth-child(1))",
            name: "顶部左边番剧直播等入口",
        },
        {
            select: "form#nav_searchform>input::placeholder",
            name: "搜索栏的默认提示文字",
            other_css: "color: rgba(0,0,0,0);",
        },
        {
            select: "div.trending",
            name: "搜索提示框内的热搜",
        },
        {
            select: "div.item div.num",
            name: "动态的红点",
        },
        {
            select: "div.user-con>div.item:nth-child(2)",
            name: "大会员入口",
        },
        {
            select: "div.user-con>div.item:nth-child(7)",
            name: "创作中心入口",
        },
        {
            select: "div.nav-user-center>div:last-child",
            name: "投稿按钮",
        },
        {
            select: "div.comment-send-lite",
            name: "底下粘性固定在最下方的发表评论",
        },
        {
            select: "div.share-box",
            name: "当鼠标hover在分享按钮上出现的新box",
        },
    ];
    need_clear_objects.forEach((Element) => {
        clear_object(Element);
    });
    del_video_page_special_card();
    // 因为上面的清理广告函数会影响右边栏目的高度，所以要注意这个函数与stretch_collection函数的先后顺序

    display_charge_button();
    video_box_add_box_shadow();
}
function space_page() {
    // 空间页面进行的操作
    // 适配目标案例 https://space.bilibili.com/157023201

    // 清理最上面的导航栏
    const need_clear_objects = [
        {
            select: "ul.nav-link-ul>li:not(:nth-child(1))",
            name: "顶部左边番剧直播等入口",
        },
        {
            select: "form#nav_searchform>input::placeholder",
            name: "搜索栏的默认提示文字",
            other_css: "color: rgba(0,0,0,0);",
        },
        {
            select: "div.trending",
            name: "搜索提示框内的热搜",
        },
        {
            select: "div.item div.num",
            name: "动态的红点",
        },
        {
            select: "div.user-con>div.item:nth-child(2)",
            name: "大会员入口",
        },
        {
            select: "div.user-con>div.item:nth-child(7)",
            name: "创作中心入口",
        },
        {
            select: "div.nav-user-center>div:last-child",
            name: "投稿按钮",
        },
        {
            select: "ul.left-entry>li:not(:nth-child(1))",
            name: "22-10-27更新 顶部左边番剧直播等入口",
        },
        {
            select: "form#nav-searchform>div>input::placeholder",
            name: "22-10-27更新 搜索栏的默认提示文字",
            other_css: "color: rgba(0,0,0,0);",
        },
        {
            select: "ul.right-entry>li.v-popover-wrap:nth-child(2)",
            name: "22-10-27更新 大会员入口",
        },
        {
            select: "ul.right-entry>li:nth-child(7)",
            name: "22-10-27更新 创作中心入口",
        },
        {
            select: "ul.right-entry>li:last-child",
            name: "22-10-27更新 投稿按钮",
        },
        {
            select: "ul.right-entry>li div.red-num--dynamic",
            name: "22-10-27更新 动态的红点",
        },
        {
            select: ".right-entry a[href='//account.bilibili.com/big']",
            name: "23-7-5更新 大会员入口",
        },
        {
            select: ".vip-entry-containter",
            name: "头像子菜单里面的大会员购买广告",
        },
    ];
    need_clear_objects.forEach((Element) => {
        clear_object(Element);
    });

    //移动动态的详情往左，防止显示不全
    GM_addStyle(`
    a[href="//t.bilibili.com/"]+div.is-bottom {
        margin-left: -40px !important;
    }
    `);
    //移动收藏的详情往左，防止显示不全
    GM_addStyle(`
    #biliMainHeader > div > div > ul.right-entry > li:nth-child(5) > div.v-popover.is-bottom,
    a[href*="space"]+div.is-bottom {
        margin-left: -170px !important;
    }
    `);
    //移动历史的详情往左，防止显示不全
    GM_addStyle(`
    a[href*="history"]+div.is-bottom {
        margin-left: -138px !important;
    }
    `);
    // 更改动态和历史详情页的滑块宽度
    GM_addStyle(`
    .history-panel-popover .header-tabs-panel__content::-webkit-scrollbar, .dynamic-panel-popover .header-tabs-panel__content::-webkit-scrollbar {
        width: 7px !important;
    }
    `);
    // 更改收藏详情页的滑块宽度
    GM_addStyle(`
    .favorite-panel-popover__content .content-scroll::-webkit-scrollbar, .favorite-panel-popover__nav::-webkit-scrollbar {
        width: 7px !important;
    }
    `);

    const oldOnload = window.onload;
    window.onload = function () {
        // 这里面放晚加载的函数
        if (oldOnload) {
            oldOnload();
        }
    };
}
function list_page() {
    // 个人播放列表的适配
    // 适配目标案例 https://www.bilibili.com/list/ml1611399001

    clean_top_nav();
    del_video_page_special_card();
    // 因为上面的清理广告函数会影响右边栏目的高度，所以要注意这个函数与stretch_collection函数的先后顺序

    display_bottom_fixed_comment();
    display_right_bottom_customer_service();
    display_send_info_to_up_button();
    widen_list_scrollbar_width();
    video_box_add_box_shadow();
    //stretch_picture_video_list();
    // 清理不需要的功能
    const need_clear_objects = [
        {
            select: ".new-charge-btn",
            name: "充电按钮",
        },
        {
            select: "div.video-share-dropdown",
            name: "分享的大框",
        },
        {
            select: ".following-charge-btn",
            name: "已经关注的充电按钮",
        },
    ];
    need_clear_objects.forEach((Element) => {
        clear_object(Element);
    });

    const oldOnload = window.onload;
    window.onload = function () {
        // 这里面放晚加载的函数
        if (oldOnload) {
            oldOnload();
        }

        list_page_stretch_vodeo_choose_list();
    };
}
function history_page() {
    // 个人历史记录页面的适配
    // 适配目标案例 https://www.bilibili.com/account/history

    clean_top_nav();
}
function bangumi_page() {
    clean_top_nav();
    display_bottom_fixed_comment();
    display_right_bottom_customer_service();
    video_box_add_box_shadow();
    // 清理不需要的功能
    const need_clear_objects = [
        {
            select: ".vipPaybar_container__GsBut",
            name: "查看会员全部权利按钮",
        },
        {
            select: "div.Share_share__mQAWY",
            name: "分享的大框",
        },
        {
            select: ".navTools_floatNavExp__fCiyO",
            name: "右侧的新旧版本切换",
        },
        {
            select: ".toolbar>span:nth-child(4)",
            name: "使用手机观看",
        },
        {
            select: "#eplist_module",
            name: "周边视频",
        },
        {
            select: "#ogv-weslie-media-info-review",
            name: "打分组件",
        },
    ];
    need_clear_objects.forEach((Element) => {
        clear_object(Element);
    });
}
(function () {
    "use strict";

    if (location.pathname.indexOf("video") != -1) {
        video_page();
    }
    if (location.host.indexOf("space") != -1) {
        space_page();
    }
    if (location.pathname.indexOf("medialist") != -1) {
        medialist_page();
    }
    if (location.pathname.indexOf("list") != -1) {
        list_page();
    }
    if (location.pathname.indexOf("history") != -1) {
        history_page();
    }
    if (location.host.indexOf("search") != -1) {
        clean_top_nav();
    }
    if (location.pathname.indexOf("bangumi") != -1) {
        bangumi_page();
    }
})();
