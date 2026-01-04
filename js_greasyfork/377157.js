// ==UserScript==
// @icon           http://www.tzr.me/images/2019/01/26/111.png
// @name        华医通审核助手1.5.4
// @author          zhiwen-T
// @description       华医通审核助手V1.5.4
// @include   *://h5hyt.cd120.com/admin/*
// @version 1.5.4



// @grant       GM_getValue

// @namespace [url=mailto:1649991905@qq.com]1649991905@qq.com[/url]
// @downloadURL https://update.greasyfork.org/scripts/377157/%E5%8D%8E%E5%8C%BB%E9%80%9A%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B154.user.js
// @updateURL https://update.greasyfork.org/scripts/377157/%E5%8D%8E%E5%8C%BB%E9%80%9A%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B154.meta.js
// ==/UserScript==
// 
// 
var timesRun = 0;
var start = setInterval(bbbb,1000);//（循环）
function bbbb(){
var url = window.location.href;   
//console.log('刷新sssss');
timesRun += 1;
if(timesRun === 30){    
        clearInterval(start);  
  }
if(url.indexOf("https://h5hyt.cd120.com/admin/home") >= 0 ){//2、判断循环条件;

 if(location.href.indexOf("#reloaded")==-1){
        location.href=location.href+"#reloaded";

    setTimeout(function(){

      location.reload();
               },120); 
         } 
    } 


 }

    var run = true;   //定义全局变量用于关闭函数
    var a = '<div id=k class="ant-menu-submenu-title" aria-expanded="false" aria-owns="html_审核助手$Menu" style="z-index:auto;background-color:#AFEEEE;height:36px" aria-haspopup="true">&nbsp<span><i class="anticon anticon-bars"></i></span><span id =set  style="font-size:13pt" >审核助手</span><span id = zhushou1>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp✔&nbsp&nbsp&nbsp&nbsp</span><i class="ant-menu-submenu-arrow"></i></div>';  
    //将以上的html代码插入到网页里的ul标签中
     $("div.ant-layout-sider-children").append(a);
    var b = '<div id=g class="ant-menu-submenu-title" aria-expanded="false" aria-owns="html_关闭助手$Menu" style="z-index:auto;background-color:#D3D3D3;height:36px;display: none" aria-haspopup="true">&nbsp<span><i class="anticon anticon-bars"></i></span><span id =set  style="font-size:13pt">审核助手</span><span id = zhushou2>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp✘&nbsp&nbsp&nbsp&nbsp</span><i class="ant-menu-submenu-arrow"></i></div>';  
    //将以上的html代码插入到网页里的ul标签中
     $("div.ant-layout-sider-children").append(b);


  function setCookie(name, value) {
        var exp = new Date();
        exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }
    function getCookie(name)
    {
        var regExp = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        var arr = document.cookie.match(regExp);
        if (arr == null) {
            return null;
        }
        return unescape(arr[2]);
    }




$(document).on("click","#set",function(){

//document.querySelector("#set").addEventListener("click",function(){
        var oldEditBox = document.querySelector("#rwl-setMenu");
        if(oldEditBox){
            oldEditBox.parentNode.removeChild(oldEditBox);
            $(".ant-tabs-ink-bar.ant-tabs-ink-bar-animated").show()
            return;
        }


        var odom = document.createElement("div");
        odom.id = "rwl-setMenu";
        odom.style.cssText ="position: absolute;" +
             "z-index:999;" +
            "top: 65px;" +
            "left: 202px;" +
            "padding: 10px;" +
            "background: #fff;" +
            " border:1px solid #40A9FF;"+
            "border-radius: 1px;";
        var innerH = "" +


             // "<button id='rwl-reset'>清空设置</button> &nbsp;&nbsp;&nbsp;" +
            "<button id='rwl-setMenuSave' >保存</button> &nbsp;&nbsp;&nbsp;" +
            "<button id='rwl-setMenuClose'  onclick='this.parentNode.parentNode.removeChild(this.parentNode);' >关闭</button> &nbsp;&nbsp;&nbsp;" +
            // "<button id='rwl-codeboxsave'>保存</button>" +
            "<span style='font-size:0.7em;'>  &nbsp&nbsp---------------- 设置界面 ----------------  </span>" +
             "<p></p>" +
            "<p><s>其他功能 (待添加）</s></p>" +
                 "<p></p>" +
 "<laberl> <p> 关闭自动点击详情 <input id='upload2'  type='checkbox'  ></p>" + "</laberl>" +

//  localStorage.setItem("key","1")           
//var obj = document.getElementById("yeshu"); //定位id
//var value = obj.options[index].value; // 选中值
  
"自动点击第：<select style= class='form-control' name='searchtitle' onchange='getTitleData()' type='text' id='yeshu2'>" +
"<option value='1'>1</option>" +
"<option value='2'>2</option>" +
"<option value='3'>3</option>" +
"<option value='4'>4</option>" +
"<option value='5'>5</option>" +
"</select>" +
"&nbsp页&nbsp，第：<select id='select_1'   onchange='getTitleData2()' >" +
"<option value='1'>1</option>" +
"<option value='2'>2</option>" +
"<option value='3'>3</option>" +
"<option value='4'>4</option>" +
"<option value='5'>5</option>" +
"</select>&nbsp个详情" +
 "<p></p>" +
     
           "<laberl> <p> 自定义按钮原因： <input id='upload5'   type=\"text\" value= 您上传的图片黑暗无法判断证件信息。 /></p>" + "</laberl>" +
            
            "<laberl> <p> 关闭快捷键功能 <input id='kuaijie'  type='checkbox' /></p>" + "</laberl>" +
         '<div  style="background-color:#FFFFFF;border:1px solid #40A9FF;">'+//添加适应div ，背景
              "<p>&nbsp&nbsp快捷功能：<br/>&nbsp&nbsp小键盘数字键 0 ： 通过审核<br/>&nbsp&nbsp小键盘数字键 1 ： 未通过原因1 <br/>&nbsp&nbsp小键盘数字键 2 ： 未通过原因2 <br/> &nbsp&nbsp小键盘数字键 3 ： 未通过原因3   <br/> &nbsp&nbsp小键盘数字键 4 ： 未通过原因4   <br/>&nbsp&nbsp小键盘数字键 5 ： 未通过原因5  <br/> &nbsp&nbsp方向键← 左键 &nbsp&nbsp： 返回 <br/> &nbsp&nbsp方向键→ 右键 &nbsp&nbsp： 快捷点击设置的详情，页数 <br/>&nbsp&nbsp + 键&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp ： 进入下一个用户ID<br/>&nbsp&nbspESC键&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp ： 退出图片全屏查看 <br/>&nbsp回车键&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp ： 快捷点击确认 </p>" +               
        '</div>'+
            


            ""
        "";
        odom.innerHTML = innerH;
      document.getElementById("root").after(odom);
      $(".ant-tabs-ink-bar.ant-tabs-ink-bar-animated").hide()

var optionList = document.getElementById("yeshu2").getElementsByTagName("option");
var optionLength = optionList.length; 
 var value = localStorage.getItem("color");
value = value == undefined ? "1" : value;
for (var i = 0; i < optionLength; i++) {
// 匹配 value，如果相同 value 则 selected 选中
if (optionList[i].value == value) {
optionList[i].selected = "selected";
  
}
} 

  
var optionList = document.getElementById("select_1").getElementsByTagName("option");
var optionLength = optionList.length; 
 var value = localStorage.getItem("xq");
value = value == undefined ? "1" : value;
for (var i = 0; i < optionLength; i++) {
// 匹配 value，如果相同 value 则 selected 选中
if (optionList[i].value == value) {
optionList[i].selected = "selected";

}
} 

 
  document.getElementById("upload5").style.width="260px";//设置input原因框长度
  document.getElementById("upload5"). maxlength="100";//设置input原因框文本最大字数
        document.querySelector("#rwl-setMenuSave").addEventListener("click",saveSetting);
  

 if (localStorage.getItem("upload2") != null) {
	      //自定义代码
	document.getElementById("upload2").checked = true
	      // alert('key 存在')
	  }
   else{
	      //自定义代码
	document.getElementById("upload2").checked = false
	      // alert('key 不存在')
	  }
 
  
   if (localStorage.getItem("kuaijie") != null) {
	      //自定义代码
	document.getElementById("kuaijie").checked = true
	     //  alert('key 存在')
	  }
   else{
	      //自定义代码
	document.getElementById("kuaijie").checked = false
	      // alert('key 不存在')
	  }
   
   
    document.getElementById("upload5").value = window.localStorage.getItem("upload5")
     
    })

   // 保存选项
    function saveSetting(){
     var storage = window.localStorage;
    if (window.localStorage) {
        var select_budgetary = document.getElementById('upload5');
        storage.setItem("upload5", $('#upload5').val());
         console.log($('#upload5').val());
     }
      
      
if(document.getElementById("upload2").checked == true){

 window.localStorage.setItem("upload2", 1);

}
if(document.getElementById("upload2").checked == false){
 window.localStorage.removeItem('upload2');


}

if(document.getElementById("kuaijie").checked == true){

 window.localStorage.setItem("kuaijie", 1);

}
if(document.getElementById("kuaijie").checked == false){
 window.localStorage.removeItem('kuaijie');


}      
      
    

            setTimeout(function(){
                window.location.reload();
            },300);

    
        closeMenu();
    }

    //关闭菜单
    function closeMenu(){
        var oldEditBox = document.querySelector("#rwl-setMenu");
        if(oldEditBox){
            oldEditBox.parentNode.removeChild(oldEditBox);
            return;      
          
        }
    }


getTitleData=function(){
  var optionList = document.getElementById("yeshu2").getElementsByTagName("option");
var optionLength = optionList.length;
// 获得当前选中的值，调用 setCooked 保存到 cookie 中，然后直接退出循环
for (var i = 0; i < optionLength; i++) {
if (optionList[i].selected || optionList[i].selected == "selected") {

  window.localStorage.setItem("color", optionList[i].value);
break;
}
}
}


getTitleData2=function(){
  var optionList = document.getElementById("select_1").getElementsByTagName("option");
var optionLength = optionList.length;
// 获得当前选中的值，调用 setCooked 保存到 cookie 中，然后直接退出循环
for (var i = 0; i < optionLength; i++) {
if (optionList[i].selected || optionList[i].selected == "selected") {

    window.localStorage.setItem("xq", optionList[i].value);
break;
}
}
}
      



$(document).on("click","#zhushou1",function(){

 console.log('关闭助手');
      clearInterval(out);//停止功能1
      clearInterval(aaa);//停止功能2
        clearInterval(dj);//停止功能3
     //$("#zhushou").html("审核助手X");
     $("#k").hide();//隐藏按钮（0~0） 
     $("#g").show();//显示按钮（0~0） 
 })
  
  
$(document).on("click","#zhushou2",function(){
 console.log('开启助手');
   out=setInterval(f,100) //重新开始功能1
   aaa=setInterval(ff,500)//重新开始功能2
   dj=setInterval(xq,500)//重新开始功能3
  
    //$("#zhushou").html("审核助手√");
     $("#k").show();//隐藏按钮（0~0） 
     $("#g").hide();//显示按钮（0~0） 
 })  


var out = setInterval(f,100);//100毫秒后运行刷新 （循环）
function f(){
  
var url = window.location.href;   
  // console.log('刷新111');
if(url.indexOf("tabStatu") >= 0 ){//2、判断循环条件;
    if(location.href.indexOf('#') < 1){
    location.href=location.href+"#";
    location.href=location.href+"%";
    location.reload();
    } 
  }
 // if(url.indexOf("list") >= 0 ){//2、判断循环条件;
  //  $("a")[2].click();  //自动点击详情
 //    }
}


 
var aaa = setInterval(ff,300);//100毫秒后运行刷新 （循环）
clearInterval(aaa);//停止功能2
function ff(){
 //  console.log('刷新222');
var url1 = window.location.href;   
if(url1.indexOf("tabStatu") >= 0 ){//2、判断循环条件;
    if(location.href.indexOf('%') < 1){
       	   setTimeout(function(){
             
      window.location.href = "https://h5hyt.cd120.com/admin/realname/card/list";//跳转到主页 
               },420); 
   } 
 }
}
  

var dj = setInterval(xq,1000);//100毫秒后运行刷新 （循环）

//clearInterval(dj);//停止功能
function xq(){
  var url2 = window.location.href;
if(url2.indexOf("list") >= 0 ){//2、判断循环条件;
  
  if (localStorage.getItem("upload2") != null) {
	      //自定义代码
	  console.log('关闭点击详情');
	  }
   else{
     setTimeout(function(){//220毫秒后运行下列程序   一次
 $(".ant-pagination-item")[localStorage.getItem("color")-1].click();  //自动点击详情   
 setTimeout(function(){//220毫秒后运行下列程序   一次
       $("a")[localStorage.getItem("xq")-1].click();  //自动点击详情
     },500);
       
        console.log('开启自动点击详情');
       
          },500);
          }
	  }
 
}
  


 
  $(document).keydown(function(event){
   
    if (event.keyCode == 39){
    if (localStorage.getItem("kuaijie") != null) {
	      //自定义代码
	  alert('快捷功能没有开启，请开启后重试');
	  }
   else{
     setTimeout(function(){//220毫秒后运行下列程序   一次
 $(".ant-pagination-item")[localStorage.getItem("color")-1].click();  //自动点击详情   
 setTimeout(function(){//220毫秒后运行下列程序   一次
       $("a")[localStorage.getItem("xq")-1].click();  //自动点击详情
     },200);
       

          },200);
          }      

  
   }
 }) 



 

window.onload=function(){
  // 刷新后页面加载完成    
  // $("p").hide(); //隐藏全部p标签 

  	 //setInterval(function(){//220毫秒后运行下列程序   循环
	   setTimeout(function(){//220毫秒后运行下列程序   一次

var url = window.location.href;                             
if(url.indexOf("tabStatu") >= 0 ) { //判断url地址中是否包含tabStatu字符串
  //alert("包含tabStatu字符");

    $(".ant-btn.ant-btn-primary").hide();//隐藏原按钮（0~0）
    $(".ant-btn.ant-btn-sm:first").hide();
    $(".ant-btn.ant-btn-danger").hide(); 
  
  

         var as = document.getElementsByTagName('p');//  获取所有 P标签内容， 
         var img1 =document.getElementById("images1").getElementsByTagName("img")[0].src  //获取正面照
         var img2 =document.getElementById("images2").getElementsByTagName("img")[0].src  //获取反面照 
         var img3 =document.getElementById("images3").getElementsByTagName("img")[0].src  //获取手持照

    ////将以下的html代码插入到网页里的第一个P标签中
  var btn = '<div class="ant-row-flex ant-row-flex-middle" style="margin-top: 20px;">'; //添加确认和返回按钮
          btn  += '<div class="ant-col-2 ant-col-offset-10"><button type="button" style="border-radius:5px;font-size:10pt;width:100px;height:30px;background-color:#1890FF;color: #FFFFFF" id= re1 class="aaaa"><span>通过实名认证</span></button></div>';  
          btn  += '<div class="ant-col-3 ant-col-offset-2"><button type="button" style="border-radius:5px;font-size:10pt;width:100px;height:30px;background-color:#1890FF;color: #FFFFFF" id= re2 class="aaaa"><span>返回        </span></button></div>';  
          btn  += '</div>';  
  
 $("p:first").before(btn); //将以上的html代码插入到网页里的第一个P标签中 
  
    var down_btn_html = '<p>'+as[12].innerText+'</p>'; //添加审核理由


         //down_btn_html += '<p>'+as[2].innerText+'</p>'; //添加患者名字
         //down_btn_html += '<p>'+as[1].innerText+'</p>'; //添加审核状态
         //down_btn_html += '<p>'+as[10].innerText+'</p>'; //添加操作人
         //down_btn_html += '<p>'+as[11].innerText+'</p>'; //添加审核时间
        // down_btn_html += '<p>'+as[12].innerText+'</p>'; //添加审核理由
             down_btn_html += '<div class="ant-row-flex" style="background-color:#FFFFFF">';//添加适应div ，背景
         down_btn_html += '<div class="ant-col-offset-0">&nbsp&nbsp&nbsp身份证正面照：    ';
         down_btn_html += '<span id="images1"  class="pimg"  style="list-style: none; margin: 10px; padding: 2px; display: flex; flex-wrap: wrap;">';//添加正面照
 
         down_btn_html += '<img id = p1 alt="图片加载失败，请刷新重试！" src=" '+ img1 + '" style="max-width: 440px; max-height: 380px; cursor: pointer;">';   
 
         down_btn_html += '</span>';   
          down_btn_html += '</div>';  
  
           down_btn_html += '<div class="ant-col-offset-0.2" >&nbsp&nbsp&nbsp身份证反面照： ';
         down_btn_html += '<span id="images2" class="pimg"  style="list-style: none; margin: 10px; padding: 2px; display: flex; flex-wrap: wrap;">';//添加反面照 
         down_btn_html += '<img id = p2   alt="图片加载失败，请刷新重试！" src="'+ img2 + '" style="max-width: 440px; max-height: 380px; cursor: pointer;">';   
 
         down_btn_html += '</span>';   
          down_btn_html += '</div>';  
  
           down_btn_html += '<div class="ant-col-offset-0.2 ">&nbsp&nbsp&nbsp身份证手持照：   ';
         down_btn_html += '<span id="images3" class="pimg"   style="list-style: none; margin: 10px; padding: 2px; display: flex; flex-wrap: wrap;">';//添加手持照
 
         down_btn_html += '<img id = p3  alt="图片加载失败，请刷新重试！" src="'+ img3 + '" style="max-width: 440px; max-height: 380px; cursor: pointer;">';   
         down_btn_html += '</span>';   
          down_btn_html += '</div>';  
  
        down_btn_html += '<div class="ant-col-offset-0.2">';    // 背景 style="background-color:#AFEEEE"width:100px;height:50px;
         down_btn_html +=  "<p>&nbsp</p>";

        down_btn_html += '<p><span style="list-style: none; margin: 6px; padding: 2px; display: flex; flex-wrap: wrap;"><button type="button" id= re3   style="border-radius:5px;font-size:12pt;width:200px;height:48px;background-color:#F5F5F5;color: #FF4D4F"  class="bbbb">未 拍 摄 手 持 照     </button></span></p>';
        down_btn_html += '<p><span style="list-style: none; margin: 6px; padding: 2px; display: flex; flex-wrap: wrap;"><button type="button" id= re4   style="border-radius:5px;font-size:12pt;width:200px;height:48px;background-color:#F5F5F5;color: #FF4D4F"  class="bbbb"> 手持照未符合要求      </button></span></p>'; 
        down_btn_html += '<p><span style="list-style: none; margin: 6px; padding: 2px; display: flex; flex-wrap: wrap;"><button type="button" id= re5   style="border-radius:5px;font-size:12pt;width:200px;height:48px;background-color:#F5F5F5;color: #FF4D4F"  class="bbbb">翻 拍 的 身 份 证     </button></span></p>';
        down_btn_html += '<p><span style="list-style: none; margin: 6px; padding: 2px; display: flex; flex-wrap: wrap;"><button type="button" id= re6   style="border-radius:5px;font-size:12pt;width:200px;height:48px;background-color:#F5F5F5;color: #FF4D4F"  class="bbbb">证件不清晰或被遮挡     </button></span></p>';
        down_btn_html += '<p><span style="list-style: none; margin: 6px; padding: 2px; display: flex; flex-wrap: wrap;"><button type="button" id= re7   style="border-radius:5px;font-size:12pt;width:200px;height:48px;background-color:#F5F5F5;color: #FF4D4F"  class="bbbb">证件实名信息不匹配     </button></span></p>';
        down_btn_html += '<p><span style="list-style: none; margin: 6px; padding: 2px; display: flex; flex-wrap: wrap;"><button type="button" id= re8   style="border-radius:5px;font-size:12pt;width:200px;height:48px;background-color:#F5F5F5;color: #FF4D4F"  class="bbbb"> 自 定 义 原 因        </button></span></p>';     
        down_btn_html += '</div>';    
        down_btn_html += '</div>';   
  
$("p:eq(3)").before(down_btn_html); //将以上的html代码插入到网页里的第一个P标签中
  
  
  var imges = document.getElementsByTagName('img');//单击图片即可放大
 imges[0].click();
 imges[1].click();
 imges[2].click();
 imges[3].click();
 imges[4].click();
 imges[5].click();
 imges[6].click();
  

  
    var obj = document.getElementsByClassName("aaaa"); //移动到确认，返回按钮的效果
    for(var i = 0; i < obj.length; i ++) {
        if (obj[i].type.toLowerCase() == 'button') {
            obj[i].onmouseover = function() {
                this.style.backgroundColor = '#40A9FF';
                this.style.color = '#FFFFFF';
            }
            obj[i].onmouseout = function() {
                this.style.backgroundColor = '#1890FF';
                this.style.color = '#FFFFFF';
            }
        }
    }
  

    var obj = document.getElementsByClassName("bbbb");//移动到未通过按钮的效果
    for(var i = 0; i < obj.length; i ++) {
        if (obj[i].type.toLowerCase() == 'button') {
            obj[i].onmouseover = function() {
                this.style.backgroundColor = '#FF4D4F';
                this.style.color = '#F5F5F5';
            }
            obj[i].onmouseout = function() {
                this.style.backgroundColor = '#F5F5F5';
                this.style.color = '#FF4D4F';
            }
        }
    }
  
 

$("#re1").click(function(){ //点击按钮id=re1 的功能
   var url1 = window.location.href;
        
         clearInterval(start);//停止功能start 
    $(".ant-btn.ant-btn-primary").trigger("click");
  
setTimeout(function(){ 
 var btns = document.getElementsByClassName("ant-btn");      
if(btns.length<5){
   aaa=setInterval(ff,300)//重新开始功能2  
}else{
  
   btns[5].style.backgroundColor = '#32CD32';
   setTimeout(function(){//1020毫秒后运行下列程序   一次 
   btns[5].style.backgroundColor = '#1890FF';
    btns[5].click();
   },200);   
  

    setTimeout(function(){          
      window.location.href = "https://h5hyt.cd120.com/admin/realname/card/list";//跳转到主页 
      	  },820); 

}  
      

  },420); 


  
});
  

$("#re2").click(function(){ //点击按钮id=re2 的功能
        console.log('返回');


    // var btns = document.getElementsByClassName("ant-btn");  
    // btns[3].click();

 var url_home = "https://h5hyt.cd120.com/admin/realname/card/list";//你要跳的链接
 window.location.href = url_home;//跳转到主页


});  
  
 


  
$("#re3").click(function(){ //点击按钮id=re3 的功能
 //aaa=setInterval(f,11000)//重新开始定时器判断

   aaa=setInterval(ff,300)//重新开始功能2
 setTimeout(function(){//1020毫秒后运行下列程序   一次

$(".ant-btn.ant-btn-danger").trigger("click");
var editorWin=document.getElementById('failReason').contentWindow; 
    $("#failReason").focus().trigger("click");
  //  $("#failReason").select; //选择全部文本
   
$('#failReason').val('您未上传手持证件照，请您展示全脸并手持身份证合拍照片，重新上传或者使用人脸识别的功能进行验证'); //设置value文本为*****
     //setTimeout(function(){//1020毫秒后运行下列程序   一次
         // $(".ant-btn.ant-btn-primary").click();  //点击确认
      	 //  },1020);    
function sendkey(keychar){                     //模拟按键点击触发textarea监听的oninput事件（不起作用）
var ev = document.createEvent("KeyboardEvent");//模拟按键点击触发textarea监听的oninput事件（不起作用）
var keycode = keychar.charCodeAt();            //模拟按键点击触发textarea监听的oninput事件（不起作用）
ev.initKeyEvent("keydown", true, true, null, 0, 0, 0, 0,keycode,keychar);
document.dispatchEvent(ev);                     
}
  
   
   
 	  },220);   
});
  

$("#re4").click(function(){//点击按钮id=re4 的功能
 //aaa=setInterval(f,11000)//重新开始定时器判断
   aaa=setInterval(ff,300)//重新开始功能2
 setTimeout(function(){//1020毫秒后运行下列程序   一次

$(".ant-btn.ant-btn-danger").trigger("click");
var editorWin=document.getElementById('failReason').contentWindow;  
    $("#failReason").focus().trigger("click");
$('#failReason').val('您上传的手持证件照未符合要求（请您展示全脸并手持身份证合拍照片），请您重新上传或者使用人脸识别的功能进行验证。'); //设置value文本为*****
     //setTimeout(function(){//1020毫秒后运行下列程序   一次
         // $(".ant-btn.ant-btn-primary").click();  //点击确认
      	 //  },1020);    

 	  },220);     
  
});
  
  

$("#re5").click(function(){//点击按钮id=re5 的功能
 // aaa=setInterval(f,100)//重新开始定时器判断
   aaa=setInterval(ff,300)//重新开始功能2
 setTimeout(function(){//1020毫秒后运行下列程序   一次

$(".ant-btn.ant-btn-danger").trigger("click");
var editorWin=document.getElementById('failReason');
$("#failReason").focus().trigger("click");
$('#failReason').val('翻拍的身份证，无法判断是否是本人注册，请本人重新用实体身份证拍摄上传。建议使用人脸识别的功能进行验证'); //设置value文本为*****  
     //setTimeout(function(){//1020毫秒后运行下列程序   一次
         // $(".ant-btn.ant-btn-primary").click();  //点击确认
      	 //  },1020);   
   
 	  },220);     
  

});
  
  

$("#re6").click(function(){//点击按钮id=re6的功能
 // aaa=setInterval(f,100)//重新开始定时器判断 
   aaa=setInterval(ff,300)//重新开始功能2
 setTimeout(function(){//1020毫秒后运行下列程序   一次

$(".ant-btn.ant-btn-danger").click(); 
    $("#failReason").focus().trigger("click");
$('#failReason').val('您上传的证件照的信息不清晰或被遮挡（请保持证件照清晰的展示了全部信息），建议使用人脸识别的功能进行验证'); //设置value文本为*****
     //setTimeout(function(){//1020毫秒后运行下列程序   一次
         // $(".ant-btn.ant-btn-primary").click();  //点击确认
      	 //  },1020);    

 	  },220);     
    
 
});
  
  
  
  
$("#re7").click(function(){//点击按钮id=re7 的功能
  // aaa=setInterval(f,100)//重新开始定时器判断 
   aaa=setInterval(ff,300)//重新开始功能2
 setTimeout(function(){//1020毫秒后运行下列程序   一次

$(".ant-btn.ant-btn-danger").click();
var editorWin=document.getElementById('failReason').contentWindow;
    
      document.getElementById('failReason').focus()  
    
$('#failReason').val('您注册电子就诊卡的证件号与实名证件信息不匹配（请保持注册证件与实名证件信息统一，无身份证可使用户口簿或出生证），建议人脸识别的功能进行验证'); //设置value文本为*****
     //setTimeout(function(){//1020毫秒后运行下列程序   一次
         // $(".ant-btn.ant-btn-primary").click();  //点击确认
      	 //  },1020);    

 	  },220);     
     

  
});

  
  $("#re8").click(function(){//点击按钮id=re7 的功能
  // aaa=setInterval(f,100)//重新开始定时器判断 
   aaa=setInterval(ff,300)//重新开始功能2
 setTimeout(function(){//1020毫秒后运行下列程序   一次

$(".ant-btn.ant-btn-danger").click();
var editorWin=document.getElementById('failReason').contentWindow;
    
      document.getElementById('failReason').focus()
    document.getElementById('failReason').value = window.localStorage.getItem("upload5")  //设置value文本为*****
     //setTimeout(function(){//1020毫秒后运行下列程序   一次
         // $(".ant-btn.ant-btn-primary").click();  //点击确认
      	 //  },1020);    

 	  },220);     
     

  
});
  
  
$("#xxxxxxxxxxx").click(function(){//点击按钮id=xxxxxxxxxxx 的功能
  
$(".ant-btn.ant-btn-primary").click();
 setTimeout(function(){//1020毫秒后运行下列程序   一次
          $(".ant-btn.ant-btn-primary").click();
   if(url.indexOf("//h5hyt.cd120.com/admin/realname/card/list") <= 0 ){
            setTimeout(function(){//1020毫秒后运行下列程序   一次
       window.location.href = "https://h5hyt.cd120.com/admin/realname/card/list"
      	  },1020);    
    }
 	  },220);  
  
  
});  
  
$("#xxxxxxxxxxx").click(function(){//点击按钮id=xxxxxxxxxxx 的功能
  $("p").remove(); //全局判断按钮被点击
});  
  
  


  
  



//Action for checked

  
　$(document).keydown(function(event){
    if (localStorage.getItem("kuaijie") != null) {
	      //自定义代码
	  alert('快捷功能没有开启，请开启后重试');
	  }
   else{

          
   if (event.keyCode == 103){
     //  $("a")[2].click();  //自动点击详情

   }
　　　else if(event.keyCode == 97){
   document.getElementById("re3").style.backgroundColor = '#FF4D4F';
        document.getElementById("re3").style.opacity="0.3";
   setTimeout(function(){//1020毫秒后运行下列程序   一次 
   document.getElementById("re3").style.backgroundColor = '#F5F5F5';
   document.getElementById("re3").style.opacity="1";
   },100); 

　　　　　　$("#re3").click();

　　　　}else if (event.keyCode == 98){
   document.getElementById("re4").style.backgroundColor = '#FF4D4F';
   document.getElementById("re4").style.opacity="0.3";
   setTimeout(function(){//1020毫秒后运行下列程序   一次 
   document.getElementById("re4").style.backgroundColor = '#F5F5F5';
   document.getElementById("re4").style.opacity="1";
   },100); 
		$("#re4").click();
   }
      else if (event.keyCode == 99){
   document.getElementById("re5").style.backgroundColor = '#FF4D4F';
   document.getElementById("re5").style.opacity="0.3";
   setTimeout(function(){//1020毫秒后运行下列程序   一次 
   document.getElementById("re5").style.backgroundColor = '#F5F5F5';
   document.getElementById("re5").style.opacity="1";
   },100); 
		$("#re5").click();
　　}
        else if (event.keyCode == 100){
   document.getElementById("re6").style.backgroundColor = '#FF4D4F';
   document.getElementById("re6").style.opacity="0.3";
   setTimeout(function(){//1020毫秒后运行下列程序   一次 
   document.getElementById("re6").style.backgroundColor = '#F5F5F5';
   document.getElementById("re6").style.opacity="1"; 
   },100); 
		$("#re6").click();
　　}
          else if (event.keyCode == 101){
   document.getElementById("re7").style.backgroundColor = '#FF4D4F';
   document.getElementById("re7").style.opacity="0.3";
   setTimeout(function(){//1020毫秒后运行下列程序   一次 
   document.getElementById("re7").style.backgroundColor = '#F5F5F5';
   document.getElementById("re7").style.opacity="1";
    },100);
		$("#re7").click();
　　}
           else if (event.keyCode == 102){
   document.getElementById("re8").style.backgroundColor = '#FF4D4F';
   document.getElementById("re8").style.opacity="0.3";
   setTimeout(function(){//1020毫秒后运行下列程序   一次 
   document.getElementById("re8").style.backgroundColor = '#F5F5F5';
   document.getElementById("re8").style.opacity="1";
    },100);
		$("#re8").click();
　　}
            else if (event.keyCode == 37){      //按左← 键返回
   document.getElementById("re2").style.backgroundColor = '#40A9FF';
   document.getElementById("re2").style.opacity="0.3";
   setTimeout(function(){//1020毫秒后运行下列程序   一次 
   document.getElementById("re2").style.backgroundColor = '#1890FF';
   document.getElementById("re2").style.opacity="1";
    },100);
		$("#re2").click();
　　}
               else if (event.keyCode == 107){

                 var url1 = window.location.href;            //按+键调往下一个ID
                     var sec = url1.split("?")[1].split("&")[0].split("=")[1];
                     var num =  Number(sec)
                   var num2 = num + 1

                     var url_Id = "https://h5hyt.cd120.com/admin/realname/card/detail?id="+num2;//你要跳的链接加id
                       var url_Id2 = url_Id+"&status=1&realnameType=MC&tabStatus=1"  //你要跳的链接加id+1
                          window.location.href = url_Id2;//跳转 
            
　　}
              else if (event.keyCode == 96){   //按0确认
   document.getElementById("re1").style.backgroundColor = '#40A9FF';
   document.getElementById("re1").style.opacity="0.3";
   setTimeout(function(){//1020毫秒后运行下列程序   一次 
   document.getElementById("re1").style.backgroundColor = '#1890FF';
   document.getElementById("re1").style.opacity="1";
    },100);
		$("#re1").click();
　　　　}
                 else if (event.keyCode == 13){   //按回车确认


setTimeout(function(){ 
 var btns = document.getElementsByClassName("ant-btn");      
if(btns.length<5){
     setTimeout(function(){
      $(".ant-btn.ant-btn-primary").click();
     },100);   
}else{
   btns[5].style.backgroundColor = '#00FFFF';
   setTimeout(function(){//1020毫秒后运行下列程序   一次 
   btns[5].style.backgroundColor = '#1890FF';
   btns[5].click();
   },200); 

    setTimeout(function(){
     //btns[5].click();    // 延时点击确认，防止点错（已取消）
      	  },420); 

}  
      

  },100); 



　　　　}

     
     }      

　　});  
 
 
  

  
  
  
  
     }                             				
   },220);   
}     

     
