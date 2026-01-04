// ==UserScript==
// @name         商品列表链接采集
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       LaYa
// @require https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @match        http*://domeggook.com/*
// @match        http*://www.bao66.cn/*
// @match        http*://www.amazon.com/*
// @match        http*://sellercenter.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @license      MIT LICENSE
// @downloadURL https://update.greasyfork.org/scripts/469613/%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8%E9%93%BE%E6%8E%A5%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/469613/%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8%E9%93%BE%E6%8E%A5%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

const bao66Util = function () {
    let completedFlag = true;
    let links = [];

    const init = () => {

    };
    const ready = () => {
        return true;
    };
    const completed = () => {
        return completedFlag;
    };
    const collectRun = async () => {
        completedFlag = false;
        links = $('.product_box li:not(.qzBanner) div.transition_box a').map((index, obj) => {
            return `${$(obj).attr('href')}`;
        }).get();

        completedFlag = true;
    };
    const resultGet = () => {
        return links;
    };

    return {
        collectRun: collectRun,
        init: init,
        ready: ready,
        completed: completed,
        resultGet: resultGet,
    }
}();

const domeggookUtil = function () {
    let links = [];
    let completedFlag = true;
    const init = () => {

    };
    const ready = () => {
        return true;
    };

    const completed = () => {
        return completedFlag;
    };
    const collectRun = async () => {
        completedFlag = false;
        links = $('#lLst li:not(.galleryMore) a.thumb').map((index, obj) => {
            return `${window.location.protocol}//${window.location.host}${$(obj).attr('href')}`;
        }).get();
        completedFlag = true;
    };
    const resultGet = () => {
        return links;
    };

    return {
        collectRun: collectRun,
        init: init,
        ready: ready,
        completed: completed,
        resultGet: resultGet,
    }
}();

const amazonUtil = function () {
    let linksSet = new Set();
    let completedFlag = true;
    const init = () => {

    };
    const ready = () => {
        return true;
    };

    const completed = () => {
        return completedFlag;
    };
    const collectRun = async () => {
        completedFlag = false;
        $('.rush-component.s-latency-cf-section span').each(function () {
            $(this).find('a.a-link-normal.s-no-outline').each(function () {
                let url = $(this).attr('href')
                if (url.indexOf('http') === -1) {
                    linksSet.add(`${window.location.protocol}//${window.location.host}${$(this).attr('href')}`); // 将链接添加到数组中
                }
            });
        });
        completedFlag = true;
    };
    const resultGet = () => {
        return Array.from(linksSet);
    };

    return {
        collectRun: collectRun,
        init: init,
        ready: ready,
        completed: completed,
        resultGet: resultGet,
    }
}();


const sellercenterUtil = function () {
    let apiUrl = '';
    let param = {};
    // let maxPage = 250;
    let maxPage = 0;
    let maxShowNumber = 0;

    let linksSet = new Set();
    let completedFlag = true;
    let token = '';

    const init = () => {
        requestUtil.addXMLRequestCallback((xhr) => {
            xhr.addEventListener("load", () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log('拦截返回 => ', xhr);
                    if (xhr.responseURL.indexOf('https://sellercenter.io/seller-center/shopify-seller-center') === 0) {
                        apiUrl = xhr.responseURL;
                        param = commonUtil.extractParamsFromURL(apiUrl);
                    }
                    maxShowNumber = parseInt(jQuery('.src-css-main-showNumber-2Jc1').find('span').eq(1).text())
                    token = commonUtil.extractParamsFromURL(window.location.href)['token']
                    maxPage = Math.ceil(maxShowNumber / 10);
                }
            });
        });

    };
    const ready = () => {
        return apiUrl.length > 0 && maxShowNumber > 0 && maxPage > 0;
    };
    const completed = () => {
        return completedFlag;
    };

    const collectRun = async () => {
        completedFlag = false;

        param['page'] = 1;
        while (param['page'] <= maxPage) {
            let url = apiUrl.substring(0, apiUrl.indexOf('?'))
            let response = await requestUtil.fetchDataByGet(`${url}?${commonUtil.buildQueryString(param)}`, {'authorization': token},2000);
            if (response) {
                if (param['page'] === 1 && response.total && response.total < maxShowNumber) {
                    maxPage = Math.ceil(response.total / 20);
                }
                if (response.hit_sources) {
                    for (let i = 0; i < response.hit_sources.length; i++) {
                        linksSet.add(response.hit_sources[i].shop_link);
                    }
                }
            }
            console.log('加载完成 => ', param['page'], ' 总共 => ', maxPage)
            param['page']++;
        }

        completedFlag = true;
    };

    const resultGet = () => {
        return Array.from(linksSet);
    };

    return {
        collectRun: collectRun,
        init: init,
        ready: ready,
        completed: completed,
        resultGet: resultGet,
    }
}();

const commonUtil = function () {
    const url = window.location.href;
    const isBao66 = url.indexOf('bao66') !== -1;
    const isDomeggook = url.indexOf('domeggook') !== -1;
    const isAmazon = url.indexOf('amazon') !== -1;
    const isSellerCenter = url.indexOf('sellercenter') !== -1;
    const copyToClipboard = (str) => {
        // 复制链接到剪切板
        // var textarea = document.createElement('textarea');
        // textarea.value = str
        // document.body.appendChild(textarea);
        // textarea.select();
        // document.execCommand('copy');
        // document.body.removeChild(textarea);

        GM_setClipboard(str)

        // 弹出提示框
        alert('复制成功！');
    };

    const extractParamsFromURL = (url) => {
        let queryString = url.split('?')[1];
        let params = {};
        if (queryString) {
            let pairs = queryString.split('&');
            for (let i = 0; i < pairs.length; i++) {
                let pair = pairs[i].split('=');
                let key = decodeURIComponent(pair[0]);
                let value = decodeURIComponent(pair[1]);
                params[key] = value;
            }
        }
        return params;
    }

    const buildQueryString = (params) => {
        let queryString = '';
        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                if (queryString.length > 0) {
                    queryString += '&';
                }
                queryString += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
            }
        }
        return queryString;
    }

    return {
        isBao66: isBao66,
        isDomeggook: isDomeggook,
        isAmazon: isAmazon,
        isSellerCenter: isSellerCenter,
        copyToClipboard: copyToClipboard,
        extractParamsFromURL: extractParamsFromURL,
        buildQueryString: buildQueryString,


    }
}()


const requestUtil = function () {
    const fetchDataByGet = async (url, headers, timeInterval) => {
        timeInterval = timeInterval || 1;
        return new Promise( (resolve, reject) => {
            $.ajax({
                url: url,
                type: 'GET',
                headers: headers,
                success: function(response) {
                    setTimeout(() => {
                        resolve(response);
                    }, timeInterval)
                },
                error: function(xhr, status, error) {
                    // 请求失败时的处理
                    reject(error);
                }
            });

            // $.get(url, function (data) {
            //     timeInterval = timeInterval || 1;
            //     setTimeout(() => {
            //         resolve(data);
            //     }, timeInterval)
            // }).fail(function (jqXHR, textStatus, errorThrown) {
            //     reject(errorThrown);
            // });
        });
    };
    const addXMLRequestCallback = (callback) => {
        var oldSend, i;
        if (XMLHttpRequest.callbacks) {
            // we've already overridden send() so just add the callback
            XMLHttpRequest.callbacks.push(callback);
        } else {
            // create a callback queue
            XMLHttpRequest.callbacks = [callback];
            // store the native send()
            oldSend = XMLHttpRequest.prototype.send;
            // override the native send()
            XMLHttpRequest.prototype.send = function () {
                // process the callback queue
                // the xhr instance is passed into each callback but seems pretty useless
                // you can't tell what its destination is or call abort() without an error
                // so only really good for logging that a request has happened
                // I could be wrong, I hope so...
                // EDIT: I suppose you could override the onreadystatechange handler though
                for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                    XMLHttpRequest.callbacks[i](this);
                }
                // call the native send()
                oldSend.apply(this, arguments);
            }
        }
    }
    return {
        fetchDataByGet: fetchDataByGet,
        addXMLRequestCallback: addXMLRequestCallback,
    }
}();

(function () {
    'use strict';

    if (commonUtil.isSellerCenter && window.self === window.top) {
        return
    }

    // Your code here...
    // 添加一个固定位置的按钮
    var button = $('<button>');
    button.text('复制当前页的全部链接');
    button.css({
        position: 'fixed',
        top: '50px',
        right: '50px',
        zIndex: '9999',
        width: '100px',
        height: '50px',
        fontSize: '10px',
        color: '#fff',
        backgroundColor: '#f00',
        borderRadius: '10px',
        // animation: 'blink 1s linear infinite'
    });

    $('body').append(button);

    let inst;
    if (commonUtil.isDomeggook) {
        inst = domeggookUtil;
    } else if (commonUtil.isBao66) {
        inst = bao66Util;
    } else if (commonUtil.isAmazon) {
        inst = amazonUtil;
    } else if (commonUtil.isSellerCenter) {
        inst = sellercenterUtil;
    } else {
        console.log('不支持的网站');
    }

    inst.init();

    setInterval(() => {
        if (inst.ready()) {
            button.css('backgroundColor', '#3cd458');
        }
    }, 1000)


    // 添加按钮的点击事件
    button.on('click', async () => {
        if (!inst.ready()) {
            alert('还未初始化');
            return
        }
        if (!inst.completed()) {
            alert('还未完成');
            return
        }
        await inst.collectRun();
        // 在这里编写你的点击事件代码
        let links = [];
        links = inst.resultGet()
        console.log(links.join('\n'));
        commonUtil.copyToClipboard(links.join('\n'));
    });

})();