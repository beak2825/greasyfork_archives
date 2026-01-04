// ==UserScript==
// @name         让伴奏酷、WO99、百度伴奏吧、伴奏999、伴奏中国、仙来居等伴奏网站获取强大的360欧美英文伴奏搜索扩展功能
// @namespace    http://tampermonkey.net/
// @version      0.5.3.31
// @description  让伴奏酷、WO99、百度伴奏吧、伴奏999、伴奏中国、仙来居等伴奏网站获取强大的360欧美英文伴奏搜索扩展功能!
// @author       pendave
// @include      *banzouku.com/thread.php?fid=68*
// @include      *banzouku.com/thread.php?fid=132*
// @include      *banzouku.com/thread.php?fid=92*
// @include      *banzouku.com/thread.php?fid=93*
// @include      *banzouku.com/thread.php?fid=89*
// @include      *banzouku.com/read.php?tid=*
// @include      *banzou999.net/music.new.php?PartID=*
// @include      *banzou.name/index.php/*/play/*
// @include      *banzou.name/index.php/*/so/key?key=*
// @include      *wo99.net/singerbz/*
// @include      *wo998.net/singerbz/*
// @include      *wo99.net/bplay*
// @include      *wo998.net/bplay*
// @include      *xianlai.xyz/forum*
// @include      *xianlai.xyz/thread*
// @include      *xianlai.xyz/forum.php?*viewthread&tid=*
// @include      *xianlai.xyz/forum.php?mod=forumdisplay&fid=*
// @include      *xianlaiju.com/forum*
// @include      *xianlaiju.com/thread*
// @include      *xianlaiju.com/forum.php?*viewthread&tid=*
// @include      *xianlaiju.com/forum.php?mod=forumdisplay&fid=*
// @include      *sing9.com/forum*
// @include      *sing9.com/thread*
// @include      *sing9.com/forum.php?*viewthread&tid=*
// @include      *sing9.com/forum.php?mod=forumdisplay&fid=*
// @include      *tieba.baidu.com/f?kw=伴奏*
// @include      *tieba.baidu.com/f?kw=%E4%BC%B4%E5%A5%8F*
// @include      *tieba.baidu.com/p/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/369960/%E8%AE%A9%E4%BC%B4%E5%A5%8F%E9%85%B7%E3%80%81WO99%E3%80%81%E7%99%BE%E5%BA%A6%E4%BC%B4%E5%A5%8F%E5%90%A7%E3%80%81%E4%BC%B4%E5%A5%8F999%E3%80%81%E4%BC%B4%E5%A5%8F%E4%B8%AD%E5%9B%BD%E3%80%81%E4%BB%99%E6%9D%A5%E5%B1%85%E7%AD%89%E4%BC%B4%E5%A5%8F%E7%BD%91%E7%AB%99%E8%8E%B7%E5%8F%96%E5%BC%BA%E5%A4%A7%E7%9A%84360%E6%AC%A7%E7%BE%8E%E8%8B%B1%E6%96%87%E4%BC%B4%E5%A5%8F%E6%90%9C%E7%B4%A2%E6%89%A9%E5%B1%95%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/369960/%E8%AE%A9%E4%BC%B4%E5%A5%8F%E9%85%B7%E3%80%81WO99%E3%80%81%E7%99%BE%E5%BA%A6%E4%BC%B4%E5%A5%8F%E5%90%A7%E3%80%81%E4%BC%B4%E5%A5%8F999%E3%80%81%E4%BC%B4%E5%A5%8F%E4%B8%AD%E5%9B%BD%E3%80%81%E4%BB%99%E6%9D%A5%E5%B1%85%E7%AD%89%E4%BC%B4%E5%A5%8F%E7%BD%91%E7%AB%99%E8%8E%B7%E5%8F%96%E5%BC%BA%E5%A4%A7%E7%9A%84360%E6%AC%A7%E7%BE%8E%E8%8B%B1%E6%96%87%E4%BC%B4%E5%A5%8F%E6%90%9C%E7%B4%A2%E6%89%A9%E5%B1%95%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
	'use strict';
	//button打开网页
	unsafeWindow.display360banzou = function(t) {
		window.open('http://360banzou.com/sou/search.php?search=' + t, '_blank');
	}
	//验证字符串是否是数字
	function checkNumber(theObj) {
		var reg = /^[0-9]+.?[0-9]*$/;
		if (reg.test(theObj)) {
			return true;
		}
		return false;
	}
	//banzouku
	if (location.href.indexOf('banzouku.com') != -1) {
		//去ad
		if (document.querySelector('.banner') != null) {
			document.querySelector('.banner').remove();
		}
		if (document.querySelector('table[width="98%"][align="center"][cellspacing="0"][cellpadding="1"]') != null && document.querySelector('table[width="98%"][align="center"][cellspacing="0"][cellpadding="1"]').textContent.match('复制') != -1) {
			document.querySelector('table[width="98%"][align="center"][cellspacing="0"][cellpadding="1"]').remove();
		}
		if (document.querySelector('table[width="98%"][align="center"][cellspacing="1"][cellpadding="0"]') != null && document.querySelector('table[width="98%"][align="center"][cellspacing="1"][cellpadding="0"]').textContent.match('伴奏酷联系') != -1) {
			document.querySelector('table[width="98%"][align="center"][cellspacing="1"][cellpadding="0"]').remove();
		}
		//插入iframe
		if (location.href.indexOf('banzouku.com/read.php?tid=') != -1 && document.body.innerText.match('英文类') != null) {
			var titleDom = document.querySelector('.tpc_title');
			var threadTitleContent = titleDom.textContent.trim().split('\n')[0].replace(/[\[\]]/g,'').match(/[\x00-\xff]+/g)[0].trim();
			console.info(threadTitleContent);
			if (threadTitleContent != '') {
				var artistThread = threadTitleContent.split(' - ')[0].split(/ft|Ft|Feat\.|feat\.|、|Feat|feat/)[0].split('(')[0].trim(),
					songnameThread = '',
					searchContentThread = '';
				searchContentThread = artistThread;
				if (threadTitleContent.split(' - ')[1]) {
					songnameThread = threadTitleContent.split(' - ')[1].trim().split('(')[0].trim();
					searchContentThread = artistThread + ' ' + songnameThread;
				}
				var srcIframe = 'http://360banzou.com/sou/search.php?search=' + searchContentThread.replace('-',' ');
				//console.info(srcIframe);
				titleDom.outerHTML += '<div align="center"><iframe src="' + srcIframe + '" frameborder="0" allowtransparency="true" srcolling="yes" width=900 height=900></iframe></div>';
			}
		}
		//插入button
		else if (location.href.indexOf('banzouku.com/thread.php?fid=') != -1 && document.body.innerText.match('英文类') != null){
			var threadTrs = document.querySelectorAll('tr.t_one');
			//console.info(threadTrs);
			for (var i = 0; i < threadTrs.length; i++) {
				try {
					if (threadTrs[i].querySelector('td.t_two') != null && threadTrs[i].textContent.match(/伴奏[\]|)]/)) {
						var titleContent = threadTrs[i].querySelector('td.t_two').textContent.trim().split('\n')[0].replace(/[\[\]]/g,'').match(/[\x00-\xff]+/g)[0].trim();
						console.info(titleContent);
						if (titleContent != '') {
							var artist = titleContent.split(' - ')[0].split(/ft|Ft|Feat\.|feat\.|、|Feat|feat/)[0].split('(')[0].trim(),
								songname = '',
								searchContent = '';
							searchContent = artist;
							if (titleContent.split(' - ')[1]) {
								songname = titleContent.split(' - ')[1].trim().split('(')[0].trim();
								searchContent = artist + ' ' + songname;
							}
							threadTrs[i].querySelector('td.t_two').innerHTML += '<button style="background: #40B40D; border-color: #A5DE37; border-radius: 10px;" onclick="display360banzou(`' + searchContent.replace('-',' ') + '`); return false;">360欧美英文伴奏搜下</button>';
						}
					}

				}
				catch(err) {
					console.warn(err);
				}
			}
		}
	}
	//banzou999 已经关闭
    //var newWindow = unsafeWindow.open('http://www.360banzou.com/sou','_blank');
    /**
	if (location.href.indexOf('banzou999.net/music.new.php?PartID=') != -1) {
		var aLists = document.querySelectorAll('a.list');
		for (var j = 0; j < aLists.length; j++) {
			try {
				//var banzou999TitleContent = aLists[j].textContent.match(/[\x00-\xff]+/g)[0].replace(/[^\x00-\xff]+|[A-Z]\d{1,6}/g,'').split('(')[0].trim();
				var banzou999TitleContent = aLists[j].textContent.trim().replace('VIP','').replace('【大神AB】','').replace(/〓/g,'').replace('Singer AB','').replace('4D版','').replace('【OJAN】','').replace(/[\[\]]/g,'').match(/[\x00-\xff]+/g)[0].replace(/[^\x00-\xff]+|[A-Z]\d{1,6}/g,'').trim();
				console.info(banzou999TitleContent);
				if (banzou999TitleContent != '' && !aLists[j].parentNode.parentNode.textContent.match('[顶]') && isNaN(banzou999TitleContent)) {
					var songnameBanzou999 = banzou999TitleContent.split(' - ')[0].split('(')[0].trim(),
						artistBanzou999 = '',
						searchContentBanzou999 = '';
					searchContentBanzou999 = songnameBanzou999;
					if (banzou999TitleContent.split(' - ')[1]) {
						artistBanzou999 = banzou999TitleContent.split(' - ')[1].split(/ft|Ft|Feat\.|feat\.|、|Feat|feat/)[0].split('(')[0].trim();
						searchContentBanzou999 = artistBanzou999 + ' ' + songnameBanzou999;
					}
					aLists[j].outerHTML += '<button style="background: #40B40D; border-color: #A5DE37; border-radius: 10px;" onclick="display360banzou(`' + searchContentBanzou999.replace('-',' ') + '`); return false;">360欧美英文伴奏搜下</button>';
				}
			}
			catch(err) {
				console.warn(err);
			}
		}
	}
    **/
	//banzou.name
	if (location.href.indexOf('banzou.name/index.php/') != -1) {
		//默认声音消停
		if (document.querySelector('.jp-pause') != null){
			setTimeout(function(){
				if (document.querySelector('.jp-pause').getAttribute('style') == "display: list-item;") {
					document.querySelector('.jp-pause').click();
				}
			},300);
		}
		//去ads
		var adsBanzouName = document.querySelectorAll('div[id*="ads"]');
		for (var m = 0; m < adsBanzouName.length; m++) {
			adsBanzouName[m].remove();
		}
		if (document.querySelector('#footer').nextSibling.nextSibling != null) {
			document.querySelector('#footer').nextSibling.nextSibling.remove();
		}
		if (document.querySelector('#divQQbox') != null) {
			document.querySelector('#divQQbox').remove();
		}
		if (document.querySelector('#footer') != null) {
			document.querySelector('#footer').remove();
		}
		if (document.querySelector('.logo') != null) {
			document.querySelector('.logo').remove();
		}
		//
		var titleInfo = document.querySelector('.cfff').textContent.match(/[\x00-\xff]+/g)[0].replace('\\','').trim();
		if (titleInfo != '') {
			var songnameBanzouName = titleInfo.split(' - ')[0].split(/ft|Ft|Feat\.|feat\.|、|Feat|feat/)[0].split('(')[0].trim(),
				artistBanzouName = '',
				searchContentBanzouName = '';
			searchContentBanzouName = songnameBanzouName;
			if (titleInfo.split(' - ')[1]) {
				artistBanzouName = titleInfo.split(' - ')[1].split(/ft|Ft|Feat\.|feat\.|、|Feat|feat/)[0].split('(')[0].trim();
				searchContentBanzouName = artistBanzouName + ' ' + songnameBanzouName;
			}
			var srcBanzouNameIframe = 'http://360banzou.com/sou/search.php?search=' + searchContentBanzouName.replace('-',' ');
			if (document.querySelector('#player') != null) {
				document.querySelector('#player').outerHTML += '<div align="center"><iframe src="' + srcBanzouNameIframe + '" frameborder="0" allowtransparency="true" srcolling="yes" width=960 height=1300></iframe></div>'
			}
			else {
				document.querySelector('.cfff').innerHTML += '<div align="center"><iframe src="' + srcBanzouNameIframe + '" frameborder="0" allowtransparency="true" srcolling="yes" width=960 height=1300></iframe></div>'
			}
		}
	}
	//wo99
	if (location.href.indexOf('wo99.net/singerbz/') != -1 || location.href.indexOf('wo998.net/singerbz/') != -1) {
		var adTables = document.querySelectorAll('table[height="130"]');
		for (var k = 1; k < adTables.length; k++) {
			adTables[k].remove();
		}
		var srcWo99Iframe = 'http://360banzou.com/sou/search.php?search=' + document.querySelector('h1').textContent.replace("伴奏",'').trim().replace('-',' ');
		adTables[0].outerHTML = '<div align="center"><iframe src="' + srcWo99Iframe + '" frameborder="0" allowtransparency="true" srcolling="yes" width=960 height=1300></iframe></div>';
	}
	if (location.href.indexOf('wo99.net/bplay') != -1 || location.href.indexOf('wo998.net/bplay') != -1) {
		//默认声音消停
		if (document.querySelector('div.mejs-controls') != null){
			setTimeout(function(){
				document.querySelector('#mep_0 > div > div.mejs-controls > div.mejs-button.mejs-playpause-button.mejs-pause > button').click().click();
			},300);
		}
		var adWo99Tables = document.querySelectorAll('table[height="130"]');
		for (var l = 1; l < adWo99Tables.length; l++) {
			adWo99Tables[l].remove();
		}
		var singerWo99 = document.querySelectorAll('table[width="336"]')[3].querySelectorAll('td')[3].querySelector('a').textContent.trim();
		var srcWo99PlayIframe = 'http://360banzou.com/sou/search.php?search=' + singerWo99 + ' ' + document.querySelector('h1').textContent.replace("伴奏",'').trim().replace('-',' ');
		adWo99Tables[0].outerHTML = '<div align="center"><iframe src="' + srcWo99PlayIframe + '" frameborder="0" allowtransparency="true" srcolling="yes" width=960 height=1300></iframe></div>';
	}
	//xianlai
	if (location.href.indexOf('xianlai') != -1 || location.href.indexOf('sing9') != -1) {
		if ((location.href.indexOf('xianlai.xyz/forum') != -1 || location.href.indexOf('xianlaiju.com/forum') != -1 || location.href.indexOf('sing9.com/forum') != -1) && document.body.innerText.match(/欧美|其他语种/) != null) {
			var titleDomXianlai = document.querySelectorAll('a[onclick="atarget(this)"]');
			for (var n = 0; n < titleDomXianlai.length; n++) {
				try {
					var threadTitleContentXianlai = titleDomXianlai[n].textContent.trim().split('\n')[0].replace(/[\[\]]/g,'').match(/[\x00-\xff]+/g)[0].trim();
					console.info(threadTitleContentXianlai);
					if (threadTitleContentXianlai != '' && titleDomXianlai[n].parentNode.textContent.match(/伴奏[\]|)]/)) {
						var artistThreadXianlai = threadTitleContentXianlai.split(' - ')[0].split(/ft|Ft|Feat\.|\/|feat\.|Feat|feat/)[0].split('(')[0].trim(),
							songnameThreadXianlai = '',
							searchContentThreadXianlai = '';
						searchContentThreadXianlai = artistThreadXianlai;
						if (threadTitleContentXianlai.split(' - ')[1]) {
							songnameThreadXianlai = threadTitleContentXianlai.split(' - ')[1].trim().split(/ft|Ft|Feat\.|\/|feat\.|Feat|feat/)[0].split('(')[0].trim();
							searchContentThreadXianlai = artistThreadXianlai + ' ' + songnameThreadXianlai;
						}
						titleDomXianlai[n].outerHTML += '<button style="background: #40B40D; border-color: #A5DE37; border-radius: 10px;" onclick="display360banzou(`' + searchContentThreadXianlai.replace('-',' ') + '`); return false;">360欧美英文伴奏搜下</button>';
					}
				}
				catch(err) {
					console.warn(err);
				}
			}
		}
		if ((location.href.indexOf('xianlai.xyz/thread') != -1 || location.href.indexOf('xianlaiju.com/thread') != -1 || location.href.indexOf('sing9.com/thread') != -1) && document.body.innerText.match(/欧美|其他语种/) != null) {
			var titleXianlai = document.querySelector('h1.ts');
			//console.info(titleXianlai.textContent.trim());
			var threadTitleXianlai = titleXianlai.textContent.trim().split('\n')[1].replace(/[\[\]]/g,'').match(/[\x00-\xff]+/g)[0].trim();
			console.info(threadTitleXianlai);
			if (threadTitleXianlai != '') {
				var artistXianlai = threadTitleXianlai.split(' - ')[0].split(/ft|Ft|Feat\.|\/|feat\.|Feat|feat/)[0].split('(')[0].trim(),
					songnameXianlai = '',
					searchContentXianlai = '';
				searchContentXianlai = artistXianlai;
				if (threadTitleXianlai.split(' - ')[1]) {
					songnameXianlai = threadTitleXianlai.split(' - ')[1].trim().split(/ft|Ft|Feat\.|\/|feat\.|Feat|feat/)[0].split('(')[0].trim();
					searchContentXianlai = artistXianlai + ' ' + songnameXianlai;
				}
				console.log(searchContentXianlai);
				var srcIframeXianlai = 'http://360banzou.com/sou/search.php?search=' + searchContentXianlai.replace('-',' ');
				//console.info(srcIframe);
				titleXianlai.outerHTML += '<div align="center"><iframe src="' + srcIframeXianlai + '" frameborder="0" allowtransparency="true" srcolling="yes" width=800 height=1300></iframe></div>';
			}
		}

	}
	//tieba
	var re = /小缘呆又|lanqing彼|海阔天空2|xiajifengabc|mthgh414|要一起跳舞|音为的力量|天枰|8668|秃山江樵|我是你南|健忘也是|花落天山|9087dsf|mollyljh|健忘也是|七彩绚动|yyt8484|我vfg|晨心音频|勤奋的好|ybhka2019|good火影|明月◎照|394674045|BZYYZZ|qq61738|duan_kun|hhrrcc1|fanqie444|jackson10|樱花雨纷|hdlwx53|万事如意8|不过急|音乐之心|我是流先|易新手|llzz0p|逸然YY|聪明人无|lzb890923|伊成寺贤|Lovelin1|QQ232598|月无涯坐|曲终心思|水瓶艾克|性子野YL|wqh豆豆|很会写歌|细行书生|久久5555|威武霸气|渲染离别|一个专属|箱琴与远方|国土感|笑笑的天|囖突击咋|hMr倏菩B|北门真君|hMr倏菩B|小时间音乐|温柔骄纵|忆晓诺G|贴吧用户_|一季节遗忘|樱の狼|扣308116|蓝天依旧|libera|丝萨|MT_ka|根儿烟8|shaguang|Colour_Jo|小臻粒|谁的广岛|芷涵小|星星之火|我是后期|小A同学|乐观的维|喜欢下雨|爱在路口|侠盗1572|PP楼兽兽|福曜|一只羊|lovablew|YY还能|CJ不懂|桐子哲也|Dynastey|橙冰露月|stiuped|KinglenLiu|只需给我|耽筋|天音工作|苏烟308|小潇|毒舌大扎妹|属於的鱼|xingna123|小皮球|扬花最美|至今未对手|617374827|爆笑格莱美|甲妹|小华爱游戏|ZCAKWLE|暧昧天气|cf20060606|cattleya33|chaichunhai|认错Volt|我不是蜡|C人一个|谁都不懂|听墨竹雨|左音右奏|Zzz96818|Oo飞刀oO|千山谷雨|爱珍惜拥|小颖1983|旗帜音乐网|音乐知我心|o0馨Oo|极4|最强经|Soa太阳|谭伊亚|www5139|觅尾巴|寒冬依旧美|Meeon21|万象音乐|诌唱3df|说唱爱好者|嘻哈哈444|奇妙树12|SunBoom|伴奏|鹿萌萌|向奉才|ecowater|鸸鹋鯃|月光Moon|儒雅的木|夏柒娃|气神AIRG|lisensen|陶天然Nat|比特山的|PKZ666666|黑白旋绿|盛琪爱你|皎月奶奶|音乐楚留香|冰心|海洋|歪之道|QQ83428|没有吃的|day小小|lvse蘑菇头|快乐知音|小旋风|ibanzou|竟文吧|伴奏专家|过不过|▁▂▃|sdxsw|墨门兼爱|时间不懂|zhu135565|随心音|我vfgj|『1988』|李l小g宏|纯的音乐|星极速|hyxd|香菱2008|彩虹伴奏|美丽的白塔_|2017好快|VX140975|好音乐伴|Legend|9伴奏12345|清羽伴奏|cscechjc|qq237916|hechangba|铁拐李来了|听听我们|好音乐好|舔裹|MusIC喵|Q194400|爱淘帮帮主|伴奏收藏|杨屁屁|拥抱音乐|音乐小虾子|天天向上|美丽的伴奏|白娘子098|音乐无限|音乐制作|北京北辰|地獄少女|昨日歌未醒|爱帮小龙|平平乐声|欧阳锋喜|就是sb软件|柠檬之女|SSmiemie|Cat音乐|毒鸩|夏志老狗|畫先生|中国音|锦绣年华|Generat|宜昌录音|七个浅|合唱总谱|混音之家|VIP专享|云之端|鍚栤櫄味|KJ音乐|超级喜儿|查拉图|ymsll|乐诚精品|hanzhong|初音LOVE|必须要|xingyun|hwc896|楼上的廖|阴谋dark|a小调|锋利音乐|绥化张龙|电磁娃子|伴奏工作|zyx19710725|leeo25|abc流浪|小戎24|dongyang821|伴奏制作|声音的魔力|嘻哈伴奏|幸福2018|加微|制作各种|核爆炸|福曜伴奏|音乐伴奏|jsl563|wyjgin|Perfectsh1tt|热情地Gui|小舞|fx深秋|joecyr|伴奏吧|张轩g|周伯文|都好|小晨工作|fjfhubhjkihvdf|free强哥|月幕|蓝水星星|虐心沉浮/;
	if (location.href.indexOf('tieba.baidu.com/f') != -1) {
		//add首页
		function a() {
			document.querySelector('#tb_nav > ul').outerHTML += '<iframe src="http://360banzou.com/sou" frameborder="0" allowtransparency="true" scrolling="yes" width=960 height=500></iframe>';
            document.querySelector('#tb_nav > ul').outerHTML += '<div><b style="color: red; font-size: 2.5em;">天枰8668 你这个垃圾吧主去死！</b></div>';
		}
		setTimeout(a,1000);

		function p(){
			var items = document.querySelectorAll('div.threadlist_title.pull_left.j_th_tit');
			for (var i = 0; i < items.length; i++) {
				var authorNode = items[i].nextSibling;
				var eachThreadNode = items[i].parentNode.parentNode.parentNode.parentNode;
				if (authorNode.textContent.trim().match(re)) {
					eachThreadNode.remove();
				}
			}
		}
		// reply remove
		function rep(){
			var items = document.querySelectorAll('i.icon_replyer');
			for (var i = 0; i < items.length; i++) {
				var replyerNode = items[i].nextSibling;
				var replyNode = items[i].parentNode.parentNode;
				if (replyerNode.parentNode.title.trim().match(re)) {
					replyNode.innerHTML = '<i class="icon_replyer"></i>';
				}
			}
		}
		var mySecInterval = setInterval(function(){
			p();
			rep();
			//if (!document.querySelector('.frs-author-name-wrap').textContent.trim().match(re)) {
			//clearInterval(mySecInterval);
			//}
		},1000);
		//setTimeout(p,500);
		/* 好乱的贴吧
		var tiebaThreads = document.querySelectorAll('div.threadlist_title.pull_left.j_th_tit');
		for (var p = 0; p < tiebaThreads.length; p++) {
			try {
				var tiebaTitleContent = tiebaThreads[p].querySelector('a').textContent.trim().split('\n')[0].replace(/[\[\]]/g,'').match(/[\x00-\xff]+/g)[0].trim();
				console.info(tiebaTitleContent);
				if (tiebaTitleContent != '') {
					var tiebaArtist = tiebaTitleContent.split(' - ')[0].split(/ft|Ft|Feat\.|feat\./)[0].split('(')[0].trim(),
						tiebaSongname = '',
						tiebaSearchContent = '';
					tiebaSearchContent = tiebaArtist;
					if (tiebaTitleContent.split(' - ')[1]) {
						tiebaSongname = tiebaTitleContent.split(' - ')[1].trim().split(/ft|Ft|Feat\.|feat\./)[0].split('(')[0].trim();
						tiebaSearchContent = tiebaArtist + ' ' + tiebaSongname;
					}
					tiebaThreads[p].innerHTML += '<button style="background: #40B40D; border-color: #A5DE37; border-radius: 10px;" onclick="display360banzou(`' + tiebaSearchContent.replace('-',' ') + '`); return false;">360欧美英文伴奏搜下</button>';
				}
			}
			catch(err) {
				console.warn(err);
			}
		}
		*/
	}
	if (location.href.indexOf('http://tieba.baidu.com/p/') != -1) {
		var pAuthorNodes = document.querySelectorAll('ul.p_author');
		for (var ii = 0; ii < pAuthorNodes.length; ii++) {
			if (pAuthorNodes[ii].textContent.trim().match(re)) {
				pAuthorNodes[ii].parentNode.parentNode.remove();
			}
		}
		//reply里
		function r(){
			var pReplyNodes = document.querySelectorAll('li.lzl_single_post.j_lzl_s_p');
			for (var jj = 0; jj < pReplyNodes.length; jj++) {
				if (pReplyNodes[jj].textContent.trim().match(re)) {
					pReplyNodes[jj].remove();
				}
			}
		}
		var mythirdInterval = setInterval(function(){
			r();
			//if (!document.querySelector('.frs-author-name-wrap').textContent.trim().match(re)) {
			//clearInterval(mySecInterval);
			//}
		},1000);
		//setTimeout(r,300);
		//setTimeout(r,6000);
		/*
		var mySecInterval = setInterval(function(){
			r();
			}
		},1000);
		*/
	}
	// Your code here...
})();