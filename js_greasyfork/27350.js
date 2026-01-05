// ==UserScript==
// @name         点击变色
// @version      0.56
// @description  点击变色并在新窗口打开 alt+ctrl+c 打开颜色设置面板
// @match        *://*/*
// @author       变异小僵尸
// @namespace https://greasyfork.org/users/85375
// @downloadURL https://update.greasyfork.org/scripts/27350/%E7%82%B9%E5%87%BB%E5%8F%98%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/27350/%E7%82%B9%E5%87%BB%E5%8F%98%E8%89%B2.meta.js
// ==/UserScript==
(function() {
    // 'use strict';
    //变量
    var color = "#bbb";
    var storage = window.localStorage;
    var isHttp = 'https:' == document.location.protocol ? true : false;
    var colorStyle = '#colorControl *{transition: all .2s;-webkit-appearance: none;appearance: none;outline: none;font-family: "微软雅黑";border-radius: 0px;color: #000;}'+
    '#colorControl button{width: 42px;padding: 0;margin: 0;border: 1px solid #000;height: 22px;background-color: #ffffff;line-height: 20px;display: inline-block;vertical-align: top;cursor: pointer;}'+
    '#colorControl button:hover{background-color: #ececec;}'+
    '#colorControl button:active{background-color: #bfbfbf;}'+
    '#colorControl #colorDownSwitchColor,#colorControl #colorDownSwitchTab{width:80px;margin: 0 4px 0 0;cursor: auto;}'+
    '#colorControl #colorDownSwitchColor:hover,#colorControl #colorDownSwitchTab:hover{background-color: #ffffff;}'+
    '#colorControl #colorDownSwitchColor:active,#colorControl #colorDownSwitchTab:active{background-color: #ffffff;}'+
    '#colorControl #colorDownInput{width: 80px;border: 1px solid #000;padding: 0;margin: 0 4px 0 0;height: 20px;display: inline-block;vertical-align: top;text-align:center;}';
    var styles = '',
        colorDownOkfn = '',
        colorDownHidefn = '',
        colorDownSwitchColorfn = '',
        colorDownSwitchColor = 1,
        colorDownSwitchColorT = '已启用',
        colorDownSwitchColorStyle = 'background-color: #bbff9f;',
        colorDownSwitchTabfn = '',
        colorDownSwitchTab = 1,
        colorDownSwitchTabT = '已启用',
        colorDownSwitchTabStyle = 'background-color: #bbff9f;',
        mousedown = [],
        mousedownfn = [],
        openUrlfn = '';
    // 设置storage默认颜色
    if (storage.getItem('colorDown')) {
        color = storage.getItem('colorDown');
    } else {
        storage.setItem('colorDown', color);
    }
    // 设置storage默认启用变色
    if (storage.getItem('colorDownSwitchColor')) {
        colorDownSwitchColor = storage.getItem('colorDownSwitchColor');
    } else {
        storage.setItem('colorDownSwitchColor', colorDownSwitchColor);
    }
    // 设置storage默认启用开启
    if (storage.getItem('colorDownSwitchTab')) {
        colorDownSwitchTab = storage.getItem('colorDownSwitchTab');
    } else {
        storage.setItem('colorDownSwitchTab', colorDownSwitchTab);
    }
    // 第一次判定是否开启变色
    if (storage.getItem('colorDownSwitchColor') == 1) {
        // 变色
        addvisited();
    } else {
        colorDownSwitchColorT = '未启用';
        colorDownSwitchColorStyle = 'background-color: #ff9f9f;';
        // 添加style
        addStyle(colorStyle);
    }
    // 第一次判定是否开启变色
    if (storage.getItem('colorDownSwitchTab') == 1) {
        //监听
        listenerAlla();
    } else {
        colorDownSwitchTabT = '未启用';
        colorDownSwitchTabStyle = 'background-color: #ff9f9f;';
        // 添加style
        addStyle(colorStyle);
    }
    // 设置界面
    var colorHtml = '<h3 style="margin:0px 0px -3px 0px;font-size:20px;border-bottom:1px solid #b5b5b5;;display:block;">点击变色<span style="font-size:14px;padding:0 0 0 5px;">设置</span></h3>' +
        '<span style="font-size:10px;">只支持当前域名</span>' +
        '<div>颜色</div>' +
        '<input class="jscolor {hash:true,uppercase:false}" type="text" id="colorDownInput" style="width: 80px;" value=' +
        color + '>' +
        '<button id="colorDownOk">确定</button>' +
        '<div>启用变色</div>' +
        '<button id="colorDownSwitchColor" disabled="disabled" style="'+ colorDownSwitchColorStyle +'">'+ colorDownSwitchColorT +'</button>' +
        '<button id="colorDownSwitchColorbtn">切换</button>' +
        '<div>启用新窗</div>' +
        '<button id="colorDownSwitchTab" disabled="disabled" style="'+ colorDownSwitchTabStyle +'">'+ colorDownSwitchTabT +'</button>' +
        '<button id="colorDownSwitchTabbtn">切换</button>' +
        '<div>操作</div>' +
        '<button id="colorDownHide">隐藏</button></div>';
    window.onkeydown = function(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e.keyCode == 67 && e.ctrlKey && e.altKey) {
            if (!document.querySelector('#colorControl')) {
                var div = document.createElement('div');
                div.setAttribute('id', 'colorControl');
                div.setAttribute('style', 'position:fixed;top:50px;right:50px;background-color:white;height:auto;line-height:30px;z-index:999;box-shadow:0px 0px 1px 1px rgba(210,210,210,0.45);padding:10px;');
                div.innerHTML = colorHtml;
                document.body.appendChild(div);
            } else {
                document.querySelector('#colorControl').style.display = 'block';
            }
            if (!document.querySelector('#colorJscolor')) {
                var script = document.createElement("script");
                // if (isHttp) {
                //     script.setAttribute('src', 'https://cdn.bootcss.com/jscolor/2.0.4/jscolor.min.js');
                // } else {
                //     script.setAttribute('src', 'http://cdn.bootcss.com/jscolor/2.0.4/jscolor.min.js');
                // }
                //改为相对协议加载jscolor
                script.setAttribute('src', '//cdn.bootcss.com/jscolor/2.0.4/jscolor.min.js');
                script.setAttribute('id', 'colorJscolor');
                var heads = document.querySelectorAll("head");
                if (heads.length) {
                    heads[0].appendChild(script);
                } else {
                    document.documentElement.appendChild(script);
                }
            }
            //获取设置
            var colorDownOk = document.querySelector('#colorDownOk');
            colorDownOk.addEventListener('click', colorDownOkfn = function() {
                setColor();
            }, false);
            // 变色按钮监听
            var colorDownSwitchColorl = document.querySelector('#colorDownSwitchColorbtn');
            colorDownSwitchColorl.addEventListener('click', colorDownSwitchColorfn = function() {
                //清楚效果
                document.head.removeChild(document.querySelector('#colorDownStyle'));
                if (storage.getItem('colorDownSwitchColor') == 1) {
                    storage.setItem('colorDownSwitchColor', 0);
                    document.querySelector('#colorDownSwitchColor').innerHTML = '未启用';
                    document.querySelector('#colorDownSwitchColor').style = 'background-color: #ff9f9f;';
                    // 添加默认效果
                    addStyle(colorStyle);
                } else {
                    // 变色
                    addvisited();
                    storage.setItem('colorDownSwitchColor', 1);
                    document.querySelector('#colorDownSwitchColor').innerHTML = '已启用';
                    document.querySelector('#colorDownSwitchColor').style = 'background-color: #bbff9f;';
                }
            }, false);
            // 新窗口按钮监听
            var colorDownSwitchTabl = document.querySelector('#colorDownSwitchTabbtn');
            colorDownSwitchTabl.addEventListener('click', colorDownSwitchTabfn = function() {
                if (storage.getItem('colorDownSwitchTab') == 1) {
                    storage.setItem('colorDownSwitchTab', 0);
                    document.querySelector('#colorDownSwitchTab').innerHTML = '未启用';
                    document.querySelector('#colorDownSwitchTab').style = 'background-color: #ff9f9f;';
                    //移除监听
                    for (var k = 0; k < mousedown.length; k++) {
                        mousedown[k].removeEventListener("mousedown", mousedownfn[k], false);
                    }
                } else {
                    //监听
                    listenerAlla();
                    storage.setItem('colorDownSwitchTab', 1);
                    document.querySelector('#colorDownSwitchTab').innerHTML = '已启用';
                    document.querySelector('#colorDownSwitchTab').style = 'background-color: #bbff9f;';
                }
            }, false);
            var colorDownHide = document.querySelector('#colorDownHide');
            colorDownHide.addEventListener('click', colorDownHidefn = function() {
                // document.body.removeChild(document.querySelector('#colorControl'));
                document.querySelector('#colorControl').style.display = 'none';
                // document.head.removeChild(document.querySelector('#colorJscolor'));

                // 移除监听
                colorDownOk.removeEventListener("click", colorDownOkfn, false);
                colorDownHide.removeEventListener("click", colorDownHidefn, false);
                colorDownSwitchColorl.removeEventListener("click", colorDownSwitchColorfn, false);
                colorDownSwitchTabl.removeEventListener("click", colorDownSwitchTabfn, false);
            }, false);
        }
    };
    // 设置颜色
    function addvisited() {
        var style = 'a:visited{color:' + color + ' !important}';
        style += colorStyle;
        addStyle(style);
    }
    // 给a标签添加监听
    function listenerAlla() {
        //获取所有a标签
        var a = document.querySelectorAll('a');
        //给所有a标签添加监听
        for (var i = 0; i < a.length; i++) {
            mousedown[i] = a[i];
            mousedown[i].addEventListener('mousedown', mousedownfn[i] = function(e) {
                    // e.preventDefault()
                var that = this;
                that.addEventListener('click', openUrlfn = function(e) {
                    var href = that.getAttribute('href').toLowerCase();
                    // 判定a标签链接
                    if (href === "" || href == "#") {
                        window.location.href = that.getAttribute('href');
                    } else if (href.indexOf("javascript:") !== -1) {

                    } else {
                        // 阻止默认点击
                        e.preventDefault();
                        // 再新窗口打开链接
                        window.open(that.getAttribute('href'));
                    }
                    that.removeEventListener("click", openUrlfn, false);
                }, false);
                //判定是否启用变色
                if(storage.getItem('colorDownSwitchColor') == 1){
                  // 获取标签下的所有子元素
                  var childNode = childNodes(that, 1);
                  // 遍历所有子元素添加style
                  for (var j = 0; j < childNode.length; j++) {
                    styles = childNode[j].getAttribute('style');
                    if (styles !== null) {
                      styles = styles.toLowerCase();
                      if (styles.indexOf('color:' + color) === -1) {
                        styles += ';color:' + color + ';';
                      }
                    } else {
                      styles = 'color:' + color + ';';
                    }
                    //添加style
                    childNode[j].setAttribute('style', styles);
                  }
                }
            }, false);
        }
    }
    //创建style
    function addStyle(string) {
        var style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.setAttribute("id", 'colorDownStyle');
        if (style.styleSheet) { // IE
            style.styleSheet.cssText = string;
        } else { // w3c
            var cssText = document.createTextNode(string);
            style.appendChild(cssText);
        }
        var heads = document.querySelectorAll("head");
        if (heads.length) {
            heads[0].appendChild(style);
        } else {
            document.documentElement.appendChild(style);
        }
    }
    // 获取颜色
    function setColor() {
        var i = document.querySelector('#colorDownInput').value;
        if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(i)) {
            storage.setItem('colorDown', i);
            color = i;
            if (document.querySelector('#colorDownStyle')) {
                document.head.removeChild(document.querySelector('#colorDownStyle'));
            }
            addvisited();
        } else {
            alert('请输入正确的颜色，如：#ffffff');
        }
    }
    // 获取所有元素 type 1元素 2节点属性 3文本 8注释 9document 11 document片段
    function childNodes(id, type) {
        var node = [];
        function foo(id2) {
            for (var i = 0; i < id2.childNodes.length; i++) {
                if (id2.childNodes[i].nodeType === type) {
                    if (type === 1) {
                        //递归
                        node.push(id2.childNodes[i]);
                        foo(id2.childNodes[i], type);
                    }
                }
            }
        }
        foo(id);
        return node;
    }
})();