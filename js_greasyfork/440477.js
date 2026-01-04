// ==UserScript==
// @name         北工商教务系统现代浏览器转换
// @namespace    https://github.com/xqqy
// @version      0.2
// @description  让教务管理可在firefox、chrome等现代浏览器中使用，代码略乱，主要是将一些IE独有的接口重写了
// @author       xqqy
// @match        *://jwgl.webvpn.btbu.edu.cn/*
// @match        *://jwgl.btbu.edu.cn/*
// @run-at       document-body
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440477/%E5%8C%97%E5%B7%A5%E5%95%86%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%8E%B0%E4%BB%A3%E6%B5%8F%E8%A7%88%E5%99%A8%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/440477/%E5%8C%97%E5%B7%A5%E5%95%86%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%8E%B0%E4%BB%A3%E6%B5%8F%E8%A7%88%E5%99%A8%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function() {

    //万恶的activex被替换啦
    window.send_request=function (url, SystemBh) {
        var http_request = false;
        if (window.XMLHttpRequest) {
            http_request = new XMLHttpRequest();
            //给现代化浏览器的polifill
            XMLDocument.prototype.selectSingleNode = Element.prototype.selectSingleNode = function (xpath) {
                var x = this.selectNodes(xpath)
                if (!x || x.length < 1) return null;
                return x[0];
            }
            XMLDocument.prototype.selectNodes = Element.prototype.selectNodes = function (xpath) {
                var xpe = new XPathEvaluator();
                var nsResolver = xpe.createNSResolver(this.ownerDocument == null ? this.documentElement : this.ownerDocument.documentElement);
                var result = xpe.evaluate(xpath, this, nsResolver, 0, null);
                var found = [];
                var res;
                while (res = result.iterateNext()){
                    found.push(res);}
                return found;
            }
        }
        if (!http_request) {
            window.alert("不能创建对象!");
            return false;
        }

        try {
            http_request.open("POST", url, false);

            http_request.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");

            http_request.send(null);

            var tmpxml = http_request.responseXML;

            //加载顶层菜单开始
            var topXml = tmpxml.selectNodes("/Menus/topMenus/Menu");
            console.log(topXml[0].attributes)
            for (let i = 0; i < topXml.length; i++) {
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
            //加载顶层菜单结束

            //加载一层菜单开始
            var menuXml = tmpxml.selectNodes("/Menus/Level1Menus/Menu");
            for (let i = 0; i < menuXml.length; i++) {
                menuItems[menuLength] = new Array();
                menuItems[menuLength][0] = SystemBh + "_" + menuXml[i].attributes.getNamedItem("parentid").value;
                menuItems[menuLength][1] = SystemBh + "_" + menuXml[i].attributes.getNamedItem("id").value;
                menuItems[menuLength][2] = '&nbsp;' + menuXml[i].attributes.getNamedItem("name").value;
                menuItems[menuLength][3] = menuXml[i].attributes.getNamedItem("title").value;
                menuItems[menuLength][4] = menuXml[i].attributes.getNamedItem("path").value;
                menuItems[menuLength][5] = menuXml[i].attributes.getNamedItem("imageUrl").value;
                menuLength++;
            }

            //加载一层菜单结束

            //加载二层菜单开始
            var linkXml = tmpxml.selectNodes("/Menus/Level2Menus/Menu");
            for (let i = 0; i < linkXml.length; i++) {
                linkItems[linkLength] = new Array();
                linkItems[linkLength][0] = SystemBh + "_" + linkXml[i].attributes.getNamedItem("parentid").value;
                linkItems[linkLength][1] = SystemBh + "_" + linkXml[i].attributes.getNamedItem("id").value;
                linkItems[linkLength][2] = '&nbsp;&nbsp;' + linkXml[i].attributes.getNamedItem("name").value;
                linkItems[linkLength][3] = linkXml[i].attributes.getNamedItem("title").value;
                linkItems[linkLength][4] = linkXml[i].attributes.getNamedItem("path").value;
                linkItems[linkLength][5] = linkXml[i].attributes.getNamedItem("imageUrl").value;
                linkLength++;
            }

            //加载二层菜单结束
        }
        catch (eii) { alert("加载编号为" + SystemBh + "的应用系统失败，可能是网络延迟问题2333333！" + eii); }

    }
    document.onload=function(){window.send_request("/Logon.do?method=logonBySSO","0");}
    //弹出框的更改，貌似不能固定大小了
    window.showModalDialog =function(a,b,c){
        window.open(a,b,c.replace('dialogWidth','width').replace('dialogHeight','height').replace(';',','))
    }



})();