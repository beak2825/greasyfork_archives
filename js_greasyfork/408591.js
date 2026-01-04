// ==UserScript==
// @name         global_oss
// @namespace    global_oss
// @description  审核过程的错误提示, Error tips during the review process
// @homepageURL  https://greasyfork.org/scripts/408591-global-oss
// @version      2.02
// @exclude      https://global-oss.zmqdez.com/front_end/index.html#/country
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @include      https://global-oss*
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @connect      oapi.dingtalk.com
// @connect      jinshuju.net
// @run-at       document-idle
// @author       zhousanfu
// @copyright    2020 zhousanfu@hellofun.cn
// @downloadURL https://update.greasyfork.org/scripts/408591/global_oss.user.js
// @updateURL https://update.greasyfork.org/scripts/408591/global_oss.meta.js
// ==/UserScript==


// IN-GRS
// Admin(IN2)
// censor(IN)
// RUNN
// RUKA
// 印尼环境监控
// 印尼内容安全
// 举报类型  ：特征即告警


// IN-GRS
// Admin(IN2)
// censor(IN)
// 举报类型：OCR即告警


// IN-GRS
// Admin(IN2)
// censor(IN)
// RUNN
// RUKA
// 印尼环境监控
// 印尼内容安全
// 埃及环境监控
// 发布者：！=普通用户


// Foiwe/FWS/GRS
// 举报类型：OCR、feature、Blacklistauto即告警


// RUNN/RUKA
// 举报类型：feature、Blacklistauto即告警


var operator_prefix = ["IN-G", "Admi", "cens", "RUNN", "RUKA", "印尼环境", "印尼内容", ,"埃及", "佛山"] //自有机审举报，举报类型勾选Feature
var operator_prefix_2 = ["IN-G", "Admi", "cens"] //自有机审举报，举报类型勾选OCR要告警
var operator_prefix_3 = ["Foiwe", "FWS", "GRS"] //（OCR、feature和Blacklistauto都不能勾选
var operator_prefix_4 = ["RUNN", "RUKA"] //勾选feature Blacklistauto即告警
var url = window.location.href;
//console.log(url)
var cou = 0;
var sta_time = 0;
var end_time = 0;
var grand_time = 0;
var flag = true;

var impeach;
var graphi;
var jinshuju;
var oa_err;
var video;
var calculate;

if (url.indexOf("video/impeach-audit") >= 0) {
    impeach = setInterval(impeachf, 1000);
    jinshuju = setInterval(jinshujuf, 1000);
} else if (url.indexOf("front_end/index.html#/audit/index") >= 0) {
    graphi = setInterval(graphif, 5000);
    jinshuju = setInterval(jinshujuf, 1000);
} else if (url.indexOf("tags/audit/video") >= 0) {
    video = setInterval(cps_audit_video, 10000);
    jinshuju = setInterval(jinshujuf, 1000);
} else if (url.indexOf("tags/audit/video") >= 0) {
    calculate;
    setInterval(function() {
        //console.log("cou:" + cou + "--" + "grand_time:" + grand_time + "/" + (cou==0?0:grand_time/cou));
        if(cou > 2){
            alert("平均每单用时<=5秒，请注意时效")
        };
        if(cou > 1 && (grand_time/cou) <= 5 * 1000){
            alert("平均每单用时<=5秒，请注意时效")
        }
        cou = 0;//每十秒重新计算审核数
        grand_time = 0;//每十秒重置时间差计算
        sta_time = new Date().valueOf();//每十秒重置开始时间为当前十秒的开始时间
    }, 1000 * 10);
} else {
    jinshuju = setInterval(jinshujuf, 1000)
}


//钉钉
function dingtalk(text) {
    GM.xmlHttpRequest({
        method: "POST",
        url: "https://oapi.dingtalk.com/robot/send?access_token=5b0fe9011f91721749733be44a7c580c8e52766ee050104fbe832d447675c761",
        //url: "https://oapi.dingtalk.com/robot/send?access_token=5ada8acb2c3b685811f6bb2be8607dec595820f26fb5afac65561e60406e3657",
        data: JSON.stringify({ "msgtype": "text", "text": { "content": text + '<v2.02>' } }),
        headers: { "Content-Type": "application/json" },
        onload: function (response) {
            //console.log(response.responseText)
            return JSON.parse(response.responseText)
            //     if (response.responseText.indexOf("Logged in as") > -1) {
            //       location.href = "http://www.example.net/dashboard";
            //     }
        }
    });
}

//高危视频
function impeachf() {
    //console.log("impeachf");
    //console.log(GM_getValue('oa_err') + '错误次数' + GM_getValue('operator_name'))
    try {
        let source = $("#source").val(); // 审核类型
        let reason = $("#reason").val(); // 举报类型
        let report_text = document.querySelector("span.selection > span").innerText.split('×')
        let publisher = $("#rank").val() // 发布者
        let publisher_text = $("#rank").find("option:selected").text();
        let operator_name = $(".dropdown-toggle > span").text();
        GM_setValue('operator_name', operator_name)

        for (let i = 0; i <= operator_prefix.length; i++) {
            if (operator_name.indexOf(operator_prefix[i]) >= 0) {

                // 审核类型 = 自有机审举报4||全部-1
                if (source == 4 || source == -1) {
                    //发布者不为 普通用户 告警
                    if (publisher != 0) {
                        dingtalk(operator_name + "\tMis-selection-(Video Report audit：Publisher) = " + publisher_text)
                        if (GM_getValue('oa_err') >= 0) {
                            //console.log(GM_getValue('oa_err') + "存在")
                            oa_err = GM_getValue('oa_err');
                            oa_err = oa_err + 1;
                            GM_setValue('oa_err', oa_err);
                        } else {
                            GM_setValue('oa_err', 0)
                            //console.log(GM_getValue('oa_err') + "不存在")
                        }
                        alert(operator_name + '\npublisher：' + publisher_text + '\npls check your audit source,thanks');
                        clearInterval(impeach)
                    }
                    // 举报类型 包含feature
                    else if (reason.indexOf("15") >= 0) {
                        console.log(report_text)
                        dingtalk(operator_name + "\tMis-selection-(Video Report type：Report type) = " + report_text)
                        if (GM_getValue('oa_err') >= 0) {
                            //console.log(GM_getValue('oa_err') + "存在")
                            oa_err = GM_getValue('oa_err');
                            oa_err = oa_err + 1;
                            GM_setValue('oa_err', oa_err);
                        } else {
                            GM_setValue('oa_err', 0)
                            //console.log(GM_getValue('oa_err') + "不存在")
                        }
                        alert(operator_name + '\nReport type:' + report_text + '\npls check your audit source,thanks');
                        clearInterval(impeach)
                    }

                }//end 审核类型 = 自有机审举报||全部
            };//end 包含区域前缀
        }

        for (let i = 0; i <= operator_prefix_2.length; i++) {
            //自有机审举报，举报类型勾选OCR要告警
            //console.log(operator_name.substring(0, 4))
            if (operator_name.indexOf(operator_prefix_2[i]) >= 0) {
                //console.log(operator_name);
                if (source == 4 || source == -1) {
                    if (reason.indexOf("19") >= 0) {
                        dingtalk(operator_name + "\tMis-selection-(Video Report type：Report type) = " + report_text)
                        if (GM_getValue('oa_err') >= 0) {
                            //console.log(GM_getValue('oa_err') + "存在")
                            oa_err = GM_getValue('oa_err');
                            oa_err = oa_err + 1;
                            GM_setValue('oa_err', oa_err);
                        } else {
                            GM_setValue('oa_err', 0)
                            //console.log(GM_getValue('oa_err') + "不存在")
                        }
                        alert(operator_name + '\nReport type:' + report_text + '\npls check your audit source,thanks');
                        clearInterval(impeach)
                    }
                }
            }
        }

        for (let i = 0; i <= operator_prefix_3.length; i++) {
            if (operator_name.indexOf(operator_prefix_3[i]) >= 0) {
                if (source == 4 || source == -1) {
                    if (reason.indexOf("19") >= 0 || reason.indexOf("15") >= 0 || reason.indexOf("30") >= 0) {
                        dingtalk(operator_name + "\tMis-selection-(Video Report type：Report type) = " + report_text)
                        if (GM_getValue('oa_err') >= 0) {
                            //console.log(GM_getValue('oa_err') + "存在")
                            oa_err = GM_getValue('oa_err');
                            oa_err = oa_err + 1;
                            GM_setValue('oa_err', oa_err);
                        }
                        else {
                            GM_setValue('oa_err', 0)
                        }
                        alert(operator_name + '\nReport type:' + report_text + '\npls check your audit source,thanks');
                        clearInterval(impeach)
                    }
                }
            }
        }

        for (let i = 0; i <= operator_prefix_4.length; i++) {
            if (operator_name.indexOf(operator_prefix_4[i]) >= 0) {
                if (source == 4 || source == -1) {
                    if (reason.indexOf("15") >= 0 || reason.indexOf("30") >= 0) {
                        dingtalk(operator_name + "\tMis-selection-(Video Report type：Report type) = " + report_text)
                        if (GM_getValue('oa_err') >= 0) {
                            oa_err = GM_getValue('oa_err');
                            oa_err = oa_err + 1;
                            GM_setValue('oa_err', oa_err);
                        }
                        else {
                            GM_setValue('oa_err', 0)
                        }
                        alert(operator_name + '\nReport type:' + report_text + '\npls check your audit source,thanks');
                        clearInterval(impeach)
                    }
                }
            }
        }


        if (operator_name.indexOf("成都") >= 0) {
            //console.log("是成都地区");
            if (reason.indexOf("15") >= 0 || reason.indexOf("18") >= 0 || reason.indexOf("16") >= 0 || reason.indexOf("17") >= 0 || reason.indexOf("19") >= 0 || reason.indexOf("20") >= 0) {
                //console.log("包含不应该选的举报类型");
                if (GM_getValue('oa_err') >= 0) {
                    //console.log(GM_getValue('oa_err') + "存在")
                    oa_err = GM_getValue('oa_err');
                    oa_err = oa_err + 1;
                    GM_setValue('oa_err', oa_err);
                } else {
                    GM_setValue('oa_err', 0)
                    //console.log(GM_getValue('oa_err') + "不存在")
                }
                dingtalk(operator_name + "\t高危视频审核-举报类型：" + report_text)
                alert(operator_name + '\n高危视频审核-举报类型：' + report_text + '\n这个工单不在您的审核范围中');
                clearInterval(impeach)
            }
            else if (document.querySelector("#audit-content > div.panel-float.panel-heading > div > div.info-text > span:nth-child(4)").innerText.substr(0, 2) == "ID") {
                dingtalk(operator_name + "\t国家码选择错误：ID")
                if (GM_getValue('oa_err') >= 0) {
                    //console.log(GM_getValue('oa_err') + "存在")
                    oa_err = GM_getValue('oa_err');
                    oa_err = oa_err + 1;
                    GM_setValue('oa_err', oa_err);
                } else {
                    GM_setValue('oa_err', 0)
                    //console.log(GM_getValue('oa_err') + "不存在")
                }
                alert(operator_name + '\n\国家码选择错误：ID');
                clearInterval(impeach)
            }
        }; //end 成都区域

        if (document.querySelector("#audit-form > button.btn.btn-danger.btn-sm.stop-audit")) {
            if (reason == null) {
                dingtalk(operator_name + "\tReport type = null ")
                if (GM_getValue('oa_err') >= 0) {
                    //console.log(GM_getValue('oa_err') + "存在")
                    oa_err = GM_getValue('oa_err');
                    oa_err = oa_err + 1;
                    GM_setValue('oa_err', oa_err);
                } else {
                    GM_setValue('oa_err', 0)
                    //console.log(GM_getValue('oa_err') + "不存在")
                };
                alert(operator_name + '\nReport type = null \npls check your audit source,thanks');
                clearInterval(impeach)
            }
        };


    }// try
    catch (err) { }
};

//图文审核
function graphif() {
    //console.log("graphicf");
    //console.log(GM_getValue('oa_err') + '错误次数')
    let confirm_va;
    let businessname = document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.ant-card.ant-card-bordered > div > div.search-options-wrapper > div.search-options > div:nth-child(2) > div > div > div.ant-select-selection-selected-value").innerText;
    let operator_name = document.querySelector("#app > div.layout.ant-layout > div.header-wrapper.ant-layout-header > div.header > div > div > span").innerText;
    GM_setValue('operator_name', operator_name)

    for (let i = 0; i <= operator_prefix.length; i++) {
        if (operator_name.indexOf(operator_prefix[i]) >= 0) {
            //console.log(operator_prefix)
            if (businessname.indexOf("一审") >= 0 || businessname.indexOf("first review") >= 0 || businessname.indexOf("first_review") >= 0) {
                let announcer = document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.ant-card.ant-card-bordered > div > div.search-options-wrapper > div.search-options > span > div:nth-child(5) > div > div > ul");
                //console.log("一审")
                if (announcer.innerText.indexOf("普通用户") >= 0 || announcer.innerText.indexOf("commonly user") >= 0) {
                    //console.log("包含普通用户")
                    if (announcer.childElementCount > 2) {
                        //console.log("包含普通用户》6")
                        dingtalk(operator_name + "\tMis-selection-(Content audit platform：first review-publisher) = " + announcer.innerText)
                        if (GM_getValue('oa_err') >= 0) {
                            //console.log(GM_getValue('oa_err') + "存在")
                            oa_err = GM_getValue('oa_err');
                            oa_err = oa_err + 1;
                            GM_setValue('oa_err', oa_err);
                        } else {
                            GM_setValue('oa_err', 0)
                            //console.log(GM_getValue('oa_err') + "不存在")
                        }
                        confirm_va = confirm(operator_name + 'first review Publisher：' + announcer + '\npls check your audit source,thanks');
                    }
                } else if (announcer.childElementCount > 1) {
                    //console.log("不包含普通用户")
                    dingtalk(operator_name + "\tMis-selection-(Content audit platform：first review-publisher) = " + announcer.innerText)
                    if (GM_getValue('oa_err') >= 0) {
                        //console.log(GM_getValue('oa_err') + "存在")
                        oa_err = GM_getValue('oa_err');
                        oa_err = oa_err + 1;
                        GM_setValue('oa_err', oa_err);
                    } else {
                        GM_setValue('oa_err', 0)
                        //console.log(GM_getValue('oa_err') + "不存在")
                    }
                    confirm_va = confirm(operator_name + 'first review Publisher：' + announcer + '\npls check your audit source,thanks');
                };
            };

            if (businessname.indexOf("二审") >= 0 || businessname.indexOf("post_review") >= 0 || businessname.indexOf("post review") >= 0) {
                let announcer_2 = document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.ant-card.ant-card-bordered > div > div.search-options-wrapper > div.search-options > span > div:nth-child(4) > div > div > ul");
                //console.log("二审")
                if (announcer_2.innerText.indexOf("普通用户") >= 0 || announcer_2.innerText.indexOf("commonly user") >= 0) {
                    //console.log("包含普通用户")
                    if (announcer_2.childElementCount > 2) {
                        dingtalk(operator_name + "\tMis-selection-(Content audit platform：post review-publisher) = " + announcer_2.innerText)
                        if (GM_getValue('oa_err') >= 0) {
                            //console.log(GM_getValue('oa_err') + "存在")
                            oa_err = GM_getValue('oa_err');
                            oa_err = oa_err + 1;
                            GM_setValue('oa_err', oa_err);
                        } else {
                            GM_setValue('oa_err', 0)
                            //console.log(GM_getValue('oa_err') + "不存在")
                        }
                        confirm(operator_name + 'first review Publisher：' + announcer_2.innerText + '\npls check your audit source,thanks');
                    }
                } else if (announcer_2.childElementCount > 1) {
                    dingtalk(operator_name + "\tMis-selection-(Content audit platform：post review-publisher) = " + announcer_2.innerText)
                    if (GM_getValue('oa_err') >= 0) {
                        //console.log(GM_getValue('oa_err') + "存在")
                        oa_err = GM_getValue('oa_err');
                        oa_err = oa_err + 1;
                        GM_setValue('oa_err', oa_err);
                    } else {
                        GM_setValue('oa_err', 0)
                        //console.log(GM_getValue('oa_err') + "不存在")
                    }
                    confirm(operator_name + 'first review Publisher：' + announcer_2.innerText + '\npls check your audit source,thanks');
                }
            };

            if (businessname.indexOf("用户举报") >= 0 || businessname.indexOf("user_report") >= 0 || businessname.indexOf("user report") >= 0) {
                let announcer_3 = document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.ant-card.ant-card-bordered.ant-card-padding-transition > div > div.search-options-wrapper > div.search-options > span > div:nth-child(4) > div > div > ul")
                //console.log("用户举报")
                if (announcer_3.innerText.indexOf("普通用户") >= 0 || announcer_3.innerText.indexOf("commonly user") >= 0) {
                    //console.log("包含普通用户")
                    if (announcer_3.childElementCount > 2) {
                        dingtalk(operator_name + "\tMis-selection-(Content audit platform：user report-publisher) = " + announcer_3.innerText)
                        if (GM_getValue('oa_err') >= 0) {
                            //console.log(GM_getValue('oa_err') + "存在")
                            oa_err = GM_getValue('oa_err');
                            oa_err = oa_err + 1;
                            GM_setValue('oa_err', oa_err);
                        } else {
                            GM_setValue('oa_err', 0)
                            //console.log(GM_getValue('oa_err') + "不存在")
                        }
                        confirm(operator_name + 'first review Publisher：' + announcer_3.innerText + '\npls check your audit source,thanks');
                    }
                } else if (announcer_3.childElementCount > 1) {
                    dingtalk(operator_name + "\tMis-selection-(Content audit platform：user report-publisher) = " + announcer_3.innerText)
                    if (GM_getValue('oa_err') >= 0) {
                        //console.log(GM_getValue('oa_err') + "存在")
                        oa_err = GM_getValue('oa_err');
                        oa_err = oa_err + 1;
                        GM_setValue('oa_err', oa_err);
                    } else {
                        GM_setValue('oa_err', 0)
                        //console.log(GM_getValue('oa_err') + "不存在")
                    }
                    confirm(operator_name + 'first review Publisher：' + announcer_3.innerText + '\npls check your audit source,thanks');
                }
            };
        };
    }
};

//中控视频审核
function cps_audit_video() {

    let reason = document.querySelector("div.left > div.search-options > span > div:nth-child(3) > div > div > ul").innerText.split('\n'); // 举报类型
    let publisher = document.querySelector("div.left > div.search-options > span > div:nth-child(2) > div > div > ul").innerText.split('\n'); // 发布者
    let operator_name = document.querySelector("#app > section > header > div.header > div > div > span > span:nth-child(2)").innerText;
    GM_setValue('operator_name', operator_name)

    for (let i = 0; i <= operator_prefix.length; i++) {
        if (operator_name.indexOf(operator_prefix[i]) >= 0) {
            if (publisher.indexOf("UGC")>=0||publisher.indexOf(" обычный пользователь")>=0||publisher.indexOf("cps_auto_48_machine_video.product_attribute_common")) {
                if (publisher.length >= 3) {
                    dingtalk(operator_name + "\tMis-selection-(Video Report audit：Publisher) = " + publisher)
                    if (GM_getValue('oa_err') >= 0) {
                        //console.log(GM_getValue('oa_err') + "存在")
                        oa_err = GM_getValue('oa_err');
                        oa_err = oa_err + 1;
                        GM_setValue('oa_err', oa_err);
                    } else {
                        GM_setValue('oa_err', 0)
                        //console.log(GM_getValue('oa_err') + "不存在")
                    }
                    alert(operator_name + '\npublisher：' + publisher + '\npls check your audit source,thanks');
                }
            } else {
                if (publisher.length >= 2) {
                    dingtalk(operator_name + "\tMis-selection-(Video Report audit：Publisher) = " + publisher)
                    if (GM_getValue('oa_err') >= 0) {
                        //console.log(GM_getValue('oa_err') + "存在")
                        oa_err = GM_getValue('oa_err');
                        oa_err = oa_err + 1;
                        GM_setValue('oa_err', oa_err);
                    } else {
                        GM_setValue('oa_err', 0)
                        //console.log(GM_getValue('oa_err') + "不存在")
                    }
                    alert(operator_name + '\npublisher：' + publisher + '\npls check your audit source,thanks');
                }
            }

        };//end 包含区域前缀
    }

    for (let i = 0; i <= operator_prefix_2.length; i++) {
        if (operator_name.indexOf(operator_prefix_2[i]) >= 0) {
            if (reason.indexOf("OCR")>=0||reason.indexOf("reason_machine_ocr")>=0) {
                dingtalk(operator_name + "\tMis-selection-(Video Report audit：Publisher) = " + reason)
                if (GM_getValue('oa_err') >= 0) {
                    oa_err = GM_getValue('oa_err');
                    oa_err = oa_err + 1;
                    GM_setValue('oa_err', oa_err);
                } else {
                    GM_setValue('oa_err', 0)
                }
                alert(operator_name + '\npublisher：' + reason + '\npls check your audit source,thanks');
            }
        };//end 包含区域前缀
    }

    for (let i = 0; i <= operator_prefix_3.length; i++) {
        if (operator_name.indexOf(operator_prefix_3[i]) >= 0) {
            if (reason.indexOf("Feature Library")>=0||reason.indexOf("Blacklist")>=0||reason.indexOf("OCR")>=0||reason.indexOf("reason_machine_ocr")>=0||reason.indexOf("reason_machine_blacklistauto")>=0||reason.indexOf("reason_machine_feature_lib")>=0||reason.indexOf("черный лист")>=0||reason.indexOf("библиотека характеристик")>=0) {
                dingtalk(operator_name + "\tMis-selection-(Video Report audit：Publisher) = " + reason)
                if (GM_getValue('oa_err') >= 0) {
                    oa_err = GM_getValue('oa_err');
                    oa_err = oa_err + 1;
                    GM_setValue('oa_err', oa_err);
                } else {
                    GM_setValue('oa_err', 0)
                }
                alert(operator_name + '\npublisher：' + reason + '\npls check your audit source,thanks');
            }
        };//end 包含区域前缀
    }

    for (let i = 0; i <= operator_prefix_4.length; i++) {
        if (operator_name.indexOf(operator_prefix_4[i]) >= 0) {
            if (reason.indexOf("Feature Library")>=0||reason.indexOf("Blacklist")>=0||reason.indexOf("reason_machine_blacklistauto")>=0||reason.indexOf("reason_machine_feature_lib")>=0||reason.indexOf("черный лист")>=0||reason.indexOf("библиотека характеристик")>=0) {
                dingtalk(operator_name + "\tMis-selection-(Video Report audit：Publisher) = " + reason)
                if (GM_getValue('oa_err') >= 0) {
                    oa_err = GM_getValue('oa_err');
                    oa_err = oa_err + 1;
                    GM_setValue('oa_err', oa_err);
                } else {
                    GM_setValue('oa_err', 0)
                }
                alert(operator_name + '\npublisher：' + reason + '\npls check your audit source,thanks');
            }
        };//end 包含区域前缀
    }

    // 举报类型=NULl
    if (document.querySelector("div.tags-audit-search-wrapper.tags-audit-search.ant-card.ant-card-bordered > div > div > div.right > button").className == "ant-btn ant-btn-danger"){
        if (document.querySelector("div.left > div.search-options > span > div:nth-child(3) > div > div > ul")) {
            console.log(document.querySelector("div.left > div.search-options > span > div:nth-child(3) > div > div > ul").innerText.length)
            if (document.querySelector("div.left > div.search-options > span > div:nth-child(3) > div > div > ul").innerText.length <= 1) {
                //dingtalk(operator_name + "\tReport type = null ")
                if (GM_getValue('oa_err') >= 0) {
                    //console.log(GM_getValue('oa_err') + "存在")
                    oa_err = GM_getValue('oa_err');
                    oa_err = oa_err + 1;
                    GM_setValue('oa_err', oa_err);
                } else {
                    GM_setValue('oa_err', 0)
                    //console.log(GM_getValue('oa_err') + "不存在")
                };
                alert(operator_name + '\nReport type = null \npls check your audit source,thanks');
            }
        };
    }

};

calculate = setInterval(function() {
    var btn_list = $("div.tags-operation-group > div.tags-btn-group > button"); //所有审核按钮
    var ok_btn = $("div.ant-modal-footer > div > button.ant-btn.ant-btn-primary");//确定按钮
    var btn = document.querySelector("div.tags-audit-search-wrapper.tags-audit-search.ant-card.ant-card-bordered > div > div > div.right > button");//开始\退出审核按钮
    if (null != btn && btn.innerText == "退出审核"){
        if(flag){
            flag=!flag;
            sta_time = new Date().valueOf();
        }
        if(undefined != btn_list[0] && 0 != $(btn_list).length){
            $(btn_list[0]).off("click");
            $(btn_list[0]).on("click",function(){
                cou += 1
                end_time = new Date().valueOf();
                grand_time += end_time - sta_time;
                sta_time = end_time;
            });
        }
        if(null != ok_btn){
            ok_btn.off("click");
            ok_btn.on("click",function(){
                cou += 1
                end_time = new Date().valueOf();
                grand_time += end_time - sta_time;
                sta_time = end_time;
            });
        }

    }
}, 100);

//定时发送各人员统计数据
function jinshujuf() {
    //console.log("统计数据");
    var refreshHours = new Date().getHours();
    var refreshMin = new Date().getMinutes();
    var refreshSec = new Date().getSeconds();
    var nowtime = new Date();
    if (refreshHours == '08' && refreshMin == '00' && refreshSec == '00') {
        //console.log("统计数据时间到" + GM_getValue('oa_err') + GM_getValue('operator_name') + nowtime.toLocaleDateString());
        GM.xmlHttpRequest({
            method: "POST",
            url: "https://jinshuju.net/api/v1//forms/SXJLYD",
            data: JSON.stringify({ 'field_1': nowtime.toLocaleDateString(), 'field_2': GM_getValue('operator_name'), 'field_3': GM_getValue('oa_err') }),
            headers: { "Authorization": "Basic " + btoa("xr80OR4nIvA2-KypB2Z-Cg:K8qJ3J-NWG0yEm1-8pIKaA"), "Content-Type": "application/json" },
            onload: function (response) {
                GM_setValue('oa_err', 0);
                //console.log(response.responseText)
                return JSON.parse(response.responseText)
            }
        });
    }
}