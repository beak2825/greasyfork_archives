// ==UserScript==
// @name         coursera.com 字幕翻译
// @namespace    https://github.com/journey-ad
// @version      0.2
// @icon         https://simpleicons.org/icons/coursera.svg
// @description  coursera.com 字幕实时翻译
// @author       journey-ad,Abnernat,Carpho
// @require      https://cdn.jsdelivr.net/npm/fingerprintjs2@2.1.0/fingerprint2.min.js
// @license      MIT
// @match        *://www.coursera.org/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/397489/courseracom%20%E5%AD%97%E5%B9%95%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/397489/courseracom%20%E5%AD%97%E5%B9%95%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function () {

    "use strict";

    const contentStyle = `
    text-align:center;
    color: white;
    font-size: 18px;
    line-height: 25px;
    padding: 12px;
    background: #757575; 
    width: 100%; 
    height: 35%;
  `;

    var transServer = "google";

    before();
    var cues = null;
    formatSub();
    window.transTimer = window.setInterval(init, 10000); // 用定时器检查待翻译文本是否已准备好

    async function init() {
        await sleep(3000);
        // 开启双语字幕
        let tracks = document.getElementsByTagName('track')
        let en
        let zhcn
        if (tracks.length) {
            for (let i = 0; i < tracks.length; i++) {
                if (tracks[i].srclang === 'en') {
                    en = tracks[i]
                } else if (tracks[i].srclang === 'zh-CN') {
                    zhcn = tracks[i]
                }
            }
            // 判定中文字幕是否存在, 如果存在，直接打开
            if (en) {
                let trackNode = en.track;
                trackNode.mode = 'hidden';

                if (zhcn) {
                    let trackNode = zhcn.track;
                    trackNode.mode = 'hidden';
                    window.clearInterval(window.transTimer)
                    trackNode.onload = showCue(trackNode);

                } else {
                    console.log("字幕文本可用")
                    // sleep(500).then(() => {
                    //用 sleep 让 cues 有充足的时间加载字幕以确保正常工作
                    await sleep(500);

                    let cues = trackNode.cues
                    if (cues) {
                        console.log("已经取到cues")
                        window.clearInterval(window.transTimer)
                    }
                    // console.log(cues)
                    for (let i = 0; i < cues.length; i++) {
                        cues[i].text = formatText(cues[i].text)
                    }

                    const cuesTextList = getCuesTextList(cues)

                    // console.log(cuesTextList)
                    // let transText = getTransText (cuesTextList)

                    window.subtitleTrans = []
                    var s = cuesTextList[0][1],
                        r = "",
                        arr = [],
                        num = 0,
                        count = 0;
                    // subtitle.forEach(function (e) {
                    //     // 去除每条字幕的换行符并按行排列
                    //     s += e.replace(/\r?\n|\r/g, " ") + "\n";
                    // })
                    console.log(s)
                    num = translate(s, function (data, index) {
                        // 调用翻译方法并处理回调
                        count++
                        arr[index] = data // 按分块原始下标放回结果数组

                        if (count >= num) {
                            // 所有翻译文本已取回
                            r = arr.join("\n")
                            window.subtitleTrans = r.split("\n")
                            // console.log(window.subtitleTrans)
                            let transText = window.subtitleTrans

                            console.log("使用 " + transServer + " 翻译完成");

                            for (let j, i = j = 0; j < transText.length; j++) {
                                cues[cuesTextList[i][0] + j].text += "<br />" + "\n" + formatText(transText[j])
                            }
                        }
                    })

                    trackNode.onload = showCue(trackNode);
                    // })
                }
            }
        }
    }

    function formatSub() {
        var css = 'video::cue {font-size: medium; white-space: pre;}',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
    }

    function showCue(trackNode) {
        let panel = document.querySelector(".rc-VideoToolbar.horizontal-box.align-items-spacebetween");
        // var css = 'sub_div {background: #757575; width: 100%; padding-bottom: 100%;}'

        panel.style.justifyContent = "flex-start";
        const content = document.createElement("div");
        content.innerHTML = "正在翻译字幕…";
        content.style.cssText = contentStyle;
        panel.innerHTML = "";
        panel.append(content);

        console.log("开始抓取字幕")

        // addSubPanel(panel);
        // console.log(content)

        //track节点对象有ready状态码 0=NONE 1=LOADING 2=LOADED 3=ERROR
        //chrome下是2,ie下'complete'
        // console.log("进入showCue")
        // if (trackNode.readyState == 2 || trackNode.readyState == 'complete') {
        //通过track节点对象的cuechange事件，实现同步
        trackNode.addEventListener('cuechange', function () {

            // 通过track节点对象的track属性 获得文本轨道对象
            // var track = this.track;
            // 通过文本轨道对象获得当前激活的字幕对象
            // console.log(track);
            var activecue = trackNode.activeCues;
            // console.log(activecue);
            // panel.innerHTML = "";
            // var content = document.getElementById('content').textContent;
            // const content = document.createElement("div");
            if (activecue.length > 0) {
                content.innerHTML = "";
                for (var i = 0; i < activecue.length; i++) {
                    //在oText节点里显示所有激活的字幕文本
                    content.innerHTML += activecue[i].text;
                    // console.log(activecue[i].text);
                }
            }
        }, false);
        // }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    function getCuesTextList(cues) {
        // 取出字幕的所有文本内容，整合成为一个列表
        // 每项为不大于 5000 字的字符串，（好像目前使用的这个 API 有 5000 字上限？）
        // 以及它在 cues 的起始位置
        // 返回的数据结构大概是 [[0, 文本], [95, 文本]]
        let cuesTextList = []
        for (let i = 0; i < cues.length; i++) {
            if (cuesTextList.length) {
                // 需要插入一个分隔符(换行)，以便之后为翻译完的字符串 split
                // 用两个换行符来分割，因为有的视频字幕是自带换行符
                cuesTextList[cuesTextList.length - 1][1] += "\n" + formatText(cues[i].text)
            } else {
                cuesTextList.push([i, formatText(cues[i].text)])
            }
        }
        return cuesTextList
    }

    function formatText(str) {
        var s = str.replace(/\r?\n|\r/g, " ", "  ", "\n");
        return s;
    }

    function translate(str, callback) {
        var textArr = [],
            count = 1;

        if (str.length > 5000) {
            //大于5000字符分块翻译
            var strArr = str.split("\n"),
                i = 0;
            strArr.forEach(function (v) {
                textArr[i] = textArr[i] || "";

                if ((textArr[i] + v).length > (i + 1) * 5000) {
                    // 若加上此行后长度超出5000字符则分块
                    i++;
                    textArr[i] = "";
                }

                textArr[i] += v + "\n";
            });
            count = i + 1; // 记录块的数量
        } else {
            textArr[0] = str;
        }

        textArr.forEach(function (text, index) {
            // 遍历每块分别进行翻译
            server({
                text: text.trim(),
                index: index
            }, callback);
        });
        return count; // 返回分块数量
    }

    function serialize(obj) {
        return Object.keys(obj).map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]).replace("%20", "+");
        }).join("&");
    }

    function server() {
        var list = {
            sogou: function sogou(r, callback) {
                var KEY = "b33bf8c58706155663d1ad5dba4192dc"; // 硬编码于搜狗网页翻译js

                var data = {
                    "from": "auto",
                    "to": "zh-CHS",
                    "client": "pc",
                    "fr": "browser_pc",
                    "text": r.text,
                    "pid": "sogou-dict-vr",
                    "useDetect": "on",
                    "useDetectResult": "on",
                    "oxford": "on",
                    "isReturnSugg": "on",
                    "needQc": 1,
                    "s": md5("autozh-CHS".concat(r.text).concat(KEY)) // 签名算法

                };
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://fanyi.sogou.com/reventondc/translateV1",
                    headers: {
                        "accept": "application/json",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    data: serialize(data),
                    onload: function onload(response) {
                        var result = JSON.parse(response.responseText);
                        callback(result.data.translate.dit, r.index); // 执行回调，在回调中拼接
                    }
                });
            },
            caiyun: function caiyun(r, callback) {
                var data = {
                    "source": r.text.split("\n"),
                    "trans_type": "en2zh",
                    "request_id": "web_fanyi",
                    "media": "text",
                    "os_type": "web",
                    "dict": true,
                    "cached": true,
                    "replaced": true,
                    "browser_id": window.transConfig.caiyun.browser_id
                };
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://api.interpreter.caiyunai.com/v1/translator",
                    headers: {
                        "accept": "application/json",
                        "content-type": "application/json; charset=UTF-8",
                        "X-Authorization": "token:qgemv4jr1y38jyq6vhvi",
                        "T-Authorization": window.transConfig.caiyun.jwt
                    },
                    data: JSON.stringify(data),
                    onload: function onload(response) {
                        var result = JSON.parse(response.responseText);

                        var index = function index(t) {
                            return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(t); // 遍历密文 返回在字母表中的索引 非字母返回-1
                        };

                        var encode = function encode(e) {
                            return e.split("").map(function (t) {
                                return index(t) > -1 ? "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm"[index(t)] : t; // 若返回值大于-1 则取密码表对应位数的密值 否则返回其自身 并拼接为新字符串
                            }).join("").replace(/[-_]/g, function (e) {
                                return "-" == e ? "+" : "/";
                            }).replace(/[^A-Za-z0-9\+\/]/g, ""); // 将转换后的字符串中的-转为+，_转为/ 并去空，得到base64编码字符串
                        };

                        var btou = function btou(e) { // 然后!&^@%#*&$%!(@$
                            return e.replace(/[À-ß][-¿]|[à-ï][-¿]{2}|[ð-÷][-¿]{3}/g, function (e) {
                                switch (e.length) {
                                    case 4:
                                        var t = ((7 & e.charCodeAt(0)) << 18 | (63 & e.charCodeAt(1)) << 12 | (63 & e.charCodeAt(2)) << 6 | 63 & e.charCodeAt(3)) - 65536;
                                        return String.fromCharCode(55296 + (t >>> 10)) + String.fromCharCode(56320 + (1023 & t));

                                    case 3:
                                        return String.fromCharCode((15 & e.charCodeAt(0)) << 12 | (63 & e.charCodeAt(1)) << 6 | 63 & e.charCodeAt(2));

                                    default:
                                        return String.fromCharCode((31 & e.charCodeAt(0)) << 6 | 63 & e.charCodeAt(1));
                                }
                            });
                        };

                        var encodeArr = result.target.map(function (words) {
                            var base64 = encode(words); // "6Vh55c6p" -> "6Iu55p6c"
                            return btou(atob(base64)); // "6Iu55p6c" -> "è¹æ" -> "苹果"
                        });
                        callback(encodeArr.join("\n"), r.index); // 执行回调，在回调中拼接
                    }
                });
            },
            google: function google(r, callback) {
                var data = {
                    "q": r.text,
                    "client": "webapp",
                    "sl": "auto",
                    "tl": "zh-CN",
                    "hl": "zh-CN",
                    "dt": "t",
                    "otf": 1,
                    "pc": 1,
                    "ssel": 0,
                    "tsel": 0,
                    "kc": 5,
                    "tk": tk(r.text)
                };
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://translate.google.cn/translate_a/single",
                    headers: {
                        "accept": "application/json",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    data: serialize(data),
                    onload: function onload(response) {
                        var result = JSON.parse(response.responseText),
                            arr = [];
                        result[0].forEach(function (t) {
                            t && arr.push(t[0]);
                        });
                        callback(arr.join(""), r.index); // 执行回调，在回调中拼接
                    }
                });
            }
        };
        return list[transServer].apply(null, arguments);
    }

    function before() {
        window.transConfig = {
            caiyun: {}
        };

        if (transServer === 'caiyun') {
            Fingerprint2 && Fingerprint2.get({}, function (components) {
                var values = components.map(function (component) {
                    return component.value;
                });
                window.transConfig.caiyun.browser_id = Fingerprint2.x64hash128(values.join(''), 233);
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://api.interpreter.caiyunai.com/v1/user/jwt/generate",
                    headers: {
                        "accept": "application/json",
                        "content-type": "application/json; charset=UTF-8",
                        "X-Authorization": "token:qgemv4jr1y38jyq6vhvi"
                    },
                    data: JSON.stringify({
                        "browser_id": window.transConfig.caiyun.browser_id
                    }),
                    onload: function onload(response) {
                        var result = JSON.parse(response.responseText);
                        window.transConfig.caiyun.jwt = result.jwt;
                    }
                });
            });
        }
    }

    function md5(str) {
        var k = [],
            i = 0;

        for (i = 0; i < 64;) {
            k[i] = 0 | Math.abs(Math.sin(++i)) * 4294967296;
        }

        var b,
            c,
            d,
            j,
            x = [],
            str2 = unescape(encodeURI(str)),
            a = str2.length,
            h = [b = 1732584193, c = -271733879, ~b, ~c];

        for (i = 0; i <= a;) {
            x[i >> 2] |= (str2.charCodeAt(i) || 128) << 8 * (i++ % 4);
        }

        x[str = (a + 8 >> 6) * 16 + 14] = a * 8;
        i = 0;

        for (; i < str; i += 16) {
            a = h;
            j = 0;

            for (; j < 64;) {
                a = [d = a[3], (b = a[1] | 0) + ((d = a[0] + [b & (c = a[2]) | ~b & d, d & b | ~d & c, b ^ c ^ d, c ^ (b | ~d)][a = j >> 4] + (k[j] + (x[[j, 5 * j + 1, 3 * j + 5, 7 * j][a] % 16 + i] | 0))) << (a = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21][4 * a + j++ % 4]) | d >>> 32 - a), b, c];
            }

            for (j = 4; j;) {
                h[--j] = h[j] + a[j];
            }
        }

        str = "";

        for (; j < 32;) {
            str += (h[j >> 3] >> (1 ^ j++ & 7) * 4 & 15).toString(16);
        }

        return str;
    }

    function tk(a) {
        var tkk = "429175.1243284773",
            Jo = null,
            b,
            c,
            d;

        function Ho(a) {
            return function () {
                return a;
            };
        }

        function Io(a, b) {
            for (var c = 0; c < b.length - 2; c += 3) {
                var d = b.charAt(c + 2);
                d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
                d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
                a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d;
            }

            return a;
        }

        if (null !== Jo) b = Jo; else {
            b = Ho(String.fromCharCode(84));
            c = Ho(String.fromCharCode(75));
            b = [b(), b()];
            b[1] = c();
            b = (Jo = tkk || "") || "";
        }
        d = Ho(String.fromCharCode(116));
        c = Ho(String.fromCharCode(107));
        d = [d(), d()];
        d[1] = c();
        d = b.split(".");
        b = Number(d[0]) || 0;

        for (var e = [], f = 0, g = 0; g < a.length; g++) {
            var k = a.charCodeAt(g);
            128 > k ? e[f++] = k : (2048 > k ? e[f++] = k >> 6 | 192 : (55296 == (k & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (k = 65536 + ((k & 1023) << 10) + (a.charCodeAt(++g) & 1023), e[f++] = k >> 18 | 240, e[f++] = k >> 12 & 63 | 128) : e[f++] = k >> 12 | 224, e[f++] = k >> 6 & 63 | 128), e[f++] = k & 63 | 128);
        }

        a = b;

        for (f = 0; f < e.length; f++) {
            a += e[f], a = Io(a, "+-a^+6");
        }

        a = Io(a, "+-3^+b+-f");
        a ^= Number(d[1]) || 0;
        0 > a && (a = (a & 2147483647) + 2147483648);
        a %= 1E6;
        return a.toString() + "." + (a ^ b);
    }

})();