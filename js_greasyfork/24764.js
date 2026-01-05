// ==UserScript==
// @name         BugFree功能优化
// @namespace    http://your.homepage/
// @version      1.6.2
// @description  BugFree 2.0 功能优化，自动展示媒体信息；优化页面布局；
// @author       Haiifenng
// @match        http://192.168.0.8/bugfree/*
// @match        http://111.200.241.83:3333/bugfree/*
// @require      http://libs.baidu.com/jquery/1.9.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/js/select2.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/24764/BugFree%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/24764/BugFree%E5%8A%9F%E8%83%BD%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
//

(function () {
    $("head").append($(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-beta.1/dist/css/select2.min.css">`));

    // ======================
    // 样式优化
    // ======================
    let css = `
        #TopBCR {
            margin-top: 36px;
        }
        #TopNavMain {
            position: fixed;
            top: 0px;
        }
        #BugMain {
            background-color: initial;
        }
        #ButtonList {
            position: fixed;
            width: 100%;
            top: 35px !important;
            padding-top: 2px;
            height: 25px;
            /*background-color: #fff !important;*/
            box-shadow: 0px 3px 3px 0px rgba(31, 31, 31, 0.2);
        }
        fieldset.Normal {
            /*padding: 3px 0px 4px 13px;*/
        }
        fieldset {
            border: 2px solid #c0c0c0;
        }

        input:focus, input:hover,textarea:focus, textarea:hover,select:focus, select:hover{
            border-color: #d2d2d2;
            outline: none;
        }

        input[type="button" i],input[type="submit" i],input[type="reset" i] {
            display: inline-block;
            box-sizing: border-box;
            vertical-align: middle;
            font-weight: normal !important;
            color: #555;
            text-align: center;
            vertical-align: middle;
            border: 1px solid #e9e9e9;
            background-color: #fff;
            -webkit-border-radius: 2px;
            -moz-border-radius: 2px;
            border-radius: 2px;
            outline: none !important; /*兼容grid*/
            cursor: pointer;
            white-space: nowrap;
        }

        input[type="button" i]:focus,input[type="submit" i]:focus,input[type="reset" i]:focus, input[type="button" i]:hover,input[type="submit" i]:hover,input[type="reset" i]:hover {
            color: #108ee9;
            background-color: #fff;
            border-color: #108ee9;
        }

        input[type="button" i]:disabled {
            border: 1px solid #e9e9e9 !important;
            background-color: #f5f5f5;
            color: #666 !important;
	        cursor: not-allowed !important;
            opacity: .5;
        }


        input[type="text" i] {
            height: 22px;
        }
        input[type="text" i],textarea {
            position: relative;
            display: inline-block;
            padding: 2px 3px;
            width: 100%;
            cursor: text;
            font-size: 12px;
            line-height: 1.5;
            color: #666;
            background-color: #fff;
            border: 1px solid #e9e9e9;
            border-radius: 2px;
            -webkit-transition: all .3s;
            transition: all .3s;
            box-sizing: border-box;
        }

        input[type="text" i],textarea:focus, input[type="text" i],textarea:hover {
            border-color: #d2d2d2;
            outline: none;
        }

        select {
            -webkit-writing-mode: horizontal-tb !important;
            text-rendering: auto;
            color: #666;
            height: 22px;
            letter-spacing: normal;
            word-spacing: normal;
            text-transform: none;
            text-indent: 0px;
            text-shadow: none;
            display: inline-block;
            text-align: start;
            appearance: menulist;
            box-sizing: border-box;
            align-items: center;
            white-space: pre;
            -webkit-rtl-ordering: logical;
            background-color: #fff;
            cursor: default;
            margin: 0em;
            font-size: 12px;
            border-radius: 2px;
            border: 1px solid #e9e9e9;
            border-image: initial;
        }

        .select2-container .select2-selection--single {
            outline: none;
            height: 22px !important;
        }
        .select2-container--default .select2-selection--single {
            outline: none;
            border-radius: 2px !important;
        }
        .select2-container--default .select2-selection--single .select2-selection__rendered {
            outline: none;
            line-height: 20px !important;
        }

        .select2-container--default .select2-selection--single .select2-selection__arrow {
            height: 20px;
        }

        .replyTip {
            background-color: #ecf5ff;
            display: inline-block;
            height: 24px;
            padding: 0 8px;
            line-height: 22px;
            font-size: 12px;
            color: #409eff;
            border: 1px solid #d9ecff;
            border-radius: 4px;
            box-sizing: border-box;
            white-space: nowrap;
            margin-right: 6px;
            margin-bottom: 6px;
            cursor: pointer;
        }

    `
    GM_addStyle(css);

    // ======================
    // 优化布局
    // ======================
    $("#BugForm").height($(window).height() - 62);
    $("#BugForm").css({ "overflow": "auto", "margin-top": "62px" });
    //设置标题
    $("#TopBCRId").text(document.title);
    $("#TopBCRId").css("width", "90%");
    // 附件上传按钮
    $("#AttachFile").css({
        "width": "100%",
        "position": "initial"
    });

    // ======================
    // Bug创建页面
    // ======================
    $(function () {
        if ($("#TopBCRId").length > 0) {
            if ($("#TopBCRId").text() == "创建 Bug") {
                $("#ProjectID").select2();
                $("#ModuleID").select2();
            }
        }
    });


    // ======================
    // Bug列表界面
    // ======================
    function getMyId() {
        if (parent.frames['NavFrame']) {
            var text = parent.frames['NavFrame'].document.getElementsByName("UserNameLink")[0].text;
            if (text) {
                var userName = text.substring(text.indexOf(",") + 1, text.length - 1);
                for (var i = 0; i < ACUserValue.length; i++) {
                    var t = ACUserText[i];
                    if (t == userName) {
                        return ACUserValue[i];
                    }
                }
            }
        }
        return "";
    }

    function isQA() {
        if (parent.frames['NavFrame']) {
            var text = parent.frames['NavFrame'].document.getElementsByName("UserNameLink")[0].text;
            if (text && text.indexOf("QA") > -1) {
                return true;
            }
        }
        return false;
    }

    if ($(".TopLine").length > 0) {
        if (!isQA()) {
            var toolbar = $(".TopLine");
            var buttons = [{
                "name": "我解决的",
                "id": "myResolved",
                "fn": function () {
                    document.getElementById("SearchBug").reset();
                    $("#Field1").val("ResolvedBy").trigger("change");
                    $("#Field3").val("ResolvedDate").trigger("change");
                    $("#Value1").val(getMyId()).trigger("change");
                    var date = $("#Value3").val();
                    $("#Value3").val(date.substring(0, date.indexOf(" ")));
                    $("input[name='PostQuery']").click();
                }
            }, {
                "name": "指给我的",
                "id": "AssignedTo",
                "fn": function () {
                    document.getElementById("SearchBug").reset();
                    $("#Field3").val("AssignedTo").trigger("change");
                    $("#Value3").val(getMyId()).trigger("change");
                    $("input[name='PostQuery']").click();
                }
            }];
            for (var j = 0; j < buttons.length; j++) {
                var button = buttons[j];
                var btn = $("<input type='button'>");
                btn.attr("value", button.name);
                btn.off("click").on("click", button.fn);
                toolbar.append(btn);
            }
        }
    }
    // ======================
    // Bug编辑界面
    // ======================
    // 附件的信息
    var $attachFile = $("#AttachFile");
    $attachFile.parents("dd").css({ "width": "100%" });
    $attachFile.attr("target", "_self");
    $("a[id^='TestFile']").each(function () {
        var $a = $(this);
        var click = $a.attr("onclick");
        $a.attr("onclick", click + "return false;");
    });

    // 添加一个快速回复列表
    try {
        if ($("#ResolvedBuild").length > 0 && $("#ResolvedBuild").attr("type") === "text" && $("#ResolvedBuild").val() === "") {
            $("#ResolvedBuild").val('git');
            $("#Resolution").val('Fixed');
            var list = ["问题被修复，已经打包", "更新HTML/JS/CSS文件，清除缓存", "更新应用资源：", "需求设计", "无法复现", "外部原因", "重复问题", "不值得修复"];
            var replyTip = $("<div></div>");
            $("#ReplyNote").after(replyTip);
            for (var i = 0; i < list.length; i++) {
                var reply = $("<span class='replyTip'>" + list[i] + "</span>");
                reply.on("click", function(){
                    $("#ReplyNote").val($(this).text());
                });
                replyTip.append(reply);
            }
        }
    } catch (e) {
    }
    //自动展示图片
    var aList = $(document.body).find("a[href^='FileInfo.php']");
    var imgArray = [];
    aList.each(function () {
        var a = $(this);
        var aInfo = {};
        var fileName = a.html().toLowerCase();
        if (fileName.indexOf(".png") > -1 || fileName.indexOf(".jpg") > -1 || fileName.indexOf(".jpeg") > -1 || fileName.indexOf(".gif") > -1) {
            aInfo.type = "img";
            aInfo.imgUrl = a.attr("href");
            aInfo.title = a.html();
            imgArray.push(aInfo);
        } else if (fileName.indexOf("mp4") > -1) {
            aInfo.type = "video";
            aInfo.fileType = "mp4";
            aInfo.imgUrl = a.attr("href");
            aInfo.title = a.html();
            imgArray.push(aInfo);
        }
    });
    if (imgArray.length > 0) {
        var div = $("<div></div>");
        $("#BugForm").append(div);
        div.css({
            marginLeft: 20,
            marginRight: 20
        });
        for (var i = 0; i < imgArray.length; i++) {
            var imgInfo = imgArray[i];
            var $img = $("<img src=''/>");
            var $video = $("<video controls></video>");
            var a = $("<fieldset style='margin-bottom:10px;'><legend>" + imgInfo.title + "</legend><img src=''/></fieldset>");
            if (imgInfo.type == "img") {
                var url = imgInfo.imgUrl;
                var img = a.find("img")[0];
                img.src = url;
                img.onload = function () {
                    var w = $(this).width();
                    var h = $(this).height();
                    if (w > h) {
                        if (w + 40 > $(window).width()) {
                            $(this).css({ "width": "100%" });
                        }
                        if (h + 200 > $(window).height()) {
                            $(this).css({ "width": "", "height": $(window).height() - 200 });
                        }
                    }
                    if (w < h) {
                        if (h + 40 > $(window).height()) {
                            $(this).css({ "height": $(window).height() - 200 });
                        }
                    }
                };
            } else if (imgInfo.type == "video") {
                $video.css({
                    width: "50%",
                    height: $(window).height() - 200
                });
                $video.append("<source src='" + imgInfo.imgUrl + "' type='video/" + imgInfo.fileType + "'>");
                a.find("img").remove();
                a.append($video);
            }
            div.append(a);
        }
    }

})();
