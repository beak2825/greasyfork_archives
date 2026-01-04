// ==UserScript==
// @name         云题库刷题辅助
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  try to take over the world!
// @author       吃瓜男孩
// @match        http://tiku.kgc.cn/testing/exam/*
// @match        http://tiku.kgc.cn/testing/unified/*
// @match        http://tiku.kgc.cn/testing/paper/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
//@require    https://cdn.bootcss.com/spark-md5/3.0.0/spark-md5.min.js
//@connect       *
// @downloadURL https://update.greasyfork.org/scripts/399470/%E4%BA%91%E9%A2%98%E5%BA%93%E5%88%B7%E9%A2%98%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/399470/%E4%BA%91%E9%A2%98%E5%BA%93%E5%88%B7%E9%A2%98%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

var currentURL = window.location.href;
(function() {
    'use strict';
    jQuery.support.cors = true;
    var answerURL = /tiku\.kgc\.cn\/testing\/exam*/;
    var testURL = /tiku\.kgc\.cn\/testing\/unified*/;
    var sumbitURL = /tiku\.kgc\.cn\/testing\/paper\/report*/;
    if (answerURL.test(currentURL) || testURL.test(currentURL)) {
        $(document).ready(function() {
            var questHTML = $(".sec2>pre>img");
            var reg = /\d{10,15}/;
            window.quests = new Array();
            $(questHTML).bind("load", function() {
                var ele = this;
                var returnValue = function(e) {
                    window.quests[window.quests.length] = e;
                    $(ele).attr('data', e);
                    console.log(window.quests.length + "," + questHTML.length + "," + e);
                    if (window.quests.length == questHTML.length) {
                        addAnswerButton(addHTML)
                    }
                };
                returnImgMd5(this.src, returnValue)
            });
            
            setTimeout(function() {
                for (var e = 0; e < questHTML.length; e++) {
                    if ($(questHTML[e]).attr("data") == null) {
                        console.log("节点" + e);
                        var ele = $(questHTML[e]);
                        var returnValue = function(e) {
                            window.quests[window.quests.length] = e;
                            $(ele).attr('data', e);
                            console.log(window.quests.length + "," + questHTML.length + "," + e);
                            if (window.quests.length == questHTML.length) {
                                addAnswerButton(addHTML)
                            }
                        };
                        returnImgMd5($(ele).attr("src"), returnValue)
                    }
                }
            }, 3000);
            var addHTML = $('<a id="getAnswer" href="javascript:void(0);"  class="f14 rest acenter"></a>').text("获取答案").click(function() {
                console.log(window.quests);
                if (window.quests != null && window.quests.length > 0) {
                    GM_xmlhttpRequest({
                        method: "post",
                        url: 'http://tiku.summerpond.cn/answer/get',
                        data: JSON.stringify(quests),
                        headers: {
                            "Content-Type": 'application/json;charset=utf-8'
                        },
                        onload: function(r) {
                            if (r.status == 200) {
                                var answerResult = [];
                                answerResult = JSON.parse(r.responseText);
                                if (answerResult.length > 0) {
                                    for (var a = 0; a < questHTML.length; a++) {
                                        var questMd5 = $(questHTML[a]).attr("data");
                                        for (var w = 0; w < answerResult.length; w++) {
                                            var answer = answerResult[w].answer;
                                            if (questMd5 == answerResult[w].imageMd5 && answer != null) {
                                                var value = answer.split(',');
                                                var options = $(questHTML[a]).parents(".sec").find(".sec2>li");
                                                if (value.length == 1) {
                                                    options[value[0]].click()
                                                } else {
                                                    for (var q = 0; q < value.length; q++) {
                                                        options[value[q]].click()
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    alert("糟糕，题库里面一道题也没有")
                                }
                            }
                        }
                    })
                }
                $("#getAnswer").hide();
            });
        })
    }
})();

function addAnswerButton(addHTML) {
    $("#putIn").after(addHTML);
}

function returnImgMd5(url, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        responseType: "blob",
        url: url,
        onload: response => {
            //console.log("状态码" + response.status);
            if (response.status == 200) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var spark = new SparkMD5.ArrayBuffer();
                    spark.append(e.target.result);
                    callback(spark.end())
                }
                reader.onerror = function(e) {
                    console.log("解析异常" + e)
                }
                console.log(reader.readyState);
                reader.readAsArrayBuffer(response.response)
            }
        },
        onerror: function(e) {
            console.log("请求失败" + e)
        }
    })
};