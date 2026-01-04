// ==UserScript==
// @name        İnstagram ext
// @namespace   Violentmonkey Scripts
// @match       https://www.instagram.com/*
// @grant       none
// @version     1.5
// @grant       GM_addStyle
// @author      @mmnyldrm
// @description İnstagram yardımcı eklenti
// @downloadURL https://update.greasyfork.org/scripts/414050/%C4%B0nstagram%20ext.user.js
// @updateURL https://update.greasyfork.org/scripts/414050/%C4%B0nstagram%20ext.meta.js
// ==/UserScript==

GM_addStyle(`
      .menuHrefs {
          background-color: #fff;
          top: 60px;
          position: absolute;
          box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.116);
          padding: 20px 30px;
          border-radius: 10px;
          display: none;
          left: -75px;
          border: 1px solid #dfdfdf;
        width: 200px;
        }
      .menuHrefs > .link {
          padding: 8px 12px;
          font-weight: 500;
          font-size: 15px;
          display: flex;
          align-items: center;
          flex-direction: row;
          margin: 0px -15px;
          border-radius: 4px;
          margin-bottom: 4px;
          cursor: pointer;
      }
      .menuHrefs > .link:hover {
          background-color: #eeeeee;
      }
      .menuHrefs > .link > span {
        margin-left: 10px;
        color: #50505a;
      }
      .defBTN {
        padding: 0px;
        background-color: transparent;
        border-width: 0;
        margin: 0px;
      }
      .menuHrefs > .link.active {
        background-color: #5f7beb21;
      }
      .menuHrefs > .link.active:hover {
        background-color: #5f7beb3a;
      }
      .user_profile {
        display: flex;
      }
      .user_profile > img {
        width: 30px;
        height: 30px;
        border-radius: 100%;
        border: 2px solid #dddddd;
      }
      .user_name_username > .welcome {
        font-size: 14px;
        color: #5e5e5e;
      }
      .user_name_username > .name {
        font-weight: 600;
        font-size: 16px;
      }
      .line_head {
        font-weight: 700;
        font-size: 13px;
        color: #a3a4aa;
        letter-spacing: 1px;
        margin-bottom: 12px;
      }
      .success_btn  {
        background-color: #5feb8e21;
        color: #087e1c !important;
      }
      .success_btn:hover {
        background-color: #5feb8e5e !important;
      }
      .s_span {
        color: #087e1c !important;
      }
      .ftayfur {
        margin-left: 10px;
        position: relative;
      }
    .unfollow_area {
      width: 100%;
      background-color: #ffffff;
      box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.116);
      border: 1px solid #dfdfdf;
      padding: 20px 30px;
      margin-bottom: 40px;
      border-radius: 5px;
    }
    .total_list {
      font-size: 15px;
      font-weight: 500;
      display: flex;
    flex-direction: row;
    }
    .total_list > span {
      font-weight: 700;
      font-size: 18px;
      margin-bottom: 10px;
    }
    .flexbtn {
      margin-bottom: 10px;
      display: flex;
      flex-direction: row;
    }
    .flexbtn > button {
      border-width: 0;
      background-color: #3aad73;
      padding: 10px 20px;
      border-radius: 5px;
      font-weight: 500;
      cursor: pointer;
      color: #fff;
      margin-right: 10px;
    }
    .flexbtn > button:first-child {
      background-color: #4679d8;
    }
    #unfollowliststop {
      background-color: #ad5a3a;
    }
    .log {
      max-height: 200px;
      overflow-y: auto;
    }
    .item {
      font-family: "Inter", sans-serif;
      display: flex;
      flex-direction: row;
    }
    .successItem {
      margin-right: 5px;
      color: #087e1c;
    }
    .item > b {
      margin-right: 5px;
    }
    .modal {
      width: 100%;
      height: 100vh;
      position: absolute;
      top: 0;
      background-color: #616161b8;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 222222222222;
    }
    .settings {
      width: 400px;
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 4px;
    }
    .settings > header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      font-size: 18px;
      padding: 10px 20px;
      border-bottom: 1px solid #eeeeee;
    }
    .settings > header > button {
      border-width: 0;
      background-color: #dddddd63;
      padding: 7px 7px;
      display: flex;
      flex-direction: row;
      align-items: center;
      border-radius: 4px;
    }
    .settings > header > button:hover {
      background-color: #ddddddc0;
      cursor: pointer;
    }
    .menu_set {
      padding: 10px 20px;
    }
    .menu_set > h4 {
      font-size: 16px;
      font-weight: 600;
      margin: 0px;
      margin-bottom: 5px !important;
    }
    .menu_set > p {
      font-size: 13px;
      margin-top: 0px;
      margin-bottom: 10px;
    }
    .menu_set > input {
      width: calc(100% - 30px);
      border: 1px solid #dddddd;
      padding: 10px 15px;
      outline: none;
      border-radius: 4px;
    }
    .settings > .save {
      width: calc(100% - 40px);
      background-color: #5f68eb;
      color: #fff;
      margin: 10px 20px;
      padding: 10px 0px;
      border-radius: 5px;
      border-width: 0;
      cursor: pointer;
    }
    .settings > .save:hover {
      background-color: #4c56e4;
    }
    .success_modal {
      text-align: center;
      width: calc(100% - 40px);
      margin: 0px 20px;
      margin-bottom: 10px;
      padding: 10px 0px;
      background-color: #15b86c23;
      color: #127245;
      border-radius: 5px;
    }
    #ucount, #yucount {
      margin-left: 15px;
    }
`);

const URL_USER_INFO = "https://www.instagram.com/*/?__a=1";
const URL_HOME = "https://www.instagram.com/";
const URL_UNFOLLOW =
  "https://www.instagram.com/web/friendships/*/unfollow/";
const URL_FOLLOW =
  "https://www.instagram.com/web/friendships/*/follow/";
const URL_LIKE = "https://www.instagram.com/web/likes/*/like/";

let currentUrl = document.location.href;
let otherUserName;
let userId;
let actionTime =
  parseInt(localStorage.getItem("hiz_saniye")) || 3000;
const _cookies = document.cookie.split(";");
const _csrftoken = _cookies
  .find((item) => item.includes("csrftoken"))
  .replace(" csrftoken=", "");
const _userId = _cookies
  .find((item) => item.includes("ds_user_id"))
  .replace(" ds_user_id=", "");
const success_color = "#087e1c";
const inActiveColor = "#bbbcc1";
const successClass = "success_btn";
let unfollow_list = new Array();
let like_list = new Array();
let follow_list = new Array();
let unfollowCursor = 0;
let followCursor = 0;
let likeCursor = 0;
let valueChange = actionTime;

const likeIsSuccess = (successVal, failVal) => {
  const url = "https://www.instagram.com/";
  if (currentUrl === url) {
    return successVal;
  }
  return failVal;
};

let free = [];
let unfollow_count = 0;
let follow_count = 0;
let like_count = 0;
const successMessage =
  '<div class="item"><span class="successItem">Başarılı - </span> <b>*/name*/ </b> */message*/</div>';
const errorMessage =
  '<div class="item"><span class="errItem">Hata - </span> <b>*/type*/ </b> */message*/</div>';

const openOrCloseMenu = () => {
  const menuList = document.getElementById("menu_list");
  const isShow = menuList.dataset.show === "true";
  const styleMenu = menuList.style;
  if (isShow) {
    styleMenu.display = "none";
    menuList.setAttribute("data-show", "false");
  } else {
    styleMenu.display = "block";
    menuList.setAttribute("data-show", "true");
  }
};

const setMenu = () => {
  const className = document.getElementsByClassName("_47KiJ");
  const createElementDiv = document.createElement("div");
  createElementDiv.className = "ftayfur";
  createElementDiv.innerHTML = `<div class="ftayfur"><a id="menu_btn" class="_0ZPOP kIKUG ">
        <svg class="_8-yf5 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" width="22" height="22">
            <path fill="none" d="M0 0h24v24H0z"/>
            <path d="M3 4h18v2H3V4zm0 7h12v2H3v-2zm0 7h18v2H3v-2z"/>
        </svg>
    </a>
      <div data-show="false" id="menu_list" class="menuHrefs">
        <h4 class="line_head">İşlemler</h4>
        <div id="follow_btn" class="link ">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path fill="${inActiveColor}" d="M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm5.793 8.914l3.535-3.535 1.415 1.414-4.95 4.95-3.536-3.536 1.415-1.414 2.12 2.121z"/>
            </svg>
            <span>Takip</span>
        </div>
        <div id="unfollow_btn" class="link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path fill="#bbbcc1" d="M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm7 6.586l2.121-2.122 1.415 1.415L20.414 19l2.122 2.121-1.415 1.415L19 20.414l-2.121 2.122-1.415-1.415L17.586 19l-2.122-2.121 1.415-1.415L19 17.586z"/>
            </svg>
            <span>Unfollow</span>
        </div>
        <div id="like_btn" class="link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path fill="${inActiveColor}" d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2zm-3.566 15.604c.881-.556 1.676-1.109 2.42-1.701C18.335 14.533 20 11.943 20 9c0-2.36-1.537-4-3.5-4-1.076 0-2.24.57-3.086 1.414L12 7.828l-1.414-1.414C9.74 5.57 8.576 5 7.5 5 5.56 5 4 6.656 4 9c0 2.944 1.666 5.533 4.645 7.903.745.592 1.54 1.145 2.421 1.7.299.189.595.37.934.572.339-.202.635-.383.934-.571z"/>
            </svg>
            <span>Like</span>
        </div>
        <div id="setting_btn" class="link success_btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path fill="${success_color}" d="M3.34 17a10.018 10.018 0 0 1-.978-2.326 3 3 0 0 0 .002-5.347A9.99 9.99 0 0 1 4.865 4.99a3 3 0 0 0 4.631-2.674 9.99 9.99 0 0 1 5.007.002 3 3 0 0 0 4.632 2.672c.579.59 1.093 1.261 1.525 2.01.433.749.757 1.53.978 2.326a3 3 0 0 0-.002 5.347 9.99 9.99 0 0 1-2.501 4.337 3 3 0 0 0-4.631 2.674 9.99 9.99 0 0 1-5.007-.002 3 3 0 0 0-4.632-2.672A10.018 10.018 0 0 1 3.34 17zm5.66.196a4.993 4.993 0 0 1 2.25 2.77c.499.047 1 .048 1.499.001A4.993 4.993 0 0 1 15 17.197a4.993 4.993 0 0 1 3.525-.565c.29-.408.54-.843.748-1.298A4.993 4.993 0 0 1 18 12c0-1.26.47-2.437 1.273-3.334a8.126 8.126 0 0 0-.75-1.298A4.993 4.993 0 0 1 15 6.804a4.993 4.993 0 0 1-2.25-2.77c-.499-.047-1-.048-1.499-.001A4.993 4.993 0 0 1 9 6.803a4.993 4.993 0 0 1-3.525.565 7.99 7.99 0 0 0-.748 1.298A4.993 4.993 0 0 1 6 12c0 1.26-.47 2.437-1.273 3.334a8.126 8.126 0 0 0 .75 1.298A4.993 4.993 0 0 1 9 17.196zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
            </svg>
            <span class="s_span">Ayarlar</span>
        </div>
      </div>
    </div>`;

  if (className) {
    for (var i = 0; i < className.length; i++) {
      className[i].appendChild(createElementDiv);
    }
  }

  if (document.getElementById("menu_btn")) {
    document
      .getElementById("menu_btn")
      .addEventListener("click", (event) => {
        openOrCloseMenu();
      });
  }

  if (document.getElementById("setting_btn")) {
    document
      .getElementById("setting_btn")
      .addEventListener("click", (event) => {
        openOrCloseMenu();
        const mainReactArea = document.getElementById(
          "react-root",
        );
        const createUnModalDiv = document.createElement("div");
        createUnModalDiv.className = "modal";
        createUnModalDiv.setAttribute("id", "modal_close");
        createUnModalDiv.innerHTML = `
          <div id="setNoti" class="settings">
            <header>
              Ayarlar
              <button id="close_set">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path fill="#818181" d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"/>
                </svg>
              </button>
            </header>
            <div class="menu_set">
              <h4>İşlem hızı</h4>
              <p>Saniye başına yapılacak işlem hızı <b>Mili saniye cinsinden</b></p>
              <input id="change_second" type="number" value="${actionTime}" placeholder="3 ( saniye ) * 1000 ( milisaniye ) = 3000" />
            </div>
            <button id="save_set" class="save">Kayıt et</button>
          </div>`;

        if (mainReactArea) {
          mainReactArea.appendChild(createUnModalDiv);
        }

        if (document.getElementById("close_set")) {
          document
            .getElementById("close_set")
            .addEventListener("click", () => {
              document.getElementById("modal_close").remove();
            });
        }

        if (document.getElementById("save_set")) {
          document
            .getElementById("save_set")
            .addEventListener("click", (e) => {
              const mainMArea = document.getElementById(
                "setNoti",
              );
              const createUnSuccessDiv = document.createElement(
                "div",
              );
              createUnSuccessDiv.className = "success_modal";
              createUnSuccessDiv.setAttribute(
                "id",
                "successMessage",
              );

              const newTime = parseInt(
                document.getElementById("change_second").value,
              );
              actionTime = newTime;
              localStorage.setItem("hiz_saniye", newTime);
              createUnSuccessDiv.innerHTML += "Kayıt başarılı";

              if (mainMArea) {
                mainMArea.appendChild(createUnSuccessDiv);
              }
              setTimeout(
                () =>
                  document
                    .getElementById("successMessage")
                    .remove(),
                3000,
              );
            });
        }
      });
  }

  if (document.getElementById("like_btn")) {
    document
      .getElementById("like_btn")
      .addEventListener("click", (event) => {
        openOrCloseMenu();
        const mainArea = document.getElementsByClassName(
          "cGcGK",
        );
        const createUnfollowDiv = document.createElement("div");
        createUnfollowDiv.innerHTML = `
            <div class="unfollow_area">
              <div class="flexbtn">
                <button id="unfollowlistadd">LİSTE EKLE</button>
                <button id="unfollowliststop">DURDUR</button>
                <button id="unf_go">BAŞLAT</button>
              </div>
              <div class="total_list">toplam like listesi: <span id="ucount">${like_list.length}</span></div>
              <div class="total_list">toplam like edilen post: <span id="yucount">${like_count}</span></div>
              <div id="log_unf" class="log"></div>
            </div>`;

        if (mainArea) {
          mainArea[0].insertBefore(
            createUnfollowDiv,
            mainArea[0].childNodes[0],
          );
        }
        if (document.getElementById("unfollowlistadd")) {
          const setLikeList = () => {
            fetch(
              `https://www.instagram.com/graphql/query/?query_hash=e3ae866f8b31b11595884f0c509f3ec5&variables={"cached_feed_item_ids":[],"fetch_media_item_count":12,"fetch_comment_count":4,"fetch_like":3,"has_stories":false,"has_threaded_comments":true ${
                likeCursor
                  ? ',"fetch_media_item_cursor": "' +
                    likeCursor +
                    '"'
                  : ""
              }}`,
            )
              .then((responseJson) => responseJson.json())
              .then((responseJson) => {
                const newList =
                  responseJson.data.user.edge_web_feed_timeline
                    .edges;
                if (
                  likeCursor !== null &&
                  like_list.length <= 80
                ) {
                  like_list = like_list.concat(newList);
                  likeCursor =
                    responseJson.data.user.edge_web_feed_timeline
                      .page_info.end_cursor;
                }
              });

            setTimeout(
              () =>
                (document.getElementById("ucount").innerHTML =
                  like_list.length),
              500,
            );
          };

          document
            .getElementById("unfollowlistadd")
            .addEventListener("click", (event) => {
              var myVar = setInterval(setLikeList, 1000);
              document
                .getElementById("unfollowliststop")
                .addEventListener("click", (event) => {
                  clearInterval(myVar);
                });
            });
          document
            .getElementById("unf_go")
            .addEventListener("click", (event) => {
              like_list.map((item, index) =>
                setTimeout(
                  () => ActionLike(item),
                  actionTime * (index + 1),
                ),
              );
            });
        }
      });
  }

  if (document.getElementById("follow_btn")) {
    document
      .getElementById("follow_btn")
      .addEventListener("click", (event) => {
        openOrCloseMenu();
        const mainArea = document.getElementsByClassName(
          "v9tJq",
        );
        const createUnfollowDiv = document.createElement("div");
        createUnfollowDiv.innerHTML = `
          <div class="unfollow_area">
            <div class="flexbtn">
              <button id="unfollowlistadd">LİSTE EKLE</button>
              <button id="unfollowliststop">DURDUR</button>
              <button id="unf_go">BAŞLAT</button>
            </div>
            <div class="total_list">toplam takip listesi: <span id="ucount">${unfollow_list.length}</span></div>
            <div class="total_list">toplam takip edilen kullanıcı: <span id="yucount">${unfollow_count}</span></div>
            <div id="log_unf" class="log"></div>
          </div>`;

        if (mainArea) {
          mainArea[0].insertBefore(
            createUnfollowDiv,
            mainArea[0].childNodes[0],
          );
        }

        if (document.getElementById("unfollowlistadd")) {
          const setfollowList = () => {
            fetch(
              `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables={"id":${userId},"include_reel":true,"fetch_mutual":false,"first":20 ${
                followCursor
                  ? ',"after": "' + followCursor + '"'
                  : ""
              }}`,
            )
              .then((responseJson) => responseJson.json())
              .then((responseJson) => {
                const newList =
                  responseJson.data.user.edge_followed_by.edges;
                newList.map((item) => {
                  fetch(
                    URL_USER_INFO.replace(
                      "*",
                      item.node.username,
                    ),
                  )
                    .then((responseJson) => responseJson.json())
                    .then((responseJson) => {
                      const takip_ediliyor =
                        responseJson.graphql.user
                          .followed_by_viewer;
                      const istek_gonderildi =
                        responseJson.graphql.user
                          .requested_by_viewer;
                      if (!takip_ediliyor && !istek_gonderildi) {
                        free.push(item);
                      }
                    });
                });
                if (followCursor !== null) {
                  followCursor =
                    responseJson.data.user.edge_followed_by
                      .page_info.end_cursor;
                }
              });
            if (follow_list.length <= 80) {
              follow_list = follow_list.concat(free);
            }
            setTimeout(
              () =>
                (document.getElementById("ucount").innerHTML =
                  follow_list.length),
              500,
            );
            free = [];
          };

          document
            .getElementById("unfollowlistadd")
            .addEventListener("click", (event) => {
              var myVar = setInterval(setfollowList, 1000);
              document
                .getElementById("unfollowliststop")
                .addEventListener("click", (event) => {
                  clearInterval(myVar);
                });
            });
          document
            .getElementById("unf_go")
            .addEventListener("click", (event) => {
              follow_list.map((item, index) =>
                setTimeout(
                  () => ActionFollow(item),
                  actionTime * (index + 1),
                ),
              );
            });
        }
      });
  }

  if (document.getElementById("unfollow_btn")) {
    document
      .getElementById("unfollow_btn")
      .addEventListener("click", (event) => {
        openOrCloseMenu();
        const mainArea = document.getElementsByClassName(
          "v9tJq",
        );
        const createUnfollowDiv = document.createElement("div");
        createUnfollowDiv.innerHTML = `
            <div class="unfollow_area">
              <div class="flexbtn">
                <button id="unfollowlistadd">LİSTE EKLE</button>
                <button id="unfollowliststop">DURDUR</button>
                <button id="unf_go">BAŞLAT</button>
              </div>
              <div class="total_list">toplam unfollow listesi: <span id="ucount">${unfollow_list.length}</span></div>
              <div class="total_list">toplam unfollow edilen kullanıcı: <span id="yucount">${unfollow_count}</span></div>
              <div id="log_unf" class="log"></div>
            </div>`;

        if (mainArea) {
          mainArea[0].insertBefore(
            createUnfollowDiv,
            mainArea[0].childNodes[0],
          );
        }

        if (document.getElementById("unfollowlistadd")) {
          const setUnfollowList = () => {
            fetch(
              `https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables={"id":${userId},"include_reel":true,"fetch_mutual":false,"first":20 ${
                unfollowCursor
                  ? ',"after": "' + unfollowCursor + '"'
                  : ""
              }}`,
            )
              .then((responseJson) => responseJson.json())
              .then((responseJson) => {
                const newList =
                  responseJson.data.user.edge_follow.edges;
                if (
                  unfollowCursor !== null &&
                  unfollow_list.length <= 80
                ) {
                  unfollow_list = unfollow_list.concat(newList);
                  unfollowCursor =
                    responseJson.data.user.edge_follow.page_info
                      .end_cursor;
                }
              });
            setTimeout(
              () =>
                (document.getElementById("ucount").innerHTML =
                  unfollow_list.length),
              500,
            );
          };

          document
            .getElementById("unfollowlistadd")
            .addEventListener("click", (event) => {
              var myVar = setInterval(setUnfollowList, 1000);
              document
                .getElementById("unfollowliststop")
                .addEventListener("click", (event) => {
                  clearInterval(myVar);
                });
            });
          document
            .getElementById("unf_go")
            .addEventListener("click", (event) => {
              unfollow_list.map((item, index) =>
                setTimeout(
                  () => ActionUnfollow(item),
                  actionTime * (index + 1),
                ),
              );
            });
        }
      });
  }
};

const ActionUnfollow = (item) => {
  fetch(URL_UNFOLLOW.replace("*", item.node.id), {
    method: "POST",
    headers: {
     "x-csrftoken": _csrftoken,
      "x-instagram-ajax": 1,
      "x-requested-with": "XMLHttpRequest"
    },
  })
    .then((responseJson) => responseJson.json())
    .then((responseJson) => {
      const status = responseJson.status === "ok";
      if (status) {
        unfollow_count++;
        document.getElementById(
          "yucount",
        ).innerHTML = unfollow_count;
        document.getElementById(
          "log_unf",
        ).innerHTML += successMessage
          .replace("*/name*/", item.node.username)
          .replace("*/message*/", "Unfollow edildi");
      } else {
        document.getElementById(
          "log_unf",
        ).innerHTML += errorMessage
          .replace("*/type*/", "Limit")
          .replace("*/message*/", "aşımı");
      }
    })
    .catch((err) => {
      if (err) {
        document.getElementById(
          "log_unf",
        ).innerHTML += errorMessage
          .replace("*/type*/", "Limit")
          .replace("*/message*/", "aşımı");
      }
    });
};

const ActionLike = (item) => {
  fetch(URL_LIKE.replace("*", item.node.id), {
    method: "POST",
    headers: {
      "x-csrftoken": _csrftoken,
      "x-instagram-ajax": 1,
      "x-requested-with": "XMLHttpRequest"
    },
  })
    .then((responseJson) => responseJson.json())
    .then((responseJson) => {
      const status = responseJson.status === "ok";
      if (status) {
        like_count++;
        document.getElementById(
          "yucount",
        ).innerHTML = like_count;
        document.getElementById(
          "log_unf",
        ).innerHTML += successMessage
          .replace("*/name*/", item.node.id)
          .replace("*/message*/", "Beğenildi");
      } else {
        document.getElementById(
          "log_unf",
        ).innerHTML += errorMessage
          .replace("*/type*/", "Limit")
          .replace("*/message*/", "aşımı");
      }
    })
    .catch((err) => {
      if (err) {
        document.getElementById(
          "log_unf",
        ).innerHTML += errorMessage
          .replace("*/type*/", "Limit")
          .replace("*/message*/", "aşımı");
      }
    });
};

const ActionFollow = (item) => {
  fetch(URL_FOLLOW.replace("*", item.node.id), {
    method: "POST",
    headers: {
      "x-csrftoken": _csrftoken,
      "x-instagram-ajax": 1,
      "x-requested-with": "XMLHttpRequest"
    },
  })
    .then((responseJson) => responseJson.json())
    .then((responseJson) => {
      follow_count++;
      document.getElementById(
        "yucount",
      ).innerHTML = follow_count;
      if (responseJson.result === "requested") {
        document.getElementById(
          "log_unf",
        ).innerHTML += successMessage
          .replace("*/name*/", item.node.username)
          .replace("*/message*/", "İstek gönderildi");
      } else {
        document.getElementById(
          "log_unf",
        ).innerHTML += successMessage
          .replace("*/name*/", item.node.username)
          .replace("*/message*/", "Takip edildi");
      }
    })
    .catch((err) => {
      if (err) {
        document.getElementById(
          "log_unf",
        ).innerHTML += errorMessage
          .replace("*/type*/", "Limit")
          .replace("*/message*/", "aşımı");
      }
    });
};

window.onload = () => {
  setMenu();

  let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      const btnMenu = document.getElementById("menu_btn");
      if (currentUrl != document.location.href && !btnMenu) {
        /* Changed ! your code here */
        currentUrl = document.location.href;
        setMenu();
      } else {
        if (!btnMenu) {
          setMenu();
        }
      }
      if (currentUrl !== URL_HOME) {
        let nowUserName = document.getElementsByClassName(
          "_7UhW9",
        )[0].innerText;
        if (
          otherUserName !== nowUserName &&
          nowUserName !== "Başlarken"
        ) {
          otherUserName = document.getElementsByClassName(
            "_7UhW9",
          )[0].innerText;
          fetch(URL_USER_INFO.replace("*", otherUserName))
            .then((responseJson) => responseJson.json())
            .then((responseJson) => {
              userId = responseJson.graphql.user.id;
            });
        }
      }
    });
  });

  var bodyList = document.querySelector("body");
  var config = {
    childList: true,
    subtree: true,
  };

  observer.observe(bodyList, config);
};
