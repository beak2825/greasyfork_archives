// ==UserScript==
// @name         Tiezi Image Transfer Batch
// @description  帖子图片批量转存
// @author       陌百百<feng_zilong@163.com>
// @include      http://tieba.baidu.com/photo/p*
// @require      http://code.jquery.com/jquery-1.9.1.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @version      1.0
// @namespace https://greasyfork.org/users/1438
// @downloadURL https://update.greasyfork.org/scripts/1135/Tiezi%20Image%20Transfer%20Batch.user.js
// @updateURL https://update.greasyfork.org/scripts/1135/Tiezi%20Image%20Transfer%20Batch.meta.js
// ==/UserScript==

$(function(){
	var config, _, ImageBatch, TransferUtil, BatchBtnView, u_, u$;

	u_ = unsafeWindow['_'];
	u$ = unsafeWindow['$'];

	//Practical methods
	_ = {};
	_.extend = function(obj){
		Array.prototype.forEach.call(Array.prototype.slice.call(arguments, 1), function(source){
			if(source){
				for (var prop in source){
					obj[prop] = source[prop];
				}
			}
		});
		return obj;
	};

	var ctor = function(){};
	_.bind = function(func, context) {
		var nativeBind, args, bound;
		nativeBind = Function.prototype.bind;
		if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, Array.prototype.slice.call(arguments, 1));
		if (!_.isFunction(func)) throw new TypeError;
		args = Array.prototype.slice.call(arguments, 2);
		return bound = function() {
			if (!(this instanceof bound)) return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
			ctor.prototype = func.prototype;
			var self = new ctor;
			ctor.prototype = null;
			var result = func.apply(self, args.concat(Array.prototype.slice.call(arguments)));
			if (Object(result) === result) return result;
			return self;
		};
	};

	_.defaults = function(obj){
		Array.prototype.forEach.call(Array.prototype.slice.call(arguments, 1), function(source) {
			if(source){
				for(var prop in source){
					if (obj[prop] === void 0) obj[prop] = source[prop];
				}
			}
		});
		return obj;
	};

	_.template = function(text, data, settings){
		var noMatch, escapes, escaper, render;
		noMatch = /(.)^/;
		escapes = {
			"'": "'",
			'\\': '\\',
			'\r': 'r',
			'\n': 'n',
			'\t': 't',
			'\u2028': 'u2028',
			'\u2029': 'u2029'
		};
		escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
		settings = _.defaults({}, settings, {
			evaluate: /<%([\s\S]+?)%>/g,
			interpolate: /<%=([\s\S]+?)%>/g,
			escape: /<%-([\s\S]+?)%>/g
		});

		var matcher = new RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g');

		var index = 0;
		var source = "__p+='";
		text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
			source += text.slice(index, offset).replace(escaper, function(match) {
				return '\\' + escapes[match];
			});

			if(escape){
				source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
			}
			if(interpolate){
				source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
			}
			if(evaluate){
				source += "';\n" + evaluate + "\n__p+='";
			}
			index = offset + match.length;
			return match;
		});
		source += "';\n";

		if(!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

		source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";

		try {
			render = new Function(settings.variable || 'obj', '_', source);
		} catch (e) {
			e.source = source;
			throw e;
		}

		if(data) return render(data, _);
		var template = function(data){
			return render.call(this, data, _);
		};

		template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

		return template;
	};
	

	//Configure
	CFG = {
		TMPL : '<a href="#" title="<%= title%>"><%= text%></a>',
		COUNT_ONE_TIME : 15,   //Image number transfered at one time
		INTERVAL : 500,        //Interval(millisecond)
		RETRY_TIMES : 3        //Retry times when failed
	};



	u_.Module.define({
		path: "common/widget/ImageViewer/MyHint",
		sub: {
			_container: null,
			_hint: null,
			initial: function(){},
			setContainer: function(a){
				this._container = a;
			},
			show: function(d, h){
				if(this._hint){
					this._hint.close();
					this._hint = null;
				}
				var l = this,
					h = h || {};
				var g = d || "";
				var f = {
					modal: false,
					showTitle: false,
					button: false,
					width: "auto"
				};
				h = $.extend(f, h);
				this._hint = u$.dialog.open(g, h);
				if(this._container){
					var e = this._container.offset(),
						m = this._hint.element,
						a = this._container.width(),
						j = this._container.height(),
						c = m.width(),
						b = m.height(),
						i = {
							left: e.left + a / 2 - m.width() / 2,
							top: e.top + j / 2 - m.height() / 2
						};
					m.offset(i);
				}
				return l._hint;
			}
		}
	});


	u_.Module.define({
		path: "common/widget/ImageViewer/tbFavBatch",
		requires: [],
		sub: {
			defaultConf: {
				appid: "314406",
				xiangceUrl: "http://favo.xiangce.baidu.com/",
				uploadUrl: "http://up.xiangce.baidu.com/",
				userId: 0,
				cacheEnabled: false
			},
			defaultData: {
				imgUrl: "",
				sourceURL: "",
				tags: "",
				descript: ""
			},
			conf: {},
			data: {},
			cache: {},
			initial: function() {
				this.conf = $.extend(this.conf, this.defaultConf);
				this.data = $.extend(this.data, this.defaultData);
			},
			setConf: function(a) {
				this.conf = $.extend(this.conf, a);
			},
			setData: function(a) {
				this.data = $.extend(this.data, a);
			},
			getConf: function() {
				return this.conf;
			},
			getData: function() {
				return this.data;
			},
			checkStatus: function(d) {
				if (d) {
					this.setData(d);
				}
				var a = this;
				var c = this.conf;
				var d = this.data;
				if (c.cacheEnabled && this.checkCache(d.imgUrl)) {
					return;
				}
				var b = c.xiangceUrl + "opencom/picture/fav/query?app_id=" + c.appid + "&url=" + d.imgUrl + "&callback=?";
				$.getJSON(b, function(e) {
					if (a.cacheEnabled) {
						var f = (e.errno == 0 && e.data && e.data.status != 0);
						a.setCache(c.imgUrl, f);
					}
				})
			},
			addToFav: function(d){
				if (d) {
					this.setData(d)
				}
				var a = this;
				var c = this.conf;
				var d = this.data;
				var b = c.uploadUrl + "opencom/picture/fav/upload?app_id=" + c.appid + "&descript=" + encodeURIComponent(d.descript) + "&uid=" + c.userId + "&source_url=" + encodeURIComponent(d.sourceURL) + "&tags=" + encodeURIComponent(d.tags) + "&url=" + encodeURIComponent(d.imgUrl) + "&callback=?";
				$.getJSON(b, function(e) {
					if (a.cacheEnabled) {
						var f = (e.errno == 0);
						a.setCache(c.imgUrl, f);
					}
				})
			},
			setCache: function(b, a){
				this.cache[b] = a ? 1 : 0;
			},
			checkCache: function(a){
				return this.cache[a];
			}
		}
	});

	//Transfer Handler
	TransferHandler = function(){
		this._di = unsafeWindow.__moduleInstances__['common/widget/ImageViewer/data_interface'];
		
		this._h = this.getInstance('common/widget/ImageViewer/MyHint');
		this._h.setContainer($('.af_original'));
		
		this._fav = this.getInstance('common/widget/ImageViewer/tbFavBatch');
		this._fav.setConf({userId : this._di.pageData.user_id});
		console.log(this._fav);

		this._completed = 0;
		this._cur = 0;
		this._count = 0;
	};

	_.extend(TransferHandler.prototype, {
		_di : null,
		_fav : null,
		_hint : null,
		getInstance : function(path){
			var instance;
			u_.Module.use(path, [], function(e){
				instance = e;
			});
			return instance;
		},
		showHint : function(msg){
			this._h.show(msg);
		},
		transferAll : function(){
			var _this;
			_this = this;
			this._count = this._di.guide.pic_amount;
			this.showHint('正在转存(0.00%)');
			this.transfer();
		},
		transfer : function(){
			var _this;
			_this = this;
			console.log(this._cur);

			if(this._completed === this._count){
				this._h._hint.element.find('#dialogJbody').text('转存完毕').end().bind('mousemove', function(){
					$(this).remove();
				});
				return;
			}
			
			if(this._cur >= this._di._guideRange[0] && this._cur <= this._di._guideRange[1]){
				imgUrl = this._di.guide.pic_list[this._cur].img.original.url;
				sourceURL = 'http://tieba.baidu.com/p/' + this._di.pageData.tid;
				descript = this._di.albumData.title;
				this._fav.addToFav({
					imgUrl : imgUrl,
					sourceURL : sourceURL,
					descript : descript,
					tags : '百度贴吧'
				});
				
				this._cur++;
				this._completed++;
				this.progress();
				
				setTimeout(function(){_this.transfer();}, 1000);
			} else if(this._cur < this._di._guideRange[0]){
				this._di._requestGuide(this._di.guide.pic_list[this._di._guideRange[0]].img.original.id, CFG['COUNT_ONE_TIME'], 0, function(){_this.transfer();});
			} else if(this._cur > this._di._guideRange[1]) {
				console.log('guideRange -- ' + this._di._guideRange[1]);
				this._di._requestGuide(this._di.guide.pic_list[this._di._guideRange[1]].img.original.id, 0, CFG['COUNT_ONE_TIME'], function(){_this.transfer();});
			}
			
		},
		progress : function(){
			this._h._hint.element.find('#dialogJbody').text('正在转存(' + (this._completed / this._count * 100).toFixed(2) + '%)');
		}
		
	});

	//View
	TransferView = function(handler){
		this.handler = handler;
		this.init();
	};

	_.extend(TransferView.prototype, {
		init : function(){
			this.$el = this.render();
			this.$el.bind('click', _.bind(this.clickHandler, this));
		},
		template : _.template(CFG['TMPL']),
		render : function(){
			var el;
			el = $(this.template({title : "批量转存" ,text : "批量转存"}));
			el.css({'padding-left' : 28, 'background-position' : '-372px 3px'});
			el.hover(function(){
				$(this).css('background-position', '-372px -57px');
			}, function(){
				$(this).css('background-position', '-372px 3px');
			});
			el.insertBefore('.link_share');
			return el;
		},
		clickHandler : function(){
			this.handler.transferAll();
		}
		
	});

	function waitLoad(){
		var fav, contaner;
		fav = $('.link_share');
		container = $('.af_original');
		if(!fav.length || !container.length){
			console.log('wait');
			setTimeout(waitLoad, 100);
		} else {
			console.log('nowait');
			tv = new TransferView(new TransferHandler());
			console.log(tv);
		}
	}
	waitLoad();

	
});