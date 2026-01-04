// ==UserScript==
// @name         什么值得买SMZDM - 自动签到、翻页
// @version      1.7
// @author       Siukei
// @description  值得买自动签到、自动无缝翻页
// @match        *://*.smzdm.com/*
// @icon         https://www.smzdm.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace    https://www.smzdm.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/415026/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0SMZDM%20-%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E3%80%81%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/415026/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0SMZDM%20-%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%E3%80%81%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    // 默认 ID 为 0
    var curSite = {
        SiteTypeID: 1,
        quoteList: [],
        pager: {
            nextLink: '//*[@id="commentTabBlockHot"]/ul[2]/li[@class="pagedown"]/a[@href]',  // 获取下一页的 xpath
            pageElement: 'css;#commentTabBlockHot > ul.comment-main-list > li.comment-main-list-item',  //获取每条评论标签
            commentMain: ['css;ul.comment-main-list'],  //评论区
            pagination: 'css;div > ul.pagination',  // 待替换的页码标签
        }
        , pageUrl: '' // 下一页url
        , current_item: '' //当前查看为精彩，还是最新
    };
    pageLoading();

    // 自动翻页
    function pageLoading() {
        if (window.location.href.indexOf('smzdm.com/p/') == -1) {
            return;
        }
        curSite.current_item = document.querySelector('li.current_item').outerHTML.indexOf('精彩') > -1 ? '#commentTabBlockHot' : '#commentTabBlockNew';
        if (curSite.SiteTypeID > 0) {
            commentShowAll();
            // 删除无效信息、将评论id加入去重队列
            let comments = document.querySelectorAll(curSite.current_item + ' > ul.comment-main-list > li');
            for (var i = 0; i < comments.length; i++) {
                let comment = comments[i];
                if (isInvalidComment(comment)) {
                    comment.remove();
                }
                isRepeatComment(comment)
            }
            //绑定滑动事件，实现自动加载下一页
            windowScroll(function (direction, e) {
                if (direction === "down") { // 下滑才准备翻页
                    let page = document.querySelector('div > ul.pagination');
                    if (isInViewPortOfOne(page)) {
                        ShowPager.loadMorePage();
                    }
                }
            });
        }
    }

    //判断元素是否出现在窗口内
    function isInViewPortOfOne(el) {
        // console.log(el);
        // viewHeight 获取显示内容窗口的尺寸 兼容所有浏览器写法
        let viewHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        //获取翻页区域在整个页面的位置
        let offsetTop = realOffsetTop(el)
        //获取当前最顶层显示内容在整个页面的位置
        let scrollTop = document.documentElement.scrollTop
        //通过当前翻页所在高度-顶层内容高度，得出还有多少高度可到达翻页区域
        let pageTop = offsetTop - scrollTop
        //如果pageTop<=窗口尺寸，表示已经出现在窗口可视区域
        // console.log(`====offsetTop:${offsetTop}, scrollTop:${scrollTop}, clientHeight:${viewHeight}`);
        // 这里有个+100是为了提前触发自动翻页，避免看到页码才翻页导致的加载延迟问题
        return pageTop <= viewHeight - 500
    }

    function realOffsetTop(ele) {
        let par = ele.offsetParent;
        let top = 0
        if (par.nodeName.toLowerCase() == "body") { // 当节点为body可直接使用offsetTop获取距离
            top += eleId.offsetTop; // 获取高度
        } else {
            while (par) {  // 循环获取当前对象与body的高度
                top += par.offsetTop;
                par = par.offsetParent;
            }
        }
        return top;
    }


    // 滚动条事件
    function windowScroll(fn1) {
        var beforeScrollTop = document.documentElement.scrollTop,
            fn = fn1 || function () { };
        setTimeout(function () { // 延时执行，避免刚载入到页面就触发翻页事件
            window.addEventListener("scroll", function (e) {
                var afterScrollTop = document.documentElement.scrollTop,
                    delta = afterScrollTop - beforeScrollTop;
                if (delta == 0) return false;
                fn(delta > 0 ? "down" : "up", e);
                beforeScrollTop = afterScrollTop;
            }, false);
        }, 500)
    }

    //搜索页左右方向键翻页
    function keyPage() {
        $(document).on('keydown', function (e) {
            // console.log(e.key);
            //兼容搜索页、精选页方向键翻页
            if (e.key == 'ArrowRight') {
                let next = document.querySelectorAll('ul.pagination > li.pagedown > a')[0];
                if (next) {
                    next.click();
                }
            } else if (e.key == 'ArrowLeft') {
                let pre = document.querySelectorAll('ul.pagination > li.pageup > a')[0];
                pre.click();
            }
        })
    }
    keyPage()

    //自动展开隐藏评论
    function commentShowAll() {
        let seaAll = document.querySelectorAll('div.J_open_more');
        // console.log(seaAll);
        // for (var i = 0; i < seaAll.length; i++) {
        //     seaAll[i].click();
        // }        
        seaAll.forEach(function (sea) {
            sea.click();
        })
    }

    /**
     * 判断是否为无效评论，true=是
     * @param {评论标签} comment 
     */
    function isInvalidComment(comment) {
        return false;
        let span = comment.querySelector('div.comment_conWrap > div.comment_con > p > span');
        let cont = span.textContent;
        return cont.indexOf('此用户') > -1 || cont.indexOf('我参与了') > -1;
    }

    var ShowPager = { // 修改自 https://greasyfork.org/scripts/14178
        getFullHref: function (e) {
            if (e == null) return '';
            "string" != typeof e && (e = e.getAttribute("href"));
            var t = this.getFullHref.a;
            return t || (this.getFullHref.a = t = document.createElement("a")), t.href = e, t.href;
        },
        createDocumentByString: function (e) {
            if (e) {
                if ("HTML" !== document.documentElement.nodeName) return (new DOMParser).parseFromString(e, "application/xhtml+xml");
                var t;
                try {
                    t = (new DOMParser).parseFromString(e, "text/html");
                } catch (e) {
                }
                if (t) return t;
                if (document.implementation.createHTMLDocument) t = document.implementation.createHTMLDocument("ADocument"); else try {
                    (t = document.cloneNode(!1)).appendChild(t.importNode(document.documentElement, !1)),
                        t.documentElement.appendChild(t.createElement("head")), t.documentElement.appendChild(t.createElement("body"));
                } catch (e) {
                }
                if (t) {
                    var r = document.createRange();
                    r.selectNodeContents(document.body);
                    var n = r.createContextualFragment(e);
                    t.body.appendChild(n);
                    for (var a, o = {
                        TITLE: !0,
                        META: !0,
                        LINK: !0,
                        STYLE: !0,
                        BASE: !0
                    }, i = t.body, s = i.childNodes, c = s.length - 1; c >= 0; c--) o[(a = s[c]).nodeName] && i.removeChild(a);
                    return t;
                }
            } else console.error("没有找到要转成DOM的字符串");
        },
        loadMorePage: function () {
            if (curSite.pager) {
                console.log(curSite.current_item);
                let curPageEle = getElementByXpath(curSite.pager.nextLink);
                var url = this.getFullHref(curPageEle);
                // console.log(`${url}, ${curPageEle}, ${curSite.pageUrl}`);
                if (url === '') return;
                if (curSite.pageUrl === url) return;// 不会重复加载相同的页面                
                curSite.pageUrl = url;
                console.log(`after ${url}, ${curPageEle}, ${curSite.pageUrl}`);
                // 读取下一页的数据
                // curSite.pager.startFilter && curSite.pager.startFilter();                
                GM_xmlhttpRequest({
                    url: url,
                    method: "GET",
                    timeout: 5000,
                    onload: function (response) {
                        try {
                            var newBody = ShowPager.createDocumentByString(response.responseText);
                            // let pageElems = getAllElements(curSite.pager.pageElement, newBody, newBody);
                            let pageElems = $(response.responseText).find(curSite.current_item + ' > ul.comment-main-list > li.comment-main-list-item');
                            let toElement = $(curSite.current_item + ' > ul.comment-main-list')[0];
                            console.log(pageElems.length);
                            console.log(toElement);
                            if (pageElems.length >= 0) {
                                // 插入新页面元素
                                $.each(pageElems, function (index, one) {
                                    if (isInvalidComment(one) || isRepeatComment(one)) {
                                        return;
                                    }
                                    toElement.insertAdjacentElement("beforeend", one);
                                })
                                // 替换页码标签
                                try {
                                    let oriE = getAllElements(curSite.pager.pagination);
                                    let repE = getAllElements(curSite.pager.pagination, newBody, newBody);
                                    // console.log(repE[0].outerHTML);
                                    if (oriE.length === repE.length) {
                                        for (var i = 0; i < oriE.length; i++) {
                                            oriE[i].outerHTML = repE[i].outerHTML;
                                        }
                                    }
                                } catch (e) {
                                    console.log(e);
                                }
                                // commentShowAll();
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    }
                });
            }
        },
    };

    //先后获取评论id、引用id，如果数组中存在评论id，表示它在之前被引用回复，已经展示过，无需再次展示
    function isRepeatComment(ele) {
        let commentReg = /data-comment-id="(\d+)"/;
        let commentId = ele.outerHTML.match(commentReg)
        commentId = commentId && commentId[1];
        // console.log(`评论id：${commentId}`);
        if (curSite.quoteList.indexOf(commentId) > -1) {
            console.log(`已存在评论${commentId}`);
            return true
        }
        curSite.quoteList.push(commentId);
        let quoteReg = /blockquote_cid="(\d+)"/g;
        let quoteId = null;
        do {
            quoteId = quoteReg.exec(ele);
            if (quoteId) {
                if (curSite.quoteList.indexOf(quoteId[1]) == -1) {
                    curSite.quoteList.push(quoteId[1]);
                } else {
                    console.log(`已存在引用${quoteId[1]}`);
                }
            }
        } while (quoteId)
        console.log(curSite.quoteList);
        return false;
    }


    function getElementByXpath(e, t, r) {
        r = r || document, t = t || r;
        try {
            return r.evaluate(e, t, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        } catch (t) {
            return void console.error("无效的xpath");
        }
    }


    function getAllElements(e, t, r, n, o) {
        let getAllElementsByXpath = function (e, t, r) {
            return r = r || document, t = t || r, r.evaluate(e, t, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        }

        var i, s = [];
        if (!e) return s;
        if (r = r || document, n = n || window, o = o || void 0, t = t || r, "string" == typeof e) i = 0 === e.search(/^css;/i) ? function getAllElementsByCSS(e, t) {
            return (t || document).querySelectorAll(e);
        }(e.slice(4), t) : getAllElementsByXpath(e, t, r); else {
            if (!(i = e(r, n, o))) return s;
            if (i.nodeType) return s[0] = i, s;
        }
        return function makeArray(e) {
            var t, r, n, o = [];
            if (e.pop) {
                for (t = 0, r = e.length; t < r; t++) (n = e[t]) && (n.nodeType ? o.push(n) : o = o.concat(makeArray(n)));
                return a()(o);
            }
            if (e.item) {
                for (t = e.length; t;) o[--t] = e[t];
                return o;
            }
            if (e.iterateNext) {
                for (t = e.snapshotLength; t;) o[--t] = e.snapshotItem(t);
                return o;
            }
        }(i);
    }


    autoSign();

    //自动签到
    function autoSign() {
        let checkinStr = 'smzdm_checkin';
        let today = new Date().getDate();
        // 首页，主动点击按钮
        if (/www\.smzdm\.com(\/|)$/.test(window.location.href)) {
            var btn = document.getElementsByClassName('J_punch')[0];
            if (/签到(得|领|拿)/.test(btn.text)) {
                console.log(btn.text);
                setTimeout(function () {
                    btn.click();
                    GM_setValue(checkinStr, today);
                    closeSignModel();
                }, 600)
            }
        } else {
            let checkin = GM_getValue(checkinStr);
            if (checkin == today) {
                return;
            }
            // 非首页，内嵌脚本签到
            var url = 'https://zhiyou.smzdm.com/user/checkin/jsonp_checkin'
            var embed_script = document.createElement('script');
            embed_script.setAttribute('src', url);
            // 把script标签加入head，此时调用开始
            document.getElementsByTagName('head')[0].appendChild(embed_script);
            GM_setValue(checkinStr, today);
        }

        //关闭签到成功后的扫码窗口
        function closeSignModel() {
            var signModel = document.querySelector('#sign-model');
            if (signModel) {
                var closeBtn = signModel.querySelector('> div > img.close-btn');
                if (closeBtn) {
                    closeBtn.click();
                }
            }
        }
    }
})();