// ==UserScript==
// @name         百度删帖管理
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动处理删帖，适用于桌面web版本贴吧
// @author       wcx19911123
// @match        *tieba.baidu.com/pmc*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368871/%E7%99%BE%E5%BA%A6%E5%88%A0%E5%B8%96%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/368871/%E7%99%BE%E5%BA%A6%E5%88%A0%E5%B8%96%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // debug模式
    let isDebug = false;
    let debug = (...s) => isDebug && s.forEach(o => console.log(o));
    let save = (k, v) => localStorage.setItem(k, v);
    let read = k => localStorage.getItem(k);
    let returnFalse = function (e) {
        var ev = e || window.event;
        ev && ev.stopPropagation && ev.stopPropagation() || (ev.cancelBubble = true);
        ev && ev.preventDefault && ev.preventDefault() || (ev.returnValue = false);
        return false;
    };
    // 自动填充话术
    let autoInfo = "该内容没有任何违反《百度贴吧协议》的信息，烦请恢复！";
    // 是否隐藏已删除
    let hideDeleted = read('hideDeleted');
    // 是否隐藏恢复中
    let hideSaving = read("hideSaving");
    // 已删除列表（取本地）
    let hideListJSON = read("hideList");
    let hideList = JSON.parse(hideListJSON) || [];
    debug(hideListJSON, hideList);

    // 自动跳转到系统删帖
    if (window.location.href.split("?")[0].endsWith("pmc")) {
        window.location.href = "/pmc/recycle?tab=system";
        return;
    }

    // 添加页面按钮
    let btn1 = `<input id='hideDeleted' type='checkbox' ${(hideDeleted)}/>隐藏已删除`;
    let btn2 = `<input id='hideSaving' type='checkbox' ${hideSaving}/>隐藏恢复中`;
    let btn3 = `<input id='doHide' type='button' value='隐藏'/>`;
    let btn4 = `<input id='inputInfo' value='${read('inputInfo') || autoInfo}' placeholder='这里填写申请恢复的理由' style="width: 600px;"/>`;
    $("div.panel_notice").after(`<div class='panel_notice'>${btn1}&nbsp;${btn2}&nbsp;${btn3}&nbsp;${btn4}</div>`);
    $('#inputInfo').off('blur').on('blur', function () {
        save("inputInfo", $('#inputInfo').val());
    });
    $("#doHide").off("click").on("click", function (e) {
        location.reload();
    });
    $("#hideDeleted").off("click").on("click", function (e) {
        save("hideDeleted", e.target.checked ? "checked" : "");
        $("#doHide").click();
    });
    $("#hideSaving").off("click").on("click", function (e) {
        save("hideSaving", e.target.checked ? "checked" : "");
        $("#doHide").click();
    });

    let eventId = setInterval(function () {
        // 监听页面是否加载完
        if (!$("span.del-reason-sty").length) {
            return;
        }
        clearInterval(eventId);

        $("span.pm_post_content").each(function (i, o) {
            // 申请状态节点
            let applyStateNode = $(o).parent().next().next().next();
            // 整行
            let wholeLine = $(o).parent().parent();
            // 删帖时间
            let deleteTime = $(o).parent().next().next().html();
            // 隐藏恢复中
            if (hideSaving && applyStateNode.html().includes("等待人工恢复")) {
                wholeLine.html(`<td class='pm_recycle_content' colspan='6' style='height:20px;color:grey;'>此条消息等待恢复中 （${deleteTime}）</td>`);
            }
            // 隐藏已删除
            if (hideDeleted && hideList.some(oo => $(o).html().includes(oo.trim()))) {
                wholeLine.html(`<td class='pm_recycle_content' colspan='6' style='height:20px;color:grey;'>此条消息主楼已删除 （${deleteTime}）</td>`);
            }
            // 修改申请按钮
            let applyBtn = applyStateNode.find("a.delpost_recover"), url;
            if (applyBtn.length) {
                url = applyBtn[0].href;
                $(applyBtn).attr("href", "javascript:void(0);");
            }
            // 自动提交申请
            $(applyBtn).off("click").on("click", function (e) {
                let wait = function (t) {
                    wait.wait = true;
                    setTimeout(() => {
                        wait.wait = false;
                    }, t);
                };
                let newWindow = window.open(url, "_blank");
                let event = setInterval(function () {
                    if (wait.wait) {
                        return;
                    }
                    let normalBtn = $(newWindow.document).find("a.tm_normal_btn");
                    let textArea = $(newWindow.document).find("textarea.j_textarea");
                    let errorTip = $(newWindow.document).find("div.forbidden_error");
                    let big = $(newWindow.document).find("p.p_big");
                    if (normalBtn.length === 1 && normalBtn.html().includes("开始申请")) {
                        debug("点击开始申请");
                        normalBtn[0].click();
                        wait(500);
                    } else if (big.length === 1 && big.parent().css("display") != "none") {
                        debug("关闭标签页");
                        clearInterval(event);
                        newWindow.close();
                    } else if (textArea.length === 1) {
                        debug("自动填充内容");
                        textArea[0].innerHTML = $("#inputInfo").val();
                        debug("提交");
                        $(newWindow.document).find("a.j_submit")[0].click();
                    } else if (errorTip.length === 1 && errorTip.html().includes("您目前只能恢复主题帖")) {
                        debug("只能恢复主题贴页面，刷新");
                        newWindow.location = url;
                        wait(500);
                    }
                }, 100);
                return returnFalse(e);
            });
            // 添加手动删除按钮
            let content = (wholeLine.find("td.pm_recycle_content span").html() || "").trim();
            if (!content) {
                return;
            }
            let isIn = hideList.includes(content);
            applyStateNode.find("br").length || $(`<a href='javascript:void(0);'>将此条标记为${isIn ? '未' : ''}删除</a>`).on("click", function (e) {
                debug(content);
                if (isIn) {
                    hideList = hideList.filter(o => o !== content);
                } else {
                    hideList.push(content);
                }
                let hideListJSON = JSON.stringify(hideList);
                debug(hideListJSON);
                save("hideList", hideListJSON);
                location.reload();
            }).appendTo(applyStateNode.append("<br/>"));
        });
    }, 100);
})();