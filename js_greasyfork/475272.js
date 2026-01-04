// ==UserScript==
// @name         护眼模式/Eye-protection Mode
// @name:en      Eye-protection Mode
// @namespace    https://www.2345.com/
// @version      1.0
// @description:zh-CN  护眼模式，支持自定义颜色和透明度，也可做为亮度调节。
// @description:en  Eye-protection Mode：support customizing color and transparency，also support adjusting brightness.
// @author       ZSCZGYG CP
// @match        *
// @include      *
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @description 护眼模式，支持自定义颜色和透明度，也可做为亮度调节。
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475272/%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8FEye-protection%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/475272/%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8FEye-protection%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand(languageWords('menuopen'), openMenu);//设置油猴插件的菜单
    //用于存储的数据
    var userdata = {
        color: '#00ff00',
        opacity:0.1,
        whitelist: 'mywhitelist'
    }
    var mycolor;//声明颜色变量
    var myopacity;//声明透明度变量
    var inWhitelist = false;//声明并初始化白名单判断变量

    //设置颜色变量
    if(/^#+\w+$/.test(GM_getValue(userdata.color))){
        mycolor = GM_getValue(userdata.color);
    }
    else {
        mycolor="#00ff00";
    }

    //设置透明度变量
    if(/^0.+\w+$/.test(GM_getValue(userdata.opacity))){
        myopacity = GM_getValue(userdata.opacity);
    }
    else if(/^[0-1]$/.test(GM_getValue(userdata.opacity))) {
        myopacity = GM_getValue(userdata.opacity);
    }
    else {
        myopacity=0.1;
    }

    //初始化效果图层
    var eyeprotectiondiv = document.createElement('div');
    eyeprotectiondiv.style = `
    position: fixed;
    pointer-events: none;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: ${mycolor};
    opacity:${myopacity};
    z-index: 2147483648;
  `;

    //适用于中英两种语言的文本
    function languageWords (keyword) {
        var thislanguage = navigator.language.toLowerCase().indexOf('zh') !== -1 ? 'zh' : 'en'
        var languageObj = {
            'title-zh': '设置自定义颜色和透明度',
            'title-en': 'Set Your Color and Transparency',
            'defaulttip-zh':'对眼睛最友好的颜色：',
            'defaulttip-en':'Default:',
            'defaultblack-zh':'护眼绿',
            'defaultblack-en':'Golden millet',
            'defaultgreen-zh':'豆沙绿',
            'defaultgreen-en':'Green cape',
            'defaultyellow-zh':'灰黑色',
            'defaultyellow-en':'Immerse in black',
            'selectcolortip-zh':'选择目标颜色',
            'selectcolortip-en':'Select color',
            'scrolltip1-zh':'滑动或点击调节透明度：',
            'scrolltip1-en':'Slide/Click to adjust transparency：',
            'scrolltip2-zh':'<-----------------------加强颜色效果------------------------',
            'scrolltip2-en':'<---------------Enhance  effect of the color-------------------',
            'scrolltip3-zh':'完全透明',
            'scrolltip3-en':'Transparent',
            'save-zh': '保存',
            'save-en': 'SAVE',
            'reset-zh': '重置',
            'reset-en': 'RESET',
            'close-zh': '关闭',
            'close-en': 'CLOSE',
            'addwhitelist-zh': '将本网页的域名添加至白名单',
            'addwhitelist-en': 'Add realm name of this website to my whitelist',
            'removewhitelist-zh': '将本网页的域名移出白名单',
            'removewhitelist-en': 'Remove realm name of this website from my whitelist',
            'menuopen-zh': '点击：切换【护眼模式】',
            'menuopen-en': 'Set Your Color and Transparency',
        }
        return languageObj[keyword + '-' + thislanguage] || ''
    }

    // 从数据库获取白名单
    function getWhitelist () {
        var whitelist = GM_getValue(userdata.whitelist) || '';
        return whitelist;
    }

    //储存白名单
    function saveWhitelist (data) {
        GM_setValue(userdata.whitelist, data);
    }

    // 关闭菜单
    function closeMenu() {
        var existmenu = document.querySelector('#myMenu');
        if (existmenu) {
            existmenu.parentNode.removeChild(existmenu);
        }
    }

    // 保存自定义数据
    function saveSetting() {
        GM_setValue(userdata.color, mycolor);
        GM_setValue(userdata.opacity, myopacity);
        closeMenu();
    }

    // 重置至无效果
    function reset() {
        eyeprotectiondiv.style.opacity =0;
        myopacity=0;
        transparencyshadow.style.width="100%";
    }

    // 打开菜单
    function openMenu() {
        closeMenu();//先关闭以免重复打开
        var menudiv = document.createElement('div');//声明菜单div
        menudiv.id = 'myMenu';

        //设置菜单的css样式
        menudiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50px;
        padding: 10px;
        background:rgb(204,209,255);
        background-image: repeating-linear-gradient(30deg,hsla(0,0%,100%,0.1),hsla(0,0%,100%,0.1) 15px,transparent 0,transparent 30px);
        border-radius: 40px;
        border-style:dashed;
        border-color:purple;
        border-width:2px;
        `;

        //设置菜单中元素的css样式
        GM_addStyle(`
        #myMenu {
            font-family: Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', '微软雅黑', Arial, sans-serif;
            font-size: 14px;
            z-index: 2147483648;
        }
        #myMenu .button {
            padding: 3px 6px;
            line-height: 16px;
            margin-top:6px;
            display: inline-block;
            border: 1px solid #999;
            border-radius: 3px;
            display: inline-block;
            cursor: pointer;
        }
        #reset{
            margin-left:100px;
            margin-right:100px;
        }
         #colorspan {
            margin-bottom:5px;
            margin-left:10px;
        }
        #transparencyui{
            width:350px;
            height:20px;
            background-color: #cecece;
            border-radius: 50px;
            box-shadow: rgb(74, 74, 74) 0px 0px 20px;
            margin-top:5px;
        }
        #transparencyshadow{
            width: 100%;
            height: 100%;
            background-color: rgb(147, 112, 223);
            bottom: 0px; right: 0px;
            border-radius: 50px;
        }
        #seletcolor{
            float:left;
            margin-top:7px;
            margin-left:5px;
            border-style:none dashed none none;
            border-width:1px;
        }
        #transparency{
            margin-top:7px;
            margin-left:10px;
            float:left;
        }
        #setui{
            width:570px;
            height:85px;
            margin-top:10px;
            margin-left:10px;
            margin-right:10px;
            margin-bottom:5px;
            background-color: rgb(255,244,188);
            background-image: repeating-linear-gradient(30deg,hsla(0,0%,100%,0.1),hsla(0,0%,100%,0.1) 15px,transparent 0,transparent 30px);
            border-width:1px;
            border-style: solid;
        }
        #explaintransparency{
            margin-top:34px;
            margin-right:1px;
            float:right;
        }
        #colorinput{
            margin-left:14px;
            margin-top:2px;
        }
        #explainresult{
            margin-top:7px;
        }
    `);

        //div中的html元素
        menudiv.innerHTML=`
        <p align="center" style="font-size:20px">${languageWords('title')}</p>
        <p align="center">${languageWords('defaulttip')}
            <span class="button" id='myblack' style="background-color: rgba(0,0,0,0.1)">${languageWords('defaultblack')}</span>
            <span class="button" id='mygreen' style="background-color: rgb(204,232,207)">${languageWords('defaultgreen')}</span>
            <span class="button" id='myyellow' style="background-color: rgb(225,209,136)">${languageWords('defaultyellow')}</span>
        </p>
        <div id=setui>
            <div id="seletcolor">
                <p>选择目标颜色：</p>
                <input type="color" id="colorinput" value="${mycolor}">
                <div id="colorspan">${mycolor}</div>
            </div>
            <div id="transparency">
                <div id="explainscroll">${languageWords('scrolltip1')}</div>
                <div id="transparencyui">
                    <div id="transparencyshadow" style="background-color:${mycolor};width:${(1-myopacity)*100+"%"}"></div>
                </div>
                <div id="explainresult">${languageWords('scrolltip2')}</div>
            </div>
            <div id="explaintransparency">${languageWords('scrolltip3')}</div>
        </div>
        <p align="center">
            <span class="button" id='save'>${languageWords('save')}</span>
            <span class="button" id='reset'>${languageWords('reset')}</span>
            <span class="button" id='close' }'>${languageWords('close')}</span>
        </p>
        <p align="center">
            ${inWhitelist ?
            '<span class="button" id="removeWhitelist">' + languageWords('removewhitelist') + '</span>' :
            '<span class="button" id="addWhitelist">' + languageWords('addwhitelist') + '</span>'
        }
        </p>
    `;
        //将菜单div显示
        document.body.appendChild(menudiv);

        //声明标记鼠标点击透明度条的变量
        var validateclick=false;

        //一系列获取元素
        var transparencyshadow = document.querySelector('#transparencyshadow');
        var transparencyui = document.querySelector('#transparencyui');
        var colorspan = document.querySelector('#colorspan');
        var eyeprotectioncolorinput=document.querySelector('#colorinput');
        var eyeprotectionsetMenuSave=document.querySelector('#save');
        var eyeprotectionsetMenureset=document.querySelector('#reset');
        var eyeprotectionsetMenuClose=document.querySelector('#close');
        var myblack=document.querySelector('#myblack');
        var mygreen=document.querySelector('#mygreen');
        var myyellow=document.querySelector('#myyellow');

        //一些列监听事件的添加
        transparencyui.addEventListener('mousedown', function(event){shadowmove_down(event)},false);
        transparencyui.addEventListener('mousemove', function(event){shadowmove_move(event)},false);
        transparencyui.addEventListener('mouseup', function(event){shadowmove_up(event)},false);
        eyeprotectioncolorinput.addEventListener('change', function(event){colorChange(event)},false);
        eyeprotectionsetMenuSave.addEventListener('click',saveSetting,false);
        eyeprotectionsetMenureset.addEventListener('click',reset,false);
        eyeprotectionsetMenuClose.addEventListener('click',closeMenu,false);
        myblack.addEventListener('click', function(){defaultcolor('b')},false);
        mygreen.addEventListener('click', function(){defaultcolor('g')},false);
        myyellow.addEventListener('click',function(){defaultcolor('y')},false);
        menudiv.addEventListener('click', function (event) {
            if(event.target.id== 'addWhitelist') {
                addWhitelist(document.domain)
            }
            if(event.target.id== 'removeWhitelist') {
                removeWhitelist(document.domain)
            }
        }, false);

        //预设样式的选择处理
        function defaultcolor(set) {
            if(set=='b'){
                newset('#00ff00','0.1');
                return true;
            }
            if(set=='g')
            {
                newset('#CCE8CF','0.1');
                return true;
            }
            if(set=='y')
            {
                newset('#000000','0.1');
                return true;
            }
        }

        //预设样式的具体实现
        function newset(newcolor,newopacity) {
            mycolor=newcolor;
            myopacity=newopacity;
            eyeprotectiondiv.style.opacity = myopacity;
            transparencyshadow.style.backgroundColor=mycolor;
            colorspan.innerHTML=mycolor;
            eyeprotectiondiv.style.background = mycolor;
            eyeprotectioncolorinput.value=mycolor;
            transparencyshadow.style.width=(1-myopacity)*100+"%";
            return true;
        }

        //计算透明度条中有色块现在的长度
        function counttrans(event){
            if(event.clientX-menudiv.offsetLeft - transparencyshadow.offsetLeft>350)
            {
                return 350;
            }
            else if(event.clientX-menudiv.offsetLeft - transparencyshadow.offsetLeft<0)
            {
                return 0;
            }
            else{
                return event.clientX-menudiv.offsetLeft - transparencyshadow.offsetLeft;
            }
        }

        //透明度条移动事件  validateclikc变量用来判断鼠标落下时是否在元素内
        function shadowmove_move(e) {
            if(validateclick==true){
                transparencyshadow.style.width=(counttrans(e)*100/350.00) + "%";
                eyeprotectiondiv.style.opacity =1-counttrans(e)/350;
                myopacity=1-counttrans(e)/350;
            }
            else{
                return
            }
        }

        //透明度条鼠标抬起事件
        function shadowmove_up(e) {
            validateclick=false;
            transparencyshadow.style.width=(counttrans(e)*100/350.00) + "%";
            eyeprotectiondiv.style.opacity = 1-counttrans(e)/350;
            myopacity=1-counttrans(e)/350;
        }

        //透明度条鼠标落下事件
        function shadowmove_down(e) {
            validateclick=true;
            transparencyshadow.style.width=(counttrans(e)*100/350.00) + "%";
            eyeprotectiondiv.style.opacity = 1-counttrans(e)/350;
            myopacity=1-counttrans(e)/350;
        }

        //调色板变色事件
        function colorChange (e) {
            mycolor = e.target.value;
            transparencyshadow.style.backgroundColor= e.target.value;
            colorspan.innerHTML=e.target.value;
            eyeprotectiondiv.style.background = mycolor
        }

        //添加网页至白名单
        function addWhitelist (domain) {
            var nowwhitelist = getWhitelist()
            var add = ',' + domain
            if (nowwhitelist.indexOf(add) == -1) {
                inWhitelist = true
                saveWhitelist(nowwhitelist + add)
            }
            initialization()
            closeMenu()
        }

        //将网页从白名单移除
        function removeWhitelist (domain) {
            var nowwhitelist = getWhitelist()
            var remove = ',' + domain
            if (nowwhitelist.indexOf(remove) !== -1) {
                inWhitelist = false
                saveWhitelist(nowwhitelist.replace(remove, ''))
            }
            initialization()
            closeMenu()
        }
    }

    //初始化函数
    function initialization () {
        var thiswhitelist = getWhitelist();
        var thisdomain = document.domain;
        if (thiswhitelist.indexOf(thisdomain) !== -1 ) {
            inWhitelist = true
            eyeprotectiondiv.style.display = 'none'
            return false
        }
        else {
            inWhitelist = false
            eyeprotectiondiv.style.display = 'block'
        }
        document.body.appendChild(eyeprotectiondiv)
    }

    //添加快捷键事件：alt+h和alt+p和alt+a 都可以打开菜单
    document.addEventListener('keydown', function (event) {
        if (event.altKey && event.which == 72) {
            openMenu();
        }
        if(event.altKey && event.which == 80) {
            openMenu();
        }
        if(event.altKey && event.which == 65) {
            openMenu();
        }
    },false);

    //打开网页先执行初始化操作
    initialization();
})();// ==UserScript==
// @name         护眼模式/Eye-protection Mode
// @name:en      Eye-protection Mode
// @namespace    http://www.youhouzi.cn/
// @version      0.6
// @description:zh-CN  护眼模式，支持自定义颜色和透明度，也可做为亮度调节。
// @description:en  Eye-protection Mode：support customizing color and transparency，also support adjusting brightness.
// @author       lee
// @match        *
// @include      *
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @description 护眼模式，支持自定义颜色和透明度，也可做为亮度调节。
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand(languageWords('menuopen'), openMenu);//设置油猴插件的菜单
    //用于存储的数据
    var userdata = {
        color: '#00ff00',
        opacity:0.1,
        whitelist: 'mywhitelist'
    }
    var mycolor;//声明颜色变量
    var myopacity;//声明透明度变量
    var inWhitelist = false;//声明并初始化白名单判断变量

    //设置颜色变量
    if(/^#+\w+$/.test(GM_getValue(userdata.color))){
        mycolor = GM_getValue(userdata.color);
    }
    else {
        mycolor="#00ff00";
    }

    //设置透明度变量
    if(/^0.+\w+$/.test(GM_getValue(userdata.opacity))){
        myopacity = GM_getValue(userdata.opacity);
    }
    else if(/^[0-1]$/.test(GM_getValue(userdata.opacity))) {
        myopacity = GM_getValue(userdata.opacity);
    }
    else {
        myopacity=0.1;
    }

    //初始化效果图层
    var eyeprotectiondiv = document.createElement('div');
    eyeprotectiondiv.style = `
    position: fixed;
    pointer-events: none;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: ${mycolor};
    opacity:${myopacity};
    z-index: 2147483648;
  `;

    //适用于中英两种语言的文本
    function languageWords (keyword) {
        var thislanguage = navigator.language.toLowerCase().indexOf('zh') !== -1 ? 'zh' : 'en'
        var languageObj = {
            'title-zh': '设置自定义颜色和透明度',
            'title-en': 'Set Your Color and Transparency',
            'defaulttip-zh':'对眼睛最友好的颜色：',
            'defaulttip-en':'Default:',
            'defaultblack-zh':'挥墨入夜',
            'defaultblack-en':'Immerse in black',
            'defaultgreen-zh':'浮翠青笠',
            'defaultgreen-en':'Green cape',
            'defaultyellow-zh':'一纸黄粱',
            'defaultyellow-en':'Golden millet ',
            'selectcolortip-zh':'选择目标颜色',
            'selectcolortip-en':'Select color',
            'scrolltip1-zh':'滑动或点击调节透明度：',
            'scrolltip1-en':'Slide/Click to adjust transparency：',
            'scrolltip2-zh':'<-----------------------加强颜色效果------------------------',
            'scrolltip2-en':'<---------------Enhance  effect of the color-------------------',
            'scrolltip3-zh':'完全透明',
            'scrolltip3-en':'Transparent',
            'save-zh': '保存',
            'save-en': 'SAVE',
            'reset-zh': '重置',
            'reset-en': 'RESET',
            'close-zh': '关闭',
            'close-en': 'CLOSE',
            'addwhitelist-zh': '将本网页的域名添加至白名单',
            'addwhitelist-en': 'Add realm name of this website to my whitelist',
            'removewhitelist-zh': '将本网页的域名移出白名单',
            'removewhitelist-en': 'Remove realm name of this website from my whitelist',
            'menuopen-zh': '点击：切换【护眼模式】',
            'menuopen-en': 'Set Your Color and Transparency',
        }
        return languageObj[keyword + '-' + thislanguage] || ''
    }

    // 从数据库获取白名单
    function getWhitelist () {
        var whitelist = GM_getValue(userdata.whitelist) || '';
        return whitelist;
    }

    //储存白名单
    function saveWhitelist (data) {
        GM_setValue(userdata.whitelist, data);
    }

    // 关闭菜单
    function closeMenu() {
        var existmenu = document.querySelector('#myMenu');
        if (existmenu) {
            existmenu.parentNode.removeChild(existmenu);
        }
    }

    // 保存自定义数据
    function saveSetting() {
        GM_setValue(userdata.color, mycolor);
        GM_setValue(userdata.opacity, myopacity);
        closeMenu();
    }

    // 重置至无效果
    function reset() {
        eyeprotectiondiv.style.opacity =0;
        myopacity=0;
        transparencyshadow.style.width="100%";
    }

    // 打开菜单
    function openMenu() {
        closeMenu();//先关闭以免重复打开
        var menudiv = document.createElement('div');//声明菜单div
        menudiv.id = 'myMenu';

        //设置菜单的css样式
        menudiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50px;
        padding: 10px;
        background: #fff;
        border-radius: 40px;
        border-style:dashed;
        border-color:black;
        border-width:2px;
        `;

        //设置菜单中元素的css样式
        GM_addStyle(`
        #myMenu {
            font-family: Helvetica, 'Hiragino Sans GB', 'Microsoft Yahei', '微软雅黑', Arial, sans-serif;
            font-size: 14px;
            z-index: 2147483648;
        }
        #myMenu .button {
            padding: 3px 6px;
            line-height: 16px;
            margin-top:6px;
            display: inline-block;
            border: 1px solid #999;
            border-radius: 3px;
            display: inline-block;
            cursor: pointer;
        }
        #reset{
            margin-left:100px;
            margin-right:100px;
        }
         #colorspan {
            margin-bottom:5px;
            margin-left:10px;
        }
        #transparencyui{
            width:350px;
            height:20px;
            background-color: #cecece;
            border-radius: 50px;
            box-shadow: rgb(74, 74, 74) 0px 0px 20px;
            margin-top:5px;
        }
        #transparencyshadow{
            width: 100%;
            height: 100%;
            background-color: rgb(147, 112, 223);
            bottom: 0px; right: 0px;
            border-radius: 50px;
        }
        #seletcolor{
            float:left;
            margin-top:7px;
            margin-left:5px;
            border-style:none dashed none none;
            border-width:1px;
        }
        #transparency{
            margin-top:7px;
            margin-left:10px;
            float:left;
        }
        #setui{
            width:570px;
            height:85px;
            margin-top:10px;
            margin-left:10px;
            margin-right:10px;
            margin-bottom:5px;
            background-color: white;
            border-width:1px;
            border-style: solid;
        }
        #explaintransparency{
            margin-top:34px;
            margin-right:1px;
            float:right;
        }
        #colorinput{
            margin-left:14px;
            margin-top:2px;
        }
        #explainresult{
            margin-top:7px;
        }
    `);

        //div中的html元素
        menudiv.innerHTML=`
        <p align="center" style="font-size:20px">${languageWords('title')}</p>
        <p align="center">${languageWords('defaulttip')}
            <span class="button" id='myblack' style="background-color: rgba(0,0,0,0.1)">${languageWords('defaultblack')}</span>
            <span class="button" id='mygreen' style="background-color: rgb(204,232,207)">${languageWords('defaultgreen')}</span>
            <span class="button" id='myyellow' style="background-color: rgb(225,209,136)">${languageWords('defaultyellow')}</span>
        </p>
        <div id=setui>
            <div id="seletcolor">
                <p>选择目标颜色：</p>
                <input type="color" id="colorinput" value="${mycolor}">
                <div id="colorspan">${mycolor}</div>
            </div>
            <div id="transparency">
                <div id="explainscroll">${languageWords('scrolltip1')}</div>
                <div id="transparencyui">
                    <div id="transparencyshadow" style="background-color:${mycolor};width:${(1-myopacity)*100+"%"}"></div>
                </div>
                <div id="explainresult">${languageWords('scrolltip2')}</div>
            </div>
            <div id="explaintransparency">${languageWords('scrolltip3')}</div>
        </div>
        <p align="center">
            <span class="button" id='save'>${languageWords('save')}</span>
            <span class="button" id='reset'>${languageWords('reset')}</span>
            <span class="button" id='close' }'>${languageWords('close')}</span>
        </p>
        <p align="center">
            ${inWhitelist ?
            '<span class="button" id="removeWhitelist">' + languageWords('removewhitelist') + '</span>' :
            '<span class="button" id="addWhitelist">' + languageWords('addwhitelist') + '</span>'
        }
        </p>
    `;
        //将菜单div显示
        document.body.appendChild(menudiv);

        //声明标记鼠标点击透明度条的变量
        var validateclick=false;

        //一系列获取元素
        var transparencyshadow = document.querySelector('#transparencyshadow');
        var transparencyui = document.querySelector('#transparencyui');
        var colorspan = document.querySelector('#colorspan');
        var eyeprotectioncolorinput=document.querySelector('#colorinput');
        var eyeprotectionsetMenuSave=document.querySelector('#save');
        var eyeprotectionsetMenureset=document.querySelector('#reset');
        var eyeprotectionsetMenuClose=document.querySelector('#close');
        var myblack=document.querySelector('#myblack');
        var mygreen=document.querySelector('#mygreen');
        var myyellow=document.querySelector('#myyellow');

        //一些列监听事件的添加
        transparencyui.addEventListener('mousedown', function(event){shadowmove_down(event)},false);
        transparencyui.addEventListener('mousemove', function(event){shadowmove_move(event)},false);
        transparencyui.addEventListener('mouseup', function(event){shadowmove_up(event)},false);
        eyeprotectioncolorinput.addEventListener('change', function(event){colorChange(event)},false);
        eyeprotectionsetMenuSave.addEventListener('click',saveSetting,false);
        eyeprotectionsetMenureset.addEventListener('click',reset,false);
        eyeprotectionsetMenuClose.addEventListener('click',closeMenu,false);
        myblack.addEventListener('click', function(){defaultcolor('b')},false);
        mygreen.addEventListener('click', function(){defaultcolor('g')},false);
        myyellow.addEventListener('click',function(){defaultcolor('y')},false);
        menudiv.addEventListener('click', function (event) {
            if(event.target.id== 'addWhitelist') {
                addWhitelist(document.domain)
            }
            if(event.target.id== 'removeWhitelist') {
                removeWhitelist(document.domain)
            }
        }, false);

        //预设样式的选择处理
        function defaultcolor(set) {
            if(set=='b'){
                newset('#00ff00','0.1');
                return true;
            }
            if(set=='g')
            {
                newset('#CCE8CF','0.1');
                return true;
            }
            if(set=='y')
            {
                newset('#000000','0.1');
                return true;
            }
        }

        //预设样式的具体实现
        function newset(newcolor,newopacity) {
            mycolor=newcolor;
            myopacity=newopacity;
            eyeprotectiondiv.style.opacity = myopacity;
            transparencyshadow.style.backgroundColor=mycolor;
            colorspan.innerHTML=mycolor;
            eyeprotectiondiv.style.background = mycolor;
            eyeprotectioncolorinput.value=mycolor;
            transparencyshadow.style.width=(1-myopacity)*100+"%";
            return true;
        }

        //计算透明度条中有色块现在的长度
        function counttrans(event){
            if(event.clientX-menudiv.offsetLeft - transparencyshadow.offsetLeft>350)
            {
                return 350;
            }
            else if(event.clientX-menudiv.offsetLeft - transparencyshadow.offsetLeft<0)
            {
                return 0;
            }
            else{
                return event.clientX-menudiv.offsetLeft - transparencyshadow.offsetLeft;
            }
        }

        //透明度条移动事件  validateclikc变量用来判断鼠标落下时是否在元素内
        function shadowmove_move(e) {
            if(validateclick==true){
                transparencyshadow.style.width=(counttrans(e)*100/350.00) + "%";
                eyeprotectiondiv.style.opacity =1-counttrans(e)/350;
                myopacity=1-counttrans(e)/350;
            }
            else{
                return
            }
        }

        //透明度条鼠标抬起事件
        function shadowmove_up(e) {
            validateclick=false;
            transparencyshadow.style.width=(counttrans(e)*100/350.00) + "%";
            eyeprotectiondiv.style.opacity = 1-counttrans(e)/350;
            myopacity=1-counttrans(e)/350;
        }

        //透明度条鼠标落下事件
        function shadowmove_down(e) {
            validateclick=true;
            transparencyshadow.style.width=(counttrans(e)*100/350.00) + "%";
            eyeprotectiondiv.style.opacity = 1-counttrans(e)/350;
            myopacity=1-counttrans(e)/350;
        }

        //调色板变色事件
        function colorChange (e) {
            mycolor = e.target.value;
            transparencyshadow.style.backgroundColor= e.target.value;
            colorspan.innerHTML=e.target.value;
            eyeprotectiondiv.style.background = mycolor
        }

        //添加网页至白名单
        function addWhitelist (domain) {
            var nowwhitelist = getWhitelist()
            var add = ',' + domain
            if (nowwhitelist.indexOf(add) == -1) {
                inWhitelist = true
                saveWhitelist(nowwhitelist + add)
            }
            initialization()
            closeMenu()
        }

        //将网页从白名单移除
        function removeWhitelist (domain) {
            var nowwhitelist = getWhitelist()
            var remove = ',' + domain
            if (nowwhitelist.indexOf(remove) !== -1) {
                inWhitelist = false
                saveWhitelist(nowwhitelist.replace(remove, ''))
            }
            initialization()
            closeMenu()
        }
    }

    //初始化函数
    function initialization () {
        var thiswhitelist = getWhitelist();
        var thisdomain = document.domain;
        if (thiswhitelist.indexOf(thisdomain) !== -1 ) {
            inWhitelist = true
            eyeprotectiondiv.style.display = 'none'
            return false
        }
        else {
            inWhitelist = false
            eyeprotectiondiv.style.display = 'block'
        }
        document.body.appendChild(eyeprotectiondiv)
    }

    //添加快捷键事件：alt+h和alt+p和alt+a 都可以打开菜单
    document.addEventListener('keydown', function (event) {
        if (event.altKey && event.which == 72) {
            openMenu();
        }
        if(event.altKey && event.which == 80) {
            openMenu();
        }
        if(event.altKey && event.which == 65) {
            openMenu();
        }
    },false);

    //打开网页先执行初始化操作
    initialization();
})();