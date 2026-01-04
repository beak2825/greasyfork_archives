// ==UserScript==
// @name         아카라이브 게시글 URL 추출
// @namespace    http://tampermonkey.net/
// @version      2025-04-17
// @description  try to take over the world!
// @author       kts
// @match        https://arca.live/b/*
// @match        https://arca.live/u/scrap_list*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arca.live
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/486591/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EA%B2%8C%EC%8B%9C%EA%B8%80%20URL%20%EC%B6%94%EC%B6%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/486591/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EA%B2%8C%EC%8B%9C%EA%B8%80%20URL%20%EC%B6%94%EC%B6%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals $ */
    // Your code here...

    const articlestring = localStorage.getItem('recent_articles');
    const articles = JSON.parse(articlestring);
    const regex = /[^0-9]/g;

    let isEnd = false;
    let saved_str;

    const get_url_div = "<div class='sidebar-item sidebar_urls'><div class='item-title'>게시글 URL 추출</div><div class='input-group'><div class='input-group-prepend'><select class='form-control form-control-sm' name='target'><option value='0'>읽음무시개수</option><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='45'>all</option></select></div><div class='input-group-append'><button class='btn btn-arca btn-sm sidebar_get_urls'>추출/전체복사</button></div></div><span><br><p>읽음무시개수는 이미 읽은 글을 무시하는 옵션이에요.</p><p>결과화면에서 휠을 굴리면 url을 수동으로 복사할 수 있어요.</p><p></p></span></div>";
    if ($(".sticky-container").length) {
        $(".sticky-container").before(get_url_div);
    } else{
        $("aside.right-sidebar").append(get_url_div);
    }

    $(document).on("click","button.sidebar_get_urls",function(){
        $("div.sidebar_urls").empty();

        let idx = 0;
        let download_link_sum = "";
        let cnt_pass = 0;
        try{
            cnt_pass = $(this).closest('.input-group').find('select').val();
        }catch(e){
            cnt_pass = 0;
        }

        $("a.column").not(".notice").each(function(){

            const href = $(this).attr("href");
            const title = $(this).find("span.title").text();
            const articleIdMatch = href.match(/\/b\/simya\/(\d+)/);
            let article_Id;
            if (articleIdMatch) {
                article_Id = articleIdMatch[1];
            } else {
                article_Id = null;
            }

            let isExisting = articles.some(article => article.articleId === Number(article_Id));
            console.log(article_Id + ': ' + isExisting);

            // pass process
            if(isExisting){
                if(cnt_pass > 0){
                    cnt_pass--;
                    isExisting = false;
                }
            }

            if(isExisting){
                // 여기까지 이미 읽음
                return false;
            }else{
                const urls = "<span class='copy_url' title='"+title+"' url_id ='"+(idx++)+"' url='https://arca.live" + href + "'>"+idx+": "+title+"<br></span>";
                $("div.sidebar_urls").prepend(urls);
                download_link_sum = 'https://arca.live' + href + ' ' + download_link_sum;
                saved_str = download_link_sum;
            }
        });



        try {
            isEnd = true;
            navigator.clipboard.writeText(download_link_sum);
            console.log(download_link_sum);
        } catch (er) {
        }
    });


    $(document).on("wheel","div.sidebar_urls",function(){
        if(isEnd){
            let temp_str = $("div.sidebar_urls").html();
            $("div.sidebar_urls").html(saved_str);
            saved_str = temp_str;

        }
    });

    $(document).on("click","span.copy_url",function(){
        try {
            navigator.clipboard.writeText($(this).attr('url'));
            $(this).hide();
        } catch (er) {
        }
    });

})();