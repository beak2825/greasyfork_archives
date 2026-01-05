// ==UserScript==
// @name User Agent Change Mod
// @namespace http://www.sephiroth-j.de/mozilla/
// @include chrome://browser/content/browser.xul
// @include http://www.icbc.com.cn/*
// @include https://www.icbc.com.cn/*
// @include https://mybank.icbc.com.cn/*
// @include https://mybank1.icbc.com.cn/*
// @include http://www.useragentstring.com/
// @include http://www.useragentstring.com/*
// @version 0.4.2
// @description 伪装 Firefox 版本为 10 使得其能够使用工商银行网上银行组件
// @downloadURL https://update.greasyfork.org/scripts/3921/User%20Agent%20Change%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/3921/User%20Agent%20Change%20Mod.meta.js
// ==/UserScript==
var ucjs_UAChanger = {
//----讲解开始----
//（1）在url后面添加网站，注意用正则表达式 Mozilla/5.0 (iPad; U; CPU OS 4_3_1 like Mac OS X;) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8G4 Safari/6533.18.5

// 正则表达式简单教程：先把网址里的/换成\/
// 然后把.换成\.
// 比如 www.google.com/for.com 就是 www\.google\.com\/for\.com

// *代表任意位数的字母数字，推荐看http://msdn.microsoft.com/zh-cn/library/cc295435.aspx
// 所以要通吃 http和 https 可以用 http*: 或者https?: 或者 http+:
// 要通吃www.google.com/reader/2.html和 www.google.com/music/2.html,就用www\.google\.com\/*\/2\.html

// www.google.com/chrome.exe 一般通配符就可以写成2种（.*包含了所有后缀名）
// 即 www\.google\.com\/.exe或者www\.google\.com\/.*

//（2）在idx后面添加数字( 按照你添加的 UA字符串 的顺序，注意分隔线也要算 )
// 数字 0 是指其他版本的Firefox
// 讲解结束，开始实战

// 添加网站开始，不想要的前面添加 //
SITE_LIST: [

// 在 http://www.google.co.jp/m 伪装成日本DoCoMo手机
// {url: "http:\/\/www\.google\.co\.jp\/m\/.*",//此处添加网址
// idx: 4 },//此处添加你需要的useragent的顺序号，注意分隔线也要算

// {url: "http:\/\/kuai\.xunlei\.com\/*", idx: 6 },

// {url: "http:\/\/www\.xunlei\.com\/*", idx: 2 },
// {url: "http:\/\/kankan\.xunlei\.com\/*", idx: 2 },

// {url: "http:\/\/vdisk\.weibo\.com\/wap\/*",idx: 5 },

{url: "http:\/\/www\.icbc\.com\.cn\/*",idx: 1 },
{url: "https:\/\/www\.icbc\.com\.cn\/*",idx: 1 },
{url: "https:\/\/mybank\.icbc\.com\.cn\/*",idx: 1 },
{url: "https:\/\/mybank1\.icbc\.com\.cn\/*",idx: 1 },

{url: "http:\/\/www\.useragentstring\.com\/",idx: 1 },

//添加网站到此结束
],

//自己在底下添加ua
UA_LIST: [


// 1) 伪装Firefox10.0
{name: "Firefox10.0",
ua: "Mozilla/5.0 (Windows NT 6.1; rv:10.0.6) Gecko/20120716 Firefox/10.0.6",
label: "Firefox10.0",
img: "url(data:image/png;base64,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)"},


// 2)
{name: "Firefox-Mac",
ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:10.0) Gecko/20100101 Firefox/10.0.1",
label: "Firefox-Mac",
img: "url(data:image/png;base64,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)"},

// 3) 这是右键菜单的分隔线
{name: "分隔线",},

// 4) 伪装 iPhone，查询http://www.zytrax.com/tech/web/mobile_ids.html
{name: "iPhone",
ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3",
label: "iPhone",
img: "url(data:image/png;base64,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)"},

// 5) 伪装 Opera Mini
{name: "Opera Mini",
ua: "Opera/9.80 (J2ME/MIDP; Opera Mini/CLIENT_VERSION/SERVER_BUILD; U; LANGUAGE) Presto/2.5.2",
label: "Opera Mini",
img: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAQCAYAAAB3AH1ZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABJNJREFUeNp0VU1MFGcYfmZ/+CvEQTSIUkM0bYkcSiP2sFGMiSfTxDXGg2kwMTFtTErswXsPTXpo2tA0HjxqrLUHGwhysBoqSJuWVJDaEmAjgQLlZ5dld1mW3dndma/POzO7LIR+2Tcz8/09z/u8P6sppaBpGgpDBYM6KiqCUOo8P3VYFmhxmOYg4vE72sBAHCVDdXT8hj173sO+fRnk87Atk9lu2SxgGM4zl3PeJyYqHsXjo75tl50710rgbqTTTenUJubn/+WkwpsN9ags8wfh8XymTp26qg0N9RQP1da+gytXyqHr5fbFqRSwvg6srQGJBJBMgvdtmZAYHkaSezaB5iIBFQi0csMzmr4ciWL474lkGOirBDanQq8vBprf0uveqBRFulVLy1VtfPyOfXD/fqC+3jGvFwiFgMXFLUAhVVDi0iWgsRF48ADmwgJS3OcpemIY3WSuU2aEpmfxM6ybHyHX2YHcNRPqwvjMHGTN9mpjo0vpum6fE49kTgA8vK6uDlhZAZaWgDBdiEQcQnv3Am1twKFDQG8vyjhXxeM2AXX0aJDgTQKQo3Tr6Qy+hdnPpaisX0B+YN1wgRwSeiSXu24TkJiL7LImsosiVVUOgWjUmZMzx44BDx8WnAW1gq9AgODn7U209bUYUlAjnN2WbKQ5thpLwCJQnvFTqdRFTpbZCsRijtxjY44iJ05skRUFDh8GVleBp0+3bqOZLgmY9N7DbJeKkKQH7KrIbieA+JppIgPLPmhp2nEeqLGlF08ltrOzpFQGnDzpfDPZGC4gEABu33bypIQACgrE8hooKZYpZ9RhsOugD1h0LabZ3J3MF2/lKfb4sbP57FlHmQMHwLIG+vud0LhDc8HtW6Lks+lKksH/j7jLXCjWwscg55zkEy9FeiE/MQE8fw6cPo0cE87b3g715IkD6NnKeU8JCUSUOWh4yxG2QRQntZpd8HVG3iZhaF4sa9aUpKAAW4y/SfVExRDtdY/TJjZu3ECY8R+6dw+khD9IZObWLcRJOlcagjkr36NR0rhLgIK9zVdvKboFrVUI0Fcc9FXiV9MYFIwVAs7wwhifCVqcvSAyOoro4CBqz5xBhNInmIxybok58ldnJ3559QpD4niBwIfM37DK99XzYhYUw2HhO/iuF8B74f80xTkJz0FvBRbMXOgb4EfZ+g89zzPxqpqaUNPcDJ/fb4cizFpPTU1h8f79Yrn5XPPaGCy+YhlyfG8aH29AhVr81YhrlsTni0fwv6Q9Y1l2yVwr1xieZJdl3HRzERorp/rIEWxOT0ORTDVJSEgW7t7Fy8uXkWeCarvE01uahDJ+4IWhfCb4ibf8yzZ/9QdlXF6xcq2y1uBxovGnafR9bhpfs9hmC01KwBIvXsBkMzLYAVOTk0jPzcFkOLIsT88OYFUMqSSQ7cD2f0NJtnbgffatwHFPRYNMjFiZJbaYkd+BedfzcGHzT42NaxtK1aZZcpp0xWy2WGY7gc2S5iLvy1LNuxAoDCnaalclIctWh+TOTV95PMMJy3qXF2e8rrTKNc01VVK+hewv54/dY/I/AQYAwEl2sYLFCVcAAAAASUVORK5CYII=)"},

// 6) 分割线
{name: "分隔线",},

// 7) 伪装 IE8 - Windows7
{name: "IE8",//此处文字显示在右键菜单上，中文字符请转换成javascript编码，否则乱码(推荐http://rishida.net/tools/conversion/)
ua: "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0)",
label: "IE8",//此处文字显示在状态栏上，如果你设置状态栏不显示图标
img: "url(data:image/png;base64,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)"},

// 8) 伪装 Chrome22.0.1219.0 - Windows7
{name: "Chrome",
ua: "Mozilla/5.0 (Windows NT 6.1;) AppleWebKit/537.3 (KHTML, like Gecko) Chrome/22.0.1219.0 Safari/537.3",
label: "Chrome Win7",
img: "url(data:image/png;base64,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)"},

// 9) 伪装 Opera 10.60
{name: "Opera",
ua: "Opera/9.80 (Windows NT 6.1; U;) Presto/2.10.229 Version/11.61",
label: "Opera",
img: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAQCAYAAAB3AH1ZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABQNJREFUeNqkVV1vFUUYfuZjP0576jmtaNNSpaQRkUpyoEq0DURjvICQUMOdciHeKNFEE7ngQmOiiRoSgjH+AGIImhgtEa5UvokKgQCBWihQoIUWWtqzPW3P1+7M+M6enlpIoxdu8uzs7sy87zPP+7HMGAPGGKqX6e5Ow/e7Ycwmek1DaxACKHUMQbCHHT0aYN5l9/+fi80nYDZsyMBxeuixtTCTx9DQHesBTzQ1IuE6IBIBwnArO3Fif9XAmVXPziODFONsLRN4gQtoJtghD+aPq88ky8e76uFEGlFkEIWazBDKGnJuc2dnBoXCEUL67tg4Tl3qmxoFDiaA/JX+a5s7lz+VfrQ2YRXpMe3tW1lv757KEebUqxMSJ7jLVwqfgUsGxvGxLOuLxQRfTzrdWUiBOQIolXoIseT912/iMPT2r6F+pJnxHsi9vTcGj6xraYyPSUrsNun0fhYEgXDnxNwsEmylk+SQNRzCiwmAR7x1tDXxpQCGYLCPFt4ikJzIEPf1MQHT1taNXK7VOg+jCLlCEeT8kHVu519DdPRAqQxMTmI2J9JjYbiNpr7gTkUBJtnrbkrATXO4dQKihoFEwKTkfbnGxOoEzBYF7DBGj2vOBOesnvBXRYFcblM8kvFcOcQMzFl6Cx4Uy5y/n53MNEBDkwpG6830cRfFmZihkWRfY0/vzZKQSQGfG9xI+gO6Vm7wygoh8SQVFtm805pZHI8JKDo9J+eVifg89lZ+KFzBhFIoEgFluTLWQRvqHF0cp+VdnuQp1zfDbpLfrkmrpJ9WK7jjZYeTtROuFI9UM8VYAZUBFwZCzRLIRsRGhYisGKDAQSxYMvdnk8YS8Bg9mdC7triLVqvRfNOSnUHz0zmVWpRL+fmB5f7FZJN/OjXqu2/6iiGiEyvBY8dUKeCMFbhgv8cExkmX/Kzh4r/UrI2JrXorUj3kCEjUX1e96wvBP3V9t9PzuOf5AlnPxaBce6PZWbZJyO86QuU/r2AkAZFhKBOKmp3TYIMxgTGjjknhvTShSmSc5AGrW8B/OkdzldML3GX6Cj1GolxYJR3xsqMiSO2AEyRJrJj7ZHvi8pYlNUMjl/ljb91jMpGl+Guj6+rcMPl4g/qJcsnEBAZ1tL9Nep8EqBBIAcsejgOxzVgCVoGlMoEfwulj9DhtlO4yksVxjWGbDTNw2cTVJe7pjnpmXnkxkZ0h1reQ5AEljw/DWsjQt9auDTjeAM6PmuhgIxmeofc8udsLua3q/Gc4H8zQNxueZuHjtgr7vwJsj8hrpTs0dTdlHYeU6eUIhSJDA64NpOW9NhO5MJGoJawwEe9ExFcjFMqEoo9QIWCvfar09jRMf7uTRMC0rYPPD8A5RzhCZbnbfsvQHIVnarcubactw3EFKb2anE+R8+tRKSoTqJkatLi9I8xEzZR5tIjcRLTTjhYaZ5hm04R/OuH3ZLA/Kna/J7ydzznJjS65uqfDjJ1r4pVoXFClg5+p0q6bwM1qkyLZP9LCnDTajBGZpaaMLZEpvNriDXBE0qVkgIV1BgsTj4cX/BlVk20dsGYF0NnB/Sb74awujpyn4U/bTisnH60u3rbjEKQr4bjU/SSHMi4aa4bF+5ld33gI3zGkwJxzWz4mJkHm0ffgv2BetR0HfiGchC4mZ9fYFlEgTP3X71UbjgY/qzye/xChf4optpGcLyanozReouT7jeLbV13/twADAOR3bc9NKSv6AAAAAElFTkSuQmCC)"},

// 10) 伪装 Safari
{name: "Safari",
ua: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.52.7 (KHTML, like Gecko) Version/5.1.7 Safari/534.52.7",
label: "Safari",
img: "url(data:image/png;base64,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)"},

// 11) 
{name: "分隔线",},

// 12) 伪装 Maxthon3
{name: "Maxthon3",
ua: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.12 (KHTML, like Gecko) Maxthon/3.3.4.4000 Safari/535.12",
label: "Maxthon3",
img: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACHElEQVQ4jX2T30tacRjGzx9wPDTMDrMfZJQwSoKQEKLLugmKWrddBV4spMZo0WC0Qb8wioq8KKJgVOgwFoNYgtCFFMFskbQiIVknKqIt0qwssc8uBMPt5AsfePjyPM/N+34FQWXEd79QQ82bHuwOoR87w+KJ8fLnQxoWTwz92Blid0i9SOwKYnJHqA88UOOLY3HfYJ6LYp6LYnHfUOOLUx94wOSOIHYF00s0nbuUusLUbSWodF7xYuyPKpXOK+q2EpS6wmg6dx9LZPshtf4EFfNh8l59UaWg/RtFH3eomA9T608g2w+TBZqOTUzuCFWeW4rtJzw1yu8orz/9oNh+QpXnFpM7gqZjE0Fq91O9Hqds9hzDgPJkAcDl9R2GAYWy2XOq1+NI7X4EybaBxXdPycQxBb2hlLmgN0RO6wI5rQv/vZdMHGPx3SPZNhCktjXMq3cUjSrkfQimjJl00aiCefUOqW0NQbJ6KffGMDiOeP5+N2XMpA2OI8q9MSSrF0FqcVE4pWB0XiB3B1LGTNrovKBwSkFqcSU3obWtYFy+JnfkgOy3WxnJHTnAuHyN1rbyeAdi8zTy4A6FX6PIQ0GevfmuijwUTHoGdxCbp9OvUWx0oOvbJn8xgn7mlOz+PbQ9AbQ9AbL799DPnJK/GEHXt43Y6FD/D1LTJFnWJXTD+8ifL9PQDe+TZV16OvxvkdjoQGoYR2oYT+qmSdXgXzjEQVt3sqxHAAAAAElFTkSuQmCC)"},

// 13) 伪装QQ浏览器
{name: "QQBrowser",
ua: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.15 Safari/535.11 QQBrowser/6.13.13461.201",
label: "QQBrowser",
img: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADTUlEQVQ4jbWSW0wTBhiFz+a0gJdWBFkRiiuBlox2aBRDZIoK4yJqE8VlF7sNqU4CKhAk9bIZRtQydURGwbRVUdTK3OrKNYIwQqZNFoqyZQjBMcyArnPKzaJVOHvAsexhjzvJ/3a+7+U/wP8U75AVsZsT0rIPJ36cp1uSmLJr9vwAxX+2V0T4x2WoFYc2RXt/tHFrvC6r2u6ofkz+zKm78Yw83TXMTdoiCzyE0n/B0cvFCcbj8RaJn4f0zd2fN5zoHWWJw8Xm0XGOuXs4/tzBPtc9Nj5y0ugkt51pcc4U+S6ZFhTkKEtUMSIVglWZKTeeUtv5lIaBCdY+HOb4UDE50UXyMV2uZtb+0sT0thFGas33AYgAAB+un5NemKW8tSijcWiDxcE99iHqf3Pzwh9k/X0bH/YUko5L5PBZTo7oWNNpYvK13zlPmVIAAJgLLMjM3PKnTNvOdcZuqpud/KRrjPoBN4sekF/eaef1hv10tmyh+0c12b+elvZiij841wtgJgDAS5lmDdley6hjbUw2/8q0Vifz747w1ICbqR2jXH31Nj+1XqT9++Mca0rkpH0hD5YemgREQQAAgSKjxS+pgm/sruWqog6qzD1UX+9jUtU9Rlt7Kft2kPKyH/j+1WqaGio4WB5EZ50v5eGS5CnB0h0WUfwl+qzWU5lh5dqTNsaebuPiI61U6O183fgTJYZu+uc3McZ0jUe+NnD0KyGL982rnxIEx+UI363iS8tKKF5XSul75ZTs/IbyA41cprvJyC9slB6zUXjARv+9VUw8Y6bZvIv9lbMmXjzTS+yXWukSba/jnKRyeq8pZYDKSLnmCiPy6hmxv4Ehe2v4aqqFAlUVFbnnqdFuvvOgTsLpPXjK4vZIC27TP/c7+qRa6ff2FUpUBoammCjbepaSDUYuiD1HRF6md0xud5Ym7PKwbc0/AgCYHbXtqOxkB8OKOyn97BaDcuoYqD7PRaoy+sYb6LmqnGs1hbSY3uofbE14cjA9vOJv9mUAHgAEgsClWYE79H3hJ25SWWKnXNfCgLwazn+nzDUrbGNlUkzA4Wx18KlI5UL1CwYAMAOAEEAQgMUAombMFWu8gpfne4auPCoQh2bjFUECgNcA+EwPCMBfkJvCviG8sLUAAAAASUVORK5CYII=)"},

// 14) 
{name: "分隔线",},

// 添加ua，到此结束
],
// ----- 下面设置开始 -----
// defautl: ステータスバーの右端に表示する
TARGET:null,// 定义一个target，用来调整状态栏顺序,null为空

PANEL_TYPE:true,// true:状态栏显示图标  false:显示文字

ADD_OTHER_FX: true,// true:自动添加其他版本firefox的ua  false:不添加

WIDE_WIDTH: 38,// 追加其他版本firefox状态栏宽度
NARROW_WIDTH: 26,// 不追加时状态栏宽度

//现有版本firefox的图标
NOW_UA_IMG: "url(data:image/png;base64,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)",
//其他版本firefox的图标
EXT_FX_LIST_IMG: "url(data:image/png;base64,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)",

//2种版本firefox，下面请勿修改
EXT_FX_LIST: [
{  name: "Firefox4.0",
ua: "Mozilla/5.0 (Windows; Windows NT 6.1; rv:2.0b2) Gecko/20100720 Firefox/4.0b2",
label: "Fx4.0",
img: ""},
{ name: "Firefox3.6",
ua: "Mozilla/5.0 (Windows; U; Windows NT 5.1; rv:1.9.2.8) Gecko/20100722 Firefox/3.6.8",
label: "Fx3.6",
img: ""},
],
// ----------------------
// UA リストのインデックス
def_idx: 0,
// 初期化
init: function() {
this.mkData();// UA データ(UA_LIST)を作る
this.mkPanel();// パネルとメニューを作る
// Observer 登録
var os = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
os.addObserver(this, "http-on-modify-request",false);
// イベント登録
var contentArea = document.getElementById("appcontent");
contentArea.addEventListener("load", this, true);
contentArea.addEventListener("select", this, false);
var contentBrowser = this.getContentBrowser();
contentBrowser.tabContainer.addEventListener("TabClose", this, false);
window.addEventListener("focus", this, true);
window.addEventListener("unload", this, false);
},
// UA データを作る
mkData: function() {
var ver = this.getVer();// 現在使っている Firefox のバージョン
// 現在使っている Firefox のデータを作る
var tmp = [];
tmp.name = "Firefox" + ver;
tmp.ua = "";
tmp.img = this.NOW_UA_IMG;
tmp.label = "Fx"+ (this.ADD_OTHER_FX? ver: "");
this.UA_LIST.unshift(tmp);
// Fx のバージョンを見て UA を追加する
if (this.ADD_OTHER_FX) {
if (ver == 3.6) {// Fx3.6 の場合 Fx4 を追加する
this.EXT_FX_LIST[0].img = this.EXT_FX_LIST_IMG;
this.UA_LIST.push(this.EXT_FX_LIST[0]);
} else {// Fx3.6 以外では Fx3.6 を追加する
this.EXT_FX_LIST[1].img = this.EXT_FX_LIST_IMG;
this.UA_LIST.push(this.EXT_FX_LIST[1]);
}
}
// 起動時の UA を 初期化 (general.useragent.override の値が有るかチェック 07/03/02)
var preferencesService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("");
if (preferencesService.getPrefType("general.useragent.override") != 0) {
for (var i = 0; i < this.UA_LIST.length; i++) {
    if (preferencesService.getCharPref("general.useragent.override") == this.UA_LIST[i].ua) {
    this.def_idx = i;
    break;
}
}
}
},
// UA パネルを作る
mkPanel: function() {
var uacPanel = document.createElement("statusbarpanel");
uacPanel.setAttribute("id", "uac_statusbar_panel");
if (this.PANEL_TYPE)
uacPanel.setAttribute("class", "statusbarpanel-iconic");
else
uacPanel.setAttribute("style", "min-width: " + (this.ADD_OTHER_FX? this.WIDE_WIDTH: this.NARROW_WIDTH) +"px; text-align: center; padding: 0px;");
var toolbar = document.getElementById("status-bar");
if (this.TARGET !=null) {// default から書き換えている場合
this.TARGET = document.getElementById(this.TARGET);
}
toolbar.insertBefore(uacPanel, this.TARGET);
this.setImage(this.def_idx);
// UA パネルのコンテクストメニューを作る
var MainPopup = document.getElementById("mainPopupSet");
var PopupMenu = MainPopup.appendChild(document.createElement("menupopup"));
PopupMenu.id = "uac_statusbar_panel-context";
for(var i = 0; i < this.UA_LIST.length; i++) {
if (this.UA_LIST[i].name == "分隔线" ) {
var mi = document.createElement("menuseparator");
PopupMenu.appendChild(mi);
}else{
var mi = document.createElement("menuitem");
mi.setAttribute("label", this.UA_LIST[i].name);
mi.setAttribute("oncommand", "ucjs_UAChanger.setUA(" + i + ");");
mi.setAttribute("type", "checkbox");
mi.setAttribute("checked", i==this.def_idx);
mi.setAttribute("uac-generated", true);
PopupMenu.appendChild(mi);
}
}
},
// URL 指定で User-Agent の書き換え(UserAgentSwitcher.uc.js より)
observe: function(subject, topic, data){
if(topic != "http-on-modify-request") return;
var http = subject.QueryInterface(Ci.nsIHttpChannel);
for(var i = 0;i < this.SITE_LIST.length; i++) {
if (http.URI && (new RegExp(this.SITE_LIST[i].url)).test(http.URI.spec)) {
var idx = (this.SITE_LIST[i].idx == 0)? this.UA_LIST.length-1: this.SITE_LIST[i].idx;
http.setRequestHeader("User-Agent", this.UA_LIST[idx].ua, false);
}
}
},
// イベント・ハンドラ
handleEvent: function(aEvent) {
var contentBrowser = this.getContentBrowser();
var uacPanel = document.getElementById("uac_statusbar_panel");
var uacMenu = document.getElementById("uac_statusbar_panel-context");
    switch(aEvent.type) {
case "popupshowing":// コンテクスト・メニュー・ポップアップ時にチェック・マークを更新する
var menu = aEvent.target;
for(var i = 0; i < menu.childNodes.length; i++) {
menu.childNodes[i].setAttribute("checked", i==ucjs_UAChanger.def_idx);
}
break;
case "DOMMouseScroll":// UA パネル上のホイール・スクロール
this.wheelChangeUA(aEvent);
break;
case "load":// SITE_LIST に登録された URL の場合
case "select":
case "focus":
case "TabClose":
for(var i = 0;i < ucjs_UAChanger.SITE_LIST.length; i++) {
if ((new RegExp(this.SITE_LIST[i].url)).test(contentBrowser.currentURI.spec)) {
var idx = (this.SITE_LIST[i].idx == 0)? this.UA_LIST.length-1: this.SITE_LIST[i].idx;
this.setImage(idx);
// パネルの変更を不可にする
uacPanel.setAttribute("context", "");
uacPanel.setAttribute("onclick", "event.stopPropagation();");
uacPanel.removeEventListener("DOMMouseScroll", this, false);
uacMenu.removeEventListener("popupshowing", this, false);
return;
}
}
this.setImage(this.def_idx);
// パネルの変更を可能にする
uacPanel.setAttribute("context", "uac_statusbar_panel-context");
uacPanel.setAttribute("onclick", "ucjs_UAChanger.resetUA(event);event.stopPropagation();");
uacPanel.addEventListener("DOMMouseScroll", this, false);
uacMenu.addEventListener("popupshowing", this, false);
break;
case "unload":// 終了処理
var os = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
os.removeObserver(this, "http-on-modify-request");
var contentArea = document.getElementById("appcontent");
contentArea.removeEventListener("load", this, true);
contentArea.removeEventListener("select", this, false);
contentBrowser.tabContainer.removeEventListener("TabClose", this, false);
window.removeEventListener("focus", this, true);
uacPanel.removeEventListener("DOMMouseScroll", this, false);
uacMenu.removeEventListener("popupshowing", this, false);
window.removeEventListener("unload", this, false);
break;
}
},
// パネルクリックで UA をリセット
resetUA : function(event){
if(event.button != 0) return;
this.def_idx = 0;
this.setUA(this.def_idx);
},
// パネル上のホイール・スクロールで UA を変更
wheelChangeUA: function(event){
this.hidePopup(document.getElementById("uac_statusbar_panel-context"));
if (event.detail > 0) {
this.def_idx++;
if ( this.def_idx > this.UA_LIST.length-1  ) this.def_idx = 0;
} else {
this.def_idx--;
if (this.def_idx < 0 ) this.def_idx = this.UA_LIST.length-1;
}
this.setUA(this.def_idx);
},
// パネル上のホイール・スクロール中はメニューを消す
hidePopup: function (menu) {
const Cc = Components.interfaces;
    var popupBox = null;
    var menuBox = null;
    try {
        popupBox = menu.boxObject.QueryInterface(Cc.nsIPopupBoxObject);
    } catch (e) {}
    try {
        menuBox = menu.parentNode.boxObject.QueryInterface(Cc.nsIMenuBoxObject);
    } catch (e) {}
    if (menuBox) menuBox.openMenu(false);
    else if (popupBox) popupBox.hidePopup();
 },
// 番号を指定して UA を設定
setUA: function(i) {
var preferencesService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService).getBranch("");
if ( i == 0 ){// オリジナル UA にする場合
// 既にオリジナル UA の場合は何もしない
if (preferencesService.getPrefType("general.useragent.override") == 0) return;
preferencesService.clearUserPref("general.useragent.override");
    } else {// 指定した UA にする場合
    preferencesService.setCharPref("general.useragent.override", this.UA_LIST[i].ua);
}
this.def_idx = i;
this.setImage(i);
},
// UA パネル画像とツールチップを設定
setImage: function(i) {
var uacPanel = document.getElementById("uac_statusbar_panel");
if (this.PANEL_TYPE) {
uacPanel.style.listStyleImage = this.UA_LIST[i].img;
uacPanel.style.padding = "0";
} else
uacPanel.setAttribute("label", this.UA_LIST[i].label);
uacPanel.setAttribute("tooltiptext", "User Agent("+ this.UA_LIST[i].name + ")");
},
// アプリケーションのバージョンを取得する(Alice0775 氏のスクリプトから頂きました。)
getVer: function(){
var info = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULAppInfo);
var ver = parseInt(info.version.substr(0,3) * 10,10) / 10;
return ver;
},
// 現在のブラウザオブジェクトを得る。
getContentBrowser:function(){
var windowMediator = Cc["@mozilla.org/appshell/window-mediator;1"]
.getService(Ci.nsIWindowMediator);
var topWindowOfType = windowMediator.getMostRecentWindow("navigator:browser");
if(topWindowOfType) return topWindowOfType.document.getElementById("content");
return null;
}
}
ucjs_UAChanger.init();