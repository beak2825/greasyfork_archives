// ==UserScript==
// @name            TinyMce for Evernote
// @namespace       https://github.com/Amourspirit/TinyMce-for-Evernote
// @version         3.3.4
// @description     Adds TinyMce in Evernote with custom options including source code. A new button is added to Evernote top toolbar section.
// @author          Paul Moss
// @run-at          document-end
// @include         /^https?:\/\/www\.evernote\.com\/home\.action.*n=.*$/
// @include         /^https?:\/\/www\.evernote\.com\/u\/0/Home\.action.*n=.*$/
// @include         /^https?:\/\/app\.yinxiang\.com\/Home\.action.*n=.*$/
// @include         /^https?:\/\/app\.yinxiang\.com\/u\/0/Home\.action.*n=.*$/
// @match           https://www.evernote.com/Home.action*
// @match           https://www.evernote.com/u/0/Home.action*
// @match           https://app.yinxiang.com/Home.action*
// @match           https://app.yinxiang.com/u/0/Home.action*
// @noframes
// @license         MIT
// @homepageURL     https://amourspirit.github.io/TinyMce-for-Evernote/
// @update          https://github.com/Amourspirit/TinyMce-for-Evernote/raw/master/dist/TinyMce_for_Evernote.user.js
// @contributionURL https://amourspirit.github.io/TinyMce-for-Evernote/#donate
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// @require         https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js
// @require         https://cdn.jsdelivr.net/npm/jquery-xpath@0.3.1/jquery.xpath.js
// @grant           GM_registerMenuCommand
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/16651/TinyMce%20for%20Evernote.user.js
// @updateURL https://update.greasyfork.org/scripts/16651/TinyMce%20for%20Evernote.meta.js
// ==/UserScript==
(function ($, tinymce) {
    'use strict';

    $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
    var tinymce__default = 'default' in tinymce ? tinymce['default'] : tinymce;

    var PriorityLevel;
    (function (PriorityLevel) {
        PriorityLevel[PriorityLevel["none"] = 0] = "none";
        PriorityLevel[PriorityLevel["now"] = 1] = "now";
        PriorityLevel[PriorityLevel["med"] = 2] = "med";
        PriorityLevel[PriorityLevel["high"] = 3] = "high";
    })(PriorityLevel || (PriorityLevel = {}));
    var DebugLevel;
    (function (DebugLevel) {
        DebugLevel[DebugLevel["debug"] = 0] = "debug";
        DebugLevel[DebugLevel["error"] = 1] = "error";
        DebugLevel[DebugLevel["warn"] = 2] = "warn";
        DebugLevel[DebugLevel["info"] = 3] = "info";
        DebugLevel[DebugLevel["none"] = 4] = "none";
    })(DebugLevel || (DebugLevel = {}));
    var ElementLocation;
    (function (ElementLocation) {
        ElementLocation[ElementLocation["head"] = 0] = "head";
        ElementLocation[ElementLocation["body"] = 1] = "body";
        ElementLocation[ElementLocation["other"] = 2] = "other";
    })(ElementLocation || (ElementLocation = {}));

    var appSettings = {
        tinyId: 'gminput',
        shortName: 'TMCEE',
        preKey: 'tmceen_',
        debugLevel: DebugLevel.none,
        menuName: 'TinyMce Options',
        tinyMceVersion: '4.1.0',
        fullScreenRealId: 'tinymce-real-fs'
    };
    var updateAppSetting = function (key, value) {
        if (appSettings.hasOwnProperty(key)) {
            appSettings[key] = value;
        }
    };

    var Log =  (function () {
        function Log() {
        }
        Log.message = function (msg, optionalParams) {
            if (appSettings.debugLevel > DebugLevel.info) {
                return;
            }
            var params = [];
            if (optionalParams) {
                for (var i = 0; i < optionalParams.length; i++) {
                    params[i] = optionalParams[i];
                }
            }
            console.log.apply(console, [msg].concat(params));
        };
        Log.warn = function (msg, optionalParams) {
            if (appSettings.debugLevel > DebugLevel.warn) {
                return;
            }
            var params = [];
            if (optionalParams) {
                for (var i = 0; i < optionalParams.length; i++) {
                    params[i] = optionalParams[i];
                }
            }
            console.warn.apply(console, [msg].concat(params));
        };
        Log.error = function (msg, optionalParams) {
            if (appSettings.debugLevel > DebugLevel.error) {
                return;
            }
            var params = [];
            if (optionalParams) {
                for (var i = 0; i < optionalParams.length; i++) {
                    params[i] = optionalParams[i];
                }
            }
            console.error.apply(console, [msg].concat(params));
        };
        Log.debug = function (msg, optionalParams) {
            if (appSettings.debugLevel > DebugLevel.debug) {
                return;
            }
            var params = [];
            if (optionalParams) {
                for (var i = 0; i < optionalParams.length; i++) {
                    params[i] = optionalParams[i];
                }
            }
            console.log.apply(console, [appSettings.shortName + ": Debug: " + msg].concat(params));
        };
        Log.debugWarn = function (msg, optionalParams) {
            if (appSettings.debugLevel > DebugLevel.debug) {
                return;
            }
            var params = [];
            if (optionalParams) {
                for (var i = 0; i < optionalParams.length; i++) {
                    params[i] = optionalParams[i];
                }
            }
            console.warn.apply(console, [appSettings.shortName + ": Debug: " + msg].concat(params));
        };
        return Log;
    }());

    var GmConfig =  (function () {
        function GmConfig() {
            this.gmConfig = GM_config;
        }
        Object.defineProperty(GmConfig.prototype, "tinymceConfirmNoSaveExit", {
            get: function () {
                return this.gmConfig.get('tinymceConfirmNoSaveExit');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymceWidth", {
            get: function () {
                return parseInt(this.gmConfig.get('tinymceWidth'), 10);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymceTheme", {
            get: function () {
                return this.gmConfig.get('tinymceTheme');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginFullscreen", {
            get: function () {
                return this.gmConfig.get('tinymcePluginFullscreen');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymceToolbars", {
            get: function () {
                return this.gmConfig.get('tinymceToolbars');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymceFontsDisplay", {
            get: function () {
                return this.gmConfig.get('tinymceFontsDisplay');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginTable", {
            get: function () {
                return this.gmConfig.get('tinymcePluginTable');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginCharmap", {
            get: function () {
                return this.gmConfig.get('tinymcePluginCharmap');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginCode", {
            get: function () {
                return this.gmConfig.get('tinymcePluginCode');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginCodeWidth", {
            get: function () {
                return parseInt(this.gmConfig.get('tinymcePluginCodeWidth'), 10);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginCodeHeight", {
            get: function () {
                return parseInt(this.gmConfig.get('tinymcePluginCodeHeight'), 10);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginPreview", {
            get: function () {
                return this.gmConfig.get('tinymcePluginPreview');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginPrint", {
            get: function () {
                return this.gmConfig.get('tinymcePluginPrint');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginInsertdatetime", {
            get: function () {
                return this.gmConfig.get('tinymcePluginInsertdatetime');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginImage", {
            get: function () {
                return this.gmConfig.get('tinymcePluginImage');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginSearchreplace", {
            get: function () {
                return this.gmConfig.get('tinymcePluginSearchreplace');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginEmoticons", {
            get: function () {
                return this.gmConfig.get('tinymcePluginEmoticons');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginAdvlist", {
            get: function () {
                return this.gmConfig.get('tinymcePluginAdvlist');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginVisualblocks", {
            get: function () {
                return this.gmConfig.get('tinymcePluginVisualblocks');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginVisualchars", {
            get: function () {
                return this.gmConfig.get('tinymcePluginVisualchars');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginBbcode", {
            get: function () {
                return this.gmConfig.get('tinymcePluginBbcode');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginWordcount", {
            get: function () {
                return this.gmConfig.get('tinymcePluginWordcount');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GmConfig.prototype, "tinymcePluginHilite", {
            get: function () {
                return this.gmConfig.get('tinymcePluginHilite');
            },
            enumerable: true,
            configurable: true
        });
        GmConfig.prototype.init = function () {
            var strTitle = appSettings.menuName;
            if (GM_info && GM_info.script && GM_info.script.version) {
                strTitle = appSettings.menuName + ": Version: " + GM_info.script.version;
            }
            var initValues = {
                id: appSettings.preKey + 'Config',
                title: strTitle,
                fields: 
                {
                    tinymceConfirmNoSaveExit: {
                        section: ['TinyMce editor section'],
                        type: 'checkbox',
                        label: 'Ask for confirmation before closing without saving?',
                        default: true
                    },
                    tinymceWidth: {
                        label: 'Width in pixels of editor when not full screen.',
                        type: 'int',
                        min: 400,
                        max: 4000,
                        default: 660 
                    },
                    tinymceTheme: {
                        section: ['TinyMce Themes', 'Choose Theme'],
                        label: 'Theme',
                        type: 'select',
                        options: ['Defalut Theme', 'Modern White', 'Modern two', 'Charcoal', 'SS4'],
                        default: 'Modern White' 
                    },
                    tinymceToolbars: {
                        section: ['Toolbar Options', 'Selecting one will combine all the toolbars'],
                        label: 'Select Number of Toolbars',
                        type: 'select',
                        options: ['one', 'two'],
                        default: ['one']
                    },
                    tinymceFontsDisplay: {
                        section: ['Font Display'],
                        type: 'checkbox',
                        label: 'Display Font List?',
                        default: true
                    },
                    tinymcePluginFullscreen: {
                        section: ['TinyMce plugins section', 'Plugin Options'],
                        type: 'checkbox',
                        label: 'Load Plugin Full Screen?',
                        default: true
                    },
                    tinymcePluginTable: {
                        type: 'checkbox',
                        label: 'Load Plugin Table?',
                        default: true
                    },
                    tinymcePluginCharmap: {
                        type: 'checkbox',
                        label: 'Load Plugin Special Characters?',
                        default: true
                    },
                    tinymcePluginCode: {
                        type: 'checkbox',
                        label: 'Load Plugin Html Code?',
                        default: true
                    },
                    tinymcePluginCodeWidth: {
                        label: 'Width in pixels of HTML code editor.',
                        type: 'int',
                        min: 200,
                        max: 4000,
                        default: 400
                    },
                    tinymcePluginCodeHeight: {
                        label: 'Height in pixels of HTML code editor.',
                        type: 'int',
                        min: 200,
                        max: 4000,
                        default: 300
                    },
                    tinymcePluginPreview: {
                        type: 'checkbox',
                        label: 'Load Plugin Preview?',
                        default: true
                    },
                    tinymcePluginPrint: {
                        type: 'checkbox',
                        label: 'Load Plugin Print?',
                        default: true
                    },
                    tinymcePluginInsertdatetime: {
                        type: 'checkbox',
                        label: 'Load Plugin Insert Date Time?',
                        default: true
                    },
                    tinymcePluginImage: {
                        type: 'checkbox',
                        label: 'Load Plugin Image?',
                        default: true
                    },
                    tinymcePluginSearchreplace: {
                        type: 'checkbox',
                        label: 'Load Plugin Find & Replace?',
                        default: true
                    },
                    tinymcePluginEmoticons: {
                        type: 'checkbox',
                        label: 'Load Plugin Emoticons?',
                        default: true
                    },
                    tinymcePluginAdvlist: {
                        type: 'checkbox',
                        label: 'Load Plugin Advanced List?',
                        default: false
                    },
                    tinymcePluginVisualblocks: {
                        type: 'checkbox',
                        label: 'Load Plugin Visual Blocks?',
                        default: true
                    },
                    tinymcePluginVisualchars: {
                        type: 'checkbox',
                        label: 'Load Plugin Visual Characters?',
                        default: false
                    },
                    tinymcePluginBbcode: {
                        type: 'checkbox',
                        label: 'Load Plugin BBCode?',
                        default: false
                    },
                    tinymcePluginWordcount: {
                        type: 'checkbox',
                        label: 'Load Plugin Word Count?',
                        default: true
                    },
                    tinymcePluginHilite: {
                        type: 'checkbox',
                        label: 'Load Plugin Hilite?',
                        default: true
                    }
                },
            };
            GM_config.init(initValues);
        };
        return GmConfig;
    }());
    var TinymceWork =  (function () {
        function TinymceWork() {
            var _this = this;
            this.fullscreen = false;
            this.gmConfig = GM_config;
            this.init = function () {
                var gmSet = new GmConfig();
                var ver = appSettings.tinyMceVersion;
                var id = appSettings.tinyId;
                tinymce.PluginManager.load('lists', 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/lists/plugin.min.js');
                var loadTable = gmSet.tinymcePluginTable;
                if (gmSet.tinymcePluginTable) {
                    tinymce.PluginManager.load('table', 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/table/plugin.min.js');
                }
                var loadCharmap = gmSet.tinymcePluginCharmap;
                if (loadCharmap) {
                    tinymce.PluginManager.load('charmap', 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/charmap/plugin.min.js');
                }
                var loadCode = gmSet.tinymcePluginCode;
                if (loadCode) {
                    tinymce.PluginManager.load('code', 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/code/plugin.min.js');
                }
                var loadFullscreen = gmSet.tinymcePluginFullscreen;
                if (loadFullscreen) {
                    tinymce.PluginManager.load('fullscreen', 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/fullscreen/plugin.min.js');
                }
                var loadEmoticons = gmSet.tinymcePluginEmoticons;
                if (loadEmoticons) {
                    tinymce.PluginManager.load('emoticons', 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/emoticons/plugin.min.js');
                }
                var loadWordcount = gmSet.tinymcePluginWordcount;
                if (loadEmoticons) {
                    tinymce.PluginManager.load('wordcount', 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/wordcount/plugin.min.js');
                }
                var loadPrint = gmSet.tinymcePluginPrint;
                if (loadPrint) {
                    tinymce.PluginManager.load('print', 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/print/plugin.min.js');
                }
                var loadPreview = gmSet.tinymcePluginPreview;
                if (loadPreview) {
                    tinymce.PluginManager.load('preview', 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/preview/plugin.min.js');
                }
                var loadInsertdatetime = gmSet.tinymcePluginInsertdatetime;
                if (loadInsertdatetime) {
                    tinymce.PluginManager.load('insertdatetime', 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/insertdatetime/plugin.min.js');
                }
                var loadImage = gmSet.tinymcePluginImage;
                if (loadImage) {
                    tinymce.PluginManager.load('image', 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/image/plugin.min.js');
                }
                var loadSearchreplace = gmSet.tinymcePluginSearchreplace;
                if (loadSearchreplace) {
                    tinymce.PluginManager.load('searchreplace', 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/searchreplace/plugin.min.js');
                }
                var loadAdvlist = gmSet.tinymcePluginAdvlist;
                if (loadAdvlist) {
                    tinymce.PluginManager.load('advlist', 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/advlist/plugin.min.js');
                }
                var loadBbcode = gmSet.tinymcePluginBbcode;
                if (loadBbcode) {
                    tinymce.PluginManager.load('bbcode', 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/bbcode/plugin.min.js');
                }
                var loadVisualblocks = gmSet.tinymcePluginVisualblocks;
                if (loadVisualblocks) {
                    tinymce.PluginManager.load('visualblocks', 'https://cdn.tinymce.com/4/plugins/visualblocks/plugin.min.js');
                }
                var loadVisualchars = gmSet.tinymcePluginVisualchars;
                if (loadVisualchars) {
                    tinymce.PluginManager.load('visualchars', 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/visualchars/plugin.min.js');
                }
                var loadHilite = gmSet.tinymcePluginHilite;
                if (loadHilite) {
                    tinymce.PluginManager.load('hilite', 'https://cdn.jsdelivr.net/gh/Amourspirit/TinyMCE-Plugin-hilite@9b2a96752b5162187315e07047a7c0efd706145c/js/plugin.min.js');
                }
                var tinyMceExternalPlugins = {
                    textcolor: 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/textcolor/plugin.min.js',
                    colorpicker: 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/colorpicker/plugin.min.js',
                    nonbreaking: 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/nonbreaking/plugin.min.js',
                    hr: 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/hr/plugin.min.js',
                    link: 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/' + ver + '/plugins/link/plugin.min.js'
                };
                var loadFont = gmSet.tinymceFontsDisplay;
                var toolbar1 = 'mysave myexit | ';
                if (loadFont) {
                    toolbar1 += 'fontselect fontsizeselect | ';
                }
                toolbar1 += 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent';
                var toolbar2 = (loadFullscreen ? 'fullscreen ' : '');
                toolbar2 += (loadPrint ? 'print ' : '');
                toolbar2 += (loadPreview ? 'preview ' : '');
                toolbar2 += '| forecolor backcolor | ';
                toolbar2 += (loadPreview ? 'insertdatetime ' : '');
                toolbar2 += (loadTable ? 'table ' : '');
                toolbar2 += (loadSearchreplace ? 'searchreplace ' : '');
                toolbar2 += '| link ' + (loadImage ? 'image ' : '');
                toolbar2 += (loadEmoticons ? ' emoticons' : '');
                toolbar2 += (loadCharmap ? ' | charmap' : '');
                toolbar2 += (loadCode ? ' | code' : '');
                toolbar2 += (loadVisualchars ? ' | visualchars' : '');
                toolbar2 += (loadVisualblocks ? ' | visualblocks' : '');
                toolbar2 += (loadHilite ? ' | hilite' : '');
                var toolbars = [];
                if (gmSet.tinymceToolbars === 'one') {
                    toolbar1 += ' | ' + toolbar2;
                    toolbars.push(toolbar1);
                }
                else {
                    toolbars.push(toolbar1, toolbar2);
                }
                var tinyMceInit = {
                    selector: 'textarea#' + id,
                    init_instance_callback: function () {
                        $('.mce-i-mysave').addClass('save-s');
                        $('.mce-i-myexit').addClass('exit-x');
                        $(document).trigger('tinymceInit', {
                            type: 'tinymceInit',
                            message: 'init',
                            time: new Date(),
                            tinyMceId: id
                        });
                    },
                    height: 260,
                    inline: false,
                    browser_spellcheck: true,
                    plugins: '',
                    menubar: 'edit insert format view tools' + (loadTable ? ' table' : ''),
                    toolbar: toolbars,
                    content_css: '',
                    content_style: "a,blockquote,body,code,dd,del,dfn,div,dl,dt,em,h1,h2,h3,h4,h5,h6,html,iframe,img,li,ol,p,pre,q,ul{border:0;padding:0;margin:0}a,abbr,acronym,address,area,b,bdo,big,blockquote,caption,center,cite,code,col,colgroup,dd,del,dfn,div,dl,dt,em,font,h3,h4,h5,h6,hr,i,ins,kbd,li,map,ol,p,pre,q,s,samp,small,span,strike,strong,sub,sup,table,tbody,td,tfoot,th,thead,tr,tt,u,ul{line-height:1.57143em}a,body{margin:0}body,h1,h2{font-family:gotham,helvetica,arial,sans-serif}a,img[name=en-crypt]{cursor:pointer}h3,p{margin-bottom:.714285em}del{text-decoration:line-through}dfn{font-style:italic}body{box-sizing:border-box;color:#383838;font-size:14px;padding-right:1px;word-wrap:break-word}a:link,a:visited{color:#047ac6}a:active,a:hover{color:#2596de}h1{font-size:1.5em;font-weight:700;line-height:1.04762em;margin-bottom:.4761em;margin-top:.9523em}h2{font-size:1.286em;font-weight:700;line-height:1.22222em;margin-bottom:.5556em;margin-top:1.111em}h3,h4,h5,h6{font-size:1em;font-weight:700;font-family:gotham,helvetica,arial,sans-serif}h3{margin-top:1.4285em}div{font-family:gotham,helvetica,arial,sans-serif;font-size:14px}img.en-media{height:auto;margin-bottom:1.286em;max-width:100%}img.en-media[height='1']{height:1px}p+div img,p+img{margin-top:.714285em}div+div img,div+img{margin-top:.857412em}div+div img+img,img+img,li ol,li ul{margin-top:0}ol,ul{list-style-position:outside;margin-bottom:.714285em;margin-left:2em;margin-top:.2857em;padding-left:0}li ol,li ul{margin-bottom:0}h1+ol,h1+ul,h2+ol,h2+ul,p+ol,p+ul{margin-top:-.428571em}blockquote{border-left:2px solid #bfbfbf;margin-bottom:1.4285em;margin-left:1.4285em;margin-top:1.4285em;padding-left:.714285em}code,pre{font-family:Monaco,Courier,monospace}cite{font-style:italic}table{font-size:1em}td,th{padding:.2em 2em .2em 0;text-align:left;vertical-align:top}button.en-ignore{margin-bottom:1em}.highlight{background:#c9f2d0;border:1px solid #62eb92}.Decrypted{background-color:#f7f7f7;padding:5px}.Decrypted .Header{color:#404040;font-family:gotham,helvetica,arial,sans-serif;font-size:11px;padding-bottom:5px}.Decrypted .Body{background-color:#fff;padding:5px}.canvas-container{background:url(/redesign/global/img/loading-spinner.gif) center center no-repeat #fff;border:1px solid #cacaca;margin-bottom:10px}",
                    keep_styles: false,
                    setup: function (ed) {
                        ed.on('FullscreenStateChanged', function (e) {
                            _this.fullscreen = e.state;
                            $(document).trigger('tinymceFullScreen', {
                                type: 'tinymceFullScreen',
                                message: 'fullscreen toogle',
                                time: new Date(),
                                state: e.state,
                                tinyMceId: id
                            });
                        });
                        ed.addButton('mysave', {
                            title: 'Save',
                            onclick: function () {
                                $(document).trigger('tinymceSave', {
                                    type: 'tinymceSave',
                                    message: 'save',
                                    time: new Date(),
                                    tinyMceId: id
                                });
                            }
                        });
                        ed.addButton('myexit', {
                            title: 'Close',
                            onclick: function () {
                                $(document).trigger('tinymceCancel', {
                                    type: 'tinymceCancel',
                                    message: 'cancel',
                                    time: new Date(),
                                    tinyMceId: id
                                });
                            }
                        });
                    }
                };
                if (loadFont) {
                    tinyMceInit.font_formats = 'Gotham=gotham,helvetica,sans-serif;Georgia=georgia,palatina,serif;Helvetica=helvetica,arial,sans-serif;Courier New=courier new,courier,monospace;';
                    tinyMceInit.font_formats += 'Times New Roman=times new roman,times,serif;Trebuchet=trebuchet ms,geneva,sans-serif;Verdena=verdana,helvetica,sans-serif;';
                    tinyMceInit.fontsize_formats = '8pt 10pt 12pt 14pt 18pt 24pt 36pt';
                }
                var themeOpt = _this.gmConfig.get('tinymceTheme') + '';
                switch (themeOpt) {
                    case 'Modern White':
                        tinyMceInit.skin_url = 'https://cdn.jsdelivr.net/gh/rbecheras/tinymce-skin-modern-light-flat@dd311f2e26b2d23f15caeecca364bfcd1c40f500/light';
                        break;
                    case 'Modern two':
                        tinyMceInit.skin_url = 'https://cdn.jsdelivr.net/gh/Vodzo/tinymce_theme@b1f6cc5afd13d939cb81844b8cf2edde151de998';
                        break;
                    case 'Charcoal':
                        tinyMceInit.skin_url = 'https://cdn.jsdelivr.net/gh/Vodzo/tinymce_charcoal_theme@8d5f045120f09011d8d4c19dcebeed93932edb13';
                        break;
                    case 'SS4':
                        tinyMceInit.skin_url = 'https://cdn.jsdelivr.net/gh/DrMartinGonzo/tinymce-ss4-theme@5442568702bf1b03453e4f161d1bd5d4e79d45e0/client/dist/TinyMCE_ss4';
                        break;
                    default:
                        tinyMceInit.skin_url = '';
                        break;
                }
                tinyMceInit.plugins = (tinyMceInit.plugins + ' -lists').trim();
                if (loadTable) {
                    tinyMceInit.plugins = (tinyMceInit.plugins + ' -table').trim();
                }
                if (loadCharmap) {
                    tinyMceInit.plugins = (tinyMceInit.plugins + ' -charmap').trim();
                }
                if (loadCode) {
                    tinyMceInit.plugins = (tinyMceInit.plugins + ' -code').trim();
                    tinyMceInit.code_dialog_width = parseInt(GM_config.get('tinymcePluginCodeWidth'), 10);
                    tinyMceInit.code_dialog_height = parseInt(GM_config.get('tinymcePluginCodeHeight'), 10);
                }
                if (loadFullscreen) {
                    tinyMceInit.plugins = (tinyMceInit.plugins + ' -fullscreen').trim();
                }
                if (loadEmoticons) {
                    tinyMceInit.plugins = (tinyMceInit.plugins + ' -emoticons').trim();
                }
                if (loadWordcount) {
                    tinyMceInit.plugins = (tinyMceInit.plugins + ' -wordcount').trim();
                }
                if (loadPrint) {
                    tinyMceInit.plugins = (tinyMceInit.plugins + ' -print').trim();
                }
                if (loadPreview) {
                    tinyMceInit.plugins = (tinyMceInit.plugins + ' -preview').trim();
                }
                if (loadInsertdatetime) {
                    tinyMceInit.plugins = (tinyMceInit.plugins + ' -insertdatetime').trim();
                }
                if (loadImage) {
                    tinyMceInit.plugins = (tinyMceInit.plugins + ' -image').trim();
                }
                if (loadSearchreplace) {
                    tinyMceInit.plugins = (tinyMceInit.plugins + ' -searchreplace').trim();
                }
                if (loadAdvlist) {
                    tinyMceInit.plugins = (tinyMceInit.plugins + ' -advlist').trim();
                }
                if (loadBbcode) {
                    tinyMceInit.plugins = (tinyMceInit.plugins + ' -bbcode').trim();
                }
                if (loadVisualblocks) {
                    tinyMceInit.plugins = (tinyMceInit.plugins + ' -visualblocks').trim();
                }
                if (loadVisualchars) {
                    tinyMceInit.plugins = (tinyMceInit.plugins + ' -visualchars').trim();
                }
                if (loadHilite) {
                    tinyMceInit.plugins = (tinyMceInit.plugins + ' -hilite').trim();
                }
                tinyMceInit.external_plugins = tinyMceExternalPlugins;
                tinyMceInit.style_formats_merge = true;
                tinyMceInit.style_formats = _this.getStyleFormats();
                tinymce.init(tinyMceInit);
            };
        }
        TinymceWork.prototype.getStyleFormats = function () {
            var sFmt = [];
            sFmt.push(this.getBlockContainers());
            sFmt.push(this.getFormatBlocks());
            return sFmt;
        };
        TinymceWork.prototype.getBlockContainers = function () {
            var c = { title: 'Containers', items: [
                    { title: 'section', block: 'section', wrapper: true, merge_siblings: false },
                    { title: 'article', block: 'article', wrapper: true, merge_siblings: false },
                    { title: 'blockquote', block: 'blockquote', wrapper: true },
                    { title: 'hgroup', block: 'hgroup', wrapper: true },
                    { title: 'aside', block: 'aside', wrapper: true },
                    { title: 'figure', block: 'figure', wrapper: true }
                ] };
            return c;
        };
        TinymceWork.prototype.getFormatBlocks = function () {
            var containers = {
                title: 'Formated Blocks'
            };
            containers.items = [];
            containers.items.push(this.getFormatCodeBlock());
            return containers;
        };
        TinymceWork.prototype.getFormatCodeBlock = function () {
            var codeBlock = {
                title: 'Code Block', block: 'div', wrapper: true, merge_siblings: true,
                styles: {
                    'box-sizing': 'border-box',
                    'padding': '8px',
                    'font-family': 'Monaco, Menlo, Consolas, \'Courier New\', monospace',
                    'font-size': '12px',
                    'color': '#333333',
                    'border-radius': '4px',
                    'background-color': '#fbfaf8',
                    'border': '1px solid rgba(0, 0, 0, 0.15)',
                    '-en-codeblock': 'true' 
                }
            };
            return codeBlock;
        };
        return TinymceWork;
    }());


    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var management = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventManagement =  (function () {
        function EventManagement(unsub) {
            this.unsub = unsub;
            this.propagationStopped = false;
        }
        EventManagement.prototype.stopPropagation = function () {
            this.propagationStopped = true;
        };
        return EventManagement;
    }());
    exports.EventManagement = EventManagement;
    });

    unwrapExports(management);
    var management_1 = management.EventManagement;

    var subscription = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Subscription =  (function () {
        function Subscription(handler, isOnce) {
            this.handler = handler;
            this.isOnce = isOnce;
            this.isExecuted = false;
        }
        Subscription.prototype.execute = function (executeAsync, scope, args) {
            if (!this.isOnce || !this.isExecuted) {
                this.isExecuted = true;
                var fn = this.handler;
                if (executeAsync) {
                    setTimeout(function () {
                        fn.apply(scope, args);
                    }, 1);
                }
                else {
                    fn.apply(scope, args);
                }
            }
        };
        return Subscription;
    }());
    exports.Subscription = Subscription;
    });

    unwrapExports(subscription);
    var subscription_1 = subscription.Subscription;

    var dispatching = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var DispatcherBase =  (function () {
        function DispatcherBase() {
            this._wrap = new DispatcherWrapper(this);
            this._subscriptions = new Array();
        }
        DispatcherBase.prototype.subscribe = function (fn) {
            var _this = this;
            if (fn) {
                this._subscriptions.push(new subscription.Subscription(fn, false));
            }
            return function () {
                _this.unsubscribe(fn);
            };
        };
        DispatcherBase.prototype.sub = function (fn) {
            return this.subscribe(fn);
        };
        DispatcherBase.prototype.one = function (fn) {
            var _this = this;
            if (fn) {
                this._subscriptions.push(new subscription.Subscription(fn, true));
            }
            return function () {
                _this.unsubscribe(fn);
            };
        };
        DispatcherBase.prototype.has = function (fn) {
            if (!fn)
                return false;
            return this._subscriptions.some(function (sub) { return sub.handler == fn; });
        };
        DispatcherBase.prototype.unsubscribe = function (fn) {
            if (!fn)
                return;
            for (var i = 0; i < this._subscriptions.length; i++) {
                if (this._subscriptions[i].handler == fn) {
                    this._subscriptions.splice(i, 1);
                    break;
                }
            }
        };
        DispatcherBase.prototype.unsub = function (fn) {
            this.unsubscribe(fn);
        };
        DispatcherBase.prototype._dispatch = function (executeAsync, scope, args) {
            var _this = this;
            var _loop_1 = function (sub) {
                var ev = new management.EventManagement(function () { return _this.unsub(sub.handler); });
                var nargs = Array.prototype.slice.call(args);
                nargs.push(ev);
                sub.execute(executeAsync, scope, nargs);
                this_1.cleanup(sub);
                if (!executeAsync && ev.propagationStopped) {
                    return "break";
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = this._subscriptions.slice(); _i < _a.length; _i++) {
                var sub = _a[_i];
                var state_1 = _loop_1(sub);
                if (state_1 === "break")
                    break;
            }
        };
        DispatcherBase.prototype.cleanup = function (sub) {
            if (sub.isOnce && sub.isExecuted) {
                var i = this._subscriptions.indexOf(sub);
                if (i > -1) {
                    this._subscriptions.splice(i, 1);
                }
            }
        };
        DispatcherBase.prototype.asEvent = function () {
            return this._wrap;
        };
        DispatcherBase.prototype.clear = function () {
            this._subscriptions.splice(0, this._subscriptions.length);
        };
        return DispatcherBase;
    }());
    exports.DispatcherBase = DispatcherBase;
    var EventListBase =  (function () {
        function EventListBase() {
            this._events = {};
        }
        EventListBase.prototype.get = function (name) {
            var event = this._events[name];
            if (event) {
                return event;
            }
            event = this.createDispatcher();
            this._events[name] = event;
            return event;
        };
        EventListBase.prototype.remove = function (name) {
            delete this._events[name];
        };
        return EventListBase;
    }());
    exports.EventListBase = EventListBase;
    var DispatcherWrapper =  (function () {
        function DispatcherWrapper(dispatcher) {
            this._subscribe = function (fn) { return dispatcher.subscribe(fn); };
            this._unsubscribe = function (fn) { return dispatcher.unsubscribe(fn); };
            this._one = function (fn) { return dispatcher.one(fn); };
            this._has = function (fn) { return dispatcher.has(fn); };
            this._clear = function () { return dispatcher.clear(); };
        }
        DispatcherWrapper.prototype.subscribe = function (fn) {
            return this._subscribe(fn);
        };
        DispatcherWrapper.prototype.sub = function (fn) {
            return this.subscribe(fn);
        };
        DispatcherWrapper.prototype.unsubscribe = function (fn) {
            this._unsubscribe(fn);
        };
        DispatcherWrapper.prototype.unsub = function (fn) {
            this.unsubscribe(fn);
        };
        DispatcherWrapper.prototype.one = function (fn) {
            return this._one(fn);
        };
        DispatcherWrapper.prototype.has = function (fn) {
            return this._has(fn);
        };
        DispatcherWrapper.prototype.clear = function () {
            this._clear();
        };
        return DispatcherWrapper;
    }());
    exports.DispatcherWrapper = DispatcherWrapper;
    });

    unwrapExports(dispatching);
    var dispatching_1 = dispatching.DispatcherBase;
    var dispatching_2 = dispatching.EventListBase;
    var dispatching_3 = dispatching.DispatcherWrapper;

    var dist = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", { value: true });

    exports.DispatcherBase = dispatching.DispatcherBase;
    exports.DispatcherWrapper = dispatching.DispatcherWrapper;
    exports.EventListBase = dispatching.EventListBase;

    exports.Subscription = subscription.Subscription;
    });

    unwrapExports(dist);
    var dist_1 = dist.DispatcherBase;
    var dist_2 = dist.DispatcherWrapper;
    var dist_3 = dist.EventListBase;
    var dist_4 = dist.Subscription;

    var events = createCommonjsModule(function (module, exports) {
    var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventDispatcher =  (function (_super) {
        __extends(EventDispatcher, _super);
        function EventDispatcher() {
            return _super.call(this) || this;
        }
        EventDispatcher.prototype.dispatch = function (sender, args) {
            this._dispatch(false, this, arguments);
        };
        EventDispatcher.prototype.dispatchAsync = function (sender, args) {
            this._dispatch(true, this, arguments);
        };
        EventDispatcher.prototype.asEvent = function () {
            return _super.prototype.asEvent.call(this);
        };
        return EventDispatcher;
    }(dist.DispatcherBase));
    exports.EventDispatcher = EventDispatcher;
    var EventList =  (function (_super) {
        __extends(EventList, _super);
        function EventList() {
            return _super.call(this) || this;
        }
        EventList.prototype.createDispatcher = function () {
            return new EventDispatcher();
        };
        return EventList;
    }(dist.EventListBase));
    exports.EventList = EventList;
    var EventHandlingBase =  (function () {
        function EventHandlingBase() {
            this._events = new EventList();
        }
        Object.defineProperty(EventHandlingBase.prototype, "events", {
            get: function () {
                return this._events;
            },
            enumerable: true,
            configurable: true
        });
        EventHandlingBase.prototype.subscribe = function (name, fn) {
            this._events.get(name).subscribe(fn);
        };
        EventHandlingBase.prototype.sub = function (name, fn) {
            this.subscribe(name, fn);
        };
        EventHandlingBase.prototype.unsubscribe = function (name, fn) {
            this._events.get(name).unsubscribe(fn);
        };
        EventHandlingBase.prototype.unsub = function (name, fn) {
            this.unsubscribe(name, fn);
        };
        EventHandlingBase.prototype.one = function (name, fn) {
            this._events.get(name).one(fn);
        };
        EventHandlingBase.prototype.has = function (name, fn) {
            return this._events.get(name).has(fn);
        };
        return EventHandlingBase;
    }());
    exports.EventHandlingBase = EventHandlingBase;
    });

    unwrapExports(events);
    var events_1 = events.EventDispatcher;
    var events_2 = events.EventList;
    var events_3 = events.EventHandlingBase;

    var dist$1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    exports.EventDispatcher = events.EventDispatcher;
    exports.EventHandlingBase = events.EventHandlingBase;
    exports.EventList = events.EventList;
    });

    unwrapExports(dist$1);
    var dist_1$1 = dist$1.EventDispatcher;
    var dist_2$1 = dist$1.EventHandlingBase;
    var dist_3$1 = dist$1.EventList;

    var simpleEvents = createCommonjsModule(function (module, exports) {
    var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    var SimpleEventDispatcher =  (function (_super) {
        __extends(SimpleEventDispatcher, _super);
        function SimpleEventDispatcher() {
            return _super.call(this) || this;
        }
        SimpleEventDispatcher.prototype.dispatch = function (args) {
            this._dispatch(false, this, arguments);
        };
        SimpleEventDispatcher.prototype.dispatchAsync = function (args) {
            this._dispatch(true, this, arguments);
        };
        SimpleEventDispatcher.prototype.asEvent = function () {
            return _super.prototype.asEvent.call(this);
        };
        return SimpleEventDispatcher;
    }(dist.DispatcherBase));
    exports.SimpleEventDispatcher = SimpleEventDispatcher;
    var SimpleEventList =  (function (_super) {
        __extends(SimpleEventList, _super);
        function SimpleEventList() {
            return _super.call(this) || this;
        }
        SimpleEventList.prototype.createDispatcher = function () {
            return new SimpleEventDispatcher();
        };
        return SimpleEventList;
    }(dist.EventListBase));
    exports.SimpleEventList = SimpleEventList;
    var SimpleEventHandlingBase =  (function () {
        function SimpleEventHandlingBase() {
            this._events = new SimpleEventList();
        }
        Object.defineProperty(SimpleEventHandlingBase.prototype, "events", {
            get: function () {
                return this._events;
            },
            enumerable: true,
            configurable: true
        });
        SimpleEventHandlingBase.prototype.subscribe = function (name, fn) {
            this._events.get(name).subscribe(fn);
        };
        SimpleEventHandlingBase.prototype.sub = function (name, fn) {
            this.subscribe(name, fn);
        };
        SimpleEventHandlingBase.prototype.one = function (name, fn) {
            this._events.get(name).one(fn);
        };
        SimpleEventHandlingBase.prototype.has = function (name, fn) {
            return this._events.get(name).has(fn);
        };
        SimpleEventHandlingBase.prototype.unsubscribe = function (name, fn) {
            this._events.get(name).unsubscribe(fn);
        };
        SimpleEventHandlingBase.prototype.unsub = function (name, fn) {
            this.unsubscribe(name, fn);
        };
        return SimpleEventHandlingBase;
    }());
    exports.SimpleEventHandlingBase = SimpleEventHandlingBase;
    });

    unwrapExports(simpleEvents);
    var simpleEvents_1 = simpleEvents.SimpleEventDispatcher;
    var simpleEvents_2 = simpleEvents.SimpleEventList;
    var simpleEvents_3 = simpleEvents.SimpleEventHandlingBase;

    var dist$2 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    exports.SimpleEventDispatcher = simpleEvents.SimpleEventDispatcher;
    exports.SimpleEventHandlingBase = simpleEvents.SimpleEventHandlingBase;
    exports.SimpleEventList = simpleEvents.SimpleEventList;
    });

    unwrapExports(dist$2);
    var dist_1$2 = dist$2.SimpleEventDispatcher;
    var dist_2$2 = dist$2.SimpleEventHandlingBase;
    var dist_3$2 = dist$2.SimpleEventList;

    var signals = createCommonjsModule(function (module, exports) {
    var __extends = (commonjsGlobal && commonjsGlobal.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    var SignalDispatcher =  (function (_super) {
        __extends(SignalDispatcher, _super);
        function SignalDispatcher() {
            return _super.call(this) || this;
        }
        SignalDispatcher.prototype.dispatch = function () {
            this._dispatch(false, this, arguments);
        };
        SignalDispatcher.prototype.dispatchAsync = function () {
            this._dispatch(true, this, arguments);
        };
        SignalDispatcher.prototype.asEvent = function () {
            return _super.prototype.asEvent.call(this);
        };
        return SignalDispatcher;
    }(dist.DispatcherBase));
    exports.SignalDispatcher = SignalDispatcher;
    var SignalList =  (function (_super) {
        __extends(SignalList, _super);
        function SignalList() {
            return _super.call(this) || this;
        }
        SignalList.prototype.createDispatcher = function () {
            return new SignalDispatcher();
        };
        return SignalList;
    }(dist.EventListBase));
    exports.SignalList = SignalList;
    var SignalHandlingBase =  (function () {
        function SignalHandlingBase() {
            this._events = new SignalList();
        }
        Object.defineProperty(SignalHandlingBase.prototype, "events", {
            get: function () {
                return this._events;
            },
            enumerable: true,
            configurable: true
        });
        SignalHandlingBase.prototype.one = function (name, fn) {
            this._events.get(name).one(fn);
        };
        SignalHandlingBase.prototype.has = function (name, fn) {
            return this._events.get(name).has(fn);
        };
        SignalHandlingBase.prototype.subscribe = function (name, fn) {
            this._events.get(name).subscribe(fn);
        };
        SignalHandlingBase.prototype.sub = function (name, fn) {
            this.subscribe(name, fn);
        };
        SignalHandlingBase.prototype.unsubscribe = function (name, fn) {
            this._events.get(name).unsubscribe(fn);
        };
        SignalHandlingBase.prototype.unsub = function (name, fn) {
            this.unsubscribe(name, fn);
        };
        return SignalHandlingBase;
    }());
    exports.SignalHandlingBase = SignalHandlingBase;
    });

    unwrapExports(signals);
    var signals_1 = signals.SignalDispatcher;
    var signals_2 = signals.SignalList;
    var signals_3 = signals.SignalHandlingBase;

    var dist$3 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });

    exports.SignalDispatcher = signals.SignalDispatcher;
    exports.SignalHandlingBase = signals.SignalHandlingBase;
    exports.SignalList = signals.SignalList;
    });

    unwrapExports(dist$3);
    var dist_1$3 = dist$3.SignalDispatcher;
    var dist_2$3 = dist$3.SignalHandlingBase;
    var dist_3$3 = dist$3.SignalList;

    var dist$4 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", { value: true });

    exports.DispatcherBase = dist.DispatcherBase;
    exports.DispatcherWrapper = dist.DispatcherWrapper;
    exports.EventListBase = dist.EventListBase;
    exports.Subscription = dist.Subscription;

    exports.EventDispatcher = dist$1.EventDispatcher;
    exports.EventHandlingBase = dist$1.EventHandlingBase;
    exports.EventList = dist$1.EventList;

    exports.SimpleEventDispatcher = dist$2.SimpleEventDispatcher;
    exports.SimpleEventHandlingBase = dist$2.SimpleEventHandlingBase;
    exports.SimpleEventList = dist$2.SimpleEventList;

    exports.SignalDispatcher = dist$3.SignalDispatcher;
    exports.SignalHandlingBase = dist$3.SignalHandlingBase;
    exports.SignalList = dist$3.SignalList;
    });

    unwrapExports(dist$4);
    var dist_1$4 = dist$4.DispatcherBase;
    var dist_2$4 = dist$4.DispatcherWrapper;
    var dist_3$4 = dist$4.EventListBase;
    var dist_4$1 = dist$4.Subscription;
    var dist_5 = dist$4.EventDispatcher;
    var dist_6 = dist$4.EventHandlingBase;
    var dist_7 = dist$4.EventList;
    var dist_8 = dist$4.SimpleEventDispatcher;
    var dist_9 = dist$4.SimpleEventHandlingBase;
    var dist_10 = dist$4.SimpleEventList;
    var dist_11 = dist$4.SignalDispatcher;
    var dist_12 = dist$4.SignalHandlingBase;
    var dist_13 = dist$4.SignalList;
    var EventArgs =  (function () {
        function EventArgs() {
            this.cancel = false;
        }
        return EventArgs;
    }());

    var IntervalEventArgs =  (function (_super) {
        __extends(IntervalEventArgs, _super);
        function IntervalEventArgs(ticks, interval) {
            if (interval === void 0) { interval = 0; }
            var _this = _super.call(this) || this;
            _this.lCount = ticks;
            _this.lInterval = interval;
            return _this;
        }
        Object.defineProperty(IntervalEventArgs.prototype, "count", {
            get: function () {
                return this.lCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IntervalEventArgs.prototype, "interval", {
            get: function () {
                return this.lInterval;
            },
            enumerable: true,
            configurable: true
        });
        return IntervalEventArgs;
    }(EventArgs));
    var exceptionMessages = {
        argLessThenZero: 'Argument "{0}" must to be zero or greater',
        argLessThenOne: 'Argument "{0}" must be one or greater',
        argEmptyString: 'Argument "{0}" is not allowed to be an empty string',
        argKeyExist: 'Argument "{0}" invalid key. Key "{1}" already exist.'
    };

    Number.prototype.thousandsSeperator = function () {
        return Number(this).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    String.Format = function (str) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return str.replace(/{(\d+)}/g, function (match, index) { return args[index] || ''; });
    };
    var Interval =  (function () {
        function Interval(interval, maxCount) {
            var _this = this;
            this.edOnTick = new dist_5();
            this.edOnTickExpired = new dist_5();
            this.lTick = 0;
            this.lIsDisposed = false;
            this.isAtInterval = function () {
                return _this.lTick > _this.lMaxTick;
            };
            this.lMaxTick = maxCount;
            this.lIntervalTime = interval;
            if (this.lIntervalTime < 0) {
                throw new RangeError(String.Format(exceptionMessages.argLessThenZero, 'interval'));
            }
            if (this.lMaxTick < 1) {
                return;
            }
            this.startInterval();
        }
        Interval.prototype.onTick = function () {
            return this.edOnTick.asEvent();
        };
        Interval.prototype.onExpired = function () {
            return this.edOnTickExpired.asEvent();
        };
        Interval.prototype.dispose = function () {
            if (this.lIsDisposed === true) {
                return;
            }
            try {
                if (this.lInterval) {
                    clearInterval(this.lInterval);
                }
            }
            finally {
                this.lMaxTick = 0;
                this.lIntervalTime = 0;
                this.lMaxTick = 0;
                this.lIsDisposed = true;
            }
        };
        Object.defineProperty(Interval.prototype, "isDisposed", {
            get: function () {
                return this.lIsDisposed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Interval.prototype, "count", {
            get: function () {
                return this.lTick;
            },
            enumerable: true,
            configurable: true
        });
        Interval.prototype.startInterval = function () {
            var _this = this;
            this.lInterval = setInterval(function () {
                _this.tick();
            }, this.lIntervalTime);
        };
        Interval.prototype.onTickTock = function (eventArgs) {
            if (eventArgs.cancel === true) {
                return;
            }
            return;
        };
        Interval.prototype.onTicks = function (eventArgs) {
            if (eventArgs.cancel === true) {
                return;
            }
            return;
        };
        Interval.prototype.onTickExpired = function (eventArgs) {
            if (eventArgs.cancel === true) {
                return;
            }
            return;
        };
        Interval.prototype.tick = function () {
            this.lTick += 1;
            var eventArgs = new IntervalEventArgs(this.lTick, this.lIntervalTime);
            this.onTicks(eventArgs);
            if (this.isAtInterval()) {
                if (this.lInterval) {
                    clearInterval(this.lInterval);
                }
                this.onTickExpired(eventArgs);
                if (eventArgs.cancel === true) {
                    return;
                }
                this.edOnTickExpired.dispatch(this, eventArgs);
            }
            else {
                this.onTickTock(eventArgs);
                if (eventArgs.cancel === true) {
                    return;
                }
                this.edOnTick.dispatch(this, eventArgs);
            }
        };
        return Interval;
    }());
    var IntervalManual =  (function (_super) {
        __extends(IntervalManual, _super);
        function IntervalManual(interval, maxCount) {
            var _this = _super.call(this, interval, maxCount) || this;
            _this.lIsStarted = false;
            return _this;
        }
        IntervalManual.prototype.start = function () {
            if (this.isStarted === true) {
                return;
            }
            this.lIsStarted = true;
            _super.prototype.startInterval.call(this);
        };
        IntervalManual.prototype.dispose = function () {
            this.lIsStarted = false;
            _super.prototype.dispose.call(this);
        };
        Object.defineProperty(IntervalManual.prototype, "isStarted", {
            get: function () {
                return this.lIsStarted;
            },
            enumerable: true,
            configurable: true
        });
        IntervalManual.prototype.startInterval = function () {
        };
        return IntervalManual;
    }(Interval));
    var Evernote =  (function () {
        function Evernote() {
            var _this = this;
            this.btnSelector = '';
            this.iframeSelector = '';
            this.noteSelector = '';
            this.tinymceDivId = '';
            this.fullScreen = false;
            this.TMCE = new TinymceWork();
            this.init = function () {
                _this.allScriptsLoaded();
            };
            this.onTinymceInit = function (e) {
                Log.message(appSettings.shortName + ': Tiny Mce Init was triggered');
            };
            this.onTinymceSave = function (e, data) {
                if (data.tinyMceId === appSettings.tinyId) {
                    _this.save();
                    _this.lightBoxReset();
                    var ed = tinymce__default.EditorManager.editors[data.tinyMceId];
                    if (!ed) {
                        Log.error(methodName + ": Editor was not found and is null. Param e, data", [e, data]);
                    }
                    ed.setContent(''); 
                }
            };
            this.onTinymceCancel = function (e, data) {
                if (data.tinyMceId === appSettings.tinyId) {
                    var ed = tinymce__default.EditorManager.editors[data.tinyMceId];
                    if (!ed) {
                        Log.error(methodName + ": Editor was not found and is null. Params e, data", [e, data]);
                    }
                    var confirm_1 = GM_config.get('tinymceConfirmNoSaveExit');
                    if (confirm_1) {
                        if (_this.confirmExit()) {
                            _this.lightBoxReset();
                            ed.setContent(''); 
                        }
                    }
                    else {
                        _this.lightBoxReset();
                        ed.setContent(''); 
                    }
                }
            };
            this.onTinyMceFulllscreen = function (e, data) {
                if (data.tinyMceId === appSettings.tinyId) {
                    _this.getTinymceDivId();
                    _this.fullScreen = e.state;
                    if (data.state) {
                        if ($('#tinybox').hasClass('gmbox-window')) {
                            $('#tinybox').removeClass('gmbox-window');
                        }
                    }
                    else {
                        if (!$('#tinybox').hasClass('gmbox-window')) {
                            $('#tinybox').addClass('gmbox-window');
                        }
                    }
                }
            };
            this.confirmExit = function () {
                return confirm('Are you sure you want to close this editor?');
            };
            this.save = function () {
                var k = appSettings.tinyId;
                var ed = tinymce__default.EditorManager.editors[k];
                var e = ed.getContent();
                $('.gmbackdrop, .gmbox').animate({
                    opacity: '0'
                }, 300, 'linear', function () {
                    $('.gmbackdrop, .gmbox').css('display', 'none');
                });
                var content = $(_this.iframeSelector).contents().find(_this.noteSelector);
                content.html(e);
                $('textarea#gminput').val(''), ed.setContent('');
            };
        }
        Evernote.prototype.allScriptsLoaded = function () {
            Log.message(appSettings.shortName + ': all scripts have been loaded.');
            this.btnSelector = '//*[@id="gwt-debug-NoteAttributesView-root"]/div[1]/div[1]';
            if (/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) {
                this.iframeSelector = '.RichTextArea-entinymce';
                this.noteSelector = 'body';
            }
            else {
                this.iframeSelector = '.RichTextArea-entinymce';
                this.noteSelector = 'body';
            }
            this.ensurePlugins();
            this.addToolbarButton();
            $(document).on('editBtnAdded', this.onEditBtnAdded);
            $(document).on('tinymceInit', this.onTinymceInit);
            $(document).on('tinymceSave', this.onTinymceSave);
            $(document).on('tinymceCancel', this.onTinymceCancel);
            $(document).on('tinymceFullScreen', this.onTinyMceFulllscreen);
            this.TMCE.init();
            var intGmboxPadLeft = parseInt($('.gmbox').css('padding-left'), 10);
            var intGmboxPadRight = parseInt($('.gmbox').css('padding-right'), 10);
            var intTinymceWidth = parseInt(GM_config.get('tinymceWidth'), 10);
            intTinymceWidth = intTinymceWidth - (intGmboxPadLeft + intGmboxPadRight);
            $('.gmbox-window').width(intTinymceWidth);
            $('.gmclose').click(function () {
                $(document).trigger('tinymceCancel', {
                    message: 'cancel',
                    tinyMceId: appSettings.tinyId
                });
            });
        };
        Evernote.prototype.onEditBtnAdded = function () {
            Log.message(appSettings.shortName + ': onEditBtnAdded event fired');
            this.addButtonClick();
        };
        Evernote.prototype.addButtonClick = function () {
            var _this = this;
            if ($('#gm-edit-btn').length) {
                $('#gm-edit-btn').click(function () {
                    var k = appSettings.tinyId;
                    var ed = tinymce__default.EditorManager.editors[k];
                    if (_this.fullScreen) {
                        ed.execCommand('mceFullScreen');
                    }
                    ed.setContent($(_this.iframeSelector).contents().find(_this.noteSelector).html());
                    $('.gmbackdrop, .gmbox').animate({
                        opacity: '.50'
                    }, 300, 'linear');
                    $('.gmbox').animate({
                        opacity: '1.00'
                    }, 300, 'linear');
                    $('.gmbackdrop, .gmbox').css('display', 'block');
                });
                Log.message(appSettings.shortName + ": Edit Button Click added");
            }
            else {
                Log.error(appSettings.shortName + ": addButtonClick: #gm-edit-btn was not found");
            }
        };
        Evernote.prototype.addToolbarButton = function () {
            var _this = this;
            var ivm = new IntervalManual(500, 20);
            var tickCount = 0;
            ivm.onTick().subscribe(function (sender, args) {
                tickCount++;
                Log.message(appSettings.shortName + ": try no. " + tickCount + " to find element for button pacement");
                var objElement = $(document.body).xpath(_this.btnSelector);
                if (objElement.length) {
                    ivm.dispose();
                    Log.message(appSettings.shortName + ": Found element for button placement on " + tickCount + " try");
                    objElement.append(_this.createToolbarHtml());
                    _this.onEditBtnAdded();
                }
            });
            ivm.onExpired().subscribe(function (sender, args) {
                Log.error(methodName + ": unable to located selector for main button after " + args.count + " attempts");
            });
            ivm.start();
        };
        Evernote.prototype.lightBoxReset = function () {
            $('.gmbackdrop, .gmbox').animate({
                opacity: '0'
            }, 300, 'linear', function () {
                $('.gmbackdrop, .gmbox').css('display', 'none');
            });
            $('textarea#gminput').val(''); 
        };
        Evernote.prototype.ensurePlugins = function () {
            if (typeof ($.fn.tagName) === 'undefined') {
                $.fn.tagName = function (toLower) {
                    var tn = this.prop('tagName');
                    if (toLower) {
                        tn = tn.toLowerCase();
                    }
                    return tn;
                };
            }
        };
        Evernote.prototype.createToolbarHtml = function () {
            var css = ''; 
            var btnHtml = "<div tabindex=\"0\" id=\"gm-edit-btn\" style=\"display:inline-block;\" name=\"gm-edit-btn\" class=\"gm-btn\"></div>";
            var html = '';
            html += "<div tabindex=\"0\" id=\"gm-tb\" title=\"Edit with TinyMCE\" style=\"" + css + "\">" + btnHtml + "</div>";
            return html;
        };
        Evernote.prototype.getTinymceDivId = function () {
            if (this.tinymceDivId.length > 0) {
                return this.tinymceDivId;
            }
            var div = $("div#" + appSettings.fullScreenRealId + " :first-child");
            if (div.length > 0) {
                this.tinymceDivId = div.attr('id') + '';
            }
            return this.tinymceDivId;
        };
        return Evernote;
    }());

    var ElementLoaderEventArgs =  (function (_super) {
        __extends(ElementLoaderEventArgs, _super);
        function ElementLoaderEventArgs(key, elmArgs) {
            var _this = _super.call(this) || this;
            _this.loadFailed = false;
            _this.lInterval = 0;
            _this.lCount = 0;
            _this.lkey = key;
            _this.elementArgs = elmArgs;
            _this.lCount = elmArgs.count;
            _this.lInterval = elmArgs.interval;
            return _this;
        }
        Object.defineProperty(ElementLoaderEventArgs.prototype, "count", {
            get: function () {
                return this.lCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementLoaderEventArgs.prototype, "key", {
            get: function () {
                return this.lkey;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ElementLoaderEventArgs.prototype, "interval", {
            get: function () {
                return this.lInterval;
            },
            enumerable: true,
            configurable: true
        });
        return ElementLoaderEventArgs;
    }(EventArgs));
    var ElementsLoadedArgs =  (function (_super) {
        __extends(ElementsLoadedArgs, _super);
        function ElementsLoadedArgs(numOfScripts) {
            var _this = _super.call(this) || this;
            _this.lTotalScripts = 0;
            _this.lTotalScripts = numOfScripts;
            return _this;
        }
        Object.defineProperty(ElementsLoadedArgs.prototype, "totalNumberOfScripts", {
            get: function () {
                return this.lTotalScripts;
            },
            enumerable: true,
            configurable: true
        });
        return ElementsLoadedArgs;
    }(EventArgs));
    var ElementsLoadFailArgs =  (function (_super) {
        __extends(ElementsLoadFailArgs, _super);
        function ElementsLoadFailArgs(numOfScripts, remainingScripts) {
            var _this = _super.call(this, numOfScripts) || this;
            _this.lRemainingEvents = remainingScripts;
            return _this;
        }
        Object.defineProperty(ElementsLoadFailArgs.prototype, "remainingEvents", {
            get: function () {
                return this.lRemainingEvents;
            },
            enumerable: true,
            configurable: true
        });
        return ElementsLoadFailArgs;
    }(ElementsLoadedArgs));

    var ElementLoader =  (function () {
        function ElementLoader() {
            this.lTotalScripts = 0; 
            this.lEventsFailed = [];
            this.lOnElementLoaded = new dist_5();
            this.lOnAllElementLoaded = new dist_5();
            this.lOnElementLoadFail = new dist_5();
            this.lOnTick = new dist_5();
            this.lOnTickExpired = new dist_5();
            this.lEvents = {};
        }
        ElementLoader.prototype.addElement = function (key, e) {
            if (key.length === 0) {
                Log.error(appSettings.shortName + ": addElement: key argument can not be an empty string");
                return;
            }
            if (this.lEvents.hasOwnProperty(key)) {
                Log.error(appSettings.shortName + ": addElement: key " + key + " is already in the list of elemets and can not be added again");
                return;
            }
            this.lEvents[key] = e;
            this.lTotalScripts++;
        };
        ElementLoader.prototype.hasElement = function (key) {
            if (key.length === 0) {
                Log.debugWarn(appSettings.shortName + ": addElement: key is empty");
                return false;
            }
            var reslut = this.lEvents.hasOwnProperty(key);
            return reslut;
        };
        ElementLoader.prototype.onAllElementsLoaded = function () {
            return this.lOnAllElementLoaded.asEvent();
        };
        ElementLoader.prototype.onElementsLoadFail = function () {
            return this.lOnElementLoadFail.asEvent();
        };
        ElementLoader.prototype.onElementLoaded = function () {
            return this.lOnElementLoaded.asEvent();
        };
        ElementLoader.prototype.onTick = function () {
            return this.lOnTick.asEvent();
        };
        ElementLoader.prototype.onTickExpired = function () {
            return this.lOnTickExpired.asEvent();
        };
        ElementLoader.prototype.start = function () {
            var _this = this;
            var onBeforeStartEventArgs = new EventArgs();
            this.onBeforeStart(onBeforeStartEventArgs);
            if (onBeforeStartEventArgs.cancel === true) {
                return;
            }
            var _loop_1 = function (key) {
                if (this_1.lEvents.hasOwnProperty(key)) {
                    var element = this_1.lEvents[key];
                    element.onTick().subscribe(function (sender, args) {
                        var eArgs = new ElementLoaderEventArgs(key, args);
                        _this.tick(eArgs);
                        if (eArgs.cancel === true) {
                            return;
                        }
                        _this.lOnTick.dispatch(_this, eArgs);
                    });
                    element.onExpired().subscribe(function (sender, args) {
                        var eArgs = new ElementLoaderEventArgs(key, args);
                        sender.dispose();
                        _this.tickExpired(eArgs);
                        if (eArgs.cancel === true) {
                            return;
                        }
                        _this.lOnTickExpired.dispatch(_this, eArgs);
                    });
                    element.onElementLoaded().subscribe(function (sender, args) {
                        var eArgs = new ElementLoaderEventArgs(key, args);
                        sender.dispose();
                        _this.elementLoaded(eArgs);
                        if (eArgs.cancel === true) {
                            return;
                        }
                        _this.lOnElementLoaded.dispatch(_this, eArgs);
                    });
                    element.start();
                }
            };
            var this_1 = this;
            for (var key in this.lEvents) {
                _loop_1(key);
            }
            this.onAfterStart(new EventArgs());
        };
        ElementLoader.prototype.dispose = function () {
            for (var key in this.lEvents) {
                if (this.lEvents.hasOwnProperty(key)) {
                    var el = this.lEvents[key];
                    if (el.isDisposed === false) {
                        el.dispose();
                    }
                }
            }
            this.lEvents = {};
        };
        ElementLoader.prototype.onBeforeStart = function (args) {
            return;
        };
        ElementLoader.prototype.onAfterStart = function (args) {
            return;
        };
        ElementLoader.prototype.elementLoaded = function (args) {
            if (this.lEvents.hasOwnProperty(args.key) === false) {
                Log.error(appSettings.shortName + ": elementLoaded: key " + args.key + " was not found to delete. This may be a serious error");
                return;
            }
            else {
                delete this.lEvents[args.key];
            }
            this.goForFinish();
        };
        ElementLoader.prototype.tick = function (args) {
            return;
        };
        ElementLoader.prototype.tickExpired = function (args) {
            args.loadFailed = true;
            this.lEventsFailed.push(args.key);
            if (this.lEvents.hasOwnProperty(args.key) === false) {
                Log.error(appSettings.shortName + ": tickExpired: key " + args.key + " was not found to delete. This may be a serious error");
                return;
            }
            else {
                delete this.lEvents[args.key];
            }
            this.goForFinish();
            return;
        };
        ElementLoader.prototype.allElementsLoaded = function (args) {
            if (this.lEventsFailed.length > 0) {
                args.cancel = true;
                var eArgs = new ElementsLoadFailArgs(this.lTotalScripts, this.lEventsFailed);
                this.lOnElementLoadFail.dispatch(this, eArgs);
            }
            return;
        };
        ElementLoader.prototype.goForFinish = function () {
            var done = this.isElementsLoaded();
            if (done) {
                var eArgs = new ElementsLoadedArgs(this.lTotalScripts);
                this.allElementsLoaded(eArgs);
                if (eArgs.cancel === false) {
                    this.lOnAllElementLoaded.dispatch(this, eArgs);
                }
            }
            else {
            }
        };
        ElementLoader.prototype.isElementsLoaded = function () {
            for (var key in this.lEvents) {
                if (this.lEvents[key]) {
                    return false;
                }
            }
            return true;
        };
        return ElementLoader;
    }());
    var utilFnAsStringExist = function (fnstring) {
        var fn = window[fnstring];
        if (typeof fn === 'function') {
            return true;
        }
        else {
            return false;
        }
    };
    var utilFnArrayExist = function (fnArray) {
        if (fnArray.length === 0) {
            return true;
        }
        var result = true;
        for (var fn in fnArray) {
            if (fnArray.hasOwnProperty(fn)) {
                var testFn = fnArray[fn];
                result = result && utilFnAsStringExist(testFn);
            }
        }
        return result;
    };
    var utilCreateElement = function (tag) {
        var D = document;
        var node = D.createElement(tag);
        return node;
    };
    var BaseElementLoad =  (function (_super) {
        __extends(BaseElementLoad, _super);
        function BaseElementLoad(interval, maxCount) {
            if (interval === void 0) { interval = 500; }
            if (maxCount === void 0) { maxCount = 30; }
            var _this = _super.call(this, interval, maxCount) || this;
            _this.ptIsLoaded = false;
            _this.elementLoaded = new dist_1$1();
            return _this;
        }
        BaseElementLoad.prototype.onElementLoaded = function () {
            return this.elementLoaded.asEvent();
        };
        BaseElementLoad.prototype.fnAsStringExist = function (fnstring) {
            return utilFnAsStringExist(fnstring);
        };
        BaseElementLoad.prototype.fnArrayExist = function (fnArray) {
            return utilFnArrayExist(fnArray);
        };
        return BaseElementLoad;
    }(IntervalManual));

    var elementAddToDoc = function (e, nodeLocation) {
        var D = document;
        var targ;
        switch (nodeLocation) {
            case ElementLocation.body:
                targ = D.getElementsByTagName('body')[0] || D.body;
                break;
            case ElementLocation.head:
                targ = D.getElementsByTagName('head')[0] || D.head;
                break;
            default:
                targ = D.getElementsByTagName('body')[0] || D.body || D.documentElement;
                break;
        }
        targ.appendChild(e);
    };
    var elementCreate = function (args) {
        var htmlNode = utilCreateElement(args.elementTag); 
        if (args.elementAttributes) {
            for (var key in args.elementAttributes) {
                if (args.elementAttributes.hasOwnProperty(key)) {
                    var value = args.elementAttributes[key];
                    htmlNode.setAttribute(key, value);
                }
            }
        }
        if (args.elementHtml && args.elementHtml.length > 0) {
            htmlNode.innerHTML = args.elementHtml;
        }
        if (args.elementText && args.elementText.length > 0) {
            htmlNode.textContent = args.elementText;
        }
        return htmlNode;
    };
    var elementsCreate = function (args) {
        var parentEl = elementCreate(args);
        if (args.childElements) {
            addElementRecursive(parentEl, args.childElements);
        }
        return parentEl;
    };
    var addElementRecursive = function (parentElement, args) {
        if (args && args.length > 0) {
            for (var i = 0; i < args.length; i++) {
                var el = args[i];
                var childEl = elementCreate(el);
                parentElement.appendChild(childEl);
                if (el.childElements) {
                    addElementRecursive(childEl, args[i].childElements);
                }
            }
        }
    };
    var ElementLoadJs =  (function (_super) {
        __extends(ElementLoadJs, _super);
        function ElementLoadJs(args) {
            var _this = _super.call(this) || this;
            var textContent = args && args.textContent || '';
            var src = args && args.src || '';
            _this.lTestFuncton = args && args.tyepName || [];
            if (textContent.length + src.length === 0) {
                throw new Error('src or textContent muse included in the args');
            }
            var eArgs = {
                elementTag: 'script',
                elementText: args.textContent,
                elementAttributes: {
                    src: (args.src || ''),
                    type: 'text/javascript'
                }
            };
            var eHtml = elementCreate(eArgs); 
            var functionToRun = args && args.functionToRun || '';
            if (functionToRun.length > 0) {
                eHtml.addEventListener('load', function () {
                    var functionHtml = elementCreate({
                        elementTag: 'script',
                        elementText: functionToRun,
                        elementAttributes: {
                            type: 'text/javascript'
                        }
                    }); 
                    elementAddToDoc(functionHtml, args.scriptLocation);
                });
            }
            elementAddToDoc(eHtml, args.scriptLocation);
            return _this;
        }
        ElementLoadJs.prototype.onTickTock = function (eventArgs) {
            if (this.lTestFuncton.length > 0) {
                if (this.fnArrayExist(this.lTestFuncton) === true) {
                    this.elementLoaded.dispatch(this, eventArgs);
                    this.dispose();
                }
                else {
                    this.elementLoaded.dispatch(this, eventArgs);
                    this.dispose();
                }
            }
            else {
                this.elementLoaded.dispatch(this, eventArgs);
                this.dispose();
            }
        };
        ElementLoadJs.prototype.onTickExpired = function (eventArgs) {
            return;
        };
        return ElementLoadJs;
    }(BaseElementLoad));
    var ElementLoad =  (function (_super) {
        __extends(ElementLoad, _super);
        function ElementLoad(args) {
            var _this = _super.call(this, 0, 1) || this;
            _this.lArgs = args;
            return _this;
        }
        ElementLoad.prototype.onTickTock = function (eventArgs) {
            if (eventArgs.count > 1) {
                eventArgs.cancel = true;
                return;
            }
            if (this.lArgs.elementCreate.childElements) {
                var multiHtml = elementsCreate(this.lArgs.elementCreate);
                elementAddToDoc(multiHtml, this.lArgs.scriptLocation);
            }
            else {
                var eHtml = elementCreate(this.lArgs.elementCreate);
                elementAddToDoc(eHtml, this.lArgs.scriptLocation);
            }
            this.elementLoaded.dispatch(this, eventArgs);
            this.dispose();
        };
        ElementLoad.prototype.onTickExpired = function (eventArgs) {
            return;
        };
        return ElementLoad;
    }(BaseElementLoad));

    var ResourceTest =  (function (_super) {
        __extends(ResourceTest, _super);
        function ResourceTest(timing, attempts) {
            if (timing === void 0) { timing = 500; }
            if (attempts === void 0) { attempts = 30; }
            var globalRes = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                globalRes[_i - 2] = arguments[_i];
            }
            var _this = this;
            if (globalRes.length === 0) {
                throw new RangeError(String.Format(exceptionMessages.argEmptyString, 'globalRes'));
            }
            if (timing < 0) {
                throw new RangeError(String.Format(exceptionMessages.argLessThenZero, 'timing'));
            }
            if (attempts < 1) {
                throw new RangeError(String.Format(exceptionMessages.argLessThenOne, 'attempts'));
            }
            _this = _super.call(this, timing, attempts) || this;
            _this.lTestFuncton = globalRes;
            return _this;
        }
        ResourceTest.prototype.onTickTock = function (eventArgs) {
            if (this.lTestFuncton.length > 0) {
                if (this.fnArrayExist(this.lTestFuncton) === true) {
                    this.elementLoaded.dispatch(this, eventArgs);
                    this.dispose();
                }
                else {
                    this.elementLoaded.dispatch(this, eventArgs);
                    this.dispose();
                }
            }
            else {
                this.elementLoaded.dispatch(this, eventArgs);
                this.dispose();
            }
        };
        ResourceTest.prototype.onTickExpired = function (eventArgs) {
            return;
        };
        return ResourceTest;
    }(BaseElementLoad));

    var EvernoteElementLoader =  (function (_super) {
        __extends(EvernoteElementLoader, _super);
        function EvernoteElementLoader() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EvernoteElementLoader.prototype.onBeforeStart = function (args) {
            if (args.cancel === true) {
                return;
            }
            this.testForResource('resTinyMce', 300, 30, 'tinymce');
            this.addLightbox();
            this.addTinyMce();
            this.addLightBoxCss();
            this.addTinyMceCss();
        };
        EvernoteElementLoader.prototype.testForResource = function (key, timing, attempts) {
            if (timing === void 0) { timing = 500; }
            if (attempts === void 0) { attempts = 30; }
            var globalRes = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                globalRes[_i - 3] = arguments[_i];
            }
            if (this.hasElement(key)) {
                this.dispose();
                throw new Error(String.Format(exceptionMessages.argKeyExist, 'key', key));
            }
            var lt = new (ResourceTest.bind.apply(ResourceTest, [void 0, timing, attempts].concat(globalRes)))();
            this.addElement(key, lt);
        };
        EvernoteElementLoader.prototype.addTinyMceCss = function () {
            var srcLink = "//cdnjs.cloudflare.com/ajax/libs/tinymce/" + appSettings.tinyMceVersion + "/skins/lightgray/skin.min.css";
            var key = 'tinyMceCss';
            this.addStyleLink(key, srcLink, ElementLocation.head);
        };
        EvernoteElementLoader.prototype.addTinyMce = function () {
            if (typeof (tinymce__default) === 'undefined') {
                var pluginSrc = "//cdnjs.cloudflare.com/ajax/libs/tinymce/" + appSettings.tinyMceVersion + "/tinymce.min.js";
                var elJs = new ElementLoadJs({
                    scriptLocation: ElementLocation.head,
                    tyepName: ['jQuery'],
                    src: pluginSrc
                });
                this.addElement('tinyMceJs', elJs);
            }
            else {
            }
        };
        EvernoteElementLoader.prototype.addLightBoxCss = function () {
            this.addStyle('LigthboxCss', this.getLigthboxCss(), ElementLocation.body);
        };
        EvernoteElementLoader.prototype.getLigthboxCss = function () {
            var css = '.gmbackdrop,.gmbox{position:absolute;display:none}.gmbackdrop{top:0;left:0;width:100%;height:100%;background:#000;opacity:0;z-index:201}.gmbox{background:#fff;z-index:202;padding:10px;-webkit-border-radius:5px;-moz-border-radius:5px;border-radius:5px;-moz-box-shadow:0 0 5px #444;-webkit-box-shadow:0 0 5px #444;box-shadow:0 0 5px #444}.gmclose{float:right;margin-right:6px;cursor:pointer;width:16px;height:16px;line-height:16px;color:#000}.gmclose:hover{cursor:pointer}.gmclose::after,.mce-i-myexit.exit-x::after{content:"";background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACpklEQVR42nWSS0wTURSGzxQIUBi0A6WFAaxIJQ0gVUGR8FjUgIg8FEgQMbAwcWPc+GAhQUmIj4SlC01UMqlsjCi0SJVHlACFKFCJqFSkGkLkNUQjDCuS42nTIhQ4yZe595z7/zn33AHYEKMN98ptBcV62CE+19829J6tytm2WAFQOdFkXLPX3hQ7GNhiYmLA4Ki/Iw1cr10tBdhsEgpMpel0+drytTpcqbmFY0Ul4qsNJk6xvfSctEL15at1aDx1ZjXQY3IxIy/dcqNhbTG/DOePF7pYyi/FEX2q2CIDfTOJPx3JkMSc4vX6Qm4xPsorWa1KztJCAa9T5Gi05qGUdJziNfid3+NiOjYeJ6suLH09lin9jIldzzvoTG+cDg+HKIWT6v2sq4sAAO4EpzT3R2lwiGHQ6mY8IRlHubD1vbP2ht2Nh3z9BD+AkE1zSCOTajlr7lRH4UsAfOFFK9EiD8YymY+Q6i32xHkyeaxL6rNXVmMzCZ4SRvd3UJ+KjVx4a8VOYmc0AhhMEdFSi68fNpFIcPOEeB7E4jM1L94F2P4/eUDi1ypeapPJXO22E91Ep3vtvFYHXaFNFSne9zZpYhhDj1ItdTIy7KGDA8QwMZ+WjnMH9PiB1v1EF9ETIMeOMJX40GMymFt4cOpKjfSWxE7hR2KSWIiMQvsu1viN49rFaA3aKWcj+oheMhnJPi52J6dooE9/VPVOGW61KdX4hYozxB8+Gu1BcsHGQMgYAxyZmH/HaHCaauPEqFKFXcHBFrOaV7i6oDvywyxrXdAl4kpCEjoC/YUJn//TnpAB51AoTH/37sPZCB6t/v6WNgbCNs1hmAF+/tJl62JhkfDDZ+tTOXyBm8vKNs9kZlney7zEnviVmBQ+q43b8Z1n4+MVM1pt6MbcPy2eNzi8WXoxAAAAAElFTkSuQmCC);background-size:cover;opacity:.7;position:absolute;height:16px;width:16px;-webkit-filter:grayscale(1);filter:grayscale(1)}.gmclose:hover::after{content:"";cursor:pointer;opacity:1;filter:grayscale(0);-webkit-filter:grayscale(0)}.gmclose .gm-close-tooltip{visibility:hidden;width:160px;background-color:#08ab33;color:#fff;text-align:center;border-radius:6px;padding:5px 0;position:relative;z-index:201;float:right;margin-right:-72px;top:115%;opacity:0;transition:opacity 1s}.gmclose:hover .gm-close-tooltip{visibility:visible;opacity:1}.gmclose .gm-close-tooltip::after{content:"";position:absolute;bottom:100%;left:50%;margin-left:-5px;border-width:5px;border-style:solid;border-color:transparent transparent #08ab33 transparent}.mce-i-myexit.exit-x{color:transparent}.mce-i-mysave.save-s::after{content:"";background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxklEQVR42u3TOwrCQBRA0RGCpdoJVnb2yQbckxtI7xaCjS7AUrGxEgWXEBE7QRCFQPyA4x15RokZGEjrwGmSvEt+o4IgCJHigSWGBUZijCMiNJRZMqxxQUflFscqElmghTluGLwiMqwl1LQE1u/zmMr1JhKVCRj3sgH9Hbiiiyq8nB76aGNlC5ivcMAGscVOnv0nYIYTnB0lMpMF9vBRc+TLTBYwt+cpxyXvJf4HPgHzh22z3eUWqMtMqmQ7nzCzbOUiE5kJnxY94Zf0eWaOAAAAAElFTkSuQmCC);background-size:cover;opacity:1;position:absolute;height:16px;width:16px}.mce-panel{border:none}div.gmbox .mce-panel{border:0 solid rgba(0,0,0,.2)}div.mce-tinymce.mce-container.mce-panel{margin-top:2em}div.mce-tinymce.mce-container.mce-panel.mce-fullscreen{margin-top:0}div.mce-fullscreen{width:100vw!important;height:auto!important}#gm-edit-btn{display:inline-block;box-sizing:border-box;position:absolute;width:24px;height:24px;background-size:24px 24px;user-select:none;-o-user-select:none;-webkit-touch-callout:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;z-index:1}#gm-edit-btn::after{content:"";background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEAklEQVR42pWWa2iTVxjHT7/s227CVv0ycYMxP+3LoC4w2IfuS0GQOWQXGBtzw83qYOA2mNOuH6yTwKT1Ute6XrSLJia9SG3oJbaJbUPS2MY2TaJJt8SkubRN0ubWN2nPf+e8icGZvL0c+JEH8jz//3mec/K+IeTZ9VX5XlK750tS9/rXm1L1YjnZzio7+8bx32vqMuNqHUy39QWM3cPQa3TQKvrQ0aTCmboL+K1WjvflH02Vfbhj59bUP3/ltZqaGiGZTMMfDOOxP5QnCK8viDmvH3bXvzBZ7egZuIf+ESPcptmcSdVLW+iketcB7dUuBEKLXIxywTxi7Pb48XDOS2eccxi3zGBsYpqGFiOwj1pRee6QdXOT6l0H+9t7RAMv33UJPL4A5jy5TqyzLrHTf7zzcJptqDx7yEp+3f0NObLzbUkDbVsPQgsRVrggiS8QZkZBPLC7EWYdsK7ETqfu3EPD95/h8OX9Ajm1++OSBn2t3VhYiiIYXqIM5CmKeZdOt5d6WFfcxGG20bvvncQMOQnnntN0f8sHMVL5/AtFBndaurAUXRZNNoML83Pp7tej99MzsJCfMcsMjOQEPmmuEsjBl8uLDHpbOhFdXhFNIrEcG8VjE1YouvoxfXcCtr210JKjkFd/i7L6N5tKjuj2VQ2WV+KILccpA3lKxrb5IdqoO4YZh5sfPtX3GdDVoEDDuUbKtUoa9DSrsRJP5kjkKRHPBnSQje7Dq492QOu/BN2YGdc1WvGGXau/BkmD7uZbSCRTG+IID0Nm3AfiJCA+xshzUJvl4rnw8SovK6QNOtljIJFKI5VepQzkKcTOhRFaYXoHxMGEPYSS0TL8NfUTkqmkmBNnG1BfuSk9Is0VpSi0KghFPFzSQ2Z5F8TGxN2McYI/TT9gMbKIdL6G13INSQPmjvTqKoRM5n+4IgbI7stApkluNGaCi6PH4Ha7EAyGEI8nxDxeyzUkDVSNN1iSgGw2S7PZNXBc0VFaMVkBYiV895RYylA/fASW+xPU4XDAPz/PO2D5WbGWaUiPiB8Qb3VtbY2xLn422L8DmWTiDxhTBH8MHMbQ0ACMRiN8fj8ymWwhn9dueMg3Lv0NQchgfX1dREjE2BhuoWLyLdFA3vcFNJ1qGAwGRKPRQl4hn9VyDUkDxcWOJwaUF8TDXsQejVNz7ymcv3kU7e2t1Gq1sl3nctgC50nMa5mG9Ig6LlwXD4snp1IpdCo70Ktqg0qlxODgIEKhEPsOeWhRzGu5hpTBgbbzbeJN4IsX5XeKrS5+XbkG1yr5yjxe86PgeRxg9zlNn/oNbCnmvwFeyzW4luRL/8TpXzLKJiU0rZptoWJPAV7LNTZ+dW7nb8vT8Bpe+8z6D187Su44+n2mAAAAAElFTkSuQmCC);background-size:cover;opacity:.7;top:0;left:0;bottom:0;right:0;position:absolute;-webkit-filter:grayscale(1);filter:grayscale(1)}#gm-edit-btn:hover{cursor:pointer;opacity:1;filter:grayscale(0);-webkit-filter:grayscale(0)}#gm-edit-btn:hover::after{content:"";cursor:pointer;opacity:1;filter:grayscale(0);-webkit-filter:grayscale(0)}.gmbox-window{top:50%;left:50%;transform:translate(-50%,-50%);position:absolute}#gm-tb{display:inline-block;box-sizing:border-box;position:absolute;width:24px;height:24px;background-size:24px 24px;margin:0;opacity:1;overflow-x:hidden;overflow-y:hidden;padding:0;user-select:none;-o-user-select:none;-webkit-touch-callout:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;z-index:200}';
            return css;
        };
        EvernoteElementLoader.prototype.addLightbox = function () {
            var elDivGmbackDrop = new ElementLoad({
                scriptLocation: ElementLocation.body,
                elementCreate: {
                    elementTag: 'div',
                    elementAttributes: {
                        class: 'gmbackdrop'
                    }
                }
            });
            this.addElement('div.gmbackdrop', elDivGmbackDrop);
            var elMulti = new ElementLoad({
                scriptLocation: ElementLocation.body,
                elementCreate: {
                    elementTag: 'div',
                    elementAttributes: {
                        id: 'tinybox',
                        class: 'gmbox gmbox-window'
                    },
                    childElements: [{
                            elementTag: 'div',
                            elementAttributes: {
                                class: 'gmclose'
                            },
                            childElements: [{
                                    elementTag: 'span',
                                    elementAttributes: {
                                        class: 'gm-close-tooltip'
                                    },
                                    elementHtml: 'Click to close this editor. <br /><br />Changes will not be saved.'
                                }]
                        },
                        {
                            elementTag: 'div',
                            elementAttributes: {
                                id: appSettings.fullScreenRealId,
                            },
                            childElements: [{
                                    elementTag: 'textarea',
                                    elementAttributes: {
                                        id: appSettings.tinyId,
                                        rows: '18',
                                        cols: '66'
                                    }
                                }]
                        }]
                }
            });
            this.addElement('lightBoxHtml', elMulti);
        };
        EvernoteElementLoader.prototype.addStyleLink = function (key, srcLink, elementLocation) {
            if (elementLocation === void 0) { elementLocation = ElementLocation.head; }
            var elCss = new ElementLoad({
                scriptLocation: elementLocation,
                elementCreate: {
                    elementTag: 'link',
                    elementAttributes: {
                        type: 'text/css',
                        href: srcLink,
                        rel: 'stylesheet'
                    }
                }
            });
            this.addElement(key, elCss);
        };
        EvernoteElementLoader.prototype.addStyle = function (key, styelcontent, elementLocation) {
            if (elementLocation === void 0) { elementLocation = ElementLocation.head; }
            var elCss = new ElementLoad({
                scriptLocation: elementLocation,
                elementCreate: {
                    elementTag: 'style',
                    elementText: styelcontent,
                    elementAttributes: {
                        type: 'text/css'
                    }
                }
            });
            this.addElement(key, elCss);
        };
        return EvernoteElementLoader;
    }(ElementLoader));

    var validateIfTop = function () {
        return window.top === window.self;
    };
    var main = function () {
        var en = new Evernote();
        en.init();
    };
    if (validateIfTop()) {
        Log.message(appSettings.shortName + ': Entry Script: Start loading...');
        if (typeof (tinymce__default) !== 'undefined') {
            updateAppSetting('tinyMceVersion', tinymce__default.EditorManager.majorVersion + "." + tinymce__default.EditorManager.minorVersion);
        }
        var loader = new EvernoteElementLoader();
        loader.onAllElementsLoaded().subscribe(function (sender, args) {
            Log.message(appSettings.shortName + ": Entry Script: All Scripts loaded. Total count: " + args.totalNumberOfScripts);
            main();
        });
        loader.onElementsLoadFail().subscribe(function (sender, args) {
            Log.error(appSettings.shortName + ": Entry Script: The neceassary elements were note loaded. Failed:", args.remainingEvents);
        });
        loader.onElementLoaded().subscribe(function (sender, args) {
            Log.message(appSettings.shortName + ": Entry Script: Element with Key value of '" + args.key + "' has loaded");
        });
        loader.onTickExpired().subscribe(function (sender, args) {
            Log.warn(appSettings.shortName + ": Entry Script: Element with Key value of '" + args.key + "' has failed to load");
        });
        loader.start();
        var gConfig = new GmConfig();
        gConfig.init();
        if (typeof GM_registerMenuCommand === 'function') {
            Log.message(appSettings.shortName + ': Entry Script: Registering: Open ' + appSettings.shortName + ' Options Menu');
            GM_registerMenuCommand(appSettings.menuName, function () {
                GM_config.open();
                Log.message(appSettings.shortName + ': Entry Script: Registered: Open ' + appSettings.shortName + ' Options Menu');
            });
        }
        else {
            Log.error(appSettings.shortName + ': Entry Script: Unable to Register: Open ' + appSettings.shortName + ' Options Menu');
        }
        Log.message(appSettings.shortName + ': Entry Script: End loading...');
    }

}($, tinymce));
