// ==UserScript==
// @name        练习习题快速填充 - krvr.cn
// @namespace   Autofill Scripts
// @match       https://krvr.cn/apdiwqeadmin.php?p=/Content/index/mcode/7
// @grant       none
// @version     1.01
// @author      -lanSir
// @description 2023/9/26 09:34:17
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480006/%E7%BB%83%E4%B9%A0%E4%B9%A0%E9%A2%98%E5%BF%AB%E9%80%9F%E5%A1%AB%E5%85%85%20-%20krvrcn.user.js
// @updateURL https://update.greasyfork.org/scripts/480006/%E7%BB%83%E4%B9%A0%E4%B9%A0%E9%A2%98%E5%BF%AB%E9%80%9F%E5%A1%AB%E5%85%85%20-%20krvrcn.meta.js
// ==/UserScript==
window.onload=(function(){
  fastFill();
})
let ext_answer =document.querySelector(".layui-input[name='ext_answer']");//答案
let ext_stem =document.querySelector(".layui-textarea[name='ext_stem']");//题干
let ext_analysis =document.querySelector(".layui-textarea[name='ext_analysis']");//解析
let title=document.querySelector('.layui-input[name="title"]');//标题
let save= sessionStorage.getItem('save_title')==null?'1':sessionStorage.getItem('save_title');
//ui及点击事件绑定
function fastFill(){
  let box=document.createElement('div');
  box.classList.add("fill_box");
  box.innerHTML='<input id="fill_title" type="text"><button class="fill_correct">修改</button><textarea name="fill_text" id="fill_text" cols="30" rows="10"></textarea><br><button class="fill_button">填充</button>'
  let myStyle = document.createElement('style');
  myStyle.textContent = '.fill_box{width:350px;position:fixed; top:100px; right:300px;z-index:2147483647; font-size:14px;text-align: center;background-color: aliceblue;margin:20px auto;}'
    +'#fill_text{width: 350px;min-height: 300px;line-height: 2em;text-align: left;}.fill_button{border:0;width:6em;height:3em;background-color:#2196f3;}';
  let doc = document.head || document.documentElement;
  doc.appendChild(myStyle);
  let body=document.querySelector('.layui-body');
  body.appendChild(box);
  let fill_button=document.querySelector('.fill_button');
  let fill_title=document.getElementById('fill_title');
  let correct=document.querySelector('.fill_correct');
  fill_title.value=save
  fill_button.onclick=(function(){
    checkText()
  })
  correct.onclick=(function(){
    title.value=fill_title.value.trim();
    save=fill_title.value.trim();
    sessionStorage.setItem('save_title',save);
  })
}
//点击事件，处理文本
function checkText(){
  let fill_text=document.getElementById('fill_text');//输入文本
  let text=fill_text.value.trim();
  let reg0=/^\d+[.]/g;
  let res=reg0.exec(text)
  text=text.substring(res==null?0:res[0].length,text.length);
  let reg1=/[a|A]+[.]/g;
  let reg2=/答案(:|：)/g;
  let reg3=/解析(:|：)/g;
  let index1=text.search(reg1);
  let index2=text.search(reg2);
  let index3=text.search(reg3);
  ext_stem.value=text.substring(0,index1).trim();
  let reg4=/[A-Z]+[.]/g;
  let cutArray=text.substring(index1,index2==-1?text.length:text.search(reg2)).trim().match(reg4);
  let viewArray=text.substring(index1,index2==-1?text.length:text.search(reg2)).trim().split(reg4);
  let context="<ul class='list-paddingleft-2'>"
  for(let i=0;i<viewArray.length;i++){
    if(viewArray[i]!=''){
      context +="<li><p>"+cutArray[i-1]+viewArray[i].trim()+"</p></li>"
    }
  }
  context +="</ul>";
  UE.getEditor('editor').setContent(context);
  if(index2!=-1){
    if(index3!=-1){
      ext_answer.value=text.substring(index2+3,index3).trim();
      ext_analysis.value=text.substring(index3+3,text.length).trim();
    }else{
      ext_answer.value=text.substring(index2+3,text.length).trim();
    }
  }
  title.value=save;
  save=Number(save)+1;
  // if(Number(save)>10){
  //   save=1
  // }
  sessionStorage.setItem('save_title',save);
}