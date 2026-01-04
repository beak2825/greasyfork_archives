// ==UserScript==
// @name                BiliBili-PassInteractiveVideo
// @name:zh-CN          BiliBili-跳过互动视频
// @namespace           https://github.com/TitanRGB
// @version             1.1
// @description         列表播放的时候，互动视频无法播放，而且还有33魔性的声音提示“互动视频需要在手机上观看”，这个脚本可以跳过互动视频，直接播放下一个视频。
// @description:zh-CN   列表播放的时候，互动视频无法播放，而且还有33魔性的声音提示“互动视频需要在手机上观看”，这个脚本可以跳过互动视频，直接播放下一个视频。
// @author              https://github.com/TitanRGB
// @icon                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAG/UlEQVRYheWXa4xUZxnHf++5zWVn77MXYBdU2ootRRFpqwUsgV4UYi0UauKlxWg1xQRTI/X2oWpMlUobTWxKgmlNW1tSWmtbCxFpcaUtIOVSCFIKu7i7lN1h7zs7s3Nur3nPnFlnx1mKH/zkk5nknOe88/z/z/U8w/+9CBWAb70lp4yDJql0NaqPzES/75XD2c+9uvsC9UlJNkMq2cD9t67BNSHiXHIoNwN3ADuAe4wpDn0c+Lrus2QoTkt/JYkv7X1Xu+HokRxV1SngbWBLRS73ku6DIy4ZfBuwNrz+GpAsR2CTgO8KCV31EHdgw8t/ZfmBgxCLR6iqbMVxWhkaWjHQPP3ZdIy1Ee99gRuB54HrS/SfLyWwTZOszRnQXQ/zOvtZ/8ouZnR1QV0dWBak0zCaZv/ChTy2dMkaDV6zXJZOnURagYMhiVJ5oJjAN3WftX2VMBaF2988xl2728B1oLGpG4FFJtMo8fndilt44bq5VGahfpQbPI3twO1lACzgzSnAfw38QFNXQqIL+MXZBog5Lt9/bid3vbwTDP3n1NXNRvqzyOVm2oax8oHVdww8s2gu0wahLg1eYIHVwL1lQHYBM8rofwxsUBdBBNIx5qeqqPrUqXPcs+Mv1KRSkEx+GV1/EtcF1wN7POfXJ//Ukay/ZsYAb5secX9y8anqfgFoD++/DSwpA/4gcH/hJiAgpfuhr+45yqo9e0ET0NR0CngSOwc5ByqikPEwHYeI658ZN7VPSjhaxvhzwHwgCjxc5vkWYGOxIiDw0DPbjdqeXojHIRYF2/4bo6MgfZ5fdhN75szkA6lMcNjRNWJ20Iaqol8vAfgYMAdYUQb8uKqzUmVAoHZgUFBdDboOQ0OgG1edndZI2/xr2b5gNokcXKiqQnjQkAYpQMIbwHrgNyU224B4GQLlSOUJEI+P4/vQ08NQYyOP3LzsumOzWlSR/Kp1EAwPCvkuyfsjwJ3ANUW6hlIQAd8DOlWrWgaYel4vZTiK5Z0PzgJ59sC8q9l60zJSlSbThgLg4wI6JKhaPxlOsr+X2P9EGV2erARDoz8RJVngPZiRjGRthBABeKB/7aEddE1r2fXitXOXR2xIjk60VznZCtwnYUD9uCICls5eT3L96DhBIEU+RYGnpsa6/R0Dj49kc5i6xvnhLMNZG00dyn/gtnaJ4dPQMMoJwyXpTw1ekB7g07rGKWWs40L6biHYsuiyOjJOvnGUNFbxj33tI6t2HOq4FdPYpAkhY6YeEPGlLKRn0tuwOfTw5on6mCK0iQj9miC5pe00uhBomuj5YLKy6bNXNwRRiFrQnnL/8MS+M626oDNq6asnck4+QkpKQZRnK8PpVQs0AYvD1+ecAnjUDL71b5wZempwLPfUh5trxpqrY+faTvU0qedXNFXgepJ97f23ub4/kIhZGzwpPxOCvwWkCoDvuw8UyXeAX+pavpJ3v5Pi0IleQM8nXg0wQ4eMHRaBBHU4Ytj40sq7LbGqjHRNVF/herKtXAQuJmrU1iai/PBY9xiHjp9n+ZU1rJydwHV9ZFF8w/QS1lkAropOCsHjJ9KJ0wP207GINhPw/hsCSn6iCzYOjuVMxn3unlvFmo+oTKmFQAsD6hVlWOQjFNz7wfWZYYdjnZnpsYil0vteMQFVeFcC+8lPuXISVd4FLWRo9I17AaB0XE4O2BxOOSxuidCcyE+afw67HDifY2FzhMvrTNAlGVelRq07AbOJFNwbhrggXwiHTqmsUu2thc5eVmPQ3p9j9tYucP3A+d1fmU5rrRUcONyX5YvP9kBEQ48bdK5rYVZlAKmYu8UENpcA/T6s1tNFunnAzyT/bqVR26c2pvGNj1ayuCXKgkaL6RU69nh+R7uxNcrx9bM40JvjYE+O6qgg7fiTgAoEckCkSF8YvWqbyQD1wILScHSPetTGTR69pSnMcUHyNWAhqKkwuKopwrp5edq9Ga9QHFoxgd+qFbnEvsrRoilqIQ+g9igk2ayDaQo6hlxeP29zsDdHVBMsaLJY2hIlGdPwfYkVNTC1yW+zwtD9UYkLU4oIhxEy3/rFTldaGsf6bFxfMmT7vDPoELcmz/XwN3q4L05EYDBcMHYC1RcloBrb0IIyqgqMG8Ri+WfNpmDz0ubJrCje2Q0sxSDwgGwxASX7gCvCjlgDTA9Xq4LYQvCe57MtY7u7tYT+50ePpzk14uF5ciLvomgKFCgE00CIgMqr3ePEEsbRcOxfdBQnw51ebTfDan5rglTEhBePnKO9f2Sj42k/Zcyz0Kb4a6TUTmjbFOBJJ1ptvlsT01bnXHlSPb7YJOwLv/9hU9ME0pOb6mL6E8T0y4GngT+Gu34hCML2pdccCyr1pZ6sN2JqYqUp6FEpCCb3pf+l+x8J8C8+roMQ+BLyjgAAAABJRU5ErkJggg==
// @match               http*://bilibili.com
// @match               http*://bilibili.com/*
// @match               http*://www.bilibili.com
// @match               http*://www.bilibili.com/*
// @license             MPL-2.0
// @license^            Mozilla Public License 2.0
// @grant               unsafeWindow
// @charset		        UTF-8
// @homepageURL         https://github.com/SynRGB/BiliBili-PassInteractiveVideo
// @contributionURL     https://github.com/SynRGB/BiliBili-PassInteractiveVideo
// @copyright           Copyright © 2022-PRESENT, TitanRGB (https://github.com/TitanRGB)
// @downloadURL https://update.greasyfork.org/scripts/453734/BiliBili-PassInteractiveVideo.user.js
// @updateURL https://update.greasyfork.org/scripts/453734/BiliBili-PassInteractiveVideo.meta.js
// ==/UserScript==

let last_run_time = new Date().getTime();

let main = function () {
    let tagDiv = document.getElementsByClassName("s_tag report-wrap-module report-scroll-module")[0].childNodes[0];
    // 鲁棒性+114
    if (tagDiv === null) {
        tagDiv = document.getElementsByClassName("tag-area clearfix")[0];
    }
    if (tagDiv !== null) {
        let tags = tagDiv.querySelectorAll("div[class='tag-item']");
        for (let i = 0; i < tags.length; i++) {
            if (tags[i].querySelector("span") !== null) {
                if (tags[i].querySelector("span").innerText === "互动视频") {
                    let current_video = document.getElementsByClassName("player-auxiliary-playlist-item player-auxiliary-playlist-item-active player-auxiliary-playlist-item-showp")[0];
                    if (current_video !== null) {
                        let next_video = current_video.nextElementSibling;
                        if (next_video !== null) {
                            next_video.querySelector("div[class='player-auxiliary-playlist-item-title']").click();
                            console.log("%c跳过互动视频 \n by JS script BiliBili-PassInteractiveVideo\n    BiliBili-跳过互动视频", "color: #AAAAAA");
                            // console.log(last_run_time);
                        }
                    }
                }
            }
        }
    }
    last_run_time = new Date().getTime();
}

// if DOM changed, re-run the script
let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function () {
        // 通过增加时间间隔来避免无限回调
        if (new Date().getTime() - last_run_time > 500) {
            try {
                main();
            } catch (e) {
                // console.log("%cBiliBili-PassInteractiveVideo: " + e, "color: #AAAAAA");
            }
        }
    });
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log("JS script BiliBili-PassInteractiveVideo (BiliBili-跳过互动视频) loaded. See more details at https://github.com/SynRGB/BiliBili-PassInteractiveVideo");