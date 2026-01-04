// ==UserScript==
// @name         京东评价助手
// @description  京东订单自动评价 fork自@krapnik
// @namespace    https://greasyfork.org/zh-CN/scripts/453447
// @version      0.3
// @author       lqzh
// @copyright    lqzh
// @match             *//club.jd.com/myJdcomments/myJdcomments.action?sort=0
// @include           *//club.jd.com/myJdcomments/myJdcomments.action?sort=0
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/453447/%E4%BA%AC%E4%B8%9C%E8%AF%84%E4%BB%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/453447/%E4%BA%AC%E4%B8%9C%E8%AF%84%E4%BB%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

const contentArr = [
    '商品质量很好，很满意，配送速度快啊，而且配送员态度也非常好。',
    '挺好的，非常实用。京东的物流很快哟~希望以后会更快╭(╯3╰)╮',
    '多快好省，京东给力，下次还是要选择京东商城，没错，非常满意',
    '非常好，一起买的，价格便宜，快递又快，京东商城还是非常的专业和贴心，可以显示快递的位置，随时掌握快递进度，很先进！',
    '活动期间买的很实惠，京东自营，值得信赖。',
    '便宜好用，值得推荐买买买，同事都说好用。下次继续买买买，哈哈哈…',
    '京东物流就是一个字快，昨晚10点多，11点前下的单今天早上就收到，包装得很好。',
    '京东购物使我们的生活更便捷了！京东商品丰富，无所不有，自营商品更是价格优惠，童叟无欺。快递给力，包装实在。体验足不出户购物的感觉，就在京东！购物就上京东，有京东，足够！',
    '一直上京东商城网购，东西非常不错，价格便宜，物流快，是正品',
    '质量很好，性价比高，值得购买，送货速度快！！',
];

async function commit() {
    const i = parseInt(10 * Math.random(), 10);

    let close = $('.fail-close');
    if (close.length > 0) {
        close.click();
    }

    // 开始评论
    let assess = $('.btn-9').eq(0);
    if (!assess) return;
    assess.click();
    await sleep(5 * 1000);

    let star = $('.star5');
    star.click();
    console.log('星星');
    await sleep();

    try {
        let area = $('.area01').eq(0);
        area.val(contentArr[i]);
        area.select();
        await sleep();
        area.click();
        await sleep();
        area.blur();
        await sleep();
        console.log('文字');
        await sleep(8 * 1000);
    } catch (error) {
        console.log('error.message', error.message);
    }

    $('.btn-5').click();
    console.log('提交');
    await sleep(12 * 1000);
}

function sleep(t = 1000) {
    return new Promise(res => {
        setTimeout(res, t);
    });
}

(async () => {
    await sleep( 10*1000 );
    while (1) {
        if ($('.comt-plist').length == 0) break;

        await commit();
    }
})();
