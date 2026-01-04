// ==UserScript==
// @author            alpha
// @name              淘宝卖家评价助手
// @description       淘宝卖家自动评价助手
// @include             *//trade.taobao.com/trade/itemlist/list_sold_items.htm?action=itemlist/SoldQueryAction&event_submit_do_query=1&*
// @include            *//rate.taobao.com/remarkBuyer.jhtml*
// @include            *//rate.taobao.com/remarkBuyer.htm
// @version              0.5
// @grant        none
// @namespace         http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/376986/%E6%B7%98%E5%AE%9D%E5%8D%96%E5%AE%B6%E8%AF%84%E4%BB%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/376986/%E6%B7%98%E5%AE%9D%E5%8D%96%E5%AE%B6%E8%AF%84%E4%BB%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 页面载入后开始提交
window.onload =function(){
    if(location.pathname == '/trade/itemlist/list_sold_items.htm'){
        sleep(2600);
        getRateHref();
    }else if(location.pathname == '/remarkBuyer.jhtml'){
        sleep(1000)
        autorate()
    }else if(location.pathname == '/remarkBuyer.htm'){
        sleep(1000)
        location.href = 'https://trade.taobao.com/trade/itemlist/list_sold_items.htm?action=itemlist/SoldQueryAction&event_submit_do_query=1&commentStatus=I_HAS_NOT_COMMENT&tabCode=waitRate';
    }
}

//获取第一个待评价的链接
function getRateHref(){
    var listrate = document.querySelectorAll('a');
    for (var i=0; i<listrate.length; i++){
        if(listrate[i].text == '评价'){
            location.href = listrate[i].href;
            break;
        }
    }
}

// 进入评价页面自动评价
function autorate(){
    //提取商品id
    var localhref = location.href;
    var id = /\d{10,20}/g.exec(localhref);
    id = '#rate-good-' + id[0];
    //检测是否允许评价
    if (document.querySelector('h4')){
        if(document.querySelector('h4').textContent.search('抱歉') != -1){
            location.href = 'https://trade.taobao.com/trade/itemlist/list_sold_items.htm?action=itemlist/SoldQueryAction&event_submit_do_query=1&commentStatus=I_HAS_NOT_COMMENT&tabCode=waitRate';
        }
    }else {
    // 选中好评
        document.querySelector('#rate-good-all').checked=true;
        document.querySelector(id).checked=true;
    // 设置评价内容
        var comment = '感谢您的光临，希望您每天都有一个好心情 ^_^ ^_^'
        document.querySelector('textarea').value = comment;
    // 提交
        document.querySelectorAll('button')[2].click();
    }
    }

// 暂缓刷新页面
function sleep(delay) {
  var start = (new Date()).getTime();
  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}