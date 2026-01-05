// ==UserScript==
// @name         Better Taringo Alpha
// @namespace    https://github.com/doorgan/BetterTaringo/
// @version      0.2.29
// @description  Mejora Taringa!
// @author       Dorgan
// @match        http://www.taringa.net/*
// @match        https://www.taringa.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22046/Better%20Taringo%20Alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/22046/Better%20Taringo%20Alpha.meta.js
// ==/UserScript==

/*! vex.js, vex.dialog.js 2.3.3 */
(function(){var a;a=function(a){var b,c;return b=!1,a(function(){var d;return d=(document.body||document.documentElement).style,b=void 0!==d.animation||void 0!==d.WebkitAnimation||void 0!==d.MozAnimation||void 0!==d.MsAnimation||void 0!==d.OAnimation,a(window).bind("keyup.vex",function(a){return 27===a.keyCode?c.closeByEscape():void 0})}),c={globalID:1,animationEndEvent:"animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend",baseClassNames:{vex:"vex",content:"vex-content",overlay:"vex-overlay",close:"vex-close",closing:"vex-closing",open:"vex-open"},defaultOptions:{content:"",showCloseButton:!0,escapeButtonCloses:!0,overlayClosesOnClick:!0,appendLocation:"body",className:"",css:{},overlayClassName:"",overlayCSS:{},contentClassName:"",contentCSS:{},closeClassName:"",closeCSS:{}},open:function(b){return b=a.extend({},c.defaultOptions,b),b.id=c.globalID,c.globalID+=1,b.$vex=a("<div>").addClass(c.baseClassNames.vex).addClass(b.className).css(b.css).data({vex:b}),b.$vexOverlay=a("<div>").addClass(c.baseClassNames.overlay).addClass(b.overlayClassName).css(b.overlayCSS).data({vex:b}),b.overlayClosesOnClick&&b.$vexOverlay.bind("click.vex",function(b){return b.target===this?c.close(a(this).data().vex.id):void 0}),b.$vex.append(b.$vexOverlay),b.$vexContent=a("<div>").addClass(c.baseClassNames.content).addClass(b.contentClassName).css(b.contentCSS).append(b.content).data({vex:b}),b.$vex.append(b.$vexContent),b.showCloseButton&&(b.$closeButton=a("<div>").addClass(c.baseClassNames.close).addClass(b.closeClassName).css(b.closeCSS).data({vex:b}).bind("click.vex",function(){return c.close(a(this).data().vex.id)}),b.$vexContent.append(b.$closeButton)),a(b.appendLocation).append(b.$vex),c.setupBodyClassName(b.$vex),b.afterOpen&&b.afterOpen(b.$vexContent,b),setTimeout(function(){return b.$vexContent.trigger("vexOpen",b)},0),b.$vexContent},getSelectorFromBaseClass:function(a){return"."+a.split(" ").join(".")},getAllVexes:function(){return a("."+c.baseClassNames.vex+':not(".'+c.baseClassNames.closing+'") '+c.getSelectorFromBaseClass(c.baseClassNames.content))},getVexByID:function(b){return c.getAllVexes().filter(function(){return a(this).data().vex.id===b})},close:function(a){var b;if(!a){if(b=c.getAllVexes().last(),!b.length)return!1;a=b.data().vex.id}return c.closeByID(a)},closeAll:function(){var b;return b=c.getAllVexes().map(function(){return a(this).data().vex.id}).toArray(),(null!=b?b.length:void 0)?(a.each(b.reverse(),function(a,b){return c.closeByID(b)}),!0):!1},closeByID:function(d){var e,f,g,h,i,j;return f=c.getVexByID(d),f.length?(e=f.data().vex.$vex,j=a.extend({},f.data().vex),g=function(){return j.beforeClose?j.beforeClose(f,j):void 0},h=function(){return f.trigger("vexClose",j),e.remove(),a("body").trigger("vexAfterClose",j),j.afterClose?j.afterClose(f,j):void 0},i="none"!==f.css("animationName")&&"0s"!==f.css("animationDuration"),b&&i?g()!==!1&&e.unbind(c.animationEndEvent).bind(c.animationEndEvent,function(){return h()}).addClass(c.baseClassNames.closing):g()!==!1&&h(),!0):void 0},closeByEscape:function(){var b,d,e;return e=c.getAllVexes().map(function(){return a(this).data().vex.id}).toArray(),(null!=e?e.length:void 0)?(d=Math.max.apply(Math,e),b=c.getVexByID(d),b.data().vex.escapeButtonCloses!==!0?!1:c.closeByID(d)):!1},setupBodyClassName:function(b){return a("body").bind("vexOpen.vex",function(){return a("body").addClass(c.baseClassNames.open)}).bind("vexAfterClose.vex",function(){return c.getAllVexes().length?void 0:a("body").removeClass(c.baseClassNames.open)})},hideLoading:function(){return a(".vex-loading-spinner").remove()},showLoading:function(){return c.hideLoading(),a("body").append('<div class="vex-loading-spinner '+c.defaultOptions.className+'"></div>')}}},"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a(require("jquery")):window.vex=a(jQuery)}).call(this),function(){var a;a=function(a,b){var c,d;return null==b?a.error("Vex is required to use vex.dialog"):(c=function(b){var c;return c={},a.each(b.serializeArray(),function(){return c[this.name]?(c[this.name].push||(c[this.name]=[c[this.name]]),c[this.name].push(this.value||"")):c[this.name]=this.value||""}),c},d={},d.buttons={YES:{text:"OK",type:"submit",className:"vex-dialog-button-primary"},NO:{text:"Cancel",type:"button",className:"vex-dialog-button-secondary",click:function(a,c){return a.data().vex.value=!1,b.close(a.data().vex.id)}}},d.defaultOptions={callback:function(a){},afterOpen:function(){},message:"Message",input:'<input name="vex" type="hidden" value="_vex-empty-value" />',value:!1,buttons:[d.buttons.YES,d.buttons.NO],showCloseButton:!1,onSubmit:function(e){var f,g;return f=a(this),g=f.parent(),e.preventDefault(),e.stopPropagation(),g.data().vex.value=d.getFormValueOnSubmit(c(f)),b.close(g.data().vex.id)},focusFirstInput:!0},d.defaultAlertOptions={message:"Alert",buttons:[d.buttons.YES]},d.defaultConfirmOptions={message:"Confirm"},d.open=function(c){var e,f;return c=a.extend({},b.defaultOptions,d.defaultOptions,c),c.content=d.buildDialogForm(c),f=c.beforeClose,c.beforeClose=function(a,b){return c.callback(b.value),"function"==typeof f?f(a,b):void 0},e=b.open(c),c.focusFirstInput&&e.find('button[type="submit"], button[type="button"], input[type="submit"], input[type="button"], textarea, input[type="date"], input[type="datetime"], input[type="datetime-local"], input[type="email"], input[type="month"], input[type="number"], input[type="password"], input[type="search"], input[type="tel"], input[type="text"], input[type="time"], input[type="url"], input[type="week"]').first().focus(),e},d.alert=function(b){return"string"==typeof b&&(b={message:b}),b=a.extend({},d.defaultAlertOptions,b),d.open(b)},d.confirm=function(b){return"string"==typeof b?a.error("dialog.confirm(options) requires options.callback."):(b=a.extend({},d.defaultConfirmOptions,b),d.open(b))},d.prompt=function(b){var c;return"string"==typeof b?a.error("dialog.prompt(options) requires options.callback."):(c={message:'<label for="vex">'+(b.label||"Prompt:")+"</label>",input:'<input name="vex" type="text" class="vex-dialog-prompt-input" placeholder="'+(b.placeholder||"")+'"  value="'+(b.value||"")+'" />'},b=a.extend({},c,b),d.open(b))},d.buildDialogForm=function(b){var c,e,f;return c=a('<form class="vex-dialog-form" />'),f=a('<div class="vex-dialog-message" />'),e=a('<div class="vex-dialog-input" />'),c.append(f.append(b.message)).append(e.append(b.input)).append(d.buttonsToDOM(b.buttons)).bind("submit.vex",b.onSubmit),c},d.getFormValueOnSubmit=function(a){return a.vex||""===a.vex?"_vex-empty-value"===a.vex?!0:a.vex:a},d.buttonsToDOM=function(c){var d;return d=a('<div class="vex-dialog-buttons" />'),a.each(c,function(e,f){var g;return g=a('<button type="'+f.type+'"></button>').text(f.text).addClass(f.className+" vex-dialog-button "+(0===e?"vex-first ":"")+(e===c.length-1?"vex-last ":"")).bind("click.vex",function(c){return f.click?f.click(a(this).parents(b.getSelectorFromBaseClass(b.baseClassNames.content)),c):void 0}),g.appendTo(d)}),d},d)},"function"==typeof define&&define.amd?define(["jquery","vex"],a):"object"==typeof exports?module.exports=a(require("jquery"),require("./vex.js")):window.vex.dialog=a(window.jQuery,window.vex)}.call(this);

/*
jquery-circle-progress - jQuery Plugin to draw animated circular progress bars

URL: http://kottenator.github.io/jquery-circle-progress/
Author: Rostyslav Bryzgunov <kottenator@gmail.com>
Version: 1.1.3
License: MIT
*/
(function($) {
    function CircleProgress(config) {
        this.init(config);
    }

    CircleProgress.prototype = {
        //----------------------------------------------- public options -----------------------------------------------
        /**
         * This is the only required option. It should be from 0.0 to 1.0
         * @type {number}
         */
        value: 0.0,

        /**
         * Size of the circle / canvas in pixels
         * @type {number}
         */
        size: 100.0,

        /**
         * Initial angle for 0.0 value in radians
         * @type {number}
         */
        startAngle: -Math.PI,

        /**
         * Width of the arc. By default it's auto-calculated as 1/14 of size, but you may set it explicitly in pixels
         * @type {number|string}
         */
        thickness: 'auto',

        /**
         * Fill of the arc. You may set it to:
         *   - solid color:
         *     - { color: '#3aeabb' }
         *     - { color: 'rgba(255, 255, 255, .3)' }
         *   - linear gradient (left to right):
         *     - { gradient: ['#3aeabb', '#fdd250'], gradientAngle: Math.PI / 4 }
         *     - { gradient: ['red', 'green', 'blue'], gradientDirection: [x0, y0, x1, y1] }
         *   - image:
         *     - { image: 'http://i.imgur.com/pT0i89v.png' }
         *     - { image: imageObject }
         *     - { color: 'lime', image: 'http://i.imgur.com/pT0i89v.png' } - color displayed until the image is loaded
         */
        fill: {
            gradient: ['#3aeabb', '#fdd250']
        },

        /**
         * Color of the "empty" arc. Only a color fill supported by now
         * @type {string}
         */
        emptyFill: 'rgba(0, 0, 0, .1)',

        /**
         * Animation config (see jQuery animations: http://api.jquery.com/animate/)
         */
        animation: {
            duration: 1200,
            easing: 'circleProgressEasing'
        },

        /**
         * Default animation starts at 0.0 and ends at specified `value`. Let's call this direct animation.
         * If you want to make reversed animation then you should set `animationStartValue` to 1.0.
         * Also you may specify any other value from 0.0 to 1.0
         * @type {number}
         */
        animationStartValue: 0.0,

        /**
         * Reverse animation and arc draw
         * @type {boolean}
         */
        reverse: false,

        /**
         * Arc line cap ('butt', 'round' or 'square')
         * Read more: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.lineCap
         * @type {string}
         */
        lineCap: 'butt',

        //-------------------------------------- protected properties and methods --------------------------------------
        /**
         * @protected
         */
        constructor: CircleProgress,

        /**
         * Container element. Should be passed into constructor config
         * @protected
         * @type {jQuery}
         */
        el: null,

        /**
         * Canvas element. Automatically generated and prepended to the {@link CircleProgress.el container}
         * @protected
         * @type {HTMLCanvasElement}
         */
        canvas: null,

        /**
         * 2D-context of the {@link CircleProgress.canvas canvas}
         * @protected
         * @type {CanvasRenderingContext2D}
         */
        ctx: null,

        /**
         * Radius of the outer circle. Automatically calculated as {@link CircleProgress.size} / 2
         * @protected
         * @type {number}
         */
        radius: 0.0,

        /**
         * Fill of the main arc. Automatically calculated, depending on {@link CircleProgress.fill} option
         * @protected
         * @type {string|CanvasGradient|CanvasPattern}
         */
        arcFill: null,

        /**
         * Last rendered frame value
         * @protected
         * @type {number}
         */
        lastFrameValue: 0.0,

        /**
         * Init/re-init the widget
         * @param {object} config - Config
         */
        init: function(config) {
            $.extend(this, config);
            this.radius = this.size / 2;
            this.initWidget();
            this.initFill();
            this.draw();
        },

        /**
         * @protected
         */
        initWidget: function() {
            var canvas = this.canvas = this.canvas || $('<canvas>').prependTo(this.el)[0];
            canvas.width = this.size;
            canvas.height = this.size;
            this.ctx = canvas.getContext('2d');
        },

        /**
         * This method sets {@link CircleProgress.arcFill}
         * It could do this async (on image load)
         * @protected
         */
        initFill: function() {
            var self = this,
                fill = this.fill,
                ctx = this.ctx,
                size = this.size;

            if (!fill)
                throw Error("The fill is not specified!");

            if (fill.color)
                this.arcFill = fill.color;

            if (fill.gradient) {
                var gr = fill.gradient;

                if (gr.length == 1) {
                    this.arcFill = gr[0];
                } else if (gr.length > 1) {
                    var ga = fill.gradientAngle || 0, // gradient direction angle; 0 by default
                        gd = fill.gradientDirection || [
                            size / 2 * (1 - Math.cos(ga)), // x0
                            size / 2 * (1 + Math.sin(ga)), // y0
                            size / 2 * (1 + Math.cos(ga)), // x1
                            size / 2 * (1 - Math.sin(ga))  // y1
                        ];

                    var lg = ctx.createLinearGradient.apply(ctx, gd);

                    for (var i = 0; i < gr.length; i++) {
                        var color = gr[i],
                            pos = i / (gr.length - 1);

                        if ($.isArray(color)) {
                            pos = color[1];
                            color = color[0];
                        }

                        lg.addColorStop(pos, color);
                    }

                    this.arcFill = lg;
                }
            }

            if (fill.image) {
                var img;

                if (fill.image instanceof Image) {
                    img = fill.image;
                } else {
                    img = new Image();
                    img.src = fill.image;
                }

                if (img.complete)
                    setImageFill();
                else
                    img.onload = setImageFill;
            }

            function setImageFill() {
                var bg = $('<canvas>')[0];
                bg.width = self.size;
                bg.height = self.size;
                bg.getContext('2d').drawImage(img, 0, 0, size, size);
                self.arcFill = self.ctx.createPattern(bg, 'no-repeat');
                self.drawFrame(self.lastFrameValue);
            }
        },

        draw: function() {
            if (this.animation)
                this.drawAnimated(this.value);
            else
                this.drawFrame(this.value);
        },

        /**
         * @protected
         * @param {number} v - Frame value
         */
        drawFrame: function(v) {
            this.lastFrameValue = v;
            this.ctx.clearRect(0, 0, this.size, this.size);
            this.drawEmptyArc(v);
            this.drawArc(v);
        },

        /**
         * @protected
         * @param {number} v - Frame value
         */
        drawArc: function(v) {
            var ctx = this.ctx,
                r = this.radius,
                t = this.getThickness(),
                a = this.startAngle;

            ctx.save();
            ctx.beginPath();

            if (!this.reverse) {
                ctx.arc(r, r, r - t / 2, a, a + Math.PI * 2 * v);
            } else {
                ctx.arc(r, r, r - t / 2, a - Math.PI * 2 * v, a);
            }

            ctx.lineWidth = t;
            ctx.lineCap = this.lineCap;
            ctx.strokeStyle = this.arcFill;
            ctx.stroke();
            ctx.restore();
        },

        /**
         * @protected
         * @param {number} v - Frame value
         */
        drawEmptyArc: function(v) {
            var ctx = this.ctx,
                r = this.radius,
                t = this.getThickness(),
                a = this.startAngle;

            if (v < 1) {
                ctx.save();
                ctx.beginPath();

                if (v <= 0) {
                    ctx.arc(r, r, r - t / 2, 0, Math.PI * 2);
                } else {
                    if (!this.reverse) {
                        ctx.arc(r, r, r - t / 2, a + Math.PI * 2 * v, a);
                    } else {
                        ctx.arc(r, r, r - t / 2, a, a - Math.PI * 2 * v);
                    }
                }

                ctx.lineWidth = t;
                ctx.strokeStyle = this.emptyFill;
                ctx.stroke();
                ctx.restore();
            }
        },

        /**
         * @protected
         * @param {number} v - Value
         */
        drawAnimated: function(v) {
            var self = this,
                el = this.el,
                canvas = $(this.canvas);

            // stop previous animation before new "start" event is triggered
            canvas.stop(true, false);
            el.trigger('circle-animation-start');

            canvas
                .css({ animationProgress: 0 })
                .animate({ animationProgress: 1 }, $.extend({}, this.animation, {
                    step: function (animationProgress) {
                        var stepValue = self.animationStartValue * (1 - animationProgress) + v * animationProgress;
                        self.drawFrame(stepValue);
                        el.trigger('circle-animation-progress', [animationProgress, stepValue]);
                    }
                }))
                .promise()
                .always(function() {
                    // trigger on both successful & failure animation end
                    el.trigger('circle-animation-end');
                });
        },

        /**
         * @protected
         * @returns {number}
         */
        getThickness: function() {
            return $.isNumeric(this.thickness) ? this.thickness : this.size / 14;
        },

        getValue: function() {
            return this.value;
        },

        setValue: function(newValue) {
            if (this.animation)
                this.animationStartValue = this.lastFrameValue;
            this.value = newValue;
            this.draw();
        }
    };

    //-------------------------------------------- Initiating jQuery plugin --------------------------------------------
    $.circleProgress = {
        // Default options (you may override them)
        defaults: CircleProgress.prototype
    };

    // ease-in-out-cubic
    $.easing.circleProgressEasing = function(x, t, b, c, d) {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    };

    /**
     * Draw animated circular progress bar.
     *
     * Appends <canvas> to the element or updates already appended one.
     *
     * If animated, throws 3 events:
     *
     *   - circle-animation-start(jqEvent)
     *   - circle-animation-progress(jqEvent, animationProgress, stepValue) - multiple event;
     *                                                                        animationProgress: from 0.0 to 1.0;
     *                                                                        stepValue: from 0.0 to value
     *   - circle-animation-end(jqEvent)
     *
     * @param configOrCommand - Config object or command name
     *     Example: { value: 0.75, size: 50, animation: false };
     *     you may set any public property (see above);
     *     `animation` may be set to false;
     *     you may use .circleProgress('widget') to get the canvas
     *     you may use .circleProgress('value', newValue) to dynamically update the value
     *
     * @param commandArgument - Some commands (like 'value') may require an argument
     */
    $.fn.circleProgress = function(configOrCommand, commandArgument) {
        var dataName = 'circle-progress',
            firstInstance = this.data(dataName);

        if (configOrCommand == 'widget') {
            if (!firstInstance)
                throw Error('Calling "widget" method on not initialized instance is forbidden');
            return firstInstance.canvas;
        }

        if (configOrCommand == 'value') {
            if (!firstInstance)
                throw Error('Calling "value" method on not initialized instance is forbidden');
            if (typeof commandArgument == 'undefined') {
                return firstInstance.getValue();
            } else {
                var newValue = arguments[1];
                return this.each(function() {
                    $(this).data(dataName).setValue(newValue);
                });
            }
        }

        return this.each(function() {
            var el = $(this),
                instance = el.data(dataName),
                config = $.isPlainObject(configOrCommand) ? configOrCommand : {};

            if (instance) {
                instance.init(config);
            } else {
                var initialConfig = $.extend({}, el.data());
                if (typeof initialConfig.fill == 'string')
                    initialConfig.fill = JSON.parse(initialConfig.fill);
                if (typeof initialConfig.animation == 'string')
                    initialConfig.animation = JSON.parse(initialConfig.animation);
                config = $.extend(initialConfig, config);
                config.el = el;
                instance = new CircleProgress(config);
                el.data(dataName, instance);
            }
        });
    };
})(jQuery);

/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false Mustache: true*/

(function defineMustache (global, factory) {
  if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
    factory(exports); // CommonJS
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], factory); // AMD
  } else {
    global.Mustache = {};
    factory(global.Mustache); // script, wsh, asp
  }
}(this, function mustacheFactory (mustache) {

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           **/
          while (value != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = hasProperty(value, names[index]);

            value = value[names[index++]];
          }
        } else {
          value = context.view[name];
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function render (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  mustache.name = 'mustache.js';
  mustache.version = '2.2.1';
  mustache.tags = [ '{{', '}}' ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function render (template, view, partials) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.,
  /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html (template, view, partials, send) {
    /*eslint-enable*/

    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

}));

/*!
 * EventEmitter v5.1.0 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */
(function(){"use strict";function t(){}function i(t,n){for(var e=t.length;e--;)if(t[e].listener===n)return e;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var e=t.prototype,r=this,s=r.EventEmitter;e.getListeners=function(n){var r,e,t=this._getEvents();if(n instanceof RegExp){r={};for(e in t)t.hasOwnProperty(e)&&n.test(e)&&(r[e]=t[e])}else r=t[n]||(t[n]=[]);return r},e.flattenListeners=function(t){var e,n=[];for(e=0;e<t.length;e+=1)n.push(t[e].listener);return n},e.getListenersAsObject=function(n){var e,t=this.getListeners(n);return t instanceof Array&&(e={},e[n]=t),e||t},e.addListener=function(r,e){var t,n=this.getListenersAsObject(r),s="object"==typeof e;for(t in n)n.hasOwnProperty(t)&&-1===i(n[t],e)&&n[t].push(s?e:{listener:e,once:!1});return this},e.on=n("addListener"),e.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},e.once=n("addOnceListener"),e.defineEvent=function(e){return this.getListeners(e),this},e.defineEvents=function(t){for(var e=0;e<t.length;e+=1)this.defineEvent(t[e]);return this},e.removeListener=function(r,s){var n,e,t=this.getListenersAsObject(r);for(e in t)t.hasOwnProperty(e)&&(n=i(t[e],s),-1!==n&&t[e].splice(n,1));return this},e.off=n("removeListener"),e.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},e.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},e.manipulateListeners=function(r,t,i){var e,n,s=r?this.removeListener:this.addListener,o=r?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(e=i.length;e--;)s.call(this,t,i[e]);else for(e in t)t.hasOwnProperty(e)&&(n=t[e])&&("function"==typeof n?s.call(this,e,n):o.call(this,e,n));return this},e.removeEvent=function(e){var t,r=typeof e,n=this._getEvents();if("string"===r)delete n[e];else if(e instanceof RegExp)for(t in n)n.hasOwnProperty(t)&&e.test(t)&&delete n[t];else delete this._events;return this},e.removeAllListeners=n("removeEvent"),e.emitEvent=function(n,u){var r,e,t,i,o,s=this.getListenersAsObject(n);for(i in s)if(s.hasOwnProperty(i))for(r=s[i].slice(0),t=0;t<r.length;t++)e=r[t],e.once===!0&&this.removeListener(n,e.listener),o=e.listener.apply(this,u||[]),o===this._getOnceReturnValue()&&this.removeListener(n,e.listener);return this},e.trigger=n("emitEvent"),e.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},e.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},e._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},e._getEvents=function(){return this._events||(this._events={})},t.noConflict=function(){return r.EventEmitter=s,t},"function"==typeof define&&define.amd?define(function(){return t}):"object"==typeof module&&module.exports?module.exports=t:r.EventEmitter=t}).call(this);

/**
 * Heir v3.0.0 - http://git.io/F87mKg
 * Oliver Caldwell - http://oli.me.uk/
 * Unlicense - http://unlicense.org/
 */

(function (name, root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    }
    else if (typeof exports === 'object') {
        module.exports = factory();
    }
    else {
        root[name] = factory();
    }
}('heir', this, function () {
    /*global define,module*/
    'use strict';

    var heir = {
        /**
         * Causes your desired class to inherit from a source class. This uses
         * prototypical inheritance so you can override methods without ruining
         * the parent class.
         *
         * This will alter the actual destination class though, it does not
         * create a new class.
         *
         * @param {Function} destination The target class for the inheritance.
         * @param {Function} source Class to inherit from.
         * @param {Boolean} addSuper Should we add the _super property to the prototype? Defaults to true.
         */
        inherit: function inherit(destination, source, addSuper) {
            var proto = destination.prototype = heir.createObject(source.prototype);
            proto.constructor = destination;

            if (addSuper || typeof addSuper === 'undefined') {
                destination._super = source.prototype;
            }
        },

        /**
         * Creates a new object with the source object nestled within its
         * prototype chain.
         *
         * @param {Object} source Method to insert into the new object's prototype.
         * @return {Object} An empty object with the source object in it's prototype chain.
         */
        createObject: Object.create || function createObject(source) {
            var Host = function () {};
            Host.prototype = source;
            return new Host();
        },

        /**
         * Mixes the specified object into your class. This can be used to add
         * certain capabilities and helper methods to a class that is already
         * inheriting from some other class. You can mix in as many object as
         * you want, but only inherit from one.
         *
         * These values are mixed into the actual prototype object of your
         * class, they are not added to the prototype chain like inherit.
         *
         * @param {Function} destination Class to mix the object into.
         * @param {Object} source Object to mix into the class.
         */
        mixin: function mixin(destination, source) {
            return heir.merge(destination.prototype, source);
        },

        /**
         * Merges one object into another, change the object in place.
         *
         * @param {Object} destination The destination for the merge.
         * @param {Object} source The source of the properties to merge.
         */
        merge: function merge(destination, source) {
            var key;

            for (key in source) {
                if (heir.hasOwn(source, key)) {
                    destination[key] = source[key];
                }
            }
        },

        /**
         * Shortcut for `Object.prototype.hasOwnProperty`.
         *
         * Uses `Object.prototype.hasOwnPropety` rather than
         * `object.hasOwnProperty` as it could be overwritten.
         *
         * @param {Object} object The object to check
         * @param {String} key The key to check for.
         * @return {Boolean} Does object have key as an own propety?
         */
        hasOwn: function hasOwn(object, key) {
            return Object.prototype.hasOwnProperty.call(object, key);
        }
    };

    return heir;
}));

function nFormatter(num, digits) {
  var si = [
    { value: 1E18, symbol: "E" },
    { value: 1E15, symbol: "P" },
    { value: 1E12, symbol: "T" },
    { value: 1E9,  symbol: "G" },
    { value: 1E6,  symbol: "M" },
    { value: 1E3,  symbol: "k" }
  ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/, i;
  for (i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }
  }
  return num.toFixed(digits).replace(rx, "$1");
}

jQuery.loadCSS = function(url) {
    if (!$('link[href="' + url + '"]').length)
        $('head').append('<link rel="stylesheet" type="text/css" href="' + url + '">');
}

var parseConfig = function(str) {
  var re = /<label>Intereses<\/label><strong>(.*?)<\/strong>/ig;
    var res = re.exec(str);
    if(!res) {
      res = [];
      res[1] = '';
    }
    var configString = res[1];
    var configArray = {};
    var configSemiArray = configString.split('&');
    for(var i = 0; i < configSemiArray.length; i++) {
      var valueSet = configSemiArray[i].split('=');
      if(!valueSet[1]) valueSet[1] = '';
      configArray[valueSet[0].toLowerCase()] = valueSet[1];
    }
    if(configArray.portada) configArray.portada = configArray.portada.replace(/\[|\]/g,'');
    return configArray;
}

function ValidURL(s) {
  var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  return regexp.test(s);
}

function AnimatecssPlay(el, x) {
  $(el).removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
    $(this).removeClass();
  });
};

// ==UserScript==
// @name         Mejor Taringo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mejora Taringa!
// @author       Dorgan
// @match        http://www.taringa.net/*
// @match        https://www.taringa.net/*
// @grant        none
// ==/UserScript==


var API = function () {};

API.likeShout = function(shoutid, owner, callback) {
	$.ajax({
		url: '/ajax/shout/vote',
		type: 'post',
		dataType: 'json',
		data: {
			key: global_data.user_key,
			owner: owner,
			uuid: shoutid,
			score: 1
		},
		success: function(res){
			callback(res);
		}
	});
};

API.addShoutFavorite = function (shoutid, owner, callback) {
	$.ajax({
		url: '/ajax/shout/favorite-add',
		type: 'post',
		dataType: 'json',
		data: {
			key: global_data.user_key,
			owner: owner,
			uuid: shoutid
		},
		success: function(res){
			callback(res);
		}
	});
};
API.delShoutFavorite = function (shoutid, owner, callback) {
	$.ajax({
		url: '/ajax/shout/favorite-del',
		type: 'post',
		dataType: 'json',
		data: {
			key: global_data.user_key,
			owner: owner,
			uuid: shoutid
		},
		success: function(res){
			callback(res);
		}
	});
};

API.reshout = function(shoutid, owner, callback) {
	$.ajax({
		url: '/ajax/shout/add',
		type: 'post',
		dataType: 'json',
		data: {
			key: global_data.user_key,
			parent_id: shoutid,
            parent_owner: owner
		},
		success: function(res) {
			callback(res);
		},
		error: function(xhr, status, error){
			callback(xhr);
		}
	});
};
API.ocultarShout = function(shoutid, unfollow, callback) {
	$.ajax({
		url: '/ajax/newsfeed/hide',
		type: 'post',
		dataType: 'json',
		data: {
			key: global_data.user_key,
			id: shoutid,
            unfollow: unfollow
		},
		success: function(res) {
			callback(res);
		}
	});
};

API.getUserInfo = function(userid, callback) {

	$.ajax({
		url: location.protocol+'//api.taringa.net/user/view/'+userid,
		type: 'GET',
		success: function(res){
			callback(res);
		}
	});
};
API.getUserStats = function(userid, callback) {

	$.ajax({
		url: location.protocol+'//api.taringa.net/user/stats/view/'+userid,
		method: 'GET',
		success: function(res){
			callback(res);
		}
	});
};

API.voteWallPost = function (id, wallId, callback) {
	$.ajax({
		url: '/ajax/wall/vote-post',
		type: 'post',
		dataType: 'json',
		data: {
			key: global_data.user_key,
			id: id,
			wallId: wallId,
			score: 1
		},
		success: function(res){
			callback(res);
		}
	});
};

API.getShoutActivity = function(shoutid, owner, page, callback) {
	$.ajax({
		url: '/ajax/shout/activity-get',
		type: 'post',
		data: {
			id: shoutid,
			owner: owner,
			page: !page ? 1 : page
		},
		dataType: 'json',
		success: function(res) {
			if(callback){
				callback(res);
			}
		}
    });
}

var Perfil = function () {
	this.profileNode = undefined;
};

Perfil.data = {};

Perfil.Start = function() {
	if(Perfil.getProfileInfo()){
		Perfil.render();
		Perfil.setPortada();
	}
};

Perfil.getProfileInfo = function() {
	// Buscamos el elemento del perfil del usuario
	this.profileNode = $('.perfil-data');
	if(!this.profileNode.length){
		// Si el perfil no está frenamos todo
		return false;
	}
	this.statsNode = $('#user-metadata-profile');

	// Conseguios el nick del usuario sacándolo de la url
	this.data.username = window.location.pathname.split('/')[1];

	// Conseguimos su avatar
	this.data.avatar = this.profileNode.find('.perfil-avatar img').attr('src');

	// Conseguimos su "nombre"
	this.data.nombre = this.profileNode.find('.perfil-info .name .fn').text();

	// Rango
	this.data.rango = this.statsNode.find('li').eq(0).find('.role').text();
	// Puntos
	this.data.puntos = this.statsNode.find('li').eq(1).find('strong').text();
	// Posts
	this.data.posts = this.statsNode.find('li').eq(2).find('strong').text();
	// Temas
	this.data.temas = this.statsNode.find('li').eq(4).find('strong').text();
	// Seguidores
	this.data.seguidores = this.statsNode.find('li.followers-count strong').text();

	// Karma
	var currentNode = 0;
	var karmaNode = $('#sidebar .box').eq(currentNode);
	if(karmaNode.find('a[title=Borrar]').length){
		currentNode++;
		karmaNode = $('#sidebar .box').eq(currentNode);
	}
	if(karmaNode.find('.social-list').length){
		currentNode++;
		karmaNode = $('#sidebar .box').eq(currentNode);
	}
	karmaNode.find('strong').remove();
	karmaNode.find('div.title').remove();
	this.data.karma = parseFloat(karmaNode.text().replace(',','.'));
	karmaNode.remove();
	return true;
};

Perfil.setPortada = function() {
	if(global_data && global_data.user) {
		var that = this;
		$.ajax({
			url:'/'+this.data.username+'/informacion',
			beforeSend:function(er,rr){
				rr.url='/'+that.data.username+'/informacion';
				er.setRequestHeader('X-Requested-With', {toString: function(){ return ''; }});
			},
			success:function(rev){
			    var config = parseConfig(rev);
			    if(!config.portada) return;
			    $('#portada').css('background-image', 'url("'+config.portada+'")');
			}
		});
	}
}

Perfil.render = function() {
	var rendered = Mustache.render(this.template, {
		username: this.data.username,
		nombre: this.data.nombre,
		avatar: this.data.avatar,
		puntos: this.data.puntos,
		posts: this.data.posts,
		temas: this.data.temas,
		seguidores: this.data.seguidores,
		karma: this.data.karma
	});
	$('#page > .v6').first().after(rendered);
	$('#page > .v6').eq(1).remove();
	this.profileNode.remove();
	this.statsNode.remove();
	$('#karma').circleProgress({
        value: (this.data.karma % 1),
        size: 160,
        thickness: 5,
        animation: {
        	duration: 2000
        },
        startAngle: -(Math.PI/2),
        fill: {
            color: 'rgba(21, 182, 255, 0.65)'
        }
    });
};

Perfil.initConfigMenu = function() {
	var that = this;
	this.loggedUser = $('.header.header-main .user-action .tool-profile span').text().replace(/ /g,'');
	$.ajax({
		url:'/'+this.loggedUser+'/informacion',
		beforeSend:function(er,rr){
			rr.url='/'+that.loggedUser+'/informacion';
			er.setRequestHeader('X-Requested-With', {toString: function(){ return ''; }});
		},
		success:function(rev){
		    var config = parseConfig(rev);
		    if(!config.portada || !ValidURL(config.portada)) {
		    	config.portada = 'https://secure.assets.tumblr.com/images/default_header/optica_pattern_08_640.png?_v=f0f055039bb6136b9661cf2227b535c2';
		    }
		    var configMenu = Mustache.render(that.configMenuTemplate, {
				portada: config.portada
			});
			$('#sidebar .tabbed-d').after(configMenu);
			$('.cambiar-portada').click(function(e){
				e.preventDefault();
				//$('input[type=file][name=portada]').click();
				that.cambiarPortada();
			});
		}
	});
}
Perfil.cambiarPortada = function() {
	vex.dialog.prompt({
		message: 'Inserte URL de la imagen de portada',
		placeholder: 'URL de la portada',
		callback: function(val) {
			if(val && ValidURL(val)) {
				$('.portada-preview').css('background-image', 'url("'+val+'")');
				var intereses = $('#mis_intereses');
				intereses.val('portada='+val);
				// Hacemos que todos puedan ver los intereses así cualquiera puede ver la portada
				$('select[name=mis_intereses_mostrar]').attr('value', 'todos');
				// Guardamos la sección de la portada
				cuenta.save(5,false);
				// Guardamos la configuración de privacidad de "mis intereses"
				cuenta.save(8);
			}
		}
	});
}

Perfil.configMenuTemplate =
"<div class='box' id='subir-portada'>\
	<div class='title'>\
		<h2>Portada</h2>\
	</div>\
	<div class='portada-preview' style='background-image: url(\"{{portada}}\");'>\
		<div class='cambiar-portada-wrapper'>\
			<a class='cambiar-portada'><i class='ion-ios-camera'></i></a>\
		</div>\
		<input type='file' name='portada' style='display:none;'>\
	</div>\
</div>"

Perfil.template =
	"<div id='portada'>"+
		"<div class='container'>"+
			"<div class='user-profile'>"+
				"<div class='user-wrapper'>"+
					"<div class='user-avatar'>"+
						"<div id='karma'>"+
							"<div id='karmaText'>"+
								"<span>EXP</span><br/>"+
								"<b>{{ karma }}</b>"+
							"</div>"+
						"</div>"+
						"<img src='{{ avatar }}'>"+
					"</div>"+
					"<div class='user-info'>"+
						"<h2 class='user-name'>{{ nombre }}</h2>"+
						"<ul class='bt-user-actions'>"+
							"<li>"+
								"<a href='' class='bt-btn bt-btn-profile'>Seguir</a>"+
							"</li>"+
							"<li>"+
								"<a href='/mensajes/a/{{ username }}' class='bt-btn bt-btn-profile'>Enviar mensaje</a>"+
							"</li>"+
						"</ul>"+
						"<ul class='user-stats'>"+
							"<li>"+
								"<div>"+
									"<b>{{ puntos }}</b>"+
									"<p>Puntos</p>"+
								"</div>"+
							"</li>"+
							"<li>"+
								"<div>"+
									"<b>{{ posts }}</b>"+
									"<p>Posts</p>"+
								"</div>"+
							"</li>"+
							"<li>"+
								"<div>"+
									"<b>{{ temas }}</b>"+
									"<p>Temas</p>"+
								"</div>"+
							"</li>"+
							"<li>"+
								"<div>"+
									"<b>{{ seguidores }}</b>"+
									"<p>Seguidores</p>"+
								"</div>"+
							"</li>"+
						"</ul>"+
					"</div>"+
				"</div>"+
			"</div>"+
		"</div>"+
	"</div>";

Perfil.userNavTemplate =
	'<ul class="user-nav module">\
		<li>\
			<a href="">\
				Actividad\
			</a>\
		</li>\
		<li>\
			<a href="">\
				Información\
			</a>\
		</li>\
		<li>\
			<a href="">\
				Posts\
			</a>\
		</li>\
		<li>\
			<a href="">\
				Temas\
			</a>\
		</li>\
		<li>\
			<a href="">\
				Seguidores\
			</a>\
		</li>\
	</ul>';

/*
 *	Clase que representa un shout
 *	Manipular esta clase también manipula su nodo en el DOM
 *	Al llamar Shout.Make sobre un shout, una instancia de esta clase es asociada a su nodo mediante
 *	el atributo data-shout
 *	Aviso: 	esta clase vuelve a renderizar ciertas partes del shout ante determinados eventos
 *			Tener esto en cuenta a la hora de manipular este elemento pues puede que los cambios sean
 *			reemplazados al, por ejemplo, likear un shout, que re-renderiza los contadores de likes, shouts
 * 			comentarios
 */
var Shout = function(shoutNode, shout) {
	this.shoutNode = shoutNode;
	this.shout = shout;
	this.activityPage = 1;
};

/**
 * Estructura de la propiedad shout:
 * {
 * 	object 	author: {
 * 		string 	username,
 * 		string 	href,
 * 		int 	uid,
 * 		string 	avatar
 * 	},
 * 	object 	reshouter: {
 * 		string 	username,
 * 		string 	href,
 * 		int 	uid,
 * 		string 	avatar
 * 	},
 * 	string	nombre,
 * 	int 	id,
 * 	int 	owner,
 * 	string	href,
 * 	string	attachmentType,
 * 	string,object	attachment,
 * 	string	body,
 * 	string	date,
 * 	int 	feed,
 * 	int 	unfollow,
 * 	bool 	reshouted,
 * 	bool 	liked,
 * 	bool 	faved,
 * 	int 	comentarios,
 * 	int 	likes,
 * 	int 	reshouts,
 * 	int 	favoritos,
 * 	bool 	legacy
 * }
 */

Shout.prototype.like = function() {
	var self = this;

	API.likeShout(this.shout.id, this.shout.owner, function(res) {
		if(res.status != 1) {
			console.log('Hubo un error al likear el shout');
			return;
		}
		self.shout.likes = parseInt(self.shout.likes) + 1;
		self.shout.liked = true;
		scores = self.generateScores();
		$(self.shoutNode).find('.shout-footer-scores').replaceWith(scores);
		$(self.shoutNode).find('[data-action=like-shout]').addClass('disabled liked');
	});

}
Shout.prototype.likeWallPost = function() {
	var self = this;

	API.voteWallPost(this.shout.id, this.shout.wall, function(res) {
		if(res.status != 1) {
			console.log('Hubo un error al likear el wallpost');
			return;
		}
		self.shout.likes = parseInt(self.shout.likes) + 1;
		self.shout.liked = true;
		scores = self.generateScores();
		$(self.shoutNode).find('.shout-footer-scores').replaceWith(scores);
		$(self.shoutNode).find('[data-action=like-wallpost]').addClass('disabled liked');
	});

}

Shout.prototype.addFavorite = function() {
	var self = this;
	API.addShoutFavorite(this.shout.id, this.shout.owner, function(res) {
		if(res.status != 1) {
			console.log('Hubo un error al agregar a favoritos el shout');
			return;
		}
		self.shout.favs = parseInt(self.shout.favs) + 1;
		self.shout.faved = true;
		scores = self.generateScores();
		$(self.shoutNode).find('.shout-footer-scores').replaceWith(scores);
		$(self.shoutNode).find('[data-action=favorite]').addClass('faved');
	});
}
Shout.prototype.delFavorite = function() {
	var self = this;
	API.delShoutFavorite(this.shout.id, this.shout.owner, function(res) {
		if(res.status != 1) {
			console.log('Hubo un error al quitar de favoritos el shout');
			console.log(res);
			return;
		}
		self.shout.favs = parseInt(self.shout.favs) - 1;
		self.shout.faved = false;
		scores = self.generateScores();
		$(self.shoutNode).find('.shout-footer-scores').replaceWith(scores);
		$(self.shoutNode).find('[data-action=favorite]').removeClass('faved');
	});
}

Shout.prototype.reshout = function() {
	var self = this;

	API.reshout(this.shout.id, this.shout.owner, function(res) {
		if(res.status == 0) {
			console.log('Hubo un error al likear el shout');
			return;
		}
		self.shout.reshouts = parseInt(self.shout.reshouts) + 1;
		self.shout.reshouted = true;
		scores = self.generateScores();
		$(self.shoutNode).find('.shout-footer-scores').replaceWith(scores);
		$(self.shoutNode).find('[data-action=reshout]').addClass('disabled');
	});

}
Shout.prototype.ocultarShout = function(unfollow) {
	var self = this;
	if(unfollow) {
		unfollow = this.shout.unfollow;
	}
	API.ocultarShout(this.shout.feed, unfollow, function(res) {
		if(res.status == 0) {
			console.log('Hubo un error al ocultar el shout');
			return;
		}
		$(self.shoutNode).fadeOut('fast');
	});

}

Shout.prototype.generateScores = function() {
	var shout = this.shout;

	var tmp_shoutFooterScores = "<div class='shout-footer-scores'>";

	var likesPlural = (shout.likes > 1) ? "likes" : "like";
	var likes;
	var reshoutsPlural = (shout.reshouts > 1) ? "reshouts" : "reshout";
	var reshouts;
	var comentariosPlural = (shout.comentarios > 1) ? "comentarios" : "comentario";
	var comentarios;

	if(shout.likes > 0) {
		likes = shout.likes + " " + likesPlural;
	}
	if(shout.reshouts > 0) {
		reshouts = shout.reshouts + " " + reshoutsPlural;
	}
	if(shout.comentarios > 0) {
		comentarios = shout.comentarios + " " + comentariosPlural;
	}

	if(shout.likes == 0 && shout.reshouts == 0 && shout.comentarios == 0){
		// No hay nada, no hacemos nada
		// Just debugging
		tmp_shoutFooterScores += "";
	} else if(shout.likes > 0 && shout.reshouts == 0 && shout.comentarios == 0) {
		// Si el shout solo tiene likes
		// Mostramos X likes
		tmp_shoutFooterScores += likes;
	} else if (shout.likes > 0 && shout.reshouts > 0 && shout.comentarios == 0) {
		// Si el shout tiene likes y reshouts pero no comentarios
		// Mostramos X likes y Y reshouts
		tmp_shoutFooterScores += likes + " y " + reshouts;
	} else if(shout.likes > 0 && shout.reshouts == 0 && shout.comentarios > 0) {
		// Si el shout tiene likes y comentarios pero no reshouts
		// Mostramos X likes y Z comentarios
		tmp_shoutFooterScores += likes + " y " + comentarios;
	} else if(shout.likes == 0 && shout.reshouts > 0 && shout.comentarios > 0) {
		// El shout tiene reshouts y comentarios pero no likes
		// Mostramos Y reshouts y Z comentarios
		tmp_shoutFooterScores += reshouts + " y " + comentarios;
	} else if(shout.likes == 0 && shout.reshouts > 0 && shout.comentarios == 0) {
		// El shout solo tiene reshouts
		// Mostramos Y reshouts
		tmp_shoutFooterScores += reshouts;
	} else if(shout.likes == 0 && shout.reshouts == 0 && shout.comentarios > 0) {
		// El shout solo tiene comentarios
		// Mostramos Z comentarios
		tmp_shoutFooterScores += comentarios;
	} else if(shout.likes > 0 && shout.reshouts > 0 && shout.comentarios > 0) {
		// El shout tiene likes, reshouts y comentarios
		// Mostramos X likes, Y reshouts y Z comentarios
		tmp_shoutFooterScores += likes + ", " + reshouts + " y " +comentarios;
	}

	tmp_shoutFooterScores += "</div>";

	return tmp_shoutFooterScores;
}

Shout.prototype.refreshActivity = function() {
	var that = this;
	API.getShoutActivity(this.shout.id, this.shout.owner, 1, function(res){
		var activityList = $(that.shoutNode).find('.shout-activity-list');
		activityList.html('');
		if(res.length > 50) {
			$(that.shoutNode).find('.shout-activity-mas').show();
		} else {
			$(that.shoutNode).find('.shout-activity-mas').hide();
		}
		res.forEach(function(item, index) {
			$(activityList).append(Mustache.render(Shout.tmpActivityItem, {
				text: item.text,
				tiempo: item.date,
				avatar: item.avatar
			}));
		});
		that.activityPage = 2;
		$(that.shoutNode).find('.shout-activity-mas').show();
	})
}
Shout.prototype.moreActivity = function() {
	var that = this;
	API.getShoutActivity(this.shout.id, this.shout.owner, this.activityPage, function(res){
		if(!res.length) {
			$(that.shoutNode).find('.shout-activity-mas').hide();
		} else {
			var activityList = $(that.shoutNode).find('.shout-activity-list');
			res.forEach(function(item, index) {
				$(activityList).append(Mustache.render(Shout.tmpActivityItem, {
					text: item.text,
					tiempo: item.date,
					avatar: item.avatar
				}));
			});
			that.activityPage++;
		}
	})
}

Shout.prototype.render = function() {
	// PENDIENTE
	// Refactorear este método en general, buscar una forma más limpia y legible de hacer esto

	var shout = this.shout;
	// Definimos un template para el shout
	// Esta parte se pone horrible PERO BUENO
	var tmp_shoutHeadingVerbo = (shout.attachment) ? ' compartió' : ' dijo';
	var tmp_shoutHeadingText = "";
	var tmp_shoutHeadingAvatares = "";
	if(shout.reshouter) {
		tmp_shoutHeadingText = "<a href='"+shout.reshouter.href+"'>" + shout.reshouter.username + "</a>" + tmp_shoutHeadingVerbo + " vía <a href='"+shout.author.href+"'>" + shout.author.username + "</a>";

		tmp_shoutHeadingAvatares =
			"<a href='"+shout.author.href+"'><img src='"+shout.author.avatar+"' class='shout-avatar'></a>"+
			"<a href='"+shout.reshouter.href+"'><img src='"+shout.reshouter.avatar+"' class='shout-reshouter-avatar'></a>";
	} else {
		tmp_shoutHeadingText = "<a href='"+shout.author.href+"'>" + shout.author.username + "</a>" + tmp_shoutHeadingVerbo;

		tmp_shoutHeadingAvatares =
			"<a href='"+shout.author.href+"'><img src='"+shout.author.avatar+"' class='shout-avatar'></a>";
	}

	var headingActions = [];
	if(shout.wallpost){
		headingActions.push(['Eliminar', 'data-action="eliminar-wallpost"']);
	} else if(!shout.isShoutDetails){
		headingActions.push(['Esconder', "data-action='esconder-shout'"]);
		headingActions.push(['Esconder y dejar de seguir', "data-action='esconder-unfollow'"]);
	} else if(global_data.user == shout.owner) {
		headingActions.push(['Eliminar', "data-action='eliminar-shout'"])
	} else if(shout.isShoutDetails && global_data.user != shout.owner) {
		headingActions.push(['Denunciar', "data-action='denunciar-shout'"]);
	}

	var tmp_headingActions =
		"<div class='shout-heading-actions'>\
			<i class='zmdi zmdi-more-vert more-vert' data-toggle='dropdown'></i>\
			<ul class='menu-dropdown'>";

	headingActions.forEach(function(item, index) {
		tmp_headingActions +=
				"<li>\
					<a href='#' "+item[1]+">"+item[0]+"</a>\
				</li>"
	});

	tmp_headingActions +=
			"</ul>\
		</div>";

	var tmp_shoutHeading =
		"<div class='module-heading shout-heading'>"+
			"<div class='shout-avatares'>" + tmp_shoutHeadingAvatares + "</div>"+
			"<div class='shout-signature'>"+
				"<div class='shout-users'>" +tmp_shoutHeadingText + "</div>"+
				"<div class='shout-date'><small>" + shout.date + "</small></div>"+
			"</div>"+
			tmp_headingActions+
		"</div>";

	var tmp_shoutBody = "";
	if(shout.body) {
		tmp_shoutBody =
			"<div class='module-body shout-body'>"+
					"<div>"+shout.body+"</div>"+
			"</div>";
	}

	var tmp_shoutAttachment = "";
	switch(shout.attachmentType) {
		case 'imagen':
			tmp_shoutAttachment =
				"<div class='shout-attachment'>"+
					"<img src='"+shout.attachment+"' />"+
				"</div>";
			break;
		case 'video':
			tmp_shoutAttachment =
				"<div class='shout-attachment'>"+
					shout.attachment+
				"</div>";
			break;
		case 'link':
			tmp_shoutAttachment =
				"<div class='shout-attachment link'>"+
					"<a href='"+shout.attachment.href+"' class='link-title'>"+
						"<h3>"+shout.attachment.title+"</h3>"+
					"</a>"+
					"<p class='link-description'>"+shout.attachment.description+"</p>"+
					"<a href='"+shout.attachment.href+"' class='link-url'>"+shout.attachment.href+"</a>"+
				"</div>";
			break;
		case 'webm':
				tmp_shoutAttachment =
					"<div class='shout-attachment'>"+
						"<video muted autoplay loop>"+
							"<source type='video/webm' src='"+shout.attachment+"' >"+
						"</video>"+
					"</div>";
				break;
			break;
	}



	var dataAction = {
		comment: "data-action='comment'",
		favorite: "data-action='favorite'",
		likeShout: "data-action='like-shout'",
		reshout: "data-action='reshout'"
	};
	if(shout.wallpost) {
		dataAction.likeShout = "data-action='like-wallpost'";
	}

	var buttonLike = '';
	var likeClass = '';
	if(shout.liked || global_data.user == shout.owner) {
		likeClass += " disabled";
		if(shout.liked) {
			likeClass += " liked";
		}
	}
	buttonLike +=
		"<div class='shout-footer-action"+likeClass+"' "+dataAction.likeShout+">\
			<i class='ion-heart'></i>\
		</div>";

	var buttonFav = '';
	if(!shout.wallpost){
		var favClass = '';
		if(shout.faved) {
			favClass += " faved";
		}
		buttonFav +=
			"<div class='shout-footer-action"+favClass+"' "+dataAction.favorite+">\
				<i class='ion-ios-star'></i>\
			</div>";
	}

	var buttonReshout = '';
	if(!shout.wallpost){
		var reshoutClass = '';
		if(shout.reshouted || global_data.user == shout.owner) {
			reshoutClass += " disabled";
		}
		buttonReshout +=
			"<div class='shout-footer-action"+reshoutClass+"' "+dataAction.reshout+">\
				<i class='ion-arrow-swap'></i>\
			</div>";
	}

	var buttonComment = '';
	if((shout.comentarios || shout.wallpost) && !shout.isShoutDetails) {
		buttonComment +=
			"<div class='shout-footer-action' "+dataAction.comment+">"+
				"<a href='"+shout.href+"'><i class='ion-chatbox'></i>&nbsp;</a>"+
			"</div>";
	}

	var tmp_shoutFooterScores = this.generateScores();

	var tmp_shoutFooter =
		"<div class='module-footer'>"+
			"<div class='shout-footer-history'>"+
				"<i class='ion-android-time'></i>"+
			"</div>"+
			tmp_shoutFooterScores+
			"<div class='shout-footer-actions'>"+
				buttonComment +
				buttonFav +
				buttonLike +
				buttonReshout +
			"</div>"+
		"</div>"+
		"<div class='shout-activity' style='display:none;'>\
			<div class='shout-activity-list'></div>\
			<a href='#' class='shout-activity-mas' style='display:none;'>Cargar más</a>\
		</div>";

	var datas = '';
	if(shout.wallpost) {
		datas = "data-id='"+shout.id+"' data-wall='"+shout.wall+"'";
	} else {
		datas = "data-id='"+shout.id+"' data-owner='"+shout.owner+"'";
	}

	var shoutTemplate =
		"<div class='module shout' "+datas+"'>"+
			tmp_shoutHeading+
			tmp_shoutBody+
			tmp_shoutAttachment+
			tmp_shoutFooter+
		"</div>";

	shoutTemplate = $(shoutTemplate);
	// Guardamos lo datos del shout en el shout so you can shout while you shout
	shoutTemplate.data('shout', this);

	var newShout = $(this.shoutNode).replaceWith(shoutTemplate);
	this.shoutNode = shoutTemplate;
}

Shout.Make = function(element) {
		// Guardamos el nodo del shout, de paso nos ahorramos los quilombos de this por todas partes
	var shoutNode = element;

	// Declaramos un objeto para guardar los datos del shout
	var shout = {};
	shout.author = {};

	if($(shoutNode).hasClass('shout-item')) {
		shout = Shout.GetShoutItemData(shoutNode);
	} else {
		shout = Shout.GetLegacyShoutData(shoutNode);
	} // Fin else, shout.legacy = true

	// Instanciamos un nuevo shout y le pasamos el nodo del shout que representa
	// y la información del shout
	var newShout = new Shout(shoutNode, shout);

	// Reemplazamos el shout con el nuevo y hermoso shout
	newShout.render();

	return newShout;
}

Shout.GetShoutItemData = function (shoutNode) {
	var shout = {};
	shout.author = {};

	shout.legacy = false;

	if($(shoutNode).hasClass('shout-detail')) {
		shout.isShoutDetails = true;
		shout.online = $(shoutNode).find('.state').hasClass('online');
	}

	// Buscamos el id del shout
	shout.id = $(shoutNode).data('fetchid');
	// Buscamos el href del shout
	shout.href = $(shoutNode).find('a.icon-comments').attr('href');

	// Buscamos los datos del autor
	var shoutUsernameNode = $(shoutNode).find('.shout-heading .shout-user_name');
	shout.author.id = shoutUsernameNode.data('uid');
	shout.author.username = shoutUsernameNode.text();
	shout.author.href = shoutUsernameNode.attr('href');
	var avatarNode = $(shoutNode).find('.shout-heading > .shout-user > a');
	shout.author.avatar = avatarNode.find('img').attr('src');

	shout.owner = shout.author.id;

	var shoutActionActivity = $(shoutNode).find('.shout-action-activity');
	// Guardamos el "tiempo" del shout
	shout.date = shoutActionActivity.find('time').attr('title').replace('Creado h', 'H');

	// Guardamos el cuerpo del shout
	shout.body = $(shoutNode).find('.shout-txt').html();

	var mainContentNode =  $(shoutNode).find('.shout-main-content');
	// Buscamos el attachment del shout
	// Vemos si tiene una imagen
	if(mainContentNode.hasClass('image')) {
		var tmp_attachNode = mainContentNode.find('.shout-content--img img')[0];
		if(tmp_attachNode) {
			shout.attachmentType = 'imagen';
			shout.attachment = $(tmp_attachNode).attr('src');
		} else {
			tmp_attachNode = mainContentNode.find('.webm-js');
			shout.attachmentType = 'webm';
			shout.attachment = $(tmp_attachNode).find('source[type="video/webm"]').attr('src');
		}

	} else
	// Vemos si tiene un video
	if (mainContentNode.hasClass('video')) {
		shout.attachmentType = 'video';
		var videoNode = mainContentNode.find('iframe');
		if(videoNode) {
			shout.attachment = videoNode[0].outerHTML;
		} else {
			shout.attachment = mainContentNode.find('embed')[0].outerHTML;
		}
	} else
	// Vemos si tiene un link
	if (mainContentNode.hasClass('link')) {
		shout.attachmentType = 'link';
		var linkNode = mainContentNode.find('.article-content-wrapper');
		shout.attachment = {
			href: linkNode.children('a').attr('href'),
			title: linkNode.find('h3').text(),
			description: linkNode.find('.og-description').text()
		}
	}


	// Buscamos likes, reshouts, comentarios y si está favoriteado
	var likesNode = $(shoutNode).find('.icon-pulgararriba');
	shout.likes = likesNode.text();
	shout.liked = likesNode.closest('li').hasClass('selected');

	var reshoutsNode = $(shoutNode).find('.icon-share');
	shout.reshouts = reshoutsNode.text();
	shout.reshouted = reshoutsNode.closest('li').hasClass('selected');

	var comentariosNode = $(shoutNode).find('.icon-comments');
	shout.comentarios = comentariosNode.text();

	var favedNode = $(shoutNode).find('.wrap-actions .icon-favoritos');
	shout.faved = favedNode.closest('li').hasClass('selected');

	console.log(shout);
	return shout;
}

Shout.GetLegacyShoutData = function (shoutNode) {
	var shout = {};
	shout.author = {};

	shout.legacy = true;

	// Buscamos el "nombre" del shout, vendría a ser la cadena que aparece en el link del shout
	shout.name = $(shoutNode).children('a[name]').attr('name');

	// Buscamos el id del shout y el id del owner(ya que estamos sacamos el id del owner, total es el mismo nodo)
	if($(shoutNode).hasClass('wallpost')) {
		shout.wallpost = true;
		var actionList = $(shoutNode).find(".shout-footer .w-action-list")[0];
		shout.id = $(actionList).attr('data-id');
		shout.wall = $(actionList).attr('data-wall')
	} else {
		var actionList = $(shoutNode).find(".shout-footer .s-action-list")[0];
		shout.id = $(actionList).attr('data-id');
		shout.owner = $(actionList).attr('data-owner');
	}

	// Buscamos los nodos donde está la información del usuario
	var usersNode = $(shoutNode).find('.activity-header a.hovercard');

	// Buscamos el avatar del autor
	var authorAvatar = $(shoutNode).find('a.avatar > img').attr('src');

	// Si se encontró más de un nodo, la cabecera del shout dice algo del tipo
	// {usuario1} compartió vía {usuario2}
	if(usersNode[1]) {
		// Como el usuario1 es el que reshoutea y el usuario2 el autor, el nodo 0 es
		// el nodo del que reshoutea y el nodo 1 el del autor
		reshouterNode = $(usersNode[0]);
		authorNode = $(usersNode[1]);

		// Guardamos los datos del autor en el objeto shout
		shout.author.username = authorNode.text();
		shout.author.href = authorNode.attr('href');
		shout.author.uid = authorNode.data('uid');
		shout.author.avatar = authorAvatar;

		// Lo mismo para el reshouteador
		shout.reshouter = {};

		// Buscamos el avatar del usuario este
		var reshouterAvatar = $(shoutNode).find('a.alter > img').attr('src');
		shout.reshouter.username = reshouterNode.text();
		shout.reshouter.href = reshouterNode.attr('href');
		shout.reshouter.uid = reshouterNode.data('uid');
		shout.reshouter.avatar = reshouterAvatar;

	} else {

		// Sólo hubo una coincidencia, entonces el autor es esa única coincidencia
		var authorNode = $(usersNode[0]);

		// Guardamos
		shout.author.username = authorNode.text();
		shout.author.href = authorNode.attr('href');
		shout.author.uid = authorNode.data('uid');
		shout.author.avatar = authorAvatar;

	}

	// Conseguimos el data-unfollow para ocultar y dejar de seguir el shout
	shout.unfollow = $(shoutNode).attr('data-unfollow');
	// Guardamos el feed
	shout.feed = $(shoutNode).attr('data-feed');
	// Guardamos el cuerpo del shout
	var bodyNode = $(shoutNode).find('.activity-content > p');
	shout.body = $(bodyNode).html();
	if(!shout.body) {
		bodyNode = $(shoutNode).find('.link-shout-content > p');
		shout.body = $(bodyNode).html();
	}

	// Guardamos la información sobre la fecha del shout
	var dateNode = $(shoutNode).find('.date');
	shout.date = $(dateNode).text();

	// Guardamos el link al shout
	shout.href = $(dateNode).attr('href');

	if(shout.wallpost) {
		// Guardamos los likes del shout
		shout.likes = $(shoutNode).find('.wall-action-vote > .action-number > span').text();
		// El shout está likeado?
		shout.liked = $(shoutNode).find('.wall-action-vote > .icon').hasClass('s-like-color');
	} else {
		// Guardamos los likes del shout
		shout.likes = $(shoutNode).find('.action-vote > .action-number > span').text();
		// El shout está likeado?
		shout.liked = $(shoutNode).find('.action-vote > .icon').hasClass('s-like-color');
	}

	// Guardamos los favoritos del shout
	shout.favs = $(shoutNode).find('.action-favorite > .action-number > span').text();
	// El shout está en favoritos?
	shout.faved = $(shoutNode).find('.action-favorite > .icon').hasClass('favorite-color');

	// Guardamos los reshouts
	shout.reshouts = $(shoutNode).find('.action-reshout > .action-number > span').text();
	// Ya reshoutee el shout?
	var reshoutNode = $(shoutNode).find('.action-reshout > .icon');
	shout.reshouted = ( reshoutNode.hasClass('ui-state-disabled') || reshoutNode.hasClass('respam-color'));
	// Guardamos los comentarios, undefined si no tiene
	if(shout.wallpost){
		shout.comentarios = $(shoutNode).find('.button-action-s.pointer > .action-number > span').text();
	} else {
		shout.comentarios = $(shoutNode).find('.action-quick-reply-toggle > .action-number > span').text();
	}
	if(!shout.comentarios) {
		shout.comentarios = false;
	}

	// Buscamos el "attachment" del shout, acá la cosa se pone un poco complicada
	// Primero nos fijamos si el shout tiene alguna imagen, generalmente
	// la imagen está dentro de un link cuyo href es "/{username}/mi/{shout.nombre}"
	// A su vez este link es un hijo directo de .activity-content
	var shoutImagen = $(shoutNode).find('.activity-content > a > img')[0];
	if(shoutImagen) {
		// Si hubo una coincidencia, guardamos el link de la imagen
		shout.attachmentType = 'imagen';
		shout.attachment = $(shoutImagen).attr('src');
	}

	// Buscamos si el shout tiene un video
	var shoutVideo = $(shoutNode).find('.activity-content > center')[0];
	if(shoutVideo) {
		shout.attachmentType = 'video';
		shout.attachment = $(shoutVideo).html();
	}

	// Buscamos si el shout tiene un enlace
	var shoutLink = $(shoutNode).find('.activity-content > .link-shout-content > .link-summary')[0];
	if(shoutLink) {
		// Si hubo una coincidencia, guardamos el link de la imagen
		shout.attachmentType = 'link';
		shout.attachment = {
			href: $($(shoutLink).find('a')[0]).attr('href'),
			title: $(shoutLink).find('a > h3').text(),
			description: $(shoutLink).children('p').text()
		}
		if(!shout.attachment.title) {
			shout.attachment.title = '';
		}
		if(!shout.attachment.description) {
			shout.attachment.description = '';
		}
	}

	// Buscamos si tiene un webm
	// webm es un decir, claro, ya sabemos que esta basura no soporta webms de verdad
	var shoutWebm = $(shoutNode).find('.activity-content > a.webm-js')[0];
	if(shoutWebm) {
		shout.attachmentType = 'webm';
		shout.attachment = $(shoutWebm).find('video source[type="video/webm"]').attr('src');
	}

	return shout;
}

Shout.tmpActivityItem =
"<div class='shout-activity-item'>\
	<img src='{{avatar}}'' class='activity-item-avatar'>\
	<span class='activity-item-text'>{{{text}}}</span>\
	<span class='activity-item-date'>{{tiempo}}</div>\
</div>";

var Usercard = function (userid, callback) {
	this.userid = userid;
	this.callback = callback;

	var self = this;

	var user = {};

	API.getUserInfo(this.userid, function(res) {
		user = res;

		API.getUserStats(self.userid, function(res) {

			user.stats = res;

			self.user = user;
			self.callback();
		});
	})

}

Usercard.prototype.Render = function() {
	console.log('render');
	var bkg = []
	bkg['m'] = location.protocol+'//k30.kn3.net/1/5/9/C/1/1/C4A.png'
	bkg['f'] = location.protocol+'//k30.kn3.net/0/9/D/E/2/1/55D.png'

	var online = (this.user.online) ? ' online' : '';
	var cardTemplate =$(
		"<div id='userCard' class='module'>"+
		    "<div class='usercard-header' style='background: url(\""+bkg[this.user.gender]+"\");'></div>"+
		    "<div class='usercard-body'>"+
		        "<div class='actionMenu'>"+
		            "<div class='avatar"+online+"'><img src='"+this.user.avatar.big+"'>"+
		            "</div>"+
		        "</div>"+
		        "<center><a class='user-link' href='"+this.user.canonical+"'>"+this.user.nick+"</a></center>"+
		    "</div>"+
		    "<div class='usercard-footer'>"+
		        "<div class='range "+this.user.range.name+"'>"+this.user.range.name+"</div>"+
		        "<ul class='user-stats'>"+
		            "<li><b>"+this.user.stats.shouts+"</b>"+
		                "<br>Shouts</li>"+
		            "<li><b>"+this.user.stats.points+"</b>"+
		                "<br>Puntos</li>"+
		            "<li><b>"+this.user.stats.followers+"</b>"+
		                "<br>Seguidores</li>"+
		        "</ul>"+
		    "</div>"+
		"</div>");

	return cardTemplate;
}


var BetterTaringo = new EventEmitter();

BetterTaringo.Container = {}

BetterTaringo.Start = function() {

	this.loadConfig();

	var pathArray = this.getCurrentPathArray();
	if(pathArray[1] && (pathArray[1] == 'mi' || pathArray[1] == 'shouts')) {
		new Usercard(global_data.user, function() {
			this.user.online = true;
			var userCard = this.Render();
			if(pathArray[1] == 'mi') {
				$('#sidebar').prepend(userCard);
			} else {
				$('.sidebar').prepend(userCard);
			}
		})
	} else {
		Perfil.Start();
	}
	if(pathArray[1] && (pathArray[1] == 'cuenta')) {
		Perfil.initConfigMenu();
	}

	this.replaceShouts();

}

BetterTaringo.loadConfig = function() {
	if(global_data && global_data.user) {
		this.loggedUser = $('.header.header-main .user-action .tool-profile span').text().replace(/ /g,'');
		console.log(this.loggedUser);
		var that = this;
		$.ajax({
			url:'/'+this.loggedUser+'/informacion',
			beforeSend:function(er,rr){
				rr.url='/'+that.loggedUser+'/informacion';
				er.setRequestHeader('X-Requested-With', {toString: function(){ return ''; }});
			},
			success:function(rev){
			    var config = parseConfig(rev);
			}
		});
	}
}

BetterTaringo.getCurrentPathArray = function(){
    var pathArray = window.location.pathname.split( '/' )
    var paths = ""
    for (i = 0; i < pathArray.length; i++) {
        paths += "/"
        paths += paths[i]
    }
    return pathArray;
}

BetterTaringo.replaceShouts = function() {
	var self = this;
	$('.activity-element:not(.activity-min):not(.new-post, .new-tema), .shout-item').each(function(){
		var newshout = Shout.Make(this);
		// Nos fijamos si lo que estamos modificando es el shout en la página del shout digamos
		// Osea está en taringa.net/usuario/mi/coso, no está en el feed
		var isShoutDetails = newshout.shout.isShoutDetails;
		if(isShoutDetails){
			console.log('shout');
			// Guardamos el shout pues contiene información valiosa para otros componentes
			BetterTaringo.Container.shout = newshout.shout;
			self.emit('bt_addUserCard', newshout.shout.online);
			$.ajax({
                url:'/'+newshout.shout.author.username,
                beforeSend:function(er,rr){
                    rr.url='/'+newshout.shout.author.username+'/posts';
                    er.setRequestHeader('X-Requested-With', {toString: function(){ return ''; }});
                },
                success:function(rev){
                    var re = /<style>body{background:\s*url\(\"(.*?)}<\/style>/ig;
                    var res = re.exec(rev);
                    $('body').css('background','url("'+res[1]+'');
                }
            });
		}
	});
	// Escuchamos cuando se instancie un shout
	$('body').on('DOMNodeInserted', '.activity-element:not(.activity-min):not(.new-post, .new-tema), .shout-item', function () {
		Shout.Make(this);

	});
}

BetterTaringo.on('bt_addUserCard', function(online) {
	new Usercard(BetterTaringo.Container.shout.owner, function() {
		this.user.online = online;
		var userCard = this.Render();

		$('.sidebar').prepend(userCard);
	})
})


/**
 * En esta sección manejamos los cambios de estado de la aplicación
 */
BetterTaringo.State = function(state) {
	this.emit('newState', state);
}

// @koala-prepend "vex.js";
// @koala-prepend "circle-progress.js";
// @koala-prepend "mustache.js";
// @koala-prepend "eventEmitter.js";
// @koala-prepend "helpers.js";
// @koala-prepend "API.js";
// @koala-prepend "Perfil.js";
// @koala-prepend "Shout.js";
// @koala-prepend "UserCard.js";
// @koala-prepend "BetterTaringo.js";

// Agregamos los estilos externos
// Esto en algún momento hay que remplazarlo
var tema = 'light';
var estilo = (function() {
	switch(tema) {
		case 'light':
			return 'https://doorgan.github.io/BetterTaringo/bettertaringo.min.css?6';
			break;
		case 'dark':
			return 'https://doorgan.github.io/BetterTaringo/bettertaringo_dark.min.css';
			break;
	}
})()

$.loadCSS('https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.2.0/css/material-design-iconic-font.css');
$.loadCSS('https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css');
$.loadCSS('https://daneden.github.io/animate.css/animate.min.css');
$.loadCSS('https://rawgit.com/olimsaidov/pixeden-stroke-7-icon/master/pe-icon-7-stroke/dist/pe-icon-7-stroke.min.css');
$.loadCSS(estilo);
/*$.ajax({
    url:"https://raw.githubusercontent.com/doorgan/BetterTaringo/gh-pages/bettertaringo.min.css",
    success:function(data){
        $("<style></style>").appendTo("head").html(data);
    }
});*/

vex.defaultOptions.className = 'vex-theme-bettertaringo';
vex.dialog.buttons.YES.text = 'Aceptar';
vex.dialog.buttons.NO.text = 'Cancelar';
/**
 * Habilitamos las peticiones cross-origin
 * Si todo funcionase bien podría evitar hacer esto y llamar a /usuario tranquilamente,
 * pero por algún motivo cuando hago esto me devuelve un error 404, cosa que no
 * pasa si lo hago desde algo como Postman
 * Quitando el parámetro key de las peticiones no soluciona el problema, así que por ahora uso este
 * workaround
 */
$.ajaxPrefilter( function (options) {
  if (options.crossDomain && jQuery.support.cors) {
    var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
    options.url = http + '//cors-anywhere.herokuapp.com/' + options.url;
  }
});

// En lo que sigue el :not(.activity-min) es para que no haga nada con la actividad del perfil
// Resulta que los mensajitos esos tienen esa clase, de ser necesario busco una mejor forma de identificarlos
// Lo mismo con .new-post y .new-post, que son de la pestaña notificaciones

// .shout-item son los shout de mierda nuevos


// Reemplazamos los shouts después de la carga inicial
/*$('.activity-element:not(.activity-min):not(.new-post, .new-tema), .shout-item').each(function(){
	var newshout = Shout.Make(this);
	// Nos fijamos si lo que estamos modificando es el shout en la página del shout digamos
	// Osea está en taringa.net/usuario/mi/coso, no está en el feed
	var isShoutDetails = newshout.shout.isShoutDetails;
	if(isShoutDetails){
		// Guardamos el shout pues contiene información valiosa para otros componentes
		BetterTaringoGlobals.shout = newshout;
	}
});*/

// Escuchamos cuando se likea un shout
$('body').on('click', '[data-action=like-shout]:not(.liked):not(.disabled)', function(e){
	e.preventDefault();
	var self = this;
	var shout = $(this).closest('.shout');

	var shoutObject = shout.data().shout;
	shoutObject.like();
});

// Escuchamos cuando se likea un wallpost
$('body').on('click', '[data-action=like-wallpost]:not(.liked):not(.disabled)', function(e){
	e.preventDefault();
	var self = this;
	var shout = $(this).closest('.shout');

	var shoutObject = shout.data().shout;
	shoutObject.likeWallPost();
});

// Escuchammos cuando se agrega o quita de favoritos un shout
$('body').on('click', '[data-action=favorite]:not(.disabled)', function(e){
	e.preventDefault();
	var self = this;
	var shout = $(this).closest('.shout');

	var shoutObject = shout.data().shout;

	if($(this).hasClass('faved')) {
		shoutObject.delFavorite();
	} else {
		shoutObject.addFavorite();
	}

});

// Escuchammos cuando se reshoutea un shout
$('body').on('click', '[data-action=reshout]:not(.disabled)', function(e){
	e.preventDefault();
	var self = this;
	vex.dialog.open({
		showCloseButton: true,
		message: '¿Quieres compartir este shout con tus seguidores?',
		callback: function(confirm) {
			if(confirm) {
				var shout = $(self).closest('.shout');

				var shoutObject = shout.data().shout;

				shoutObject.reshout();
			}
		}
	});

});

// Escuchammos cuando se oculta un shout un shout
$('body').on('click', '[data-action=esconder-shout]', function(e){
	e.preventDefault();
	var self = this;
	var shout = $(this).closest('.shout');

	var shoutObject = shout.data().shout;

	shoutObject.ocultarShout();

});
// Lo mismo pero para ocultar y dejar de seguir
$('body').on('click', '[data-action=esconder-unfollow]', function(e){
	e.preventDefault();
	var self = this;
	var shout = $(this).closest('.shout');

	var shoutObject = shout.data().shout;

	shoutObject.ocultarShout(true);

});

// Mostrar actividad del shout/lo que sea
$('body').on('click', '.shout-footer-history', function(e){
	e.preventDefault();
	var self = this;
	var shout = $(this).closest('.shout');
	var shoutActivity = $(shout.find('.shout-activity'));
	if(shoutActivity.is(':visible')) {
		shoutActivity.hide();
	} else {
		shoutActivity.show();
		var shoutObject = shout.data().shout;
		shoutObject.refreshActivity();
	}

});
// Cargar mas actividad
$('body').on('click', '.shout-activity-mas', function(e){
	e.preventDefault();
	var self = this;
	var shout = $(this).closest('.shout');

	var shoutObject = shout.data().shout;
	shoutObject.moreActivity();
});


// Mostramos u ocultamos un dropdown
// El trigger, o sea, el elemento con data-toggle=dropdown debe estar en el mismo nivel en la
// jerarquía que el dropdown a anipular
$('body').on('click', '[data-toggle=dropdown]', function(e){
	e.preventDefault();

	$(this).siblings('.menu-dropdown').slideToggle('fast');
});

// Si se hace click en el dropdown para ocultar shouts, detenemos la propagación de eventos
// para evitar que se cierre cuando hacemos clic dentro de el
$('body').on('click', '.shout-heading-actions', function(e){
	e.stopPropagation();
});
// Si se hace clic fuera de un dropdown, lo cerramos
$('body').on('click', function(e){
	$('.menu-dropdown').slideUp('fast');
});


// Borramos el widget de buscar amigos y los íconos de cumpleaños y pins
$('.box a[href="/buscar/amigos/"], .icon.party, .icon.pins').parent().remove();

// Borramos formulario para agregar pins
$('.box.pin-add').remove();
// Y creamos el nuestro
$('img[src="http://o1.t26.net/img/close.png"]').replaceWith('<i class="ion-close-round close-btn"></i>');
$('body').on('DOMNodeInserted', 'img[src="http://o1.t26.net/img/close.png"]', function () {
	$(this).replaceWith('<i class="ion-close-round close-btn"></i>');
});

// Cambiamos el la cruz gris de los pins por una roja
var pinsList = $('#pins');
var addPin =
	"<form onsubmit='Pin.add(this, 2, $(\"input[name=pin_add]\").val());return false'>"+
		"<input type='text' class='form-control add-pin-input' name='pin_add' placeholder='Agregar pin' />"+
	"</form>";
$(pinsList).append(addPin);

// Le quitamos la clase box al contenedor en el perfil del usuario
// Y puede que afecte otra cosa, hasta ahora no lo vi
$('#full-col > .box').removeClass('box');

BetterTaringo.Start();

BetterTaringo.on('bt_addUserCard', function() {
	console.log('HUE');
	var userCard = new UserCard(BetterTaringo.Container.shout.owner, function() {
		userCard.Render();
		$('.sidebar').prepend(userCard.Render());
	})
})