// ==UserScript==
// @name         Keepa一键选择
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  一键选中需导出的数据
// @author       Take
// @match        *://*.keepa.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430826/Keepa%E4%B8%80%E9%94%AE%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/430826/Keepa%E4%B8%80%E9%94%AE%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

(function() {

    var url = document.URL;
    var ok = url.indexOf("#!viewer");

    if(ok != -1 && url.length > 26){

        setTimeout(function() {
            console.log("-------正常运行-----");
            //console.log(document.location)
            var div = document.createElement("div");
            div.innerHTML = "<div id='btnkeepa' onclick='click()'>一键选中需导出数据</div><style>#btnkeepa{position: absolute;top: 154px;left: 560px;background-color: #007eff;color: white;z-index: 999999;border-radius: 3px;padding: 3px 20px;}</style>";
            document.body.appendChild(div);

            btnkeepa.onclick=function(){
                //alert('按钮被点击了')
                document.querySelector("span[class='trigger']").click();
                document.querySelector("span[class='reset-all']").click();
                document.querySelector("span[class='trigger']").click();
                document.querySelector("span[class='hide-all']").click();

                document.querySelector("input[data-col-id='AMAZON_current']").click();
                document.querySelector("input[data-col-id='brand']").click();
                document.querySelector("input[data-col-id='buyBoxIsFBA']").click();
                document.querySelector("input[data-col-id='offerCountFBA']").click();
                document.querySelector("input[data-col-id='offerCountFBM']").click();
                document.querySelector("input[data-col-id='fbaFees']").click();
                document.querySelector("input[data-col-id='imagesCSV']").click();
                document.querySelector("input[data-col-id='lastUpdate']").click();
                document.querySelector("input[data-col-id='upcList']").click();
                document.querySelector("input[data-col-id='COUNT_REVIEWS_current']").click();
                document.querySelector("input[data-col-id='RATING_current']").click();
                document.querySelector("input[data-col-id='urlAmazon']").click();
                document.querySelector("input[data-col-id='NEW_current']").click();
                document.querySelector("input[data-col-id='NEW_FBA_avg90']").click();
                document.querySelector("input[data-col-id='NEW_FBA_current']").click();
                document.querySelector("input[data-col-id='SALES_current']").click();
                document.querySelector("input[data-col-id='stockBuyBox']").click();
                document.querySelector("input[data-col-id='BUY_BOX_SHIPPING_current']").click();
                document.querySelector("input[data-col-id='rootCategory']").click();

                document.querySelector("span[class='trigger']").click();

            }
        }, 3000);
    }
    
})();

