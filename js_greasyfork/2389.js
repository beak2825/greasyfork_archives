// ==UserScript==
// @name        GreasyFork 中文
// @namespace   http://jixun.org/
// @description 实验性脚本, 尚有内容未翻译完毕。
// @include     https://greasyfork.org/*
// @version     1.2.6
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2389/GreasyFork%20%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/2389/GreasyFork%20%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

var translation = {
	// Links
	'a': {
		'Attach a file': '上传附件',
		'Rules for code posted on Greasy Fork': 'GF 站代码提交规则',
		'Rules for code including external scripts': 'GF 站外部脚本引用规则',
		'Baidu CDN': '百度 CDN (国内)',
		'开放静态文件 CDN': '七牛 CDN (国内)',
		'Hide script reviews': '隐藏脚本讨论',
		'Show script reviews': '显示脚本讨论',
		'New script set': '新建脚本收藏集',
		'Cancel': '取消'
	},
	
	// Rules, from list or paragraph.
	'ul,ol,p': {
		'Scripts must include a description of what they do and may not do things unreasonably outside of this description. Users must know what a script will do before installing it.': '脚本必须包含一个脚本描述用于解释脚本的功能，并不得实现超出描述外的内容。用户必须在安装脚本之前明白脚本的用途。',
		'Code posted to this site may not be obfuscated or minified. Users be given the opportunity to inspect and understand a script before installing it.': '复制粘贴到该站的脚本不得为压缩或加密后的。用户拥有安装脚本前的代码的审查权。',
		'Your script must respect others\' copyrights. This includes the script itself and any resources (for example images) it uses. If you intend on using someone else\'s content, abide by their licensing terms or get their permission before doing so.': '您上传的脚本必须尊重他人的版权声明。这包括脚本本身以及其它第三方引用的数据 (如图片)。如果您使用了任何第三方内容，请务必按照其所属授权执行，或事先取得原作者授权。',
		'Use of external JavaScript is limited.': '您只能使用白名单内的脚本。'
	},

	'.script-type': {
		'(Unlisted)': '(不在列表)',
		'(Deleted)':  '(已删除)',
		'(Library)':  '(库)',
		'(Locked)':   '(锁定)'
	},

	'#script-list-set': {
		'Script set:': '脚本集:',
		'All': '不限'
	},

	'h1,h2,h3': {
		'Script Sets': '脚本集',
	
		// 论坛
		'Comments': '评论',
		'Leave a Comment': '发表回复',
		'New Discussion about': '发表新贴，关于 ',
		'Recent Activity': '近期动态',
		'Activity': '动态'
	},

	// 用户页面 & 检索页面 的脚本列表
	'.script-list': {
		'(Deleted)': '(已删)',
		'(Locked)': '(锁定)',
		'(Library)': '(脚本库)'
	},

	// 脚本信息页 - 脚本简介
	'#script-content': {
		// 更新历史
		'Lines of context': '差异行数',
		'Diff': '对比更改',
		'Old:': '旧版：',
		'New:': '新版：',
		'Lines of context:': '对比差异行数：',
		'Refresh': '重新对比'
	},

	// 论坛 - 右上角搜索框
	'.SiteSearch': {
		'Search': '搜索论坛'
	},

	// 论坛 - 上方导航
	'.SiteMenu': {
		'Discussions': '讨论区',
		'Activity': '论坛动态',
		'Mark All Viewed': '全部标为已阅'
	},

	// 论坛 - 发帖按钮
	'.Button': {
		'New Discussion': '发表新帖',
		'Preview': '预览',
		'Save Draft': '储存草稿',
		'Post Comment': '发表回复',
		'Save Comment': '更新回复',
		'Post Discussion': '发帖',
		'Cancel': '取消',
		'Share': '分享',
		'Comment': '吐槽',
		'Okay': '确认'
	},

	// 论坛 - 项目标签
	'label.Form_Name': {
		'Discussion Title': '帖子名称'
	},

	// 论坛 - 左边过滤
	'.BoxFilter': {
		'Categories': '论坛板块',
		'Recent Discussions': '近期讨论',
		'Activity': '论坛活动',
		'Recent Activity': '近期动态',
		'Moderator Activity': '管理员动态',
		'My Discussions': '我的帖子',
		'My Drafts': '我的草稿',
		'Discussions': '帖子',
		'Comments': '帖子回应',
		'Notifications': '通知',
		'Inbox': '私信箱'
	},

	// 论坛 - 板块名称
	'.BoxCategories,.Meta>.Category': {
		'Categories': '论坛板块',
		'All Categories': '所有板块',
		'Greasy Fork Meta': '站点相关',
		'Script Development': '脚本开发',
		'Script Requests': '脚本请求',
		'Script Discussions': '脚本讨论'
	},

	// 论坛 - 帖子操作
	'.OptionsMenu': {
		'Edit': '编辑',
		'Delete': '删除'
	},

	// 论坛 - 其他
	'.Meta': {
		__regex: [
			[/edited(.+)/, '最后编辑于$1']
		],
		'Announcement': '公告',
		'Closed': '锁帖',
		'views': ' 次围观',
		'comments': ' 个吐槽',
		'comment': ' 个吐槽',
		'Most recent by': '最新吐槽 by ',
		'Delete': '删除'
	},

	// 论坛 - 帖子链接
	'.MItem': {
		'in': '发布于 ',
		'Flag': '举报',
		'Quote': '引用',
		'Comment': '吐槽',
		'Started by': '楼主为 '
	},

	// 论坛 - 近期动态
	'.Activity': {
		__regex: [
			[/and (\d+) others? joined./, ' 以及其它 $1 位加入论坛']
		],
		'and': ' 以及 ',
		'joined.': ' 加入论坛',
		'Write a comment': '写点什么吧',
		'changed his profile picture.': ' 更换了他的头像',
		'changed her profile picture.': ' 更换了她的头像'
	},

	// 论坛 - 菜单
	'.MenuItems': {
		'Preferences': '首选项',
		'Mark All Viewed': '全部标为已阅',
		'Sign Out': '登出论坛'
	},

	// 论坛 - 私信按钮
	'.ProfileOptions': {
		'Message': '私信'
	},

	// 论坛 - 各类窗口
	'.PopList,.Popup': {
		__regex: [
			[/(\d+) messages?/, '$1 条内容']
		],

		'Notifications': '通知',
		'Notification Preferences': '设定',
		'mentioned you in': ' 提到你：',
		'posted on your': ' 发帖到你的 ',
		'wall': '生活時報',
		'.': '。',
		'All Notifications': '所有通知',

		'Inbox': '私信',
		'New Message': '撰写私信',
		'All Messages': '所有私信',
		'Confirm': '确认',
		'Are you sure you want to do that?': '真的要这样做吗?',
		'You do not have any bookmarks yet.': '您的收藏夹还是空空的诶~',
		'commented on': ' 回复了 ',
		'sent you a': ' 给您发送了一条 ',
		'message': '私信'
	},

	// 论坛 - 标题相关
	'.Discussion': {
		'About:': '关于：'
	},
	
	// 论坛 - 发帖选项
	'.PostOptions': {
		'Item ID:': '脚本 ID： ',
		'No rating (just a question or comment)': ' 无评分 (询问问题或评论)',
		'Report script (malware, stolen code, or other bad things requiring moderator review)': ' 举报脚本 (恶意代码、抄袭代码或其它需要管理员审核的脚本 [有需要可 @JixunMoe])',
		'Bad (doesn\'t work)': ' 有问题 (网站改版? 脚本坏掉了?)',
		'OK (works, but could use improvement)': ' 能用 (但是可以做出一些改进)',
		'Good (works well)': ' 完美 (多称赞几句作者吧~)'
	},

	// 论坛 - 用户信息
	'.Profile': {
		'Username': '用户名',
		'Email': '邮件地址',
		'Joined': '注册日期',
		'Last Active': '最近活动',
		'Roles': '用户组',
		'Member': '会员',
		'Greasy Fork Profile': '主站帐号页',
		'Verified': '已验证',
		'Not Verified': '未验证'
	}
};

var _each = function (arr, eachCb, defValue) {
	if (!arr || !arr.length) return ;

	for (var i = arr.length, ret; i-- ; )
		// If there's something to return, then return it.
		if (ret = eachCb (arr[i], i))
			return ret;

	return defValue ;
};

var doesNodeMatch = (function (doc) {
	var matches = doc.matches || doc.mozMatchesSelector || doc.oMatchesSelector || doc.webkitMatchesSelector;

	return matches ? function (what, selector) {
		return matches.call (what, selector);
	} : function () {
		// No matche selector :<
		return false;
	};
}) (document.documentElement);

// 寻找翻译
var findTranslation = function (domSelector, origionalContent) {
	// Not string or undefined etc.
	if (!origionalContent) return null;

	var tmpNodeContent    = origionalContent.trim(),
		translatedContent = translation[domSelector][tmpNodeContent];

	// Empty string.
	if (!tmpNodeContent) return origionalContent;

	// Language string match!
	if (translatedContent) return translatedContent;

	// Check weather it has regex matches.
	if (!translation[domSelector].hasOwnProperty('__regex')) return null;

	// Check regex match.
	return _each (translation[domSelector].__regex, function (regex) {
		if (regex[0].test (tmpNodeContent))
			return String.prototype.replace.apply (tmpNodeContent, regex);
	});
};

var fixInput = function (domSelector, inputDom) {
	// 搜索框
	if (translatedContent = findTranslation(domSelector, inputDom.getAttribute ('placeholder') || ''))
		inputDom.setAttribute ('placeholder', translatedContent);

	// 提交按钮
	if (translatedContent = findTranslation(domSelector, inputDom.value || ''))
		inputDom.value = translatedContent;
};

var translateNode = function (domSelector, domNode) {
	// Fix input element
	if (domNode.nodeName == 'INPUT') {
		fixInput (domSelector, domNode);
		return ;
	}

	// Loop through all text nodes:
	// http://stackoverflow.com/a/2579869/3416493
	var walker = document.createTreeWalker(domNode, 4 /* NodeFilter.SHOW_TEXT */, function (textNode) {
		// Makesure not translating the code.
		// !parent > textNode should always be an element.
		if (doesNodeMatch(textNode.parentNode, 'pre, pre span, code'))
			return 2 /* NodeFilter.FILTER_REJECT */;

		return 1 /* NodeFilter.FILTER_ACCEPT */;
	}, false),
		node, translatedContent;

	// Loop through text nodes.
	while (node = walker.nextNode())
		if (translatedContent = findTranslation (domSelector, node.nodeValue))
			node.nodeValue = translatedContent;

	// Loop through inputs.
	_each (domNode.getElementsByTagName ('input'), fixInput.bind({}, domSelector));
};

var translateContent = function (domSelector, base) {
	_each (base.querySelectorAll (domSelector), translateNode.bind({}, domSelector));
};

var cbTranslate = function (base) {
	if (base.nodeType != 1)
		/**
		 * Node.nodeType:
		 * ELEMENT_NODE 	1
		 * TEXT_NODE 		3
		 */
		return ;

	for (var x in translation) {
		if (translation.hasOwnProperty (x)) {
			if (doesNodeMatch (base, x)) {
				translateNode (x, base);
			} else {
				translateContent (x, base);
			}
		}
	}
};

var mo = new MutationObserver (function (m) {
	_each (m, function (q) {
		_each (q.addedNodes, function (e) {
			if (e.className && e.className.indexOf ('firebug') != -1)
				return ;

			cbTranslate (e);
		});
	});
});

mo.observe (document, {
	childList: true,
	subtree: true,
	characterData: true
});

addEventListener ('DOMContentLoaded', function () {
	cbTranslate (document.body);
}, false);