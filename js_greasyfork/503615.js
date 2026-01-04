// ==UserScript==
// @name               自研 - 哔哩哔哩 - 推广视频检测
// @name:en_US         Self-made - BiliBili - Ad Video Detector
// @description        检测置顶评论链接和联合投稿者是否包含特定特征，如果找到相应特征就弹框警告。
// @description:en_US  Check if the pinned comment link and co-members contain specific features, and if so, display a pop-up warning.
// @version            1.4.5
// @author             CPlayerCHN
// @license            MulanPSL-2.0
// @namespace          https://www.gitlink.org.cn/CPlayerCHN
// @match              https://www.bilibili.com/video/*
// @icon               https://static.hdslb.com/images/favicon.ico
// @grant              window.close
// @run-at             document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/503615/%E8%87%AA%E7%A0%94%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20-%20%E6%8E%A8%E5%B9%BF%E8%A7%86%E9%A2%91%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/503615/%E8%87%AA%E7%A0%94%20-%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20-%20%E6%8E%A8%E5%B9%BF%E8%A7%86%E9%A2%91%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义「广告评论特征」「网页标题」「标题改变监听」「元素改变监听」「发现特征」变量，「广告评论检测」「联合投稿赞助商检测」函数。
    const adCommentFeatures = [
        { "remark": "淘宝联盟-追踪推广效果", "feature": "uland.taobao.com", "case":["BV1Gm421374t", "BV19w4m1r7Z1"] },
        { "remark": "淘宝联盟-短链接", "feature": "s.click.taobao.com", "case":["BV1C4421U7yU"] },
        { "remark": "京东联盟-追踪推广效果", "feature": "union-click.jd.com", "case":["BV1fi4y1p7qS"] },
        { "remark": "京东联盟-短链接", "feature": "u.jd.com", "case":["BV1C4421U7yU"] },
        { "remark": "多多进宝", "feature": "mobile.yangkeduo.com/duo_coupon_landing.html", "case":["BV1D6Y4eKEyU"] },
        { "remark": "哔哩哔哩花火计划-追踪推广效果", "feature": "huahuo.bilibili.com", "case":[] },
        { "remark": "哔哩哔哩花火计划-短链接", "feature": "b23.tv/cm-huahuo", "case":["BV1xH4y1c7mR"] },
        { "remark": "哔哩哔哩高能建站", "feature": "gaoneng.bilibili.com", "case":["BV1WU411U7iu"] },
        { "remark": "哔哩哔哩高能建站-短链接", "feature": "b23.tv/cm-cmt", "case":["BV1BgaZePEbn"] },
        { "remark": "哔哩哔哩会员购", "feature": "mall.bilibili.com", "case":["BV1cf421B7H5"] },
        { "remark": "哔哩哔哩游戏中心", "feature": "www.biligame.com/detail", "case":["BV1BC4y1j7dr"] },
        { "remark": "梦龙科技-172号卡分销综合管理系统", "feature": "lot-ml.com/", "case":["BV1g142187fP"] },
        { "remark": "广州白驹科技-卡BOSS", "feature": "kaboss.cn/", "case":["BV1LztpeXE8G"] },
        { "remark": "天猫-追踪推广效果", "feature": "equity.tmall.com/tm", "case":["BV1KDtzenEJs"] }
    ];
    let elementChange = new MutationObserver(() => {

        // 执行「广告评论检测」「联合投稿赞助商检测」函数。
        adCommentDetector();
        sponsorDetector();

    }),
        title = document.title,
        titleChange = new MutationObserver(() => {

        // 如果标题改变了，就再次启用「元素改变监听」监听并更新标题至「网页标题」变量。
        if(title !== document.title) {

            elementChange.observe(document.body, { "subtree": true, "childList": true });
            title = document.title;

        };

    }),
        found = false;

    function adCommentDetector() {

        // 定义「首个评论」变量。
        let mainElm

        try {

            mainElm = document.querySelector("#commentapp bili-comments").shadowRoot.querySelector("bili-comment-thread-renderer").shadowRoot.querySelector("bili-comment-renderer");

        }catch {

            mainElm = false;

        };

        // 当「首个评论」被加载且是置顶评论。
        if(mainElm && mainElm.shadowRoot.querySelector("#top")) {

          // 遍历「首个评论」内容中的链接。
          mainElm.shadowRoot.querySelector("bili-rich-text").shadowRoot.querySelectorAll("a").forEach((elm) => {

              // 遍历「广告评论特征」。
              adCommentFeatures.forEach((data) => {

                  // 定义「视频」变量。
                  const video = document.querySelector("video");

                  // 暂停「视频」。
                  video.pause();

                  // 停止「元素改变监听」监听。
                  elementChange.disconnect();

                  // 当「发现特征」变量为否、「首个评论」内容中的链接与链接特征匹配且用户同意关闭页面，就将视频随机跳回视频开头 0-5 秒并关闭页面；
                  // 不然当「首个评论」内容中的链接与链接特征匹配，就监听链接点击。用户在明确允许后才会在新标签页打开推广页面；
                  // 不然视频在处于暂停状态且不处于视频开头，就播放它。
                  if(!found && elm.href.includes(data.feature) && confirm(`检测到评论区置顶评论含有「${data.remark}」特征的链接！\n\n全文内容为：\n「${mainElm.shadowRoot.querySelector("bili-rich-text").shadowRoot.querySelector("#contents").textContent}」\n\n是否降低完播率并关闭当前页面？`)) {

                      video.currentTime = video.currentTime !== 0 ? Math.random() * 5 : 0;
                      setTimeout(() => { window.close(); }, 500);
                      found = true;

                  }else if(elm.href.includes(data.feature)) {

                      elm.addEventListener("click", (event) => {

                          event.preventDefault();

                          if(confirm("您确定要打开这个推广页面吗？")) {

                              window.open(elm.href, "_blank");

                          };


                      });

                  }else if(video.paused && video.currentTime !== 0) {

                      // 继续播放「视频」。
                      video.play();

                  };

              });

          });

        };

        // 10 秒后停止「元素改变监听」监听。
        setTimeout(() => { elementChange.disconnect(); }, 10000);

    }

    function sponsorDetector() {

        // 遍历联合投稿者中包含「赞助商」标签的投稿者。
        // 案例：BV1MW421R7V7
        document.querySelectorAll(".members-info-container .container .tag-sponsor").forEach((elm) => {


            // 停止「元素改变监听」监听。
            elementChange.disconnect();

            // 定义「视频」变量。
            const video = document.querySelector("video");

            // 暂停「视频」。
            video.pause();

            // 当检测到稿件的创作团队中包含「赞助商」标签且用户同意关闭页面，就关闭页面；
            // 不然视频在处于暂停状态且不处于视频开头，就播放它。
            if(confirm(`检测到联合投稿者「${document.querySelector(".members-info-container .container .tag-sponsor").previousElementSibling.textContent}」的标签为「赞助商」。\n\n是否关闭当前页面？`)) {

                window.close();

            }else if(video.paused && video.currentTime !== 0) {

                // 继续播放「视频」。
                video.play();

            };

        });

    }

    // 配置「广告评论检测」「联合投稿赞助商检测」侦测目标节点。
    titleChange.observe(document.querySelector("head title"), { "subtree": true, "childList": true });
    elementChange.observe(document.querySelector('.left-container'), { "subtree": true, "childList": true });

})();