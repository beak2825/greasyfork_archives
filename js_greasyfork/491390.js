// ==UserScript==
// @name         oafor-ejy365
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @include      https://oa.ejy365.com/spa/workflow/static/index.html*
// @include      https://oa.ejy365.com/wui/index.html*
// @match        https://oa.ejy365.com/spa/workflow/static/index.html*
// @require      http://libs.baidu.com/jquery/1.11.1/jquery.min.js
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/491390/oafor-ejy365.user.js
// @updateURL https://update.greasyfork.org/scripts/491390/oafor-ejy365.meta.js
// ==/UserScript==

var x=0;
var y=0;
var z=0;
(function init1(){
    'use strict';
    var counter=document.querySelectorAll('div[title*="远程访问服务器权限申请"]');
    if (counter.length == 0) {
        counter=document.querySelectorAll('div[title*="紧急服务器申请流程"]');
    }

    if (counter.length == 0) {
        counter=document.querySelectorAll('div[title*="发文"]');
    }

    if (counter.length == 0) {
        counter=document.querySelectorAll('div[title*="易交易"]');
    }
    if (counter.length == 0) {
        counter=document.querySelectorAll('div[title*="内部留言"]');
    }
    if (counter.length == 0) {
        counter=document.querySelectorAll('div[title*="合同审批流程(易交易)"]');
    }
    if (counter.length == 0) {
        counter=document.querySelectorAll('div[title*="服务器（虚拟机）申请流程"]');
    }
    if (counter.length == 0) {
        counter=document.querySelectorAll('div[title*="外网域名解析申请流程"]');
    }
    if (counter.length == 0) {
        counter=document.querySelectorAll('div[title*="机构数据修改申请流程"]');
    }
    if (counter.length == 0) {
        counter=document.querySelectorAll('div[title*="息修改申请流程"]');
    }
    if (counter.length == 0) {
        counter=document.querySelectorAll('div[title*="紧急服务器"]');
    }
    if (counter.length == 0) {
        counter=document.querySelectorAll('div[title*="机构数据修改"]');
    }

    if (counter.length == 0) {
        counter=document.querySelectorAll('div[title*="系统变更申请"]');
    }
    if (counter.length>0) {
        counter[0].click();
        init();
    } else {
        if(y<5){
            y=y+1;
            //console.log(y);
            setTimeout(init1, 2000);
        }
    }
})();


function init(){
    'use strict';
    var counter=document.querySelectorAll('span[class="wea-url"] a');
    if (counter.length > 0) {
        counter.forEach((info, index) => {
          if(index % 2 == 0){
            setTimeout(() => {
              info.click();
            }, 3000);
          }
        });
    } else {
        if(x<3){
            x=x+1;
            //console.log(x);
            setTimeout(init, 3000);}}}

function sendtoredis(res){
        //var res = getform()
        //console.log(res);
        GM_xmlhttpRequest({
            method: 'POST',
            //后端接口
            url:"http://192.168.64.65:10080/add",
            contentType:"application/json",
            dataType:"json",
            //数据
            data: JSON.stringify({"add" : res}),
            headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        });
}

function jump() {
    'use strict';

    // 在页面加载后跳转到指定URL
    window.addEventListener('load', function() {
        window.location.href = 'https://oa.ejy365.com/spa/workflow/static/index.html#/main/workflow/listDoing';
    });
}


setTimeout(function(){
var flag = 0;
var url = document.location.toString();
var login = document.querySelectorAll('div[class="e9login-pop-form-message"]')
var login1 = document.querySelectorAll('input[id="loginid"]')
var dic = new Array();
dic[0]="OA-login_failed_plz_check!";
//console.log(stringData );
//if (url.indexOf('/workflow/index_mobx.jsp') == -1 && url.indexOf('/workflow/static/index.html') == -1 ) {flag = flag + 1;}
if (login.length > 0) {flag = flag + 1;}
if (login1.length > 0) {flag = flag + 1;}
console.log(flag);
if (flag > 0) {
  setTimeout(function() {
      document.getElementById("submit").click();
	  window.location.href = 'https://oa.ejy365.com/spa/workflow/static/index.html#/main/workflow/listDoing'; // 将URL替换为你想要跳转的地址
  }, 3000); // 延迟时间，单位为毫秒

/*   GM_xmlhttpRequest({
    method: 'GET',
    url: 'https://oa.ejy365.com/weaver/weaver.file.MakeValidateCode?seriesnum_=3',
    responseType: 'arraybuffer',
    onload: function(response) {
      if (response.status === 200) {
        var blob = new Blob([response.response], {type: 'image/jpeg'});
        var formData = new FormData();
        formData.append('image', blob, 'validateCode.jpg');
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'http://ddd.112114.xyz/ocr/file',
          data: formData,
          onload: function(response) {
            if (response.status === 200) {
              console.log(response.responseText);
              document.getElementById("validatecode").value = response.responseText;
              document.getElementById("submit").click();
              setTimeout(function() {
                  window.location.href = 'https://oa.ejy365.com/spa/workflow/static/index.html#/main/workflow/listDoing'; // 将URL替换为你想要跳转的地址
              }, 3000); // 延迟时间，单位为毫秒
            }
          }
        });
      }
    }
  }); */
  //window.location.href = 'http://oa.eccjt.com:88/spa/workflow/static/index.html#/main/workflow/listDoing';
  //setTimeout(jump, 3000);
}


if (flag > 0) {sendtoredis(dic);console.log(111111111);}
}, 5000);

////function init(){'use strict';var counter=document.querySelectorAll('span[class="wea-url"] a');if (counter.length>0) { counter[0].click() } else {if(x<5){x=x+1;console.log(x); setTimeout(init, 3000);}}}



//(function init(){'use strict';var counter=document.querySelectorAll('span[class="wea-url"] a');if (counter.length>0) { counter[0].click() } else {if(x<5){x=x+1;console.log(x); setTimeout(init, 3000);}}})();

//(function init(){var $ = window.jQuery; var counter = $("span.wea-url a");if (counter) {console.log(counter); counter[1].click() } else { setTimeout(init, 3);}})();

