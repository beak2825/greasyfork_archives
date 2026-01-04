class TranslateMachine {
    constructor() {
        this.sessionStorage = {
            getItem: async function (key) {
                document.defaultView.localStorage.getItem(key);
            },
            setItem: async function (key, value) {
                document.defaultView.localStorage.setItem(key, value);
            }
        };
        this.transdict = {
            谷歌翻译: this.translate_gg.bind(this),
            谷歌翻译mobile: this.translate_ggm.bind(this)
        };
        this.remove_url = true;
        this.show_info = true;
        this.fullscrenn_hidden = true;
        this.globalProcessingSave = [];
    }

    async init(args1, args2, args3) {
        // let rule = {
        //     name: 'WhatsApp',
        //     selector: this.baseSelector('nav', 0, '*').bind(this),
        //     textGetter: this.baseTextGetter.bind(this),
        //     textSetter: this.baseTextSetter.bind(this)
        // };
        let rule = null;
        if (args1 != null && args2 != null && args3 != null) {
            rule = {};
            rule.name = '';
            rule.selector = this.baseSelector(args1, args2, args3).bind(this);
            rule.textGetter = this.baseTextGetter.bind(this);
            rule.textSetter = this.baseTextSetter.bind(this);
        }
        let main = async (_) => {
            if (!rule) return;
            const choice = '谷歌翻译';
            const temp = [...new Set(rule.selector())];
            for (let i = 0; i < temp.length; i++) {
                const now = temp[i];
                if (this.globalProcessingSave.includes(now)) continue;
                this.globalProcessingSave.push(now);
                const text = this.remove_url ? this.url_filter(rule.textGetter(now)) : rule.textGetter(now);
                if (text.length == 0) continue;
                if (await this.sessionStorage.getItem(choice + '-' + text)) {
                    rule.textSetter(now, await this.sessionStorage.getItem(choice + '-' + text));
                    this.removeItem(this.globalProcessingSave, now);
                } else {
                    this.pass_lang(text)
                        .then((lang) => this.transdict[choice](text, lang))
                        .then((s) => {
                            let result = s['result'];
                            let origin = s['origin'];
                            rule.textSetter(now, result);
                            this.removeItem(this.globalProcessingSave, now);
                        });
                }
            }
        };
        this.PromiseRetryWrap(null).then(() => {
            document.js_translater = setInterval(main, 200);
        });
    }

    ReviseDom(dom, text, OldText = null) {
        this.baseTextSetter(dom, text, OldText);
    }

    pause() {
        clearInterval(document.js_translater);
        document.js_translater = null;
    }

    resume() {
        if (document.js_translater !== null) {
            clearInterval(document.js_translater);
        }
        this.init();
    }

    removeItem(arr, item) {
        const index = arr.indexOf(item);
        if (index > -1) arr.splice(index, 1);
    }

    baseSelector(selector, parent = 0, childSelector = null) {
        return () => {
            let items = document.querySelectorAll(selector);
            let filteredItems = [];
            if (parent !== 0) {
                items = Array.prototype.slice.call(items);
                items = items.map((item) => {
                    let currentNode = item;
                    for (let i = 0; i < parent; i++) {
                        currentNode = currentNode.parentNode;
                    }
                    return currentNode;
                });
            }
            for (let i = 0; i < items.length; i++) {
                if (childSelector !== null) {
                    let childNode = items[i].querySelector(childSelector);
                    if (childNode !== null) {
                        filteredItems.push(childNode);
                        continue;
                    }
                }
                const node = items[i].querySelector('[data-translate]');
                if (node === null || node.parentNode !== items[i]) {
                    filteredItems.push(items[i]);
                }
            }
            return filteredItems;
        };
    }

    baseTextGetter(e) {
        return e.innerText;
    }

    baseTextSetter(e, text, OldText = null) {
        if ((text || '').length == 0) text = '翻译异常';
        let original = e.innerText;
        if (OldText !== null) {
            original = OldText;
        }
        e.innerText = text;
        let name = '谷歌翻译';
        $(e).attr('data-translate', name);
        $(e).css('color', '#40c2af');
        $(e)
            .parent()
            .before("<div data-translate='" + name + "' style='white-space:pre-wrap;'>" + original + '</div>');
        let height = $(e).parent().height();
        $(e)
            .parent()
            .css('height', height + 20 + 'px');
    }

    url_filter(text) {
        return text.replace(/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g, '');
    }

    async pass_lang(raw) {
        try {
            const result = await this.check_lang(raw);
            if (result == 'zh') return new Promise(() => {});
            return result;
        } catch (err) {
            console.log(err);
            return;
        }
    }

    async check_lang(raw) {
        const options = {
            method: 'POST',
            url: 'https://fanyi.baidu.com/langdetect',
            data: 'query=' + encodeURIComponent(raw.replace(/[\uD800-\uDBFF]$/, '').slice(0, 50)),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        const res = await this.Request(options);
        try {
            let r = res.responseText;
            if (typeof r == 'string') {
                r = JSON.parse(r).lan;
            } else {
                r = r.lan;
            }
            return r;
        } catch (err) {
            console.log(err);
            return;
        }
    }

    guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    async Translate(raw, sourceLang, targetLang, Record = true) {
        let text = await this.sessionStorage.getItem('谷歌翻译' + '-' + raw);
        if (text && text != '') {
            return new Promise(async (resolve) => {
                resolve(text);
            });
        }
        const options = {
            method: 'POST',
            url: 'https://translate.google.com/_/TranslateWebserverUi/data/batchexecute',
            data: `f.req=${encodeURIComponent(JSON.stringify([[['MkEWBc', JSON.stringify([[raw, sourceLang, targetLang, true], [null]]), null, 'generic']]]))}`,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Host: 'translate.google.com'
            },
            anonymous: true,
            nocache: true
        };
        return await this.BaseTranslate(
            '谷歌翻译',
            raw,
            options,
            function (res) {
                var slicedRes = res.slice(res.indexOf('['));
                var parsedRes = JSON.parse(slicedRes);
                var extractedRes = parsedRes[0][2];
                if (typeof extractedRes == 'string') {
                    extractedRes = JSON.parse(extractedRes);
                }
                let original = extractedRes[1][4][0];
                var finalRes = extractedRes[1][0][0][5]
                    .map(function (item) {
                        return item[0];
                    })
                    .join('');
                return { finalRes, original };
            },
            Record
        );
    }

    async translate_gg(raw) {
        const options = {
            method: 'POST',
            url: 'https://translate.google.com/_/TranslateWebserverUi/data/batchexecute',
            data: 'f.req=' + encodeURIComponent(JSON.stringify([[['MkEWBc', JSON.stringify([[raw, 'auto', 'zh-CN', true], [null]]), null, 'generic']]])),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Host: 'translate.google.com'
            },
            anonymous: true,
            nocache: true
        };
        return await this.BaseTranslate('谷歌翻译', raw, options, function (res) {
            var slicedRes = res.slice(res.indexOf('['));
            var parsedRes = JSON.parse(slicedRes);
            var extractedRes = parsedRes[0][2];
            if (typeof extractedRes == 'string') {
                extractedRes = JSON.parse(extractedRes);
            }
            let original = extractedRes[1][4][0];
            var finalRes = extractedRes[1][0][0][5]
                .map(function (item) {
                    return item[0];
                })
                .join('');
            return { finalRes, original };
        });
    }

    async translate_ggm(raw) {
        const options = {
            method: 'GET',
            url: 'https://translate.google.com/m?tl=zh-CN&q=' + encodeURIComponent(raw),
            headers: {
                Host: 'translate.google.com'
            },
            anonymous: true,
            nocache: true
        };
        return await this.BaseTranslate('谷歌翻译mobile', raw, options, (res) => /class="result-container">((?:.|\n)*?)<\/div/.exec(res)[1]);
    }

    tk(a, b) {
        var d = b.split('.');
        b = Number(d[0]) || 0;
        for (var e = [], f = 0, g = 0; g < a.length; g++) {
            var k = a.charCodeAt(g);
            128 > k ? (e[f++] = k) : (2048 > k ? (e[f++] = (k >> 6) | 192) : (55296 == (k & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? ((k = 65536 + ((k & 1023) << 10) + (a.charCodeAt(++g) & 1023)), (e[f++] = (k >> 18) | 240), (e[f++] = ((k >> 12) & 63) | 128)) : (e[f++] = (k >> 12) | 224), (e[f++] = ((k >> 6) & 63) | 128)), (e[f++] = (k & 63) | 128));
        }
        a = b;
        for (f = 0; f < e.length; f++) a = Fo(a + e[f], '+-a^+6');
        a = Fo(a, '+-3^+b+-f');
        a ^= Number(d[1]) || 0;
        0 > a && (a = (a & 2147483647) + 2147483648);
        a %= 1e6;
        return a.toString() + '.' + (a ^ b);
    }
    Fo(a, b) {
        for (var c = 0; c < b.length - 2; c += 3) {
            var d = b.charAt(c + 2);
            d = 'a' <= d ? d.charCodeAt(0) - 87 : Number(d);
            d = '+' == b.charAt(c + 1) ? a >>> d : a << d;
            a = '+' == b.charAt(c) ? (a + d) & 4294967295 : a ^ d;
        }
        return a;
    }

    async PromiseRetryWrap(task, options, ...values) {
        const { RetryTimes, ErrProcesser } = options || {};
        let retryTimes = RetryTimes || 5;
        const usedErrProcesser =
            ErrProcesser ||
            ((err) => {
                throw err;
            });
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

    async BaseTranslate(name, raw, options, processer, Record = true) {
        const toDo = async () => {
            var tmp;
            try {
                const data = await this.Request(options);
                tmp = data.responseText;
                const { finalRes, original } = await processer(tmp);
                let result = finalRes;
                if (result) {
                    try {
                        if (Record) {
                            await this.sessionStorage.setItem(name + '-' + raw, result).bind(this);
                        }
                    } catch (e) {}
                }
                return { result, original };
            } catch (err) {
                throw {
                    responseText: tmp,
                    err: err
                };
            }
        };
        return await this.PromiseRetryWrap(toDo, { RetryTimes: 3, ErrProcesser: () => '翻译出错' });
    }

    Request(options) {
        return new Promise(async (resolve) => {
            options.onload = function (res) {
                if (res.status !== 200) {
                    resolve('');
                    return;
                }
                resolve(res);
            };
            GM_xmlhttpRequest(options);
        });
    }
}
