/* eslint-disable no-multi-spaces */
/* eslint-disable no-useless-call */

// ==UserScript==
// @name         轻小说文库+
// @namespace    Wenku8+
// @version      1.4.8
// @description  TXT分卷批量下载，版权限制小说TXT简繁全本下载，书名/作者名双击复制，Ctrl+Enter快捷键发表书评，单章节下载，小说JPEG插图下载，下载线路点击切换，书评直接打开最后一页，书评帖子全贴下载保存，书评帖子回复功能增强，书评帖子自动刷新，书评帖子收藏，书架功能增强，修复文库若干自身bug，轻小说标签搜索(Feature Preview)，用户书评搜索，简单的阅读页和目录页美化，每日自动推书，帐号快速切换
// @author       PY-DNG
// @match        http*://www.wenku8.net/*
// @connect      wenku8.com
// @connect      wenku8.net
// @connect      greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_info
// @require      https://greasyfork.org/scripts/429557-gmrequirechecker/code/GMRequireChecker.js?version=951692
// @require      https://cdn.jsdelivr.net/gh/PYUDNG/CDN@eed1fcf0e901348bc4e752fd483bcb571ebe0408/js/GBK_URL/GBK.js
// @require      https://cdn.jsdelivr.net/gh/PYUDNG/CDN@058b97a4c86980fa3de3d9ee9bc9f2f787e11c84/js/gui/elegant%20alert.js
// @require      https://cdn.jsdelivr.net/gh/PYUDNG/CDN@94fc2bdd313f7bf2af6db5b8699effee8dd0b18d/js/ajax/GreasyForkScriptUpdate.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/429939/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/429939/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E6%96%87%E5%BA%93%2B.meta.js
// ==/UserScript==

/* 需求记录 [容易(优先级高) ➡️ 困难(优先级低)]
** [已完成]{BK}书评页提供用户书评搜索
** {BK}图片大小（最大）限制
** [已完成]{BK}回复区插入@好友
** {jack158}[部分完成]全卷/分卷下载：文件重命名为书名，而不是书号
** · [已完成分卷&Book页]添加单文件下载重命名
** {BK}回复区悬浮显示
** {热忱}[已完成]修复https引用问题
** [已完成]书评打开最后一页
** [待完善]书评实时更新
** [已完成]引用回复
** [beta已完成]支持preview版tag搜索
** [待完善]书评帖子收藏
** [已完成]每日自动推书
** [待完善]{热忱}快速切换账号
** · [已完成]为每个账号储存单独的配置
** · [待完善]保存账号信息并快速自动切换
** 快速插入图片/表情
** {BK}类似ehunter的阅读模式
** 改进旧代码：
** · 每个page-addon内部要按照功能分模块，执行功能靠调用模块，不能直接写功能代码
** · 共性模块要写进脚本全局作用域，可以的话写成构造函数
** {热忱}书评：@某人时通知他
** {BK}[部分完成]页面美化
** · [已完成]阅读页去除广告
** · …
** {热忱}提供带文字和插图的epub整合下载
** {BK}[待完善]书评：草稿箱功能
*/
/* API记录
** 阅读API：http://dl.wenku8.com/pack.php?aid=2478&vid=92914
** 回帖API：https://www.wenku8.net/modules/article/reviewshow.php?rid=209631&aid=2751
** 查人API：https://www.wenku8.net/modules/article/reviewslist.php?keyword=136877
** 读书API：https://www.wenku8.net/modules/article/reader.php?aid=2946
** 好友API：https://www.wenku8.net/myfriends.php  // 好友名称选择器：content.querySelectorAll('tr>td.odd:nth-child(1)')
** 登录API：https://www.wenku8.net/login.php?do=submit&jumpurl=http%3A%2F%2Fwww.wenku8.net%2Findex.php
** 最新回复:https://www.wenku8.net/modules/article/reviewslist.php?t=1
** 检查更新:https://greasyfork.org/zh-CN/scripts/416310/code/script.meta.js
*/
/* 帖子收藏
** 推书：https://www.wenku8.net/modules/article/reviewshow.php?rid=201225
** 推书：https://www.wenku8.net/modules/article/reviewshow.php?rid=208112
** 文库导航姬：https://www.wenku8.net/modules/article/reviewshow.php?rid=228884
** 我的书评：
** ** 扉之外：https://www.wenku8.net/modules/article/reviewshow.php?rid=229636
*/
/* 账号收藏
** wenku8高仿号（按照相似度排列）：
** ** https://www.wenku8.net/userpage.php?uid=912148
** ** https://www.wenku8.net/userpage.php?uid=728810
** ** https://www.wenku8.net/userpage.php?uid=917768
** BK高仿号
** ** https://www.wenku8.net/userpage.php?uid=918609
** 热忱高仿号
** ** https://www.wenku8.net/userpage.php?uid=918764
** 隐身鱼高仿号
** ** https://www.wenku8.net/userpage.php?uid=918773
*/
/* 等待回复：
** 最早标题内容回帖：https://www.wenku8.net/modules/article/reviewshow.php?rid=209588&aid=1797
** bug已反馈：https://www.wenku8.net/modules/article/reviewshow.php?rid=148298&aid=1143&page=2
** ？撕：https://www.wenku8.net/modules/article/reviewshow.php?rid=226899&aid=2937
** 少女不十分推荐：https://www.wenku8.net/modules/article/reviewshow.php?rid=227628&aid=1101
** 流星雨：https://www.wenku8.net/modules/article/reviewshow.php?rid=227265&aid=2632
** 回复插画跨域加载：https://www.wenku8.net/modules/article/reviewshow.php?rid=225702&aid=2925
** “惠”是谁？先吃口桃子：https://www.wenku8.net/modules/article/reviewshow.php?rid=220624&aid=2404
** Narcissu 游戏推荐贴：https://www.wenku8.net/modules/article/reviewshow.php?rid=227277
** 正在进行时的聊天区！大佬们的集合地：https://www.wenku8.net/modules/article/reviewshow.php?rid=208526&page=1410
** 鼠标的恋爱骚谈帖：https://www.wenku8.net/modules/article/reviewshow.php?rid=219280&page=1
** 热忱的自嗨贴：https://www.wenku8.net/modules/article/reviewshow.php?rid=218884&page=4
*/
/*
漏洞类型：xss漏洞
描述：在https://www.wenku8.net/userinfo.php中，文库提供了可以用户自定义的网站链接。经本人测试，服务器并未对链接进行过滤，产生了该XSS漏洞。
作用：经过攻击者的设计，可以在其他人访问并点击该链接时，执行攻击者的自定义javascript代码。
原理：在自定义网站链接处插入javascript:伪协议链接，通过window.opener对原网页进行读取和修改。
示例：https://www.wenku8.net/userinfo.php?id=917768
兼容性：MacOS_火狐、安卓_Alook测试通过，MacOS_Chrome、MacOS_Safari测试未通过，其余未测试。
*/
/* 表情：
** 滑稽：[img]data:image/png;base64,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[/img]
*/
(function() {
    'use strict';

    // Polyfills
	polyfill_replaceAll();
    const GM_POLYFILLED = GM_PolyFill('wenku8_plus');
	polyfill_GM_info('1.4.8');

    // CONSTS
	const NUMBER_MAX_XHR = 10;
	const NUMBER_LOGSUCCESS_AFTER = NUMBER_MAX_XHR * 2;
	const NUMBER_ELEMENT_LOADING_WAIT_INTERVAL = 500;

	const KEY_CM = 'Config-Manager';
	const KEY_CM_VERSION = 'version';
	const VALUE_CM_VERSION = '0.3';

	const KEY_LOCALCDN = 'LOCAL-CDN';
	const KEY_LOCALCDN_VERSION = 'version';
	const VALUE_LOCALCDN_VERSION = '0.1';

	const KEY_DRAFT_DRAFTS = 'comment-drafts';
	const KEY_DRAFT_VERSION = 'version';
	const VALUE_DRAFT_VERSION = '0.2';

	const KEY_REVIEW_PREFS = 'comment-preferences';
	const KEY_REVIEW_VERSION = 'version';
	const VALUE_REVIEW_VERSION = '0.5';

	const KEY_BOOKCASES = 'book-cases';
	const KEY_BOOKCASE_VERSION = 'version';
	const VALUE_BOOKCASE_VERSION = '0.3';

	const KEY_ATRCMMDS = 'auto-recommends';
	const KEY_ATRCMMDS_VERSION = 'version';
	const VALUE_ATRCMMDS_VERSION = '0.2';

	const KEY_USRDETAIL = 'user-detail';
	const KEY_USRDETAIL_VERSION = 'version';
	const VALUE_USRDETAIL_VERSION = '0.2';

	const VALUE_STR_NULL = 'null';

	const URL_REVIEWSEARCH = 'https://www.wenku8.net/modules/article/reviewslist.php?keyword={K}';
	const URL_REVIEWSHOW   = 'https://www.wenku8.net/modules/article/reviewshow.php?rid={R}&aid={A}&page={P}';
	const URL_USERINFO  = 'https://www.wenku8.net/userinfo.php?id={K}';
	const URL_DOWNLOAD1 = 'http://dl.wenku8.com/packtxt.php?aid={A}&vid={V}&charset={C}';
	const URL_DOWNLOAD2 = 'http://dl2.wenku8.com/packtxt.php?aid={A}&vid={V}&charset={C}';
	const URL_DOWNLOAD3 = 'http://dl3.wenku8.com/packtxt.php?aid={A}&vid={V}&charset={C}';
	const URL_RECOMMEND = 'https://www.wenku8.net/modules/article/uservote.php?id={B}';
	const URL_TAGSEARCH = 'https://www.wenku8.net/modules/article/tags.php?t={TU}';
	const URL_USRDETAIL = 'https://www.wenku8.net/userdetail.php';
	const URL_USRFRIEND = 'https://www.wenku8.net/myfriends.php';
	const URL_BOOKCASE  = 'https://www.wenku8.net/modules/article/bookcase.php';
	const URL_USRLOGIN  = 'https://www.wenku8.net/login.php?do=submit&jumpurl=http%3A%2F%2Fwww.wenku8.net%2Findex.php';
	const URL_USRLOGOFF = 'https://www.wenku8.net/logout.php';

	const DATA_XHR_LOGIN = [
		"username={U}",
		"password={P}",
		"usecookie={C}",
		"action=login",
		"submit=%26%23160%3B%B5%C7%26%23160%3B%26%23160%3B%C2%BC%26%23160%3B" // '&#160;登&#160;&#160;录&#160'
	].join('&');

	const CLASSNAME_BUTTON = 'plus_btn';
	const CLASSNAME_TEXT = 'plus_text';
	const CLASSNAME_DISABLED = 'plus_disabled';
	const CLASSNAME_BOOKCASE_FORM = 'plus_bcform';
	const CLASSNAME_AREAREPLY_AT = 'plus_atuser';

	const HTML_BOOK_COPY = '<span class="{C}">[复制]</span>'.replace('{C}', CLASSNAME_BUTTON);
	const HTML_BOOK_META = '{K}：{V}<span class="{C}">[复制]</span>'.replace('{C}', CLASSNAME_BUTTON);
	const HTML_BOOK_TAG = '<a class="{C}" href="{U}" target="_blank">{TN}</span>'.replace('{C}', CLASSNAME_BUTTON).replace('{U}', URL_TAGSEARCH);
    const HTML_DOWNLOAD_CONTENER = '<div id="dctn" style=\"margin:0px auto;overflow:hidden;\">\n<fieldset style=\"width:820px;height:35px;margin:0px auto;padding:0px;\">\n<legend><b>《{BOOKNAME}》小说TXT简繁全本下载</b></legend>\n</fieldset>\n</div>';
    const HTML_DOWNLOAD_LINKS = '<div id="txtfull"style="margin:0px auto;overflow:hidden;"><fieldset style="width:820px;height:35px;margin:0px auto;padding:0px;"><legend><b>《{ORIBOOKNAME}》小说TXT全本下载</b></legend><div style="width:16%; float:left; text-align:center;"><a href="http://dl.wenku8.com/down.php?type=txt&amp;id={BOOKID}">G版原始下载</a></div><div style="width:16%; float:left; text-align:center;"><a href="http://dl.wenku8.com/down.php?type=txt&amp;id={BOOKID}&amp;fname={BOOKNAME}.txt">G版自动重命名</a></div><div style="width:16%; float:left; text-align:center;"><a href="http://dl.wenku8.com/down.php?type=utf8&amp;id={BOOKID}">U版原始下载</a></div><div style="width:16%; float:left; text-align:center;"><a href="http://dl.wenku8.com/down.php?type=utf8&amp;id={BOOKID}&amp;fname={BOOKNAME}">U版自动重命名</a></div><div style="width:16%; float:left; text-align:center;"><a href="http://dl.wenku8.com/down.php?type=big5&amp;id={BOOKID}">繁体原始下载</a></div><div style="width:16%; float:left; text-align:center;"><a href="http://dl.wenku8.com/down.php?type=big5&amp;id={BOOKID}&amp;fname={BOOKNAME}">繁体自动重命名</a></div></fieldset></div>'.replaceAll('{C}', CLASSNAME_BUTTON);
    const HTML_DOWNLOAD_BOARD = '<span class="{C}">[轻小说文库+] 为您提供《{ORIBOOKNAME}》的TXT简繁全本下载！</br>由此产生的一切法律及其他问题均由脚本用户承担</br>—— PY-DNG</span>'.replace('{C}', CLASSNAME_TEXT);
    const CSS_DOWNLOAD = '.even {display: grid; grid-template-columns: repeat(3, 1fr); text-align: center;} .dlink {text-align: center;}';
	const CSS_AREAREPLY = '.{CAT}>ul {list-style: none; text-align: center; padding: 0px; margin: 0px;}'.replaceAll('{CAT}', CLASSNAME_AREAREPLY_AT);
    const CSS_COLOR_BTN_NORMAL = 'rgb(0, 160, 0)', CSS_COLOR_BTN_HOVER = 'rgb(0, 100, 0)';
    const CSS_COMMON = '.{CT} {color: rgb(30, 100, 220) !important;} .{CB} {color: rgb(0, 160, 0) !important; cursor: pointer !important;} .{CB}:hover {color: rgb(0, 100, 0) !important;} .{CB}:focus {color: rgb(0, 100, 0) !important;} .{CB}.{CD} {color: rgba(150, 150, 150) !important; cursor: not-allowed !important;}'.replaceAll('{CB}', CLASSNAME_BUTTON).replaceAll('{CT}', CLASSNAME_TEXT).replaceAll('{CD}', CLASSNAME_DISABLED);

	const ARR_GUI_BOOKCASE_WIDTH = ['3%', '19%', '9%', '25%', '20%', '9%', '5%', '10%'];

    const TEXT_TIP_COPY = '点击复制';
	const TEXT_TIP_COPIED = '已复制';
    const TEXT_TIP_SERVERCHANGE = '点击切换线路';
	const TEXT_TIP_SEARCH_OPTION_TAG = '有关标签搜索</br></br>未完善-开发中…</br>官方尚未正式开放此功能</br>功能预览由[轻小说文库+]提供';
	const TEXT_TIP_DOWNLOAD_BBCODE = 'BBCODE格式：</br>即文库评论的代码格式</br>相当于引用楼层时自动填入回复框的内容</br>保存为此格式可以保留排版及多媒体信息';
	const TEXT_TIP_ACCOUNT_NOACCOUNT = '没有储存的账号信息</br>请在登录页面手动登录一次，相关帐号信息就会自动储存</br></br>所有储存的账号信息都自动保存在浏览器的本地存储中';
	const TEXT_ALT_DOWNLOAD_BBCODE_NOCHANGE = '帖子正在下载中，请不要更改此设置！';
	const TEXT_ALT_DOWNLOADFINISH_REVIEW = '{T}({I}) 已下载完毕</br>{N} 已保存';
	const TEXT_ALT_AUTOREFRESH_ON = '页面自动刷新已开启';
	const TEXT_ALT_AUTOREFRESH_OFF = '页面自动刷新已关闭';
	const TEXT_ALT_AUTOREFRESH_NOTLAST = '请先翻到最后一页再开启页面自动刷新</br><span class="{CB}">[点击这里翻到最后一页]</span>'.replaceAll('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_AUTOREFRESH_WORKING = '正在获取新的回复...';
	const TEXT_ALT_AUTOREFRESH_NOMORE = '木有新的回复';
	const TEXT_ALT_AUTOREFRESH_FOUND = '发现新的回复，3s后刷新页面</br><span class="{CB}">[点击这里取消刷新]</span>'.replaceAll('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_AUTOREFRESH_PAUSED = '发现新的回复，由于您正在编辑回复，故暂不刷新</br><span class="{CB}">[我就是要刷新!]</span>'.replaceAll('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_META_COPIED = '{M} 已复制';
	const TEXT_ALT_ATRCMMDS_SAVED = '已保存：《{B}》</br>每日自动推荐{N}次</br>每日还可推荐{R}次';
	const TEXT_ALT_ATRCMMDS_INVALID = '未保存：{N}不是非负整数';
	const TEXT_ALT_ATRCMMDS_OVERFLOW = '注意：</br>您的用户信息显示您每天最多推荐{V}票</br>当前您已设置每日推荐合计{C}票</br><span class="{CB}">[单击此处以立即更新您的用户信息]</span>'.replaceAll('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_ATRCMMDS_AUTO = '已开启自动推书';
	const TEXT_ALT_ATRCMMDS_NOAUTO = '已关闭自动推书';
	const TEXT_ALT_ATRCMMDS_ALL_START = '{S}：正在自动推书...'.replaceAll('{S}', GM_info.script.name);
	const TEXT_ALT_ATRCMMDS_RUNNING = '正在推荐书目：</br>{BN}({BID})';
	const TEXT_ALT_ATRCMMDS_DONE = '推荐完成：</br>{BN}({BID})';
	const TEXT_ALT_ATRCMMDS_ALL_DONE = '全部书目推荐完成：</br>{R}';
	const TEXT_ALT_ATRCMMDS_NOTASK = '木有要推荐的书目╮(￣▽￣)╭';
	const TEXT_ALT_ATRCMMDS_NOTASK_OPENBC = '您还没有设置每日自动推荐的书目╮(￣▽￣)╭</br><span class="{CB}">[点击此处打开书架页面进行设置]</span>'.replaceAll('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_ATRCMMDS_NOTASK_PLSSET = '请在\'自动推书\'一栏设置每日推荐的书目及推荐次数';
	const TEXT_ALT_ATRCMMDS_MAXRCMMD = '根据您的头衔，您每日一共可以推荐{V}次';
	const TEXT_ALT_USRDTL_REFRESH = '{S}：正在更新用户信息({T})...'.replaceAll('{S}', GM_info.script.name).replaceAll('{T}', getTime());
	const TEXT_ALT_USRDTL_REFRESHED = '{S}：用户信息已更新</br><span class="{CB}">[点此查看详细信息]</span>'.replaceAll('{S}', GM_info.script.name).replaceAll('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_POLYFILL = '<span class="{CT}">提示：正在使用移动端适配模式</span>'.replaceAll('{CT}', CLASSNAME_TEXT);
	const TEXT_ALT_LASTPAGE_LOADING = '正在获取最后一页，请稍候...';
	const TEXT_ALT_ACCOUNT_SWITCHED = '帐号已切换到 <i>"<span class="{CT}">{N}</span>"</i></br>3s后自动刷新页面</br><span class="{CB}">点击这里取消刷新</span>'.replaceAll('{CT}', CLASSNAME_TEXT).replaceAll('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_ACCOUNT_WORKING_LOGOFF = '正在退出当前账号...';
	const TEXT_ALT_ACCOUNT_WORKING_LOGIN = '正在登录...';
	const TEXT_ALT_SCRIPT_UPDATE_CHECKING = '正在检查脚本更新...';
	const TEXT_ALT_SCRIPT_UPDATE_GOT = '<div class="{CT}">{SN} 有新版本啦！</br>新版本：{NV}</br>当前版本：{CV}</br><span class="{CB}">[点击此处安装更新]</span></div>'.replaceAll('{CT}', CLASSNAME_TEXT).replaceAll('{CB}', CLASSNAME_BUTTON);
	const TEXT_ALT_SCRIPT_UPDATE_NONE = '当前已是最新版本';
	const TEXT_GUI_REQUIRE_FAILED = '动态加载依赖js库失败（自动重试也都失败了），请刷新页面后再试:(';
    const TEXT_GUI_DOWNLOAD_IMAGE = '下载图片';
    const TEXT_GUI_DOWNLOAD_TEXT = '下载本章';
	const TEXT_GUI_REVIEW_ADDFAVORITE = '收藏本帖：';
	const TEXT_GUI_REVIEW_FAVORADDED = '已收藏 {N}';
	const TEXT_GUI_REVIEW_FAVORDELED = '已从收藏中移除 {N}';
    const TEXT_GUI_DOWNLOAD_REVIEW = '[下载本帖(共A页)]';
    const TEXT_GUI_DOWNLOADING_REVIEW = '[下载中...(C/A)]';
	const TEXT_GUI_DOWNLOAD_BBCODE = '保存为BBCODE格式：';
    const TEXT_GUI_DOWNLOADFINISH_REVIEW = '[下载完毕]';
	const TEXT_GUI_DOWNLOADALL = '下载全部分卷，请点击右边的按钮：';
	const TEXT_GUI_WAITING = ' 等待中...';
    const TEXT_GUI_DOWNLOADING = ' 下载中...';
    const TEXT_GUI_DOWNLOADED = ' (下载完毕)';
	const TEXT_GUI_NOTHINGHERE = '<span style="color:grey">-Nothing Here-</span>';
	const TEXT_GUI_SDOWNLOAD = '地址三(程序重命名)';
    const TEXT_GUI_DOWNLOADING_ALL = '下载中...(C/A)';
    const TEXT_GUI_DOWNLOADED_ALL = '下载图片(已完成)';
	const TEXT_GUI_AUTOREFRESH = '自动更新页面：';
	const TEXT_GUI_AUTOREFRESH_PAUSED = '(回复编辑中，暂停刷新)';
	const TEXT_GUI_AUTOSAVE = '（您输入的内容已保存到书评草稿中）';
	const TEXT_GUI_AUTOSAVE_CLEAR = '（草稿为空）';
	const TEXT_GUI_AUTOSAVE_RESTORE = '（已从书评草稿中恢复了您上次编辑的内容）';
	const TEXT_GUI_AREAREPLY_AT = '想用@提到谁？';
	const TEXT_GUI_INDEX_FAVORITES = '收藏的书评';
	const TEXT_GUI_BOOKCASE_GETTING = '正在搬运书架...(C/A)';
	const TEXT_GUI_BOOKCASE_TOPTITLE = '您的书架可收藏 A 本，已收藏 B 本';
	const TEXT_GUI_BOOKCASE_MOVEBOOK = '移动到 [N]';
	const TEXT_GUI_BOOKCASE_DBLCLICK = '双击/长按我，给我取一个好听的名字吧～';
	const TEXT_GUI_BOOKCASE_WHATNAME = '呜呜呜～会是什么名字呢？';
	const TEXT_GUI_BOOKCASE_ATRCMMD = '自动推书';
	const TEXT_GUI_BOOKCASE_RCMMDAT = '<span>每日自动推书：</span>';
	const TEXT_GUI_BOOKCASE_RCMMDNW = '立即推书';
	const TEXT_GUI_BOOKCASE_RCMMDNW_DONE = '今日推书已完成';
	const TEXT_GUI_BOOKCASE_RCMMDNW_NOTYET = '今日尚未推书';
	const TEXT_GUI_BOOKCASE_RCMMDNW_NOTASK = '您还没有设置自动推书';
	const TEXT_GUI_BOOKCASE_RCMMDNW_CONFIRM = '今天已经推过书了，是否要再推一遍？';
	const TEXT_GUI_SEARCH_OPTION_TAG = '标签(preview)';
	const TEXT_GUI_BLOCK_TITLE_DEFULT = '操作区域';
	const TEXT_GUI_USER_REVIEWSEARCH = '用户书评';
	const TEXT_GUI_USER_USERINFO = '详细资料';
	const TEXT_GUI_LINK_TOLASTPAGE = '[打开尾页]';
	const TEXT_GUI_ACCOUNT_SWITCH = '切换账号：';
	const TEXT_GUI_ACCOUNT_CONFIRM = '是否要切换到帐号 "{N}"？';
	const TEXT_GUI_ACCOUNT_NOACCOUNT = '(帐号列表为空)';
	const TEXT_GUI_ACCOUNT_NOTLOGGEDIN = '(没有登录信息)';

	// Emoji smiles (not used in the script yet)
	const SmList =
		  [{text:"/:O",id:"1",alt:"惊讶"}, {text:"/:~",id:"2",alt:"撇嘴"}, {text:"/:*",id:"3",alt:"色色"},
		   {text:"/:|",id:"4",alt:"发呆"}, {text:"/8-)",id:"5",alt:"得意"}, {text:"/:LL",id:"6",alt:"流泪"},
		   {text:"/:$",id:"7",alt:"害羞"}, {text:"/:X",id:"8",alt:"闭嘴"}, {text:"/:Z",id:"9",alt:"睡觉"},
		   {text:"/:`(",id:"10",alt:"大哭"}, {text:"/:-",id:"11",alt:"尴尬"}, {text:"/:@",id:"12",alt:"发怒"},
		   {text:"/:P",id:"13",alt:"调皮"}, {text:"/:D",id:"14",alt:"呲牙"}, {text:"/:)",id:"15",alt:"微笑"},
		   {text:"/:(",id:"16",alt:"难过"}, {text:"/:+",id:"17",alt:"耍酷"}, {text:"/:#",id:"18",alt:"禁言"},
		   {text:"/:Q",id:"19",alt:"抓狂"}, {text:"/:T",id:"20",alt:"呕吐"}]

    /* \t
    ┌┬┐┌─┐┏┳┓┏━┓╭─╮
    ├┼┤│┼│┣╋┫┃╋┃│╳│
    └┴┘└─┘┗┻┛┗━┛╰─╯
    ╲╱╭╮
    ╱╲╰╯
    */
    /* **output format: Review Name.txt**
    ** 轻小说文库-帖子 [ID: reviewid]
    ** title
    ** 保存自: reviewlink
    ** 保存时间: savetime
    ** By scriptname Ver. version, author authorname
    **
    ** ──────────────────────────────
    ** [用户: username userid]
    ** 用户名: username
    ** 用户ID: userid
    ** 加入日期: 1970-01-01
    ** 用户链接: userlink
    ** 最早出现: 1楼
    ** ──────────────────────────────
    ** ...
    ** ──────────────────────────────
    ** [#1 2021-04-26 17:53:49] [username userid]
    ** ──────────────────────────────
    ** content - line 1
    ** content - line 2
    ** content - line 3
    ** ──────────────────────────────
    **
    ** ──────────────────────────────
    ** [#2 2021-04-26 19:28:08] [username userid]
    ** ──────────────────────────────
    ** content - line 1
    ** content - line 2
    ** content - line 3
    ** ──────────────────────────────
    **
    ** ...
    **
    **
    ** [THE END]
    */
    const TEXT_SPLIT_LINE_CHAR = '━'; const TEXT_SPLIT_LINE = TEXT_SPLIT_LINE_CHAR.repeat(20)
    const TEXT_OUTPUT_REVIEW_HEAD =
          '轻小说文库-帖子 [ID: {RWID}]\n{RWTT}\n保存自: {RWLK}\n保存时间: {SVTM}\nBy {SCNM} Ver. {VRSN}, author {ATNM}'
    const TEXT_OUTPUT_REVIEW_USER =
          '{LNSPLT}\n[用户: {USERNM} {USERID}]\n用户名: {USERNM}\n用户ID: {USERID}\n加入日期: {USERJT}\n用户链接: {USERLK}\n最早出现: {USERFL}楼\n{LNSPLT}'
    const TEXT_OUTPUT_REVIEW_FLOOR =
          '{LNSPLT}\n[#{RPNUMB} {RPTIME}] [{USERNM} {USERID}]\n{LNSPLT}\n{RPTEXT}\n{LNSPLT}';
    const TEXT_OUTPUT_REVIEW_END = '\n[THE END]';

    // Arguments: level=LogLevel.Info, logContent, asObject=false
    // Needs one call "DoLog();" to get it initialized before using it!
    function DoLog() {
        // Global log levels set
        window.LogLevel = {
            None: 0,
            Error: 1,
            Success: 2,
            Warning: 3,
            Info: 4,
        }
        window.LogLevelMap = {};
        window.LogLevelMap[LogLevel.None]     = {prefix: ''          , color: 'color:#ffffff'}
        window.LogLevelMap[LogLevel.Error]    = {prefix: '[Error]'   , color: 'color:#ff0000'}
        window.LogLevelMap[LogLevel.Success]  = {prefix: '[Success]' , color: 'color:#00aa00'}
        window.LogLevelMap[LogLevel.Warning]  = {prefix: '[Warning]' , color: 'color:#ffa500'}
        window.LogLevelMap[LogLevel.Info]     = {prefix: '[Info]'    , color: 'color:#888888'}
        window.LogLevelMap[LogLevel.Elements] = {prefix: '[Elements]', color: 'color:#000000'}

        // Current log level
        DoLog.logLevel = LogLevel.Info; // Info Warning Success Error

        // Log counter
        DoLog.logCount === undefined && (DoLog.logCount = 0);
        if (++DoLog.logCount > 512) {
            console.clear();
            DoLog.logCount = 0;
        }

        // Get args
        let level, logContent, asObject;
        switch (arguments.length) {
            case 1:
                level = LogLevel.Info;
                logContent = arguments[0];
                asObject = false;
                break;
            case 2:
                level = arguments[0];
                logContent = arguments[1];
                asObject = false;
                break;
            case 3:
                level = arguments[0];
                logContent = arguments[1];
                asObject = arguments[2];
                break;
            default:
                level = LogLevel.Info;
                logContent = 'DoLog initialized.';
                asObject = false;
                break;
        }

        // Log when log level permits
        if (level <= DoLog.logLevel) {
            let msg = '%c' + LogLevelMap[level].prefix;
            let subst = LogLevelMap[level].color;

            if (asObject) {
                msg += ' %o';
            } else {
                switch(typeof(logContent)) {
                    case 'string': msg += ' %s'; break;
                    case 'number': msg += ' %d'; break;
                    case 'object': msg += ' %o'; break;
                }
            }

            console.log(msg, subst, logContent);
        }
    }
    DoLog();

	let tipready, CONFIG, TASK
	let API
    loadRequires(main);

	// Main
	function main() {
		// Common actions
		polyfillAlert();
		tipready = tipcheck();
		addStyle(CSS_COMMON);
		GMXHRHook(NUMBER_MAX_XHR);
		CONFIG = new configManager();
		TASK = new taskManager();
		formSearch();
		linkReview();
		multiAccount();

		// Get tab url api part
		API = window.location.href.replace(/https?:\/\/www\.wenku8\.net\//, '').replace(/\?.*/, '')
			.replace(/^book\/\d+\.html?/, 'book').replace(/novel\/(\d+\/?)+\.html?$/, 'novel')
			.replace(/^novel[\/\d]+index\.html?$/, 'novelindex');
		if (isAPIPage()) {
			pageAPI(API);
			return;
		};
		if (!API) {
			location.href = 'https://www.wenku8.net/index.php';
			return;
		};
		switch (API) {
			// Dwonload page
			case 'modules/article/packshow.php':
				pageDownload();
				break;
			// ReviewList page
			case 'modules/article/reviews.php':
				areaReply();
				break;
			// Review page
			case 'modules/article/reviewshow.php':
				areaReply();
				pageReview();
				break;
			// ReviewEdit page
			case 'modules/article/reviewedit.php':
				areaReply();
                pageReviewedit();
				break;
			// Bookcase page
			case 'modules/article/bookcase.php':
				pageBookcase();
				break;
			// Tags page
			case 'modules/article/tags.php':
				pageTags();
				break;
			case 'userpage.php':
				pageUser();
				break;
			// Index page
			case 'index.php':
				pageIndex();
				break;
			// Book page
			// Also: https://www.wenku8.net/modules/article/articleinfo.php?id={ID}&charset=gbk
			case 'book':
				pageBook();
				break;
			// Novel index page
			case 'novelindex':
				pageNovelIndex();
				break;
			// Novel page
			case 'novel':
				pageNovel();
				break;
			// Login page
			case 'login.php':
				pageLogin();
				break;
			// Other pages
			default:
				DoLog(LogLevel.Info, API);
		}
	}

	// Autorun tasks
	// use 'new' keyword
	function taskManager() {
		const TM = this;

		// UserDetail refresh
		TM.UserDetail = {
			// Refresh userDetail storage everyday
			refresh: function() {
				// Time check: whether recommend has done today
				if (getMyUserDetail().lasttime === getTime('-', false)) {return false;};
				refreshMyUserDetail();
			}
		}

		// Auto-recommend
		TM.AutoRecommend = {

			// Check if recommend has done
			checkRcmmd: function() {
				const arConfig = CONFIG.AutoRecommend.getConfig();
				return arConfig.lasttime === getTime('-', false);
			},

			// Auto recommend main function
			run: function(recommendAnyway=false) {
				let i;

				// Get config
				const arConfig = CONFIG.AutoRecommend.getConfig();

				// Time check: whether all recommends has done today
				if (TM.AutoRecommend.checkRcmmd() && !recommendAnyway) {return false;};

				// Config check: whether we need to auto-recommend
				if (!arConfig.auto && !recommendAnyway) {return false;}

				// Config check: whether the recommend list is empty
				if (arConfig.allCount === 0) {
					const altBox = new ElegantAlertBox(
						/modules\/article\/bookcase\.php$/.test(location.href) ?
						TEXT_ALT_ATRCMMDS_NOTASK_PLSSET + (getMyUserDetail().userDetail ? '</br>'+TEXT_ALT_ATRCMMDS_MAXRCMMD.replace('{V}', String(getMyUserDetail().userDetail.vote)) : '') :
						TEXT_ALT_ATRCMMDS_NOTASK_OPENBC
					);
					altBox.elm.onclick = (e) => {
						window.open(URL_BOOKCASE);
					}
					return false;
				};

				// Recommend for each
				let recommended = '', count = 0, allCount = 0;
				new ElegantAlertBox(TEXT_ALT_ATRCMMDS_ALL_START);
				for (const strBookID in arConfig.books) {
					// Only when inherited properties exists must we use hasOwnProperty()
					// here we know there is no inherited properties
					const book = arConfig.books[strBookID]
					const number = book.number;
					const bookID = book.id;
					const bookName = book.name;

					// Time check: whether this book's recommend has done today
					if (book.lasttime === getTime('-', false) && !recommendAnyway) {continue;};

					// Soft alert
					//new ElegantAlertBox(TEXT_ALT_ATRCMMDS_RUNNING.replaceAll('{BN}', bookName).replaceAll('{BID}', strBookID));

					// Go work
					for (i = 0; i < number; i++) {
						allCount++;
						getDocument(URL_RECOMMEND.replaceAll('{B}', strBookID), function(oDoc) {
							// title: "处理成功"
							const statusText = oDoc.querySelector('.blocktitle').innerText;
							// content: "我们已经记录了本次推荐，感谢您的参与！\n\n您每天拥有 5 次推荐权利，这是您今天第 1 次推荐。"
							const returnText = oDoc.querySelector('.blockcontent').innerText.replace(/\s*\[.+\]\s*$/, '');

							// Save
							count++;
							book.lasttime = getTime('-', false);
							count === allCount ? arConfig.lasttime = getTime('-', false) : function() {};
							CONFIG.AutoRecommend.saveConfig(arConfig);

							// GUI
							recommended += '</br>{BID} - {BN}'.replaceAll('{BN}', bookName).replaceAll('{BID}', strBookID);
							count === allCount ? new ElegantAlertBox(TEXT_ALT_ATRCMMDS_ALL_DONE.replaceAll('{R}', recommended)) : function() {};

							// Log
							DoLog(LogLevel.Info, statusText);
							DoLog(LogLevel.Info, returnText);
						})
					}

					// Soft alert
					//new ElegantAlertBox(TEXT_ALT_ATRCMMDS_DONE.replaceAll('{BN}', bookName).replaceAll('{BID}', strBookID));
				}

				return true;
			}
		}

		// Script
		TM.Script = {
			// Check & Update to latest version of script
			update: function() {
				// Check for update once a day
				const scriptID = 429939;
				const config = CONFIG.GlobalConfig.getConfig();
				if (config.scriptUpdate.lasttime === getTime('-', false)) {return false;}

				const GFU = new GreasyForkUpdater();
				new ElegantAlertBox(TEXT_ALT_SCRIPT_UPDATE_CHECKING);
				GFU.checkUpdate(scriptID, GM_info.script.version, function(update, updateurl, metaData) {
					if (update) {
						const box = new ElegantAlertBox(TEXT_ALT_SCRIPT_UPDATE_GOT.replaceAll('{SN}', metaData.name).replaceAll('{NV}', metaData.version).replaceAll('{CV}', GM_info.script.version));
						box.elm.onclick = function() {
							box.close.call(box);
							location.href = updateurl;
						}
					} else {
						new ElegantAlertBox(TEXT_ALT_SCRIPT_UPDATE_NONE);
					}
					config.scriptUpdate.lasttime = getTime('-', false);
					CONFIG.GlobalConfig.saveConfig(config);
				});

				return true;
			}
		}

		TM.Script.update();
		TM.UserDetail.refresh();
		TM.AutoRecommend.run();
	}

	// Config Manager
	// use 'new' keyword
	function configManager() {
		const CM = this;
		const [getValue, setValue, deleteValue, listValues] = [
			window.getValue    ? window.getValue    : GM_getValue,
			window.setValue    ? window.setValue    : GM_setValue,
			window.deleteValue ? window.deleteValue : GM_deleteValue,
			window.listValues  ? window.listValues  : GM_listValues,
		]

		CM.GlobalConfig = {
			saveConfig: function(config) {
				config ? config[KEY_CM_VERSION] = VALUE_CM_VERSION : function() {};
				setValue(KEY_CM, config);
			},

			initConfig: function(save=true, func) {
				let config = {
					users: {},
					scriptUpdate: {
						lasttime: ''
					}
				};

				config = func ? func(config) : config;
				save ? CM.GlobalConfig.saveConfig(config) : function() {};
				return config;
			},

			getConfig: function(init) {
				let config = getValue(KEY_CM, null);
				config = config ? config : (init ? CM.GlobalConfig.initConfig(true, init) : CM.GlobalConfig.initConfig());
				return config;
			},

			// Review config upgrade (Uses GM_functions)
			upgradeConfig: function() {
				// Get version
				const default_self = {}; default_self[KEY_CM_VERSION] = '0.1'; // v0.1 has no self object
				const self = GM_getValue(KEY_CM, default_self);
				const version = self[KEY_CM_VERSION];

				// Upgrade by version
				if (self[KEY_CM_VERSION] === VALUE_CM_VERSION) {DoLog(LogLevel.Info, 'Config Manager self config is in latest version. ');};
				switch(version) {
					case '0.1':
						v01_To_v02();
						v02_To_v03();
						logUpgrade();
						break;
					case '0.2':
						v02_To_v03();
						logUpgrade();
						break;
				}

				// Save to global gm_storage
				self[KEY_CM_VERSION] = VALUE_CM_VERSION;
				setValue(KEY_CM, self);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'Config Manager self config successfully upgraded From v{V1} to v{V2}. '.replaceAll('{V1}', version).replaceAll('{V2}', VALUE_CM_VERSION));
				}

				function v01_To_v02() {
					const props = GM_listValues();
					const userStorage = {};
					for (const prop of props) {
						userStorage[prop] = GM_getValue(prop);
					}
					const userID = getUserID();
					userID ? GM_setValue(userID, userStorage) : GM_setValue('temp', userStorage);
					for (const prop of props) {
						GM_deleteValue(prop);
					}
				}

				function v02_To_v03() {
					self.scriptUpdate = self.scriptUpdate ? self.scriptUpdate : {lasttime: ''};
				}
			},

			// Redirect global gm_storage to user's storage area (Uses GM_functions)
			// callback(key)
			redirectToUser: function (callback) {
				// Get userID from cookies
				const userID = getUserID();

				if (userID) {
					// delete temp data if exist
					GM_deleteValue('temp');

					// Save lastUserID
					const config = CM.GlobalConfig.getConfig();
					config.lastUserID = userID;
					CM.GlobalConfig.saveConfig(config);

					// Redirect to user storage area
					redirectGMStorage(userID);
					DoLog(LogLevel.Info, 'GM_storage redirected to ' + String(userID));
				} else {
					// Redirect to temp storage area before request finish
					const lastUserID = CM.GlobalConfig.getConfig().lastUserID;
					redirectTemp(lastUserID);

					// Request userID
					getMyUserDetail((userDetail)=>{
						const key = userDetail.userDetail.userID;

						// Move temp data to user storage area
						redirectGMStorage();
						const tempStorage = GM_getValue('temp');
						GM_setValue(lastUserID ? lastUserID : key, tempStorage);
						GM_deleteValue('temp');

						// Save lastUserID
						const config = CM.GlobalConfig.getConfig();
						config.lastUserID = key;
						CM.GlobalConfig.saveConfig(config);

						// Redirect to user storage area
						redirectGMStorage(key);
						DoLog(LogLevel.Info, 'GM_storage redirected to ' + String(key));

						// callback
						callback ? callback(key) : function() {};
					})
				}

				// When userID request not finished, use 'temp' as gm_storage key
				function redirectTemp(lastUserID) {
					if (lastUserID) {
						// Copy config of the user we use last time to 'temp' storage area
						const lastUser = GM_getValue(lastUserID, {});
						GM_setValue('temp', lastUser);
					}
					redirectGMStorage('temp');
					DoLog(LogLevel.Info, 'GM_storage redirected to temp');
				}
			}
		}

		CM.GlobalConfig.upgradeConfig();
		CM.GlobalConfig.redirectToUser();

		CM.AutoRecommend = {
			saveConfig: function(config) {
				config ? config[KEY_ATRCMMDS_VERSION] = VALUE_ATRCMMDS_VERSION : function() {};
				GM_setValue(KEY_ATRCMMDS, config);
			},

			initConfig: function(save=true, func) {
				let config = {};
				config[KEY_ATRCMMDS_VERSION] = VALUE_ATRCMMDS_VERSION;
				config.allCount = 0;
				config.books = {};
				config.auto = true;

				config = func ? func(config) : config;
				save ? CM.AutoRecommend.saveConfig(config) : function() {};
				return config;
			},

			getConfig: function(init) {
				let config = GM_getValue(KEY_ATRCMMDS, null);
				config = config ? config : (init ? CM.AutoRecommend.initConfig(true, init) : CM.AutoRecommend.initConfig());
				return config;
			},

			// Auto-recommend config upgrade
			upgradeConfig: function() {
				// Get config
				const config = CM.AutoRecommend.getConfig();

				// if not inited
				if (!config) {return;};

				switch (config[KEY_ATRCMMDS_VERSION]) {
					case '0.1':
						config.auto = true;
						logUpgrade();
						break;
					case VALUE_ATRCMMDS_VERSION:
						DoLog(LogLevel.Info, 'Auto-recommend config is in latest version. ');
						break;
					default:
						DoLog(LogLevel.Error, 'configCheckUpgrade: Invalid config version({V}) for Auto-recommend. '.replace('{V}', config[KEY_ATRCMMDS_VERSION]));
				}

				// Save to gm_storage
				CM.AutoRecommend.saveConfig(config);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'Auto-recommend config successfully upgraded From v{V1} to {V2}. '.replaceAll('{V1}', config[KEY_ATRCMMDS_VERSION]).replaceAll('{V2}', VALUE_ATRCMMDS_VERSION));
				}
			}
		}

		CM.commentDrafts = {
			saveConfig: function(config) {
				config ? config[KEY_DRAFT_VERSION] = VALUE_DRAFT_VERSION : function() {};
				GM_setValue(KEY_DRAFT_DRAFTS, config);
			},

			initConfig: function(save=true, func) {
				let config = {};

				config = func ? func(config) : config;
				save ? CM.commentDrafts.saveConfig(config) : function() {};
				return config;
			},

			getConfig: function(init) {
				let config = GM_getValue(KEY_DRAFT_DRAFTS, null);
				config = config ? config : (init ? CM.commentDrafts.initConfig(true, init) : CM.commentDrafts.initConfig());
				return config;
			},

			// Comment-drafts config upgrade
			upgradeConfig: function() {
				// Get config
				let config = CM.commentDrafts.getConfig();

				// if not inited
				if (!config) {return;};

				switch (config[KEY_DRAFT_VERSION]) {
					case '0.1':
					case undefined:
						v01_To_v02();
						logUpgrade();
						break;
					case VALUE_DRAFT_VERSION:
						DoLog(LogLevel.Info, 'comment-drafts config is in latest version. ');
						break;
					default:
						DoLog(LogLevel.Error, 'configCheckUpgrade: Invalid config version({V}) for comment-drafts. '.replace('{V}', config[KEY_DRAFT_VERSION]));
				}

				// Save to gm_storage
				CM.commentDrafts.saveConfig(config);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'comment-drafts config successfully upgraded From v{V1} to {V2}. '.replaceAll('{V1}', config[KEY_DRAFT_VERSION]).replaceAll('{V2}', VALUE_DRAFT_VERSION));
				}

				function v01_To_v02() {
					// Fix bug caused bookcase's config overwriting comment-drafts' config
					if (config instanceof Array) {
						config = {};
					}
				}
			}
		}

		CM.bookcasePrefs = {
			saveConfig: function(config) {
				config ? config[KEY_BOOKCASE_VERSION] = VALUE_BOOKCASE_VERSION : function() {};
				GM_setValue(KEY_BOOKCASES, config);
			},

			initConfig: function(save=true, func) {
				let config = null;

				config = func ? func(config) : config;
				save ? CM.bookcasePrefs.saveConfig(config) : function() {};
				return config;
			},

			getConfig: function(init) {
				let config = GM_getValue(KEY_BOOKCASES, null);
				config = config ? config : (init ? CM.bookcasePrefs.initConfig(true, init) : CM.bookcasePrefs.initConfig());
				return config;
			},

			// Bookcase config upgrade
			upgradeConfig: function() {
				// Get config
				let config = CM.bookcasePrefs.getConfig();

				// if not inited
				if (!config) {return;};

				// Original version
				let V = config && config[KEY_BOOKCASE_VERSION] ? config[KEY_BOOKCASE_VERSION] : '0';

				switch (V) {
					case '0.1':
					case undefined:
					case '0':
						v01_To_v02();
						v02_To_v03();
						logUpgrade();
						break;
					case '0.2':
						v01_To_v02();
						v02_To_v03();
						logUpgrade();
						break;
					case VALUE_BOOKCASE_VERSION:
						DoLog(LogLevel.Info, 'Bookcase config is in latest version. ');
						break;
					default:
						DoLog(LogLevel.Error, 'configCheckUpgrade: Invalid config version({V}) for Bookcase. '.replace('{V}', config[KEY_BOOKCASE_VERSION]));
				}

				// Save to gm_storage
				CM.bookcasePrefs.saveConfig(config);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'Bookcase config successfully upgraded From v{V1} to v{V2}. '.replaceAll('{V1}', V).replaceAll('{V2}', VALUE_BOOKCASE_VERSION));
				}

				function v01_To_v02() {
					// Clear useless key added falsely
					delete config.bbcode;

					// Convert array to an object
					if (config instanceof Array) {
						const newConfig = {bookcases: []};
						for (let i = 0; i < config.length; i++) {
							newConfig.bookcases[i] = config[i];
						}
						config = newConfig;
					}
				}

				function v02_To_v03() {
					// Fix bug caused config.bookcases equals to []
					if (config && config.bookcases && config.bookcases.length === 0) {
						config = CM.bookcasePrefs.initConfig();
					}
				}
			}
		}

		CM.userDtlePrefs = {
			saveConfig: function(config) {
				config ? config[KEY_USRDETAIL_VERSION] = VALUE_USRDETAIL_VERSION : function() {};
				GM_setValue(KEY_USRDETAIL, config);
			},

			initConfig: function(save=true, func) {
				let config = {userDetail: null};

				config = func ? func(config) : config;
				save ? CM.userDtlePrefs.saveConfig(config) : function() {};
				return config;
			},

			getConfig: function(init) {
				let config = GM_getValue(KEY_USRDETAIL, null);
				config = config ? config : (init ? CM.userDtlePrefs.initConfig(true, init) : CM.userDtlePrefs.initConfig());
				return config;
			},

			// userDetail config upgrade
			upgradeConfig: function() {
				// Get config
				const config = CM.userDtlePrefs.getConfig();

				// if not inited
				if (!config) {return;};

				// Original version
				let V = config && config[KEY_BOOKCASE_VERSION] ? config[KEY_BOOKCASE_VERSION] : '0';

				switch (V) {
					case '0.1':
						refreshMyUserDetail(logUpgrade);
						break;
					case VALUE_USRDETAIL_VERSION:
						DoLog(LogLevel.Info, 'User-detail config is in latest version. ');
						break;
					default:
						DoLog(LogLevel.Error, 'configCheckUpgrade: Invalid config version({V}) for User-detail. '.replace('{V}', V));
				}

				// Save to gm_storage
				CM.userDtlePrefs.saveConfig(config);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'User-detail config successfully upgraded From v{V1} to v{V2}. '.replaceAll('{V1}', V).replaceAll('{V2}', VALUE_USRDETAIL_VERSION));
				}
			}
		}

		CM.BkReviewPrefs = {
			saveConfig: function(config) {
				config ? config[KEY_REVIEW_VERSION] = VALUE_REVIEW_VERSION : function() {};
				GM_setValue(KEY_REVIEW_PREFS, config);
			},

			initConfig: function(save=true, func) {
				let config = {
					bbcode: false,
					autoRefresh: false,
					favorites: {
						228884: {
							name: '文库导航姬',
							href: 'https://www.wenku8.net/modules/article/reviewshow.php?rid=228884',
							tiptitle: '梦想成为书评区大水怪的可以来康康'
						}
					},
                    history: {}
				};

				config = func ? func(config) : config;
				save ? CM.BkReviewPrefs.saveConfig(config) : function() {};
				return config;
			},

			getConfig: function(init) {
				let config = GM_getValue(KEY_REVIEW_PREFS, null);
				config = config ? config : (init ? CM.BkReviewPrefs.initConfig(true, init) : CM.BkReviewPrefs.initConfig());
				return config;
			},

			// Review config upgrade
			upgradeConfig: function() {
				// Get config
				const config = CM.BkReviewPrefs.getConfig();

				// if not inited
				if (!config) {return;};

				switch (config[KEY_REVIEW_VERSION]) {
					case '0.1':
						v01_To_v02();
						v02_To_v03();
						v03_To_v04();
						v04_To_v05();
						logUpgrade();
						break;
					case '0.2':
						v02_To_v03();
						v03_To_v04();
						v04_To_v05();
						logUpgrade();
						break;
					case '0.3':
						v03_To_v04();
						v04_To_v05();
						logUpgrade();
						break;
                    case '0.4':
						v04_To_v05();
						logUpgrade();
						break;
					case VALUE_REVIEW_VERSION:
						DoLog(LogLevel.Info, 'Review config is in latest version. ');
						break;
					default:
						DoLog(LogLevel.Error, 'configCheckUpgrade: Invalid config version({V}) for Review. '.replace('{V}', config[KEY_REVIEW_VERSION]));
				}

				// Save to gm_storage
				CM.BkReviewPrefs.saveConfig(config);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'Review config successfully upgraded From v{V1} to v{V2}. '.replaceAll('{V1}', config[KEY_REVIEW_VERSION]).replaceAll('{V2}', VALUE_REVIEW_VERSION));
				}

				function v01_To_v02() {
					config.autoRefresh = false;
					delete config.downloading;
				}

				function v02_To_v03() {
					config.favorites = {
						228884: {
							name: '文库导航姬',
							href: 'https://www.wenku8.net/modules/article/reviewshow.php?rid=228884',
							tiptitle: '梦想成为书评区大水怪的可以来康康'
						}
					}
				}

				function v03_To_v04() {
					if (config.favorites) {return;};
					config.favorites = {
						228884: {
							name: '文库导航姬',
							href: 'https://www.wenku8.net/modules/article/reviewshow.php?rid=228884',
							tiptitle: '梦想成为书评区大水怪的可以来康康'
						}
					};
				}

                function v04_To_v05() {
                    if (config.history) {return;};
                    config.history = {};
                }
			}
		}

		CM.AutoRecommend.upgradeConfig();
		CM.commentDrafts.upgradeConfig();
		CM.bookcasePrefs.upgradeConfig();
		CM.userDtlePrefs.upgradeConfig();
		CM.BkReviewPrefs.upgradeConfig();
	}

    // Book page add-on
    function pageBook() {
		// Resource
		const pageResource = {
			elements: {},
			info: {}
		}
		collectPageResources();
		DoLog(LogLevel.Info, pageResource, true)

		// Provide meta info copy
		metaCopy();

		// Provide txtfull download for copyright book
		enableDownload();

		// Provide tag search
		tagOption();

        // Ctrl+Enter comment submit
        areaReply();

		// Get page resources
		function collectPageResources() {
			collectElements();
			collectInfos();

			function collectElements() {
				const elements = pageResource.elements;
				elements.content = document.querySelector('#content');
				elements.bookMain = elements.content.querySelector('div');
				elements.header = elements.content.querySelector('div>table');
				elements.bookName = elements.header.querySelector('b');
				elements.metaContainer = elements.header.querySelector('tr+tr');
				elements.metas = elements.metaContainer.querySelectorAll('td');
				elements.info = elements.bookMain.querySelector('div+table');
				elements.infoText = elements.info.querySelector('td+td');
				elements.notice = elements.infoText.querySelectorAll('span.hottext>b');
				elements.tags = elements.notice.length > 1 ? elements.notice[0] : null;
				elements.notice = elements.notice[elements.notice.length-1];
				elements.introduce = elements.infoText.querySelectorAll('span');
				elements.introduce = elements.introduce[elements.introduce.length-1];
			}

			function collectInfos() {
				const info = pageResource.info;
				const elements = pageResource.elements;
				info.bookName = elements.bookName.innerText;
				info.BID = Number(location.href.match(/book\/(\d+).htm/)[1]);
				info.metas = []; elements.metas.forEach(function(meta){this.push(getKeyValue(meta.innerText));}, info.metas);
				info.notice = elements.notice.innerText;
				info.tags = elements.tags ? getKeyValue(elements.tags.innerText).VALUE.split(' ') : null;
				info.introduce = elements.introduce.innerText;
				info.dlEnabled = elements.content.querySelector('legend>b');
				info.dlEnabled = info.dlEnabled ? info.dlEnabled.innerText : false;
				info.dlEnabled = info.dlEnabled ? (info.dlEnabled.indexOf('TXT') !== -1 && info.dlEnabled.indexOf('UMD') !== -1 && info.dlEnabled.indexOf('JAR') !== -1) : false;
			}
		}

		// Copy meta info
		function metaCopy() {
			let tip = TEXT_TIP_COPY;
			for (let i = -1; i < pageResource.elements.metas.length; i++) {
				const meta = i !== -1 ? pageResource.elements.metas[i] : pageResource.elements.bookName;
				const info = i !== -1 ? pageResource.info.metas[i] : pageResource.info.bookName;
				const value = i !== -1 ? info.VALUE : info;
				meta.innerHTML += HTML_BOOK_COPY;
				const copyBtn = meta.querySelector('.'+CLASSNAME_BUTTON);
				copyBtn.addEventListener('click', function() {
					copyText(value);
					showTip(TEXT_TIP_COPIED);
					const alertBox = new ElegantAlertBox(TEXT_ALT_META_COPIED.replaceAll('{M}', value));
					alertBox.elm.onclick = function() {
						// Prevent copying box content
						alertBox.close.call(alertBox);
					}
				});

				if (tipready) {
					copyBtn.addEventListener('mouseover', function() {showTip(TEXT_TIP_COPY);});
					copyBtn.addEventListener('mouseout' , tiphide);
				} else {
					copyBtn.title = TEXT_TIP_COPY;
				}
			}

			function showTip(text) {
				tip = text;
				tipshow(tip);
			}
		}

		// Download copyright book
		function enableDownload() {
			if (pageResource.info.dlEnabled) {return false;};

			let div = document.createElement('div');
			pageResource.elements.bookMain.appendChild(div);
			div.outerHTML = HTML_DOWNLOAD_LINKS
				.replaceAll('{ORIBOOKNAME}', pageResource.info.bookName)
				.replaceAll('{BOOKID}', String(pageResource.info.BID))
				.replaceAll('{BOOKNAME}', encodeURIComponent(pageResource.info.bookName));
			div = document.querySelector('#txtfull');
			pageResource.elements.txtfull = div;

			pageResource.elements.notice.innerHTML = HTML_DOWNLOAD_BOARD
				.replaceAll('{ORIBOOKNAME}', pageResource.info.bookName);
		}

		// Tag Search
		function tagOption() {
			const tagsEle = pageResource.elements.tags;
			const tags = pageResource.info.tags;
			if (!tags) {return false;}

			let html = getKeyValue(tagsEle.innerText).KEY + '：';
			for (const tag of tags) {
				html += HTML_BOOK_TAG.replace('{TU}', $URL.encode(tag)).replace('{TN}', tag) + ' ';
			}
			tagsEle.innerHTML = html;
		}
    }

	// Reply area add-on
	function areaReply() {
		/* ## Common style for areaReply ## */
		addStyle(CSS_AREAREPLY);

		/* ## Release title area ## */
        if (document.querySelector('td > input[name="Submit"]') && !document.querySelector('#ptitle')) {
            const table = document.querySelector('form>table');
            const titleText = table.innerHTML.match(/<!--[\s\S]+id="ptitle"[\s\S]+-->/)[0];
            const titleHTML = titleText.replace(/^<!--\s*/, '').replace(/\s*-->$/, '');
			const titleEle = document.createElement('tr');
			const caption = table.querySelector('caption');
			table.insertBefore(titleEle, caption);
			titleEle.outerHTML = titleHTML;
        }

        const commentArea = document.querySelector('#pcontent'); if (!commentArea) {return false;};
        const commentForm = document.querySelector('form[action^="https://www.wenku8.net/modules/article/review"]');
        const commentSbmt = document.querySelector('td > input[name="Submit"]');
        const commenttitl = document.querySelector('#ptitle');
		const commentbttm = commentSbmt.parentElement;

        /* ## Ctrl+Enter comment submit ## */
		let btnSbmtValue = commentSbmt.value;
        if (commentSbmt) {
            commentSbmt.value = '发表书评(Ctrl+Enter)';
            commentSbmt.style.padding = '0.3em 0.4em 0.3em 0.4em';
            commentSbmt.style.height= 'auto';
            commentArea.addEventListener('keydown', hotkeyReply);
            commenttitl.addEventListener('keydown', hotkeyReply);
        }

		/* ## Enable https protocol for inserted url ## */
		fixHTTPS();

		/* ## At user ## */
		atUser();

		/* ## Comment auto-save ## */
		// GUI
		const asTip = document.createElement('span');
		commentbttm.appendChild(asTip);

		// Review-Page: Same rid, same savekey - 'rid123456'
		// Book-Page & Book-Review-List-Page: Same bookid, same savekey - 'bid1234'
		let commentData = {
			rid : getUrlArgv({name: 'rid', dealFunc: Number}),
			aid : getUrlArgv({name: 'aid', dealFunc: Number}),
			bid : location.href.match(/\/book\/(\d+).htm/) ? Number(location.href.match(/\/book\/(\d+).htm/)[1]) : 0,
			page : getUrlArgv({name: 'rid', dealFunc: Number, defaultValue: 1})
		}
		commentData.key = commentData.rid ? 'rid' + String(commentData.rid) : 'bid' + String(commentData.bid);
		restoreDraft();
		submitHook();

		const events = ['focus', 'blur', 'mousedown', 'keydown', 'keyup', 'change'];
		const eventEles = [commentArea, commenttitl];
		for (const eventEle of eventEles) {
			for (const event of events) {
				eventEle.addEventListener(event, saveDraft);
			}
		}

		function saveDraft() {
			const content = commentArea.value;
			const title = commenttitl.value;

			if (!content && !title) {
				clearDraft();
				return;
			} else if (commentData.content === content && commentData.title === title) {
				return;
			}

			commentData.content = content;
			commentData.title = title;

			const allCData = CONFIG.commentDrafts.getConfig();

			allCData[commentData.key] = commentData;
			CONFIG.commentDrafts.saveConfig(allCData);
			asTip.innerHTML = TEXT_GUI_AUTOSAVE;
		}

		function restoreDraft() {
			const allCData = CONFIG.commentDrafts.getConfig();
			if (!allCData[commentData.key]) {return false;};
			if (!commenttitl.value && !commentArea.value) {
				commentData = allCData[commentData.key];
				commenttitl.value = commentData.title;
				commentArea.value = commentData.content;
				asTip.innerHTML = TEXT_GUI_AUTOSAVE_RESTORE;
			}
			return true;
		}

		function clearDraft() {
			const allCData = CONFIG.commentDrafts.getConfig();
			if (!allCData[commentData.key]) {return false;};
			delete allCData[commentData.key];
			CONFIG.commentDrafts.saveConfig(allCData);
			asTip.innerHTML = TEXT_GUI_AUTOSAVE_CLEAR;
			return true;
		}

        function hotkeyReply() {
            let keycode = event.keyCode;
            if (keycode === 13 && event.ctrlKey && !event.altKey) {
				// Do not submit directly like this; we need to submit with onsubmit executed
                //commentForm.submit();
				commentSbmt.click();
            }
        }

		function fixHTTPS() {
			if (typeof(UBBEditor) === 'undefined') {
				DoLog(LogLevel.Info, 'fixHTTPS: UBBEditor not loaded, waiting...');
				setTimeout(fixHTTPS, NUMBER_ELEMENT_LOADING_WAIT_INTERVAL);
				return false;
			}
			const eid = 'pcontent';

			const menuItemInsertUrl = commentForm.querySelector('#menuItemInsertUrl');
			const menuItemInsertImage = commentForm.querySelector('#menuItemInsertImage');

			// Wait until menuItemInsertUrl and menuItemInsertImage is loaded
			if (!menuItemInsertUrl || !menuItemInsertImage) {
				DoLog(LogLevel.Info, 'fixHTTPS: element not loaded, waiting...');
				setTimeout(fixHTTPS, NUMBER_ELEMENT_LOADING_WAIT_INTERVAL);
				return false;
			}

			// Wait until original onclick function is set
			if (!menuItemInsertUrl.onclick || !menuItemInsertImage.onclick) {
				DoLog(LogLevel.Info, 'fixHTTPS: defult onclick not loaded, waiting...');
				setTimeout(fixHTTPS, NUMBER_ELEMENT_LOADING_WAIT_INTERVAL);
				return false;
			}

			menuItemInsertUrl.onclick = function () {
				var url = prompt("请输入超链接地址", "http://");
				if (url != null && url.indexOf("http://") < 0 && url.indexOf("https://") < 0) {
					alert("请输入完整的超链接地址！");
					return;
				}
				if (url != null) {
					if ((document.selection && document.selection.type == "Text") ||
						(window.getSelection &&
						 document.getElementById(eid).selectionStart > -1 && document.getElementById(eid).selectionEnd >
						 document.getElementById(eid).selectionStart)) {UBBEditor.InsertTag(eid, "url", url,'');}
					else {UBBEditor.InsertTag(eid, "url", url, url);}
				}
			};

			menuItemInsertImage.onclick = function () {
				var imgurl = prompt("请输入图片路径", "http://");
				if (imgurl != null && imgurl.indexOf("http://") < 0 && imgurl.indexOf("https://") < 0) {
					alert("请输入完整的图片路径！");
					return;
				}
				if (imgurl != null) {
					UBBEditor.InsertTag(eid, "img", "", imgurl);
				}
			};

			return true;
		}

		function submitHook() {
			const onsubmit = commentForm.onsubmit;
			commentForm.onsubmit = onsubmitForm;

			function onsubmitForm(e) {
				// Cancel submit while content empty
				if (commentArea.value === '' && commenttitl.value === '') {return false;};

				// Clear Draft
				clearDraft();

				// Restore original submit button value
				if (commentSbmt.value !== btnSbmtValue) {
					commentSbmt.value = btnSbmtValue;
					setTimeout(()=>{commentSbmt.click.call(commentSbmt);}, 0);
					return false;
				}

				// Continue submit
				return onsubmit ? onsubmit() : function() {return true;};
			}
		}

		function atUser() {
			if (typeof(UBBEditor) === 'undefined') {
				DoLog(LogLevel.Info, 'atUser: UBBEditor not loaded, waiting...');
				setTimeout(atUser, NUMBER_ELEMENT_LOADING_WAIT_INTERVAL);
				return false;
			}

			const menu = document.querySelector('#UBB_Menu');
			const firstBtn = menu.children[0];
			const atBtn = firstBtn.cloneNode(true);
			atBtn.style.backgroundImage = 'none';
			atBtn.value = '@';
			atBtn.title = TEXT_GUI_AREAREPLY_AT;
			atBtn.id = 'plus_At';
			atBtn.classList.add(CLASSNAME_BUTTON);
			atBtn.addEventListener('click', showList);
			menu.insertBefore(atBtn, firstBtn);

			const div = document.createElement('div');
			const ul = document.createElement('ul');
			div.classList.add(CLASSNAME_AREAREPLY_AT);
			div.appendChild(ul);
			div.style.display = 'none';
			div.id = 'plus_AtTable';
			div.style.position = 'absolute';
			div.style.zIndex = '999';
			div.style.backgroundColor = '#f5f5f5';
			div.style.float = 'left';
			div.style.clear = 'both';
			document.addEventListener('click', hideList);
			menu.parentElement.insertBefore(div, document.querySelector('#FontSizeTable'));

			function toggleDisplay() {
				div.style.display === 'none' ? showList() : hideList();
			}

			function hideList() {
				div.style.display = 'none';
			}

			function showList(e) {
				if(typeof(ubb_subdiv) !== 'undefined'){
					hideeve(ubb_subdiv);
				}
				ubb_subdiv = 'plus_AtTable';
				if (e) {
					e.preventDefault();
					e.stopPropagation();
				}
				div.style.display = '';
				refreshList();
				ul.focus();
			}

			function refreshList() {
				const pageUsers = document.querySelectorAll('#content table strong>a[href^="https://www.wenku8.net/userpage.php"]');
				const friends = getMyUserDetail().userFriends;
				if (!friends) {
					refreshMyUserDetail(refreshList);
					return false;
				}

				// concat to one array
				const allUsers = [];
				for (const pageUser of pageUsers) {
					// Valid check
					if (isNaN(Number(pageUser.href.match(/\?uid=(\d+)/)[1]))) {continue;};
					const user = {
						userName: pageUser.innerText,
						userID: Number(pageUser.href.match(/\?uid=(\d+)/)[1]),
						referred: 0
					}
					if (!userExist(allUsers, user)) {
						const userAsFriend = userExist(friends, user);
						allUsers.push(userAsFriend ? userAsFriend : user);
					}
				}
				for (const friend of friends) {
					if (!userExist(allUsers, friend)) {
						allUsers.push(friend);
					}
				}

				// Sort by referred
				allUsers.sort((a,b)=>{return (b.referred?b.referred:0) - (a.referred?a.referred:0);});

				// Make <li>
				let maxNameLength = 0;
				clearChildnodes(ul);
				for (const user of allUsers) {
					makeList(user);
				}

				// Style
				ul.style.width = String(maxNameLength+1) + 'em';
				div.style.left = String(UBBEditor.GetPosition(atBtn).x) + 'px';
				div.style.top = String(UBBEditor.GetPosition(atBtn).y + 20) + 'px';

				return true;

				// returns the exist user object found in users, or false if not found
				function userExist(users, user) {
					for (const u of users) {
						if (u.userID === user.userID) {return u;};
					}
					return false;
				}

				function makeList(user) {
					// the same style as FontSizeTable
					const li = document.createElement('li');
					const btn = document.createElement('input');
					btn.type = 'button';
					btn.value = user.userName;
					btn.user = user;
					btn.style.border = '0px';
					btn.style.width = '100%';
					btn.style.height = '100%';
					btn.style.cursor = 'pointer';
					btn.addEventListener('click', btnClick);
					btn.addEventListener('mouseover', showuid);
					btn.addEventListener('mouseout', (tipready ? tiphide : function() {}));
					li.style.display = 'block';
					li.style.listStyle = 'none outside none';
					li.style.margin = '0px';
					li.style.width = '100%';
					li.style.border = 'solid 1px #cccccc';
					li.appendChild(btn);
					ul.appendChild(li);
					maxNameLength = Math.max(maxNameLength, user.userName.length);
					return li;

					function showuid() {
						tipready ? tipshow('uid: ' + String(user.userID)) : btn.title = 'uid: ' + String(user.userID);
					}
				}

				function btnClick() {
					const btn = this;
					const user = btn.user;
					const name = btn.user.userName;
					const insertPosition = commentArea.selectionEnd;
					const text = commentArea.value;
					const leftText = text.substr(0, insertPosition);
					const rightText = text.substr(insertPosition);
					let insertValue = '@' + name;

					// if not at the beginning of a line then insert a whitespace before the link
					insertValue = ((leftText.length === 0 || /[\r\n]$/.test(leftText)) ? '' : ' ') + insertValue;
					// if not at the end of a line then insert a whitespace after the link
					insertValue += (rightText.length === 0 || /^[\r\n]/.test(rightText)) ? '' : ' ';

					commentArea.value = leftText + insertValue + rightText;
					const position = insertPosition + insertValue.length;
					commentForm.scrollIntoView(); commentArea.focus(); commentArea.setSelectionRange(position, position);

					// referred increase
					const userDetail = getMyUserDetail();
					const friends = userDetail.userFriends;
					user.referred = user.referred ? user.referred+1 : 1;
					for (let i = 0; i < friends.length; i++) {
						if (friends[i].userID === user.userID) {
							friends[i] = user;
							break;
						}
					}
					CONFIG.userDtlePrefs.saveConfig(userDetail);
				}
			}
		}
	}

	// Review link add-on
	function linkReview() {
		// Get all review links and apply add-on functions
		const allRLinks = document.querySelectorAll('td>a[href^="https://www.wenku8.net/modules/article/reviewshow.php?"]');
		for (const RLink of allRLinks) {
			lastPage(RLink);
		}

		// Provide button direct to review last page
		function lastPage(a) {
			const p = a.parentElement;
			const btn = document.createElement('span');
			const rid = Number(a.href.match(/\?[.+&]?rid=(\d+)/)[1]);
			if (isNaN(rid)) {return false;} else {btn.rid = rid;};
			btn.addEventListener('click', gotoLastPage);
			btn.classList.add(CLASSNAME_BUTTON);
			btn.innerText = TEXT_GUI_LINK_TOLASTPAGE;
			btn.url = null;
			p.insertBefore(btn, a);

			function gotoLastPage() {
				const btn = this;
				const rid = btn.rid;

				if (btn.url) {
					window.open(btn.url);
				} else {
					const box = new ElegantAlertBox(TEXT_ALT_LASTPAGE_LOADING);
					getLatestReviewPageUrl(rid, (url)=>{
						if (box.exist) {box.close.call(box);};
						btn.url = url;
						window.open(btn.url);
					});
				}
			}
		}
	}

    // Reviewedit page add-on
    function pageReviewedit() {
        redirectToCorrectPage();

        function redirectToCorrectPage() {
            // Get redirect target rid
            const refreshMeta = document.querySelector('meta[http-equiv="refresh"]');
            const metaurl = refreshMeta.content.match(/url=(.+)/)[1];
            if (!refreshMeta) {return false;};
            if (getUrlArgv({url: metaurl, name: 'page'})) {return false;};

            // Read correct redirect location
            const rid = Number(getUrlArgv({url: metaurl, name: 'rid'}));
            const config = CONFIG.BkReviewPrefs.getConfig();
            const history = config.history;
            const pageHist = history[rid];
            if (!pageHist) {return false;}
            const url = pageHist.href;

			// Check if time expired (Expire time: 30 seconds)
			if ((new Date()).getTime() - pageHist.time > 30*1000) {
				// Delete expired record
				delete history[rid];
				CONFIG.BkReviewPrefs.saveConfig(config);
			}

            // Redirect
            setTimeout(() => {location.href = url;}, 1500);
        }
    }

    // Review page add-on
    function pageReview() {
		// Page Info
		const main = document.querySelector('#content');
        const rid = Number(getUrlArgv('rid'));
		const aid = getUrlArgv('aid') ? Number(getUrlArgv('aid')) : Number(main.querySelector('td[width]>a').href.match(/(\d+)\.html?$/)[1]);
		const page = getUrlArgv('page') ? Number(getUrlArgv('page')) : Number(document.querySelector('#pagelink strong').innerText);
		const title = main.querySelector('th>strong').textContent;

        // Record the current page status of current review
		setInterval(recordPage, 1000)

		// Recover page status
		applyPageStatus();

        // GUI
        const pageCountText = document.querySelector('#pagelink>.last').href.match(/page=(\d+)/)[1];

        const headBars = main.querySelectorAll('tr>td[align]');
		const lefta = headBars[0].querySelector('a');
		const lefttext = document.createTextNode('书评回复');
		clearChildnodes(headBars[0]);
		headBars[0].appendChild(lefta);
		headBars[0].appendChild(lefttext);
        headBars[0].width = '45%';
        headBars[1].width = '55%';

        const saveBtn = document.createElement('span');
        saveBtn.innerText = TEXT_GUI_DOWNLOAD_REVIEW.replaceAll('A', pageCountText);
        saveBtn.classList.add(CLASSNAME_BUTTON);
        saveBtn.addEventListener('click', downloadWholePost);
        headBars[1].appendChild(saveBtn);

		const spliter = document.createElement('span');
		const bbcdTxt = document.createElement('span');
		const bbcdChk = document.createElement('input');
		spliter.style.marginLeft = '1em';
		bbcdTxt.innerText = TEXT_GUI_DOWNLOAD_BBCODE;
		bbcdChk.type = 'checkbox';
		bbcdChk.checked = CONFIG.BkReviewPrefs.getConfig().bbcode;
		bbcdTxt.addEventListener('click', bbcodeOnclick);
		bbcdChk.addEventListener('click', bbcodeOnclick);
		bbcdTxt.addEventListener('mouseover', () => {tipshow(TEXT_TIP_DOWNLOAD_BBCODE);});
		bbcdChk.addEventListener('mouseover', () => {tipshow(TEXT_TIP_DOWNLOAD_BBCODE);});
		bbcdTxt.addEventListener('mouseout', tiphide);
		bbcdChk.addEventListener('mouseout', tiphide);
		bbcdTxt.classList.add(CLASSNAME_BUTTON);
		headBars[1].appendChild(spliter);
		headBars[1].appendChild(bbcdTxt);
		headBars[1].appendChild(bbcdChk);

		addQuoteBtns();
		addQueryBtns();
		alinktofloor();
        alinkEdit();
		autoRefresh();
		addFavorite();

		// Apply page status sored in history record
		function applyPageStatus() {
			const config = CONFIG.BkReviewPrefs.getConfig();
            const history = config.history;
            const pageHist = history[rid];

			// Scroll to the last position
			if (pageHist) {
				// Check if time expired
				if (pageHist.time && (new Date()).getTime() - pageHist.time < 30*1000) {
					// Scroll
					window.scrollTo(pageHist.scrollX, pageHist.scrollY);
				} else {
					// Delete expired record
					delete history[rid];
					CONFIG.BkReviewPrefs.saveConfig(config);
				}
			}
		}

        function recordPage() {
            const config = CONFIG.BkReviewPrefs.getConfig();
            const history = config.history;

            // Save page history
			history[rid] = {
				rid: rid,
				aid: aid,
				page: page,
				href: URL_REVIEWSHOW.replace('{R}', String(rid)).replace('{A}', String(aid)).replace('{P}', String(page)),
				scrollX: window.pageXOffset,
				scrollY: window.pageYOffset,
				time: (new Date()).getTime()
			}
            CONFIG.BkReviewPrefs.saveConfig(config);
        }

		function alinktofloor() {
			const floorLinks = main.querySelectorAll('a[name][href^="#yid"]');
			for (const a of main.querySelectorAll('a')) {
				if (!a.href.match(/^https?:\/\/www\.wenku8\.net\/modules\/article\/reviewshow\.php\?(&?rid=\d+|&?aid=\d+|&?page=\d+){1,4}#yid\d+$/)) {continue;};
				for (const flink of floorLinks) {
					if (isSameReply(a, flink)) {
						// Set scroll target
						a.targetNode = flink;
						while (a.targetNode.nodeName !== 'TABLE') {
							a.targetNode = a.targetNode.parentElement;
						}

						// Scroll when clicked
						a.addEventListener('click', (e) => {
							e.preventDefault();
							e.stopPropagation();
							e.currentTarget.targetNode.scrollIntoView();
						})
					};
				}
			}

            function isSameReply(link1, link2) {
                const url1 = link1.href.toLowerCase().replace('http://', 'https://');
                const url2 = link2.href.toLowerCase().replace('http://', 'https://');
                const rid1 = getUrlArgv({url: url1, name: 'rid', defaultValue: null});
                const yid1 = url1.match(/#yid(\d+)/) ? url1.match(/#yid(\d+)/)[1] : null;
                const rid2 = getUrlArgv({url: url2, name: 'rid', defaultValue: null});
                const yid2 = url2.match(/#yid(\d+)/) ? url2.match(/#yid(\d+)/)[1] : null;
                return rid1 === rid2 && yid1 === yid2;
            }
		}

        function alinkEdit() {
            const eLinks = document.querySelectorAll('a[href^="https://www.wenku8.net/modules/article/reviewedit.php?yid="]');
            for (const eLink of eLinks) {
                eLink.addEventListener('click', (e) => {
                    // NO e.stopPropagation() here. Just hooks the open action.
                    e.preventDefault();

                    // Use wenku8's openDialog
                    openDialog(e.target.href + '&ajax_gets=jieqi_contents', false);

                    // Show mask if mask not shown
                    !document.getElementById("mask") && showMask();
                })
            }
        }

		function autoRefresh() {
			let working=false, interval=0;
			const floorNumber = getTopFloorNumber(document);
			const pagelink    = document.querySelector('#pagelink');
			const tdLink      = pagelink.parentElement;
			const trContainer = tdLink.parentElement;
			const tdAutoRefresh  = document.createElement('td');
			const chkAutoRefresh = document.createElement('input');
			const txtAutoRefresh = document.createElement('span');
			const txtPaused = document.createElement('span');
			const ptitle    = document.querySelector('#ptitle');
			const pcontent  = document.querySelector('#pcontent');
			txtAutoRefresh.innerText  = TEXT_GUI_AUTOREFRESH;
			txtAutoRefresh.classList.add(CLASSNAME_BUTTON);
			txtAutoRefresh.addEventListener('click', toggleRefresh);
			chkAutoRefresh.addEventListener('click', toggleRefresh);
			chkAutoRefresh.type        = 'checkbox';
			chkAutoRefresh.checked     = false;
			txtPaused.innerText        = '';
			txtPaused.classList.add(CLASSNAME_TEXT);
			txtPaused.style.marginLeft = '0.5em';
			tdAutoRefresh.style.align  = 'left';
			tdAutoRefresh.appendChild(txtAutoRefresh);
			tdAutoRefresh.appendChild(chkAutoRefresh);
			tdAutoRefresh.appendChild(txtPaused);
			trContainer.insertBefore(tdAutoRefresh, tdLink);

			// Apply config
			CONFIG.BkReviewPrefs.getConfig().autoRefresh ? toggleRefresh() : function() {};

            // Show pause
            // Note: Blur event triggers after Focus event was triggered
			for (const editElm of [ptitle, pcontent]) {
                if (!editElm) {continue;};
				editElm.addEventListener('blur', (e) => {
					txtPaused.innerText = '';
				});
				editElm.addEventListener('focus', (e) => {
					txtPaused.innerText = TEXT_GUI_AUTOREFRESH_PAUSED;
				});
			}

			function toggleRefresh(e) {
				// stop event
				if (e) {
					e.preventDefault();
					e.stopPropagation();
				}

				// Not in last Page, no auto refresh
				if (!isCurLastPage() && !working) {
					const box = new ElegantAlertBox(TEXT_ALT_AUTOREFRESH_NOTLAST);
					box.elm.onclick = () => {location.href = document.querySelector('#pagelink>a.last').href;};
					return false;
				}

				// toggle
				working = !working;
				working ? interval = setInterval(refresh, 30*1000) : clearInterval(interval);

				// Save to config
				const review = CONFIG.BkReviewPrefs.getConfig();
				review.autoRefresh = working;
				CONFIG.BkReviewPrefs.saveConfig(review);

				setTimeout(() => {chkAutoRefresh.checked = working;}, 0);
				new ElegantAlertBox(working ? TEXT_ALT_AUTOREFRESH_ON : TEXT_ALT_AUTOREFRESH_OFF);
			}

			function refresh() {
				const box = new ElegantAlertBox(TEXT_ALT_AUTOREFRESH_WORKING);
				getDocument(location.href, (oDoc)=>{
					const eleCurPage = oDoc.querySelector('#pagelink strong');
					const eleLastPage = oDoc.querySelector('#pagelink a.last');
					const urlLastPage = eleLastPage.href;
					if (eleCurPage.innerText !== eleLastPage.innerText) {
						getDocument(urlLastPage, refreshLoaded);
					} else {
						refreshLoaded(oDoc);
					}
				})


				function refreshLoaded(oDoc) {
					const top = getTopFloorNumber(oDoc);
					box.exist ? box.close.apply(box) : function() {};
					if (top > floorNumber) {
						const eleLastPage = oDoc.querySelector('#pagelink a.last');
						const urlLastPage = eleLastPage.href;
						recordPage();

						if (['ptitle', 'pcontent'].includes(document.activeElement.id)) {
							// Do not refresh when editing
							const box = new ElegantAlertBox(TEXT_ALT_AUTOREFRESH_PAUSED);
							box.elm.onclick = () => {
								box.close.call(box);
								location.href = urlLastPage;
							}
						} else {
							// Refresh after 3s
							let box = new ElegantAlertBox(TEXT_ALT_AUTOREFRESH_FOUND);
							box.elm.onclick = () => {
								box.close.call(box);
								box = null;
							}
							setTimeout(()=>{
								box ? location.href=urlLastPage : function() {};
							}, 3000);
						}
						return true;
					} else {
						new ElegantAlertBox(TEXT_ALT_AUTOREFRESH_NOMORE);
						return false;
					}
				}
			}

			function getTopFloorNumber(oDoc) {
				let lastFloor;
				for (const floorTable of oDoc.querySelectorAll('#content>table')) {
					lastFloor = floorTable.querySelector('a[name^="yid"]') ? floorTable : lastFloor;
				}
				return Number(lastFloor.querySelector('a[name^="yid"]').innerText.match(/\d+/)[0]);
			}

			function isCurLastPage() {
				return document.querySelector('#pagelink>strong').innerText === document.querySelector('#pagelink>a.last').innerText;
			}
		}

		function addFavorite() {
			// Create GUI
			const spliter = document.createElement('span');
			const favorBtn = document.createElement('span');
			const favorChk = document.createElement('input');
			spliter.style.marginLeft = '1em';
			favorBtn.innerText = TEXT_GUI_REVIEW_ADDFAVORITE;
			favorBtn.classList.add(CLASSNAME_BUTTON);
			favorChk.type = 'checkbox';
			favorChk.checked = CONFIG.BkReviewPrefs.getConfig().favorites.hasOwnProperty(rid);
			favorBtn.addEventListener('click', checkChange);
			favorChk.addEventListener('change', checkChange);

			headBars[0].appendChild(spliter);
			headBars[0].appendChild(favorBtn);
			headBars[0].appendChild(favorChk);

			function checkChange(e) {
				if (e && e.target === favorChk) {
					e.preventDefault();
					e.stopPropagation();
				}

				let inFavorites;
				const config = CONFIG.BkReviewPrefs.getConfig();
				if (config.favorites.hasOwnProperty(rid)) {
					delete config.favorites[rid];
					inFavorites = false;
				} else {
					config.favorites[rid] = {
						rid: rid,
						name: title,
						href: URL_REVIEWSHOW.replace('{R}', rid).replace('{A}', aid).replace('{P}', '1')
					};
					inFavorites = true;
				}
				CONFIG.BkReviewPrefs.saveConfig(config);
				setTimeout(() => {favorChk.checked = inFavorites;}, 0);
				new ElegantAlertBox((inFavorites ? TEXT_GUI_REVIEW_FAVORADDED : TEXT_GUI_REVIEW_FAVORDELED).replace('{N}', title));
			}
		}

		function addQuoteBtns() {
			// Get content textarea
			const pcontent = document.querySelector('#pcontent');
			const form = document.querySelector('form[action^="https://www.wenku8.net/modules/article/review"]');

			// Get floor elements
			const avatars = main.querySelectorAll('table div img.avatar');
			for (const avatar of avatars) {
				// do not insert the button as the first childnode. page saving function uses the first childnode as the time element.
				const table = avatar.parentElement.parentElement.parentElement.parentElement.parentElement;
				const numberEle = table.querySelector('td.even div a');
				const attr = numberEle.parentElement;
				const btn = createQuoteBtn(attr);
				const spliter = document.createTextNode(' | ');
				attr.insertBefore(spliter, numberEle);
				attr.insertBefore(btn, spliter);
			}

			function createQuoteBtn() {
				const btn = document.createElement('span');
				btn.classList.add(CLASSNAME_BUTTON);
				btn.addEventListener('click', quoteThisFloor);
				btn.innerHTML = '引用';
				return btn;

				function quoteThisFloor() {
					// In DOM Events, <this> keyword points to the Event Element.
					const numberEle = this.parentElement.querySelector('a[name]');
					const numberText = numberEle.innerText;
					const url = numberEle.href;
					const contentEle = this.parentElement.parentElement.querySelector('hr+div');
					const content = getFloorContent(contentEle);
					const insertPosition = pcontent.selectionEnd;
					const text = pcontent.value;
					const leftText = text.substr(0, insertPosition);
					const rightText = text.substr(insertPosition);

					/* ## Create insert value ## */
					let insertValue = '[url=U]N[/url] [quote]Q[/quote]';
					insertValue = insertValue.replace('U', url).replace('N', numberText).replace('Q', content);
					// if not at the beginning of a line then insert a whitespace before the link
					insertValue = ((leftText.length === 0 || /[\r\n]$/.test(leftText)) ? '' : ' ') + insertValue;
					// if not at the end of a line then insert a whitespace after the link
					insertValue += (rightText.length === 0 || /^[\r\n]/.test(rightText)) ? '' : ' ';

					pcontent.value = leftText + insertValue + rightText;
					const position = insertPosition + (pcontent.value.length - text.length);
					form.scrollIntoView(); pcontent.focus(); pcontent.setSelectionRange(position, position);
				}
			}
		}

		function addQueryBtns() {
			// Get floor elements
			const avatars = main.querySelectorAll('table div img.avatar');
			for (const avatar of avatars) {
				// Get container div
				const div = avatar.parentElement;

				// Create buttons
				const qBtn = document.createElement('a'); // Button for query reviews
				const iBtn = document.createElement('a'); // Button for query userinfo

				// Get UID
				const user = div.querySelector('a');
				const UID = Number(user.href.match(/uid=(\d+)/)[1]);

				// Create text spliter
				const spliter = document.createTextNode(' | ');

				// Config buttons
				qBtn.href = URL_REVIEWSEARCH.replaceAll('{K}', String(UID));
				iBtn.href = URL_USERINFO    .replaceAll('{K}', String(UID));
				qBtn.target = '_blank';
				iBtn.target = '_blank';
				qBtn.innerText = TEXT_GUI_USER_REVIEWSEARCH;
				iBtn.innerText = TEXT_GUI_USER_USERINFO;

				// Append to GUI
				div.appendChild(document.createElement('br'));
				div.appendChild(iBtn);
				div.appendChild(qBtn);
				div.insertBefore(spliter, qBtn);
			}
		}

		function bbcodeOnclick(e) {
			e.preventDefault();
			e.stopPropagation();

			if (downloadWholePost.working) {
				new ElegantAlertBox(TEXT_ALT_DOWNLOAD_BBCODE_NOCHANGE);
				return false;
			}
			const cmConfig = CONFIG.BkReviewPrefs.getConfig();
			cmConfig.bbcode = !cmConfig.bbcode;
			setTimeout(() => {bbcdChk.checked = cmConfig.bbcode;}, 0);
			CONFIG.BkReviewPrefs.saveConfig(cmConfig);
		}

        // ## Function: Get data from page document or join it into the given data variable ##
        function getDataFromPage(document, data) {
            let i;
			DoLog(LogLevel.Info, document, true);

            // Get Floors; avatars uses for element locating
            const main = document.querySelector('#content');
            const avatars = main.querySelectorAll('table div img.avatar');

            // init data, floors and users if need
            let floors = {}, users = {};
            if (data) {
                floors = data.floors;
                users = data.users;
            } else {
                data = {};
                initData(data, floors, users);
            }
            for (i = 0; i < avatars.length; i++) {
                const floor = newFloor(floors, avatars, i);
                const elements = getFloorElements(floor);
                const reply = getFloorReply(floor);
                const user = getFloorUser(floor);
                appendFloor(floors, floor);
            }
            return data;

            function initData(data, floors, users) {
                // data vars
                data.floors = floors; floors.data = data;
                data.users = users; users.data = data;

                // review info
                data.link = location.href;
                data.id = getUrlArgv({name: 'rid', dealFunc: Number, defaultValue: 0});
                data.page = getUrlArgv({name: 'page', dealFunc: Number, defaultValue: 1});
                data.title = main.querySelector('th strong').innerText;
                return data;
            }

            function newFloor(floors, avatars, i) {
                const floor = {};
                floor.avatar = avatars[i];
                floor.floors = floors;
                return floor;
            }

            function getFloorElements(floor) {
                const elements = {}; floor.elements = elements;
                elements.avatar = floor.avatar;
                elements.table = elements.avatar.parentElement.parentElement.parentElement.parentElement.parentElement;
                elements.tr = elements.table.querySelector('tr');
                elements.tdUser = elements.table.querySelector('td.odd');
                elements.tdReply = elements.table.querySelector('td.even');
                elements.divUser = elements.tdUser.querySelector('div');
                elements.aUser = elements.divUser.querySelector('a');
                elements.attr = elements.tdReply.querySelector('div a').parentElement;
                elements.time = elements.attr.childNodes[0];
                elements.number = elements.attr.querySelector('a[name]');
                elements.title = elements.tdReply.querySelector('div>strong');
                elements.content = elements.tdReply.querySelector('hr+div');
                return elements;
            }

            function getFloorReply(floor) {
                const elements = floor.elements;
                const reply = {}; floor.reply = reply;
                reply.time = elements.time.nodeValue.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)[0];
                reply.number = Number(elements.number.innerText.match(/\d+/)[0]);
                reply.value = CONFIG.BkReviewPrefs.getConfig().bbcode ? getFloorContent(elements.content) : elements.content.innerText;
                reply.title = elements.title.innerText;
                return reply;
            }

            function getFloorUser(floor) {
                const elements = floor.elements;
                const user = {}; floor.user = user;
                user.id = elements.aUser.href.match(/uid=(\d+)/)[1];
                user.name = elements.aUser.innerText;
                user.avatar = elements.avatar.src;
                user.link = elements.aUser.href;
                user.jointime = elements.divUser.innerText.match(/\d{4}-\d{2}-\d{2}/)[0];

                const data = floor.floors.data; const users = data.users;
                if (!users.hasOwnProperty(user.id)) {
                    users[user.id] = user;
                    user.floors = [floor];
                } else {
                    const uFloors = users[user.id].floors;
                    uFloors.push(floor);
                    sortUserFloors(uFloors);
                }
                return user;
            }

            function sortUserFloors(uFloors) {
                uFloors.sort(function(F1, F2) {
                    return F1.reply.number > F2.reply.number;
                })
            }

            function appendFloor(floors, floor) {
                floors[floor.reply.number-1] = floor;
            }
        }

        // ## Function: Get pages and parse each pages to a data, returns data ##
        // callback(data, gotcount, finished) is called when xhr and parsing completed
        function getAllPages(callback) {
            let i, data, gotcount = 0;
            const ridMatcher = /rid=(\d+)/, pageMatcher = /page=(\d+)/;
            const lastpageUrl = document.querySelector('#pagelink>.last').href;
            const rid = Number(lastpageUrl.match(ridMatcher)[1]);
            const pageCount = Number(lastpageUrl.match(pageMatcher)[1]);
            const curPageNum = location.href.match(pageMatcher) ? Number(location.href.match(pageMatcher)[1]) : 1;

            for (i = 1; i <= pageCount; i++) {
                const url = lastpageUrl.replace(pageMatcher, 'page='+String(i));
                getDocument(url, joinPageData, callback);
            }

            function joinPageData(pageDocument, callback) {
                data = getDataFromPage(pageDocument, data);
                gotcount++;

                // log
				const level = gotcount % NUMBER_LOGSUCCESS_AFTER ? LogLevel.Info : LogLevel.Success;
                DoLog(level, 'got ' + String(gotcount) + ' pages.');
                if (gotcount === pageCount) {
                    DoLog(LogLevel.Success, 'All pages xhr and parsing completed.');
                    DoLog(LogLevel.Success, data, true);
                }

                // callback
                if (callback) {callback(data, gotcount, gotcount === pageCount);};
            }
        }

        // Function output
        function joinTXT(data, noSpliter=true) {
            const floors = data.floors; const users = data.users;

            // HEAD META DATA
            const saveTime = getTime();
            const head = TEXT_OUTPUT_REVIEW_HEAD
                .replaceAll('{RWID}', data.id).replaceAll('{RWTT}', data.title).replaceAll('{RWLK}', data.link)
                .replaceAll('{SVTM}', saveTime).replaceAll('{SCNM}', GM_info.script.name)
                .replaceAll('{VRSN}', GM_info.script.version).replaceAll('{ATNM}', GM_info.script.author);

            // join userinfos
            let userText = '';
            for (const [pname, user] of Object.entries(users)) {
                if (!isNumeric(pname)) {continue;};
                userText += TEXT_OUTPUT_REVIEW_USER
                    .replaceAll('{LNSPLT}', noSpliter ? '' : TEXT_SPLIT_LINE).replaceAll('{USERNM}', user.name)
                    .replaceAll('{USERID}', user.id).replaceAll('{USERJT}', user.jointime)
                    .replaceAll('{USERLK}', user.link).replaceAll('{USERFL}', user.floors[0].reply.number);
                userText += '\n'.repeat(2);
            }

            // join floors
            let floorText = '';
            for (const [pname, floor] of Object.entries(floors)) {
                if (!isNumeric(pname)) {continue;};
                const avatar = floor.avatar; const elements = floor.elements; const user = floor.user; const reply = floor.reply;
                floorText += TEXT_OUTPUT_REVIEW_FLOOR
                    .replaceAll('{LNSPLT}', noSpliter ? '' : TEXT_SPLIT_LINE).replaceAll('{RPNUMB}', String(reply.number))
                    .replaceAll('{RPTIME}', reply.time).replaceAll('{USERNM}', user.name)
                    .replaceAll('{USERID}', user.id).replaceAll('{RPTEXT}', reply.value);
                floorText += '\n'.repeat(2);
            }

            // End
            const foot = TEXT_OUTPUT_REVIEW_END;

            // return
            const txt = head + '\n'.repeat(2) + userText + '\n'.repeat(2) + floorText + '\n'.repeat(2) + foot;
            return txt;
        }

        // ## Function: Download the whole post ##
        function downloadWholePost() {
            // Continues only if not working
			if (downloadWholePost.working) {return;};
			downloadWholePost.working = true;
			bbcdTxt.classList.add(CLASSNAME_DISABLED);

            // GUI
            saveBtn.innerText = TEXT_GUI_DOWNLOADING_REVIEW
                .replaceAll('C', '0').replaceAll('A', pageCountText);

            // go work!
            getAllPages(function(data, gotCount, finished) {
                // GUI
                saveBtn.innerText = TEXT_GUI_DOWNLOADING_REVIEW
                    .replaceAll('C', String(gotCount)).replaceAll('A', pageCountText);

                // Stop here if not completed
                if (!finished) {return;};

                // Join text
                const TXT = joinTXT(data);

                // Download
                const blob = new Blob([TXT],{type:"text/plain;charset=utf-8"});
                const url = URL.createObjectURL(blob);
                const name = '文库贴 - ' + String(data.id) + '.txt';

                const a = document.createElement('a');
                a.href = url;
                a.download = name;
                a.click();

                // GUI
                saveBtn.innerText = TEXT_GUI_DOWNLOADFINISH_REVIEW;
				new ElegantAlertBox(TEXT_ALT_DOWNLOADFINISH_REVIEW.replaceAll('{T}', data.title).replaceAll('{I}', data.id).replaceAll('{N}', name));

                // Work finish
				downloadWholePost.working = false;
				bbcdTxt.classList.remove(CLASSNAME_DISABLED);
            })
        }

		// Get floor content by BBCode format
		function getFloorContent(contentEle) {
					const subNodes = contentEle.childNodes;
					let content = '';

					for (const node of subNodes) {
						const type = node.nodeName;
						switch (type) {
							case '#text':
								// Prevent 'Quote:' repeat
								content += node.data.replace(/^\s*Quote:\s*$/, ' ');
								break;
							case 'IMG':
								content += '[img]S[/img]'.replace('S', node.src);
								break;
							case 'A':
								content += '[url=U]T[/url]'.replace('U', node.href).replace('T', getFloorContent(node));
								break;
							case 'BR':
								// no need to add \n, because \n will be preserved in #text nodes
								//content += '\n';
								break;
							case 'DIV':
								if (node.classList.contains('jieqiQuote')) {
									content += getTagedSubcontent('quote', node);
								} else if (node.classList.contains('jieqiCode')) {
									content += getTagedSubcontent('code', node);
								} else if (node.classList.contains('divimage')) {
									content += getFloorContent(node);
								} else {
									content += getFloorContent(node);
								}
								break;
							case 'CODE': content += getFloorContent(node); break; // Just ignore
							case 'PRE':  content += getFloorContent(node); break; // Just ignore
							case 'SPAN': content += getFontedSubcontent(node); break; // Size and color
							case 'P':    content += getFontedSubcontent(node); break; // Text Align
							case 'B':    content += getTagedSubcontent('b', node); break;
							case 'I':    content += getTagedSubcontent('i', node); break;
							case 'U':    content += getTagedSubcontent('u', node); break;
							case 'DEL':  content += getTagedSubcontent('d', node); break;
							default:     content += getFloorContent(node); break;
							/*
							case 'SPAN':
								subContent = getFloorContent(node);
								size = node.style.fontSize.match(/\d+/) ? node.style.fontSize.match(/\d+/)[0] : '';
								color = node.style.color.match(/rgb\((\d+), ?(\d+), ?(\d+)\)/);
								break;
							*/
						}
					}
					return content;

					function getTagedSubcontent(tag, node) {
						const subContent = getFloorContent(node);
						return '[{T}]{S}[/{T}]'.replaceAll('{T}', tag).replaceAll('{S}', subContent);
					}

					function getFontedSubcontent(node) {
						let tag, value;

						let strSize = node.style.fontSize.match(/\d+/);
						let strColor = node.style.color;
						let strAlign = node.align;
						strSize = strSize ? strSize[0] : null;
						strColor = strColor ? rgbToHex.apply(null, strColor.match(/\d+/g)) : null;

						tag = tag || (strSize  ? 'size'  : null);
						tag = tag || (strColor ? 'color' : null);
						tag = tag || (strAlign ? 'align' : null);
						value = value || strSize || null;
						value = value || strColor || null;
						value = value || strAlign || null;

						const subContent = getFloorContent(node);
						if (tag && value) {
							return '[{T}={V}]{S}[/{T}]'.replaceAll('{T}', tag).replaceAll('{V}', value).replaceAll('{S}', subContent);
						} else {
							return subContent;
						}
					}
				}
    }

	// Bookcase page add-on
	function pageBookcase() {
		// Get auto-recommend config
		let arConfig = CONFIG.AutoRecommend.getConfig()
		// Get bookcase lists
		const bookCaseURL = 'https://www.wenku8.net/modules/article/bookcase.php?classid={CID}';
		const content = document.querySelector('#content');
		const selector = document.querySelector('[name="classlist"]');
		const options = selector.children;
		// Current bookcase
		const curForm = content.querySelector('#checkform');
		const curClassid = Number(document.querySelector('[name="clsssid"]').value);
		const bookcases = CONFIG.bookcasePrefs.getConfig(initPreferences).bookcases;
		addTopTitle();
		decorateForm(curForm, bookcases[curClassid]);

		// gowork
		showBookcases();
		recommendAllGUI();

		function recommendAllGUI() {
			const block = createLeftBlock(TEXT_GUI_BOOKCASE_ATRCMMD, true, {
				type: 'mypage',
				links: [
					{innerHTML: arConfig.allCount === 0 ? TEXT_GUI_BOOKCASE_RCMMDNW_NOTASK : (TASK.AutoRecommend.checkRcmmd() ? TEXT_GUI_BOOKCASE_RCMMDNW_DONE : TEXT_GUI_BOOKCASE_RCMMDNW_NOTYET), id: 'arstatus'},
					{innerHTML: TEXT_GUI_BOOKCASE_RCMMDAT, id: 'autorcmmd'},
					{innerHTML: TEXT_GUI_BOOKCASE_RCMMDNW, id: 'rcmmdnow'}
				]
			})

			// Configure buttons
			const ulitm = block.querySelector('.ulitem');
			const txtst = block.querySelector('#arstatus');
			const btnAR = block.querySelector('#autorcmmd');
			const btnRN = block.querySelector('#rcmmdnow');
			const txtAR = btnAR.querySelector('span');
			const checkbox = document.createElement('input');
			txtst.classList.add(CLASSNAME_TEXT);
			btnAR.classList.add(CLASSNAME_BUTTON);
			btnRN.classList.add(CLASSNAME_BUTTON);
			checkbox.type = 'checkbox';
			checkbox.checked = arConfig.auto;
			checkbox.addEventListener('click', onclick);
			btnAR.addEventListener('click', onclick);
			btnAR.appendChild(checkbox);
			btnRN.addEventListener('click', rcmmdnow);

			function onclick(e) {
				e.preventDefault();
				e.stopPropagation();
				arConfig.auto = !arConfig.auto;
				setTimeout(function() {checkbox.checked = arConfig.auto;}, 0);
				CONFIG.AutoRecommend.saveConfig(arConfig);
				new ElegantAlertBox(arConfig.auto ? TEXT_ALT_ATRCMMDS_AUTO : TEXT_ALT_ATRCMMDS_NOAUTO);
			}

			function rcmmdnow() {
				if (TASK.AutoRecommend.checkRcmmd() && !confirm(TEXT_GUI_BOOKCASE_RCMMDNW_CONFIRM)) {return false;}
				if (arConfig.allCount === 0) {new ElegantAlertBox(TEXT_ALT_ATRCMMDS_NOTASK); return false;};
				TASK.AutoRecommend.run(true);
			}
		}

		function initPreferences() {
			const lists = [];
			for (const option of options) {
				lists.push({
					classid: Number(option.value),
					url: bookCaseURL.replace('{CID}', String(option.value)),
					name: option.innerText
				})
			}
			return {bookcases: lists};
		}

		function addTopTitle() {
			// Clone title bar
			const checkform = document.querySelector('#checkform') ? document.querySelector('#checkform') : document.querySelector('.'+CLASSNAME_BOOKCASE_FORM);
			const oriTitle = checkform.querySelector('div.gridtop');
			const topTitle = oriTitle.cloneNode(true);
			content.insertBefore(topTitle, checkform);

			// Hide bookcase selector
			const bcSelector = topTitle.querySelector('[name="classlist"]');
			bcSelector.style.display = 'none';

			// Write title text
			const textNode = topTitle.childNodes[0];
			const numMatch = textNode.nodeValue.match(/\d+/g);
			const text = TEXT_GUI_BOOKCASE_TOPTITLE.replace('A', numMatch[0]).replace('B', numMatch[1]);
			textNode.nodeValue = text;
		}

		function showBookcases() {
			// GUI
			const topTitle = content.querySelector('script+div.gridtop');
			const textNode = topTitle.childNodes[0];
			const oriTitleText = textNode.nodeValue;
			const allCount = bookcases.length;
			let finished = 1;
			textNode.nodeValue = TEXT_GUI_BOOKCASE_GETTING.replace('C', String(finished)).replace('A', String(allCount));

			// Get all bookcase pages
			for (const bookcase of bookcases) {
				if (bookcase.classid === curClassid) {continue;};
				getDocument(bookcase.url, appendBookcase, [bookcase]);
			}

			function appendBookcase(mDOM, bookcase) {
				const classid = bookcase.classid;

				// Get bookcase form and modify it
				const form = mDOM.querySelector('#checkform');
				form.parentElement.removeChild(form);

				// Find the right place to insert it in
				const forms = content.querySelectorAll('.'+CLASSNAME_BOOKCASE_FORM);
				for (let i = 0; i < forms.length; i++) {
					const thisForm = forms[i];
					const cid = thisForm.classid ? thisForm.classid : curClassid;
					if (cid > classid) {
						content.insertBefore(form, thisForm);
						break;
					}
				}
				if(!form.parentElement) {content.appendChild(form);};

				// Decorate
				decorateForm(form, bookcase);

				// finished increase
				finished++;
				textNode.nodeValue = finished < allCount ?
					TEXT_GUI_BOOKCASE_GETTING.replace('C', String(finished)).replace('A', String(allCount)) :
					oriTitleText;
			}
		}

		function decorateForm(form, bookcase) {
			const classid = bookcase.classid;
			let name = bookcase.name;

			// Provide auto-recommand button
			arBtn();

			// Modify properties
			form.classList.add(CLASSNAME_BOOKCASE_FORM);
			form.id += String(classid);
			form.classid = classid;
			form.onsubmit = my_check_confirm;

			// Hide bookcase selector
			const bcSelector = form.querySelector('[name="classlist"]');
			bcSelector.style.display = 'none';

			// Dblclick Change title
			const titleBar = bcSelector.parentElement;
			titleBar.childNodes[0].nodeValue = name;
			titleBar.addEventListener('dblclick', editName);
			// Longpress Change title for mobile
			let touchTimer;
			titleBar.addEventListener('touchstart', () => {touchTimer = setTimeout(editName, 500);});
			titleBar.addEventListener('touchmove', () => {clearTimeout(touchTimer);});
			titleBar.addEventListener('touchend', () => {clearTimeout(touchTimer);});
			titleBar.addEventListener('mousedown', () => {touchTimer = setTimeout(editName, 500);});
			titleBar.addEventListener('mouseup', () => {clearTimeout(touchTimer);});

			// Show tips
			let tip = TEXT_GUI_BOOKCASE_DBLCLICK;
			if (tipready) {
                // tipshow and tiphide is coded inside wenku8 itself, its function is to show a text tip besides the mouse
                titleBar.addEventListener('mouseover', function() {tipshow(tip);});
                titleBar.addEventListener('mouseout' , tiphide);
            } else {
                titleBar.title = tip;
            }

			// Change selector names
			renameSelectors(false);

			// Replaces the original check_confirm() function
			function my_check_confirm() {
				const checkform = this;
				let checknum = 0;
				for (let i = 0; i < checkform.elements.length; i++){
					if (checkform.elements[i].name == 'checkid[]' && checkform.elements[i].checked == true) checknum++;
				}
				if (checknum === 0){
					alert('请先选择要操作的书目！');
					return false;
				}
				const newclassid = checkform.querySelector('#newclassid');
				if(newclassid.value == -1){
					if (confirm('确实要将选中书目移出书架么？')) {return true;} else {return false;};
				} else {
					return true;
				}
			}

			// Selector name refresh
			function renameSelectors(renameAll) {
				if (renameAll) {
					const forms = content.querySelectorAll('.'+CLASSNAME_BOOKCASE_FORM);
					for (const form of forms) {
						renameFormSlctr(form);
					}
				} else {
					renameFormSlctr(form);
				}

				function renameFormSlctr(form) {
					const newclassid = form.querySelector('#newclassid');
					const options = newclassid.children;
					for (let i = 0; i < options.length; i++) {
						const option = options[i];
						const value = Number(option.value);
						const bc = bookcases[value];
						bc ? option.innerText = TEXT_GUI_BOOKCASE_MOVEBOOK.replace('N', bc.name) : function(){};
					}
				}
			}

			// Provide <input> GUI to edit bookcase name
			function editName() {
				const nameInput = document.createElement('input');
				const form = this;
				tip = TEXT_GUI_BOOKCASE_WHATNAME;
				tipready ? tipshow(tip) : function(){};

				titleBar.childNodes[0].nodeValue = '';
				titleBar.appendChild(nameInput);
				nameInput.value = name;
				nameInput.addEventListener('blur', onblur);
				nameInput.addEventListener('keydown', onkeydown)
				nameInput.focus();
				nameInput.setSelectionRange(0, name.length);

				function onblur() {
					tip = TEXT_GUI_BOOKCASE_DBLCLICK;
					tipready ? tipobj.innerHTML = tip : function(){};
					const value = nameInput.value.trim();
					if (value) {
						name = value;
						bookcase.name = name;
						CONFIG.bookcasePrefs.saveConfig(bookcases);
					}
					titleBar.childNodes[0].nodeValue = name;
					try {titleBar.removeChild(nameInput)} catch (DOMException) {};
					renameSelectors(true);
				}

				function onkeydown(e) {
					if (e.keyCode === 13) {
						e.preventDefault();
						onblur();
					}
				}
			}

			// Provide auto-recommend option
			function arBtn() {
				const table = form.querySelector('table');
				for (const tr of table.querySelectorAll('tr')) {
					tr.querySelector('.odd') ? decorateRow(tr) : function() {};
					tr.querySelector('th') ? decorateHeader(tr) : function() {};
					tr.querySelector('td.foot') ? decorateFooter(tr) : function() {};
				}

				// Insert auto-recommend option for given row
				function decorateRow(tr) {
					const eleBookLink = tr.querySelector('td:nth-child(2)>a');
					const strBookID = eleBookLink.href.match(/aid=(\d+)/)[1];
					const strBookName = eleBookLink.innerText;
					const newTd = document.createElement('td');
					const input = document.createElement('input');
					newTd.classList.add('odd');
					input.type = 'number';
					input.inputmode = 'numeric';
					input.style.width = '85%';
					input.value = arConfig.books[strBookID] ? String(arConfig.books[strBookID].number) : '0';
					input.addEventListener('change', onvaluechange);
					input.strBookID = strBookID; input.strBookName = strBookName;
					newTd.appendChild(input); tr.appendChild(newTd);
				}

				// Insert a new row for auto-recommend options
				function decorateHeader(tr) {
					const allTh = tr.querySelectorAll('th');
					const width = ARR_GUI_BOOKCASE_WIDTH;
					const newTh = document.createElement('th');
					newTh.innerText = TEXT_GUI_BOOKCASE_ATRCMMD;
					newTh.classList.add(CLASSNAME_TEXT);
					tr.appendChild(newTh);
					for (let i = 0; i < allTh.length; i++) {
						const th = allTh[i];
						th.style.width = width[i];
					}
				}

				// Fit the width
				function decorateFooter(tr) {
					const td = tr.querySelector('td.foot');
					td.colSpan = ARR_GUI_BOOKCASE_WIDTH.length;
				}

				// auto-recommend onvaluechange
				function onvaluechange(e) {
					arConfig = CONFIG.AutoRecommend.getConfig();
					const input = e.target;
					const value = input.value;
					const strBookID = input.strBookID;
					const strBookName = input.strBookName;
					const bookID = Number(strBookID);
					const userDetail = getMyUserDetail() ? getMyUserDetail().userDetail : refreshMyUserDetail();
					if (isNumeric(value, true) && Number(value) >= 0) {
						// allCount increase
						const oriNum = arConfig.books[strBookID] ? arConfig.books[strBookID].number : 0;
						const number = Number(value);
						arConfig.allCount += number - oriNum;

						// save to config
						number > 0 ? arConfig.books[strBookID] = {number: number, name: strBookName, id: bookID} : delete arConfig.books[strBookID];
						CONFIG.AutoRecommend.saveConfig(arConfig);

						// alert
						new ElegantAlertBox(
							TEXT_ALT_ATRCMMDS_SAVED
							.replaceAll('{B}', strBookName)
							.replaceAll('{N}', value)
							.replaceAll('{R}', userDetail.vote-arConfig.allCount)
						);
						if (userDetail && arConfig.allCount > userDetail.vote) {
							const alertBox = new ElegantAlertBox(
								TEXT_ALT_ATRCMMDS_OVERFLOW
								.replace('{V}', String(userDetail.vote))
								.replace('{C}', String(arConfig.allCount))
							);
							alertBox.elm.onclick = function() {
								alertBox.close.call(alertBox);
								refreshMyUserDetail();
							}
						};
					} else {
						// invalid input value, alert
						new ElegantAlertBox(TEXT_ALT_ATRCMMDS_INVALID.replaceAll('{N}', value));
					}
				}
			}
		}
	}

	// Novel ads remover
	function removeTopAds() {
		const ads = []; document.querySelectorAll('div>script+script+a').forEach(function(a) {ads.push(a.parentElement);});
		for (const ad of ads) {
			ad.parentElement.removeChild(ad);
		}
	}

	// Novel index page add-on
	function pageNovelIndex() {
		removeTopAds();
	}

    // Novel page add-on
    function pageNovel() {
		const pageResource = {elements: {}, infos: {}, download: {}};
		collectPageResources(); DoLog(LogLevel.Info, pageResource, true)

		// Remove ads
		removeTopAds();

		// Provide download GUI
		downloadGUI();

        // Prevent URL.revokeObjectURL in script 轻小说文库下载
        revokeObjectURLHOOK();

		function collectPageResources() {
			collectElements();
			collectInfos();
			initDownload();

			function collectElements() {
				const elements = pageResource.elements;
				elements.title          = document.querySelector('#title');
				elements.images         = document.querySelectorAll('.imagecontent');
				elements.rightButtonDiv = document.querySelector('#linkright');
				elements.rightNodes     = elements.rightButtonDiv.childNodes;
				elements.rightBlank     = elements.rightNodes[elements.rightNodes.length-1];
				elements.content        = document.querySelector('#content');
				elements.spliterDemo    = document.createTextNode(' | ');
			}
			function collectInfos() {
				const elements = pageResource.elements;
				const infos    = pageResource.infos;
				infos.title       = elements.title.innerText;
				infos.isImagePage = elements.images.length > 0;
				infos.content     = infos.isImagePage ? null : elements.content.innerText;
			}
			function initDownload() {
				const elements = pageResource.elements;
				const download = pageResource.download;
				download.running  = false;
				download.finished = 0;
				download.all      = elements.images.length;
				download.error    = 0;
			}
		}

		// Prevent URL.revokeObjectURL in script 轻小说文库下载
		function revokeObjectURLHOOK() {
			const Ori_revokeObjectURL = URL.revokeObjectURL;
			URL.revokeObjectURL = function(arg) {
				if (typeof(arg) === 'string' && arg.substr(0, 5) === 'blob:') {return false;};
				return Ori_revokeObjectURL(arg);
			}
		}

		// Provide download GUI
		function downloadGUI() {
			const elements = pageResource.elements;
			const infos    = pageResource.infos;
			const download = pageResource.download;

			// Create donwload button
			const dlBtn = elements.downloadBtn = document.createElement('span');
			dlBtn.classList.add(CLASSNAME_BUTTON);
			dlBtn.addEventListener('click', infos.isImagePage ? dlNovelImages : dlNovelText);
			dlBtn.innerText = infos.isImagePage ? TEXT_GUI_DOWNLOAD_IMAGE : TEXT_GUI_DOWNLOAD_TEXT;

			// Create spliter
			const spliter = elements.spliterDemo.cloneNode();

			// Append to rightButtonDiv
			elements.rightButtonDiv.style.width = '550px';
			elements.rightButtonDiv.insertBefore(spliter, elements.rightBlank);
			elements.rightButtonDiv.insertBefore(dlBtn,   elements.rightBlank);

			function dlNovelImages() {
				if (download.running) {return false;};
				download.running = true; download.finished = 0; download.error = 0;
				updateDownloadStatus();

				const lenNumber = String(elements.images.length).length;
				for (let i = 0; i < elements.images.length; i++) {
					const img = elements.images[i];
					const name = infos.title + '_' + fillNumber(i+1, lenNumber) + '.jpg';
					GM_xmlhttpRequest({
						url: img.src,
						responseType: 'blob',
						onloadstart: function() {
							DoLog(LogLevel.Info, '[' + String(i) + ']downloading novel image from ' + img.src);
						},
						onload: function(e) {
							DoLog(LogLevel.Info, '[' + String(i) + ']image got: ' + img.src);

							const image = new Image();
							image.onload = function() {
								const url = toImageFormatURL(image, 1);
								DoLog(LogLevel.Info, '[' + String(i) + ']image transformed: ' + img.src);

								const a = document.createElement('a');
								a.href = url;
								a.download = name;
								a.click();

								download.finished++;
								updateDownloadStatus();
								// Code below seems can work, but actually it doesn't work well and somtimes some file cannot be saved
								// The reason is still unknown, but from what I know I can tell that mistakes happend in GM_xmlhttpRequest
								// Error stack: GM_xmlhttpRequest.onload ===> image.onload ===> downloadFile ===> GM_xmlhttpRequest =X=> .onload
								// This Error will also stuck the GMXHRHook.ongoingList
								/*downloadFile({
									url: url,
									name: name,
									onload: function() {
										download.finished++;
										DoLog(LogLevel.Info, '[' + String(i) + ']file saved: ' + name);
										alert('[' + String(i) + ']file saved: ' + name);
										updateDownloadStatus();
									},
									onerror: function() {
										alert('downloadfile error! url = ' + String(url) + ', i = ' + String(i));
									}
								})*/
							}
							image.onerror = function() {
								alert('image load error! image.src = ' + String(image.src) + ', i = ' + String(i));
							}
							image.src = URL.createObjectURL(e.response);
						},
						onerror: function(e) {
							// Error dealing need...
							DoLog(LogLevel.Error, '[' + String(i) + ']image fetch error: ' + img.src);
							download.error++;
						}
					})
				}

				function updateDownloadStatus() {
					elements.downloadBtn.innerText = TEXT_GUI_DOWNLOADING_ALL.replaceAll('C', String(download.finished)).replaceAll('A', String(download.all));
					if (download.finished === download.all) {
						DoLog(LogLevel.Success, 'All images got.');
						elements.downloadBtn.innerText = TEXT_GUI_DOWNLOADED_ALL;
						download.running = false;
					}
				}
			}

			function dlNovelText() {
				const name = infos.title + '.txt';
				const text = infos.content.replaceAll(/[\r\n]+/g, '\r\n');
				downloadText(text, name);
			}
		}

        // Image format changing function
		// image: <img> or Image(); format: 1 for jpeg, 2 for png, 3 for webp
        function toImageFormatURL(image, format) {
            if (typeof(format) === 'number') {format = ['image/jpeg', 'image/png', 'image/webp'][format-1]}
            const cvs = document.createElement('canvas');
            cvs.width = image.width;
		    cvs.height = image.height;
            const ctx = cvs.getContext('2d');
            ctx.drawImage(image, 0, 0);
            return cvs.toDataURL(format);
        }
    }

	// Search form add-on
	function formSearch() {
		const searchForm = document.querySelector('form[name="articlesearch"]');
		if (!searchForm) {return false;};
		const typeSelect = searchForm.querySelector('#searchtype');
		const searchText = searchForm.querySelector('#searchkey');
		const searchSbmt = searchForm.querySelector('input[class="button"][type="submit"]');

		let optionTags;
		provideTagOption();
		onsubmitHOOK();

		function provideTagOption() {
			optionTags = document.createElement('option');
			optionTags.value = VALUE_STR_NULL;
			optionTags.innerText = TEXT_GUI_SEARCH_OPTION_TAG;
			typeSelect.appendChild(optionTags);

			if (tipready) {
				// tipshow and tiphide is coded inside wenku8 itself, its function is to show a text tip besides the mouse
				typeSelect.addEventListener('mouseover', show);
				searchSbmt.addEventListener('mouseover', show);
				typeSelect.addEventListener('mouseout' , tiphide);
				searchSbmt.addEventListener('mouseout' , tiphide);
			} else {
				typeSelect.title = TEXT_TIP_SEARCH_OPTION_TAG;
				searchSbmt.title = TEXT_TIP_SEARCH_OPTION_TAG;
			}

			function show() {
				optionTags.selected ? tipshow(TEXT_TIP_SEARCH_OPTION_TAG) : function() {};
			}
		}
		function onsubmitHOOK() {
			const onsbmt = searchForm.onsubmit;
			searchForm.onsubmit = function() {
				if (optionTags.selected) {
					// DON'T USE window.open()!
					// Wenku8 has no window.open used in its own scripts, so do not use it in userscript either.
					// It might cause security problems.
					//window.open('https://www.wenku8.net/modules/article/tags.php?t=' + $URL.encode(searchText.value));
					if (typeof($URL) === 'undefined' ) {
						$URLError();
						return true;
					} else {
						GM_openInTab(URL_TAGSEARCH.replace('{TU}', $URL.encode(searchText.value)), {
							active: true, insert: true, setParent: true, incognito: false
						});
						return false;
					}
				}
			}

			function $URLError() {
				DoLog(LogLevel.Error, '$URL(from gbk.js) is not loaded.');
				DoLog(LogLevel.Warning, 'Search as plain text instead.');

				// Search as plain text instead
				for (const node of typeSelect.childNodes) {
					node.selected = (node.tagName === 'OPTION' && node.value === 'articlename') ? true : false;
				}
			}
		}
	}

	// Tags page add-on
	function pageTags() {
	}

	// User page add-on
	function pageUser() {
		const UID = Number(getUrlArgv('uid'));

		// Provide review search option
		reviewButton();

		// Review search option
		function reviewButton() {
			// clone button and container div
			const oriContainer = document.querySelectorAll('.blockcontent .userinfo')[0].parentElement;
			const container = oriContainer.cloneNode(true);
			const button = container.querySelector('a');
			button.innerText = TEXT_GUI_USER_REVIEWSEARCH;
			button.href = URL_REVIEWSEARCH.replaceAll('{K}', String(UID));
			oriContainer.parentElement.appendChild(container);
		}
	}

	// Index page add-on
    function pageIndex() {
		showFavorites();

		// Show favorite reviews
		function showFavorites() {
			const links = [];
			const favorites = CONFIG.BkReviewPrefs.getConfig().favorites;

			for (const [rid, favorite] of Object.entries(favorites)) {
				links.push({
					innerHTML: favorite.name.substr(0, 12), // prevent overflow
					tiptitle: favorite.tiptitle ? favorite.tiptitle : favorite.href,
					href: favorite.href
				});
			}

			const block = createLeftBlock(TEXT_GUI_INDEX_FAVORITES, true, {
				type: 'toplist',
				links: links
			})
		}
    }

    // Download page add-on
    function pageDownload() {
        let i;
        let dlCount = 0; // number of active download tasks
        let dlAllRunning = false; // whether there is downloadAll running

		// Get novel info
		const novelInfo = {}; collectNovelInfo();
		const myDlBtns = [];

		// Donwload GUI
		downloadGUI();

        // Server GUI
        serverGUI();

        /* ******************* Code ******************* */
		function collectNovelInfo() {
			novelInfo.novelName = document.querySelector('html body div.main div#centerm div#content table.grid caption a').innerText;
			novelInfo.displays = getAllNameEles();
			novelInfo.volumeNames = getAllNames();
			novelInfo.type = getUrlArgv('type');
			novelInfo.ext = novelInfo.type !== 'txtfull' ? novelInfo.type : 'txt';
		}

		// Donwload GUI
		function downloadGUI() {
			// Only txt is really separated by volumes
			if (novelInfo.type !== 'txt') {return false;};

			// define vars
			let i;

			const tbody = document.querySelector('table>tbody');
			const header = tbody.querySelector('th').parentElement;
			const thead = header.querySelector('th');

			// Append new th
			const newHead = thead.cloneNode(true);
			newHead.innerText = TEXT_GUI_SDOWNLOAD;
			thead.width = '40%';
			header.appendChild(newHead);

			// Append new td
			const trs = tbody.querySelectorAll('tr');
			for (i = 1; i < trs.length; i++) { /* i = 1 to trs.length-1: skip header */
				const index = i-1;
				const tr = trs[i];
				const newTd = tr.querySelector('td.even').cloneNode(true);
				const links = newTd.querySelectorAll('a');
				for (const a of links) {
					a.classList.add(CLASSNAME_BUTTON);
					a.info = {
						description: 'volume download button',
						name: novelInfo.volumeNames[index],
						filename: '{NovelName} {VolumeName}.{Extension}'
							.replace('{NovelName}', novelInfo.novelName)
							.replace('{VolumeName}', novelInfo.volumeNames[index])
							.replace('{Extension}', novelInfo.ext),
						index: index,
						display: novelInfo.displays[index]
					}
					a.onclick = downloadOnclick;
					myDlBtns.push(a);
				}
				tr.appendChild(newTd);
			}

			// Append new tr, provide batch download
			const newTr = trs[trs.length-1].cloneNode(true);
			const newTds = newTr.querySelectorAll('td');
			newTds[0].innerText = TEXT_GUI_DOWNLOADALL;
			//clearChildnodes(newTds[1]); clearChildnodes(newTds[2]);
			newTds[1].innerHTML = newTds[2].innerHTML = TEXT_GUI_NOTHINGHERE;
			tbody.insertBefore(newTr, tbody.children[1]);

			const allBtns = newTds[3].querySelectorAll('a');
			for (i = 0; i < allBtns.length; i++) {
				const a = allBtns[i];
				a.href = 'javascript:void(0);';
				a.info = {
					description: 'download all button',
					index: i
				}
				a.onclick = downloadAllOnclick;
			}
		}

		// Download button onclick
		function downloadOnclick() {
			const a = this;
			a.info.display.innerText = a.info.name + TEXT_GUI_WAITING;
			downloadFile({
				url: a.href,
				name: a.info.filename,
				onloadstart: function(e) {
					a.info.display.innerText = a.info.name + TEXT_GUI_DOWNLOADING;
				},
				onload: function(e) {
					a.info.display.innerText = a.info.name + TEXT_GUI_DOWNLOADED;
				}
			});
			return false;
		}

		// DownloadAll button onclick
		function downloadAllOnclick() {
			const a = this;
			const index = (a.info.index+1)%3;
			for (let i = 0; i < myDlBtns.length; i++) {
				if ((i+1)%3 !== index) {continue;};
				const btn = myDlBtns[i];
				btn.click();
			}
			return false;
		}

		// Get all name display elements
		function getAllNameEles() {
            return document.querySelectorAll('.grid tbody tr .odd');
        }

		// Get all names
		function getAllNames() {
            const all = getAllNameEles()
            const names = [];
            for (let i = 0; i < all.length; i++) {
                names[i] = all[i].innerText;
            }
            return names;
        }

		// Server GUI
		function serverGUI() {
			let servers = document.querySelectorAll('#content>b');
			let serverEles = [];
			for (i = 0; i < servers.length; i++) {
				if (servers[i].innerText.includes('wenku8.com')) {
					serverEles.push(servers[i]);
				}
			}
			for (i = 0; i < serverEles.length; i++) {
				serverEles[i].classList.add(CLASSNAME_BUTTON);
				serverEles[i].addEventListener('click', function () {
					changeAllServers(this.innerText);
				});
				if (tipready) {
					// tipshow and tiphide is coded inside wenku8 itself, its function is to show a text tip besides the mouse
					serverEles[i].addEventListener('mouseover', function () {
						tipshow(TEXT_TIP_SERVERCHANGE);
					});
					serverEles[i].addEventListener('mouseout', tiphide);
				} else {
					serverEles[i].title = TEXT_TIP_SERVERCHANGE;
				}
			}
		}

        // Change all server elements
        function changeAllServers(server) {
            let i;
            const allA = document.querySelectorAll('.even a');
            for (i = 0; i < allA.length; i++) {
                changeServer(server, allA[i]);
            }
        }

        // Change server for an element
        function changeServer(server, element) {
            if (!element.href) {return false;};
            element.href = element.href.replace(/\/\/dl\d?\.wenku8\.com\//g, '//' + server + '/');
        }
    }

	// Login page add-on
	function pageLogin() {
		const form = document.querySelector('form[name="frmlogin"]');
		if (!form) {return false;}
		const eleUsername = form.querySelector('input.text[name="username"]');
		const elePassword = form.querySelector('input.text[name="password"]')

		catchAccount();

		// Save account info
		function catchAccount() {
			form.addEventListener('submit', () => {
				const config = CONFIG.GlobalConfig.getConfig();
				const username = eleUsername.value;
				const password = elePassword.value;
				config.users = config.users ? config.users : {};
				config.users[username] = {
					username: username,
					password: password
				}
				CONFIG.GlobalConfig.saveConfig(config);
			});
		}
	}

	// Account fast switching
	function multiAccount() {
		if (!document.querySelector('.fl')) {return false;};
		GUI();

		function GUI() {
			// Add switch select
			const eleTopLeft = document.querySelector('.fl');
			const eletext    = document.createElement('span');
			const sltSwitch  = document.createElement('select');
			eletext.innerText = TEXT_GUI_ACCOUNT_SWITCH;
			eletext.classList.add(CLASSNAME_TEXT);
			eletext.style.marginLeft = '0.5em';
			eleTopLeft.appendChild(eletext);
			eleTopLeft.appendChild(sltSwitch);

			// Not logged in, create and select an empty option
			// Select current user's option
			if (!getUserName()) {
				appendOption(TEXT_GUI_ACCOUNT_NOTLOGGEDIN, '').selected = true;
			};

			// Add select options
			const userConfig = CONFIG.GlobalConfig.getConfig();
			const users = userConfig.users ? userConfig.users : {};
			const names = Object.keys(users);
			if (names.length === 0) {
				appendOption(TEXT_GUI_ACCOUNT_NOACCOUNT, '');
				if (tipready) {
					sltSwitch.addEventListener('mouseover', ()=>{tipshow(TEXT_TIP_ACCOUNT_NOACCOUNT);});
					sltSwitch.addEventListener('mouseout', tiphide);
				} else {
					sltSwitch.title = TEXT_TIP_ACCOUNT_NOACCOUNT;
				}
			}
			for (const username of names) {
				appendOption(username, username)
			}

			// Select current user's option
			if (getUserName()) {selectCurUser();};

			// onchange: switch account
			sltSwitch.addEventListener('change', (e) => {
				const select = e.target;
				if (!select.value || !confirm(TEXT_GUI_ACCOUNT_CONFIRM.replace('{N}', select.value))) {
					selectCurUser();
					e.preventDefault();
					e.stopPropagation();
					return;
				}

				switchAccount(select.value);
			});

			function appendOption(text, value) {
				const option = document.createElement('option');
				option.innerText = text;
				option.value = value;
				sltSwitch.appendChild(option);
				return option;
			}

			function selectCurUser() {
				for (const option of sltSwitch.querySelectorAll('option')) {
					option.selected = getUserName().toLowerCase() === option.value.toLowerCase();
				}
			}
		}

		function switchAccount(username) {
			// Logout
			new ElegantAlertBox(TEXT_ALT_ACCOUNT_WORKING_LOGOFF);
			GM_xmlhttpRequest({
				method: 'GET',
				url: URL_USRLOGOFF,
				onload: function(response) {
					// Login
					new ElegantAlertBox(TEXT_ALT_ACCOUNT_WORKING_LOGIN);
					const account = CONFIG.GlobalConfig.getConfig().users[username];
					const data = DATA_XHR_LOGIN
						.replace('{U}', $URL.encode(account.username))
						.replace('{P}', $URL.encode(account.password))
						.replace('{C}', $URL.encode('315360000')) // Expire time: 1 year
					GM_xmlhttpRequest({
						method: 'POST',
						url: URL_USRLOGIN,
						data: data,
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						},
						onload: function() {
							let box = new ElegantAlertBox(TEXT_ALT_ACCOUNT_SWITCHED.replace('{N}', username));
							redirectGMStorage(getUserID());
							DoLog(LogLevel.Info, 'GM_storage redirected to ' + String(getUserID()));
							const timeout = setTimeout(()=>{location.href=location.href;}, 3000);
							box.elm.onclick = () => {
								clearTimeout(timeout);
								box.close.call(box);
							};
						}
					})
				}
			})
		}
	}

	// isAPIPage page add-on
	function pageAPI(API) {
		DoLog(LogLevel.Info, 'This is wenku API page.');
		DoLog(LogLevel.Info, 'API is: [' + API + ']');
		DoLog(LogLevel.Info, 'There is nothing to do. Quiting...');
	}

	// Check if current page is an wenku API page ('处理成功', '出现错误！')
	function isAPIPage() {
		// API page has just one .block div and one close-page button
		const block = document.querySelectorAll('.block');
		const close = document.querySelectorAll('a[href="javascript:window.close()"]');
		return block.length === 1 && close.length === 1;
	}

	// getMyUserDetail with soft alerts
	function refreshMyUserDetail(callback, args=[]) {
		new ElegantAlertBox(TEXT_ALT_USRDTL_REFRESH);
		getMyUserDetail(function() {
			const alertBox = new ElegantAlertBox(TEXT_ALT_USRDTL_REFRESHED);

			// rewrite onclick function from copying to showing details
			alertBox.elm.onclick = function() {
				alertBox.close.call(alertBox);
				new ElegantAlertBox(JSON.stringify(getMyUserDetail()));
			}

			// callback if exist
			callback ? callback.apply(args) : function() {};
		})
	}

	// Get my user info detail
	// if no argument provided, this function will just read userdetail from gm_storage
	// otherwise, the function will make a http request to get the latest userdetail
	// if no argument provided and no gm_storage record, then will just return false
	// if callback is not a function, then will just request&store but not callback
	function getMyUserDetail(callback, args=[]) {
		if (callback) {
			requestWeb();
			return true;
		} else {
			const storage = CONFIG.userDtlePrefs.getConfig();
			if (!storage.userDetail && !storage.userFriends) {
				DoLog(LogLevel.Warning, 'Attempt to read userDetail from gm_storage but no record found');
				return false;
			};
			const userDetail = storage;
			return userDetail;
		}

		function requestWeb() {
			const lastStorage = CONFIG ? CONFIG.userDtlePrefs.getConfig() : undefined;
			let restXHR = 2;
			let storage = {};

			// Request userDetail
			getDocument(URL_USRDETAIL, detailLoaded)

			// Request userFriends
			getDocument(URL_USRFRIEND, friendLoaded)

			function detailLoaded(oDoc) {
				const content = oDoc.querySelector('#content');
				storage.userDetail = {
					userID: Number(content.querySelector('tr:nth-child(1)>.even').innerText),  // '用户ID'
					userLink: content.querySelector('tr:nth-child(2)>.even').innerText,        // '推广链接'
					userName: content.querySelector('tr:nth-child(3)>.even').innerText,        // '用户名'
					displayName: content.querySelector('tr:nth-child(4)>.even').innerText,     // '用户昵称'
					userType: content.querySelector('tr:nth-child(5)>.even').innerText,        // '等级'
					userGrade: content.querySelector('tr:nth-child(6)>.even').innerText,       // '头衔'
					gender: content.querySelector('tr:nth-child(7)>.even').innerText,          // '性别'
					email: content.querySelector('tr:nth-child(8)>.even').innerText,           // 'Email'
					qq: content.querySelector('tr:nth-child(9)>.even').innerText,              // 'QQ'
					msn: content.querySelector('tr:nth-child(10)>.even').innerText,            // 'MSN'
					site: content.querySelector('tr:nth-child(11)>.even').innerText,           // '网站'
					signupDate: content.querySelector('tr:nth-child(13)>.even').innerText,     // '注册日期'
					contibute: content.querySelector('tr:nth-child(14)>.even').innerText,      // '贡献值'
					exp: content.querySelector('tr:nth-child(15)>.even').innerText,            // '经验值'
					credit: content.querySelector('tr:nth-child(16)>.even').innerText,         // '现有积分'
					friends: content.querySelector('tr:nth-child(17)>.even').innerText,        // '最多好友数'
					mailbox: content.querySelector('tr:nth-child(18)>.even').innerText,        // '信箱最多消息数'
					bookcase: content.querySelector('tr:nth-child(19)>.even').innerText,       // '书架最大收藏量'
					vote: content.querySelector('tr:nth-child(20)>.even').innerText,           // '每天允许推荐次数'
					sign: content.querySelector('tr:nth-child(22)>.even').innerText,           // '用户签名'
					intoduction: content.querySelector('tr:nth-child(23)>.even').innerText,    // '个人简介'
					userImage: content.querySelector('tr>td>img').src                          // '头像'
				}
				loaded();
			}

			function friendLoaded(oDoc) {
				const content = oDoc.querySelector('#content');
				const trs = content.querySelectorAll('tr');
				const friends = [];
				const lastFriends = lastStorage ? lastStorage.userFriends : undefined;

				for (let i = 1; i < trs.length; i++) {
					getFriends(trs[i]);
				}
				storage.userFriends = friends;
				loaded();

				function getFriends(tr) {
					// Check if userID exist
					if (isNaN(Number(tr.children[2].querySelector('a').href.match(/\?uid=(\d+)/)[1]))) {return false;};

					// Collect information
					let friend = {
						userID: Number(tr.children[2].querySelector('a').href.match(/\?uid=(\d+)/)[1]),
						userName: tr.children[0].innerText,
						signupDate: tr.children[1].innerText
					}
					friend = fillLocalInfo(friend)
					friends.push(friend);
				}

				function fillLocalInfo(friend) {
					if (!lastFriends) {return friend;};
					for (const f of lastFriends) {
						if (f.userID === friend.userID) {
							for (const [key, value] of Object.entries(f)) {
								if (friend.hasOwnProperty(key)) {continue;};
								friend[key] = value;
							}
							break;
						}
					}
					return friend;
				}
			}

			function loaded() {
				restXHR--;
				if (restXHR === 0) {
					// Save to gm_storage
					if (CONFIG) {
						storage.lasttime = getTime('-', false);
						CONFIG.userDtlePrefs.saveConfig(storage);
					}

					// Callback
					typeof(callback) === 'function' ? callback.apply(null, [storage].concat(args)) : function() {};
				}
			}
		}
	}

	function getUserID() {
        const match = $URL.decode(document.cookie).match(/jieqiUserId=(\d+)/);
		const id = match && match[1] ? Number(match[1]) : null;
		return isNaN(id) ? null : id;
	}

	function getUserName() {
		const match = $URL.decode(document.cookie).match(/jieqiUserName=([^, ;]+)/);
		const name = match ? match[1] : null;
		return name;
	}

	// Check if tipobj is ready, if not, then make it
	function tipcheck() {
		DoLog(LogLevel.Info, 'checking tipobj...');
		if (typeof(tipobj) === 'object' && tipobj !== null) {
			DoLog(LogLevel.Info, 'tipobj ready...');
			return true;
		} else {
			DoLog(LogLevel.Warning, 'tipobj not ready');
			if (typeof(tipinit) === 'function') {
				DoLog(LogLevel.Success, 'tipinit executed');
				tipinit();
				return true;
			} else {
				DoLog(LogLevel.Error, 'tipinit not found');
				return false;
			}
		}
	}

	// Create a left .block operatingArea
	// options = {type: '', ...opts}
	// Supported type: 'mypage', 'toplist'
	function createLeftBlock(title=TEXT_GUI_BLOCK_TITLE_DEFULT, append=false, options) {
		const leftEle  = document.querySelector('#left');
		const blockEle = document.querySelector('#left>.block').cloneNode(true);
		const titleEle = blockEle.querySelector('.blocktitle>.txt');
		const cntntEle = blockEle.querySelector('.blockcontent');

		titleEle.innerText = title;
		clearChildnodes(cntntEle);

		const type = options ? options.type.toLowerCase() : null;
		switch (type.toLowerCase()) {
			case 'mypage': typeMypage(); break;
			case 'toplist': typeToplist(); break;
			default: DoLog(LogLevel.Error, 'createLeftBlock: Invalid block type');
		}

		append && leftEle.appendChild(blockEle);

		return blockEle;

		// Links such as https://www.wenku8.net/userdetail.php
		// options = {type: 'mypage', links = [...{href: '', innerHTML: '', tiptitle: '', id: ''}]}
		function typeMypage() {
			const ul = document.createElement('ul');
			ul.classList.add('ulitem');
			for (const link of options.links) {
				const li = document.createElement('li');
				const a = document.createElement('a');
				a.href = link.href ? link.href : 'javascript: void(0);';
				link.href && (a.target = '_blank');
				link.tiptitle && (a.tiptitle = a.title = link.tiptitle);
				tipready && a.addEventListener('mouseover', showtip);
				tipready && a.addEventListener('mouseout', tiphide);
				a.innerHTML = link.innerHTML;
				a.id = link.id ? link.id : '';
				li.appendChild(a);
				ul.appendChild(li);
			}
			blockEle.appendChild(ul);
		}

		// Links such as top-books-list inside #right in index page
		// options = {type: 'toplist', links = [...{href: '', innerHTML: '', tiptitle: '', id: ''}]}
		function typeToplist() {
			const ul = document.createElement('ul');
			ul.classList.add('ultop');
			for (const link of options.links) {
				const li = document.createElement('li');
				const a = document.createElement('a');
				a.href = link.href ? link.href : 'javascript: void(0);';
				link.href && (a.target = '_blank');
				link.tiptitle && (tipready ? a.tiptitle = link.tiptitle : a.title = link.tiptitle);
				tipready && a.addEventListener('mouseover', showtip);
				tipready && a.addEventListener('mouseout', tiphide);
				a.innerHTML = link.innerHTML;
				a.id = link.id ? link.id : '';
				li.appendChild(a);
				ul.appendChild(li);
			}
			blockEle.appendChild(ul);
		}

		function showtip(e) {
			tipready && e && tipshow(e.target.tiptitle);
		}
	}

	// Get a review's last page url
	function getLatestReviewPageUrl(rid, callback, args = []) {
		const reviewUrl = 'https://www.wenku8.net/modules/article/reviewshow.php?rid=' + String(rid);
		getDocument(reviewUrl, firstPage, args);

		function firstPage(oDoc, ...args) {
			const url = oDoc.querySelector('#pagelink>a.last').href;
			args = [url].concat(args);
			callback.apply(null, args);
		};
	};

	// Remove all childnodes from an element
	function clearChildnodes(element) {
		const cns = []
		for (const cn of element.childNodes) {
			cns.push(cn);
		}
		for (const cn of cns) {
			element.removeChild(cn);
		}
	}

	// GM_XHR HOOK: The number of running GM_XHRs in a time must under maxXHR
	// Returns the abort function to stop the request anyway(no matter it's still waiting, or requesting)
	// (If the request is invalid, such as url === '', will return false and will NOT make this request)
	// If the abort function called on a request that is not running(still waiting or finished), there will be NO onabort event
	// Requires: function delItem(){...} & function uniqueIDMaker(){...}
	function GMXHRHook(maxXHR=5) {
		const GM_XHR = GM_xmlhttpRequest;
		const getID = uniqueIDMaker();
		let todoList = [], ongoingList = [];
		GM_xmlhttpRequest = safeGMxhr;

		function safeGMxhr() {
			// Get an id for this request, arrange a request object for it.
			const id = getID();
			const request = {id: id, args: arguments, aborter: null};

			// Deal onload function first
			dealEndingEvents(request);

			/* DO NOT DO THIS! KEEP ITS ORIGINAL PROPERTIES!
			// Stop invalid requests
			if (!validCheck(request)) {
				return false;
			}
			*/

			// Judge if we could start the request now or later?
			todoList.push(request);
			checkXHR();
			return makeAbortFunc(id);

			// Decrease activeXHRCount while GM_XHR onload;
			function dealEndingEvents(request) {
				const e = request.args[0];

				// onload event
				const oriOnload = e.onload;
				e.onload = function() {
					reqFinish(request.id);
					checkXHR();
					oriOnload ? oriOnload.apply(null, arguments) : function() {};
				}

				// onerror event
				const oriOnerror = e.onerror;
				e.onerror = function() {
					reqFinish(request.id);
					checkXHR();
					oriOnerror ? oriOnerror.apply(null, arguments) : function() {};
				}

				// ontimeout event
				const oriOntimeout = e.ontimeout;
				e.ontimeout = function() {
					reqFinish(request.id);
					checkXHR();
					oriOntimeout ? oriOntimeout.apply(null, arguments) : function() {};
				}

				// onabort event
				const oriOnabort = e.onabort;
				e.onabort = function() {
					reqFinish(request.id);
					checkXHR();
					oriOnabort ? oriOnabort.apply(null, arguments) : function() {};
				}
			}

			// Check if the request is invalid
			function validCheck(request) {
				const e = request.args[0];

				if (!e.url) {
					return false;
				}

				return true;
			}

			// Call a XHR from todoList and push the request object to ongoingList if called
			function checkXHR() {
				if (ongoingList.length >= maxXHR) {return false;};
				if (todoList.length === 0) {return false;};
				const req = todoList.shift();
				const reqArgs = req.args;
				const aborter = GM_XHR.apply(null, reqArgs);
				req.aborter = aborter;
				ongoingList.push(req);
				return req;
			}

			// Make a function that aborts a certain request
			function makeAbortFunc(id) {
				return function() {
					let i;

					// Check if the request haven't been called
					for (i = 0; i < todoList.length; i++) {
						const req = todoList[i];
						if (req.id === id) {
							// found this request: haven't been called
							delItem(todoList, i);
							return true;
						}
					}

					// Check if the request is running now
					for (i = 0; i < ongoingList.length; i++) {
						const req = todoList[i];
						if (req.id === id) {
							// found this request: running now
							req.aborter();
							reqFinish(id);
							checkXHR();
						}
					}

					// Oh no, this request is already finished...
					return false;
				}
			}

			// Remove a certain request from ongoingList
			function reqFinish(id) {
				let i;
				for (i = 0; i < ongoingList.length; i++) {
					const req = ongoingList[i];
					if (req.id === id) {
						ongoingList = delItem(ongoingList, i);
						return true;
					}
				}
				return false;
			}
		}
	}

	// Redirect GM_storage API
	// Each key points to a different storage area
	// Original GM_functions will be backuped in window object
	// PS: No worry for GM_functions leaking, because Tempermonkey's Sandboxing
	function redirectGMStorage(key) {
		// Recover if redirected before
		GM_setValue    = typeof(window.setValue)    === 'function' ? window.setValue    : GM_setValue;
		GM_getValue    = typeof(window.getValue)    === 'function' ? window.getValue    : GM_getValue;
		GM_listValues  = typeof(window.listValues)  === 'function' ? window.listValues  : GM_listValues;
		GM_deleteValue = typeof(window.deleteValue) === 'function' ? window.deleteValue : GM_deleteValue;

		// Stop if no key
		if (!key) {return;};

		// Save original GM_functions
		window.setValue    = typeof(GM_setValue)    === 'function' ? GM_setValue    : function() {};
		window.getValue    = typeof(GM_getValue)    === 'function' ? GM_getValue    : function() {};
		window.listValues  = typeof(GM_listValues)  === 'function' ? GM_listValues  : function() {};
		window.deleteValue = typeof(GM_deleteValue) === 'function' ? GM_deleteValue : function() {};

		// Redirect GM_functions
		typeof(GM_setValue)    === 'function' ? GM_setValue    = RD_GM_setValue    : function() {};
		typeof(GM_getValue)    === 'function' ? GM_getValue    = RD_GM_getValue    : function() {};
		typeof(GM_listValues)  === 'function' ? GM_listValues  = RD_GM_listValues  : function() {};
		typeof(GM_deleteValue) === 'function' ? GM_deleteValue = RD_GM_deleteValue : function() {};

		// Get global storage
		const storage = getStorage();

		function getStorage() {
			return window.getValue(key, {});
		}

		function saveStorage() {
			return window.setValue(key, storage);
		}

		function RD_GM_setValue(key, value) {
			storage[key] = value;
			saveStorage();
		}

		function RD_GM_getValue(key, defaultValue) {
			return storage[key] || defaultValue;
		}

		function RD_GM_listValues() {
			return Object.keys(storage);
		}

		function RD_GM_deleteValue(key) {
			delete storage[key];
			saveStorage();
		}
	}

    // Download and parse a url page into a html document(dom).
    // when xhr onload: callback.apply([dom, args])
    function getDocument(url, callback, args=[]) {
        GM_xmlhttpRequest({
            method       : 'GET',
            url          : url,
            responseType : 'blob',
			onloadstart  : function() {
				DoLog(LogLevel.Info, 'getting document, url=\'' + url + '\'');
			},
            onload       : function(response) {
                const htmlblob = response.response;
                const reader = new FileReader();
                reader.onload = function(e) {
                    const htmlText = reader.result;
                    const dom = new DOMParser().parseFromString(htmlText, 'text/html');
                    args = [dom].concat(args);
                    callback.apply(null, args);
                    //callback(dom, htmlText);
                }
                reader.readAsText(htmlblob, 'GBK');
                /* 注意！原来这里只是使用了DOMParser，DOMParser不像iframe加载Document一样拥有完整的上下文并执行所有element的功能，
                ** 只是按照HTML格式进行解析，所以在文库页面的GBK编码下仍然会按照UTF-8编码进行解析，导致中文乱码。
                ** 所以处理dom时不要使用ASC-II字符集以外的字符！
                **
                ** 注：现在使用了FileReader来以GBK编码解析htmlText，故编码问题已经解决，可以正常使用任何字符
                */
            }
        })
    }

	// Save dataURL to file
	function saveFile(dataURL, filename) {
		const a = document.createElement('a');
		a.href = dataURL;
		a.download = filename;
		a.click();
	}

	// File download function
	// details looks like the detail of GM_xmlhttpRequest
	// onload function will be called after file saved to disk
	function downloadFile(details) {
		if (!details.url || !details.name) {return false;};

		// Configure request object
		const requestObj = {
			url: details.url,
			responseType: 'blob',
			onload: function(e) {
				// Save file
				saveFile(URL.createObjectURL(e.response), details.name);

				// onload callback
				details.onload ? details.onload(e) : function() {};
			}
		}
		if (details.onloadstart       ) {requestObj.onloadstart        = details.onloadstart;};
		if (details.onprogress        ) {requestObj.onprogress         = details.onprogress;};
		if (details.onerror           ) {requestObj.onerror            = details.onerror;};
		if (details.onabort           ) {requestObj.onabort            = details.onabort;};
		if (details.onreadystatechange) {requestObj.onreadystatechange = details.onreadystatechange;};
		if (details.ontimeout         ) {requestObj.ontimeout          = details.ontimeout;};

		// Send request
		GM_xmlhttpRequest(requestObj);
	}

	// Save text to textfile
	function downloadText(text, name) {
		if (!text || !name) {return false;};

		// Get blob url
		const blob = new Blob([text],{type:"text/plain;charset=utf-8"});
		const url = URL.createObjectURL(blob);

		// Create <a> and download
		const a = document.createElement('a');
		a.href = url;
		a.download = name;
		a.click();
	}

	// Load javascript from given url
	function loadJS(url, callback, oDoc=document) {
		var script = document.createElement('script'),
			fn = callback || function () {};
		script.type = 'text/javascript';

		//IE
		if (script.readyState) {
			script.onreadystatechange = function () {
				if (script.readyState == 'loaded' || script.readyState == 'complete') {
					script.onreadystatechange = null;
					fn();
				}
			};
		} else {
			//其他浏览器
			script.onload = function () {
				fn();
			};
		}

		script.src = url;
		oDoc.getElementsByTagName('head')[0].appendChild(script);
	}

	// Load/Read and Save javascript from given url
	// Auto reties when xhr fails.
	// If load success then callback(true), else callback(false)
	function loadJSPlus(url, callback, oDoc=document, maxRetry=3) {
		const fn = callback || function () {};
		const localCDN = GM_getValue(KEY_LOCALCDN, {});
		if (localCDN[url]) {
			DoLog(LogLevel.Info, 'Loading js from localCDN: ' + url);
			const js = localCDN[url];
			appendScript(js);
			fn(true);
			return;
		}

		DoLog(LogLevel.Info, 'Loading js from web: ' + url);
		loadJSPlus.retryCount = loadJSPlus.retryCount !== undefined ? loadJSPlus.retryCount : 0;
		GM_xmlhttpRequest({
			method       : 'GET',
            url          : url,
            responseType : 'text',
			onload       : function(e) {
				if (e.status === 200) {
					const js = e.responseText;
					localCDN[url] = js;
					localCDN[KEY_LOCALCDN_VERSION] = VALUE_LOCALCDN_VERSION;
					GM_setValue(KEY_LOCALCDN, localCDN);

					appendScript(js);
					fn(true);
				} else {
					retry();
				}
			},
			onerror      : retry
		})

		function appendScript(code) {
			const script = oDoc.createElement('script');
			script.type = 'text/javascript';
			script.innerHTML = code;
			oDoc.head.appendChild(script);
		}

		function retry() {
			loadJSPlus.retryCount++;
			if (loadJSPlus.retryCount <= maxRetry) {
				loadJSPlus(url, callback, oDoc, maxRetry);
			} else {
				fn(false);
			}
		}
	}

	// Get a url argument from lacation.href
	// also recieve a function to deal the matched string
	// returns defaultValue if name not found
    // Args: name, dealFunc=(function(a) {return a;}), defaultValue=null
	function getUrlArgv(details) {
        typeof(details) === 'string'    && (details = {name: details});
        typeof(details) === 'undefined' && (details = {});
        if (!details.name) {return null;};

        const url = details.url ? details.url : location.href;
        const name = details.name ? details.name : '';
        const dealFunc = details.dealFunc ? details.dealFunc : ((a)=>{return a;});
        const defaultValue = details.defaultValue ? details.defaultValue : null;
		const matcher = new RegExp(name + '=([^&]+)');
		const result = url.match(matcher);
		const argv = result ? dealFunc(result[1]) : defaultValue;

		return argv;
	}

    // Get a time text like 1970-01-01 00:00:00
	// if dateSpliter provided false, there will be no date part. The same for timeSpliter.
    function getTime(dateSpliter='-', timeSpliter=':') {
        const d = new Date();
		let fulltime = ''
		fulltime += dateSpliter ? fillNumber(d.getFullYear(), 4) + dateSpliter + fillNumber((d.getMonth() + 1), 2) + dateSpliter + fillNumber(d.getDate(), 2) : '';
		fulltime += dateSpliter && timeSpliter ? ' ' : '';
		fulltime += timeSpliter ? fillNumber(d.getHours(), 2) + timeSpliter + fillNumber(d.getMinutes(), 2) + timeSpliter + fillNumber(d.getSeconds(), 2) : '';
        return fulltime;
    }

	// Get key-value object from text like 'key: value'/'key：value'/' key   :  value   '
	// returns: {key: value, KEY: key, VALUE: value}
	function getKeyValue(text, delimiters=[':', '：', ',']) {
		// Modify from https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Error#examples
		// Create a new object, that prototypally inherits from the Error constructor.
		function SplitError(message) {
			this.name = 'SplitError';
			this.message = message || 'SplitError Message';
			this.stack = (new Error()).stack;
		}
		SplitError.prototype = Object.create(Error.prototype);
		SplitError.prototype.constructor = SplitError;

		if (!text) {return [];};

		const result = {};
		let key, value;
		for (let i = 0; i < text.length; i++) {
			const char = text.charAt(i);
			for (const delimiter of delimiters) {
				if (delimiter === char) {
					if (!key && !value) {
						key = text.substr(0, i).trim();
						value = text.substr(i+1).trim();
						result[key] = value;
						result.KEY = key;
						result.VALUE = value;
					} else {
						throw new SplitError('Mutiple Delimiter in Text');
					}
				}
			}
		}

		return result;
	}

	// Convert rgb color(e.g. 51,51,153) to hex color(e.g. '333399')
	function rgbToHex(r, g, b) {return fillNumber(((r << 16) | (g << 8) | b).toString(16), 6);}

    // Fill number text to certain length with '0'
    function fillNumber(number, length) {
        let str = String(number);
        for (let i = str.length; i < length; i++) {
            str = '0' + str;
        }
        return str;
    }

    // Judge whether the str is a number
    function isNumeric(str, disableFloat=false) {
        const result = Number(str);
        return !isNaN(result) && str !== '' && (!disableFloat || result===Math.floor(result));
    }

	// Del a item from an array using its index. Returns the array but can NOT modify the original array directly!!
	function delItem(arr, delIndex) {
		arr = arr.slice(0, delIndex).concat(arr.slice(delIndex+1));
		return arr;
	}

	// Clone(deep) an object variable
	// Returns the new object
	function deepclone(obj) {
		if (obj === null) return null;
		if (typeof(obj) !== 'object') return obj;
		if (obj.constructor === Date) return new Date(obj);
		if (obj.constructor === RegExp) return new RegExp(obj);
		var newObj = new obj.constructor(); //保持继承的原型
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				const val = obj[key];
				newObj[key] = typeof val === 'object' ? deepclone(val) : val;
			}
		}
		return newObj;
	}

	// Makes a function that returns a unique ID number each time
	function uniqueIDMaker() {
		let id = 0;
		return makeID;
		function makeID() {
			id++;
			return id;
		}
	}

	// Load required javascript files for non-GM/TM environments (such as Alook javascript extension)
	// Please @require https://greasyfork.org/scripts/429557-gmrequirechecker/code/GMRequireChecker.js?version=951692 before using this function
	function loadRequires(callback) {
		if (typeof(GMRequiredJSLoaded) === 'boolean') {
			callback();
			return;
		};

		const requires = [
			'https://cdn.jsdelivr.net/gh/PYUDNG/CDN@eed1fcf0e901348bc4e752fd483bcb571ebe0408/js/GBK_URL/GBK.js',
			'https://cdn.jsdelivr.net/gh/PYUDNG/CDN@058b97a4c86980fa3de3d9ee9bc9f2f787e11c84/js/gui/elegant%20alert.js',
			'https://cdn.jsdelivr.net/gh/PYUDNG/CDN@94fc2bdd313f7bf2af6db5b8699effee8dd0b18d/js/ajax/GreasyForkScriptUpdate.js'
		]
		let rest = requires.length;

		for (const js of requires) {
			DoLog(LogLevel.Info, 'Loading required js: ' + js);
			loadJSPlus(js, jsLoaded);
		}

		function jsLoaded(success) {
			if (success) {
				rest--;
				DoLog(LogLevel.Info, 'Required js loaded. {N} requires left.'.replaceAll('{N}', String(rest)));
				rest === 0 ? callback() : function() {};
			} else {
				DoLog(LogLevel.Error, 'Required js load failed. {N} requires left.'.replaceAll('{N}', String(rest)));
				alert(TEXT_GUI_REQUIRE_FAILED);
			}
		}
	}

    // GM_Polyfill By PY-DNG
	// 2021.07.18 - 2021.07.19
	// Simply provides the following GM_functions using localStorage, XMLHttpRequest and window.open:
	// Returns object GM_POLYFILLED which has the following properties that shows you which GM_functions are actually polyfilled:
	// GM_setValue, GM_getValue, GM_deleteValue, GM_listValues, GM_xmlhttpRequest, GM_openInTab, GM_setClipboard, unsafeWindow(object)
	// All polyfilled GM_functions are accessable in window object/Global_Scope(only without Tempermonkey Sandboxing environment)
	function GM_PolyFill(name='default') {
		const GM_POLYFILL_KEY_STORAGE = 'GM_STORAGE_POLYFILL';
		const GM_POLYFILL_storage = GM_POLYFILL_getStorage();
		const GM_POLYFILLED = {
			GM_setValue: true,
			GM_getValue: true,
			GM_deleteValue: true,
			GM_listValues: true,
			GM_xmlhttpRequest: true,
			GM_openInTab: true,
			GM_setClipboard: true,
			unsafeWindow: true
		}

		GM_setValue_polyfill();
		GM_getValue_polyfill();
		GM_deleteValue_polyfill();
		GM_listValues_polyfill();
		GM_xmlhttpRequest_polyfill();
		GM_openInTab_polyfill();
		GM_setClipboard_polyfill();
		unsafeWindow_polyfill();

		function GM_POLYFILL_getStorage() {
			let gstorage = localStorage.getItem(GM_POLYFILL_KEY_STORAGE);
			gstorage = gstorage ? JSON.parse(gstorage) : {};
			let storage = gstorage[name] ? gstorage[name] : {};
			return storage;
		}

		function GM_POLYFILL_saveStorage() {
			let gstorage = localStorage.getItem(GM_POLYFILL_KEY_STORAGE);
			gstorage = gstorage ? JSON.parse(gstorage) : {};
			gstorage[name] = GM_POLYFILL_storage;
			localStorage.setItem(GM_POLYFILL_KEY_STORAGE, JSON.stringify(gstorage));
		}

		// GM_setValue
		function GM_setValue_polyfill() {
			typeof (GM_setValue) === 'function' ? GM_POLYFILLED.GM_setValue = false: window.GM_setValue = PF_GM_setValue;;

			function PF_GM_setValue(name, value) {
				name = String(name);
				GM_POLYFILL_storage[name] = value;
				GM_POLYFILL_saveStorage();
			}
		}

		// GM_getValue
		function GM_getValue_polyfill() {
			typeof (GM_getValue) === 'function' ? GM_POLYFILLED.GM_getValue = false: window.GM_getValue = PF_GM_getValue;

			function PF_GM_getValue(name, defaultValue) {
				name = String(name);
				if (GM_POLYFILL_storage.hasOwnProperty(name)) {
					return GM_POLYFILL_storage[name];
				} else {
					return defaultValue;
				}
			}
		}

		// GM_deleteValue
		function GM_deleteValue_polyfill() {
			typeof (GM_deleteValue) === 'function' ? GM_POLYFILLED.GM_deleteValue = false: window.GM_deleteValue = PF_GM_deleteValue;

			function PF_GM_deleteValue(name) {
				name = String(name);
				if (GM_POLYFILL_storage.hasOwnProperty(name)) {
					delete GM_POLYFILL_storage[name];
					GM_POLYFILL_saveStorage();
				}
			}
		}

		// GM_listValues
		function GM_listValues_polyfill() {
			typeof (GM_listValues) === 'function' ? GM_POLYFILLED.GM_listValues = false: window.GM_listValues = PF_GM_listValues;

			function PF_GM_listValues() {
				return Object.keys(GM_POLYFILL_storage);
			}
		}

		// unsafeWindow
		function unsafeWindow_polyfill() {
			typeof (unsafeWindow) === 'object' ? GM_POLYFILLED.unsafeWindow = false: window.unsafeWindow = window;
		}

		// GM_xmlhttpRequest
		// not supported properties of details: synchronous binary nocache revalidate context fetch
		// not supported properties of response(onload arguments[0]): finalUrl
		// ---!IMPORTANT!--- DOES NOT SUPPORT CROSS-ORIGIN REQUESTS!!!!! ---!IMPORTANT!---
		function GM_xmlhttpRequest_polyfill() {
			typeof (GM_xmlhttpRequest) === 'function' ? GM_POLYFILLED.GM_xmlhttpRequest = false: window.GM_xmlhttpRequest = PF_GM_xmlhttpRequest;

			// details.synchronous is not supported as Tempermonkey
			function PF_GM_xmlhttpRequest(details) {
				const xhr = new XMLHttpRequest();

				// open request
				const openArgs = [details.method, details.url, true];
				if (details.user && details.password) {
					openArgs.push(details.user);
					openArgs.push(details.password);
				}
				xhr.open.apply(xhr, openArgs);

				// set headers
				if (details.headers) {
					for (const key of Object.keys(details.headers)) {
						xhr.setRequestHeader(key, details.headers[key]);
					}
				}
				details.cookie ? xhr.setRequestHeader('cookie', details.cookie) : function () {};
				details.anonymous ? xhr.setRequestHeader('cookie', '') : function () {};

				// properties
				xhr.timeout = details.timeout;
				xhr.responseType = details.responseType;
				details.overrideMimeType ? xhr.overrideMimeType(details.overrideMimeType) : function () {};

				// events
				xhr.onabort = details.onabort;
				xhr.onerror = details.onerror;
				xhr.onloadstart = details.onloadstart;
				xhr.onprogress = details.onprogress;
				xhr.onreadystatechange = details.onreadystatechange;
				xhr.ontimeout = details.ontimeout;
				xhr.onload = function (e) {
					const response = {
						readyState: xhr.readyState,
						status: xhr.status,
						statusText: xhr.statusText,
						responseHeaders: xhr.getAllResponseHeaders(),
						response: xhr.response
					};
					(details.responseType === '' || details.responseType === 'text') ? (response.responseText = xhr.responseText) : function () {};
					(details.responseType === '' || details.responseType === 'document') ? (response.responseXML = xhr.responseXML) : function () {};
					details.onload(response);
				}

				// send request
				details.data ? xhr.send(details.data) : xhr.send();

				return {
					abort: xhr.abort
				};
			}
		}

		// NOTE: options(arg2) is NOT SUPPORTED! if provided, then will just be skipped.
		function GM_openInTab_polyfill() {
			typeof (GM_openInTab) === 'function' ? GM_POLYFILLED.GM_openInTab = false: window.GM_openInTab = PF_GM_openInTab;

			function PF_GM_openInTab(url) {
				window.open(url);
			}
		}

		// NOTE: needs to be called in an event handler function, and info(arg2) is NOT SUPPORTED!
		function GM_setClipboard_polyfill() {
			typeof (GM_setClipboard) === 'function' ? GM_POLYFILLED.GM_setClipboard = false: window.GM_setClipboard = PF_GM_setClipboard;

			function PF_GM_setClipboard(text) {
				// Create a new textarea for copying
				const newInput = document.createElement('textarea');
				document.body.appendChild(newInput);
				newInput.value = text;
				newInput.select();
				document.execCommand('copy');
				document.body.removeChild(newInput);
			}
		}

		return GM_POLYFILLED;
	}

	// Polyfill GM_info
	function polyfill_GM_info(version='移动端适配版') {
		// Polyfill GM_info for this script
		if(typeof(GM_info) !== 'object') {
			window.GM_info = {
				script: {
					name: '轻小说文库+',
					version: version,
					author: 'PY-DNG'
				}
			}
		}
	}

	// Polyfill alert
	function polyfillAlert() {
		if (typeof(GM_POLYFILLED) !== 'object') {return false;}
		if (GM_POLYFILLED.GM_setValue) {
			new ElegantAlertBox(TEXT_ALT_POLYFILL);
		}
	}

	// Polyfill String.prototype.replaceAll
	// replaceValue does NOT support regexp match groups($1, $2, etc.)
	function polyfill_replaceAll() {
		String.prototype.replaceAll = String.prototype.replaceAll ? String.prototype.replaceAll : PF_replaceAll;

		function PF_replaceAll(searchValue, replaceValue) {
			const str = String(this);

			if (searchValue instanceof RegExp) {
				const global = RegExp(searchValue, 'g');
				if (/\$/.test(replaceValue)) {console.error('Error: Polyfilled String.protopype.replaceAll does support regexp groups');};
				return str.replace(global, replaceValue);
			} else {
				return str.split(searchValue).join(replaceValue);
			}
		}
	}

    // Append a style text to document(<head>) with a <style> element
    function addStyle(css) {
        document.head.appendChild(document.createElement("style")).textContent = css;
    }

    // Copy text to clipboard (needs to be called in an user event)
    function copyText(text) {
        // Create a new textarea for copying
        const newInput = document.createElement('textarea');
        document.body.appendChild(newInput);
        newInput.value = text;
        newInput.select();
        document.execCommand('copy');
        document.body.removeChild(newInput);
    }
})();