// ==UserScript==
// @name        精简csdn，知乎自动点击跳转
// @namespace    http://tampermonkey.net/
// @version      0.42
// @description  按下按钮一键隐藏csdn搜索框以及一些没有用的东西，帮您沉浸式学习当前页面内容，最重要的是粉色！
// @author       Onion
// @include      *://blog.csdn.net/*/article/details/*
// @include      *.blog.csdn.net/article/details/*
// @include      *//link.zhihu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442017/%E7%B2%BE%E7%AE%80csdn%EF%BC%8C%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/442017/%E7%B2%BE%E7%AE%80csdn%EF%BC%8C%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button_1 = document.createElement("button"); //创建一个按钮
    button_1.textContent = "隐藏"; //按钮内容
    button_1.style.width = "80px"; //按钮宽度
    button_1.style.height = "28px"; //按钮高度
    button_1.style.align = "center"; //居中
    button_1.style.color = "#white"; //按钮文字颜色
    button_1.style.background = "#FFDDEE"; //按钮底色
    button_1.addEventListener("click", clickButton_1)

    var button_2 = document.createElement("button"); //创建第二个按钮
    button_2.textContent = "显现"; //按钮内容
    button_2.style.width = "80px"; //按钮宽度
    button_2.style.height = "28px"; //按钮高度
    button_2.style.align = "center"; //居中
    button_2.style.color = "#white"; //按钮文字颜色
    button_2.style.background = "#FFDDEE"; //按钮底色
    button_2.addEventListener("click", clickButton_2)

    function clickButton_1()
    {
        setTimeout(function() {
            //上方
            document.getElementById('toolbar-search-input').style.visibility = 'hidden';
            document.getElementById('toolbar-search-button').style.visibility = 'hidden';
            document.getElementById('csdn-toolbar').style.visibility = 'hidden';
            //左侧
            document.getElementById('asideNewComments').style.display = 'none';
            document.getElementById('asideHotArticle').style.display = 'none';
            document.getElementById('asideArchive').style.display = 'none';
            document.getElementById('asideNewNps').style.display = 'none'
            //下方
            document.getElementById('csdn-copyright-footer').style.visibility = 'hidden';


            //           document.getElementById('asideProfile').style.visibility = 'hidden';
        }, 100);// 100ms后执行

    }
    function clickButton_2()
    {
        setTimeout(function() {
            document.getElementById('toolbar-search-input').style.visibility = 'visible';
            document.getElementById('toolbar-search-button').style.visibility = 'visible';
            document.getElementById('csdn-toolbar').style.visibility = 'visible';
            //
            document.getElementById('asideNewComments').style.display = 'inline';
            document.getElementById('asideHotArticle').style.display = 'inline';
            document.getElementById('asideArchive').style.display = 'inline';
            document.getElementById('asideNewNps').style.display = 'inline'
            //
            document.getElementById('csdn-copyright-footer').style.visibility = 'visible';

        }, 100);// 100ms后执行

    }
    //按钮代码之一
    var toolboxclass = document.getElementsByClassName('toolbox-list')[0];
    toolboxclass.appendChild(button_1);
    toolboxclass.appendChild(button_2);//添加到子列
    //
    //粉色！！！！
    //其他脚本创建的ID粉色
    /*
    setTimeout(function() {
    document.getElementById('recommendSwitch').style.backgroundColor='pink';
        }, 100);

    var temp1 = document.getElementsByClassName("left-toolbox");
    for (var i = 0; i < temp1.length; i++) {
        temp1[i].style.backgroundColor = "#FFDDEE";
    }

    var temp2 = document.getElementsByClassName("blog-content-box");
    for (var k = 0; k < temp2.length; k++) {
        temp2[k].style.backgroundColor = "#FFDDEE";
    }
    //
    var temp3 = document.getElementsByClassName("blog_container_aside");

    for (var j = 0; j < temp3.length; j++) {
        temp3[j].style.backgroundColor = "#FFDDEE";
    }

    var temp4 = document.getElementsByClassName("article-header-box");

    for (var m = 0; m< temp4.length; m++) {
        temp4[m].style.backgroundColor = "#FFDDEE";
    }
    //
    var temp5 = document.getElementsByClassName("prettyprint");

    for (var n= 0; n < temp5.length; n++) {
        temp5[n].style.backgroundColor = "#FFDDEE";
    }
    var temp6 = document.getElementsByClassName("prism language-javascript has-numbering");

    for (var o= 0; o < temp6.length; n++) {
        temp6[o].style.backgroundColor = "#FFDDEE";
    }7

     var temp7 = document.getElementsByClassName("blog-content-box");

    for (var p= 0; p< temp7.length; p++) {
        temp7[p].style.backgroundColor = "#FFDDEE";
    }

    //知乎自动跳转
     document.querySelector('[class = "button"]').click();
*/
    //   var arraytemp=["temp1","temp2","temp3","temp4","temp5"];
    //  console.log(arraytemp[0]);
    // 循环代码实现
    var array=["toolbox-list","blog-content-box","blog_container_aside","article-header-box","prettyprint","prism language-javascript has-numbering","blog-content-box","left-toolbox","more-toolbox-new"];
    for (var v=0;v<array.length-1;v++){
        var tempx= document.getElementsByClassName(array[v]);
        for(var i=0; i< tempx.length;i++){
            tempx[i].style.backgroundColor="#FFDDEE";
        }
    }
    console.log(array.length);


    //console.log(array[1]);
    //       console.log(arraytemp[1]);



    //想要通过双重循环来做到的，失败了，不知道为甚莫qaq
    //3.29更新解决了这个问题，大幅精简了代码

    /* var divsToHide = document.getElementsByClassName("blog_container_aside");
                    for(var k = 0; k < divsToHide.length; k++){
                        divsToHide[k].style.visibility = "hidden";
                    }
    document.querySelectorAll('.blog_container_aside').forEach(function(el) {
   el.style.display = 'none';
});真的看不懂了，不动它能隐藏，稍微移动一下就回去了*/

})();
// document.getElementById('nav-searchform').style.visibility='hidden';