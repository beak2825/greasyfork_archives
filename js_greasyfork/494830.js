// ==UserScript==
// @name         东油教务系统需要的js
// @namespace    https://jwgl.webvpn.nepu.edu.cn/new/student/teapj#
// @namespace    https://jwgl.webvpn.nepu.edu.cn/new/welcome.page
// @version      0.2
// @description  不要安装不要安装不要安装
// @author       cat3399
// @match        *://*/*
// @grant       GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494830/%E4%B8%9C%E6%B2%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%9C%80%E8%A6%81%E7%9A%84js.user.js
// @updateURL https://update.greasyfork.org/scripts/494830/%E4%B8%9C%E6%B2%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%9C%80%E8%A6%81%E7%9A%84js.meta.js
// ==/UserScript==


var entss = {
	config: {
		ajax: {
			timeout: 5000
		},
		combobox: {
			delay: 1000,
			valueField: 'dm',
			textField: 'mc'
		},
		combotree: {
			valueField: 'dm',
			textField: 'mc'
		}
	},
	showMask: function (selector) { // 鍙互浼犲叆閫夋嫨鍣�
		if (!selector)
			selector = 'body';

		if(window.mask && window.maskMessage) {
			window.mask.css("display", "block")
			window.maskMessage.css("display", "block")
		}else {
			var mask = $("<div class=\"datagrid-mask\"></div>");
			mask.css({
				display: "block",
				width: "100%",
				height: $(selector).height(),
				"z-index": 10000
			}).appendTo(selector);
			var maskMessage = $("<div class=\"datagrid-mask-msg\"></div>")
			maskMessage.html("姝ｅ湪澶勭悊锛岃绋嶅€�.....")
				.appendTo(selector).css({
				display: "block",
				left: ($(selector).outerWidth(true) - 190) / 2,
				top: ($(selector).height() - 45) / 2,
				"z-index": 10001
			});
			window.mask = mask; window.maskMessage = maskMessage;
		}
	},
	closeMask: function () {
		$(".datagrid-mask").hide();
		$(".datagrid-mask-msg").hide();
	},
	ajax: function (options) {
		var self = this;
		var defaults = {
			type: 'get',
			dataType: 'json',
			cache: false,
			timeout: self.ajax.timeout,
			beforeSend: function () {
				self.showMask();
			},
			complete: function () {
				self.closeMask();
			},
			error: function () {
				jQuery.messager.alert("閿欒鎻愮ず", '璇锋眰瓒呮椂锛岃绋嶅悗閲嶈瘯', 'error');
			}

		};

		return jQuery.ajax(jQuery.extend(defaults, options));
	},
	get: function (url, data, callback, type) {
		if (jQuery.isFunction(data)) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return this.ajax({
			type: 'get',
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},
	post: function (url, data, callback, type) {
		if (jQuery.isFunction(data)) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return this.ajax({
			type: 'post',
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},
	dealRes: function (options) { // 澶勭悊ajax杩斿洖缁撴灉
		// result,options,success,failure
		var defaults = {
			result: {},
			dlgId: '',
			datagridId: '',
			timeout: 3000,
			title: '鎻愮ず'
		};

		jQuery.extend(true, defaults, options);
		if (defaults.result.code < 0) { // 澶辫触
			if (jQuery.isFunction(defaults.failure)) {
				defaults.failure(defaults.result.message);
			} else {
				new LightTip().error(defaults.result.message, defaults.timeout);
				//jQuery.messager.alert(defaults.title, defaults.result.message, 'error');
			}
		} else {// 鎴愬姛
			if (jQuery.isFunction(defaults.success)) {
				defaults.success(defaults.result.data);
			} else {
				if (defaults.dlgId != '') {
					jQuery('#' + defaults.dlgId).dialog('close');
				}
				if (defaults.datagridId != '') {
					jQuery('#' + defaults.datagridId).datagrid('reload');
				}
				//console.log(defaults.result);
				new LightTip().success(defaults.result.message, defaults.timeout);
				// jQuery.messager.show({
				// 	title: defaults.title,isEmptyObject
				// 	msg: defaults.result.message,
				// 	timeout: defaults.timeout,
				// 	showType: 'fade'
				// });
			}
		}
	},
	combobox: function (options) {
		var defaults = {
			selector: '.combobox',
			params: {
				page: true, // 鏄惁鍒嗛〉
				query: '', // 濡傛灉鏄緭鍏ユ煡璇紝鏌ヨ鐨勫瓧娈�
				selectKey: '', // 榛樿鍊肩殑瀛楁
				selectValue: '', // 榛樿鍊�
				where: '',
				guid: '', // 鍜宻elect鏍囩涓€鏍�
				otherOp: '' // 鍙互鎵╁睍鍏朵粬鐨勬暟鎹睍绀� all 琛ㄧず涓嬫媺鍐呭澧炲姞 锛堝叏閮級 閫夐」
			},
			options: jQuery.extend({
				panelHeight: 'auto',
				url: 'comboboxservice!getData.action'
			}, this.config.combobox)
		};

		jQuery.extend(true, defaults, options);

		if (defaults.params) {
			defaults.options.url = defaults.options.url + '?'
				+ jQuery.param(defaults.params);
		}

		return jQuery(defaults.selector).combobox(defaults.options);
	},
	reloadCombobox: function (selector, url, queryParams) {
		if (url.indexOf('?') > -1) {
			url += "&" + jQuery.param(queryParams);
		} else {
			url += "?" + jQuery.param(queryParams);
		}

		jQuery(selector).combobox('clear').combobox('reload', url);
	},
	comboboxSelectFirst: function () { // combobox鏁版嵁鍔犺浇鎴愬姛鍚庨€夋嫨绗竴鏉★紝浣跨敤鏂规硶
		// onLoadSuccess:entss.comboboxSelectFirst
		var target = $(this);
		var data = target.combobox("getData");
		var options = target.combobox("options");
		if (data && data.length > 0) {
			var fs = data[0];
			target.combobox("setValue", fs[options.valueField]);
		} else {
			target.combobox('clear')
		}
	},
	combotree: function (options) {
		var defaults = {
			selector: '.combotree',
			params: {
				selectKey: '', // 榛樿鍊肩殑瀛楁
				selectValue: '', // 榛樿鍊�
				where: '',
				guid: '' // 鍜宻elect鏍囩涓€鏍�
			},
			options: jQuery.extend({
				lines: true,
				panelHeight: 'auto',
				url: 'comboboxservice!getData.action',
				loadFilter: function (data) {
					// 鎶奷m鍜宮c 杞崲鎴� id 鍜� text
					var newData = [];
					jQuery(data).each(function (i, item) {
						newData.push({
							id: item.dm,
							text: item.mc
						});
					});
					return newData;
				}
			}, this.config.combotree)
		};

		jQuery.extend(true, defaults, options);

		if (defaults.params) {
			defaults.options.url = defaults.options.url + '?'
				+ jQuery.param(defaults.params);
		}

		return jQuery(defaults.selector).combotree(defaults.options);
	},
	reloadCombotree: function (selector, url, queryParams) {
		if (url.indexOf('?') > -1) {
			url += "&" + jQuery.param(queryParams);
		} else {
			url += "?" + jQuery.param(queryParams);
		}

		jQuery(selector).combotree('clear').combotree('reload', url);
	},
	// 鍒濆鍖�
	initCharts: function (options) {
		var def_options = $.extend({}, options);
		require.config({// 璺緞閰嶇疆
			paths: {
				'echarts': (def_options.basePath || '/entss/')
					+ 'styles/js/echarts-2.2.7/doc/js/echarts'
			}
		});
		require(
			def_options.require || ['echarts', 'echarts/chart/bar', // 浣跨敤鏌辩姸鍥惧氨鍔犺浇bar妯″潡锛屾寜闇€鍔犺浇
				'echarts/chart/line' // 浣跨敤鏌辩姸鍥惧氨鍔犺浇line妯″潡锛屾寜闇€鍔犺浇
			],
			function (ec) {// 鍩轰簬鍑嗗濂界殑dom锛屽垵濮嬪寲echarts鍥捐〃
				var myChart = ec.init(document
					.getElementById(def_options.mainId || "main"));
				option = function () {
					if (def_options.chartType === "pie") { // 榛樿鍒濆鍖栨煴鐘舵垨鑰呮姌绾垮浘
						return {
							title: def_options.title || {
								text: '',
								subtext: '',
								x: 'center'
							},
							tooltip: def_options.tooltip || {
								trigger: 'item',
								formatter: "{a} <br/>{b} : {c} ({d}%)"
							},
							legend: def_options.legend || {
								orient: 'vertical',
								x: 'left',
								data: ['鏃犳暟鎹�']
							},
							toolbox: def_options.toolbox || {
								show: true,
								feature: {
									mark: {
										show: true
									},
									dataView: {
										show: true,
										readOnly: false
									},
									restore: {
										show: true
									},
									saveAsImage: {
										show: true
									},
									magicType: {
										show: true,
										type: ['pie', 'funnel'],
										option: {
											funnel: {
												x: '25%',
												width: '50%',
												funnelAlign: 'left',
												max: 1548
											}
										}
									},
								}
							},
							calculable: def_options.calculable === undefined ? true
								: def_options.calculable,
							series: def_options.series || [{
								name: '璁块棶鏉ユ簮',
								type: 'pie',
								radius: '55%',
								center: ['50%', '60%'],
								data: []
							}]
						};
					} else {
						return {
							title: def_options.title || {
								text: ""
							},
							tooltip: def_options.tooltip || {
								trigger: 'axis'
							},
							legend: def_options.legend || {
								data: ['鏃犳暟鎹�']
							},
							toolbox: def_options.toolbox || {
								show: true,
								feature: {
									mark: {
										show: true
									},
									dataView: {
										show: true,
										readOnly: false
									},
									magicType: {
										show: true,
										type: ['line', 'bar']
									},
									restore: {
										show: false
									},
									saveAsImage: {
										show: true
									}
								}
							},
							calculable: def_options.calculable || true,
							xAxis: def_options.xAxis
								|| [{
									type: def_options.xAxis_type
										|| 'category',
									data: def_options.xAxis_data
										|| ['鏃犳暟鎹�'],
									name: def_options.xAxis_name || '',
									axisLabel: def_options.axisLabel
										|| {}
								}],
							yAxis: def_options.yAxis || [{
								type: def_options.yAxis_type || 'value',
								name: def_options.yAxis_yname || ''
							}],
							series: def_options.series || [{
								name: '鏃�',
								type: 'bar',
								stack: '鏁版嵁',
								itemStyle: {
									normal: {
										areaStyle: {
											type: 'default'
										}
									}
								},
								data: []
							}]
						};
					}
				};
				// 涓篹charts瀵硅薄鍔犺浇鏁版嵁
				myChart.setOption(option());
			});
	},
	// 寮圭獥
	openIframeDialog: function (options) {
		var defaults = {
			// id : '',
			// url : '',
			width: 600,
			height: 400,
			title: '鏌ョ湅',
			modal: true,
			hrefMode: "iframe",
			onClose: function () {
				$(this).dialog("destroy");
			}
		};

		options = $.extend(defaults, options);

		// 鍏堟覆鏌揹lg锛屽啀鍔犺浇
		var $dlg = $('<div id="ifmdlg"><iframe scrolling="auto" style="width:100%;height:100%;" frameborder="0"></iframe></div>');
		var ret = $dlg.dialog(options);
		$dlg.find('iframe')[0].src = options.url;
		return ret;
	},
	dialog: function (options, dlgId) {
		var dlg = dlgId || 'dlg';
		var defaults = {
			href: "#",
			width: $(window).width() / 2,
			height: $(window).height() / 2,
			title: "鏌ョ湅",
			modal: true,
			hrefMode: "iframe",
			onClose: function () {
				$(this).dialog("destroy");
			}
		};
		var $dlg = $('<div id="' + dlg + '"></div>');
		return $dlg.dialog($.extend(defaults, options));
	},
	/**
	 * 杩愯涓婁紶鏂囦欢鐨勫悗缂€
	 * @param {string} filename
	 * @param {array|string} suffixs 鎵╁睍鍚嶆暟缁勬垨瀛楃涓诧紝瀛楃涓插涓殑璇濇牸寮忎负exe|txt|xls
	 */
	isAllowUploadFile: function (filename, suffixs) {
		var j = function (suffix) {
			var strRegex = '\.(' + suffix + ')$'; // 鐢ㄤ簬鎵╁睍鍚嶇殑姝ｅ垯琛ㄨ揪寮�
			var re = new RegExp(strRegex);
			if (!re.test(filename.toLowerCase())) {
				return false;
			} else {
				return true;
			}
		}

		if (jQuery.isArray(suffixs)) {
			var isAllow = suffixs.some(function(suffix) {
				return j(suffix);
			})
			if(!isAllow) {
				$.messager.alert("鏂囦欢鏍煎紡涓嶆纭�", "鏀寔涓婁紶" + suffixs.join(',') + "鏍煎紡锛岃閫夋嫨姝ｇ‘鐨勬枃浠剁被鍨�");
				return false;
			}
		} else if (!j(suffixs)) {
			$.messager.alert("鏂囦欢鏍煎紡涓嶆纭�", "鏀寔涓婁紶" + suffixs + "鏍煎紡锛岃閫夋嫨姝ｇ‘鐨勬枃浠剁被鍨�");
			return false;
		}
		return true
	},

	// 鑾峰彇閫変腑琛屾寚瀹氬垪鐨勬暟鎹紝閫楀彿闅斿紑
	getSelectedDataGridIds: function (dataGridId, keyName) {
		var ids = [];
		var rows = $('#' + dataGridId).datagrid('getSelections');

		for (var i = 0; i < rows.length; i++) {
			ids.push(rows[i][keyName]);
		}
		return ids.join(',');
	},

	// ajax鎵归噺鍒犻櫎
	ajaxBatchDelWithConfirm: function (url, delwhat, dataGridId, keyName) {
		var ids = this.getSelectedDataGridIds(dataGridId, keyName);
		if (ids == '') {
			$.messager.alert(delwhat, '璇烽€夋嫨璁板綍!', 'error');
			return false;
		}

		function confirmCallback(r) {
			if (!r) return false;

			showMask();

			function callback(result) {
				closeMask();

				entss.dealRes({
					result: result,
					datagridId: dataGridId,
					title: delwhat,
					timeout: 2000
				});
			}
			entss.post(url, { ids: ids }, callback, 'json');
		}

		$.messager.confirm(delwhat, '纭畾瑕佸垹闄�' + delwhat + '?', confirmCallback);
	},


	// ajax鎵归噺鍒犻櫎鏀寔鍏ㄩ儴
	ajaxBatchDelWithConfirm1: function (url, delwhat, dataGridId, keyName) {
		var ids = this.getSelectedDataGridIds(dataGridId, keyName);

		function confirmCallback(r) {
			if (!r) return false;

			showMask();

			function callback(result) {
				closeMask();

				entss.dealRes({
					result: result,
					datagridId: dataGridId,
					title: delwhat,
					timeout: 2000
				});
			}
			entss.post(url, { ids: ids }, callback, 'json');
		}

		$.messager.confirm(delwhat, '纭畾瑕佸垹闄�' + delwhat + '?', confirmCallback);
	},

	/**
	 * 澶勭悊鎵归噺淇敼璇锋眰 type:寮瑰嚭妗嗙殑绫诲瀷 url: 鏁版嵁婧�(select,combobox) field:瑕佹洿鏂板瓧娈�
	 * pkfield:datagrid涓殑checkbox涓婚敭鍚嶇О
	 */
	doBatchUpdate: function (datagrid, type, url, field, pkField) {
		var keys = this.getSelectedDataGridIds(datagrid, pkField);
		var sval = '';
		switch (type) {
			case 'datebox':
				sval = $("#sval").datebox('getValue');
				break;
			case 'datetimebox':
				sval = $("#sval").datetimebox('getValue');
				break;
			case 'combobox':
				if (!this.validCombobox('sval', 'dm', '')) return false;
				sval = $("#sval").combobox('getValues').join(',');
				break;
			default:
				sval = $("#sval").val();
				break;
		}
		entss.post(url, {
			field: field,
			sval: sval,
			keys: keys
		},
			function (result) {
				layer.closeAll();
				entss.dealRes({
					result: result,
					datagridId: datagrid,
					title: '绯荤粺鎻愮ず',
					timeout: 2000
				});
			}, 'json'
		);
	},
	/**
	 *
	 * 閫氱敤妯℃澘鎺ㄩ€佸疄鐜�
	 * uuid锛氭帹閫佹ā鏉挎爣璇�
	 * datagridId锛氭彁渚涙暟鎹殑 datagird 琛ㄦ牸
	 * dmField: 鐢ㄦ埛浠ｇ爜瀵瑰簲鐨勫瓧娈�
	 * usertype: 鐢ㄦ埛绫诲瀷 榛樿 鏍规嵁 dmField 鍒ゆ柇, 鏃犳硶鍒ゆ柇鍒欎负 t
	 * butTitle: 鎸夐挳鐨勬爣棰橈紝榛樿涓�"鎺ㄩ€�"
	 * 
	 */
	templatePush: function(uuid, datagridId, dmField, usertype, butTitle) {
	   if (!uuid) {
	       throw 'must have a uuid';
	   }
	   if (!dmField) {
	       throw 'must have a dmField';
	   }
	   if (!datagridId) {
	       throw 'must have a datagridId';
	   }
	   var dids = datagridId.split(',');
	   var $dids = [];
	   for (var i = 0; i < dids.length; i++) {
	       var $dl = $('#' + dids[i]);
           if ($dl.length < 1) {
               throw 'id "'+dids[i]+'" not found';
           }
           $dids.push($dl);
	   }
	   if (!usertype) {
	       if (dmField == 'xsdm') {
	           usertype = 's';
	       } else {
	           usertype = 't';
	       }
	   }
	   var tit = butTitle || '鎺ㄩ€�';
	   return {text: tit, iconCls: 'icon-upload', handler: function() {
	       for (var i = 0; i < $dids.length; i++) {
	           if ($dids[i].datagrid('getSelections').length < 1) {
                   $.messager.alert(tit, '璇烽€夋嫨瑕佹帹閫佺殑璁板綍!', 'error');
                   return false;
               }
           }
	       $('<div id="tpdlg"></div>').dialog({
	           href: $("meta[name=ctxPath]").attr("content") + 'new/templatepush/set.page?uuid=' + uuid + '&dmfield=' + dmField + '&usertype=' + usertype + '&tid=' + dids.join(','),
               title: tit,
               width: pageMaxWidth(450),
               height: pageMaxHeight(360),
               hrefMode: "iframe",
               modal: true,
               iconCls:"icon-edit",
               onClose: function(){
                   $(this).dialog("destroy");
               }
	       });
	   }}; 
	},

	/*******************************************************************************
	 * 鎵╁睍combobox锛岀敤浜庨獙璇佹槸鍚︿粠涓嬫媺妗嗕腑閫夊€� para1锛歞omid; para2锛歴etValue target; para3:error msg
	 ******************************************************************************/
	validCombobox: function (domId, valueTarget, msg) {
		var datas;
		var right = true;
		var wrong = false;
		var textField = $('#' + domId).combobox('options').textField;
		var val = $('#' + domId).combobox('getValue');
		var text = $('#' + domId).combobox('getText');
		datas = $('#' + domId).combobox('getData');
		if (text != '') {
			for (var obj in datas) {
				if (val == datas[obj][valueTarget]) return right;
			}
			for (var obj in datas) {
				if (text == datas[obj][textField]) {
					$('#' + domId).combobox('setValue', datas[obj][valueTarget]);
					return right;
				}
			}
			$.messager.alert('璀﹀憡!', '<br>璇烽€夋嫨' + msg + '涓嬫媺妗嗙殑鍊�!', 'warning');
			return wrong;
		}
		return right;
	},

	isLocalStoreToCaseders: {}, //鏄惁涓虹骇鑱旂紦瀛樺垵濮嬪寲
	/**
	 * 绾ц仈灏佽
	 * @param selector 鐖剁骇鍏冪礌閫夋嫨鍣�
	 * @param doChange 鏄惁鎵ц鍙樺姩锛堝鏋滄湁璁剧疆缂撳瓨涓嶇敤浼�, 鍥犱负缂撳瓨鍒濆鍖栨椂浼氳嚜鍔ㄨЕ鍙戯級
	 * @returns {{update: update}}
	 */
	caseder: function (selector, doChange) {
		var m = {}; // 绾ц仈鍚嶅瓧瀵瑰簲鐨刣om
		var ajaxPromiseList = []

		// 鍒ゆ柇鏄惁浼犲弬锛屽鏋滄湭浼犲弬锛屽垯灏哻ombobox鐨刴ode鏀逛负remote
		var hasParam = false;
		function execute() {
			Promise.all(ajaxPromiseList).then(function(allRet) {
				var result = {}
				for(var i = 0; i < allRet.length; i++) {
					for(var key in allRet[i]) {
						result[key] = allRet[i][key]
					}
				}
				// 閲嶆柊娓叉煋
				$.each(result, function (k, v) {
					if (!m[k]) {
						return;
					}
					for (let i = 0; i < m[k].length; i++) {
						var domObj = m[k][i];
						var value = "";
						// 淇濈暀涔嬪墠绗竴涓负绌虹殑select鍊�
						if (domObj.hasClass('combobox-f')) {
							var options = domObj.combobox('options');
							var combov = options.value;
							if (!combov) {
								// 鏈缃甐alue,鍙杁ata绗竴涓负绌虹殑
								var tdata = domObj.combobox('getData')[0];
								if (tdata && !tdata[options.valueField] && tdata[options.textField]) {
									combov = tdata[options.textField];
								}
							}
							// 缂栬緫鐣岄潰浼氬鑷磋仈鍔ㄥ悗澶氫竴涓棤鍏崇殑鍊�
							/*if (combov) {
                                v.splice(0, 0, { dm: '', mc: combov });
                            }*/
						} else if (domObj.hasClass('combotree-f')) { // combotree
							/*var combov = domObj.combotree('options').value;
                            if (combov) {
                                v.splice(0, 0, { dm: '', mc: combov });
                            }*/
						} else if (domObj[0].tagName == 'SELECT') { // select
							value = $(domObj.find('option:selected')).val();
							var f = domObj.find('option:first');
							if (!f.val() && f.text()) {
								v.splice(0, 0, {dm: '', mc: f.text()})
							}
						}

						// 鑾峰彇easyui鐨勫瓧娈�
						var options = {valueField: 'id', textField: 'text'};
						if (domObj.hasClass('combobox-f')) {
							options = domObj.combobox('options');
						}

						var combodata = [];
						var domdata = '';
						// 鎷兼帴鍏冪礌鎴杁ata
						$.each(v, function (i, item) {
							if (value && item.dm == value) {
								domdata += '<option selected value="' + item.dm + '">' + item.mc + '</option>';
							} else {
								domdata += '<option value="' + item.dm + '">' + item.mc + '</option>';
							}
							var tempj = {};
							for (var key in item) {
								tempj[key] = item[key];
							}
							tempj[options.valueField] = item.dm;
							tempj[options.textField] = item.mc;
							combodata.push(tempj);
						});

						// 娓叉煋
						if (domObj.hasClass('combobox-f')) {
							if (hasParam) {
								options['mode'] = 'local';
								options['filter'] = function (q, row) {
									return row[options.textField].indexOf(q) >= 0;
								};
							} else {
								options['mode'] = 'remote';
							}
							if ($(domObj).data('initdata')) {
								$(domObj).removeData('initdata')
							} else {
								if (entss.isLocalStoreToCaseders[k] == null) {
									var newv = [];
									var oldv = domObj.combobox('getValues');
									$.each(combodata, function (ti, titem) {
										for (var o in oldv) {
											if (oldv[o] == titem.dm) {
												newv.push(o);
											}
										}
										if (newv.length == oldv.length) {
											return false;
										}
									})
									if (newv.length != oldv.length) {
										domObj.combobox('clear');
									}
								}
							}
							domObj.combobox('loadData', combodata);
						} else if (domObj.hasClass('combotree-f')) { // combotree
							if ($(domObj).data('initdata')) {
								$(domObj).removeData('initdata')
							} else {
								if (entss.isLocalStoreToCaseders[k] == null) {
									domObj.combotree('clear');
								}
							}
							domObj.combotree('loadData', combodata);
						} else if (domObj[0].tagName == 'SELECT') { // select
							// 娓呯┖閲嶆柊娣诲姞
							domObj.empty();
							domObj.append(domdata);
						}
					}
				});

				// 鎵цchange鏂规硶
				$.each(m, function (k, v) {
					if (v) {
						for (let i = 0; i < v.length; i++) {
							var dochange = v[i].attr('caseder-change');
							if (dochange) {
								eval(dochange + '()');
							}
						}
					}
				});
			}).finally(function() {
				ajaxPromiseList.length = 0
			})
		}

		$(selector).find('*[caseder]').each(function () {
			var $this = $(this);
			var name = $this.attr("caseder");
			if (!m[name]) {
				m[name] = [];
			}
			m[name].push($this);

			// 濡傛灉涓嶉渶瑕佽Е鍙戣仈鍔紝鐩存帴璺宠繃
			if ($this.is('[no-caseder]')) {
				return true;
			}

			function callback() {
				hasParam = false //鐢变簬鍙傛暟澶氫釜caseder鍏辩敤,鎵€浠ユ瘡娆″厛璁剧疆涓篺alse
				// 鏀堕泦鍙傛暟浼犻€掑埌鍚庡彴
				var postData = {};
				postData.guid = $this.attr("caseder");
				$.each(m, function (k, v) {
					for (let i = 0; i < v.length; i++) {
						var domObj = v[i];
						// val鍙傛暟缁戝畾
						var value = '';
						var valueArr = [];
						if (domObj.hasClass('combobox-f')) {
							valueArr = domObj.combobox('getValues');
						} else if (domObj.hasClass('combotree-f')) { // combotree
							valueArr = domObj.combotree('getValues');
						} else if (domObj[0].tagName == 'SELECT') { // select
							domObj.find("option:selected").each(function () {
								valueArr.push($(this).val());
							});
						}

						for (var c = valueArr.length - 1; c >= 0 ; c--) {
							if (valueArr[c].indexOf('鍏ㄩ儴') != -1 || valueArr[c].indexOf('澶氶€�') != -1) {
								valueArr.splice(c, 1)
							}
						}

						value = valueArr.join(',');

						if (value) {
							hasParam = true
						}

						postData[k] = value

						// data鍙傛暟
						if (domObj.data('caseder')) {
							$.each(domObj.data('caseder'), function (dk, dv) {
								postData[k + "." + dk] = dv;
							});
						}
					}
				});

				ajaxPromiseList.push(new Promise(function(resolve) {
					entss.post(
						getCtxPath() + 'new/cascader/datas',
						postData,
						resolve
					);
				}))
			}

			// 缁戝畾change浜嬩欢
			$this.change(function (e, isFirst) {
				callback()
				execute()
			});


			if ($this.hasClass('combobox-f')) {
				$this.combobox({
					onChange: function (newValue, oldValue) {
						entss.isLocalStoreToCaseders = {}
						$this.change();
					}
				});
				var v = $this.combobox('getValues');
				if (v.length > 0 && doChange && v[0].indexOf("鍏ㄩ儴") != -1 && v[0].indexOf("澶氶€�") != -1) {
					callback()
				}
			} else if ($this.hasClass('combotree-f')) { // combotree
				$this.combotree({
					onChange: function (newValue, oldValue) {
						entss.isLocalStoreToCaseders = {}
						$this.change();
					}
				});
				var v = $this.combotree('getValues');
				if (v.length > 0 && doChange && v[0].indexOf("鍏ㄩ儴") != -1 && v[0].indexOf("澶氶€�") != -1) {
					callback()
				}
			} else if ($this[0].tagName == 'SELECT') { // select
				// 娓呯┖閲嶆柊娣诲姞
				if ($this.val() && doChange) {
					entss.isLocalStoreToCaseders = {}
					callback()
				}
			}
		});


		return {
			update: function($this, oldKey, newKey) {
				var casederAll = $(selector).find('*[caseder]')

				casederAll.each(function() {
					if(this === $this) {
						var oldValue = m[oldKey]
						delete m[oldKey]
						m[newKey] = oldValue
					}
				})
			}
		}

	},

	// 鍒ゆ柇娴忚鍣ㄦ槸鍚︽敮鎸乴ocalstorage
	supportLocalStorage: function () {
		if (navigator.userAgent.indexOf('UCBrowser') > -1) {
			return false;
		}
		var uaFlag = 0;
		var uaArr = new Array('Chrome', 'MQQBrowser', 'QQ', 'TBS', 'wxwork', 'MicroMessenger', 'T7', 'baiduboxapp', 'baidubrowser', 'MiuiBrowser', 'NetType', 'OPR');
		for (var i = 0; i < uaArr.length; i++) {
			if (navigator.userAgent.indexOf(uaArr[i]) > -1) {
				uaFlag = 1;
			}
		}
		if (uaFlag != 1) {
			if (navigator.userAgent.indexOf('HUAWEIEVA') > -1 || navigator.userAgent.indexOf('HUAWEIVTR') > -1) {
				return false;
			}
		}
		var testKey = 'test';
		try {
			window.localStorage.setItem(testKey, 'testValue');
			window.localStorage.removeItem(testKey);
			return true;
		} catch (e) {
			return false;
		}

	},

	// 鍒濆鍖栦笂娆￠€変腑鐨勫€�
	initAutocache: function (selector) {
		// 鍒ゆ柇娴忚鍣ㄦ槸鍚︽敮鎸乴ocalstorage
		if (!this.supportLocalStorage()) return false;

		var $dom = $(selector);

		// 鑾峰彇storage瀛樺偍鐨勫唴瀹�
		var saveCache = window.localStorage.getItem(selector);
		if (!saveCache) {
			return false;
		}
		var cacheObj = JSON.parse(saveCache);

		$dom.find('*[autocache]').each(function () {
			// 绫诲瀷鍒ゆ柇
			var iType = $(this)[0].tagName;
			var id = $(this).attr('id');
			var aType = ($(this).attr('type')||'').toLowerCase();
			if (cacheObj[id] == null || cacheObj[id] === '') {
				return true;
			}
			var isCaseder = $(this).attr('caseder');

			// combobox
			if ($(this).hasClass('combobox-f')) {
				$(this).data('initdata', 'initdata');
				$(this).combobox('setValues', cacheObj[id]);
			} else if ($(this).hasClass('combotree-f')) { // combotree
				$(this).data('initdata', 'initdata');
				$(this).combotree('setValues', cacheObj[id]);
			} else if ($(this).hasClass('combo-f')) { // combo
				$(this).combo('setValues', cacheObj[id]);
			} else if (iType == 'INPUT' && aType == 'checkbox') {// 澶氶€夋
				$(this).prop('checked', cacheObj[id]);
			} else if (iType == 'INPUT' || iType == 'TEXTAREA') { // input鍜宼extarea
				$(this).val(cacheObj[id]);
			} else if (iType == 'SELECT') {	// select
				var that = $(this);
				// 鎯呭喌閫変腑鐨�
				that.find('option:selected').attr('selected', false);
				$.each(cacheObj[id], function (k, v) {
					var $o = that.find('option[value="' + v + '"]');
					if ($o.length > 0) {
						$o.attr('selected', true);
					}
				});

				if(isCaseder) { //濡傛灉鏄痵elect,绾ц仈璇锋眰鏁版嵁
					$(this).change();
				}
			}
		});
	},
	clearAutoCache: function(selector) {
		//娓呴櫎娴忚鍣ㄧ紦瀛�
		if(!this.supportLocalStorage()) return false;

		var localStorage = window.localStorage;
		if(!localStorage.getItem(selector)) return false;

		var $dom = $(selector);
		localStorage.removeItem(selector)

		$dom.find('*[autocache]').each(function () {
			// 绫诲瀷鍒ゆ柇
			var iType = $(this)[0].tagName;
			var id = $(this).attr('id');
			var aType = ($(this).attr('type')||'').toLowerCase();

			// combobox
			if ($(this).hasClass('combobox-f')) {
				$(this).combobox('setValues', '');
			} else if ($(this).hasClass('combotree-f')) { // combotree
				$(this).combotree('setValues', '');
			} else if ($(this).hasClass('combo-f')) { // combo
				$(this).combo('setValues', '');
			} else if (iType == 'INPUT' && aType == 'checkbox') {// 澶氶€夋
				$(this).attr('checked', false);
			} else if (iType == 'INPUT' || iType == 'TEXTAREA') { // input鍜宼extarea
				$(this).val('');
			} else if (iType == 'SELECT') {	// select
				var that = $(this);
				// 鎯呭喌閫変腑鐨�
				that.find('option:selected').attr('selected', false);
			}
		});
	},
	// 鏋勫缓鏈閫変腑鐨勭紦瀛�
	makeAutoCache: function (selector) {
		// 鍒ゆ柇娴忚鍣ㄦ槸鍚︽敮鎸乴ocalstorage
		if (!this.supportLocalStorage()) return false;

		var $dom = $(selector);
		var cacheObj = {};

		$dom.find('*[autocache]').each(function () {
			// 绫诲瀷鍒ゆ柇
			var iType = $(this)[0].tagName;
			var id = $(this).attr('id');
			// type 灞炴€�
			var aType = ($(this).attr('type')||'').toLowerCase();
			// combobox
			if ($(this).hasClass('combobox-f')) {
				cacheObj[id] = $(this).combobox('getValues');
			} else if ($(this).hasClass('combotree-f')) { // combotree
				cacheObj[id] = $(this).combotree('getValues');
			} else if ($(this).hasClass('combo-f')) { // combo
				cacheObj[id] = $(this).combo('getValues');
			} else if (iType == 'INPUT' && aType == 'checkbox') {
				// 澶氶€夋
				cacheObj[id] = $(this).prop('checked');
			} else if (iType == 'INPUT' || iType == 'TEXTAREA') { // input鍜宼extarea
				cacheObj[id] = $(this).val();
			} else if (iType == 'SELECT') { // select
				var selectArr = [];
				$(this).find("option:selected").each(function () {
					selectArr.push($(this).val());
				})
				cacheObj[id] = selectArr;
			}
		});

		window.localStorage.setItem(selector, JSON.stringify(cacheObj));
	},
    /**
     * 鑾峰彇 鍗犱綅绗� 鏂囨湰鎵€闇€鐨刣g琛ㄦ牸鏁版嵁锛屾牸寮忎负json 瀛楃涓诧細绫讳技[{"濮撳悕":"xxx","瀛﹀彿":"xxx"},{"濮撳悕":"xxx","瀛﹀彿":"xxx"}]
     * @param content 鍖呭惈鍗犱綅绗︾殑鏂囨湰
     * @param datagridIds dg琛ㄦ牸 id 鏁扮粍
     * @param pkfiled 琛ㄦ牸涓婚敭 filed锛岃繑鍥炵粨鏋滀細棰濆甯︿笂姝ゅ垪
     * @returns {string}
     */
    getDatagridPlaceholderData: function (content, datagridIds = [], pkfiled) {
        if (datagridIds.length < 1) {
            throw new Error("param datagridIds cannot be empty");
        }
        if (!pkfiled) {
            throw new Error("param pkfiled cannot be empty");
        }
        if (!content) {
            return '[]';
        }
        var $dls = [];
        for (var i = 0; i < datagridIds.length; i++) {
            var $1 = $('#' + datagridIds[i]);
            if ($1.length < 1) {
                throw new Error(datagridIds[i] + " not found");
            }
            $dls.push($1);
        }

        var isBlank = function (str) {
            return typeof(str) == 'undefined' || str == null || str === '';
        }

        var exp = /\{@.+?\}/g;
        var col = [];
        var res;
        while ((res = exp.exec(content)) != null) {
            var key = res[0].substr(2, res[0].length - 3).trim();
            col.push(key);
        }

        var colu = {};
        for (var i = 0; i < $dls.length; i++) {
            var columns = $dls[i].datagrid('options').columns;
            for (var k = 0; k < columns.length; k++) {
                $.each(columns[k], function(i, item) {
                    // 浠呰幏鍙栭渶瑕佸瓧娈�
                    if (col.indexOf(item.title) != -1) {
                        colu[(isBlank(item.title) ? '-' : item.title).trim()] = item.field;
                    }
                });
            }
        }

        var other = {};
        var $main;// 涓昏鏁版嵁琛ㄦ牸锛堟暟鎹€変腑澶氱殑閭ｄ竴涓級
        for (var i = 0; i < $dls.length; i++) {
            var r = $dls[i].datagrid('getSelections');
            if (r.length == 1) {
                for (var k in colu) {
                    other[k] = r[0][colu[k]] + '';
                }
                other[pkfiled] = r[0][pkfiled] + '';
            } else {
                $main = $dls[i];
            }
        }
        if ($dls.length === 1) {
            $main = $dls[0];
        }

        var rowdata = [];
        // 灏嗕腑鏂囧垪瀵瑰簲鐨勬暟鎹彇鍑猴紝 __id 瀛樺偍鐢ㄦ埛璐﹀彿
        var rows = $main.datagrid('getSelections');
        $.each(rows, function(j, jtem) {
            var tmp = $.extend({}, other);
            for (var k in colu) {
                tmp[k] = isBlank(jtem[colu[k]]) ? other[k] : jtem[colu[k]] + '';
            }
            tmp[pkfiled] = isBlank(jtem[pkfiled]) ? other[pkfiled] : jtem[pkfiled] + '';
            rowdata.push(tmp);
        });
        return JSON.stringify(rowdata);
    },

	alert: function(content, title, type) {
		type = type == null ? 'info' : type;
		title = title == null ? '鎻愮ず' : title;
		content = content == null ? '璇风‘瀹氳缁х画鍚楋紵' : content;

		$.messager.alert(title, content, type);
	},
 	isEmptyObject: function(obj) {
		var hasOwn = {}.hasOwnProperty;
	
		for (var key in obj) {
			if(hasOwn.call(obj, key)) {
				return false;
			}
		}
		return true;
	},
	isObject: function(obj) {
		return Object.prototype.toString.call(obj) === '[object Object]';
	},
	getValueCombobox: function (selector) {
		return $(selector).combobox('getValues')	
	},
	clearCombobox: function (selector) {
		var selector = $(selector);
		selector.combobox('clear');
		return selector;
	},
	/* 鏍规嵁鏁扮粍鎺掑簭 & 鍒嗗壊鎴愬瓧绗︿覆 */
	getSortValue: function (arr, joinStr) {
		if (joinStr == null) {
			joinStr = ','
		}

		return arr.sort().join(joinStr);
	},
	replaceStr: function(str) { 
		var args = Array.prototype.slice.call(arguments, 1),
			map = {},
			defaultReturnValue = ''; //瀛楃涓蹭笉瀛樺湪鐨勯粯璁よ繑鍥炲€�
		if(this.isObject(args[0])) {
			map = args[0];
		}
	
		//1. 鏍规嵁鍙橀噺鏉ユ浛鎹�
		if(!this.isEmptyObject(map)) {
			return str.replace(/\{\s*(\w+)\s*\}/g, function (match, $1) {
				return map[$1] || defaultReturnValue;
			});
		}
	
		//2. 鏍规嵁瀛楃涓瞷1}鎴杮$$}鍗犱綅绗︽浛鎹�
		var count = -1; //璁＄畻榛樿鍗犱綅绗︾殑涓嬫爣绱㈠紩
		return str.replace(/\{\s*(\d+|\$\$)\s*\}/g, function(match, $1) {
			count += 1;
			if($1 === '$$') {
				return args[count] || defaultReturnValue;
			}
	
			return args[$1-1] || defaultReturnValue;
		});
	},
	findIndex: function (arr, func) {
		if (arr.findIndex) {
			return arr.findIndex(func);
		}

		//鍏煎IE10浠ヤ笅
		var index = -1;
		for(var i = 0; i < arr.length; i++) {
			if (func(arr[i], i)) {
				index = i;
				break;
			}
		}

		return index;
	},
	upload: function(options) {
		var _options = {
			fileSelector: '#file', //type="file"鏂囦欢闅愯棌鎸夐挳id
			buttonSelector: '#showfile', //鏄剧ず鎸夐挳id
			exts: [], //鏀寔鍚庣紑鍚�
		}
		Object.assign(_options, options)

		var fileSelector =  _options.fileSelector
		var buttonSelector =  _options.buttonSelector

		var $file = $(fileSelector);

		$file.attr('hidden', 'hidden');

		$(buttonSelector).on("click", function() {
			$file[0].click();
		});
		$file.on("change", function(e) {
			var event = e || window.event;
			var target = event.target || event.currentTarget;
			var filename = target.files[0].name

			if($(fileSelector).val() == '') {
				$.messager.alert('鎻愮ず淇℃伅','璇烽€夋嫨瀵煎叆鏂囦欢!','warning');
				$(fileSelector).val('')
				return false;
			}else if(!entss.isAllowUploadFile($(fileSelector).val(), _options.exts)) {
				$(fileSelector).val('')
				return false;
			}

			if(!$(buttonSelector).next().hasClass('fileText')) {
				$(buttonSelector).after('<span class="fileText"></span>')
			}
			var fileTextDom = $(buttonSelector).next('.fileText')
			fileTextDom.text(filename);
			fileTextDom.attr('title', filename)
		});
	},
	getRowsIds: function (rows, pkfield) {
		let pks = [];
		for(let i = 0; i < rows.length; i++) {
			let pk = rows[i][pkfield];
			pks.push(pk);
		}
		return pks.join(',');
	},
	/**
	 * rows: 閫変腑鐨勮瀹℃牳鐨勬暟鎹�
	 * params: 瀹℃牳闇€瑕佺殑鍊硷紝闇€瑕佸寘鍚粯璁ょ殑鍐呭
	 */
	makeAuditParam:function(rows, params) {
		if (!params.lcdm || !params.pkfield || rows.length < 1) {
			return '';
		}
        let defaultOpt = {
    		lcdm: '',
    		pkfield: '',
    		kkyxfield: 'kkyxdm',
    		xsyxfield: 'xsyxdm',
    		kkjysfield: 'kkjysdm',
    		bjfield: 'bjdm',
    		jxcdfield: 'jxcddm',
    		showleft: true
    	}
    	let param = [];
    	let options = $.extend({}, defaultOpt, params);
    	for(k in options) {
			if (!['kkyxfield', 'xsyxfield', 'kkjysfield', 'bjfield', 'jxcdfield'].includes(k)) {
				param.push(k+'='+options[k]);
			}
		}
		
		let pks = [];
		let pkparam = {};
		for(let i = 0; i < rows.length; i++) {
			let pk = rows[i][options.pkfield];
			pks.push(pk);
			pkparam[pk] = {
				kkyxdm: rows[i][options.kkyxfield]||'',
				xsyxdm: rows[i][options.xsyxfield]||'',
				kkjysdm: rows[i][options.kkjysfield]||'',
				bjdm: rows[i][options.bjfield]||'',
				jxcddm: rows[i][options.jxcdfield]||''
			};
		}
		
		param.push('pks='+pks);
		param.push('data='+getCn(JSON.stringify(pkparam)));
    	return param.join('&');
	}
};

(function () {
	jQuery.fn.extend({
		uibutton: function(options) {
			//console.log(options)
			var $this = $(this)
			if(options === 'disable') {
				//绂佺敤鐘舵€�
				for(var i = 0; i < $this.length; i++) {
					var tagName = $this[i].tagName
					if(tagName === 'A') {
						//a鏍囩
						$this.css({'pointer-events': 'none'})
						$this.addClass('disabled')
					}else if(tagName === 'INPUT' || tagName === 'BUTTON') {
						$this.addClass('disabled')
					}
				}
			}else if(options === 'enable') {
				for(var i = 0; i < $this.length; i++) {
					var tagName = $this[i].tagName
					if(tagName === 'A') {
						//a鏍囩
						$this.css({'pointer-events': 'auto'})
						$this.removeClass('disabled')
					}else if(tagName === 'INPUT' || tagName === 'BUTTON') {
						$this.removeClass('disabled')
					}
				}
			}
		}
	})
	jQuery
		.extend(
			jQuery.fn.datagrid.defaults.editors,
			{
				combo: {
					init: function (container, options) {
						if (options.id === undefined)
							options.id = 'cc';
						var input = jQuery(
							'<select id="' + options.id
							+ '"></select>').appendTo(
								container);
						input.combo(options);
						var html = "";
						html += '<div id="sp_' + options.id + '">';
						var id = options.valueField || 'dm', name = options.textField
							|| 'mc';
						for (var i = 0; i < options.data.length; i++) {
							html += '<input type="checkbox" name="lang" value="'
								+ options.data[i][id]
								+ '"><span>'
								+ options.data[i][name]
								+ '</span><br/>';
						}
						html += '</div>';
						jQuery(html).appendTo(
							jQuery('#' + options.id).combo(
								jQuery.extend({
									panelHeight: 'auto'
								}, options.comboOp)).combo(
									'panel'));
						jQuery('#sp_' + options.id + ' input')
							.click(
								function () {
									var _value = "";
									var _text = "";
									jQuery(
										"#sp_"
										+ options.id
										+ " input[name=lang]:input:checked")
										.each(
											function () {
												_value += $(
													this)
													.val()
													+ ",";
												_text += $(
													this)
													.next(
														"span")
													.text()
													+ ",";
											});
									if (_value.length > 0) {
										_value = _value
											.substring(
												0,
												_value.length - 1);
									}
									if (_text.length > 0) {
										_text = _text
											.substring(
												0,
												_text.length - 1);
									}
									jQuery('#' + options.id)
										.combo('setValue',
											_value)
										.combo('setText',
											_text);
								});
						return input;
					},
					destroy: function (target) {
						jQuery(target).combo('destroy');
					},
					getValue: function (target) {
						return jQuery(target).combo('getValue');
					},
					setValue: function (target, value, options) {
						jQuery(target).combo('setValue');
						// 鍒濆鍖朿heckbox閫変腑鐘舵€�
						var selectedValues = value.split(",");
						var optionsId = jQuery(jQuery(target)[0]).attr(
							"id");
						var _value = "";
						var _text = "";
						selectedValues
							.forEach(function (v2) {
								jQuery(
									"#sp_"
									+ optionsId
									+ " input[name=lang]")
									.each(
										function () {
											if (jQuery(this)
												.val() === v2) {
												jQuery(this)
													.attr(
														"checked",
														"checked");
												_value += jQuery(
													this)
													.val()
													+ ",";
												_text += jQuery(
													this)
													.next(
														"span")
													.text()
													+ ",";
											}
										});
							});
						if (_value.length > 0)
							_value = _value.substring(0,
								_value.length - 1);
						if (_text.length > 0)
							_text = _text
								.substring(0, _text.length - 1);
						jQuery('#' + optionsId).combo('setValue',
							_value).combo('setText', _text);
					},
					resize: function (target, width) {
						jQuery(target).combo('resize', width);
					}
				}
			});

	Function.prototype.before = function(beforefn) {
		var _self = this;
		return function() {
			beforefn.apply(this, arguments);
			return _self.apply(this, arguments);
		}
	}
	//閲嶅啓combotree
	function newCombotree() {
		var options = arguments[0];
		var self = this;
		if(typeof options === 'object' && options !== null) {
			//鍒濆鍖栧嚱鏁�
			var dialogLifeCycle = {
				onClick: function () {
				}
			}
			var dialogNewLifeCycle = {
				onClick: function (node) {
					var tree = $(self).combotree('tree');
					if(node.checked) {
						tree.tree('uncheck', node.target)
					}else {
						tree.tree('check', node.target)
					}
					return dialogLifeCycle.onClick.apply(self, arguments)
				}
			}

			//姝ｅ父澶勭悊
			for(var lifeMethod in dialogLifeCycle) {
				if(options[lifeMethod] && typeof options[lifeMethod] === 'function') {
					dialogLifeCycle[lifeMethod] = options[lifeMethod]
				}
				options[lifeMethod] = dialogNewLifeCycle[lifeMethod]
			}
		}
	}
	var newCombotreeFn = $.fn.combotree.before(newCombotree);
	$.extend(true, newCombotreeFn, $.fn.combotree)
	$.fn.combotree =  newCombotreeFn
}());

/**
 * 甯歌鐨勮嚜鍔ㄦ祴璇曞伐鍏凤紝椹卞姩娴忚鍣ㄦ覆鏌撳唴鏍革細
 * WebDriver鍐呮牳锛歱uppeteer銆丼elenium
 * Webkit鍐呮牳锛歋plash
 */
;(function(win) {
	var doc = win.document, docEl = doc.documentElement, navigator = win.navigator;
	var reptileHandles = [], reptileCallback = function() {
		docEl.innerHTML = '璇蜂笉瑕佷娇鐢ㄨ嚜鍔ㄥ寲宸ュ叿璁块棶'
		// win.location.href = win.location.host
	};
	/*******鐗瑰緛鍙嶇埇铏玈tart*****/
	// webDriver鑷姩鍖栧伐鍏峰唴鏍告覆鏌� keywords
	function detectWebDriver() {
		const r = [];
		const w = ['webdriver', '__driver_evaluate', '__webdriver_evaluate',
			' __selenium_evaluate', '__fxdriver_evaluate', '__driver_unwrapped',
			'__webdriver_unwrapped', '__selenium_unwrapped', '__fxdriver_unwrapped',
			'_Selenium_IDE_Recorder', '_selenium', 'calledSelenium',
			'_WEBDRIVER_ELEM_CACHE', 'ChromeDriverw', 'driver-evaluate',
			'webdriver-evaluate', 'selenium-evaluate', 'webdriverCommand',
			'webdriver-evaluate-response','__webdriverFunc', '__webdriver_script_fn',
			'__$webdriverAsyncExecutor', '__lastWatirAlert',
			'__lastWatirConfirm', '__lastWatirPrompt', '$chrome_asyncScriptInfo',
			'$cdc_asdjflasutopfhvcZLmcfl_', '_phantom', '_phantomas'];
		w.forEach(function(t) {
			if (!!win[t] || !!docEl.getAttribute(t) || !!navigator[t]) {
				r.push(t);
			}
		});
		return r;
	}
	function featuresUserAgent() {
		var userAgent = navigator.userAgent, r = [],
			w = [/HeadlessChrome/, /Splash/, /selenium/];

		w.forEach(function (t) {
			if(t.test(userAgent)) {
				r.push(t);
			}
		})
		return r;
	}

	reptileHandles.push(function() {
		return detectWebDriver().length > 0
	}, function() {
		return featuresUserAgent().length > 0
	})

	/*******鐗瑰緛鍙嶇埇铏獷nd*****/
	var isReptile = reptileHandles.some(function(fn) {
		var flag = fn();
		if(flag) {
			console.log(fn.toString());
		}
		return flag || false;
	})
	//濡傛灉鏈変竴涓繑鍥瀟rue灏辨槸鐖櫕
	if(isReptile) {
		reptileCallback();
	}
})(window);