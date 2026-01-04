// ==UserScript==
// @name         test 不要下载
// @namespace    gorgias add
// @version      3.2
// @description  gorgias 增加基本信息 易仓补发
// @author       jerry
// @include      https://y.gorgias.com/app/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440887/test%20%E4%B8%8D%E8%A6%81%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/440887/test%20%E4%B8%8D%E8%A6%81%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function ($) {
  console.log("脚本执行了,版本2.0.0");

  var env = localStorage.getItem("env-info") || "test"; // 默认生产环境
  console.log(env);

  const envMap = {
    prod: "https://ccm.youniverse.cc",
    test: "https://test.ccm.youniverse.cc",
  };

  $("body").append(
    `
      <!-- 实际脚本内容-通过script引入 代码 方便代码管理维护 -->
      <script src=${
        envMap[env] || "https://ccm.youniverse.cc"
      }/gorgiasScript/index.js></script>
      `
  );

  $.extend({ envMap });
  // 这个 script 是中转 文件 原则上不改变
})(jQuery);


(function () {
  console.log('脚本启动了')

    let basic = null;
    let lastBasic = null;
    let reissue = null;
    let lastReissue = null;
    let ifrm1 = null;
    let lastHeight = 0;
    let lastTicketId = '';
    let lastContainerWidth = ''; let isDraggable = false;



    const interTime = setInterval(function () {

      if (window.location.href.indexOf("y.gorgias.com/app/ticket") > -1) {

        const container = document.querySelector('._2kR-sqQlwwzR6ywqhSPTyA');


        if(!lastContainerWidth){
          let width = localStorage.getItem("ccm_container_width");
          container.style.width = width || "500px";
          lastContainerWidth = container.style.width;
        } else {
          localStorage.setItem("ccm_container_width",container.style.width)
        }




        const HTTP = document.querySelector('.oo8e0GwNUh4Ca4aa5sJYe');

        if(HTTP.innerText==="HTTP"){
          HTTP.style.display = "none"
        }
        // w6Gu_XwBRGqZT9Glg3krr


        const mainAll = document.querySelectorAll(".hl0rDUNRBOwzdmiSzWxSn");


        for (i = 0; i < mainAll.length; ++i) {

          const el = mainAll[i].getElementsByClassName('_2U0cvCTlq40J1HHO2EILo')[0];

          if(el){
            if(el.innerText === '基本信息'|| el.innerText === '侧边栏' || el.innerText === '文明静'){
              basic = mainAll[i];
              break;
            }
          }

        }


        if(basic){
          lastBasic = basic
          let basicSimple = basic

          var url = window.location.href;
          var ticketId = url.substring(url.lastIndexOf('/')+1).trim();

          if(basicSimple && ticketId !== lastTicketId){

            lastTicketId = ticketId; isDraggable = false;


            basicSimple.style.padding = 0;
            ifrm1 = document.createElement("iframe");
            ifrm1.setAttribute("src", "https://test.ccm.youniverse.cc/grogias?lastUrl=grogias&ticketId=" + ticketId ); ifrm1.setAttribute("id", "basic-ifrm");
            ifrm1.style.width = "100%";
            ifrm1.style.minHeight = "40vh";
            ifrm1.style.overflow = "hidden";
            ifrm1.style.border = "0";
            basicSimple.innerHTML = "<div></div>";
            basicSimple.appendChild(ifrm1);

               window.addEventListener('message', (event) => {
                 let data = event.data;
                 if(event.origin&&event.origin.indexOf("feishu")>-1){ 
                   data = 500;
                 }  

                 if(typeof data !== 'number') return;


                if(event.data>1000){
                  ifrm1.style.height = `${data+12}px`;
                  lastHeight = data+12;
                }else{

                  ifrm1.style.height=`${data+12}px`;
                  lastHeight = data+12;
                }

            })
          }
        }




       // 隐藏掉空的亚马逊订单
      if(!isDraggable){
        const AllDraggable = document.querySelectorAll("._2WaS9Gj7pJytNOhWp661Wc");
        for (i = 0; i < AllDraggable.length; ++i) {
            const el = AllDraggable[i]
            if(el.children&&el.children.length === 1){
                isDraggable = true;
                el.style.display = "none";
            }
          }
        } 
        
      // 隐藏shopify操作按钮
       const AllShopify = document.querySelectorAll(".QHKhrU2JXz6bGliFBDNDn");
         for (i = 0; i < AllShopify.length; ++i) {
            const el = AllShopify[i]
              el.style.display = "none";
          }


      }   
    }, 100);





});