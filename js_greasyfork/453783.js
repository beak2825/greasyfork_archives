// ==UserScript==
// @name         3/
// @namespace    http://tampermonkey.net/
// @version      1.2.6
// @description  For testing only
// @author       Sloan
// @match        https://www.bilibili.com/v/topic/*
// @match        https://t.bilibili.com/*
// @run-at       document-start
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      gitee.com
// @downloadURL https://update.greasyfork.org/scripts/453783/3.user.js
// @updateURL https://update.greasyfork.org/scripts/453783/3.meta.js
// ==/UserScript==

(function() {
    debugger
    'use strict';
    GM_xmlhttpRequest({
        url: 'https://gitee.com/s3csima/test/raw/master/wlist.json',
        method : "GET",
        onload : function(data){
        var json = JSON.parse(data.responseText);
        GM_setValue('zerolist', json ?? []);
        }
    });
    var wlist = GM_getValue('zerolist');
    var s_wlist = new Set(wlist);
    //
    GM_xmlhttpRequest({
        url: 'https://gitee.com/s3csima/test/raw/master/blist.json',
        method : "GET",
        onload : function(data){
        var json = JSON.parse(data.responseText);
        GM_setValue('onelist', json ?? []);
        }
    });
    var blist = GM_getValue('onelist');
    var s_blist = new Set(blist);
    //
    GM_xmlhttpRequest({
        url: 'https://gitee.com/s3csima/test/raw/master/sensitive.txt',
        method : "GET",
        onload : function(data){
        var text = data.responseText;
        GM_setValue('sensitive', text ?? "");
        }
    });

    //
    var reg1 = new RegExp("https://www.bilibili.com/v/topic/.*")
    var reg2 =new RegExp("https://t.bilibili.com/[0-9].*")
    var url = window.location.href;
if(url.match(reg1))
{
    (function() {
        function refresh(){
            count = 0;
            var tags=document.querySelectorAll("a[class='switch-tab__tab-text']")
            tags[0].click();
            setTimeout(function(){
                tags=document.querySelectorAll("a[class='switch-tab__tab-text']")
                tags[1].click();
            },1000)
        }
        let count = 0;
        setInterval(()=>{
            let aff=document.querySelectorAll(".switch-tab__tab-text")
            if(aff[2].className!="switch-tab__tab-text selected"){aff[2].click()}
            let b = document.querySelector("div[class='bili-dyn-time']");
            if(!b){
                refresh()
            }else{
                let t=document.createElement('button')
                t.textContent = 'checked'
                b.setAttribute('class','filtered')
                b.appendChild(t)
                if(b){
                let followBtn=b.parentNode.querySelector("div[class='bili-dyn-item__following']");
                if(followBtn){
                    count++
                    let uid_s=followBtn.getAttribute("data-mid")
                    let uid_n=parseInt(uid_s)
                    if(s_blist.has(uid_n)&&!s_wlist.has(uid_n)){
                            console.log(followBtn.getAttribute("data-mid"))
                            let reportBtn=b.parentNode.querySelector("div[class='bili-dyn-item__more'] > div[class='bili-dyn-more__btn tp'] > div[class='bili-popover'] > div[class='bili-dyn-more__menu'] > div[class='bili-dyn-more__menu__item']");
                            if(reportBtn){
                                reportBtn.click();
                                setTimeout(function(){
                                    var biliPopup = document.querySelectorAll("div[class='bili-popup']");
                                    var reportLabel=biliPopup[biliPopup.length-1].querySelectorAll("div[class='bili-dyn-report__option']")[1];
                                    var yz = reportLabel.getElementsByClassName('bili-radio--medium')[0];
                                    yz.click();
                                setTimeout(function(){
                                    var confirmBtn=biliPopup[biliPopup.length-1].querySelector("button[class='bili-dyn-report__button confirm']");
                                    confirmBtn.click();
                                setTimeout(function(){
                                    var cancelBtn=biliPopup[biliPopup.length-1].querySelector("button[class='bili-dyn-report__button cancel']");
                                    if(cancelBtn){cancelBtn.click();}
                                },1000)
                                },1000)
                                },1000)
                            }
                    }
                    if(count>=20){
                        refresh()
                    }
                }
                }else{
                    refresh()
                }
            }
        },6000);
    })();
}
else if(url.match(reg2))
{
    (function() {
        function ref(){
            count = 0;
            var tag1=document.querySelector(".hot-sort")
            tag1.click()
            setTimeout(function(){
              var tag2=document.querySelector(".new-sort")
              tag2.click()
          },1000)
        }
        function rrandom(){
            switch(Math.floor(Math.random()*5)){
                case 0:
                return "#r15";
                case 1:
                return "#r8";
                case 2:
                return "#r11";
                case 3:
                return "#r13";
                case 4:
                return "#r15";
            }
        }
        let count = 0;
        setInterval(()=>{
          let affirm=document.querySelector(".new-sort")
          if(affirm.className!="new-sort on"){affirm.click()}
          let b=document.querySelector(".user");
          if(!b){
                ref();
          }else{
              let t=document.createElement('button')
              t.textContent = 'checked'
              b.setAttribute('class','filtered')
              b.appendChild(t)
              if(b){
                let middle=b.querySelector(".name");
                var text=b.parentNode.querySelector(".text");
                if(!text){var text=b.parentNode.querySelector(".text-con");}
                var txt=text.innerText
                if(middle){
                    count++
                    let uids=middle.getAttribute("data-usercard-mid")
                    let uidn=parseInt(uids)
                    var like=b.parentNode.parentNode.querySelector(".like");
                    if(s_wlist.has(uidn)){
                        if(like.className!="like liked"){like.click();}
                    }
                    if(s_blist.has(uidn)&&!s_wlist.has(uidn)||txt.match(keyword)){
                            console.log(middle.getAttribute("data-usercard-mid"));
                            var hate=b.parentNode.parentNode.querySelector(".hate");
                            if(hate.className!="hate hated"){hate.click();}
                            let report=b.parentNode.parentNode.querySelector(".report");
                            if(report){
                                report.click();
                                setTimeout(function(){
                                    let sp=document.querySelector(rrandom());
                                    sp.click();
                                setTimeout(function(){
                                    var confirm=document.querySelector(".btn-submit");
                                    confirm.click();
                                setTimeout(function(){
                                    var cancel=document.querySelector(".btn-cancel");
                                    if(cancel){cancel.click();}
                                },1000)
                                },1000)
                                },1000)
                            }
                    }
                    if(count>=30){
                        ref()
                    }
                }
              }else{
                ref()
              }
            }
        },6000);
    })();
}
else{
    return 0;
}
})();