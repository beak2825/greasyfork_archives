// ==UserScript==
// @name         考考考
// @namespace    http://tampermonkey.net/
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAMSSURBVDhPbZNJaBRBFIarJ8lk0UmcJTFuKCJ6iIJGUIILirghoqBiDkLwEBQVXAhRQUUjuIAK6sHoRRF3CEQQURBBEDyIGxJxi2J6Jt3Ts3XPTHdnMun6fVWTnLSheI/u/r/313tVzGKhg0kWMjUWcnUWtHUWcv636LszyPwitzVfxE0qYVNoWYaFUwkWRpSF+CDFf1cIMVYHrW460q076b9yDDCFG75qWEp9igm6EEeVoBdVKMpcxKDMVV89V1mAD/ir+XD/b55q38OTm7d5ZudxrrHxrgDYopIQxRTphFYQMaWeYq2ohmhZLYyV61CMGxCPxzlPrN5I7sod6WAMUBKHSRwmIUMsPAXJ1jbkb90FLwzDGxkBJ8Dw934erQqAHIwCSpUJEKFYJ8Wptnbk7z4g8T1kL1xB9vxFeLkcigMqAX7y/OVucuAngBImB1RZiRBgHNSKGuTvPITd85iEV2GR2Dp5BubhEyi8/QhjzQYq4ONG81LoNY1jDiJQ2Xiu1tRi6N0H2Pd7YB47DfthDzIHOpG72o3cjVuwzl3AH3JXcltFWwiOOQgStZy7L19h6PUbJLe3YSQ6CGP9Zgy9fY/Mvg4UPn+BWhmQWxQAsW1RnGlKvaMS1Tx+SvQH8RXU7WgM6YOdyN++h9y1m7Af9SJ7pbtUvUxMp3RmJGCQVTr6rCahRf76TaR275d5vHk5vGwemY5OFPr6YJ0ete8bBYw5iDHm5M5fkiJjayvcZy9Q1DTozUvku8yBI3DIQeH9RzkdMWYBiFHjdYUAuj9kF7/9oBl7XJ/bIu0P06i0OQvlzJ2nz5HYtEXC0u17R5s4gRxESoDEghaXk9izsp42s5kXjYTshTZ/MXdfvJR5csdObnadlbl5oourZQFPZZV0lIMuy63dmMKvARQ+9XF96my4vU/AczbSbbuQWLUBnpFC8etPxOctgtVxFDyThdP7hJvL1iLNgmmW8TceSldOsvSqia6u0HUuCznxqkZHr5lCV3ico1eEHT0wzYlPmOGIfsUrIna8YbabmdxkWeUNh/4CLOKGDB5Kaf8AAAAASUVORK5CYII=
// @version      1.0.0
// @description  考考考考考考考考考
// @author       H
// @license      Apache Licence
// @match        http*://mooc1.chaoxing.com/exam-ans*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      free.tikuhai.com
// @require      https://update.greasyfork.org/scripts/481405/1290516/%E5%8A%A0%E5%8A%A0%E5%8A%A0%E5%AF%86.js
// @downloadURL https://update.greasyfork.org/scripts/481406/%E8%80%83%E8%80%83%E8%80%83.user.js
// @updateURL https://update.greasyfork.org/scripts/481406/%E8%80%83%E8%80%83%E8%80%83.meta.js
// ==/UserScript==

unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;

function getAnswer(input) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            // $input
            url: `http://free.tikuhai.com/q?q=${input}`,
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: (response) => {
                const apiResponse = JSON.parse(response.responseText);
                resolve(apiResponse);
            },
            onerror: () => {
                resolve({
                    code: -1,
                    data: "",
                    msg: "请求出错"
                });
            },
            ontimeout: () => {
                resolve({
                    code: -1,
                    data: "",
                    msg: "请求超时"
                });
            }
        });
    });
};

window.onload = () => {
    console.log("插件【考考考】开始运行...");
    console.log("字体修改");
    changeFont();
    console.log("搜题...");
    start();
}

async function start() {
    var query = document.querySelector(".type_tit").parentElement.querySelector("div").innerHTML.replace(/\s/g, '');
    var answer = await getAnswer(query);
    var data = "", data_style="";
    if (answer.msg == "获取成功") {
        if (answer.data == "正确" || answer.data == "√") {
            data = "对";
            data_style = "color: green;font-weight:bold";
        } else if (answer.data == "错误" || answer.data == "×") {
            data = "错";
            data_style = "color: red;font-weight:bold";
        } else {
            answer = answer.data.split(/[#\x01|]/);
            if (answer.length == 1) {
                data = answer[0];
            } else {
                for (let i = 0; i < answer.length; i++) {
                    data += (i+1)+". "+answer[i];
                    if (i != answer.length - 1) {
                        data += `\n`;
                    }
                }
            }
        }
    } else {
        data = "未找到答案，请选中下面的原题内容后右键在web中搜索";
        data_style = "color: grey;font-size: 1.2em;";
    }

    console.log(
        '%c %s %c %s %c %s %c %s %c %s %c %s',

        '',
        '\n',

        'border-radius: 5px;padding: 3px 4px;color: white;background-color: #3a8bff;margin-bottom:1em;',
        '答案',

        'font-size: 1.5em;'+data_style,
        '\n'+data,

        '',
        '\n',

        'border-radius: 5px;padding: 3px 4px;color: white;background-color: #3a8bff;margin: 1em 0;',
        '原题',

        'font-size: 1.1em;padding: 0.5em;',
        '\n'+query
    );
}
