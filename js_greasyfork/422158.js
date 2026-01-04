// ==UserScript==
// @name         空！
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Only for LX!
// @author       Chinshry
// @include      https://m.weibo.cn/profile
// @include      https://m.weibo.cn/home/setting
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.js
// @downloadURL https://update.greasyfork.org/scripts/422158/%E7%A9%BA%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/422158/%E7%A9%BA%EF%BC%81.meta.js
// ==/UserScript==

(function () {
    /* 判断是否该执行 */
    const whiteList = ['/profile', '/home/setting'];
    const pathname = window.location.pathname;
    const IS_REMOVE = pathname.indexOf('setting') >= 0;

    const thispath = whiteList.indexOf(pathname);
    if (thispath < 0){
        console.log("Not WhiteList");
        return;
    }

    function init() {
        const scriptjquery = document.createElement('script');
        scriptjquery.src = 'https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js';
        document.head.appendChild(scriptjquery);
        const scriptToastr = document.createElement('script');
        scriptToastr.src = 'https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.js';
        document.head.appendChild(scriptToastr);
    }

    function initCSS() {
        const scripCSS = document.createElement('link');
        scripCSS.rel = 'stylesheet';
        scripCSS.href = 'https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.css';
        document.head.appendChild(scripCSS);
    }

    initCSS();
    try {
        toastr.options = {
            timeOut: "10000",
        };
    } catch (e) {
        console.log("INIT")
        init();
    }

    console.log("READY")

    setTimeout(function () {
        var nowpathname = window.location.pathname;
        const thispath = whiteList.indexOf(nowpathname);
        if (thispath < 0){
            toastr.info("请登录");
            console.log("未登录");
            return;
        }

        console.log("START")

        try {
            toastr.options = {
                timeOut: "10000",
            };
            toastr.info("初始化点赞任务");
        } catch (e) {
            console.log(e)
            alert("请刷新重试")
            return
        }

        var token = getCookie('XSRF-TOKEN');
        getTask()

        function sleep(d){
            for(var t = Date.now();Date.now() - t <= d;);
        }

        function getCookie(sName) {
            var aCookie = document.cookie.split("; ");
            for (var i = 0; i < aCookie.length; i++) {
                var aCrumb = aCookie[i].split("=");
                if (sName == aCrumb[0]) return unescape(aCrumb[1]);
            }
            return null;
        }

        function getTask() {
            $.ajax({
                type: 'GET',
                url: "https://api2.bmob.cn/1/classes/weibolike",
                headers: {
                    'Content-Type': 'application/json',
                    'X-Bmob-Application-Id': 'b9f27ab8df8e6b52b107bf0245434329',
                    'X-Bmob-REST-API-Key': 'bd723921663e8196b9a2610b5fedff09'
                },
                async:false,
                success: function (result) {
                    toastr.warning("获取成功 共" + result.results.length + "条任务")
                    result.results.forEach((value) =>{
                        if(value.hasOwnProperty("isWeibo")){
                            weiboLike(value);
                        } else{
                            commentLike(value);
                        }
                        sleep(800)
                    })
                    toastr.success(IS_REMOVE ? "取消点赞完成！" : "点赞完成！");

                },
                error: function (err) {
                    console.log("错误 " + err);
                }
            });
        }

        function commentLike(task) {
            $.ajax({
                type: 'POST',
                url: IS_REMOVE ? "https://m.weibo.cn/api/likes/destroy" : "https://m.weibo.cn/api/likes/update",
                headers: {
                    'x-xsrf-token':token
                },
                data: {
                    'id': task.id,
                    'type': "comment"
                },
                async:false,
                success: function (result) {
                    console.log(result);
                },
                error: function (err) {
                    console.log("错误 " + err);
                }
            });
        }

        function weiboLike(task) {
            $.ajax({
                type: 'POST',
                url: IS_REMOVE ? "https://m.weibo.cn/api/attitudes/destroy" : "https://m.weibo.cn/api/attitudes/create",
                headers: {
                    'x-xsrf-token':token
                },
                data: {
                    'id': task.id,
                    'attitude': "heart"
                },
                async:false,
                success: function (result) {
                    console.log(result);
                },
                error: function (err) {
                    console.log("错误 " + err);
                }
            });
        }
    }, 2000)
})();
