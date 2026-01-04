// ==UserScript==
// @name        评教小助手 - scut.edu.cn
// @namespace   Violentmonkey Scripts
// @match       *://*.scut.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex*
// @grant       none
// @version     1.4
// @author      胖次
// @description 自动评教小工具。代码很烂。请仔细检查生成的评教内容，本人不对使用此工具评教造成的任何后果负责。2021/6/19上午9:30:01
// @homepageURL https://greasyfork.org/zh-CN/scripts/428160-%E8%AF%84%E6%95%99%E5%B0%8F%E5%8A%A9%E6%89%8B-scut-edu-cn
// @downloadURL https://update.greasyfork.org/scripts/428160/%E8%AF%84%E6%95%99%E5%B0%8F%E5%8A%A9%E6%89%8B%20-%20scuteducn.user.js
// @updateURL https://update.greasyfork.org/scripts/428160/%E8%AF%84%E6%95%99%E5%B0%8F%E5%8A%A9%E6%89%8B%20-%20scuteducn.meta.js
// ==/UserScript==

window.onload = function(){
  //绑定已阅读点击事件
  $("#btn_yd").prop("disabled",false).addClass("btn-primary").unbind().click(function(){
    //全局文档添加参数
    $(document).data("offDetails","1");
    //加载功能主页：且添加不再进入提示信息页面的标记字段
    onClickMenu.call(this,'/xspjgl/xspj_cxXspjIndex.html?doType=details','N401605',{"offDetails":"1"});
  });
}

h = document.getElementsByClassName("navbar-header")[0];

var btn=document.createElement("button");

btn.innerHTML = "全选完全同意和同意";

btn.onclick = function(){
  t = document.getElementsByClassName("form-group");
  for(i=0; i<t.length; i++)
    t[i].getElementsByClassName("radio-pjf")[0].click();
  t[Math.floor(Math.random()*t.length)].getElementsByClassName("radio-pjf")[1].click();

  word_list = ["幽默风趣", "讲解透彻", "认真负责", "理论联系实际", "注重课堂互动", "教学灵活", "教学有前瞻性", "教学针对性强", "讲课突出重点", "讲课内容详细", "讲课条理清晰", "讲课细致入微", "对深奥的现象解释的通俗易懂", "见解独到深入", "学识渊博", "极大的提高了我们的学习热情", "作业能够耐心的讲解", "是个认真负责的老师", "对工作态度认真", "能够很好的处理教学过程中出现的问题", "认真耐心的指导学生", "待人温和", "总是带着和蔼的笑容", "在重点难点处总是重复多遍", "从不责备我们", "细心引导", "条理性很强", "课堂气氛很好", "讲课十分投入", "对于同学提出的建议能够认真的采纳", "和蔼可亲", "课堂作业能够及时讲解", "严谨", "耐心"];

  comment = "老师";

  while(comment.length<60){
    ran = Math.floor(Math.random()*word_list.length);
    comment = comment + word_list[ran] + ",";
    word_list.splice(ran, 1);
  }

  comment = comment.slice(0, comment.length-1) + "。";

  console.log(comment);

  let einput=document.getElementsByClassName("form-control")[0];
  let evt = document.createEvent('HTMLEvents');
  evt.initEvent('input', true, true);
  einput.value=comment;
  einput.dispatchEvent(evt)

};

h.appendChild(btn);

