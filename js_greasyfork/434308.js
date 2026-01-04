// ==UserScript==
// @name        TI_Tracking_InsightFreight_Script
// @namespace   TI_Tracking_InsightFreight
// @include     https://www.insightfreight.com/*
// @exclude     https://www.baidu.com/*
// @require     http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant       BPTS.com
// @version     1195
// @author      Paul
// @description TI Tracking IF
// @downloadURL https://update.greasyfork.org/scripts/434308/TI_Tracking_InsightFreight_Script.user.js
// @updateURL https://update.greasyfork.org/scripts/434308/TI_Tracking_InsightFreight_Script.meta.js
// ==/UserScript==
// 10/27/2021 Paul.  Collapsible sub-panels need cookie access. 

function setCookie(name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toGMTString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}
function getCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    setCookie(name, '', -1);
}

function html_encode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/&/g, ">");
    s = s.replace(/</g, "<");
    s = s.replace(/>/g, ">");
    s = s.replace(/ /g, " ");
    s = s.replace(/\'/g, "'");
    s = s.replace(/\"/g, '"');
    s = s.replace(/\n/g, "<br>");
    return s;
}
//解码
function html_decode(str) {
    var s = "";
    if (str.length == 0) return "";
    s = str.replace(/>/g, "&");
    s = s.replace(/</g, "<");
    s = s.replace(/>/g, ">");
    s = s.replace(/ /g, " ");
    s = s.replace(/'/g, "\'");
    s = s.replace(/"/g, "\"");
    s = s.replace(/<br>/g, "\n");
    return s;
}
function parseXML(xmlStr) {
    if (typeof ($.browser) == "undefined") {
        if (!!navigator.userAgent.match(/Trident\/7\./)) {// IE11
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlStr);
        } else {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(xmlStr, "text/xml");
        }
    } else {
        if ($.browser.msie) {// IE
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlStr);
        } else {// Other
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString(xmlStr, "text/xml");
        }
    }
    return xmlDoc;
}
/*
 * Poshy Tip jQuery plugin v1.2
 */
function fnOperateTip(obj, message) {
    obj.poshytip({
        content: message,
        showOn: 'none',
        alignTo: 'target',
        alignX: 'right',
        alignY: 'center',
        offsetX: 0,
        offsetY: 0,
        showTimeout: 100,
        timeOnScreen: 5000
    });
    obj.poshytip('update', message);
    obj.poshytip('show');
}
function fnStaticTip(obj, message) {
    obj.poshytip({
        content: message,
        showOn: 'none',
        alignTo: 'target',
        alignX: 'center',
        alignY: 'bottom',
        offsetX: 0,
        offsetY: 10,
        showTimeout: 100,
        timeOnScreen: 1000
    });
    obj.poshytip('update', message);
    obj.poshytip('show');
}
(function ($) {
    var tips = [],
        reBgImage = /^url\(["']?([^"'\)]*)["']?\);?$/i,
        rePNG = /\.png$/i,
        ie6 = !!window.createPopup && document.documentElement.currentStyle.minWidth == 'undefined';

    // make sure the tips' position is updated on resize
    function handleWindowResize() {
        $.each(tips, function () {
            this.refresh(true);
        });
    }
    $(window).resize(handleWindowResize);

    $.Poshytip = function (elm, options) {
        this.$elm = $(elm);
        this.opts = $.extend({}, $.fn.poshytip.defaults, options);
        this.$tip = $(['<div class="', this.opts.className, '">',
            '<div class="tip-inner tip-bg-image"></div>',
            '<div class="tip-arrow tip-arrow-top tip-arrow-right tip-arrow-bottom tip-arrow-left"></div>',
            '</div>'].join('')).appendTo(document.body);
        this.$arrow = this.$tip.find('div.tip-arrow');
        this.$inner = this.$tip.find('div.tip-inner');
        this.disabled = false;
        this.content = null;
        this.init();
    };

    $.Poshytip.prototype = {
        init: function () {
            tips.push(this);

            // save the original title and a reference to the Poshytip object
            var title = this.$elm.attr('title');
            this.$elm.data('title.poshytip', title !== undefined ? title : null)
                .data('poshytip', this);

            // hook element events
            if (this.opts.showOn != 'none') {
                this.$elm.bind({
                    'mouseenter.poshytip': $.proxy(this.mouseenter, this),
                    'mouseleave.poshytip': $.proxy(this.mouseleave, this)
                });
                switch (this.opts.showOn) {
                    case 'hover':
                        if (this.opts.alignTo == 'cursor')
                            this.$elm.bind('mousemove.poshytip', $.proxy(this.mousemove, this));
                        if (this.opts.allowTipHover)
                            this.$tip.hover($.proxy(this.clearTimeouts, this), $.proxy(this.mouseleave, this));
                        break;
                    case 'focus':
                        this.$elm.bind({
                            'focus.poshytip': $.proxy(this.showDelayed, this),
                            'blur.poshytip': $.proxy(this.hideDelayed, this)
                        });
                        break;
                }
            }
        },
        mouseenter: function (e) {
            if (this.disabled)
                return true;

            this.$elm.attr('title', '');
            if (this.opts.showOn == 'focus')
                return true;

            this.showDelayed();
        },
        mouseleave: function (e) {
            if (this.disabled || this.asyncAnimating && (this.$tip[0] === e.relatedTarget || jQuery.contains(this.$tip[0], e.relatedTarget)))
                return true;

            if (!this.$tip.data('active')) {
                var title = this.$elm.data('title.poshytip');
                if (title !== null)
                    this.$elm.attr('title', title);
            }
            if (this.opts.showOn == 'focus')
                return true;

            this.hideDelayed();
        },
        mousemove: function (e) {
            if (this.disabled)
                return true;

            this.eventX = e.pageX;
            this.eventY = e.pageY;
            if (this.opts.followCursor && this.$tip.data('active')) {
                this.calcPos();
                this.$tip.css({ left: this.pos.l, top: this.pos.t });
                if (this.pos.arrow)
                    this.$arrow[0].className = 'tip-arrow tip-arrow-' + this.pos.arrow;
            }
        },
        show: function () {
            if (this.disabled || this.$tip.data('active'))
                return;

            this.reset();
            this.update();

            // don't proceed if we didn't get any content in update() (e.g. the element has an empty title attribute)
            if (!this.content)
                return;

            this.display();
            if (this.opts.timeOnScreen)
                this.hideDelayed(this.opts.timeOnScreen);
        },
        showDelayed: function (timeout) {
            this.clearTimeouts();
            this.showTimeout = setTimeout($.proxy(this.show, this), typeof timeout == 'number' ? timeout : this.opts.showTimeout);
        },
        hide: function () {
            if (this.disabled)//|| !this.$tip.data('active')
                return;

            this.display(true);
        },
        hideDelayed: function (timeout) {
            this.clearTimeouts();
            this.hideTimeout = setTimeout($.proxy(this.hide, this), typeof timeout == 'number' ? timeout : this.opts.hideTimeout);
        },
        reset: function () {
            this.$tip.queue([]).detach().css('visibility', 'hidden').data('active', false);
            this.$inner.find('*').poshytip('hide');
            if (this.opts.fade)
                this.$tip.css('opacity', this.opacity);
            this.$arrow[0].className = 'tip-arrow tip-arrow-top tip-arrow-right tip-arrow-bottom tip-arrow-left';
            this.asyncAnimating = false;
        },
        update: function (content, dontOverwriteOption) {
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
                    content.call(this.$elm[0], function (newContent) {
                        self.update(newContent);
                    }) :
                    content == '[title]' ? this.$elm.data('title.poshytip') : content;
            if (this.content !== newContent) {
                this.$inner.empty().append(newContent);
                this.content = newContent;
            }

            this.refresh(async);
        },
        refresh: function (async) {
            if (this.disabled)
                return;

            if (async) {
                if (!this.$tip.data('active'))
                    return;
                // save current position as we will need to animate
                var currPos = { left: this.$tip.css('left'), top: this.$tip.css('top') };
            }

            // reset position to avoid text wrapping, etc.
            this.$tip.css({ left: 0, top: 0 }).appendTo(document.body);

            // save default opacity
            if (this.opacity === undefined)
                this.opacity = this.$tip.css('opacity');

            // check for images - this code is here (i.e. executed each time we show the tip and not on init) due to some browser inconsistencies
            var bgImage = this.$tip.css('background-image').match(reBgImage),
                arrow = this.$arrow.css('background-image').match(reBgImage);

            if (bgImage) {
                var bgImagePNG = rePNG.test(bgImage[1]);
                // fallback to background-color/padding/border in IE6 if a PNG is used
                if (ie6 && bgImagePNG) {
                    this.$tip.css('background-image', 'none');
                    this.$inner.css({ margin: 0, border: 0, padding: 0 });
                    bgImage = bgImagePNG = false;
                } else {
                    this.$tip.prepend('<table class="tip-table" border="0" cellpadding="0" cellspacing="0"><tr><td class="tip-top tip-bg-image" colspan="2"><span></span></td><td class="tip-right tip-bg-image" rowspan="2"><span></span></td></tr><tr><td class="tip-left tip-bg-image" rowspan="2"><span></span></td><td></td></tr><tr><td class="tip-bottom tip-bg-image" colspan="2"><span></span></td></tr></table>')
                        .css({ border: 0, padding: 0, 'background-image': 'none', 'background-color': 'transparent' })
                        .find('.tip-bg-image').css('background-image', 'url("' + bgImage[1] + '")').end()
                        .find('td').eq(3).append(this.$inner);
                }
                // disable fade effect in IE due to Alpha filter + translucent PNG issue
                if (bgImagePNG && !$.support.opacity)
                    this.opts.fade = false;
            }
            // IE arrow fixes
            if (arrow && !$.support.opacity) {
                // disable arrow in IE6 if using a PNG
                if (ie6 && rePNG.test(arrow[1])) {
                    arrow = false;
                    this.$arrow.css('background-image', 'none');
                }
                // disable fade effect in IE due to Alpha filter + translucent PNG issue
                this.opts.fade = false;
            }

            var $table = this.$tip.find('> table.tip-table');
            if (ie6) {
                // fix min/max-width in IE6
                this.$tip[0].style.width = '';
                $table.width('auto').find('td').eq(3).width('auto');
                var tipW = this.$tip.width(),
                    minW = parseInt(this.$tip.css('min-width')),
                    maxW = parseInt(this.$tip.css('max-width'));
                if (!isNaN(minW) && tipW < minW)
                    tipW = minW;
                else if (!isNaN(maxW) && tipW > maxW)
                    tipW = maxW;
                this.$tip.add($table).width(tipW).eq(0).find('td').eq(3).width('100%');
            } else if ($table[0]) {
                // fix the table width if we are using a background image
                // IE9, FF4 use float numbers for width/height so use getComputedStyle for them to avoid text wrapping
                // for details look at: http://vadikom.com/dailies/offsetwidth-offsetheight-useless-in-ie9-firefox4/
                $table.width('auto').find('td').eq(3).width('auto').end().end().width(document.defaultView && document.defaultView.getComputedStyle && parseFloat(document.defaultView.getComputedStyle(this.$tip[0], null).width) || this.$tip.width()).find('td').eq(3).width('100%');
            }
            this.tipOuterW = this.$tip.outerWidth();
            this.tipOuterH = this.$tip.outerHeight();

            this.calcPos();

            // position and show the arrow image
            if (arrow && this.pos.arrow) {
                this.$arrow[0].className = 'tip-arrow tip-arrow-' + this.pos.arrow;
                this.$arrow.css('visibility', 'inherit');
            }

            if (async && this.opts.refreshAniDuration) {
                this.asyncAnimating = true;
                var self = this;
                this.$tip.css(currPos).animate({ left: this.pos.l, top: this.pos.t }, this.opts.refreshAniDuration, function () { self.asyncAnimating = false; });
            } else {
                this.$tip.css({ left: this.pos.l, top: this.pos.t });
            }
        },
        display: function (hide) {
            var active = this.$tip.data('active');
            if (active && !hide || !active && hide)
                return;

            this.$tip.stop();
            if ((this.opts.slide && this.pos.arrow || this.opts.fade) && (hide && this.opts.hideAniDuration || !hide && this.opts.showAniDuration)) {
                var from = {}, to = {};
                // this.pos.arrow is only undefined when alignX == alignY == 'center' and we don't need to slide in that rare case
                if (this.opts.slide && this.pos.arrow) {
                    var prop, arr;
                    if (this.pos.arrow == 'bottom' || this.pos.arrow == 'top') {
                        prop = 'top';
                        arr = 'bottom';
                    } else {
                        prop = 'left';
                        arr = 'right';
                    }
                    var val = parseInt(this.$tip.css(prop));
                    from[prop] = val + (hide ? 0 : (this.pos.arrow == arr ? -this.opts.slideOffset : this.opts.slideOffset));
                    to[prop] = val + (hide ? (this.pos.arrow == arr ? this.opts.slideOffset : -this.opts.slideOffset) : 0) + 'px';
                }
                if (this.opts.fade) {
                    from.opacity = hide ? this.$tip.css('opacity') : 0;
                    to.opacity = hide ? 0 : this.opacity;
                }
                this.$tip.css(from).animate(to, this.opts[hide ? 'hideAniDuration' : 'showAniDuration']);
            }
            hide ? this.$tip.queue($.proxy(this.reset, this)) : this.$tip.css('visibility', 'inherit');
            if (active) {
                var title = this.$elm.data('title.poshytip');
                if (title !== null)
                    this.$elm.attr('title', title);
            }
            this.$tip.data('active', !active);
        },
        disable: function () {
            this.reset();
            this.disabled = true;
        },
        enable: function () {
            this.disabled = false;
        },
        destroy: function () {
            this.reset();
            this.$tip.remove();
            delete this.$tip;
            this.content = null;
            this.$elm.unbind('.poshytip').removeData('title.poshytip').removeData('poshytip');
            tips.splice($.inArray(this, tips), 1);
        },
        clearTimeouts: function () {
            if (this.showTimeout) {
                clearTimeout(this.showTimeout);
                this.showTimeout = 0;
            }
            if (this.hideTimeout) {
                clearTimeout(this.hideTimeout);
                this.hideTimeout = 0;
            }
        },
        calcPos: function () {
            var pos = { l: 0, t: 0, arrow: '' },
                $win = $(window),
                win = {
                    l: $win.scrollLeft(),
                    t: $win.scrollTop(),
                    w: $win.width(),
                    h: $win.height()
                }, xL, xC, xR, yT, yC, yB;
            if (this.opts.alignTo == 'cursor') {
                xL = xC = xR = this.eventX;
                yT = yC = yB = this.eventY;
            } else { // this.opts.alignTo == 'target'
                var elmOffset = this.$elm.offset(),
                    elm = {
                        l: elmOffset.left,
                        t: elmOffset.top,
                        w: this.$elm.outerWidth(),
                        h: this.$elm.outerHeight()
                    };
                xL = elm.l + (this.opts.alignX != 'inner-right' ? 0 : elm.w);	// left edge
                xC = xL + Math.floor(elm.w / 2);				// h center
                xR = xL + (this.opts.alignX != 'inner-left' ? elm.w : 0);	// right edge
                yT = elm.t + (this.opts.alignY != 'inner-bottom' ? 0 : elm.h);	// top edge
                yC = yT + Math.floor(elm.h / 2);				// v center
                yB = yT + (this.opts.alignY != 'inner-top' ? elm.h : 0);	// bottom edge
            }

            // keep in viewport and calc arrow position
            switch (this.opts.alignX) {
                case 'right':
                case 'inner-left':
                    pos.l = xR + this.opts.offsetX;
                    if (this.opts.keepInViewport && pos.l + this.tipOuterW > win.l + win.w)
                        pos.l = win.l + win.w - this.tipOuterW;
                    if (this.opts.alignX == 'right' || this.opts.alignY == 'center')
                        pos.arrow = 'left';
                    break;
                case 'center':
                    pos.l = xC - Math.floor(this.tipOuterW / 2);
                    if (this.opts.keepInViewport) {
                        if (pos.l + this.tipOuterW > win.l + win.w)
                            pos.l = win.l + win.w - this.tipOuterW;
                        else if (pos.l < win.l)
                            pos.l = win.l;
                    }
                    break;
                default: // 'left' || 'inner-right'
                    pos.l = xL - this.tipOuterW - this.opts.offsetX;
                    if (this.opts.keepInViewport && pos.l < win.l)
                        pos.l = win.l;
                    if (this.opts.alignX == 'left' || this.opts.alignY == 'center')
                        pos.arrow = 'right';
            }
            switch (this.opts.alignY) {
                case 'bottom':
                case 'inner-top':
                    pos.t = yB + this.opts.offsetY;
                    // 'left' and 'right' need priority for 'target'
                    if (!pos.arrow || this.opts.alignTo == 'cursor')
                        pos.arrow = 'top';
                    if (this.opts.keepInViewport && pos.t + this.tipOuterH > win.t + win.h) {
                        pos.t = yT - this.tipOuterH - this.opts.offsetY;
                        if (pos.arrow == 'top')
                            pos.arrow = 'bottom';
                    }
                    break;
                case 'center':
                    pos.t = yC - Math.floor(this.tipOuterH / 2);
                    if (this.opts.keepInViewport) {
                        if (pos.t + this.tipOuterH > win.t + win.h)
                            pos.t = win.t + win.h - this.tipOuterH;
                        else if (pos.t < win.t)
                            pos.t = win.t;
                    }
                    break;
                default: // 'top' || 'inner-bottom'
                    pos.t = yT - this.tipOuterH - this.opts.offsetY;
                    // 'left' and 'right' need priority for 'target'
                    if (!pos.arrow || this.opts.alignTo == 'cursor')
                        pos.arrow = 'bottom';
                    if (this.opts.keepInViewport && pos.t < win.t) {
                        pos.t = yB + this.opts.offsetY;
                        if (pos.arrow == 'bottom')
                            pos.arrow = 'top';
                    }
            }
            this.pos = pos;
        }
    };

    $.fn.poshytip = function (options) {
        if (typeof options == 'string') {
            var args = arguments,
                method = options;
            Array.prototype.shift.call(args);
            // unhook live events if 'destroy' is called
            if (method == 'destroy') {
                this.die ?
                    this.die('mouseenter.poshytip').die('focus.poshytip') :
                    $(document).undelegate(this.selector, 'mouseenter.poshytip').undelegate(this.selector, 'focus.poshytip');
            }
            return this.each(function () {
                var poshytip = $(this).data('poshytip');
                if (poshytip && poshytip[method])
                    poshytip[method].apply(poshytip, args);
            });
        }

        var opts = $.extend({}, $.fn.poshytip.defaults, options);

        // generate CSS for this tip class if not already generated
        if (!$('#poshytip-css-' + opts.className)[0])
            $(['<style id="poshytip-css-', opts.className, '" type="text/css">',
                'div.', opts.className, '{visibility:hidden;position:absolute;top:0;left:0;}',
                'div.', opts.className, ' table.tip-table, div.', opts.className, ' table.tip-table td{margin:0;font-family:inherit;font-size:inherit;font-weight:inherit;font-style:inherit;font-variant:inherit;vertical-align:middle;}',
                'div.', opts.className, ' td.tip-bg-image span{display:block;font:1px/1px sans-serif;height:', opts.bgImageFrameSize, 'px;width:', opts.bgImageFrameSize, 'px;overflow:hidden;}',
                'div.', opts.className, ' td.tip-right{background-position:100% 0;}',
                'div.', opts.className, ' td.tip-bottom{background-position:100% 100%;}',
                'div.', opts.className, ' td.tip-left{background-position:0 100%;}',
                'div.', opts.className, ' div.tip-inner{background-position:-', opts.bgImageFrameSize, 'px -', opts.bgImageFrameSize, 'px;}',
                'div.', opts.className, ' div.tip-arrow{visibility:hidden;position:absolute;overflow:hidden;font:1px/1px sans-serif;}',
                '</style>'].join('')).appendTo('head');

        // check if we need to hook live events
        if (opts.liveEvents && opts.showOn != 'none') {
            var handler,
                deadOpts = $.extend({}, opts, { liveEvents: false });
            switch (opts.showOn) {
                case 'hover':
                    handler = function () {
                        var $this = $(this);
                        if (!$this.data('poshytip'))
                            $this.poshytip(deadOpts).poshytip('mouseenter');
                    };
                    // support 1.4.2+ & 1.9+
                    this.live ?
                        this.live('mouseenter.poshytip', handler) :
                        $(document).delegate(this.selector, 'mouseenter.poshytip', handler);
                    break;
                case 'focus':
                    handler = function () {
                        var $this = $(this);
                        if (!$this.data('poshytip'))
                            $this.poshytip(deadOpts).poshytip('showDelayed');
                    };
                    this.live ?
                        this.live('focus.poshytip', handler) :
                        $(document).delegate(this.selector, 'focus.poshytip', handler);
                    break;
            }
            return this;
        }

        return this.each(function () {
            new $.Poshytip(this, opts);
        });
    }
    // default settings
    $.fn.poshytip.defaults = {
        content: '[title]',	// content to display ('[title]', 'string', element, function(updateCallback){...}, jQuery)
        className: 'tip-yellow',	// class for the tips
        bgImageFrameSize: 10,		// size in pixels for the background-image (if set in CSS) frame around the inner content of the tip
        showTimeout: 500,		// timeout before showing the tip (in milliseconds 1000 == 1 second)
        hideTimeout: 100,		// timeout before hiding the tip
        timeOnScreen: 0,		// timeout before automatically hiding the tip after showing it (set to > 0 in order to activate)
        showOn: 'hover',	// handler for showing the tip ('hover', 'focus', 'none') - use 'none' to trigger it manually
        liveEvents: false,		// use live events
        alignTo: 'cursor',	// align/position the tip relative to ('cursor', 'target')
        alignX: 'right',	// horizontal alignment for the tip relative to the mouse cursor or the target element
        // ('right', 'center', 'left', 'inner-left', 'inner-right') - 'inner-*' matter if alignTo:'target'
        alignY: 'top',		// vertical alignment for the tip relative to the mouse cursor or the target element
        // ('bottom', 'center', 'top', 'inner-bottom', 'inner-top') - 'inner-*' matter if alignTo:'target'
        offsetX: -22,		// offset X pixels from the default position - doesn't matter if alignX:'center'
        offsetY: 18,		// offset Y pixels from the default position - doesn't matter if alignY:'center'
        keepInViewport: true,		// reposition the tooltip if needed to make sure it always appears inside the viewport
        allowTipHover: true,		// allow hovering the tip without hiding it onmouseout of the target - matters only if showOn:'hover'
        followCursor: false,		// if the tip should follow the cursor - matters only if showOn:'hover' and alignTo:'cursor'
        fade: true,		// use fade animation
        slide: true,		// use slide animation
        slideOffset: 8,		// slide animation offset
        showAniDuration: 300,		// show animation duration - set to 0 if you don't want show animation
        hideAniDuration: 300,		// hide animation duration - set to 0 if you don't want hide animation
        refreshAniDuration: 200		// refresh animation duration - set to 0 if you don't want animation when updating the tooltip asynchronously
    };

})(jQuery);
function getCurProject() {
    var curPrjct = "";
    $(".tabs,.pill>a").each(function (i, adom) {
        if ($(adom).hasClass("active")) {
            curPrjct = $(adom).text();
        }
    });
    return curPrjct;
}
$(function () {
    var ddlTypeDE2 = '<span class="lblProject" style="color:red;">Insight:</span><select id="ddlTrackType" style="max-width:100px;" doctype="Insight_Tracking"> <option value="Normal">Normal</option> <option value="Created Location">Created Location</option> <option value="Duplicate">Duplicate</option> <option value="Missing Info">Missing Info</option> <option value="Invoice Info Differs">Invoice Info Differs</option> <option value="Can\'t Create Location">Can\'t Create Location</option> <option value="Unmatched Invoice & BOL">Unmatched Invoice & BOL</option> </select>';
    var ddlTypeRecon = '<span class="lblProject" style="background: #000;color: #fff;">Recon:</span><select id="ddlTrackType" style="max-width:100px;background: #000;color: #fff;" doctype="Reconcile_Tracking"> <option value="Normal">Normal</option><option value="Skipped">Skipped</option></select>';
    var curProject = "DE 2";
    var expText = '<label>Ep Comment:</label><input type="text" id="expComment" value="" style="width:100px;"><a id="btnPost" class="button error icon" href="#">Log</a><label id="lblError" style="color:red;"></label>';
    console.log("curProject = " + curProject);    
    var id = setInterval(function () {
        if ($(".recon-index,.bill-entry").hasClass("clickEvent") == false) {
            $(".recon-index,.bill-entry").addClass("clickEvent").click(function () {
                curProject = $(this).text();
                $("#ddlTrackType,.lblProject").remove();
                if (curProject == "DE 2") {
                    $(".navigation").after(ddlTypeDE2);
                    $("#expComment").attr("placeholder", "DE 2");//show doc type to ep comment textbox
                }
                else if (curProject == "Recon") {
                    $(".navigation").after(ddlTypeRecon);
                    $("#expComment").attr("placeholder", "Recon");//show doc type to ep comment textbox
                }
            });
        }
        if ($(".button.primary").hasClass("clickEvent") == false) {
            $(".button.primary").addClass("clickEvent").click(function () { //save button click event
                var LatestInvNum = $("#tblCount").attr("LatestInvNum");
                console.log("Latest Inv# = " + LatestInvNum);
                if ($("#272697129").val() != "" && LatestInvNum != "" && $("#272697129").val() != LatestInvNum) {
                    alert("Seems you have not log this record to Tracking System.");
                }
            });
        }        
        if ($("#tblCount").length == 0) {
            $(".framework-aside-sections:first").prepend('<div id="tblCount"></div>');
        }        
    }, 1000);
    if (curProject) {
        var id = setInterval(function () {
            if ($("#ddlTrackType").length == 0 && $("#expComment").length == 0) {
                AppendHmtl();
            }
        }, 1000);
    }    
    function AppendHmtl() {
        var curUser = $.trim($(".current-user:first").text().replace("Contractor", ""));
        $(".env-header,productionbug").remove();       
        $(".button.primary").hide();//hide save button
        $(".button.logout.icon").parent().prependTo($(".button.logout.icon").parent().parent());
        $("ul.right").removeClass("right").css("margin-top", "50px");////move user name and logoff button to the left side
        //$(".button.logout.icon").css({ "left": "0px", "top": "0px", "position": "absolute" }) //move logoff button to the left top conner(Logo position)
        $(".framework-aside-sections:first").prepend('<div id="tblCount"></div>');
        $(".navigation>li:eq(1),.navigation>li:eq(2)").hide();
        $(".env-header").remove();
        $(".navigation").after(expText).after(ddlTypeDE2);
        $("#expComment").dblclick(function () {
            alert("User : " + curUser);
            console.log("User : " + $(".current-user:first").text());
        });
        console.log("AppendHmtl() done.");
        $("#btnPost").click(function () {
            var scac = $("#1740709713").val();
            var pronum = $("#272697129").val();
            var customer = $("#1409638126").val();
            var currentuser = $.trim($(".current-user:first").text().replace("Contractor", ""));
            var expComment = $("#expComment").val();
            var type = $("#ddlTrackType").val();
            var doc_type = $("#ddlTrackType").attr("doctype");            
            if (type == "Normal" && (pronum == "" || customer == "" || scac == "")) {
                alert("Pro# and Customer and SCAC can not be empty when type is Normal.")
                return false;
            }
            else {
                var shipment = new Object();
                shipment.INVOICE_NUM = csr(pronum);
                shipment.CUSTOMER = csr(customer);
                shipment.TYPE = csr(type);
                shipment.USER_NAME = csr(currentuser);
                shipment.EXCEPTION_TEXT = csr(expComment);
                shipment.SCAC = csr(scac);
                shipment.DOC_TYPE = doc_type;                
                var jsonShipment = JSON.stringify(shipment);
                var tracejson = cs(jsonShipment);
                //console.log("shipment.INVOICE_NUM=" + shipment.INVOICE_NUM);
                //console.log("shipment.CUSTOMER=" + shipment.CUSTOMER);
                //console.log("shipment.TYPE=" + shipment.TYPE);
                //console.log("shipment.USER_NAME=" + shipment.USER_NAME);
                //console.log("shipment.EXCEPTION_TEXT=" + shipment.EXCEPTION_TEXT);
                //console.log("shipment.SCAC=" + shipment.SCAC);
                //console.log("shipment.DOC_TYPE=" + shipment.DOC_TYPE);
                if (shipment.DOC_TYPE) { //if doc_type is not empty or null then post data to server
                    $.ajax({
                        type: "POST",
                        url: "https://app.docxtract.net:2020/titracking/NetTracking.asmx/PostInv",
                        //url: "http://localhost:23181//NetTracking.asmx/PostInv",
                        contentType: "application/x-www-form-urlencoded",
                        data: 'data=' + tracejson,
                        crossDomain: true,
                        dataType: 'text',
                        success: function (result) {
                            $("#tblCount").attr("LatestInvNum", pronum); //log LatestInvNum
                            var returnDataXml = $.parseXML(result);
                            console.log("returnDataXml.Children.text=" + $(returnDataXml).children().text());                           
                            var tblHtml = $(returnDataXml).children().text();
                            if (tblHtml != "") {
                                $("#tblCount").html(tblHtml);
                            }
                            if (tblHtml.indexOf("too frequently") != -1) {
                                alert($("#tblCount").text());
                            }
                            $(".button.primary").show();//show save button
                            //$("#btnPost").hide(500);
                            //setTimeout(function () { Next_Ready(); }, 15000);// normal1clicktag = 0;
                        },
                        error: function (result, status) {                           
                            console.log("log current shipment failed, msg: " + result+", status: "+ status);
                        }
                    });
                }
            }
        });
    }
});
function cs(str) {
    var s = "";
    if (str != "") {
        s = str.replace(/&/g, "^and^");
        s = s.replace(/\'/g, "^");
    }
    return s;
}
function csr(str) {
    return str != "" ? str.replace(/\"/g, "") : "";
}
