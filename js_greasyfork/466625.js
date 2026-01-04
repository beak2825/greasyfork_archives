// ==UserScript==
// @version      2.0.1
// @license MIT
// @name         一键答题
// @namespace    http://your.namespace.com
// @description  Example MonkeyScript to make a GET request using jQuery
// @author       Your Name
// @include       *edu-edu*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/466625/%E4%B8%80%E9%94%AE%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/466625/%E4%B8%80%E9%94%AE%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==


console.log('欢迎━(*｀∀´*)ノ亻!使用一键答题')

function mySel(obj){
    obj = JSON.parse(obj);
    obj.answers = obj.answers.filter(i=> i.answer);
    var index = 0;
    for(var item of Array.from($('.ui-paper-iframe').contents().find('.ui-question-options'))){
        console.log(item)
        var options = obj.answers[index].answer.split('').filter(i=>i);

        (function(item){
            options.forEach(k=>{
                var dom = jQuery(item).find(`li[code=${k}] span`);
                //console.log(item)
                dom.click();
            })
        }(item))
        index++;
    }

    alert('选完了，检查一下！！！')
}

// 在匹配的网页上添加按钮
function init() {

    if(document.getElementById('myBtn'))
        a.remove();
    // 创建按钮元素
    var button = document.createElement("button");
    button.id="myBtn";
    button.innerHTML = "点击我";
    button.style.position = "fixed";
    button.style.zIndex = "99999999999999999999999999";
    button.style.top = "0";
    button.style.left = "0";
    button.style.background = "red";

    // 按钮点击事件处理程序
    button.addEventListener("click", function() {
        // 在点击按钮时执行的逻辑
        var str = window.prompt("输入参数");
        if(str==null)
            return false;
        if(!str.trim()){
            alert('请输入参数');
        }
        mySel(str)

    });

    // 将按钮添加到页面中的某个元素中
    document.body.appendChild(button);
}


// 在页面加载完成后调用添加按钮的函数
window.addEventListener("load", function(){
    var iframe = document.querySelector('.ui-paper-iframe');
    if(iframe){
        iframe.addEventListener("load", init);
    }

});
