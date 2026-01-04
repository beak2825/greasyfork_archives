// ==UserScript==
// @name         屏蔽csdn
// @namespace    wang-zhixin
// @version      20211125
// @description  csdn有目共睹的越来越恶心人，不得不采取措施。
// @match        https://www.baidu.com/s?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436058/%E5%B1%8F%E8%94%BDcsdn.user.js
// @updateURL https://update.greasyfork.org/scripts/436058/%E5%B1%8F%E8%94%BDcsdn.meta.js
// ==/UserScript==
let timer;
function HideCSDN(){
    const Elements=document.querySelectorAll(".result.c-container ");
    let num;
    Elements.forEach(function(Item,i){
        let Content=Item.querySelector(".f13 a:first-child").innerText;
        if(Content.includes("CSDN技术社区")){
            Item.parentNode.removeChild(Item);
            num = i
            clearInterval(timer)
        }
    });
    console.log(`共去除${num}条csdn内容`)
}
HideCSDN();

/*绑定键盘回车事件*/
document.querySelector("body").addEventListener('keydown',function () {
    //谷歌能识别event，火狐识别不了，所以增加了这一句，chrome浏览器可以直接支持event.keyCode
    var theEvent = window.event || arguments.callee.caller.arguments[0];
    if (theEvent.keyCode == "13") {//keyCode=13是回车键
        clearInterval(timer)
        timer = setInterval(function(){
            HideCSDN()
            console.log(`123`)
        },1000)
    }
})
/*绑定单机事件*/
document.querySelector("body").addEventListener('click',function () {
    clearInterval(timer)
    timer = setInterval(function(){
        HideCSDN()
        console.log(`123`)
    },1000)
})
