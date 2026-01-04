// ==UserScript==
// @name        dアニメストアPlus
// @namespace   https://github.com/chimaha/dAnimePlus
// @match       https://animestore.docomo.ne.jp/animestore/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @version     1.9.3
// @author      chimaha
// @description dアニメストアに様々な機能を追加します
// @license     MIT license
// @icon        https://animestore.docomo.ne.jp/favicon.ico
// @compatible  firefox
// @compatible  chrome
// @supportURL  https://github.com/chimaha/dAnimePlus/issues
// @downloadURL https://update.greasyfork.org/scripts/471042/d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/471042/d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2Plus.meta.js
// ==/UserScript==

/*! dアニメストアPlus | MIT license | https://github.com/chimaha/dAnimePlus/blob/main/LICENSE */

/*!
 *dアニメストア便利化 (https://greasyfork.org/ja/scripts/414008)
 *Copyright (c) 2020 家守カホウ
 *Released under the MIT license.
 *see https://opensource.org/licenses/MIT
 */

"use strict";

// 解像度表示 + 制作年度表示------------------------------------------------------------------
let qualityCount = 0;

function addResolutionStyle() {
  if (document.getElementById("resolution-style")) {
    return;
  }
  document.head.insertAdjacentHTML("beforeend", '<style id="resolution-style"></style>');
  document.head.lastElementChild.textContent = `
		.quality,
		.production-year {
			position: absolute;
			top: 3px;
			border-radius: 4px;
			padding: 0.5px 4px;
			background-color: rgba(255,255,255,0.8);
			text-decoration: none !important;
		}
		.quality {
			left: 3px;
		}
		.production-year {
			right: 3px;
		}
		.quality > span,
		.production-year > span {
			font-size: 11px;
			font-weight: bold;
			text-decoration: none !important;
		}`;
}

function sort(workids, json) {
  const sorted = [];
  const yearSorted = [];
  for (const workid of workids) {
    const item = json.find((res) => res["id"] == workid);
    sorted.push(item["distribution"]["quality"]);
    yearSorted.push(item["details"]["production_year"]);
  }
  return [sorted, yearSorted];
}

function resolutionBranch(div, quality) {
  switch (quality) {
    case "fhd":
      div("1080p");
      break;
    case "hd":
      div("720p");
      break;
    default:
      div("480p");
  }
}

function qualityAndYear(torf) {
  addResolutionStyle();
  const playerMypage = document.querySelectorAll(".thumbnailContainer > a");
  if (playerMypage.length == 0) {
    return;
  }

  let workIds = [];
  for (let i = 0; i < playerMypage.length; i++) {
    const workId = new URL(document.querySelectorAll(".textContainer[href]")[i]).searchParams.get(
      "workId"
    );
    workIds.push(workId);
  }
  workIds = workIds.slice(qualityCount);
  const fetchAsync = async () => {
    const url =
      "https://animestore.docomo.ne.jp/animestore/rest/v1/works?work_id=" + workIds.join(",");
    const response = await fetch(url);
    const json = await response.json();
    const [sorted, yearSorted] = sort(workIds, json);

    for (let i = 0; i < sorted.length; i++) {
      const quality = sorted[i];
      const year = yearSorted[i];

      function div(quality) {
        let headerquality = "";
        if (torf) {
          if (resolutionbool) {
            headerquality += `
                            <div class="quality">
						    	<span>${quality}</span>
						    </div>
                        `;
          }

          if (addProductionYear) {
            headerquality += `
                            <div class="production-year">
						    	<span>${year}年</span>
						    </div>
                        `;
          }
        } else {
          headerquality = `
						<div class="quality">
							<span>${quality}</span>
						</div>`;
        }
        playerMypage[i + qualityCount].insertAdjacentHTML("beforeend", headerquality);
      }

      resolutionBranch(div, quality);
    }

    qualityCount = qualityCount + sorted.length;
  };

  fetchAsync();
}
// -----------------------------------------------------------------------------------------

// サムネイルとテキストをクリックすると新規タブで開く + mouseover -------------------------------
function addHoverStyle() {
  if (!document.getElementById("mouseover-style")) {
    document.head.insertAdjacentHTML("beforeend", '<style id="mouseover-style"></style>');
    document.head.lastElementChild.textContent = `
			.textContainer:hover {
				cursor: pointer;
			}
			.itemModuleIn:hover .textContainer {
				text-decoration: underline;
			}
			.itemModuleIn:hover .thumbnailContainer > a > .imgWrap16x9 {
				opacity : .6;
			}`;
  }
}

function thumbnailclick() {
  const playerMypage = document.querySelectorAll(".thumbnailContainer > a");
  if (playerMypage.length == 0) {
    return;
  }

  for (let i = 0; i < playerMypage.length; i++) {
    playerMypage[i].removeAttribute("onclick");
    const getHref = document.querySelectorAll(".textContainer[href]")[i];
    const urlGet = new URL(getHref.getAttribute("href"));
    const partId = urlGet.searchParams.get("partId");
    const openUrl = "https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=" + partId;
    // サムネイルとテキストをクリックすると新規タブで開く
    playerMypage[i].addEventListener("click", () => {
      open(openUrl);
    });
    getHref.addEventListener("click", () => {
      open(openUrl);
    });
  }
  const getHref = document.querySelectorAll(".textContainer[href]");
  for (let i = 0; i < getHref.length; i++) {
    getHref[i].removeAttribute("href");
  }
  addHoverStyle();
}
// -----------------------------------------------------------------------------------------

// 検索結果で常に順番の選択肢を表示
function showOrder() {
  document.head.insertAdjacentHTML("beforeend", '<style id="show-order"></style>');
  document.head.lastElementChild.textContent = `
		.minict_wrapper > span {
			display: none;
		}
		.minict_wrapper > ul {
			display: flex !important;
			border: none;
			border-top: none;
			box-shadow: none;
			width: max-content;
			background: none;
			top: -20px;
			right: -10px;
			opacity: 1 !important;
			user-select: none;
		}
		.minict_wrapper > ul > li {
			padding: 20px 30px;
			border-bottom: none;
		}`;
}

function restCount() {
  const observer = new MutationObserver(() => {
    qualityCount = 0;
  });
  const config = { childList: true };
  observer.observe(document.querySelector(".listHeader > p.headerText"), config);
}

// 解像度を表示選択
let resolutionbool = GM_getValue("menu", true);
let addProductionYear = GM_getValue("addProductionYear", false);
let titlebool = GM_getValue("seekbarTitle", true);
let hideDetailBool = GM_getValue("hideDetail", false);

const path = window.location.pathname.replace("/animestore/", "");
if (path == "mpa_fav_pc" || path == "mpa_hst_pc") {
  // 気になる、視聴履歴
  if (resolutionbool) {
    qualityAndYear(false);
  }
  thumbnailclick();
} else if (path == "mp_viw_pc") {
  // 続きから見る
  const playerMypage = document.querySelectorAll(".thumbnailContainer > a");
  for (let i = 0; i < playerMypage.length; i++) {
    const workId = new URL(
      document.querySelectorAll(".textContainer")[i].getAttribute("href")
    ).searchParams.get("workId");

    // header作成
    const hrefLink = "https://animestore.docomo.ne.jp/animestore/ci_pc?workId=" + workId;
    const title = document.querySelectorAll(".textContainer h2.line1 > span")[i].textContent;
    const id1 = workId.slice(0, 2);
    const id2 = workId.slice(2, 4);
    const id3 = workId.slice(4, 5);
    const imgId =
      "https://cs1.animestore.docomo.ne.jp/anime_kv/img/" +
      id1 +
      "/" +
      id2 +
      "/" +
      id3 +
      "/" +
      workId +
      "_1_3.png";

    const header = `
			<header class="">
				<a href="${hrefLink}">
					<p class="line2"><span class="ui-clamp webkit2LineClamp">${title}</span></p>
					<div class="titleThumbnail">
						<div class="titleThumbnailIn">
							<i class="icon "></i>
							<div class="imgWrap16x9">
								<img class=" verticallyLong lazyloaded" src="${imgId}" alt="パッケージ画像" width="640" height="360">
							</div>
						</div>
					</div>
				</a>
			</header>`;

    document.querySelectorAll(".itemModule > section")[i].insertAdjacentHTML("afterbegin", header);
  }

  if (resolutionbool) {
    qualityAndYear(false);
  }

  thumbnailclick();
} else if (path == "tp_pc") {
  // トップページ
  // 「現在放送中のアニメ」リンク先変更
  let eventStop = false;
  let addOpen = false;
  const observer = new MutationObserver(() => {
    // リンク先変更
    const itemLists = document.querySelectorAll(".itemWrapper > .p-slider__item > a.c-slide");
    if (itemLists.length == 0) {
      return;
    }
    for (const itemList of itemLists) {
      const workId = new URL(itemList.getAttribute("href")).searchParams.get("workId");
      const url = "https://animestore.docomo.ne.jp/animestore/ci_pc?workId=" + workId;
      itemList.setAttribute("href", `${url}`);
    }

    // 新規ウィンドウで開くeventを無効化
    const playerImg = document.querySelectorAll(".thumbnailContainer > a > .imgWrap16x9")[0];
    if (!eventStop && playerImg) {
      playerImg.addEventListener("click", (e) => {
        e.stopPropagation();
      });
      document
        .querySelector(".thumbnailContainer > a > .progress")
        .addEventListener("click", (e) => {
          e.stopPropagation();
        });
      eventStop = true;
      // アイコンのeventが削除できないので、imgWrap16x9の子に移動する
      const iconPlay = document.querySelector(".thumbnailContainer > a > i");
      iconPlay ? playerImg.appendChild(iconPlay) : "";

      // サムネイルをクリックすると新規タブで開く
      const openUrl =
        "https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=" +
        document.querySelector(".thumbnailContainer > a").getAttribute("data-partid");
      if (!addOpen) {
        document.querySelector(".pageHeader").addEventListener("click", () => {
          open(openUrl);
        });
        // 画像をホバーしても、上のでは動かないので
        playerImg.addEventListener("click", () => {
          open(openUrl);
        });
        addOpen = true;
      }
    }

    // タイトルwidth、ホバー
    if (!document.getElementById("mouseover-style")) {
      document.head.insertAdjacentHTML("beforeend", '<style id="mouseover-style"></style>');
      document.head.lastElementChild.textContent = `
				@media screen and (min-width: 960px) {
					.pageHeader .subTitle {
						margin: 5px 0 0 5px !important;
						width: 100% !important;
					}
					.pageHeader .information,
					.pageHeader .thumbnailContainer {
						float: none !important;
					}
					.pageHeader .pageHeaderIn {
						display: flex !important;
						width: fit-content !important;
					}
					.pageHeader .information {
						max-width: 693px;
						width: fit-content !important;
						margin-left: 15px;
					}
				}
				.pageHeader .btnResume {
					display: none;
				}
				.pageHeader .thumbnailContainer {
					order: 0;
					margin-left: 0 !important;
				}
				.pageHeader .information {
					order: 1;
				}
				.pageHeader .title {
					width: 100% !important;
				}
				.pageHeader .subTitle > p {
					width: 100%;
					transform: none !important;
					transition: none !important;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.pageHeader:hover {
					cursor: pointer;
				}
				.pageHeader:hover :is(.title, .subTitle > p) {
					text-decoration: underline;
				}
				.pageHeader:hover .imgWrap16x9 {
					opacity : .6;
				}`;
    }

    if (resolutionbool) {
      addResolutionStyle();
      const playerSlider = document.querySelectorAll(
        '.p-slider__item:not(.add-resolution,.isBlack,[data-link^="/animestore/series?seriesId="]) > div > input[data-workid]'
      );
      if (playerSlider.length == 0) {
        return;
      }
      const insertTarget = document.querySelectorAll(
        `.p-slider__item:not(.add-resolution,.isBlack,[data-link^="/animestore/series?seriesId="]) > a.c-slide > .isAnime:not(.isOnAir)`
      );
      const addClassTarget = document.querySelectorAll(
        '.p-slider__item:not(.add-resolution,.isBlack,[data-link^="/animestore/series?seriesId="]):has(> div > input[data-workid])'
      );

      let workIds = [];
      for (let i = 0; i < playerSlider.length; i++) {
        const workId = playerSlider[i].getAttribute("data-workid");
        addClassTarget[i].classList.add("add-resolution");
        workIds.push(workId);
      }

      const fetchAsync = async () => {
        const url =
          "https://animestore.docomo.ne.jp/animestore/rest/v1/works?work_id=" + workIds.join(",");
        const response = await fetch(url);
        const json = await response.json();
        const [sorted, yearSorted] = sort(workIds, json);

        for (let i = 0; i < sorted.length; i++) {
          const quality = sorted[i];
          function div(quality) {
            insertTarget[i].insertAdjacentHTML(
              "afterend",
              `<div class="quality"><span>${quality}</span></div>`
            );
          }
          resolutionBranch(div, quality);
        }
      };
      fetchAsync();
    }
  });
  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
  setTimeout(function () {
    observer.disconnect();
  }, 2000);
} else if (path == "ci_pc") {
  // 作品ページ
  const playerImges = document.querySelectorAll("section.clearfix > a");

  for (const playerImg of playerImges) {
    const openUrl =
      "https://animestore.docomo.ne.jp/animestore/sc_d_pc" +
      playerImg.getAttribute("href").slice(5);
    // 詳しく見るを開かずに、タブで動画を開く
    playerImg.addEventListener("click", () => {
      open(openUrl);
    });
    playerImg.style.cursor = "pointer";
    playerImg.removeAttribute("href");
  }
} else if (path == "sc_d_pc") {
  // 再生画面
  const video = document.querySelector("video");

  const observerTarget = document.querySelector(".backInfoTxt1");
  const observer = new MutationObserver(() => {
    // 再生ウィンドウ名をアニメ名に変更
    const animeTitle = observerTarget.textContent;
    document.title = animeTitle;

    // シークバーにタイトルと話数を表示
    const episode = document.querySelector(".backInfoTxt2").textContent;

    // 保存した音量に変更
    const getVolume = GM_getValue("volume");
    video.volume = getVolume ? getVolume : "";

    let addElement;
    if (document.getElementById("volumeText") == undefined) {
      addElement = `
			<div id="volumeText" style="display: table; position: relative; width: 25px; right: 5px;">
			    <span style="display: table-cell; color: #a0a09f; font-weight: 600; vertical-align: middle;">
                    ${Math.round(video.volume * 100)}
                </span>
			</div>
        `;
    }

    if (titlebool && document.getElementById("title") == undefined) {
      addElement += `
            <div id="title" style="display: table; margin-left: 20px;">
                <span style="display: table-cell; color: #a0a09f; font-weight: 700; vertical-align: middle;">
                    ${animeTitle} ${episode}
                </span>    
            </div>
        `;
    } else if (titlebool) {
      document.querySelector("#title>span").textContent = `${animeTitle} ${episode}`;
    }

    addElement &&
      document.querySelector(".buttonArea > .volume").insertAdjacentHTML("afterend", addElement);
  });
  const config = { childList: true };
  observer.observe(observerTarget, config);
  observer.disconnect;

  // マウスホイールで音量変更
  window.addEventListener("wheel", (e) => {
    const wheelDelta = Math.sign(e.deltaY);
    let volume = video.volume;
    if (wheelDelta === 1) {
      volume -= 0.02;
    } else if (wheelDelta === -1) {
      volume += 0.02;
    }
    volume = Math.max(0, Math.min(volume, 1));
    video.volume = volume;

    GM_setValue("volume", volume);
    const span = `
            <span style="display: table-cell; color: #a0a09f; font-weight: 600; vertical-align: middle;">
                ${Math.round(video.volume * 100)}
            </span>
        `;

    document.querySelector("#volumeText").innerHTML = span;
  });

  // 音量バーを操作した場合
  let isDragging = false;
  document.querySelector("#volumePopupIn").addEventListener("mousedown", (e) => {
    isDragging = true;
  });
  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
  document.addEventListener("mousemove", () => {
    if (isDragging) {
      GM_setValue("volume", video.volume);
      document.querySelector("#volumeText > span").textContent = Math.round(video.volume * 100);
    }
  });

  // 上下キーで音量変更した場合
  document.addEventListener("keyup", (e) => {
    if (e.key == "ArrowDown" || e.key == "ArrowUp") {
      document.querySelector("#volumeText > span").textContent = Math.round(video.volume * 100);
    }
  });

  // マウスホイールで動画の再生位置を移動
  window.addEventListener("wheel", (e) => {
    const video = document.querySelector("video");
    const wheelDelta = Math.sign(e.deltaX);
    const skipTime = 10;

    if (wheelDelta === 1) {
      video.currentTime -= skipTime;
    } else if (wheelDelta === -1) {
      video.currentTime += skipTime;
    }
  });
} else if (
  path == "sch_pc" ||
  path == "gen_pc" ||
  path == "c_all_pc" ||
  path == "series_pc" ||
  path == "tag_pc"
) {
  // 検索結果、シリーズ、ランキング

  showOrder();
  restCount();
  addHoverStyle();

  // 解像度表示
  if (resolutionbool || addProductionYear) {
    const observer2 = new MutationObserver(() => {
      qualityAndYear(true);
    });
    const config = { childList: true };
    observer2.observe(document.querySelector("#listContainer"), config);
  }
} else if (path == "mpa_cmp_pc") {
  // コンプリート
  // 解像度表示
  if (resolutionbool) {
    qualityAndYear(false);
  }
} else if (path == "CF/mylist_detail" || path == "mpa_shr_pc") {
  // リスト
  // 解像度表示
  if (resolutionbool) {
    const observer = new MutationObserver(() => {
      addResolutionStyle();
      if (document.querySelectorAll(".p-mylistItemList__item > a > .quality")[0]) {
        return;
      }
      const playerMypage = document.querySelectorAll(".p-mylistItemList__item > a");
      let workIds = [];
      for (let i = 0; i < playerMypage.length; i++) {
        const workId = new URL(playerMypage[i].getAttribute("href")).searchParams.get("workId");
        workIds.push(workId);
      }
      const fetchAsync = async () => {
        const url =
          "https://animestore.docomo.ne.jp/animestore/rest/v1/works?work_id=" + workIds.join(",");
        const response = await fetch(url);
        const json = await response.json();
        const [sorted, yearSorted] = sort(workIds, json);

        for (let i = 0; i < sorted.length; i++) {
          const quality = sorted[i];
          function div(quality) {
            const headerquality = `
							<div class="quality">
								<span>${quality}</span>
							</div>`;
            playerMypage[i].insertAdjacentHTML("beforeend", headerquality);
          }
          resolutionBranch(div, quality);
        }
      };
      fetchAsync();
    });
    const config = { childList: true, subtree: true };
    observer.observe(document.querySelector(".p-mylistItemList"), config);
    setTimeout(function () {
      observer.disconnect();
    }, 2000);
  }
}

// 詳しく見るを非表示
if (!hideDetailBool) {
  document.head.insertAdjacentHTML("beforeend", '<style id="hide-detail"></style>');
  document.head.lastElementChild.textContent = `
		.itemModule > section > .detail {
			display: none;
		}`;
}

// 解像度を表示設定
let resolutionText = resolutionbool ? "解像度を表示：ON✔️" : "解像度を表示：OFF❌";
GM_registerMenuCommand(resolutionText, () => {
  if (resolutionbool) {
    GM_setValue("menu", false);
  } else {
    GM_setValue("menu", true);
  }
});

let productionYearText = addProductionYear ? "制作年を表示：ON✔️" : "制作年を表示：OFF❌";
GM_registerMenuCommand(productionYearText, () => {
  if (addProductionYear) {
    GM_setValue("addProductionYear", false);
  } else {
    GM_setValue("addProductionYear", true);
  }
});

// シークバーにタイトルと音量を表示設定
let titleText = titlebool
  ? "シークバーにタイトルを表示：ON✔️"
  : "シークバーにタイトルを表示：OFF❌";
GM_registerMenuCommand(titleText, () => {
  if (titlebool) {
    const showTitle = false;
    GM_setValue("seekbarTitle", showTitle);
  } else {
    const showTitle = true;
    GM_setValue("seekbarTitle", showTitle);
  }
});

// 詳しく見るを非表示
let hideDetailText = hideDetailBool ? "詳しく見るを表示：ON✔️" : "詳しく見るを表示：OFF❌";
GM_registerMenuCommand(hideDetailText, () => {
  if (hideDetailBool) {
    GM_setValue("hideDetail", false);
  } else {
    GM_setValue("hideDetail", true);
  }
});
