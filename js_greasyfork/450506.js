// ==UserScript==
// @name         无线U盘页面美化
// @namespace    https://www.liuzhixi.cn/
// @version      1.2
// @description  无线U盘用户页面美化，传输文件远离枯燥
// @author       刘执喜
// @match        *
// @icon         https://www.west.cn/Customercenter/UploadImages/milogo/2208/k2Nvh4s46b77k3V7.png
// @grant        GM_addStyle
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/450506/%E6%97%A0%E7%BA%BFU%E7%9B%98%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/450506/%E6%97%A0%E7%BA%BFU%E7%9B%98%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==
function addStyle() {
    let css = `
    #CMDReturn {
    word-wrap: break-word;
    word-break: break-all;
    max-width: 130px;
    }
    html.tme1{
        background: #ffffff;
        color: #444444;
        font-size: 14px;
        line-height: 1.5;
    }
    html.tme1 body{
    width: 400px;
    display: block;
    margin: 0 auto;
    background: #ecf0f3;
    box-shadow: 14px 14px 20px #cbced1, -14px -14px 20px white;
    padding: 50px 30px;
    border-radius: 10px;
    margin-top: 100px;
    font-weight: 300;
    }
    html.tme1 button, html.tme1 input{
    border-radius: 10px;
    border: none;
    padding: 3px 10px;
    }
    html.tme1 #file{
    padding-left: 0;
    }
    html.tme1 .box1{
    margin-top: 20px;
    }
    html.tme1 #machine{
    float: left;
    margin-right: 10px;
    }
    html.tme1 #tmebtn{
    float: right;
    }
    html.tme1 #tmebtn img{
    width:40px;
    cursor:pointer
    }






    html.tme2{
        background-image: url("//www.liuzhixi.cn/bing.php");
        background-size: cover;
        background-repeat: no-repeat;
    }
    html.tme2 body{
    width: 400px;
    display: block;
    margin: 0 auto;
    background-color: #0e0e0e5e;
    padding: 50px 30px;
    color: #ffffff;
    border-radius: 10px;
    margin-top: 100px;
    font-weight: 300;
    }
    html.tme2 button, html.tme1 input{
    border-radius: 10px;
    border: none;
    padding: 3px 10px;
    }
    html.tme2 #file{
    padding-left: 0;
    }
    html.tme2 .box1{
    margin-top: 20px;
    }
    html.tme2 #machine{
    float: left;
    margin-right: 10px;
    }
    html.tme2 #tmebtn{
    float: right;
    }
    html.tme2 #tmebtn img{
    width:40px;
    cursor:pointer
    }
    `;
    GM_addStyle(css);

}
(function () {
    'use strict';
     let host=window.location.host;
     if(host.indexOf("192.168.")>-1){
      addStyle();
}
let tmebtn = document.createElement("div");
let tmebtnimg = document.createElement("img");
let htmlcen = document.getElementsByTagName("html")[0];
let bodycen = document.getElementsByTagName("body")[0];
//let tmebtnimgico =
tmebtn.id = "tmebtn";
tmebtnimg.src = "https://www.west.cn/Customercenter/UploadImages/milogo/2208/k2Nvh4s46b77k3V7.png";
bodycen.appendChild(tmebtn);
tmebtn.appendChild(tmebtnimg);


if(!getCookie("zhuti") || getCookie("zhuti")=="1"){
        htmlcen.classList.add('tme1');
        htmlcen.classList.remove('tme2');
        tmebtn.addEventListener('click', function(){
            setCookie('zhuti','2',30);
            location.reload();
        });

}else if(!getCookie("zhuti") || getCookie("zhuti")=="2"){
        htmlcen.classList.add('tme2');
        htmlcen.classList.remove('tme1');
        tmebtn.addEventListener('click', function(){
            setCookie('zhuti','1',30);
            location.reload();
        });

}else{
    htmlcen.classList.add('tme1');
    htmlcen.classList.remove('tme2');
}


function setCookie(c_name, value, expiredays){
 　　　var exdate=new Date();
　　　　exdate.setDate(exdate.getDate() + expiredays);
　　　　document.cookie=c_name+ "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}

//读取cookies
function getCookie(name){
 var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 if(arr=document.cookie.match(reg))
  return (arr[2]);
 else
  return null;
}

//删除cookies
function delCookie(name){
 var exp = new Date();
 exp.setTime(exp.getTime() - 1);
 var cval=getCookie(name);
 if(cval!=null)
  document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}


})();