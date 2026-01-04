// ==UserScript==
// @name         聚合网页(美女图聚合展示演化而来)by SeLang
// @namespace    http://cmsv1.findmd5.com/
// @version      0.09
// @description  目标是聚合网页，省去翻页烦恼。有需要聚合的网址请反馈。 QQ群号：455809302,点击链接加入群【油猴脚本私人定制】：https://jq.qq.com/?_wv=1027&k=45p9bea
// @author       selang
// @include      /https?\:\/\/*/
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/ipfs/0.50.2/index.min.js
// @connect      *
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_saveTab
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/412231/%E8%81%9A%E5%90%88%E7%BD%91%E9%A1%B5%28%E7%BE%8E%E5%A5%B3%E5%9B%BE%E8%81%9A%E5%90%88%E5%B1%95%E7%A4%BA%E6%BC%94%E5%8C%96%E8%80%8C%E6%9D%A5%29by%20SeLang.user.js
// @updateURL https://update.greasyfork.org/scripts/412231/%E8%81%9A%E5%90%88%E7%BD%91%E9%A1%B5%28%E7%BE%8E%E5%A5%B3%E5%9B%BE%E8%81%9A%E5%90%88%E5%B1%95%E7%A4%BA%E6%BC%94%E5%8C%96%E8%80%8C%E6%9D%A5%29by%20SeLang.meta.js
// ==/UserScript==

(async function () {
    if (window.top === window.self) {
        const NODE = await Ipfs.create(({repo: 'ipfs-monkey-aggregation'}));
        const RULE_CID_KEY = '聚合网页RULE_CID_KEY';
        const RULE_OFFICIAL_CID_KEY = '聚合网页OFFICIAL_RULE_CID_KEY';
        const AGGREGATION_TEMPLATE_HTML_KEY = "聚合网页OFFICIAL_AGGREGATION_TEMPLATE_HTML_KEY";
        const AGGREGATION_TEMPLATE_JS_KEY = "聚合网页OFFICIAL_AGGREGATION_TEMPLATE_JS_KEY";
        const AGGREGATION_TEMPLATE_CSS_KEY = "聚合网页OFFICIAL_AGGREGATION_TEMPLATE_CSS_KEY";
        const ENV_DEV_STATUS = 'DEV';
        const ENV_PRODUCT_STATUS = 'PRODUCT';
        const ENV_STATUS = ENV_PRODUCT_STATUS;

        //日志
        function log() {
            if (true) {
                console.log.apply(this, arguments);
            }
        };

        function err() {
            if (true) {
                console.error.apply(this, arguments);
            }
        }

        function priorityLog() {
            console.log.apply(this, arguments);
        }

        function getRuleCids() {
            let officialCIDValue = GM_getValue(RULE_OFFICIAL_CID_KEY);
            let value = GM_getValue(RULE_CID_KEY);
            if (value) {
                let parse = JSON.parse(value);
                if (officialCIDValue) {
                    return [officialCIDValue, ...parse];
                } else {
                    return parse;
                }
            }
            if (officialCIDValue) {
                return [officialCIDValue];
            } else {
                return [];
            }
        }

        function setRuleCids(key, value) {
            return GM_setValue(key, value);
        }

        function putCache(key, value) {
            return GM_setValue(key, value);
        }

        function getCache(key) {
            return GM_getValue(key);
        }

        const AsyncFunction = Object.getPrototypeOf(async function () {
        }).constructor;

        Array.prototype.distinct = function () {
            let arr = this;
            let result = [];
            let obj = {};

            for (let i of arr) {
                if (!obj[i]) {
                    result.push(i);
                    obj[i] = 1;
                }
            }
            return result;
        }

        const Alpha_Script = {
            sleep: function (time = 100) {
                return new Promise(resolve => {
                    setTimeout(function () {
                        resolve();
                    }, time);
                })
            },
            obtainHtmlAsync: function (options) {
                options = options || {};
                if (!options.url) {
                    throw new Error("参数不合法");
                }
                return new Promise(resolve => {
                    options.headers = {
                        ...Alpha_Script.parseHeaders("Accept:image/webp,image/*,*/*;q=0.8\n" +
                            "Accept-Encoding:gzip, deflate, sdch\n" +
                            "Accept-Language:zh-CN,zh;q=0.8\n" +
                            "Referer:" + window.location.href + "\n" +
                            `User-Agent:${window.navigator.userAgent}`
                        ), ...options.headers
                    };
                    options.method = options.method || 'GET';
                    let responseType = options.responseType;
                    switch (responseType) {
                        case "blob":
                            options.onload = options.onload || function (response) {
                                if (response && typeof response.status != "undefined") {
                                    let status = response.status;
                                    if (status >= 200 && status < 300) {
                                        resolve({status, response});
                                    } else if (status == 304) {
                                        resolve({status, response});
                                    }
                                }
                            }
                            break;
                        default:
                            options.onload = options.onload || function (response) {
                                if (response && typeof response.status != "undefined") {
                                    let status = response.status;
                                    if (status >= 200 && status < 300) {
                                        let html = response.responseText;
                                        resolve({status, response, html});
                                    } else if (status == 304) {
                                        resolve({status, response});
                                    }
                                }
                            }
                    }

                    GM_xmlhttpRequest(options);
                });
            },
            asyncPool: function (poolLimit, array, iteratorFn) {
                let i = 0;
                const ret = [];
                const executing = [];
                const enqueue = function () {
                    //Boundary processing, array is an empty array
                    if (i === array.length) {
                        return Promise.resolve();
                    }
                    //Initialize a promise every enqueue
                    const item = array[i];
                    const p = Promise.resolve(i).then((i) => iteratorFn(item, i, array));
                    i++;
                    //Put into promises array
                    ret.push(p);
                    //After the promise is executed, remove it from the executing array
                    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
                    //Insert the executing number to indicate the executing promise
                    executing.push(e);
                    //Using promise.rece, whenever the number of promises in the executing array is less than poollimit, the new promise is instantiated and executed
                    let r = Promise.resolve();
                    if (executing.length >= poolLimit) {
                        r = Promise.race(executing);
                    }
                    //Recursion until array is traversed
                    return r.then(() => enqueue());
                };
                return enqueue().then(() => Promise.allSettled(ret));
            },
            obtainHtml: function (options) {
                options = options || {};
                if (!options.url || !options.method) {
                    throw new Error("参数不合法");
                }
                GM_xmlhttpRequest(options);
            },
            parseHeaders: function (headStr) {
                let o = {};
                let myregexp = /^([^:]+):(.*)$/img;
                let match = /^([^:]+):(.*)$/img.exec(headStr);
                while (match != null) {
                    o[match[1].trim()] = match[2].trim();
                    match = myregexp.exec(headStr);
                }
                return o;
            },
            //获取参数
            getParam: function (dest, name) {
                let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                let r = dest.match(reg);
                if (r != null) return decodeURI(r[2]);
                return null;
            },
            isArray: function (value) {
                return Object.prototype.toString.apply(value) === '[object Array]';
            }
        };

        /**
         * 无变化则取缓存，有变化则缓存
         * @param cacheKey
         * @param options 数据结构里至少要有{url:'xx'}
         * @returns {Promise<*>}
         */
        async function obtainDataByUrl(cacheKey, options) {
            let ret = '';
            let cache = getCache(cacheKey);
            if (typeof cache != "undefined") {
                let {etag, html} = JSON.parse(cache);
                ret = html;
                if (typeof etag != 'undefined') {
                    let {status, html, response} = await Alpha_Script.obtainHtmlAsync({
                        ...options, headers: {
                            'If-None-Match': etag
                        }
                    });
                    if (status != 304) {
                        let etag = response.headers['etag'];
                        putCache(cacheKey, JSON.stringify({
                            etag, html
                        }))
                        ret = html;
                    }
                }
            } else {
                let {status, html, response} = await Alpha_Script.obtainHtmlAsync(options);
                let responseHeaders = Alpha_Script.parseHeaders(response.responseHeaders);
                let {etag} = responseHeaders;
                putCache(cacheKey, JSON.stringify({
                    etag, html
                }))
                ret = html;
            }
            return ret;
        };

        (function () {
            'use strict';
            priorityLog('欢迎进群：455809302交流。一起玩。');
            priorityLog('一起玩不论是不是技术人员都欢迎。只要有创意也欢迎加入。点击链接加入群【油猴脚本私人级别定制】：https://jq.qq.com/?_wv=1027&k=460soLy。');

            function validateUrl(url) {
                let validate = true;
                let lowerCaseUrl = url.toLowerCase();
                if (url.startsWith('#')) {
                    validate = false;
                } else if (lowerCaseUrl.startsWith('//')) {
                    url = `${window.location.protocol}${url}`;
                } else if (lowerCaseUrl.startsWith("/")) {
                    url = `${window.location.protocol}//${window.location.hostname}${url}`;
                } else if (lowerCaseUrl.startsWith('https://') || lowerCaseUrl.startsWith('http://')) {

                } else {
                    let prefixRegex = /(.*?\/)[^\/]*$/i;
                    let __matched = prefixRegex.exec(window.location.href);
                    if (__matched != null) {
                        url = `${__matched[1]}${url}`;
                    } else {
                        url = `${window.location.protocol}//${window.location.hostname}/${url}`;
                    }
                }

                return {validate, url};
            }

            async function parseNextPages(nextSelector = 'a:contains("下一页")') {
                let nextPages = [];
                let existNextPage = false;
                nextPages.push({
                    url: window.location.href,
                    html: $('html').prop("outerHTML")
                });
                let nextEs = $(nextSelector);
                log('解析下一页开始...');
                while (nextEs.length > 0) {
                    existNextPage = true;
                    let nextPageUrl = nextEs.attr('href');
                    let validateUrlResult = validateUrl(nextPageUrl);
                    if (!validateUrlResult.validate) {
                        break;
                    }
                    nextPageUrl = validateUrlResult.url;
                    log(nextPageUrl);
                    let {html} = await Alpha_Script.obtainHtmlAsync({url: nextPageUrl});
                    if (typeof html != "undefined") {
                        // console.log('nextPage Html==>', html);
                        let nextPageItem = {
                            url: nextPageUrl,
                            html
                        };
                        let duplicateNextPage = nextPages.filter(item => item.url == nextPageItem.url);
                        if (duplicateNextPage.length > 0) {
                            break
                        } else {
                            nextPages.push(nextPageItem);
                            let {$doc} = txt2Document(html);
                            nextEs = $doc.find(nextSelector);
                        }
                    } else {
                        console.log('nextPage 未获取到内容。nextPageUrl==>', nextPageUrl);
                        break;
                    }
                    // await Alpha_Script.sleep(1000);
                }
                log('解析下一页结束...');
                return {existNextPage, nextPages};
            }

            /**
             * 插件图片聚合例子
             * @param parseNextPages 解析下一页的公用方法
             * @param $  jquery
             * @param log 日志输出
             * @param Alpha_Script 公用对象
             * @returns {Promise<*[]>} 图片合集
             */
            async function example(parseNextPages, $, log, Alpha_Script) {
                //下一页css选择器
                let nextPageSelector = 'a:contains("下一页")';
                //要聚合的图片css选择器
                let imgSelector = 'img';
                let {existNextPage, nextPages} = await parseNextPages(nextPageSelector);
                if (existNextPage) {
                    nextPages.map(nextPage => {
                        let images = Array.from($($(nextPage.html)).find(imgSelector)).map(e => {
                            let src = e.src;
                            let dataOriginal = $(e).attr('data-original');
                            if (dataOriginal) {
                                src = dataOriginal;
                            }
                            return src;
                        });
                        nextPage.imgs = images;
                    });
                    let imgs = nextPages.flatMap(page => page.imgs);
                    return imgs;
                } else {
                    return [];
                }
            }

            /**
             * 校验cid是否符合rule
             * @param cid
             * @returns {Promise<{validate: boolean}|{date: *, parseRule: *, url: *, validate: boolean, desc: *}>}
             */
            async function parseRuleFromIPFS(cid) {
                const {date, desc, parseRule, url, pre, excludeWebsites} = (await NODE.dag.get(cid)).value;
                if (parseRule && url && desc && date) {
                    return {validate: true, date, desc, parseRule, url, pre, excludeWebsites};
                } else {
                    return {validate: false};
                }
            }

            /**
             * 获取cid下所有的规则
             * @param cid
             * @returns {Promise<[]>}
             */
            async function obtainRulesFromIPFS(cid) {
                let rules = [];
                let cids = [];
                while (true) {
                    try {
                        let rule = await parseRuleFromIPFS(cid);
                        if (rule.validate) {
                            rules.push(rule);
                            if (rule.pre) {
                                cid = rule.pre;
                                if (cids.includes(cid)) {
                                    err('闭环了');
                                    break;
                                } else {
                                    cids.push(cid);
                                }
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                    } catch (e) {
                        err(e);
                        break;
                    }
                }
                return rules;
            }

            async function pluginExample() {
                //这里是一个插件的例子
                let cid = await NODE.dag.put(
                    {
                        url: '通用',
                        desc: '通用聚合',
                        parseRule: `return await (${example.toString()})(parseNextPages,$,log,Alpha_Script)`,
                        excludeWebsites: ['https://www.google.com.hk/search', 'https://greasyfork.org/', 'https://xxxxx需要排除的网站'],
                        date: '2020年9月30日'
                    }
                );
                cid = await NODE.dag.put(
                    {
                        url: '这里可以写书写规则的网址',
                        desc: '第二个通用聚合',
                        parseRule: `return await (${example.toString()})(parseNextPages,$,log,Alpha_Script)`,
                        excludeWebsites: ['https://www.google.com.hk/search', 'https://greasyfork.org/', 'https://xxxxx需要排除的网站'],
                        date: '2020年9月30日',
                        pre: cid.toString()
                    }
                );
                let cidStr = cid.toLocaleString();
                // cidStr = cid.toLocaleString();
                console.log('你的插件分享的地址为：', cidStr);
                return cidStr;
            }

            let isPageResLoadComplete = false;

            async function waitPageResLoadComplete() {
                for (; ;) {
                    if (isPageResLoadComplete) {
                        log('加载成功');
                        return;
                    } else {
                        await Alpha_Script.sleep(500);
                    }
                }
            }

            //热键
            function aggregationDisplaySwitchHotkeys() {
                $(document).keydown(function (e) {
                    if (e.ctrlKey && e.shiftKey) {
                        if (e.which == 76) {//L
                            log("触发快捷键");
                            aggregationDisplaySwitch();
                        }
                    }
                });
            }

            aggregationDisplaySwitchHotkeys();

            function aggregationDisplaySwitch() {
                let aggregationIFRAMEDisplayCss = $('#aggregationIFRAME').css('display');
                let aggregationIFRAMEDisplayCssCache = $('#aggregationIFRAME').attr('display-css-cache');
                if (aggregationIFRAMEDisplayCss != 'none') {
                    $('#aggregationIFRAME').css('display', 'none');

                    $('body').children().each(function (index, element) {
                        let displayCss = $(element).attr('display-css-cache');
                        if (element.id != 'aggregationIFRAME') {
                            $(element).css('display', displayCss);
                        }
                    });
                } else {
                    $('#aggregationIFRAME').css('display', aggregationIFRAMEDisplayCssCache);

                    $('body').children().each(function (index, element) {
                        if (element.id != 'aggregationIFRAME') {
                            $(element).css('display', 'none');
                        }
                    });
                }
            }

            window.addEventListener("message", async (event) => {
                let data = event.data;
                if (data.from == 'page') {
                    if (data.method == 'obtainHtmlAsync') {
                        let message = {result: '', from: 'monkey'};
                        try {
                            let {html} = await Alpha_Script.obtainHtmlAsync({url: data.url});
                            message.result = html;
                        } catch (e) {
                            message.error = e;
                        } finally {
                            event.ports[0].postMessage(message);
                        }
                    } else if (data.method == 'pageResLoadComplete') {
                        isPageResLoadComplete = true;
                        let message = {result: '', from: 'monkey'};
                        try {
                            let html = event.data;
                            log('html', html);
                            message.result = 'page收到：：' + html;
                        } catch (e) {
                            message.error = e;
                        } finally {
                            event.ports[0].postMessage(message);
                        }
                    } else if (data.method == '聚合切换') {
                        aggregationDisplaySwitch();

                        let message = {result: '', from: 'monkey'};
                        try {
                            let html = event.data;
                            log('html', html);
                            message.result = 'page收到：：' + html;
                        } catch (e) {
                            message.error = e;
                        } finally {
                            event.ports[0].postMessage(message);
                        }
                    }
                }
            }, false);

            function postMsg(msg) {
                return new Promise((res, rej) => {
                    const {port1, port2} = new MessageChannel();
                    port1.onmessage = ({data}) => {
                        if (data.from == 'page') {
                            port1.close();
                            if (data.error) {
                                rej(data);
                            } else {
                                res(data);
                            }
                        }
                    };
                    msg.from = 'monkey';
                    window.top.document.getElementById("aggregationIFRAME").contentWindow.postMessage(msg, window.location.origin, [port2]);
                });
            }

            function MIMEObjectURL(txt, contentType = "text/html; charset=UTF-8") {
                let txtBlob = new Blob([txt], {type: contentType});
                let txtBlobUrl = URL.createObjectURL(txtBlob);
                return txtBlobUrl;
            }

            function txt2Document(txt) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(txt, "text/html");
                let $doc = $(doc);
                return {doc, $doc}
            }

            (async () => {
                // let cidStr = await pluginExample();
                await pluginExample();
                // 你自己写的或者他人分享的cidPath;
                let cidStr = "bafyreielhccxya5tbcqoqdfxfqcn7qukjed2jejnbeaffikxm7ssdano2i";
                setRuleCids(RULE_OFFICIAL_CID_KEY, cidStr);
                let ruleCids = getRuleCids();
                ruleCids.push(cidStr);
                let rules = [];
                for (const ruleCid of ruleCids) {
                    let rule = await obtainRulesFromIPFS(ruleCid);
                    rules = [...rules, ...rule];
                }
                log('当前规则总数：', rules.length);
                for (let rule of rules) {
                    log('当前执行规则>> %s 编写规则参考地址：%s\r\n 规则内容：%s', rule.desc, rule.url, rule.parseRule);
                    let excludeWebsites = rule.excludeWebsites;
                    if (Alpha_Script.isArray(excludeWebsites)) {
                        let findAnyOnes = excludeWebsites.filter(excludeWebsite => window.location.href.startsWith(excludeWebsite));
                        if (findAnyOnes.length > 0) {
                            log('当前规则被排除');
                            continue;
                        }
                    }
                    let ruleFunc = rule.parseRule;
                    let imgs = await (new AsyncFunction('parseNextPages', '$', 'log', 'Alpha_Script', ruleFunc))(parseNextPages, $, log, Alpha_Script);
                    imgs = imgs.distinct();
                    if (imgs.length > 0) {
                        log('规则找到图片');
                        let tempHost;
                        if (ENV_STATUS == ENV_DEV_STATUS) {
                            tempHost = 'http://127.0.0.1:8081';
                        } else {
                            tempHost = 'https://cmsv1.findmd5.com';
                        }
                        let aggregationTemplateHtml, aggregationTemplateCss, aggregationTemplateJs;
                        //国内IPFS不稳定，临时处理
                        if (true || ENV_STATUS == ENV_DEV_STATUS) {
                            aggregationTemplateHtml = await obtainDataByUrl(AGGREGATION_TEMPLATE_HTML_KEY, {url: `${tempHost}/static/imageAggregation/aggregationTemplate.html`});
                            aggregationTemplateCss = await obtainDataByUrl(AGGREGATION_TEMPLATE_CSS_KEY, {url: `${tempHost}/static/imageAggregation/css/aggregationTemplate.css`});
                            aggregationTemplateJs = await obtainDataByUrl(AGGREGATION_TEMPLATE_JS_KEY, {url: `${tempHost}/static/imageAggregation/js/aggregationTemplate.js`});
                        } else {
                            let aggregationTemplateHtmlCid, aggregationTemplateJsCid, aggregationTemplateCssCid;
                            aggregationTemplateHtmlCid = 'bafyreicncdsi25po7rij4oh355v7w7fjfu3da4ncpkxp2gwwoxucb5ulri';
                            aggregationTemplateJsCid = 'bafyreiblvxkpjinurhnxgwznsgmtap37vmd7l3cvbcqf3wul4ll2bb7fmy';
                            aggregationTemplateCssCid = 'bafyreihws6twoxkhqoc3klnm3lucsamss3bki4akrpnwexp6u5m5thzpva';
                            aggregationTemplateHtml = (await NODE.dag.get(aggregationTemplateHtmlCid)).value.data;
                            aggregationTemplateCss = (await NODE.dag.get(aggregationTemplateCssCid)).value.data;
                            aggregationTemplateJs = (await NODE.dag.get(aggregationTemplateJsCid)).value.data;
                        }


                        {
                            let cid = await NODE.dag.put(
                                {
                                    data: aggregationTemplateHtml,
                                    desc: 'aggregationTemplate.html',
                                }
                            );
                            log('aggregationTemplate.html cid: ', cid.toString());
                            cid = await NODE.dag.put(
                                {
                                    data: aggregationTemplateJs,
                                    desc: 'aggregationTemplate.js',
                                }
                            );
                            log('aggregationTemplate.js cid: ', cid.toString());
                            cid = await NODE.dag.put(
                                {
                                    data: aggregationTemplateCss,
                                    desc: 'aggregationTemplate.css',
                                }
                            );
                            log('aggregationTemplate.css cid: ', cid.toString());
                        }

                        if (ENV_STATUS == ENV_DEV_STATUS) {
                            console.log('aggregationTemplateHtml', aggregationTemplateHtml);
                            console.log('aggregationTemplateCss', aggregationTemplateCss);
                            console.log('aggregationTemplateJs', aggregationTemplateJs);
                        }


                        let aggregationTemplateCssBlobUrl = MIMEObjectURL(aggregationTemplateCss, 'text/css; charset=utf-8');
                        let aggregationTemplateJsBlobUrl = MIMEObjectURL(aggregationTemplateJs, 'application/javascript; charset=utf-8');

                        {
                            let {doc, $doc} = txt2Document(aggregationTemplateHtml);
                            $doc.find('head').append(`<link rel="stylesheet" href="${aggregationTemplateCssBlobUrl}"/>`);
                            $doc.find('body').append(`<script src="${aggregationTemplateJsBlobUrl}"></script>`);

                            let outerHTML = doc.querySelector('html').outerHTML;
                            aggregationTemplateHtml = outerHTML;
                        }
                        if (ENV_STATUS == ENV_DEV_STATUS) {
                            console.log('final aggregationTemplateHtml', aggregationTemplateHtml);
                        }

                        let aggregationTemplateHtmlBlobUrl = MIMEObjectURL(aggregationTemplateHtml);

                        $('body').append(`<iframe id="aggregationIFRAME" src="${aggregationTemplateHtmlBlobUrl}" frameborder="0" scrolling="no" width="100%"></iframe>`);
                        await waitPageResLoadComplete();

                        $('body').children().each(function (index, element) {
                            let displayCss = $(element).css('display');
                            $(element).attr('display-css-cache', displayCss);
                            if (element.id != 'aggregationIFRAME') {
                                $(element).css('display', 'none');
                            }
                        });

                        let promiseAllResult = await Alpha_Script.asyncPool(10, imgs, async function (src, i) {
                            let blob = await downloadImg2Blob(src);
                            let url = URL.createObjectURL(blob);
                            // $(`#c_${i}`).append(`<img src="${src}" onload="loadHidden(this)"/>`);
                            return {url, blob};
                        });
                        let imgBlobSrcs = promiseAllResult.filter(p => p.status == 'fulfilled').map(p => p.value);
                        await postMsg({method: 'images', result: imgBlobSrcs});
                        log('规则执行完毕');
                        break;
                        // await Alpha_Script.sleep(5000);
                    }
                }

                log('执行完毕');
            })();

            async function downloadImg2Blob(imgSrc) {
                let {response} = await Alpha_Script.obtainHtmlAsync({
                    url: imgSrc,
                    method: 'GET',
                    headers: {
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                        // "Accept-Encoding": "gzip, deflate, sdch",
                        // "Accept-Language": "zh-CN,zh;q=0.8",
                        "Referer": window.location.href,
                        "User-Agent": window.navigator.userAgent
                    },
                    responseType: 'blob'
                });
                let responseHeaders = Alpha_Script.parseHeaders(response.responseHeaders);
                let contentType = responseHeaders['content-type'];
                if (!contentType) {
                    contentType = "image/png";
                }
                let blob = new Blob([response.response], {type: contentType});
                return blob;
            }

            async function loadHidden(e) {
                let {height, width} = await imageWidth(e);
                if (!(height > 500 && width > 500)) {
                    e.style.display = 'none';
                }
            }

            function getImageWidth(url) {
                let img = new Image();
                img.src = url;
                return imageWidth(img);
            }

            function imageWidth(img) {
                return new Promise(resolve => {
                    // 如果图片被缓存，则直接返回缓存数据
                    if (img.complete) {
                        resolve(img);
                    } else {
                        // 完全加载完毕的事件
                        img.onload = function () {
                            resolve(img);
                        }
                    }

                });
            }

            GM_registerMenuCommand("规则列表", ruleListFunc, "R");

            function ruleListFunc() {
                let ruleCids = getRuleCids();
                let delBtn = '<button type="button" class=" btn-sm btn-warning">\n' +
                    '                删除\n' +
                    '            </button>';
                let inject = ruleCids.map(ruleCid => `<div><span>${ruleCid}</span><span>${delBtn}</span></div>`).join("<br/>");
                $('script').remove();
                $('head').append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootswatch/4.3.1/cerulean/bootstrap.min.css"/>');
                $('body').html(inject);
                $('body').append('<script src="https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/js/bootstrap.min.js"></script>');
            }
        })();
    }
})
();
