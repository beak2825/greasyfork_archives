// ==UserScript==
// @name         跳过培训超时对话框
// @version      0.8.0
// @description  培训对话框会影响学习的连贯性，影响学习效率，影响学习质量
// @author       NiaoBlush
// @match        tp.1safety.cc
// @match        tp.1safety.cc/login
// @match        tp.1safety.cc/student
// @match        tp.1safety.cc/student/study/*
// @match        tp.1safety.cc/student/train
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1safety.cc
// @require      https://libs.baidu.com/jquery/2.0.3/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/440597
// @downloadURL https://update.greasyfork.org/scripts/455517/%E8%B7%B3%E8%BF%87%E5%9F%B9%E8%AE%AD%E8%B6%85%E6%97%B6%E5%AF%B9%E8%AF%9D%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/455517/%E8%B7%B3%E8%BF%87%E5%9F%B9%E8%AE%AD%E8%B6%85%E6%97%B6%E5%AF%B9%E8%AF%9D%E6%A1%86.meta.js
// ==/UserScript==

(function () {
    "use strict";
    console.log("trt_loaded");
    console.log($.fn.jquery);

    const KEY_SETTINGS = "settings";
    const settings = GM_getValue(KEY_SETTINGS, {
        enableBackgroundPlay: false
    });
    console.log('trt_settings', settings);

    function showModal(content, config = {}) {
        const $modal = $(`
        <div class="trt_modal-wrapper"><div class="trt_modal-header"><div class="trt_modal-title">${config.title || ""}</div></div><div class="trt_modal-body"></div></div>
        `);

        const $headerClose = $(`<div class="trt_modal-header-close"></div>`);
        $headerClose.on("click", function () {
            $modal.remove();
        });
        $modal.find(".trt_modal-header").append($headerClose);

        if (config.width && typeof config.width === "number") {
            $modal.css("width", `${config.width}px`);
        }

        if (typeof content === "string") {
            $modal.find(".trt_modal-body").text(content);
        } else {
            content.appendTo($modal.find(".trt_modal-body"));
        }

        $("body").append($modal);
        return $modal;
    }

    function openSettings() {

        const $settings = $(`
            <form class="trt_settings-form"><div class="trt_settings-form-group"><label title="">背景播放(实验性): </label><label style="margin-right: 45px;"><input type="radio" name="settings-enable-bgplay" value="true">启用</label><label><input type="radio" name="settings-enable-bgplay" value="false">禁用</label></div><div class="trt_settings-form-group"><p title="">背景播放是实验性功能, 有风险⚠️</p></div><div class="trt_settings-form-group" style="margin-top: 20px;"><div class="trt_settings-btn-wrapper"><button type="submit">保存设置</button></div></div></form>
        `);

        //default
        $settings.find(`input[name=settings-enable-bgplay][value='${String(settings.enableBackgroundPlay)}']`).prop('checked', true);


        const $modal = showModal($settings, {
            title: "设置"
        });

        //submit
        $settings.on('submit', function (event) {
            event.preventDefault();

            const formDataObj = new FormData(this);
            settings.enableBackgroundPlay= formDataObj.get('settings-enable-bgplay')==='true';
            GM_setValue(KEY_SETTINGS, settings);
            popMsg("设置已保存，刷新页面后生效");
            $modal.remove();
        });
    }
    GM_registerMenuCommand("设置", openSettings);

    function popMsg(msg, type = 'ok') {
        $('.trt_msg').length > 0 && $('.trt_msg').remove();
        let $msg = $(`<div class="trt_msg trt_msg-${type}">${msg}</div>`);
        $('body').append($msg);
        $msg.slideDown(200);
        setTimeout(() => {
            $msg.fadeOut(500);
        }, type == 'ok' ? 2000 : 5000);
        setTimeout(() => {
            $msg.remove();
        }, type == 'ok' ? 2500 : 5500);
    }

    GM_addStyle(`
    #rm-timeout_overlay {position: fixed;top: 0;left: 0;width: 100vw;height: 100vh;background-color: rgba(217, 0, 0, 0.3);z-index: 9999;}.trt_modal-wrapper {position: fixed;z-index: 99999;top: 50%;left: 50%;max-height: 100%;transform: translate(-50%, -50%);border: 1px solid #707070;background-color: #F0F0F0;}.trt_modal-header {background-color: #FFF;min-width: 200px;height: 32px;display: flex;}.trt_modal-title {flex: 1;user-select: none;padding-left: 10px;color: black;display: flex;align-items: center;}.trt_modal-header-close {position: relative;background-color: transparent;border: none;cursor: pointer;padding: 0;width: 36px;height: 32px;font-size: 1em;}.trt_modal-header-close:hover {background-color: #E81023;}.trt_modal-header-close::before,.trt_modal-header-close::after {content: '';position: absolute;top: 50%;left: 50%;width: 15px;height: 1px;background-color: black;transform-origin: center;}.trt_modal-header-close:hover::before,.trt_modal-header-close:hover::after {background-color: #FFF;}.trt_modal-header-close::before {transform: translate(-50%, -50%) rotate(45deg);}.trt_modal-header-close::after {transform: translate(-50%, -50%) rotate(-45deg);}.trt_modal-body {padding: 10px;background-color: #F0F0F0;min-height: 32px;max-height: calc(100vh - 32px);font-size: 1em;line-height: normal;overflow-y: auto;}.trt_modal-wrapper * {margin: unset;}.trt_settings-form {font-family: 'Microsoft YaHei', sans-serif;width: 300px;box-shadow: none;}.trt_settings-form-group:not(:last-child) {margin-bottom: 15px;}.trt_settings-form-group label {display: inline-block;font-size: 13px;color: #000;margin-bottom: 5px;}.trt_settings-form-group select,.trt_settings-form-group input[type="radio"] {font-size: 13px;padding: 2px;border: 1px solid #c0c0c0;background-color: white;width: auto;}.trt_settings-form-group input[type="radio"] {width: auto;margin-right: 5px;}.trt_settings-form-group button {font-size: 13px;padding: 5px 10px;margin-right: 5px;border: 1px solid #c0c0c0;border-radius: 2px;background-color: #e0e0e0;cursor: pointer;}.trt_settings-form-group button[type="submit"] {background-color: #dcdcdc;}.trt_settings-form-group button:hover {background-color: #c0c0c0;}.trt_settings-form-group button:active {background-color: #a0a0a0;}.trt_settings-form-group button:focus {outline: 1px solid #606060;}.trt_settings-form-group select {margin-right: 5px;width: 180px;}.trt_settings-form-group select:focus-visible {outline: none;}.trt_settings-form-group label:first-child {width: 100px;}.trt_settings-form p {margin-bottom: 10px;}.trt_settings-btn-wrapper {display: flex;justify-content: space-between;}.trt_msg{display:none;position:fixed;top:10px;left:50%;transform:translateX(-50%);color:#fff;text-align:center;z-index:99996;padding:10px 30px;font-size:16px;border-radius:10px;background-size:25px;background-repeat:no-repeat;background-position:15px}.trt_msg a{color:#fff;text-decoration: underline;}.trt_msg-ok{background:#4bcc4b}.trt_msg-err{background:#c33}.trt_msg-warn{background:#FF9900}
    `);

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(function (node) {
                    const ele = $(node);
                    if (ele.prop("outerHTML") === "<div></div>") {
                        console.log("trt_ empty div inserted");
                        const modalObserver = new MutationObserver(function (modalMutations) {
                            modalMutations.forEach(function (modalMutation) {
                                modalMutation.addedNodes.forEach(function (modalNode) {
                                    const modal = $(modalNode);

                                    if (modal.attr("class") && (modal.hasClass("ant-modal-confirm") || modal.hasClass("ant-modal-root"))) {
                                        console.log("trt_ modal inserted");

                                        if (modal.html().indexOf("您已经5分钟未操作") > -1) {
                                            const overlay = document.createElement('div');
                                            overlay.id = 'rm-timeout_overlay';
                                            document.body.appendChild(overlay);

                                            window.setTimeout(function () {
                                                document.body.removeChild(overlay);
                                                modal.find("button.ant-btn-primary").trigger("click");
                                                console.log("trt_ triggered");
                                            }, 4000);
                                        }
                                        if (modal.html().indexOf("练习题") > -1) {
                                            window.setTimeout(function () {
                                                modal.find("button[aria-label='Close']").trigger("click");
                                                console.log("trt_ triggered");
                                            }, 1000);
                                        }
                                    }
                                });
                            });
                        });

                        modalObserver.observe(node, {childList: true, subtree: true});
                    }
                });
            }
        });
    });
    observer.observe(document.body, {childList: true, subtree: true});

    if (settings.enableBackgroundPlay) {
        let player = null;
        setInterval(function () {
            if (typeof videojs === 'undefined') {
                return;
            }

            try {
                player = videojs('preview_html5_api');
                console.log('__ player', player);

                if (player) {
                    if (player.paused()) {
                        console.log('播放器处于暂停状态');
                        player.play();
                    }
                }

            } catch (error) {
                console.error('发生错误:', error.message);
                console.log('__ 清除实例');
                player = null;
            }

        }, 10000);
    }
})();
