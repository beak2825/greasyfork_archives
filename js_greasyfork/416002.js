// ==UserScript==
// @name         电商历史价格查询
// @namespace    http://shawjie.cn
// @version      1.0.12.1
// @description  看看历史价格 拒绝当小白鼠
// @author       ShawJie
// @match        https://item.jd.com/*
// @match        https://detail.tmall.com/item.htm*
// @match        https://item.taobao.com/item.htm*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/echarts/5.3.0-rc.1/echarts.common.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/4.1.1/crypto-js.min.js

// @downloadURL https://update.greasyfork.org/scripts/416002/%E7%94%B5%E5%95%86%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/416002/%E7%94%B5%E5%95%86%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

const __HISTORY_PRICE_CONFIG__ = {
    activeProvider: 'GouWuDang',
    mallPattern: {
        Jd: /^http[s]?:\/\/item\.jd\.com\/\d+\.html/,
        Tmall: /^http[s]:\/\/detail\.tmall\.com\/item\.htm/,
        Taobao: /^https?:\/\/item\.taobao\.com\/item\.htm/,
    },
    icon: '<svg t="1600605970684" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3197" ><path d="M560.64 857.6c0 24.32-17.92 25.6-39.68 25.6-21.76 0-39.68-1.28-39.68-25.6V638.72h78.08V857.6z" fill="#CBC487" p-id="3198"></path><path d="M522.24 896c-19.2 0-52.48 0-52.48-38.4V638.72c0-7.68 5.12-12.8 12.8-12.8h78.08c7.68 0 12.8 5.12 12.8 12.8V857.6c0 38.4-32 38.4-51.2 38.4z m-26.88-244.48V857.6c0 8.96 0 12.8 26.88 12.8s26.88-2.56 26.88-12.8V651.52h-53.76z" fill="#231C1C" p-id="3199"></path><path d="M714.24 304.64c-5.12-153.6-101.12-217.6-189.44-217.6h-3.84c-88.32 0-185.6 61.44-190.72 217.6v334.08h385.28s-1.28-328.96-1.28-334.08z" fill="#B8CA43" p-id="3200"></path><path d="M715.52 651.52H330.24c-3.84 0-6.4-1.28-8.96-3.84-2.56-2.56-3.84-5.12-3.84-8.96V304.64c5.12-168.96 112.64-229.12 203.52-229.12h3.84c97.28 0 197.12 70.4 202.24 229.12v334.08c0 3.84-1.28 6.4-3.84 8.96-1.28 2.56-5.12 3.84-7.68 3.84z m-372.48-25.6h359.68V304.64c-5.12-151.04-98.56-204.8-176.64-204.8h-3.84c-78.08 0-172.8 53.76-177.92 204.8-1.28 6.4-1.28 206.08-1.28 321.28z" fill="#231C1C" p-id="3201"></path><path d="M715.52 344.32v-38.4c-5.12-153.6-101.12-217.6-189.44-217.6h-3.84c-88.32 0-185.6 61.44-190.72 217.6v38.4H396.8v75.52c0 14.08 11.52 26.88 25.6 26.88s25.6-11.52 25.6-26.88v-75.52h52.48v126.72c0 14.08 11.52 26.88 25.6 26.88s25.6-11.52 25.6-26.88v-126.72h52.48v37.12c0 14.08 11.52 26.88 25.6 26.88s25.6-11.52 25.6-26.88v-37.12h60.16z" fill="#FDE8C2" p-id="3202"></path><path d="M522.24 510.72c-20.48 0-38.4-17.92-38.4-39.68v-113.92h-26.88v62.72c0 21.76-16.64 39.68-38.4 39.68-20.48 0-38.4-17.92-38.4-39.68v-62.72h-52.48c-3.84 0-6.4-1.28-8.96-3.84-2.56-2.56-3.84-5.12-3.84-8.96v-39.68C320 135.68 427.52 75.52 518.4 75.52h6.4c97.28 0 197.12 70.4 202.24 229.12v39.68c0 3.84-1.28 6.4-3.84 8.96-2.56 2.56-5.12 3.84-8.96 3.84h-52.48v24.32c0 21.76-16.64 39.68-38.4 39.68-20.48 0-38.4-17.92-38.4-39.68v-24.32h-26.88v113.92c2.56 21.76-14.08 39.68-35.84 39.68z m-76.8-179.2h52.48c7.68 0 12.8 5.12 12.8 12.8v126.72c0 7.68 5.12 14.08 12.8 14.08s12.8-6.4 12.8-14.08v-126.72c0-7.68 5.12-12.8 12.8-12.8H601.6c7.68 0 12.8 5.12 12.8 12.8v37.12c0 7.68 5.12 14.08 12.8 14.08s12.8-6.4 12.8-14.08v-37.12c0-7.68 5.12-12.8 12.8-12.8h52.48v-25.6c-5.12-151.04-98.56-204.8-177.92-204.8h-3.84c-78.08 0-172.8 53.76-177.92 204.8v25.6h52.48c7.68 0 12.8 5.12 12.8 12.8v75.52c0 7.68 5.12 14.08 12.8 14.08 6.4 0 12.8-6.4 12.8-14.08v-75.52c-3.84-7.68 1.28-12.8 8.96-12.8z" fill="#231C1C" p-id="3203"></path></svg>',
    closeIcon: '<svg t="1605027968686" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5352"><path d="M512.775 48.024c255.612 0 464.75 209.138 464.75 464.75s-209.138 464.751-464.75 464.751-464.75-209.138-464.75-464.75 209.137-464.75 464.75-464.75m0-46.476C230.826 1.55 1.549 230.826 1.549 512.775S230.826 1024 512.775 1024 1024 794.723 1024 512.775 794.723 1.549 512.775 1.549z" fill="#ffffff" p-id="5353"></path><path d="M336.17 309.834c-6.197 0-13.943 3.098-18.59 7.745-10.845 10.845-10.845 26.336 0 37.18l354.759 354.76c4.647 4.647 12.393 7.746 18.59 7.746s13.942-3.099 18.59-7.746c10.844-10.844 10.844-26.336 0-37.18L353.21 317.579c-4.647-6.196-10.844-7.745-17.04-7.745z" fill="#ffffff" p-id="5354"></path><path d="M689.38 309.834c-6.197 0-13.943 3.098-18.59 7.745L317.58 672.34c-10.845 10.844-10.845 26.336 0 37.18 4.647 4.647 12.393 7.746 18.59 7.746 6.196 0 13.942-3.099 18.59-7.746l354.759-354.76c10.844-10.844 10.844-26.335 0-37.18-6.197-6.196-12.393-7.745-20.14-7.745z" fill="#ffffff" p-id="5355"></path></svg>',
    textDesc: '历史价格',
    fadeId: 'close-able-history-fade',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36',
    containerHeigh: 530,
    containerSkipLen: 580
};

const util = (function(){
    function randomString(e) {
        e = e || 32;
        var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz1234567890",
            a = t.length,
            n = "";
        for (let i = 0; i < e; i++) {
            n += t.charAt(Math.floor(Math.random() * a));
        }
        return n
    }

    function syncRequest(option) {
        return new Promise((resolve, reject) => {
            option.onload = (response) => {
                resolve(response);
            };
            GM_xmlhttpRequest(option);
        });
    }

    function regexGroupFinder(str, regex, groupName) {
        const matcher = str.match(regex);
        return matcher.groups[groupName];
    }

    function dateFormat(date, format) {
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "H+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return format;
    }

    function md5(originStr) {
        return CryptoJS.MD5(originStr);
    }

    return {
        random: (len) => randomString(len),
        req: (option) => syncRequest(option),
        regFinder: (str, regex, groupName) => regexGroupFinder(str, regex, groupName),
        dateFormat: (date, format) => dateFormat(date, format),
        md5: (originStr) => md5(originStr)
    }
})();

const dataProvider = (function(){
    const cache = {};

    class ProviderSupplier {
        constructor() {
            this.providerMapper = new Map();
            this.providerMapper.set("GouWuDang", () => new GouWuDangDataProvider());
        }

        get(providerName) {
            if (this.providerMapper.has(providerName)) {
                let supplier = this.providerMapper.get(providerName);
                return supplier();
            }
            throw new Error(`no data provider named ${providerName}`);
        }
    }

    class ChartsInfo {
        constructor(categories, data, heighest, minimun, name, link) {
            this.categories = categories;
            this.data = data;
            this.heighest = heighest;
            this.minimun = minimun;
            this.name = name;
            this.link = link;
        }
    }

    class BasicDataProvider {
        constructor(name, link) {
            this.name = name;
            this.link = link;
        }

        async load(){}
    }

    class GouWuDangDataProvider extends BasicDataProvider {
        constructor() {
            super('购物党', 'https://www.gwdang.com/');
            this.config = {
                main: 'https://www.gwdang.com/',
                firstQueryPath: '/api/url_to_dp',
                secondQueryPath: 'trend/data_www?show_prom=true&v=2&get_coupon=1&dp_id=',
                analizyPattern: {
                    regex: /var dp_id = '(?<dpid>.*)';/,
                    groupName: 'dpid'
                },
                userInfoBase: 'https://i.gwdang.com',
                userInfoReq: '/User/Detail'
            }
            this.dataCache = null;
        }

        async load() {
            const config = this.config;

            // todo: load cookie from login action
            let mockCookie = GM_getValue('hps.gwd.cookie-cache');
            if (!mockCookie) {
                let hasBeenAlerted = GM_getValue('hps.gwd.doc-alert', false);
                if (!hasBeenAlerted) {
                    GM_openInTab('https://greasyfork.org/en/scripts/416002-%E7%94%B5%E5%95%86%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E6%9F%A5%E8%AF%A2#%E9%99%84%E5%BD%95');
                    GM_setValue('hps.gwd.doc-alert', true);
                }
                mockCookie = prompt('历史价格查询能力依托于数据源: 购物党，\n\n需要先在购物党完成登录并提取Cookie:');
                if (!mockCookie) {
                    alert('无效的Cookie');
                    return;
                } else {
                    try {
                        let {nickname} = await this.#getUserInfo(mockCookie);
                        alert(`Cookie有效，以 「${nickname}」 获取数据`);
                    } catch(err) {
                        alert('获取用户信息失败，或许是无效的Cookie');
                        return;
                    }
                }
                GM_setValue('hps.gwd.cookie-cache', mockCookie);
            }

            if (this.dataCache === null) {
                const firstRequestRes = await util.req({
                    url: `${config.main}${config.firstQueryPath}?url=${encodeURIComponent(window.location)}&t=${parseInt(new Date().getTime() / 1e3)}`,
                    method: 'GET',
                    headers: {
                        'Cookie': mockCookie,
                        'user-agent': config.userAgent,
                        'authority': new URL(config.main).host
                    }
                });

                const urlToDpRes = JSON.parse(firstRequestRes.responseText);
                const chartsRes = await util.req({
                    url: `${config.main}${config.secondQueryPath}${urlToDpRes['dp_id']}`,
                    method: 'GET',
                    headers: {
                        'Cookie': mockCookie,
                        'user-agent': __HISTORY_PRICE_CONFIG__.userAgent,
                        'authority': new URL(config.main).host,
                        'referer': firstRequestRes.finalUrl
                    }
                });

                this.dataCache = JSON.parse(chartsRes.responseText);
                if (this.dataCache['is_ban'] != undefined) {
                    let bandResponse = this.dataCache;

                    this.dataCache = null;
                    let stillFailReq = GM_getValue('hps.gwd.failed-req');
                    if (stillFailReq === true) {
                        alert('数据获取失败，已清除保存的登录信息，请尝试通过Cookie重新登录');
                        GM_deleteValue('hps.gwd.cookie-cache');
                        GM_deleteValue('hps.gwd.failed-req');

                        throw new Error('Data fetch failed');
                    }
                    GM_setValue('hps.gwd.failed-req', true);

                    alert('需要进行验证，请在打开的新窗口完成验证后重试。');
                    GM_openInTab(bandResponse['action']['to'], {
                        active: true, setParent: true,
                    });
                    throw new Error('Need to verify');
                }
                GM_deleteValue('hps.gwd.failed-req');
            }

            return new Promise((resolve, reject) => {
                resolve(this.convert(this.dataCache));
            })
        }

        async #getUserInfo(inheritCookie) {
            const config = this.config;

            let time = parseInt(new Date().getTime() / 1e3);
            let userInfoRes = await util.req({
                url: `${config.userInfoBase}${config.userInfoReq}?t=${time}&sign=${this.#makeSign({t: time, ac: "user.detail"})}`,
                method: 'GET',
                headers: {
                    'Cookie': inheritCookie,
                    'user-agent': __HISTORY_PRICE_CONFIG__.userAgent,
                    'authority': new URL(config.main).host
                }
            });

            let data = JSON.parse(userInfoRes.responseText)
            if (data?.code === 1) {
                return data.data;
            }
            throw new Error('Get gwd user info failed');
        }

        #makeSign(requestParam) {
            const keys = Object.keys(requestParam);
            keys.sort();

            let originStr = keys.map(key => `${key}${requestParam[key]}`).join('');
            return util.md5(util.md5(originStr) + requestParam.ac);
        }

        convert({series}) {
            const categories = new Array();
            const data = new Array();
            let heightest = undefined;
            let minimun = undefined;

            let longestStackItem = series[0];
            for (let index = 1; index < series.length; index++) {
                if (longestStackItem.period < series[index].period) {
                    longestStackItem = series[index];
                }
            }

            for (const split of longestStackItem.data) {
                const price = split.y;
                if (heightest == undefined || heightest < price) {
                    heightest = price;
                }
                if (minimun == undefined || minimun > price) {
                    minimun = price;
                }
                categories.push(new Date(split.x * 1000));
                data.push(price);
            }

            return new ChartsInfo(
                categories, data, heightest,
                minimun, this.name, this.link
            );
        }
    }

    const providerSupplier = new ProviderSupplier();
    return {
        allocateProvider: () => {
            const activeProvider = __HISTORY_PRICE_CONFIG__.activeProvider;

            let provider = undefined;
            if (cache[activeProvider] == undefined) {
                provider = providerSupplier.get(activeProvider);
                cache[activeProvider] = provider;
            } else {
                provider = cache[activeProvider];
            }

            return provider;
        }
    }
})();

class BasicProvider {
    constructor(){
        this.defaultCallback = (container) => {
            let div = document.createElement('div');
            div.style.cssText = `width: 35px;
                height: 35px; padding: 7.5px;
                cursor: pointer;position: fixed;
                background-color: beige; border-radius: 50%;
                box-shadow: 0px 0px 24px 0px rgba(138,138,138,0.49);
                right: 5rem; bottom: 3rem;`;
            div.title = `${__HISTORY_PRICE_CONFIG__.textDesc}`;
            div.innerHTML += `${__HISTORY_PRICE_CONFIG__.icon}`;

            div.addEventListener('click', (target) => {
                this.apareHistory();
            });

            container.parentNode.appendChild(div);
        };
        this.defaultChartsOption = {
            title: {
                text: '商品历史价格',
                left: '5%',
                subtextStyle: {
                    color: '#e23c63'
                },
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                top: '15%'
            },
            xAxis: {
                type: 'category',
                nameLocation: 'middle',
            },
            yAxis: {
                min: (value) => value.min - 200,
                max: (value) => value.max + 200
            },
            dataZoom: [
                {
                    start: 60
                }
            ],
            series: {
                name: '商品历史价格',
                type: 'line',
                color: '#b8c94e',
                markLine: {
                    silent: true,
                    data: [
                        {
                            'type': 'max',
                            'color': 'rgba(226, 60, 99, 0.6)'
                        }, {
                            'type': 'min',
                            'color': 'rgba(226, 60, 99, 0.6)'
                        }
                    ]
                }
            }
        };
    }

    apareHistory(customConfig) {
        this.abstractFade(customConfig)
            .then((config) => this.loadHistoryInfo(config));
    }

    abstractRender(targetContainer) {
        const body = window.document;

        let tabContainer;
        let tryTime = 0;
        const maxTryTime = 30;

        return new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                tabContainer = body.querySelector(targetContainer);
                if (tabContainer) {
                    clearInterval(interval);
                    resolve(tabContainer);
                }
                if ((++tryTime) == maxTryTime) {
                    clearInterval(interval);
                    reject();
                }
            }, 1000);
        });
    }

    abstractFade(customConfig) {
        const body = document.getElementsByTagName('body')[0];

        if (!customConfig) {
            customConfig = __HISTORY_PRICE_CONFIG__;
        }

        const fadeDom = document.createElement('div');
        fadeDom.id = customConfig.fadeId;
        fadeDom.style.cssText = `z-index: 1000000000; width: 100%; height: 100vh; background-color: rgba(0, 0, 0, 0.85); position: fixed; top: 0; left: 0;`;
        const closeBtn = document.createElement('div');
        closeBtn.style.cssText = 'position: absolute; top: 2rem; right: 2rem; width: 35px; height: 35px; cursor: pointer';
        closeBtn.innerHTML = customConfig.closeIcon;
        closeBtn.addEventListener('click', e => {
            fadeDom.parentNode.removeChild(fadeDom);
        });

        fadeDom.appendChild(closeBtn);
        body.appendChild(fadeDom);

        return new Promise((res, rej) => {
            res(customConfig);
        });
    }

    loadHistoryInfo(config) {
        const container = document.getElementById(config.fadeId);
        const divContainer = document.createElement('div');
        divContainer.style.cssText = `position: absolute; top: 50%; left: 50%;
                      transform: translate(-50%, -50%); border: 0px;
                      border-radius: 15px; overflow-x: hidden;
                      background-color: #fff; overflow: hidden; text-align: center; padding: 1.5rem 0;`;

        divContainer.style.width = `80%`;
        divContainer.style.height = `${config.containerHeigh}px`;

        dataProvider.allocateProvider().load().then(data => {
            return new Promise((resolve, reject) => {
                container.appendChild(divContainer);
                const charts = this.makeCharts(data, divContainer);
                resolve(charts);
            });
        }).catch(err => console.log('Render history info failed', err));
    }

    makeCharts(data, container) {
        const option = this.defaultChartsOption;
        option.xAxis.data = data.categories.map(e => util.dateFormat(e, 'yyyy-MM-dd'));
        option.series.data = data.data.map(e => e / 100);
        option.title.subtext = `数据来源 ${data.name}${data.link} 最高价: ￥${data.heighest / 100} 最低价￥${data.minimun / 100}`;
        option.title.sublink = data.link;

        const myChart = echarts.init(container);
        myChart.setOption(option);
        return myChart;
    }
}

class JdProvider extends BasicProvider {
    render() {
        this.abstractRender('.jdm-toolbar-tabs.J-tab').then(
            (container) => {
                let div = document.createElement('div');
                div.className = 'J-trigger jdm-toolbar-tab';
                let em = document.createElement('em');
                em.className = 'tab-text';
                em.innerHTML = `${__HISTORY_PRICE_CONFIG__.textDesc}`;

                div.innerHTML += `${__HISTORY_PRICE_CONFIG__.icon}`;
                const icon = div.lastChild;
                icon.classList.add('hps-icon');
                div.appendChild(em);

                const customConfig = __HISTORY_PRICE_CONFIG__;
                customConfig.containerHeigh = 530;
                customConfig.containerSkipLen = 580;

                div.addEventListener('click', (target) => {
                    this.apareHistory();
                });

                const hpsStyle = document.createElement('style');
                hpsStyle.id = 'hps-style';
                hpsStyle.type = 'text/css';
                hpsStyle.innerHTML = `
                .hps-icon {
                    z-index: 2;
                    background-color: #7a6e6e;
                    position: relative;
                    border-radius: 3px 0 0 3px;
                }

                .hps-icon:hover {
                    background-color: #c81623;
                }`;

                document.head.appendChild(hpsStyle);

                container.appendChild(div);
            }
        ).catch(e => console.warn("page load not success", e));
    }
}

class TmallProvider extends BasicProvider {
    render() {
        this.abstractRender('body')
            .then(this.defaultCallback);
    }
}

class TaobaoProvider extends BasicProvider {
    render() {
        this.abstractRender('body')
            .then(container => {

            let div = document.createElement('div');
            div.style.cssText = `width: 35px;
                height: 35px; padding: 7.5px;
                cursor: pointer;position: fixed;
                background-color: beige; border-radius: 50%;
                box-shadow: 0px 0px 24px 0px rgba(138,138,138,0.49);
                right: 5rem; bottom: 3rem;`;
            div.title = `${__HISTORY_PRICE_CONFIG__.textDesc}`;
            div.innerHTML += `${__HISTORY_PRICE_CONFIG__.icon}`;

            const customConfig = __HISTORY_PRICE_CONFIG__;
            customConfig.containerHeigh = 530;

            div.addEventListener('click', (target) => {
                this.apareHistory(customConfig);
            });

            container.parentNode.appendChild(div);

        });
    }
}

const kiana = (function() {
    const methods = {
        initialLogic: (path) => {
            let mallCase = undefined;
            for (let pattern in __HISTORY_PRICE_CONFIG__.mallPattern) {
                if (__HISTORY_PRICE_CONFIG__.mallPattern[pattern].test(path)) {
                    mallCase = pattern;
                    break;
                }
            }
            if (mallCase == undefined) {
                return;
            }

            const provider = eval(`new ${mallCase}Provider`);
            provider.render();
        }
    }

    return {
        initial: () => {
            try {
                methods.initialLogic(window.location);
            }catch(message){
                console.warn(message);
            }
        }
    }
})();

(async function main() {
    kiana.initial();
})();