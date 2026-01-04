// ==UserScript==
// @name          video辅助
// @namespace     https://not_exist.cy
// @version       4.0.0
// @description  提取JSON解析真实视频url地址,用于辅助video://嗅探实现JSON多线路;绕过部分防嗅探措施
// @author       cy
// @match     http.*url=.*
// @downloadURL https://update.greasyfork.org/scripts/497507/video%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/497507/video%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
(async function () {
    // 'use strict'; 取消严格模式
    // 引入海阔原生方法
    eval(fy_bridge_app.getInternalJs());
    // 封装函数-1、拼接返回多线路JSON格式播放链接
    function MergeReturns(urls, names, headers) {
        var configArray = JSON.parse(request("hiker://files/rules/cy/MyParse.json"));
        var tagsArray = JSON.parse(request('hiker://files/rules/cy/MyParse_selection.json'));
        var or_length = urls.length;
        tagsArray.forEach(item => {
            window.eval('var reg1=/' + item + '/;');
            window.eval('var reg2=/' + item + '|全部/;');
            if (vipUrl.match(reg1)) {
                configArray.forEach(item => {
                    if (item.tags == undefined || item.tags.match(reg2)) {
                        urls.push("video://" + item.url + vipUrl);
                        names.push(item.name);
                        headers.push({});
                    }
                });
            }
        });
        if (urls.length == or_length) {
            configArray.forEach(item => {
                var item = JSON.parse(item);
                urls.push("video://" + item.url + vipUrl);
                names.push(item.name);
                headers.push({});
            });
        }
        fy_bridge_app.playVideo(JSON.stringify({
            urls: urls,
            names: names,
            danmu: fba.getVar('dm_share'),
            headers: headers
        }));
    }
    // 封装函数-2、获取JSON数据
    function getJsonData() {
        return document.documentElement.innerText;
    }
    // 封装函数-3、获取html源码
    function getHtml() {
        return document.body.textContent;
    }
    // 封装函数-4、设置UA
    function setUA(ua) {
        if (ua == 'PC') {
            fy_bridge_app.setWebUa('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.0.0')
        } else if (ua == 'Android') {
            fy_bridge_app.setWebUa('Mozilla/5.0 (Linux; Android 10; Lenovo TB-X606X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.5180.161 Mobile Safari/537.36')
        } else if (ua == 'IPhone') {
            fy_bridge_app.setWebUa('Mozilla/5.0 (iPhone; CPU iPhone OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13E230 Safari/601.1')
        } else {
            fy_bridge_app.setWebUa(ua)
        }
    }
    // 脚本核心
    var url = location.href;
    if (url.match(/http.*url=.*/)) {
        var vipUrl = url.split('url=').pop();
        var domain = url.split('/');
        if (domain[2]) {
            domain = domain[2];
        } else {
            domain = '';
        }
        var doFun_str = 'switch ("' + domain + '") {';
        var configArray = JSON.parse(request("hiker://files/rules/cy/MyParse.json"));
        var jsArray = [];
        configArray.forEach(item => {
            if (item.js != undefined && item.js != '') {
                jsArray.push(item)
            }
        });
        jsArray.forEach(item => {
            doFun_str = doFun_str + "case'" + item.url.split('/')[2] + "':" + item.js + "break;";
        });
        doFun_str = doFun_str + `default:
        try {
            var data = document.documentElement.innerText;
            var link = JSON.parse(data).url;
            if (link === undefined) {
                link = JSON.parse(data).data.url;
            }
            if (link.match(/bilivideo/)) {
                var urls = [link];
                var names = ['B站官链'];
                var headers = [{
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0；； WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36",
                    "Referer": "https://www.bilibili.com"
                }];
                MergeReturns(urls, names, headers);
            } else if (link.indexOf('titan.mgtv.com') != -1) {
                var urls = [link];
                var names = ['芒果官链'];
                var headers = [{
                    'Referer': 'www.mgtv.com',
                    'User-Agent': 'Mozilla/5.0'
                }];
                MergeReturns(urls, names, headers);
            } else if (link != '') {
                window.location.href= link;
                // window.location.href="https://hxys.tv/bfq/?url="+link;
/*                 var urls = [link];
                var names = ['JSON命中'];
                var headers = [{}];
                MergeReturns(urls, names, headers); */
            }
            break;
        } catch {
            var html = document.body.textContent;
            if (html.match(/LLQPlayer-Pro/)) {
                fy_bridge_app.setWebUa('Mozilla/5.0 (iPhone；； CPU iPhone OS 9_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13E230 Safari/601.1');
                var token_timer = function () {
                    var timer = setInterval(() => {
                        if (document.getElementById("start_play")) {
                            var html = document.body.innerHTML.split('<script src="customJS.js"></script>')[1];
                            var tempList = html.match(/id=".{0,30}点击播放/g);
                            tempList.forEach(item => {
                                var id = item.split(/"/)[1];
                                var ctnBtn = document.getElementById(id + "");
                                var event = new Event('click');
                                ctnBtn.dispatchEvent(event);
                            });
                        }
                    }, 250)
                };
                token_timer();
            } else if (location.href.match(/jx.nnxv.cn/) && document.querySelector("body > p > font > b > font > a").text.match(/播放/)) {
                location.href = location.href;
            }
        }}`;
        eval(doFun_str);
    }
})();
