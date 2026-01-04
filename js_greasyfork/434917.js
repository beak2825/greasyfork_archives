// ==UserScript==
// @name         超星学习通资源嗅探
// @namespace    http://tampermonkey.net/
// @version      0.1.10
// @description  嗅探超星学习通学习页面的视频、课件等资源
// @author       Jamaskii
// @match        https://mooc1.chaoxing.com/mycourse/studentstudy?chapterId=*&courseId=*
// @icon         http://file.market.xiaomi.com/thumbnail/PNG/l62/AppStore/0df974411e86ac90526a328899c555f5ada40cb17
// @downloadURL https://update.greasyfork.org/scripts/434917/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%B5%84%E6%BA%90%E5%97%85%E6%8E%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/434917/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%B5%84%E6%BA%90%E5%97%85%E6%8E%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //官方暴露的资源下载接口，需要传入资源id
    var api='https://cs-ans.chaoxing.com/download/';

    //用于显示资源的列表元素
    var list=document.createElement('table');

    var doScan=function(){
        //清空列表
        list.innerHTML='';

        //定位每一个资源所在iframe
        var ifs=document.getElementById('iframe').contentWindow.document.getElementsByTagName('iframe');

        //获取资源信息，并渲染列表
        for(var i=0;i<ifs.length;i++){
            //unicode转中文，并去转义
            var reg = /\\/g;
            var text=unUnicode(ifs[i].getAttribute('data')).replace(reg,'');

            //解析json
            var obj=JSON.parse(text);

            //通过资源id生成当前资源的下载链接
            var url=api+obj.objectid;

            //渲染列表
            var line=document.createElement('tr');
            var type=document.createElement('td');
            var name=document.createElement('td');
            var namea=document.createElement('a');
            var size=document.createElement('td');

            type.innerText=obj.type.replace('.','');
            namea.innerText=obj.name;
            namea.href=url;
            size.innerText=obj.hsize;

            type.style='padding:2px; border: 1px solid black;';
            name.style='padding:2px; border: 1px solid black; color:blue; cursor:pointer ';
            namea.style='color:blue; cursor:pointer ';
            size.style='padding:2px; border: 1px solid black;';

            line.appendChild(type);
            name.appendChild(namea);
            line.appendChild(name);
            line.appendChild(size);

            list.appendChild(line);
        }
    };

    //unicode转中文
    function unUnicode(str){
        str = str.replace(/(\\u)(\w{1,4})/gi,function($0){
            return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g,"$2")),16)));
        });
        str = str.replace(/(&#x)(\w{1,4});/gi,function($0){
            return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g,"$2"),16));
        });
        str = str.replace(/(&#)(\d{1,6});/gi,function($0){
            return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g,"$2")));
        });

        return str;
    }

    //首次加载渲染
    window.onload=function render(){
        var container=document.createElement('div');
        var btnScan=document.createElement('button');
        var boxCtrl=document.createElement('div');
        var btnHide=document.createElement('button');
        var mainBlock=document.getElementById('mainid');

        btnScan.style='width: 60px;';
        btnScan.innerText='嗅探';
        btnScan.onclick=doScan;

        btnHide.style='width: 60px;';
        btnHide.innerText='收起';
        btnHide.onclick=function(){list.innerHTML='';};

        container.style='font-size:14px; display:flex; flex-direction:column; align-items:center;';

        boxCtrl.appendChild(btnScan);
        boxCtrl.appendChild(btnHide);
        container.appendChild(boxCtrl);
        container.appendChild(list);
        mainBlock.parentElement.insertBefore(container,mainBlock);

        doScan();
    }
})();