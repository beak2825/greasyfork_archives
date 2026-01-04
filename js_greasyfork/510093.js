// ==UserScript==
// @name         知乎收藏移动工具
// @namespace    http://tampermonkey.net/
// @version      2024-09-25
// @description  支持网页版移动回答所属收藏夹,暂不支持文章和想法
// @author       wzj042
// @match        https://www.zhihu.com/collection/*
// @icon         https://picx.zhimg.com/v2-abed1a8c04700ba7d72b45195223e0ff_l.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510093/%E7%9F%A5%E4%B9%8E%E6%94%B6%E8%97%8F%E7%A7%BB%E5%8A%A8%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/510093/%E7%9F%A5%E4%B9%8E%E6%94%B6%E8%97%8F%E7%A7%BB%E5%8A%A8%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  "use strict";
  function injectSelfModal() {
    const modalHtml = `
      <div class="Modal-wrapper undefined Modal-enter-done">
      <div class="Modal-backdrop"></div>
      <div class="Modal Modal--large FavlistsModal" tabindex="0">
        <div class="Modal-inner">
          <h3 class="Modal-title">移动收藏</h3>
          <div class="Modal-subtitle">请选择你想移动到的收藏夹</div>
          <div class="Modal-content">
            <div class="Favlists-content">
              <div class="Favlists-items" role="list">
                
                <div role="listitem"></div>
              </div>
              
            </div>
          </div>
        </div>
        <button
          aria-label="关闭"
          type="button"
          class="Button Modal-closeButton Button--plain"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            class="Zi Zi--Close Modal-closeIcon"
            fill="currentColor"
          >
            <path
              d="M5.619 4.381A.875.875 0 1 0 4.38 5.62L10.763 12 4.38 18.381A.875.875 0 1 0 5.62 19.62L12 13.237l6.381 6.382a.875.875 0 1 0 1.238-1.238L13.237 12l6.382-6.381A.875.875 0 0 0 18.38 4.38L12 10.763 5.619 4.38Z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
    `;
    const modal = document.createElement("div");
    modal.id = "collectionMoveModal";
    modal.style.display = "none";
    modal.innerHTML = modalHtml;
    document.querySelector(".App-main").appendChild(modal);
    document.querySelector(".Modal-backdrop").onclick = function () {
      hideModal();
    };
    document.querySelector(".Modal-closeButton").onclick = function () {
      hideModal();
    };

    console.log("inject modal");
  }
  function hideModal() {
    document.getElementById("collectionMoveModal").style.display = "none";
  }
  function switchCollection(req) {
    const { collectionId, answerId, isFavorited, effectUI } = req;
    const { itemCount, itemBtn } = effectUI;
    // const api = ;
    if (isFavorited) {
      fetch(`/api/v4/collections/${collectionId}/contents/${answerId}?content_id=${answerId}&content_type=answer`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          itemCount.innerText = parseInt(itemCount.innerText) - 1 + " 条内容";
          itemBtn.innerText = "收藏";
          itemBtn.className = "Button Favlists-updateButton Button--blue";
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      fetch(`/api/v4/collections/${collectionId}/contents?content_id=${answerId}&content_type=answer`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          itemCount.innerText = parseInt(itemCount.innerText) + 1 + " 条内容";
          itemBtn.innerText = "已收藏";
          itemBtn.className = "Button Favlists-updateButton Button--grey";
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }
  function openModal(node) {
    const modal = document.getElementById("collectionMoveModal");
    const favList = modal.querySelector(".Favlists-items");
    favList.innerHTML = "";
    fetch(
      `/api/v4/collections/contents/answer/${getNodeAnswerID(
        node
      )}?offset=0&limit=5`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        data.data.forEach((collection) => {
          const lockIcon = `<span style="display: inline-flex; align-items: center">${
            collection.is_public
              ? ""
              : '<svg width="16"  height="16" viewBox="0 0 24 24" class="Zi Zi--Lock Favlists-itemIcon"  fill="currentColor" ><path d="M3.5 11.6A1.6 1.6 0 0 1 5.1 10h2.166c0-.177-.003-.377-.007-.594-.02-1.105-.048-2.662.35-3.996.246-.823.67-1.63 1.405-2.227.743-.603 1.73-.933 2.986-.933 1.256 0 2.243.33 2.986.933.735.598 1.159 1.404 1.405 2.227.398 1.334.37 2.891.35 3.996-.004.217-.008.417-.008.594H18.9a1.6 1.6 0 0 1 1.6 1.6v7.8a1.6 1.6 0 0 1-1.6 1.6H5.1a1.6 1.6 0 0 1-1.6-1.6v-7.8ZM9 14.75a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5H9ZM8.759 9.3c.004.242.007.476.007.7h6.467c0-.182.003-.37.006-.565l.002-.135c.017-1.112.037-2.375-.287-3.46-.19-.636-.482-1.142-.914-1.492-.424-.345-1.055-.598-2.04-.598-.985 0-1.616.253-2.04.598-.432.35-.724.856-.914 1.492-.324 1.085-.304 2.348-.287 3.46Z" clip-rule="evenodd"></path></svg></span>'
          }`;
          const favlistItem = `
      <div class="Favlists-item">
        <div class="Favlists-itemInner">
          <div class="Favlists-itemName">
            <span class="Favlists-itemNameText">${collection.title}</span>
            ${lockIcon}
          </div>
          <div class="Favlists-itemContent">${
            collection.item_count
          } 条内容</div>
        </div>
        <button type="button" class="Button Favlists-updateButton ${
          collection.is_favorited ? "Button--grey" : "Button--blue"
        }">
          ${collection.is_favorited ? "已收藏" : "收藏"}
        </button>
      </div>`;
          const favItem = document.createElement("div");
          favItem.innerHTML = favlistItem;
          const itemCount = favItem.querySelector(".Favlists-itemContent");
          const itemBtn = favItem.querySelector(".Favlists-updateButton");
          itemBtn.onclick = function () {
            // switch UI effect

            switchCollection({
              collectionId: collection.id,
              answerId: getNodeAnswerID(node),
              isFavorited: collection.is_favorited,
              effectUI: {
                itemCount,
                itemBtn,
              },
            });
            console.log(collection.id);
            console.log(getNodeAnswerID(node));
          };
          favList.appendChild(favItem);
        });
      })
      .catch((err) => {
        console.error(err);
      });
    modal.style.display = "block";
  }
  setTimeout(() => {
    const style = document.createElement("style");
    style.innerHTML = `
        .Popover.ShareMenu.ContentItem-action,
         button[aria-live='polite'],
        .Popover.ContentItem-action{
            display: none;
        }`;
    document.head.appendChild(style);
    injectSelfModal();
  }, 1000);
  function getUserId() {
    const userToken = document.querySelector("div[data-zop-usertoken]");
    if (userToken) {
      const token = userToken.getAttribute("data-zop-usertoken");
      return JSON.parse(token).urlToken;
    }
    return "";
  }
  function getNodeAnswerID(node) {
    const answer = node.querySelector(".ContentItem");
    if (answer) {
      return answer.getAttribute("name");
    }
    return "";
  }
 

  // 为每个取消收藏后注入移动收藏按钮
  const content = document.querySelector(".ListShortcut");
  // 监听收藏按钮被添加，用MutationObserver

  let observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node.className.contains("jsNavigable")) {
            const collectionBtn = node.querySelector(
              ".CollectionDetailPageItem-smartCollectionButton"
            );
            const iconSpan = document.querySelector(
              ".Popover.ShareMenu.ContentItem-action span"
            );
            const moveBtn = document.createElement("button");
            moveBtn.className =
              "Button CollectionDetailPageItem-moveCollectionButton FEfUrdfMIKpQDJDqkjte Button--plain Button--withIcon Button--withLabel fEPKGkUK5jyc4fUuT0QP B46v1Ak6Gj5sL2JTS4PY RuuQ6TOh2cRzJr6WlyQp";
            moveBtn.style = "margin-left: 24px;";
            moveBtn.innerHTML = `<span style="display: inline-flex; align-items: center;">${iconSpan.innerHTML}</span>移动到收藏夹`;

            collectionBtn.parentNode.appendChild(moveBtn);

            moveBtn.onclick = function () {
              openModal(node);
            };
          }
        });
      }
    });
  });
  observer.observe(content, {
    subtree: true,
    childList: true,
  });
})();
