// ==UserScript==
// @name         博了个思（博思平台）
// @namespace    hibosi
// @version      2.30
// @description  安信工博思平台一键刷课，解除右键限制、鼠标时间限制。
// @author       VMatrices
// @match        *://aiit.iflysse.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35424/%E5%8D%9A%E4%BA%86%E4%B8%AA%E6%80%9D%EF%BC%88%E5%8D%9A%E6%80%9D%E5%B9%B3%E5%8F%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/35424/%E5%8D%9A%E4%BA%86%E4%B8%AA%E6%80%9D%EF%BC%88%E5%8D%9A%E6%80%9D%E5%B9%B3%E5%8F%B0%EF%BC%89.meta.js
// ==/UserScript==


(function () {
    'use strict';
    var ckobj;

    /********** Initialize Style *********/

    $(document.body).append('<style>*{user-select:unset !important}' +
        '._vma_tip{z-index:9999;width:300px;text-align:center;position:fixed;top:-50px;left:0;right:0;margin:0 auto;border-radius:2px;' +
        'user-select:none;padding:10px;color:#fff;background:#f08d50;font-size:12px;font-weight:700;box-shadow:0 0 15px rgba(0,0,0,.5);transition:all .5s}' +
        '._vma_tip._vma_red{background:#fd4d4d}' +
        '._vma_tip._vma_green{background:#2dba27}' +
        '._vma_tip._vma_blue{background:#31a4e2}' +
        '._vma_tip._vma_show{top:30px}</style>');

    /********** Tip module *********/

    var $tipBox = $('<div class="_vma_tip"></div>');
    $(document.body).append($tipBox);

    var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null;
    var savedMsg = null,
        tipBoxCounter = 0;

    var showTip = (tip, color) => {
        setTimeout(() => {
            if (!document[hiddenProperty]) {
                savedMsg = null;
                $tipBox.removeClass('_vma_red _vma_green _vma_blue')
                clearTimeout(tipBoxCounter);
                $tipBox.html(tip);
                $tipBox.addClass('_vma_show _vma_' + color);
                tipBoxCounter = setTimeout(() => $tipBox.removeClass('_vma_show _vma_red _vma_green _vma_blue'), 2222);
            } else {
                savedMsg = {
                    tip, color
                };
            }
        }, 10);
    };

    document.addEventListener(hiddenProperty.replace(/hidden/i, 'visibilitychange'), () => {
        if (!document[hiddenProperty]) {
            if (savedMsg) {
                showTip(savedMsg.tip, savedMsg.color);
            }
        }
    });

    /********** Allow copying *********/

    $('[oncontextmenu]').each(function () {
        var $el = $(this);
        if ($el.attr('oncontextmenu').indexOf('return false') >= 0) {
            $el.removeAttr('oncontextmenu');
        }
    });

    $('[onselectstart]').each(function () {
        var $el = $(this);
        if ($el.attr('onselectstart').indexOf('return false') >= 0) {
            $el.removeAttr('onselectstart');
        }
    });

    $('[onpaste]').each(function () {
        var $el = $(this);
        if ($el.attr('onpaste').indexOf('return false') >= 0) {
            $el.removeAttr('onpaste');
        }
    });

    /********** Hook exam page *********/

    if (/^\/Pages\/Exams\/(?!Index|OverIndex|Score|Attainment).+$/i.test(window.document.location.pathname)) {

        var blurCount = 0;

        var onHookBlurEvent = () => {
            showTip('成功拦截本次鼠标异常操作! [' + (++blurCount) + ']', 'red');
        };

        window.onblur = onHookBlurEvent;

        setInterval(() => {
            window.onblur = onHookBlurEvent;
        }, 5000);

        setTimeout(() => showTip('加载成功,您现在可以自由使用鼠标了', 'green'), 2000);

    } else if (/^\/Pages\/Student\/WorkLearn.+$/i.test(window.document.location.pathname)) {

        /**********  videoplay *********/

        var $panel = $(
            '<li style="display:none">' +
            '<a style="float:left"><span style="float:left;margin-right:10px">亮度</span><input style="width:80px" name="brightness" type="range" min="-255" max="255"></a>' +
            '<a style="float:left"><span style="float:left;margin-right:10px">对比</span><input style="width:80px" name="contrast" type="range" min="-255" max="255"></a>' +
            '<a style="float:left"><span style="float:left;margin-right:10px">色相</span><input style="width:80px" name="hue" type="range" min="-255" max="255"></a>' +
            '<a style="float:left"><span style="float:left;margin-right:10px">黑白</span><input name="gray" type="checkbox"></a></li>'
        );

        var $nav = $(".nav.navbar-nav.navbar-right").prepend($panel);

        var $vBrt = $nav.find('input[name="brightness"]').on('input propertychange', function () {
                ckobj.videoBrightness($(this).val());
            }),
            $vCst = $nav.find('input[name="contrast"]').on('input propertychange', function () {
                ckobj.videoContrast($(this).val());
            }),
            $vHue = $nav.find('input[name="hue"]').on('input propertychange', function () {
                ckobj.videoSetHue($(this).val());
            }),
            $vGay = $nav.find('input[name="gray"]').change(function () {
                ckobj.videoSaturation($(this).prop("checked") ? 0 : 1);
            });

        var resetCkplayerValue = function () {
            $vBrt.val("0");
            $vCst.val("127");
            $vHue.val("0");
            $vGay.prop("checked", false);

        };
        $(".work-count .video").on("click", resetCkplayerValue);
        $("#nextWork").on("click", resetCkplayerValue);
        $("#prevWork").on("click", resetCkplayerValue);

        /********** Hook learning page *********/

        var showSkipBtn = () => {
            $(".progress_btn").hide();
            var $nextBtn = $("#nextWork");
            $nextBtn.show();
            $nextBtn.removeAttr("disabled");
            $nextBtn.removeClass("disable");
            $nextBtn.css('background', 'rgb(100,188,100)');
            $nextBtn.html("已完成");
        };

        var Xplayerstop = () => {
            ckobj = CKobject.getObjectById('ckplayer_a1');
            if (ckobj == null) return;
            var a = ckobj.getStatus();
            var time = a.totalTime;
            var myVideoID = $("#pageID").data("myvideoid");
            var contextID = $("#nowid").val();
            //console.log("当前视频ID:" + myVideoID + "，总时间：" + time);
            $.ajax({
                type: "POST",
                dataType: "json",
                url: "../../Handler/VideoHandler.ashx?_fuck=",
                data: {
                    action: "1",
                    VideoID: myVideoID,
                    Time: Math.floor(time),
                    WorkcontextID: contextID
                },
                success: function (msg) {
                    clearInterval(UpdateFun);
                    showSkipBtn();
                    showTip("已为您跳过当前视频！", 'blue');
                    return;
                    count = 0;
                    CKobject.getObjectById('ckplayer_a1').videoSeek(msg - 1);
                }
            });
        };

        var $progress = $("#progress");

        setInterval(function () {
            if ($progress.css('display') == 'none') {
                for(var key in window) {
                    /monitor.?count.?/.test(key) && (window[key]=0)
                }
                var $nextWork = $("#nextWork");
                if ($nextWork.hasClass("disable") || $nextWork.css('display') == 'none') {
                    if ($("#workType").val() == "2") { //视频模式
                        Xplayerstop();
                    } else {
                        showSkipBtn();
                        showTip("已为您跳过当前章节！", 'green');
                    }
                } else {

                    if ($("#workType").val() == "2") {
                        ckobj = CKobject.getObjectById('ckplayer_a1');
                        if ($panel.css("display") == "none") {

                            $panel.css("display", "block");
                        }
                    } else {
                        if ($panel.css("display") == "block") {
                            $panel.css("display", "none");
                        }
                    }
                }
            } else {
                resetCkplayerValue();
            }
        }, 777);
    }


})();
