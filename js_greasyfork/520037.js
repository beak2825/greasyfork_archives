// ==UserScript==
// @name            Pornhub Blacklister +
// @version         0.9.2
// @description     使用列入黑名单的关键字列表（视频名称、模特名称）删除不需要的pornhub.com视频（请参阅列表代码）
// @author          ack20
// @include         *pornhub.com*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @grant           none
// @license         MIT
// @run-at          document-end
// @namespace       https://greasyfork.org/users/1067016
// @downloadURL https://update.greasyfork.org/scripts/520037/Pornhub%20Blacklister%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/520037/Pornhub%20Blacklister%20%2B.meta.js
// ==/UserScript==
const debug_info = true;
const blackList = ["trap ", "futa", "trans ", "transgender", "shemale", "trann", "cuck", "fatboy", "sissy", "femboy", "femboi", "tgirl ", "travest", "crossdresser", "pegging", "t-girl", "ladyboy", " tgirl", "transgirl", "tbabe ", "ts ", "tgirls ", " tgirls", "prostate"];
const blacklistedModels = ["Trevor Wong", "wuwur_0217", "kurofucs", "nina_loveu", "Amaya Lumina", "momoko taozi", "superlittlemonk", "KashimaMasayuki", "JinWanXuan1999", "Abby Kitty", "snow_nainai"];
const colorPrint = (videoTitle, ...args) => {
    args = args.filter(arg => arg !== 0);
    console.log('%c[Pornhub Blacklister +]:%c ' + videoTitle + ' %c[removed]', "color: #f90", "color: white", ...args, "color: green");
};
const divs = document.querySelectorAll(".videoBox").length > 0 ? document.querySelectorAll(".videoBox") : document.querySelectorAll(".videoWrapper");
divs.forEach((div) => {
    let videoTitle = div.querySelector("a").getAttribute("data-title") !== null ? div.querySelector("a").getAttribute("data-title") : div?.querySelector("img")?.getAttribute("alt") ?? null;
    let modelName = div.querySelector("a[href^='/model/']")?.title;
    let removeByTitle = false;
    if (videoTitle) {
        blackList.forEach((blackWord) => {
            if (videoTitle.toLowerCase().includes(blackWord)) {
                const start = videoTitle.toLowerCase().indexOf(blackWord), end = start + blackWord.length;
                if (blackWord[blackWord.length - 1] == " " && videoTitle.toLowerCase().substring(start - 1, end + 1)[0] != " " && !videoTitle.toLowerCase().substring(start - 1, end + 1).startsWith(blackWord)) {
                    return;
                }
                removeByTitle = true;
                if (debug_info) {
                    videoTitle = videoTitle.substring(0, start) + "%c" + videoTitle.substring(start, end) + "%c" + videoTitle.substring(end);
                }
            }
        });
    }
    let removeByModel = false;
    if (modelName) {
        blacklistedModels.forEach((blacklistedModel) => {
            if (modelName.toLowerCase() === blacklistedModel.toLowerCase()) {
                removeByModel = true;
            }
        });
    }
    if (removeByTitle || removeByModel) {
        div.remove();
    }
    if (debug_info) {
        const count = (videoTitle?.match(/%c/g) || []).length / 2;
        if (count > 0 || removeByModel) {
            let debugMsg = videoTitle || "";
            if(removeByModel){
              debugMsg += `[Model: ${modelName}]`;
            }
            colorPrint(debugMsg,
                count > 0 ? "color: red" : 0, count > 0 ? "color: white" : 0, count > 1 ? "color: red" : 0, count > 1 ? "color: white" : 0, count > 2 ? "color: red" : 0, count > 2 ? "color: white" : 0,
                count > 3 ? "color: red" : 0, count > 3 ? "color: white" : 0, count > 4 ? "color: red" : 0, count > 4 ? "color: white" : 0, count > 5 ? "color: red" : 0, count > 5 ? "color: white" : 0
            );
        }
    }
});