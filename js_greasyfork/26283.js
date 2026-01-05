// ==UserScript==
// @name         煎蛋多说评论框拯救计划
// @namespace    http://jandan.net/?JandanTucao
// @version      0.1
// @description  煎蛋多说评论框拯救计划，拯救被“评论框出错啦(990015): 服务异常,请联系客服人员”折磨的你。
// @author       Jandaner
// @match        *://jandan.net/*
// @grant        none
// @github       https://github.com/slowargo/JandanTucao
// @downloadURL https://update.greasyfork.org/scripts/26283/%E7%85%8E%E8%9B%8B%E5%A4%9A%E8%AF%B4%E8%AF%84%E8%AE%BA%E6%A1%86%E6%8B%AF%E6%95%91%E8%AE%A1%E5%88%92.user.js
// @updateURL https://update.greasyfork.org/scripts/26283/%E7%85%8E%E8%9B%8B%E5%A4%9A%E8%AF%B4%E8%AF%84%E8%AE%BA%E6%A1%86%E6%8B%AF%E6%95%91%E8%AE%A1%E5%88%92.meta.js
// ==/UserScript==
(function() {
    var myElement = document.querySelectorAll("span.time");
    for (var i = 0; i < myElement.length; i++) {
        //console.log("i:" + i + " ? " + myElement[i]);
        myElement[i].addEventListener("click", function() {
            function wait_util(fn, condition, interval) {
                interval = interval || 100;
                return function() {
                    var timer = setInterval(function() {
                        var check;
                        try {
                            check = !!(condition());
                        } catch (e) {
                            check = false;
                        }
                        if (check) {
                            clearInterval(timer);
                            delete timer;
                            fn();
                        }
                    }, interval);
                };
            }
            var link = $(this).find('a');
            if (link.length > 0) {
                var comment_id = $(link).find('span.ds-thread-count').attr('data-thread-key');
                var comment_container = $('#comment-box-' + comment_id);
                var sub_div = comment_container.find('div');
                var retry = 3;
                if (sub_div.length == 0) {
                    console.log("div not found");
                    return;
                }
                var res = $(sub_div[0]).html();
                //似乎不保证在<a>的click前执行?为避免错误重置，依然加上<div id="ds-waiting"></div>的判断
                //但假如多说返回超时，这里就不会强制重试了
                if (res.length > 0 && res.length < 30 && res != '<div id="ds-waiting"></div>') {
                    //if ($(sub_div[0]).html() == '评论框出错啦(990015): 服务异常,请联系客服人员' || $(sub_div[0]).html() =='<div id="ds-waiting"></div>' ) {
                    //重置状态，强制多说脚本重新向服务器请求
                    console.log(res + " reset...");
                    $(sub_div[0]).html('');
                    $(sub_div[0]).data("initialized", 0);
                }
                wait_util(function() {}, function() {
                    var res = $(sub_div[0]).html();
                    if (res == '<div id="ds-waiting"></div>') {
                        //如果这里放过了，很可能加载完成后多说返回990015，评论区就直接显示990015了
                        return false;
                    }
                    if (retry-- > 0 && res.length < 30) {
                        console.log(res + " retry: " + retry);
                        //重新加载评论框
                        $(sub_div[0]).html('');
                        $(sub_div[0]).data("initialized", 0);
                        DUOSHUO.EmbedThread(sub_div[0]);
                        return false;
                    }
                    return true;
                }, 200)();
            }
        });
    }
})();
