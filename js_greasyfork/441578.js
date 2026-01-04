    // ==UserScript==
    // @name         哔哩轻小说美化&自动翻页
    // @namespace    http://tampermonkey.net/
    // @version      0.3
    // @author       Okami
    // @include      *://www.linovelib.com/novel/*/*.html
    // @include      *://w.linovelib.com/novel/*/*.html
    // @description  新手自制哔哩轻小说美化&自动翻页
    // @grant        none
    // @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
    // @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/441578/%E5%93%94%E5%93%A9%E8%BD%BB%E5%B0%8F%E8%AF%B4%E7%BE%8E%E5%8C%96%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/441578/%E5%93%94%E5%93%A9%E8%BD%BB%E5%B0%8F%E8%AF%B4%E7%BE%8E%E5%8C%96%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
    // ==/UserScript==

    (function () {
        'use strict';

        // Your code here...
        $(document).ready(function () {
            changeCss();
            imageshow();
            var str = "";
            str += `
            <style>
                .wrap {
                    position: fixed;
                    top: 0;
                    left: 0;
                    background: rgba(0, 0, 0, 0.7);
                    z-index: 2;
                    width: 100%;
                    height: 100%;
                    display: none;
                }
            </style>
            <div id="outerdiv" class="wrap">
                <div id="innerdiv" style="position:absolute;">
                    <img id="bigimg" style="border:5px solid #fff;" src="" />
                </div>
            </div>
        `;

            $("body").append(str);
        })

        $(window).scroll(function () {
            var host = window.location.host;
            if (host == "www.linovelib.com") {
                if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                    var nextPagePath = ".mlfy_page>a:last";
                    var contextPath = "#mlfy_main_text";
                    var url = $(nextPagePath).prop('href');
                    var ismobile = 0;

                    getContext(url, nextPagePath, contextPath);
                }
            } else if (host == "w.linovelib.com") {
                if ($(document).scrollTop() + 10 >= $(document).height() - $(window).height()) {
                    var text = $("#aread>script").html();
                    var params = text.substring(text.indexOf("{"), text.indexOf("}") + 1).split(',')[1];
                    var url = params.substring(params.indexOf("'") + 1, params.indexOf("html") + 4);
                    var contextPath = "#apage";
                    var ismobile = 1;

                    getMoblieContext(url, contextPath);
                }
                clickpage();
            }
            changeCss()
            imageshow();
        });


        /**
        * @param url 网页路径
        * @param nextPagePath 下一页的js path
        * @param contextPath  文本内容的js path
        */
        function getContext(url, nextPagePath, contextPath) {
            $.ajax({
                type: "GET",
                url: url,
                dataType: "html",
                async: false,
                success: function (data) {
                    var response = $(data);

                    var text = response.children(contextPath)
                    if ("undefined" != typeof text) {
                        text.find("div[class='tp'],div[class='bd']").remove();
                        $(contextPath).append(text.html());
                    }

                    var nextPage = response.children(nextPagePath);
                    if ("undefined" != typeof nextPage) {
                        $(nextPagePath).prop("href", nextPage.prop("href"));
                        changeURLArg(nextPage.prop("href"));
                    }

                }
            })
        }
        /**
        * @param url 网页路径
        * @param contextPath  文本内容的js path
        */
        function getMoblieContext(url, contextPath) {
            $.ajax({
                type: "GET",
                url: url,
                dataType: "html",
                async: false,
                success: function (data) {
                    let response = $(data);

                    let text = response.find(contextPath)
                    if ("undefined" != typeof text) {
                        text.find("div[class='cgo']").remove();
                        $(contextPath).append(text.html());

                        changeURLArg(url);
                    }
                    let nextPage = response.text();
                    if ("undefined" != typeof nextPage) {
                        let params = nextPage.substring(nextPage.indexOf("{"), nextPage.indexOf("}") + 1);
                        $("#aread>script").html(params);
                    }
                }
            })
        }

        // 修改地址栏URL
        function changeURLArg(url) {
            var stateObject = {};
            history.pushState(stateObject, '', url);
        }

        function changeCss() {
            var host = window.location.host;

            if (host == "w.linovelib.com") {
                $('body').css("background", "#ffff")
                $('.cgo').remove()
                $('.acontent>p').css({
                    "margin": "0.8rem 0",
                    "line-height": "27px",
                    "font": "16px / 36px 'PingFang SC', -apple-system, 'SF UI Text', 'Lucida Grande', STheiti, 'Microsoft YaHei', sans-serif"
                })

            } else {
                $('body').css("background", "#eef0f4")
                $('.mlfy_main').css("background", "#ffff")
                $('.ap_container,.bd').remove()
                $('.read-content>p').css({
                    "line-height": "50px",
                    "color": "black!important",
                    "margin": ".5rem 0px",
                    "font": "16px / 36px 'PingFang SC', -apple-system, 'SF UI Text', 'Lucida Grande', STheiti, 'Microsoft YaHei', sans-serif"
                }, 0)
            }
        }

        function imageshow() {
            $("img").click(function () {
                var _this = $(this);//将当前的pimg元素作为_this传入函数
                imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);
            });

            function imgShow(outerdiv, innerdiv, bigimg, _this) {
                var src = _this.attr("src");//获取当前点击的pimg元素中的src属性
                $(bigimg).attr("src", src);//设置#bigimg元素的src属性

                /*获取当前点击图片的真实大小，并显示弹出层及大图*/
                $("<img/>").attr("src", src).on('load',function () {
                    var windowW = $(window).width();//获取当前窗口宽度
                    var windowH = $(window).height();//获取当前窗口高度
                    var realWidth = this.width;//获取图片真实宽度
                    var realHeight = this.height;//获取图片真实高度
                    var imgWidth, imgHeight;
                    var scale = 0.8;//缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放
                    if (realHeight > windowH * scale) {//判断图片高度
                        imgHeight = windowH * scale;//如大于窗口高度，图片高度进行缩放
                        imgWidth = imgHeight / realHeight * realWidth;//等比例缩放宽度
                        if (imgWidth > windowW * scale) {//如宽度扔大于窗口宽度
                            imgWidth = windowW * scale;//再对宽度进行缩放
                        }
                    } else if (realWidth > windowW * scale) {//如图片高度合适，判断图片宽度
                        imgWidth = windowW * scale;//如大于窗口宽度，图片宽度进行缩放
                        imgHeight = imgWidth / realWidth * realHeight;//等比例缩放高度
                    } else {//如果图片真实高度和宽度都符合要求，高宽不变
                        imgWidth = realWidth;
                        imgHeight = realHeight;
                    }
                    $(bigimg).css("width", imgWidth);//以最终的宽度对图片缩放
                    var w = (windowW - imgWidth) / 2;//计算图片与窗口左边距
                    var h = (windowH - imgHeight) / 2;//计算图片与窗口上边距
                    $(innerdiv).css({ "top": h, "left": w });//设置#innerdiv的top和left属性
                    $(outerdiv).fadeIn("fast");//淡入显示#outerdiv及.goal_img
                });
                $(outerdiv).click(function () {//再次点击淡出消失弹出层
                    $(this).fadeOut("fast");
                });
            }
        }

        function clickpage () {
            $("#apage").click(function(){
                ReadTools.CallTools()
            })
        }


    })();