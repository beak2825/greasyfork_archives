// ==UserScript==
// @name	Gazelle Tag Colors
// @name:zh      Gazelle标签颜色
// @name:zh-CN   Gazelle标签颜色
// @name:zh-TW   Gazelle標籤顏色
// @author	 newstarshipsmell&DXV5
// @namespace		https://greasyfork.org/zh-CN/scripts/385721-gazelle-tag-colors
// @description		Colorizes tags on Gazelle trackers. Site-specific settings. Shift + Wheel Up/Down on tags to cycle colors. GM/TM menu or Linkbox link to open settings panel / define colors.
// @description:zh      改变Gazelle站点上的标签颜色，默认按住Shift滚动鼠标滚轮即可循环改变标签颜色；在油猴或者暴力猴插件的菜单或者个人页面也可以打开标记颜色设置面板。
// @description:zh-CN   改变Gazelle站点上的标签颜色，默认按住Shift滚动鼠标滚轮即可循环改变标签颜色；在油猴或者暴力猴插件的菜单或者个人页面也可以打开标记颜色设置面板。
// @description:zh-TW   改變Gazelle站點上的標籤顏色，默認按住Shift滾動鼠標滾輪即可循環改變標籤顏色；在油猴或者暴力猴插件的菜單或者個人頁面也可以打開標記顏色設置面板。
// @version			3.0.0
// @date			2019/06/12
// @since			2017/02/20

// @include			https://orpheus.network/*
// @include			https://www.deepbassnine.com/*
// @include			https://efectodoppler.pw/*
// @include			https://gazellegames.net/*
// @include			https://www.indietorrents.com/*
// @include			https://jpopsuki.eu/*
// @include			https://libble.me/*
// @include			https://notwhat.cd/*
// @include			https://passthepopcorn.me/*
// @include			https://redacted.ch/*
// @include			https://tv-vault.me/*
// @include			https://dicmusic.club/*

// @require			https://greasyfork.org/libraries/GM_config/20131122/GM_config.js

// @grant			GM_addStyle
// @grant			GM.addStyle
// @grant			GM_openInTab
// @grant			GM.openInTab
// @grant			GM_registerMenuCommand
// @grant			GM.registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/385721/Gazelle%20Tag%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/385721/Gazelle%20Tag%20Colors.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var website = location.hostname.replace(/www\./, '').split('.')[0];
	var websitePath = window.location.href.replace(window.location.protocol + '//' + window.location.hostname + '/', '');

	var fields = {
		'linkbox_link': {
			'type': 'checkbox', 'label': '<b>是否添加设置入口到个人页面</b>', 'default': true,
			'title': '在链接框中添加[标签颜色]链接以打开此Gazelle标记颜色设置面板。\n \n 此链接不会显示在所有页面上'
		},
		'tag_colors': {
			'label': '<b>标签颜色:</b> ', 'type': 'textarea', 'rows': 4, 'cols': 24, 'default': '#00ff00\n#ffff00\n#ff0000',
			'title': '输入颜色列表，每种颜色在单独的行中输入。\n \n 可以通过颜色名称，十六进制，RGB，HSL或HWB指定颜色。\n \n 请选择下面的规范，然后单击获取信息以获取详细信息。\n \n 此处输入的颜色将按顺序进行解析（即第一行是颜色1，第二行是2等），下面输入的标签将根据它们后面的数字与此字段中的一行相匹配。\n \n 无效 颜色指定行将被忽略，但将包含在计数中（否则，编辑颜色中的拼写错误会使所有标记在一行之后分配颜色。）'
		},
		'color_spec': {
			'label': '<b>颜色值定义模式:</b> ', 'type': 'select', 'options': ['Names', 'HEX', 'RGB', 'HSL', 'HWB'], 'size': 8, 'default': 'Names', 'save': false,
			'title': '选择颜色值规范的类型，然后单击下面的“获取信息”以获取有关的信息。'
		},
		'open_color_spec': {
			'label': '获取信息', 'type': 'button', 'click': function() {
				var selected = GM_config.fields.color_spec.toValue();
				var url = 'https://www.w3schools.com/colors/colors_' + (selected == 'HEX' ? 'hexadecimal' : selected.toLowerCase()) + '.asp';
				try {
					GM_openInTab(url, false);
				} catch(e) {
					GM.openInTab(url, false);
				}
			},
			'title': '在W3Schools上打开一个页面（在新选项卡中），解释所选的颜色值规范。'
		},
		'tag_assignments': {
			'label': '<b>标签分配:</b> ', 'type': 'textarea', 'rows': 10, 'cols': 32, 'default': '',
			'title': '输入一个标签列表，每个标签一个单独的行。\n \n 格式为\n  标签:颜色编号 \n  每个标签的编号，其中1至N 对应于在上面的标签颜色字段中输入的行，0对应于未定义（主题默认颜色）\n \n 将忽略变形线，包括包含非字母数字字符的标签名称'
		},
		'populate_tags': {
			'type': 'checkbox', 'label': ' <b>自动获取标签</b>', 'default': false,
			'title': '如果启用后，会从使用torrent等页面解析标签并填充到上边的标记列表，并标记为颜色0以便于进一步的设置。\n \n关闭后，此类标记将不会添加，并会从列表中删除'
		},
		'ctrl_key': {
			'section': '<b>标签颜色循环滚动快捷键:</b> ', 'type': 'checkbox', 'label': '<b>Ctrl</b>', 'default': false,
			'title': '按住此按键的同时滚动鼠标滚轮会自动更改对应标签的颜色；选择在标签上滚动鼠标滚轮时要同时按住的热键，以循环显示所选颜色。\n \n 强烈建议至少选择一个热键，否则滚动浏览带有标签的页面将导致用户无意中 更改在鼠标光标下滚动的标签的相关颜色！'
		},
		'alt_key': {
			'type': 'checkbox', 'label': '<b>Alt</b>', 'default': false,
			'title': '按住此按键的同时滚动鼠标滚轮会自动更改对应标签的颜色；选择在标签上滚动鼠标滚轮时要同时按住的热键，以循环显示所选颜色。\n \n 强烈建议至少选择一个热键，否则滚动浏览带有标签的页面将导致用户无意中 更改在鼠标光标下滚动的标签的相关颜色！'
		},
		'shift_key': {
			'type': 'checkbox', 'label': '<b>Shift</b>', 'default': true,
			'title': '按住此按键的同时滚动鼠标滚轮会自动更改对应标签的颜色；选择在标签上滚动鼠标滚轮时要同时按住的热键，以循环显示所选颜色。\n \n 强烈建议至少选择一个热键，否则滚动浏览带有标签的页面将导致用户无意中 更改在鼠标光标下滚动的标签的相关颜色！'
		},
		'tag_css_selectors': {
			'label': '<b>标签CSS筛选器:</b> ', 'type': 'textarea', 'rows': 4, 'cols': 48,
			'default': '.tags > a\n.box_tags li > a\n.basic-movie-list__movie__tags > a\n.cover-movie-list__movie__tags > a\n.panel > .panel__body > .list--unstyled > li > a',
			'title': '用于选择标签的CSS筛选器。\n \n 除非您知道自己在做什么，否则不要更改此设置。\n \n单击下面的“重置”按钮将CSS字段恢复为默认值（然后单击“保存”以应用它。）'
		},
		'tag_topten_css_selectors': {
			'label': '<b>Top 10 Tag CSS Selectors:</b> ', 'type': 'textarea', 'rows': 1, 'cols': 48, 'default': 'tbody > tr > td > a',
			'title': '用于在Top 10 标签页面上选择标签的CSS选择器。\n \n除非您知道自己在做什么，否则不要更改此设置。\n \ n 单击下面的“重置”按钮将CSS字段恢复为默认值（然后单击“保存”以应用它。）'
		},
		'reset_css': {
			'label': '重置 CSS', 'type': 'button', 'click': function() {
				GM_config.set('tag_css_selectors', '.tags > a\n.box_tags li > a\n.basic-movie-list__movie__tags > a\n.cover-movie-list__movie__tags > a\n.panel > .panel__body > .list--unstyled > li > a');
				GM_config.set('tag_topten_css_selectors', 'tbody > tr > td > a');
				GM_config.close();
				GM_config.open();
			},
			'title': '将CSS选择器字段重置为其默认值。\n \n 重置后单击“保存”以应用更改。'
		},
	};

	GM_config.init({
		'id': 'GazelleTagColors', 'title': 'Gazelle标签颜色', 'fields': fields,
		'css': '.section_header { background: white !important; color: black !important; border: 0px !important; text-align: left !important;} .field_label { font-weight: normal !important;}',
		'events':
		{
			'save': function(values) {
				if (GM_config.isOpen) location.reload();
			}
		}
	});

	try {
		GM_registerMenuCommand('Gazelle Tag Colors', function() {GM_config.open();});
	} catch(e) {
		GM.registerMenuCommand('Gazelle Tag Colors', function() {GM_config.open();});
	}

	var colorList = GM_config.get('tag_colors').split('\n');

	var validColorNames = [
		'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue',
		'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey',
		'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey',
		'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro',
		'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred ', 'indigo ', 'ivory', 'khaki', 'lavender',
		'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink',
		'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon',
		'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred',
		'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod',
		'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown',
		'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow',
		'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'
	];

	for (var i = 0, len = colorList.length; i < len; i++) {
		if (validColorNames.indexOf(colorList[i].toLowerCase()) == -1 &&
			/^(rgb\((1?\d{1,2}|2([0-4]\d|5[0-5])), ?(1?\d{1,2}|2([0-4]\d|5[0-5])), ?(1?\d{1,2}|2([0-4]\d|5[0-5]))\)|#[0-9a-fA-F]{6}|h(sl|wb)\(([12]?\d{1,2}|3([0-5]\d|60)), ?(\d{1,2}|100)%, ?(\d{1,2}|100)%\))$/.test(colorList[i]) ===
			false)
			colorList[i] = "";
	}

	var tagAssignments = GM_config.get('tag_assignments').replace(/\./g, '').toLowerCase().split('\n');
	tagAssignments.sort();

	var tagList = {};

	for (i = 0, len = tagAssignments.length; i < len; i++) {
		if (/^[a-z0-9\.]+\s*:\s*\d+/.test(tagAssignments[i]) === true)
			tagList[tagAssignments[i].split(/\s*:\s*/)[0]] = parseInt(tagAssignments[i].split(/\s*:\s*/)[1]);
	}

	var linkboxLink = Boolean(GM_config.get('linkbox_link'));
	var populateTaglist = Boolean(GM_config.get('populate_tags'));
	var cycleCtrlKey = Boolean(GM_config.get('ctrl_key'));
	var cycleAltKey = Boolean(GM_config.get('alt_key'));
	var cycleShiftKey = Boolean(GM_config.get('shift_key'));
	var tagCSSSelectors = GM_config.get('tag_css_selectors').replace(/\n/g, ', ');
	var tagTopTenCSSSelectors = GM_config.get('tag_topten_css_selectors').replace(/\n/g, ', ');

	var style = '';

	for (i = 0, len = colorList.length; i < len; i++) {
		if (colorList[i] !== '')
			style += [
				'a.tagcolor_', i + 1, ' { color: ', colorList[i], ' !important; }',
				'a.tagcolor_', i + 1, ':hover { color: ', colorList[i], ' !important; opacity: 0.8; }'
			].join('');
	}

	try {
		GM_addStyle(style);
	} catch(e) {
		GM.addStyle(style);
	}

	var links = document.querySelectorAll(/^top10\.php\?type=tags.*$/.test(websitePath) ? tagTopTenCSSSelectors : tagCSSSelectors);

	for (i = links.length; i--; ) {
		var tag = links[i].textContent.trim().replace(/\./g, '');
		if (tagList[tag] === undefined) {
			if (populateTaglist) tagList[tag] = 0;
			links[i].classList.add('tagcolor_0');
			continue;
		}

		if (!Number.isInteger(tagList[tag]) || tagList[tag] <= 0 || tagList[tag] > colorList.length) {
			tagList[tag] = 0;
			links[i].classList.add('tagcolor_0');
			continue;
		}
		links[i].classList.add('tagcolor_' + tagList[tag]);
	}

	if (populateTaglist) {
		tagAssignments = [];

		for (var j in tagList) {
			if (!tagList.hasOwnProperty(j)) continue;
			tagAssignments.push(j + ": " + tagList[j].toString());
		}
		tagAssignments.sort();

		GM_config.set('tag_assignments', tagAssignments.join('\n'));
		GM_config.save();
	}

	if (linkboxLink) {
		if (/^((artist|torrents)\.php\?(page=\d+&|)(id=\d+|action=notify).*|(bookmarks|collages?|requests|top10|trumpable)\.php.*|collections\.php\?(page=\d+&|)id=\d+|better\.php.+|user\.php\?id=\d+|userhistory\.php\?action=subscribed_collages.*)$/.test(websitePath)) {
			var tagColorsLink = '<a href="#" id="tag_colors_linkbox" class="brackets">' + (website == 'passthepopcorn' || website == 'tv-vault' ? '[Tag colors]' : '标签颜色设置面板') + '</a> ';

			document.getElementsByClassName("linkbox")[0].insertAdjacentHTML(/^collages?\.php(|\?(page=\d+&|)(?!id=\d+)$)/.test(websitePath) ?
																			 'afterbegin' :
																			 'beforeend', tagColorsLink);

			document.getElementById('tag_colors_linkbox').addEventListener('click', function(e){
				e.preventDefault();
				GM_config.open();
			});
		}
	}

	document.getElementById('content').addEventListener('wheel', function (e) {
		if (/tagcolor_\d+/.test(e.target.className) && e.ctrlKey == cycleCtrlKey && e.altKey == cycleAltKey && e.shiftKey == cycleShiftKey) {
			e.preventDefault();

			var tagAdjustment = e.deltaY < 0 ? -1 : 1;
			var tagAdjusted = e.target.textContent.trim().replace(/\./g, '').toLowerCase();
			var previousNum = tagList[tagAdjusted] === undefined ? 0 : tagList[tagAdjusted];

			tagList[tagAdjusted] = previousNum + tagAdjustment;

			if (tagList[tagAdjusted] == -1) {
				tagList[tagAdjusted] = colorList.length;
			} else if (tagList[tagAdjusted] > colorList.length) {
				tagList[tagAdjusted] = populateTaglist ? 0 : undefined;
			}

			var currentNum = tagList[tagAdjusted] === undefined ? 0 : tagList[tagAdjusted];

			var links = document.querySelectorAll(/^top10\.php\?type=tags.*$/.test(websitePath) ? tagTopTenCSSSelectors : tagCSSSelectors);

			for (i = links.length; i--; ) {
				var tag = links[i].textContent.trim().replace(/\./g, '');

				if (tag == tagAdjusted) {
					links[i].classList.remove('tagcolor_' + previousNum);
					links[i].classList.add('tagcolor_' + currentNum);
				}
			}

			tagAssignments = [];

			for (var j in tagList) {
				if (!tagList.hasOwnProperty(j)) continue;
				if (!Number.isInteger(tagList[j])) continue;
				if (tagList[j] === 0 && !populateTaglist) continue;
				tagAssignments.push(j + ": " + tagList[j].toString());
			}
			tagAssignments.sort();

			GM_config.set('tag_assignments', tagAssignments.join('\n'));
			GM_config.save();
		}
	}, false);

})();