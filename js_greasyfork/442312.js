// ==UserScript==
// @name          SelectorAllClick
// @namespace     https://mc3000
// @version       0.0.2
// @description  练习
// @author       mc3000
// @include      *://*
// @require      https://cdn.staticfile.org/jquery/1.9.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442312/SelectorAllClick.user.js
// @updateURL https://update.greasyfork.org/scripts/442312/SelectorAllClick.meta.js
// ==/UserScript==
(function() {
    var button = document.createElement("button"); //创建一个按钮
    button.textContent = ""; //按钮内容
    button.id = "mc3000but"; //按钮内容
    button.style.width = "32px"; //按钮宽度
    button.style.height = "32px"; //按钮高度
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    //button.style.background = "#e33e33"; //按钮底色

    button.style.borderRadius = "4px"; //按钮四个角弧度
    button.addEventListener("click", clickBotton) //监听按钮点击事件
    button.style.position = "fixed"; //按钮固定在屏幕上
    button.style.bottom = "50px"; //底部边距
    //button.style.right = "10px"; //右部边距
    button.style.left = "1px"; //左部边距
    button.style.zIndex = 99999; //z序
    button.style.backgroundImage="url(https://www.3000sj.com/mc3000/logo.gif)";
    button.style.backgroundrepeat="no-repeat";
    button.style.backgroundColor="transparent";
    button.style.border = "transparent"; //边框属性
    button.style.backgroundSize = "cover"; //边框属性


var input=document.createElement("input");
    input.textContent = ""; //按钮内容
    input.id = "mc3000input"; //按钮内容
    input.style.width = "30px"; //按钮宽度
    input.style.height = "12px"; //按钮高度
    input.style.align = "center"; //文本居中
    input.style.color = "white"; //按钮文字颜色
    input.style.background = "#e33e33"; //按钮底色
    input.style.borderRadius = "4px"; //按钮四个角弧度
    input.style.position = "fixed"; //按钮固定在屏幕上
    input.style.bottom = "35px"; //底部边距
    input.style.left = "1px"; //左部边距
    input.style.zIndex = 99999; //z序
    input.style.border = "none"; //边框属性


var input2=document.createElement("input");
    input2.textContent = ""; //按钮内容
    input2.id = "mc3000input2"; //按钮内容
    input2.style.width = "20px"; //按钮宽度
    input2.style.height = "12px"; //按钮高度
    input2.style.align = "center"; //文本居中
    input2.style.color = "white"; //按钮文字颜色
    input2.style.background = "#e33e33"; //按钮底色
    input2.style.borderRadius = "4px"; //按钮四个角弧度
    input2.style.position = "fixed"; //按钮固定在屏幕上
    input2.style.bottom = "20px"; //底部边距
    input2.style.left = "6px"; //左部边距
    input2.style.zIndex = 99999; //z序
    input2.style.border = "none"; //边框属性
    input2.value = "20"; //边框属性
//var body = document.firstElementChild;
//body.insertBefore(input2, document.body.firstElementChild);
document.body.appendChild(input2);
document.body.appendChild(input);
document.body.appendChild(button);

//    $("body:first").append(button);

    //创建mc3000div元素
    //var mc3000div = document.createElement('div')
    //mc3000div.id = "mc3000div";
    //mc3000div.className = 'mc3000div'
    //mc3000div.innerHTML = "mc3000";
    //document.body.appendChild(mc3000div);
    //     document.getElementsByClassName
    //     document.getSelection()
    //     document.getElementById()
    //     document.body
/*    $(
        '<div style="width: 330px; height: 330px; position: fixed; bottom: 0; right: 0; z-index: 99999;">' +
          '<div>' +
            '<h2>状态面板</h2>' +
            '<div id="tm_status" style="margin-top: 1em;">' +
            '</div>' +
          '</div>' +
        '</div>'
    ).appendTo("body");
*/
//$(button).appendTo("body");
// document.body.appendChild(button);
//document.getElementsByTagName('body')[0].appendChild(button);



    //var like_comment = document.getElementById('mc3000fdiv'); //getElementsByClassName 返回的是数组，所以要用[] 下标
    //var like_comment = document.getElementsByClassName('_th-click-hover _item-input')[0]; //getElementsByClassName 返回的是数组，所以要用[] 下标
    //like_comment.appendChild(button); //把按钮加入到 x 的子节点中




    function clickBotton(){
        setTimeout(function(){
            //head添加属性让  所有连接在新窗口打开
            var headHTML = document.getElementsByTagName('head')[0].innerHTML;
            document.getElementsByTagName('head')[0].innerHTML = headHTML.concat( '<base target="_blank">');
            //点击所有
             //div[class='video-preview']
	     //tr > th > a.s.xst
            var objs = document.querySelectorAll(document.getElementById('mc3000input').value);
            var i= 0;
            var interval = setInterval(setText, 500);
            var cum = document.getElementById('mc3000input2').value;
            //alert(objs.length);
            function setText() {
                //alert(objs[i].innerHTML);
                objs[i].click();
                i++;
                if (i > cum) {
                    clearInterval(interval) ;
                }
            }
        },100);// setTimeout 0.1秒后执行
    }
})(); //(function(){})() 表示该函数立即执行
