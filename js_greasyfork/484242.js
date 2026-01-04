// ==UserScript==
// @name         单选提交or多选全选
// @namespace    zhaiwei
// @version      0.0.0.1
// @description  单选、多选、填空作答辅助帮手
// @author       zhaiwei
// @match        https://pc.xuexi.cn/points/exam*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xuexi.cn
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/484242/%E5%8D%95%E9%80%89%E6%8F%90%E4%BA%A4or%E5%A4%9A%E9%80%89%E5%85%A8%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/484242/%E5%8D%95%E9%80%89%E6%8F%90%E4%BA%A4or%E5%A4%9A%E9%80%89%E5%85%A8%E9%80%89.meta.js
// ==/UserScript==

(function() {

    // 生成按钮
    var btn0 = document.createElement('button');
//    var btn1 = document.createElement('button');
    var btn2 = document.createElement('button');
    // 按钮文字
    btn0.innerText = '确定';
//    btn1.innerText = '按钮1';
    btn2.innerText = '提交';
    // 添加按钮的样式类名class值为
    btn0.setAttribute('class', 'addBtn');
//    btn1.setAttribute('class', 'fillBtn');
    btn2.setAttribute('class', 'clickBtn');
    // 生成style标签
    var style0 = document.createElement('style');
//    var style1 = document.createElement('style');
    var style2 = document.createElement('style');
    // 把样式写进去
    //颜色代号https://www.colorhexa.com/

    style0.innerText = `.addBtn{position:fixed;top:35%;left:30%;width:75px;height:55px;padding:3px 5px;border:1px solid #0d6efd;cursor:pointer;color:#0d6efd;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.addBtn:hover{background-color:#0d6efd;color:#fff;}`;
//    style1.innerText = `.fillBtn{position:fixed;top:250px;right:500px;width:75px;height:55px;padding:3px 5px;border:1px solid #008000;cursor:pointer;color:#008000;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.fillBtn:hover{background-color:#008000;color:#fff;}`;
    style2.innerText = `.clickBtn{position:fixed;top:55%;left:30%;width:75px;height:55px;padding:3px 5px;border:1px solid #fd240d;cursor:pointer;color:#fd240d;font-size:14px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.clickBtn:hover{background-color:#fd240d;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(style0);
//   document.head.appendChild(style1);
    document.head.appendChild(style2);
    // 在body中添加button按钮
    document.body.appendChild(btn0);
//    document.body.appendChild(btn1);
    document.body.appendChild(btn2);
    // 点击按钮去执行对应函数
    document.querySelector('.addBtn').addEventListener('click', function () {
        submit();
    })
/*    document.querySelector('.fillBtn').addEventListener('click', function () {
        fillAll();
    })
    */

    document.querySelector('.clickBtn').addEventListener('click', function () {
        if(document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-header").textContent.includes('单选题') || document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-header").textContent.includes('填空题')){
            submit();
        }else if(document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-header").textContent.includes('多选题')){
            checkAll();
        }
    })

//移除顶部、底部
    var polish = function(){
        let dingbu = document.querySelector("#app > div > div.layout-header")
        if (dingbu != null){
            dingbu.parentNode.removeChild(dingbu);
            }
//
        let dibu = document.querySelector("#app > div > div.layout-footer")
        if (dibu != null){
            dibu.parentNode.removeChild(dibu);
            }
    }
setInterval(polish,50);
    // 判断函数
    function addAll() {

    //新增
    if(!document.querySelectorAll(".el-dialog__title")[1]){
        document.querySelectorAll("button")[2].click();
    }/*
    else{
        $("span:contains(取 消)")[0].click()
    }
*/
    }

//定义函数-点击提示
var tipClick = function(){
    let tip = document.querySelector("#app > div > div.layout-body > div > div.detail-body > div.question > div.q-footer > span")
    switch (tip.className.length) {
        case 4:
            document.querySelector("#app > div > div.layout-body > div > div.detail-body > div.question > div.q-footer > span").click();
            break;
    }
}

    //提交函数
  function submit() {
//        $("button").children[0].click();
      setTimeout("document.querySelectorAll('.next-btn')[0].click()",10);
      setTimeout("document.querySelectorAll('.submit-btn')[0].click()",30);
}
    //全选函数
    function checkAll() {
        var len = document.querySelectorAll(".choosable").length;
        for (let index = 0; index < len; index++) {
             document.querySelectorAll(".choosable")[index].click();
}
        submit();

    }
    //点击提示-重复执行

    setInterval(tipClick,50);
//更改按钮文字
    var labelUp = function(){
    if(document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-header").textContent.includes('多选题')){
            document.getElementsByClassName("clickBtn")[0].innerText="全选";
        }else{
            document.getElementsByClassName("clickBtn")[0].innerText="提交";
        }
    }
    setInterval(labelUp,100);
})();