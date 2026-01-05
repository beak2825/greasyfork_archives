// ==UserScript==
// @name        bilibili plus bilibilijj
// @namespace   http://qli5.tk/
// @description 在bilibili界面上直接添加来自jj的三种下载链接。flv是分段超清，mp4是整段高清，ass是弹幕。请登录jj以跳过广告页。播放弹幕可使用potplayer等。视频弹幕同名即可自动加载。
// @include     http://www.bilibili.com/video/av*
// @include     https://www.bilibili.com/video/av*
// @include     http://bangumi.bilibili.com/anime/*
// @include     https://bangumi.bilibili.com/anime/*
// @version     0.6
// @grant       GM_xmlhttpRequest
// @author      qli5
// @copyright   qli5, 2014+, 田生
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @require     https://greasyfork.org/scripts/2231-bilibili-ass-danmaku-downloader/code/bilibili%20ASS%20Danmaku%20Downloader.user.js
// @connect-src www.jijidown.com
// @connect-src comment.bilibili.com
// @downloadURL https://update.greasyfork.org/scripts/26941/bilibili%20plus%20bilibilijj.user.js
// @updateURL https://update.greasyfork.org/scripts/26941/bilibili%20plus%20bilibilijj.meta.js
// ==/UserScript==

// 感谢所有大佬，鄙人只做了微小的工作。
(function () {
    // jj的站长说被攻击了，所以加了很严格的机器人检查。可以尝试加快检查，但是如果您真的是机器人也没办法。
    var testingBypassSafedog = true;
    // 本测试功能适合一次会下载很多视频的场景，可以尽量方便地把mp4的文件名改成ass的。这是我能在同源限制下想出的最好办法。请诸大佬指教。
    var testingMP4Rename = true;
    // 本测试功能适合看完就删的场景，可以将ass的文件名改成mp4的。文件名一般是数字乱码，也有可能失败，但不需要多点击。
    var testingASSRename = true;
    // 强迫症就请自己动手改成true/false吧

    // settings
    // Nope, I will not bother you with them any more.

    // reset dalao's script
    window.removeEventListener('DOMContentLoaded', init);
    init = function () { };
    initFont();
    fetchXML = function (cid, callback) {
        var oReq = new XMLHttpRequest();
        oReq.open('GET', 'https://comment.bilibili.com/{{cid}}.xml'.replace('{{cid}}', cid));
        oReq.onload = function () {
            var content = oReq.responseText.replace(/(?:[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g, "");
            callback(content);
        };
        oReq.send();
    };

    var paraOriginal;
    GM_xmlhttpRequest(paraOriginal = {
        method: 'GET',
        url: 'http://www.jijidown' + location.href.match(/\.com.*/)[0],
        onload: function (response) {
            var doc = new DOMParser().parseFromString(response.responseText, 'text/html');
            var links = document.createElement('div');

            // anchor to jj
            var aa;
            aa = document.createElement('a');
            aa.href = 'http://www.jijidown' + location.href.match(/\.com.*/)[0];
            aa.textContent = 'bilibilijj';
            links.appendChild(aa);

            // testingMP4Rename
            var input, button;
            if (testingMP4Rename) {
                input = document.createElement('input');
                input.type = 'text';
                input.value = '小技巧：先选ass，再重命名mp4成这里的名字，就能自动加载弹幕啦~';
                input.onclick = function () { this.select(); };
                links.appendChild(input);
                button = document.createElement('button');
                button.onclick = function () {
                    try {
                        input.select();
                        document.execCommand('copy');
                    }
                    catch (e) {
                        console.warn('Oops, copy failed' + e);
                    }
                };
                button.textContent = '复制';
                links.appendChild(button);
            }

            if (doc.getElementsByClassName('yjs-browser-verification').length > 0) {
                // jj boom
                links.appendChild(document.createTextNode('jj觉得你是机器人，请手动访问一次。'));

                // testingBypassSafedog
                if (testingBypassSafedog) {
                    links.appendChild(document.createTextNode('但是你选择了跳过jj的机器人验证，讨厌~~稍后刷新'));
                    var jschl_vc = response.responseText.match(/<input type="hidden" name="jschl_vc" value=".*(?="\/>)/)[0].slice(44);
                    var pass = response.responseText.match(/<input type="hidden" name="pass" value=".*(?="\/>)/)[0].slice(40);
                    var jschl_answer = eval(
                        response.responseText
                            .match(/setTimeout\(function\(\){[\s\S]*?}[\s\S]*?(?=})/)[0].slice(23)
                            .replace("a = document.getElementById('jschl-answer');", 'a = {}')
                            .replace("f = document.getElementById('challenge-form');", '// f')
                            .replace("f.submit();", 'a;')
                    );

                    // safedog will reject false starts. you may tweak the delay if you have a higher RTT, especially if you are not in China
                    setTimeout(function () {
                        links.remove();
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: 'http://www.jijidown.com/cdn-cgi/l/chk_jschl?' + 'jschl_vc=' + encodeURIComponent(jschl_vc) + '&pass=' + encodeURIComponent(pass) + '&jschl_answer=' + encodeURIComponent(jschl_answer.value),
                            headers: {
                                'Referer': 'http://www.jijidown.com/'
                            },
                            onload: function () {
                                GM_xmlhttpRequest(paraOriginal);
                            }
                        });
                    }, 4000);

                    testingBypassSafedog = false; // to avoid infinite loop
                }
            }
            else {
                // parse jj
                var listCols = doc.getElementById('Right_Main');
                if (listCols.children.length === 0) links.appendChild(document.createTextNode('本视频貌似太冷门了，需要到jj刷新一下。'));
                for (var i = 0; i < listCols.children.length; i++) {
                    var list = listCols.children[i];
                    for (var j = 0; j < list.children.length; j++) {
                        var flvDiv, mp4Div, assDiv;
                        var name, cid;
                        if (list.children[j].querySelector('span.PBoxName') && list.children[j].querySelector('span.PBoxName').textContent != '公告') {
                            flvDiv = list.children[j].querySelector('span.Data_Main > span.Data_Flv > span.Data_Data');
                            mp4Div = list.children[j].querySelector('span.Data_Main > span.Data_Mp4 > span.Data_Data');
                            assDiv = list.children[j].querySelector('span.Data_Main > span.Data_Ass > span.Data_Data');
                            if (list.children[j].querySelector('span.PBoxName').textContent == '下载地址(右侧方块切换类型)')
                                name = assDiv.children[0].title.slice(0, -7);
                            else
                                name = list.children[j].querySelector('span.PBoxName').textContent;
                            cid = list.children[j].getAttribute('data-cid');

                            // name
                            links.appendChild(document.createElement('br'));
                            links.appendChild(document.createTextNode(name));
                            links.appendChild(document.createTextNode(' '));

                            // flv
                            var a;
                            a = document.createElement('a');
                            a.href = 'http://www.jijidown.com' + flvDiv.querySelector('a').getAttribute('href');
                            a.textContent = 'flv';
                            links.appendChild(a);
                            links.appendChild(document.createTextNode(' '));

                            // mp4
                            a = document.createElement('a');
                            a.textContent = 'mp4';
                            if (testingASSRename)
                                a.onclick = function () { this.nextSibling.nextSibling.download = this.href.match(/\/\d*(?=(-1-hd)?\.mp4)/)[0].slice(1) + '-1-hd.ass'; };
                            if (mp4Div.querySelector('a'))
                                a.href = 'http://www.jijidown.com' + mp4Div.querySelector('a').getAttribute('href');
                            else {
                                a.textContent = '本视频貌似太冷门了，需要到jj刷新一下。';
                            }
                            links.appendChild(a);
                            links.appendChild(document.createTextNode(' '));

                            // ass
                            a = document.createElement('a');
                            a.textContent = 'ass';
                            a.onclick = (function (name, cid, self) {
                                return function () {
                                    if (self.href.slice(0, 4) != 'blob') {
                                        fetchDanmaku(cid, function (danmaku) {
                                            var ass = generateASS(setPosition(danmaku), {
                                                'title': name,
                                                'ori': location.href,
                                            });
                                            // I would assume most users are using Windows
                                            var blob = new Blob(['\ufeff' + ass], { type: 'application/octet-stream' });
                                            self.setAttribute('href', window.URL.createObjectURL(blob));
                                            self.click();
                                        });
                                        return false;
                                    }
                                    if (testingMP4Rename) {
                                        input.value = name + '.mp4';
                                        input.select();
                                    }
                                };
                            })(name, cid, a);
                            a.download = name + '.ass';
                            a.href = 'http://www.bilibilijj.com' + assDiv.querySelector('a').getAttribute('href');
                            links.appendChild(a);
                        }
                    }
                }
            }

            // set styles
            links.style.backgroundColor = 'white';
            links.style.padding = '10px';
            links.style.border = 'black';
            links.style.borderWidth = 'thin';
            links.style.borderStyle = 'dashed';

            // append to page
            if (location.hostname == 'www.bilibili.com') {
                links.style.zIndex = '500000';
                links.style.position = 'absolute';
                links.style.top = '0px';
                document.querySelector('.v_small').appendChild(links);
            }
            else if (location.hostname == 'bangumi.bilibili.com') {
                document.querySelector('.v1-bangumi-list-part-wrapper').appendChild(links);
            }
        }
    });
})();