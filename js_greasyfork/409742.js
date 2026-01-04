// ==UserScript==
// @name         积分
// @namespace    943341679@qq.com
// @version      0.3
// @description  jh积分
// @author       You
// @match        http://jf.ccb.com/exchangecenter/account/viewscore.jhtml
// @match        http://jf.ccb.com/rewardcenter/orderConfirm.jhtml*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/409742/%E7%A7%AF%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/409742/%E7%A7%AF%E5%88%86.meta.js
// ==/UserScript==


























































































(function() {
    'use strict';
    // *://jf.ccb.com/rewardcenter/rdProductdetail.jhtml?productId=*
    let productUrl = 'http://jf.ccb.com/rewardcenter/orderConfirm.jhtml?rewardId=AP012202008051001823&productId=1000000000133763&quantity=1&productSkuId=&isSkuProd=0'
    let pathname = location.pathname
    if(pathname.match('/exchangecenter/account/viewscore.jhtml')){
        // 积分
        // alert('积分')
        let score = Number(document.querySelector('#score_0100000000').innerText.replace(',',''))
        let count = score / 54000
        for(let i=0;i<count-1;i++){
            GM_openInTab(productUrl,{'active':true})
        }

    }else if(pathname.match('/rewardcenter/rdProductdetail.jhtml')){
        // 卡片
        //alert('卡片')
        //document.querySelector('#insertActivityProductOrder').click()
    }else if(pathname.match('/rewardcenter/orderConfirm.jhtml')){
        document.querySelector('#submitOrder').click()
    }
})();