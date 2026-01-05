// ==UserScript==
// @name        gwdang
// @name:zh-CN   购物党比价工具[去除多余按钮]
// @namespace   no
// @description no
// @description:zh-CN no
// @include     http://*.jd.com/*
// @include     https://*.jd.com/*
// @include     http://*.taobao.com/*
// @include     https://*.taobao.com/*
// @include     http://*.tmall.com/*
// @include     https://*.tmall.com/*
// @include     http://*.yixun.com/*
// @include     http://*.51buy.com/*
// @include     http://*.yhd.com/*
// @include     http://*.suning.com/*
// @include     http://*.dangdang.com/*
// @include     http://*.gome.com.cn/*
// @include     http://*.newegg.cn/*
// @include     http://*.paipai.com/*
// @include     https://*.amazon.com/*
// @include     https://*.amazon.cn/*
// @include     http://www.kjt.com/*
// @include     http://www.kaola.com/*
// @include     http://www.tcl.com/*
// @include     http://shop.hisense.com/*
// @include     http://*.oppo.com/*
// @include     http://shop.vivo.com.cn/*
// @include     http://www.ebay.com/*
// @include     http://t.dianping.com/*
// @include     http://*.nuomi.com/*
// @include     http://*.meituan.com/*
// @include     https://yao.95095.com/*
// @include     http://*.feiniu.com/*
// @include     http://*.meilishuo.com/*
// @include     http://*.mogujie.com/*
// @include     http://shop.coolpad.cn/*
// @include     http://*.sephora.cn/*
// @include     http://*.yesmywine.com/*
// @include     http://*.yiguo.com/*
// @include     http://*.wanggou.com/*
// @include     http://mall.jia.com/*
// @include     http://weigou.baidu.com/*
// @include     http://*.mi.com/*
// @include     http://shop.letv.com/*
// @include     http://*.handu.com/*
// @include     http://*.taoshu.com/*
// @include     http://*.1688.com/*
// @include     http://*.muyingzhijia.com/*
// @include     http://*.vmall.com/*
// @include     http://*.xiji.com/*
// @include     http://*.xijie.com/*
// @version     1.2.2
// @grant 		none
// @require 	https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/24942/gwdang.user.js
// @updateURL https://update.greasyfork.org/scripts/24942/gwdang.meta.js
// ==/UserScript==

(function(){
	var s = document.createElement('script');s.setAttribute('src','https://greasyfork.org/scripts/14464-gwd/code/gwd.js?version=160151');document.body.appendChild(s);
})();

/*
修改自 https://greasyfork.org/zh-CN/scripts/14466-购物党比价工具
去除了左下角的浮动窗口和比价栏右侧的二维码扫描下载

***注意***:
复制添加: // @require 	https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
修改标题: 购物党比价工具[去除多余按钮]
*/

var Rules = "#gwd_wishlist_qrcode_btn.gwd_wishlist_qrcode,#gwdang-notifier.gwd-mini";

$(Rules).remove();

options = {childList: true, subtree: true};
new MutationObserver(function(rs) {
	this.disconnect();
	$(Rules).remove();
	this.observe(document.body, options);
}).observe(document.body, options);