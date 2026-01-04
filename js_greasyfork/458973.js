// ==UserScript==
// @name         AdaptDark_黑夜模式亮度调节器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  浏览器设置为黑夜主题时, 将自适应调节亮度. 初次使用需要进入右键菜单进行个性化设置.
// @author       bode135
// @include      *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458973/AdaptDark_%E9%BB%91%E5%A4%9C%E6%A8%A1%E5%BC%8F%E4%BA%AE%E5%BA%A6%E8%B0%83%E8%8A%82%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/458973/AdaptDark_%E9%BB%91%E5%A4%9C%E6%A8%A1%E5%BC%8F%E4%BA%AE%E5%BA%A6%E8%B0%83%E8%8A%82%E5%99%A8.meta.js
// ==/UserScript==




(function() {
    'use strict';

    // --- 创建遮罩
    var mask = document.createElement("div");
    mask.setAttribute('style', 'position:fixed;top:0;left:0;outline:5000px solid;z-index:99999;');
    document.body.appendChild(mask);

    function get_brightness_by_input(input)
    {
        if (input == "" || input == null) return null;

        var x = Number(input);

        if (isNaN(x) || x > 100 || x < 0)
        {
            return NaN;
        }

        if (x > 1)
        {
            x = x / 100;
        }

        return x;
    }

    function cover(input) {
        /* input其实是遮罩层的透明度, 用1减去后变为下层的亮度 */

        var x = get_brightness_by_input(input);

        if (x == null) return 0;

        if (isNaN(x))
        {
            alert("请输入一个[0~1]之间的小数作为屏幕亮度!");
            return 0;
        }

        // 从暗度变为亮度
        var brightness = 1 - x;

        mask.style.outlineColor = 'rgba(0,0,0,' + brightness + ')';
        return 1;
    }

    // --- 计算本网站的初始化亮度值
    var default_init_brightness = 0.75;
    var init_brightness = default_init_brightness;

    // 加载用户偏好(个性化网站亮度)
    let hostname = window.location.hostname;
    var key = "my_custom_brightness_dc";
    var my_custom_brightness_dc = GM_getValue(key);
    if (!my_custom_brightness_dc) my_custom_brightness_dc = {};

    // 判断是否设置了所有网站的默认亮度
    var null_ls = [null, undefined, ""];
    var default_brightness = GM_getValue("default_brightness");
    if (!null_ls.includes(default_brightness))
    {
        init_brightness = default_brightness;
    }
    else
    {
        default_brightness = init_brightness;
    }

    if(my_custom_brightness_dc.hasOwnProperty(hostname))
    {
        var custom_brightness = my_custom_brightness_dc[hostname];
        if (!null_ls.includes(custom_brightness))
        {
            init_brightness = custom_brightness;
        }
    }
    // console.log("--- my_custom_brightness_dc:", my_custom_brightness_dc);

    // --- 根据主题来调节亮度
    function change_brightness_by_theme() {

        if (window.matchMedia('(prefers-color-scheme)').media === 'not all') {
            console.log('Browser doesn\'t support dark mode');
        }
        else
        {

            const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)"); // 是深色
            if (isDarkTheme.matches) { // 是深色
                // 主题设置为深色。
                cover(init_brightness);
            } else { // 不是深色
                // 主题设置为浅色。
                cover(1);
            }
        }

    }

    change_brightness_by_theme();

    let listeners={
        dark:(mediaQueryList )=>{
            if(mediaQueryList.matches){
                change_brightness_by_theme();
            }
        },
        light:(mediaQueryList)=>{
            if(mediaQueryList.matches){
                change_brightness_by_theme();
            }
        }
    }

    window.matchMedia('(prefers-color-scheme: dark)').addListener(listeners.dark)
    window.matchMedia('(prefers-color-scheme: light)').addListener(listeners.light)


    // --- 自定义右键菜单选项
    var menu_context_0 = "设置所有网站默认亮度";
    var menu_context_1 = "设置当前网站亮度";
    var menu_context_2 = "取消当前网站亮度";
    var menu_context_9 = "初始化设置";

    GM_registerMenuCommand (menu_context_0, function(){

        var input = prompt("请输入您想要的默认亮度(0~1之间的小数)", 0.66);
        var ret = cover(input);
        if (ret == 1)
        {
            var brightness = get_brightness_by_input(input);
            GM_setValue("default_brightness", brightness);
        }
    }, "h");

    GM_registerMenuCommand (menu_context_1, function(){

        var input = prompt("请输入当前网站的亮度(0~1之间的小数)", 0.66);
        var ret = cover(input);
        if (ret == 1)
        {
            my_custom_brightness_dc[""+hostname+""] = input;
            GM_setValue(key, my_custom_brightness_dc);
        }
    }, "h");

    GM_registerMenuCommand (menu_context_2, function(){
        cover(default_brightness);
        if(my_custom_brightness_dc.hasOwnProperty(hostname))
        {
            delete my_custom_brightness_dc[""+hostname+""];
            GM_setValue(key, my_custom_brightness_dc);
        }
    }, "h");


    GM_registerMenuCommand (menu_context_9, function(){
        cover(default_init_brightness);
        GM_setValue("default_brightness", "");
        GM_setValue(key, "");
    }, "h");

})();