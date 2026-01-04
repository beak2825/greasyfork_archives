/* eslint-disable no-multi-spaces */
/* eslint-disable no-useless-call */
/* eslint-disable userscripts/no-invalid-headers */

// ==UserScript==
// @name         轻小说文库+ (v1)
// @namespace    Wenku8+
// @version      1.7.5
// @description  轻小说文库全方位体验改善，涵盖阅读、下载、书架、推荐、书评、账号、页面个性化等各种方面，你能想到的这里都有。没有？欢迎提出你的点子。
// @updateinfo   <h3>v1.7.5</h3><ul><li>支持wenku8.cc</li><li>修复书评文字缩放行间距错误地随文字缩放放大缩小问题</li></ul>
// @author       PY-DNG
// @license      GPL-license
// @icon         data:image/vnd.microsoft.icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAD/igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//+KAP//igD//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//rlB//3HaP/858P//OfD//znw//858P//OfD//znw//858P//OfD//zitv/91Y///dWP//3Vj//9y3X//cdo//3HaP/9x2j//cdo//zitv/858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw///ogD//6IA//znw//858P//OfD//znw//9x2j//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6cN//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//3ZnP//ogD//6IA//+iAP//ogD//sJb//3HaP/83qn//OfD//zeqf//pw3//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+rGv/90IL//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//cdo//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//OfD//znw//858P//OfD//znw//858P//6IA//+iAP/84rb//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//rQ0//60NP//ogD//6IA//+iAP//ogD//6IA//+iAP/858P//OfD//znw//858P//OfD//znw///ogD//6IA//3Vj//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//6wJ///ogD//6sa//3HaP/92Zz//OfD//znw//858P//OfD//znw//858P//OfD//+iAP//ogD//rQ0//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//zitv/+vk7//6IA//+iAP//ogD//6IA//+iAP/+tDT//OfD//znw//858P//OfD//znw//858P//rAn//+iAP//ogD//ct1//3HaP/+tDT//rQ0//6+Tv/858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//ct1//7CW///ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw///ogD//6IA//65Qf//ogD//6IA//3HaP/9x2j//6cN//+iAP//ogD//r5O//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//60NP/9x2j//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//+iAP//ogD//OfD//65Qf//ogD//6cN//znw//858P//6IA//+iAP/92Zz//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//6IA//+iAP/858P//cdo//+iAP//ogD//dWP//3Vj///pw3//6IA//7CW//858P//rQ0//+iAP/92Zz//OfD//3Ldf/+tDT//OK2//znw//858P//N6p//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw///ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//7CW///ogD//6IA//6+Tv//ogD//6IA//6+Tv/91Y///6IA//+iAP/+vk7//OfD//+iAP//ogD//6IA//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//dWP//+iAP//ogD//6IA//+iAP//ogD//OK2//+rGv//ogD//6IA//3ZnP/858P//6IA//+iAP//qxr//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//sJb//+iAP//pw3//rQ0//+iAP//ogD//OfD//znw//+wlv//6IA//+iAP//ogD//6cN//3ZnP/+vk7//6IA//+iAP/90IL//OfD//60NP//ogD//6IA//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//84rb//rAn//+iAP//ogD//6IA//+iAP/+sCf//rQ0//+iAP//ogD//6IA//+iAP/9x2j//OfD//65Qf//ogD//rAn//znw//858P//rQ0//+iAP/+uUH//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//r5O//60NP//ogD//6IA//+iAP//ogD//6IA//+iAP/9x2j//6IA//+iAP/9x2j//OfD//6+Tv//ogD//6IA//znw//84rb//6IA//+iAP/84rb//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw//858P//OfD//+nDf//ogD//6cN//60NP/+vk7//ct1//znw//+wlv//6IA//+iAP/858P//OK2//+iAP//ogD//dmc//znw///pw3//6IA//6wJ//83qn//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//cdo//+iAP//ogD//dmc//znw//858P//OfD//znw///pw3//6IA//+nDf/83qn//dmc//+nDf//ogD//6sa//znw//92Zz//6IA//+iAP/858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//N6p//3HaP/+sCf//6IA//+iAP//ogD//6IA//+iAP//qxr//dmc//3ZnP//pw3//6IA//6+Tv/858P//dmc//+iAP//ogD//OfD//znw//9x2j//sJb//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw///ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP/+vk7//OfD//znw//91Y///OK2//znw//858P//dWP//3Vj//9x2j//rlB//+nDf//pw3//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//3Ldf//ogD//6IA//+iAP//ogD//6IA//60NP/+tDT//cdo//zitv/+tDT//rQ0//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP/83qn//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//dmc//+iAP/+sCf//OfD//znw//858P//dWP//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//+iAP//ogD//6IA//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//cdo//zeqf/858P//OfD//znw//858P//rQ0//60NP/+tDT//rQ0//60NP/9x2j//cdo//3HaP/91Y///dWP//zeqf/858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//+KAP/858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//4oA//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw//858P//OfD//znw///igD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @match        http*://www.wenku8.net/*
// @match        http*://www.wenku8.cc/*
// @connect      wenku8.com
// @connect      wenku8.net
// @connect      greasyfork.org
// @connect      image.kieng.cn
// @connect      sm.ms
// @connect      catbox.moe
// @connect      liumingye.cn
// @connect      p.sda1.dev
// @connect      api.pandaimg.com
// @connect      imagelol.com
// @connect      pic.jitudisk.com
// @connect      cdn.jsdelivr.net
// @connect      cdnjs.cloudflare.com
// @connect      bowercdn.net
// @connect      unpkg.com
// @connect      cdn.bootcdn.net
// @connect      kit.fontawesome.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        unsafeWindow
// @require      https://greasyfork.org/scripts/427726-gbk-url-js/code/GBK_URLjs.js?version=953098
// @require      https://greasyfork.org/scripts/431490-greasyforkscriptupdate/code/GreasyForkScriptUpdate.js?version=965063
// @require      https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.13.1/alertify.min.js
// @require      https://unpkg.com/@popperjs/core@2
// @require      https://unpkg.com/tippy.js@6
// @resource     alertify-css    https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.13.1/css/alertify.min.css
// @resource     alertify-theme  https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.13.1/css/themes/default.min.css
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/416310/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%2B%20%28v1%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416310/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%2B%20%28v1%29.meta.js
// ==/UserScript==

/* 需求记录 [容易(优先级高) ➡️ 困难(优先级低)(我懒，一般而言优先做低难度的)]
** [已完成]{BK}书评页提供用户书评搜索
** {BK}图片大小（最大）限制
** [已完成]{BK}回复区插入@好友
** [已完成]全卷/分卷下载：文件重命名为书名，而不是书号
** · [已完成]添加单文件下载重命名
** {BK}回复区悬浮显示
** {热忱}[已完成]修复https引用问题
** [已完成]书评打开最后一页
** [待完善]书评实时更新
** · [待完善]新回复直接添加到当前页面
** · 主动回复内容直接添加到当前页面
** [待完善]引用回复
** · [已完成]引用楼层号和回复内容
** · [已完成]仅引用楼层号
** [已完成]支持preview版tag搜索
** [高优先级]备注功能
   · [待完善]用户备注
   · 小说备注
   · [低优先级]阅读随笔（这真的可能实现吗？？）
** [待完善]书评帖子收藏
** · [已完成]书评页面收藏
** · [高优先级]收藏的书评页面可以添加编辑备注
** [已完成]每日自动推书
** [待完善]{热忱}快速切换账号
** · [已完成]为每个账号储存单独的配置
** · [待完善]保存账号信息并快速自动切换
** [待完善]快速插入图片/表情
** · [已完成]直接插入本地图片
** · [持续进行]更多图床
** · [低优先级]保存常用图片/表情链接
** [部分完成]{BK}页面美化
** · [已完成]阅读页去除广告
** · [已完成]阅读页美化
** · [已完成]书评页美化
** · …
** [高优先级][施工中]脚本储存管理界面
** [高优先级][待完善]稍后再读(可以的话，请给我提出改进建议)
** {BK}类似ehunter的阅读模式
** 改进旧代码：
** · 每个page-addon内部要按照功能分模块，执行功能靠调用模块，不能直接写功能代码
** · 共性模块要写进脚本全局作用域，可以的话写成构造函数
** [低优先级]{RC}书评：@某人时通知他
** [待完善]{BK}书评：草稿箱功能
** {热忱}{s1h2}提供带文字和插图的epub整合下载
*/
/* API记录
** 阅读API：http://dl.wenku8.com/pack.php?aid=2478&vid=92914
** 回帖API：https://www.wenku8.net/modules/article/reviewshow.php?rid=209631&aid=2751
** 查人API：https://www.wenku8.net/modules/article/reviewslist.php?keyword=136877
** 读书API：https://www.wenku8.net/modules/article/reader.php?aid=2946
** 好友API：https://www.wenku8.net/myfriends.php  // 好友名称选择器：content.querySelectorAll('tr>td.odd:nth-child(1)')
** 登录API：https://www.wenku8.net/login.php?do=submit&jumpurl=http%3A%2F%2Fwww.wenku8.net%2Findex.php
** 最新回复:https://www.wenku8.net/modules/article/reviewslist.php?t=1
** 检查更新:https://greasyfork.org/zh-CN/scripts/416310/code/script.meta.js
*/
/* 账号收藏
** wenku8高仿号（按照相似度排列）：
** ** https://www.wenku8.net/userpage.php?uid=912148
** ** https://www.wenku8.net/userpage.php?uid=728810
** ** https://www.wenku8.net/userpage.php?uid=917768
** BK高仿号
** ** https://www.wenku8.net/userpage.php?uid=918609
** 热忱高仿号
** ** https://www.wenku8.net/userpage.php?uid=918764
** 隐身鱼高仿号
** ** https://www.wenku8.net/userpage.php?uid=918773
*/
(function FUNC_MAIN() {
    'use strict';

    // Polyfills
	const script_name = '轻小说文库+';
	const script_version = '1.7.4.3';
	const NMonkey_Info = {
		GM_info: {
			script: {
				name: script_name,
				author: 'PY-DNG',
				version: script_version,
			}
		},
		mainFunc: FUNC_MAIN,
		name: 'wenku8_plus',
		requires: [
			// GBK-URL
			{
				name: 'GBK-URL',
				src: 'https://greasyfork.org/scripts/427726-gbk-url-js/code/GBK_URLjs.js?version=953098',
				srcset: [
					'https://cdn.jsdelivr.net/gh/PYUDNG/CDN@eed1fcf0e901348bc4e752fd483bcb571ebe0408/js/GBK_URL/GBK.js',
				],
				loaded: () => (typeof $URL === 'object'),
				execmode: 'function'
			},

			// GreasyForkScriptUpdate
			{
				name: 'GreasyForkScriptUpdate',
				src: 'https://greasyfork.org/scripts/431490-greasyforkscriptupdate/code/GreasyForkScriptUpdate.js?version=965063',
				srcset: [
					'https://cdn.jsdelivr.net/gh/PYUDNG/CDN@94fc2bdd313f7bf2af6db5b8699effee8dd0b18d/js/ajax/GreasyForkScriptUpdate.js',
				],
				loaded: () => (typeof GreasyForkUpdater === 'function'),
				execmode: 'eval'
			},

			// Alertify
			{
				name: 'Alertify',
				src: 'https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.13.1/alertify.min.js',
				srcset: [
					'https://cdn.jsdelivr.net/gh/MohammadYounes/AlertifyJS@3151fa0d65909936afcbb2f1665ed4f20767bee5/build/alertify.min.js',
					'https://bowercdn.net/c/alertify-js-1.13.1/build/alertify.min.js',
					'https://cdn.bootcdn.net/ajax/libs/AlertifyJS/1.9.0/alertify.min.js',
				],
				loaded: () => (typeof alertify === 'object'),
				execmode: 'function'
			},

			// FontAwesome
			/*
			{
				src: 'https://kit.fontawesome.com/1288cd6170.js',
				loaded: () => (typeof(FontAwesomeKitConfig) === 'object')
			}
			*/

			// Tippy.js
			{
				name: 'Tippy.js-Core',
				src: 'https://unpkg.com/@popperjs/core@2',
				loaded: () => (typeof tippy === 'function'),
				execmode: 'function'
			},
			{
				name: 'Tippy.js',
				src: 'https://unpkg.com/tippy.js@6',
				loaded: () => (typeof tippy === 'function'),
				execmode: 'function'
			},
		],
		resources: [
			// Alertify css
			{
				src: 'https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.13.1/css/alertify.min.css',
				srcset: [
					'https://cdn.jsdelivr.net/gh/MohammadYounes/AlertifyJS@3151fa0d65909936afcbb2f1665ed4f20767bee5/build/css/alertify.min.css',
					'https://bowercdn.net/c/alertify-js-1.13.1/build/css/alertify.min.css',
					'https://cdn.bootcdn.net/ajax/libs/AlertifyJS/1.9.0/css/alertify.min.css',
				],
				name: 'alertify-css',
				isCss: true
			},

			// Alertify theme
			{
				src: 'https://cdnjs.cloudflare.com/ajax/libs/AlertifyJS/1.13.1/css/themes/default.min.css',
				srcset: [
					'https://cdn.jsdelivr.net/gh/MohammadYounes/AlertifyJS@3151fa0d65909936afcbb2f1665ed4f20767bee5/build/css/themes/default.min.css',
					'https://bowercdn.net/c/alertify-js-1.13.1/build/css/themes/default.min.css',
					'https://cdn.bootcdn.net/ajax/libs/AlertifyJS/1.9.0/css/themes/default.min.css',
				],
				name: 'alertify-theme',
				isCss: true
			},

			// tooltip
			/*
			{
				src: 'https://cdn.jsdelivr.net/gh/PYUDNG/css-components@main/build/tooltip/tooltip.css',
				srcset: [
					'',
				],
				name: 'css-tooltip',
				isCss: true
			},
			*/

			// FontAwesome
			/*
			{
				src: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.1.1/css/all.min.css',
				srcset: [
					'https://bowercdn.net/c/fontAwesome-6.1.1/css/all.min.css',
					'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css',
				],
				name: 'css-fontawesome',
				isCss: true
			}
			*/
		]
	};
    const NMonkey_Ready = NMonkey(NMonkey_Info);
	if (!NMonkey_Ready) {return false;}
	polyfill_replaceAll();

    // CONSTS
	const NUMBER_MAX_XHR = typeof mbrowser === 'object' ? 1 : 10;
	const NUMBER_LOGSUCCESS_AFTER = NUMBER_MAX_XHR * 2;
	const NUMBER_ELEMENT_LOADING_WAIT_INTERVAL = 500;

	const KEY_CM = 'Config-Manager';
	const KEY_CM_VERSION = 'version';
	const VALUE_CM_VERSION = '0.3';

	const KEY_DRAFT_DRAFTS = 'comment-drafts';
	const KEY_DRAFT_VERSION = 'version';
	const VALUE_DRAFT_VERSION = '0.2';

	const KEY_REVIEW_PREFS = 'comment-preferences';
	const KEY_REVIEW_VERSION = 'version';
	const VALUE_REVIEW_VERSION = '0.9';

	const KEY_BOOKCASES = 'book-cases';
	const KEY_BOOKCASE_VERSION = 'version';
	const VALUE_BOOKCASE_VERSION = '0.5';

	const KEY_ATRCMMDS = 'auto-recommends';
	const KEY_ATRCMMDS_VERSION = 'version';
	const VALUE_ATRCMMDS_VERSION = '0.2';

	const KEY_USRDETAIL = 'user-detail';
	const KEY_USRDETAIL_VERSION = 'version';
	const VALUE_USRDETAIL_VERSION = '0.2';

	const KEY_BEAUTIFIER = 'beautifier';
	const KEY_BEAUTIFIER_VERSION = 'version';
	const VALUE_BEAUTIFIER_VERSION = '0.9';

	const KEY_REMARKS = 'remarks';
	const KEY_REMARKS_VERSION = 'version';
	const VALUE_REMARKS_VERSION = '0.1';

	const KEY_USERGLOBAL = 'user-global-config';
	const KEY_USERGLOBAL_VERSION = 'version';
	const VALUE_USERGLOBAL_VERSION = '0.1';

	const VALUE_STR_NULL = 'null';

	const URL_NOVELINDEX   = `https://${location.host}/book/{I}.htm`;
	const URL_REVIEWSEARCH = `https://${location.host}/modules/article/reviewslist.php?keyword={K}`;
	const URL_REVIEWSHOW   = `https://${location.host}/modules/article/reviewshow.php?rid={R}&aid={A}&page={P}`;
	const URL_REVIEWSHOW_1 = `https://${location.host}/modules/article/reviewshow.php?rid={R}`;
	const URL_REVIEWSHOW_2 = `https://${location.host}/modules/article/reviewshow.php?rid={R}&page={P}`;
	const URL_REVIEWSHOW_3 = `https://${location.host}/modules/article/reviewshow.php?rid={R}&aid={A}`;
	const URL_REVIEWSHOW_4 = `https://${location.host}/modules/article/reviewshow.php?rid={R}&page={P}#{Y}`;
	const URL_REVIEWSHOW_5 = `https://${location.host}/modules/article/reviewshow.php?rid={R}&aid={A}&page={P}#{Y}`;
	const URL_USERINFO  = `https://${location.host}/userinfo.php?id={K}`;
	const URL_DOWNLOAD1 = `http://${location.host.replace('www.', 'dl.')}/packtxt.php?aid={A}&vid={V}&charset={C}`;
	const URL_DOWNLOAD2 = `http://${location.host.replace('www.', 'dl2.')}/packtxt.php?aid={A}&vid={V}&charset={C}`;
	const URL_DOWNLOAD3 = `http://${location.host.replace('www.', 'dl3.')}/packtxt.php?aid={A}&vid={V}&charset={C}`;
	const URL_PACKSHOW = `https://${location.host}/modules/article/packshow.php?id={A}&type={T}`;
	const URL_BOOKINTRO = `https://${location.host}/book/{A}.htm`;
	const URL_ADDBOOKCASE = `https://${location.host}/modules/article/addbookcase.php?bid={A}`;
	const URL_RECOMMEND = `https://${location.host}/modules/article/uservote.php?id={B}`;
	const URL_TAGSEARCH = `https://${location.host}/modules/article/tags.php?t={TU}`;
	const URL_USRDETAIL = `https://${location.host}/userdetail.php`;
	const URL_USRFRIEND = `https://${location.host}/myfriends.php`;
	const URL_BOOKCASE  = `https://${location.host}/modules/article/bookcase.php`;
	const URL_USRLOGIN  = `https://${location.host}/login.php?do=submit&jumpurl=http%3A%2F%2F${location.host}%2Findex.php`;
	const URL_USRLOGOFF = `https://${location.host}/logout.php`;

	const DATA_XHR_LOGIN = [
		"username={U}",
		"password={P}",
		"usecookie={C}",
		"action=login",
		"submit=%26%23160%3B%B5%C7%26%23160%3B%26%23160%3B%C2%BC%26%23160%3B" // '&#160;登&#160;&#160;录&#160'
	].join('&');
	const DATA_IMAGERS = {
		default: 'SDAIDEV',
		/* Imager Model
		_IMAGER_KEY_: {
			available: true,
			name: '_IMAGER_DISPLAY_NAME_',
			tip: '_IMAGER_DISPLAY_TIP_',
			upload: {
				request: {
					url: '_UPLOAD_URL_',
					data: {
						'_FORM_NAME_FOR_FILE_': '$file$'
					}
				},
				response: {
					checksuccess: (json)=>{return json._SUCCESS_KEY_ === '_SUCCESS_VALUE_';},
					geturl: (json)=>{return json._PATH_._SUCCESS_URL_KEY_;},
					getname: (json)=>{return json._PATH_ ? json._PATH_._FILENAME_ : null;},
					getsize: (json)=>{return json._PATH_._SIZE_},
					getpage: (json)=>{return json._PATH_ ? json._PATH_._PAGE_ : null;},
					gethash: (json)=>{return json._PATH_ ? json._PATH_._HASH_ : null;},
					getdelete: (json)=>{return json._PATH_ ? json._PATH_._DELETE_ : null;}
				}
			},
			isImager: true
		},
		*/
		LIUMINGYE: {
			available: true,
			name: '刘明野-全能图床',
			tip: '2021-12-04测试可用</br>理论无上传大小限制，实际测试图片过大会上传失败',
			upload: {
				request: {
					url: 'https://tool.liumingye.cn/tuchuang/update.php',
					data: {
						'file': '$file$'
					}
				},
				response: {
					checksuccess: (json)=>{return json.code === 0;},
					geturl: (json)=>{return json.msg;}
				}
			},
			isImager: true
		},
		PANDAIMG: {
			available: true,
			name: '熊猫图床',
			tip: '2022-01-16测试可用</br>单张图片最大5MB',
			upload: {
				request: {
					url: 'https://api.pandaimg.com/upload',
					data: {
						'file': '$file$',
						'classifications': '',
						'day': '0'
					},
					headers: {
						'usersOrigin': '5edd88d4dfe5d288518c0454d3ccdd2a'
					}
				},
				response: {
					checksuccess: (json)=>{return json.code === '200';},
					geturl: (json)=>{return json.data.url;},
					getname: (json)=>{return json.data.name;}
				}
			},
			isImager: true
		},
		SDAIDEV: {
			available: true,
			name: '流浪图床',
			tip: '2022-01-09测试可用</br>单张图片最大5MB',
			upload: {
				request: {
					url: 'https://p.sda1.dev/api/v1/upload_external_noform',
					urlargs: {
						'filename': '$filename$',
						'ts': '$time$',
						'rand': '$random$'
					}
				},
				response: {
					checksuccess: (json)=>{return json.success;},
					geturl: (json)=>{return json.data.url;},
					getdelete: (json)=>{return json.data ? json.data.delete_url : null;},
					getsize: (json)=>{return json.data ? json.data.size : null;}
				}
			},
			isImager: true
		},
		JITUDISK: {
			available: true,
			name: '极兔兔床',
			tip: '2022-02-02测试可用',
			upload: {
				request: {
					url: 'https://pic.jitudisk.com/api/upload',
					data: {
						'image': '$file$'
					}
				},
				response: {
					checksuccess: (json)=>{return json.code === 200;},
					geturl: (json)=>{return json.data.url;},
					getname: (json)=>{return json.data.name;}
				}
			},
			isImager: true
		},
		IMAGELOL: {
			available: false,
			name: '笑果图床',
			tip: '2022-01-17测试可用</br>该图床不支持重复上传同一张图片，请注意</br>单张图片最大2MB',
			upload: {
				request: {
					url: 'https://imagelol.com/json',
					data: {
						'source': '$file$',
						'type': 'file',
						'action': 'upload',
						'timestamp': '$time$',
						'auth_token': '4f6fb8d04525bae5a455f4f09e2b09aa750e60c3',
						'nsfw': '0'
					}
				},
				response: {
					checksuccess: (json)=>{return json.status_code === 200 && json.success && json.success.code === 200;},
					geturl: (json)=>{return json.image.url;},
					getname: (json)=>{return json.image.original_filename;},
					getsize: (json)=>{return json.image.size},
					gethash: (json)=>{return json.image.md5;},
				}
			},
			isImager: true
		},
		/*GEJIBA: {
			available: true,
			name: '老王图床',
			tip: '2022-01-17测试可用</br>单张图片最大10MB</br>PS：此图床审核比较严格',
			upload: {
				request: {
					url: '_UPLOAD_URL_',
					data: {
						'_FORM_NAME_FOR_FILE_': '$file$'
					}
				},
				response: {
					checksuccess: (json)=>{return json._SUCCESS_KEY_ === '_SUCCESS_VALUE_';},
					geturl: (json)=>{return json._PATH_._SUCCESS_URL_KEY_;},
					getname: (json)=>{return json._PATH_ ? json._PATH_._FILENAME_ : null;},
					getsize: (json)=>{return json._PATH_._SIZE_},
					getpage: (json)=>{return json._PATH_ ? json._PATH_._PAGE_ : null;},
					gethash: (json)=>{return json._PATH_ ? json._PATH_._HASH_ : null;},
					getdelete: (json)=>{return json._PATH_ ? json._PATH_._DELETE_ : null;}
				}
			}
		},*/
		KIENG_JD: {
			available: false,
			name: 'KIENG-JD',
			tip: '默认图床</br>个人体验良好，推荐使用',
			upload: {
				request: {
					url: 'https://image.kieng.cn/upload.html?type=jd',
					data: {
						'image': '$file$'
					}
				},
				response: {
					checksuccess: (json)=>{return json.code === 200;},
					geturl: (json)=>{return json.data.url;},
					getname: (json)=>{return json.data.name;}
				}
			},
			isImager: true
		},
		KIENG_SG: {
			available: false,
			name: 'KIENG-SG',
			upload: {
				request: {
					url: 'https://image.kieng.cn/upload.html?type=sg',
					data: {
						'image': '$file$'
					}
				},
				response: {
					checksuccess: (json)=>{return json.code === 200;},
					geturl: (json)=>{return json.data.url;},
					getname: (json)=>{return json.data.name;}
				}
			},
			isImager: true
		},
		KIENG_58: {
			available: false,
			name: 'KIENG-58',
			upload: {
				request: {
					url: 'https://image.kieng.cn/upload.html?type=c58',
					data: {
						'image': '$file$'
					}
				},
				response: {
					checksuccess: (json)=>{return json.code === 200;},
					geturl: (json)=>{return json.data.url;},
					getname: (json)=>{return json.data.name;}
				}
			},
			isImager: true
		},
		KIENG_WY: {
			available: false,
			name: 'KIENG-WY',
			upload: {
				request: {
					url: 'https://image.kieng.cn/upload.html?type=wy',
					data: {
						'image': '$file$'
					}
				},
				response: {
					checksuccess: (json)=>{return json.code === 200;},
					geturl: (json)=>{return json.data.url;},
					getname: (json)=>{return json.data.name;}
				}
			},
			isImager: true
		},
		KIENG_QQ: {
			available: false,
			name: 'KIENG-QQ',
			upload: {
				request: {
					url: 'https://image.kieng.cn/upload.html?type=qq',
					data: {
						'image': '$file$'
					}
				},
				response: {
					checksuccess: (json)=>{return json.code === 200;},
					geturl: (json)=>{return json.data.url;},
					getname: (json)=>{return json.data.name;}
				}
			},
			isImager: true
		},
		KIENG_SN: {
			available: false,
			name: 'KIENG-SN',
			upload: {
				request: {
					url: 'https://image.kieng.cn/upload.html?type=sn',
					data: {
						'image': '$file$'
					}
				},
				response: {
					checksuccess: (json)=>{return json.code === 200;},
					geturl: (json)=>{return json.data.url;},
					getname: (json)=>{return json.data.name;}
				}
			},
			isImager: true
		},
		KIENG_HL: {
			available: false,
			name: 'KIENG-HLX',
			upload: {
				request: {
					url: 'https://image.kieng.cn/upload.html?type=hl',
					data: {
						'image': '$file$'
					}
				},
				response: {
					checksuccess: (json)=>{return json.code === 200;},
					geturl: (json)=>{return json.data.url;},
					getname: (json)=>{return json.data.name;}
				}
			},
			isImager: true
		},
		SMMS: {
			available: true,
			name: 'SM.MS',
			tip: '注意：此图床跨域访问较不稳定，且有用户反映其被国内部分服务商屏蔽，请谨慎使用此图床',
			warning: '注意：此图床跨域访问较不稳定，且有用户反映其被国内部分服务商屏蔽，请谨慎使用此图床</br>如出现上传错误/图片加载慢/无法加载图片等情况，请更换其他图床',
			upload: {
				request: {
					url: 'https://sm.ms/api/v2/upload?inajax=1',
					data: {
						'smfile': '$file$'
					}
				},
				response: {
					checksuccess: (json)=>{return json.success === true || /^https?:\/\//.test(json.images);},
					geturl: (json)=>{return json.data ? json.data.url : json.images;},
					getname: (json)=>{return json.data ? json.data.filename : null;},
					getpage: (json)=>{return json.data ? json.data.page : null;},
					gethash: (json)=>{return json.data ? json.data.hash : null;},
					getdelete: (json)=>{return json.data ? json.data.delete : null;}
				}
			},
			isImager: true
		},
		CATBOX: {
			available: true,
			name: 'CatBox',
			tip: '注意：此图床访问较不稳定，请谨慎使用此图床',
			warning: '注意：此图床访问较不稳定，请谨慎使用此图床</br>如出现上传错误/图片加载慢/无法加载图片等情况，请更换其他图床',
			upload: {
				request: {
					url: 'https://catbox.moe/user/api.php',
					responseType: 'text',
					data: {
						'fileToUpload': '$file$',
						'reqtype': 'fileupload'
					}
				},
				response: {
					checksuccess: (text)=>{return true;},
					geturl: (text)=>{return text;}
				}
			},
			isImager: true
		}
	};

	const FUNC_LATERBOOK_SORTERS = {
		'addTime_old2new': {
			name: '由旧到新',
			sorter: (a, b) => (a.addTime - b.addTime),
		},
		'addTime_new2old': {
			name: '由新到旧',
			sorter: (a, b) => (b.addTime - a.addTime),
		},
		'sort': {
			name: '手动排序',
			sorter: (a, b) => (a.sort - b.sort),
		}
	}

	const CLASSNAME_BUTTON = 'plus_btn';
	const CLASSNAME_TEXT = 'plus_text';
	const CLASSNAME_DISABLED = 'plus_disabled';
	const CLASSNAME_BOOKCASE_FORM = 'plus_bcform';
	const CLASSNAME_LIST = 'plus_list';
	const CLASSNAME_LIST_ITEM = 'plus_list_item';
	const CLASSNAME_LIST_BUTTON = 'plus_list_input';
	const CLASSNAME_MODIFIED = 'plus_modified';

	const HTML_BOOK_COPY = '<span class="{C}">[复制]</span>'.replace('{C}', CLASSNAME_BUTTON);
	const HTML_BOOK_META = '{K}：{V}<span class="{C}">[复制]</span>'.replace('{C}', CLASSNAME_BUTTON);
	const HTML_BOOK_TAG = '<a class="{C}" href="{U}" target="_blank">{TN}</span>'.replace('{C}', CLASSNAME_BUTTON).replace('{U}', URL_TAGSEARCH);
    const HTML_DOWNLOAD_CONTENER = '<div id="dctn" style=\"margin:0px auto;overflow:hidden;\">\n<fieldset style=\"width:820px;height:35px;margin:0px auto;padding:0px;\">\n<legend><b>《{BOOKNAME}》小说TXT简繁全本下载</b></legend>\n</fieldset>\n</div>';
    const HTML_DOWNLOAD_LINKS_OLD = '<div id="txtfull" style="margin:0px auto;overflow:hidden;"><fieldset style="width:820px;height:35px;margin:0px auto;padding:0px;"><legend><b>《{ORIBOOKNAME}》小说TXT全本下载</b></legend><div style="width:16%; float:left; text-align:center;"><a href="http://dl.wenku8.com/down.php?type=txt&amp;id={BOOKID}">G版原始下载</a></div><div style="width:16%; float:left; text-align:center;"><a href="http://dl.wenku8.com/down.php?type=txt&amp;id={BOOKID}&amp;fname={BOOKNAME}.txt">G版自动重命名</a></div><div style="width:16%; float:left; text-align:center;"><a href="http://dl.wenku8.com/down.php?type=utf8&amp;id={BOOKID}">U版原始下载</a></div><div style="width:16%; float:left; text-align:center;"><a href="http://dl.wenku8.com/down.php?type=utf8&amp;id={BOOKID}&amp;fname={BOOKNAME}">U版自动重命名</a></div><div style="width:16%; float:left; text-align:center;"><a href="http://dl.wenku8.com/down.php?type=big5&amp;id={BOOKID}">繁体原始下载</a></div><div style="width:16%; float:left; text-align:center;"><a href="http://dl.wenku8.com/down.php?type=big5&amp;id={BOOKID}&amp;fname={BOOKNAME}">繁体自动重命名</a></div></fieldset></div>'.replaceAll('{C}', CLASSNAME_BUTTON);
	const HTML_DOWNLOAD_LINKS = `<div style="margin:0px auto;overflow:hidden;"><fieldset style="width:820px;height:35px;margin:0px auto;padding:0px;"><legend><b>《{ORIBOOKNAME}》小说TXT、UMD、JAR电子书下载</b></legend><div style="width:210px; float:left; text-align:center;"><a href="https://${location.host}/modules/article/packshow.php?id={BOOKID}&amp;type=txt{CHARSET}">TXT简繁分卷</a></div><div style="width:210px; float:left; text-align:center;"><a href="https://${location.host}/modules/article/packshow.php?id={BOOKID}&amp;type=txtfull{CHARSET}">TXT简繁全本</a></div><div style="width:210px; float:left; text-align:center;"><a href="https://${location.host}/modules/article/packshow.php?id={BOOKID}&amp;type=umd{CHARSET}">UMD分卷下载</a></div><div style="width:190px; float:left; text-align:center;"><a href="https://${location.host}/modules/article/packshow.php?id={BOOKID}&amp;type=jar{CHARSET}">JAR分卷下载</a></div></fieldset></div>`;
    const HTML_DOWNLOAD_BOARD = '<span class="{C}">阅读与下载限制已解除</br>此功能仅供学习交流，请支持正版<span style="text-align: right;">——{N}</span></span>'.replace('{N}', GM_info.script.name).replace('{C}', CLASSNAME_TEXT);
    const CSS_DOWNLOAD = '.even {display: grid; grid-template-columns: repeat(3, 1fr); text-align: center;} .dlink {text-align: center;}';
	const CSS_PAGE_API = 'body>div {display: flex; align-items: center; justify-content: center;}';
    const CSS_COLOR_BTN_NORMAL = 'rgb(0, 160, 0)', CSS_COLOR_BTN_HOVER = 'rgb(0, 100, 0)', CSS_COLOR_FLOOR_MODIFIED = '#CCCCFF';
    const CSS_COMMON = '.{CT} {color: rgb(30, 100, 220) !important;} .{CB} {color: rgb(0, 160, 0) !important; cursor: pointer !important; user-select: none;} .{CB}:hover {color: rgb(0, 100, 0) !important;} .{CB}:focus {color: rgb(0, 100, 0) !important;} .{CB}.{CD} {color: rgba(150, 150, 150) !important; cursor: not-allowed !important;}'.replaceAll('{CB}', CLASSNAME_BUTTON).replaceAll('{CT}', CLASSNAME_TEXT).replaceAll('{CD}', CLASSNAME_DISABLED)
	                 + '.{CAT}>ul {list-style: none; text-align: center; padding: 0px; margin: 0px;} .{CAT} {position: absolute; zIndex: 999; backgroundColor: #f5f5f5; float: left; clear: both; height: 180px; overflow-y: auto; overflow-x: visible;} .{CLI} {display: block; list-style: outside none none; margin: 0px; border: 1px solid rgb(204, 204, 204);} .{CLB} {border: 0px; width: 100%; height: 100%; cursor: pointer; padding: 0 0.5em;}'.replaceAll('{CAT}', CLASSNAME_LIST).replaceAll('{CLI}', CLASSNAME_LIST_ITEM).replaceAll('{CLB}', CLASSNAME_LIST_BUTTON)
	                 + '.tippy-box[data-theme~="wenku_tip"] {background-color: #f0f7ff;color: black;border: 1px solid #a3bee8;}.tippy-box[data-theme~="wenku_tip"][data-placement^="top"]>.tippy-arrow::before {border-top-color: #a3bee8;}.tippy-box[data-theme~="wenku_tip"][data-placement^="left"]>.tippy-arrow::before {border-left-color: #a3bee8;}.tippy-box[data-theme~="wenku_tip"][data-placement^="right"]>.tippy-arrow::before {border-right-color: #a3bee8;}.tippy-box[data-theme~="wenku_tip"][data-placement^="bottom"]>.tippy-arrow::before {border-bottom-color: #a3bee8;}';
	const CSS_COMMONBEAUTIFIER = '.plus_cbty_image {position: fixed;top: 0;left: 0;z-index: -2;}.plus_cbty_cover {position: fixed;top: 0;left: calc((100vw - 960px) / 2);z-Index: -1;background-color: rgba(255,255,255,0.7);width: 960px;height: 100vh;}body {overflow: auto;}body>.main {position: relative;margin-left: 0;margin-right: 0;left: calc((100vw - 960px) / 2);}body.plus_cbty table.grid td, body.plus_cbty .odd, body.plus_cbty .even, body.plus_cbty .blockcontent {background-color: rgba(255,255,255,0) !important;}.textarea, .text {background-color: rgba(255,255,255,0.9);}#headlink{background-color: rgba(255,255,255,0.7);}';
	const CSS_REVIEWSHOW ='body {overflow: auto;background-image: url({BGI});}#content > table > tbody > tr > td {background-color: rgba(255,255,255,0.7) !important;overflow: auto;}body.plus_cbty #content > table > tbody > tr > td {background-color: rgba(255,255,255,0) !important;overflow: auto;}#content {height: 100vh;overflow: auto;}.m_top, .m_head, .main.nav, .m_foot {display: none;}.main {margin-top: 0px;}#content table div[style*="width:100%"]{font-size: calc(1em * {S}/ 100);line-height: 100%;}.jieqiQuote, .jieqiCode, .jieqiNote {font-size: inherit;}.{M}{background-color: {C}}'.replace('{M}', CLASSNAME_MODIFIED).replace('{C}', CSS_COLOR_FLOOR_MODIFIED);
	const CSS_NOVEL = 'html{background-image: url({BGI});}body {width: 100vw;height: 100vh;overflow: overlay;margin: 0px;background-color: rgba(255,255,255,0.7);}#contentmain {overflow-y: auto;height: calc(100vh - {H});max-width: 100%;min-width: 0px;max-width: 100vw;}#adv1, #adtop, #headlink, #footlink, #adbottom {overflow: overlay;min-width: 0px;max-width: 100vw;}#adv900, #adv5 {max-width: 100vw;}';
	const CSS_SIDEPANEL = '#sidepanel-panel {background-color: #00000000;z-index: 4000;}.sidepanel-button {font-size: 1vmin;color: #1E64DC;background-color: #FDFDFD;}.sidepanel-button:hover, .sidepanel-button.low-opacity:hover {opacity: 1;color: #FDFDFD;background-color: #1E64DC;}.sidepanel-button.low-opacity{opacity: 0.4 }.sidepanel-button>i[class^="fa-"] {line-height: 3vmin;width: 3vmin;}.sidepanel-button[class*="tooltip"]:hover::after {font-size: 0.9rem;top: calc((5vmin - 25px) / 2);}.sidepanel-button[class*="tooltip"]:hover::before {top: calc((5vmin - 12px) / 2);}.sidepanel-button.accept-pointer{pointer-events:auto;}';

	const ARR_GUI_BOOKCASE_WIDTH = ['3%', '19%', '9%', '25%', '20%', '9%', '5%', '10%'];

    const TEXT_TIP_COPY = '点击复制';
	const TEXT_TIP_COPIED = '已复制';
    const TEXT_TIP_SERVERCHANGE = '点击切换线路';
	const TEXT_TIP_API_PACKSHOW_LOADING = '正在初始化下载页面，请稍候...';
	const TEXT_TIP_API_PACKSHOW_LOADED = '初始化下载页面成功';
	const TEXT_TIP_INDEX_LATERREADS = '文库首页显示前六本稍后再读书目</br>您可以在书架页面管理稍后阅读书目和调整书籍顺序';
	const TEXT_TIP_SEARCH_OPTION_TAG = '有关标签搜索</br></br>未完善-开发中…</br>官方尚未正式开放此功能</br>功能预览由[轻小说文库+]提供';
	const TEXT_TIP_REVIEW_BEAUTIFUL = '背景图片可以在"用户面板"中设置</br>您可以从文库首页左侧点击进入用户面板';
	const TEXT_TIP_REVIEW_IMG_INSERTURL = '直接插入网络图片的链接地址';
	const TEXT_TIP_REVIEW_IMG_SELECTIMG = '选择本地图片上传到第三方图床，然后再插入图床提供的图片链接</br>您也可以直接拖拽图片到输入框，或者Ctrl+V直接粘贴您剪贴板里面的图片</br>您可以在用户面板中切换图床</br></br>上传图片请遵守法律以及图床使用规定</br>请不要上传违规图片';
	const TEXT_TIP_IMAGE_FIT = '请选择适合您的屏幕宽高比的图片</br>您选择的图片将会被拉伸以适应屏幕的宽高比，图片宽高比与屏幕宽高比相差过大会导致图片扭曲</br>请避免选择文件大小过大的图片，以防止浏览器卡顿';
	const TEXT_TIP_IMAGER_DEFAULT = '</br></br><span class=\'{CT}\'>{N} 默认图床</span>'.replace('{N}', GM_info.script.name).replace('{CT}', CLASSNAME_TEXT);
	const TEXT_TIP_DOWNLOAD_BBCODE = 'BBCODE格式：</br>即文库评论的代码格式</br>相当于引用楼层时自动填入回复框的内容</br>保存为此格式可以保留排版及多媒体信息';
	const TEXT_TIP_ACCOUNT_NOACCOUNT = '没有储存的账号信息</br>请在登录页面手动登录一次，相关帐号信息就会自动储存</br></br>所有储存的账号信息都自动保存在浏览器的本地存储中';
	const TEXT_ALT_SCRIPT_ERROR_AJAX_FA = 'FontAwesome加载失败（自动重试也失败了），可能会影响一部分脚本界面图标和样式的展示，但基本不会影响功能</br>您可以将此消息<a href="https://greasyfork.org/scripts/416310/feedback" class=\'{CB}\'>反馈给开发者</a>以尝试解决问题'.replace('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_DOWNLOAD_BBCODE_NOCHANGE = '帖子正在下载中，请不要更改此设置！';
	const TEXT_ALT_DOWNLOADFINISH_REVIEW = '{T}({I}) 已下载完毕</br>{N} 已保存';
	const TEXT_ALT_DOWNLOADIMG_CONFIRM_TITLE = '确认下载';
	const TEXT_ALT_DOWNLOADIMG_CONFIRM_MESSAGE = '是否要下载 {N} 的全部插图？';
	const TEXT_ALT_DOWNLOADIMG_CONFIRM_OK = '下载';
	const TEXT_ALT_DOWNLOADIMG_CONFIRM_CANCEL = '取消';
	const TEXT_ALT_DOWNLOADIMG_STATUS_INDEX = '正在获取小说目录...';
	const TEXT_ALT_DOWNLOADIMG_STATUS_LOADING = '正在下载: {CCUR}/{CALL}';
	const TEXT_ALT_DOWNLOADIMG_STATUS_FINISH = '全部插图下载完毕：）';
	const TEXT_ALT_BOOK_AFTERBOOKS_ADDED = '已添加到稍后再读';
	const TEXT_ALT_BOOK_AFTERBOOKS_REMOVED = '已将其从稍后再读中移除';
	const TEXT_ALT_BOOKCASE_AFTERBOOKS_MISSING = '看起来这本书并不在稍后再读的列表里呢</br>是不是已经在其他的标签页里把它从稍后再读中移除了？';
	const TEXT_ALT_BOOKCASE_AFTERBOOKS_V4BUG = '由于历史版本脚本的一个bug，您的<i>稍后再读</i>列表的小说排序被打乱了（非常抱歉）</br>而现在这个bug已经修复，<i>稍后再读</i>列表的小说排序也许需要您重新调整一次</br><span class="{CB}">[我知道了]</span>'.replaceAll('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_AUTOREFRESH_ON = '页面自动刷新已开启';
	const TEXT_ALT_AUTOREFRESH_OFF = '页面自动刷新已关闭';
	const TEXT_ALT_AUTOREFRESH_NOTLAST = '请先翻到最后一页再开启页面自动刷新</br><span class="{CB}">[点击这里翻到最后一页]</span>'.replaceAll('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_AUTOREFRESH_WORKING = '正在获取新的回复...';
	const TEXT_ALT_AUTOREFRESH_NOMORE = '木有新的回复';
	const TEXT_ALT_AUTOREFRESH_APPLIED = '发现了新的回复，页面已更新～</br>'.replaceAll('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_AUTOREFRESH_MODIFIED = '发现已有楼层内容变更，已对其进行了颜色标记</br>点击标记区域即可恢复原来的颜色';
	const TEXT_ALT_BEAUTIFUL_ON = '页面美化已开启</br>您可能需要刷新页面使其生效';
	const TEXT_ALT_BEAUTIFUL_OFF = '页面美化已关闭</br>您可能需要刷新页面使其生效';
	const TEXT_ALT_FAVORITE_LAST_ON = '将在点击收藏的帖子时打开最后一页';
	const TEXT_ALT_FAVORITE_LAST_OFF = '将在点击收藏的帖子时打开第一页';
	const TEXT_ALT_IMAGE_FORMATERROR = '很遗憾，您选择的图片格式无法识别</br>（建议选择jpeg,png）！';
	const TEXT_ALT_IMAGE_UPLOAD_WORKING = '正在上传图片…';
	const TEXT_ALT_IMAGE_DOWNLOAD_WORKING = '正在下载图片…';
	const TEXT_ALT_IMAGE_UPLOAD_SUCCESS = '图片上传成功！</br>文件名: {NAME}</br>URL: {URL}';
	const TEXT_ALT_IMAGE_DOWNLOAD_SUCCESS = '图片下载成功！</br>已经将背景图片 {NAME} 保存在本地';
	const TEXT_ALT_IMAGE_RESPONSE_NONAME = '空(服务器没有返回文件名)';
	const TEXT_ALT_IMAGE_UPLOAD_ERROR = '上传错误！';
	const TEXT_ALT_TEXTSCALE_CHANGED = '字体缩放已保存：{S}%';
	const TEXT_ALT_CONFIG_EXPORTED = '配置文件已导出</br>文件名：{N}';
	const TEXT_ALT_CONFIG_IMPORTED = '配置文件已导入';
	const TEXT_ALT_IMAGER_RESET = '由于{O}已失效，您的图床已自动切换到{N}';
	const TEXT_ALT_IMAGER_NOAVAILBLE = '{O}已失效';
	const TEXT_ALT_META_COPIED = '{M} 已复制';
	const TEXT_ALT_ATRCMMDS_SAVED = '已保存：《{B}》</br>每日自动推荐{N}次</br>每日还可推荐{R}次';
	const TEXT_ALT_ATRCMMDS_INVALID = '未保存：{N}不是非负整数';
	const TEXT_ALT_ATRCMMDS_OVERFLOW = '注意：</br>您的用户信息显示您每天最多推荐{V}票</br>当前您已设置每日推荐合计{C}票</br><span class="{CB}">[单击此处以立即更新您的用户信息]</span>'.replaceAll('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_ATRCMMDS_AUTO = '已开启自动推书';
	const TEXT_ALT_ATRCMMDS_NOAUTO = '已关闭自动推书';
	const TEXT_ALT_ATRCMMDS_ALL_START = '{S}：正在自动推书...'.replaceAll('{S}', GM_info.script.name);
	const TEXT_ALT_ATRCMMDS_RUNNING = '正在推荐书目：</br>{BN}({BID})';
	const TEXT_ALT_ATRCMMDS_DONE = '推荐完成：</br>{BN}({BID})';
	const TEXT_ALT_ATRCMMDS_ALL_DONE = '全部书目推荐完成：</br>{R}';
	const TEXT_ALT_ATRCMMDS_NOTASK = '木有要推荐的书目╮(￣▽￣)╭';
	const TEXT_ALT_ATRCMMDS_NOTASK_OPENBC = '您还没有设置每日自动推荐的书目╮(￣▽￣)╭</br><span class="{CB}">[点击此处打开书架页面进行设置]</span>'.replaceAll('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_ATRCMMDS_NOTASK_PLSSET = '请在\'自动推书\'一栏设置每日推荐的书目及推荐次数';
	const TEXT_ALT_ATRCMMDS_MAXRCMMD = '根据您的头衔，您每日一共可以推荐{V}次';
	const TEXT_ALT_USRDTL_REFRESH = '{S}：正在更新用户信息({T})...'.replaceAll('{S}', GM_info.script.name).replaceAll('{T}', getTime());
	const TEXT_ALT_USRDTL_REFRESHED = '{S}：用户信息已更新</br><span class="{CB}">[点此查看详细信息]</span>'.replaceAll('{S}', GM_info.script.name).replaceAll('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_POLYFILL = '<span class="{CT}">提示：正在使用移动端适配模式</span>'.replaceAll('{CT}', CLASSNAME_TEXT);
	const TEXT_ALT_LASTPAGE_LOADING = '正在获取最后一页，请稍候...';
	const TEXT_ALT_ACCOUNT_SWITCHED = '帐号已切换到 <i>"<span class="{CT}">{N}</span>"</i></br>3s后自动刷新页面</br><span class="{CB}">点击这里取消刷新</span>'.replaceAll('{CT}', CLASSNAME_TEXT).replaceAll('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_ACCOUNT_WORKING_LOGOFF = '正在退出当前账号...';
	const TEXT_ALT_ACCOUNT_WORKING_LOGIN = '正在登录...';
	const TEXT_ALT_SCRIPT_UPDATE_CHECKING = '正在检查脚本更新...';
	const TEXT_ALT_SCRIPT_UPDATE_GOT = '<div class="{CT}">{SN} 有新版本啦！</br>新版本：{NV}</br>当前版本：{CV}</br><span id="script_update_info" class="{CB}">[点击此处 查看 更新]</span></br><span id="script_update_install" class="{CB}">[点击此处 安装 更新]</span></div>'.replaceAll('{CT}', CLASSNAME_TEXT).replaceAll('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_SCRIPT_UPDATE_INFO = '更新信息';
	const TEXT_ALT_SCRIPT_UPDATE_NOINFO = '没有发现更新日志。。';
	const TEXT_ALT_SCRIPT_UPDATE_INSTALL = '安装';
	const TEXT_ALT_SCRIPT_UPDATE_CLOSE = '朕知道了';
	const TEXT_ALT_SCRIPT_UPDATE_NONE = '当前已是最新版本';
	const TEXT_ALT_DETAIL_IMPORTED = '配置导入成功';
	const TEXT_ALT_DETAIL_CONFIG_IMPORT_ERROR_SELECT = '您选择的文件不是配置文件，请检查后再试';
	const TEXT_ALT_DETAIL_CONFIG_IMPORT_ERROR_READ = '配置文件读取出错，请检查是否粘贴了正确的配置文件，以及配置文件是否损坏';
	const TEXT_ALT_DETAIL_MANAGE_NOTFOUND = '该记录已不存在，您是否已经在其他标签页删除它了呢？';
	const TEXT_GUI_API_ADDBOOKCASE_TOBOOKCASE = '进入书架';
	const TEXT_GUI_API_ADDBOOKCASE_REMOVE = '移出本书';
	const TEXT_GUI_API_PACKSHOW_TITLE_LOADING = '初始化下载界面...';
	const TEXT_GUI_API_PACKSHOW_TITLE = '{N} 轻小说TXT分卷下载 - 轻小说文库';
	const TEXT_GUI_UNKNOWN = '未知';
	const TEXT_GUI_DOWNLOAD_THISVOLUME = '下载本卷';
	const TEXT_GUI_DOWNLOAD_THISCHAPTER = '下载本章';
	const TEXT_GUI_NOVEL_FILLING = '</br><span class="{CT}">[轻小说文库+] 正在获取章节内容...</span>'.replaceAll('{CT}', CLASSNAME_TEXT);
	const TEXT_GUI_BOOK_IMAGESDOWNLOAD = '全部插图下载';
	const TEXT_GUI_BOOK_READITLATER = '稍后再读';
	const TEXT_GUI_BOOK_DONTREADLATER = '移出稍后再读';
	const TEXT_GUI_REVIEW_ADDFAVORITE = '收藏本帖：';
	const TEXT_GUI_REVIEW_FAVORADDED = '已收藏 {N}';
	const TEXT_GUI_REVIEW_FAVORDELED = '已从收藏中移除 {N}';
	const TEXT_GUI_REVIEW_BEAUTIFUL = '页面美化：';
	const TEXT_GUI_REVEIW_IMG_INSERTURL = '插入网图链接';
	const TEXT_GUI_REVEIW_IMG_SELECTIMG = '选择本地图片';
	const TEXT_GUI_REVIEW_UNLOCK_WARNING = '<span style="color: red;">仅供测试使用，请勿滥用此功能！</span>';
    const TEXT_GUI_DOWNLOAD_REVIEW = '[下载本帖(共A页)]';
    const TEXT_GUI_DOWNLOADING_REVIEW = '[下载中...(C/A)]';
	const TEXT_GUI_DOWNLOAD_BBCODE = '保存为BBCODE格式：';
    const TEXT_GUI_DOWNLOADFINISH_REVIEW = '[下载完毕]';
	const TEXT_GUI_DOWNLOADALL = '下载全部分卷，请点击右边的按钮：';
	const TEXT_GUI_WAITING = ' 等待中...';
    const TEXT_GUI_DOWNLOADING = ' 下载中...';
    const TEXT_GUI_DOWNLOADED = ' (下载完毕)';
	const TEXT_GUI_NOTHINGHERE = '<span style="color:grey">-Nothing Here-</span>';
	const TEXT_GUI_SDOWNLOAD = '地址三(程序重命名)';
	const TEXT_GUI_SDOWNLOAD_FILENAME = '{NovelName} {VolumeName}.{Extension}';
    const TEXT_GUI_DOWNLOADING_ALL = '下载中...(C/A)';
    const TEXT_GUI_DOWNLOADED_ALL = '下载图片(已完成)';
	const TEXT_GUI_AUTOREFRESH = '自动更新页面：';
	const TEXT_GUI_AUTOREFRESH_PAUSED = '(回复编辑中，暂停刷新)';
	const TEXT_GUI_AUTOSAVE = '（您输入的内容已保存到书评草稿中）';
	const TEXT_GUI_AUTOSAVE_CLEAR = '（草稿为空）';
	const TEXT_GUI_AUTOSAVE_RESTORE = '（已从书评草稿中恢复了您上次编辑的内容）';
	const TEXT_GUI_AREAREPLY_AT = '想用@提到谁？';
	const TEXT_GUI_INDEX_FAVORITES = '收藏的书评';
	const TEXT_GUI_INDEX_STATUS = '{S} 正在运行，版本 {V}。'.replace('{S}', GM_info.script.name).replace('{V}', GM_info.script.version);
	const TEXT_GUI_INDEX_LATERBOOKS = '稍后再读';
	const TEXT_GUI_BOOKCASE_GETTING = '正在搬运书架...(C/A)';
	const TEXT_GUI_BOOKCASE_TOPTITLE = '您的书架可收藏 A 本，已收藏 B 本';
	const TEXT_GUI_BOOKCASE_MOVEBOOK = '移动到 [N]';
	const TEXT_GUI_BOOKCASE_DBLCLICK = '双击/长按我，给我取一个好听的名字吧～';
	const TEXT_GUI_BOOKCASE_WHATNAME = '呜呜呜～会是什么名字呢？';
	const TEXT_GUI_BOOKCASE_ATRCMMD = '自动推书';
	const TEXT_GUI_BOOKCASE_RCMMDAT = '<span>每日自动推书：</span>';
	const TEXT_GUI_BOOKCASE_RCMMDNW = '立即推书';
	const TEXT_GUI_BOOKCASE_RCMMDNW_DONE = '今日推书已完成';
	const TEXT_GUI_BOOKCASE_RCMMDNW_NOTYET = '今日尚未推书';
	const TEXT_GUI_BOOKCASE_RCMMDNW_NOTASK = '您还没有设置自动推书';
	const TEXT_GUI_BOOKCASE_RCMMDNW_CONFIRM = '今天已经推过书了，是否要再推一遍？';
	const TEXT_GUI_SEARCH_OPTION_TAG = '标签(preview)';
	const TEXT_GUI_DETAIL_TITLE_SETTINGS = '脚本设置';
	const TEXT_GUI_DETAIL_TITLE_BGI = '页面美化背景图片';
	const TEXT_GUI_DETAIL_DEFAULT_BGI = '点击选择图片 / 拖拽图片到此处 / Ctrl+V粘贴剪贴板中的图片';
	const TEXT_GUI_DETAIL_BGI = '当前图片：{N}';
	const TEXT_GUI_DETAIL_BGI_WORKING = '处理中...';
	const TEXT_GUI_DETAIL_BGI_UPLOADING = '正在上传: {NAME}';
	const TEXT_GUI_DETAIL_BGI_UPLOADFAILED = '{NAME}(上传失败，已本地保存)';
	const TEXT_GUI_DETAIL_BGI_DOWNLOADING = '正在下载: {NAME}';
	const TEXT_GUI_DETAIL_BGI_UPLOAD = '上传图片到图床以防止卡顿';
	const TEXT_GUI_DETAIL_BGI_LEGAL = '上传图片请遵守法律以及图床使用规定</br>请不要上传违规图片';
	const TEXT_GUI_DETAIL_GUI_IMAGER = '图床选择';
	const TEXT_GUI_DETAIL_GUI_SCALE = '书评字体缩放';
	const TEXT_GUI_DETAIL_BTF_NOVEL = '阅读页面美化';
	const TEXT_GUI_DETAIL_BTF_REVIEW = '书评页面美化';
	const TEXT_GUI_DETAIL_BTF_COMMON = '其他页面美化';
	const TEXT_GUI_DETAIL_FVR_LASTPAGE = '点击收藏的帖子时打开最后一页';
	const TEXT_GUI_DETAIL_VERSION_CURVER = '当前版本';
	const TEXT_GUI_DETAIL_VERSION_CHECKUPDATE = '检查更新';
	const TEXT_GUI_DETAIL_VERSION_CHECK = '点击此处检查更新';
	const TEXT_GUI_DETAIL_CONFIG_EXPORT = '导出所有脚本配置到文件（包含账号密码）';
	const TEXT_GUI_DETAIL_CONFIG_EXPORT_NOPASS = '导出所有脚本配置到文件（不包含账号密码）';
	const TEXT_GUI_DETAIL_EXPORT_CLICK = '点击导出';
	const TEXT_GUI_DETAIL_CONFIG_IMPORT = '从文件导入脚本配置';
	const TEXT_GUI_DETAIL_IMPORT_CLICK = '点击导入 / 拖拽配置文件到此处 / Ctrl+V粘贴剪贴板中的配置文件，并刷新页面';
	const TEXT_GUI_DETAIL_FEEDBACK_TITLE = '提出反馈';
	const TEXT_GUI_DETAIL_FEEDBACK = '点击打开反馈页面';
	const TEXT_GUI_DETAIL_UPDATEINFO_TITLE = '更新日志';
	const TEXT_GUI_DETAIL_UPDATEINFO = '点击去主页查看';
	const TEXT_GUI_DETAIL_CONFIG_MANAGE = '管理存储的信息';
	const TEXT_GUI_DETAIL_CONFIG_MANAGE_EMPTY = '<span style="color:grey;">没有内容</span>';
	const TEXT_GUI_DETAIL_CONFIG_MANAGE_MORE = '<span style="color:grey;">…</span>';
	const TEXT_GUI_DETAIL_MANAGE_CLICK = '点击打开管理页面';
	const TEXT_GUI_DETAIL_MANAGE_HEADER = '脚本储存管理';
	const TEXT_GUI_DETAIL_MANAGE_FAV_NOTE_BTN_OPEN = '打开';
	const TEXT_GUI_DETAIL_MANAGE_FAV_NOTE_BTN_NOTE = '备注';
	const TEXT_GUI_DETAIL_MANAGE_FAV_NOTE_BTN_DELETE = '删除';
	const TEXT_GUI_DETAIL_MANAGE_FAV_NOTE_TIP = '为{TITLE}设置备注: </br>备注将在主页鼠标经过此帖子收藏的链接时悬浮显示';
	const TEXT_GUI_DETAIL_MANAGE_FAV_NOTE_TITLE = '编辑备注';
	const TEXT_GUI_DETAIL_MANAGE_FAV_DELETE_TIP = '确认将{TITLE}移除收藏？';
	const TEXT_GUI_DETAIL_MANAGE_FAV_DELETE_TITLE = '移除收藏';
	const TEXT_GUI_DETAIL_MANAGE_FAV_SAVED = '已保存';
	const TEXT_GUI_DETAIL_MANAGE_FAV_DELETED = '已删除';
	const TEXT_GUI_DETAIL_CONFIG_IMPORT_CONFIRM_SELECT = '是否要将您粘贴的图片（{N}）中设置为页面美化背景图片？';
	const TEXT_GUI_DETAIL_CONFIG_IMPORT_CONFIRM_PASTE = '是否要从您粘贴的配置文件（{N}）中导入配置？\n建议先备份您当前的配置，再导入新配置';
	const TEXT_GUI_BLOCK_TITLE_DEFULT = '操作区域';
	const TEXT_GUI_USER_REVIEWSEARCH = '用户书评';
	const TEXT_GUI_USER_USERINFO = '详细资料';
	const TEXT_GUI_USER_USERREMARKEDIT = '编辑备注';
	const TEXT_GUI_USER_USERREMARKSHOW = '用户备注：';
	const TEXT_GUI_USER_USERREMARKEMPTY = '假装这里有个备注';
	const TEXT_GUI_USER_USERREMARKEDIT_TITLE = '编辑备注';
	const TEXT_GUI_USER_USERREMARKEDIT_MSG = '设置 [{N}] 的备注为：';
	const TEXT_GUI_LINK_TOLASTPAGE = '[打开尾页]';
	const TEXT_GUI_ACCOUNT_SWITCH = '切换账号：';
	const TEXT_GUI_ACCOUNT_CONFIRM = '是否要切换到帐号 "{N}"？';
	const TEXT_GUI_ACCOUNT_NOACCOUNT = '(帐号列表为空)';
	const TEXT_GUI_ACCOUNT_NOTLOGGEDIN = '(没有登录信息)';

	// Emoji smiles (not used in the script yet)
	const SmList =
		  [{text:"/:O",id:"1",alt:"惊讶"}, {text:"/:~",id:"2",alt:"撇嘴"}, {text:"/:*",id:"3",alt:"色色"},
		   {text:"/:|",id:"4",alt:"发呆"}, {text:"/8-)",id:"5",alt:"得意"}, {text:"/:LL",id:"6",alt:"流泪"},
		   {text:"/:$",id:"7",alt:"害羞"}, {text:"/:X",id:"8",alt:"闭嘴"}, {text:"/:Z",id:"9",alt:"睡觉"},
		   {text:"/:`(",id:"10",alt:"大哭"}, {text:"/:-",id:"11",alt:"尴尬"}, {text:"/:@",id:"12",alt:"发怒"},
		   {text:"/:P",id:"13",alt:"调皮"}, {text:"/:D",id:"14",alt:"呲牙"}, {text:"/:)",id:"15",alt:"微笑"},
		   {text:"/:(",id:"16",alt:"难过"}, {text:"/:+",id:"17",alt:"耍酷"}, {text:"/:#",id:"18",alt:"禁言"},
		   {text:"/:Q",id:"19",alt:"抓狂"}, {text:"/:T",id:"20",alt:"呕吐"}]

    /* \t
    ┌┬┐┌─┐┏┳┓┏━┓╭─╮
    ├┼┤│┼│┣╋┫┃╋┃│╳│
    └┴┘└─┘┗┻┛┗━┛╰─╯
    ╲╱╭╮
    ╱╲╰╯
    */
    /* **output format: Review Name.txt**
    ** 轻小说文库-帖子 [ID: reviewid]
    ** title
    ** 保存自: reviewlink
    ** 保存时间: savetime
    ** By scriptname Ver. version, author authorname
    **
    ** ──────────────────────────────
    ** [用户: username userid]
    ** 用户名: username
    ** 用户ID: userid
    ** 加入日期: 1970-01-01
    ** 用户链接: userlink
    ** 最早出现: 1楼
    ** ──────────────────────────────
    ** ...
    ** ──────────────────────────────
    ** [#1 2021-04-26 17:53:49] [username userid]
    ** ──────────────────────────────
    ** content - line 1
    ** content - line 2
    ** content - line 3
    ** ──────────────────────────────
    **
    ** ──────────────────────────────
    ** [#2 2021-04-26 19:28:08] [username userid]
    ** ──────────────────────────────
    ** content - line 1
    ** content - line 2
    ** content - line 3
    ** ──────────────────────────────
    **
    ** ...
    **
    **
    ** [THE END]
    */
    const TEXT_SPLIT_LINE_CHAR = '━'; const TEXT_SPLIT_LINE = TEXT_SPLIT_LINE_CHAR.repeat(20)
    const TEXT_OUTPUT_REVIEW_HEAD =
          '轻小说文库-帖子 [ID: {RWID}]\n{RWTT}\n保存自: {RWLK}\n保存时间: {SVTM}\nBy {SCNM} Ver. {VRSN}, author {ATNM}'
    const TEXT_OUTPUT_REVIEW_USER =
          '{LNSPLT}\n[用户: {USERNM} {USERID}]\n用户名: {USERNM}\n用户ID: {USERID}\n加入日期: {USERJT}\n用户链接: {USERLK}\n最早出现: {USERFL}楼\n{LNSPLT}'
    const TEXT_OUTPUT_REVIEW_FLOOR =
          '{LNSPLT}\n[#{RPNUMB} {RPTIME}] [{USERNM} {USERID}]\n{LNSPLT}\n{RPTEXT}\n{LNSPLT}';
    const TEXT_OUTPUT_REVIEW_END = '\n[THE END]';

    // Arguments: level=LogLevel.Info, logContent, asObject=false
    // Needs one call "DoLog();" to get it initialized before using it!
    function DoLog() {
        // Global log levels set
        unsafeWindow.LogLevel = {
            None: 0,
            Error: 1,
            Success: 2,
            Warning: 3,
            Info: 4,
        }
        unsafeWindow.LogLevelMap = {};
        unsafeWindow.LogLevelMap[LogLevel.None]     = {prefix: ''          , color: 'color:#ffffff'}
        unsafeWindow.LogLevelMap[LogLevel.Error]    = {prefix: '[Error]'   , color: 'color:#ff0000'}
        unsafeWindow.LogLevelMap[LogLevel.Success]  = {prefix: '[Success]' , color: 'color:#00aa00'}
        unsafeWindow.LogLevelMap[LogLevel.Warning]  = {prefix: '[Warning]' , color: 'color:#ffa500'}
        unsafeWindow.LogLevelMap[LogLevel.Info]     = {prefix: '[Info]'    , color: 'color:#888888'}
        unsafeWindow.LogLevelMap[LogLevel.Elements] = {prefix: '[Elements]', color: 'color:#000000'}

        // Current log level
        DoLog.logLevel = (unsafeWindow ? unsafeWindow.isPY_DNG : window.isPY_DNG) ? LogLevel.Info : LogLevel.Warning; // Info Warning Success Error

        // Log counter
        DoLog.logCount === undefined && (DoLog.logCount = 0);
        if (++DoLog.logCount > 512) {
            console.clear();
            DoLog.logCount = 0;
        }

        // Get args
        let level, logContent, asObject;
        switch (arguments.length) {
            case 1:
                level = LogLevel.Info;
                logContent = arguments[0];
                asObject = false;
                break;
            case 2:
                level = arguments[0];
                logContent = arguments[1];
                asObject = false;
                break;
            case 3:
                level = arguments[0];
                logContent = arguments[1];
                asObject = arguments[2];
                break;
            default:
                level = LogLevel.Info;
                logContent = 'DoLog initialized.';
                asObject = false;
                break;
        }

        // Log when log level permits
        if (level <= DoLog.logLevel) {
            let msg = '%c' + LogLevelMap[level].prefix;
            let subst = LogLevelMap[level].color;

            if (asObject) {
                msg += ' %o';
            } else {
                switch(typeof(logContent)) {
                    case 'string': msg += ' %s'; break;
                    case 'number': msg += ' %d'; break;
                    case 'object': msg += ' %o'; break;
                }
            }

            console.log(msg, subst, logContent);
        }
    }
    DoLog();

	let tipready, CONFIG, TASK, DMode, SPanel, AndAPI
	let API
    main();

	// Main
	function main() {
		// Get tab url api part
		API = window.location.href.replace(/https?:\/\/www\.wenku8\.(net|cc)\//, '').replace(/\?.*/, '').replace(/#.*/, '')
			.replace(/^book\/\d+\.html?/, 'book').replace(/novel\/(\d+\/?)+\.html?$/, 'novel')
			.replace(/^novel[\/\d]+index\.html?$/, 'novelindex');

		// Common actions
		loadinResourceCSS();
		loadinFontAwesome();
		polyfillAlert();
		tipready = tipcheck();
		tipscroll();
		addStyle(CSS_COMMON);
		GMXHRHook(NUMBER_MAX_XHR);
		CONFIG = new configManager();
		TASK = new taskManager();
		AndAPI = new AndroidAPI();
		//DMode = new Darkmode({autoMatchOsTheme: false});
		formSearch();
		linkReview();
		multiAccount();
		commonBeautify(API);
		SPanel = sideFunctions();
		unsafeWindow.alertify = alertify;
		alertify.set('notifier','position', 'top-right');

		if (isAPIPage()) {
			if (!pageAPI(API)) {
				return;
			}
		}
		if (!API) {
			location.href = `https://${location.host}/index.php`;
			return;
		};
		switch (API) {
			// Dwonload page
			case 'modules/article/packshow.php':
				pageDownload();
				break;
			// ReviewList page
			case 'modules/article/reviews.php':
				areaReply();
				break;
			// Review page
			case 'modules/article/reviewshow.php':
				areaReply();
				pageReview();
				break;
			// ReviewEdit page
			case 'modules/article/reviewedit.php':
				areaReply();
                pageReviewedit();
				break;
			// Bookcase page
			case 'modules/article/bookcase.php':
				pageBookcase();
				break;
			// Tags page
			case 'modules/article/tags.php':
				pageTags();
				break;
			// Mylink page
			case 'mylink.php':
				pageMylink();
				break;
			case 'userpage.php':
				pageUser();
				break;
			// Detail page
			case 'userdetail.php':
				pageDetail();
				break;
			// Index page
			case 'index.php':
				pageIndex();
				break;
			// Book page
			// Also: https://www.wenku8.net/modules/article/articleinfo.php?id={ID}&charset=gbk
			case 'modules/article/articleinfo.php':
			case 'book':
				pageBook();
				break;
			// Novel index page
			case 'novelindex':
				pageNovelIndex();
				break;
			// Novel page
			case 'novel':
				pageNovel();
				break;
			// Novel index page & novel page
			case 'modules/article/reader.php':
				chapter_id === '0' ? pageNovelIndex() : pageNovel();
				break;
			// Login page
			case 'login.php':
				pageLogin();
				break;
			// Other pages
			default:
				DoLog(LogLevel.Info, API);
		}
	}

	// Autorun tasks
	// use 'new' keyword
	function taskManager() {
		const TM = this;

		// UserDetail refresh
		TM.UserDetail = {
			// Refresh userDetail storage everyday
			refresh: function() {
				// Time check: whether recommend has done today
				if (getMyUserDetail().lasttime === getTime('-', false)) {return false;};
				refreshMyUserDetail();
			}
		}

		// Auto-recommend
		TM.AutoRecommend = {

			// Check if recommend has done
			checkRcmmd: function() {
				const arConfig = CONFIG.AutoRecommend.getConfig();
				return arConfig.lasttime === getTime('-', false);
			},

			// Auto recommend main function
			run: function(recommendAnyway=false) {
				let i;

				// Get config
				const arConfig = CONFIG.AutoRecommend.getConfig();

				// Time check: whether all recommends has done today
				if (TM.AutoRecommend.checkRcmmd() && !recommendAnyway) {return false;};

				// Config check: whether we need to auto-recommend
				if (!arConfig.auto && !recommendAnyway) {return false;}

				// Config check: whether the recommend list is empty
				if (arConfig.allCount === 0) {
					const altBox = alertify.notify(
						/modules\/article\/bookcase\.php$/.test(location.href) ?
						TEXT_ALT_ATRCMMDS_NOTASK_PLSSET + (getMyUserDetail().userDetail ? '</br>'+TEXT_ALT_ATRCMMDS_MAXRCMMD.replace('{V}', String(getMyUserDetail().userDetail.vote)) : '') :
						TEXT_ALT_ATRCMMDS_NOTASK_OPENBC
					);
					altBox.callback = (isClicked) => {
						isClicked && window.open(URL_BOOKCASE);
					}
					return false;
				};

				// Recommend for each
				let recommended = {}, AM = new AsyncManager();
				AM.onfinish = allFinish;

				alertify.notify(TEXT_ALT_ATRCMMDS_ALL_START);
				for (const strBookID in arConfig.books) {
					// Only when inherited properties exists must we use hasOwnProperty()
					// here we know there is no inherited properties
					const book = arConfig.books[strBookID]
					const number = book.number;
					const bookID = book.id;
					const bookName = book.name;

					// Time check: whether this book's recommend has done today
					if (book.lasttime === getTime('-', false) && !recommendAnyway) {continue;};

					// Soft alert
					//alertify.notify(TEXT_ALT_ATRCMMDS_RUNNING.replaceAll('{BN}', bookName).replaceAll('{BID}', strBookID));

					// Go work
					for (i = 0; i < number; i++) {
						AM.add();
						getDocument(URL_RECOMMEND.replaceAll('{B}', strBookID), bookFinish,[book, strBookID, bookName]);
					}

					// Soft alert
					//alertify.notify(TEXT_ALT_ATRCMMDS_DONE.replaceAll('{BN}', bookName).replaceAll('{BID}', strBookID));
				}
				AM.finishEvent = true;
				return true;

				function bookFinish(oDoc, book, strBookID, bookName) {
					// title: "处理成功"
					const statusText = $(oDoc, '.blocktitle').innerText;
					// success: "我们已经记录了本次推荐，感谢您的参与！\n\n您每天拥有 5 次推荐权利，这是您今天第 1 次推荐。"
					// overflow: "\n错误原因：对不起，您今天已经用完了推荐的权利！\n\n您每天可以推荐 20 次。\n\n请 返 回 并修正"
					const returnText = $(oDoc, '.blockcontent').innerText.replace(/\s*\[.+\]\s*$/, '');

					// Save book
					book.lasttime = getTime('-', false);
					CONFIG.AutoRecommend.saveConfig(arConfig);

					// Log
					DoLog(statusText + '\n' + returnText);

					/*
					// Check status
					const success = /我们已经记录了本次推荐，感谢您的参与！\s*您每天拥有\s*(\d+)\s*次推荐权利，这是您今天第\s*(\d+)\s*次推荐。/;
					const overflow = /\s*错误原因：对不起，您今天已经用完了推荐的权利！\s*您每天可以推荐\s*(\d+)\s*次。\s*请\s*返\s*回\s*并修正/;
					*/
					const b = recommended[strBookID] = recommended[strBookID] || {name: bookName, strID: strBookID, count: 0};
					b.count++;
					AM.finish();
				}

				function allFinish() {
					// Save config
					arConfig.lasttime = getTime('-', false);
					CONFIG.AutoRecommend.saveConfig(arConfig);

					// Soft alert
					let text = [];
					for (const strBookID of Object.keys(recommended)) {
						const book = recommended[strBookID];
						text.push('[{BID}]{BN} 推荐了{C}次'.replaceAll('{C}', book.count).replaceAll('{BID}', book.strID).replaceAll('{BN}', book.name));
					}
					alertify.success(TEXT_ALT_ATRCMMDS_ALL_DONE.replaceAll('{R}', text.join('</br>')));
				}
			}
		}

		// Config Maintainer
		TM.Cleaner = {
			cleanPageStatus: function() {
				const config = CONFIG.BkReviewPrefs.getConfig();
				const history = config.history;
				let count = 0;
				for (const [rid, his] of Object.entries(history)) {
					if (!his.time || (new Date()).getTime() - his.time > 30*1000) {
						delete history[rid];
						count++;
					}
				}
				CONFIG.BkReviewPrefs.saveConfig(config);
				DoLog(count > 0 ? LogLevel.Success : LogLevel.Info, 'Review page status cleaned ({C})'.replace('{C}', count.toString()));
			},

			imagerFix: function() {
				const config = CONFIG.UserGlobalCfg.getConfig();
				const curimager = config.imager;

				// If imager does not exist or imager disabled, change it to default
				if (!DATA_IMAGERS[curimager] || !DATA_IMAGERS[curimager].available) {
					DoLog(LogLevel.Warning, 'Current imager unavailable, changing to default.');
					if (curimager !== DATA_IMAGERS.default && DATA_IMAGERS[DATA_IMAGERS.default].available) {
						// Default available
						config.imager = DATA_IMAGERS.default;
						DoLog(LogLevel.Success, 'Changed to default.');
					} else {
						// Default not available
						DoLog(LogLevel.Warning, 'Default imager unavailable, trying to find another imager for use. ')
						for (const [key, imager] of Object.entries(DATA_IMAGERS)) {
							if (imager.available) {
								config.imager = key;
								DoLog(LogLevel.Success, 'Changed to {K}.'.replace('{K}', key));
								break;
							}
						}

						if (config.imager === curimager) {
							// OMG, There's NO IMAGER AVAILABLE!!
							DoLog(LogLevel.Error, 'OMG, There\'s NO IMAGER AVAILABLE!!');
						}
					}

					CONFIG.UserGlobalCfg.saveConfig(config);
					alertify.warning((config.imager !== curimager ? TEXT_ALT_IMAGER_RESET : TEXT_ALT_IMAGER_NOAVAILBLE).replace('{O}', DATA_IMAGERS[curimager].name).replace('{N}', DATA_IMAGERS[config.imager].name));
				}
			},
		}

		// Script
		TM.Script = {
			// Check & Update to latest version of script
			update: function(force=false) {
				// Check for update once a day
				const scriptID = 416310;
				const config = CONFIG.GlobalConfig.getConfig();
				if (!force && config.scriptUpdate.lasttime === getTime('-', false)) {return false;}

				const GFU = new GreasyForkUpdater();
				alertify.notify(TEXT_ALT_SCRIPT_UPDATE_CHECKING);
				GFU.checkUpdate(scriptID, GM_info.script.version, function(update, updateurl, metaData) {
					if (update) {
						const box = alertify.notify(TEXT_ALT_SCRIPT_UPDATE_GOT.replaceAll('{SN}', metaData.name).replaceAll('{NV}', metaData.version).replaceAll('{CV}', GM_info.script.version));
						const btnInfo = $(box.element, '#script_update_info');
						const btnInstall = $(box.element, '#script_update_install');
						btnInfo.addEventListener('click', show);
						btnInstall.addEventListener('click', install);
					} else {
						alertify.message(TEXT_ALT_SCRIPT_UPDATE_NONE);
					}
					config.scriptUpdate.lasttime = getTime('-', false);
					CONFIG.GlobalConfig.saveConfig(config);

					function install(e) {
						location.href = updateurl;
					}

					function show(e) {
						const info = metaData.updateinfo;
						const box = alertify.confirm(info ? info : TEXT_ALT_SCRIPT_UPDATE_NOINFO, install);
						box.setHeader(TEXT_ALT_SCRIPT_UPDATE_INFO);
						box.set('labels', {ok: TEXT_ALT_SCRIPT_UPDATE_INSTALL, cancel: TEXT_ALT_SCRIPT_UPDATE_CLOSE});
						box.set('overflow', true);
					}
				});

				return true;
			}
		}

		TM.Script.update();
		TM.Cleaner.cleanPageStatus();
		TM.Cleaner.imagerFix();
		TM.UserDetail.refresh();
		TM.AutoRecommend.run();
	}

	// Config Manager
	// use 'new' keyword
	function configManager() {
		const CM = this;
		const [getValue, setValue, deleteValue, listValues] = [
			window.getValue    ? window.getValue    : GM_getValue,
			window.setValue    ? window.setValue    : GM_setValue,
			window.deleteValue ? window.deleteValue : GM_deleteValue,
			window.listValues  ? window.listValues  : GM_listValues,
		]

		CM.GlobalConfig = {
			saveConfig: function(config) {
				config ? config[KEY_CM_VERSION] = VALUE_CM_VERSION : function() {};
				setValue(KEY_CM, config);
			},

			initConfig: function(save=true, func) {
				let config = {
					users: {},
					scriptUpdate: {
						lasttime: ''
					}
				};

				config = func ? func(config) : config;
				save ? CM.GlobalConfig.saveConfig(config) : function() {};
				return config;
			},

			getConfig: function(init) {
				let config = getValue(KEY_CM, null);
				config = config ? config : (init ? CM.GlobalConfig.initConfig(true, init) : CM.GlobalConfig.initConfig());
				return config;
			},

			// Review config upgrade (Uses GM_functions)
			upgradeConfig: function() {
				// Get version
				const default_self = {}; default_self[KEY_CM_VERSION] = '0.1'; // v0.1 has no self object
				const self = GM_getValue(KEY_CM, default_self);
				const version = self[KEY_CM_VERSION];

				// Upgrade by version
				if (self[KEY_CM_VERSION] === VALUE_CM_VERSION) {DoLog(LogLevel.Info, 'Config Manager self config is in latest version. ');};
				switch(version) {
					case '0.1':
						v01_To_v02();
						v02_To_v03();
						logUpgrade();
						break;
					case '0.2':
						v02_To_v03();
						logUpgrade();
						break;
				}

				// Save to global gm_storage
				self[KEY_CM_VERSION] = VALUE_CM_VERSION;
				setValue(KEY_CM, self);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'Config Manager self config successfully upgraded From v{V1} to v{V2}. '.replaceAll('{V1}', version).replaceAll('{V2}', VALUE_CM_VERSION));
				}

				function v01_To_v02() {
					const props = GM_listValues();
					const userStorage = {};
					for (const prop of props) {
						userStorage[prop] = GM_getValue(prop);
					}
					const userID = getUserID();
					userID ? GM_setValue(userID, userStorage) : GM_setValue('temp', userStorage);
					for (const prop of props) {
						GM_deleteValue(prop);
					}
				}

				function v02_To_v03() {
					self.scriptUpdate = self.scriptUpdate ? self.scriptUpdate : {lasttime: ''};
				}
			},

			// Redirect global gm_storage to user's storage area (Uses GM_functions)
			// callback(key)
			redirectToUser: function (callback) {
				// Get userID from cookies
				const userID = getUserID();

				if (userID) {
					// delete temp data if exist
					GM_deleteValue('temp');

					// Save lastUserID
					const config = CM.GlobalConfig.getConfig();
					config.lastUserID = userID;
					CM.GlobalConfig.saveConfig(config);

					// Redirect to user storage area
					redirectGMStorage(userID);
					DoLog(LogLevel.Info, 'GM_storage redirected to ' + String(userID));
				} else {
					// Redirect to temp storage area before request finish
					const lastUserID = CM.GlobalConfig.getConfig().lastUserID;
					redirectTemp(lastUserID);

					// Request userID
					getMyUserDetail((userDetail)=>{
						const key = userDetail.userDetail.userID;

						// Move temp data to user storage area
						redirectGMStorage();
						const tempStorage = GM_getValue('temp');
						GM_setValue(lastUserID ? lastUserID : key, tempStorage);
						GM_deleteValue('temp');

						// Save lastUserID
						const config = CM.GlobalConfig.getConfig();
						config.lastUserID = key;
						CM.GlobalConfig.saveConfig(config);

						// Redirect to user storage area
						redirectGMStorage(key);
						DoLog(LogLevel.Info, 'GM_storage redirected to ' + String(key));

						// callback
						callback ? callback(key) : function() {};
					})
				}

				// When userID request not finished, use 'temp' as gm_storage key
				function redirectTemp(lastUserID) {
					if (lastUserID) {
						// Copy config of the user we use last time to 'temp' storage area
						const lastUser = GM_getValue(lastUserID, {});
						GM_setValue('temp', lastUser);
					}
					redirectGMStorage('temp');
					DoLog(LogLevel.Info, 'GM_storage redirected to temp');
				}
			}
		}

		CM.GlobalConfig.upgradeConfig();
		CM.GlobalConfig.redirectToUser();

		CM.AutoRecommend = {
			saveConfig: function(config) {
				config ? config[KEY_ATRCMMDS_VERSION] = VALUE_ATRCMMDS_VERSION : function() {};
				GM_setValue(KEY_ATRCMMDS, config);
			},

			initConfig: function(save=true, func) {
				let config = {};
				config[KEY_ATRCMMDS_VERSION] = VALUE_ATRCMMDS_VERSION;
				config.allCount = 0;
				config.books = {};
				config.auto = true;

				config = func ? func(config) : config;
				save ? CM.AutoRecommend.saveConfig(config) : function() {};
				return config;
			},

			getConfig: function(init) {
				let config = GM_getValue(KEY_ATRCMMDS, null);
				config = config ? config : (init ? CM.AutoRecommend.initConfig(true, init) : CM.AutoRecommend.initConfig());
				return config;
			},

			// Auto-recommend config upgrade
			upgradeConfig: function() {
				// Get config
				const config = CM.AutoRecommend.getConfig();

				// if not inited
				if (!config) {return;};

				switch (config[KEY_ATRCMMDS_VERSION]) {
					case '0.1':
						config.auto = true;
						logUpgrade();
						break;
					case VALUE_ATRCMMDS_VERSION:
						DoLog(LogLevel.Info, 'Auto-recommend config is in latest version. ');
						break;
					default:
						DoLog(LogLevel.Error, 'configCheckUpgrade: Invalid config version({V}) for Auto-recommend. '.replace('{V}', config[KEY_ATRCMMDS_VERSION]));
				}

				// Save to gm_storage
				CM.AutoRecommend.saveConfig(config);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'Auto-recommend config successfully upgraded From v{V1} to {V2}. '.replaceAll('{V1}', config[KEY_ATRCMMDS_VERSION]).replaceAll('{V2}', VALUE_ATRCMMDS_VERSION));
				}
			}
		}

		CM.commentDrafts = {
			saveConfig: function(config) {
				config ? config[KEY_DRAFT_VERSION] = VALUE_DRAFT_VERSION : function() {};
				GM_setValue(KEY_DRAFT_DRAFTS, config);
			},

			initConfig: function(save=true, func) {
				let config = {};

				config = func ? func(config) : config;
				save ? CM.commentDrafts.saveConfig(config) : function() {};
				return config;
			},

			getConfig: function(init) {
				let config = GM_getValue(KEY_DRAFT_DRAFTS, null);
				config = config ? config : (init ? CM.commentDrafts.initConfig(true, init) : CM.commentDrafts.initConfig());
				return config;
			},

			// Comment-drafts config upgrade
			upgradeConfig: function() {
				// Get config
				let config = CM.commentDrafts.getConfig();

				// if not inited
				if (!config) {return;};

				switch (config[KEY_DRAFT_VERSION]) {
					case '0.1':
					case undefined:
						v01_To_v02();
						logUpgrade();
						break;
					case VALUE_DRAFT_VERSION:
						DoLog(LogLevel.Info, 'comment-drafts config is in latest version. ');
						break;
					default:
						DoLog(LogLevel.Error, 'configCheckUpgrade: Invalid config version({V}) for comment-drafts. '.replace('{V}', config[KEY_DRAFT_VERSION]));
				}

				// Save to gm_storage
				CM.commentDrafts.saveConfig(config);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'comment-drafts config successfully upgraded From v{V1} to {V2}. '.replaceAll('{V1}', config[KEY_DRAFT_VERSION]).replaceAll('{V2}', VALUE_DRAFT_VERSION));
				}

				function v01_To_v02() {
					// Fix bug caused bookcase's config overwriting comment-drafts' config
					if (config instanceof Array) {
						config = {};
					}
				}
			}
		}

		CM.bookcasePrefs = {
			saveConfig: function(config) {
				config ? config[KEY_BOOKCASE_VERSION] = VALUE_BOOKCASE_VERSION : function() {};
				GM_setValue(KEY_BOOKCASES, config);
			},

			initConfig: function(save=true, func) {
				let config = {
					bookcases: [],
					laterbooks: {
						sortby: 'addTime_old2new',
						books: {}
					}
				};

				config = func ? func(config) : config;
				save ? CM.bookcasePrefs.saveConfig(config) : function() {};
				return config;
			},

			getConfig: function(init) {
				let config = GM_getValue(KEY_BOOKCASES, null);
				config = config ? config : (init ? CM.bookcasePrefs.initConfig(true, init) : CM.bookcasePrefs.initConfig());
				return config;
			},

			// Bookcase config upgrade
			upgradeConfig: function() {
				// Get config
				let config = CM.bookcasePrefs.getConfig();

				// if not inited
				if (!config) {return;};

				// Original version
				let V = config && config[KEY_BOOKCASE_VERSION] ? config[KEY_BOOKCASE_VERSION] : '0';

				switch (V) {
					case '0.1':
					case undefined:
					case '0':
						v01_To_v02();
						v02_To_v03();
						v03_To_v04();
						v04_To_v05();
						logUpgrade();
						break;
					case '0.2':
						v02_To_v03();
						v03_To_v04();
						v04_To_v05();
						logUpgrade();
						break;
					case '0.3':
						v03_To_v04();
						v04_To_v05();
						logUpgrade();
						break;
					case '0.4':
						v04_To_v05();
						logUpgrade();
						break;
					case VALUE_BOOKCASE_VERSION:
						DoLog(LogLevel.Info, 'Bookcase config is in latest version. ');
						break;
					default:
						DoLog(LogLevel.Error, 'configCheckUpgrade: Invalid config version({V}) for Bookcase. '.replace('{V}', config[KEY_BOOKCASE_VERSION]));
				}

				// Save to gm_storage
				CM.bookcasePrefs.saveConfig(config);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'Bookcase config successfully upgraded From v{V1} to v{V2}. '.replaceAll('{V1}', V).replaceAll('{V2}', VALUE_BOOKCASE_VERSION));
				}

				function v01_To_v02() {
					// Clear useless key added falsely
					delete config.bbcode;

					// Convert array to an object
					if (Array.isArray(config)) {
						const newConfig = {bookcases: []};
						for (let i = 0; i < config.length; i++) {
							newConfig.bookcases[i] = config[i];
						}
						config = newConfig;
					}
				}

				function v02_To_v03() {
					// Fix bug caused config.bookcases equals to []
					if (config && config.bookcases && config.bookcases.length === 0) {
						config = CM.bookcasePrefs.initConfig();
					}
				}

				function v03_To_v04() {
					if (config.laterbooks) {return false;}
					config.laterbooks = {
						sortby: 'addTime_old2new',
						books: {}
					};
				}

				function v04_To_v05() {
					const books = config.laterbooks.books;
					const sorts = [];
					let err = false;
					for (const book of Object.values(books)) {
						if (sorts.includes(book.sort)) {
							err = true;
							break;
						}
						sorts.push(book.sort);
					}
					Math.max.apply(null, sorts) > books.length && (err = true);
					if (err) {
						let i = 0;
						for (const book of Object.values(books)) {
							book.sort = ++i;
						}
						alertify.notify(TEXT_ALT_BOOKCASE_AFTERBOOKS_V4BUG, '', 0);
					}
				}
			}
		}

		CM.userDtlePrefs = {
			saveConfig: function(config) {
				config ? config[KEY_USRDETAIL_VERSION] = VALUE_USRDETAIL_VERSION : function() {};
				GM_setValue(KEY_USRDETAIL, config);
			},

			initConfig: function(save=true, func) {
				let config = {userDetail: null};

				config = func ? func(config) : config;
				save ? CM.userDtlePrefs.saveConfig(config) : function() {};
				return config;
			},

			getConfig: function(init) {
				let config = GM_getValue(KEY_USRDETAIL, null);
				config = config ? config : (init ? CM.userDtlePrefs.initConfig(true, init) : CM.userDtlePrefs.initConfig());
				return config;
			},

			// userDetail config upgrade
			upgradeConfig: function() {
				// Get config
				const config = CM.userDtlePrefs.getConfig();

				// if not inited
				if (!config) {return;};

				// Original version
				let V = config && config[KEY_BOOKCASE_VERSION] ? config[KEY_BOOKCASE_VERSION] : '0';

				switch (V) {
					case '0.1':
						refreshMyUserDetail(logUpgrade);
						break;
					case VALUE_USRDETAIL_VERSION:
						DoLog(LogLevel.Info, 'User-detail config is in latest version. ');
						break;
					default:
						DoLog(LogLevel.Error, 'configCheckUpgrade: Invalid config version({V}) for User-detail. '.replace('{V}', V));
				}

				// Save to gm_storage
				CM.userDtlePrefs.saveConfig(config);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'User-detail config successfully upgraded From v{V1} to v{V2}. '.replaceAll('{V1}', V).replaceAll('{V2}', VALUE_USRDETAIL_VERSION));
				}
			}
		}

		CM.BkReviewPrefs = {
			saveConfig: function(config) {
				config ? config[KEY_REVIEW_VERSION] = VALUE_REVIEW_VERSION : function() {};
				GM_setValue(KEY_REVIEW_PREFS, config);
			},

			initConfig: function(save=true, func) {
				let config = {
					bbcode: false,
					autoRefresh: false,
					beautiful: true,
					backgroundImage: 'https://img12.360buyimg.com/ddimg/jfs/t1/197476/22/6462/3478996/613227a8E03e8ffc3/99970183ddb9f896.jpg',
					favorites: {
						228884: {
							name: '文库导航姬',
							href: `https://${location.host}/modules/article/reviewshow.php?rid=228884`,
							tiptitle: '梦想成为书评区大水怪的可以来康康'
						}
					},
					favorlast: false,
                    history: {}
				};

				config = func ? func(config) : config;
				save ? CM.BkReviewPrefs.saveConfig(config) : function() {};
				return config;
			},

			getConfig: function(init) {
				let config = GM_getValue(KEY_REVIEW_PREFS, null);
				config = config ? config : (init ? CM.BkReviewPrefs.initConfig(true, init) : CM.BkReviewPrefs.initConfig());
				return config;
			},

			// Review config upgrade
			upgradeConfig: function() {
				// Get config
				const config = CM.BkReviewPrefs.getConfig();

				// if not inited
				if (!config) {return;};

				switch (config[KEY_REVIEW_VERSION]) {
					case '0.1':
						v01_To_v02();
						v02_To_v03();
						v03_To_v04();
						v04_To_v05();
						v05_To_v06();
						v06_To_v07();
						v07_To_v08();
						v08_To_v09();
						logUpgrade();
						break;
					case '0.2':
						v02_To_v03();
						v03_To_v04();
						v04_To_v05();
						v05_To_v06();
						v06_To_v07();
						v07_To_v08();
						v08_To_v09();
						logUpgrade();
						break;
					case '0.3':
						v03_To_v04();
						v04_To_v05();
						v05_To_v06();
						v06_To_v07();
						v07_To_v08();
						v08_To_v09();
						logUpgrade();
						break;
                    case '0.4':
						v04_To_v05();
						v05_To_v06();
						v06_To_v07();
						v07_To_v08();
						v08_To_v09();
						logUpgrade();
						break;
					case '0.5':
						v05_To_v06();
						v06_To_v07();
						v07_To_v08();
						v08_To_v09();
						logUpgrade();
						break;
					case '0.6':
						v06_To_v07();
						v07_To_v08();
						v08_To_v09();
						logUpgrade();
						break;
					case '0.7':
						v07_To_v08();
						v08_To_v09();
						logUpgrade();
						break;
					case '0.8':
						v08_To_v09();
						logUpgrade();
						break;
					case VALUE_REVIEW_VERSION:
						DoLog(LogLevel.Info, 'Review config is in latest version. ');
						break;
					default:
						DoLog(LogLevel.Error, 'configCheckUpgrade: Invalid config version({V}) for Review. '.replace('{V}', config[KEY_REVIEW_VERSION]));
				}

				// Save to gm_storage
				CM.BkReviewPrefs.saveConfig(config);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'Review config successfully upgraded From v{V1} to v{V2}. '.replaceAll('{V1}', config[KEY_REVIEW_VERSION]).replaceAll('{V2}', VALUE_REVIEW_VERSION));
				}

				function v01_To_v02() {
					config.autoRefresh = false;
					delete config.downloading;
				}

				function v02_To_v03() {
					config.favorites = {
						228884: {
							name: '文库导航姬',
							href: `https://${location.host}/modules/article/reviewshow.php?rid=228884`,
							tiptitle: '梦想成为书评区大水怪的可以来康康'
						}
					}
				}

				function v03_To_v04() {
					if (config.favorites) {return;};
					config.favorites = {
						228884: {
							name: '文库导航姬',
							href: `https://${location.host}/modules/article/reviewshow.php?rid=228884`,
							tiptitle: '梦想成为书评区大水怪的可以来康康'
						}
					};
				}

                function v04_To_v05() {
                    if (config.history) {return;};
                    config.history = {};
                }

				function v05_To_v06() {
					if (config.beautiful !== undefined) {return;};
                    config.beautiful = true;
					config.backgroundImage = 'https://img12.360buyimg.com/ddimg/jfs/t1/197476/22/6462/3478996/613227a8E03e8ffc3/99970183ddb9f896.jpg';
				}

				function v06_To_v07() {
					// Move CM.BkReviewPrefs.upgradeConfig.beautiful to CM.BeautifierCfg
					if (config.beautiful === undefined) {return;};
					const beautifierConfig = {
						reviewshow: {
							beautiful: config.beautiful,
							backgroundImage: config.backgroundImage
						}
					}
					CM.BeautifierCfg.saveConfig(beautifierConfig);

                    delete config.beautiful;
					delete config.backgroundImage;
				}

				function v07_To_v08() {
					// Move CM.BkReviewPrefs.upgradeConfig.beautiful to CM.BeautifierCfg
					if (config.favorlast !== undefined) {return;};
					config.favorlast = false;
					for (const [rid, favorite] of Object.entries(config.favorites)) {
						config.favorites[rid] = {
							name: favorite.name,
							href: favorite.href.replace(/&page=1$/, ''),
							tiptitle: favorite.tiptitle
						};
					}
				}

				function v08_To_v09() {
					// Fill all favorite bookreviews' tiptitle using null for those don't have
					config.favorlast = false;
					for (const [rid, favorite] of Object.entries(config.favorites)) {
						!favorite.tiptitle && (favorite.tiptitle = null);
					}
				}
			}
		}

		CM.BeautifierCfg = {
			saveConfig: function(config) {
				config ? config[KEY_BEAUTIFIER_VERSION] = VALUE_BEAUTIFIER_VERSION : function() {};
				GM_setValue(KEY_BEAUTIFIER, config);
			},

			initConfig: function(save=true, func) {
				let config = {
					upload: false,
					reviewshow: {
						beautiful: true,
					},
					novel: {
						beautiful: true,
					},
					common: {
						beautiful: false,
					},
					backgroundImage: 'https://img12.360buyimg.com/ddimg/jfs/t1/197476/22/6462/3478996/613227a8E03e8ffc3/99970183ddb9f896.jpg',
					bgiName: '默认背景图片 - Pixiv ID: 88913164',
					textScale: 100
				};

				config = func ? func(config) : config;
				save ? CM.BeautifierCfg.saveConfig(config) : function() {};
				return config;
			},

			getConfig: function(init) {
				let config = GM_getValue(KEY_BEAUTIFIER, null);
				config = config ? config : (init ? CM.BeautifierCfg.initConfig(true, init) : CM.BeautifierCfg.initConfig());
				return config;
			},

			// Beautifier config upgrade
			upgradeConfig: function() {
				// Get config
				const config = CM.BeautifierCfg.getConfig();

				// if not inited
				if (!config) {return;};

				switch (config[KEY_BEAUTIFIER_VERSION]) {
					/*case '0.1':
						v01_To_v02();
						break;*/
					case VALUE_BEAUTIFIER_VERSION:
						DoLog(LogLevel.Info, 'Beautifier config is in latest version. ');
						break;
					case '0.1':
						v01_To_v02();
						v02_To_v03();
						v03_To_v04();
						v04_To_v05();
						v05_To_v06();
						v06_To_v07();
						v07_To_v08();
						v08_To_v09();
						logUpgrade();
						break;
					case '0.2':
						v02_To_v03();
						v03_To_v04();
						v04_To_v05();
						v05_To_v06();
						v06_To_v07();
						v07_To_v08();
						v08_To_v09();
						logUpgrade();
						break;
					case '0.3':
						v03_To_v04();
						v04_To_v05();
						v05_To_v06();
						v06_To_v07();
						v07_To_v08();
						v08_To_v09();
						logUpgrade();
						break;
					case '0.4':
						v04_To_v05();
						v05_To_v06();
						v06_To_v07();
						v07_To_v08();
						v08_To_v09();
						logUpgrade();
						break;
					case '0.5':
						v05_To_v06();
						v06_To_v07();
						v07_To_v08();
						v08_To_v09();
						logUpgrade();
						break;
					case '0.6':
						v06_To_v07();
						v07_To_v08();
						v08_To_v09();
						logUpgrade();
						break;
					case '0.7':
						v07_To_v08();
						v08_To_v09();
						logUpgrade();
						break;
					case '0.8':
						v08_To_v09();
						logUpgrade();
						break;
					default:
						DoLog(LogLevel.Error, 'configCheckUpgrade: Invalid config version({V}) for Beautifier. '.replace('{V}', config[KEY_BEAUTIFIER_VERSION]));
				}

				// Save to gm_storage
				CM.BeautifierCfg.saveConfig(config);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'Beautifier config successfully upgraded From v{V1} to v{V2}. '.replaceAll('{V1}', config[KEY_BEAUTIFIER_VERSION]).replaceAll('{V2}', VALUE_BEAUTIFIER_VERSION));
				}

				function v01_To_v02() {
					if (config.upload !== undefined) {return false;};
					config.upload = false;
				}

				function v02_To_v03() {
					if (config.reviewshow.bgiName !== undefined) {return false;};
					config.reviewshow.bgiName = 'image.jpeg';
				}

				function v03_To_v04() {
					if (config.textScale !== undefined) {return false;};
					config.textScale = 100;
				}

				function v04_To_v05() {
					if (config.novel !== undefined) {return false;};
					config.novel = {
						beautiful: true
					};
				}

				function v05_To_v06() {
					if (!config.textScale) {config.textScale = 100;};
					if (!config.novel) {config.novel = {beautiful: true};};
				}

				function v06_To_v07() {
					config.backgroundImage = config.reviewshow.backgroundImage;
					config.bgiName = config.reviewshow.bgiName;
					delete config.reviewshow.backgroundImage;
					delete config.reviewshow.bgiName;
				}

				function v07_To_v08() {
					if (config.common) {return false;}
					config.common = {
						beautiful: false
					};
				}

				function v08_To_v09() {
					if (config.common) {return false;}
					config.common = {
						beautiful: false
					};
				}
			}
		}

		CM.RemarksConfig = {
			saveConfig: function(config) {
				config ? config[KEY_REMARKS_VERSION] = VALUE_REMARKS_VERSION : function() {};
				GM_setValue(KEY_REMARKS, config);
			},

			initConfig: function(save=true, func) {
				let config = {
					user: {}
				};

				config = func ? func(config) : config;
				save ? CM.RemarksConfig.saveConfig(config) : function() {};
				return config;
			},

			getConfig: function(init) {
				let config = GM_getValue(KEY_REMARKS, null);
				config = config ? config : (init ? CM.RemarksConfig.initConfig(true, init) : CM.RemarksConfig.initConfig());
				return config;
			},

			// Beautifier config upgrade
			upgradeConfig: function() {
				// Get config
				const config = CM.RemarksConfig.getConfig();

				// if not inited
				if (!config) {return;};

				switch (config[KEY_REMARKS_VERSION]) {
					//case '0.1':
					//	v01_To_v02();
					//	logUpgrade();
					//	break;
					case VALUE_REMARKS_VERSION:
						DoLog(LogLevel.Info, 'RemarksConfig config is in latest version. ');
						break;
					default:
						DoLog(LogLevel.Error, 'configCheckUpgrade: Invalid config version({V}) for RemarksConfig. '.replace('{V}', config[KEY_REMARKS_VERSION]));
				}

				// Save to gm_storage
				CM.RemarksConfig.saveConfig(config);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'RemarksConfig config successfully upgraded From v{V1} to v{V2}. '.replaceAll('{V1}', config[KEY_REMARKS_VERSION]).replaceAll('{V2}', VALUE_REMARKS_VERSION));
				}

				//function v#BEFORE_To_v#AFTER() {
				//	if (config.#NEWPROP !== undefined) {return false;};
				//	config.#NEWPROP = #DEFAULTVALUE;
				//}
			}
		}

		CM.UserGlobalCfg = {
			saveConfig: function(config) {
				config ? config[KEY_USERGLOBAL_VERSION] = VALUE_USERGLOBAL_VERSION : function() {};
				GM_setValue(KEY_USERGLOBAL, config);
			},

			initConfig: function(save=true, func) {
				let config = {
					imager: DATA_IMAGERS.default
				};

				config = func ? func(config) : config;
				save ? CM.UserGlobalCfg.saveConfig(config) : function() {};
				return config;
			},

			getConfig: function(init) {
				let config = GM_getValue(KEY_USERGLOBAL, null);
				config = config ? config : (init ? CM.UserGlobalCfg.initConfig(true, init) : CM.UserGlobalCfg.initConfig());
				return config;
			},

			// Beautifier config upgrade
			upgradeConfig: function() {
				// Get config
				const config = CM.UserGlobalCfg.getConfig();

				// if not inited
				if (!config) {return;};

				switch (config[KEY_USERGLOBAL_VERSION]) {
					//case '0.1':
					//	v01_To_v02();
					//	logUpgrade();
					//	break;
					case VALUE_USERGLOBAL_VERSION:
						DoLog(LogLevel.Info, 'UserGlobal config is in latest version. ');
						break;
					default:
						DoLog(LogLevel.Error, 'configCheckUpgrade: Invalid config version({V}) for UserGlobalCfg. '.replace('{V}', config[KEY_USERGLOBAL_VERSION]));
				}

				// Save to gm_storage
				CM.UserGlobalCfg.saveConfig(config);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'UserGlobal config successfully upgraded From v{V1} to v{V2}. '.replaceAll('{V1}', config[KEY_USERGLOBAL_VERSION]).replaceAll('{V2}', VALUE_USERGLOBAL_VERSION));
				}

				//function v#BEFORE_To_v#AFTER() {
				//	if (config.#NEWPROP !== undefined) {return false;};
				//	config.#NEWPROP = #DEFAULTVALUE;
				//}
			}
		}

		// New Config Item Template
		/*CM.#NEWCONFIGNAME = {
			saveConfig: function(config) {
				config ? config[#KEY_NEWCONFIG_VERSION] = #VALUE_NEWCONFIG_VERSION : function() {};
				GM_setValue(#KEY_NEWCONFIG, config);
			},

			initConfig: function(save=true, func) {
				let config = {
					#key: #value,
					#key: #value
				};

				config = func ? func(config) : config;
				save ? CM.#NEWCONFIGNAME.saveConfig(config) : function() {};
				return config;
			},

			getConfig: function(init) {
				let config = GM_getValue(#KEY_NEWCONFIG, null);
				config = config ? config : (init ? CM.#NEWCONFIGNAME.initConfig(true, init) : CM.#NEWCONFIGNAME.initConfig());
				return config;
			},

			// Beautifier config upgrade
			upgradeConfig: function() {
				// Get config
				const config = CM.#NEWCONFIGNAME.getConfig();

				// if not inited
				if (!config) {return;};

				switch (config[#KEY_NEWCONFIG_VERSION]) {
					//case '0.1':
					//	v01_To_v02();
					//	logUpgrade();
					//	break;
					case #VALUE_NEWCONFIG_VERSION:
						DoLog(LogLevel.Info, '#NEWCONFIGNAME config is in latest version. ');
						break;
					default:
						DoLog(LogLevel.Error, 'configCheckUpgrade: Invalid config version({V}) for #NEWCONFIGNAME. '.replace('{V}', config[#KEY_NEWCONFIG_VERSION]));
				}

				// Save to gm_storage
				CM.#NEWCONFIGNAME.saveConfig(config);

				function logUpgrade() {
					DoLog(LogLevel.Success, '#NEWCONFIGNAME config successfully upgraded From v{V1} to v{V2}. '.replaceAll('{V1}', config[#KEY_NEWCONFIG_VERSION]).replaceAll('{V2}', #VALUE_NEWCONFIG_VERSION));
				}

				//function v#BEFORE_To_v#AFTER() {
				//	if (config.#NEWPROP !== undefined) {return false;};
				//	config.#NEWPROP = #DEFAULTVALUE;
				//}
			}
		}*/

		CM.AutoRecommend.upgradeConfig();
		CM.commentDrafts.upgradeConfig();
		CM.bookcasePrefs.upgradeConfig();
		CM.userDtlePrefs.upgradeConfig();
		CM.BkReviewPrefs.upgradeConfig();
		CM.BeautifierCfg.upgradeConfig();
		CM.RemarksConfig.upgradeConfig();
		CM.UserGlobalCfg.upgradeConfig();
		//CM.#NEWCONFIGNAME.upgradeConfig();
	}

	// Beautifier for all wenku pages
	function commonBeautify(API) {
		// No beautifier on exluded pages
		const excludes = ['novel']
		if (excludes.includes(API)) {return false;}

		// No beatifier if user does not want
		if (!CONFIG.BeautifierCfg.getConfig().common.beautiful) {return false;}

		const img = $CrE('img');
		img.src = CONFIG.BeautifierCfg.getConfig().backgroundImage;
		img.classList.add('plus_cbty_image');
		document.body.appendChild(img);

		const cover = $CrE('div');
		cover.classList.add('plus_cbty_cover');
		document.body.appendChild(cover);

		document.body.classList.add('plus_cbty');
		addStyle(CSS_COMMONBEAUTIFIER, 'plus_commonbeautifier')
		return true;
	}

    // Book page add-on
    function pageBook() {
		// Resource
		const pageResource = {
			elements: {},
			info: {}
		}
		collectPageResources();
		DoLog(LogLevel.Info, pageResource, true)

		// Provide meta info copy
		metaCopy();

		// Provide read-later button
		laterReads();

		// Provide txtfull download for copyright book
		enableDownload();

		// Provide images download
		imagesDownload();

		// Provide tag search
		tagOption();

        // Ctrl+Enter comment submit
        areaReply();

		// Get page resources
		function collectPageResources() {
			collectElements();
			collectInfos();

			function collectElements() {
				const elements = pageResource.elements;
				elements.content = $('#content');
				elements.bookMain = $(elements.content, 'div');
				elements.header = $(elements.content, 'div>table');
				elements.titleContainer = $(elements.header, 'table td>span');
				elements.bookName = $(elements.header, 'b');
				elements.recommend = $(elements.content, `a[href^="https://${location.host}/modules/article/uservote.php"]`);
				elements.metaContainer = $(elements.header, 'tr+tr');
				elements.metas = $All(elements.metaContainer, 'td');
				elements.info = $(elements.bookMain, 'div+table');
				elements.cover = $(elements.info, 'img');
				elements.infoText = $(elements.info, 'td+td');
				elements.notice = $All(elements.infoText, 'span.hottext>b');
				elements.tags = elements.notice.length > 1 ? elements.notice[0] : null;
				elements.notice = elements.notice[elements.notice.length-1];
				elements.introduce = $All(elements.infoText, 'span');
				elements.introduce = elements.introduce[elements.introduce.length-1];
				elements.downloadContainer = $(pageResource.elements.bookMain, 'div>fieldset');
				elements.downloadPanel = elements.downloadContainer ? elements.downloadContainer.parentElement : null;
			}

			function collectInfos() {
				const info = pageResource.info;
				const elements = pageResource.elements;
				info.bookName = elements.bookName.innerText;
				info.BID = Number(getUrlArgv('id') || location.href.match(/book\/(\d+).htm/)[1]);
				info.metas = []; elements.metas.forEach(function(meta){this.push(getKeyValue(meta.innerText));}, info.metas);
				info.notice = elements.notice.innerText;
				info.tags = elements.tags ? getKeyValue(elements.tags.innerText).VALUE.split(' ') : null;
				info.introduce = elements.introduce.innerText;
				info.cover = elements.cover.src;
				info.dlEnabled = $(elements.content, 'legend>b');
				info.dlEnabled = info.dlEnabled ? info.dlEnabled.innerText : false;
				info.dlEnabled = info.dlEnabled ? (info.dlEnabled.indexOf('TXT') !== -1 && info.dlEnabled.indexOf('UMD') !== -1 && info.dlEnabled.indexOf('JAR') !== -1) : false;
			}
		}

		// Copy meta info
		function metaCopy() {
			let tip = TEXT_TIP_COPY;
			for (let i = -1; i < pageResource.elements.metas.length; i++) {
				const meta = i !== -1 ? pageResource.elements.metas[i] : pageResource.elements.bookName;
				const info = i !== -1 ? pageResource.info.metas[i] : pageResource.info.bookName;
				const value = i !== -1 ? info.VALUE : info;
				meta.innerHTML += HTML_BOOK_COPY;
				const copyBtn = $(meta, '.'+CLASSNAME_BUTTON);
				copyBtn.addEventListener('click', function() {
					copyText(value);
					showtip(TEXT_TIP_COPIED);
					alertify.message(TEXT_ALT_META_COPIED.replaceAll('{M}', value));
				});

				settip(copyBtn, TEXT_TIP_COPY);
			}
		}

		// Add to later-reads
		function laterReads() {
			// Make button
			let btn = installBtn(makeBtn(inAfterbooks() ? 'remove' : 'add'));

			// Update book info if in list
			inAfterbooks() && add(false);

			function add(alt=true) {
				// Add to config
				const config = CONFIG.bookcasePrefs.getConfig();
				config.laterbooks.books[pageResource.info.BID] = {
					sort: Object.keys(config.laterbooks.books).length + 1,
					addTime: new Date().getTime(),
					name: pageResource.info.bookName,
					aid: pageResource.info.BID,
					metas: pageResource.info.metas,
					tags: pageResource.info.tags,
					introduce: pageResource.info.introduce,
					cover: pageResource.info.cover
				};
				CONFIG.bookcasePrefs.saveConfig(config);

				// New button
				removeBtn(btn);
				btn = installBtn(makeBtn('remove'));

				// Soft alert
				alt && alertify.success(TEXT_ALT_BOOK_AFTERBOOKS_ADDED);
			}

			function remove() {
				// Remove from config
				const config = CONFIG.bookcasePrefs.getConfig();
				const books = config.laterbooks.books;
				const book = books[pageResource.info.BID];
				if (!book) {return false;}
				delete books[pageResource.info.BID];
				Array.prototype.forEach.call(Object.values(books), (b) => (b.sort > book.sort && b.sort--));
				CONFIG.bookcasePrefs.saveConfig(config);

				// New button
				removeBtn(btn);
				btn = installBtn(makeBtn('add'));

				// Soft alert
				alertify.success(TEXT_ALT_BOOK_AFTERBOOKS_REMOVED);
			}

			function makeBtn(type='add') {
				const btn = $CrE('span');
				btn.classList.add(CLASSNAME_BUTTON);
				switch (type) {
					case 'add':
						btn.innerHTML = TEXT_GUI_BOOK_READITLATER;
						btn.addEventListener('click', add);
						break;
					case 'remove':
						btn.innerHTML = TEXT_GUI_BOOK_DONTREADLATER;
						btn.addEventListener('click', remove);
						break;
				}
				return btn;
			}

			function installBtn(btn) {
				pageResource.elements.recommend.previousElementSibling.insertAdjacentElement('afterend', btn);
				btn.insertAdjacentText('beforebegin', '[');
				btn.insertAdjacentText('afterend', ']');
				return btn;
			}

			function removeBtn(btn) {
				const parent = btn.parentElement;
				for (const node of [btn.previousSibling, btn, btn.nextSibling]) {
					parent.removeChild(node);
				}
				return btn;
			}

			function inAfterbooks() {
				return CONFIG.bookcasePrefs.getConfig().laterbooks.books[pageResource.info.BID] ? true : false;
			}
		}

		// Download copyright book
		function enableDownload() {
			if (pageResource.info.dlEnabled) {return false;};

			// Download panel
			// Create panel
			let div = $CrE('div');
			pageResource.elements.bookMain.appendChild(div);
			div.outerHTML = HTML_DOWNLOAD_LINKS
				.replaceAll('{ORIBOOKNAME}', pageResource.info.bookName)
				.replaceAll('{BOOKID}', String(pageResource.info.BID))
				.replaceAll('{CHARSET}', getUrlArgv('charset') ? '&amp;charset=' + getUrlArgv('charset') : '')

			// Use about:blank instead of direct url; aims to aviod unnecessary web requests
			const container = pageResource.elements.downloadContainer = $(pageResource.elements.bookMain, 'div>fieldset');
			div = pageResource.elements.downloadPanel = container.parentElement;
			for (const a of $All(container, 'div>a')) {
				//a.addEventListener('click', openDlPage);
			}

			// Notice board
			pageResource.elements.notice.innerHTML = HTML_DOWNLOAD_BOARD
				.replaceAll('{ORIBOOKNAME}', pageResource.info.bookName);

			function openDlPage(e) {
				e.preventDefault();

				const url = e.target.href;
				const win = window.open(`https://${location.host}/`);
				win.history.replaceState({...win.history.state}, '', url);
			}
		}

		// All images downloader
		function imagesDownload() {
			const container = pageResource.elements.downloadContainer;
			const divImage = $CrE('div'), a = $CrE('a');
			divImage.setAttribute('style', 'width:164px; float:left; text-align:center');
			a.href = 'javascript:void(0);';
			a.innerHTML = TEXT_GUI_BOOK_IMAGESDOWNLOAD;
			a.addEventListener('click', confirm);
			divImage.appendChild(a);
			container.appendChild(divImage);
			for (const div of $All(container, 'div')) {
				div.style.width = '164px';
			}

			function confirm() {
				const title = TEXT_ALT_DOWNLOADIMG_CONFIRM_TITLE;
				const message = TEXT_ALT_DOWNLOADIMG_CONFIRM_MESSAGE.replace('{N}', pageResource.info.bookName);
				const ok = TEXT_ALT_DOWNLOADIMG_CONFIRM_OK;
				const cancel = TEXT_ALT_DOWNLOADIMG_CONFIRM_CANCEL;
				alertify.confirm(title, message, download, function() {/* oncancel */}).set('labels', {ok: ok, cancel: cancel});
			}

			function download() {
				// GUI
				const delay = alertify.get('notifier','delay');
				alertify.set('notifier','delay', 0);

				let finished = false, CAll, CCur = 0;
				const AM = new AsyncManager();
				AM.onfinish = downloadFinish;
				const box = alertify.message(TEXT_ALT_DOWNLOADIMG_STATUS_INDEX);
				box.ondismiss = function() {return finished;}

				// Start download
				AM.add()
				AndAPI.getNovelIndex({
					aid: pageResource.info.BID,
					lang: 0,
					callback: function(xml) {
						const allChapters = $All(xml, 'chapter');
						const chapters = Array.prototype.filter.call(allChapters, (c) => (c.firstChild.nodeValue.includes('插图')));
						CAll = chapters.length;
						box.setContent(TEXT_ALT_DOWNLOADIMG_STATUS_LOADING.replace('{CCUR}', CCur).replace('{CALL}', CAll));
						for (const chapter of chapters) {
							AM.add();
							getChapter(chapter.getAttribute('cid'), chapter.parentNode);
						}
						AM.finish();
					}
				});
				AM.finishEvent = true;

				function getChapter(cid, volume) {
					AndAPI.getNovelContent({
						aid: pageResource.info.BID,
						cid: cid,
						lang: 0,
						callback: getImgs,
						args: [volume]
					});

					function getImgs(str, volume) {
						const imgs = str.match(/<!--image-->https?:[^<>]+<!--image-->/g);
						const len = imgs.length.toString().length;
						const CAM = new AsyncManager();
						CAM.onfinish = chapterFinish;

						for (let i = 0; i < imgs.length; i++) {
							const img = imgs[i];
							const src = img.match(/<!--image-->(https?:[^<>]+)<!--image-->/)[1];
							const ext = src.match(/\.(\w+)$/) ? src.match(/\.(\w+)$/)[1] : 'jpg';
							const filename = pageResource.info.bookName + '_' + volume.firstChild.nodeValue + ' ' + ['插图', '插圖'][getLang()] + '_' + fillNumber(i+1, len) + '.' + ext;
							CAM.add();
							downloadFile({
								url: src,
								name: filename,
								onload: function() {
									CAM.finish();
								}
							});
						}
						CAM.finishEvent = true;

						function chapterFinish() {
							AM.finish();
							box.setContent(TEXT_ALT_DOWNLOADIMG_STATUS_LOADING.replace('{CCUR}', ++CCur).replace('{CALL}', CAll));
						}
					}
				}

				function downloadFinish() {
					finished = true;
					alertify.set('notifier','delay', delay);
					box.dismiss();
					alertify.success(TEXT_ALT_DOWNLOADIMG_STATUS_FINISH);
				}
			}
		}

		// Download copyright book full txt
		function enableDownload_old() {
			if (pageResource.info.dlEnabled) {return false;};

			let div = $CrE('div');
			pageResource.elements.bookMain.appendChild(div);
			div.outerHTML = HTML_DOWNLOAD_LINKS_OLD
				.replaceAll('{ORIBOOKNAME}', pageResource.info.bookName)
				.replaceAll('{BOOKID}', String(pageResource.info.BID))
				.replaceAll('{BOOKNAME}', encodeURIComponent(pageResource.info.bookName));
			div = $('#txtfull');
			pageResource.elements.txtfull = div;

			pageResource.elements.notice.innerHTML = HTML_DOWNLOAD_BOARD
				.replaceAll('{ORIBOOKNAME}', pageResource.info.bookName);
		}

		// Tag Search
		function tagOption() {
			const tagsEle = pageResource.elements.tags;
			const tags = pageResource.info.tags;
			if (!tags) {return false;}

			let html = getKeyValue(tagsEle.innerText).KEY + '：';
			for (const tag of tags) {
				html += HTML_BOOK_TAG.replace('{TU}', $URL.encode(tag)).replace('{TN}', tag) + ' ';
			}
			tagsEle.innerHTML = html;
		}
    }

	// Reply area add-on
	function areaReply() {
		/* ## Release title area ## */
        if ($('td > input[name="Submit"]') && !$('#ptitle')) {
            const table = $('form>table');
            const titleText = table.innerHTML.match(/<!--[\s\S]+id="ptitle"[\s\S]+-->/)[0];
            const titleHTML = titleText.replace(/^<!--\s*/, '').replace(/\s*-->$/, '');
			const titleEle = $CrE('tr');
			const caption = $(table, 'caption');
			table.insertBefore(titleEle, caption);
			titleEle.outerHTML = titleHTML;
        }

        const commentArea = $('#pcontent'); if (!commentArea) {return false;};
        const commentForm = $(`form[action^="https://${location.host}/modules/article/review"]`);
        const commentSbmt = $('td > input[name="Submit"]');
        const commenttitl = $('#ptitle');
		const commentbttm = commentSbmt.parentElement;

        /* ## Ctrl+Enter comment submit ## */
		let btnSbmtValue = commentSbmt.value;
        if (commentSbmt) {
            commentSbmt.value = '发表书评(Ctrl+Enter)';
            commentSbmt.style.padding = '0.3em 0.4em 0.3em 0.4em';
            commentSbmt.style.height= 'auto';
            commentArea.addEventListener('keydown', hotkeyReply);
            commenttitl.addEventListener('keydown', hotkeyReply);
        }

		// Enable https protocol for inserted url
		fixHTTPS();

		// Provide image upload & insert
		imageplus();

		// At user
		atUser();

		// Comment auto-save
		// GUI
		const asTip = $CrE('span');
		commentbttm.appendChild(asTip);

		// Review-Page: Same rid, same savekey - 'rid123456'
		// Book-Page & Book-Review-List-Page: Same bookid, same savekey - 'bid1234'
		const rid = getUrlArgv({url: commentForm.action, name: 'rid', dealFunc: Number});
		const aid = getUrlArgv({url: commentForm.action, name: 'aid', dealFunc: Number});
		const bid = location.href.match(/\/book\/(\d+).htm/) ? Number(location.href.match(/\/book\/(\d+).htm/)[1]) : 0;
		const key = rid ? 'rid' + String(rid) : 'bid' + String(bid);
		let commentData = CONFIG.commentDrafts.getConfig()[key] || {
			key : key,
			rid : rid,
			aid : aid,
			bid : bid,
			page : getUrlArgv({name: 'rid', dealFunc: Number, defaultValue: 1}),
			time : (new Date()).getTime()
		};
		restoreDraft();
		submitHook();

		const events = ['focus', 'blur', 'mousedown', 'keydown', 'keyup', 'change'];
		const eventEles = [commentArea, commenttitl];
		for (const eventEle of eventEles) {
			for (const event of events) {
				eventEle.addEventListener(event, saveDraft);
			}
		}

		function saveDraft() {
			const content = commentArea.value;
			const title = commenttitl.value;

			if (!content && !title) {
				clearDraft();
				return;
			} else if (commentData.content === content && commentData.title === title) {
				return;
			}

			commentData.content = content;
			commentData.title = title;

			const allCData = CONFIG.commentDrafts.getConfig();

			allCData[commentData.key] = commentData;
			CONFIG.commentDrafts.saveConfig(allCData);
			asTip.innerHTML = TEXT_GUI_AUTOSAVE;
		}

		function restoreDraft() {
			const allCData = CONFIG.commentDrafts.getConfig();
			if (!allCData[commentData.key]) {return false;};
			if (!commenttitl.value && !commentArea.value) {
				commentData = allCData[commentData.key];
				commenttitl.value = commentData.title;
				commentArea.value = commentData.content;
				asTip.innerHTML = TEXT_GUI_AUTOSAVE_RESTORE;
			}
			return true;
		}

		function clearDraft() {
			const allCData = CONFIG.commentDrafts.getConfig();
			if (!allCData[commentData.key]) {return false;};
			delete allCData[commentData.key];
			CONFIG.commentDrafts.saveConfig(allCData);
			asTip.innerHTML = TEXT_GUI_AUTOSAVE_CLEAR;
			return true;
		}

        function hotkeyReply() {
            let keycode = event.keyCode;
            if (keycode === 13 && event.ctrlKey && !event.altKey) {
				// Do not submit directly like this; we need to submit with onsubmit executed
                //commentForm.submit();
				commentSbmt.click();
            }
        }

		function fixHTTPS() {
			if (typeof(UBBEditor) === 'undefined') {
				fixHTTPS.wait = fixHTTPS.wait ? fixHTTPS.wait : 0;
				if (++fixHTTPS.wait > 50) {return false;}
				DoLog('fixHTTPS: UBBEditor not loaded, waiting...');
				setTimeout(fixHTTPS, NUMBER_ELEMENT_LOADING_WAIT_INTERVAL);
				return false;
			}
			const eid = 'pcontent';

			const menuItemInsertUrl = $(commentForm, '#menuItemInsertUrl');
			const menuItemInsertImage = $(commentForm, '#menuItemInsertImage');

			// Wait until menuItemInsertUrl and menuItemInsertImage is loaded
			if (!menuItemInsertUrl || !menuItemInsertImage) {
				DoLog(LogLevel.Info, 'fixHTTPS: element not loaded, waiting...');
				setTimeout(fixHTTPS, NUMBER_ELEMENT_LOADING_WAIT_INTERVAL);
				return false;
			}

			// Wait until original onclick function is set
			if (!menuItemInsertUrl.onclick || !menuItemInsertImage.onclick) {
				DoLog(LogLevel.Info, 'fixHTTPS: defult onclick not loaded, waiting...');
				setTimeout(fixHTTPS, NUMBER_ELEMENT_LOADING_WAIT_INTERVAL);
				return false;
			}

			menuItemInsertUrl.onclick = function () {
				var url = prompt("请输入超链接地址", "http://");
				if (url != null && url.indexOf("http://") < 0 && url.indexOf("https://") < 0) {
					alert("请输入完整的超链接地址！");
					return;
				}
				if (url != null) {
					if ((document.selection && document.selection.type == "Text") ||
						(window.getSelection &&
						 document.getElementById(eid).selectionStart > -1 && document.getElementById(eid).selectionEnd >
						 document.getElementById(eid).selectionStart)) {UBBEditor.InsertTag(eid, "url", url,'');}
					else {UBBEditor.InsertTag(eid, "url", url, url);}
				}
			};

			menuItemInsertImage.onclick = function () {
				var imgurl = prompt("请输入图片路径", "http://");
				if (imgurl != null && imgurl.indexOf("http://") < 0 && imgurl.indexOf("https://") < 0) {
					alert("请输入完整的图片路径！");
					return;
				}
				if (imgurl != null) {
					UBBEditor.InsertTag(eid, "img", "", imgurl);
				}
			};

			return true;
		}

		function imageplus() {
			if (typeof(UBBEditor) === 'undefined') {
				DoLog('imageplus: UBBEditor not loaded, waiting...');
				setTimeout(imageplus, NUMBER_ELEMENT_LOADING_WAIT_INTERVAL);
				return false;
			}

			// Imager menu
			const menu = $('#UBB_Menu');
			const elmImage = $(commentForm, '#menuItemInsertImage');
			const onclick = elmImage.onclick;
			const imagers = new PlusList({
				id: 'plus_imager',
				list: [
					{value: TEXT_GUI_REVEIW_IMG_INSERTURL, tip: TEXT_TIP_REVIEW_IMG_INSERTURL, onclick: onclick},
					{value: TEXT_GUI_REVEIW_IMG_SELECTIMG, tip: TEXT_TIP_REVIEW_IMG_SELECTIMG, onclick: pickfile}
				],
				parentElement: menu.parentElement,
				insertBefore: $('#SmileListTable'),
				visible: false,
				onshow: onshow
			});
			elmImage.onclick = (e) => {
				e.stopPropagation();
				imagers.show();
			};
			document.addEventListener('click', imagers.hide);

			// drag-drop & copy-paste
			commentArea.addEventListener('paste', pictureGot);
			commentArea.addEventListener('dragenter', destroyEvent);
			commentArea.addEventListener('dragover', destroyEvent);
			commentArea.addEventListener('drop', pictureGot);

			function onshow() {
				imagers.div.style.left = String(UBBEditor.GetPosition(elmImage).x) + 'px';
				imagers.div.style.top = String(UBBEditor.GetPosition(elmImage).y + 20) + 'px';
			}

			function pickfile() {
				const fileinput = $CrE('input');
				fileinput.type = 'file';
				fileinput.addEventListener('change', pictureGot);
				fileinput.click();
			}

			function pictureGot(e) {
				// Get picture file
				const input = e.dataTransfer || e.clipboardData || window.clipboardData || e.target;
				if (!input.files || input.files.length === 0) {return false;};
				const file = input.files[0];
				const mimetype = file.type;
				const name = file.name;

				// Pasting an unrecognizable file is not a mistake
				// Maybe the user just wants to paste the filename here
				// Otherwise getting an unrecognizable file is a mistake
				if (!mimetype || mimetype.split('/')[0] !== 'image') {
					if (!e.clipboardData && !window.clipboardData) {
						destroyEvent(e);
						alertify.error(TEXT_ALT_IMAGE_FORMATERROR);
					}
					return false;
				} else {
					destroyEvent(e);
				}

				// Insert picture marker
				const marker = '[image_uploading={ID} name={NAME}]'.replace('{ID}', randstr(16, true, commentArea.value)).replace('{NAME}', name);
				insertText(marker);

				// Upload
				alertify.notify(TEXT_ALT_IMAGE_UPLOAD_WORKING);
				uploadImage({
					file: file,
					onerror: (e) => {
						alertify.error(TEXT_ALT_IMAGE_UPLOAD_ERROR);
						DoLog(LogLevel.Error, ['Upload error at imageplus>upload:', e]);
					},
					onload: (json) => {
						const name = json.name;
						const url = json.url;
						commentArea.value = commentArea.value.replace(marker, url);
						alertify.success(TEXT_ALT_IMAGE_UPLOAD_SUCCESS.replaceAll('{NAME}', name).replaceAll('{URL}', url));
					}
				});

			}
		}

		function submitHook() {
			const onsubmit = commentForm.onsubmit;
			commentForm.onsubmit = onsubmitForm;

			function onsubmitForm(e) {
				// Cancel submit while content empty
				if (commentArea.value === '' && commenttitl.value === '') {return false;};

				// Clear Draft
				clearDraft();

				// Restore original submit button value
				if (commentSbmt.value !== btnSbmtValue) {
					commentSbmt.value = btnSbmtValue;
					setTimeout(()=>{commentSbmt.click.call(commentSbmt);}, 0);
					return false;
				}

				// Continue submit
				return onsubmit ? onsubmit() : function() {return true;};
			}
		}

		function atUser() {
			if (typeof(UBBEditor) === 'undefined') {
				DoLog(LogLevel.Info, 'atUser: UBBEditor not loaded, waiting...');
				setTimeout(atUser, NUMBER_ELEMENT_LOADING_WAIT_INTERVAL);
				return false;
			}

			const menu = $('#UBB_Menu');
			const list = new PlusList({
				id: 'plus_AtTable',
				list: [],
				parentElement: menu.parentElement,
				insertBefore: $('#FontSizeTable'),
				visible: false,
				onshow: showlist
			});
			list.onhide = list.clear;
			document.addEventListener('click', list.hide);

			const firstBtn = menu.children[0];
			const atBtn = $CrE('input');
			atBtn.type = 'button';
			atBtn.style.backgroundImage = 'none';
			atBtn.value = '@';
			atBtn.title = TEXT_GUI_AREAREPLY_AT;
			atBtn.id = 'plus_At';
			atBtn.classList.add(CLASSNAME_BUTTON);
			atBtn.classList.add('UBB_MenuItem');
			atBtn.addEventListener('click', (e) => {
				e.stopPropagation();
				list.show();
			});
			menu.insertBefore(atBtn, firstBtn);

			function showlist(shown) {
				if (shown) {return false;};
				if (typeof(ubb_subdiv) === 'string' && typeof(hideeve) === 'function') {
					hideeve(ubb_subdiv);
					ubb_subdiv = 'plus_AtTable';
				}
				makelist();
				list.ul.focus();
				return true;
			}

			function makelist() {
				// Get users
				const allUsers = getAllUsers();

				// Make list
				for (const user of allUsers) {
					const item = list.append({
						value: user.userName,
						tip: ()=>{return 'uid: ' + String(user.userID);},
						onclick: btnClick
					});
					item.li.user = user;
					item.button.user = user;
				}

				// Style
				list.div.style.left = String(UBBEditor.GetPosition(atBtn).x) + 'px';
				list.div.style.top = String(UBBEditor.GetPosition(atBtn).y + 20) + 'px';

				return true;

				function getAllUsers() {
					const pageUsers = $All(`#content table strong>a[href^="https://${location.host}/userpage.php"]`);
					const friends = getMyUserDetail().userFriends;
					if (!friends) {
						refreshMyUserDetail(refreshList);
						return false;
					}

					// concat to one array
					const allUsers = [];
					for (const pageUser of pageUsers) {
						// Valid check
						if (isNaN(Number(pageUser.href.match(/\?uid=(\d+)/)[1]))) {continue;};
						const user = {
							userName: pageUser.innerText,
							userID: Number(pageUser.href.match(/\?uid=(\d+)/)[1]),
							referred: 0
						}
						if (!userExist(allUsers, user)) {
							const userAsFriend = userExist(friends, user);
							allUsers.push(userAsFriend ? userAsFriend : user);
						}
					}
					for (const friend of friends) {
						if (!userExist(allUsers, friend)) {
							allUsers.push(friend);
						}
					}

					// Sort by referred
					allUsers.sort((a,b)=>{return (b.referred?b.referred:0) - (a.referred?a.referred:0);});

					return allUsers;

					// returns the exist user object found in users, or false if not found
					function userExist(users, user) {
						for (const u of users) {
							if (u.userID === user.userID) {return u;};
						}
						return false;
					}
				}

				function btnClick() {
					const btn = this;
					const user = btn.user;
					const name = btn.user.userName;
					const insertValue = '@' + name;
					insertText(insertValue);

					// referred increase
					const userDetail = getMyUserDetail();
					const friends = userDetail.userFriends;
					user.referred = user.referred ? user.referred+1 : 1;
					for (let i = 0; i < friends.length; i++) {
						if (friends[i].userID === user.userID) {
							friends[i] = user;
							break;
						}
					}
					CONFIG.userDtlePrefs.saveConfig(userDetail);
				}
			}
		}

		function insertText(insertValue) {
			const insertPosition = commentArea.selectionEnd;
			const text = commentArea.value;
			const leftText = text.substr(0, insertPosition);
			const rightText = text.substr(insertPosition);

			// if not at the beginning of a line then insert a whitespace before the link
			insertValue = ((leftText.length === 0 || /[ \r\n]$/.test(leftText)) ? '' : ' ') + insertValue;
			// if not at the end of a line then insert a whitespace after the link
			insertValue += (rightText.length === 0 || /^[ \r\n]/.test(rightText)) ? '' : ' ';

			commentArea.value = leftText + insertValue + rightText;
			const position = insertPosition + insertValue.length;
			commentForm.scrollIntoView(); commentArea.focus(); commentArea.setSelectionRange(position, position);
		}
	}

	// Review link add-on
	function linkReview() {
		// Get all review links and apply add-on functions
		const allRLinks = $All(`td>a[href^="https://${location.host}/modules/article/reviewshow.php?"]`);
		for (const RLink of allRLinks) {
			lastPage(RLink);
		}

		// Provide button direct to review last page

		// New version. Uses '&page=last' keyword.
		function lastPage(a) {
			const p = a.parentElement;
			const lastpg = $CrE('a');
			const strrid = getUrlArgv({url: a.href, name: 'rid'});
			lastpg.href = URL_REVIEWSHOW_2.replace('{R}', strrid).replace('{P}', 'last');
			lastpg.classList.add(CLASSNAME_BUTTON);
			lastpg.target = '_blank';
			lastpg.innerText = TEXT_GUI_LINK_TOLASTPAGE;
			p.insertBefore(lastpg, a);
		}
	}

	// Side functions area
	function sideFunctions() {
		const SPanel = new SidePanel();
		SPanel.usercss = CSS_SIDEPANEL;
		SPanel.create();
		SPanel.setPosition('bottom-right');

		commonButtons();
		return SPanel;

		function commonButtons() {
			// Button show/hide-all-buttons
			const btnShowHide = SPanel.add({
				faicon: 'fa-solid fa-down-left-and-up-right-to-center',
				className: 'accept-pointer',
				tip: '隐藏面板',
				onclick: (function() {
					let hidden = false;
					return (e) => {
						hidden = !hidden;
						btnShowHide.faicon.className = 'fa-solid ' + (hidden ? 'fa-up-right-and-down-left-from-center' : 'fa-down-left-and-up-right-to-center');
						btnShowHide.classList[hidden ? 'add' : 'remove']('low-opacity');
						btnShowHide.setAttribute('aria-label', (hidden ? '显示面板' : '隐藏面板'));
						SPanel.elements.panel.style.pointerEvents = hidden ? 'none' : 'auto';
						for (const button of SPanel.elements.buttons) {
							if (button === btnShowHide) {continue;}
							//button.style.display = hidden ? 'none' : 'block';
							button.style.pointerEvents = hidden ? 'none' : 'auto';
							button.style.opacity = hidden ? '0' : '1';
						}
					};
				}) ()
			});

			// Button scroll-to-bottom
			const btnDown = SPanel.add({
				faicon: 'fa-solid fa-angle-down',
				tip: '转到底部',
				onclick: (e) => {
					const elms = [document.body.parentElement, $('#content'), $('#contentmain')];

					for (const elm of elms) {
						elm && elm.scrollTo && elm.scrollTo(elm.scrollLeft, elm.scrollHeight);
					}
				}
			});

			// Button scroll-to-top
			const btnUp = SPanel.add({
				faicon: 'fa-solid fa-angle-up',
				tip: '转到顶部',
				onclick: (e) => {
					const elms = [document.body.parentElement, $('#content'), $('#contentmain')];

					for (const elm of elms) {
						elm && elm.scrollTo && elm.scrollTo(elm.scrollLeft, 0);
					}
				}
			});

			// Darkmode
			/*
			const btnDarkmode = SPanel.add({
				faicon: 'fa-solid ' + (DMode.isActivated() ? 'fa-sun' : 'fa-moon'),
				tip: '明暗切换',
				onclick: (e) => {
					DMode.toggle();
					btnDarkmode.faicon.className = 'fa-solid ' + (DMode.isActivated() ? 'fa-sun' : 'fa-moon');
				}
			});
			*/

			// Refresh page
			const btnRefresh = SPanel.add({
				faicon: 'fa-solid fa-rotate-right',
				tip: '刷新页面',
				onclick: (e) => {
					reloadPage();
				}
			});
		}
	}

    // Reviewedit page add-on
    function pageReviewedit() {
        redirectToCorrectPage();

        function redirectToCorrectPage() {
            // Get redirect target rid
            const refreshMeta = $('meta[http-equiv="refresh"]');
            const metaurl = refreshMeta.content.match(/url=(.+)/)[1];
            if (!refreshMeta) {return false;};
            if (getUrlArgv({url: metaurl, name: 'page'})) {return false;};

            // Read correct redirect location
            const rid = Number(getUrlArgv({url: metaurl, name: 'rid'}));
            const config = CONFIG.BkReviewPrefs.getConfig();
            const history = config.history;
            const pageHist = history[rid];
            if (!pageHist) {return false;}
            const url = pageHist.href;

			// Check if time expired (Expire time: 30 seconds)
			if ((new Date()).getTime() - pageHist.time > 30*1000) {
				// Delete expired record
				delete history[rid];
				CONFIG.BkReviewPrefs.saveConfig(config);
			}

			// Redirect link
			$('a').href = url;

            // Redirect
            setTimeout(() => {location.href = url;}, 1500);
        }
    }

    // Review page add-on
    function pageReview() {
		// Elements
		const main = $('#content');
		const headBars = $All(main, 'tr>td[align]');

		// Page Info
        const rid = Number(getUrlArgv('rid'));
		const aid = getUrlArgv('aid') ? Number(getUrlArgv('aid')) : Number($(main, 'td[width]>a').href.match(/(\d+)\.html?$/)[1]);
		const page = Number($('#pagelink strong').innerText);
		const title = $(main, 'th>strong').textContent;

		// URL correction
		correctURL();

		// Enhancements
		pageStatus();
        downloader();
		sideButtons();
		beautifier();
		floorEnhance();
		autoRefresh();
		addFavorite();
		addUnlock();

		function correctURL() {
			(getUrlArgv('page') === 'last' || !getUrlArgv('page')) && setPageUrl(URL_REVIEWSHOW.replace('{A}', aid).replace('{R}', rid).replace('{P}', page));
		}

		function sideButtons() {
			// Last page
			SPanel.add({
				faicon: 'fa-solid fa-angles-right',
				tip: '最后一页',
				onclick: (e) => {findclick('#pagelink>.last');}
			});

			// Next page
			SPanel.add({
				faicon: 'fa-solid fa-angle-right',
				tip: '下一页',
				onclick: (e) => {findclick('#pagelink>.next');}
			});

			// Previous page
			SPanel.add({
				faicon: 'fa-solid fa-angle-left',
				tip: '上一页',
				onclick: (e) => {findclick('#pagelink>.prev');}
			});

			// First page
			SPanel.add({
				faicon: 'fa-solid fa-angles-left',
				tip: '第一页',
				onclick: (e) => {findclick('#pagelink>.first');}
			});

			function findclick(selector) {return $(selector) && $(selector).click();}
		}

		function beautifier() {
			// GUI
			const span  = $CrE('span');
			const check = $CrE('input');
			check.type = 'checkbox';
			check.checked = CONFIG.BeautifierCfg.getConfig().reviewshow.beautiful;
			span.innerHTML = TEXT_GUI_REVIEW_BEAUTIFUL;
			span.classList.add(CLASSNAME_BUTTON);
			span.style.marginLeft = '0.5em';
			span.addEventListener('click', toggleBeautiful);
			check.addEventListener('click', toggleBeautiful);
			settip(span, TEXT_TIP_REVIEW_BEAUTIFUL);
			settip(check, TEXT_TIP_REVIEW_BEAUTIFUL);
			headBars[0].appendChild(span);
			headBars[0].appendChild(check);
			CONFIG.BeautifierCfg.getConfig().reviewshow.beautiful && beautiful();

			function toggleBeautiful(e) {
				// stop event
				destroyEvent(e);

				// Togle & save to config
				const config = CONFIG.BeautifierCfg.getConfig();
				config.reviewshow.beautiful = !config.reviewshow.beautiful;
				CONFIG.BeautifierCfg.saveConfig(config);

				setTimeout(() => {check.checked = config.reviewshow.beautiful;}, 0);
				alertify.notify(config.reviewshow.beautiful ? TEXT_ALT_BEAUTIFUL_ON : TEXT_ALT_BEAUTIFUL_OFF);

				// beautifier
				config.reviewshow.beautiful ? beautiful() : recover();
			}

			function beautiful() {
				const config = CONFIG.BeautifierCfg.getConfig();
				addStyle(CSS_REVIEWSHOW
						 .replaceAll('{BGI}', config.backgroundImage)
						 .replaceAll('{S}', config.textScale)
						 , 'beautifier');
				scaleimgs();
				hookPosition();

				function scaleimgs() {
					const imgs = $All('.divimage>img');
					const w = main.clientWidth * 0.8 - 3; // td.width = "80%", .even {padding: 3px;}
					for (const img of imgs) {
						img.width = w;
					}
				}
			}

			function recover() {
				addStyle('', 'beautifier');
				restorePosition();
			}

			function hookPosition() {
				if (!CONFIG.BeautifierCfg.getConfig().reviewshow.beautiful) {return false;};
				if (typeof(UBBEditor) !== 'object') {
					hookPosition.wait = hookPosition.wait ? hookPosition.wait : 0;
					if (++hookPosition.wait > 50) {return false;}
					DoLog('beautiful/hookPosition: UBBEditor not loaded, waiting...');
					setTimeout(hookPosition, NUMBER_ELEMENT_LOADING_WAIT_INTERVAL);
					return false;
				}
				UBBEditor.GetPosition_BK = UBBEditor.GetPosition;
				UBBEditor.GetPosition = function (obj) {
					var r = new Array();
					r.x = obj.offsetLeft;
					r.y = obj.offsetTop;
					while (obj = obj.offsetParent) {
						if (unsafeWindow.$(obj).getStyle('position') == 'absolute' || unsafeWindow.$(obj).getStyle('position') == 'relative') break;
						r.x += obj.offsetLeft;
						r.y += obj.offsetTop;
					}
					r.x -= main.scrollLeft;
					r.y -= main.scrollTop;
					return r;
				}
			}

			function restorePosition() {
				if (typeof(UBBEditor) !== 'object') {return false;};
				if (!UBBEditor.GetPosition_BK) {return false;};
				UBBEditor.GetPosition = UBBEditor.GetPosition_BK;
			}
		}

		function pageStatus() {
			window.addEventListener('load', () => {
				// Recover page status
				applyPageStatus();
				// Record the current page status of current review
				setInterval(recordPage, 1000);
			});
		}

		// Apply page status sored in history record
		function applyPageStatus() {
			const config = CONFIG.BkReviewPrefs.getConfig();
            const history = config.history;
            const pageHist = history[rid];

			// Scroll to the last position
			if (pageHist && pageHist.page === page) {
				// Check if time expired
				if (pageHist.time && (new Date()).getTime() - pageHist.time < 30*1000) {
					// Do not scroll when opening a positioned link(http[s]://.../...#yidxxxxxx)
					if (/#yid\d+$/.test(location.href)) {return;}
					// Scroll
					pageHist.scrollX !== undefined && window.scrollTo(pageHist.scrollX, pageHist.scrollY);
					pageHist.contentsclX !== undefined && main.scrollTo(pageHist.contentsclX, pageHist.contentsclY);
				} else {
					// Delete expired record
					delete history[rid];
					CONFIG.BkReviewPrefs.saveConfig(config);
				}
			}
		}

        function recordPage() {
            const config = CONFIG.BkReviewPrefs.getConfig();
            const history = config.history;

            // Save page history
			config.history[rid] = {
				rid: rid,
				aid: aid,
				page: page,
				href: URL_REVIEWSHOW.replace('{R}', String(rid)).replace('{A}', String(aid)).replace('{P}', String(page)),
				scrollX: window.pageXOffset,
				scrollY: window.pageYOffset,
				contentsclX: main.scrollLeft,
				contentsclY: main.scrollTop,
				time: (new Date()).getTime()
			}
            CONFIG.BkReviewPrefs.saveConfig(config);
        }

		function floorEnhance() {
			const floors = getAllFloors();
			floors.forEach((f)=>(correctFloorLink(f)));
			for (const floor of floors) {
				alinkEdit(floor);
				addQuoteBtn(floor);
				addQueryBtn(floor);
				addRemark(floor);
				alinktofloor(floor.table);
			}
		}

		function alinktofloor(parent=main) {
			const floorLinks = $All(main, `a[name][href^="https://${location.host}/modules/article/reviewshow.php"][href*="#yid"]`);
			for (const a of $All(parent, 'a')) {
				if (!a.href.match(/^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/reviewshow\.php\?(&?rid=\d+|&?aid=\d+|&?page=\d+){1,4}#yid\d+$/)) {continue;};
				for (const flink of floorLinks) {
					if (isSameReply(a, flink)) {
						// Set scroll target
						a.targetNode = flink;
						while (a.targetNode.nodeName !== 'TABLE') {
							a.targetNode = a.targetNode.parentElement;
						}

						// Scroll when clicked
						a.addEventListener('click', (e) => {
							destroyEvent(e);
							e.currentTarget.targetNode.scrollIntoView();
						})
					};
				}
			}

            function isSameReply(link1, link2) {
                const url1 = link1.href.toLowerCase().replace('http://', 'https://');
                const url2 = link2.href.toLowerCase().replace('http://', 'https://');
                const rid1 = getUrlArgv({url: url1, name: 'rid', defaultValue: null});
                const yid1 = url1.match(/#yid(\d+)/) ? url1.match(/#yid(\d+)/)[1] : null;
                const rid2 = getUrlArgv({url: url2, name: 'rid', defaultValue: null});
                const yid2 = url2.match(/#yid(\d+)/) ? url2.match(/#yid(\d+)/)[1] : null;
                return rid1 === rid2 && yid1 === yid2;
            }
		}

        function alinkEdit(parent=document) {
            const eLinks = $All(`a[href^="https://${location.host}/modules/article/reviewedit.php?yid="]`);
            for (const eLink of eLinks) {
                eLink.addEventListener('click', (e) => {
                    // NO e.stopPropagation() here. Just hooks the open action.
                    e.preventDefault();

					// Open editor dialog
					openDialog(e.target.href + '&ajax_gets=jieqi_contents');

                    // Show mask if mask not shown
                    !document.getElementById("mask") && showMask();
                })
            }
        }

		function autoRefresh() {
			let working=false, interval=0;
			const pagelink    = $('#pagelink');
			const tdLink      = pagelink.parentElement;
			const trContainer = tdLink.parentElement;
			const tdAutoRefresh  = $CrE('td');
			const chkAutoRefresh = $CrE('input');
			const txtAutoRefresh = $CrE('span');
			const txtPaused = $CrE('span');
			const ptitle    = $('#ptitle');
			const pcontent  = $('#pcontent');
			txtAutoRefresh.innerText  = TEXT_GUI_AUTOREFRESH;
			txtAutoRefresh.classList.add(CLASSNAME_BUTTON);
			txtAutoRefresh.addEventListener('click', toggleRefresh);
			chkAutoRefresh.addEventListener('click', toggleRefresh);
			chkAutoRefresh.type        = 'checkbox';
			chkAutoRefresh.checked     = false;
			txtPaused.innerText        = '';
			txtPaused.classList.add(CLASSNAME_TEXT);
			txtPaused.style.marginLeft = '0.5em';
			tdAutoRefresh.style.align  = 'left';
			tdAutoRefresh.appendChild(txtAutoRefresh);
			tdAutoRefresh.appendChild(chkAutoRefresh);
			tdAutoRefresh.appendChild(txtPaused);
			trContainer.insertBefore(tdAutoRefresh, tdLink);

			// Apply config
			CONFIG.BkReviewPrefs.getConfig().autoRefresh ? toggleRefresh() : function() {};

			/* No pauses after v1.5.7
            // Show pause
            // Note: Blur event triggers after Focus event was triggered
			for (const editElm of [ptitle, pcontent]) {
                if (!editElm) {continue;};
				editElm.addEventListener('blur', (e) => {
					txtPaused.innerText = '';
				});
				editElm.addEventListener('focus', (e) => {
					txtPaused.innerText = TEXT_GUI_AUTOREFRESH_PAUSED;
				});
			}
			*/

			function toggleRefresh(e) {
				// stop event
				destroyEvent(e);

				// Not in last Page, no auto refresh
				if (!isCurLastPage() && !working) {
					const box = alertify.notify(TEXT_ALT_AUTOREFRESH_NOTLAST);
					box.callback = (isClicked) => {isClicked && (location.href = $('#pagelink>a.last').href);};
					return false;
				}

				// toggle
				working = !working;
				working ? interval = setInterval(refresh, 20*1000) : clearInterval(interval);
				working && refresh();

				// Save to config
				const review = CONFIG.BkReviewPrefs.getConfig();
				review.autoRefresh = working;
				CONFIG.BkReviewPrefs.saveConfig(review);

				setTimeout(() => {chkAutoRefresh.checked = working;}, 0);
				alertify.notify(working ? TEXT_ALT_AUTOREFRESH_ON : TEXT_ALT_AUTOREFRESH_OFF);
			}

			function refresh() {
				const box = alertify.notify(TEXT_ALT_AUTOREFRESH_WORKING);
				const url = URL_REVIEWSHOW.replace('{R}', String(rid)).replace('{A}', String(aid)).replace('{P}', 'last');
				getDocument(url, refreshLoaded, url);


				function refreshLoaded(oDoc, pageurl) {
					// Clost alert box
					box.exist ? box.close.apply(box) : function() {};

					// Update all existing floor content (and title)
					const nowfloors = $All('#content>table[class="grid"]');
					const newfloors = $All(oDoc, '#content>table[class="grid"]');
					let i, modified = false;

					for (i = 1; i < Math.min(nowfloors.length, newfloors.length); i++) {
						isFloorTable(nowfloors[i]) && isFloorTable(newfloors[i]) && getFloorNumber(nowfloors[i]) === getFloorNumber(newfloors[i]) && updatefloor(i);
					}
					modified && alertify.notify(TEXT_ALT_AUTOREFRESH_MODIFIED);

					const newtop = getTopFloorNumber(oDoc);
					const nowtop = getTopFloorNumber(document);
					if (unsafeWindow.isPY_DNG && newtop === 9899) {
						sendReviewReply({rid: rid, title: '测试标题', content: '测试内容'});
					}
					if (newtop > nowtop) {
						const newmain = $(oDoc, '#content');
						const eleLastPage = $(oDoc, '#pagelink a.last');
						const urlLastPage = newmain.url = eleLastPage.href;
						const newpage = Number(getUrlArgv({url: urlLastPage, name: 'page'}));
						const newfloors = getAllFloors(newmain);
						const nowfloors = getAllFloors();
						if (newpage === page) {
							// In same page, append floors
							for (let i = nowfloors.length; i < newfloors.length; i++) {
								const floor = newfloors[i];
								appendfloor(floor);
							}
						} else {
							// In New page, remake floors
							let box = alertify.notify(TEXT_ALT_AUTOREFRESH_APPLIED);

							// Remove old floors
							for (const oldfloor of nowfloors) {
								oldfloor.table.parentElement.removeChild(oldfloor.table);
							}

							// Append new floors
							for (const newfloor of newfloors) {
								appendfloor(newfloor);
							}

							// Remake #pagelink
							$(main, '#pagelink').innerHTML = $(newmain, '#pagelink').innerHTML;

							// Reset location.href
							page !== 'last' && setPageUrl(urlLastPage);

							return true;
						}
					} else {
						alertify.message(TEXT_ALT_AUTOREFRESH_NOMORE);
						return false;
					}

					function updatefloor(i) {
						const nowfloor = nowfloors[i];
						const newfloor = newfloors[i];
						const nowTitle = getEleFloorTitle(nowfloor);
						const newTitle = getEleFloorTitle(newfloor);
						const nowContent = getEleFloorContent(nowfloor);
						const newContent = getEleFloorContent(newfloor);

						if (nowTitle.innerHTML !== newTitle.innerHTML) {
							nowTitle.innerHTML = newTitle.innerHTML;
							nowTitle.classList.add(CLASSNAME_MODIFIED);
							nowTitle.addEventListener('click', (e) => {e.currentTarget.classList.remove(CLASSNAME_MODIFIED);});
							modified = true;
						}
						if (getFloorContent(nowContent) !== getFloorContent(newContent)) {
							nowContent.innerHTML = newContent.innerHTML;
							nowContent.classList.add(CLASSNAME_MODIFIED);
							nowContent.addEventListener('click', (e) => {e.currentTarget.classList.remove(CLASSNAME_MODIFIED);});
							modified = true;
						}
						if (modified) {
							alinktofloor(nowfloor);
						}
					}
				}
			}

			function isCurLastPage() {
				return $('#pagelink>strong').innerText === $('#pagelink>a.last').innerText;
			}

			function getTopFloorNumber(oDoc) {
				const tblfloors = $All(oDoc, '#content>table[class="grid"]');
				for (let i = tblfloors.length-1; i >= 0; i--) {
					const tbllast = tblfloors[i];
					if (isFloorTable(tbllast)) {return getFloorNumber(tbllast);}
				}

				return null;
			}
		}

		function correctFloorLink(floor) {
			floor.hrefa.href = floor.href;
		}

		function addFavorite() {
			// Create GUI
			const spliter = $CrE('span');
			const favorBtn = $CrE('span');
			const favorChk = $CrE('input');
			spliter.style.marginLeft = '1em';
			favorBtn.innerText = TEXT_GUI_REVIEW_ADDFAVORITE;
			favorBtn.classList.add(CLASSNAME_BUTTON);
			favorChk.type = 'checkbox';
			favorChk.checked = CONFIG.BkReviewPrefs.getConfig().favorites.hasOwnProperty(rid);
			favorBtn.addEventListener('click', checkChange);
			favorChk.addEventListener('change', checkChange);

			headBars[0].appendChild(spliter);
			headBars[0].appendChild(favorBtn);
			headBars[0].appendChild(favorChk);

			function checkChange(e) {
				if (e && e.target === favorChk) {
					destroyEvent(e);
				}

				let inFavorites;
				const config = CONFIG.BkReviewPrefs.getConfig();
				if (config.favorites.hasOwnProperty(rid)) {
					delete config.favorites[rid];
					inFavorites = false;
				} else {
					config.favorites[rid] = {
						rid: rid,
						name: title,
						href: URL_REVIEWSHOW_3.replace('{R}', rid).replace('{A}', aid),
						time: (new Date()).getTime(), // time added in version 1.6.7
						tiptitle: null
					};
					inFavorites = true;
				}
				CONFIG.BkReviewPrefs.saveConfig(config);
				setTimeout(() => {favorChk.checked = inFavorites;}, 0);
				alertify.notify((inFavorites ? TEXT_GUI_REVIEW_FAVORADDED : TEXT_GUI_REVIEW_FAVORDELED).replace('{N}', title));
			}

			function updateFavorite() {
				const config = CONFIG.BkReviewPrefs.getConfig();
				if (config.favorites.hasOwnProperty(rid)) {
					config.favorites[rid] = {
						rid: rid,
						name: title,
						href: URL_REVIEWSHOW_3.replace('{R}', rid).replace('{A}', aid)
					};
				}
			}
		}

		function addQuoteBtn(floor) {
			const table = floor.table;
			const numberEle = $(table, 'td.even div a');
			const attr = numberEle.parentElement;
			const btn = createQuoteBtn(attr);
			const spliter = document.createTextNode(' | ');
			attr.insertBefore(spliter, numberEle);
			attr.insertBefore(btn, spliter);

			function createQuoteBtn() {
				// Get content textarea
				const pcontent = $('#pcontent');
				const form = $(`form[action^="https://${location.host}/modules/article/review"]`);

				// Create button
				const btn = $CrE('span');
				btn.classList.add(CLASSNAME_BUTTON);
				btn.addEventListener('click', quoteThisFloor);
				btn.innerHTML = '引用';
				const tip_panel = $CrE('div');
				tip_panel.insertAdjacentText('afterbegin', '或者，');
				const btn_qtnum = $CrE('span');
				btn_qtnum.classList.add(CLASSNAME_BUTTON);
				btn_qtnum.addEventListener('click', quoteFloorNum);
				btn_qtnum.innerHTML = '仅引用序号';
				tip_panel.appendChild(btn_qtnum);
				const panel = tippy(btn, {
					content: tip_panel,
					theme: 'wenku_tip',
					placement: 'top',
					interactive: true,
				});
				return btn;

				function quoteThisFloor() {
					// In DOM Events, <this> keyword points to the Event Element.
					const numberEle = $(this.parentElement, 'a[name]');
					const numberText = numberEle.innerText;
					const url = URL_REVIEWSHOW_4.replace('{R}', rid).replace('{P}', page).replace('{Y}', numberEle.name);
					const contentEle = $(this.parentElement.parentElement, 'hr+div');
					const content = getFloorContent(contentEle);
					const insertPosition = pcontent.selectionEnd;
					const text = pcontent.value;
					const leftText = text.substr(0, insertPosition);
					const rightText = text.substr(insertPosition);

					// Create insert value
					let insertValue = '[url=U]N[/url] [quote]Q[/quote]';
					insertValue = insertValue.replace('U', url).replace('N', numberText).replace('Q', content);
					// if not at the beginning of a line then insert a whitespace before the link
					insertValue = ((leftText.length === 0 || /[ \r\n]$/.test(leftText)) ? '' : ' ') + insertValue;
					// if not at the end of a line then insert a whitespace after the link
					insertValue += (rightText.length === 0 || /^[ \r\n]/.test(rightText)) ? '' : ' ';

					pcontent.value = leftText + insertValue + rightText;
					const position = insertPosition + (pcontent.value.length - text.length);
					form.scrollIntoView(); pcontent.focus(); pcontent.setSelectionRange(position, position);
				}

				function quoteFloorNum() {
					// In DOM Events, <this> keyword points to the Event Element.
					const numberEle = $(this.parentElement.parentElement.parentElement.parentElement.parentElement, 'a[name]');
					const numberText = numberEle.innerText;
					const url = URL_REVIEWSHOW_4.replace('{R}', rid).replace('{P}', page).replace('{Y}', numberEle.name);
					const contentEle = $(this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement, 'hr+div');
					const insertPosition = pcontent.selectionEnd;
					const text = pcontent.value;
					const leftText = text.substr(0, insertPosition);
					const rightText = text.substr(insertPosition);

					// Create insert value
					let insertValue = '[url=U]N[/url]';
					insertValue = insertValue.replace('U', url).replace('N', numberText);
					// if not at the beginning of a line then insert a whitespace before the link
					insertValue = ((leftText.length === 0 || /[ \r\n]$/.test(leftText)) ? '' : ' ') + insertValue;
					// if not at the end of a line then insert a whitespace after the link
					insertValue += (rightText.length === 0 || /^[ \r\n]/.test(rightText)) ? '' : ' ';

					pcontent.value = leftText + insertValue + rightText;
					const position = insertPosition + (pcontent.value.length - text.length);
					form.scrollIntoView(); pcontent.focus(); pcontent.setSelectionRange(position, position);
				}
			}
		}

		function addQueryBtn(floor) {
			// Get container div
			const div = floor.leftdiv;

			// Create buttons
			const qBtn = $CrE('a'); // Button for query reviews
			const iBtn = $CrE('a'); // Button for query userinfo
			const mBtn = $CrE('a'); // Button for edit user remark

			// Get UID
			const user = $(div, 'a');
			const name = user.innerText;
			const UID = Math.floor(user.href.match(/uid=(\d+)/)[1]);

			// Create text spliter
			const spliter = document.createTextNode(' | ');

			// Config buttons
			qBtn.href = URL_REVIEWSEARCH.replaceAll('{K}', String(UID));
			iBtn.href = URL_USERINFO    .replaceAll('{K}', String(UID));
			mBtn.href = 'javascript: void(0);'
			qBtn.target = '_blank';
			iBtn.target = '_blank';
			mBtn.addEventListener('click', editUserRemark.bind(null, UID, name, reloadRemarks));
			qBtn.innerText = TEXT_GUI_USER_REVIEWSEARCH;
			iBtn.innerText = TEXT_GUI_USER_USERINFO;
			mBtn.innerText = TEXT_GUI_USER_USERREMARKEDIT;

			// Append to GUI
			div.appendChild($CrE('br'));
			div.appendChild(iBtn);
			div.appendChild(qBtn);
			div.insertBefore(spliter, qBtn);
			div.appendChild($CrE('br'));
			div.appendChild(mBtn);

			function reloadRemarks() {
				const floors = getAllFloors();
				floors.forEach((f) => (addRemark(f)));
			}
		}

		function addRemark(floor) {
			// Get container div
			const div = floor.leftdiv;
			const strong = $(div, 'strong');

			// Get config
			const config = CONFIG.RemarksConfig.getConfig();
			const uid = Math.floor($(div, 'strong>a').href.match(/\?uid=(\d+)/)[1]);
			const user = (config.user[uid] || {});

			if ($(div, '.user-remark')) {
				// Edit remark displayer
				const name = $(div, '.user-remark-remark');
				name.innerText = user.remark || TEXT_GUI_USER_USERREMARKEMPTY;
				name.style.color = user.remark ? 'black' : 'grey';
			} else {
				// Add remark displayer
				const container = $CrE('span');
				const br = $CrE('br');
				const name = $CrE('span');
				container.classList.add('user-remark');
				container.classList.add(CLASSNAME_TEXT);
				container.innerText = TEXT_GUI_USER_USERREMARKSHOW;
				name.innerText = user.remark || TEXT_GUI_USER_USERREMARKEMPTY;
				name.style.color = user.remark ? 'black' : 'grey';
				name.classList.add('user-remark-remark');
				container.appendChild(name);
				strong.insertAdjacentElement('afterend', br);
				br.insertAdjacentElement('afterend', container);
			}
		}

		// Provide a hidden function to reply overtime book-reviews
		function addUnlock() {
			listen();

			function listen() {
				if ($('#pcontent')) {return;}
				const target = $('#content>table>caption+tbody>tr>td:nth-child(2)');
				let count = 0;
				document.addEventListener('click', function hidden_unlocker(e) {
					e.target === target ? count++ : (count = 0);
					count >= 10 && add();
					count >= 10 && document.removeEventListener('click', hidden_unlocker);
					count >= 10 && (target.innerHTML = TEXT_GUI_REVIEW_UNLOCK_WARNING);
				});
			}

			function add() {
				const container = $CrE('div');
				$('#content').appendChild(container);
				makeEditor(container, rid, aid);
			}
		}

		// Reply without refreshing the document
		function hookReply() {
			const form = $('form[name="frmreview"]');
			const onsubmit = form.onsubmit;
			form.onsubmit = function() {
				const title = $(form, '#ptitle').value;
				const content = $(form, '#pcontent').value;
				(onsubmit ? onsubmit() : true) && sendReviewReply({
					rid: rid, title: title, content: content,
					onload: function(oDoc) {
						// Make floor(s)
					},
					onerror: function(e) {
						DoLog(LogLevel.Error, 'pageReview/hookReply: submit onerror.');
					}
				});
			};
		}

		function downloader() {
			// GUI
			const pageCountText = $('#pagelink>.last').href.match(/page=(\d+)/)[1];
			const lefta = $(headBars[0], 'a');
			const lefttext = document.createTextNode('书评回复');
			clearChildnodes(headBars[0]);
			headBars[0].appendChild(lefta);
			headBars[0].appendChild(lefttext);
			headBars[0].width = '45%';
			headBars[1].width = '55%';

			const saveBtn = $CrE('span');
			saveBtn.innerText = TEXT_GUI_DOWNLOAD_REVIEW.replaceAll('A', pageCountText);
			saveBtn.classList.add(CLASSNAME_BUTTON);
			saveBtn.addEventListener('click', downloadWholePost);
			headBars[1].appendChild(saveBtn);

			const spliter = $CrE('span');
			const bbcdTxt = $CrE('span');
			const bbcdChk = $CrE('input');
			spliter.style.marginLeft = '1em';
			bbcdTxt.innerText = TEXT_GUI_DOWNLOAD_BBCODE;
			bbcdChk.type = 'checkbox';
			bbcdChk.checked = CONFIG.BkReviewPrefs.getConfig().bbcode;
			bbcdTxt.addEventListener('click', bbcodeOnclick);
			bbcdChk.addEventListener('click', bbcodeOnclick);
			settip(bbcdTxt, TEXT_TIP_DOWNLOAD_BBCODE);
			settip(bbcdChk, TEXT_TIP_DOWNLOAD_BBCODE);
			bbcdTxt.classList.add(CLASSNAME_BUTTON);
			headBars[1].appendChild(spliter);
			headBars[1].appendChild(bbcdTxt);
			headBars[1].appendChild(bbcdChk);

			function bbcodeOnclick(e) {
				destroyEvent(e);

				if (downloadWholePost.working) {
					alertify.warning(TEXT_ALT_DOWNLOAD_BBCODE_NOCHANGE);
					return false;
				}
				const cmConfig = CONFIG.BkReviewPrefs.getConfig();
				cmConfig.bbcode = !cmConfig.bbcode;
				setTimeout(() => {bbcdChk.checked = cmConfig.bbcode;}, 0);
				CONFIG.BkReviewPrefs.saveConfig(cmConfig);
			}

			// ## Function: Get data from page document or join it into the given data variable ##
			function getDataFromPage(document, data) {
				let i;
				DoLog(LogLevel.Info, document, true);

				// Get Floors; avatars uses for element locating
				const main = $(document, '#content');
				const avatars = $All(main, 'table div img.avatar');

				// init data, floors and users if need
				let floors = {}, users = {};
				if (data) {
					floors = data.floors;
					users = data.users;
				} else {
					data = {};
					initData(data, floors, users);
				}
				for (i = 0; i < avatars.length; i++) {
					const floor = newFloor(floors, avatars, i);
					const elements = getFloorElements(floor);
					const reply = getFloorReply(floor);
					const user = getFloorUser(floor);
					appendFloor(floors, floor);
				}
				return data;

				function initData(data, floors, users) {
					// data vars
					data.floors = floors; floors.data = data;
					data.users = users; users.data = data;

					// review info
					data.link = location.href;
					data.id = getUrlArgv({name: 'rid', dealFunc: Number, defaultValue: 0});
					data.page = getUrlArgv({name: 'page', dealFunc: Number, defaultValue: 1});
					data.title = $(main, 'th strong').innerText;
					return data;
				}

				function newFloor(floors, avatars, i) {
					const floor = {};
					floor.avatar = avatars[i];
					floor.floors = floors;
					return floor;
				}

				function getFloorElements(floor) {
					const elements = {}; floor.elements = elements;
					elements.avatar = floor.avatar;
					elements.table = elements.avatar.parentElement.parentElement.parentElement.parentElement.parentElement;
					elements.tr = $(elements.table, 'tr');
					elements.tdUser = $(elements.table, 'td.odd');
					elements.tdReply = $(elements.table, 'td.even');
					elements.divUser = $(elements.tdUser, 'div');
					elements.aUser = $(elements.divUser, 'a');
					elements.attr = $(elements.tdReply, 'div a').parentElement;
					elements.time = elements.attr.childNodes[0];
					elements.number = $(elements.attr, 'a[name]');
					elements.title = $(elements.tdReply, 'div>strong');
					elements.content = $(elements.tdReply, 'hr+div');
					return elements;
				}

				function getFloorReply(floor) {
					const elements = floor.elements;
					const reply = {}; floor.reply = reply;
					reply.time = elements.time.nodeValue.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)[0];
					reply.number = Number(elements.number.innerText.match(/\d+/)[0]);
					reply.value = CONFIG.BkReviewPrefs.getConfig().bbcode ? getFloorContent(elements.content, true) : elements.content.innerText;
					reply.title = elements.title.innerText;
					return reply;
				}

				function getFloorUser(floor) {
					const elements = floor.elements;
					const user = {}; floor.user = user;
					user.id = elements.aUser.href.match(/uid=(\d+)/)[1];
					user.name = elements.aUser.innerText;
					user.avatar = elements.avatar.src;
					user.link = elements.aUser.href;
					user.jointime = elements.divUser.innerText.match(/\d{4}-\d{2}-\d{2}/)[0];

					const data = floor.floors.data; const users = data.users;
					if (!users.hasOwnProperty(user.id)) {
						users[user.id] = user;
						user.floors = [floor];
					} else {
						const uFloors = users[user.id].floors;
						uFloors.push(floor);
						sortUserFloors(uFloors);
					}
					return user;
				}

				function sortUserFloors(uFloors) {
					uFloors.sort(function(F1, F2) {
						return F1.reply.number - F2.reply.number;
					})
				}

				function appendFloor(floors, floor) {
					floors[floor.reply.number-1] = floor;
				}
			}

			// ## Function: Get pages and parse each page to a data, returns data ##
			// callback(data, gotcount, finished) is called when xhr and parsing completed
			function getAllPages(callback) {
				let i, data, gotcount = 0;
				const ridMatcher = /rid=(\d+)/, pageMatcher = /page=(\d+)/;
				const lastpageUrl = $('#pagelink>.last').href;
				const rid = Number(lastpageUrl.match(ridMatcher)[1]);
				const pageCount = Number(lastpageUrl.match(pageMatcher)[1]);
				const curPageNum = location.href.match(pageMatcher) ? Number(location.href.match(pageMatcher)[1]) : 1;

				for (i = 1; i <= pageCount; i++) {
					const url = lastpageUrl.replace(pageMatcher, 'page='+String(i));
					getDocument(url, joinPageData, callback);
				}

				function joinPageData(pageDocument, callback) {
					data = getDataFromPage(pageDocument, data);
					gotcount++;

					// log
					const level = gotcount % NUMBER_LOGSUCCESS_AFTER ? LogLevel.Info : LogLevel.Success;
					DoLog(level, 'got ' + String(gotcount) + ' pages.');
					if (gotcount === pageCount) {
						DoLog(LogLevel.Success, 'All pages xhr and parsing completed.');
						DoLog(LogLevel.Success, data, true);
					}

					// callback
					if (callback) {callback(data, gotcount, gotcount === pageCount);};
				}
			}

			// Function output
			function joinTXT(data, noSpliter=true) {
				const floors = data.floors; const users = data.users;

				// HEAD META DATA
				const saveTime = getTime();
				const head = TEXT_OUTPUT_REVIEW_HEAD
				.replaceAll('{RWID}', data.id).replaceAll('{RWTT}', data.title).replaceAll('{RWLK}', data.link)
				.replaceAll('{SVTM}', saveTime).replaceAll('{SCNM}', GM_info.script.name)
				.replaceAll('{VRSN}', GM_info.script.version).replaceAll('{ATNM}', GM_info.script.author);

				// join userinfos
				let userText = '';
				for (const [pname, user] of Object.entries(users)) {
					if (!isNumeric(pname)) {continue;};
					userText += TEXT_OUTPUT_REVIEW_USER
						.replaceAll('{LNSPLT}', noSpliter ? '' : TEXT_SPLIT_LINE).replaceAll('{USERNM}', user.name)
						.replaceAll('{USERID}', user.id).replaceAll('{USERJT}', user.jointime)
						.replaceAll('{USERLK}', user.link).replaceAll('{USERFL}', user.floors[0].reply.number);
					userText += '\n'.repeat(2);
				}

				// join floors
				let floorText = '';
				for (const [pname, floor] of Object.entries(floors)) {
					if (!isNumeric(pname)) {continue;};
					const avatar = floor.avatar; const elements = floor.elements; const user = floor.user; const reply = floor.reply;
					floorText += TEXT_OUTPUT_REVIEW_FLOOR
						.replaceAll('{LNSPLT}', noSpliter ? '' : TEXT_SPLIT_LINE).replaceAll('{RPNUMB}', String(reply.number))
						.replaceAll('{RPTIME}', reply.time).replaceAll('{USERNM}', user.name)
						.replaceAll('{USERID}', user.id).replaceAll('{RPTEXT}', reply.value);
					floorText += '\n'.repeat(2);
				}

				// End
				const foot = TEXT_OUTPUT_REVIEW_END;

				// return
				const txt = head + '\n'.repeat(2) + userText + '\n'.repeat(2) + floorText + '\n'.repeat(2) + foot;
				return txt;
			}

			// ## Function: Download the whole post ##
			function downloadWholePost() {
				// Continues only if not working
				if (downloadWholePost.working) {return;};
				downloadWholePost.working = true;
				bbcdTxt.classList.add(CLASSNAME_DISABLED);

				// GUI
				saveBtn.innerText = TEXT_GUI_DOWNLOADING_REVIEW
					.replaceAll('C', '0').replaceAll('A', pageCountText);

				// go work!
				getAllPages(function(data, gotCount, finished) {
					// GUI
					saveBtn.innerText = TEXT_GUI_DOWNLOADING_REVIEW
						.replaceAll('C', String(gotCount)).replaceAll('A', pageCountText);

					// Stop here if not completed
					if (!finished) {return;};

					// Join text
					const TXT = joinTXT(data);

					// Download
					const blob = new Blob([TXT],{type:"text/plain;charset=utf-8"});
					const url = URL.createObjectURL(blob);
					const name = '文库贴 - ' + data.title + ' - ' + data.id.toString() + '.txt';

					const a = $CrE('a');
					a.href = url;
					a.download = name;
					a.click();

					// GUI
					saveBtn.innerText = TEXT_GUI_DOWNLOADFINISH_REVIEW;
					alertify.success(TEXT_ALT_DOWNLOADFINISH_REVIEW.replaceAll('{T}', data.title).replaceAll('{I}', data.id).replaceAll('{N}', name));

					// Work finish
					downloadWholePost.working = false;
					bbcdTxt.classList.remove(CLASSNAME_DISABLED);
				})
			}
		}

		// Get all floor object
		/* Contains:
		**     floor.table
		**     floor.tbody
		**     floor.tr
		**     floor.lefttd
		**     floor.righttd
		**     floor.leftdiv
		**     floor.titlediv
		**     floor.titlestrong
		**     floor.metadiv
		**     floor.replydiv
		*/
		function getAllFloors(parent=main) {
			const avatars = $All(parent, 'table div img.avatar');
			const floors = [];
			for (const avt of avatars) {
				const floor = {};
				floor.leftdiv = avt.parentElement;
				floor.lefttd  = floor.leftdiv.parentElement;
				floor.tr      = floor.lefttd.parentElement
				floor.righttd = floor.tr.children[1];
				floor.titlediv    = floor.righttd.children[0];
				floor.titlestrong = floor.titlediv.children[0];
				floor.metadiv     = floor.righttd.children[1];
				floor.replydiv    = floor.righttd.children[3];
				floor.hrefa    = $(floor.metadiv, 'a[name]');
				floor.tbody    = floor.tr.parentElement;
				floor.table    = floor.tbody.parentElement;
				floor.rid      = Number(getUrlArgv({url: parent.url || location.href, name: 'rid'}));
				floor.aid      = Number($(parent, 'td[width]>a').href.match(/(\d+)\.html?$/)[1]);
				floor.page     = Number($(avt.ownerDocument, '#pagelink strong').innerText);
				floor.pagehref = URL_REVIEWSHOW.replace('{R}', floor.rid.toString()).replace('{A}', floor.aid.toString()).replace('{P}', floor.page.toString());
				floor.href     = URL_REVIEWSHOW_5.replace('{R}', floor.rid.toString()).replace('{A}', floor.aid.toString()).replace('{P}', floor.page.toString()).replace('{Y}', floor.hrefa.name);
				floors.push(floor);
			}
			return floors;
		}

		// Validate a <table> element whether is a floor
		function isFloorTable(tbl) {
			return $(tbl, 'a[href*="#yid"][name^="yid"]') ? true : false;
		}

		// Get floor title element (<strong>)
		// Argv: <table> element of the floor
		function getEleFloorTitle(tblfloor) {
			return $(tblfloor, 'td.even>div:first-child>strong'); // or :nth-child(1)
		}

		// Get floor content element (<div>)
		// Argv: <table> element of the floor
		function getEleFloorContent(tblfloor) {
			return $(tblfloor, 'td.even>hr+div');
		}

		// Get the floor number
		// Argv: <table> element of the floor
		function getFloorNumber(tblfloor) {
			const eleNumber = $(tblfloor, 'a[name^="yid"]');
			return eleNumber ? Number(eleNumber.innerText.match(/\d+/)[0]) : false;
		}

		// Get floor content by BBCode format (content only, no title)
		// Argv: <div> content Element
		function getFloorContent(contentEle, original=false) {
					const subNodes = contentEle.childNodes;
					let content = '';

					for (const node of subNodes) {
						const type = node.nodeName;
						switch (type) {
							case '#text':
								// Prevent 'Quote:' repeat
								content += node.data.replace(/^\s*Quote:\s*$/, ' ');
								break;
							case 'IMG':
								// wenku8 has forbidden [img] tag for secure reason (preventing CSRF)
								//content += '[img]S[/img]'.replace('S', node.src);
								content += original ? '[img]S[/img]'.replace('S', node.src) : ' S '.replace('S', node.src);
								break;
							case 'A':
								content += '[url=U]T[/url]'.replace('U', node.getAttribute('href')).replace('T', getFloorContent(node));
								break;
							case 'BR':
								// no need to add \n, because \n will be preserved in #text nodes
								//content += '\n';
								break;
							case 'DIV':
								if (node.classList.contains('jieqiQuote')) {
									content += getTagedSubcontent('quote', node);
								} else if (node.classList.contains('jieqiCode')) {
									content += getTagedSubcontent('code', node);
								} else if (node.classList.contains('divimage')) {
									content += getFloorContent(node, original);
								} else {
									content += getFloorContent(node, original);
								}
								break;
							case 'CODE': content += getFloorContent(node, original); break; // Just ignore
							case 'PRE':  content += getFloorContent(node, original); break; // Just ignore
							case 'SPAN': content += getFontedSubcontent(node); break; // Size and color
							case 'P':    content += getFontedSubcontent(node); break; // Text Align
							case 'B':    content += getTagedSubcontent('b', node); break;
							case 'I':    content += getTagedSubcontent('i', node); break;
							case 'U':    content += getTagedSubcontent('u', node); break;
							case 'DEL':  content += getTagedSubcontent('d', node); break;
							default:     content += getFloorContent(node, original); break;
							/*
							case 'SPAN':
								subContent = getFloorContent(node);
								size = node.style.fontSize.match(/\d+/) ? node.style.fontSize.match(/\d+/)[0] : '';
								color = node.style.color.match(/rgb\((\d+), ?(\d+), ?(\d+)\)/);
								break;
							*/
						}
					}
					return content;

					function getTagedSubcontent(tag, node) {
						const subContent = getFloorContent(node, original);
						return '[{T}]{S}[/{T}]'.replaceAll('{T}', tag).replaceAll('{S}', subContent);
					}

					function getFontedSubcontent(node) {
						let tag, value;

						let strSize = node.style.fontSize.match(/\d+/);
						let strColor = node.style.color;
						let strAlign = node.align;
						strSize = strSize ? strSize[0] : null;
						strColor = strColor ? rgbToHex.apply(null, strColor.match(/\d+/g)) : null;

						tag = tag || (strSize  ? 'size'  : null);
						tag = tag || (strColor ? 'color' : null);
						tag = tag || (strAlign ? 'align' : null);
						value = value || strSize || null;
						value = value || strColor || null;
						value = value || strAlign || null;

						const subContent = getFloorContent(node, original);
						if (tag && value) {
							return '[{T}={V}]{S}[/{T}]'.replaceAll('{T}', tag).replaceAll('{V}', value).replaceAll('{S}', subContent);
						} else {
							return subContent;
						}
					}
				}

		// Append floor to #content
		function appendfloor(floor) {
			// Append
			const table = floor.table;
			const elmafter = $(main, 'table.grid+table[border]');
			main.insertBefore(table, elmafter);

			// Enhances
			correctFloorLink(floor);
			alinkEdit(floor);
			addQuoteBtn(floor);
			addQueryBtn(floor);
			addRemark(floor);
			alinktofloor(floor.table);
		}
    }

	// Bookcase page add-on
	function pageBookcase() {
		// Get auto-recommend config
		let arConfig = CONFIG.AutoRecommend.getConfig();
		// Get bookcase lists
		const bookCaseURL = `https://${location.host}/modules/article/bookcase.php?classid={CID}`;
		const content = $('#content');
		const selector = $('[name="classlist"]');
		const options = selector.children;
		// Current bookcase
		const curForm = $(content, '#checkform');
		const curClassid = Number($('[name="clsssid"]').value);
		// Init bookcase config if need
		initPreferences();
		const bookcases = CONFIG.bookcasePrefs.getConfig().bookcases;
		addTopTitle();
		decorateForm(curForm, bookcases[curClassid]);

		// gowork
		laterReads();
		showBookcases();
		recommendAllGUI();

		function recommendAllGUI() {
			const block = createWenkuBlock({
				type: 'mypage',
				parent: '#left',
				title: TEXT_GUI_BOOKCASE_ATRCMMD,
				items: [
					{innerHTML: arConfig.allCount === 0 ? TEXT_GUI_BOOKCASE_RCMMDNW_NOTASK : (TASK.AutoRecommend.checkRcmmd() ? TEXT_GUI_BOOKCASE_RCMMDNW_DONE : TEXT_GUI_BOOKCASE_RCMMDNW_NOTYET), id: 'arstatus'},
					{innerHTML: TEXT_GUI_BOOKCASE_RCMMDAT, id: 'autorcmmd'},
					{innerHTML: TEXT_GUI_BOOKCASE_RCMMDNW, id: 'rcmmdnow'}
				]
			});

			// Configure buttons
			const ulitm = $(block, '.ulitem');
			const txtst = $(block, '#arstatus');
			const btnAR = $(block, '#autorcmmd');
			const btnRN = $(block, '#rcmmdnow');
			const txtAR = $(block, 'span');
			const checkbox = $CrE('input');
			txtst.classList.add(CLASSNAME_TEXT);
			btnAR.classList.add(CLASSNAME_BUTTON);
			btnRN.classList.add(CLASSNAME_BUTTON);
			checkbox.type = 'checkbox';
			checkbox.checked = arConfig.auto;
			checkbox.addEventListener('click', onclick);
			btnAR.addEventListener('click', onclick);
			btnAR.appendChild(checkbox);
			btnRN.addEventListener('click', rcmmdnow);

			function onclick(e) {
				destroyEvent(e);
				arConfig.auto = !arConfig.auto;
				setTimeout(function() {checkbox.checked = arConfig.auto;}, 0);
				CONFIG.AutoRecommend.saveConfig(arConfig);
				alertify.notify(arConfig.auto ? TEXT_ALT_ATRCMMDS_AUTO : TEXT_ALT_ATRCMMDS_NOAUTO);
			}

			function rcmmdnow() {
				if (TASK.AutoRecommend.checkRcmmd() && !confirm(TEXT_GUI_BOOKCASE_RCMMDNW_CONFIRM)) {return false;}
				if (arConfig.allCount === 0) {alertify.warning(TEXT_ALT_ATRCMMDS_NOTASK); return false;};
				TASK.AutoRecommend.run(true);
			}
		}

		function initPreferences() {
			const config = CONFIG.bookcasePrefs.getConfig();
			if (config.bookcases.length === 0) {
				for (const option of options) {
					config.bookcases.push({
						classid: Number(option.value),
						url: bookCaseURL.replace('{CID}', String(option.value)),
						name: option.innerText
					});
				}
				CONFIG.bookcasePrefs.saveConfig(config);
			}
		}

		function addTopTitle() {
			// Clone title bar
			const checkform = $('#checkform') ? $('#checkform') : $('.'+CLASSNAME_BOOKCASE_FORM);
			const oriTitle = $(checkform, 'div.gridtop');
			const topTitle = oriTitle.cloneNode(true);
			content.insertBefore(topTitle, checkform);

			// Hide bookcase selector
			const bcSelector = $(topTitle, '[name="classlist"]');
			bcSelector.style.display = 'none';

			// Write title text
			const textNode = topTitle.childNodes[0];
			const numMatch = textNode.nodeValue.match(/\d+/g);
			const text = TEXT_GUI_BOOKCASE_TOPTITLE.replace('A', numMatch[0]).replace('B', numMatch[1]);
			textNode.nodeValue = text;
		}

		function showBookcases() {
			// GUI
			const topTitle = $(content, 'script+div.gridtop');
			const textNode = topTitle.childNodes[0];
			const oriTitleText = textNode.nodeValue;
			const allCount = bookcases.length;
			let finished = 1;
			textNode.nodeValue = TEXT_GUI_BOOKCASE_GETTING.replace('C', String(finished)).replace('A', String(allCount));

			// Get all bookcase pages
			for (const bookcase of bookcases) {
				if (bookcase.classid === curClassid) {continue;};
				getDocument(bookcase.url, appendBookcase, [bookcase]);
			}

			function appendBookcase(mDOM, bookcase) {
				const classid = bookcase.classid;

				// Get bookcase form and modify it
				const form = $(mDOM, '#checkform');
				form.parentElement.removeChild(form);

				// Find the right place to insert it in
				const forms = $All(content, '.'+CLASSNAME_BOOKCASE_FORM);
				for (let i = 0; i < forms.length; i++) {
					const thisForm = forms[i];
					const cid = typeof thisForm.classid === 'number' ? thisForm.classid : curClassid;
					if (cid > classid) {
						content.insertBefore(form, thisForm);
						break;
					}
				}
				if(!form.parentElement) {$('#laterbooks').insertAdjacentElement('beforebegin', form);};

				// Decorate
				decorateForm(form, bookcase);

				// finished increase
				finished++;
				textNode.nodeValue = finished < allCount ?
					TEXT_GUI_BOOKCASE_GETTING.replace('C', String(finished)).replace('A', String(allCount)) :
					oriTitleText;
			}
		}

		function decorateForm(form, bookcase) {
			const classid = bookcase.classid;
			let name = bookcase.name;

			// Provide auto-recommand button
			arBtn();

			// Modify properties
			form.classList.add(CLASSNAME_BOOKCASE_FORM);
			form.id += String(classid);
			form.classid = classid;
			form.onsubmit = my_check_confirm;

			// Hide bookcase selector
			const bcSelector = $(form, '[name="classlist"]');
			bcSelector.style.display = 'none';

			// Dblclick Change title
			const titleBar = bcSelector.parentElement;
			titleBar.childNodes[0].nodeValue = name;
			titleBar.addEventListener('dblclick', editName);
			// Longpress Change title for mobile
			let touchTimer;
			titleBar.addEventListener('touchstart', () => {touchTimer = setTimeout(editName, 500);});
			titleBar.addEventListener('touchmove', () => {clearTimeout(touchTimer);});
			titleBar.addEventListener('touchend', () => {clearTimeout(touchTimer);});
			titleBar.addEventListener('mousedown', () => {touchTimer = setTimeout(editName, 500);});
			titleBar.addEventListener('mouseup', () => {clearTimeout(touchTimer);});

			// Show tips
			let tip = TEXT_GUI_BOOKCASE_DBLCLICK;
			if (tipready) {
                // tipshow and tiphide is coded inside wenku8 itself, its function is to show a text tip besides the mouse
                titleBar.addEventListener('mouseover', function() {tipshow(tip);});
                titleBar.addEventListener('mouseout' , tiphide);
            } else {
                titleBar.title = tip;
            }

			// Change selector names
			renameSelectors(false);

			// Replaces the original check_confirm() function
			function my_check_confirm() {
				const checkform = this;
				let checknum = 0;
				for (let i = 0; i < checkform.elements.length; i++){
					if (checkform.elements[i].name == 'checkid[]' && checkform.elements[i].checked == true) checknum++;
				}
				if (checknum === 0){
					alert('请先选择要操作的书目！');
					return false;
				}
				const newclassid = $(checkform, '#newclassid');
				if(newclassid.value == -1){
					if (confirm('确实要将选中书目移出书架么？')) {return true;} else {return false;};
				} else {
					return true;
				}
			}

			// Selector name refresh
			function renameSelectors(renameAll) {
				if (renameAll) {
					const forms = $All(content, '.'+CLASSNAME_BOOKCASE_FORM);
					for (const form of forms) {
						renameFormSlctr(form);
					}
				} else {
					renameFormSlctr(form);
				}

				function renameFormSlctr(form) {
					const newclassid = $(form, '#newclassid');
					const options = newclassid.children;
					for (let i = 0; i < options.length; i++) {
						const option = options[i];
						const value = Number(option.value);
						const bc = bookcases[value];
						bc ? option.innerText = TEXT_GUI_BOOKCASE_MOVEBOOK.replace('N', bc.name) : function(){};
					}
				}
			}

			// Provide <input> GUI to edit bookcase name
			function editName() {
				const nameInput = $CrE('input');
				const form = this;
				tip = TEXT_GUI_BOOKCASE_WHATNAME;
				tipready ? tipshow(tip) : function(){};

				titleBar.childNodes[0].nodeValue = '';
				titleBar.appendChild(nameInput);
				nameInput.value = name;
				nameInput.addEventListener('blur', onblur);
				nameInput.addEventListener('keydown', onkeydown)
				nameInput.focus();
				nameInput.setSelectionRange(0, name.length);

				function onblur() {
					tip = TEXT_GUI_BOOKCASE_DBLCLICK;
					tipready ? tipobj.innerHTML = tip : function(){};
					const value = nameInput.value.trim();
					if (value) {
						name = value;
						bookcase.name = name;
						CONFIG.bookcasePrefs.saveConfig(bookcases);
					}
					titleBar.childNodes[0].nodeValue = name;
					try {titleBar.removeChild(nameInput)} catch (DOMException) {};
					renameSelectors(true);
				}

				function onkeydown(e) {
					if (e.keyCode === 13) {
						e.preventDefault();
						onblur();
					}
				}
			}

			// Provide auto-recommend option
			function arBtn() {
				const table = $(form, 'table');
				for (const tr of $All(table, 'tr')) {
					$(tr, '.odd') ? decorateRow(tr) : function() {};
					$(tr, 'th') ? decorateHeader(tr) : function() {};
					$(tr, 'td.foot') ? decorateFooter(tr) : function() {};
				}

				// Insert auto-recommend option for given row
				function decorateRow(tr) {
					const eleBookLink = $(tr, 'td:nth-child(2)>a');
					const strBookID = eleBookLink.href.match(/aid=(\d+)/)[1];
					const strBookName = eleBookLink.innerText;
					const newTd = $CrE('td');
					const input = $CrE('input');
					newTd.classList.add('odd');
					input.type = 'number';
					input.inputmode = 'numeric';
					input.style.width = '85%';
					input.value = arConfig.books[strBookID] ? String(arConfig.books[strBookID].number) : '0';
					input.addEventListener('change', onvaluechange);
					input.strBookID = strBookID; input.strBookName = strBookName;
					newTd.appendChild(input); tr.appendChild(newTd);
				}

				// Insert a new row for auto-recommend options
				function decorateHeader(tr) {
					const allTh = $All(tr, 'th');
					const width = ARR_GUI_BOOKCASE_WIDTH;
					const newTh = $CrE('th');
					newTh.innerText = TEXT_GUI_BOOKCASE_ATRCMMD;
					newTh.classList.add(CLASSNAME_TEXT);
					tr.appendChild(newTh);
					for (let i = 0; i < allTh.length; i++) {
						const th = allTh[i];
						th.style.width = width[i];
					}
				}

				// Fit the width
				function decorateFooter(tr) {
					const td = $(tr, 'td.foot');
					td.colSpan = ARR_GUI_BOOKCASE_WIDTH.length;
				}

				// auto-recommend onvaluechange
				function onvaluechange(e) {
					arConfig = CONFIG.AutoRecommend.getConfig();
					const input = e.target;
					const value = input.value;
					const strBookID = input.strBookID;
					const strBookName = input.strBookName;
					const bookID = Number(strBookID);
					const userDetail = getMyUserDetail() ? getMyUserDetail().userDetail : refreshMyUserDetail();
					if (isNumeric(value, true) && Number(value) >= 0) {
						// allCount increase
						const oriNum = arConfig.books[strBookID] ? arConfig.books[strBookID].number : 0;
						const number = Number(value);
						arConfig.allCount += number - oriNum;

						// save to config
						number > 0 ? arConfig.books[strBookID] = {number: number, name: strBookName, id: bookID} : delete arConfig.books[strBookID];
						CONFIG.AutoRecommend.saveConfig(arConfig);

						// alert
						alertify.notify(
							TEXT_ALT_ATRCMMDS_SAVED
							.replaceAll('{B}', strBookName)
							.replaceAll('{N}', value)
							.replaceAll('{R}', userDetail.vote-arConfig.allCount)
						);
						if (userDetail && arConfig.allCount > userDetail.vote) {
							const alertBox = alertify.warning(
								TEXT_ALT_ATRCMMDS_OVERFLOW
								.replace('{V}', String(userDetail.vote))
								.replace('{C}', String(arConfig.allCount))
							);
							alertBox.callback = function(isClicked) {
								isClicked && refreshMyUserDetail();
							}
						};
					} else {
						// invalid input value, alert
						alertify.error(TEXT_ALT_ATRCMMDS_INVALID.replaceAll('{N}', value));
					}
				}
			}
		}

		function laterReads() {
			// Container
			const container = $CrE('div');
			container.id = 'laterbooks';
			content.appendChild(container);

			// Title div
			const titlebar = $CrE('div');
			titlebar.classList.add('gridtop');
			titlebar.style.display = 'grid';
			titlebar.style['grid-template-columns'] = '1fr 1fr 1fr';
			container.appendChild(titlebar);

			const title = $CrE('span');
			title.innerHTML = '稍后再读';
			title.style['grid-column'] = '2/3';
			titlebar.appendChild(title);

			// Sorter select container
			const sortContainer = $CrE('span');
			sortContainer.style['grid-column'] = '3/4';
			sortContainer.style.textAlign = 'right';
			titlebar.appendChild(sortContainer);

			// Sorter select
			const sltsort = $CrE('select');
			sltsort.style.width = 'max-content';
			sltsort.addEventListener('change', function() {
				const config = CONFIG.bookcasePrefs.getConfig();
				config.laterbooks.sortby = sltsort.value;
				CONFIG.bookcasePrefs.saveConfig(config);
				showBooks();
			});
			sortContainer.appendChild(sltsort);

			// Sorter select options
			const sorttypes = Object.keys(FUNC_LATERBOOK_SORTERS);
			for (const type of sorttypes) {
				const sort = FUNC_LATERBOOK_SORTERS[type];
				const option = $CrE('option');
				option.innerHTML = sort.name;
				option.value = type;
				sltsort.appendChild(option);
			}
			sltsort.selectedIndex = sorttypes.indexOf(CONFIG.bookcasePrefs.getConfig().laterbooks.sortby);

			// Body table
			const body = $CrE('table');
			setAttributes(body, {
				'class': 'grid',
				'width': '100%',
				'align': 'center'
			});
			const tbody = $CrE('tbody');
			body.appendChild(tbody);
			container.appendChild(body);

			// Header & Rows
			showBooks();

			function showBooks() {
				const config = CONFIG.bookcasePrefs.getConfig().laterbooks;
				clearChildnodes(body);

				// headers
				const headtr = $CrE('tr');
				headtr.setAttribute('align', 'center');
				const headers = [{
					name: '名称',
					width: '22%'
				},{
					name: '简介',
					width: '60%'
				},{
					name: '操作',
					width: '18%'
				}];
				for (const head of headers) {
					const th = $CrE('th');
					th.innerHTML = head.name;
					th.style.width = head.width;
					headtr.appendChild(th);
				}
				body.appendChild(headtr);

				// Book rows
				const books = sortLaterReads(config.books, config.sortby);

				for (const book of books) {
					makeRow(book);
				}

				function makeRow(book) {
					const config = CONFIG.bookcasePrefs.getConfig().laterbooks;

					// row
					const row = $CrE('tr');

					// cover & name
					const tdName = $CrE('td');
					tdName.classList.add('odd');
					tdName.style.textAlign = 'center';
					const clink = $CrE('a');
					clink.href = URL_NOVELINDEX.replace('{I}', book.aid);
					clink.target = '_blank';
					tdName.appendChild(clink);
					const cover = $CrE('img');
					cover.src = book.cover;
					cover.style.width = '100px';
					clink.appendChild(cover);
					clink.insertAdjacentHTML('beforeend', '</br>');
					clink.insertAdjacentText('beforeend', book.name);
					row.appendChild(tdName);

					// info
					const tdInfo = $CrE('td');
					tdInfo.classList.add('even');
					tdInfo.insertAdjacentHTML('afterbegin', '<span class="hottext">作品Tags：</span></br>');
					for (const tag of book.tags) {
						const a = $CrE('a');
						a.target = '_blank';
						a.href = URL_TAGSEARCH.replace('{TU}', $URL.encode(tag));
						a.classList.add(CLASSNAME_BUTTON);
						a.innerText = tag + ' ';
						tdInfo.appendChild(a);
					}
					tdInfo.insertAdjacentHTML('beforeend', '</br></br><span class="hottext">内容简介：</span></br>');
					tdInfo.insertAdjacentText('beforeend', book.introduce);
					row.appendChild(tdInfo);

					// operator
					const tdOprt = $CrE('td');
					tdOprt.classList.add('odd');
					tdOprt.style.textAlign = 'center';
					const btnDel = makeBtn();
					btnDel.innerHTML = '删除';
					btnDel.addEventListener('click', del);
					tdOprt.appendChild(btnDel);
					const btnAbc = makeBtn('a'); // Abc ==> AddBookCase
					btnAbc.innerHTML = '加入书架';
					btnAbc.href = URL_ADDBOOKCASE.replace('{A}', book.aid);
					btnAbc.target = '_blank';
					tdOprt.appendChild(btnAbc);
					if (config.sortby === 'sort') {
						tdOprt.appendChild($CrE('br'));
						const btnUp = makeBtn();
						btnUp.innerHTML = '上移';
						btnUp.addEventListener('click', function () {
							const config = CONFIG.bookcasePrefs.getConfig();
							const books = Object.values(config.laterbooks.books);
							const cur = books.filter((b) => (b.sort === book.sort));
							const previous = books.filter((b) => (b.sort === book.sort-1));

							if (cur) {
								if (previous.length > 0) {
									previous[0].sort++;
									cur[0].sort--;
									CONFIG.bookcasePrefs.saveConfig(config);
									showBooks();
								}
							} else {
								alertify.warning(TEXT_ALT_BOOKCASE_AFTERBOOKS_MISSING);
							}
						});
						tdOprt.appendChild(btnUp);
						const btnDown = makeBtn();
						btnDown.innerHTML = '下移';
						btnDown.addEventListener('click', function () {
							const config = CONFIG.bookcasePrefs.getConfig();
							const books = Object.values(config.laterbooks.books);
							const cur = books.filter((b) => (b.sort === book.sort));
							const after = books.filter((b) => (b.sort === book.sort+1));

							if (cur) {
								if (after.length > 0) {
									after[0].sort--;
									cur[0].sort++;
									CONFIG.bookcasePrefs.saveConfig(config);
									showBooks();
								}
							} else {
								alertify.warning(TEXT_ALT_BOOKCASE_AFTERBOOKS_MISSING);
							}
						});
						tdOprt.appendChild(btnDown);
					}
					row.appendChild(tdOprt);

					body.appendChild(row);

					function del() {
						const config = CONFIG.bookcasePrefs.getConfig();
						const books = config.laterbooks.books;
						const bk = books[book.aid];
						if (!bk) {
							body.removeChild(row);
							return false;
						}
						delete config.laterbooks.books[book.aid];
						Array.prototype.forEach.call(Object.values(books), (b) => (b.sort > bk.sort && b.sort--));
						CONFIG.bookcasePrefs.saveConfig(config);
						body.removeChild(row);
					}

					function makeBtn(tagName='span') {
						const btn = $CrE(tagName);
						btn.classList.add(CLASSNAME_BUTTON);
						btn.style.margin = '0 1em';
						return btn;
					}
				}
			}
		}

		// Set attributes to an element
		function setAttributes(elm, attributes) {
			for (const [name, attr] of Object.entries(attributes)) {
				elm.setAttribute(name, attr);
			}
		}
	}

	// Novel ads remover
	function removeTopAds() {
		const ads = []; $All('div>script+script+a').forEach(function(a) {ads.push(a.parentElement);});
		for (const ad of ads) {
			ad.parentElement.removeChild(ad);
		}
	}

	// Novel index page add-on
	function pageNovelIndex() {
		removeTopAds();
		//downloader();

		function downloader() {
			AndAPI.getNovelIndex({
				aid: unsafeWindow.article_id,
				lang: 0,
				callback: indexGot
			});

			function indexGot(xml) {
				const volumes = $All(xml, 'volume');
				const vtitles = $All('.vcss');
				if (volumes.length !== vtitles.length) {return false;}

				for (let i = 0; i < volumes.length; i++) {
					const volume = volumes[i];
					const vtitle = vtitles[i];
					const vname = volume.childNodes[0].nodeValue;

					// Title element
					const elmTitle = $CrE('span');
					elmTitle.innerText = vname;

					// Spliter element
					const elmSpliter = $CrE('span');
					elmSpliter.style.margin = '0 0.5em';

					// Download button
					const elmDlBtn = $CrE('span');
					elmDlBtn.classList.add(CLASSNAME_BUTTON);
					elmDlBtn.innerHTML = TEXT_GUI_DOWNLOAD_THISVOLUME;
					elmDlBtn.addEventListener('click', function() {
						// getAttribute returns string rather than number,
						// but downloadVolume accepts both string and number as vid
						downloadVolume(volume.getAttribute('vid'), vname, ['utf-8', 'big5'][getLang()]);
					});

					clearChildnodes(vtitle);
					vtitle.appendChild(elmTitle);
					vtitle.appendChild(elmSpliter);
					vtitle.appendChild(elmDlBtn);
				}
			}

			function downloadVolume(vid, vname, charset='utf-8') {
				const url = URL_DOWNLOAD1.replace('{A}', unsafeWindow.article_id).replace('{V}', vid).replace('{C}', charset);
				downloadFile({
					url: url,
					name: TEXT_GUI_SDOWNLOAD_FILENAME
						.replace('{NovelName}', $('#title').innerText)
						.replace('{VolumeName}', vname)
						.replace('{Extension}', 'txt')
				});
			}
		}
	}

    // Novel page add-on
    function pageNovel() {
		const CSM = new ConfigSetManager();
		CSM.install();
		const pageResource = {elements: {}, infos: {}, download: {}};
		collectPageResources();

		// Remove ads
		removeTopAds();

		// Side-Panel buttons
		sideButtons();

		// Provide download GUI
		downloadGUI();

        // Prevent URL.revokeObjectURL in script 轻小说文库下载
        revokeObjectURLHOOK();

		// Font changer
		fontChanger();

		// More font-sizes
		moreFontSizes();

		// Fill content if need
		fillContent();

		// Beautifier page
		beautifier();

		function collectPageResources() {
			collectElements();
			collectInfos();
			initDownload();

			function collectElements() {
				const elements = pageResource.elements;
				elements.title          = $('#title');
				elements.images         = $All('.imagecontent');
				elements.rightButtonDiv = $('#linkright');
				elements.rightNodes     = elements.rightButtonDiv.childNodes;
				elements.rightBlank     = elements.rightNodes[elements.rightNodes.length-1];
				elements.content        = $('#content');
				elements.contentmain    = $('#contentmain');
				elements.spliterDemo    = document.createTextNode(' | ');
			}
			function collectInfos() {
				const elements = pageResource.elements;
				const infos    = pageResource.infos;
				infos.title       = elements.title.innerText;
				infos.isImagePage = elements.images.length > 0;
				infos.content     = infos.isImagePage ? null : elements.content.innerText;
			}
			function initDownload() {
				const elements = pageResource.elements;
				const download = pageResource.download;
				download.running  = false;
				download.finished = 0;
				download.all      = elements.images.length;
				download.error    = 0;
			}
		}

		// Prevent URL.revokeObjectURL in script 轻小说文库下载
		function revokeObjectURLHOOK() {
			const Ori_revokeObjectURL = URL.revokeObjectURL;
			URL.revokeObjectURL = function(arg) {
				if (typeof(arg) === 'string' && arg.substr(0, 5) === 'blob:') {return false;};
				return Ori_revokeObjectURL(arg);
			}
		}

		// Side-Panel buttons
		function sideButtons() {
			// Download
			SPanel.add({
				faicon: 'fa-solid fa-download',
				tip: TEXT_GUI_DOWNLOAD_THISCHAPTER,
				onclick: dlNovel
			});

			// Next page
			SPanel.add({
				faicon: 'fa-solid fa-angle-right',
				tip: '下一页',
				onclick: (e) => {$('#foottext>a:nth-child(4)').click();}
			});

			// Previous page
			SPanel.add({
				faicon: 'fa-solid fa-angle-left',
				tip: '上一页',
				onclick: (e) => {$('#foottext>a:nth-child(3)').click();}
			});
		}

		// Provide download GUI
		function downloadGUI() {
			const elements = pageResource.elements;
			const infos    = pageResource.infos;

			// Create donwload button
			const dlBtn = elements.downloadBtn = $CrE('span');
			dlBtn.classList.add(CLASSNAME_BUTTON);
			dlBtn.addEventListener('click', dlNovel);
			dlBtn.innerText = TEXT_GUI_DOWNLOAD_THISCHAPTER;

			// Create spliter
			const spliter = elements.spliterDemo.cloneNode();

			// Append to rightButtonDiv
			elements.rightButtonDiv.style.width = '550px';
			elements.rightButtonDiv.insertBefore(spliter, elements.rightBlank);
			elements.rightButtonDiv.insertBefore(dlBtn,   elements.rightBlank);
		}

		// Page beautifier
		function beautifier() {
			CONFIG.BeautifierCfg.getConfig().novel.beautiful && beautiful();

			function beautiful() {
				const config = CONFIG.BeautifierCfg.getConfig();
				const usedHeight = getRestHeight();

				addStyle(CSS_NOVEL
						 .replaceAll('{BGI}', config.backgroundImage)
						 .replaceAll('{S}', config.textScale)
						 .replaceAll('{H}', usedHeight), 'beautifier'
				);

				unsafeWindow.stopScroll = beautiful_stopScroll;
				document.onmousedown = beautiful_stopScroll;
				unsafeWindow.scrolling = beautiful_scrolling;

				// Get rest height without #contentmain
				function getRestHeight() {
					let usedHeight = 0;
					['adv1', 'adtop', 'headlink', 'footlink', 'adbottom'].forEach((id) => {
						const node = $('#'+id);
						if (node instanceof Element && node.id !== 'contentmain') {
							const cs = getComputedStyle(node);
							['height', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'borderTop', 'borderBottom'].forEach((style) => {
								const reg = cs[style].match(/([\.\d]+)px/);
								reg && (usedHeight += Number(reg[1]));
							});
						};
					});
					usedHeight = usedHeight.toString() + 'px';
					return usedHeight;
				}

				// Mouse dblclick scroll with beautifier applied
				function beautiful_scrolling() {
					let contentmain = pageResource.elements.contentmain;
					let currentpos = contentmain.scrollTop || 0;
					contentmain.scrollTo(0, ++currentpos);
					let nowpos = contentmain.scrollTop || 0;
					pageResource.elements.content.style.userSelect = 'none';
					currentpos != nowpos && beautiful_stopScroll();
				}

				function beautiful_stopScroll() {
					pageResource.elements.content.style.userSelect = '';
					unsafeWindow.clearInterval(timer);
				}
			}
		}

		// Provide font changer
		function fontChanger() {
			// Button
			const bcolor = $('#bcolor');
			const txtfont = $CrE('select');
			txtfont.id = 'txtfont';
			txtfont.addEventListener('change', applyFont);
			bcolor.insertAdjacentElement('afterend', txtfont);
			bcolor.insertAdjacentText('afterend', '\t\t\t  字体选择');

			// Provided fonts
			const FONTS = [{"name":"默认","value":"unset"}, {"name":"微软雅黑","value":"Microsoft YaHei"},{"name":"黑体","value":"SimHei"},{"name":"微软正黑体","value":"Microsoft JhengHei"},{"name":"宋体","value":"SimSun"},{"name":"仿宋","value":"FangSong"},{"name":"新宋体","value":"NSimSun"},{"name":"细明体","value":"MingLiU"},{"name":"新细明体","value":"PMingLiU"},{"name":"楷体","value":"KaiTi"},{"name":"标楷体","value":"DFKai-SB"}]
			for (const font of FONTS) {
				const option = $CrE('option');
				option.innerText = font.name;
				option.value = font.value;
				txtfont.appendChild(option);
			}

			// Function
			CSM.ConfigSets.txtfont = {
				save: () => (setCookies('txtfont', txtfont[txtfont.selectedIndex].value)),
				load: () => {
					const tmpstr = ReadCookies("txtfont");
					if (tmpstr != "") {
						for (let i = 0; i < txtfont.length; i++) {
							if (txtfont.options[i].value == tmpstr) {
								txtfont.selectedIndex = i;
								break;
							}
						}
					}
					applyFont();
				}
			};

			// Load saved font
			CSM.ConfigSets.txtfont.load();

			function applyFont() {
				$('#content').style['font-family'] = txtfont[txtfont.selectedIndex].value;
			}
		}

		// Provide more font-sizes
		function moreFontSizes() {
			const select = $('#fonttype');
			const savebtn = $('#saveset');
			const sizes = [
				{
					name: '更小',
					size: '10px'
				},
				{
					name: '更大',
					size: '28px'
				},
				{
					name: '很大',
					size: '32px'
				},
				{
					name: '超大',
					size: '36px'
				},
				{
					name: '极大',
					size: '40px'
				},
				{
					name: '过大',
					size: '44px'
				},
			];

			for (const size of sizes) {
				const option = $CrE('option');
				option.innerHTML = size.name;
				option.value = size.size;

				// Insert with sorting
				for (const opt of select.children) {
					const sizeNum1 = getSizeNum(opt.value);
					const sizeNum2 = getSizeNum(option.value);
					if (isNaN(sizeNum1) || isNaN(sizeNum2)) {continue;} // Code shouldn't be here in normal cases
					if (sizeNum1 > sizeNum2) {
						select.insertBefore(option, opt);
						break;
					}
				}
				option.parentElement !== select && select.appendChild(option);
			}

			// Load saved fonttype
			CSM.ConfigSets.fonttype.load();

			function getSizeNum(size) {
				return Number(size.match(/(\d+)px/)[1]);
			}
		}

		// Provide content using AndroidAPI
		function fillContent() {
			// Check whether needs filling
			if ($('#contentmain>span')) {
				if ($('#contentmain>span').innerText.trim() !== 'null') {
					return false;
				}
			} else {return false;}

			// prepare
			const content = pageResource.elements.content;
			content.innerHTML = TEXT_GUI_NOVEL_FILLING;
			const charset = (function() {
				const match = document.cookie.match(/(; *)?jieqiUserCharset=(.+?)( *;|$)/);
				return match && match[2] && match[2].toLowerCase() === 'big5' ? 1 : 0;
			}) ();

			// Get content xml
			AndAPI.getNovelContent({
				aid: unsafeWindow.article_id,
				cid: unsafeWindow.chapter_id,
				lang: charset,
				callback: function(text) {
					const imgModel = '<div class="divimage"><a href="{U}" target="_blank"><img src="{U}" border="0" class="imagecontent"></a></div>';

					// Trim whitespaces
					text = text.trim();

					// Get images like <!--image-->http://pic.wenku8.com/pictures/0/716/24406/11588.jpg<!--image-->
					const imgUrls = text.match(/<!--image-->[^<>]+?<!--image-->/g) || [];

					// Parse <img> for every image url
					let html = '';
					for (const url of imgUrls) {
						const index = text.indexOf(url);
						const src = htmlEncode(url.match(/<!--image-->([^<>]+?)<!--image-->/)[1]);
						html += htmlEncode(text.substring(0, index)).replaceAll('\r\n', '\n').replaceAll('\r', '\n').replaceAll('\n', '</br>');
						html += imgModel.replaceAll('{U}', src);
						text = text.substring(index + url.length);
					}
					html += htmlEncode(text);

					// Set content
					pageResource.elements.content.innerHTML = html;

					// Reset pageResource-image if need
					pageResource.infos.isImagePage = imgUrls.length > 0;
					pageResource.elements.images = $All('.imagecontent');
					pageResource.download.all = pageResource.elements.images.length;
				}
			})

			return true;
		}

		// Download button onclick
		function dlNovel() {
			pageResource.infos.isImagePage ? dlNovelImages() : dlNovelText();
		}

		// Download Images
		function dlNovelImages() {
			const elements = pageResource.elements;
			const infos    = pageResource.infos;
			const download = pageResource.download;

			if (download.running) {return false;};
			download.running = true; download.finished = 0; download.error = 0;
			updateDownloadStatus();

			const lenNumber = String(elements.images.length).length;
			for (let i = 0; i < elements.images.length; i++) {
				const img = elements.images[i];
				const name = infos.title + '_' + fillNumber(i+1, lenNumber) + '.jpg';
				GM_xmlhttpRequest({
					url: img.src,
					responseType: 'blob',
					onloadstart: function() {
						DoLog(LogLevel.Info, '[' + String(i) + ']downloading novel image from ' + img.src);
					},
					onload: function(e) {
						DoLog(LogLevel.Info, '[' + String(i) + ']image got: ' + img.src);

						const image = new Image();
						image.onload = function() {
							const url = toImageFormatURL(image, 1);
							DoLog(LogLevel.Info, '[' + String(i) + ']image transformed: ' + img.src);

							const a = $CrE('a');
							a.href = url;
							a.download = name;
							a.click();

							download.finished++;
							updateDownloadStatus();
							// Code below seems can work, but actually it doesn't work well and somtimes some file cannot be saved
							// The reason is still unknown, but from what I know I can tell that mistakes happend in GM_xmlhttpRequest
							// Error stack: GM_xmlhttpRequest.onload ===> image.onload ===> downloadFile ===> GM_xmlhttpRequest =X=> .onload
							// This Error will also stuck the GMXHRHook.ongoingList
							/*downloadFile({
									url: url,
									name: name,
									onload: function() {
										download.finished++;
										DoLog(LogLevel.Info, '[' + String(i) + ']file saved: ' + name);
										alert('[' + String(i) + ']file saved: ' + name);
										updateDownloadStatus();
									},
									onerror: function() {
										alert('downloadfile error! url = ' + String(url) + ', i = ' + String(i));
									}
								})*/
						}
						image.onerror = function() {
							throw new Error('image load error! image.src = ' + String(image.src) + ', i = ' + String(i));
						}
						image.src = URL.createObjectURL(e.response);
					},
					onerror: function(e) {
						// Error dealing need...
						DoLog(LogLevel.Error, '[' + String(i) + ']image fetch error: ' + img.src);
						download.error++;
					}
				})
			}

			function updateDownloadStatus() {
				elements.downloadBtn.innerText = TEXT_GUI_DOWNLOADING_ALL.replaceAll('C', String(download.finished)).replaceAll('A', String(download.all));
				if (download.finished === download.all) {
					DoLog(LogLevel.Success, 'All images got.');
					elements.downloadBtn.innerText = TEXT_GUI_DOWNLOADED_ALL;
					download.running = false;
				}
			}
		}

		// Download Text
		function dlNovelText() {
			const infos = pageResource.infos;
			const name = infos.title + '.txt';
			const text = infos.content.replaceAll(/[\r\n]+/g, '\r\n');
			downloadText(text, name);
		}

        // Image format changing function
		// image: <img> or Image(); format: 1 for jpeg, 2 for png, 3 for webp
        function toImageFormatURL(image, format) {
            if (typeof(format) === 'number') {format = ['image/jpeg', 'image/png', 'image/webp'][format-1]}
            const cvs = $CrE('canvas');
            cvs.width = image.width;
		    cvs.height = image.height;
            const ctx = cvs.getContext('2d');
            ctx.drawImage(image, 0, 0);
            return cvs.toDataURL(format);
        }

		function ConfigSetManager() {
			const CSM = this;
			/*const setCookies = unsafeWindow.setCookies,
				  ReadCookies = unsafeWindow.ReadCookies,
				  bcolor = unsafeWindow.bcolor,
				  txtcolor = unsafeWindow.txtcolor,
				  fonttype = unsafeWindow.fonttype,
				  scrollspeed = unsafeWindow.scrollspeed,
				  setSpeed = unsafeWindow.setSpeed,
				  contentobj = unsafeWindow.contentobj;*/

			CSM.ConfigSets = {
				'bcolor': {
					save: () => (setCookies("bcolor", bcolor.options[bcolor.selectedIndex].value)),
					load: () => {
						const tmpstr = ReadCookies("bcolor");
						bcolor.selectedIndex = 0;
						if (tmpstr != "") {
							for (let i = 0; i < bcolor.length; i++) {
								if (bcolor.options[i].value == tmpstr) {
									bcolor.selectedIndex = i;
									break;
								}
							}
						}
						document.bgColor = bcolor.options[bcolor.selectedIndex].value;
					}
				},
				'txtcolor': {
					save: () => (setCookies("txtcolor", txtcolor.options[txtcolor.selectedIndex].value)),
					load: () => {
						const tmpstr = ReadCookies("txtcolor");
						txtcolor.selectedIndex = 0;
						if (tmpstr != "") {
							for (let i = 0; i < txtcolor.length; i++) {
								if (txtcolor.options[i].value == tmpstr) {
									txtcolor.selectedIndex = i;
									break;
								}
							}
						}
						$('#content').style.color = txtcolor.options[txtcolor.selectedIndex].value;
					}
				},
				'fonttype': {
					save: () => (setCookies("fonttype", fonttype.options[fonttype.selectedIndex].value)),
					load: () => {
						const tmpstr = ReadCookies("fonttype");
						fonttype.selectedIndex = 2;
						if (tmpstr != "") {
							for (let i = 0; i < fonttype.length; i++) {
								if (fonttype.options[i].value == tmpstr) {
									fonttype.selectedIndex = i;
									break;
								}
							}
						}
						$('#content').style.fontSize = fonttype.options[fonttype.selectedIndex].value;
					}
				},
				'scrollspeed': {
					save: () => (setCookies("scrollspeed", scrollspeed.value)),
					load: () => {
						const tmpstr = ReadCookies("scrollspeed");
						if (tmpstr == '') {tmpstr = 5;}
						scrollspeed.value = tmpstr;
						setSpeed();
					}
				}
			};

			CSM.saveSet = function() {
				for (const [name, set] of Object.entries(CSM.ConfigSets)) {
					set.save();
				}
			};

			CSM.loadSet = function() {
				for (const [name, set] of Object.entries(CSM.ConfigSets)) {
					set.load();
				}
			};

			CSM.install = function() {
				Object.defineProperty(unsafeWindow, 'saveSet', {
					configurable: false,
					enumerable: true,
					value: CSM.saveSet,
					writable: false
				});
				Object.defineProperty(unsafeWindow, 'loadSet', {
					configurable: false,
					enumerable: true,
					value: CSM.loadSet,
					writable: false
				});
			};
		}
    }

	// Search form add-on
	function formSearch() {
		const searchForm = $('form[name="articlesearch"]');
		if (!searchForm) {return false;};
		const typeSelect = $(searchForm, '#searchtype');
		const searchText = $(searchForm, '#searchkey');
		const searchSbmt = $(searchForm, 'input[class="button"][type="submit"]');

		let optionTags;
		provideTagOption();
		onsubmitHOOK();

		function provideTagOption() {
			optionTags = $CrE('option');
			optionTags.value = VALUE_STR_NULL;
			optionTags.innerText = TEXT_GUI_SEARCH_OPTION_TAG;
			typeSelect.appendChild(optionTags);

			if (tipready) {
				// tipshow and tiphide is coded inside wenku8 itself, its function is to show a text tip besides the mouse
				typeSelect.addEventListener('mouseover', show);
				searchSbmt.addEventListener('mouseover', show);
				typeSelect.addEventListener('mouseout' , tiphide);
				searchSbmt.addEventListener('mouseout' , tiphide);
			} else {
				typeSelect.title = TEXT_TIP_SEARCH_OPTION_TAG;
				searchSbmt.title = TEXT_TIP_SEARCH_OPTION_TAG;
			}

			function show() {
				optionTags.selected ? tipshow(TEXT_TIP_SEARCH_OPTION_TAG) : function() {};
			}
		}
		function onsubmitHOOK() {
			const onsbmt = searchForm.onsubmit;
			searchForm.onsubmit = function() {
				if (optionTags.selected) {
					// DON'T USE window.open()!
					// Wenku8 has no window.open used in its own scripts, so do not use it in userscript either.
					// It might cause security problems.
					//window.open('https://www.wenku8.net/modules/article/tags.php?t=' + $URL.encode(searchText.value));
					if (typeof($URL) === 'undefined' ) {
						$URLError();
						return true;
					} else {
						GM_openInTab(URL_TAGSEARCH.replace('{TU}', $URL.encode(searchText.value)), {
							active: true, insert: true, setParent: true, incognito: false
						});
						return false;
					}
				}
			}

			function $URLError() {
				DoLog(LogLevel.Error, '$URL(from gbk.js) is not loaded.');
				DoLog(LogLevel.Warning, 'Search as plain text instead.');

				// Search as plain text instead
				for (const node of typeSelect.childNodes) {
					node.selected = (node.tagName === 'OPTION' && node.value === 'articlename') ? true : false;
				}
			}
		}
	}

	// Tags page add-on
	function pageTags() {
	}

	// Mylink page add-on
	function pageMylink() {
		// Get elements
		const main = $('#content');
		const tbllink = $('#content>table');

		linkEnhance();

		function fixEdit(link) {
			const aedit = link.aedit;
			aedit.setAttribute('onclick', "editlink({ULID},'{NAME}','{HREF}','{INFO}')".replace('{ULID}', deal(link.ulid)).replace('{NAME}', deal(link.name)).replace('{HREF}', deal(link.href)).replace('{INFO}', deal(link.info)));

			function deal(str) {
				return str.replaceAll("'", "\\'");
			}
		}

		function linkEnhance() {
			const links = getAllLinks();
			for (const link of links) {
				fixEdit(link);
			}
		}

		function getAllLinks() {
			const links = [];
			const trs = $All(tbllink, 'tbody>tr+tr');
			for (const tr of trs) {
				const link = {};

				// All <td>
				link.tdlink = tr.children[0];
				link.tdinfo = tr.children[1];
				link.tdtime = tr.children[2];
				link.tdoprt = tr.children[3];

				// Inside <td>
				link.alink = link.tdlink.children[0];
				link.aedit = link.tdoprt.children[0];
				link.apos  = link.tdoprt.children[1];
				link.adel  = link.tdoprt.children[2];

				// Infos
				link.href = link.alink.href;
				link.ulid = getUrlArgv({url: link.apos.href, name: 'ulid'});
				link.name = link.alink.innerText;
				link.info = link.tdinfo.innerText;
				link.time = link.tdtime.innerText;
				link.purl = link.apos.href;

				links.push(link);
			}

			return links;
		}
	}

	// User page add-on
	function pageUser() {
		const UID = Number(getUrlArgv('uid'));

		// Provide review search option
		reviewButton();

		// Review search option
		function reviewButton() {
			// clone button and container div
			const oriContainer = $All('.blockcontent .userinfo')[0].parentElement;
			const container = oriContainer.cloneNode(true);
			const button = $(container, 'a');
			button.innerText = TEXT_GUI_USER_REVIEWSEARCH;
			button.href = URL_REVIEWSEARCH.replaceAll('{K}', String(UID));
			oriContainer.parentElement.appendChild(container);
		}
	}

	// Detail page add-on
	function pageDetail() {
		// Get elements
		const content = $('#content');
		const tbody = $(content, 'table>tbody');

		insertSettings();

		// Insert Settings GUI
		function insertSettings() {
			let elements = GUI();

			function GUI() {
				const review = CONFIG.BkReviewPrefs.getConfig();
				const settings = [
					[{html: TEXT_GUI_DETAIL_TITLE_SETTINGS, colSpan: 3, class: 'foot'}],
					[{html: TEXT_GUI_DETAIL_TITLE_BGI}, {colSpan: 2, key: 'bgimage', tiptitle: TEXT_TIP_IMAGE_FIT}],
					[{html: TEXT_GUI_DETAIL_BGI_UPLOAD}, {colSpan: 2, key: 'bgupload'}],
					[{html: TEXT_GUI_DETAIL_GUI_IMAGER}, {colSpan: 2, key: 'imager'}],
					[{html: TEXT_GUI_DETAIL_GUI_SCALE}, {colSpan: 2, key: 'scalectnr'}],
					[{html: TEXT_GUI_DETAIL_BTF_NOVEL}, {colSpan: 2, key: 'btfnvlctnr'}],
					[{html: TEXT_GUI_DETAIL_BTF_REVIEW}, {colSpan: 2, key: 'btfrvwctnr'}],
					[{html: TEXT_GUI_DETAIL_BTF_COMMON}, {colSpan: 2, key: 'btfcmnctnr'}],
					[{html: TEXT_GUI_DETAIL_FVR_LASTPAGE}, {colSpan: 2, key: 'favoropen'}],
					[{html: TEXT_GUI_DETAIL_VERSION_CURVER}, {colSpan: 2, key: 'curversion'}],
					[{html: TEXT_GUI_DETAIL_VERSION_CHECKUPDATE}, {colSpan: 2, key: 'updatecheck'}],
					[{html: TEXT_GUI_DETAIL_FEEDBACK_TITLE, colSpan: 1, key: 'feedbackttle'}, {html: TEXT_GUI_DETAIL_FEEDBACK, colSpan: 2, key: 'feedback'}],
					[{html: TEXT_GUI_DETAIL_UPDATEINFO_TITLE, colSpan: 1, key: 'feedbackttle'}, {html: TEXT_GUI_DETAIL_UPDATEINFO, colSpan: 2, key: 'updateinfo'}],
					[{html: TEXT_GUI_DETAIL_CONFIG_EXPORT}, {html: TEXT_GUI_DETAIL_EXPORT_CLICK, colSpan: 2, key: 'exportcfg'}],
					[{html: TEXT_GUI_DETAIL_CONFIG_EXPORT_NOPASS}, {html: TEXT_GUI_DETAIL_EXPORT_CLICK, colSpan: 2, key: 'exportcfgnp'}],
					[{html: TEXT_GUI_DETAIL_CONFIG_IMPORT, colSpan: 1, key: 'importcfgttle'}, {html: TEXT_GUI_DETAIL_IMPORT_CLICK, colSpan: 2, key: 'importcfg'}],
					[{html: TEXT_GUI_DETAIL_CONFIG_MANAGE, colSpan: 1, key: 'managecfgttle'}, {html: TEXT_GUI_DETAIL_MANAGE_CLICK, colSpan: 2, key: 'managecfg'}],
					//[{html: TEXT_GUI_DETAIL_XXXXXX_XXXXXX, colSpan: 1, key: 'xxxxxxxx'}, {html: TEXT_GUI_DETAIL_XXXXXX_XXXXXX, colSpan: 2, key: 'xxxxxxxx'}],
				]
				const elements = createTableGUI(settings);
				const tdBgi = elements.bgimage;
				const imageinput = elements.imageinput = $CrE('input');
				const bgioprt = elements.bgioprt = $CrE('span');
				const bgiupld = elements.bgupload;
				const ckbgiup = elements.ckbgiup = $CrE('input');
				ckbgiup.type = 'checkbox';
				ckbgiup.checked = CONFIG.BeautifierCfg.getConfig().upload;
				ckbgiup.addEventListener('change', uploadChange);
				settip(ckbgiup, TEXT_GUI_DETAIL_BGI_LEGAL);
				bgiupld.appendChild(ckbgiup);
				imageinput.type = 'file';
				imageinput.style.display = 'none';
				imageinput.addEventListener('change', pictureGot);
				bgioprt.innerHTML = TEXT_GUI_DETAIL_DEFAULT_BGI + '</br>' + TEXT_GUI_DETAIL_BGI.replace('{N}', CONFIG.BeautifierCfg.getConfig().bgiName);
				bgioprt.style.color = 'grey';
				settip(bgioprt, TEXT_TIP_IMAGE_FIT);
				tdBgi.addEventListener("dragenter", destroyEvent);
				tdBgi.addEventListener("dragover", destroyEvent);
				tdBgi.addEventListener('drop', pictureGot);
				tdBgi.style.textAlign = 'center';
				tdBgi.addEventListener('click', ()=>{elements.imageinput.click();});
				tdBgi.appendChild(imageinput);
				tdBgi.appendChild(bgioprt);

				// Imager
				const curimager = CONFIG.UserGlobalCfg.getConfig().imager;
				elements.imager.style.padding = '0px 0.5em';
				for (const [key, imager] of Object.entries(DATA_IMAGERS)) {
					if (typeof(imager) !== 'object' || !imager.isImager) {continue;}

					const span = $CrE('span');
					const radio = $CrE('input');
					const text = $CrE('span');
					radio.type = 'radio';
					radio.value = '';
					radio.id = 'imager_'+key;
					radio.imagerkey = key;
					radio.name = 'imagerselect';
					radio.style.cursor = 'pointer';
					radio.addEventListener('change', imagerChange);
					radio.disabled = !imager.available;
					text.innerText = imager.name + (imager.available ? '' : '(已失效)');
					text.style.marginRight = '1em';
					text.style.cursor = 'pointer';
					text.addEventListener('click', function() {radio.click();});
					span.style.display = 'inline-block';
					span.appendChild(radio);
					span.appendChild(text);
					if (imager.tip) {
						let tip = imager.tip;
						DATA_IMAGERS.default === key && (tip += TEXT_TIP_IMAGER_DEFAULT);
						!imager.available && (tip = '<del>{T}</del></br>已失效'.replace('{T}', tip));
						settip(radio, tip);
						settip(text, tip);
						//settip(span, imager.tip);
					}
					elements.imager.appendChild(span);
				}
				$(elements.imager, '#imager_'+curimager).checked = true;

				// Text scale
				const textScale = CONFIG.BeautifierCfg.getConfig().textScale;
				const scalectnr = elements.scalectnr;
				const elmscale = elements.scale = $CrE('input');
				elmscale.type = 'number';
				elmscale.id = 'textScale';
				elmscale.value = textScale;
				elmscale.addEventListener('change', scaleChange);
				elmscale.addEventListener('keydown', (e) => {e.keyCode === 13 && scaleChange();});
				scalectnr.appendChild(elmscale);
				scalectnr.appendChild(document.createTextNode('%'));

				// Beautifier
				const btfnvlctnr = elements.btfnvlctnr;
				const btfrvwctnr = elements.btfrvwctnr;
				const btfcmnctnr = elements.btfcmnctnr;
				const ckbtfnvl = elements.ckbtfnvl = $CrE('input');
				const ckbtfrvw = elements.ckbtfrvw = $CrE('input');
				const ckbtfcmn = elements.ckbtfcmn = $CrE('input');
				ckbtfnvl.type = ckbtfrvw.type = ckbtfcmn.type = 'checkbox';
				ckbtfnvl.page = 'novel';
				ckbtfrvw.page = 'reviewshow';
				ckbtfcmn.page = 'common';
				ckbtfnvl.checked = CONFIG.BeautifierCfg.getConfig().novel.beautiful;
				ckbtfrvw.checked = CONFIG.BeautifierCfg.getConfig().reviewshow.beautiful;
				ckbtfcmn.checked = CONFIG.BeautifierCfg.getConfig().common.beautiful;
				ckbtfnvl.addEventListener('change', beautifulChange);
				ckbtfrvw.addEventListener('change', beautifulChange);
				ckbtfcmn.addEventListener('change', beautifulChange);
				btfnvlctnr.appendChild(ckbtfnvl);
				btfrvwctnr.appendChild(ckbtfrvw);
				btfcmnctnr.appendChild(ckbtfcmn);

				// Favorite open
				const favoropen = elements.favoropen;
				const favorlast = elements.favorlast = $CrE('input');
				favorlast.type = 'checkbox';
				favorlast.checked = CONFIG.BkReviewPrefs.getConfig().favorlast;
				favorlast.addEventListener('change', favorlastChange);
				favoropen.appendChild(favorlast);

				// Version control
				const curversion = elements.curversion;
				const updatecheck = elements.updatecheck;
				const versiondisplay = $CrE('span');
				versiondisplay.innerText = 'v' + GM_info.script.version;
				updatecheck.innerText = TEXT_GUI_DETAIL_VERSION_CHECK;
				updatecheck.style.color = 'grey';
				updatecheck.style.textAlign = 'center';
				updatecheck.addEventListener('click', updateOnclick);
				curversion.appendChild(versiondisplay);

				// Feedback
				const feedback = elements.feedback;
				feedback.style.color = 'grey';
				feedback.style.textAlign = 'center';
				feedback.addEventListener('click', function() {
					window.open('https://greasyfork.org/scripts/416310/feedback');
				});

				// Update info
				const updateinfo = elements.updateinfo;
				updateinfo.style.color = 'grey';
				updateinfo.style.textAlign = 'center';
				updateinfo.addEventListener('click', function() {
					window.open('https://greasyfork.org/scripts/416310#updateinfo');
				})

				// Config export/import
				const exportcfg = elements.exportcfg;
				const exportcfgnp = elements.exportcfgnp;
				const importcfg = elements.importcfg;
				const configinput = elements.configinput = $CrE('input');
				configinput.type = 'file';
				configinput.style.display = 'none';
				importcfg.style.color = exportcfgnp.style.color = exportcfg.style.color = 'grey';
				importcfg.style.textAlign = exportcfgnp.style.textAlign = exportcfg.style.textAlign = 'center';
				exportcfg.addEventListener('click', ()=>{exportConfig(false);});
				exportcfgnp.addEventListener('click', ()=>{exportConfig(true);});
				importcfg.addEventListener('click', () => {configinput.click()});
				configinput.addEventListener('change', configfileGot);
				importcfg.addEventListener("dragenter", destroyEvent);
				importcfg.addEventListener("dragover", destroyEvent);
				importcfg.addEventListener('drop', configfileGot);
				//importcfg.appendChild(configinput);

				// Config management
				const managecfg = elements.managecfg;
				managecfg.style.color = 'grey';
				managecfg.style.textAlign = 'center';
				managecfg.addEventListener('click', openManagePanel);

				// Paste event
				window.addEventListener('paste', filePasted);

				return elements;
			}

			function filePasted(e) {
				const input = e.dataTransfer || e.clipboardData || window.clipboardData || e.target;
				if (!input.files || input.files.length === 0) {return false;};

				for (const file of input.files) {
					switch (file.type) {
						case 'image/bmp':
						case 'image/gif':
						case 'image/vnd.microsoft.icon':
						case 'image/jpeg':
						case 'image/png':
						case 'image/svg+xml':
						case 'image/tiff':
						case 'image/webp':
							confirm(TEXT_GUI_DETAIL_CONFIG_IMPORT_CONFIRM_SELECT.replace('{N}', file.name)) && pictureGot(e);
							break;
						case '': {
							const splited = file.name.split('.');
							const ext = splited[splited.length-1];
							switch (ext) {
								case 'wkp':
									confirm(TEXT_GUI_DETAIL_CONFIG_IMPORT_CONFIRM_PASTE.replace('{N}', file.name)) && configfileGot(e);
							}
						}
					}
				}
			}

			function pictureGot(e) {
				e.preventDefault();

				// Get file
				const input = e.dataTransfer || e.clipboardData || window.clipboardData || e.target;
				if (!input.files || input.files.length === 0) {return false;};
				const fileObj = input.files[0];
				const mimetype = fileObj.type;
				const name = fileObj.name;

				// Create a new file input
				elements.bgimage.removeChild(elements.imageinput);
				const imageinput = elements.imageinput = $CrE('input');
				imageinput.type = 'file';
				imageinput.style.display = 'none';
				imageinput.addEventListener('change', pictureGot);
				elements.bgimage.appendChild(imageinput);

				if (!mimetype || mimetype.split('/')[0] !== 'image') {
					alertify.error(TEXT_ALT_IMAGE_FORMATERROR);
					return false;
				}
				elements.bgioprt.innerHTML = TEXT_GUI_DETAIL_BGI_WORKING;

				// Get object url
				const objurl = URL.createObjectURL(fileObj);

				// Get image url(format base64)
				getImageUrl(objurl, true, true, (url) => {
					if (!url) {return false;};

					// Save to config
					const config = CONFIG.BeautifierCfg.getConfig();
					config.backgroundImage = url;
					config.bgiName = name;
					CONFIG.BeautifierCfg.saveConfig(config);
					elements.bgioprt.innerHTML = name;
					URL.revokeObjectURL(objurl);

					// Upload if need
					if (config.upload) {
						alertify.notify(TEXT_ALT_IMAGE_UPLOAD_WORKING);
						elements.bgioprt.innerHTML = TEXT_GUI_DETAIL_BGI_UPLOADING.replace('{NAME}', name);
						const file = dataURLtoFile(url, name);
						uploadImage({
							file: file,
							onerror: (e) => {
								alertify.error(TEXT_ALT_IMAGE_UPLOAD_ERROR);
								DoLog(LogLevel.Error, ['Upload error at pictureGot:', e]);
								elements.bgioprt.innerHTML = TEXT_GUI_DETAIL_BGI_UPLOADFAILED.replace('{NAME}', name);
								const config = CONFIG.BeautifierCfg.getConfig();
								config.upload = elements.ckbgiup.checked = /^https?:\/\//.test(config.reveiwshow.backgroundImage);
								CONFIG.BeautifierCfg.saveConfig(config);
							},
							onload: (json) => {
								const config = CONFIG.BeautifierCfg.getConfig();
								config.backgroundImage = json.url;
								CONFIG.BeautifierCfg.saveConfig(config);
								elements.bgioprt.innerHTML = TEXT_GUI_DETAIL_DEFAULT_BGI + '</br>' + TEXT_GUI_DETAIL_BGI.replace('{N}', CONFIG.BeautifierCfg.getConfig().bgiName);
								alertify.success(TEXT_ALT_IMAGE_UPLOAD_SUCCESS.replace('{NAME}', json.name).replace('{URL}', json.url));
							}
						})
					}
				});
			}

			function uploadChange(e) {
				e.preventDefault();

				const config = CONFIG.BeautifierCfg.getConfig();
				config.upload = !config.upload;
				CONFIG.BeautifierCfg.saveConfig(config);
				const name = config.bgiName ? config.bgiName : 'image.jpeg';

				if (config.upload) {
					// Upload
					const url = config.backgroundImage;
					if (!/^https?:\/\//.test(url)) {
						alertify.notify(TEXT_ALT_IMAGE_UPLOAD_WORKING);
						elements.bgioprt.innerHTML = TEXT_GUI_DETAIL_BGI_UPLOADING.replace('{NAME}', name);
						const file = dataURLtoFile(url, name);
						uploadImage({
							file: file,
							onerror: (e) => {
								alertify.error(TEXT_ALT_IMAGE_UPLOAD_ERROR);
								DoLog(LogLevel.Error, ['Upload error at uploadChange:', e]);
								elements.bgioprt.innerHTML = TEXT_GUI_DETAIL_BGI_UPLOADFAILED.replace('{NAME}', name);
								const config = CONFIG.BeautifierCfg.getConfig();
								config.upload = elements.ckbgiup.checked = /^https?:\/\//.test(config.backgroundImage);
								CONFIG.BeautifierCfg.saveConfig(config);
							},
							onload: (json) => {
								const config = CONFIG.BeautifierCfg.getConfig();
								config.backgroundImage = json.url;
								config.bgiName = elements.bgioprt.innerHTML = json.name;
								CONFIG.BeautifierCfg.saveConfig(config);
								alertify.success(TEXT_ALT_IMAGE_UPLOAD_SUCCESS.replace('{NAME}', json.name).replace('{URL}', json.url));
							}
						});
					}
				} else {
					// Download
					const url = config.backgroundImage;
					if (/^https?:\/\//.test(url)) {
						alertify.notify(TEXT_ALT_IMAGE_DOWNLOAD_WORKING);
						elements.bgioprt.innerHTML = TEXT_GUI_DETAIL_BGI_DOWNLOADING.replace('{NAME}', name);
						getImageUrl(url, true, true, (dataurl) => {
							if (!dataurl) {
								const config = CONFIG.BeautifierCfg.getConfig();
								config.upload = elements.ckbgiup.checked = /^https?:\/\//.test(config.backgroundImage);
								CONFIG.BeautifierCfg.saveConfig(config);
								return false;
							};

							// Save to config
							const config = CONFIG.BeautifierCfg.getConfig();
							config.backgroundImage = dataurl;
							CONFIG.BeautifierCfg.saveConfig(config);
							alertify.success(TEXT_ALT_IMAGE_DOWNLOAD_SUCCESS.replace('{NAME}', name));
							elements.bgioprt.innerHTML = name;
						});
					}
				}

				setTimeout(()=>{elements.ckbgiup.checked = config.upload;}, 0);
			}

			function imagerChange(e) {
				e.stopPropagation();
				const radio = e.target;
				if (radio.checked) {
					const imager = DATA_IMAGERS[radio.imagerkey];
					const config = CONFIG.UserGlobalCfg.getConfig();
					config.imager = radio.imagerkey;
					CONFIG.UserGlobalCfg.saveConfig(config);
					alertify.message('图床已切换到{NAME}'.replace('{NAME}', imager.name));
					imager.warning && alertify.warning(imager.warning);
				}
			}

			function scaleChange(e) {
				e.stopPropagation();
				const config = CONFIG.BeautifierCfg.getConfig();
				config.textScale = e.target.value;
				CONFIG.BeautifierCfg.saveConfig(config);
				alertify.message(TEXT_ALT_TEXTSCALE_CHANGED.replaceAll('{S}', config.textScale));
			}

			function beautifulChange(e) {
				e.stopPropagation();
				const checkbox = e.target;
				const config = CONFIG.BeautifierCfg.getConfig();
				config[checkbox.page].beautiful = checkbox.checked;
				CONFIG.BeautifierCfg.saveConfig(config);
				alertify.message(checkbox.checked ? TEXT_ALT_BEAUTIFUL_ON : TEXT_ALT_BEAUTIFUL_OFF);
			}

			function favorlastChange(e) {
				e.stopPropagation();
				const checkbox = e.target;
				const config = CONFIG.BkReviewPrefs.getConfig();
				config.favorlast = checkbox.checked;
				CONFIG.BkReviewPrefs.saveConfig(config);
				alertify.message(checkbox.checked ? TEXT_ALT_FAVORITE_LAST_ON : TEXT_ALT_FAVORITE_LAST_OFF);
			}

			function updateOnclick(e) {
				TASK.Script.update(true);
			}

			function configfileGot(e) {
				e.preventDefault();

				// Get file
				const input = e.dataTransfer || e.clipboardData || window.clipboardData || e.target;
				if (!input.files || input.files.length === 0) {return false;};
				const fileObj = input.files[0];
				const splitedname = fileObj.name.split('.');
				const ext = splitedname[splitedname.length-1].toLowerCase();
				if (ext !== 'wkp') {
					alertify.error(TEXT_ALT_DETAIL_CONFIG_IMPORT_ERROR_SELECT);
					DoLog(LogLevel.Warning, 'pageDetail.insertSettings.GUI.configfileGot: userinput error.')
					return false;
				}

				// Read config from file
				try {
					const FR = new FileReader();
					FR.onload = fileOnload;
					FR.readAsText(fileObj);
				} catch(e) {
					fileError(e);
				}

				function fileOnload(e) {
					try {
						// Get json
						const json = JSON.parse(e.target.result);

						// Import
						importConfig(json);

						alertify.success(TEXT_ALT_DETAIL_IMPORTED);
					} catch(err) {
						fileError(err);
					}
				}

				function fileError(e) {
					DoLog(LogLevel.Error, ['pageDetail.insertSettings.GUI.configfileGot:', e]);
					alertify.error(TEXT_ALT_DETAIL_CONFIG_IMPORT_ERROR_READ);
				}
			}

			function openManagePanel(e) {
				const settings = {
					id: 'ConfigPanel'
				};
				const SetPanel = new SettingPanel(settings);
				const tblAccount = SetPanel.tables[0];

				account();
				drafts();
				review_favorites();
				pending_tip();

				SetPanel.usercss += '.settingpanel-block.sp-center {text-align: center;} .settingpanel-block{overflow-wrap: anywhere;}';

				function account() {
					const userConfig = CONFIG.GlobalConfig.getConfig();
					const users = userConfig.users ? userConfig.users : {};

					// Create table
					const table = new SetPanel.PanelTable({
						rows: [{
							blocks: [{
								className: 'sp-center',
								innerHTML: '账号管理',
								colSpan: 3
							}]
						},{
							blocks: [{
								className: 'sp-center',
								innerHTML: '用户名'
							},{
								className: 'sp-center',
								innerHTML: '密码'
							},{
								className: 'sp-center',
								innerHTML: '操作'
							}]
						}]
					});
					SetPanel.appendTable(table);

					for (const [name, user] of Object.entries(users)) {
						// Get account
						const username = user.username;
						const password = user.password;

						// Row
						const row = new SetPanel.PanelRow();
						table.appendRow(row);

						// Block username
						const block_username = new SetPanel.PanelBlock({
							className: 'sp-center',
							innerHTML: username
						});

						// Block password
						const spanpswd = $CrE('span');;
						spanpswd.innerHTML = '*'.repeat(password.length);
						const block_password = new SetPanel.PanelBlock({
							className: 'sp-center',
							children: [spanpswd]
						});

						// Block operator
						const btndel = _createBtn('删除', make_del_callback(row, username));
						const elmshow = $CrE('span'); elmshow.innerHTML = '查看';
						const btnshow = _createBtn(elmshow, make_show_callback(elmshow, spanpswd, password));
						const block_operator = new SetPanel.PanelBlock({
							className: 'sp-center',
							children: [btnshow, btndel]
						});

						// Append row to SettingPanel
						row.appendBlock(block_username).appendBlock(block_password).appendBlock(block_operator);
					}

					function make_del_callback(row, username) {
						return function(e) {
							const userConfig = CONFIG.GlobalConfig.getConfig();
							delete userConfig.users[username];
							CONFIG.GlobalConfig.saveConfig(userConfig);
							row.remove();
						}
					}

					function make_show_callback(btn, span, password) {
						let show = false;
						let timeout;
						return function toggle(e) {
							show = !show;
							span.innerHTML = show ? password : '*'.repeat(password.length);
							btn.innerHTML = show ? '隐藏' : '查看';
						}
					}
				}

				function drafts() {
					// Get config
					const allCData = CONFIG.commentDrafts.getConfig();

					// Create table
					const table = new SetPanel.PanelTable({
						rows: [{
							blocks: [{
								className: 'sp-center',
								innerHTML: '书评草稿管理',
								colSpan: 3
							}]
						},{
							blocks: [{
								className: 'sp-center',
								innerHTML: '标题'
							},{
								className: 'sp-center',
								innerHTML: '内容'
							},{
								className: 'sp-center',
								innerHTML: '操作'
							}]
						}]
					});
					SetPanel.appendTable(table);

					// Append rows
					for (const [propkey, commentData] of Object.entries(allCData)) {
						if (propkey === KEY_DRAFT_VERSION) {continue;}
						const title = commentData.title;
						const content = commentData.content;
						const key = commentData.key;

						// Row
						const row = new SetPanel.PanelRow();
						table.appendRow(row);

						// Block title
						const span_title = $CrE('span');
						span_title.innerHTML = _decorate(title);
						const block_title = new SetPanel.PanelBlock({className: 'draft-title sp-center', children: [span_title]});

						// Block content
						const span_content = $CrE('span');
						span_content.innerHTML = _decorate(content);
						const block_content = new SetPanel.PanelBlock({className: 'draft-content', children: [span_content]});

						// Block operator
						const elmshow = $CrE('span'); elmshow.innerHTML = '展开';
						const btnshow = _createBtn(elmshow, make_show_callback(elmshow, key, row, span_title, span_content));
						//const btnedit = _createBtn('编辑', make_edit_callback(key, row));
						const btnopen = _createBtn('打开', make_open_callback(key));
						const btndel = _createBtn('删除', make_del_callback(key, row));
						const block_operator = new SetPanel.PanelBlock({className: 'draft-operator sp-center', children: [btnshow, btnopen, btndel]});

						// Append to row
						row.appendBlock(block_title).appendBlock(block_content).appendBlock(block_operator);
					}

					// Append css
					SetPanel.usercss += '.settingpanel-block.draft-title {width: 20%;} .settingpanel-block.draft-content {width: 50%;} .settingpanel-block.draft-operator {width: 30%}';

					function make_show_callback(btn, key, row, span_title, span_content) {
						let show = false;
						return function() {
							const allCData = CONFIG.commentDrafts.getConfig();
							const data = allCData[key];
							if (!data) {
								alertify.warning(TEXT_ALT_DETAIL_MANAGE_NOTFOUND);
								row.remove();
								return false;
							}
							show = !show;
							btn.innerHTML = show ? '收起' : '展开';
							span_title.innerHTML = _decorate(show ? {text: data.title, length: -1} : data.title);
							span_content.innerHTML = _decorate(show ? {text: data.content, length: -1} : data.content);
						};
					}

					function make_edit_callback(key, row) {
						return function() {
							// Get data
							const allCData = CONFIG.commentDrafts.getConfig();
							const data = allCData[key];
							if (!data) {
								alertify.warning(TEXT_ALT_DETAIL_MANAGE_NOTFOUND);
								row.remove();
								return false;
							}

							// Create box gui
							const box = alertify.alert();
							const container = box.elements.content;
							makeEditor(container, data.rid.toString());
							const form = $(container, 'form');
							const ptitle = $(container, '#ptitle');
							const pcontent = $(container, '#pcontent');
							ptitle.value = data.title;
							pcontent.value = data.content;
							box.setting({
								maximizable: false,
								resizable: true
							});
							box.resizeTo('80%', '60%');
							box.show();
						};
					}

					function make_open_callback(key, row) {
						return function() {
							const allCData = CONFIG.commentDrafts.getConfig();
							const data = allCData[key];
							if (!data) {
								alertify.warning(TEXT_ALT_DETAIL_MANAGE_NOTFOUND);
								row.remove();
								return false;
							}
							const url = data.rid ? URL_REVIEWSHOW_1.replace('{R}', data.rid.toString()) : URL_NOVELINDEX.replace('{I}', data.bid.toString());
							window.open(url);
						}
					}

					function make_del_callback(key, row) {
						return function() {
							const allCData = CONFIG.commentDrafts.getConfig();
							delete allCData[key];
							CONFIG.commentDrafts.saveConfig(allCData);
							row.remove();
						};
					}
				}

				function review_favorites() {
					// Get config
					const config = CONFIG.BkReviewPrefs.getConfig();
					const favs = config.favorites;

					// Create table
					const table = new SetPanel.PanelTable({
						rows: [{
							blocks: [{
								className: 'sp-center',
								innerHTML: '书评收藏管理',
								colSpan: 3
							}]
						},{
							blocks: [{
								className: 'sp-center',
								innerHTML: '主题'
							},{
								className: 'sp-center',
								innerHTML: '备注'
							},{
								className: 'sp-center',
								innerHTML: '操作'
							}]
						}]
					});
					SetPanel.appendTable(table);

					// Append rows
					for (const [rid, fav] of Object.entries(favs)) {
						// Row
						const row = new SetPanel.PanelRow();
						table.appendRow(row);

						// Title block
						const span_title = $CrE('span');
						span_title.innerHTML = _decorate({text: fav.name, length: 0});
						const block_title = new SetPanel.PanelBlock({className: 'fav-title sp-center', children: [span_title]});

						// Note block
						const span_note = $CrE('span');
						span_note.innerHTML = _decorate({text: fav.tiptitle, length: 0});
						const block_note = new SetPanel.PanelBlock({className: 'fav-note sp-center', children: [span_note]});

						// Operator block
						const btn_open = _makeBtn({
							tagName: 'a',
							innerHTML: TEXT_GUI_DETAIL_MANAGE_FAV_NOTE_BTN_OPEN,
							props: {
								href: fav.href + (config.favorlast ? '&page=last' : ''),
								target: '_blank'
							}
						});
						const btn_edit = _makeBtn({
							innerHTML: TEXT_GUI_DETAIL_MANAGE_FAV_NOTE_BTN_NOTE,
							onclick: edit.bind(null, fav, row)
						});
						const btn_delete = _makeBtn({
							innerHTML: TEXT_GUI_DETAIL_MANAGE_FAV_NOTE_BTN_DELETE,
							onclick: del.bind(null, rid, row)
						});
						const block_oprt = new SetPanel.PanelBlock({className: 'fav-operator sp-center', children: [btn_open, btn_edit, btn_delete]});

						// Append to row
						row.appendBlock(block_title).appendBlock(block_note).appendBlock(block_oprt);
					}

					// Append css
					SetPanel.usercss += '.settingpanel-block.fav-title {width: 35%;} .settingpanel-block.fav-note {width: 35%;} .settingpanel-block.fav-operator {width: 30%}';

					function edit(fav, row) {
						alertify.prompt(TEXT_GUI_DETAIL_MANAGE_FAV_NOTE_TITLE, TEXT_GUI_DETAIL_MANAGE_FAV_NOTE_TIP.replace('{TITLE}', fav.name), fav.tiptitle || '', onok, function() {});

						function onok(e, value) {
							// Save empty value as null
							value === value || null;
							fav.tiptitle = value;
							CONFIG.BkReviewPrefs.saveConfig(config);
							row.blocks[1].element.firstChild.innerHTML = _decorate({text: value, length: 0});
							alertify.success(TEXT_GUI_DETAIL_MANAGE_FAV_SAVED);
						}
					}

					function del(rid, row) {
						alertify.confirm(TEXT_GUI_DETAIL_MANAGE_FAV_DELETE_TITLE, TEXT_GUI_DETAIL_MANAGE_FAV_DELETE_TIP.replace('{TITLE}', favs[rid].name), onok, function() {});

						function onok() {
							delete favs[rid];
							CONFIG.BkReviewPrefs.saveConfig(config);
							row.remove();
							alertify.success(TEXT_GUI_DETAIL_MANAGE_FAV_DELETED);
						}
					}
				}

				function pending_tip() {
					const span = $CrE('span');
					span.innerHTML = '*其他管理项尚在开发中，请耐心等待';
					span.classList.add(CLASSNAME_TEXT);
					SetPanel.element.appendChild(span);
				}

				function _createBtn(htmlorbtn, onclick) {
					const innerHTML = typeof htmlorbtn === 'string' ? htmlorbtn : htmlorbtn.innerHTML;
					const btn = htmlorbtn instanceof HTMLElement ? htmlorbtn : $CrE('span');
					!btn.classList.contains(CLASSNAME_BUTTON) && btn.classList.add(CLASSNAME_BUTTON);
					btn.innerHTML = innerHTML;
					btn.style.margin = '0px 0.5em';
					onclick && btn.addEventListener('click', onclick);
					return btn;
				}

				function _makeBtn(details) {
					// Create element
					const elm = $CrE(details.tagName || 'span');

					// Write innerHTML
					copyProp(details, elm, 'innerHTML');

					// Write other properties
					details.props && copyProps(details.props, elm, Object.keys(details.props));

					// Make onclick
					const onclick = details.onclick || (details.onclickMaker ? details.onclickMaker.apply(null, details.onclickArgs || []) : null);

					// Create button
					const btn = _createBtn(elm, onclick);

					// Custom classes
					details.classes && details.classes.forEach(function(c) {!btn.classList.contains(c) && btn.classList.add(c);});

					return btn;
				}

				// details: 'string' or {text: '', length: 16}
				function _decorate(details) {
					// Get Args
					details = !details ? '' : details;
					details = typeof details === 'string' ? {text: details} : details;
					const text = details.text || '';
					const length = typeof details.length === 'number' ? (details.length > 0 ? details.length : Infinity) : 16;

					const len = length > 0 ? length : 9999999999999;
					const overflow = (text.length - len) > length;
					const cut = overflow ? text.substr(0, len) : text;
					const encoded = htmlEncode(cut).replaceAll('\n', '</br>');
					const filled = text.length === 0 ? TEXT_GUI_DETAIL_CONFIG_MANAGE_EMPTY : (overflow ? encoded + TEXT_GUI_DETAIL_CONFIG_MANAGE_MORE : encoded);
					return filled;
				}
			}
		}

		function createTableGUI(lines) {
			const elements = {};
			for (const line of lines) {
				const tr = $CrE('tr');
				for (const item of line) {
					const td = $CrE('td');
					item.html && (td.innerHTML = item.html);
					item.colSpan && (td.colSpan = item.colSpan);
					item.class && (td.className = item.class);
					item.id && (td.id = item.id);
					item.tiptitle && settip(td, item.tiptitle);
					item.key && (elements[item.key] = td);
					td.style.padding = '3px';
					tr.appendChild(td);
				}
				tbody.appendChild(tr);
			}
			return elements;

			function ElementObject(element) {
				const p = new Proxy(element, {
					get: function(elm, id, receiver) {
						return elm[id] || $(elm, '#'+id);
					}
				});

				return p;
			}
		}
	}

	// Index page add-on
    function pageIndex() {
		insertStatus();
		showFavorites();
		showLaterReads();

		// Insert usersript inserted tip
		function insertStatus() {
			const blockcontent = $('#centers>.block:nth-child(1)>.blockcontent');
			blockcontent.appendChild($CrE('br'));
			const textNode = $CrE('span');
			textNode.innerText = TEXT_GUI_INDEX_STATUS;
			textNode.classList.add(CLASSNAME_TEXT);
			blockcontent.appendChild(textNode);
		}

		// Show favorite reviews
		function showFavorites() {
			const links = [];
			const config = CONFIG.BkReviewPrefs.getConfig();

			for (const [rid, favorite] of Object.entries(config.favorites)) {
				const href = favorite.href + (config.favorlast ? '&page=last' : '');
				const tiptitle = favorite.tiptitle ? favorite.tiptitle : href;
				const innerHTML = favorite.name.substr(0, 12) // prevent overflow
				links.push({
					innerHTML: innerHTML,
					tiptitle: tiptitle,
					href: href
				});
			}

			const block = createWenkuBlock({
				type: 'toplist',
				parent: '#left',
				title: TEXT_GUI_INDEX_FAVORITES,
				items: links
			});
		}

		// Show top-6 read-later books
		function showLaterReads() {
			const config = CONFIG.bookcasePrefs.getConfig().laterbooks;
			const books = sortLaterReads(config.books, config.sortby).filter((e,i,a)=>(i<6));
			const items = books.map(function(book, i) {
				return {
					href: URL_NOVELINDEX.replace('{I}', book.aid),
					src: book.cover,
					tiptitle: book.name,
					text: book.name
				}
			});
			const block = createWenkuBlock({
				type: 'imagelist',
				parent: '#centers',
				title: TEXT_GUI_INDEX_LATERBOOKS,
				items: items
			});
			settip($(block, '.blocktitle'), TEXT_TIP_INDEX_LATERREADS);
		}
    }

    // Download page add-on
    function pageDownload() {
        let i;
        let dlCount = 0; // number of active download tasks
        let dlAllRunning = false; // whether there is downloadAll running

		// Get novel info
		const novelInfo = {}; collectNovelInfo();
		const myDlBtns = [];

		// Donwload GUI
		downloadGUI();

        // Server GUI
        serverGUI();

        /* ******************* Code ******************* */
		function collectNovelInfo() {
			novelInfo.novelName = $('html body div.main div#centerm div#content table.grid caption a').innerText;
			novelInfo.displays = getAllNameEles();
			novelInfo.volumeNames = getAllNames();
			novelInfo.type = getUrlArgv('type');
			novelInfo.ext = novelInfo.type !== 'txtfull' ? novelInfo.type : 'txt';
		}

		// Donwload GUI
		function downloadGUI() {
			switch (novelInfo.type) {
				case 'txt':
					downloadGUI_txt();
					break;
				case 'txtfull':
					downloadGUI_txtfull();
					break;
				case 'umd':
					downloadGUI_umd();
					break;
				case 'jar':
					downloadGUI_jar();
					break;
				default:
					DoLog(LogLevel.Warning, 'pageDownload.downloadGUI: Unknown download type');
			}
		}

		// Donwload GUI for txt
		function downloadGUI_txt() {
			// Only txt is really separated by volumes
			if (novelInfo.type !== 'txt') {return false;};

			// define vars
			let i;

			const tbody = $('table>tbody');
			const header = $(tbody, 'th').parentElement;
			const thead = $(header, 'th');

			// Append new th
			const newHead = thead.cloneNode(true);
			newHead.innerText = TEXT_GUI_SDOWNLOAD;
			thead.width = '40%';
			header.appendChild(newHead);

			// Append new td
			const trs = $All(tbody, 'tr');
			for (i = 1; i < trs.length; i++) { /* i = 1 to trs.length-1: skip header */
				const index = i-1;
				const tr = trs[i];
				const newTd = $(tr, 'td.even').cloneNode(true);
				const links = $All(newTd, 'a');
				for (const a of links) {
					a.classList.add(CLASSNAME_BUTTON);
					a.info = {
						description: 'volume download button',
						name: novelInfo.volumeNames[index],
						filename: TEXT_GUI_SDOWNLOAD_FILENAME
							.replace('{NovelName}', novelInfo.novelName)
							.replace('{VolumeName}', novelInfo.volumeNames[index])
							.replace('{Extension}', novelInfo.ext),
						index: index,
						display: novelInfo.displays[index]
					}
					a.onclick = downloadOnclick;
					myDlBtns.push(a);
				}
				tr.appendChild(newTd);
			}

			// Append new tr, provide batch download
			const newTr = trs[trs.length-1].cloneNode(true);
			const newTds = $All(newTr, 'td');
			newTds[0].innerText = TEXT_GUI_DOWNLOADALL;
			//clearChildnodes(newTds[1]); clearChildnodes(newTds[2]);
			newTds[1].innerHTML = newTds[2].innerHTML = TEXT_GUI_NOTHINGHERE;
			tbody.insertBefore(newTr, tbody.children[1]);

			const allBtns = $All(newTds[3], 'a');
			for (i = 0; i < allBtns.length; i++) {
				const a = allBtns[i];
				a.href = 'javascript:void(0);';
				a.info = {
					description: 'download all button',
					index: i
				}
				a.onclick = downloadAllOnclick;
			}

			// Download button onclick
			function downloadOnclick() {
				const a = this;
				a.info.display.innerText = a.info.name + TEXT_GUI_WAITING;
				downloadFile({
					url: a.href,
					name: a.info.filename,
					onloadstart: function(e) {
						a.info.display.innerText = a.info.name + TEXT_GUI_DOWNLOADING;
					},
					onload: function(e) {
						a.info.display.innerText = a.info.name + TEXT_GUI_DOWNLOADED;
					}
				});
				return false;
			}

			// DownloadAll button onclick
			function downloadAllOnclick() {
				const a = this;
				const index = (a.info.index+1)%3;
				for (let i = 0; i < myDlBtns.length; i++) {
					if ((i+1)%3 !== index) {continue;};
					const btn = myDlBtns[i];
					btn.click();
				}
				return false;
			}
		}

		// Donwload GUI for txtfull
		function downloadGUI_txtfull() {
			const container = $('#content>table tr>td:nth-child(3)');
			const links = arrfilter(container.children, (e,i)=>([1,3,5].includes(i)));
			const TEXTS = ['简体(G)', '简体(U)', '繁体(U)'];
			const elms = [];

			elms.push($CrE('br'));
			elms.push(document.createTextNode('程序重命名（'));
			for (let i = 0; i < links.length; i++) {
				const a = links[i];
				const btn = $CrE('a');
				btn.href = a.previousElementSibling.href;
				btn.download = novelInfo.novelName + '.txt';
				btn.innerHTML = TEXTS[i];
				btn.classList.add(CLASSNAME_BUTTON);
				btn.addEventListener('click', downloadFromA);
				elms.push(btn);
				i+1 < links.length && elms.push(a.previousSibling.cloneNode());
			}
			elms.push(document.createTextNode('）'));

			for (const elm of elms) {
				container.appendChild(elm);
			}
		}

		// Donwload GUI for umd
		function downloadGUI_umd() {
			const container = $('#content>table tr>td:nth-child(5)');
			const a = container.firstChild;
			const btn = $CrE('a');
			btn.href = a.href;
			btn.download = novelInfo.novelName + '.umd';
			btn.innerHTML = '重命名下载';
			btn.classList.add(CLASSNAME_BUTTON);
			btn.addEventListener('click', downloadFromA);
			a.insertAdjacentElement('afterend', btn);
			a.insertAdjacentElement('afterend', $CrE('br'));
		}

		// Donwload GUI for jar
		function downloadGUI_jar() {
			const container = $('#content>table tr>td:nth-child(5)');
			const links = arrfilter(container.children, ()=>(true));
			const TEXTS = ['重命名JAR', '重命名JAD'];
			const EXTS = ['.jar', '.jad'];
			const elms = [];

			elms.push($CrE('br'));
			for (let i = 0; i < links.length; i++) {
				const a = links[i];
				const btn = $CrE('a');
				btn.href = a.href;
				btn.download = novelInfo.novelName + EXTS[i];
				btn.innerHTML = TEXTS[i];
				btn.classList.add(CLASSNAME_BUTTON);
				btn.addEventListener('click', downloadFromA);
				elms.push(btn);
				i+1 < links.length && elms.push(a.nextSibling.cloneNode());
			}

			for (const elm of elms) {
				container.appendChild(elm);
			}

			$('#content>table tr>th:nth-child(4)').setAttribute('width', '47%');
			$('#content>table tr>th:nth-child(5)').setAttribute('width', '20%');
		}

		function downloadFromA(e) {
			e.preventDefault();

			const btn = e.target;
			const url = btn.href;

			downloadFile({
				url: url,
				name: btn.download
			});
		}

		// Get all name display elements
		function getAllNameEles() {
            return $All('.grid tbody tr .odd');
        }

		// Get all names
		function getAllNames() {
            const all = getAllNameEles()
            const names = [];
            for (let i = 0; i < all.length; i++) {
                names[i] = all[i].innerText;
            }
            return names;
        }

		// Server GUI
		function serverGUI() {
			let servers = $All('#content>b');
			let serverEles = [];
			for (i = 0; i < servers.length; i++) {
				if (servers[i].innerText.includes('wenku8.com')) {
					serverEles.push(servers[i]);
				}
			}
			for (i = 0; i < serverEles.length; i++) {
				serverEles[i].classList.add(CLASSNAME_BUTTON);
				serverEles[i].addEventListener('click', function () {
					changeAllServers(this.innerText);
				});
				settip(serverEles[i], TEXT_TIP_SERVERCHANGE);
			}
		}

        // Change all server elements
        function changeAllServers(server) {
            let i;
            const allA = $All('.even a');
            for (i = 0; i < allA.length; i++) {
                changeServer(server, allA[i]);
            }
        }

        // Change server for an element
        function changeServer(server, element) {
            if (!element.href) {return false;};
            element.href = element.href.replace(/\/\/dl\d?\.wenku8\.com\//g, '//' + server + '/');
        }

		// Array.prototype.filter
		function arrfilter(arr, callback) {
			return Array.prototype.filter.call(arr, callback);
		}
    }

	// Login page add-on
	function pageLogin() {
		const form = $('form[name="frmlogin"]');
		if (!form) {return false;}
		const eleUsername = $(form, 'input.text[name="username"]');
		const elePassword = $(form, 'input.text[name="password"]')

		catchAccount();

		// Save account info
		function catchAccount() {
			form.addEventListener('submit', () => {
				const config = CONFIG.GlobalConfig.getConfig();
				const username = eleUsername.value;
				const password = elePassword.value;
				config.users = config.users ? config.users : {};
				config.users[username] = {
					username: username,
					password: password
				}
				CONFIG.GlobalConfig.saveConfig(config);
			});
		}
	}

	// Account fast switching
	function multiAccount() {
		if (!$('.fl')) {return false;};
		GUI();

		function GUI() {
			// Add switch select
			const eleTopLeft = $('.fl');
			const eletext    = $CrE('span');
			const sltSwitch  = $CrE('select');
			eletext.innerText = TEXT_GUI_ACCOUNT_SWITCH;
			eletext.classList.add(CLASSNAME_TEXT);
			eletext.style.marginLeft = '0.5em';
			eleTopLeft.appendChild(eletext);
			eleTopLeft.appendChild(sltSwitch);

			// Not logged in, create and select an empty option
			// Select current user's option
			if (!getUserName()) {
				appendOption(TEXT_GUI_ACCOUNT_NOTLOGGEDIN, '').selected = true;
			};

			// Add select options
			const userConfig = CONFIG.GlobalConfig.getConfig();
			const users = userConfig.users ? userConfig.users : {};
			const names = Object.keys(users);
			if (names.length === 0) {
				appendOption(TEXT_GUI_ACCOUNT_NOACCOUNT, '');
				settip(sltSwitch, TEXT_TIP_ACCOUNT_NOACCOUNT);
			}
			for (const username of names) {
				appendOption(username, username)
			}

			// Select current user's option
			if (getUserName()) {selectCurUser();};

			// onchange: switch account
			sltSwitch.addEventListener('change', (e) => {
				const select = e.target;
				if (!select.value || !confirm(TEXT_GUI_ACCOUNT_CONFIRM.replace('{N}', select.value))) {
					selectCurUser();
					destroyEvent(e);
					return;
				}

				switchAccount(select.value);
			});

			function appendOption(text, value) {
				const option = $CrE('option');
				option.innerText = text;
				option.value = value;
				sltSwitch.appendChild(option);
				return option;
			}

			function selectCurUser() {
				for (const option of $All(sltSwitch, 'option')) {
					option.selected = getUserName().toLowerCase() === option.value.toLowerCase();
				}
			}
		}

		function switchAccount(username) {
			// Logout
			alertify.notify(TEXT_ALT_ACCOUNT_WORKING_LOGOFF);
			GM_xmlhttpRequest({
				method: 'GET',
				url: URL_USRLOGOFF,
				onload: function(response) {
					// Login
					alertify.notify(TEXT_ALT_ACCOUNT_WORKING_LOGIN);
					const account = CONFIG.GlobalConfig.getConfig().users[username];
					const data = DATA_XHR_LOGIN
						.replace('{U}', $URL.encode(account.username))
						.replace('{P}', $URL.encode(account.password))
						.replace('{C}', $URL.encode('315360000')) // Expire time: 1 year
					GM_xmlhttpRequest({
						method: 'POST',
						url: URL_USRLOGIN,
						data: data,
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						onload: function() {
							let box = alertify.success(TEXT_ALT_ACCOUNT_SWITCHED.replace('{N}', username));
							redirectGMStorage(getUserID());
							DoLog(LogLevel.Info, 'GM_storage redirected to ' + String(getUserID()));
							const timeout = setTimeout(()=>{location.href=location.href;}, 3000);
							box.callback = (isClicked) => {
								isClicked && clearTimeout(timeout);
							};
						}
					})
				}
			})
		}
	}

	// API page and its sub pages add-on
	function pageAPI(API) {
		addStyle(CSS_PAGE_API, 'plus_api_css');
		//logAPI();

		let result;
		switch(API) {
			case 'modules/article/addbookcase.php':
				result = pageAddbookcase();
				break;
			case 'modules/article/packshow.php':
				result = pagePackshow();
				break;
			default:
				result = logAPI();
		}

		return result;

		function logAPI() {
			DoLog('This is wenku API page.');
			DoLog('API is: [' + API + ']');
			DoLog('There is nothing to do. Quiting...');
		}

		function pageAddbookcase() {

			// Append link to bookcase page
			addBottomButton({
				href: `https://${location.host}/modules/article/bookcase.php`,
				innerHTML: TEXT_GUI_API_ADDBOOKCASE_TOBOOKCASE
			});

			// Append link to remove from bookcase (not finished)
			/*addBottomButton({
				href: `https://${location.host}/modules/article/bookcase.php?delid=` + getUrlArgv('bid'),
				innerHTML: TEXT_GUI_API_ADDBOOKCASE_REMOVE,
				onclick: function() {
					confirm('确实要将本书移出书架么？')
				}
			});*/
		}

		function pagePackshow() {
			// Load packshow page
			loadPage();

			// Packshow page loader
			function loadPage() {
				// Data
				const language = getLang();
				const aid = getUrlArgv('id');
				const type = getUrlArgv('type');

				if (!['txt', 'txtfull', 'umd', 'jar'].includes(type)) {
					return false;
				}

				// Hide api box
				const apiBox = $('body>div:nth-child(1)');
				apiBox.style.display = 'none';

				// Disable api css
				addStyle('', 'plus_api_css');

				// AsyncManager
				const resource = {xmlIndex: null, xmlInfo: null, oDoc: null};
				const AM = new AsyncManager();
				AM.onfinish = fetchFinish;

				// Show soft alert
				alertify.message(TEXT_TIP_API_PACKSHOW_LOADING);

				// Set Title
				document.title = TEXT_GUI_API_PACKSHOW_TITLE_LOADING;

				// Load model page
				const bgImage = $('body>.plus_cbty_image');
				AM.add();
				getDocument(URL_PACKSHOW.replace('{A}', "1").replace('{T}', type), function(oDoc) {
					resource.oDoc = oDoc;

					// Insert body elements
					const nodes = Array.prototype.map.call(oDoc.body.childNodes, (elm) => (elm));
					for (const node of nodes) {
						document.body.insertBefore(node, bgImage);
					}

					// Insert css link and scripts
					const links = Array.prototype.map.call($All(oDoc, 'link[rel="stylesheet"][href]'), (elm) => (elm));
					const olinks = Array.prototype.map.call($All('link[rel="stylesheet"][href]'), (elm) => (elm));
					for (const link of links) {
						if (!link.href.startsWith('http')) {continue;}
						for (const olink of Array.prototype.filter.call(olinks, (l) => (l.href === link.href))) {olink.parentElement.removeChild(olink);}
						document.head.appendChild(link);
					}
					const scripts = Array.prototype.map.call($All(oDoc, 'script[src]'), (elm) => (elm));
					for (const script of scripts) {
						if (!script.src.startsWith('http')) {continue;}
						if (Array.prototype.filter.call($All('script[src]'), (s) => (s.src === script.src)).length > 0) {continue;}
						document.head.appendChild(script);
					}

					// Fix all <a>.href
					Array.from($All('a')).forEach((a) => {
						if (/https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/packshow.php\??/.test(a.href)) {
							a.href = a.href.replace(/([\?&])id=\d+/, '$1id='+aid)
						}
					});

					AM.finish();
				});

				// Load novel index
				AM.add();
				AndAPI.getNovelIndex({
					aid: aid,
					lang: language,
					callback: function(xml) {
						resource.xmlIndex = xml;
						AM.finish();
					}
				});
				AM.add();
				AndAPI.getNovelShortInfo({
					aid: aid,
					lang: language,
					callback: function(xml) {
						resource.xmlInfo = xml;
						AM.finish();
					}
				});

				AM.finishEvent = true;

				function fetchFinish() {
					// Resources
					const xmlIndex = resource.xmlIndex;
					const xmlInfo = resource.xmlInfo;
					const oDoc = resource.oDoc;

					// Elements
					const content = $('#content');
					const table = $(content, 'table');
					const tbody = $(table, 'tbody');

					// Data
					const name = $(xmlInfo, 'data[name="Title"]').childNodes[0].nodeValue;
					const lastupdate = $(xmlInfo, 'data[name="LastUpdate"]').getAttribute('value');
					const aBook = $(table, 'caption>a:first-child');
					const charsets = ['gbk', 'utf-8', 'big5', 'gbk', 'utf-8', 'big5'];
					const innerTexts = ['简体(G)', '简体(U)', '繁体(U)', '简体(G)', '简体(U)', '繁体(U)'];

					// Set Title
					document.title = TEXT_GUI_API_PACKSHOW_TITLE.replace('{N}', name);

					// Set book
					aBook.innerText = name;
					aBook.href = URL_BOOKINTRO.replace('{A}', aid);

					// Load book index
					loadIndex();

					// Soft alert
					alertify.success(TEXT_TIP_API_PACKSHOW_LOADED);

					// Enter common download page enhance
					pageDownload();

					// Book index loader
					function loadIndex() {
						switch (type) {
							case 'txt':
								loadIndex_txt();
								break;
							case 'txtfull':
								loadIndex_txtfull();
								break;
							case 'umd':
								loadIndex_umd();
								break;
							case 'jar':
								loadIndex_jar();
								break;
						}
					}

					// Book index loader for type txt
					function loadIndex_txt() {
						// Clear tbody trs
						for (const tr of $All(table, 'tr+tr')) {
							tbody.removeChild(tr);
						}

						// Make new trs
						for (const volume of $All(xmlIndex, 'volume')) {
							const tr = makeTr(volume);
							tbody.appendChild(tr);
						}

						function makeTr(volume) {
							const tr = $CrE('tr');
							const [tdName, td1, td2] = [$CrE('td'), $CrE('td'), $CrE('td')];
							const a = Array(6);
							const vid = volume.getAttribute('vid');
							const vname = volume.childNodes[0].nodeValue;

							// init tds
							tdName.classList.add('odd');
							td1.classList.add('even');
							td2.classList.add('even');
							td1.align = td2.align = 'center';

							// Set volume name
							tdName.innerText = vname;

							// Make <a> links
							for (let i = 0; i < a.length; i++) {
								a[i] = $CrE('a');
								a[i].target = '_blank';
								a[i].href = 'http://dl.wenku8.com/packtxt.php?aid=' + aid +
									'&vid=' + vid +
									(i >= 3 ? '&aname=' + $URL.encode(name) : '') +
									(i >= 3 ? '&vname=' + $URL.encode(vname) : '') +
									'&charset=' + charsets[i];
								a[i].innerText = innerTexts[i];
								(i < 3 ? td1 : td2).appendChild(a[i]);
							}

							// Insert whitespace textnode
							for (const i of [1, 2, 4, 5]) {
								(i < 3 ? td1 : td2).insertBefore(document.createTextNode('\n'), a[i]);
							}

							tr.appendChild(tdName);
							tr.appendChild(td1);
							tr.appendChild(td2);

							return tr;
						}
					}

					// Book index loader for type txtfull
					function loadIndex_txtfull() {
						const tr = $(tbody, 'tr+tr');
						const tds = Array.prototype.map.call(tr.children, (elm) => (elm));

						tds[0].innerText = lastupdate;
						tds[1].innerText = TEXT_GUI_UNKNOWN;
						for (const a of $All(tds[2], 'a')) {
							a.href = a.href.replace(/id=\d+/, 'id='+aid).replace(/fname=[^&]+/, 'fname='+$URL.encode(name));
						}
					}

					// Book index loader for type umd
					function loadIndex_umd() {
						const tr = $(tbody, 'tr+tr');
						const tds = toArray(tr.children);

						tds[0].innerText = tds[1].innerText = TEXT_GUI_UNKNOWN;
						tds[2].innerText = lastupdate;
						tds[3].innerText = $(xmlIndex, 'volume:first-child').childNodes[0].nodeValue + '—' + $(xmlIndex, 'volume:last-child').childNodes[0].nodeValue;
						const as = [].concat(toArray($All(tds[4], 'a'))).concat(toArray($All(table, 'caption>a+a')));
						for (const a of as) {
							a.href = a.href.replace(/id=\d+/, 'id='+aid);
						}
					}

					// Book index loader for type jar
					function loadIndex_jar() {
						// Currently type jar is the same as type umd
						loadIndex_umd();
					}

					function toArray(_arr) {
						return Array.prototype.map.call(_arr, (elm) => (elm));
					}
				}
			}
		}

		// Add a bottom-styled botton into bottom line, to the first place
		function addBottomButton(details) {
			const aClose = $('a[href="javascript:window.close()"]');
			const bottom = aClose.parentElement;
			const a = $CrE('a');
			const t1 = document.createTextNode('[');
			const t2 = document.createTextNode(']');
			const blank = $CrE('span');
			blank.innerHTML = ' ';
			blank.style.width = '0.5em';
			a.href = details.href;
			a.innerHTML = details.innerHTML;
			a.onclick = details.onclick;
			[blank, t2, a, t1].forEach((elm) => {bottom.insertBefore(elm, bottom.childNodes[0]);});
		}
	}

	// Check if current page is an wenku API page ('处理成功', '出现错误！')
	function isAPIPage() {
		// API page has just one .block div and one close-page button
		const block = $All('.block');
		const close = $All('a[href="javascript:window.close()"]');
		return block.length === 1 && close.length === 1;
	}

	// Basic functions
	// querySelector
	function $() {
		switch(arguments.length) {
			case 2:
				return arguments[0].querySelector(arguments[1]);
				break;
			default:
				return document.querySelector(arguments[0]);
		}
	}
	// querySelectorAll
	function $All() {
		switch(arguments.length) {
			case 2:
				return arguments[0].querySelectorAll(arguments[1]);
				break;
			default:
				return document.querySelectorAll(arguments[0]);
		}
	}
	// createElement
	function $CrE() {
		switch(arguments.length) {
			case 2:
				return arguments[0].createElement(arguments[1]);
				break;
			default:
				return document.createElement(arguments[0]);
		}
	}
	// Object1[prop] ==> Object2[prop]
	function copyProp(obj1, obj2, prop) {obj1[prop] !== undefined && (obj2[prop] = obj1[prop]);}
	function copyProps(obj1, obj2, props) {props.forEach((prop) => (copyProp(obj1, obj2, prop)));}

	// Display an alertify prompt for editing user-remark
	function editUserRemark(uid, name, callback) {
		const config = CONFIG.RemarksConfig.getConfig();
		const user = config.user[uid] || {uid: uid, name: name, remark: ''};

		// Update name
		user.name = name;
		CONFIG.RemarksConfig.saveConfig(config);

		// Display dialog
		alertify.prompt(TEXT_GUI_USER_USERREMARKEDIT_TITLE, TEXT_GUI_USER_USERREMARKEDIT_MSG.replace('{N}', user.name), user.remark, onChange, onCancel);

		function onChange(evt, value) {
			const config = CONFIG.RemarksConfig.getConfig();
			if (value) {
				const user = config.user[uid] || {uid: uid, name: name, remark: ''};
				user.remark = value;
				config.user[uid] = user;
			} else {
				delete config.user[uid]
			}
			CONFIG.RemarksConfig.saveConfig(config);

			callback(value);
		}

		function onCancel() {}
	}

	// Send reply for bookreview
	// Arg: {rid, title, content, onload:(oDoc)=>{}, onerror:()=>{}}
	function sendReviewReply(detail) {
		if (typeof($URL) !== 'object') {
			DoLog(LogLevel.Error, 'sendReviewReply: $URL not found.');
			return false;
		}
		const data = '&ptitle=' + $URL.encode(detail.title) + '&pcontent=' + $URL.encode(detail.content);
		const url = `https://${location.host}/modules/article/reviewshow.php?rid=` + detail.rid.toString();
		GM_xmlhttpRequest({
			method: 'POST',
			url: url,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: data,
			responseType: 'blob',
			onload: function (response) {
				if (!detail.onload) {return false;}
				parseDocument(response.response, detail.onload);
			},
			onerror: function (e) {
				detail.onerror && detail.onerror(e);
			}
		});
	}

	// Android API set
	function AndroidAPI() {
		const AA = this;
		const DParser = new DOMParser();

		const encode = AA.encode = function(str) {
			return '&appver=1.13&request=' + btoa(str) + '&timetoken=' + (new Date().getTime());
		};

		const request = AA.request = function(details) {
			const url = details.url;
			const type = details.type || 'text';
			const callback = details.callback || function() {};
			const args = details.args || [];
			GM_xmlhttpRequest({
				method: 'POST',
				url: 'http://app.wenku8.com/android.php',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 7.1.2; unknown Build/NZH54D)'
				},
				data: encode(url),
				onload: function(e) {
					let result;
					switch (type) {
						case 'xml':
							result = DParser.parseFromString(e.responseText, 'text/xml');
							break;
						case 'text':
							result = e.responseText;
							break;
					}
					callback.apply(null, [result].concat(args));
				},
				onerror: function(e) {
					DoLog(LogLevel.Error, 'AndroidAPI.request Error while requesting "' + url + '"');
					DoLog(LogLevel.Error, e);
				}
			});
		};

		// aid, lang, callback, args
		AA.getNovelShortInfo = function(details) {
			const aid = details.aid;
			const lang = details.lang;
			const callback = details.callback || function() {};
			const args = details.args || [];
			const url = 'action=book&do=info&aid=' + aid + '&t=' + lang;
			request({
				url: url,
				callback: callback,
				args: args,
				type: 'xml'
			});
		}

		// aid, lang, callback, args
		AA.getNovelIndex = function(details) {
			const aid = details.aid;
			const lang = details.lang;
			const callback = details.callback || function() {};
			const args = details.args || [];
			const url = 'action=book&do=list&aid=' + aid + '&t=' + lang;
			request({
				url: url,
				callback: callback,
				args: args,
				type: 'xml'
			});
		};

		// aid, cid, lang, callback, args
		AA.getNovelContent = function(details) {
			const aid = details.aid;
			const cid = details.cid;
			const lang = details.lang;
			const callback = details.callback || function() {};
			const args = details.args || [];
			const url = 'action=book&do=text&aid=' + aid + '&cid=' + cid + '&t=' + lang;
			request({
				url: url,
				callback: callback,
				args: args,
				type: 'text'
			});
		};
	}

	// Create reply-area with enhanced UBBEditor
	function makeEditor(parent, rid, aid) {
		parent.innerHTML = `<form name="frmreview" method="post" action="https://${location.host}/modules/article/reviewshow.php?rid={RID}"><table class="grid" width="100%" align="center"><tbody><tr><td class="odd" width="25%">标题</td><td class="even"><input type="text" class="text" name="ptitle" id="ptitle" size="60" maxlength="60" value="" /></td></tr></tbody><caption>回复书评：</caption><tbody><tr><td class="odd" width="25%">内容(每帖+1积分)</td><td class="even"><textarea class="textarea" name="pcontent" id="pcontent" cols="60" rows="12"></textarea></td></tr><tr><td class="odd" width="25%">&nbsp;</td><td class="even"><input type="submit" name="Submit" class="button" value="发表书评(Ctrl+Enter)" style="padding: 0.3em 0.4em; height: auto;" /><span></span></td></tr></tbody></table></form>`.replace('{RID}', rid).replace('{AID}', aid);
		const script = $CrE('script');
		script.innerHTML = `loadJs("https://${location.host}/scripts/ubbeditor_gbk.js", function(){UBBEditor.Create("pcontent");});`;
		$(parent, '#pcontent').parentElement.appendChild(script);
		areaReply();
	}

	// getMyUserDetail with soft alerts
	function refreshMyUserDetail(callback, args=[]) {
		alertify.notify(TEXT_ALT_USRDTL_REFRESH);
		getMyUserDetail(function() {
			const alertBox = alertify.success(TEXT_ALT_USRDTL_REFRESHED);

			// rewrite onclick function from copying to showing details
			alertBox.callback = function(isClicked) {
				isClicked && alertify.message(altMyUserDetail()/*JSON.stringify(getMyUserDetail())*/);
			}

			// callback if exist
			callback ? callback.apply(args) : function() {};
		})
	}

	// Get my user info detail
	// if no argument provided, this function will just read userdetail from gm_storage
	// otherwise, the function will make a http request to get the latest userdetail
	// if no argument provided and no gm_storage record, then will just return false
	// if not logged in, return false
	// if callback is not a function, then will just request&store but not callback
	function getMyUserDetail(callback, args=[]) {
		if (getUserID() === null) {
			return false;
		}
		if (callback) {
			requestWeb();
			return true;
		} else {
			const storage = CONFIG.userDtlePrefs.getConfig();
			if (!storage.userDetail && !storage.userFriends) {
				DoLog(LogLevel.Warning, 'Attempt to read userDetail from gm_storage but no record found');
				return false;
			};
			const userDetail = storage;
			return userDetail;
		}

		function requestWeb() {
			const lastStorage = CONFIG ? CONFIG.userDtlePrefs.getConfig() : undefined;
			let restXHR = 2;
			let storage = {};

			// Request userDetail
			getDocument(URL_USRDETAIL, detailLoaded)

			// Request userFriends
			getDocument(URL_USRFRIEND, friendLoaded)

			function detailLoaded(oDoc) {
				const content = $(oDoc, '#content');
				storage.userDetail = {
					userID: Number($(content, 'tr:nth-child(1)>.even').innerText),  // '用户ID'
					userLink: $(content, 'tr:nth-child(2)>.even').innerText,        // '推广链接'
					userName: $(content, 'tr:nth-child(3)>.even').innerText,        // '用户名'
					displayName: $(content, 'tr:nth-child(4)>.even').innerText,     // '用户昵称'
					userType: $(content, 'tr:nth-child(5)>.even').innerText,        // '等级'
					userGrade: $(content, 'tr:nth-child(6)>.even').innerText,       // '头衔'
					gender: $(content, 'tr:nth-child(7)>.even').innerText,          // '性别'
					email: $(content, 'tr:nth-child(8)>.even').innerText,           // 'Email'
					qq: $(content, 'tr:nth-child(9)>.even').innerText,              // 'QQ'
					msn: $(content, 'tr:nth-child(10)>.even').innerText,            // 'MSN'
					site: $(content, 'tr:nth-child(11)>.even').innerText,           // '网站'
					signupDate: $(content, 'tr:nth-child(13)>.even').innerText,     // '注册日期'
					contibute: $(content, 'tr:nth-child(14)>.even').innerText,      // '贡献值'
					exp: $(content, 'tr:nth-child(15)>.even').innerText,            // '经验值'
					credit: $(content, 'tr:nth-child(16)>.even').innerText,         // '现有积分'
					friends: $(content, 'tr:nth-child(17)>.even').innerText,        // '最多好友数'
					mailbox: $(content, 'tr:nth-child(18)>.even').innerText,        // '信箱最多消息数'
					bookcase: $(content, 'tr:nth-child(19)>.even').innerText,       // '书架最大收藏量'
					vote: $(content, 'tr:nth-child(20)>.even').innerText,           // '每天允许推荐次数'
					sign: $(content, 'tr:nth-child(22)>.even').innerText,           // '用户签名'
					intoduction: $(content, 'tr:nth-child(23)>.even').innerText,    // '个人简介'
					userImage: $(content, 'tr>td>img').src                          // '头像'
				}
				loaded();
			}

			function friendLoaded(oDoc) {
				const content = $(oDoc, '#content');
				const trs = $All(content, 'tr');
				const friends = [];
				const lastFriends = lastStorage ? lastStorage.userFriends : undefined;

				for (let i = 1; i < trs.length; i++) {
					getFriends(trs[i]);
				}
				storage.userFriends = friends;
				loaded();

				function getFriends(tr) {
					// Check if userID exist
					if (isNaN(Number($(tr.children[2], 'a').href.match(/\?uid=(\d+)/)[1]))) {return false;};

					// Collect information
					let friend = {
						userID: Number($(tr.children[2], 'a').href.match(/\?uid=(\d+)/)[1]),
						userName: tr.children[0].innerText,
						signupDate: tr.children[1].innerText
					}
					friend = fillLocalInfo(friend)
					friends.push(friend);
				}

				function fillLocalInfo(friend) {
					if (!lastFriends) {return friend;};
					for (const f of lastFriends) {
						if (f.userID === friend.userID) {
							for (const [key, value] of Object.entries(f)) {
								if (friend.hasOwnProperty(key)) {continue;};
								friend[key] = value;
							}
							break;
						}
					}
					return friend;
				}
			}

			function loaded() {
				restXHR--;
				if (restXHR === 0) {
					// Save to gm_storage
					if (CONFIG) {
						storage.lasttime = getTime('-', false);
						CONFIG.userDtlePrefs.saveConfig(storage);
					}

					// Callback
					typeof(callback) === 'function' ? callback.apply(null, [storage].concat(args)) : function() {};
				}
			}
		}
	}

	// Show userdetail in an alertify alertbox
	function altMyUserDetail() {
		const json = getMyUserDetail();
		alertify.message(JSON.stringify(getMyUserDetail()));
	}

	function exportConfig(noPass=false) {
		// Get config
		const config = {};
		const getValue = window.getValue ? window.getValue : GM_getValue;
		const listValues = window.listValues ? window.listValues : GM_listValues;
		for (const key of listValues()) {
			config[key] = getValue(key);
		}

		// Remove username and password if required
		noPass && (config[KEY_CM].users = {});

		// Download
		const text = JSON.stringify(config);
		const name = '轻小说文库+_配置文件({P})_v{V}_{T}.wkp'.replace('{P}', noPass ? '无账号密码' : '含账号密码').replace('{V}', GM_info.script.version).replace('{T}', getTime());
		downloadText(text, name);
		alertify.success(TEXT_ALT_CONFIG_EXPORTED.replace('{N}', name));
	}

	function importConfig(json) {
		// Redirect
		redirectGMStorage();

		// Preserve users
		const users = GM_getValue('Config-Manager').users;

		// Delete json
		for (const [key, value] of GM_listValues()) {
			GM_deleteValue(key, value);
		}

		// Set json
		for (const [key, value] of Object.entries(json)) {
			GM_setValue(key, value);
		}

		// Preserve users
		const config = GM_getValue('Config-Manager', {});
		if (!config.users) {config.users = {}}
		for (const [name, user] of Object.entries(users)) {
			config.users[name] = user;
		}
		GM_setValue('Config-Manager', config);

		// Reload
		location.reload();
	}

	function sortLaterReads(books, sortby) {
		const sorter = FUNC_LATERBOOK_SORTERS[sortby].sorter;
		return Object.values(books).sort(sorter);
	}

	function getUserID() {
        const match = $URL.decode(document.cookie).match(/jieqiUserId=(\d+)/);
		const id = match && match[1] ? Number(match[1]) : null;
		return isNaN(id) ? null : id;
	}

	function getUserName() {
		const match = $URL.decode(document.cookie).match(/jieqiUserName=([^, ;]+)/);
		const name = match ? match[1] : null;
		return name;
	}

	// Reload page without re-sending form data, and keeps reviewshow-page
	function reloadPage() {
		const url = /^https?:\/\/www\.wenku8\.(net|cc)\/modules\/article\/reviewshow\.php/.test(location.href) ? URL_REVIEWSHOW_2.replace('{R}', getUrlArgv('rid')).replace('{P}', $('#pagelink>strong').innerText) : location.href;
		location.href = url;
	}

	// Check if tipobj is ready, if not, then make it
	function tipcheck() {
		DoLog(LogLevel.Info, 'checking tipobj...');
		if (typeof(tipobj) === 'object' && tipobj !== null) {
			DoLog(LogLevel.Info, 'tipobj ready...');
			return true;
		} else {
			DoLog(LogLevel.Warning, 'tipobj not ready');
			if (typeof(tipinit) === 'function') {
				DoLog(LogLevel.Success, 'tipinit executed');
				tipinit();
				return true;
			} else {
				DoLog(LogLevel.Error, 'tipinit not found');
				return false;
			}
		}
	}

	// New tipobj movement method. Makes sure the tipobj stay close with the mouse.
	function tipscroll() {
		if (!tipready) {return false;}

		DoLog('tipscroll executed. ')
		tipobj.style.position = 'fixed';
		window.addEventListener('mousemove', tipmoveplus)
		return true;

		function tipmoveplus(e) {
			tipobj.style.left = e.clientX + tipx + 'px';
			tipobj.style.top = e.clientY + tipy + 'px';
		}
	}

	// show & hide tip when mouse in & out. accepts tip as a string or a function that returns the tip string
	function settip(elm, tip) {
		typeof(tip) === 'string' && (elm.tiptitle = tip);
		typeof(tip) === 'function' && (elm.tipgetter = tip);
		elm.removeEventListener('mouseover', showtip);
		elm.removeEventListener('mouseout', hidetip);
		elm.addEventListener('mouseover', showtip);
		elm.addEventListener('mouseout', hidetip);
	}

	function showtip(e) {
		if (e && e.currentTarget && (e.currentTarget.tiptitle || e.currentTarget.tipgetter)) {
			const tip = e.currentTarget.tiptitle || e.currentTarget.tipgetter();
			if (tipready) {
				tipshow(tip);
				e.currentTarget.title && e.currentTarget.removeAttribute('title');
			} else {
				e.currentTarget.title = e.currentTarget.tiptitle;
			}
		} else if (typeof(e) === 'string') {
			tipready && tipshow(e);
		}
	}

	function hidetip() {
		tipready && tiphide();
	}

	// Side-located control panel
	// Requirements: FontAwesome, tooltip.css(from https://github.com/felipefialho/css-components/blob/main/build/tooltip/tooltip.css)
	// Use 'new' keyword
	function SidePanel() {
		// Public SP
		const SP = this;
		const elms = SP.elements = {};

		// Private _SP
		// keys start with '_' shouldn't be modified
		const _SP = {
			_id: {
				css: 'sidepanel-style',
				usercss: 'sidepanel-style-user',
				panel: 'sidepanel-panel'
			},
			_class: {
				button: 'sidepanel-button'
			},
			_css: '#sidepanel-panel {position: fixed; background-color: #00000000; padding: 0.5vmin; line-height: 3.5vmin; height: auto; display: flex; transition-duration: 0.3s; z-index: 9999999999;} #sidepanel-panel.right {right: 3vmin;} #sidepanel-panel.bottom {bottom: 3vmin; flex-direction: column-reverse;} #sidepanel-panel.left {left: 3vmin;} #sidepanel-panel.top {top: 3vmin; flex-direction: column;} .sidepanel-button {padding: 1vmin; margin: 0.5vmin; font-size: 3.5vmin; border-radius: 10%; text-align: center; color: #00000088; background-color: #FFFFFF88; box-shadow:3px 3px 2px #00000022; user-select: none; transition-duration: inherit;} .sidepanel-button:hover {color: #FFFFFFDD; background-color: #000000DD;}',
			_directions: ['left', 'right', 'top', 'bottom']
		};

		Object.defineProperty(SP, 'css', {
			configurable: false,
			enumerable: true,
			get: () => (_SP.css),
			set: (css) => {
				_SP.css = css;
				spAddStyle(css, _SP._id.css);
			}
		});
		Object.defineProperty(SP, 'usercss', {
			configurable: false,
			enumerable: true,
			get: () => (_SP.usercss),
			set: (usercss) => {
				_SP.usercss = usercss;
				spAddStyle(usercss, _SP._id.usercss);
			}
		});
		SP.css = _SP._css;

		SP.create = function() {
			// Create panel
			const panel = elms.panel = document.createElement('div');
			panel.id = _SP._id.panel;
			SP.setPosition('bottom-right');
			document.body.appendChild(panel);

			// Prepare buttons
			elms.buttons = [];
		}

		// Insert a button to given index
		// details = {index, text, faicon, id, tip, className, onclick, listeners}, all optional
		// listeners = [..[..args]]. [..args] will be applied as button.addEventListener's args
		// faicon = 'fa-icon-name-classname fa-icon-style-classname', this arg stands for a FontAwesome icon to be inserted inside the botton
		// Returns the button(HTMLDivElement), including button.faicon(HTMLElement/HTMLSpanElement in firefox, <i>) if faicon is set
		SP.insert = function(details) {
			const index = details.index;
			const text = details.text;
			const faicon = details.faicon;
			const id = details.id;
			const tip = details.tip;
			const className = details.className;
			const onclick = details.onclick;
			const listeners = details.listeners || [];

			const button = document.createElement('div');
			text && (button.innerHTML = text);
			id && (button.id = id);
			tip && setTooltip(button, tip); //settip(button, tip);
			className && (button.className = className);
			onclick && (button.onclick = onclick);
			if (faicon) {
				const i = document.createElement('i');
				i.className = faicon;
				button.faicon = i;
				button.appendChild(i);
			}
			for (const listener of listeners) {
				button.addEventListener.apply(button, listener);
			}
			button.classList.add(_SP._class.button);

			elms.buttons = insertItem(elms.buttons, button, index);
			index < elms.buttons.length ? elms.panel.insertBefore(button, elms.panel.children[index]) : elms.panel.appendChild(button);
			return button;
		}

		// Append a button
		SP.add = function(details) {
			details.index = elms.buttons.length;
			return SP.insert(details);
		}

		// Remove a button
		SP.remove = function(arg) {
			let index, elm;
			if (arg instanceof HTMLElement) {
				elm = arg;
				index = elms.buttons.indexOf(elm);
			} else if (typeof(arg) === 'number') {
				index = arg;
				elm = elms.buttons[index];
			} else if (typeof(arg) === 'string') {
				elm = $(elms.panel, arg);
				index = elms.buttons.indexOf(elm);
			}

			elms.buttons = delItem(elms.buttons, index);
			elm.parentElement.removeChild(elm);
		}

		// Sets the display position by texts like 'right-bottom'
		SP.setPosition = function(pos) {
			const poses = _SP.direction = pos.split('-');
			const avails = _SP._directions;

			// Available check
			if (poses.length !== 2) {return false;}
			for (const p of poses) {
				if (!avails.includes(p)) {return false;}
			}

			// remove all others
			for (const p of avails) {
				elms.panel.classList.remove(p);
			}

			// add new pos
			for (const p of poses) {
				elms.panel.classList.add(p);
			}

			// Change tooltips' direction
			elms.buttons && elms.buttons.forEach(function(button) {
				if (button.getAttribute('role') === 'tooltip') {
					setTooltipDirection(button)
				}
			});
		}

		// Gets the current display position
		SP.getPosition = function() {
			return _SP.direction.join('-');
		}

		// Append a style text to document(<head>) with a <style> element
		// Replaces existing id-specificed <style>s
		function spAddStyle(css, id) {
			const style = document.createElement("style");
			id && (style.id = id);
			style.textContent = css;
			for (const elm of $All('#'+id)) {
				elm.parentElement && elm.parentElement.removeChild(elm);
			}
			document.head.appendChild(style);
		}

		// Set a tooltip to the element
		function setTooltip(elm, text, direction='auto') {
			elm.tooltip = tippy(elm, {
				content: text,
				arrow: true,
				hideOnClick: false
			});

			// Old version, uses tooltip.css
			/*
			elm.setAttribute('role', 'tooltip');
			elm.setAttribute('aria-label', text);
			*/

			setTooltipDirection(elm, direction);
		}

		function setTooltipDirection(elm, direction='auto') {
			direction === 'auto' && (direction = _SP.direction.includes('left') ? 'right' : 'left');
			if (!_SP._directions.includes(direction)) {throw new Error('setTooltip: invalid direction');}

			// Tippy direction
			if (!elm.tooltip) {
				DoLog(LogLevel.Error, 'SidePanel.setTooltipDirection: Given elm has no tippy instance(elm.tooltip)');
				throw new Error('SidePanel.setTooltipDirection: Given elm has no tippy instance(elm.tooltip)');
			}
			elm.tooltip.setProps({
				placement: direction
			});

			// Old version, uses tooltip.css
			/*
			for (const dirct of _SP._directions) {
				elm.classList.remove('tooltip-'+dirct);
			}
			elm.classList.add('tooltip-'+direction);
			*/
		}

		// Del an item from an array using its index. Returns the array but can NOT modify the original array directly!!
		function delItem(arr, index) {
			arr = arr.slice(0, index).concat(arr.slice(index+1));
			return arr;
		}

		// Insert an item into an array using given index. Returns the array but can NOT modify the original array directly!!
		function insertItem(arr, item, index) {
			arr = arr.slice(0, index).concat(item).concat(arr.slice(index));
			return arr;
		}
	}

	// Create a list gui like reviewshow.php##FontSizeTable
	// list = {display: '', id: '', parentElement: <*>, insertBefore: <*>, list: [{value: '', onclick: Function, tip: ''/Function}, ...], visible: bool, onshow: Function(bool shown), onhide: Function(bool hidden)}
	// structure: {div: <div>, ul: <ul>, list: [{li: <li>, button: <input>}, ...], visible: list.visible, show: Function, hide: Function, append: Function({...}), remove: Function(index), clear: Function, onshow: list.onshow, onhide: list.onhide}
	// Use 'new' keyword
	function PlusList(list) {
		const PL = this;

		// Make list
		const div = PL.div = document.createElement('div');
		const ul = PL.ul = document.createElement('ul');
		div.classList.add(CLASSNAME_LIST);
		div.appendChild(ul);
		list.display && (div.style.display = list.display);
		list.id && (div.id = list.id);
		list.parentElement && list.parentElement.insertBefore(div, list.insertBefore ? list.insertBefore : null);

		PL.list = [];
		for (const item of list.list) {
			appendItem(item);
		}

		// Attach properties
		let onshow = list.onshow ? list.onshow : function() {};
		let onhide = list.onhide ? list.onhide : function() {};
		let visible = list.visible;
		PL.create = createItem;
		PL.append = appendItem;
		PL.insert = insertItem;
		PL.remove = removeItem;
		PL.clear = removeAll;
		PL.show = showList;
		PL.hide = hideList;
		Object.defineProperty(PL, 'onshow', {
			get: function() {return onshow;},
			set: function(func) {
				onshow = func ? func : function() {};
			},
			configurable: false,
			enumerable: true
		});
		Object.defineProperty(PL, 'onhide', {
			get: function() {return onhide;},
			set: function(func) {
				onhide = func ? func : function() {};
			},
			configurable: false,
			enumerable: true
		});
		Object.defineProperty(PL, 'visible', {
			get: function() {return visible;},
			set: function(bool) {
				if (typeof(bool) !== 'boolean') {return false;};
				visible = bool;
				bool ? showList() : hideList();
			},
			configurable: false,
			enumerable: true
		});
		Object.defineProperty(PL, 'maxheight', {
			get: function() {return maxheight;},
			set: function(num) {
				if (typeof(num) !== 'number') {return false;};
				maxheight = num;
			},
			configurable: false,
			enumerable: true
		});

		// Apply configurations
		div.style.display = list.visible === true ? '' : 'none';

		// Functions
		function appendItem(item) {
			const listitem = createItem(item);
			ul.appendChild(listitem.li);
			PL.list.push(listitem);
			return listitem;
		}

		function insertItem(item, index, insertByNode=false) {
			const listitem = createItem(item);
			const children = insertByNode ? ul.childNodes : ul.children;
			const elmafter = children[index];
			ul.insertBefore(item.li, elmafter);
			inserttoarr(PL.list, listitem, index);
		}

		function createItem(item) {
			const listitem = {
				remove: () => {removeItem(listitem);},
				li: document.createElement('li'),
				button: document.createElement('input')
			};
			const li  = listitem.li;
			const btn = listitem.button;
			btn.type = 'button';
			btn.classList.add(CLASSNAME_LIST_BUTTON);
			li.classList.add(CLASSNAME_LIST_ITEM);
			item.value && (btn.value = item.value);
			item.onclick && btn.addEventListener('click', item.onclick);
			item.tip && settip(li, item.tip);
			item.tip && settip(btn, item.tip);
			li.appendChild(btn);
			return listitem;
		}

		function removeItem(itemorindex) {
			// Get index
			let index;
			if (typeof(itemorindex) === 'number') {
				index = itemorindex;
			} else if (typeof(itemorindex) === 'object') {
				index = PL.list.indexOf(itemorindex);
			} else {
				return false;
			}
			if (index < 0 || index >= PL.list.length) {
				return false;
			}

			// Remove
			const li = PL.list[index];
			ul.removeChild(li.li);
			delfromarr(PL.list, index);
			return li;
		}

		function removeAll() {
			const length = PL.list.length;
			for (let i = 0; i < length; i++) {
				removeItem(0);
			}
		}

		function showList() {
			if (visible) {return false;};
			onshow(false);
			div.style.display = '';
			onshow(true);
			visible = true;
		}

		function hideList() {
			if (!visible) {return false;};
			onhide(false);
			div.style.display = 'none';
			hidetip();
			onhide(true);
			visible = false;
		}

		// Support functions
		// Del an item from an array by provided index, returns the deleted item. MODIFIES the original array directly!!
		function delfromarr(arr, delIndex) {
			if (delIndex < 0 || delIndex > arr.length-1) {
				return false;
			}
			const deleted = arr[delIndex];
			for (let i = delIndex; i < arr.length-1; i++) {
				arr[i] = arr[i+1];
			}
			arr.pop();
			return deleted;
		}

		// Insert an item to an array by its provided index, returns the item itself. MODIFIES the original array directly!!
		function inserttoarr(arr, item, index) {
			if (index < 0 || index > arr.length-1) {
				return false;
			}
			for (let i = arr.length; i > index; i--) {
				arr[i] = arr[i-1];
			}
			arr[index] = item;
			return item;
		}
	}

	// A table-based setting panel using alertify-js
	// Requires: alertify-js
	// Use 'new' keyword
	// Usage:
	/*
		var panel = new SettingPanel({
			className: '',
			id: '',
			name: '',
			tables: [
				{
					className: '',
					id: '',
					name: '',
					rows: [
						{
							className: '',
							id: '',
							name: '',
							blocks: [
								{
									innerHTML / innerText: ''
									colSpan: 1,
									rowSpan: 1,
									className: '',
									id: '',
									name: '',
									children: [HTMLElement, ...]
								},
								...
							]
						},
						...
					]
				},
				...
			]
		});
	*/
	function SettingPanel(details={}) {
		const SP = this;
		SP.insertTable = insertTable;
		SP.appendTable = appendTable;
		SP.removeTable = removeTable;
		SP.remove = remove;
		SP.PanelTable = PanelTable;
		SP.PanelRow = PanelRow;
		SP.PanelBlock = PanelBlock;

		// <div> element
		const elm = $C('div');
		copyProps(details, elm, ['id', 'name', 'className']);
		elm.classList.add('settingpanel-container');

		// Configure object
		let css='', usercss='';
		SP.element = elm;
		SP.elements = {};
		SP.children = {};
		SP.tables = [];
		SP.length = 0;
		details.id !== undefined && (SP.elements[details.id] = elm);
		copyProps(details, SP, ['id', 'name']);
		Object.defineProperty(SP, 'css', {
			configurable: false,
			enumerable: true,
			get: function() {
				return css;
			},
			set: function(_css) {
				addStyle(_css, 'settingpanel-css');
				css = _css;
			}
		});
		Object.defineProperty(SP, 'usercss', {
			configurable: false,
			enumerable: true,
			get: function() {
				return usercss;
			},
			set: function(_usercss) {
				addStyle(_usercss, 'settingpanel-usercss');
				usercss = _usercss;
			}
		});
		SP.css = '.settingpanel-table {border-spacing: 0px; border-collapse: collapse; width: 100%; margin: 2em 0;} .settingpanel-block {border: 1px solid; text-align: center; vertical-align: middle; padding: 3px; text-align: left;}'

		// Create tables
		if (details.tables) {
			for (const table of details.tables) {
				if (table instanceof PanelTable) {
					appendTable(table);
				} else {
					appendTable(new PanelTable(table));
				}
			}
		}

		// Make alerity box
		const box = SP.alertifyBox = alertify.alert();
		clearChildNodes(box.elements.content);
		box.elements.content.appendChild(elm);
		box.elements.content.style.overflow = 'auto';
		box.setHeader(TEXT_GUI_DETAIL_MANAGE_HEADER);
		box.setting({
			maximizable: true,
			overflow: true
		});
		box.show();

		// Insert a Panel-Row
		// Returns Panel object
		function insertTable(table, index) {
			// Insert table
			!(table instanceof PanelTable) && (table = new PanelTable(table));
			index < SP.length ? elm.insertBefore(table.element, elm.children[index]) : elm.appendChild(table.element);
			insertItem(SP.tables, table, index);
			table.id !== undefined && (SP.children[table.id] = table);
			SP.length++;

			// Set parent
			table.parent = SP;

			// Inherit elements
			for (const [id, subelm] of Object.entries(table.elements)) {
				SP.elements[id] = subelm;
			}

			// Inherit children
			for (const [id, child] of Object.entries(table.children)) {
				SP.children[id] = child;
			}
			return SP;
		}

		// Append a Panel-Row
		// Returns Panel object
		function appendTable(table) {
			return insertTable(table, SP.length);
		}

		// Remove a Panel-Row
		// Returns Panel object
		function removeTable(index) {
			const table = SP.tables[index];
			SP.element.removeChild(table.element);
			removeItem(SP.rows, index);
			return SP;
		}

		// Remove itself from parentElement
		// Returns Panel object
		function remove() {
			SP.element.parentElement && SP.parentElement.removeChild(SP.element);
			return SP;
		}

		// Panel-Table object
		// Use 'new' keyword
		function PanelTable(details={}) {
			const PT = this;
			PT.insertRow = insertRow;
			PT.appendRow = appendRow;
			PT.removeRow = removeRow;
			PT.remove = remove

			// <table> element
			const elm = $C('table');
			copyProps(details, elm, ['id', 'name', 'className']);
			elm.classList.add('settingpanel-table');

			// Configure
			PT.element = elm;
			PT.elements = {};
			PT.children = {};
			PT.rows = [];
			PT.length = 0;
			details.id !== undefined && (PT.elements[details.id] = elm);
			copyProps(details, PT, ['id', 'name']);

			// Append rows
			if (details.rows) {
				for (const row of details.rows) {
					if (row instanceof PanelRow) {
						insertRow(row);
					} else {
						insertRow(new PanelRow(row));
					}
				}
			}

			// Insert a Panel-Row
			// Returns Panel-Table object
			function insertRow(row, index) {
				// Insert row
				!(row instanceof PanelRow) && (row = new PanelRow(row));
				index < PT.length ? elm.insertBefore(row.element, elm.children[index]) : elm.appendChild(row.element);
				insertItem(PT.rows, row, index);
				row.id !== undefined && (PT.children[row.id] = row);
				PT.length++;

				// Set parent
				row.parent = PT;

				// Inherit elements
				for (const [id, subelm] of Object.entries(row.elements)) {
					PT.elements[id] = subelm;
				}

				// Inherit children
				for (const [id, child] of Object.entries(row.children)) {
					PT.children[id] = child;
				}
				return PT;
			}

			// Append a Panel-Row
			// Returns Panel-Table object
			function appendRow(row) {
				return insertRow(row, PT.length);
			}

			// Remove a Panel-Row
			// Returns Panel-Table object
			function removeRow(index) {
				const row = PT.rows[index];
				PT.element.removeChild(row.element);
				removeItem(PT.rows, index);
				return PT;
			}

			// Remove itself from parentElement
			// Returns Panel-Table object
			function remove() {
				PT.parent instanceof SettingPanel && PT.parent.removeTable(PT.tables.indexOf(PT));
				return PT;
			}
		}

		// Panel-Row object
		// Use 'new' keyword
		function PanelRow(details={}) {
			const PR = this;
			PR.insertBlock = insertBlock;
			PR.appendBlock = appendBlock;
			PR.removeBlock = removeBlock;
			PR.remove = remove;

			// <tr> element
			const elm = $C('tr');
			copyProps(details, elm, ['id', 'name', 'className']);
			elm.classList.add('settingpanel-row');

			// Configure object
			PR.element = elm;
			PR.elements = {};
			PR.children = {};
			PR.blocks = [];
			PR.length = 0;
			details.id !== undefined && (PR.elements[details.id] = elm);
			copyProps(details, PR, ['id', 'name']);

			// Append blocks
			if (details.blocks) {
				for (const block of details.blocks) {
					if (block instanceof PanelBlock) {
						appendBlock(block);
					} else {
						appendBlock(new PanelBlock(block));
					}
				}
			}

			// Insert a Panel-Block
			// Returns Panel-Row object
			function insertBlock(block, index) {
				// Insert block
				!(block instanceof PanelBlock) && (block = new PanelBlock(block));
				index < PR.length ? elm.insertBefore(block.element, elm.children[index]) : elm.appendChild(block.element);
				insertItem(PR.blocks, block, index);
				block.id !== undefined && (PR.children[block.id] = block);
				PR.length++;

				// Set parent
				block.parent = PR;

				// Inherit elements
				for (const [id, subelm] of Object.entries(block.elements)) {
					PR.elements[id] = subelm;
				}

				// Inherit children
				for (const [id, child] of Object.entries(block.children)) {
					PR.children[id] = child;
				}
				return PR;
			};

			// Append a Panel-Block
			// Returns Panel-Row object
			function appendBlock(block) {
				return insertBlock(block, PR.length);
			}

			// Remove a Panel-Block
			// Returns Panel-Row object
			function removeBlock(index) {
				const block = PR.blocks[index];
				PR.element.removeChild(block.element);
				removeItem(PR.blocks, index);
				return PR;
			}

			// Remove itself from parent
			// Returns Panel-Row object
			function remove() {
				PR.parent instanceof PanelTable && PR.parent.removeRow(PR.parent.rows.indexOf(PR));
				return PR;
			}
		}

		// Panel-Block object
		// Use 'new' keyword
		function PanelBlock(details={}) {
			const PB = this;
			PB.remove = remove;

			// <td> element
			const elm = $C('td');
			copyProps(details, elm, ['innerText', 'innerHTML', 'colSpan', 'rowSpan', 'id', 'name', 'className']);
			elm.classList.add('settingpanel-block');

			// Configure object
			PB.element = elm;
			PB.elements = {};
			PB.children = {};
			details.id !== undefined && (PB.elements[details.id] = elm);
			copyProps(details, PB, ['id', 'name']);

			// Append to parent if need
			details.parent instanceof PanelRow && (PB.parent = details.parent.appendBlock(PB));

			// Append child elements if exist
			if (details.children) {
				for (const child of details.children) {
					elm.appendChild(child);
				}
			}

			// Remove itself from parent
			// Returns Panel-Block object
			function remove() {
				PB.parent instanceof PanelRow && PB.parent.removeBlock(PB.parent.blocks.indexOf(PB));
				return PB;
			}
		}

		function $(e) {return document.querySelector(e);}
		function $C(e) {return document.createElement(e);}
		function $R(e) {return $(e) && $(e).parentElement.removeChild($(e));}
		function clearChildNodes(elm) {for (const el of elm.childNodes) {elm.removeChild(el);}}
		function copyProp(obj1, obj2, prop) {obj1[prop] !== undefined && (obj2[prop] = obj1[prop]);}
		function copyProps(obj1, obj2, props) {props.forEach((prop) => (copyProp(obj1, obj2, prop)));}
		function insertItem(arr, item, index) {
			for (let i = arr.length; i > index ; i--) {
				arr[i] = arr[i-1];
			}
			arr[index] = item;
			return arr;
		}
		function removeItem(arr, index) {
			for (let i = index; i < arr.length-1; i++) {
				arr[i] = arr[i+1];
			}
			delete arr[arr.length-1];
			return arr;
		}
		function addStyle(css, id) {
			$R('#'+id);
			const style = $C('style');
			style.innerHTML = css;
			style.id = id;
			document.head.appendChild(style);
			return style
		}
	}

	// Create a left .block operatingArea
	// options = {type: '', ...opts}
	// Supported type: 'mypage', 'toplist'
	function createWenkuBlock(details) {
		// Args
		//title=TEXT_GUI_BLOCK_TITLE_DEFULT, append=false, options
		const title = details.title || TEXT_GUI_BLOCK_TITLE_DEFULT;
		const parent = ({'string': $(details.parent), 'object': details.parent})[typeof details.parent];
		const type = details.type ? details.type.toLowerCase() : null;
		const items = details.items;
		const options = details.options;

		// Standard block
		const stdBlock = makeStandardBlock();
		const block = stdBlock.block;
		const blocktitle = stdBlock.blocktitle;
		const blockcontent = stdBlock.blockcontent;

		blocktitle.innerHTML = title;
		makeContent();
		parent && parent.appendChild(block);

		return block;

		// Create a standard block structure
		function makeStandardBlock() {
			const block = $CrE('div'); block.classList.add('block');
			const blocktitle = $CrE('div'); blocktitle.classList.add('blocktitle');
			const blockcontent = $CrE('div'); blockcontent.classList.add('blockcontent');
			block.appendChild(blocktitle); block.appendChild(blockcontent);
			return {block: block, blocktitle: blocktitle, blockcontent: blockcontent};
		}

		function makeContent() {
			switch (type) {
				case 'mypage': typeMypage(); break;
				case 'toplist': typeToplist(); break;
				case 'imagelist': typeImglist(); break;
				case 'element': typeElement(); break;
				default: DoLog(LogLevel.Error, 'createWenkuBlock: Invalid block type');
			}
		}

		// Links such as https://www.wenku8.net/userdetail.php
		function typeMypage() {
			const ul = $CrE('ul');
			ul.classList.add('ulitem');
			for (const link of details.items) {
				const li = $CrE('li');
				const a = $CrE('a');
				a.href = link.href ? link.href : 'javascript: void(0);';
				link.href && (a.target = '_blank');
				link.tiptitle && settip(a, link.tiptitle);
				a.innerHTML = link.innerHTML;
				a.id = link.id ? link.id : '';
				li.appendChild(a);
				ul.appendChild(li);
			}
			blockcontent.appendChild(ul);
		}

		// Links such as top-books-list inside #right in index page
		// links = [...{href: '', innerHTML: '', tiptitle: '', id: ''}]
		function typeToplist() {
			const ul = $CrE('ul');
			ul.classList.add('ultop');
			for (const link of details.items) {
				const li = $CrE('li');
				const a = $CrE('a');
				a.href = link.href ? link.href : 'javascript: void(0);';
				link.href && (a.target = '_blank');
				link.tiptitle && settip(a, link.tiptitle);
				a.innerHTML = link.innerHTML;
				a.id = link.id ? link.id : '';
				li.appendChild(a);
				ul.appendChild(li);
			}
			blockcontent.appendChild(ul);
		}

		// Links with images like center blocks in index page
		function typeImglist() {
			const container = $CrE('div');
			container.style.height = '155px';

			for (const item of items) {
				const div = $CrE('div');
				div.setAttribute('style', 'float: left;text-align:center;width: 95px; height:155px;overflow:hidden;');

				const a = $CrE('a');
				a.href = item.href;
				a.target = '_blank';
				item.tiptitle && settip(a, item.tiptitle);

				const img = $CrE('img');
				img.src = item.src;
				setAttributes(img, {
					'border': '0',
					'width': '90',
					'height': '127'
				});
				a.appendChild(img);

				const br = $CrE('br');

				const a2 = $CrE('a');
				a2.href = item.href;
				a2.target = '_blank';
				a2.innerHTML = item.text;

				div.appendChild(a);
				div.appendChild(br);
				div.appendChild(a2);
				container.appendChild(div);
			}

			blockcontent.appendChild(container);
		}

		// Just append given elements into block content
		function typeElement() {
			const elms = Array.isArray(items) ? items : [items];
			for (const elm of elms) {
				blockcontent.appendChild(elm);
			}
		}

		// Set attributes to an element
		function setAttributes(elm, attributes) {
			for (const [name, attr] of Object.entries(attributes)) {
				elm.setAttribute(name, attr);
			}
		}
	}

	// Get a review's last page url
	function getLatestReviewPageUrl(rid, callback, args=[]) {
		const reviewUrl = `https://${location.host}/modules/article/reviewshow.php?rid=` + String(rid);
		getDocument(reviewUrl, firstPage, args);

		function firstPage(oDoc, ...args) {
			const url = $(oDoc, '#pagelink>a.last').href;
			args = [url].concat(args);
			callback.apply(null, args);
		};
	};

	// Upload image to KIENG images
	// details: {file: File, onload: Function, onerror: Function, type: 'sm.ms/jd/sg/tt/...'}
	function uploadImage(details) {
		const file    = details.file;
		const onload  = details.onload  ? details.onload  : function() {};
		const onerror = details.onerror ? details.onerror : uploadError;
		const type    = details.type    ? details.type    : CONFIG.UserGlobalCfg.getConfig().imager;
		if (!DATA_IMAGERS.hasOwnProperty(type) || !DATA_IMAGERS[type].available) {
			onerror();
			return false;
		}
		const imager = DATA_IMAGERS[type];
		const upload = imager.upload;
		const request = upload.request;
		const response = upload.response;

		// Construct request url
		let url = request.url;
		if (request.urlargs) {
			const args = request.urlargs;
			const makearg = (key, value) => ('{K}={V}'.replace('{K}', key).replace('{V}', value));
			const replacers = {
				'$filename$': () => (encodeURIComponent(file.name)),
				'$random$': () => (Math.random().toString()),
				'$time$': () => ((new Date()).getTime().toString())
			};
			for (let [key, value] of Object.entries(args)) {
				url += url.includes('?') ? '&' : '?';
				for (const [str, replacer] of Object.entries(replacers)) {
					while (value !== null && value.includes(str)) {
						const val = replacer(key);
						value = (val !== null) ? value.replace(str, val) : null;
					}
				}
				(value !== null) && (url += makearg(key, value));
			}
		}

		// Construst request body
		let data;
		if (request.data) {
			data = new FormData();
			const replacers = {
				'$file$': (key) => ((data.append(key, file), null)),
				'$random$': () => (Math.random().toString()),
				'$time$': () => ((new Date()).getTime().toString())
			};

			for (let [key, value] of Object.entries(request.data)) {
				for (const [str, replacer] of Object.entries(replacers)) {
					while (value !== null && value.includes(str)) {
						const val = replacer(key);
						value = (val !== null) ? value.replace(str, val) : null;
					}
				}
				(value !== null) && data.append(key, value);
			}
		} else {
			data = file;
		}

		// headers
		const headers = request.headers || {};

		GM_xmlhttpRequest({
			method: 'POST',
			url: url,
			timeout: 15 * 1000,
			data: data,
			headers: headers,
			responseType: request.responseType ? request.responseType : 'json',
			onerror: onerror,
			ontimeout: onerror,
			onabort: onerror,
			onload: (e) => {
				const json = e.response;
				const success = e.status === 200 && response.checksuccess(json);
				if (success) {
					const url = response.geturl(json);
					const name = response.getname ? (response.getname(json) ? response.getname(json) : TEXT_ALT_IMAGE_RESPONSE_NONAME) : TEXT_ALT_IMAGE_RESPONSE_NONAME
					onload({
						url: url,
						name: name,
					});
				} else {
					onerror(json);
					return;
				}
			}
		})
		/* Common xhr version. Cannot bypass CORS.
		const re = new XMLHttpRequest();
		re.open('POST', request.url, true);
		re.timeout = 15 * 1000;
		re.onerror = re.ontimeout = re.onabort = uploadError;
		re.responseType = request.responseType ? request.responseType : 'json';
		re.onload = (e) => {
			const json = re.response;
			const success = response.checksuccess(json)
			if (success) {
				onload({
					url: response.geturl(json),
					name: response.getname ? response.getname(json) : TEXT_ALT_IMAGE_RESPONSE_NONAME,
				});
			} else {
				uploadError(json);
				return;
			}
		}
		re.send(data);*/

		function uploadError(json) {
			alertify.error(TEXT_ALT_IMAGE_UPLOAD_ERROR);
			DoLog(LogLevel.Error, [TEXT_ALT_IMAGE_UPLOAD_ERROR, json]);
		}
	}

	// Wait until a variable loaded, and call callback
	function waitUntilLoaded(varnames, callback, args=[]) {
		if (!varnames) {callback.apply(null, args)}
		if (!Array.isArray(varnames)) {varnames = [varnames];}

		const AM = new AsyncManager();
		AM.onfinish = function() {
			callback.apply(null, args);
		};
		for (const varname of varnames) {
			AM.add();
			makeWaitFunc(varname, AM)();
		}
		AM.finishEvent = true;

		function makeWaitFunc(varname, AM) {
			return function wait() {
				if (typeof(getvar(varname)) === 'undefined') {
					setTimeout(wait, NUMBER_ELEMENT_LOADING_WAIT_INTERVAL);
					return false;
				}
				AM.finish();
			};
		}
	}

	// Remove all childnodes from an element
	function clearChildnodes(element) {
		const cns = []
		for (const cn of element.childNodes) {
			cns.push(cn);
		}
		for (const cn of cns) {
			element.removeChild(cn);
		}
	}

	// Change location.href without reloading using history.pushState/replaceState
	function setPageUrl(url, push=false) {
		return history[push ? 'pushState' : 'replaceState']({modified: true, ...history.state}, '', url);
	}

	// Just stopPropagation and preventDefault
	function destroyEvent(e) {
		if (!e) {return false;};
		if (!e instanceof Event) {return false;};
		e.stopPropagation();
		e.preventDefault();
	}

	// eval() function with security check that only allows to get variable values, but don't allow executing js.
	function getvar(varname) {
		const unsafe_chars = ['(', ')', '+', '-', '*', '/', '&', '|', '[', ']', '=', '^', '%', '!', '.', '<', '>', '\\', '"', '\''];
		for (const char of unsafe_chars) {
			if (varname.includes(char)) {throw new Error('Function getvar(varname) called with insecure string "{V}"'.replaceAll('V', varname.replaceAll('"', '\\"')))}
		}

		return eval(varname);
	}

	// GM_XHR HOOK: The number of running GM_XHRs in a time must under maxXHR
	// Returns the abort function to stop the request anyway(no matter it's still waiting, or requesting)
	// (If the request is invalid, such as url === '', will return false and will NOT make this request)
	// If the abort function called on a request that is not running(still waiting or finished), there will be NO onabort event
	// Requires: function delItem(){...} & function uniqueIDMaker(){...}
	function GMXHRHook(maxXHR=5) {
		const GM_XHR = GM_xmlhttpRequest;
		const getID = uniqueIDMaker();
		let todoList = [], ongoingList = [];
		GM_xmlhttpRequest = safeGMxhr;

		function safeGMxhr() {
			// Get an id for this request, arrange a request object for it.
			const id = getID();
			const request = {id: id, args: arguments, aborter: null};

			// Deal onload function first
			dealEndingEvents(request);

			/* DO NOT DO THIS! KEEP ITS ORIGINAL PROPERTIES!
			// Stop invalid requests
			if (!validCheck(request)) {
				return false;
			}
			*/

			// Judge if we could start the request now or later?
			todoList.push(request);
			checkXHR();
			return makeAbortFunc(id);

			// Decrease activeXHRCount while GM_XHR onload;
			function dealEndingEvents(request) {
				const e = request.args[0];

				// onload event
				const oriOnload = e.onload;
				e.onload = function() {
					reqFinish(request.id);
					checkXHR();
					oriOnload ? oriOnload.apply(null, arguments) : function() {};
				}

				// onerror event
				const oriOnerror = e.onerror;
				e.onerror = function() {
					reqFinish(request.id);
					checkXHR();
					oriOnerror ? oriOnerror.apply(null, arguments) : function() {};
				}

				// ontimeout event
				const oriOntimeout = e.ontimeout;
				e.ontimeout = function() {
					reqFinish(request.id);
					checkXHR();
					oriOntimeout ? oriOntimeout.apply(null, arguments) : function() {};
				}

				// onabort event
				const oriOnabort = e.onabort;
				e.onabort = function() {
					reqFinish(request.id);
					checkXHR();
					oriOnabort ? oriOnabort.apply(null, arguments) : function() {};
				}
			}

			// Check if the request is invalid
			function validCheck(request) {
				const e = request.args[0];

				if (!e.url) {
					return false;
				}

				return true;
			}

			// Call a XHR from todoList and push the request object to ongoingList if called
			function checkXHR() {
				if (ongoingList.length >= maxXHR) {return false;};
				if (todoList.length === 0) {return false;};
				const req = todoList.shift();
				const reqArgs = req.args;
				const aborter = GM_XHR.apply(null, reqArgs);
				req.aborter = aborter;
				ongoingList.push(req);
				return req;
			}

			// Make a function that aborts a certain request
			function makeAbortFunc(id) {
				return function() {
					let i;

					// Check if the request haven't been called
					for (i = 0; i < todoList.length; i++) {
						const req = todoList[i];
						if (req.id === id) {
							// found this request: haven't been called
							delItem(todoList, i);
							return true;
						}
					}

					// Check if the request is running now
					for (i = 0; i < ongoingList.length; i++) {
						const req = todoList[i];
						if (req.id === id) {
							// found this request: running now
							req.aborter();
							reqFinish(id);
							checkXHR();
						}
					}

					// Oh no, this request is already finished...
					return false;
				}
			}

			// Remove a certain request from ongoingList
			function reqFinish(id) {
				let i;
				for (i = 0; i < ongoingList.length; i++) {
					const req = ongoingList[i];
					if (req.id === id) {
						ongoingList = delItem(ongoingList, i);
						return true;
					}
				}
				return false;
			}
		}
	}

	// Redirect GM_storage API
	// Each key points to a different storage area
	// Original GM_functions will be backuped in window object
	// PS: No worry for GM_functions leaking, because Tempermonkey's Sandboxing
	function redirectGMStorage(key) {
		// Recover if redirected before
		GM_setValue    = typeof(window.setValue)    === 'function' ? window.setValue    : GM_setValue;
		GM_getValue    = typeof(window.getValue)    === 'function' ? window.getValue    : GM_getValue;
		GM_listValues  = typeof(window.listValues)  === 'function' ? window.listValues  : GM_listValues;
		GM_deleteValue = typeof(window.deleteValue) === 'function' ? window.deleteValue : GM_deleteValue;

		// Stop if no key
		if (!key) {return;};

		// Save original GM_functions
		window.setValue    = typeof(GM_setValue)    === 'function' ? GM_setValue    : function() {};
		window.getValue    = typeof(GM_getValue)    === 'function' ? GM_getValue    : function() {};
		window.listValues  = typeof(GM_listValues)  === 'function' ? GM_listValues  : function() {};
		window.deleteValue = typeof(GM_deleteValue) === 'function' ? GM_deleteValue : function() {};

		// Redirect GM_functions
		typeof(GM_setValue)    === 'function' ? GM_setValue    = RD_GM_setValue    : function() {};
		typeof(GM_getValue)    === 'function' ? GM_getValue    = RD_GM_getValue    : function() {};
		typeof(GM_listValues)  === 'function' ? GM_listValues  = RD_GM_listValues  : function() {};
		typeof(GM_deleteValue) === 'function' ? GM_deleteValue = RD_GM_deleteValue : function() {};

		// Get global storage
		//const storage = getStorage();

		function getStorage() {
			return window.getValue(key, {});
		}

		function saveStorage(storage) {
			return window.setValue(key, storage);
		}

		function RD_GM_setValue(key, value) {
			const storage = getStorage();
			storage[key] = value;
			saveStorage(storage);
		}

		function RD_GM_getValue(key, defaultValue) {
			const storage = getStorage();
			return storage[key] || defaultValue;
		}

		function RD_GM_listValues() {
			const storage = getStorage();
			return Object.keys(storage);
		}

		function RD_GM_deleteValue(key) {
			const storage = getStorage();
			delete storage[key];
			saveStorage(storage);
		}
	}

	// Aim to separate big data from config, to boost up the speed of config reading.
	// FAILED. NEVER USE THESE CODES. NEVER DO THESE THINGS AGAIN. FUCK MYSELF ME STUPID.
	// NOOOOOOOO!!!!!!! WHY ARE YOU DICKHEAD STILL THINGKING ABOUT THIS SHIT??????? NEVER EVER THINK ABOUT THIS FUCKING UNACHIEVABLE FUNCTION AGAIN!!!!!!
	// See https://www.wenku8.net/modules/article/reviewshow.php?rid=244568&aid=1973&page=202#yid930393 if you still want to try, you'll pay for that.
	function GMBigData(maxsize=1024) {
		const BD = this;
		BD.maxsize = maxsize;
		BD.keyPrefix = 'GM_BIGDATA:' + btoa(encodeURIComponent(GM_info.script.name + (GM_info.script.namespace || '')));

		BD.hook = function() {
			hookget();
			hookset();
		}

		BD.unhook = function() {
			if (!BD.GM_getValue || !BD.GM_setValue) {
				throw TypeError('GMBigData: BD.GM_getValue or BD.GM_setValue missing');
			}
			GM_getValue = BD.GM_getValue;
			GM_setValue = BD.GM_setValue;
		}

		function hookget() {
			const oGet = BD.GM_getValue = GM_getValue;
			GM_getValue = function(name, defaultValue) {
				return decodeValue(oGet(name, defaultValue));
			}

			function decodeValue(value) {
				return (({
					'string': decodeString,
					'object': value !== null ? decodeObject : null
				})[typeof value] || ((v) => (v)))(value);

				function decodeString(str) {
					return (isDatakey(str) && keyExists(str)) ? localStorage.getItem(str) : str;
				}

				function decodeObject(obj) {
					return new Proxy(obj, {
						get: function(target, property, receiver) {
							return decodeValue(target[property]);
						}
					});
				}
			}
		}

		function hookset() {
			const oSet = BD.GM_setValue = GM_setValue;
			GM_setValue = function(name, value) {
				const encoded = encodeValue(value);
				clearUnusedBigData(encoded);
				return oSet(name, encoded);
			}

			function encodeValue(value) {
				return (({
					'string': encodeString,
					'object': value !== null ? encodeObject : value
				})[typeof value] || ((v) => (v)))(value);

				function encodeString(str) {
					if (getDataSize(str) <= BD.maxsize) {
						return str;
					} else {
						const key = generateKey();
						localStorage.setItem(key, str);
						return key;
					}
				}

				function encodeObject(obj) {
					return new Proxy(obj, {
						get: function(target, property, receiver) {
							return encodeValue(target[property]);
						}
					});
				}
			}

			function clearUnusedBigData(data) {
				const usingKeys = getAllUsingKeys(data);
				for (const key of Object.keys(localStorage)) {
					if (isDatakey(key) && !usingKeys.includes(key)) {
						localStorage.removeItem(key);
					}
				}

				function getAllUsingKeys(data) {
					const usingKeys = [];
					(({
						'string': checkString,
						'object': data !== null ? getAllUsingKeys : null
					})[typeof data] || function() {})();
					return usingKeys;

					function checkString(str) {
						isDatakey(str) && keyExists(str) && usingKeys.push(str);
					}
				}
			}
		}

		// Datakey generator
		function generateKey(length=16) {
			let datakey = newKey();
			while (keyExists(datakey)) {
				datakey = newKey();
			}
			return datakey;

			function newKey() {
				return BD.keyPrefix + ',' + randstr(length);
			}
		}

		// Check whether a datakey already exists
		function keyExists(datakey) {
			return Object.keys(localStorage).includes(datakey);
		}

		// Check whether the value is a datakey
		function isDatakey(value) {
			return typeof value === 'string' && value.startsWith(BD.keyPrefix);
		}

		// Get the size of data
		function getDataSize(data) {
			return (new Blob([data])).size;
		}
	}

    // Download and parse a url page into a html document(dom).
    // when xhr onload: callback.apply([dom, args])
    function getDocument(url, callback, args=[]) {
        GM_xmlhttpRequest({
            method       : 'GET',
            url          : url,
            responseType : 'blob',
			timeout      : 15 * 1000,
			onloadstart  : function() {
				DoLog(LogLevel.Info, 'getting document, url=\'' + url + '\'');
			},
            onload       : function(response) {
                const htmlblob = response.response;
				parseDocument(htmlblob, callback, args);
            },
			onerror      : reqerror,
			ontimeout    : reqerror
        });

		function reqerror(e) {
			DoLog(LogLevel.Error, 'getDocument: Request Error');
			DoLog(LogLevel.Error, e);
			throw new Error('getDocument: Request Error')
		}
    }

	function parseDocument(htmlblob, callback, args=[]) {
		const reader = new FileReader();
		reader.onload = function(e) {
			const htmlText = reader.result;
			const dom = new DOMParser().parseFromString(htmlText, 'text/html');
			args = [dom].concat(args);
			callback.apply(null, args);
			//callback(dom, htmlText);
		}
		const charset = ['GBK', 'BIG5'][getLang()];
		reader.readAsText(htmlblob, charset);
	}

	// Get a base64-formatted url of an image
	// When image load error occurs, callback will be called without any argument
	function getImageUrl(src, fitx, fity, callback, args=[]) {
		const image = new Image();
		image.setAttribute("crossOrigin",'anonymous');
		image.onload = convert;
		image.onerror = image.onabort = callback;
		image.src = src;

		function convert() {
			const cvs = $CrE('canvas');
			const ctx = cvs.getContext('2d');

			let width, height;
			if (fitx && fity) {
				width = window.innerWidth;
				height = window.innerHeight;
			} else if (fitx) {
				width = window.innerWidth;
				height = (width / image.width) * image.height;
			} else if (fity) {
				height = window.innerHeight;
				width = (height / image.height) * image.width;
			} else {
				width = image.width;
				height = image.height;
			}
			cvs.width = width;
			cvs.height = height;
			ctx.drawImage(image, 0, 0, width, height);
			try {
				callback.apply(null, [cvs.toDataURL()].concat(args));
			} catch (e) {
				DoLog(LogLevel.Error, ['Error at getImageUrl.convert()', e]);
				callback();
			}
		}
	}

	// Convert a 'data:image/jpeg;base64,57af8b....' to a Blob object
	function b64toBlob(dataURI) {
		const mime = dataURI.match(/data:(.+?);/)[1];
		const byteString = atob(dataURI.split(',')[1]);
		const ab = new ArrayBuffer(byteString.length);
		const ia = new Uint8Array(ab);

		for (let i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ab], {type: mime});
	}

	//将base64转换为文件
	function dataURLtoFile(dataurl, filename) {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, {
			type: mime
		});
	}

	// Save dataURL to file
	function saveFile(dataURL, filename) {
		const a = $CrE('a');
		a.href = dataURL;
		a.download = filename;
		a.click();
	}

	// File download function
	// details looks like the detail of GM_xmlhttpRequest
	// onload function will be called after file saved to disk
	function downloadFile(details) {
		if (!details.url || !details.name) {return false;};

		// Configure request object
		const requestObj = {
			url: details.url,
			responseType: 'blob',
			onload: function(e) {
				// Save file
				const url = URL.createObjectURL(e.response);
				saveFile(URL.createObjectURL(e.response), details.name);
				URL.revokeObjectURL(url);

				// onload callback
				details.onload ? details.onload(e) : function() {};
			}
		}
		if (details.onloadstart       ) {requestObj.onloadstart        = details.onloadstart;};
		if (details.onprogress        ) {requestObj.onprogress         = details.onprogress;};
		if (details.onerror           ) {requestObj.onerror            = details.onerror;};
		if (details.onabort           ) {requestObj.onabort            = details.onabort;};
		if (details.onreadystatechange) {requestObj.onreadystatechange = details.onreadystatechange;};
		if (details.ontimeout         ) {requestObj.ontimeout          = details.ontimeout;};

		// Send request
		GM_xmlhttpRequest(requestObj);
	}

	// Save text to textfile
	function downloadText(text, name) {
		if (!text || !name) {return false;};

		// Get blob url
		const blob = new Blob([text],{type:"text/plain;charset=utf-8"});
		const url = URL.createObjectURL(blob);

		// Create <a> and download
		const a = $CrE('a');
		a.href = url;
		a.download = name;
		a.click();
	}

	function requestText(url, callback, args=[]) {
		GM_xmlhttpRequest({
            method:       'GET',
            url:          url,
            responseType: 'text',
            onload:       function(response) {
                const text = response.responseText;
				const argvs = [text].concat(args);
                callback.apply(null, argvs);
            }
        })
	}

	// Get a url argument from lacation.href
	// also recieve a function to deal the matched string
	// returns defaultValue if name not found
    // Args: {url=location.href, name, dealFunc=((a)=>{return a;}), defaultValue=null} or 'name'
	function getUrlArgv(details) {
        typeof(details) === 'string'    && (details = {name: details});
        typeof(details) === 'undefined' && (details = {});
        if (!details.name) {return null;};

        const url = details.url ? details.url : location.href;
        const name = details.name ? details.name : '';
        const dealFunc = details.dealFunc ? details.dealFunc : ((a)=>{return a;});
        const defaultValue = details.defaultValue ? details.defaultValue : null;
		const matcher = new RegExp('[\\?&]' + name + '=([^&#]+)');
		const result = url.match(matcher);
		const argv = result ? dealFunc(result[1]) : defaultValue;

		return argv;
	}

	// Get language: 0 for simplyfied chinese and others, 1 for traditional chinese
	function getLang() {
		const match = document.cookie.match(/(; *)?jieqiUserCharset=(.+?)( *;|$)/);
		const nvgtLang = ({'zh-CN': 0, 'zh-TW': 1})[navigator.language] || 0;
		return match && match[2] ? (match[2].toLowerCase() === 'big5' ? 1 : 0) : nvgtLang;
	}

    // Get a time text like 1970-01-01 00:00:00
	// if dateSpliter provided false, there will be no date part. The same for timeSpliter.
    function getTime(dateSpliter='-', timeSpliter=':') {
        const d = new Date();
		let fulltime = ''
		fulltime += dateSpliter ? fillNumber(d.getFullYear(), 4) + dateSpliter + fillNumber((d.getMonth() + 1), 2) + dateSpliter + fillNumber(d.getDate(), 2) : '';
		fulltime += dateSpliter && timeSpliter ? ' ' : '';
		fulltime += timeSpliter ? fillNumber(d.getHours(), 2) + timeSpliter + fillNumber(d.getMinutes(), 2) + timeSpliter + fillNumber(d.getSeconds(), 2) : '';
        return fulltime;
    }

	// Get key-value object from text like 'key: value'/'key：value'/' key   :  value   '
	// returns: {key: value, KEY: key, VALUE: value}
	function getKeyValue(text, delimiters=[':', '：', ',', '︰']) {
		// Modify from https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error#examples
		// Create a new object, that prototypally inherits from the Error constructor.
		function SplitError(message) {
			this.name = 'SplitError';
			this.message = message || 'SplitError Message';
			this.stack = (new Error()).stack;
		}
		SplitError.prototype = Object.create(Error.prototype);
		SplitError.prototype.constructor = SplitError;

		if (!text) {return [];};

		const result = {};
		let key, value;
		for (let i = 0; i < text.length; i++) {
			const char = text.charAt(i);
			for (const delimiter of delimiters) {
				if (delimiter === char) {
					if (!key && !value) {
						key = text.substr(0, i).trim();
						value = text.substr(i+1).trim();
						result[key] = value;
						result.KEY = key;
						result.VALUE = value;
					} else {
						throw new SplitError('Mutiple Delimiter in Text');
					}
				}
			}
		}

		return result;
	}

	function htmlEncode(text) {
		const span = $CrE('div');
		span.innerText = text;
		return span.innerHTML;
	}

	// Convert rgb color(e.g. 51,51,153) to hex color(e.g. '333399')
	function rgbToHex(r, g, b) {return fillNumber(((r << 16) | (g << 8) | b).toString(16), 6);}

    // Fill number text to certain length with '0'
    function fillNumber(number, length) {
        let str = String(number);
        for (let i = str.length; i < length; i++) {
            str = '0' + str;
        }
        return str;
    }

    // Judge whether the str is a number
    function isNumeric(str, disableFloat=false) {
        const result = Number(str);
        return !isNaN(result) && str !== '' && (!disableFloat || result===Math.floor(result));
    }

	// Del a item from an array using its index. Returns the array but can NOT modify the original array directly!!
	function delItem(arr, delIndex) {
		arr = arr.slice(0, delIndex).concat(arr.slice(delIndex+1));
		return arr;
	}

	// Clone(deep) an object variable
	// Returns the new object
	function deepclone(obj) {
		if (obj === null) return null;
		if (typeof(obj) !== 'object') return obj;
		if (obj.constructor === Date) return new Date(obj);
		if (obj.constructor === RegExp) return new RegExp(obj);
		var newObj = new obj.constructor(); //保持继承的原型
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				const val = obj[key];
				newObj[key] = typeof val === 'object' ? deepclone(val) : val;
			}
		}
		return newObj;
	}

	// Makes a function that returns a unique ID number each time
	function uniqueIDMaker() {
		let id = 0;
		return makeID;
		function makeID() {
			id++;
			return id;
		}
	}

	// Returns a random string
	function randstr(length=16, cases=true, aviod=[]) {
		const all = 'abcdefghijklmnopqrstuvwxyz0123456789' + (cases ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '');
		while (true) {
			let str = '';
			for (let i = 0; i < length; i++) {
				str += all.charAt(randint(0, all.length-1));
			}
			if (!aviod.includes(str)) {return str;};
		}
	}

	function randint(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function AsyncManager() {
		const AM = this;

		// Ongoing xhr count
		this.taskCount = 0;

		// Whether generate finish events
		let finishEvent = false;
		Object.defineProperty(this, 'finishEvent', {
			configurable: true,
			enumerable: true,
			get: () => (finishEvent),
			set: (b) => {
				finishEvent = b;
				b && AM.taskCount === 0 && AM.onfinish && AM.onfinish();
			}
		});

		// Add one task
		this.add = () => (++AM.taskCount);

		// Finish one task
		this.finish = () => ((--AM.taskCount === 0 && AM.finishEvent && AM.onfinish && AM.onfinish(), AM.taskCount));
	}

	function loadinResourceCSS() {
		for (const res of NMonkey_Info.resources) {
			if (res.isCss) {
				const css = GM_getResourceText(res.name);
				css && addStyle(css);
			}
		}
	}

	function loadinFontAwesome() {
		// https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.1.1/css/all.min.css
		const url = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css';
		const alts = [
			'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.1.1/css/all.min.css',
			'https://bowercdn.net/c/fontAwesome-6.1.1/css/all.min.css',
		];
		let i = -1;

		const link = $CrE('link');
		link.href = url;
		link.rel = 'stylesheet';
		link.onerror = function() {
			i++;
			if (i < alts.length) {
				link.href = alts[i];
			} else {
				alertify.error(TEXT_ALT_SCRIPT_ERROR_AJAX_FA);
			}
		}

		document.head.appendChild(link);
	}

    // NMonkey By PY-DNG, 2021.07.18 - 2022.02.18, License GPL-3
	// NMonkey: Provides GM_Polyfills and make your userscript compatible with non-script-manager environment
	// Description:
	/*
	    Simulates a script-manager environment("NMonkey Environment") for non-script-manager browser, load @require & @resource, provides some GM_functions(listed below), and also compatible with script-manager environment.
	    Provides GM_setValue, GM_getValue, GM_deleteValue, GM_listValues, GM_xmlhttpRequest, GM_openInTab, GM_setClipboard, GM_getResourceText, GM_getResourceURL, GM_addStyle, GM_addElement, GM_log, unsafeWindow(object), GM_info(object)
	    Also provides an object called GM_POLYFILLED which has the following properties that shows you which GM_functions are actually polyfilled.
	    Returns true if polyfilled is environment is ready, false for not. Don't worry, just follow the usage below.
	*/
	// Note: DO NOT DEFINE GM-FUNCTION-NAMES IN YOUR CODE. DO NOT DEFINE GM_POLYFILLED AS WELL.
	// Note: NMonkey is an advanced version of GM_PolyFill (and BypassXB), it includes more functions than GM_PolyFill, and provides better stability and compatibility. Do NOT use NMonkey and GM_PolyFill (and BypassXB) together in one script.
	// Usage:
	/*
		// ==UserScript==
		// @name      xxx
		// @namespace xxx
		// @version   1.0
		// ...
		// @require   https://.../xxx.js
		// @require   ...
		// ...
		// @resource  https://.../xxx
		// @resource  ...
		// ...
		// ==/UserScript==

		// Use a closure to wrap your code. Make sure you have it a name.
		(function YOUR_MAIN_FUNCTION() {
			'use strict';
			// Strict mode is optional. You can use strict mode or not as you want.
			// Polyfill first. Do NOT do anything before Polyfill.
			var NMonkey_Ready = NMonkey({
				mainFunc: YOUR_MAIN_FUNCTION,
				name: "script-storage-key, aims to separate different scripts' storage area. Use your script's @namespace value if you don't how to fill this field.",
				requires: [
					{
						name: "", // Optional, used to display loading error messages if anything went wrong while loading this item
						src: "https://.../xxx.js",
						loaded: function() {return boolean_value_shows_whether_this_js_has_already_loaded;}
						execmode: "'eval' for eval code in current scope or 'function' for Function(code)() in global scope or 'script' for inserting a <script> element to document.head"
					},
					...
				],
				resources: [
					{
						src: "https://.../xxx"
						name: "@resource name. Will try to get it from @resource using this name before fetch it from src",
					},
					...
				],
				GM_info: {
					// You can get GM_info object, if you provide this argument(and there is no GM_info provided by the script-manager).
					// You can provide any object here, what you provide will be what you get.
					// Additionally, two property of NMonkey itself will be attached to GM_info if polyfilled:
					// {
					//     scriptHandler: "NMonkey"
					//     version: "NMonkey's version, it should look like '0.1'"
					// }
					// The following is just an example.
					script: {
						name: 'my first userscript for non-scriptmanager browsers!',
						description: 'this script works well both in my PC and my mobile!',
						version: '1.0',
						released: true,
						version_num: 1,
						authors: ['Johnson', 'Leecy', 'War Mars']
						update_history: {
							'0.9': 'First beta version',
							'1.0': 'Finally released!'
						}
					}
					surprise: 'if you check GM_info.surprise and you will read this!'
					// And property "scriptHandler" & "version" will be attached here
				}
			});
			if (!NMonkey_Ready) {
				// Stop executing of polyfilled environment not ready.
				// Don't worry, during polyfill progress YOUR_MAIN_FUNCTION will be called twice, and on the second call the polyfilled environment will be ready.
				return;
			}

			// Your code here...
			// Make sure your code is written after NMonkey be called
			if
			// ...

			// Just place NMonkey function code here
			function NMonkey(details) {
				...
			}
		}) ();

		// Oh you want to write something here? Fine. But code you write here cannot get into the simulated script-manager-environment.
	*/
	function NMonkey(details) {
		// Constances
		const CONST = {
			Text: {
				Require_Load_Failed: '动态加载依赖js库失败（自动重试也都失败了），请刷新页面后再试:(\n一共尝试了{I}个备用加载源\n加载项目：{N}',
				Resource_Load_Failed: '动态加载依赖resource资源失败（自动重试也都失败了），请刷新页面后再试:(\n一共尝试了{I}个备用加载源\n加载项目：{N}',
				UnkownItem: '未知项目',
			}
		};

		// Init DoLog
		DoLog();

		// Get argument
		const mainFunc = details.mainFunc;
		const name = details.name || 'default';
		const requires = details.requires || [];
		const resources = details.resources || [];
		details.GM_info = details.GM_info || {};
		details.GM_info.scriptHandler = 'NMonkey';
		details.GM_info.version = '1.0';

		// Run in variable-name-polifilled environment
		if (InNPEnvironment()) {
			// Already in polifilled environment === polyfill has alredy done, just return
			return true;
		}

		// Polyfill functions and data
		const GM_POLYFILL_KEY_STORAGE = 'GM_STORAGE_POLYFILL';
		let GM_POLYFILL_storage;
		const Supports = {
			GetStorage: function() {
				let gstorage = localStorage.getItem(GM_POLYFILL_KEY_STORAGE);
				gstorage = gstorage ? JSON.parse(gstorage) : {};
				let storage = gstorage[name] ? gstorage[name] : {};
				return storage;
			},

			SaveStorage: function() {
				let gstorage = localStorage.getItem(GM_POLYFILL_KEY_STORAGE);
				gstorage = gstorage ? JSON.parse(gstorage) : {};
				gstorage[name] = GM_POLYFILL_storage;
				localStorage.setItem(GM_POLYFILL_KEY_STORAGE, JSON.stringify(gstorage));
			},
		};
		const Provides = {
			// GM_setValue
			GM_setValue: function(name, value) {
				GM_POLYFILL_storage = Supports.GetStorage();
				name = String(name);
				GM_POLYFILL_storage[name] = value;
				Supports.SaveStorage();
			},

			// GM_getValue
			GM_getValue: function(name, defaultValue) {
				GM_POLYFILL_storage = Supports.GetStorage();
				name = String(name);
				if (GM_POLYFILL_storage.hasOwnProperty(name)) {
					return GM_POLYFILL_storage[name];
				} else {
					return defaultValue;
				}
			},

			// GM_deleteValue
			GM_deleteValue: function(name) {
				GM_POLYFILL_storage = Supports.GetStorage();
				name = String(name);
				if (GM_POLYFILL_storage.hasOwnProperty(name)) {
					delete GM_POLYFILL_storage[name];
					Supports.SaveStorage();
				}
			},

			// GM_listValues
			GM_listValues: function() {
				GM_POLYFILL_storage = Supports.GetStorage();
				return Object.keys(GM_POLYFILL_storage);
			},

			// unsafeWindow
			unsafeWindow: window,

			// GM_xmlhttpRequest
			// not supported properties of details: synchronous binary nocache revalidate context fetch
			// not supported properties of response(onload arguments[0]): finalUrl
			// ---!IMPORTANT!--- DOES NOT SUPPORT CROSS-ORIGIN REQUESTS!!!!! ---!IMPORTANT!---
			// details.synchronous is not supported as Tampermonkey
			GM_xmlhttpRequest: function(details) {
				const xhr = new XMLHttpRequest();

				// open request
				const openArgs = [details.method, details.url, true];
				if (details.user && details.password) {
					openArgs.push(details.user);
					openArgs.push(details.password);
				}
				xhr.open.apply(xhr, openArgs);

				// set headers
				if (details.headers) {
					for (const key of Object.keys(details.headers)) {
						xhr.setRequestHeader(key, details.headers[key]);
					}
				}
				details.cookie ? xhr.setRequestHeader('cookie', details.cookie) : function () {};
				details.anonymous ? xhr.setRequestHeader('cookie', '') : function () {};

				// properties
				xhr.timeout = details.timeout;
				xhr.responseType = details.responseType;
				details.overrideMimeType ? xhr.overrideMimeType(details.overrideMimeType) : function () {};

				// events
				xhr.onabort = details.onabort;
				xhr.onerror = details.onerror;
				xhr.onloadstart = details.onloadstart;
				xhr.onprogress = details.onprogress;
				xhr.onreadystatechange = details.onreadystatechange;
				xhr.ontimeout = details.ontimeout;
				xhr.onload = function (e) {
					const response = {
						readyState: xhr.readyState,
						status: xhr.status,
						statusText: xhr.statusText,
						responseHeaders: xhr.getAllResponseHeaders(),
						response: xhr.response
					};
					(details.responseType === '' || details.responseType === 'text') ? (response.responseText = xhr.responseText) : function () {};
					(details.responseType === '' || details.responseType === 'document') ? (response.responseXML = xhr.responseXML) : function () {};
					details.onload(response);
				}

				// send request
				details.data ? xhr.send(details.data) : xhr.send();

				return {
					abort: xhr.abort
				};
			},

			// NOTE: options(arg2) is NOT SUPPORTED! if provided, then will just be skipped.
			GM_openInTab: function(url) {
				window.open(url);
			},

			// NOTE: needs to be called in an event handler function, and info(arg2) is NOT SUPPORTED!
			GM_setClipboard: function(text) {
				// Create a new textarea for copying
				const newInput = document.createElement('textarea');
				document.body.appendChild(newInput);
				newInput.value = text;
				newInput.select();
				document.execCommand('copy');
				document.body.removeChild(newInput);
			},

			GM_getResourceText: function(name) {
				const _get = typeof(GM_getResourceText) === 'function' ? GM_getResourceText : () => (null);
				let text = _get(name);
				if (text) {return text;}
				for (const resource of resources) {
					if (resource.name === name) {
						return resource.content ? resource.content : null;
					}
				}
				return null;
			},

			GM_getResourceURL: function(name) {
				const _get = typeof(GM_getResourceURL) === 'function' ? GM_getResourceURL : () => (null);
				let url = _get(name);
				if (url) {return url;}
				for (const resource of resources) {
					if (resource.name === name) {
						return resource.src ? btoa(resource.src) : null;
					}
				}
				return null;
			},

			GM_addStyle: function(css) {
				const style = document.createElement('style');
				style.innerHTML = css;
				document.head.appendChild(style);
			},

			GM_addElement: function() {
				let parent_node, tag_name, attributes;
				const head_elements = ['title', 'base', 'link', 'style', 'meta', 'script', 'noscript'/*, 'template'*/];
				if (arguments.length === 2) {
					tag_name = arguments[0];
					attributes = arguments[1];
					parent_node = head_elements.includes(tag_name.toLowerCase()) ? document.head : document.body;
				} else if (arguments.length === 3) {
					parent_node = arguments[0];
					tag_name = arguments[1];
					attributes = arguments[2];
				}
				const element = document.createElement(tag_name);
				for (const [prop, value] of Object.entries(attributes)) {
					element[prop] = value;
				}
				parent_node.appendChild(element);
			},

			GM_log: function() {
				const args = [];
				for (let i = 0; i < arguments.length; i++) {
					args[i] = arguments[i];
				}
				console.log.apply(null, args);
			},

			GM_info: details.GM_info,

			GM: {info: details.GM_info}
		};
		const _GM_POLYFILLED = Provides.GM_POLYFILLED = {};
		for (const pname of Object.keys(Provides)) {
			_GM_POLYFILLED[pname] = true;
		}

		// Not in polifilled environment, then polyfill functions and create & move into the environment
		// Bypass xbrowser's useless GM_functions
		bypassXB();

		// Create & move into polifilled environment
		ExecInNPEnv();

		return false;

		// Bypass xbrowser's useless GM_functions
		function bypassXB() {
			if (typeof(mbrowser) === 'object' || (typeof(GM_info) === 'object' && GM_info.scriptHandler === 'XMonkey')) {
				// Useless functions in XMonkey 1.0
				const GM_funcs = [
					'unsafeWindow',
					'GM_getValue',
					'GM_setValue',
					'GM_listValues',
					'GM_deleteValue',
					//'GM_xmlhttpRequest',
				];
				for (const GM_func of GM_funcs) {
					window[GM_func] = undefined;
					eval('typeof({F}) === "function" && ({F} = Provides.{F});'.replaceAll('{F}', GM_func));
				}
				// Delete dirty data saved by these stupid functions before
				for (let i = 0; i < localStorage.length; i++) {
					const key = localStorage.key(i);
					const value = localStorage.getItem(key);
					value === '[object Object]' && localStorage.removeItem(key);
				}
			}
		}

		// Check if already in name-predefined environment
		// I think there won't be anyone else wants to use this fxxking variable name...
		function InNPEnvironment() {
			return (typeof(GM_POLYFILLED) === 'object' && GM_POLYFILLED !== null && GM_POLYFILLED !== window.GM_POLYFILLED) ? true : false;
		}

		function ExecInNPEnv() {
			const NG = new NameGenerator();

			// Init names
			const tnames = ['context', 'fapply', 'CDATA', 'uneval', 'define', 'module', 'exports', 'window', 'globalThis', 'console', 'cloneInto', 'exportFunction', 'createObjectIn', 'GM', 'GM_info'];
			const pnames = Object.keys(Provides);
			const fnames = tnames.slice();
			const argvlist = [];
			const argvs = [];

			// Add provides
			for (const pname of pnames) {
				!fnames.includes(pname) && fnames.push(pname);
			}

			// Add grants
			if (typeof(GM_info) === 'object' && GM_info.script && GM_info.script.grant) {
				for (const gname of GM_info.script.grant) {
					!fnames.includes(gname) && fnames.push(gname);
				}
			}

			// Make name code
			for (let i = 0; i < fnames.length; i++) {
				const fname = fnames[i];
				const exist = eval('typeof ' + fname + ' !== "undefined"') && fname !== 'GM_POLYFILLED';
				argvlist[i] = exist ? fname : (Provides.hasOwnProperty(fname) ? 'Provides.'+fname : '');
				argvs[i] = exist ? eval(fname) : (Provides.hasOwnProperty(fname) ? Provides[name] : undefined);
				pnames.includes(fname) && (_GM_POLYFILLED[fname] = !exist);
			}

			// Load all @require and @resource
			loadRequires(requires, resources, function(requires, resources) {
				// Join requirecode
				let requirecode = '';
				for (const require of requires) {
					const mode = require.execmode ? require.execmode : 'eval';
					const content = require.content;
					if (!content) {continue;}
					switch(mode) {
						case 'eval':
							requirecode += content + '\n';
							break;
						case 'function': {
							const func = Function.apply(null, fnames.concat(content));
							func.apply(null, argvs);
							break;
						}
						case 'script': {
							const s = document.createElement('script');
							s.innerHTML = content;
							document.head.appendChild(s);
							break;
						}
					}
				}

				// Make final code & eval
				const varnames = ['NG', 'tnames', 'pnames', 'fnames', 'argvist', 'argvs', 'code', 'finalcode', 'wrapper', 'ExecInNPEnv', 'GM_POLYFILL_KEY_STORAGE', 'GM_POLYFILL_storage', 'InNPEnvironment', 'NameGenerator', 'LocalCDN', 'loadRequires', 'requestText', 'Provides', 'Supports', 'bypassXB', 'details', 'mainFunc', 'name', 'requires', 'resources', '_GM_POLYFILLED', 'CONST', 'NMonkey', 'polyfill_status'];
				const code = requirecode + 'let ' + varnames.join(', ') + ';\n(' + mainFunc.toString() + ') ();';
				const wrapper = Function.apply(null, fnames.concat(code));
				const finalcode = '(' + wrapper.toString() + ').apply(this, [' + argvlist.join(', ') + ']);';
				eval(finalcode);
			});

			function NameGenerator() {
				const NG = this;
				const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
				let index = [0];

				NG.generate = function() {
					const chars = [];
					indexIncrease();
					for (let i = 0; i < index.length; i++) {
						chars[i] = letters.charAt(index[i]);
					}
					return chars.join('');
				}

				NG.randtext = function(len=32) {
					const chars = [];
					for (let i = 0; i < len; i++) {
						chars[i] = letters[randint(0, letter.length-1)];
					}
					return chars.join('');
				}

				function indexIncrease(i=0) {
					index[i] === undefined && (index[i] = -1);
					++index[i] >= letters.length && (index[i] = 0, indexIncrease(i+1));
				}

				function randint(min, max) {
					return Math.floor(Math.random() * (max - min + 1)) + min;
				}
			}
		}

		// Load all @require and @resource for non-GM/TM environments (such as Alook javascript extension)
		// Requirements: function AsyncManager(){...}, function LocalCDN(){...}
		function loadRequires(requires, resoures, callback, args=[]) {
			// LocalCDN
			const LCDN = new LocalCDN();

			// AsyncManager
			const AM = new AsyncManager();
			AM.onfinish = function() {
				callback.apply(null, [requires, resoures].concat(args));
			}

			// Load js
			for (const js of requires) {
				!js.loaded() && loadinJs(js);
			}

			// Load resource
			for (const resource of resoures) {
				loadinResource(resource);
			}

			AM.finishEvent = true;

			function loadinJs(js) {
				AM.add();

				const srclist = js.srcset ? LCDN.sort(js.srcset).srclist : [];
				let i = -1;
				LCDN.get(js.src, onload, [], onfail);

				function onload(content) {
					js.content = content;
					AM.finish();
				}

				function onfail() {
					i++;
					if (i < srclist.length) {
						LCDN.get(srclist[i], onload, [], onfail);
					} else {
						alert(CONST.Text.Require_Load_Failed.replace('{I}', i.toString()).replace('{N}', js.name ? js.name : CONST.Text.UnkownItem));
					}
				}
			}

			function loadinResource(resource) {
				let content;
				if (typeof GM_getResourceText === 'function' && (content = GM_getResourceText(resource.name))) {
					resource.content = content;
				} else {
					AM.add();

					let i = -1;
					LCDN.get(resource.src, onload, [], onfail);

					function onload(content) {
						resource.content = content;
						AM.finish();
					}

					function onfail(content) {
						i++;
						if (resource.srcset && i < resource.srcset.length) {
							LCDN.get(resource.srcset[i], onload, [], onfail);
						} else {
							debugger;
							alert(CONST.Text.Resource_Load_Failed.replace('{I}', i.toString()).replace('{N}', js.name ? js.name : CONST.Text.UnkownItem));
						}
					}
				}
			}
		}

		// Loads web resources and saves them to GM-storage
		// Tries to load web resources from GM-storage in subsequent calls
		// Updates resources every $(this.expire) hours, or use $(this.refresh) function to update all resources instantly
		// Dependencies: GM_getValue(), GM_setValue(), requestText(), AsyncManager(), KEY_LOCALCDN
		function LocalCDN() {
			const LC = this;
			const _GM_getValue = typeof(GM_getValue) === 'function' ? GM_getValue : Provides.GM_getValue;
			const _GM_setValue = typeof(GM_setValue) === 'function' ? GM_setValue : Provides.GM_setValue;

			const KEY_LOCALCDN = 'LOCAL-CDN';
			const KEY_LOCALCDN_VERSION = 'version';
			const VALUE_LOCALCDN_VERSION = '0.3';

			// Default expire time (by hour)
			LC.expire = 72;

			// Try to get resource content from loaclCDN first, if failed/timeout, request from web && save to LocalCDN
			// Accepts callback only: onload & onfail(optional)
			// Returns true if got from LocalCDN, false if got from web
			LC.get = function(url, onload, args=[], onfail=function(){}) {
				const CDN = _GM_getValue(KEY_LOCALCDN, {});
				const resource = CDN[url];
				const time = (new Date()).getTime();

				if (resource && resource.content !== null && !expired(time, resource.time)) {
					onload.apply(null, [resource.content].concat(args));
					return true;
				} else {
					LC.request(url, _onload, [], onfail);
					return false;
				}

				function _onload(content) {
					onload.apply(null, [content].concat(args));
				}
			}

			// Generate resource obj and set to CDN[url]
			// Returns resource obj
			// Provide content means load success, provide null as content means load failed
			LC.set = function(url, content) {
				const CDN = _GM_getValue(KEY_LOCALCDN, {});
				const time = (new Date()).getTime();
				const resource = {
					url: url,
					time: time,
					content: content,
					success: content !== null ? (CDN[url] ? CDN[url].success + 1 : 1) : (CDN[url] ? CDN[url].success : 0),
					fail: content === null ? (CDN[url] ? CDN[url].fail + 1 : 1) : (CDN[url] ? CDN[url].fail : 0),
				};
				CDN[url] = resource;
				_GM_setValue(KEY_LOCALCDN, CDN);
				return resource;
			}

			// Delete one resource from LocalCDN
			LC.delete = function(url) {
				const CDN = _GM_getValue(KEY_LOCALCDN, {});
				if (!CDN[url]) {
					return false;
				} else {
					delete CDN[url];
					_GM_setValue(KEY_LOCALCDN, CDN);
					return true;
				}
			}

			// Delete all resources in LocalCDN
			LC.clear = function() {
				_GM_setValue(KEY_LOCALCDN, {});
				upgradeConfig();
			}

			// List all resource saved in LocalCDN
			LC.list = function() {
				const CDN = _GM_getValue(KEY_LOCALCDN, {});
				const urls = LC.listurls();
				return LC.listurls().map((url) => (CDN[url]));
			}

			// List all resource's url saved in LocalCDN
			LC.listurls = function() {
				return Object.keys(_GM_getValue(KEY_LOCALCDN, {})).filter((url) => (url !== KEY_LOCALCDN_VERSION));
			}

			// Request content from web and save it to CDN[url]
			// Accepts callbacks only: onload & onfail(optional)
			LC.request = function(url, onload, args=[], onfail=function(){}) {
				const CDN = _GM_getValue(KEY_LOCALCDN, {});
				requestText(url, _onload, [], _onfail);

				function _onload(content) {
					LC.set(url, content);
					onload.apply(null, [content].concat(args));
				}

				function _onfail() {
					LC.set(url, null);
					onfail();
				}
			}

			// Re-request all resources in CDN instantly, ignoring LC.expire
			LC.refresh = function(callback, args=[]) {
				const urls = LC.listurls();

				const AM = new AsyncManager();
				AM.onfinish = function() {
					callback.apply(null, [].concat(args))
				};

				for (const url of urls) {
					AM.add();
					LC.request(url, function() {
						AM.finish();
					});
				}

				AM.finishEvent = true;
			}

			// Sort src && srcset, to get a best request sorting
			LC.sort = function(srcset) {
				const CDN = _GM_getValue(KEY_LOCALCDN, {});
				const result = {srclist: [], lists: []};
				const lists = result.lists;
				const srclist = result.srclist;
				const suc_rec = lists[0] = []; // Recent successes take second (not expired yet)
				const suc_old = lists[1] = []; // Old successes take third
				const fails   = lists[2] = []; // Fails & unused take the last place
				const time = (new Date()).getTime();

				// Make lists
				for (const s of srcset) {
					const resource = CDN[s];
					if (resource && resource.content !== null) {
						if (!expired(resource.time, time)) {
							suc_rec.push(s);
						} else {
							suc_old.push(s);
						}
					} else {
						fails.push(s);
					}
				}

				// Sort lists
				// Recently successed: Choose most recent ones
				suc_rec.sort((res1, res2) => (res2.time - res1.time));
				// Successed long ago or failed: Sort by success rate & tried time
				[suc_old, fails].forEach((arr) => (arr.sort(sorting)));

				// Push all resources into seclist
				[suc_rec, suc_old, fails].forEach((arr) => (arr.forEach((res) => (srclist.push(res)))));

				DoLog(['LocalCDN: sorted', result]);
				return result;

				function sorting(res1, res2) {
					const sucRate1 = (res1.success+1) / (res1.fail+1);
					const sucRate2 = (res2.success+1) / (res2.fail+1);

					if (sucRate1 !== sucRate2) {
						// Success rate: high to low
						return sucRate2 - sucRate1;
					} else {
						// Tried time: less to more
						// Less tried time means newer added source
						return (res1.success+res1.fail) - (res2.success+res2.fail);
					}
				}
			}

			function upgradeConfig() {
				const CDN = _GM_getValue(KEY_LOCALCDN, {});
				switch(CDN[KEY_LOCALCDN_VERSION]) {
					case undefined:
						init();
						break;
					case '0.1':
						v01_To_v02();
						logUpgrade();
						break;
					case '0.2':
						v01_To_v02();
						v02_To_v03();
						logUpgrade();
						break;
					case VALUE_LOCALCDN_VERSION:
						DoLog('LocalCDN is in latest version.');
						break;
					default:
						DoLog(LogLevel.Error, 'LocalCDN.upgradeConfig: Invalid config version({V}) for LocalCDN. '.replace('{V}', CDN[KEY_LOCALCDN_VERSION]));
				}
				CDN[KEY_LOCALCDN_VERSION] = VALUE_LOCALCDN_VERSION;
				_GM_setValue(KEY_LOCALCDN, CDN);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'LocalCDN successfully upgraded From v{V1} to v{V2}. '.replaceAll('{V1}', CDN[KEY_LOCALCDN_VERSION]).replaceAll('{V2}', VALUE_LOCALCDN_VERSION));
				}

				function init() {
					// Nothing to do here
				}

				function v01_To_v02() {
					const urls = LC.listurls();
					for (const url of urls) {
						if (url === KEY_LOCALCDN_VERSION) {continue;}
						CDN[url] = {
							url: url,
							time: 0,
							content: CDN[url]
						};
					}
				}

				function v02_To_v03() {
					const urls = LC.listurls();
					for (const url of urls) {
						CDN[url].success = CDN[url].fail = 0;
					}
				}
			}

			function clearExpired() {
				const resources = LC.list();
				const time = (new Date()).getTime();

				for (const resource of resources) {
					expired(resource.time, time) && LC.delete(resource.url);
				}
			}

			function expired(t1, t2) {
				return (t1 - t2) > (LC.expire * 60 * 60 * 1000);
			}

			upgradeConfig();
			clearExpired();
		}

		function requestText(url, callback, args=[], onfail=function(){}) {
			const req = typeof(GM_xmlhttpRequest) === 'function' ? GM_xmlhttpRequest : Provides.GM_xmlhttpRequest;
			req({
	            method:       'GET',
	            url:          url,
	            responseType: 'text',
				timeout:      45*1000,
	            onload:       function(response) {
	                const text = response.responseText;
					const argvs = [text].concat(args);
	                callback.apply(null, argvs);
	            },
				onerror:      onfail,
				ontimeout:    onfail,
				onabort:      onfail,
	        })
		}

		function AsyncManager() {
			const AM = this;

			// Ongoing xhr count
			this.taskCount = 0;

			// Whether generate finish events
			let finishEvent = false;
			Object.defineProperty(this, 'finishEvent', {
				configurable: true,
				enumerable: true,
				get: () => (finishEvent),
				set: (b) => {
					finishEvent = b;
					b && AM.taskCount === 0 && AM.onfinish && AM.onfinish();
				}
			});

			// Add one task
			this.add = () => (++AM.taskCount);

			// Finish one task
			this.finish = () => ((--AM.taskCount === 0 && AM.finishEvent && AM.onfinish && AM.onfinish(), AM.taskCount));
		}

		// Arguments: level=LogLevel.Info, logContent, asObject=false
	    // Needs one call "DoLog();" to get it initialized before using it!
	    function DoLog() {
	    	const win = typeof(unsafeWindow) !== 'undefined' ? unsafeWindow : window;

	        // Global log levels set
	        win.LogLevel = {
	            None: 0,
	            Error: 1,
	            Success: 2,
	            Warning: 3,
	            Info: 4,
	        }
	        win.LogLevelMap = {};
	        win.LogLevelMap[LogLevel.None]     = {prefix: ''          , color: 'color:#ffffff'}
	        win.LogLevelMap[LogLevel.Error]    = {prefix: '[Error]'   , color: 'color:#ff0000'}
	        win.LogLevelMap[LogLevel.Success]  = {prefix: '[Success]' , color: 'color:#00aa00'}
	        win.LogLevelMap[LogLevel.Warning]  = {prefix: '[Warning]' , color: 'color:#ffa500'}
	        win.LogLevelMap[LogLevel.Info]     = {prefix: '[Info]'    , color: 'color:#888888'}
	        win.LogLevelMap[LogLevel.Elements] = {prefix: '[Elements]', color: 'color:#000000'}

	        // Current log level
	        DoLog.logLevel = win.isPY_DNG ? LogLevel.Info : LogLevel.Warning; // Info Warning Success Error

	        // Log counter
	        DoLog.logCount === undefined && (DoLog.logCount = 0);
	        if (++DoLog.logCount > 512) {
	            console.clear();
	            DoLog.logCount = 0;
	        }

	        // Get args
	        let level, logContent, asObject;
	        switch (arguments.length) {
	            case 1:
	                level = LogLevel.Info;
	                logContent = arguments[0];
	                asObject = false;
	                break;
	            case 2:
	                level = arguments[0];
	                logContent = arguments[1];
	                asObject = false;
	                break;
	            case 3:
	                level = arguments[0];
	                logContent = arguments[1];
	                asObject = arguments[2];
	                break;
	            default:
	                level = LogLevel.Info;
	                logContent = 'DoLog initialized.';
	                asObject = false;
	                break;
	        }

	        // Log when log level permits
	        if (level <= DoLog.logLevel) {
	            let msg = '%c' + LogLevelMap[level].prefix;
	            let subst = LogLevelMap[level].color;

	            if (asObject) {
	                msg += ' %o';
	            } else {
	                switch(typeof(logContent)) {
	                    case 'string': msg += ' %s'; break;
	                    case 'number': msg += ' %d'; break;
	                    case 'object': msg += ' %o'; break;
	                }
	            }

	            console.log(msg, subst, logContent);
	        }
	    }
	}

	// Polyfill alert
	function polyfillAlert() {
		if (typeof(GM_POLYFILLED) !== 'object') {return false;}
		if (GM_POLYFILLED.GM_setValue) {
			alertify.notify(TEXT_ALT_POLYFILL);
		}
	}

	// Polyfill String.prototype.replaceAll
	// replaceValue does NOT support regexp match groups($1, $2, etc.)
	function polyfill_replaceAll() {
		String.prototype.replaceAll = String.prototype.replaceAll ? String.prototype.replaceAll : PF_replaceAll;

		function PF_replaceAll(searchValue, replaceValue) {
			const str = String(this);

			if (searchValue instanceof RegExp) {
				const global = RegExp(searchValue, 'g');
				if (/\$/.test(replaceValue)) {console.error('Error: Polyfilled String.protopype.replaceAll does support regexp groups');};
				return str.replace(global, replaceValue);
			} else {
				return str.split(searchValue).join(replaceValue);
			}
		}
	}

    // Append a style text to document(<head>) with a <style> element
    function addStyle(css, id) {
		const style = $CrE("style");
		id && (style.id = id);
		style.textContent = css;
		for (const elm of $All('#'+id)) {
			elm.parentElement && elm.parentElement.removeChild(elm);
		}
        document.head.appendChild(style);
    }

    // Copy text to clipboard (needs to be called in an user event)
    function copyText(text) {
        // Create a new textarea for copying
        const newInput = $CrE('textarea');
        document.body.appendChild(newInput);
        newInput.value = text;
        newInput.select();
        document.execCommand('copy');
        document.body.removeChild(newInput);
    }
})();