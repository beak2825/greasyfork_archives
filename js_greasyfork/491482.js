// ==UserScript==
// @name         挂刀网脚本
// @namespace    http://tampermonkey.net/
// @version      2024-04-01
// @description  增加手续费计算及更改页面显示数量
// @author       Cliencer Goge
// @match        https://hangknife.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hangknife.com
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491482/%E6%8C%82%E5%88%80%E7%BD%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/491482/%E6%8C%82%E5%88%80%E7%BD%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function(originalOpen) {
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._url = url; // 保存URL到XHR实例上
        return originalOpen.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);

(function(originalSend) {
    let originalResponseText = ""
    let modifiedResponseText = ""
    XMLHttpRequest.prototype.send = function(body) {

        if (this._url.includes("hangknife.com/api/steam/queryItemList")) {
            let saves = readstorage()
            // 修改请求体
            if (typeof body === "string") {
                let data = JSON.parse(body);
                if(saves.pageitems>100){saves.pageitems=100;}
                if(saves.pageitems<5){saves.pageitems=5;}
                data.limit=saves.pageitems //每次请求物品数量

                body = JSON.stringify(data);

            }
        }



        this.addEventListener("load", function() {
            // 当请求完成时，可以在这里读取响应

            if(this._url.includes("hangknife.com/api/steam/queryItemList")){
                let saves = readstorage()
                originalResponseText = this.responseText
                // 劫持 responseText 的 getter 因为默认的情况下该属性是只读的
                Object.defineProperty(this, "responseText", {
                    get: function() {
                        try {
                            let data = JSON.parse(originalResponseText)

                            for(let i in data.data){
                                let minPlatformPrice = 999999999
                                for(let key in saves.handling_fee){
                                    let price = data.data[i][key+"Price"]
                                    if(price){

                                        price *= 1 + saves.handling_fee[key]/100
                                        //price = price.toFixed(2)
                                        data.data[i][key+"Price"] = price
                                        if(price<minPlatformPrice){minPlatformPrice=price}
                                    }
                                }
                                data.data[i].minPlatformPrice=minPlatformPrice
                                data.data[i].minPrice=minPlatformPrice
                                data.data[i].safeBuyerPriceDisCount=minPlatformPrice/data.data[i].steamSafeBuyerPrice
                                data.data[i].buyerPriceDisCount=minPlatformPrice/data.data[i].steamBuyerPrice
                                data.data[i].lowestDisCount=minPlatformPrice/data.data[i].steamSellerPrice
                            }

                            modifiedResponseText = JSON.stringify(data)

                            return modifiedResponseText;// 返回修改后的JSON字符串
                        } catch (e) {
                            console.log(e)
                            // 如果响应不是JSON，或者解析失败，返回原始响应
                            return originalResponseText;
                        }
                    }
                });

            }
        });
        return originalSend.call(this, body);
    };
})(XMLHttpRequest.prototype.send);

(function() {
    'use strict';
    // document.querySelector('#app').__vue__
    // const userInfodata={data:{country:'芜湖~',emailInfo:{adress:'666@qq.com',validated:true},name:'666',steamId:'666',wallet:{balance:666,currency:666,hasWallet:true}}}
    var saves=readstorage()


    var Vue
    // 使用MutationObserver等待特定元素加载
    var observer = new MutationObserver((mutations, obs) => {
        const vueRoot = document.querySelector('#app'); // 替换YOUR_VUE_ROOT_ELEMENT_SELECTOR为目标Vue元素的选择器
        if (vueRoot) {
            obs.disconnect();
            // 确保Vue实例已经加载

            waitForVueToLoad(vueRoot);
        }
    });

    observer.observe(document, {childList: true, subtree: true});





    function main(){
        /*假登录 没什么叼用
        localStorage.setItem('refresh_token', 'urlRefreshToken')//假Token
        Vue.$store.commit('setUserInfo',userInfodata.data)
        Vue.$store.commit('setLogin',true)

        const router = Vue.$router;

        if (router) {
            // 移除现有的路由守卫
            // 注意：Vue Router API 并不直接支持移除已注册的守卫
            // 这里只是一个概念性的示例
            router.beforeHooks = []; // 这行代码在实际中并不会工作

            // 添加新的路由守卫
            router.beforeEach((to, from, next) => {
                // 新的守卫逻辑
                console.log("Navigating to:", to.path);
                next(); // 允许所有路由
            });
        }
       */

        console.log(Vue)






        var observer = new MutationObserver((mutations, obs) => {
            let tablehead = document.querySelector('thead.has-gutter')
            let tableheadplug = tablehead.getElementsByClassName('tableheadplug')
            let tableend = document.querySelector('div.el-pagination')
            if (tablehead && tableend && tableheadplug.length==0) {
                console.log('插入表头表尾')
                addplug(tablehead,tableend)
                obs.disconnect();
            }
        });
        observer.observe(document, {childList: true, subtree: true});


        function addplug(tablethead,tableend){

            var tableheadplug = document.createElement('tr');
            tableheadplug.class="tableheadplug"
            let iputth = document.createElement('th');
            iputth.className = "is-leaf el-table__cell"
            iputth.colspan="1"
            iputth.rowspan="1"
            iputth.innerHTML = `<div class="cell">手续费设置（%）点击查找重新计算</div>`;
            tableheadplug.appendChild(iputth);
            for(let platform in saves.handling_fee) {
                iputth = document.createElement('th');
                iputth.className = "is-leaf el-table__cell"
                iputth.colspan="1"
                iputth.rowspan="1"
                iputth.innerHTML = `
                         <div class = "el-input el-input--small cell">
                              <input type="text" id="${platform}" inputmode="numeric" pattern="\d*(\.\d+)?$"  placeholder="费率%" class="el-input__inner" value="${saves.handling_fee[platform]}">
                         </div>`;
                //iputth.addEventListener('blur', saveonBlur(tableheadplug));

                tableheadplug.appendChild(iputth);

            }
            tablethead.insertBefore(tableheadplug,tablethead.firstElementChild)




            var tableendplug = document.createElement('span');
            tableendplug.className='el-pagination__jump'
            tableendplug.innerHTML = `
            每页显示
            <div  class="el-input el-pagination__editor is-in-pagination"><input id='pageitems' type="number" autocomplete="off" min="1" max="100" class="el-input__inner" value="${saves.pageitems}">
            </div>
            个
            `
            tableend.insertBefore(tableendplug,tableend.firstElementChild)




            setTimeout(function() {
                for(let platform in saves.handling_fee) {
                    tableheadplug.querySelector(`#${platform}`).addEventListener('blur', saveonBlur);
                }
                tableendplug.querySelector(`#pageitems`).addEventListener('blur', saveonBlur);
            }, 0); //等待DOM加载，设置为0即可



            function saveonBlur() {
                if(tableheadplug){
                    for(let platform in saves.handling_fee) {
                        let platformfee = tableheadplug.querySelector(`#${platform}`)
                        saves.handling_fee[platform] = parseFloat(platformfee.value) || 0
                    }
                }
                if(tableendplug){
                    saves.pageitems = parseInt(tableendplug.querySelector(`#pageitems`).value) || 10
                    if(saves.pageitems>100){saves.pageitems=100;tableendplug.querySelector(`#pageitems`).value=100}
                    if(saves.pageitems<5){saves.pageitems=5;tableendplug.querySelector(`#pageitems`).value=5}
                }
                //console.log(saves)
                savestorage(saves)
            }

        }

    }





    function waitForVueToLoad(element) {
        if (element.__vue__) {
            // 访问Vue实例的data
            Vue = element.__vue__
            console.log('Vue实例已加载')
            // 你可以在这里进行你想要的操作
            main()
        } else {
            setTimeout(() => waitForVueToLoad(element), 100); // 等待100ms后重试
        }
    }
})();






function readstorage(){
    var saves = GM_getValue('saves')
    if(saves) return saves
    saves = {
        handling_fee:{
            buff:0,
            c5:0,
            skinport:0,
            igxe:0,
            uupin:0,
            v5Item:0,
            halo:3.3,
            bitSkins:2.7,
            waxpeer:9.8,
            dmarket:2.7,
            csMoney:4.2,
        },
        pageitems:10
    }
    return saves
}
function savestorage(saves){
    GM_setValue('saves',saves)
}
