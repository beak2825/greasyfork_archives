// ==UserScript==
// @name         Tampermonkey学习笔记
// @namespace    https://www.kisslove.com.cn/
// @version      0.1
// @description  私人笔记
// @author       KiSs.LoVe
// @match        http://10.25.24.106:9988/oss-web/main.jsp*
// @icon         http://tampermonkey.net/favicon.ico
// @grant        GM_addStyle
// @grant        unsafeWindow
// @require       https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license      KiSs.LoVe
// @downloadURL https://update.greasyfork.org/scripts/442251/Tampermonkey%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/442251/Tampermonkey%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==
//========================================================学习笔记========================================================
//        http://10.25.24.106:9988/isa-ws-web-ps/frame.jsp*
//@（安全）match   @（允许）include  @（排除）exclude
//@（32x32像素大小是最好的）icon
//@（非安全模式）grant    unsafeWindow/none
//@（跨域访问）grant    GM_xmlhttpRequest          @（连接站点）connect     api.bilibili.com
//@ 元素修改（去广告，优先使用此方式）grant   GM_addStyle
//@（抢先/最后注入/右键菜单）run-at    document-start/document-end/context-menu
//@（js资源引入）require   https://cdn.jsdelivr.net/npm/darkmode-js@1.5.7/lib/darkmode-js.min.js
//js引入使用：unsafeWindow.onload=function(){
//                  new Darkmode().showWidget();
//            }
//弹窗       alert('hello world')
//元素操作   document.querySelector('#id'/.class button/.class .class).value = '888'[text]/.checked = true[checkbox]/.click()[button等](#id/.class)
//多元素选择 document.querySelectorAll('#id .class')/('.class .class')
//循环语句   for
//结合多元素列表   let list=document.querySelectorAll('#id .class')
//for（定义变量;条件;执行后变量）{执行语句}     for(let index=0;index<list.length;index++){
//赋值item为元素list[index]       let item=list[index]
//打印元素.innerHTML属性         console.log(item.innerHTML)
//如果元素的innerHTML属性不存在"地图"与"贴吧"    if(item.innerHTML.indexOf('地图')===-1&&item.innerHTML.indexOf('贴吧')===-1）
//移除元素   item.remove()
//   }
//}
//判断 if(document.querySelector('#kw')==null)   元素不存在
//     {
//从当前函数退出  return;
//     }else{
//     }
//“=”是赋值操作符。“==”是判断值是否相等操作符。“===”是判断是否完全相等操作符。“!=”是非等运算符。“!==”是非完全相等运算符。
//普通浏览器操作   document.querySelector('video').playbackrate(倍速)/.volume(音量)
//打印对象属性     console.log(window.location)/在unsafeWindow模式中为unsafeWindow.location
//返回指定字符串在字符串中出现的位置     indexOf()     unsafeWindow.location.href.indexOf('baidu')
//等待网页加载完成[网页开始运行时]再运行函数    unsafeWindow.onload[.ready]=function(){}
//变量赋值(let作用域为块/var作用域为函数)   let/var a = 1
//时间定时器    setInterval
//POST请求
//函数  GM_xmlhttpRequest({
//地址  url:"https://api.bilibili.com/x/relation/modify",
//方式  method:"POST"
//数据  data:"xxxxxxxx"
//报头  headers:{
//         "Content-type":"application/x-www-form-urlencoded"
//    },
//返回时调用  onload:function(xhr){
//打印返回数据    console.log(xhr.responseText);
//    }
//   });
//添加按钮document.createElement("button")
//let btn=document.createElement("button");
//btn.className="default-btn";
//btn.id="submit-btn";
//btn.style.color="#ff0000";
//btn.innerHTML="按钮"
//btn.onclick=function(){
//    alert("点击了按钮");
//}
//document.body.append(btn);
//添加组件  document.createElement("div")
//let div=document.createElement("div");
//div.innerHTML='<span id="span-1" class="span-class" style="font-size:12px">span1</span><span class="sp" style="color:red">span class</span>';
//div.onclick=function(event){
//    if(event.target.id=="span-1"){
//        alert("span-1被点击了");
//    }else if(event.target.className=="sp"){
//        alert("sp被点击了");
//    }
//}
//document.body.append(div);
//末尾插入元素append、指定位置插入元素insertBefore(插入元素,目标元素)
//let share=document.querySelector('.share');
//share.parentElement.insertBefore(btn,share)
//去广告（这种方式广告如果是运行js脚本后展开的无法去，并且有延迟）id:HMRichBox     document.querySelector("#HMRichBox").style.display="none"
//去广告配合@grant  GM_addStyle     GM_addStyle('#HMRichBox{display:none !important}')
//修改元素属性  GM_addStyle('#HMRichBox{height:auto !important;min-height:400px !important;max-height:none !important}')
//GM_addStyle(元素1{属性1;属性2;}元素2)
//嵌入式框架iframe无法查找元素
//&&为与，||为或
//打开网页（新选项卡）    window.open('https://www.baidu.com/');
//打开网页（当前跳转）    window.location.href="http://www.baidu.com"
//对象（函数对象）this    call(变量)
//var cat={name:'猫',eat:function(){console.log(this.name+'在吃饭')}}
//var dog={name:'狗'}     cat.eat.call(dog)   call改变了函数内部this作用域对的指向
//赋值对象var xiaomao={
//   name:'xiaomao',
//   age:17,
//   eat:function (){
//  console.log(this.age+'的'+this.name+'在吃饭')
//}
//}
//xiaomao.eat()
//赋值对象var xiaogou={
//   name:'xiaogou',
//   age:18,
//   eat:function (){xiaomao.eat.call(this)}
//}
//xiaomao.eat()
//xiaogou.eat()
//========================================================学习笔记========================================================
(function() {
    'use strict';
    // Your code here...
if(unsafeWindow.location.href.indexOf('main.jsp')!=-1){
unsafeWindow.onload=function(){
 setTimeout(function(){
let li=document.createElement("li");
li.style='user-select: none;';
li.innerHTML='<a id="a-1"><span id="span-1" class="span-class" style="vertical-align: middle;">优化</span></a>';
li.onclick=function(event){
    if(event.target.id=="a-1"||event.target.id=="span-1"){
        let btn=document.createElement("label");
            btn.id='switch_btn';
            btn.class='switch_on';
            btn.style.cssText="margin:7px; position:relative; top:10px; zoom:1.95";
            btn.innerHTML='<input type="checkbox" id="switch_check"><span class="input checked"></span>';
            btn.onclick=function(){
            let cbx = document.querySelector('iframe').contentDocument.querySelector('#switch_check');
            if(cbx.checked == true){
               var timer = setInterval(function(){
               document.querySelector('iframe').contentDocument.querySelector('.ps-workorderquery-notAcceptOrderQueryView-search-btn').click();
               let dj=document.querySelector('iframe').contentDocument.querySelector('#ps-workorderquery-notAcceptOrderQueryView-not_accept_btn_accepted')
                if(cbx.checked != true||dj!=null){
                      dj.click();
                      cbx.checked = false;
                      clearInterval(timer);
            //       alert("来单请处理！");
Swal.fire({
  icon: 'warning',
  title: '单子已接，就问你做不做？',
  text: '【一点支撑来单】',
  footer: '<span style="color:#ff0000">（刷手机被抓扣20，被领导抓扣50，不如回家愉快玩耍！）</span>'
})
            //          document.querySelector('iframe').contentDocument.querySelector('#imchat-iframe').contentDocument.querySelector('.layim-chat-textarea textarea').value='12vvvvvv3123'
            //        document.querySelector('iframe').contentDocument.querySelector('#imchat-iframe').contentDocument.querySelector('.layim-send-btn').click();


                }
               },3000);
            }
}
        let iframe=document.querySelector('iframe').contentDocument.querySelector('#ps-workbenchView-li-imchat');
           if(document.querySelector('iframe').contentDocument.querySelector('#switch_btn')==null){
            iframe.parentElement.insertBefore(btn,iframe);
           }
    }
}
let dropdown=document.querySelector('.dropdown.workbech.workbech-menu');
dropdown.parentElement.insertBefore(li,dropdown)
          },120);
}
    }
})();

//办结文本框document.querySelector('iframe').contentDocument.querySelector('#ps-ordermanager-prOrderBanjieShenqing-banjieDesc').value='123123213';
//评分值    document.querySelector('iframe').contentDocument.querySelector('#starForSkills input').value=5;
//评分值    document.querySelector('iframe').contentDocument.querySelector('#starForStudy input').value=5;
//评分值    document.querySelector('iframe').contentDocument.querySelector('#starForAttitude input').value=5;
//提交      document.querySelector('iframe').contentDocument.querySelector('#ps-ordermanager-prOrderBanjieShenqing-submitBtn').click();
