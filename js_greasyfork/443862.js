// ==UserScript==
// @name         福利吧百家姓转磁力地址工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  百家姓地址转换为磁力地址
// @author       fuliba
// @match        https://www.wnflb99.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443862/%E7%A6%8F%E5%88%A9%E5%90%A7%E7%99%BE%E5%AE%B6%E5%A7%93%E8%BD%AC%E7%A3%81%E5%8A%9B%E5%9C%B0%E5%9D%80%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/443862/%E7%A6%8F%E5%88%A9%E5%90%A7%E7%99%BE%E5%AE%B6%E5%A7%93%E8%BD%AC%E7%A3%81%E5%8A%9B%E5%9C%B0%E5%9D%80%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function bj(){
        //1利用createTextNode()创建一个文本对象
        var a = document.createElement("input");
        a.id = "a"
        a.type = "input";
        a.value = "在这里输入百家姓";
        a.style="width:400px;left:1051px;visibility:visible;"
        //2获取div对象
        var node1=document.getElementById("toptb");
        //添加成div对象的孩子
        node1.appendChild(a);
        //1,利用createElement（）创建一个标签对象
        var b=document.createElement("input");
        b.type="button";
        b.value="百家姓转磁力链接";
        b.style="width:400px;left:1051px;visibility:visible;"
        //2,获得div对象
        //添加成div对象的孩子
        node1.appendChild(b);
        //1利用createTextNode()创建一个文本对象
        var c = document.createElement("input");
        c.id = "c"
        c.type = "input";
        c.style="width:400px;left:1051px;visibility:visible;"
        //2获取div对象
        //添加成div对象的孩子
        node1.appendChild(c);
        var t = 'magnet:?xt=urn:btih:';
        var obja = {
            "赵":"0", "钱":"1", "孙":"2", "李":"3", "周":"4", "吴":"5", "郑":"6", "王":"7", "冯":"8", "陈":"9",
            "褚":"a", "卫":"b", "蒋":"c", "沈":"d", "韩":"e", "杨":"f", "朱":"g", "秦":"h", "尤":"i", "许":"j",
            "何":"k", "吕":"l", "施":"m", "张":"n", "孔":"o", "曹":"p", "严":"q", "华":"r", "金":"s", "魏":"t",
            "陶":"u", "姜":"v", "戚":"w", "谢":"x", "邹":"y", "喻":"z", "福":"A", "水":"B", "窦":"C", "章":"D",
            "云":"E", "苏":"F", "潘":"G", "葛":"H", "奚":"I", "范":"J", "彭":"K", "郎":"L", "鲁":"M", "韦":"N",
            "昌":"O", "马":"P", "苗":"Q", "凤":"R", "花":"S", "方":"T", "俞":"U", "任":"V", "袁":"W", "柳":"X",
            "唐":"Y", "罗":"Z", "薛":".", "伍":"-", "余":"_", "米":"+", "贝":"=", "姚":"/", "孟":"?", "顾":"#",
            "尹":"%", "江":"&", "钟":"*"
        };
        b.addEventListener("click", function() {
            var str = document.getElementById("a").value;
            str=str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            var strc = str.split("");
            var c = '';
            for(var i=0;i<strc.length;i++){
                var o= cy(obja,strc[i]);
                c +=o;
            }
            c=t+c;
            document.getElementById('c').value=c;
        });
        function cy(array,val){
            for( var key in array ){
                if(key==val){
                    return array[key];
                }
            }
            return '';
        }
    }
    bj();
})();