// ==UserScript==
// @name         跳转图片链接助手
// @namespace    xiaobaibubai/picUrlSkip
// @version      1.0.0
// @description  鼠标悬停在页面某元素上，识别到图片后有提示，当提示出现之后，使用Alt+Ctrl+q打开。
// @author       XiaoBaiBuBai
// @match        *://*/*
// @license     BSD
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482731/%E8%B7%B3%E8%BD%AC%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/482731/%E8%B7%B3%E8%BD%AC%E5%9B%BE%E7%89%87%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 全局变量，用于存储img元素的路径和计时器
    var imgPath = '';
    var imgName = '';
    var imgTypes = ['.jpg','.png','.gif','svg','webp'];
    var localSelectType = JSON.parse(localStorage.getItem('selectType'));
    var selectType = localSelectType == null?0:localSelectType;
    var hoverTimer = null;

    // 鼠标悬停事件监听器
    document.addEventListener('mouseover', function(event) {
        var hoveredElement = event.target;
        var imgUrl = '';
        if (hoveredElement.tagName.toLowerCase() === 'img') {
            // 1.检查元素是否是img标签
            imgAnalyse(hoveredElement);
        }else if(hoveredElement.tagName.toLowerCase() === 'div'){
            // 2.检查是否是div标签兄弟标签
            // 获取该元素的父元素
            var parentElement = hoveredElement.parentNode;
            // 获取父元素的子元素
            var siblings = parentElement.children;
            // 遍历所有兄弟元素
            for (var i = 0; i < siblings.length; i++) {
                // 如果这个兄弟元素是我们要找的元素，跳出循环
                if (siblings[i].tagName.toLowerCase() === 'img') {
                    imgAnalyse(siblings[i]);
                    return;
                }
            }

            // 3.检查是否是div标签style是否具有路径
            imgUrl = hoveredElement.style.backgroundImage;
            if(imgUrl!=null ){
                var startIndex = imgUrl.indexOf("\"") + 1;
                var endIndex = imgUrl.lastIndexOf("\"");
                imgPath = imgUrl.substring(startIndex, endIndex);
                imgAnalyseNoParam();
            }
        }else if(hoveredElement.tagName.toLowerCase() === 'a'){
            // 4.检查是否是a标签style是否具有路径
            imgUrl = hoveredElement.style.backgroundImage;
            if(imgUrl!=null ){
                imgPath = hoveredElement.style.backgroundImage.substring(imgUrl.indexOf("\"") + 1, imgUrl.lastIndexOf("\""));
                imgAnalyseNoParam();
            }
        }
    });

    // 鼠标移出事件监听器，用于清除计时器
    document.addEventListener('mouseout', function() {
        // 清除计时器以防止误操作
        if (hoverTimer !== null) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
            //当已有选中的目标时，清除目标
            if(imgPath != ''){
                imgPath = '';
                imgName = '';
                messageShowDiy("已取消选中");
            }
        }
    });

    // 键盘事件监听器，监听Alt+d键的按下事件
    document.addEventListener('keydown', function(event) {
        // 解析全局变量中的路径并下载文件 alt + d
        if (event.altKey && event.ctrlKey && event.key === 'q') {
            if(imgPath == ''){
                messageShowDiy("未选中图片",'');
                return;
            }

            downloadFile(imgPath);
        }
        // 选择图片下载格式
        if (event.altKey && event.ctrlKey && event.key.match(/\d/)) {
            // 获取按下的数字值
            const keyValue = parseInt(event.key);

            // 如果找到了匹配的档位，执行相应的操作
            if (keyValue >= 0 && keyValue <= imgTypes.length) {
                selectType = keyValue;
                messageShowDiy( `当前格式：${imgTypes[selectType]}`,'tick');
                saveState(selectType);
            } else {
                messageShowDiy( `未匹配到相应的格式：${keyValue}`,'');
            }
        }
    });

    function imgAnalyse(hoveredElement){
        // 清除之前的计时器（如果存在）
        if (hoverTimer !== null) {
            clearTimeout(hoverTimer);
        }
        // 设置新的计时器，在鼠标悬停超过一秒钟后触发操作
        hoverTimer = setTimeout(function() {
            // 记录img的路径到全局变量中
            imgPath = hoveredElement.src;
            imgName = hoveredElement.title;
            // 显示消息提示
            var m = selectType!=null?"已选中图片,当前格式为："+imgTypes[selectType]:"已选中图片，未选中图片下载格式";
            console.log("url:"+imgPath);
            messageShowDiy(m,'tick');
        }, 1100); // 1000毫秒等于1秒
    }

    function imgAnalyseNoParam(){
        // 清除之前的计时器（如果存在）
        if (hoverTimer !== null) {
            clearTimeout(hoverTimer);
        }
        // 设置新的计时器，在鼠标悬停超过一秒钟后触发操作
        hoverTimer = setTimeout(function() {
            console.log(imgPath);
            var m = selectType!=null?"已选中图片,当前格式为："+imgTypes[selectType]:"已选中图片，未选中图片下载格式";
            messageShowDiy(m,'tick');

        }, 1100); // 1000毫秒等于1秒
    }

    // 下载文件的函数
    function downloadFile(path) {
        var link = document.createElement('a');
        link.href = path;
        var fileName = imgName == ''?getFormattedTime():imgName;
        link.setAttribute('download',fileName+imgTypes[selectType]); //设置下载属性 以及文件名
        //console.log(link.download);
        //link.click();
        window.open(path, '_blank');

                    //debugger;

       // fetch(path)
          //  .then(response => response.blob()) // 将响应内容转换为Blob对象
           // .then(blob => {

           // var url = URL.createObjectURL(blob);
           // var link = document.createElement('a');
           // link.href = url;
           // link.download = fileName +imgTypes[selectType]; // 根据实际情况设置下载的文件名
           // link.click();
           // console.log(link.download);
       // }).catch(error => console.error('Error:', error));
    }


    function getFormattedTime() {
        var date = new Date();
        var year = date.getFullYear();
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var day = ("0" + date.getDate()).slice(-2);
        var hour = ("0" + date.getHours()).slice(-2);
        var minute = ("0" + date.getMinutes()).slice(-2);
        var second = ("0" + date.getSeconds()).slice(-2);

        return year + month + day + hour + minute + second;
    }

    function saveState(selectType) {
        localStorage.setItem('selectType', selectType);
    }

    function messageShowDiy(m,type){
        const message = new MessageToolDiy();
        message.show(m, type); // 显示绿色勾图标的消息提示
    }
})();

// My Message 实现类似this.$message的效果
class MessageToolDiy {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'messageContainer';
        this.container.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; justify-content: center; z-index: 9999;';
        document.body.appendChild(this.container);
    }
    show(message, iconType) {
        const p = document.createElement('p');
        p.style.cssText = 'margin: 10px; padding: 10px; background-color: #f5f5f5; border-radius: 4px; display: flex; align-items: center;';
        let icon;
        if (iconType === 'tick') {
            icon = document.createElement('span');
            icon.style.cssText = 'width: 16px; height: 16px; background-color: green; border-radius: 50%; margin-right: 10px;';
            const checkmark = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            checkmark.setAttribute("viewBox", "0 0 24 24");
            checkmark.setAttribute("width", "16");
            checkmark.setAttribute("height", "16");
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M9 16.2l-3.6-3.6c-.8-.8-.8-2 0-2.8s2-.8 2.8 0L9 11.6l6.2-6.2c.8-.8 2-.8 2.8 0s.8 2 0 2.8L11.8 16.2c-.4.4-.8.6-1.3.6-.5 0-.9-.2-1.3-.6z");
            path.setAttribute("fill", "white");
            checkmark.appendChild(path);
            icon.appendChild(checkmark);
        } else {

            icon = document.createElement('span');
            icon.style.cssText = 'width: 16px; height: 16px; background-color: red; border-radius: 50%; margin-right: 10px;';
        }
        p.appendChild(icon);
        const text = document.createTextNode(message);
        p.appendChild(text);
        this.container.appendChild(p);
        setTimeout(() => {
            this.container.removeChild(p);
        }, 1000);
    }
}
