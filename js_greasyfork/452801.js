// ==UserScript==
// @name         jdff按钮版
// @namespace    http://FR1.FR/
// @version      0.37
// @description  Fr
// @author       Fr
// @match        *://sz.jd.com/sz/view/singleAnalysis/*
// @match        *://sz.jd.com/sz/view/competitionAnalysis/*
// @match        *://sz.jd.com/sz/view/dealAnalysis/*
// @match        *://ppzh.jd.com/brand/industry/*
// @match        *://ppzh.jd.com/brandweb/brand/view/industry/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452801/jdff%E6%8C%89%E9%92%AE%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/452801/jdff%E6%8C%89%E9%92%AE%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const button1 = document.createElement('button')
  button1.setAttribute('id', 'jd0')
  button1.setAttribute('style', 'width: 100px;height: 38px;color:white;background-color:#446dff;border-radius: 3px;border-width: 0;margin: 0;font-size: 17px;text-align: center;cursor: pointer;margin-right:2cm;outline:none;position: fixed;left:4rem;bottom:30rem;z-index:99999')
  button1.innerText = '一键下载'
    const body = document.querySelector('body')
    body.appendChild(button1)
    const jd0 = document.querySelector("#jd0")

var oldxhr=window.XMLHttpRequest
function newobj(){}

window.XMLHttpRequest=function(){
    let tagetobk=new newobj();
    tagetobk.oldxhr=new oldxhr();
    let handle={
        get: function(target, prop, receiver) {
            if(prop==='oldxhr'){
                return Reflect.get(target,prop);
            }
            if(typeof Reflect.get(target.oldxhr,prop)==='function')
            {
                if(Reflect.get(target.oldxhr,prop+'proxy')===undefined)
                {
                    target.oldxhr[prop+'proxy']=(...funcargs)=> {
                        let result=target.oldxhr[prop].call(target.oldxhr,...funcargs)
                        //console.log('函数劫持获取结果',result)
                        return result;
                    }

                }
                return Reflect.get(target.oldxhr,prop+'proxy')
            }

            if(prop.indexOf('response')!==-1)
            {


                //if(Reflect.get(target.oldxhr,prop).includes("GoodsVisitorNum"))
                if (target.oldxhr.responseURL.includes("getSingleProSourceTrendData"))
            {


function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = target.oldxhr.responseURL.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function encodeChineseString(chineseString) {
  var encodedString = "";
  for (var i = 0; i < chineseString.length; i++) {
    // 获取当前字符的 Unicode 编码并将其转化为十六进制形式
    var charCode = chineseString.charCodeAt(i).toString(16);
    // 将十六进制形式的 Unicode 编码与百分号拼接，再拼接起来等待传输。
    encodedString += "%" + charCode;
  }
  return encodedString;
}

                //alert(Reflect.get(target.oldxhr,prop))
                //alert("SPU：（"+GetQueryString("spuId")+"）时间：（"+GetQueryString("startDate")+"-"+GetQueryString("endDate")+"）");
var jsontext = Reflect.get(target.oldxhr,prop);
  jd0.addEventListener('click', function () {
var postForm = document.createElement("form");//表单对象
postForm.method="post" ;
postForm.action = "https://jkn.atjd.top/renqun/jdff.php?jianhua=1&flow="+ encodeChineseString(GetQueryString("flow"))+"&spuId="+ GetQueryString("spuId");
var jsontextInput = document.createElement("input") ; //jsontext input
jsontextInput.setAttribute("name", "jsontext") ;
jsontextInput.setAttribute("value", jsontext);
postForm.appendChild(jsontextInput) ;
postForm.target = "_blank";
document.body.appendChild(postForm) ;
postForm.submit() ;
document.body.removeChild(postForm) ;
  })

            }
                   if (target.oldxhr.responseURL.includes("getSingleProTrendData"))
            {

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = target.oldxhr.responseURL.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

                //alert(Reflect.get(target.oldxhr,prop))
                //alert("SPU：（"+GetQueryString("spuId")+"）时间：（"+GetQueryString("startDate")+"-"+GetQueryString("endDate")+"）");
var jsontext = Reflect.get(target.oldxhr,prop);
  jd0.addEventListener('click', function () {
var postForm = document.createElement("form");//表单对象
postForm.method="post" ;
postForm.action = "https://jkn.atjd.top/renqun/jdff.php?jianhua=1&spuId="+ GetQueryString("spuId");
var jsontextInput = document.createElement("input") ; //jsontext input
jsontextInput.setAttribute("name", "jsontext") ;
jsontextInput.setAttribute("value", jsontext);
postForm.appendChild(jsontextInput) ;
postForm.target = "_blank";
document.body.appendChild(postForm) ;
postForm.submit() ;
document.body.removeChild(postForm) ;
  })

            }





                   if (target.oldxhr.responseURL.includes("getTrendData"))
            {

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = target.oldxhr.responseURL.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

                //alert(Reflect.get(target.oldxhr,prop))
                //alert("SPU：（"+GetQueryString("date")+"）时间：（"+GetQueryString("startDate")+"-"+GetQueryString("endDate")+"）");
var jsontext = Reflect.get(target.oldxhr,prop);
  jd0.addEventListener('click', function () {
var postForm = document.createElement("form");//表单对象
postForm.method="post" ;
postForm.action = "https://jkn.atjd.top/renqun/jdjiaoyi.php?jianhua=1&date="+ GetQueryString("date");
var jsontextInput = document.createElement("input") ; //jsontext input
jsontextInput.setAttribute("name", "jsontext") ;
jsontextInput.setAttribute("value", jsontext);
postForm.appendChild(jsontextInput) ;
postForm.target = "_blank";
document.body.appendChild(postForm) ;
postForm.submit() ;
document.body.removeChild(postForm) ;
  })

            }









                   if (target.oldxhr.responseURL.includes("getCompetitionShopDetail"))
            {

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = target.oldxhr.responseURL.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
                //alert(Reflect.get(target.oldxhr,prop))

var jsontext = Reflect.get(target.oldxhr,prop);
  jd0.addEventListener('click', function () {
var postForm = document.createElement("form");//表单对象
postForm.method="post" ;
postForm.action = "https://jkn.atjd.top/renqun/jingdian.php?time="+ Math.round(new Date() / 1000)+"&startDate="+ GetQueryString("startDate")+"&endDate="+ GetQueryString("endDate");
var jsontextInput = document.createElement("input") ; //jsontext input
jsontextInput.setAttribute("name", "jsontext") ;
jsontextInput.setAttribute("value", jsontext);
postForm.appendChild(jsontextInput) ;
postForm.target = "_blank";
document.body.appendChild(postForm) ;
postForm.submit() ;
document.body.removeChild(postForm) ;
  })

            }


                   if (target.oldxhr.responseURL.includes("getTwoPieChart"))
            {

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = target.oldxhr.responseURL.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
                //alert(Reflect.get(target.oldxhr,prop))

var jsontext = Reflect.get(target.oldxhr,prop);
  jd0.addEventListener('click', function () {
var postForm = document.createElement("form");//表单对象
postForm.method="post" ;
postForm.action = "https://jkn.atjd.top/renqun/ppjdtz.php?type=getTwoPieChart&Date="+ GetQueryString("date")+"&startDate="+ GetQueryString("startDate")+"&endDate="+ GetQueryString("endDate");
var jsontextInput = document.createElement("input") ; //jsontext input
jsontextInput.setAttribute("name", "jsontext") ;
jsontextInput.setAttribute("value", jsontext);
postForm.appendChild(jsontextInput) ;
postForm.target = "_blank";
document.body.appendChild(postForm) ;
postForm.submit() ;
document.body.removeChild(postForm) ;
  })

            }



                   if (target.oldxhr.responseURL.includes("getBrandGridData"))
            {

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = target.oldxhr.responseURL.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
                //alert(Reflect.get(target.oldxhr,prop))

var jsontext = Reflect.get(target.oldxhr,prop);
  jd0.addEventListener('click', function () {
var postForm = document.createElement("form");//表单对象
postForm.method="post" ;
postForm.action = "https://jkn.atjd.top/renqun/jdbrandweb.php?thirdCategoryId="+ GetQueryString("thirdCategoryId")+"&Date="+ GetQueryString("date")+"&startDate="+ GetQueryString("startDate")+"&endDate="+ GetQueryString("endDate");
var jsontextInput = document.createElement("input") ; //jsontext input
jsontextInput.setAttribute("name", "jsontext") ;
jsontextInput.setAttribute("value", jsontext);
postForm.appendChild(jsontextInput) ;
postForm.target = "_blank";
document.body.appendChild(postForm) ;
postForm.submit() ;
document.body.removeChild(postForm) ;
  })

            }






                return Reflect.get(target.oldxhr,prop)
             }



            return Reflect.get(target.oldxhr,prop);
        },
        set(target, prop, value) {
            return Reflect.set(target.oldxhr, prop, value);
        },
        has(target, key) {
            debugger;
            return Reflect.has(target.oldxhr,key);
        }
    }

    let ret = new Proxy(tagetobk, handle);

    return ret;
}
    // Your code here...
})();