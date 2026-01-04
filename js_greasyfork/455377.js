// ==UserScript==
// @name         安全微伴刷课-2022
// @namespace    https://github.com/Huoyuuu
// @version      1.1
// @description  2023安全微伴更新后脚本已失效，推荐使用https://greasyfork.org/zh-CN/scripts/433560
// @author       Huoyuuu
// @match        *://weiban.mycourse.cn/*
// @match        https://mcwk.mycourse.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      The MIT License
// @downloadURL https://update.greasyfork.org/scripts/455377/%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4%E5%88%B7%E8%AF%BE-2022.user.js
// @updateURL https://update.greasyfork.org/scripts/455377/%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4%E5%88%B7%E8%AF%BE-2022.meta.js
// ==/UserScript==

(function ()
{
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    var jsonData = null;
    const methodToken = getQueryString("methodToken");
    const csCom = getQueryString("csCom"); // 判断是否开启评论

    function backToList() {
        if (getQueryString("referrer") != null) {
            location.replace(document.referrer);
        } else {
            if (window.history.length > 1) {
                $("body").html("");
                window.history.back();
            } else {
                window.close();
            }
        }
    }

    function getRecordUrl(url) {
        if (url.indexOf('open.mycourse.cn') > 0) {
            return `https://open.mycourse.cn/proteus/usercourse/finish.do`;
        } else {
            return `https://weiban.mycourse.cn/pharos/usercourse/v1/${methodToken}.do`;
        }

    }

    function finishWxCourse() {
        try { console.log(exportRoot.currentFrame) } catch (e) {}
        try {
            const userid = getQueryString("userCourseId");
            const jiaoxuejihuaid = getQueryString("tenantCode");
            var finishWxHost = document.referrer.replace("http://", "").replace("https://", "").split("/")[0];
            if (document.referrer == "" || document.referrer == null || document.referrer == undefined) {
                finishWxHost = "weiban.mycourse.cn"
            }

            const webUrl = window.location.href;
            const finishWxUrl = getRecordUrl(webUrl);

            const finishData = { "userCourseId": userid, "tenantCode": jiaoxuejihuaid };

            $.ajax({
                async: false,
                url: finishWxUrl,
                type: "GET",
                dataType: "jsonp",
                data: finishData,
                timeout: 5000,

                success: function(data) {
                    if (data.msg == "ok") {
                        if (csCom === 'true') {
                            let link = document.createElement('link');
                            link.setAttribute('rel', 'stylesheet');
                            link.setAttribute('type', 'text/css');
                            link.setAttribute('href', '/js/pop-item.css');
                            document.head.appendChild(link);

                            $("body").html('<div class="pop-jsv">' +
                                '<div class="pop-jsv-content">' +
                                '<h3 class="pop-jsv-title">恭喜你完成本微课学习！</h3>' +
                                '<img src="/js/pop-icon-logo-icon.png" alt="" class="pop-jsv-logo">' +
                                '<div class="pop-jsv-btns">' +
                                '<a href="javascript:;" class="pop-jsv-btn pop-jsv-prev">返回列表</a>' +
                                '<a href="javascript:;" class="pop-jsv-btn pop-jsv-next">评价课程</a>' +
                                '</div>' +
                                '</div>' +
                                '</div>');
                        } else {
                            alert("恭喜，您已完成本微课的学习");
                        }
                    } else {
                        alert("发送完成失败");
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {}
            });
        } catch (e) {
            alert("报了啥错误" + e)
        }
    }

    //屏蔽微信功能按钮
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        WeixinJSBridge.call('hideOptionMenu');
    });

    if (csCom === 'true') {
        $("body").on("click", ".pop-jsv-prev", function() {
            backToList()
        })


        $("body").on("click", ".pop-jsv-next", function() {
            let courseId = getQueryString("courseId");
            let userProjectId = getQueryString("userProjectId");
            let userCourseId = getQueryString("userCourseId");

            let url = document.referrer + "#/wk/eval?courseId=" + courseId + "&userCourseId=" + userCourseId + "&userProjectId=" + userProjectId;
            window.open(url, "_parent");
        })
    }

    function showProgressFloatOnCanvas(progress) {
        if ($("#spinner").length == 0) {
            $("body").append(
                '<style type="text/css">#progressFloatOnCanvas{ width:200px; text-align:center; position:absolute; top:30px; left:50%; margin: 0 0 0 -100px;}.spinner{height: 20px;left: 50%;margin: -10px 0 0 -10px;position: absolute;top: 50%;width: 20px;z-index: 10;}.container1>div,.container2>div,.container3>div{width:6px;height:6px;background-color:#333;border-radius:100%;position:absolute;-webkit-animation:bouncedelay 1.2s infinite ease-in-out;animation:bouncedelay 1.2s infinite ease-in-out;-webkit-animation-fill-mode:both;animation-fill-mode:both}.spinner .spinner-container{position:absolute;width:100%;height:100%}.container2{-webkit-transform:rotateZ(45deg);transform:rotateZ(45deg)}.container3{-webkit-transform:rotateZ(90deg);transform:rotateZ(90deg)}.circle1{top:0;left:0}.circle2{top:0;right:0}.circle3{right:0;bottom:0}.circle4{left:0;bottom:0}.container2 .circle1{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.container3 .circle1{-webkit-animation-delay:-1s;animation-delay:-1s}.container1 .circle2{-webkit-animation-delay:-.9s;animation-delay:-.9s}.container2 .circle2{-webkit-animation-delay:-.8s;animation-delay:-.8s}.container3 .circle2{-webkit-animation-delay:-.7s;animation-delay:-.7s}.container1 .circle3{-webkit-animation-delay:-.6s;animation-delay:-.6s}.container2 .circle3{-webkit-animation-delay:-.5s;animation-delay:-.5s}.container3 .circle3{-webkit-animation-delay:-.4s;animation-delay:-.4s}.container1 .circle4{-webkit-animation-delay:-.3s;animation-delay:-.3s}.container2 .circle4{-webkit-animation-delay:-.2s;animation-delay:-.2s}.container3 .circle4{-webkit-animation-delay:-.1s;animation-delay:-.1s}@-webkit-keyframes bouncedelay{0%,100%,80%{-webkit-transform:scale(0)}40%{-webkit-transform:scale(1)}}@keyframes bouncedelay{0%,100%,80%{transform:scale(0);-webkit-transform:scale(0)}40%{transform:scale(1);-webkit-transform:scale(1)}}</style>' +
                '<div class="spinner" id="spinner">' +
                '<div class="spinner-container container1">' +
                '<div class="circle1"></div>' +
                '<div class="circle2"></div>' +
                '<div class="circle3"></div>' +
                '<div class="circle4"></div>' +
                '</div>' +
                '<div class="spinner-container container2">' +
                '<div class="circle1"></div>' +
                '<div class="circle2"></div>' +
                '<div class="circle3"></div>' +
                '<div class="circle4"></div>' +
                '</div>' +
                '<div class="spinner-container container3">' +
                '<div class="circle1"></div>' +
                '<div class="circle2"></div>' +
                '<div class="circle3"></div>' +
                '<div class="circle4"></div>' +
                '</div>' +
                '<div id="progressFloatOnCanvas">加载中：' + progress + '</div>' +
                '</div>'
            )
        }
        $("#progressFloatOnCanvas").html("加载中：" + progress);
        if (progress == "100%") {
            $("#spinner").hide();
        }
    }

    finishWxCourse()
}) ();