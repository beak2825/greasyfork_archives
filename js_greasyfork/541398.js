// ==UserScript==
// @name        拼多多商家批量发布相似商品
// @namespace   Violentmonkey Scripts
// @match       https://mms.pinduoduo.com/goods/goods_list?msfrom=mms_sidenav
// @match       https://mms.pinduoduo.com/goods/goods_list
// @match       https://mms.pinduoduo.com/goods/goods_list?msfrom=mms_sidenav&activeKeyNew=key_2
// @match       https://mms.pinduoduo.com/goods/goods_add/*
// @license     MIT
// @grant       none
// @version     1.0
// @author      hosthui
// @description 批量发布选中商品的相似品
// @downloadURL https://update.greasyfork.org/scripts/541398/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%95%86%E5%AE%B6%E6%89%B9%E9%87%8F%E5%8F%91%E5%B8%83%E7%9B%B8%E4%BC%BC%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/541398/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%95%86%E5%AE%B6%E6%89%B9%E9%87%8F%E5%8F%91%E5%B8%83%E7%9B%B8%E4%BC%BC%E5%95%86%E5%93%81.meta.js
// ==/UserScript==
//脚本定制Q:252770908
//脚本定制Q:252770908


(async function() {
    'use strict';
document.addEventListener('keydown', function(event) {
    if (event.key === '2') {
        var allATagsWithSpecificAttributeValue3 = document.querySelectorAll('label[data-checked="true"]');
        var length = allATagsWithSpecificAttributeValue3.length
        localStorage.setItem('length', JSON.stringify(length));
        var index = 1
        localStorage.setItem('lock', 'false');
        allATagsWithSpecificAttributeValue3.forEach(async function(aTag) {
            var father=aTag.closest('tr')
             var th=father.querySelectorAll('th')
            if(th.length>0){
                localStorage.setItem('length', JSON.stringify(length - 1));
                return;
            }
            var a1=father.querySelectorAll('td')[9].querySelectorAll('a[data-tracking-viewid="new_similar"]')[0]
            a1.click();
            await new Promise(resolve => setTimeout(resolve, 1000))
            var submit=document.querySelectorAll('button[data-tracking-viewid="el_release_similar_pop_ups"]')[0]
            submit.click();
            localStorage.setItem('index', JSON.stringify(index));
            index = index + 1
        })
    }
});
if (window.location.href.includes('/index')) {
    //console.log("1111")
       // window.addEventListener('DOMContentLoaded', async function() {
            await new Promise(resolve => setTimeout(resolve, 30000))
            while (localStorage.getItem('lock') === 'true') {
               console.log('锁被占用，等待中...');
               await new Promise(resolve => setTimeout(resolve, 1000)); // 每隔1秒检查一次锁状态
            }
            // 加锁
            localStorage.setItem('lock', 'true');
            // 从LocalStorage解析参数
            var length = JSON.parse(localStorage.getItem('length'));
            var index = JSON.parse(localStorage.getItem('index'));
            if (factorial(length,index)) {
                var submit2 = document.querySelectorAll('button[id="submit_button"]')[0];
                submit2.click();
                length = length - 1
                index = index - 1
                if(length === 0 || index === 0){
                  localStorage.removeItem('length');
                  localStorage.removeItem('index');
                  localStorage.removeItem('lock');
                }else{
                  localStorage.setItem('length', JSON.stringify(length));
                  localStorage.setItem('index', JSON.stringify(index));
                  localStorage.setItem('lock', 'false');
                  console.log('操作完成，锁已释放');
                }
                await new Promise(resolve => setTimeout(resolve, 10000))
                var verify = document.querySelectorAll('div[data-testid="beast-core-modal-body"]');
                while (true) {
                  await new Promise(resolve => setTimeout(resolve, 1000))
                  console.log(window.location.href);
                  if (window.location.href.includes('/success')){
                      window.close();
                  }
                  if(verify.length > 0){
                    break;
                  }
                  if (window.location.href.includes('/index')){
                    continue;
                  }
                }
             }
       // });
    }
function factorial(n,m) {
    if (n == null || m == null) {
        return false;
    }
    if (n == m) {
        return true;
    }
    n = JSON.parse(localStorage.getItem('length'));
    m = JSON.parse(localStorage.getItem('index'));
    return factorial(n,m);
}
})();