// ==UserScript==
// @name         邯郸市网上练兵系统,计算机,第一关可用.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使用方式,计算机,第一关,到达答题的页面后,右侧,用户信息那,有个 刷分的按钮 ,点击后,会打开新页面刷分,10题会提交一次.要停止的话,直接关了这个页面就行了.
// @author       You
// @match        http://hdszgwslb.com/index/cglb/ajaxdt?passid=*&id=150572&answer=ABD&_=1608026061322
// @match        http://hdszgwslb.com/index/cglb/passresult?passid=*&matchid=0
// @match        http://hdszgwslb.com/index/cglb/dt?id=13672&matchid=0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424108/%E9%82%AF%E9%83%B8%E5%B8%82%E7%BD%91%E4%B8%8A%E7%BB%83%E5%85%B5%E7%B3%BB%E7%BB%9F%2C%E8%AE%A1%E7%AE%97%E6%9C%BA%2C%E7%AC%AC%E4%B8%80%E5%85%B3%E5%8F%AF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/424108/%E9%82%AF%E9%83%B8%E5%B8%82%E7%BD%91%E4%B8%8A%E7%BB%83%E5%85%B5%E7%B3%BB%E7%BB%9F%2C%E8%AE%A1%E7%AE%97%E6%9C%BA%2C%E7%AC%AC%E4%B8%80%E5%85%B3%E5%8F%AF%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ID=13672;
    var COUNT=10;
function myStuday()
    {

        window.open("http://hdszgwslb.com/index/cglb/ajaxdt?passid="+ID+"&id=150572&answer=ABD&_=1608026061322");
    }

    if(document.URL.indexOf("http://hdszgwslb.com/index/cglb/dt?id=13672&matchid=0")>=0)
    {

        var btn = document.createElement("BUTTON");
        btn.innerText = "点我刷分";
        btn.id= "myButton";
        btn.onclick =myStuday;

        var w = document.querySelector("div.dt_tit");
        w.append(btn);
        w.setAttribute("style","height:120px");


        return;
    }

    // Your code here...
    if(document.URL.indexOf("http://hdszgwslb.com/index/cglb/passresult?passid=")>=0)
       {
       var qUrl="http://hdszgwslb.com/index/cglb/ajaxdt?passid="+ID+"&id=150572&answer=ABD&_=1608026061322";
       setTimeout(function(){ location.replace(qUrl); }, 3000);

}
 else
 {

 if(document.querySelector("body").textContent.indexOf('right_num":'+COUNT)>0
//||document.querySelector("body").textContent.indexOf('right_num":20')>0
)//当答对题目数量达到10的时候,就提交数据
{
    var rUrl="http://hdszgwslb.com/index/cglb/passresult?passid="+ID+"&matchid=0"
    location.replace(rUrl);

}
else
{
    //刷新页面,则,增加一次答对题目数量
    //延迟4秒后 刷新

    setTimeout(function(){ location.reload(); }, 3000);

}
}


})();