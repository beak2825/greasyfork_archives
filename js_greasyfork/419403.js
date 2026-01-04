// ==UserScript==
// @name         wap.faloo.com Auto download image
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  Tự động lưu image vip trên bfaloo.com
// @author       mkbyme
// @include      /https:\/\/(wap|b).faloo.com\/((\d+\_\d+)|((p|vip)\/\d+\/\d+)).html/
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js
// @require https://code.jquery.com/jquery-3.5.1.slim.min.js
// @resource bootstrap5Css https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css
// @downloadURL https://update.greasyfork.org/scripts/419403/wapfaloocom%20Auto%20download%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/419403/wapfaloocom%20Auto%20download%20image.meta.js
// ==/UserScript==
var bootstrap5Css = GM_getResourceText("bootstrap5Css");
GM_addStyle(bootstrap5Css);
(function () {
    'use strict';
    let uiTemplate = `
    <style>
    .mk-wrap {
        position: fixed;
        top: 0;
        right: 0;
        background-color: #4caf50;
    }

    .mk-wrap .input-group *,
    .mk-wrap button {
        font-size: 13px !important;
        padding: 5px !important;
        border-radius: 5px !important;
    }

    .mk-wrap .input-group-text {
        border-top-right-radius: 0 !important;
        border-bottom-right-radius: 0 !important;
    }

    .mk-wrap .form-control {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
    }

    .mk-wrap .form-control:focus {
        color: #212529;
        background-color: #fff;
        border-color: #86b7fe;
        outline: 0;
        box-shadow: 0 0 0 5px rgb(13 110 253 / 25%);
    }

    .mk-wrap h1 {
        font-size: 20px !important;
    }

    .mk-wrap h3 {
        font-size: 18px !important;
        margin-bottom: 10px !important;
    }

    .mk-wrap h5 {
        font-size: 15px !important;
    }

    .mk-wrap .form-check {
        min-height: 13px !important;
    }

    .mk-wrap .form-check-input:focus,
    .mk-wrap .btn:focus {
        box-shadow: 0 0 0 5px rgb(13 110 253 / 25%);
    }

    .mk-wrap .p-1,
    .mk-wrap.p-1 {
        padding: 15px !important;
    }

    .mk-wrap .mb-1 {
        margin-bottom: 10px !important;
    }

    .mk-wrap .rounded-1 {
        border-radius: 5px !important;
    }
</style>
<div class="mk-wrap main-view p-1 rounded-1 shadow-sm">
    <h3>Auto download image bfaloo.com by @<a href="https://m.me/mkbyme" target="_blank">mkbyme</a></h3>
    <div class="mk-body">
        <h5>Thiết lập cấu hình tải xuống</h5>
        <div>
            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text">Thời gian chờ load ảnh xong(s)</span>
                <input type="number" value="15" class="form-control mk-txt-loadimage">
            </div>
            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text">Thời gian mở chương mới(s)</span>
                <input type="number" value="30" class="form-control mk-txt-timer">
            </div>
            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text">Tiền tố lưu tệp ảnh</span>
                <input type="text" value="" placeholder="Ví dụ: tên truyện" class="form-control mk-txt-prefix"
                    aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
            </div>
            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text">CSS Selector ảnh VIP</span>
                <input type="text" value="#content img[id^=vip]" placeholder="CSS Selector để chọn ra các ảnh VIP"
                    class="form-control mk-txt-css-selector">
            </div>
            <div class="input-group input-group-sm mb-1">
                <span class="input-group-text">Nhập số lượng chương cần tải</span>
                <input type="number" value="10" placeholder="Số lượng chương cần tải tính từ chương hiện tại"
                    class="form-control mk-txt-download-chapter-count">
            </div>
            <div class="form-check">
                <input class="form-check-input mk-chk-save-with-chapter-name" checked type="checkbox"
                    id="chkExtChapterName">
                <label class="form-check-label" for="chkExtChapterName">
                    Tên ảnh kèm tên của chapter
                </label>
            </div>
            <div class="mk-status"></div>
        </div>
    </div>
    <div class="mk-footer d-flex justify-content-between">
        <div class="d-flex">
            <button class="btn btn-success mk-btn-save-config">Lưu lại</button>
            <button class="btn btn-light mk-btn-download">Bắt đầu tải</button>
        </div>
        <div class="">
            <button class="btn btn-light mk-btn-pause">Tạm dừng</button>
            <button class="btn btn-light mk-btn-collapse">Thu nhỏ</button>
        </div>
    </div>
</div>
<div class="mk-wrap hidden-view p-1 rounded-1 shadow-sm d-none">
    <button class="btn btn-light mk-btn-expanse">Mở rộng</button>
</div>
`;
    var div = document.createElement("div");
    var $ = window.jQuery;
    div.innerHTML = uiTemplate;
    document.body.appendChild(div);

    var key = {
        LoadImageDelay: "load_image_delay",
        Timer: "timer",
        Prefix: "prefix",
        HasNextChatper: "next_chapter",
        CssSelectorImages: "css_selector_img",
        DownloadStatus: "download_status",
        ExtIncludeChapterName: "ext_inc_chapter_name",
        DownloadChapterCount: "download_count",
        DownloadChapterCountInit: "download_count_init",
    };
    //common function
    var hanlderStatus = null;
    var downloadStatus = 1;
    var downloadChatperCount = 10;
    var downloadChatperCountInit = 10;
    var fnUpdateStatus = function (text) {
        $(".mk-wrap .mk-status").text(text);
        console.log(text);
        if (hanlderStatus) {
            clearTimeout(hanlderStatus);
        }
        //xóa text sau 3s
        hanlderStatus = setTimeout(() => {
            $(".mk-wrap .mk-status").text("");
        }, 3000);
    }
    var fnSetConfig = function (name, value) {
        window.localStorage.setItem(`mkconfig_${name}`, value);
    }
    var fnGetConfig = function (name, defaulValue = 0, type = 1) {
        let ret = defaulValue;
        if (window.localStorage) {
            ret = window.localStorage.getItem(`mkconfig_${name}`);
            if (ret) {
                if (type == 1 && /^\d+$/.test(ret)) {
                    //number
                    ret = parseInt(ret);
                }
                else if (type == 2) {
                    //boolean
                    if (ret.toLowerCase() == "true") {
                        ret = true;
                    }
                    else {
                        ret = false;
                    }
                }
            }
        }
        return ret ? ret : defaulValue;
    }
    var fnGetNumberValue = function (selector, defaultValue = 15) {
        if (!defaultValue) {
            defaultValue = 0;
        }
        var ret = defaultValue;
        let val = $(selector).val();
        if (val && /^\d+$/.test(val)) {
            ret = parseInt(val);
        }
        return ret;
    }
    var fnInit = function () {
        var hasNextChatper = fnGetConfig(key.HasNextChatper, 0);
        downloadStatus = fnGetConfig(key.DownloadStatus, 0);
        downloadChatperCount = fnGetConfig(key.DownloadChapterCount, 10);
        downloadChatperCountInit = fnGetConfig(key.DownloadChapterCountInit, 10);
        $('.mk-wrap .mk-txt-loadimage').val(fnGetConfig(key.LoadImageDelay, 15));
        $('.mk-wrap .mk-txt-timer').val(fnGetConfig(key.Timer, 30));
        $('.mk-wrap .mk-txt-prefix').val(fnGetConfig(key.Prefix, "", 0));
        $('.mk-wrap .mk-txt-css-selector').val(fnGetConfig(key.CssSelectorImages, "#content img[id^=vip], div[id^=img_src]", 0));
        $('.mk-wrap .mk-chk-save-with-chapter-name').prop('checked', fnGetConfig(key.ExtIncludeChapterName, 0) ? true : false);
        $('.mk-wrap .mk-txt-download-chapter-count').val(downloadChatperCount);

        //chọn pageWith 1200
        setTimeout(()=>{
            $(".setWindow > .ss_fontColorset + .ss_fontset li.pageWidth:last-child").click();
            console.log("set maxwidth");
        }, 1000);

        if (downloadStatus) {
            $(".mk-wrap .mk-btn-pause").text("Tạm ngừng");
        }
        else {
            $(".mk-wrap .mk-btn-pause").text("Tiếp tục");
        }

        if (hasNextChatper) {
            var timerDelay = fnGetNumberValue('.mk-wrap .mk-txt-loadimage', 15);
            var timerDelayCount = timerDelay;
            var logImageHandler = setInterval(() => {
                if (downloadStatus) {
                    if (timerDelayCount > 0) {
                        timerDelayCount--;
                        fnUpdateStatus(`Đang chờ tải ảnh xong....${timerDelayCount}(s)`);
                    }
                    else {
                        clearInterval(logImageHandler);
                        fnDownload();
                    }
                }
                else {
                    fnUpdateStatus(`Đã tạm dừng`);
                }
            }, 1000);

        }
    }
    var fnGetImageUrl = function (el) {
        let url = "";
        if (el.id.indexOf("img_src") > -1) {
            let tempUrl = el.style.backgroundImage;
            if(tempUrl){
                var arr = /\"(.+)\"/.exec(tempUrl);
                if(arr && arr.length > 1){
                    url = `http:${arr[1]}`;
                }
            }
        }
        else {
            url = el.src;
        }
        return url;
    };
    var fnDownload = function () {
        fnUpdateStatus(`Bắt đầu tải xuống`);
        let prefix = $(".mk-wrap .mk-txt-prefix").val();
        var chapterId = /(\d+).html$/.exec(window.location.href);
        if (chapterId) {
            if (chapterId.length > 1) {
                chapterId = chapterId[1];
            } else if (chapterId.length) {
                chapterId = chapterId[0];
            } else {
                chapterId = "";
            }
        } else {
            chapterId = "";
        }
        var imgs = $($('.mk-wrap .mk-txt-css-selector').val());
        if (imgs.length > 0) {
            let incChapterName = $('.mk-wrap .mk-chk-save-with-chapter-name').prop('checked');
            for (var i = 0; i < imgs.length; i++) {
                let imageUrl = fnGetImageUrl(imgs[i]);
                let downloadArgs = {
                    url: imageUrl,
                    name: `${prefix}${(incChapterName ? $("#p_name h1, .c_l_title h1").text() : "")}${chapterId}_${(i + 1)}.gif`
                }
                GM_download(downloadArgs);
                fnUpdateStatus(`Đã tải xuống ${imageUrl}`);
            }
        }
        else {
            fnUpdateStatus("Không có ảnh để tải xuống");
        }
        //mở link chương tiếp theo
        var nextChapterLink = $("#page_1 a:nth-child(2), #next_page");
        //gắn flag có chương tiếp theo
        fnSetConfig(key.HasNextChatper, nextChapterLink.length > 0 ? 1 : 0);

        //update số lượng
        downloadChatperCount--;

        if (nextChapterLink.length > 0) {
            if (downloadChatperCount > 0) {
                fnSetConfig(key.DownloadChapterCount, downloadChatperCount);

                var countDownTimeConfig = $(".mk-wrap .mk-txt-timer").val();
                var countDownValue = 30;
                if (countDownTimeConfig && /^\d+$/.test(countDownTimeConfig)) {
                    countDownValue = parseInt(countDownTimeConfig);
                }
                var countDownTemp = countDownValue;
                var nextChapterHandle = setInterval(() => {
                    if (downloadStatus) {

                        if (countDownTemp > 0) {
                            fnUpdateStatus(`Chuyển sang trang tiếp sau sau ${countDownTemp}(s)`);
                            countDownTemp--;
                        }
                        else {
                            fnUpdateStatus(`Chuyển sang chương tiếp theo và chờ tải xuống...`);
                            clearInterval(nextChapterHandle);
                            nextChapterLink[0].click();
                        }
                    }
                    else {
                        fnUpdateStatus(`Đã tạm dừng`);
                    }
                }, 1000);
            }
            else {
                let message = `Đã tải xong ${downloadChatperCountInit} chương yêu cầu`;
                fnUpdateStatus(message);
                alert(message);
            }

        } else {
            fnUpdateStatus("Đã tải hết");
            alert("Đã tải hết chương");
        }
    };
    //event
    //xử lý ẩn hiện panel
    var collapse = false;
    $(".mk-wrap .mk-btn-collapse").off("click").on("click", function (e) {
        $(".mk-wrap.main-view").addClass("d-none");
        $(".mk-wrap.hidden-view").removeClass("d-none");
        collapse = true;
    });
    $(".mk-wrap .mk-btn-expanse").off("click").on("click", function (e) {
        $(".mk-wrap.main-view").removeClass("d-none");
        $(".mk-wrap.hidden-view").addClass("d-none");
        collapse = false;
    });
    $(".mk-wrap .mk-btn-pause").off("click").on("click", function (e) {
        if (downloadStatus) {
            $(".mk-wrap .mk-btn-pause").text("Tiếp tục");
            fnUpdateStatus("Đã tạm ngừng");
        }
        else {
            $(".mk-wrap .mk-btn-pause").text("Tạm ngừng");
            fnUpdateStatus("Tiếp tục tải");
        }
        downloadStatus = !downloadStatus;
        fnSetConfig(key.DownloadStatus, downloadStatus ? 1 : 0);
    });

    //lưu thiết lập
    $(".mk-wrap .mk-btn-save-config").off("click").on("click", function (e) {
        let timer = fnGetNumberValue('.mk-wrap .mk-txt-loadimage', 15);
        let timerCount = fnGetNumberValue('.mk-wrap .mk-txt-timer', 15);
        let prefix = $('.mk-wrap .mk-txt-prefix').val();
        let cssSelector = $('.mk-wrap .mk-txt-css-selector').val();
        downloadChatperCount = $('.mk-wrap .mk-txt-download-chapter-count').val();
        fnSetConfig(key.LoadImageDelay, timer);
        fnSetConfig(key.Timer, timerCount);
        fnSetConfig(key.Prefix, prefix);
        fnSetConfig(key.CssSelectorImages, cssSelector);
        fnSetConfig(key.DownloadStatus, downloadStatus);
        fnSetConfig(key.DownloadChapterCount, downloadChatperCount);
        fnSetConfig(key.DownloadChapterCountInit, downloadChatperCount);

        fnUpdateStatus("Đã lưu thiết lập");
    });
    //tải xuống
    $(".mk-wrap .mk-btn-download").off("click").on("click", function (e) {
        fnDownload();
        if (!downloadStatus) {
            $(".mk-wrap .mk-btn-pause").click();
        }
    });
    //checkbox
    $('.mk-wrap .mk-chk-save-with-chapter-name').off('click').on('click', function (e) {
        let checked = $('.mk-wrap .mk-chk-save-with-chapter-name').prop('checked');
        fnSetConfig(key.ExtIncludeChapterName, checked ? 1 : 0);
    });

    //run
    fnInit();
})();