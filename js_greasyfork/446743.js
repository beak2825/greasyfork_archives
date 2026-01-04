// ==UserScript==
// @name          C++选择题答题助手(进阶)
// @license MIT
// @namespace     http://39.101.206.248:808/student/studxlx.aspx
// @version      1.0.2
// @description  自动答题
// @author       mukes
// @include     http://39.101.206.248:808/student/studxlx.aspx
// @include     http://39.101.206.248:808/student/studxlx.aspx
// @downloadURL https://update.greasyfork.org/scripts/446743/C%2B%2B%E9%80%89%E6%8B%A9%E9%A2%98%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%28%E8%BF%9B%E9%98%B6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/446743/C%2B%2B%E9%80%89%E6%8B%A9%E9%A2%98%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B%28%E8%BF%9B%E9%98%B6%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var button = document.createElement("button"); //创建一个按钮
    button.textContent = "显示答案"; //按钮内容
    button.style.width = "90px"; //按钮宽度
    button.style.height = "28px"; //按钮高度
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    button.style.background = "#e33e33"; //按钮底色
    button.style.border = "1px solid #e33e33"; //边框属性
    button.style.borderRadius = "4px"; //按钮四个角弧度
    button.type="button";
    button.addEventListener("click", clickBotton) //监听按钮点击事件
    var p= document.createElement("p");
var input= document.createElement("input");
    input.id="input";

    function clickBotton(){
        setTimeout(function(){

       
            
            var script = document.getElementsByTagName( 'script' );
    console.log(script);

var text = script[4].textContent;
     console.log(text);
    var tt=text.toString();
    var as=tt.indexOf("answer=");
    var ree=tt.substring(as+8,as+8+25);
    console.log("as"+as);
     console.log(ree);

            var answer=ree;

	for(var a=1;a<=25;a++){

	var ac=answer[a-1];
	var xradio = document.getElementsByName("ctl00$ContentPlaceHolder1$cbk"+a);
                    for(var i=0;i<xradio.length;i++){

                        if(xradio[i].value == ac){
                           xradio[i].checked = true;


                          var add= xradio[i].parentNode ;


                          add.setAttribute('style', 'background:#A8A8A8;');

                            break;
                        }}
   }

},100);// setTimeout 0.1秒后执行
    }


    var like_comment = document.getElementById('ctl00_ContentPlaceHolder1_Panel1'); //getElementsByClassName 返回的是数组，所以要用[] 下标

//把按钮加入到 x 的子节点中
like_comment.prepend(p);

    p.prepend(button);

    var ab=document.getElementsByTagName("strong");
var type=document.getElementById("ctl00_ContentPlaceHolder1_lblCourse").textContent;
    console.log(type);
    var ewq;
    if (type="Python程序设计"){
    ewq=2;
        console.log(ewq);
    }
   /* for(var i=0;i<ab.length;i++){
    console.log(ab[i].innerText.toString());

    }*/
    var iup=1;
    var q=0;
while(iup<ab.length){
    var cc=ab[iup].innerHTML.toString(); console.log(cc)
    var dd=cc.indexOf("<blockquote>");
    console.log(dd);
    var ew=cc.indexOf("、");
    var tu=dd-2;
    var tt=cc.substr(ew+1,tu);
     var lo="<";
    var df=tt.charAt(tt.length-1);
    console.log("df:"+df);
    if(df==lo){
   tt=tt.substring(0,tt.length-1);
          console.log("duoyu");
    }
    console.log(tt);
    var script = document.getElementsByTagName( 'script' );
   // console.log(script);

var text = script[4].textContent;
    // console.log(text);
    var tet=text.toString();
    var as=tet.indexOf("answer=");
    var ree=tet.substring(as+8,as+8+25);
    var answer=ree;
  var o=parseInt(answer[q]);
    var iu=ab[iup+o].innerText.toString();
    console.log(iu);
var ii=iu.substring(4,iu.length);
    console.log(ii);

/*$.ajax({
		type : "POST",
		async : false,
		url : "http://www.heustudent.xyz/jiaoben"+ewq+"/jiaru",//写入数据库的接口
		data: {"timu":tt,
               "daan":ii

              },//serve为HTML某个组件的id即你想提交的值
		success : function(data) {
	  		    },//这里是提交，不考虑返回值
	   });*/
      console.log("o"+o);
    iup=iup+o+(4-o)+2;
    q=q+1;
    console.log("iup"+iup);
        console.log("q"+q);
 }

})(); //(function(){})() 表示该函数立即执行

