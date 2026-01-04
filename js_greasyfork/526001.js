// ==UserScript==
// @name         Facebook Feed Expander by Johnny.Inc
// @namespace    http://tampermonkey.net/
// @version      0.1 beta
// @description  Expand the feed size of the new Facebook UI
// @author       Johnny.Inc
// @match        https://www.facebook.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526001/Facebook%20Feed%20Expander%20by%20JohnnyInc.user.js
// @updateURL https://update.greasyfork.org/scripts/526001/Facebook%20Feed%20Expander%20by%20JohnnyInc.meta.js
// ==/UserScript==

;(() => {
    let mo;

    const expandNewsFeedItem = (el) => {
        el.style.width = '100%';
    };

    const processNewsFeedItems = (container) => {
        if (!container) return;
        const newsFeedItems = container.querySelectorAll(".x193iq5w"); // Sử dụng lại class name hiện tại, cần theo dõi thay đổi
        newsFeedItems.forEach(expandNewsFeedItem);
    };

    const observeNewsFeed = () => {
        const newsFeedContainer = document.querySelector(".xxzkxad"); // Sử dụng lại class name hiện tại, cần theo dõi thay đổi
        if (!newsFeedContainer) {
            console.warn("Không tìm thấy container news feed. Script có thể không hoạt động.");
            return; // Container không tìm thấy, không tiếp tục
        }

        mo = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Xử lý các news feed item mới được thêm vào
                            processNewsFeedItems(node); // Xử lý trực tiếp node mới nếu nó là container, hoặc có con là container
                            if (node.querySelector(".x193iq5w")) { // Kiểm tra nếu node mới chứa news feed item trực tiếp (nếu cần)
                                processNewsFeedItems(node);
                            } else {
                                // Nếu node mới không phải container trực tiếp, có thể cần tìm kiếm sâu hơn nếu cấu trúc phức tạp
                                // Ví dụ: processNewsFeedItems(node.querySelector('.có_class_con_chứa_item'));
                            }
                        }
                    });
                }
            }
        });

        mo.observe(newsFeedContainer, { childList: true, subtree: true });
    };

    const initialize = () => {
        processNewsFeedItems(document); // Xử lý các item có sẵn khi tải trang lần đầu
        observeNewsFeed(); // Bắt đầu theo dõi mutation sau khi đã xử lý ban đầu
    };


    // Chờ DOMContentLoaded để đảm bảo các element cần thiết đã được load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize(); // DOM đã load xong
    }

})();