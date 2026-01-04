// ==UserScript==
// @name         Hacking8签到
// @namespace    https://fengwenhua.top/
// @version      1.0
// @description  Hacking8自动签到
// @author       江南小虫虫
// @match        https://i.hacking8.com/setting/profile
// @icon         https://www.google.com/s2/favicons?domain=i.hacking8.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/433513/Hacking8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/433513/Hacking8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function Toast(msg, duration) {
        duration = isNaN(duration) ? 3000 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function() {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(m)
            },
                       d * 1000);
        },
                   duration);
    }

    function runAsync(url, send_type, headers, data) {
        var p = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: send_type,
                url: url,
                headers: headers,
                data: data,
                onload: function(response) {
                    //console.log("请求成功");
                    //console.log(response.responseText);

                    resolve(response.responseText);

                },
                onerror: function(response) {
                    //console.log("请求失败");
                    reject("请求失败");
                }
            });
        })
        return p;
    }
    var today = new Date();
    today.setTime(today.getTime());
    var todayStr = today.getFullYear()+"-" + (today.getMonth()+1) + "-" + today.getDate();
    if(!localStorage.getItem(todayStr)){
        var url = "https://i.hacking8.com/setting/profile";
        var headers = {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua": "\"Chromium\";v=\"94\", \"Google Chrome\";v=\"94\", \";Not A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
        }

        var csrf_token = document.querySelector("#tables > div.panel-body > form > div > input[type=hidden]:nth-child(1)").value;
        console.log(csrf_token);
        var sign_btn = document.querySelector("#tables > div.panel-body > form > button").textContent;
        console.log(sign_btn);
        let labels = document.querySelectorAll("#tables > div.panel-body > form > div > label");
        var question = '';

        for(let label of labels){
            if(label.textContent.indexOf('=')!=-1){
                question = label.textContent;
                break;
            }
        }
        question = question.split('=')[0]
        console.log(question);
        var answer = eval(question).toString();
        console.log(answer);
        var body = "csrfmiddlewaretoken=" + csrf_token + "&plug="+answer;
        runAsync(url,"POST",headers,body).then((result)=>{
            if(result.indexOf('请求失败')!=-1){
                console.log("出现网络问题，签到失败！")
                Toast("出现网络问题，签到失败！", 2000);
            }else if(result.indexOf('签到验证码错误')!=-1){
                console.log("不知道为啥，验证码竟然会有问题。。。签到失败");
                Toast("不知道为啥，验证码竟然会有问题。。。签到失败", 2000);
            }else if(result.indexOf('签过到了')!=-1){
                console.log("您已经签过到了");
                Toast("您已经签过到了", 1500);
                localStorage.setItem(todayStr, true);
            }else if(result.indexOf('签到成功')!=-1){
                console.log("签到成功")
                Toast("签到成功", 1500);
                localStorage.setItem(todayStr, true);
            }
            else {
                console.log("还有其他结果？？");
                console.log(result);
            }
        });
    }else{
        console.log("今天签过到了");
    }

})();