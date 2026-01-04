// ==UserScript==
// @name         湖北综合素质评价学生端自我评述一键保存
// @namespace    http://tampermonkey.net/
// @version      1.3.2.2
// @license      MIT
// @description  在毕业汇总表->自我评述中设立一键保存，点击【修改】直接跳转到【学生自我陈述】的文本框
// @author       You
// @match        http://zhsz.e21.cn/2016/Views/Student/editStuInfo7.php?s=6
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e21.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445069/%E6%B9%96%E5%8C%97%E7%BB%BC%E5%90%88%E7%B4%A0%E8%B4%A8%E8%AF%84%E4%BB%B7%E5%AD%A6%E7%94%9F%E7%AB%AF%E8%87%AA%E6%88%91%E8%AF%84%E8%BF%B0%E4%B8%80%E9%94%AE%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/445069/%E6%B9%96%E5%8C%97%E7%BB%BC%E5%90%88%E7%B4%A0%E8%B4%A8%E8%AF%84%E4%BB%B7%E5%AD%A6%E7%94%9F%E7%AB%AF%E8%87%AA%E6%88%91%E8%AF%84%E8%BF%B0%E4%B8%80%E9%94%AE%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function readyFunc(document) {
        var cssele = '.message {z-index:999;line-height:50px;text-align:center;border-Radius:30px;border:grey soild 1px;box-shadow:grey 0px 0px 10px;background:white;height:50px;width:auto;max-width:600px;min-width:200px;position:fixed;bottom:20%;left:50%;transform:translate(-50%,0%);animation: fadeout 4s}';
        cssele += '.scriptbtn {transition-duration:0.6s;animation:btnfadein 1s;opacity:0.6;position:fixed;height:40px;width:90px;border-Radius:40px;bottom:20%;z-index:999;border:none;box-shadow:grey 0px 0px 10px;background:white}';
        cssele += '.scriptbtn:hover {opacity:1;box-shadow:grey 0px 0px 15px;}';
        cssele += '.lockpage {color:rgb(255,255,255);font-size:30px;position:fixed;top:0px;left:0px;height:100%;width:100%;opacity:1;background:rgba(0,0,0,0.5);z-index:5;text-align:center;line-height:400px;}';
        cssele += '@keyframes fadeout {0%{bottom:20%;opacity:1} 50%{bottom:20%;opacity:1;} 100%{bottom:25%;opacity:0}}';
        cssele += '@keyframes btnfadein {0%{opacity:0;transform:translate(0px,25px);}100%{opacity:0.6;transform:translate(0px,0px);}}';
        addCSS(document, cssele);
        document.head.innerHTML = document.head.innerHTML.replaceAll('window.alert', 'console.log');
        document.head.innerHTML = document.head.innerHTML.replaceAll('alert', 'console.log');
        return 0;
    }

    function getRandom(min, max, n = 0) {
        n = n + 1;
        var result = Math.random();
        var num = (max - min) * result + min;
        num = num * Math.pow(10, n);
        num = num - num % 10;
        return num / Math.pow(10, n);
    }

    function setElementValue(ele, value) {
        ele.value = value;
        return 0;
    }

    function appendChildren(document, elelist) {
        for (let i = 0; i < elelist.length; i++) {
            document.body.appendChild(elelist[i]);
        }
        return 0;
    }

    function addCSS(document, cssText) {
        var style = document.createElement('style'), //创建一个style元素
            head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
        style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
        style.id = 'scriptcss';
        if (style.styleSheet) { //IE
            var func = function () {
                try { //防止IE中stylesheet数量超过限制而发生错误
                    style.styleSheet.cssText = cssText;
                } catch (e) {

                }
            }
            //如果当前styleSheet还不能用，则放到异步中则行
            if (style.styleSheet.disabled) {
                setTimeout(func, 10);
            } else {
                func();
            }
        } else { //w3c
            //w3c浏览器中只要创建文本节点插入到style元素中就行了
            var textNode = document.createTextNode(cssText);
            style.appendChild(textNode);
        }
        document.head.appendChild(style); //把创建的style元素插入到head中
    }

    function sendMessage(document, message, zindex = null) {
        var mesbox = document.createElement('div');
        mesbox.className = 'message';
        mesbox.innerHTML = message;
        if(zindex != null)
        {
            mesbox.style.zIndex = zindex;
        }
        mesbox.onload = setTimeout(() => {
            mesbox.remove();
        }, 3950);
        appendChildren(document, [mesbox]);
        return 0;
    }
    window.alert = console.log;
    sendMessage(document, "&nbsp;&nbsp;&nbsp;已移除所有顶栏弹窗");
    if (self.frameElement == null) {
        //防止在框架中再次运行
        readyFunc(document);
        //添加框架
        var frame = document.createElement("iframe");
        frame.src = window.location;
        frame.id = "innerWeb";
        frame.style.position = "fixed";
        frame.style.left = "0px";
        frame.style.top = "0px";
        frame.style.height = "100%";
        frame.style.width = "100%";
        frame.style.zIndex = 99;
        document.body.appendChild(frame);
        //延迟等待网页加载
        setTimeout(function () {
            //定位
            frame.contentWindow.location.hash = "student_representation";
            //添加按钮
            var zhcheck = document.createElement('button');
            zhcheck.onclick = hdautocheck;
            zhcheck.innerText = '一键保存';
            zhcheck.id = 'zhcheckbtn';
            zhcheck.className = 'scriptbtn';
            zhcheck.style.right = '100px';
            zhcheck.style.zIndex = 100;
            document.body.appendChild(zhcheck);
            var zhsave = document.createElement('button');
            zhsave.onclick = function () {window.open("http://zhsz.e21.cn/2016/Views/Student/index.php");}
            zhsave.id = 'zhsavebtn';
            zhsave.innerText = '回到首页';
            zhsave.className = 'scriptbtn';
            zhsave.style.right = '220px';
            zhsave.style.zIndex = 100;
            document.body.appendChild(zhsave);
            frame.contentDocument.getElementsByName("student_representation")[0].innerText = "请将自述完成后，点击下方“自动保存”按钮，即可完成。"
        }, 500);
        var x = 0;
        function hdautocheck() {
            var tot = 0;
            //保存
            for (let i of frame.contentDocument.getElementsByClassName("btn-add f-fr clearfix")) {
                console.log("检查了 " + i.id);
                if (i.name.indexOf("save") != -1) {
                    //勾选所有复选框
                    setTimeout(function () {
                        for (let j of frame.contentDocument.querySelectorAll("input[type=checkbox]")) {
                            if (j.checked == false) {
                                j.click();
                            }
                        }
                        i.click();
                        console.log("保存了 " + i.id);
                    }, 0);
                    tot++;
                };
            }
            sendMessage(document, "保存成功，共保存了 " + tot + " 次");
            setTimeout(function () {
                if(frame.contentDocument.querySelectorAll("span[class='tag tagDeepBlue']").length != 0)
                {
                    x++;
                    sendMessage(document, "检测到未勾选项目，将重新保存……（第" + x + " 次）", x + 999);
                    hdautocheck();
                }
                else
                {
                    x = 0;
                }
            }, 1000)
        }
    }

})();