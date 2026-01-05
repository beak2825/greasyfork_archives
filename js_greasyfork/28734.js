// ==UserScript==
// @id             mybanzou@405647825@qq.com
// @name           cnki 英文版显示中文期刊页面按钮
// @version        0.5
// @author         405647825@qq.com
// @namespace      http://weibo.com/pendave
// @description    cnki 英文版显示对应中文期刊页面按钮
// @include        *en.cnki.com.cn/Article_en/*
// @include        *navi.cnki.net/KNavi/JournalDetail*
// @include        *navi.cnki.net/knavi/JournalDetail/GetArticleList*
// @require  https://cdn.jsdelivr.net/clipboard.js/1.5.13/clipboard.min.js
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/28734/cnki%20%E8%8B%B1%E6%96%87%E7%89%88%E6%98%BE%E7%A4%BA%E4%B8%AD%E6%96%87%E6%9C%9F%E5%88%8A%E9%A1%B5%E9%9D%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/28734/cnki%20%E8%8B%B1%E6%96%87%E7%89%88%E6%98%BE%E7%A4%BA%E4%B8%AD%E6%96%87%E6%9C%9F%E5%88%8A%E9%A1%B5%E9%9D%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

if(location.href.indexOf('en.cnki.com.cn/Article_en') != -1 || location.href.indexOf('en.cnki.com.cn/article_en') != -1){
	//获取对应中文版面
	var cnPageUrl = location.href.replace(/_?en\.?/g,'');
	var cnMagButton = '<button id="mycnArtBtn">此文中文页面</button><span style="color:#D04A4F;">&nbsp;➽&nbsp;</span>';
	document.body.innerHTML += '<div id="myFloat" style="position: fixed !important; left: 5px; top: 90px; z-index: 100; font-size:1.2em; ">' + cnMagButton + '</div>';
	document.querySelector('#mycnArtBtn').onclick = function(){
		window.open(cnPageUrl);
	};
	var ret = GM_xmlhttpRequest({
		method: "GET",
		//url: cnNaviPageUrl,
		url: cnPageUrl,
		onload: function(responseDetails) {
			//var pat = filename + "','(.+)(?=\\.journalname)";
			//var titleNameData = responseDetails.responseText.match(pat, "g");
			//var art_title = titleNameData[0].split("','")[1].split(".")[0];
			//var art_author = titleNameData[0].split("','")[1].split(".")[1].replace(/[,:';"<>]/gi,' ');
			var art_title = responseDetails.responseText.match(/xx_title">.+<\/h1>/g)[0].replace(/xx_title">|<\/h1>/g,'');
			var art_author = responseDetails.responseText.match(/height:30px;">.+<\/div>/g)[0].replace(/height:30px;">|<a.+?>|<\/a>|&nbsp;|<\/div>/g,'').replace(/\s{2}/g,' ');
			var firstAuthor = art_author.split(' ')[0];
			console.info(art_title);
			console.info(art_author);
			//显示该文章在cnki或者万方或者维普里是否有
			var newAppend = '<div id="div_change_" style="display:block;"><div id="div_title_cnki_"><iframe id="iframe_title_cnki_" style="border: 4px solid #249D11;" src="http://kns.cnki.net/kns/brief/default_result.aspx??txt_1_sel=FT%24%25%3D%7C&txt_1_special1=%25&txt_extension=&expertvalue=&cjfdcode=&currentid=txt_1_value1&dbJson=coreJson&dbPrefix=SCDB&db_opt=CJFQ%2CCJFN%2CCDFD%2CCMFD%2CCPFD%2CIPFD%2CCCND&db_value=&hidTabChange=&hidDivIDS=&singleDB=SCDB&db_codes=&singleDBName=&againConfigJson=false&curdbcode=SCDB&expandGroupN=0&defaultResultGroup=defaultResultGroup&isTagSearch=0&txt_1_value1=' + art_title + ' ' + firstAuthor + '" width="600" height="456"></iframe><input type="button" style="position: absolute !important; background:#79E321; font-size:2em;" value="↻" onClick="document.getElementById(\'iframe_title_cnki_\').src=document.getElementById(\'iframe_title_cnki_\').src;"></div>' + '<div id="div_title_wanfang_"><iframe id="iframe_title_wanfang_" style="border: 4px solid #FF8000;" src="http://s.wanfangdata.com.cn/Paper.aspx?q=' + art_title + ' ' + firstAuthor + '" width="600" height="456"></iframe><input type="button" style="position: absolute !important; background:#79E321; font-size:2em;" value="↻" onClick="document.getElementById(\'iframe_title_wanfang_\').src=document.getElementById(\'iframe_title_wanfang_\').src;"></div>'  + '<div id="div_title_vip_"><iframe id="iframe_title_vip_" style="border: 4px solid #816A00;" src="http://www.cqvip.com/main/search.aspx?k=' + art_title + ' ' + firstAuthor + '" width="600" height="456"></iframe><input type="button" style="position: absolute !important; background:#79E321; font-size:2em;" value="↻" onClick="document.getElementById(\'iframe_title_vip_\').src=document.getElementById(\'iframe_title_vip_\').src;"></div></div>';
			document.querySelector('h2').outerHTML += ('<br><span style="color:#D04A4F; font-size:1.6em; font-weight:bold;">'+ art_title + '</span><br><span>' + art_author + '</span><br>' + newAppend);
		}
	});
}