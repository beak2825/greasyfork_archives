// ==UserScript==
// @name         Clean csdn blog 清爽阅读博客
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  烦人的半屏顶部广告和左侧栏位都去掉了
// @author       Zszen
// @match        https://blog.csdn.net/*
// @match        https://www.cnblogs.com/*/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429112/Clean%20csdn%20blog%20%E6%B8%85%E7%88%BD%E9%98%85%E8%AF%BB%E5%8D%9A%E5%AE%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/429112/Clean%20csdn%20blog%20%E6%B8%85%E7%88%BD%E9%98%85%E8%AF%BB%E5%8D%9A%E5%AE%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //移除代码
    var links=document.getElementsByTagName("link");
    for(var i=0;i<links.length;i++){
        if(links[i].href.indexOf('skin-whitemove')>=0){
            links[i].href = "";
            break;
        }
    }

    //移除区域
    rm_el({
        'csdn-toolbar':'id',
        'blog_container_aside':'class',
        'left-toolbox':'class',
        'canvas':'tag',
    })
    document.getElementsByClassName('main_father')[0].className = 'abc'
    document.getElementsByClassName('container')[0].style.width = '800px'
    //document.getElementById('csdn-toolbar').style.display='none'
    //document.getElementsByClassName('blog_container_aside')[0].style.display='none'
    function rm_el(dic){
        for(var key in dic){
            var tar = null
            try{
                switch(dic[key]){
                    case 'id':
                        tar = document.getElementById(key)
                        break
                    case 'class':
                        tar = document.getElementsByClassName(key)[0]
                        break
                }
            }catch(e){
                console.log(e)
            }
            if(tar!=null){
                tar.style.display='none'
                tar.parentElement.removeChild(tar)
            }
        }


    }
    // Your code here...
})();