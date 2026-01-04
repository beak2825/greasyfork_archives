// ==UserScript==
// @name         网络百科聚合
// @version      1.00
// @description  同一词条在网络百科中互相跳转
// @match        *://baike.baidu.com/*
// @match        *://zh.wikipedia.org/*
// @match        *://baike.sogou.com/*
// @match        *://www.baike.com/*
// @match        *://baike.chinaso.com/*
// @match        *://baike.so.com/*
// @match        *://xuewen.cnki.net/*
// @grant        来自各个网络百科
// @author       太史子义慈
// @namespace    qs93313@sina.cn
// @downloadURL https://update.greasyfork.org/scripts/39971/%E7%BD%91%E7%BB%9C%E7%99%BE%E7%A7%91%E8%81%9A%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/39971/%E7%BD%91%E7%BB%9C%E7%99%BE%E7%A7%91%E8%81%9A%E5%90%88.meta.js
// ==/UserScript==

!(function() {
	wiki();
})();

function wiki() {
	//获取域名
	var wlhost = window.location.host;
	console.log(wlhost);
	var url = window.location.href;
	console.log(url);
	//百度百科
	var host_baidu = (wlhost == "baike.baidu.com");
	//维基百科
	var host_wiki = (wlhost == "zh.wikipedia.org");
	//搜狗百科
	var host_sogou = (wlhost == "baike.sogou.com");
	//互动百科
	var host_hudong = (wlhost == "www.baike.com");
	//国搜百科
	var host_china = (wlhost == "baike.chinaso.com");
	//360百科
	var host_360 = (wlhost == "baike.so.com");
	//知网学问
	var host_xuewen = (wlhost == "xuewen.cnki.net");
	
	//搜索引擎网址目录
	var dirall = dir_all();
	//新建选择框
	var new_select = document.createElement('select');
	new_select.setAttribute("id", "id_new_select");

	var new_select_2 = document.createElement('select');
	new_select_2.setAttribute("id", "id_new_select_2");

	//循环索引
	var i
	//选择框子节点下面要建立大量【选项】子节点
	for(i in dirall) {
		var v = dirall[i][0];
		new_option(v, i, new_select);
		new_option(v, i, new_select_2);
	}
	//新建按钮
	var new_btn = document.createElement('div');
	new_btn.setAttribute("id", "id_new_button");
	new_btn.innerHTML = "跳转搜索";

	var new_btn_2 = document.createElement('div');
	new_btn_2.setAttribute("id", "id_new_button_2");
	new_btn_2.innerHTML = "跳转搜索";

	//百度百科
	if(host_baidu) {
		//调整祖先节点的宽度
		var wsm = document.getElementsByClassName("wgt-searchbar-main")[0];
		wsm.style.cssText = "width: 100%;";

		var grandfather_baidu = document.getElementsByClassName("form");

		var grandfather_baidu_1 = grandfather_baidu[0];
		grandfather_baidu_1.style.cssText = "margin-left:0;";
		var father_a_uncles_baidu_1 = grandfather_baidu_1.children;
		var father_baidu_1 = father_a_uncles_baidu_1[0];
		var bro_baidu_1 = document.getElementsByClassName("help")[0];
		father_baidu_1.insertBefore(new_select, bro_baidu_1);
		father_baidu_1.insertBefore(new_btn, bro_baidu_1);
		new_select.style.cssText = "outline:none;font-size:17px;height:40px;margin:0 0 0 4px;";
		new_btn.style.cssText = "display:inline-block;outline:none;font-size:17px;width:104px;height:40px;background-color:#FF5200;line-height:40px;text-align:center;color:white;letter-spacing:1px;cursor:pointer;vertical-align:middle;";

		var grandfather_baidu_2 = grandfather_baidu[1];
		if(grandfather_baidu_2) {
			grandfather_baidu_2.style.cssText = "margin-left:0;";
			var father_a_uncles_baidu_2 = grandfather_baidu_2.children;
			var father_baidu_2 = father_a_uncles_baidu_2[0];
			father_baidu_2.appendChild(new_select_2);
			father_baidu_2.appendChild(new_btn_2);
			new_select_2.style.cssText = "outline:none;font-size:17px;height:34px;margin:0 0 0 4px;";
			new_btn_2.style.cssText = "display:inline-block;outline:none;font-size:17px;width:104px;height:34px;background-color:#FF5200;line-height:34px;text-align:center;color:white;letter-spacing:1px;cursor:pointer;vertical-align:middle;";
		}
	} else if(host_wiki) {
		var p_search = document.getElementById("p-search");
		p_search.style.marginRight = "8px";

		var father_wiki = document.getElementById("right-navigation");
		father_wiki.appendChild(new_select);
		father_wiki.appendChild(new_btn);
		new_select.style.cssText = "outline:none;font-size:14px;height:25px;margin:9px 0 0 0;";
		new_btn.style.cssText = "display:inline-block;outline:none;font-size:14px;width:84px;height:25px;background-color:#FF5200;line-height:25px;text-align:center;color:white;letter-spacing:1px;cursor:pointer;margin:0 10px 0 0;";
	} else if(host_sogou) {
		var searchbox = document.getElementsByClassName("searchbox")[0];
		searchbox.style.width = "1138px";
		var btn_clear = document.getElementsByClassName("btn_clear")[0];
		btn_clear.style.right = "438px";

		var father_sogou_1 = document.getElementById("Form");
		var bro_sogou_1 = document.getElementById("divc");
		father_sogou_1.insertBefore(new_select, bro_sogou_1);
		father_sogou_1.insertBefore(new_btn, bro_sogou_1);
		new_select.style.cssText = "outline:none;font-size:16px;height:30px;margin:0 0 0 4px;";
		new_btn.style.cssText = "display:inline-block;outline:none;font-size:16px;width:104px;height:33px;background-color:#FF5200;line-height:35px;text-align:center;color:white;letter-spacing:1px;cursor:pointer;";

		var father_sogou_2 = document.getElementById("Form2");
		var father_sogou_3 = document.getElementById("myForm");
		if(father_sogou_2) {
			var bro_sogou_2 = document.getElementById("divc2");
			father_sogou_2.insertBefore(new_select_2, bro_sogou_2);
			father_sogou_2.insertBefore(new_btn_2, bro_sogou_2);
		} else if(father_sogou_3) {
			var bro_sogou_3 = document.getElementById("divc2");
			father_sogou_3.insertBefore(new_select_2, bro_sogou_3);
			father_sogou_3.insertBefore(new_btn_2, bro_sogou_3);
		}
		new_select_2.style.cssText = "outline:none;font-size:16px;height:22px;margin:0 0 0 0;";
		new_btn_2.style.cssText = "display:inline-block;outline:none;font-size:16px;width:104px;height:24px;background-color:#FF5200;line-height:28px;text-align:center;color:white;letter-spacing:1px;cursor:pointer;";
	} else if(host_hudong) {
		var father_hudong_1 = document.getElementsByClassName("search-panel")[0];
		if(father_hudong_1) {
			father_hudong_1.appendChild(new_select);
			father_hudong_1.appendChild(new_btn);
			new_select.style.cssText = "outline:none;font-size:16px;height:36px;margin:0 0 0 4px;";
			new_btn.style.cssText = "display:inline-block;outline:none;font-size:16px;width:104px;height:34px;background-color:#FF5200;line-height:34px;text-align:center;color:white;letter-spacing:1px;cursor:pointer;";
		}
		var father_hudong_2 = document.getElementsByClassName("search-area")[0];
		if(father_hudong_2) {
			father_hudong_2.appendChild(new_select_2);
			father_hudong_2.appendChild(new_btn_2);
			new_select_2.style.cssText = "outline:none;font-size:16px;height:36px;margin:0 0 0 4px;";
			new_btn_2.style.cssText = "display:inline-block;outline:none;font-size:16px;width:104px;height:34px;background-color:#FF5200;line-height:38px;text-align:center;color:white;letter-spacing:1px;cursor:pointer;";

			var s_btn = document.getElementsByClassName("s-btn")[0];
			s_btn.style.cssText = "right:200px;"
		}
	} else if(host_china) {
		var bkgg = document.getElementsByClassName("bkgg")[0];
		bkgg.style.display = "none";

		var father_china = document.getElementsByClassName("seInputWrapper")[0];
		father_china.appendChild(new_select);
		father_china.appendChild(new_btn);
		new_select.style.cssText = "outline:none;font-size:16px;height:43px;margin:0 0 0 650px;";
		new_btn.style.cssText = "display:inline-block;outline:none;font-size:16px;width:104px;height:43px;background-color:#FF5200;line-height:43px;text-align:center;color:white;letter-spacing:1px;cursor:pointer;margin:-43px 0 0 738px;";
	}else if(host_360){
		var grandsfather_360 = document.getElementById("header");
		var father_360 = grandsfather_360.children[0].children[0].children[1];
		console.log(father_360);
		father_360.appendChild(new_select);
		father_360.appendChild(new_btn);
		new_select.style.cssText = "outline:none;font-size:15px;height:38px;margin:0 0 0 4px;";
		new_btn.style.cssText = "display:inline-block;outline:none;font-size:15px;width:104px;height:38px;background-color:#FF5200;line-height:39px;text-align:center;color:white;letter-spacing:1px;cursor:pointer;";
	
		var search_word = document.getElementsByClassName("search-word")[0];
		search_word.style.width = "400px";
		var j_search_word = document.getElementById("J-search-word");
		j_search_word.style.width = "390px";
	}else if(host_xuewen){
		var header = document.getElementById("header");
		header.style.width = "1233px";
		
		var father_xuewen = document.getElementById("searchbg");
		father_xuewen.style.width = "667px";
		var bro_xuewen = father_xuewen.children[2];
		
		father_xuewen.insertBefore(new_select,bro_xuewen);
		father_xuewen.insertBefore(new_btn,bro_xuewen);
		new_select.style.cssText = "outline:none;font-size:15px;height:32px;margin:0 0 0 4px;";
		new_btn.style.cssText = "display:inline-block;outline:none;font-size:15px;width:104px;height:32px;background-color:#FF5200;line-height:33px;text-align:center;color:white;letter-spacing:1px;cursor:pointer;";
		
	}

	//按钮点击事件
	new_btn.onclick = function new_btn_click() {
		//获得输入框数据
		var new_input = "";
		if(host_baidu) {
			new_input = father_baidu_1.children[0];
		} else if(host_wiki) {
			new_input = document.getElementById("searchInput");
		} else if(host_sogou) {
			new_input = document.getElementById("searchText");
		} else if(host_hudong) {
			new_input = document.getElementsByClassName("ac_input")[0];
		} else if(host_china) {
			new_input = document.getElementsByClassName("search_input2")[0];
		} else if(host_360){
			new_input = document.getElementById("J-search-word");
		} else if(host_xuewen){
			new_input = document.getElementById("txtSearchKey");
		}
		var new_input_val = new_input.value;
		//计算输入框数据长度
		var new_input_val_len = new_input_val.length;
		if(host_wiki) {
			if(new_input_val_len == 0) {
				var ooui_php_1 = document.getElementById("ooui-php-1");
				var firstHeading = document.getElementById("firstHeading");
				if(ooui_php_1) {
					var ooui_php_1_val = ooui_php_1.value;
					var ooui_php_1_val_len = ooui_php_1_val.length;
					if(ooui_php_1_val_len > 0) {
						new_input_val = ooui_php_1_val;
						new_input_val_len = ooui_php_1_val_len;
					}
				} else if(firstHeading) {
					var firstHeading_val = firstHeading.firstChild.data;
					var firstHeading_val_len = firstHeading_val.length;
					if(firstHeading_val_len > 0) {
						new_input_val = firstHeading_val;
						new_input_val_len = firstHeading_val_len;
					}
				}
			}
		}
		//如果输入框有数据
		if(new_input_val_len > 0) {
			//获得选择框里被选中的选项索引
			var option_index = new_select.selectedIndex;
			//根据索引获得获得选择框里被选中的选项id
			var option_select_id = new_select.options[option_index].id;
			//根据id和网址目录获得网址
			var pcsearch = dirall[option_select_id][1];
			//用输入框的数据替换掉网址内的替换符
			var dti = pcsearch.replace("%sv%", new_input_val);
			//网址跳转
			window.open(dti);
		} else {
			alert("请在前面的输入框输入要搜索的内容。[油猴脚本]");
			new_input.focus();
		}
	}

	new_btn_2.onclick = function new_btn_click_2() {
		//获得输入框数据
		var new_input_2;
		if(host_baidu) {
			new_input_2 = father_baidu_2.children[0];
		} else if(host_sogou) {
			new_input_2 = document.getElementById("searchText2");
		} else if(host_hudong) {
			new_input_2 = document.getElementsByClassName("ac_input")[1];
		}
		var new_input_2_val = new_input_2.value;
		//计算输入框数据长度
		var new_input_2_val_len = new_input_2_val.length;
		//
		if(host_hudong) {
			if(new_input_2_val_len == 0) {
				var content_h1 = document.getElementsByClassName("content-h1")[0].children[0];
				var content_h1_val = content_h1.innerHTML;
				var content_h1_val_len = content_h1_val.length;
				if(content_h1_val_len > 0) {
					new_input_2_val = content_h1_val;
					new_input_2_val_len = content_h1_val_len;
				}
			}
		}
		//如果输入框有数据
		if(new_input_2_val_len > 0) {
			//获得选择框里被选中的选项索引
			var option_index_2 = new_select_2.selectedIndex;
			//根据索引获得获得选择框里被选中的选项id
			var option_select_id_2 = new_select_2.options[option_index_2].id;
			//根据id和网址目录获得网址
			var pcsearch_2 = dirall[option_select_id_2][1];
			//用输入框的数据替换掉网址内的替换符
			var dti_2 = pcsearch_2.replace("%sv%", new_input_2_val);
			//网址跳转
			window.open(dti_2);
		} else {
			alert("请在前面的输入框输入要搜索的内容。[油猴脚本]");
			new_input_2.focus();
		}
	}
}

//新建option
function new_option(ih, aid, ns) {
	var new_opt = document.createElement('option');
	new_opt.innerHTML = ih;
	new_opt.setAttribute("id", aid);
	ns.appendChild(new_opt);
}

//搜索引擎网址目录，%sv%为替换符
function dir_all() {
	var da = {
		"id_opt_00": {
			0: "维基百科",
			1: "https://zh.wikipedia.org/w/index.php?search=%sv%&fulltext=1",
		},
		"id_opt_01": {
			0: "百度百科",
			1: "https://baike.baidu.com/search?word=%sv%",
		},
		"id_opt_02": {
			0: "百度搜索",
			1: "https://www.baidu.com/s?wd=site:(baike.baidu.com) \"%sv%\"&ct=1",
		},
		"id_opt_03": {
			0: "搜狗百科",
			1: "http://baike.sogou.com/Search.e?sp=S%sv%",
		},
		"id_opt_04": {
			0: "互动百科",
			1: "http://so.baike.com/doc/%sv%",
		},
		"id_opt_05": {
			0: "国搜百科",
			1: "http://baike.chinaso.com/wiki/search?q=%sv%",
		},
		"id_opt_06": {
			0: "知网学问",
			1: "http://xuewen.cnki.net/searchentry.aspx?key=%sv%",
		},
		"id_opt_07": {
			0: "必应网典",
			1: "http://www.bing.com/knows/search?mkt=zh-cn&q=%sv%",
		},
		"id_opt_08": {
			0: "360百科",
			1: "https://baike.so.com/search/?q=%sv%",
		},
	}
	return da;
}