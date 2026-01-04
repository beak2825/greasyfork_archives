// ==UserScript==
// @name         Copy YouTube Channel Video Info (Simplest)
// @match        https://www.youtube.com/*/videos
// @grant        none
// @version      1
// @author       lmdw
// @description  Copy video titles, dates, and views - simplest version.
// @namespace https://greasyfork.org/users/1436006
// @downloadURL https://update.greasyfork.org/scripts/527275/Copy%20YouTube%20Channel%20Video%20Info%20%28Simplest%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527275/Copy%20YouTube%20Channel%20Video%20Info%20%28Simplest%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CẤU HÌNH ---
    const SCROLL_DELAY = 1500;
    const LOAD_CHECK_DELAY = 3000;
    const MAX_CHECK_ATTEMPTS = 5;
    const OUTPUT_FORMAT = "{title} / {date} / {views}";

    // --- HẾT PHẦN CẤU HÌNH ---

    function countVideoTitles() {
        return document.querySelectorAll('a#video-title-link yt-formatted-string#video-title').length;
    }

    function getVideoInfo() {
        const videoContainers = document.querySelectorAll('ytd-rich-grid-media');
        let videoData = [];

        for (const container of videoContainers) {
            const titleElement = container.querySelector('a#video-title-link yt-formatted-string#video-title');
            const title = titleElement ? titleElement.innerText.trim() : "Không có tiêu đề";

            const metaBlocks = container.querySelectorAll(".inline-metadata-item.style-scope.ytd-video-meta-block");
            let date = "Không có ngày";
            let views = "Không có lượt xem";

            if (metaBlocks.length >= 2) {
                date = metaBlocks[1] ? metaBlocks[1].innerText.trim() : "Không có ngày";
                views = metaBlocks[0] ? metaBlocks[0].innerText.trim() : "Không có lượt xem";
            }

            let output = OUTPUT_FORMAT
                .replace("{title}", title)
                .replace("{date}", date)
                .replace("{views}", views);

            videoData.push(output);
        }
        return videoData;
    }

    function copyVideoInfoToClipboard(videoData, message) {
         if (videoData.length === 0) {
            alert("Không tìm thấy video nào.");
            return;
        }
        const allVideoInfo = videoData.join('\n');
        navigator.clipboard.writeText(allVideoInfo)
            .then(() => {
                alert(message);
            })
            .catch(err => {
                console.error('Lỗi khi copy:', err);
                alert("Có lỗi xảy ra khi copy. Vui lòng thử lại.");
            });
    }

    function scrollToBottomAndLoad(callback) {
        let initialTitleCount = countVideoTitles();
        let checkAttempts = 0;

        function scrollAndWait() {
            window.scrollTo(0, document.documentElement.scrollHeight);
            console.log("Đang cuộn...");
            setTimeout(checkIfLoaded, LOAD_CHECK_DELAY);
        }

        function checkIfLoaded() {
            let newTitleCount = countVideoTitles();

            if (newTitleCount > initialTitleCount) {
                // Đã load thêm, tiếp tục cuộn
                initialTitleCount = newTitleCount;
                checkAttempts = 0;
                scrollAndWait();
            } else {
                // Không load thêm
                checkAttempts++;
                if (checkAttempts >= MAX_CHECK_ATTEMPTS) {
                    // Copy ngay lập tức những gì hiện có
                    callback(getVideoInfo(), "Đã dừng cuộn và copy thông tin video hiện có.");
                    return;
                } else {
                    console.log("Chưa load thêm, thử lại sau " + LOAD_CHECK_DELAY + "ms. Lần thử: ", checkAttempts);
                    setTimeout(checkIfLoaded, LOAD_CHECK_DELAY);
                }
            }
        }

         //Bắt đầu
        if(initialTitleCount === 0){
          alert("Không tìm thấy video nào");
          return;
        }
        scrollAndWait();
    }

  function startCopyProcess() {

        const shouldScroll = confirm("Bạn có muốn cuộn trang để tải thêm video không?");

        if (shouldScroll) {

            scrollToBottomAndLoad(copyVideoInfoToClipboard); //Truyền callback vào

        } else {
              const videoData = getVideoInfo();
            if (videoData.length > 0){
                copyVideoInfoToClipboard(videoData, "Đã copy thông tin video hiện có.");
            } else{
              alert("Không tìm thấy video nào");
            }

        }
    }

    // --- Thêm nút Copy ---
    const button = document.createElement('button');
    button.textContent = 'Copy Video Info';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.backgroundColor = '#4CAF50';
    button.style.border = 'none';
    button.style.color = 'white';
    button.style.padding = '10px 20px';
    button.style.textAlign = 'center';
    button.style.textDecoration = 'none';
    button.style.display = 'inline-block';
    button.style.fontSize = '16px';
    button.style.cursor = 'pointer';
    button.addEventListener('click', startCopyProcess);
    document.body.appendChild(button);
})();