// ==UserScript==
// @name         淘宝自动评价工具
// @description  淘宝买家自动评价工具,测试用
// @namespace    com.uestc.rjw
// @version      0.7
// @match        *https://rate.taobao.com/remarkSeller.jhtml*
// @match        *https://rate.taobao.com/remarkSeller4Mall.htm*
// @match        *https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm*
// @grant        unsafeWindow
// @grant        GM_getTabs
// @grant        GM_openInTab
// @grant        window.close
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/36665/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/36665/%E6%B7%98%E5%AE%9D%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

Date.prototype.format = function(fmt) {
     var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};

var url = window.location.href;
console.log(url);
console.log(GM_getTabs());
if(url.indexOf('https://rate.taobao.com/remarkSeller4Mall.htm') >= 0){
    setInterval(function(){
        window.location.href="about:blank";
        window.close();
        unsafeWindow.close();
    },1000);
}else if(url.indexOf('https://rate.taobao.com/remarkSeller.jhtml') >= 0){
    setInterval(function(){
        (function() {
            var starts = document.getElementsByClassName('ks-simplestar');
            if(starts.length >= 3){
                for(var index = 0 ; index < starts.length; ++index){
                    starts[index].children[4].click();
                }
                var btn = document.getElementsByClassName('J_btn_submit');
                if(btn.length > 0 ){
                    btn[0].click();
                }
            }
        })();
    },1000);
}else if(url.indexOf('https://buyertrade.taobao.com/trade/itemlist/list_bought_items.htm') >= 0){
    var startPage = 20000;
    var step = 200;
    var endPage = startPage - step;
    var limitDate = new Date();
    limitDate.setTime(limitDate.getTime() - 14 * 86400000);
    var rateOrders = [];
    function getPage(page){
        console.log('获取第'+page+'页的数据,'+startPage+":"+endPage);
        if(startPage <= endPage){

        }else{
            $.post('https://buyertrade.taobao.com/trade/itemlist/asyncBought.htm?action=itemlist/BoughtQueryAction&event_submit_do_query=1&_input_charset=utf8',
            {
                'lastStartRow':'',
                'options':0,
                'orderStatus':'ALL',
                'pageNum':page,
                'pageSize':15,
                'queryBizType':'',
                'queryOrder':'desc',
                'rateStatus':'I_HAS_NOT_COMMENT',
                'tabCode':'waitRate',
                'prePageNo':'',
            },function(e){
                e = JSON.parse(e);
                if(e.mainOrders == undefined || e.mainOrders.length <= 0){
                    if(e.page != undefined){
                        startPage = e.page.totalPage;
                        endPage = startPage - step;
                        console.log('没有订单，重置第一页:'+startPage);
                        setTimeout(function(){
                            getPage(startPage);
                        },0);
                    }else{
                        console.log('出错了');
                    }
                }else{
                    orders = e.mainOrders;
                    var length = orders.length;
                    var count = 0;
                    for(var i = 0 ; i < orders.length ; ++i){
                        count += 1;
                        var createTime = new Date();
                        createTime.setTime(Date.parse(orders[i].orderInfo.createTime));
                        console.log('订单时间:'+createTime.format('yyyy-MM-dd hh:mm:ss'));
                        if(createTime < limitDate){
                            rateOrders.push(orders[i].id);
                            console.log('提取订单号:'+orders[i].id);
                        }else{
                            console.log('丢弃订单号:'+orders[i].id);
                            return;
                        }
                        //if(orders[i].subOrders[0].itemInfo.title.indexOf('话费') >= 0){
                        //    rateOrders.push(orders[i].id);
                        //    console.log('提取订单号:'+orders[i].id);
                        //}else{
                        //    console.log('丢弃订单号:'+orders[i].id);
                        //}
                    }
                    function rate(){
                        console.log(rateOrders.length);
                        var id = rateOrders.pop();
                        if(id != undefined && id != null){
                            var chrome_tab = GM_openInTab('https://rate.taobao.com/remarkSeller.jhtml?tradeID='+id+'&returnURL=https://buyertrade.taobao.com/trade/itemlist/asyncBought.htm',{active:false,insert:true});
                            //var chrome_tab = window.open('https://rate.taobao.com/remarkSeller.jhtml?tradeID='+id+'&returnURL=https://buyertrade.taobao.com/trade/itemlist/asyncBought.htm');
                            chrome_tab.onclose = function(){
                                setTimeout(function(){rate();},0);
                            };
                        }else{
                            startPage -= 1;
                            setTimeout(function(){
                                getPage(startPage);
                            },0);
                        }
                    };
                    rate();
                }
            });
        }
    }
    var script=document.createElement("script");
    script.type="text/javascript";
    script.src="https://code.jquery.com/jquery-3.2.1.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);
    script.onload = function(){
        $(document).ready(function(){
            console.log($);
            getPage(startPage);
        });
    };
}