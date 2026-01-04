// ==UserScript==
// @name         成分查询-B站
// @namespace    YuriMaggot
// @version      1.5.0
// @description  这是一个查询B站用户成分的脚本
// @author       Light Yagami
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @icon         https://gss0.bdstatic.com/6LZ1dD3d1sgCo2Kml5_Y_D3/sys/portrait/item/tb.1.403ed6f0.KeS29MO38cMTCTAl7gU1Iw?t=1708414222
// @grant        GM_xmlhttpRequest
// @license      MPL
// @downloadURL https://update.greasyfork.org/scripts/494222/%E6%88%90%E5%88%86%E6%9F%A5%E8%AF%A2-B%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/494222/%E6%88%90%E5%88%86%E6%9F%A5%E8%AF%A2-B%E7%AB%99.meta.js
// ==/UserScript==

// 数据库
let data =
[
    {
        "uid": "",
        "count": 0,
        "tags":[
            ""
        ]
    }
];

// 用来搜索索引的数组
let uid_array = [""];

class Utils
{
    // 添加新节点
    static AddElement(target_element, class_name, text_content, style_text)
    {
        let new_element = document.createElement('div');
        new_element.className = class_name;
        new_element.textContent = text_content;
        new_element.style.cssText = style_text;

        // 如果当前节点是最后的那么连接到末尾否则插入下一个位置
        let parent = target_element.parentNode;
        if (parent.lastChild == target_element){
            parent.appendChild(new_element);
        }
        else{
            parent.insertBefore(new_element, target_element.nextSibling);
        }
    }
}

class Init
{
    // 初始化数据库的数据
    static InitJsonData()
    {
        GM_xmlhttpRequest(
        {
            method: 'GET',
            url: 'https://gitee.com/light-yagami/yuri-maggot/raw/master/Data.json',
            onload: function(response)
            {
                data = JSON.parse(response.responseText);
                uid_array = data.map(function(o) {
                    return o.uid;
                });
            }
        });
    }

    // 初始化 CSS 样式
    static InitCssStyle()
    {
        let style = document.createElement('style');
        document.head.appendChild(style);
        style.sheet.insertRule(`
        @keyframes gradient-animation
        {
            0%, 100% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
        }`, 0);
        style.sheet.insertRule(`
        .dynamic-gradient-text
        {
            background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
            background-size: 500% 500%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradient-animation 10s linear infinite;
        }`, 1);
    }
}

// 个人空间
class Space
{
    // 数据更新
    static Update()
    {
        // 获取到动态的列表
        let bili_dyn_list = document.querySelector("#page-dynamic > div.col-1 > div");
        if(bili_dyn_list)
        {
            for(let i = 0; i < bili_dyn_list.getElementsByClassName('bili-dyn-list__items')[0].getElementsByClassName('bili-dyn-list__item').length; i++)
            {
                // 循环每个动态
                let bili_dyn_list__item = bili_dyn_list.getElementsByClassName('bili-dyn-list__items')[0].getElementsByClassName('bili-dyn-list__item')[i];
                // bili_dyn_list.bili-dyn-list__items.bili-dyn-list__item[i].bili-dyn-item
                let bili_dyn_item = bili_dyn_list__item.getElementsByClassName('bili-dyn-item')[0];

                // 判断动态是否展开
                if(bili_dyn_item.getElementsByClassName('bili-dyn-item__panel').length)
                {
                    // 获得该动态的评论列表
                    // bili_dyn_item.bili-dyn-item__panel.bili-comment-container.bili-comment.comment-container.reply-warp.reply-list
                    let reply_list = bili_dyn_item.getElementsByClassName('bili-dyn-item__panel')[0].getElementsByClassName('bili-comment-container')[0].getElementsByClassName('bili-comment')[0].getElementsByClassName('comment-container')[0].getElementsByClassName('reply-warp')[0].getElementsByClassName('reply-list')[0];
                    for(let j = 0; j < reply_list.getElementsByClassName('reply-item').length; j++)
                    {
                        // 获取评论对象
                        let reply_item = reply_list.getElementsByClassName('reply-item')[j];
                        // reply-list[i].reply-item.root-reply-container.content-warp.user-info
                        let user_info = reply_item.getElementsByClassName('root-reply-container')[0].getElementsByClassName('content-warp')[0].getElementsByClassName('user-info')[0];
                        if(!user_info.getElementsByClassName('dynamic-gradient-text').length && !user_info.getElementsByClassName('normal-user').length)
                        {
                            let user_name = user_info.getElementsByClassName('user-name')[0];
                            // reply-list[i].reply-item.root-reply-container.content-warp.user-info.user-name
                            let user_info_index = uid_array.indexOf(user_name.getAttribute('data-user-id'));
                            if(user_info_index != -1)
                            {
                                user_name.style.color = 'red';
                                user_name.style.fontWeight = 'bold';
                                Utils.AddElement(user_info.getElementsByClassName('svg-icon')[0], 'dynamic-gradient-text', '『次数: ' + data[user_info_index].count + '』', 'font-weight: bold;');
                                for(let uii = 0; uii < data[user_info_index].tags.length; uii++){
                                    Utils.AddElement(user_name, 'dynamic-gradient-text', '『' + data[user_info_index].tags[uii] + '』', 'font-weight: bold;');
                                }
                            }
                            else
                            {
                                user_name.style.color = 'black';
                                user_name.style.fontWeight = 'bold';
                                Utils.AddElement(user_name, 'normal-user', '『路人』', 'color: grey; font-weight: bold;');
                            }
                        }
                        // 获取该评论对象的子评论列表
                        // reply-list[i].reply-item.sub-reply-container.sub-reply-list
                        let sub_reply_list = reply_item.getElementsByClassName('sub-reply-container')[0].getElementsByClassName('sub-reply-list')[0];
                        for(let k = 0; k < sub_reply_list.getElementsByClassName('sub-reply-item').length; k++)
                        {
                            // 获取子评论对象
                            let sub_reply_item = sub_reply_list.getElementsByClassName('sub-reply-item')[k];
                            // reply-list[i].reply-item.sub-reply-container.sub-reply-list.sub-reply-item[j].sub-user-info
                            let sub_user_info = sub_reply_item.getElementsByClassName('sub-user-info')[0];
                            if(!sub_user_info.getElementsByClassName('dynamic-gradient-text').length && !sub_user_info.getElementsByClassName('normal-user').length)
                            {
                                let sub_user_name = sub_user_info.getElementsByClassName('sub-user-name')[0];
                                // reply-list[i].reply-item.sub-reply-container.sub-reply-list.sub-reply-item[j].sub-user-info.sub-user-name
                                let sub_user_info_index = uid_array.indexOf(sub_user_name.getAttribute('data-user-id'));
                                if(sub_user_info_index != -1)
                                {
                                    sub_user_name.style.color = 'red';
                                    sub_user_name.style.fontWeight = 'bold';
                                    Utils.AddElement(sub_user_info.getElementsByClassName('svg-icon')[0], 'dynamic-gradient-text', '『次数: ' + data[sub_user_info_index].count + '』', 'font-weight: bold;');
                                    for(let suii = 0; suii < data[sub_user_info_index].tags.length; suii++){
                                        Utils.AddElement(sub_user_name, 'dynamic-gradient-text', '『' + data[sub_user_info_index].tags[suii] + '』', 'font-weight: bold;');
                                    }
                                }
                                else
                                {
                                    sub_user_name.style.color = 'black';
                                    sub_user_name.style.fontWeight = 'bold';
                                    Utils.AddElement(sub_user_name, 'normal-user', '『路人』', 'color: grey; font-weight: bold;');
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // 监视页面动态更新
    static PageListener()
    {
        let s_space = document.querySelector("#app > div.s-space");
        if(s_space)
        {
            s_space.addEventListener('mouseup', function()
            {
                setTimeout(function()
                {
                    if(document.getElementById('page-dynamic')){
                        Space.Update();
                    }
                }, 3500);
            });
        }
    }

    static Run()
    {
        Space.PageListener();
    }
}

// 视频
class Video
{
    // 数据更新
    static Update()
    {
        // 获得该视频的评论列表
        let reply_list = document.querySelector("#comment > div > div > div > div.reply-warp > div.reply-list");
        if(reply_list)
        {
            for(let i = 0; i < reply_list.getElementsByClassName('reply-item').length; i++)
            {
                // 获取评论对象
                let reply_item = reply_list.getElementsByClassName('reply-item')[i];
                // reply-list[i].reply-item.root-reply-container.content-warp.user-info
                let user_info = reply_item.getElementsByClassName('root-reply-container')[0].getElementsByClassName('content-warp')[0].getElementsByClassName('user-info')[0];
                if(!user_info.getElementsByClassName('dynamic-gradient-text').length && !user_info.getElementsByClassName('normal-user').length)
                {
                    let user_name = user_info.getElementsByClassName('user-name')[0];
                    // reply-list[i].reply-item.root-reply-container.content-warp.user-info.user-name
                    let user_info_index = uid_array.indexOf(user_name.getAttribute('data-user-id'));
                    if(user_info_index != -1)
                    {
                        user_name.style.color = 'red';
                        user_name.style.fontWeight = 'bold';
                        Utils.AddElement(user_info.getElementsByClassName('svg-icon')[0], 'dynamic-gradient-text', '『次数: ' + data[user_info_index].count + '』', 'font-weight: bold;');
                        for(let uii = 0; uii < data[user_info_index].tags.length; uii++){
                            Utils.AddElement(user_name, 'dynamic-gradient-text', '『' + data[user_info_index].tags[uii] + '』', 'font-weight: bold;');
                        }
                    }
                    else
                    {
                        user_name.style.color = 'black';
                        user_name.style.fontWeight = 'bold';
                        Utils.AddElement(user_name, 'normal-user', '『路人』', 'color: grey; font-weight: bold;');
                    }
                }
                // 获取评论对象的子评论列表
                // reply-list[i].reply-item.sub-reply-container.sub-reply-list
                let sub_reply_list = reply_item.getElementsByClassName('sub-reply-container')[0].getElementsByClassName('sub-reply-list')[0];
                for(let j = 0; j < sub_reply_list.getElementsByClassName('sub-reply-item').length; j++)
                {
                    // 获取子评论对象
                    let sub_reply_item = sub_reply_list.getElementsByClassName('sub-reply-item')[j];
                    // reply-list[i].reply-item.sub-reply-container.sub-reply-list.sub-reply-item[j].sub-user-info
                    let sub_user_info = sub_reply_item.getElementsByClassName('sub-user-info')[0];
                    if(!sub_user_info.getElementsByClassName('dynamic-gradient-text').length && !sub_user_info.getElementsByClassName('normal-user').length)
                    {
                        let sub_user_name = sub_user_info.getElementsByClassName('sub-user-name')[0];
                        // reply-list[i].reply-item.sub-reply-container.sub-reply-list.sub-reply-item[j].sub-user-info.sub-user-name
                        let sub_user_info_index = uid_array.indexOf(sub_user_name.getAttribute('data-user-id'));
                        if(sub_user_info_index != -1)
                        {
                            sub_user_name.style.color = 'red';
                            sub_user_name.style.fontWeight = 'bold';
                            Utils.AddElement(sub_user_info.getElementsByClassName('svg-icon')[0], 'dynamic-gradient-text', '『次数: ' + data[sub_user_info_index].count + '』', 'font-weight: bold;');
                            for(let suii = 0; suii < data[sub_user_info_index].tags.length; suii++){
                                Utils.AddElement(sub_user_name, 'dynamic-gradient-text', '『' + data[sub_user_info_index].tags[suii] + '』', 'font-weight: bold;');
                            }
                        }
                        else
                        {
                            sub_user_name.style.color = 'black';
                            sub_user_name.style.fontWeight = 'bold';
                            Utils.AddElement(sub_user_name, 'normal-user', '『路人』', 'color: grey; font-weight: bold;');
                        }
                    }
                }
            }
        }
    }

    // 页面监视器
    static PageListener()
    {
        // 评论列表
        let reply_list = document.querySelector("#comment > div > div > div > div.reply-warp > div.reply-list");
        if(reply_list)
        {
            // 监视评论列表是否更新
            let config = { childList: true, subtree: true };
            let observer = new MutationObserver(function(mutationsList)
            {
                for (let mutation of mutationsList)
                {
                    if (mutation.type == 'childList')
                    {
                        for (let node of mutation.addedNodes)
                        {
                            // 当翻页或者切到别的视频的时候 reply_list 会有子元素 reply-loading 产生
                            if (node && node.classList && node.classList.contains('reply-loading'))
                            {
                                setTimeout(function(){
                                    Video.Update();
                                }, 3500);
                            }
                        }
                    }
                }
            });
            observer.observe(reply_list, config);

            // 监视一些按钮的点击事件带来的更新
            reply_list.addEventListener('mouseup', function()
            {
                setTimeout(function(){
                    Video.Update();
                }, 3500);
            });
        }
    }

    static Run()
    {
        Video.Update();
        Video.PageListener();
    }
}

// 动态
class Dynamic
{
    // 数据更新
    static Update()
    {
        // 获取动态页面评论列表
        let reply_list = document.querySelector("#app > div.content > div.card > div.bili-tabs.dyn-tabs > div.bili-tabs__content > div:nth-child(1) > div > div > div > div > div.reply-warp > div.reply-list");
        if(reply_list)
        {
            for(let i = 0; i < reply_list.getElementsByClassName('reply-item').length; i++)
            {
                // 获取评论对象
                let reply_item = reply_list.getElementsByClassName('reply-item')[i];
                // reply-list[i].reply-item.root-reply-container.content-warp.user-info
                let user_info = reply_item.getElementsByClassName('root-reply-container')[0].getElementsByClassName('content-warp')[0].getElementsByClassName('user-info')[0];
                if(!user_info.getElementsByClassName('dynamic-gradient-text').length && !user_info.getElementsByClassName('normal-user').length)
                {
                    let user_name = user_info.getElementsByClassName('user-name')[0];
                    // reply-list[i].reply-item.root-reply-container.content-warp.user-info.user-name
                    let user_info_index = uid_array.indexOf(user_name.getAttribute('data-user-id'));
                    if(user_info_index != -1)
                    {
                        user_name.style.color = 'red';
                        user_name.style.fontWeight = 'bold';
                        Utils.AddElement(user_info.getElementsByClassName('svg-icon')[0], 'dynamic-gradient-text', '『次数: ' + data[user_info_index].count + '』', 'font-weight: bold;');
                        for(let uii = 0; uii < data[user_info_index].tags.length; uii++){
                            Utils.AddElement(user_name, 'dynamic-gradient-text', '『' + data[user_info_index].tags[uii] + '』', 'font-weight: bold;');
                        }
                    }
                    else
                    {
                        user_name.style.color = 'black';
                        user_name.style.fontWeight = 'bold';
                        Utils.AddElement(user_name, 'normal-user', '『路人』', 'color: grey; font-weight: bold;');
                    }
                }
                // 获取评论对象的子评论列表
                // reply-list[i].reply-item.sub-reply-container.sub-reply-list
                let sub_reply_list = reply_item.getElementsByClassName('sub-reply-container')[0].getElementsByClassName('sub-reply-list')[0];
                for(let j = 0; j < sub_reply_list.getElementsByClassName('sub-reply-item').length; j++)
                {
                    // 获取子评论对象
                    let sub_reply_item = sub_reply_list.getElementsByClassName('sub-reply-item')[j];
                    // reply-list[i].reply-item.sub-reply-container.sub-reply-list.sub-reply-item[j].sub-user-info
                    let sub_user_info = sub_reply_item.getElementsByClassName('sub-user-info')[0];
                    if(!sub_user_info.getElementsByClassName('dynamic-gradient-text').length && !sub_user_info.getElementsByClassName('normal-user').length)
                    {
                        let sub_user_name = sub_user_info.getElementsByClassName('sub-user-name')[0];
                        // reply-list[i].reply-item.sub-reply-container.sub-reply-list.sub-reply-item[j].sub-user-info.sub-user-name
                        let sub_user_info_index = uid_array.indexOf(sub_user_name.getAttribute('data-user-id'));
                        if(sub_user_info_index != -1)
                        {
                            sub_user_name.style.color = 'red';
                            sub_user_name.style.fontWeight = 'bold';
                            Utils.AddElement(sub_user_info.getElementsByClassName('svg-icon')[0], 'dynamic-gradient-text', '『次数: ' + data[sub_user_info_index].count + '』', 'font-weight: bold;');
                            for(let suii = 0; suii < data[sub_user_info_index].tags.length; suii++){
                                Utils.AddElement(sub_user_name, 'dynamic-gradient-text', '『' + data[sub_user_info_index].tags[suii] + '』', 'font-weight: bold;');
                            }
                        }
                        else
                        {
                            sub_user_name.style.color = 'black';
                            sub_user_name.style.fontWeight = 'bold';
                            Utils.AddElement(sub_user_name, 'normal-user', '『路人』', 'color: grey; font-weight: bold;');
                        }
                    }
                }
            }
        }
    }

    // 页面监视器
    static PageListener()
    {
        // 获取动态列表
        let bili_tabs = document.querySelector("#app > div.content > div.card > div.bili-tabs.dyn-tabs");
        if(bili_tabs)
        {
            // 先进行一次页面更新监视
            let reply_list = bili_tabs.querySelector("div.bili-tabs__content > div:nth-child(1) > div > div > div > div > div.reply-warp > div.reply-list");
            if(reply_list)
            {
                // 第一次加页面监视器的时候添加一个属性 后面用
                bili_tabs.getElementsByClassName('bili-tabs__header')[0].setAttribute('data-listener', 'true');

                // 监视评论列表是否更新
                let config = { childList: true, subtree: true };
                let observer = new MutationObserver(function(mutationsList)
                {
                    for (let mutation of mutationsList)
                    {
                        if (mutation.type == 'childList')
                        {
                            for (let node of mutation.addedNodes)
                            {
                                if (node && node.classList && node.classList.contains('reply-loading'))
                                {
                                    setTimeout(function(){
                                        Dynamic.Update();
                                    }, 3500);
                                }
                            }
                        }
                    }
                });
                observer.observe(reply_list, config);
            }

            // 监视一些按钮事件
            bili_tabs.getElementsByClassName('bili-tabs__header')[0].addEventListener('mouseup', function()
            {
                setTimeout(function()
                {
                    // 监视评论区页面是否可见 可见再给加上页面更新监视 因为从评论页面切到赞与转发再切回来页面元素会重新生成 导致第一次加上的监视器就没有了 顺便防止在评论页面的情况下点评论页面进行监视器状态判断
                    if(bili_tabs.getElementsByClassName('bili-tabs__content')[0].getElementsByClassName('bili-tab-pane')[0].style.display != 'none' && bili_tabs.getElementsByClassName('bili-tabs__header')[0].getAttribute('data-listener') != 'true')
                    {
                        reply_list = bili_tabs.querySelector("div.bili-tabs__content > div:nth-child(1) > div > div > div > div > div.reply-warp > div.reply-list");
                        if(reply_list)
                        {
                            // 监视评论列表是否更新
                            let config = { childList: true, subtree: true };
                            let observer = new MutationObserver(function(mutationsList)
                            {
                                for (let mutation of mutationsList)
                                {
                                    if (mutation.type == 'childList')
                                    {
                                        for (let node of mutation.addedNodes)
                                        {
                                            if (node && node.classList && node.classList.contains('reply-loading'))
                                            {
                                                setTimeout(function(){
                                                    Dynamic.Update();
                                                }, 3500);
                                            }
                                        }
                                    }
                                }
                            });
                            observer.observe(reply_list, config);
                        }
                        Dynamic.Update();
                        bili_tabs.getElementsByClassName('bili-tabs__header')[0].setAttribute('data-listener', 'true');
                    }
                    else if(bili_tabs.getElementsByClassName('bili-tabs__content')[0].getElementsByClassName('bili-tab-pane')[0].style.display == 'none'){
                        bili_tabs.getElementsByClassName('bili-tabs__header')[0].setAttribute('data-listener', 'false');
                    }
                }, 3500);
            });
            bili_tabs.getElementsByClassName('bili-tabs__content')[0].addEventListener('mouseup', function()
            {
                setTimeout(function()
                {
                    if(bili_tabs.getElementsByClassName('bili-tabs__content')[0].getElementsByClassName('bili-tab-pane')[0].style.display != 'none'){
                        Dynamic.Update();
                    }
                }, 3500);
            });
        }
    }

    static Run()
    {
        Dynamic.Update();
        Dynamic.PageListener();
    }
}

// 专栏
class Read
{
    // 数据更新
    static Update()
    {
        // 获取专栏评论列表
        let reply_list = document.querySelector("#comment-wrapper > div > div > div.article-comment > div > div > div.reply-warp > div.reply-list");
        if(reply_list)
        {
            for(let i = 0; i < reply_list.getElementsByClassName('reply-item').length; i++)
            {
                // 获取评论对象
                let reply_item = reply_list.getElementsByClassName('reply-item')[i];
                // reply-list[i].reply-item.root-reply-container.content-warp.user-info
                let user_info = reply_item.getElementsByClassName('root-reply-container')[0].getElementsByClassName('content-warp')[0].getElementsByClassName('user-info')[0];
                if(!user_info.getElementsByClassName('dynamic-gradient-text').length && !user_info.getElementsByClassName('normal-user').length)
                {
                    let user_name = user_info.getElementsByClassName('user-name')[0];
                    // reply-list[i].reply-item.root-reply-container.content-warp.user-info.user-name
                    let user_info_index = uid_array.indexOf(user_name.getAttribute('data-user-id'));
                    if(user_info_index != -1)
                    {
                        user_name.style.color = 'red';
                        user_name.style.fontWeight = 'bold';
                        Utils.AddElement(user_info.getElementsByClassName('svg-icon')[0], 'dynamic-gradient-text', '『次数: ' + data[user_info_index].count + '』', 'font-weight: bold;');
                        for(let uii = 0; uii < data[user_info_index].tags.length; uii++){
                            Utils.AddElement(user_name, 'dynamic-gradient-text', '『' + data[user_info_index].tags[uii] + '』', 'font-weight: bold;');
                        }
                    }
                    else
                    {
                        user_name.style.color = 'black';
                        user_name.style.fontWeight = 'bold';
                        Utils.AddElement(user_name, 'normal-user', '『路人』', 'color: grey; font-weight: bold;');
                    }
                }
                // 获取评论对象的子评论列表
                // reply-list[i].reply-item.sub-reply-container.sub-reply-list
                let sub_reply_list = reply_item.getElementsByClassName('sub-reply-container')[0].getElementsByClassName('sub-reply-list')[0];
                for(let j = 0; j < sub_reply_list.getElementsByClassName('sub-reply-item').length; j++)
                {
                    // 获取子评论对象
                    let sub_reply_item = sub_reply_list.getElementsByClassName('sub-reply-item')[j];
                    // reply-list[i].reply-item.sub-reply-container.sub-reply-list.sub-reply-item[j].sub-user-info
                    let sub_user_info = sub_reply_item.getElementsByClassName('sub-user-info')[0];
                    if(!sub_user_info.getElementsByClassName('dynamic-gradient-text').length && !sub_user_info.getElementsByClassName('normal-user').length)
                    {
                        let sub_user_name = sub_user_info.getElementsByClassName('sub-user-name')[0];
                        // reply-list[i].reply-item.sub-reply-container.sub-reply-list.sub-reply-item[j].sub-user-info.sub-user-name
                        let sub_user_info_index = uid_array.indexOf(sub_user_name.getAttribute('data-user-id'));
                        if(sub_user_info_index != -1)
                        {
                            sub_user_name.style.color = 'red';
                            sub_user_name.style.fontWeight = 'bold';
                            Utils.AddElement(sub_user_info.getElementsByClassName('svg-icon')[0], 'dynamic-gradient-text', '『次数: ' + data[sub_user_info_index].count + '』', 'font-weight: bold;');
                            for(let suii = 0; suii < data[sub_user_info_index].tags.length; suii++){
                                Utils.AddElement(sub_user_name, 'dynamic-gradient-text', '『' + data[sub_user_info_index].tags[suii] + '』', 'font-weight: bold;');
                            }
                        }
                        else
                        {
                            sub_user_name.style.color = 'black';
                            sub_user_name.style.fontWeight = 'bold';
                            Utils.AddElement(sub_user_name, 'normal-user', '『路人』', 'color: grey; font-weight: bold;');
                        }
                    }
                }
            }
        }
    }

    // 页面监视器
    static PageListener()
    {
        // 获取专栏评论列表
        let reply_list = document.querySelector("#comment-wrapper > div > div > div.article-comment > div > div > div.reply-warp > div.reply-list");
        if(reply_list)
        {
            // 监视评论列表是否更新
            let config = { childList: true, subtree: true };
            let observer = new MutationObserver(function(mutationsList)
            {
                for (let mutation of mutationsList)
                {
                    if (mutation.type == 'childList')
                    {
                        for (let node of mutation.addedNodes)
                        {
                            // 当页面更新的时候 reply_list 会有子元素 reply-loading 产生
                            if (node && node.classList && node.classList.contains('reply-loading'))
                            {
                                setTimeout(function(){
                                    Read.Update();
                                }, 3500);
                            }
                        }
                    }
                }
            });
            observer.observe(reply_list, config);

            // 监视一些按钮的点击事件带来的更新
            reply_list.addEventListener('mouseup', function()
            {
                setTimeout(function(){
                    Read.Update();
                }, 3500);
            });
        }
    }

    static Run()
    {
        Read.Update();
        Read.PageListener();
    }
}

(function()
{
    'use strict';

    // 初始化数据
    Init.InitJsonData();

    setTimeout(function()
    {
        // 初始化 CSS 样式
        Init.InitCssStyle();

        // 获取网页标题元素
        const title_element = document.querySelector('title');

        // 获取当前页面的 url
        let cur_url = window.location.href;
        if (cur_url.includes('space.bilibili.com'))
        {
            Space.Run();
            title_element.textContent = "个人空间-脚本加载成功";
        }
        else if (cur_url.includes('www.bilibili.com/video'))
        {
            Video.Run();
            title_element.textContent = "视频-脚本加载成功";
        }
        else if (cur_url.includes('t.bilibili.com'))
        {
            Dynamic.Run();
            title_element.textContent = "动态-脚本加载成功";
        }
        else if(cur_url.includes('www.bilibili.com/read'))
        {
            Read.Run();
            title_element.textContent = "专栏-脚本加载成功";
        }
    }, 5000);
})();