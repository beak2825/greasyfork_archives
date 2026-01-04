// ==UserScript==
// @name         SteamRedeemKeys
// @namespace    https://gist.github.com/zyfworks/ccb12bd87f09cf49d0a3465d167bece9
// @version      1.5.0
// @description  Steam网页激活 —— 批量激活
// @author       Makazeu
// @match        https://store.steampowered.com/account/registerkey
// @grant        GM_addStyle
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/32718/SteamRedeemKeys.user.js
// @updateURL https://update.greasyfork.org/scripts/32718/SteamRedeemKeys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var autoDivideNum = 9;
    var waitingSeconds = 20;
    var ajaxTimeout = 15;

	var keyCount = 0;
	var recvCount = 0;
	var timer;

	var allUnusedKeys = [];

	var failureDetail = {
		14: '无效激活码',
		15: '重复激活',
		53: '次数上限',
		13: '地区限制',
		9: '已拥有',
		24: '缺少主游戏',
		36: '需要PS3?',
		50: '这是充值码',
    };

	var myTexts = {
		fail: '失败',
		success: '成功',
		network: '网络错误或超时',
		line: '——',
		nothing: '',
		others: '其他错误',
		unknown: '未知错误',
		redeeming: '激活中',
		waiting: '等待中',
		showUnusedKey: '显示未使用的Key',
		hideUnusedKey: '隐藏未使用的Key',
    };
    
    var unusedKeyReasons = [
        '次数上限',
        '地区限制',
        '已拥有',
        '缺少主游戏',
        '其他错误',
        '未知错误',
        '网络错误或超时',
    ];

	function redeemKey(key) {
		jQuery.ajax({
			url: 'https://store.steampowered.com/account/ajaxregisterkey/',
			data: {
				product_key: key,
				sessionid: g_sessionID
			},
			type: 'post',
			dataType: 'json',
			timeout: 1000 * ajaxTimeout,
			beforeSend: function(){
				if (jQuery('table').is(':hidden')) {
						jQuery('table').fadeIn();
				}
			},
			complete: function() {
			},
			error: function() {
				tableUpdateKey(key, myTexts.fail, myTexts.network, 0, myTexts.nothing);
				return;
			},
			success: function(data) {
				//console.log(data);

				if (data.success == 1) {
					tableUpdateKey(key, myTexts.success, myTexts.line, 
						data.purchase_receipt_info.line_items[0].packageid,
						data.purchase_receipt_info.line_items[0].line_item_description);
					return;
				} else if (data.purchase_result_details !== undefined && data.purchase_receipt_info) {
					if (!data.purchase_receipt_info.line_items[0]) {
						tableUpdateKey(key, myTexts.fail, 
							failureDetail[data.purchase_result_details] ? failureDetail[data.purchase_result_details] : myTexts.others,
                            0, myTexts.nothing);
					} else {
						tableUpdateKey(key, myTexts.fail, 
							failureDetail[data.purchase_result_details] ? failureDetail[data.purchase_result_details] : myTexts.others,
							data.purchase_receipt_info.line_items[0].packageid,
							data.purchase_receipt_info.line_items[0].line_item_description);
                    }
					return;
				}
				tableUpdateKey(key, myTexts.fail, myTexts.nothing, 0, myTexts.nothing);
			}
		});
	}

	function setUnusedKeys(key, success, reason, subId, subName) {
        if (success && allUnusedKeys.includes(key)) {
            allUnusedKeys = allUnusedKeys.filter(function(keyItem){
                return keyItem != key;
            });

            var listObjects = jQuery('li');
            for(var i = 0; i < listObjects.length; i++) {
                var listElement = listObjects[i];
                var listObject = jQuery(listElement);

                if(listElement.innerHTML.includes(key)) {
                    listObject.remove();
                }
            }
        } else if (!success && !allUnusedKeys.includes(key) &&
                        unusedKeyReasons.includes(reason)) {
            var listObject = jQuery('<li></li>');
            listObject.html(key + ' ( ' + reason + 
                (subId != 0 ? (': <code>' + subId + '</code> ' + subName) : '') +
            ' )');
            jQuery('#unusedKeys').append(listObject);

            allUnusedKeys.push(key);
        }
	}

	function tableInsertKey(key) {
		keyCount++;
		var row = jQuery('<tr></tr>');
		// number
		row.append('<td class="nobr">' + keyCount + '</td>');
		//key
		row.append('<td class="nobr"><code>' + key + '</code></td>');
		//redeeming...
		row.append('<td colspan="3">' + myTexts.redeeming + '...</td>');

		jQuery('tbody').prepend(row);
	}

	function tableWaitKey(key) {
		keyCount++;
		var row = jQuery('<tr></tr>');
		// number
		row.append('<td class="nobr">' + keyCount + '</td>');
		//key
		row.append('<td class="nobr"><code>' + key + '</code></td>');
		//waiting...
		row.append('<td colspan="3">' + myTexts.waiting +
			' (' + waitingSeconds + '秒)...</td>');

		jQuery('tbody').prepend(row);
	}

	function tableUpdateKey(key, result, detail, subId, subName) {
        setUnusedKeys(key, result === myTexts.success, detail, subId, subName);

		recvCount++;
		if (recvCount == keyCount) {
			jQuery('#buttonRedeem').fadeIn();
			jQuery('#inputKey').removeAttr('disabled');
		}

		var rowObjects = jQuery('tr');
		for (var i = 1; i < rowObjects.length; i++) {
			var rowElement = rowObjects[i];
			var rowObject = jQuery(rowElement);

			if (rowObject.children()[1].innerHTML.includes(key)&&
                rowObject.children()[2].innerHTML.includes(myTexts.redeeming)) {
				rowObject.children()[2].remove();

				// result
				if (result == myTexts.fail) rowObject.append('<td class="nobr" style="color:red">' + result + '</td>');
				else rowObject.append('<td class="nobr" style="color:green">' + result + '</td>');
				// detail
				rowObject.append('<td class="nobr">' + detail + '</td>');
				// sub
				if (subId === 0) {
					rowObject.append('<td>——</td>');
				} else {
					rowObject.append('<td><code>' + subId + '</code> <a href="https://steamdb.info/sub/' + 
						subId + '/" target="_blank">' + subName + '</a></td>');
				}
				break;
			}
		}
	}

	function getKeysByRE(text) {
		text = text.trim().toUpperCase();
		var reg = new RegExp('([0-9,A-Z]{5}-){2,4}[0-9,A-Z]{5}', 'g');
		var keys = [];

		var result = void 0;
		while (result = reg.exec(text)) {
			keys.push(result[0]);
		}

		return keys;
	}

	function startTimer() {
		timer = setInterval(function() {
			var flag = false;
			var nowKey = 0;

			var rowObjects = jQuery('tr');
			for (var i = rowObjects.length - 1; i >= 1; i--) {
				var rowElement = rowObjects[i];
				var rowObject = jQuery(rowElement);
				if (rowObject.children()[2].innerHTML.includes(myTexts.waiting)) {
					nowKey++;
					if (nowKey <= autoDivideNum) {
						var key = rowObject.children()[1].innerHTML.substring(6);
						key = key.substring(0, key.indexOf('</code>'));
						rowObject.children()[2].innerHTML = '<td colspan="3">' + myTexts.redeeming + '...</td>';
						redeemKey(key);
					} else {
						flag = true;
						break;
					}
				}
			}
			if (!flag) {
				clearInterval(timer);
			}
		}, 1000 * waitingSeconds);
	}

	function redeemKeys() {
		var keys = getKeysByRE(jQuery('#inputKey').val().trim());
		if (keys.length <= 0) {
			return;
		}

		jQuery('#buttonRedeem').fadeOut();
		jQuery('#inputKey').attr('disabled', 'disabled');

		var nowKey = 0;
		keys.forEach(function (key) {
			nowKey++;
			if (nowKey <= autoDivideNum) {
				tableInsertKey(key);
				redeemKey(key);
			} else {
				tableWaitKey(key);
			}
		});

		if (nowKey > autoDivideNum) {
			startTimer();
		}
	}

	function toggleUnusedKeyArea() {
		if (jQuery('#unusedKeyArea').is(':hidden')) {
			jQuery('#unusedKeyArea').fadeIn();
		} else {
			jQuery('#unusedKeyArea').fadeOut();
		}
	}

	jQuery('#registerkey_examples_text').html(
		'<div class="notice_box_content" id="unusedKeyArea" style="display: none">' +
		'<b>未使用的Key：</b><br>'+
		'<div><ol id="unusedKeys">' +
		'</ol></div>' + 
		'</div>' + 

		'<div class="table-responsive table-condensed">' +
		'<table class="table table-hover" style="display: none">' +
		'<caption><h2>激活记录</h2></caption><thead><th>No.</th><th>Key</th>' +
		'<th>结果</th><th>详情</th><th>Sub</th></thead><tbody></tbody>' +
		'</table></div><br>');


	jQuery('.registerkey_input_box_text').parent().append('<textarea class="form-control" rows="3"' +
		' id="inputKey" placeholder="支持批量激活，可以把整个网页文字复制过来&#10;' +
		'若一次激活的Key的数量超过9个则会自动分批激活（等待20秒）"' +
		' style="margin: 3px 0px 0px; width: 525px; height: 102px;"></textarea><br>');
	jQuery('.registerkey_input_box_text').fadeOut();
	jQuery('#purchase_confirm_ssa').fadeOut();

	//jQuery('#register_btn').removeAttr('href').attr('href', 'javascript:redeemKeys()');
	//jQuery('#register_btn').parent().append('<button class="btnv6_blue_hoverfade btn_medium" id="buttonRedeem">激活！</button>');
	jQuery('#register_btn').parent().append('<a tabindex="300" class="btnv6_blue_hoverfade btn_medium"' + 
		' id="buttonRedeem"><span>激活！</span></a>' + ' &nbsp;&nbsp;' +
		'<a tabindex="300" class="btnv6_blue_hoverfade btn_medium"' + 
		' id="buttonShowUnused"><span>' + myTexts.showUnusedKey + '</span></a>');
	jQuery('#register_btn').remove();
	jQuery('#buttonRedeem').click(function() {
		redeemKeys();
	});
	jQuery('#buttonShowUnused').click(function() {
		toggleUnusedKeyArea();
		if (this.innerHTML.includes(myTexts.showUnusedKey)) {
			this.innerHTML = this.innerHTML.replace(myTexts.showUnusedKey, myTexts.hideUnusedKey);
		} else {
			this.innerHTML = this.innerHTML.replace(myTexts.hideUnusedKey, myTexts.showUnusedKey);
		}
	});

	var style = `
		table a {
			color: pink;
		}
		td {
			white-space: nowrap;
			overflow: hidden;
		}
		code {
			padding:2px 4px;
			font-size:90%;
			color:#c7254e;
			background-color:#f9f2f4;
			border-radius:3px
		}
		.notice_box_content {
			border: 1px solid #a25024;
			border-radius: 3px;
			width: 525px;
			color: #acb2b8;
			font-size: 14px;
			font-family: "Motiva Sans", Sans-serif;
			font-weight: normal;
			padding: 15px 15px;
			margin-bottom: 15px;
		}
		.notice_box_content b {
			font-weight: normal;
			color: #f47b20;
		}
		li {
			white-space: nowrap;
			overflow: hidden;
		}
	`;
    GM_addStyle(style);
})();