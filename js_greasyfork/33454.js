// ==UserScript==
// @name         京东秒杀价格过滤
// @version      0.4.1.4
// @icon         https://www.jd.com/favicon.ico
// @description  按价格过滤并排序（价格升序）秒杀商品列表
// @author       You!
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @include      *://miaosha.jd.com/
// @include      *://miaosha.jd.com/pinpai.html?brand_id=*
// @include      *://miaosha.jd.com/brand.html?brand_id=*
// @include      *://miaosha.jd.com/category.html?cate_id=*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @run-at       document-end
// @namespace    https://greasyfork.org/zh-CN/scripts/33454-京东秒杀价格过滤
// @downloadURL https://update.greasyfork.org/scripts/33454/%E4%BA%AC%E4%B8%9C%E7%A7%92%E6%9D%80%E4%BB%B7%E6%A0%BC%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/33454/%E4%BA%AC%E4%B8%9C%E7%A7%92%E6%9D%80%E4%BB%B7%E6%A0%BC%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**********************************************************/
    //如果要过滤商品名，启用该函数，但是需要自己实现过滤逻辑：
    //    pname 传入商品名
    //    catId 传入商品分类编号，编号代表的意义请自行对照京东秒杀的页面地址
    //    命中返回 true, 否侧返回 false
    /*在行首插入单行注释（//）以启用该商品名过滤函数
    function filterPName(pname, cat, catId) {
        switch(cat) {
            case 'mainpage': //首页
                break;

            case 'pinpai': //品牌秒杀
                break;

            case 'brand': //品类秒杀
                break;

            case 'category': //分类秒杀
                switch(parseInt(catId)) {
                    case 34: //潮流鞋靴
                        if (!/男/.test(pname)) return false;
                    break;
                }
                break;
        }
        return true;
    }
    /**********************************************************/

    //扫描页面的间隔频率时间
    var timerFreq = 500;

    var currentPathname = location.pathname.toLowerCase();
    var currentPageKey = (
        currentPathname !== '/' ?
        'jd_miaosha_' + location.pathname.split(/[\/\.]/)[1].toLowerCase() + '_' + location.search.split('&')[0].split('=')[1] :
        'jd_miaosha_mainpage_0'
    );
    var priceInfo = loadPagePrice(currentPageKey);

    uiInit();
    doFilter();

    //向页面右下角的浮动工具栏尾部追加价格过滤部件
    function uiInit() {
        switch(currentPathname) {
            case '/':
                var timeline = $('#timeline a.timeline_item_link');
                if (timeline.length > 0) {
                    var waitTimelineLoad = function() {
                        if ($('div.skwrap ul.seckill_mod_goodslist').attr('priceFiltered') === undefined) {
                            doFilter();
                        }
                        else setTimeout(waitTimelineLoad, timerFreq);
                    };
                    timeline.click(function() {
                        setTimeout(function() {
                            $('div.skwrap ul.seckill_mod_goodslist').attr('priceFiltered', true);
                            saveCurrentPagePrice();
                            waitTimelineLoad();
                        }, 0);
                    });
                }
                else {
                    setTimeout(uiInit, timerFreq);
                    return;
                }
                break;
        }
        var uiPos = $('#sk_mod_er ul');
        if (uiPos.length > 0) {
            var checked = priceInfo.usePageSetting ? ' checked="true"' : '';
            GM_addStyle('.fltReload{font-size:10px;font-weight:700;color:#e23a3a;background-color:#fff;border-radius:5px;padding:0px 5px}'+
                        '.fltCount{display:inline-block;text-align:right;width:35px}'
                       );
            uiPos.append($(
                '<li class="sk_mod_er_mobile" style="color:white;padding:7px;float:left;text-align:left">'+
                '<nobr>正则过滤<div class="fltCount"><a class="fltReload" href="javascript:;" id="fltRetPName" title0="符合商品名过滤条件的商品数量：">刷新</a></div></nobr><br>'+
                '<input id="fltNameRegx" type="text" style="width:80px;margin-top:3px" value="'+priceInfo.regstr+'"/><br/>'+
                '<nobr>价格范围<div class="fltCount"><a class="fltReload" href="javascript:;" id="fltRetPrice" title0="同时符合价格范围过滤条件的商品数量：">刷新</a></div></nobr><br>'+
                '<input id="fltPriceMin" type="number" style="width:80px;margin-top:3px" value="'+priceInfo.min+'"/><br/>'+
                '<input id="fltPriceMax" type="number" style="width:80px;margin-top:5px" value="'+priceInfo.max+'"/><br/>'+
                '<nobr><input id="fltPriceOne" type="checkbox" style="margin:6px -3px 0px 0px"'+checked+'"/><label for="fltPriceOne" style="float:right;margin-top:2px">使用独立设置</label></nobr><br/>'+
                '</li>'
            ));
            $('a.fltReload,#fltNameRegx,#fltPriceMin,#fltPriceMax').change(function() {
                setTimeout(function() {
                    saveCurrentPagePrice();
                    doFilter();
                }, 0);
            });
            $('#fltPriceOne').click(function() {
                var oldChecked = !this.checked;
                setTimeout(function() {
                    saveCurrentPagePrice(oldChecked);
                    $('#fltPriceMin').attr('value', priceInfo.min);
                    $('#fltPriceMax').attr('value', priceInfo.max);
                    doFilter();
                }, 0);
            });
        } else setTimeout(uiInit, timerFreq);
    }

    //对页面执行过滤排序操作
    function doFilter() {
        var counts, counts2;
        switch(currentPathname) {
            case '/': //秒杀首页
                var g0 = $('div.skwrap');
                var mg = $('div.moregoods');
                //先加载“更多好货”
                if (mg.hasClass('o2loading')) {
                    mg.removeAttr('style');
                }
                else if (mg.hasClass('o2data-lazyload')) {
                    var loadMoreGoods = function() {
                        if (unsafeWindow.o2widgetLazyload !== undefined && unsafeWindow.o2widgetLazyload.detectRender !== undefined) {
                            mg.attr('style', 'position:fixed;top:0;display:hidden');
                            unsafeWindow.o2widgetLazyload.detectRender();
                        }
                        else setTimeout(loadMoreGoods, timerFreq);
                    };
                    loadMoreGoods();
                }
                else {
                    mg.css('min-height', '0');
                    //价格过滤
                    counts = filterGoods(g0); //正在抢购
                    //秒杀首页“即将开始”时段
                    if (mg.css('display') !== 'none') {
                        mg.removeAttr('style');
                        counts2 = filterGoods(mg); //更多好货
                    }

                    //处理“正在抢购”列表中的其他类型方块
                    var ul = g0.find('ul.seckill_mod_goodslist');
                    var all = groupObjs(ul.find('>li'), function(k, o) {
                        o = $(o);
                        if (o.hasClass('seckill_mod_goods')) return 0;
                        if (o.hasClass('spsk_brand_list_item')) return 1;
                        if (o.hasClass('brand_fullcut_item')) return 2;
                        return 3;
                    });
                    for(var i=0; i<4; ++i) {
                        ul.append($(all[i]).remove());
                    }
                    //强制加载方块内的图片
                    forceLoadLazyImgs(g0);
                }
                break;

            case '/pinpai.html': //品牌秒杀
            case '/brand.html': //品类秒杀
                counts = filterGoods($('div.bprd'));
                break;

            case '/category.html': //分类秒杀
                counts = filterGoods($('div.catinfo_seckillnow')); //当天正在秒杀的商品
                counts2 = filterGoods($('div.catinfo_startsoon')); //明日秒杀的商品
                break;
        }
        if (counts && counts[0] > 0) {
            var fltRetPName = counts[1];
            var fltRetPrice = counts[2];
            if (counts2) {
                fltRetPName += counts2[1];
                fltRetPrice += counts2[2];
            }
            var tagA = $('#fltRetPName');
            tagA.text(fltRetPName);
            tagA.attr('title', tagA.attr('title0') + counts[1] + (counts2 ? ' + ' + counts2[1] : ''));

            tagA = $('#fltRetPrice');
            tagA.text(fltRetPrice);
            tagA.attr('title', tagA.attr('title0') + counts[2] + (counts2 ? ' + ' + counts2[2] : ''));
        }
        else setTimeout(doFilter, timerFreq);
    }

    //对页面内的一个具体分类执行过滤排序操作
    function filterGoods(goodsList) {
        var goods = goodsList.find('li.seckill_mod_goods');
        var fltRetPName = 0;
        var fltRetPrice = 0;
        if (goods.length > 0) {
            fltRetPName = goods.length;

            var groups = groupObjs(goods, function(k, o) {
                o = $(o);
                //记录原始索引位置
                if (o.attr('idx') === undefined) o.attr('idx', k);
                //按商品名过滤
                if ((typeof(filterPName) === 'function' && !filterPName(getProductName(o), priceInfo.pageCat, priceInfo.pageCatId)) ||
                    (priceInfo.regexp && !priceInfo.regexp.test(getProductName(o)))) {
                    --fltRetPName;
                    return false;
                }
                //按价格过滤
                var price = getPrice(o);
                if (price.now < priceInfo.min || (0 < priceInfo.max && priceInfo.min <= priceInfo.max && priceInfo.max < price.now)) return false;
                //标注优惠力度
                var priceOff = price.pre - price.now;
                var discount = price.now / price.pre;
                var goodsInfo = o.find('.seckill_mod_goods_info');
                if (discount <= 0.1) {
                    goodsInfo.attr('title', '1折以下（优惠'+priceOff+'）').css('background-color', 'gold'); //1折以下
                } else if (discount <= 0.3) {
                    goodsInfo.attr('title', '3折以下（优惠'+priceOff+'）').css('background-color', 'springgreen'); //3折以下
                } else if (discount <= 0.5) {
                    goodsInfo.attr('title', '5折以下（优惠'+priceOff+'）').css('background-color', '#BBFFEE'); //5折以下
                } else if (discount <= 0.75) {
                    goodsInfo.attr('title', '75折以下（优惠'+priceOff+'）').css('background-color', '#CCEEFF'); //75折以下
                } else if (priceOff >= 90) {
                    goodsInfo.attr('title', '优惠超过90（'+priceOff+'）').css('background-color', '#FFEEEE'); //优惠超过90
                } else {
                    goodsInfo.removeAttr('title').css('background-color', '');
                }
                //命中
                return true;
            });

            var niceGoods = groups[true];
            if (niceGoods && niceGoods.length > 0) {
                fltRetPrice = niceGoods.length;

                //排序
                niceGoods.sort(function(g1, g2) {
                    return getPrice(g1).now - getPrice(g2).now || //<---------------------------------------如果要降序，修改这里
                        $(g1).attr('idx') - $(g2).attr('idx');
                });
                //取消图片延迟加载
                forceLoadLazyImgs(niceGoods);

                //如果上一次过滤结果无符合条件商品，隐藏提示
                var noGoods = goodsList.find('#noGoods');
                if (noGoods.length == 1) groups[false].push(noGoods[0]);
            } else {
                niceGoods = goodsList.find('#noGoods')[0] || $('<center id="noGoods"><h2><br/>该分类下的所有商品都不符合过滤条件。<br/><br/><br/></h2></center');
            }

            //替换原内容
            $(niceGoods).css('display', '');
            $(groups[false]).css('display', 'none');
            $(goods[0].closest('ul')).prepend($(niceGoods).remove());
        }
        return [goods.length, fltRetPName, fltRetPrice];
    }

    //取消图片延迟加载
    function forceLoadLazyImgs(elms) {
        var lazyImgs = $(elms).find('img[data-lazy-img][data-lazy-img!="done"]');
        if (lazyImgs.length > 0) lazyImgs.each(function(idx) {
            var img = $(this);
            this.src = img.attr('data-lazy-img');
            img.removeAttr('data-lazy-img');
        });
    }

    //加载/保存页面价格设置
    function loadPagePrice(pageKey) {
        var g_min = GM_getValue('jd_miaosha_price_min');
        var g_max = GM_getValue('jd_miaosha_price_max');
        if (g_min === undefined) g_min = 0;
        if (g_max === undefined) g_max = 0;

        var p_min = GM_getValue(pageKey + '_price_min');
        var p_max = GM_getValue(pageKey + '_price_max');
        if (p_min === undefined) p_min = 0;
        if (p_max === undefined) p_max = 0;

        var checked = GM_getValue(pageKey);
        var min = checked ? p_min : g_min;
        var max = checked ? p_max : g_max;

        var rsrc = GM_getValue(pageKey + '_name_regex_src');
        if (rsrc === undefined) rsrc = '';
        var rflg = GM_getValue(pageKey + '_name_regex_flg');
        if (rflg === undefined) rflg = '';
        var re = rsrc.length > 0 ? new RegExp(rsrc, rflg) : undefined;
        var rs = rflg.length > 0 ? re.toString() : rsrc;

        var parts = pageKey.split('_');
        return {
            pageKey: pageKey,
            pageCat: parts[parts.length - 2],
            pageCatId: parts[parts.length - 1],
            usePageSetting: checked,
            min: min,
            max: max,
            p_min: p_min,
            p_max: p_max,
            g_min: g_min,
            g_max: g_max,
            regstr: rs,
            regexp: re,
        };
    }
    function saveCurrentPagePrice(oldChecked) {
        var min = getFloat($('#fltPriceMin').first().val());
        var max = getFloat($('#fltPriceMax').first().val());
        var keyMin, keyMax;

        //更新
        priceInfo.usePageSetting = $('#fltPriceOne').first().is(':checked');
        if (oldChecked === undefined) oldChecked = priceInfo.usePageSetting;
        if (oldChecked) {
            priceInfo.p_min = min;
            priceInfo.p_max = max;
            keyMin = currentPageKey + '_price_min';
            keyMax = currentPageKey + '_price_max';
        }
        else {
            priceInfo.g_min = min;
            priceInfo.g_max = max;
            keyMin = 'jd_miaosha_price_min';
            keyMax = 'jd_miaosha_price_max';
        }
        if (priceInfo.usePageSetting) {
            priceInfo.min = priceInfo.p_min;
            priceInfo.max = priceInfo.p_max;
        }
        else {
            priceInfo.min = priceInfo.g_min;
            priceInfo.max = priceInfo.g_max;
        }
        priceInfo.regstr = $('#fltNameRegx').first().val().trim();
        if (priceInfo.regstr.length > 0) {
            var r = /^\/(.*)\/([igm]{0,3})$/.exec(priceInfo.regstr);
            priceInfo.regexp = r ? new RegExp(r[1], r[2]) : new RegExp(priceInfo.regstr);
        }
        else priceInfo.regexp = undefined;

        //保存
        if (min === 0) GM_deleteValue(keyMin); else GM_setValue(keyMin, min);
        if (max === 0) GM_deleteValue(keyMax); else GM_setValue(keyMax, max);

        if (priceInfo.usePageSetting || priceInfo.p_min > 0 || priceInfo.p_max > 0)
            GM_setValue(currentPageKey, priceInfo.usePageSetting);
        else GM_deleteValue(currentPageKey);

        var regexKey = currentPageKey + '_name_regex';
        if (priceInfo.regexp) {
            var src = priceInfo.regexp.source;
            if (src.length > 0 && src !== '(?:)')
                GM_setValue(regexKey + '_src', priceInfo.regexp.source);
            else GM_deleteValue(regexKey + '_src');

            var flg = priceInfo.regexp.flags;
            if (flg.length > 0)
                GM_setValue(regexKey + '_flg', flg);
            else GM_deleteValue(regexKey + '_flg');
        }
        else {
            GM_deleteValue(regexKey + '_src');
            GM_deleteValue(regexKey + '_flg');
        }
    }

    //获取商品名
    function getProductName(elm) {
        return $(elm).find('.seckill_mod_goods_title').first().text().trim();
    }
    //获取商品价格
    function getPrice(elm) {
        return {
            now: getFloat($(elm).find('.seckill_mod_goods_price_now').first().text()),
            pre: getFloat($(elm).find('.seckill_mod_goods_price_pre').first().text())
        };
    }
    //字串转浮点数
    function getFloat(str) {
        str = str.replace('￥','').replace('¥','').trim();
        if (!/^-?(\d+|\d+\.\d+|\.\d+)([eE][-+]?\d+)?$/.test(str)) return 0; //非浮点数字串
        return parseFloat(str);
    }
})();

function groupObjs(objs, callback) {
    if (objs instanceof jQuery) objs = $.makeArray(objs);
    var ret = {};
    for(var i=0; i<objs.length; ++i) {
        var obj = objs[i];
        var key = callback(i, obj);
        if(!(key in ret)) ret[key] = [];
        ret[key].push(obj);
    }
    return ret;
}
