// ==UserScript==
// @name        ac-rating-icon
// @namespace   https://su8ru.dev/
// @version     1.2.0
// @description Add icons to the AtCoder standings table according to ratings.
// @author      subaru <contact@su8ru.dev>
// @supportURL  https://github.com/su8ru/ac-rating-icon/issues
// @license     MIT
// @match       https://atcoder.jp/*
// @exclude     https://atcoder.jp/*/json
// @downloadURL https://update.greasyfork.org/scripts/444140/ac-rating-icon.user.js
// @updateURL https://update.greasyfork.org/scripts/444140/ac-rating-icon.meta.js
// ==/UserScript==

// ================================================
//   View source code before bundling on GitHub:
//   https://github.com/su8ru/ac-rating-icon
// ================================================
const isElementWithVue = (element) => Object.prototype.hasOwnProperty.call(element, "__vue__");

const isString = (value) => typeof value === "string";
const isNumber = (value) => typeof value === "number";
const isBoolean = (value) => typeof value === "boolean";
const isObject = (value) => typeof value === "object" && value !== null;

const isVueWithUserInfo = (vue) => isObject(vue.u) &&
    isNumber(vue.u.Rating) &&
    isBoolean(vue.u.IsTeam) &&
    isString(vue.u.UserScreenName);

const createIconElement = (iconSvg) => {
    const template = document.createElement("template");
    template.innerHTML = iconSvg;
    return template.content.firstChild;
};

const icons = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" style="fill:currentColor"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g style="fill:currentColor"><path class="b" transform="rotate(-45 8.002 7.996)" d="M7 1.64h2v12.73H7z"/><circle class="b" cx="3.5" cy="3.5" r="3.5"/><circle class="b" cx="12.5" cy="12.5" r="3.5"/></g></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g style="fill:currentColor"><path class="b" d="M8 14.04 1.79 3h12.42L8 14.04ZM5.21 5 8 9.96 10.79 5H5.21Z"/><circle class="b" cx="3.5" cy="4" r="3.5"/><circle class="b" cx="12.5" cy="4" r="3.5"/><circle class="b" cx="8" cy="12" r="3.5"/></g></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g style="fill:currentColor"><path class="b" d="M13.5 13.5h-11v-11h11v11Zm-9-2h7v-7h-7v7Z"/><circle class="b" cx="3.5" cy="3.5" r="3.5"/><circle class="b" cx="3.5" cy="12.5" r="3.5"/><circle class="b" cx="12.5" cy="12.5" r="3.5"/><circle class="b" cx="12.5" cy="3.5" r="3.5"/></g></svg>',
];
const subIcons = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" style="fill:currentColor"/><circle cx="8" cy="8" r="4" style="fill:#fff"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g style="fill:currentColor"><path class="c" transform="rotate(-45 8.002 7.996)" d="M7 1.64h2v12.73H7z"/><circle class="c" cx="3.5" cy="3.5" r="3.5"/><circle class="c" cx="12.5" cy="12.5" r="3.5"/></g><g style="fill:#fff"><circle class="b" cx="3.5" cy="3.5" r="1.5"/><circle class="b" cx="12.5" cy="12.5" r="1.5"/></g></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g style="fill:currentColor"><path class="c" d="M8 14.04 1.79 3h12.42L8 14.04ZM5.21 5 8 9.96 10.79 5H5.21Z"/><circle class="c" cx="3.5" cy="4" r="3.5"/><circle class="c" cx="12.5" cy="4" r="3.5"/><circle class="c" cx="8" cy="12" r="3.5"/></g><g style="fill:#fff"><circle class="b" cx="3.5" cy="4" r="1.5"/><circle class="b" cx="12.5" cy="4" r="1.5"/><circle class="b" cx="8" cy="12" r="1.5"/></g></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g style="fill:currentColor"><path class="c" d="M13.5 13.5h-11v-11h11v11Zm-9-2h7v-7h-7v7Z"/><circle class="c" cx="3.5" cy="3.5" r="3.5"/><circle class="c" cx="3.5" cy="12.5" r="3.5"/><circle class="c" cx="12.5" cy="12.5" r="3.5"/><circle class="c" cx="12.5" cy="3.5" r="3.5"/></g><g style="fill:#fff"><circle class="b" cx="3.5" cy="3.5" r="1.5"/><circle class="b" cx="3.5" cy="12.5" r="1.5"/><circle class="b" cx="12.5" cy="12.5" r="1.5"/><circle class="b" cx="12.5" cy="3.5" r="1.5"/></g></svg>',
];

const ratingToRankSvg = (rating) => {
    if (0 < rating && rating < 400) {
        if (rating < 32)
            return subIcons[0];
        if (rating < 54)
            return subIcons[1];
        if (rating < 89)
            return subIcons[2];
        if (rating < 147)
            return subIcons[3];
        if (rating < 188)
            return icons[0];
        if (rating < 242)
            return icons[1];
        if (rating < 311)
            return icons[2];
        return icons[3];
    }
    return icons[rating > 2800 ? 0 : ((rating % 400) / 100) | 0];
};

const updateStandings = () => {
    Array.from(document.querySelectorAll(".standings-username > a.username")).map((userElement) => {
        var _a;
        if (isElementWithVue(userElement) &&
            isVueWithUserInfo(userElement.__vue__) &&
            !userElement.__vue__.u.IsTeam &&
            !userElement.querySelector("img") &&
            !userElement.querySelector("svg")) {
            const iconElement = createIconElement(ratingToRankSvg(userElement.__vue__.u.Rating));
            // set style
            const colorClassName = (_a = userElement.querySelector("span")) === null || _a === void 0 ? void 0 : _a.className;
            iconElement.setAttribute("class", colorClassName !== null && colorClassName !== void 0 ? colorClassName : "");
            Object.assign(iconElement.style, {
                width: "14px",
                height: "14px",
                verticalAlign: "text-bottom",
                marginRight: "4px",
            });
            // insert
            userElement.insertBefore(iconElement, userElement.querySelector("span"));
        }
    });
};

const updateProfile = () => {
    const _tableElements = document.querySelectorAll("table");
    if (_tableElements.length < 2)
        return;
    const tableElement = _tableElements[1];
    [...Array(2)].map((_, index) => {
        const tdElement = tableElement.tBodies[0].rows[index +
            (tableElement.tBodies[0].rows[0].cells[0].innerText === "順位" ? 1 : 0)].cells[1];
        const spanElement = tdElement.querySelector("span");
        const rating = +spanElement.innerText || 0;
        const iconElement = createIconElement(ratingToRankSvg(rating));
        const colorClassName = spanElement.className;
        iconElement.setAttribute("class", colorClassName);
        Object.assign(iconElement.style, {
            width: "14px",
            height: "14px",
            verticalAlign: "text-bottom",
            marginRight: "4px",
        });
        tdElement.insertBefore(iconElement, spanElement);
        if (index === 0) {
            const updateBigIcon = () => {
                // === config ====
                const checkboxElement = document.getElementById("acri-profile-icon-config");
                if (!checkboxElement)
                    return;
                const showProfileIcon = checkboxElement.checked;
                const svgElement = document.getElementById("acri-profile-big-icon");
                if (!showProfileIcon) {
                    if (svgElement)
                        svgElement.remove();
                    return;
                }
                // ==== create element ====
                if (svgElement)
                    return;
                const canvasElement = document.getElementById("ratingStatus");
                const divElement = canvasElement === null || canvasElement === void 0 ? void 0 : canvasElement.parentElement;
                if (!canvasElement || !divElement)
                    return;
                const bigIconElement = iconElement.cloneNode(true);
                bigIconElement.id = "acri-profile-big-icon";
                Object.assign(bigIconElement.style, {
                    width: "40px",
                    height: "40px",
                    position: "absolute",
                    top: "-6px",
                    left: "40px",
                });
                divElement.style.position = "relative";
                divElement.insertBefore(bigIconElement, canvasElement);
            };
            const buttonGroupElement = document.querySelector(".col-md-9 .btn-text-group");
            if (!buttonGroupElement)
                return;
            buttonGroupElement.insertAdjacentHTML("beforeend", `<span class="divider"></span>
        <input type="checkbox" id="acri-profile-icon-config" checked />
        <label for="acri-profile-icon-config">[ac-rating-icon] Show Profile Icon</label>
        `);
            const checkboxElement = document.getElementById("acri-profile-icon-config");
            if (!checkboxElement)
                return;
            checkboxElement.addEventListener("change", updateBigIcon);
            updateBigIcon();
        }
    });
};

var _a;
const observeTable = () => {
    var _a;
    updateStandings();
    const tableElement = (_a = document.getElementById("standings-tbody")) === null || _a === void 0 ? void 0 : _a.parentElement;
    if (tableElement)
        new MutationObserver(updateStandings).observe(tableElement.tBodies[0], {
            childList: true,
        });
};
if (/standings(\/virtual)?\/?/.test(document.location.href)) {
    const loaded = () => !!document.getElementById("standings-tbody");
    const loadingElement = (_a = document
        .getElementById("vue-standings")) === null || _a === void 0 ? void 0 : _a.getElementsByClassName("loading-show")[0];
    if (loadingElement)
        new MutationObserver(() => {
            if (loaded())
                observeTable();
        }).observe(loadingElement, { attributes: true });
}
if (/users\/([^/]+)\/?/.test(document.location.href)) {
    updateProfile();
}
