// ==UserScript==
// @name         搜索
// @namespace    n/a
// @version      1.23.5
// @description  洛谷题目快捷搜索
// @author       SCP982
// @match        https://www.luogu.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476861/%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/476861/%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function(){
    'use strict';
    //以这个作为基础，就是查题的网址前缀，单输没用
    var add = "https://www.luogu.com.cn/problem";
    function get(){
        //document.getElementsByClassName()方法返回文档中所有指定类名的元素集合，作为NodeList对象
        //NodeList 对象代表一个有顺序的节点列表。 NodeList对象，我们可以通过节点列表中的节点索引号来访问列表中的节点(索引号从0开始)
        //提示：你可以使用NodeList对象的length属性来确定指定类名的元素个数，并循环各个元素来获取你需要的那个元素
        var tar = document.getElementsByClassName("am-form-field")[0].value;
        if(tar === "")return;
        //adress
        var ad = add + "/list?keyword=" + tar + "&content=false";
        location.href = ad;
    }
    function sName(){
        //看不懂的自己去洛谷首页源代码里找，是个类名
        var tar = document.getElementsByClassName("am-form-field")[0].value;
        if(tar === "")return;
        var targ = tar.toUpperCase();
        var asd = add;
        //截取部分关键词
        //洛谷的题号格式
        if(tar.match(/^[1-9][0-9][0-9][0-9]+$/) == tar)asd = asd + "/P" + tar;
        //cf题单的题号
        else if(targ.match(/^[0-9]+[A-Z][0-9]?$/) == targ)asd = asd + "/CF" + targ;
        //所有洛谷本身的前缀
        else if(targ.match(/^(?:U|P|T|CF|SP|AT|UVA)[0-9]+[A-Z]?[0-9]?$/) == targ)asd = asd + "/" + targ;
        //搜一下前面求出来的题号有没有
        else asd = add + "/list?keyword=" + tar + "&content=false";
        location.href = asd;
    }
    //弄一个按钮“搜索”
    var button = document.createElement("button");
    button.className = "am-btn am-btn-success am-btn-sm";
    button.name = "search";
    button.id = "search";
    button.innerHTML = "搜索";
    button.onclick = function(){get();};
    //取到爹
    var locations=document.getElementsByClassName("lg-index-content")[0].getElementsByClassName("lg-article lg-index-stat")[0].getElementsByClassName("am-btn am-btn-danger am-btn-sm")[0].parentNode;
    locations.appendChild(button);
    //重新命名这个栏目
    document.getElementsByClassName("am-form-field")[0].placeholder = "输入题号或题目名";
    document.getElementsByClassName("am-form-field")[0].onkeyup = function(event){if(event.keyCode === 13){sName();}};
    document.getElementsByClassName("lg-article lg-index-stat")[0].getElementsByTagName("h2")[0].innerHTML = "输入题号或名字跳转";
})();