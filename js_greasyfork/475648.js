
// ==UserScript==
// @name         beautifyAi
// @author       gyk
// @description  去除杂乱的样式
// @match        https://codenews.cc/chatgpt
// @grant        none
// @license MIT
// @version 0.0.1.20230927063805
// @namespace https://greasyfork.org/users/302901
// @downloadURL https://update.greasyfork.org/scripts/475648/beautifyAi.user.js
// @updateURL https://update.greasyfork.org/scripts/475648/beautifyAi.meta.js
// ==/UserScript==

// 是否已经清除过样式的标志
let clear_flag = true
// 当前为止已经提问的数量
let question_num = 0
// 上下箭头按动的总次数
let click_num = 0
// 当前为止已经提问的问题数组
let question_arr = [];
// 当前滑动条位置
let scroll_height = 0


// 区分提问和回答
setInterval(function() {
  // 1.去除杂乱样式
  if(clear_flag){
    // 去除样式2023.09.27更新
    document.getElementById("controls").nextSibling.nextSibling.nextSibling.nextSibling.style.display="none"
    // 右侧去除且宽度100%
    document.getElementById("botColumn").style.display="none"
    document.getElementsByClassName("col-md-9")[0].style.width="100%"
    // 底部二维码去除
    document.getElementsByClassName("row streams")[1].style.display="none"
    // 底部使用示例去除
    document.getElementsByClassName("col-xs-12 col-md-12")[0].style.display="none"
    // 拉长显示区域
    document.getElementById("container").style.height="880px"
    // 增大全部清除按钮
    document.getElementById("new_chat").value="全部清除"
    document.getElementById("new_chat").style.fontSize="19px"
    document.getElementById("new_chat").style.padding="5px 353px"
    // 放大提问按钮
    document.getElementsByClassName("pull-right")[0].lastElementChild.value="开始提问"
    document.getElementsByClassName("pull-right")[0].lastElementChild.style.padding="10px 428px"
    // 底部广告去除
    //document.getElementById("aswift_3_host").style.display="none"
    // 底部空白去除
    // document.getElementsByClassName("adsbygoogle adsbygoogle-noablate")[1].remove()
    // document.getElementById("container").nextSibling.nextSibling.style.minHeight="1000px"
    
    // 底部链接去除
    // document.getElementById("controls").nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.style.display="none"
    // 拉长显示区域
    // document.getElementById("container").style.height="100%"
    // document.body.style.padding="0px"
    clear_flag=false
  }

  // 2.设置特定样式
  let new_question_num = document.getElementsByClassName("bot").length
  if(question_num < new_question_num){
    question_num = new_question_num
    console.log("开始渲染")
    let elements1 = document.getElementsByClassName("bot");
    let elements2 = document.getElementsByClassName("me");
    for (let i = 0; i < elements1.length; i++) {
      elements1[i].innerHTML="答案";
      elements1[i].style.color="red"
      elements1[i].style.textAlign="center"
      elements1[i].style.lineHeight="50px"
      elements1[i].style.backgroundColor="green"
    }
    for (let i = 0; i < elements2.length; i++) {
      elements2[i].innerHTML="问题";
      elements2[i].style.color="red"
      elements2[i].style.textAlign="center"
      elements2[i].style.lineHeight="50px"
      elements2[i].style.backgroundColor="blue"
    }
    // 获取所有的问题
    document.querySelectorAll("pre").forEach((item,index)=>{
    let isOdd = (parseInt(index) % 2) != 0;
        if(isOdd){
            question_arr.push(item)
        }
    })
    // 添加回到底部按钮
    let content = document.getElementById("upArrow").innerHTML;
    if(content!="BOTTOM"){
        document.getElementById("upArrow").innerHTML="BOTTOM"
        document.getElementById("upArrow").style.top=(document.getElementsByClassName("container-fluid")[0].scrollHeight-240)+"px"
        document.getElementById("upArrow").style.right="50px"
        document.getElementById("upArrow").style.textAlign="center"
        document.getElementById("upArrow").style.paddingTop="40px"
    }
    let current_height = document.getElementsByClassName("container-fluid")[0].scrollHeight
    if(current_height>scroll_height){
        console.log(current_height,scroll_height)
        scroll_height=document.getElementsByClassName("container-fluid")[0].scrollHeight
        document.getElementById("upArrow").style.top=(document.getElementsByClassName("container-fluid")[0].scrollHeight-240)+"px"
    }
  }
}, 100);


window.addEventListener("keydown", function (event) {
    // 监听向上箭头
    if(event.keyCode === 38){
        console.log("===")
        // 找到上一次提问的问题
        click_num= (question_num < click_num) ? click_num : (click_num=click_num+1)
        console.log(click_num)
        if(question_arr.length === 1){
            document.getElementById("textbox").value=question_arr[0].innerHTML
        }
        // 显示在输入框
        document.getElementById("textbox").value=question_arr[question_arr.length-1-click_num].innerHTML
    }
});
window.addEventListener("keydown", function (event) {
    // 监听向下箭头
    if(event.keyCode === 40){
        // 找到上一次提问的问题
        click_num= (click_num === 0) ? click_num=0 : (click_num= click_num-1)
        // 显示在输入框
        document.getElementById("textbox").value=question_arr[question_arr.length-1-click_num].innerHTML
    }
});

// 监听滚动条位置
window.addEventListener("scroll", function() {
//   console.log(window.pageYOffset);
//   console.log(document.getElementById("upArrow").style.top)
  document.getElementById("upArrow").style.top=(window.pageYOffset)+"px"
  if(!document.getElementById("upArrow").hasAttribute("onclick")){
    document.getElementById("upArrow").setAttribute("onclick","window.scrollTo(0,9999999999)")
  }
});