// ==UserScript==
// @name         英语阅读助手
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  点击开始，获取p 标签的单词，然后获取解释，鼠标悬停到段落便可以显示解释，也可以选择fixed 模式，然后点击段落，便可以显示单词列表，可以通过设置style_element 的内容设置此脚本面板的样式
// @author       lavaf
// @match        http://127.0.0.1:8848/TestyoudaoTranslate/pages/testyouhou.html
// @match        http://www.51voa.com/*
// @match        http://phantomjs.org/*
// @match        https://docs.microsoft.com/en-us/dotnet/api/system.windows.forms.form.clientsize?view=netframework-4.8
// @match 		 http://localhost/pages/testyouhou.html
// @match		 https://developer.android.google.cn/reference/android/support/design/widget/FloatingActionButton?hl=en
// @grant        none
// @require  https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @require https://cdn.jsdelivr.net/gh/emn178/js-sha256/build/sha256.min.js
// @require https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js
// @downloadURL https://update.greasyfork.org/scripts/386479/%E8%8B%B1%E8%AF%AD%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/386479/%E8%8B%B1%E8%AF%AD%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
	var appKey = '28aabe54f8ad1add';
	var Secret = 'Uf2mY5g5x6OyCIE0EPmDCJFilo4cWqvB'; //注意：暴露appSecret，有被盗用造成损失的风险
	var from_l = 'en';
	var to = 'zh-CHS';
	var no_translate = ['a', 'an', 'the', 'than', 'would', 'rather', 'may', 'woman', 'women', 'man', 'other', 'any', 'many',
		'some',
		'have', 'has', 'for', 'on', 'to', 'of', 'in', 'from',
		'first', 'second',
		'am', 'is', 'are', 'were', 'be', 'was', 'will', 'did', 'do', 'does',
		'no', 'not', 's', 'n',
		'you', 'us', 'myself', 'herself', 'his', 'he', 'her', 'i', 'me', 'him', 'they', 'it', 'it\'s',
		'so', 'or', 'and', 'where', 'there', 'this', 'that', 'what', 'done', 'with', 'at', 'she'
	]
	var no_idom = ['of'] //不需要翻译短语
	var textPanel; //全局的单词列表面板对象
	var result_count = 0; //已经获得的单词的数量
	var result_table = {} //全部已经获得的单词
	var deleted_table = {} //已经删除不再显示的单词
	var speech_table = {} //存放音标和发音
	
	var setting_item_name = ['show_delete_word_button', 'show_ph', 'show_ph_button']
	var setting = {
		'show_delete_word_button': false,
		'show_ph': false,
		'show_ph_button': false
	}
	var style = {
		controlpanel: {
			style: {},
			child: {
				'move-button': {},
				'start-button': {}
			}
		}
	}
	var adw = new addWin('50px', '100px');
	/*
	加载存储在local storage 中的数据
	*/
	if (localStorage) {
		var a = [
			'result-table',
			'speech-table',
			'deleted-table',
			'setting'
		]
		var objects = [null, null, null, null]
		for (let var1 in a) {
			let current = a[var1]
			var result_temp = localStorage.getItem(current);
			if (result_temp != null) {
	
				objects[var1] = JSON.parse(result_temp);
	
				console.log("从localStorage中加载缓存" + current);
				adw.show("从localStorage中加载缓存" + current);
			}
		}
		if (objects[0] != null) result_table = objects[0]
		if (objects[1] != null) speech_table = objects[1]
		if (objects[2] != null) deleted_table = objects[2]
		if (objects[3] != null) setting = objects[3]
	
	}
	/*
	获取已经保存的单词数目
	*/
	for (let s in result_table) {
		result_count++;
	}
	var offestX, offestY;
	var movable = false;
	var panel = createControlPanel();
	var audio = $("<audio>", {
		src: ""
	}).appendTo("body");
	var style_element = $('<style>').appendTo('head').text('#lavaf-start-get-word-button{color:red}'+
	
	'#lavaf-control-panel{background-color:white;z-index:100}')
	
	// var script_element=$('<script>').appendTo('body').text('function lavaf_play(src) {if (src == undefined) {return;}var audio=$("audio");audio.attr(\'src\', src);audio.get(0).play()};'+
	// "function delete_word(word_name) {if (deleted_table[word_name] == null) {let t = new Date();deleted_table[word_name] = {'date': Date(),'m': t.getTime()}} else {delete deleted_table[word_name];}localStorage.setItem('deleted-table', JSON.stringify(deleted_table));}")
	
	/**
	 * 获取上一次选择的类型
	 */
	function getLastSelectionType() {
		var show_type_last_selection = "title";
		if (localStorage) {
			var save_show_type = localStorage.getItem("save-show-type");
			if (save_show_type != null) {
				show_type_last_selection = save_show_type;
			}
		}
		return show_type_last_selection;
	}
	/**
	 * 创建控制面板
	 */
	function createControlPanel() {
		let div = $("<div>", {
			'id': 'lavaf-control-panel'
		}).css({
			'position': 'absolute',
			'left': '10px',
			'top': '100px',
			'border': '#000000 solid 1px',
			'padding': '0 0 10px 0',
			'z-index':100
		})
		let taskBarOfControlPanel=$('<button>').text("恢复").css({
			'display':'none',
			'position':'absolute',
			'bottom':'0',
			'left':'0'
		}).appendTo('body').click(function(){
			$(this).css('display','none')
			div.css('display','block')
		})
		let controlHead=$('<div>',{
			'id':'lavaf-control-head'
		}).appendTo(div);
		var move_button = $("<button>", {
			'id': "lavaf-move-button",
			'title':'点击这里可以移动'
		}).text("+++++++++").css({
			'width':'80%'
		}).mousedown(function(e) {
			offestX = e.clientX - div.offset().left
			offestY = e.clientY - div.offset().top;
			movable = true;
		}).appendTo(controlHead);
		var minibButton=$('<button>',{
			'title':'最小化'
		}).text("-").css({
			'width':'15%'
		}).click(function(){
			div.css('display','none')
			taskBarOfControlPanel.css('display','inline');
			adw.show("看屏幕左下角")
		});
		controlHead.append(minibButton)
		let controlBody=$("<div>",{
			'id':"lavaf-control-body"
		}).css({
			'padding':'10px',
			
		}).appendTo(div)
		appendMouseMoveEvents(div)
		/*
		显示保存的单词数量
		*/
		$("<div>", {
			'id': 'lavaf-show-saved-word-num'
		}).text(`保存的单词:${result_count}`).appendTo(controlBody);
		//获取上次的选择
		var show_type_last_selection = getLastSelectionType();
		var selection_type_show = $("<select>", {
			id: "lavaf-selection-type-show"
		}).appendTo(controlBody);
		var option1 = $("<option>", {
			'id': 'lavaf-selection-type-option-itme-1',
			'class': 'lavaf-selection-type-option-item',
			value: "title"
		}).text("title");
		var option2 = $("<option>", {
			'id': 'lavaf-selection-type-option-itme-2',
			'class': 'lavaf-selection-type-option-item',
			value: 'fixed'
		}).text("fixed");
		if (show_type_last_selection === "title") {
			option1.attr('selected', "selected")
		} else {
			option2.attr('selected', "selected")
		}
		selection_type_show.append(option1).append(option2);
		var mutil_container = $("<div>", {
			id: 'lavaf-setting-multiple-select-container'
		});
		var need_show_component = $("<select>", {
			'id': 'lavaf-setting-multiple-select',
			'multiple': 'multiple'
		}).change(function() {
			let child = need_show_component.children()
			if (child.get(3).selected) {
				child.each(function(index, element) {
					if (index !== 3) {
						element.selected = false;
						element.blur()
						for (let s of setting_item_name) {
							setting[s] = false;
						}
					}
				})
			} else {
				child.each(function(index, element) {
					if (index != 3) {
						setting[setting_item_name[index]] = element.selected;
					}
				})
			}
			localStorage.setItem('setting', JSON.stringify(setting))
		}).appendTo(mutil_container);
		/*
		为 select 标签添加数据
		*/
		var component_array = ["显示删除单词按钮", "显示音标", "显示发音按钮", "无"]
		for (let item in component_array) {
	
			var option_show_delete_word = $("<option>", {
				id: 'lavaf-setting-multiple-select-option-' + item,
				class: 'lavaf-setting-multiple-select-option-item',
				value: component_array[item]
			}).text(component_array[item]).appendTo(need_show_component);
			if (item != 3) {
				var item_selected = setting[setting_item_name[item]]
				option_show_delete_word.attr('selected', item_selected)
				if (item_selected) {
					option_show_delete_word.get(0).focus()
				} else {
					// option_show_delete_word.blur
				}
			}
		}
		controlBody.append(mutil_container);
		//显示result-table 面板
		var show_result_table_panel_button = $("<button>", {
			id: 'lavaf-show-result-table-panel-button'
		}).text("显示全部单词").appendTo(controlBody);
		show_result_table_panel_button.click(function() {
			let r = "";
			for (let var1 in result_table) {
				if (deleted_table[var1] == null)
					r += getWordListItem(var1);
			}
			showTextPanel(r);
		});
		controlBody.append('<br>')
		var show_deleted_word = $('<button>', {
			id: 'lavaf-show-deleted-word-button'
		}).text("显示已经删除的单词").appendTo(controlBody);
		show_deleted_word.click(function() {
			let r = '';
			for (let var1 in deleted_table) {
				r += getWordListItem(var1);
				r += "<p>" + JSON.stringify(deleted_table[var1]) + "</p>";
			}
			showTextPanel(r);
		});
		controlBody.append('<br>')
		var start = getButton(1);
		controlBody.append(start);
		return div.appendTo('body');
	}
	/**
	 * 有道提供查词功能
	 * @param {string} input 要查询的单词
	 */
	function getInput(input) {
		if (input.length == 0) {
			return null;
		}
		var result;
		var len = input.length;
		if (len <= 20) {
			result = input;
		} else {
			var startStr = input.substring(0, 10);
			var endStr = input.substring(len - 10, len);
			result = startStr + len + endStr;
		}
		return result;
	}
	/**
	 * 为可移动的元素添加鼠标移动的事件
	 * @param {Object} div 需要操作的元素
	 */
	function appendMouseMoveEvents(div) {
		div.mousemove(function(e) {
			// var e = e || window.event;
			if (movable) {
				var move_x = e.clientX - offestX;
				var move_y = e.clientY - offestY;
				div.css({
					'top': move_y + "px",
					'left': move_x + "px"
				})
			}
		}).mouseup(function() {
			movable = false;
		})
	}
	/**
	 * 创建显示单词列表的面板
	 * @param {Object} str 要显示的html 内容
	 */
	function createTextPanel(str) {
		var div = $("<div>").css({
			'position': 'absolute',
			'top': (100 + 10) + "px",
			'left': (100 + 10) + "px",
			'background-color': 'lightgray',
			'color': 'black',
			'z-index':90
		});
		var inner_button = $("<button>").text("◍").css({
			'padding': '10px'
		}).appendTo(div);
		inner_button.mousedown(function(e) {
			offestX = e.clientX - div.offset().left;
			offestY = e.clientY - div.offset().top
			movable = true;
		});
		appendMouseMoveEvents(div)
		var close_button = $("<button>", {
			id: 'text-panel-close-button'
		}).text("X").appendTo(div);
		close_button.click(function() {
			textPanel.css('display', 'none')
		})
		var inner_dix = $("<div>").css('padding', '10px').html(str).appendTo(div);
		return div;
	}
	
	function addWin(left, top) {
		this.timeout;
		this.win;
		this.delay_move = function() {
			this.timeout = setTimeout(() => {
				document.body.removeChild(this.win);
				this.win = null;
			}, 2000)
		}
		this.show = function(msg) {
			if (this.win != null && this.win != undefined) {
				clearTimeout(this.timeout);
				this.win.innerText = msg;
				this.delay_move()
			} else {
				this.win = document.createElement('div');
				this.win.className = 'lavaf-message';
				this.win.style.position = 'absolute';
				this.win.style.top = top || '100px';
				this.win.style.left = left || '100px';
				this.win.innerText = msg;
				this.win.style.backgroundColor = 'lightgreen';
				this.win.style.paddingLeft = '15px';
				this.win.style.paddingRight = '15px';
				this.win.style.paddingTop = '5px';
				this.win.style.paddingBottom = '5px';
				document.body.appendChild(this.win);
				this.delay_move()
			}
		}
	
	
	}
	/**
	 * 给p 添加title ，或者设置click事件
	 * @param {Object} word_table
	 * @param {HtmlElement} current_element
	 */
	function addTitleOrText(word_table, current_element) {
	
		var current_selection_index = document.getElementById("lavaf-selection-type-show").selectedIndex
		if (current_selection_index == 0) { //显示title
			let result = "";
			for (let var1 in word_table) {
				let word_name = word_table[var1];
				if (result_table[word_table[var1]] != null)
					if (deleted_table[word_name] == null)
						result += word_table[var1] + ":" + result_table[word_table[var1]] + "\n";
			}
			current_element.title = result;
			localStorage.setItem("save-show-type", "title")
		} else {
			localStorage.setItem("save-show-type", "fixed")
			current_element.onclick = function() {
				showTextPanel(getResult(word_table))
			}
			// console.log('绑定事件到');
			// console.log(current_element)
		}
	}
	
	function getResult(word_table) {
		let result = '';
		for (let var1 in word_table) { //显示文本面板
			let word_name = word_table[var1];
			if (result_table[word_name] != null) {
				if (deleted_table[word_name] == null)
					result += getWordListItem(word_name);
			}
	
		}
		// showTextPanel(result)
		return result
	}
	/**
	 * 显示单词列表框
	 * @param {Object} result
	 */
	function showTextPanel(result) {
		if (textPanel == null) {
			textPanel = createTextPanel(result);
			textPanel.appendTo($('body'))
			localStorage.setItem("save-show-type", "fixed")
		} else {
			//如果不为空就显示
			var currentTextPanelStatus = textPanel.css('display');
			textPanel.children().last().html(result)
			if (currentTextPanelStatus == 'none') {
				textPanel.css('display', 'block')
			}
	
		}
		$(".lavaf-button-play").click(function(){
			lavaf_play($(this).attr("data-u"));
		})
		$(".lavaf-button-delete").click(function(){
			delete_word($(this).attr("data-d"))
		})
	}
	/**
	 * 将单词添加到已删除列表
	 * @param {string} word_name 需要删除的单词
	 */
	function delete_word(word_name) {
		if (deleted_table[word_name] == null) {
			let t = new Date();
			deleted_table[word_name] = {
				'date': Date(),
				'm': t.getTime()
			}
	
		} else {
			delete deleted_table[word_name];
		}
		localStorage.setItem('deleted-table', JSON.stringify(deleted_table));
	}
	/**
	 * 获取单词列表详情
	 * @param {string} word_name 获取单词的解释
	 */
	function getWordListItem(word_name) {
	
		var ukph;
		var ph;
		var usph;
		var uk;
		var us;
		if (speech_table[word_name] != undefined) {
			ukph = speech_table[word_name]['uk-ph'];
			usph = speech_table[word_name]['us-ph']
			ph = speech_table[word_name]['ph'];
			uk = speech_table[word_name]['uk']
			us = speech_table[word_name]['us']
		} else {
			console.log(word_name + " 这个可能不是单词，建议去除");
		}
		var setting_1 = setting[setting_item_name[1]]
		var setting_2 = setting[setting_item_name[2]]
		var setting_0 = setting[setting_item_name[0]]
		return '<div><span style=\"color:red;\">' + word_name + "</span>" +
			(setting_1 ? '<span>【' + ph + '】</span>' : '') +
			(setting_1 ? '<span>[' + (ukph == undefined ? 'x' : ukph) + ']</span>' : '') +
			(setting_2 ? '<button class="lavaf-button-play" data-u=\"' + uk + '\"\'>o</button>' : '') +
			(setting_1 ? '<span>[' + (usph == undefined ? 'x' : usph) + ']</span>' : '') +
			(setting_2 ? '<button class="lavaf-button-play" data-u=\"' + us + '\")\'>o</button>' : '') +
			":" + result_table[word_name] +
			(setting_0 ? '<button class="lavaf-button-delete" data-d=\"' + word_name + '\")\'>x</button>' : '') +
			"</div>";
	
	
	}
	/**
	 * 播放音频
	 * @param {Object} src 音频连接
	 */
	function lavaf_play(src) {
		if (src == undefined) {
			addWin("当前单词没有发音,可能不是个单词");
			return;
		}
		audio.attr('src', src)
		audio.get(0).play()
	}
	/**
	 * 因为有的单词可能更快查找到，但是同一段的其他可能还没有
	 * 等到其他单词，也就是最后一个也查找到了，
	 * 便可以给这个段落设置监听事件了
	 * ，查看当前需要索引的单词是否都已经查找到，如果是那就开始显示
	 * @param {Object} word_table 当前的标签含有的单词表
	 * @param {Object} current_element
	 */
	function addTitleForP(word_table, current_element) {
		// console.log(word_table);
		// console.log(word_table.length);
		// console.log(result_table);
		var m = 0;
		for (; m < word_table.length; m++) {
			if (result_table[word_table[m]] == undefined) { //还有没完成的查询
				return;
			}
		}
		if (m == word_table.length) { //所有单词都完成了查询
			localStorage.setItem("result-table", JSON.stringify(result_table)); //保存数据
			localStorage.setItem("speech-table", JSON.stringify(speech_table));
			addTitleOrText(word_table, current_element);
			adw.show("单词全部获得解释，可以开始使用了")
		}
	}
	/**
	 * 为开始获取单词按钮设置事件
	 * @param {Object} button
	 * @param {Object} type
	 */
	function setOnClick(button, type) {
		button.click(function() {
			var p_array = document.getElementsByTagName("p");
			//遍历所有的 p 标签
			for (var i = 0; i < p_array.length; i++) {
				let current_element = p_array[i]; // 当前p 标签对象
				let p_text = current_element.innerText // 字符串 存储当前p 标签的内容
				let p_inner = p_text.split(/[ \s,"'():.]/); //数组 存储当前p 标签的每一个单词
				let word_table = [] //数组 存储需要索引的全部单词,这是需要翻译单词的
				let last_word = null;
				for (var j = 0; j < p_inner.length; j++) { //遍历每一个单词
					let item_query = p_inner[j];
					/*去除非单词结果*/
					let trim = item_query.trim();
					if (trim === "" || trim === "-" || trim === '.' || !/^[0-9a-zA-Z-]{1,}$/.test(item_query)) {
						if (j == p_inner.length - 1) {
							addTitleForP(word_table, current_element);
						}
						continue;
					}
					/*去除非单词部分,保险措施*/
					var last_char = item_query[item_query.length - 1];
					if (last_char === ',' || last_char === '.' || last_char === '\'' || last_char === ')') {
						console.log('去除非单词部分' + item_query);
						item_query = item_query.substring(0, item_query.length - 1)
						console.log('处理之后' + item_query)
					}
					/*去除所有格*/
					if (item_query.lastIndexOf("'s") >= 0) {
						item_query = item_query.substring(0, item_query.length - 2)
					}
					if (item_query[0] == '(') {
						item_query = item_query.substring(1, item_query.length - 1);
					}
					last_word = item_query.toLowerCase();
	
					if ($.inArray(item_query.toLowerCase(), no_translate) == -1) {
						word_table.push(item_query)
						console.log("当前操作：" + item_query);
						if (type == 1) {
							var salt = (new Date).getTime(); //随机数
							var curtime = Math.round(new Date().getTime() / 1000);
							var str1 = appKey + getInput(item_query) + salt + curtime + Secret;
							var sign = sha256(str1);
							let current_index = j;
							/*
							单词表中查找不到，需要联网获取
							*/
							if (result_table[item_query] == null || result_table[item_query] == undefined) {
								$.ajax({
									url: location.protocol+'//openapi.youdao.com/api',
									type: 'post',
									dataType: 'jsonp',
									data: {
										q: item_query,
										appKey: appKey,
										salt: salt,
										'from': from_l,
										to: to,
										curtime: curtime,
										sign: sign,
										signType: "v3"
									},
									success: function(data) {
										console.log("联网获取到" + item_query + "的翻译");
										//完成查询时会把数据放到result-table中
										if (data.basic != null && data.basic.explains != null) {
											let explains = data.basic.explains;
											let r = `[${data.translation}],${JSON.stringify(explains)};\n`;
											result_table[item_query] = r;
											let current_speech = speech_table[item_query];
											if (current_speech == null) {
												speech_table[item_query] = {
													'uk': data.basic['uk-speech'],
													'us': data.basic['us-speech'],
													'us-ph': data.basic['us-phonetic'],
													'uk-ph': data.basic['uk-phonetic'],
													'ph': data.basic['phonetic']
												}
											}
										} else {
											if (data.translation != undefined) {
												let r = "[" + data.translation + "]\n";
												result_table[item_query] = r;
											} else {
												console.log("item_quer:translation == undefined:" + item_query);
												console.log(data);
											}
										}
										addTitleForP(word_table, current_element);
									}
								}); //查找调用完毕
	
							} else {
								/*
								找到单词不必联网获取
								*/
								console.log("已获取" + item_query);
								// console.log(j+" "+p_inner.length);
								// console.log(p_inner);
								if (j == p_inner - 1) {
									addTitleForP(word_table, current_element);
								}
							}
						} //查找调用类型配置完毕,TODO:: 可以添加其他类型的查询结构
					} //其余过于简单不必翻译， 翻译调用结束
					//遍历单词结束
				} //退出遍历单词循环
	
			} //遍历段落结束
		}) //监听函数设置完毕
	}
	/**
	 * 创建按钮
	 */
	function getButton(type) {
		var btn_start = $("<button>", {
			id: 'lavaf-start-get-word-button',
			value: '开始',
			type: 'button'
		}).text('开始');
		setOnClick(btn_start, type);
		return btn_start;
	}

})();