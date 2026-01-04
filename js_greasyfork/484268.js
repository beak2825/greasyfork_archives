// ==UserScript==
// @name         中华人民共和国中央人民政府【数据爬取和下载】
// @namespace    http://tampermonkey.net/
// @version      2024-01-08
// @description  www.gov.cn
// @author       You
// @match        https://sousuo.www.gov.cn/sousuo/search.shtml?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.gov.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484268/%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD%E4%B8%AD%E5%A4%AE%E4%BA%BA%E6%B0%91%E6%94%BF%E5%BA%9C%E3%80%90%E6%95%B0%E6%8D%AE%E7%88%AC%E5%8F%96%E5%92%8C%E4%B8%8B%E8%BD%BD%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/484268/%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD%E4%B8%AD%E5%A4%AE%E4%BA%BA%E6%B0%91%E6%94%BF%E5%BA%9C%E3%80%90%E6%95%B0%E6%8D%AE%E7%88%AC%E5%8F%96%E5%92%8C%E4%B8%8B%E8%BD%BD%E3%80%91.meta.js
// ==/UserScript==

/**
 * @param content 要保存的内容
 * @param filename 文件名
 */
var funDownload = function (content, filename) {
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
};
let tableMapping = [
    ["#", (l, ind) => ind + 1],
    ["发布事件", l => l.time.split(' ')[0]],
    ["标签", l => l.label],
    ["类型编号", l => l.documentType],
    ["来源编号", l => l.source],
    ["类型", l => {
        l = l.type || '';
        if (l instanceof Array) {
            return l.join('@');
        } else {
            return l.toString()
        }
    }],
    ["链接", l => l.url],
    ["标题", l => l.title_no_tag],
    ["发布代码", l => l.pubcode],
    ["文档类型", l => l.document || ''],
    ["文档ID", l => l.documentId || ''],
    ["general", l => l.general || ''],
    ["agencies", l => {
        l = l.agencies || '';
        if (l instanceof Array) {
            return l.join('@');
        } else {
            return l.toString()
        }
    }],
    ["Issue", l => {
        l = l.Issue || '';
        if (l instanceof Array) {
            return l.join('@');
        } else {
            return l.toString()
        }
    }],
    ["摘要", l => l.summary],
    ["内容", l => l.content],
];
class Loading {
    constructor() {
        this.dom = document.createElement('div');
        this.dom.setAttribute('style', 'width:100vw;height:100vh;position:fixed;left:0;top:0;display:none;rgb(144 144 144 / 26%);color: black;text-align: center;line-height: 150px;font-size: 40px;');
        document.body.append(this.dom);
    }
    show(text) {
        this.dom.innerText = text;
        this.dom.style.display = 'block';
    }
    hide() {
        this.dom.style.display = 'none';
    }
};
class SpiderDom {
    constructor(action) {
        this.action = {
            start() {
                action.start();
            },
            getCacheData() {
                return action.getCacheData();
            },
            downloadCacheData() {
                action.downloadCacheData();
            }
        };
        let dom = this.buildDom();
        $('.o_body').append(dom);
        this.initDomEvent();
    }

    buildDom() {
        return $(`<div style="display: block;flex: 1;background: #dfdfdf;">
<div id="spider_action">
<button id="spider_action_start" style="background: #025293;border-radius: 3px;color: #ffffff;cursor: pointer;padding: 5px;">开始爬取</button>
<!--<button id="spider_action_cache">从缓存读取</button>-->
<button id="spider_action_download" style="background: #025293;border-radius: 3px;color: #ffffff;cursor: pointer;padding: 5px;">下载</button>
</div>
<!--<div id="spider_search_info"></div>-->
<div id="spider_process"></div>
<div id="spider_result"></div>
</div>`);
    }
    initDomEvent() {
        $("#spider_action_start").on('click', () => {
            this.action.start();
        });
        $("#spider_action_cache").on('click', () => {
            let datas = this.action.getCacheData();
        });
        $("#spider_action_download").on('click', () => {
            this.action.downloadCacheData();
        });
    }
    drawCurrentSpiderData(list) {
        // spider_result
        let head = `<thead>${tableMapping.map(tm => `<th>${tm[0]}</th>`).join('')}</thead>`;
        // spider_result
        $("#spider_result").html(`${head}<tbody>
${list.map((l, ind) => {
            return `<tr>${tableMapping.map(tm => `<td>${tm[1](l, ind)}</td>`).join('')}</tr>`;
        }).join('\n')}
</tbody>`);
    }
    renderAfterPageRequest(requestData, responseData) {
        //
        let pageInfo = responseData.result.data.pager;
        let list = responseData.result.data.middle.list;
        let currentSpiderCount = (pageInfo.pageNo - 1) * pageInfo.pageSize + list.length;
        $("#spider_process").text(`总共有 ${pageInfo.total} 条记录，已经爬取 ${currentSpiderCount}`);
        this.drawCurrentSpiderData(list);
    }
    finish() {
        $("#spider_process").text("爬取完成");
    }
};
class Cache {
    constructor() {
        this.key = `spider_cache_key`;
        this.cache = [];
    }
    addData(list) {
        this.cache.splice(this.cache.length,0,...list);
        localStorage.setItem(this.key, JSON.stringify(this.cache));
    }
    getData() {
        if (this.cache.length) {
            return this.cache;
        } else {
            let data = localStorage.getItem(this.key);
            if (data) {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    data = null;
                } finally {
                    return data || [];
                }
            } else {
                return [];
            }
        }
    }
    download() {
        let data = this.getData();
        let head = tableMapping.map(_ => `"${_[0]}"`).join(',');
        let content = data.map((line, ind) => {
            return tableMapping.map(_ => {
                return `"${(_[1](line, ind) || "").toString().replace(/"/g, "'")}"`
            }).join(',');
        }).join('\r\n');
        funDownload("\uFEFF" + head + "\r\n" + content, (new Date().getTime()) + ".csv");
    }
}
class RequestPageData {
    static Status = {
        Over: 0,
        Requesting: 1,
        StartRequest: 2,
    }
    constructor() {
        this.currentPage = 0;
        this.pager = {
            "pageCount": 181,
            "total": 1810,
            "pageNo": 181,
            "pageSize": 10,
            "totalPage": 181,
        };
        this.beforeRequestHandle = [];
        this.afterRequestHandle = [];
        this.overRequestHandle = [];
        this.padding = false;
        this.requestId = null;
    }
    addAfterRequestHandle(cb) {
        this.afterRequestHandle.push(cb);
        return this;
    }
    addBeforeRequestHandle(cb) {
        this.beforeRequestHandle.push(cb);
        return this;
    }
    addOverRequestHandle(cb) {
        this.overRequestHandle.push(cb);
        return this;
    }
    start() {
        if (this.requestId) {
            return;
        } else {
            this.currentPage = 0;
            this.requestId = setInterval(() => {
                let status = this.go();
                if (status === RequestPageData.Status.Over) {
                    this.overRequestHandle.forEach(cb => cb());
                    clearInterval(this.requestId);
                }
            }, 500);
        }
    }
    go(page) {
        if (this.padding) {
            return RequestPageData.Status.Requesting;
        }
        if (page) {
            this.currentPage = page;
        } else {
            this.currentPage++;
        }
        if (this.currentPage === 1 || this.currentPage <= this.pager.totalPage) {
            this.padding = true;
            this.beforeRequestHandle.forEach(cb => cb(this.currentPage));
            window.listPager.goPageFn(this.currentPage);
            return RequestPageData.Status.Requesting;
        } else {
            return RequestPageData.Status.Over;
        }
    }
    callback(requestData, responseData) {
        this.pager = {
            ...responseData.result.data.pager,
            totalPage: Math.ceil(responseData.result.data.pager.total / responseData.result.data.pager.pageSize)
        };
        this.afterRequestHandle.forEach(cb => cb(requestData, responseData));
        this.padding = false;
    }
}

function init() {
    let cache = new Cache();
    let loading = new Loading();
    let hideResultId = false;
    let requestPageData = new RequestPageData();
    let spiderDom = new SpiderDom({
        start(page) {
            requestPageData.start();
        },
        getCacheData() {
            return cache.getData();
        },
        downloadCacheData() {
            cache.download();
            // todo
        }
    });
    requestPageData
        .addAfterRequestHandle(spiderDom.renderAfterPageRequest.bind(spiderDom))
        .addAfterRequestHandle((req, rep) => {
            cache.addData(rep.result.data.middle.list);
        })

        .addBeforeRequestHandle(page => loading.show(`正在获取数据 [page=${page}]`))

        .addOverRequestHandle(spiderDom.finish.bind(spiderDom))
        .addOverRequestHandle(() => loading.hide());

    return {
        hideResult() {
            if (hideResultId) {
                return;
            }
            function hide() {
                $('div.js_listPager.listPager').each((idx,e) => e.style.display = 'none');
                $('div.main_content.basic_result.js_result').each((idx,e) => e.style.display = 'none');
                $('iframe').each((idx,e) => e.parentElement.style.display = 'none');
                $('.search-main')[0].style.flex = 'unset';
            };
            hide();
            hideResultId = setInterval(() => {
                hide();
            }, 2000);
        },
        loading,
        redirectSuccess(requestData, responseData) {
            requestPageData.callback(requestData, responseData);
        },
    };
}


(function() {
    function inj() {
        let obj = init();
        const ajax = jQuery.ajax;
        window.ajaxInj = function (opt) {
            return ajax(opt); // 调用保存的原始 $.ajax
        };
        obj.hideResult();

        delete jQuery.ajax;
        delete $.ajax;

        $.ajax = function (opt) {
            if (opt.url.startsWith('https://sousuoht.www.gov.cn/athena/forward') && opt.dataType === 'json') {
                opt._go_ = true;
                opt.success = null;
                return window.ajaxInj(opt).then(ret => {
                    obj.loading.show();
                    obj.redirectSuccess(opt, ret);
                    obj.loading.hide();
                });
            } else {
                return window.ajaxInj(opt);
            }
        };
    }

    let id = setInterval(() => {
        if (window.$ && window.$.ajax && window.jQuery) {
            inj();
            clearInterval(id);
        }
    }, 500);

    // Your code here...
})();