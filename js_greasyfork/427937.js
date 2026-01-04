// ==UserScript==
// @name            nhentai漫画阅读模式
// @namespace       https://nhentai.xxx/
// @version         0.1
// @description     漫画阅读模式，从上到下顺序展示图片
// @author          jueserencai
// @match           https://nhentai.xxx/g/*
// @icon            data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==

// @require         https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/427937/nhentai%E6%BC%AB%E7%94%BB%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/427937/nhentai%E6%BC%AB%E7%94%BB%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 不同网站可变动的部分------------------------------------------------
    // 获取总页码
    function getPageNum() {
        return $(".thumb-container").length;
    }

    // 获取每一张img 所在的http url列表
    function getPageUrls() {
        let pageUrls = [];
        $("#thumbnail-container > div > div > a").each(function (index, element) {
            pageUrls.push(element.href);
        });
        return pageUrls;
    }

    // 从页面中获取当前这一页img 的 selector path
    const IMG_SELECTOR = "#image-container > a > img";

    // 不同网站可变动的部分------------------------------------------------


    // 不同网站不变的部分。不同网站的主体流程是一样的，只用更改上面的函数或常量适配不同网站即可

    let pageNum = getPageNum();
    if (!pageNum) return;
    console.log(`page num: ${pageNum}`);


    // 页面元素初始化
    initDom();


    let pageUrls = ["unused head"].concat(getPageUrls());
    console.log("pageUrls: ", pageUrls);


    // 所有页码的图片的src地址
    let imgSrcMap = new Map();


    (async function () {
        console.log("开始执行：", new Date());
        // 每次加载少量页码
        // let pageNumInOnce = 5;
        // for (let currentPage = 1; currentPage <= pageNum; currentPage += pageNumInOnce) {
        //     await Promise.all(getImgSrcInPageRange(currentPage, Math.min(currentPage + pageNumInOnce, pageNum + 1)));
        //     console.log(`载入${currentPage}`);
        //     let src = imgSrcMap.get(currentPage);
        //     console.log(`currentPage ${currentPage}, src: ${src}`);
        //     await sleep(Math.floor(Math.random() * 1000));
        //     console.log("sleep");
        // }

        // 一次加载全部页码
        await Promise.all(getImgSrcInPageRange(1, pageNum + 1));
        console.log("结束执行：", new Date());
        console.log("imgSrcMap ", imgSrcMap);

        // 漫画所有页的img src 放入 modal中
        generateImgModal();

    })();


    // 加载所需的库，以及插入dom
    function initDom() {

        // 加载 bootstrap
        $("head").prepend(`
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        `)

        $("body").append(`
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
                integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
                crossorigin="anonymous"></script>
            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
                integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
                crossorigin="anonymous"></script>
        `)
        console.log("bootstrap 加载完毕")


        // 添加 阅读按钮
        $("body").prepend(`
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong">
                阅读模式
            </button>

            <!-- Modal -->
            <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle"
                aria-hidden="true" style="z-index: 2147483647;">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle"></h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div id="imgList" class="modal-body">
                            ...
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }

    // 获取一页中的 img src
    function getImgSrc(page, url) {
        return new Promise((resolve, reject) => {
            return GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    let htmlstr = response.responseText;
                    let src = $(htmlstr).find(IMG_SELECTOR).attr('src');
                    console.log(src);
                    imgSrcMap.set(page, src);
                    resolve(page);
                }
            });
        });
    }

    // 获取页面范围内的img src
    function getImgSrcInPageRange(pageStart, pageEnd) {
        let awaitList = []
        for (let page = pageStart; page < pageEnd; page++) {
            const pageUrl = pageUrls[page];
            awaitList.push(getImgSrc(page, pageUrl))
        }
        return awaitList;
    }

    // 休眠，为了防止一下子加载太多
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 将所有页码的img 插入到modal中
    function generateImgModal() {
        let imgListHtml = ``
        for (let p = 1; p <= pageNum; p++) {
            const imgSrc = imgSrcMap.get(p);
            imgListHtml += `
                <div style="margin-top: 10px;"></div>
                <img id="p_${p}" src="${imgSrc}" style="width: 100%;">
                `
        }

        $("#imgList").html($(imgListHtml))
    }

})();

