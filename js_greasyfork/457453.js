// ==UserScript==
// @name         头条助手（数据）
// @namespace    http://tampermonkey.net/
// @version      0.6.5
// @description  头条助手（数据分析）
// @author       myaijarvis
// @run-at       document-end
// @match        https://www.toutiao.com/c/user/token/*
// @match        https://www.toutiao.com/w/*
// @match        https://www.toutiao.com/article/*
// @match        https://www.toutiao.com/video/*
// @match        https://www.ixigua.com/*
// @match        https://mp.toutiao.com/profile_v3_public/public/activity/*
// @match        https://api.toutiaoapi.com/magic/eco/runtime/release/*
// @connect      47.119.113.79
// @connect      127.0.0.1
// @require      https://code.jquery.com/jquery-2.2.1.min.js
// @require      https://www.layuicdn.com/layui-v2.6.8/layui.js
// @resource     layuiCSS https://www.layuicdn.com/layui-v2.6.8/css/layui.css
// @require      https://unpkg.com/layer-src@3.5.1/dist/layer.js
// @resource     layerCSS https://unpkg.com/layer-src@3.5.1/dist/theme/default/layer.css
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        unsafeWindow
// @icon         https://lf3-search.searchpstatp.com/obj/card-system/favicon_5995b44.ico
// @downloadURL https://update.greasyfork.org/scripts/457453/%E5%A4%B4%E6%9D%A1%E5%8A%A9%E6%89%8B%EF%BC%88%E6%95%B0%E6%8D%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/457453/%E5%A4%B4%E6%9D%A1%E5%8A%A9%E6%89%8B%EF%BC%88%E6%95%B0%E6%8D%AE%EF%BC%89.meta.js
// ==/UserScript==

/*
注意：layui需要依赖高版本的jquery
如果js出现问题 试试这个：
https://cdn.jsdmirror.com/npm/layuicdns@1.6.2/layui-v2.6.8/layui.js 新
https://cdn.jsdelivr.net/npm/zhangsan-layui@1.0.3/layui.js  旧
https://www.layuicdn.com/layui-v2.6.8/layui.js
*/

(async function() {
    'use strict';

    GM_addStyle(GM_getResourceText("layuiCSS"));

    function initLayerEnv() {
        // 调用 window.layer = await initLayerEnv();
        // 注入并修复 Layer CSS 图表依赖问题，和 CSP (内容安全策略) 错误
        //  “先注入 CSS样式，再执行业务逻辑” 的顺序，避免了弹窗出来时样式还没加载好的闪烁问题。
        // 需要添加如下依赖
        // @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
        // @require      https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.min.js
        // @resource     layerCSS https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.css
        // @grant        GM_getResourceText
        // @grant        GM_addStyle
        const version = '1.0.0';
        // 1. 获取 CSS 文本
        var cssContent = GM_getResourceText("layerCSS");
        // 定义 Layer 资源所在的 CDN 基础路径 (注意末尾的斜杠)
        var cdnBaseUrl = 'https://unpkg.com/layer-src@3.5.1/dist/theme/default/';
        // 将 CSS 中的相对路径替换为绝对路径
        // 修复 icon.png (图标精灵图)
        cssContent = cssContent.replace(/url\(['"]?icon\.png['"]?\)/g, `url("${cdnBaseUrl}icon.png")`);
        // 修复 loading 图 (layer 加载层需要用到的 gif)
        cssContent = cssContent.replace(/url\(['"]?loading-([0-9])\.gif['"]?\)/g, `url("${cdnBaseUrl}loading-$1.gif")`);
        // 2. 注入修复后的 CSS
        GM_addStyle(cssContent);
        // 【关键】返回全局的 layer 对象
        //console.log('Layer CSS 及图片路径已修复');
        //console.log(window.layer);
        return window.layer;
    }

    await initLayerEnv();

    const url=document.URL
    //debugger

    if(url.includes('https://www.toutiao.com/w/')){
        func_wtt();
        return;
    }

    if(url.includes('https://www.toutiao.com/article/')){
        func_atricle();
        return;
    }

    if(url.includes('https://www.toutiao.com/video/')){
        // https://www.ixigua.com/  已经弃用
        func_video();
        return;
    }

    if(url.includes('https://mp.toutiao.com/profile_v3_public/public/activity/')){
        addStyle();
        addBtn_jump();
        $("#Btn_jump").click(function () {
            let activity_id=getQueryParamValue('id');
            let temp_url=`http://tt.myaijarvis.com/activitywinner.html?activity_id=${activity_id}`;
            window.open(temp_url, "_blank");
        })
        return;
    }

    if(url.includes('https://api.toutiaoapi.com/magic/eco/runtime/release/')){
        addStyle();
        addBtn_jump();
        $("#Btn_jump").click(function () {
            var regex = /activity_id%22%3A%22(\d+)/;
            var match = url.match(regex);
            if (match) {
                let activity_id=match[1];
                let temp_url=`http://tt.myaijarvis.com/activitywinner.html?activity_id=${activity_id}`;
                window.open(temp_url, "_blank");
            } else {
                console.log("Activity ID not found in URL.");
            }
        })
        return;
    }

    if(url.includes('https://www.toutiao.com/c/user/token/')){  // 主页
        /*
        let element = $(`<button style="top: 150px;left:0px; position: fixed;z-index:1000;cursor:pointer;background:green;width:auto;"
                         class="layui-btn layui-btn-sm" id="dian">点击</button>`);
        $("body").append(element);
        $("#dian").click(function () {
            func_profile();  // 给主页的作品通过请求api获取阅读和展现 现在已经删除
        });
        */

        setTimeout(() => {
            selectViewCounts();
        }, 3000); // 设置刷新间隔，单位为毫秒

        $(window).scroll(function () {
            //为了保证兼容性，这里取两个值，哪个有值取哪一个 scrollTop就是触发滚轮事件时滚轮的高度
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop > 200) {
                selectViewCounts();
                //console.log('Scroll!');
            }
        });

        //给 万阅读 的文章标黄
        function selectViewCounts() {
            let $viewCounts = $(".profile-feed-card-tools-text");
            for (const item of $viewCounts) {
                if ($(item).text().indexOf("万") != -1) {
                    $(item).css("background-color", "yellow");
                }
            }
        }

        // 显示IP
        GM_addStyle(`div.tt-modal-wrapper.more-info-modal.modal-show.modal-anime-show{display: none;}`);
        await sleep(1000)
        document.querySelector("#root > div > div.profile-info-wrapper > div.profile-info-l > div > button").click();
        await sleep(1000)
        document.querySelector("body > div.tt-modal-wrapper.more-info-modal.modal-show.modal-anime-show > div.tt-modal > div.tt-modal-header > button").click()
        await sleep(1000)
        let ip_address=document.querySelector("div > p.address").textContent;
        //console.log(ip_address);
        $('div.profile-info-wrapper > div.profile-info-l > div > button').after(`<span style="color:red;">${ip_address}</span> `)
        GM_addStyle(`div.tt-modal-wrapper.more-info-modal.modal-show.modal-anime-show{display: block;}`); // 恢复
        return;
    }

    async function func_wtt(){
        let id=get_id(url);
        //console.log(id);
        let str;
        let content_len=document.querySelector('.weitoutiao-html').textContent.length;
        let img_num=document.querySelectorAll("article  div.image-list .weitoutiao-img").length;
        try{
            let result=await get_info(id,3);
            let res=result['data'];
            //console.log(res);
            let name=$('.author-info .desc a').text();
            if(id.length==16)
                str=`<span style="color:green">${name} | ${getTime()} | ID：${result["userID"]} | 粉丝：${toThousands(result["followersCount"])} | IP：${result["publishLocInfo"]}</span>
                     <span style="color:red;display:inline-block;margin-top:10px;">展现：${toThousands(res["showCount"])} | 阅读：${toThousands(res["readCount"])} | 分享：${toThousands(res["shareCount"])}
                    | 收藏：${toThousands(res['repinCount'])} | 转发：${toThousands(res['forwardCount'])} | 字数：${content_len} | 图片：${img_num}</span>
                     <span style="color:purple;display:inline-block;margin-top:10px;"> 可评论：${!result["banComment"]} | 发布：${result["publishTime"]}`;
            else if(id.length==19)
                str=`${name} | ${getTime()}
                     <span style="display:block;margin-top:10px;">展现：${toThousands(res["showCount"])} | 阅读：${toThousands(res["readCount"])} | 转发：${toThousands(res['forwardCount'])}</span>`;
            //console.log(str);
            $('.wtt-meta').after(`<p style="margin-bottom:10px;">${str}</p>`); // after 在被选元素之后插入内容，其内容变成元素的兄弟节点。

            addStyle();
            addBtn();
            let title=document.querySelector("div.wtt-detail-container div.weitoutiao-html").textContent.substring(0, 30).replaceAll(',','，');
            let copy_text= `${id},${name},${res["showCount"]},${res["readCount"]},${res["diggCount"]},${res["commentCount"]},【${content_len}字${img_num}图】${title},采集wtt,${result['userID']},${result['publishTime']},${result["publishLocInfo"]}`;

            $("#caiji").click(function () {
                copy_text += `\n`;
                copyTextToClipboard(copy_text);
                layer.msg("采集成功");
            })

        }catch(error){
            str='error';
            $('.wtt-meta').after(`<p style="margin-bottom:10px;color:red;">${str} | 字数：${content_len} | 图片：${img_num}</span></p>`);
        }

        let article_content=document.querySelector(".weitoutiao-html").innerText;
        addBtn_copy_content();
        $("#copy_content").click(function () {
            copyTextToClipboard(article_content);
            layer.msg("复制内容成功");
        })

        addBtn_copy_img();
        $("#copy_img").click(function () {
            copy_tt_img(1);
        })

        const matches = extractAllContentAndText(article_content);
        //console.log(matches) // 注意Array长度为0时，if返回true
        if (matches) {
            // next() 下一个兄弟元素
            $('.wtt-meta').next().after(`<p style="color:blue;margin-bottom:10px;">标签：${matches.join(" | ")}</p>`);
        } else {
            //console.log("未找到匹配的内容");
            $('.wtt-meta').next().after(`<p style="color:blue;margin-bottom:10px;">标签：无</p>`);
        }
    }

    async function func_atricle(){
        let id=get_id(url);
        //console.log(id);
        let str;
        let content_len=document.querySelector('.tt-article-content').textContent.length;
        let img_num=document.querySelectorAll(".article-content .pgc-img").length;
        try{
            let result=await get_info(id,1);
            let res=result['data'];
            //console.log(res);
            let name=$('.article-meta .name a').text();
            let is_original=result['is_original']? '原创': '非原创';
            str=`<span style="color:green">${name} | ${getTime()} | ID：${result["userID"]} | 粉丝：${toThousands(result["followersCount"])} | IP：${result["publishLocInfo"]} | ${is_original}</span>
                 <span style="color:red;display:inline-block;margin-top:10px;">展现：${toThousands(res["showCount"])} | 阅读：${toThousands(res["readCount"])} | 分享：${toThousands(res["shareCount"])}
                 | 收藏：${toThousands(res['repinCount'])} | 转发：${toThousands(res['forwardCount'])} | 字数：${content_len} | 图片：${img_num}</span>
                 <span style="color:purple;display:inline-block;margin-top:10px;"> 可评论：${!result["banComment"]} | 发布：${result["publishTime"]}`;
            //console.log(str);
            $('.article-meta').append(`<p style="margin:10px 0;">${str}</p>`);
            //console.log(`${id},${name},${res["showCount"]},${res["readCount"]},${res["diggCount"]},${res["commentCount"]}`);
            addStyle();
            addBtn();
            let title=document.querySelector("#root  div  h1").textContent.replaceAll(',','，'); // 把英文逗号替换为中文逗号
            let copy_text= `${id},${name},${res["showCount"]},${res["readCount"]},${res["diggCount"]},${res["commentCount"]},【${content_len}字${img_num}图】${title},${is_original},${result['userID']},${result['publishTime']},${result["publishLocInfo"]}`;

            $("#caiji").click(function () {
                copy_text += `\n`;
                copyTextToClipboard(copy_text);
                layer.msg("采集成功");
            })

        }catch(error){
            str='error';
            $('.article-meta').append(`<p style="margin:10px 0;color:red;">${str} | 字数：${content_len} | 图片：${img_num}</span></p>`);
        }

        let article_content=document.querySelector(".tt-article-content").innerText;
        addStyle();
        addBtn_copy_content();
        $("#copy_content").click(function () {
            copyTextToClipboard(article_content);
            layer.msg("复制内容成功");
        });

        addBtn_copy_img();
        $("#copy_img").click(function () {
            copy_tt_img(0);
        })

        const matches = extractAllContentAndText(article_content);
        //console.log(matches)
        if (matches) {
            $('.article-meta').append(`<p style="color:blue;">标签：${matches.join(" | ")}</p>`);
        } else {
            //console.log("未找到匹配的内容");
            $('.article-meta').append(`<p style="color:blue;">标签：无</p>`);
        }
        $('.article-meta').css({'margin-bottom':'16px'});

    }

    async function func_video(){
        let id=get_id(url);
        //console.log(id);
        let str;
        try{
            let result=await get_info(id,2);
            let res=result['data'];
            // console.log(res);
            let name=$('.author-info>a').text();
            let is_original=result['is_original']? '原创': '非原创';
            str=`${name} | ${getTime()} | ${is_original} <br>| 展现：${toThousands(res["showCount"])} | 播放：${toThousands(res["readCount"])} | 分享：${toThousands(res["shareCount"])}
                | 收藏：${toThousands(res['repinCount'])} | 转发：${toThousands(res['forwardCount'])} | IP：${result["publishLocInfo"]} | 可评论：${!result["banComment"]}
                <br>| 发布：${result["publishTime"]} | 活动：${result["activity_name"]} ${result["activity_duration"]}
                <a href='http://tt.myaijarvis.com/activitywinner.html?activity_id=${result["activity_id"]}' target='_blank' style='color:white;'> 名单 </a>`;
            //console.log(str);

            addStyle();
            addBtn();
            let title=document.querySelector("div.ttp-video-extras-title h1").getAttribute('title').replaceAll(',','，');
            let copy_text= `${id},${name},${res["showCount"]},${res["readCount"]},${res["diggCount"]},${res["commentCount"]},${title},${is_original},${result['userID']},${result['publishTime']},${result["publishLocInfo"]}`;

            $("#caiji").click(function () {
                copy_text += `\n`;
                copyTextToClipboard(copy_text);
                layer.msg("采集成功");
            })

        }catch(error){
            str='error';
        }
        $('.meta-info').append(`<span style="padding-left:10px;color:red;">${str}</span>`);


    }


    function get_info(id,type){
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "get",
                url: "http://47.119.113.79:2001/get_item?token=1807479190myaijarvis&id="+id+"&type="+type, // 上传记得改这里
                async : false,
                onload: function(response){
                    //console.log("请求成功");
                    //console.log(response);
                    let result=JSON.parse(response.responseText);
                    console.log(result);
                    //debugger
                    if(result.code==1){
                        resolve(result)
                    }else{
                        console.log(response.finalUrl); // 请求url
                        reject(response.message);
                    }
                },
                onerror: function(response){
                    console.log("请求失败");
                    reject();
                }
            });
        })

    }

    function get_id(str){
        return str.match(/https:\/\/www\.toutiao\.com\/.*?\/(\d+)/)[1];
    }

    function toThousands (num = 0){
        return num.toString().replace(/\d+/, function(n) {
            return n.replace(/(\d)(?=(?:\d{4})+$)/g, '$1,');
        });
    }

    function getTime(){
        var date = new Date()
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        m = m < 10 ? ('0' + m) : m
        var d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        var currentdate = y + '-' + m + '-' + d;
        var hh = date.getHours()
        hh = hh < 10 ? ('0' + hh) : hh
        var mm = date.getMinutes()
        mm = mm < 10 ? ('0' + mm) : mm
        var ss = date.getSeconds()
        ss = ss < 10 ? ('0' + ss) : ss
        var time = hh + ':' + mm + ':' + ss;
        let now_time=currentdate + " " + time;
        //console.log(now_time)
        return now_time;
    }

})();

function addStyle() {
    // 加载自定义的css
    //debugger;
    let layui_css = `
         .layui-btn{
                   display: inline-block; vertical-align: middle; height: 38px; line-height: 38px; border: 1px solid transparent; padding: 0 18px;
                   background-color: #009688; color: #fff; white-space: nowrap; text-align: center; font-size: 14px; border-radius: 2px; cursor: pointer;
                   -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;
         }
         .layui-btn-sm{height: 30px; line-height: 30px; padding: 0 10px; font-size: 12px;}`;
    //GM_addStyle(layui_css); // 如果layuicss加载失败就手动加载一下
}

//创建复制按钮
function addBtn() {
    let element = $(
        `<div><button style="top: 150px;left:0px; position: fixed;z-index:1000;cursor:pointer;background:green;width:auto;" class="layui-btn layui-btn-sm" id="caiji">采集数据</button></div>`
  );
    $("body").append(element);
}

function addBtn_copy_content() {
    let element = $(
        `<div><button style="top: 200px;left:0px; position: fixed;z-index:1000;cursor:pointer;background:green;width:auto;" class="layui-btn layui-btn-sm" id="copy_content">复制内容</button></div>`
  );
    $("body").append(element);
}

function addBtn_copy_img() {
    let element = $(
        `<div><button style="top: 250px;left:0px; position: fixed;z-index:1000;cursor:pointer;background:green;width:auto;" class="layui-btn layui-btn-sm" id="copy_img">复制图片</button></div>`
  );
    $("body").append(element);
}

function addBtn_jump() {
    let element = $(
        `<div><button style="top: 150px;left:0px; position: fixed;z-index:1000;cursor:pointer;background:green;width:auto;" class="layui-btn layui-btn-sm" id="Btn_jump">跳转</button></div>`
  );
    $("body").append(element);
}

// 复制函数 不支持复制换行
function handleCopy(text) {
    let inputNode = document.createElement("input"); // 创建input
    inputNode.value = text; // 赋值给 input 值
    document.body.appendChild(inputNode); // 插入进去
    inputNode.select(); // 选择对象
    document.execCommand("Copy"); // 原生调用执行浏览器复制命令
    inputNode.className = "oInput";
    inputNode.style.display = "none"; // 隐藏
    console.log("复制：", text);
}
// 支持换行
function copyTextToClipboard(text) {
    // 创建一个隐藏的textarea元素
    const textarea = document.createElement('textarea');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px'; // 确保不可见
    document.body.appendChild(textarea);

    // 将文本（包括换行）设置到textarea中
    textarea.value = text;

    // 选中textarea的内容
    textarea.select();
    try {
        // 执行复制操作
        document.execCommand('copy');
        console.log('复制成功',text);
    } catch (err) {
        console.error('复制失败:', err);
    }
    // 清理，移除临时的textarea
    document.body.removeChild(textarea);
}

// 延迟函数，调用函数需要加上async
function sleep(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}

function extractAllContentAndText(text) {
    const regex = /#([^#]{2,30})#/g;; // 控制 #...# 之间的内容长度,这里设置为2-30
    const matches = text.match(regex);
    //return matches; // 返回Array或者null
    if (matches === null)
        return null;
    // 使用 Set 来去除重复项
    const uniqueMatches = [...new Set(matches)];
    return uniqueMatches;
}

function getQueryParamValue(key) {
    // 获取当前网址
    var url = window.location.href;
    // console.log(url);
    // 创建 URLSearchParams 对象
    var searchParams = new URLSearchParams(url.split("?")[1]);
    // console.log(searchParams);
    // 获取指定key对应的值
    return searchParams.get(key);
}

function copy_tt_img(flag) {
    // flag：0或1；0是article，1是wtt
    // 复制图片到粘贴板 方便一键复制

    if (typeof flag !== 'number' || (flag !== 0 && flag !== 1)) {
        layer.msg('参数 flag 必须为 0 或 1');
        return console.error('参数 flag 必须为 0 或 1');
    }

    // 1. 定义策略配置：区分 Article 和 WTT 的不同逻辑
    const strategies = [
        {
            type: 'article',
            name: '头条文章',
            selector: 'article.tt-article-content', // 文章主体容器
            imgSelector: 'img[data-src]',           // 图片选择器
            attr: 'data-src'                        // 取值的属性
        },
        {
            type: 'wtt',
            name: '微头条',
            selector: '.image-list',                // WTT 图片列表容器
            imgSelector: 'img',                     // 图片选择器
            attr: 'src'                             // WTT 直接取 src
        }
    ];
    const targetStrategy = strategies[flag];
    const content = document.querySelector(targetStrategy.selector);

    if (!content) {
        layer.msg(`未找到包含图片的文章主体`)
        return console.error('未找到包含图片的文章主体');
    }
    // 2. 找出所有带 src 的 img（忽略 base64 占位图）
    // 注意 头条文章图片是懒加载的 真实图片地址在img[data-src]
    const imgElements = content.querySelectorAll(targetStrategy.imgSelector);  // wtt 是 img[src]
    if (imgElements.length === 0) {
        return console.log(`未找到带 ${targetStrategy.imgSelector} 的图片`); // wtt 是 src
    }
    console.log(imgElements);
    // 3. 构建纯图片 HTML（每张图独立一行，保留原始比例）
    const htmlContent =  Array.from(imgElements).map(img => {
        const src = img.getAttribute(targetStrategy.attr); // wtt 是 img[src]
        const cleanSrc = src.replace(/&amp;/g, '&');
        return `<img src="${cleanSrc}" style="max-width:100%;display:block;margin:12px auto;">`;
    }).join('');

    const img_len = imgElements.length;
    console.log(`找到 ${img_len} 张图片`);

    // 4.：使用 contenteditable + execCommand
    const tempDiv = document.createElement('div');
    tempDiv.contentEditable = true;//  设置为可编辑（关键！）
    tempDiv.innerHTML = htmlContent; // 填入要复制的 HTML 内容
    tempDiv.style.cssText = 'position:fixed;top:-9999px;left:-9999px;'; //  隐藏这个 div（不让用户看到）
    document.body.appendChild(tempDiv);
    // 创建一个“选区”（Range），选中整个 div 的内容
    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    // 把这个选区应用到用户的实际选择中
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    //浏览器会把当前选中的可编辑内容（即那些 <img>）以富文本格式（HTML + 图片）复制到系统剪贴板。
    let success = document.execCommand('copy');
    document.body.removeChild(tempDiv);
    // 判断是否能复制
    if (success) {
        console.log('复制图片成功');
        layer.msg(`复制 ${img_len} 张图片成功`)
    } else {
        console.error('复制图片失败');
        layer.msg(`复制图片失败`)
    }
}