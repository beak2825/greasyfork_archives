// ==UserScript==
// @name         大连会计继续教育 0.6 Beta
// @namespace    代刷课程
// @version      0.6
// @description  加微信发测试视频
// @author       代刷vx：GKmkj123
// @match        *://dlkj.edufe.cn/*
// @requirene
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460339/%E5%A4%A7%E8%BF%9E%E4%BC%9A%E8%AE%A1%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%2006%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/460339/%E5%A4%A7%E8%BF%9E%E4%BC%9A%E8%AE%A1%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%2006%20Beta.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function qxx(){
        if(document.URL.search('/mainFrame.action')>1){
             window.open(document.getElementById("mainFrame").src)
        }
    }
    setTimeout(qxx,1000)

    if(document.querySelectorAll('#myCourse').length>=1){
        function jtnf(){													
            var qbjh =document.querySelectorAll('td>font');			
            for (var i=0,j=qbjh.length;i<j;i++){
                if(qbjh[i].innerText !=='通过'){
                    document.getElementsByName('checkbox2')[i].click();
                    break;
                }
            }
        }
        setTimeout(jtnf,1000)
    }
    else if(document.querySelectorAll('#courseList').length>=1){
        function kclb (){
            var qnjh = document.querySelectorAll('tbody')[4].querySelectorAll('td');	
            for (var k=0,l=qnjh.length;k<l;k++){
                if(qnjh[k].innerText =='进行中'|| qnjh[k].innerText == '未开始'){
                    qnjh[k+1].querySelectorAll('input')[0].click();						
                    break;
                }
                else{
                    document.querySelectorAll('tbody')[2].querySelectorAll('input')[1].click();
                }
            }
        }
        setTimeout(kclb,1000);
    }
    else if(document.querySelectorAll('#courseStudy').length>=1){
        function ksxx(){													
            var kcxi = document.querySelectorAll('tr>td>input');
            var xxzt = document.querySelectorAll('tr>td');			
            for (var c=0,d=kcxi.length;c<d;c++){
                if(xxzt[c*3+8].querySelector('img')===null){
                    kcxi[c].click();
                    break;
                }
                else{
                    var fh = document.querySelectorAll('input').length;
                    document.querySelectorAll('input')[fh-1].click()
                }
            }
        }
        setTimeout(ksxx,1000)
    }
    else if(document.querySelectorAll('#listenForm').length>=1){
        function sx (){
            player.j2s_setVolume(0);
            player.j2s_resumeVideo();
        }
        setInterval(sx,10000)
}
})();