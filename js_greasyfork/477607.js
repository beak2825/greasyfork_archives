// ==UserScript==
// @name         东北师范大学本科生、研究生教务系统修复
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  修复“不能创建对象！”错误，不能显示弹出式窗口错误
// @author       YorkWu
// @match        https://dsjx.webvpn.nenu.edu.cn/*
// @match        http://dsjx.nenu.edu.cn/*
// @match        https://dsyjs.webvpn.nenu.edu.cn/*
// @match        http://dsyjs.nenu.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nenu.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477607/%E4%B8%9C%E5%8C%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%9C%AC%E7%A7%91%E7%94%9F%E3%80%81%E7%A0%94%E7%A9%B6%E7%94%9F%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/477607/%E4%B8%9C%E5%8C%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%9C%AC%E7%A7%91%E7%94%9F%E3%80%81%E7%A0%94%E7%A9%B6%E7%94%9F%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

// E-Mail: yueyang_wu@outlook.com
// 功能：修复东师本科生、研究生教务平台在较新版本的浏览器中无法使用的问题。
//      目前已修复了“不能创建对象”及无法显示弹出式窗口的问题。

(function () {
    function send_request_override(url, SystemBh) {
        var http_request = new XMLHttpRequest();
        console.log('send_request')
        try {
            http_request.open("POST", url, false);
            http_request.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
            http_request.send(null);

            var tmpxml = http_request.responseXML;
            var topXml = tmpxml.getElementsByTagName("topMenus")[0].getElementsByTagName("Menu");
            if (topMenuItems == null) {
                topMenuItems = new Array();
                topMenuLength = 0;
            }
            for (i = 0; i < topXml.length; i++) {
                topMenuItems[topMenuLength] = new Array();
                topMenuItems[topMenuLength][0] = topXml[i].attributes.getNamedItem("parentid").value;
                topMenuItems[topMenuLength][1] = SystemBh + "_" + topXml[i].attributes.getNamedItem("id").value;
                topMenuItems[topMenuLength][2] = topXml[i].attributes.getNamedItem("name").value;
                topMenuItems[topMenuLength][3] = topXml[i].attributes.getNamedItem("title").value;
                topMenuItems[topMenuLength][4] = topXml[i].attributes.getNamedItem("path").value;
                topMenuItems[topMenuLength][5] = topXml[i].attributes.getNamedItem("imageUrl").value;
                topMenuItems[topMenuLength][6] = topXml[i].attributes.getNamedItem("defaultPage").value;
                topMenuLength++;
            }

            var menuXml = tmpxml.getElementsByTagName("Level1Menus")[0].getElementsByTagName("Menu");
            if (menuItems == null) {
                menuItems = new Array();
                menuLength = 0;
            }
            for (i = 0; i < menuXml.length; i++) {
                menuItems[menuLength] = new Array();
                menuItems[menuLength][0] = SystemBh + "_" + menuXml[i].attributes.getNamedItem("parentid").value;
                menuItems[menuLength][1] = SystemBh + "_" + menuXml[i].attributes.getNamedItem("id").value;
                menuItems[menuLength][2] = '&nbsp;' + menuXml[i].attributes.getNamedItem("name").value;
                menuItems[menuLength][3] = menuXml[i].attributes.getNamedItem("title").value;
                menuItems[menuLength][4] = menuXml[i].attributes.getNamedItem("path").value;
                menuItems[menuLength][5] = menuXml[i].attributes.getNamedItem("imageUrl").value;
                menuLength++;
            }

            var linkXml = tmpxml.getElementsByTagName("Level2Menus")[0].getElementsByTagName("Menu");
            if (linkItems == null) {
                linkItems = new Array();
                linkLength = 0;
            }
            for (i = 0; i < linkXml.length; i++) {
                linkItems[linkLength] = new Array();
                linkItems[linkLength][0] = SystemBh + "_" + linkXml[i].attributes.getNamedItem("parentid").value;
                linkItems[linkLength][1] = SystemBh + "_" + linkXml[i].attributes.getNamedItem("id").value;
                linkItems[linkLength][2] = '&nbsp;&nbsp;' + linkXml[i].attributes.getNamedItem("name").value;
                linkItems[linkLength][3] = linkXml[i].attributes.getNamedItem("title").value;
                linkItems[linkLength][4] = linkXml[i].attributes.getNamedItem("path").value;
                linkItems[linkLength][5] = linkXml[i].attributes.getNamedItem("imageUrl").value;
                linkLength++;
            }
            console.log('send_request success')
        } catch (e) {
            console.log('send_request error')
            console.log(e)
            alert('遇到未知问题，请刷新页面')
        }
    }

    window.send_request = send_request_override;

    // 加入showModalDialog.js为了使悬浮窗正常显示
    // 引用自https://github.com/niutech/showModalDialog
    (function () {
        window.spawn = window.spawn || function (gen) {
            function continuer(verb, arg) {
                var result;
                try {
                    result = generator[verb](arg);
                } catch (err) {
                    return Promise.reject(err);
                }
                if (result.done) {
                    return result.value;
                } else {
                    return Promise.resolve(result.value).then(onFulfilled, onRejected);
                }
            }
            var generator = gen();
            var onFulfilled = continuer.bind(continuer, 'next');
            var onRejected = continuer.bind(continuer, 'throw');
            return onFulfilled();
        };
        window.showModalDialog = window.showModalDialog || function (url, arg, opt) {
            url = url || ''; //URL of a dialog
            arg = arg || null; //arguments to a dialog
            opt = opt || 'dialogWidth:300px;dialogHeight:200px'; //options: dialogTop;dialogLeft;dialogWidth;dialogHeight or CSS styles
            var caller = showModalDialog.caller.toString();
            var dialog = document.body.appendChild(document.createElement('dialog'));
            dialog.setAttribute('style', opt.replace(/dialog/gi, ''));
            dialog.innerHTML = '<a href="#" id="dialog-close" style="position: absolute; top: 0; right: 5px; font-size: 20px; color: #000; text-decoration: none; outline: none;">&times;</a><iframe id="dialog-body" src="' + url + '" style="border: 0; width: 100%; height: 100%;"></iframe>';
            document.getElementById('dialog-body').contentWindow.dialogArguments = arg;
            document.getElementById('dialog-close').addEventListener('click', function (e) {
                e.preventDefault();
                dialog.close();
            });
            dialog.showModal();
            //if using yield or async/await
            if (caller.indexOf('yield') >= 0 || caller.indexOf('await') >= 0) {
                return new Promise(function (resolve, reject) {
                    dialog.addEventListener('close', function () {
                        var returnValue = document.getElementById('dialog-body').contentWindow.returnValue;
                        document.body.removeChild(dialog);
                        resolve(returnValue);
                    });
                });
            }
            //if using eval
            var isNext = false;
            var nextStmts = caller.split('\n').filter(function (stmt) {
                if (isNext || stmt.indexOf('showModalDialog(') >= 0)
                    return isNext = true;
                return false;
            });
            dialog.addEventListener('close', function () {
                var returnValue = document.getElementById('dialog-body').contentWindow.returnValue;
                document.body.removeChild(dialog);
                nextStmts[0] = nextStmts[0].replace(/(window\.)?showModalDialog\(.*\)/g, JSON.stringify(returnValue));
                eval('{\n' + nextStmts.join('\n'));
            });
            throw 'Execution stopped until showModalDialog is closed';
        };
    })();

    var isSelectOverride = 0;
    function doOverrideSelect(s) {
        var obj = document.getElementById(s);
        if (!obj) {
            return;
        }
        var funcName = obj.getAttribute('onchange');
        // 去掉funcname最后调用的(this)
        funcName = funcName.substring(1, funcName.length - 6);
        function overrideFunc() {
            window[funcName]({
                options: {
                    value: document.getElementById(s).value
                }
            });
        }
        document.getElementById(s).onchange = overrideFunc;
        overrideFunc();
        isSelectOverride++;
    }

    (function (){
        function loop() {
            if (isSelectOverride > 1) {
                return;
            }
            doOverrideSelect('xnxq');
            doOverrideSelect('pjpc');
            doOverrideSelect('pjfl');
            doOverrideSelect('pjkc');
            setTimeout(loop, 1000);
        }
        loop();
    })();

    var isSavedataOverride=0
    function overrideSaveData(){
        isSavedataOverride++;
        window.saveData = (obj) => {
            var elements=window.Form1.elements;
            var count=0;
            var flag=false;
            var chooseColumn="";
            var val="";
            for(i=0;i<elements.length;i++){
                if(elements[i].type=="radio"){
                    if(elements[i].checked==true){
                        if(chooseColumn!=""&&chooseColumn!=elements[i].radioXh){
                            flag=true;
                        }
                        count=count+1;
                        chooseColumn=elements[i].radioXh;
                        val+=elements[i].value+"*";
                    }
                }
            }
            if(count=="1"||count=="0"){
                flag=true;
            }
            if(count!="10"){
                alert("请选择完整信息");
            }else{
                //if(flag){
                var isxyss = "1";
                if(isxyss=='0'){
                    obj="2";
                }
                if(obj=="1"){
                    if(window.confirm("确定要保存该教师课程的教学效果评价问卷吗?")){
                        window.Form1.type.value=1;
                        window.Form1.action="/jxpjgl.do?method=savePj&tjfs=1&val="+val.substring(0,val.length-1);
                        document.getElementById('bc').disabled = true;
                        window.Form1.submit();
                    }
                }
                if(obj=="2"){
                    if(window.confirm("确定要提交该教师课程的教学效果评价问卷吗?\n提交后将不能再修改")){
                        window.Form1.type.value=2;
                        window.Form1.action="/jxpjgl.do?method=savePj&tjfs=2&val="+val.substring(0,val.length-1);
                        document.getElementById('tj').disabled = true;
                        window.Form1.submit();
                    }
                }
            }
        }
	}

    (function() {
        function loop() {
            if (isSavedataOverride > 1) {
                return;
            }
            overrideSaveData();
            setTimeout(loop, 1000);
        }
        loop();
    })();

})();