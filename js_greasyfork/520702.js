// ==UserScript==
// @name         网络学习测试
// @namespace    https://blog.csdn.net/mukes
// @version      0.0.1
// @description  网络学习加速
// @author       friscky
// @include      *://sia.sinopec.com/page/*
// @include      *.sia.sinopec.com/page/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://scriptcat.org/lib/637/1.4.3/ajaxHooker.js#sha256=y1sWy1M/U5JP1tlAY5e80monDp27fF+GMRLsOiIrSUY=


// @downloadURL https://update.greasyfork.org/scripts/520702/%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/520702/%E7%BD%91%E7%BB%9C%E5%AD%A6%E4%B9%A0%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button = document.createElement("button"); //创建一个按钮
    button.textContent = "速"; //按钮内容
    button.style.width = "50px"; //按钮宽度
    button.style.height = "28px"; //按钮高度
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    button.style.background = "#e33e33"; //按钮底色
    button.style.border = "1px solid #e33e33"; //边框属性
    button.style.borderRadius = "4px"; //按钮四个角弧度
    button.addEventListener("click", clickBotton) //监听按钮点击事件

    var textBox = document.createElement("input");
    textBox.type = "text";
    textBox.id = "beilv"
    textBox.style.width = "28px";
    textBox.style.height = "28px";


    var req_url;
    var start_url = "https://sia.sinopec.com/cc/learningRecordController/startLearnWare.do";
    var save_url_1 = "https://sia.sinopec.com/cc/learningRecordController/saveWareProgress.do";

    var req_json1;
    var req_json2;


    var courseCacheId ;
    var id;
    var lrpId;

    var obj;
    var obj_save;
    var obj2;
    var obj2_save;
    var wbk_intvalue;


    ajaxHooker.hook(request => {
        if (request.url === start_url) {
            console.log("请求");
            req_url = request.data;
            console.log(req_url);
        }
    });
    ajaxHooker.hook(request => {
        if (request.url === start_url) {
            console.log("响应");
            request.response = res => {
                console.log(res);
            };
        }
    });


    function clickBotton(){
        var bl = document.getElementById('beilv').value;
        wbk_intvalue = parseInt(bl, 10);
        console.log("执行次数：" + bl);
        var promise1;
        var promise2;
        req_json1 = new Array(wbk_intvalue);
        for(var k = 0; k < req_json1.length; k++){
            req_json1[k] = new Array(4);
        }
        req_json1[wbk_intvalue-1][2] = -1;
        let i = 0;
        var a = 0;
        for (i; i < wbk_intvalue; i++){    //测试仅发送一次，测试完毕需要改为：parseInt(bl)
            const promise = new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: start_url,
                    data: req_url,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0"
                    },
                    onload: function(response) {
                        if (response.status === 200) {
                            obj = response.response;
                            //console.log("obj_start：" + obj);
                            obj2 = eval ("(" + obj + ")");

                            courseCacheId = obj2.responseData.courseCacheId;
                            id= obj2.responseData.id;
                            lrpId= obj2.responseData.lrpId;

                            req_json1[a][0] = courseCacheId;
                            req_json1[a][1] = id;
                            req_json1[a][2] = lrpId;

                            console.log("开始发送=> " + "courseCacheId：" + req_json1[a][0] + "； id：" + req_json1[a][1] + "； lrpId：" + req_json1[a][2]);

                            a++;
                            resolve(obj2);
                        } else {
                            reject(new Error(`Status code: ${response.status}`));
                        }

                    },
                    onerror: (error) => {
                        reject(error);
                    },
                });
            });
            promise.then(obj2 => {
                //console.log(req_json1[a][0] + " " + req_json1[a][1] + " " + req_json1[a][2]);
                console.log(obj2);
                if(req_json1[wbk_intvalue-1][2] != -1){
                    start();
                }
            }).catch(error => {
                console.log("Error1");
            });

        }
    }

    function start(){

        setInterval(() => {
            var ii = 0;
            for(ii; ii< wbk_intvalue; ii++){    //测试仅发送一次，测试完毕需要改为：parseInt(bl)
                //console.log("定时保存循环开始1：" + i + ">>" + req_json1[i][0]);
                //console.log("定时保存循环开始1：" + i + ">>" + req_json1[i][1]);
                //console.log("定时保存循环开始1：" + i + ">>" + req_json1[i][2]);
                var save_data = "lrpId=" + req_json1[ii][2] + "&id=" + req_json1[ii][1] + "&courseCacheId=" + req_json1[ii][0] + "&memory=%7B%22speed%22%3A0.759995%7D";
                console.log("save_data：" + ii + ">>" + save_data);

                GM_xmlhttpRequest({
                    method: "POST",
                    url: save_url_1,
                    data: save_data,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0"
                    },
                    onload: function(response) {
                        obj_save = response.response;
                        console.log("开始保存：" + obj_save);    //输出返回
                    },

                });

            };
        }, 60000);

    }






    window.onload=function(){
        var like_comment = document.getElementsByClassName("el-tabs__nav is-top")[0]; //getElementsByClassName 返回的是数组，所以要用[] 下标
        like_comment.appendChild(textBox);
        like_comment.appendChild(button); //把按钮加入到 x 的子节点中
    }




})(); //(function(){})() 表示该函数立即执行