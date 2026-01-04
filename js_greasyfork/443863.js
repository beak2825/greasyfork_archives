// ==UserScript==
// @name         京东自动评价
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  京东自动评价，自动好评
// @author       jan
// @match        https://club.jd.com/myJdcomments/orderVoucher.action?ruleid=*
// @icon         https://www.google.com/s2/favicons?domain=jd.com
// @grant        none
// @run-at     document-end
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/443863/%E4%BA%AC%E4%B8%9C%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/443863/%E4%BA%AC%E4%B8%9C%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
 // setTimeout(go(),50000);
  (function() {
    'use strict';
    var $ = window.jQuery;
    var list = [
        '我为什么喜欢在京东买东西，因为今天买明天就可以送到。我为什么每个商品的评价都一样，因为在京东买的东西太多太多了，导致积累了很多未评价的订单，所以我统一用段话作为评价内容。',
        '质量可以说是非常好了，与卖家描述的完全一致，非常满意,真的很喜欢，完全超出期望值，发货速度非常快，包装非常仔细、严实，物流公司服务态度很好，运送速度很快，很满意的一次购物。',
        '如果我用这段话来评价，说明内这款产品没问题，至少85分以上，而比较垃圾的产品，我绝对不会偷懒到复制粘贴评价，我绝对会用心的差评，这样其他消费者在购买的时候会作为参考，会影响该商品销量，希望商家会因此改进商品质量。',
        '非常感谢京东给予的优质的服务，从仓储管理、物流配送等各方面都是做的非常好的。送货及时，配送员也非常的热情，有时候不方便收件的时候，也安排时间另行配送。同时京东在售后管理上也非常好的，以解客户忧患，排除万难。给予我们非常好的购物体验。',
        '买的太多，用此条概括，购物习惯性的上京东，小到柴米油盐 日用品 零食 化妆品，大到家用电器，生活所缺就来京东逛逛，总能找到物美价廉的商品。京东购物品质有保障，发货快 配送快，给京东的配送员一个大大的赞，京东值得信赖！',
        '开始我原以为质量是一般般的,想不到拿到手上后的感觉就是不一样,坠坠的,有点沉.当初的凝虑没有了,真是太开心了!在京东购物就是一种享受,很值得购买....哈哈!又一次淘到好东西了...好评,绝对的好评!下次再来，介绍倾情的同事朋友来购买。',
        '每次收货都是非常愉快的，可是只要一想到还要给评价，头就大了。幸好万能的网友总结出来一套通用的网购模板，如果你是想看评论决定买不买这个宝贝，你可以打住了。因为我说的你不一定信，但是我自己却坚定不移的要给好评，为啥呢？我来评价下这个宝贝，价格不错，质量不错，快递不错，老板不错。下次网购我还是这样写满100个字的评价，让那些不相信我评价语的网友产生怀疑，这人买东西有一套，不然评语不会这么坚定。'];
    var randomNumber = function(n) {
        return Math.floor(Math.random() * n);
    };
    var fillingForm = function() {
        var n = list.length;
        $('.star5').click();
        $('.f-textarea textarea').each(function(i, obj) {
            $(obj).val(list[randomNumber(n)]);
        });
        $('#check1').prop('checked', true);
    };
    $(document).ready(function() {
        window.setTimeout(fillingForm, 100);
    });
})();
  window.setTimeout(function(){go()},1000);
  function go(){
    var btn=document.querySelector('#container > div > div > div.mycomment-form > div.f-btnbox > a');
    btn.click();
    //window.setTimeout(function(){window.close()},1000);
    console.log("京东自动评价");}


})();