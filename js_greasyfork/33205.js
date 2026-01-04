// ==UserScript==
// @name        京东自营商品展示
// @namespace   https://github.com/gam2046/userscript
// @description 过滤京东商品页，仅显示自营商品，在列表筛选中会新增一项可以勾选是否仅显示自营商品
// @author      forDream
// @include     *://list.jd.com/list.html?*
// @include     *://search.jd.com/Search?*
// @run-at      document-idle
// @supportURL  https://github.com/gam2046/userscript/issues/new
// @version     0.4.1
// @downloadURL https://update.greasyfork.org/scripts/33205/%E4%BA%AC%E4%B8%9C%E8%87%AA%E8%90%A5%E5%95%86%E5%93%81%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/33205/%E4%BA%AC%E4%B8%9C%E8%87%AA%E8%90%A5%E5%95%86%E5%93%81%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var extension = {
        extensionSwitch: false,
        selfGoodsCount: 0,
        originalPager: undefined,
        bottomPageText: undefined,
        selfPattern: '//item\.jd\.com/\\d{6,7}.html',
        isCategoryPage: function () { return window.location.host == 'list.jd.com'; },
        pagerText: function () {
            if (extension.isCategoryPage())
                return '当前已加载' + SEARCH.adv_param.page + '页';
            else
                return "当前已加载" + SEARCH.current_page + "页    共计" + SEARCH.adv_param.page_count + "页";
        },
        const: {
            aTagName: "fd_shown_jd_self_support_link",
            liTagName: "fd_shown_jd_self_support"
        },
        enableExtension: function () { extension.extensionSwitch = true; },
        disableExtension: function () { extension.extensionSwitch = false; },
        initialization: function () {
            window.setInterval(extension.funcAddSwitchbox, 2000);
            window.setInterval(extension.funcFilterResult, 2000);
        },
        scrollPosition: function () {
            return document.documentElement.scrollTop / document.documentElement.scrollHeight;
        },
        funcFilterResult: function () {
            console.log("beginning to find jd self support goods.");
            var items = document.getElementsByClassName("gl-item");
            var count = 0;
            for (var n = 0; n < items.length; n++) {
                var item = items[n];
                if (extension.extensionSwitch) { // 选中对话框
                    if (item.innerHTML.match(extension.selfPattern) == null) {
                        item.hidden = true;
                        count++;
                        console.log("Hidden index of " + n);
                    }
                } else {
                    item.hidden = false;
                }
            }

            extension.selfGoodsCount = items.length - count;

            console.log("Total items " + items.length + " blocked " + count);
        },
        funcFindSwitchbox: function () {
            var ul = document.getElementById("J_feature");
            if (!ul) ul = document.getElementsByClassName("f-feature")[0];
            return ul.children[0];
        },
        funcAddSwitchbox: function () {
            if (document.getElementById(extension.const.liTagName) != null) {
                document.getElementById(extension.const.aTagName).className = extension.extensionSwitch ? "selected" : "";
                return;
            }

            var ul = extension.funcFindSwitchbox();
            var li = document.createElement("li");
            var a = document.createElement("a");

            a.id = extension.const.aTagName;
            a.href = "javascript:;";
            a.className = extension.extensionSwitch ? "selected" : "";
            a.innerHTML = "<i></i>仅显示京东自营商品";
            a.onclick = extension.funcSwitchboxClick;

            li.id = extension.const.liTagName;
            li.appendChild(a);
            ul.appendChild(li);
        },
        funcSwitchboxClick: function () {
            extension.extensionSwitch = !extension.extensionSwitch;
            extension.funcAddSwitchbox();
            extension.funcModifyPagerJumper();
        },
        funcRequestGoods: function () {
            // 根据页面分类加载下一页
            if (extension.isCategoryPage()) {
                extension.funcCategoryRequestGoods();
            } else {
                var totalPage = SEARCH.adv_param.page_count;
                var currentPage = SEARCH.current_page;

                if (currentPage < totalPage) {
                    SEARCH.scroll();
                } else {
                    alert("已经到达最后一页，无法继续翻页");
                }
            }
            // 更新页脚
            extension.bottomPageText.innerText = extension.pagerText();
        },
        funcModifyPagerJumper: function () {
            var pageWrap = document.getElementById("J_bottomPage");
            var modifyTagId = "fd_bottomPage";

            if (extension.extensionSwitch) {
                // if (!SEARCH || !SEARCH.scroll) return; // 部分页面没有该对象则不修改页脚
                // modify
                pageWrap.hidden = true;

                var modifyBottom = document.createElement("div");
                modifyBottom.id = modifyTagId;
                modifyBottom.className = "p-wrap";
                document.getElementsByClassName("page clearfix")[0].appendChild(modifyBottom);

                var pagerNum = document.createElement("span");
                pagerNum.className = "p-num";
                modifyBottom.appendChild(pagerNum);

                var span = document.createElement("span");
                span.innerText = extension.pagerText();
                span.className = "p-skip";
                extension.bottomPageText = span;

                var nextButton = document.createElement("a");
                nextButton.innerHTML = "<em>加载下一页</em><i>&gt;</i>";
                nextButton.className = "pn-next";
                nextButton.href = "javascript:;";
                nextButton.onclick = extension.funcRequestGoods;

                pagerNum.appendChild(span);
                pagerNum.appendChild(nextButton);
            } else {
                // restore
                pageWrap.hidden = false;

                var modifyBottom = document.getElementById(modifyTagId);
                if (modifyBottom) modifyBottom.remove();
            }
        },
        funcCategoryRequestGoods: function () {
            var page = parseInt(SEARCH.adv_param.page) + 1;
            var requestBaseUrl = 'https://list.jd.com/list.html?cat=';
            var requestArgs = [];
            requestArgs.push(SEARCH.adv_param.cid1);
            requestArgs.push(SEARCH.adv_param.cid2);
            requestArgs.push(SEARCH.adv_param.cid3);

            var url = requestBaseUrl + requestArgs.join() + '&page=' + page;

            console.log('Try to connect next page', url);

            $.get(url, function (data, status) {
                if (status != 'success') {
                    alert('加载下一页内容失败');
                    return;
                }

                var div = document.createElement("div");
                div.innerHTML = data;
                var dom = div.childNodes;

                var items = div.getElementsByClassName('gl-item');
                console.log('items is ', items);

                var ul = document.getElementsByClassName('gl-warp clearfix')[0];

                for (var n = 0; n < items.length; n++) {
                    var item = items[n];
                    if (item.innerHTML.match(extension.selfPattern) != null) {
                        console.log('Find a self goods');
                        var imgs = item.getElementsByTagName("img");
                        for (var k = 0; k < imgs.length; k++) {
                            var img=imgs[k];
                            if (img && img.dataset.lazyImg)
                                img.src = dataset.lazyImg;
                        }
                        ul.appendChild(item);
                    }
                }
            });
            // 翻页
            SEARCH.adv_param.page = page;
            console.log('Turn to page', page);
        }
    };

    extension.initialization();
})();
