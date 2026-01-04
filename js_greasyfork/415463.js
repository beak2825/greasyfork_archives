// ==UserScript==
// @name               qianyix.com_optimization
// @name:zh-CN         qianyix.com单词查询优化
// @namespace          qianyix.com.words
// @version            0.2.6
// @description        simplify www.qianyix.com (remove irrelevant contents, such as ads); add a ru_wiktionary link; convert blanks to <br>; reorder contents
// @description:zh-CN  【已完成】精简www.qianyix.com单词页面（删除无关内容，比如广告和最上方那一栏）；增加到ru_wiktionary的链接；；内容顺序修改(div-id-dict#)，把变格变位移动到基础释义和行业释义中间；行业释义到蓝色链接无效，直接删除；基础释义处反查链接（正则匹配连续俄文字符或者利用空格和方括号分隔）。【待实现】行业释义里li元素的换行符修正（按钮控制）
// @author             Sasha
// @match              *://*.qianyix.com/*
// @downloadURL https://update.greasyfork.org/scripts/415463/qianyixcom_optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/415463/qianyixcom_optimization.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var rmByClassName=function(tmpClassName){
        var tmp=document.getElementsByClassName(tmpClassName)[0];
        if(tmp){
            tmp.parentNode.removeChild(tmp);
        }
    };
    var rmById=function(tmpId){
        var tmp=document.getElementById(tmpId);
        if(tmp){
            tmp.parentNode.removeChild(tmp);
        }
    };
    var addRuLink=function(){
        var h=document.createElement("h1");//创建新的<h1> 元素
        //eg. http://www.qianyix.com/words/index.php?q=%s#dict3
        var curURL=window.location.href;
        var word=curURL.split("/").pop().split("=").pop().split("#")[0];
        var a=document.createElement("a");
        a.setAttribute('href',"https://ru.wiktionary.org/wiki/"+word);
        a.innerHTML=decodeURI(word)+"<br><br>"//把百分号编码转回去
        h.appendChild(a);//向 <h1> 元素追加这个文本节点
        
        //向已有的元素追加这个新元素
        var parentNode=document.getElementsByClassName("result-middle")[0];
        parentNode.prepend(h);
    };
    var addInvSearchLink=function(){
        var dict1=document.getElementById("dict1")
        var target=dict1.childNodes[3];
        //target.childNodes[0].nodeType
        var sub_target;
        var i;
        for(i=0;i<target.childNodes.length-1;i++){//最后一个text节点是空白，刚好插在它前面
            sub_target=target.childNodes[i];
            if(sub_target.nodeType==3){
                var link_qianyi=document.createElement("a");
                var link_ru=document.createElement("a");
                var word=sub_target.data.trim().split("]").pop().split("〉").pop().split(" ").pop().split(",").pop();
                link_qianyi.setAttribute('href',"http://www.qianyix.com/words/index.php?q="+word);
                link_ru.setAttribute('href',"https://ru.wiktionary.org/wiki/"+word);
                link_qianyi.innerHTML="【反查】"
                link_ru.innerHTML="【RU】"
                target.insertBefore(link_qianyi,target.childNodes[i+1])
                target.insertBefore(link_ru,target.childNodes[i+1])
            }
        }
    };
    var mvDict4=function(){
        var parentNode=document.getElementsByClassName("result-middle")[0];
        var dict2=document.getElementById("dict2");
        var dict4=document.getElementById("dict4");
        if(dict4){
            parentNode.removeChild(dict4);
            parentNode.insertBefore(dict4,dict2);
        }
    };
    var classList=new Array("followsinaweibo","contextusqq","contextusweixin","footer-ad-wrap")
    classList.forEach(rmByClassName)
    var idList=new Array("hd","top-ad","tPETrans-type-list")
    idList.forEach(rmById)
    addRuLink();
    mvDict4();
    addInvSearchLink();
})();