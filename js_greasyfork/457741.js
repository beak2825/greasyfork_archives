// ==UserScript==
// @name         bilibili弹幕颜色设置选择器增强
// @namespace    https://github.com/Byron-Ding/bilibili_color_selector_improvement-Tempermonkey-script
// @version      1.2.7
// @description  本脚本增加了一个H5选择器，用于在发送Bilibili弹幕的时候，更加方便地选取颜色。
// @author       Byron Ding
// @match        *.bilibili.com/video/*
// @match        *.bilibili.com/bangumi/*
// @license      AGPL-3.0 License
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.3.min.js

// @downloadURL https://update.greasyfork.org/scripts/457741/bilibili%E5%BC%B9%E5%B9%95%E9%A2%9C%E8%89%B2%E8%AE%BE%E7%BD%AE%E9%80%89%E6%8B%A9%E5%99%A8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/457741/bilibili%E5%BC%B9%E5%B9%95%E9%A2%9C%E8%89%B2%E8%AE%BE%E7%BD%AE%E9%80%89%E6%8B%A9%E5%99%A8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

// 未来@icon需要用base64保存于文件内，而不是像现在一样的引用连接；

/* globals jQuery, $ */

(function() {
    'use strict';
    // Your code here...
	/**
	 * 原理，在B站原有的颜色展示框上面覆盖一个透明的H5颜色选择器，大小和原来的颜色展示框相同。
	 * 注意，B站只有当鼠标第一次移入标签的时候才会显示div
	 * 
	 * css 和 attr 不要搞混；后者如href等（用后者可以设置前者({ "style" :" xxxx "})，但反过来不行）
	 * https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input/color
	 * https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events
	 */
	
	// const DAENMOK_SENDING_MENU_BAR_CLASS_SELECTOR = "";
	const DAENMOK_SETTING_A_CLASS = "bpx-player-video-btn-dm";
	const DAENMOK_SETTING_A_TAB_CLASS_SELECTOR = "div.bpx-player-video-btn-dm";
	const DAENMOK_SENDING_COLOR_PREVIEW_CLASS = "bui-color-picker-display"
	const DAENMOK_COLOR_SHARP_HEX_RGB_INPUT_TAB_CLASS_SELECTOR = ".bui-input-input";
	
	
	
	/**
	 * 找寻弹幕设置标签
	 * 
	 * 返回标准js标签对象
	 */
	function find_daenmok_setting_tab(){
		let tabs_to_find = jQuery(DAENMOK_SETTING_A_TAB_CLASS_SELECTOR);
		
		if (tabs_to_find.length === 1){
			return tabs_to_find[0];
		}else{
			throw "There are more than 1 danmu setting tab in the same page of 404 Not Found!";
		}
	}
	
	/**
	 * 寻找颜色输入框标签
	 */
	function find_daenmok_color_sharp_hex_RGB_text_input_tab(){
		return $(DAENMOK_COLOR_SHARP_HEX_RGB_INPUT_TAB_CLASS_SELECTOR)[0];
	}
	
	/**
	 * 判断是否已经存在需要调整的元素，因为B站只有鼠标移入才会显示元素
	 */
	function whether_native_color_display_tab_exists(){
		// 后代选择器，第一个是整个弹幕的div
		// 包括一个span（A标签），和一个div（具体设置，鼠标移入后才会弹出）
		// 第二个则是
		// 颜色展示器本身（span标签）
		let tabs_to_find = jQuery("div.bpx-player-video-btn-dm .bui-color-picker-display");
		
		// 数组情况判断
		if (tabs_to_find.length === 0){
			return false;
		}else if(tabs_to_find.length === 1){
			return true;
		}else{
			throw "More than one element has same class!";
		}
	}
	
	/**
	 * 找颜色预览span标签
	 * 
	 * 返回的jq标签对象
	 */
	function find_native_color_display_tab(){
		// 找寻弹幕设置标签（就是A字的那个标签）
		let daenmok_setting_div = whether_native_color_display_tab_exists()
		
		// 判断标签是否存在（且唯一），否则抛出异常
		if (! daenmok_setting_div){
			throw "color_display_tab does not exitst!"
		}else{
			// 唯一则找寻子标签
			let color_displaying_div = jQuery("div.bpx-player-video-btn-dm .bui-color-picker-display");
			
			return color_displaying_div;
		}
	}
	
	/**
	 * 获取原生的颜色预览素的大小
	 */
	function get_size_of_native_color_display_tab(){
		
		// 找到需要的元素
		let color_displaying_tab = find_native_color_display_tab();
		
		// 当前行，容纳需要元素的 标签
		let line_within_color_displaying_tab = $(".bui-color-picker-result");
		
		// 返回宽高数组（包含padding和border边框），不包含margin外边距
		return {"width": getComputedStyle(color_displaying_tab[0], null).width,
				"height": line_within_color_displaying_tab.height()}
		        // 这个获取出来是auto，不能填满div
		        //"height": getComputedStyle(color_displaying_tab[0], null)["height"]
		        // []警告，建议使用.
	}
	
	
	/**
	 * 创建自定义颜色选择器的标签
	 */
	function get_needed_input_color_tab(){
		// 用jquery创建一个input标签
		let input_color_tab = $('<input></input>');
	
		// input标签基本属性（字典，常量）
		let PLUGIN_DEFINED_COLOR_H5_SELECTOR_ATTR = {
			 "type": "color",
			 "name": "颜色选择器(来自插件)",
			 "id": "color_selector_H5_defined_by_plugin_in_TPM",
		}
		
		// 设置属性
		input_color_tab.attr(PLUGIN_DEFINED_COLOR_H5_SELECTOR_ATTR);
		input_color_tab.css({
			 "width": "100%",
			 "height": "100%"});
		
		// 返回 颜色标签
		return input_color_tab;
	
		// console.log(input_color_tab);
		
	}
	
	/**
	 * 创建自定义颜色选择器标签的css标签对象
	 * 并加入至head标签内
	 * 本来想，如果和input标签放到一起，则方便维护，
	 * 但据网上讲放到body前（head内部）有利于渲染，速度也快。浏览器是先加载样式表再加载DOM的。
	 * 这个在HTML加载完的时候调用
	 */
	function get_and_set_css_for_input_color_tab(){	
			// 方法源自：https://blog.csdn.net/qq_16559905/article/details/124328038
			// CSS 样式原标签（文本形式）
			let PLUGIN_DEFINED_COLOR_H5_SELECTOR_CSS_ORIGINAL_CODE = `
			<style>
					  #color_selector_H5_defined_by_plugin_in_TPM{
						position: relative;
						-webkit-appearance: none;
						border: none;
						padding: 0;
						background: transparent;
						margin: 0px;
					  }
					   #color_selector_H5_defined_by_plugin_in_TPM::-webkit-color-swatch-wrapper {
						/*
						background: radial-gradient(red, magenta, blue, cyan, lime, yellow, red);
						*/
						border-radius: 40px;
						background: transparent;
					  }
					  #color_selector_H5_defined_by_plugin_in_TPM::-webkit-color-swatch {
						display: none;
					  }
			</style>
			`;
		
			// 转换成对象
			let plugin_append_style_tab = $(PLUGIN_DEFINED_COLOR_H5_SELECTOR_CSS_ORIGINAL_CODE);
			
			// 加入头部
			$("head").append(plugin_append_style_tab);
			
			//return plugin_append_style_tab;
	}
	
	/**
	 * 当颜色变化的时候就会调用这个函数
	 * @param {Object} event 颜色选择器的颜色变化事件
	 */
	function update_color_immediately(event){
		let sharp_hex_RGB_color = event.target.value;
		// 经试验，这里的color是十六进制带#号的颜色数值（string）
		//类似 #aabbcc（全小写），不包含透明度通道（不知道以后H5会不会支持）
		// console.log(color);
		
		// 找到文字标签
		let color_text_input_tab = find_daenmok_color_sharp_hex_RGB_text_input_tab();
		
		// 转大写
		sharp_hex_RGB_color = sharp_hex_RGB_color.toUpperCase();
		
		// 赋值
		color_text_input_tab.value = sharp_hex_RGB_color;
		
		// 触发input事件
		// 新建input事件
		// https://www.zhihu.com/question/67505781
		// https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events
		// 尝试用 new Event("input"); 好像也可以，但是可能怕不精确，需要查找有啥区别；
		let input_event = new InputEvent("input");
		// 让标签捕获事件
		color_text_input_tab.dispatchEvent(input_event);
		
	}
	
	
	// 未来可能会启用
	/*
	// https://blog.csdn.net/u010568344/article/details/51956282?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-1-51956282-blog-93157752.pc_relevant_multi_platform_whitelistv3&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-1-51956282-blog-93157752.pc_relevant_multi_platform_whitelistv3&utm_relevant_index=1
	// 资料
	function bind_input_change_to_color_selector(event){
		
		// 找到自定义的标签
		let plugin_defined_color_input_tab = document.getElementById("color_selector_H5_defined_by_plugin_TPM");
		
		// 获取眼颜色
		let color_plugin_defined_color_input_tab = plugin_defined_color_input_tab.value;
		
		// 与事件颜色对比
		if (event.target.value != color_plugin_defined_color_input_tab){
			// 不同则换
			color_text_input_tab.value = event.target.value;
		}
		
	}
	*/
	
	/**
	 * 绑定颜色选择器标签和对应颜色变化函数
	 * @param {Object} input_color_tab 颜色选择器标签对象（js对象）
	 */
	function bind_event_to_plugin_defined_input_color_tab(input_color_tab){
		  input_color_tab.addEventListener("input", update_color_immediately, false);
	}
	
	/**
	 * 增加一个包裹的div
	 * 用其包裹input
	 * 并设置该包裹的div的属性
	 */
	function get_and_set_attr_Main_wapper(){
		// 创建包裹input color input 标签
		let div_main_wrapper = $("<div></div>");
		
		// 其属性
		let ATTR_MAIN_WRAPPER = {
				 "margin": "0px",
				 "padding": "0px",
				 "border": "none"
		}
		
		// 获取背景颜色显示div的长和宽
		let profit_width_and_height_dict = get_size_of_native_color_display_tab();
		// 合并长宽高至当前div
		jQuery.extend(ATTR_MAIN_WRAPPER, profit_width_and_height_dict);
		// 给予css样式
		div_main_wrapper.css(ATTR_MAIN_WRAPPER);
		
		// 注意CSS样式中的长宽不会被继承，但是，圆角似乎是继承的	由上层的元素自动赋予
		// 也就是说不用去获取border-radius属性，而且发现获取属性为空""
		// 不能用普通的style获取，要用
		// getComputedStyle(document.getElementsByClassName("bui-color-picker-display")[0], null)["border-radius"]
	
		
		
		// 获取input color type标签
		let plugin_append_style_tab = get_needed_input_color_tab();
		bind_event_to_plugin_defined_input_color_tab(plugin_append_style_tab[0]);
		
		// 包裹input color 标签
		div_main_wrapper.prepend(plugin_append_style_tab);
		
		
		return div_main_wrapper;
	}
	
	
	function whether_plugin_defined_input_color_tab_exists(){
		if (jQuery("#color_selector_H5_defined_by_plugin_in_TPM").length === 1){
			return true;
		}else{
			return false;
		}
	}
	
	function append_plugin_defineed_input_color_tab(){
		// 判断鼠标是否移入过，B站网页已经生成该标签
		let whether_already_has_native_color_display_tab = whether_native_color_display_tab_exists();
		
		// 判断是否已经被激活过一次（插件自定义的标签是否存在）
		let whether_already_has_plugin_defined_color_tab = whether_plugin_defined_input_color_tab_exists();
		
		// 存在,不要重复加入
		// 不存在，加入
		if ((! whether_already_has_plugin_defined_color_tab) && (whether_already_has_native_color_display_tab)){
			// 获取原生颜色预览标签
			let native_color_display_tab = find_native_color_display_tab();
			//获取自定义颜色选择标签
			let plugin_defined_input_color_wapper_tab = get_and_set_attr_Main_wapper();
			// 加入自定义颜色选择标签
			native_color_display_tab.prepend(plugin_defined_input_color_wapper_tab);
		}
	}
	
	
	
	// bilibili-player-video-btn bilibili-player-video-btn-danmaku relative
	
	
	
	// 这个节点是DOM自带的
	// let target_node_daenmok_sending_menu_bar = document.querySelector(".bpx-player-sending-area");
	// 这个更保险，因为上面那个番剧的网页不自带，否则还要判断url，暂时不这么做，感觉兼容性好点
	// 原先变量名是target_node_daenmok_sending_menu_bar
	let target_node_bilibili_player = document.querySelector("#bilibili-player")
	
	let observer_option = {
	        childList: true, // 观察目标子节点的变化，添加或删除
	        // attributes: true, // 观察属性变动
			subtree: true //默认是false，设置为true后可观察后代节点
	}
	
	// 解决办法，再加一个observer
	function callback_for_color_display_block_obserber(mutation_records_list, observer){
		var flag = false;
		// 获取新增标签列表
		var added_nodes_list = mutation_records_list;
		// 遍历标签（变化数组）
		for (var i = 0; i < added_nodes_list.length; i++) {
			// 每个变化
			let each_mutation_record = added_nodes_list[i];
			
			// 筛选后代节点变化类型的 元素
			if (each_mutation_record.type === "childList"){
				// 获取增加的节点的数组
				var each_added_nodes = each_mutation_record.addedNodes;
				
				// 遍历每个增加的节点
				for (var j = 0; j < each_added_nodes.length; j++) {
					// 获取节点
					var each_added_node = each_added_nodes[j];
	
					// 获取节点标签（有text类型混在里面，会报错）
					var node_name_each_added_node = each_added_node.nodeName;
						
					// 过滤text，防止报错，
					// 不要乱用 try catch，debug会很头疼的
					// text 没有getClass方法
					if (node_name_each_added_node != "#text"){
						
						// 获取后代节点
						var children_nodes = each_added_node.getElementsByClassName(DAENMOK_SENDING_COLOR_PREVIEW_CLASS);
						
						// 判断 .bui-color-picker-display
						if (children_nodes.length === 1){
							// DAENMOK_SENDING_COLOR_PREVIEW_CLASS 类 的 节点 已经生成了
							// 这个时候终于可以添加自定义标签了
							// 同时也可以进行一系列进一步的操作了
							
							// 先去除 颜色预览框的一格透明边框
							children_nodes[0].style.border = "0px";
							
							// 然后，将插件自定义的H5颜色选择器的属性，加入头部（设置css 样式）
							get_and_set_css_for_input_color_tab();
							
							// 再加插件自定义的H5颜色选择器
							append_plugin_defineed_input_color_tab();
							
							flag = true;
							break;
						}
					}
	
					
				}
				
			}
			
			if (flag === true){
				break;
			}
			
		}
		
		// 每次回调记得清除消息
		observer.takeRecords();
		
		// 番剧切换集数就会出问题
		// 可能是因为网页没有刷新，而是重新加载生成了视频播放的标签们。
		// 所以保留侦测器
		// 找到就停止侦测
		// if (flag === true){
		//	observer.disconnect();
		// }
			
	}
	
	// https://bbs.tampermonkey.net.cn/thread-1007-1-1.html
	// https:// bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=1008
	// 回调函数
	// 侦测器每次侦测到事件就会触发（调用）该函数
	function callback_for_setting_bar_observer(mutation_records_list, observer){
		var flag = false;
		// 获取新增标签列表
		var added_nodes_list = mutation_records_list;
		// 遍历标签（变化数组）
		for (var i = 0; i < added_nodes_list.length; i++) {
			// 每个变化
			let each_mutation_record = added_nodes_list[i];
			
			// 筛选后代节点变化类型的 元素
			if (each_mutation_record.type === "childList"){
				// 获取增加的节点的数组
				var each_added_nodes = each_mutation_record.addedNodes;
				
				// 遍历每个增加的节点
				for (var j = 0; j < each_added_nodes.length; j++) {
					// 获取节点
					var each_added_node = each_added_nodes[j];
	
					// 获取节点标签（有text类型混在里面，会报错）
					var node_name_each_added_node = each_added_node.nodeName;
						
					// 过滤text，防止报错，
					// 不要乱用 try catch，debug会很头疼的
					// text 没有getClass方法
					if (node_name_each_added_node != "#text"){
						
						// 获取后代节点
						var children_nodes = each_added_node.getElementsByClassName(DAENMOK_SETTING_A_CLASS);
						
						// 判断bpx-player-dm-root
						if (children_nodes.length === 1){
							// DAENMOK_SETTING_A_CLASS 类 的 节点 已经生成了
							
							// 这个是js自动生成之后 才可以进行侦测的
							let target_node_daenmok_sending_A_tab = find_daenmok_setting_tab();
							
							// 启用另一个监听器，监听是否有生成最终ing需要的颜色展示标签
							var observer_daenmok_setting_A_tab = new MutationObserver(callback_for_color_display_block_obserber);
							// 开始监听是否生成具体的选择标签
							observer_daenmok_setting_A_tab.observe(target_node_daenmok_sending_A_tab, observer_option);
							
							flag = true;
							break;
						}
					}
	
					
				}
				
			}
			
			if (flag === true){
				break;
			}
			
		}
		
		// 每次回调记得清除消息
		observer.takeRecords();
		
		// 找到就停止接收
		if (flag === true){
			observer.disconnect();
		}
	}
	
	function total_edition_func(){
		// 观察器
		var main_observer = new MutationObserver(callback_for_setting_bar_observer);
		// 开始观察
		main_observer.observe(target_node_bilibili_player, observer_option);
		// 结束观察（用回调函数）
	}
	
	$(document).ready(total_edition_func);
})();