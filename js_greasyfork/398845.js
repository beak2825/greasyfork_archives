// ==UserScript==
// @name         拼多多发货助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Joker
// @match        https://mobile.yangkeduo.com/orders.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398845/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%8F%91%E8%B4%A7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/398845/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%8F%91%E8%B4%A7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var orders = [], page = 1, size = 10, offset="", orderBaseUrl = 'https://mobile.yangkeduo.com/', token = '', scrollTop = 0;
    //入口
    init();

    function loadJS( url, callback ){
        return new Promise((resolve, reject) => {
          var script = document.createElement('script'),
            fn = callback || function(){};
            script.type = 'text/javascript';
            //IE
            if(script.readyState){
                script.onreadystatechange = function(){
                    if( script.readyState == 'loaded' || script.readyState == 'complete' ){
                        script.onreadystatechange = null;
                        resolve();
                    }
                };
            }else{
                //其他浏览器
                script.onload = function(){
                    resolve();
                };
            }
            script.src = url;
            document.getElementsByTagName('head')[0].appendChild(script);
        })
    }

    async function init() {
        //引用jquery
        const $ = await loadJS('https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js');
        // 初始化【查看物流功能】
        initLookLogisticsHelp();
    }
    //初始化物流助手工具
    function initLookLogisticsHelp() {
        offset = '';
        // 获取第一页订单
        getOrders().then(res => {
            orders = orders.concat(res);
            //初始化事件
            addEvents();
            //设置 复制物流功能
            useSelect();
        });
        window.onscroll = throttle(function (e) {
            var top = document.documentElement.scrollTop;
            if (top > scrollTop) {
                //添加点击事件
                addEvents();
            }
            top = scrollTop;
        }, 500)
    }
    //给订单号 增加复制 功能
    function useSelect() {
      var doms = document.querySelectorAll('._2B-0MrIp');
      var names = document.querySelectorAll('._1Tk08e7g');
      var phones = document.querySelectorAll('._3jo05ow3');
        [...doms, ...names, ...phones].forEach(item => {
          item.style.userSelect = 'text';
        })
    }

    function addEvents() {
        var doms = document.querySelectorAll('#base-list3 .react-base-list>div');
        doms.forEach(async (item) => {
            let a = document.createElement('a');
            let parent = item.querySelector('._2XxabK2M');
            parent.style = 'position: relative;'
            a.href = 'javascript:;';
            a.innerText = '查看物流';
            a.style = 'background: #333 !important;color: #fff !important;'
            var childs = parent.children;
            [...childs].forEach(_item => {
                parent.removeChild(_item)
            })
            parent.appendChild(a);
            var index = item.getAttribute('data')
            // 当前下标大于 订单数
            while(index >= orders.length) {
                // 设置下一页的offset，用于获取下一页订单
                offset = orders[orders.length - 1].order_sn;
                // 获取下一页订单
                var _tmp = await getOrders();
                // 合并订单
                orders = orders.concat(_tmp);
            }
            // 订单详情页url
            var orderUrl = orderBaseUrl + orders[index].order_link_url;
            if (!orders[index]._isComplete) {
                // 获取订单信息
                getOrder(orderUrl).then(res => {
                    let html = res;
                    let trackS = html.search(/"trackingNumber":"/);
                    let trackE = html.search(/","isCaptain"/);
                    let track = html.substring(trackS + '"trackingNumber":"'.length, trackE); //运单信息

                    trackS = html.search(/"shippingName":"/);
                    trackE = html.search(/"},"grabTicket"/);
                    let shopName = html.substring(trackS + '"shippingName":"'.length, trackE); //物流公司

                    trackS = html.search(/<span class="_1Tk08e7g">/);
                    trackE = html.search(/<\/span><span class="_3jo05ow3">/);
                    let userName = html.substring(trackS + '<span class="_1Tk08e7g">'.length, trackE); //收货人

                    trackS = trackE;
                    trackE = html.search(/<\/span><\/p><div class="GnxRatsO">/);
                    let phone = html.substring(trackS + '<\/span><span class="_3jo05ow3">'.length, trackE); // 收获人手机号

                    //插入订单物流信息
                    let parent = a.parentNode.parentNode;
                    let span = document.createElement('span');
                    span.innerText = `${track}-${shopName}-${userName}-${phone}`;
                    span.style = `width: 100%;display: block;height: 100%;line-height: 40px;user-select: text;`
                    parent.appendChild(span);
                    orders[index]._isComplete = true;
                    console.log(`%c物流信息：${track}--${shopName}--${userName}--${phone}`, 'background:#19be6b;color:#fff;font-size: 28px');
                })
            }
            a.onclick = function () {
              window.open(orderUrl,'_blank','width=500,height=1200,menubar=no,toolbar=no, status=no,scrollbars=yes')
            }
            //window.open(orderBaseUrl + orders[index].order_link_url,'_blank','width=500,height=1200,menubar=no,toolbar=no, status=no,scrollbars=yes')
        });
    }

    // 获取订单物流信息
    function getOrder(url) {
      return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            headers: {
                'AccessToken': token,
            },
            responseType: 'text',
            type: 'GET',
            success(res) {
                resolve(res);
            },
            error() {
                reject();
            }
        })
      })
    }

    // 获取商品列表
    function getOrders() {
        token = localStorage.getItem('AccessToken');
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'https://mobile.yangkeduo.com/proxy/api/api/aristotle/order_list?pdduid=7301901742615&is_back=1',
                headers: {
                    'AccessToken': token,
                },
                data: {"timeout":1300,"type":"unreceived","page":page,"pay_channel_list":["9","30","31","35","38","52","322","-1"],"origin_host_name":"mobile.yangkeduo.com","size":size,"offset":offset},
                dataType: 'JSON',
                type: 'POST',
                success(res) {
                    if (res.orders && res.orders.length > 0) resolve(res.orders);
                },
                error() {
                    console.log('商品列表获取失败')
                    reject()
                }
            })
        });
    }

    /**
     * 函数节流
     * @param {Function} func 需要节流的函数
     * @param {Number} wait 时间
     * @param {Object} options 配置参数
     */
    function throttle(func, wait, options) {
        let timeout, context, args;
        let previous = 0;
        if (!options) options = {};

        let later = function() {
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            func.apply(context, args);
            if (!timeout) context = args = null;
        };

        let throttled = function() {
            let now = new Date().getTime();
            if (!previous && options.leading === false) previous = now;
            let remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
        };
        return throttled;
    }
})();