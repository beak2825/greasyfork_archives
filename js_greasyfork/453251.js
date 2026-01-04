// ==UserScript==
// @name         TB一键下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  TB
// @author       You
// @include        https://*.taobao.com/item.htm*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.6.1.js
// @require      https://unpkg.com/vue@2.6.10/dist/vue.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453251/TB%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/453251/TB%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
     console.log('TB一键下载')

    $("#content").css("z-index",100);
    $("body").prepend('<button id="downMain" style="position:fixed;top:100px;right:50px;z-index:100000021">下载主图</button>')
    $("body").prepend('<button id="downDetail" style="position:fixed;top:150px;right:50px;z-index:100000021">下载详情</button>')
    $("#downMain").on('click',function(){
        getMainImgs()
    })
    $("#downDetail").on('click',function(){
        getDetailImgs()
    })
             function getMainImgs(){
//                 $("#J_Viewer div[class='tab-pannel']").each( (index,item)=>{
//                     let source_img = 'http://'+$(item).find("[id*='J_Tb-Viewer-Original']").attr('src');

//                     GM_download({
//                         url: source_img,
//                         name: `主图${index}.jpg`,
//                         saveAs: false,
//                     })
//                 })
                 main_imgs.forEach( (item,index)=>{
                    GM_download({
                        url: item,
                        name: `主图${index}.jpg`,
                        saveAs: false,
                    })
                 })
             }

             function loadDetail(){
                 let offset = $("#J_DivItemDesc img:eq(1)").offset().top;
                 let detail_height = 0;
                 $("#J_DivItemDesc img").each((index,item)=>{
                     let img = $(item).attr('src');
                     let height = $(item).attr('height');
                     if(height){



                         let image = item;
                         console.log(index)
                         image.onload = () => {
                             detail_height = detail_height + parseInt(height);
                             let top = offset + detail_height;

                             scrollNext(top);

                             detail_imgs.push(image.src)
                             //最后一张了
                             if(index==$("#J_DivItemDesc img").length-1){
                                getDetailImgs();


                             }
                         }

                     }
                     else
                         scrollNext( $("#J_DivItemDesc img:eq("+index+")").offset().top )

                 })
             }
             function getDetailImgs(){
                 $("#J_DivItemDesc img").each((index,item)=>{
                     let img = $(item).attr('data-ks-lazyload') ? $(item).attr('data-ks-lazyload') : $(item).attr('src');

                     GM_download({
                         url: img,
                         name: `详情${index}.jpg`,
                         saveAs: false,
                     })

                 })
             }


              function scrollNext(top){
                     $("html,body").stop().animate({
                       scrollTop: top
                     }, 100);
             }
    let isBottom = false;
    let main_imgs = [];
    let detail_imgs = [];



     setTimeout(()=>{
         var title = ( $(".tb-main-title") ).attr('data-title');
         GM_setClipboard(title+'_'+g_config.itemId,'text')


         $("#J_UlThumb li").click();



         $("#J_Viewer").css('display','none');
        // $("body > div").remove();
         setTimeout(()=>{
             //点击全部li
             let thumb_li = $("[id*='J_TbViewerThumb']")
             Array.from(thumb_li).forEach((item,index)=>{
               $(".tb-viewer-control a")[1].click();
             })

             //主图
             let thumb_a = $("[class*='tb-viewer-original-pic']")
             Array.from(thumb_a).forEach((item,index)=>{
               main_imgs.push( $(item).attr('href') )
             })


             //详情图




             function sleep(time){
                 var timeStamp = new Date().getTime();
                 var endTime = timeStamp + time;
                 while(true){
                     if (new Date().getTime() > endTime){
                         return;
                     }
                 }
             }






         },500)


     },2000)

})();