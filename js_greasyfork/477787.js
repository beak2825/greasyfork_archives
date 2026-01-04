// ==UserScript==
// @name         批量下载小红书图片和视频
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  一个从小红书不带水印保存图像和视频的插件。
// @author       xsFish
// @match        https://www.xiaohongshu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_download
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js
// @resource     CSS http://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css
// @downloadURL https://update.greasyfork.org/scripts/477787/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%9B%BE%E7%89%87%E5%92%8C%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/477787/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%9B%BE%E7%89%87%E5%92%8C%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==


(function() {
    'use strict';
    GM_addStyle(GM_getResourceText("CSS"));

    const dict = {
        jpg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
    }

    let selectAllFlag = 1;

    function convertImage(image, format) {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext("2d").drawImage(image, 0, 0);
        return canvas.toDataURL(format);
    }

    function createImage(url) {
        return new Promise(function (resolve, reject) {
            const img = new Image();
            img.src = url;
            img.crossOrigin = "anonymous";
            img.onload = function () {
                resolve(img);
            }
            img.onerror = function () {
                reject(new Error('图片加载失败！'))
            }
        })
    }

    function downloadImage(url, name) {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        link.click();
    }

    function getAuthorDeatails() {
        const $author = $('a.name')[0].text;
        const $title = $('#detail-title').text();
        return { author: $author, title: $title }
    }

    function updateCount() {
        const $checkboxes = $('input[type="checkbox"]');
        const selectedCount = $checkboxes.filter(':checked').length;
        const imgCount = $checkboxes.length;
        $('#exampleModalLabel').text('请选择下载的图片,已选中' + selectedCount + '/' + imgCount);

        const buttonElement = $('#select-all-btn');

        if (imgCount === selectedCount) {
            buttonElement.text('全不选') //  全不选状态ing
            selectAllFlag = 1
        } else {
            buttonElement.text('全选') //  全选状态ing
            selectAllFlag = 0
        }
    }

    function isInNote() {
        return (location.href.indexOf('https://www.xiaohongshu.com/explore/') === 0);
    }

    function getUrls() {
        const urls = new Set();

        $('.swiper .swiper-slide').each(function() {
            const bgImg = this.style['background-image'] || '';
            const res = /"(.*)"/g.exec(bgImg);
            if (res) {
                urls.add(res[1]);
            } else {
                console.error('未匹配到图片URL: ', bgImg);
            }
        });

        $('#list').html('');
        urls.forEach(function (value, index){
            const element = `<li class="list-group-item">
                        <input class="form-check-input me-1" type="checkbox" value="" id="pic_${index}" data-url="${value}" checked>
                        <label class="form-check-label" for="pic_${index}">
                        <div style="width: 700px">
                        <div style="max-width: 200px; max-height: 200px; overflow: hidden">
                        <img src="${value}" alt="略缩图" class="rounded float-start" style="max-height: 150px; max-width: 100px">
                        </div>
                        </div>
                        </label>
                        </li>`;

            $('#list').append(element);
        })
    }

    $(document).ready(function() {

        let lastUrl = '';
        var $isVideo = $('video').length;

        setInterval(function () {
            const nowUrl = location.href;
            if (nowUrl !== lastUrl) {
                console.log('切换新地址:' + nowUrl);

                if (isInNote()) {
                    const isSliderContainer = $(".slider-container").length;
                    const isPlayerContainer = $(".player-container").length;

                    if (!isSliderContainer && !isPlayerContainer) {
                        return;
                    }

                    console.log('现在在笔记的页面:' + nowUrl);
                    const focusImg = $('.swiper-slide.swiper-slide-active');
                    $(".donot-search").remove();

                    if (isPlayerContainer) {
                        console.log("现在是视频视图1")
                        $('.note-container .follow-button').each(function() {
                            if (!$(this).hasClass('donot-search')) {
                                const $h1 = $(`
                        <button
                        class="reds-button-new follow-button large primary follow-button donot-search"
                        style="background-color: green;margin-right: 10px;"
                        id="download_movie_btn">
                        <span class="reds-button-new-box">
                        <span class="reds-button-new-text">
                        下载视频
                        </span>
                        </span>
                        </button>
                        `);
                                ($h1).insertBefore(this);
                            }
                        })

                    } else {
                        console.log("现在不是视频视图1")
                        focusImg.trigger('focus')
                        $('.note-container .follow-button').each(function() {
                            if (!$(this).hasClass('donot-search')) {
                                const $h1 = $(`
                        <button
                        class="reds-button-new follow-button large primary follow-button donot-search"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        style="background-color: green;margin-right: 10px;">
                        <span class="reds-button-new-box">
                        <span class="reds-button-new-text">
                        下载图片
                        </span>
                        </span>
                        </button>
                        `);
                                ($h1).insertBefore(this);
                            }
                        })
                    }

                }
                lastUrl = nowUrl;
            }
        }, 500);


        $('body').on('click', '#download_movie_btn', function() {
            const videoUrl = $('video').attr("src");
            const regex = /\.([^.]+)$/;
            const match = regex.exec(videoUrl);
            console.log("下载的视频地址为： ", videoUrl);
            const details = getAuthorDeatails();
            const format = match? match[1]:'mp4';
            console.log(format);
            GM_download(videoUrl, `${details['author']}-${details['title']}.${format}`);
        })

        const html = `
                            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                            <div class="modal-content">
                            <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">请选择下载的图片</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                            <ul class="list-group" id="list" style="overflow-y: scroll; max-height: 600px;"></ul>
                            </div>
                            <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" id="select-all-btn" style="width: 100px; height: 42.25px">全不选</button>
                            <select class="form-select form-select-lg" aria-label="请选择需要下载的格式" id="select-format" style="flex: 1">
                            <option value="jpg" selected>JPG格式</option>
                            <option value="png">PNG格式</option>
                            <option value="webp">WebP格式</option>
                            </select>
                            <button type="button" class="btn btn-primary" id="downloadBtn" style="width: 100px; height: 42.25px">下载</button>
                            </div>
                            </div>
                            </div>
                            </div>
                            `
        $('body').append(html)
        $('body').on('click', 'button[data-bs-target="#exampleModal"]', function() {
            getUrls();
            updateCount()
        })

        $('#list').on('change', 'input[type="checkbox"]', function() {
            updateCount()
        })

        $("#select-all-btn").click(function() {
            const toggleElements = $('input[type="checkbox"]');
            if (selectAllFlag === 1) {
                toggleElements.each(function() {
                    $(this).prop('checked', false);
                })
            } else {
                toggleElements.each(function() {
                    $(this).prop('checked', true);
                })
            }
            updateCount()
        })

        $("#downloadBtn").click(function() {
            const selectUrls = [];
            const selectPic = $('input[type="checkbox"]:checked');
            const selectFormat = $("#select-format").val();
            selectPic.each(function () {
                selectUrls.push($(this).attr('data-url'))
            })
            const tasks = selectUrls.map(function (value) {
                return createImage(value)
            })
            Promise.all(tasks)
                .then(function(results) {
                console.log('所有数据获取成功:', results);

                const details = getAuthorDeatails();

                results.forEach(function (value, index) {
                    const res = convertImage(value, dict[selectFormat]);
                    downloadImage(res, `${details['author']}-${details['title']}-${index}.${selectFormat}`);
                    $('#exampleModal').modal('hide');
                })
            })
                .catch(function(error) {
                console.error('获取数据出错:', error);
                // 在这里可以处理错误或执行其他操作
            });
        });

    })

})();