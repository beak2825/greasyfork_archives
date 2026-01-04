// ==UserScript==
// @name         京东自营过滤zz
// @version      0.4.0.6
// @icon         https://www.jd.com/favicon.ico
// @description  在京东商品列表和搜索结果页面增加【自营】【非自营】过滤选项，为【京东配送】【仅显示有货】以及【排序】选项增加记忆功能。京东的商品分类列表页和搜索结果列表页过滤器【京东配送】和【自营】是不一样的，【京东配送】会包含部分第三方商家的商品，只是由京东承担物流运输而已，这些第三方商品很多都没有“上午下单下午就到”的快捷，所以有必要专门针对【自营】和【非自营】过滤商品列表！但需要注意的是，有些【自营】商品也是由厂商配送的，这类商品可以通过同时选中【自营】和【京东配送】来过滤掉。
// @author       You!
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @include      *://list.jd.com/list.html?*
// @include      *://search.jd.com/search?*
// @include      *://search.jd.com/Search?*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @run-at       document-start
// @namespace    https://greasyfork.org/zh-CN/scripts/33729-京东自营过滤
// @downloadURL https://update.greasyfork.org/scripts/39174/%E4%BA%AC%E4%B8%9C%E8%87%AA%E8%90%A5%E8%BF%87%E6%BB%A4zz.user.js
// @updateURL https://update.greasyfork.org/scripts/39174/%E4%BA%AC%E4%B8%9C%E8%87%AA%E8%90%A5%E8%BF%87%E6%BB%A4zz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //防止页面重入
    if ($('a#goodsJd').length > 0) return;

    //扫描页面的间隔频率时间
    var timerFreq = 300;

    //排序设置
    var sortOptVals = [
        'sort_dredisprice_desc',
        'sort_dredisprice_asc',
        'sort_totalsales15_desc',
        'sort_commentcount_desc',
        'sort_winsdate_desc'
    ];

    //载入【京东配送】【仅显示有货】和排序的设置，返回重定向的路径
    function OnDocStart() {
        var jdDelivery = 'delivery'; //京东配送
        var jdStock = 'stock'; //有货
        var jdSort = 'sort'; //排序

        switch(currentPathname) {
            case '/search':
                jdDelivery = 'wtype';
                jdSort = 'psort';
        }

        var urlOpts = url2Obj();

        if (//京东配送
            readOpts('jd_delivery', urlOpts, jdDelivery) |
            //仅显示有货
            readOpts('jd_stock', urlOpts, jdStock) |
            //排序
            readSortOpt(urlOpts, jdSort)
        ) {
            var newSearch = '?';
            for (var opt in urlOpts) {
                if (newSearch.length > 1) newSearch += '&';
                newSearch += opt;
                newSearch += '=';
                newSearch += urlOpts[opt];
            }
            return newSearch.length > 1 ? newSearch : '';
        }

        function url2Obj() {
            var ret = {};
            var u = location.search.split(/[\?&]/);
            for(var i in u) {
                var opt = u[i];
                if (opt.length) {
                    opt = opt.split('=');
                    ret[opt[0]] = opt[1];
                }
            }
            return ret;
        }

        function readOpts(gm_name, opts, opt_name) {
            if (GM_getValue(gm_name)) {
                if (!opts.hasOwnProperty(opt_name) || opts[opt_name] !== '1') {
                    opts[opt_name] = '1';
                    return true;
                }
            }
            else {
                if (opts.hasOwnProperty(opt_name) && opts[opt_name] !== '0') {
                    delete opts[opt_name];
                    return true;
                }
            }
            return false;
        }

        function readSortOpt(opts, opt_name) {
            var sortOpt = GM_getValue('jd_sort');
            var defaultSortOptVal = '0';
            switch(currentPathname) {
                case '/search':
                    if (sortOpt !== undefined) ++sortOpt;
                    break;

                case '/list.html':
                    if (sortOpt === 2) {
                        sortOpt = undefined;
                        defaultSortOptVal = sortOptVals[2];
                    }
                    else {
                        sortOpt = sortOptVals[sortOpt];
                    }
                    break;
            }

            if (sortOpt !== undefined) {
                if (!opts.hasOwnProperty(opt_name) || urlOpts[opt_name] != sortOpt) {
                    urlOpts[opt_name] = sortOpt;
                    return true;
                }
            }
            else {
                if (opts.hasOwnProperty(opt_name) && opts[opt_name] !== defaultSortOptVal) {
                    delete opts[opt_name];
                    return true;
                }
            }
            return false;
        }
    }

    //载入页面后，为页面增加【自营】【非自营】过滤器，以及【京东配送】【仅显示有货】等的设置保存函数
    function OnDocReady() {
        //防止页面重入
        if ($('a#goodsJd').length > 0) return;

        //var goodsJdKey = 'jd_' + location.pathname.split(/[\/\.]/)[1].toLowerCase() + '_' + location.search.split(/[\?&]/)[1].replace(/[=,]/g, '_').toLowerCase() + '_goodsJd';
        //var goods3rdKey = 'jd_' + location.pathname.split(/[\/\.]/)[1].toLowerCase() + '_' + location.search.split(/[\?&]/)[1].replace(/[=,]/g, '_').toLowerCase() + '_goods3rd';
        //上面两行替换下面两行可以对每个商品分类列表和搜索关键词独立保存过滤器设置
        var goodsJdKey = 'jd_goodsJd';
        var goods3rdKey = 'jd_goods3rd';

        runMain();

        //页面入口点
        function runMain() {
            switch(currentPathname) {
                case '/search':
                    if ($('span.ns-icon').length == 1) return; //搜索没有结果
            }

            uiInit();
            loadAllGoods();
        }

        //向页面添加自营过滤选项
        function uiInit() {
            var uiPos = $('.f-feature ul');
            if (uiPos.length > 0) {
                var aTagDelivery;
                var aTagStock;

                switch(currentPathname) {
                    case '/search':
                        uiPos.find('li a[onclick]').each(function() {
                            var tagA = $(this);
                            var oldOnClick = this.onclick;
                            tagA.click(function() {
                                oldOnClick();
                                var waitAjaxLoadGoodsList = function() {
                                    if (unsafeWindow.SEARCH.loading) setTimeout(waitAjaxLoadGoodsList, timerFreq);
                                    else runMain();
                                };
                                setTimeout(waitAjaxLoadGoodsList, timerFreq);
                            });
                            tagA.removeAttr('onclick');
                        });

                        //排序按钮
                        var hookSearchSortHtml = function() {
                            if (unsafeWindow.SEARCH !== undefined && unsafeWindow.SEARCH.sort_html !== undefined) {
                                unsafeWindow.SEARCH.old_sort_html = unsafeWindow.SEARCH.sort_html;
                                unsafeWindow.SEARCH.sort_html = function(C) { //重载 SEARCH.sort_html 函数
                                    unsafeWindow.SEARCH.old_sort_html(C);
                                    //loadAllGoods 会导致 SEARCH.sort_html 被再次调用，因此不能在重载的函数中再次【直接】【自动】调用 loadAllGoods，
                                    //否则会构成嵌套循环，所以必须将 loadAllGoods 的调用放在排序按钮的 onclick 事件响应里面，并删除原始的 onclick 属性内联调用
                                    $('#J_filter div.f-sort a[onclick]').each(function() {
                                        var tagA = $(this);
                                        var oldOnClick = this.onclick;
                                        tagA.click(function() {
                                            oldOnClick();
                                            var waitAjaxLoadGoodsList = function() {
                                                if (unsafeWindow.SEARCH.loading) setTimeout(waitAjaxLoadGoodsList, timerFreq);
                                                else loadAllGoods();
                                            };
                                            setTimeout(waitAjaxLoadGoodsList, timerFreq);
                                        });
                                        tagA.removeAttr('onclick');
                                    });
                                };
                            }
                            else setTimeout(hookSearchSortHtml, timerFreq);
                        };
                        hookSearchSortHtml();

                        //翻页按钮
                        var hookPager = function() {
                            if (unsafeWindow.SEARCH !== undefined && unsafeWindow.SEARCH.page !== undefined) {
                                unsafeWindow.SEARCH.oldFunc_page = unsafeWindow.SEARCH.page;
                                unsafeWindow.SEARCH.page = function(F, C) { //重载 SEARCH.page 函数
                                    unsafeWindow.SEARCH.oldFunc_page(F, C);
                                    //loadAllGoods 不会与 SEARCH.page 发生嵌套循环调用，所以可以在重载函数内直接调用 loadAllGoods
                                    var waitAjaxLoadGoodsList = function() {
                                        if (unsafeWindow.SEARCH.loading) setTimeout(waitAjaxLoadGoodsList, timerFreq);
                                        else loadAllGoods();
                                    };
                                    setTimeout(waitAjaxLoadGoodsList, timerFreq);
                              };
                            }
                            else setTimeout(hookPager, timerFreq);
                        };
                        hookPager();

                        //【京东配送】按钮
                        aTagDelivery = uiPos.find('li a[data-field="wtype"]').first();
                        //【仅显示有货】按钮
                        aTagStock = uiPos.find('li a[data-field="stock"]').first();

                        //【综合】【销量】【评论】【新品】【价格】排序按钮
                        var hookSearchSort = function() {
                            if (unsafeWindow.SEARCH !== undefined && unsafeWindow.SEARCH.sort !== undefined) {
                                unsafeWindow.SEARCH.old_sort = unsafeWindow.SEARCH.sort;
                                unsafeWindow.SEARCH.sort = function(A) { //重载 SEARCH.sort 函数
                                    if (!A) GM_deleteValue('jd_sort'); else GM_setValue('jd_sort', A-1);
                                    unsafeWindow.SEARCH.old_sort(A);
                                };
                            }
                            else setTimeout(hookSearchSort, timerFreq);
                        };
                        hookSearchSort();
                        break;

                    case '/list.html':
                        //【京东配送】按钮
                        aTagDelivery = uiPos.find('li#delivery a').first();
                        //【仅显示有货】按钮
                        aTagStock = uiPos.find('li#stock a').first();

                        //【销量】【价格】【评论】【上架】排序按钮
                        $('div#J_filter div.f-sort a:not([id])').click(function() {
                            var aTagSort = $(this);
                            setTimeout(function() {
                                var sortOpt = aTagSort.attr('href').match(/[&\?]sort=([^&]*)/i);
                                if (sortOpt && 2 === sortOpt.length) {
                                    sortOpt = unescape(sortOpt[1]);
                                    for (var i=0; i<sortOptVals.length; ++i) {
                                        if (sortOpt === sortOptVals[i]) {
                                            GM_setValue('jd_sort', i);
                                            break;
                                        }
                                    }
                                }
                            }, 0);
                        });
                        break;
                }
                //【京东配送】按钮
                aTagDelivery.click(function() {
                    setTimeout(function() {
                        if (aTagDelivery.hasClass('selected')) GM_deleteValue('jd_delivery'); else GM_setValue('jd_delivery', true);
                    }, 0);
                });
                //【仅显示有货】按钮
                aTagStock.click(function() {
                    setTimeout(function() {
                        if (aTagStock.hasClass('selected')) GM_deleteValue('jd_stock'); else GM_setValue('jd_stock', true);
                    }, 0);
                });

                var goodsJdChecked = GM_getValue(goodsJdKey) === undefined ? 'class="selected"' : '';
                var goods3rdChecked = GM_getValue(goods3rdKey) === undefined ? 'class="selected"' : '';
                GM_addStyle('.goodsCount{font-size:10px;color:#fff;background-color:#e23a3a;border-radius:3px;padding:0px 3px;margin:0 5px 0 2px}');
                uiPos.first().prepend($(
                    '<li><a '+goodsJdChecked+' href="javascript:;" id="goodsJd"><i/>自营<span class="goodsCount" id="goodsJdCount">0</span></a></li>'+
                    '<li><a '+goods3rdChecked+' href="javascript:;" id="goods3rd"><i/>非自营<span class="goodsCount" id="goods3rdCount">0</span></a></li>'
                ));

                $('#goodsJd').first().click(function() {
                    setTimeout(function() {
                        var checked = $('#goodsJd').toggleClass('selected').attr('class').length > 0;
                        toggleGoodsJd(checked);
                        //保存设置
                        if (checked) GM_deleteValue(goodsJdKey); else GM_setValue(goodsJdKey, checked);
                    }, 0);
                });
                $('#goods3rd').first().click(function() {
                    setTimeout(function() {
                        var checked = $('#goods3rd').toggleClass('selected').attr('class').length > 0;
                        toggleGoods3rd(checked);
                        //保存设置
                        if (checked) GM_deleteValue(goods3rdKey); else GM_setValue(goods3rdKey, checked);
                    }, 0);
                });
            } else setTimeout(uiInit, timerFreq);
        }

        //切换过滤自营/非自营商品
        function toggleGoodsJd(checked) {
            $('li.gl-item:has(i[data-tips="京东自营，品质保障"])').css('display', checked ? '' : 'none');
        }
        function toggleGoods3rd(checked) {
            $('li.gl-item:not(:has(i[data-tips="京东自营，品质保障"]))').css('display', checked ? '' : 'none');
        }

        //加载所有商品
        function loadAllGoods() {
            switch(currentPathname) {
                case '/list.html':
                    processGoodsList();
                    break;

                case '/search':
                    if (unsafeWindow.SEARCH !== undefined && unsafeWindow.SEARCH.scroll !== undefined) {
                        unsafeWindow.SEARCH.scroll();
                        setTimeout(waitAllGoods, timerFreq);
                    }
                    else setTimeout(loadAllGoods, timerFreq);
                    break;
            }
        }
        //等待所有商品加载完成
        function waitAllGoods() {
            if (unsafeWindow.SEARCH.loading) setTimeout(waitAllGoods, timerFreq);
            else processGoodsList();
        }
        //收尾处理
        function processGoodsList() {
            //计算商品数量
            setCount();
            //加载过滤器设置
            loadSettings();
            //取消图片延迟加载
            forceLoadLazyImgs();
        }
        //计算商品数量
        function setCount() {
            $('#goodsJdCount').text($('li.gl-item:has(i[data-tips="京东自营，品质保障"])').length);
            $('#goods3rdCount').text($('li.gl-item:not(:has(i[data-tips="京东自营，品质保障"]))').length);
        }
        //加载过滤器设置
        function loadSettings() {
            if (GM_getValue(goodsJdKey) !== undefined) toggleGoodsJd(false);
            if (GM_getValue(goods3rdKey) !== undefined) toggleGoods3rd(false);
        }
        //取消图片延迟加载
        function forceLoadLazyImgs() {
            var lazyImgs = $('ul.gl-warp img[data-lazy-img][data-lazy-img!="done"]');
            if (lazyImgs.length > 0) lazyImgs.each(function(idx){
                var img = $(this);
                this.src = img.attr('data-lazy-img');
                img.removeAttr('data-lazy-img');
            });
        }
    }
    var oldFnOnDocReady;
    function OnDocReadyTimer() {
        //恢复原来的 document.ready
        //document.ready = oldFnOnDocReady;
        //只需要执行一次
        setTimeout(OnDocReady, 0);
    }

    var currentPathname = location.pathname.toLowerCase();

    var newSearch = OnDocStart();
    if (newSearch !== undefined) location.search = newSearch;
    else {
        oldFnOnDocReady = document.ready;
        document.ready = OnDocReadyTimer;
    }
})();