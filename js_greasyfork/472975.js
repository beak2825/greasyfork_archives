// ==UserScript==
// @name         Shopee订单图片
// @version      0.3
// @namespace    ShopeeProducts
// @description  Shopee订单图片查看
// @author       You
// @match        https://seller.xiapi.shopee.cn/portal/sale/order
// @match        https://seller.xiapi.shopee.cn/portal/product/list/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.1.js
// @require      https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.core.min.js
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472975/Shopee%E8%AE%A2%E5%8D%95%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/472975/Shopee%E8%AE%A2%E5%8D%95%E5%9B%BE%E7%89%87.meta.js
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

    GM_addStyle('.panel { position:fixed;right:20px;top:110px;width:200px;height:300px;background:#fff;border:1px solid #ccc;padding:10px; } .panel_hidden { display:none}');
    GM_addStyle('.assistant_btn {position:fixed;right:20px;top:70px;}');

    if(location.href.includes('https://seller.xiapi.shopee.cn/portal/product/list/all')){
        var searchParams = new URLSearchParams(location.href);

        // 获取查询参数值
        var paramValue = searchParams.get('keyword');
        const keyword = decodeURIComponent(paramValue);
        waitForKeyElements (".shopee-input-group", jNd => {
           $(".shopee-select").parent().next().find('input').val(keyword)
        })
    }
    else{
      waitForKeyElements (".order-list-body", jNd => {
       insertChange();
       console.log('长度',$(".order-list-body .order-product-list").length )
       $(".order-list-body .order-product-list").each((index,item)=>{
           addButton(item);

       })

    })

    }
  
    function addButton(item){
      $(item).find(".order-product-wrapper").each((index,product_item)=>{
         // console.log(product_item)
          let img_url = $(  $(product_item).find("img")[0] ).attr("src");
          let keyword = $(  $(product_item).find(".ct-item-product-name")[0] ).text();
          $(product_item).append('<button><a href="'+img_url.slice(0,-3)+'" target="_blank">查看图片</a></button>')
          $(product_item).append('<button><a href="https://seller.xiapi.shopee.cn/portal/product/list/all?page=1&keyword='+keyword+'" target="_blank">查看商品</a></button>')
      })

    }

    function insertChange(){
        // 目标节点
        const targetNode = document.getElementsByClassName('order-list-body')[0];

        // 创建一个 Mutation Observer 实例
        const observer = new MutationObserver((mutationsList, observer) => {
            // 遍历每个发生变化的 MutationRecord
            for (const mutation of mutationsList) {
                // 检查变化类型为子节点插入
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 处理插入的节点
                    const addedNode = mutation.addedNodes[0];
                   // console.log('节点插入:', $(addedNode).attr('class'));
                    if( $(addedNode).attr('class')=='order-item' ){
                       let item = $(addedNode).find(".order-product-list")[0];
                       addButton(item);
                    }
                }
            }
        });

        // 配置 Mutation Observer 监听选项
        const config = { childList: true, subtree: true };

        // 开始监听目标节点的变化
        observer.observe(targetNode, config);

    }





})();