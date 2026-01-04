// ==UserScript==
// @name         QS-LYS 江苏省司法行政系统上传助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  QS-LYS 江苏省司法行政系统上传助手！暂时版-2022.04.26
// @author       LYS
// @match        */sfjd/index.html
// @require      https://cdn.staticfile.org/sweetalert/2.1.2/sweetalert.min.js
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444028/QS-LYS%20%E6%B1%9F%E8%8B%8F%E7%9C%81%E5%8F%B8%E6%B3%95%E8%A1%8C%E6%94%BF%E7%B3%BB%E7%BB%9F%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/444028/QS-LYS%20%E6%B1%9F%E8%8B%8F%E7%9C%81%E5%8F%B8%E6%B3%95%E8%A1%8C%E6%94%BF%E7%B3%BB%E7%BB%9F%E4%B8%8A%E4%BC%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var css1 = '<style>\
    .lys {\
        /* padding: 1px 1px; */\
        border: unset;\
        border-radius: 15px;\
        color: #212121;\
        z-index: 1;\
        background: #e8e8e8;\
        position: fixed;\
        font-weight: 1000;\
        font-size: 15px;\
        -webkit-box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);\
        box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);\
        transition: all 250ms;\
        overflow: hidden;\
        margin-left: 666px;\
        height: 30px;\
        width: 247px;\
        text-align: center;\
    }\
    .lys::before {\
        content: "";\
        position: absolute;\
        top: 0;\
        left: 0;\
        height: 100%;\
        width: 0;\
        border-radius: 15px;\
        background-color: #212121;\
        z-index: -1;\
        -webkit-box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);\
        box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);\
        transition: all 250ms\
       }\
       \
       .lys:hover {\
        color: #e8e8e8;\
       }\
       \
       .lys:hover::before {\
        width: 100%;\
       }\
       </style>'

    var txt1 = "<button class='lys' onclick='lys()'>LYS助手：START！</button>"
    var tm = setInterval(function () {
        if ($("#fisrt_menuname")) {
            $('head').append(css1)
            $("#fisrt_menuname").after(txt1)
            clearInterval(tm)
        }
    }, 200);

    window.lys = function () {
        if ($('li:contains("实施鉴定")').eq(0).attr('class') != undefined) {
            if ($('li:contains("实施鉴定")').eq(0).attr('class').includes("selected")) {
                console.log("ok")
                var anjianbh = $('.redcos.ng-binding').eq(0).text();
                var anjianbh1 = anjianbh.split("[")
                var anjianbh2 = anjianbh1[1].split("]")
                var REanjianbh1 = anjianbh2[0]
                var anjianbh3 = anjianbh.split("第")
                var anjianbh4 = anjianbh3[1].split("号")
                var Reanjianbh = REanjianbh1 + "-" + anjianbh4[0]

                copyToClipboard(Reanjianbh)
                swal({
                    content: {
                        element: "input",
                        attributes: {
                            placeholder: "LYS提醒：请粘贴在这里！",
                            type: "password",
                        },
                    },
                }).then((value) => {
                    if (`${value}`.includes("#")) {

                        window.arr = `${value}`.split("#")
                        if (window.arr.length == 7) {
                            copyToClipboard(window.arr[6])
                            window.autoTB()

                        } else {
                            swal("提醒", "@CodeBy LiYunShi：输入信息不是规范的格式，请核实重试！", "warning", {
                                button: "我已知晓！"
                            });
                        }
                    } else {
                        swal("提醒", "@CodeBy LiYunShi：输入信息不是规范的格式，请核实重试！", "warning", {
                            button: "我已知晓！"
                        });
                    }
                });
            } else {
                swal("提醒", "@CodeBy LiYunShi：请确认案件进入实施鉴定状态下再进行此操作！", "warning", {
                    button: "我已知晓！"
                });
            }
        } else {
            swal("提醒", "@CodeBy LiYunShi：请进入案件办理页面再进行此操作！", "warning", {
                button: "我已知晓！"
            });
        }
    }

    window.autoTB = function () {
        $('[name=sflybjgwsb]')[1].click(); //选择外部设备

        $('[ng-click="openActivity();"]').click(); //点击添加

        $('[name=acstarttime]').val(window.arr[1]); //添加起始时间
        $('[name=acstarttime]').trigger('change');
        $('[name=acendtime]').val(window.arr[2]);
        $('[name=acendtime]').trigger('change');

        if (arr[4] != "null") { //添加在场人员
            $('[name=presentpeople]').val(window.arr[4]);
            $('[name=presentpeople]').trigger('change');
        }


        window.lys1 = setInterval(function () {
            if ($('[name=acjdxm]').val() != "" && $('[name=jdplace]').val() != "") {



                if (window.arr[0] != "null") { //填写项目
                    $('[name=acjdxm]').val(window.arr[0]);
                    $('[name=acjdxm]').trigger('change');;
                }

                if (arr[3] != "null") {
                    $('[name=jdplace]').val(window.arr[3]); //添加鉴定地址
                    $('[name=jdplace]').trigger('change');
                }

                $('[ng-click="saveActivity()"]').click(); //提交保存

                $('[name=dyjdryj]').val(window.arr[5]); //添加第一鉴定人意见
                $('[name=dyjdryj]').trigger('change');

                $('[uploader="uploadFile($file)"]').children().eq(0).click(); //打开上传


                clearInterval(lys1)
            }
        }, 500)
    }

    window.copyToClipboard = function (s) {
        if (!s || typeof s !== 'string') {
            throw new Error('参数必须是字符串类型');
        }

        if (navigator.clipboard) {
            navigator.clipboard.writeText(s)
                .then(() => {
                    console.log('文本已复制到剪切板');
                })
                .catch((err) => {
                    console.error('复制失败：', err);
                });
        } else {
            var textarea = document.createElement('textarea');
            textarea.value = s;
            textarea.style.position = 'fixed';

            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            try {
                document.execCommand('copy');
                console.log('文本已复制到剪切板');
            } catch (error) {
                console.error('复制失败: ', error);
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }
})();