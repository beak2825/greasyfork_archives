// ==UserScript==
// @name         图标替换-自用
// @namespace    OvO
// @version      3.5
// @description  替换战斗页面指定玩家图标，本地可见
// @icon         https://www.milkywayidle.com/favicon.svg
// @author       VA
// @match        *://www.milkywayidle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535365/%E5%9B%BE%E6%A0%87%E6%9B%BF%E6%8D%A2-%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/535365/%E5%9B%BE%E6%A0%87%E6%9B%BF%E6%8D%A2-%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

// 替换的目标名称和对应的图片链接
var replacementTargets = {
    "VerdantAether": "https://tupian.li/images/2025/04/23/6808cdd0a06a3.jpg",
    "BoltwardenA": "https://tupian.li/images/2025/05/09/681df9a243d0d.jpg",
    "MichaelYAO": "https://tupian.li/images/2025/05/10/681ef061c754a.jpg",
    "BoltwardenB": "https://tupian.li/images/2025/05/10/681ef061c754a.jpg",
    "BoltwardenC": "https://tupian.li/images/2025/05/10/681ef0618d73c.jpg",
    "Blazebinder": "https://tupian.li/images/2025/05/10/681f09131de12.jpg",
    "VulcanovaA": "https://tupian.li/images/2025/05/08/681c9f4520ab6.jpg",
    "VulcanovaB": "https://tupian.li/images/2025/05/08/681c9f4355f7d.jpg",
    "VulcanovaC": "https://tupian.li/images/2025/05/08/681c9f403f5c1.jpg",
    "Tritondeluge": "https://tupian.li/images/2025/05/10/681f09140a4ad.jpg",
    "ThalassurgeA": "https://tupian.li/images/2025/05/10/681ef1156db46.jpg",
    "ThalassurgeB": "https://tupian.li/images/2025/05/10/681ef113e082e.jpg",
    "ThalassurgeC": "https://tupian.li/images/2025/05/10/681ef11d3efe8.jpg",
    "Ponticlemency": "https://tupian.li/images/2025/05/10/681f091391fe1.jpg",
    "NerefluxA": "https://tupian.li/images/2025/05/10/681ef113760f4.jpg",
    "NerefluxB": "https://tupian.li/images/2025/05/10/681ef119939af.jpg",
    "NerefluxC": "https://tupian.li/images/2025/05/10/681ef1131eb24.jpg",
    // 添加更多的替换目标和对应的图片链接
};

(function () {
    "use strict";

    function replaceIconsIn(node) {
        const iconElements = node.querySelectorAll(`div.FullAvatar_fullAvatar__3RB2h`);
        for (const elem of iconElements) {
            if (elem.closest("div.CowbellStorePanel_avatarsTab__1nnOY")) {
                continue; // 商店页面
            }

            const playerId = findPlayerIdByAvatarElem(elem);
            if (!playerId) {
                console.error("ICONS: replaceIconsIn can't find playerId");
                console.log(elem);
                continue; // 找不到 playerId
            }

            if (!replacementTargets.hasOwnProperty(playerId)) {
                continue; // 没有配置图片地址
            }

            const newImgElement = document.createElement("img");
            newImgElement.src = replacementTargets[playerId];
            newImgElement.style.width = "100%";
            newImgElement.style.height = "auto";
            elem.innerHTML = "";
            elem.appendChild(newImgElement);
        }
    }

    function findPlayerIdByAvatarElem(avatarElem) {
        // Profile 窗口页
        const profilePageDiv = avatarElem.closest("div.SharableProfile_modal__2OmCQ");
        if (profilePageDiv) {
            return profilePageDiv.querySelector(".CharacterName_name__1amXp")?.textContent.trim();
        }

        // 网页右上角
        const headerDiv = avatarElem.closest("div.Header_header__1DxsV");
        if (headerDiv) {
            return headerDiv.querySelector(".CharacterName_name__1amXp")?.textContent.trim();
        }

        // 战斗页面
        const combatDiv = avatarElem.closest("div.CombatUnit_combatUnit__1m3XT");
        if (combatDiv) {
            return combatDiv.querySelector(".CombatUnit_name__1SlO1")?.textContent.trim();
        }

        // 组队页面
        const partyDiv = avatarElem.closest("div.Party_partySlot__1xuiq");
        if (partyDiv) {
            return partyDiv.querySelector(".CharacterName_name__1amXp")?.textContent.trim();
        }

        return null;
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (
                    node.tagName === "DIV" &&
                    !node.classList.contains("ProgressBar_innerBar__3Z_sf") &&
                    !node.classList.contains("CountdownOverlay_countdownOverlay__2QRmL") &&
                    !node.classList.contains("ChatMessage_chatMessage__2wev4") &&
                    !node.classList.contains("Header_loot__18Cbe") &&
                    !node.classList.contains("script_itemLevel") &&
                    !node.classList.contains("script_key") &&
                    !node.classList.contains("dps-info") &&
                    !node.classList.contains("MuiTooltip-popper")
                ) {
                    replaceIconsIn(node);
                }
            });
        });
    });
    observer.observe(document.body, { attributes: false, childList: true, subtree: true });

    // setInterval(() => replaceIconsIn(document.body), 100);
})();
