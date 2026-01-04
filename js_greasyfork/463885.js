// ==UserScript==
// @name         showBossActiveTime
// @namespace    http://www.chensong.cc/
// @version      0.4.3
// @description  to show hr lastest login time,help you deliver your resume efficiently.
// @author       chensong
// @match        https://www.zhipin.com/web/geek/job
// @match        https://www.zhipin.com/web/geek/job*
// @match        https://www.zhipin.com/web/geek/recommend
// @match        https://www.zhipin.com/web/geek/recommend*
// @exclude      https://www.zhipin.com/web/geek/map/jobs*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       GM_xmlhttpRequest
// @license     MIT
//失业中，欢迎来扰:) 857763541@qq.com
// @downloadURL https://update.greasyfork.org/scripts/463885/showBossActiveTime.user.js
// @updateURL https://update.greasyfork.org/scripts/463885/showBossActiveTime.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class ShowBossActiveTime {
        static MAXLIMIT = 5;
        static TIME = 2000;
        constructor(options) {
            this.queryQueue = []; //记录需要查询的队列
            this.currentDomList = []; //当前列表的dom
            this.secondQueryList = []; //需要二次查询的队列
            this.maxLimit = ShowBossActiveTime.MAXLIMIT;
            this.timer = null;
            this.frame = null;
            let bossActiveStatusList;
            try {
                bossActiveStatusList = JSON.parse(
                    localStorage.getItem('bossActiveStatusList')
                ) || [
                    '半年前活跃',
                    '近半年活跃',
                    '4月前活跃',
                    '2月内活跃',
                    '2周内活跃'
                ];
            } catch (error) {
                //   转换之前客户端存在的数据格式
                bossActiveStatusList = localStorage
                    .getItem('bossActiveStatusList')
                    .split(',');
            }
            this.statusOptions = bossActiveStatusList.filter((option)=> option && option!== '');

            this.removeStatusList = [];
            this.options = Object.assign(
                {
                    listElement: '.job-card-wrapper',
                    onlineElement: '.boss-online-tag',
                    chatElement: '.start-chat-btn',
                    hunterElement: '.job-tag-icon',
                    linkElement: '.job-card-left',
                    paginationElement: '.options-pages',
                    hideChated: false
                },
                options
            )
            this.list = []; //数据列表
            //添加过滤条件，因为要保存选择数据，所以这个不能切换时清空
            this.addStatusFilter();
            this.addStyleSheet();
            this.ready();
            // 监听请求数据事件
            this.observeLoadingData();
            this.init();
        }

        // 获取节点列表
        getList() {
            Array.from(document.querySelectorAll(this.options.listElement)).forEach(
                (node) => {
                    const status = node.querySelector(this.options.onlineElement);
                    //   保存所有list的dom
                    this.list.push(node);
                    let hunter = node.querySelector(this.options.hunterElement);
                    hunter && (hunter = hunter.alt === '猎头')
                    // 不在线且不是猎头
                    if (!status && !hunter) {
                        // 需要查询的dom
                        this.queryQueue.push(node);
                    }else{
                        //如果是猎头
                        if (hunter) {
                            const chat = node.querySelector(this.options.chatElement).textContent;
                            this.setText(node, '猎头，没有活跃状态', chat);
                            return;
                        }
                        // 先给在线的数据设置状态
                        const chat = node.querySelector(this.options.chatElement).textContent;
                        const online = node.querySelector(this.options.onlineElement);

                        if (online) {
                            this.setText(node, '在线', chat);
                        }
                    }
                }
            );
        }

        getListStatus() {
            // 每两秒下一个请求
            // 保存请求的条数
            let requestNum = this.queryQueue.length;
            let requestedNum = 0;
            this.timer = setInterval(() => {
                if (this.queryQueue.length === 0) {
                    clearInterval(this.timer);
                    this.timer = null;
                    this.maxLimit = ShowBossActiveTime.MAXLIMIT;
                    return;
                }

                if (this.maxLimit > 0) {
                    this.maxLimit--;
                    let node = this.queryQueue.shift();
                    let link = node.querySelector(this.options.linkElement).href;
                    let chat = node.querySelector(this.options.chatElement).textContent;
                    this.getStatusByXHR(link, node, chat).then(({ text, type }) => {
                        // 设置文字
                        if(text===''){
                            text ='没有找到hr登录状态'
                        }
                        this.setText(node, text, chat);
                        this.toggleDom(node);
                        console.log(type, text, link);
                        // 增加一个请求
                        this.maxLimit++;
                        requestedNum++;
                        if (requestedNum === requestNum) {
                            this.alertBox('查询完毕');
                        }
                    });
                }
            }, ShowBossActiveTime.TIME);
        }
        async getStatusByXHR(url, node, chat) {
            return new Promise((resolve) => {
                // 第一次获取
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    headers: {
                        Cookie: document.cookie
                    },
                    onload: (response) => {
                        if (/security-check.html/.test(response.finalUrl)) {
                            //  出现重定向后，使用返回的callbackUrl生成目标链接，二次获取
                            this.getHtmlByFormatUrl(response, 1).then((res) => {
                                resolve(res);
                            });
                        } else {
                            const doc = this.parseHtml(response);
                            const text = this.getStatusText(doc);
                            resolve({
                                text,
                                type: '第一次就获取到的数据'
                            });
                        }
                    }
                });
            });
        }
        getHtmlByFormatUrl(response, repeatCount) {
            return new Promise((resolve) => {
                // 二次获取，说明触发302，需要延时
                setTimeout(() => {
                    getFinalUrl(response.finalUrl, (url) => {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url,
                            onload: (res) => {
                                if (!/security-check.html/.test(res.finalUrl)) {
                                    const doc = this.parseHtml(res);
                                    const text = this.getStatusText(doc);
                                    resolve({
                                        text,
                                        type: '二次请求的数据'
                                    });
                                } else {
                                    // 二次请求不成功，继续使用GM_xmlhttpRequest成功率低，转为其它形式,先fetch,fetch不行，用iframe
                                    return fetch(url, { redirect: 'error' })
                                        .then((res) => {
                                        return res.text();
                                    })
                                        .then(async (data) => {
                                        const doc = document.createElement('div');
                                        doc.insertAdjacentHTML('afterbegin', data);
                                        const text = this.getStatusText(doc);
                                        resolve({
                                            text,
                                            type: 'fetch的数据'
                                        });
                                    })
                                        .catch(async (error) => {
                                        /*请求被302临时重定向了，无法获取到数据，需要用iframe来获取了*/
                                        this.getStatusByIframe(url).then((text) => {
                                            resolve({
                                                text,
                                                type: 'iframe的数据'
                                            });
                                        });
                                    });
                                }
                            }
                        });
                    });
                }, 1000 * repeatCount);
            });
        }
        parseHtml(res) {
            const html = res.responseText;
            const parser = new DOMParser();
            return parser.parseFromString(html, 'text/html');
        }
        ready() {
            var frame = document.createElement('iframe');
            frame.style.height = 0;
            frame.style.width = 0;
            frame.style.margin = 0;
            frame.style.padding = 0;
            frame.style.border = '0 none';
            frame.name = 'zhipinMyFrame';
            frame.src = 'about:blank';
            (document.body || document.documentElement).appendChild(frame);
            this.frame = frame;
        }

        checkIsSecurityCheckPage(tempIframe) {
            return tempIframe.contentWindow.securityPageName === 'securityCheck';
        }
        async getStatusByIframe(url) {
            let iframe = document.createElement('iframe');
            let match = url.match(/job_detail\/([^\/]+)\.html/);
            iframe.src = url;
            iframe.id = 'tempIframe' + match[1];
            iframe.style.cssText = 'width:0;height:0;';
            document.body.appendChild(iframe);

            return await new Promise((resolve) => {
                // 定时检测iframe中的某个节点是否已经渲染
                let timer = setInterval(() => {
                    // 获取iframe中的document对象
                    let iframeDoc =
                        iframe.contentDocument || iframe.contentWindow.document;
                    let hasFooter = iframeDoc.querySelector('#footer');
                    let status = this.getStatusText(iframeDoc);
                    let verify = iframeDoc.querySelector('page-verify-slider') || document.querySelector('body').textContent.match(/您的账号可能存在异常访问行为，完成验证后即可正常使用/g)
                    if(verify){
                        this.alertBox('更新过于频繁，触发认证操作了');
                        this.clear();
                    }
                    if (hasFooter && iframeDoc.title !== '请稍候' && status) {
                        resolve(status);
                        iframe.remove();
                        clearInterval(timer);
                    }
                }, 200);
            });
        }
        observeLoadingData() {
            const container = document.querySelector('.search-job-result');
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        const addNode = mutation.addedNodes;
                        const removedNode = mutation.removedNodes;
                        if (
                            addNode.length &&
                            addNode[0].className === 'job-loading-wrapper'
                        ) {
                            console.log('触发了请求列表数据');
                        }
                        if (
                            removedNode.length &&
                            removedNode[0].className === 'job-loading-wrapper'
                        ) {
                            console.log('页面加载完成，开始执行查询状态');
                            this.clear();
                            this.init();
                        }
                    }
                });
            });
            const config = { attributes: false, childList: true, subtree: false };
            observer.observe(container, config);

            // 监听是否是搜索列表页,不是就移除dom
            const listContainer = document.querySelector('#wrap');
            const listObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        const wrapper = document.querySelector('.job-list-wrapper');
                        const removeNode = document.querySelector(
                            '#removeFilterDataContainer'
                        );
                        if (!wrapper && removeNode) {
                            document.body.removeChild(removeNode);
                            listObserver.disconnect();
                            // 清除查询
                            this.clear();
                        }
                    }
                });
            });
            listObserver.observe(listContainer, config);
        }
        alertBox(msg) {
            let div = document.createElement('div');
            div.id = 'alertBox';
            div.innerHTML = msg;
            document.body.appendChild(div);
            setTimeout(function () {
                document.body.removeChild(div);
            }, 2000);
        }
        getStatusText(doc) {
            const timeNode = doc.querySelector('.boss-active-time');
            if (timeNode) {
                return timeNode.textContent;
            } else {
                let status = null;
                // 没有获取到状态，但页面是已经加载到的了
                if (doc.querySelector('.job-boss-info')) {
                    status = '获取到数据了，但不知道是什么数据';
                }
                const isHunter = ['.certification-tags', '.boss-info-attr'].filter(
                    (name) => {
                        const node = doc.querySelector(name);
                        return /猎头|人力|人才|经纪/.test(node?.textContent);
                    }
                );
                isHunter && (status = '猎头，没有活跃状态');
                return status;
            }
        }
        toggleDom(node) {
            const status = node.querySelector('.status')?.textContent;
            const chat = node.querySelector(this.options.chatElement).textContent;
            // 先显示全部
            node.style.display = 'block';
            // 首先判断是否隐藏已沟通
            if (this.options.hideChated && chat === '继续沟通') {
                node.style.display = 'none';
            }
            // 状态数据已经获取了
            if (status && chat) {
                if (this.removeStatusList.includes(status)) {
                    node.style.display = 'none';
                }
                if (this.options.hideChated && chat === '继续沟通') {
                    node.style.display = 'none';
                }
            }
        }
        toggleDoms() {
            this.list.forEach((node) => {
                this.toggleDom(node);
            });
        }
        addStatusFilter() {
            const container = document.createElement('div');
            container.id = 'removeFilterDataContainer';
            const html = `
          <label><input type="checkbox" name="hideChated" value="1">过滤已经沟通过的</label>
          <div id="boss-active-time-arrow"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg></div>
          `;
        const title = document.createElement('div');
        title.className = 'title';
        title.innerHTML = html;
        const tips = document.createElement('div');
        tips.innerHTML = '过滤掉勾选的数据';
        tips.className = 'tips';
        container.appendChild(title);
        container.appendChild(tips);
        container
            .querySelector('#boss-active-time-arrow')
            .addEventListener('click', function () {
            container.classList.contains('hide')
                ? container.classList.remove('hide')
            : container.classList.add('hide');
        });

        this.statusOptions.forEach((option) => {
            const label = document.createElement('label');
            const el = document.createElement('input');
            el.type = 'checkbox';
            el.name = option;
            el.value = option;
            el.className = 'status-checkbox';
            label.appendChild(el);
            label.appendChild(document.createTextNode(option));
            container.appendChild(label);
        });

        container.addEventListener('change', () => {
            const selectedValues = Array.from(
                container.querySelectorAll('.status-checkbox:checked')
            ).map((el) => el.value);
            this.removeStatusList = selectedValues;
            const hideNode = document.querySelector('input[name="hideChated"]');
            this.options.hideChated = hideNode?.checked;
            this.toggleDoms();
        });

        document.body.appendChild(container);
    }
      // 清空查询列表，清除缓存的dom
      clear() {
          this.queryQueue.length = 0;
          this.list.length = 0;
          this.currentDomList.length = 0;
          this.maxLimit = ShowBossActiveTime.MAXLIMIT;
          clearInterval(this.timer);
          this.timer = null;
      }
      ready() {
          let frame = document.createElement('iframe');
          frame.style.height = 0;
          frame.style.width = 0;
          frame.style.margin = 0;
          frame.style.padding = 0;
          frame.style.border = '0 none';
          frame.name = 'zhipinMyFrame';
          frame.src = 'about:blank';
          document.body.appendChild(frame);
      }
      addStyleSheet() {
          const style = `
                .show-active-status{display:flex;padding:5px 10px;background:#e1f5e3;color:green;width:80%;border-radius:4px;margin-top:10px;margin-bottom:5px;}
                .show-active-status .status{}
                .show-active-status .chat{}
                #alertBox{position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%); background-color: rgb(0 190 189); border-radius: 5px; color: #fff; z-index: 9999; padding: 20px 40px; font-size: 20px; box-shadow: 0px 0px 10px rgba(0,0,0,.2);}
                #removeFilterDataContainer{
                position: fixed;right: 70px;top: 70px;z-index: 20000;background: #00bebd; color: #fff;display: flex;flex-direction: column;padding-bottom:10px
                }
                #removeFilterDataContainer.hide{height:28px;overflow:hidden}
                #removeFilterDataContainer .title {display:flex;justify-content: space-around;}
                #removeFilterDataContainer .title label{align-items:center;padding:0 15px;}
                #removeFilterDataContainer.hide #boss-active-time-arrow svg{transform: rotate(180deg);}
                #removeFilterDataContainer #boss-active-time-arrow {cursor: pointer;font-size: 24px;background: #009796;padding:2px 10px;line-height:1;}
                #removeFilterDataContainer .tips{font-size:16px;margin:5px 20px;}
                #removeFilterDataContainer label{display:flex;padding:0 20px;}
                #removeFilterDataContainer label input{margin-right:5px;}
                `;
        const styleEle = document.createElement('style');
        styleEle.id = 'show-boss-active-time-css';
        styleEle.innerHTML = style;
        document.head?.appendChild(styleEle);
    }
      // 设置文本内容
      setText(node, text, status) {
          const html = `
            <div class="show-active-status">
              <p class="status">${text}</p>&nbsp;&nbsp;&nbsp;&nbsp;
              <p class="chat">${status}</p>
            </div>
          `;
        node.querySelector('.job-info').insertAdjacentHTML('afterend', html);
        let aEle = node.querySelector('a');
        aEle.style.height = 'auto';
        aEle.style.paddingBottom = '0';
        //   如果是新的状态值，加入到状态列表中
        if (!this.statusOptions.includes(text) && text !== '在线') {
            this.statusOptions.push(text);
            localStorage.setItem(
                'bossActiveStatusList',
                JSON.stringify(this.statusOptions)
            );
        }
    }

      // 获取列表数据
      init() {
          this.getList();
          this.alertBox('开始更新状态....,网站安全策略问题，更新会比较缓慢。');
          this.getListStatus();
          // 判断是否要隐藏已经沟通过的数据
          this.toggleDoms();
      }
  }
    function start() {
        const Lis = document.querySelectorAll('.job-card-wrapper');
        if (Lis.length) {
            new ShowBossActiveTime();
        } else {
            console.log('no start');
            setTimeout(start, 2000);
        }
    }
    start();
// 获取302后详情页的最终地址
    function getFinalUrl(url, cb) {
        let securityPageName = 'securityCheck';

        const urlObject = new URL(url);
        const search = urlObject.search;
        (function () {
            var image = new Image();
            var lenSrcReferer = url.split('srcReferer').length - 1;
            image.src =
                'https://t.zhipin.com/f.gif?pk=' +
                securityPageName +
                '&len=' +
                lenSrcReferer +
                '&r=' +
                document.referrer;
        })();
        (function () {
            var pageInterNum = 0;
            var pageStartTime = new Date().getTime();
            var UA = window.navigator.userAgent;
            var isIE;
            if (UA.indexOf('MSIE ') > -1) {
                isIE = true;
            }
            let frame = document.querySelector('#zhipinMyFrame');
            init(frame, url);
            function init(frame) {
                var COOKIE_DOMAIN = (function () {
                    var hostName = location.hostname;
                    if (hostName === 'localhost' || /^(\d+\.){3}\d+$/.test(hostName)) {
                        return hostName;
                    }
                    return '.' + hostName.split('.').slice(-2).join('.');
                })();
                var seriesLoadScript = function (scriptUrl, callback) {
                    var url = scriptUrl;
                    var script = document.createElement('script');
                    script.setAttribute('type', 'text/javascript');
                    script.setAttribute('charset', 'UTF-8');
                    debugger;
                    script.onload = script.onreadystatechange = function () {
                        if (
                            !isIE ||
                            this.readyState == 'loaded' ||
                            this.readyState == 'complete'
                        ) {
                            callback();
                        }
                    };
                    script.setAttribute('src', scriptUrl);
                    if (frame.tagName != 'IFRAME') {
                        frame.appendChild(script);
                    } else if (frame.contentDocument) {
                        if (frame.contentDocument.body) {
                            frame.contentDocument.body.appendChild(script);
                        } else {
                            frame.contentDocument.documentElement.appendChild(script);
                        }
                    } else if (frame.document) {
                        if (frame.document.body) {
                            frame.document.body.appendChild(script);
                        } else {
                            frame.document.documentElement.appendChild(script);
                        }
                    }
                };
                var getQueryString = function (name) {
                    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
                    var r = search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
                };
                var Cookie = {
                    get: function (name) {
                        var arr,
                            reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
                        if ((arr = document.cookie.match(reg))) {
                            return unescape(arr[2]);
                        } else {
                            return null;
                        }
                    },
                    set: function (name, value, time, domain, path) {
                        var str = name + '=' + encodeURIComponent(value);
                        if (time) {
                            var date = new Date(time).toGMTString();
                            str += ';expires=' + date;
                        }
                        str = domain ? str + ';domain=' + domain : str;
                        str = path ? str + ';path=' + path : str;
                        document.cookie = str;
                    }
                };
                var urlFilter = {
                    config: {
                        url: '',
                        whiteHostList: [
                            'm.zhipin.com',
                            'www.zhipin.com',
                            'pre-www.zhipin.com'
                        ],
                        blackPathList: ['security-check.html', 'security-check1.html']
                    },
                    setStrategy: function () {
                        var url = urlFilter.config.url;
                        switch (true) {
                            case urlFilter.isBlackHost(url) || urlFilter.hasBlackPath(url):
                                urlFilter.config.url = '/';
                                break;
                        }
                        return urlFilter.config.url;
                    },
                    isAbsolutePathStartable: function (url) {
                        return url.indexOf('//') < 0 && url.indexOf('/') === 0;
                    },
                    isBlackHost: function (url) {
                        var isBlackHost = false;
                        var rule = /^(https?)?(:?\/\/+)([^\/?]*)(.*)?$/;
                        url.replace(rule, function (res, $1, $2, $3, $4) {
                            isBlackHost = !urlFilter.isHostInWhiteList($3);
                            console.error('hostname', $3, 'isBlackHost', isBlackHost);
                            return isBlackHost ? '/' : url;
                        });
                        return isBlackHost;
                    },
                    hasBlackPath: function (url) {
                        var isBlackPath = false;
                        var blackPathList = urlFilter.config.blackPathList;
                        for (var i = 0; i < blackPathList.length; i++) {
                            if (url.indexOf(blackPathList[i]) > -1) {
                                isBlackPath = true;
                                break;
                            }
                        }
                        return isBlackPath;
                    },
                    isHostInWhiteList: function (hostname) {
                        return urlFilter.config.whiteHostList.indexOf(hostname) > -1;
                    },
                    filter: function (url) {
                        urlFilter.config.url = url || '/';
                        return urlFilter.setStrategy();
                    }
                };
                var jumpReplace = function (url) {
                    var filterUrl = urlFilter.filter(url);
                    if (
                        filterUrl.indexOf('napi') > -1 &&
                        filterUrl.indexOf('zpssr') > -1
                    ) {
                        filterUrl = filterUrl.replace(
                            /\/napi\/zpssr(site|youle|tools)/,
                            ''
                        );
                    }
                    // console.log(filterUrl);
                    cb(filterUrl);
                };
                var jumpPage = function (srcReferer, callbackUrl) {
                    if (callbackUrl || srcReferer.indexOf('security-check.html') > -1) {
                        jumpReplace(callbackUrl);
                    } else {
                        jumpReplace(srcReferer);
                    }
                    var image = new Image();
                    image.src =
                        'https://t.zhipin.com/f.gif?pk=' +
                        securityPageName +
                        '&ca=securityCheckJump_' +
                        Math.round((new Date().getTime() - pageStartTime) / 1000) +
                        '&r=' +
                        document.referrer;
                };
                var seed = getQueryString('seed') || '';
                var ts = getQueryString('ts') || '';
                var fileName = getQueryString('name') || '';
                var callbackUrl = getQueryString('callbackUrl') || '';
                var srcReferer = getQueryString('srcReferer') || '';
                if (fileName === 'null' || !seed || !fileName || !callbackUrl) {
                    var image = new Image();
                    var paramsStr = '';
                    var lenSrcReferer = url.split('srcReferer').length - 1;
                    var reportData = {
                        appKey:
                        url.indexOf('weizhipin') > -1
                        ? 'ed8d1b9d40a89f30ba721'
                        : 'd071323e4304ae2931f11',
                        errorType: 'collectData',
                        errorCode: 'security_check_error',
                        json: JSON.stringify({
                            url: url,
                            fileName: fileName,
                            seed: seed,
                            ts: ts,
                            callbackUrl: callbackUrl,
                            srcReferer: srcReferer
                        })
                    };
                    for (var key in reportData) {
                        paramsStr += '&' + key + '=' + reportData[key];
                    }
                    paramsStr = paramsStr.substr(1);
                    image.src = 'https://t.kanzhun.com/z.json?' + paramsStr;
                }
                if (seed && ts && fileName) {
                    jumpPage(srcReferer, callbackUrl);
                }
            }
            var ie = !!(window.attachEvent && !window.opera);
            var wk = /webkit\/(\d+)/i.test(navigator.userAgent) && RegExp.$1 < 525;
            var fn = [];
            var run = function () {
                for (var i = 0; i < fn.length; i++) fn[i]();
            };
        })();
    }
})();