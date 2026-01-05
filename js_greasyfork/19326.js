// ==UserScript==
// @name  Automatic Extract to Cloud Password
// @author    Hirah
// @namespace  Hirah
// @version    1
// @description  自动处理网盘链接及其提取码变成支持自动填充密码的方式的链接
// @include      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/19326/Automatic%20Extract%20to%20Cloud%20Password.user.js
// @updateURL https://update.greasyfork.org/scripts/19326/Automatic%20Extract%20to%20Cloud%20Password.meta.js
// ==/UserScript==

(function(){
	//runningman-fan 免点击显示下载地址
    if (/^http:\/\/www\.runningman-fan\.com\/.+\.html/.test(location.href) && document.querySelector('.content-main #down')) document.querySelector('.content-main #down').outerHTML=document.querySelector('#button_box .buttons').outerHTML;
    var common_reg = /\s*([百度云盘提取密码码访问码]+|360yun|yun|\d{3,4}[pP])[:：]?\s*(<[^>]+>)?\s*([0-9a-zA-Z]{4,})\s*/;
	var pw_reg = /#[0-9a-zA-Z]{4,}/;
	var standBy = false,standByList = [/http:\/\/weibo\.com\/.*/i];//将需要等待js运行之后再运行本代码的，将href正则写入数组
	var prefs = {
			tieba:['http://jump.bdimg.com/safecheck'],//这个有大量的误操作，因为这只是新浪的短网址，而不一定是网盘，自选使用
			pan:['http://pan.baidu.com/s/'],//第一个参数定义链接类型，第二个可选参数：后续紧跟着的提取码之类的前缀提示符
	        yunpan:['http://yunpan.cn/'],
	        yunpans:['https://yunpan.cn/'],
	        pans:['https://pan.baidu.com/s/'],
                pan2:['http://pan.baidu.com/share/'],
                pan2s:['https://pan.baidu.com/share/'],
	        tpan:['http://t.cn/'],//这个有大量的误操作，因为这只是新浪的短网址，而不一定是网盘，自选使用
	        wpan:['http://vdisk.weibo.com/lc/'],
                weiyunpan:['http://share.weiyun.com/'],
	};
	function panlinkWithPw(){
		var href = window.location.href,site = null,i = 0;
		while (standByList[i]) if(standByList[i++].test(href)) {standBy = true; break;}
		var panlinks,r = null,reg,i,nC,nN,pN,pos,subS;
		for (var key in prefs) {
			reg = prefs[key][1] || common_reg;
		//添加支持文本状态的网盘地址
        var textPanLink = new RegExp(prefs[key][0].replace(/\./g,'\\.')+'\\w+(?=\\s|[^\\x00-\\xff])','g');
        if (textPanLink.test(document.body.innerHTML)) document.body.innerHTML = document.body.innerHTML.replace(textPanLink, '$&'.link('$&'));
			panlinks = document.querySelectorAll('a[href^="'+prefs[key][0]+'"]'),i=0;
			while(panlinks[i]){
				if(pw_reg.test(panlinks[i].href)) {i++;continue;}
				nN = panlinks[i].nextSibling;
				if(nN!=null) {
					if(nN.nodeType===1)nC=nN.innerHTML;
					else if(nN.nodeType===3) nC=document.all?nN.innerText:nN.textContent;
					r = nC.match(reg);
					if(r!=null) panlinks[i].href += '#'+r[3];
				}
				if(nN==null||r==null) {
					//处理盘密码就在链接的文本本身上
					r = panlinks[i].innerHTML.match(reg);
					if(r!=null) panlinks[i].href += '#'+r[3];
					else {
						pN = panlinks[i].parentNode.parentNode.textContent;
						pos = pN.indexOf(panlinks[i].href);
						subS = pN.substr(pN.indexOf(panlinks[i].href)+1);
						var pos_end = subS.length,temp;
						for (var key1 in prefs) {
							temp = pN.indexOf(prefs[key1][0]);
							if(temp==-1) continue;
							if(temp!=pos&&temp<pos_end) pos_end = temp;
						}
						subS = subS.substr(0,pos_end-1);
						r = subS.match(reg) || panlinks[i].parentNode.textContent.match(reg) || pN.match(reg);
						if(r!=null) panlinks[i].href += '#'+r[3];
					}
				}
				i++;
			}
		}	
	}
	function addMutationObserver(selector, callback) {
		var watch = document.querySelector(selector);
		if (!watch) return;
		var observer = new MutationObserver(function(mutations){
			var nodeAdded = mutations.some(function(x){ return x.addedNodes.length > 0; });
			if (nodeAdded) {
			callback();
			}
		});
		observer.observe(watch, {childList: true, subtree: true });
	}
	// 添加下一页和不刷新页面的支持
	if (location.host.indexOf('.ys168.com') > 0) addMutationObserver('#mainMenu', function(){panlinkWithPw();});
	addMutationObserver('#ct', function(){
		panlinkWithPw();
	});
	if(standBy) {document.onreadystatechange = function () { if(document.readyState == "complete") panlinkWithPw(); }}
	else panlinkWithPw();
})();

unsafeWindow.eve = Event;

(function ($) {
	var site = {
		'yunpan.cn': {
			chk:  /^[a-z0-9]{4}$/i,
			code: '.pwd-input',
			btn:  '.submit-btn'
		},
		'baidu.com': {
			chk:  /^[a-z0-9]{4}$/i,
			code: '#accessCode',
			btn:  '#submitBtn'
		},
		'kuaipan.cn': {
			chk:  /^[a-z0-9]{6}$/i,
			code: '#pwdContaier .txt',
			btn:  '#btnOK',
			preSubmit: function (codeBox, okBtn) {
				$('#pwdContaier .bold').textContent = '请手动单击确认按钮然后刷新页面';
			}
		},
		'weibo.com': {
			chk:  /^[a-z0-9]{4}$/i,
			code: '#keypass',
			btn:  '.search_btn_wrap > a',
			preSubmit: function (codeBox, okBtn) {
				var $wt = $('.wrong_tips');
				if ($wt) {
					$wt.textContent += '；已禁用自动输入。';
					return true;
				}
				unsafeWindow.validate();
			}
		},
		'suning.com': {
			chk:  /^[a-z0-9]{4}$/i,
			code: '#shareform .code',
			btn:  'body',
			preSubmit: function (codeBox, okBtn, sCode) {
				if (location.search.indexOf('extractCode') == -1) {
					location.search += '&extractCode=' + sCode;
				}
				return true;
			}
		},
        'weiyun.com': {
            chk: /^[a-z0-9]{4}$/i,
			code: '#outlink_pwd',
			btn:  '#outlink_pwd_ok'
        }
	};

	addEventListener ('DOMContentLoaded', function () {
		// 抓取提取码
		var sCode = location.hash.slice(1).trim(),
			hostName = location.host.match(/\w+\.\w+$/)[0].toLowerCase();

		var conf = site[hostName];

		// 检查是否为合法格式
		if (!conf || !conf.chk.test(sCode))
			// 没有 Key 或格式不对
			return ;

		// 调试用
		console.log ('抓取到的提取码: %s', sCode);

		// 加个小延时
		setTimeout (function () {
			// 键入提取码并单击「提交」按钮，报错不用理。
			var codeBox = $(conf.code),
				btnOk = $(conf.btn);
			
			if (codeBox) codeBox.value = sCode;

			if (conf.preSubmit)
				if (conf.preSubmit (codeBox, btnOk, sCode))
					return ;

			if (btnOk) btnOk.click();
		}, 10);
	}, false);
})(function ($) {
	return document.querySelector ($);
});