// ==UserScript==
// @name                 Pixiv Infinite Scroll
// @name:ja              Pixiv Infinite Scroll
// @name:zh-CN           Pixiv Infinite Scroll
// @name:zh-TW           Pixiv Infinite Scroll
// @namespace            https://github.com/chimaha/Pixiv-Infinite-Scroll
// @match                https://www.pixiv.net/*
// @grant                GM_getValue
// @grant                GM_setValue
// @grant                GM_registerMenuCommand
// @version              1.6.3
// @author               hamachi
// @description          Add infinite scroll feature to Pixiv.
// @description:ja       Pixivに無限スクロール機能を追加します。
// @description:zh-CN    为 Pixiv 添加无限滚动功能。
// @description:zh-TW    因為Pixiv有無限移動功能。
// @license              MIT license
// @compatible           firefox
// @compatible           chrome
// @icon                 https://raw.githubusercontent.com/hamachi25/Pixiv-Infinite-Scroll/main/icon.png
// @supportURL           https://github.com/hamachi25/Pixiv-Infinite-Scroll/issues
// @downloadURL https://update.greasyfork.org/scripts/473928/Pixiv%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/473928/Pixiv%20Infinite%20Scroll.meta.js
// ==/UserScript==

/*! Pixiv Infinite Scroll | MIT license | https://github.com/hamachi25/Pixiv-Infinite-Scroll/blob/main/LICENSE */

"use strict";

let showDividingLine = GM_getValue("dividingLine", true);

// エスケープHTML
function escapeText(str) {
    if (typeof str != "string") {
        return str;
    }
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 読み込み中のアニメーション
function loadAnimation(target) {
    const loadDiv = `
    <div id="load-animation" style="margin-top: 50px;">
        <div class="sc-1d7d5ry-2 eRpWzd">
            <div class="eJWYE_ff2i8Ib65r">
                <div class="g2opRplSrlwUvRxg"></div>
            </div>
        </div>
    </div>`;
    document.querySelector(target).insertAdjacentHTML("afterend", loadDiv);
}

function deleteAnimation(jsonBody, n) {
    const jsonWorksLength = Object.keys(jsonBody).length;
    const loadAnimation = document.getElementById("load-animation");
    if (jsonWorksLength < n && loadAnimation) {
        loadAnimation.remove();
    }
}

const fetchResponse = async (url) => {
    let response;
    let json;
    try {
        response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response Error：${response.status}`);
        }
        json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return 0;
    }
};

// イラストをマウスオーバーでopacity変更
function mouseover() {
    for (const element of document.querySelectorAll(
        `[data-page="${scrollPageCount + 1}"] a.khjDVZ`
    )) {
        element.addEventListener("mouseover", () => {
            element.style.opacity = "0.8";
        });
        element.addEventListener("mouseleave", () => {
            element.style.opacity = "1";
        });
    }
}

function addPageURLToDividingLine(borderOffset) {
    if (currentUrl.includes("p=")) {
        return currentUrl.replace(/(p=)[^&]+/, "$1" + Number(borderOffset));
    } else {
        const separate = currentUrl.includes("?") ? "&" : "?";
        return currentUrl + separate + "p=" + Number(borderOffset);
    }
}

function addStyle() {
    if (document.getElementById("pis-style")) {
        return;
    }
    document.head.insertAdjacentHTML("beforeend", '<style id="pis-style"></style>');
    document.head.lastElementChild.textContent = `
        /* 区切り線の数字リンク */
        .pis-pageurl{
            display: block;
            width: 100%;
        }
        .pis-pageurl:hover {
            text-decoration: underline;
            color: black;
        }

        .gqlfsh:visited {
            color: rgb(173, 173, 173);
        }
        .jtUPOE {
            display: flex;
            padding: 0px;
            flex-wrap: wrap;
            margin: -12px;
            list-style: none;
        }
        .hdRpMN {
            display: grid;
            grid-template-columns: repeat(6, 184px);
            gap: 24px;
        }

        /* ロードアニメーション */
        .eRpWzd {
            padding-top: 104px;
            padding-bottom: 104px;
            margin: 0 !important;
        }
        .eJWYE_ff2i8Ib65r {
            align-self: center;
            position: relative;
            vertical-align: middle;
            text-align: center;
            width: 100%;
            height: 32px;
            font-size: 20px;
            color: #36c9ed;
        }
        .eJWYE_ff2i8Ib65r::before {
            content: "";
            display: inline-block;
            height: 100%;
            vertical-align: middle;
            margin-right: -.25em;
        }
        .eJWYE_ff2i8Ib65r > .g2opRplSrlwUvRxg {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 32px;
            height: 32px;
            margin-top: -16px;
            margin-left: -16px;
            background-color: #555;
            border-radius: 100%;
            -webkit-animation: qu_tf7_bDQZgiylG 1s ease-in-out infinite;
            animation: qu_tf7_bDQZgiylG 1s ease-in-out infinite;
        }`;
}

// フォロー中の無限スクロール-----------------------------------------------------------------
function following_process() {
    // langの値によって言語を変更する
    const setFollowLanguage = [];
    const currentLanguage = document.querySelector("html").getAttribute("lang");
    switch (currentLanguage) {
        case "ja":
            setFollowLanguage.push("フォロー中", "フォローする");
            break;
        case "ko":
            setFollowLanguage.push("팔로우 중", "팔로우하기");
            break;
        case "zh-CN":
            setFollowLanguage.push("已关注", "加关注");
            break;
        case "zh-TW":
            setFollowLanguage.push("關注中", "加關注");
            break;
        default:
            setFollowLanguage.push("Following", "Follow");
    }

    let borderCount = 0;

    function createElement(
        userId,
        userName,
        userProfileImage,
        userComment,
        userFollowing,
        illustId,
        illustTitle,
        illustUrl,
        illustBookmarkData,
        illustAlt,
        illustR18,
        illustPageCount
    ) {
        // ページ区切り線
        borderCount++;
        if (borderCount == 1 && showDividingLine) {
            const borderElement = `
                <div style="border-top: 1px solid; text-align: center; font-size: 20px; color: gray; user-select: none;">
                    <a class="pis-pageurl" href="${addPageURLToDividingLine(
                        borderOffset
                    )}" target="_blank" rel="noopener noreferrer">${borderOffset}</a>
                </div>
            `;
            document.querySelector(".sc-1y4z60g-4").insertAdjacentHTML("beforeend", borderElement);
        }

        // フォロー中・フォローするを切り替え
        let changeFollowLanguage;
        let followClass;
        let followStyle = "";
        if (userFollowing) {
            changeFollowLanguage = setFollowLanguage[0];
            followClass = "cnpwVx";
            followStyle =
                'style="background-color: var(--charcoal-surface3); color: var(--charcoal-text2); font-weight: bold; padding-right: 24px; padding-left: 24px; border-radius: 999999px; height: 40px;"';
        } else {
            changeFollowLanguage = setFollowLanguage[1];
            followClass = "fOWAlD";
        }
        // ブックマークを切り替え
        let bookmarkClass = [];
        let bookmarkStyle = [];
        for (const checkBookmark of illustBookmarkData) {
            if (checkBookmark) {
                bookmarkClass.push("bXjFLc");
                bookmarkStyle.push('style="color: rgb(255, 64, 96); fill: currentcolor;"');
            } else {
                bookmarkClass.push("dxYRhf");
            }
        }

        // R18マーク
        let r18Element = [];
        for (const checkR18 of illustR18) {
            if (checkR18 == "R-18") {
                r18Element.push(
                    '<div class="sc-rp5asc-15 cIllir"><div class="sc-1ovn4zb-0 bfWaOT">R-18</div></div>'
                );
            } else {
                r18Element.push("");
            }
        }

        // うごくイラスト再生マーク。イラスト枚数表示
        let ugoiraElement = [];
        let pageCountElement = [];
        illustPageCount.forEach((pageCount, i) => {
            if (illustAlt[i].slice(-4) == "うごイラ") {
                ugoiraElement.push(
                    '<svg viewBox="0 0 24 24" class="sc-192k5ld-0 etaMpt sc-rp5asc-8 kSDUsv" style="width: 48px; height: 48px; position: absolute";><circle cx="12" cy="12" r="10" class="sc-192k5ld-1 lajlxF" style="fill: rgba(0, 0, 0, 0.32);"></circle><path d="M9,8.74841664 L9,15.2515834 C9,15.8038681 9.44771525,16.2515834 10,16.2515834 C10.1782928,16.2515834 10.3533435,16.2039156 10.5070201,16.1135176 L16.0347118,12.8619342 C16.510745,12.5819147 16.6696454,11.969013 16.3896259,11.4929799 C16.3034179,11.3464262 16.1812655,11.2242738 16.0347118,11.1380658 L10.5070201,7.88648243 C10.030987,7.60646294 9.41808527,7.76536339 9.13806578,8.24139652 C9.04766776,8.39507316 9,8.57012386 9,8.74841664 Z" class="sc-192k5ld-2 jwyUTl" style="fill: rgb(255, 255, 255);"></path></svg>'
                );
                pageCountElement.push("");
            } else {
                ugoiraElement.push("");
                if (pageCount >= 2) {
                    pageCountElement.push(`
                    <div class="sc-rp5asc-5 hHNegy">
                        <div class="sc-1mr081w-0 kZlOCw">
                            <span class="sc-1mr081w-1 gODLwk">
                                <span class="sc-14heosd-0 gbNjFx">
                                    <svg viewBox="0 0 9 10" size="9" class="sc-14heosd-1 fArvVr">
                                        <path d="M8,3 C8.55228475,3 9,3.44771525 9,4 L9,9 C9,9.55228475 8.55228475,10 8,10 L3,10 C2.44771525,10 2,9.55228475 2,9 L6,9 C7.1045695,9 8,8.1045695 8,7 L8,3 Z M1,1 L6,1 C6.55228475,1 7,1.44771525 7,2 L7,7 C7,7.55228475 6.55228475,8 6,8 L1,8 C0.44771525,8 0,7.55228475 0,7 L0,2 C0,1.44771525 0.44771525,1 1,1 Z" transform=""></path>
                                    </svg>
                                </span>
                            </span>
                            <span>${pageCount}</span>
                        </div>
                    </div>`);
                } else {
                    pageCountElement.push("");
                }
            }
        });

        // イラストがない場合は表示しないようにするため、分けて作成する
        let illustGroup = "";
        for (let i = 0; i < illustId.length; i++) {
            illustGroup += `
            <div class="sc-w2rqc8-2 bgeGyS">
                <div class="sc-fgp4rp-1 cQUnPX">
                    <div class="sc-iasfms-5 liyNwX" style="width: 184px;">
                        <div type="illust" size="184" class="sc-iasfms-3 frFjhu">
                            <div width="184" height="184" class="sc-rp5asc-0 fxGVAF addBookmark">
                                <a class="sc-d98f2c-0 sc-rp5asc-16 iUsZyY sc-eWnToP khjDVZ" data-gtm-value="${
                                    illustId[i]
                                }" data-gtm-user-id="${userId}" href="/artworks/${
                illustId[i]
            }" style="transition: opacity 0.2s ease 0s;">
                                    <div radius="4" class="sc-rp5asc-9 cYUezH" style="position: relative; width: 100%; height: 100%;">
                                        <img src="${
                                            illustUrl[i]
                                        }" style="object-fit: cover; object-position: center center; width: 100%; height: 100%;" alt="${escapeText(
                illustAlt[i]
            )}" class="sc-rp5asc-10 erYaF">
                                        ${ugoiraElement[i]}
                                    </div>
                                    <div class="sc-rp5asc-12 Sxcoo">
                                        <div class="sc-rp5asc-13 liXhix">${r18Element[i]}</div>
                                        ${pageCountElement[i]}
                                    </div>
                                </a>
                                <div class="sc-iasfms-4 iHfghO" style="position: absolute; bottom: 0px; right: 0px;">
                                    <div class="">
                                        <button type="button" class="sc-kgq5hw-0 fgVkZi">
                                            <svg viewBox="0 0 32 32" width="32" height="32" class="sc-j89e3c-1 ${
                                                bookmarkClass[i]
                                            }" ${bookmarkStyle[i]}>
                                                <path d="M21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183 C16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5 C4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366 C17.3789877,6.4144028 19.170186,5.5 21,5.5 Z"></path>
                                                <path d="M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5 C8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328 C15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5 C26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z" class="sc-j89e3c-0 dUurgf"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="sc-iasfms-1 jthKhf">
                            <a class="sc-d98f2c-0 sc-iasfms-6 gqlfsh" href="/artworks/${
                                illustId[i]
                            }" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; line-height: 22px; font-size: 14px; font-weight: bold;">${escapeText(
                illustTitle[i]
            )}</a>
                        </div>
                    </div>
                </div>
            </div>`;
        }

        let illustContainer = "";
        if (illustId[0]) {
            illustContainer = `
            <div class="sc-11m5zdr-2 gClOXE">
                <div>
                    <div class="sc-1kr69jw-2 hYTIUt">
                        <div class="sc-1kr69jw-4 hOZSpq">
                            <div class="sc-1kr69jw-5 Dzlsu">
                                <div class="sc-1kr69jw-6 dhGRLC">
                                    <div class="sc-1kr69jw-3 wJpxo" data-add-scroll="true">
                                        <ul class="sc-1kr69jw-0 hkzusx">
                                        ${illustGroup}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="sc-1kr69jw-1 ioeugW">
                            <button type="button" style="left: 0px; margin-bottom: 0px; padding-left: 16px; padding-bottom: 0px;" class="sc-lsvxoe-1 sc-lsvxoe-2 bpAOQo fXtZss">
                                <div class="sc-lsvxoe-0 kYzpDP">
                                    <svg viewBox="0 0 24 24" size="24" class="sc-11csm01-0 fivNSm">
                                        <path d="M8.08579 16.5858C7.30474 17.3668 7.30474 18.6332 8.08579 19.4142C8.86684 20.1953 10.1332 20.1953 10.9142 19.4142L18.3284 12L10.9142 4.58579C10.1332 3.80474 8.86684 3.80474 8.08579 4.58579C7.30474 5.36684 7.30474 6.63317 8.08579 7.41421L12.6716 12L8.08579 16.5858Z" transform="rotate(180 12 12)"></path>
                                    </svg>
                                </div>
                            </button>
                            <button type="button" style="right: -72px; margin-bottom: 0px; padding-right: 16px; padding-bottom: 0px;" class="sc-lsvxoe-1 sc-lsvxoe-2 bpAOQo fXtZss">
                                <div class="sc-lsvxoe-0 kYzpDP">
                                    <svg viewBox="0 0 24 24" size="24" class="sc-11csm01-0 fivNSm">
                                        <path d="M8.08579 16.5858C7.30474 17.3668 7.30474 18.6332 8.08579 19.4142C8.86684 20.1953 10.1332 20.1953 10.9142 19.4142L18.3284 12L10.9142 4.58579C10.1332 3.80474 8.86684 3.80474 8.08579 4.58579C7.30474 5.36684 7.30474 6.63317 8.08579 7.41421L12.6716 12L8.08579 16.5858Z"></path>
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        }

        // "appendElements+="で一括追加にすると、なぜかundefinedが追加され続けるので一つずつ追加
        const appendElements = `
        <div class="sc-1y4z60g-5 iVLXCu addElement" data-page="${
            scrollPageCount + 1
        }" style="padding-top: 24px; padding-bottom: 24px; border-bottom: solid 1px var(--charcoal-border-default);">
            <div class="sc-11m5zdr-0 bbJBkV">
                <div class="sc-11m5zdr-1 clrYBQ">
                    <div class="sc-19z9m4s-0 fbLOpg">
                        <a class="sc-d98f2c-0" data-gtm-value="${userId}" href="/users/${userId}">
                            <div size="80" title="${escapeText(
                                userName
                            )}" role="img" class="sc-1asno00-0 deMagM">
                                <img src="${userProfileImage}" style="object-fit: cover; object-position: center top;" width="80" height="80" alt="${escapeText(
            userName
        )}">
                            </div>
                        </a>
                        <div class="sc-19z9m4s-4 fYGGbS">
                            <div class="sc-19z9m4s-5 iqZEnZ">
                                <a class="sc-d98f2c-0 sc-19z9m4s-2 QHGGh" data-gtm-value="${userId}" href="/users/${userId}">${escapeText(
            userName
        )}</a>
                            </div>
                            <div class="sc-19z9m4s-3 isEYuz">${escapeText(userComment)}</div>
                            <div class="sc-19z9m4s-1 qjElz">
                                <button class="sc-bdnxRM jvCTkj sc-dlnjwi ${followClass} sc-1obql3d-0 Rlftz gtm-undefined sc-1obql3d-0 Rlftz gtm-undefined follow" data-gtm-user-id="${userId}" data-click-action="click" data-click-label="follow" height="40" ${followStyle}>${changeFollowLanguage}</button>
                                <div aria-current="false" class="sc-125tkm8-0 sc-125tkm8-3 ka-dhPl eZXKAK">
                                    <div class="sc-1ij5ui8-0 QihHO sc-125tkm8-2 gUcOiA" role="button">
                                        <pixiv-icon name="24/Dot"></pixiv-icon>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ${illustContainer}
            </div>
        </div>`;

        document.querySelector(".sc-1y4z60g-4").insertAdjacentHTML("beforeend", appendElements);
    }

    // https://www.pixiv.net/ajax/user/*/following?offset=24&limit=24&rest=show
    // https://www.pixiv.net/users/*/following?p=2

    const illustItems = document.querySelectorAll(".sc-1y4z60g-5");
    if (illustItems.length < 24 && scrollPageCount == 1) {
        return;
    }
    // URL作成
    const matches = location.href.match(followingRegex);
    let offset;
    let borderOffset;
    if ((matches[3] || matches[5]) && isValid) {
        if (matches[3] && scrollPageCount == 0) {
            saveScrollPageCount = Number(matches[3]);
        } else if (scrollPageCount == 0) {
            saveScrollPageCount = Number(matches[5]);
        }
        offset = saveScrollPageCount * 24 + scrollPageCount * 24;
        borderOffset = scrollPageCount + saveScrollPageCount + 1;
    } else {
        scrollPageCount == 0 ? (saveScrollPageCount = 0) : "";
        isValid = false;
        offset = 24 + scrollPageCount * 24;
        borderOffset = scrollPageCount + 2;
    }
    scrollPageCount++;

    const folderTag = matches[2] ? `&tag=${matches[2]}` : "";
    const showHide = matches[4] ? "hide" : "show";

    if (scrollPageCount == 1) {
        revertURL(illustItems, 23, 30);
        loadAnimation(".sc-1y4z60g-4");
    }

    const url = `https://www.pixiv.net/ajax/user/${matches[1]}/following?offset=${offset}&limit=24&rest=${showHide}${folderTag}`;

    const fetchData = async () => {
        const json = await fetchResponse(url);
        if (json == 0) {
            deleteAnimation(0, 23);
            return;
        } else {
            deleteAnimation(json.body.users, 23);
        }

        for (let i = 0; i < Object.keys(json.body.users).length; i++) {
            const users = json.body.users[i];
            const userId = users.userId;
            const userName = users.userName;
            const userProfileImage = users.profileImageUrl;
            const userComment = users.userComment.slice(0, 98);
            const userFollowing = users.following;
            const illustId = [];
            const illustTitle = [];
            const illustUrl = [];
            const illustBookmarkData = [];
            const illustAlt = [];
            const illustR18 = [];
            const illustPageCount = [];
            for (let j = 0; j < Object.keys(json.body.users[i].illusts).length; j++) {
                const illusts = json.body.users[i].illusts[j];
                illustId.push(illusts.id);
                illustTitle.push(illusts.title);
                illustUrl.push(illusts.url);
                illustBookmarkData.push(illusts.bookmarkData);
                illustAlt.push(illusts.alt);
                illustR18.push(illusts.tags[0]);
                illustPageCount.push(illusts.pageCount);
            }
            createElement(
                userId,
                userName,
                userProfileImage,
                userComment,
                userFollowing,
                illustId,
                illustTitle,
                illustUrl,
                illustBookmarkData,
                illustAlt,
                illustR18,
                illustPageCount
            );
        }
        mouseover();
    };
    (async () => {
        await fetchData();
        bookmarkAddDelete();
        followAndUnfollow(setFollowLanguage);
        changeURL(matches[3], matches[5], 23, 30);
    })();
}
// -----------------------------------------------------------------------------------------

// ブックマーク・フォローユーザーの作品・タグ検索・プロフィールページの無限スクロール--------------
function bookmarkAndTag_process(checkType, matches) {
    function createElement(
        illustId,
        illustTitle,
        illustUrl,
        userId,
        userName,
        illustPageCount,
        illustBookmarkData,
        illustAlt,
        userProfileImage,
        typeElement,
        typeClass,
        illustR18,
        illustMaskReason
    ) {
        // langの値によって言語を変更する
        const setDeletedLanguage = [];
        const currentLanguage = document.querySelector("html").getAttribute("lang");
        switch (currentLanguage) {
            case "ja":
                setDeletedLanguage.push(
                    "R18 / R18G",
                    "作品",
                    "閲覧制限中",
                    "削除済み",
                    "もしくは非公開"
                );
                break;
            case "ko":
                setDeletedLanguage.push(
                    "R-18 / R-18G",
                    "작품",
                    "열람 제한 중",
                    "삭제됨",
                    "혹은 비공개"
                );
                break;
            case "zh-CN":
                setDeletedLanguage.push(
                    "R-18 / R-18G",
                    "作品",
                    "浏览受限（含成人内容）",
                    "已删除",
                    "或不公开"
                );
                break;
            case "zh-TW":
                setDeletedLanguage.push(
                    "R-18 / R-18G",
                    "作品",
                    "瀏覽受限（含成人內容）",
                    "已刪除",
                    "或非公開"
                );
                break;
            default:
                setDeletedLanguage.push(
                    "R-18/R-18G",
                    "works",
                    "Restricted (Adult Content)",
                    "Deleted",
                    "or private"
                );
        }

        // ブックマークを切り替え
        let bookmarkClass = "";
        let bookmarkStyle = "";
        if (illustBookmarkData) {
            bookmarkClass = "bXjFLc";
            bookmarkStyle = 'style="color: rgb(255, 64, 96); fill: currentcolor;"';
        } else {
            bookmarkClass = "dxYRhf";
        }

        // R18マーク
        let r18Element = "";
        if (illustR18 == "R-18") {
            r18Element = `
            <div class="sc-rp5asc-15 cIllir">
                <div class="sc-1ovn4zb-0 bfWaOT">R-18</div>
            </div>`;
        }

        // うごくイラスト再生マーク・イラスト数表示
        let ugoiraElement = "";
        let pageCountElement = "";
        if (illustAlt.slice(-4) == "うごイラ") {
            ugoiraElement =
                '<svg viewBox="0 0 24 24" class="sc-192k5ld-0 etaMpt sc-rp5asc-8 kSDUsv"  style="width: 48px; height: 48px; position: absolute";><circle cx="12" cy="12" r="10" class="sc-192k5ld-1 lajlxF" style="fill: rgba(0, 0, 0, 0.32);"></circle><path d="M9,8.74841664 L9,15.2515834 C9,15.8038681 9.44771525,16.2515834 10,16.2515834 C10.1782928,16.2515834 10.3533435,16.2039156 10.5070201,16.1135176 L16.0347118,12.8619342 C16.510745,12.5819147 16.6696454,11.969013 16.3896259,11.4929799 C16.3034179,11.3464262 16.1812655,11.2242738 16.0347118,11.1380658 L10.5070201,7.88648243 C10.030987,7.60646294 9.41808527,7.76536339 9.13806578,8.24139652 C9.04766776,8.39507316 9,8.57012386 9,8.74841664 Z" class="sc-192k5ld-2 jwyUTl" style="fill: rgb(255, 255, 255);></path></svg>';
        } else {
            if (illustPageCount > 2) {
                pageCountElement = `
                <div class="sc-rp5asc-5 hHNegy">
                    <div class="sc-1mr081w-0 kZlOCw">
                        <span class="sc-1mr081w-1 gODLwk">
                            <span class="sc-14heosd-0 gbNjFx">
                                <svg viewBox="0 0 9 10" size="9" class="sc-14heosd-1 fArvVr">
                                    <path d="M8,3 C8.55228475,3 9,3.44771525 9,4 L9,9 C9,9.55228475 8.55228475,10 8,10 L3,10 C2.44771525,10 2,9.55228475 2,9 L6,9 C7.1045695,9 8,8.1045695 8,7 L8,3 Z M1,1 L6,1 C6.55228475,1 7,1.44771525 7,2 L7,7 C7,7.55228475 6.55228475,8 6,8 L1,8 C0.44771525,8 0,7.55228475 0,7 L0,2 C0,1.44771525 0.44771525,1 1,1 Z" transform=""></path>
                                </svg>
                            </span>
                        </span>
                        <span>${illustPageCount}</span>
                    </div>
                </div>`;
            }
        }

        let illustContainer = "";
        let userNameContainer = "";
        let addBookmarkClass = "";
        let illustTitleElement;
        if (illustTitle == "-----") {
            if (illustMaskReason == "r18" || illustMaskReason == "r18g") {
                // R18・R18G
                illustContainer = `
                <span to="/artworks/${illustId}" class="sc-rp5asc-16 iUsZyY sc-eWnToP khjDVZ" data-gtm-value="${illustId}" data-gtm-user-id="${userId}">
                    <div class="sc-7i69t-2 wDRGm">
                        <div class="sc-7i69t-0 lmTlVI">
                            <div class="sc-7i69t-6 jjBwSZ" style="color: var(--charcoal-text4); justify-self: center;">
                                <svg viewBox="0 0 24 24" class="sc-11k840d-0 hgKsyL" style="width: 72px; height: 72px; fill: currentcolor;">
                                    <path d="M5.26763775,4 L9.38623853,11.4134814 L5,14.3684211 L5,18 L13.0454155,18 L14.1565266,20 L5,20 C3.8954305,20 3,19.1045695 3,18 L3,6 C3,4.8954305 3.8954305,4 5,4 L5.26763775,4 Z M9.84347336,4 L19,4 C20.1045695,4 21,4.8954305 21,6 L21,18 C21,19.1045695 20.1045695,20 19,20 L18.7323623,20 L17.6212511,18 L19,18 L19,13 L16,15 L15.9278695,14.951913 L9.84347336,4 Z M16,7 C14.8954305,7 14,7.8954305 14,9 C14,10.1045695 14.8954305,11 16,11 C17.1045695,11 18,10.1045695 18,9 C18,7.8954305 17.1045695,7 16,7 Z M7.38851434,1.64019979 L18.3598002,21.3885143 L16.6114857,22.3598002 L5.64019979,2.61148566 L7.38851434,1.64019979 Z"></path>
                                </svg>
                            </div>
                            <div class="sc-7i69t-4 hEKLCY" style="color: var(--charcoal-text4); text-align: center; font-size: 16px; line-height: 24px; font-weight: bold;">${setDeletedLanguage[0]}<br>${setDeletedLanguage[1]}</div>
                        </div>
                    </div>
                </span>
                <div class="sc-iasfms-4 iHfghO" style="position: absolute; bottom: 0px; right: 0px;">
                    <div class=""><button type="button" class="sc-kgq5hw-0 fgVkZi" disabled="">
                        <svg viewBox="0 0 32 32" width="32" height="32" class="sc-j89e3c-1 dxYRhf">
                                <path d="M21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183 C16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5 C4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366 C17.3789877,6.4144028 19.170186,5.5 21,5.5 Z"></path>
                                <path d="M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5 C8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328 C15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5 C26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z" class="sc-j89e3c-0 dUurgf"></path>
                            </svg>
                        </button>
                    </div>
                </div>`;
                illustTitleElement = `<span class="sc-iasfms-6 hvLYiR" to="/artworks/${illustId}" style="overflow: hidden; text-overflow: ellipsis; color: rgb(133, 133, 133); white-space: nowrap; line-height: 22px; font-size: 14px; font-weight: bold;">${setDeletedLanguage[2]}</a>`;
            } else {
                // 削除・非公開
                illustContainer = `
                <span to="/artworks/${illustId}" class="sc-rp5asc-16 iUsZyY sc-eWnToP khjDVZ" data-gtm-value="${illustId}" data-gtm-user-id="0">
                    <div class="sc-7i69t-2 wDRGm" style="display: flex; -moz-box-pack: center; justify-content: center; -moz-box-align: center; align-items: center; user-select: none; background-color: var(--charcoal-background2); width: 184px; height: 184px;">
                        <div class="sc-7i69t-0 lmTlVI" style="display: grid; -moz-box-pack: center; place-content: space-between center; margin-bottom: -1px; height: 122px; width: 122px;">
                            <div class="sc-7i69t-6 tGGpA" style="margin-right: -2px; justify-self: center; color: var(--charcoal-text4);">
                                <svg viewBox="0 0 24 24" size="72" class="sc-11csm01-0 fieitW" style="stroke: none; fill: currentcolor; width: 72px; height: 72px; line-height: 0; font-size: 0px; vertical-align: middle;">
                                    <path d="M5 22C3.34315 22 2 20.6569 2 19V5C2 3.34315 3.34315 2 5 2H15C16.6569 2 18 3.34315 18 5V15H22V19C22 20.6569 20.6569 22 19 22H5ZM18 19C18 19.2652 18.1054 19.5196 18.2929 19.7071C18.4804 19.8946 18.7348 20  19 20C19.2652 20 19.5196 19.8946 19.7071 19.7071C19.8946  19.5196 20 19.2652 20 19V17H18V19ZM11.0819 16.8469C11.0819  17.4837 10.5656 18 9.92874 18C9.29189 18 8.77562 17.4837  8.77562 16.8469C8.77562 16.21 9.29189 15.6938 9.92874  15.6938C10.5656 15.6938 11.0819 16.21 11.0819 16.8469ZM11.0063  13.3967C11.0432 13.3229 11.117 13.203 11.1631 13.1292C11.4142  12.761 11.764 12.4544 12.1185 12.1435C12.9365 11.4263 13.7802  10.6866 13.4971 9.11635C13.2295 7.55733 11.9842 6.27505 10.4251  6.04443C8.5248 5.76768 6.84585 6.93925 6.33848 8.6182C6.18165  9.15325 6.58755 9.69753 7.14105 9.69753H7.32555C7.70378 9.69753  8.0082 9.43 8.13735 9.0979C8.43255 8.27688 9.2997 7.71415 10.2591  7.9171C11.1447 8.1016 11.7904 8.97798 11.7074 9.88203C11.6449 10.5864  11.1417 10.976 10.5834 11.4083C10.2349 11.678 9.86497 11.9644 9.56723  12.3543C9.54814 12.3734 9.4852 12.4627 9.43889 12.5283C9.41803 12.5579  9.40054 12.5827 9.39195 12.5942C9.30893 12.7233 9.19823 12.9447 9.14288  13.0923C9.13365 13.1015 9.13365 13.1108 9.13365 13.12C9.02295 13.4521  8.94915 13.8488 8.94915 14.3192H10.8034C10.8034 14.0886 10.831 13.8857  10.8956 13.6919C10.9049 13.655 10.9879 13.4244 11.0063 13.3967Z" fill-rule="evenodd" clip-rule="evenodd" style="stroke: none; fill: currentcolor; line-height: 0; font-size: 0px;"></path>
                                </svg>
                            </div>
                            <div class="sc-7i69t-4 hEKLCY" style="text-align: center; color: var(--charcoal-text4); font-size: 16px; line-height: 24px; font-weight: bold; display: flow-root;">${setDeletedLanguage[3]}<br>${setDeletedLanguage[4]}</div>
                        </div>
                    </div>
                </span>
                <div class="sc-iasfms-4 iHfghO" style="position: absolute; bottom: 0px; right: 0px;">
                    <div class="">
                        <button type="button" class="sc-kgq5hw-0 fgVkZi" disabled="">
                            <svg viewBox="0 0 32 32" width="32" height="32" class="sc-j89e3c-1 dxYRhf">
                                <path d="M21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183 C16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5 C4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366 C17.3789877,6.4144028 19.170186,5.5 21,5.5 Z"></path>
                                <path d="M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5 C8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328 C15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5 C26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z" class="sc-j89e3c-0 dUurgf"></path>
                            </svg>
                        </button>
                    </div>
                </div>`;
                illustTitleElement = `<span class="sc-iasfms-7 kocGIc" to="/artworks/${illustId}" style="overflow: hidden; text-overflow: ellipsis; color: rgb(30, 30, 30); white-space: nowrap; line-height: 22px; font-size: 14px; font-weight: bold;">${escapeText(
                    illustTitle
                )}</a>`;
            }
        } else {
            // ノーマル
            illustContainer = `
            <a class="sc-d98f2c-0 sc-rp5asc-16 iUsZyY ${typeClass} sc-eWnToP khjDVZ" data-gtm-value="${illustId}" data-gtm-user-id="${userId}" href="/artworks/${illustId}" style="transition: opacity 0.2s ease 0s;">
                <div radius="4" class="sc-rp5asc-9 cYUezH" style="position: relative; display: flex; width: 100%; height: 100%;">
                    <img src="${illustUrl}" style="object-fit: cover; object-position: center center; width: 100%; height: 100%;" alt="${escapeText(
                illustAlt
            )}" class="sc-rp5asc-10 erYaF">
                    ${ugoiraElement}
                </div>
                <div class="sc-rp5asc-12 Sxcoo">
                    <div class="sc-rp5asc-13 liXhix">
                    ${r18Element}
                    </div>
                    ${pageCountElement}
                </div>
            </a>
            <div class="sc-iasfms-4 iHfghO" style="position: absolute; bottom: 0px; right: 0px;">
                <div class="">
                    <button type="button" class="sc-kgq5hw-0 fgVkZi">
                        <svg viewBox="0 0 32 32" width="32" height="32" class="sc-j89e3c-1 ${bookmarkClass}" ${bookmarkStyle}>
                            <path d="M21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183 C16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5 C4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366 C17.3789877,6.4144028 19.170186,5.5 21,5.5 Z"></path>
                            <path d="M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5 C8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328 C15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5 C26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z" class="sc-j89e3c-0 dUurgf"></path>
                        </svg>
                    </button>
                </div>
            </div>`;

            userNameContainer = `
            <div aria-haspopup="true" class="sc-1rx6dmq-0 icsUdQ">
                <div class="sc-1rx6dmq-1 eMfHJB">
                    <a class="sc-d98f2c-0" data-gtm-value="${userId}" href="/users/${userId}">
                        <div size="24" title="${escapeText(
                            userName
                        )}" role="img" class="sc-1asno00-0 hMqBzA">
                            <img src="${userProfileImage}" style="object-fit: cover; object-position: center top;" width="24" height="24" alt="${escapeText(
                userName
            )}">
                        </div>
                    </a>
                </div>
                <a class="sc-d98f2c-0 sc-1rx6dmq-2 kghgsn" data-gtm-value="${userId}" href="/users/${userId}">${escapeText(
                userName
            )}</a>
            </div>`;
            illustTitleElement = `<a class="sc-d98f2c-0 sc-iasfms-6 gqlfsh eUXPuC" href="/artworks/${illustId}" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; line-height: 22px; font-size: 14px; font-weight: bold;">${escapeText(
                illustTitle
            )}</a>`;
            addBookmarkClass = " addBookmark";
        }

        if (checkType == "artwork") {
            appendElements += `
                ${typeElement}
                    <div class="sc-iasfms-5 liyNwX" style="width: 184px;">
                        <div type="illust" size="184" class="sc-iasfms-3 iIcDMF">
                            <div width="184" height="184" class="sc-rp5asc-0 fxGVAF${addBookmarkClass}" style="position: relative; z-index: 0; width: 184px; height: 184px;">
                                ${illustContainer}
                            </div>
                        </div>
                        <div class="sc-iasfms-0 jtpclu" style="display: flex; margin-top: 4px;">
                            ${illustTitleElement}
                        </div>
                    </div>
                </li>`;
        } else {
            appendElements += `
                ${typeElement}
                    <div class="sc-iasfms-5 liyNwX" style="width: 184px;">
                        <div type="illust" size="184" class="sc-iasfms-3 iIcDMF">
                            <div width="184" height="184" class="sc-rp5asc-0 fxGVAF${addBookmarkClass}" style="position: relative; z-index: 0; width: 184px; height: 184px;">
                                ${illustContainer}
                            </div>
                        </div>
                        <div class="sc-iasfms-0 jtpclu" style="display: flex; margin-top: 4px;">
                            ${illustTitleElement}
                        </div>
                        <div class="sc-iasfms-0 jtpclu" style="display: flex; margin-top: 4px;">${userNameContainer}</div>
                    </div>
                </li>`;
        }
    }

    function getIllustData(type, jsonBody, typeElement, typeClass, target, borderOffset, tag) {
        for (let i = 0; i < Object.keys(jsonBody).length; i++) {
            // タグ検索には1つだけ何も入っていないjsonBodyがあるので、そこだけ除外
            if (!jsonBody[i].id) {
                continue;
            }
            const illust = jsonBody[i];
            const illustId = illust.id;
            const illustTitle = illust.title;
            const illustUrl = illust.url;
            const userId = illust.userId;
            const userName = illust.userName;
            const illustPageCount = illust.pageCount;
            const illustBookmarkData = illust.bookmarkData;
            const illustAlt = illust.alt;
            const userProfileImage = illust.profileImageUrl;
            const illustR18 = illust.tags[0];
            const illustMaskReason = illust.maskReason;
            createElement(
                illustId,
                illustTitle,
                illustUrl,
                userId,
                userName,
                illustPageCount,
                illustBookmarkData,
                illustAlt,
                userProfileImage,
                typeElement,
                typeClass,
                illustR18,
                illustMaskReason
            );
        }
        if (appendElements) {
            let ulClass;
            switch (type) {
                case "tag":
                    ulClass = "sc-l7cibp-1 hdRpMN";
                    break;
                default:
                    ulClass = "sc-9y4be5-1 jtUPOE";
            }

            if (showDividingLine) {
                appendElements = `
                    <div class="addElement-parents" style="border-top: 1px solid; text-align: center; font-size: 20px; color: gray; margin: 30px 0 20px 0; user-select: none;">
                        <a class="pis-pageurl" href="${addPageURLToDividingLine(
                            borderOffset
                        )}" target="_blank" rel="noopener noreferrer">${borderOffset}</a>
                    </div>
                    <ul class="${ulClass} addElement-parents">${appendElements}</ul>
                `;
                document.querySelector(target).insertAdjacentHTML("beforeend", appendElements);
            } else if (tag) {
                // タグ検索の場合詰めて表示する
                document
                    .querySelector(".sc-l7cibp-1")
                    .insertAdjacentHTML("beforeend", appendElements);
            } else {
                appendElements = `<ul class="${ulClass} addElement-parents">${appendElements}</ul>`;
                document.querySelector(target).insertAdjacentHTML("beforeend", appendElements);
            }
        }
    }

    let appendElements = "";
    if (checkType == "bookmark") {
        // ブックマーク
        // https://www.pixiv.net/ajax/user/*/illusts/bookmarks?tag=&offset=0&limit=48&rest=show
        // https://www.pixiv.net/users/*/bookmarks/artworks?p=2

        const illustItems = document.querySelectorAll(".sc-9y4be5-2");
        if (illustItems.length < 48 && scrollPageCount == 1) {
            return;
        }

        // URL作成
        let offset;
        let borderOffset;
        if (matches[4] && isValid) {
            scrollPageCount == 0 ? (saveScrollPageCount = Number(matches[4])) : "";
            offset = saveScrollPageCount * 48 + scrollPageCount * 48;
            borderOffset = scrollPageCount + saveScrollPageCount + 1;
        } else {
            scrollPageCount == 0 ? (saveScrollPageCount = 0) : "";
            isValid = false;
            offset = 48 + scrollPageCount * 48;
            borderOffset = scrollPageCount + 2;
        }
        const tag = matches[2] ? matches[2] : "";
        const rest = matches[3] ? "hide" : "show";

        scrollPageCount++;

        if (scrollPageCount == 1) {
            revertURL(illustItems, 47, 50);
            loadAnimation("section.sc-jgyytr-0 > div:nth-child(3)");
        }

        const url = `https://www.pixiv.net/ajax/user/${matches[1]}/illusts/bookmarks?tag=${tag}&offset=${offset}&limit=48&rest=${rest}`;

        const fetchData = async () => {
            const json = await fetchResponse(url);
            if (json == 0) {
                deleteAnimation(0, 47);
                return;
            } else {
                deleteAnimation(json.body.works, 47);
            }

            const typeElement = `<li size="1" offset="0" class="sc-9y4be5-2 sc-9y4be5-3 sc-1wcj34s-1 kFAPOq eLrjNK addElement" data-page="${
                scrollPageCount + 1
            }" style="display: block; margin: 12px; width: 184px order: 1;">`;
            const target = ".sc-9y4be5-0";
            getIllustData(
                "bookmark",
                json.body.works,
                typeElement,
                "",
                target,
                borderOffset,
                false
            );
            mouseover();
        };
        (async () => {
            await fetchData();
            bookmarkAddDelete();
            changeURL(matches[3], false, 47, 50);
        })();
    } else if (checkType == "follow") {
        // フォローユーザーの作品
        // https://www.pixiv.net/ajax/follow_latest/illust?p=2&mode=all
        // https://www.pixiv.net/bookmark_new_illust.php?p=2

        const illustItems = document.querySelectorAll(".sc-9y4be5-2");
        if (illustItems.length < 60 && scrollPageCount == 1) {
            return;
        }

        // URL作成
        let offset;
        let borderOffset;
        scrollPageCount++;
        if ((matches[2] || matches[4]) && isValid) {
            if (matches[2] && scrollPageCount == 1) {
                saveScrollPageCount = Number(matches[2]);
            } else if (scrollPageCount == 1) {
                saveScrollPageCount = Number(matches[4]);
            }
            offset = saveScrollPageCount + scrollPageCount;
            borderOffset = scrollPageCount + saveScrollPageCount;
        } else {
            scrollPageCount == 1 ? (saveScrollPageCount = 0) : "";
            isValid = false;
            offset = 1 + scrollPageCount;
            borderOffset = scrollPageCount + 1;
        }
        const setMode = matches[1] ? "r18" : "all";

        const target = ".sc-9y4be5-0";
        if (scrollPageCount == 1) {
            revertURL(illustItems, 59, 70);
            loadAnimation(target);
        }

        const folderTag = matches[3] ? `&${matches[3]}` : "";

        const url = `https://www.pixiv.net/ajax/follow_latest/illust?p=${offset}&mode=${setMode}${folderTag}`;

        const fetchData = async () => {
            const json = await fetchResponse(url);
            if (json == 0) {
                deleteAnimation(0, 59);
                return;
            } else {
                deleteAnimation(json.body.thumbnails.illust, 59);
            }

            const typeElement = `<li size="1" offset="0" class="sc-9y4be5-2 sc-9y4be5-3 sc-1wcj34s-1 kFAPOq JaPty addElement" data-page="${
                scrollPageCount + 1
            }" style="display: block; order: 3; margin: 12px; width: 184px">`;
            const typeClass = "gtm-followlatestpage-thumbnail-link";
            getIllustData(
                "follow",
                json.body.thumbnails.illust,
                typeElement,
                typeClass,
                target,
                borderOffset,
                false
            );
            mouseover();
        };
        (async () => {
            await fetchData();
            bookmarkAddDelete();
            changeURL(matches[2], matches[4], 59, 70);
        })();
    } else if (checkType == "tag") {
        // タグ検索
        // https://www.pixiv.net/ajax/search/artworks/*?word=*&order=date_d&mode=all&p=1&s_mode=s_tag_full&type=all
        // https://www.pixiv.net/tags/*/artworks?p=2
        const illustItems = document.querySelectorAll(".sc-l7cibp-2");
        if (illustItems.length < 60 && scrollPageCount == 1) {
            return;
        }

        // URL作成
        let offset;
        scrollPageCount++;
        let borderOffset;
        if ((matches[7] || matches[11]) && isValid) {
            if (matches[7] && scrollPageCount == 1) {
                saveScrollPageCount = Number(matches[7]);
            } else if (matches[11] && scrollPageCount == 1) {
                saveScrollPageCount = Number(matches[11]);
            }
            offset = saveScrollPageCount + scrollPageCount;
            borderOffset = scrollPageCount + saveScrollPageCount;
        } else {
            scrollPageCount == 1 ? (saveScrollPageCount = 0) : "";
            isValid = false;
            offset = 1 + scrollPageCount;
            borderOffset = scrollPageCount + 1;
        }

        if (scrollPageCount == 1) {
            revertURL(illustItems, 5, 0);
            loadAnimation(".sc-l7cibp-0 > .sc-1nr368f-4:first-child");
        }

        let setIllustType = "";
        let insertIllustType;
        if (matches[2] == "manga") {
            setIllustType = "type=manga";
            insertIllustType = "manga";
        } else if (matches[2] == "artworks") {
            setIllustType = "type=all";
            insertIllustType = "illustManga";
        } else if (matches[9] == "illust") {
            setIllustType = "type=illust";
            insertIllustType = "illust";
        } else if (matches[9] == "ugoira") {
            setIllustType = "type=ugoira";
            insertIllustType = "illust";
        } else if (matches[2] == "illustrations") {
            setIllustType = "type=illust_and_ugoira";
            insertIllustType = "illust";
        }

        let tagMatchMode = "";
        if (matches[8] == "s_mode=s_tag" || matches[8] == "s_mode=s_tc") {
            tagMatchMode = matches[8];
        } else {
            tagMatchMode = "s_mode=s_tag_full";
        }

        let setMode = "";
        if (matches[4] == "mode=safe" || matches[4] == "mode=r18") {
            setMode = matches[4];
        } else {
            setMode = "mode=all";
        }

        const sinceDate = matches[5] ? `&${matches[5]}` : "";
        const untilDate = matches[6] ? `&${matches[6]}` : "";
        const otherTag = matches[10] ? `&${matches[10]}` : "";
        const orderDate = matches[3] ? `order=${matches[3]}` : "order=date_d";

        const url = `https://www.pixiv.net/ajax/search/${matches[2]}/${matches[1]}?word=${matches[1]}&${orderDate}&${setMode}&p=${offset}&${tagMatchMode}&${setIllustType}${sinceDate}${untilDate}${otherTag}`;

        const fetchData = async () => {
            const json = await fetchResponse(url);
            if (json == 0) {
                deleteAnimation(0, 59);
                return;
            } else {
                deleteAnimation(json.body[insertIllustType].data, 59);
            }

            const typeElement = `<li class="sc-l7cibp-2 dhTDfw addElement" data-page="${
                scrollPageCount + 1
            }" style="display: block; margin: 0px; order: 1;">`;
            const target = ".sc-l7cibp-0 > .sc-1nr368f-4:first-child";
            getIllustData(
                "tag",
                json.body[insertIllustType].data,
                typeElement,
                "",
                target,
                borderOffset,
                true
            );
            mouseover();
        };
        (async () => {
            await fetchData();
            bookmarkAddDelete();
            changeURL(matches[7], matches[11], 5, 0);
        })();
    } else if (checkType == "artwork") {
        // ユーザープロフィールのイラスト
        // https://www.pixiv.net/ajax/user/*/illusts/tag?tag=*&offset=*&limit=48
        // https://www.pixiv.net/ajax/user/*/profile/all
        // https://www.pixiv.net/ajax/user/*/profile/illusts?ids[]=*&ids[]=*

        const illustItems = document.querySelectorAll(".sc-9y4be5-2");
        if (illustItems.length < 48 && scrollPageCount == 1) {
            return;
        }

        // https://www.pixiv.net/users/*/illustrations/風景
        // 上のURLのようにタグをつけた場合
        if (matches[3]) {
            // URL作成
            let offset;
            let borderOffset;
            if (matches[4] && isValid) {
                scrollPageCount == 0 ? (saveScrollPageCount = Number(matches[4])) : "";
                offset = Number(matches[4]) * 48 + scrollPageCount * 48;
                borderOffset = scrollPageCount + saveScrollPageCount + 1;
            } else {
                scrollPageCount == 0 ? (saveScrollPageCount = 0) : "";
                isValid = false;
                offset = 48 + scrollPageCount * 48;
                borderOffset = scrollPageCount + 2;
            }
            scrollPageCount++;

            if (scrollPageCount == 1) {
                revertURL(illustItems, 47, 50);
                loadAnimation("section.sc-jgyytr-0");
            }

            let tag = matches[3];
            let insertIllustType;
            if (matches[2] == "illustrations") {
                insertIllustType = "illusts";
            } else if (matches[2] == "manga") {
                insertIllustType = "manga";
            } else if (matches[2] == "artworks") {
                insertIllustType = "illustmanga";
            }
            const url = `https://www.pixiv.net/ajax/user/${matches[1]}/${insertIllustType}/tag?tag=${tag}&offset=${offset}&limit=48`;

            const fetchData = async () => {
                const json = await fetchResponse(url);
                if (json == 0) {
                    deleteAnimation(0, 47);
                    return;
                } else {
                    deleteAnimation(json.body.works, 47);
                }

                const typeElement = `<li size="1" offset="0" class="sc-9y4be5-2 sc-9y4be5-3 sc-1wcj34s-1 kFAPOq lSsnI addElement" data-page="${
                    scrollPageCount + 1
                }" style="display: block; margin: 12px; width: 184px order: 1;">`;
                const target = ".sc-9y4be5-0";
                getIllustData(
                    "artwork",
                    json.body.works,
                    typeElement,
                    "",
                    target,
                    borderOffset,
                    false
                );
                mouseover();
            };
            (async () => {
                await fetchData();
                bookmarkAddDelete();
                changeURL(matches[4], false, 47, 50);
            })();
        } else {
            // タグがない場合
            const url = `https://www.pixiv.net/ajax/user/${matches[1]}/profile/all`;

            const fetchData = async () => {
                // 初回のみillustIDをすべて取得
                if (!artworkIllustId) {
                    const json = await fetchResponse(url);
                    const objectIllustId = json.body.illusts;
                    const arrayIllustId = Object.keys(objectIllustId);
                    const objectMangaId = json.body.manga;
                    const arrayMangaId = Object.keys(objectMangaId);
                    // イラストとマンガの配列を組み合わせ、番号順に並べる
                    const arrayArtworks = arrayIllustId.concat(arrayMangaId);
                    arrayArtworks.sort((a, b) => a - b);

                    // 開いているページまでのillustIDを削除
                    function deleteIllustId(artworkIllustId) {
                        matches[4] ? artworkIllustId.splice(-96) : artworkIllustId.splice(-48);
                    }
                    if (matches[2] == "illustrations") {
                        artworkIllustId = arrayIllustId.map((item) => "ids[]=" + item);
                        deleteIllustId(artworkIllustId);
                    } else if (matches[2] == "manga") {
                        artworkIllustId = arrayMangaId.map((item) => "ids[]=" + item);
                        deleteIllustId(artworkIllustId);
                    } else {
                        artworkIllustId = arrayArtworks.map((item) => "ids[]=" + item);
                        deleteIllustId(artworkIllustId);
                    }
                }

                scrollPageCount++;
                let borderOffset;
                if (matches[4] && isValid) {
                    scrollPageCount == 1 ? (saveScrollPageCount = Number(matches[4])) : "";
                    borderOffset = scrollPageCount + saveScrollPageCount;
                } else {
                    borderOffset = scrollPageCount + 1;
                    if (scrollPageCount == 1) {
                        saveScrollPageCount = 0;
                        isValid = false;
                    }
                }

                if (scrollPageCount == 1) {
                    revertURL(illustItems, 47, 50);
                    loadAnimation("section.sc-jgyytr-0");
                }
                // 配列の後ろから48個取得して削除
                const sliceIllustId = artworkIllustId.splice(-48);

                const url2 = `https://www.pixiv.net/ajax/user/${
                    matches[1]
                }/profile/illusts?${sliceIllustId.join("&")}&work_category=illust&is_first_page=0`;

                const json2 = await fetchResponse(url2);
                if (json2 == 0) {
                    deleteAnimation(0, 47);
                    return;
                } else {
                    deleteAnimation(json2.body.works, 47);
                }
                // jsonファイルは先頭が古いイラストで、後ろが新しいイラスト
                // 後ろの新しいイラストからfor文を回して要素を追加していく必要があるので、reverseメソッドを使用
                const keys = Object.keys(json2.body.works).reverse();
                for (const key of keys) {
                    const illust = json2.body.works[key];
                    const illustId = illust.id;
                    const illustTitle = illust.title;
                    const illustUrl = illust.url;
                    const userId = illust.userId;
                    const userName = "";
                    const illustPageCount = illust.pageCount;
                    const illustBookmarkData = illust.bookmarkData;
                    const illustAlt = illust.alt;
                    const userProfileImage = "";
                    const typeElement = `<li size="1" offset="0" class="sc-9y4be5-2 sc-9y4be5-3 sc-1wcj34s-1 kFAPOq eLrjNK addElement" data-page="${
                        scrollPageCount + 1
                    }" style="display: block; margin: 12px; width: 187px order: 1;">`;
                    const typeClass = "";
                    const illustR18 = illust.tags[0];
                    const illustMaskReason = "";
                    createElement(
                        illustId,
                        illustTitle,
                        illustUrl,
                        userId,
                        userName,
                        illustPageCount,
                        illustBookmarkData,
                        illustAlt,
                        userProfileImage,
                        typeElement,
                        typeClass,
                        illustR18,
                        illustMaskReason
                    );
                }
                if (appendElements) {
                    if (showDividingLine) {
                        appendElements = `
                        <div class="addElement-parents" style="border-top: 1px solid; text-align: center; font-size: 20px; color: gray; margin: 30px 0 20px 0; user-select: none;">
                            ${borderOffset}
                        </div>
                        <ul class="sc-9y4be5-1 jtUPOE addElement-parents">${appendElements}</ul>`;
                    } else {
                        appendElements = `<ul class="sc-9y4be5-1 jtUPOE addElement-parents">${appendElements}</ul>`;
                    }
                    document
                        .querySelector(".sc-9y4be5-0")
                        .insertAdjacentHTML("beforeend", appendElements);
                }
                mouseover();
            };
            (async () => {
                await fetchData();
                bookmarkAddDelete();
                changeURL(matches[4], false, 47, 50);
            })();
        }
    }
}
// -----------------------------------------------------------------------------------------

// ページ数をURLに表示する--------------------------------------------------------------------
// 元からあるイラスト
function revertURL(illustItems, n, k) {
    // p=がついている場合はそのまま出力
    const pageAdded = location.href.includes("p=") ? location.href : false;
    for (let i = 0; i < illustItems.length; i++) {
        // n個ごとにIntersectionObserverを設置
        if (i % n == 0 && i != k) {
            illustItems[i].classList.add("pageCount");

            const options = { rootMargin: "-45% 0%" };
            const pageCountObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    let newUrl;
                    if (pageAdded) {
                        newUrl = pageAdded;
                    } else {
                        const url = location.href;
                        if (url.includes("?p=") && url.includes("&")) {
                            newUrl = url.replace(/p=\d+&/, "");
                        } else if (url.includes("?p=") && !url.includes("&")) {
                            newUrl = url.replace(/\?p=\d+/, "");
                        } else if (url.includes("&p=")) {
                            newUrl = url.replace(/&p=\d+/, "");
                        } else {
                            return url;
                        }
                    }
                    history.replaceState(null, null, newUrl);
                }
            }, options);
            pageCountObserver.observe(illustItems[i]);
        }
    }
}
// 追加されたイラスト
function changeURL(matches, matches2, n, k) {
    const pageCountElements = document.querySelectorAll(".addElement");
    for (let i = 0; i < pageCountElements.length; i++) {
        pageCountElements[i].classList.remove("addElement");
        // n個ごとにIntersectionObserverを設置
        if (i % n == 0 && i != k) {
            pageCountElements[i].classList.add("pageCount");

            const options = { rootMargin: "-45% 0%" };
            const pageCountObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    const pageCountNumber = pageCountElements[i].dataset.page;
                    let newUrl;
                    // 最初の実行がelse(p=がない)の場合は、isValidをfalseにしてelseのみ実行されるように
                    if ((matches || matches2) && isValid) {
                        const url = Number(saveScrollPageCount) + Number(pageCountNumber) - 1;
                        newUrl = currentUrl.replace(/(p=)[^&]+/, "$1" + url);
                    } else {
                        if (currentUrl.includes("p=")) {
                            const url = Number(saveScrollPageCount) + Number(pageCountNumber);
                            newUrl = currentUrl.replace(/(p=)[^&]+/, "$1" + url);
                        } else {
                            const separate = currentUrl.includes("?") ? "&" : "?";
                            newUrl = currentUrl + separate + "p=" + Number(pageCountNumber);
                        }
                    }
                    history.replaceState(null, null, newUrl);
                }
            }, options);
            pageCountObserver.observe(pageCountElements[i]);
        }
    }
}
// -----------------------------------------------------------------------------------------

// 新たに追加した要素でのブックマーク・フォロー機能---------------------------------------------
// x-csrf-tokenを取得
const getCsrfToken = async () => {
    const response = await fetch(location.origin);
    const data = await response.text();
    const matchToken = data.match(/"token":"([a-z0-9]+)"/);
    return matchToken[1];
};

// ブックマーク追加・削除
function bookmarkAddDelete() {
    const buttonGrandElements = document.querySelectorAll(".addBookmark");
    for (let i = 0; i < buttonGrandElements.length; i++) {
        const buttonElement = buttonGrandElements[i].querySelector("button.sc-kgq5hw-0");
        const svgElement = buttonGrandElements[i].querySelector("svg.sc-j89e3c-1");
        const getIdElement = buttonGrandElements[i].querySelector(
            "a.sc-d98f2c-0[data-gtm-user-id]"
        );
        const userId = getIdElement.getAttribute("data-gtm-user-id");
        const illustId = getIdElement.getAttribute("data-gtm-value");
        buttonGrandElements[i].classList.remove("addBookmark");

        buttonElement.addEventListener("click", () => {
            if (svgElement.classList.contains("dxYRhf")) {
                // ブックマーク追加
                (async () => {
                    try {
                        buttonElement.setAttribute("disabled", true);
                        const addBookmarkBody = {
                            illust_id: illustId,
                            restrict: 0,
                            comment: "",
                            tags: [],
                        };
                        const url = "https://www.pixiv.net/ajax/illusts/bookmarks/add";

                        const setCsrfToken = await getCsrfToken();
                        const response = await fetch(url, {
                            method: "post",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json; charset=utf-8",
                                "x-csrf-token": setCsrfToken,
                            },
                            body: JSON.stringify(addBookmarkBody),
                            credentials: "same-origin",
                        });
                        const json = await response.json();
                        // ストレージにBookmarkIDを保存
                        sessionStorage.illustId = json.body.last_bookmark_id;

                        if (!response.ok) {
                            throw new Error();
                        }

                        buttonElement.removeAttribute("disabled");
                        svgElement.style.color = "rgb(255, 64, 96)";
                        svgElement.style.fill = "currentcolor";
                        svgElement.classList.remove("dxYRhf");
                        svgElement.classList.add("bXjFLc");
                    } catch (error) {
                        console.error(error);
                        buttonElement.removeAttribute("disabled");
                    }
                })();
            } else if (svgElement.classList.contains("bXjFLc")) {
                // ブックマーク削除
                (async () => {
                    try {
                        buttonElement.setAttribute("disabled", true);

                        // BookmarkIDを取得する
                        const getStorageItem = sessionStorage.getItem(illustId);
                        sessionStorage.removeItem(illustId);
                        let bookmarkId;
                        if (getStorageItem) {
                            bookmarkId = getStorageItem;
                        } else {
                            // https://www.pixiv.net/ajax/user/*/illusts?ids[]=*
                            const illustInfoUrl = `https://www.pixiv.net/ajax/user/${userId}/illusts?ids[]=${illustId}`;
                            const illustInfoResponse = await fetch(illustInfoUrl);
                            const illustInfoJson = await illustInfoResponse.json();
                            bookmarkId = illustInfoJson.body[illustId].bookmarkData.id;
                        }

                        const deleteBookmarkBody = new URLSearchParams({
                            bookmark_id: bookmarkId,
                        });
                        const url = "https://www.pixiv.net/ajax/illusts/bookmarks/delete";

                        const setCsrfToken = await getCsrfToken();
                        const response = await fetch(url, {
                            method: "post",
                            headers: {
                                Accept: "application/json",
                                "x-csrf-token": setCsrfToken,
                            },
                            body: deleteBookmarkBody,
                            credentials: "same-origin",
                        });

                        if (!response.ok) {
                            throw new Error();
                        }

                        buttonElement.removeAttribute("disabled");
                        svgElement.removeAttribute("style");
                        svgElement.classList.remove("bXjFLc");
                        svgElement.classList.add("dxYRhf");
                    } catch (error) {
                        console.error(error);
                        buttonElement.removeAttribute("disabled");
                    }
                })();
            }
        });
    }
}

// フォロー・フォロー解除
function followAndUnfollow(setFollowLanguage) {
    const buttonElements = document.querySelectorAll(".follow");
    for (let i = 0; i < buttonElements.length; i++) {
        const buttonElement = buttonElements[i];
        const userId = buttonElement.getAttribute("data-gtm-user-id");
        buttonElement.classList.remove("follow");

        buttonElement.addEventListener("click", () => {
            if (buttonElement.classList.contains("fOWAlD")) {
                // フォローする
                (async () => {
                    try {
                        buttonElement.setAttribute("disabled", true);

                        const followBody = new URLSearchParams({
                            mode: "add",
                            type: "user",
                            user_id: userId,
                            tag: "",
                            restrict: 0,
                            format: "json",
                        });
                        const url = "https://www.pixiv.net/bookmark_add.php";

                        const setCsrfToken = await getCsrfToken();
                        const response = await fetch(url, {
                            method: "post",
                            headers: {
                                Accept: "application/json",
                                "x-csrf-token": setCsrfToken,
                            },
                            body: followBody,
                            credentials: "same-origin",
                        });

                        if (!response.ok) {
                            throw new Error();
                        }

                        buttonElement.removeAttribute("disabled");
                        buttonElement.classList.remove("fOWAlD");
                        buttonElement.classList.add("cnpwVx");
                        buttonElement.style.backgroundColor = "var(--charcoal-surface3)";
                        buttonElement.style.color = "var(--charcoal-text2)";
                        buttonElement.style.fontWeight = "bold";
                        buttonElement.style.padding = "0 24px";
                        buttonElement.style.borderRadius = "999999px";
                        buttonElement.style.height = "40px";
                        buttonElement.textContent = setFollowLanguage[0];
                    } catch (error) {
                        console.error(error);
                        buttonElement.removeAttribute("disabled");
                    }
                })();
            } else if (buttonElement.classList.contains("cnpwVx")) {
                // フォロー解除
                (async () => {
                    try {
                        buttonElement.setAttribute("disabled", true);

                        const unfollowBody = new URLSearchParams({
                            mode: "del",
                            type: "bookuser",
                            id: userId,
                        });
                        const url = "https://www.pixiv.net/rpc_group_setting.php";

                        const setCsrfToken = await getCsrfToken();
                        const response = await fetch(url, {
                            method: "post",
                            headers: {
                                Accept: "application/json",
                                "x-csrf-token": setCsrfToken,
                            },
                            body: unfollowBody,
                            credentials: "same-origin",
                        });

                        if (!response.ok) {
                            throw new Error();
                        }

                        buttonElement.removeAttribute("disabled");
                        buttonElement.classList.remove("cnpwVx");
                        buttonElement.classList.add("fOWAlD");
                        buttonElement.removeAttribute("style");
                        buttonElement.textContent = setFollowLanguage[1];
                    } catch (error) {
                        console.error(error);
                        buttonElement.removeAttribute("disabled");
                    }
                })();
            }
        });
    }
}
// -----------------------------------------------------------------------------------------

let isProcessed = false;
let saveScrollPageCount;
let isValid = true;
let currentUrl;
let saveUrl;
let scrollPageCount = 0;
let observerCount = 0;
let artworkIllustId = "";
const followingRegex =
    /https:\/\/www\.pixiv\.net(?:\/en)?\/users\/(\d+)\/following(?:\/([^?]+))?(?:\?p=(\d+))?(?:(?:&|\?)(rest=hide))?(?:\&p=(\d+))?/;
const bookmarkRegex =
    /https:\/\/www\.pixiv\.net(?:\/en)?\/users\/(\d+)\/bookmarks\/artworks(?:\/([^?]+))?(?:(?:&|\?)(rest=hide))?(?:(?:&|\?)p=(\d+))?/;
const followUserWorkRegex =
    /https:\/\/www\.pixiv\.net\/bookmark_new_illust(_r18)?\.php(?:\?p=(\d+))?(?:(?:&|\?)(tag=[^&]*))?(?:\&p=(\d+))?/;
const tagRegex =
    /https:\/\/www\.pixiv\.net(?:\/en)?\/tags\/(.+)\/(artworks|illustrations|manga)(?:\?order=([^&]+))?(?:(?:&|\?)(mode=(?:r18|safe)))?(?:(?:&|\?)(scd=\d{4}\-\d{2}-\d{2}))?(?:(?:&|\?)(ecd=\d{4}\-\d{2}-\d{2}))?(?:(?:&|\?)p=(\d+))?(?:(?:&|\?)(s_mode=(?:s_tag|s_tc)))?(?:(?:&|\?)type=([^&]+))?(?:(?:&|\?)([^p]+))?(?:(?:&|\?)p=(\d+))?/;
const artworkRegex =
    /https:\/\/www\.pixiv\.net(?:\/en)?\/users\/(\d+)\/(illustrations|manga|artworks)(?:\/(.[^?p=]+))?(?:\?p=(\d+))?/;

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (currentUrl && saveUrl) {
            // ページ数が含まれていないURLを作成
            // そのまま取得すると、?p=2の数字が変わった時に実行されてしまう
            function replaceURL(url) {
                if (url.includes("?p=") && url.includes("&")) {
                    return url.replace(/p=\d+&/, "");
                } else if (url.includes("?p=") && !url.includes("&")) {
                    return url.replace(/\?p=\d+/, "");
                } else if (url.includes("&p=")) {
                    return url.replace(/&p=\d+/, "");
                } else {
                    return url;
                }
            }

            // 現在のURLと初めに保存したURLが一致しない場合実行
            if (replaceURL(saveUrl) != replaceURL(location.href)) {
                isProcessed = false;
                scrollPageCount = 0;
                observerCount = 0;
                artworkIllustId = "";
                saveUrl = "";
                isValid = true;
                const loadAnimation = document.getElementById("load-animation");
                loadAnimation ? loadAnimation.remove() : "";
                // タグページ・プロフィールページで条件を変更した際に、追加した要素を削除する
                if (
                    tagRegex.test(location.href) ||
                    artworkRegex.test(location.href) ||
                    followUserWorkRegex.test(location.href)
                ) {
                    const removeElements = document.querySelectorAll(".addElement-parents");
                    for (const removeElement of removeElements) {
                        removeElement.remove();
                    }
                }
            }
        }

        if (followingRegex.test(location.href)) {
            addStyle();
            // フォロー
            currentUrl = location.href;
            // 初回のみURLを保存
            observerCount++;
            observerCount == 1 ? (saveUrl = location.href) : "";
            const intersectionTarget = document.querySelector(".sc-1y4z60g-4");

            if (intersectionTarget && !isProcessed) {
                isProcessed = true;
                const scrollObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            following_process();
                            isProcessed = false;
                            scrollObserver.unobserve(entry.target);
                        }
                    });
                });
                const observerElement = document.querySelector(
                    ".sc-1y4z60g-5:last-child"
                ).previousElementSibling;
                if (observerElement) {
                    if (scrollPageCount == 0 || scrollPageCount == 1) {
                        setTimeout(() => {
                            scrollObserver.observe(observerElement);
                        }, 400);
                    } else {
                        scrollObserver.observe(observerElement);
                    }
                }
            }
        } else if (
            bookmarkRegex.test(location.href) ||
            followUserWorkRegex.test(location.href) ||
            tagRegex.test(location.href) ||
            artworkRegex.test(location.href)
        ) {
            addStyle();
            // ブックマーク・フォローユーザーの作品・タグ検索・プロフィールページ
            currentUrl = location.href;
            // 初回のみURLを保存
            observerCount++;
            observerCount == 1 ? (saveUrl = location.href) : "";

            let checkType;
            let matches;
            if (bookmarkRegex.test(currentUrl)) {
                checkType = "bookmark";
                matches = currentUrl.match(bookmarkRegex);
            } else if (followUserWorkRegex.test(currentUrl)) {
                checkType = "follow";
                matches = currentUrl.match(followUserWorkRegex);
            } else if (tagRegex.test(currentUrl)) {
                checkType = "tag";
                matches = currentUrl.match(tagRegex);
            } else if (artworkRegex.test(currentUrl)) {
                checkType = "artwork";
                matches = currentUrl.match(artworkRegex);
            }

            let intersectionTarget;
            if (
                bookmarkRegex.test(currentUrl) ||
                followUserWorkRegex.test(currentUrl) ||
                artworkRegex.test(currentUrl)
            ) {
                intersectionTarget = document.querySelector(".sc-9y4be5-1");
            } else {
                intersectionTarget = document.querySelector(".sc-l7cibp-1 img");
            }

            if (intersectionTarget && !isProcessed) {
                isProcessed = true;
                const options = { rootMargin: "0px 0px 300px 0px" };
                const scrollObserver = new IntersectionObserver((entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            bookmarkAndTag_process(checkType, matches);
                            isProcessed = false;
                            scrollObserver.unobserve(entry.target);
                        }
                    });
                }, options);

                if (
                    bookmarkRegex.test(currentUrl) ||
                    followUserWorkRegex.test(currentUrl) ||
                    artworkRegex.test(currentUrl)
                ) {
                    // ブックマーク・フォローユーザーの作品・プロフィールページ
                    // ページ読み込み後すぐスクロールするとページが飛ばされることがあるので、遅延して読み込む
                    if (scrollPageCount == 0 || scrollPageCount == 1) {
                        setTimeout(() => {
                            scrollObserver.observe(
                                document.querySelector(
                                    ".sc-9y4be5-1:last-child > .sc-9y4be5-2:last-child"
                                )
                            );
                        }, 400);
                    } else {
                        scrollObserver.observe(
                            document.querySelector(
                                ".sc-9y4be5-1:last-child > .sc-9y4be5-2:last-child"
                            )
                        );
                    }
                } else {
                    // タグ検索
                    // 2ページ目と3ページ目が同時に読み込まれてしまうので、2ページ目もsetTimeoutを使用
                    if (scrollPageCount == 0 || scrollPageCount == 1) {
                        setTimeout(() => {
                            scrollObserver.observe(
                                document.querySelector(
                                    ".sc-l7cibp-1:last-child > .sc-l7cibp-2:last-child"
                                )
                            );
                        }, 400);
                    } else {
                        scrollObserver.observe(
                            document.querySelector(
                                ".sc-l7cibp-1:last-child > .sc-l7cibp-2:last-child"
                            )
                        );
                    }
                }
            }
        }
    });
});
const config = { childList: true, subtree: true };
observer.observe(document.querySelector("body"), config);

// 区切り線の表示設定
const browserLang = navigator.language;
let menuLang;
switch (browserLang) {
    case "ja":
        menuLang = "区切り線を表示：";
        break;
    default:
        menuLang = "Show dividing lines: ";
}

let menuText = showDividingLine ? `${menuLang}ON✔️` : `${menuLang}OFF❌`;
GM_registerMenuCommand(menuText, () => {
    if (showDividingLine) {
        GM_setValue("dividingLine", false);
    } else {
        GM_setValue("dividingLine", true);
    }
});
