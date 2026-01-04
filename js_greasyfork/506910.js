// ==UserScript==
/*
远程调用代码 ：  	https://greasyfork.org/scripts/441600-jk/code/jk.user.js
php <script src="https://greasyfork.org/scripts/441600-jk/code/jk.user.js<?php echo "?v=".rand(1,10000);?>"></script>
js:
     var url='https://greasyfork.org/scripts/441600-jk/code/jk.user.js';
     el=document.createElement('script');
     el.src=url+'?rnd='+Math.random();
     document.getElementsByTagName("head")[0].appendChild(el); 
*/
//  
// @name            jkQuery
// @namespace       moe.canfire.flf

// @description     jkQuery库(模仿jQuery)
// @author          jk
// @license         MIT
// @match           *

// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_setClipboard
// @grant           GM_xmlhttpRequest
// @grant           GM_info
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @grant           unsafeWindow
// @run-at          document-start
// @connect         *
// @version 0.0.1.20240905080805
// @downloadURL https://update.greasyfork.org/scripts/506910/jkQuery.user.js
// @updateURL https://update.greasyfork.org/scripts/506910/jkQuery.meta.js
// ==/UserScript==
 
 
        //jk模拟jQuery,
        
        //:内部要用的jkQuery合并数组的方法
        function merge(first, second) {
            var l = second.length,
                i = first.length,
                j = 0;
            if (typeof l === "number") {
                for (; j < l; j++) {
                    first[i++] = second[j];
                }
            } else {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }
            first.length = i;
            return first;
        }


        (function (window, undefined) {
            var core_version = "spring v.1",
                core_deletedIds = [],
                core_push = core_deletedIds.push,
                core_slice = core_deletedIds.slice;
            var jkQuery = function (selector) {
                return new jkQuery.fn.init(selector);
            };
            jkQuery.fn = jkQuery.prototype = {
                jkQuery: core_version,//jkQuery版本
                constructor: jkQuery,//覆盖构造函数防止被外部改变
                init: function (selector) {//context,rootjkQuery不传了,稍微看看就懂了
                    //针对不同参数类型进行不同处理方式,如果$("")$(null就直接返回)
                    if (!selector) {
                        //参数不对直接将this返回，想想现在this的值是什么,提示:new init();=>jkQuery.fn.init[0]
                        return this;
                    } else {
                        //如果是字符串juqery会调用查询方法进行查询dom元素(jkQuery调用sizzle专门进行dom解析)
                        var nodes = document.querySelectorAll(selector);//getElementsByName(selector);
						alert(nodes.length);
                        var arr = [];
                        for (var i = 0; i < nodes.length; i++) {
                            arr.push(nodes[i]);
                        }
                        //如果传递了Context上下文，则在context中寻找元素。这里指定位document
                        this.context = document;
                        this[0] = document;
                        //把selector存到jkQuery中
                        this.selector = selector;
                        //jkQuery的合并方法，直接拿出来就能用，合并查询结果
                        var result = merge(this, arr);//this 默认的选择器的一个数组
                        //对处理过的this进行封装返回，注意为了链式调用，都需要返回this
                        return result;
                    }
                },
                selector: "",
                length: 0,
                toArray: function () {
                    return core_slice.call(this);
                },
                get: function (num) {
                    return num == null ?
                        this.toArray() :
                        (num < 0 ? this[this.length + num] : this[num]);
                },
                //这里要注意，想要长得像jkQuery.fn.jkQuery.init[0],并且init方法中的this值为数组就必须加下面这三个字段
                push: core_push,
                sort: [].sort,
                splice: [].splice
            }
            jkQuery.fn.init.prototype = jkQuery.fn;
            if (typeof window === "object" && typeof window.document === "object") {
                window.jkQuery = window.jk = jkQuery;
            }
        }(window));
/*
jk本身是一个对象
jk("selector")其实得到是一个对象数组,本身，也可增加方法
for(let i=0;this.length()
jk.fn.可对选择对象数组处理增加方法

*/
//扩展选择器方法 jk.fn,是一个json, jk.fn['attr']或jk.fn.attr, $(".cls").attr();
jk.fn.each = function ( func ) { 
    for (var i = 0; i < this.length; i++) { //nodes
        func( this[i] ); //HTMLElement
    }
    return this;
};
 
jk.fn.attr = function (name, value) { 
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        if (name && value) {
            item.setAttribute(name, value);
        } else if (name && !value) {
            return item.getAttribute(name); //带取值
        }
    }
    return this;
};
jk.fn.css= function (json_or_str ) { 
    //css({display:'none',height:20px;})   css("display:'none';height:20px;")
    for (var i = 0; i < this.length; i++) {
        if(typeof(json_or_str)=='object'){
            for(var x in json_or_str)  this[i].style[x]=json_or_str[x];
        }
        if(typeof(json_or_str)=='string'){
           this[i].cssText += " ;"+json_or_str;　
        }   
    }
    return this;
};
/*
jk(".test").attr("style","border:1px solid red;")
jk(".test").each(function (){
    this.onclick=function(){alert(1)}
});
//$(".test").attr("value","xxx");
/// alert($(".test").attr("value"));
//=================================================
//jk是一个json,扩展其静态方法	jk.ajax 或 jk['ajax']
jk.ajax2=function(){
    alert("ajax");
}
jk.ajax2();
 
jk('.test')[0].onclick=function(){
   alert(this);
 }
 */