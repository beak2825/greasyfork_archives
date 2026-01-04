// ==UserScript==
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @version        20210226
// @name          SalesForceAutuDownloadPDF
// @namespace     SalesForceAutuDown
// @author	      tgsmonitor@163.com
// @description    This is a tool uses to download PDFs from SaleForce
// @include        https://upsdrive.my.salesforce.com/sfc/p/*
// @encoding       utf-8
// @grant          unsafeWindow
// grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/422465/SalesForceAutuDownloadPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/422465/SalesForceAutuDownloadPDF.meta.js
// ==/UserScript==
        $(window).load(function () {  
          var interval = setInterval(function(){            
            if($(".uiButton[title=Download],.uiButton[title=下载]").length>0){              
              $(".uiButton[title=Download],.uiButton[title=下载]").click();
              clearInterval(interval);
            }
            else{
              console.log("尚未加载出下载按钮，等待下一次循环。");
            }
            //do whatever here..
          }, 2000);                  
        });
      