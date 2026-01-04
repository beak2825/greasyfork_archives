// ==UserScript==
// @name           Airflow log hightlight library
// @namespace      https://greasyfork.org/zh-CN/scripts/430272-airflow-log-hightlight-lib
// @description    A library of airflow log highlight for airflow helper
// @include        http://airflow.yimian.com.cn/*
// @include        http://airflow.onework.yimian.com.cn/*
// @include        http://172.16.24.11:18080/*
// @grant          GM_log
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_openInTab
// @grant          GM_registerMenuCommand
// @version        0.1.4
// ==/UserScript==
;(function () {
	var isOpera = !!this.opera,
		isChromium = !!this.chromium;
	var STYLE_COLOR = ['#FFFF80','#99ccff','#ff99cc','#66cc66','#cc99ff','#ffcc66','#66aaaa','#dd9966','#aaaaaa','#dd6699'];
	var BORDER_COLOR = ['#aaaa20','#4477aa','#aa4477','#117711','#7744aa','#aa7711','#115555','#884411','#555555','#881144'];
	var but_c = '#99cc99', but_ca = '#FFD000', but_cd = '#999999', but_cb = '#669966'; // button normal/active/disable background color/border color.
 
	// Initialize value
	var PRE = 'wordhighlight', ID_PRE = PRE + '_id';
	var STYLE_CLASS = '0123456789'.split('').map(function(a,i){return PRE + '_word'+i;});

	var keyword = "AnalysisException|ValueError|TypeError|ProgrammingError|JSONDecodeError|AnalysisException|NameError|IndentationError|KeyError|IndexError|AttributeError|FileNotFoundError|\
ConnectionError|HTTPError|Received SIGTERM|SyntaxError|OutOfMemory|Container killed by YARN for exceeding memory limits|Failed to get minimum memory|\
Permission denied|Memory limit exceeded|Could not resolve table reference|Could not resolve column/field reference|File does not exist|RemoteException|\
TExecuteStatementResp|object has no attribute|InternalError|NullPointerException|ConnectionError|Failed to close HDFS|cannot be null|IntegrityError|\
ArrayIndexOutOfBoundsException|has more columns|Unknown column|No such file or directory|Out Of Memory|RuntimeError|Traceback|AirflowTaskTimeout|AssertionError|\
Check 'stl_load_errors' system table for details|OperationalError|Lost connection to MySQL server during query|AirflowTaskTimeout|files cols number not match target file cols number, check it|\
Data too long for column|DataError|Initial job has not accepted any resources|/tmp/oneflow_|http://oneflow.yimian.com.cn/dag|num_dumped_rows|com.yimian.etl"
  var words = [];
	var words_off = [];

	// 创建一个观察器实例并传入回调函数
  const observer1 = new MutationObserver(setup);
  const observer2 = new MutationObserver(setup);

	if (window.location.href.includes('log')) {	
		init_keyword()
		observeTargetDOM()
	}

	function observeTargetDOM() {
    const logMenu = document.querySelectorAll('.nav.nav-pills')[3]
		const logContent = document.querySelector('.tab-content').lastChild.previousSibling
    const config = { childList: true, subtree: true, attributes: true };
    // 以上述配置开始观察目标节点
    observer1.observe(logMenu, config);
    observer2.observe(logContent, config);
  }

	function init_keyword() {
		keyword = trim(keyword);
		window.name = PRE + '::' + encodeURIComponent(keyword);
		words = init_words(keyword);
	}

	function setup() {
		addsheet();
		highlight(document.body)
		observer2.disconnect()
	}
 
	function highlight(doc) {
		const _words = words.filter((w,i) => !words_off[i]);
		if (_words.length <= 0) return;
		let exd_words, xw;
		if (_words.length === 1 && _words[0].exp) {
			exd_words = _words.map((e) => e.exp);
			xw = '';
		} else {
			exd_words = _words.map(function(w){return w.test ? w : new RegExp('(' + w.replace(/\W/g,'\\$&') + ')(?!##)', 'ig');});
			xw = ' and (' + _words.map(function(w){return ' contains(translate(self::text(),"abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ"),'+escapeXPathExpr(w.toUpperCase())+') ';}).join(' or ') + ') ';
		}
		$X('descendant::text()[string-length(normalize-space(self::text())) > 0 ' + xw +' and not(ancestor::textarea or ancestor::script or ancestor::style or ancestor::aside)]', doc)
			.forEach(function(text_node) {
				let parent = text_node.parentNode;
				// 关键词父元素标签为span 说明已经被高亮过
				if (parent.tagName.toUpperCase() === 'SPAN') return;
				let df,
				text = text_node.nodeValue,
				id_index = 0,
				range = document.createRange(),
				replace_strings = [],
				new_text = reduce(exd_words, (text,ew,i) => {
					return text.replace(ew,($0,$1) => {
						replace_strings[id_index] = '<span id="' + ID_PRE + id_index + '" class="' + STYLE_CLASS[i%10] + '" name="'+PRE+'_word'+i+'">' + $1 + '</span>';
						return '##'+(id_index++)+'##';
					});
				}, text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/##(\d+)##/g, ($0,$1) => replace_strings[$1] || '');
				if (replace_strings.length) {
					try {
						if (isChromium) {
							const htmlDoc = document.implementation.createHTMLDocument('hogehoge');
							range.selectNodeContents(htmlDoc.documentElement);
						} else {
							range.selectNode(text_node);
						}
						df = range.createContextualFragment(new_text);
						console.log('df', df);
						if (df.firstChild) parent.replaceChild(df, text_node);
						range.detach();
					} catch (e) {
						error(e);
					}
				}
			});
	}
 
	function addsheet() {
		const hilistyles = STYLE_COLOR.map((rgb,i) => {
			return 'span.' + PRE + '_word'+i+',.' + PRE + '_item'+i+'{background:'+rgb+'!important;}';
			});
		const borderstyles = BORDER_COLOR.map((rgb,i) => {
			return 'li.' + PRE + '_item'+i+'{outline:1px solid '+rgb+'!important;}';
			});
		const panel_pos_arr = ['right:-1px;','bottom:-1px;'];
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
	}
 
	function trim(str) {
		return str.replace(/[\n\r]+/g,' ').replace(/^\s+|\s+$/g,'').replace(/\.+\s|\.+$/g,'');
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
 
	function init_words(word) {
		var erg = word.match(new RegExp("^ ?/(.+)/([gim]+)?$"));
		if (erg) {
			var ew = erg[1], flag = erg[2] || '';
			var word_s = [{exp:new RegExp('(' + ew + ')(?!##)', flag), text:ew, toString:function(){return ew;}}];
		} else if (word) {
			var ret=[], eword = word.replace(/"([^"]+)"/g,function($0,$1){$1 && ret.push($1);return '';});
			var word_s = eword.split(/[\+\|#]/).filter(function(w){return !!w;}).concat(ret);
			word_s = uniq(word_s);
			for (var i in word_s) {
				if (/^[a-z0-9]$/i.test(word_s[i]))
					words_off[i] = true;
				else words_off[i] = false;
			}
		}
		return word_s;
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

})();