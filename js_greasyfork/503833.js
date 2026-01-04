// ==UserScript==
// @name              亚马逊采集翻译助手
// @namespace         https://www.amazon.com/
// @version           3.0
// @description       在亚马逊商品详情页面，按下快捷键（默认为f9），可自动翻译文字。已支持超过 14 种语言,更新提示词库。
// @license           MIT
// @homepage          https://www.youxiaohou.com/tool/install-translate.html
// @supportURL        https://github.com/syhyz1990/translate
// @match             *://*/*
// @require           https://unpkg.com/jquery@3.7.0/dist/jquery.min.js
// @require           https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @require           https://unpkg.com/hotkeys-js@3.13.3/dist/hotkeys.min.js
// @resource          swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @connect           translate.google.com
// @connect           www.bing.com
// @connect           translate.alibaba.com
// @connect           ifanyi.iciba.com
// @connect           transmart.qq.com
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_setClipboard
// @grant             GM_xmlhttpRequest
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiPjxwYXRoIGQ9Ik02NTguMyA0MDIuM2gyOTIuNmM0MC40IDAgNzMuMSAzMi41IDczLjEgNzMuMUg0NzUuNGMtNDAuNCAwLTczLjEtMzIuNS03My4xLTczLjFWNjU4LjNoMTQ2LjNjNjAuOSAwIDEwOS43LTQ5LjEgMTA5LjctMTA5LjdWNDAyLjN6TTAgNzMuMUMwIDMyLjcgMzIuNSAwIDczLjEgMGg0NzUuNGM0MC40IDAgNzMuMSAzMi41IDczLjEgNzMuMXY0NzUuNGMwIDQwLjQtMzIuNSA3My4xLTczLjEgNzMuMUg3My4xYy00MC40LjEtNzMuMS0zMi40LTczLjEtNzNWNzMuMXptMTQ2LjMgMzE1LjhoNTMuNHYtMjguM2g3N3YxMzUuMmg1Ni42VjM2MC42aDc4LjZ2MjMuNkg0NzBWMjA1SDMzMy4zdi0zOS4zYzAtMTEuNSAxLjYtMjEuNSA0LjgtMjkuOC44LTEuNSAxLjQtMy4xIDEuNS00LjggMC0xLTMuNy0yLTExLTMuMWgtNTMuNXY3N0gxNDYuM3YxODMuOXpNMTk5LjcgMjQ5aDc3djY5LjFoLTc3VjI0OXptMjEyLjIgNjkuMWgtNzguNlYyNDloNzguNnY2OS4xem0yMzIuOSA1NTcuN2wyMi02MS4zaDExNC43bDIyIDYxLjNoNjIuOGwtMTAyLTI5MC43aC03My45TDU4NS4xIDg3NS45bDU5LjctLjF6bTM3LjgtMTEwTDcyNSA2NDEuN2gxLjZsMzkuMyAxMjQuMWgtODMuM3ptMjY4LjMtNDczLjJoLTczLjFjMC04MC44LTY1LjUtMTQ2LjMtMTQ2LjMtMTQ2LjNWNzMuMWMxMjEuMSAwIDIxOS40IDk4LjMgMjE5LjQgMjE5LjV6TTczLjEgNzMxLjRoNzMuMWMwIDgwLjggNjUuNSAxNDYuMyAxNDYuMyAxNDYuM3Y3My4xYy0xMjEuMS4xLTIxOS40LTk4LjItMjE5LjQtMjE5LjQtMjE5LjR6IiBmaWxsPSIjZDgxZDQ1Ii8+PC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/503833/%E4%BA%9A%E9%A9%AC%E9%80%8A%E9%87%87%E9%9B%86%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/503833/%E4%BA%9A%E9%A9%AC%E9%80%8A%E9%87%87%E9%9B%86%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 翻译源选择字典
    const transdict = {
        '谷歌翻译': translate_gg,
        '谷歌翻译mobile': translate_ggm,
        '有道翻译mobile': translate_youdao_mobile,
        '必应翻译': translate_biying,
        '阿里翻译': translate_alibaba,
        '爱词霸翻译': translate_icib,
        '腾讯AI翻译': translate_tencentai,
    };

    // 获取当前选中的翻译源
    const translateSourceName = GM_getValue("translateSource", "谷歌翻译");

    // 动态创建菜单命令，允许用户选择翻译源
    for (let key in transdict) {
        const name = key;
        GM_registerMenuCommand(name === translateSourceName ? "🟢" + name : "⚪" + name, () => changeTranslateSource(name));
    }

    // 切换翻译源
    function changeTranslateSource(source) {
        GM_setValue("translateSource", source);
        window.location.reload();
    }

    // 获取当前的翻译函数
    function getTranslateFunc() {
        return transdict[translateSourceName] || transdict["谷歌翻译"];
    }

    // 发送请求的封装
    function Request(options) {
        return new Promise((resolve, reject) => GM_xmlhttpRequest({ ...options, onload: resolve, onerror: reject }));
    }

    // 重试机制封装
    async function promiseRetryWrap(task, options, ...values) {
        const { RetryTimes, ErrProcesser } = options || {};
        let retryTimes = RetryTimes || 5;
        const usedErrProcesser = ErrProcesser || (err => { throw err });
        if (!task) return;
        while (true) {
            try {
                return await task(...values);
            } catch (err) {
                if (!--retryTimes) {
                    console.log(err);
                    return usedErrProcesser(err);
                }
            }
        }
    }

    // 基础翻译函数
    async function baseTranslate(name, raw, options, processer) {
        const toDo = async () => {
            var tmp;
            try {
                const data = await Request(options);
                tmp = data.responseText;
                const result = await processer(tmp);
                if (result) sessionStorage.setItem(name + '-' + raw, result);
                return result;
            } catch (err) {
                throw {
                    responseText: tmp,
                    err: err
                };
            }
        }
        return await promiseRetryWrap(toDo, { RetryTimes: 3, ErrProcesser: () => "翻译出错" });
    }

    // 各种翻译接口的实现
    async function translate_alibaba(raw) {
        const options = {
            method: 'POST',
            url: 'https://translate.alibaba.com/translationopenseviceapp/trans/TranslateTextAddAlignment.do',
            data: `srcLanguage=auto&tgtLanguage=zh&bizType=message&srcText=${encodeURIComponent(raw)}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "origin": "https://translate.alibaba.com",
                "referer": "https://translate.alibaba.com/",
                "sec-fetch-site": "same-origin",
            }
        };
        return await baseTranslate('阿里翻译', raw, options, res => JSON.parse(res).listTargetText[0]);
    }

    async function translate_tencentai(raw) {
        const data = {
            "header": {
                "fn": "auto_translation"
            },
            "type": "plain",
            "model_category": "normal",
            "text_domain": "general",
            "source": {
                "lang": "auto",
                "text_list": [raw]
            },
            "target": {
                "lang": "auto"
            }
        };
        const options = {
            method: 'POST',
            url: 'https://transmart.qq.com/api/imt',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Host': 'transmart.qq.com',
                'Origin': 'https://transmart.qq.com',
                'Referer': 'https://transmart.qq.com/'
            },
            anonymous: true,
            nocache: true,
        };
        return await baseTranslate('腾讯AI翻译', raw, options, res => JSON.parse(res).auto_translation[0]);
    }

    async function translate_icib(raw) {
        const sign = CryptoJS.MD5("6key_web_fanyi" + "ifanyiweb8hc9s98e" + raw.replace(/(^\s*)|(\s*$)/g, "")).toString().substring(0, 16);
        const options = {
            method: "POST",
            url: `https://ifanyi.iciba.com/index.php?c=trans&m=fy&client=6&auth_user=key_web_fanyi&sign=${sign}`,
            data: 'from=auto&t=auto&q=' + encodeURIComponent(raw),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };
        return await baseTranslate('爱词霸翻译', raw, options, res => JSON.parse(res).content.out);
    }

    async function translate_biying(raw) {
        const options = {
            method: "POST",
            url: 'https://www.bing.com/ttranslatev3',
            data: 'fromLang=auto-detect&to=auto&text=' + encodeURIComponent(raw),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };
        return await baseTranslate('必应翻译', raw, options, res => JSON.parse(res)[0].translations[0].text);
    }

    async function translate_ggm(raw) {
        const options = {
            method: "GET",
            url: "https://translate.google.com/m?tl=auto&q=" + encodeURIComponent(raw),
            headers: {
                "Host": "translate.google.com",
            },
            anonymous: true,
            nocache: true,
        };
        return await baseTranslate('谷歌翻译mobile', raw, options, res => /class="result-container">((?:.|\n)*?)<\/div/.exec(res)[1]);
    }

    async function translate_gg(raw) {
        const options = {
            method: "POST",
            url: "https://translate.google.com/_/TranslateWebserverUi/data/batchexecute",
            data: "f.req=" + encodeURIComponent(JSON.stringify([[["MkEWBc", JSON.stringify([[raw, "auto", "zh-CN", true], [null]]), null, "generic"]]])),
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "Host": "translate.google.com",
            },
            anonymous: true,
            nocache: true,
        };
        return await baseTranslate('谷歌翻译', raw, options, res => JSON.parse(JSON.parse(res.slice(res.indexOf('[')))[0][2])[1][0][0][5].map(item => item[0]).join(''));
    }

    async function translate_youdao_mobile(raw) {
        const options = {
            method: "POST",
            url: 'http://m.youdao.com/translate',
            data: "inputtext=" + encodeURIComponent(raw) + "&type=AUTO",
            anonymous: true,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };
        return await baseTranslate('有道翻译mobile', raw, options, res => /id="translateResult">\s*?<li>([\s\S]*?)<\/li>\s*?<\/ul/.exec(res)[1]);
    }

    // 定义自定义类名，用于弹窗样式
    const customClass = {
        container: 'translate-container',
        popup: 'translate-popup',
        content: 'translate-content',
    };

    // 初始化SweetAlert2设置
    let toast = Swal.mixin({
        toast: false,  // 关闭 toast 模式，以便使用完整的弹窗样式
        position: 'center',  // 设置为页面中央
        showConfirmButton: false,
        timerProgressBar: false,
        customClass: customClass,
        didOpen: (toast) => {
            Swal.showLoading();
        }
    });

    // 定义语言映射表，用于支持多语言
    let languageMap = {
        'auto': '自动检测',
        'ar': '阿拉伯语',
        'de': '德语',
        'ru': '俄语',
        'fr': '法语',
        'ko': '韩语',
        'la': '拉丁语',
        'pt': '葡萄牙语',
        'ja': '日语',
        'th': '泰语',
        'es': '西班牙语',
        'it': '意大利语',
        'en': '英语',
        'zh-CN': '简体中文',
        'zh-TW': '繁体中文',
    };

    // 定义违禁词列表
    const prohibitedWords = [
        "UFO", "飞船", "宇航员", "人体工学", "瓦楞纸", "食品级", "ccc认证","人体工程学","3C","医疗","认证","婴儿","母婴","激光","干扰",
        "动漫", "游戏", "周边", "亚克力", "丙乙酸塑料","饮料","武器","儿童玩具","宠物玩具","雷达",
        "红外线","监控","情趣用品","母婴用品","无线充电","假发","首饰品","吸尘器","吹风机","卷发棒","投影仪","水管","拉杆箱","行李箱","无叶风扇","握力器",
        "眼镜","电竞椅","吸管","运动水杯","飞盘","猫爬架","服装","医用","监控设备","宗教","动漫","合成木","情趣","组装"
    ];

    // 工具函数集合
    let util = {
        // 获取存储值
        getValue(name) {
            return GM_getValue(name);
        },

        // 设置存储值
        setValue(name, value) {
            GM_setValue(name, value);
        },

        // 动态添加样式
        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            document.head.appendChild(style);
        },

        // 发送POST请求，增加超时处理
        post(url, data, headers, type, timeout = 10000) {
            if (this.isType(data) === 'object') {
                data = JSON.stringify(data);
            }
            return new Promise((resolve, reject) => {
                const timer = setTimeout(() => {
                    reject(new Error('请求超时'));
                }, timeout);

                GM_xmlhttpRequest({
                    method: "POST", url, headers, data,
                    responseType: type || 'json',
                    onload: (res) => {
                        clearTimeout(timer);
                        resolve(res.response || res.responseText);
                    },
                    onerror: (err) => {
                        clearTimeout(timer);
                        reject(err);
                    },
                });
            });
        },

        // 解析语言代码，返回对应语言名称
        parseLanguage(language) {
            return languageMap[language] || language;
        },

        // 判断对象类型
        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },

        // 检查并高亮违禁词
        highlightProhibitedWords(text) {
            let highlightedText = text;
            prohibitedWords.forEach(word => {
                const regex = new RegExp(`(${word})`, 'gi');
                highlightedText = highlightedText.replace(regex, `<span style="color: red; font-weight: bold; font-size: 30px;">$1</span>`);
            });
            return highlightedText;
        }
    };

    // 主功能逻辑
    let main = {
        untranslatedText: '', // 未翻译的文本
        translatedText: '', // 翻译后的文本
        translating: false, // 是否正在翻译

        // 初始化配置数据
        initValue() {
            let value = [{
                name: 'setting_success_times', // 记录成功翻译次数
                value: 0
            }, {
                name: 'hotkey', // 快捷键
                value: 'f9'
            }, {
                name: 'from', // 默认源语言
                value: 'auto'
            }, {
                name: 'to', // 默认目标语言
                value: 'zh-CN'
            }];

            // 如果配置项未设置，则初始化
            value.forEach((v) => {
                if (util.getValue(v.name) === undefined) {
                    util.setValue(v.name, v.value);
                }
            });
        },

        // 显示“正在翻译...”提示
        showTranslationLoading() {
            Swal.fire({
                title: '正在翻译...',
                html: '<div class="translate-loading-css"></div>',
                showConfirmButton: false,
                allowOutsideClick: false,
                customClass: {
                    popup: 'swal2-translate-popup',
                },
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        },

        // 关闭提示
        closeTranslationLoading() {
            Swal.close();
        },

        // 翻译 productTitle 内容并添加到页面
        async translateProductTitle() {
            const productTitleElement = document.getElementById('productTitle');
            if (productTitleElement) {
                const text = productTitleElement.textContent.trim();
                console.log('正在翻译productTitle:', text);
                if (text) {
                    // 调用翻译函数进行翻译
                    const translatedText = await this.translate(text);
                    if (translatedText) {
                        console.log('productTitle翻译成功:', translatedText);
                        // 检查并高亮违禁词
                        const highlightedText = util.highlightProhibitedWords(translatedText);
                        // 创建新的span元素来显示翻译后的内容
                        const translatedSpan = document.createElement('span');
                        translatedSpan.innerHTML = ` (${highlightedText})`;
                        translatedSpan.style.color = 'blue'; // 可以根据需求设置样式
                        // 将新的span元素插入到productTitle之后
                        productTitleElement.appendChild(translatedSpan);
                    }
                }
            }
        },

        // 翻译指定ul下的所有li内容
        async translateListItems() {
            const ulElement = document.querySelector('ul.a-unordered-list.a-vertical.a-spacing-mini');
            if (ulElement) {
                const listItems = ulElement.querySelectorAll('li span.a-list-item');
                for (let item of listItems) {
                    const text = item.textContent.trim();
                    console.log('正在翻译列表项:', text);
                    if (text) {
                        try {
                            // 调用翻译函数进行翻译
                            const translatedText = await this.translate(text);
                            if (translatedText) {
                                console.log('列表项翻译成功:', translatedText);
                                // 检查并高亮违禁词
                                const highlightedText = util.highlightProhibitedWords(translatedText);
                                // 创建新的li元素来显示翻译后的内容
                                const newLi = document.createElement('li');
                                newLi.className = 'a-spacing-mini';
                                const newSpan = document.createElement('span');
                                newSpan.className = 'a-list-item';
                                newSpan.innerHTML = highlightedText;
                                newSpan.style.color = 'blue'; // 可以根据需求设置样式
                                newLi.appendChild(newSpan);
                                // 将新的li元素插入到ul之后
                                ulElement.appendChild(newLi);
                            }
                        } catch (error) {
                            console.error('列表项翻译失败:', error.message);
                        }
                    }
                }
            }
        },

        // 调用API进行翻译
        async translate(text, showToast = true) {
            console.log('开始翻译文本:', text);
            // 获取当前选中的翻译源
            const translateSourceName = GM_getValue("translateSource", "谷歌翻译");
            const translateFunc = getTranslateFunc(); // 获取相应的翻译函数

            // 显示加载状态
            this.translating = true;
            this.showTranslationLoading();
            let btn = $('.translate-box .translate-btn');
            try {
                if (!text) return '';
                if (!this.translating) return;
                this.translating = true;
                showToast && this.showTranslationLoading(); // 显示“正在翻译”提示
                btn.length > 0 && btn.html('<span class="translate-loading-css"></span>翻译中');
                // 调用选中的翻译接口
                const translatedText = await translateFunc(text);
                this.translating = false;
                this.closeTranslationLoading(); // 翻译结束，关闭提示
                // 如果翻译成功，更新按钮状态并返回翻译结果
                console.log('翻译成功:', translatedText);
                btn.length > 0 && btn.html('翻译');
                return translatedText;
            } catch (e) {
                // 翻译失败，输出错误信息
                this.translating = false;
                this.closeTranslationLoading();
                console.error('翻译失败:', err?.msg || '未知错误');
                btn.length > 0 && btn.html('翻译');
                return err?.msg || '';
            }
        },

        // 添加快捷键处理
        addHotKey() {
            hotkeys(util.getValue('hotkey'), async (event, handler) => {
                event.preventDefault();
                console.log('F9 按下，开始翻译...');
                await this.translateProductTitle(); // 执行标题翻译
                await this.translateListItems();    // 执行列表项翻译
            });
        },

        // 初始化脚本
        init() {
            this.initValue();
            this.addHotKey();
        },
    };

    // 初始化主逻辑
    main.init();

    // 添加样式以确保提示框居中显示并应用科技感的颜色样式
    util.addStyle('swal2-translate-styles', 'style', `
        .swal2-translate-popup {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 99999; /* 确保提示框在所有内容上方 */
            width: auto; /* 确保宽度适应内容 */
            max-width: 80%; /* 防止提示框过宽 */
            padding: 20px; /* 添加内边距 */
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5); /* 增加更强的阴影效果 */
            border-radius: 15px; /* 增加圆角，使其更现代 */
            background: linear-gradient(135deg, #2b2e4a, #4c5c68); /* 使用渐变背景，增加科技感 */
            color: #f1f1f1; /* 使用浅色字体，适应深色背景 */
        }
        .swal2-title {
            font-size: 20px;
            font-weight: bold;
            color: #00d4ff; /* 使用科技蓝色字体 */
            margin-bottom: 20px; /* 增加标题和加载动画之间的间距 */
        }
        .translate-loading-css {
            border: 4px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            border-top: 4px solid #00d4ff; /* 设置加载动画的主色调为科技蓝 */
            width: 32px;
            height: 32px;
            -webkit-animation: spin 1.5s linear infinite;
            animation: spin 1.5s linear infinite;
            margin: 0 auto;
        }
        @-webkit-keyframes spin {
            0% { -webkit-transform: rotate(0deg); }
            100% { -webkit-transform: rotate(360deg); }
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        span.highlight {
            color: red; /* 高亮违禁词为红色 */
            font-weight: bold;
        }
    `);

})();






