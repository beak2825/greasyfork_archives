// ==UserScript==
// @name        cnu-pingjia
// @namespace   Gizeta.Debris.CnuPingJia
// @author      Gizeta <0w0@gizeta.tk>
// @description CNU Pingjia Plugin
// @include     http://xk/jxpgXsAction.do*
// @include     http://202.204.208.75/jxpgXsAction.do*
// @include     http://xk.cnu.edu.cn/jxpgXsAction.do*
// @version     0.4.0.16
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2290/cnu-pingjia.user.js
// @updateURL https://update.greasyfork.org/scripts/2290/cnu-pingjia.meta.js
// ==/UserScript==

injectScript = function(src) {
    var scriptEl;
    scriptEl = document.createElement('script');
    scriptEl.innerHTML = "(" + (src.toString()) + ")();";
    return document.head.appendChild(scriptEl);
};

injectScript(function() {
    window.timer = null;
    
    var dayCal = function(d) {
        if(d < 0.1) return "一日目";
        if(d < 0.2) return "二日目";
        if(d < 0.3) return "三日目";
        if(d < 0.4) return "四日目";
        if(d < 0.5) return "五日目";
        if(d < 0.6) return "六日目";
        if(d < 0.7) return "七日目";
        if(d < 0.8) return "八日目";
        if(d < 0.9) return "九日目";
        if(d < 1) return "最終日";
        else return "Next Dream";
    }
    
    var totalHelper = function() {
        if(document.WjList.pageSize.value != "300") {
            document.WjList.pageSize.value = "300";
            pageSizeChange();
        }
        
        var x = document.getElementById("user");
        var count = 0;
        var total = 0;
        x.innerHTML = x.innerHTML.replace(/>否</gm, function() {
            count++;
            return " style='background:red'>否<";
        });

        window.evName = evName = new Object();
        var x = document.getElementById("user").children[1];
        for(var i = 0; i < x.children.length; i++) {
            if(x.children[i].children[3].innerHTML == "否") {
                evName.name = x.children[i].children[4].children[0].name;
                break;
            }
        }
        
        total = parseInt(document.WjList.children[4].children[7].children[0].children[0].children[1].children[0].children[0].children[0].children[0].innerHTML.substring(1));
        
        var thead = document.getElementById("tblHead");
        var chkEle = document.createElement("div");
        chkEle.innerHTML = "<input id='hack_auto' type='checkbox' " + (window.localStorage["auto"] == "true"  ? "checked" : "") + " onclick='javascript:if(document.getElementById(\"hack_auto\").checked){window.localStorage[\"auto\"]=true;window.timer=setTimeout(function(){evaluation(evName);},000);}else{clearTimeout(window.timer);window.localStorage[\"auto\"]=false;}'>auto</input>";
        thead.parentNode.insertBefore(chkEle,thead.nextSibling);
        var divEle = document.createElement("div");
        divEle.innerHTML = dayCal((total-count)/total) + "：<div style='width:300px;height:15px;border:solid 1px #CCCCCC;display:inline-block'><div style='text-align:center;background-color:#E1EDFF;width:" + (total-count)/total*300 + "px;height:15px;'>" + ((total-count)/total*100.00).toFixed(2) +"%</div></div><br />次の受難へ：<a onclick='javascript:evaluation(evName)' href='#'>" + (evName.name == null ? "" : evName.name.replace(/#@/gm, " | ")) + "</a>";
        thead.parentNode.insertBefore(divEle,thead.nextSibling);
        
        if(window.localStorage["auto"] == "true") {
            window.addEventListener("load", function(){
                window.timer = setTimeout(function(){evaluation(evName);}, 000);
            });
        }
    };
    
    var evaluateHelper = function() {
       var x = document.getElementsByTagName('input');
       var exp=/(很好|适中|很满意)/;
       for(i in x)
       {
           if(x[i].type === 'radio')
           {
               if(exp.exec(x[i].nextSibling.data))
               {
                   x[i].checked = true;
               }
           }
       }
    
       var cmts = ["上课风趣",
                   "注重教学质量",
                   "十分关注学生的接受学习能力",
                   "下课主动和同学交流，对自己的课堂做出改进",
                   "不拖堂，不很多的占用学生的课余时间",
                   "布置数量不多，但是运用了所有课堂教学知识的作业",
                   "开展研学课，让大家不拘泥于书本之中",
                   "经常给我们科普课外知识",
                   "和我们探讨人生、理想"]; // Writed by Clect
       var cmtCount = parseInt(Math.random() * 3 + 3);
       var cmtString = "";
       for(i = 0; i < cmtCount; i++) {
           var index = parseInt(Math.random() * (9 - i));
           cmtString += cmts[index] + "，";
           cmts.splice(index, 1);
       }
                
       document.StDaForm.zgpj.value = cmtString.substring(0, cmtString.length - 1) + "。";
       document.StDaForm.zgpj1.value = "无";
    
       var time = document.getElementById("showtime");
       time.style.display = "none";
       flag = true;
        
       var thead = document.StDaForm.children[6].children[0].children[0].children[0].children[0];
       var chkEle = document.createElement("div");
       chkEle.innerHTML = "<input id='hack_auto' type='checkbox' " + (window.localStorage["auto"] == "true"  ? "checked" : "") + " onclick='javascript:if(document.getElementById(\"hack_auto\").checked){window.localStorage[\"auto\"]=true;window.timer=setTimeout(function(){evaluation(evName);},000);}else{clearTimeout(window.timer);window.localStorage[\"auto\"]=false;}'>auto</input>";
       thead.parentNode.insertBefore(chkEle,thead.nextSibling);
       var divEle = document.createElement("div");
       divEle.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;<img align="middle" style="cursor:hand" title="提交" src="/img/zh/submit_zh.gif" onclick="check()">&nbsp;&nbsp;&nbsp;&nbsp;<img align="middle" style="cursor:hand" title="重置" src="/img/zh/reset.gif" onclick="resetCxtj()">';
       thead.parentNode.insertBefore(divEle,thead.nextSibling)
       
       if(window.localStorage["auto"] == "true") {
            window.addEventListener("load", function(){
                window.timer = setTimeout(function(){check();}, 000);
            });
        }
    };

    if(document.WjList != null) {
        totalHelper();
    }
    else {
        evaluateHelper();
    }
});