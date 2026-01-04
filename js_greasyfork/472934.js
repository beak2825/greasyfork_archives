// ==UserScript==
// @name         Shopee商品
// @version      0.1
// @namespace    ShopeeProducts
// @description  Shopee销量商品抓取
// @author       You
// @match        https://seller.xiapi.shopee.cn/portal/product/list/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.1.js
// @require      https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.core.min.js
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472934/Shopee%E5%95%86%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/472934/Shopee%E5%95%86%E5%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

    waitForKeyElements (".title-box", jNd => {
        $(".title-box").append('<button id="downSales" class="shopee-button shopee-button--primary shopee-button--normal">下载销量</button><span id="downStatus"></span>');

          document.getElementById("downSales").onclick = function(){

              const _request = getData();
              _request()
          }

    })


    

     function getData(page=1){
       const aoa = [
           ['id','商品','销量','浏览量','收藏','创建时间','修改时间']
       ];
       let isEnd = false;
       let cursor = "";
       return async function request(){
           console.log('开始请求')
           $("#downStatus").text('正在获取第'+page+'页, 已获取 ' + (aoa.length-1) + '条记录');
           await new Promise((resolve,reject)=>{
               GM_xmlhttpRequest({
                   method: "GET",
                   url: "https://seller.xiapi.shopee.cn/api/v3/mpsku/list/search_product_list?page_number="+page+"&page_size=48&cursor="+cursor+"&list_type=all&sort_by=sales&is_asc=false&count_list_types=sold_out,banned,deboosted,deleted,unlisted,reviewing",
                   headers: {
                       "Content-Type": "application/json"
                   },
                   onload: function(response) {
                       response = JSON.parse(response.responseText);
                       console.log( response);

                       cursor = response.data.page_info.cursor;
                       try{
                           response.data.products.forEach(row=>{
                               let item = [ row.id,row.name,  row.statistics.sold_count, row.statistics.view_count , row.statistics.liked_count,  new Date(row.modify_time*1000).toLocaleString(),new Date(row.create_time*1000).toLocaleString() ];
                               aoa.push(item);
                               if( row.statistics.sold_count==0){
                                   isEnd = true;
                                   throw Error();

                               }

                           })
                       }
                       catch(e){

                       }
                       resolve();





                   }
               });
           })

           console.log('请求执行完成',isEnd)
           if(!isEnd){
              page = page + 1;
             request();

           }
           else{
               console.log(aoa);
               $("#downStatus").append(' ---完成导出')
              download(aoa);
              return aoa;
           }




       }
     
    }



    function download(data){
        const workbook = XLSX.utils.book_new();
        var sheet = XLSX.utils.aoa_to_sheet(data);

        XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

        XLSX.writeFile(workbook, 'data.xlsx');
    }


})();