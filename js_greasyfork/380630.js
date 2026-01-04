// ==UserScript==
// @name        SteamReviewsFilter
// @name:zh-CN  Steam无中文差评过滤
// @description Hides "Not Recommend" reviews related to "No Chinese language".
// @description:zh-cn 过滤Steam网页上的无中文差评
// @namespace   https://greasyfork.org/users/255836-icue
// @version     1.1
// @match       *://store.steampowered.com/app/*
// @match       *://steamcommunity.com/app/*
// @downloadURL https://update.greasyfork.org/scripts/380630/SteamReviewsFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/380630/SteamReviewsFilter.meta.js
// ==/UserScript==
(function () {
    var stopListBad = ["我是傻逼", "中文呢", "出中改", "出中文", "中文补丁", "中文玩家", "看什么差评", "need chinese", "no chinese", "chinese support", "simplified chinese" ];
    var l1 = ["不给", "没", "没有", "我们需要", "不支持", "不出", "我需要", "我要", "给我", "给我们"];
    var l2 = ["中文", "汉化", "官中", "官方中文", "简体中文", "简中"];
    l1.forEach(function (a) {
        l2.forEach(function (b) {
            stopListBad.push(a + b);
        });
    });
    
    var stopListAll = ["但没有中文让我很苦恼", "我們需要中文we need", "hinese中国語は必要" ];

    // Helper functions
    function needToRemove(review, reviewBox) {
        var count = (review.match(/we\s+need\s+chinese/g) || []).length;
        return count > 1 || new RegExp(stopListAll.join("|")).test(review) || reviewBox.querySelector(".thumb").querySelector('img').src.includes("thumbsDown") && review.length < 80 && new RegExp(stopListBad.join("|")).test(review);
    }
    function removeReviews() {
        document.querySelectorAll("div.apphub_Card").forEach(function(reviewBox){
            var clone = reviewBox.querySelector(".apphub_CardTextContent").cloneNode(true);
            if(clone.querySelector('.date_posted') !== null) {
                clone.removeChild(clone.querySelector('.date_posted'));
            }
            if(clone.querySelector('.early_access_review') !== null) {
                clone.removeChild(clone.querySelector('.early_access_review'));
            }
            var review = clone.textContent.trim().toLowerCase();
            if (needToRemove(review, reviewBox)) {
                reviewBox.style.display = "none";
            }
        });
    }

    var currentUrl = window.location.href;
    if(/store.steampowered.com/i.test(currentUrl)) {
        var targetNode = document.getElementsByClassName("review_ctn")[0];
        var callback = function(mutationsList, observer) {
            document.querySelectorAll("div.review_box").forEach(function(reviewBox){
                if (reviewBox.querySelector(".content") !== null) {
                    var review = reviewBox.querySelector(".content").textContent.trim().toLowerCase();
                    if (needToRemove(review, reviewBox)) {
                        reviewBox.style.display = "none";
                    }
                }
            });
        };
        var observer = new MutationObserver(callback);
        observer.observe(targetNode, { childList: true, subtree: true });
    }
    else if(/steamcommunity.com/i.test(currentUrl)) {
        removeReviews();
        var targetNode2 = document.getElementById("AppHubContent");
        var callback2 = function(mutationsList, observer) {
          removeReviews();
        };
        var observer2 = new MutationObserver(callback2);
        observer2.observe(targetNode2, { childList: true, subtree: true });
    }
})();