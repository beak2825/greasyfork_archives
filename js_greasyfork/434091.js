// ==UserScript==
// @name         京东购物车—表格
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  京东购物车转表格
// @author       pzb
// @match        https://cart.jd.com/cart_index
// @match        https://item.jd.com/*.html
// @icon         https://www.jd.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434091/%E4%BA%AC%E4%B8%9C%E8%B4%AD%E7%89%A9%E8%BD%A6%E2%80%94%E8%A1%A8%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/434091/%E4%BA%AC%E4%B8%9C%E8%B4%AD%E7%89%A9%E8%BD%A6%E2%80%94%E8%A1%A8%E6%A0%BC.meta.js
// ==/UserScript==

(function() {
    pop_init();
})();

function get_sku_info(){
	var sku_list = new Array();
	var sku_id_unique = new Array();
	$("div.item-item").each(function(index, value){
		var this_item_div;
		if ($(this).parent().hasClass("item-suit")) {
			this_item_div = $(this).parent().find('div.item-header');
		}else{
			this_item_div = $(this);
		}

		if (this_item_div.find("div.p-extend").length>0) {
            extend_text = $(this).find("div.p-extend").html();
            if (extend_text.indexOf("商品已下架") > -1) {
                return true;
            }
        }

		var sku_href = this_item_div.find("div.p-name a").attr("href");
		var sku_id_html_arr = sku_href.split('/');
		var sku_id_html = sku_id_html_arr[sku_id_html_arr.length-1];
		var sku_id_arr = sku_id_html.split('.');
		var sku_id = sku_id_arr[0];

		var sku_name = this_item_div.find("div.p-name a").attr("title");

		var sku_price = this_item_div.find("span.p-price-cont").html();
        if (this_item_div.find("span.project-price").length>0) {
            sku_price = this_item_div.find("span.project-price span").html();
        }
        if (sku_price.length > 0) {
	        sku_price = sku_price.replace("￥", "")
	        sku_price = sku_price.replace("¥", "")
	        sku_price = sku_price.replace(",", "")
	        sku_price = parseFloat(sku_price);
		}

		if ($.inArray(sku_id, sku_id_unique) > -1) {
			return true;
		}else{
			sku_id_unique.push(sku_id);
		}

		var sku_info = {
			'sku_id': sku_id,
			'sku_name': sku_name,
			'sku_price': sku_price,
		}
		sku_list.push(sku_info);
	});
	var sku_list_json = JSON.stringify(sku_list);
	$("#ce_inp_infos").val(sku_list_json);

	$("#second_link").attr("href", "https://item.jd.com/"+sku_list[0]['sku_id']+".html");
	$("#second_link").html("点击前往");
	$("#second_link").attr("target", "_blank");

	var Url2 = document.getElementById("ce_inp_infos");
	Url2.select(); // 选择对象
	document.execCommand("Copy"); // 执行浏览器复制命令
}
function get_sku_cates(){
	if ($('#cate_ori_div').length == 0) {
		var cate_ori_html = "<div id='cate_ori_div' style='display: none;'></div>";
		$("body").after(cate_ori_html);
	}
	var sku_infos_str = $("#ce_inp_infos").val();
	if (sku_infos_str == '') {
		alert("未粘贴商品id");
		return false;
	}
	var sku_info_arr = JSON.parse(sku_infos_str);
	$(".fourth_step .total").html(sku_info_arr.length);

	var sku_id_and_cate_list = new Array();
	var finish_cnt = 0;
	$.each(sku_info_arr, function(index, value){

		var sku_id = value['sku_id'];
		var this_url = "https://item.jd.com/"+sku_id+".html";
		$("#cate_ori_div").load(this_url + ' div.#crumb-wrap', function(){

			$("#cate_ori_div .contact").remove();
			$("#cate_ori_div .EDropdown").remove();

			var match_category_link = "";
			var match_category_name = "";
			$("#cate_ori_div .crumb a").each(function(ii, vv){
				var this_a_link = $(this).attr("href");
				var this_a_text = $(this).html();
				var link_reg_str = /list.html\?cat=[0-9,]+$/;
				var start_pos = this_a_link.search(link_reg_str);

				if (start_pos > 0) {
					match_category_link = this_a_link;
					match_category_name = this_a_text;
				}
			});

			if (match_category_link == "") {
				alert("商品"+sku_id+"加载分类失败");
				return false;
			}

			// console.log(sku_id + " --> " + match_category_link + " --> " + match_category_name);
			finish_cnt++;
			$(".fourth_step .curr").html(finish_cnt);

			sku_info_arr[index]['cate_name']=match_category_name;

			var sku_infos_str = JSON.stringify(sku_info_arr);
			$("#ce_inp_cates").val(sku_infos_str);
		});
	});
}
function make_cart_table(){
	var sku_infos_str = $("#ce_inp_cates").val();
	if (sku_infos_str == '') {
		alert("未提取商品信息");
		return false;
	}
	var sku_info_arr = JSON.parse(sku_infos_str);

	var remake_sku_list = {};
	var continue_cate_list = ['冰淇淋','净水器','卷纸','坚果炒货','天文航天','数理化','牛奶乳品','空调','编程语言与程序设计','网卡','非处方药'];
	$.each(sku_info_arr, function(index, value){
		// {
		//     "sku_id": "100024279048",
		//     "sku_name": "英睿达（Crucial）美光32GB(16G×2)套装DDR4 3600频率台式机内存条 Ballistix铂胜系列游戏神条 美光原厂颗粒",
		//     "sku_price": "1199.00",
		//     "cate_name": "内存"
		// }
		var sku_id = value['sku_id'];
		var sku_name = value['sku_name'];
		var sku_price = value['sku_price'];
		var cate_name = value['cate_name'];

		if ($.inArray(cate_name, continue_cate_list) > -1) {
			return true;
		}

		if (cate_name in remake_sku_list) {
			remake_sku_list[cate_name].push(value);
		}else{
			remake_sku_list[cate_name] = new Array();
			remake_sku_list[cate_name].push(value);
		}
	});

	var new_sku_list = {};
	$.each(remake_sku_list, function(index, value){
		for (var i = value.length - 1; i >= 0; i--) {

			var sku_id = value[i]['sku_id'];
			var sku_name = value[i]['sku_name'];
			var sku_price = value[i]['sku_price'];
			var cate_name = value[i]['cate_name'];

			// console.log(cate_name + " --> " + sku_id + " --> " + sku_name + " --> " + sku_price);
		}

		remake_sku_list[index] = sortByKey(value, 'sku_price', 1);

		// new_sku_list[index] = sortByKey(value, 'sku_price', 1);
	});


	$.each(remake_sku_list, function(index, value){
		for (var i = value.length - 1; i >= 0; i--) {

			var sku_id = value[i]['sku_id'];
			var sku_name = value[i]['sku_name'];
			var sku_price = value[i]['sku_price'];
			var cate_name = value[i]['cate_name'];

			console.log(cate_name + " --> " + sku_id + " --> " + sku_name + " --> " + sku_price);

			var text_str = cate_name + " --> " + sku_id + " --> " + sku_name + " --> " + sku_price;
			var old_val = $("#ce_inp_text").val();
			$("#ce_inp_text").val(text_str+"\n"+old_val);
		}
	});
}

const sortByKey = (array, key, order) => {
    return array.sort(function (a, b) {
    	var x = a[key]; var y = b[key];
		if (order) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		} else {
			return ((x < y) ? ((x > y) ? 1 : 0) : -1);
		}
    });
}

function pop_init(){
    var btn_html =
    	"<div id='ce_wrapper'>"+
    		"<div class='first_step'>"+
    			"<p>"+
    				"<label>第一步，提取商品ID：</label>"+
    				"<input id='ce_inp_infos' value='' />"+
    				"<a id='first_btn' href='javascript:;'>提取</a>"+
    			"</p>"+
    		"</div>"+
    		"<div class='second_step'>"+
    			"<p>"+
    				"<label>第二步，前往详情页：</label>"+
    				"<a id='second_link' href='javascript:;'>未设置</a>"+
    			"</p>"+
    		"</div>"+
    		"<div class='third_step'>"+
    			"<p>"+
    				"<label>第三步，粘贴商品ID</label>"+
    			"</p>"+
    		"</div>"+
    		"<div class='fourth_step'>"+
    			"<p>"+
    				"<label>第四步，提取商品分类</label>"+
    				"<input id='ce_inp_cates' value='' />"+
    				"<a id='fourth_btn' href='javascript:;'>提取</a>"+
    			"</p>"+
    			"<p>"+
    				"<label>进度：</label>"+
    				"<label class='curr'>0</label>/"+
    				"<label class='total'>0</label>"+
    				"<a id='fourth_copy_btn' href='javascript:;'>复制</a>"+
    			"</p>"+
    		"</div>"+
    		"<div class='fifth_step'>"+
    			"<p>"+
    				"<label>第五步，生成表格</label>"+
    				"<a id='fifth_btn' href='javascript:;'>生成</a>"+
    			"</p>"+
    		"</div>"+
    		"<div class='sixth_step'>"+
    			"<p>"+
    				"<label>table内容</label>"+
    				"<textarea id='ce_inp_text'></textarea>"+
    			"</p>"+
    		"</div>"+
    	"</div>";
    $("body").append(btn_html);

    $("#first_btn").click(function(){
    	get_sku_info();
    });
    $("#fourth_btn").click(function(){
    	get_sku_cates();
    });
    $("#fourth_copy_btn").click(function(){
		var Url2 = document.getElementById("ce_inp_cates");
		Url2.select(); // 选择对象
		document.execCommand("Copy"); // 执行浏览器复制命令
    });
    $("#fifth_btn").click(function(){
		make_cart_table();
    });

    var style_html =
    	"<style type=\"text/css\">"+
    		"#ce_wrapper {position: absolute;z-index: 999;font-size: 18px;background: #ccc; height: 500px;}\n"+
    		"#ce_wrapper .first_step p{line-height: 50px;}\n"+
    		"#ce_wrapper .first_step p input{height: 26px;}\n"+
    		"#ce_wrapper .first_step p #first_btn {background: #fff; margin-left: 10px; padding: 0 5px;}\n"+

    		"#ce_wrapper .second_step p{line-height: 50px;}\n"+

    		"#ce_wrapper .third_step p{line-height: 50px;}\n"+

    		"#ce_wrapper .fourth_step p{line-height: 50px;}\n"+
    		"#ce_wrapper .fourth_step p input{height: 26px;}\n"+
    		"#ce_wrapper .fourth_step p #fourth_btn {background: #fff; margin-left: 10px; padding: 0 5px;}\n"+
    		"#ce_wrapper .fourth_step p #fourth_copy_btn {background: #fff; margin-left: 10px; padding: 0 5px;}\n"+

    		"#ce_wrapper .fifth_step p{line-height: 50px;}\n"+
    		"#ce_wrapper .fifth_step p #fifth_btn {background: #fff; margin-left: 10px; padding: 0 5px;}\n"+
    	"</style>";
    $("body").append(style_html);

    pop_style_init('ce_wrapper');
}

function pop_style_init(idName) {
	var page_w = $("#cart-body").width();
	var cart_w = 1100;

	var btn_w = (page_w - cart_w) / 2;
	$("#"+idName).width(btn_w);


    var d = document.getElementById(idName);
    // d.style.top = (document.documentElement.scrollTop + (document.documentElement.clientHeight - d.offsetHeight) / 2 - 500) + "px";
    // d.style.left = (document.documentElement.scrollLeft + (document.documentElement.clientWidth - d.offsetWidth) / 2 - 800) + "px";
    d.style.top = (document.documentElement.scrollTop + (document.documentElement.clientHeight - d.offsetHeight) / 2 - 30) + "px";
    d.style.left = "0px";
}
function btn_init_position_refresh(idName) {
    pop_style_init("ce_wrapper");
}

window.onscroll = btn_init_position_refresh;
window.onresize = btn_init_position_refresh;
window.onload = btn_init_position_refresh;