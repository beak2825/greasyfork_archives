// ==UserScript==
// @name        Tieba Chat
// @version     1.14
// @description Tieba Chat | 这是一个实现在网页端使用贴吧客户端聊天功能的脚本。通过该脚本，您可以与使用贴吧客户端的好友聊天
// @match       http://tieba.baidu.com/*
// @include     http://tieba.baidu.com/*
// @author      864907600cc
// @icon        http://1.gravatar.com/avatar/147834caf9ccb0a66b2505c753747867
// @run-at      document-end
// @grant       none
// @noframes
// @namespace   http://ext.ccloli.com
// @downloadURL https://update.greasyfork.org/scripts/1255/Tieba%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/1255/Tieba%20Chat.meta.js
// ==/UserScript==

// 本脚本基于 GPLv3 协议开源 http://www.gnu.org/licenses/gpl.html‎
// (c) 86497600cc. Some Rights Reserved.

var hex_md5 = (function(g, k) {
	function l(a) {
		return n(m(o(a)))
	};

	function m(a) {
		return h(j(p(a), a.length * 8))
	};

	function n(e) {
		try {} catch (a) {
			g = 0
		};
		var b = g ? '0123456789ABCDEF' : '0123456789abcdef';
		var c = '';
		var d;
		for (var a = 0; a < e.length; a++) d = e.charCodeAt(a), c += b.charAt(d >>> 4 & 15) + b.charAt(d & 15);
		return c
	};

	function o(d) {
		var b = '';
		var c = -1;
		var a, e;
		while (++c < d.length) a = d.charCodeAt(c), e = c + 1 < d.length ? d.charCodeAt(c + 1) : 0, 55296 <= a && a <= 56319 && 56320 <= e && e <= 57343 && (a = 65536 + ((a & 1023) << 10) + (e & 1023), c++), a <= 127 ? b += String.fromCharCode(a) : a <= 2047 ? b += String.fromCharCode(192 | a >>> 6 & 31, 128 | a & 63) : a <= 65535 ? b += String.fromCharCode(224 | a >>> 12 & 15, 128 | a >>> 6 & 63, 128 | a & 63) : a <= 2097151 && (b += String.fromCharCode(240 | a >>> 18 & 7, 128 | a >>> 12 & 63, 128 | a >>> 6 & 63, 128 | a & 63));
		return b
	};

	function p(c) {
		var b = Array(c.length >> 2);
		for (var a = 0; a < b.length; a++) b[a] = 0;
		for (var a = 0; a < c.length * 8; a += 8) b[a >> 5] |= (c.charCodeAt(a / 8) & 255) << a % 32;
		return b
	};

	function h(c) {
		var b = '';
		for (var a = 0; a < c.length * 32; a += 8) b += String.fromCharCode(c[a >> 5] >>> a % 32 & 255);
		return b
	};

	function j(j, l) {
		j[l >> 5] |= 128 << l % 32, j[(l + 64 >>> 9 << 4) + 14] = l;
		var g = 1732584193;
		var h = -271733879;
		var i = -1732584194;
		var f = 271733878;
		for (var k = 0; k < j.length; k += 16) {
			var n = g;
			var o = h;
			var p = i;
			var m = f;
			g = a(g, h, i, f, j[k + 0], 7, -680876936), f = a(f, g, h, i, j[k + 1], 12, -389564586), i = a(i, f, g, h, j[k + 2], 17, 606105819), h = a(h, i, f, g, j[k + 3], 22, -1044525330), g = a(g, h, i, f, j[k + 4], 7, -176418897), f = a(f, g, h, i, j[k + 5], 12, 1200080426), i = a(i, f, g, h, j[k + 6], 17, -1473231341), h = a(h, i, f, g, j[k + 7], 22, -45705983), g = a(g, h, i, f, j[k + 8], 7, 1770035416), f = a(f, g, h, i, j[k + 9], 12, -1958414417), i = a(i, f, g, h, j[k + 10], 17, -42063), h = a(h, i, f, g, j[k + 11], 22, -1990404162), g = a(g, h, i, f, j[k + 12], 7, 1804603682), f = a(f, g, h, i, j[k + 13], 12, -40341101), i = a(i, f, g, h, j[k + 14], 17, -1502002290), h = a(h, i, f, g, j[k + 15], 22, 1236535329), g = b(g, h, i, f, j[k + 1], 5, -165796510), f = b(f, g, h, i, j[k + 6], 9, -1069501632), i = b(i, f, g, h, j[k + 11], 14, 643717713), h = b(h, i, f, g, j[k + 0], 20, -373897302), g = b(g, h, i, f, j[k + 5], 5, -701558691), f = b(f, g, h, i, j[k + 10], 9, 38016083), i = b(i, f, g, h, j[k + 15], 14, -660478335), h = b(h, i, f, g, j[k + 4], 20, -405537848), g = b(g, h, i, f, j[k + 9], 5, 568446438), f = b(f, g, h, i, j[k + 14], 9, -1019803690), i = b(i, f, g, h, j[k + 3], 14, -187363961), h = b(h, i, f, g, j[k + 8], 20, 1163531501), g = b(g, h, i, f, j[k + 13], 5, -1444681467), f = b(f, g, h, i, j[k + 2], 9, -51403784), i = b(i, f, g, h, j[k + 7], 14, 1735328473), h = b(h, i, f, g, j[k + 12], 20, -1926607734), g = c(g, h, i, f, j[k + 5], 4, -378558), f = c(f, g, h, i, j[k + 8], 11, -2022574463), i = c(i, f, g, h, j[k + 11], 16, 1839030562), h = c(h, i, f, g, j[k + 14], 23, -35309556), g = c(g, h, i, f, j[k + 1], 4, -1530992060), f = c(f, g, h, i, j[k + 4], 11, 1272893353), i = c(i, f, g, h, j[k + 7], 16, -155497632), h = c(h, i, f, g, j[k + 10], 23, -1094730640), g = c(g, h, i, f, j[k + 13], 4, 681279174), f = c(f, g, h, i, j[k + 0], 11, -358537222), i = c(i, f, g, h, j[k + 3], 16, -722521979), h = c(h, i, f, g, j[k + 6], 23, 76029189), g = c(g, h, i, f, j[k + 9], 4, -640364487), f = c(f, g, h, i, j[k + 12], 11, -421815835), i = c(i, f, g, h, j[k + 15], 16, 530742520), h = c(h, i, f, g, j[k + 2], 23, -995338651), g = d(g, h, i, f, j[k + 0], 6, -198630844), f = d(f, g, h, i, j[k + 7], 10, 1126891415), i = d(i, f, g, h, j[k + 14], 15, -1416354905), h = d(h, i, f, g, j[k + 5], 21, -57434055), g = d(g, h, i, f, j[k + 12], 6, 1700485571), f = d(f, g, h, i, j[k + 3], 10, -1894986606), i = d(i, f, g, h, j[k + 10], 15, -1051523), h = d(h, i, f, g, j[k + 1], 21, -2054922799), g = d(g, h, i, f, j[k + 8], 6, 1873313359), f = d(f, g, h, i, j[k + 15], 10, -30611744), i = d(i, f, g, h, j[k + 6], 15, -1560198380), h = d(h, i, f, g, j[k + 13], 21, 1309151649), g = d(g, h, i, f, j[k + 4], 6, -145523070), f = d(f, g, h, i, j[k + 11], 10, -1120210379), i = d(i, f, g, h, j[k + 2], 15, 718787259), h = d(h, i, f, g, j[k + 9], 21, -343485551), g = e(g, n), h = e(h, o), i = e(i, p), f = e(f, m)
		};
		return Array(g, h, i, f)
	};

	function f(a, b, c, d, f, g) {
		return e(i(e(e(b, a), e(d, g)), f), c)
	};

	function a(b, a, c, d, e, g, h) {
		return f(a & c | ~a & d, b, a, e, g, h)
	};

	function b(c, a, d, b, e, g, h) {
		return f(a & b | d & ~b, c, a, e, g, h)
	};

	function c(b, a, c, d, e, g, h) {
		return f(a ^ c ^ d, b, a, e, g, h)
	};

	function d(b, a, c, d, e, g, h) {
		return f(c ^ (a | ~d), b, a, e, g, h)
	};

	function e(b, c) {
		var a = (b & 65535) + (c & 65535);
		var d = (b >> 16) + (c >> 16) + (a >> 16);
		return d << 16 | a & 65535
	};

	function i(a, b) {
		return a << b | a >>> 32 - b
	};
	return g = 0, k = '', l
}());

var user_id = window.PageData.user.id || window.PageData.user.user_id;

var _client_id = 'wappc_1398857293796_956',
	_client_type = '2',
	_client_version = '4.2.7',
	_phone_imei = '092887406663530',
	net_type = '3',
	sign_key = 'tiebaclient!!!';

/*if(document.cookie.match(/BDUSS=(.{192,}?);?/))var BDUSS=document.cookie.match(/BDUSS=(.{192,}?);?/)[1];
else if(GM_getValue('BDUSS',0)!=0)var BDUSS=GM_getValue('BDUSS');
else{
	var BDUSS=prompt('无法获取 BDUSS，请尝试在移动版贴吧注销并登录。\n\n1. 将浏览器 UA 设置为移动设备的 UA（例如 Chrome 可在开发者工具中点击右上角的“Show drawer.”，并在下方的 Emulation 里设置 UserAgent；Firefox 可安装 User Agent Overrider 等扩展）；\n2. 访问 http://tieba.baidu.com/mo 进行登录操作；\n3. 登录后禁用 UA 设置，回到贴吧页检查是否可用。\n\n如果希望手动配置 BDUSS，请将 BDUSS 贴在下方并按确定键。');
	if(BDUSS!=null&&BDUSS!=''&&BDUSS.match(/.{192,}?/)){
		//document.cookie='BDUSS='+BDUSS.match(/.{192,}?/)+'; expires='+(new Date(new Date().getTime()+60*60*24*365*10*1000)).toGMTString()+'; path=/';
		GM_setValue('BDUSS',BDUSS);
		var BDUSS=BDUSS;
		window.location.href=window.location.href;
	}
	throw 'Tieba Chat can\'t get BDUSS!!!';
}*/

var tb_chat_data = JSON.parse(window.localStorage.getItem('tb_chat_data')) || {};
var message_update_timestamp = window.localStorage.getItem('tb_chat_message_update_timestamp') || new Date().getTime();
var message_update_count = window.localStorage.getItem('tb_chat_message_update_count') || 0;
var user_portrait = '';
var com_portrait = '';
var chatting_list_page = 1;
var this_last_msg = 0;
var this_early_msg = 0;
var this_username = null;
var this_userid = 0;
var this_msg_update = null;
var model = 0;

var emo_list = {
	"呵呵": "http://tb2.bdstatic.com/tb/editor/images/face/i_f01.png",
	"哈哈": "http://tb2.bdstatic.com/tb/editor/images/face/i_f02.png",
	"吐舌": "http://tb2.bdstatic.com/tb/editor/images/face/i_f03.png",
	"啊": "http://tb2.bdstatic.com/tb/editor/images/face/i_f04.png",
	"酷": "http://tb2.bdstatic.com/tb/editor/images/face/i_f05.png",
	"怒": "http://tb2.bdstatic.com/tb/editor/images/face/i_f06.png",
	"开心": "http://tb2.bdstatic.com/tb/editor/images/face/i_f07.png",
	"汗": "http://tb2.bdstatic.com/tb/editor/images/face/i_f08.png",
	"泪": "http://tb2.bdstatic.com/tb/editor/images/face/i_f09.png",
	"黑线": "http://tb2.bdstatic.com/tb/editor/images/face/i_f10.png",
	"鄙视": "http://tb2.bdstatic.com/tb/editor/images/face/i_f11.png",
	"不高兴": "http://tb2.bdstatic.com/tb/editor/images/face/i_f12.png",
	"真棒": "http://tb2.bdstatic.com/tb/editor/images/face/i_f13.png",
	"钱": "http://tb2.bdstatic.com/tb/editor/images/face/i_f14.png",
	"疑问": "http://tb2.bdstatic.com/tb/editor/images/face/i_f15.png",
	"阴险": "http://tb2.bdstatic.com/tb/editor/images/face/i_f16.png",
	"吐": "http://tb2.bdstatic.com/tb/editor/images/face/i_f17.png",
	"咦": "http://tb2.bdstatic.com/tb/editor/images/face/i_f18.png",
	"委屈": "http://tb2.bdstatic.com/tb/editor/images/face/i_f19.png",
	"花心": "http://tb2.bdstatic.com/tb/editor/images/face/i_f20.png",
	"呼~": "http://tb2.bdstatic.com/tb/editor/images/face/i_f21.png",
	"笑眼": "http://tb2.bdstatic.com/tb/editor/images/face/i_f22.png",
	"冷": "http://tb2.bdstatic.com/tb/editor/images/face/i_f23.png",
	"太开心": "http://tb2.bdstatic.com/tb/editor/images/face/i_f24.png",
	"滑稽": "http://tb2.bdstatic.com/tb/editor/images/face/i_f25.png",
	"勉强": "http://tb2.bdstatic.com/tb/editor/images/face/i_f26.png",
	"狂汗": "http://tb2.bdstatic.com/tb/editor/images/face/i_f27.png",
	"乖": "http://tb2.bdstatic.com/tb/editor/images/face/i_f28.png",
	"睡觉": "http://tb2.bdstatic.com/tb/editor/images/face/i_f29.png",
	"惊哭": "http://tb2.bdstatic.com/tb/editor/images/face/i_f30.png",
	"升起": "http://tb2.bdstatic.com/tb/editor/images/face/i_f31.png",
	"惊讶": "http://tb2.bdstatic.com/tb/editor/images/face/i_f32.png",
	"喷": "http://tb2.bdstatic.com/tb/editor/images/face/i_f33.png",
	"爱心": "http://tb2.bdstatic.com/tb/editor/images/face/i_f34.png",
	"心碎": "http://tb2.bdstatic.com/tb/editor/images/face/i_f35.png",
	"玫瑰": "http://tb2.bdstatic.com/tb/editor/images/face/i_f36.png",
	"礼物": "http://tb2.bdstatic.com/tb/editor/images/face/i_f37.png",
	"彩虹": "http://tb2.bdstatic.com/tb/editor/images/face/i_f38.png",
	"星星月亮": "http://tb2.bdstatic.com/tb/editor/images/face/i_f39.png",
	"太阳": "http://tb2.bdstatic.com/tb/editor/images/face/i_f40.png",
	"钱币": "http://tb2.bdstatic.com/tb/editor/images/face/i_f41.png",
	"灯泡": "http://tb2.bdstatic.com/tb/editor/images/face/i_f42.png",
	"茶杯": "http://tb2.bdstatic.com/tb/editor/images/face/i_f43.png",
	"蛋糕": "http://tb2.bdstatic.com/tb/editor/images/face/i_f44.png",
	"音乐": "http://tb2.bdstatic.com/tb/editor/images/face/i_f45.png",
	"haha": "http://tb2.bdstatic.com/tb/editor/images/face/i_f46.png",
	"胜利": "http://tb2.bdstatic.com/tb/editor/images/face/i_f47.png",
	"大拇指": "http://tb2.bdstatic.com/tb/editor/images/face/i_f48.png",
	"弱": "http://tb2.bdstatic.com/tb/editor/images/face/i_f49.png",
	"OK": "http://tb2.bdstatic.com/tb/editor/images/face/i_f50.png",
	"哭着跑": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_047.gif",
	"惆怅~": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_050.gif",
	"摸头": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_051.gif",
	"蹭": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_052.gif",
	"打滚": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_053.gif",
	"叩拜": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_054.gif",
	"摸": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_055.gif",
	"数钱": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_056.gif",
	"加1": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_059.gif",
	"压力": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_060.gif",
	"表逼我": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_061.gif",
	"人呢": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_062.gif",
	"摇晃": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_063.gif",
	"打地鼠": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_064.gif",
	"这个屌": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_065.gif",
	"恐慌": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_066.gif",
	"晕乎乎": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_067.gif",
	"浮云": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_068.gif",
	"给力": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_069.gif",
	"杯具了": "http://tb2.bdstatic.com/tb/editor/images/ali/ali_070.gif",
	"焦糖舞": "http://tb2.bdstatic.com/tb/editor/images/shadow/yz_001.gif",
	"翻滚": "http://tb2.bdstatic.com/tb/editor/images/shadow/yz_002.gif",
	"拍屁股做鬼脸": "http://tb2.bdstatic.com/tb/editor/images/shadow/yz_003.gif",
	"不": "http://tb2.bdstatic.com/tb/editor/images/shadow/yz_004.gif",
	"河蟹掉啦": "http://tb2.bdstatic.com/tb/editor/images/shadow/yz_005.gif",
	"哦耶": "http://tb2.bdstatic.com/tb/editor/images/shadow/yz_006.gif",
	"我倒": "http://tb2.bdstatic.com/tb/editor/images/shadow/yz_007.gif",
	"投降": "http://tb2.bdstatic.com/tb/editor/images/shadow/yz_008.gif",
	"微笑": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b01.gif",
	"帅哥": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b02.gif",
	"美女": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b03.gif",
	"老大": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b04.gif",
	"哈哈哈": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b05.gif",
	"奸笑": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b06.gif",
	"傻乐": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b07.gif",
	"飞吻": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b08.gif",
	"害羞": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b09.gif",
	"花痴": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b10.gif",
	"憧憬": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b11.gif",
	"你牛": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b12.gif",
	"鼓掌": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b13.gif",
	"可爱": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b14.gif",
	"太委屈": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b15.gif",
	"大哭": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b16.gif",
	"泪奔": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b17.gif",
	"寻死": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b18.gif",
	"非常惊讶": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b19.gif",
	"表示疑问": "http://tb2.bdstatic.com/tb/editor/images/qpx_n/b20.gif",
	"蹦蹦跳跳": "http://tb2.bdstatic.com/tb/editor/images/10th/10th_001.gif",
	"晃悠": "http://tb2.bdstatic.com/tb/editor/images/10th/10th_002.gif",
	"摇摇摆摆": "http://tb2.bdstatic.com/tb/editor/images/10th/10th_003.gif",
	"大撒花": "http://tb2.bdstatic.com/tb/editor/images/10th/10th_004.gif",
	"高高兴兴": "http://tb2.bdstatic.com/tb/editor/images/10th/10th_005.gif",
	"弹吉他": "http://tb2.bdstatic.com/tb/editor/images/10th/10th_006.gif",
	"魔法棒": "http://tb2.bdstatic.com/tb/editor/images/10th/10th_007.gif",
	"扛大旗": "http://tb2.bdstatic.com/tb/editor/images/10th/10th_008.gif",
	"点蜡烛": "http://tb2.bdstatic.com/tb/editor/images/10th/10th_009.gif",
	"大秧歌": "http://tb2.bdstatic.com/tb/editor/images/10th/10th_010.gif",
	"贴吧十周年": "http://tb2.bdstatic.com/tb/editor/images/10th/10th_011.gif",
	"十周年": "http://tb2.bdstatic.com/tb/editor/images/10th/10th_012.gif"
};
var emo_regex = /#\((呵呵|哈哈|吐舌|啊|酷|怒|开心|汗|泪|黑线|鄙视|不高兴|真棒|钱|疑问|阴险|吐|咦|委屈|花心|呼~|笑眼|冷|太开心|滑稽|勉强|狂汗|乖|睡觉|惊哭|升起|惊讶|喷|爱心|心碎|玫瑰|礼物|彩虹|星星月亮|太阳|钱币|灯泡|茶杯|蛋糕|音乐|haha|胜利|大拇指|弱|OK|哭着跑|惆怅~|摸头|蹭|打滚|叩拜|摸|数钱|加1|压力|表逼我|人呢|摇晃|打地鼠|这个屌|恐慌|晕乎乎|浮云|给力|杯具了|焦糖舞|翻滚|拍屁股做鬼脸|不|河蟹掉啦|哦耶|我倒|投降|微笑|帅哥|美女|老大|哈哈哈|奸笑|傻乐|飞吻|害羞|花痴|憧憬|你牛|鼓掌|可爱|太委屈|大哭|泪奔|寻死|非常惊讶|表示疑问|蹦蹦跳跳|晃悠|摇摇摆摆|大撒花|高高兴兴|弹吉他|魔法棒|扛大旗|点蜡烛|大秧歌|贴吧十周年|十周年)\)/gi;

if (tb_chat_data.first_install == null) {
	window.$.dialog.alert('<div style="font-size:14px"><p>欢迎使用 Tieba Chat ~~~ ヽ(//∇//)ﾉ♡</p><p>这是一个实现在网页端使用贴吧客户端的聊天功能的脚本。通过该脚本，您可以方便地与使用贴吧客户端的好友聊天。</p><p>使用说明：<br>1. 将鼠标划至网页右下角的“贴吧聊天”即可打开聊天界面；<br>2. 点击聊天列表中的用户或贴子楼层右下角“聊天”可以发起聊天，点击“点击加载下/上一页”可以进行翻页操作；<br>3. 在聊天界面下方文本框中输入聊天文字，点击右侧“发送”即可发送消息；<br>4. 在聊天界面点击信息列表最上方的“点击查看更多”即可查看之前的消息（如果存在的话）；<br>5. 鼠标移出聊天界面后 0.5 秒可收起聊天界面。</p><p style="color:red">警告：<br>* 该脚本目前仍处于测试阶段，可能存在一些未知错误，请谨慎使用<br><del>* 该脚本需要获取 BDUSS，但并不会将其共享，如果您不信任，请卸载此脚本</del> 已确认不需要 BDUSS<br>* 该脚本目前只能发送和接收文字信息，对于图片、表情、语音等多媒体信息暂不支持（主要是 mini 客户端 api 没有提供）<br>* 本脚本目前只是为实现该功能而编写，暂未考虑效率问题，这可能导致浏览器运行缓慢<br>* 本脚本无缓存功能，所有操作均需要重新访问 api，这可能带来较多的带宽消耗<br>* 此脚本的设计可能比较简陋，暂时还没有设置界面……毕竟只是为了测试而已 OTL</p><p>如有疑问请在 firefox 吧相关贴子讨论……</p></div>', {
		title: "Tieba Chat 欢迎界面",
		width: 800
	})
	tb_chat_data.first_install = 1;
	window.localStorage.setItem('tb_chat_data', JSON.stringify(tb_chat_data));
}

function get_string(c) {
	var str = '';
	var str2 = '';
	for (var i in c) {
		str += i + '=' + c[i];
		str2 += i + '=' + encodeURIComponent(c[i]) + '&';
	}
	var sign = hex_md5(str + sign_key);
	str2 += 'sign=' + sign;
	return str2;
}

function get_locale_time(t) {
	var time = new Date(t * 1000);
	return (time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate() + ' ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds());
}

function get_message_update() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var t = JSON.parse(xhr.responseText);
			if (t.error_code == '0') {
				if (t.error && t.error.errno != '0') {
					var s = show_error(t.error.errno, t.error.errmsg);
					var t = setTimeout(function() {
						s.parentElement.removeChild(s);
					}, 5000);
					s.onclick = function() {
						get_message_update();
						s.parentElement.removeChild(s);
						clearTimeout(t);
					};
					throw 'Tieba Chat Error ' + t.error.errno + ': ' + t.error.errmsg;
				}
				message_update_timestamp = new Date().getTime();
				message_update_count = t.message.pletter;
				if (message_update_count != '0') {
					document.title = '【' + message_update_count + ' 条新聊天】' + original_title;
					panel_top.style.color = 'orange';
				} else {
					document.title = original_title;
					panel_top.style.color = '#414243';
				}
				window.localStorage.setItem('tb_chat_message_update_timestamp', message_update_timestamp);
				window.localStorage.setItem('tb_chat_message_update_count', t.message.pletter);
			} else {
				var s = show_error(t.error_code, t.error_msg);
				var t = setTimeout(function() {
					s.parentElement.removeChild(s);
				}, 5000);
				s.onclick = function() {
					get_message_update();
					s.parentElement.removeChild(s);
					clearTimeout(t);
				};
				throw 'Tieba Chat Error ' + t.error_code + ': ' + t.error_msg;
			}
		}
	};
	xhr.open('POST', '//tieba.baidu.com/c/s/msg?' + get_string());
	xhr.send();
}

function get_chatting_list(pn) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var t = JSON.parse(xhr.responseText);
			if (t.error_code == '0') {
				if (t.error && t.error.errno != '0') {
					var s = show_error(t.error.errno, t.error.errmsg);
					var t = setTimeout(function() {
						s.parentElement.removeChild(s);
					}, 5000);
					s.onclick = function() {
						get_chatting_list(pn);
						s.parentElement.removeChild(s);
						clearTimeout(t);
					};
					throw 'Tieba Chat Error ' + t.error.errno + ': ' + t.error.errmsg;
				}
				switch (model) {
				case 0:
					panel_head.textContent = '贴吧聊天';
					break;
				case 1:
					panel_head.textContent = '贴吧聊天（标记阅读模式）';
					break;
				case 2:
					panel_head.textContent = '贴吧聊天（删除用户模式）';
					break;
				}
				panel.setAttribute('model', model);
				panel_main.innerHTML = '';
				var panel_list = document.createElement('div');
				panel_list.className = 'tb_chat_panel_list';
				panel_main.appendChild(panel_list);
				chatting_list_page = pn;
				if (pn > 1) {
					var msg_more = document.createElement('div');
					msg_more.textContent = '点击加载上一页';
					msg_more.style.cssText = 'width:200px;margin:20px auto;text-align:center;font-size:13px;background:#5b97ff;padding:5px;-webkit-user-select:none;-moz-user-select:none;cursor:pointer;color:#ffffff';
					panel_list.appendChild(msg_more);
					msg_more.onclick = function() {
						get_chatting_list(pn - 1);
						msg_more.textContent = '正在载入......';
					};
				}
				for (var c in t.record) {
					var p = document.createElement('div');
					p.className = 'tb_chat_row';
					p.setAttribute('user_id', t.record[c].user_id);
					p.setAttribute('user_name', t.record[c].user_name)
					p.innerHTML = '<div class="tb_chat_pleft"><img class="tb_chat_avatar" src="http://tb.himg.baidu.com/sys/portrait/item/' + t.record[c].portrait + '" alt></div><div class="tb_chat_pright"><div class="tb_chat_username">' + t.record[c].user_name + (t.record[c].unread_count == '0' ? '' : ' <small>(' + t.record[c].unread_count + ')</small>') + '</div><div class="tb_chat_lasttext">' + (t.record[c].abstract.length > 0 ? t.record[c].abstract[t.record[c].abstract.length - 1].text : '') + '</div></div><div style="clear:both"></div>';
					if (t.record[c].unread_count != '0') {
						p.style.color = 'orange';
						p.onclick = function() {
							panel_top.style.color = '#414243';
							switch (model) {
							case 0:
								this_userid = this.getAttribute('user_id');
								this_username = this.getAttribute('user_name');
								get_latest_msg(this.getAttribute('user_id'));
								break;
							case 1:
								get_latest_msg(this.getAttribute('user_id'), true);
								this.style.color = '#414243';
								break;
							case 2:
								delete_user(this.getAttribute('user_id'), true);
								break;
							}
						}
					} else p.onclick = function() {
						switch (model) {
						case 0:
							this_userid = this.getAttribute('user_id');
							this_username = this.getAttribute('user_name');
							get_latest_msg(this.getAttribute('user_id'));
							break;
						case 1:
							get_latest_msg(this.getAttribute('user_id'), true);
							break;
						case 2:
							delete_user(this.getAttribute('user_id'), true);
							break;
						}
					}
					panel_list.appendChild(p);
				}
				if (t.has_more == 1) {
					var msg_more = document.createElement('div');
					msg_more.textContent = '点击加载下一页';
					msg_more.style.cssText = 'width:200px;margin:20px auto;text-align:center;font-size:13px;background:#5b97ff;padding:5px;-webkit-user-select:none;-moz-user-select:none;cursor:pointer;color:#ffffff';
					panel_list.appendChild(msg_more);
					msg_more.onclick = function() {
						get_chatting_list(pn + 1);
						msg_more.textContent = '正在载入......';
					};
				}
				panel_top_left.textContent = '+';
				panel_top_right.textContent = '≡';
				panel_top_left.onclick = function() {
					var username = prompt('请输入用户名以发起聊天');
					if (username != null && username != '') get_userid(username);
				}
				panel_top_right.onclick = function() {
					switch (prompt('请键入以下数字并点击“确定”以完成对应操作：\n1. 进入标记已读模式\n2. 进入删除用户模式\n3. 回到聊天模式\n\n（比较简陋真是抱歉了 _(:з」∠)_ ）')) {
					case '1':
						alert('现在你可以通过点击聊天面板上的用户来标记已读，标记已读的用户将不会再提醒以前的消息\n警告：该操作仅是方便标记已查阅的消息记录，请注意辨别未查阅的消息，标记过程将不会出现提醒，且操作不可逆\n如果需要回到聊天模式，请点击右上角的三道杠');
						model = 1;
						get_chatting_list(pn);
						break;
					case '2':
						alert('现在你可以通过点击聊天面板上的用户来删除该用户，删除的用户将不会再出现在聊天面板上\n警告：该操作仅是方便删除垃圾信息，请注意辨别消息发送用户，标记过程将不会出现提醒，且操作不可逆\n如果需要回到聊天模式，请点击右上角的三道杠');
						model = 2;
						get_chatting_list(pn);
						break;
					case '3':
						alert('已回到聊天模式');
						model = 0;
						get_chatting_list(pn);
					}
				}
				panel_main.scrollTop = 0;
				this_last_msg = 0;
				this_early_msg = 0;
				this_username = null;
				this_userid = 0;
			} else {
				var s = show_error(t.error_code, t.error_msg);
				var t = setTimeout(function() {
					s.parentElement.removeChild(s);
				}, 5000);
				s.onclick = function() {
					get_chatting_list(pn);
					s.parentElement.removeChild(s);
					clearTimeout(t);
				};
				throw 'Tieba Chat Error ' + t.error_code + ': ' + t.error_msg;
			}
		}
	};
	xhr.open('POST', '//tieba.baidu.com/c/s/comlist?' + get_string({
		//BDUSS:BDUSS,
		_client_id: _client_id,
		_client_type: _client_type,
		_client_version: _client_version,
		_phone_imei: _phone_imei,
		net_type: net_type,
		pn: pn
	}));
	xhr.send();
}

function get_latest_msg(id, silent) {
	var silent = silent || false;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var t = JSON.parse(xhr.responseText);
			if (t.error_code == '0') {
				if (silent == false) {
					//console.log(this_early_msg+'|'+this_last_msg);
					if (id != this_userid || document.getElementsByClassName('tb_chat_panel_list')[0]) panel_main.innerHTML = '';
					panel_head.textContent = this_username;
					if (document.getElementsByClassName('tb_chat_panel_msg')[0]) var panel_msg = document.getElementsByClassName('tb_chat_panel_msg')[0];
					else {
						var panel_msg = document.createElement('div');
						panel_msg.className = 'tb_chat_panel_msg';
						panel_main.appendChild(panel_msg);
					}
					if (t.error && t.error.errno != '0') {
						var s = show_error(t.error.errno, t.error.errmsg + ' ' + t.error.usermsg);
						var t = setTimeout(function() {
							s.parentElement.removeChild(s);
						}, 5000);
						s.onclick = function() {
							get_latest_msg(id);
							s.parentElement.removeChild(s);
							clearTimeout(t);
						};
						//throw 'Tieba Chat Error '+t.error.errno+': '+t.error.errmsg+' '+t.error.usermsg;
					} else {
						com_portrait = t.com_portrait;
						user_portrait = t.user_portrait;
						if (t.has_more == 1) {
							var msg_more = document.createElement('div');
							msg_more.textContent = '点击加载更多';
							msg_more.style.cssText = 'width:200px;margin:20px auto;text-align:center;font-size:13px;background:#5b97ff;padding:5px;-webkit-user-select:none;-moz-user-select:none;cursor:pointer;color:#ffffff';
							panel_msg.appendChild(msg_more);
							msg_more.onclick = function() {
								get_early_msg(id, panel_msg, msg_more);
							};
						}
						for (var c in t.message) {
							if (t.message[c].content.length == 0) continue;
							var p = document.createElement('div');
							p.className = 'tb_chat_message';
							if (t.message[c].from == '0') {
								p.className += ' com';
								p.innerHTML = '<div class="tb_chat_pleft"><img class="tb_chat_avatar" src="http://tb.himg.baidu.com/sys/portrait/item/' + com_portrait + '" alt></div><div class="tb_chat_pright"><div class="tb_chat_message_inner">' + (t.message[c].content[0].text.replace(emo_regex, function(m, n) {
									return '<img src="' + emo_list[n] + '" class="tb_chat_message_emo">'
								}) || '未知数据') + '</div></div><div style="clear:both"></div>';
							} else {
								p.className += ' user';
								p.innerHTML = '<div class="tb_chat_pleft"><img class="tb_chat_avatar" src="http://tb.himg.baidu.com/sys/portrait/item/' + user_portrait + '" alt></div><div class="tb_chat_pright"><div class="tb_chat_message_inner">' + (t.message[c].content[0].text.replace(emo_regex, function(m, n) {
									return '<img src="' + emo_list[n] + '" class="tb_chat_message_emo">'
								}) || '未知数据') + '</div></div><div style="clear:both"></div>';
							}
							p.setAttribute('msg_id', t.message[c].msg_id);
							p.title = 'Post @ ' + get_locale_time(t.message[c].time);
							panel_msg.appendChild(p);
							if (parseInt(t.message[c].msg_id, 10) < parseInt(this_early_msg, 10) || this_early_msg == 0) this_early_msg = t.message[c].msg_id;
							if (parseInt(t.message[c].msg_id, 10) > parseInt(this_last_msg, 10) || this_last_msg == 0) this_last_msg = t.message[c].msg_id;
							//console.log(this_early_msg+'|'+this_last_msg);
						}
						panel_msg.scrollTop = panel_msg.scrollHeight;
					}
					this_userid = id;
					if (!document.getElementsByClassName('tb_chat_msg_panel')[0]) {
						var msg_panel = document.createElement('div');
						var msg_textarea = document.createElement('textarea');
						var msg_send = document.createElement('div');
						msg_panel.style.cssText = 'width:100%;height:100px;position:absolute;bottom:0;left:0';
						msg_panel.className = 'tb_chat_msg_panel';
						panel_main.appendChild(msg_panel);
						msg_textarea.style.cssText = 'width:385px;height:52px;font-size:13px;line-height: 1.5em;margin:7px;padding: 5px;box-sizing: border-box;position:absolute;left:0;top:0;resize:none';
						msg_textarea.className = 'tb_chat_msg_textarea';
						msg_panel.appendChild(msg_textarea);
						msg_send.style.cssText = 'width:50px;height:25px;font-size:14px;line-height:25px;text-align:center;position:absolute;right:6px;bottom:8px;background:#5b97ff;cursor:pointer;color:#ffffff';
						msg_send.textContent = '发送';
						msg_panel.appendChild(msg_send);
						var panel_emoji = document.createElement('div');
						var msg_emoji = document.createElement('div');
						msg_emoji.style.cssText = 'width:50px;height:25px;font-size:14px;line-height:25px;text-align:center;position:absolute;right:66px;bottom:8px;background:#5b97ff;cursor:pointer;color:#ffffff';
						msg_emoji.textContent = '表情';
						msg_panel.appendChild(msg_emoji);
						panel_emoji.className = 'tb_chat_msg_emoji';
						for (var i in emo_list) {
							var panel_emoji_sub = document.createElement('img');
							panel_emoji_sub.src = emo_list[i];
							panel_emoji_sub.setAttribute('title', i);
							panel_emoji.appendChild(panel_emoji_sub);
							panel_emoji_sub.onclick = function() {
								msg_textarea.value += '#(' + this.getAttribute('title') + ')'
							}
						}
						msg_panel.appendChild(panel_emoji);
						msg_send.onclick = function() {
							if (msg_textarea.value != '') {
								add_message(id, this_last_msg, msg_textarea.value);
								if (panel_emoji.hasAttribute('show')) panel_emoji.removeAttribute('show');
							}
						};
						msg_textarea.onfocus = function(event) {
							msg_textarea.onkeydown = function(event) {
								if (event.ctrlKey == 1 && event.keyCode == 13 && msg_textarea.value != '') {
									add_message(id, this_last_msg, msg_textarea.value);
									if (panel_emoji.hasAttribute('show')) panel_emoji.removeAttribute('show');
								}
							};
						};
						msg_textarea.onblur = function() {
							msg_textarea.onkeydown = null;
						};
						msg_emoji.onclick = function() {
							if (panel_emoji.hasAttribute('show')) panel_emoji.removeAttribute('show');
							else panel_emoji.setAttribute('show', '1');
						}
						window.onfocus = function() {
							if (this_msg_update == null) this_msg_update = setInterval(function() {
								if (document.getElementsByClassName('tb_chat_msg_panel')[0] && panel.hasAttribute('show')) get_latest_msg(id)
							}, 10000);
						};
						window.onblur = function() {
							if (this_msg_update != null) {
								clearInterval(this_msg_update);
								this_msg_update = null;
							}
						};
						panel_top_left.textContent = '←';
						panel_top_right.textContent = '≡';
						msg_textarea.focus();
						panel_top_right.onclick = function() {
							switch (prompt('请键入以下数字并点击“确定”以完成对应操作：\n1. 清空当前用户全部聊天记录\n2. 从聊天列表内删除当前用户\n\n（比较简陋真是抱歉了 _(:з」∠)_ ）')) {
							case '1':
								delete_msg(id);
								break;
							case '2':
								delete_user(id);
								break;
							}
						};
						panel_top_left.onclick = function() {
							get_chatting_list(chatting_list_page);
							if (this_msg_update != null) {
								clearInterval(this_msg_update);
								this_msg_update = null;
							}
							window.onfocus = null;
							window.onblur = null;
						};
					}
				}
				get_message_update();
			} else {
				var s = show_error(t.error_code, t.error_msg);
				var t = setTimeout(function() {
					s.parentElement.removeChild(s);
				}, 5000);
				s.onclick = function() {
					get_latest_msg(id);
					s.parentElement.removeChild(s);
					clearTimeout(t);
				};
				throw 'Tieba Chat Error ' + t.error_code + ': ' + t.error_msg;
			}
		}
	};
	xhr.open('POST', '//tieba.baidu.com/c/s/recentmsg?' + get_string({
		//BDUSS:BDUSS,
		_client_id: _client_id,
		_client_type: _client_type,
		_client_version: _client_version,
		_phone_imei: _phone_imei,
		com_id: id,
		msg_id: this_last_msg,
		net_type: net_type,
		user_id: user_id
	}));
	xhr.send();
}

function get_early_msg(id, panel_msg, msg_more) {
	msg_more.textContent = '正在载入......';
	var scroll_top = panel_msg.scrollHeight - panel_msg.scrollTop;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var t = JSON.parse(xhr.responseText);
			if (t.error_code == '0') {
				if (t.error && t.error.errno != '0') {
					var s = show_error(t.error.errno, t.error.errmsg);
					var t = setTimeout(function() {
						s.parentElement.removeChild(s);
					}, 5000);
					s.onclick = function() {
						get_early_msg(id, panel_msg, msg_more);
						s.parentElement.removeChild(s);
						clearTimeout(t);
					};
					throw 'Tieba Chat Error ' + t.error.errno + ': ' + t.error.errmsg;
				}
				var xxx = document.createElement('div');
				//console.log(this_early_msg+'|'+this_last_msg);
				panel_msg.insertBefore(xxx, msg_more.nextElementSibling);
				for (var c in t.message) {
					if (t.message[c].content.length == 0) continue;
					var p = document.createElement('div');
					p.className = 'tb_chat_message';
					if (t.message[c].from == '0') {
						p.className += ' com';
						p.innerHTML = '<div class="tb_chat_pleft"><img class="tb_chat_avatar" src="http://tb.himg.baidu.com/sys/portrait/item/' + com_portrait + '" alt></div><div class="tb_chat_pright"><div class="tb_chat_message_inner">' + (t.message[c].content[0].text.replace(emo_regex, function(m, n) {
							return '<img src="' + emo_list[n] + '" class="tb_chat_message_emo">'
						}) || '未知数据') + '</div></div><div style="clear:both"></div>';
					} else {
						p.className += ' user';
						p.innerHTML = '<div class="tb_chat_pleft"><img class="tb_chat_avatar" src="http://tb.himg.baidu.com/sys/portrait/item/' + user_portrait + '" alt></div><div class="tb_chat_pright"><div class="tb_chat_message_inner">' + (t.message[c].content[0].text.replace(emo_regex, function(m, n) {
							return '<img src="' + emo_list[n] + '" class="tb_chat_message_emo">'
						}) || '未知数据') + '</div></div><div style="clear:both"></div>';
					}
					p.setAttribute('msg_id', t.message[c].msg_id);
					p.title = 'Post @ ' + get_locale_time(t.message[c].time);
					if (parseInt(t.message[c].msg_id, 10) < parseInt(this_early_msg, 10) || this_early_msg == 0) this_early_msg = t.message[c].msg_id;
					if (parseInt(t.message[c].msg_id, 10) > parseInt(this_last_msg, 10) || this_last_msg == 0) this_last_msg = t.message[c].msg_id;
					xxx.appendChild(p);
					//console.log(this_early_msg+'|'+this_last_msg+'|'+t.message[c].msg_id);
				}
				if (t.has_more == 1) msg_more.textContent = '点击加载更多';
				else msg_more.parentElement.removeChild(msg_more);
				panel_msg.scrollTop = panel_msg.scrollHeight - scroll_top;
			} else {
				var s = show_error(t.error_code, t.error_msg);
				var t = setTimeout(function() {
					s.parentElement.removeChild(s);
				}, 5000);
				s.onclick = function() {
					get_early_msg(id, panel_msg, msg_more);
					s.parentElement.removeChild(s);
					clearTimeout(t);
				};
				throw 'Tieba Chat Error ' + t.error_code + ': ' + t.error_msg;
			}
		}
	};
	xhr.open('POST', '//tieba.baidu.com/c/s/historymsg?' + get_string({
		//BDUSS:BDUSS,
		_client_id: _client_id,
		_client_type: _client_type,
		_client_version: _client_version,
		_phone_imei: _phone_imei,
		com_id: id,
		msg_id: this_early_msg,
		net_type: net_type,
		user_id: user_id
	}));
	xhr.send();
}

function add_message(id, last_msg_id, content) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var t = JSON.parse(xhr.responseText);
			if (t.error_code == '0') {
				if (t.error && t.error.errno != '0') {
					var s = show_error(t.error.errno, t.error.errmsg);
					var t = setTimeout(function() {
						s.parentElement.removeChild(s);
					}, 5000);
					s.onclick = function() {
						add_message(id, last_msg_id, content);
						s.parentElement.removeChild(s);
						clearTimeout(t);
					};
					throw 'Tieba Chat Error ' + t.error.errno + ': ' + t.error.errmsg;
				}
				var panel_msg = document.getElementsByClassName('tb_chat_panel_msg')[0];
				for (var c in t.recent.message) {
					if (t.recent.message[c].content.length == 0) continue;
					var p = document.createElement('div');
					p.className = 'tb_chat_message';
					if (t.recent.message[c].from == '0') {
						p.className += ' com';
						p.innerHTML = '<div class="tb_chat_pleft"><img class="tb_chat_avatar" src="http://tb.himg.baidu.com/sys/portrait/item/' + com_portrait + '" alt></div><div class="tb_chat_pright"><div class="tb_chat_message_inner">' + (t.recent.message[c].content[0].text.replace(emo_regex, function(m, n) {
							return '<img src="' + emo_list[n] + '" class="tb_chat_message_emo">'
						}) || '未知数据') + '</div></div><div style="clear:both"></div>';
					} else {
						p.className += ' user';
						p.innerHTML = '<div class="tb_chat_pleft"><img class="tb_chat_avatar" src="http://tb.himg.baidu.com/sys/portrait/item/' + user_portrait + '" alt></div><div class="tb_chat_pright"><div class="tb_chat_message_inner">' + (t.recent.message[c].content[0].text.replace(emo_regex, function(m, n) {
							return '<img src="' + emo_list[n] + '" class="tb_chat_message_emo">'
						}) || '未知数据') + '</div></div><div style="clear:both"></div>';
					}
					p.setAttribute('msg_id', t.recent.message[c].msg_id);
					p.title = 'Post @ ' + get_locale_time(t.recent.message[c].time);
					panel_msg.appendChild(p);
					if (parseInt(t.recent.message[c].msg_id, 10) < parseInt(this_early_msg, 10) || this_early_msg == 0) this_early_msg = t.recent.message[c].msg_id;
					if (parseInt(t.recent.message[c].msg_id, 10) > parseInt(this_last_msg, 10) || this_last_msg == 0) this_last_msg = t.recent.message[c].msg_id;
				}
				var p = document.createElement('div');
				p.className = 'tb_chat_message';
				p.className += ' user';
				p.innerHTML = '<div class="tb_chat_pleft"><img class="tb_chat_avatar" src="http://tb.himg.baidu.com/sys/portrait/item/' + user_portrait + '" alt></div><div class="tb_chat_pright"><div class="tb_chat_message_inner">' + (t.message.content[0].text.replace(emo_regex, function(m, n) {
					return '<img src="' + emo_list[n] + '" class="tb_chat_message_emo">'
				}) || '未知数据') + '</div></div><div style="clear:both"></div>';
				p.setAttribute('msg_id', t.message.msg_id);
				p.title = 'Post @ ' + get_locale_time(t.message.time);
				panel_msg.appendChild(p);
				if (parseInt(t.message.msg_id, 10) < parseInt(this_early_msg, 10) || this_early_msg == 0) this_early_msg = t.message.msg_id;
				if (parseInt(t.message.msg_id, 10) > parseInt(this_last_msg, 10) || this_last_msg == 0) this_last_msg = t.message.msg_id;
				panel_msg.scrollTop = panel_msg.scrollHeight;
				document.getElementsByClassName('tb_chat_msg_textarea')[0].value = '';
				document.getElementsByClassName('tb_chat_msg_textarea')[0].focus();
			} else {
				var s = show_error(t.error_code, t.error_msg);
				var t = setTimeout(function() {
					s.parentElement.removeChild(s);
				}, 5000);
				s.onclick = function() {
					add_message(id, last_msg_id, content);
					s.parentElement.removeChild(s);
					clearTimeout(t);
				};
				throw 'Tieba Chat Error ' + t.error_code + ': ' + t.error_msg;
			}
		}
	};
	xhr.open('POST', '//tieba.baidu.com/c/s/addmsg?' + get_string({
		//BDUSS:BDUSS,
		_client_id: _client_id,
		_client_type: _client_type,
		_client_version: _client_version,
		_phone_imei: _phone_imei,
		com_id: id,
		content: content,
		last_msg_id: last_msg_id,
		net_type: net_type,
		user_id: user_id
	}));
	xhr.send();
}

function show_error(c, t) {
	var panel_error = document.createElement('div');
	panel_error.className = 'tb_chat_error';
	panel.appendChild(panel_error);
	panel_error.innerHTML = 'Tieba Chat Error!!!<br>Error Code: ' + c + '<br>Error Message:' + t + '<br>Click this panel to retry....';
	return panel_error;
}

function get_userid(username) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var t = JSON.parse(xhr.responseText);
			if (t.no == 0) {
				this_username = username;
				this_last_msg = 0;
				this_early_msg = 0;
				//this_userid=t.data.id;
				get_latest_msg(t.data.id);
			} else {
				var s = show_error(t.no, t.error);
				var t = setTimeout(function() {
					s.parentElement.removeChild(s);
				}, 5000);
				s.onclick = function() {
					get_userid(username);
					s.parentElement.removeChild(s);
					clearTimeout(t);
				};
				throw 'Tieba Chat Error ' + t.no + ': ' + t.error;
			}
		}
	};
	xhr.open('POST', '//tieba.baidu.com/home/get/panel?ie=utf-8&un=' + encodeURIComponent(username));
	xhr.send();
}

function delete_msg(id) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var t = JSON.parse(xhr.responseText);
			if (t.error.errno == "0" && t.error_code == "0") {
				alert('清除成功！');
				document.getElementsByClassName('tb_chat_panel_msg')[0].innerHTML = '';
			} else {
				var s = show_error(t.error_code, t.error_msg);
				var t = setTimeout(function() {
					s.parentElement.removeChild(s);
				}, 5000);
				s.onclick = function() {
					delete_msg(id);
					s.parentElement.removeChild(s);
					clearTimeout(t);
				};
				throw 'Tieba Chat Error ' + t.error_code + ': ' + t.error_msg;
			}
		}
	};
	xhr.open('POST', '//tieba.baidu.com/c/s/clearmsg?' + get_string({
		_client_id: _client_id,
		_client_type: _client_type,
		_client_version: _client_version,
		_phone_imei: _phone_imei,
		com_id: id,
		net_type: net_type,
		user_id: user_id
	}));
	xhr.send();
}

function delete_user(id, silent) {
	var silent = silent || false;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var t = JSON.parse(xhr.responseText);
			if (t.error.errno == "0" && t.error_code == "0") {
				if (silent == false) {
					alert('删除成功！');
					if (this_msg_update != null) {
						clearInterval(this_msg_update);
						this_msg_update = null;
					}
					window.onfocus = null;
					window.onblur = null;
				}
				get_chatting_list(chatting_list_page);
			} else {
				var s = show_error(t.error_code, t.error_msg);
				var t = setTimeout(function() {
					s.parentElement.removeChild(s);
				}, 5000);
				s.onclick = function() {
					delete_msg(id);
					s.parentElement.removeChild(s);
					clearTimeout(t);
				};
				throw 'Tieba Chat Error ' + t.error_code + ': ' + t.error_msg;
			}
		}
	};
	xhr.open('POST', '//tieba.baidu.com/c/s/delcom?' + get_string({
		_client_id: _client_id,
		_client_type: _client_type,
		_client_version: _client_version,
		_phone_imei: _phone_imei,
		com_id: id,
		net_type: net_type,
		tbs: PageData.tbs ? PageData.tbs : get_tbs(),
		user_id: user_id
	}));
	xhr.send();
}

function get_tbs() {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200) return JSON.parse(xhr.responseText).tbs;
	};
	xhr.open('GET', '//tieba.baidu.com/dc/common/tbs');
	xhr.send();
}

function insert_chat_button(event) {
	if (event.animationName == 'nodeInserted') {
		var button = document.createElement('a');
		var node = event.target;
		button.className = 'btn_chat';
		node.parentElement.insertBefore(button, node);
		button.onclick = function() {
			if (document.getElementById('user_visit_card')) get_userid(JSON.parse(document.getElementById('user_visit_card').getAttribute('data-field')).un);
			else if (PageData.product == 'ihome') get_userid(ihome.Interaction.dataObj.un);
			panel.setAttribute('show', '1');
		};
	}
}

var message_update_timer = setInterval(function() {
	if ((new Date().getTime() - (window.localStorage.getItem('tb_chat_message_update_timestamp') || message_update_timestamp)) > 10000) {
		get_message_update();
	} else if (window.localStorage.getItem('tb_chat_message_update_count') != '0') {
		document.title = '【' + window.localStorage.getItem('tb_chat_message_update_count') + ' 条新聊天】' + original_title;
		panel_top.style.color = 'orange';
	} else {
		document.title = original_title;
		panel_top.style.color = '#414243';
	}
}, 1000);

// ------------------------------------------------------------------------


var panel = document.createElement('div');
var panel_top = document.createElement('div');
var panel_head = document.createElement('div');
var panel_main = document.createElement('div');
var panel_top_left = document.createElement('div');
var panel_top_right = document.createElement('div');
var panel_ifshow = null;
var original_title = document.title;
var ss = document.createElement('style');
var stylesheet = '.tb_chat_panel{width:400px;height:100%;position:fixed;top:calc(100% - 30px);right:0px;background:rgba(255,255,255,.85);z-index:200000;transition:all 0.5s /*ease-in*/cubic-bezier(.5,0,.8,1);-webkit-user-select:none;-moz-user-select:none;border:1px solid #cccccc;font-size:14px;color:#414243}.tb_chat_panel[show]{top:0px;transition:all 0.5s /*ease-out*/cubic-bezier(0,.5,.8,1)}.tb_chat_panel_top{font-size:14px;line-height:30px;text-align:center;width:100%;height:30px;-webkit-user-select:none;-moz-user-select:none;border-bottom:1px solid #cccccc}.tb_chat_panel_top_left{position:absolute;left:10px;top:3px;width:24px;height:24px;line-height:24px;background:#5b97ff;opacity:0;color:#ffffff;cursor:pointer;text-align:center;border-radius:50%;transition:all 0.5s ease-out}.tb_chat_panel[show] .tb_chat_panel_top_left{opacity:1;transition:all 0.5s ease-in}.tb_chat_panel_top_right{position:absolute;right:10px;top:3px;width:24px;height:24px;line-height:24px;background:#5b97ff;opacity:0;color:#ffffff;cursor:pointer;text-align:center;border-radius:50%;transition:all 0.5s ease-out}.tb_chat_panel[show] .tb_chat_panel_top_right{opacity:1;transition:all 0.5s ease-in}.tb_chat_panel_main{height:calc(100% - 30px);overflow:auto}.tb_chat_row{/*width:400px;*/height:60px;padding:10px;cursor:pointer}.tb_chat_row:hover{background:rgba(0,0,0,.1)}.tb_chat_pleft{float:left}.tb_chat_row .tb_chat_avatar{width:60px;height:60px}.tb_chat_pright{float:left;max-width:300px}.tb_chat_row .tb_chat_username{font-size:14px;padding:6px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.tb_chat_row .tb_chat_lasttext{padding:6px;font-size:12px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.tb_chat_next{font-size:14px;text-align:center;width:100%;height:30px;line-height:30px}.tb_chat_message{font-size:13px;line-height:1.5em;min-height:28px;padding:5px}.tb_chat_message .tb_chat_avatar{width:32px;height:32px}.tb_chat_message.user .tb_chat_pleft,.tb_chat_message.user .tb_chat_pright{float:right;text-align:justify}.tb_chat_message .tb_chat_message_inner{margin:0 10px;padding:6px;background:#ffffff;border:1px solid #cccccc;border-radius:3px;-moz-user-select:text;-webkit-user-select:text;text-align:justify;overflow:hidden}.tb_chat_panel_msg{margin-bottom:100px;height:calc(100% - 100px);overflow:auto}.tb_chat_error{background:rgba(255,0,0,.25);font-size:12px;line-height:16px;position:fixed;width:350px;margin:0 25px;top:50px;right:0px;box-shadow:rgba(255,0,0,0.25) 0 0 5px;color:#ffffff;padding:5px;box-sizing:border-box}.tb_chat_message_inner::selection,.tb_chat_message_inner::-moz-selection{background:rgba(255,255,255,0.5)}.tb_chat_panel[model="1"] .tb_chat_panel_top,.tb_chat_panel[model="2"] .tb_chat_panel_top,.tb_chat_panel[model="2"] .tb_chat_row{color:red!important}.btn_sendmsg{animation:nodeInserted 0.01s;-webkit-animation:nodeInserted 0.01s;-o-animation:nodeInserted 0.01s;-ms-animation:nodeInserted 0.01s}@keyframes nodeInserted{from{opacity:1}to{opacity:1}}@-webkit-keyframes nodeInserted{from{opacity:1}to{opacity:1}}@-o-keyframes nodeInserted{from{opacity:1}to{opacity:1}}@-ms-keyframes nodeInserted{from{opacity:1}to{opacity:1}}.btn_chat{cursor:pointer;margin-left:8px;background-image:url(http://imgsrc.baidu.com/forum/pic/item/c28b2d6d55fbb2fb8303a7d94d4a20a44723dcb3.jpg)!important;background-position:0 0!important}.btn_chat:hover{background-position:-86px 0!important}.btn_chat:active{background-position:-172px 0!important}.interaction_wrap_theme1 .btn_chat{background-position:0 -22px!important;width:70px!important}.interaction_wrap_theme1 .btn_chat:hover{background-position:-86px -22px!important}.interaction_wrap_theme1 .btn_chat:active{background-position:-172px -22px!important}.tb_chat_message_emo,.tb_chat_msg_emoji img{width:20px;height:20px}.tb_chat_msg_emoji img{cursor:pointer}.tb_chat_msg_emoji{width:380px;height:140px;padding:9px;border:1px solid #cccccc;position:absolute;bottom:100px;background:#ffffff;transition:all 0.1s linear;opacity:0;pointer-events:none}.tb_chat_msg_emoji[show]{opacity:1;pointer-events:auto}';
panel.className = 'tb_chat_panel';
document.body.appendChild(panel);
ss.textContent = stylesheet;
panel.appendChild(ss);
panel_top.className = 'tb_chat_panel_top';
panel.appendChild(panel_top);
panel_head.textContent = '贴吧聊天';
panel_top.appendChild(panel_head);
panel_top_left.className = 'tb_chat_panel_top_left';
panel_top_left.textContent = '+';
panel_top.appendChild(panel_top_left);
panel_top_right.className = 'tb_chat_panel_top_right';
panel_top_right.textContent = '≡';
panel_top.appendChild(panel_top_right);
panel_main.className = 'tb_chat_panel_main';
panel.appendChild(panel_main);

panel_top.onmouseover = function() {
	if (!panel.hasAttribute('show')) {
		if (this_userid == 0) get_chatting_list(chatting_list_page);
		else get_latest_msg(this_userid);
	}
	panel.setAttribute('show', '1');
};
panel.onmouseover = function() {
	if (panel_ifshow != null) clearTimeout(panel_ifshow);
};
panel.onmouseout = function() {
	panel_ifshow = setTimeout(function() {
		if (panel.hasAttribute('show')) panel.removeAttribute('show');
		panel_ifshow = null;
	}, 500);
};
panel_top_left.onclick = function() {
	var username = prompt('请输入用户名以发起聊天');
	if (username != null && username != '') get_userid(username);
};
get_chatting_list(chatting_list_page);
document.addEventListener('animationstart', insert_chat_button, false);
document.addEventListener('MSAnimationStart', insert_chat_button, false);
document.addEventListener('webkitAnimationStart', insert_chat_button, false);