// ==UserScript==
// @name         哔哩哔哩 - 眼不见心不烦
// @namespace    https://laji.blog
// @version      0.1
// @description  根据关键词屏蔽b站首页或视频页的封面及标题
// @author       MARV1N
// @match        *://*.bilibili.com/
// @match        *://*.bilibili.com/video/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.min.js
// @resource     jquery-tagify https://cdn.jsdelivr.net/npm/@yaireo/tagify@3.17.4/dist/tagify.css
// @require      https://cdn.jsdelivr.net/npm/@yaireo/tagify@3.17.4/dist/jQuery.tagify.min.js
// @resource     jquery-modal https://cdn.jsdelivr.net/npm/jquery-modal@0.9.2/jquery.modal.min.css
// @require      https://cdn.jsdelivr.net/npm/jquery-modal@0.9.2/jquery.modal.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.info
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @icon         https://i0.hdslb.com/bfs/album/e6a300cda376c01a948abbad9f19a14ccb6e488d.png
// @downloadURL https://update.greasyfork.org/scripts/408592/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20-%20%E7%9C%BC%E4%B8%8D%E8%A7%81%E5%BF%83%E4%B8%8D%E7%83%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/408592/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20-%20%E7%9C%BC%E4%B8%8D%E8%A7%81%E5%BF%83%E4%B8%8D%E7%83%A6.meta.js
// ==/UserScript==

const jqueryTagifyCss = GM_getResourceText ("jquery-tagify");
const jqueryModalCss = GM_getResourceText ("jquery-modal");
GM_addStyle (jqueryTagifyCss);
GM_addStyle (jqueryModalCss);

GM_addStyle('\
.bilibili-out-of-sight-out-of-mind{\
  -webkit-filter: grayscale(100%);\
  -moz-filter: grayscale(100%);\
  -ms-filter: grayscale(100%);\
  -o-filter: grayscale(100%);\
  filter: grayscale(100%);\
  filter: gray;\
  /*opacity: 0.4;*/\
  cursor: no-drop;\
  pointer-events: none;\
}\
.bilibili-out-of-sight-out-of-mind img{\
  content: url("https://i0.hdslb.com/bfs/archive/be27fd62c99036dce67efface486fb0a88ffed06.jpg");\
}\
.recommend-box .video-card-reco.bilibili-out-of-sight-out-of-mind .info-box .info .title,\
.extension .ext-box .video-card-common.ex-card-common.bilibili-out-of-sight-out-of-mind .card-pic .ex-title,\
#bili_report_live .live-list .zone-list-box .live-card.bilibili-out-of-sight-out-of-mind .up .txt .desc,\
.card-list .zone-list-box .video-card-common.bilibili-out-of-sight-out-of-mind .title,\
.manga-list-box .manga-card.bilibili-out-of-sight-out-of-mind .manga-title,\
.article-list .zone-list-box .article-card.bilibili-out-of-sight-out-of-mind .title,\
.rank-list .rank-wrap.bilibili-out-of-sight-out-of-mind p[title],\
.pgc-rank .pgc-rank-wrap.bilibili-out-of-sight-out-of-mind .txt .title,\
.manga-rank .manga-rank-wrap .manga-rank-list .manga-rank-item.bilibili-out-of-sight-out-of-mind .title,\
#bili_read .rank-list .rank-wrap.bilibili-out-of-sight-out-of-mind .preview .txt p[title],\
#bili_read .rank-list .rank-wrap.bilibili-out-of-sight-out-of-mind .title,\
#reco_list .rec-list .video-page-card.bilibili-out-of-sight-out-of-mind .card-box .info .title{\
  visibility: hidden;\
  /*display: inline-block;*/\
}\
.recommend-box .video-card-reco.bilibili-out-of-sight-out-of-mind .info-box .info .title:before,\
.extension .ext-box .video-card-common.ex-card-common.bilibili-out-of-sight-out-of-mind .card-pic .ex-title:before,\
#bili_report_live .live-list .zone-list-box .live-card.bilibili-out-of-sight-out-of-mind .up .txt .desc:before,\
.card-list .zone-list-box .video-card-common.bilibili-out-of-sight-out-of-mind .title:before,\
.manga-list-box .manga-card.bilibili-out-of-sight-out-of-mind .manga-title:before,\
.article-list .zone-list-box .article-card.bilibili-out-of-sight-out-of-mind .title:before,\
.rank-list .rank-wrap.bilibili-out-of-sight-out-of-mind p[title]:before,\
.pgc-rank .pgc-rank-wrap.bilibili-out-of-sight-out-of-mind .txt .title:before,\
.manga-rank .manga-rank-wrap .manga-rank-list .manga-rank-item.bilibili-out-of-sight-out-of-mind .title:before,\
#bili_read .rank-list .rank-wrap.bilibili-out-of-sight-out-of-mind .preview .txt p[title]:before,\
#bili_read .rank-list .rank-wrap.bilibili-out-of-sight-out-of-mind .title:before,\
#reco_list .rec-list .video-page-card.bilibili-out-of-sight-out-of-mind .card-box .info .title:before{\
  content:"已屏蔽该内容";\
  visibility: visible;\
}\
.recommend-box .video-card-reco.bilibili-out-of-sight-out-of-mind .info-box .info .up,\
.extension .ext-box .video-card-common.ex-card-common.bilibili-out-of-sight-out-of-mind .ex-up,\
#bili_report_live .live-list .zone-list-box .live-card.bilibili-out-of-sight-out-of-mind .up .txt .name,\
.card-list .zone-list-box .video-card-common.bilibili-out-of-sight-out-of-mind .up,\
.article-list .zone-list-box .article-card.bilibili-out-of-sight-out-of-mind .up,\
.rank-list .rank-wrap.bilibili-out-of-sight-out-of-mind .popover-video-card .content .info .subtitle .name,\
#reco_list .rec-list .video-page-card.bilibili-out-of-sight-out-of-mind .card-box .info .up{\
  visibility: hidden;\
  /*display: inline-block;*/\
  /*display: block;*/\
  display: grid;\
}\
.recommend-box .video-card-reco.bilibili-out-of-sight-out-of-mind .info-box .info .up:before,\
.extension .ext-box .video-card-common.ex-card-common.bilibili-out-of-sight-out-of-mind .ex-up:before,\
#bili_report_live .live-list .zone-list-box .live-card.bilibili-out-of-sight-out-of-mind .up .txt .name:before,\
.card-list .zone-list-box .video-card-common.bilibili-out-of-sight-out-of-mind .up:before,\
.article-list .zone-list-box .article-card.bilibili-out-of-sight-out-of-mind .up:before,\
.rank-list .rank-wrap.bilibili-out-of-sight-out-of-mind .popover-video-card .content .info .subtitle .name:before,\
#reco_list .rec-list .video-page-card.bilibili-out-of-sight-out-of-mind .card-box .info .up:before{\
  //content:"已屏蔽该UP主";\
  //visibility: visible;\
}\
.bilibili-out-of-sight-out-of-mind-setting-modal{\
display: none;\
vertical-align: middle;\
position: relative;\
z-index: 2;\
max-width: 500px;\
box-sizing: border-box;\
width: 90%;\
background: #fff;\
padding: 15px 30px;\
-webkit-border-radius: 8px;\
-moz-border-radius: 8px;\
-o-border-radius: 8px;\
-ms-border-radius: 8px;\
border-radius: 8px;\
-webkit-box-shadow: 0 0 10px #000;\
-moz-box-shadow: 0 0 10px #000;\
-o-box-shadow: 0 0 10px #000;\
-ms-box-shadow: 0 0 10px #000;\
box-shadow: 0 0 10px #000;\
text-align: left;\
}\
');

(function() {
    'use strict';
    let blocking = false;
    let blockTitleKeywordsList = [];
    let blockUpNameKeywordsList = [];
    let resetSelectorList1 = [
        ".video-card-reco", // 推荐
    ];
    let resetSelectorList2 = [
        ".video-card-reco", // 推荐
        ".video-card-common.ex-card-common", // 推广
        ".live-card", // 直播
        ".video-card-common", // 普通视频
        ".manga-card", // 漫画
        ".article-card", // 专栏
        ".rank-list .rank-wrap", // 排行榜-普通视频
        ".pgc-rank-wrap", // 排行榜-PGC
        ".manga-rank-item", // 排行榜-漫画
        "#bili_read .rank-wrap", // 排行榜-专栏
        "#reco_list .rec-list .video-page-card", // 视频详情页-推荐
    ];
    let titleSelectorList = [
        {selector:".recommend-box .video-card-reco .info-box .info p[title]", closest:".video-card-reco", up:".info-box .info .up" }, // 推荐
        {selector:".extension .ext-box .video-card-common.ex-card-common .card-pic .ex-title", closest:".video-card-common.ex-card-common", up:".ex-up"}, // 推广
        {selector:"#bili_report_live .live-list .zone-list-box .live-card .up .txt .desc", closest:".live-card", up:".up .txt .name"}, // 直播
        {selector:".card-list .zone-list-box .video-card-common .title", closest:".video-card-common", up:".up"}, // 普通视频
        {selector:".manga-list-box .manga-card .manga-title", closest:".manga-card"}, // 漫画
        {selector:".article-list .zone-list-box .article-card .title", closest:".article-card", up:".up"}, // 专栏
        {selector:".rank-list .rank-wrap p[title]", closest:".rank-wrap", up:".info .subtitle .name"}, // 排行榜-普通视频
        //{selector:".rank-list .rank-wrap .popover-video-card .content .info .f-title", closest:".rank-wrap", up:".info .subtitle .name"}, // 排行榜-普通视频
        {selector:".pgc-rank .pgc-rank-wrap .txt .title", closest:".pgc-rank-wrap"}, // 排行榜-PGC
        {selector:".manga-rank .manga-rank-wrap .manga-rank-list .manga-rank-item .title", closest:".manga-rank-item"}, // 排行榜-漫画
        {selector:"#bili_read .rank-list .rank-wrap .preview .txt p[title],#bili_read .rank-list .rank-wrap .title", closest:".rank-wrap"}, // 排行榜-专栏
        {selector:"#reco_list .rec-list .video-page-card .card-box .info .title", closest:".video-page-card", up:".card-box .info .up" }, // 视频详情页-推荐
    ];
    let upSelectorList = [
        {selector:".recommend-box .video-card-reco .info-box .info .up", closest:".video-card-reco", title:".info-box .info p[title]"}, // 推荐
        {selector:".extension .ext-box .video-card-common.ex-card-common .ex-up", closest:".video-card-common.ex-card-common", title:".ex-title"}, // 推广
        {selector:"#bili_report_live .live-list .zone-list-box .live-card .up .txt .name", closest:".live-card", title:".up .txt .desc"}, // 直播
        {selector:".card-list .zone-list-box .video-card-common .up", closest:".video-card-common", title:".title"}, // 普通视频
        {selector:".article-list .zone-list-box .article-card .up", closest:".article-card", title:".title"}, // 专栏
        {selector:".rank-list .rank-wrap .popover-video-card .content .info .subtitle .name", closest:".rank-wrap", title:".info .f-title"}, // 排行榜-普通视频
        {selector:"#reco_list .rec-list .video-page-card .card-box .info .up", closest:".video-page-card", title:".card-box .info .title" }, // 视频详情页-推荐
    ];
    function resetBlock(list=resetSelectorList1){
        // 重置
        $.each(list, function(rs_index, rs_item){
            if($(rs_item).hasClass("bilibili-out-of-sight-out-of-mind")){
                $(rs_item).removeClass("bilibili-out-of-sight-out-of-mind");
            }
        });
    }
    function runBlock(){
        //console.log("开始屏蔽");
        blocking = true;
        // 标题
        $.each(titleSelectorList, function(ts_index, ts_item){
            $(ts_item.selector).each(function(td_index,td_item){
                const titleText = td_item.innerText
                //console.log(titleText);
                $.each(blockTitleKeywordsList,function(bt_index,bt_item){
                    if($(td_item.closest(ts_item.closest)).hasClass("bilibili-out-of-sight-out-of-mind")){
                        $(td_item.closest(ts_item.closest)).remove("bilibili-out-of-sight-out-of-mind");
                    }
                    if(titleText.search(bt_item) !== -1){
                        if(!$(td_item.closest(ts_item.closest)).hasClass("bilibili-out-of-sight-out-of-mind")){
                           $(td_item.closest(ts_item.closest)).addClass("bilibili-out-of-sight-out-of-mind");
                        }
                    }else{
                    }
                });
            });
        });
        // up主
        $.each(upSelectorList, function(us_index, us_item){
            $(us_item.selector).each(function(ud_index,ud_item){
                const upNameText = ud_item.innerText
                //console.log(upNameText);
                $.each(blockUpNameKeywordsList,function(bu_index,bu_item){
                    if(upNameText.search(bu_item) !== -1){
                        if(!$(ud_item.closest(us_item.closest)).hasClass("bilibili-out-of-sight-out-of-mind")){
                           $(ud_item.closest(us_item.closest)).addClass("bilibili-out-of-sight-out-of-mind");
                        }
                    }else {

                    }
                });
            });
        });

        blocking = false;
        //console.log("屏蔽结束");
    }
    let observer = new MutationObserver(function (mutationsList) {
        // mutationsList参数是个MutationRecord对象数组，描述了每个发生的变化
        if(blocking) return;
        mutationsList.forEach(function (mutation) {
            //console.log(mutation);
            // 变化的类型
            switch(mutation.type) {
                case "childList":
                    // 子节点的变动
                    resetBlock();
                    runBlock();
                    break;
                case 'characterData':
                    // 文本内容变化
                    resetBlock();
                    runBlock();
                    break;
                case "subtree":
                    // 所有后代节点的变动
                    resetBlock();
                    runBlock();
                    break;
            }
        });
    });
    // 观察除了特性之外的所有变动
    //observer.observe(document.body, {
    //observer.observe(document.querySelectorAll(".first-screen.b-wrap,.storey-box.b-wrap"), {
    let watchingDom = undefined;
    if(document.querySelectorAll(".international-home")[0] != undefined){
        watchingDom = document.querySelectorAll(".international-home")[0];
    }else if(document.querySelectorAll("#reco_list")[0] != undefined){
        watchingDom = document.querySelectorAll("#reco_list")[0];
    }
    observer.observe(watchingDom, {
        childList: true, // Boolean 观察子节点的变动
        //attributes: true, // Boolean 观察属性的变动
        characterData: true, // Boolean 观察节点内容或节点文本的变动
        subtree: true, // Boolean 观察所有后代节点的变动
        //attributeOldValue: true, // Boolean 当观察到attributes变动时，是否记录变动前的属性值
        //characterDataOldValue: true, // Boolean 当观察到characterData变动时，是否记录变动前的属性值
        //attributeFilter: ["src"], // Array 指定需要观察的特定属性（比如[‘src’, ‘rows’]），不在此数组中的属性变化时将被忽略
    });

    // 停止跟踪变动
    // observer.disconnect();

    // 处理未处理的变动
    // let mutationRecords = observer.takeRecords();

    $(".international-footer .link-box .link-item.link-a ul").append('<a href="javascript:void(0);" style="margin-top: 3px;" class="setting-button-bilibili-out-of-sight-out-of-mind">设置黑名单</a>');

    $("body").append('<div class="bilibili-out-of-sight-out-of-mind-setting-modal"><p>双击编辑，回车保存。</p><br><p>标题关键词：</p><input id="bilibili-out-of-sight-out-of-mind-tags-input-title" value="" /><p><br>up主关键词：</p><input id="bilibili-out-of-sight-out-of-mind-tags-input-up-name" value="" /></div>')

    $(".setting-button-bilibili-out-of-sight-out-of-mind").on("click",function(){$(".bilibili-out-of-sight-out-of-mind-setting-modal").modal({fadeDuration: 100});});
    $(".bilibili-out-of-sight-out-of-mind-setting-modal").on($.modal.BEFORE_OPEN, function(event, modal) {
        //console.log("before open modal");
        //GM_getValue("bilibili_out_of_sight_out_of_mind_block_title_keywords")
        //GM_getValue("bilibili_out_of_sight_out_of_mind_block_up_name_keywords")
        //tagifyTitle.removeAllTags();
        //tagifyUpName.removeAllTags();
        //tagifyTitle.addTags(JSON.parse(GM_getValue("bilibili_out_of_sight_out_of_mind_block_title_keywords")));
        //tagifyUpName.addTags(JSON.parse(GM_getValue("bilibili_out_of_sight_out_of_mind_block_up_name_keywords")));
    });

    $(".bilibili-out-of-sight-out-of-mind-setting-modal").on($.modal.CLOSE, function(event, modal) {
        //console.log("close modal");
        //console.log(blockTitleKeywordsList);
        //console.log(blockUpNameKeywordsList);
        blocking = false;
        resetBlock(resetSelectorList2);
        runBlock();
    });

    //function onAddTag(e, tagData){
    //    console.log("e: ", e);
    //    console.log("onAddTag: ", e.detail);
    //    console.log("original input value: ", tagInputElm.value)
    //}
    //function onRemoveTag(e){
    //    console.log("e: ", e);
    //    console.log("onRemoveTag:", e.detail, "tagify instance value:", tagify.value)
    //    console.log("original input value: ", tagInputElm.value)
    //}
    //function onTagEdit(e){
    //    console.log("e: ", e);
    //   console.log("onTagEdit: ", e.detail);
    //    console.log("original input value: ", tagInputElm.value)
    //}
    function onTagTitleChange(e){
        //console.log("title~");
        //console.log("e: ", e);
        //console.log("onTagChange: ", e.detail);
        //console.log("original input value: ", tagInputTitleElm.value);
        GM_setValue("bilibili_out_of_sight_out_of_mind_block_title_keywords",tagInputTitleElm.value);
        //console.log("bilibili_out_of_sight_out_of_mind_block_title_keywords:", GM_getValue("bilibili_out_of_sight_out_of_mind_block_title_keywords"));
        if(tagInputTitleElm.value != ""){
           const arrValue = JSON.parse(tagInputTitleElm.value);
           let _temp = [];
           try{
               $.each(arrValue, function(index,item){
                   _temp.push(item.value);
               });
           }catch(e){
               _temp = [];
           }
           blockTitleKeywordsList = _temp;
       }else{
           blockTitleKeywordsList = [];
       }
    }
    function onTagUpNameChange(e){
        //console.log("up name~");
        //console.log("e: ", e);
        //console.log("onTagChange: ", e.detail);
        //console.log("original input value: ", tagInputUpNameElm.value);
        GM_setValue("bilibili_out_of_sight_out_of_mind_block_up_name_keywords",tagInputUpNameElm.value);
        if(tagInputUpNameElm.value != ""){
           const arrValue = JSON.parse(tagInputUpNameElm.value);
           let _temp = [];
           try{
               $.each(arrValue, function(index,item){
                   _temp.push(item.value);
               });
           }catch(e){
               _temp = [];
           }
           blockUpNameKeywordsList = _temp;
       }else{
           blockUpNameKeywordsList = [];
       }
    }

    let tagInputTitleElm = document.querySelector('#bilibili-out-of-sight-out-of-mind-tags-input-title');
    let tagInputUpNameElm = document.querySelector('#bilibili-out-of-sight-out-of-mind-tags-input-up-name');
    let tagifyTitle = new Tagify(tagInputTitleElm, {});
    let tagifyUpName = new Tagify(tagInputUpNameElm, {});

    //tagify.on('add', onAddTag);
    //tagify.on('remove', onRemoveTag);
    //tagify.on('edit:updated', onTagEdit);
    tagifyTitle.on('change', onTagTitleChange);
    tagifyUpName.on('change', onTagUpNameChange);

    const blockTitleKeywordsListValue = GM_getValue("bilibili_out_of_sight_out_of_mind_block_title_keywords");
    //console.log("blockTitleKeywordsListValue：",blockTitleKeywordsListValue);
    if(blockTitleKeywordsListValue) {
       if(blockTitleKeywordsListValue != ""){
           const arrValue = JSON.parse(blockTitleKeywordsListValue);
           let _temp = [];
           try{
               $.each(arrValue, function(index,item){
                   _temp.push(item.value);
               });
               tagifyTitle.removeAllTags();
               tagifyTitle.addTags(arrValue);
           }catch(e){
               //console.log(e);
               GM_setValue("bilibili_out_of_sight_out_of_mind_block_title_keywords","");
               _temp = [];
           }
           blockTitleKeywordsList = _temp;

           resetBlock();
           runBlock();
           //console.log("blockTitleKeywordsList:",blockTitleKeywordsList);
       }else{
           GM_setValue("bilibili_out_of_sight_out_of_mind_block_title_keywords","");
           blockTitleKeywordsList = [];
       }
    }else {
        GM_setValue("bilibili_out_of_sight_out_of_mind_block_title_keywords","");
        blockTitleKeywordsList = [];
    }

    const blockUpNameKeywordsListValue = GM_getValue("bilibili_out_of_sight_out_of_mind_block_up_name_keywords");
    //console.log("blockUpNameKeywordsListValue：",blockUpNameKeywordsListValue);
    if(blockUpNameKeywordsListValue) {
       if(blockUpNameKeywordsListValue != ""){
           const arrValue = JSON.parse(blockUpNameKeywordsListValue);
           let _temp = [];
           try{
               $.each(arrValue, function(index,item){
                   _temp.push(item.value);
               });
               tagifyUpName.removeAllTags();
               tagifyUpName.addTags(arrValue);
           }catch(e){
               GM_setValue("bilibili_out_of_sight_out_of_mind_block_up_name_keywords","");
               _temp = [];
           }
           blockUpNameKeywordsList = _temp;
           resetBlock();
           runBlock();
       }else{
           GM_setValue("bilibili_out_of_sight_out_of_mind_block_up_name_keywords","");
           blockUpNameKeywordsList = [];
       }
    }else {
        GM_setValue("bilibili_out_of_sight_out_of_mind_block_up_name_keywords","");
        blockUpNameKeywordsList = [];
    }
})();

