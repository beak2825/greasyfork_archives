// ==UserScript==
// @name         Github 添加收藏按钮
// @version      0.35
// @description  收藏 github 中当前访问库的地址
// @author       xiaoxuan6
// @license      MIT
// @match        https://github.com/*/*
// @exclude      https://github.com/xiaoxuan6/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_openInTab
// @connect      xiaoxuan6.vercel.app
// @namespace https://greasyfork.org/users/1038333
// @downloadURL https://update.greasyfork.org/scripts/478106/Github%20%E6%B7%BB%E5%8A%A0%E6%94%B6%E8%97%8F%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/478106/Github%20%E6%B7%BB%E5%8A%A0%E6%94%B6%E8%97%8F%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

$(document).ready(function () {

    var windowWidth = $(window).width();

    $(window).resize(function() {
        windowWidth = $(window).width();
        if (windowWidth < 768) {
            let collectEl = $('.pagehead-actions').find('.collect')
            if (collectEl.length > 0) {
                collectEl.parent('li').remove();
            }
            $('#responsive-meta-container > div > div:first-child > div').append('<div class="collect"><?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8C5 6.89543 5.89543 6 7 6H19L24 12H41C42.1046 12 43 12.8954 43 14V40C43 41.1046 42.1046 42 41 42H7C5.89543 42 5 41.1046 5 40V8Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M24 20L26.243 24.9128L31.6085 25.5279L27.6292 29.1792L28.7023 34.4721L24 31.816L19.2977 34.4721L20.3708 29.1792L16.3915 25.5279L21.757 24.9128L24 20Z" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>');
        } else {
            $('#responsive-meta-container > div > div:first-child > div').find('.collect').remove();
            $('.pagehead-actions').append('<li><div class="collect"><?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8C5 6.89543 5.89543 6 7 6H19L24 12H41C42.1046 12 43 12.8954 43 14V40C43 41.1046 42.1046 42 41 42H7C5.89543 42 5 41.1046 5 40V8Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M24 20L26.243 24.9128L31.6085 25.5279L27.6292 29.1792L28.7023 34.4721L24 31.816L19.2977 34.4721L20.3708 29.1792L16.3915 25.5279L21.757 24.9128L24 20Z" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div></li>');
        }
    });

    init()
    function init() {
        if (windowWidth < 768) {
            $('#responsive-meta-container > div > div:first-child > div').append('<div class="collect"><?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8C5 6.89543 5.89543 6 7 6H19L24 12H41C42.1046 12 43 12.8954 43 14V40C43 41.1046 42.1046 42 41 42H7C5.89543 42 5 41.1046 5 40V8Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M24 20L26.243 24.9128L31.6085 25.5279L27.6292 29.1792L28.7023 34.4721L24 31.816L19.2977 34.4721L20.3708 29.1792L16.3915 25.5279L21.757 24.9128L24 20Z" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>')
        } else {
            $('.pagehead-actions').append('<li><div class="collect"><?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 8C5 6.89543 5.89543 6 7 6H19L24 12H41C42.1046 12 43 12.8954 43 14V40C43 41.1046 42.1046 42 41 42H7C5.89543 42 5 41.1046 5 40V8Z" fill="none" stroke="#333" stroke-width="4" stroke-linejoin="round"/><path d="M24 20L26.243 24.9128L31.6085 25.5279L27.6292 29.1792L28.7023 34.4721L24 31.816L19.2977 34.4721L20.3708 29.1792L16.3915 25.5279L21.757 24.9128L24 20Z" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div></li>')
        }
    }
    
    $(document).keydown(function (event) {
        if (event.ctrlKey && event.key === 'd') {
            event.preventDefault();
            submit()
        }
    })

    $('.collect').on('click', function () {
        submit()
    })

    function submit() {
        let auth = $('meta[name="user-login"]').attr('content');
        let url = window.location.href
        let description = $('#responsive-meta-container > div > p').text();
        
        var selector = '#repo-content-pjax-container > div > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(6) > div > ul > li:first-child';
        var text = $(selector).text();
        if (text === '') {
            var selector = '#repo-content-turbo-frame > div > div > div.Layout.Layout--flowRow-until-md.Layout--sidebarPosition-end.Layout--sidebarPosition-flowRow-end > div.Layout-sidebar > div > div:nth-child(5) > div > ul > li';
            var text = $(selector).text();
        }
        
        var language = text.replace(/[^a-zA-Z]/g, '');

        let postData = "auth=" + encodeURIComponent(auth) + "&url=" + encodeURIComponent(url) + "&description=" + description + "&language=" + language;
        
        GM_xmlhttpRequest({
            method: "POST",
            responseType: "json",
            url: "https://xiaoxuan6.vercel.app/apis/collect",
            data: postData,
            headers: {
                "content-type": "application/x-www-form-urlencoded"
            },
            onload: function (xhr) {
                console.log("xhr", xhr)
                if (xhr.status == 200) {
                    if (xhr.response.status == 200) {
                        GM_notification({
                            title: "Github 收藏 - " + language,
                            text: "请求成功！",
                            image: "",
                            timeout: 3000,
                            onclick: function () {
                            }
                        })
                    } else {
                        GM_notification({
                        title: "请求失败",
                        text: xhr.response.msg,
                        image: "",
                        timeout: 3000,
                        onclick: function () {
                            GM_openInTab("https://vercel.com/xiaoxuan6/dashboard/logs",{ active: true, setParent :true});
                        }
                    })
                    }
                } else {
                    GM_notification({
                        title: "Github 收藏",
                        text: "请求失败: " + res.responseText,
                        image: "",
                        timeout: 3000,
                        onclick: function () {
                        }
                    })
                }
            },
            onerror: function(res){
                console.log(res);
                GM_notification("请求失败: " + res.status + " " + res.statusText + " " + res.responseText);
            }
        })
    }
});
