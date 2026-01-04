// ==UserScript==
// @name         测试bjjnts使用
// @namespace    https://www.bjjnts.cn
// @version      1.0.210811
// @description  一个简单测试的小脚本
// @author       bxtww
// @match        *://*.bjjnts.cn/study*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/430625/%E6%B5%8B%E8%AF%95bjjnts%E4%BD%BF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/430625/%E6%B5%8B%E8%AF%95bjjnts%E4%BD%BF%E7%94%A8.meta.js
// ==/UserScript==

(function(){
    'use strict';
var roundtime=Math.round(Math.random()*20000);
setInterval(function(){//setTimeout  setInterval
        shuake();
        },roundtime);
function shuake(){
      console.log("shuake()执行...");
      var tag=document.getElementsByTagName("button");
        for(i=0;i<tag.length;i++){
            if(!tag[i].getAttribute("class").indexOf('next_button___YGZWZ'))
            {
                tag[i].click();
                console.log("点击下一单元...");
                setTimeout("A()",2000); //延迟1秒
            }else if(!tag[i].getAttribute("class").indexOf('ant-btn ant-btn-primary'))
            {
                tag[i].click();
                console.log("点击确定...");
            }
        }
      tag=document.getElementsByTagName("div");
      for(var i=0;i<tag.length;i++){
		if(!tag[i].id.indexOf('J_prismPlayer_component_'))
        {
            //console.log("找到按钮...");
            if(tag[i].style.display=='block')
            {
                document.getElementById(tag[i].id).click();
                //alert(tag[i].id);
                console.log("点击播放...");
            }
		}
      }
}
})();
