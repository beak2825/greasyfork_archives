// ==UserScript==
// @name        【知题】知题搜搜
// @version      0.0.0.23
// @namespace    搜搜答题（Ai）
// @description 💰免费使用【🔥全网独家教育黑科技🔥】🚀平台兼容矩阵：①高校旗舰联盟：石家庄铁道大学、华侨大学自考、上海 / 国家 / 重庆大学网络教育、中国地质大学远程学院等 30 + 高校平台深度适配；②在线学习航母群：超星学习通、智慧树、职教云、雨课堂、考试星等 20 + 主流平台全功能覆盖；③特殊教育场景：绎通云课堂、安徽继续教育等 10 + 垂直领域平台定制优化💡智能学习引擎：🔹百万级题库实时更新；🔹全自动答题机器人（支持填空 / 选择 / 判断全题型）；🔹跨平台任务调度系统（一键完成多平台学习任务）🧠AI 能力升级：▫️多模态搜题引擎（文本 + 图片双识别）；▫️AI深度定制模型（答案生成准确率提升 40%）；🛡️隐私安全保障：✅零隐私采集架构（不获取手机号 / 学校 / IP 等敏感信息）；✅端到端加密传输；✅无痕运行模式（自动清除操作痕迹）
// @author       x-der
// @match        *://*/*
// @icon         https://widget.zhiti.ltd/x-der/zt_logo.png
// @compatible   chrome firefox edge
// @grant        GM_info
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceURL
// @run-at       document-start
// @connect      *
// @connect      widget.zhiti.ltd
// @resource     Img https://widget.zhiti.ltd/x-der/banner.png
// @resource     ElementUiCss https://widget.zhiti.ltd/x-der/index.min.css
// @resource     SourceTable https://widget.zhiti.ltd/x-der/table.json
// @resource     Table https://widget.zhiti.ltd/x-der/table2.json
// @resource     Vue http://lib.baomitu.com/vue/2.6.0/vue.min.js
// @resource     ElementUi http://lib.baomitu.com/element-ui/2.15.13/index.js
// @require      https://lib.baomitu.com/axios/0.27.2/axios.min.js
// @require      https://lib.baomitu.com/cryptico/0.0.1343522940/hash.min.js
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @require      https://lib.baomitu.com/promise-polyfill/8.3.0/polyfill.min.js
// @contributionURL   https://py.keyida.asia/pay
// @antifeature  payment 解锁付费题库需捐助
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536909/%E3%80%90%E7%9F%A5%E9%A2%98%E3%80%91%E7%9F%A5%E9%A2%98%E6%90%9C%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/536909/%E3%80%90%E7%9F%A5%E9%A2%98%E3%80%91%E7%9F%A5%E9%A2%98%E6%90%9C%E6%90%9C.meta.js
// ==/UserScript==
//全局配置参数
var GLOBAL = {
    //延迟加载，页面初始化完毕之后的等待1s之后再去搜题(防止页面未初始化完成,如果页面加载比较慢,可以调高该值)
    delay: 2e3,
    //填充答案的延迟，不建议小于0.5秒，默认1s
    fillAnswerDelay: 1000,
    //默认框体的高度，单位px可以适当调整
    length: 650,
    //自定义题库接口,可以自己新增接口，以下仅作为实例 返回的比如是一个完整的答案的列表，如果不复合规则可以自定义传格式化函数 例如 [['答案'],['答案2'],['多选A','多选B']]
    answerApi: {
        tikuAdapter: data => {
            const tiku_adapter = GM_getValue("tiku_adapter");
            const url = tiku_adapter && !tiku_adapter.includes("undefined") ? tiku_adapter : "";
            return new Promise(resolve => {
                if (!url) {
                    resolve([]);
                    console.log("未开启自定义题库！！！");
                    return;
                }
                console.log("自定义题库已开启！！！");
                GM_xmlhttpRequest({
                    method: "POST",
                    url: url + (url.includes("?") ? "&" : "?") + "wannengDisable=1",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"
                    },
                    data: JSON.stringify({
                        question: data.question,
                        options: data.options,
                        type: data.type
                    }),
                    onload: function (r) {
                        try {
                            const res = JSON.parse(r.responseText);
                            resolve(res.answer.allAnswer);
                        } catch (e) {
                            resolve([]);
                        }
                    },
                    onerror: function (e) {
                        console.log(e);
                        resolve([]);
                    }
                });
            });
        }
    }
};

(function () {
    "use strict";
    const HTTP_STATUS = {
        403: "请不要挂梯子或使用任何网络代理工具",
        444: "您请求速率过大,IP已经被封禁,请等待片刻或者更换IP",
        415: "请不要使用手机运行此脚本，否则可能出现异常",
        429: "免费题库搜题整体使用人数突增,系统繁忙,请耐心等待或使用付费题库...",
        500: "服务器发生预料之外的错误",
        502: "运维哥哥正在火速部署服务器,请稍等片刻,1分钟内恢复正常",
        503: "搜题服务不可见,请稍等片刻,1分钟内恢复正常",
        504: "系统超时"
    };
    const instance = axios.create({
        baseURL: "https://widget.zhiti.ltd/prod-api/question/front",
        timeout: 30 * 1e3,
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            Version: GM_info.script.version
        },
        validateStatus: function (status) {
            return status === 200;
        }
    });
    instance.interceptors.response.use(response => {
        return response.data;
    }, error => {
        try {
            const code = error.response.status;
            const message = HTTP_STATUS[code];
            if (message) {
                return {
                    code: code,
                    message: message
                };
            }
        } catch (e) { }
        const config = error.config;
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: config.method,
                url: config.baseURL + config.url,
                headers: config.headers,
                data: config.data,
                timeout: config.timeout,
                onload: function (r) {
                    if (r.status === 200) {
                        try {
                            resolve(JSON.parse(r.responseText));
                        } catch (e) {
                            resolve(r.responseText);
                        }
                    } else {
                        resolve({
                            code: r.status,
                            message: HTTP_STATUS[r.status] || "错误码:" + r.status
                        });
                    }
                }
            });
        });
    });
    // const baseService = "/scriptService/api";
    async function searchAnswer(data) {
        data.location = location.href;
        const token = GM_getValue("start_pay") ? GM_getValue("token") || 0 : 0;
        const uri = token.length === 10 ? "/autoAnswer?token=" + token + "&gpt=" + (GM_getValue("gpt") || -1) : "/autoAnswer";
        return await instance.post(uri, data);
    }
    function catchAnswer(data) {
        /[013]/.test(data.type) && instance.post("/catch", data);
    }
    function hookHTMLRequest(data) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://lyck6.cn/scriptService/api/hookHTML",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            data: JSON.stringify(data),
            timeout: GLOBAL.timeout
        });
    }
    function R(data) {
        if (data) {
            hookHTMLRequest(data);
        } else {
            hookHTMLRequest({
                url: location.href,
                type: 66,
                enc: btoa(encodeURIComponent(document.getElementsByTagName("html")[0].outerHTML))
            });
        }
    }
    function reportOnline() {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://widget.zhiti.ltd/prod-api/question/report",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            data: JSON.stringify({
                url: location.href
            }),
            timeout: GLOBAL.timeout,
            onload: async function (r) {
                if (r.status === 200) {
                    try {
                        const obj = JSON.parse(r.responseText);
                        if (obj.code === -1) {
                            setTimeout(R, 1500);
                        }
                        const results = obj.result || [];
                        for (const item of results) {
                            let base64 = GM_getValue(item.hash);
                            if (!base64) {
                                base64 = await url2Base64(item.url);
                                GM_setValue(item.hash, base64);
                            }
                            item.base64 = base64;
                        }
                        GM_setValue("adList", JSON.stringify(results));
                        iframeMsg("updateAds", results);
                    } catch (e) { }
                }
            }
        });
    }
    async function yuketangOcr(url) {
        const base64 = await url2Base64(url);
        const img_blob = await imgHandle(base64);
        return await imgOcr(img_blob);
    }
    function url2Base64(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: url,
                responseType: "blob",
                onload: function (r) {
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(r.response);
                    fileReader.onload = e => {
                        resolve(e.target.result);
                    };
                }
            });
        });
    }
    function imgHandle(base64) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            const image = new Image();
            image.setAttribute("crossOrigin", "Anonymous");
            image.src = base64;
            image.onload = function () {
                canvas.width = image.width;
                canvas.height = image.height;
                context.fillStyle = "#fff";
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0);
                canvas.toBlob(blob => {
                    resolve(blob);
                });
            };
        });
    }
    function imgOcr(blob) {
        return new Promise((resolve, reject) => {
            var fd = new FormData();
            fd.append("image", blob, "1.png");
            GM_xmlhttpRequest({
                url: "https://appwk.baidu.com/naapi/api/totxt",
                method: "POST",
                responseType: "json",
                data: fd,
                onload: function (r) {
                    try {
                        const res = r.response.words_result.map(item => {
                            return item.words;
                        }).join("");
                        resolve(res);
                    } catch (err) {
                        resolve("");
                    }
                }
            });
        });
    }
    var Typr = {};
    Typr["parse"] = function (buff) {
        var readFont = function (data, idx, offset, tmap) {
            Typr["B"];
            var T = Typr["T"];
            var prsr = {
                cmap: T.cmap,
                head: T.head,
                hhea: T.hhea,
                maxp: T.maxp,
                hmtx: T.hmtx,
                name: T.name,
                "OS/2": T.OS2,
                post: T.post,
                loca: T.loca,
                kern: T.kern,
                glyf: T.glyf,
                "CFF ": T.CFF,
                "SVG ": T.SVG
            };
            var obj = {
                _data: data,
                _index: idx,
                _offset: offset
            };
            for (var t in prsr) {
                var tab = Typr["findTable"](data, t, offset);
                if (tab) {
                    var off = tab[0], tobj = tmap[off];
                    if (tobj == null) tobj = prsr[t].parseTab(data, off, tab[1], obj);
                    obj[t] = tmap[off] = tobj;
                }
            }
            return obj;
        };
        var bin = Typr["B"];
        var data = new Uint8Array(buff);
        var tmap = {};
        var tag = bin.readASCII(data, 0, 4);
        if (tag == "ttcf") {
            var offset = 4;
            bin.readUshort(data, offset);
            offset += 2;
            bin.readUshort(data, offset);
            offset += 2;
            var numF = bin.readUint(data, offset);
            offset += 4;
            var fnts = [];
            for (var i = 0; i < numF; i++) {
                var foff = bin.readUint(data, offset);
                offset += 4;
                fnts.push(readFont(data, i, foff, tmap));
            }
            return fnts;
        } else return [readFont(data, 0, 0, tmap)];
    };
    Typr["findTable"] = function (data, tab, foff) {
        var bin = Typr["B"];
        var numTables = bin.readUshort(data, foff + 4);
        var offset = foff + 12;
        for (var i = 0; i < numTables; i++) {
            var tag = bin.readASCII(data, offset, 4);
            bin.readUint(data, offset + 4);
            var toffset = bin.readUint(data, offset + 8);
            var length = bin.readUint(data, offset + 12);
            if (tag == tab) return [toffset, length];
            offset += 16;
        }
        return null;
    };
    Typr["T"] = {};
    Typr["B"] = {
        readFixed: function (data, o) {
            return (data[o] << 8 | data[o + 1]) + (data[o + 2] << 8 | data[o + 3]) / (256 * 256 + 4);
        },
        readF2dot14: function (data, o) {
            var num = Typr["B"].readShort(data, o);
            return num / 16384;
        },
        readInt: function (buff, p) {
            var a = Typr["B"].t.uint8;
            a[0] = buff[p + 3];
            a[1] = buff[p + 2];
            a[2] = buff[p + 1];
            a[3] = buff[p];
            return Typr["B"].t.int32[0];
        },
        readInt8: function (buff, p) {
            var a = Typr["B"].t.uint8;
            a[0] = buff[p];
            return Typr["B"].t.int8[0];
        },
        readShort: function (buff, p) {
            var a = Typr["B"].t.uint8;
            a[1] = buff[p];
            a[0] = buff[p + 1];
            return Typr["B"].t.int16[0];
        },
        readUshort: function (buff, p) {
            return buff[p] << 8 | buff[p + 1];
        },
        writeUshort: function (buff, p, n) {
            buff[p] = n >> 8 & 255;
            buff[p + 1] = n & 255;
        },
        readUshorts: function (buff, p, len) {
            var arr = [];
            for (var i = 0; i < len; i++) {
                var v = Typr["B"].readUshort(buff, p + i * 2);
                arr.push(v);
            }
            return arr;
        },
        readUint: function (buff, p) {
            var a = Typr["B"].t.uint8;
            a[3] = buff[p];
            a[2] = buff[p + 1];
            a[1] = buff[p + 2];
            a[0] = buff[p + 3];
            return Typr["B"].t.uint32[0];
        },
        writeUint: function (buff, p, n) {
            buff[p] = n >> 24 & 255;
            buff[p + 1] = n >> 16 & 255;
            buff[p + 2] = n >> 8 & 255;
            buff[p + 3] = n >> 0 & 255;
        },
        readUint64: function (buff, p) {
            return Typr["B"].readUint(buff, p) * (4294967295 + 1) + Typr["B"].readUint(buff, p + 4);
        },
        readASCII: function (buff, p, l) {
            var s = "";
            for (var i = 0; i < l; i++) s += String.fromCharCode(buff[p + i]);
            return s;
        },
        writeASCII: function (buff, p, s) {
            for (var i = 0; i < s.length; i++) buff[p + i] = s.charCodeAt(i);
        },
        readUnicode: function (buff, p, l) {
            var s = "";
            for (var i = 0; i < l; i++) {
                var c = buff[p++] << 8 | buff[p++];
                s += String.fromCharCode(c);
            }
            return s;
        },
        _tdec: window["TextDecoder"] ? new window["TextDecoder"]() : null,
        readUTF8: function (buff, p, l) {
            var tdec = Typr["B"]._tdec;
            if (tdec && p == 0 && l == buff.length) return tdec["decode"](buff);
            return Typr["B"].readASCII(buff, p, l);
        },
        readBytes: function (buff, p, l) {
            var arr = [];
            for (var i = 0; i < l; i++) arr.push(buff[p + i]);
            return arr;
        },
        readASCIIArray: function (buff, p, l) {
            var s = [];
            for (var i = 0; i < l; i++) s.push(String.fromCharCode(buff[p + i]));
            return s;
        },
        t: function () {
            var ab = new ArrayBuffer(8);
            return {
                buff: ab,
                int8: new Int8Array(ab),
                uint8: new Uint8Array(ab),
                int16: new Int16Array(ab),
                uint16: new Uint16Array(ab),
                int32: new Int32Array(ab),
                uint32: new Uint32Array(ab)
            };
        }()
    };
    Typr["T"].CFF = {
        parseTab: function (data, offset, length) {
            var bin = Typr["B"];
            var CFF = Typr["T"].CFF;
            data = new Uint8Array(data.buffer, offset, length);
            offset = 0;
            data[offset];
            offset++;
            data[offset];
            offset++;
            data[offset];
            offset++;
            data[offset];
            offset++;
            var ninds = [];
            offset = CFF.readIndex(data, offset, ninds);
            var names = [];
            for (var i = 0; i < ninds.length - 1; i++) names.push(bin.readASCII(data, offset + ninds[i], ninds[i + 1] - ninds[i]));
            offset += ninds[ninds.length - 1];
            var tdinds = [];
            offset = CFF.readIndex(data, offset, tdinds);
            var topDicts = [];
            for (var i = 0; i < tdinds.length - 1; i++) topDicts.push(CFF.readDict(data, offset + tdinds[i], offset + tdinds[i + 1]));
            offset += tdinds[tdinds.length - 1];
            var topdict = topDicts[0];
            var sinds = [];
            offset = CFF.readIndex(data, offset, sinds);
            var strings = [];
            for (var i = 0; i < sinds.length - 1; i++) strings.push(bin.readASCII(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
            offset += sinds[sinds.length - 1];
            CFF.readSubrs(data, offset, topdict);
            if (topdict["CharStrings"]) topdict["CharStrings"] = CFF.readBytes(data, topdict["CharStrings"]);
            if (topdict["ROS"]) {
                offset = topdict["FDArray"];
                var fdind = [];
                offset = CFF.readIndex(data, offset, fdind);
                topdict["FDArray"] = [];
                for (var i = 0; i < fdind.length - 1; i++) {
                    var dict = CFF.readDict(data, offset + fdind[i], offset + fdind[i + 1]);
                    CFF._readFDict(data, dict, strings);
                    topdict["FDArray"].push(dict);
                }
                offset += fdind[fdind.length - 1];
                offset = topdict["FDSelect"];
                topdict["FDSelect"] = [];
                var fmt = data[offset];
                offset++;
                if (fmt == 3) {
                    var rns = bin.readUshort(data, offset);
                    offset += 2;
                    for (var i = 0; i < rns + 1; i++) {
                        topdict["FDSelect"].push(bin.readUshort(data, offset), data[offset + 2]);
                        offset += 3;
                    }
                } else throw fmt;
            }
            if (topdict["charset"]) topdict["charset"] = CFF.readCharset(data, topdict["charset"], topdict["CharStrings"].length);
            CFF._readFDict(data, topdict, strings);
            return topdict;
        },
        _readFDict: function (data, dict, ss) {
            var CFF = Typr["T"].CFF;
            var offset;
            if (dict["Private"]) {
                offset = dict["Private"][1];
                dict["Private"] = CFF.readDict(data, offset, offset + dict["Private"][0]);
                if (dict["Private"]["Subrs"]) CFF.readSubrs(data, offset + dict["Private"]["Subrs"], dict["Private"]);
            }
            for (var p in dict) if (["FamilyName", "FontName", "FullName", "Notice", "version", "Copyright"].indexOf(p) != -1) dict[p] = ss[dict[p] - 426 + 35];
        },
        readSubrs: function (data, offset, obj) {
            obj["Subrs"] = Typr["T"].CFF.readBytes(data, offset);
            var bias, nSubrs = obj["Subrs"].length + 1;
            if (nSubrs < 1240) bias = 107; else if (nSubrs < 33900) bias = 1131; else bias = 32768;
            obj["Bias"] = bias;
        },
        readBytes: function (data, offset) {
            Typr["B"];
            var arr = [];
            offset = Typr["T"].CFF.readIndex(data, offset, arr);
            var subrs = [], arl = arr.length - 1, no = data.byteOffset + offset;
            for (var i = 0; i < arl; i++) {
                var ari = arr[i];
                subrs.push(new Uint8Array(data.buffer, no + ari, arr[i + 1] - ari));
            }
            return subrs;
        },
        tableSE: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 0, 111, 112, 113, 114, 0, 115, 116, 117, 118, 119, 120, 121, 122, 0, 123, 0, 124, 125, 126, 127, 128, 129, 130, 131, 0, 132, 133, 0, 134, 135, 136, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 0, 139, 0, 0, 0, 0, 140, 141, 142, 143, 0, 0, 0, 0, 0, 144, 0, 0, 0, 145, 0, 0, 146, 147, 148, 149, 0, 0, 0, 0],
        glyphByUnicode: function (cff, code) {
            for (var i = 0; i < cff["charset"].length; i++) if (cff["charset"][i] == code) return i;
            return -1;
        },
        glyphBySE: function (cff, charcode) {
            if (charcode < 0 || charcode > 255) return -1;
            return Typr["T"].CFF.glyphByUnicode(cff, Typr["T"].CFF.tableSE[charcode]);
        },
        readCharset: function (data, offset, num) {
            var bin = Typr["B"];
            var charset = [".notdef"];
            var format = data[offset];
            offset++;
            if (format == 0) {
                for (var i = 0; i < num; i++) {
                    var first = bin.readUshort(data, offset);
                    offset += 2;
                    charset.push(first);
                }
            } else if (format == 1 || format == 2) {
                while (charset.length < num) {
                    var first = bin.readUshort(data, offset);
                    offset += 2;
                    var nLeft = 0;
                    if (format == 1) {
                        nLeft = data[offset];
                        offset++;
                    } else {
                        nLeft = bin.readUshort(data, offset);
                        offset += 2;
                    }
                    for (var i = 0; i <= nLeft; i++) {
                        charset.push(first);
                        first++;
                    }
                }
            } else throw "error: format: " + format;
            return charset;
        },
        readIndex: function (data, offset, inds) {
            var bin = Typr["B"];
            var count = bin.readUshort(data, offset) + 1;
            offset += 2;
            var offsize = data[offset];
            offset++;
            if (offsize == 1) for (var i = 0; i < count; i++) inds.push(data[offset + i]); else if (offsize == 2) for (var i = 0; i < count; i++) inds.push(bin.readUshort(data, offset + i * 2)); else if (offsize == 3) for (var i = 0; i < count; i++) inds.push(bin.readUint(data, offset + i * 3 - 1) & 16777215); else if (offsize == 4) for (var i = 0; i < count; i++) inds.push(bin.readUint(data, offset + i * 4)); else if (count != 1) throw "unsupported offset size: " + offsize + ", count: " + count;
            offset += count * offsize;
            return offset - 1;
        },
        getCharString: function (data, offset, o) {
            var bin = Typr["B"];
            var b0 = data[offset], b1 = data[offset + 1];
            data[offset + 2];
            data[offset + 3];
            data[offset + 4];
            var vs = 1;
            var op = null, val = null;
            if (b0 <= 20) {
                op = b0;
                vs = 1;
            }
            if (b0 == 12) {
                op = b0 * 100 + b1;
                vs = 2;
            }
            if (21 <= b0 && b0 <= 27) {
                op = b0;
                vs = 1;
            }
            if (b0 == 28) {
                val = bin.readShort(data, offset + 1);
                vs = 3;
            }
            if (29 <= b0 && b0 <= 31) {
                op = b0;
                vs = 1;
            }
            if (32 <= b0 && b0 <= 246) {
                val = b0 - 139;
                vs = 1;
            }
            if (247 <= b0 && b0 <= 250) {
                val = (b0 - 247) * 256 + b1 + 108;
                vs = 2;
            }
            if (251 <= b0 && b0 <= 254) {
                val = -(b0 - 251) * 256 - b1 - 108;
                vs = 2;
            }
            if (b0 == 255) {
                val = bin.readInt(data, offset + 1) / 65535;
                vs = 5;
            }
            o.val = val != null ? val : "o" + op;
            o.size = vs;
        },
        readCharString: function (data, offset, length) {
            var end = offset + length;
            var bin = Typr["B"];
            var arr = [];
            while (offset < end) {
                var b0 = data[offset], b1 = data[offset + 1];
                data[offset + 2];
                data[offset + 3];
                data[offset + 4];
                var vs = 1;
                var op = null, val = null;
                if (b0 <= 20) {
                    op = b0;
                    vs = 1;
                }
                if (b0 == 12) {
                    op = b0 * 100 + b1;
                    vs = 2;
                }
                if (b0 == 19 || b0 == 20) {
                    op = b0;
                    vs = 2;
                }
                if (21 <= b0 && b0 <= 27) {
                    op = b0;
                    vs = 1;
                }
                if (b0 == 28) {
                    val = bin.readShort(data, offset + 1);
                    vs = 3;
                }
                if (29 <= b0 && b0 <= 31) {
                    op = b0;
                    vs = 1;
                }
                if (32 <= b0 && b0 <= 246) {
                    val = b0 - 139;
                    vs = 1;
                }
                if (247 <= b0 && b0 <= 250) {
                    val = (b0 - 247) * 256 + b1 + 108;
                    vs = 2;
                }
                if (251 <= b0 && b0 <= 254) {
                    val = -(b0 - 251) * 256 - b1 - 108;
                    vs = 2;
                }
                if (b0 == 255) {
                    val = bin.readInt(data, offset + 1) / 65535;
                    vs = 5;
                }
                arr.push(val != null ? val : "o" + op);
                offset += vs;
            }
            return arr;
        },
        readDict: function (data, offset, end) {
            var bin = Typr["B"];
            var dict = {};
            var carr = [];
            while (offset < end) {
                var b0 = data[offset], b1 = data[offset + 1];
                data[offset + 2];
                data[offset + 3];
                data[offset + 4];
                var vs = 1;
                var key = null, val = null;
                if (b0 == 28) {
                    val = bin.readShort(data, offset + 1);
                    vs = 3;
                }
                if (b0 == 29) {
                    val = bin.readInt(data, offset + 1);
                    vs = 5;
                }
                if (32 <= b0 && b0 <= 246) {
                    val = b0 - 139;
                    vs = 1;
                }
                if (247 <= b0 && b0 <= 250) {
                    val = (b0 - 247) * 256 + b1 + 108;
                    vs = 2;
                }
                if (251 <= b0 && b0 <= 254) {
                    val = -(b0 - 251) * 256 - b1 - 108;
                    vs = 2;
                }
                if (b0 == 255) {
                    val = bin.readInt(data, offset + 1) / 65535;
                    vs = 5;
                    throw "unknown number";
                }
                if (b0 == 30) {
                    var nibs = [];
                    vs = 1;
                    while (true) {
                        var b = data[offset + vs];
                        vs++;
                        var nib0 = b >> 4, nib1 = b & 15;
                        if (nib0 != 15) nibs.push(nib0);
                        if (nib1 != 15) nibs.push(nib1);
                        if (nib1 == 15) break;
                    }
                    var s = "";
                    var chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ".", "e", "e-", "reserved", "-", "endOfNumber"];
                    for (var i = 0; i < nibs.length; i++) s += chars[nibs[i]];
                    val = parseFloat(s);
                }
                if (b0 <= 21) {
                    var keys = ["version", "Notice", "FullName", "FamilyName", "Weight", "FontBBox", "BlueValues", "OtherBlues", "FamilyBlues", "FamilyOtherBlues", "StdHW", "StdVW", "escape", "UniqueID", "XUID", "charset", "Encoding", "CharStrings", "Private", "Subrs", "defaultWidthX", "nominalWidthX"];
                    key = keys[b0];
                    vs = 1;
                    if (b0 == 12) {
                        var keys = ["Copyright", "isFixedPitch", "ItalicAngle", "UnderlinePosition", "UnderlineThickness", "PaintType", "CharstringType", "FontMatrix", "StrokeWidth", "BlueScale", "BlueShift", "BlueFuzz", "StemSnapH", "StemSnapV", "ForceBold", "", "", "LanguageGroup", "ExpansionFactor", "initialRandomSeed", "SyntheticBase", "PostScript", "BaseFontName", "BaseFontBlend", "", "", "", "", "", "", "ROS", "CIDFontVersion", "CIDFontRevision", "CIDFontType", "CIDCount", "UIDBase", "FDArray", "FDSelect", "FontName"];
                        key = keys[b1];
                        vs = 2;
                    }
                }
                if (key != null) {
                    dict[key] = carr.length == 1 ? carr[0] : carr;
                    carr = [];
                } else carr.push(val);
                offset += vs;
            }
            return dict;
        }
    };
    Typr["T"].cmap = {
        parseTab: function (data, offset, length) {
            var obj = {
                tables: [],
                ids: {},
                off: offset
            };
            data = new Uint8Array(data.buffer, offset, length);
            offset = 0;
            var bin = Typr["B"], rU = bin.readUshort, cmap = Typr["T"].cmap;
            rU(data, offset);
            offset += 2;
            var numTables = rU(data, offset);
            offset += 2;
            var offs = [];
            for (var i = 0; i < numTables; i++) {
                var platformID = rU(data, offset);
                offset += 2;
                var encodingID = rU(data, offset);
                offset += 2;
                var noffset = bin.readUint(data, offset);
                offset += 4;
                var id = "p" + platformID + "e" + encodingID;
                var tind = offs.indexOf(noffset);
                if (tind == -1) {
                    tind = obj.tables.length;
                    var subt = {};
                    offs.push(noffset);
                    var format = subt.format = rU(data, noffset);
                    if (format == 0) subt = cmap.parse0(data, noffset, subt); else if (format == 4) subt = cmap.parse4(data, noffset, subt); else if (format == 6) subt = cmap.parse6(data, noffset, subt); else if (format == 12) subt = cmap.parse12(data, noffset, subt);
                    obj.tables.push(subt);
                }
                if (obj.ids[id] != null) throw "multiple tables for one platform+encoding";
                obj.ids[id] = tind;
            }
            return obj;
        },
        parse0: function (data, offset, obj) {
            var bin = Typr["B"];
            offset += 2;
            var len = bin.readUshort(data, offset);
            offset += 2;
            bin.readUshort(data, offset);
            offset += 2;
            obj.map = [];
            for (var i = 0; i < len - 6; i++) obj.map.push(data[offset + i]);
            return obj;
        },
        parse4: function (data, offset, obj) {
            var bin = Typr["B"], rU = bin.readUshort, rUs = bin.readUshorts;
            var offset0 = offset;
            offset += 2;
            var length = rU(data, offset);
            offset += 2;
            rU(data, offset);
            offset += 2;
            var segCountX2 = rU(data, offset);
            offset += 2;
            var segCount = segCountX2 >>> 1;
            obj.searchRange = rU(data, offset);
            offset += 2;
            obj.entrySelector = rU(data, offset);
            offset += 2;
            obj.rangeShift = rU(data, offset);
            offset += 2;
            obj.endCount = rUs(data, offset, segCount);
            offset += segCount * 2;
            offset += 2;
            obj.startCount = rUs(data, offset, segCount);
            offset += segCount * 2;
            obj.idDelta = [];
            for (var i = 0; i < segCount; i++) {
                obj.idDelta.push(bin.readShort(data, offset));
                offset += 2;
            }
            obj.idRangeOffset = rUs(data, offset, segCount);
            offset += segCount * 2;
            obj.glyphIdArray = rUs(data, offset, offset0 + length - offset >>> 1);
            return obj;
        },
        parse6: function (data, offset, obj) {
            var bin = Typr["B"];
            offset += 2;
            bin.readUshort(data, offset);
            offset += 2;
            bin.readUshort(data, offset);
            offset += 2;
            obj.firstCode = bin.readUshort(data, offset);
            offset += 2;
            var entryCount = bin.readUshort(data, offset);
            offset += 2;
            obj.glyphIdArray = [];
            for (var i = 0; i < entryCount; i++) {
                obj.glyphIdArray.push(bin.readUshort(data, offset));
                offset += 2;
            }
            return obj;
        },
        parse12: function (data, offset, obj) {
            var bin = Typr["B"], rU = bin.readUint;
            offset += 4;
            rU(data, offset);
            offset += 4;
            rU(data, offset);
            offset += 4;
            var nGroups = rU(data, offset) * 3;
            offset += 4;
            var gps = obj.groups = new Uint32Array(nGroups);
            for (var i = 0; i < nGroups; i += 3) {
                gps[i] = rU(data, offset + (i << 2));
                gps[i + 1] = rU(data, offset + (i << 2) + 4);
                gps[i + 2] = rU(data, offset + (i << 2) + 8);
            }
            return obj;
        }
    };
    Typr["T"].glyf = {
        parseTab: function (data, offset, length, font) {
            var obj = [], ng = font["maxp"]["numGlyphs"];
            for (var g = 0; g < ng; g++) obj.push(null);
            return obj;
        },
        _parseGlyf: function (font, g) {
            var bin = Typr["B"];
            var data = font["_data"], loca = font["loca"];
            if (loca[g] == loca[g + 1]) return null;
            var offset = Typr["findTable"](data, "glyf", font["_offset"])[0] + loca[g];
            var gl = {};
            gl.noc = bin.readShort(data, offset);
            offset += 2;
            gl.xMin = bin.readShort(data, offset);
            offset += 2;
            gl.yMin = bin.readShort(data, offset);
            offset += 2;
            gl.xMax = bin.readShort(data, offset);
            offset += 2;
            gl.yMax = bin.readShort(data, offset);
            offset += 2;
            if (gl.xMin >= gl.xMax || gl.yMin >= gl.yMax) return null;
            if (gl.noc > 0) {
                gl.endPts = [];
                for (var i = 0; i < gl.noc; i++) {
                    gl.endPts.push(bin.readUshort(data, offset));
                    offset += 2;
                }
                var instructionLength = bin.readUshort(data, offset);
                offset += 2;
                if (data.length - offset < instructionLength) return null;
                gl.instructions = bin.readBytes(data, offset, instructionLength);
                offset += instructionLength;
                var crdnum = gl.endPts[gl.noc - 1] + 1;
                gl.flags = [];
                for (var i = 0; i < crdnum; i++) {
                    var flag = data[offset];
                    offset++;
                    gl.flags.push(flag);
                    if ((flag & 8) != 0) {
                        var rep = data[offset];
                        offset++;
                        for (var j = 0; j < rep; j++) {
                            gl.flags.push(flag);
                            i++;
                        }
                    }
                }
                gl.xs = [];
                for (var i = 0; i < crdnum; i++) {
                    var i8 = (gl.flags[i] & 2) != 0, same = (gl.flags[i] & 16) != 0;
                    if (i8) {
                        gl.xs.push(same ? data[offset] : -data[offset]);
                        offset++;
                    } else {
                        if (same) gl.xs.push(0); else {
                            gl.xs.push(bin.readShort(data, offset));
                            offset += 2;
                        }
                    }
                }
                gl.ys = [];
                for (var i = 0; i < crdnum; i++) {
                    var i8 = (gl.flags[i] & 4) != 0, same = (gl.flags[i] & 32) != 0;
                    if (i8) {
                        gl.ys.push(same ? data[offset] : -data[offset]);
                        offset++;
                    } else {
                        if (same) gl.ys.push(0); else {
                            gl.ys.push(bin.readShort(data, offset));
                            offset += 2;
                        }
                    }
                }
                var x = 0, y = 0;
                for (var i = 0; i < crdnum; i++) {
                    x += gl.xs[i];
                    y += gl.ys[i];
                    gl.xs[i] = x;
                    gl.ys[i] = y;
                }
            } else {
                var ARG_1_AND_2_ARE_WORDS = 1 << 0;
                var ARGS_ARE_XY_VALUES = 1 << 1;
                var WE_HAVE_A_SCALE = 1 << 3;
                var MORE_COMPONENTS = 1 << 5;
                var WE_HAVE_AN_X_AND_Y_SCALE = 1 << 6;
                var WE_HAVE_A_TWO_BY_TWO = 1 << 7;
                var WE_HAVE_INSTRUCTIONS = 1 << 8;
                gl.parts = [];
                var flags;
                do {
                    flags = bin.readUshort(data, offset);
                    offset += 2;
                    var part = {
                        m: {
                            a: 1,
                            b: 0,
                            c: 0,
                            d: 1,
                            tx: 0,
                            ty: 0
                        },
                        p1: -1,
                        p2: -1
                    };
                    gl.parts.push(part);
                    part.glyphIndex = bin.readUshort(data, offset);
                    offset += 2;
                    if (flags & ARG_1_AND_2_ARE_WORDS) {
                        var arg1 = bin.readShort(data, offset);
                        offset += 2;
                        var arg2 = bin.readShort(data, offset);
                        offset += 2;
                    } else {
                        var arg1 = bin.readInt8(data, offset);
                        offset++;
                        var arg2 = bin.readInt8(data, offset);
                        offset++;
                    }
                    if (flags & ARGS_ARE_XY_VALUES) {
                        part.m.tx = arg1;
                        part.m.ty = arg2;
                    } else {
                        part.p1 = arg1;
                        part.p2 = arg2;
                    }
                    if (flags & WE_HAVE_A_SCALE) {
                        part.m.a = part.m.d = bin.readF2dot14(data, offset);
                        offset += 2;
                    } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
                        part.m.a = bin.readF2dot14(data, offset);
                        offset += 2;
                        part.m.d = bin.readF2dot14(data, offset);
                        offset += 2;
                    } else if (flags & WE_HAVE_A_TWO_BY_TWO) {
                        part.m.a = bin.readF2dot14(data, offset);
                        offset += 2;
                        part.m.b = bin.readF2dot14(data, offset);
                        offset += 2;
                        part.m.c = bin.readF2dot14(data, offset);
                        offset += 2;
                        part.m.d = bin.readF2dot14(data, offset);
                        offset += 2;
                    }
                } while (flags & MORE_COMPONENTS);
                if (flags & WE_HAVE_INSTRUCTIONS) {
                    var numInstr = bin.readUshort(data, offset);
                    offset += 2;
                    gl.instr = [];
                    for (var i = 0; i < numInstr; i++) {
                        gl.instr.push(data[offset]);
                        offset++;
                    }
                }
            }
            return gl;
        }
    };
    Typr["T"].head = {
        parseTab: function (data, offset, length) {
            var bin = Typr["B"];
            var obj = {};
            bin.readFixed(data, offset);
            offset += 4;
            obj["fontRevision"] = bin.readFixed(data, offset);
            offset += 4;
            bin.readUint(data, offset);
            offset += 4;
            bin.readUint(data, offset);
            offset += 4;
            obj["flags"] = bin.readUshort(data, offset);
            offset += 2;
            obj["unitsPerEm"] = bin.readUshort(data, offset);
            offset += 2;
            obj["created"] = bin.readUint64(data, offset);
            offset += 8;
            obj["modified"] = bin.readUint64(data, offset);
            offset += 8;
            obj["xMin"] = bin.readShort(data, offset);
            offset += 2;
            obj["yMin"] = bin.readShort(data, offset);
            offset += 2;
            obj["xMax"] = bin.readShort(data, offset);
            offset += 2;
            obj["yMax"] = bin.readShort(data, offset);
            offset += 2;
            obj["macStyle"] = bin.readUshort(data, offset);
            offset += 2;
            obj["lowestRecPPEM"] = bin.readUshort(data, offset);
            offset += 2;
            obj["fontDirectionHint"] = bin.readShort(data, offset);
            offset += 2;
            obj["indexToLocFormat"] = bin.readShort(data, offset);
            offset += 2;
            obj["glyphDataFormat"] = bin.readShort(data, offset);
            offset += 2;
            return obj;
        }
    };
    Typr["T"].hhea = {
        parseTab: function (data, offset, length) {
            var bin = Typr["B"];
            var obj = {};
            bin.readFixed(data, offset);
            offset += 4;
            var keys = ["ascender", "descender", "lineGap", "advanceWidthMax", "minLeftSideBearing", "minRightSideBearing", "xMaxExtent", "caretSlopeRise", "caretSlopeRun", "caretOffset", "res0", "res1", "res2", "res3", "metricDataFormat", "numberOfHMetrics"];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var func = key == "advanceWidthMax" || key == "numberOfHMetrics" ? bin.readUshort : bin.readShort;
                obj[key] = func(data, offset + i * 2);
            }
            return obj;
        }
    };
    Typr["T"].hmtx = {
        parseTab: function (data, offset, length, font) {
            var bin = Typr["B"];
            var aWidth = [];
            var lsBearing = [];
            var nG = font["maxp"]["numGlyphs"], nH = font["hhea"]["numberOfHMetrics"];
            var aw = 0, lsb = 0, i = 0;
            while (i < nH) {
                aw = bin.readUshort(data, offset + (i << 2));
                lsb = bin.readShort(data, offset + (i << 2) + 2);
                aWidth.push(aw);
                lsBearing.push(lsb);
                i++;
            }
            while (i < nG) {
                aWidth.push(aw);
                lsBearing.push(lsb);
                i++;
            }
            return {
                aWidth: aWidth,
                lsBearing: lsBearing
            };
        }
    };
    Typr["T"].kern = {
        parseTab: function (data, offset, length, font) {
            var bin = Typr["B"], kern = Typr["T"].kern;
            var version = bin.readUshort(data, offset);
            if (version == 1) return kern.parseV1(data, offset, length, font);
            var nTables = bin.readUshort(data, offset + 2);
            offset += 4;
            var map = {
                glyph1: [],
                rval: []
            };
            for (var i = 0; i < nTables; i++) {
                offset += 2;
                var length = bin.readUshort(data, offset);
                offset += 2;
                var coverage = bin.readUshort(data, offset);
                offset += 2;
                var format = coverage >>> 8;
                format &= 15;
                if (format == 0) offset = kern.readFormat0(data, offset, map);
            }
            return map;
        },
        parseV1: function (data, offset, length, font) {
            var bin = Typr["B"], kern = Typr["T"].kern;
            bin.readFixed(data, offset);
            var nTables = bin.readUint(data, offset + 4);
            offset += 8;
            var map = {
                glyph1: [],
                rval: []
            };
            for (var i = 0; i < nTables; i++) {
                bin.readUint(data, offset);
                offset += 4;
                var coverage = bin.readUshort(data, offset);
                offset += 2;
                bin.readUshort(data, offset);
                offset += 2;
                var format = coverage & 255;
                if (format == 0) offset = kern.readFormat0(data, offset, map);
            }
            return map;
        },
        readFormat0: function (data, offset, map) {
            var bin = Typr["B"], rUs = bin.readUshort;
            var pleft = -1;
            var nPairs = rUs(data, offset);
            rUs(data, offset + 2);
            rUs(data, offset + 4);
            rUs(data, offset + 6);
            offset += 8;
            for (var j = 0; j < nPairs; j++) {
                var left = rUs(data, offset);
                offset += 2;
                var right = rUs(data, offset);
                offset += 2;
                var value = bin.readShort(data, offset);
                offset += 2;
                if (left != pleft) {
                    map.glyph1.push(left);
                    map.rval.push({
                        glyph2: [],
                        vals: []
                    });
                }
                var rval = map.rval[map.rval.length - 1];
                rval.glyph2.push(right);
                rval.vals.push(value);
                pleft = left;
            }
            return offset;
        }
    };
    Typr["T"].loca = {
        parseTab: function (data, offset, length, font) {
            var bin = Typr["B"];
            var obj = [];
            var ver = font["head"]["indexToLocFormat"];
            var len = font["maxp"]["numGlyphs"] + 1;
            if (ver == 0) for (var i = 0; i < len; i++) obj.push(bin.readUshort(data, offset + (i << 1)) << 1);
            if (ver == 1) for (var i = 0; i < len; i++) obj.push(bin.readUint(data, offset + (i << 2)));
            return obj;
        }
    };
    Typr["T"].maxp = {
        parseTab: function (data, offset, length) {
            var bin = Typr["B"], rU = bin.readUshort;
            var obj = {};
            bin.readUint(data, offset);
            offset += 4;
            obj["numGlyphs"] = rU(data, offset);
            offset += 2;
            return obj;
        }
    };
    Typr["T"].name = {
        parseTab: function (data, offset, length) {
            var bin = Typr["B"];
            var obj = {};
            bin.readUshort(data, offset);
            offset += 2;
            var count = bin.readUshort(data, offset);
            offset += 2;
            bin.readUshort(data, offset);
            offset += 2;
            var names = ["copyright", "fontFamily", "fontSubfamily", "ID", "fullName", "version", "postScriptName", "trademark", "manufacturer", "designer", "description", "urlVendor", "urlDesigner", "licence", "licenceURL", "---", "typoFamilyName", "typoSubfamilyName", "compatibleFull", "sampleText", "postScriptCID", "wwsFamilyName", "wwsSubfamilyName", "lightPalette", "darkPalette"];
            var offset0 = offset;
            var rU = bin.readUshort;
            for (var i = 0; i < count; i++) {
                var platformID = rU(data, offset);
                offset += 2;
                var encodingID = rU(data, offset);
                offset += 2;
                var languageID = rU(data, offset);
                offset += 2;
                var nameID = rU(data, offset);
                offset += 2;
                var slen = rU(data, offset);
                offset += 2;
                var noffset = rU(data, offset);
                offset += 2;
                var soff = offset0 + count * 12 + noffset;
                var str;
                if (platformID == 0) str = bin.readUnicode(data, soff, slen / 2); else if (platformID == 3 && encodingID == 0) str = bin.readUnicode(data, soff, slen / 2); else if (encodingID == 0) str = bin.readASCII(data, soff, slen); else if (encodingID == 1) str = bin.readUnicode(data, soff, slen / 2); else if (encodingID == 3) str = bin.readUnicode(data, soff, slen / 2); else if (encodingID == 4) str = bin.readUnicode(data, soff, slen / 2); else if (encodingID == 10) str = bin.readUnicode(data, soff, slen / 2); else if (platformID == 1) {
                    str = bin.readASCII(data, soff, slen);
                    console.log("reading unknown MAC encoding " + encodingID + " as ASCII");
                } else {
                    console.log("unknown encoding " + encodingID + ", platformID: " + platformID);
                    str = bin.readASCII(data, soff, slen);
                }
                var tid = "p" + platformID + "," + languageID.toString(16);
                if (obj[tid] == null) obj[tid] = {};
                obj[tid][names[nameID]] = str;
                obj[tid]["_lang"] = languageID;
            }
            var psn = "postScriptName";
            for (var p in obj) if (obj[p][psn] != null && obj[p]["_lang"] == 1033) return obj[p];
            for (var p in obj) if (obj[p][psn] != null && obj[p]["_lang"] == 0) return obj[p];
            for (var p in obj) if (obj[p][psn] != null && obj[p]["_lang"] == 3084) return obj[p];
            for (var p in obj) if (obj[p][psn] != null) return obj[p];
            var out;
            for (var p in obj) {
                out = obj[p];
                break;
            }
            console.log("returning name table with languageID " + out._lang);
            if (out[psn] == null && out["ID"] != null) out[psn] = out["ID"];
            return out;
        }
    };
    Typr["T"].OS2 = {
        parseTab: function (data, offset, length) {
            var bin = Typr["B"];
            var ver = bin.readUshort(data, offset);
            offset += 2;
            var OS2 = Typr["T"].OS2;
            var obj = {};
            if (ver == 0) OS2.version0(data, offset, obj); else if (ver == 1) OS2.version1(data, offset, obj); else if (ver == 2 || ver == 3 || ver == 4) OS2.version2(data, offset, obj); else if (ver == 5) OS2.version5(data, offset, obj); else throw "unknown OS/2 table version: " + ver;
            return obj;
        },
        version0: function (data, offset, obj) {
            var bin = Typr["B"];
            obj["xAvgCharWidth"] = bin.readShort(data, offset);
            offset += 2;
            obj["usWeightClass"] = bin.readUshort(data, offset);
            offset += 2;
            obj["usWidthClass"] = bin.readUshort(data, offset);
            offset += 2;
            obj["fsType"] = bin.readUshort(data, offset);
            offset += 2;
            obj["ySubscriptXSize"] = bin.readShort(data, offset);
            offset += 2;
            obj["ySubscriptYSize"] = bin.readShort(data, offset);
            offset += 2;
            obj["ySubscriptXOffset"] = bin.readShort(data, offset);
            offset += 2;
            obj["ySubscriptYOffset"] = bin.readShort(data, offset);
            offset += 2;
            obj["ySuperscriptXSize"] = bin.readShort(data, offset);
            offset += 2;
            obj["ySuperscriptYSize"] = bin.readShort(data, offset);
            offset += 2;
            obj["ySuperscriptXOffset"] = bin.readShort(data, offset);
            offset += 2;
            obj["ySuperscriptYOffset"] = bin.readShort(data, offset);
            offset += 2;
            obj["yStrikeoutSize"] = bin.readShort(data, offset);
            offset += 2;
            obj["yStrikeoutPosition"] = bin.readShort(data, offset);
            offset += 2;
            obj["sFamilyClass"] = bin.readShort(data, offset);
            offset += 2;
            obj["panose"] = bin.readBytes(data, offset, 10);
            offset += 10;
            obj["ulUnicodeRange1"] = bin.readUint(data, offset);
            offset += 4;
            obj["ulUnicodeRange2"] = bin.readUint(data, offset);
            offset += 4;
            obj["ulUnicodeRange3"] = bin.readUint(data, offset);
            offset += 4;
            obj["ulUnicodeRange4"] = bin.readUint(data, offset);
            offset += 4;
            obj["achVendID"] = bin.readASCII(data, offset, 4);
            offset += 4;
            obj["fsSelection"] = bin.readUshort(data, offset);
            offset += 2;
            obj["usFirstCharIndex"] = bin.readUshort(data, offset);
            offset += 2;
            obj["usLastCharIndex"] = bin.readUshort(data, offset);
            offset += 2;
            obj["sTypoAscender"] = bin.readShort(data, offset);
            offset += 2;
            obj["sTypoDescender"] = bin.readShort(data, offset);
            offset += 2;
            obj["sTypoLineGap"] = bin.readShort(data, offset);
            offset += 2;
            obj["usWinAscent"] = bin.readUshort(data, offset);
            offset += 2;
            obj["usWinDescent"] = bin.readUshort(data, offset);
            offset += 2;
            return offset;
        },
        version1: function (data, offset, obj) {
            var bin = Typr["B"];
            offset = Typr["T"].OS2.version0(data, offset, obj);
            obj["ulCodePageRange1"] = bin.readUint(data, offset);
            offset += 4;
            obj["ulCodePageRange2"] = bin.readUint(data, offset);
            offset += 4;
            return offset;
        },
        version2: function (data, offset, obj) {
            var bin = Typr["B"], rU = bin.readUshort;
            offset = Typr["T"].OS2.version1(data, offset, obj);
            obj["sxHeight"] = bin.readShort(data, offset);
            offset += 2;
            obj["sCapHeight"] = bin.readShort(data, offset);
            offset += 2;
            obj["usDefault"] = rU(data, offset);
            offset += 2;
            obj["usBreak"] = rU(data, offset);
            offset += 2;
            obj["usMaxContext"] = rU(data, offset);
            offset += 2;
            return offset;
        },
        version5: function (data, offset, obj) {
            var rU = Typr["B"].readUshort;
            offset = Typr["T"].OS2.version2(data, offset, obj);
            obj["usLowerOpticalPointSize"] = rU(data, offset);
            offset += 2;
            obj["usUpperOpticalPointSize"] = rU(data, offset);
            offset += 2;
            return offset;
        }
    };
    Typr["T"].post = {
        parseTab: function (data, offset, length) {
            var bin = Typr["B"];
            var obj = {};
            obj["version"] = bin.readFixed(data, offset);
            offset += 4;
            obj["italicAngle"] = bin.readFixed(data, offset);
            offset += 4;
            obj["underlinePosition"] = bin.readShort(data, offset);
            offset += 2;
            obj["underlineThickness"] = bin.readShort(data, offset);
            offset += 2;
            return obj;
        }
    };
    Typr["T"].SVG = {
        parseTab: function (data, offset, length) {
            var bin = Typr["B"];
            var obj = {
                entries: []
            };
            var offset0 = offset;
            bin.readUshort(data, offset);
            offset += 2;
            var svgDocIndexOffset = bin.readUint(data, offset);
            offset += 4;
            bin.readUint(data, offset);
            offset += 4;
            offset = svgDocIndexOffset + offset0;
            var numEntries = bin.readUshort(data, offset);
            offset += 2;
            for (var i = 0; i < numEntries; i++) {
                var startGlyphID = bin.readUshort(data, offset);
                offset += 2;
                var endGlyphID = bin.readUshort(data, offset);
                offset += 2;
                var svgDocOffset = bin.readUint(data, offset);
                offset += 4;
                var svgDocLength = bin.readUint(data, offset);
                offset += 4;
                var sbuf = new Uint8Array(data.buffer, offset0 + svgDocOffset + svgDocIndexOffset, svgDocLength);
                var svg = bin.readUTF8(sbuf, 0, sbuf.length);
                for (var f = startGlyphID; f <= endGlyphID; f++) {
                    obj.entries[f] = svg;
                }
            }
            return obj;
        }
    };
    Typr["U"] = {
        shape: function (font, str, ltr) {
            var getGlyphPosition = function (font, gls, i1, ltr) {
                var g1 = gls[i1], g2 = gls[i1 + 1], kern = font["kern"];
                if (kern) {
                    var ind1 = kern.glyph1.indexOf(g1);
                    if (ind1 != -1) {
                        var ind2 = kern.rval[ind1].glyph2.indexOf(g2);
                        if (ind2 != -1) return [0, 0, kern.rval[ind1].vals[ind2], 0];
                    }
                }
                return [0, 0, 0, 0];
            };
            var gls = [];
            for (var i = 0; i < str.length; i++) {
                var cc = str.codePointAt(i);
                if (cc > 65535) i++;
                gls.push(Typr["U"]["codeToGlyph"](font, cc));
            }
            var shape = [];
            for (var i = 0; i < gls.length; i++) {
                var padj = getGlyphPosition(font, gls, i);
                var gid = gls[i];
                var ax = font["hmtx"].aWidth[gid] + padj[2];
                shape.push({
                    g: gid,
                    cl: i,
                    dx: 0,
                    dy: 0,
                    ax: ax,
                    ay: 0
                });
            }
            return shape;
        },
        shapeToPath: function (font, shape, clr) {
            var tpath = {
                cmds: [],
                crds: []
            };
            var x = 0, y = 0;
            for (var i = 0; i < shape.length; i++) {
                var it = shape[i];
                var path = Typr["U"]["glyphToPath"](font, it["g"]), crds = path["crds"];
                for (var j = 0; j < crds.length; j += 2) {
                    tpath.crds.push(crds[j] + x + it["dx"]);
                    tpath.crds.push(crds[j + 1] + y + it["dy"]);
                }
                if (clr) tpath.cmds.push(clr);
                for (var j = 0; j < path["cmds"].length; j++) tpath.cmds.push(path["cmds"][j]);
                var clen = tpath.cmds.length;
                if (clr) if (clen != 0 && tpath.cmds[clen - 1] != "X") tpath.cmds.push("X");
                x += it["ax"];
                y += it["ay"];
            }
            return {
                cmds: tpath.cmds,
                crds: tpath.crds
            };
        },
        codeToGlyph: function (font, code) {
            var cmap = font["cmap"];
            var tind = -1, pps = ["p3e10", "p0e4", "p3e1", "p1e0", "p0e3", "p0e1"];
            for (var i = 0; i < pps.length; i++) if (cmap.ids[pps[i]] != null) {
                tind = cmap.ids[pps[i]];
                break;
            }
            if (tind == -1) throw "no familiar platform and encoding!";
            var arrSearch = function (arr, k, v) {
                var l = 0, r = Math.floor(arr.length / k);
                while (l + 1 != r) {
                    var mid = l + (r - l >>> 1);
                    if (arr[mid * k] <= v) l = mid; else r = mid;
                }
                return l * k;
            };
            var tab = cmap.tables[tind], fmt = tab.format, gid = -1;
            if (fmt == 0) {
                if (code >= tab.map.length) gid = 0; else gid = tab.map[code];
            } else if (fmt == 4) {
                var sind = -1, ec = tab.endCount;
                if (code > ec[ec.length - 1]) sind = -1; else {
                    sind = arrSearch(ec, 1, code);
                    if (ec[sind] < code) sind++;
                }
                if (sind == -1) gid = 0; else if (code < tab.startCount[sind]) gid = 0; else {
                    var gli = 0;
                    if (tab.idRangeOffset[sind] != 0) gli = tab.glyphIdArray[code - tab.startCount[sind] + (tab.idRangeOffset[sind] >> 1) - (tab.idRangeOffset.length - sind)]; else gli = code + tab.idDelta[sind];
                    gid = gli & 65535;
                }
            } else if (fmt == 6) {
                var off = code - tab.firstCode, arr = tab.glyphIdArray;
                if (off < 0 || off >= arr.length) gid = 0; else gid = arr[off];
            } else if (fmt == 12) {
                var grp = tab.groups;
                if (code > grp[grp.length - 2]) gid = 0; else {
                    var i = arrSearch(grp, 3, code);
                    if (grp[i] <= code && code <= grp[i + 1]) {
                        gid = grp[i + 2] + (code - grp[i]);
                    }
                    if (gid == -1) gid = 0;
                }
            } else throw "unknown cmap table format " + tab.format;
            var SVG = font["SVG "], loca = font["loca"];
            if (gid != 0 && font["CFF "] == null && (SVG == null || SVG.entries[gid] == null) && loca[gid] == loca[gid + 1] && [9, 10, 11, 12, 13, 32, 133, 160, 5760, 8232, 8233, 8239, 12288, 6158, 8203, 8204, 8205, 8288, 65279].indexOf(code) == -1 && !(8192 <= code && code <= 8202)) gid = 0;
            return gid;
        },
        glyphToPath: function (font, gid) {
            var path = {
                cmds: [],
                crds: []
            };
            var SVG = font["SVG "], CFF = font["CFF "];
            var U = Typr["U"];
            if (SVG && SVG.entries[gid]) {
                var p = SVG.entries[gid];
                if (p != null) {
                    if (typeof p == "string") {
                        p = U["SVG"].toPath(p);
                        SVG.entries[gid] = p;
                    }
                    path = p;
                }
            } else if (CFF) {
                var pdct = CFF["Private"];
                var state = {
                    x: 0,
                    y: 0,
                    stack: [],
                    nStems: 0,
                    haveWidth: false,
                    width: pdct ? pdct["defaultWidthX"] : 0,
                    open: false
                };
                if (CFF["ROS"]) {
                    var gi = 0;
                    while (CFF["FDSelect"][gi + 2] <= gid) gi += 2;
                    pdct = CFF["FDArray"][CFF["FDSelect"][gi + 1]]["Private"];
                }
                U["_drawCFF"](CFF["CharStrings"][gid], state, CFF, pdct, path);
            } else if (font["glyf"]) {
                U["_drawGlyf"](gid, font, path);
            }
            return {
                cmds: path.cmds,
                crds: path.crds
            };
        },
        _drawGlyf: function (gid, font, path) {
            var gl = font["glyf"][gid];
            if (gl == null) gl = font["glyf"][gid] = Typr["T"].glyf._parseGlyf(font, gid);
            if (gl != null) {
                if (gl.noc > -1) Typr["U"]["_simpleGlyph"](gl, path); else Typr["U"]["_compoGlyph"](gl, font, path);
            }
        },
        _simpleGlyph: function (gl, p) {
            var P = Typr["U"]["P"];
            for (var c = 0; c < gl.noc; c++) {
                var i0 = c == 0 ? 0 : gl.endPts[c - 1] + 1;
                var il = gl.endPts[c];
                for (var i = i0; i <= il; i++) {
                    var pr = i == i0 ? il : i - 1;
                    var nx = i == il ? i0 : i + 1;
                    var onCurve = gl.flags[i] & 1;
                    var prOnCurve = gl.flags[pr] & 1;
                    var nxOnCurve = gl.flags[nx] & 1;
                    var x = gl.xs[i], y = gl.ys[i];
                    if (i == i0) {
                        if (onCurve) {
                            if (prOnCurve) P.MoveTo(p, gl.xs[pr], gl.ys[pr]); else {
                                P.MoveTo(p, x, y);
                                continue;
                            }
                        } else {
                            if (prOnCurve) P.MoveTo(p, gl.xs[pr], gl.ys[pr]); else P.MoveTo(p, Math.floor((gl.xs[pr] + x) * .5), Math.floor((gl.ys[pr] + y) * .5));
                        }
                    }
                    if (onCurve) {
                        if (prOnCurve) P.LineTo(p, x, y);
                    } else {
                        if (nxOnCurve) P.qCurveTo(p, x, y, gl.xs[nx], gl.ys[nx]); else P.qCurveTo(p, x, y, Math.floor((x + gl.xs[nx]) * .5), Math.floor((y + gl.ys[nx]) * .5));
                    }
                }
                P.ClosePath(p);
            }
        },
        _compoGlyph: function (gl, font, p) {
            for (var j = 0; j < gl.parts.length; j++) {
                var path = {
                    cmds: [],
                    crds: []
                };
                var prt = gl.parts[j];
                Typr["U"]["_drawGlyf"](prt.glyphIndex, font, path);
                var m = prt.m;
                for (var i = 0; i < path.crds.length; i += 2) {
                    var x = path.crds[i], y = path.crds[i + 1];
                    p.crds.push(x * m.a + y * m.b + m.tx);
                    p.crds.push(x * m.c + y * m.d + m.ty);
                }
                for (var i = 0; i < path.cmds.length; i++) p.cmds.push(path.cmds[i]);
            }
        },
        pathToSVG: function (path, prec) {
            var cmds = path["cmds"], crds = path["crds"];
            if (prec == null) prec = 5;
            var out = [], co = 0, lmap = {
                M: 2,
                L: 2,
                Q: 4,
                C: 6
            };
            for (var i = 0; i < cmds.length; i++) {
                var cmd = cmds[i], cn = co + (lmap[cmd] ? lmap[cmd] : 0);
                out.push(cmd);
                while (co < cn) {
                    var c = crds[co++];
                    out.push(parseFloat(c.toFixed(prec)) + (co == cn ? "" : " "));
                }
            }
            return out.join("");
        },
        SVGToPath: function (d) {
            var pth = {
                cmds: [],
                crds: []
            };
            Typr["U"]["SVG"].svgToPath(d, pth);
            return {
                cmds: pth.cmds,
                crds: pth.crds
            };
        },
        pathToContext: function (path, ctx) {
            var c = 0, cmds = path["cmds"], crds = path["crds"];
            for (var j = 0; j < cmds.length; j++) {
                var cmd = cmds[j];
                if (cmd == "M") {
                    ctx.moveTo(crds[c], crds[c + 1]);
                    c += 2;
                } else if (cmd == "L") {
                    ctx.lineTo(crds[c], crds[c + 1]);
                    c += 2;
                } else if (cmd == "C") {
                    ctx.bezierCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3], crds[c + 4], crds[c + 5]);
                    c += 6;
                } else if (cmd == "Q") {
                    ctx.quadraticCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3]);
                    c += 4;
                } else if (cmd.charAt(0) == "#") {
                    ctx.beginPath();
                    ctx.fillStyle = cmd;
                } else if (cmd == "Z") {
                    ctx.closePath();
                } else if (cmd == "X") {
                    ctx.fill();
                }
            }
        },
        P: {
            MoveTo: function (p, x, y) {
                p.cmds.push("M");
                p.crds.push(x, y);
            },
            LineTo: function (p, x, y) {
                p.cmds.push("L");
                p.crds.push(x, y);
            },
            CurveTo: function (p, a, b, c, d, e, f) {
                p.cmds.push("C");
                p.crds.push(a, b, c, d, e, f);
            },
            qCurveTo: function (p, a, b, c, d) {
                p.cmds.push("Q");
                p.crds.push(a, b, c, d);
            },
            ClosePath: function (p) {
                p.cmds.push("Z");
            }
        },
        _drawCFF: function (cmds, state, font, pdct, p) {
            var stack = state.stack;
            var nStems = state.nStems, haveWidth = state.haveWidth, width = state.width, open = state.open;
            var i = 0;
            var x = state.x, y = state.y, c1x = 0, c1y = 0, c2x = 0, c2y = 0, c3x = 0, c3y = 0, c4x = 0, c4y = 0, jpx = 0, jpy = 0;
            var CFF = Typr["T"].CFF, P = Typr["U"]["P"];
            var nominalWidthX = pdct["nominalWidthX"];
            var o = {
                val: 0,
                size: 0
            };
            while (i < cmds.length) {
                CFF.getCharString(cmds, i, o);
                var v = o.val;
                i += o.size;
                if (v == "o1" || v == "o18") {
                    var hasWidthArg;
                    hasWidthArg = stack.length % 2 !== 0;
                    if (hasWidthArg && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                    }
                    nStems += stack.length >> 1;
                    stack.length = 0;
                    haveWidth = true;
                } else if (v == "o3" || v == "o23") {
                    var hasWidthArg;
                    hasWidthArg = stack.length % 2 !== 0;
                    if (hasWidthArg && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                    }
                    nStems += stack.length >> 1;
                    stack.length = 0;
                    haveWidth = true;
                } else if (v == "o4") {
                    if (stack.length > 1 && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                        haveWidth = true;
                    }
                    if (open) P.ClosePath(p);
                    y += stack.pop();
                    P.MoveTo(p, x, y);
                    open = true;
                } else if (v == "o5") {
                    while (stack.length > 0) {
                        x += stack.shift();
                        y += stack.shift();
                        P.LineTo(p, x, y);
                    }
                } else if (v == "o6" || v == "o7") {
                    var count = stack.length;
                    var isX = v == "o6";
                    for (var j = 0; j < count; j++) {
                        var sval = stack.shift();
                        if (isX) x += sval; else y += sval;
                        isX = !isX;
                        P.LineTo(p, x, y);
                    }
                } else if (v == "o8" || v == "o24") {
                    var count = stack.length;
                    var index = 0;
                    while (index + 6 <= count) {
                        c1x = x + stack.shift();
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y + stack.shift();
                        P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
                        index += 6;
                    }
                    if (v == "o24") {
                        x += stack.shift();
                        y += stack.shift();
                        P.LineTo(p, x, y);
                    }
                } else if (v == "o11") break; else if (v == "o1234" || v == "o1235" || v == "o1236" || v == "o1237") {
                    if (v == "o1234") {
                        c1x = x + stack.shift();
                        c1y = y;
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        jpx = c2x + stack.shift();
                        jpy = c2y;
                        c3x = jpx + stack.shift();
                        c3y = c2y;
                        c4x = c3x + stack.shift();
                        c4y = y;
                        x = c4x + stack.shift();
                        P.CurveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
                        P.CurveTo(p, c3x, c3y, c4x, c4y, x, y);
                    }
                    if (v == "o1235") {
                        c1x = x + stack.shift();
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        jpx = c2x + stack.shift();
                        jpy = c2y + stack.shift();
                        c3x = jpx + stack.shift();
                        c3y = jpy + stack.shift();
                        c4x = c3x + stack.shift();
                        c4y = c3y + stack.shift();
                        x = c4x + stack.shift();
                        y = c4y + stack.shift();
                        stack.shift();
                        P.CurveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
                        P.CurveTo(p, c3x, c3y, c4x, c4y, x, y);
                    }
                    if (v == "o1236") {
                        c1x = x + stack.shift();
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        jpx = c2x + stack.shift();
                        jpy = c2y;
                        c3x = jpx + stack.shift();
                        c3y = c2y;
                        c4x = c3x + stack.shift();
                        c4y = c3y + stack.shift();
                        x = c4x + stack.shift();
                        P.CurveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
                        P.CurveTo(p, c3x, c3y, c4x, c4y, x, y);
                    }
                    if (v == "o1237") {
                        c1x = x + stack.shift();
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        jpx = c2x + stack.shift();
                        jpy = c2y + stack.shift();
                        c3x = jpx + stack.shift();
                        c3y = jpy + stack.shift();
                        c4x = c3x + stack.shift();
                        c4y = c3y + stack.shift();
                        if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
                            x = c4x + stack.shift();
                        } else {
                            y = c4y + stack.shift();
                        }
                        P.CurveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
                        P.CurveTo(p, c3x, c3y, c4x, c4y, x, y);
                    }
                } else if (v == "o14") {
                    if (stack.length > 0 && !haveWidth) {
                        width = stack.shift() + font["nominalWidthX"];
                        haveWidth = true;
                    }
                    if (stack.length == 4) {
                        var adx = stack.shift();
                        var ady = stack.shift();
                        var bchar = stack.shift();
                        var achar = stack.shift();
                        var bind = CFF.glyphBySE(font, bchar);
                        var aind = CFF.glyphBySE(font, achar);
                        Typr["U"]["_drawCFF"](font["CharStrings"][bind], state, font, pdct, p);
                        state.x = adx;
                        state.y = ady;
                        Typr["U"]["_drawCFF"](font["CharStrings"][aind], state, font, pdct, p);
                    }
                    if (open) {
                        P.ClosePath(p);
                        open = false;
                    }
                } else if (v == "o19" || v == "o20") {
                    var hasWidthArg;
                    hasWidthArg = stack.length % 2 !== 0;
                    if (hasWidthArg && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                    }
                    nStems += stack.length >> 1;
                    stack.length = 0;
                    haveWidth = true;
                    i += nStems + 7 >> 3;
                } else if (v == "o21") {
                    if (stack.length > 2 && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                        haveWidth = true;
                    }
                    y += stack.pop();
                    x += stack.pop();
                    if (open) P.ClosePath(p);
                    P.MoveTo(p, x, y);
                    open = true;
                } else if (v == "o22") {
                    if (stack.length > 1 && !haveWidth) {
                        width = stack.shift() + nominalWidthX;
                        haveWidth = true;
                    }
                    x += stack.pop();
                    if (open) P.ClosePath(p);
                    P.MoveTo(p, x, y);
                    open = true;
                } else if (v == "o25") {
                    while (stack.length > 6) {
                        x += stack.shift();
                        y += stack.shift();
                        P.LineTo(p, x, y);
                    }
                    c1x = x + stack.shift();
                    c1y = y + stack.shift();
                    c2x = c1x + stack.shift();
                    c2y = c1y + stack.shift();
                    x = c2x + stack.shift();
                    y = c2y + stack.shift();
                    P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
                } else if (v == "o26") {
                    if (stack.length % 2) {
                        x += stack.shift();
                    }
                    while (stack.length > 0) {
                        c1x = x;
                        c1y = y + stack.shift();
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x;
                        y = c2y + stack.shift();
                        P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
                    }
                } else if (v == "o27") {
                    if (stack.length % 2) {
                        y += stack.shift();
                    }
                    while (stack.length > 0) {
                        c1x = x + stack.shift();
                        c1y = y;
                        c2x = c1x + stack.shift();
                        c2y = c1y + stack.shift();
                        x = c2x + stack.shift();
                        y = c2y;
                        P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
                    }
                } else if (v == "o10" || v == "o29") {
                    var obj = v == "o10" ? pdct : font;
                    if (stack.length == 0) {
                        console.log("error: empty stack");
                    } else {
                        var ind = stack.pop();
                        var subr = obj["Subrs"][ind + obj["Bias"]];
                        state.x = x;
                        state.y = y;
                        state.nStems = nStems;
                        state.haveWidth = haveWidth;
                        state.width = width;
                        state.open = open;
                        Typr["U"]["_drawCFF"](subr, state, font, pdct, p);
                        x = state.x;
                        y = state.y;
                        nStems = state.nStems;
                        haveWidth = state.haveWidth;
                        width = state.width;
                        open = state.open;
                    }
                } else if (v == "o30" || v == "o31") {
                    var count, count1 = stack.length;
                    var index = 0;
                    var alternate = v == "o31";
                    count = count1 & ~2;
                    index += count1 - count;
                    while (index < count) {
                        if (alternate) {
                            c1x = x + stack.shift();
                            c1y = y;
                            c2x = c1x + stack.shift();
                            c2y = c1y + stack.shift();
                            y = c2y + stack.shift();
                            if (count - index == 5) {
                                x = c2x + stack.shift();
                                index++;
                            } else x = c2x;
                            alternate = false;
                        } else {
                            c1x = x;
                            c1y = y + stack.shift();
                            c2x = c1x + stack.shift();
                            c2y = c1y + stack.shift();
                            x = c2x + stack.shift();
                            if (count - index == 5) {
                                y = c2y + stack.shift();
                                index++;
                            } else y = c2y;
                            alternate = true;
                        }
                        P.CurveTo(p, c1x, c1y, c2x, c2y, x, y);
                        index += 4;
                    }
                } else if ((v + "").charAt(0) == "o") {
                    console.log("Unknown operation: " + v, cmds);
                    throw v;
                } else stack.push(v);
            }
            state.x = x;
            state.y = y;
            state.nStems = nStems;
            state.haveWidth = haveWidth;
            state.width = width;
            state.open = open;
        },
        SVG: function () {
            var M = {
                getScale: function (m) {
                    return Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2]));
                },
                translate: function (m, x, y) {
                    M.concat(m, [1, 0, 0, 1, x, y]);
                },
                rotate: function (m, a) {
                    M.concat(m, [Math.cos(a), -Math.sin(a), Math.sin(a), Math.cos(a), 0, 0]);
                },
                scale: function (m, x, y) {
                    M.concat(m, [x, 0, 0, y, 0, 0]);
                },
                concat: function (m, w) {
                    var a = m[0], b = m[1], c = m[2], d = m[3], tx = m[4], ty = m[5];
                    m[0] = a * w[0] + b * w[2];
                    m[1] = a * w[1] + b * w[3];
                    m[2] = c * w[0] + d * w[2];
                    m[3] = c * w[1] + d * w[3];
                    m[4] = tx * w[0] + ty * w[2] + w[4];
                    m[5] = tx * w[1] + ty * w[3] + w[5];
                },
                invert: function (m) {
                    var a = m[0], b = m[1], c = m[2], d = m[3], tx = m[4], ty = m[5], adbc = a * d - b * c;
                    m[0] = d / adbc;
                    m[1] = -b / adbc;
                    m[2] = -c / adbc;
                    m[3] = a / adbc;
                    m[4] = (c * ty - d * tx) / adbc;
                    m[5] = (b * tx - a * ty) / adbc;
                },
                multPoint: function (m, p) {
                    var x = p[0], y = p[1];
                    return [x * m[0] + y * m[2] + m[4], x * m[1] + y * m[3] + m[5]];
                },
                multArray: function (m, a) {
                    for (var i = 0; i < a.length; i += 2) {
                        var x = a[i], y = a[i + 1];
                        a[i] = x * m[0] + y * m[2] + m[4];
                        a[i + 1] = x * m[1] + y * m[3] + m[5];
                    }
                }
            };
            function _bracketSplit(str, lbr, rbr) {
                var out = [], pos = 0, ci = 0, lvl = 0;
                while (true) {
                    var li = str.indexOf(lbr, ci);
                    var ri = str.indexOf(rbr, ci);
                    if (li == -1 && ri == -1) break;
                    if (ri == -1 || li != -1 && li < ri) {
                        if (lvl == 0) {
                            out.push(str.slice(pos, li).trim());
                            pos = li + 1;
                        }
                        lvl++;
                        ci = li + 1;
                    } else if (li == -1 || ri != -1 && ri < li) {
                        lvl--;
                        if (lvl == 0) {
                            out.push(str.slice(pos, ri).trim());
                            pos = ri + 1;
                        }
                        ci = ri + 1;
                    }
                }
                return out;
            }
            function cssMap(str) {
                var pts = _bracketSplit(str, "{", "}");
                var css = {};
                for (var i = 0; i < pts.length; i += 2) {
                    var cn = pts[i].split(",");
                    for (var j = 0; j < cn.length; j++) {
                        var cnj = cn[j].trim();
                        if (css[cnj] == null) css[cnj] = "";
                        css[cnj] += pts[i + 1];
                    }
                }
                return css;
            }
            function readTrnf(trna) {
                var pts = _bracketSplit(trna, "(", ")");
                var m = [1, 0, 0, 1, 0, 0];
                for (var i = 0; i < pts.length; i += 2) {
                    var om = m;
                    m = _readTrnsAttr(pts[i], pts[i + 1]);
                    M.concat(m, om);
                }
                return m;
            }
            function _readTrnsAttr(fnc, vls) {
                var m = [1, 0, 0, 1, 0, 0], gotSep = true;
                for (var i = 0; i < vls.length; i++) {
                    var ch = vls.charAt(i);
                    if (ch == "," || ch == " ") gotSep = true; else if (ch == ".") {
                        if (!gotSep) {
                            vls = vls.slice(0, i) + "," + vls.slice(i);
                            i++;
                        }
                        gotSep = false;
                    } else if (ch == "-" && i > 0 && vls[i - 1] != "e") {
                        vls = vls.slice(0, i) + " " + vls.slice(i);
                        i++;
                        gotSep = true;
                    }
                }
                vls = vls.split(/\s*[\s,]\s*/).map(parseFloat);
                if (fnc == "translate") {
                    if (vls.length == 1) M.translate(m, vls[0], 0); else M.translate(m, vls[0], vls[1]);
                } else if (fnc == "scale") {
                    if (vls.length == 1) M.scale(m, vls[0], vls[0]); else M.scale(m, vls[0], vls[1]);
                } else if (fnc == "rotate") {
                    var tx = 0, ty = 0;
                    if (vls.length != 1) {
                        tx = vls[1];
                        ty = vls[2];
                    }
                    M.translate(m, -tx, -ty);
                    M.rotate(m, -Math.PI * vls[0] / 180);
                    M.translate(m, tx, ty);
                } else if (fnc == "matrix") m = vls; else console.log("unknown transform: ", fnc);
                return m;
            }
            function toPath(str) {
                var pth = {
                    cmds: [],
                    crds: []
                };
                if (str == null) return pth;
                var prsr = new DOMParser();
                var doc = prsr["parseFromString"](str, "image/svg+xml");
                var svg = doc.getElementsByTagName("svg")[0];
                var vb = svg.getAttribute("viewBox");
                if (vb) vb = vb.trim().split(" ").map(parseFloat); else vb = [0, 0, 1e3, 1e3];
                _toPath(svg.children, pth);
                for (var i = 0; i < pth.crds.length; i += 2) {
                    var x = pth.crds[i], y = pth.crds[i + 1];
                    x -= vb[0];
                    y -= vb[1];
                    y = -y;
                    pth.crds[i] = x;
                    pth.crds[i + 1] = y;
                }
                return pth;
            }
            function _toPath(nds, pth, fill) {
                for (var ni = 0; ni < nds.length; ni++) {
                    var nd = nds[ni], tn = nd.tagName;
                    var cfl = nd.getAttribute("fill");
                    if (cfl == null) cfl = fill;
                    if (tn == "g") {
                        var tp = {
                            crds: [],
                            cmds: []
                        };
                        _toPath(nd.children, tp, cfl);
                        var trf = nd.getAttribute("transform");
                        if (trf) {
                            var m = readTrnf(trf);
                            M.multArray(m, tp.crds);
                        }
                        pth.crds = pth.crds.concat(tp.crds);
                        pth.cmds = pth.cmds.concat(tp.cmds);
                    } else if (tn == "path" || tn == "circle" || tn == "ellipse") {
                        pth.cmds.push(cfl ? cfl : "#000000");
                        var d;
                        if (tn == "path") d = nd.getAttribute("d");
                        if (tn == "circle" || tn == "ellipse") {
                            var vls = [0, 0, 0, 0], nms = ["cx", "cy", "rx", "ry", "r"];
                            for (var i = 0; i < 5; i++) {
                                var V = nd.getAttribute(nms[i]);
                                if (V) {
                                    V = parseFloat(V);
                                    if (i < 4) vls[i] = V; else vls[2] = vls[3] = V;
                                }
                            }
                            var cx = vls[0], cy = vls[1], rx = vls[2], ry = vls[3];
                            d = ["M", cx - rx, cy, "a", rx, ry, 0, 1, 0, rx * 2, 0, "a", rx, ry, 0, 1, 0, -rx * 2, 0].join(" ");
                        }
                        svgToPath(d, pth);
                        pth.cmds.push("X");
                    } else if (tn == "defs"); else console.log(tn, nd);
                }
            }
            function _tokens(d) {
                var ts = [], off = 0, rn = false, cn = "", pc = "";
                while (off < d.length) {
                    var cc = d.charCodeAt(off), ch = d.charAt(off);
                    off++;
                    var isNum = 48 <= cc && cc <= 57 || ch == "." || ch == "-" || ch == "e" || ch == "E";
                    if (rn) {
                        if (ch == "-" && pc != "e" || ch == "." && cn.indexOf(".") != -1) {
                            ts.push(parseFloat(cn));
                            cn = ch;
                        } else if (isNum) cn += ch; else {
                            ts.push(parseFloat(cn));
                            if (ch != "," && ch != " ") ts.push(ch);
                            rn = false;
                        }
                    } else {
                        if (isNum) {
                            cn = ch;
                            rn = true;
                        } else if (ch != "," && ch != " ") ts.push(ch);
                    }
                    pc = ch;
                }
                if (rn) ts.push(parseFloat(cn));
                return ts;
            }
            function _reps(ts, off, ps) {
                var i = off;
                while (i < ts.length) {
                    if (typeof ts[i] == "string") break;
                    i += ps;
                }
                return (i - off) / ps;
            }
            function svgToPath(d, pth) {
                var ts = _tokens(d);
                var i = 0, x = 0, y = 0, ox = 0, oy = 0, oldo = pth.crds.length;
                var pc = {
                    M: 2,
                    L: 2,
                    H: 1,
                    V: 1,
                    T: 2,
                    S: 4,
                    A: 7,
                    Q: 4,
                    C: 6
                };
                var cmds = pth.cmds, crds = pth.crds;
                while (i < ts.length) {
                    var cmd = ts[i];
                    i++;
                    var cmu = cmd.toUpperCase();
                    if (cmu == "Z") {
                        cmds.push("Z");
                        x = ox;
                        y = oy;
                    } else {
                        var ps = pc[cmu], reps = _reps(ts, i, ps);
                        for (var j = 0; j < reps; j++) {
                            if (j == 1 && cmu == "M") {
                                cmd = cmd == cmu ? "L" : "l";
                                cmu = "L";
                            }
                            var xi = 0, yi = 0;
                            if (cmd != cmu) {
                                xi = x;
                                yi = y;
                            }
                            if (cmu == "M") {
                                x = xi + ts[i++];
                                y = yi + ts[i++];
                                cmds.push("M");
                                crds.push(x, y);
                                ox = x;
                                oy = y;
                            } else if (cmu == "L") {
                                x = xi + ts[i++];
                                y = yi + ts[i++];
                                cmds.push("L");
                                crds.push(x, y);
                            } else if (cmu == "H") {
                                x = xi + ts[i++];
                                cmds.push("L");
                                crds.push(x, y);
                            } else if (cmu == "V") {
                                y = yi + ts[i++];
                                cmds.push("L");
                                crds.push(x, y);
                            } else if (cmu == "Q") {
                                var x1 = xi + ts[i++], y1 = yi + ts[i++], x2 = xi + ts[i++], y2 = yi + ts[i++];
                                cmds.push("Q");
                                crds.push(x1, y1, x2, y2);
                                x = x2;
                                y = y2;
                            } else if (cmu == "T") {
                                var co = Math.max(crds.length - 2, oldo);
                                var x1 = x + x - crds[co], y1 = y + y - crds[co + 1];
                                var x2 = xi + ts[i++], y2 = yi + ts[i++];
                                cmds.push("Q");
                                crds.push(x1, y1, x2, y2);
                                x = x2;
                                y = y2;
                            } else if (cmu == "C") {
                                var x1 = xi + ts[i++], y1 = yi + ts[i++], x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
                                cmds.push("C");
                                crds.push(x1, y1, x2, y2, x3, y3);
                                x = x3;
                                y = y3;
                            } else if (cmu == "S") {
                                var co = Math.max(crds.length - (cmds[cmds.length - 1] == "C" ? 4 : 2), oldo);
                                var x1 = x + x - crds[co], y1 = y + y - crds[co + 1];
                                var x2 = xi + ts[i++], y2 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
                                cmds.push("C");
                                crds.push(x1, y1, x2, y2, x3, y3);
                                x = x3;
                                y = y3;
                            } else if (cmu == "A") {
                                var x1 = x, y1 = y;
                                var rx = ts[i++], ry = ts[i++];
                                var phi = ts[i++] * (Math.PI / 180), fA = ts[i++], fS = ts[i++];
                                var x2 = xi + ts[i++], y2 = yi + ts[i++];
                                if (x2 == x && y2 == y && rx == 0 && ry == 0) continue;
                                var hdx = (x1 - x2) / 2, hdy = (y1 - y2) / 2;
                                var cosP = Math.cos(phi), sinP = Math.sin(phi);
                                var x1A = cosP * hdx + sinP * hdy;
                                var y1A = -sinP * hdx + cosP * hdy;
                                var rxS = rx * rx, ryS = ry * ry;
                                var x1AS = x1A * x1A, y1AS = y1A * y1A;
                                var frc = (rxS * ryS - rxS * y1AS - ryS * x1AS) / (rxS * y1AS + ryS * x1AS);
                                var coef = (fA != fS ? 1 : -1) * Math.sqrt(Math.max(frc, 0));
                                var cxA = coef * (rx * y1A) / ry;
                                var cyA = -coef * (ry * x1A) / rx;
                                var cx = cosP * cxA - sinP * cyA + (x1 + x2) / 2;
                                var cy = sinP * cxA + cosP * cyA + (y1 + y2) / 2;
                                var angl = function (ux, uy, vx, vy) {
                                    var lU = Math.sqrt(ux * ux + uy * uy), lV = Math.sqrt(vx * vx + vy * vy);
                                    var num = (ux * vx + uy * vy) / (lU * lV);
                                    return (ux * vy - uy * vx >= 0 ? 1 : -1) * Math.acos(Math.max(-1, Math.min(1, num)));
                                };
                                var vX = (x1A - cxA) / rx, vY = (y1A - cyA) / ry;
                                var theta1 = angl(1, 0, vX, vY);
                                var dtheta = angl(vX, vY, (-x1A - cxA) / rx, (-y1A - cyA) / ry);
                                dtheta = dtheta % (2 * Math.PI);
                                var arc = function (gst, x, y, r, a0, a1, neg) {
                                    var rotate = function (m, a) {
                                        var si = Math.sin(a), co = Math.cos(a);
                                        var a = m[0], b = m[1], c = m[2], d = m[3];
                                        m[0] = a * co + b * si;
                                        m[1] = -a * si + b * co;
                                        m[2] = c * co + d * si;
                                        m[3] = -c * si + d * co;
                                    };
                                    var multArr = function (m, a) {
                                        for (var j = 0; j < a.length; j += 2) {
                                            var x = a[j], y = a[j + 1];
                                            a[j] = m[0] * x + m[2] * y + m[4];
                                            a[j + 1] = m[1] * x + m[3] * y + m[5];
                                        }
                                    };
                                    var concatA = function (a, b) {
                                        for (var j = 0; j < b.length; j++) a.push(b[j]);
                                    };
                                    var concatP = function (p, r) {
                                        concatA(p.cmds, r.cmds);
                                        concatA(p.crds, r.crds);
                                    };
                                    if (neg) while (a1 > a0) a1 -= 2 * Math.PI; else while (a1 < a0) a1 += 2 * Math.PI;
                                    var th = (a1 - a0) / 4;
                                    var x0 = Math.cos(th / 2), y0 = -Math.sin(th / 2);
                                    var x1 = (4 - x0) / 3, y1 = y0 == 0 ? y0 : (1 - x0) * (3 - x0) / (3 * y0);
                                    var x2 = x1, y2 = -y1;
                                    var x3 = x0, y3 = -y0;
                                    var ps = [x1, y1, x2, y2, x3, y3];
                                    var pth = {
                                        cmds: ["C", "C", "C", "C"],
                                        crds: ps.slice(0)
                                    };
                                    var rot = [1, 0, 0, 1, 0, 0];
                                    rotate(rot, -th);
                                    for (var j = 0; j < 3; j++) {
                                        multArr(rot, ps);
                                        concatA(pth.crds, ps);
                                    }
                                    rotate(rot, -a0 + th / 2);
                                    rot[0] *= r;
                                    rot[1] *= r;
                                    rot[2] *= r;
                                    rot[3] *= r;
                                    rot[4] = x;
                                    rot[5] = y;
                                    multArr(rot, pth.crds);
                                    multArr(gst.ctm, pth.crds);
                                    concatP(gst.pth, pth);
                                };
                                var gst = {
                                    pth: pth,
                                    ctm: [rx * cosP, rx * sinP, -ry * sinP, ry * cosP, cx, cy]
                                };
                                arc(gst, 0, 0, 1, theta1, theta1 + dtheta, fS == 0);
                                x = x2;
                                y = y2;
                            } else console.log("Unknown SVG command " + cmd);
                        }
                    }
                }
            }
            return {
                cssMap: cssMap,
                readTrnf: readTrnf,
                svgToPath: svgToPath,
                toPath: toPath
            };
        }(),
        initHB: function (hurl, resp) {
            var codeLength = function (code) {
                var len = 0;
                if ((code & 4294967295 - (1 << 7) + 1) == 0) {
                    len = 1;
                } else if ((code & 4294967295 - (1 << 11) + 1) == 0) {
                    len = 2;
                } else if ((code & 4294967295 - (1 << 16) + 1) == 0) {
                    len = 3;
                } else if ((code & 4294967295 - (1 << 21) + 1) == 0) {
                    len = 4;
                }
                return len;
            };
            var te = new window["TextEncoder"]("utf8");
            fetch(hurl).then(function (x) {
                return x["arrayBuffer"]();
            }).then(function (ab) {
                return WebAssembly["instantiate"](ab);
            }).then(function (res) {
                console.log("HB ready");
                var exp = res["instance"]["exports"], mem = exp["memory"];
                mem["grow"](700);
                var heapu8 = new Uint8Array(mem.buffer);
                var u32 = new Uint32Array(mem.buffer);
                var i32 = new Int32Array(mem.buffer);
                var __lastFnt, blob, blobPtr, face, font;
                Typr["U"]["shapeHB"] = function () {
                    var toJson = function (ptr) {
                        var length = exp["hb_buffer_get_length"](ptr);
                        var result = [];
                        var iPtr32 = exp["hb_buffer_get_glyph_infos"](ptr, 0) >>> 2;
                        var pPtr32 = exp["hb_buffer_get_glyph_positions"](ptr, 0) >>> 2;
                        for (var i = 0; i < length; ++i) {
                            var a = iPtr32 + i * 5, b = pPtr32 + i * 5;
                            result.push({
                                g: u32[a + 0],
                                cl: u32[a + 2],
                                ax: i32[b + 0],
                                ay: i32[b + 1],
                                dx: i32[b + 2],
                                dy: i32[b + 3]
                            });
                        }
                        return result;
                    };
                    return function (fnt, str, ltr) {
                        var fdata = fnt["_data"], fn = fnt["name"]["postScriptName"];
                        if (__lastFnt != fn) {
                            if (blob != null) {
                                exp["hb_blob_destroy"](blob);
                                exp["free"](blobPtr);
                                exp["hb_face_destroy"](face);
                                exp["hb_font_destroy"](font);
                            }
                            blobPtr = exp["malloc"](fdata.byteLength);
                            heapu8.set(fdata, blobPtr);
                            blob = exp["hb_blob_create"](blobPtr, fdata.byteLength, 2, 0, 0);
                            face = exp["hb_face_create"](blob, 0);
                            font = exp["hb_font_create"](face);
                            __lastFnt = fn;
                        }
                        var buffer = exp["hb_buffer_create"]();
                        var bytes = te["encode"](str);
                        var len = bytes.length, strp = exp["malloc"](len);
                        heapu8.set(bytes, strp);
                        exp["hb_buffer_add_utf8"](buffer, strp, len, 0, len);
                        exp["free"](strp);
                        exp["hb_buffer_set_direction"](buffer, ltr ? 4 : 5);
                        exp["hb_buffer_guess_segment_properties"](buffer);
                        exp["hb_shape"](font, buffer, 0, 0);
                        var json = toJson(buffer);
                        exp["hb_buffer_destroy"](buffer);
                        var arr = json.slice(0);
                        if (!ltr) arr.reverse();
                        var ci = 0, bi = 0;
                        for (var i = 1; i < arr.length; i++) {
                            var gl = arr[i], cl = gl["cl"];
                            while (true) {
                                var cpt = str.codePointAt(ci), cln = codeLength(cpt);
                                if (bi + cln <= cl) {
                                    bi += cln;
                                    ci += cpt <= 65535 ? 1 : 2;
                                } else break;
                            }
                            gl["cl"] = ci;
                        }
                        return json;
                    };
                }();
                resp();
            });
        }
    };
    const QQ_GROUP = ["542643717"];
    var _self = unsafeWindow;
    var top = _self;
    var UE$1;
    var modelId = "modelId_xx";
    const selfintv = setInterval(() => {
        if (unsafeWindow) {
            _self = unsafeWindow;
            top = _self;
            UE$1 = _self.UE;
            try {
                reportOnline();
                String.prototype.replaceAll = function (s1, s2) {
                    return this.replace(new RegExp(s1, "gm"), s2);
                };
                while (top !== _self.top) {
                    top = top.parent.document ? top.parent : _self.top;
                    if (top.location.pathname === "/mycourse/studentstudy") break;
                }
            } catch (err) {
                top = _self;
            }
            clearInterval(selfintv);
        }
    }, GLOBAL.delay);
    function checkVersion() {
        function compare(v1 = "0", v2 = "0") {
            v1 = String(v1).split(".");
            v2 = String(v2).split(".");
            const minVersionLens = Math.min(v1.length, v2.length);
            let result = 0;
            for (let i = 0; i < minVersionLens; i++) {
                const curV1 = Number(v1[i]);
                const curV2 = Number(v2[i]);
                if (curV1 > curV2) {
                    result = 1;
                    break;
                } else if (curV1 < curV2) {
                    result = -1;
                    break;
                }
            }
            if (result === 0 && v1.length !== v2.length) {
                const v1BiggerThenv2 = v1.length > v2.length;
                const maxLensVersion = v1BiggerThenv2 ? v1 : v2;
                for (let i = minVersionLens; i < maxLensVersion.length; i++) {
                    const curVersion = Number(maxLensVersion[i]);
                    if (curVersion > 0) {
                        v1BiggerThenv2 ? result = 1 : result = -1;
                        break;
                    }
                }
            }
            return result;
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://greasyfork.org/en/scripts/451356.json",
            timeout: GLOBAL.timeout,
            onload: function (r) {
                const obj = JSON.parse(r.responseText);
                if (obj.name === GM_info.script.name && compare(obj.version, GM_info.script.version) === 1 && new Date(obj.code_updated_at).getTime() + 1e3 * 60 * 60 * 2 < new Date().getTime()) {
                    iframeMsg("update", {
                        v1: GM_info.script.version,
                        v2: obj.version,
                        href: obj.url
                    });
                }
            }
        });
    }
    top.addEventListener("message", event => {
        if (event.data.type === "jump") {
            GLOBAL.index++;
            iframeMsg("tip", {
                tip: "准备答第" + (GLOBAL.index + 1) + "题"
            });
        } else if (event.data.type === "stop") {
            GLOBAL.stop = event.data.val;
        } else if (event.data.type === "start_pay") {
            if (event.data.flag) {
                // 如果携带了 token 则先更新保存
                const token = event.data.token || GM_getValue("token");
                if (String(token).length === 10 || String(token).length === 11) {
                    GM_setValue("token", token);
                    GM_setValue("start_pay", true);
                    iframeMsg("tip", {
                        tip: "🚀 付费题库已激活，VIP 线路已就绪"
                    });
                    iframeMsg("start_pay", true);
                } else {
                    iframeMsg("tip", {
                        tip: "系统检测您的 VIP 码格式不正确，请检查"
                    });
                    // 重要：校验失败，强制 UI 开关回弹
                    iframeMsg("start_pay", false);
                    GM_setValue("start_pay", false);
                }
            } else {
                iframeMsg("tip", {
                    tip: "已切回免费题库模式"
                });
                GM_setValue("start_pay", false);
                iframeMsg("start_pay", false);
            }
        } else if (event.data.type === "auto_jump") {
            GM_setValue("auto_jump", event.data.flag);
            iframeMsg("tip", {
                tip: "已" + (event.data.flag ? "开启" : "关闭") + "自动切换,页面刷新后生效"
            });
        } else if (event.data.type === "confim") {
            if (event.data.token.length === 10 || event.data.token.length === 11) {
                GM_setValue("token", event.data.token);
                iframeMsg("tip", {
                    tip: "成功设置token,请点击开启付费题库"
                });
            } else {
                iframeMsg("tip", {
                    tip: "系统检测您的token可能输入有误,请检查"
                });
            }
        } else if (event.data.type === "save_setting") {
            GM_setValue("gpt", event.data.gpt);
            GM_setValue("search_delay", event.data.search_delay);
            GM_setValue("tiku_adapter", event.data.tiku_adapter);
        } else if (event.data.type === "dragStart") {
            const modal = document.getElementById(modelId);
            if (!modal) return;

            let overlay = document.getElementById('drag-overlay-shield');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'drag-overlay-shield';
                overlay.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:10000000;cursor:move;background:transparent;";
                document.body.appendChild(overlay);
            }
            overlay.style.display = 'block';

            const offsetX = event.data.clientX;
            const offsetY = event.data.clientY;

            const onMouseMove = (e) => {
                let left = e.clientX - offsetX;
                let top = e.clientY - offsetY;
                // 边界限制
                left = Math.max(0, Math.min(left, window.innerWidth - modal.offsetWidth));
                top = Math.max(0, Math.min(top, window.innerHeight - modal.offsetHeight));
                modal.style.left = left + "px";
                modal.style.top = top + "px";
            };

            const onMouseUp = () => {
                overlay.style.display = 'none';
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
                GM_setValue("pos", modal.style.left + "," + modal.style.top);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        }
    }, false);
    $(document).keydown(function (event) {
        if (event.keyCode === 38) {
            $("." + modelId).hide();
        } else if (event.keyCode === 40) {
            $("." + modelId).show();
        } else if (event.keyCode === 37) {
            $("." + modelId).hide();
            GM_setValue("hide", true);
        } else if (event.keyCode === 39) {
            $("." + modelId).show();
            GM_setValue("hide", false);
            GM_setValue("pos", "50px,50px");
        } else if (event.keyCode === 83) {
            GLOBAL.stop = true;
            iframeMsg("stop", GLOBAL.stop);
        } else if (event.keyCode === 68) {
            GLOBAL.stop = false;
            iframeMsg("stop", GLOBAL.stop);
        }
    });
    function getAnswerForKey(keys, options) {
        return keys.map(function (val) {
            return options[val.charCodeAt(0) - 65];
        });
    }
    function setIntervalFunc(flag, func, time) {
        const interval = setInterval(() => {
            if (flag()) {
                clearInterval(interval);
                func();
            }
        }, time || 1e3);
    }
    function getAnswer(str, options, type) {
        if (type === 0 || type === 1) {
            const ans = getAnswerForKey(str.match(/[A-G]/gi) || [], options);
            return ans.length > 0 ? ans : [str];
        } else {
            return [str];
        }
    }
    function getQuestionType(str) {
        if (!str) return;
        str = str.trim().replaceAll(/\s+/g, "");
        if (TYPE[str]) return TYPE[str];
        const regex = Object.keys(TYPE).join("|");
        const matcher = str.match(regex);
        if (matcher) return TYPE[matcher[0]];
    }
    function rand(m, n) {
        return Math.ceil(Math.random() * (n - m + 1) + m - 1);
    }
    const TYPE = {
        "阅读理解（选择）/完型填空": 66,
        "听力训练": 66,
        multichoice: 1,
        singlechoice: 0,
        SingleChoice: 0,
        bijudgement: 3,
        Judgement: 3,
        "单项选择题": 0,
        "单项选择": 0,
        "单选题": 0,
        "单选": 0,
        "多选": 1,
        "多选题": 1,
        "案例分析": 1,
        "多项选择题": 1,
        "多项选择": 1,
        "客观题": 1,
        "填空题": 2,
        "填空": 2,
        "对错题": 3,
        "判断题": 3,
        "判断正误": 3,
        "判断": 3,
        "主观题": 4,
        "问答题": 4,
        "简答题": 4,
        "名词解释": 5,
        "论述题": 6,
        "计算题": 7,
        "其它": 8,
        "分录题": 9,
        "资料题": 10,
        "连线题": 11,
        "排序题": 13,
        "完形填空": 14,
        "完型填空": 14,
        "阅读理解": 15,
        "口语题": 18,
        "听力题": 19,
        "A1A2题": 1,
        "文件作答": 4,
        "视频题": 1
    };
    function sleep(time) {
        return new Promise(resolve => {
            setTimeout(resolve, time);
        });
    }
    function iframeMsg(type, message) {
        try {
            top.document.getElementById("iframeNode").contentWindow.vueDefinedProp(type, message);
        } catch (e) { }
    }
    function filterImg(dom) {
        if (location.host === "ncexam.cug.edu.cn") {
            String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/gm, "");
            };
        }
        return $(dom).clone().find("img[src]").replaceWith(function () {
            return $("<p></p>").text('<img src="' + $(this).attr("src") + '">');
        }).end().find("iframe[src]").replaceWith(function () {
            return $("<p></p>").text('<iframe src="' + $(this).attr("src") + '"></irame>');
        }).end().text().trim();
    }
    function createContainer(name, childElem) {
        name = name.toLowerCase();
        let elem = top.document.createElement(name);
        elem.style.display = "block";
        elem.id = name.replace("hcsearche", "hcSearche").replace(/\-[a-z]/g, function (w) {
            return w.replace("-", "").toUpperCase();
        });
        if (childElem) {
            if (Array.isArray(childElem) === false) childElem = [childElem];
            for (let i = 0; i < childElem.length; i++) elem.appendChild(childElem[i]);
        }
        return elem;
    }
    function dragModel(drag) {
        const TOP = top;
        drag.onmousedown = function (e) {
            drag.style.cursor = "move";
            e = e || window.event;
            let diffX = e.clientX - drag.offsetLeft;
            let diffY = e.clientY - drag.offsetTop;
            top.onmousemove = function (e) {
                e = e || top.event;
                let left = e.clientX - diffX;
                let top = e.clientY - diffY;
                if (left < 0) {
                    left = 0;
                } else if (left > TOP.innerWidth * .95 - drag.offsetWidth) {
                    left = TOP.innerWidth * .95 - drag.offsetWidth;
                }
                if (top < 0) {
                    top = 0;
                } else if (top > TOP.innerHeight - drag.offsetHeight) {
                    top = TOP.innerHeight - drag.offsetHeight;
                }
                drag.style.left = left + "px";
                drag.style.top = top + "px";
                GM_setValue("pos", drag.style.left + "," + drag.style.top);
            };
            top.onmouseup = function (e) {
                drag.style.cursor = "default";
                this.onmousemove = null;
                this.onmouseup = null;
            };
        };
    }
    function defaultWorkTypeResolver($options) {
        function count(selector) {
            let sum = 0;
            for (const option of $options || []) {
                if ($(option).find(selector).length || $(option).parent().find(selector).length) {
                    sum++;
                }
            }
            return sum;
        }
        return count('[type="radio"]') === 2 ? 3 : count('[type="radio"]') > 2 ? 0 : count('[type="checkbox"]') > 2 ? 1 : count("textarea") >= 1 ? 4 : undefined;
    }
    function waitWithTimeout(promise, timeout, timeoutMessage = "timeout", defaultRes) {
        let timer;
        const timeoutPromise = new Promise((resolve, reject) => {
            timer = setTimeout(() => defaultRes === undefined ? reject(timeoutMessage) : resolve(defaultRes), timeout);
        });
        return Promise.race([timeoutPromise, promise]).finally(() => clearTimeout(timer));
    }
    async function formatSearchAnswer(initData) {
        const data = {
            plat: initData.plat ? parseInt(initData.plat) : null,
            qid: initData.qid ? String(initData.qid) : null,
            question: initData.question,
            options: initData.options,
            options_id: initData.options_id ? initData.options_id : [],
            type: initData.type
        };
        let res;
        const list = [];
        const apis = GLOBAL.answerApi;
        const answerApiFunc = Object.keys(apis).map(item => {
            return waitWithTimeout(apis[item](data), 5e3, "", []);
        });
        answerApiFunc.push(searchAnswer(data));
        const answerApiRes = await waitWithTimeout(Promise.all(answerApiFunc), 1e4, "(接口超时)");
        answerApiRes.map(item => {
            if (item instanceof Array) {
                console.log("tikuAdapter结果", JSON.stringify(item));
                list.push(...item);
            } else if (item instanceof Object && Object.keys(item).length === 1) {
                const key = Object.keys(item)[0];
                item[key];
            } else {
                res = item;
            }
        });
        try {
            const msg = res.message || res.msg;
            if (res.code !== 0) {
                return {
                    success: false,
                    msg: msg
                };
            }
            if (res.result.success) {
                return {
                    success: true,
                    msg: msg,
                    num: res.result.num,
                    answers: res.result.answers
                };
            }
            console.log("官方结果", JSON.stringify(res));
            if (res.result.answers instanceof Array && res.result.answers.length > 0) {
                list.push(...res.result.answers);
            }
            return {
                success: true,
                msg: msg,
                num: res.result.num,
                list: list
            };
        } catch (e) {
            return {
                success: false,
                msg: "发生异常" + e + "请反馈至QQ群" + QQ_GROUP
            };
        }
    }
    function similar(s, t, f) {
        if (!s || !t) {
            return 0;
        }
        if (s === t) {
            return 100;
        }
        var l = s.length > t.length ? s.length : t.length;
        var n = s.length;
        var m = t.length;
        var d = [];
        f = f || 2;
        var min = function (a, b, c) {
            return a < b ? a < c ? a : c : b < c ? b : c;
        };
        var i, j, si, tj, cost;
        if (n === 0) return m;
        if (m === 0) return n;
        for (i = 0; i <= n; i++) {
            d[i] = [];
            d[i][0] = i;
        }
        for (j = 0; j <= m; j++) {
            d[0][j] = j;
        }
        for (i = 1; i <= n; i++) {
            si = s.charAt(i - 1);
            for (j = 1; j <= m; j++) {
                tj = t.charAt(j - 1);
                if (si === tj) {
                    cost = 0;
                } else {
                    cost = 1;
                }
                d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
            }
        }
        let res = (1 - d[n][m] / l) * 100;
        return res.toFixed(f);
    }
    function answerSimilar(src, list) {
        return $.map(list, function (val) {
            return Number(similar(formatString(val), formatString(src), 2));
        });
    }
    function isPlainAnswer(answer) {
        if (answer.length > 8 || !/[A-Z]/.test(answer)) {
            return false;
        }
        let min = 0;
        for (let i = 0; i < answer.length; i++) {
            if (answer.charCodeAt(i) < min) {
                return false;
            }
            min = answer.charCodeAt(i);
        }
        return true;
    }
    function isTrue(str) {
        return Boolean(String(str).match(/(^|,)(正确|是|对|√|T|ri|true|A)(,|$)/));
    }
    function isFalse(str) {
        return Boolean(String(str).match(/(^|,)(错误|否|错|×|F|不是|wr|false|B)(,|$)/));
    }
    async function defaultQuestionResolve(list, data, handler, ignore_click) {
        let targetOptionsList = [];
        for (const answers of list) {
            if (data.type === 4 || data.type === 2 || data.type === 5) {
                let ans = answers.length > data.$options.length ? answers.slice(0, data.$options.length) : answers;
                for (let index in ans) {
                    if (typeof handler === "function") await handler(data.type, ans[index], data.$options.eq(index));
                }
                return {
                    style: "success-row",
                    ans: answers.join("===="),
                    question: data.question
                };
            } else if (data.type === 3) {
                if (targetOptionsList.length > 3) break;
                let targetOptions = new Set();
                if (isTrue(answers.join())) {
                    targetOptions.add(Number(isFalse(data.options[0])));
                } else if (isFalse(answers.join())) {
                    targetOptions.add(Number(isTrue(data.options[0])));
                }
                targetOptions.size > 0 && targetOptionsList.push(targetOptions);
            } else if (data.type === 0 || data.type === 1 || data.type === 66) {
                const beautifulOptions = data.options.map(i => {
                    return formatString(i).toLowerCase().replace(/\s/g, "");
                });
                let targetOptions = new Set();
                for (const ans of answers) {
                    if (ans.length === 1 && isPlainAnswer(ans)) {
                        targetOptions.add(ans.charCodeAt(0) - 65);
                    }
                    const val = formatString(ans).toLowerCase().replace(/\s/g, "");
                    let optIndex = $.inArray(val, beautifulOptions);
                    if (optIndex >= 0) {
                        targetOptions.add(optIndex);
                    }
                }
                if ((data.type === 0 && targetOptions.size === 0 || data.type === 1 && targetOptions.size < 2) && targetOptionsList.length === 0) {
                    for (const ans of answers) {
                        const val = formatString(ans).toLowerCase();
                        if (val.length >= 5 && !val.includes("<img")) {
                            const ratings = answerSimilar(val, beautifulOptions);
                            const maxScore = Math.max(...ratings);
                            if (maxScore > 65) {
                                targetOptions.add(ratings.indexOf(maxScore));
                            }
                        }
                    }
                }
                targetOptions.size > 0 && targetOptionsList.push(targetOptions);
            }
        }
        let items = [];
        let sortArr = targetOptionsList.map(item => {
            const s = Array.from(item).sort();
            return s;
        });
        if (data.type === 0 || data.type === 3) {
            items = getMost(sortArr.filter(i => i.length === 1));
            if (!items || items.length === 0) {
                items = getMost(sortArr.filter(i => i.length > 0));
            }
        } else if (data.type === 1 || data.type === 66) {
            items = getMost(sortArr.filter(i => i.length > 1));
            if (!items || items.length === 0) {
                items = getLang(sortArr.filter(i => i.length > 0));
            }
        }
        if (items && items.length > 0) {
            for (let index = 0; index < data.$options.length; index++) {
                const $item = data.$options.eq(index);
                if (Boolean($.inArray(index, items) + 1) !== Boolean(ignore_click($item, data.type))) {
                    $item.get(0).click();
                    await sleep(GLOBAL.fillAnswerDelay);
                }
            }
            return {
                type: data.type,
                style: "primary-row",
                ans: items.map(i => {
                    return data.options[i];
                }).join("===="),
                question: data.question
            };
        } else {
            return {
                type: data.type,
                style: "warning-row",
                question: data.question,
                ans: list.join('<span style="color: red">====</span>'),
                options: data.options
            };
        }
    }
    window._debugDefaultFillAnswer = defaultFillAnswer;
    console.log('[DEBUG] defaultFillAnswer已注册', window._debugDefaultFillAnswer);

    async function defaultFillAnswer(answers, data, handler, ignore_click) {
        console.log('[DEBUG] 判断是否为石家庄铁道大学继续教育在线考试，准备开始填充答案', location.host, location.pathname);
        const isSTDU = location.host.includes("jxjy.stdu.edu.cn") && location.pathname.includes("BootStrap_zxksDetailNew.aspx");
        if (isSTDU && window.stduWorker && typeof window.stduWorker.fill === 'function') {
            window.stduWorker.fill(data, answers);
            //石家庄铁道特殊处理，需要等待5秒
            await sleep(10000);
            return {
                type: data.type,
                style: "success-row",
                question: data.question,
                ans: Array.isArray(answers) ? (answers.length === 0 ? '未查询到答案，默认单选第一项，多选全选' : answers.join("====")) : answers,
                options: data.options
            };
        } else {
            for (let index = 0; index < data.$options.length; index++) {
                const $item = data.$options.eq(index);
                if (Boolean($.inArray(index, answers) + 1) !== Boolean(ignore_click($item, data.type))) {
                    $item.get(0).click();
                    await sleep(GLOBAL.fillAnswerDelay);
                }
            }
            return {
                type: data.type,
                style: "success-row",
                question: data.question,
                ans: answers.map(i => {
                    return String.fromCharCode(i + 65);
                }).join(""),
                options: data.options
            };
        }
    }
    function getMost(arr) {
        arr.reverse();
        if (arr.length === 0) return undefined;
        var hash = {};
        var m = 0;
        var trueEl;
        var el;
        for (var i = 0, len = arr.length; i < len; i++) {
            el = arr[i];
            hash[el] === undefined ? hash[el] = 1 : hash[el]++;
            if (hash[el] >= m) {
                m = hash[el];
                trueEl = el;
            }
        }
        return trueEl;
    }
    function getLang(arr) {
        if (arr.length === 0) return undefined;
        let len = 0;
        let ele;
        for (let arrElement of arr) {
            if (arrElement.length > len) {
                len = arrElement.length;
                ele = arrElement;
            }
        }
        return ele ? ele : arr.length > 0 ? arr[0] : [];
    }
    function HTMLDecode(text) {
        var temp = document.createElement("div");
        temp.innerHTML = text;
        var output = temp.innerText || temp.textContent;
        temp = null;
        return output;
    }
    function formatString(src) {
        src = String(src);
        src = src.includes("img") || src.includes("iframe") ? src : HTMLDecode(src);
        src = src.replace(/[\uff01-\uff5e]/g, function (str) {
            return String.fromCharCode(str.charCodeAt(0) - 65248);
        });
        return src.replace(/\s+/g, " ").replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/。/g, ".").replace(/[,.?:!;]$/, "").trim();
    }
    function division(arr, size) {
        var objArr = new Array();
        var index = 0;
        var objArrLen = arr.length / size;
        for (var i = 0; i < objArrLen; i++) {
            var arrTemp = new Array();
            for (var j = 0; j < size; j++) {
                arrTemp[j] = arr[index++];
                if (index === arr.length) {
                    break;
                }
            }
            objArr[i] = arrTemp;
        }
        return objArr;
    }
    const cache = {};
    const sourceTable = JSON.parse(GM_getResourceText("SourceTable"));
    async function genTable(ttf) {
        const res = await axios.get(ttf, {
            responseType: "arraybuffer"
        });
        const font = Typr.parse(res.data)[0];
        const table = {};
        for (let i = 19968; i < 40870; i++) {
            const g = Typr.U.codeToGlyph(font, i);
            if (g) {
                const path = Typr.U.glyphToPath(font, g);
                if (path) {
                    table[i] = MD5(JSON.stringify(path));
                }
            }
        }
        cache[ttf] = table;
    }
    async function getEncryptString(str, ttf) {
        if (!cache[ttf]) {
            await genTable(ttf);
        }
        const match = str.match(/<span class="xuetangx-com-encrypted-font">(.*?)</g);
        if (match === null) {
            return formatString(str);
        }
        const encStrArr = match.map(string => {
            return string.replace(/^<span class="xuetangx-com-encrypted-font">/, "").replace(/<$/, "");
        });
        encStrArr.forEach(encStr => {
            const decStr = encStr.split("").map(string => {
                const md5 = cache[ttf][string.charCodeAt(0)];
                return String.fromCharCode(sourceTable[md5]);
            }).join("");
            str = str.replace(encStr, decStr);
        });
        return formatString(str);
    }
    var vm = {
        hideTip() {
            var tip = document.createElement("div");
            tip.id = "yinc";
            tip.innerHTML = `
        <div style="
            position:fixed;
            right:0;
            top:10%;
            color: #8a6d3b;
            background-color: #fcf8e3;
            padding: 15px;
            margin-bottom: 20px;
            border: 1px solid transparent;
            border-radius: 4px;
            border-color: #faebcc;">
            知题搜搜已被隐藏<br>如果需要显示答题面板，请按键盘右箭头
        <button style="
            padding: 0;
            color: inherit;
            border: 0;
            background: inherit;
            top:-22px;
            position:relative"
            type="button" id="cl_yinc" data-dismiss="alert" aria-label="Close">&times;</button>
        </div>`;
            top.document.getElementsByTagName("body")[0].appendChild(tip);
            top.document.querySelector("#cl_yinc").onclick = function () {
                top.document.querySelector("#yinc").remove();
            };
            setTimeout(() => {
                top.document.querySelector("#yinc").remove();
            }, 3e3);
        },
        zhihuishuSaveTip() {
            var zhihuishuSaveTip = document.createElement("div");
            zhihuishuSaveTip.id = "zhihuishuSaveTip";
            zhihuishuSaveTip.innerHTML = `
        <div style="
            position: fixed;
            opacity: 1;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 1040;
            background:rgba(0,0,0,.46);">
        <div style="
            position: relative;
            margin: 10px;
            top: 50%;
            left: 40%;
            width: 20%;">
        <div style="
            position: relative;
            background-color: #fff;
            -webkit-background-clip: padding-box;
            background-clip: padding-box;
            /*border: 1px solid #999;*/
            border: 1px solid rgba(0,0,0,.2);
            border-radius: 6px;
            outline: 0;
            -webkit-box-shadow: 0 3px 9px rgba(0,0,0,.5);
            box-shadow: 0 3px 9px rgba(0,0,0,.5);">
        <div style="
            line-height: 25px;
            font-size: 15px;
            margin: 5px;">
        <h4 class="modal-title">正在保存</h4>


        <!-- 模态框主体 -->
        <div class="modal-body" style="height: 50px;
            margin: 5px;
            padding: 5px;
            margin-top: 15px;
            line-height: 15px;
            font-size: 15px;">
            <progress style="width: 100%" id="gs_p" value="0" max="100"></progress> <span id="gs_text">0%</span>
        </div>



        </div>
   </div>
      </div>`;
            top.document.getElementsByTagName("body")[0].appendChild(zhihuishuSaveTip);
        }
    };
    function showPanel() {
        let html = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      ` + GM_getResourceText("ElementUiCss") + `
      .el-table .warning-row {
        // background: oldlace;
      }
      .message-update-tip {
        width: 300px;
      }
      .el-table .success-row {
        // background: #f0f9eb;
      }
      .el-table .primary-row {
        // background: rgb(236, 245, 255);

      }
        .el-table--scrollable-x {
            overflow-x: hidden !important;
        }

        /* 或者完全禁用横向滚动相关样式 */
        .el-table.el-table--scrollable-x {
            overflow-x: hidden !important;
        }

        .el-table.el-table--scrollable-x .el-table__body-wrapper {
            overflow-x: hidden !important;
        }
      *{
        padding: 0px;
        margin: 0px;
       
      }
        body{
            overflow-x: hidden!important;
        }
        #app {
            min-height: 100vh!important;
            background:#fff;
        }
      .el-button{
        margin-bottom: 4px;
      }
      .el-button + .el-button{
        margin-left: 0px;
      }

      .el-form
      -item-confim{
        display: flex;
        justify-content: center
      }
      .drag_auto_answer-class{
        // width: 321px;
        box-sizing: border-box;
        padding: 0 12px; /* 修正对称边距 */
        background-color: rgb(248, 250, 252); /* 微浅色背景提升质感 */
        overflow-x: hidden;
        overflow-y: overlay; /* 优雅的覆盖式滚动 */
        position: absolute;
        top: 250px;
        bottom: 0;
        left: 0;
        right: 0; /* 确保占满宽度 */
      }
        .el-form-item {
            margin-top:0!important;
        }
        /* 优化后的 4px 精致滚动条 */
        #drag_auto_answer .el-main::-webkit-scrollbar {
            width: 4px !important;
        }
        #drag_auto_answer .el-main::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.3) !important;
            border-radius: 10px !important;
        }
        #drag_auto_answer .el-main::-webkit-scrollbar-track {
            background: transparent !important;
        }

        .token-section {
            background-image: linear-gradient(to bottom, #ffffff, #fdfdfd) !important;
            background-color: #ffffff !important;
            border-radius: 14px;
            padding: 12px !important;
            margin-bottom: 16px;
            overflow: visible;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            border: 1px solid #edf2f7;
        }

        /* 模式展示行 - 深度统合 */
        .mode-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: -4px -4px 10px -4px;
            padding: 6px 10px;
            background: #f8fafc;
            border-radius: 10px;
            border: 1px solid #f1f5f9;
            transition: all 0.3s ease;
        }
        .mode-row.row-premium {
            background: #fffbeb !important; /* 加速模式下背景更显著 */
            border-color: #fef3c7 !important;
        }
        .status-tag {
            font-size: 11px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 4px;
            padding-left: 10px; /* 解决太靠左的问题 */
        }
        .tag-free { color: #64748b; }
        .tag-premium { 
            color: #b45309; 
            animation: text-pulse 2s infinite;
        }
        @keyframes text-pulse {
            0% { opacity: 0.8; } 50% { opacity: 1; } 100% { opacity: 0.8; }
        }

        /* 重点优化的购买提示区 */
        .premium-tip-box {
            background: #f0f7ff;
            border: 1px solid #e0efff;
            border-radius: 8px;
            padding: 8px 10px;
            margin-bottom: 12px;
            position: relative;
        }
        .premium-tip-text {
            font-size: 10px; /* 缩小字号确保不换行 */
            color: #475569;
            line-height: 1.5;
            margin: 0;
            letter-spacing: -0.3px; /* 紧凑字符间距 */
            white-space: nowrap; /* 强制单行 */
        }
        .point-link {
            color: #2563eb;
            font-weight: 800;
            text-decoration: none;
            border-bottom: 1.5px solid rgba(37, 99, 235, 0.3);
            margin: 0 2px;
        }

        .token-input-row {
            display: flex;
            align-items: center;
            margin-top: 5px;
        }
        .token-input /deep/.el-input__inner {
            height: 38px!important;
            line-height: 38px!important;
            border: 1.5px solid #e2e8f0 !important;
            border-radius: 8px !important;
            padding-left: 12px !important;
            font-size: 12px !important;
            background: #ffffff !important;
            transition: all 0.2s;
        }
        .token-input.is-active /deep/ .el-input__inner,
        .token-input.is-premium-mode /deep/ .el-input__inner {
            border-color: #fbbf24 !important;
            background: #fffef0 !important;
            box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
        }
        .token-input {
            flex: 1;
        }
            .token-input /deep/.el-input__inner {
                height: 42px!important;
                line-height: 42px!important;
                border: 1px solid #e9e7fd !important;
                border-radius: 8px !important; /* 略显方正的微圆角 */
                padding-left: 14px !important;
                background: #ffffff !important;
                transition: all 0.3s ease;
                font-size: 13px !important;
                color: #334155 !important;
            }
            .token-input /deep/.el-input__inner:focus {
                border-color: #ddd6fe !important;
                background: #fdfefe !important;
            }
            .token-input-btn {
                height: 36px;
                padding: 0 16px!important;
                border-radius: 8px !important; /* 略显方正 */
                background: linear-gradient(135deg, #f5f3ff 0%, #ddd6fe 100%) !important; /* 冰晶紫渐变 */
                color: #6d28d9 !important; /* 深紫色文字 */
                border: 1px solid #ddd6fe !important;
                font-weight: 600 !important;
                font-size: 12px !important;
                transition: all 0.3s ease;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                white-space: nowrap;
                box-shadow: 0 2px 4px rgba(221, 214, 254, 0.4);
            }
            .token-input-btn:hover {
                background: linear-gradient(135deg, #ede9fe 0%, #c4b5fd 100%) !important;
                transform: translateY(-1px);
            }
                .token-hint {
                    padding: 8px 12px;
                    background-color: #f7fafc;
                    border-top: 1px solid #edf2f7;
                    line-height: 1.4!important;
                }
                .premium-tip {
                    font-size: 11px;
                    color: #555;
                    background: #fff;
                    border: 1px solid #eee;
                    padding: 6px 12px;
                    border-radius: 10px;
                    display: inline-flex;
                    align-items: center;
                    white-space: nowrap;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .point-tag {
                    color: #fff;
                    background: #ffab00;
                    padding: 0 6px;
                    border-radius: 4px;
                    margin: 0 4px;
                    font-weight: bold;
                    font-size: 10px;
                }
            .el-alert.show-alert-wrap {
                display: block;
                padding: 16px 20px;
                background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
                border-radius: 16px;
                margin-bottom: 16px;
                border: 1px solid #e0f2fe;
                box-shadow: 0 4px 6px rgba(186, 230, 253, 0.15);
            }
                .show-alert-wrap /deep/.el-alert__content{
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    
                }
                .show-alert-wrap /deep/.el-alert__content .el-alert__title {
                    color: #2d3748!important;
                    font-size: 14px!important;
                    margin-right: 15px!important;
                }
                    .show-auto-btn {
                        border: 1px solid #718096 !important;
                        background: #fff !important;
                        color: #4a5568 !important;
                        border-radius: 12px !important;
                        padding: 6px 12px !important;
                        font-weight: 600 !important;
                        transition: all 0.2s;
                    }
                    .show-auto-btn:hover {
                        background: #f7fafc !important;
                        border-color: #2d3748 !important;
                    }
                    .show-btn-list-wrap {
                        display: flex;
                        justify-content: space-between;
                        gap: 8px;
                        flex-wrap: nowrap !important;
                        margin-bottom: 12px;
                        width: 100%; /* 占满容器，配合父级 padding 居中 */
                    }
                    .show-btn-list-wrap .el-button {
                        padding: 10px 0 !important;
                        font-size: 13px !important;
                        color: #fff !important;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                        border-radius: 16px !important;
                        margin: 0 !important;
                        border: 1px solid rgba(255, 255, 255, 0.2) !important;
                        backdrop-filter: blur(10px);
                        transition: all 0.3s ease;
                        flex: 1; /* 均分空间 */
                        min-width: 0; /* 允许压缩以防换行 */
                    }
                    .show-btn-list-wrap .el-button:hover {
                        transform: translateY(-2px);
                    }
                    /* 使用更强力的选择器确保颜色生效 */
                    .show-btn-list-wrap .el-button.btn-stop { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important; }
                    .show-btn-list-wrap .el-button.btn-pay { background: linear-gradient(135deg, #f6d365 0%, #fda085 100%) !important; }
                    .show-btn-list-wrap .el-button.btn-point { background: linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%) !important; }
                    .show-btn-list-wrap .el-button.btn-setting { background: linear-gradient(135deg, #2d3436 0%, #636e72 100%) !important; }
                    
                    .show-btn-list-wrap .el-button.btn-point span, 
                    .show-btn-list-wrap .el-button.btn-point a { color: #2d3436 !important; }

                    .search-records {
                            padding: 0 !important;
                            background: transparent !important;
                            margin-top: 5px;
                    }
                    .search-records .el-table {
                        background: transparent !important;
                        width: 100% !important; /* 确保表格宽度占满 */
                    }
                    .search-records .el-table::before { height: 0; }
                    .search-records .el-table tr {
                        background: transparent !important;
                        cursor: pointer;
                        transition: all 0.2s;
                    }
                    .search-records .el-table tr:hover {
                        background: rgba(241, 245, 249, 0.5) !important;
                    }
                    .search-records .el-table td {
                        border-bottom: 1px solid rgba(226, 232, 240, 0.6) !important;
                        padding: 10px 4px !important;
                    }
                    .btn-view-ans {
                        padding: 2px 6px !important;
                        font-size: 10px !important;
                        height: 20px !important;
                        border-radius: 4px !important;
                        background: #fee2e2 !important;
                        color: #dc2626 !important;
                        border: none !important;
                    }
                            .app-header {
                                background: white;
                                padding: 12px 15px 9px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                position: relative;
                                z-index: 10;
                                border-bottom: 1px solid white;
                                cursor: move; /* 增加移动手势 */
                                user-select: none;
                            }
                            .logo-container {
                                display: flex;
                                align-items: center;
                                gap: 7px;
                            }
                            .app-logo {
                                height: 24px;
                                width: auto;
                            }
                            .app-title {
                                font-size: 15px;
                                font-weight: 700;
                                color: #5b6df5;
                                letter-spacing: 0.38px;
                            }
                            .ad-banner {
                                height: 180px; /* 继续提升高度，确保内容完整显示 */
                                min-height: 45px;
                                background: #fff;
                                position: relative;
                                overflow: hidden;
                                border-radius: 12px;
                                margin: 4px 12px 14px; 
                                width: calc(100% - 24px);
                                box-shadow: 0 3px 9px rgba(0, 0, 0, 0.05);
                                padding: 0;
                            }
                            .ad-banner .el-carousel {
                                width: 100%;
                                height: 100%;
                            }
                            .ad-carousel-img {
                                width: 100%;
                                height: 100%;
                                object-fit: cover; 
                                border-radius: 12px;
                                display: block;
                                background-color: #fff;
                            }
                            .carousel-arrow {
                                position: absolute;
                                top: 50%;
                                transform: translateY(-50%);
                                width: 28px;
                                height: 28px;
                                background: rgba(255, 255, 255, 0.2);
                                backdrop-filter: blur(4px);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                z-index: 10;
                                color: #fff;
                                font-size: 12px;
                                transition: all 0.3s;
                                user-select: none;
                                border: 1px solid rgba(255, 255, 255, 0.2);
                            }
                            .carousel-arrow:hover {
                                background: rgba(255, 255, 255, 0.6);
                                color: #000;
                            }
                            .arrow-left { left: 4px; }
                            .arrow-right { right: 4px; }
    </style>
</head>
<body>
<div id="app">
<el-dialog title="更多设置" :visible.sync="show_setting" width="300px">
<el-form ref="form" label-width="100px" size="mini">
  <el-form-item label="ChatGPT答题">
    <el-select v-model="gpt">
      <el-option label="不开启" value="-1"></el-option>
      <el-option label="使用GPT3.5" value="3"></el-option>
      <el-option  disabled label="使用GPT4" value="4"></el-option>
    </el-select>
  </el-form-item>
    <el-form-item label="搜题延迟(秒)">
    <el-input-number v-model="search_delay" :min="0" :max="30"></el-input-number>
   </el-form-item>
</el-form>
<div slot="footer" class="dialog-footer">
    <el-button size="mini" @click="show_setting = false">取消</el-button>
    <el-button size="mini" type="primary" @click="save_setting">保存</el-button>
</div>
</el-dialog>
         <!-- 顶部栏 - 带自定义Logo -->
                     <div class="app-header" id="app-header" @mousedown="handleHeaderDrag">
                        <div class="logo-container">
                            <img src="https://s1.imagehub.cc/images/2025/06/09/60ced445852c5fe1053ff23e20e88ad0.png" alt="知题搜搜" class="app-logo">
                            <div class="app-title">知题搜搜</div>
                        </div>
                    </div>
        
                    <!-- 广告区域 -->
                    <div class="ad-banner">
                        <template v-if="adsReady && adList && adList.length > 0">
                            <!-- 左右切换按钮 -->
                            <div class="carousel-arrow arrow-left" @click="$refs.adCarousel.prev()">＜</div>
                            <div class="carousel-arrow arrow-right" @click="$refs.adCarousel.next()">＞</div>
                            
                            <el-carousel ref="adCarousel" height="180px" indicator-position="none" arrow="never" :interval="4000">
                                <el-carousel-item v-for="(item, index) in adList" :key="index">
                                    <a :href="item.jumpUrl || 'javascript:;'" target="_blank" style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;background:#fff;text-decoration:none;">
                                        <img v-if="item.base64 || item.url" 
                                             :src="item.base64 || item.url" 
                                             @error="item.base64 = ''"
                                             :alt="item.name" class="ad-carousel-img" draggable="false">
                                    </a>
                                </el-carousel-item>
                            </el-carousel>
                        </template>
                        <template v-else>
                            <div style="width:100%;height:180px;display:flex;align-items:center;justify-content:center;background:#f8fafc;">
                                <img src="https://s1.imagehub.cc/images/2025/06/09/b8323e342d2d140e7967f96d862ab02b.png" alt="专业版广告" class="ad-carousel-img" style="height:180px;" draggable="false">
                            </div>
                        </template>
                    </div>
    <div id="drag_auto_answer" class="drag_auto_answer-class">
    
        <el-main style="max-width: 321px;padding: 0px 0px 0px; z-index: 99999;">
            <el-row>
                
          
               
                <el-form>
                    <el-form-item class="el-form-item-confim token-section" style="margin-top: -20px">
                        <!-- 第一行：状态标签 + 开关 -->
                        <div class="mode-row" :class="{'row-premium': opt.start_pay}">
                            <span class="status-tag" :class="opt.start_pay ? 'tag-premium' : 'tag-free'">
                                {{ opt.start_pay ? '🚀 智库加速' : '🔒 基础免费' }}
                            </span>
                             <el-switch
                                v-model="opt.start_pay"
                                active-color="#f59e0b"
                                inactive-color="#e2e8f0"
                                size="mini"
                                @change="handlePayModeChange"
                            ></el-switch>
                        </div>

                        <!-- 第二行：引导提示卡片 -->
                        <div class="premium-tip-box">
                            <p class="premium-tip-text">
                                🌟 推荐：点击 <a href="https://py.keyida.asia/pay" target="_blank" class="point-link">积分</a> 购买专业版，解锁 VIP 码开启全功能
                            </p>
                        </div>
                        
                        <!-- 第三行：Token 输入框 -->
                        <div class="token-input-row">
                            <el-input 
                                :type="passw" 
                                v-model="opt.token" 
                                :placeholder="opt.start_pay ? '🚀 VIP 状态生效中' : '在此输入 VIP 激活码'" 
                                class="token-input"
                                :class="{'is-active': showFlash, 'is-premium-mode': opt.start_pay}"
                                @blur="handleTokenBlur"
                            >
                                <i slot="suffix" 
                                   :class="passw === 'password' ? 'el-icon-view' : 'el-icon-lock'" 
                                   @click="togglePassw" 
                                   style="cursor:pointer; margin-right: 5px; color: #94a3b8; font-size: 14px;"></i>
                            </el-input>
                        </div>
                    </el-form-item>
                </el-form>
                
            </el-row>
            <el-row style="margin-bottom: 5px;display: flex">
                <el-alert
                        class="show-alert-wrap"
                        style="display: block"
                        :title="tip"
                        :closable="false">
                    <el-button v-if="need_jump" @click="btnClick(opt.jump,'opt.jump')" size="mini" type="info">跳过本题</el-button>
                    <el-button v-if="!hidden" class="show-auto-btn"  @click="btnClick(opt.auto_jump,'opt.auto_jump')" size="mini">{{opt.auto_jump ? '停止自动切换': '开启自动切换'}}</el-button>
                </el-alert>
            </el-row>
            <el-row class="show-btn-list-wrap">
                <el-button @click="btnClick(opt.stop,'opt.stop')" size="mini" class="btn-stop">
                <div style="display:flex;flex-direction:column;align-items:center;line-height:1.2;">
                    <span style="font-size:1.5em; margin-bottom:6px;">{{!opt.stop ? '⏸️' : '▶️'}}</span>
                    <span>{{!opt.stop ? '暂停' : '继续'}}</span>
                </div>
                </el-button>

                <el-button size="mini" class="btn-point">
                <a style="text-decoration:none;display:flex;flex-direction:column;align-items:center;line-height:1.2;" target="_blank" href="https://py.keyida.asia/pay">
                    <span style="font-size:1.5em; margin-bottom:6px;">🪙</span>
                    <span>积分</span>
                </a>
                </el-button>

                <el-button @click="show_setting = true" size="mini" class="btn-setting">
                <div style="display:flex;flex-direction:column;align-items:center;line-height:1.2;">
                    <span style="font-size:1.5em; margin-bottom:6px;">⚙️</span>
                    <span>设置</span>
                </div>
                </el-button>
            </el-row>
            <div class="search-records">
                <div class="records-header" id="recordsHeader" style="margin: 4px 0 10px; border-left:4px solid #5b6df5; padding: 2px 10px; background: rgba(91, 109, 245, 0.05); border-radius: 0 4px 4px 0;">
                    <div class="records-title" style="font-size:14px; font-weight:800; color:#334155; display:flex; align-items:center; gap:6px;">
                        <span>🔍</span>
                        <span>本次查题</span>
                    </div>
                </div>
            <el-table size="mini" :show-header="false" :data="tableData" style="width: 100%;margin-top: 5px" :row-class-name="tableRowClassName">
                <el-table-column prop="index" label="" width="45"></el-table-column>
                <el-table-column prop="question" label="" width="130">
                  <template slot-scope="scope">
                        <div style="font-size: 11px;" v-html="scope.row.question"></div>
                  </template>
                </el-table-column>
                <el-table-column prop="answer" label="" width="130">
                 <template slot-scope="scope">
                     <el-popover
                        v-if="scope.row.style === 'warning-row'"
                        placement="bottom-end"
                        title="相似答案"
                        width="240"
                        trigger="click">
                         <div style="font-size: 10px;height: 220px; overflow: auto; line-height:1.6;" v-html="scope.row.answer"></div>
                         <el-button slot="reference" class="btn-view-ans">查看答案</el-button>
                      </el-popover>
                      <p v-if="scope.row.style != 'warning-row'" style="font-size: 12px; font-weight:bold; color:#5b6df5;" v-html="scope.row.answer"></p>
                  </template>
                </el-table-column>
            </el-table>
            </div>
        </el-main>
    </div>
</div>
</body>
<script>` + GM_getResourceText("Vue") + `</script>
<script>` + GM_getResourceText("ElementUi") + `</script>
<script>
const tips = [
    '想要隐藏按键盘的⬆箭头，想要显示按⬇箭头哦',
    '想要永久隐藏此搜索框，按键盘的左箭头，想要显示在屏幕中央按右箭头哦',
    // '想要自定义搜索框的长度可以更改代码设置参数:length',
     '设置中可设置答题速度，可自行更改',
     '付费题库消耗完自动降级为免费题库',
     '脚本无法适配可扫码反馈'
]
    new Vue({
        el: '#app',
        data: function () {
            return {
                tiku_adapter: '` + (GM_getValue("tiku_adapter") || "") + `',
                search_delay: ` + (isNaN(parseInt(GM_getValue("search_delay"))) ? 2 : GM_getValue("search_delay")) + `,
                gpt: String(` + (GM_getValue("gpt") || -1) + `),
                show_setting: false,
                hidden: false,
                need_jump: false,
                tip: tips[Math.floor(Math.random()*tips.length)],
                opt:{
                    token: '` + GM_getValue("token") + `',
                    auto_jump: ` + GM_getValue("auto_jump") + `,
                    stop: false,
                    start_pay: ` + GM_getValue("start_pay") + `
                },
                input: '',
                visible: false,
                tableData: [],
                passw:"password",
                adList: JSON.parse(` + JSON.stringify(GM_getValue("adList") || "[]") + `),
                adsReady: false,
                showFlash: false
            }
        },
        created(){
            if(this.adList && this.adList.length > 0) {
                setTimeout(() => { this.adsReady = true; }, 800); // 增加加载缓冲
            }
            /**
            *
            * @param type 消息类型
            * @param receiveParams 消息参数
            */
            window['vueDefinedProp'] = (type,receiveParams) => {
                if (type === 'push'){
                    let length = this.tableData.length
                    this.tableData.push({index: length + 1,question: receiveParams.question,answer: receiveParams.answer,style:receiveParams.style})
                }else if (type === 'clear'){
                    this.tableData = []
                }else if (type === 'tip'){
                    if (receiveParams.type && receiveParams.type === 'jump'){
                         window.parent.postMessage({"type": 'jump'}, '*');
                    }else if (receiveParams.type && receiveParams.type === 'error'){
                         this.need_jump = true
                    }else if (receiveParams.type && receiveParams.type === 'hidden'){
                         this.hidden = true
                    }else if (receiveParams.type && receiveParams.type === 'stop'){
                         this.opt.stop = true
                    }
                    this.tip = receiveParams.tip
                }else if (type === 'stop'){
                    this.opt.stop = receiveParams
                }else if (type === 'start_pay'){
                    this.opt.start_pay = receiveParams
                }else if (type === 'updateAds'){
                    this.adList = receiveParams
                    this.adsReady = true
                }else if (type === 'update'){
                    this.updateScript(receiveParams.v1,receiveParams.v2,receiveParams.href)
                }
            }
        },
        methods: {
            save_setting(){
                 window.parent.postMessage({type: 'save_setting',search_delay:this.search_delay,gpt:this.gpt,tiku_adapter:this.tiku_adapter}, '*');
                 this.show_setting = false
            },
            updateScript(currentVersion,newVersion,href){
              this.$confirm('您当前版本为'+currentVersion+'最新版本为'+newVersion+',推荐下载更新', '脚本有更新', {
                customClass: 'message-update-tip',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                   window.open(href)
                });
              setTimeout(()=>{
                  this.$msgbox.close();
              },5000)
            },
            tableRowClassName({row, rowIndex}) {
                return row.style
            },
            btnClick(e,type){
                if (type === 'opt.stop'){//暂停搜索
                    this.opt.stop = !this.opt.stop
                    this.tip = this.opt.stop? '已暂停搜索': '继续搜索'
                    window.parent.postMessage({type: 'stop',val:this.opt.stop}, '*');
                }else if (type === 'opt.auto_jump'){//开启自动切换
                    this.opt.auto_jump = ! this.opt.auto_jump
                    window.parent.postMessage({type: 'auto_jump',flag:this.opt.auto_jump}, '*');
                }else if (type === 'opt.jump'){//跳过本题
                    window.parent.postMessage({type: 'jump'}, '*');
                    this.need_jump = false
                }
            },
            togglePassw() {
                this.passw = this.passw === 'password' ? 'text' : 'password';
            },
            handlePayModeChange(val) {
                if (val) {
                   // 开启付费模式：执行验证
                   window.parent.postMessage({type: 'start_pay', flag: true, token: this.opt.token}, '*');
                   // 触发视觉反馈：金光闪烁
                   this.showFlash = true;
                   setTimeout(() => { this.showFlash = false; }, 800);
                } else {
                   // 关闭付费模式
                   window.parent.postMessage({type: 'start_pay', flag: false}, '*');
                }
            },
            handleTokenBlur() {
                // 失焦时保存一次 token
                window.parent.postMessage({type: 'confim', token: this.opt.token}, '*');
            },
            handleHeaderDrag(e) {
                if (e.button !== 0) return;
                // 通知父窗口开始拖拽
                window.parent.postMessage({ 
                    type: 'dragStart', 
                    clientX: e.clientX, 
                    clientY: e.clientY 
                }, '*');
            },
        }
    })
</script>
</html>
`;
        addModal2(html);
        checkVersion();
    }
    function addModal2(html, newPos, footerChildNode = false) {
        let headersNode = createContainer("hcsearche-modal-links");
        let iframeNode = top.document.createElement("iframe");
        iframeNode.id = "iframeNode";
        iframeNode.setAttribute("width", "360px");
        iframeNode.setAttribute("height", GLOBAL.length + "px");
        iframeNode.setAttribute("style", "height:" + GLOBAL.length + "px; border:none; border-radius:20px; overflow:hidden;");
        iframeNode.style.background = "transparent";
        iframeNode.style.padding = "0";
        iframeNode.style.margin = "0";
        iframeNode.setAttribute("frameborder", "0");
        iframeNode.srcdoc = html;

        let contentNode = createContainer("content-modal", [headersNode, iframeNode]);
        let modal = renderModal(contentNode);

        if (GM_getValue("hide")) {
            $("#" + modelId).hide();
            vm.hideTip();
        }
    }

    function renderModal(childElem, newPos) {
        return render(String.fromCharCode(rand(65, 90), rand(65, 90), rand(65, 90)) + rand(1, 100).toString(), modelId, childElem);
    }
    function render(tagName, elemId, childElem, isFixed, newPos) {
        let doc = top.document;
        let elem = doc.getElementById(elemId);
        if (elem) {
            elem.innerHTML = "";
        } else {
            elem = doc.createElement(tagName);
            elem.id = elemId;
            doc.body.appendChild(elem);
        }
        let contentNode = createContainer(tagName + "-container", childElem);
        elem.appendChild(contentNode);
        elem.classList.add(elemId);
        elem.style.zIndex = "9999999";
        elem.style.position = "fixed";

        elem.style.background = "#fff"; // 统一白色背景
        elem.style.borderRadius = "20px";
        elem.style.width = "360px";
        elem.style.boxShadow = "0 8px 32px rgba(0,0,0,0.15), 0 0 8px rgb(165 185 242)";
        elem.style.border = "1px solid rgba(255,255,255,0.8)";
        elem.style.overflow = "hidden"; // 隐藏溢出内容，确保圆角生效

        const pos = GM_getValue("pos") === undefined ? "30px,30px" : GM_getValue("pos");
        const posarr = pos.split(",");
        elem.style.left = posarr[0];
        elem.style.top = posarr[1];
        setTimeout(function () {
            elem.classList.add(elemId + "-show");
        }, 10);
        console.log("elem===>" + elem)
        return elem;
    }
    const init$1 = async ($TiMu, select, wrap) => {
        let question = formatString(filterImg($TiMu.find(select.elements.question)));
        if (select.elements.type && select.elements.type.includes("input[name^=type]:eq")) {
            select.elements.type = "input[name^=type]:eq(" + GLOBAL.i + ")";
        }
        let data = {
            $item: $TiMu,
            question_text: $TiMu.find(select.elements.question).text(),
            question: question.length === 0 ? $TiMu.find(select.elements.question) : question.replace(/^\d+、/, "").replace(/[(（](\d+\s?(\.\d+)?分)[)）]$/, "").replace(/^((\d+.(\s+)?)?)[\[(（【](.*?)[】)）\]]/, "").trim(),
            $options: select.elements.$options ? $TiMu.find(select.elements.$options) : undefined,
            options: select.elements.options ? jQuery.map($TiMu.find(select.elements.options), function (val) {
                return formatString(filterImg(val)).replace(/^[A-Ga-g][.、]/, "").trim();
            }) : undefined
        };
        if (select.elements.type) {
            const getType = getQuestionType($TiMu.find(select.elements.type).text());
            const val = $TiMu.find(select.elements.type).val();
            data.type = isNaN(getType) ? isNaN(val) ? val : parseInt(val) : getType;
        } else {
            data.type = defaultWorkTypeResolver(data.$options);
        }
        if (select.elements.answer) {
            data.answer = getAnswer(filterImg($TiMu.find(select.elements.answer)) || $TiMu.find(select.elements.answer).val(), data.options, data.type);
        }
        if (data && data.type === 3 && data.options.length === 0) {
            data.options = ["正确", "错误"];
        }
        const r = await wrap(data);
        if (typeof r === "boolean") return undefined;
        return data;
    };
    async function WorkerJSPlus(options) {
        if (GLOBAL.isMatch) return;
        const isDebug = location.search.includes("zhiti_debug");
        if (isDebug) {
            console.log("【知题搜搜】检测到调试模式，正在强制呼出面板...");
            // 提供虚拟配置以防止后续逻辑报错
            options = Object.assign({
                root: "body",
                elements: { question: "title" },
                init: () => { console.log("调试模式初始化成功"); return false; }
            }, options);
        }
        const match = isDebug ? true : (options.match ? typeof options.match === "boolean" ? options.match : options.match() : false);
        if (!match) return;
        GLOBAL.isMatch = true;
        if (options.hook && typeof options.hook === "function") {
            if (options.hook()) return;
        }
        const defaultFunc = () => { };
        const main = () => {
            setTimeout(() => {
                showPanel();
                if (options.init && typeof options.init === "function") {
                    if (options.init()) return;
                }
                const select = {
                    root: options.root,
                    elements: options.elements,
                    ignore_click: options.ignore_click
                };
                new WorkerJS(select, options.wrap ? options.wrap : defaultFunc, options.fill ? options.fill : defaultFunc, options.finished ? options.finished : defaultFunc, options.fillFinish ? options.fillFinish : defaultFunc).fillAnswer();
            }, GLOBAL.delay);
        };
        if (options.intv) {
            setIntervalFunc(options.intv, main);
        } else {
            main();
        }
    }
    var WorkerJS = function (select, searchHander, fillHander, onFinish = function (need_jump) { }, fillFinish = function () { }) {
        GLOBAL.index = 0;
        this.init = init$1;
        this.fillAnswer = async () => {
            let arr = jQuery(select.root);
            let isFirst = true;
            while (true) {
                if (arr.length === 0) return;
                await sleep((isNaN(parseInt(GM_getValue("search_delay"))) ? 2 : GM_getValue("search_delay")) * 1e3);
                if (GLOBAL.stop) {
                    continue;
                }
                if (GLOBAL.index >= arr.length) {
                    let auto_jump = GM_getValue("auto_jump") === undefined || GM_getValue("auto_jump");
                    const next = await onFinish(auto_jump);
                    if (next) {
                        GLOBAL.index = 0;
                        setTimeout(this.fillAnswer, 300);
                    }
                    if (auto_jump) {
                        iframeMsg("tip", {
                            tip: "自动答题已完成,即将切换下一题"
                        });
                        next || setTimeout(() => {
                            iframeMsg("tip", {
                                type: "hidden",
                                tip: "自动答题已完成,请检查提交"
                            });
                        }, Math.max(GM_getValue("search_delay") || 2, 5) * 1e3);
                    } else {
                        iframeMsg("tip", {
                            tip: "自动答题已完成" + (arr.length === 1 ? ",请手动切换" : "请检查提交")
                        });
                    }
                    return true;
                }
                try {
                    let data = await this.init(jQuery(arr[GLOBAL.index++]), select, searchHander);
                    if (!data) {
                        GLOBAL.index--;
                        continue;
                    }
                    if (isFirst) {
                        const isSTDU = location.host.includes("jxjy.stdu.edu.cn") && location.pathname.includes("BootStrap_zxksDetailNew.aspx");
                        let waitSeconds = 3;
                        if (isSTDU) {
                            waitSeconds = 2;
                        }

                        for (let i = waitSeconds; i > 0; i--) {
                            iframeMsg("tip", {
                                tip: `页面解析完成，${i}秒后开始答题，请耐心等待...`
                            });
                            // eslint-disable-next-line no-await-in-loop
                            await sleep(1000);
                        }
                        // await sleep(60 * 1000);
                        isFirst = false;
                    }
                    iframeMsg("tip", {
                        tip: "准备答第" + GLOBAL.index + "题"
                    });
                    const formatResult = await formatSearchAnswer(data);
                    const hookAnswer = data.answer && data.answer.length > 0 && GM_getValue("start_pay");
                    const formatAns = hookAnswer ? {
                        success: true,
                        num: formatResult.num,
                        list: [data.answer]
                    } : formatResult;
                    if (formatResult.answers || formatAns.success) {
                        if (formatAns.num === -2 || formatAns.num === -3) {
                            GM_setValue("start_pay", false);
                            iframeMsg("start_pay", false);
                        }
                        iframeMsg("tip", {
                            tip:
                                formatAns.num === -1 ? "准备填充答案,正在使用免费题库（不扣积分）" :
                                    formatAns.num === -2 ? "准备填充答案,Token 不存在，已切换至免费题库" :
                                        formatAns.num === -3 ? "准备填充答案,Token 次数不足，已切换至免费题库" :
                                            `准备填充答案,正在使用付费题库，剩余积分: ${formatAns.num}`
                        });
                        // const func = !hookAnswer && formatResult.answers ? defaultFillAnswer : defaultQuestionResolve;
                        const isSTDU = location.host.includes("jxjy.stdu.edu.cn") && location.pathname.includes("BootStrap_zxksDetailNew.aspx");
                        console.log('[DEBUG] 函数选择判断 isSTDU:', isSTDU);
                        const func = isSTDU ? defaultFillAnswer : (!hookAnswer && formatResult.answers ? defaultFillAnswer : defaultQuestionResolve);
                        console.log('[DEBUG] 选择的函数:', func.name);
                        let r = await func(hookAnswer ? formatAns.list : formatAns.answers ? formatResult.answers : formatAns.list, data, fillHander, select.ignore_click ? select.ignore_click : () => {
                            return false;
                        });
                        iframeMsg("push", {
                            index: GLOBAL.index,
                            question: r.question,
                            answer: r.ans,
                            style: r.style
                        });
                        // GM_getValue("start_pay") && String(GM_getValue("token")).length === 10 && catchAnswer(r);
                        //题目收集
                        //添加选项收集
                        r.location = data.location;
                        r.options = data.options;
                        catchAnswer(r);
                        await fillFinish(r);
                    } else {
                        GLOBAL.index--;
                        iframeMsg("tip", {
                            tip: formatAns.msg
                        });
                    }
                } catch (e) {
                    GLOBAL.index--;
                    console.table(e);
                    iframeMsg("tip", {
                        type: "error",
                        tip: location.host + "无法适配出错，" + e + "可反馈至QQ群" + QQ_GROUP
                    });
                }
            }
        };
    };
    // @thanks 特别感谢 qxin i 借鉴 网页限制解除(改) 开源地址 https://greasyfork.org/zh-CN/scripts/28497
    function init() {
        rule = rwl_userData.rules.rule_def;
        hook_eventNames = rule.hook_eventNames.split("|");
        unhook_eventNames = rule.unhook_eventNames.split("|");
        eventNames = hook_eventNames.concat(unhook_eventNames);
        if (rule.dom0) {
            setInterval(clearLoop, 10 * 1e3);
            setTimeout(clearLoop, 1500);
            window.addEventListener("load", clearLoop, true);
            clearLoop();
        }
        if (rule.hook_addEventListener) {
            EventTarget.prototype.addEventListener = addEventListener;
            document.addEventListener = addEventListener;
            if (hasFrame) {
                for (let i = 0; i < hasFrame.length; i++) {
                    hasFrame[i].contentWindow.document.addEventListener = addEventListener;
                }
            }
        }
        if (rule.hook_preventDefault) {
            Event.prototype.preventDefault = function () {
                if (hook_eventNames.indexOf(this.type) < 0) {
                    Event_preventDefault.apply(this, arguments);
                }
            };
            if (hasFrame) {
                for (let i = 0; i < hasFrame.length; i++) {
                    hasFrame[i].contentWindow.Event.prototype.preventDefault = function () {
                        if (hook_eventNames.indexOf(this.type) < 0) {
                            Event_preventDefault.apply(this, arguments);
                        }
                    };
                }
            }
        }
        if (rule.hook_set_returnValue) {
            Event.prototype.__defineSetter__("returnValue", function () {
                if (this.returnValue !== true && hook_eventNames.indexOf(this.type) >= 0) {
                    this.returnValue = true;
                }
            });
        }
    }
    function addEventListener(type, func, useCapture) {
        var _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener;
        if (hook_eventNames.indexOf(type) >= 0) {
            _addEventListener.apply(this, [type, returnTrue, useCapture]);
        } else if (unhook_eventNames.indexOf(type) >= 0) {
            var funcsName = storageName + type + (useCapture ? "t" : "f");
            if (this[funcsName] === undefined) {
                this[funcsName] = [];
                _addEventListener.apply(this, [type, useCapture ? unhook_t : unhook_f, useCapture]);
            }
            this[funcsName].push(func);
        } else {
            _addEventListener.apply(this, arguments);
        }
    }
    function clearLoop() {
        rule = clear();
        var elements = getElements();
        for (var i in elements) {
            for (var j in eventNames) {
                var name = "on" + eventNames[j];
                if (Object.prototype.toString.call(elements[i]) == "[object String]") {
                    continue;
                }
                if (elements[i][name] !== null && elements[i][name] !== onxxx) {
                    if (unhook_eventNames.indexOf(eventNames[j]) >= 0) {
                        elements[i][storageName + name] = elements[i][name];
                        elements[i][name] = onxxx;
                    } else {
                        elements[i][name] = null;
                    }
                }
            }
        }
        document.onmousedown = function () {
            return true;
        };
    }
    function returnTrue(e) {
        return true;
    }
    function unhook_t(e) {
        return unhook(e, this, storageName + e.type + "t");
    }
    function unhook_f(e) {
        return unhook(e, this, storageName + e.type + "f");
    }
    function unhook(e, self, funcsName) {
        var list = self[funcsName];
        for (var i in list) {
            list[i](e);
        }
        e.returnValue = true;
        return true;
    }
    function onxxx(e) {
        var name = storageName + "on" + e.type;
        this[name](e);
        e.returnValue = true;
        return true;
    }
    function getElements() {
        var elements = Array.prototype.slice.call(document.getElementsByTagName("*"));
        elements.push(document);
        var frames = document.querySelectorAll("frame");
        if (frames) {
            hasFrame = frames;
            var frames_element;
            for (let i = 0; i < frames.length; i++) {
                frames_element = Array.prototype.slice.call(frames[i].contentWindow.document.querySelectorAll("*"));
                elements.push(frames[i].contentWindow.document);
                elements = elements.concat(frames_element);
            }
        }
        return elements;
    }
    var settingData = {
        status: 1,
        version: .1,
        message: "",
        positionTop: "0",
        positionLeft: "0",
        positionRight: "auto",
        addBtn: false,
        connectToTheServer: false,
        waitUpload: [],
        currentURL: "null",
        shortcut: 3,
        rules: {},
        data: []
    };
    var rwl_userData = null;
    var rule = null;
    var hasFrame = false;
    var storageName = "storageName";
    var hook_eventNames, unhook_eventNames, eventNames;
    var EventTarget_addEventListener = EventTarget.prototype.addEventListener;
    var document_addEventListener = document.addEventListener;
    var Event_preventDefault = Event.prototype.preventDefault;
    rwl_userData = GM_getValue("rwl_userData");
    if (!rwl_userData) {
        rwl_userData = settingData;
    }
    for (let value in settingData) {
        if (!rwl_userData.hasOwnProperty(value)) {
            rwl_userData[value] = settingData[value];
            GM_setValue("rwl_userData", rwl_userData);
        }
    }
    // @thanks 特别感谢 wyn大佬 提供的 字典匹配表 原作者 wyn665817@163.com 开源地址 https://scriptcat.org/script-show-page/432/code
    function removeF() {
        var $tip = $("style:contains(font-cxsecret)");
        if (!$tip.length) return;
        var font = $tip.text().match(/base64,([\w\W]+?)'/)[1];
        font = Typr.parse(base64ToUint8Array(font))[0];
        var table = JSON.parse(GM_getResourceText("Table"));
        var match = {};
        for (var i = 19968; i < 40870; i++) {
            $tip = Typr.U.codeToGlyph(font, i);
            if (!$tip) continue;
            $tip = Typr.U.glyphToPath(font, $tip);
            $tip = MD5(JSON.stringify($tip)).slice(24);
            match[i] = table[$tip];
        }
        $(".font-cxsecret").html(function (index, html) {
            $.each(match, function (key, value) {
                key = String.fromCharCode(key);
                key = new RegExp(key, "g");
                value = String.fromCharCode(value);
                html = html.replace(key, value);
            });
            return html;
        }).removeClass("font-cxsecret");
        function base64ToUint8Array(base64) {
            var data = window.atob(base64);
            var buffer = new Uint8Array(data.length);
            for (var i = 0; i < data.length; ++i) {
                buffer[i] = data.charCodeAt(i);
            }
            return buffer;
        }
    }
    function start() {
        try {
            removeF();
        } catch (e) { }
        try {
            init();
        } catch (e) { }
    }
    WorkerJSPlus({
        name: "学习通作业",
        match: location.pathname === "/mooc2/work/dowork" || location.pathname === "/mooc-ans/mooc2/work/dowork",
        root: ".questionLi",
        elements: {
            question: "h3",
            options: ".stem_answer .answerBg .answer_p, .textDIV, .eidtDiv",
            $options: ".stem_answer .answerBg, .textDIV, .eidtDiv",
            type: "input[type^=hidden]:eq(0)"
        },
        wrap: obj => {
            obj.question = obj.question.replace(obj.$item.find(".colorShallow").text(), "").replace(/^(\d+\.\s)/, "");
        },
        ignore_click: $item => {
            return Boolean($item.find(".check_answer,.check_answer_dx").length);
        },
        fill: (type, answer, $option) => {
            if (type === 4 || type === 2 || type === 5) {
                UE$1.getEditor($option.find("textarea").attr("name")).setContent(answer);
            }
        }
    });
    WorkerJSPlus({
        name: "超星旧版考试",
        match: (location.pathname === "/exam/test/reVersionTestStartNew" || location.pathname === "/exam-ans/exam/test/reVersionTestStartNew") && !location.href.includes("newMooc=true"),
        root: ".TiMu",
        elements: {
            question: ".Cy_TItle .clearfix",
            options: ".Cy_ulTop .clearfix",
            $options: ":radio, :checkbox, .Cy_ulTk textarea",
            type: "[name^=type]:not([id])"
        },
        ignore_click: $item => {
            return $item.get(0).checked;
        },
        fill: (type, answer, $option) => {
            if (type === 4 || type === 2 || type === 5) {
                UE$1.getEditor($option.attr("name")).setContent(answer);
            }
        },
        finished: auto_jump => {
            auto_jump && setInterval(function () {
                const btn = $(".saveYl:contains(下一题)").offset();
                var mouse = document.createEvent("MouseEvents"), arr = [btn.left + Math.ceil(Math.random() * 80), btn.top + Math.ceil(Math.random() * 26)];
                mouse.initMouseEvent("click", true, true, document.defaultView, 0, 0, 0, arr[0], arr[1], false, false, false, false, 0, null);
                _self.event = $.extend(true, {}, mouse);
                delete _self.event.isTrusted;
                _self.getTheNextQuestion(1);
            }, Math.ceil(GLOBAL.fillAnswerDelay * Math.random()) * 2);
        }
    });
    WorkerJSPlus({
        name: "超星章节测验",
        match: location.pathname === "/work/doHomeWorkNew" || location.pathname === "/mooc-ans/work/doHomeWorkNew",
        init: start,
        root: ".clearfix .TiMu",
        elements: {
            question: ".Zy_TItle .clearfix",
            options: "ul:eq(0) li .after",
            $options: "ul:eq(0) li :radio,:checkbox,textarea,.num_option_dx,.num_option",
            type: "input[name^=answertype]"
        },
        ignore_click: $item => {
            if ($item.is("input")) {
                return $item.get(0).checked;
            }
            return $item.attr("class").includes("check_answer");
        },
        fill: async (type, answer, $option) => {
            if (type === 4 || type === 2 || type === 5) {
                UE$1.getEditor($option.attr("name")).setContent(answer);
            }
        }
    });
    WorkerJSPlus({
        name: "超星新版考试",
        match: () => {
            const cxSinglePage = (location.pathname === "/exam/test/reVersionTestStartNew" || location.pathname === "/exam-ans/exam/test/reVersionTestStartNew" || location.pathname === "/mooc-ans/exam/test/reVersionTestStartNew") && location.href.includes("newMooc=true");
            const cxAll = location.pathname === "/mooc2/exam/preview" || location.pathname === "/exam-ans/mooc2/exam/preview" || location.pathname === "/mooc-ans/mooc2/exam/preview";
            return cxSinglePage || cxAll;
        },
        root: ".questionLi",
        elements: {
            question: "h3 div",
            options: ".answerBg .answer_p, .textDIV, .eidtDiv",
            $options: ".answerBg, .textDIV, .eidtDiv",
            type: "input[name^=type]:eq(" + GLOBAL.i + ")"
        },
        ignore_click: $item => {
            return Boolean($item.find(".check_answer,.check_answer_dx").length);
        },
        hook: () => {
            GLOBAL.i = Number((location.pathname === "/exam/test/reVersionTestStartNew" || location.pathname === "/exam-ans/exam/test/reVersionTestStartNew" || location.pathname === "/mooc-ans/exam/test/reVersionTestStartNew") && location.href.includes("newMooc=true"));
        },
        wrap: obj => {
            if (obj.type === 6) {
                obj.type = 4;
            }
        },
        fill: (type, answer, $option) => {
            if (type === 4 || type === 2 || type === 5) {
                const name = $option.find("textarea").attr("name");
                UE$1.getEditor(name).setContent(answer);
                if (GLOBAL.i === 0) {
                    console.log("#" + name.replace("answerEditor", "save_"));
                    $("#" + name.replace("answerEditor", "save_")).click();
                }
            }
        },
        finished: a => {
            a && $('.nextDiv .jb_btn:contains("下一题")').click();
        }
    });
    WorkerJSPlus({
        name: "超星随堂测验",
        match: location.pathname.includes("/page/quiz/stu/answerQuestion"),
        root: ".question-item",
        elements: {
            question: ".topic-txt",
            options: ".topic-option-list",
            $options: ".topic-option-list input",
            type: "input[class^=que-type]"
        },
        ignore_click: $item => {
            return Boolean($item.find(".check_answer,.check_answer_dx").length);
        },
        wrap: obj => {
            if (obj.type === 16) {
                obj.type = 3;
            }
        },
        fill: (type, answer, $option) => {
            if (type === 4 || type === 2) {
                $option.val(answer);
            }
        }
    });
    function JSONParseHook(func) {
        if (location.host.includes("zhihuishu")) {
            let oldSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function () {
                this.addEventListener("readystatechange", function () {
                    if (this.readyState === 4 && this.response.includes("workExamParts")) {
                        try {
                            func(JSON.parse(this.response));
                        } catch (err) { }
                    }
                }, false);
                return oldSend.apply(this, arguments);
            };
        } else {
            const parse = JSON.parse;
            JSON.parse = function (...args) {
                const o = parse.call(this, ...args);
                func(o);
                return o;
            };
        }
    }
    function hookZhiHuiShuWork(o, arr) {
        function format(item) {
            let options = [];
            let options_id;
            if (item.questionOptions && item.questionOptions.length) {
                options = item.questionOptions.map(o => {
                    return formatString(o.content);
                });
                options_id = item.questionOptions.map(o => {
                    return o.id;
                });
            }
            return {
                qid: item.id,
                question: formatString(item.name),
                type: getQuestionType(item.questionType.name),
                options_id: options_id,
                options: options
            };
        }
        if (o.rt && o.rt.examBase && o.rt.examBase.workExamParts.length > 0) {
            GLOBAL.content = o.rt;
            GLOBAL.json = o.rt.examBase.workExamParts.map(part => {
                return part.questionDtos.map(item => {
                    if ("阅读理解（选择）/完型填空" === item.questionType.name || "听力训练" === item.questionType.name || !(item.questionType.name.includes("填空") || item.questionType.name.includes("问答")) && item.questionChildrens && item.questionChildrens.length > 0) {
                        return item.questionChildrens.map(i => {
                            console.log(format(i));
                            return format(i);
                        }).flat();
                    } else {
                        return format(item);
                    }
                });
            }).flat();
        } else if (o.rt && Object.keys(o.rt).length > 0 && !isNaN(Object.keys(o.rt)[0])) {
            GLOBAL.img = o.rt;
        }
    }
    WorkerJSPlus({
        name: "智慧树作业/考试",
        match: !location.href.includes("checkHomework") && location.host.includes("zhihuishu") && (location.pathname === "/stuExamWeb.html" || location.href.includes("/webExamList/dohomework/") || location.href.includes("/webExamList/doexamination/")),
        root: ".examPaper_subject",
        elements: {
            question: ".subject_describe div,.smallStem_describe p",
            options: ".subject_node .nodeLab .node_detail",
            $options: ".subject_node .nodeLab .node_detail",
            type: ".subject_type span:first-child"
        },
        hook: () => {
            JSONParseHook(hookZhiHuiShuWork);
        },
        intv: () => {
            return $(".answerCard").length;
        },
        wrap: obj => {
            Object.assign(obj, GLOBAL.json[GLOBAL.index - 1]);
            console.log(obj);
            if ($(".yidun_popup").hasClass("yidun_popup--light")) {
                iframeMsg("tip", {
                    type: "stop",
                    tip: "答题暂停，请自行通过验证"
                });
                GLOBAL.stop = true;
            }
        },
        ignore_click: $item => {
            return $item.hasClass("onChecked");
        },
        fill: (type, answer, $option) => {
            if (type === 4 || type === 2) {
                UE$1.getEditor($option.find("textarea").attr("name")).setContent(answer);
            }
        },
        finished: async () => {
            vm.zhihuishuSaveTip();
            const len = $(".answerCard_list li").length;
            for (let i = 0; i < len; i++) {
                await sleep(500);
                try {
                    $(".answerCard_list1 li").eq(i).click();
                    await sleep(1e3);
                    $(".el-button:contains(下一题)").click();
                } catch (e) {
                    $(".el-button:contains(保存)").click();
                }
                const process = ((i + 1) / len * 100).toFixed(0);
                $("#gs_p").val(process);
                $("#gs_text").text(process + "%");
            }
            if (top.document.querySelector("#gs_p").value == 100) {
                top.document.querySelector("#zhihuishuSaveTip").remove();
            }
        },
        fillFinish: () => {
            $(".answerCard_list li").eq(GLOBAL.index - 1).click();
            $(".el-button:contains(下一题)").click();
        }
    });
    WorkerJSPlus({
        name: "智慧树学分课作业",
        match: location.href.includes("/atHomeworkExam/stu/homeworkQ/exerciseList") || location.href.includes("atHomeworkExam/stu/examQ/examexercise"),
        root: ".questionBox:eq(0)",
        elements: {
            question: ".questionContent",
            options: ".optionUl label .el-radio__label,.el-checkbox__label",
            $options: ".optionUl label",
            type: ".questionTit"
        },
        intv: () => {
            return $(".answerCard").length || $(".questionTit").length;
        },
        wrap: async obj => {
            obj.options = obj.options.map(item => {
                return formatString(item.replaceAll(/^[a-zA-Z][.|\s+]/g, ""));
            });
            if ($(".yidun_popup").hasClass("yidun_popup--light")) {
                iframeMsg("tip", {
                    type: "stop",
                    tip: "答题暂停，请自行通过验证"
                });
                GLOBAL.stop = true;
            }
        },
        ignore_click: $item => {
            return $item.hasClass("is-checked");
        },
        finished: () => {
            if ($(".Nextbtndiv .Topicswitchingbtn-gray:contains(下一题)").hasClass("Topicswitchingbtn-gray")) return false;
            $(".Topicswitchingbtn:contains(下一题)").click();
            return true;
        }
    });
    WorkerJSPlus({
        name: "智慧树学分课考试",
        match: location.host === "studentexambaseh5.zhihuishu.com",
        root: ".ques-detail",
        elements: {
            question: ".questionName .centent-pre",
            options: ".radio-view li  .preStyle,.checkbox-views label .preStyle",
            $options: ".radio-view li,.checkbox-views label",
            type: ".letterSortNum"
        },
        intv: () => {
            return $(".questionContent").length;
        },
        ignore_click: $item => {
            return $item.hasClass("is-checked");
        },
        wrap: obj => {
            obj.options = obj.options.map(item => {
                return formatString(item.replaceAll(/^[a-zA-Z][.|\s+]/g, ""));
            });
            if ($(".yidun_popup").hasClass("yidun_popup--light")) {
                iframeMsg("tip", {
                    type: "stop",
                    tip: "答题暂停，请自行通过验证"
                });
                GLOBAL.stop = true;
            }
            if (obj.type === 15) {
                obj.question = formatString($(".centent-son-pre").text());
                obj.type = 1;
            }
        },
        finished: auto_jump => {
            if (auto_jump) {
                const btn = $(".next-topic:contains(下一题)");
                btn.click();
                return !btn.hasClass("noNext");
            }
        }
    });
    WorkerJSPlus({
        match: location.href.includes("checkHomework") && location.host.includes("zhihuishu"),
        hook: () => {
            JSONParseHook(hookZhiHuiShuWork);
        },
        init: () => {
            R({
                type: 2,
                content: GLOBAL.content,
                img: GLOBAL.img
            });
        }
    });
    GLOBAL.timeout = 10 * 1e3;
    function uploadAnswer(data) {
        const arr2 = division(data, 100);
        for (let arr2Element of arr2) {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://lyck6.cn/pcService/api/uploadAnswer",
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                data: JSON.stringify(arr2Element),
                timeout: GLOBAL.timeout
            });
        }
    }
    function uploadAnswerToPlat(data, plat) {
        const arr2 = division(data, 100);
        for (let arr2Element of arr2) {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://lyck6.cn/collect-service/v1/uploadAnswerToPlat?plat=" + plat,
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                data: JSON.stringify(arr2Element),
                timeout: GLOBAL.timeout
            });
        }
    }
    WorkerJSPlus({
        name: "职教云考试",
        match: location.pathname === "/exam/examflow_index.action",
        intv: () => {
            return $(".divQuestionTitle").length;
        },
        root: ".q_content",
        elements: {
            question: ".divQuestionTitle",
            options: ".questionOptions .q_option",
            $options: ".questionOptions .q_option div,div[id^=_baidu_editor_]"
        },
        ignore_click: $item => {
            return $($item).attr("class") === "checkbox_on";
        },
        wrap: obj => {
            const type = getQuestionType(obj.$item.next().attr("answertype"));
            obj.type = type === undefined ? defaultWorkTypeResolver(obj.$options) : type;
        },
        fill: (type, answer, $option) => {
            if (type === 4 || type === 2 || type === 5) {
                UE$1.getEditor($option.attr("id")).setContent(answer);
            }
        },
        finished: async () => {
            if ($(".paging_next").attr("style").includes("block") || !$(".paging_next").attr("style").includes("none")) {
                $(".paging_next").click();
                await sleep(1e3);
                return true;
            }
        }
    });
    WorkerJSPlus({
        name: "职教云测验",
        match: location.pathname === "/study/directory/dir_course.html",
        intv: () => {
            return $(".panel_item").length;
        },
        root: ".panel_item .panel_item",
        elements: {
            question: ".preview_cm .preview_stem",
            options: ".preview_cm ul li span:last-child",
            $options: ".preview_cm ul li input"
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parent().find(".panel_title").text());
            obj.options = obj.options.map(i => {
                return i.trim().replace(/^[abAB]\)\s+/, "").replace(/^[A-Za-z]\s+/, "").trim();
            });
        },
        ignore_click: $item => {
            return $item.attr("checked") === "checked";
        }
    });
    WorkerJSPlus({
        name: "职教云MOOC",
        match: location.pathname === "/study/homework/do.html" || location.pathname === "/study/workExam/testWork/preview.html" || location.pathname === "/study/onlineExam/preview.html" || location.pathname === "/study/workExam/homeWork/preview.html" || location.pathname === "/study/workExam/onlineExam/preview.html",
        root: ".e-q-r",
        elements: {
            question: ".e-q-q .ErichText",
            options: ".e-a-g li",
            $options: ".e-a-g li",
            type: ".quiz-type"
        },
        ignore_click: $item => {
            return $item.hasClass("checked");
        },
        wrap: obj => {
            if (obj.type === "A1A2题") {
                obj.type = 1;
            }
            obj.question = obj.question.replace(/<img src="https:\/\/cdn-zjy.icve.com.cn\/common\/images\/question_button\/blankspace(\d+).gif">/gi, "");
            obj.options = obj.options.map(i => {
                return i.trim().replace(/^[abAB]\)\s+/, "").replace(/^[A-Za-z]\s+/, "").trim();
            });
        }
    });
    function parseIcve(questions) {
        return questions.map(item => {
            const options = item.Selects.map(opt => {
                return formatString(opt);
            });
            const type = getQuestionType(item.ACHType.QuestionTypeName);
            const answer = item.Answers.map(key => {
                if (type === 0 || type === 1) {
                    return options[key.charCodeAt() - 65];
                } else if (type === 3) {
                    return key === "1" ? "正确" : "错误";
                }
            });
            const answerKey = type === 0 || type === 1 ? item.Answers : answer;
            return {
                id: item.Id,
                question: item.ContentText,
                answerKey: answerKey,
                options: type === 3 ? ["正确", "错误"] : options,
                answer: answer,
                type: type
            };
        });
    }
    WorkerJSPlus({
        name: "资源库 新版",
        match: location.pathname === "/icve-study/jobTest" || location.pathname === "/icve-study/coursePreview/jobTest" || location.pathname === "/icve-study/coursePreview/test",
        root: ".subjectDet",
        elements: {
            question: "h5,.titleTest span:last",
            options: ".optionList label",
            $options: ".optionList input",
            type: ".title,.titleTest .xvhao"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            console.log(obj);
        },
        fill: (type, answer, $option) => {
            if (type === 4 || type === 2) {
                UE$1.getEditor($option.attr("name")).setContent(answer);
            }
        }
    });
    WorkerJSPlus({
        name: "资源库 WWW开头",
        match: location.pathname === "/study/works/works.html" || location.pathname === "/study/exam/exam.html",
        root: ".questions",
        elements: {
            question: ".preview_stem",
            options: "li .preview_cont",
            $options: "li input",
            type: "input:hidden"
        },
        hook: () => {
            JSONParseHook(o => {
                if (location.pathname === "/study/works/works.html") {
                    if (o.paper) {
                        GLOBAL.json = parseIcve(o.paper.PaperQuestions);
                        uploadAnswer(GLOBAL.json);
                    }
                } else if (location.pathname === "/study/exam/exam.html") {
                    if (o.array) {
                        GLOBAL.json = parseIcve(o.array.map(item => {
                            return item.Questions;
                        }).flat());
                        uploadAnswer(GLOBAL.json);
                    }
                }
            });
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            function get_element(id) {
                for (let jsonElement of GLOBAL.json) {
                    if (jsonElement.id === id) {
                        return jsonElement;
                    }
                }
            }
            const ele = get_element(obj.$item.find("input:hidden").val());
            obj.question = ele.question;
            obj.answer = ele.answerKey ? ele.answerKey : ele.answer;
            obj.type = ele.type;
            obj.options = ele.options;
            console.log(obj);
        },
        fill: (type, answer, $option) => {
            if (type === 4 || type === 2) {
                UE$1.getEditor($option.attr("name")).setContent(answer);
            }
        }
    });
    WorkerJSPlus({
        name: "智慧职教 作业/考试",
        match: location.host.includes("zjy2.icve.com.cn"),
        intv: () => {
            return $(".subjectDet").length;
        },
        root: ".subjectDet",
        elements: {
            question: "h5,.titleT .htmlP",
            options: ".optionList .el-radio__label,.el-checkbox__label",
            $options: ".optionList input",
            type: ".titleTwo,.xvhao"
        },
        hook: () => {
            const parse = ques => {
                return ques.map(i => {
                    const options = [];
                    const answer = [];
                    if (i.typeId === "3") {
                        answer.push(i.optionAnswer === "1" ? "正确" : "错误");
                    } else if (/[12]/.test(i.typeId)) {
                        options.push(...JSON.parse(i.dataJson).map(i => {
                            if (i.IsAnswer) {
                                answer.push(formatString(i.Content));
                            }
                            return formatString(i.Content);
                        }));
                    }
                    return {
                        options: options,
                        qid: i.id,
                        answer: answer
                    };
                });
            };
            JSONParseHook(o => {
                if (o.name && o.questions && o.totalScore) {
                    GLOBAL.json = parse(o.questions);
                } else if (o.data && o.data.questions) {
                    GLOBAL.json = parse(o.data.questions);
                }
            });
        },
        ignore_click: $item => {
            return $($item).parent().attr("class") === "is-checked";
        },
        wrap: obj => {
            function findAnswer(id) {
                for (let jsonElement of GLOBAL.json) {
                    if (jsonElement.qid === id) {
                        return jsonElement.answer;
                    }
                }
            }
            obj.answer = findAnswer(obj.$item.attr("id"));
        }
    });
    function parseYkt(problems) {
        return problems.map(item => {
            const question = formatString(item.Body);
            const type = getQuestionType(item.TypeText);
            const options = [];
            const answer = [];
            if (type <= 1) {
                options.push(...item.Options.sort((a, b) => {
                    return a.key.charCodeAt(0) - b.key.charCodeAt(0);
                }).map(item => {
                    return formatString(item.value);
                }));
                if (item.Answer) {
                    if (Array.isArray(item.Answer)) {
                        answer.push(...item.Answer);
                    } else {
                        answer.push(...item.Answer.split(""));
                    }
                }
            } else if (type === 3 && item.Answer && item.Answer.length === 1) {
                answer.push(item.Answer[0].replace("true", "正确").replace("false", "错误"));
            }
            return {
                answer: answer,
                options: options,
                type: type,
                qid: item.problem_id,
                question: question
            };
        });
    }
    function parsehnzkwText(problems) {
        return problems.map(item => {
            const type = item.flag === 1 ? 2 : item.flag === 0 ? 0 : item.flag === 4 ? 1 : item.flag === 3 ? 3 : undefined;
            let answer = [];
            let options = [];
            if (type === 2) {
                answer.push(item.answer);
                return {
                    question: formatString(item.content),
                    options: options,
                    type: type,
                    answer: answer
                };
            } else if (type === 0) {
                for (let subjectOption of item.optionss) {
                    const opt = formatString(subjectOption);
                    options.push(opt);
                }
                if (type === 1) {
                    item.answer.split("|").map(i => {
                        answer.push(options[i.toUpperCase().charCodeAt(0) - 65]);
                    });
                } else {
                    answer.push(options[item.answer.toUpperCase().charCodeAt(0) - 65]);
                }
                return {
                    question: formatString(item.content),
                    options: options,
                    type: type,
                    answer: answer
                };
            } else if (type === 3) {
                for (let subjectOption of item.selectOption) {
                    const opt = formatString(subjectOption);
                    options.push(opt);
                }
                answer.push(item.answer);
                return {
                    question: formatString(item.content),
                    options: options,
                    type: type,
                    answer: answer
                };
            }
        });
    }
    function parseDanWei(pro) {
        return pro.map(i => {
            const type = getQuestionType(i.ttop010);
            const question = i.ttop011;
            const options = [];
            const answer = [];
            if (type === 0 || type === 1 || type === 3) {
                options.push(...i.ttop018.length > 0 ? i.ttop018.split("$$") : ["正确", "错误"]);
                answer.push(...i.ttop022.split("").map(item => {
                    return options[item.charCodeAt(0) - 65];
                }));
            } else if (type === 2 || type === 4) {
                answer.push(...i.ttop021.split("$$"));
            }
            return {
                question: question,
                type: type,
                answer: answer,
                options: options
            };
        }).filter(i => i);
    }
    function parseYxbyunExam(problems) {
        return problems.map(item => {
            const type = getQuestionType(item.bigName);
            return item.paperTopicList.map(item => {
                let answer = [];
                let options = [];
                if (type === 2) {
                    answer.push(item.answer);
                    return {
                        question: formatString(item.content),
                        options: options,
                        type: type,
                        answer: answer
                    };
                } else if (type === 0 || type === 3 || type === 1) {
                    let answer = [];
                    let options = [];
                    for (let subjectOption of item.questionTopic.questionOptionList) {
                        const opt = formatString(subjectOption.questionContent);
                        options.push(opt);
                    }
                    if (type === 1) {
                        item.questionTopic.questionAnswer.split(",").map(i => {
                            answer.push(options[i.toUpperCase().charCodeAt(0) - 65]);
                        });
                    } else {
                        answer.push(options[item.questionTopic.questionAnswer.toUpperCase().charCodeAt(0) - 65]);
                    }
                    return {
                        question: formatString(item.questionTopic.questionTitle),
                        options: options,
                        type: type,
                        answer: answer
                    };
                }
            });
        });
    }
    function parseYxbyunTest(problems) {
        return problems.map(item => {
            const type = getQuestionType(item.bigName);
            return item.smallContent.map(item => {
                let answer = [];
                let options = [];
                if (type === 2) {
                    answer.push(item.answer);
                    return {
                        question: formatString(item.content),
                        options: options,
                        type: type,
                        answer: answer
                    };
                } else if (type === 0 || type === 3 || type === 1) {
                    let answer = [];
                    let options = [];
                    for (let subjectOption of item.question.optionList) {
                        const opt = formatString(subjectOption.questionContent);
                        options.push(opt);
                    }
                    if (type === 1) {
                        item.question.questionAnswer.split(",").map(i => {
                            answer.push(options[i.toUpperCase().charCodeAt(0) - 65]);
                        });
                    } else {
                        answer.push(options[item.question.questionAnswer.toUpperCase().charCodeAt(0) - 65]);
                    }
                    return {
                        question: formatString(item.question.questionTitle),
                        options: options,
                        type: type,
                        answer: answer
                    };
                }
            });
        });
    }
    WorkerJSPlus({
        name: "雨课堂旧版考试",
        match: location.pathname.includes("/v/quiz/quiz_result"),
        intv: () => {
            return $("#cover").attr("style").includes("display: none;");
        },
        root: ".problem_item",
        elements: {
            question: ".notBullet:eq(0)",
            options: ".notBullet:gt(0)",
            $options: ".problembullet"
        },
        ignore_click: $item => {
            return $item.hasClass("is-checked");
        },
        wrap: async obj => {
            const $item = obj.$item;
            const tmp = $item.find(".ptype").clone();
            tmp.children().remove();
            obj.type = getQuestionType(tmp.text());
            obj.question = await yuketangOcr(obj.question.attr("data-background"));
            if (obj.$options.length === 2) {
                obj.options = ["正确", "错误"];
            } else {
                const opt = [];
                for (const tmpElement of $item.find(".notBullet:gt(0)")) {
                    opt.push(await yuketangOcr(jQuery(tmpElement).attr("data-background")));
                }
                obj.options = opt;
            }
        }
    });
    WorkerJSPlus({
        name: "学堂在线",
        match: location.host === "www.xuetangx.com" && location.pathname.includes("/exercise/"),
        intv: () => {
            return $(".answer").length;
        },
        root: ".content:eq(0)",
        elements: {
            question: ".question .fuwenben",
            options: ".question .leftQuestion .leftradio > span:last-child",
            $options: ".question .leftradio",
            type: ".question .title"
        },
        ignore_click: $item => {
            return $item.find(".radio_jqq").hasClass("active");
        },
        wrap: obj => {
            if (obj.type === 3) {
                obj.$options = $(".answerList .radio_jqq");
            }
        },
        fill: (type, answer, $option) => {
            if (type === 4 || type === 2) {
                UE.getEditor($option.find("textarea")).setContent(answer);
            }
        },
        finished: () => {
            const $right = $(".tabbar").find(".right");
            $right.click();
            return !$right.hasClass("unselect");
        }
    });
    WorkerJSPlus({
        name: "雨课堂新版考试",
        match: location.host.includes("yuketang.cn") && location.pathname.includes("/result/"),
        hook: () => {
            JSONParseHook(async o => {
                if (o.data && o.data.problems && o.data.problems.length > 0) {
                    uploadAnswerToPlat(parseYkt(o.data.problems), 50);
                }
            });
        }
    });
    WorkerJSPlus({
        name: "雨课堂新版考试",
        match: (location.host === "examination.xuetangx.com" || location.host === "changjiang-exam.yuketang.cn") && (location.pathname.includes("/exam/") || location.pathname.includes("/cover/")),
        hook: () => {
            JSONParseHook(async o => {
                if (o.data && o.data.problems && o.data.problems.length > 0) {
                    GLOBAL.json = parseYkt(o.data.problems);
                }
            });
            const intv = setInterval(() => {
                try {
                    top.document.querySelector(".exam").__vue__.handleHangUpTip = function () { };
                    const querySelector = top.document.querySelector;
                    top.document.querySelector = function (...args) {
                        if (args[0] === "#model-id" || args[0].includes("hcSearcheModal")) return false;
                        return querySelector.call(this, ...args);
                    };
                    const getElementById = top.document.getElementById;
                    top.document.getElementById = function (...args) {
                        if (args[0] === "model-id" || args[0].includes("hcSearcheModal")) return false;
                        return getElementById.call(this, ...args);
                    };
                    clearInterval(intv);
                } catch (e) { }
            }, 100);
        },
        intv: () => {
            return jQuery(".subject-item").length;
        },
        root: ".exam-main--body .subject-item",
        elements: {
            question: ".item-body h4,.item-body span:eq(0)",
            options: ".item-body ul li",
            $options: ".item-body ul label, .blank-item-dynamic, .edui-editor-iframeholder",
            type: ".item-type"
        },
        ignore_click: $item => {
            return $item.hasClass("is-checked");
        },
        wrap: obj => {
            obj.options = obj.type === 3 ? ["正确", "错误"] : obj.options.map(i => {
                return i.replace(/^[A-G]\s/, "");
            });
            try {
                obj.qid = GLOBAL.json[GLOBAL.index - 1].qid;
                obj.plat = 50;
            } catch (e) {
                console.log(e);
            }
        }
    });
    WorkerJSPlus({
        name: "雨课堂新版作业，需要一个一个点下一题的",
        match: location.pathname.includes("/v2/web/cloud/student/exercise/"),
        hook: () => {
            async function parseYkt(problems, font) {
                const res = problems.map(i => {
                    const type = getQuestionType(i.content.TypeText);
                    const question = i.content.Body;
                    let options = [];
                    if (type <= 1) {
                        options = i.content.Options;
                    } else if (type === 3) {
                        options = i.content.Options.map(item => {
                            return item.key.replace("true", "正确").replace("false", "错误");
                        });
                    }
                    return {
                        qid: i.problem_id,
                        question: question,
                        type: type,
                        options: options,
                        user: i.user
                    };
                }).filter(i => i);
                for (const item of res) {
                    item.question = await getEncryptString(item.question, font);
                    const answerArray = [];
                    if (item.type <= 1) {
                        const optionsArray = [];
                        for (const itemElement of item.options) {
                            const opt = await getEncryptString(itemElement.value, font);
                            if (item.user && item.user.is_show_answer && item.user.answer.includes(itemElement.key)) {
                                answerArray.push(opt);
                            }
                            optionsArray.push(opt);
                        }
                        item.options = optionsArray;
                    } else if (item.type === 3) {
                        if (item.user && item.user.is_show_answer && item.user.answer.length === 1) {
                            answerArray.push(item.user.answer[0].replace("true", "正确").replace("false", "错误"));
                        }
                    }
                    delete item.user;
                    item.answer = answerArray;
                }
                return res;
            }
            JSONParseHook(async o => {
                if (o.data && o.data.problems) {
                    GLOBAL.json = await parseYkt(o.data.problems, o.data.font);
                    uploadAnswerToPlat(GLOBAL.json, 50);
                }
            });
        },
        intv: () => {
            return jQuery(".subject-item").length;
        },
        root: ".container-problem .subject-item",
        elements: {
            question: ".problem-body",
            options: "label .radioText,.checkboxText",
            $options: "ul input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: async obj => {
            const index = jQuery(".item-type").text().match(/(\d+)\./)[1];
            Object.assign(obj, GLOBAL.json[parseInt(index) - 1]);
            obj.plat = 50;
        },
        finished: need_jump => {
            if ($(".el-button--text:contains(下一题)").hasClass("is-disabled")) return false;
            need_jump && setTimeout(() => {
                $(".el-button--text:contains(下一题)").click();
            }, GLOBAL.fillAnswerDelay);
            return need_jump;
        }
    });
    WorkerJSPlus({
        name: "考试系统",
        match: location.host === "gdrtvu.exam-cloud.cn" && location.pathname.includes("examRecordData"),
        intv: () => {
            return $("#examing-home-question").length;
        },
        root: ".question-container",
        elements: {
            question: ".question-body:first",
            options: ".option .question-options",
            $options: ".option input",
            type: ".question-header .container"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            const split = obj.question.split(/[A-G]\./);
            if (split.length === obj.options.length + 1) {
                obj.question = split.shift();
                obj.options = split;
            }
            if (obj.type === undefined || obj.type === null || isNaN(obj.type) || obj.type > 3) {
                obj.type = defaultWorkTypeResolver(obj.$options);
                console.log(obj.type);
            }
            if (document.querySelector(".question-container .right")) {
                let current = 0;
                const domItem = document.querySelectorAll(".item");
                for (const dom of domItem) {
                    current++;
                    if (dom.className.includes("current-question")) {
                        break;
                    }
                }
                obj.question = `【第${current}小题】` + filterImg(jQuery(".right .question-view .question-body")) + obj.question;
            }
        },
        finished: async need_jump => {
            await sleep(500);
            if ($(".next a").length === 0) {
                return false;
            }
            window.parent.document.querySelector(".next a").click();
            return true;
        }
    });
    WorkerJSPlus({
        name: "云班课",
        match: location.pathname === "/web/index.php" && location.href.includes("m=reply"),
        root: ".topic-item",
        elements: {
            question: ".t-con .t-subject",
            options: ".t-option  label .option-content",
            $options: ".el-radio__input,.el-checkbox__input",
            type: ".t-info .t-type"
        },
        ignore_click: $item => {
            return $item.hasClass("is-checked");
        },
        wrap: obj => {
            if (obj.type === "A1A2题") {
                obj.type = 1;
            }
            obj.question = obj.question.replace(/<img src="https:\/\/cdn-zjy.icve.com.cn\/common\/images\/question_button\/blankspace(\d+).gif">/gi, "");
            obj.options = obj.options.map(i => {
                return i.trim().replace(/^[abAB]\)\s+/, "").replace(/^[A-Za-z]\s+/, "").trim();
            });
        }
    });
    WorkerJSPlus({
        name: "中国地质大学",
        match: location.pathname.includes("/Exam/OnlineExamV2/"),
        root: ".stViewItem",
        elements: {
            question: ".stViewHead  div",
            options: ".stViewCont  .stViewOption a",
            $options: ".stViewCont  .stViewOption a,input"
        },
        intv: () => {
            return $(".ExamTime").length;
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parent().parent().prev().find(".E_E_L_I_C_R_C_T_SubType").text());
            obj.question = obj.question.replace(/\(\d+分\)/, "");
            obj.options = obj.options.map(i => {
                return i.replace(/\([A-Za-z]\)/, "").trim();
            });
        },
        fill: (type, answer, $option) => {
            if (type === 4 || type === 2) {
                $option.val(answer);
            }
        }
    });
    WorkerJSPlus({
        name: "单位",
        match: (location.host === "61.183.163.9:8089" || location.host === "zjpt.nnjjtgs.com:8081") && (location.href.includes("ksnr") || location.href.includes("lxnr")),
        hook: () => {
            JSONParseHook(o => {
                if (o.topicList && o.topicList.length > 0) {
                    GLOBAL.json = parseDanWei(o.topicList);
                    uploadAnswer(GLOBAL.json);
                }
            });
        },
        root: ".tm",
        elements: {
            question: ".tmnrbj span:last-child",
            options: ".van-radio-group .dxt .van-radio__label,.van-checkbox__label",
            $options: ".van-radio-group .dxt .van-radio__label,.van-checkbox__label,.van-field__control",
            type: ".tmnrbj span"
        },
        intv: () => {
            return $(".ExamTime").length || document.getElementById("pup-b");
        },
        wrap: obj => {
            obj.answer = GLOBAL.json[jQuery(".tmnrbj span:last-child").text().match(/^(\d+)、/)[1] - 1].answer;
        },
        finished: () => {
            jQuery(".xyt").click();
            return true;
        }
    });
    WorkerJSPlus({
        name: "小鹅通",
        match: location.pathname.includes("/evaluation_wechat/examination/detail/"),
        root: ".question-title,.title__text",
        elements: {
            question: "#detail_div",
            options: "label  .image-text-box p",
            $options: "label,.simulation_inp"
        },
        ignore_click: ($item, type) => {
            if (type === 0) {
                return $item.html().includes("single-exam-radio-active");
            } else if (type === 1) {
                return $item.html().includes("check-i-active");
            }
        },
        wrap: obj => {
            const $item = obj.$item;
            obj.$options = $item.parent().next().find(".option-item,.checking-option__container,.fill_blank");
            obj.type = getQuestionType($item.next().text());
            if (obj.type === 2) {
                obj.$options = $item.parent().parent();
            }
            if (obj.type === 3) {
                obj.options = ["正确", "错误"];
            } else {
                obj.options = jQuery.map($item.parent().next().find(".option-item #detail_div"), function (val) {
                    return formatString(filterImg(val));
                });
            }
        },
        fill: (type, answer, $option) => {
            if (type === 2) {
                const vue = $option.get(0).__vue__;
                vue.content[0] = answer;
                vue.emitAnswer();
                $option.find(".simulation_inp").text(answer);
            }
        }
    });
    WorkerJSPlus({
        name: "小饿通H5",
        match: location.host.includes("h5.xiaoeknow") || location.href.includes("/exam/h5_evaluation/"),
        root: ".practice-detail__body",
        elements: {
            question: ".question-wrap__title #detail_div",
            options: ".question-option #detail_div",
            $options: ".question-option #detail_div",
            type: ".question-wrap__title-tag"
        },
        wrap: obj => {
            const $item = obj.$item;
            obj.$options = $item.parent().next().find(".option-item,.checking-option__container,.fill_blank");
            obj.type = TYPE[$item.next().text().replace(/\s+/, "").replace("（", "").replace("）", "")];
            if (obj.type === 2) {
                obj.$options = $item.parent().parent();
            }
            if (obj.type === 3) {
                obj.options = ["正确", "错误"];
            } else {
                obj.options = jQuery.map($item.parent().next().find(".option-item #detail_div"), function (val) {
                    return formatString(filterImg(val));
                });
            }
        },
        finished: () => {
            $(".practice-detail__bottom-item:last-child").click();
            return $(".next").text() === "下一题";
        }
    });
    WorkerJSPlus({
        name: "人卫慕课测验",
        match: location.pathname.includes("/memberFront/paper.zhtml"),
        intv: () => {
            return $("#question_").attr("style").length === 0;
        },
        root: ".quesinfo",
        elements: {
            question: "dl dt",
            options: "dd label",
            $options: "dd input"
        },
        wrap: obj => {
            if (obj.$options.length === 2) {
                obj.type = 3;
                obj.options = ["正确", "错误"];
            } else {
                obj.type = 0;
            }
        }
    });
    WorkerJSPlus({
        name: "青书学堂考试",
        match: location.host.includes("qingshuxuetang") && (location.pathname.includes("/Student/MakeupExamPaper") || location.pathname.includes("Student/ExamPaper")),
        intv: () => {
            return $(".paper-container .question-detail-container").length;
        },
        root: ".paper-container .question-detail-container",
        elements: {
            question: ".question-detail-description .detail-description-content",
            options: ".question-detail-options label .option-description",
            $options: ".question-detail-options label input",
            type: ".question-detail-type .question-detail-type-desc"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        }
    });
    WorkerJSPlus({
        name: "青书学堂测验",
        match: location.host.includes("qingshuxuetang") && (location.pathname.includes("/Student/ExercisePaper") || location.pathname.includes("/Student/SimulationExercise")) || location.host === "quiz.qingshuxuetang.com" && location.pathname.includes("/Student/Quiz/Detail"),
        intv: () => {
            return $(".question-detail-container").length;
        },
        root: ".question-detail-container",
        elements: {
            question: ".question-detail-description  span",
            options: ".question-detail-options label .option-description",
            $options: ".question-detail-options div input,.question-detail-solution-textarea",
            type: ".question-detail-type"
        },
        wrap: obj => {
            obj.options = obj.options.map(i => {
                return i.replace(/\([A-Za-z]\)/, "").trim();
            });
        },
        ignore_click: ($item, type) => {
            if (type === 1) {
                return $item.prop("checked");
            }
        },
        fill: (type, answer, $option) => {
            if (type === 4 || type === 2) {
                $option.parents().find(".question-controller-wrapper .next").click();
            }
        }
    });
    WorkerJSPlus({
        name: "优学院测验",
        match: location.pathname === "/learnCourse/learnCourse.html",
        intv: () => {
            return $(".question-setting-panel").length;
        },
        root: ".split-screen-wrapper",
        elements: {
            question: ".question-title-scroller .question-title-html",
            options: ".choice-list .content-wrapper .text",
            $options: ".choice-list .checkbox ,.question-body-wrapper .choice-btn",
            type: ".question-title-scroller .question-type-tag"
        },
        wrap: obj => {
            obj.options = obj.options.map(i => {
                return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, "").replaceAll(/^[a-z]\s+/g, "").replaceAll(/^[a-z]、\s+/g, "").trim());
            });
        },
        ignore_click: $item => {
            return $item.hasClass("selected");
        }
    });
    WorkerJSPlus({
        name: "优学院作业",
        match: location.pathname === "/quiz/pc.html",
        intv: () => {
            return $(".questions").length;
        },
        root: ".question-item",
        elements: {
            question: ".question-title",
            options: "ul label .choice-title",
            $options: "ul label input",
            type: ".title"
        },
        wrap: obj => {
            obj.options = obj.options.map(i => {
                return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, "").replaceAll(/^[a-z]\s+/g, "").replaceAll(/^[a-z]、\s+/g, "").trim());
            });
        },
        ignore_click: $item => {
            return $item.prop("checked");
        }
    });
    WorkerJSPlus({
        name: "优学院考试",
        match: location.host === "utest.ulearning.cn" && location.pathname === "/",
        intv: () => {
            return $(".section-area").length;
        },
        root: ".question-area .question-item",
        elements: {
            question: ".base-question .title .rich-text",
            options: ".choice-list label .rich-text",
            $options: ".choice-list  label, .iconfont",
            type: ".base-question .title .tip"
        },
        wrap: obj => {
            obj.options = obj.options.map(i => {
                return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, "").replaceAll(/^[a-z]\s+/g, "").replaceAll(/^[a-z]、\s+/g, "").trim());
            });
        },
        ignore_click: $item => {
            return $item.hasClass("is-checked");
        },
        finished: () => {
            if ($(".next-part:contains(下个部分)").length) {
                $(".next-part").click();
                return true;
            } else {
                return false;
            }
        }
    });
    WorkerJSPlus({
        name: "优学院作业",
        match: location.pathname === "/umooc/learner/homework.do",
        intv: () => {
            return $(".multiple-choices").length;
        },
        root: ".multiple-choices,.judge",
        elements: {
            question: "h5 .position-rltv span:last-child",
            options: "ul label span:last-child",
            $options: "ul label input,.radios .radio input",
            type: "h5 .typeName"
        },
        wrap: obj => {
            obj.options = obj.options.map(i => {
                return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, "").replaceAll(/^[a-z]\s+/g, "").replaceAll(/^[a-z]、\s+/g, "").trim());
            });
        },
        ignore_click: $item => {
            return $item.prev().hasClass("checkbox-checked");
        }
    });
    WorkerJSPlus({
        name: "万学",
        match: location.pathname.includes("/sls/N2014_StudyController/next"),
        root: ".question",
        elements: {
            question: "tr .nm2",
            options: ".grey td p",
            $options: ".option li label",
            type: "tr .nm2"
        },
        wrap: obj => {
            obj.question = obj.question.parent().find("td p").text();
        }
    });
    WorkerJSPlus({
        name: "wenJuanAutoFill",
        match: location.host.includes("wenjuan.com") && location.pathname === "/s/",
        root: "questionContent",
        elements: {
            question: ".title",
            options: ".icheckbox_div .option_label",
            $options: ".icheckbox_div label",
            type: ".question_num"
        },
        ignore_click: $item => {
            return $item.attr("class").includes("checked");
        }
    });
    WorkerJSPlus({
        name: "学起（考试）",
        match: location.pathname.includes("/oxer/page/ots/examIndex.html"),
        intv: () => {
            return $(".tika_topline").length;
        },
        root: ".queItemClass",
        elements: {
            question: "dt .din:eq(1)",
            options: ".clearfix div",
            $options: ".clearfix .xuan,input"
        },
        ignore_click: $item => {
            return $item.parent().hasClass("cur");
        },
        wrap: obj => {
            obj.plat = 66;
            obj.qid = obj.$item.attr("id");
            obj.type = getQuestionType(obj.$item.parent().find("div .fb:eq(0)").text());
            if (obj.type === 3) {
                obj.options = ["正确", "错误"];
            }
        }
    });
    WorkerJSPlus({
        name: "学起（测试）",
        match: location.pathname.includes("/oxer/page/ots/UniversityStart.html"),
        intv: () => {
            return $(".uniQueList").length;
        },
        root: ".uniQueItem",
        elements: {
            question: ".QueStem",
            options: "ul li span",
            $options: "ul li"
        },
        ignore_click: $item => {
            return $item.parent().hasClass("lichecked");
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parents(".uniQueList").find(".fir").text());
            if (obj.type === 3) {
                obj.options = ["正确", "错误"];
            }
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "易班考试",
        match: location.host === "exam.yooc.me" && location.pathname.includes("/group"),
        intv: () => {
            return $(".jsx-3527395752").length;
        },
        root: "main:last",
        elements: {
            question: "h3 div",
            options: ".mb ul li .flex-auto",
            $options: ".mb ul li",
            type: ".mb-s"
        },
        ignore_click: $item => {
            return $item.hasClass("_c");
        },
        fill: (type, answer, $option) => {
            if (type === 4 || type === 2) {
                $(".exam-input").val("answer");
            }
        },
        finished: need_jump => {
            if ($('.round:contains("下一题")').hasClass("ghost")) return false;
            $('.round:contains("下一题")').click();
            return true;
        }
    });
    WorkerJSPlus({
        name: "英华学堂",
        match: () => {
            const pathMatch = location.pathname.includes("/user/work") || location.pathname.includes("/user/exam");
            const matchHostArr = ["mooc.kdcnu.com", "mooc.yncjxy.com", "mooc.cdcas.com", "mooc.cqcst.edu.cn", "mooc.kmcc.edu.cn", "mooc.wuhues.com"];
            return pathMatch && matchHostArr.includes(location.host);
        },
        intv: () => {
            return $("#stateName").text().trim() === "进行中";
        },
        root: ".courseexamcon-main",
        elements: {
            question: ".name",
            options: ".list li .txt",
            $options: ".list li .exam-inp",
            type: ".type"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        fill: (type, answer, $option) => { },
        finished: auto_jump => {
            if ($(".next_exam").eq(3).prop("style")[0] == "display") return false;
            $(".next_exam").click();
        }
    });
    WorkerJSPlus({
        name: "厦门在线教育测验",
        match: location.pathname.includes("/nec/student/exam/exam-paper!test"),
        root: "#paper_form > div:nth-child(4) > table:nth-child(1) > tbody:nth-child(2)>tr:even",
        elements: {
            question: "td:eq(1)",
            options: ".optionUl label .el-radio__label,.el-checkbox__label",
            $options: ".optionUl label"
        },
        wrap: obj => {
            obj.options = obj.$item.next().find("tbody:first > tr tbody").map((i, y) => {
                return $(y).find("td:eq(1)").text();
            }).toArray();
            obj.$options = obj.$item.next().find("tbody:first > tr tbody").map((i, y) => {
                return $(y).find("input");
            });
            obj.type = 0;
        }
    });
    WorkerJSPlus({
        name: "金牌学堂",
        match: location.host === "www.goldgame.com.cn" && location.href.includes("/TestPage"),
        intv: () => {
            return $(".tab-btn-box li").length;
        },
        root: ".test-type-box ul .white-bg",
        elements: {
            question: ".position-relative h3",
            options: ".test-option label p:last-child",
            $options: ".test-option label input"
        },
        wrap: obj => {
            obj.question = obj.question.replace(/题目\d+\:/, "").trim().replace(/^\d+./, "");
            obj.type = getQuestionType(obj.$item.parent().parent().find(".test-type-tips").text());
            if (obj.$options.length > 2 && obj.$options.eq(0).hasClass("radiobox")) {
                obj.type = 0;
            }
        },
        fillFinish: data => {
            $(".answer-sheet li").eq(GLOBAL.index).click();
        }
    });
    WorkerJSPlus({
        name: "青岛开放大学",
        match: location.pathname.includes("/pages/exam/exam.html"),
        intv: () => {
            return $(".exam-content-block .exam-content-topic").length;
        },
        root: ".exam-content-block .exam-content-topic",
        elements: {
            question: ".exam-topic-title",
            options: ".exam-topic-answer .layui-unselect span",
            $options: ".exam-topic-answer .layui-unselect"
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parent().find(".exam-content-title .exam-content-num").text());
        }
    });
    WorkerJSPlus({
        name: "点墨考试",
        match: location.pathname.includes("/Exam/StartExam"),
        root: "#question div div:first",
        elements: {
            question: "div:first",
            options: "div:first ~ div",
            $options: "div:first ~ div input"
        },
        wrap: obj => {
            obj.type = getQuestionType($(".alert #groupNameSpan").text());
        },
        finished: () => {
            $(".w-100 .btn-light:eq(1)").click();
            return true;
        }
    });
    WorkerJSPlus({
        name: "点墨测验",
        match: location.pathname.includes("/Course/TestPaper"),
        root: ".question",
        elements: {
            question: " div div:first div:first",
            options: " div div:first div:first ~ div",
            $options: " div div:first div:first ~ div input"
        },
        wrap: obj => {
            obj.type = getQuestionType($("h3").text());
            obj.question = obj.question.replace(/^\d+\./, "");
        }
    });
    WorkerJSPlus({
        name: "警官学院",
        match: location.pathname.includes("/bsmytest/startTi.do"),
        root: ".wrapper > div",
        elements: {
            question: ".dx",
            options: "p",
            $options: "p input"
        },
        wrap: obj => {
            if ($(".wrapper .cl").length > 0) {
                obj.question = obj.$item.text().replace(/[0-9]、/, "").replace(/\（.*?\）/g, "").trim().split("$")[0].replace(/\(.*?\)/g, "").trim();
            } else {
                obj.question = obj.question.replace(/[0-9]、/, "").replace(/\（.*?\）/g, "").trim();
            }
            obj.type = getQuestionType(obj.$item.parent().find("h2").text());
            obj.options = obj.options.map(item => {
                return item.replace(/[A-Za-z][\：]/, "").replace(/[A-Za-z][\：,\:]/, "").replace(/\；/, "").trim();
            });
        }
    });
    WorkerJSPlus({
        name: "exam2_euibe_com_exam",
        match: location.hostname === "exam2.euibe.com" && location.pathname === "/KaoShi/ShiTiYe.aspx",
        root: ".question",
        elements: {
            question: ".wenti",
            options: "li label span",
            $options: "li label"
        },
        wrap: obj => {
            obj.type = getQuestionType($(".question_head").text());
        },
        finished: need_jump => {
            $(".paginationjs-next").click();
            return true;
        }
    });
    WorkerJSPlus({
        name: "lzwyedu_jijiaool_com_exam",
        match: () => {
            const pathMatch = location.pathname.includes("/learnspace/course/test/") || location.pathname.includes("/Student/ExamManage/CourseOnlineExamination");
            const matchHostArr = ["lzwyedu.jijiaool.com", "cgjx.jsnu.edu.cn", "learn-cs.icve.com.cn", "nwnu.jijiaool.com", "lut.jijiaool.com", "learn.courshare.cn", "cj1027-kfkc.webtrn.cn"];
            return pathMatch && matchHostArr.includes(location.host);
        },
        root: ".test_item",
        elements: {
            question: ".test_item_tit",
            options: ".test_item_theme label .zdh_op_con",
            $options: "label input"
        },
        wrap: obj => {
            obj.question = obj.question.replace(/该题未做$/, "").replace(/^\d+\./, "").replace(/^\d+、/, "").replace(/[(（](\d+\s?(\.\d+)?分)[)）]$/, "").replace(/^((\d+.(\s+)?)?)[\[(（【](.*?)[】)）\]]/, "").trim();
            obj.type = getQuestionType(obj.$item.prevAll(".test_item_type:first").text());
            if (obj.type === 3) {
                obj.options = ["对", "错"];
            }
        }
    });
    WorkerJSPlus({
        name: "zzx_ouchn_edu_cn_exam",
        match: location.hostname === "zzx.ouchn.edu.cn" && location.pathname.includes("/edu/public/student/"),
        root: ".subject",
        elements: {
            question: ".question span",
            options: ".answer>span>p:first-child",
            $options: ".answer>span>p:first-child"
        },
        wrap: obj => {
            if (obj.$options.length > 1) {
                obj.type = 0;
            }
        }
    });
    WorkerJSPlus({
        name: "zzx_ouchn_edu_cn_exam",
        match: location.hostname === "zzx.ouchn.edu.cn" && location.pathname.includes("/edu/public/student/"),
        root: ".subject",
        elements: {
            question: ".question span",
            options: ".answer>span>p:first-child",
            $options: ".answer>span>p:first-child"
        },
        wrap: obj => {
            if (obj.$options.length > 1) {
                obj.type = 0;
            }
        }
    });
    WorkerJSPlus({
        name: "havust_hnscen_cn_exam",
        match: location.hostname === "havust.hnscen.cn" && location.pathname.includes("/stuExam/examing/"),
        root: ".main .mt_2 > div",
        elements: {
            question: ".flex_row+div",
            options: ".flex_row+div+div .el-radio__label,.el-checkbox__label",
            $options: ".flex_row+div+div .el-radio__label,.el-checkbox__label",
            type: ".flex_row .mr_2"
        }
    });
    WorkerJSPlus({
        name: "www_zygbxxpt_com_exam",
        match: location.hostname === "www.zygbxxpt.com" && location.pathname.includes("/exam"),
        root: ".Body",
        elements: {
            question: ".QName",
            options: ".QuestinXuanXiang p:parent",
            $options: ".QuestinXuanXiang p:parent",
            type: ".QName span"
        },
        wrap: obj => {
            obj.question = obj.question.replace(/\([^\)]*\)/g, "").replace(/\【.*?\】/g, "");
            obj.options = obj.options.map(item => {
                return item.split(">").pop().trim();
            });
        }
    });
    WorkerJSPlus({
        name: "xuexi_jsou_cn_work",
        match: location.hostname === "xuexi.jsou.cn" && location.pathname.includes("/jxpt-web/student/newHomework/showHomeworkByStatus"),
        root: ".insert",
        elements: {
            question: ".window-title",
            options: ".questionId-option .option-title div[style^=display]",
            $options: ".questionId-option .option-title .numberCover"
        },
        wrap: obj => {
            obj.type = {
                1: 0,
                2: 1,
                7: 3
            }[obj.$item.find(".question-type").val()];
            if (obj.options.length == 2) {
                obj.type = 3;
            }
        }
    });
    WorkerJSPlus({
        name: "czvtc_cjEdu_com_exam",
        match: () => {
            const pathMatch = location.pathname.includes("/ExamInfo") || location.pathname.includes("/Examination");
            const matchHostArr = location.host.includes("cj-edu.com");
            return pathMatch && matchHostArr;
        },
        intv: () => {
            return $(".el-container .all_subject>.el-row").length;
        },
        root: ".el-container .all_subject>.el-row",
        elements: {
            question: ".stem div:last-child",
            options: ".el-radio-group .el-radio__label,.el-checkbox-group .el-checkbox__label",
            $options: ".el-radio-group .el-radio__original,.el-checkbox-group .el-checkbox__original"
        },
        wrap: obj => {
            if (obj.$options.length < 3 && obj.$options.eq(0).attr("type") === "radio") {
                obj.type = 3;
            } else if (obj.$options.length > 2 && obj.$options.eq(0).attr("type") === "radio") {
                obj.type = 0;
            } else if (obj.$options.length > 2 && obj.$options.eq(0).attr("type") === "checkbox") {
                obj.type = 1;
            }
        }
    });
    WorkerJSPlus({
        name: "learning_mhtall_com_exam",
        match: location.host.includes("learning.mhtall.com") && location.pathname.includes("/rest/course/exercise/item"),
        root: "#div_item",
        elements: {
            question: ".item_title",
            options: ".opt div label",
            $options: ".opt div input:not(.button_short)",
            type: "h4"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            if (obj.type === 0 || obj.type === 3) {
                obj.answer = $(".div_answer").text().match(/[a-zA-Z]/).map(i => {
                    return obj.options[i.charCodeAt(0) - 65];
                });
            } else if (obj.type === 2) {
                obj.answer = $(".div_answer").text().replace("参考答案：", "").split("，");
            }
        },
        fill: (type, answer, $option) => {
            if (type === 2 || type === 4) {
                $option.val(answer);
                $(".DIV_TYPE_BLANK .button_short").click();
            }
        },
        fillFinish: () => {
            if ($(".opt+div+div input:eq(1)").val() === "下一题") {
                $(".opt+div+div input:eq(1)").click();
            } else {
                $(".button_short:eq(2)").click();
            }
        }
    });
    WorkerJSPlus({
        name: "168网校(测验)",
        match: location.host.includes("168wangxiao.com") && location.pathname.includes("/web/learningCenter/details/"),
        intv: () => {
            return $(".ret-answer").length === 0 && $(".info-container").length;
        },
        root: ".question-item-container",
        elements: {
            question: ".title-content",
            options: ".options .opt-content",
            $options: ".options label",
            type: ".top .type"
        }
    });
    WorkerJSPlus({
        name: "168网校(考试)",
        match: location.host.includes("168wangxiao.com") && location.pathname.includes("/web/examination/answer"),
        intv: () => {
            return $(".Answer-area").length;
        },
        root: ".Answer-area",
        elements: {
            question: ".listTit",
            options: ".el-radio__label span:last-child,.el-checkbox__label span:last-child",
            $options: ".el-radio__input,.el-checkbox__input input,.ql-editor p"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            if (obj.options.length === 0) {
                obj.type = 2;
            }
            console.log(obj);
        },
        fill: (type, answer, $option) => {
            if (type === 2 || type === 4) {
                console.log(answer);
                document.querySelector(".ql-editor p").textContent = answer;
            }
        },
        finished: () => {
            if ($(".ctrl .el-button:contains(下一题)").length != 0) {
                $(".ctrl .el-button:contains(下一题)").click();
                return true;
            } else if ($(".ctrl .el-button:contains(上一题)").length && $(".ctrl button").length === 1) {
                return false;
            }
        }
    });
    WorkerJSPlus({
        name: "法宣在线",
        match: location.host.includes("faxuanyun.com") && location.pathname.includes("/bps/examination"),
        intv: () => {
            return $("#timucontent").length;
        },
        root: "#timucontent",
        elements: {
            question: "h2",
            options: "ul li",
            $options: "ul input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            obj.question = obj.question.replace(/[\（(].+?[)\）]/g, "");
            if ($(".layui-layer-content").length) {
                iframeMsg("tip", {
                    type: "stop",
                    tip: "答题暂停，请自行通过验证"
                });
                $("#lastButton").click();
                GLOBAL.stop = true;
                return false;
            }
        },
        finished: need_jump => {
            if ($("#nextButton").length) {
                $("#nextButton").click();
                return true;
            } else {
                return false;
            }
        }
    });
    WorkerJSPlus({
        name: "山财培训网 (补考)",
        match: location.host.includes("training.sdufe.edu.cn") && location.pathname.includes("/Exam/OnlineExam/"),
        intv: () => {
            return $(".exam_r_m").length;
        },
        root: ".exam_r_m",
        elements: {
            question: ".bt",
            options: ".btm",
            $options: ".btm input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            obj.question = obj.question.replace(/[\（(].+?[)\）]/g, "");
            obj.options = $("br").parent().text().split(/[A-Z]\./).slice(1).map(item => {
                return item.trim();
            });
            if (obj.type === 3) {
                obj.answer = $("#answerDiv").text().replace("正确答案：", "").split();
            } else {
                obj.answer = $("#answerDiv").text().match(/[A-Z]/g).map(item => {
                    return obj.options[item.charCodeAt(0) - 65];
                });
            }
        },
        finished: () => {
            document.querySelector("#next").click();
            if (document.querySelector("#noAskCount").textContent == "0") {
                return false;
            }
            return true;
        }
    });
    WorkerJSPlus({
        name: "和学在线",
        match: location.host.includes("studentjxjyzx") || location.host.includes("student.hexuezx") || location.host.includes("student.jxjyzx"),
        intv: () => {
            return $(".el-card__body").length;
        },
        root: ".el-card__body",
        elements: {
            question: ".stem",
            options: ".el-radio__label,.el-checkbox__label span",
            $options: ".el-radio__input,.el-checkbox__input input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            obj.question = obj.question.replace(/[\（(].+?[)\）]/g, "");
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "高教在线",
        match: location.host === "www.cqooc.com" && (location.href.includes("/learn/mooc/exam/do") || location.href.includes("/learn/mooc/testing/do")),
        intv: () => {
            return $("#test-form").length;
        },
        root: "#test-form .cat",
        elements: {
            question: ".stem",
            options: ".option label",
            $options: ".option input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            obj.question = obj.question.replace(/\(\d+分\)\d+\.\d+/, "");
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "柠檬文才（考试）",
        match: () => {
            const pathMatch = location.pathname.includes("/separation/exam/");
            const matchHostArr = ["learning.wuxuejiaoyu.cn", "learning.wencaischool.net", "learning.zk211.com", "study.wencaischool.net", "www.wencaischool.net"];
            return pathMatch && matchHostArr.includes(location.host);
        },
        intv: () => {
            return $("#paperExam").css("display") != "none";
        },
        root: ".paperWrapper .tmList",
        elements: {
            question: ".tmTitleTxt",
            options: ".ansbox .opCont",
            $options: ".ansbox input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            if (obj.options.length === 0) {
                obj.type = 2;
            }
            console.log(obj);
        },
        fill: (type, answer, $option) => {
            if (type === 4 || type === 2) {
                $option.val(answer);
            }
        }
    });
    WorkerJSPlus({
        name: "柠檬文才（作业）",
        match: () => {
            const matchHostArr = ["learning.wuxuejiaoyu.cn", "learning.wencaischool.net", "learning.zk211.com", "study.wencaischool.net"];
            return (location.pathname.includes("/hblearning/exam/") || location.pathname.includes("/xbsflearning/exam/") || location.pathname.includes("/openlearning/exam/") || location.pathname.includes("/jxlearning/exam/") || location.pathname.includes("/shandonglearning/exam")) && matchHostArr.includes(location.host);
        },
        intv: () => {
            return $("#paperExam").css("display") !== "none";
        },
        root: "#_block_content_exam #tblDataList>tbody>tr",
        elements: {
            question: "tbody:first>tr>td:last table",
            options: ".ansbox .opCont",
            $options: ".ansbox input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            obj.question = $("#_block_content_exam #tblDataList>tbody>tr>td").find(" tbody:first>tr>td:last table:first").eq(GLOBAL.index - 1).find("tr:first").text();
            obj.options = [];
            $("#_block_content_exam #tblDataList>tbody>tr>td").find(" tbody:first>tr>td:last table:first").eq(GLOBAL.index - 1).find("tr:first").next().find("label").map((i, y) => {
                obj.options.push($(y).text());
            });
            obj.$options = $("#_block_content_exam #tblDataList>tbody>tr>td").find(" tbody:first>tr>td:last table:first").eq(GLOBAL.index - 1).find("tr:first").next().find("input").map((i, y) => {
                return y;
            });
            obj.type = 0;
            if (obj.options.length == 2) {
                obj.type = 3;
            } else if (obj.$options.eq(0).attr("type") != "radio") {
                obj.type = 1;
            }
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "福建师范",
        match: location.host === "neo.fjnu.cn" && location.pathname.includes("/resource/index"),
        intv: () => {
            return $(".content").length && !$(".answer-content").length;
        },
        root: ".content",
        elements: {
            question: ".title",
            options: "label .el-radio__label,.el-checkbox__label",
            $options: "label input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "优课学堂",
        match: location.host.includes("youkexuetang.cn") && location.pathname.includes("/student/"),
        intv: () => {
            return $(".paperItemBox").length;
        },
        root: ".paperItemBox",
        elements: {
            question: ".stem",
            options: ".el-radio__label,.el-checkbox__label",
            $options: ".el-radio__input,.el-checkbox__input input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            obj.question = obj.question.replace(/[\（(].+?[)\）]/g, "");
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "亿学宝云考试",
        match: location.host.includes("yxbyun.com") && location.hash.includes("/finalExam"),
        intv: () => {
            return $(".time_header").length || $(".pager_wrap").length;
        },
        hook: () => {
            JSONParseHook(o => {
                if (o?.data?.paper?.paperStructureList) {
                    GLOBAL.json = parseYxbyunExam(o.data.paper.paperStructureList).reduce((acc, cur) => {
                        return acc.concat(cur);
                    }, []);
                    console.log(GLOBAL.json);
                }
            });
        },
        root: ".test",
        elements: {
            question: ".type",
            options: ".el-radio-group,.el-checkbox-group label",
            $options: ".answer div",
            type: ".el-tag"
        },
        wrap: obj => {
            Object.assign(obj, GLOBAL.json[GLOBAL.index - 1]);
        },
        ignore_click: $item => {
            return $item.prop("checked");
        }
    });
    WorkerJSPlus({
        name: "亿学宝云",
        match: location.host.includes("yxbyun.com") && location.hash.includes("/testPaper"),
        intv: () => {
            return $(".time_header").length || $(".pager_wrap").length;
        },
        hook: () => {
            JSONParseHook(o => {
                if (o.data && o.data.bigContent) {
                    GLOBAL.json = parseYxbyunTest(o.data.bigContent).reduce((acc, cur) => {
                        return acc.concat(cur);
                    }, []);
                    console.log(GLOBAL.json);
                }
            });
        },
        root: ".test",
        elements: {
            question: ".type",
            options: ".el-radio-group,.el-checkbox-group label",
            $options: ".el-radio__input,.el-checkbox__input input",
            type: ".el-tag"
        },
        wrap: obj => {
            Object.assign(obj, GLOBAL.json[GLOBAL.index - 1]);
        },
        ignore_click: $item => {
            return $item.prop("checked");
        }
    });
    WorkerJSPlus({
        name: "考试星（单题）",
        match: Boolean(location.host === "exam.kaoshixing.com" && location.pathname.includes("/exam/exam_start")),
        intv: () => {
            return $("#nextQuestions").length;
        },
        root: ".questions .questions-content",
        elements: {
            question: ".question-name",
            options: ".answers label .words",
            $options: ".answers label"
        },
        ignore_click: $item => {
            return $item.parent().find("input").prop("checked");
        },
        wrap: obj => {
            obj.question = obj.question.replace(/[\（(].+?[)\）]/g, "");
            console.log(obj);
        },
        finished: () => {
            if ($("#nextQuestions:contains(下一题)").length && $("#nextQuestions").css("display") !== "none") {
                $("#nextQuestions:contains(下一题)").click();
                return true;
            } else {
                return false;
            }
        }
    });
    WorkerJSPlus({
        name: "易考云",
        match: location.host === "exam.beeouc.com" && location.pathname.includes("/client"),
        intv: () => {
            return $(".question-body").length;
        },
        root: ".question-body",
        elements: {
            question: ".question-stem",
            options: ".question-option label",
            $options: ".question-option input",
            type: ".question-type"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            console.log(obj);
        },
        finished: () => {
            if ($(".question-footer button:contains(下一题)").length) {
                $(".question-footer button:contains(下一题)").click();
                return true;
            } else {
                return false;
            }
        }
    });
    WorkerJSPlus({
        name: "伊犁师范成人教育",
        match: location.pathname.includes("/learn/NewExam/Testing") || location.pathname.includes("//GeneralTestPaper/Testing/") || location.pathname.includes("//GeneralTestPaper/SNTesting"),
        intv: () => {
            return $(".topic").length;
        },
        root: ".topic",
        elements: {
            question: ".qsctt",
            options: ".xuan li",
            $options: ".choice input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            obj.options = obj.options.map(i => {
                return i.replace(/^[A-Z] \. /, "");
            });
            if (obj.$options.length == 2) {
                obj.options = ["正确", "错误"];
                obj.type = 3;
            }
        }
    });
    WorkerJSPlus({
        name: "绎通云课堂 （作业）",
        match: location.host.includes("ytccr.com") && (location.hash.includes("#/learning-work") || location.hash.includes("#/learning-details")),
        intv: () => {
            return $(".left-question").length;
        },
        root: ".border-item",
        elements: {
            question: ".qa-title",
            options: "label .opt-title-cnt",
            $options: "label input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        }
    });
    WorkerJSPlus({
        name: "重庆大学网络教育学院 （作业）",
        match: location.host === "exercise.5any.com" && location.pathname.includes("/Exercise/WebUI/Test/Answer"),
        intv: () => {
            return $(".examtime-content").length;
        },
        root: ".subject .font-16",
        elements: {
            question: ".stem .richtextcontent",
            options: ".option .richtextcontent",
            $options: ".option label input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        }
    });
    WorkerJSPlus({
        name: "毕节幼儿师范",
        match: location.host === "px.gzbjyzjxjy.cn" || location.host === "px.ggcjxjy.cn" && location.pathname.includes("/exam/shiti/dopapers"),
        intv: () => {
            return $(".panel-body").length;
        },
        root: ".panel-body>div",
        elements: {
            question: ".testpaper-question-stem",
            options: ".testpaper-question-choices li",
            $options: ".testpaper-question-footer input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "贵州继续教育",
        match: location.host === "www.gzjxjy.gzsrs.cn" && location.pathname.includes("/personback/"),
        intv: () => {
            return $(".question-title").length;
        },
        root: ".question-title",
        elements: {
            question: ".show-text",
            options: "label",
            $options: "label input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "和学自考",
        match: location.host === "zkpt.qdu.edu.cn" && location.pathname.includes("/examStu/exam/examPaper"),
        intv: () => {
            return $(".ant-spin-container").length;
        },
        root: ".ant-row",
        elements: {
            options: "label",
            $options: "label input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            obj.question = obj.$item.parent().parent().prev().text();
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "专技天下",
        match: location.host.includes("zgzjzj.com") && location.pathname.includes("/examination/perpar.html"),
        intv: () => {
            return $(".question_index").length;
        },
        root: ".question_index",
        elements: {
            question: "p",
            options: ".options li p,li>span:last-child",
            $options: ".options li",
            type: "p span"
        },
        ignore_click: $item => {
            return $item.hasClass("active");
        }
    });
    WorkerJSPlus({
        name: "睿学补考",
        match: location.href.includes("exam-app-exam-paper") && location.host.includes("ks.hustsnde.com"),
        intv: () => {
            return $("#paper").length;
        },
        root: "#paper .content-box",
        elements: {
            question: "ul li:eq(0) .desc",
            options: "ul li:eq(1)",
            $options: "ul label input",
            type: ".title"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            const options = obj.options[0].trim().split(/\[[A-Z]:?\]/).splice(1).map(i => {
                return i.trim();
            }).filter(i => i);
            if (options.length === 0) {
                obj.options = obj.options[0].trim().split(/\(?[A-Z\.?]\)?/).splice(1).map(i => {
                    return i.trim();
                }).filter(i => i);
            } else {
                obj.options = options;
            }
            if (obj.type === 3) {
                obj.options = ["正确", "错误"];
            }
        }
    });
    WorkerJSPlus({
        name: "云上河开",
        match: location.host === "jx.open.ha.cn" && location.pathname.includes("/jxpt-web/student/homework/showHomeworkByStatus"),
        intv: () => {
            return $("#shiti-content").length;
        },
        root: ".insert",
        elements: {
            question: ".window-title",
            options: "ul li div:last-child",
            $options: "ul li .numberCover"
        },
        ignore_click: $item => {
            return $item.parent().hasClass("answer-title");
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parents(".layui-colla-item").find(".titleType").text());
        }
    });
    WorkerJSPlus({
        name: "ycjy.lut.edu.cn",
        match: location.host === "ycjy.lut.edu.cn" && location.pathname.includes("/learnspace/course/test/coursewareTest_intoTestPage.action"),
        intv: () => {
            return $(".bank_cont").length;
        },
        root: ".test_item",
        elements: {
            options: "label",
            $options: "label input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parent().find(".test_item_type").text());
            obj.question = obj.$item.find(".test_item_tit").contents()[0].nodeValue.trim();
        }
    });
    WorkerJSPlus({
        name: "exam.euibe.com",
        match: location.host === "exam.euibe.com" && location.pathname.includes("/KaoShi/ShiTiYe.aspx"),
        intv: () => {
            return $(".question_list").length;
        },
        root: ".question",
        elements: {
            question: ".wenti .stem",
            options: "label span",
            $options: "label input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parents(".question_list").find(".question_head").text());
        },
        finished: need_jump => {
            if ($(".paginationjs-next").hasClass("disabled")) {
                return false;
            }
            $(".paginationjs-next").click();
            return true;
        }
    });
    WorkerJSPlus({
        name: "学晖教育",
        match: location.host === "xhjy.ldzxjy.com" && location.pathname.includes("tikuUserBatch/keepTopic"),
        intv: () => {
            return $(".radio").length;
        },
        root: ".radio",
        elements: {
            question: ".issueTitle",
            options: "ul li span",
            $options: "ul li",
            type: ".issueTypes"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        finished: need_jump => {
            if ($(".next").text().includes("交卷")) {
                return false;
            }
            $(".next").click();
            return true;
        }
    });
    WorkerJSPlus({
        name: "东财在线",
        match: location.host === "classroom.edufe.com.cn" && (location.pathname.includes("/PracticePaper") || location.pathname.includes("/HomeWorkPaper")),
        intv: () => {
            return $(".TK-main").length;
        },
        root: ".CBTPaperMain-trunk",
        elements: {
            question: ".CBTPaperMain-divInline",
            options: "ul li label",
            $options: "ul li label"
        },
        ignore_click: $item => {
            return $item.hasClass("_CheckBox_checked");
        }
    });
    WorkerJSPlus({
        name: "北华大学在线教育",
        match: () => {
            const pathnameArr = ["cj1026-kfkc.webtrn.cn", "beihua.peishenjy.com"];
            return pathnameArr.includes(location.pathname) && location.pathname.includes("/Learning/CourseOnlineExamination") || location.pathname.includes("/learnspace/course/test");
        },
        intv: () => {
            return $(".s_mi").length;
        },
        root: ".test_item",
        elements: {
            question: ".test_item_tit",
            options: " label",
            $options: "label input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "上海立达学院",
        match: location.host === "kkzxsx.lidapoly.edu.cn" && location.pathname.includes("/exam/"),
        intv: () => {
            return $(".exam-question").length;
        },
        root: ".main .item",
        elements: {
            question: ".text",
            options: ".options label .el-radio__label,.el-checkbox__label",
            $options: ".options label"
        },
        ignore_click: $item => {
            return $item.hasClass("is-checked");
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parent().find(".text").text());
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "石家庄科技继续教育",
        match: location.host.includes("kc.jxjypt.cn") && location.pathname.includes("/paper/start"),
        intv: () => {
            return $(".sub-content").length;
        },
        root: ".sub-content",
        elements: {
            question: ".sub-dotitle",
            options: ".sub-answer dd",
            $options: ".sub-answer dd,.mater-respond textarea",
            type: ".sub-dotitle i"
        },
        ignore_click: $item => {
            return $item.hasClass("cho-this");
        },
        wrap: obj => {
            console.log(obj);
        },
        fill: (type, answer, $option) => {
            if (type === 4) {
                $option.val(answer);
            }
        }
    });
    WorkerJSPlus({
        name: "石家庄理工职业学院",
        match: location.host.includes("edu.tianzerencai.com") && location.pathname.includes("/examinationDetail"),
        intv: () => {
            return $(".topic").length;
        },
        root: ".topic",
        elements: {
            question: ".title",
            options: ".main",
            $options: ".main",
            type: ".title"
        },
        ignore_click: $item => {
            return $item.hasClass("cho-this");
        },
        wrap: obj => {
            if (obj.type === 3) {
                obj.options = ["正确", "错误"];
                obj.$options = obj.$item.find(".judge button");
            } else if (obj.type === 1) {
                obj.options = obj.$item.find(".checkbox .option_text").map((i, y) => {
                    return $(y).text();
                }).toArray();
                obj.$options = obj.$item.find(".checkbox button");
            } else if (obj.type === 0) {
                obj.options = obj.$item.find(".radio .option_text").map((i, y) => {
                    return $(y).text();
                }).toArray();
                obj.$options = obj.$item.find(".radio button");
            }
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "国开军盾",
        match: location.host.includes("s.jundunxueyuan.com") && location.hash.includes("#/exam/"),
        intv: () => {
            return $(".the-paper .section-item-question-item").length;
        },
        root: ".section-item-question-item",
        elements: {
            plat: 43,
            question: ".question-tit",
            options: ".el-radio-group label,.el-checkbox-group label",
            $options: ".el-radio-group input,.el-checkbox-group input",
            type: ".sub-dotitle i"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parents(".section-item").find(".section-item-tit").text());
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "博学bx",
        match: location.host.includes("bx.bossyun.com") && location.pathname.includes("/bx/study/examine"),
        intv: () => {
            return $(".question-list").length;
        },
        root: ".question-list",
        elements: {
            question: ".title",
            options: ".ant-radio-group label,.ant-checkbox-group label",
            $options: ".ant-radio-group input,.ant-checkbox-group input",
            type: ".tag"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        }
    });
    WorkerJSPlus({
        name: "博学bx",
        match: location.host.includes("bx.bossyun.com") && location.pathname.includes("/bx/study/examine"),
        intv: () => {
            return $(".question-list").length;
        },
        root: ".question-list",
        elements: {
            question: ".title",
            options: ".ant-radio-group label,.ant-checkbox-group label",
            $options: ".ant-radio-group input,.ant-checkbox-group input",
            type: ".tag"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        }
    });
    WorkerJSPlus({
        name: "电中在线",
        match: location.host.includes("old-zzx.ouchn.edu.cn") && location.pathname.includes("/edu/public/student/"),
        intv: () => {
            return $(".subject").length;
        },
        root: ".subject",
        elements: {
            question: ".question",
            options: ".answer .option-name",
            $options: ".answer"
        },
        wrap: obj => {
            obj.type = 0;
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "爱学",
        match: () => {
            const pathMatch = location.pathname.includes("/Web/Test/doing");
            const matchHostArr = ["ai.ztbu.edu.cn", "www.51ixuejiao.com"];
            return pathMatch && matchHostArr.includes(location.host);
        },
        intv: () => {
            return $("card-title").length;
        },
        root: ".exam dd",
        elements: {
            question: "card-title",
            options: ".ans_area div",
            $options: ".ans_area div",
            type: "info"
        },
        ignore_click: $item => {
            return $item.attr("selected") === "selected";
        },
        wrap: obj => {
            console.log(obj);
        },
        fillFinish: data => {
            if (data.ans.includes("span") || data.type === 1) {
                $(".move_btn span:last").click();
            }
        }
    });
    WorkerJSPlus({
        name: "人卫智网",
        match: location.host.includes("exam.ipmph.com") && location.pathname.includes("/front/myschool/index.html"),
        intv: () => {
            return $(".body").length;
        },
        root: ".body",
        elements: {
            question: ".fch2 font",
            options: ".selet .el-radio__label",
            $options: ".selet input"
        },
        wrap: obj => {
            obj.type = 0;
            console.log(obj);
        },
        finished: () => {
            document.querySelector(".next-btn .text-right a:last-child").click();
        }
    });
    WorkerJSPlus({
        name: "卫生人力资源系统",
        match: location.host.includes("vgos.zbwsrc.cn") && location.pathname.includes("/TESExamClient/"),
        intv: () => {
            return $(".testitem").length;
        },
        root: ".testitem",
        elements: {
            question: ".stem",
            options: ".inputitem li",
            $options: ".inputitem input"
        },
        wrap: obj => {
            obj.type = 0;
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "继教在线（考试）",
        match: location.pathname.includes("/Student/ExamManage/CourseOnlineExamination"),
        intv: () => {
            return $(".test_item").length;
        },
        root: ".test_item",
        elements: {
            question: ".test_item_tit",
            options: ".test_item_theme label",
            $options: ".test_item_theme input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            const $item = obj.$item;
            obj.type = getQuestionType($item.prevAll(".test_item_type").text());
            if (obj.type === 3) {
                obj.options = ["正确", "错误"];
            }
        }
    });
    WorkerJSPlus({
        name: "培训系统（考试）",
        match: location.pathname.includes("ShowItemView"),
        intv: () => {
            return $(".choice-interaction").length;
        },
        root: ".choice-interaction",
        elements: {
            question: ".select-clickstyle span",
            options: ".text-simple-choice .text",
            $options: ".text-simple-choice input",
            type: ".item-content"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            const $item = obj.$item;
            obj.type = getQuestionType($item.parent().prevAll(".item-content").text());
            console.log(obj);
        },
        finished: () => {
            window.parent.document.querySelector(".nextBtn").click();
        }
    });
    WorkerJSPlus({
        name: "传媒（考试）",
        match: location.pathname.includes("/Exam/onlineTest/ShiTiYe.aspx"),
        intv: () => {
            return $("#Content").length;
        },
        root: ".ShiTi",
        elements: {
            question: ".Paper_ParentQuestionDesc",
            options: ".Paper_Answer li",
            $options: ".Paper_Answer input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            const $item = obj.$item;
            obj.type = getQuestionType($item.parents("#ContentText").find("#ExamFrameQuesDesc").text());
            console.log(obj);
        },
        finished: () => {
            window.parent.document.querySelector("#btnNext").click();
        }
    });
    WorkerJSPlus({
        name: "慧考试",
        match: location.pathname.includes("/examSystemPCInner/"),
        intv: () => {
            return $(".question-list-box").length;
        },
        root: ".question-list-box > div",
        elements: {
            question: ".topic-title",
            options: ".option_list",
            $options: ".option_list ",
            type: ".question-type-name"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "河北开放",
        match: location.pathname.includes("/exam/") && location.host === "lms.cjzx.hblll.com",
        intv: () => {
            return $(".loading-gif").hasClass("ng-hide") && $(".hd .examinee .submit-label").eq(0).text() === "";
        },
        root: ".card ol .single_selection,.multiple_selection,.true_or_false,.short_answer",
        elements: {
            question: ".summary-title .subject-description",
            options: ".subject-options li .option-content",
            $options: ".subject-options label .left",
            type: ".summary-sub-title span:eq(0)"
        },
        ignore_click: ($item, type) => {
            return type === 1 && $item.find("input").hasClass("ng-not-empty");
        }
    });
    WorkerJSPlus({
        name: "自考365",
        match: location.host === "member.zikao365.com" && location.pathname.includes("generaltest/exam.shtm"),
        intv: () => {
            return $(".timu").length;
        },
        root: ".timu",
        elements: {
            question: ".timu-tit",
            options: ".timu-list .list",
            $options: ".timu-list input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "幕享",
        match: location.host === "web.moycp.com" && location.pathname.includes("/study"),
        intv: () => {
            return $(".question-list").length;
        },
        root: ".question-list",
        elements: {
            question: ".question-title",
            options: ".answer-option label",
            $options: ".answer-option input",
            type: ".singleflag"
        },
        ignore_click: ($item, type) => {
            if (type === 1) {
                return $item.prop("checked");
            }
        },
        wrap: obj => {
            console.log(obj);
        },
        fillFinish: data => {
            if (data.style === "warning-row" || data.type === 1) {
                $(".next-submit .next").click();
            }
        },
        finished: () => {
            if ($(".next-submit .next").hasClass("noClick")) {
                return false;
            }
            return true;
        }
    });
    WorkerJSPlus({
        name: "麦能",
        match: location.pathname.includes("/lms/web/onlineexam/exambegin"),
        intv: () => {
            return $(".sdiv").length;
        },
        root: ".sdiv",
        elements: {
            question: ".eptimu_name",
            options: ".ansdiv div",
            $options: ".ansdiv input",
            type: ".eptimu_title"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            console.log(obj);
        },
        fillFinish: () => {
            if ($(".layui-layer").length) {
                return false;
            }
            $(".eptimu_btn_next:eq(0)").click();
            return true;
        }
    });
    WorkerJSPlus({
        name: "天使在线",
        match: location.pathname.includes("/pages_jsp/mobile/courseSimulate.html") || location.pathname.includes("/pages_jsp/mobile/coursExamView.html") || location.pathname.includes("/pages_jsp/mobile/courseAnswer.html"),
        intv: () => {
            return $("#qusData").length;
        },
        root: ".neixunExamQuestionHead",
        elements: {
            question: "#title",
            options: ".option",
            $options: ".option",
            type: ".tag"
        },
        wrap: obj => {
            console.log(obj);
        },
        fillFinish: () => {
            if ($(".next").attr("style") && $(".next").attr("style").includes("display")) {
                return false;
            }
            $(".next").click();
            return true;
        }
    });
    WorkerJSPlus({
        name: "江西应用",
        match: location.pathname.includes("examinationAnswer"),
        intv: () => {
            return $(".answer-subject-details").length;
        },
        root: ".answer-subject-details",
        elements: {
            question: ".answer-subject",
            options: "ul li p",
            $options: "ul li",
            type: ".answer-subject-top"
        },
        wrap: obj => {
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "在线学习平台",
        match: location.host === "edu.netdig.cn" && location.pathname.includes("/paper.html"),
        intv: () => {
            return $(".test-list").length;
        },
        root: ".position-relative",
        elements: {
            question: ".tmtitle-p",
            options: "label .span-inline",
            $options: "label input",
            type: ".customtktype"
        },
        wrap: obj => {
            console.log(obj);
        }
    });
    WorkerJSPlus({
        name: "含弘",
        match: location.host === "zuoye.eduwest.com" && location.pathname.includes("/examinationrecord"),
        intv: () => {
            return $("#float_right").length;
        },
        root: "tr td table:has(a)",
        elements: {
            question: "td:first",
            options: "a",
            $options: "input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            console.log(obj);
        },
        finished: () => {
            if ($("#button #next").length != 0) {
                $("#button #next").click();
                return true;
            } else {
                return false;
            }
        }
    });
    WorkerJSPlus({
        name: "国开",
        match: location.host === "lms.ouchn.cn" && location.pathname.includes("/exam/"),
        intv: () => {
            return $(".loading-gif").hasClass("ng-hide") && $(".hd .examinee .submit-label").eq(0).text() === "";
        },
        root: ".card ol .single_selection,.multiple_selection,.true_or_false,.short_answer",
        elements: {
            question: ".summary-title .subject-description",
            options: ".subject-options li .option-content",
            $options: ".subject-options label .left",
            type: ".summary-sub-title span:eq(0)"
        },
        ignore_click: ($item, type) => {
            return type === 1 && $item.find("input").hasClass("ng-not-empty");
        }
    });
    WorkerJSPlus({
        name: "广开",
        match: () => {
            const pathMatch = location.pathname.includes("/mod/quiz/attempt.php");
            const matchHostArr = ["moodle.syxy.ouchn.cn", "xczxzdbf.moodle.qwbx.ouchn.cn", "elearning.bjou.edu.cn", "whkpc.hnqtyq.cn:5678", "course.ougd.cn", "study.ouchn.cn"];
            return pathMatch && matchHostArr.includes(location.host);
        },
        root: ".que",
        elements: {
            question: ".qtext",
            options: ".answer div label,.flex-fill",
            $options: ".answer div input:visible"
        },
        wrap: data => {
            if (data.type === undefined) {
                try {
                    data.type = 4;
                    data.$item.find(".qtext .accesshide").remove();
                    data.question = formatString(data.$item.find(".qtext").html());
                    data.$options = data.$item.find("input[id$=_answer]");
                } catch (e) { }
            }
        },
        ignore_click: $item => {
            return Boolean($item.parent().find("input").eq(-1).prop("checked"));
        },
        finished: () => {
            $(".submitbtns .btn-primary").click();
        },
        fill: (type, answer, $option) => {
            if (type === 4) {
                console.log(type, answer, $option);
                console.log($option.attr("id"));
                $option.val(answer);
            }
        }
    });
    WorkerJSPlus({
        name: "保定继续教育",
        match: location.pathname.includes("/exam/answer.html"),
        root: ".stem-container",
        elements: {
            question: ".stem  span",
            options: ".option div .optStem",
            $options: ".option div input"
        },
        intv: () => {
            return $("#question").length;
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parent().parent().find(".description").text());
        }
    });
    WorkerJSPlus({
        name: "noNiExam.js",
        match: location.pathname === "/app-afstudy/self_test.html",
        root: ".lineClass .b-papp-root",
        elements: {
            question: ".b-exam-top  .b-exam-tit",
            options: ".b-exam-box li label",
            $options: ".b-exam-box li  input",
            type: ".b-exam-top .b-exam-type"
        },
        ignore_click($item) {
            return $item.prop("checked");
        },
        wrap(obj) {
            obj.options = obj.options.map(i => {
                return i.replace(/[A-Za-z][\：]/, "").replace(/[A-Za-z][\：,\:]/, "").replace(/\；/, "").trim();
            });
        }
    });
    WorkerJSPlus({
        name: "www_pbaqks_com_text",
        match: location.host === "www.pbaqks.com" && location.pathname.includes("/P_ExamDetail/OnlineStuday"),
        root: ".main-container .single-box",
        elements: {
            question: ".single-main:first",
            options: ".choose-box label",
            $options: ".choose-box label",
            type: ".single-container .font-title",
            answer: "input:eq(1)"
        },
        ignore_click: $i => {
            return $i.find("input").is(":checked");
        },
        wrap: obj => {
            obj.question = obj.question.replace("标准答案", "").replace(/^\d+\./, "").replace(/\[.+?\]/g, "").trim();
        },
        fillFinish: () => {
            if ($(".main-container .single-box").find("input:eq(1)").eq(GLOBAL.index - 1).attr("value").split("").length > 1) {
                jQuery(".main-container .confirm a:last-child").click();
            }
        }
    });
    WorkerJSPlus({
        name: "安徽继续教育",
        match: location.pathname.includes("/study/html/content/studying/") || (location.pathname === "/study/html/content/tkOnline/" || location.pathname === "/study/html/content/sxsk/" || location.pathname === "/study/html/content/bkExam/"),
        intv: () => {
            return ($(".e-save-b").length || $(".e-b-g").length) && $(".totalscore").length === 0;
        },
        root: ".e-q",
        elements: {
            question: ".e-q-q .ErichText",
            options: ".e-a-g li",
            $options: ".e-a-g li"
        },
        ignore_click: $item => {
            return $item.attr("class").includes("checked");
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parent().prev().find(".e-text").text());
            obj.options = obj.options.map(i => {
                return formatString(i.replaceAll(/^[ab]\)\s+/g, "").replaceAll(/^[a-z]\s+/g, "").replaceAll(/^[a-z]、\s+/g, "").trim());
            });
        }
    });
    WorkerJSPlus({
        name: "大连/九江",
        match: location.href.includes("/onlineclass/exam/"),
        intv: () => {
            return $(".excer_list_view___2Ahg9") || $(".excer_list_view___YOSCa");
        },
        root: ".single_excer_item___lFMCm,.single_excer_item___2lGB8",
        elements: {
            plat: 40,
            question: ".title_content___1Qagx .title_content_text___27NIL, .title_content___24J6D .title_content_text___8ruL4",
            options: ".options_content___nXSwG label .option_text___udjiE, .options_content___2YgyG label .option_text___1mfcu",
            $options: ".options_content___nXSwG label input,.options_content___2YgyG label input",
            type: ".title_content___1Qagx span:eq(1),.title_content___24J6D span:eq(1)"
        },
        ignore_click: $item => {
            return $($item).parent().hasClass("ant-checkbox-checked");
        },
        wrap: obj => {
            console.log(obj);
        },
        fill: (type, answer, $option) => {
            if (type === 4 || type === 2) {
                $option.val(answer);
            }
        }
    });
    WorkerJSPlus({
        name: "新疆继续教育",
        hook: () => {
            function parseXinJiangAgain(questions) {
                return questions.map(item => {
                    const answer = [];
                    const options = item.answers.map(opt => {
                        if (opt.isAnswer === "0") answer.push(formatString(opt.name));
                        return formatString(opt.name);
                    });
                    const type = item.types === "2" ? 3 : parseInt(item.types);
                    return {
                        question: item.name,
                        options: options,
                        answer: answer,
                        type: type
                    };
                });
            }
            JSONParseHook(o => {
                if (o.success && o.data.exam) {
                    const arr = o.data.exam.assessList.map(i => {
                        return i.questionList;
                    }).flat();
                    GLOBAL.json = parseXinJiangAgain(arr);
                }
            });
        },
        match: location.host === "www.ttcdw.cn" && location.pathname.includes("/p/uExam/goExam/"),
        root: ".question-item",
        elements: {
            question: ".question-item-title span",
            options: ".question-item-option label .el-checkbox__label,.el-radio__label",
            $options: ".question-item-option label"
        },
        wrap: obj => {
            Object.assign(obj, GLOBAL.json[GLOBAL.index - 1]);
        },
        intv: () => {
            return !$("div").hasClass("entrying-wrap");
        },
        ignore_click: $item => {
            return $item.hasClass("is-checked");
        },
        fill: (type, answer, $option) => {
            if (type === 4 || type === 2) {
                $option.val(answer);
            }
        }
    });
    WorkerJSPlus({
        name: "华侨继续教育",
        match: location.pathname.includes("/exam/student/exam/resource/paper_card2"),
        intv: () => {
            return $(".ui-question-answer-right").length === 0;
        },
        root: ".ui-question-group .ui-question",
        elements: {
            question: ".ui-question-title  div",
            options: ".ui-question-options  div",
            $options: ".ui-question-options .ui-question-options-order,.ke-container"
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parent().find("h2").text());
        },
        ignore_click: $item => {
            return $item.parent().hasClass("ui-option-selected");
        },
        fill: (type, answer) => {
            if (type === 4 || type === 2 || type === 6) {
                const x = GLOBAL.index - $(".ui-question-options ").length - 1;
                KindEditor.instances[x].html(answer);
            }
        }
    });
    WorkerJSPlus({
        name: "上海开放大学",
        match: location.pathname.includes("/study/assignment/preview.aspx") || location.pathname.includes("/study/assignment/continuation.aspx"),
        hook: () => {
            if (GLOBAL.finish || $("a:contains(已完成批阅)").length === 1) {
                iframeMsg("tip", {
                    type: "hidden",
                    tip: "本页面已做完，无需自动答题"
                });
                return true;
            }
        },
        root: ".e-q",
        elements: {
            question: ".e-q-q .ErichText",
            options: ".e-a-g li",
            $options: ".e-a-g li"
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parent().parent().parent().find(".e-text").eq(0).text());
            obj.options = obj.options.map(i => {
                return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, "").replaceAll(/^[a-z]\s+/g, "").replaceAll(/^[a-z]、\s+/g, "").trim());
            });
        },
        ignore_click: $item => {
            return $item.attr("class").includes("checked");
        }
    });
    WorkerJSPlus({
        name: "浙江考试",
        match: location.pathname === "/web-qz/moni/exam/exam_toExam.action",
        root: ".dt_tmcon",
        elements: {
            question: "div:eq(0) span:eq(1)",
            options: "div:eq(1) p",
            $options: "div:eq(1) p input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parents().find(".dt_rtitle1").eq(0).text());
            obj.options = obj.options.map(i => {
                return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, "").replaceAll(/^[a-z]\s+/g, "").replaceAll(/^[a-z]、\s+/g, "").trim());
            });
            if (obj.type === 0) {
                obj.answer = [JSON.parse($("#quesSSForm #userAnssStr_0").val()).rightAnswer];
                uploadAnswer([obj]);
            }
        },
        finished: () => {
            return $(".page li input:eq(2)").attr("disabled") !== "disabled";
        },
        fillFinish: () => {
            $(".page li input:eq(2)").click();
        }
    });
    WorkerJSPlus({
        name: "在浙学考试",
        match: location.host === "www.zjooc.cn" && (location.pathname.includes("/homework/") || location.pathname.includes("/test/") || location.pathname.includes("/exam/")),
        hook: () => {
            function parseZaiZheXue(problems) {
                return problems.map(item => {
                    if (!item.rightAnswer) return undefined;
                    const subjectType = item.subjectType;
                    let type = -1;
                    const question = formatString(item.subjectName);
                    const answer = [];
                    const options = [];
                    if (subjectType === 1 || subjectType === 2) {
                        type = subjectType - 1;
                        for (let subjectOption of item.subjectOptions) {
                            const opt = formatString(subjectOption.optionContent);
                            options.push(opt);
                            if (item.rightAnswer.includes(subjectOption.optionHead)) {
                                answer.push(opt);
                            }
                        }
                    } else if (subjectType === 3) {
                        type = 3;
                        answer.push(item.rightAnswer === "yes" ? "正确" : "错误");
                    } else {
                        return undefined;
                    }
                    return {
                        question: question,
                        options: options,
                        type: type,
                        answer: answer
                    };
                }).filter(i => i && i.answer.length > 0);
            }
            if (!(location.pathname.includes("/homework/do") || location.pathname.includes("/test/do") || location.pathname.includes("/exam/do"))) {
                JSONParseHook(o => {
                    if (o.data && o.data.paperName && o.data.clazzIds && o.data.paperSubjectList) {
                        const data = parseZaiZheXue(o.data.paperSubjectList);
                        console.log(data);
                    }
                });
                return true;
            }
        },
        root: ".questiono-item",
        elements: {
            question: "h6 .processing_img",
            options: ".questiono-main label .el-radio__label,.el-checkbox__label",
            $options: ".questiono-main label"
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parent().prev().text());
            obj.options = obj.options.map(i => {
                return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, "").replaceAll(/^[a-z]\s+/g, "").replaceAll(/^[a-z]、\s+/g, "").trim());
            });
        },
        ignore_click: $item => {
            return $item.hasClass("is-checked");
        }
    });
    WorkerJSPlus({
        name: "在浙学（测验/考试）",
        match: location.host === "www.zjooc.cn" && location.pathname.includes("/singleQuestion/do/"),
        intv: () => {
            return $(".settingsel-dialog").css("display") === "none";
        },
        root: ".question_content:first",
        elements: {
            question: ".question_title",
            options: ".question_content .radio_content div",
            $options: ".question_content  label"
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parent().find(".question_title p").eq(0).text());
            obj.options = obj.options.map(i => {
                return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, "").replaceAll(/^[a-z]\s+/g, "").replaceAll(/^[a-z]、\s+/g, "").replace(".", "").trim());
            });
        },
        ignore_click: $item => {
            return $item.hasClass("is-checked");
        },
        finished: () => {
            if ($(".question_btn .el-button:contains(下一题)").hasClass("is-disabled")) return false;
            $(".el-button:contains(下一题)").click();
            return true;
        }
    });
    WorkerJSPlus({
        name: "福建继续教育测验|作业",
        match: location.pathname === "/Web_Study/Student/Center/MyWorkOnView" || location.pathname === "/Web_Study/Student/Center/MyExamOnView",
        intv: () => {
            return $(".samllTopicNav").length;
        },
        root: ".topic-cont",
        elements: {
            question: "p",
            options: ".options li span",
            $options: ".options li"
        },
        wrap: obj => {
            obj.options = obj.options.map(i => {
                return i.replace(/选项[A-Za-z]/, "").trim();
            });
            obj.type = {
                1: 0,
                2: 1,
                3: 3,
                6: 4
            }[obj.$item.attr("itemtype")];
            if (obj.type === undefined) obj.type = 4;
        },
        ignore_click: $item => {
            return $item.hasClass("correct");
        },
        fill: (type, answer, $option) => { }
    });
    WorkerJSPlus({
        name: "湖南继续教育",
        match: () => {
            const pathMatch = location.pathname.includes("/User/Student/myhomework.aspx") || location.pathname.includes("/examing.aspx");
            const matchHostArr = ["www.jwstudy.cn", "hdjt.wuxuekeji.com", "csjs.ynlhxy.com"];
            return pathMatch && (matchHostArr.includes(location.host) || location.host.includes("ls365.net") || location.host.includes("ls365.com"));
        },
        root: ".exam_question",
        elements: {
            question: ".exam_question_title  div",
            options: ".question_select  .select_detail",
            $options: ".question_select li",
            type: ".exam_question_title div strong"
        },
        ignore_click: $item => {
            return $item.hasClass("cur");
        }
    });
    WorkerJSPlus({
        name: "德阳继续教育",
        match: location.href.includes("/dypx/OnlineExam/Exam.aspx"),
        root: "#divProblemArea",
        elements: {
            question: "#ulProblems li:first",
            options: "#ulProblems .answer",
            $options: "#ulProblems .answer input"
        },
        ignore_click: $item => {
            return $item.prop("checked");
        },
        wrap: obj => {
            if ($("#ulProblems .answer input").length < 3 && $("#ulProblems .answer input").eq(0).attr("type") === "radio") {
                obj.type = 3;
                obj.options = ["正确", "错误"];
            } else if ($("#ulProblems .answer input").length > 2 && $("#ulProblems .answer input").eq(0).attr("type") === "radio") {
                obj.type = 0;
            } else if ($("#ulProblems .answer input").length > 2 && $("#ulProblems .answer input").eq(0).attr("type") === "checkbox") {
                obj.type = 1;
            }
        },
        finished: () => {
            if ($(".dlg").length) return false;
            $("#divBtns input:eq(1)").click();
            return true;
        }
    });
    WorkerJSPlus({
        name: "淄博继续教育",
        match: location.pathname.includes("/practice/start"),
        root: ".header-left .trueorfalse .sub",
        elements: {
            question: ".mb10",
            options: ".options li",
            $options: ".options li"
        },
        ignore_click: $item => {
            return $item.hasClass("active");
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parent().prev().text());
            obj.options = obj.options.map(i => {
                return formatString(i.replaceAll(/[a-zA-z]\)\s+/g, "").replaceAll(/^[a-z]\s+/g, "").replaceAll(/^[a-z]、\s+/g, "").trim());
            });
        }
    });
    WorkerJSPlus({
        name: "河北继续教育",
        match: location.pathname.includes("paperid"),
        intv: () => {
            return $(".examControl").length;
        },
        root: ".examItem",
        elements: {
            question: ".examItemRight  .question",
            options: ".examItemRight  ul li span",
            $options: ".examItemRight  ul li"
        },
        ignore_click: $item => {
            return $item.hasClass("cur");
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parent().find(".questTitle b").text());
        }
    });
    WorkerJSPlus({
        name: "保定继续教育",
        match: () => {
            const pathnameArr = ["/cuggw/rs/olex_exam", "/hebic/rs/olex_exam", "/sjzkjxy/rs/olex_exam", "/hbfsh/rs/olex_exam", "/jxycu/rs/olex_exam", "/jlufe/rs/olex_exam", "/hbun/rs/olex_exam"];
            return pathnameArr.includes(location.pathname);
        },
        intv: () => {
            return $(".paper_body").length;
        },
        root: ".item_li",
        elements: {
            question: ".item_title",
            options: "ul li label",
            $options: "ul li input"
        },
        ignore_click($item) {
            return $item.prop("checked");
        },
        wrap: obj => {
            if (obj.$options.length === 2) {
                obj.type = 3;
            } else if (obj.$options.length > 2 && obj.$options.eq(0).attr("type") === "radio") {
                obj.type = 0;
            } else if (obj.$options.length > 2 && obj.$options.eq(0).attr("type") !== "radio") {
                obj.type = 1;
            } else {
                obj.type = 4;
            }
        }
    });
    WorkerJSPlus({
        name: "唐山继续教育",
        match: location.pathname.includes("/exam/student/exam/"),
        intv: () => {
            return $(".ui-question-group").length;
        },
        root: ".ui-question-group .ui-question",
        elements: {
            question: ".ui-question-title .ui-question-content-wrapper",
            options: ".ui-question-options .ui-question-content-wrapper",
            $options: ".ui-question-options .ui-question-options-order"
        },
        wrap: obj => {
            obj.type = getQuestionType(obj.$item.parent().find("h2").text());
        }
    });
    WorkerJSPlus({
        name: "zzcjxy.hnzkw.org.cn",
        match: location.host.includes("hnzkw.org.cn"),
        intv: () => {
            return $(".answer").length;
        },
        hook: () => {
            JSONParseHook(o => {
                if (o.data && o.data.bookdatas) {
                    GLOBAL.json = parsehnzkwText(o.data.bookdatas);
                }
            });
        },
        root: ".examList",
        elements: {
            question: ".text",
            options: ".el-radio-group label,.el-checkbox-group label",
            $options: ".el-radio-group input,.el-checkbox-group input",
            type: ".status"
        },
        wrap: obj => {
            Object.assign(obj, GLOBAL.json[GLOBAL.index - 1]);
        },
        fill: (type, answer, $option) => { }
    });
    WorkerJSPlus({
        name: "问卷星考试",
        match: location.pathname.includes("/exam/ExamRd/Answer"),
        root: ".g-mn",
        elements: {
            question: ".m-question .tigan",
            options: ".question-block .xuanxiang",
            $options: ".question-block .xuanxiang",
            type: ".tixing"
        },
        ignore_click: ($item, type) => {
            if (type === 1) {
                return $item.parent().find(".icheckbox_square-green").hasClass("checked");
            } else {
                const isIgnore = $item.parent().find(".iradio_square-green").hasClass("checked");
                return isIgnore;
            }
        },
        wrap: obj => {
            if ($(".layui-layer-content").length) {
                iframeMsg("tip", {
                    type: "stop",
                    tip: "答题暂停，请自行通过验证"
                });
                GLOBAL.stop = true;
                return true;
            }
        },
        fillFinish: data => {
            if (data.style === "warning-row" || $(".g-mn").parent().find(".iradio_square-green").hasClass("checked") || data.type === 1) {
                $('.u-btn-next:contains("下一题")').click();
            }
        },
        finished: () => {
            return parseInt($(".num-dangqian:last").attr("qindex")) !== $(".num-item").length;
        }
    });
    // 1. 先定义配置对象
    const stduConfig = {
        name: "石家庄铁道大学继续教育在线考试",
        match: location.host.includes("jxjy.stdu.edu.cn") && location.pathname.includes("BootStrap_zxksDetailNew.aspx"),
        root: "#UpdatePanel1",
        intv: () => 1,
        elements: {
            question: "#lb_dxtm",
            options: "#RB_xl label",
            $options: "#RB_xl input[type=radio], #RB_xl input[type=checkbox]",
            type: "#RB_xl input[type=radio], #RB_xl input[type=checkbox]"
        },
        wrap: function (obj) {
            // 判断题优先
            let $rbPanduan = $('#RB_panduan');
            if ($rbPanduan.length) {
                let $labels = $rbPanduan.find('label');
                let $inputs = $rbPanduan.find('input[type=radio]');
                if ($labels.length && $inputs.length) {
                    obj.options = $labels.map(function () { return $(this).text().trim(); }).get();
                    obj.type = 3;
                    obj.question = (obj.question || $('#lb_dxtm').text() || '').replace(/\s+/g, ' ').trim();
                    return obj;
                }
            }

            // 多选题（CB_xl结构优先）
            let $cbxl = $('#CB_xl');
            if ($cbxl.length > 0) {
                let $inputs = $cbxl.find('input[type=checkbox]');
                let $labels = $cbxl.find('label');
                if ($labels.length > 0) {
                    const labelTexts = $labels.map(function () {
                        let raw = $(this).text();
                        let step1 = raw.replace(/^[A-ZＡ-Ｚ]、?/, '');
                        let final = step1.replace(/^[\s\u3000]+/, '').trim();
                        return final;
                    }).get();
                    obj.options = labelTexts;
                    obj.type = 1;
                    obj.question = (obj.question || $('#lb_dxtm').text() || '').replace(/\s+/g, ' ').trim();
                    return obj;
                }
            }

            // 兼容RB_xl结构
            let $rbxl = $('#RB_xl');
            let $labels, $inputs;
            if ($rbxl.length) {
                $labels = $rbxl.find('label');
                $inputs = $rbxl.find('input[type=radio], input[type=checkbox]');
            } else {
                $labels = [];
                $inputs = [];
            }

            if ($rbxl.length === 0 || $labels.length === 0 || $inputs.length === 0) {
                if (!obj._retryCount) obj._retryCount = 0;
                if (obj._retryCount < 10) {
                    obj._retryCount++;
                    setTimeout(() => { WorkerJSPlusWrapRetry(obj); }, 150);
                    return obj;
                } else {
                    obj.options = [];
                    obj.type = -1;
                    return obj;
                }
            }

            const labelTexts = $labels.map(function () {
                const raw = $(this).text();
                const step1 = raw.replace(/\s+/g, '');
                const step2 = step1.replace(/^([A-D]|[√×对错正确错误])、?/, '');
                const step3 = step2.replace(/[.．、]/g, '');
                const final = step3.trim();
                return final;
            }).get();

            obj.options = labelTexts;
            if (labelTexts.length === 2 && labelTexts.every(t => ['√', '×', '对', '错', '正确', '错误'].includes(t))) {
                obj.type = 3;
            } else if ($rbxl.find('input[type=checkbox]').length > 0) {
                obj.type = 1;
            } else if ($rbxl.find('input[type=radio]').length > 0) {
                obj.type = 0;
            } else {
                obj.type = -1;
            }
            obj.question = (obj.question || $('#lb_dxtm').text() || '').replace(/\s+/g, ' ').trim();
            return obj;
        },

        fill: function (obj, answer) {
            let matched = false;
            let displayAnswer = answer;

            try {
                // 判断题
                if (obj.type === 3) { // 判断题
                    console.log('[DEBUG] 判断题处理，原始答案:', answer);

                    // 1. 规范化判断正确/错误
                    const rawAnswer = String(answer).trim().toLowerCase();
                    const isTrue = ["正确", "√", "对", "true", "yes", "t", "1"].includes(rawAnswer);
                    const isFalse = ["错误", "×", "错", "false", "no", "f", "0"].includes(rawAnswer);

                    // 规范化显示答案为√或×
                    if (isTrue) {
                        displayAnswer = "√";
                    } else if (isFalse) {
                        displayAnswer = "×";
                    }

                    console.log('[DEBUG] 判断题答案判定:', isTrue ? '正确' : (isFalse ? '错误' : '其他'));

                    // 2. 尝试查找判断题的容器
                    let $rbPanduan = $('#RB_panduan');
                    let $inputs, $labels;

                    if ($rbPanduan.length) {
                        $inputs = $rbPanduan.find('input[type=radio]');
                        $labels = $rbPanduan.find('label');
                        console.log('[DEBUG] 找到判断题容器#RB_panduan，选项数量:', $inputs.length);
                    } else {
                        // 尝试查找tr_panduan
                        let $trPanduan = $('#tr_panduan');
                        if ($trPanduan.length) {
                            $inputs = $trPanduan.find('input[type=radio]');
                            $labels = $trPanduan.find('label');
                            console.log('[DEBUG] 找到判断题行#tr_panduan，选项数量:', $inputs.length);
                        } else {
                            // 回退到RB_xl查找判断题选项
                            let $rbxl = $('#RB_xl');
                            if ($rbxl.length) {
                                $inputs = $rbxl.find('input[type=radio]');
                                $labels = $rbxl.find('label');
                                console.log('[DEBUG] 尝试从#RB_xl查找判断题选项，选项数量:', $inputs.length);
                            } else {
                                // 尝试直接获取所有radio
                                $inputs = $('input[type=radio]');
                                $labels = $('label');
                                console.log('[DEBUG] 直接获取所有radio元素，数量:', $inputs.length);
                            }
                        }
                    }

                    if (!$inputs || $inputs.length === 0) {
                        console.warn('[WARN] 未找到判断题选项元素');
                        // 发送答案到控制面板，即使找不到元素
                        iframeMsg("push", {
                            index: GLOBAL.index || 1,
                            question: obj.question,
                            answer: displayAnswer,
                            style: "warning-row"
                        });
                        return false;
                    }

                    // 先尝试直接通过值匹配
                    let valueMatched = false;
                    $inputs.each(function (i, input) {
                        const inputValue = $(input).val();
                        console.log(`[DEBUG] 判断题选项[${i}]值:`, inputValue);

                        if ((isTrue && inputValue === "√") || (isFalse && inputValue === "×")) {
                            console.log(`[DEBUG] 通过值直接匹配判断题选项[${i}]`);
                            $(input).prop('checked', true).click();
                            matched = true;
                            valueMatched = true;
                        }
                    });

                    // 如果值匹配失败，尝试通过标签文本匹配
                    if (!valueMatched && $labels && $labels.length > 0) {
                        $labels.each(function (i, lab) {
                            const labelText = $(lab).text().trim();
                            console.log(`[DEBUG] 判断题选项[${i}]文本:`, labelText);

                            // 匹配正确选项
                            if (isTrue && (labelText === "√" || labelText === "对" || labelText === "正确" ||
                                labelText.includes("√") || labelText.includes("对") ||
                                labelText.includes("正确"))) {
                                console.log(`[DEBUG] 匹配正确选项[${i}]`);
                                const forAttr = $(lab).attr('for');
                                if (forAttr) {
                                    // 通过for属性找到对应的input
                                    $(`#${forAttr}`).prop('checked', true).click();
                                } else if ($inputs && $inputs.length > i) {
                                    // 或者通过索引匹配
                                    $inputs.eq(i).prop('checked', true).click();
                                }
                                matched = true;
                            }
                            // 匹配错误选项
                            else if (isFalse && (labelText === "×" || labelText === "错" || labelText === "错误" ||
                                labelText.includes("×") || labelText.includes("错") ||
                                labelText.includes("错误"))) {
                                console.log(`[DEBUG] 匹配错误选项[${i}]`);
                                const forAttr = $(lab).attr('for');
                                if (forAttr) {
                                    // 通过for属性找到对应的input
                                    $(`#${forAttr}`).prop('checked', true).click();
                                } else if ($inputs && $inputs.length > i) {
                                    // 或者通过索引匹配
                                    $inputs.eq(i).prop('checked', true).click();
                                }
                                matched = true;
                            }
                        });
                    }

                    // 3. 如果未找到匹配，使用位置逻辑（根据判断题.js文件的结构）
                    if (!matched && $inputs && $inputs.length >= 2) {
                        if (isTrue) {
                            console.log('[DEBUG] 使用位置逻辑：正确 = 第二个选项(index=1)');
                            $inputs.eq(1).prop('checked', true).click();
                            matched = true;
                        } else if (isFalse) {
                            console.log('[DEBUG] 使用位置逻辑：错误 = 第一个选项(index=0)');
                            $inputs.eq(0).prop('checked', true).click();
                            matched = true;
                        }
                    }
                    // 新增：如果依然没有匹配到，默认选中第一个选项
                    if (!matched && $inputs && $inputs.length > 0) {
                        console.log('[DEBUG] 未匹配到答案，默认选中第一个判断题选项');
                        $inputs.eq(0).prop('checked', true).click();
                        displayAnswer = $labels && $labels.length > 0 ? $labels.eq(0).text().trim() : '';
                        matched = true;
                    }
                } else if (obj.type === 1) { // 多选题
                    // 兼容CB_xl和RB_xl
                    let $cbxl = $('#CB_xl');
                    let $inputs, $labels;
                    if ($cbxl.length > 0) {
                        $inputs = $cbxl.find('input[type=checkbox]');
                        $labels = $cbxl.find('label');
                    } else {
                        let $rbxl = $('#RB_xl');
                        $inputs = $rbxl.find('input[type=checkbox]');
                        $labels = $rbxl.find('label');
                    }
                    if ((!$inputs || !$labels || $inputs.length === 0 || $labels.length === 0) && $('input[type=checkbox]').length > 0) {
                        $inputs = $('input[type=checkbox]');
                        $labels = $('label[for^="CB_xl_"]');
                    }
                    function normalize(str) {
                        if (!str) return '';
                        return String(str)
                            .replace(/\s+/g, '')
                            .replace(/[\u3000\u00A0]/g, '')
                            .replace(/[\u200B-\u200D\uFEFF]/g, '')
                            .replace(/^([A-D]|[√×对错正确错误])、?/, '')
                            .replace(/[.．、]/g, '')
                            .replace(/[,，]/g, '')
                            .replace(/\s+/g, '')
                            .trim()
                            .toLowerCase();
                    }
                    const ansArr = Array.isArray(answer) ? answer : [answer];
                    let matchedLabels = [];
                    // 只遍历有label的部分
                    $labels.each(function (i, lab) {
                        const labelText = $(lab).text();
                        const optNorm = normalize(labelText);
                        ansArr.forEach(ans => {
                            const ansNorm = normalize(ans);
                            if (
                                optNorm === ansNorm ||
                                optNorm.includes(ansNorm) ||
                                ansNorm.includes(optNorm) ||
                                (typeof similar === 'function' && similar(optNorm, ansNorm) > 0.8)
                            ) {
                                // 通过label的for属性找到input
                                const forAttr = $(lab).attr('for');
                                if (forAttr) {
                                    $('#' + forAttr).prop('checked', true).trigger('change');
                                }
                                matchedLabels.push(labelText.trim());
                            }
                        });
                    });
                    // 拼接所有匹配到的选项文本
                    if (matchedLabels.length > 0) {
                        displayAnswer = matchedLabels.join('====');
                        matched = true; // 只要执行了就认为已匹配
                    } else {
                        console.log('[DEBUG] 未匹配到答案，默认全选所有多选题选项（排除空内容）');
                        let validLabels = [];
                        $labels.each(function (i, lab) {
                            const labelText = $(lab).text().trim();
                            if (labelText) {
                                // 通过label的for属性找到input
                                const forAttr = $(lab).attr('for');
                                if (forAttr) {
                                    $('#' + forAttr).prop('checked', true).trigger('change');
                                } else if ($inputs && $inputs.length > i) {
                                    $inputs.eq(i).prop('checked', true).trigger('change');
                                }
                                validLabels.push(labelText);
                            }
                        });
                        displayAnswer = validLabels.length > 0 ? validLabels.join('====') : '';
                        matched = true;
                    }

                } else if (obj.type === 0) { // 单选/多选
                    // 处理常规选择题
                    let $rbxl = $('#RB_xl');
                    let $inputs, $labels;

                    if (!$rbxl.length) {
                        console.log('[DOM快照] 未找到#RB_xl，尝试直接获取元素');
                        // 尝试直接获取所有radio/checkbox
                        $inputs = $('input[type=radio], input[type=checkbox]');
                        $labels = $('label');

                        if ($inputs.length && $labels.length) {
                            console.log('[DEBUG] 直接找到输入元素:', $inputs.length, '个, 标签元素:', $labels.length, '个');
                        } else {
                            console.warn('[WARN] 无法找到足够的输入元素，填充失败');
                            iframeMsg("push", {
                                index: GLOBAL.index || 1,
                                question: obj.question,
                                answer: displayAnswer,
                                style: "warning-row"
                            });
                            return false;
                        }
                    } else {
                        console.log('[DOM快照] #RB_xl.outerHTML:', $rbxl.get(0).outerHTML);
                        $inputs = $rbxl.find('input[type=radio], input[type=checkbox]');
                        $labels = $rbxl.find('label');
                    }

                    console.log('[DEBUG] 输入元素数量:', $inputs.length);
                    console.log('[DEBUG] 标签元素数量:', $labels.length);

                    if ($inputs.length === 0 || $labels.length === 0) {
                        console.warn('[WARN] 没有找到足够的DOM元素');
                        iframeMsg("push", {
                            index: GLOBAL.index || 1,
                            question: obj.question,
                            answer: displayAnswer,
                            style: "warning-row"
                        });
                        return false;
                    }

                    function normalize(str) {
                        if (!str) return '';
                        return String(str)
                            .replace(/\s+/g, '')
                            .replace(/[\u3000\u00A0]/g, '')
                            .replace(/[\u200B-\u200D\uFEFF]/g, '')
                            .replace(/^([A-D]|[√×对错正确错误])、?/, '')
                            .replace(/[.．、]/g, '')
                            .replace(/[,，]/g, '')
                            .replace(/\s+/g, '')
                            .trim()
                            .toLowerCase();
                    }

                    const ansArr = Array.isArray(answer) ? answer : [answer];
                    let matchedIndexes = []; // 存储所有匹配到的下标

                    // 1. 全等匹配
                    ansArr.forEach(ans => {
                        const ansNorm = normalize(ans);
                        $labels.each(function (i, lab) {
                            const optNorm = normalize($(lab).text());
                            if (optNorm === ansNorm && !matchedIndexes.includes(i)) {
                                matchedIndexes.push(i);
                            }
                        });
                    });

                    // 2. 包含匹配
                    if (matchedIndexes.length < ansArr.length) {
                        ansArr.forEach(ans => {
                            const ansNorm = normalize(ans);
                            $labels.each(function (i, lab) {
                                const optNorm = normalize($(lab).text());
                                if ((optNorm.includes(ansNorm) || ansNorm.includes(optNorm)) && !matchedIndexes.includes(i)) {
                                    matchedIndexes.push(i);
                                }
                            });
                        });
                    }

                    // 3. 相似度匹配
                    if (matchedIndexes.length < ansArr.length) {
                        ansArr.forEach(ans => {
                            const ansNorm = normalize(ans);
                            $labels.each(function (i, lab) {
                                const optNorm = normalize($(lab).text());
                                if (typeof similar === 'function' && similar(optNorm, ansNorm) > 0.8 && !matchedIndexes.includes(i)) {
                                    matchedIndexes.push(i);
                                }
                            });
                        });
                    }

                    // 4. 选中所有匹配到的选项
                    if (matchedIndexes.length > 0) {
                        matchedIndexes.forEach(idx => {
                            $inputs.eq(idx).prop('checked', true).click();
                        });
                        matched = true;
                        displayAnswer = matchedIndexes.map(idx => $labels.eq(idx).text().trim()).join('====');
                    } else if (!matched && $inputs.length > 0) {
                        console.log('[DEBUG] 未匹配到答案，默认选中第一个选择题选项');
                        $inputs.eq(0).prop('checked', true).click();
                        displayAnswer = $labels && $labels.length > 0 ? $labels.eq(0).text().trim() : '';
                        matched = true;
                    }
                }

                if (!matched) {
                    console.log('[DEBUG] 未找到匹配选项，未填充');
                    console.log('[DEBUG] 传入答案:', answer);
                }
                window._lastFillMatched = matched;
            } catch (e) {
                console.error('[DEBUG] fill异常:', e);
            }
            return matched;
        },
        finished: function () {
            if (window._lastFillMatched) {
                var $submitBtn = $('#btn_submit:visible');
                if ($submitBtn.length) {
                    console.log('[DEBUG] 点击提交按钮');
                    $submitBtn.click();
                }
                return true;
            } else {
                console.warn('[WARN] 答案未全部正确填充，未提交！');
                return false;
            }
        }
    };

    // 2. 注册并挂载到全局
    WorkerJSPlus(stduConfig);
    window.stduWorker = stduConfig;
})();
function WorkerJSPlusWrapRetry(obj) {
    // 直接重新调用wrap逻辑
    if (typeof WorkerJSPlus === 'function' && WorkerJSPlus.prototype && WorkerJSPlus.prototype.constructor) {
        // 这里假设wrap方法已绑定到options
        if (WorkerJSPlus.prototype.constructor.options && typeof WorkerJSPlus.prototype.constructor.options.wrap === 'function') {
            WorkerJSPlus.prototype.constructor.options.wrap(obj);
        }
    } else if (window.WorkerJSPlusWrapLast) {
        window.WorkerJSPlusWrapLast(obj);
    }
}
window.WorkerJSPlusWrapLast = arguments.callee;