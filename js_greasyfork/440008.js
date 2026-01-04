// ==UserScript==
// @name         SaveToPDF
// @namespace    https://ztjun.fun
// @version      1.1
// @description  52pojie、CSDN、简书、Myitmx、博客园文章一键保存为PDF
// @author       null119
// @match        https://www.52pojie.cn/*
// @match        https://blog.csdn.net/*
// @match        https://www.myitmx.com/*
// @match        https://www.jianshu.com/*
// @match        https://www.cnblogs.com/*
// @icon         https://https://ztjun.fun/wp/wp-content/uploads/img/202202140807071.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440008/SaveToPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/440008/SaveToPDF.meta.js
// ==/UserScript==

(function() {
    "use strict";
    var host,url,wtype,imgurl
    imgurl='https://ztjun.fun/wp/wp-content/uploads/img/202202150530227.png';
    window.onload=function(){
        var up,nxg1,newa,nimg,ndiv,allshow;
        url=window.location.href;
        up="//.*?\\.(.*?)\\."
        host=url.match(up)[1];
        if(host==="52pojie"){
            wtype=0
        }
        if(host==="csdn"){
            wtype=1
        }
        if(host==="myitmx"){
            wtype=2
        }
        if(host==="jianshu"){
            wtype=3
        }
        if(host==="cnblogs"){
            wtype=4
        }
        switch(wtype) {
            case 0:
                nxg1 = document.getElementById("newspecial");
                if (nxg1) {
                    nimg=document.createElement("img");
                    nimg.src="https://ztjun.fun/wp/wp-content/uploads/img/202202140612986.png";
                    newa = document.createElement("a");
                    newa.id="HtmToPDF";
                    newa.href="javascript:SaveToPDF();";
                    newa.title="收藏";
                    newa.appendChild(nimg);
                    nxg1.parentNode.insertBefore(newa,nxg1.nextSibling);
                    var doc=document.getElementsByClassName("zoom")
                    for(var i=0;i<doc.length;i++){
                        doc[i].setAttribute("src",doc[i].getAttribute("file"));
                    }
                }
                break;
            case 1:
                setTimeout(1500);
                nxg1 = document.getElementsByClassName("opt-letter-watch-box");
                if (nxg1) {
                    newa = document.createElement("a");
                    newa.setAttribute("class","personal-watch bt-button");
                    newa.id="HtmToPDF";
                    newa.href="javascript:SaveToPDF();";
                    newa.text="收藏";
                    ndiv=document.createElement("div");
                    ndiv.setAttribute("class","opt-letter-watch-box");
                    ndiv.appendChild(newa);
                    nxg1[1].parentNode.insertBefore(ndiv,nxg1[1].nextSibling);
                    allshow=document.getElementById("btn-readmore-zk");
                    if(allshow){
                        allshow.click()
                    };
                    var zk=document.getElementsByClassName("look-more-preCode contentImg-no-view");
                    if(zk.length>0){
                        for (var j = 0; j<zk.length; j++) {
                            (function (j) {
                                setTimeout(function () {
                                    zk[j].click();
                                },j * 100);
                            })(j);
                        }
                    }
                }
                break;
            case 2:
                nxg1 = document.getElementById("navbarCollapse");
                if (nxg1) {
                    nimg=document.createElement("img");
                    nimg.src=imgurl;
                    newa = document.createElement("a");
                    newa.id="HtmToPDF";
                    newa.setAttribute("class","search-form-input");
                    newa.href="javascript:SaveToPDF();";
                    newa.title="收藏";
                    newa.appendChild(nimg);
                    nxg1.parentNode.insertBefore(newa,nxg1.nextSibling);
                }
                break;
            case 3:
                nxg1 = document.getElementsByClassName("_1pUUKr")[2];
                if (nxg1) {
                    nimg=document.createElement("img");
                    nimg.src=imgurl;
                    newa = document.createElement("a");
                    newa.id="HtmToPDF";
                    newa.setAttribute("class","search-form-input");
                    newa.href="javascript:SaveToPDF();";
                    newa.title="收藏";
                    newa.appendChild(nimg);
                    ndiv=document.createElement("div");
                    ndiv.setAttribute("class","_1pUUKr");
                    ndiv.setAttribute("align","center");
                    ndiv.appendChild(newa);
                    nxg1.parentNode.insertBefore(ndiv,nxg1.nextSibling);
                }
                break;
            case 4:
                nxg1 = document.getElementById("blog_nav_admin");
                if (nxg1) {
                    newa = document.createElement("a");
                    newa.id="HtmToPDF";
                    newa.href="javascript:SaveToPDF();";
                    newa.title="收藏";
                    newa.text="收藏";
                    ndiv=document.createElement("li");
                    ndiv.setAttribute("id","blog_save");
                    ndiv.setAttribute("align","center");
                    ndiv.appendChild(newa);
                    nxg1.parentNode.insertBefore(ndiv,nxg1.nextSibling);
                }
                break;
        }
    };
    window.SaveToPDF=function(){
        var htmldoc,test,idstr,sprnstr,eprnstr,instart,s_a,e_a,bdhtml,prnhtml,title
        sprnstr="LS1zdGFydHByaW50LS0=";
        eprnstr="LS1lbmRwcmludC0t";
        htmldoc=document.documentElement.outerHTML;
        switch(wtype) {
            case 0:
                test="comment_(\\d+)";
                idstr="postmessage_"+htmldoc.match(test)[1];
                instart=document.getElementById(idstr);
                title=document.getElementById("thread_subject").innerText;
                break;
            case 1:
                instart=document.getElementById("article_content");
                title=document.getElementById("articleContentId").innerText;
                break
            case 2:
                instart=document.getElementsByClassName("post-content")[0];
                title=document.getElementsByClassName("blog-title")[0].innerText;
                break
            case 3:
                instart=document.getElementsByClassName("_2rhmJa")[0];
                title=document.getElementsByClassName("_1RuRku")[0].innerText;
                break
            case 4:
                instart=document.getElementById('cnblogs_post_body');
                title=document.getElementById("cb_post_title_url").innerText;
                console.log(title);
                break;
        }
        s_a=document.createElement("a");
        s_a.text=atob(sprnstr);
        s_a.style.display = "none";
        instart.parentNode.insertBefore(s_a,instart);
        e_a=document.createElement("a");
        e_a.text=atob(eprnstr);
        e_a.style.display = "none";
        instart.parentNode.insertBefore(e_a,instart.nextSibling);
        bdhtml=window.document.body.innerHTML;
        prnhtml=bdhtml.substr(bdhtml.indexOf(atob(sprnstr))+14);
        prnhtml=prnhtml.substring(0,prnhtml.indexOf(atob(eprnstr)));
        if(wtype===3){
            prnhtml=prnhtml.replace(/src="\/\/upload/g, 'src="https://upload');
            prnhtml=prnhtml.replace(/<div class="image-container-fill".*?\/div>/g,'');
        }
        const newWin = window.open("");
        newWin.document.body.innerHTML = '<html><title>'+title+'</title><h1><a href="'+url+'">'+title+"</a></h1>"+prnhtml+"</html>";
        newWin.document.close();
        newWin.focus();
        setTimeout(() => {
            newWin.print();
            newWin.close();
        }, 300);
    };
})();