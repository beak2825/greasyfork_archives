// ==UserScript==
// @author            zijdn
// @name              京东自动追评
// @description       一键追评所有订单
// @include           *//club.jd.com/afterComments/*

// @version           0.1
// @connect-src       www.jd.com
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/375831/%E4%BA%AC%E4%B8%9C%E8%87%AA%E5%8A%A8%E8%BF%BD%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/375831/%E4%BA%AC%E4%B8%9C%E8%87%AA%E5%8A%A8%E8%BF%BD%E8%AF%84.meta.js
// ==/UserScript==
contentArr = ['用了几天，商品质量很好，很满意，配送速度快啊，而且配送员态度也非常好。',
    '用了一段时间，东西收到了，质量非常好，与商家描述的完全一致，非常满意,真的很喜欢，完全超出期望值，发货速度非常快，包装非常仔细、严实，物流公司服务态度很好，运送速度很快，很满意的一次购物，质量很好',
    '体验了一下，多快好省，京东给力，下次还是要选择京东商城，没错，非常满意',
    '非常好，用了感觉很好，价格便宜，快递又快，京东商城还是非常的专业和贴心，可以显示快递的位置，随时掌握快递进度，很先进！',
    '用了几天，便宜好用，值得推荐买买买，同事都说好用。下次继续买买买，哈哈哈…',
    '京东物流就是一个字快，昨晚10点多，11点前下的单今天早上就收到，包装得很好。',
    '京东购物使我们的生活更便捷了！京东商品丰富，无所不有，自营商品更是价格优惠，童叟无欺。快递给力，包装实在。体验足不出户购物的感觉，就在京东！购物就上京东，有京东，足够！',
    '一直上京东商城网购，东西非常不错，价格便宜，物流快，是正品',
    '东西便宜，质量又好，物美价廉, 买的放心又开心, 网购上瘾，根本无法停下来，品类多，而且齐全，划算，方便，快捷，实惠，包装又好，没有任何破损，简直是消费者的福音',
    '怒赞！（此评论虽仅有两个字，可谓言简意赅，一字千金，字字扣人心弦，催人泪下，足可见评论人扎实的文字功底和信手拈来的写作技巧，再加上以感叹号收尾，点睛之笔，妙笔生花，意境深远，把评论人的感情表达得淋漓尽致，有浑然天成之感，实乃评论中之极品，祝福中之绝笔也）'
];

if (window.location.pathname == '/afterComments/saveAfterCommentSuccess.action' && $(".btn-spec4")) {
    setTimeout(function () {
        //进入评价页面
        document.getElementsByClassName("btn-spec4")[0].click();
    }, 500);
}


if (window.location.pathname == '/afterComments/orderPublish.action') {
    //追评
    $("textarea").val(contentArr[Math.floor(Math.random() * 10)]);
    //提交
    setTimeout(function () {
        $('.btn-submit').click();
    }, 300);
}
