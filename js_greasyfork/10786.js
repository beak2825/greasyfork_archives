// ==UserScript==
// @name         Bangumi Tookit
// @namespace    http://weibo.com/zheung
// @version      1.3.1
// @description  Bangumi Tookit 没有L!
// @author       DanoR
// @match        http://bgm.tv/*
// @match        https://bgm.tv/*
// @match        http://bangumi.tv/*
// @match        http://chii.in/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/10786/Bangumi%20Tookit.user.js
// @updateURL https://update.greasyfork.org/scripts/10786/Bangumi%20Tookit.meta.js
// ==/UserScript==

/* global saveConfig */
try {

console.log('Bangumi Tookit v1.2.0 started');

var useScriptDB = true; //脚本数据开关, false则使用下面的configManual作为每次打开网页的配置,功能一样,BTK的管理功能不会存储修改后的配置
var configManual = {"trans":true,"search":true,"sort":false,"shift":0,"maxWidth":"520px","searchs":{"dmhy":{"display1":"dmhy","display2":"动漫花园","url":"http://share.dmhy.org/topics/list?keyword=%key"},"bili":{"display1":"bili","display2":"哔哩哔哩","url":"http://search.bilibili.com/all?keyword=%key"},"sohu":{"display1":"sohu","display2":"搜狐专题","url":"http://tv.sohu.com/%key"},"pptv":{"display1":"pptv","display2":"聚力专题","url":"http://v.pptv.com/page/%key.html"},"iqyi":{"display1":"iqyi","display2":"奇艺专题","url":"http://www.iqiyi.com/%key.html"},"letv":{"display1":"letv","display2":"乐视专题","url":"http://www.letv.com/comic/%key.html"},"blav":{"display1":"blav","display2":"哔哩视频","url":"http://www.bilibili.com/video/av%key"},"tudo":{"display1":"tudo","display2":"土豆专题","url":"http://www.tudou.com/albumcover/%key.html"},"yoku":{"display1":"yoku","display2":"优酷专题","url":"http://www.youku.com/show_page/id_%key.html"},"acab":{"display1":"acab","display2":"艾斯视频","url":"http://www.acfun.tv/v/ab%key"}},"dicts":{"975":{"trans":"海贼王","searchs":{"dmhy":"海賊王","sohu":"s2013/onepiece"},"shift":0},"91946":{"trans":"妖精的尾巴 第二期","searchs":{"sohu":"s2011/yjdwb"}},"94040":{"trans":"无彩限的怪灵世界","searchs":{"dmhy":"無彩限"}},"98638":{"trans":"命运九重奏","searchs":{"pptv":"9eaf89076f"}},"104906":{"trans":"境界触发者","searchs":{"iqyi":"a_19rrhc0zzx"}},"115008":{"trans":"重装武器","searchs":{"bili":"重装武器"}},"117601":{"trans":"苍之彼方的四重奏","searchs":{"bili":"苍之彼方的四重奏"}},"119394":{"trans":"昭和元禄落语心中","searchs":{"yoku":"zfaedb5a4a86911e5be16"}},"120236":{"trans":"排球少年 第二季","searchs":{"tudo":"AlsHvzonFNY"}},"130231":{"trans":"偶像大师 灰姑娘女孩 第二季","searchs":{"bili":"偶像大师 灰姑娘女孩 第二季"}},"131891":{"trans":"暗杀教室 第二季","searchs":{"bili":"极速老师"}},"132220":{"trans":"龙珠超","searchs":{"dmhy":"珠+超"}},"133387":{"trans":"最弱无败神装机龙","searchs":{"pptv":"JwrmZMwyouBDwSk"}},"134390":{"trans":"黑之宣告","searchs":{"bili":"黑之宣告"}},"135275":{"trans":"为美好的世界献上祝福","searchs":{"dmhy":"獻上 祝福"}},"135816":{"trans":"神圣之门","searchs":{"pptv":"n66KCHDWRoTnZc0"}},"136213":{"trans":"春夏推理事件薄","searchs":{"tudo":"CkSvtickrys"}},"137722":{"trans":"只有我不在的街道","searchs":{"dmhy":"有我不"}},"138210":{"trans":"大叔与棉花糖","searchs":{"bili":"大叔与棉花糖"}},"139221":{"trans":"维度战记","searchs":{"yoku":"zeb430c68a87211e5b432"}},"139324":{"trans":"铁血的孤儿","searchs":{"tudo":"0cpgYEhhh8Y"}},"139408":{"trans":"阿松","searchs":{"tudo":"WXDaOez0dhE"}},"139800":{"trans":"侦探小队KZ事件簿","searchs":{"bili":"侦探小队KZ事件簿"}},"139830":{"trans":"梦幻之星 Online 2","searchs":{"bili":"梦幻之星"}},"141078":{"trans":"牙狼 红莲之月","searchs":{"bili":"牙狼 红莲之月"}},"142990":{"trans":"虹色时光","searchs":{"tudo":"QwwPp1afn80"}},"145407":{"trans":"赤发白雪姬 第二季","searchs":{"bili":"赤发白雪姬 第二季"}},"145457":{"trans":"石膏Boys","searchs":{"bili":"石膏Boys"}},"145781":{"trans":"疾走王子","searchs":{"tudo":"lSWn_fylZ2I"}},"146093":{"trans":"亚人","searchs":{"dmhy":"亞人"}},"146162":{"trans":"女高中生给你做饭了","searchs":{"bili":"女高中生给你做饭了"}},"146611":{"trans":"房东妹子青春期","searchs":{"bili":"房东妹子青春期"}},"146994":{"trans":"粗点心战争","searchs":{"dmhy":"心戰爭"}},"147036":{"trans":"GATE 奇幻自卫队 炎龙篇","searchs":{"pptv":"WObSULgejswvrRU"}},"148233":{"trans":"ACTIVE RAID 机动强袭室第八组","searchs":{"yoku":"z503b58c0a88a11e5a080"}},"148241":{"trans":"魔法少女什么的已经够了啦","searchs":{"bili":"魔法少女什么的已经够了啦"}},"148726":{"trans":"灰与幻想的格林姆迦尔","searchs":{"pptv":"oI1n5U2zI2HEQqo"}},"149412":{"trans":"魔法护士小麦R","searchs":{"bili":"魔法护士小麦R"}},"149993":{"trans":"少女们向荒野进发","searchs":{"bili":"少女们向荒野进发"}},"153140":{"trans":"告诉我 辣妹子酱","searchs":{"acab":"1470429"}},"153214":{"trans":"舞武器舞乱伎","searchs":{"bili":"舞武器舞乱伎"}},"155281":{"trans":"幸运逻辑","searchs":{"dmhy":"邏輯"}},"159269":{"trans":"红壳的潘多拉","searchs":{"bili":"红壳的潘多拉"}},"159365":{"trans":"网球并不可笑嘛 第七季","searchs":{"bili":"网球并不可笑嘛 第七季"}},"159892":{"trans":"血型君 第四季","searchs":{"letv":"10017725"}}}};
//加载配置
var btkConfig;

function initConfig() {
	if(useScriptDB) {
		btkConfig = GM_getValue('btk-config');

		if(!btkConfig)
			btkConfig = {
				"trans":true,
				"search":true,
				"sort":true,
				"shift":0,
				"maxWidth":"520px",
				"searchs": {},
				"dicts": {}
			};
		else
			btkConfig = JSON.parse(btkConfig);
	}
	else
		btkConfig = configManual;
}
saveConfig = function() {
	var strConfig = JSON.stringify(btkConfig, function(key, value) {
		return key!='sorter'?value:undefined;
	});

	if(useScriptDB) GM_setValue('btk-config', strConfig);

	return strConfig;
}

initConfig();

if(location.pathname == '/') { //首页大功能
//加载界面
	GM_addStyle(
		'.btk-ul>li { margin:7px; width:100% } \
		li>text { margin-left:6px; } \
		.btk-ul>li>:nth-child(1) { margin-left:4px; } \
		.btk-button:focus { outline:none; } \
		.btk-button { cursor:pointer; border-radius:4px; padding:4px 5px; margin-left:5px; border:2px solid #F09199; \
		-webkit-user-select:none; -moz-user-select:none; } \
		.btk-text { cursor:initial; width:45px; margin-left:4px; text-align:center; } \
		.btk-text2 { cursor:initial; width:69%; margin-left:4px; } \
		.btk-text3 { cursor:initial; width:24%; margin-left:4px; text-align:center; } \
		.btk-input { -webkit-user-select:text; -moz-user-select:text; } \
		.btk-on { color:white; background:#F09199; } \
		.btk-off { color:#F09199; background:white; } \
		.btk-panel { text-decoration:none; color:#444; cursor:pointer; } \
		.btk-mask { position:absolute; top:40px; left:0; }\
		.btk-select { background:red; opacity:0.2; float:left; margin:5px 0 0 5px; \
		padding:5px 0 5px 5px; width:340px; position:relative; \
		-moz-border-radius:3px;-webkit-border-radius:3px; border-radius:3px; \
		-webkit-transition:border linear 0.2s,box-shadow linear 0.3s; \
		-moz-transition:border linear 0.1s,box-shadow linear 0.3s; \
		transition:border linear 0.1s,box-shadow linear 0.3s; } .btk-select.odd { clear:both } \
		.btk-exist { background:green; } \
		.btk-border { border:2px solid black; width:99%; height:97%; position:absolute; top:0; left:0; cursor:pointer } \
		.btk-border:hover { border:2px solid red; } \
		.btk-searcher, .btk-configer { border-top:1px solid gray; } \
		.btk-configer>text { line-height:30px; } \
		.btk-searcher>text { line-height:30px; } \
		.btk-selector { width:74%; }'
	);

	var panel = $('<div class="halfPage sort ui-draggable btk-config">').hide();
	panel.append($('<div class="sidePanelHome">')
		.append($('<h2 class="subtitle">Bangumi Tookit</h2>')).append($('<ul class="btk-ul">')));
	$('div.sideInner').prepend(panel);

	$('div.content>ul.clearit>:nth-child(2)>:nth-child(2)').after($('<a class="btk-panel">工具</a>')
		.click(function() { panel.slideToggle(); })).after($(document.createTextNode(' | ')));

	var toggleFunc = function(which, type) {
		var $this = $(which);

		if($this.hasClass('btk-on'))
			btkConfig[type] = false;
		else if($this.hasClass('btk-off'))
			btkConfig[type] = true;

		$this.toggleClass('btk-on').toggleClass('btk-off');

		saveConfig();

		refresher[type]();
	};

	var a1 = $('<a class="btk-button">中日切换</a>').addClass(btkConfig.trans?'btk-on':'btk-off')
		.click(function() { toggleFunc(this, 'trans'); });

	var a2 = a1.clone().html('搜索链接').addClass(btkConfig.search?'btk-on':'btk-off')
		.removeClass(btkConfig.search?'btk-off':'btk-on').click(function() { toggleFunc(this, 'search'); });

	var a3 = a1.clone().html('播出排序').addClass(btkConfig.sort?'btk-on':'btk-off')
		.removeClass(btkConfig.sort?'btk-off':'btk-on').click(function() { toggleFunc(this, 'sort'); });

	var a4 = a1.clone().html('导入配置').addClass('btk-on').removeClass('btk-off').click(function() {
		if(confirm('确定要导入! 导入! 导入默认配置吗??\r\n这将会覆盖! 覆盖! 覆盖现有配置!!')) {
			btkConfig = configManual;
			saveConfig();

			refresher.trans();
			refresher.search();
			refresher.shift();
			refresher.sort();

			i1.val(btkConfig.shift);

			var mask = $('.btk-mask');
			if(mask.children().length)
				refreshMask();

			alert('导入成功');
		}
	 });
//UI-配置条目
	function refreshSeacher(seacher, searchs) {
		seacher.empty().append($('<option>').val('_new'));
		for (var key in btkConfig.searchs) {
			var search = btkConfig.searchs[key];

			seacher.append($('<option>').html(search.display2+'('+search.display1+')'+
				(searchs && searchs[search.display1]?'*':'')).val(key));
		}

		return seacher;
	}

	function refreshMask() {
	//UI-遮罩条目
		var wrapper = $('.infoWrapper_tv');
		var mask = $('.btk-mask').empty();

		if(!mask.length)
			mask = $('<div class="btk-mask">').width(wrapper.width()).height(wrapper.height()).insertAfter(wrapper);

		var last;
		wrapper.find('[id*="subjectPanel_"]').each(function(index, subject) {
			subject = $(subject);
			var id = subject.attr('id').replace('subjectPanel_', '');

			var select = $('<div class="btk-select">').addClass(btkConfig.dicts[id]?'btk-exist':null)
				.addClass(index % 2?'even':'odd').height(subject.height()).width(subject.width())
				.append($('<div class="btk-border">')).attr('data-id', id);

			select[last?'insertAfter':'appendTo'](last?last:mask);

			last = select;

			select.click(function() {
				var $this = $(this);
				var id = $this.attr('data-id');
				var dict = btkConfig.dicts[id];
				var subject = wrapper.find('[id=subjectPanel_'+id+']');

				if(!dict)
					dict = {};

				configer.id.html(id);
				configer.original.val(subject.find('.header>a').attr('title'));
				configer.trans.val(dict.trans?dict.trans:'');

				if('number' == typeof dict.shift) {
					configer.shift.val(dict.shift);
					keyHolder2 = dict.shift;
				}
				else
					configer.shift.val('');

				refreshSeacher(configer.search, btkConfig.dicts[id]?btkConfig.dicts[id].searchs:null);
			});

		});

		return mask;
	}

	var a5 = a1.clone().html('管理条目').addClass('btk-off').removeClass('btk-on')
		.click(function() {
			var $this = $(this);
			refreshMask()[$this.hasClass('btk-on')?'fadeOut':'fadeIn']();

			$('.btk-configer').slideToggle();

			$this.toggleClass('btk-on').toggleClass('btk-off');
		});

	var a51 = a1.clone().html('保存条目').addClass('btk-on').removeClass('btk-off')
		.click(function() {
			var dict = btkConfig.dicts[configer.id.html()];

			if(!dict) dict = {};

			var reg = /(^\s*)|(\s*$)/g;

			if(configer.trans.val().replace(reg, ''))
				dict.trans = configer.trans.val();
			else
				delete dict.trans;

			if(configer.shift.val().replace(reg, ''))
				dict.shift = parseInt(configer.shift.val());
			else
				delete dict.shift;

			if(configer.search.val() != '_new') {
				if(!dict.searchs) dict.searchs = {};

				if(configer.key.val().replace(reg, ''))
					dict.searchs[configer.search.val()] = configer.key.val();
				else
					delete dict.searchs[configer.search.val()];
			}

			if(dict.searchs && Object.keys(dict.searchs).length == 0)
				delete dict.searchs;

			if(Object.keys(dict).length > 0)
				btkConfig.dicts[configer.id.html()] = dict;
			else
				delete btkConfig.dicts[configer.id.html()];

			saveConfig();

			refresher.trans();
			refresher.search();
			refresher.shift();
			refresher.sort();

			var mask = $('.btk-mask');
			if(mask.children().length)
				refreshMask();

			refreshSeacher(configer.search, btkConfig.dicts[configer.id.html()]?btkConfig.dicts[configer.id.html()].searchs:null);

			alert('保存成功');
		});

	var a52 = a1.clone().html('删除条目').addClass('btk-on').removeClass('btk-off')
		.click(function() {
			if(configer.id.html() && confirm('确定要删除! 删除! 删除该条目吗??')) {
				delete btkConfig.dicts[configer.id.html()];
				saveConfig();

				refresher.trans();
				refresher.search();
				refresher.shift();
				refresher.sort();

				var mask = $('.btk-mask');
				if(mask.children().length)
					refreshMask();

				refreshSeacher(configer.search, btkConfig.dicts[configer.id.html()]?btkConfig.dicts[configer.id.html()].searchs:null);
			}
		});

	var configer = {
		id:$('<b>'),
		original:$('<input class="btk-text2 btk-button btk-input">').attr('disabled', 'disabled'),
		trans:$('<input class="btk-text2 btk-button btk-input">'),
		shift:$('<input class="btk-text btk-button btk-input">'),
		search:refreshSeacher($('<select class="btk-selector btk-button">')),
		key:$('<input class="btk-text2 btk-button btk-input" style="margin-bottom:7px;">'),
	};

	var keyHolder2 = '';
	configer.shift.bind('input', function() {
		if((!/^-?\d{1,2}$/.test(this.value) || /^-?0\d+$/.test(this.value)) && this.value != '-' && this.value != '')
			this.value = keyHolder2;
		else
			keyHolder2 = this.value;
	});

	var panelSubject = $('<div class="btk-configer">').hide()
		.append($('<text>条目信息 (ID:</text>').append(configer.id).append(')')).append('<br>')
		.append('<text>条目名称:</text>').append(configer.original).append('<br>')
		.append('<text>中文名称:</text>').append(configer.trans).append('<br>')
		.append('<text>播出偏移:</text>').append(configer.shift).append('<text style="margin-left:4%;">天</text>').append('<br>')
		.append('<text>链接类型:</text>').append(configer.search).append('<br>')
		.append('<text>关键字词:</text>').append(configer.key).append('<br>')
		.append(a51).append(a52).append('<br>');

	configer.search.change(function() {
		var $this = $(this);
		var id = configer.id.html();

		var key = btkConfig.dicts[id]?(btkConfig.dicts[id].searchs?btkConfig.dicts[id].searchs[$this.val()]:null):null;

		configer.key.val(key?key:'');
	});
//UI-配置链接
	var a6 = a1.clone().html('配置链接').addClass('btk-off').removeClass('btk-on')
		.click(function() {
			$('.btk-searcher').slideToggle();

			$(this).toggleClass('btk-on').toggleClass('btk-off');
		});

	var a61 = a1.clone().html('保存链接').addClass('btk-on').removeClass('btk-off')
		.click(function() {
			var val = searcher.select.val();
			var display1 = searcher.display1.val();

			btkConfig.searchs[(val == '_new'?display1:val)] = {
				display1:display1,
				display2:searcher.display2.val(),
				url:searcher.url.val()
			};
			saveConfig();
			refreshSeacher(searcher.select);
			refresher.search();
			alert('保存成功');
		});

	var a62 = a1.clone().html('删除链接').addClass('btk-on').removeClass('btk-off')
		.click(function() {
			var val = searcher.select.val();
			if(val != '_new' && confirm('确定要删除 删除 删除吗?')) {
				delete btkConfig.searchs[searcher.display1.val()];
				saveConfig();
				refreshSeacher(searcher.select);
				refresher.search();
			}
		});

	var searcher = {
		select:$('<select class="btk-selector btk-button">'),
		display1:$('<input class="btk-text3 btk-button btk-input">'),
		display2:$('<input class="btk-text3 btk-button btk-input">'),
		url:$('<input class="btk-text2 btk-button btk-input" style="margin-bottom:7px;">')
	};

	refreshSeacher(searcher.select);

	searcher.select.change(function() {
		var val = $(this).val();
		var search = btkConfig.searchs[val]?btkConfig.searchs[val]: {};

		searcher.display1.val(search.display1);
		searcher.display2.val(search.display2);
		searcher.url.val(search.url);
	});

	var panelSearcher = $('<div class="btk-searcher">').hide()
		.append('<text>名称都建议是4个字(母). URL通配符是%key</text>').append('<br>')
		.append('<text>链接:</text>').append(searcher.select).append('<br>')
		.append('<text>缩写:</text>').append(searcher.display1)
		.append('<text style="margin-left:4%;">中文:</text>').append(searcher.display2).append('<br>')
		.append('<text>URL:</text>').append(searcher.url).append('<br>')
		.append(a61).append(a62);

	var keyHolder = btkConfig.shift;
	var i1 = $('<input class="btk-text btk-button btk-input">').val(btkConfig.shift)
		.keyup(function(e) {
			if(this.value!='-' && this.value!='' && (e.keyCode == 13 || e.keyCode == 108))
				 refresher.shift(this.value);
		})
		.bind('input', function() {
			if((!/^-?\d{1,2}$/.test(this.value) || /^-?0\d+$/.test(this.value)) && this.value != '-' && this.value != '')
				this.value = keyHolder;
			else
				keyHolder = this.value;
		});

	panel.find('.sidePanelHome>ul').append($('<li>').append(a1).append(a2).append(a3).append(a4))
		.append($('<li>').append('<text>默认偏移</text>').append(i1).append('<text>天</text>').append(a6).append(a5))
		.append($('<li>').append(panelSearcher))
		.append($('<li>').append(panelSubject));
//切换器
	var toggler = {
		trans:function(id, subject, newName) {
			if(!btkConfig.trans)
				newName = subject.find('.header>a').attr('title');

			subject.find('.epGird>.tinyHeader>a[href*="/subject/"][title]').html(newName);
			subject.find('.header.clearit>.headerInner>h3>.l').html(newName);
			$('a.subjectItem.title[subject_id="'+id+'"]>span').html(newName);
		},
		search:function(subject, searchs) {
			if(!searchs) {
				var alinks = subject.find('a.btk-search');
				var temp = alinks.parent();

				alinks.remove();
				temp.each(function(index, parent) {
					var innerHTML = parent.innerHTML;
					while(innerHTML.lastIndexOf(' | ') == (innerHTML.length-3))
						innerHTML = innerHTML.substring(0, innerHTML.length-3);
					parent.innerHTML = innerHTML;
				});
			}
			else
				for(var type in searchs) {
					var raw = type=='page'?searchs.page:btkConfig.searchs[type];

					if(!raw) continue;

					var a1 = $('<a class="btk-search">')
						.attr('href', type=='page'?raw.url:raw.url.replace('%key', encodeURI(searchs[type])));
					a1.html(raw.display1).addClass('l').attr('target','_blank');

					subject.find('.epGird>.tinyHeader').append(' | ').append(a1);

					subject.find('.header>.headerInner>.tip_i').append(' | ').append(a1.clone().html(raw.display2));
				}
		},
		shift:function(subject, shift) {
			subject.find('.epGird>ul>li>a[class*="Today"], a[class*=Air]')
			.removeClass('epBtnToday').removeClass('epBtnAir').addClass('epBtnNA');

			subject.find('.epGird>ul>li>a.epBtnNA').each(function(index, ep) {
				ep = $(ep);
				var date = $(ep.attr('rel')+">.tip").html().match(/\d+-\d+-\d+/);
				var day = (Date.parse(date?date[0]:'') - 28800000 - now) / 86400000;

				if(day == shift)
					ep.removeClass("epBtnNA").addClass("epBtnToday");
				else if(day < shift)
					ep.removeClass("epBtnNA").addClass("epBtnAir");
			});
		}
	};

	var refresher = {
		trans:function() {
			$('.infoWrapper_tv>[id*="subjectPanel_"]').each(function(id, subject) {
				subject = $(subject);
				id = subject.attr('id').replace('subjectPanel_', '');
				var dict = btkConfig.dicts[id];

				toggler.trans(id, subject, dict && dict.trans?dict.trans:subject.find('.header>a').attr('title'));
			});
		},
		search:function() {
			$('.infoWrapper_tv>[id*="subjectPanel_"]').each(function(id, subject) {
				subject = $(subject);
				var dict = btkConfig.dicts[subject.attr('id').replace('subjectPanel_', '')];

				if(btkConfig.search && dict && dict.searchs) {
					toggler.search(subject, null);
					toggler.search(subject, dict.searchs);
				}
				else
					toggler.search(subject, null);
			});
		},
		shift:function(newShift) {
			if(newShift != null && newShift != undefined)
				btkConfig.shift = parseInt(newShift);

			$('.infoWrapper_tv>[id*="subjectPanel_"]').each(function(id, subject) {
				subject = $(subject);
				var dict = dicts[subject.attr('id').replace('subjectPanel_', '')];

				var shift;
				if(dict && ('number'==typeof dict.shift))
					shift = dict.shift;
				else if(('number'==typeof btkConfig.shift))
					shift = btkConfig.shift;

				if('number' == typeof shift)
					toggler.shift(subject, shift);
			});

			refresher.sort();
		},
		sort:function() {
			var wrapper = $('.infoWrapper_tv');

			if(btkConfig.sort) {
				wrapper.find('[id*="subjectPanel_"]').each(function(index, subject) {
					if((subject = $(subject)).find('.epGird>ul>li>a[class*=Air]').length)
						wrapper.prepend(subject);
				}).each(function(index, subject) {
					if((subject = $(subject)).find('.epGird>ul>li>a[class*=Today]').length)
						wrapper.prepend(subject);
				});
			}
			else if(btkConfig.sorter)
				for(var i=0; i<btkConfig.sorter.length; i++)
					wrapper.append(btkConfig.sorter[i]);

			wrapper.find('[id*="subjectPanel_"]').each(function(index, subject) {
				$(subject).removeClass(index % 2?'odd':'even').addClass(index % 2?'even':'odd');
			});
		}
	};

	var dicts = btkConfig.dicts;
	var now = Date.parse(new Date().toDateString());
	var wrapper = $('.infoWrapper_tv');

	wrapper.find('[id*="subjectPanel_"]').each(function(id, subject) {
		subject = $(subject);
		id = subject.attr('id').replace('subjectPanel_', '');
		var dict = dicts[id];

		if(btkConfig.trans && dict && dict.trans)
			toggler.trans(id, subject, dict.trans);

		if(btkConfig.search && dict && dict.searchs)
			toggler.search(subject, dict.searchs);

		var shift;
		if(dict && ('number'==typeof dict.shift))
			shift = dict.shift;
		else if(('number'==typeof btkConfig.shift))
			shift = btkConfig.shift;

		if('number' == typeof shift && shift != 1)
			toggler.shift(subject, shift);
	});

	btkConfig.sorter = [];
	wrapper.find('[id*="subjectPanel_"]').each(function(index, subject) {
			btkConfig.sorter.push($(subject));
	});

	refresher.sort();
}
else if(/^\/ep\/\d*/.test(location.pathname)) {
	if(btkConfig.maxWidth)
		$('img.code').css('maxWidth', btkConfig.maxWidth);
}

} catch(e) { console.log(e); }