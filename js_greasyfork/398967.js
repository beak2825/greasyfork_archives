// ==UserScript==
// @name 富投网链接
// @namespace Violentmonkey Scripts
// @description 富投网链接其他网站数据
// @match http://www.richvest.com/index.php?m=cb*
// @version 20200330
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/398967/%E5%AF%8C%E6%8A%95%E7%BD%91%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/398967/%E5%AF%8C%E6%8A%95%E7%BD%91%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
    //code here
    $(document).on("mouseenter", "div.J_pop_card", function () {
        if($(this).find('#rv_div').length>0){
            return
        }
        // 可转债代码
        let code_cb=$(this).attr('id').replace(/J_user_card_[a-z]{2}/g,'');

        //正股代码
        let code_sh=$($(this).find('p.num > a:nth-child(11)')[0]).attr('href');
        code_sh=code_sh.substring(code_sh.length-6)
        //console.log(code_sh);

        if (code_sh.startsWith('6')) {
            market='sh';
        }
        else{
            market='sz';
        }
        let p=$(this).find('.num')[0];
        let div='<div id="rv_div">';
        //链接集思录
        div=div+'<span>|</span><a target="_blank" href="https://www.jisilu.cn/data/convert_bond_detail/';
        div=div+code_cb;
        div=div+'">集思录</a>';
        //链接集思录强赎
        div=div+'<span>|</span><a target="_blank" href="https://www.jisilu.cn/data/cbnew/#redeem';
        // div=div+code_sh+'.html';
        div=div+'">集思录强赎</a>';
        //链接雪球
        div=div+'<span>|</span><a target="_blank" href="https://xueqiu.com/S/';
        div=div+market+code_cb;
        div=div+'">雪球转债</a>';
        //链接雪球
        div=div+'<span>|</span><a target="_blank" href="https://xueqiu.com/S/';
        div=div+market+code_sh;
        div=div+'">雪球正股</a>';
        //链接东方财富网
        div=div+'<span>|</span><a target="_blank" href="http://quote.eastmoney.com/concept/';
        div=div+market+code_sh+'.html';
        div=div+'">东财正股</a>';
        //链接东方财富网
        div=div+'<span>|</span><a target="_blank" href="http://quote.eastmoney.com/concept/';
        div=div+market+code_cb+'.html';
        div=div+'">东财转债</a>';
        //链接东方财富网
        div=div+'<span>|</span><a target="_blank" href="http://data.eastmoney.com/stockdata/';
        div=div+code_sh+'.html';
        div=div+'">东财数据</a>';
        //链接东方财富网
        div=div+'<span>|</span><a target="_blank" href="http://data.eastmoney.com/stock/lhb/';
        div=div+code_sh+'.html';
        div=div+'">东财龙虎榜</a>';
        
        

        div=div+'</div>'
        $(p).append(div);
        // console.log(p);
    })
})();