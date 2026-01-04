// ==UserScript==
// @name         BiMi去广告脚本
// @namespace    http://bimiacg*.*/*
// @version      2.4
// @description  小庄的脚本园
// @author       zjazn
// @match        *://bimiacg4.net/*
// @match        *://*.bimiacg4.net/*
// @match        *://*.*.bimiacg4.net/*
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @run-at       document-start
// @license MIT 
// @match        <$URL$>
// @downloadURL https://update.greasyfork.org/scripts/434971/BiMi%E5%8E%BB%E5%B9%BF%E5%91%8A%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/434971/BiMi%E5%8E%BB%E5%B9%BF%E5%91%8A%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function () {
    var i=0;
    //脚本框架-自建
    function $(str,two,three) {
            if((typeof str) == "function") {
                 var n = 0;
                 var timeout = setInterval(function() {
                     //关键代码开始
                     if(two != null) {
                         if($(two).exist(three==null?0:three)) {
                             str();
                             clearInterval(timeout);
                         }
                     }else {
                         str();
                     }
                     //关键代码结束
                     n++
                     if(n>12500) {
                         clearInterval(timeout);
                     }

                 },40)
                return;
            }

            let objs = [];
            let objs_str = str.split(",");

            for(var i = 0; i < objs_str.length; i++) {
                var inter = document.querySelectorAll(objs_str[i]);
                for(var j = 0; j < inter.length; j++) {
                    objs[objs.length] = inter[j];
                }
            }

            let ctl = {
                //给元素添加一个监听事件
                listen: function(event,fun) {
                    for(var i = 0; i < objs.length; i++) {
                        objs[i].addEventListener(event, fun);
                    }

                },
                //当存在元素且length大于或等于count时返回true
                exist: function(count) {
                    return (objs[0] != null) && objs.length >=count ;
                },

                css: function(style_str) {
                    for(var i = 0; i < objs.length; i++) {
                        if(objs[i] != null) {
                            objs[i].style=style_str
                        }
                    }
                    return ctl;
                },
                os: objs,
                //将指针转向指定对象的n父对象
                father: function(second, vt) {
                    let fathers = objs;
                    for(var j = 0; j < second; j++) {
                        var new_father = [];
                        for(var i = 0; i < fathers.length; i++) {

                            new_father[new_father.length] = fathers[i].parentNode;//获取a的父节点；
                        }
                        fathers = new_father;
                    }
                    objs = fathers;
                    console.log("最终父节点：",objs);
                    return ctl;
                },
                //排除父子关系
                exfs: function() {
                    for(var i = 0; i < objs.length; i++) {
                           if(objs[i].querySelectorAll(str.split(",")[0]).length > 0) {
                               objs.splice(i, 1);
                               //console.log("存在",objs);
                           }

                    }
                    return ctl;
                }


            }
            return ctl;
     }


    //去广告代码
    $(function() {
          $("#HMRichBox").css("display:none;")
    },"#HMRichBox",1)

    $(function() {
          $(".tuiguang").css("display:none;")
         $("#bkcl").css("display:none");

    },".tuiguang",1)

    $(function() {
          $("#HMcoupletDivleft").css("overflow: hidden;display:none;")
          $("#HMcoupletDivright").css("overflow: hidden;display:none;")

    },"#HMcoupletDivright,#HMcoupletDivleft",1)






})();
