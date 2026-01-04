// ==UserScript==
// @name        bahamut ASS Danmaku Downloader Modified
// @name:zh-TW  動畫瘋 ASS格式彈幕下載器 Modified
// @name:zh-CN  巴哈姆特动画疯 ASS格式弹幕下载器 Modified
// @namespace   https://github.com/tiansh, https://github.com/zhuzemin
// @description http://ani.gamer.com.tw download danmaku as ".ass"
// @description:zh-TW  以ASS字幕格式保存巴哈姆特動畫瘋的彈幕
// @description:zh-cn  以ASS字幕格式保存巴哈姆特动画疯的弹幕
// @include     https://ani.gamer.com.tw/*
// @version     1.8
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @connect     ani.gamer.com.tw
// @run-at      document-start
// @author      田生, Modified by zhuzemin, az689
// @copyright   2014+, 田生
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/478079/bahamut%20ASS%20Danmaku%20Downloader%20Modified.user.js
// @updateURL https://update.greasyfork.org/scripts/478079/bahamut%20ASS%20Danmaku%20Downloader%20Modified.meta.js
// ==/UserScript==
// 设置项
var defconfig = {
    'enablePlayPageButtoms': true,
    'enableDaylistButtoms': true,
    'enableNewanimelistButtoms': true,
    'playResX': 960, // 屏幕分辨率宽（像素）
    'playResY': 540, // 屏幕分辨率高（像素）
    'fontlist': [ // 字形（会自动选择最前面一个可用的）
        'Microsoft YaHei UI', 'Microsoft YaHei', '文泉驿正黑', 'STHeitiSC', '黑体',
    ],
    'font_size': 24, // 字号（像素）
    'exlinespace': 1, // 额外行距（字号的比例）
    'r2ltime': 8, // 右到左弹幕持续时间（秒）
    'fixtime': 4, // 固定弹幕持续时间（秒）
    'opacity': 0.6, // 不透明度（比例）
    'space': 0, // 弹幕间隔的最小水平距离（像素）
    'max_delay': 6, // 最多允许延迟几秒出现弹幕
    'bottom': 0, // 底端给字幕保留的空间（像素）
    'use_canvas': false, // 是否使用canvas计算文本宽度（布尔值，Linux下的火狐默认否，其他默认是，Firefox bug #561361）
    'debug': true, // 打印调试信息
    'language': "zh_tw"
};

//读取设置
var config = GM_getValue("config", null);
if (config === null) {
    GM_setValue("config", defconfig);
    config = defconfig;
    console.log("設定初始化 Configuration has been initialized.");
};
//填充默认值
for (let key in defconfig) {
    if (!(key in config)) config[key] = defconfig[key];
};
var debug = config.debug ? console.log.bind(console) : function() {};

//html模板
var settingPanelHTMLtemplate = `
<div class="assdanmakusetting-window">
    <div class="assdanmakusetting-title" style="border-bottom: 1px solid black; height: 54px;">
        <button class="assdanmakusetting-exitbutton" title="{{exit}}" onclick="document.querySelector('.assdanmakusetting-window').remove()">{{exit}}</button>
        <button class="assdanmakusetting-savebutton" title="{{save}}">{{save}}</button>
        <p>{{title}}</p>
    </div>
    <form class="assdanmakusetting-container">
    </form>
</div>
`;
var settingItemHTMLtemplate = `
<div class="assdanmakusetting-item">{{content}}</div>
`;
var settingInputHTMLtemplate = `
<lable for="{{key}}" title="{{key}}">{{description}}</lable>
<button type="button" act="setval" acp="def" title="{{butsetdeftitle}}">{{butsetdef}}</button>
<button type="button" act="setval" acp="cur" title="{{butsetcurtitle}}">{{butsetcur}}</button>
<{{htmltag}} name="{{key}}" {{attr}}>{{content}}</{{htmltag}}>
`;
var last3ButtonHTMLtemplate = `
{{title}}
<button type="button" act="executecode">{{executecode}}</button>
<button type="button" act="editconfig">{{editconfig}}</button>
<button type="button" act="resetconfig">{{resetconfig}}</button>
`;
var settingOptionsHTMLtemplate = `
<option value="{{value}}">{{text}}</option>
`;
var injectedCSS = `
.assdanmakusetting-window {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 40%;
    height: 60%;
    min-width: 480px;
    z-index: 114514;
    overflow: hidden;
    background: whitesmoke;
    border: 1px solid black;
    box-shadow: 2px 2px 2px 2px rgb(119, 119, 119);
    border-radius: 4px;
}
.assdanmakusetting-title button {
    color: black;
    font-size: 24px;
	float: right;
	top: 2.5%;
	border: 2px solid black;
	margin: 8px 8px 8px 0px;
	background: gainsboro;
    font-family: "Arial, sans-serif";
    border-radius: 6px;
}
.assdanmakusetting-title p{
    font-size: 24px;
    float: left;
	margin: 16px;
    line-height: 1em;
    z-index: -1;
}
.assdanmakusetting-container {
	overflow: auto;
	height: calc(100% - 58px);
	width: 100%;
}
.assdanmakusetting-item {
	padding: 8px;
	font-size: 16px;
	word-wrap: break-word;
    width: 100%;
    border-bottom: gainsboro solid 1px;
    overflow: hidden;
}
.assdanmakusetting-item input,.assdanmakusetting-item button,.assdanmakusetting-item select{
    float: right;
    margin: 4px;
}
.assdanmakusetting-savebutton:hover {
    color: white;
    background: #37e;
}
.assdanmakusetting-savebutton:active {
    background: #6ce;
}
.assdanmakusetting-exitbutton:hover {
    color: white;
	background: #e44;
}
.assdanmakusetting-exitbutton:active {
    background: #b33;
}
.listgetassdanmaku-button {
    padding: 4px 4px;
	border-radius: 5px;
	background-color: var(--baha-primary-color);
	z-index: 4;
    color: #EEE;
    white-space: nowrap;
}
.listdownloadbutton {
    border: 1px solid var(--btn-favorite-video);
    border-radius: 4px;
    color: var(--btn-favorite-video);
    cursor: pointer;
    padding: 5px 0px;
    font-size: 1em;
    background: transparent;
    margin-right: 5px;
    width: 30px;
    text-align: center;
}
.listdownloadbutton:hover {
	background-color: var(--btn-favorite-video);
	color: rgba(var(--anime-white-rgb), 0.95);
}
.ahveuiw:after {
    content: "" !important;
}
.day-list .text-anime-info {
  position: relative;
}
.day-list .text-anime-info .listgetassdanmaku-button{
  position: absolute;
  bottom: 12.5px;
}
`;

//多语言
var lang = new Object();

var l10n = {
    'name': "正體中文",
    'text': {
        'getdanmaku': "獲取ASS彈幕",
        'episodelistgetdanmaku': "下載ASS彈幕:"
    },
    'message': {
        'xhrfailed': "獲取失敗",
        'invalidsnid': "無效的SN/Url",
        'invalidsnidlog': "字串中未找到SN號:",
        'getdanmakuformsn': "請輸入SN號或動畫頁面的URL:",
        'gotdanmaku': "獲取了 %d 個彈幕, 從 %s",
        'confirmresetconfig':"您確定要重設設定嗎? 這將重新整理頁面",
        'editconfig': "確定後將立即儲存, 如果再點擊儲存將導致設定被覆蓋, 部分選項仍需要重新整理頁面才能生效",
        'configsaved': "設定已儲存"
    },
    'ui':{
        'setting': "設定",
        'getdanmakuformsn': "從SN號獲取彈幕",
        'settingpaneltitle': "ASS格式彈幕下載器設定",
        'save': "儲存",
        'exit': "退出",
        'defaultvalue': "預設值",
        'currenttvalue': "当前值",
        'resetconfig': "重設設定",
        'editconfig': "直接編輯設定(匯入/匯出)",
        'executecode': "執行程式碼",
        'misc': "其他選項",
        'true': "是",
        'false': "否",
        'butsetdeftitle': "設為預設值",
        'butsetcurtitle': "設為目前值"
    },
    'config':{
        'description': {
            'playResX': "畫布水平解析度(畫素, ASS裡的同名參數)",
            'playResY': "畫布垂直解析度(畫素, ASS裡的同名參數)",
            'fontlist': "字形(會自動選擇最前面一個可用的)",
            'font_size': "字號(畫素)",
            'exlinespace': "額外行距(字號的比例)",
            'r2ltime': "右到左彈幕持續時間(秒)",
            'fixtime': "固定彈幕持續時間(秒)",
            'opacity': "不透明度(比例)",
            'space': "彈幕間隔的最小水平距離(畫素)",
            'max_delay': "最多允許延遲幾秒出現彈幕",
            'bottom': "底端給字幕保留的空間(畫素)",
            'use_canvas': "是否使用canvas計算文字寬度",
            'debug': "列印除錯資訊",
            'language': "介面語言 (重新整理生效)",
            'enablePlayPageButtoms': "添加彈幕下載按鈕至動畫播放頁面",
            'enableDaylistButtoms': "添加彈幕下載按鈕至首頁的'週期表'",
            'enableNewanimelistButtoms': "添加彈幕下載按鈕至首頁的'本季新番'"
        },
        'errormsg': {
            'fontlist': ''
        }
    }
};

lang.zh_tw = { 'name': "正體中文" };

lang.en_us = {
    'name': "English",
    'text': {
        'getdanmaku': "Get ASS Danmaku",
        'episodelistgetdanmaku': "Download ASS Danmaku:"
    },
    'message': {
        'xhrfailed': "Failed to obtain ",
        'invalidsnid': "Invalid SN/Url",
        'invalidsnidlog': "SNID not found in string:",
        'getdanmakuformsn': "Please enter the SNID or the URL of the anime page:",
        'gotdanmaku': "got %d danmaku form %s",
        'confirmresetconfig': "Are you sure you want to reset the configuration? This will refresh the page.",
        'editconfig': "Changes will be saved immediately. Clicking 'Save' again will overwrite the settings. Some options still need to be refreshed to take effect.",
        'configsaved': "Configuration saved."
    },
    'ui':{
        'setting': "Setting",
        'getdanmakuformsn': "Get danmaku form SN",
        'settingpaneltitle': "Danmaku downloader setting",
        'save': "Save",
        'exit': "Exit",
        'defaultvalue': "DefVal",
        'currenttvalue': "CurVal",
        'resetconfig': "Reset Config",
        'editconfig': "Edit Raw Config (Im/Export)",
        'executecode': "Execute Code",
        'misc': "Miscellany",
        'true': "yes",
        'false': "no",
        'butsetdeftitle': "Set to default value",
        'butsetcurtitle': "Set to current value"
    },
    'config':{
        'description': {
            'playResX': "Canvas resolution width (pixels, same name parameter in ASS)",
            'playResY': "Canvas resolution heigh (pixels, same name parameter in ASS)",
            'fontlist': "Font (the first available one will be automatically selected)",
            'font_size': "Font size (pixels)",
            'exlinespace': "Extra line spacing (scale of fontsize)",
            'r2ltime': "Right to left danmaku duration (seconds)",
            'fixtime': "Fixed danmauku duration (seconds)",
            'opacity': "opacity (scale)",
            'space': "Minimum horizontal distance between danmaku (pixels)",
            'max_delay': "The maximum delay for danmaku to appear (seconds)",
            'bottom': "The space reserved for subtitles at the bottom (pixels)",
            'use_canvas': "Whether to use canvas to calculate text width",
            'debug': "Print debugging information",
            'language': "UI Language (Refresh to take effect)",
            'enablePlayPageButtoms': "Add danmauku download buttons<br/>to anime playback page.",
            'enableDaylistButtoms': "Add danmauku download buttons<br/>to new anime schedule on the homepage.",
            'enableNewanimelistButtoms': "Add danmauku download buttons<br/>to anime latest update list on the homepage."
        },
        'errormsg': {
            'fontlist': ''
        }
    }
};

//设置面板项
var settingitems = {
    'enablePlayPageButtoms': {
        'htmltag': "select",
        'type': "boolean",
        'exattr': [],
         get options() {
             return [["true", l10n.ui.true], ["false", l10n.ui.false]];
         }
    },
    'enableDaylistButtoms': {
        'htmltag': "select",
        'type': "boolean",
        'exattr': [],
         get options() {
             return [["true", l10n.ui.true], ["false", l10n.ui.false]];
         }
    },
    'enableNewanimelistButtoms': {
        'htmltag': "select",
        'type': "boolean",
        'exattr': [],
         get options() {
             return [["true", l10n.ui.true], ["false", l10n.ui.false]];
         }
    },
    'playResX': {
        'htmltag': "input",
        'type': "number",
        'exattr': [["min", 0]]
    },
    'playResY': {
        'htmltag': "input",
        'type': "number",
        'exattr': [["min", 0]]
    },
    'fontlist': {
        'htmltag': "input",
        'type': "text",
        'exattr': [],  //[["pattern", /^\[(\s*(\x22[^\x22]\x22)|(\x27[^\x27]\x27)|(\x60[^\x60]\x60)\s*,)*\s*(\x22[^\x22]\x22)|(\x27[^\x27]\x27)|(\x60[^\x60]\x60)\s*\]$/ ]] //匹配字符串数组
        'datatype': "array"
    },
    'font_size': {
        'htmltag': "input",
        'type': "number",
        'exattr': [["step", 0.5], ["min", 0]]
    },
    'exlinespace': {
        'htmltag': "input",
        'type': "number",
        'exattr': [["step", 0.01]]
    },
    'r2ltime': {
        'htmltag': "input",
        'type': "number",
        'exattr': [["step", 0.1], ["min", 0]]
    },
    'fixtime': {
        'htmltag': "input",
        'type': "number",
        'exattr': [["step", 0.1], ["min", 0]]
    },
    'opacity': {
        'htmltag': "input",
        'type': "number",
        'exattr': [["step", 0.01], ["min", 0]]
    },
    'space': {
        'htmltag': "input",
        'type': "number",
        'exattr': []
    },
    'max_delay': {
        'htmltag': "input",
        'type': "number",
        'exattr': [["step", 0.1], ["min", 0]]
    },
    'bottom': {
        'htmltag': "input",
        'type': "number",
        'exattr': [["min", 0]]
    },
    'use_canvas': {
        'htmltag': "select",
        'type': "boolean",
        'exattr': [],
         get options() {
             return [["true", l10n.ui.true], ["false", l10n.ui.false]];
         }
    },
    'debug': {
        'htmltag': "select",
        'type': "boolean",
        'exattr': [],
         get options() {
             return [["true", l10n.ui.true], ["false", l10n.ui.false]];
         }
    },
    'language': {
        'htmltag': "select",
        'type': "string",
        'exattr': [],
         get options() {
             var out = new Array();
             for (let key in lang) {
                 out.push([key, lang[key].name]);
             };
             return out;
         }
    }
};

// 将字典中的值填入字符串
var fillStr = function(str) {
    var dict = Array.apply(Array, arguments);
    return str.replace(/{{([^}]+)}}/g, function(r, o) {
        var ret;
        dict.some(function(i) {
            return ret = i[o];
        });
        return ret || '';
    });
};
// 将颜色的数值化为十六进制字符串表示
var RRGGBB = function(color) {
    var t = Number(color).toString(16).toUpperCase();
    return (Array(7).join('0') + t).slice(-6);
};
// 将可见度转换为透明度
var hexAlpha = function(opacity) {
    var alpha = Math.round(255 * (1 - opacity)).toString(16).toUpperCase();
    return Array(3 - alpha.length).join('0') + alpha;
};
// 字符串
var funStr = function(fun) {
    return fun.toString().split(/\r\n|\n|\r/).slice(1, -1).join('\n');
};
// 平方和开根
var hypot = Math.hypot ? Math.hypot.bind(Math) : function() {
    return Math.sqrt([0].concat(Array.apply(Array, arguments)).reduce(function(x, y) {
        return x + y * y;
    }));
};
// 创建下载
var startDownload = function(data, filename) {
    var blob = new Blob([data], {
        type: 'application/octet-stream'
    });
    var url = window.URL.createObjectURL(blob);
    var saveas = document.createElement('a');
    saveas.href = url;
    saveas.style.display = 'none';
    document.body.appendChild(saveas);
    saveas.download = filename;
    saveas.click();
    setTimeout(function() {
        saveas.parentNode.removeChild(saveas);
    }, 1000)
    document.addEventListener('unload', function() {
        window.URL.revokeObjectURL(url);
    });
};
// 计算文字宽度
var calcWidth = (function() {
    // 使用Canvas计算
    var calcWidthCanvas = function() {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        return function(fontname, text, fontsize) {
            context.font = 'bold ' + fontsize + 'px ' + fontname;
            return Math.ceil(context.measureText(text).width + config.space);
        };
    }; // 使用Div计算
    var calcWidthDiv = function() {
        var d = document.createElement('div');
        d.setAttribute('style', ['all: unset', 'top: -10000px', 'left: -10000px', 'width: auto', 'height: auto', 'position: absolute', '', ].join(' !important; '));
        var ld = function() {
            document.body.parentNode.appendChild(d);
        }
        if (!document.body) document.addEventListener('DOMContentLoaded', ld);
        else ld();
        return function(fontname, text, fontsize) {
            d.textContent = text;
            d.style.font = 'bold ' + fontsize + 'px ' + fontname;
            return d.clientWidth + config.space;
        };
    };
    // 检查使用哪个测量文字宽度的方法
    if (config.use_canvas === null) {
        if (navigator.platform.match(/linux/i) && !navigator.userAgent.match(/chrome/i)) config.use_canvas = false;
    }
    debug('use canvas: %o', config.use_canvas !== false);
    if (config.use_canvas === false) return calcWidthDiv();
    return calcWidthCanvas();
}());
// 选择合适的字体
var choseFont = function(fontlist) {
    // 检查这个字串的宽度来检查字体是否存在
    var sampleText = 'The quick brown fox jumps over the lazy dog' + '7531902468' + ',.!-' + '，。：！' + '天地玄黄' + '则近道矣';
    // 和这些字体进行比较
    var sampleFont = ['monospace', 'sans-serif', 'sans', 'Symbol', 'Arial', 'Comic Sans MS', 'Fixed', 'Terminal', 'Times', 'Times New Roman', '宋体', '黑体', '文泉驿正黑', 'Microsoft YaHei'];
    // 如果被检查的字体和基准字体可以渲染出不同的宽度
    // 那么说明被检查的字体总是存在的
    var diffFont = function(base, test) {
        var baseSize = calcWidth(base, sampleText, 72);
        var testSize = calcWidth(test + ',' + base, sampleText, 72);
        return baseSize !== testSize;
    };
    var validFont = function(test) {
        var valid = sampleFont.some(function(base) {
            return diffFont(base, test);
        });
        debug('font %s: %o', test, valid);
        return valid;
    };
    // 找一个能用的字体
    var f = fontlist[fontlist.length - 1];
    fontlist = fontlist.filter(validFont);
    debug('fontlist: %o', fontlist);
    return fontlist[0] || f;
};
// 从备选的字体中选择一个机器上提供了的字体
var initFont = (function() {
    var done = false;
    return function() {
        if (done) return;
        done = true;
        calcWidth = calcWidth.bind(window, config.font = choseFont(config.fontlist));
    };
}());
var generateASS = function(danmaku, info) {
    var assHeader = fillStr(funStr(function() { /*! ASS弹幕文件文件头
[Script Info]
Title: {{title}}
Original Script: 根据 {{ori}} 的弹幕信息，由 https://github.com/tiansh/us-danmaku 于 {{time}} 生成
ScriptType: v4.00+
Collisions: Normal
PlayResX: {{playResX}}
PlayResY: {{playResY}}
Timer: 10.0000

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Fix,{{font}},{{size}},&H{{alpha}}FFFFFF,&H{{alpha}}FFFFFF,&H{{alpha}}000000,&H{{alpha}}000000,1,0,0,0,100,100,0,0,1,2,0,2,20,20,2,0
Style: R2L,{{font}},{{size}},&H{{alpha}}FFFFFF,&H{{alpha}}FFFFFF,&H{{alpha}}000000,&H{{alpha}}000000,1,0,0,0,100,100,0,0,1,2,0,2,20,20,2,0

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
*/


    }), config, info, {
        'alpha': hexAlpha(config.opacity),
        'size': config.font_size,
        'time': (new Date()).toString()
    });
    // 补齐数字开头的0
    var paddingNum = function(num, len) {
        num = '' + num;
        while (num.length < len) num = '0' + num;
        return num;
    };
    // 格式化时间
    var formatTime = function(time) {
        time = 100 * time ^ 0;
        var l = [
            [100,
                2
            ],
            [
                60,
                2
            ],
            [
                60,
                2
            ],
            [
                Infinity,
                0
            ]
        ].map(function(c) {
            var r = time % c[0];
            time = (time - r) / c[0];
            return paddingNum(r, c[1]);
        }).reverse();
        return l.slice(0, -1).join(':') + '.' + l[3];
    };
    // 格式化特效
    var format = (function() {
        // 适用于所有弹幕
        var common = function(line) {
            var s = '';
            var rgb = line.color.split(/(..)/).filter(function(x) {
                return x;
            }).map(function(x) {
                return parseInt(x, 16);
            });
            // 如果不是白色，要指定弹幕特殊的颜色
            if (line.color !== 'FFFFFF') // line.color 是 RRGGBB 格式
                s += '\\c&H' + line.color.split(/(..)/).reverse().join('');
            // 如果弹幕颜色比较深，用白色的外边框
            var dark = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114 < 48;
            if (dark) s += '\\3c&HFFFFFF';
            if (line.size !== 1) s += '\\fs' + Math.round(line.size * config.font_size);
            return s;
        };
        // 适用于从右到左弹幕
        var r2l = function(line) {
            return '\\move(' + [
                line.poss.x,
                line.poss.y,
                line.posd.x,
                line.posd.y
            ].join(',') + ')';
        };
        // 适用于固定位置弹幕
        var fix = function(line) {
            return '\\pos(' + [
                line.poss.x,
                line.poss.y
            ].join(',') + ')';
        };
        var withCommon = function(f) {
            return function(line) {
                return f(line) + common(line);
            };
        };
        return {
            'R2L': withCommon(r2l),
            'Fix': withCommon(fix),
        };
    }());
    // 转义一些字符
    var escapeAssText = function(s) {
        // "{"、"}"字符libass可以转义，但是VSFilter不可以，所以直接用全角补上
        return s.replace(/{/g, '｛').replace(/}/g, '｝').replace(/\r|\n/g, '');
    };
    // 将一行转换为ASS的事件
    var convert2Ass = function(line) {
        return 'Dialogue: ' + [
            0,
            formatTime(line.stime),
            formatTime(line.dtime),
            line.type, ',20,20,2,,',
        ].join(',') + '{' + format[line.type](line) + '}' + escapeAssText(line.text);
    };
    return assHeader + danmaku.map(convert2Ass).filter(function(x) {
        return x;
    }).join('\n');
};
/*

下文字母含义：
0       ||----------------------x---------------------->
           _____________________c_____________________
=        /                     wc                      \      0
|       |                   |--v--|                 wv  |  |--v--|
|    d  |--v--|               d f                 |--v--|
y |--v--|  l                                         f  |  s    _ p
|       |              VIDEO           |--v--|          |--v--| _ m
v       |              AREA            (x ^ y)          |

v: 弹幕
c: 屏幕

0: 弹幕发送
a: 可行方案

s: 开始出现
f: 出现完全
l: 开始消失
d: 消失完全

p: 上边缘（含）
m: 下边缘（不含）

w: 宽度
h: 高度
b: 底端保留

t: 时间点
u: 时间段
r: 延迟

并规定
ts := t0s + r
tf := wv / (wc + ws) * p + ts
tl := ws / (wc + ws) * p + ts
td := p + ts

*/
// 滚动弹幕
var normalDanmaku = (function(wc, hc, b, u, maxr) {
    return function() {
        // 初始化屏幕外面是不可用的
        var used = [{
                'p': -Infinity,
                'm': 0,
                'tf': Infinity,
                'td': Infinity,
                'b': false
            },
            {
                'p': hc,
                'm': Infinity,
                'tf': Infinity,
                'td': Infinity,
                'b': false
            },
            {
                'p': hc - b,
                'm': hc,
                'tf': Infinity,
                'td': Infinity,
                'b': true
            },
        ];
        // 检查一些可用的位置
        var available = function(hv, t0s, t0l, b) {
            var suggestion = [];
            // 这些上边缘总在别的块的下边缘
            used.forEach(function(i) {
                if (i.m > hc) return;
                var p = i.m;
                var m = p + hv;
                var tas = t0s;
                var tal = t0l;
                // 这些块的左边缘总是这个区域里面最大的边缘
                used.forEach(function(j) {
                    if (j.p >= m) return;
                    if (j.m <= p) return;
                    if (j.b && b) return;
                    tas = Math.max(tas, j.tf);
                    tal = Math.max(tal, j.td);
                });
                // 最后作为一种备选留下来
                suggestion.push({
                    'p': p,
                    'r': Math.max(tas - t0s, tal - t0l),
                });
            });
            // 根据高度排序
            suggestion.sort(function(x, y) {
                return x.p - y.p;
            });
            var mr = maxr;
            // 又靠右又靠下的选择可以忽略，剩下的返回
            suggestion = suggestion.filter(function(i) {
                if (i.r >= mr) return false;
                mr = i.r;
                return true;
            });
            return suggestion;
        };
        // 添加一个被使用的
        var use = function(p, m, tf, td) {
            used.push({
                'p': p,
                'm': m,
                'tf': tf,
                'td': td,
                'b': false
            });
        };
        // 根据时间同步掉无用的
        var syn = function(t0s, t0l) {
            used = used.filter(function(i) {
                return i.tf > t0s || i.td > t0l;
            });
        };
        // 给所有可能的位置打分，分数是[0, 1)的
        var score = function(i) {
            if (i.r > maxr) return -Infinity;
            return 1 - hypot(i.r / maxr, i.p / hc) * Math.SQRT1_2;
        };
        // 添加一条
        return function(t0s, wv, hv, b) {
            var t0l = wc / (wv + wc) * u + t0s;
            syn(t0s, t0l);
            var al = available(hv, t0s, t0l, b);
            if (!al.length) return null;
            var scored = al.map(function(i) {
                return [score(i),
                    i
                ];
            });
            var best = scored.reduce(function(x, y) {
                return x[0] > y[0] ? x : y;
            })[1];
            var ts = t0s + best.r;
            var tf = wv / (wv + wc) * u + ts;
            var td = u + ts;
            use(best.p, best.p + hv, tf, td);
            return {
                'top': best.p,
                'time': ts,
            };
        };
    };
}(config.playResX, config.playResY, config.bottom, config.r2ltime, config.max_delay));
// 顶部、底部弹幕
var sideDanmaku = (function(hc, b, u, maxr) {
    return function() {
        var used = [{
                'p': -Infinity,
                'm': 0,
                'td': Infinity,
                'b': false
            },
            {
                'p': hc,
                'm': Infinity,
                'td': Infinity,
                'b': false
            },
            {
                'p': hc - b,
                'm': hc,
                'td': Infinity,
                'b': true
            },
        ];
        // 查找可用的位置
        var fr = function(p, m, t0s, b) {
            var tas = t0s;
            used.forEach(function(j) {
                if (j.p >= m) return;
                if (j.m <= p) return;
                if (j.b && b) return;
                tas = Math.max(tas, j.td);
            });
            return {
                'r': tas - t0s,
                'p': p,
                'm': m
            };
        };
        // 顶部
        var top = function(hv, t0s, b) {
            var suggestion = [];
            used.forEach(function(i) {
                if (i.m > hc) return;
                suggestion.push(fr(i.m, i.m + hv, t0s, b));
            });
            return suggestion;
        };
        // 底部
        var bottom = function(hv, t0s, b) {
            var suggestion = [];
            used.forEach(function(i) {
                if (i.p < 0) return;
                suggestion.push(fr(i.p - hv, i.p, t0s, b));
            });
            return suggestion;
        };
        var use = function(p, m, td) {
            used.push({
                'p': p,
                'm': m,
                'td': td,
                'b': false
            });
        };
        var syn = function(t0s) {
            used = used.filter(function(i) {
                return i.td > t0s;
            });
        };
        // 挑选最好的方案：延迟小的优先，位置不重要
        var score = function(i, is_top) {
            if (i.r > maxr) return -Infinity;
            var f = function(p) {
                return is_top ? p : (hc - p);
            };
            return 1 - (i.r / maxr * (31 / 32) + f(i.p) / hc * (1 / 32));
        };
        return function(t0s, hv, is_top, b) {
            syn(t0s);
            var al = (is_top ? top : bottom)(hv, t0s, b);
            if (!al.length) return null;
            var scored = al.map(function(i) {
                return [score(i, is_top),
                    i
                ];
            });
            var best = scored.reduce(function(x, y) {
                return x[0] > y[0] ? x : y;
            })[1];
            use(best.p, best.m, best.r + t0s + u)
            return {
                'top': best.p,
                'time': best.r + t0s
            };
        };
    };
}(config.playResY, config.bottom, config.fixtime, config.max_delay));
// 为每条弹幕安置位置
var setPosition = function(danmaku) {
    var normal = normalDanmaku(),
        side = sideDanmaku();
    return danmaku.sort(function(x, y) {
        return x.time - y.time;
    }).map(function(line) {
        var font_size = Math.round(line.size * config.font_size * config.exlinespace);
        var width = calcWidth(line.text, Math.round(line.size * config.font_size));
        switch (line.mode) {
            case 'R2L':
                return (function() {
                    var pos = normal(line.time, width, font_size, line.bottom);
                    if (!pos) return null;
                    line.type = 'R2L';
                    line.stime = pos.time;
                    line.poss = {
                        'x': config.playResX + width / 2,
                        'y': pos.top + font_size,
                    };
                    line.posd = {
                        'x': -width / 2,
                        'y': pos.top + font_size,
                    };
                    line.dtime = config.r2ltime + line.stime;
                    return line;
                }());
            case 'TOP':
            case 'BOTTOM':
                return (function(isTop) {
                    var pos = side(line.time, font_size, isTop, line.bottom);
                    if (!pos) return null;
                    line.type = 'Fix';
                    line.stime = pos.time;
                    line.posd = line.poss = {
                        'x': Math.round(config.playResX / 2),
                        'y': pos.top + font_size,
                    };
                    line.dtime = config.fixtime + line.stime;
                    return line;
                }(line.mode === 'TOP'));
            default:
                return null;
        };
    }).filter(function(l) {
        return l;
    }).sort(function(x, y) {
        return x.stime - y.stime;
    });
};

/*
 * 设置面板部分
 */
//保存设置
var stringToNumberOrBoolean = function(input) {
    var output = parseFloat(input);
    if (!isNaN(output)) return output;
    output = input.trim().toLowerCase();
    if (output === "true") return true;
    if (output === "false") return false;
    return input;
};
var saveSetting = function(e) {
    e.preventDefault();
    if (document.querySelector(".assdanmakusetting-container").reportValidity()) {
        for (let item of document.querySelector(".assdanmakusetting-container").querySelectorAll("input, select")) {
            var parser = stringToNumberOrBoolean;
            if ((item.tagName == "INPUT") && (item.type == "text")) {
                switch (settingitems?.[item.name]?.datatype) {
                    case "array":
                        parser = (input) => input.split(',');
                        break;
                    default:
                };
            };
            config[item.name] = parser(item.value);
        };
        GM_setValue("config", config);
        debug = config.debug ? console.log.bind(console) : function() {};
        initFont();
        alert(l10n.message.configsaved);
    };
};
//创建设置面板
var openSettingPanel = function() {
    if (document.querySelector(".assdanmakusetting-window") == null) {
        document.body.insertAdjacentHTML("beforeend", fillStr(settingPanelHTMLtemplate, {
            'title': l10n.ui.settingpaneltitle,
            'save': l10n.ui.save,
            'exit': l10n.ui.exit
        }));
        document.querySelector(".assdanmakusetting-savebutton").addEventListener('click', saveSetting);
        var container = document.querySelector(".assdanmakusetting-container");
        //添加设置项
        for (let key in settingitems) {
            var item = settingitems[key];
            var content = "";
            var attr = "";
            switch (item.htmltag) {
                case "input":
                    for (let i of item.exattr) {
                        attr = attr + i[0] + '="' + i[1] +'" ';
                    };
                    attr = attr + `type="${item.type}"`;
                    attr = attr + `value="${config[key]}"`;//设置为当前值, 注意toString后值的变化
                    content = fillStr(settingInputHTMLtemplate, {
                        'key': key,
                        'butsetdef': l10n.ui.defaultvalue,
                        'butsetcur': l10n.ui.currenttvalue,
                        'butsetdeftitle': l10n.ui.butsetdeftitle,
                        'butsetcurtitle': l10n.ui.butsetcurtitle,
                        'htmltag': "input",
                        'attr': attr,
                        'content': "",
                        'description': l10n.config.description[key]
                    });
                    container.insertAdjacentHTML("beforeend", fillStr(settingItemHTMLtemplate, {content: content}));
                    break;
                case "select":
                    var options = "";
                    for (let option of item.options) {
                        options = options + fillStr(settingOptionsHTMLtemplate, {
                            'value': option[0],
                            'text': option[1],
                        });
                    };
                    for (let i of item.exattr) {
                        attr = attr + i[0] + '="' + i[1] +'" ';
                    };
                    content = fillStr(settingInputHTMLtemplate, {
                        'key': key,
                        'butsetdef': l10n.ui.defaultvalue,
                        'butsetcur': l10n.ui.currenttvalue,
                        'butsetdeftitle': l10n.ui.butsetdeftitle,
                        'butsetcurtitle': l10n.ui.butsetcurtitle,
                        'htmltag': "select",
                        'attr': attr,
                        'content': options,
                        'description': l10n.config.description[key]
                    });
                    container.insertAdjacentHTML("beforeend", fillStr(settingItemHTMLtemplate, {content: content}));
                    container.lastElementChild.querySelector("select").value = config[key];//设置为当前值, 注意toString后值的变化
                    break;
                default:
            };
        };
        //最后几个按钮
        container.insertAdjacentHTML("beforeend", fillStr(settingItemHTMLtemplate, {
            'content': fillStr(last3ButtonHTMLtemplate, {
                'executecode': l10n.ui.executecode,
                'editconfig': l10n.ui.editconfig,
                'resetconfig': l10n.ui.resetconfig,
                'title': l10n.ui.misc
            })
        }));
        //添加事件监听器
        for (let node of container.getElementsByTagName("button")) {
            node.addEventListener("click", settingPanelButtonListener);
        };
        for (let node of container.getElementsByTagName("select")) {
            node.addEventListener("wheel", settingPanelSelectScrollListener);
        };
        for (let node of container.querySelectorAll(`input[type="text"]`)) {
            node.addEventListener("input", settingPanelTextCheckerListener);
        };
    };
};
//设置项按钮处理
var settingPanelButtonListener = function(e) {
    e.preventDefault();
    switch (e.currentTarget.getAttribute("act")) {
        //旁边的两个用于把值设置为默认值/当前值的按钮, 注意值toString后的变化
        case "setval":
            var inputelement = e.currentTarget.parentElement.querySelectorAll("input, select")[0];
            switch (e.currentTarget.getAttribute("acp")) {
                case "def":
                    inputelement.value = defconfig?.[inputelement.name];
                    break;
                case "cur":
                    inputelement.value = config?.[inputelement.name];
                    break;
                default:
            };
            break;
        //最下面几个按钮
        case "resetconfig":
            if (confirm(l10n.message.confirmresetconfig)) {
                GM_setValue("config", null);
                location.reload();
            };
            break;
        case "editconfig":
            var input = prompt(l10n.message.editconfig, JSON.stringify(config));
            if (input !== null) {
                config = JSON.parse(input);
                GM_setValue("config", config);
                debug = config.debug ? console.log.bind(console) : function() {};
                initFont();
                alert(l10n.message.configsaved);
            };
            break;
        case "executecode":
            eval(prompt());
            break;
        default:
    };
};
//设置项select滚轮处理
var settingPanelSelectScrollListener = function(e) {
    e.preventDefault();
    if (e.deltaY > 0) {
        if (e.currentTarget.selectedIndex < (e.currentTarget.options.length - 1)) {
            e.currentTarget.selectedIndex++;
        } else {
            e.currentTarget.selectedIndex = 0;
        };
    } else if (e.deltaY < 0) {
        if (e.currentTarget.selectedIndex > 0) {
            e.currentTarget.selectedIndex--;
        } else {
            e.currentTarget.selectedIndex = e.currentTarget.options.length - 1;
        };
    };
};
//设置项text验证处理
var settingPanelTextCheckerListener = function(e) {
    e.currentTarget.reportValidity();
};
/*
 * 下载部分
 */
//发送请求
var sendXHR = function(url, method, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) callback(xhr.response);
            else alert(l10n.message.xhrfailed + xhr.status);
        }
    };
    xhr.open(method, url);
    xhr.setRequestHeader("Cookie", document.cookie);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.send(data);
};
//将弹幕转换为ASS并保存
var nmina = function(dm, filename, exinfo) {
    var danmaku = dm.map(function(line) {
        return {
            'text': line.text,
            'time': line.time / 10,
            'color': line.color.substr(1),
            'mode': ['R2L', 'TOP', 'BOTTOM'][line.position],
            'size': Math.pow(1.5, (line.size - 1)),//line.size * 0.5 +0.5,
            'bottom': false,
            'sender': line.userid,
            // 'create': new Date(Number(info[5]) * 1000),
            // 'danmakuid': info[6], // format as uuid
        };
    });
    debug(l10n.message.gotdanmaku, danmaku.length, exinfo.ori);
    var ass = generateASS(setPosition(danmaku), exinfo);
    startDownload('﻿' + ass, filename + '.ass');
};
//从SN号获取弹幕
var downloadDanmakuformSN = function(inputstr, filename, exinfo) {
    var snid = /^\d+$/.test(inputstr) ? inputstr : inputstr.match(/((?<=\?sn=)\d+)|((?<=sn)\d+)/)?.at(0);
    if (snid == null) { alert(l10n.message.invalidsnid); debug(l10n.message.invalidsnidlog + inputstr); return; };
    var fname = null;
    var info1 = { 'ori': "https://ani.gamer.com.tw/animeVideo.php?sn=" + snid };
    var gettitle = function(resp) {
        try {
            info1.title = (new DOMParser()).parseFromString(resp, "text/html").title;
        }
        catch (e) { debug(e) };
        sendXHR("https://ani.gamer.com.tw/ajax/danmuGet.php", "POST", "sn=" + snid.toString(10), getdanmu);
    };
    var getdanmu = function(resp) {
        Object.assign(info1,exinfo);
        try {
            fname = info1.title.replace("線上看 - 巴哈姆特動畫瘋", "[Baha]");
        }
        catch (e) { debug(e) };
        nmina(JSON.parse(resp), (filename == null || filename === "") ? fname : filename, info1);
    };
    //如果没有标题则获取标题
    if (exinfo?.hasOwnProperty("title")) sendXHR("https://ani.gamer.com.tw/ajax/danmuGet.php", "POST", "sn=" + snid.toString(10), getdanmu);
    else sendXHR("https://ani.gamer.com.tw/animeVideo.php?sn=" + snid, "GET", null, gettitle);
};
/*
 * 页面部分
 */
//下载按钮事件监听器
var DLButtonListener = function(e) {
    e.preventDefault();
    downloadDanmakuformSN(e.currentTarget.getAttribute("snid"));
};
//从列表生成下载按钮
var genDLButtonformList = function(snlist) {
    var bs = document.createElement("div");
    bs.insertAdjacentHTML("afterbegin", fillStr(`<p style="font-size:1.2em;">{{text}}</p>`, { 'text': l10n.text.episodelistgetdanmaku }));
    for (let node of snlist) {
        if (node.sn === "---") {
            var p = document.createElement("p");
            p.textContent = node.text;
            bs.appendChild(p);
        } else {
            var b = document.createElement("button");
            b.className = "listdownloadbutton";
            b.textContent = node.text;
            b.setAttribute("snid", node.sn);
            b.addEventListener('click', DLButtonListener);
            bs.appendChild(b);
        };
    };
    return bs;
};
//添加播放页面的按钮
var initPlayPageButton = function() {
    //当前集数的按钮
    const b = document.createElement("button");
    b.textContent = l10n.text.getdanmaku;
    b.addEventListener('click', e => {
        e.preventDefault();
        var fname = null;
        try {
            fname = document.title.replace("線上看 - 巴哈姆特動畫瘋", "[Baha]");
        }
        catch (e) {};
        downloadDanmakuformSN(location.href, fname, {
            'title': document.title,
            'ori': location.href
        });
    });
    b.className = "ahveuiw";
    document.querySelector(".anime_name").appendChild(b);
    //剧集列表的按钮
    var episodelist = new Array();
    for (let node1 of document.querySelector(".season").children) {
        if (node1?.tagName.toLowerCase() == "p") {
            episodelist.push({
            'sn': "---",
            'text': node1.textContent
            });
        };
        if (node1?.tagName.toLowerCase() == "ul") {
            for (let node2 of node1.children) {
                episodelist.push({
                    'sn': node2.querySelector("a").getAttribute("href"),
                    'text': node2.querySelector("a").textContent
                });
            };
        };
    };
    document.querySelector(".season").appendChild(genDLButtonformList(episodelist));
};
//添加新番列表的按钮
var initNewanimelistButton = function() {
    for (let node of document.querySelector(".newanime-block").children) {
        try {
            if (node.querySelector(".anime-card-block") == null) continue;
            var b = document.createElement("div");
            //debug(node);
            b.className = "listgetassdanmaku-button";
            b.textContent = l10n.text.getdanmaku;
            b.setAttribute("snid", node.querySelector(".anime-card-block").getAttribute("href"));
            b.addEventListener('click', DLButtonListener);
            var ae = node.querySelector(".anime-episode");
            if (ae == null) { ae = document.createElement("div"); ae.className = "anime-episode"; node.querySelector("anime-detail-info-block").appendChild(ae); }
            ae.insertAdjacentHTML("beforeend", "<p>&nbsp;</p>");
            ae.appendChild(b);
        }
        catch (e) { debug(e) };
    };
};
var initDaylistButton = function() {
    for (let node of document.querySelector(".programlist-block").querySelectorAll("a.text-anime-info")) {
        try {
            var b = document.createElement("div");
            b.className = "listgetassdanmaku-button";
            b.textContent = l10n.text.getdanmaku;
            b.setAttribute("snid", node.getAttribute("href"));
            b.addEventListener('click', DLButtonListener);
            node.appendChild(b);
        }
        catch (e) { debug(e) };
    };
};
/*
 * Common
 */
// 初始化
var init = function() {
    Object.assign(l10n, lang?.[config.language]);
    GM_registerMenuCommand(l10n.ui.getdanmakuformsn, function(){downloadDanmakuformSN(prompt(l10n.message.getdanmakuformsn));});
    GM_registerMenuCommand(l10n.ui.setting, openSettingPanel);
    GM_addStyle(injectedCSS);
    initFont();
    if ((document.querySelector(".anime-detail-info-block") != null) && config.enableNewanimelistButtoms) initNewanimelistButton();
    if ((document.querySelector(".programlist-block") != null) && config.enableDaylistButtoms) initDaylistButton();
    if ((document.querySelector(".anime_name") != null) && config.enablePlayPageButtoms) initPlayPageButton();
};
if (document.body) init();
else window.addEventListener('DOMContentLoaded', init);