// ==UserScript==
// @name         去除CSDN系统通知小红点
// @namespace    https://pansong291.gitee.io/web/
// @version      1.0
// @description  去除CSDN系统通知小红点并将通知标记为已读
// @author       pansong291
// @match        https://*.csdn.net/*
// @grant        none
// @note         20-03-23 1.0 初版发布
// @downloadURL https://update.greasyfork.org/scripts/423987/%E5%8E%BB%E9%99%A4CSDN%E7%B3%BB%E7%BB%9F%E9%80%9A%E7%9F%A5%E5%B0%8F%E7%BA%A2%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/423987/%E5%8E%BB%E9%99%A4CSDN%E7%B3%BB%E7%BB%9F%E9%80%9A%E7%9F%A5%E5%B0%8F%E7%BA%A2%E7%82%B9.meta.js
// ==/UserScript==

(function () {
    /*
      这里是默认设置，你可以进行修改以达到你的预期。
      请务必按照要求更改，不要增加多余字符或删减必要字符！！！
     */
    const defaultSettings = {
        /*
          是否将系统通知设为已读
          true 为是
          false 为否
         */
        readNotice: true
        /*
          是否清空全部系统通知
          true 为是
          false 为否
         */
        , clearAllNotices: false
    };
    // ---------------------------配置结束。以下为执行代码，零基础人员请勿修改！！！---------------------------

    // 是否找到系统通知，用于标识异步 DOM 加载是否完成
    let findNotice = false;
    // 最多轮询次数，用于应对网络延时、卡顿或者接口结构变更，达到上限后不再查找
    let maxTimes = 20;
    let intervalId = setInterval(function () {
        if (findNotice) {
            clearInterval(intervalId);
            removeCSDNNoticeStart(defaultSettings);
        } else if ($('a[data-type="notice"]').length > 0) {
            findNotice = true;
        } else if (maxTimes <= 0) {
            clearInterval(intervalId);
        }
        maxTimes--;
    }, 300);

})();

function removeCSDNNoticeStart(defaultSettings) {
    /**
     * 系统通知条数小红点徽章 <i> 标签
     * @type {*|jQuery|HTMLElement}
     */
    let $notice_badge = $('a[data-type="notice"] i');

    // 如果没有系统通知，就什么都不用管
    if ($notice_badge.length <= 0) {
        return;
    }

    /**
     * 总消息条数小红点徽章 <i> 标签
     * @type {*|jQuery|HTMLElement}
     */
    let $toolbar_msg_count = $('#toolbar-remind i.toolbar-msg-count');

    // 将系统通知标记为已读状态
    if (defaultSettings.readNotice) {
        $.ajax({
            type: 'POST',
            url: "https://msg.csdn.net/v1/web/message/view/message",
            contentType: 'application/json;charset=UTF-8',
            data: '{"type":4}',
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json',
            success: function (res) {
                // 系统通知条数
                let systemCount = Number($.trim($notice_badge.text()));
                // 总消息条数
                let totalCount = Number($.trim($toolbar_msg_count.text()));

                // 移除系统通知的小红点徽章
                $notice_badge.remove();

                // 使总消息条数减去系统通知条数，或者直接移除
                if (totalCount > systemCount) {
                    $toolbar_msg_count.text(totalCount - systemCount);
                } else {
                    $toolbar_msg_count.remove();
                }
            }
        });
    }

    // 将系统通知全部清空
    if (defaultSettings.clearAllNotices) {
        $.ajax({
            type: 'POST',
            url: "https://msg.csdn.net/v1/web/message/delete/all",
            contentType: 'application/json;charset=UTF-8',
            data: '{"type":4}',
            xhrFields: {
                withCredentials: true
            }
        });
    }
}
