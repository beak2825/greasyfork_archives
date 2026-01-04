// ==UserScript==
// @name         淘宝天猫 - 自动采集器
// @namespace    https://detail.tmall.com
// @version      0.1
// @description  自动采集器
// @author       tuite
// @match        https://detail.tmall.com/item.htm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394866/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%20-%20%E8%87%AA%E5%8A%A8%E9%87%87%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/394866/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%20-%20%E8%87%AA%E5%8A%A8%E9%87%87%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var intervalIndex = document.createElement('input');
        intervalIndex.style.cssText = 'display:none';
        intervalIndex.id = 'hao_jiu.intervalIndex';
        document.body.appendChild(intervalIndex);
        var haojiuypx = document.createElement('input');
        haojiuypx.style.cssText = 'display:none';
        haojiuypx.id = 'hao_jiu.ypx';
        haojiuypx.value = 0;
        document.body.appendChild(haojiuypx);
        var haojiubtn = document.createElement('button');
        haojiubtn.style.cssText = 'position: fixed; right:0; bottom: 0';
        haojiubtn.innerText = '开始采集';
        haojiubtn.onclick = function () {
            inithaojiu();
        };
        document.body.appendChild(haojiubtn);
})();

function inithaojiu() {
            document.getElementById('hao_jiu.ypx').value = 0;
            var intervalInt = self.setInterval(function () {
                var bodyH = document.body.scrollHeight;
                var nowh = parseInt(document.getElementById('hao_jiu.ypx').value);
                if (parseInt(bodyH / 100) == nowh / 100) {
                    window.clearInterval(document.getElementById('hao_jiu.intervalIndex').value);
                    var urls = [];
                    var pre = 'http:';
                    try {
                        var video = document.getElementsByTagName('source')[0].getAttribute('src');
                        urls.push(pre + video);
                    } catch (e) {
                        console.log(e)
                    }
                    var banners = document.getElementById('J_UlThumb').getElementsByTagName('img');
                    var desImgs = document.getElementById('description').getElementsByTagName('img');
                    var bottomImgs = document.getElementById('J_DcBottomRightWrap').getElementsByTagName('img');
                    for (var bi in banners) {
                        if (banners[bi] instanceof Object && !(banners[bi] instanceof Function)) {
                            var bannerurl = pre + banners[bi].getAttribute('src');
                            var ss = bannerurl.split('_');
                            var ret = '';
                            for (var ssi = 0; ssi < ss.length - 1; ssi++) {
                                if (ssi === 0) {
                                    ret += ss[ssi];
                                } else {
                                    ret += ('_' + ss[ssi]);
                                }
                            }
                            urls.push(ret);
                        }
                    }
                    for (var di in desImgs) {
                        if (desImgs[di] instanceof Object && !(desImgs[di] instanceof Function)) {
                            var attribute = desImgs[di].getAttribute('src');
                            if (attribute.indexOf('http') === 0) {
                                urls.push(attribute);
                            } else {
                                urls.push(pre + attribute);
                            }
                        }
                    }
                    for (var boi in bottomImgs) {
                        if (bottomImgs[boi] instanceof Object && !(bottomImgs[boi] instanceof Function)) {
                            var attribute = bottomImgs[boi].getAttribute('src')
                            if (attribute === null) {
                                console.log(bottomImgs[boi])
                                continue;
                            }
                            if (attribute.indexOf('http') === 0) {
                                urls.push(attribute);
                            } else {
                                urls.push(pre + attribute);
                            }
                        }
                    }
                    console.log(urls);
                    var urlstr = '';
                    for (var uii in urls) {
                        urlstr += '\n' + urls[uii];
                    }
                    var jsonStr = urlstr + '\n\n\n\n\n\n' + JSON.stringify(urls) + '\n\n\n\n\n\n' + urls;
                    var mimeType = "text/plain";
                    var btn = document.createElement("a");
                    btn.style.cssText = "display: block; position: fixed; right:0; top: 40%; font-size: 20px;";
                    btn.href = "data:" + mimeType + ";charset=utf-8," + encodeURIComponent(jsonStr);
                    btn.innerHTML = "下载视频列表";
                    btn.download = "code.txt";
                    document.body.appendChild(btn);
                } else {
                    window.scrollTo(0, nowh + 100);
                    document.getElementById('hao_jiu.ypx').value = nowh + 100;
                }
            }, 40);
            var intervalIntInput = document.getElementById('hao_jiu.intervalIndex');
            intervalIntInput.value = intervalInt;
        }