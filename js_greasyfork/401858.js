// ==UserScript==
// @name         一键获取面单
// @namespace    https://greasyfork.org/zh-CN/scripts/393833
// @version      3.0.2
// @description  使用方法：4PX任一系统页面下，选中订单号后，按“ALT + C”，自动获取面单下载链接，并自动复制订单号，4PX专用
// @author       4PX技术支持团队·ZRF
// @match        http*://*.i4px.com/*
// @icon         http://tech.4px.com/images/4PX_logo.png
// @note         http://ticket.i4px.com/fpxres/jquery/2.2.4/jquery.min.js
// @note         https://code.jquery.com/jquery-3.1.1.min.js
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      shipment-management.i4px.com
// @connect      sso.i4px.com
// @connect      omp-fulfillment.i4px.com
// @downloadURL https://update.greasyfork.org/scripts/401858/%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96%E9%9D%A2%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/401858/%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96%E9%9D%A2%E5%8D%95.meta.js
// ==/UserScript==

(function() {
	var urlListData = "http://shipment-management.i4px.com/httpLog/listData?orderNo=";
	var urlGet = "http://shipment-management.i4px.com/httpLog/get?id=";
	var urlOrderInfo = "http://omp-fulfillment.i4px.com/report/outbound/detail?consignmentNo=";
	var urlManualGenerateNo = "http://order-fulfillment.4px.com/consignment/outbound/manualGenerateNo?consignmentNo=";
	
    // 获取订单信息 【打开新标签的方式】
    if(window.location.href.split("?")[0] == urlOrderInfo.split("?")[0]) {
    	var orderNo = window.location.href.split("=")[1];
    	$.ajax({
			type: "GET",
			url: urlOrderInfo + orderNo,
			success: function(response) {
				console.log("success");
				console.log(response);
				if(1 == response.result) {// 1是正常
					if("C" != response.data.status) {// C是已出库
						return quietCloseWindow("选中的订单状态不是已出库")
					} else {
						var continent = response.data.fromWarehouseCode.substr(0, 2);// 通过仓库代码获取订单所属地区，链接地址用
						switch (continent) {
							case "CN": continent = ""; break;
							case "US": continent = "US."; break;
							case "CA": continent = "US."; break;
							case "JP": continent = "ASIA."; break;
							case "AU": continent = "AU."; break;
							default: continent = "EU.";
						}
						GM_notification({highlight: true})// 高亮标签，即自动跳转到该标签
						// window.location.href.split("?")[0] == urlOrderInfo.split("?")[0] ? window.location.href = "http://" + response.data.fromWarehouseCode + "-fulfillment." + continent + "i4px.com/orderQuery/otaskListPage" : openNewWindow("", "http://" + response.data.fromWarehouseCode + "-fulfillment." + continent + "i4px.com/orderQuery/otaskListPage", true);
						return window.location.href = "http://" + response.data.fromWarehouseCode + "-fulfillment." + continent + "i4px.com/orderQuery/otaskListPage";// 跳转至库内系统
						 
					}
				} else {
					return quietCloseWindow("选中的订单号可能有误，请重试")
				}
			},
			error: function(response) {
				console.log("error");
				console.log(response);
				return quietCloseWindow("选中的订单号可能有误，请重试")
			}
		});
    }


    // 库内系统打印标签页面
    if(window.location.href.indexOf("otaskListPage") > -1) {
    	$("[name='no']").on("click", function() {// 输入委托单号时，清空开始时间
    		$("#startTime").val("");
    		$(this).off();
    	})
    }

	// 打开新标签
	function openNewWindow(orderNo, url, active) {// active为true时聚焦新Tab，false反之
		var newWindow = GM_openInTab(url + orderNo, {active: active, insert: true, setParent: true, incognito: false});// 新建标签，insert 插入一个新的tab在当前的tab后面，setParent 在tab关闭后重新聚焦当前tab，incognito 是否在隐私窗口中打开
		if(!!orderNo) {
			// 关闭标签，监控getFileClose值变化，为true时关闭打开的新标签
			GM_deleteValue("getFileClose");
			var listenerIDClose = GM_addValueChangeListener("getFileClose", function(name, old_value, new_value, remote) {
				if(new_value) {
					newWindow.close();
					GM_removeValueChangeListener(listenerIDClose);
				}
			})
			// 监控getFileErrorText，在当前标签传递报错信息
			// GM_deleteValue("getFileErrorText");
			// var listenerIDText = GM_addValueChangeListener("getFileErrorText", function(name, old_value, new_value, remote) {
			// 	// alert(new_value);
			// 	GM_notification({
   //                  title: "获取面单报错信息",
   //                  text: new_value,
   //                  timeout: 7e3
   //              }); 
			// 	GM_removeValueChangeListener(listenerIDText);
			// })
		}
	}

    // 关闭新标签 【打开新标签的方式】
    function closeWindow(errorText) {
    	if(!!errorText) {
    		GM_notification({
                title: "获取面单报错信息",
                text: new_value,
                timeout: 7e3
            }); 
    	}
    	// return window.open("", "_self").close()
    	return GM_setValue("getFileClose", true);
    }

    // 关闭后台方式打开的新标签，并传递报错信息
    function quietCloseWindow(errorText) {
    	if(!!errorText) {
    		// GM_setValue("getFileErrorText", errorText);
			GM_notification({
                title: "获取面单报错信息",
                text: errorText,
                timeout: 7e3
            }); 
    	}
    	GM_setValue("getFileClose", true);
    }

	// 获取火狐浏览器输入框选中的文本（网上get）
    function getFiorFoxSelectedText() {
    	let elem = document.activeElement;
	    let elemType = elem ? elem.tagName.toLowerCase() : 'none';
	    if (elemType === 'input' || elemType === 'textarea') {
	        return elem.value.substr(elem.selectionStart, elem.selectionEnd - elem.selectionStart);
	    } else {
	    	return ""
	    }
    	/*
	    let elem = document.activeElement;
	    let elemType = elem ? elem.tagName.toLowerCase() : 'none';
	    if (elemType === 'input' || elemType === 'textarea') {
	        return elem.value.substr(elem.selectionStart, elem.selectionEnd - elem.selectionStart);
	    }
	    if (window.getSelection) {
	        return window.getSelection().toString();
	    }
	    if (document.selection && document.selection.type !== 'Control') {
	        return document.selection.createRange().text;
	    }
	    return '';
	    */
	}

	// 获取有物流单号的dataID 【xmlhttpRequest请求的方式】
	function getListID(orderNo) {
		GM_xmlhttpRequest({
	    	method: "POST",
	    	url: urlListData + orderNo,
	    	// context: orderNo,
	    	// headers: {
	    	// 	// "Content-Type": "application/x-www-form-urlencoded",
	    	// 	"cookie": document.cookie
	    	// },
	    	onload: function (res) {
	    		console.log("POST");
	    		console.log(res);
	    		switch (res.status) {
	    			case 500:
	    				return getListID(orderNo);// 第一次加载可能会500错误，重新获取
	    				// break;
	    			case 200:
	    				if(res.finalUrl.indexOf("sso.i4px") > -1) {// 未登录
	    					return openNewWindow(orderNo, urlListData, true);
	    				}else if(res.finalUrl.indexOf("index") > -1) {// 跳转主页了，重新获取
	    					return getListID(orderNo);
	    				} else {
	    					var data = JSON.parse(res.response).data;
	    					try {
	    						if(0 == data.length) {
		    						// alert("获取面单链接失败，将跳转到库内系统")
		    						// return openNewWindow(orderNo, urlOrderInfo, false)
		    						return getOrderInfo(orderNo)
		    					}
		    					$.each(data, function (i) {
		    						if(!!data[i].trackingNumber) {
		    							getFileUrl(orderNo, data[i].id);
		    							return false
		    						} else if(data.length -1 == i) {
		    							// alert("获取面单链接失败，将跳转到库内系统");
		    							// openNewWindow(orderNo, urlOrderInfo, false)
		    							return getOrderInfo(orderNo)
		    						}
		    					})
	    					} catch (e) {
	    						openNewWindow(orderNo, urlListData, true);
	    					}
	    				}
	    				break;
	    		}
	    	}
	    })
	}

	// 获取面单url 【xmlhttpRequest请求的方式】
	function getFileUrl(orderNo, listID) {
		GM_xmlhttpRequest({
	    	method: "GET",
	    	url: urlGet + listID,
	    	// context: url,
	    	// headers: {
	    	// 	// "Content-Type": "application/x-www-form-urlencoded",
	    	// 	"cookie": document.cookie
	    	// },
	    	onload: function (res) {
	    		console.log("GET");
	    		console.log(res);
	    		if(200 == res.status) {
	    			var data = JSON.parse(res.response);
	    			if(!data.hasError) {
	    				try {
	    					var fileUrl = JSON.parse(data.dataMap.data.responseJson).data.fileInfos[0].fileUrl;
							console.log(fileUrl);
							!!fileUrl ? openNewWindow("", fileUrl, true) : getOrderInfo(orderNo) /*(alert("获取面单链接失败，将跳转到库内系统"), openNewWindow(orderNo, urlOrderInfo, false))*/;
		    			} catch(e) {
		    				// alert("获取面单链接失败，可能数据已加密，将跳转到库内系统");
		    				// return openNewWindow(orderNo, urlOrderInfo, false)
		    				return getOrderInfo(orderNo)
		    			}
	    			} else {
	    				// alert("请求失败，将跳转到库内系统");
	    				// return openNewWindow(orderNo, urlOrderInfo, false)
	    				return getOrderInfo(orderNo)
	    			}
	    		} else {
	    			// alert("获取面单链接失败，将跳转到库内系统");
	    			// return openNewWindow(orderNo, urlOrderInfo, false)
	    			return getOrderInfo(orderNo)
	    		}
	    	}
	    })
	}

	// 获取订单信息
	function getOrderInfo(orderNo) {
		console.log("getOrderInfo " + orderNo);
		// alert("获取面单链接失败，将跳转到库内系统");
		GM_notification({
            // title: "获取面单报错信息",
            text: "获取面单链接失败，将跳转到库内系统",
            timeout: 7e3
        }); 
		GM_xmlhttpRequest({
	    	method: "GET",
	    	url: urlOrderInfo + orderNo,
	    	// cookie: "SERVERID=omp.fulfillment2; lang=zh; cna=Y9v8FY+qyjoCAXFXWbKUoRyr; isg=BHFxLekFiwCHZCcUu-IjUZ_NgP0BVJfAwdH5vFOGOjhXepDMm690oD-bmE65sn0I; SESSION=ZDExZTJjZGQtMTBkNi00ZmRiLTk4ZmQtYmQwNGNmNjcwZTA2",
	    	cookie: "SERVERID=omp.fulfillment2",
	    	onload: function (res) {
	    		// console.log("GETorder");
	    		console.log(res);
	    		if(200 == res.status) {
    				if(res.finalUrl.indexOf("sso.i4px") > -1) {// 未登录
    					return openNewWindow(orderNo, urlOrderInfo, true)
    				} else {
    					var response = JSON.parse(res.response);
    					console.log(response);
    					if(1 == response.result) {// 1是正常
    						if("C" != response.data.status) {// C是已出库
    							// return alert("选中的订单状态不是已出库")
    							GM_notification({
						            // title: "获取面单报错信息",
						            text: "选中的订单状态不是已出库",
						            timeout: 7e3
						        }); 
    						} else {
    							var continent = response.data.fromWarehouseCode.substr(0, 2);// 通过仓库代码获取订单所属地区，地址用
    							switch (continent) {
    								case "CN": continent = ""; break;
    								case "US": continent = "US."; break;
    								case "CA": continent = "US."; break;
    								case "JP": continent = "ASIA."; break;
    								case "AU": continent = "AU."; break;
    								default: continent = "EU.";
    							}
    							// closeWindow("将跳转至库内系统");
    							return window.location.href.split("?")[0] == urlOrderInfo.split("?")[0] ? window.location.href = "http://" + response.data.fromWarehouseCode + "-fulfillment." + continent + "i4px.com/orderQuery/otaskListPage" : openNewWindow("", "http://" + response.data.fromWarehouseCode + "-fulfillment." + continent + "i4px.com/orderQuery/otaskListPage", true);// 跳转至库内系统
    						}
    					} else {
    						// return alert("选中的订单号可能有误，请重试")
    						GM_notification({
					            // title: "获取面单报错信息",
					            text: "选中的订单号可能有误，请重试",
					            timeout: 7e3
					        }); 
    					}
    				}
	    		}
	    	},
	    	onerror: function (res) {
	    		console.log("onerror");
	    		console.log(res);
	    		openNewWindow(orderNo, urlOrderInfo, false);
	    	}
	    })
	}

	// 订单宝直接获取面单链接
	function getFileUrl_FB4 (orderNo) {
		$.ajax({
		    type: "GET",
		    url: urlManualGenerateNo + orderNo,
		    success: function(response) {
		        console.log("success");
		        console.log(response);
		        if (1 == response.result) {
		        	try {
						var fileUrl = !!response.data.fileInfos ? response.data.fileInfos[0].fileUrl : JSON.parse(response.data.bizContent).fileUrl;
						console.log(fileUrl);
						!!fileUrl ? openNewWindow("", fileUrl, true) : getOrderInfo(orderNo);
	    			} catch(e) {
	    				return getOrderInfo(orderNo);
	    			}
		        } else {
		        	return getOrderInfo(orderNo);
		        }
		    },
		    error: function(response) {
		        console.log("error");
		        console.log(response);
		        getOrderInfo(orderNo);
		    }
		});
	}

    // 按键监听
    $(document).keydown(function(e) {
    	if(67 == e.keyCode && e.altKey) {
    		// console.log("Alt + C");
    		var orderNo = !!window.getSelection().toString() ? window.getSelection().toString() : getFiorFoxSelectedText();// 获取选中的文字
    		var newWindow;// 新建标签
    		orderNo = orderNo.replace(/\s*/g, "");
    		GM_setClipboard(orderNo, "text");
    		// console.log(orderNo);
    		// 【xmlhttpRequest请求的方式】
    		// !!orderNo ? getListID(orderNo) : alert("请先选中订单号");
    		!!orderNo ? getFileUrl_FB4(orderNo) : alert("请先选中订单号");

    		// 【测试用】
    		// !!orderNo ? getOrderInfo(orderNo) : alert("请先选中订单号");
    		// 【打开新标签的方式】
    		// !!orderNo ? newWindow = GM_openInTab(urlListData + orderNo, {active: true, insert: true, setParent: true, incognito: false}) : alert("请先选中订单号");
    		// var listenerID = GM_addValueChangeListener("getFileClose", function(name, old_value, new_value, remote) {
    		// 	if(new_value) {
    		// 		newWindow.close();
    		// 		GM_setValue("getFileClose", false);
    		// 		GM_removeValueChangeListener(listenerID);
    		// 	}
    		// })
    	}
    });

})();