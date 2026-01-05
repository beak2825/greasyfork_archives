// ==UserScript==
// @name        auto mark
// @namespace   华理评选教系统自动评分
// @description 华理评选教系统
// @version     1.3
// @include     http://pjb.ecust.edu.cn/pingce/*
// @downloadURL https://update.greasyfork.org/scripts/2631/auto%20mark.user.js
// @updateURL https://update.greasyfork.org/scripts/2631/auto%20mark.meta.js
// ==/UserScript==
javascript:(function(){x=document.createElement("script");x.innerHTML="var b=document.getElementsByTagName('input');var table=document.getElementsByTagName('table')[1];var k=0,sum=0;var a=[b[0]];for(var i=0,l=b.length;i<l;i++){if(b[i].type=='radio'){a[++k]=b[i];}}for(var i=1,l=a.length;i<l-1;i++){if(i==1 ? 1:(a[i].value*1>a[i+1].value*1)&&a[i].value*1>a[i-1].value*1){a[i].checked='checked';sum+=a[i].value*1;}}";document.body.appendChild(x);})();