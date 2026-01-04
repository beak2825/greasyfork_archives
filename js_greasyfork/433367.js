// ==UserScript==
// @name         获取微信公众号名称 和 BIZ
// @namespace    lucas_fong
// @version      1.3
// @description  获取微信公众号名称 和 BIZ，一键复制，并保存到 VIKA 表中。VIKA 表中的 Token 需要替换成个人的。
// @author       Lucas Fong
// @match        https://mp.weixin.qq.com/s/*
// @icon         https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico
// @grant        无
// @downloadURL https://update.greasyfork.org/scripts/433367/%E8%8E%B7%E5%8F%96%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%90%8D%E7%A7%B0%20%E5%92%8C%20BIZ.user.js
// @updateURL https://update.greasyfork.org/scripts/433367/%E8%8E%B7%E5%8F%96%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E5%90%8D%E7%A7%B0%20%E5%92%8C%20BIZ.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
       初始化参数
    */
    // 站点类型，每个站点都需要手工配置
    var WebSiteType = "微信";
    // 按钮文本，自定义修改
    var button_Text = '复制微信公众号名称 和 BIZ';

    // VIKA 网站：https://vika.cn/
    // VIKA 的 TOKENID，请填写自己帐号的
    var vika_Authorization = "uskL4Vrzc9iO2yHtUjwiHKk";
    // VIKA 的表格 URL 地址
    var vika_URL = "https://api.vika.cn/fusion/v1/datasheets/dstvYRpj71ji9ci4HS/records";

    /*
       内置参数和函数，针对不同的平台有不同的方法
    */
    // 站点链接，用于记录当前地址
    var _WebSiteURL = window.location.href;
    // 获取唯一ID的方法
    var _GetID = function(){
        return document.querySelector("meta[property='og:url']").content.match(/__biz=(\S*)&mid/)[1];//微信 BIZ
    }
    // 获取帐号昵称的方法
    var _GetNickName = function(){
        return document.querySelector("#js_name").innerText;//获取昵称
    }

    /*
       插件逻辑，每个插件都一样，可以直接复用
    */
    // HTTP POSt 请求
    var httpPost = function(data){
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST', vika_URL, true); //第二步：打开连接
        httpRequest.setRequestHeader("Content-type","application/json");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.setRequestHeader("Authorization","Bearer " + vika_Authorization);

        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var json = httpRequest.responseText;//获取到服务端返回的数据
                console.log(json);
            }
        };

        httpRequest.send(data);
    }

    // 插入按钮
    var button2 = document.createElement("button");
    button2.innerText = button_Text;
    button2.setAttribute('id','_datastory_');
    button2.setAttribute('style','position:absolute;top:0px;left:0px;z-index:999999');

    // 绑定按钮点击操作
    button2.onclick = function(){
        var _ID = _GetID();
        var _nickname = _GetNickName();

        //拼接表格，用于粘贴 EX CEL
        var copy_content = '<table><tr><td>' + _nickname + '</td><td>' + _ID +'</td></tr></table>';

        //拼接JSON，用于 VIKA，字符串拼接
        var copy_data = "{\"records\":[{\"fields\":{\"帐号昵称\":\"" + _nickname +
            "\",\"唯一ID\":\"" + _ID +
            "\",\"站点类型\":\"" + WebSiteType +
            "\",\"站点URL（用于检查）\":\"" + _WebSiteURL +
            "\"}}]}";

        var copy = function(e){
            e.preventDefault();
            e.clipboardData.setData('text/plain',copy_content);
            //alert('复制成功');//弹出提示，太阻碍操作了
            // 发送内容到 VIKA 表格
            httpPost(copy_data);
            // 修改按钮后提示
            button2.innerText = '复制成功(' + (new Date()).getTime() + ')';
            document.removeEventListener('copy',copy)
        }
        document.addEventListener('copy',copy);
        document.execCommand("Copy");
    }
    document.querySelector('body').appendChild(button2);

})();
