// ==UserScript==
// @name              快来网购省钱助手，自动显示京东、淘宝、聚划算、天猫隐藏优惠券与历史价格。纯福利无套路
// @name:zh-TW        網購省錢助手，自動顯示京東、淘寶、聚劃算、天貓隱藏優惠券與歷史價格。纯福利无套路
// @namespace         dengyonghengnamespace
// @version           1.0.4
// @description       快来网购省钱助手~ 自动显示京东(jd.com)、淘宝(taobao.com)、天猫(tmall.com)、聚划算、天猫超市、天猫国际(tmall.hk)、京东国际(jd.hk)、京东图书、京东大药房(yiyaojd.com)隐藏优惠券,让您开心购物。
// @description:zh-TW 網購省錢助手~ 自動顯示京東(jd.com)、淘寶(taobao.com)、天貓(tmall.com)、聚劃算、天貓超市、天貓國際(tmall.hk)、京東國際(jd.hk)、京東圖書、京東大藥房(yiyaojd.com)隱藏優惠券,讓您開心購物。
// @author            dengyonghengauthor
// @match             *://*.taobao.com/*
// @match             *://*.tmall.com/*
// @match             *://chaoshi.detail.tmall.com/*
// @match             *://*.tmall.hk/*
// @match             *://*.liangxinyao.com/*
// @match             *://*.jd.com/*
// @match             *://*.jd.hk/*
// @match             *://*.jkcsjd.com/*
// @match             *://*.yiyaojd.com/*
// @match             *://*.vip.com/*
// @match             *://*.vipglobal.hk/*
// @exclude           *://login.taobao.com/*
// @exclude           *://login.tmall.com/*
// @exclude           *://uland.taobao.com/*
// @exclude           *://pages.tmall.com/*
// @exclude           *://wq.jd.com/*
// @connect           leowu.online
// @require            http://ajax.aspnetcdn.com/ajax/jquery/jquery-2.1.4.min.js
// @require           https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery.qrcode/1.0/jquery.qrcode.min.js
// @antifeature       referral-link 【应GreasyFork代码规范要求：含有优惠券查询功能的脚本必须添加此提示！在此感谢大家的理解...】
// @grant             unsafeWindow
// @license           AGPL
// @downloadURL https://update.greasyfork.org/scripts/490898/%E5%BF%AB%E6%9D%A5%E7%BD%91%E8%B4%AD%E7%9C%81%E9%92%B1%E5%8A%A9%E6%89%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E4%BA%AC%E4%B8%9C%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%81%E8%81%9A%E5%88%92%E7%AE%97%E3%80%81%E5%A4%A9%E7%8C%AB%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E4%B8%8E%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E3%80%82%E7%BA%AF%E7%A6%8F%E5%88%A9%E6%97%A0%E5%A5%97%E8%B7%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/490898/%E5%BF%AB%E6%9D%A5%E7%BD%91%E8%B4%AD%E7%9C%81%E9%92%B1%E5%8A%A9%E6%89%8B%EF%BC%8C%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E4%BA%AC%E4%B8%9C%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%81%E8%81%9A%E5%88%92%E7%AE%97%E3%80%81%E5%A4%A9%E7%8C%AB%E9%9A%90%E8%97%8F%E4%BC%98%E6%83%A0%E5%88%B8%E4%B8%8E%E5%8E%86%E5%8F%B2%E4%BB%B7%E6%A0%BC%E3%80%82%E7%BA%AF%E7%A6%8F%E5%88%A9%E6%97%A0%E5%A5%97%E8%B7%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var index_num = 0;
    var $ = $ || window.$;
    var item = [];
    var urls = [];
    var selectorList = [];
    var obj = {};
    var html = '';
    obj.onclicks = function(link) {
        if (document.getElementById('redirect_form')) {
            var form = document.getElementById('redirect_form');
            form.action = 'https://leowu.online/red.html?url=' + encodeURIComponent(link);
        } else {
            var form = document.createElement('form');
            form.action = 'https://leowu.online/red.html?url=' + encodeURIComponent(link);
            form.target = '_blank';

            form.method = 'POST';
            form.setAttribute("id", 'redirect_form');
            document.body.appendChild(form);

        }
        form.submit();
        form.action = "";
        form.parentNode.removeChild(form);
    };

    obj.getUrlParam=function(name) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == name){return pair[1];}
        }
        return(false);
    }
    obj.GetQueryString = function(name) {
        var reg = eval("/" + name + "/g");
        var r = window.location.search.substr(1);
        var flag = reg.test(r);
        if (flag) {
            return true;
        } else {
            return false;
        }
    };
    obj.get_url = function() {
        item[index_num] = [];
        urls[index_num] = [];
        $("#J_goodsList li").each(function(index) {
            if ($(this).attr('data-type') != 'yes') {
                var skuid = $(this).attr('data-sku');
                var itemurl = '//item.jd.com/' + skuid + '.html';
                if (skuid != undefined) {
                    if (urls[index_num].length < 4) {
                        item[index_num].push($(this));
                        urls[index_num].push(itemurl);
                        $(this).attr('data-type', 'yes');
                    }


                }
            }

        })

        $("#plist li").each(function(index) {
            if ($(this).attr('data-type') != 'yes') {
                var skuid = $(this).find('.j-sku-item').attr('data-sku');
                var itemurl = '//item.jd.com/' + skuid + '.html';
                if (skuid != undefined) {
                    if (urls[index_num].length < 4) {
                        item[index_num].push($(this));
                        urls[index_num].push(itemurl);
                        $(this).attr('data-type', 'yes');
                    }


                }
            }

        })

        $(".m-aside .aside-bar li").each(function(index) {
            if ($(this).attr('data-type') != 'yes') {
                var itemurl = $(this).find("a").attr('href');
                if (itemurl != '') {
                    if (itemurl.indexOf("//ccc-x.jd.com") != -1) {
                        var sku_c = $(this).attr('sku_c');
                        if (sku_c == undefined) {
                            var arr = [];
                            var str = $(this).attr('onclick');
                            arr = str.split(",");
                            sku_c = trim(arr[6].replace(/\"/g, ""));
                            itemurl = '//item.jd.com/' + sku_c + '.html';
                        }

                    }
                    if (urls[index_num].length < 4) {
                        item[index_num].push($(this));
                        urls[index_num].push(itemurl);
                        $(this).attr('data-type', 'yes');
                    }



                }
            }

        })
        $(".may-like-list li").each(function(index) {
            if ($(this).attr('data-type') != 'yes') {
                var itemurl = $(this).find("a").attr('href');
                if (itemurl != '') {
                    if (itemurl.indexOf("//ccc-x.jd.com") != -1) {
                        var arr = [];
                        var str = $(this).attr('onclick');
                        arr = str.split(",");
                        var sku_c = trim(arr[6].replace(/\"/g, ""));
                        itemurl = '//item.jd.com/' + sku_c + '.html';
                    }
                    if (urls[index_num].length < 4) {
                        item[index_num].push($(this));
                        urls[index_num].push(itemurl);
                        $(this).attr('data-type', 'yes');
                    }


                }
            }

        })
        $(".goods-chosen-list li").each(function(index) {
            if ($(this).attr('data-type') != 'yes') {
                var itemurl = $(this).find("a").attr('href');
                if (itemurl != '') {
                    if (itemurl.indexOf("//ccc-x.jd.com") != -1) {
                        var arr = [];
                        var str = $(this).attr('onclick');
                        arr = str.split(",");
                        var sku_c = trim(arr[6].replace(/\"/g, ""));
                        itemurl = '//item.jd.com/' + sku_c + '.html';

                    }
                    if (urls[index_num].length < 4) {
                        item[index_num].push($(this));
                        urls[index_num].push(itemurl);
                        $(this).attr('data-type', 'yes');
                    }

                }




            }

        })


        if (urls.length > 0 && urls[index_num].length > 0 && item[index_num].length > 0) {


            var u = urls[index_num].join(',');
            $.getJSON('https://leowu.online/jd.php', {
                act: 'itemlink',
                itemurl: u,
                num: index_num
            }, function(res) {
                if (res.type == 'success') {
                    for (var i = 0; i < res.data.length; i++) {
                        item[res.num][i].find("a").attr('data-ref', res.data[i].longUrl);
                        item[res.num][i].find("a").attr('target', '');
                        item[res.num][i].find("a").unbind("click");
                        item[res.num][i].find("a").bind("click", function(e) {
                            if ($(this).attr('data-ref')) {
                                e.preventDefault();
                                obj.onclicks($(this).attr('data-ref'));

                            }
                        })

                    }

                }
            })


        }
        index_num += 1;

    };
    obj.get_miaosha = function() {
        item[index_num] = [];
        urls[index_num] = [];
        $(".seckill_mod_goodslist li").each(function(index) {

            if ($(this).attr('data-type') != 'yes') {

                var itemurl = $(this).find("a").attr('href');
                var skuid = $(this).attr('data-sku');
                var that = $(this);
                if (itemurl != '') {
                    if (urls[index_num].length < 4) {

                        item[index_num].push($(this));
                        urls[index_num].push(itemurl);
                        $(this).attr('data-type', 'yes');
                    }


                }
            }

        })



        if (urls.length > 0 && urls[index_num].length > 0 && item[index_num].length > 0) {


            var u = urls[index_num].join(',');
            $.getJSON('https://leowu.online/jd.php', {
                act: 'itemlink',
                itemurl: u,
                num: index_num
            }, function(res) {
                if (res.type == 'success') {
                    for (var i = 0; i < res.data.length; i++) {
                        item[res.num][i].find("a").attr('data-ref', res.data[i].longUrl);
                        item[res.num][i].find("a").attr('href', "javascript:void(0);");
                        item[res.num][i].find("a").attr('target', '');

                        item[res.num][i].find("a").click(function(e) {
                            e.preventDefault();
                            obj.onclicks($(this).attr('data-ref'));
                        })

                    }

                }
            })


        }
        index_num += 1;
    };
    const style =
        `
  			.gwd_taobao .gwd-minibar-bg, .gwd_tmall .gwd-minibar-bg {
  			    display: block;
  			}

  			.idey-minibar_bg{
  			    position: relative;
  			    min-height: 40px;
  			    display: inline-block;
  			}
  			#idey_minibar{
  			    width: 525px;
  			    background-color: #fff;
  			    position: relative;
  			    border: 1px solid #e8e8e8;
  			    display: block;
  			    line-height: 36px;
  			    font-family: 'Microsoft YaHei',Arial,SimSun!important;
  			    height: 36px;
  			    float: left;
  			}
  			#idey_minibar .idey_website {
  			    width: 48px;
  			    float: left;
  			    height: 36px;
  			}
  			#idey_minibar .minibar-tab {
  			    float: left;
  			    height: 36px;
  			    border-left: 1px solid #edf1f2!important;
  			    padding: 0;
  			    margin: 0;
  			    text-align: center;
  			}

  			#idey_minibar .idey_website em {
  			    background-position: -10px -28px;
  			    height: 36px;
  			    width: 25px;
  			    float: left;
  			    margin-left: 12px;
  			}

  			.setting-bg {
  			    background: url(https://cdn.gwdang.com/images/extensions/xbt/new_wishlist_pg5_2.png) no-repeat;
  			}

  			#idey_minibar .minibar-tab {
  			    float: left;
  			    height: 36px;
  			    border-left: 1px solid #edf1f2!important;
  			    padding: 0;
  			    margin: 0;
  			    width: 134px;
  			}
  			#idey_price_history span {
  			    float: left;
  			    width: 100%;
  			    text-align: center;
  			    line-height: 36px;
  			    color: #666;
  			    font-size: 14px;
  			}

  			#mini_price_history .trend-error-info-mini {
  			    position: absolute;
  			    top: 37px;
  			    left: 0px;
  			    width: 100%;
  			    background: #fff;
  			    z-index: 99999999;
  			    height: 268px;
  			    box-shadow: 0px 5px 15px 0 rgb(23 25 27 / 15%);
  			    border-radius: 0 0 4px 4px;
  			    width:559px;
  			    border: 1px solid #ddd;
  			    border-top: none;
  				display:none;

  			}
  			.minibar-btn-box {
  			    display: inline-block;
  			    margin: 0 auto;
  			    float: none;
  			}
  			#mini_price_history .error-p {
  			      width: 95px;
  			      margin: 110px auto;
  			      height: 20px;
  			      line-height: 20px;
  			      text-align: center;
  			      color: #000!important;
  			      border: 1px solid #333;
  			      border-radius: 5px;
  			      display: block;
  			      text-decoration: none!important;
  			    }
  			 #mini_price_history:hover .trend-error-info-mini {
  			      display: block;
  			    }

  			.collect_mailout_icon {
  			    background-position: -247px -134px;
  			    width: 18px;
  			}

  			#idey_mini_compare_detail li *, .mini-compare-icon, .minibar-btn-box * {
  			    float: left;
  			}
  			.panel-wrap{
  				width: 100%;
  				height: 100%;
  			}
  			.collect_mailout_icon, .mini-compare-icon {
  			    height: 18px;
  			    margin-right: 8px;
  			    margin-top: 9px;
  			}
  			.all-products ul li {
  			    float: left;
  			    width: 138px;
  			    height: 262px;
  			    overflow: hidden;
  			    text-align: center;
  			}
  			.all-products ul li .small-img {
  			    text-align: center;
  			    display: table-cell;
  			    vertical-align: middle;
  			    line-height: 90px;
  			    width: 100%;
  			    height: 100px;
  			    position: relative;
  			    float: left;
  			    margin-top: 23px;
  			}
  			.all-products ul li a img {
  			    vertical-align: middle;
  			    display: inline-block;
  			    width: auto;
  			    height: auto;
  			    max-height: 100px;
  			    max-width: 100px;
  			    float: none;
  			}
  			.all-products ul li a.b2c-other-info {
  			    text-align: center;
  			    float: left;
  			    height: 16px;
  			    line-height: 16px;
  			    margin-top: 13px;
  			}

  			.b2c-other-info .gwd-price {
  			    height: 17px;
  			    line-height: 17px;
  			    font-size: 16px;
  			    color: #E4393C;
  			    font-weight: 700;
  				width: 100%;
  				display: block;
  			}
  			.b2c-other-info .b2c-tle {
  			    height: 38px;
  			    line-height: 19px;
  			    margin-top: 8px;
  			    font-size: 12px;
  			    width: 138px;
  			    margin-left: 29px;
  			}
  			 .bjgext-mini-trend span {
  			      float: left;
  			      /*width: 100%;*/
  			      text-align: center;
  			      line-height: 36px;
  			      color: #666;
  			      font-size: 14px;
  			    }
  			    .bjgext-mini-trend .trend-error-info-mini {
  			      position: absolute;
  			      top: 37px;
  			      left: 0px;
  			      width: 100%;
  			      background: #fff;
  			      z-index: 99999999;
  			      height: 268px;
  			      display: none;
  			      box-shadow: 0px 5px 15px 0 rgba(23,25,27,0.15);
  			      border-radius: 0 0 4px 4px;
  			      width: 460px;
  			      border: 1px solid #ddd;
  			      border-top: none;
  			    }
  			    .bjgext-mini-trend .error-p {
  			      width: 100%;
  			      float: left;
  			      text-align: center;
  			      margin-top: 45px;
  			      font-size: 14px;
  			      color: #666;
  			    }
  			    .bjgext-mini-trend .error-sp {
  			      width: 95px;
  			      margin: 110px auto;
  			      height: 20px;
  			      line-height: 20px;
  			      text-align: center;
  			      color: #000!important;
  			      border: 1px solid #333;
  			      border-radius: 5px;
  			      display: block;
  			      text-decoration: none!important;
  			    }
  			    .bjgext-mini-trend:hover .trend-error-info-mini {
  			      display: block;
  			    }


  			    #coupon_box.coupon-box1 {
  			      width: 525px;
  			      height: 125px;
  			      background-color: #fff;
  			      border: 1px solid #e8e8e8;
  			      border-top: none;
  			      position: relative;
  			      margin: 0px;
  			      padding: 0px;
  			      float: left;
  			      display: block;
  			    }
  			    #coupon_box:after {
  			      display: block;
  			      content: "";
  			      clear: both;
  			    }
  			    .idey_tmall #idey_minibar {
  			      float: none;
  			    }


  			    .minicoupon_detail {
  			      position: absolute;
  			      top: 35px;
  			      right: -1px;
  			      height: 150px;
  			      width: 132px;
  			      display: none;
  			      z-index: 99999999999;
  			      background: #FFF7F8;
  			      border: 1px solid #F95774;
  			    }
  			    #coupon_box:hover .minicoupon_detail {
  			      display: block;
  			    }
  			    .minicoupon_detail img {
  			      width: 114px;
  			      height: 114px;
  			      float: left;
  			      margin-left: 9px;
  			      margin-top: 9px;
  			    }
  			    .minicoupon_detail span {
  			      font-size: 14px;
  			      color: #F95572;
  			      letter-spacing: 0;
  			      font-weight: bold;
  			      float: left;
  			      height: 12px;
  			      line-height: 14px;
  			      width: 100%;
  			      margin-top: 6px;
  			      text-align: center;
  			    }
  			    .coupon-box1 * {
  			      font-family: 'Microsoft YaHei',Arial,SimSun;
  			    }
  			    .coupon-icon {
  			      float: left;
  			      width: 20px;
  			      height: 20px;
  			      background: url('https://cdn.gwdang.com/images/extensions/newbar/coupon_icon.png') 0px 0px no-repeat;
  			      margin: 50px 8px 9px 12px;
  			    }
  			    #coupon_box .coupon-tle {
  			      color: #FF3B5C;
  			      font-size: 24px;
  			      margin-right: 11px;
  			      float: left;
  			      height: 114px;
  			      overflow: hidden;
  			      text-overflow: ellipsis;
  			      white-space: nowrap;
  			      width: 375px;
  			      line-height: 114px;
  			      text-decoration: none!important;
  			    }
  			    #coupon_box .coupon-row{
  			         color: #FF3B5C;
  			      font-size: 12px;
  			      margin-right: 11px;
  			      float: left;
  			      height: 60px;
  			      overflow: hidden;
  			      text-overflow: ellipsis;
  			      white-space: nowrap;
  			      width: 100%;
  			      line-height: 60px;
  			      text-decoration: none!important;
  			        text-align: center;
  			    }
  			    #coupon_box .coupon-tle * {
  			      color: #f15672;
  			    }
  			    #coupon_box .coupon-tle span {
  			      margin-right: 5px;
  			      font-weight: bold;
  			      font-size: 14px;
  			    }
  			    .coupon_gif {
  			      background: url('https://cdn.gwdang.com/images/extensions/newbar/turn.gif') 0px 0px no-repeat;
  			      float: right;
  			      height: 20px;
  			      width: 56px;
  			      margin-top: 49px;
  			    }
  			    .click2get {
  			      background: url('https://cdn.gwdang.com/images/extensions/newbar/coupon_01.png') 0px 0px no-repeat;
  			      float: left;
  			      height: 30px;
  			      width: 96px;
  			      margin-top: 43px;
  			    }
  			    .click2get span {
  			      height: 24px;
  			      float: left;
  			      margin-left: 1px;
  			    }
  			    .c2g-sp1 {
  			      width: 50px;
  			      color: #FF3B5C;
  			      text-align: center;
  			      font-size: 14px;
  			      line-height: 24px!important;
  			    }
  			    .c2g-sp2 {
  			      width: 44px;
  			      line-height: 24px!important;
  			      color: #fff!important;
  			      text-align: center;
  			    }
  			    div#idey_wishlist_div.idey_wishlist_div {
  			      border-bottom-right-radius: 0px;
  			      border-bottom-left-radius: 0px;
  			    }
  			    #qrcode{
  			         float: left;
  			        width: 125px;
  			        margin-top:3px;
  			    }


  			    .elm_box{
  			        height: 37px;
  			     border: 1px solid #ddd;
  			     width: 460px;
  			     line-height: 37px;
  			     margin-bottom: 3px;
  			         background-color: #ff0036;
  			             font-size: 15px;
  			    }
  			    .elm_box span{
  			            width: 342px;
  			    text-align: center;
  			    display: block;
  			    float: left;
  			    color: red;
  			    color: white;
  			    }`

    function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }

    function removeEvent(that, href) {
        that.find("a").attr('target', '');
        that.find("a").unbind("click");
        that.find("a").bind("click", function(e) {
            e.preventDefault();
            if (href != undefined) {
                obj.onclicks(href);
            } else {
                obj.onclicks($(this).attr('href'));
            }

        })
    }
    obj.initStyle = function() {
        var styles = document.createElement('style')
        styles.type = 'text/css'
        styles.innerHTML = style;
        document.getElementsByTagName('head').item(0).appendChild(styles)
    }


    obj.initSearchHtml = function(selectorList) {
        setInterval(function() {
            selectorList.forEach(function(selector) {
                obj.initSearchItemSelector(selector);
            });
        }, 3000);
    };

    obj.initSearchEvent = function() {
        $(document).on("click", ".tb-cool-box-area", function() {
            var $this = $(this);
            if ($this.hasClass("tb-cool-box-wait")) {
                obj.basicQueryItem(this);
            } else if ($this.hasClass("tb-cool-box-info-translucent")) {
                $this.removeClass("tb-cool-box-info-translucent");
            } else {
                $this.addClass("tb-cool-box-info-translucent");
            }
        });
    };

    obj.basicQuery = function() {
        setInterval(function() {
            $(".tb-cool-box-wait").each(function() {
                obj.basicQueryItem(this);
            });
        }, 3000);
    };

    obj.initSearchItemSelector = function(selector) {
        $(selector).each(function() {
            obj.initSearchItem(this);
        });
    };

    obj.initSearchItem = function(selector) {
        var $this = $(selector);
        if ($this.hasClass("tb-cool-box-already")) {
            return;
        } else {
            $this.addClass("tb-cool-box-already")
        }

        var nid = $this.attr("data-id");
        if (!obj.isVailidItemId(nid)) {
            nid = $this.attr("data-itemid");
        }

        if (!obj.isVailidItemId(nid)) {
            if ($this.attr("href")) {
                nid = location.protocol + $this.attr("href");
            } else {
                var $a = $this.find("a");
                if (!$a.length) {
                    return;
                }

                nid = $a.attr("data-nid");
                if (!obj.isVailidItemId(nid)) {
                    if ($a.hasClass("j_ReceiveCoupon") && $a.length > 1) {
                        nid = location.protocol + $($a[1]).attr("href");
                    } else {
                        nid = location.protocol + $a.attr("href");
                    }
                }
            }
        }

        if (obj.isValidNid(nid)) {
            obj.basicQueryItem($this, nid);
        }
    };



    obj.basicQueryItem = function(selector, nid) {
        var $this = $(selector);
        console.log($this.find('.pic-box .pic-box-inner').html());
        $.get('https://leowu.online/tb.php?act=recovelink&itemid=' + nid, function(data) {
            if (data.type == 'success') {
                var vhtml='<div style="position: absolute;top: 18px;right: 5px;"><a href="javascript:void(0);" style="padding:10px;border-radius: 15px;background-color:#f40;color:#FFF;text-decoration:none;" >有劵('+data.data+')</a></div>';
                $this.find('.pic-box .pic-box-inner').append(vhtml);
                //obj.changeUrl($this, data.data);
            } else {
                var vhtml='<div style="position: absolute;top: 18px;right: 5px;opacity:0.33" ><a href="javascript:void(0);" style="padding:10px;border-radius: 15px;background-color:#ccc;text-decoration:none;" >暂无优惠劵</a></div>';
                $this.find('.pic-box .pic-box-inner').append(vhtml);
            }
        }, 'json')
    };

    obj.changeUrl = function(selector, data) {

    }


    obj.isDetailPageTaoBao = function(url) {
        if (url.indexOf("//item.taobao.com/item.htm") > 0 || url.indexOf("//detail.tmall.com/item.htm") > 0 ||
            url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 || url.indexOf(
                "//detail.tmall.hk/hk/item.htm") > 0) {
            return true;
        } else {
            return false;
        }
    };

    obj.isVailidItemId = function(itemId) {
        if (!itemId) {
            return false;
        }

        var itemIdInt = parseInt(itemId);
        if (itemIdInt == itemId && itemId > 10000) {
            return true;
        } else {
            return false;
        }
    };

    obj.isValidNid = function(nid) {
        if (!nid) {
            return false;
        } else if (nid.indexOf('http') >= 0) {
            if (obj.isDetailPageTaoBao(nid) || nid.indexOf("//detail.ju.taobao.com/home.htm") > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };

    obj.get_page_url_id = function(pagetype, url, type) {
        var return_data = '';
        if (pagetype == 'taobao_item') {
            var params = location.search.split("?")[1].split("&");
            for (var index in params) {
                if (params[index].split("=")[0] == "id") {
                    var productId = params[index].split("=")[1];
                }
            }
            return_data = productId;
        }
        return return_data;
    }

    obj.get_type_url = function(url) {
        if (
            url.indexOf("//item.taobao.com/item.htm") > 0 ||
            url.indexOf("//detail.tmall.com/item.htm") > 0 ||
            url.indexOf("//chaoshi.detail.tmall.com/item.htm") > 0 ||
            url.indexOf("//detail.tmall.hk/hk/item.htm") > 0 ||
            url.indexOf("//world.tmall.com") > 0 ||
            url.indexOf("//detail.liangxinyao.com/item.htm") > 0 ||
            url.indexOf("//detail.tmall.hk/item.htm") > 0
        ) {
            return 'taobao_item';
        } else if (
            url.indexOf("//maiyao.liangxinyao.com/shop/view_shop.htm") > 0 ||
            url.indexOf("//list.tmall.com/search_product.htm") > 0 ||
            url.indexOf("//s.taobao.com/search") > 0 ||
            url.indexOf("//list.tmall.hk/search_product.htm") > 0
        ) {
            return 'taobao_list';
        } else if (
            url.indexOf("//search.jd.com/Search") > 0 ||
            url.indexOf("//search.jd.com/search") > 0 ||
            url.indexOf("//search.jd.hk/search") > 0 ||
            url.indexOf("//search.jd.hk/Search") > 0 ||
            url.indexOf("//www.jd.com/xinkuan") > 0 ||
            url.indexOf("//list.jd.com/list.html") > 0 ||
            url.indexOf("//search.jd.hk/Search") > 0 ||
            url.indexOf("//coll.jd.com") > 0


        ) {
            return 'jd_list';
        } else if (
            url.indexOf("//item.jd.hk") > 0 ||
            url.indexOf("//pcitem.jd.hk") > 0 ||
            url.indexOf("//i-item.jd.com") > 0 ||
            url.indexOf("//item.jd.com") > 0 ||
            url.indexOf("//npcitem.jd.hk") > 0 ||
            url.indexOf("//item.yiyaojd.com") > 0 ||
            url.indexOf("//item.jkcsjd.com") > 0
        ) {
            return 'jd_item';
        } else if (
            url.indexOf("//miaosha.jd.com") > 0
        ) {
            return 'jd_miaosha';
        } else if (
            url.indexOf("//www.jd.com") > 0 ||
            url.indexOf("//jd.com") > 0
        ) {
            return 'jd_index';
        }else if(
            url.indexOf("//jingfen.jd.com") >0
        ){
            return 'jingfen';
        }

    }

    var pageurl = location.href;
    var pagetype = obj.get_type_url(pageurl);
    if (pagetype == 'taobao_item') {
        var productId = obj.get_page_url_id(pagetype, pageurl, pageurl);

        obj.initStyle(style);
        //	var productId = obj.get_page_url_id(pagetype, pageurl, pageurl);
        var couponurl = "https://leowu.online/ltb.php?act=items&itemurl=" + encodeURIComponent(location.href) +
            '&itemid=' +
            productId;
        $.getJSON(couponurl, function(res) {
            console.log('res',res)
            var data = res.data;

            var couponArea = '<div class="idey-minibar_bg">';
            couponArea += '<div id="idey_minibar" class="alisite_page">';
            couponArea +=
                '<a class="idey_website"  id="idey_website_icon" target="_blank" href="https://leowu.online">';
            couponArea += '<em class="setting-bg website_icon"></em></a>';
            couponArea += '<div  id="mini_price_history" class="minibar-tab">';



            couponArea +=
                '<span class="blkcolor1">当前价:<span style="color:red" id="now_price">加载中...</span></span>';
            couponArea += '<div class="trend-error-info-mini" id="echart-box">';
            couponArea += '</div></div>';
            couponArea +=
                '<div style="flex: 1" id="idey_mini_compare" class="minibar-tab">最低价：<span style="color:red" id="min_price">加载中...</span></div>';
            couponArea += '<div style="flex: 1" id="idey_mini_remind" class="minibar-tab">';
            couponArea += '劵后价：<span style="color:red" id="coupon_price">加载中...</span>';

            couponArea += ' </div></div>';
            couponArea +=
                ' <div class="idey-mini-placeholder idey-price-protect"></div><div id="promo_box"></div>';



            if (res.type == 'success') {
                couponArea +=
                    '<a id="coupon_box" title="" class="coupon-box1" href="https://leowu.online/coupon.php?itemurl=' +
                    encodeURIComponent(location.href) + '&itemid='+productId+'">';
                couponArea += '<span class="coupon-icon"></span>';
                couponArea += ' <div class="coupon-tle"> <span>当前商品领券立减' + data.couponAmount +
                    '元</span> <em class="coupon_gif"></em></div>';
                couponArea += '<div class="click2get"><span class="c2g-sp1">￥' + data.couponAmount +
                    '</span><span class="c2g-sp2">领取</span></div>';
                couponArea += '</a>';

            } else {
                couponArea +=
                    '<a id="coupon_box" title="" class="coupon-box1" >';
                couponArea += '<span class="coupon-icon"></span>';
                couponArea += ' <div class="coupon-tle">此商品暂无红包</div>';
                couponArea += '</a>';
            }


            couponArea += '</div>';
            if (data.alist.length > 0) {
                for (let i = 0; i < data.alist.length; i++) {
                    couponArea +=
                        '<div style="border:1px solid red;line-height:60px;color:red;font-size:20px;text-align:center;width:525px"><a href="' +
                        data.alist[i].url + '" target="_blank">' + data.alist[i].name + '</a></div>'
                }
            }
            setTimeout(function(){
                if (location.href.indexOf("//detail.tmall") != -1) {
                    $(".tm-fcs-panel").after(couponArea);
                    $(".Price--sale--1huSj6m").after(couponArea);
                    $(".Price--normal--t-x499v").after(couponArea);

                } else {
                    $(".Price--sale--1huSj6m").after(couponArea);
                    $(".Price--normal--t-x499v").after(couponArea);
                }
                if (data.originalPrice) {
                    $("#now_price").html('¥' + data.originalPrice);
                }
                if (data.actualPrice) {
                    $("#coupon_price").html('¥' + data.actualPrice);
                }
            }, 1800 )
            if(data.shortUrl){
                let hbm='<div style="position:fixed;width:170px;height:170px;right:28px;bottom:10px;z-index: 99999999;"><h1 style="color:red;font-size: 11px">使用淘宝APP领劵购买此商品</h1><div id="hbcode"></div></div>';
                $("body").append(hbm);
                $("#hbcode").qrcode({
                    render: "canvas", //也可以替换为table
                    width: 160,
                    height: 150,
                    text: data.shortUrl
                });
            }

        });

    } else if (pagetype == 'jd_item') {
        obj.initStyle(style);
        var productId = /(\d+)\.html/.exec(window.location.href)[1];
        var couponurl = "https://leowu.online/jd.php?act=recovelink&itemurl=" + encodeURIComponent(location.href) +
            '&itemid=' + productId;
        $.getJSON(couponurl, function(res) {
            var data = res.data;
            if (!obj.GetQueryString('utm_campaign') && data) {
                window.location.href = 'https://leowu.online/red.html?url=' + encodeURIComponent(data);
            }

        });
        var couponurls = "https://leowu.online/xjd.php?act=item&itemurl=" + encodeURIComponent(location.href) +
            '&itemid=' + productId;

        $.getJSON(couponurls, function(res) {
            var data = res.data;

            var couponArea = '<div class="idey-minibar_bg">';
            couponArea += '<div id="idey_minibar" class="alisite_page">';
            couponArea +=
                '<a class="idey_website"  id="idey_website_icon" target="_blank" href="https://leowu.online">';
            couponArea += '<em class="setting-bg website_icon"></em></a>';
            couponArea += '<div  id="mini_price_history" class="minibar-tab">';


            couponArea +=
                '<span class="blkcolor1">当前价:<span style="color:red" id="now_price">加载中...</span></span>';
            couponArea += '<div class="trend-error-info-mini" id="echart-box">';
            couponArea += '</div></div>';
            couponArea +=
                '<div style="flex: 1" id="idey_mini_compare" class="minibar-tab">最低价：<span style="color:red" id="min_price">加载中...</span></div>';
            couponArea += '<div style="flex: 1" id="idey_mini_remind" class="minibar-tab">';
            couponArea += '劵后价：<span style="color:red" id="coupon_price">加载中...</span>';

            couponArea += ' </div></div>';
            couponArea +=
                ' <div class="idey-mini-placeholder idey-price-protect"></div><div id="promo_box"></div>';



            if (res.type == 'success') {
                if (data.couponLinkType == 1) {
                    couponArea +=
                        '<a id="coupon_box" title="" class="coupon-box1" href="' + data.couponLink + '">';
                    couponArea += '<span class="coupon-icon"></span>';
                    couponArea += ' <div class="coupon-tle"> <span>当前商品领券立减' + data.couponAmount +
                        '元</span> <em class="coupon_gif"></em></div>';
                    couponArea += '<div class="click2get"><span class="c2g-sp1">￥' + data.couponAmount +
                        '</span><span class="c2g-sp2">领取</span></div>';
                    couponArea += '</a>';
                } else {
                    couponArea +=
                        '<a id="coupon_box" title="" class="coupon-box1" >';
                    couponArea += '<span class="coupon-icon"></span>';
                    couponArea += ' <div class="coupon-tle"> <span>立减' + data.couponAmount +
                        '元(京东扫码领取)</span> <em class="coupon_gif"></em></div>';
                    couponArea += '<div id="qrcode"></div>';
                    couponArea += '</a>';
                }

            } else {

                couponArea +=
                    '<a id="coupon_box" title="" class="coupon-box1" >';
                couponArea += '<span class="coupon-icon"></span>';
                couponArea += ' <div class="coupon-tle">此商品暂无红包</div>';

                couponArea += '</a>';


            }

            couponArea += '</div>';
            if (data.alist.length > 0) {
                for (let i = 0; i < data.alist.length; i++) {
                    couponArea +=
                        '<div style="border:1px solid red;line-height:60px;color:red;font-size:20px;text-align:center;width:525px"><a href="' +
                        data.alist[i].url + '" target="_blank">' + data.alist[i].name + '</a></div>'
                }
            }
            setTimeout(function(){

                $(".summary-price-wrap").after(couponArea);
            },500)

            if (data.couponLink) {
                $('#qrcode').qrcode({
                    render: "canvas", //也可以替换为table
                    width: 125,
                    height: 120,
                    text: data.couponLink
                });

            } else if (data.item_link.shortUrl) {
                $('#qrcode').qrcode({
                    render: "canvas", //也可以替换为table
                    width: 125,
                    height: 120,
                    text: data.item_link.shortUrl
                });
            } else {
                $('#qrcode').qrcode({
                    render: "canvas", //也可以替换为table
                    width: 125,
                    height: 120,
                    text: data.item_link.longUrl
                });
            }
            if (data.item_link.originalPrice) {
                $("#now_price").html('¥' + data.item_link.originalPrice);
            }
            if (data.item_link.actualPrice) {
                $("#coupon_price").html('¥' + data.item_link.actualPrice);
            }
            if(data.hbcode !=''){
                let hbm='<div style="position:fixed;width:160px;height:160px;right:28px;bottom:50px;z-index:999"><h1 style="color:red;font-size: 11px">使用京东APP领劵购买此商品</h1><div id="hbcode"></div></div>';

                $(".toolbar-qrcode").hide();
                setInterval(function(){
                    $(".toolbar-qrcode").hide();
                },100 )
                $("body").append(hbm);
                $("#hbcode").qrcode({
                    render: "canvas", //也可以替换为table
                    width: 150,
                    height: 140,
                    text: data.hbcode
                });
            }


        });

    } else if (pagetype == 'jd_list') {
        setInterval(obj.get_url, 300);


    } else if (pagetype == 'jd_miaosha') {
        $(".seckill_mod_goodslist li").find("a").click(function(e) {
            if ($(this).attr('data-ref')) {
                e.preventDefault();
                obj.onclicks($(this).attr('data-ref'));
            }
        })

        setInterval(obj.get_miaosha, 300);

    } else if (pagetype == 'taobao_list') {





    }else if(pagetype=="jingfen"){
        let productId=obj.getUrlParam("sku");
        if(productId){
            var couponurl = "https://leowu.online/xjd.php?act=itemcode&itemid=" + productId;
            $.getJSON(couponurl, function(res) {
                var data = res.data;
                if(data !='' && data !=null && data !=undefined){
                    $(document).ready(function(){
                        setTimeout(function(){
                            $(".btn-area").after("<div class='coupon_info' style='color: wheat;font-size: 24px;'>使用微信或者京东APP扫码更便捷</div>");
                            $(".btn-area").after("<div class='coupon_code'></div>");
                            //   $(".btn-area").hide();
                            $('.coupon_code').qrcode({
                                render: "canvas", //也可以替换为table
                                width: 200,
                                height: 180,
                                text: data
                            });
                        }, 500 )
                    });
                }else{
                    $(document).ready(function(){
                        setTimeout(function(){
                            $(".btn-area").after("<div class='coupon_info' style='color: wheat;font-size: 24px;'>使用微信或者京东APP扫码更便捷</div>");
                            $(".btn-area").after("<div class='coupon_code'></div>");
                            //   $(".btn-area").hide();
                            $('.coupon_code').qrcode({
                                render: "canvas", //也可以替换为table
                                width: 400,
                                height: 380,
                                text: location.href
                            });
                        }, 500 )
                    });
                }



            });
        }else{
            $(document).ready(function(){
                setTimeout(function(){
                    $(".btn-area").after("<div class='coupon_info' style='color: wheat;font-size: 24px;'>使用微信或者京东APP扫码更便捷</div>");
                    $(".btn-area").after("<div class='coupon_code'></div>");
                    //   $(".btn-area").hide();
                    $('.coupon_code').qrcode({
                        render: "canvas", //也可以替换为table
                        width: 400,
                        height: 385,
                        text: location.href
                    });
                }, 500 )
            });
        }
    }





})();