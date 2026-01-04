// ==UserScript==
// @name              腾讯漫画获取漫画地址
// @namespace         https://ac.qq.com/
// @description       通过DATA和nonce获取到解密后的图片地址。
// @match             *://ac.qq.com/*
// @version           0.1.0
// @author            部分代码来源于网络
// @compatible        Chrome
// @compatible        FireFox
// @downloadURL https://update.greasyfork.org/scripts/375727/%E8%85%BE%E8%AE%AF%E6%BC%AB%E7%94%BB%E8%8E%B7%E5%8F%96%E6%BC%AB%E7%94%BB%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/375727/%E8%85%BE%E8%AE%AF%E6%BC%AB%E7%94%BB%E8%8E%B7%E5%8F%96%E6%BC%AB%E7%94%BB%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

/*
 * 腾讯漫画
 * txmh_decode.getComic(params)
 * @params DATA, nonce
 * @return _v
 *
 */
var txmh_decode = {
	Base: function() {
		_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    this.decode = function(c) {
			var a = "",
			b, d, h, f, g, e = 0;
			for (c = c.replace(/[^A-Za-z0-9\+\/\=]/g, ""); e < c.length;) b = _keyStr.indexOf(c.charAt(e++)),
			d = _keyStr.indexOf(c.charAt(e++)),
			f = _keyStr.indexOf(c.charAt(e++)),
			g = _keyStr.indexOf(c.charAt(e++)),
			b = b << 2 | d >> 4,
			d = (d & 15) << 4 | f >> 2,
			h = (f & 3) << 6 | g,
			a += String.fromCharCode(b),
			64 != f && (a += String.fromCharCode(d)),
			64 != g && (a += String.fromCharCode(h));
			return a = _utf8_decode(a)
    };
    _utf8_decode = function(c) {
			for (var a = "",
			b = 0,
			d = c1 = c2 = 0; b < c.length;) d = c.charCodeAt(b),
			128 > d ? (a += String.fromCharCode(d), b++) : 191 < d && 224 > d ? (c2 = c.charCodeAt(b + 1), a += String.fromCharCode((d & 31) << 6 | c2 & 63), b += 2) : (c2 = c.charCodeAt(b + 1), c3 = c.charCodeAt(b + 2), a += String.fromCharCode((d & 15) << 12 | (c2 & 63) << 6 | c3 & 63), b += 3);
			return a
    }
	},
	getComic: function(data, nonce, callback) {
		var B = new this.Base();
		var T = data.split('');
		var N = nonce;
		var locate;
		var str;
		N = N.match(/\d+[a-zA-Z]+/g);
		var len = N.length;
		while (len--) {
			locate = parseInt(N[len]) & 255;
			str = N[len].replace(/\d+/g, '');
			T.splice(locate, str.length)
		}
		T = T.join('');
		var _v = JSON.parse(B.decode(T));
		callback(_v);
	}
};
//var DATA = 'eyJjb21pYyI6eyJpZCId6NTI2MzE4LCJ0aXRsZSI6Ilx1NTczMFx1NWU5Y1x1NGVlMeef1x1NzQwNlx1NGViYSIsImFydGlzdE5hbWUiOiJcdTZlMTRcdTZiNGNcdTViNTAiLCJjb3ZlclcVybCI6Imh0dHBzOlwvXC9tYW5odWEucXBpYy5jblwvdmVydGljYWxcLzBcLzE3XzE2XzfEyXzahhN2MzZjlhNWNmNDQ1MzY4MGNhMjk3NzI5ZTdiZjM2LmpwZ1wvMjEwIiwiZmluaXNoU3RhdGUiOmZhbHNlfSwiY2hhcHRlciI6eyJjaWQiOjE2OSwiY1RpdGxlIjoiMTYyIiwiY1NlcSI6IjE2MiIsInZpcFN0YXR1cyI6MiwicHJldkNpZCI6MTY4LCJuZXh0Q2lkIjoxNzAsImNhblJlYWQiOmZhbHNlLCJlaWQiOiJLbEJQVEVaRlZWRlVBZ29mQVFjQUJBa0JIRUZaVUNnPSJ9LCJwaWN0dXJlIjpbeyJwaWQiOiI2OTM5Iiwid2lkdGgiOjgwMCwiaGVpZ2h0IjoxMTMxLCJ1cmwiOiJodHRwczpcL1wvbWFuaHVhLnFwaWMuY25cL21hbmh1YV9kZXRhaWxcLzBcLzE3XzAyXzA0X2IzNWNkMTRmZTI5MzU3ZDZkMzVkNTRhMTExYzdhYjA3XzY5MzkuanBnXC84MDAifV19';
//var nonce = '974f19d5369757579c469a834eef1353';
// nonce = window['no' + 'nce'];
txmh_decode.getComic(DATA, nonce, function(res) {
	console.log(res);
});