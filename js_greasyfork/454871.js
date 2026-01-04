/*!
 * jQuery Form Local Storage Plugin v0.1
 * http://git.oschina.net/since1986/jquery_form_local_storage
 * 
 * Copyright since1986
 * Released under the MIT license
 */
 (function($) {
    $.fn.formLocalStorage = function(options) {
    	
    	var form_selector = this.selector;
    	var input_selector = form_selector + " :text, " + form_selector + " :checkbox, " + form_selector + " :radio, " + form_selector + " select, " + form_selector + " textarea, " + form_selector + " [type='date']";
    	
    	if(options.debug){ console.debug(this); }
    	
    	//插件选项
    	var options = $.extend({
    		storage_name_perfix : ( this.context.URL + form_selector + "@" ), //暂存的命名前缀
    		storage_dom_css : {"font-style":"oblique"}, //暂存内容的css(用于区分原始内容与暂存内容)
    		load_ready_callback : function(){}, //暂存内容加载完毕回调
    		save_ready_callback : function(){}, //暂存内容保存完毕回调
    		remove_ready_callback : function(){}, //暂存内容删除完毕回调
    		debug : false, //调试模式
        },
        options || {});
    	
    	if(options.debug){	console.debug("storage_name_perfix: " + options.storage_name_perfix); }
    	
    	//表单加载完毕后从localStorage中载入暂存的表单内容
    	this.ready(function(){
    		
    		var storage_count = 0;
    		$(input_selector).each(function(){
    			var storage_key = options.storage_name_perfix + this.name;
    			var storage_value = localStorage.getItem(storage_key);
    			if(storage_value != undefined && storage_value != null){
    				$(this).val(storage_value);
    				$(this).css(options.storage_dom_css);
    				if(options.debug){ console.debug("Load from localStorage [" + storage_key + " : " + storage_value + "]"); };
    				storage_count++;
    			}
    		});
    		if(storage_count > 0) { options.load_ready_callback(); }
    	});
    	
    	//监控表单内容变化并存入localStorage FIXME 动态写入的内容监控不到
    	this.ready(function(){
    		$(input_selector).change(function(){
    			
    			if(this.value != undefined && this.value != null){
    				var storage_key = options.storage_name_perfix + this.name;
    				var storage_value = this.value;
    				localStorage.setItem(storage_key, storage_value);
    				$(this).css(options.storage_dom_css);
    				if(options.debug){ console.debug("Save to localStorage [" + storage_key + " : " + storage_value + "]"); };
    			}
    			options.save_ready_callback();
    		});
    	});
    	
    	//表单提交时自动清空此表单所有暂存内容
    	this.submit(function(){
    		$(input_selector).each(function(){
    			var storage_key = options.storage_name_perfix + this.name;
    			localStorage.removeItem(storage_key);
    			if(options.debug){ console.debug("Remove from localStorage [" + storage_key + "]"); };
    		});
    		options.remove_ready_callback();
    	});
    	
    	return this;
    };
})(jQuery);
