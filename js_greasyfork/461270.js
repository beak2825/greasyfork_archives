// ==UserScript==
// @name         JsonCrawler
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  获取截图及json
// @author       You
// @match        *://*/*
// @license MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461270/JsonCrawler.user.js
// @updateURL https://update.greasyfork.org/scripts/461270/JsonCrawler.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // * 在本地进行文件保存
    // * @param  {String} data     要保存到本地的图片数据/或路径
    // * @param  {String} filename 文件名
    // */
    function saveFile(data, filename) {
        // 创建一个<a>标签
        let save_link = document.createElement('a');
        save_link.href = data;
        save_link.download = filename;
        let event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0,
            0, 0, 0, 0, false, false,
            false, false, 0, null);
        save_link.dispatchEvent(event);
    }


    //本地下载快照  ，name是文件的部分名称
    function doLoadQR(name) {
        //新建一个画布元素
        let canvas2 = document.createElement("canvas");
        //获取该元素区块的本身宽高
        let w = 3000;
        let h = 2000;
        // console.log(w+"======"+h);
        //因为直接用默认画布会模糊，因此自定义画布，设置画布尺寸为容器的两倍大小，再将内容放大两倍画上去，
        // 修改偏移量，就可以解决模糊问题
        //画布真实宽高
        canvas2.width = w;
        canvas2.height = h;
        //宽高宽高
        canvas2.style.width = w + "px";
        canvas2.style.height = h + "px";
        //设置画布的内容
        let context = canvas2.getContext("2d");
        //x,y轴放大两倍
        //context.scale(2, 2);
        //获取容器边距对象
        let rect = document.getElementsByTagName('body')[0];
        //设置偏移量
        context.translate('-' + rect.left, '-' + rect.top);
        //调用库
        html2canvas(document.getElementsByTagName('body')[0]
            , {
                useCORS: true,
                scale: 2,
                width: w,
                height: h,
                //使用自定义的画布
                canvas: canvas2,
                // window.devicePixelRatio是设备像素比
                dpi: window.devicePixelRatio,//* 2,

            }
        ).then(function (canvas) {
            // 回调生成的画布canvas对象
            // 获取生成的图片的相对url，其实将bese64加密的数据 的数据类型image/png换成image/octet-stream
            let imgUri = canvas.toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            //文件名称
            let filename = (new Date()).getTime() + "_" + name + '.png';
            //下载
            saveFile(imgUri, filename);
        });
    }

    var script = document.createElement('script');
    script.src = "http://html2canvas.hertzen.com/dist/html2canvas.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);


    var input = document.createElement("input");
    input.type = "text";
    input.style.width = "300px";
    input.style.height = "50px";
    input.style.borderRadius = "10px";
    input.style.textAlign = "center";
    input.value = (new Date()).getTime() + '默认名称';
    input.style.borderColor = "#444654";
    input.style.marginBottom = "20px";

    var button = document.createElement("button"); //创建一个input对象（提示框按钮）
    button.id = "id001";
    button.textContent = "DownLoad";
    button.style.width = "200px";
    button.style.height = "50px";
    button.style.color = "#000"
    button.style.alignItems = "center";
    button.style.borderRadius = "15px";
    button.style.backgroundColor = "#ECF8FF";
    button.style.border = "none";
    button.style.marginBottom = "20px";

    var isOnButton = document.createElement("button");
    isOnButton.textContent = "已开启跳转";
    isOnButton.style.width = "200px";
    isOnButton.style.height = "50px";
    isOnButton.style.color = "#000"
    isOnButton.style.alignItems = "center";
    isOnButton.style.borderRadius = "15px";
    isOnButton.style.backgroundColor = "#ECF8FF";
    isOnButton.style.border = "none";
    isOnButton.style.marginBottom = "20px";


    var DownloadPicture = document.createElement("button");
    DownloadPicture.textContent = "下载快照";
    DownloadPicture.style.width = "200px";
    DownloadPicture.style.height = "50px";
    DownloadPicture.style.color = "#000"
    DownloadPicture.style.alignItems = "center";
    DownloadPicture.style.borderRadius = "15px";
    DownloadPicture.style.backgroundColor = "#ECF8FF";
    DownloadPicture.style.border = "none";
    DownloadPicture.style.marginBottom = "20px";

    var container = document.createElement("div");
    container.appendChild(input);
    container.appendChild(button);
    container.appendChild(DownloadPicture);
    container.appendChild(isOnButton);
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";

    var isOn = true;
    isOnButton.onclick = function () {
        isOn = !isOn;
        if (isOn) {
            isOnButton.textContent = '已开启跳转';
            isOnButton.style.backgroundColor = '#ECF8FF';
            isOnButton.style.color = '#000';
        } else {
            isOnButton.textContent = '已关闭跳转';
            isOnButton.style.backgroundColor = '#ECF8FF';
            isOnButton.style.color = '#000';
        }
    }

    DownloadPicture.onclick = function () {
        function isEmpty(s) {
            return s == undefined || s === '';

        }
        var iframe = document.getElementsByTagName('iframe')[0];
        if (isOn && !isEmpty(iframe)) {
            var iframeSrc = iframe.getAttribute('src');
            window.location.href = iframeSrc;
            // 创建消息提示框元素
            var alertBox = document.createElement('div');
            alertBox.setAttribute('class', 'alert-box');
            alertBox.style.position = 'fixed';
            alertBox.style.top = '0';
            alertBox.style.width = '100%';
            alertBox.style.padding = '10px';
            alertBox.style.backgroundColor = '#007bff';
            alertBox.style.color = '#fff';
            alertBox.style.textAlign = 'center';
            alertBox.style.zIndex = '9999';
            alertBox.style.transition = 'transform .5s ease-in-out';

            // 创建消息提示框文本元素
            var alertText = document.createElement('span');
            alertText.setAttribute('class', 'alert-text');
            alertBox.appendChild(alertText);

            // 添加消息提示框到页面
            document.body.appendChild(alertBox);

            // 显示消息提示框
            function showAlert(message) {
                alertText.innerHTML = message;
                alertBox.style.transform = 'translateY(0)';
                setTimeout(function () {
                    alertBox.style.transform = 'translateY(-100%)';
                }, 3000);
            }

            // 示例调用代码
            showAlert('~已跳转到子文档对应网站~');

            return;
        }
        doLoadQR(input.value);
    };


    //绑定按键点击功能
    button.onclick = function () {
        //如果有iframe元素,则跳转到对应网站,可以选择是否跳转
        var iframe = document.getElementsByTagName('iframe')[0];
        if (isOn && !isEmpty(iframe)) {
            var iframeSrc = iframe.getAttribute('src');
            window.location.href = iframeSrc;
            // 创建消息提示框元素
            var alertBox = document.createElement('div');
            alertBox.setAttribute('class', 'alert-box');
            alertBox.style.position = 'fixed';
            alertBox.style.top = '0';
            alertBox.style.width = '100%';
            alertBox.style.padding = '10px';
            alertBox.style.backgroundColor = '#007bff';
            alertBox.style.color = '#fff';
            alertBox.style.textAlign = 'center';
            alertBox.style.zIndex = '9999';
            alertBox.style.transition = 'transform .5s ease-in-out';

            // 创建消息提示框文本元素
            var alertText = document.createElement('span');
            alertText.setAttribute('class', 'alert-text');
            alertBox.appendChild(alertText);

            // 添加消息提示框到页面
            document.body.appendChild(alertBox);

            // 显示消息提示框
            function showAlert(message) {
                alertText.innerHTML = message;
                alertBox.style.transform = 'translateY(0)';
                setTimeout(function () {
                    alertBox.style.transform = 'translateY(-100%)';
                }, 3000);
            }

            // 示例调用代码
            showAlert('~已跳转到子文档对应网站~');

            return;
        }

        // Your code here...
        var json = "{\"container\":{\"height\":" + document.documentElement.scrollHeight + "},\"blocks\":[";
        var reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
        var numReg = /[1-9][0-9]*/g;


        // 遍历所有子元素
        var nodes;

        nodes = document.all;

        //var pageWidth = document.documentElement.scrollWidth;
        var pageHeight = document.documentElement.scrollHeight;

        function isEmpty(s) {
            return s == undefined || s === '';

        }

        function getElementPosInfo(width, height, left, top) {
            return "\"width\":" + width +
                ",\"height\":" + height +
                ",\"left\":" + left +
                ",\"top\":" + top + ",";
        }

        function getElementLeft(element) {
            var actualLeft = element.offsetLeft;
            var current = element.offsetParent;
            while (current !== null) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
            return actualLeft;
        }

        function getElementTop(element) {
            var actualTop = element.offsetTop;
            var current = element.offsetParent;
            while (current !== null) {
                actualTop += current.offsetTop;
                current = current.offsetParent;
            }
            return actualTop;
        }

        for (var i = 0; i < nodes.length; i++) {
            var o = nodes[i];
            if (isEmpty(o)) {
                continue;
            }
            var text = o.innerText;

            var style = getComputedStyle(o);
            var color = style.getPropertyValue('color');
            var fontSize = style.getPropertyValue('font-size').match(numReg);
            var backImg = style.getPropertyValue('background-image').match(reg);
            var textAlign = style.getPropertyValue('text-align');
            var backgroundColor = style.getPropertyValue('background-color');


            var error = 0;
            try {
                var otop = getElementTop(o);
                var oleft = getElementLeft(o);
                var owidth = o.offsetWidth;
                var oheight = o.offsetHeight;
            } catch (error) {
                console.log("Find exception");
                error = 1;
            }

            if (error === 1) {
                continue;
            }


            if (owidth <= 0 || oheight <= 0 || otop < 0 || oleft < 0) {
                continue;
            }

            var posInfo = getElementPosInfo(owidth, oheight, oleft, otop);
            if (/*(o.tagName === 'A' && o.href != null) ||*/ o.tagName === 'btn') {
                // add a button
                var p = o;
                while (p.firstElementChild !== null) {
                    p = p.firstElementChild;
                }
                text = p.innerHTML;
                var src = p.src;
                json = json + "{\"key\":\"默认按钮\",\"componentProps\":{},"
                    + posInfo
                    + "\"text\":\"" + text
                    + "\"";
                //+ "\",\"font\":\""+font
                if (src !== undefined) {
                    json = json + ",\"src\":\"" + src + "\"";
                }
                json = json + ",\"zIndex\":3},";
            } else if ((text != null && o.firstElementChild === null && (o.tagName === 'H1' || o.tagName === 'H2' || o.tagName === 'H3' || o.tagName === 'H4' || o.tagName === 'H5' || o.tagName === 'H6' ||
                o.tagName === 'A' || o.tagName === 'SPAN' || o.tagName === 'DIV' || o.tagName === 'P' || o.tagName === 'LI' || o.tagName === 'Q' || o.tagName === 'FONT' || o.tagName === 'B'))) {
                // add a label
                json = json + "{\"key\":\"文本框\",\"componentProps\":{},"
                    + posInfo
                    + "\"text\":\"" + text
                    + "\",\"fontColor\":\"" + color
                    + "\",\"size\":\"" + fontSize
                    + "\",\"textAlign\":\"" + textAlign
                    + "\",\"zIndex\":3},";
                //              "\",\"font\":\""+font+
            } else if (o.tagName === 'IMG') {
                // add an image
                json = json + "{\"key\":\"图片\","
                    + posInfo
                    + "\"componentProps\":{"
                    + "\"src\":\"" + o.src
                    + "\"},\"zIndex\":3},";
                // + "\",\"font\":\""+font
                // + "\"text\":\""+text
            } else if (!isEmpty(backImg)) {
                // add a background image
                json = json + "{\"key\":\"网站模块背景\",\"componentProps\":{},"
                    + posInfo
                    + "\"bgcImage\":\"" + backImg
                    + "\",\"bgcColor\":\"rgba(252, 214, 41, 0)\",\"zIndex\":1},";
            } else if ((o.tagName === 'DIV' || o.tagName === 'SECTION' || o.tagName === 'FOOTER' || o.tagName === 'BLOCKQUOTE')
                && backgroundColor != 'rgb(255, 255, 255)'
                && backgroundColor != 'rgba(255, 255, 255, 1)'
                && backgroundColor != 'rgba(255, 255, 255, 0)'
                && backgroundColor != 'rgba(0, 0, 0, 0)'
                && !isEmpty(o)) {
                // add a color block
                json = json + "{\"key\":\"网站模块背景\",\"componentProps\":{},"
                    + posInfo
                    + "\"bgcColor\":\"" + backgroundColor + "\",\"zIndex\":1},";
            }
        }

        json = json.substr(0, json.length - 1) + "],\"focusData\":{}}";

        var downelem = document.createElement('a');
        downelem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(json));
        downelem.setAttribute('download', input.value);

        downelem.style.display = 'none';
        document.body.appendChild(downelem);

        downelem.click();

        document.body.removeChild(downelem);

        /*var url = "http://121.36.109.90:8000/api/spider/add";
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', url, true);
        httpRequest.setRequestHeader("Content-type", "application/json");
        var obj = {
            "json": json,
        };

        httpRequest.send(JSON.stringify(obj));

        // 响应后的回调函数
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                var json = httpRequest.responseText;
                console.log(json);
            }
        };*/

    };


    window.top.document.getElementsByTagName('body')[0].appendChild(container);
})();