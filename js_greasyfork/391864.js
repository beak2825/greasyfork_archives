// ==UserScript==
// @name         tapd
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  tapd notification
// @author       hugh
// @match        https://www.tapd.cn/49815309/bugtrace/*
// @exclude      https://www.tapd.cn/49815309/bugtrace/bugs/view*
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/391864/tapd.user.js
// @updateURL https://update.greasyfork.org/scripts/391864/tapd.meta.js
// ==/UserScript==

(function () {
    'use strict';

	window.tapdCustomConfig = {
		nameFormat : {
            'boyushen': '泊 毓 燊',
            'caixiaojia': '蔡 晓 佳',
            'caoqiang': '曹     强',
            'chengcaiwu': '程 才 伍',
            'chenjiayao': '陈 佳 垚',
            'chenjieling' : '陈 杰 凌',
            'chenjunfu': '陈 俊 孚',
            'chenweijie': '陈 炜 杰',
            'chenzefeng': '陈 泽 锋',
            'huangjianmin':'黄 健 铭',
            'lichenyinhao': '李 宸 胤 皓',
            'liufangling': '刘 芳 玲',
            'liyuchang': '李 玉 昌',
            'luxiaofeng': '卢 晓 锋',
            'maxiaoyun': '马 晓 云',
            'maxingzheng': '马 杏 争',
            'minzuzhe': '闵 祖 哲',
            'pengzixian': '彭 子 贤',
            'wangxiang': '王    翔',
            'yanwu': '严     武',
            'zhutaipeng@qinsilk.com': '朱 泰 鹏',
            '谢松_研发': '谢    松',
            '经理项目经理': '赖 宇 林',
            '黄键涛': '黄 键 涛',
            '龙涛': '龙    涛',
            '--': '未 指 派'

        },
        filter:{'处理人': {'type': '', 'val': ['chenzefeng','caoqiang']}
		},
		refreshTime: 300,
		beforeCollect: null,
		collected: null,
		sendNotifition: null,
		showHasBody: true
	}

	var tapdConfig = {
		supportFieldName: ['ID', 'TB开发任务ID', '标题', '严重程度', '优先级', '状态', '处理人', '开发人员'],
        supportFieldFormat: {
            '标题': function(el) {
                return $.trim($(el).find('div a').attr('title'));
            },
            '开发人员': function(el) {
                return $.trim($(el).find(':last-child').html()).replace(' &nbsp;', '').replace(/;$/, '');
            },
            '处理人': function(el) {
                return $.trim($(el).find(':last-child').html()).replace(' &nbsp;', '').replace(/;$/, '');
            },
            '优先级': function(el) {
                return $.trim($(el).find(':last-child').html()).replace(' &nbsp;', '').replace(/;$/, '');
            }
		},
		supportFilterType: {'TYPE_NOT': 'not'}
	}

    var _tapdHelper = {
        fieldIndex:{},
		handleResult: {},
		doFilter: function(item) {
			var isFilter = false;
			if (window.tapdCustomConfig.filter && Object.getOwnPropertyNames(window.tapdCustomConfig.filter).length > 0) {
                for(var f in window.tapdCustomConfig.filter) {
                    // had more filter rule
                    if (isFilter) {
                        isFilter = false;
                    }
                    var itemVal = item[_tapdHelper.fieldIndex[f]];
                    var type = window.tapdCustomConfig.filter[f].type;
                    var fval = window.tapdCustomConfig.filter[f].val;
                    if (type == tapdConfig.supportFilterType.TYPE_NOT) {
                        if (fval.indexOf(itemVal) == -1) {
                            isFilter = true;
                        }
                    } else {
                        if (fval.indexOf(itemVal) != -1) {
                            isFilter = true;
                        }
                    }
                    // must all filter pass
                    if (!isFilter) {
                        break;
                    }
                }
            } else {
				// no filter
                isFilter = true;
            }
			return isFilter;
		},
		mergeResult: function(item) {
			var isFilter = _tapdHelper.doFilter(item);
			var handler = item[_tapdHelper.fieldIndex['处理人']];
            var level = item[_tapdHelper.fieldIndex['严重程度']];
            if (_tapdHelper.handleResult[handler]) {
                _tapdHelper.handleResult[handler].taskCount++;
            } else {
                _tapdHelper.handleResult[handler] = {};
                _tapdHelper.handleResult[handler].isFilter = isFilter;
                _tapdHelper.handleResult[handler].taskCount = 1;
            }
            _tapdHelper.handleResult[handler].level = _tapdHelper.handleResult[handler].level || {};
            if (_tapdHelper.handleResult[handler].level[level]) {
                _tapdHelper.handleResult[handler].level[level]++;
            } else {
                _tapdHelper.handleResult[handler].level[level] = 1;
            }
		},
		_formatResult: function(text, name, item, moreMsg){
            if (moreMsg) {
                text += '\n' + getCnName(name) + ': ' + item.taskCount;
                for (var k in item.level) {
                    text += ' ,' + (k == '--' ? '无' : k) + ':' + item.level[k];
                }
            } else {
                text += '\n' + getCnName(name) + ': ' + item.taskCount;
            }
            return text;
        },
		formatAllResult: function() {
			var text = '';
			for(var k in _tapdHelper.handleResult) {
				if (k.length == 0){
					continue;
				}
				text = _tapdHelper._formatResult(text, k, _tapdHelper.handleResult[k], true);
			}
			if (_tapdHelper.handleResult['']) {
				text = _tapdHelper._formatResult(text, '未 认 领', _tapdHelper.handleResult[''], true);
			}
			return text;
		},
		formatFilterResult: function() {
			var text = '';
			for(var k in _tapdHelper.handleResult) {
				if (k.length == 0){
					continue;
				}
				if (_tapdHelper.handleResult[k].isFilter) {
					text = _tapdHelper._formatResult(text, k, _tapdHelper.handleResult[k]);
				}
			}
			return text;
		},
		sendNotifition: function(bugCount, oldbugCount, body, allBody) {
			//var bark = _tapdHelper.plugins.bark;  //可发送信息到个人手机上
			var title = '';
			if (oldbugCount > bugCount) {
				title = '减少缺陷数：' + (oldbugCount - bugCount) + ',总数' + bugCount;
			} else if (oldbugCount < bugCount){
				title = '新增缺陷数：' + (bugCount - oldbugCount) + ',总数' + bugCount;
			} else {
				title = '无新增缺陷，总数：' + bugCount;
			}
			var send = true;
			if (window.tapdCustomConfig.showHasBody) {
				if (!body || body.length == 0) {
					send = false
				}
			}
			if (send) {
				GM_notification({
					text: body,
					title: title,
					image: 'data:image/png;base64,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',
					highlight: false,
					timeout: 5000,
                    onclick: function() {
                        window.focus();
                        alert(allBody);
                    }
				});
				//bark.sendToBark(title, body);  //可设置发送信息到个人手机上
			}

			if (window.tapdCustomConfig.sendNotifition && typeof window.tapdCustomConfig.sendNotifition == 'function') {
				return window.tapdCustomConfig.sendNotifition(bugCount, oldbugCount, body, allBody);
			}
		},
		beforeCollect: function() {
			if (window.tapdCustomConfig.beforeCollect && typeof window.tapdCustomConfig.beforeCollect == 'function') {
				return window.tapdCustomConfig.beforeCollect();
			}
			return true;
		},
		collected: function(items) {
			if (window.tapdCustomConfig.collected && typeof window.tapdCustomConfig.collected == 'function') {
				window.tapdCustomConfig.collected(items);
			}
		},
		plugins: {
			store: {
				get: function(key) {
					return window.localStorage.getItem(key);
				},
				set: function(key, value) {
					window.localStorage.setItem(key, value);
				}
			}
			/*bark: {
				sendToBark: function(title, body) {
					if (_tapdHelper.loopCount % 20 == 0)
						$.getScript('https://bark.maiplan.site/eeQ7r3KzBebbXzPgrPRN9S/' + title + '/' + body);
				}
			}*/   //可设置发送信息到个人手机上
		},
		run: function() {
			var refreshTime = (window.tapdCustomConfig.refreshTime || 300) * 1000;
			setTimeout(function(){
				window.location.reload();
			}, refreshTime);
		}
    };

    var getCnName = function(v) {
        if (_tapdHelper) {
            for (var n in window.tapdCustomConfig.nameFormat) {
                if (v.indexOf(n) != -1) {
                    return window.tapdCustomConfig.nameFormat[n];
                }
            }
        }
        return v;
    };

    $(window).ready(function () {
		// defaule plugin
		var store = _tapdHelper.plugins.store;

		// five beforeCollect event
		if (!_tapdHelper.beforeCollect()) {
			return;
		}

		// start collect page data

		// collect and handle table header
		var table = {};
		$($('thead tr')[0]).find('th').each(function (index) {
			var name = $.trim($(this).find(':last-child').html());
			for (var i in tapdConfig.supportFieldName) {
				if (name.indexOf(tapdConfig.supportFieldName[i]) == 0) {
					table[index] = tapdConfig.supportFieldName[i];
					_tapdHelper.fieldIndex[tapdConfig.supportFieldName[i]] = index;
					break;
				}
			}
		});

		// collect and handle table data
		var items = [];
		$($('tbody')).find('tr').each(function (index) {
			var item = {};
			if (index > 0) {
				$(this).find('td').each(function (index) {
					if (table[index] != null && table[index].length > 0) {
						if (tapdConfig.supportFieldFormat[table[index]] && typeof tapdConfig.supportFieldFormat[table[index]] == 'function') {
							item[index] = tapdConfig.supportFieldFormat[table[index]](this);
						} else {
							item[index] = $.trim($(this).find(':last-child').html());
						}
					}
				})
				items.push(item);
			}
		})

		_tapdHelper.collected(items);

		// collect the bug count
		var bugCount = Number($.trim($('#all_bug_count').text()));

        // get and handle old data
        var oldbugCount = store.get('bugCount') | 0;

        for(var i in items) {
			_tapdHelper.mergeResult(items[i]);
        }

        var allBody = _tapdHelper.formatAllResult();
        var body = _tapdHelper.formatFilterResult();


		_tapdHelper.sendNotifition(bugCount, oldbugCount, body, allBody);

        // store result
        store.set('tapdItems', JSON.stringify(items));
        store.set('bugCount', JSON.stringify(bugCount));
        store.set('body', JSON.stringify(body));
        store.set('allBody', JSON.stringify(allBody));
        if (_tapdHelper.loopCount >= 100000) {
            _tapdHelper.loopCount = 0;
        }

		// get and update tapd helper loop count
		_tapdHelper.loopCount = store.get('loopCount') | 0;
        store.set('loopCount', JSON.stringify(++_tapdHelper.loopCount));

		_tapdHelper.run();
    });
})();