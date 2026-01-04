// ==UserScript==
// @name         ac-hide-official-rating-icon
// @namespace    https://atcoder.jp/
// @version      1.02
// @description  AtCoder公式のレーティングアイコンを非表示にできるようにする拡張機能
// @author       konchanksu
// @license      MIT
// @match        https://atcoder.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499759/ac-hide-official-rating-icon.user.js
// @updateURL https://update.greasyfork.org/scripts/499759/ac-hide-official-rating-icon.meta.js
// ==/UserScript==

const SHOW_RATING_ICON_FG = 'showRatingIconFg';
const SHOW_RATING_ICON_STANDINGS_FG = 'showRatingIconProfileFg';
const CHECKBOX_STATE_KEY = 'ac-hide-rating-icon-config';
class LocalStorageController {
    constructor() {
        this.changeState = true;
        if (!localStorage.hasOwnProperty(CHECKBOX_STATE_KEY)) {
            this.saveRadioState({
                showRatingIconFg: false,
                showRatingIconProfileFg: false,
            });
        }
    }
    saveRadioState(flags) {
        this.changeState = true;
        localStorage.setItem(CHECKBOX_STATE_KEY, JSON.stringify(flags));
    }
    getRadioState() {
        if (this.changeState) {
            const jsonString = localStorage.getItem(CHECKBOX_STATE_KEY);
            const object = JSON.parse(jsonString);
            const needSave = !object.hasOwnProperty(SHOW_RATING_ICON_FG) ||
                !object.hasOwnProperty(SHOW_RATING_ICON_STANDINGS_FG);
            this.showRatingIconFg = object.hasOwnProperty(SHOW_RATING_ICON_FG)
                ? object[SHOW_RATING_ICON_FG]
                : true;
            this.showRatingIconProfileFg = object.hasOwnProperty(SHOW_RATING_ICON_STANDINGS_FG)
                ? object[SHOW_RATING_ICON_STANDINGS_FG]
                : true;
            if (needSave) {
                this.saveRadioState({
                    showRatingIconFg: this.showRatingIconFg,
                    showRatingIconProfileFg: this.showRatingIconProfileFg,
                });
                this.changeState = false;
            }
        }
        return {
            showRatingIconFg: this.showRatingIconFg,
            showRatingIconProfileFg: this.showRatingIconProfileFg,
        };
    }
}

const RATING_ICON_CLASSES = [
    'user-rating-stage-l',
    'user-rating-stage-m',
    'user-rating-stage-s',
];
const CURRENT_LANGUAGE = (() => {
    const dropdown_toggle = document.getElementsByClassName('dropdown-toggle');
    const isIncludeEn = Array.prototype.filter.call(dropdown_toggle, (element) => element.textContent.includes('English')).length !== 0;
    return isIncludeEn ? 'EN' : 'JA'; // default JA
})();
const IS_CURRENT_LANGUAGE_JA = CURRENT_LANGUAGE === 'JA';
const CONFIG_DROPDOWN_JA = {
    title: ' ac-hide-icon 設定',
    radio: [
        {
            title: 'レーティングアイコンを非表示にしない',
            id: 'any',
            showRatingIconFg: true,
            showRatingIconProfileFg: true,
        },
        {
            title: 'プロフィールページのみ非表示にする',
            id: 'only-not-standings',
            showRatingIconFg: true,
            showRatingIconProfileFg: false,
        },
        {
            title: 'レーティングアイコンを全て非表示にする',
            id: 'all',
            showRatingIconFg: false,
            showRatingIconProfileFg: false,
        },
    ],
};
const CONFIG_DROPDOWN_EN = {
    title: ' ac-hide-icon',
    radio: [
        {
            title: 'show the rating icon',
            id: 'any',
            showRatingIconFg: true,
            showRatingIconProfileFg: true,
        },
        {
            title: 'hide the rating icon only on the profile page',
            id: 'only-not-standings',
            showRatingIconFg: true,
            showRatingIconProfileFg: false,
        },
        {
            title: 'hide the rating icon',
            id: 'all',
            showRatingIconFg: false,
            showRatingIconProfileFg: false,
        },
    ],
};
const CONFIG_DROPDOWN = IS_CURRENT_LANGUAGE_JA
    ? CONFIG_DROPDOWN_JA
    : CONFIG_DROPDOWN_EN;
const MODAL_HTML_BASE = `<div id="modal-ac-hide-icon-settings" class="modal fade" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
        <h4 class="modal-title">
          ${CONFIG_DROPDOWN['title']}
        </h4>
      </div>
    <div class="modal-body">
      <div class="container-fluid">
        <div class="settings-row row" id="ac-hide-rating-icon-radio">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-default" data-dismiss="modal">close</button>
    </div>
  </div>
</div>`;
const RADIO_HTML_BASE = (text, id) => `<div class="radio">
    <label>\
      <input type="radio" name="ac-hide-rating-icon-config" id="ac-hide-rating-icon-${id}" required> ${text}
    </label>
  </div>`;
const localStorageController = new LocalStorageController();
function isDropDownMenu() {
    return (document.getElementsByClassName('header-mypage_btn').length === 0 ||
        CURRENT_LANGUAGE === 'EN');
}
function createRadio() {
    const radioState = localStorageController.getRadioState();
    CONFIG_DROPDOWN['radio'].forEach((element) => {
        var _a;
        const { title, id, showRatingIconFg, showRatingIconProfileFg } = element;
        const radio = RADIO_HTML_BASE(title, id);
        (_a = document
            .querySelector('#ac-hide-rating-icon-radio')) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('afterbegin', radio);
        const currentRadio = document.getElementById(`ac-hide-rating-icon-${id}`);
        currentRadio.addEventListener('click', () => {
            localStorageController.saveRadioState({
                showRatingIconFg,
                showRatingIconProfileFg,
            });
            currentRadio.checked = true;
            checkAndHideIcons();
        });
        if (radioState['showRatingIconFg'] === showRatingIconFg &&
            radioState['showRatingIconProfileFg'] === showRatingIconProfileFg) {
            currentRadio.checked = true;
        }
    });
}
function createModal() {
    var _a;
    (_a = document
        .querySelector('body')) === null || _a === void 0 ? void 0 : _a.insertAdjacentHTML('afterbegin', MODAL_HTML_BASE);
    createRadio();
}
function controlIcons(hideFg) {
    RATING_ICON_CLASSES.forEach((ratingIconClass) => {
        const ratingIcons = document.getElementsByClassName(ratingIconClass);
        Array.prototype.forEach.call(ratingIcons, (element) => {
            element.style.display = hideFg ? 'none' : 'unset';
        });
    });
}
function showHeaderSettingForDropDown() {
    const headerMyPageList = document.getElementsByClassName('dropdown-menu')[1];
    const newElement = createHeaderSettingElementForDropDown();
    const positionIndex = 6;
    if (positionIndex >= headerMyPageList.children.length) {
        headerMyPageList.appendChild(newElement);
    }
    else {
        headerMyPageList.insertBefore(newElement, headerMyPageList.children[positionIndex]);
    }
}
function showHeaderSetting() {
    const headerMyPageList = document.getElementsByClassName('header-mypage_list')[0];
    const newElement = createHeaderSettingElement();
    const positionIndex = 5;
    if (headerMyPageList) {
        if (positionIndex >= headerMyPageList.children.length) {
            headerMyPageList.appendChild(newElement);
        }
        else {
            headerMyPageList.insertBefore(newElement, headerMyPageList.children[positionIndex]);
        }
    }
}
function createGlyphicon() {
    const innerSpanTag = document.createElement('span');
    ['glyphicon', 'glyphicon-wrench'].forEach((tag) => innerSpanTag.classList.add(tag));
    return innerSpanTag;
}
function createIcon() {
    const innerITag = document.createElement('i');
    ['a-icon', 'a-icon-setting'].forEach((tag) => innerITag.classList.add(tag));
    return innerITag;
}
function createHeaderATag() {
    const aTag = document.createElement('a');
    const text = document.createTextNode(CONFIG_DROPDOWN['title']);
    aTag.appendChild(text);
    aTag.setAttribute('data-toggle', 'modal');
    aTag.setAttribute('data-target', '#modal-ac-hide-icon-settings');
    return aTag;
}
function createHeaderSettingElementForDropDown() {
    const element = document.createElement('li');
    const innerATag = createHeaderATag();
    const innerSpanTag = createGlyphicon();
    element.appendChild(innerATag);
    innerATag.insertBefore(innerSpanTag, innerATag.firstChild);
    return element;
}
function createHeaderSettingElement() {
    const element = document.createElement('li');
    const innerATag = createHeaderATag();
    const innerTag = IS_CURRENT_LANGUAGE_JA ? createIcon() : createGlyphicon();
    element.appendChild(innerATag);
    innerATag.insertBefore(innerTag, innerATag.firstChild);
    return element;
}
function observeLoadingHideClassForStandings(hide) {
    const target = document.getElementsByClassName('loading-hide');
    if (target) {
        const observer = new MutationObserver(() => {
            // 読み込み後は standings-tbody に順位情報が格納されるため、それを参照する
            observeStandings(hide);
            controlIcons(hide);
        });
        observer.observe(target[1], {
            childList: true,
        });
        observeStandings(hide);
    }
}
function observeStandings(hide) {
    const target = document.getElementById('standings-tbody');
    if (target) {
        const observer = new MutationObserver(() => {
            controlIcons(hide);
        });
        observer.observe(target, {
            childList: true,
        });
    }
}
function checkAndHideIcons() {
    const { showRatingIconFg, showRatingIconProfileFg } = localStorageController.getRadioState();
    const url = window.location.href;
    controlIcons(!showRatingIconFg ||
        (url.match(/.*users.*/) !== null && !showRatingIconProfileFg));
    if (url.match(/.*standings/g)) {
        observeLoadingHideClassForStandings(!showRatingIconFg);
    }
}
function main() {
    checkAndHideIcons();
    // 設定作る系
    createModal();
    if (isDropDownMenu()) {
        showHeaderSettingForDropDown();
    }
    else {
        showHeaderSetting();
    }
}
(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => main());
    }
    else {
        main();
    }
})();
//# sourceMappingURL=index.js.map
