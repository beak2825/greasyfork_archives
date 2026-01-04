// ==UserScript==
// @name         AC-baidu的搜索引擎样式再优化,对视觉中心优化-------请额外下载AC-baidu,此功能在AC-baidu基础上进行样式优化.
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  百度第一页查询csdn橙色,知乎蓝色,豆瓣绿色,百度灰色
// @author       白水
// @match        https://www.baidu.com/s?*
// @match        https://*/search?*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.js
// @home-url     https://greasyfork.org/zh-CN/scripts/418404
// @downloadURL https://update.greasyfork.org/scripts/418404/AC-baidu%E7%9A%84%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E6%A0%B7%E5%BC%8F%E5%86%8D%E4%BC%98%E5%8C%96%2C%E5%AF%B9%E8%A7%86%E8%A7%89%E4%B8%AD%E5%BF%83%E4%BC%98%E5%8C%96-------%E8%AF%B7%E9%A2%9D%E5%A4%96%E4%B8%8B%E8%BD%BDAC-baidu%2C%E6%AD%A4%E5%8A%9F%E8%83%BD%E5%9C%A8AC-baidu%E5%9F%BA%E7%A1%80%E4%B8%8A%E8%BF%9B%E8%A1%8C%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/418404/AC-baidu%E7%9A%84%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E6%A0%B7%E5%BC%8F%E5%86%8D%E4%BC%98%E5%8C%96%2C%E5%AF%B9%E8%A7%86%E8%A7%89%E4%B8%AD%E5%BF%83%E4%BC%98%E5%8C%96-------%E8%AF%B7%E9%A2%9D%E5%A4%96%E4%B8%8B%E8%BD%BDAC-baidu%2C%E6%AD%A4%E5%8A%9F%E8%83%BD%E5%9C%A8AC-baidu%E5%9F%BA%E7%A1%80%E4%B8%8A%E8%BF%9B%E8%A1%8C%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

//--------------常用封装--------------------
//写入JQuery 3.5.1
//(function(url) { document.body.appendChild(document.createElement('script')).src = url; })("https://code.jquery.com/jquery-3.5.1.js");
//var $;//不能写入
//写入以下的var,太多方法没啥必要
//(function(textContent) { document.body.appendChild(document.createElement('script')).textContent = textContent; })(usefulVar);
//--------------定义--------------
var host = window.location.host, //host
    href = window.location.href; //href
/** get 指定JS querySelector的对象,返回一个对象
 * @param {*} querySelector JS 选择器
 */
function getByQuerySelector(querySelector) {
    if (!document.querySelector(querySelector)) return false;
    return document.querySelector(querySelector);
}
/** get 指定id属性值的对象,返回一个对象
 * @param {*} Id
 */
function getById(Id) {
    if (!document.getElementsById(Id)) return false;
    return document.getElementsById(Id);
}
/**get 指定TagName的对象 ,返回一个数组
 * @param {*} TagName 指定tag的对象
 */
function getByTagNameArr(TagName) {
    if (!document.getElementsByTagName(TagName)) return false;
    return document.getElementsByTagName(TagName);
}
/** get 指定Name属性的对象，返回一个数组
 * @param {*} Name 指定Name的对象
 */
function getByNameArr(Name) {
    if (!document.getElementsByName(Name)) return false;
    return document.getElementsByName(Name);
}
/** get 指定ClassName的对象，返回一个数组//仅仅缩写
 * @param {*} ClassName 类名称
 */
function getByClassNameArr(ClassName) {
    if (!document.getElementsByClassName(ClassName)) {
        console.log("getByClassNameArr Error 无法使用");
        return document.getElementsByClassName(ClassName);
    } //几乎百分百不会触发???
    else if (document.getElementsByClassName.length == 0) {
        console.log("错误:CRemove不存在;返回值:" + document.getElementsByClassName(ClassName) + "参数:" + ClassName);
        return document.getElementsByClassName(ClassName);
    } else {
        return document.getElementsByClassName(ClassName);
    }
}
/** get 筛选指定ClassName,利用getByClassNameArr数组返回一个数组
 * @param {*} ClassName 类名称
 */
function getClassUniqueArr(ClassName) {
    var oElements = getByClassNameArr(ClassName),
        boxArr = new Array();
    for (var i = 0, len = oElements.length; i < len; i++) {
        if (oElements[i].className == ClassName) {
            boxArr.push(oElements[i]);
        }
    }
    return boxArr;
}

function QRemove(querySelector) {
    if (!getByQuerySelector(querySelector)) console.log("错误:QRemove不存在;返回值:" + getByQuerySelector(querySelector) + "参数:" + querySelector);
    else getByQuerySelector(querySelector).remove();
}

function CRemove(ClassName) {
    if (getByClassNameArr(ClassName).length == 0) console.log("错误:CRemove不存在;返回值:" + getByClassNameArr(ClassName) + "参数:" + ClassName);
    else if (getByClassNameArr(ClassName).length == 1) getByClassNameArr(ClassName)[0].remove(); //唯一
    else {
        console.log("提示:CRemove不唯一;返回值:" + getByClassNameArr(ClassName) + "参数:" + ClassName);
        ArrRomve(getByClassNameArr(ClassName));
    }
}

function ParentRemoveByCRemove(ClassName) {
    if (getByClassNameArr(ClassName).length == 0) console.log("错误:ParentRemoveByCRemove不存在;返回值:" + getByClassNameArr(ClassName) + "参数:" + ClassName); //居然回传了个自己,淦了
    else if (getByClassNameArr(ClassName).length == 1) getByClassNameArr(ClassName)[0].parentElement.remove(); //唯一
    else {
        console.log("提示:ParentRemoveByCRemove不唯一;返回值:" + getByClassNameArr(ClassName) + "参数:" + ClassName);
        for (var i = getByClassNameArr(ClassName).length - 1; i > 0; i--) {
            getByClassNameArr(ClassName)[i].parentElement.remove();
        }
    }
}

/** 倒序遍历删除编辑按钮
 * @param {*} getByArr getBy系列Arr
 */
function ArrRomve(Arr) {
    if (Arr.length == 0) console.log("错误:ArrRomve不存在;返回值:" + ArrRomve(Arr) + "参数:" + Arr);
    else {
        for (var i = Arr.length - 1; i > 0; i--) {
            Arr[i].remove();
        }
    }
}

/* 
Element.prototype.remove = function() {
    //   像那些属性节点，注释节点，文本节点等等根本不可能做父节点，所以可以说parentNode返回的一般都是父元素节点====一直没有判断这个节点是否存在
    //if (!this) return false;
    //if (!this.parentNode) return false;
    this.parentNode.removeChild(this); //父元素节点里删除调用者
};
 */
/* 
HTMLCollection.prototype.remove = function() {
    //   像那些属性节点，注释节点，文本节点等等根本不可能做父节点，所以可以说parentNode返回的一般都是父元素节点====一直没有判断这个节点是否存在
    //if (this) return false; //HTMLCollection [] 必定存在
    if (this.length == 0) return false; //不存在
    //if (!this.parentNode) return false;
    this.parentNode.removeChild(this); //父元素节点里删除调用者
}; 
*/
//--------------Function--------------
//--------------常用封装--------------------


(function() {
    'use strict';
    //运行逻辑 host.includes (t/f) func(){ (remove,ColorChange)}
    //搜索主页_主程序
    function SearchIndex() {
        //百度搜索
        function baidu() {
            QRemove("#content_right"); //删除右边推荐栏目
            QRemove("#s_tab"); //头部删除
            QRemove("#foot"); //脚注去除
            QRemove("#rs"); //相关搜索去除???去除之可能会出现不会自动翻页的情况
            if (getByQuerySelector("#container")) { getByQuerySelector("#container").style.padding = "110px"; } //头部距离改为110px
            if (getByQuerySelector("#container > div.head_nums_cont_outer.OP_LOG.new_head_nums_cont_outer > div > div.nums.new_nums > span")) { getByQuerySelector("#container > div.head_nums_cont_outer.OP_LOG.new_head_nums_cont_outer > div > div.nums.new_nums > span").style.color = "black"; } //搜索数量改为黑色
            //保留百科/翻译/贴吧
            function baiduArrRomve(getByArr) {
                if (getByArr.length == 0) return console.log(getByArr + "不存在");
                //倒序遍历删除编辑按钮
                //xpath-log.children[0] == "H3"; 普通op.children[0] == "DIV" 普通op.children[0].children[0] == "H3".
                for (var i = getByArr.length - 1; i >= 0; i--) {
                    //使用else if可以不写continue,if是无论如何都继续执行
                    if (getByArr[i].children[0].innerText.includes("其他人还在搜")) getByArr[i].remove();
                    else if (getByArr[i].children[0].innerText.includes("百度百科"));
                    else if (getByArr[i].children[0].innerText.includes("百度翻译"));
                    else if (getByArr[i].children[0].innerText.includes("百度贴吧"));
                    else getByArr[i].remove();
                }
            }
            console.log("准备变颜色");
            baiduArrRomve(getByClassNameArr("result-op")); //删除百度产品
        }
        //谷歌搜索
        function google() {
            //冰雪奇缘参考 https://www.google.com/search?q=%E5%86%B0%E9%9B%AA%E5%A5%87%E7%BC%98
            console.log("google");
            QRemove("#botstuff"); //相关
            CRemove("yp1CPe"); //电影推荐
            ParentRemoveByCRemove("HD8Pae"); //删除Video,占大部分的还是youtube
            //CRemove("liYKde"); //删除右侧栏
            if (getByClassNameArr("sfbg")[0]) getByClassNameArr("sfbg")[0].style.background = "rgba(255, 255, 255, 0.5)"; //顶部搜索半透明化
            if (getByClassNameArr("yg51vc")[0]) getByClassNameArr("yg51vc")[0].style.background = "rgba(255, 255, 255, 0.5)"; //顶部more搜索半透明化
        }
        //必应搜索
        function bing() {
            if (document.querySelector("#b_header")) document.querySelector("#b_header").style.background = "rgba(255, 255, 255, 0.5)"; //头部透明
            ParentRemoveByCRemove("b_rs"); //删除相关搜索test
            //CRemove("b_rs"); //删除相关搜索test
            //CRemove("b_ans"); //删除相关搜索
        }
        //改变颜色
        function ColorChange(childrenClassName, parentClassName) {
            var SearchUrlArr = [
                { name: "CSDN|csdn", color: "rgb(252,180,62,0.5)" },
                { name: "简书|jianshu", color: "rgb(229,96,72,0.5)" },
                { name: "知乎|zhihu", color: "rgb(65,105,225,0.5)" },
                { name: "博客园|cnblogs", color: "rgb(240,0,0,0.5)" },
                { name: "豆瓣|douban", color: "rgb(46,139,87,0.5)" },
                { name: "百度|baidu", color: "rgb(165,165,165,0.5)" },
                { name: "腾讯|qq", color: "rgb(165,165,165,0.5)" },
                { name: "搜狐|sohu", color: "rgb(165,165,165,0.5)" },
                { name: "163.com|网易", color: "rgb(165,165,165,0.5)" },
                { name: "github|Github", color: "rgb(0,0,0,0.5)" },
                { name: "gitee|码云", color: "rgb(0,0,0,0.5)" },
                { name: "oschina|开源中国", color: "rgb(0,0,0,0.5)" },
                { name: "stackoverflow|栈溢出", color: "rgb(0,0,0,0.5)" },
                { name: "smzdm|值得买", color: "rgb(165,165,165,0.5)" },
                { name: "taobao|淘宝", color: "rgb(165,165,165,0.5)" },
                { name: "tmall|天猫", color: "rgb(165,165,165,0.5)" },
                { name: "jd.com|京东", color: "rgb(165,165,165,0.5)" },
            ];
            //定义子元素集合
            //可以先使用getArr而非指定某种标签
            var c = getByClassNameArr(childrenClassName),
                p; //位置不定, 通过for循环获得p
            for (var i = 0, ilen = c.length; i < ilen; i++) {
                //向上查找, 指定[自身?]父元素,百度才需要查找父元素???
                if (c[i].parentNode.className === parentClassName) {
                    p = c[i].parentNode;
                    //console.log("1");
                } else if (c[i].parentNode.parentNode.className === parentClassName) {
                    p = c[i].parentNode.parentNode;
                    //console.log("2");
                } else if (c[i].parentNode.parentNode.parentNode.className === parentClassName) {
                    p = c[i].parentNode.parentNode.parentNode;
                    //console.log("3");
                } else if (c[i].parentNode.parentNode.parentNode.parentNode.className === parentClassName) {
                    p = c[i].parentNode.parentNode.parentNode.parentNode;
                    //console.log("4");
                } else {
                    p = c[i].parentNode;
                    //console.log("1");
                    console.log(c + "找不到父元素");
                }
                //p.style.background = "rgb(255,255,255,0.5)"
                for (var j = 0, jlen = SearchUrlArr.length; j < jlen; j++) {
                    if (RegExp(SearchUrlArr[j].name).test(c[i].textContent)) {
                        //使用 innerText innerHtml 而非 text????   nocde.textContent
                        p.style.background = SearchUrlArr[j].color;
                        //console.log("j--1");
                        break;
                    }
                    if (j == jlen - 1) {
                        //console.log("j--2");
                        p.style.background = "rgb(255,255,255,0.5)";
                        break;
                    }
                }
                //console.log("j--3");
                /*
                if (j == jlen) {
                    //恒等于最后一次输出即为 j=jlen;
                    //p.style.background = "rgb(255,255,255,0.5)";
                }
                */
            }
        }
        if (host.includes("baidu")) {
            baidu();
            ColorChange("c-showurl c-color-gray", "result c-container new-pmd");
        } else if (host.includes("google")) {
            google();
            ColorChange("rc", "g");
        } else if (host.includes("bing")) {
            bing();
            ColorChange("b_attribution", "b_algo");
        } else {
            console.log("不存在");
        }
    }
    //主程序 延迟
    //window.onload = function() { setTimeout(SearchIndex(), 0); };
    //jQuery预载画面
    var $ = jQuery.noConflict(true);
    $(document).ready(SearchIndex());
})();