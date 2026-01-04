// ==UserScript==
// @name       HoldAndShow
// @namespace    http://tampermonkey.net/
// @version      2025.05.30
// @description  一个鼠标放上去就自动放大显示图片的库
// @author       You
// ==/UserScript==

// 定义 HoldAndShow1.0 插件
$.fn.HoldAndShow = function(options) {
	// 默认配置
	var settings = $.extend({
		delay: 1000, // 显示大图前的延迟（毫秒）
		bigImgClass: 'bigimg', // 大图容器的类名
		loadingClass: 'loading' // 加载中状态的类名
	}, options);

	// 遍历所有选中的元素（通常是图片）
	return this.each(function() {
		var $this = $(this);
		// 检查是否已经初始化过
		if ($this.data('holdandshow-initialized')) {
			return; // 如果已经初始化过，则直接跳过
		}
		
		// 初始化 HoldAndShow 对象
		var holdAndShow = new HoldAndShow($this, settings);
		
		// 保存引用
		$this.data('holdandshow-instance', holdAndShow);
	});
};
// HoldAndShow 类
var HoldAndShow = function(element, settings) {
	this.$element = element;
	this.settings = settings;
	this.timer = null;
	this.$bigImg = null;
	this._owner = this;
	// 初始化
	this.init();
};
// HoldAndShow 原型方法
HoldAndShow.prototype = {
	init: function() {
		// 标记为已初始化
		this.$element.data('holdandshow-initialized', true);
		
		// 设置事件监听
		this.setupEventListeners();
	},
	
	setupEventListeners: function() {
		var that = this;
		
		this.$element.on({
			'mouseenter.holdandshow': function() {
				that.handleMouseEnter();
			},
			'mouseleave.holdandshow': function() {
				that.handleMouseLeave();
			}
		});
	},
	
	handleMouseEnter: function() {
		// 显示加载状态
		this.$element.addClass(this.settings.loadingClass);
		
		// 清除之前的计时器
		if (this.timer) {
			clearTimeout(this.timer);
		}
		
		var that = this;
		
		// 设置计时器，延迟后显示大图
		this.timer = setTimeout(function() {
			that.showBigImage();
		}, this.settings.delay);
	},
	
	handleMouseLeave: function() {
		// 清除计时器
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		
		// 移除加载状态
		this.$element.removeClass(this.settings.loadingClass);
		
		// 如果大图存在并且鼠标不在大图上，则移除大图
		if (this.$bigImg && this.$bigImg.length > 0 && !this.$bigImg.is(':hover')) {
			this.removeBigImage();
		}
	},
	
	showBigImage: function() {
		// 获取大图源
		var bigSrc = this.$element.attr('data-big-src');
		if (!bigSrc) {
			bigSrc = this.$element.attr('src');
		}
		
		// 创建或更新大图
		if (!this.$bigImg || this.$bigImg.length === 0) {
			this.$bigImg = $('<div class="' + this.settings.bigImgClass + '"></div>');
			$('body').append(this.$bigImg);
		}
		
		// 更新大图样式和源
		this.$bigImg.css({
			'background-image': 'url(' + bigSrc + ')',
			'width': '100%',
			'height': '100vh',
			'position' : 'fixed',
			'z-index' : '999',
			'top' : 0,
			'left' : 0,
			'background-repeat': 'no-repeat',
			'background-size': 'cover'
		}).show();
		
		// 移除加载状态
		this.$element.removeClass(this.settings.loadingClass);
		
		// 添加移除大图的事件监听
		this.setupRemoveEvents();
	},
	
	setupRemoveEvents: function() {
		var that = this;
		
		// 给大图添加移除事件
		this.$bigImg.off('mouseleave.holdandshow').on('mouseleave.holdandshow', function() {
			that.removeBigImage();
		});
		
		// 给 body 添加移除事件
		$('body').off('mouseleave.holdandshow').on('mouseleave.holdandshow', function() {
			that.removeBigImage();
		});
		
		// 给 window 添加滚动事件（鼠标滚轮）
		$(window).off('mousewheel.holdandshow DOMMouseScroll.holdandshow').on('mousewheel.holdandshow DOMMouseScroll.holdandshow', function() {
			that.removeBigImage();
		});
	},
	
	removeBigImage: function() {
		if (this.$bigImg && this.$bigImg.length > 0) {
			this.$bigImg.remove();
			this.$bigImg = null;
		}
	},
	
	destroy: function() {
		// 清除计时器
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		
		// 移除大图
		this.removeBigImage();
		
		// 移除所有相关的事件监听
		this.$element.off('.holdandshow');
		$('body').off('.holdandshow');
		$(window).off('.holdandshow');
		
		// 移除初始化标记
		this.$element.removeData('holdandshow-initialized');
		
		// 移除实例引用
		this.$element.removeData('holdandshow-instance');
	}
};

// 定义 HoldAndShow2.0 插件
// 定义 HoldAndShow 插件
$.fn.HoldAndShow = function(options) {
	// 默认配置
	var settings = $.extend({
		delay: 1000, // 显示大图前的延迟（毫秒）
		bigImgClass: 'bigimg', // 大图容器的类名
		loadingClass: 'loading' // 加载中状态的类名
	}, options);

	// 遍历所有选中的元素（通常是图片）
	return this.each(function() {
		var $this = $(this);
		// 检查是否已经初始化过
		if ($this.data('holdandshow-initialized')) {
			return; // 如果已经初始化过，则直接跳过
		}

		// 初始化 HoldAndShow 对象
		var holdAndShow = new HoldAndShow($this, settings);

		// 保存引用
		$this.data('holdandshow-instance', holdAndShow);
	});
};


// HoldAndShow 类
var HoldAndShow = function(element, settings) {
	if(!element){
		this.settings = {
			delay: 1000, // 显示大图前的延迟（毫秒）
			bigImgClass: 'bigimg', // 大图容器的类名
			loadingClass: 'loading' // 加载中状态的类名
		}
		this.timer = null;
		return this;
	}
	this.$element = element;
	this.settings = settings;
	this.timer = null;
	// 初始化
	this.init();
};
HoldAndShow.$bigImg = null;

// 原型方法重构
HoldAndShow.prototype = {
    init: function() {
        this.$element.data('holdandshow-initialized', true);

        this.WhenMouseEnter().then(this.ShowBigImage)
        this.WhenMouseLeave().then(this.RemoveBigImage)
    },

    WhenMouseEnter: function(){
		var that = this;
        return new Promise(rs=>{
			that.$element.on('mouseenter.holdandshow',function(){
				that.AddSelectedCss(this);
				that.$element.addClass(that.settings.loadingClass);
				if (that.timer) clearTimeout(that.timer);
				that.timer = setTimeout(function() {
				    rs(that);
				}, that.settings.delay);
			})
		})
    },
	AddSelectedCss:function(img){
		$(img).css('border','2px red solid');
	},
	RemoveSelectedCss:function(img){
		$(img).css('border','none');
	},

    WhenMouseLeave: function(){
		var that = this;
        return new Promise(rs=>{
			that.$element.on('mouseleave.holdandshow',function(){
				that.RemoveSelectedCss(this);
				if (that.timer) {
				    clearTimeout(that.timer);
				    that.timer = null;
				}
				that.$element.removeClass(that.settings.loadingClass);
				if (HoldAndShow.$bigImg && !HoldAndShow.$bigImg.is(':hover')) {
				    rs(that);
				}
			})
		})
    },

    ShowBigImage: function(that){
        var bigSrc = that.$element.attr('data-big-src') || that.$element.attr('src');

        if (!HoldAndShow.$bigImg) {
            HoldAndShow.$bigImg = $('<div class="' + that.settings.bigImgClass + '"></div>');
            $('body').append(HoldAndShow.$bigImg);
        }

        HoldAndShow.$bigImg.css({
            'background-image': 'url(' + bigSrc + ')',
            'width': '100%',
            'height': '100vh',
            'position': 'fixed',
            'z-index': '999',
            'top': 0,
            'left': 0,
            'background-repeat': 'no-repeat',
            'background-size': 'cover'
        }).show();

        that.$element.removeClass(that.settings.loadingClass);
        that.RemoveEvents();
    },

    RemoveBigImage: function(){
        if (HoldAndShow.$bigImg) {
            HoldAndShow.$bigImg.hide();
            //HoldAndShow.$bigImg = null;
        }
    },

    RemoveEvents: function(){
        var that = this;
        HoldAndShow.$bigImg.on('mouseleave.holdandshow', function() {
            that.RemoveBigImage();
        });
        // $('body').off('mouseleave.holdandshow').on('mouseleave.holdandshow', function() {
        //     that.RemoveBigImage();
        // });
        // $(window).off('mousewheel.holdandshow DOMMouseScroll.holdandshow')
        //     .on('mousewheel.holdandshow DOMMouseScroll.holdandshow', function() {
        //         that.RemoveBigImage();
        //     });
    },

    destroy: function() {
        if (this.timer) clearTimeout(this.timer);
        this.RemoveBigImage();
        this.$element.off('.holdandshow');
        $('body').off('.holdandshow');
        $(window).off('.holdandshow');
        this.$element.removeData('holdandshow-initialized');
        this.$element.removeData('holdandshow-instance');
    }
};

var Old = $.fn.HoldAndShow;
$.fn.HoldAndShow = function(options) {
    if(typeof options === 'string'){
		HoldAndShow.StaticWay(options);
		return this;
	}else{
		// 手动调用原生方法并处理返回值
		var result = Old.call(this, options);
		// 可以在这里添加额外的逻辑
		return result;
	}
};
HoldAndShow.StaticWay = jquerySelect=>{
	var that = new HoldAndShow(null);
	$('body').on('mouseenter.holdandshow',jquerySelect,function(){
		that.$element = $(this);
		that.AddSelectedCss(this);
		that.$element.addClass(that.settings.loadingClass);
		if (that.timer) clearTimeout(that.timer);
		that.timer = setTimeout(function() {
		    that.ShowBigImage(that);
		}, that.settings.delay);
	})
	$('body').on('mouseleave.holdandshow',jquerySelect,function(){
		that.$element = $(this);
		that.RemoveSelectedCss(this);
		if (that.timer) {
		    clearTimeout(that.timer);
		    that.timer = null;
		}
		that.$element.removeClass(that.settings.loadingClass);
		if (HoldAndShow.$bigImg && !HoldAndShow.$bigImg.is(':hover')) {
		    that.RemoveBigImage(that);
		}
	})
}