// ==UserScript==
// @name         给我分行！Give me a line feed!
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  学习系统的不完善导致我们遇到很多问题，这个插件可以解决威学一百对话和讲座文本揉成一团不好分辨的问题！The imperfection of the learning system causes us to encounter a lot of problems, this plug-in can solve the problem of Weixue 100 dialogue and lecture text crumple up hard to distinguish!
// @author       QianbiaoZhao
// @match        *://t.weixue100.com/toefl/listening/*.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478703/%E7%BB%99%E6%88%91%E5%88%86%E8%A1%8C%EF%BC%81Give%20me%20a%20line%20feed%21.user.js
// @updateURL https://update.greasyfork.org/scripts/478703/%E7%BB%99%E6%88%91%E5%88%86%E8%A1%8C%EF%BC%81Give%20me%20a%20line%20feed%21.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //设置代理服务器啊啊
    var proxyUrl = 'http://127.0.0.1:33210'; // 代理服务器的地址和端口
    var targetUrl = 'https://api.openai.com/v1/chat/completions'; // 目标URL
    var requestOptions = {
        method: 'GET',
        headers: {
            'Proxy': proxyUrl,
        },
    };

    

    var button = document.createElement("button");                                  //创建一个按钮
    button.textContent = "给我分行! Give me a line feed!";                           //按钮内容
    button.style.width = "300px";                                                   //按钮宽度
    button.style.height = "35px";                                                   //按钮高度
    button.style.align = "center";                                                  //文本居中
    button.style.color = "white";                                                   //按钮文字颜色
    button.style.fontSize = "15px"                                                  //字体大小
    button.style.background = "#65A6FE";                                            //按钮底色
    button.style.border = "1px solid #65A6FE";                                      //边框属性
    button.style.borderRadius = "4px";                                              //按钮四个角弧度
    button.addEventListener("click", clickBotton)                                   //监听按钮点击事件

    var like_comment = document.getElementsByClassName('f18 p20 bbe')[0];           //getElementsByClassName 返回的是数组，所以要用[] 下标
    like_comment.appendChild(button);                                               //把按钮加入到 x 的子节点中


    function clickBotton() {
        //var tempText = document.getElementsByClassName("drop-originalText hide")[0].innerHTML;      //成功获得源文本
        
        //var position;
        if (document.getElementsByClassName("drop-originalText hide")[0]) {
            var tempText = document.getElementsByClassName("drop-originalText hide")[0].innerHTML;
            //position = document.getElementsByClassName("drop-originalText hide")[0];                     //定位源文本位置
        }
        else {
            var tempText = document.getElementsByClassName("drop-originalText")[0].innerHTML;
            //position = document.getElementsByClassName("drop-originalText")[0];                     //定位源文本位置
        }
        var content = "我给你一段文字，请你根据说话人分行，在要换行的地方加上<br/><br/>, 如果只有一个说话人，那就按照句号或问号分行，加上<br/><br/>" + tempText;

        var myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer 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");
        myHeaders.append("Host", "api.openai.com");
        myHeaders.append("Connection", "keep-alive");

        var raw = JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": content
                }
            ],
            "stream": true
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://api.openai.com/v1/chat/completions", requestOptions)
            .then(response => response.text())
            .then(result => {
                const text = result;
                // 将文本分割成行
                var lines = text.split('\n');
                // 创建一个空数组来存储 "answer" 参数
                var contents = [];
                // 遍历每一行
                for (var i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    // 跳过不以 data 开头的行
                    if (!line.startsWith('data:')) {
                        continue;
                    }
                    // 尝试解析 JSON 数据
                    try {
                        var data = JSON.parse(line.substring(5).trim());  // 去掉前面的 "data: "
                        // 获取 "content" 参数，并将其添加到数组中
                        contents.push(data.choices[0].delta.content);
                    } catch (e) {
                        // 如果当前行不是有效的 JSON 数据，就忽略它
                    }
                }
                // 使用 join() 方法拼接 "answer" 参数
                var result = contents.join('');
                // 将结果显示在 body 的“可视化”标签页
                //pm.visualizer.set(result);
                // 打印结果到控制台
                //console.log(result);
                //s += result;
                //alert(result);
                // if (position) {     //
                //     position.innerHTML = result;
                // }
                // else {
                //     position.innerHTML = result;                          //完成替换
                // }
                document.getElementsByClassName("drop-originalText hide")[0].innerHTML = result;
                document.getElementsByClassName("drop-originalText")[0].innerHTML = result;
                //original_Show.innerHTML = result; 
                button.textContent = "完成!";
            })
            .catch(error => console.log('error', error));
        button.textContent = "请稍后!";
    }

})();