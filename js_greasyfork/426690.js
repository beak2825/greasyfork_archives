// ==UserScript==
// @name         优丝库(绅士图)
// @namespace    https://www.shegou.vip/
// @version      1.1.0
// @description  免费观看优丝库图片(绅士图)，手机电脑均可使用，觉得不错的话，给个好评呦😜
// @author       LMB
// @match        https://yskhd.com/*
// @icon         https://yskhd.com/wp-content/themes/modown/static/img/smilies/drooling.png
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jszip/3.7.1/jszip.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/FileSaver.js/2.0.5/FileSaver.min.js
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/426690/%E4%BC%98%E4%B8%9D%E5%BA%93%28%E7%BB%85%E5%A3%AB%E5%9B%BE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/426690/%E4%BC%98%E4%B8%9D%E5%BA%93%28%E7%BB%85%E5%A3%AB%E5%9B%BE%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle(".download{display:block; margin: 0;padding: 1px 0;font-size: 16px;text-align: center;background-color: #fbb715;color: #ffffff;border-bottom-left-radius: 3px;border-bottom-right-radius: 3px;cursor: pointer;}");

    $('div.banner-slider').hide();
    $('li.nav-search').siblings().hide();
    $('ul.nav-main li:last').hide();
    $('div.theiaStickySidebar div.widget_block').hide();
    $('div.gallery-login').hide();
    $('div.rollbar ul li:first').hide();
    $('div.user-vip').hide();
    $('div.single-comment').hide();
    var isShow = true;
    var flag = false;
    removeH5dh();

    

    $('div.rollbar ul').append(`<li><a id="downbtn" href="javascript:void(0)"><i class="icon icon-download"></i></a><h6 id="htext">打包下载<i></i></h6></li>`);

    var posts = document.querySelector(".posts");

    if(posts != null){
        let a_list = document.querySelectorAll(".posts a");
        for(let i=0; i<a_list.length; i++){
            a_list[i].target="_blank";
        }
    }

    if($('div.gallery-blur-item').length > 0){
        var title_head = document.querySelector("h1").innerText;
        var first_url = $("div.gallery-item a")[0].href;
        var ver = first_url.indexOf("-scaled");
        var loc_isshow = localStorage.getItem("isShow");
        var btn_html = '<p><a id="downbtn" href="javascript:void(0)"><i style="color: #f9df32;" class="icon icon-download"></i></a><span style="color: #f9df32;font-size: 1.2em;margin-left:5px;">👈点击左侧按钮打包下载</span></p>';

        if(loc_isshow == 'true') isShow = true;
        else if(loc_isshow == 'false') isShow = false;
        else localStorage.setItem("isShow", true);

        var bef_img = $("span.img img");
        $('div.gallery-blur-item').addClass('gallery-fancy-item');
        $('div.gallery-blur-item').removeClass('gallery-blur-item');
        $('#gallery-2').prepend(btn_html);
        for(var i=0; i<bef_img.length; i++){
            let img_title = title_head + " "+(i+4);
            let bef_src = bef_img[i].src;
            let aft_src = ver != -1 ? bef_src.replace('285x285', 'scaled') : bef_src.replace('-285x285', '');
            if(i==bef_img.length-1){
                aft_src = aft_src.replace('-scaled', '')
            }
            let aftjd = `<a href="${aft_src}" data-fancybox="gallery-2"><img width="285" height="285" src="${bef_src}" title="${img_title}" class="attachment-thumbnail size-thumbnail" alt="${img_title}" loading="lazy" style="filter:none;"></a>`;
            $("span.img:eq(0)").replaceWith(aftjd);
        }
       //btnshow();
    }

    $("#downbtn").click(function(){
        //批量下载
        if (!flag) {
            downloadPack();
        } else {
            alert('下载中, 请耐心等待...\n点击确认继续下载');
        }
        //弃用
        //if(isShow){
        //    isShow = false;
        //    localStorage.setItem("isShow", false);
        //}else{
        //    isShow = true;
        //    localStorage.setItem("isShow", true);
        //}
        //btnshow();
    });

    function removeH5dh(){
        $("div.footer-fixed-nav a:gt(1)").remove();
        $("div.footer-fixed-nav a").css('width','50%');
        $("ul.cat-nav li:last").remove();
        //console.log(dh_bottom);
    }
    // 弃用
    function btnshow(){
        if(isShow){
            for(let j=0; j<$("div.gallery-item").length; j++){
                let url = $("div.gallery-item a[data-fancybox='gallery-2']")[j].href;
                let tag = `<a href='${url}' target="_blank" style="color: #ffffff;text-decoration: none;" class="download">下载</a>`;
                $("div.gallery-item").eq([j]).append(tag);
            }
            $("#htext").text('隐藏下载按钮');
        }else{
            $("div.gallery-item a").remove(".download");
            $("#htext").text('显示下载按钮');
        }
    }
    //******新增zip下载
    async function downloadPack() {
        flag = true;
        console.log("start download...");
        var start = performance.now();

        var list = document.querySelectorAll(".article-content img");
        var zip = new JSZip();
        for(let i=0; i<list.length; i++){
            var url = list[i].getAttribute('src').replace('285x285', 'scaled');
            if(i==list.length-1){
                url = url.replace('-scaled', '');
            }
            var filename = list[i].getAttribute('title');
            console.log(url,filename);
            const response = getFile(url);
            //console.log(response);
            zip.file(filename+'.jpg', response);
        }
        zip.generateAsync({
            type: 'blob'
        }).then(function (content) {
            saveAs(content, title_head + '.zip');
            var end = performance.now();
            flag = false;
            console.log('completed: ', `${(end - start) / 1000} ms`);
        });
    }

    //******新增下载文件
    async function getFile(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    referer: "https://" + window.location.host
                },
                responseType: "blob",
                onload: function (response) {
                    //console.log(response);
                    resolve(response.response);
                },
                onerror: function (error) {
                    //console.log(error);
                    reject(error);
                }
            });
        });
    }

})();