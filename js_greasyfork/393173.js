// ==UserScript==
// @name         答题活动
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  答题活动工具
// @author       You
// @require	     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require	     https://cdn.jsdelivr.net/npm/vue
// @match        https://zhidao.baidu.com/mobile/replyseason/teampage?*
// @downloadURL https://update.greasyfork.org/scripts/393173/%E7%AD%94%E9%A2%98%E6%B4%BB%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/393173/%E7%AD%94%E9%A2%98%E6%B4%BB%E5%8A%A8.meta.js
// ==/UserScript==

$(function () {
    fetch(`https://zhidao.baidu.com/metis/team/view`, {
        method: "get",
        headers: {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            Host: 'zhidao.baidu.com',
            Pragma: 'no-cache',
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36',
        },
    }).then(function (response) {
        if (response.status == 200) {
            return response;
        }
    }).then(function (data) {
        return data.arrayBuffer();
    }).then(function (result) {
        let body = new TextDecoder('gbk').decode(result);
        let teamInfo = jQuery(body).find(".home-team-qq-notice").text();
        let teamName = teamInfo.match(`您已加入(.*)认证团`)[1];
        if (![`知道合伙人精英团`, `冠军团`, `专业知识团`, `猛虎团`, `合伙人-答题小能手`].includes(teamName)) {
            return;
        }
        init();
    }).catch(function (e) {
        console.error(e)
    });

    function init() {

            let addSearchButton = () => {
                let items = $(".question-item").toArray();
                for (let item of items) {
                    let question_title = encodeURIComponent($(item).find(".question-item-title-wp").text());
                    if ($(item).find(".my-append").length) {
                        continue;
                    }
                    $(item).append(
                        `<p class="my-append">
<button class="my-search" data-type="0">搜百度</button>&nbsp;
<button class="my-search" data-type="1">搜知乎</button>&nbsp;
<button class="my-search" data-type="2">搜谷歌</button>&nbsp;
<button class="my-search" data-type="3">搜微信</button>
<button class="my-search" data-type="4">搜头条</button>
<button class="my-search" data-type="5">搜微博</button></span>
</p>`
                    );
                }
            };

  
      // 简单的节流函数
function throttle(func, wait, mustRun) {
    var timeout,
        startTime = new Date();

    return function() {
        var context = this,
            args = arguments,
            curTime = new Date();

        clearTimeout(timeout);
        // 如果达到了规定的触发时间间隔，触发 handler
        if (curTime - startTime >= mustRun) {
            func.apply(context, args);
            startTime = curTime;
            // 没达到触发间隔，重新设定定时器
        } else {
            timeout = setTimeout(func, wait);
        }
    };
};

// 实际想绑定在 scroll 事件上的 handler
function realFunc() {
    //判断是否滚动到页面最底部
    console.log(1);
    addSearchButton();
}
addSearchButton();
// 采用了节流函数
$(window).scroll(throttle(realFunc, 500, 1000))

        $(document).on('click', ".my-search", function () {
            console.log($(this))
            let question_title = encodeURIComponent($(this).parent().parent().find(".question-item-title-wp").text());

            let url = [
                `https://www.baidu.com/s?ie=UTF-8&wd=${question_title}`,
                `https://www.zhihu.com/search?type=content&q=${question_title}`,
                `https://www.google.com/search?q=${question_title}`,
                `https://weixin.sogou.com/weixin?type=2&query=${question_title}`,
                `https://www.toutiao.com/search/?keyword=${question_title}`,
                `https://s.weibo.com/article?q=${question_title}&Refer=weibo_article`,
            ][$(this).data("type")];
            window.open(url);
        });
    }
});