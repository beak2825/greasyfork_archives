// ==UserScript==
// @name         UOJ 评论过滤器
// @namespace    n/a
// @version      0.2.1
// @description  让 UOJ 拥有像 CF 那样的评论隐藏机制
// @author       iotang
// @match        http://*.blog.uoj.ac/blog/*
// @match        https://*.blog.uoj.ac/blog/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/401619/UOJ%20%E8%AF%84%E8%AE%BA%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/401619/UOJ%20%E8%AF%84%E8%AE%BA%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function raw(a) {
        return JSON.parse(JSON.stringify(a));
    }

    const gmConfigName = "CONFIG_UOJ_Comment_Filter";
    const defaultConfig = {
        negaThreshold: -5,
        tooNegaThreshold: -15,
        hideReplies: 0,
        selfRatingDelta: 1,
    };

    const configInfo = {
        negaThreshold: "触发评论变透明的阈值（一个数）",
        tooNegaThreshold: "触发隐藏评论的阈值（一个数）",
        hideReplies: "评论变透明时，把回复也变透明（一个布尔值）",
        selfRatingDelta: "自己的评价的权重倍数（一个数）",
    }

    const opacityValue = 0.30;

    function resetConfig() {
        GM_setValue(gmConfigName, defaultConfig);
    }

    function getConfig() {
        let temp = GM_getValue(gmConfigName);
        if (temp === undefined) {
            resetConfig();
            temp = GM_getValue(gmConfigName);
        }
        return raw(temp);
    }

    function setConfig(config) {
        GM_setValue(gmConfigName, config);
    }

    function setConfigWizard() {
        let config = raw(defaultConfig);
        for (let i in defaultConfig) {
            config[i] = prompt(configInfo[i], defaultConfig[i]);
            if (config[i] == null) return;
        }
        setConfig(config);
    }

    $(document).ready(function () {
        $(".list-group-item").on("filter-censor", function () {
            let config = getConfig();

            let now = $(this);
            let rating = parseInt(now.find(".uoj-click-zan-block").attr("data-cnt")) + parseInt(now.find(".uoj-click-zan-block").attr("data-val")) * (config.selfRatingDelta - 1);

            if (rating <= config.negaThreshold) {
                now.find(".comtbox1").css("opacity", opacityValue);
                now.find(".comtposterbox").css("opacity", opacityValue);
                now.find(".col-sm-6").css("opacity", opacityValue);
                now.find(".bot-buffer-no").css("opacity", opacityValue);
                now.find(".comtbox5").find(".bot-buffer-no").css("opacity", 1.00);
                if (config.hideReplies) now.find(".comtbox5").css("opacity", opacityValue);
            }
            if (rating <= config.tooNegaThreshold) {
                now.find(".comtbox1").hide();

                let commentHolder = document.createElement("div");
                commentHolder.className = "comment-holder";
                commentHolder.style = "min-height: 80px; white-space: pre-wrap; word-break: break-all; margin-top: 10px; margin-bottom: 10px; opacity: 0.30; font-size: 80%";
                commentHolder.innerHTML = " * 这个评论由于差评如潮而被隐藏了，请点击<a class=\"comment-holder-release\" href=\"#\">这儿</a>来显示";

                now.find(".comtbox1").after(commentHolder);
                now.find(".comment-holder-release").click(function () {
                    now.find(".comment-holder").hide();
                    now.find(".comtbox1").show();
                    return false;
                });
            }
        });
        $(".list-group-item").on("filter-recover", function () {
            let now = $(this);

            now.find(".comtbox1").css("opacity", 1.00);
            now.find(".comtposterbox").css("opacity", 1.00);
            now.find(".col-sm-6").css("opacity", 1.00);
            now.find(".bot-buffer-no").css("opacity", 1.00);
            now.find(".comtbox5").css("opacity", 1.00);
            now.find(".comment-holder").remove();
            now.find(".comtbox1").show();
        });

        $(".list-group-item").trigger("filter-censor");

        let configWizardButton = document.createElement("button");
        configWizardButton.className = "config-wizard-button";
        configWizardButton.innerHTML = "评论过滤设置";

        $(".uoj-footer").before(configWizardButton);
        $(".config-wizard-button").click(function () {
            setConfigWizard();
            $(".list-group-item").trigger("filter-recover");
            $(".list-group-item").trigger("filter-censor");
        });
    });
})();