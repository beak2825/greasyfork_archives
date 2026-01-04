// ==UserScript==
// @name         购物省钱小能手
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  京东、京东国际、淘宝、天猫查看商品历史价格（数据来源购物党）
// @author       reid
// @license      MIT
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @match        *://chaoshi.detail.tmall.com/*
// @match        *://*.tmall.hk/*
// @match        *://*.liangxinyao.com/*
// @match        *://*.jd.com/*
// @match        *://*.jd.hk/*
// @exclude      *://login.taobao.com/*
// @exclude      *://login.tmall.com/*
// @exclude      *://uland.taobao.com/*
// @exclude      *://pages.tmall.com/*
// @exclude      *://wq.jd.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/echarts/5.2.2/echarts.common.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/438406/%E8%B4%AD%E7%89%A9%E7%9C%81%E9%92%B1%E5%B0%8F%E8%83%BD%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/438406/%E8%B4%AD%E7%89%A9%E7%9C%81%E9%92%B1%E5%B0%8F%E8%83%BD%E6%89%8B.meta.js
// ==/UserScript==

const util = (function () {

    function randomString(e) {
        e = e || 32;
        let t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz1234567890",
            a = t.length,
            n = "";
        for (let i = 0; i < e; i++) {
            n += t.charAt(Math.floor(Math.random() * a));
        }
        return n
    }

    function syncRequest(option) {
        return new Promise((resolve, reject) => {
            option.onload = (res) => {
                resolve(res);
            };
            option.onerror = (err) => {
                reject(err);
            };
            GM_xmlhttpRequest(option);
        });
    }

    function dateFormat(date, format) {
        let o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "H+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (let k in o)
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return format;
    }

    function findTargetElement(ele) {
        const body = window.document;
        let tabContainer;
        let tryTime = 0;
        const maxTryTime = 30;
        return new Promise((resolve, reject) => {
            let interval = setInterval(() => {
                tabContainer = body.querySelector(ele);
                if (tabContainer) {
                    clearInterval(interval);
                    resolve(tabContainer);
                }
                if ((++tryTime) === maxTryTime) {
                    clearInterval(interval);
                    reject();
                }
            }, 1000);
        });
    }

    return {
        random: (len) => randomString(len),
        req: (option) => syncRequest(option),
        dateFormat: (date, format) => dateFormat(date, format),
        findTargetEle: (ele) => findTargetElement(ele)
    }
})();

const commodityHistoryPrice = (function () {

    const _CONFIG_ = {
        activeDataProvider: 'GWDang',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path style="fill: #e3a7c0;" d="M50,2.125c26.441,0,47.875,21.434,47.875,47.875c0,26.441-21.434,47.875-47.875,47.875C17.857,97.875,2.125,76.441,2.125,50C2.125,23.559,23.559,2.125,50,2.125z"></path><g class="icon"><path style="fill: #7BC156;" d="M42.401,35.96l15.197,11.053v25.563H42.401V35.96z"></path><path style="fill: #92D76C;" d="M27.201,42.178l15.199-6.22v36.616c0,0-8.186,0-11.294,0c-1.785,0-3.986-1.842-3.906-3.397C27.518,63.139,27.201,42.178,27.201,42.178z"></path><path style="fill: #64A242;" d="M72.8,69.178c0.08,1.556-2.121,3.398-3.907,3.398c-3.107,0-11.294,0-11.294,0V47.013l15.199-17.271C72.8,29.741,72.483,63.139,72.8,69.178z"></path><path style="fill: #fff;" d="M42.401,33.642c1.524,0,2.763,1.237,2.763,2.764s-1.238,2.764-2.763,2.764c-1.527,0-2.764-1.237-2.764-2.764S40.875,33.642,42.401,33.642z"></path><path style="fill: #fff;" d="M57.599,42.623c1.526,0,2.763,1.237,2.763,2.763c0,1.527-1.236,2.765-2.763,2.765c-1.525,0-2.763-1.237-2.763-2.765C54.836,43.86,56.073,42.623,57.599,42.623z"></path><path style="fill: #fff;" d="M72.8,27.424c1.524,0,2.762,1.238,2.762,2.764c0,1.527-1.237,2.765-2.762,2.765c-1.527,0-2.764-1.237-2.764-2.765C70.034,28.661,71.271,27.424,72.8,27.424z"></path><path style="fill: #fff;" d="M27.201,38.479c1.525,0,2.764,1.237,2.764,2.764s-1.238,2.765-2.764,2.765c-1.526,0-2.763-1.238-2.763-2.765C24.438,39.715,25.675,38.479,27.201,38.479z"></path></g></svg>',
        closeIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1025 1024"><path d="M512.775 48.024c255.612 0 464.75 209.138 464.75 464.75s-209.138 464.751-464.75 464.751-464.75-209.138-464.75-464.75 209.137-464.75 464.75-464.75m0-46.476C230.826 1.55 1.549 230.826 1.549 512.775S230.826 1024 512.775 1024 1024 794.723 1024 512.775 794.723 1.549 512.775 1.549z" fill="#ffffff"></path><path d="M336.17 309.834c-6.197 0-13.943 3.098-18.59 7.745-10.845 10.845-10.845 26.336 0 37.18l354.759 354.76c4.647 4.647 12.393 7.746 18.59 7.746s13.942-3.099 18.59-7.746c10.844-10.844 10.844-26.336 0-37.18L353.21 317.579c-4.647-6.196-10.844-7.745-17.04-7.745z" fill="#ffffff"></path><path d="M689.38 309.834c-6.197 0-13.943 3.098-18.59 7.745L317.58 672.34c-10.845 10.844-10.845 26.336 0 37.18 4.647 4.647 12.393 7.746 18.59 7.746 6.196 0 13.942-3.099 18.59-7.746l354.759-354.76c10.844-10.844 10.844-26.335 0-37.18-6.197-6.196-12.393-7.745-20.14-7.745z" fill="#ffffff"></path></svg>',
        textDesc: '历史价格',
        fadeId: 'close-history-fade',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4280.141 Safari/537.36'
    };

    const dataProvider = (function () {
        const cache = {};

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

            async load() {
            }
        }

        class GWDangDataProvider extends BasicDataProvider {
            constructor() {
                super('购物党', 'https://www.gwdang.com/');
                this.config = {
                    firstQueryPath: 'https://browser.gwdang.com/brwext/dp_query_latest?union=union_gwdang&format=jsonp',
                    secondQueryPath: 'https://www.gwdang.com/trend/data_www?show_prom=true&v=2&get_coupon=1&dp_id='
                }
                this.dataCache = null;
            }

            /**
             * 获取数据
             */
            async load() {
                const config = this.config;
                const link = this.link;
                let mockCookie = undefined;
                if (this.dataCache == null) {
                    const fp = util.random(32);
                    const dfp = util.random(60);
                    const firstRes = await util.req({
                        url: `${config.firstQueryPath}&url=${encodeURIComponent(window.location)}&fp=${fp}&dfp=${dfp}`,
                        method: 'GET',
                        headers: {
                            'Cookie': (mockCookie = `fp=${fp};dfp=${dfp};`),
                            'user-agent': _CONFIG_.userAgent,
                            'authority': new URL(link).host
                        }
                    });

                    const {dp} = JSON.parse(firstRes.responseText);
                    const secondRes = await util.req({
                        url: `${config.secondQueryPath}${dp['dp_id']}`,
                        method: 'GET',
                        headers: {
                            'Cookie': mockCookie,
                            'user-agent': _CONFIG_.userAgent,
                            'authority': new URL(link).host,
                            'referer': firstRes.finalUrl
                        }
                    });
                    this.dataCache = JSON.parse(secondRes.responseText);
                    if (this.dataCache['is_ban'] !== undefined) {
                        alert('需要进行验证，请在打开的新窗口完成验证后再刷新本页面。');
                        GM_openInTab(this.dataCache['action']['to'], {active: true, insert: true, setParent: true});
                    }
                }

                return new Promise((resolve, reject) => {
                    resolve(this.convert(this.dataCache));
                })
            }

            convert({series}) {
                const categories = [];
                const data = [];

                let longestStackItem = series[0];
                for (let index = 1; index < series.length; index++) {
                    if (longestStackItem.period < series[index].period) {
                        longestStackItem = series[index];
                    }
                }
                if (longestStackItem.data === undefined) {
                    return null;
                }
                for (const split of longestStackItem.data) {
                    categories.push(new Date(split.x * 1000));
                    data.push(split.y);
                }
                return new ChartsInfo(categories, data, longestStackItem.max, longestStackItem.min, this.name, this.link);
            }
        }

        return {
            allocateProvider: () => {
                const activeProvider = _CONFIG_.activeDataProvider;
                let provider = undefined;
                if (cache[activeProvider] === undefined) {
                    provider = eval(`new ${activeProvider}DataProvider()`);
                    cache[activeProvider] = provider;
                } else {
                    provider = cache[activeProvider];
                }
                return provider;
            }
        }
    })();

    const dataConsumer = (function () {

        class BasicConsumer {
            constructor() {
                this.defaultCallback = (container) => {
                    let div = document.createElement('div');
                    div.style.cssText = `width: 35px;
                height: 35px; padding: 7.5px;
                cursor: pointer;position: fixed;
                background-color: beige; border-radius: 50%;
                box-shadow: 0px 0px 24px 0px rgba(138,138,138,0.49);
                right: 5rem; bottom: 3rem;`;
                    div.title = `${_CONFIG_.textDesc}`;
                    div.innerHTML += `${_CONFIG_.icon}`;

                    div.addEventListener('click', (target) => {
                        this.showHistory();
                    });

                    container.parentNode.appendChild(div);
                };
                this.defaultChartsOption = {
                    title: {
                        text: '商品历史价格',
                        left: '5%',
                        subtextStyle: {
                            color: '#e23c63'
                        }
                    },
                    grid: {
                        top: '15%'
                    },
                    xAxis: {
                        type: 'category',
                        nameLocation: 'middle',
                    },
                    yAxis: {
                        min: (value) => {
                            if (value.min < 100) {
                                return value.min - 50;
                            } else if (value.min < 1000) {
                                return value.min - 200;
                            } else {
                                return value.min - 1000;
                            }
                        },
                        max: (value) => {
                            if (value.max < 100) {
                                return value.max + 50;
                            } else if (value.max < 1000) {
                                return value.max + 200;
                            } else {
                                return value.max + 1000;
                            }
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    dataZoom: [{start: 30}],
                    series: {
                        type: 'line',
                        name: '价格',
                        areaStyle: {
                            opacity: 0.5
                        },
                        markPoint: {
                            data: [
                                {type: 'max', name: '最大值'},
                                {type: 'min', name: '最小值'}
                            ]
                        },
                        markLine: {
                            data: [
                                {type: 'average', name: '平均值'}
                            ]
                        }
                    }
                };
            }

            /**
             * 显示价格历史
             */
            showHistory(customConfig) {
                this.abstractFade(customConfig)
                    .then((config) => this.loadHistoryInfo(config));
            }

            /**
             * 遮罩层
             */
            abstractFade(customConfig) {
                if (!customConfig) {
                    customConfig = _CONFIG_;
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

                const loadDiv = document.createElement('div');
                loadDiv.textContent = '数据正在请求中，请等待。。。。。。';
                loadDiv.style.cssText = `font-size : 14px; color: white; position: absolute; top: 30%; left: 40%;`;
                fadeDom.appendChild(loadDiv);

                const body = document.getElementsByTagName('body')[0];
                body.appendChild(fadeDom);
                return new Promise((res, rej) => res(customConfig));
            }

            /**
             * 遮罩层中图表数据
             */
            async loadHistoryInfo(config) {
                const container = document.getElementById(config.fadeId);
                const divContainer = document.createElement('div');
                divContainer.style.cssText = `position: absolute; top: 50%; left: 50%;
                      transform: translate(-50%, -50%); border: 0px;
                      border-radius: 15px; overflow-x: hidden;
                      background-color: #fff; overflow: hidden; text-align: center; padding: 1.5rem 0;`;
                divContainer.style.width = `80%`;
                divContainer.style.height = `530px`;

                dataProvider.allocateProvider().load()
                    .then(data => {
                        return new Promise((resolve, reject) => {
                            container.appendChild(divContainer);
                            if (data === null) {
                                divContainer.textContent = "暂无历史价格数据";
                                resolve("暂无历史价格数据");
                            } else {
                                const charts = this.makeCharts(data, divContainer);
                                resolve(charts);
                            }
                        });
                    });
            }

            /**
             * 制作图表
             */
            makeCharts(data, container) {
                const option = this.defaultChartsOption;
                option.xAxis.data = data.categories.map(e => util.dateFormat(e, 'yyyy-MM-dd'));
                option.series.data = data.data.map(e => e / 100);
                option.title.subtext = `最高价: ￥${data.heighest / 100}  最低价￥${data.minimun / 100}`;
                const myChart = echarts.init(container);
                myChart.setOption(option);
                return myChart;
            }
        }

        class JdConsumer extends BasicConsumer {
            render() {
                util.findTargetEle('.jdm-toolbar-tabs.J-tab')
                    .then((container) => {
                            let div = document.createElement('div');
                            div.className = 'J-trigger jdm-toolbar-tab';

                            let em = document.createElement('em');
                            em.className = 'tab-text';
                            em.innerHTML = `${_CONFIG_.textDesc}`;
                            div.innerHTML += `${_CONFIG_.icon}`;
                            const icon = div.lastChild;
                            icon.classList.add('hps-icon');
                            div.appendChild(em);
                            GM_addStyle(`
                                .hps-icon {
                                    z-index: 2;
                                    background-color: #7a6e6e;
                                    position: relative;
                                    border-radius: 3px 0 0 3px;
                                }
                
                                .hps-icon:hover {
                                    background-color: #c81623;
                                }`);
                            div.addEventListener('click', (target) => {
                                this.showHistory();
                            });
                            container.appendChild(div);
                        }
                    ).catch(e => console.warn("页面没加载完成", e));
            }
        }

        class DefaultConsumer extends BasicConsumer {
            render() {
                util.findTargetEle('body')
                    .then(this.defaultCallback);
            }
        }

        return {
            callDataConsumer: (path) => {
                let mallCase = 'Default';
                let matchData = {
                    Jd: /jd/
                };
                for (let pattern in matchData) {
                    if (matchData[pattern].test(path)) {
                        mallCase = pattern;
                        break;
                    }
                }
                const provider = eval(`new ${mallCase}Consumer`);
                provider.render();
                //dataProvider.allocateProvider().load();
            }
        }
    })();

    return {
        start: () => {
            dataConsumer.callDataConsumer(window.location);
        }
    }
})();

(function () {
    commodityHistoryPrice.start();
})();