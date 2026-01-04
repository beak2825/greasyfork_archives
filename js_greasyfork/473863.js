// ==UserScript==
// @name         京东vc定制中心手机号解密
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description 京东vc定制中心手机号解密1
// @author       qq806350554
// @run-at       document-end
// @match        https://cdz2m.jd.com/sub_procenter/*
// @grant        GM_xmlhttpRequest
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/473863/%E4%BA%AC%E4%B8%9Cvc%E5%AE%9A%E5%88%B6%E4%B8%AD%E5%BF%83%E6%89%8B%E6%9C%BA%E5%8F%B7%E8%A7%A3%E5%AF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/473863/%E4%BA%AC%E4%B8%9Cvc%E5%AE%9A%E5%88%B6%E4%B8%AD%E5%BF%83%E6%89%8B%E6%9C%BA%E5%8F%B7%E8%A7%A3%E5%AF%86.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $(".OrderDetail-m__valueBox-2taGG").eq(3).append(`<button type="button" class="ant-btn ant-btn-sm"><span id='jiemi'>解 密</span></button>`)
        function  lj_vc(coId,re){
var haoma='获取失败'
var address='获取失败'
var customerName='获取失败'
//    new Promise((resolve, reject) => {
$.ajaxSettings.async=false
            $.ajax({
                url:"https://cdz2m.jd.com/sub_procenter/prodcenter/customoOrderQuery/getCustomOrdersDetail",
                data:"[{\"coIds\":["+coId+"],\"source\":\"2\",\"localeStr\":\"zh\"}]",
                type:"POST",
                success: function(data){
                    var res = data;

                    var shuju=data
                    console.log('shuju')
                    console.log(shuju)
                    re.data.result.phone=shuju.data.result['succList'][0].phone
                    //这是真实地址                         re.data.result.address=shuju.data.result['succList'][0].address
                                     re.data.result.customerName=shuju.data.result['succList'][0].customerName
                    console.log(haoma)
                }})

            return re

        }

    ///////////
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, uri, async, user, pass) {
        console.log(arguments[1])
        if (arguments[1] == '/sub_procenter/prodcenter/customoOrderQuery/getCustomOrderDetail') {
            const xhr = this;
            const getter = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response').get;
            Object.defineProperty(xhr, 'responseText', {
                get:  () => {
                    var result =eval('('+getter.call(xhr)+')')
                    var ff=result.data.result.coId
                    let haoma= lj_vc(ff,result)
                    console.log(result)
                    return haoma
                    //  console.log(result.jsonList[0].profit/result.jsonList[0].income)
                    //这里可以修改result

                }
            }
                                 );
        }
        open.call(this, method, uri, async, user, pass);
    }

    // Your code here...
})();