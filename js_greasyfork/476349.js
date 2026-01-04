// ==UserScript==
// @name         腾讯视频【PC网页版专享】页面优化 (动漫）
// @namespace    https://jixiejidiguan.top/A2zml/
// @version      2024-09-10
// @description  vip视频解析
// @author       jixiejidiguan.top
// @match        https://v.qq.com/*
// @icon         https://jixiejidiguan.top/favicon.ico
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @grant        unsafeWindow
// @license      AGPL License
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/476349/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E3%80%90PC%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%93%E4%BA%AB%E3%80%91%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96%20%28%E5%8A%A8%E6%BC%AB%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/476349/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E3%80%90PC%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%93%E4%BA%AB%E3%80%91%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96%20%28%E5%8A%A8%E6%BC%AB%EF%BC%89.meta.js
// ==/UserScript==

(function() {

let address = window.location.href;
let partToCheck = "v.qq.com/x/";

// 使用 includes 方法检查 address 是否包含 partToCheck
let isIncluded = address.includes(partToCheck);
if(isIncluded) {
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'https://static.tdesign.tencent.com/starter/vue/assets/style-20e2d658.css'; // 替换为你的样式表 URL
document.head.appendChild(link);
$.ajax({
url: 'https://greasyfork.org/zh-CN/scripts/476349-%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91-pc%E7%BD%91%E9%A1%B5%E7%89%88%E4%B8%93%E4%BA%AB-%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96-%E5%8A%A8%E6%BC%AB/stats.json', // JSON 数据的 URL
type: 'GET', // 请求类型，根据需要可以是 GET 或 POST
dataType: 'json', // 预期服务器返回的数据类型
success: function(data) {
var currentDate = new Date().toISOString().split('T')[0]; // 获取当前日期
var todaysData = data[currentDate]; // 获取当天的数据
$('body').append(`<div class="t-notification__show--bottom-right" style="z-index: 6000; right: 16px; bottom: 16px;"><div class="t-notification" style="margin-bottom: 16px; position: relative; z-index: 6000;"><div class="t-notification__icon"><svg fill="none" viewBox="0 0 24 24" width="1em" height="1em" class="t-icon t-icon-info-circle-filled t-is-info"><path fill="currentColor" d="M12 23a11 11 0 100-22 11 11 0 000 22zM11 8.5v-2h2v2h-2zm2 1.5v7.5h-2V10h2z"></path></svg></div><div class="t-notification__main"><div class="t-notification__title__wrap"><span class="t-notification__title">${currentDate}</span></div><div class="t-notification__content"><span class="t-notification__title">安装次数:${todaysData.installs}</span><br>更新检查总次数:${todaysData.update_checks}</div></div></div></div>`);
},
error: function(jqXHR, textStatus, errorThrown) {
// 请求失败时的回调函数
console.error('请求失败: ' + textStatus, errorThrown);
}
});
}



if ($(".quick_user_avatar").length > 0) {
$(".quick_user_avatar").attr("src", "https://jixiejidiguan.top/favicon.ico");
}
var ToRemove = ['.quick_vip', '.quick_games', '.quick_upload', '.quick_client', '.ft_cell.ft_cell_feedback', '#ssi-policy', '#nav-all', '.playlist-vip-section__vip'];
$.each(ToRemove, function(index, id) {
$(id).remove();
});

function ddata() {
var data = [
{"name": "M1907", "url": "https://z1.m1907.top/?jx="},
{"name": "虾米", "url": "https://jx.xmflv.com/?url="},
{"name": "m3u8", "url": "https://jx.m3u8.tv/jiexi/?url="},
{"name": "77FLV", "url": "https://jx.77flv.cc/?url="},
{"name": "7G", "url": "https://jx.nnxv.cn/tv.php?url="}
];
var itemString = localStorage.getItem('Data');
if (itemString && itemString !== '') {
try {
var savedData = JSON.parse(itemString);
data = data.concat(savedData); // 假设savedData是一个数组
} catch (e) {
console.error('无法解析localStorage中的数据:', e);
}
}
return data;
}




function sayadd(name) {
$('.player').append($(`
<div class="t-card" style="width: 100%;height: 120000px;z-index: 12000;" id="bfqsdskjdjvkdv">
<iframe height="100%" width="100%" src="${name+window.location.href}" frameborder="0" allowfullscreen></iframe>
</div>
`));
}
function listserffdd() {
var $itemList = $('#item-list');
$itemList.empty();
$.each(ddata(), function(index, item) {
var $listItem = $('<div>').addClass('t-button t-button--variant-base t-button--theme-default t-drawer__cancel').append($('<span>').addClass('t-button__text').text(item.name));
$listItem.on('click', function() {
sayadd(item.url);
localStorage.setItem('V',index);
$("#dialog").hide();
});
$itemList.append($listItem);
});
}
$('body').append(`
<div id="dialog" style="display: none;" tabindex="0" class="t-drawer t-drawer--bottom t-drawer--open"><div class="t-drawer__mask" style=""></div>
<div class="t-drawer__content-wrapper t-drawer__content-wrapper--bottom" style="height: 300px; transform: translateX(0px);"><div class="t-drawer__header">VIP解析<div slot="avatar" style="display: flex; align-items: center; justify-content: center;margin-left: 20px;"><div class="t-avatar t-avatar--round"><div class="t-image__wrapper t-image__wrapper--shape-square"><img src="https://jixiejidiguan.top/favicon.ico" alt="" class="t-image t-image--fit-fill t-image--position-center"></div></div><div class="t-space t-space-horizontal" style="gap: 16px;"><div class="t-space-item"><a target="" href="https://jixiejidiguan.top/" class="t-link t-link--theme-primary t-link--hover-underline t-drawer__header">jixiejidiguan.top</a></div></div></div></div>
<div class="t-drawer__close-btn" id="showsdialogexit"><svg fill="none" viewBox="0 0 24 24" width="1em" height="1em" class="t-icon t-icon-close t-submenu-icon"><path fill="currentColor" d="M7.05 5.64L12 10.59l4.95-4.95 1.41 1.41L13.41 12l4.95 4.95-1.41 1.41L12 13.41l-4.95 4.95-1.41-1.41L10.59 12 5.64 7.05l1.41-1.41z"></path></svg></div>
<div class="t-drawer__body" >
<div class="t-space t-space-horizontal" style="gap: 16px;" id="item-list"></div>
</div>
<div class="t-drawer__footer"><div style="display: flex; justify-content: flex-end;"><button type="button"  id="chongzhi" class="t-button t-button--variant-base t-button--theme-default t-drawer__cancel"><span class="t-button__text">重置接口</span></button>
<button type="button" id="addvipjiexi" class="t-button t-button--variant-base t-button--theme-primary t-drawer__confirm"><span class="t-button__text">添加VIP解析接口</span></button></div></div>
</div>
</div>
`);
listserffdd();
var container = `
<div class="t-space t-space-horizontal" style="gap: 24px;margin: 18px;">
<button type="button" id="showsdialog" class="t-button t-button--variant-outline t-button--theme-default t-button--ghost"><span class="t-button__text">解析</span></button>
<button type="button" id="bofang" class="t-button t-button--variant-outline t-button--theme-default t-button--ghost"><span class="t-button__text">播放</span></button>
<button type="button" id="gbbfq" class="t-button t-button--variant-outline t-button--theme-default t-button--ghost"><span class="t-button__text">关闭播放器</span></button>
</div>
`;
$('.container-main[data-v-411c4204]').append(container);
$('#showsdialog').on('click', function(){
$("#dialog").show();
});
$('#showsdialogexit').on('click', function(){
$("#dialog").hide();
});
$('#bofang').on('click', function(){
var todos = localStorage.getItem('V') || 2;
sayadd(ddata()[todos].url);
});

$('#gbbfq').on('click', function(){
$("#bfqsdskjdjvkdv").remove();
});
$('#chongzhi').on('click', function(){
listserffdd();
alert("自定义接口重置成功！");
localStorage.setItem('Data', JSON.stringify([]));
});
$('#addvipjiexi').on('click', function(){
var person = prompt("请输入标题");
if (person != null && person !== "") {
var persons = prompt("请输入地址");
if (persons != null && persons !== "") {
var newDataItem = {"name": person, "url": persons};
var itemString = localStorage.getItem('Data');
if (itemString && itemString !== '') {
try {
var savedData = JSON.parse(itemString);
} catch (e) {
console.error('无法解析localStorage中的数据:', e);
}
}
savedData.push(newDataItem);
localStorage.setItem('Data', JSON.stringify(savedData));
listserffdd();
}
}
});






})();