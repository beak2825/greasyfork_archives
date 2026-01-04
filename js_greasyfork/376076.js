// ==UserScript==
// @name         FF14道具仓库批量领取
// @description  最终幻想14道具仓库批量领取
// @namespace    https://greasyfork.org/users/129402
// @match        https://qu.sdo.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @version      2.1.1
// @license      GNU General Public License v3.0 or later
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/376076/FF14%E9%81%93%E5%85%B7%E4%BB%93%E5%BA%93%E6%89%B9%E9%87%8F%E9%A2%86%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/376076/FF14%E9%81%93%E5%85%B7%E4%BB%93%E5%BA%93%E6%89%B9%E9%87%8F%E9%A2%86%E5%8F%96.meta.js
// ==/UserScript==
"use strict";
(() => {
    $.ajax({
        cache: true,
        dataType: "script",
        url: "https://qu.sdo.com/static/lib/moment-2.24.0.min.js",
    });
    const button = $("<div>");
    button.css({
        "background-color": "#fff",
        border: "gray solid 1px",
        "border-radius": "4px",
        bottom: "1rem",
        cursor: "pointer",
        "font-size": "14px",
        "font-weight": "700",
        "letter-spacing": ".5em",
        "line-height": "1.5",
        padding: ".5em 0 .5em .5em",
        position: "fixed",
        right: "1rem",
        width: "3em",
        "z-index": 73,
    });
    button.text("批量领取");
    button.appendTo("body");
    button.on("click", () => {
        const container = $("<div>");
        container.css({
            "background-color": "#fff",
            border: "gray solid 1px",
            "border-radius": "4px",
            bottom: "2rem",
            color: "#303133",
            "font-size": "14px",
            left: "calc(50vw - 600px)",
            "line-height": "1.5",
            position: "fixed",
            top: "2rem",
            width: "1200px",
            "z-index": 137,
            overflow: "auto",
        });
        container.appendTo("body");
        const closeButton = $("<button type=\"button\" aria-label=\"Close\" class=\"el-dialog__headerbtn\"><i class=\"el-dialog__close el-icon el-icon-close\"></i></button>");
        closeButton.on("click", () => {
            if (closeButton.is(":not(:disabled)")) {
                container.remove();
            }
        });
        container.append(closeButton);
        const title = $("<div>");
        title.text("批量领取道具");
        title.css({
            "border-bottom": "gray solid 1px",
            "font-size": "20px",
            margin: ".5rem auto",
            "text-align": "center",
            width: "1100px",
        });
        container.append(title);
        const chooseContainer = $("<div>");
        chooseContainer.text("选择仓库：");
        chooseContainer.css({
            "border-bottom": "gray solid 1px",
            left: "50px",
            margin: ".5rem auto",
            "padding-bottom": ".5rem",
            position: "sticky",
            "text-align": "center",
            top: ".5rem",
            width: "1100px",
            background: "white",
        });
        const paidWarehouseInput = $("<input>");
        paidWarehouseInput.attr({
            id: "3a755830-cfd0-4999-a79b-9dcf62e6669f",
            type: "radio",
        }).css("margin", "0 .5rem");
        const freeWarehouseInput = $("<input>");
        freeWarehouseInput.attr({
            id: "005c8d3a-4594-4e7b-af4d-865498126a36",
            type: "radio",
        }).css("margin", "0 .5rem");
        const paidWarehouseInputLabel = $("<label>");
        paidWarehouseInputLabel.attr("for", "3a755830-cfd0-4999-a79b-9dcf62e6669f").text("购买仓库").css("margin-right", ".5rem");
        const freeWarehouseInputLabel = $("<label>");
        freeWarehouseInputLabel.attr("for", "005c8d3a-4594-4e7b-af4d-865498126a36").text("奖励仓库").css("margin-right", ".5rem");
        paidWarehouseInput.data({
            otherInput: freeWarehouseInput,
            sourceType: 0,
        });
        freeWarehouseInput.data({
            otherInput: paidWarehouseInput,
            sourceType: 1,
        });
        chooseContainer.append(paidWarehouseInput).append(paidWarehouseInputLabel).append("·").append(freeWarehouseInput).append(freeWarehouseInputLabel);
        const submitContainer = $("<span>");
        submitContainer.css({
            "border-left": "gray solid 1px",
            "margin-left": ".5rem",
            padding: "0 .5rem",
        });
        chooseContainer.append(submitContainer);
        container.append(chooseContainer);
        const resultCotainer = $("<div>");
        resultCotainer.css({
            margin: "0 auto",
            padding: ".5rem",
            "text-align": "center",
        });
        container.append(resultCotainer);
        const count = $("<span>");
        count.text("道具数量：--");
        submitContainer.append(count);
        const submitButton = $("<button>");
        submitButton.text("开始批量领取").css("margin", "0 .5rem");
        submitContainer.append(submitButton);
        const selectAllButton = $("<button>");
        selectAllButton.text("全选");
        selectAllButton.on("click", () => {
            if (selectAllButton.is(":not(:disabled)")) {
                resultCotainer.find("input").prop("checked", true);
            }
        });
        submitContainer.append(selectAllButton);
        const selectNoneButton = $("<button>");
        selectNoneButton.text("全不选");
        selectNoneButton.on("click", () => {
            if (selectNoneButton.is(":not(:disabled)")) {
                resultCotainer.find("input").prop("checked", false);
            }
        });
        submitContainer.append(selectNoneButton);
        paidWarehouseInput.add(freeWarehouseInput).on("change", async ({ target }) => {
            const self = $(target);
            self.data("otherInput").prop("checked", false);
            resultCotainer.empty().text("加载中……");
            try {
                const apiResult = await $.ajax({
                    data: {
                        _: Math.random,
                        appId: 100001900,
                        keyword: "",
                        order: 0,
                        page: 1,
                        pageSize: 100,
                        sourceType: self.data("sourceType"),
                        status: 0,
                    },
                    type: "GET",
                    url: "https://sqmallservice.u.sdo.com/api/us/gameItem/list",
                    xhrFields: {
                        withCredentials: true,
                    },
                });
                resultCotainer.empty();
                if (apiResult.resultCode !== 0) {
                    resultCotainer.text(`请求发生错误！错误信息：[${apiResult.resultCode}] ${apiResult.resultMsg}`);
                    return;
                }
                const { propsList, totalCount } = apiResult.data;
                if (totalCount > 100) {
                    resultCotainer.append("<div>仓库中包含超过100件道具，为了避免出现问题，脚本只支持前100件道具的批量领取，请领取完前100件后刷新页面继续。</div>");
                }
                if (totalCount === 0) {
                    resultCotainer.html("该仓库无道具~");
                    return;
                }
                const resultTable = $("<table>");
                resultTable.css("border-collapse", "collapse");
                resultTable.append("<thead><tr><th>序号</th><th>名称</th><th>获得日期</th><th>是否批量领取</th></tr></thead><tbody></tbody>");
                resultCotainer.append($("<div>").css({
                    margin: "auto",
                    width: "fit-content",
                }).append(resultTable));
                const resultTableBody = resultTable.find("tbody");
                propsList.forEach(({ propsWarehouseId, productUrl, productName, purchaseDate, exchangeDate, skuId, sourceType }, _index) => {
                    const index = _index + 1;
                    const row = $("<tr>");
                    row.html('<td style="border: gray solid 1px; padding: .5rem;"></td>'.repeat(4));
                    row.find("td").eq(0).text(index);
                    const textCol = row.find("td").eq(1);
                    textCol.css("padding", ".125rem .5rem");
                    textCol.text(`${productName} `);
                    if (productUrl) {
                        const img = $("<img>");
                        img.css({
                            height: "2.5rem",
                            "vertical-align": "inherit",
                        });
                        img.attr("src", productUrl);
                        img.on("click", () => {
                            open(productUrl, "_blank");
                        });
                        textCol.prepend(img);
                    }
                    if (skuId) {
                        const link = $("<a>");
                        link.css({
                            color: "#3273dc",
                            "text-decoration": "underline",
                        }).attr({
                            href: `https://qu.sdo.com/product-detail/${skuId}`,
                            target: "_blank",
                        }).text("[商品页面](外链)");
                        textCol.append(link);
                    } else {
                        textCol.append(" [非卖品]");
                    }
                    row.find("td").eq(2).text(moment(purchaseDate || exchangeDate).format("YYYY年M月D日HH点mm分"));
                    const input = $("<input>");
                    input.attr("type", "checkbox").data({ propsWarehouseId, sourceType });
                    row.find("td").eq(3).append(input);
                    resultTableBody.append(row);
                });
                count.text(`道具数量：${propsList.length}`);
            }
            catch (e) {
                resultCotainer.html(`<div style="text-align: center;">发生网络错误！错误信息：${e}</div>`);
            }
        });
        submitButton.on("click", async () => {
            if (submitButton.is(":not(:disabled)")) {
                if (resultCotainer.find("input").length === 0) {
                    alert("尚未加载数据！");
                    return;
                }
                const selected = resultCotainer.find("input:checked").toArray().map((ele) => $(ele).data());
                if (selected.length === 0) {
                    alert("尚未选择道具！");
                    return;
                }
                const choosed = {
                    free: selected.filter(({ sourceType }) => sourceType === 1).map(({ propsWarehouseId }) => propsWarehouseId),
                    paid: selected.filter(({ sourceType }) => sourceType === 0).map(({ propsWarehouseId }) => propsWarehouseId),
                };
                const confirmText = [];
                if (choosed.paid.length > 0) {
                    confirmText.push(`${choosed.paid.length} 个购买仓库的道具`);
                }
                if (choosed.free.length > 0) {
                    confirmText.push(`${choosed.free.length} 个奖励仓库的道具`);
                }
                if (!confirm(`你选择了 ${confirmText.join(" 和 ")} ，是否确认批量领取？`)) {
                    return;
                }
                submitButton.add(selectAllButton).add(selectNoneButton).add(closeButton).add(resultCotainer.find("input")).attr("disabled", "disabled");
                const characterSelectorContainer = $("<div>");
                characterSelectorContainer.css({
                    "background-color": "#fff",
                    border: "gray solid 1px",
                    "border-radius": "4px",
                    "font-size": "14px",
                    left: "calc(50vw - 300px)",
                    "line-height": "1.5",
                    padding: "25px 25px 30px",
                    position: "fixed",
                    "text-align": "center",
                    top: "15vh",
                    width: "600px",
                    "z-index": 713,
                });
                const area = $("<div>");
                area.css("margin", ".5rem 0");
                const areaSelect = $("<select>");
                areaSelect.attr({
                    disabled: "disabled",
                    id: "b5970252-6c7e-4603-928f-ae80b7ed1409",
                }).html('<option selected="selected">加载中……</option>');
                const areaLabel = $("<label>");
                areaLabel.attr("for", "b5970252-6c7e-4603-928f-ae80b7ed1409").text("选择游戏大区：");
                area.append(areaLabel).append(areaSelect).appendTo(characterSelectorContainer);
                const character = $("<div>");
                character.css("margin", ".5rem 0");
                const characterSelect = $("<select>");
                characterSelect.attr({
                    disabled: "disabled",
                    id: "f601bc1a-95c8-42ce-81b3-0081bec56f58",
                }).html('<option selected="selected">请先选择大区……</option>');
                const characterLabel = $("<label>");
                characterLabel.attr("for", "f601bc1a-95c8-42ce-81b3-0081bec56f58").text("选择游戏角色：");
                character.append(characterLabel).append(characterSelect).appendTo(characterSelectorContainer);
                const buttonRow = $("<div>");
                buttonRow.css("margin", ".5rem 0");
                const confirmButton = $("<button>");
                confirmButton.css({
                    "background-color": "#ce0f30",
                    border: "1px solid #ce0f30",
                    "border-radius": "4px",
                    "box-sizing": "border-box",
                    color: "#FFF",
                    cursor: "pointer",
                    display: "inline-block",
                    "font-family": "inherit",
                    "font-size": "14px",
                    "font-weight": "500",
                    "line-height": "1",
                    margin: "0",
                    outline: "0",
                    overflow: "visible",
                    padding: "12px 20px",
                    "text-align": "center",
                    "text-transform": "none",
                    transition: ".1s",
                    "white-space": "nowrap",
                }).text("确认批量领取在此角色");
                const cancelButton = $("<button>");
                cancelButton.css({
                    "background-color": "rgb(51, 51, 51)",
                    border: "1px solid rgb(51, 51, 51)",
                    "border-radius": "4px",
                    "box-sizing": "border-box",
                    color: "#FFF",
                    cursor: "pointer",
                    display: "inline-block",
                    "font-family": "inherit",
                    "font-size": "14px",
                    "font-weight": "500",
                    "line-height": "1",
                    margin: "0 0 0 10px",
                    outline: "0",
                    overflow: "visible",
                    padding: "12px 20px",
                    "text-align": "center",
                    "text-transform": "none",
                    transition: ".1s",
                    "white-space": "nowrap",
                }).text("取消");
                cancelButton.on("click", () => {
                    submitButton.add(selectAllButton).add(selectNoneButton).add(closeButton).add(resultCotainer.find("input")).removeAttr("disabled");
                    characterSelectorContainer.remove();
                });
                buttonRow.append(confirmButton).append(cancelButton).appendTo(characterSelectorContainer);
                characterSelectorContainer.appendTo("body");
                try {
                    const areaResult = await $.ajax({
                        data: {
                            _: Math.random,
                            appId: 100001900,
                        },
                        type: "GET",
                        url: "https://sqmallservice.u.sdo.com/api/us/accountInfo/getArea",
                        xhrFields: {
                            withCredentials: true,
                        },
                    });
                    if (areaResult.resultCode !== 0) {
                        alert(`请求发生错误！错误信息：[${areaResult.resultCode}] ${areaResult.resultMsg}`);
                        cancelButton.trigger("click");
                        return;
                    }
                    const areas = JSON.parse(areaResult.data);
                    const defaultArea = GM_getValue("areaSelected", "-1");
                    areaSelect.removeAttr("disabled").html(defaultArea === "-1" ? '<option value="-1">请选择大区……</option>' : "");
                    areas.forEach(({ areaId, areaName }) => {
                        areaSelect.append(`<option value="${areaId}-${areaName}">${areaName}</option>`);
                    });
                    areaSelect.on("change", async () => {
                        const areaId = areaSelect.val();
                        if (areaId === "-1") {
                            characterSelect.html('<option selected="selected">请先选择大区……</option>');
                            return;
                        }
                        try {
                            const characterResult = await $.ajax({
                                data: {
                                    _: Math.random,
                                    appId: 100001900,
                                    areaId: areaId.replace(/-.+$/, ""),
                                },
                                type: "GET",
                                url: "https://sqmallservice.u.sdo.com/api/us/accountInfo/getCharacter",
                                xhrFields: {
                                    withCredentials: true,
                                },
                            });
                            if (characterResult.resultCode !== 0) {
                                alert(`请求发生错误！错误信息：[${characterResult.resultCode}] ${characterResult.resultMsg}`);
                                cancelButton.trigger("click");
                                return;
                            }
                            const defaultCharacter = GM_getValue("characterSelected", "-1");
                            const characters = characterResult.data.roleInfos;
                            characterSelect.removeAttr("disabled").html(defaultCharacter === "-1" ? '<option value="-1">请选择角色……</option>' : "");
                            characters.forEach(({ characterId, groupId, groupName, roleName }) => {
                                characterSelect.append(`<option value="${groupId}-${groupName}-${characterId}-${roleName}">[${groupName}]${roleName}</option>`);
                            });
                            characterSelect.val(defaultCharacter);
                        }
                        catch (e) {
                            alert(`发生网络错误！错误信息：${e}`);
                            cancelButton.trigger("click");
                            return;
                        }
                    });
                    areaSelect.val(defaultArea).change();
                    confirmButton.on("click", async () => {
                        const characterSelected = characterSelect.val();
                        const areaSelected = areaSelect.val();
                        if (!/([^-]+)-([^-]+)/.test(areaSelected)) {
                            alert("请选择大区！");
                            return;
                        }
                        if (!/([^-]+)-([^-]+)-([^-]+)-([^-]+)/.test(characterSelected)) {
                            alert("请选择角色！");
                            return;
                        }
                        const [, areaId, areaName] = Array.from(areaSelected.match(/([^-]+)-([^-]+)/));
                        const [, groupId, groupName, characterId, roleName] = Array.from(characterSelected.match(/([^-]+)-([^-]+)-([^-]+)-([^-]+)/));
                        if (!confirm(`确定要将 ${confirmText} 领取到 [${groupName}]${roleName} 上吗？`)) {
                            return;
                        }
                        GM_setValue("characterSelected", characterSelected);
                        GM_setValue("areaSelected", areaSelected);
                        submitButton.add(selectAllButton).add(selectNoneButton).add(closeButton).remove().off();
                        let successCount = 0;
                        let failedCount = 0;
                        const log = count.add(characterSelectorContainer);
                        const target = choosed.paid.concat(choosed.free);
                        log.text(`成功：0 失败：0 / ${target.length}`);
                        let startFlag = true;
                        for (const propsWarehouseId of target) {
                            if (startFlag) {
                                startFlag = false;
                                await new Promise((res) => setTimeout(res, 1500));
                            }
                            try {
                                const apiResult = await $.ajax({
                                    data: {
                                        _: Math.random(),
                                        appId: "100001900",
                                        areaId,
                                        areaName,
                                        characterId,
                                        groupId,
                                        groupName,
                                        propsWarehouseId,
                                        roleName,
                                    },
                                    type: "GET",
                                    url: "https://sqmallservice.u.sdo.com/api/us/gameItem/spend",
                                    xhrFields: {
                                        withCredentials: true,
                                    },
                                });
                                if (apiResult.resultCode === 0 && apiResult.data.success) {
                                    successCount++;
                                }
                                else {
                                    failedCount++;
                                }
                            } catch {
                                failedCount++;
                            }
                            log.text(`成功：${successCount} 失败：${failedCount} / ${target.length}`);
                        }
                        setTimeout(() => {
                            alert(`批量领取完成！共成功 ${successCount} 个，失败 ${failedCount} 个！`);
                            location.reload(false);
                        }, 50);
                    });
                }
                catch (e) {
                    alert(`发生网络错误！错误信息：${e}`);
                    cancelButton.trigger("click");
                    return;
                }
            }
        });
    });
})();