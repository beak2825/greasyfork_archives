// ==UserScript==
// @name  配合网盘密码自动提取，融合链接与提取码
// @author      jasonshaw,jasake
// @namespace  panlink.jasonshaw
// @version    0.6.1.4
// @description  自动处理网盘链接及其提取码变成支持自动填充密码的方式的链接（百度云、360pan等）
// @include      *
// @note         支持微云地址【感谢jixun大的更新】
// @note         解决部分网站百度盘提取密码在第二行时出现的问题【感谢卡饭会员“jasake”的修改支持】
// @note         添加支持文本状态的网盘地址【感谢卡饭会员“jasake”的修改支持】
// @note         添加支持云盘https地址
// @note         添加支持微盘地址 
// @note         添加支持zd423博客，runningman-fan，wenlei.ys168.com【感谢卡饭会员“jasake”的修改支持】
// @note         修复一个手误bug 
// @note         改变程序逻辑以适应一些特殊环境
// @note         修复一个bug，彻底解决重复后缀密码问题
// @note         增加脚本运行判断的设定，默认自动运行，对于类似新浪微博类网址，才执行判断后执行  
// @note         改变程序逻辑对更多的情况进行支持
// @note         增加处理盘密码就在链接的文本本身上
// @note         增加脚本运行判断，解决个别页面动态加载问题，比如新浪微博
// @note         增加百度贴吧跳转和新浪微博短网址的支持，两条配置一样存在“误杀”，不常用的可以注释掉这两条规则
// @note         优化代码，将任意单条正则变为可选配置，一般由默认正则处理，有利于自定义扩展和维护
// @note         增加支持自动更新
// @note         修正配置，支持单页面多云盘链接
// @note         避免重复后缀密码
// @note         支持百度网盘/贴吧/360云
// @note         支持加密百度网盘https
// @note         支持uAutoPagerize2.uc.js的自动翻页
// @run-at       document-end
// @copyright  2014+, jasonshaw
// @downloadURL https://update.greasyfork.org/scripts/13494/%E9%85%8D%E5%90%88%E7%BD%91%E7%9B%98%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E6%8F%90%E5%8F%96%EF%BC%8C%E8%9E%8D%E5%90%88%E9%93%BE%E6%8E%A5%E4%B8%8E%E6%8F%90%E5%8F%96%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/13494/%E9%85%8D%E5%90%88%E7%BD%91%E7%9B%98%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E6%8F%90%E5%8F%96%EF%BC%8C%E8%9E%8D%E5%90%88%E9%93%BE%E6%8E%A5%E4%B8%8E%E6%8F%90%E5%8F%96%E7%A0%81.meta.js
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