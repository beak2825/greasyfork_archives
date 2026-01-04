// ==UserScript==
// @name              hhzzhh
// @name:zh           B站哔哩哔哩使用增强，全网VIP视频免费破解去广告，知乎使用增强，短视频无水印下载，油管、Facebook等国外视频解析下载等😈
// @name:zh-TW		  B站嗶哩嗶哩使用增強，全網VIP視頻免費破解去廣告，知乎使用增強，短視頻無水印下載，油管、Facebook等國外視頻解析下載等😈
// @namespace         hhzzhh
// @version           2.1.13
// @description       功能可选择性打开：1、B站使用增强：支持视频下载(👉支持多P批量快速下载👈)、浏览记录提示、一键三连、自动签到、描述文本网址转链接等；2、全网VIP视频解析：爱奇艺、腾讯、优酷、bilibili等视频免费解析(支持自定义解析接口)；3、知乎使用助手：内容种类标识、问答显示优化、视频下载等；4、短视频去水印下载：支持知乎、抖音、快手等；5、油管、Facebook、Tiktok等国外视频解析下载；🔥6、搜索引擎功能增强,百度添加网址显示，google结果新标签页打开灯,导航可自定义网址【脚本长期维护更新，完全免费，无广告，仅限学习交流！！】
// @description:zh    功能可选择性打开：1、B站使用增强：支持视频下载(👉支持多P批量快速下载👈)、浏览记录提示、一键三连、自动签到、描述文本网址转链接等；2、全网VIP视频解析：爱奇艺、腾讯、优酷、bilibili等视频免费解析(支持自定义解析接口)；3、知乎使用助手：内容种类标识、问答显示优化、视频下载等；4、短视频去水印下载：支持知乎、抖音、快手等；5、油管、Facebook、Tiktok等国外视频解析下载；🔥6、搜索引擎功能增强,百度添加网址显示，google结果新标签页打开灯,导航可自定义网址【脚本长期维护更新，完全免费，无广告，仅限学习交流！！】
// @description:zh-TW 功能可選擇性開啟：1、B站使用增強：支援視頻下載(👉支援多P批量快速下載👈)、瀏覽記錄提示、一鍵三連、自動簽到、描述文本網址轉連結等；2、全網VIP視頻解析：愛奇藝、騰訊、優酷、bilibili等視頻免費解析(支援自定義解析介面)；3、知乎使用助手：內容種類標識、問答顯示優化、視頻下載等；4、短視頻去水印下載：支援知乎、抖音、快手等；5、油管、Facebook、Tiktok等國外視頻解析下載；🔥6、搜索引擎功能增強,百度添加網址顯示，google結果新標籤頁開啟燈,導航可自定義網址【指令碼或直譯式程式長期維護更新，完全免費，無廣告，僅限學習交流！！】
// @author            huahuacat
// @icon              data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACS0lEQVRYR8WXz2oTURTGv3MnpqhNKy1UWmxRTGdaiLSQRKkKIoK4FVrRPoHu7BMYn0B3+gQquuiuiC6kaFVsAhGEZkKqG/+Vrtp0YWsyR27KlEwz0xnnT3LgwjB37vl+97tzz9whdDiow/pwBCjofN0AJohwKQgkMxYF8Dmt0bxdnhaAQoWTXMczENJBhFvGMgqk4GY6SZXmPgvAmy/cnYijGqrwvmTVHSQup2jLvG0ByJf5EYDbUQIAeJxR6U4LQHGV1VodesTijfQxBdrkaSrL6z0Hlst8i4An7QBgYDar0lMrgM45ItxrCwDjflajnC+AtR8Gvn8zGpz9xwVOjor/Zma/ANt/GIsLNWxt8p7o4IiAmlLQP+C9pvkG+FoyUPxYs52xhFDPKIh3uRviG2ClWIdsTpHoJYymFNdliQzABBsaEZg4p+DwUftliRxAggwOC0xdidma1RaAI92Ea9OHOgcwPqlANruI1AElhsa2dBKXQJEBnDglGlvxWN/BNcE3gKyCS69b64AUlMISwEv4BpDJ3778i/Xfu5XQtFtaLq+9RiCA6gZj/dcuQN8Audod6kvodYZuz9k7UOK7JPDAbXAY/WxgLjtGDy2f408VPi8MLIUh4JbDELhwNknvLQDyQNoTh87AkFuCIP0E/NzcgWYeTC0bdrkNp6Lm9bc4YM4qr/NzEGaCzNJxLONFRqMbzf22JSu/wlcphhwzpsIAIcIHriGXGadX+/MdWDPflTjRxcH+kLYJhYtj5Piz4/0gF4YVNjk6DvAPDb0aMEr8/nEAAAAASUVORK5CYII=
// @include           *://*.ttcdw.cn/*
// @include           *://*.iqiyi.com/v_*
// @include           *://*.iqiyi.com/w_*
// @include           *://*.iqiyi.com/a_*
// @include           *://*.iqiyi.com/resource/pcw/play/*
// @include           *://*.le.com/ptv/vplay/*
// @include           *://v.qq.com/x/cover/*
// @include           *://v.qq.com/x/page/*
// @include           *://v.qq.com/tv/*
// @include           *://*.tudou.com/listplay/*
// @include           *://*.tudou.com/albumplay/*
// @include           *://*.tudou.com/programs/view/*
// @include           *://*.mgtv.com/b/*
// @include           *://film.sohu.com/album/*
// @include           *://tv.sohu.com/v/*
// @include           *://*.baofeng.com/play/*
// @include           *://vip.pptv.com/show/*
// @include           *://v.pptv.com/show/*
// @include           *://www.le.com/ptv/vplay/*
// @include           *://www.wasu.cn/Play/show/*
// @include           *://*.1905.com/video/*
// @include           *://*.1905.com/play/*
// @include           *://*.1905.com/*/play/*
// @include           *://www.miguvideo.com/mgs/*
// @include           *://m.v.qq.com/x/cover/*
// @include           *://m.v.qq.com/x/page/*
// @include           *://m.v.qq.com/*
// @include           *://m.iqiyi.com/v_*
// @include           *://m.iqiyi.com/w_*
// @include           *://m.iqiyi.com/a_*

// @downloadURL https://update.greasyfork.org/scripts/536086/hhzzhh.user.js
// @updateURL https://update.greasyfork.org/scripts/536086/hhzzhh.meta.js
// ==/UserScript==
setInterval(()=>{
window.timilistParam.videoSpeedItems="16";
window.timilistParam.videoSpeedPlay=1;
},20)