/*========================================如 有 自 定 义 代 码 里 面 的 图 片 注 意 备 份 ！！！========================================*/

/*========================================如 有 自 定 义 代 码 里 面 的 图 片 注 意 备 份 ！！！========================================*/

/*========================================如 有 自 定 义 代 码 里 面 的 图 片 注 意 备 份 ！！！========================================*/

/*========================================如 有 自 定 义 代 码 里 面 的 图 片 注 意 备 份 ！！！========================================*/

// ==UserScript==
// @name         搜索页面美化
// @name:zh      搜索页面美化
// @name:en      Search page beautification
// @name:ja      検索ページの美化
// @description  支持的搜索引擎有1.百度；2.搜狗；3.谷歌；4.必应。兼容“AC-baidu”脚本【支持自定义背景】【支持随机背景图】【支持背景图分类】【支持屏蔽广告】【支持透明度调节】
// @description:zh  支持的搜索引擎有1.百度；2.搜狗；3.谷歌；4.必应。兼容“AC-baidu”脚本【支持自定义背景】【支持随机背景图】【支持背景图分类】【支持屏蔽广告】【支持透明度调节】
// @description:en  Supported search engines are 1. Baidu; 2. Sogou; 3. Google; 4. Bing. Compatible with "AC-baidu" script[Support custom background] [Support random background image] [Support background image classification] [Support shielding ads] [Support transparency adjustment]
// @description:ja  サポートされている検索エンジンは、1。Baidu、2。Sogou、3。Google、4。Bingです。 「AC-baidu」スクリプトと互換性があります[カスタム背景のサポート] [ランダムな背景画像のサポート] [背景画像の分類のサポート] [シールド広告のサポート] [透明度の調整のサポート]
// @icon         https://upyun.calendarli.com/logo.png
// @author       只为你收集世间云朵
// @license      MIT License
// @version      4.1.3
// @namespace    https://www.calendarli.com
// @match        *://www.google.com/search?*
// @match        *://www.google.com.hk/search?*
// @match        *://cn.bing.com/search?*
// @match        *://www.bing.com/search?*
// @match        *://www.baidu.com/s?*
// @match        *://www.baidu.com/baidu?*
// @match        *://www.sogou.com/web?*
// @grant        GM_log
// @connect      google.com
// @connect      baidu.com
// @connect      sogou.com
// @connect      bing.com
// @require      http://cdn.staticfile.org/jquery/2.0.0/jquery.min.js
// @require      https://greasyfork.org/scripts/422038-%E5%8F%96%E8%89%B2%E5%99%A8js%E8%84%9A%E6%9C%AC/code/%E5%8F%96%E8%89%B2%E5%99%A8JS%E8%84%9A%E6%9C%AC.js?version=902518
// @copyright    该脚本完全由 只为你收集世间云朵@greasyfork 原创，谢绝抄袭部分或全部代码！如有借鉴代码，请声明并标注脚本链接。
// @copyright:en   This script is completely original by 你收集世间云朵@greasyfork, please do not copy part or all of the code! If you have reference code, please declare and mark the script link.
// @copyright:ja   このスクリプトは你收集世间云朵@ greasyforkによって完全にオリジナルです。コードの一部または全部をコピーしないでください。 参照コードがある場合は、スクリプトリンクを宣言してマークを付けてください。
// @downloadURL https://update.greasyfork.org/scripts/401473/%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/401473/%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==


(function() {

    setTimeout(function() {
        $('html').append($('<style>').append("@media only screen and (min-width: 321px) and (max-width: 1300px){div#rcnt>div:nth-child(2) {display: none;}}div#center_col {margin-left: 132px;}body.b_lbShow #b_header{position: relative;z-index: 9999;} /*Main container*/ #wrapper #content_left .result[tpl='soft'] .op-soft-title, #wrapper #content_left .result h3, #wrapper #content_left .c-container h3{    background-color: #ffffffa8;}#wrapper #rs, #wrapper #content_left .result, #wrapper #content_left .c-container,#rso .g{background: rgba(243 243 243 / " + getVariable('ListTransparencyNumberValue') + ");backdrop-filter: blur(2px);padding: 10px 20px;border-radius: 6px;}div.colpick_dark{z-index: 99;}#b_results>.b_algo{margin-top: 10px;}.search_tool_conter.new_search_tool_conter span,div#b_tween span,.b_underSearchbox span{color: #e9a2b0;}.s_tab_inner {margin-top: 10px;background: #ffffffa8;width: 591px;padding: 0 5px;margin-left: -10px;}.container_s>div#content_right{position: relative;right: -72px;}.colpick { position: absolute; width: 346px; height: 170px; overflow: hidden; display: none; font-family: Arial, Helvetica, sans-serif; background:#ebebeb; border: 1px solid #bbb; -webkit-border-radius: 5px; -moz-border-radius: 5px; border-radius: 5px;  /*Prevents selecting text when dragging the selectors*/ -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -o-user-select: none; user-select: none; } .colpick, .colpick * { -moz-box-sizing: content-box; -webkit-box-sizing: content-box; box-sizing: content-box; } /*Color selection box*/ .colpick_color { position: absolute; left: 7px; top: 7px; width: 156px; height: 156px; overflow: hidden; outline: 1px solid #aaa; cursor: crosshair; } .colpick_color_overlay1 { position: absolute; left:0; top:0; width: 156px; height: 156px; filter:  progid:DXImageTransform.Microsoft.gradient(GradientType=1,startColorstr='#ffffff', endColorstr='#00ffffff'); /* IE6 & IE7 */ -ms-filter: 'progid:DXImageTransform.Microsoft.gradient(GradientType=1,startColorstr='#ffffff', endColorstr='#00ffffff')'; /* IE8 */ background: linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0)); } .colpick_color_overlay2 { position: absolute; left:0; top:0; width: 156px; height: 156px; filter:  progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='#00000000', endColorstr='#000000'); /* IE6 & IE7 */ -ms-filter: 'progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='#00000000', endColorstr='#000000')'; /* IE8 */ background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1)); } /*HSL gradients are different*/ .colpick_hsl .colpick_color_overlay1 { background: linear-gradient(to right, rgba(128,128,128,1) 0%, rgba(128,128,128,0) 100%); } .colpick_hsl .colpick_color_overlay2 { background: linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 100%); } /*Circular color selector*/ .colpick_selector_outer { background:none; position: absolute; width: 11px; height: 11px; margin: -6px 0 0 -6px; border: 1px solid black; border-radius: 50%; } .colpick_selector_inner{ position: absolute; width: 9px; height: 9px; border: 1px solid white; border-radius: 50%; } /*Vertical hue bar*/ .colpick_hue { position: absolute; top: 6px; left: 175px; width: 19px; height: 156px; border: 1px solid #aaa; cursor: n-resize; } /*Hue bar sliding indicator*/ .colpick_hue_arrs { position: absolute; left: -8px; width: 35px; height: 7px; margin: -7px 0 0 0; } .colpick_hue_larr { position:absolute; width: 0;  height: 0;  border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-left: 7px solid #858585; } .colpick_hue_rarr { position:absolute; right:0; width: 0;  height: 0;  border-top: 6px solid transparent; border-bottom: 6px solid transparent;  border-right: 7px solid #858585;  } /*New color box*/ .colpick_new_color { position: absolute; left: 207px; top: 6px; width: 60px; height: 27px; background: #f00; border: 1px solid #8f8f8f; } /*Current color box*/ .colpick_current_color { position: absolute; left: 277px; top: 6px; width: 60px; height: 27px; background: #f00; border: 1px solid #8f8f8f; } /*Input field containers*/ .colpick_field, .colpick_hex_field  { position: absolute; height: 20px; width: 60px; overflow:hidden; background:#f3f3f3; color:#b8b8b8; font-size:12px; border:1px solid #bdbdbd; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; } .colpick_rgb_r { top: 40px; left: 207px; } .colpick_rgb_g { top: 67px; left: 207px; } .colpick_rgb_b { top: 94px; left: 207px; } .colpick_hsx_h { top: 40px; left: 277px; } .colpick_hsx_s { top: 67px; left: 277px; } .colpick_hsx_x { top: 94px; left: 277px; } .colpick_hex_field { width: 68px; left: 207px; top: 121px; } /*Text field container on focus*/ .colpick_focus { border-color: #999; } /*Field label container*/ .colpick_field_letter { position: absolute; width: 12px; height: 20px; line-height: 20px; padding-left: 4px; background: #efefef; border-right: 1px solid #bdbdbd; font-weight: bold; color:#777; } /*Text inputs*/ .colpick_field input, .colpick_hex_field input { position: absolute; right: 11px; margin: 0; padding: 0; height: 20px; line-height: 20px; background: transparent; border: none; font-size: 12px; font-family: Arial, Helvetica, sans-serif; color: #555; text-align: right; outline: none; } .colpick_hex_field input { right: 4px; } /*Field up/down arrows*/ .colpick_field_arrs { position: absolute; top: 0; right: 0; width: 9px; height: 21px; cursor: n-resize; } .colpick_field_uarr { position: absolute; top: 5px; width: 0;  height: 0;  border-left: 4px solid transparent; border-right: 4px solid transparent; border-bottom: 4px solid #959595; } .colpick_field_darr { position: absolute; bottom:5px; width: 0;  height: 0;  border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 4px solid #959595; } /*Submit/Select button*/ .colpick_submit { position: absolute; left: 207px; top: 149px; width: 130px; height: 22px; line-height:22px; background: #efefef; text-align: center; color: #555; font-size: 12px; font-weight:bold; border: 1px solid #bdbdbd; -webkit-border-radius: 3px; -moz-border-radius: 3px; border-radius: 3px; } .colpick_submit:hover { background:#f3f3f3; border-color:#999; cursor: pointer; }  /*full layout with no submit button*/ .colpick_full_ns  .colpick_submit, .colpick_full_ns .colpick_current_color{ display:none; } .colpick_full_ns .colpick_new_color { width: 130px; height: 25px; } .colpick_full_ns .colpick_rgb_r, .colpick_full_ns .colpick_hsx_h { top: 42px; } .colpick_full_ns .colpick_rgb_g, .colpick_full_ns .colpick_hsx_s { top: 73px; } .colpick_full_ns .colpick_rgb_b, .colpick_full_ns .colpick_hsx_x { top: 104px; } .colpick_full_ns .colpick_hex_field { top: 135px; }  /*rgbhex layout*/ .colpick_rgbhex .colpick_hsx_h, .colpick_rgbhex .colpick_hsx_s, .colpick_rgbhex .colpick_hsx_x { display:none; } .colpick_rgbhex { width:282px; } .colpick_rgbhex .colpick_field, .colpick_rgbhex .colpick_submit { width:68px; } .colpick_rgbhex .colpick_new_color { width:34px; border-right:none; } .colpick_rgbhex .colpick_current_color { width:34px; left:240px; border-left:none; }  /*rgbhex layout, no submit button*/ .colpick_rgbhex_ns  .colpick_submit, .colpick_rgbhex_ns .colpick_current_color{ display:none; } .colpick_rgbhex_ns .colpick_new_color{ width:68px; border: 1px solid #8f8f8f; } .colpick_rgbhex_ns .colpick_rgb_r { top: 42px; } .colpick_rgbhex_ns .colpick_rgb_g { top: 73px; } .colpick_rgbhex_ns .colpick_rgb_b { top: 104px; } .colpick_rgbhex_ns .colpick_hex_field { top: 135px; }  /*hex layout*/ .colpick_hex .colpick_hsx_h, .colpick_hex .colpick_hsx_s, .colpick_hex .colpick_hsx_x, .colpick_hex .colpick_rgb_r, .colpick_hex .colpick_rgb_g, .colpick_hex .colpick_rgb_b { display:none; } .colpick_hex { width:206px; height:201px; } .colpick_hex .colpick_hex_field { width:72px; height:25px; top:168px; left:80px; } .colpick_hex .colpick_hex_field div, .colpick_hex .colpick_hex_field input { height: 25px; line-height: 25px; } .colpick_hex .colpick_new_color { left:9px; top:168px; width:30px; border-right:none; } .colpick_hex .colpick_current_color { left:39px; top:168px; width:30px; border-left:none; } .colpick_hex .colpick_submit { left:164px; top: 168px; width:30px; height:25px; line-height: 25px; }  /*hex layout, no submit button*/ .colpick_hex_ns  .colpick_submit, .colpick_hex_ns .colpick_current_color { display:none; } .colpick_hex_ns .colpick_hex_field { width:80px; } .colpick_hex_ns .colpick_new_color{ width:60px; border: 1px solid #8f8f8f; }  /*Dark color scheme*/ .colpick_dark { background: #161616; border-color: #2a2a2a; } .colpick_dark .colpick_color { outline-color: #333; } .colpick_dark .colpick_hue { border-color: #555; } .colpick_dark .colpick_field, .colpick_dark .colpick_hex_field { background: #101010; border-color: #2d2d2d; } .colpick_dark .colpick_field_letter { background: #131313; border-color: #2d2d2d; color: #696969; } .colpick_dark .colpick_field input, .colpick_dark .colpick_hex_field input { color: #7a7a7a; } .colpick_dark .colpick_field_uarr { border-bottom-color:#696969; } .colpick_dark .colpick_field_darr { border-top-color:#696969; } .colpick_dark .colpick_focus { border-color:#444; } .colpick_dark .colpick_submit { background: #131313; border-color:#2d2d2d; color:#7a7a7a; } .colpick_dark .colpick_submit:hover { background-color:#101010; border-color:#444; }"))
    }, 1000)

    /**
     * 图片数据
     */
    var GroupList = {
        Anime: {
            Name: "动漫",
            ImgList: [
                "https://upyun.calendarli.com/Anime/063f89738882f07b08aaebaeaff23510.jpg",
                "https://upyun.calendarli.com/Anime/1fa0ed09fe6ef8a09b114ba40b8c22f3.jpg",
                "https://upyun.calendarli.com/Anime/5bc35d75b52b852d12544b7d8c1b88c6.jpg",
                "https://upyun.calendarli.com/Anime/11fed6086ab5ee4cd24989a2a816db77.jpg"
            ]
        },
        landscape: {
            Name: "自然风景",
            ImgList: [
                "https://upyun.calendarli.com/Landscape/150909a21756042f3a38e0db3d47c2c5.jpg",
                "https://upyun.calendarli.com/Landscape/4940e494d71f9400a85f63288cefe8de.jpeg",
                "https://upyun.calendarli.com/Landscape/d5603970a58c68cb2e758f8e4924487a.jpeg",
                "https://upyun.calendarli.com/Landscape/db27f9d0e53d7571926c05faf63ce9a0.jpg"
            ]
        }
    };
    /**
     * localStorage数据储存的封装
     */
    // eslint-disable-next-line camelcase
    var CL_LocalStorage = ((function() {
        var currentLocalKey = "__CLKZB__STORAGE__KEY__";
        var currentLocal = localStorage.getItem(currentLocalKey);
        var currentLocalObject;
        if (currentLocal === null) {
            currentLocalObject = {};
        } else {
            currentLocalObject = JSON.parse(currentLocal);
        }
        return {
            getRawObj: function() {
                return currentLocalObject;
            },
            /**
             * 获取元素
             * @param key 要获取的值的key
             * @param defaultValue 若不存在相应的key,则应该返回的默认值,默认为undefined
             */
            getItem: function(key, defaultValue) {
                if (defaultValue === void 0) { defaultValue = undefined; }
                var value = currentLocalObject[key];
                if (value) {
                    return value;
                } else {
                    return defaultValue;
                }
            },
            /**
             * 设置元素
             * @param key 要设置的key
             * @param value 要设置的值内容
             */
            setItem: function(key, value) {
                currentLocalObject[key] = value;
            },
            /**
             * 保存数据到localStorage
             */
            save: function() {
                localStorage.setItem(currentLocalKey, JSON.stringify(currentLocalObject));
            },
            /**
             * 移除元素
             * @param key 要移除的key
             */
            removeItem: function(key) {
                delete currentLocalObject[key];
            },
            /**
             * 清空元素
             */
            clear: function() {
                currentLocalObject = {};
            }
        };
    })());

    var getVariable = (function(name) {
        /* 获取localStorage数据*/
        window.BackgroundTransparencyNumberValue = CL_LocalStorage.getItem('BackgroundTransparencyNumberValue', '0.4') //背景透明
        window.ListTransparencyNumberValue = CL_LocalStorage.getItem('ListTransparencyNumberValue', '0.6') //列表透明
        window.PureColorBackgroundChecked = CL_LocalStorage.getItem('PureColorBackgroundChecked', false) //自定义纯色背景
        window.CustomizeUrlValueChecked = CL_LocalStorage.getItem('CustomizeUrlValueChecked', '') //自定义URL值
        window.CustomizeURLChecked = CL_LocalStorage.getItem('CustomizeURLChecked', false) //自定义URL
        window.CustomBackgroundCode = CL_LocalStorage.getItem('CustomBackgroundCode', '#FFF') //纯色背景代码
        window.RandomPicturesChecked = CL_LocalStorage.getItem('RandomPicturesChecked', false) //随机图片
        window.picGroupSelectValue = CL_LocalStorage.getItem('picGroupSelectValue', 'Anime') //分组
        window.advertisingChecked = CL_LocalStorage.getItem('advertisingChecked', false) //清除广告
        window.SideColumnChecked = CL_LocalStorage.getItem('SideColumnChecked', false) //删除侧栏
        window.PictureURLIndex = CL_LocalStorage.getItem('PictureURLIndex', '0') //图片当前索引
        window.len = GroupList[picGroupSelectValue].ImgList.length - 1 //图片索引数量
        n = window[name]
        return n
    })

    /* 获取localStorage数据 */
    // var CustomBackgroundCode = CL_LocalStorage.getItem("CustomBackgroundCode", "#FFF"); // 纯色背景代码
    /* 输出localStorage数据到控制台 */
    console.log(CL_LocalStorage.getRawObj());

    /**
     * CSS数据
     */
    var cssContent = {
        'body': {
            "background-position-x": "center",
            "background-attachment": "fixed",
            "background-size": "cover",
            'z-index': '-1000',
            'position': 'relative'
        },
        "div#CL_Console": {
            "-moz-user-select": "none",
            "-webkit-user-select": "none",
            "-ms-user-select": "none",
            "-khtml-user-select": "none",
            "user-select": "none",
            'position': "fixed",
            'top': "35%",
            'left': "1",
            'z-index': '99'
        },
        "img#CL_img": {
            'width': "35px",
            "border-radius": "20px",
            'cursor': "pointer"
        },
        ".none": {
            'display': "none"
        },
        ".block": {
            'display': "block"
        },
        "div#CL_OperationPanel": {
            'width': "300px",
            'height': "300px",
            'background': "rgb(232 240 255 / 70%)",
            'backdrop-filter': 'blur(3px)',
            'position': "absolute",
            'top': "20px",
            'left': "35px",
            "box-shadow": "1px 1px 4px 0px #747698",
            "border-radius": "6px",
            'padding': "10px"
        },
        "div#CL_OperationPanel>div": {
            'height': "30px",
            "line-height": "30px",
            "margin-top": "10px"
        },
        ".Button": {
            'width': "49%",
            'display': "inline-block",
            "text-align": "center",
            'background': "#fbfbfb",
            "box-shadow": "1px 1px 3px 0px #5e8796",
            "border-radius": "7px",
            'cursor': "pointer",
            'background': 'rgba(240, 248, 255, 0)'
        },
        ".functional>p": {
            'margin': "0px",
            'display': "inline-block",
            'width': "31%"
        },
        ".color-box": {
            'float': "left",
            'width': "30px",
            'height': "20px",
            'margin': "5px",
            'border': "1px solid white",
            'cursor': "pointer"
        },
        "p.RandomPictures": {
            'float': "left",
            'margin': "0"
        },
        "span#save,span#Reset": {
            'margin': "auto",
            'display': "inline-block",
            'width': "50px",
            "margin-left": "10px"
        },
        ".OperationButton": {
            'position': "absolute",
            'left': "50%",
            "margin-left": "-66px",
            'bottom': "10px"
        },
        "#panelDOM select": {
            "border-color": "#7b7b7b"
        },
        ".checkboxWrap": {
            'cursor': "pointer"
        },
        '.wrapper_new #foot': {
            'background-color': '#f5f5f6a8'
        },
        "div#s_tab": {
            'background': '#f8f8f8'
        },
        '.s_tab_inner': {
            'background': 'none'
        },
        'div#fbar,.appbar,.yg51vc,#hdtb': {
            'background': '#f2f2f29e'
        },
        '.MXl0lf.mtqGb,div#pagebar_container': {
            'background': '#ffffffc9',
            'margin-top': '19px'
        },
        'div#b_content': {
            'padding-left': '140px'
        },
        'p.Customize.checkboxWrap': {
            'float': 'left',
            'margin': '0px',
            'cursor': 'pointer'
        },
        'div#CL_OperationPanel input[type="text"]': {
            'width': '190px',
            'margin-top': '4.3px',
            'height': '20px'
        },
        'span#help':{
            'background':'none'
        }

    };

    /**
     * 加载控制面板
     */
    $('body').append(
        $('<div id="CL_Console">').append(
            $('<img id="CL_img" src="https://upyun.calendarli.com/logo.png" title="MOD控制台"/>')
        ).append(
            $('<div id="CL_OperationPanel" class="none">').append(
                $('<div class="ChangePicture">').append('<span id="before" class="Button">上一张</span><span id="Rear" class="Button">下一张</span>')
            ).append(
                $('<div class="DropDownGroup">').append($('<span>切换分组：')).append($('<select class="select" name="picGroup" id="pic-group-selector">'))
            ).append(
                $('<div class="CustomizeURL">').append('<div><p class="Customize checkboxWrap" title="可填写图床URL"><input type="checkbox" name="CustomizeURL" value="自定义URL" default="false">自定义URL</p><input type="text" name="CustomizeUrlValue"></div>')
            ).append(
                $('<div class="transparency">').append(
                    $('<span>').append('背景透明度：')
                ).append('<select class="BackgroundSelector" name="BackgroundTransparency" cl-select-number defaultValue="0.4" maxValue="1" minValue="0" stepValue="0.1"></select>').append(
                    $('<span>').append('列表透明度：')
                ).append('<select class="ListSelector" name="ListTransparency" cl-select-number defaultValue="0.4" maxValue="1" minValue="0" stepValue="0.1"></select>')
            ).append(
                $('<div class="functional">').append('<p class="advertising checkboxWrap"><input type="checkbox" name="advertising" default="false" value="清除广告"/>清除广告</p><p class="SideColumn checkboxWrap"><input type="checkbox" name="SideColumn" default="false" value="删除侧栏"/>删除侧栏</p><p class="RandomPictures checkboxWrap"><input type="checkbox" name="RandomPictures" default="false" value="随机图片" title="启用后将禁用手动切换"/>随机图片</p>')
            ).append(
                $('<div class="PureColorBackground">').append(
                    $('<p class="RandomPictures checkboxWrap">').append('<input type="checkbox" name="PureColorBackground" value="纯色背景" default="false" title="启用后背景透明度将不可用"/>纯色背景')
                ).append('<div class="color-box"></div>')
            ).append(
                $('<div class="OperationButton">').append('<span id="save" class="Button">保存</span><span id="Reset" class="Button">重置</span>')
            )
        )
    )
    $('#CL_OperationPanel input[name=CustomizeUrlValue]').val(getVariable('CustomizeUrlValueChecked'))
    $('#CL_Console').siblings().on('click',()=>{
        $('#CL_OperationPanel').hide(200)
    })

    /**
         * 启用调色器
         */
    // @ts-ignore
    /*$(".color-box").colpick({
        colorScheme: "dark",
        layout: "rgbhex",
        color: "fff",
        onSubmit: function(hsb, hex, rgb, el) {
            $(el).css("background-color", "#" + hex);
            // @ts-ignore
            $(el).colpickHide();
        }
    });*/

    /**
     * 加载自定义的背景色
     */
    $(".color-box").css("background-color", getVariable('CustomBackgroundCode')); // 纯色背景代码
    /**
     * 把固定CSS数据绑定到相应的元素上
     */
    for (var selector in cssContent) {
        $(selector).css(cssContent[selector]);
    }

    /**
     * 加载分组选项
     */
    for (var group in GroupList) {
        $("#pic-group-selector").append("<option value=\"" + group + "\">" + GroupList[group].Name + "</option>");
    }
    /**
     * 加载checkbox的选中
     */
    $.each($("#CL_OperationPanel input[type=checkbox]"), function(_, item) {
        var jqDOM = $(item);
        var key = jqDOM.attr("name") + "Checked";
        var defaultValue = JSON.parse(jqDOM.attr("default"));
        jqDOM.prop("checked", CL_LocalStorage.getItem(key, defaultValue));
    });
    /**
     * 加载number下拉选项的选项内容
     */
    $.each($("select[cl-select-number]"), function(_, item) {
        var jqDOM = $(item);
        var key = jqDOM.attr("name") + "NumberValue";
        var defaultValue = parseFloat(JSON.parse(jqDOM.attr("defaultValue")));
        var minValue = parseFloat(jqDOM.attr("minValue"));
        var maxValue = parseFloat(jqDOM.attr("maxValue"));
        var stepValue = parseFloat(jqDOM.attr("stepValue"));
        var targetValue = CL_LocalStorage.getItem(key, defaultValue);
        for (var i = minValue; i <= maxValue; i = parseFloat((i + stepValue).toPrecision(12))) {
            if (Math.abs(targetValue - i) < 0.0001) {
                jqDOM.append("<option value=\"" + i + "\" selected>" + i + "</option>");
            } else {
                jqDOM.append("<option value=\"" + i + "\">" + i + "</option>");
            }
        }
    });

    (function() {
        var key = $("#pic-group-selector").attr("name") + "SelectValue";
        var targetValue = CL_LocalStorage.getItem(key);
        if (targetValue) {
            $("#pic-group-selector").val(targetValue);
        }
    })();

    $('body').prepend($('<div class="Masklayer" style="background: #fff;width: 10090px;height: 10080px;z-index: -999;position: fixed;top: 0px;left: 0px; opacity:0.4;">'))
    var Output = function() {

        var obj = new Image();
        /**
         * 输出背景
         */
        if (getVariable('CustomizeURLChecked') == true) {
            obj.src = getVariable('CustomizeUrlValueChecked')
        } else {
            if (getVariable('RandomPicturesChecked') == true) {
                obj.src = GroupList[getVariable('picGroupSelectValue')].ImgList[parseInt(Math.random() * getVariable('len') + 1)]
            } else {
                obj.src = GroupList[getVariable('picGroupSelectValue')].ImgList[getVariable('PictureURLIndex')];
            }
        }
        /**
         * 输出纯色背景
         */
        if (getVariable('PureColorBackgroundChecked') == true) {
            $('body')[0].style.backgroundColor = getVariable('CustomBackgroundCode')
            $('body')[0].style.backgroundImage = ''
        } else {
            obj.onload = function() {
                $('body')[0].style.backgroundImage = 'url(' + this.src + ')'
                $('body')[0].style.backgroundColor = ''
                console.log(getVariable('PictureURLIndex') + '/' + getVariable('len'))
            }
        }
        /**
         * 清除侧栏
         */
        if (getVariable('SideColumnChecked') == true) {
            $('div#content_right,div#rhs[jscontroller],aside[aria-label],div#right[class="right"],div#rcnt>div:nth-child(2)').hide()
        } else {
            $('div#content_right,div#rhs[jscontroller],aside[aria-label],div#right[class="right"],div#rcnt>div:nth-child(2)').show()
        }
        /**div#rhs
         * 清除广告
         */
        if (getVariable('advertisingChecked') == true) {
            setInterval(function() { $('.new-pmd.c-container[data-ecimtimesign],div[class="result c-container"],#bottomads,div#center_col>#taw').hide() }, 1000)
        } else {
            $('.new-pmd.c-container[data-ecimtimesign]').show()
        }

        /**
         * 设置背景透明
         */
        $('.Masklayer')[0].style.opacity = getVariable('BackgroundTransparencyNumberValue')

        /**
         * 设置列表透明
         */
        $('div[class ^= result],div[data-ecimtimesign],div#rhs[jscontroller],.kp-blk.knowledge-panel.Wnoohf.OJXvsb,div.hlcw0c>.g,.ccBEnf,.MGqjK,ol#b_results li[class],#b_context li,header#b_header,#wrapper div#right,#taw,#bottomads>div').attr({ style: 'background: rgba(243 243 243 / ' + getVariable('ListTransparencyNumberValue') + ');backdrop-filter: blur(2px);padding: 10px 20px;border-radius: 6px;' })

    }

    /**适应搜索动态刷新列表 */
    $(document).on('change', '#b_context li', Output())

    /**
     * 默认调整样式
     */
    $('div#rs,span.fk,#bres,#b_results>.b_ans,div#promotion_adv_container,.hintBox,#leftbottomleadContainer').hide()
    $('h3[class="t"],h3[class="LC20lb DKV0Md"]').after('<hr/>')
    $('#page a,.page-inner strong').attr({ style: 'height: 36px;    background: #ffffffb8;' })
    $('.result-molecule.new-pmd[tpl="app/page"]').css('height','73px')
    $('div#page').css({'background':'none','margin':'0'})
    setTimeout(function(){
        $('.result-molecule.new-pmd[tpl="app/rs"]').css('width','58%')
    },500)

    Output()

    /**
     * 操作板的显示/隐藏
     */
    $(document).on("click", "#CL_img", function() {
        $("#CL_OperationPanel").toggle(200);
    });
    /**
     * 自定义按钮的按下动态特效
     */
    $(document).on("mousedown", ".Button", function() {
        $(this).css("box-shadow", "1px 1px 1px 0px #5e8796");
    });
    /**
     * 自定义按钮的松开动态特效
     */
    $(document).on("mouseup", ".Button", function() {
        $(this).css("box-shadow", "1px 1px 3px 0px #5e8796");
    });
    /**
     * 背景前后切换
     */
    $(document).on('click', '#before', function() {
        var xn = getVariable('PictureURLIndex') ? Number(getVariable('PictureURLIndex')) - 1 : getVariable('len');
        xn = xn < '0' ? getVariable('len') : xn
        CL_LocalStorage.setItem("PictureURLIndex", String(xn))
        CL_LocalStorage.save()
        // window.location.reload();
        Output()
    })
    $(document).on('click', '#Rear', function() {
        var xn = getVariable('PictureURLIndex') ? Number(getVariable('PictureURLIndex')) + 1 : 1;
        console.log(picGroupSelectValue + ':' + xn + '/' + getVariable('len'))
        xn = xn > getVariable('len') ? '0' : xn
        CL_LocalStorage.setItem("PictureURLIndex", String(xn))
        CL_LocalStorage.save()
        // window.location.reload();
        Output()
    })

    /**
     * 重置
     */
    $(document).on("click", "#Reset", function() {
        CL_LocalStorage.clear();
        CL_LocalStorage.save()
        window.location.reload();
    });
    /**
     * 保存
     */
    $(document).on("click", "#save", function() {
        /**
         * 保存数字选项的值
         */
        $.each($("select[cl-select-number]"), function(_, item) {
            var jqDOM = $(item);
            var key = jqDOM.attr("name") + "NumberValue";
            var value = jqDOM.val();
            CL_LocalStorage.setItem(key, value);
        });
        /**
         * 保存picGroup的值
         */
        (function() {
            var key = $("#pic-group-selector").attr("name") + "SelectValue";
            var value = $("#pic-group-selector").val();
            CL_LocalStorage.setItem(key, value);
        })();
        /**
         * 保存Checkbox的值
         */
        $.each($("#CL_OperationPanel input[type=checkbox]"), function(_, item) {
            var jqDOM = $(item);
            var key = jqDOM.attr("name") + "Checked";
            var value = jqDOM.prop("checked");
            CL_LocalStorage.setItem(key, value);
        });
        /**
         * 保存text的值
         */
        $.each($("#CL_OperationPanel input[type=text]"), function(_, item) {
            var jqDOM = $(item);
            var key = jqDOM[0].name + "Checked";
            var value = jqDOM.val();
            CL_LocalStorage.setItem(key, value);
        })
        /**
             * 保存自定义颜色代码
             */
        CL_LocalStorage.setItem("CustomBackgroundCode", $(".color-box")[0].style.backgroundColor);
        /**
         * 保存默认图片索引
         */
        var PX = CL_LocalStorage.getItem("PictureURLIndex") ? function() {} : function() { CL_LocalStorage.setItem("PictureURLIndex", '0') }
        PX();
        CL_LocalStorage.save();
        // window.location.reload();
        Output()
    });
    /**
     * 点击checkbox的外部,也相当于点击了checkbox内部
     */
    $(document).on("click", ".checkboxWrap", function(event) {
        $.each($(event.target).children("input[type=checkbox]"), function(_, item) {
            $(item).prop("checked", !$(item).prop("checked"));
        });
    });
})();