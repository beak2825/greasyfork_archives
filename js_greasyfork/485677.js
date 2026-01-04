// ==UserScript==
// @name         文本链接识别器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用来识别文本中的链接，并且转换成可以直接点击超链接形式，用来方便做题
// @author       Feng_Yijiu
// @match        https://test.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/485677/%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%E8%AF%86%E5%88%AB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/485677/%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%E8%AF%86%E5%88%AB%E5%99%A8.meta.js
// ==/UserScript==
(function() {
    let t = setInterval(function () {
        //设定循环定时器，1000毫秒=1秒，1秒钟检查一次目标对象是否出现
        var text = $("#com_mark_reference_5 > div").text()
        if (text != ""){
            console.log("不为空了！")
            var url = text.replace(
                /(https?:\/\/)?(([0-9a-z.]+\.[a-z]+)|(([0-9]{1,3}\.){3}[0-9]{1,3}))(:[0-9]+)?(\/[0-9a-z%/.\-_]*)?(\?[0-9a-z=&%_\-]*)?(\#[0-9a-z=&%_\-]*)?/ig,
                function ($0, $1) {
                    return '<a href="'
                        + ($1 ? '' : 'http://') //如果没有匹配到协议，自动添加http协议
                        + $0 + '">' + $0 + '</a>';
                }
            )
            console.log(url);
            $('body').append("<div id='newUrl'><p>"+url+"</p></div>")
            $('#newUrl').css({
                "width": "300px",
                "top": "238px",
                "right": "20px",
                "background-color": "antiquewhite",
                "position": "absolute",
                "border-radius": "15px"
            })
            $("#newUrl > p").css({
                "font-size": "16px",
                "margin": "20px"
            })
            $("#newUrl > p > a").css({
                "word-wrap": "break-word"
            })
            clearInterval(t);
        }
    }, 1000)
    })();