// ==UserScript==
// @name        ★ pcbeta.com
// @namespace   pcbeta Scripts
// @description 精简PCBETA论坛界面
// @version     0.4.10
// @author      hoping
// @note        ---------------------------------------------------------------------------------------------------------
// @note        V0.4.10 适应新版界面
// @note        V0.4.9 顶部广告栏保留，不做任何处理，避免卡顿
// @note        V0.4.5 页面 504 时，中断美化
// @note        V0.4.5 版块信息栏样式更新
// @note        V0.4.5 回到顶部按钮居右
// @note        V0.4.3 Video 限定最大宽度
// @note        V0.4.3 自动展开隐藏的帖子内容
// @note        V0.4.2 注释 text-stroke 字体描边效果，若默认字体是粗体可尝试开启
// @note        V0.4.1 简单添加可跟随系统主题的 Dark 模式，默认关闭，查找 dark1 -> dark 启用
// @note        V0.4.1 全局字体适当加粗和阴影处理，如果已开启其他字体美化，查找 body，注释或删除 text-stroke text-shadow
// @note        V0.4.1 背景色稍做修改为 Win11 背景
// @note        V0.4.1 浏览页楼主上方添加“编辑”按钮
// @note        V0.4.0 标签页美化
// @note        V0.3.9 顶部分论坛导航，小于 960px 时，自动隐藏图片，防止文字换行
// @note        V0.3.9 屏幕小于 960px 时固定宽度 900px，可自定义
// @note        V0.3.9 版块信息条宽度自动计算，以防止在 960px 以下显示异常
// @note        V0.3.8 系统 Key 内容隐藏显示，并添加点击复制功能
// @note        V0.3.8 校验码 MD5|SHA1|CRC32|SHA-256 添加点击复制功能
// @note        V0.3.8 页面 520 时，防止美化，添加每 5 秒自动刷新功能，默认注释关闭
// @note        ---------------------------------------------------------------------------------------------------------
// @require     https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require     https://cdn.jsdelivr.net/npm/stickUp@2.3.1/src/stickUp.min.js
// @match       *://bbs.pcbeta.com/*
// @match       *://i.pcbeta.com/*
// @grant       GM_addStyle
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/446928/%E2%98%85%20pcbetacom.user.js
// @updateURL https://update.greasyfork.org/scripts/446928/%E2%98%85%20pcbetacom.meta.js
// ==/UserScript==

(function($, __css) {
	// 520
	if ($('title').text().indexOf('520: Web server is returning an unknown error') > -1 || $('title').text().indexOf('504 Bad Gateway') > -1) {
		//setTimeout(() => { location.href = location.href; }, 5000);
		return;
	}

	// 检测当前网址
	const urlHas = (r) => location.href.search(r) > -1;

	// 访问任务页自动打卡
	if (urlHas(/i\.pcbeta\.com\/home\.php\?mod\=task$/)) {
		setTimeout(() => { $.get('https://i.pcbeta.com/home.php?mod=task&do=apply&id=149'); }, 1000);
		return;
	}

	// 不处理以下页面
	if (!urlHas(/bbs\.pcbeta\.com/) ||
		urlHas(/mod=(?:post|mpdcp|attachment)/) ||
		urlHas(/(?:search)\.php/)
	) { return; }

	// 广告过滤提醒
	localStorage.setItem('adblock-detector-dialog', (Date.parse( new Date()) + 86399000).toString(36));
	$('#fwin_dialog, .ad, .a_pt, .a_pb, #fwin_dialog_cover').remove();

	// 标签页
	if (urlHas(/misc\.php/)) {
		$('.bm_c table tr:odd').css('background-color', 'var(--odd-bg)');
		return;
	}

	// 版块信息条
	$('h1.xs2').parent().parent().css({'padding': '0 0 0 20px', 'max-width': 'calc(var(--w) - 20px)', 'border-radius': '4px', 'border': '1px solid #ccc'});
	$('h1.xs2 span.xi2').css({'padding-right': '20px'});
	$('#wp > div').css('width', 'var(--w)');
	$('.x_l, .x_m, .x_r').css('width', '31%');

	// 列表偶数行背景色
	$('tbody[id^="normalthread"] tr:odd, tbody[id^="stickthread"] tr').css({'background-color': 'var(--odd-bg)'});

	// 回到顶部
	$('#scrolltop').css({'right': '10px'});

	// 导航条
	$('#pgt').removeClass('bn');
	$('.pgs').css({'height': 'auto'});
    $('#pt').css({'background':'#fff','width': 'auto','padding':'5px', 'box-shadow': 'var(--shadow)', 'border': '1px solid #ececec'});

    //$('#pt').css({'background':'#fff','width':'auto','padding':'5px'});

    // 清除顶部一些推广信息
    setTimeout(function(){
        var o = $('#scbar').prevAll('[class]');
        if(o.length>0 ) {
            console.log('begin to process PCBETA');
            var obj=$('#wp>div');
            for(var i in obj) {
                var tid=$(obj[i]).attr('id');
                if(tid=='scbar') break;
                if(typeof(tid)=='undefined') continue;
                console.log($(obj[i]), obj[i]);
                console.log(tid, ' 将要被删除');
                $(obj[i]).css({'display':'none !important', 'height':'0px', 'width': '0px', 'overflow':'hidden'});
//                $(obj[i]).remove();
                //adguard 会折腾掉 diynavtop 导致搜索栏会在处理完成后消失
                if(tid=='diynavtop') {
                    $(obj[i]).attr('id', 'xxx');
                }
            }
        }
        //$('#scbar').style({display:'block !important'});
    }, 1e3);

	// 浏览页
	if (urlHas(/viewthread/)) {
		// 上方添加编辑按钮
		if ($('a.editp') && $('a#replynotice')) {
			$('a#replynotice').after($('a.editp').clone()).after('<span class="pipe">|</span>');
		}
		// 展开全文
		if ($('button.btn-explanate').is(':visible')) {
			$('button.btn-explanate').click();
		}
		// 帖子内容
		$('td[id^="postmessage"]').each(function() {
			// 提取校验码、Key
			let _checksum = [];
			let _keys = [];
			$(this).text()
				.replace(/&nbsp;/g, ' ')
				.replace(/(?<=(?:MD5|SHA1|CRC32|SHA-256)[  :：]*)\b([0-9a-zA-Z]{8}|[0-9a-zA-Z]{32}|[0-9a-zA-Z]{40}|[0-9a-zA-Z]{64})\b/g, function(m, m1) {
					_checksum.push(m1);
				})
				.replace(/\b(?:[0-9A-Z]{5}(?:\-[0-9A-Z]{5}){4})\b/g, function(m) {
					_keys.push(m);
				});
			// 修复帖子内容
			let _html = $(this).html()
				// 修复 Unicode 显示
				.replace(/(?:&|&amp;)#(\d+);?/g, function(m, m1) {
					return ~~m1 > 65535 ? String.fromCodePoint(m1) : String.fromCharCode(m1);
				})
				// 本论坛链接
				.replace(/(?<=[^>"])https:\/\/bbs\.pcbeta\.com\/(?:forum\.php\?mod=viewthread&amp;tid=\d+(?:&amp;highlight=.+)?|viewthread\-\d+\-\d+\-\d+\.html)(?=[^<"])/g, function(m) {
					return `<a href="${m}" target="_blank">${m}</a>`;
				})
				// data:image
				.replace(/img file="https?:\/\/data:image/g, function(m) {
					return `img src="data:image`;
				})
				// Music
				.replace(/\[music\](.+)\[\/music\]/g, function(m, m1) {
					return `<audio src="${m1}" controls />`;
				})
				// Video
				.replace(/\[video\](.+)\[\/video\]/g, function(m, m1) {
					return `<video src="${m1}" controls />`;
				});
			// 修复校验码
			if (_checksum.length > 0) {
				_html = _html.replace(new RegExp(`\\b(?:${_checksum.join('|')})\\b`, 'g'), function(m) {
					return `<abbr title="点击复制到剪贴板" class="copy-clipboard" data-clipboard-text="${m}">${m}</abbr>`;
				})
			}
			// Key 隐藏
			if (_keys.length > 0) {
				_html = _html.replace(new RegExp(`\\b(?:${_keys.join('|')})\\b`, 'g'), function(m) {
					return `<abbr title="点击复制到剪贴板" class="copy-clipboard key-hide" data-clipboard-text="${m}">${m}</abbr>`;
				})
			}
			$(this).html(_html);
		});
		// 复制到剪贴板
		let clipboard = new ClipboardJS('abbr.copy-clipboard');
		clipboard.on('success', function(e) {
			alert(e.text + ' 已复制!');
		});
		/** 网速较快时，可使用论坛自带函数
		$('abbr.copy-clipboard').click(function() {
			let _c = $(this).data('clipboard-text');
			setCopy(_c, _c + ' 复制成功');
			return false;
		});
		**/
	}
	// 顶部用户导航悬停
	$("#toptb").stickUp();
	// 美化开始
	//GM_addStyle(__css);
	$('head').append(`<style id="diy_style">${__css}</style>`);
}(jQuery, `
:root {
  /* 背景阴影 */
  --shadow: 0 0 20px -5px rgba(51, 51, 51, .5);
  /* 整体宽度 */
  --w: 98vw;
  /* 圆角宽度 */
  --br: 4px;
  /* 背景色 */
  --bg: #E1E2E8;
  /* 分隔栏背景色 */
  --sep-bg: #DAE7F6;
  /* 偶数行背景色 */
  --odd-bg: #f8f8f8;
}
/* 小屏幕 */
@media screen and (max-width: 960px) {
  .x_l > img, .x_m > img, .x_r > img { display: none; }
}
/* 跟随系统的 Dark 模式 */
@media (prefers-color-scheme: dark1) {
  :root {
    /* 背景阴影 */
    --shadow: 0 0 10px -5px #fff;
    /* 圆角宽度 */
    --br: 4px;
    /* 背景色 */
    --bg: #222529;
    /* 分隔栏背景色 */
    --sep-bg: #DAE7F6;
    /* 偶数行背景色 */
    --odd-bg: #f8f8f8;
  }
  #nv ul li a,
  #pt .z a {
    color: #fff;
  }
}
body {
  background: var(--bg);
  /*
  font-family: Microsoft YaHei UI Semibold;
  -webkit-text-stroke: 0.04px;
  */
  text-shadow: transparent 0px 0px 0px, rgba(0,0,0,0.68) 0px 0px 0px !important;
}
#scbar,
.wp > div,
.wp {
  width: var(--w);
  /* 过渡动画
  -webkit-transition: width 1s ease;
  */
}
#separatorline tr td,
#separatorline tr th {
  background-color: var(--sep-bg);
  line-height: 30px;
}
#scbar,
#thread_types li a,
#newspecial,
#newspecialtmp,
#fastpostsubmit,
#post_reply {
  border-radius: var(--br);
  box-shadow: var(--shadow);
}
h1.mt + .bm,
#ct .flg,
#skill-list,
#f_pst,
#postlist,
#threadlist {
  box-shadow: var(--shadow);
}
#um > div {
  box-shadow: var(--shadow);
  /* box-shadow: 0 1px 0.1em black inset; */
  border-radius:0 0 6px 6px;
  height: 35px;
  line-height: 33px;
}
#um {
  max-width: calc(var(--w) - 6px);
}
#scbar {
  margin-top:110px;background:url('https://www.pcbeta.com//static/image/pcbeta/search_df__.png') 0 -258px repeat-x;
}
/* 楼层分隔线 */
div#postlist table[id^="pid"] {
  border-bottom: 1px solid #85B2EF;
}
/* 列表行高，字体
tbody[id^="normalthread"] tr td,
tbody[id^="stickthread"] tr td {
  padding: 8px;
}
tbody[id^="normalthread"],
tbody[id^="stickthread"] {
  font-size: 14px;
}
*/
.tip { max-width: 200px; }
.p_pop { opacity: 0.85; }
td.pbn > * {
  border-bottom: 1px solid #ECF1F7;
  padding-bottom: 10px;
  font-family: none; /* Microsoft Yahei */
}
h1.ts > a {
  font-weight: 500;
  font-size: 22px;
}
/* abbr 样式 */
abbr[title] {
  cursor: help;
  font-family: Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
abbr[title].key-hide {
  background: #46423C;
  color: #46423C;
  padding: 2px 2px;
}
abbr[title].key-hide:hover {
  color: #fff;
  padding: 2px 15px;
  border-radius: var(--br);
  -webkit-transition: all 1s;
}
/* video 限宽 */
video {
  max-width: calc((var(--w)/2) + 200px);
}
.avatar, .avatar_p, .pls>dl, .pls>p {
  display: none !important;
}
.t_fsz {
  min-height: 10px !important;
}
#hd {
  padding-bottom: 0px;
}
#toptb > .wp {
  height: 37px;
}
#toptb > .wp {
  background: #fff;
}
#hd > .wp {
  background: #fff;
  border-bottom: 3px solid #009ad9;
}
.isStuck > .wp {
  background: transparent !important;
}
.tl tr:hover th,.tl tr:hover td{background-color:#e6eef9;}
.wp.cl{
margin-top: -305px;
}
#ct {
    clear: both;
    background: #fff;
    min-height: 37px;
    height: 37px;
    padding: 0;
    width: auto;
    margin: 5px 0;
}
.ftbg {
display: none;
}
#pt {clear:both;}
`));


