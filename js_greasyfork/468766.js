// ==UserScript==
// @name        新版萌娘百科去广告
// @namespace   Violentmonkey Scripts
// @match       *://*.moegirl.org.cn/*
// @grant       none
// @version     3.2
// @author      lmttlw
// @description 2023/6/15 10:53:08
// @license none
// @downloadURL https://update.greasyfork.org/scripts/468766/%E6%96%B0%E7%89%88%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/468766/%E6%96%B0%E7%89%88%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
var IsKillAdvertise = true;//是否去广告
var IsKillBulletin = true;//是否去公告
(function () {
    // 选择要观察的 DOM 节点
    const targetNode = document.querySelector("body");

    // 配置观察选项:
    const config = { childList: true, subtree: true };//,attributes: true, subtree: true
    const callback = function (mutationsList, observer) {
        if (IsKillAdvertise) {
            var adjacentNodes = $("#app").siblings().filter(function () {
                if ($(this).attr('class')) {
                    return $(this).attr('class').startsWith('_01T-L5Cj4R');
                }
            });
            adjacentNodes.find("a").filter(function () {
                if ($(this).attr('class').startsWith('TAkM8pe4pR')) {
                    $(this)[0].click();
                }
            });
            var a = []
            $("#app").find("a").filter(function () {
                if ($(this).text() === "推广" || $(this).text() === "加载中") {
                    a.push($(this));
                }
            });
            var node = $("#app").siblings().filter(function () {
                if ($(this).attr('class')) {
                    return $(this).attr('class').startsWith('stevrhgmNo');
                }
            });
            node.find("a").filter(function () {
                if ($(this).text() === "加载中") {
                    a.push($(this));
                }
            });

            if (a.length > 0) {
                a.forEach(function (s) {
                    if (s[0]) {
                        var names = s[0].className.split(" ");
                        var name;
                        if (names.length > 1) {
                            name = "." + names[1];
                        } else {
                            name = "." + names[0];
                        }
                        var links = document.querySelectorAll(name);
                        // 对每个链接执行操作
                        links.forEach(function (link) {
                            link.click();
                            link.style.display = "none";
                        });
                    }
                })
            }
            a = []
            //这里往下全是修改叉不掉的广告
            var links = document.querySelectorAll(".gallery-item");
            //遍历所有广告位，
            links.forEach(function (link) {
                var href = link.getAttribute("href");
                //如果有非萌娘百科的链接则判断为广告
                if (href && !href.includes("moegirl")) {
                    //移除对应广告链接
                    link.removeAttribute("href");
                    var img = link.querySelector("img");
                    //修改图片为虹夏麻麻
                    const imageUrls = [
                        'https://s3.bmp.ovh/imgs/2024/09/04/7715189e0809639a.jpg',
                        'https://s3.bmp.ovh/imgs/2024/09/04/93f07cb4d65eebec.jpg',
                        'https://s3.bmp.ovh/imgs/2024/09/04/bccdb34281200db5.jpg',
                        'https://s3.bmp.ovh/imgs/2024/09/04/0ccce1f972aa3900.jpg',
                        'https://s3.bmp.ovh/imgs/2024/09/04/7c254180b4653525.jpg',
                        'https://s3.bmp.ovh/imgs/2024/09/04/a96d3bc2153b5741.jpg',
                        'https://s3.bmp.ovh/imgs/2024/09/04/b57a57d776d2c3f4.jpg',
                    ];
                    const randomIndex = Math.floor(Math.random() * imageUrls.length);
                    // 使用随机索引从数组中取出图片地址
                    const randomImageUrl = imageUrls[randomIndex];
                    img.src = randomImageUrl;
                    img.style.objectFit = 'cover';
                }
            });
            var title = document.querySelector(".gallery-details .title");
            if (title && !title.innerText.includes("广告") && !title.innerText.includes("萌娘")) {
                var name = title.querySelector(".name");
                if (name && !name.innerHTML.includes("虹夏")) {
                    name.textContent = "人活着哪有不喜欢虹夏的,硬撑罢了!";
                }
                var div = title.querySelector(".desc");
                //受不了啦，这个提示改不了我直接把提示禁了
                // div.style.display = "none";
                if (div && !div.innerHTML.includes("虹夏")) {
                    div.innerHTML = '';
                    var p = document.createElement('p');
                    p.innerHTML = "忍不了,一拳把下北泽打爆!人活着哪有不喜欢虹夏的,硬撑罢了!忍不了,一拳把下北泽打爆!人活着哪有不喜欢虹夏的,硬撑罢了!忍不了,一拳把下北泽打爆!人活着哪有不喜欢虹夏的,硬撑罢了!";
                    div.appendChild(p);
                }
                // var p = div.querySelector("p");
                // if (p) {
                //     p.removeAttribute('data-v-9f4885e2');
                //     p.innerHTML = p.innerText = p.textContent = "忍不了,一拳把下北泽打爆!人活着哪有不喜欢虹夏的,硬撑罢了!忍不了,一拳把下北泽打爆!人活着哪有不喜欢虹夏的,硬撑罢了!忍不了,一拳把下北泽打爆!人活着哪有不喜欢虹夏的,硬撑罢了!";
                // }
            }
            var Ad = document.querySelector(".restrict-tips");
            if (Ad) {
                Ad.style.display = "none";
            }
        }
        if (IsKillBulletin) {
            var Ad = document.querySelector(".n-base-close");
            if (Ad) {
                Ad.click();
            }
        }
    };
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 开始观察目标节点
    observer.observe(targetNode, config);
})();
