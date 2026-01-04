// ==UserScript==
// @name         扑飞漫画解除网页限制
// @namespace    BlueFire
// @version      1.3
// @description  扑飞漫画接触网页限制，并改成下拉式播放,不过看的太快了，精彩的漫画很快就没了，失望呀！！！！！
// @author       nanfang
// @match        *://www.pufei8.com/manhua/*
// @grant        none
// @require      http://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/399308/%E6%89%91%E9%A3%9E%E6%BC%AB%E7%94%BB%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/399308/%E6%89%91%E9%A3%9E%E6%BC%AB%E7%94%BB%E8%A7%A3%E9%99%A4%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
(function() {
     $(document).ready(function(){
         var imgserver = 'http://res.img.fffimage.com/';
         if(document.getElementById("viewimages")){
             // document.getElementById("viewimages").innerHTML = "<img src=\"" + imgserver + "" + photosr[i] + "\" onerror=\"setimgerror()\" onload=\"loadnextimg(this)\" onClick=\"gonext()\" alt=\"单击进入下一页\" id=\"viewimg\" style=\"cursor:hand;cursor:pointer;\"><br><img src=\"\" id=\"nextimg\" style=\"display:none;\">";
             //  pageStr=$("viewpagename").innerHTML;
             //page_num=parseInt(pageStr.substring(1));
             let str="";
             for(let i=1;i<photosr.length;i++){
                 str+="<img src=\"" + imgserver + "" + photosr[i] + "\" onerror=\"setimgerror()\" onload=\"loadnextimg(this)\" id=\"viewimg\"  onClick=\"{             $j.post('/e/extend/ret_page/index.php',{id:viewid},function(data){if(JSON.parse(data).url!=null){alert('总共就一页，点击“确定”进入下一话！');window.location=JSON.parse(data).url;}else{alert('已经最后一章了，不要太着急看，看完就没了！！！')}})}\"  style=\"cursor:hand;cursor:pointer;\"><br><img src=\"\" id=\"nextimg\" style=\"display:none;\">";
             }
             document.getElementById("viewimages").innerHTML=str;
             let picNav=document.getElementsByClassName("picNav");
             for(let i=0;i<picNav.length;i++){
                 picNav[i].innerHTML="";
             }
            // $j.post('/e/extend/ret_page/index.php',{id:viewid},function(data){if(JSON.parse(data).url!=null){alert('这是最后一页了，点击“确定”进入下一话！');window.location=JSON.parse(data).url;}else{alert('已经最后一章了，不要太着急看，看完就没了！！！')}})
         }
     })
})();