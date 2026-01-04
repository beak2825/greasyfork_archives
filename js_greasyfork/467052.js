// ==UserScript==
// @name         lszjxjy专业技术人员继续教育网-四川凉山-秒刷视频vx:shuake345
// @namespace    vx:shuake345
// @version      0.2
// @description  需要代刷视频的请加vx:shuake345
// @author       vx:shuake345
// @match        *://web.chinahrt.com/*
// @match        *://*.lszjxjy.com/home/Index/home.html
// @icon         https://www.google.com/s2/favicons?domain=chinahrt.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467052/lszjxjy%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91-%E5%9B%9B%E5%B7%9D%E5%87%89%E5%B1%B1-%E7%A7%92%E5%88%B7%E8%A7%86%E9%A2%91vx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/467052/lszjxjy%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91-%E5%9B%9B%E5%B7%9D%E5%87%89%E5%B1%B1-%E7%A7%92%E5%88%B7%E8%A7%86%E9%A2%91vx%3Ashuake345.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // You
    var 选择='B'//——————————在这里修改ABCD来修改单选题
    var 对错="1"//——————————在这里修改1=正确，0=错误。来修改判断题


    //！！！！！！！！！！！！——————————————————————————————————————
    function ks(){
        if(document.URL.search('myexam')>1){
            var imgs=document.getElementsByClassName('el-radio__original')
            for (var i=0;i<imgs.length;i++){
                if(imgs[i].value==选择 || imgs[i].value==对错){
                    imgs[i].click()
                }
            }
            /*setTimeout(function (){document.getElementsByClassName('push-button cb tc')[0].click()
                              document.getElementsByClassName('el-button el-button--default el-button--small el-button--primary ')[0].click()
                              },1000)*/
        }
    }
    setInterval(ks,800)
    function duoxuan(){
        var imgs=document.getElementsByClassName('el-checkbox')
        var i=-1
        while(i<imgs.length){
            i++
            if(imgs[i].className.search('is')==-1){//document.getElementsByClassName('el-checkbox')[0].className.search("is")>1
                imgs[i].click()
            }
        }
    }
    setInterval(duoxuan,200)


})();