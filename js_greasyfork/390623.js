// ==UserScript==
// @name 辅助学习
// @namespace Violentmonkey Scripts
// @match http://kxxy.tjrtvu.edu.cn/NewPages/StudyDxxt.aspx
// @grant none
// @description zh-cn
// @version 0.0.1.20190930023222
// @downloadURL https://update.greasyfork.org/scripts/390623/%E8%BE%85%E5%8A%A9%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/390623/%E8%BE%85%E5%8A%A9%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

//发送ajax就靠它
let aj = class Ajax {
  constructor() {
      //定义一个变量用于存放XMLHttpRequest对象
      this.xmlHttpRequest = null;

      if (window.ActiveXObject) {
          //IE浏览器的创建方式
          this.xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
      } else if (window.XMLHttpRequest) {
          //Netscape浏览器中的创建方式
          this.xmlHttpRequest = new XMLHttpRequest();
      }
  }

  send(method, url, success, err) {
      if (this.xmlHttpRequest != null) {
          //创建HTTP请求
          this.xmlHttpRequest.open(method, url, true)
          //设置HTTP请求状态变化的函数
          this.xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          //发送请求
          this.xmlHttpRequest.send();
          this.xmlHttpRequest.onreadystatechange = this.httpStateChange.bind(this, success, err);
      }
  }

  httpStateChange(success, err) {
      if (this.xmlHttpRequest.readyState == 4) {
          //判断异步调用是否成功
          if (this.xmlHttpRequest.status == 200 || this.xmlHttpRequest.status == 0) {
              success(this.xmlHttpRequest);
          } else {
              err()
          }
      }
  }
}

//判断是否需要发送网络请求
let need_send =(url_obj,callback)=>{
// 获取这个页面的一个标记
let flag = `${url_obj.CourseId}_${url_obj.CourseCategoryId}`
//获得的结果字符串
let result_str = null;

if(sessionStorage.getItem(flag)){
   callback( sessionStorage.getItem(flag) )
}else{
  sessionStorage.clear();
  console.log("进行了请求",url_obj)
  let r_url = `http://kxxy.tjrtvu.edu.cn/NewPages/StudentXtjx.aspx?CategoryId=${url_obj.CourseCategoryId}&CourseId=${url_obj.CourseId}`
  send_Obj(r_url,(str)=>{
    sessionStorage.setItem(flag,str)
    callback(str);
  });
}
}

//发送ajax请求
let send_Obj = (url,callback)=>{
let ajax = new aj();
let end = null;

ajax.send(
   'get',
   url,
   (res) => {
     end = math_Obj(res.responseText);
     callback(end)
   }, () => {
      console.log('err')
   }
 )
}

//解析答案页面
let math_Obj = (text)=>{
let arr = []
let a_obj = text.match(/<body.*?>([\s\S]*?)<\/body>/)[0]
let b_obj = a_obj.replace(/<div class="postTitle"><b>正确答案：<\/b><span>(.*?)<\/span><\/div>/g,function(){
  arr.push(arguments[1]);
});

return JSON.stringify(arr);
}

//解析url
let parse_url = (url)=>{
let obj ={};
url.map((item)=>{
   let a = item.split("=");
   obj[ a[0] ]= a[1]
})
return obj
}

//河蟹后获取链接
let get_url = ()=>{
let flag={
  next:true,
  index:0,

}
let d = document.querySelectorAll('.chapter_menu_second')
let url = null;

while(flag.next){
  if(flag.index==d.length){
    url = d[flag.index].children[0].href
    flag.next = false
  }else{
    if(d[flag.index].style.backgroundRepeat!==""){
      url = d[flag.index].children[0].href
      flag.next = false
    }
    flag.index++
  }
}

return url.split("?")[1].split("&")
}


//获取答案后,调用点击事件
let get_result = (arr)=>{
let num =  document.querySelector('select[name="ctl00$Cph$CoursePostInfoNew1$DrpPostList"]').selectedIndex
let result = arr[num].split("")
let type = document.querySelector('span[id="ctl00_Cph_CoursePostInfoNew1_LblType"]').textContent ;

not_click();
click_button(type,result)
next_click()
}

//点击答案
let click_button = (type,result)=>{
switch(type){
  case "单选题":
    // div .ctl00_Cph_CoursePostInfoNew1_PanelSingle  块
    // ctl00_Cph_CoursePostInfoNew1_SingleB           单个选项
    
    document.querySelector(`input[id=ctl00_Cph_CoursePostInfoNew1_Single${result[0]}]`).click();
    break;
  case "多选题":
    // div .ctl00_Cph_CoursePostInfoNew1_PanelMultiple  块
    // ctl00_Cph_CoursePostInfoNew1_MultipleA  单个选项
    result.forEach((item)=>{
       document.querySelector(`input[id=ctl00_Cph_CoursePostInfoNew1_Multiple${item}]`).click();
    })
    
    break;
  case "判断题": 
    // div .ctl00_Cph_CoursePostInfoNew1_PanelJudge  块
    // ctl00_Cph_CoursePostInfoNew1_JudgeA           单个选项
    document.querySelector(`input[id=ctl00_Cph_CoursePostInfoNew1_Judge${result[0]}]`).click();
    
    break;
  default:
    console.log("other",type)
    break;
}

document.querySelector("input[id=ctl00_Cph_CoursePostInfoNew1_BtnOK_Submint]").click()
}

//点击下一个
let next_click = ()=>{
let next = document.querySelector("a[id=ctl00_Cph_CoursePostInfoNew1_CoursePostInfoNext1_ExampleNext]")
let back = document.querySelector("input[id=ctl00_BtnExit]")


if(next){
  next.click();
}else{
  //document.location.href ="http://kxxy.tjrtvu.edu.cn/NewPages/StudyCourse_new.aspx"
  //http://kxxy.tjrtvu.edu.cn/newindex/login.aspx
  //back.click();
  
  sessionStorage.clear();
  document.location.href ="http://kxxy.tjrtvu.edu.cn/newindex/login.aspx"
}
}

//点击知识要点
let not_click =()=>{
let button = document.querySelector("input[id=ctl00_Cph_CoursePostInfoNew1_CoursePostInfoKnowledge1_Look]")

if(button){
  button.click();
  document.querySelector("div[id=KnowLedgeInfoDivClose]").click();
}
}

//主函数
let ok = () => {
//获取get请求
let url = get_url()
let url_obj = parse_url(url);


//判断是否需要发送ajax请求，二层回调地狱23333333~
need_send(url_obj,(str)=>{
  get_result(JSON.parse(str));
})
}

window.addEventListener('load', ok);
