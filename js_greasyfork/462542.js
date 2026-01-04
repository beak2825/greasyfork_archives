// ==UserScript==
// @name         虎扑 - 需要和指定css文件配合使用的虎扑网页元素修改
// @namespace    https://greasyfork.org/zh-CN/scripts/462542
// @version      0.6
// @description  在失智许久之后我选择把css文件直接一个地扔
// @author       云浮鱼
// @include /^(?:https?\:\/\/(bbs\.)?hupu\.com\/[0-9]{1,})$/
// @include /^(?:https?\:\/\/(bbs\.)?hupu\.com\/[0-9]{1,}\-[0-9]{1,})$/
// @include /^(?:https?\:\/\/(bbs\.)?hupu\.com\/[0-9]{1,}\-[a-z]{1,})$/
// @include /^(?:https?\:\/\/(bbs\.)?hupu\.com\/[0-9]{1,}\-[a-z]{1,}\-[0-9]{1,})$/
// @include /^(?:https?\:\/\/(bbs\.)?hupu\.com\/[0-9]{1,}\-[0-9]{1,}\.html)$/
// @include /^(?:https?\:\/\/(bbs\.)?hupu\.com\/[0-9]{1,}\_[0-9]{1,}\.html)$/
// @include /^(?:https?\:\/\/(bbs\.)?hupu\.com\/[0-9]{1,}\.html)$/
// @icon
// @require      https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462542/%E8%99%8E%E6%89%91%20-%20%E9%9C%80%E8%A6%81%E5%92%8C%E6%8C%87%E5%AE%9Acss%E6%96%87%E4%BB%B6%E9%85%8D%E5%90%88%E4%BD%BF%E7%94%A8%E7%9A%84%E8%99%8E%E6%89%91%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/462542/%E8%99%8E%E6%89%91%20-%20%E9%9C%80%E8%A6%81%E5%92%8C%E6%8C%87%E5%AE%9Acss%E6%96%87%E4%BB%B6%E9%85%8D%E5%90%88%E4%BD%BF%E7%94%A8%E7%9A%84%E8%99%8E%E6%89%91%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

//去除原先加载的css
$('link[href*="static"][rel="stylesheet"]').prop('disabled', true);
$('link[href*="static"][rel="stylesheet"]').remove()

//虎扑标志和搜索栏位置调整
$('div[class*="search"]').detach().prependTo('.hp-pc-rc-TopMenu-top');
$('.bannerlogonew').detach().prependTo('.hp-pc-rc-TopMenu-top');

//板块分页元素位置调整
$('.bbs-sl-web-topic-wrap ul.hupu-rc-pagination').detach().appendTo('.bbs-sl-web-topic-wrap');
$('.bbs-sl-web-topic-wrap > div:nth-child(5)').remove()

//草这是啥
$('.bbs-sl-web-body > .hu-pc-navigation-wrap > ul:nth-child(2)').detach().appendTo('.bbs-sl-web-body .hu-pc-navigation-type:nth-child(1)');
$('.bbs-sl-web-nav > *:last-child').detach().appendTo('.bbs-sl-web-body .hu-pc-navigation-type:nth-child(2)');

//调整帖子内部分页栏（上）位置
let upperPagination = 'body > div#__next:nth-child(1) > div.index_bbs-post-web__2_mmZ:nth-child(1) > div.index_bbs-post-web-container___cRHg:nth-child(2) > div.index_bbs-post-web-body__XQ5Sq:nth-child(2) > div.index_bbs-post-web-body-left-wrapper__O14II:nth-child(1) > div > div.index_bbs-post-web-main__D_K6v > div:nth-child(3) > div.index_pagination__4IppE:nth-child(1) > div.index_pagination__wvE_f'
let unnamed1 = ".index_bbs-post-web-main__D_K6v > .index_br__hJajv:first-child"
$(upperPagination).detach().insertAfter(unnamed1);

//草这又是啥
let idontknowwtfthisthingevenis = '.index_bbs-post-web-main-title__MJTN5'
$('.post-content_bbs-post-content__cy7vN').detach().insertAfter(idontknowwtfthisthingevenis);
$('.post-operate_post-operate-comp-wrapper___odBI').detach().appendTo('.post-content_bbs-post-content__cy7vN');

//去除空的div
let unnamed2 = '.index_bbs-post-web-main__D_K6v > * > *:empty';
$(unnamed2).parent().remove();


/*回复/浏览改成回复nomi*/
var origin = document.querySelectorAll('.post-datum')
for (var data = 0; data < origin.length; data++) {
    let reply = origin[data].textContent.split(" /")[0]
    origin[data].textContent = reply
}

document.querySelector('.bbs-sl-web-post > .bbs-sl-web-post-layout > div:nth-child(2)').textContent = "回复"

/*时间去掉日期*/
var origin2 = document.querySelectorAll('.post-time')
for (var data2 = 0; data2 < origin.length; data2++) {
    let time = origin2[data2].textContent.split(" ")[1]
    origin2[data2].textContent = time
};

//如果在原版的话
if(window.location.pathname.indexOf('706') > -1) {
    /*替换原版图标*/
    var icon = '.bbs-sl-web-intro-avatar img'
    document.querySelector(icon).src="https://s2.loli.net/2023/04/04/9VYC7yZfdWEcnbG.png";
    /*替换话题描述*/
    var descriptionPath = '.bbs-sl-web-intro-detail > .bbs-sl-web-intro-detail-desc:nth-child(2) > .bbs-sl-web-intro-detail-desc-text'
    var description = document.querySelector(descriptionPath)
    description.innerHTML = "但愿新的梦想永远不被无留陀侵蚀。但愿旧的故事与无留陀一同被忘却。<br>但愿绿色的原野、山丘永远不变得枯黄。但愿溪水永远清澈，但愿鲜花永远盛开。<br>挚友将再次同行于茂密的森林中。<br>一切美好的事物终将归来，一切痛苦的记忆也会远去，就像溪水净化自己，枯树绽出新芽。"
}



