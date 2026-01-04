// ==UserScript==
// @name         摸鱼派增强
// @namespace    https://fishpi.cn/
// @version      0.3
// @description  自定义修改摸鱼派favico图标
// @author       iwpz
// @match        *://fishpi.cn/*
// @icon         https://fishpi.cn/images/favicon.png
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447439/%E6%91%B8%E9%B1%BC%E6%B4%BE%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/447439/%E6%91%B8%E9%B1%BC%E6%B4%BE%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isShowPanel = false;
    var settingPanel;
    var mainDiv = document.getElementsByTagName('body')[0];

    document.onSettingClick = function(){
        if(isShowPanel){
            mainDiv.removeChild(settingPanel);
            isShowPanel = false;
        }
        else{
            settingPanel = document.createElement('div');
            settingPanel.setAttribute('style','height:200px;width:200px;display:float;position:fixed;right:10px;top:50px;border:1px solid #34363a;');
            var description = document.createElement('span');
            description.innerText = '请选择要使用的图标：';
            settingPanel.appendChild(description);
            for(var i = 0;i < icons.length;i++){
                var radio = createRadio(icons[i].name,i);
                settingPanel.appendChild(radio);
            }
            var okBtn = document.createElement('input');
            okBtn.type='button';
            okBtn.value = '确定';
            okBtn.setAttribute('onclick','onIconChange()');
            settingPanel.appendChild(okBtn);
            mainDiv.appendChild(settingPanel);
            isShowPanel = true;
        }
    };

    document.onIconChange = function(){
        var radios = document.getElementsByName("icoType");
        for(var i=0; i < radios.length; i++){
            if (radios[i].checked==true){
                console.log('选中了'+ icons[i].name);
                selectedIndex = i;
                localStorage.setItem("faviconSelectedIndex",i);
                settingIcon();
                mainDiv.removeChild(settingPanel);
                isShowPanel = false;
                break;
            }
        }
    };

    var createRadio = function(text,index){
        var div = document.createElement('div');
        div.setAttribute('style','display:flex;flex-direction:row');
        var title = document.createElement('span');
        title.setAttribute('stype','width:50px;');
        title.innerText = text + '：';
        var radio = document.createElement('input');
        radio.type="radio";
        if(index == selectedIndex){
            radio.checked = true;
        }
        radio.id=index;
        radio.name="icoType";
        radio.value=text;
        div.appendChild(title);
        div.appendChild(radio);
        return div;
    }

    var settingIcon = function(){
        var head=document.getElementsByTagName('head')[0];
        var children = head.children;
        for(var i = 0;i < children.length;i++){
            if(children[i].rel == 'icon'){
            children[i].href = icons[selectedIndex].url;
                return;
            }
        }
    }

    var userNav = document.getElementsByClassName('user-nav')[0];
    var firstContent = userNav.children[0].getAttribute("aria-label");
    if(firstContent != '脚本设置'){
        console.log(userNav.children);
        var pluginA = document.createElement('a');
        pluginA.href = 'javascript:void(0);';
        pluginA.setAttribute('onclick','onSettingClick()');
        pluginA.setAttribute('class','tooltipped tooltipped-w');
        pluginA.setAttribute('aria-label','脚本设置');
        var svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        var use = document.createElementNS('http://www.w3.org/2000/svg','use');
        use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "#logo-white");
        svg.appendChild(use);
        pluginA.appendChild(svg);
        userNav.insertBefore(pluginA,userNav.firstChild);
    }

    var selectedIndex = localStorage.getItem("faviconSelectedIndex") ?? 0;
    console.log(selectedIndex);
    var icons = [
        {'name':'摸鱼派','url':'https://fishpi.cn/images/favicon.png'},
        {'name':'百度','url':'https://www.baidu.com/favicon.ico'},
        {'name':'CSDN','url':'https://g.csdnimg.cn/static/logo/favicon32.ico'},
        {'name':'Google','url':'https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png'},
    ];
    settingIcon();
})();