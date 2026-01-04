// ==UserScript==
// @name         快递管家批量更新物流信息
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键更新所有订单的物流信息
// @author       kuyzuli
// @match        https://b.kuaidi100.com/page/expressTracking/SENTFINISH
// @grant        none
// @require https://greasyfork.org/scripts/453166-jquery/code/jquery.js?version=1105525
// @downloadURL https://update.greasyfork.org/scripts/459754/%E5%BF%AB%E9%80%92%E7%AE%A1%E5%AE%B6%E6%89%B9%E9%87%8F%E6%9B%B4%E6%96%B0%E7%89%A9%E6%B5%81%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/459754/%E5%BF%AB%E9%80%92%E7%AE%A1%E5%AE%B6%E6%89%B9%E9%87%8F%E6%9B%B4%E6%96%B0%E7%89%A9%E6%B5%81%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    //var formdata = 'beginrow=1&cargokwd=&com=&comment=&creator=&exceptIds=&exceptSource=%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%AF%84%E4%BB%B6%2C%E5%A4%B4%E6%9D%A1%E6%94%BE%E5%BF%83%E8%B4%AD%E5%AF%84%E4%BB%B6&exceptTabId=&ids=&isMktCust=-1&isprint=-1&issms=0&kuaidiNum=&limit=10000&mallId=&method=findlist&num=-1&orderNums=&originSource=&recProvince=&rssType=&searchReceiver=&searchSender=&serviceType=&subTabId=CHECKWAIT&tabId=&tradecreatedEnd=2023-02-09&tradecreatedStart=2023-02-03&transStatus=';
    // Your code here...
    $('body').append('<div id="plgxwlxx" style="position: fixed;width: 100px;background: #ff9632;right: 200px;bottom: 20px;color: white; line-height: 40px; border-radius: 10px;text-align: center; z-index: 9999; cursor:pointer;">批量更新物流</div>');
    $('#plgxwlxx').click(function(){
        $.post('https://b.kuaidi100.com/maiapi.do',{
            beginrow: 0,
            isMktCust: -1,
            isprint: -1,
            issms: 0,
            limit: 100000,
            method: 'findlist',
            subTabId: 'CHECKWAIT',
            rssType: 'NORSS'
        },function(data){
            data.items.forEach(function(item){
                $.post('https://b.kuaidi100.com/maiapi.do?method=querybyid',{id: item.id,kuaidinum:item.kuaidiNum },function(data){})
            })
        })
    });
})();