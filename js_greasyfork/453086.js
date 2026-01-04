
// ==UserScript==
// @name         新疆医学教育网
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  学习助手
// @author       Hui
// @match        http://www.xjyxjyw.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453086/%E6%96%B0%E7%96%86%E5%8C%BB%E5%AD%A6%E6%95%99%E8%82%B2%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/453086/%E6%96%B0%E7%96%86%E5%8C%BB%E5%AD%A6%E6%95%99%E8%82%B2%E7%BD%91.meta.js
// ==/UserScript==

(function () {
    var ans=['A','A','A','A','A'];
    //var ans_item=['A','B','C','D']
    //var first_item=0
  $(window).unbind("beforeunload");
  window.onbeforeunload = null;
    let hre_choose=setInterval(() => {
    let hre = location.href;
       if (hre.includes("http://www.xjyxjyw.com/member/courseWare_cinfo.do")) {class_choose ();clearInterval(hre_choose);}
       if (hre.includes("http://www.xjyxjyw.com/member/courseWare_play.do?courseWare.id")) {video_see();clearInterval(hre_choose);}
       if (hre.includes("http://www.xjyxjyw.com/member/exam_quelist.do")) {class_text();clearInterval(hre_choose);}
       if (hre.includes("http://www.xjyxjyw.com/member/exam_result.do")) {class_result();clearInterval(hre_choose);}
    },2000)

  function class_choose () {
     let t1 = setInterval(() => {
    localStorage.removeItem("key");
    for(var i=0;i<document.getElementsByClassName('goods-page-description').length;i++){
        if(document.getElementsByClassName('goods-page-description')[i].innerText=="未学习"||document.getElementsByClassName('goods-page-description')[i].innerText=="学习中"){
            location.href=document.getElementsByClassName('goods-page-description')[i-3].querySelector('a').href;
            clearInterval(t1);
            break;
        }
        //window.opener=null;window.open("about:blank","_top").close()
    }
    //$('.discuss_list li:not(:contains("通过考试")) a')[0].click();
  },3000)}
  function video_see() {
    //window.alert = function (param) {
      //.log(param);
    //};
    let t0 = setInterval(() => {
      if (document.querySelector("video")) {
        $("video")[0].play();
          document.querySelector('video').playbackRate=16;
          clearInterval(t0);
          playEnd();
          //document.querySelector('video').currentTime=9999;
          document.querySelector('video').volume=0;
      }
    }, 3000);
  }
  function class_text() {
    setTimeout(() => {
      //location.reload();
    }, 6000);
    let t0 = setInterval(() => {
      if (document.querySelector(".wen")) {
        clearInterval(t0);
        var ques = $("p:has(input)");
        $.map(ques, function (elem, index) {
          var queid = index;
          ans=JSON.parse(window.localStorage.getItem('key'))
          if (ans && queid in ans) {
            let anw = ans[queid];
            elem.querySelector('[value="' + anw + '"]').click();
          } else {
            elem.querySelector("input").click();
          }
        });

        ques = $("p:has(input)");
        let da = {};
        $.map(ques, function (elem, index) {
          var queid = index;
          let an = elem.querySelector(":checked").getAttribute("value");
          da[queid] = an;
        });
        localStorage.setItem("da", JSON.stringify(da));
        console.log(Object.keys(da).length);
        console.log(da);
        document.querySelector("#button-shipping-method").click();
      }
    }, 1000);
  }
  function class_result() {
    //setTimeout(() => {
      //location.reload();
    //}, 6000);
    let t0 = setInterval(() => {
      if (document.querySelector(".wen")) {
          ans=JSON.parse(window.localStorage.getItem('key'))
          if(ans==null){ans=['A','A','A','A','A'];}
           for(var i=0;i<$('.h4').length;i++){
          if($('.h4')[i].innerHTML.includes('您的回答：错误')){
              if(ans[i]=='A'){
                  ans[i]='B';
              }else if(ans[i]=="B"){
                  ans[i]='C';
              }else if(ans[i]=="C"){
                  ans[i]='D';
              }else if(ans[i]=="D"){
                  ans[i]='E';
              }else if(ans[i]=="E"){
                  ans[i]='A';
              }
          //ans[i]=ans_item[first_item]
              window.localStorage.setItem('key',JSON.stringify(ans))
          }
          }
          if(document.querySelector("body > div.main > div > div > div > div.titel > h3").innerText=="考试结果： 本课件通过考试！您可以 学习其它课件"){
          document.querySelector("body > div.main > div > div > div > div.titel > h3 > a").click()
          }
        clearInterval(t0);
        console.log($('h3:contains("未通过考试")').length);
        if ($('h3:contains("未通过考试")').length != 0) {
          document.querySelector("div.titel > h3 > a").click();
        }
      }
    }, 1000);
  }
})();
