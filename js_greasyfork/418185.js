// ==UserScript==
// @name         京东页面添加按钮
// @namespace    blog.gobyte.cn
// @version      0.1
// @description  给京东页面添加一些按钮，实现正常情况下无法实现的功能。例如直达订单；返利查询；
// @author       misterchou@qq.com
// @match        https://item.m.jd.com/*
// @match        https://item.jd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418185/%E4%BA%AC%E4%B8%9C%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/418185/%E4%BA%AC%E4%B8%9C%E9%A1%B5%E9%9D%A2%E6%B7%BB%E5%8A%A0%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //移动端
    if (window.location.host.indexOf("item.m.jd.com") > -1) {
        //父级元素
        let parentElement = document.querySelectorAll(".de_span.btn_group .de_row")[0];

        // 开始创建按钮 - start
        let div = document.createElement("div");
        div.id = "confirmOrder1";
        div.className = "btn";
        let span = document.createElement("span");
        span.innerText = "提交1";
        span.className = "text";
        div.appendChild(span);
        // 按钮创建完毕 - end

        // 按钮绑定给父元素
        parentElement.appendChild(div);
        // 给按钮绑定事件
        div.addEventListener("click", function () {
            window.goToOrder();
        });
    }

    //PC端
    if (window.location.host.indexOf("item.jd.com") > -1) {
        //父级元素
        let parentElement = document.querySelector("#choose-btns");
        // 创建按钮
        let child = document.createElement("a");
        child.className = "btn-special1 btn-lg";
        child.innerText = '提交'
        //         child.onclick = window.goToOrder();
        // 按钮绑定给父元素
        parentElement.appendChild(child);
        // 给按钮绑定事件
        child.addEventListener("click", function () {
            window.goToOrder();
        });

        //创建返利按钮
        let fanLi = document.createElement("a");
        fanLi.className = "btn-special1 btn-lg";
        fanLi.innerText = '查返利'
        // 按钮绑定给父元素
        parentElement.appendChild(fanLi);
        // 给按钮绑定事件
        fanLi.addEventListener("click", function () {
            window.goToFanli();
        });
    }


    //跳转到订单；tyep：有2中；1是普通提交订单；2是微信提交订单页面；默认为1；
    window.goToOrder = (type) => {
        let orderUrl;
        let id = window.getId();
        switch (type) {
            case 2:
                orderUrl = `https://wq.jd.com/deal/confirmorder/main?sceneval=2&bid=&wdref=https%3A%2F%2Fitem.m.jd.com%2Fproduct%2F${id}.html%3Fjxsid%3D16041647512054085196&scene=jd&isCanEdit=1&EncryptInfo=&Token=&commlist=${id},,1,${id},1,0,0&locationid=17-1441-1447&type=0&lg=0&supm=0`;
                window.location.href = orderUrl;
                alert("2");
                break;
            default:
                orderUrl = `https://wqdeal.jd.com/deal/confirmorder/main?commlist=${id},,1,,1,0,0`;
                window.location.href = orderUrl;
                alert("moren");
                break;
        }
    };

    //跳转到返利
    window.goToFanli = (type) => {
        let href = window.location.href;
        let fanliUrl = `https://union.jd.com/proManager/index?pageNo=1&keywords=${href}`;
        window.open(fanliUrl,'target','');
    };
    //截取网址内的商品ID
    window.getId = () => {
        //目前发现链接有多种；最常见的是id.html，如：https://item.m.jd.com/product/100016046842.html
        //还有抢购的链接：https://item.m.jd.com/ware/view.action?wareId=100016046842&cu=true
        //因此提取sku之前应该判断哪种情况
        if( window.location.href.indexOf("item.m.jd.com/product/") > -1 ){
            //截取规则：.html后，/前
            let url2 = window.location.href.split(".html")[0];
            let newUrlArr = url2.split('/');
            return newUrlArr[newUrlArr.length - 1];
        }else if ( window.location.href.indexOf("item.m.jd.com/ware/view.action?wareId=") > -1 ){
            return window.location.href.split('wareId=')[1].split("&")[0];
        }
    }

    //提交订单1，普通提交
    //事件绑定
    var tjdd1 = document.querySelector("#tjdd1");
    //获取当前sku
    //拼接提交订单页面的URL
    //打开该URL
})();