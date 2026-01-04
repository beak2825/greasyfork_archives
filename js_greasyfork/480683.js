// ==UserScript==
// @name         Robomaster 规则答疑互助脚本
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      1.4
// @description  try to take over the world!
// @author       You
// @match        https://survey.dji.com/examination_papers/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @connect    3f2decb3.r20.cpolar.top
// @downloadURL https://update.greasyfork.org/scripts/480683/Robomaster%20%E8%A7%84%E5%88%99%E7%AD%94%E7%96%91%E4%BA%92%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/480683/Robomaster%20%E8%A7%84%E5%88%99%E7%AD%94%E7%96%91%E4%BA%92%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
var li = [];
(function () {
    'use strict';
    //     document.addEventListener("DOMContentLoaded", function() {
    //     // 在文档加载完成后执行代码

    //     // 获取所有单选框元素

    // });
    console.log("fheuiwhfiuewhfuigehuifgewuidgfuiweguihurewhufhewuhduiewhfduioewhiuodfhewiohfioehfewfejofpjew");
    $(document).ready(function () {
        var radioButtons = document.querySelectorAll('input[type="radio"]');

        // 为每个单选框添加点击事件监听器
        radioButtons.forEach(function (radioButton) {
            radioButton.addEventListener("change", function () {
                // 检查单选框是否被选中
                var isChecked = radioButton.checked;

                // 如果被选中，则获取值
                if (isChecked) {
                    var selectedValue = radioButton.value;
                    radioButton.checked = true;
                    // 执行你的操作，比如输出被选中的值
                    console.log("Selected Value: " + selectedValue);
                    // console.log(selectedElement);
                    // console.log(selectedElement.children[0].length);
                    // list_ = []
                    // for (var i = 0; i <= 99; i++) {
                    //     var data = selectedElement.children[0].children[3 + i];
                    //     // console.log(data);
                    //     var question = data.children[0].innerHTML;
                    //     // console.log(question);
                    //     var ans = -1;
                    //     var ok = 0;
                    //     for (var j = 0; j <= 3; j++) {
                    //         var data1 = data.children[j + 1].children[1].checked;
                    //         // console.log(data1);
                    //         if (data1) {
                    //             ans = j;
                    //             ok = 1;
                    //             break;
                    //         }

                    //     }
                    //     list_.push(ans);

                    //     // if (ok) {
                    //     //     console.log(ans);
                    //     // }

                    //     // .attr('checked')=='checked';
                    // }
                    // list = list_;
                    // console.log(list);

                    // var selectedElement = document.querySelector("body > div.container > div > div");
                    // // console.log(selectedElement);
                    // // console.log(selectedElement.children[0].length);
                    // for (var i = 0; i <= 99; i++) {
                    //     var data = selectedElement.children[0].children[3 + i];
                    //     // console.log(data);
                    //     for (var j = 0; j <= 3; j++) {
                    //         var data1 = data.children[j + 1].children[1].checked;
                    //         console.log(data1);
                    //     }

                    //     // .attr('checked')=='checked';
                    // }
                }


            });
        });
        // var selectedElement = document.querySelector("body > div.container > div > div > form > input.btn.btn-primary.btn-block");

        $(
            '<div style="border: 4px dashed rgb(217 75 75); width: 330px;height:750px; position: fixed; top: 0; right: 0; z-index: 99999; background-color:rgb(0 0 0 / 70%);color:rgb(255 255 255);overflow-y: auto;">' +
            '<span style="font-size: medium;"></span>' +
            '<div style="font-size: medium;"><h2 text-align: center;>脚本</h2>' +
            '<b>' +
            '   <button id="1"> 上传我的答案</button>'
            +
            '   <button id="2"> 查找答案</button><style>.red-paragraph { color: red;}</style>'

        ).appendTo('body');

        var button1 = document.getElementById("1");
        var button2 = document.getElementById("2");
        // console.log(button1);
        var data = {};
        var data_list = [];
        button1.addEventListener("click", function () {
            var list_ = []

            var selectedElement = document.querySelector("body > div.container > div > div");

            for (var i = 0; i <= 99; i++) {
                var list_i = {};
                var data = selectedElement.children[0].children[3 + i];
                // console.log(data);
                // var question = data.children[0].innerHTML;
                var question = data.children[0].innerHTML;
                var pattern = /\d+\.\s/g;

                 question = question.replace(pattern, '');
                // console.log(question);
                var ans = -1;
                var ok = 0;
                var list_i1 = {};
                for (var j = 0; j <= 3; j++) {
                    list_i1[j.toString()] = data.children[j + 1].children[2].innerHTML;
                    var data1 = data.children[j + 1].children[1].checked;
                    // console.log(data1);
                    if (data1) {
                        ans = j;
                        ok = 1;
                        // break;
                    }

                }
                // list_.push(ans);

                if (ok) {
                    list_i["question"] = question;
                    list_i["choices"] = ans.toString();
                    list_i["options"] = list_i1;
                    // list_i["options"]
                    // console.log(ans);
                    list_.push(list_i);
                }

                // .attr('checked')=='checked';
            }
            // list = list_;
            // console.log(list_);
            //     $.ajax({
            //     url: 'http://3f2decb3.r20.cpolar.top/qa_muti',
            //     type: 'POST',
            //     contentType: 'application/json',
            //     data: JSON.stringify(list_),
            //     success: function(response) {
            //         // 请求成功时的处理逻辑
            //         console.log("Success:", response);
            //     },
            //     error: function(error) {
            //         // 请求失败时的处理逻辑
            //         console.error("Error:", error);
            //     }
            // });
            // 示例使用 GM_xmlhttpRequest
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://3f2decb3.r20.cpolar.top/qa_muti",
                // contentType: 'application/json',
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(list_),
                onload: function (response) {
                    console.log(response.responseText);
                },
                onerror: function (error) {
                    console.error("Error:", error);
                }
            });

            // alert();
        });

        button2.addEventListener("click", function () {

            alert("查找成功，已更新所有题目，能选的已经选上!");
            var list_ = []

            var selectedElement = document.querySelector("body > div.container > div > div");

            for (var i = 0; i <= 99; i++) {
                var list_i = {};
                var data = selectedElement.children[0].children[3 + i];
                // console.log(data);
                var question = data.children[0].innerHTML;
                // var question = data.children[0].innerHTML;
                var pattern = /\d+\.\s/g;

                 question = question.replace(pattern, '');
                // console.log(question);
                var ans = -1;
                var ok = 0;
                var list_i1 = {};
                for (var j = 0; j <= 3; j++) {
                    list_i1[j.toString()] = data.children[j + 1].children[2].innerHTML;
                    var data1 = data.children[j + 1].children[1].checked;
                    // console.log(data1);
                    if (data1) {
                        ans = j;
                        ok = 1;
                        // break;
                    }

                }
                // list_.push(ans);

                // if (ok) {
                list_i["question"] = question;
                // list_i["choices"] = ans.toString();
                // list_i["options"] = list_i1;
                // list_i["options"]
                // console.log(ans);
                list_.push(list_i);
                // }

                // .attr('checked')=='checked';
            }
            ans = [];
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://3f2decb3.r20.cpolar.top/get_muti",
                // contentType: 'application/json',
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(list_),
                onload: function (response) {
                    var josn_data = JSON.parse(response.responseText);
                    // console.log(josn_data.length);
                    console.log(josn_data);

                    var selectedElement = document.querySelector("body > div.container > div > div");
                    for (var w = 0; w < josn_data.length; w++) {
                        var num1 = josn_data[w]["choices"].length;
                    console.log(num1);

                        var str = "这个题有";
                        var max_=0;
                        for (var x = 0; x < num1; x++) {
                            var char_="";
                            if(josn_data[w]["choices"][x]['data']==="0") char_="A";
                            if(josn_data[w]["choices"][x]['data']==="1") char_="B";
                            if(josn_data[w]["choices"][x]['data']==="2") char_="C";
                            if(josn_data[w]["choices"][x]['data']==="3") char_="D";

                            str += josn_data[w]["choices"][x]['num'].toString() + "人选了" + char_ + ","

                            var data_click = selectedElement.children[0].children[3 + Number(josn_data[w]['num'])];
                            // console.log(data_click);
                            for (var j = 0; j <= 3; j++) {
                             if (j.toString() == josn_data[w]["choices"][x]['data'] && josn_data[w]["choices"][x]['num']>max_)
                                {
                            // console.log();
                           var str_1= ("body > div.container > div > div > form > div:nth-child("+(Number(josn_data[w]['num'])+4).toString()+") > div:nth-child("+(j+2).toString()+") > label");
                           $(str_1).click();
                        //    console.log($(str_1));
                        //    console.log((str_1));

                        //    var str1="#subject_"+josn_data[w]['num']+"_candidate_"+j.toString();
                        //    document.querySelector(str1).click();
                        //    console.log(document.querySelector(str1));
    // $("body > div.container > div > div > form > div:nth-child(4) > div:nth-child(4) > label").click();

                                    // console.log(data_click.children[1].children[1].checked);
                                    // data_click.children[1].children[1].checked;
                                    // console.log(data.children[j + 1].children[1]);
                                    // console.log( data_click.children[j + 1].children[1]);
                                    max_=josn_data[w]["choices"][x]['num'];
                                }

                            }
                        }
                        selectedElement.children[0].children[3 + Number(josn_data[w]['num'])].innerHTML += ' <p class="red-paragraph">'+str+'</p>';
                    max_=0;
                    for (var x = 0; x < num1; x++) {
                            var char_="";
                            if(josn_data[w]["choices"][x]['data']==="0") char_="A";
                            if(josn_data[w]["choices"][x]['data']==="1") char_="B";
                            if(josn_data[w]["choices"][x]['data']==="2") char_="C";
                            if(josn_data[w]["choices"][x]['data']==="3") char_="D";

                            str += josn_data[w]["choices"][x]['num'].toString() + "人选了" + char_ + ","

                            var data_click = selectedElement.children[0].children[3 + Number(josn_data[w]['num'])];
                            // console.log(data_click);
                            for (var j = 0; j <= 3; j++) {
                             if (j.toString() == josn_data[w]["choices"][x]['data'] && josn_data[w]["choices"][x]['num']>max_)
                                {
                            // console.log();
                           var str_1= ("body > div.container > div > div > form > div:nth-child("+(Number(josn_data[w]['num'])+4).toString()+") > div:nth-child("+(j+2).toString()+") > label");
                           $(str_1).click();
                        //    console.log($(str_1));
                        //    console.log((str_1));

                        //    var str1="#subject_"+josn_data[w]['num']+"_candidate_"+j.toString();
                        //    document.querySelector(str1).click();
                        //    console.log(document.querySelector(str1));
    // $("body > div.container > div > div > form > div:nth-child(4) > div:nth-child(4) > label").click();

                                    // console.log(data_click.children[1].children[1].checked);
                                    // data_click.children[1].children[1].checked;
                                    // console.log(data.children[j + 1].children[1]);
                                    // console.log( data_click.children[j + 1].children[1]);
                                    max_=josn_data[w]["choices"][x]['num'];
                                }

                            }
                        }
                    }
                       
                    },
                    onerror: function (error) {
                        console.error("Error:", error);
                    }
                });
        });
        // body > div.container > div > div > form > input.btn.btn-primary.btn-block
        // 在文档加载完成后执行代码
        // var selectedElement = $("body > div.container > div > div");
        // var selectedElement = document.querySelector("body > div.container > div > div");
        // // console.log(selectedElement);
        // // console.log(selectedElement.children[0].length);
        // for (var i = 0; i <= 99; i++) {
        //     var data = selectedElement.children[0].children[3 + i];
        //     // console.log(data);
        //     var question=data.children[0].innerHTML;
        //     console.log(question);
        //     var ans="A";
        //     for (var j = 0; j <= 3; j++) {
        //         var data1 = data.children[j + 1].children[1].checked;
        //         if(data1)
        //         {
        //             ans+=j;
        //             break;
        //         }
        //         console.log(ans);
        //     }

        //     // .attr('checked')=='checked';
        // }
        // 执行你的操作，例如：
        // selectedElement.css("background-color", "red");
    });
    // data=document.querySelector("body > div.container > div > div");
    // console.log(data);
    // Your code here...

})();