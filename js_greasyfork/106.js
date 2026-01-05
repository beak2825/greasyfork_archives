// ==UserScript==
// @name          TvFedor RuTracker RSS button
// @namespace     tvfedorrutrackerbutton
// @match         *://rutracker.org/forum/viewtopic.php?t=*
// @run-at        document-end
// @version 0.0.1.20200303133452
// @description adds RSS TvFedor button to RuTracker.org
// @downloadURL https://update.greasyfork.org/scripts/106/TvFedor%20RuTracker%20RSS%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/106/TvFedor%20RuTracker%20RSS%20button.meta.js
// ==/UserScript==
var place = document.getElementsByClassName("row3 pad_4")[0];

if (place) {
    var our = document.createElement("a");
    our.href = "#";
    our.className = "med";
    our.innerHTML = "Отслеживать в Фёдоре		·		";
    our.onclick = function onclick(eventCL) { // have no idea what it does
        /*
         * fancyBox - jQuery Plugin
         * version: 2.1.3 (Tue, 23 Oct 2012)
         * @requires jQuery v1.6 or later
         *
         * Examples at http://fancyapps.com/fancybox/
         * License: www.fancyapps.com/fancybox/#license
         *
         * Copyright 2012 Janis Skarnelis - janis@fancyapps.com
         *
         */
        (function (window, document, $, undefined) {
            "use strict";
            var W = $(window),
                D = $(document),
                F = $.fancybox = function () {
                    F.open.apply(this, arguments);
                },
                didUpdate = null,
                isTouch = document.createTouch !== undefined,
                isQuery = function (obj) {
                    return obj && obj.hasOwnProperty && obj instanceof $;
                },
                isString = function (str) {
                    return str && $.type(str) === "string";
                },
                isPercentage = function (str) {
                    return isString(str) && str.indexOf('%') > 0;
                },
                isScrollable = function (el) {
                    return (el && !(el.style.overflow && el.style.overflow === 'hidden') && ((el.clientWidth && el.scrollWidth > el.clientWidth) || (el.clientHeight && el.scrollHeight > el.clientHeight)));
                },
                getScalar = function (orig, dim) {
                    var value = parseInt(orig, 10) || 0;
                    if (dim && isPercentage(orig)) {
                        value = F.getViewport()[dim] / 100 * value;
                    }
                    return Math.ceil(value);
                },
                getValue = function (value, dim) {
                    return getScalar(value, dim) + 'px';
                };
            $.extend(F, {
                version: '2.1.3',
                defaults: {
                    padding: 15,
                    margin: 20,
                    width: 800,
                    height: 600,
                    minWidth: 100,
                    minHeight: 100,
                    maxWidth: 9999,
                    maxHeight: 9999,
                    autoSize: true,
                    autoHeight: false,
                    autoWidth: false,
                    autoResize: true,
                    autoCenter: !isTouch,
                    fitToView: true,
                    aspectRatio: false,
                    topRatio: 0.5,
                    leftRatio: 0.5,
                    scrolling: 'auto',
                    wrapCSS: '',
                    arrows: true,
                    closeBtn: true,
                    closeClick: false,
                    nextClick: false,
                    mouseWheel: true,
                    autoPlay: false,
                    playSpeed: 3000,
                    preload: 3,
                    modal: false,
                    loop: true,
                    ajax: {
                        dataType: 'html',
                        headers: {
                            'X-fancyBox': true
                        }
                    },
                    iframe: {
                        scrolling: 'auto',
                        preload: true
                    },
                    swf: {
                        wmode: 'transparent',
                        allowfullscreen: 'true',
                        allowscriptaccess: 'always'
                    },
                    keys: {
                        next: {
                            13: 'left',
                            34: 'up',
                            39: 'left',
                            40: 'up'
                        },
                        prev: {
                            8: 'right',
                            33: 'down',
                            37: 'right',
                            38: 'down'
                        },
                        close: [27],
                        play: [32],
                        toggle: [70]
                    },
                    direction: {
                        next: 'left',
                        prev: 'right'
                    },
                    scrollOutside: true,
                    index: 0,
                    type: null,
                    href: null,
                    content: null,
                    title: null,
                    tpl: {
                        wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                        image: '<img class="fancybox-image" src="{href}" alt="" />',
                        iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + ($.browser.msie ? ' allowtransparency="true"' : '') + '></iframe>',
                        error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',
                        closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                        next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                        prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
                    },
                    openEffect: 'fade',
                    openSpeed: 250,
                    openEasing: 'swing',
                    openOpacity: true,
                    openMethod: 'zoomIn',
                    closeEffect: 'fade',
                    closeSpeed: 250,
                    closeEasing: 'swing',
                    closeOpacity: true,
                    closeMethod: 'zoomOut',
                    nextEffect: 'elastic',
                    nextSpeed: 250,
                    nextEasing: 'swing',
                    nextMethod: 'changeIn',
                    prevEffect: 'elastic',
                    prevSpeed: 250,
                    prevEasing: 'swing',
                    prevMethod: 'changeOut',
                    helpers: {
                        overlay: true,
                        title: true
                    },
                    onCancel: $.noop,
                    beforeLoad: $.noop,
                    afterLoad: $.noop,
                    beforeShow: $.noop,
                    afterShow: $.noop,
                    beforeChange: $.noop,
                    beforeClose: $.noop,
                    afterClose: $.noop
                },
                group: {},
                opts: {},
                previous: null,
                coming: null,
                current: null,
                isActive: false,
                isOpen: false,
                isOpened: false,
                wrap: null,
                skin: null,
                outer: null,
                inner: null,
                player: {
                    timer: null,
                    isActive: false
                },
                ajaxLoad: null,
                imgPreload: null,
                transitions: {},
                helpers: {},
                open: function (group, opts) {
                    if (!group) {
                        return;
                    }
                    if (!$.isPlainObject(opts)) {
                        opts = {};
                    }
                    if (false === F.close(true)) {
                        return;
                    }
                    if (!$.isArray(group)) {
                        group = isQuery(group) ? $(group).get() : [group];
                    }
                    $.each(group, function (i, element) {
                        var obj = {},
                            href, title, content, type, rez, hrefParts, selector;
                        if ($.type(element) === "object") {
                            if (element.nodeType) {
                                element = $(element);
                            }
                            if (isQuery(element)) {
                                obj = {
                                    href: element.data('fancybox-href') || element.attr('href'),
                                    title: element.data('fancybox-title') || element.attr('title'),
                                    isDom: true,
                                    element: element
                                };
                                if ($.metadata) {
                                    $.extend(true, obj, element.metadata());
                                }
                            } else {
                                obj = element;
                            }
                        }
                        href = opts.href || obj.href || (isString(element) ? element : null);
                        title = opts.title !== undefined ? opts.title : obj.title || '';
                        content = opts.content || obj.content;
                        type = content ? 'html' : (opts.type || obj.type);
                        if (!type && obj.isDom) {
                            type = element.data('fancybox-type');
                            if (!type) {
                                rez = element.prop('class').match(/fancybox\.(\w+)/);
                                type = rez ? rez[1] : null;
                            }
                        }
                        if (isString(href)) {
                            if (!type) {
                                if (F.isImage(href)) {
                                    type = 'image';
                                } else if (F.isSWF(href)) {
                                    type = 'swf';
                                } else if (href.charAt(0) === '#') {
                                    type = 'inline';
                                } else if (isString(element)) {
                                    type = 'html';
                                    content = element;
                                }
                            }
                            if (type === 'ajax') {
                                hrefParts = href.split(/\s+/, 2);
                                href = hrefParts.shift();
                                selector = hrefParts.shift();
                            }
                        }
                        if (!content) {
                            if (type === 'inline') {
                                if (href) {
                                    content = $(isString(href) ? href.replace(/.*(?=#[^\s]+$)/, '') : href);
                                } else if (obj.isDom) {
                                    content = element;
                                }
                            } else if (type === 'html') {
                                content = href;
                            } else if (!type && !href && obj.isDom) {
                                type = 'inline';
                                content = element;
                            }
                        }
                        $.extend(obj, {
                            href: href,
                            type: type,
                            content: content,
                            title: title,
                            selector: selector
                        });
                        group[i] = obj;
                    });
                    F.opts = $.extend(true, {}, F.defaults, opts);
                    if (opts.keys !== undefined) {
                        F.opts.keys = opts.keys ? $.extend({}, F.defaults.keys, opts.keys) : false;
                    }
                    F.group = group;
                    return F._start(F.opts.index);
                },
                cancel: function () {
                    var coming = F.coming;
                    if (!coming || false === F.trigger('onCancel')) {
                        return;
                    }
                    F.hideLoading();
                    if (F.ajaxLoad) {
                        F.ajaxLoad.abort();
                    }
                    F.ajaxLoad = null;
                    if (F.imgPreload) {
                        F.imgPreload.onload = F.imgPreload.onerror = null;
                    }
                    if (coming.wrap) {
                        coming.wrap.stop(true, true).trigger('onReset').remove();
                    }
                    F.coming = null;
                    if (!F.current) {
                        F._afterZoomOut(coming);
                    }
                },
                close: function (event) {
                    F.cancel();
                    if (false === F.trigger('beforeClose')) {
                        return;
                    }
                    F.unbindEvents();
                    if (!F.isActive) {
                        return;
                    }
                    if (!F.isOpen || event === true) {
                        $('.fancybox-wrap').stop(true).trigger('onReset').remove();
                        F._afterZoomOut();
                    } else {
                        F.isOpen = F.isOpened = false;
                        F.isClosing = true;
                        $('.fancybox-item, .fancybox-nav').remove();
                        F.wrap.stop(true, true).removeClass('fancybox-opened');
                        F.transitions[F.current.closeMethod]();
                    }
                },
                play: function (action) {
                    var clear = function () {
                            clearTimeout(F.player.timer);
                        },
                        set = function () {
                            clear();
                            if (F.current && F.player.isActive) {
                                F.player.timer = setTimeout(F.next, F.current.playSpeed);
                            }
                        },
                        stop = function () {
                            clear();
                            $('body').unbind('.player');
                            F.player.isActive = false;
                            F.trigger('onPlayEnd');
                        },
                        start = function () {
                            if (F.current && (F.current.loop || F.current.index < F.group.length - 1)) {
                                F.player.isActive = true;
                                $('body').bind({
                                    'afterShow.player onUpdate.player': set,
                                    'onCancel.player beforeClose.player': stop,
                                    'beforeLoad.player': clear
                                });
                                set();
                                F.trigger('onPlayStart');
                            }
                        };
                    if (action === true || (!F.player.isActive && action !== false)) {
                        start();
                    } else {
                        stop();
                    }
                },
                next: function (direction) {
                    var current = F.current;
                    if (current) {
                        if (!isString(direction)) {
                            direction = current.direction.next;
                        }
                        F.jumpto(current.index + 1, direction, 'next');
                    }
                },
                prev: function (direction) {
                    var current = F.current;
                    if (current) {
                        if (!isString(direction)) {
                            direction = current.direction.prev;
                        }
                        F.jumpto(current.index - 1, direction, 'prev');
                    }
                },
                jumpto: function (index, direction, router) {
                    var current = F.current;
                    if (!current) {
                        return;
                    }
                    index = getScalar(index);
                    F.direction = direction || current.direction[(index >= current.index ? 'next' : 'prev')];
                    F.router = router || 'jumpto';
                    if (current.loop) {
                        if (index < 0) {
                            index = current.group.length + (index % current.group.length);
                        }
                        index = index % current.group.length;
                    }
                    if (current.group[index] !== undefined) {
                        F.cancel();
                        F._start(index);
                    }
                },
                reposition: function (e, onlyAbsolute) {
                    var current = F.current,
                        wrap = current ? current.wrap : null,
                        pos;
                    if (wrap) {
                        pos = F._getPosition(onlyAbsolute);
                        if (e && e.type === 'scroll') {
                            delete pos.position;
                            wrap.stop(true, true).animate(pos, 200);
                        } else {
                            wrap.css(pos);
                            current.pos = $.extend({}, current.dim, pos);
                        }
                    }
                },
                update: function (e) {
                    var type = (e && e.type),
                        anyway = !type || type === 'orientationchange';
                    if (anyway) {
                        clearTimeout(didUpdate);
                        didUpdate = null;
                    }
                    if (!F.isOpen || didUpdate) {
                        return;
                    }
                    didUpdate = setTimeout(function () {
                        var current = F.current;
                        if (!current || F.isClosing) {
                            return;
                        }
                        F.wrap.removeClass('fancybox-tmp');
                        if (anyway || type === 'load' || (type === 'resize' && current.autoResize)) {
                            F._setDimension();
                        }
                        if (!(type === 'scroll' && current.canShrink)) {
                            F.reposition(e);
                        }
                        F.trigger('onUpdate');
                        didUpdate = null;
                    }, (anyway && !isTouch ? 0 : 300));
                },
                toggle: function (action) {
                    if (F.isOpen) {
                        F.current.fitToView = $.type(action) === "boolean" ? action : !F.current.fitToView;
                        if (isTouch) {
                            F.wrap.removeAttr('style').addClass('fancybox-tmp');
                            F.trigger('onUpdate');
                        }
                        F.update();
                    }
                },
                hideLoading: function () {
                    D.unbind('.loading');
                    $('#fancybox-loading').remove();
                },
                showLoading: function () {
                    var el, viewport;
                    F.hideLoading();
                    el = $('<div id="fancybox-loading"><div></div></div>').click(F.cancel).appendTo('body');
                    D.bind('keydown.loading', function (e) {
                        if ((e.which || e.keyCode) === 27) {
                            e.preventDefault();
                            F.cancel();
                        }
                    });
                    if (!F.defaults.fixed) {
                        viewport = F.getViewport();
                        el.css({
                            position: 'absolute',
                            top: (viewport.h * 0.5) + viewport.y,
                            left: (viewport.w * 0.5) + viewport.x
                        });
                    }
                },
                getViewport: function () {
                    var locked = (F.current && F.current.locked) || false,
                        rez = {
                            x: W.scrollLeft(),
                            y: W.scrollTop()
                        };
                    if (locked) {
                        rez.w = locked[0].clientWidth;
                        rez.h = locked[0].clientHeight;
                    } else {
                        rez.w = isTouch && window.innerWidth ? window.innerWidth : W.width();
                        rez.h = isTouch && window.innerHeight ? window.innerHeight : W.height();
                    }
                    return rez;
                },
                unbindEvents: function () {
                    if (F.wrap && isQuery(F.wrap)) {
                        F.wrap.unbind('.fb');
                    }
                    D.unbind('.fb');
                    W.unbind('.fb');
                },
                bindEvents: function () {
                    var current = F.current,
                        keys;
                    if (!current) {
                        return;
                    }
                    W.bind('orientationchange.fb' + (isTouch ? '' : ' resize.fb') + (current.autoCenter && !current.locked ? ' scroll.fb' : ''), F.update);
                    keys = current.keys;
                    if (keys) {
                        D.bind('keydown.fb', function (e) {
                            var code = e.which || e.keyCode,
                                target = e.target || e.srcElement;
                            if (code === 27 && F.coming) {
                                return false;
                            }
                            if (!e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && !(target && (target.type || $(target).is('[contenteditable]')))) {
                                $.each(keys, function (i, val) {
                                    if (current.group.length > 1 && val[code] !== undefined) {
                                        F[i](val[code]);
                                        e.preventDefault();
                                        return false;
                                    }
                                    if ($.inArray(code, val) > -1) {
                                        F[i]();
                                        e.preventDefault();
                                        return false;
                                    }
                                });
                            }
                        });
                    }
                    if ($.fn.mousewheel && current.mouseWheel) {
                        F.wrap.bind('mousewheel.fb', function (e, delta, deltaX, deltaY) {
                            var target = e.target || null,
                                parent = $(target),
                                canScroll = false;
                            while (parent.length) {
                                if (canScroll || parent.is('.fancybox-skin') || parent.is('.fancybox-wrap')) {
                                    break;
                                }
                                canScroll = isScrollable(parent[0]);
                                parent = $(parent).parent();
                            }
                            if (delta !== 0 && !canScroll) {
                                if (F.group.length > 1 && !current.canShrink) {
                                    if (deltaY > 0 || deltaX > 0) {
                                        F.prev(deltaY > 0 ? 'down' : 'left');
                                    } else if (deltaY < 0 || deltaX < 0) {
                                        F.next(deltaY < 0 ? 'up' : 'right');
                                    }
                                    e.preventDefault();
                                }
                            }
                        });
                    }
                },
                trigger: function (event, o) {
                    var ret, obj = o || F.coming || F.current;
                    if (!obj) {
                        return;
                    }
                    if ($.isFunction(obj[event])) {
                        ret = obj[event].apply(obj, Array.prototype.slice.call(arguments, 1));
                    }
                    if (ret === false) {
                        return false;
                    }
                    if (obj.helpers) {
                        $.each(obj.helpers, function (helper, opts) {
                            if (opts && F.helpers[helper] && $.isFunction(F.helpers[helper][event])) {
                                opts = $.extend(true, {}, F.helpers[helper].defaults, opts);
                                F.helpers[helper][event](opts, obj);
                            }
                        });
                    }
                    $.event.trigger(event + '.fb');
                },
                isImage: function (str) {
                    return isString(str) && str.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp)((\?|#).*)?$)/i);
                },
                isSWF: function (str) {
                    return isString(str) && str.match(/\.(swf)((\?|#).*)?$/i);
                },
                _start: function (index) {
                    var coming = {},
                        obj, href, type, margin, padding;
                    index = getScalar(index);
                    obj = F.group[index] || null;
                    if (!obj) {
                        return false;
                    }
                    coming = $.extend(true, {}, F.opts, obj);
                    margin = coming.margin;
                    padding = coming.padding;
                    if ($.type(margin) === 'number') {
                        coming.margin = [margin, margin, margin, margin];
                    }
                    if ($.type(padding) === 'number') {
                        coming.padding = [padding, padding, padding, padding];
                    }
                    if (coming.modal) {
                        $.extend(true, coming, {
                            closeBtn: false,
                            closeClick: false,
                            nextClick: false,
                            arrows: false,
                            mouseWheel: false,
                            keys: null,
                            helpers: {
                                overlay: {
                                    closeClick: false
                                }
                            }
                        });
                    }
                    if (coming.autoSize) {
                        coming.autoWidth = coming.autoHeight = true;
                    }
                    if (coming.width === 'auto') {
                        coming.autoWidth = true;
                    }
                    if (coming.height === 'auto') {
                        coming.autoHeight = true;
                    }
                    coming.group = F.group;
                    coming.index = index;
                    F.coming = coming;
                    if (false === F.trigger('beforeLoad')) {
                        F.coming = null;
                        return;
                    }
                    type = coming.type;
                    href = coming.href;
                    if (!type) {
                        F.coming = null;
                        if (F.current && F.router && F.router !== 'jumpto') {
                            F.current.index = index;
                            return F[F.router](F.direction);
                        }
                        return false;
                    }
                    F.isActive = true;
                    if (type === 'image' || type === 'swf') {
                        coming.autoHeight = coming.autoWidth = false;
                        coming.scrolling = 'visible';
                    }
                    if (type === 'image') {
                        coming.aspectRatio = true;
                    }
                    if (type === 'iframe' && isTouch) {
                        coming.scrolling = 'scroll';
                    }
                    coming.wrap = $(coming.tpl.wrap).addClass('fancybox-' + (isTouch ? 'mobile' : 'desktop') + ' fancybox-type-' + type + ' fancybox-tmp ' + coming.wrapCSS).appendTo(coming.parent || 'body');
                    $.extend(coming, {
                        skin: $('.fancybox-skin', coming.wrap),
                        outer: $('.fancybox-outer', coming.wrap),
                        inner: $('.fancybox-inner', coming.wrap)
                    });
                    $.each(["Top", "Right", "Bottom", "Left"], function (i, v) {
                        coming.skin.css('padding' + v, getValue(coming.padding[i]));
                    });
                    F.trigger('onReady');
                    if (type === 'inline' || type === 'html') {
                        if (!coming.content || !coming.content.length) {
                            return F._error('content');
                        }
                    } else if (!href) {
                        return F._error('href');
                    }
                    if (type === 'image') {
                        F._loadImage();
                    } else if (type === 'ajax') {
                        F._loadAjax();
                    } else if (type === 'iframe') {
                        F._loadIframe();
                    } else {
                        F._afterLoad();
                    }
                },
                _error: function (type) {
                    $.extend(F.coming, {
                        type: 'html',
                        autoWidth: true,
                        autoHeight: true,
                        minWidth: 0,
                        minHeight: 0,
                        scrolling: 'no',
                        hasError: type,
                        content: F.coming.tpl.error
                    });
                    F._afterLoad();
                },
                _loadImage: function () {
                    var img = F.imgPreload = new Image();
                    img.onload = function () {
                        this.onload = this.onerror = null;
                        F.coming.width = this.width;
                        F.coming.height = this.height;
                        F._afterLoad();
                    };
                    img.onerror = function () {
                        this.onload = this.onerror = null;
                        F._error('image');
                    };
                    img.src = F.coming.href;
                    if (img.complete !== true) {
                        F.showLoading();
                    }
                },
                _loadAjax: function () {
                    var coming = F.coming;
                    F.showLoading();
                    F.ajaxLoad = $.ajax($.extend({}, coming.ajax, {
                        url: coming.href,
                        error: function (jqXHR, textStatus) {
                            if (F.coming && textStatus !== 'abort') {
                                F._error('ajax', jqXHR);
                            } else {
                                F.hideLoading();
                            }
                        },
                        success: function (data, textStatus) {
                            if (textStatus === 'success') {
                                coming.content = data;
                                F._afterLoad();
                            }
                        }
                    }));
                },
                _loadIframe: function () {
                    var coming = F.coming,
                        iframe = $(coming.tpl.iframe.replace(/\{rnd\}/g, new Date().getTime())).attr('scrolling', isTouch ? 'auto' : coming.iframe.scrolling).attr('src', coming.href);
                    $(coming.wrap).bind('onReset', function () {
                        try {
                            $(this).find('iframe').hide().attr('src', '//about:blank').end().empty();
                        } catch (e) {}
                    });
                    if (coming.iframe.preload) {
                        F.showLoading();
                        iframe.one('load', function () {
                            $(this).data('ready', 1);
                            if (!isTouch) {
                                $(this).bind('load.fb', F.update);
                            }
                            $(this).parents('.fancybox-wrap').width('100%').removeClass('fancybox-tmp').show();
                            F._afterLoad();
                        });
                    }
                    coming.content = iframe.appendTo(coming.inner);
                    if (!coming.iframe.preload) {
                        F._afterLoad();
                    }
                },
                _preloadImages: function () {
                    var group = F.group,
                        current = F.current,
                        len = group.length,
                        cnt = current.preload ? Math.min(current.preload, len - 1) : 0,
                        item, i;
                    for (i = 1; i <= cnt; i += 1) {
                        item = group[(current.index + i) % len];
                        if (item.type === 'image' && item.href) {
                            new Image().src = item.href;
                        }
                    }
                },
                _afterLoad: function () {
                    var coming = F.coming,
                        previous = F.current,
                        placeholder = 'fancybox-placeholder',
                        current, content, type, scrolling, href, embed;
                    F.hideLoading();
                    if (!coming || F.isActive === false) {
                        return;
                    }
                    if (false === F.trigger('afterLoad', coming, previous)) {
                        coming.wrap.stop(true).trigger('onReset').remove();
                        F.coming = null;
                        return;
                    }
                    if (previous) {
                        F.trigger('beforeChange', previous);
                        previous.wrap.stop(true).removeClass('fancybox-opened').find('.fancybox-item, .fancybox-nav').remove();
                    }
                    F.unbindEvents();
                    current = coming;
                    content = coming.content;
                    type = coming.type;
                    scrolling = coming.scrolling;
                    $.extend(F, {
                        wrap: current.wrap,
                        skin: current.skin,
                        outer: current.outer,
                        inner: current.inner,
                        current: current,
                        previous: previous
                    });
                    href = current.href;
                    switch (type) {
                    case 'inline':
                    case 'ajax':
                    case 'html':
                        if (current.selector) {
                            content = $('<div>').html(content).find(current.selector);
                        } else if (isQuery(content)) {
                            if (!content.data(placeholder)) {
                                content.data(placeholder, $('<div class="' + placeholder + '"></div>').insertAfter(content).hide());
                            }
                            content = content.show().detach();
                            current.wrap.bind('onReset', function () {
                                if ($(this).find(content).length) {
                                    content.hide().replaceAll(content.data(placeholder)).data(placeholder, false);
                                }
                            });
                        }
                        break;
                    case 'image':
                        content = current.tpl.image.replace('{href}', href);
                        break;
                    case 'swf':
                        content = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + href + '"></param>';
                        embed = '';
                        $.each(current.swf, function (name, val) {
                            content += '<param name="' + name + '" value="' + val + '"></param>';
                            embed += ' ' + name + '="' + val + '"';
                        });
                        content += '<embed src="' + href + '" type="application/x-shockwave-flash" width="100%" height="100%"' + embed + '></embed></object>';
                        break;
                    }
                    if (!(isQuery(content) && content.parent().is(current.inner))) {
                        current.inner.append(content);
                    }
                    F.trigger('beforeShow');
                    current.inner.css('overflow', scrolling === 'yes' ? 'scroll' : (scrolling === 'no' ? 'hidden' : scrolling));
                    F._setDimension();
                    F.reposition();
                    F.isOpen = false;
                    F.coming = null;
                    F.bindEvents();
                    if (!F.isOpened) {
                        $('.fancybox-wrap').not(current.wrap).stop(true).trigger('onReset').remove();
                    } else if (previous.prevMethod) {
                        F.transitions[previous.prevMethod]();
                    }
                    F.transitions[F.isOpened ? current.nextMethod : current.openMethod]();
                    F._preloadImages();
                },
                _setDimension: function () {
                    var viewport = F.getViewport(),
                        steps = 0,
                        canShrink = false,
                        canExpand = false,
                        wrap = F.wrap,
                        skin = F.skin,
                        inner = F.inner,
                        current = F.current,
                        width = current.width,
                        height = current.height,
                        minWidth = current.minWidth,
                        minHeight = current.minHeight,
                        maxWidth = current.maxWidth,
                        maxHeight = current.maxHeight,
                        scrolling = current.scrolling,
                        scrollOut = current.scrollOutside ? current.scrollbarWidth : 0,
                        margin = current.margin,
                        wMargin = getScalar(margin[1] + margin[3]),
                        hMargin = getScalar(margin[0] + margin[2]),
                        wPadding, hPadding, wSpace, hSpace, origWidth, origHeight, origMaxWidth, origMaxHeight, ratio, width_, height_, maxWidth_, maxHeight_, iframe, body;
                    wrap.add(skin).add(inner).width('auto').height('auto').removeClass('fancybox-tmp');
                    wPadding = getScalar(skin.outerWidth(true) - skin.width());
                    hPadding = getScalar(skin.outerHeight(true) - skin.height());
                    wSpace = wMargin + wPadding;
                    hSpace = hMargin + hPadding;
                    origWidth = isPercentage(width) ? (viewport.w - wSpace) * getScalar(width) / 100 : width;
                    origHeight = isPercentage(height) ? (viewport.h - hSpace) * getScalar(height) / 100 : height;
                    if (current.type === 'iframe') {
                        iframe = current.content;
                        if (current.autoHeight && iframe.data('ready') === 1) {
                            try {
                                if (iframe[0].contentWindow.document.location) {
                                    inner.width(origWidth).height(9999);
                                    body = iframe.contents().find('body');
                                    if (scrollOut) {
                                        body.css('overflow-x', 'hidden');
                                    }
                                    origHeight = body.height();
                                }
                            } catch (e) {}
                        }
                    } else if (current.autoWidth || current.autoHeight) {
                        inner.addClass('fancybox-tmp');
                        if (!current.autoWidth) {
                            inner.width(origWidth);
                        }
                        if (!current.autoHeight) {
                            inner.height(origHeight);
                        }
                        if (current.autoWidth) {
                            origWidth = inner.width();
                        }
                        if (current.autoHeight) {
                            origHeight = inner.height();
                        }
                        inner.removeClass('fancybox-tmp');
                    }
                    width = getScalar(origWidth);
                    height = getScalar(origHeight);
                    ratio = origWidth / origHeight;
                    minWidth = getScalar(isPercentage(minWidth) ? getScalar(minWidth, 'w') - wSpace : minWidth);
                    maxWidth = getScalar(isPercentage(maxWidth) ? getScalar(maxWidth, 'w') - wSpace : maxWidth);
                    minHeight = getScalar(isPercentage(minHeight) ? getScalar(minHeight, 'h') - hSpace : minHeight);
                    maxHeight = getScalar(isPercentage(maxHeight) ? getScalar(maxHeight, 'h') - hSpace : maxHeight);
                    origMaxWidth = maxWidth;
                    origMaxHeight = maxHeight;
                    if (current.fitToView) {
                        maxWidth = Math.min(viewport.w - wSpace, maxWidth);
                        maxHeight = Math.min(viewport.h - hSpace, maxHeight);
                    }
                    maxWidth_ = viewport.w - wMargin;
                    maxHeight_ = viewport.h - hMargin;
                    if (current.aspectRatio) {
                        if (width > maxWidth) {
                            width = maxWidth;
                            height = getScalar(width / ratio);
                        }
                        if (height > maxHeight) {
                            height = maxHeight;
                            width = getScalar(height * ratio);
                        }
                        if (width < minWidth) {
                            width = minWidth;
                            height = getScalar(width / ratio);
                        }
                        if (height < minHeight) {
                            height = minHeight;
                            width = getScalar(height * ratio);
                        }
                    } else {
                        width = Math.max(minWidth, Math.min(width, maxWidth));
                        if (current.autoHeight && current.type !== 'iframe') {
                            inner.width(width);
                            height = inner.height();
                        }
                        height = Math.max(minHeight, Math.min(height, maxHeight));
                    }
                    if (current.fitToView) {
                        inner.width(width).height(height);
                        wrap.width(width + wPadding);
                        width_ = wrap.width();
                        height_ = wrap.height();
                        if (current.aspectRatio) {
                            while ((width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight) {
                                if (steps++ > 19) {
                                    break;
                                }
                                height = Math.max(minHeight, Math.min(maxHeight, height - 10));
                                width = getScalar(height * ratio);
                                if (width < minWidth) {
                                    width = minWidth;
                                    height = getScalar(width / ratio);
                                }
                                if (width > maxWidth) {
                                    width = maxWidth;
                                    height = getScalar(width / ratio);
                                }
                                inner.width(width).height(height);
                                wrap.width(width + wPadding);
                                width_ = wrap.width();
                                height_ = wrap.height();
                            }
                        } else {
                            width = Math.max(minWidth, Math.min(width, width - (width_ - maxWidth_)));
                            height = Math.max(minHeight, Math.min(height, height - (height_ - maxHeight_)));
                        }
                    }
                    if (scrollOut && scrolling === 'auto' && height < origHeight && (width + wPadding + scrollOut) < maxWidth_) {
                        width += scrollOut;
                    }
                    inner.width(width).height(height);
                    wrap.width(width + wPadding);
                    width_ = wrap.width();
                    height_ = wrap.height();
                    canShrink = (width_ > maxWidth_ || height_ > maxHeight_) && width > minWidth && height > minHeight;
                    canExpand = current.aspectRatio ? (width < origMaxWidth && height < origMaxHeight && width < origWidth && height < origHeight) : ((width < origMaxWidth || height < origMaxHeight) && (width < origWidth || height < origHeight));
                    $.extend(current, {
                        dim: {
                            width: getValue(width_),
                            height: getValue(height_)
                        },
                        origWidth: origWidth,
                        origHeight: origHeight,
                        canShrink: canShrink,
                        canExpand: canExpand,
                        wPadding: wPadding,
                        hPadding: hPadding,
                        wrapSpace: height_ - skin.outerHeight(true),
                        skinSpace: skin.height() - height
                    });
                    if (!iframe && current.autoHeight && height > minHeight && height < maxHeight && !canExpand) {
                        inner.height('auto');
                    }
                },
                _getPosition: function (onlyAbsolute) {
                    var current = F.current,
                        viewport = F.getViewport(),
                        margin = current.margin,
                        width = F.wrap.width() + margin[1] + margin[3],
                        height = F.wrap.height() + margin[0] + margin[2],
                        rez = {
                            position: 'absolute',
                            top: margin[0],
                            left: margin[3]
                        };
                    if (current.autoCenter && current.fixed && !onlyAbsolute && height <= viewport.h && width <= viewport.w) {
                        rez.position = 'fixed';
                    } else if (!current.locked) {
                        rez.top += viewport.y;
                        rez.left += viewport.x;
                    }
                    rez.top = getValue(Math.max(rez.top, rez.top + ((viewport.h - height) * current.topRatio)));
                    rez.left = getValue(Math.max(rez.left, rez.left + ((viewport.w - width) * current.leftRatio)));
                    return rez;
                },
                _afterZoomIn: function () {
                    var current = F.current;
                    if (!current) {
                        return;
                    }
                    F.isOpen = F.isOpened = true;
                    F.wrap.css('overflow', 'visible').addClass('fancybox-opened');
                    F.update();
                    if (current.closeClick || (current.nextClick && F.group.length > 1)) {
                        F.inner.css('cursor', 'pointer').bind('click.fb', function (e) {
                            if (!$(e.target).is('a') && !$(e.target).parent().is('a')) {
                                e.preventDefault();
                                F[current.closeClick ? 'close' : 'next']();
                            }
                        });
                    }
                    if (current.closeBtn) {
                        $(current.tpl.closeBtn).appendTo(F.skin).bind(isTouch ? 'touchstart.fb' : 'click.fb', function (e) {
                            e.preventDefault();
                            F.close();
                        });
                    }
                    if (current.arrows && F.group.length > 1) {
                        if (current.loop || current.index > 0) {
                            $(current.tpl.prev).appendTo(F.outer).bind('click.fb', F.prev);
                        }
                        if (current.loop || current.index < F.group.length - 1) {
                            $(current.tpl.next).appendTo(F.outer).bind('click.fb', F.next);
                        }
                    }
                    F.trigger('afterShow');
                    if (!current.loop && current.index === current.group.length - 1) {
                        F.play(false);
                    } else if (F.opts.autoPlay && !F.player.isActive) {
                        F.opts.autoPlay = false;
                        F.play();
                    }
                },
                _afterZoomOut: function (obj) {
                    obj = obj || F.current;
                    $('.fancybox-wrap').trigger('onReset').remove();
                    $.extend(F, {
                        group: {},
                        opts: {},
                        router: false,
                        current: null,
                        isActive: false,
                        isOpened: false,
                        isOpen: false,
                        isClosing: false,
                        wrap: null,
                        skin: null,
                        outer: null,
                        inner: null
                    });
                    F.trigger('afterClose', obj);
                }
            });
            F.transitions = {
                getOrigPosition: function () {
                    var current = F.current,
                        element = current.element,
                        orig = current.orig,
                        pos = {},
                        width = 50,
                        height = 50,
                        hPadding = current.hPadding,
                        wPadding = current.wPadding,
                        viewport = F.getViewport();
                    if (!orig && current.isDom && element.is(':visible')) {
                        orig = element.find('img:first');
                        if (!orig.length) {
                            orig = element;
                        }
                    }
                    if (isQuery(orig)) {
                        pos = orig.offset();
                        if (orig.is('img')) {
                            width = orig.outerWidth();
                            height = orig.outerHeight();
                        }
                    } else {
                        pos.top = viewport.y + (viewport.h - height) * current.topRatio;
                        pos.left = viewport.x + (viewport.w - width) * current.leftRatio;
                    }
                    if (F.wrap.css('position') === 'fixed' || current.locked) {
                        pos.top -= viewport.y;
                        pos.left -= viewport.x;
                    }
                    pos = {
                        top: getValue(pos.top - hPadding * current.topRatio),
                        left: getValue(pos.left - wPadding * current.leftRatio),
                        width: getValue(width + wPadding),
                        height: getValue(height + hPadding)
                    };
                    return pos;
                },
                step: function (now, fx) {
                    var ratio, padding, value, prop = fx.prop,
                        current = F.current,
                        wrapSpace = current.wrapSpace,
                        skinSpace = current.skinSpace;
                    if (prop === 'width' || prop === 'height') {
                        ratio = fx.end === fx.start ? 1 : (now - fx.start) / (fx.end - fx.start);
                        if (F.isClosing) {
                            ratio = 1 - ratio;
                        }
                        padding = prop === 'width' ? current.wPadding : current.hPadding;
                        value = now - padding;
                        F.skin[prop](getScalar(prop === 'width' ? value : value - (wrapSpace * ratio)));
                        F.inner[prop](getScalar(prop === 'width' ? value : value - (wrapSpace * ratio) - (skinSpace * ratio)));
                    }
                },
                zoomIn: function () {
                    var current = F.current,
                        startPos = current.pos,
                        effect = current.openEffect,
                        elastic = effect === 'elastic',
                        endPos = $.extend({
                            opacity: 1
                        }, startPos);
                    delete endPos.position;
                    if (elastic) {
                        startPos = this.getOrigPosition();
                        if (current.openOpacity) {
                            startPos.opacity = 0.1;
                        }
                    } else if (effect === 'fade') {
                        startPos.opacity = 0.1;
                    }
                    F.wrap.css(startPos).animate(endPos, {
                        duration: effect === 'none' ? 0 : current.openSpeed,
                        easing: current.openEasing,
                        step: elastic ? this.step : null,
                        complete: F._afterZoomIn
                    });
                },
                zoomOut: function () {
                    var current = F.current,
                        effect = current.closeEffect,
                        elastic = effect === 'elastic',
                        endPos = {
                            opacity: 0.1
                        };
                    if (elastic) {
                        endPos = this.getOrigPosition();
                        if (current.closeOpacity) {
                            endPos.opacity = 0.1;
                        }
                    }
                    F.wrap.animate(endPos, {
                        duration: effect === 'none' ? 0 : current.closeSpeed,
                        easing: current.closeEasing,
                        step: elastic ? this.step : null,
                        complete: F._afterZoomOut
                    });
                },
                changeIn: function () {
                    var current = F.current,
                        effect = current.nextEffect,
                        startPos = current.pos,
                        endPos = {
                            opacity: 1
                        },
                        direction = F.direction,
                        distance = 200,
                        field;
                    startPos.opacity = 0.1;
                    if (effect === 'elastic') {
                        field = direction === 'down' || direction === 'up' ? 'top' : 'left';
                        if (direction === 'down' || direction === 'right') {
                            startPos[field] = getValue(getScalar(startPos[field]) - distance);
                            endPos[field] = '+=' + distance + 'px';
                        } else {
                            startPos[field] = getValue(getScalar(startPos[field]) + distance);
                            endPos[field] = '-=' + distance + 'px';
                        }
                    }
                    if (effect === 'none') {
                        F._afterZoomIn();
                    } else {
                        F.wrap.css(startPos).animate(endPos, {
                            duration: current.nextSpeed,
                            easing: current.nextEasing,
                            complete: function () {
                                setTimeout(F._afterZoomIn, 20);
                            }
                        });
                    }
                },
                changeOut: function () {
                    var previous = F.previous,
                        effect = previous.prevEffect,
                        endPos = {
                            opacity: 0.1
                        },
                        direction = F.direction,
                        distance = 200;
                    if (effect === 'elastic') {
                        endPos[direction === 'down' || direction === 'up' ? 'top' : 'left'] = (direction === 'up' || direction === 'left' ? '-' : '+') + '=' + distance + 'px';
                    }
                    previous.wrap.animate(endPos, {
                        duration: effect === 'none' ? 0 : previous.prevSpeed,
                        easing: previous.prevEasing,
                        complete: function () {
                            $(this).trigger('onReset').remove();
                        }
                    });
                }
            };
            F.helpers.overlay = {
                defaults: {
                    closeClick: true,
                    speedOut: 200,
                    showEarly: true,
                    css: {},
                    locked: !isTouch,
                    fixed: true
                },
                overlay: null,
                fixed: false,
                create: function (opts) {
                    opts = $.extend({}, this.defaults, opts);
                    if (this.overlay) {
                        this.close();
                    }
                    this.overlay = $('<div class="fancybox-overlay"></div>').appendTo('body');
                    this.fixed = false;
                    if (opts.fixed && F.defaults.fixed) {
                        this.overlay.addClass('fancybox-overlay-fixed');
                        this.fixed = true;
                    }
                },
                open: function (opts) {
                    var that = this;
                    opts = $.extend({}, this.defaults, opts);
                    if (this.overlay) {
                        this.overlay.unbind('.overlay').width('auto').height('auto');
                    } else {
                        this.create(opts);
                    }
                    if (!this.fixed) {
                        W.bind('resize.overlay', $.proxy(this.update, this));
                        this.update();
                    }
                    if (opts.closeClick) {
                        this.overlay.bind('click.overlay', function (e) {
                            if ($(e.target).hasClass('fancybox-overlay')) {
                                if (F.isActive) {
                                    F.close();
                                } else {
                                    that.close();
                                }
                            }
                        });
                    }
                    this.overlay.css(opts.css).show();
                },
                close: function () {
                    $('.fancybox-overlay').remove();
                    W.unbind('resize.overlay');
                    this.overlay = null;
                    if (this.margin !== false) {
                        $('body').css('margin-right', this.margin);
                        this.margin = false;
                    }
                    if (this.el) {
                        this.el.removeClass('fancybox-lock');
                    }
                },
                update: function () {
                    var width = '100%',
                        offsetWidth;
                    this.overlay.width(width).height('100%');
                    if ($.browser.msie) {
                        offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);
                        if (D.width() > offsetWidth) {
                            width = D.width();
                        }
                    } else if (D.width() > W.width()) {
                        width = D.width();
                    }
                    this.overlay.width(width).height(D.height());
                },
                onReady: function (opts, obj) {
                    $('.fancybox-overlay').stop(true, true);
                    if (!this.overlay) {
                        this.margin = D.height() > W.height() || $('body').css('overflow-y') === 'scroll' ? $('body').css('margin-right') : false;
                        this.el = document.all && !document.querySelector ? $('html') : $('body');
                        this.create(opts);
                    }
                    if (opts.locked && this.fixed) {
                        obj.locked = this.overlay.append(obj.wrap);
                        obj.fixed = false;
                    }
                    if (opts.showEarly === true) {
                        this.beforeShow.apply(this, arguments);
                    }
                },
                beforeShow: function (opts, obj) {
                    if (obj.locked) {
                        this.el.addClass('fancybox-lock');
                        if (this.margin !== false) {
                            $('body').css('margin-right', getScalar(this.margin) + obj.scrollbarWidth);
                        }
                    }
                    this.open(opts);
                },
                onUpdate: function () {
                    if (!this.fixed) {
                        this.update();
                    }
                },
                afterClose: function (opts) {
                    if (this.overlay && !F.isActive) {
                        this.overlay.fadeOut(opts.speedOut, $.proxy(this.close, this));
                    }
                }
            };
            F.helpers.title = {
                defaults: {
                    type: 'float',
                    position: 'bottom'
                },
                beforeShow: function (opts) {
                    var current = F.current,
                        text = current.title,
                        type = opts.type,
                        title, target;
                    if ($.isFunction(text)) {
                        text = text.call(current.element, current);
                    }
                    if (!isString(text) || $.trim(text) === '') {
                        return;
                    }
                    title = $('<div class="fancybox-title fancybox-title-' + type + '-wrap">' + text + '</div>');
                    switch (type) {
                    case 'inside':
                        target = F.skin;
                        break;
                    case 'outside':
                        target = F.wrap;
                        break;
                    case 'over':
                        target = F.inner;
                        break;
                    default:
                        target = F.skin;
                        title.appendTo('body');
                        if ($.browser.msie) {
                            title.width(title.width());
                        }
                        title.wrapInner('<span class="child"></span>');
                        F.current.margin[2] += Math.abs(getScalar(title.css('margin-bottom')));
                        break;
                    }
                    title[(opts.position === 'top' ? 'prependTo' : 'appendTo')](target);
                }
            };
            $.fn.fancybox = function (options) {
                var index, that = $(this),
                    selector = this.selector || '',
                    run = function (e) {
                        var what = $(this).blur(),
                            idx = index,
                            relType, relVal;
                        if (!(e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) && !what.is('.fancybox-wrap')) {
                            relType = options.groupAttr || 'data-fancybox-group';
                            relVal = what.attr(relType);
                            if (!relVal) {
                                relType = 'rel';
                                relVal = what.get(0)[relType];
                            }
                            if (relVal && relVal !== '' && relVal !== 'nofollow') {
                                what = selector.length ? $(selector) : that;
                                what = what.filter('[' + relType + '="' + relVal + '"]');
                                idx = what.index(this);
                            }
                            options.index = idx;
                            if (F.open(what, options) !== false) {
                                e.preventDefault();
                            }
                        }
                    };
                options = options || {};
                index = options.index || 0;
                if (!selector || options.live === false) {
                    that.unbind('click.fb-start').bind('click.fb-start', run);
                } else {
                    D.undelegate(selector, 'click.fb-start').delegate(selector + ":not('.fancybox-item, .fancybox-nav')", 'click.fb-start', run);
                }
                this.filter('[data-fancybox-start=1]').trigger('click');
                return this;
            };
            D.ready(function () {
                if ($.scrollbarWidth === undefined) {
                    $.scrollbarWidth = function () {
                        var parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body'),
                            child = parent.children(),
                            width = child.innerWidth() - child.height(99).innerWidth();
                        parent.remove();
                        return width;
                    };
                }
                if ($.support.fixedPosition === undefined) {
                    $.support.fixedPosition = (function () {
                        var elem = $('<div style="position:fixed;top:20px;"></div>').appendTo('body'),
                            fixed = (elem[0].offsetTop === 20 || elem[0].offsetTop === 15);
                        elem.remove();
                        return fixed;
                    }());
                }
                $.extend(F.defaults, {
                    scrollbarWidth: $.scrollbarWidth(),
                    fixed: $.support.fixedPosition,
                    parent: $('body')
                });
            });
        }(window, document, jQuery));;
        if (typeof Object.create !== 'function') {
            Object.create = function (o) {
                function F() {}
                F.prototype = o;
                return new F();
            };
        }
        (function ($) {
            var NotyObject = {
                init: function (options) {
                    this.options = $.extend({}, $.noty.defaults, options);
                    this.options.layout = (this.options.custom) ? $.noty.layouts['inline'] : $.noty.layouts[this.options.layout];
                    this.options.theme = $.noty.themes[this.options.theme];
                    delete options.layout;
                    delete options.theme;
                    this.options = $.extend({}, this.options, this.options.layout.options);
                    this.options.id = 'noty_' + (new Date().getTime() * Math.floor(Math.random() * 1000000));
                    this.options = $.extend({}, this.options, options);
                    this._build();
                    return this;
                },
                _build: function () {
                    var $bar = $('<div class="noty_bar"></div>').attr('id', this.options.id);
                    $bar.append(this.options.template).find('.noty_text').html(this.options.text);
                    this.$bar = (this.options.layout.parent.object !== null) ? $(this.options.layout.parent.object).css(this.options.layout.parent.css).append($bar) : $bar;
                    if (this.options.buttons) {
                        this.options.closeWith = [];
                        this.options.timeout = false;
                        var $buttons = $('<div/>').addClass('noty_buttons');
                        (this.options.layout.parent.object !== null) ? this.$bar.find('.noty_bar').append($buttons): this.$bar.append($buttons);
                        var self = this;
                        $.each(this.options.buttons, function (i, button) {
                            var $button = $('<button/>').addClass((button.addClass) ? button.addClass : 'gray').html(button.text).appendTo(self.$bar.find('.noty_buttons')).bind('click', function () {
                                if ($.isFunction(button.onClick)) {
                                    button.onClick.call($button, self);
                                }
                            });
                        });
                    }
                    this.$message = this.$bar.find('.noty_message');
                    this.$closeButton = this.$bar.find('.noty_close');
                    this.$buttons = this.$bar.find('.noty_buttons');
                    $.noty.store[this.options.id] = this;
                },
                show: function () {
                    var self = this;
                    $(self.options.layout.container.selector).append(self.$bar);
                    self.options.theme.style.apply(self);
                    ($.type(self.options.layout.css) === 'function') ? this.options.layout.css.apply(self.$bar): self.$bar.css(this.options.layout.css || {});
                    self.$bar.addClass(self.options.layout.addClass);
                    self.options.layout.container.style.apply($(self.options.layout.container.selector));
                    self.options.theme.callback.onShow.apply(this);
                    if ($.inArray('click', self.options.closeWith) > -1)
                        self.$bar.css('cursor', 'pointer').one('click', function () {
                            self.close();
                        });
                    if ($.inArray('hover', self.options.closeWith) > -1)
                        self.$bar.one('mouseenter', function () {
                            self.close();
                        });
                    if ($.inArray('button', self.options.closeWith) > -1)
                        self.$closeButton.one('click', function () {
                            self.close();
                        });
                    if ($.inArray('button', self.options.closeWith) == -1)
                        self.$closeButton.remove();
                    if (self.options.callback.onShow)
                        self.options.callback.onShow.apply(self);
                    self.$bar.animate(self.options.animation.open, self.options.animation.speed, self.options.animation.easing, function () {
                        if (self.options.callback.afterShow) self.options.callback.afterShow.apply(self);
                        self.shown = true;
                    });
                    if (self.options.timeout)
                        self.$bar.delay(self.options.timeout).promise().done(function () {
                            self.close();
                        });
                    return this;
                },
                close: function () {
                    if (this.closed) return;
                    var self = this;
                    if (!this.shown) {
                        var queue = [];
                        $.each($.noty.queue, function (i, n) {
                            if (n.options.id != self.options.id) {
                                queue.push(n);
                            }
                        });
                        $.noty.queue = queue;
                        return;
                    }
                    self.$bar.addClass('i-am-closing-now');
                    if (self.options.callback.onClose) {
                        self.options.callback.onClose.apply(self);
                    }
                    self.$bar.clearQueue().stop().animate(self.options.animation.close, self.options.animation.speed, self.options.animation.easing, function () {
                        if (self.options.callback.afterClose) self.options.callback.afterClose.apply(self);
                    }).promise().done(function () {
                        if (self.options.modal) {
                            $.notyRenderer.setModalCount(-1);
                            if ($.notyRenderer.getModalCount() == 0) $('.noty_modal').fadeOut('fast', function () {
                                $(this).remove();
                            });
                        }
                        $.notyRenderer.setLayoutCountFor(self, -1);
                        if ($.notyRenderer.getLayoutCountFor(self) == 0) $(self.options.layout.container.selector).remove();
                        if (typeof self.$bar !== 'undefined' && self.$bar !== null) {
                            self.$bar.remove();
                            self.$bar = null;
                            self.closed = true;
                        }
                        delete $.noty.store[self.options.id];
                        self.options.theme.callback.onClose.apply(self);
                        if (!self.options.dismissQueue) {
                            $.noty.ontap = true;
                            $.notyRenderer.render();
                        }
                    });
                },
                setText: function (text) {
                    if (!this.closed) {
                        this.options.text = text;
                        this.$bar.find('.noty_text').html(text);
                    }
                    return this;
                },
                setType: function (type) {
                    if (!this.closed) {
                        this.options.type = type;
                        this.options.theme.style.apply(this);
                        this.options.theme.callback.onShow.apply(this);
                    }
                    return this;
                },
                setTimeout: function (time) {
                    if (!this.closed) {
                        var self = this;
                        this.options.timeout = time;
                        self.$bar.delay(self.options.timeout).promise().done(function () {
                            self.close();
                        });
                    }
                    return this;
                },
                closed: false,
                shown: false
            };
            $.notyRenderer = {};
            $.notyRenderer.init = function (options) {
                var notification = Object.create(NotyObject).init(options);
                (notification.options.force) ? $.noty.queue.unshift(notification): $.noty.queue.push(notification);
                $.notyRenderer.render();
                return ($.noty.returns == 'object') ? notification : notification.options.id;
            };
            $.notyRenderer.render = function () {
                var instance = $.noty.queue[0];
                if ($.type(instance) === 'object') {
                    if (instance.options.dismissQueue) {
                        $.notyRenderer.show($.noty.queue.shift());
                    } else {
                        if ($.noty.ontap) {
                            $.notyRenderer.show($.noty.queue.shift());
                            $.noty.ontap = false;
                        }
                    }
                } else {
                    $.noty.ontap = true;
                }
            };
            $.notyRenderer.show = function (notification) {
                if (notification.options.modal) {
                    $.notyRenderer.createModalFor(notification);
                    $.notyRenderer.setModalCount(+1);
                }
                if ($(notification.options.layout.container.selector).length == 0) {
                    if (notification.options.custom) {
                        notification.options.custom.append($(notification.options.layout.container.object).addClass('i-am-new'));
                    } else {
                        $('body').append($(notification.options.layout.container.object).addClass('i-am-new'));
                    }
                } else {
                    $(notification.options.layout.container.selector).removeClass('i-am-new');
                }
                $.notyRenderer.setLayoutCountFor(notification, +1);
                notification.show();
            };
            $.notyRenderer.createModalFor = function (notification) {
                if ($('.noty_modal').length == 0)
                    $('<div/>').addClass('noty_modal').data('noty_modal_count', 0).css(notification.options.theme.modal.css).prependTo($('body')).fadeIn('fast');
            };
            $.notyRenderer.getLayoutCountFor = function (notification) {
                return $(notification.options.layout.container.selector).data('noty_layout_count') || 0;
            };
            $.notyRenderer.setLayoutCountFor = function (notification, arg) {
                return $(notification.options.layout.container.selector).data('noty_layout_count', $.notyRenderer.getLayoutCountFor(notification) + arg);
            };
            $.notyRenderer.getModalCount = function () {
                return $('.noty_modal').data('noty_modal_count') || 0;
            };
            $.notyRenderer.setModalCount = function (arg) {
                return $('.noty_modal').data('noty_modal_count', $.notyRenderer.getModalCount() + arg);
            };
            $.fn.noty = function (options) {
                options.custom = $(this);
                return $.notyRenderer.init(options);
            };
            $.noty = {};
            $.noty.queue = [];
            $.noty.ontap = true;
            $.noty.layouts = {};
            $.noty.themes = {};
            $.noty.returns = 'object';
            $.noty.store = {};
            $.noty.get = function (id) {
                return $.noty.store.hasOwnProperty(id) ? $.noty.store[id] : false;
            };
            $.noty.close = function (id) {
                return $.noty.get(id) ? $.noty.get(id).close() : false;
            };
            $.noty.setText = function (id, text) {
                return $.noty.get(id) ? $.noty.get(id).setText(text) : false;
            };
            $.noty.setType = function (id, type) {
                return $.noty.get(id) ? $.noty.get(id).setType(type) : false;
            };
            $.noty.clearQueue = function () {
                $.noty.queue = [];
            };
            $.noty.closeAll = function () {
                $.noty.clearQueue();
                $.each($.noty.store, function (id, noty) {
                    noty.close();
                });
            };
            var windowAlert = window.alert;
            $.noty.consumeAlert = function (options) {
                window.alert = function (text) {
                    if (options)
                        options.text = text;
                    else
                        options = {
                            text: text
                        };
                    $.notyRenderer.init(options);
                };
            };
            $.noty.stopConsumeAlert = function () {
                window.alert = windowAlert;
            };
            $.noty.defaults = {
                layout: 'top',
                theme: 'defaultTheme',
                type: 'alert',
                text: '',
                dismissQueue: true,
                template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
                animation: {
                    open: {
                        height: 'toggle'
                    },
                    close: {
                        height: 'toggle'
                    },
                    easing: 'swing',
                    speed: 500
                },
                timeout: false,
                force: false,
                modal: false,
                closeWith: ['click'],
                callback: {
                    onShow: function () {},
                    afterShow: function () {},
                    onClose: function () {},
                    afterClose: function () {}
                },
                buttons: false
            };
            $(window).resize(function () {
                $.each($.noty.layouts, function (index, layout) {
                    layout.container.style.apply($(layout.container.selector));
                });
            });
        })(jQuery);

        function noty(options) {
            var using_old = 0,
                old_to_new = {
                    'animateOpen': 'animation.open',
                    'animateClose': 'animation.close',
                    'easing': 'animation.easing',
                    'speed': 'animation.speed',
                    'onShow': 'callback.onShow',
                    'onShown': 'callback.afterShow',
                    'onClose': 'callback.onClose',
                    'onClosed': 'callback.afterClose'
                };
            jQuery.each(options, function (key, value) {
                if (old_to_new[key]) {
                    using_old++;
                    var _new = old_to_new[key].split('.');
                    if (!options[_new[0]]) options[_new[0]] = {};
                    options[_new[0]][_new[1]] = (value) ? value : function () {};
                    delete options[key];
                }
            });
            if (!options.closeWith) {
                options.closeWith = jQuery.noty.defaults.closeWith;
            }
            if (options.hasOwnProperty('closeButton')) {
                using_old++;
                if (options.closeButton) options.closeWith.push('button');
                delete options.closeButton;
            }
            if (options.hasOwnProperty('closeOnSelfClick')) {
                using_old++;
                if (options.closeOnSelfClick) options.closeWith.push('click');
                delete options.closeOnSelfClick;
            }
            if (options.hasOwnProperty('closeOnSelfOver')) {
                using_old++;
                if (options.closeOnSelfOver) options.closeWith.push('hover');
                delete options.closeOnSelfOver;
            }
            if (options.hasOwnProperty('custom')) {
                using_old++;
                if (options.custom.container != 'null') options.custom = options.custom.container;
            }
            if (options.hasOwnProperty('cssPrefix')) {
                using_old++;
                delete options.cssPrefix;
            }
            if (options.theme == 'noty_theme_default') {
                using_old++;
                options.theme = 'defaultTheme';
            }
            if (!options.hasOwnProperty('dismissQueue')) {
                if (options.layout == 'topLeft' || options.layout == 'topRight' || options.layout == 'bottomLeft' || options.layout == 'bottomRight') {
                    options.dismissQueue = true;
                } else {
                    options.dismissQueue = false;
                }
            }
            if (options.buttons) {
                jQuery.each(options.buttons, function (i, button) {
                    if (button.click) {
                        using_old++;
                        button.onClick = button.click;
                        delete button.click;
                    }
                    if (button.type) {
                        using_old++;
                        button.addClass = button.type;
                        delete button.type;
                    }
                });
            }
            if (using_old) {
                if (typeof console !== "undefined" && console.warn) {
                    console.warn('You are using noty v2 with v1.x.x options. @deprecated until v2.2.0 - Please update your options.');
                }
            }
            return jQuery.notyRenderer.init(options);
        };;
        (function ($) {
            $.noty.layouts.top = {
                name: 'top',
                options: {},
                container: {
                    object: '<ul id="noty_top_layout_container" />',
                    selector: 'ul#noty_top_layout_container',
                    style: function () {
                        $(this).css({
                            top: 0,
                            left: '5%',
                            position: 'fixed',
                            width: '90%',
                            height: 'auto',
                            margin: 0,
                            padding: 0,
                            listStyleType: 'none',
                            zIndex: 9999999
                        });
                    }
                },
                parent: {
                    object: '<li />',
                    selector: 'li',
                    css: {}
                },
                css: {
                    display: 'none'
                },
                addClass: ''
            };
        })(jQuery);;;
        (function ($) {
            $.noty.layouts.inline = {
                name: 'inline',
                options: {},
                container: {
                    object: '<ul id="noty_inline_layout_container" />',
                    selector: 'ul#noty_inline_layout_container',
                    style: function () {
                        $(this).css({
                            width: '100%',
                            height: 'auto',
                            margin: 0,
                            padding: 0,
                            listStyleType: 'none',
                            zIndex: 9999999
                        });
                    }
                },
                parent: {
                    object: '<li />',
                    selector: 'li',
                    css: {}
                },
                css: {
                    display: 'none'
                },
                addClass: ''
            };
        })(jQuery);;;
        (function ($) {
            $.noty.layouts.topRight = {
                name: 'topRight',
                options: {},
                container: {
                    object: '<ul id="noty_topRight_layout_container" />',
                    selector: 'ul#noty_topRight_layout_container',
                    style: function () {
                        $(this).css({
                            top: 20,
                            right: 20,
                            position: 'fixed',
                            width: '310px',
                            height: 'auto',
                            margin: 0,
                            padding: 0,
                            listStyleType: 'none',
                            zIndex: 10000000
                        });
                        if (window.innerWidth < 600) {
                            $(this).css({
                                right: 5
                            });
                        }
                    }
                },
                parent: {
                    object: '<li />',
                    selector: 'li',
                    css: {}
                },
                css: {
                    display: 'none',
                    width: '310px'
                },
                addClass: ''
            };
        })(jQuery);;;
        (function ($) {
            $.noty.layouts.center = {
                name: 'center',
                options: {},
                container: {
                    object: '<ul id="noty_center_layout_container" />',
                    selector: 'ul#noty_center_layout_container',
                    style: function () {
                        $(this).css({
                            position: 'fixed',
                            width: '310px',
                            height: 'auto',
                            margin: 0,
                            padding: 0,
                            listStyleType: 'none',
                            zIndex: 10000000
                        });
                        var dupe = $(this).clone().css({
                            visibility: "hidden",
                            display: "block",
                            position: "absolute",
                            top: 0,
                            left: 0
                        }).attr('id', 'dupe');
                        $("body").append(dupe);
                        dupe.find('.i-am-closing-now').remove();
                        dupe.find('li').css('display', 'block');
                        var actual_height = dupe.height();
                        dupe.remove();
                        if ($(this).hasClass('i-am-new')) {
                            $(this).css({
                                left: ($(window).width() - $(this).outerWidth(false)) / 2 + 'px',
                                top: ($(window).height() - actual_height) / 2 + 'px'
                            });
                        } else {
                            $(this).animate({
                                left: ($(window).width() - $(this).outerWidth(false)) / 2 + 'px',
                                top: ($(window).height() - actual_height) / 2 + 'px'
                            }, 500);
                        }
                    }
                },
                parent: {
                    object: '<li />',
                    selector: 'li',
                    css: {}
                },
                css: {
                    display: 'none',
                    width: '310px'
                },
                addClass: ''
            };
        })(jQuery);;;
        (function ($) {
            $.noty.themes.defaultTheme = {
                name: 'defaultTheme',
                helpers: {
                    borderFix: function () {
                        if (this.options.dismissQueue) {
                            var selector = this.options.layout.container.selector + ' ' + this.options.layout.parent.selector;
                            switch (this.options.layout.name) {
                            case 'top':
                                $(selector).css({
                                    borderRadius: '0px 0px 0px 0px'
                                });
                                $(selector).last().css({
                                    borderRadius: '0px 0px 5px 5px'
                                });
                                break;
                            case 'topCenter':
                            case 'topLeft':
                            case 'topRight':
                            case 'bottomCenter':
                            case 'bottomLeft':
                            case 'bottomRight':
                            case 'center':
                            case 'centerLeft':
                            case 'centerRight':
                            case 'inline':
                                $(selector).css({
                                    borderRadius: '0px 0px 0px 0px'
                                });
                                $(selector).first().css({
                                    'border-top-left-radius': '5px',
                                    'border-top-right-radius': '5px'
                                });
                                $(selector).last().css({
                                    'border-bottom-left-radius': '5px',
                                    'border-bottom-right-radius': '5px'
                                });
                                break;
                            case 'bottom':
                                $(selector).css({
                                    borderRadius: '0px 0px 0px 0px'
                                });
                                $(selector).first().css({
                                    borderRadius: '5px 5px 0px 0px'
                                });
                                break;
                            default:
                                break;
                            }
                        }
                    }
                },
                modal: {
                    css: {
                        position: 'fixed',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#000',
                        zIndex: 10000,
                        opacity: 0.6,
                        display: 'none',
                        left: 0,
                        top: 0
                    }
                },
                style: function () {
                    this.$bar.css({
                        overflow: 'hidden',
                        background: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAoCAYAAAAPOoFWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAPZJREFUeNq81tsOgjAMANB2ov7/7ypaN7IlIwi9rGuT8QSc9EIDAsAznxvY4pXPKr05RUE5MEVB+TyWfCEl9LZApYopCmo9C4FKSMtYoI8Bwv79aQJU4l6hXXCZrQbokJEksxHo9KMOgc6w1atHXM8K9DVC7FQnJ0i8iK3QooGgbnyKgMDygBWyYFZoqx4qS27KqLZJjA1D0jK6QJcYEQEiWv9PGkTsbqxQ8oT+ZtZB6AkdsJnQDnMoHXHLGKOgDYuCWmYhEERCI5gaamW0bnHdA3k2ltlIN+2qKRyCND0bhqSYCyTB3CAOc4WusBEIpkeBuPgJMAAX8Hs1NfqHRgAAAABJRU5ErkJggg==') repeat-x scroll left top #fff"
                    });
                    this.$message.css({
                        fontSize: '13px',
                        lineHeight: '16px',
                        textAlign: 'center',
                        padding: '8px 10px 9px',
                        width: 'auto',
                        position: 'relative'
                    });
                    this.$closeButton.css({
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 10,
                        height: 10,
                        background: "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAATpJREFUeNoszrFqVFEUheG19zlz7sQ7ijMQBAvfYBqbpJCoZSAQbOwEE1IHGytbLQUJ8SUktW8gCCFJMSGSNxCmFBJO7j5rpXD6n5/P5vM53H3b3T9LOiB5AQDuDjM7BnA7DMPHDGBH0nuSzwHsRcRVRNRSysuU0i6AOwA/02w2+9Fae00SEbEh6SGAR5K+k3zWWptKepCm0+kpyRoRGyRBcpPkDsn1iEBr7drdP2VJZyQXERGSPpiZAViTBACXKaV9kqd5uVzCzO5KKb/d/UZSDwD/eyxqree1VqSu6zKAF2Z2RPJJaw0rAkjOJT0m+SuT/AbgDcmnkmBmfwAsJL1dXQ8lWY6IGwB1ZbrOOb8zs8thGP4COFwx/mE8Ho9Go9ErMzvJOW/1fY/JZIJSypqZfXX3L13X9fcDAKJct1sx3OiuAAAAAElFTkSuQmCC)",
                        display: 'none',
                        cursor: 'pointer'
                    });
                    this.$buttons.css({
                        padding: 5,
                        textAlign: 'right',
                        borderTop: '1px solid #ccc',
                        backgroundColor: '#fff'
                    });
                    this.$buttons.find('button').css({
                        marginLeft: 5
                    });
                    this.$buttons.find('button:first').css({
                        marginLeft: 0
                    });
                    this.$bar.bind({
                        mouseenter: function () {
                            $(this).find('.noty_close').fadeIn();
                        },
                        mouseleave: function () {
                            $(this).find('.noty_close').fadeOut();
                        }
                    });
                    switch (this.options.layout.name) {
                    case 'top':
                        this.$bar.css({
                            borderRadius: '0px 0px 5px 5px',
                            borderBottom: '2px solid #eee',
                            borderLeft: '2px solid #eee',
                            borderRight: '2px solid #eee',
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                        });
                        break;
                    case 'topCenter':
                    case 'center':
                    case 'bottomCenter':
                    case 'inline':
                        this.$bar.css({
                            borderRadius: '5px',
                            border: '1px solid #eee',
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                        });
                        this.$message.css({
                            fontSize: '13px',
                            textAlign: 'center'
                        });
                        break;
                    case 'topLeft':
                    case 'topRight':
                    case 'bottomLeft':
                    case 'bottomRight':
                    case 'centerLeft':
                    case 'centerRight':
                        this.$bar.css({
                            borderRadius: '5px',
                            border: '1px solid #eee',
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                        });
                        this.$message.css({
                            fontSize: '13px',
                            textAlign: 'left'
                        });
                        break;
                    case 'bottom':
                        this.$bar.css({
                            borderRadius: '5px 5px 0px 0px',
                            borderTop: '2px solid #eee',
                            borderLeft: '2px solid #eee',
                            borderRight: '2px solid #eee',
                            boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)"
                        });
                        break;
                    default:
                        this.$bar.css({
                            border: '2px solid #eee',
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                        });
                        break;
                    }
                    switch (this.options.type) {
                    case 'alert':
                    case 'notification':
                        this.$bar.css({
                            backgroundColor: '#FFF',
                            borderColor: '#CCC',
                            color: '#444'
                        });
                        break;
                    case 'warning':
                        this.$bar.css({
                            backgroundColor: '#FFEAA8',
                            borderColor: '#FFC237',
                            color: '#826200'
                        });
                        this.$buttons.css({
                            borderTop: '1px solid #FFC237'
                        });
                        break;
                    case 'error':
                        this.$bar.css({
                            backgroundColor: 'red',
                            borderColor: 'darkred',
                            color: '#FFF'
                        });
                        this.$message.css({
                            fontWeight: 'bold'
                        });
                        this.$buttons.css({
                            borderTop: '1px solid darkred'
                        });
                        break;
                    case 'information':
                        this.$bar.css({
                            backgroundColor: '#57B7E2',
                            borderColor: '#0B90C4',
                            color: '#FFF'
                        });
                        this.$buttons.css({
                            borderTop: '1px solid #0B90C4'
                        });
                        break;
                    case 'success':
                        this.$bar.css({
                            backgroundColor: 'lightgreen',
                            borderColor: '#50C24E',
                            color: 'darkgreen'
                        });
                        this.$buttons.css({
                            borderTop: '1px solid #50C24E'
                        });
                        break;
                    default:
                        this.$bar.css({
                            backgroundColor: '#FFF',
                            borderColor: '#CCC',
                            color: '#444'
                        });
                        break;
                    }
                },
                callback: {
                    onShow: function () {
                        $.noty.themes.defaultTheme.helpers.borderFix.apply(this);
                    },
                    onClose: function () {
                        $.noty.themes.defaultTheme.helpers.borderFix.apply(this);
                    }
                }
            };
        })(jQuery);;
        (function ($) {
            var domain = 'tvfedor.ru',
                httpDomain = 'http://' + domain,
                bookmarklet = {
                    init: function () {
                        var dfd = $.Deferred();
                        this.hello().bindEvents().loadIframe(dfd);
                        return dfd.promise();
                    },
                    iframeAttrs: {
                        name: 'fedor',
                        src: 'http://' + domain + '/bookmarklet',
                        css: {
                            position: 'absolute',
                            left: '-10000px',
                            width: 10,
                            height: 10
                        }
                    },
                    loadIframe: function (dfd) {
                        var _this = this;
                        $('<iframe />', this.iframeAttrs).appendTo('body').load(function () {
                            _this._iframe = (this.contentWindow || this.contentDocument);
                            _this._init = true;
                            dfd.resolve();
                        });
                        return this;
                    },
                    bindEvents: function () {
                        $(window).off('message').on('message', $.proxy(this._onMessage, this));
                        return this;
                    },
                    exec: function () {
                        this._iframe.postMessage('ping', httpDomain);
                        return this;
                    },
                    hello: function () {
                        noty({
                            text: 'Connected to tvfedor.ru!',
                            type: 'success',
                            layout: 'topRight',
                            timeout: 3500
                        });
                        return this;
                    },
                    checkOrigin: function (e) {
                        return e.origin === httpDomain;
                    },
                    _onMessage: function (e) {
                        e = e.originalEvent;
                        if (!this.checkOrigin(e))
                            return;
                        this.messageController(e);
                    },
                    _onPong: function (source) {
                        noty({
                            text: 'Sending feed to tvfedor.ru...',
                            type: 'info',
                            layout: 'topRight',
                            timeout: 2000
                        });
                        this.addFeed(source);
                    },
                    _onFeedAdded: function (source, data) {
                        noty({
                            text: 'tvfedor.ru: ' + data.response,
                            type: data.type,
                            layout: 'topRight',
                            timeout: 5000
                        });
                    },
                    _onAuth: function (source, data) {
                        noty({
                            text: 'tvfedor.ru: ' + data.response,
                            type: 'warning',
                            layout: 'topRight'
                        });
                    },
                    messageController: function (e) {
                        e.data === 'pong' && this._onPong(e.source, e.data);
                        e.data.action === 'auth' && this._onAuth(e.source, e.data);
                        e.data.action === 'feedAdded' && this._onFeedAdded(e.source, e.data.json);
                    },
                    addFeed: function (source) {
                        source.postMessage({
                            action: 'add',
                            title: document.title,
                            feed: location.toString()
                        }, httpDomain)
                    }
                };
            location.hostname !== domain && (window._tvfedor_bookmarklet = function () {
                bookmarklet._init || bookmarklet.init().done(function () {
                    bookmarklet.exec();
                });
                bookmarklet._init && bookmarklet.exec();
            });
            location.hostname === domain && (window._tvfedor_bookmarklet = function () {
                console.log('Рекурсия же!');
            });
        }(jQuery));
        (function (options) {
            window._tvfedor_bookmarklet || loadJQuery(options.jquery, function () {
                window._tvfedor_bookmarklet();
            });
            window._tvfedor_bookmarklet && window._tvfedor_bookmarklet();

            function loadJQuery(url, onload) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url;
                script.onload = onload;
                document.body.appendChild(script);
            }
        }({
            jquery: 'http://yandex.st/jquery/1.8.3/jquery.min.js'
        }));
    }

    place.insertBefore(our, place.firstElementChild);
}