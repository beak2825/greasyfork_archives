console.log('Airflow log hightlight lib start')
try {

function l(message) {if (typeof console == 'object') {console.log(message)} else {GM_log(message)}}
(function word_hightlight(loaded){
 
	//if (window.top != window.self) return; //don't run on frames or iframes
 
	// check browser
	if (!loaded && window.opera && document.readyState == 'interactive') {
		document.addEventListener('DOMContentLoaded', function(){
			loaded = true;
			word_hightlight(true);
		}, false);
		window.addEventListener('load', function(){
			if (!loaded)
				word_hightlight(true);
		}, false);
		return;
	}
	if (document.contentType && !/html/i.test(document.contentType))
		return;
	// check api
	if (typeof GM_getValue == "function") {
		var getv = GM_getValue;
		var setv = GM_setValue;
	} else { // workaround functions, creadit to ww_start_t
		var setv = function(cookieName, cookieValue, lifeTime){
			if (!cookieName) {return;}
			if (lifeTime == "delete") {lifeTime = -10;} else {lifeTime = 31536000;}
			document.cookie = escape(cookieName)+ "=" + escape(getRecoverableString(cookieValue))+
				";expires=" + (new Date((new Date()).getTime() + (1000 * lifeTime))).toGMTString() + ";path=/";
		};
		var getv = function(cookieName, oDefault){
			var cookieJar = document.cookie.split("; ");
			for (var x = 0; x < cookieJar.length; x++ ) {
				var oneCookie = cookieJar[x].split("=");
				if (oneCookie[0] == escape(cookieName)) {
					try {
						eval('var footm = '+unescape(oneCookie[1]));
					} catch (e) {return oDefault;}
					return footm;
				}
			}
			return oDefault;
		};
	}
 
//{	values >
	var isOpera = !!this.opera,
		isFirefox = !!this.Components,
		isChromium = !!this.chromium,
		isSafari = this.getMatchedCSSRules && !isChromium;
 
	var STYLE_COLOR = ['#FFFF80','#99ccff','#ff99cc','#66cc66','#cc99ff','#ffcc66','#66aaaa','#dd9966','#aaaaaa','#dd6699'];
	var BORDER_COLOR = ['#aaaa20','#4477aa','#aa4477','#117711','#7744aa','#aa7711','#115555','#884411','#555555','#881144'];
	var STYLE_COLOR_2 = ['#FFFFa0','#bbeeff','#ffbbcc','#88ee88','#ccbbff','#ffee88','#88cccc','#ffbb88','#cccccc','#ffaabb'];
	var BORDER_COLOR_2 = ['#aaaa40','#6699aa','#aa6699','#339933','#9966aa','#aa9933','#337777','#aa6633','#777777','#aa3366'];
	var but_c = '#99cc99', but_ca = '#FFD000', but_cd = '#999999', but_cb = '#669966'; // button normal/active/disable background color/border color.
 
	// Initialize value
	var PRE = 'wordhighlight', ID_PRE = PRE + '_id', ST_PRE = PRE + '_store', PO_PRE = PRE + '_position', CO_PRE = PRE + '_config';
	var STYLE_CLASS = '0123456789'.split('').map(function(a,i){return PRE + '_word'+i;});
	var setuped = false;
	var highlight_off = false;
	var addKeyword = true;
	var keyword = "AnalysisException|ValueError|TypeError|ProgrammingError|JSONDecodeError|AnalysisException|NameError|IndentationError|KeyError|IndexError|AttributeError|FileNotFoundError|\
ConnectionError|HTTPError|Received SIGTERM|SyntaxError|OutOfMemory|Container killed by YARN for exceeding memory limits|Failed to get minimum memory|\
Permission denied|Memory limit exceeded|Could not resolve table reference|Could not resolve column/field reference|File does not exist|RemoteException|\
TExecuteStatementResp|object has no attribute|InternalError|NullPointerException|ConnectionError|Failed to close HDFS|cannot be null|IntegrityError|\
ArrayIndexOutOfBoundsException|has more columns|Unknown column|No such file or directory|Out Of Memory|RuntimeError|Traceback|AirflowTaskTimeout|\
Check 'stl_load_errors' system table for details|OperationalError|Lost connection to MySQL server during query|AirflowTaskTimeout|files cols number not match target file cols number, check it|\
Data too long for column|DataError|Initial job has not accepted any resources|/tmp/oneflow_|http://oneflow.yimian.com.cn/dag|num_dumped_rows|com.yimian.etl"
    var words = [], word_lists = [], word_inputs_list=[], layers, positions = [];
	var words_off = [];
	var xp_all = new $XE('descendant::span[starts-with(@name,"' + PRE + '_word")]', document.body);
	var keyCodeStr = {
		8:  'BAC',
		9:  'TAB',
		10: 'RET',
		13: 'RET',
		27: 'ESC',
		33: 'PageUp',
		34: 'PageDown',
		35: 'End',
		36: 'Home',
		37: 'Left',
		38: 'Up',
		39: 'Right',
		40: 'Down',
		45: 'Insert',
		46: 'Delete',
		112: 'F1',
		113: 'F2',
		114: 'F3',
		115: 'F4',
		116: 'F5',
		117: 'F6',
		118: 'F7',
		119: 'F8',
		120: 'F9',
		121: 'F10',
		122: 'F11',
		123: 'F12'
	};
	var whichStr = {
		32: 'SPC'
	};
	var htmlDoc = isChromium ? document.implementation.createHTMLDocument('hogehoge') : document;
	var highlight_reset = function(){};
	var canvas, cw, c2context, nav;
	var root = /BackCompat/i.test(document.compatMode) ? document.body : document.documentElement;
	var CanvasWidth = 150;
	var ratio = 1;
	var aside, section, td0, lock, edit, off, text_input, posi_tip, posi_tip_timer, inputBOX;  // panel elements
	var sheet, main_sheet, move_sheet, inst_sheet;  // style sheets
 
	//language detection
	var _L = 1;
	//var _L = (!!(navigator.userAgent.toLowerCase().indexOf('zh-') == -1))? 0:1;
	//if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1)
	//{_L = (!!(navigator.language.indexOf('zh-') == -1))? 0:1;} // Thanks to SoIN(http://userscripts.org/users/302257)
	var _ti = { // en/zh locale string for tooltip.
		edit: ['Edit current keywords','编辑现有关键词'],
		edit_a: ['Confirm editing keywords','确认编辑关键词'],
		off:  ['Toggle all keywords\' highlight','切换全部关键词的高亮'],
		td0:  ['Double-click to minimize the panel','双击最小化面板'],
		td0_a:  ['Double-click to restore EWH panel','双击恢复 EWH 面板'],
		lock: ['Lock current set of keywords','锁定当前的关键词组'],
		lock_a: ['Current locked keyword(s):','当前锁定的关键词组：'],
		lock_u: ['Function not supported by this browser','此浏览器不支持该功能'],
		close: ['Close Enhanced word highlight','关闭关键词高亮'],
		kwL:  ['Left click to the next; Right click to the previous','左击跳到下一个；右击跳到上一个'],
		check: [['Toggle highlight of "','"'],['切换“','”的高亮']],
		mapl:['Toggle highlight map locking status','切换高亮分布图的锁定状态'],
		ad_nw: ['Toggle add/new keywords for highlight','切换添加／取代关键词的高亮'],
		subm: ['Submit keywords','提交关键词'],
		clos: ['Close input box','关闭输入框']
	};
	var _di = { // en/zh locale string for dialog.
		update: [['There is an update available for the Greasemonkey script "','."\nWould you like to go to the install page now?','No update is available for "','."','An error occurred while checking for updates:\n',' - Manual Update Check'],
				['发现 GM 脚本“','”有更新，\n是否现在打开脚本发布页？','没找到“','”脚本的更新。','检查更新时出现了一个错误：\n',' - 手动检查更新']],
		confT:  ['Enhanced word highlight Advanced Config','Enhanced word highlight 高级设置'],
		conf:   [['What auto-pager tool do you mostly use?',
				'Turn off highlight of short keywords by default?',
				'Disable auto-highlight (auto-capture keywords for highlight) ?',
				'Sort keyword for more accurate highlight (Recommended, except for regular expression users)',
				'Save panel position',
				'Show indicator bar when navigating'],
				['你主要用那种自动翻页工具？',
				'是否默认停用短关键词的高亮？',
				'是否禁用自动高亮（自动抓取关键词来高亮）？',
				'排列关键词以更准确高亮（推荐；需要高亮正则表达式的用户除外）',
				'保存面板位置',
				'查找关键词时显示指示条']],
		confR:  [[['Autopagerize GM script','Autopager extension','Other (can handle all auto-pager tools but works slow)'],
				['Don\'t turn off','One-letter/digit word','One- and two-letter/digit word'],
				['Enable','Completely disable','Disable on pages opened from supported search results','Disable on supported search result pages']],
				[['Autopagerize GM 脚本','Autopager 扩展','其他（能应付任何自动翻页工具但运作较慢）'],
				['否','是；针对单个字母／数字','是，针对单／两个字母／数字'],
				['不禁用','完全禁用','仅在从支持的搜索结果中打开的页面上禁用','仅在支持的搜索结果页面上禁用']]]
	};
//}
 
	var urlArr = [], queryArr = [];
 
//{	Config I >
// #### Config I #### --------------------------{{
 
 
	// keybinds
	var KEY_NEXT = 'n';		// "n"			Next occurrence
	var KEY_PREV = 'b';		// "Shift-n"	Previous occurrence
	var KEY_SEARCH = 'M-/';	// "Alt-/"		Add keywords
	var KEY_OFF = 'M-,';	// "Alt-,"		Suspend highlight
	var KEY_CLOSE = 'C-M-/';	// "Ctrl-Alt-/"		Disable highlight
	var KEY_EDIT = 'M-.';	// "Alt-."		Edit highlight
	var KEY_REFRESH = 'r';	// "r"			Refresh highlight
 
	// delay of highlighting (ms)
	var delay = 500;
 
	// instant highlight selected keywords
	var instant = true;
 
	// restore focus and scroll position after closing keyword input box with shortcut key?
	// mainly useful for keyboard navigation, not recommend for mouse navigation.
	var refocus = false;
 
	// minimize the panel initially?
	var panel_hide = true;
 
// #### Config I #### --------------------------}}
//}
	if (window.top != window.self) panel_hide = true; //hide panel in iframes
 
//{	Config II >
// #### Config II #### --------------------------{{
	// What's your main auto-pager tool?
	// 0 - Autopagerize (GM script)
	// 1 - AuroPager (Firefox Extension)
	// 2 - Other (Other auto-pager scripts, site-specific scripts, bookmarklets, etc.)
	//<!> From top option to botom one, the compatibility of the script
	//	will be strengthened while the performance of highlight will be lower.
	var ap_option = 2;
 
	// turn off short keywords (one or two letters or number) by default?
	//	0-no, 1-one letter, 2-one or two letters
	var off_short_words = 1;
 
	// Stop auto-highlight on supported pages?
	// 0-no, 1-yes, 2-only those from search results, 3-only search results
	var no_auto_hili = 0;
 
	// sort keywords? 0-no, 1-yes
	//<!> Setting this to "yes" will produce better highlight result,
	//	while "no" will perform faster and support ReExp input better.
	var sort_keywords = 0;
 
	// save panel position?
	var save_panel_pos = false;
 
	// show indicator bar when navigating?
	var show_indc_bar = false;
 
 
 
	// GM APIs available?
	if (typeof GM_getValue == "function") var gm_ok = true;
	// Configs
	if (!gm_ok) {
 
 
		//
		var Ewh_configs = [ap_option, off_short_words, no_auto_hili, sort_keywords, save_panel_pos, show_indc_bar];
	} else {
		var Ewh_configs = GM_getValue(CO_PRE, '2|1|0|1|0|0').split('|');
	}
	for (i in Ewh_configs) {Ewh_configs[i] = Number(Ewh_configs[i]);}
	// Locked keywords
	if (gm_ok) var keyword_store = GM_getValue(ST_PRE);
	// Saved position
	var panel_pos_arr = ['right:-1px;','bottom:-1px;'];
	if (Ewh_configs[4] && gm_ok) panel_pos_arr = GM_getValue(PO_PRE, panel_pos_arr.join('|')).split('|');
	// Configs menuConnectionError
	if (gm_ok) window.addEventListener('load', function(){GM_registerMenuCommand(_di.confT[_L], config_box);}, false);
 
	if (gm_ok) {
		unsafeWindow.EWH_iSearch = function() {instant_search(false, null);};
		unsafeWindow.EWH_cClose = function() {command_close();};
	}
 
	// main process
	init_keyboard();
	if (load_keyword() !== false || init_keyword() !== false) {
		//window.addEventListener('load', go, false);
		setTimeout(go, delay);
	}
 
	// var oldurl = window.location.href;
	// window.addEventListener('DOMNodeInserted', function(e){ l(window.location.href);
		// if (window.location.href !== oldurl) {
			// if (load_keyword() !== false || init_keyword() !== false) {
 
				// setTimeout(go, delay*2);
			// }
		// }
	// }, false);
 
	function go(){
	setup();
 
 
 
	}
 
 
// Functions
 
	function highlight(doc, ext_word) {
		var _words = words.filter(function(w,i){return !words_off[i];});
		if (_words.length <= 0)
			return;
		var _index;
		if (ext_word && ext_word.words) {
			_words = ext_word.words;
			_index = ext_word.index;
		}
		var exd_words, xw;
		if (_words.length === 1 && _words[0].exp) {
			exd_words = _words.map(function(e){return e.exp;});
			xw = '';
		} else {
			exd_words = _words.map(function(w){return w.test ? w : new RegExp('(' + w.replace(/\W/g,'\\$&') + ')(?!##)', 'ig');});
			xw = ' and (' + _words.map(function(w){return ' contains(translate(self::text(),"abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ"),'+escapeXPathExpr(w.toUpperCase())+') ';}).join(' or ') + ') ';
		}
		$X('descendant::text()[string-length(normalize-space(self::text())) > 0 ' + xw +' and not(ancestor::textarea or ancestor::script or ancestor::style or ancestor::aside)]', doc).forEach(function(text_node) {
			var df, text = text_node.nodeValue, id_index = 0,
			parent = text_node.parentNode, range = document.createRange(), replace_strings = [],
			new_text = reduce(exd_words, function(text,ew,i) {
				var _i = _index || i;
				return text.replace(ew,function($0,$1) {
					replace_strings[id_index] = '<span id="' + ID_PRE + id_index + '" class="' + STYLE_CLASS[_i%10] + '" name="'+PRE+'_word'+_i+'">' + $1 + '</span>';
					return '##'+(id_index++)+'##';
				});
			}, text).
				replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').
				replace(/##(\d+)##/g, function($0,$1) {
				return replace_strings[$1] || '';
			});
			if (replace_strings.length) {
				try {
					if (isChromium) {
						range.selectNodeContents(htmlDoc.documentElement);
					} else {
						range.selectNode(text_node);
					}
					df = range.createContextualFragment(new_text);
					if (df.firstChild) parent.replaceChild(df, text_node);
					range.detach();
				} catch (e) {
					error(e);
				}
			}
		});
	}
 
	function addsheet() {
		if (!main_sheet) {
		var hilistyles = STYLE_COLOR.map(function(rgb,i){
			return 'span.' + PRE + '_word'+i+',.' + PRE + '_item'+i+'{background:'+rgb+'!important;}';
			});
		var borderstyles = BORDER_COLOR.map(function(rgb,i){
			return 'li.' + PRE + '_item'+i+'{outline:1px solid '+rgb+'!important;}';
			});
		sheet = addCSS([
			//Additional Style
			'span[class^="' + PRE + '_word"]{color:black!important;font:inherit!important;display:inline!important;margin:0!important;padding:0!important;text-align:inherit!important;float:none!important;position:static!important;}', //vertical-align:inherit !important;
			'#' + PRE + '_words, #' + PRE + '_words *{font-family: Arial ;}',
			'#' + PRE + '_words{line-height:1;position:fixed;z-index:60000;opacity:0.8;list-style-type:none;margin:0;padding:0;width:auto;max-width:100%;' + panel_pos_arr[0] + panel_pos_arr[1] +'}',
			'#' + PRE + '_words > section{clear:right;line-height:1;border:1px solid #666;/*border-left-width:10px;*/background:#fff;display:block;position:relative;}',
			'#' + PRE + '_words * {margin:0;padding:0;width:auto;height:auto;}',
			'#' + PRE + '_words:hover{opacity:1;}',
			'#' + PRE + '_words:hover > section{opacity:1;border-color:#333;}',
			'#' + PRE + '_words #_ewh_handle{background:#666;width:10px;cursor:move;}',
			'#' + PRE + '_words:hover #_ewh_handle{background:#333;}',
			'#' + PRE + '_words.ewh_hide #_ewh_handle{cursor:pointer;}',
//			'#' + PRE + '_words.ewh_hide:hover #_ewh_handle{width:10px;}',
//			'#' + PRE + '_words.ewh_hide > section form.' + PRE + '_ctrl > input.c_b{display:none;}',
			'#' + PRE + '_words > nav{display:none;width:100%;padding:3px;position:relative;}',
			'#' + PRE + '_words > nav > canvas.backport{background:rgba(0,0,0,0.5);cursor:pointer;position:absolute;right:6px;z-index:3;}',
			'#' + PRE + '_words > nav > canvas.viewport{background:rgba(79,168,255,0.7);cursor:default;position:absolute;bottom:0px;right:6px;}',//outline:6px solid rgba(79,168,255,0.7);
//			'#' + PRE + '_words > nav:hover > canvas.backport{background:rgba(0,0,0,0.5);}',
			'#' + PRE + '_words:hover > nav{display:block;}',
			'#' + PRE + '_words > nav._locked{display:block;}',
			'#' + PRE + '_words:hover > nav > canvas.backport{bottom:0px;}',
			'#' + PRE + '_words > nav._locked > canvas.backport{bottom:0px;}',
			'#' + PRE + '_words.ewh_edit{opacity:1;}',
			'#' + PRE + '_words.ewh_edit #' + PRE + '_word_inputs_list{display:none;}',
			'#' + PRE + '_words form.' + PRE + '_editor{display:none;}',
			'#' + PRE + '_words.ewh_edit form.' + PRE + '_editor{display:inline-block;}',
			'#' + PRE + '_words.ewh_edit form.' + PRE + '_editor input{min-width:80px;}',
			'#' + PRE + '_words li{display:inline-block;margin:0.1em 0.2em;line-height:1.3em;font-size:medium;}',
			'#' + PRE + '_words > section > * {vertical-align:middle;}',
			'#' + PRE + '_words > section td {border:none;}',
			'#' + PRE + '_words > section > h3.' + PRE + '_title{display:inline-block;background:#333;color:#fff;padding:0.1em 0.3em;border:none;margin:0 0.2em;}',
			'#' + PRE + '_words > section  form.' + PRE + '_ctrl{display:inline-block;}',
			'#' + PRE + '_words > section  form.' + PRE + '_ctrl > input{display:inline;width:1.3em;margin:0.1em 0.1em;background:'+ but_c +';border:1px solid '+ but_cb +';cursor:pointer;font-size:10pt;color:black;}',
			'#' + PRE + '_words > section  form.' + PRE + '_ctrl > input._active{background:'+ but_ca +';}',
			'#' + PRE + '_words > section  form.' + PRE + '_ctrl > input._disable{background:'+ but_cd +' !important;cursor:default;}',
			'#' + PRE + '_words > section  form.' + PRE + '_ctrl > input:hover{outline:1px solid '+ but_cb +'!important;}',
			'#' + PRE + '_word_inputs_list {padding:0!important;margin:0.2em!important;display:inline-block;border:none!important;}',
			'#' + PRE + '_word_inputs_list > li{position:relative;padding:0 4px;}',
			'#' + PRE + '_word_inputs_list > li.ewh_disable{background:white!important;outline:1px solid #999!important;}',
			'#' + PRE + '_word_inputs_list > li > label{cursor:pointer;color:black!important;}',
			'#' + PRE + '_word_inputs_list > li > input{cursor:pointer;}',
//			'#' + PRE + '_word_inputs_list > li > label > input[type=image]{vertical-align:top;padding:0;height:12px;}',
			'#' + PRE + '_word_inputs_list > li > input[type=checkbox]{display:none;position:absolute;right:0px;top:0px;opacity:0.7;}',
			'#' + PRE + '_word_inputs_list > li:hover{outline-width:2px!important;}',
			'#' + PRE + '_word_inputs_list > li:hover > input[type=checkbox]{display:block;}',
			'#' + PRE + '_word_inputs_list > li > input[type=checkbox]:hover{opacity:1;}',
			'#' + PRE + '_words > section td+td+td > input {display:inline;width:1.3em;margin:0.1em 0.1em;background:#FAFAFA;border:1px solid #aaaaaa;cursor:pointer;font-size:10pt;color:black;}',
		].concat(hilistyles, borderstyles).join('\n'));
		main_sheet = true;
		}
		if (!move_sheet) addmovesheet()
	}
 
	function addmovesheet() {
		addCSS('.wordhighlight_em{outline:4px solid #FF7B00;-webkit-outline:4px solid #FF7B00;text-decoration:blink;}');
		move_sheet = true;
	}
 
	function setup(init) {
		setuped = true;
		addsheet();
 
	// build ui
		aside = creaElemIn('aside', document.body);
			aside.id = PRE + '_words';
		section = creaElemIn('section', aside);
		var table_COL = creaElemIn('table', section);
			table_COL.setAttribute('style', 'border:0;margin:0;padding:0;border-spacing:2px;border-collapse:separate!important;');
			table_COL.setAttribute('cellspacing', '0');
			table_COL.setAttribute('cellpadding', '0');
		var tbdy_COL = creaElemIn('tbody', table_COL);
		var tr_COL = creaElemIn('tr', tbdy_COL);
		td0 = creaElemIn('td', tr_COL);
			td0.id = '_ewh_handle';
			td0.title = _ti.td0[_L];
		var td1 = creaElemIn('td', tr_COL);
			td1.setAttribute('style', 'border-right: 1px solid black; padding:0.2em 0.3em 0 0;vertical-align:top;');//width:7.2em;
		var td2 = creaElemIn('td', tr_COL);
		var td3 = creaElemIn('td', tr_COL);
		var editor = creaElemIn('form', td2);
			editor.className = PRE + '_editor';
		text_input = creaElemIn('input', editor);
			text_input.type = 'text';
		var ctrl = creaElemIn('form', td1);
			ctrl.className = PRE + '_ctrl';
		var close_button = creaElemIn('input', ctrl);
			close_button.type = 'button';
			close_button.className = 'c_b';
			close_button.value = 'X';
			close_button.title = _ti.close[_L];
		off = creaElemIn('input', ctrl);
			off.type = 'button';
			off.value = 'O';
			off.title = _ti.off[_L];
		lock = creaElemIn('input', ctrl);
			lock.type = 'button';
			lock.value = 'L';
		edit = creaElemIn('input', ctrl);
			edit.type = 'button';
			edit.value = 'E';
			edit.title = _ti.edit[_L];
		word_inputs_list = creaElemIn('ul', td2);
			word_inputs_list.id = PRE + '_word_inputs_list';
			word_inputs_list.className = PRE + '_inputs';
		var maplock = creaElemIn('input', td3);
			maplock.type = 'button';
			maplock.value = '<';
			maplock.title = _ti.mapl[_L];
 
	// add interactivity
		edit.addEventListener('click',command_edit,false);
		off.addEventListener('click',command_off,false);
		close_button.addEventListener('click',command_close,false);
		editor.addEventListener('submit',function(e){
				command_edit();
				e.preventDefault();
			},false);
		if (gm_ok) {
			lock.title = _ti.lock[_L];
			lock.className = (keyword_store)? '_active' : '';
			lock.addEventListener('click',function(){
				if (aside.className == 'ewh_edit') return;
				if (keyword_store) {
					lock.className = '';
					lock.title = _ti.lock[_L];
					GM_setValue(ST_PRE, '');
					keyword_store = '';
	//				lock.value = 'Lock: Off';
				} else {
					lock.className = '_active';
					lock.title = _ti.lock_a[_L] + ' ' + keyword;
					GM_setValue(ST_PRE, keyword);
					keyword_store = keyword;
	//				lock.value = 'Lock: On';
				}
			},false);
		} else {
			lock.title = _ti.lock_u[_L];
			lock.className = '_disable';
		}
        /* 展开右下角的画布
		td0.addEventListener('dblclick',function(evt){//l(panel_hide,window.innerWidth - aside.offsetLeft,1);
				if (panel_hide)	{//l('O');
					aside.style.right = '0px';
					aside.className = '';
					panel_hide = false; //默认隐藏
					this.title = _ti.td0[_L];
				}else{//l(panel_hide);
					aside.style.right = (14 - aside.offsetWidth) +'px';
					aside.className = 'ewh_hide';
					panel_hide = true;//l(panel_hide,3);
					this.title = _ti.td0_a[_L];
				}
			}, false);*/
		maplock.addEventListener('click',function(){
				if(!nav.className) {nav.className = '_locked'; this.value = '>';}
				else {nav.className = ''; this.value = '<';}
			},false);
 
	// build map
		nav = document.createElement('nav');
		aside.insertBefore(nav,aside.firstChild);
		canvas = creaElemIn('canvas', nav);
			canvas.className='backport';
		cw = creaElemIn('canvas', nav);
			cw.className='viewport';
		var c2 = c2context = canvas.getContext('2d');
 
	// /+drag codes by grea
		// scrolling per events
		this.perf = 2, this.perfic = 0;
		this.moveTo = function(evt){
			if (perfic++ % perf || !window.drgg) return;
			var x = (evt.offsetX || evt.layerX)/ratio - root.clientWidth/2;
			var y = (evt.offsetY || evt.layerY)/ratio - root.clientHeight/2;
			window.scrollTo(x, y);
		}
		with(canvas){
			addEventListener('mousedown', function(e){ window.drgg = true; moveTo(e); },false);
			addEventListener('mousemove', function(e){ moveTo(e); },false);
			addEventListener('mouseup', function(e){ window.drgg = false; moveTo(e); },false);
			addEventListener('mouseout', function(e){ window.drgg = false; moveTo(e); },false);
		}
	// +/codes end
 
	// add AutoPager page change detector
		if (Ewh_configs[0]) {
			this.pagef = 5, this.pagefic = 0;
			var docHeight = document.body.scrollHeight, pageChanged;
			this.checkpage = function(){
				if ((pagefic++ % pagef == 0) && (document.body.scrollHeight > docHeight)) {
					switch (Ewh_configs[0]) {
					case 1:
						after_load();
						break;
					case 2:
						resetup();
						break;
					}
					docHeight = document.body.scrollHeight;
				}
			}
		}
 
	// sync with map & check page
		window.addEventListener('scroll',function(){
			var x = window.pageXOffset * ratio;
			var y = window.pageYOffset * ratio;
			cw.style.bottom = (canvas.height - cw.height - y) + 'px';
			cw.style.right = (-x + 6) + 'px';
			if (Ewh_configs[0]) checkpage();
		},false);
 
	// go to highlight
		highlight(document.body);
		word_lists = create_inputlist(words);
		layers = xp_all.get();
		draw_wordmap();
		if (!Ewh_configs[0]) init_autopager();
		if (panel_hide && !init){
			aside.style.right = (14 - aside.offsetWidth) +'px';
			aside.className = 'ewh_hide';
			td0.title = _ti.td0_a[_L];
		}
	}
 
	function restore_words(words) {
		(words||xp_all.get()).forEach(function(layer,i){
			var parent = layer.parentNode;
			while (layer.firstChild){
				parent.insertBefore(layer.firstChild, layer);
			}
			parent.removeChild(layer);
		});
	}
 
	function draw_wordmap() {
		var c2 = c2context;
		var _height = root.clientHeight * 0.7;
		if (_height > CanvasWidth * (root.scrollHeight/root.scrollWidth)) {
			canvas.width = CanvasWidth;
			canvas.height = CanvasWidth * (root.scrollHeight/root.scrollWidth);
			ratio = CanvasWidth / root.scrollWidth;
		} else {
			canvas.height = _height;
			canvas.width = _height * (root.scrollWidth/root.scrollHeight);
			ratio = _height / root.scrollHeight;
		}
		cw.width  = root.clientWidth  * ratio;
		cw.height = root.clientHeight * ratio;
		cw.style.bottom = (canvas.height - cw.height - window.pageYOffset * ratio)+'px';
		c2.clearRect(0,0,window.innerWidth,window.innerHeight);
		c2.beginPath();
		word_lists.forEach(function(item,i){
			if(!words_off[i]) {
			c2.fillStyle = STYLE_COLOR[i%10];
			item.get_w().forEach(function(ly,j){
				var recs = ly.getClientRects();
				for (var i = 0, l = recs.length;i < l;++i){
					var rec = recs[i];
					var x = Math.max(ratio*(root.scrollLeft + rec.left), 2);
					var y = Math.max(ratio*(root.scrollTop  + rec.top), 2);
					var width  = Math.max(ratio*(rec.width ||(rec.right-rec.left)), 2);
					var height = Math.max(ratio*(rec.height||(rec.bottom-rec.top)), 2);
					c2.fillRect(x, y, width, height);
				}
			});
			}
		});
		c2.fill();
	}
 
	function add_word(word) {
		word_tmp = init_words(word);
		var word_tmp_len = word_tmp.length, words_len = words.length;
		for (var m=0;m<word_tmp_len;m++) {
			var word_m = word_tmp[m];
			highlight(document.body,{words:[word_m],index:(words_len - word_tmp_len + m)});
			word_lists.push.apply(word_lists,create_inputlist([word_m], words_len - word_tmp_len + m));
		}
		layers = xp_all.get();
		draw_wordmap();
	}
 
	function resetup() {
		//if (!setuped) {go(); return;}
		restore_words();
		word_lists.forEach(function(item){item.item.parentNode.removeChild(item.item);});
		highlight(document.body);
		layers = xp_all.get();
		word_lists = create_inputlist(words);
		draw_wordmap();
	}
 
	function move(node) {
		if (!node) return;
		if (Ewh_configs[5]) var _em_bar;
		if (node.className.indexOf(' wordhighlight_em') == -1) node.className += ' wordhighlight_em';
		if (node.getBoundingClientRect) {
			var pos = node.getBoundingClientRect();
			var pos_h = node.offsetHeight;
			document.documentElement.scrollTop = document.body.scrollTop =
				pos.top + window.pageYOffset - window.innerHeight/2 + pos_h;
			if (Ewh_configs[5]) {
				var pos_t = getY(node);
				_em_bar = creaElemIn('div', document.body);
				_em_bar.setAttribute('style', 'background:rgba(29,163,63,.3);position:absolute;width:100%;height:' + pos_h + 'px;top:' + pos_t + 'px;');
			}
		} else {
			node.scrollIntoView();
		}
		var move_timer = setTimeout(function(){
			node.className = node.className.replace(' wordhighlight_em','');
			if (_em_bar) document.body.removeChild(_em_bar);
		},3000);
	}
 
	function create_inputlist(words, start) {
		positions[0] = -1;
		return words.map(function(w, i){
			var _i = i + (start||0);
			var li = creaElemIn('li', word_inputs_list);
				li.className = PRE + '_item' + _i%10;
			var label = creaElemIn('label', li);
 
			(!Ewh_configs[3] && positions[_i+1]) || (positions[_i+1] = -1);
 
			var xp = new $XE('descendant::span[@name="' + PRE + '_word' + _i +'"]', document.body);
			var xp_count = new $XE('count(descendant::span[@name="' + PRE + '_word' + _i +'"])', document.body);
 
			label.addEventListener('click',function(){
					if (words_off[_i]) return;
					var layers = xp.get();
					next(_i+1,layers);
				},false);
			label.addEventListener('contextmenu',function(evt){
					evt.preventDefault(); //prevent activating context menu
					evt.stopPropagation();
					if (words_off[_i]) return;
					var layers = xp.get();
					prev(_i+1,layers);
				},false);
			label.addEventListener('DOMMouseScroll', function(evt){
					evt.preventDefault();
					if (words_off[_i]) return;
					var layers = xp.get();
					ct = (-evt.detail);
					ct < 0 ? next(_i+1,layers) : prev(_i+1,layers);
					return false; //?
				}, false);
 
			label.className = PRE + '_label' + _i % 10;
			label.title = _ti.kwL[_L];
			label.textContent = w + ' (' + xp_count.get({result_type:XPathResult.NUMBER_TYPE}).numberValue + ')';
 
			var check = creaElemIn('input', li);
				check.type = 'checkbox';
 
			if (words_off[_i]) {
				check.checked = false;
				li.className += ' ewh_disable';
			}
			else check.checked = true;
 
			check.title = _ti.check[_L][0] + w + _ti.check[_L][1];
			var _id = check.id = ID_PRE + '_check' + _i;
 
			var list = {item:li,word:w,label:label,check:check,get_count:xp_count.get,get_w:xp.get};
 
			check.addEventListener('change', function(){
				if (check.checked) {
					words_off[_i] = false;
					highlight(document.body,{words:[w],index:_i});
					after_load(null, _i);
					this.parentNode.className = this.parentNode.className.replace(' ewh_disable', '');
				} else {
					words_off[_i] = true;
					restore_words(xp.get());
					draw_wordmap();
					this.parentNode.className += ' ewh_disable';
				}
				},false);
			return list;
		});
	}
 
	function endrag(element,opt) {
		var p_x, p_y, isDragging;
		endrag = function(element,opt){
			return new endrag.proto(element,opt||{});
		}
		endrag.proto = function(elem,opt){
			var self = this;
			this.element = elem;
			this.style = elem.style;
			var _x = opt.x !== 'right';
			var _y = opt.y !== 'bottom';
			this.x = _x ? 'left' : 'right';
			this.y = _y ? 'top' : 'bottom';
				p_x = this.x;
				p_y = this.y;
			this.xd = _x ? -1 : 1;
			this.yd = _y ? -1 : 1;
			this.computed_style = document.defaultView.getComputedStyle(elem, '');
			this.drag_begin = function(e){self.__drag_begin(e);};
			td0.addEventListener('mousedown', this.drag_begin, false); //only drag on handler
			this.dragging = function(e){self.__dragging(e);};
			document.addEventListener('mousemove', this.dragging, false);
			this.drag_end = function(e){
					if (Ewh_configs[4] && isDragging && elem.style[p_x] && gm_ok) {
						var h_pos = p_x + ':' + elem.style[p_x] + ';';
						var v_pos = p_y + ':' + elem.style[p_y] + ';';
						GM_setValue(PO_PRE, h_pos + '|' + v_pos);
					}
					// if (panel_hide && isDragging && ((window.innerWidth - aside.offsetLeft) > 14)){
						// section.className = '';
						// panel_hide = false;
					// }
					self.__drag_end(e);
				};
			document.addEventListener('mouseup', this.drag_end, false);
		};
		endrag.proto.prototype = {
			__drag_begin:function(e){
				if (e.button == 0) {
				var _c = this.computed_style;
				this.isDragging = isDragging = true;
				this.position = {
					_x:parseFloat(_c[this.x]),
					_y:parseFloat(_c[this.y]),
					x:e.pageX,
					y:e.pageY
				};
				e.preventDefault();
				}
			},
			__dragging:function(e){
				if (!this.isDragging) return;
				var x = Math.floor(e.pageX), y = Math.floor(e.pageY), p = this.position;
				// prevent moving out of window
				var x_border = window.innerWidth - 40, y_border = window.innerHeight - 20;
				if (x - window.pageXOffset > x_border) x = window.pageXOffset + x_border;
				if (y - window.pageYOffset > y_border) y = window.pageYOffset + y_border;
				p._x = p._x + (p.x - x) * this.xd;
				p._y = p._y + (p.y - y) * this.yd;
				this.style[this.x] = p._x + 'px';
				this.style[this.y] = p._y + 'px';
				p.x = x;
				p.y = y;
			},
			__drag_end:function(e){
				if (e.button == 0) {
				if (this.isDragging)
					this.isDragging = isDragging = false;
				}
			},
			hook:function(method,func){
				if (typeof this[method] === 'function') {
					var o = this[method];
					this[method] = function(){
						if (func.apply(this,arguments) === false)
							return;
						o.apply(this,arguments);
					};
				}
			}
		};
		return endrag(element,opt);
	}
 
	function load_keyword() {
		if (keyword_store) {
			keyword = keyword_store;
			prep_keyword();
			return true;
		}else {
			return false;
		}
	}
 
	function init_keyword() {
		if (Ewh_configs[2] == 1) return false;
		var name = window.name;
		var host = location.host, q = document.location.search.slice(1), e = -1;
		if (Ewh_configs[2] == 2 || name == (PRE + '::CLOSED::')) var _no_refer = true;
 
		if (Ewh_configs[2] != 3) init_KW_SR(); 				//l(101,keyword);
		if (!keyword) init_KW_IH(); 							//l(102,keyword);
		if (!_no_refer && !keyword) init_KW_RF();				//l(103,keyword);
		if (Ewh_configs[2] != 3 && !keyword) init_KW_SRo();	//l(104,keyword);
 
		keyword = trim(keyword);
 
		if (keyword) {
			window.name = PRE + '::' + encodeURIComponent(keyword);
			prep_keyword();//l(104,keyword);
			return true;
		} else {
			return false;
		}
	}
 
	function init_KW_SR() {	//for Search Results
		var host = location.host, q = document.location.search.slice(1), e = -1;
		for (i = 0; i < urlArr.length; i++) {
			if (host.indexOf(urlArr[i][2]) != -1 && q.indexOf(urlArr[i][1]) != -1) e = i;//l(e);
		}
		if (e >= 0) {
			keyword = get_KW_from_URL(q, e);//l(keyword);
		}
	}
 
	function init_KW_SRo() {	//for other search result pages
		var locationhref = escape(document.location.href);
		for (var z = 0; z < queryArr.length; z++) {
			var input_query = document.getElementById(queryArr[z][0]);
			if (!input_query || locationhref.indexOf(queryArr[z][1]) == -1) continue;
			if (input_query.tagName.toLowerCase() == "input") keyword = clean(input_query.value);
			if (keyword) break;
		}
	}
 
	function init_KW_RF() {	//for Pages from Results
		var host = location.host, ref = document.referrer, e = -1;
		for (i = 0; i < urlArr.length; i++) {
			if (Ewh_configs[2] == 3 && host.indexOf(urlArr[i][2]) != -1) return;
			if (ref.indexOf(urlArr[i][2]) != -1 && ref.indexOf(urlArr[i][1]) != -1) e = i;//l(e);
		}
		if (e >= 0) {
			var _a = document.createElement('a');
			_a.href = ref;
			var q = _a.search.slice(1);
			keyword = get_KW_from_URL(q, e);//l(keyword);
		}
	}
 
	function init_KW_IH() {	//look for keywords in name
		if (name.indexOf(PRE) == 0 && name != (PRE + '::CLOSED::')) {
			keyword = (new RegExp(PRE + '\\d*::(.+)').exec(decodeURIComponent(window.name))[1]) || '';
		}
	}
 
	function get_KW_from_URL(urlsearch, _e) {
		if (urlArr[_e][0] =='Google' && urlsearch.indexOf('&url=') != -1) urlsearch = urlsearch.replace(/%25/g,'%');  // if it is from Google's redirect link
		var qspairs = urlsearch.split('&'), kwtmp;
		for (k = 0; k < qspairs.length; k++) {
			if (qspairs[k].indexOf(urlArr[_e][1]) == 0) {KW = qspairs[k].substring(urlArr[_e][1].length).replace(/\+/g,' '); break;}
		}//l(KW);
		/*else*/ kwtmp = decodeURIComponent(KW);
		return clean(kwtmp);
	}
 
	function prep_keyword() {
		words = init_words(keyword);
	}
 
	function trim(str) {
		return str.replace(/[\n\r]+/g,' ').replace(/^\s+|\s+$/g,'').replace(/\.+\s|\.+$/g,'');
	}
 
	function clean(str) {
		return str.replace(/(?:(?:\s?(?:site|(?:all)?in(?:url|title|anchor|text)):|(?:\s|^)-)\S*|(\s)(?:OR|AND)\s|[()])/g,'$1');
	}
 
	function uniq(arr) {
		var a = [], o = {}, i, v, len = arr.length;
		if (len < 2) {return arr;}
		for (i = 0; i < len; i++) {
			v = arr[i];
			if (o[v] !== 1) {
				a.push(v);
				o[v] = 1;
			}
		}
		return a;
	};
 
	function word_length_Comp(a,b) {
		return (b.length - a.length);
	};
 
	function init_words(word) {
		var erg = word.match(new RegExp("^ ?/(.+)/([gim]+)?$"));
		if (erg) {
			var ew = erg[1], flag = erg[2] || '';
			var word_s = [{exp:new RegExp('(' + ew + ')(?!##)', flag), text:ew, toString:function(){return ew;}}];
		} else if (word) {
			var ret=[], eword = word.replace(/"([^"]+)"/g,function($0,$1){$1 && ret.push($1);return '';});
			var word_s = eword.split(/[\+\|#]/).filter(function(w){return !!w;}).concat(ret);
			word_s = (Ewh_configs[3])? uniq(word_s).sort(word_length_Comp) : uniq(word_s);
			if (Ewh_configs[1]) {
				for (var i in word_s) {
					if (/^[a-z0-9]$/i.test(word_s[i]) || (Ewh_configs[1] == 2 && /^[a-z0-9]{2}$/i.test(word_s[i])))
						words_off[i] = true;
					else words_off[i] = false;
				}
			}
		}//l(word_s[0].exp);
		return word_s;
	}
 
	function init_minibuffer() {
		if (window.Minibuffer)
			document.removeEventListener('keypress', keyhandler, false);
		var mini = window.Minibuffer;
		mini.addCommand({
			name: 'keyword-search',
			command: function(stdin){
				keyword += ' ' + this.args.join(' ');
				keyword = trim(keyword);
				prep_keyword();
				if (setuped) resetup();
				else setup();
				return stdin;
			}
		});
		mini.addShortcutkey({
			key:KEY_NEXT,
			command:next,
			description: 'emphasis next keyword'
		});
		mini.addShortcutkey({
			key:KEY_PREV,
			command:prev,
			description: 'emphasis prev keyword'
		});
		mini.addShortcutkey({
			key:KEY_SEARCH,
			command:function(e){
				instant_search();
			},
			description: 'emphasis prev keyword'
		});
	}
 
	function next(index,_layers) {
		_layers || (_layers = (layers || (layers = xp_all.get()) ));
		index || (index = 0);
		move(_layers[++positions[index]] || (positions[index] = 0, _layers[positions[index]]));
		position_box(index);
	}
 
	function prev(index,_layers) {
		_layers || (_layers = (layers || (layers = xp_all.get()) ));
		index || (index = 0);
		move(_layers[--positions[index]] || (positions[index] = _layers.length - 1, _layers[positions[index]]));
		position_box(index);
	}
 
	function position_box(index) {
		if (!posi_tip) {
			posi_tip = creaElemIn('div', section);
			posi_tip.setAttribute('style', 'background:white;color:black;border:1px solid black;text-align:center;position:absolute;left:30px;z-index:1025;font-size:16px;height:20px;top:-20px;width:40px;-moz-box-shadow:0 2px 4px #444444;-Webkit-box-shadow:0 2px 4px #444444;');
		}
		clearTimeout(posi_tip_timer);
		posi_tip.style.display = 'block';
		posi_tip.innerHTML = positions[index]+1;
		if (index == 0) posi_tip.style.left = '30px';
		else posi_tip.style.left = (word_lists[index-1].item.offsetLeft + (word_lists[index-1].item.clientWidth - 40)/2) + 'px';
		posi_tip_timer = setTimeout(function(){posi_tip.style.display = 'none';},3000);
 
	}
 
	function init_keyboard() {
		if (isOpera) {
		} else if (window.Minibuffer) {
			init_minibuffer();
			return;
		} else {
			window.addEventListener('GM_MinibufferLoaded', init_minibuffer, false);
		}
		if (!window.chromium) {
			document.addEventListener('keypress', keyhandler, false);
		} else {
			document.addEventListener('keydown', keyhandler, false);
		}
	}
 
	function get_key(evt) {
		var key = String.fromCharCode(evt.which),
		ctrl = evt.ctrlKey ? 'C-' : '',
		meta = (evt.metaKey || evt.altKey) ? 'M-' : '';
		if (!evt.shiftKey){
			key = key.toLowerCase();
		}
		if (evt.ctrlKey && evt.which >= 186 && evt.which < 192) {
			key = String.fromCharCode(evt.which - 144);
		}
		if (evt.keyIdentifier && evt.keyIdentifier !== 'Enter' && !/^U\+/.test(evt.keyIdentifier) ) {
			key = evt.keyIdentifier;
		} else if ( evt.which !== evt.keyCode ) {
			key = keyCodeStr[evt.keyCode] || whichStr[evt.which] || key;
		} else if (evt.which <= 32) {
			key = keyCodeStr[evt.keyCode] || whichStr[evt.which];
		}
		return ctrl+meta+key;
	}
 
	function keyhandler(evt) {
		if (evt.target.id == PRE + '_textinput') var _r = true;
		else if (/^(?:input|textarea)$/i.test(evt.target.localName)) return;
		var fullkey = get_key(evt);
		if (setuped){
			switch (fullkey) {
			case KEY_NEXT:
				next();
				break;
			case KEY_PREV:
				prev();
				break;
			case KEY_OFF:
				command_off();
				break;
			case KEY_CLOSE:
				command_close();
				break;
			case KEY_EDIT:
				command_edit();
				break;
			case KEY_REFRESH:
				resetup();
				break;
			}
		}
		switch (fullkey) {
		case KEY_SEARCH:
			evt.preventDefault();
			evt.stopPropagation();
			instant_search(_r, evt.target);
			break;
		}
	}
 
	function command_close() {
		document.body.removeChild(aside);
		if (document.getElementById(PRE + '_textinputbox')) document.body.removeChild(inputBOX);
		instant_search.input = null;
		restore_words();
		// sheet.disable = true;
		if (addCSS.__style.parentNode) addCSS.__root.removeChild(addCSS.__style);
		window.name = PRE + '::CLOSED::';
		word_lists = [];
		// _words = [];
		setuped = false;
		highlight_reset();
	}
 
	function command_off() {
		if (aside.className == 'ewh_edit') return;
 
		if (!highlight_off) {
			restore_words();
			for (i in word_lists) {
				word_lists[i].check.checked = false;
				word_lists[i].item.className += ' ewh_disable'
			}
			off.className = '_active'
			highlight_off = true;
		} else {
			word_lists = [];
			word_inputs_list.innerHTML = '';
			resetup();
			for (i in word_lists) {
				word_lists[i].check.checked = true;
				word_lists[i].item.className = word_lists[i].item.className.replace(' ewh_disable', '');
			}
			off.className = '';
			highlight_off = false;
		}
		draw_wordmap();
	}
 
	function command_edit() {
		if (aside.className == 'ewh_edit') {
//			aside.style.width = 'auto';
//			edit.value = 'Edit';
			edit.className = '';
			edit.title = _ti.edit[_L];
			if (gm_ok) lock.className = lock.className.replace(' _disable','');
			off.className = '';
			highlight_off = false;
			aside.className = '';
			keyword = trim(text_input.value);
			prep_keyword();
			window.name = PRE + '::' + encodeURIComponent(keyword);
			resetup();
		} else {
			var _aside_w = aside.offsetWidth;
//			edit.value = 'Set';
			edit.className = '_active';
			edit.title = _ti.edit_a[_L];
			if (gm_ok) lock.className += ' _disable';
			off.className += ' _disable';
			aside.className = 'ewh_edit';
			text_input.value = keyword;
			text_input.focus();
			var t_width = (Math.max(320,_aside_w) - 135) +'px';
			text_input.style = 'width:'+t_width+';height:22px;margin:2px 0;font-size:15px;';
//			aside.style.width = Math.max(320,_aside_w) +'px';
		}
	}
 
	function instant_search(_r, e_target) {
		var input_cancel = function(){
			if (refocus) {
				var top = document.body.scrollTop || document.documentElement.scrollTop;
				var left = document.body.scrollLeft || document.documentElement.scrollLeft;
			}
			document.body.removeChild(inputBOX);
			instant_search.input = null;
			if (refocus && e_target) {
				e_target.focus();
				document.body.scrollTop = document.documentElement.scrollTop = top;
				document.body.scrollLeft = document.documentElement.scrollLeft = left;
			}
		};
		var input_position = function(){
			inputBOX.style.bottom = '30px' ;//window.innerHeight - aside.offsetTop + 4 + 'px';
		}
		var input_comfirm = function(text, bAdd){
			if (!text && setuped) return;
			if (bAdd) {
				keyword = trim(((setuped)?keyword:'') + ' ' + text);
				prep_keyword();
				if (setuped) {
					if (Ewh_configs[3]) resetup();
					else add_word(text);
				}
				else setup(true);
			} else {
				keyword = trim(text);
				prep_keyword();
				if (setuped) {
					resetup();
				}
				else setup(true);
			}
			window.name = PRE + '::' + encodeURIComponent(keyword);
			if (instant_search.input) {input_position(); instant_search.input.select();}
		};
 
		if (_r) {input_cancel(); return;}
 
		var selectedText = getSelection();
		if (instant && selectedText.toString()) {
			input_comfirm(selectedText.toString(), true);
			return;
		}
		if (instant_search.input) {
			(instant_search.input.value = selectedText) && instant_search.input.select();
			// instant_search.input.focus();
			return;
		}
 
		if (!inst_sheet) {
		addCSS([
			'#' + PRE + '_textinputbox input[type=button]{padding:0;display:inline;margin:0.1em 0.2em;background:'+ but_c +';border:1px solid #996666;cursor:pointer;font-size:12pt;color:black;}',
			'#' + PRE + '_textinputbox label{padding:0;display:inline;}',
			'#' + PRE + '_textinputbox{border:1px solid #333;margin:0px;padding:0px;position:fixed;bottom:34px;left:5%;z-index:1023;background:#fff;-moz-box-shadow: #333 3px 3px 2px;color:#000;-Webkit-box-shadow: #333 3px 3px 2px;color:#000;font-weight:bold;max-width:70%;font-size:16pt;height:auto;opacity:0.95;}',
			'#' + PRE + '_textinputbox,#' + PRE + '_textinputbox *{font-family: Arial;}',
			'#' + PRE + '_textinput{border:none;margin:0 0 0 5px;padding:0px;max-width:80%;height:100%;background:#fff;color:#000;font-weight:bold;font-size:inherit;}'
		].join('\n'));
		inst_sheet = true;
		}
		if (!move_sheet) addmovesheet();
 
		inputBOX = creaElemIn('div', document.body);
			inputBOX.id = PRE + '_textinputbox';
			inputBOX.setAttribute('class', PRE + '_inbox');
		if (setuped) {
			input_position();
		}
		var inputCHECK = creaElemIn('input', inputBOX);
			inputCHECK.type = 'checkbox';
			inputCHECK.checked = addKeyword;
			inputCHECK.title = _ti.ad_nw[_L];
		var inputCHECKlabel = creaElemIn('label', inputBOX);
			inputCHECKlabel.textContent = (addKeyword) ? 'Add':'New';
			inputCHECKlabel.title = inputCHECK.title;
		var i_C_id = inputCHECK.id = 'Add_Check';
			inputCHECKlabel.htmlFor = i_C_id;
		var input = instant_search.input = creaElemIn('input', inputBOX);
			input.id = PRE + '_textinput';
		var go_button = creaElemIn('input', inputBOX);
			go_button.type = 'button';
			go_button.value = '\u2192';
			go_button.title = _ti.subm[_L];
		var close_button = creaElemIn('input', inputBOX);
			close_button.type = 'button';
			close_button.value = 'X';
			close_button.title = _ti.clos[_L];
 
		inputCHECK.addEventListener('change', function(){
			inputCHECKlabel.textContent = (this.checked) ? 'Add':'New';
			addKeyword = this.checked;
			input.focus();
		},false);
		go_button.addEventListener('click', function(){input_comfirm(input.value, addKeyword);}, false);
		close_button.addEventListener('click', input_cancel, false);
		input.addEventListener('keypress',function(evt){
			var fullkey = get_key(evt);
			switch (fullkey) {
			case 'RET':
				evt.preventDefault();
				evt.stopPropagation();
				input_comfirm(this.value, addKeyword);
				break;
			case 'ESC':
				input_cancel();
			}
		},false);
		input.addEventListener('input',function(e) {
			var text = input.value.toUpperCase();
			if (!/\S/.test(text) || text.length <2) return;
			var x = 'descendant::text()[contains(translate(self::text(),"abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ"),'+escapeXPathExpr(text)+') and not(ancestor::textarea) and not(ancestor::script) and not(ancestor::style)]/parent::*';
			var node = document.evaluate(x, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
			if (node) move(node);
		},false);
		if (selectedText.toString()) {
			input.value = selectedText.toString();
			input.select();
		} else if (keyword && !setuped) {
			input.value = keyword;
			input.select();
		} else input.focus();
	}
 
	function config_box() {
		var confBOXBack = creaElemIn('div', document.body);
			confBOXBack.setAttribute('style', 'background:white;position:fixed;top:0;left:0;width:100%;height:100%;text-align:center;z-index:30000;');
		var confBOX = creaElemIn('div', confBOXBack);
			confBOX.setAttribute('style', 'line-height:1;border:1px solid #333;border-left-width:10px;width:600px;margin:130px auto auto auto;padding:5px;');
		var confTitle = creaElemIn('h3', confBOX);
			confTitle.setAttribute('style', 'font-weight:800;border-bottom:1px solid black;width:80%;margin:15px auto 10px auto;');
			confTitle.innerHTML = _di.confT[_L];
		var confP = creaElemIn('p', confBOX);
			confP.setAttribute('style', 'text-align:left;');
 
		var conf = [], confR = [], confL = [], opt;
		for (n=0;n<3;n++) {
			conf[n] = document.createTextNode(_di.conf[_L][n]);
				confP.appendChild(conf[n]);
				creaElemIn('br', confP);
			confR[n] = [], confL[n] = [];
			opt = 3;
			if (n == 2) opt = 4;
			for (r=0;r<opt;r++) {
				confR[n][r] = creaElemIn('input', confP);
					confR[n][r].type = 'radio';
					confR[n][r].name = 'confR' + n;
					// confR[n][r].value = r;
					confR[n][r].id = PRE + 'confR' + n + '' + r;
					if (r == Ewh_configs[n]) confR[n][r].checked = true;
				confL[n][r] = creaElemIn('label', confP);
					confL[n][r].textContent = _di.confR[_L][n][r];
					confL[n][r].htmlFor = confR[n][r].id;
					confL[n][r].setAttribute('style', 'display: inline;');
				creaElemIn('br', confP);
			}
			creaElemIn('br', confP);
		}
 
		var confC = [], confCL = [];
		for (n=3;n<6;n++) {
			r = n-3;
			confC[r] = creaElemIn('input', confP);
				confC[r].type = 'checkbox';
				confC[r].id = PRE + 'confC' + r;
				confC[r].checked = !!(Ewh_configs[n] == 1);
			confCL[r] = creaElemIn('label',confP );
				confCL[r].textContent = _di.conf[_L][n];
				confCL[r].htmlFor = confC[r].id;
				confCL[r].setAttribute('style', 'display: inline;');
			creaElemIn('br', confP);
			creaElemIn('br', confP);
		}
 
		var cancconfig = function(){document.body.removeChild(confBOXBack);};
		var saveconfig = function(){
			var tmp_config = Ewh_configs.join('|');
			for (n=0;n<3;n++) {
				opt = 3;
				if (n == 2) opt = 4;
				for (r=0;r<opt;r++) {
					if (confR[n][r].checked == true) {
						Ewh_configs[n] = Number(r);
						break;
					}
				}
			}
			for (n=3;n<6;n++) {
				r = n-3;
				if (confC[r].checked == true) Ewh_configs[n] = 1;
				else Ewh_configs[n] = 0;
			}
			if (tmp_config != Ewh_configs.join('|')) {
				GM_setValue(CO_PRE, Ewh_configs.join('|'));
				location.reload();
			}
			else cancconfig();
			};
 
		var confBa = creaElemIn('input', confBOX);
			confBa.type = 'button';
			confBa.value = 'OK';
			confBa.addEventListener('click',saveconfig,false);
		var confBb = creaElemIn('input', confBOX);
			confBb.type = 'button';
			confBb.value = 'Cancel';
			confBb.addEventListener('click',cancconfig,false);
	}
 
	function after_load(e, _ind) {
		var cmd = function(_ind){
		if (!_ind) {
			word_lists.forEach(function(item){
				item.label.textContent = item.word + ' (' + item.get_count({result_type:XPathResult.NUMBER_TYPE}).numberValue + ')';
			});
		} else {
			word_lists[_ind].label.textContent = word_lists[_ind].word + ' (' + word_lists[_ind].get_count({result_type:XPathResult.NUMBER_TYPE}).numberValue + ')';
		}
		layers = xp_all.get();
		draw_wordmap();
		if (panel_hide){aside.style.right = (14 - aside.offsetWidth) +'px';}
		}
		setTimeout(cmd, delay+100, _ind);
	}
 
	function init_autopager(e) {
		var page = 0, disabled = false;
		var inserted_highlight = function(e){
			setTimeout(highlight, delay, e.target);
		};
		window.addEventListener('AutoPatchWork.DOMNodeInserted', inserted_highlight,false);
		window.addEventListener('AutoPatchWork.pageloaded', after_load,false);
		window.addEventListener('AutoPagerize_DOMNodeInserted', inserted_highlight,false);
		window.addEventListener('GM_AutoPagerizeNextPageLoaded', after_load,false);
		window.addEventListener('Super_preloaderPageLoaded', resetup ,false);
		highlight_reset = function(){
			window.removeEventListener('AutoPatchWork.DOMNodeInserted', inserted_highlight,false);
			window.removeEventListener('AutoPatchWork.pageloaded', after_load,false);
			window.removeEventListener('AutoPagerize_DOMNodeInserted', inserted_highlight,false);
			window.removeEventListener('GM_AutoPagerizeNextPageLoaded', after_load,false);
			window.removeEventListener('Super_preloaderPageLoaded', resetup ,false);
		}
	}
 
	function $XE(exp, context) {
		var xe = new XPathEvaluator();
		var resolver = xe.createNSResolver(document.documentElement);
		//var defaultNS = document.lookupNamespaceURI(window.opera ? '' : null);
		var defaultNS = (document.documentElement.nodeName !== 'HTML') ? context.namespaceURI : null;
		if (defaultNS) {
			var defaultPrefix = '__default__';
			if (!isChromium)
				exp = addDefaultPrefix(exp, defaultPrefix);
			var defaultResolver = resolver;
			resolver = function (prefix) {
				return (prefix == defaultPrefix) ? defaultNS : defaultResolver.lookupNamespaceURI(prefix);
			};
		}
		var ex = xe.createExpression(exp, resolver);
		this.get = function(param) {
			param || (param={});
			var result = this.result =
				ex.evaluate(param.context||context, param.result_type||XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,this.result);
			if (param.result_type) return result;
			for (var i = 0, len = result.snapshotLength, res = new Array(len); i < len; i++) {
				res[i] = result.snapshotItem(i);
			}
			return res;
		};
	}
 
	// via AutoPagerize Thx! nanto_vi
	function addDefaultPrefix(xpath, prefix) {
		var tokenPattern = /([A-Za-z_\u00c0-\ufffd][\w\-.\u00b7-\ufffd]*|\*)\s*(::?|\()?|(".*?"|'.*?'|\d+(?:\.\d*)?|\.(?:\.|\d+)?|[\)\]])|(\/\/?|!=|[<>]=?|[\(\[|,=+-])|([@$])/g;
		var TERM = 1, OPERATOR = 2, MODIFIER = 3;
		var tokenType = OPERATOR;
		prefix += ':';
		function replacer(token, identifier, suffix, term, operator, modifier) {
			if (suffix) {
				tokenType =
					(suffix == ':' || (suffix == '::' && (identifier == 'attribute' || identifier == 'namespace')))
					? MODIFIER : OPERATOR;
			} else if (identifier) {
				if (tokenType == OPERATOR && identifier != '*') {
					token = prefix + token;
				}
				tokenType = (tokenType == TERM) ? OPERATOR : TERM;
			} else {
				tokenType = term ? TERM : operator ? OPERATOR : MODIFIER;
			}
			return token;
		}
		return xpath.replace(tokenPattern, replacer);
	}
 
	// http://d.hatena.ne.jp/amachang/20090917/1253179486
	function escapeXPathExpr(text) {
		var matches = text.match(/[^"]+|"/g);
		function esc(t) {
			return t == '"' ? ('\'' + t + '\'') : ('"' + t + '"');
		}
		if (matches) {
			if (matches.length == 1) {
				return esc(matches[0]);
			} else {
				var results = [];
				for (var i = 0, len = matches.length; i < len; i ++) {
					results.push(esc(matches[i]));
				}
				return 'concat(' + results.join(', ') + ')';
			}
		} else {
			return '""';
		}
	}
 
	function $X(exp, context, resolver, result_type) {
		context || (context = document);
		var Doc = context.ownerDocument || context;
		var result = Doc.evaluate(exp, context, resolver, result_type || XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		if (result_type) return result;
		for (var i = 0, len = result.snapshotLength, res = new Array(len); i < len; i++) {
			res[i] = result.snapshotItem(i);
		}
		return res;
	}
 
	// reduce https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce#Compatibility
	function reduce(arr, fun) {
		var len = arr.length, i = 0, rv;
		if (arguments.length >= 3) rv = arguments[2];
		else {do {
			if (i in arr) {
				rv = arr[i++];break;
			}
			if (++i >= len) throw new TypeError();
		} while (true)};
		for (; i < len; i++) if (i in arr) rv = fun.call(null, rv, arr[i], i, arr);
		return rv;
	}
 
	function error(e) {
		if (isOpera) {
			opera.postError(e);
		} else if (window.console) {
			console.error(e);
		}
	}
 
	function addCSS(css) {
		var sheet, self = arguments.callee;
		if (document.createStyleSheet) { // for IE
			sheet = document.createStyleSheet();
			sheet.cssText = css;
			return sheet;
		} else if (!self.__style || !self.__root) {
			sheet = document.createElement('style');
			sheet.type = 'text/css';
			self.__style = sheet;
			self.__root = document.getElementsByTagName('head')[0] || document.documentElement;
		}
		sheet = self.__style.cloneNode(false);
		sheet.textContent = css;
		return self.__root.appendChild(sheet).sheet;
	}
 
	function getY(oElement) {
		var iReturnValue = 0;
		while (oElement != null) {
			iReturnValue += oElement.offsetTop;
			oElement = oElement.offsetParent;
		}
		return iReturnValue;
	}
 
	function creaElemIn(tagname, destin) {
		var theElem = destin.appendChild(document.createElement(tagname));
		return theElem;
	}
 
	/** Get elements by className
	* @function getElementsByClassName
	* @param string className
	* @param optional string tag restrict to specified tag
	* @param optional node restrict to childNodes of specified node
	* @return Array of nodes
	* @author Jonathan Snook, http://www.snook.ca/jonathan
	* @author Robert Nyman, http://www.robertnyman.com
	*/
	function getElementsByClassName(className, tag, elm) {
		var testClass = new RegExp("(^|\\s)" + className + "(\\s|$)");
		var tag = tag || "*";
		var elm = elm || document;
		var elements = (tag == "*" && elm.all)? elm.all : elm.getElementsByTagName(tag);
		var returnElements = [];
		var current;
		var length = elements.length;
		for(var i=0; i<length; i++){
			current = elements[i];
			if(testClass.test(current.className)){
			returnElements.push(current);
			}
		}
		return returnElements;
	}
 
	// GM api to cookie function
	function getRecoverableString(oVar,notFirst){
		var oType = typeof(oVar);
		if((oType == 'null' )|| (oType == 'object' && !oVar )){
			return 'null';
		}
		if(oType == 'undefined' ){ return 'window.uDfXZ0_d'; }
		if(oType == 'object' ){
			//Safari throws errors when comparing non-objects with window/document/etc
			if(oVar == window ){ return 'window'; }
			if(oVar == document ){ return 'document'; }
			if(oVar == document.body ){ return 'document.body'; }
			if(oVar == document.documentElement ){ return 'document.documentElement'; }
		}
		if(oVar.nodeType && (oVar.childNodes || oVar.ownerElement )){ return '{error:\'DOM node\'}'; }
		if(!notFirst ){
			Object.prototype.toRecoverableString = function (oBn){
				if(this.tempLockIgnoreMe ){ return '{\'LoopBack\'}'; }
				this.tempLockIgnoreMe = true;
				var retVal = '{', sepChar = '', j;
				for(var i in this ){
					if(i == 'toRecoverableString' || i == 'tempLockIgnoreMe' || i == 'prototype' || i == 'constructor' ){ continue; }
					if(oBn && (i == 'index' || i == 'input' || i == 'length' || i == 'toRecoverableObString' )){ continue; }
					j = this[i];
					if(!i.match(basicObPropNameValStr)){
						//for some reason, you cannot use unescape when defining peoperty names inline
						for(var x = 0; x < cleanStrFromAr.length; x++ ){
							i = i.replace(cleanStrFromAr[x],cleanStrToAr[x]);
						}
						i = '\''+i+'\'';
					} else if(window.ActiveXObject && navigator.userAgent.indexOf('Mac')+ 1 && !navigator.__ice_version && window.ScriptEngine && ScriptEngine()== 'JScript' && i.match(/^\d+$/)){
						//IE mac does not allow numerical property names to be used unless they are quoted
						i = '\''+i+'\'';
					}
					retVal += sepChar+i+':'+getRecoverableString(j,true);
					sepChar = ',';
				}
				retVal += '}';
				this.tempLockIgnoreMe = false;
				return retVal;
			};
			Array.prototype.toRecoverableObString = Object.prototype.toRecoverableString;
			Array.prototype.toRecoverableString = function (){
				if(this.tempLock ){ return '[\'LoopBack\']'; }
				if(!this.length ){
					var oCountProp = 0;
					for(var i in this ){ if(i != 'toRecoverableString' && i != 'toRecoverableObString' && i != 'tempLockIgnoreMe' && i != 'prototype' && i != 'constructor' && i != 'index' && i != 'input' && i != 'length' ){ oCountProp++; } }
					if(oCountProp ){ return this.toRecoverableObString(true); }
				}
				this.tempLock = true;
				var retVal = '[';
				for(var i = 0; i < this.length; i++ ){
					retVal += (i?',':'')+getRecoverableString(this[i],true);
				}
				retVal += ']';
				delete this.tempLock;
				return retVal;
			};
			Boolean.prototype.toRecoverableString = function (){
				return ''+this+'';
			};
			Date.prototype.toRecoverableString = function (){
				return 'new Date('+this.getTime()+')';
			};
			Function.prototype.toRecoverableString = function (){
				return this.toString().replace(/^\s+|\s+$/g,'').replace(/^function\s*\w*\([^\)]*\)\s*\{\s*\[native\s+code\]\s*\}$/i,'function (){[\'native code\'];}');
			};
			Number.prototype.toRecoverableString = function (){
				if(isNaN(this)){ return 'Number.NaN'; }
				if(this == Number.POSITIVE_INFINITY ){ return 'Number.POSITIVE_INFINITY'; }
				if(this == Number.NEGATIVE_INFINITY ){ return 'Number.NEGATIVE_INFINITY'; }
				return ''+this+'';
			};
			RegExp.prototype.toRecoverableString = function (){
				return '\/'+this.source+'\/'+(this.global?'g':'')+(this.ignoreCase?'i':'');
			};
			String.prototype.toRecoverableString = function (){
				var oTmp = escape(this);
				if(oTmp == this ){ return '\''+this+'\''; }
				return 'unescape(\''+oTmp+'\')';
			};
		}
		if(!oVar.toRecoverableString ){ return '{error:\'internal object\'}'; }
		var oTmp = oVar.toRecoverableString();
		if(!notFirst ){
			//prevent it from changing for...in loops that the page may be using
			delete Object.prototype.toRecoverableString;
			delete Array.prototype.toRecoverableObString;
			delete Array.prototype.toRecoverableString;
			delete Boolean.prototype.toRecoverableString;
			delete Date.prototype.toRecoverableString;
			delete Function.prototype.toRecoverableString;
			delete Number.prototype.toRecoverableString;
			delete RegExp.prototype.toRecoverableString;
			delete String.prototype.toRecoverableString;
		}
		return oTmp;
	}
 
 
 
})();

} catch (e) {
    console.error('Airflow log hightlight error', e)
}
console.log('Airflow log hightlight lib end')