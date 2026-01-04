// ==UserScript==
// @name 图集岛破解VIP
// @namespace http://tampermonkey.net/
// @version 1.2
// @description 破解图集岛VIP
// @author yyg, 253681319
// @match *://*.tujidao.com/*
// @grant none
// @date 2022-01-14
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440380/%E5%9B%BE%E9%9B%86%E5%B2%9B%E7%A0%B4%E8%A7%A3VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/440380/%E5%9B%BE%E9%9B%86%E5%B2%9B%E7%A0%B4%E8%A7%A3VIP.meta.js
// ==/UserScript==

(function () {
    "use strict";

    var html1 =
        '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>img_title</title>' +
        "<style>img {vertical-align: top;text-align: center;}" +
        ".imgbox{position: relative;overflow: hidden;}" +
        ".imgbox img{max-width: 100%}" +
        ".imgnum{font-size:80%;position: absolute;left: 5px;top: 5px;background: #17A1FF;background: rgba(23,161,255,0.5);z-index: 100;padding: 0px 5px;color: #f9f9f9;border-radius: 2px;}" +
        "a:link{color:pink;}a:visited{color:purple;}" +
        "</style></head>" +
        '<body bgcolor="#27282d"><div align="center">';
    var html2 = "</div></body></html>";
    var pic_base =
        "<div class='imgbox'><div class='imgnum'>{imgnum}</div><img src='https:///tjg.gzhuibei.com/a/1/{pic_id}/{num}.jpg'></div>";
    console.log("start");
    var createnew = function (num, pic_id, tags) {
        var pic_new = pic_base.replace("{pic_id}", pic_id);
        var tagHtml = [];
        var last = tags.pop();
        for (let t of tags) {
            tagHtml.push(t.outerHTML);
        }
        tagHtml.push(last.innerText);
        tagHtml =
            "<div style='color:white;font-size:smaller;'>" +
            tagHtml.join(" / ") +
            "</div>";
        var imgs = [];
        for (var i = 1; i <= num; i++) {
            imgs.push(
                pic_new.replace("{num}", i).replace("{imgnum}", ` [${i}/${num}]`)
            );
        }
        let html = html1.replace("img_title", `${last.innerText} - ${num}P @ ${pic_id}`);
        html += imgs.join("\n");
        html += html2;
        var w = window.open("https://www.tujidao.com/");
        w.onload = () => {
            w.document.write(tagHtml + html);
            w.document.close();
        };
    };
    // var lis = document.getElementsByClassName('shuliang');
    // <li id="47983">
    // <a href="/a/?id=47983" target="_blank"><img src="https://tjg.gzhuibei.com/a/1/47983/0.jpg"></a>
    // <span class="shuliang">27P</span>
    // <p>机构：<a href="/x/?id=2">网络美女</a></p>
    // <p>标签：<a href="/s/?id=183">大尺-度</a> <a href="/s/?id=43">福利</a></p>
    // <p>人物：<a href="/t/?id=6194">Byoru</a></p>
    // <p class="biaoti"><a href="/a/?id=47983">[网红COSER写真] 日本性感萝莉Byoru - Kiara Summer</a></p>
    // </li>
    // 小图链接

    /**

     * 给已有的图片容器添加点击事件，移除原有跳转链接

     */
    function addEvent(list) {
        for (const li of list) {

            //第一个a
            li.querySelector('img').onclick = function () {
                // 获取数量
                var num = li
                    .querySelector("span.shuliang")
                    .innerText.split("P")[0];

                num = parseInt(num);

                // id
                var aTag = li.querySelector("a");
                aTag.removeAttribute("href"); // 删除链接，防止跳转

                var id = li.querySelector(".biaoti a").getAttribute("href");
                id = id.split("id=")[1];

                //丢掉最后一个
                var tags = li.querySelectorAll("p>a");
                createnew(num, id, [...tags]);
            };
        }
    }

    /**

     *  获取当前页面的图片列表

     */
    function getLiList() {
        return document.querySelectorAll("div.hezi>ul>li");
    }

    addEvent(getLiList());

    var contentContainer = document.getElementById("search");
    var config = {
        childList: true,
        subtree: true
    };
    // 当观察到突变时执行的回调函数

    var callback = function (mutationsList) {
        mutationsList.forEach(function (item, index) {
            const {
                addedNodes
            } = item;
            addEvent(addedNodes);
        });
    };

    // 创建一个链接到回调函数的观察者实例

    var observer = new MutationObserver(callback);

    // 开始观察已配置突变的目标节点

    contentContainer && observer.observe(contentContainer, config);
})();