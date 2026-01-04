// ==UserScript==
// @name         更换背景和字体，使屏幕适合于长时间阅读
// @namespace    https://greasyfork.org/zh-CN/
// @namespace    https://greasyfork.org/zh-CN/scripts/510009-%E6%9B%B4%E6%8D%A2%E8%83%8C%E6%99%AF%E5%92%8C%E5%AD%97%E4%BD%93-%E4%BD%BF%E5%B1%8F%E5%B9%95%E9%80%82%E5%90%88%E4%BA%8E%E9%95%BF%E6%97%B6%E9%97%B4%E9%98%85%E8%AF%BB
// @version      0.2
// @description  自定义背景图片和字体大小，使屏幕适合于长时间阅读
// @author       bobo
// @license           MIT License
// @match             *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510009/%E6%9B%B4%E6%8D%A2%E8%83%8C%E6%99%AF%E5%92%8C%E5%AD%97%E4%BD%93%EF%BC%8C%E4%BD%BF%E5%B1%8F%E5%B9%95%E9%80%82%E5%90%88%E4%BA%8E%E9%95%BF%E6%97%B6%E9%97%B4%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/510009/%E6%9B%B4%E6%8D%A2%E8%83%8C%E6%99%AF%E5%92%8C%E5%AD%97%E4%BD%93%EF%BC%8C%E4%BD%BF%E5%B1%8F%E5%B9%95%E9%80%82%E5%90%88%E4%BA%8E%E9%95%BF%E6%97%B6%E9%97%B4%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

//var u_ff_a1="https://pic.616pic.com/ys_bnew_img/00/42/01/uEX65LijKT.jpg";
//var u_ff_a1="https://pic.52112.com/180529/JPG-180529_482/Fb7eLoSHq4_small.jpg";

////var u_ff_a1="https://pic.nximg.cn/file/20200924/28368347_050933634082_2.jpg";
//下面这是背景图片的url
var u_ff_a1="https://img.tukuppt.com/ad_preview/00/31/08/5fab44b267fdb.jpg!/fw/980";


var u_ff_a="file://d:/soft/ff/b0.jpg";
var u_ff_b="url('"+u_ff_a1+"')";

(function() {
    'use strict';
    // Your code here...

    //等页面加载完成执行下一页扫描
    //init3333();

    if (window.addEventListener)
    { window.addEventListener("load", init3333, false);}
    else if (window.attachEvent)
    { window.attachEvent("onload", init3333);}
    else window.onload = init3333;

/////////////////////////////////////////////////////////

      if (window.addEventListener){
    window.addEventListener('keydown', function(event) {
        if (event.code === 'KeyN') { // 检查是否按下了n键
            init3333();
            console.log("N键被按下了！");
            //alert("dddddddddd按了空格");

        }
    }, true);
      }
    else alert("事件监听失败dd按了空格");





    /*     document.onreadystatechange = function() 　　//当页面加载状态改变的时候执行function
    {
        if(document.readyState == "complete")

        { 　　//当页面加载状态为完全结束时进入
            //document.getElementById("content").style.fontSize ="34px";

            //alert("dddddddddd");
            init3333();　　 //你要做的操作。
            setTimeout(init3333, 1000);

        }
    }
 */
    function init3333(){
        console.error("dddddd背景色透明ddddddd");
        var allElements = document.getElementsByTagName("*");

        for (var i = 0, length = allElements.length; i < length; i++) {
             allElements[i].style.background = "none";
        }
        document.body.style.backgroundSize = "cover";
    // 将背景图片居中显示
    document.body.style.backgroundPosition = "center";
    // 确保背景图片不重复显示
    document.body.style.backgroundRepeat = "no-repeat";
    // 设置背景图片固定在视口上
    document.body.style.backgroundAttachment = "fixed";

        document.body.style.backgroundImage = u_ff_b;

        var oDivCCC=document.getElementById("content")
        if (oDivCCC!= null)oDivCCC.style.fontSize ="22px";

        var oDivCCC2=document.getElementById("articlecontent")
        if (oDivCCC2!= null){oDivCCC2.style.fontSize ="22px";oDivCCC2.style.color="#000000" ;}
        //
        var oDiv=document.getElementsByTagName('DIV');
        var i2=0;
        while(i2<oDiv.length)
        {
            //oDiv[i2].style.background = "none";
            //1更改字体导致番茄小说的显示变回默认的乱码
            //很明显番茄在网页里使用了特殊的非标准字体，来把乱码变成可读
            // 你可以更改成你喜欢的字体,或者注释掉下面这行
            //oDiv[i2].style.fontFamily ="Microsoft YaHei";
            //oDiv[i2].style.fontSize ="24px";
            oDiv[i2].style.backgroundColor="transparent" ;
            oDiv[i2].style.color="#000000" ;
            //document.body.style.backgroundImage="url('http://127.0.0.1/j/t9a.jpg')";

            i2++;
        }
    }
    //   alert("ppppppppppp");
})();