// ==UserScript==
// @name       百度排名显示V2
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  查看百度排名位置
// @author       子牙
// @license MIT
// @match       https://www.baidu.com/s*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @downloadURL https://update.greasyfork.org/scripts/498494/%E7%99%BE%E5%BA%A6%E6%8E%92%E5%90%8D%E6%98%BE%E7%A4%BAV2.user.js
// @updateURL https://update.greasyfork.org/scripts/498494/%E7%99%BE%E5%BA%A6%E6%8E%92%E5%90%8D%E6%98%BE%E7%A4%BAV2.meta.js
// ==/UserScript==


// 全局变量存储域名数组
var domainsArray = [];
var domainstwo =[];

fetch('https://bfzyseo.jiang-cheng.com/js/domains.php?s=202406211134')
  .then(response => response.json())
  .then(data => {
    domainsArray = data.domains1.split(",");
    domainstwo = data.domains2.split(",");
  })
  .catch(error => console.error('Error fetching data:', error));

// 在fetch之外使用domainsArray
console.log(domainsArray);

function addNewStyle(newStyle) {
    var styleElement = document.getElementById('styles_js');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = 'styles_js';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
    }
    styleElement.appendChild(document.createTextNode(newStyle));
}
function getDomain(url){
    url = url + "/"
	var domain = url.split('/'); //以“/”进行分割
	if (domain[2]) {
		domain = domain[2];
	} else {
		domain = ''; //如果url不正确就取空
	}
	return domain;
}
function paiming(styleid){
    var name = document.getElementsByClassName(styleid);
    //获取name为lid所有元素节点Name[0];            //”hello”
    var sum = 0
    //alert(name.length)
    for(var i=0;i<name.length;i++){
        var id = name[i].id
        var icon = ''

        try{
            var zsurl = name[i].attributes["mu"].value;
        }catch(e){
            zsurl =""
        }
        if(zsurl != ""){
            try{
                var domain = getDomain(zsurl).toString()
                }catch(e){
                    domain =""
                }
            if(domain!=""){
                //alert(domain)
                if(zsurl.indexOf("info.b2b168.com") != -1 || zsurl.indexOf("info.b2b168.net") != -1) {
                    name[i].setAttribute('style', 'border-style:dashed!important;border-color:red;clear: both;');
                    icon = "<span>八供</span>"
                }
                else if(zsurl.indexOf(".b2b168.com") != -1 || zsurl.indexOf(".b2b168.net") != -1) {
                    name[i].setAttribute('style', 'border-style:dashed!important;border-color:red;clear: both;');
                    icon = "<span>八商</span>"
                }
                else if(zsurl.indexOf(".qiugouxinxi.net") != -1) {
                    name[i].setAttribute('style', 'border-style:dashed!important;border-color:red;clear: both;');
                    icon = "<span>阿德</span>"
                }
                else{
                    //alert(domainsArray.length)
                    for (var ii = 0; ii < domainsArray.length; ii++) {
                        var domain2 = domainsArray[ii].replace(/'/g, '').trim();
                        var domain3 = "www."+domain2;
                        console.log(domain2);

                        //var domain2 = "."+domains[ii].toString()
                        //var domain3 = "www."+domains[ii].toString()
                        if (domain2 == domain){
                            name[i].setAttribute('style', 'border-style:dashed!important;border-color:red;clear: both;');
                            icon = "<span>官主</span>"
                            break;
                        }
                        else if (domain == domain3){
                            name[i].setAttribute('style', 'border-style:dashed!important;border-color:red;clear: both;');
                            icon = "<span>官主</span>"
                            break;
                        }
                        else if(domain.indexOf(domain2) != -1){
                            name[i].setAttribute('style', 'border-style:dashed!important;border-color:red;clear: both;');
                            icon = "<span>官子</span>"
                            break;
                        }
                    };
                }
            }
        }
        try{
            name[i].querySelector(".paiming").remove();
        }catch(e){
            //错误
        }
        try{
            name[i].querySelector(".zsurl").remove();
        }catch(e){
            //错误
        }

        //alert(zsurl)
        var height = "-" + name[i].offsetHeight + "px"
        var span=document.createElement("div");
        span.className ="paiming";
        span.style.color="blue";
        span.style.top=height;
        span.style.left="-60px";
        span.style.width="50px";
        span.style.height="0";
        span.style.position="relative";
        span.innerHTML="<span>排名</span><span>"+id+"</span>"+icon
        name[i].appendChild(span);

        var span2=document.createElement("div");
        span2.className ="zsurl";
        span2.style.color="blue";
        span2.style.top="0";
        span2.style.position="relative";
        span2.innerHTML="<a href=\""+zsurl+"\" target=\"_blank\">"+zsurl+"</span>"
        name[i].appendChild(span2);
        addNewStyle('.paiming > span:nth-child(1){text-align: center;display: block;font-size: 16px;background-color: #388bff;color: white;line-height: 26px;height: 26px;}'+
                    '.paiming > span:nth-child(2){text-align: center;display: block;font-size: 20px;background-color: #f73131;color: white;line-height: 30px;height: 30px;}'+
                    '.paiming > span:nth-child(3){text-align: center;display: block;font-size: 20px;background-color: #4e6ef2;color: white;line-height: 30px;height: 30px;}');
    }
}


function jingjia(styleid){
    var name = document.getElementsByClassName(styleid);
    //获取name为lid所有元素节点Name[0];            //”hello”
    var sum = 0
    //alert(name.length)
    for(var i=0;i<name.length;i++){
        var id = name[i].id
        var icon = ''

        try{
            var zsurl = name[i].attributes["data-lp"].value;
            zsurl = decodeURIComponent(zsurl)
        }catch(e){
            zsurl =""
        }
        if(zsurl != ""){
            try{
                var domain = getDomain(zsurl).toString()
                }catch(e){
                    domain =""
                }
            if(domain!=""){
                //alert(domain)
                if(zsurl.indexOf("bd168.zhongshang114.com") != -1) {
                    name[i].setAttribute('style', 'border-style:dashed!important;border-color:red;clear: both;');
                    icon = "<span>中商</span><span>八方网站</span>"
                }
                else if(zsurl.indexOf("hongshang114.com") != -1) {
                    name[i].setAttribute('style', 'border-style:dashed!important;border-color:red;clear: both;');
                    icon = "<span>中商</span><span>114官网</span>"
                }
                else if(zsurl.indexOf("www.shangjimall.com") != -1) {
                    name[i].setAttribute('style', 'border-style:dashed!important;border-color:red;clear: both;');
                    icon = "<span>中商</span><span>三方</span>"
                }
                else if(zsurl.indexOf("isite.baidu.com") != -1) {
                    zsurl = "<a href='"+zsurl+"' target='_blank'>基木鱼落地页</a>"
                }
                else if(zsurl.indexOf("wejianzhan.com") != -1) {
                    zsurl = "<a href='"+zsurl+"' target='_blank'>基木鱼落地页</a>"
                }
                else if(zsurl.indexOf("baixing.cn") != -1 || zsurl.indexOf("baixing.com") != -1) {
                    name[i].setAttribute('style', 'border-style:dashed!important;border-color:#FFA500;clear: both;');
                    icon = "<span>百姓</span><span>三方</span>"
                }else{
                    //alert(domainstwo.length)
                    for(var ii=0;ii < domainstwo.length;ii++){
                        var domain2 = "."+domainstwo[ii].toString()
                        var domain3 = "www."+domainstwo[ii].toString()
                        if (domainstwo[ii] == domain || domain == domain3||domain.indexOf(domain2) != -1){
                            name[i].setAttribute('style', 'border-style:dashed!important;border-color:red;clear: both;');
                            icon = "<span>官网</span>"
                            break;
                        }
                    };
                }
            }
        }
        try{
            name[i].querySelector(".paiming").remove();
        }catch(e){
            //错误
        }
        try{
            name[i].querySelector(".zsurl").remove();
        }catch(e){
            //错误
        }
        var height = "-" + name[i].offsetHeight + "px"
        var span=document.createElement("div");
        span.className ="paiming";
        span.style.color="blue";
        span.style.top=height;
        span.style.left="-60px";
        span.style.width="50px";
        span.style.height="0";
        span.style.position="relative";
        span.innerHTML="<span>竞价</span>"+icon
        name[i].appendChild(span);

        var span2=document.createElement("div");
        span2.className ="zsurl";
        span2.style.color="blue";
        span2.style.top="0";
        span2.style.position="relative";
        span2.innerHTML="<a href=\""+zsurl+"\" target=\"_blank\">"+zsurl+"</span>"
        name[i].appendChild(span2);
        addNewStyle('.paiming > span:nth-child(1){text-align: center;display: block;font-size: 16px;background-color: #388bff;color: white;line-height: 26px;height: 26px;}'+
                    '.paiming > span:nth-child(2){text-align: center;display: block;font-size: 20px;background-color: #f73131;color: white;line-height: 30px;height: 30px;}'+
                    '.paiming > span:nth-child(3){text-align: center;display: block;font-size: 20px;background-color: #4e6ef2;color: white;line-height: 30px;height: 30px;}');
    }
}



(function() {
    'use strict';
    //alert("测试内容")
    //alert(domainstwo.length)
    //alert("测试内容")
    //alert(domains.length)


    paiming("result c-container")
    paiming("result-op c-container")
    jingjia("_3rqxpq2")

    const xhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        paiming("result c-container")
        paiming("result-op c-container")
        jingjia("_3rqxpq2")
        //_3rqxpq2 fc-a12c83e900002c6c _3rqxpq2 EC_result new-pmd c-container
        console.log('函数劫网址',arguments[1])
        const xhr = this;
//         if (arguments[1] == hookUrl) {
//         const getter = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response');
//         Object.defineProperty(xhr, 'response', {
//             get: () => {
//                 let result = getter.call(xhr);
//                 //这里可以修改result
//                 return result;
//             }
//         });
//         }
        return xhrOpen.apply(xhr, arguments);
    };
//     var oldxhr=window.XMLHttpRequest
//     function newobj(){}

//     window.XMLHttpRequest=function(){
//         let tagetobk=new newobj();
//         tagetobk.oldxhr=new oldxhr();
//         let handle={
//             get: function(target, prop, receiver) {
//                 if(prop==='oldxhr'){
//                     return Reflect.get(target,prop);
//                 }
//                 if(typeof Reflect.get(target.oldxhr,prop)==='function')
//                 {
//                     if(Reflect.get(target.oldxhr,prop+'proxy')===undefined)
//                     {
//                         target.oldxhr[prop+'proxy']=(...funcargs)=> {
//                             let result=target.oldxhr[prop].call(target.oldxhr,...funcargs)
//                             console.log('函数劫网址',result)
//                             console.log('函数劫持获取结果',oldxhr.responseURL)
//                             paiming("result c-container")
//                             paiming("result-op c-container")
//                             return result;
//                         }
//                     }
//                     return Reflect.get(target.oldxhr,prop+'proxy')
//                 }
//               //  if(prop.indexOf('response')!==-1)
//               //  {
//               //      console.log('属性劫持结果',Reflect.get(target.oldxhr,prop))
//               //      return Reflect.get(target.oldxhr,prop)
//               //  }
//                 return Reflect.get(target.oldxhr,prop);
//             },
//             set(target, prop, value) {
//                 return Reflect.set(target.oldxhr, prop, value);
//             },
//             has(target, key) {
//                 debugger;
//                 return Reflect.has(target.oldxhr,key);
//             }
//         }

//         let ret = new Proxy(tagetobk, handle);

//         return ret;
//     }
    // 插入样式
    // alert(sum)
    // Your code here...
})();