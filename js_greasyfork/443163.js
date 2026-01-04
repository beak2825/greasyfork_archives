// ==UserScript==
// @name         LYS-人民法院系统证据提取
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  提取证据地址!
// @author       QS-LYS
// @match        http://dwwtjd.court.gov.cn/*
// @require      https://cdn.staticfile.org/sweetalert/2.1.2/sweetalert.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=court.gov.cn
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443163/LYS-%E4%BA%BA%E6%B0%91%E6%B3%95%E9%99%A2%E7%B3%BB%E7%BB%9F%E8%AF%81%E6%8D%AE%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/443163/LYS-%E4%BA%BA%E6%B0%91%E6%B3%95%E9%99%A2%E7%B3%BB%E7%BB%9F%E8%AF%81%E6%8D%AE%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var css1 = `<style>
    .lys {
        /* padding: 1px 1px; */
        border: unset;
        border-radius: 15px;
        color: #212121;
        z-index: 1;
        background: #e8e8e8;
        position: absolute;
        font-weight: 1000;
        font-size: 15px;
        -webkit-box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
        box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
        transition: all 250ms;
        overflow: hidden;
        height: 30px;
        width: 247px;
        text-align: center;
    }
    .lys::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 0;
        border-radius: 15px;
        background-color: #212121;
        z-index: -1;
        -webkit-box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
        box-shadow: 4px 8px 19px -3px rgba(0,0,0,0.27);
        transition: all 250ms
       }
       .lys:hover {
        color: #e8e8e8;
       }
       .lys:hover::before {
        width: 100%;
       }
       </style>`
    var txt0 = ""
    var txt1 = ""
    var txt2 = ""
    var JDR1val = ""
    var JDR2val = ""
    var txt = ""
    var tm = setInterval(function () {
        var url = window.href
        if (url.indexOf("view_evidence") >= 0) {
            console.log("当前为证据详情页面！")
            if ($("div.col-xs-12.Evidence_list_cont_r_h:contains('证据信息')")) {
                $('head').append(css1)
                txt0 = "<span>LYS助手：</span>"
                txt1 = "<button class='lys'style='margin-left: 60px' onclick='lys()'>提取补充证据材料(图片)地址</button>"
                txt2 = "<button class='lys'style='margin-left: 366px' onclick='lys1()'>提取全部证据材料(图片)地址</button>"
                $("div.col-xs-12.Evidence_list_cont_r_h:contains('证据信息')").before(txt0, txt1, txt2)
                window.copyToClipboard = function (s) {
                    if (window.clipboardData) {
                        window.clipboardData.setData('text', s);
                    } else {
                        (function (s) {
                            document.oncopy = function (e) {
                                e.clipboardData.setData('text', s);
                                e.preventDefault();
                                document.oncopy = null;
                            }
                        })(s);
                        document.execCommand('Copy');

                    }
                }

                window.lys = function () {
                    txt = ""
                    $('div.evidence-box.row.ng-scope:contains("补充证据")').each(function () {
                        txt = txt + "http://dwwtjd.court.gov.cn" + $(this).find("img").attr("alt") + " \n"
                    });
                    if (txt == "") {

                        swal("提醒", "@CodeBy LiYunShi：未能提取到补充证据(图片)地址，请核实！", "warning", {
                            button: "我已知晓！"
                        });
                    } else {
                        copyToClipboard(txt);

                        swal("提醒", "@CodeBy LiYunShi：全部证据地址已经提取至剪切板！请移步IDM等下载工具批量下载！", "success", {
                            button: "我已知晓！"
                        });
                    }
                };

                window.lys1 = function () {
                    var txt = ""
                    $('img.gallery-pic.cur-pointer.ng-scope').each(function () {
                        if ($(this).attr("alt")) {
                            txt = txt + "http://dwwtjd.court.gov.cn" + $(this).attr("alt") + " \n"
                        }
                    });
                    if (txt == "") {
                        swal("提醒", "@CodeBy LiYunShi：未能提取到证据(图片)地址，请核实！", "warning", {
                            button: "我已知晓！"
                        });
                    } else {
                        copyToClipboard(txt);
                        swal("提醒", "@CodeBy LiYunShi：全部证据地址已经提取至剪切板！请移步IDM等下载工具批量下载！", "success", {
                            button: "我已知晓！"
                        });
                    }
                };

                clearInterval(tm)
            }
        }

        if (url.indexOf("appraisalQueryListDetail/") >= 0 && $("button:contains('发送鉴定报告')").text()=="发送鉴定报告") {
            clearInterval(tm)
            console.log("当前为发送报告详情页面！")

            function selectJDR(JDR1, JDR2) {
                JDR1val = $("select option:contains(" + JDR1 + ")").eq(0).val();
                JDR2val = $("select option:contains(" + JDR2 + ")").eq(1).val();
                if (typeof JDR2val != "undefined" && typeof JDR1val != "undefined") {
                    $("select").eq(0).val(JDR1val);
                    $("select").eq(1).val(JDR2val);
                } else {
                    swal("提醒", "@CodeBy LiYunShi：部分鉴定人不存在！", "warning", {
                        button: "我已知晓！"
                    });
                }
            }
            swal({
                content: {
                    element: "input",
                    attributes: {
                        placeholder: "刘双城#孙研（一定以#隔开）"
                    }
                }
            }).then((value) => {
                if (`${value}`.includes("#")) {
                    window.arr = `${value}`.split("#");
                    if (window.arr.length == 2) {
                        selectJDR(window.arr[0], window.arr[1]);
                    } else {
                        //……                   
                    }
                } else {
                    swal("提醒", "@CodeBy LiYunShi：输入信息不是规范的格式，请核实重试！", "warning", {
                        button: "我已知晓！"
                    });
                }
            })
        }

    }, 200)

})();