// ==UserScript==
// @name         购物党比价工具【精简版】
// @namespace    none
// @version      2.5.0
// @description  gwdang精简版 ，精简gwdang，减少弹窗，仅留下顶栏，并去除菜单部分
// @author       淘宝老司机
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @include      http*://item.taobao.com/*
// @include      http*://s.taobao.com/*
// @include      http*://detail.tmall.com/item.htm*
// @include      http*://detail.liangxinyao.com/item.htm*
// @include      http*://chaoshi.detail.tmall.com/item.htm*
// @include      http*://item.jd.com/*
// @include      https://item.jd.hk/*
// @include      https://detail.tmall.hk/*
// @include      https://*.suning.com/*
// @grant        GM_xmlhttpRequest
// @connect      gwd.languagedisorder.cn
// @connect      browser.gwdang.com
// @downloadURL https://update.greasyfork.org/scripts/40303/%E8%B4%AD%E7%89%A9%E5%85%9A%E6%AF%94%E4%BB%B7%E5%B7%A5%E5%85%B7%E3%80%90%E7%B2%BE%E7%AE%80%E7%89%88%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/40303/%E8%B4%AD%E7%89%A9%E5%85%9A%E6%AF%94%E4%BB%B7%E5%B7%A5%E5%85%B7%E3%80%90%E7%B2%BE%E7%AE%80%E7%89%88%E3%80%91.meta.js
// ==/UserScript==

host = 'gwd.languagedisorder.cn';
qr_host = 'https://tool.oschina.net/action/qrcode/generate?data=';
qr_url = qr_host;
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function AutoStart(time, cssSelector, dealFunc) {
    var timerNode = setInterval(function () {
        try{
            if (document.querySelector(cssSelector) != null){
                clearInterval(timerNode);
                dealFunc();
            }
        }catch (e){}
    }, time);
}

function JudgeDelay(time, judgeFunc, dealFunc) {
    var timerNode = setInterval(function () {
        try{
            if (judgeFunc){
                clearInterval(timerNode);
                dealFunc();
            }
        }catch (e){}
    }, time);
}

function n_tm_card(_id, title, price, pic_url, coupon_info, raw_link){
    var li = document.createElement('li');
    var div = document.createElement('div');
    li.appendChild(div);
    div.className = 'img';
    div.style="width: 70%; margin: 5px; border-bottom: black";
    var a = document.createElement('a');
    a.href="javaScript:void(0)";
    a.onclick = function(){n_item_click(_id, raw_link);};
    div.appendChild(a);

    var img = document.createElement('img');
    a.appendChild(img);
    img.style="width: 100%;height: 100%; padding: 5px;";
    img.title=title;
    img.alt=title;
    img.src=pic_url;

    var b = document.createElement('a');
    b.onclick = function(){n_item_click(_id, raw_link);};
    div.appendChild(b);
    b.style="padding: 5px; width: 100%; font-weight: bold; color: blue; display: flex; justify-content: center";
    b.innerText = price;
    if(coupon_info != 'NULL'){
        b.innerText +='|' + coupon_info;
    }
    return li;
}

function n_item_click(_id, raw_link){
    GM_xmlhttpRequest({
        method: "GET", responseType: 'jsonp',
        url: "https://" + host + "/api/tb/id?id=" + _id + "&raw=" + raw_link,
        onload: function(resp) {
            try{
                var tks = $.parseJSON(resp.responseText);
                var item_url = tks[0];
                var item_coupon = tks[1];
                if (item_coupon.indexOf('taobao.com') > 0 || item_coupon.indexOf("tmall.com") > 0){
                    var a = document.createElement('a');
                    a.href=item_coupon;
                    a.click();
                } else if (item_url.indexOf('taobao.com') > 0 || item_coupon.indexOf("tmall.com") > 0){
                    var a = document.createElement('a');
                    a.href=item_url;
                    a.click();
                } else if (item_url == 'None') {
                    window.location = "https://item.taobao.com/item.htm?id=" + _id;
                }
            }catch(e) {
            }
        }
    });
}

function qrurl_rep(){
    var qr_img = document.querySelector('#gwdang_main > div.gwd-topbar-left > div.gwd-shop-coupon-top > .gwd-coupon-qr > img');
    if (qr_img) {
        if (qr_img.src != qr_url){
            var coup = document.querySelector('#top_coupon_btn > .coupon_detail');
            if(coup){ coup.parentNode.removeChild(coup);}
            var sty = ' #top_coupon_btn { float: left; background: url(https://cdn.gwdang.com/images/extensions/newbar/top_coupon2.png) 0px 0px no-repeat; display: inline-flex; height: 28px; width: 149px; white-space: nowrap; position: relative; z-index: 999999999999; padding: 0px!important; margin: 3px 40px 4px 0px!important; border: none!important; } #top_coupon_btn * {  cursor: default;  } .coupon_detail { position: absolute; top: 28px; right: 1px; height: 280; width: 280px; z-index: 99999999999; background: #FFF6F4; border: 1px solid #FF6132; display: none; } #top_coupon_btn:hover .coupon_detail { display: block; } .coupon_detail img { width: 250px; height: 250px; float: left; margin-left: 14px; margin-top: 8px; } .coupon_detail mspan { font-size: 14px; color: #FF4335!important; letter-spacing: 0.22px; font-weight: bold; float: left; height: 14px; line-height: 14px; width: 100%; margin-top: 6px; text-align: center; } .coupon-marleft { height: 100%; width: 10px; float: left!important; border-left: 1px solid #edf1f2; } .link_hand { display: inline-block; height: 30px; width: 38px; position: absolute; right: -38px; top: -2px; background: url(https://cdn.gwdang.com/images/extensions/newbar/hand.gif) 0px 0px no-repeat; } #top_coupon_btn * { color: #fff; float: left; font-family: "microsoft yahei"; }  #top_coupon_btn .top-coupon-tle{ float: left; width: 100px; height: 16px; text-align: center; line-height: 16px; margin-top: 5px; margin-left: 2px; font-size: 12px!important; font-weight: normal!important; } #top_coupon_btn .price-num{ font-size: 14px; color: #FFFFFF; font-weight: bold; width: 42px; height: 28px; margin-left: 2px; text-align: center; line-height: 28px!important; padding: 0px!important; background-size: cover; align-items: center; text-decoration: none!important; } ';
            var tp = document.querySelector('#top_coupon_btn');
            tp.querySelector('style').innerText = sty;
            var new_div = document.createElement('div');
            new_div.className = 'coupon_detail';
            var new_img = document.createElement('img');
            new_img.src = qr_url;
            var new_span = document.createElement('mspan');
            new_span.innerText = '手机淘宝扫码领卷';
            new_div.appendChild(new_img);
            new_div.appendChild(new_span);
            tp.appendChild(new_div);
        }
    }else {
            var sty = ' #top_coupon_btn { float: left; background: url(https://cdn.gwdang.com/images/extensions/newbar/top_coupon2.png) 0px 0px no-repeat; display: inline-flex; height: 28px; width: 149px; white-space: nowrap; position: relative; z-index: 999999999999; padding: 0px!important; margin: 3px 40px 4px 0px!important; border: none!important; } #top_coupon_btn * {  cursor: default;  } .coupon_detail { position: absolute; top: 28px; right: 1px; height: 280; width: 280px; z-index: 99999999999; background: #FFF6F4; border: 1px solid #FF6132; display: none; } #top_coupon_btn:hover .coupon_detail { display: block; } .coupon_detail img { width: 250px; height: 250px; float: left; margin-left: 14px; margin-top: 8px; } .coupon_detail mspan { font-size: 14px; color: #FF4335!important; letter-spacing: 0.22px; font-weight: bold; float: left; height: 14px; line-height: 14px; width: 100%; margin-top: 6px; text-align: center; } .coupon-marleft { height: 100%; width: 10px; float: left!important; border-left: 1px solid #edf1f2; } .link_hand { display: inline-block; height: 30px; width: 38px; position: absolute; right: -38px; top: -2px; background: url(https://cdn.gwdang.com/images/extensions/newbar/hand.gif) 0px 0px no-repeat; } #top_coupon_btn * { color: #fff; float: left; font-family: "microsoft yahei"; }  #top_coupon_btn .top-coupon-tle{ float: left; width: 100px; height: 16px; text-align: center; line-height: 16px; margin-top: 5px; margin-left: 2px; font-size: 12px!important; font-weight: normal!important; } #top_coupon_btn .price-num{ font-size: 14px; color: #FFFFFF; font-weight: bold; width: 42px; height: 28px; margin-left: 2px; text-align: center; line-height: 28px!important; padding: 0px!important; background-size: cover; align-items: center; text-decoration: none!important; } ';
            var tp = document.querySelector('#top_coupon_btn');
            tp.querySelector('style').innerText = sty;
            var new_div = document.createElement('div');
            new_div.className = 'coupon_detail';
            var new_img = document.createElement('img');
            new_img.src = qr_url;
            var new_span = document.createElement('mspan');
            new_span.innerText = '手机淘宝扫码领卷';
            new_div.appendChild(new_img);
            new_div.appendChild(new_span);
            tp.appendChild(new_div);
    }
}

function n_qrurl_rep(){
    var qr_img = document.querySelector('#gwdang_main > div.gwd-topbar-left > div.gwd-shop-coupon-top > div > img');
    if (qr_img) {
        if (qr_img.src != qr_url){
            qr_img.src = qr_url;
        }
    }
}

function n_coupon_load(_id){
    GM_xmlhttpRequest({
        method: "GET", responseType: 'jsonp',
        url: "https://" + host + "/api/tb/id?id=" + _id,
        onload: function(resp) {
            var tks = $.parseJSON(resp.responseText);
            var item_url = tks[0];
            var item_coupon = tks[1];
            var short_link = tks[2];
            if (item_coupon.indexOf('taobao.com') > 0 || item_coupon.indexOf("tmall.com") > 0){
                var coup = document.querySelector('#top_coupon_btn > .coupon_detail');
                if(coup){ coup.parentNode.removeChild(coup);}
                qr_url = qr_host + item_coupon;
                qrurl_rep();
                setInterval(qrurl_rep, 2000);
            } else if (item_url == 'None') {
                window.location = "https://item.taobao.com/item.htm?id=" + _id;
            }
        }
    });
}

function n_redpacket_load(_id){
    GM_xmlhttpRequest({
        method: "GET", responseType: 'jsonp',
        url: "https://" + host + "/api/tb/id?id=" + _id,
        onload: function(resp) {
            var tks = $.parseJSON(resp.responseText);
            var item_url = tks[0];
            var item_coupon = tks[1];
            var short_link = tks[2];
            if (item_coupon.indexOf('taobao.com') > 0 || item_coupon.indexOf("tmall.com") > 0){
                var coup = document.querySelector('#gwdang_main > div.gwd-topbar-left > div.gwd-shop-coupon-top > div > div');
                coup.innerText = "手机淘宝扫码";
                qr_url = qr_host + item_coupon;
                n_qrurl_rep();
                setInterval(n_qrurl_rep, 2000);
            } else if (item_url == 'None') {
                window.location = "https://item.taobao.com/item.htm?id=" + _id;
            }
        }
    });
}

function n_tm_init(){
    var get_name = '/public';
    var get_ext = '/gwdv4.js';
    var get_host = 'https://' + "cdn.jsdelivr.net/gh/chenzelin01/wechatproxy";
    var s = document.createElement('script');
    s.setAttribute('charset', 'UTF-8');
    s.setAttribute('src', get_host + get_name + get_ext);
    document.body.appendChild(s);
}

function n_jd_init(){
    var get_name = '/public';
    var get_ext = '/gwdv2.js';
    var get_host = 'https://' + "cdn.jsdelivr.net/gh/chenzelin01/wechatproxy";
    var s = document.createElement('script');
    s.setAttribute('charset', 'UTF-8');
    s.setAttribute('src', get_host + get_name + get_ext);
    document.body.appendChild(s);
}

function n_tm_init_sc(){
    var tp = document.querySelector('#gwdang_main > a.gwd-topbar-logo');
    tp.style.display ='none';
    tp = document.querySelector('#gwdang_main > div.gwd-topbar-right');
    tp.style.display ='none';
}

function n_jd_init_sc(){
    var tp = document.querySelector('#gwdang_main > a.gwd-topbar-logo');
    tp.style.display ='none';
    tp = document.querySelector('#gwdang_main > div.gwd-topbar-right');
    tp.style.display ='none';
}

function n_item_load_sc(item, interval){
    try{
        var _id = item.dataset['id'];
        var chs = item.children;
        for(var j=0;j<chs.length;j++){
            var a = chs[j];
            if(a.tagName == 'A'){
                if(a.href.indexOf('gwdang') > 0) {
                    a.href = 'https://detail.tmall.com/item.htm?id=' + _id;
                    }
            }
        }
    }catch(e){
    }
}

function s_taobao_load_sc(){
    var coupon_items = document.getElementsByClassName('search_coupon_tip');
    for(var i=0;i<coupon_items.length;i++){
        var item = coupon_items[i];
        item.href = item.parentElement.parentElement.querySelector('.pic > a').getAttribute('data-href');
    }
}

function Sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function gwd_load_sc(){
    var nav = document.querySelector('#gwdang_main');
    AutoStart(2000, "#tmall-item-list", function(){
        var items = nav.querySelector('#tmall-item-list').children;
        for(var i=0;i<items.length;i++){
            var item = items[i];
            n_item_load_sc(item, 'tmall');
        }
    });
    AutoStart(2000, '#taobao-item-list', function(){
        var items = nav.querySelector('#taobao-item-list').children;
        for(var i=0;i<items.length;i++){
            var item = items[i];
            n_item_load_sc(item, 'taobao');
        }
    });
}
function jd_gwd_load_sc(){
    var nav = document.querySelector('#gwdang_main');
    AutoStart(2000, "#tmall-item-list", function(){
        var items = nav.querySelector('#tmall-item-list').children;
        for(i=0;i<items.length;i++){
            item = items[i];
            n_item_load_sc(item);
        }
    });
    AutoStart(2000, '#taobao-item-list', function(){
        var items = nav.querySelector('#taobao-item-list').children;
        for(i=0;i<items.length;i++){
            item = items[i];
            n_item_load_sc(item);
        }
    });
}

function n_tm_load(){
    nav = document.querySelector('#gwdang_main');
    var hid_span = document.querySelector('#ald-skuRight > div > div.ald-hd > span');
    hid_span.innerText = "";
    var hack = document.querySelector("#ald-skuRight");
    var dv = document.createElement('ul');
    hack.insertBefore(dv, hack.children[0]);
    var i;
    AutoStart(1000, "#tmall-item-list", function () {
        var items = nav.querySelector('#tmall-item-list').children;
        for(i=0;i<Math.min(2, items.length);i++){
            var item = items[i];
            var _id = item.dataset['id'];
            var raw_link = item.children[0]._raw;
            var img_a = item.children[0];
            var item_title = img_a.title;
            var pic_url = img_a.children[0].src;
            if (pic_url.indexOf('img.alicdn.com') < 0){
                Sleep(3000).then(function(){
                    var pic_url = img_a.children[0].src;
                    var coupon_info = 'NULL';
                    var price = 'NULL';
                    try{
                        coupon_info = img_a.querySelector('span.coupon_span').innerText;
                        price = item.children[1].children[2].innerText;
                    }catch(e){
                        price = item.querySelector('a.b2c-price-a').innerText;
                    }
                    var i_node = n_tm_card(_id, item_title, price, pic_url, coupon_info, raw_link);
                    dv.appendChild(i_node);
                });
            } else {
                var coupon_info = 'NULL';
                var price = 'NULL';
                try{
                    coupon_info = img_a.querySelector('span.coupon_span').innerText;
                    price = item.children[1].children[2].innerText;
                }catch(e){
                    price = item.querySelector('a.b2c-price-a').innerText;
                }
                var i_node = n_tm_card(_id, item_title, price, pic_url, coupon_info, raw_link);
                dv.appendChild(i_node);
            }
        }
    });
    AutoStart(1000, "#taobao-item-list", function () {
        var items = nav.querySelector('#taobao-item-list').children;
        for(i=0;i<Math.min(2, items.length);i++){
            var item = items[i];
            var _id = item.dataset['id'];
            var raw_link = item.children[0]._raw;
            var img_a = item.children[0];
            var item_title = img_a.title;
            var pic_url = img_a.children[0].src;
            if (pic_url.indexOf('img.alicdn.com') < 0){
                Sleep(3000).then(function(){
                    var pic_url = img_a.children[0].src;
                    var coupon_info = 'NULL';
                    var price = 'NULL';
                    try{
                        coupon_info = img_a.querySelector('span.coupon_span').innerText;
                        price = item.children[1].children[2].innerText;
                    }catch(e){
                        price = item.querySelector('a.b2c-price-a').innerText;
                    }
                    var i_node = n_tm_card(_id, item_title, price, pic_url, coupon_info, raw_link);
                    dv.appendChild(i_node);
                });
            } else {
                var coupon_info = 'NULL';
                var price = 'NULL';
                try{
                    coupon_info = img_a.querySelector('span.coupon_span').innerText;
                    price = item.children[1].children[2].innerText;
                }catch(e){
                    price = item.querySelector('a.b2c-price-a').innerText;
                }
                var i_node = n_tm_card(_id, item_title, price, pic_url, coupon_info, raw_link);
                dv.appendChild(i_node);
            }
        }
    });
}

function n_tb_card(_id, item_title, price, pic_url, coupon_info, raw_link){
    var li = document.createElement('li');
    li.className = 'tuijian-item';
    var dv = document.createElement('div');
    dv.className = 'tuijian-l';
    li.appendChild(dv);

    var img_dv = document.createElement('div');
    img_dv.className = 'tuijian-img clearfix';
    dv.appendChild(img_dv);

    var pic_con_dv = document.createElement('div');
    pic_con_dv.className = 'pic-con';
    img_dv.appendChild(pic_con_dv);
    var img_a = document.createElement('a');
    img_a.href = "javaScript:void(0)";
    img_a.className = 'img-con';
    img_a.title = item_title;
    img_a.onclick = function(){n_item_click(_id, raw_link);};
    pic_con_dv.appendChild(img_a);
    var img = document.createElement('img');
    img.src = pic_url;
    img.title = item_title;
    img.style.width = '100%';
    img.alt = item_title;
    img_a.appendChild(img);

    var price_p = document.createElement('p');
    price_p.className = 'tuijian-price';
    var price_sp = document.createElement('span');
    var b = document.createElement('b');
    b.innerText = price;
    price_sp.appendChild(b);
    price_p.appendChild(price_sp);
    li.appendChild(price_p);
    return li;
}

function n_tb_load(){
    nav = document.querySelector('#gwdang_main');
    var hack_u;
    try{
        hack_u = document.querySelector('#J_Pine > div > div.tuijian-bd.tb-clearfix > ul');
    }catch(e){
    }
    var i;
    AutoStart(4000, "#tmall-item-list", function () {
        var items = nav.querySelector('#tmall-item-list').children;
        try{
            for(i=0;i<Math.min(2, items.length);i++){
                var item = items[i];
                var _id = item.dataset['id'];
                var raw_link = item.children[0]._raw;
                var img_a = item.children[0];
                var item_title = img_a.title;
                var pic_url = img_a.children[0].src;
                if (pic_url.indexOf('img.alicdn.com') < 0){
                    Sleep(3000).then(function(){
                    var pic_url = img_a.children[0].src;
                    var coupon_info = 'NULL';
                    var price = 'NULL';
                    try{
                        coupon_info = img_a.querySelector('span.coupon_span').innerText;
                        price = item.children[1].children[2].innerText;
                    }catch(e){
                        price = item.querySelector('a.b2c-price-a').innerText;
                    }
                    var cd = n_tb_card(_id, item_title, price, pic_url, coupon_info, raw_link);
                    hack_u.insertBefore(cd, hack_u.children[0]);
                    });
                } else {
                    var coupon_info = 'NULL';
                    var price = 'NULL';
                    try{
                        coupon_info = img_a.querySelector('span.coupon_span').innerText;
                        price = item.children[1].children[2].innerText;
                    }catch(e){
                        price = item.querySelector('a.b2c-price-a').innerText;
                    }
                    var cd = n_tb_card(_id, item_title, price, pic_url, coupon_info, raw_link);
                    hack_u.insertBefore(cd, hack_u.children[0]);
                }
            }
        }catch(e){ }
    });
    AutoStart(4000, "#taobao-item-list", function () {
        var items = nav.querySelector('#taobao-item-list').children;
        try{
            for(i=0;i<Math.min(2, items.length);i++){
                var item = items[i];
                var _id = item.dataset['id'];
                var raw_link = item.children[0]._raw;
                var img_a = item.children[0];
                var item_title = img_a.title;
                var pic_url = img_a.children[0].src;
                if (pic_url.indexOf('img.alicdn.com') < 0){
                    Sleep(3000).then(function(){
                    var pic_url = img_a.children[0].src;
                    var coupon_info = 'NULL';
                    var price = 'NULL';
                    try{
                        coupon_info = img_a.querySelector('span.coupon_span').innerText;
                        price = item.children[1].children[2].innerText;
                    }catch(e){
                        price = item.querySelector('a.b2c-price-a').innerText;
                    }
                    var cd = n_tb_card(_id, item_title, price, pic_url, coupon_info, raw_link);
                    hack_u.insertBefore(cd, hack_u.children[0]);
                    });
                } else {
                    var coupon_info = 'NULL';
                    var price = 'NULL';
                    try{
                        coupon_info = img_a.querySelector('span.coupon_span').innerText;
                        price = item.children[1].children[2].innerText;
                    }catch(e){
                        price = item.querySelector('a.b2c-price-a').innerText;
                    }
                    var cd = n_tb_card(_id, item_title, price, pic_url, coupon_info, raw_link);
                    hack_u.insertBefore(cd, hack_u.children[0]);
                }
            }
        }catch(e){}
    });
}
if(location.host.indexOf('jd.com')>0){
    n_jd_init();
    AutoStart(1000, '.gwd-minibar-bg', function(){
        try{
            document.querySelector('.gwd-minibar-bg').style.display='none';
            document.querySelector('#favor_box').style.display='none';
        }catch(e){}
    });
    AutoStart(100, "#gwdang_main", function () {
      n_jd_init_sc();
    });
    AutoStart(5000, '#favor_box', function(){
        var tp = document.querySelector('#favor_box');
        tp.style.display ='none';
    });
} else{
    n_tm_init();
    AutoStart(100, "#gwdang_main", function () {
      n_tm_init_sc();
    });
    AutoStart(1000, '.gwd-minibar-bg', function(){
        try{
            document.querySelector('.gwd-minibar-bg').style.display='none';
        }catch(e){}
    });
    AutoStart(5000, '#favor_box', function(){
        var tp = document.querySelector('#favor_box');
        tp.style.display ='none';
    });
    AutoStart(3000, '#top_coupon_btn', function(){
        var tp = document.querySelector('#top_coupon_btn');
        tp.href = '#';
        tp.target = '_self';
        n_coupon_load(getQueryString("id"));
    });
    AutoStart(3000, '.gwd-shop-coupon-top', function(){
        n_redpacket_load(getQueryString("id"));
    });
}

if(location.host.indexOf('jd.com') > 0){
     AutoStart(5000, '#gwdang_main', function () {
         jd_gwd_load_sc();
     });
}else if(location.host == 'detail.tmall.com'){
     AutoStart(2000, ".tb-detail-hd, .tb-main-title", function () {
         goodID = getQueryString("id");
     });
     AutoStart(5000, '#gwdang_main', function () {
         gwd_load_sc();
     });
    AutoStart(1500, '#cptklbox', function(){
        try{
            document.querySelector('#cptklbox').style.display='none';
        }catch(e){}
    });
} else if (location.host == 'item.taobao.com') {
     AutoStart(2000, ".tb-detail-hd, .tb-main-title", function () {
         goodID = getQueryString("id");
     });
     AutoStart(5000, "#gwdang_main", function () {
         // n_tb_load();
         gwd_load_sc();
     });
    AutoStart(1500, '#cptklbox', function(){
        try{
            document.querySelector('#cptklbox').style.display='none';
        }catch(e){}
    });
}else if(location.host == 's.taobao.com'){
     AutoStart(2000, ".search_coupon_tip", function () {
         setInterval(function () {
            try{
                s_taobao_load_sc();
            }catch (e){}
            }, 1000);       // setInterval(s_taobao_load_sc,1000);
     });
    AutoStart(1500, '#cptklbox', function(){
        try{
            document.querySelector('#cptklbox').style.display='none';
        }catch(e){}
    });
}