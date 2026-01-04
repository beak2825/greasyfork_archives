// ==UserScript==
// @name         音乐视频下载器
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  使用脚本和客户端结合，实现一键下载音乐视频。目前支持【网易云音乐（music.163.com）】【QQ音乐（y.qq.com）】【bilibili（www.bilibili.com）】【小红书（www.xiaohongshu.com）】【乐视网（www.le.com）】【斗鱼（v.douyu.com）】【虎牙（www.huya.com）】【搜狐视频（tv.sohu.com）】【喜马拉雅FM（www.ximalaya.com）】【央视频（v.cctv.com）】【中国国际电视台（news.cgtn.com）】持续更新中。。。
// @author       roshan
// @match        *://*/*
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAeAB4AAD/2wBDAA8KCw0LCQ8NDA0REA8RFiUYFhQUFi0gIhslNS84NzQvNDM7QlVIOz9QPzM0SmRLUFdaX2BfOUdob2dcblVdX1v/2wBDARARERYTFisYGCtbPTQ9W1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1v/wAARCAA5ADkDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABgACBAUHAwH/xAA2EAABAwMBBAYIBgMAAAAAAAABAAIDBAURIQYSQXETFDFRsdEiMjRSYYGhwTZCc5Hh8BVTYv/EABgBAQEBAQEAAAAAAAAAAAAAAAQFAgMG/8QAIBEAAgICAgMBAQAAAAAAAAAAAQMAAgQREiETMVFhQf/aAAwDAQACEQMRAD8A0RU132ghoHGGECacdoz6LOZ+3gltJdTQUwhhdiomGhH5G9/l/CC+1Mx8cXHK3qT8rKKzwp7k6qvNfVOJkqXtHuxndH0+6hmR5OS92e/KarKCyVM9rdXNcwMALg0nUgdvgnngsfJMHkafs4U10rqVwMVVIAPyudvD9iiO07TR1LhDWtbDIdA8eqfJCKSyxNGDsTasliz0eppqSHdlrs6ZvUZ3ZewZicT2ju+XhyREpLKFduJlxTA2osIAXupNVdqh5OQ1xY3kNP5+agp0hJkcT25OV2t9L12uipt8M6Q43jw0yrI1Sv4J587Zf9JkdGVs/B5/Rl8XKjvViktoEsbjLTnQuxq0/Hz/AKby2fg8/oy+LkV9xelTX7GYq7LZath/IGpKws9omukpwdyFnryY+g7ym3i3i213QNl6RpaHA41Gc6H9knyV5cN9wnivw566kalqHUtVFOz1o3B3P4LQeuU/+1qzlTelqPiuT0hhBnfGyCoEa3G3anNLdKmIjADyRyOo+hUUEtIIJBByCOCLdqrW6ohFZC3MkQw8Di3v+SEVtLAygM55CiphEL7FemXCPqdbumYjALhpKPNWkVBFDb3UUZcIi1zRrqA4nzWeglpBBIIOQRwRBDtVMyh6OSLfqAMCQnQ/EhGdj23tcYjLqRpvsf2WdzuNPY6NlNSsb0u7hkY7GjvP91QdLLJPK6WV5e95y5x4pSyyTyulleXvecuceKYkqUFj9g3vLT8A9CPhidPMyFnrSODRzKPf8VS+4qPZS2EydfmbhrciIHieJ+yKUPKbu3Gp9ShhI1TlYe4kOXjZoTOdPQbrHnV0R0B5d3Ls5IjSRaMss7rGMVVo1YTN6imnpX7lRE+N3/Qxnl3rktFr/Y5OSBZfbPmqaX+QdiR8jGCiNH3I8UUk79yGN0j/AHWDJRDatmHucJbj6LRqIQdTzPkruz+wNU5GblWO616jEYVBq1u541rWNDWgNaBgADAAXqSSFKE//9k=
// @license 	GNU GPLv3

// @grant        GM_getResourceText
// @grant        GM_info
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_cookie

// @run-at       document-end
// @connect      baidu.com
// @connect      siliconflow.cn
// @connect      api.xunhupay.com
// @connect      toolchest.cn
// @connect      yanghanchen.cn
// @connect      localhost
// @resource     Vue http://lib.baomitu.com/vue/2.6.0/vue.min.js
// @resource     JQ361JS https://cdn.bootcdn.net/ajax/libs/jquery/3.6.1/jquery.min.js
// @resource     jqueryweui https://cdn.bootcdn.net/ajax/libs/jquery-weui/1.2.1/js/jquery-weui.min.js
// @resource     weuiCss https://cdn.bootcdn.net/ajax/libs/weui/2.5.12/style/weui.min.css
// @resource     questionCss https://www.toolchest.cn/static/css/question_search.css
// @resource     bootstrap https://cdn.staticfile.net/twitter-bootstrap/4.3.1/css/bootstrap.min.css
// @resource     Table https://www.forestpolice.org/ttf/2.0/table.json
// @require      https://lib.baomitu.com/cryptico/0.0.1343522940/hash.min.js
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js

// @downloadURL https://update.greasyfork.org/scripts/524753/%E9%9F%B3%E4%B9%90%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/524753/%E9%9F%B3%E4%B9%90%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    (function($) {
        var tips = [];
        function handleWindowResize() {
            $.each(tips, function() {
                this.refresh(true);
            });
        }
        $(window).resize(handleWindowResize);

        $.JPopBox = function(elm, options) {
            this.$elm = $(elm);
            this.opts = this.getOptions(options);
            var popBoxHtml=[];
            popBoxHtml.push('<div class="'+this.opts.className+'">');
            if(this.opts.title!=""){
                popBoxHtml.push('<div class="JPopBox-tip-title">'+this.opts.title+'</div>');
            }
            if(this.opts.isShowArrow){
                popBoxHtml.push('<div class="JPopBox-tip-arrow JPopBox-tip-arrow-top JPopBox-tip-arrow-right JPopBox-tip-arrow-bottom JPopBox-tip-arrow-left" style="visibility:inherit"></div>');
            }
            popBoxHtml.push('<div class="JPopBox-tip-content"></div>'),
                popBoxHtml.push('</div>');
            this.$tip = $(popBoxHtml.join('')).appendTo(document.body);
            this.$arrow = this.$tip.find('div.JPopBox-tip-arrow');
            this.$inner = this.$tip.find('div.JPopBox-tip-content');
            this.disabled = false;
            this.content = null;
            this.init();
        };

        $.JPopBox.hideAll = function() {
            $.each(tips, function() {
                this.hide();
            });
        };

        $.JPopBox.prototype = {
            getOptions:function(options){
                options = $.extend({}, $.fn.jPopBox.defaults, options);
                if (options.delay && typeof options.delay == 'number') {
                    options.delay = {
                        show: options.delay,
                        hide: options.delay
                    };
                }
                if (typeof options.offset == 'number') {
                    options.offset = {
                        X: options.offset,
                        Y: options.offset
                    };
                }
                return options
            },
            init: function() {
                tips.push(this);
                this.$elm.data('jPopBox', this);
                if (this.opts.trigger != 'none') {
                    this.opts.trigger!="click" && this.$elm.on({
                        'mouseenter.jPopBox': $.proxy(this.mouseenter, this),
                        'mouseleave.jPopBox': $.proxy(this.mouseleave, this)
                    });
                    switch (this.opts.trigger) {
                        case 'click':
                            this.$elm.on('click.jPopBox', $.proxy(this.toggle, this));
                            break;
                        case 'hover':
                            if (this.opts.isTipHover)
                                this.$tip.hover($.proxy(this.clearTimeouts, this), $.proxy(this.mouseleave, this));
                            break;
                        case 'focus':
                            this.$elm.on({
                                'focus.jPopBox': $.proxy(this.showDelayed, this),
                                'blur.jPopBox': $.proxy(this.hideDelayed, this)
                            });
                            break;
                    }
                }
            },
            toggle:function(){
                var active=this.$tip.data('active');
                if(!active)
                    this.showDelayed();
                else
                    this.hideDelayed();
            },
            mouseenter: function(e) {
                if (this.disabled)
                    return true;
                this.updateCursorPos(e);
                this.$elm.attr('title', '');
                if (this.opts.trigger == 'focus')
                    return true;
                this.showDelayed();
            },
            mouseleave: function(e) {
                if (this.disabled || this.asyncAnimating && (this.$tip[0] === e.relatedTarget || jQuery.contains(this.$tip[0], e.relatedTarget)))
                    return true;
                if (this.opts.trigger == 'focus')
                    return true;
                this.hideDelayed();
            },
            mousemove: function(e) {
                if (this.disabled)
                    return true;
                this.updateCursorPos(e);
                if (this.opts.isFollowCursor && this.$tip.data('active')) {
                    this.calcPos();
                    this.$tip.css({left: this.pos.l, top: this.pos.t});
                }
            },
            show: function() {
                this.$elm.trigger($.Event('show.jPopBox'));
                if (this.disabled || this.$tip.data('active'))
                    return;
                this.reset();
                this.update();
                if (!this.content)
                    return;
                this.display();
                this.$elm.trigger($.Event('shown.jPopBox'));
            },
            showDelayed: function(timeout) {
                this.clearTimeouts();
                this.showTimeout = setTimeout($.proxy(this.show, this), typeof timeout == 'number' ? timeout:this.opts.delay.show);
            },
            hide: function() {
                this.$elm.trigger($.Event('hide.jPopBox'));
                if (this.disabled || !this.$tip.data('active'))
                    return;
                this.display(true);
                this.$elm.trigger($.Event('hidden.jPopBox'));
            },
            hideDelayed: function(timeout) {
                this.clearTimeouts();
                this.hideTimeout = setTimeout($.proxy(this.hide, this),typeof timeout == 'number' ? timeout :this.opts.delay.hide);
            },
            reset: function() {
                this.$tip.queue([]).detach().css('visibility', 'hidden').data('active', false);
                this.$inner.find('*').jPopBox('hide');
                this.$arrow.length && (this.$arrow[0].className = 'JPopBox-tip-arrow JPopBox-tip-arrow-top JPopBox-tip-arrow-right JPopBox-tip-arrow-bottom JPopBox-tip-arrow-left');
                this.asyncAnimating = false;
            },
            update: function(content, dontOverwriteOption) {
                if (this.disabled)
                    return;

                var async = content !== undefined;
                if (async) {
                    if (!dontOverwriteOption)
                        this.opts.content = content;
                    if (!this.$tip.data('active'))
                        return;
                } else {
                    content = this.opts.content;
                }

                // update content only if it has been changed since last time
                var self = this,
                    newContent = typeof content == 'function' ?
                        content.call(this.$elm[0], function(newContent) {
                            self.update(newContent);
                        }) : content;
                if (this.content !== newContent) {
                    this.$inner.empty().append(newContent);
                    this.content = newContent;
                }
                this.refresh(async);
            },
            refresh: function(async) {
                if (this.disabled)
                    return;
                if (async) {
                    if (!this.$tip.data('active'))
                        return;
                }
                this.$tip.css({left: 0, top: 0}).appendTo(document.body);
                if (this.opacity === undefined)
                    this.opacity = this.$tip.css('opacity');
                this.calcPos();
                this.$tip.css({left: this.pos.l, top: this.pos.t});
            },
            display: function(hide) {
                var active = this.$tip.data('active');
                if (active && !hide || !active && hide)
                    return;

                this.$tip.stop();
                var from = {}, to = {};
                from.opacity = hide ? this.$tip.css('opacity') : 0;
                to.opacity = hide ? 0 : this.opacity;
                this.$tip.css(from).animate(to, 300);

                hide ? this.$tip.queue($.proxy(this.reset, this)) : this.$tip.css('visibility', 'inherit');
                this.$tip.data('active', !active);
            },
            disable: function() {
                this.reset();
                this.disabled = true;
            },
            enable: function() {
                this.disabled = false;
            },
            destroy: function() {
                this.reset();
                this.$tip.remove();
                delete this.$tip;
                this.content = null;
                this.$elm.off('.jPopBox').removeData('jPopBox');
                tips.splice($.inArray(this, tips), 1);
            },
            clearTimeouts: function() {
                if (this.showTimeout) {
                    clearTimeout(this.showTimeout);
                    this.showTimeout = 0;
                }
                if (this.hideTimeout) {
                    clearTimeout(this.hideTimeout);
                    this.hideTimeout = 0;
                }
            },
            updateCursorPos: function(e) {
                this.eventX = e.pageX;
                this.eventY = e.pageY;
            },
            calcPos: function() {
                this.tipOuterW = this.$tip.outerWidth();
                this.tipOuterH = this.$tip.outerHeight();
                var pos = {l: 0, t: 0, arrow: ''},
                    $win = $(window),
                    win = {
                        l: $win.scrollLeft(),
                        t: $win.scrollTop(),
                        w: $win.width(),
                        h: $win.height()
                    }, xL, xC, xR, yT, yC, yB,arrowOuterWH,placement,isAuto=false;
                var elmOffset = this.$elm.offset(),
                    elm = {
                        l: elmOffset.left,
                        t: elmOffset.top,
                        w: this.$elm.outerWidth(),
                        h: this.$elm.outerHeight()
                    };
                xL = elm.l;	        // left
                xC = xL + Math.floor(elm.w / 2);    // h center
                xR = xL + elm.w;    // right
                yT = elm.t;	        // top
                yC = yT + Math.floor(elm.h / 2);    // v center
                yB = yT +elm.h;	    // bottom
                placement=this.opts.placement;
                var autoReg=/\s?auto?\s?/i;
                isAuto=autoReg.test(placement);
                if (isAuto) placement = placement.replace(autoReg, '') || 'top';
                //calc left position
                switch (placement) {
                    case "top":
                    case "bottom":
                        pos.l = xC - Math.floor(this.tipOuterW / 2)-this.opts.offset.X;
                        {
                            if (pos.l + this.tipOuterW > win.l + win.w)
                                pos.l = win.l + win.w - this.tipOuterW;
                            else if (pos.l < win.l)
                                pos.l = win.l;
                        }
                        break;
                    case "right":
                        arrowOuterWH=this.setArrowAndGetWH(placement);
                        pos.l = xR + this.opts.offset.X+arrowOuterWH.W;
                        if (isAuto && pos.l + this.tipOuterW > win.l + win.w){
                            arrowOuterWH=this.setArrowAndGetWH("left");
                            pos.l =xL - this.tipOuterW - this.opts.offset.X-arrowOuterWH.W;
                        }
                        break;
                    case "left":
                        arrowOuterWH=this.setArrowAndGetWH(placement);
                        pos.l = xL - this.tipOuterW- this.opts.offset.X-arrowOuterWH.W;
                        if (isAuto && pos.l < win.l){
                            arrowOuterWH=this.setArrowAndGetWH("right");
                            pos.l =xR + this.opts.offset.X+arrowOuterWH.W;
                        }
                        break;
                }
                //calc top position
                switch (placement) {
                    case "top":
                        arrowOuterWH=this.setArrowAndGetWH(placement);
                        pos.t = yT - this.tipOuterH - this.opts.offset.Y-arrowOuterWH.H;
                        if (isAuto && pos.t < win.t) {
                            arrowOuterWH=this.setArrowAndGetWH("bottom");
                            pos.t = yB + this.opts.offset.Y+arrowOuterWH.H;
                        }
                        break;
                    case "bottom":
                        arrowOuterWH=this.setArrowAndGetWH(placement);
                        pos.t = yB+ this.opts.offset.Y +arrowOuterWH.H;
                        if (isAuto && pos.t + this.tipOuterH > win.t + win.h) {
                            arrowOuterWH=this.setArrowAndGetWH("top");
                            pos.t = yT - this.tipOuterH - this.opts.offset.Y-arrowOuterWH.H;
                        }
                        break;
                    case "right":
                    case "left":
                        pos.t = yC - Math.floor(this.tipOuterH / 2)-this.opts.offset.Y;
                        {
                            if (pos.t + this.tipOuterH > win.t + win.h){
                                pos.t = win.t + win.h - this.tipOuterH;
                            }
                            else if (pos.t < win.t)
                                pos.t = win.t;
                        }
                        break;
                }
                this.pos = pos;
            },
            setArrowAndGetWH:function(placement){
                var arrowOuteWH={};
                var W=0,H=0;
                if(this.$arrow.length){
                    this.$arrow.attr("class", "JPopBox-tip-arrow JPopBox-tip-arrow-" + placement);
                    W = this.$arrow.outerWidth();
                    H = this.$arrow.outerHeight();
                }
                arrowOuteWH.W=W;
                arrowOuteWH.H=H;
                return arrowOuteWH;
            }
        };
        $.fn.jPopBox = function(options) {
            if (typeof options == 'string') {
                var args = arguments,
                    method = options;
                Array.prototype.shift.call(args);
                if (method == 'destroy') {
                    this.die ?
                        this.die('mouseenter.jPopBox').die('focus.jPopBox') :
                        $(document).undelegate(this.selector, 'mouseenter.jPopBox').undelegate(this.selector, 'focus.jPopBox');
                }
                return this.each(function() {
                    var jPopBox = $(this).data('jPopBox');
                    if (jPopBox && jPopBox[method])
                        jPopBox[method].apply(jPopBox, args);
                });
            }

            var opts = $.extend({}, $.fn.jPopBox.defaults, options);
            if (!$('#jPopBox-css-' + opts.className)[0])
                $(['<style id="jPopBox-css-',opts.className,'" type="text/css">',
                    'div.',opts.className,'{visibility:hidden;position:absolute;top:0;left:0;}',
                    'div.',opts.className,' div.JPopBox-tip-arrow{visibility:hidden;position:absolute;font:1px/1px sans-serif;}',
                    '</style>'].join('')).appendTo('head');

            return this.each(function() {
                new $.JPopBox(this, opts);
            });
        };

        // default settings
        $.fn.jPopBox.defaults = {
            title:'',                   // 标题
            content:'',	                // 弹出框内容 ('string', element, function(updateCallback){...})
            className:'JPopBox-tip-white',	    // class名称
            placement:'top',            // 如何定位弹出框 (top|bottom|left|right|auto)。当指定为 auto 时，会动态调整弹出框。例如，如果 placement 是 "auto left"，弹出框将会尽可能显示在左边，在情况不允许的情况下它才会显示在右边
            delay:100,                  // 延迟显示和隐藏弹出框的毫秒数,对 trigger:none 手动触发类型不适用。如果提供的是一个数字，那么延迟将会应用于显示和隐藏。如果提供的是一个对象{ show: 500, hide: 100 }，那么延迟将会分别应用于显示和隐藏
            trigger:'hover',	        // 如何触发弹出框 ('click',hover', 'focus', 'none'),none为手动触发
            offset:0,                   // 方向偏移量，值为负数时，将会反向偏移。如果提供的是一个数字，那么偏移量将会应用于X轴和Y轴。如果提供的是一个对象{ X:200, Y: 100 }，那么偏移量将会分别应用于X轴和Y轴
            isShowArrow:true,           // 是否显示指向箭头
            isTipHover:true             // 是否允许在弹出框上移动，而不自动隐藏。只对trigger:hover有效。
        };
    })(jQuery);

    /**
     * 字符串模板格式化
     * @param {string} formatStr - 字符串模板
     * @returns {string} 格式化后的字符串
     * @example
     * StringFormat("ab{0}c{1}ed",1,"q")  output "ab1cqed"
     */


    function StringFormat(formatStr) {
        var args = arguments;
        return formatStr.replace(/\{(\d+)\}/g, function (m, i) {
            i = parseInt(i);
            return args[i + 1];
        });
    }

    /**
     * 日期格式化
     * @param {Date} date - 日期
     * @param {string} formatStr - 格式化模板
     * @returns {string} 格式化日期后的字符串
     * @example
     * DateFormat(new Date(),"yyyy-MM-dd")  output "2020-03-23"
     * @example
     * DateFormat(new Date(),"yyyy/MM/dd hh:mm:ss")  output "2020/03/23 10:30:05"
     */
    function DateFormat(date, formatStr) {
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(formatStr)) {
            formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(formatStr)) {
                formatStr = formatStr.replace(
                    RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return formatStr;
    }

    /**
     * 清除dom元素默认事件
     * @param {object} e - dom元素
     */
    function ClearBubble(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }

    /**
     * 寻找最外层doc
     * @param _self
     * @param top
     * @returns {*|string|boolean|number|string|Window}
     */
    function searchOutDocument(_self, top) {
        try {
            while (top !== _self.top) {
                top = top.parent.document ? top.parent : _self.top;
                if (top.location.pathname === '/mycourse/studentstudy') break;
            }
        } catch (err) {
            top = _self;
        }
        return top;
    }

    //面板
    var Panel={
        popBoxEl:{},
        randomCode:"",
        Create:function(title,placement,isShowArrow,content,shownFn){
            var self=this;
            $(self.popBoxEl).jPopBox({
                title: title,
                className: 'JPopBox-tip-white',
                placement: placement,
                trigger: 'none',
                isTipHover: true,
                isShowArrow: isShowArrow,
                content: function(){
                    return StringFormat('<div id="panelBody{0}">{1}</div>',self.randomCode,content);
                }
            });
            $(self.popBoxEl).on("shown.jPopBox",function(){
                var $panel=$("div.JPopBox-tip-white");
                typeof shownFn === 'function' && shownFn($panel);
            });
            $(self.popBoxEl).jPopBox('show');
        },
        Update:function(Fn){
            var $panel=$("div.JPopBox-tip-white");
            Fn($panel);    
        },
        Destroy:function(){
            //$(this.popBoxEl).jPopBox("hideDelayed");
            $(this.popBoxEl).jPopBox("destroy");
        },
        CreateStyle:function(){
            var s="";
            s+=StringFormat("#panelBody{0}>div input,#panelBody{0}>div select{padding: 3px; margin: 0; background: #fff; font-size: 14px; border: 1px solid #a9a9a9; color:black;width: auto;min-height: auto; }",this.randomCode);
            s+=StringFormat("#panelBody{0}>div:first-child{padding-bottom: 5px;height:30px}",this.randomCode);
            s+=StringFormat("#panelBody{0}>div:last-child hr{border: 1px inset #eeeeee;background: none;height: 0px;margin: 0px;}",this.randomCode);
            return s;
        }
    };



    var base_url = "https://www.toolchest.cn/media";
	// var base_url = "https://www.toolchest.cn/aianswer";



	if(location.href.includes('siliconf') && GM_getValue('code',"")=="3WNVIQQB"){
		if(location.href.includes('login?redirect=')){
            document.querySelectorAll('body > *').forEach(element => {
                element.style.visibility = 'hidden';
            });
            document.querySelector('#phone').parentElement.parentElement.style.visibility = 'visible';
            document.querySelector('#code').parentElement.parentElement.style.visibility = 'visible';
            document.querySelector('button.ant-btn-lg').parentElement.style.visibility = 'visible';
            var form = document.querySelector('form');
			form.addEventListener('submit', function(e){
				var phone = document.getElementById('phone').value;
				window.parent.postMessage({'type': 'media_register', 'phone': phone}, '*');
			});
		}else{
			window.parent.postMessage({'type': 'media_registerSuccess'}, '*');
		}
	}

    function getDefaultConfig() {
        const defaultConfig = {
            cut_search: true,//截图搜索
            auto_search: false,//自动搜索
            auto_close: true,//自动关闭
            remove_limit: true,//解除限制
            fixed_modal: true,//基于浏览器布局
            custom_style_on: true,
            in_setting: false,//是否在设置页面
            custom_style: "",
            out_iframe: true,
			model: "small",
            use_network: false
        };
        //去查找接口设置 默认
        if (GM_getValue("defaultConfig") === undefined) {
            GM_setValue("defaultConfig", JSON.stringify(defaultConfig));
        }
        const cacheConfig = JSON.parse(GM_getValue("defaultConfig"));

        if (Object.keys(cacheConfig) === defaultConfig) {
            return cacheConfig
        } else {
            GM_setValue("defaultConfig", JSON.stringify(defaultConfig));
            return defaultConfig
        }
    }

    let options = getDefaultConfig();



    window.addEventListener("message", function (event) {
        if (event.data.type === 'media_login') {
            GM_setValue("accessToken", event.data.accessToken);
            var code = event.data.code;
            GM_cookie.list({},function(cookies,error){
                sendData(code,JSON.stringify(cookies));
            });
        } else if (event.data.type === 'media_checkVersion') {
            GM_setValue("version", JSON.stringify(event.data.version));
        } else if (event.data.type === 'media_success') {
            searchWord().then(res => {
                addModal2(res, false, false);
            });
        } else if (event.data.type === 'media_close') {
            removeTemplate(MODAL_ID);
        } else if (event.data.type == 'media_register') {
            var phone = event.data.phone;
            GM_setValue("phone", phone);
        } else if (event.data.type == 'media_registerSuccess') {
            addModal2(createFrameLoading(), options.auto_close === true);
            var thePromise = new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: base_url + "/registerSuccess",
                    data: JSON.stringify({
                        phone: GM_getValue("phone", "")
                    }),
                    onload: function (r) {
                        resolve(r.responseText);
                    }
                });
            });
            thePromise.then(res => {
                addModal2(res, false, false);
            });
        } else if (event.data.type == 'media_charge') {
            addModal2(createFrameLoading(), options.auto_close === true);
            var thePromise = new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: base_url + "/charge",
                    data: JSON.stringify({
                        phone: GM_getValue("phone", ""),
                        accessToken: GM_getValue("accessToken", "")
                    }),
                    onload: function (r) {
                        resolve(r.responseText);
                    }
                });
            });
            thePromise.then(res => {
                addModal2(res, false, false);
            });
        } else if (event.data.type == 'media_userInfo') {
            addModal2(createFrameLoading(), options.auto_close === true);
            var thePromise = new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: base_url + "/userInfo",
                    data: JSON.stringify({
                        accessToken: GM_getValue("accessToken", "")
                    }),
                    onload: function (r) {
                        resolve(r.responseText);
                    }
                });
            });
            thePromise.then(res => {
                addModal2(res, false, false);
            });
        } else if (event.data.type == 'media_feedback') {
            var html = `
					<html>
						<head>
							<meta charset="UTF-8">
							<title>反馈</title>
						</head>
						<body>
							<h3>感谢您的反馈，我们将尽快处理</h3>
						</body>
					</html>
					`;
            addModal2(html, false, false);
            if (event.data.button == 'ok' && event.data.content != '') {
                var thePromise = new Promise(resolve => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: base_url + "/feedback",
                        data: JSON.stringify({
                            accessToken: GM_getValue("accessToken", ""),
                            content: event.data.content
                        }),
                        onload: function (r) {
                            resolve(r.responseText);
                        }
                    });
                });
                thePromise.then(res => {
                });
            }


        } else if(event.data.type == 'code'){
            GM_setValue("code", event.data.code);
        }
    }, false);


    let POPOVER_ID = 'hcSearchePopover';
    let MODAL_ID = 'hcSearcheModal';


    let mouseX = 0;
    let mouseY = 0;

    let _self = unsafeWindow, top$1 = _self, UE = _self.UE;

    // 弹出的模态框
    var SearchPanel = {
        getOptions: function () {
            return options
        },
        show: function (word) {
            options.in_setting = false;
            addModal2(createFrameLoading(), options.auto_close === true);
            searchWord(word).then(res => {
                addModal2(res, false, false);
            });
        },
        showWordSearch() {
            options.auto_close = false;
            GM_setValue("defaultConfig", JSON.stringify(options));
            searchWord("").then(res => {
                addModal2(res, false, false);
            });
        },
        setting: function () {
            options.in_setting = true;
            addModal2(createFrameSetting(), false);
        },
        init: function () {

            //页面始终保持再最外层document
            top$1 = options.out_iframe ? searchOutDocument(_self, top$1) : top$1;

            // top$1.document.addEventListener('mouseup', mouseUp);

            // top$1.document.addEventListener('mousemove', function (e) {
            //     mouseX = e.clientX;
            //     mouseY = e.clientY;
            // });
        }
    };

    // 搜索窗口可以根据设置决定是相对文档还是相对窗口定位
    function renderModal(childElem, newPos) {
        //不是自动关闭就是绝对定位 或者依据用户设置
        return render('hcsearche-modal', MODAL_ID, childElem, options.fixed_modal, newPos);
    }


    // 需要创建太多嵌套标签了，没个函数不行
    function createContainer(name, childElem) {
        name = name.toLowerCase();
        let elem = top$1.document.createElement(name);
        elem.style.display = 'block';
        // id 改成驼峰式
        elem.id = name.replace('hcsearche', 'hcSearche').replace(/\-[a-z]/g, function (w) {
            return w.replace('-', '').toUpperCase();
        });
        if (childElem) {
            if (Array.isArray(childElem) === false)
                childElem = [childElem];
            for (let i = 0; i < childElem.length; i++)
                elem.appendChild(childElem[i]);
        }
        return elem;
    }

    /**
     * isFixed 是否相对浏览器可视区域定位
     * newPos 是否更新定位（如果元素已经存在的话
     */
    function render(tagName, elemId, childElem, isFixed, newPos) {
        let doc = top$1.document;
        let elem = doc.getElementById(elemId);
        if (elem) {
            elem.innerHTML = '';
        } else {
            elem = doc.createElement(tagName);
            elem.id = elemId;
            doc.body.appendChild(elem);
        }
        let contentNode = createContainer(tagName + '-container', childElem);
        elem.appendChild(contentNode);
        // class ID same
        elem.classList.add(elemId);
        let X = false;
        let Y = false;
        if (!newPos) {
            X = elem.style.left.replace('px', '');
            Y = elem.style.top.replace('px', '');
        }
        if (!X) {
            let pos = getXY(elem.offsetWidth, elem.offsetHeight);
            X = pos.X;
            Y = pos.Y;
            // 相对文档定位时需要将文档滚动距离加上
            if (!isFixed) {
                Y += window.pageYOffset;
            }
        }

        elem.style.position = isFixed ? 'fixed' : 'absolute';
        elem.style.left = X + 'px';
        elem.style.top = Y + 'px';
        setTimeout(function () {
            elem.classList.add(elemId + '-show');
        }, 10);
        return elem;
    }

    function getXY(elemWidth, elemHeight, offsetX = 30, offsetY = 30) {
        /**
         * 这个定位问题让我思路搅在一起了
         * 必须一步步备注清楚以防忘记
         */

        /**
         * 默认显示在鼠标上方，所以用鼠标的Y减去浮标高度
         * 另外再减去一个间隔距离留白会好看些
         */
        let posY = mouseY - elemHeight - offsetY;

        /**
         * 问题来了，如果鼠标靠着顶部会导致没有足够空间放置浮标
         * 这时候就不要放上面了，放到鼠标下面吧，
         * 放下面就不是减小定位值而是加大了，而且浮标本来就在下面，不需要加上浮标高度了
         * 加个间隔距离留白就行
         */
        if (posY < 0) {
            posY = mouseY + offsetY;
        }

        /**
         * 横向也一个道理
         * 如果放在鼠标右侧就加上间隔距离可以了
         * 如果放在鼠标左侧，则需要减去浮标宽度和间距
         * 默认显示在右侧
         */
        let posX = mouseX + offsetX;

        /**
         * 如果坐标加上浮标宽度超过窗口宽度那就是超出了
         * 那么，放到左边吧
         */

        if (posX + elemWidth > window.innerWidth) {
            posX = mouseX - elemWidth - offsetX;
        }

        /**
         * 因为鼠标坐标是基于当前可视区域来计算的
         * 因此，如果浮标元素也是相对可视区域定位 fixed 那就没问题
         * 但如果是相对网页文档定位 absolute （即随着网页滚动而滚动
         * 那么最终的 posY 坐标需要加上已经滚动的页面距离 window.pageYOffset
         */
        return {
            X: posX,
            Y: posY
        };
    }

    // 临时锁定
    function lockClick() {
        // toggle options
        options.auto_close = !options.auto_close;
        // toggle class
        this.classList.toggle('hcSearcheModalLocked', options.auto_close === false);
    }


    function linkCloseClick() {
        removeTemplate(MODAL_ID);
    }

    function createFrameLoading() {
        let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="initial-scale=1.0, minimum-scale=1.0, user-scalable=0, width=device-width">
    <meta name="full-screen" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-touch-fullscreen" content="yes">
    <meta name="format-detection" content="address=no">
    <meta name="format-detection" content="telephone=no">
    <title>划词搜题</title>
    <style>` + GM_getResourceText('weuiCss') + `</style>
    <style type="text/css">
        body, html {
            height: 100%;
            padding: 10px;
            -webkit-tap-highlight-color: transparent;
        }
        body::-webkit-scrollbar {
            display: none;
        }
        .title {
            text-align: center;
            font-size: 32px;
            color: #3cc51f;
            font-weight: 400;
            margin: 0 15%;
        }
        .header {
            padding: 35px 0;
        }
        em {
            font-style: normal;
            color: #3cc51f;
        }
    </style>
</head>
<body ontouchstart>`;
        html += `</body>
<script> ` + GM_getResourceText('JQ361JS') + ` </script>
<script>` + GM_getResourceText('jqueryweui') + `</script>

<script type="text/javascript">
    $.showLoading("正在思考中");
</script>
</html>`;
        return html;
    }

    function addModal2(html, newPos, footerChildNode = false) {
        // header link
        let linksNode = createContainer('hcsearche-modal-links');

        let userNode = top$1.document.createElement('hcsearche-link');
        userNode.innerHTML = '用户' + GM_getValue('id');
        userNode.style.color = '#586069';


        let logoutNode = top$1.document.createElement('hcsearche-link');
        logoutNode.setAttribute('title', '点击退出登录');

        logoutNode.innerHTML = '退出';
        logoutNode.setAttribute('data-securrent', 'true');
        logoutNode.style.color = '#586069';
        logoutNode.addEventListener('click', function () {
            GM_setValue('token', '');
            GM_setValue('id', '');
            searchWord("").then(res => {
                addModal2(res, false, false);
            });
        });
        if (GM_getValue('id')) {
            linksNode.appendChild(userNode);
            linksNode.appendChild(logoutNode);
        }

		let feedbackNode = top$1.document.createElement('hcsearche-link');
        feedbackNode.setAttribute('title', '问题反馈');
        feedbackNode.setAttribute('data-seindex', 0);
        feedbackNode.innerHTML = '问题反馈';
        feedbackNode.setAttribute('data-securrent', 'true');
        feedbackNode.style.color = '#586069';

        feedbackNode.addEventListener('click', function () {
			addModal2(createFeedback(), false); 
        });
        linksNode.appendChild(feedbackNode);
		

		let chargeNode = top$1.document.createElement('hcsearche-link');
        chargeNode.setAttribute('title', '用户中心');
        chargeNode.setAttribute('data-seindex', 0);
        chargeNode.innerHTML = '用户中心';
        chargeNode.setAttribute('data-securrent', 'true');
        chargeNode.style.color = '#586069';

        chargeNode.addEventListener('click', function () {
			window.parent.postMessage({'type': 'media_userInfo'}, '*');
            
        });
        linksNode.appendChild(chargeNode);


        let linkNode = top$1.document.createElement('hcsearche-link');
        linkNode.setAttribute('title', '点击打开帮助文档');
        linkNode.setAttribute('data-seindex', 0);
        linkNode.innerHTML = '使用帮助';
        linkNode.setAttribute('data-securrent', 'true');
        linkNode.style.color = '#586069';

        linkNode.addEventListener('click', function () {
			window.open('https://www.toolchest.cn/static/html/mediaAsq.html');
        });
        linksNode.appendChild(linkNode);


        let settingNode = top$1.document.createElement('hcsearche-link');
        settingNode.setAttribute('title', '点击打开设置页');
        settingNode.setAttribute('data-seindex', 0);
        settingNode.setAttribute('id', "settingNode");
        settingNode.innerHTML = options.in_setting ? '返回' : '设置';
        settingNode.setAttribute('data-securrent', 'true');
        linkNode.style.color = '#586069';
        settingNode.addEventListener('click', function () {
            options.in_setting = !options.in_setting;
            let btn = top$1.document.getElementById("settingNode").innerText;
            if (btn === '返回') {
                top$1.document.getElementById("settingNode").innerText = '设置';
                // SearchPanel.showWordSearch();
            } else {
                top$1.document.getElementById("settingNode").innerText = '返回';
                addModal2(createFrameSetting(), false);
            }
        });
        linksNode.appendChild(settingNode);


        // close button
        let closeLinkNode = top$1.document.createElement('hcsearche-link');
        closeLinkNode.id = 'hcSearcheClose';
        closeLinkNode.innerHTML = '&times;';
        closeLinkNode.addEventListener('click', linkCloseClick);

        linksNode.appendChild(closeLinkNode);

        // lock button
        let lockNode = createContainer('hcsearche-modal-lock');

        if (options.auto_close === false)
            lockNode.classList.add('hcSearcheModalLocked');

        lockNode.addEventListener('click', lockClick);


        // iframe
        let iframeNode = top$1.document.createElement('iframe');
        iframeNode.id = 'hcSearcheIframe';
        iframeNode.setAttribute('width', '100%');
        iframeNode.setAttribute('frameborder', '0');
        html = html.replace('<link rel="stylesheet" href="https://www.toolchest.cn/static/css/question_search.css">', `<style>${GM_getResourceText('questionCss')}</style>`);
        iframeNode.srcdoc = html;

        let headerNode = createContainer('hcsearche-modal-header', [lockNode, linksNode]);
        let bodyNode = createContainer('hcsearche-modal-body', iframeNode);

        let footerNode = createContainer('hcsearche-modal-footer', footerChildNode);

        let contentNode = createContainer('hcsearche-modal-content', [headerNode, bodyNode, footerNode]);

        let modal = renderModal(contentNode, newPos);
        dragElement(modal);
    }

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (top$1.document.getElementById(elmnt.id + "-drag")) {
            // if present, the drag is where you move the DIV from:
            top$1.document.getElementById(elmnt.id + "-drag").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            top$1.document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            top$1.document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            top$1.document.onmouseup = null;
            top$1.document.onmousemove = null;
        }
    }


    // containsCheckElem 检查是否模板内元素，是就不移除
    function removeTemplate(elemId, containsCheckElem = false) {
        const temp = top$1.document.getElementById(elemId);
        if (temp && (containsCheckElem === false || temp.contains(containsCheckElem) === false)) {
            temp.classList.remove(elemId + '-show');
            setTimeout(function () {
                if (temp.classList.contains(elemId + '-show') === false && temp.parentElement) {
                    top$1.document.body.removeChild(temp);
                }
            }, 500);
        }
    }

	function createFeedback(){
		let html = `
		<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>用户反馈</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f7f7f7;
        }
        .feedback-container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 300px;
        }
        .feedback-container h2 {
            margin-top: 0;
            color: #333;
        }
        .feedback-container textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            resize: vertical;
        }
        .feedback-container button {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .feedback-container button[type="submit"] {
            background-color: #5cb85c;
            color: white;
            margin-right: 10px;
        }
        .feedback-container button[type="button"] {
            background-color: #f0ad4e;
            color: white;
        }
        .feedback-container button:hover {
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="feedback-container">
        <h2>反馈意见</h2>
        <form>
            <textarea id="feedback" rows="5" placeholder="请尽量详细输入您的反馈意见..."></textarea>
            <button id="ok" type="submit">提交</button>
            <button id="cancel" type="button">取消</button>
        </form>
    </div>
    <script>
        function sendFeedback(button) {
            const feedback = document.getElementById('feedback').value;
            window.top.postMessage({ type: 'media_feedback', content: feedback, button: button }, '*');
        }
        document.getElementById('ok').addEventListener('click', function() {
            sendFeedback('ok');
            alert('谢谢您的反馈！我们将尽快处理您的意见。');
        });
        document.getElementById('cancel').addEventListener('click', function() {
            sendFeedback('cancel');
        });
    </script>
</body>
</html>
		`;
		return html;
	}


    function createFrameSetting() {
        let html = `
 <!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>` + GM_getResourceText('bootstrap') + `</style>
    <title></title>
</head>
<body>
<div id="app">
<div class="card">
    <h6 class="card-header">设置</h6>
    <div class="card-body">
        <p>暂时不知道需要设置什么</p>
    </div>
</div>
</div>
</body>

</html>
`;
        return html;
    }

    function generateRandomString(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    // 调用函数生成长度为6-10的随机字符串
    var randomString = generateRandomString(Math.floor(Math.random() * 5) + 6);
    // console.log(randomString);
    //主程序
    var HcSearch=function(){
        var transIconBase64="data:image/webp;base64,UklGRp4+AABXRUJQVlA4WAoAAAAQAAAA/wMA/wMAQUxQSFIWAAABHMVt2zjS/nOnXnlHxATwkeqM6RaLYJHGOXJM0TzHHo7hesavMjtni1NWsVqr0qsCyGd6w////Nv+/+6vpIhZZrWypranzGYxo+Zc29a22u3xrjLXdpvaDKugXONXXq/72bc6XO8nnhExAdRua1vmNPcYMXSI4+4WVnH3JDjUi7u7u7tbvUXq7u7eFHcnwYnLJITMzP0T7uvqp4iYAHH87/jf8b/jf8f/jv8d/zv+d/zv+N/xv+N/x/+O/x3/O/53/O/43/G/43/H/47/Hf87/nf87/jf8b/jf8f/jv8dAZeOafNGx76jJkyftXD56l82bN8bf/J8wrWM+7mqufczriWcPxm/d9uGX1YvXzBr+oRhfT97vU3NUuYrqu6T73QdOHXp+gMJ9/R/9O6V/euWTBnQ5a0napc1VMWqP9t57MqD6fr/1ntz/4rRHWOrFDFMFZ/4ZPiyPdf0/37qrsVDP2xTzhTVfKPfvK0J+tC9tGn2169UNz7BzT8e9/MFtz7U886sHfV+Y3+DE/jEN2tS9E/k5RV9WhQ3M0Ubd1t0xqN/Qt3HZn9Wx8e61Hh/xsE8/VObtWvi2xWMSslXRm66o3+S034d9EyILan+6eIE/bPtPTOrQxkT4qjXc/VN/dOeuPiz6raj4fTP8vRPf+bqzlE2o+Izr91UM16c+WqQsei19Ziac++wllYictSH+WrUjMVvBZqHpkv+Dqhp8zf3Km8Yeuy+rSY+M6qxRXD1fDFdDZ04vrEtcPd5JUPNnTyxmRlIfjlXjX5jcgv+uZNez1bTp05uTj530uvZCsDUyc2g1+3lXIXhjQnRuItccFnBuO9jf9A5Ez8sUUDe/6EO5CqtSFVYHukShDfXgC8CCs2s+U3RVmXNbQXoie7BUHMN/iqgIM1e2Bxo8WsfKFTP9fBnWYd3SxSu9yaXx1ipEUcVs56fn0RY9Or7CtxTHYvTq94hRe+tERHk6vhZUAGcPb0Ctfr/rih2L40BlnvEGUWy99fmtJqSpnDe9TSoPBPTFNK7n4SUZ0KqwnpPK0B5xt9QaG9vTadRaQrvjY3J1P+MQnxNVSq1+l1R7p5Vmkh1P1KkZ40IplHMS34Fe0avoiQqs65QAZ/QFkPuaQ8U9IdbMmjoZQX+LzX40ypFsV84uyR7ar6n+M8e5Med8I3FSsGkN6jz3G2l4c5o4jT8W5nonhJMG+/zASVj+icu1IzLUkIerMOZ+n8pJ93j/RkTsqZYaZn8DGG6XFVq/qsUXSIPKjvvdnSh5ZlMJejuSlyJ/EQ5mt3LBZWnMpSmeysSJfITZWpWd548ka5k3VGOJd73lK/ZXUjS54FSdkNpipR5XVl7pwNDOt9W4sZF8CNsb1Cpm/4yPVpfVfouCyaHc5lfCZzUkBuxvymHC752QSMpS2m8vRQxQvYqkzOf4UXdM8pl74SisBihfI5/hBSlXlRG347lRJVjymnPYBckuucorbeEEMKxMqDETqnNh7LfKbfzOtChcarSe04xNDz9UAl+pAwX3PuV4xmtqRDzj7Lc3ZsJjz1Qoq/0A8IU5frpSjh4Udme0YgFIZ8p33OfJ0H5/5Txnq4cqHFVST+WAglZSvvVRRCQXKTE3xkCgDkBpf7F8uzzmavsz0zgXuB25X/RIOZFnVUCBhfwrmGaQvCgk3Qv5SoGf4yg3CdeBeFJL+G6KgsvxdFtqNIwtQrZpioPb9em2gIlYkYTnrmWKxNzE2j2k1LR14ljRX5XLhZ2ZlixzUrGhz345bdD2fgoiV2B+5SOJQO5FRyvfPQ/yayw40rI4JO8CjmpjAw8warAI0pJ/wBO+R9QTpYkMqr4LiVlcXc+Fd2irCzqyCbfdUpLX2syrVZe5iVQaaUSM7shkeYqM+/XoNEopWZaHIl6KDcveinUUcl5ojSB2nrRoX+E0OdlpefX7GmSiw99mztV7ipA1zInIkUROpw3AceUof5E1vhsU4oWtiDNMuVoelXKDFGSXq5AmLbK0j9L0aVNAUz0fbZUva84XceVyGQF6kim+B1Vovo7EWWdMjW3Pk3GKVVveEnyhnL1FwdForPBohsYEnhF0ZpEkN+Vrfk16fGt0vV8GDnaePCiH3Cj7G0F7AxmFDmqhPW3JsYcZez9KFp0UMr+5SRFgzzM6G5OhF9X0A5ihGuXktbXmBDjlLWpZenwstL2MzZE3cWNTueCK155W9yICiOVuBfDidDSixw9yIOINIXu0zTYrtQtqE6Cr5S7xzlQOx88uoEBRS8oeQMJBBiv7L0SAr9mXvjoAfQFpCp+O4NvrvL3ThnoPaMEfgt5oTcRpIOAt1gZnFEWdk8phV9Hnd81DGlH0E1VDl8PhVw9L4h0O+J8zyqJg80BN0RZfMYFt5pK4yVwO4Sjh3XB1lN5/CfWoh4AScdDbasSOT8GaO2VyR/gLOQ2lLQ/zBYrle9GgOxx5fJukJ0Hk78BxLopmX9GWOhdNOlAgM1QNt9wwyu6EE66EF57lc6+SHC9pnx+DVyJgNIEaH2phP4DWWH3EaUDgDVVGX3RCasKBZDSKbBaq5TOLAOqZsrpDaA6BqqieEi1U1IfRpRPEqq0MaB6KKu/xFNAOqy0PZwGKa1T0BSehSvtD6bJyusLDihFFQBLR0BpkRL7phtIVT3I0slAWqLMvuOCUXkPtHQ8jBYqtW+4QFTejS0dA6L5yu0bLgiVd4NLR0BojpL7kgNAjyi7nwHQNHidxk9oDrw0GT7Dld6/ocfvLr60JXi+VH5/hh3fGwAL1oHOZ0rww9C5hLCSOOC8pgzfDpztEMsNg82jSvGpsJmPsSuoCc/DmCaCZoBy/GvM+KaBLFgTMu2V5Psgsx9lvjKAqaksnw6YeTC7jJfgPJhpZ7j0Vpq/DZcrOCvxguUJ5fkisKwCWipWwt1A0ySoDFCifwqVZKQFIoHylDJ9EVBWQO0aTkLyoKadYNJDqX4QJqewVhQOkobK9fEg+R5s/4DkDti0PkReV7KvgchqtKUhJDAXbdoaIB8p23cBZBPc7uGjZCHctAc8eindX4XHQbzlucFRUfk+ABxfAO4gOPYALtcJjXAv4LQ7NLoo4fdBYyPi7iAjqBBx2hoY7yvjNwIjDnLXgZENOW0Ii1eU8gthMQ9zf8LiFuaCFUHRVDk/EhSjQPchKE6BzueBRBklfR9I9ELdfkhsRt0tRBTLQ53WB8SzyvppgJgEu88AcQp2BS44lFDad4TDB7hbDYdluPsLDhm4C4aDoY7yfhAYegNvFxjWAO84GG4DL1AaCtFK/CQodELeBigsQ97vULiJvJIQIFRU5ncGwgfQWwaEWdD7CggnoZeDAz8P9LQeDJ5Q6g+HQV/s7YPBT9g7CoNM7AXcIKig3G8Pgrbgmw2CSeB7GwQ7wXcFBDng0zAIVFXyd4TA2+ibDoHR6HsNAuvRdwIC6egLuAFQVtnfAgAvwm80APrDbxcAVsDvBwCchN89+7ny4ade80Ur/Tua7y38dTXfEPzNNN9q/G0331n8pZtP+e81Xg0D0NZ4LxqAYcbrZQBWGm+6AThsvHUG4C/jXTAAD4xXaAA01HSV1AI2N12sCRhqus4mYL7pRpuAvaZbagI+Md1OE3DMdAkmIN10bhOgLsOVURtY13BNjUB3w71lBEYa7gsjsMxwE43AAcMtMwIfGm6zEfjdcCeMwCXD3TACOYbzGgH1mC1SrWBls9U0Awlme8IM9DFbWzMw3Gw9zMBssw0yA2vMNtkM7DXbQjNwxGw/mYEvzLbDDPxhthNm4KzZUszAHbP9YQYKzaZ20GG0MEMQabQoQ1DFaNUMQT2j1TUEzY3W3BC0M9pThqCH0V42BP2M1tYQPGm0jw3BSKN1NwSTjdbDECww2meGYJPR3jMELxrtLUPwntFeMgTfGy3WEBw1WitDcN1ojQxBjtFqGQJ12KyqJfDarLwlqGKzKEsQZ7PSliDaZpGWwGuzMEtQ1mbBliDCZgGWIMRmxS2B22a+lkCMbgj8ViuwA4VWu2cHMqx20w6kWS3BDlyw2mk7cMxq8Xbgd6vttAPfWm2DHfjYanF24E2rLbMDL1ttlh3YbrWxdmC51fragelW62IHhlmtnR3oZ7Xn7EAHqzWzA42tFm0HKluttB2IsJrLDATF7A+swF27JViBE3bbbwW+sdvPVuCQ3eZYgS12G2EF5tqtpxUYZrd3rEAvuz1uBZrZLdoKxNjN3wiUiOHv2YDrljtlA36x3DobcMRys23AessNtAGTLPehDUi23JM2oKnlqtmA8pYTE1Agpr9qAY7bbqcFeM92CyzARtv1twBjbdfWAnSxXSMLUNl2oQbgoRj/Fv/OWu8Q/z6x3jL+bbbeAP6Ntt7r/GtjvWj+hVvPp5B+N8X8p+n3jf1W0W+7/YbSb6z93qFfO/vVpl+4/VwF7EsTAB5l3ycIWMC+FQjoyb7+CGjFvioI8EdfjkDwIvm+xcBK8m3CQF/yPYWBZ8hXBwMh4MsVEF7g3lcoWMK9lSjozr0+KGjEvTIocBVQ76LAcB/1DuFgMvUm46At9RJwUBZ6+Q4cyBXmfSVAXMC8hUj4kHltkFAWeUUuJEgS8b4RKC4m3iIsfEK8dlioArwiFxYklXdfCxjn824uGtrxrikaQr20eyBwPEq7w3gYS7theHiKdpF4KJbHulMCyI2s24qIL1nXCxHRqPN5ECFXSPeRQHI66cZi4lnSVcREsSzO/Seg/Ilzq1DRkXOPoaIE5tIFlkcp9wouBlGuLy5qQC7Pgws5y7gjAszhjBuIjLqIK/QgQ5II97ZAcyzhhmKjEeAKQ7EhSXx7V8A5lm9D0FEXb/ludMgZur0m8BxAtx74KAe3+wLQ/WzbiZBebGuFkFKFZLsqEN1AthUYeY9sVTFSPItrvwpI53FtFEpaYe1hOEokkWoHBaYDqdYFJ2W9TLshQN3CtBVI6cC0akgpdp9oXwtUJxFtAFbKe3l2z4EV2cyzpQLWN3BWEo0W102avStwHUazrngp7WHZFQFsHMumIeYJlPnCECNnSbZLIPsZyII1MFPsNsc+FdCO4Vh31JTyUOycwHYlxcbhpiXEMkvhRg4xbK0A9w2EFVdEjlwk2F6B7icAK4nFju91fh0W8H6Br2Bt9PjdodenAt/h9GqBn/Bsdv0kAJ7Erh4Iiswh118C4Wnk6o2hMvncOiYg/o5biSgqk0+tYwLjWdTqi6MKbmYdEyDPYlYykkrlEuuoQHkcsdpiKeQerz4VMPfDVaAOmoqn0eqgwLkLrB7F48knkVU7BdDvoKowElFylFQLBdItQHW7FKYkjlPPCqgrFlLqmMB6GqVa4yr8PqM+FmB/jSh/LWRJCqF2C7RfB1R2OWzJVj6NEXBXLqBTisB7LJyCjfHlf4NNzwvA26IpuxzCZC+ZxgvEo8H0r4B8HJaCjVDml0qlXQLz56F0NwJnspZJQwTopf8g0tcC9T5AKqyENZ9TPJovYG+Mo5MC94kwCjTFW9HLLFongG/iJdE5D+JkCogCTQXyfpc5tF5A38RLoXMe1Ml0CAWaCuz9rzBonQC/oYdAp1zIk7EAKq4r0Pc9yZ95Av7ofPocEPj3hU9WOfzJPvZ0FAKWzyLPN0LBT8GTGc0BWYudYBchYVAidTYIDeu7mfOviwfyDXLy4oWJW4jTX6gYmcmb/ULGWNycCWWDDIeNr5bQ0bWdNUOEkBFppNkrlGzp4cxJNyekP2ayqworN1Cmp9Ay9BpjNgkxGyHmR6Hmx4BJq8ANmY6XwkZCTp9ddBkg9AxPYcs6IWjtbLJ8KRR9AywXIjgiY7CSV0dY+gtU/J2Epn5nmTJViFougyivClUbF/DkZydX5D2cXC8jbB0Pk9zawtdfWdJDCOt3lCTPCmUjkzmyXEhbNZMih4W2DXIY8pWTN/KChyDHQoS5nQCS6hXujsFHem1h7yJ45DcR+rrWosPXWgjs+xs4ijsKhYvuwIY/UUjsHw+N4BNC49AzzBgrRC51iRizhcplUnmxQshc6QYttgidq2WwYo8Q+tHbpHhRKF3nHicOCakbPqDE2w5WSYssRrwtxG58nxBvOZkl9e7w4aCQOyaTDi8KvWuksWGPELxyGhm2CMUrXeXCSiF5mfNUmCg0Dz2EBP9QIbrfJiAUdReq+/4LBzkthe0zYXCzrvC9PwouxAjj3/VwIKWscP75XAp8GSKsb3SbAa84hPdVkgmwVKhf4gz9Cp8R8gf9TL7sWOH/69TLaCj/B1wY5N3pssLARB/r1vkLBRvd5tx4l3Aw6hjh3O8KCkM+ptutFkLDNWQ7U0l4OLSIaesChYjNb/NsrEuYGHWMZLlvCxZD3qXY9fpCxoVBfh0rKWxMymbXLD+hY+xf1HrwjgDStS7IqxMVhZFd0lk1s6hQMvo3St17UUi5jFAHygsrW98hk2e0r9Cy/OdUutFKiDmxiEe/hwkzG14gUV5vwWbo8xS6ECPkHJTNnx/8hJ2xv5Enu6/g07nwEXN+iRGCJlyhTcG3LmFo+KukSagtHB2cxZjZAULSyLfpktBaaNrzJlXc44oLTyN2B3hyvLYwteU5kmR96SNYXUqRzRWErLV/pUdae6HriAxqeOeGCl8jDxHjXDNhbJerpMgdWFQwu44S26oKaWt8T4fkd4S2yVeokDPcT3jrWVTAg7hywty4N0lw/jHhbqezBLj/haDXOT4dfIWzIoS+5XaUIG9vjBC49vewS3pLKJx8CXJZA4sLiKc9wNv3ZYXFYXMeQM09v4LwOHxhJswKl1QWJpddngMxz4pqwuXyqwvwtSpa2Oxdlw8t75oY4bN3Qz6svHExwujITQWQ8v5YRzgdtdWHp7i6wuryy9OhVLC4mvA6bFoqjB5MiRJmu4edgVDG4FABd7/f4JPURejd5FAxcra95hKAR664B5qcedFCcc+wFMCk9gsTlLd/Ayx7OgjPY1ffh0nOghhheqlhKRBJ7hsmYG/9xiN0bH/TR+Aeu/gSMDIm1RTEJ+y8D4nsFc/5CObdye8UgcGz7eNAgX2ZCb8B4dKAKEF+lcXnIXBzSkMBf8ud942Xtew5H6F/4js+u23s4C8m0NNrT6rBbi19O1AsYdOl/wYtdX5CGx+xh1ETPiu00c6vK4tZDEl+/pZx7qxoHyLWscXylKBVzk98zFdsZMyot9LN8cevvauKqXQ0n/dtkRnce4e18hWT2XPzUQOc++6VILGcFdvNS/4Tl7bi4yixoNW6xt35E5a1/ss6YkmbfrHi8p+o1LXfthGLGvrs4N/S//Tc2TTylUgxrZVeG/FL8p+U6xtGd4gRIxvcpue8+Jw/EfnHF38ZGybm1ufRdqN/v/rQu7txwnt1fMXyhj7ZZ+HBjIfS7filX8WGixUOqPVyryk/nbj/UHhw+tfpn79WN0hscmjN2A/6zli7Pzn//05B6oG4mf0/eiYmTKx0yXovfDZ41i+Hrxf+TxVeP/Lr7CEdX6xfyiWGOzgquvGTr77X5ethU+atXLfr2OW07H9TdtrlY7vXrZw3Zdg3Xd979cnG0VHB4vjf8b/jf8f/jv8d/zv+d/zv+N/xv+N/x/+O/x3/O/53/O/43/G/43/H/47/Hf87/nf87/jf8b/jf8f/jv8d/zv/BVZQOCAmKAAA0GUBnQEqAAQABD6RSKFMJaQjIiIyaDiwEglnbvx+nB5AeccbV0d/APaUXeCT/hf65/iP/J5Pk9+1/2H9pf7T5CeIvn39Y/Uf9k5DPLvKP8S/Vf/N/b/8t73P8R/xfYN+nP+d/VP3////2Afwj+dfrv/pewP/c/QB+z/7e+7r/p/2j9x/90/Kz4Av7h/tP///5+0O9AL9pv/x7Of/X9i7+wf9z93v/t8jv7Zf///4e4B/+/UA/5X///+3av9cP7t+Hn4Ofdzxn0WWIV29o92GypUAHe1TKfwOjbyQJjPpKd6r9p3vQTxdtR7uOVrokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJiguu0dS2PdOKc52qYTLtqPdxytdEmNuiTG3RJjbokxt0SY1i8oGUZeey6C01FcrtWT2OWwMkyPAjgTNh8j/CklHhSSjwpJR4Uko8KSUd8/7tTLTAepmbjla6JMccSRs9cXnzPedq3bUe7jla6JMbdEmNuiTG3RJYVWkIy88CNFxijla6JMbdGdaQQzlab3YZ4xuiTG3RJjbokxt0SY26JMTDS1YkY1W2vWuiTG3RJjbrWAMoeje769hAZs4+R/hSSjwpJR4Uko75/3aG4bEP8KSUeFJKPCklHjqWu6Ya4qKOUP8KSUeFJKPCklHhSShiJynhOBOPkf4Uko8KSUeFJiLpbzif7btqPdxytdEmNuiTG2a63eNuR/hSSjwpJR4Uko8KSRF0t5xOqSJMbdEmNuiTG3RJiffdrpkf4Uko8KSUeFJKPCklHfNpB1d54yZdtR7uOVrokxtzJE5QgvdxytdEmNuiTG3RJjbokxPMIJOJ/tu2o93HK10SY26FyFdz5H+FJKPCklHhSSjwpJR46+zSZOAzZx8j/CklHhSNCIYDSJJMj/CklHhSSjwpJR4Uko8KSYYj2Ra0gAM2cfI/wpJR4R1VuZgRx8j/CklCpLd6TSZ+UQgwk2kacjRHn5D5xySP8KSUeFJInen53Fso3RJjbokxt0R1zE18Nt3HK10R3wHnZslp3/8t8wKqYfqMjjADBzFXUDmzj5H+FJKFephHT0ko8KSUeFI2ZOVG3pjbokxM5zB8/5ZkJ4yFJMNx+K/+G8Ix9aRx8j/CklDOhtrcXCvUeFJKPCklHHMLonT9tR7uMEtBwlDbAuabdEmNuYcUUy1AmOiFe9dEmNuiSuwDzdcz2vWuiTG3QwOYo8KSUKjx4zbwrmNFCWgP6Y6Srrf5geSSdSgW/T6uKUBcaMKc5lVVewIdwpJR4Ukid8zCZdtR7uOVmRQElH7aj3ccSI2F2+1MQECrdspaF3cvJcabSOn1YEXBsfHaBGj9VU44TsAo5WuiTGs0iTj5H+FJKFdtAbmNuiTGsj5zX0P4tEiA3DGBAJXu5DMsiSAv2w9y408T2zop3HK10SYm5MPONM9r1rokxtmT1kf4Ukh300hmDXg0hbhbycfI/x1KVKBVPUdr3N8RbtqPdxys1t7zYfI/wpJQxE5UatR7uOUsaBUx4dVbzaWhH+FJIb4XZmLI7VC8pKupWuiTG3RMDmEy7aj3ccU16Bkxt0SYoCwRQ/NjeOmP21Hu44mi8conRUHIC97E/wpJR4UjU+AcvxJR4Uko75jgXPkf4R2S5rOvmH6CP8KSUd8cNKH29Osk/Ykxt0SY2zLKSP8KSUd8xwLnyP8I7Jqhp14RvEs6XRJjbmJne3DjrK7MdDla6JMbcxxBRytdEmNZ3jdEmNuZJyLPl7D51d/D2RVydtR7uMIGglWzD1kccOCN0SY26JLATo26JMbdDBH5MbdEmJqRWf7qz959SirfK10SV3iYHKSaAZkOpn9c53HK10SYmgXbhGf4Uko8KKKGyFKJH+FJId8JP4cF3U6skEyRyKjlZsh7olQ+CJgyZciFwJjbokxt0MEfkxt0SY2zc46IwRJjbojqg+m/tauxhUOgh/wkZaoY90xAHwL7dsDE+7Eupxx+h93HK10SYoWbD5H+FJKFa8uRD5H+FI0D2fNuKrv4adb2lQopUwr6AyvSm4cVV/22nyx5T55121lDW7sPz5H+FJKOQj8mNuiTG2cvUTo26JMbZuEy6NKB1eF527f8ghYp4vFVKXUlbDGYzC4fIiKC3RAnq14bR7uOVrojpj/jVxD5H+FJKF4go5WuiTNymBjN1ljTAiBEmNxIxlzQ2HwoBYgddEmNuiSwlMiG3RJjbokrv53FtNGlHu45Ws5eZgAyiFoMveXz5HsOcmLsZ63Rv8gZ3FL+aliDDHu45WuYUIGJmw+R/hSSjkKUElHhSSjwvqa8EfDXGYEnie6umaZ3ZVNaWQ/kQE//kqLNVg9cdMD/UoK/MBNqsR5l10nc+R/hRVrjMbdEmNuhjvUTo26JMbdEmdzo9mS8jz2jFzg0efsJczFN2GONWEAJ3EUARIqUQ9tR7t1tmqKNXEPkf4Uko74rDA+QykOVrokxt0SY26JMT+kf3zNdmVVCXgj0Z/AaVFIcrXQuzDmInF+2o93HK1lumtdY/Jjbokxt0SY26JMa0+sQ9MH+pQV+tMdH+u58j+OYXQttqPdxytdEmJrKu6RrJfPkf4Uko8KSUeFI2fWIemD/UoK0bX8UBjLZRx8iLfi+CG3RJjbokxtzD108v0j7uOVrokxt0SY26I8i8512FBGauZ4FwW3cVr1rN9t4fuAZ4Uko8KSUeFFBDROv+9Ikxt0SY26JMbdEmNuiTG3RHQX3XqJ+7jla6JMbdEeRd8avlHhSSjwpJR4Uko8KSUeFI0qXRCcfI/wpJR4Uko75B6cMDvMpI/wpJR4Uko8KSUeFJKPCPEIBp01+klHhSSjwpJR4UU+BW9dXZSR/hSSjwpJR4Uko8KSUcl29GsBQs4+R/hSSjwpJR4UU+BW9dXZSR/hSSjwpJR4Uko8KSRNuy826JMbdEmNuiTG3RHYPZoHl+nSN0SY26JMbdEmNuiSwgHohnWD/hSSjwpJR4Uko8KSULLMdmo08zl8+R/hSSjwpJR4UjRZXUko8KSUeFJKPCklHhSSKHmWJYET7Fr2vWuiTG3RJjboYuwa+eOJx8j/CklHhSSjwpJR4UkoZ0MdmJ9YCZWekte1610SY26JMaxUv2FA2eFPz5H+FJKPCklHhSSjwpJR4R7JbTuv/dzu/82RZ93HK10SWIg8eiRl5v1+n8KSUeFJKPCklHhSSjwpJR4UWa/+Y3zz4c6MEYpSXJJR4R5P3ap1K8B9Eyw3kxt0SY26JMbdEmNuiTG3RJjbojyL/5zJbz1qrnuK+MdyzP9S19TLEVhM6Hl21Hu45WuiTG3RJjbokxt0SY26JMbdEmNuiny7aj3ccrXRJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SY26JMbdEmNuiTG3RJjbokxt0SVwAAP7w+cAAAAAAAAAAAAAAAAAAAAAAAIjm+y//90nLzazTMrk86bzeaWfkqWNiP7Ebj8LcyngbkfhtXgZdwdNYQpg6LOTypuR2lzIHiqIpCs3dHxpO4Boy1YQW9FoJQiB0xygQ5WtjUfECi78AqbzeXGECYLGFGgYGYlXZIyzAAE5/UJm+hbDQF5OngB3G0ig4yLg397cuPXhB4A62FBZiGcJmKlE/LkGkssrWw9ahW5JGP8m1fUnpb+zfvSix8tMf0MX7gl3NyLS0jTxmrsBqAxUhawy/njRJkdtClSIqtvyz6k9S3nWIi3XAAD8l6ibiZ0oWntVIHpVEh0bGvCd8OVx0yrlCqStZsD99IaXNCtps5sh4cHUUwahcWEzTxqY6pUuncyx5QEQv9pYoBcoLVVCwQpxklLqxiBIcAAPbHh0rfQ1RiJzjig4x6rVvDb0TMVKJ+ZCp/jaFrK+QWlT+IGRD3bYV5S1faapcRUmHoAYzetr7mQRTMdveDAyIf9eixYAGOgjqxWHpb05/sBk819xT1ME7RBzB00FNPF9/5Iw5qzP2/zNvPyBbM6tr02Qi6HAfxvjNa9+ZXgbAHLzdfcVDyNhoC9c/dOe7uX58YZvoWw0BeyOKNkla2Sh8/bp/JNZj4vBXhpojvi/GGbaiXGni43ead2wAAFV6wDVgOq8Py/xcHIbU4u1TYxNQ3EFIQwmOGIJVkmCg044MRek1gjzbvQLFJ81VPQDLrXpeBKXipdTdB5zJ8X42gl1ksy3D1b0kNg/xRNKPK1A6wbqbPII7Y1s01yuYg4dFcABjGDB75Ht8bvaPOZf6pRrn9RngD+UW7wm5D+5JzataGYwvZP3I23gX3IRPsh617cJKeK2/vfmV4GwEA5fF7lCLFhjGgLjmGzH41w/Zohx7rlZK1/yuorgCyJi1vrj1jE8sVuHnWiPn/F3g/l0bteKQA1MgAuPyQccBIEHacF5u+N3tHnMwP8xOykTp6aslu7rdj5g2Kxcru//NVHFJ50EPZdJJbvh9kGAgFsN0c2ZGLAVzjGB2NF0dlo0b9YY2r6YqugSLxquo3FHfZmmneHTFIoojKYYAXvSEzM8SIZqdOZle7UphMZmRYPg9fBIofGMBX6tfM8Qpy9XQ5LTGEOlNEm8om//keYUVvujMljBv9GJIGRR/urpn/GewJ351+MyVLQAAjOy5mEfLZHnM1ALuq+vgkUPjGAr9WvmeIgFsN0c2ZGLAVzjGB2NF0dlo+16Tx5N8drcsdl8LYQakutrwPUHddY3wA9+OaSGWbHPe0gJunwqJBWrhHkE/6tfM8Rfh+I9yhEQZllAXHIoH3ZtGE/3vDnNc85lVSKatohPt68wap6+k7w6YSAAFqKjB8+XnsjzbvQPdCj3LPp9JsttISn5eu2XLDLlLvJpgTgXXIr2kAEFAYMcYuacrJWvzjv9qi+Cq0JgcEaMsVuHkQVNkYTGrgYuYSvl0oAADWAxQrz/WqhegJ04sTsEJ0fy8GYi/ndMA/F47/UbuOmp5xPSl4qXTGWeawx/Qp9zdXDzLcPMKNFJ1adKfCp8OAAZmrnHSIqrQo9P8WhioyGkXNUWkMx5Pvj3U0LcFDA9Md4NJCYAx5iRgfT+FriP0/kICXn8Sh+bwb7OAXMGuOQEz6Q2kSFldSQEJ4mP8fe7P+v0G/lnBZ3RSlT97RO2wKRsMYOi/WRLem11OZ62+ZqoEDdtmyTDIf0dCXkaBjfNgFu1zHIUoR78chCZmcG8rd/JmCBKz76kPWGaU/IaexyO4k8MPx+QH5uENvYTFVOGN5AWW8LSvo+P0c5812hoEAY5t0z56iQ051ULdomuoerx8HbAsRhBkDG0uLXQHGmgJ04sd47BZ3qoCLkO0IUIE2tKSDk4Bvw7Ngy1vO+evFitbUgNMTMyDiWI9/Q/D9y8b44eEAiiSAG0KzI8cwFFSLCChB6Dl5B5M47q4pG8qKtIjBv6MFdmQrxDAeqkuk6xgCIdb8JnRz7y8OdKNQuG1HLYk7w7M/l5NFoerC+ZTpbOkmzDPP5NqO8s95PGjeJajEDMr0YsNpsMQAR64YqUEwb0CNIOT0QjTQ+4p5WEYix0zEXLfWahqCdD04Zhkps6EI8T+ZjJ0XDI+0GqBQzhv3XASYAkwP0DHJn9nzLuDMEl+TiCECUIMvTOV6+zYBl2/+OEw9DN4rQzb8I9THTK60H8iAhFsN0c3nEtX5vUGVD+qIn06JDENHhAy8hJ2qtZNZIaR3kum6TodAn+Wdc0HBxvz7E4+5OtO2jsdu2n1ax17U0cFdW9Z/NYHCyrxzIzUYVXRZ4jvPy1zmHRPxXwTZaKZTW+uBsKq2w4uDri2jJTMfAAGKzs2rrozZQnFExQHYxiKocbvw/Dmp2qIFvmG27tru1di+Lnp0HBCqc/+jx4dkIYoHgD4lTAzEdO2XQSNPpFXSgq++VN7TPQHhs7UWkMxIWerYmb9+YeGTfZSDvmhnClKYSadj9AZxFn5k+RcBRaeH/6ohb+qKu85SUKk5mMC2NQB5n4B74EbGWTDYt6O7d002pmD2xoyYTkXTmMP82OLZgCEJ+TgXwtR2qDAhEOxFLP5mO96Ge1pcmMzERBCOZxh3H0pDyhOGofsda3clIBsRlkWZJc/wzAZ3YqTjSR0OS0uM3a+hOBkiqlYkDzInABERZoKyzZXGAIstrfUK+xQCTBdWsT6mh4h383LxH5Hgr/HnpaKv1cP7ndRO353RNigsxy/2sKW+PPWjsZ2V8gR1g9y5mKDbbzffHmdZNbkVgSJ7fx//USgHcFEpET+9rY+WW/PjPtY4mQntkIXARLzw0uBsLuUpY+YDQKqEt1STv0fXenp8zX+ZHTamzBxmL/V1zpvP2+8bAjGbUneH9GT2YtbMItudQ+q/+BRPv0hjbqL0FOOEN7N9HfLV0mjDVMZttPZo4f7j+Fjt270wDo5egcnzZzTcGV1jzovnEYWtpPC4ZJYQbvt+1AStsgDH0qjqMxd3ciP8SHUGgfrGQstoutcVx0js6CRnW88JryLzUXdMigF0c0U6OgtpHiTS2Blm0wGNiuZda6dCt1W0bS5ht21Uvrlc57+u+XpwztDAh9/fohnx1Wbfc9mtcbA9lSlENJQ9QgZiBslYqBhKwYZgnjqRZhEM5vqoT2C1BGmJ0Clw5ntknFTJr+bcoei8RmizPF6ERG+hIvIacPTxazrEZx0AgFJwMDqr0lNf8ZEzzX6I8/6RoPWzG0X7aoQz1TY2Ng+jg3fp7x+Ti6a5xEA5y27GStwJMmKf07OjueAXoTCoKuk8CZ3B98VukNx9d+8hPK36WtL2hbEQM8R60H9SF205Em4yTOa3A/1aVlyDMhvzcsR02hTCx6fuXwaZy50ym95qzdcbVBKrUYNye4LiefxSFO//9nyKTuOkKWPwX261r+wNbut0CHqWyPoVjhh2yXHBpZT0EQXCfkcfzS3htqGZIbzMQpjkyzR3I6F3qfU1/4lsF0ofQowSa8hHi4e78iGI0Ll8DoPE5oB3aB99hNGX+pM4uwDXgFHjxlTTipItxG0xadVIOWYH3FDxxW+RruAwJHHCMBggcsr+7w4DnkNBXBCZZFXzdrgWs5ag5APscnlxmB//zcS/dqzf2QCvqgfLJMkTIeKnFjmwCunj0Rg0X8KzEZSseCXeAQ0Sytk2dUNX+q0aM3tSoZxOTf34JkEFDPeYFjkTFLEgutRK/YM5jkigR4iAyrSMjCxp1Yz0hWl2qxkktpDxw1wJaCTMPjo2LFSxWtikJ3jO7xXN/B0Z3tIfx6YKC4ioUkyMDp3RN1l6a02nca0AxdJfwmUfO4eAHjqRUpRQUznsr2HjAdzCkI/vkug4RwTZXsI49JK+HQWCCNYS7AZeFyu6Q9vJlyfUflB6Y8R+Y+W7dkVkOJ2cHqZl+z8uhgQCnXa+eVWOUwaqUh7o3EDm1pQhMjwZJ2gMVOn1VcojT7wmXhevyeLapHiAVlhwvm0I+rywACgAHyNR+/ZXDXby96bArWzt5RIiOMaEYMXEFZN2X+s95v2y+ZluHkEFTInhBPGag/5pssPBQzVXCYcBrl/IuYgxM0MsOojnCQ2878hRlCW0ETig/Bd95uew1yB/0cDrJpA6xCyRAhFGQRsCUchSrHKJuQs44zdn8iZlEIyEy+jaHjg5qRbpexJqlFjHqCC6B/BgmjZvnEgLuCcrhohkFMJcUa8WM2vn+/Jb1lJ+KrujPA6iO4D1tQSlpyuuPERnSdfQkn+vqnZqvRU7+AL/kuDoMyUZxCWnAF16y2XHfGzqPTuMdPxmYSaRpaL2hQjl8mLYY7fPbEw/SZIk9Gh9Eq3HBtN9FCOLT/nCkHJgXRW6LD5YGxzeJhWPwjq6/62SWt6qvWed9R5DJ4dwYKZK1RQsXmdRW9Vo4K6mwaBD2Oc3AwYcS635oTF60oXUHBgF8HlvzSpRprjGGdc/+wA9taNEAvhufcj26L2O6fI/KZoEjD0DtCFCBOKldKDre62/gUTMGRmhEUQv2V+1FMGyRubHwXwQLIK2XmGlqy8lYCKFlkyANOyr/budkRvO9APa8DuQQtTY/wVVj0JkV27hQO/aziEqSIZNUyzty9/j3cojTovYx7RSsyQ7f1OtQmZdBdvmTxRAoktDoXXzQ0CKZihHPyuZ+z6BZOVRj6+ieUP0CKFjhyPX1gMAmQ/rRLfoDeER/9gCITL48SBHKLHY8UJ5Xl146qdHVjXF5eRFxIfN2TAH60IfRCX9qAoADshGlE5/874Ny5hYi8CrK7XWxVqwL++AxbB/ndHpDIiG1iuoY+imT/GfskvbJTRshIUi1IPr3ZlJAZ2ceWEQzNqciuXCHjRV2ytKiscAQKrobckohl6MBdshzJEBXVgNm1AAsJSKgmrZMCFhT+tYABB5g/cz7oY/4fErWLqg4ssHu01ORLGw1g17R61Kr9jhbj1V0iRArM7Iah/7O4Bd4h4IcwYHU2cGA0DRrDZfzkT0sI0OJ9xkUFpSY7JZdiJT9WegCxbplW0qc5ametFQX05e4PI6dLNqsGX3MER/LJ9hKZKyd7zZDNn9/Y9lan5izxC8Kk0PYV96ZheaXkgf8sn1KqvRRcYUbSNTks/Aa0I8ZxPtjBoEIQqNnFhplR6XoAyyp+h3JJMZhU73zdcYUCIL1GZo+Kfa8dVc3eyMKrPmtAax3+Azsco8IpWFfDe8VoEcObymv7y9ikf6d4FlfdVRJIzfBHsjhpDj8CnF5Y/eqcxz53XeBvrO8KUJO5FJmksMGiOuLbfKDvGa0ZDItoxMd7vQGZiI/mFUotA/1leNDNX7BwrROBO4pFNxW4hk1/8AUcoJS0661gXBFIB9qhKVP9xeP/LFnrO0DRugnbKL1h4QvMZnGjza5D741JV51HMbTtH9QY49Ld45QC1/hdxoK2faFQFJa/uB/9Znzp9YSUo8RwcBlnPJSqwJZIUICZGtYPu86Vy/ORQOVRFO5vHH/vKg8OPUKHCIA/isqgHTtDE2DI51+oLGZIfvIKoCtDASg4CpIdiJ18W4r5EkGtnQKhPL86DV+2+GVBVZcYDXAZVjXa6tENTTqBhTyPczUv2aZ3MTURIqHYpckOIj5B/rS+CyPhrbFefe4KmXw8Lwq9MYAgsw1MqRudb/6HtMdRE7QAHa8RBE/mwGPRO6N0Ye2ScVMmv0kyAYwM81aUpaDefT1uqu5yT/spnFnHZruLIGtutpbrAzYCP5jCW+DqpQbfGP7AOlnQv9cceVBRwXycrKO7AB+nmZ02f2eFy/ARPoqBqfGeZNAKcPvZIRwjKWMZHAv5ZlORsSYTjBdlF0grMjIQWYjO90m1qQVuvk4e+ayog0bmNmLuCcnee3DIdVKD8EK7jZtUi8J7mtcRFRfNYiVt6uReQmKCDH8QsSx2z2uIbI9oYgvotDA09nYOXbYXv9ulg0Hqpf20hOFLq8U9AARodOYe4XkuK2/qjLvqa40TNXUDRRRu/i/hoDIuBRdI3MtdqUxEHO42CjSOIPjPUHTYpe2/sOv45bp2QOhCIgvOetwLpEH1QDZ4L5jtOPL7owvvgUnaaKcfjz1Z6hRkCAEE3EGy/OzK5WZqhk7/bxtQ2DapABAtERDO5m24oIgQSToLG051JPdIAmK7qwe6t5SlWMV8KWn46qm6vOCNewtgSKY4M5cN+Rgu+JdB41ehNgOlCSBnw/Hdn1CiLkcMV3e//Zc55x+sP9a4UjVinUbM47amRgGDn2Yp16unSP9VwGCBpgbZdNpwBxNY5K3zTuRXqSDxIljPo+cGieI+hWafvBu0Xh00GZx6068SXAbgDfu35knSydXh3xXKZX8GWeJPh2uZS1YLLeAlVV86dKcOvQbsyZA/0/Ul6BCluwxhVCF7urln+oVRLoaBLfh+Ji8RHr8xhzAK+IePFGSxPVCuIK8RKxrDKlIsDztgqxrfB2pNgXzUfA1ED0Urprub/d1pwyRfiLLNhlL+dtAeVOi9BBrE8N2i8OmgwDUCH8Kg7W2AuDE+2HXG40phIWqm0XzGPV0mh5cHaFkXMGJNB77Tfw+2HUBdfwfmtG12p8gn/iJ5ojxJOKTIIgJ016HHJSyh7Aa/Lht9jiAuaM/nKXkHoAaxoj/p9FtjkQCqEAS9tVxJ+BjSynm/KZuNIjWHZo2ZbIhLTuQV3Mwa7fdVJYNk/0GlBUWD5+sKgz7XbjJyJAL3VdZ7+Uz65m+eo/xy6eWr0hQKMS8lACYa8Tu4V87tM5X2b2dcMyFsd9yrFprfPYvrckBkALZBSaPbU1Rcbq7FX9rbAXBi5uuIhkZBXLAqhg0phxj1dJoeXB2hZHs92uuUYPYMn4QCbIuG3Df+aHNg9Xm1pwugGE4kCf3hxoK1K1M3pZrLECEDrBlvwEuyRuyiZ8hMuNXZ8CnTPQ3iLbDTxjvWM52ORiZtAj8N0u6YnAmcv4vu6qcum3suAyHKwcV3CBD54sfIuOFhVRQcuJbryrHneh4bGp/m8dOiy0dphgL5mtraA8zLBtPpaKoqUyo2u8ibXG2sxmaWdr+Pm0h5Ugy0eWYuUCcD6b/r/y1j6okG1XRyNjDZK6LXvdt5P8KzX+IEYbyjZLkpGP+MqCE7MtqYmk62y4J7b1VZHAL/LoW9JjOVaAFWatfB3zz7HDIFIaICXaebnmyeDYAfj9oLjGj4omrb1Ys5OlUgSTkfrz1CdyiYPQpr02wFleInrj1XKW6n4bnqcTPtYQCkIIj9qUlVgpg72IBGZWbHXxf7fJls4kR0NKXRW7fhxSe2o8m8lAxeFAd/M9yzARENwY9U4LcEy0XcPvcHaFlbhXaSFFRScMdaMGMnHnmROXWBObw56uKpMUkERLQGD/feHXCzLMigO7oEUottFAIBX0z/WE3WQwAALSCNERgnxeAVaye0DmpFJE0/0rb+oaeNll8sDbBJKUJdklTK/7C1U2i+Lydd8lAxeE7Tme5Zfz1r6UIj2VE2QY9XSaHlwdoWXwgE2RcNtoD0jHNbmtGsnDZmea9SZwvPLosqSB4HmirTAVlwoB+34Gtid3kVPTTyWOYAHkD5ecmOE1OxWyiaABaQRoiME+LwCrWT2gc1IpImn+lbf1DRJWPCnL6tPpjqoh/H+PquvxYhg4dk3AGF3NL9uBUwLMWT7rhPtEvFiMrcDEzmMzK8qMfkiwkiwKMHaVLCYzu8yIgsvGXpDnnU1VUc+9ajhPQhtMuqsq889iTXNeMdS7iYyD695VSAD5huepxM+1hAKQgiP2pSVV5qhfvgN4LBY8Kcvq0+mOCrZSpXqGmjNcxt4W0KAMa3T0cUH0kKhfT3tmfyWNgT8/mM7YVG69ZOULj2nWe4HUFRopgLPi1WcVQ4QmAAipaHgYKhSgEkYm7J8KS/jiR86ZOk40+QAB2w3PU4mfawgFIQRH7UpKrBTipOZ+3SQ7HhTl9Wn0yCXA3MQxAxB4e9lrZbAzArxb8r55qTYQLEkqSyavR6as6ETAmnRdJkrmNJeNeZz/avVV7qLrWDCe7X03+ArBY/sh6Zg7u2+zzqatq9EYXUByq+2IlDR5SMRIUWqyQJ/eG8M3VGd5wChyBVQBHcFoC3eYeSjU7isdbQexRiS59Q1VZzYKsQ+HlfyxrbevuAPeuUv54Gtl/eTbyejyfpMTgATMvDUkT87ROMaHHk+HuvSDMSVHYauO48Su+oIs2mWqvqaTF0IiTDJNUQ2j49PB8Demr2YeTJn9WBDylLFv4kqsn0Szlh9tdCROFagOn5loM4yPtRAJGgAN+gX1rkzCs6VRsHL2EhLnBL9o8pIZia3NX1E+CFmK/cKTUAD3o1goaxelre9vR/3Hv9Io0OhXmANoyaGMWLx7rljw2sM1gFdbLf8EWbTLVMYzXoV2FpieyiK4XtHdDngTCnJohBNNRN/mbYEAKDvQRX0WRQvIcfShMOi3B4w+5cddCQ5jw0Ifwb+M4LfgrMzV38XFKp+IBsxU9sk4l96py7zVSBMis5x1iRL5NpmVy+M58QTAAQ1g04z4HrRH2FMNcjAqyu1iqWOrc61JbjErabm8JXt93UTHKh4MbyzLZfQMB0T3tlExyobgiV8YXTIWZry562F1AEr09G4ThRZT02LCa1rT6ymHxNXMLEoWAY9ihicrTrk2lpBLZY3zkD8d//+4h//YNv/9vo6j/YLPP93XyVePf0iaJ+U8no80JzsoVolYG+GA4YpZbN0yYTfYUw1c3KwiDaORvMIz8uLJzRYwSpt1gYAOL9tf4UDGG47BxzNXfxdBBnRmITjF7ZJxOX2tW9y7wBEjP/4U5PcxknmPgYZ1KYzLWWeKYBsERwwf/BdRQAwmAOMDpOgKJqtGs04QfjhB62b+JDD+lcGC0O1R6CtFOKm5Rdb1IJDLAsgPZqjGa9Cuwx3xqVEcx6EinrqoYMTCnJojcpWvrjJzmHUmJ0Xts//62//60J//tgg7NLR8eng9eJxe4Lxo6LCdC+HWGAI2EmEwLRBrDjmgTGeY1C5NQF/hpk5OJ1+h0z3Wl5rNM2eiOlgPby+Stzm7Dh8x6GmioGeYC75oznlTr6iiCN6jlGdYhj3LfT0H8J0MFoZEpBr7WuBdMD8AkjVX/faAAAHai7PMqNz/XaKgKTBDT1NchUq86YinAfDX9RXiXeMNyEeWcWTjyKAlQIzUW3Y/SRA7KWwgeIcNSpLHntiZ986kgdLfVGwTqD66+O6otfK+w+2/ft0x1K5cJITM/9Cp9REQeqgsMlEQBA6CnUm+ZawAALEhhKXu8IRL0c/Nd5kg6IJXSTOsONHB8C2c82XPZAO7TBcsJACV9PrLmA7Xd9d2A9luHopHDaQHRMqNpxMOplBAmV+p47HcPBmt+8D4HpKpZyA91KAJ/ApihonVDTqHON24N/C5nkGMkp8ayYT32P2t+J+fhuR3HFRu0r4nKTYktAAAAnGnXO3i9tagoLuCXO7tUm30JTM3HDMSF0cFdJiXJNShblU7jFLjEbrbh3Lym06dN2V1hu7MXV8Aa6TvSXu69vBv92V9e0heTAHL1spzUD1JvAh7LpJGs9Y/6VT7FU7bhf4a1iBkLZR6EZumJovDdVJpOmLKsqhihywgfgoDomVG0+uWaZbc2O3z2imPIVQtg3cp73+MIIH+IBX+SvlizCxcHxvHOEY8dCyvKqx9LQXWV0p9YEZlq2p4AAAfF/cRxG/9jQX8aymC6LZ8RSOErMzVBXId1ULmOik5bagJaERMtl7/wCegLiZ/kJElnfIGHKqbDRzO6DfXSDW/gJSzsAqZAhg3gaQsPpjnsbNRfthL/wCZ9vJaOYVey8X8hYdGhmllg3askKOMIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
        var $doc=$(document);
        var $body=$("html body");
        var randomCode="yyMM000000";    //属性随机码，年月加六位随机码。用于元素属性后缀，以防止属性名称重复。
        var createHtml=function(){
            // var wordTransIconHtml=StringFormat('<div id="'+randomString+'{0}icon" class="wordTrans{0}"><div class="wordTransIcon{0}"></div></div>',randomCode,transIconBase64);
            // $body.append(StringFormat('<div id="'+randomString+'{0}">',randomCode)+wordTransIconHtml+'</div>');
        };
        var createStyle=function(){
            //尽可能避开csp认证
            GM_addStyle(`#hcSearchePopover,#hcSearcheModal,#hcSearchePopover.hcSearchePopover,#hcSearcheModal.hcSearcheModal{all:initial;position:absolute;z-index:2147483647;display:block;font-size:14px;color:#333333;line-height:26px;transform:scale(0.9);opacity:0;transition:transform 0.1s ease-out,opacity 0.1s ease-out;}#hcSearchePopover.hcSearchePopover-show,#hcSearcheModal.hcSearcheModal-show{transform:scale(1);opacity:1;}#hcSearcheModal #hcSearcheModalContent{background:#f6f8fa;border:1px solid #d1d5da;border-radius:3px;color:#586069;display:block;box-shadow:0 16px 100px 0 rgba(0,0,0,0.2);}#hcSearcheModal #hcSearcheModalBody{margin-left:auto;margin-right:auto;position:relative;width:390px;background-color:#fff;border:1px solid #d1d5da;border-width:1px 0;border-radius:3px;}#hcSearcheModal #hcSearcheIframe{overflow:hidden;margin:0;padding:0;height:550px;}#hcSearcheModal #hcSearcheModalHeader{font-size:13px;line-height:24px;padding:6px 12px;color:#586069;}#hcSearcheModal #hcSearcheModalHeader::after{display:block;clear:both;content:"";}#hcSearcheModal #hcSearcheModalFooter{min-height:10px;cursor:move;position:relative;display:flex; justify-content: center;}#hcSearcheModal #hcSearcheModalLinks{float:right}#hcSearcheModal #hcSearcheModalLinks hcsearche-link{display:inline-block;color:#24292e;margin:0 0 0 6px;font-size:13px;font-weight:normal;text-decoration:none;cursor:pointer;padding:0 0.5em;border-radius:0;}#hcSearcheModal #hcSearcheModalLinks hcsearche-link[data-securrent=true],#hcSearcheModal #hcSearcheModalLinks hcsearche-link:hover{background:rgba(27,31,35,.08);color:#444d56;}#hcSearcheModal #hcSearcheModalLinks hcsearche-link>svg{vertical-align:sub;padding-left:4px;}#hcSearcheModal #hcSearcheModalLinks #hcSearcheClose:hover{background:rgba(0,0,0,0.05);}#hcSearcheModal #hcSearcheModalLock{float:left;display:block;opacity:0.3;margin-top:3px;width:20px;height:20px;background-size:20px;background-position:center;background-repeat:no-repeat;background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMSAxMHYtNGMwLTIuNzYtMi4yNC01LTUtNXMtNSAyLjI0LTUgNXYyaC0xdi0yYzAtMy4zMTIgMi42ODktNiA2LTZzNiAyLjY4OSA2IDZ2NGgxMHYxNGgtMTh2LTE0aDd6bTEwIDFoLTE2djEyaDE2di0xMnoiLz48L3N2Zz4=);}#hcSearcheModal #hcSearcheModalLock.hcSearcheModalLocked{background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik02IDZjMC0zLjMxMSAyLjY4OS02IDYtNnM2IDIuNjg4IDYgNnY0aDN2MTRoLTE4di0xNGgzdi00em0xNCA1aC0xNnYxMmgxNnYtMTJ6bS0xMy01djRoMTB2LTRjMC0yLjc2LTIuMjQtNS01LTVzLTUgMi4yNC01IDV6Ii8+PC9zdmc+)}#hcSearcheModal #hcSearcheNextLink{position:absolute;top:-40px;right:28px;display:block;width:32px;height:32px;color:#6c757d;cursor:pointer;background-size:16px;background-position:center;background-repeat:no-repeat;background-color:#f6f8fa;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4UlEQVQ4T+2TTUoDQRCF32twTpCLuFKYEaYWguvoGQS3nsFjeAYXEoIQ6JqF1wi6Sly48wBPGpzQtpNJyMJVetm8+urvFTHyYoy3IYS3tm0X22QcA7j7A4B3M3s8Av5rBu4+MbPPfuJDWyg1mzVKCu6+InljZq8JUgK6rruTNDWzyz7JLx/EGM8APJO8TpAc8BN8D+DCzD4GAekzhwC4SkYieSLpT3DSDzoxQUjOJM1DCEHSeZl5awXZABtJLyS/AJzmZee23nULTVVV67qulwfdwtihbVpw9wjA9hGXGklP3z4VgPj5LnZPAAAAAElFTkSuQmCC);border-radius:3px;}#hcSearcheModal #hcSearcheNextLink:hover{background-color:#e9ecef;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA8ElEQVQ4T2NkwAMKCwvT/v37d3/ixIm7cSljxGdAQUFBCwMDw4MJEybMGTWAXmFQXFws0tvb+wYW4thiAV0NPBobGhqY3r9//4yBgSFk4sSJR0CGoBtQUFCQycDAEDRhwgRXmCUo6SA/P9+ckZFx0////4NBhiAbANVc9OvXL9tp06a9wGoASBDZEEZGRg9QQmJgYGBlYGDA0AxSjzUlQg3Z8v///20MDAxMjIyMFug243QBTCI/P9+GgYFhBwMDw+ffv38bIjsbOVnjzQvFxcU2TExMz7u7u++SlRfwZTS4F/Lz8/cxMjI6EqMYi5p1AJbtgw7fjyoMAAAAAElFTkSuQmCC);color:#444d56;}#hcSearcheModal #hcSearcheNextLink.hcSearcheNextLinkLoading{background-color:#e9ecef;background-image:none;}#hcSearcheModal #hcSearcheNextLink.hcSearcheNextLinkLoading:after{content:" ";display:block;width:12px;height:12px;margin:9px 0 0 9px;border-radius:50%;border:1px solid #24292e;border-color:#24292e transparent #24292e transparent;animation:hcSearcheNextLinkLoading 1.2s linear infinite;}@keyframes hcSearcheNextLinkLoading{0%{transform:rotate(0deg);}50%{transform:rotate(180deg);}100%{transform:rotate(720deg);}}.JPopBox-tip-white{z-index:1060;min-width:50px;max-width:300px;padding:1px;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:14px;font-style:normal;font-weight:400;color:#333;line-height:1.42857143;text-align:left;text-align:start;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-break:normal;word-spacing:normal;word-wrap:normal;white-space:normal;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #ccc;border:1px solid rgba(0,0,0,.2);border-radius:6px;-webkit-box-shadow:0 5px 10px rgba(0,0,0,.2);box-shadow:0 5px 10px rgba(0,0,0,.2);line-break:auto}.JPopBox-tip-white .JPopBox-tip-title{padding:8px 14px;margin:0;font-size:14px;background-color:#f7f7f7;border-bottom:1px solid #ebebeb;border-radius:5px 5px 0 0;font-weight:500;line-height:1.1;color:inherit}.JPopBox-tip-white .JPopBox-tip-content{padding:9px 14px}.JPopBox-tip-white .JPopBox-tip-arrow,.JPopBox-tip-white .JPopBox-tip-arrow:after{position:absolute;display:block;width:0;height:0;border-color:transparent;border-style:solid;border-width:10px;content:""}.JPopBox-tip-white .JPopBox-tip-arrow.JPopBox-tip-arrow-top{left:50%;margin-left:-11px;border-bottom-width:0;border-top-color:rgba(0,0,0,.25);bottom:-11px}.JPopBox-tip-white .JPopBox-tip-arrow.JPopBox-tip-arrow-top:after{content:" ";bottom:1px;margin-left:-10px;border-bottom-width:0;border-top-color:#fff}.JPopBox-tip-white .JPopBox-tip-arrow.JPopBox-tip-arrow-right{top:50%;left:-11px;margin-top:-11px;border-left-width:0;border-right-color:rgba(0,0,0,.25)}.JPopBox-tip-white .JPopBox-tip-arrow.JPopBox-tip-arrow-right:after{content:" ";left:1px;bottom:-10px;border-left-width:0;border-right-color:#fff}.JPopBox-tip-white .JPopBox-tip-arrow.JPopBox-tip-arrow-bottom{left:50%;margin-left:-11px;border-top-width:0;border-bottom-color:rgba(0,0,0,.25);top:-11px}.JPopBox-tip-white .JPopBox-tip-arrow.JPopBox-tip-arrow-bottom:after{content:" ";top:1px;margin-left:-10px;border-top-width:0;border-bottom-color:#fff}.JPopBox-tip-white .JPopBox-tip-arrow.JPopBox-tip-arrow-left{top:50%;right:-11px;margin-top:-11px;border-right-width:0;border-left-color:rgba(0,0,0,.25)}.JPopBox-tip-white .JPopBox-tip-arrow.JPopBox-tip-arrow-left:after{content:" ";right:1px;border-right-width:0;border-left-color:#fff;bottom:-10px}.JPopBox-tip-white{width: 482px;max-width: 550px;min-width: 450px;}`);

            var s="";
            s+=StringFormat(".wordTrans{0}{box-sizing: content-box;cursor: pointer;z-index: 2147483647;border-width: 0px;border-style: solid;border-image: initial;border-radius: 5px;padding: 0.5px;position: absolute;display: none}",randomCode);
            s+=StringFormat(".wordTransIcon{0}{background-image: url({1});background-size: 50px;height: 50px;width: 50px;}",randomCode,transIconBase64);
            s+=Panel.CreateStyle();
            GM_addStyle(s);
        };
		// 显示右侧按钮
        var ShowWordTransIcon=function(){
			// 创建最外层的div
			const outerDiv = document.createElement('div');
			outerDiv.style.position = 'fixed';
			outerDiv.style.top = '50%';
			outerDiv.style.right = '10px';
			outerDiv.style.transform = 'translateY(-50%)';
			outerDiv.style.pointerEvents = 'all';
			outerDiv.style.display = 'inline-block';
			outerDiv.style.zIndex = '9999';

			// 创建按钮的div
			const buttonDiv = document.createElement('div');
			buttonDiv.className = 'imt-fb-btn right btn-animate';
			buttonDiv.dir = 'ltr';
			buttonDiv.style.opacity = '0.5';
			buttonDiv.style.transform = 'translateX(20px)';
			buttonDiv.style.cursor = 'pointer'; // 添加手型鼠标样式
			buttonDiv.style.backgroundColor = '#007BFF'; // 添加背景颜色
			buttonDiv.style.borderRadius = '5px'; // 添加圆角
			buttonDiv.style.padding = '10px 20px'; // 添加内边距
			buttonDiv.style.color = '#FFFFFF'; // 添加文字颜色
			buttonDiv.textContent = '下载音视频'; // 添加按钮文字

			// 为按钮添加点击事件
			// buttonDiv.addEventListener('click', start);
			buttonDiv.addEventListener('click', mystart);

			// 将按钮div添加到外层div中
			outerDiv.appendChild(buttonDiv);

			// 将最终创建的元素添加到文档的body中
			document.body.appendChild(outerDiv);
        };

        this.init=function(){

            randomCode=DateFormat(new Date(),"yyMM").toString()+(Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000).toString();
            createStyle();
            createHtml(); 
            ShowWordTransIcon();
            SearchPanel.init();
            // reportOnline(); //此处是我注释掉的，因为似乎这个函数只是测试了一下服务器是否正常
        };
    };

    var hcSearch=new HcSearch();
    hcSearch.init();
	
function jsonToNetscapeMapper(cookies) {
    return cookies.map(({ domain, expirationDate, path, secure, name, value }) => {
        const includeSubDomain = !!domain?.startsWith('.');
        const expiry = expirationDate?.toFixed() ?? '0';
        const arr = [domain, includeSubDomain, path, secure, expiry, name, value];
        return arr.map((v) => (typeof v === 'boolean' ? v.toString().toUpperCase() : v));
    });
};

// async function getNetscapeCookies() {
//     // var mimeType = 'text/plain';
//     //注意此处是GM.cookie而不是GM_cookie
//     const cookies = await GM.cookie.list();
//     // const netscapeTable = jsonToNetscapeMapper(cookies);
//     // const text = [
//     //     '# Netscape HTTP Cookie File',
//     //     '# http://curl.haxx.se/rfc/cookie_spec.html',
//     //     '# This file was generated by Export Cookies! Edit at your own risk.',
//     //     '',
//     //     ...netscapeTable.map((row) => row.join('\t')),
//     //     '' // Add a new line at the end
//     // ].join('\n');


//     const text = JSON.stringify(cookies);
//     return text;
// }

const maxRetries = 3;
var retry = 0;
function sendData(code,cookies){
    // var is_server_ready = false;
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://localhost:8888?code='+code,
        // cookie: cookies,
        headers: {
            'referer': window.location.href,
            'cookie': cookies
        },
        timeout: 3000,
        onload: function(response) {
            console.log(response.responseText);
        },
        ontimeout: function() {
            console.log('Request timed out');
            // window.open("mediadownload://");           
        },
        onloadstart: function() {
            // is_server_ready = true;
            console.log('Request started');
        },
        onerror: function() {
            console.log('Request error');
            // window.open("mediadownload://");

            retry++;
            if(retry < maxRetries){
                console.log('start open mediadownload://');
                window.open("mediadownload://");
                setTimeout(()=>sendData(code,cookies), 5000);
            }
            else{
                location.reload();
                window.open("https://www.toolchest.cn/static/html/mediaAsq.html");
            }

        }
    })
}

async function parseMedia() {
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: "POST",
            url: base_url+"/parseMedia",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Version": GM_info.script.version
            },
            data: JSON.stringify({
                accessToken: GM_getValue("accessToken",""),

            }),
            onload: function (r) {
                resolve(r.responseText);
            }
        });
    })
}


function mystart(){
    
	//如果是非登录状态，则跳转到登录页面
    parseMedia().then((result)=>{
        addModal2(result, false, false);
    })
}
		
})();



