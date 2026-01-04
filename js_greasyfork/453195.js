// ==UserScript==
// @name        新版APP实时调试
// @namespace   Violentmonkey Scripts
// @match       https://prom.m.gome.com.cn/html/prodhtml/topics/*
// @match       https://prom.m.gome.com.cn/gcms/*
// // @require     https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant       none
// @version     2.0
// @author      -
// @noframes
// @description 2022/10/17下午10:22:14
// @license     GPL License
// @downloadURL https://update.greasyfork.org/scripts/453195/%E6%96%B0%E7%89%88APP%E5%AE%9E%E6%97%B6%E8%B0%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/453195/%E6%96%B0%E7%89%88APP%E5%AE%9E%E6%97%B6%E8%B0%83%E8%AF%95.meta.js
// ==/UserScript==

// http-server -S ./
// $("html").append('<link rel="stylesheet" href="https://10.2.112.50:8080/index.css"><script src="https://10.2.112.50:8080/index.js"></script>')


//   console.log('%c 时时更新中.... ', 'color:red;font-size:10px;font-weight:900;background:#000;');
//   setInterval(function(){
//   // setTimeout(function(){
//     // $("#templet666").load("http://localhost:5501/indexServer.html")
//     // $('[templetid="4692597"]').load("http://localhost:5501/indexServer.html")
//     // console.log('%c ❤️小❤️东❤️西❤️儿❤️ ', 'color:red;font-size:10px;font-weight:900;background:#000;');

//   // },2000)
//   },1000)


setTimeout(() => {
  $("body").append(`
<style>
    .wyj_bendi_edit {
        position: fixed;
        top: .04rem;
        left: .5rem;
          z-index: 99;
          background: #000;
          padding: .08rem 0;
    width: 1.8rem;
    border-radius: .2rem;
    }

    .wyj_bendi_edit span {
      float: left;
      font-size: .2rem;
      line-height: .6rem;
      display: inline-block;
      color:#fff;
          width: 48%;
    text-align: center;
    }

    .wyj_bendi_edit.active span {
        color: red;
        font-weight: 900;
    }

    .wyj_bendi_edit .wyj_edit_bg {
        width: .6rem;
        height: .6rem;
        background: red;
        border-radius: 50%;
      margin-left:.1rem;
    }

    .wyj_bendi_edit.active .wyj_edit_bg {
        background: green;
    }
</style>
<div class="wyj_bendi_edit">
    <span class="wyj_edit_bg"></span>
    <span class="wyj_edit_tit"> 未更新</span>
</div>
    `)
  $("#wrapper").prepend(`<div data-v-20221017="" id="templet666" idx="-1" templetcode="customTemplet" rowid="8888" templetid="60" pageid="0" aliaslist="custom" class="tem-box customTemplet CUSTOM-undefined cms-tem-box">
  <div data-v-20221017="" class="cms-tem">
    <div data-v-wangyongjie="" data-v-xiaodongxiere="" data-v-20221017="" class="slot-common-box">
      <div data-v-wangyongjie="" id="" class="layout-common-box" style="background-color: transparent;">
        <div data-v-wangyongjie="" class="bg">
          <div data-v-wangyongjie="" class="layout">
            <div data-v-xiaodongxiere="" data-v-wangyongjie="">
              <div data-v-xiaodongxiere="" data-v-wangyongjie="">


              </div>
              <div data-v-xiaodongxiere="" data-v-wangyongjie="" id="custom-id"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`);

}, 2000);




    var data0 = [];
    var data1 = [];
    var i = 0;
    setInterval(() => {
        $.ajax({
            // url: "//localhost:5501/indexServer.html",
            url: "http://localhost:5501/indexServer.html",
            // url: "http://m.gome.com.com/indexServer.html",
            success: function(result) {
                if (i < 2) {
                    // eval("data" + i++).unshift(result)
                    eval(("data" + i++))[0] = result
                } else {
                    i = 0;
                }
                // console.log("data0",data0)
                // console.log("data1",data1)
                if (data0[0] == data1[0]) {
                    $(".wyj_edit_tit").html("无更新")
                    $(".wyj_bendi_edit").removeClass("active");
                    // console.log("------本地代码未变化------")
                } else {
                    console.clear()
                    // $(".wyj_edit_tit").html("更新成功🔥")
                    $(".wyj_edit_tit").html("更新中...")
                    $(".wyj_bendi_edit").addClass("active");
                    $("#templet666").load("http://localhost:5501/indexServer.html")
                    // $(".tip-no-more").load("http://localhost:5501/indexServer.html")
                    // $('[templetid="4733121"]').load("http://localhost:5501/indexServer.html")
                    // $('[rowid="4726907"]').load("http://localhost:5501/indexServer.html")
                    // $("#templet12").load("http://localhost:5501/indexServer.html")
                    // console.log("------本地代码更新中------")
                    console.group('----------本地代码更新完成✅----------');
                    if(window.location.pathname.split("/")[1] == 'html') {
                      console.log("旧版data", window.cmsV);
                    }else {
                      console.log("新版dataAll", JSON.parse(JSON.stringify(window.cmsPageData)))
                      console.log("新版data", JSON.parse(JSON.stringify(window.cmsPageData.cmsObj)))
                    }
                    console.groupEnd();

                }
            }
        });
    }, 800);