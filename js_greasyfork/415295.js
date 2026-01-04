// ==UserScript==
// @name         数码之家多功能脚本
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  屏蔽常规优惠帖、老站简版网页跳转正常版本、
// @author       You
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @match        https://www.mydigit.cn/forum.php?mod=*
// @match        http://bbs.mydigit.cn/simple/?t*.html
// @match        https://www.mydigit.cn/plugin.php?id=k_misign:sign
// @downloadURL https://update.greasyfork.org/scripts/415295/%E6%95%B0%E7%A0%81%E4%B9%8B%E5%AE%B6%E5%A4%9A%E5%8A%9F%E8%83%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/415295/%E6%95%B0%E7%A0%81%E4%B9%8B%E5%AE%B6%E5%A4%9A%E5%8A%9F%E8%83%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
// 脚本开始
console.log('脚本启动');
///////////////////
// 屏蔽常规优惠帖 //
///////////////////
if (location.href.match(/^https:\/\/www\.mydigit\.cn\/forum\.php\?mod=.*/)) {
    // 设置标题限制长度
    var tLL = 30;
    // 设置广告机器人名
    var arr = ['主推暴款', 'dsdfg', 'czgou.cn', 'cjlzq', '帮你省', 'suzuki_alto', '买买弟', 'huigu__', 'kgdssa', 'long2012i', '小葵花', '第7天', '乐淘', '杨贵生', '好货分享', 'haizhong',
        '山东呆呆', 'tompda套套', 'yesit', '秦皇岛二手商',
    ];
    var temp = new Set(arr);
    //--------------------------------------------------------------------------------
    //
    if (location.href.match(/^https:\/\/www\.mydigit\.cn\/forum\.php\?mod=forumdisplay&fid=((37)|(2))?(&page=\d+)?$/)) {
        // 遍历ID为waterfall的子代li迭代
        $('#waterfall > li').each(function() {
            // 获取 “当前节点” 后代 “h3” 的子级 “a” 的 “html”
            let titl = $('h3 > a', this).html();
            let author = $('cite + a', this).html();
            // 判断 若 temp 中含有 auther 则 移除当前节点，另若 标题长度大于 tll 则 删除当前节点
            (temp.has(author) || titl.length > tLL) && $(this).remove();
        });
    }
    if (location.href.match(/https:\/\/www\.mydigit\.cn\/forum\.php\?mod=forumdisplay&fid=36/)) {
        console.log('数码交易区');
        $('a.s.xst').each(function() {
            let titl = $(this).html();
            let author = $(this).parents('th').next('td').find('a').html();
            (temp.has(author) || titl.length > tLL) && $(this).parents('tbody').remove();
        });
    }
    // 去广告代码段
    $('#diyfastposttop').remove();
    // 新帖删除长标题广告帖
    if (location.href.match(/^https:\/\/www\.mydigit\.cn\/forum\.php\?mod=guide&view=(newthread)|(hot)|(new)(&page=\d+)?$/) || location.href.match(/^https:\/\/www\.mydigit\.cn\/forum\.php\?mod=guide$/)) {
        console.log('新帖');
        $('#forumnew + table > tbody').each(function() {
            var newTitle = $('a.xst', this).html();
            // 判断 若 标题长度大于 tLL 则 移除当前节点
            newTitle.length > tLL && $(this).remove();
        });
    }
}
//////////////////////////
// 简版网页跳转常规版老站 //
//////////////////////////
if (location.href.match(/^http:\/\/bbs\.mydigit\.cn\/simple\/\?t\d+\.html$/)) {
    console.log('匹配简版网页');
    let url = location.href;
    url = url.replace(/simple\/\?t(\d+)\.html$/, 'read.php?tid=$1');
    location.href = url;
}
///////////////////
// 签到页自动签到 // 好像没用
///////////////////
if (location.href.match(/^https:\/\/www\.mydigit\.cn\/plugin\.php\?id=k_misign:sign$/)) {
    console.log('签到页');
    $('JD_sign').click();
    console.log('完成点击');
}