// ==UserScript==
// @name        Anilist - Block Forum Users
// @namespace   Violentmonkey Scripts
// @match       https://anilist.co/*
// @grant       none
// @version     1.0
// @license     GPL-3.0-or-later
// @author      KanashiiDev
// @description Simple userscript/extension for AniList that block users in forum.
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/481801/Anilist%20-%20Block%20Forum%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/481801/Anilist%20-%20Block%20Forum%20Users.meta.js
// ==/UserScript==

//Element HasOwnProperty
function hasOwn(e, t) {
  return Object.hasOwn ? Object.hasOwn(e, t) : Object.prototype.hasOwnProperty.call(e, t);
}

//Create Element Function
function create(e, t, n) {
  if (!e) throw new SyntaxError("'tag' not defined");
  var r,
    i,
    f = document.createElement(e);
  if (t)
    for (r in t)
      if ("style" === r) for (i in t.style) f.style[i] = t.style[i];
      else t[r] && f.setAttribute(r, t[r]);
  return n && (f.innerHTML = n), f;
}

//CSS
var styles = `
.blockuser {
  opacity:0;cursor:pointer
}
.comment:hover .actions .blockuser {
  opacity:1
}
.ForumblockItem{
  cursor:pointer;
  display: inline-block;
  margin-top: 15px
}
.ForumblockDiv{
  border-top: solid 1px rgba(var(--color-text-lighter),.4);
  margin-top: 80px;
  padding-top: 30px;
  margin-bottom: 30px
}
.ForumBlockItemDiv {
  display: grid;
  grid-template-columns: 1fr 90px;
  align-items: center
}
`;

//Add CSS
var styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

//Variables
var mainarray = [];
var oldHref = document.location.href;
let blocklistuserarray = window.localStorage.getItem("forumblocked");

//if list not null split blocked users
if (blocklistuserarray !== null) {
  let x = blocklistuserarray.split(/[.,!,?]/);
  mainarray = x;
}

//Block User Button Function
function addSavetoBlockList() {
  var blocklistSave = false;
  let BlockListCollection = document.querySelectorAll(".comment .actions");
  BlockListCollection.forEach(function (blocklist) {
    if (!hasOwn(blocklist, "blocklistSave")) {
      blocklist.blocklistSave = true;
      let blocklistSave = create(
        "a",
        {
          class: "blockuser",
          id: "blockuser",
        },
        "<b>Block User</b>"
      );
      blocklistSave.onclick = function () {
        let el = blocklistSave;
        let id = el.parentElement.parentElement.innerText.split("\n")[0];
        el.click();
        el.click();
        el.onclick = () => {
          let blocklistuserarray = window.localStorage.getItem("forumblocked");
          if (blocklistuserarray !== null) {
            let x = blocklistuserarray.split(/[.,!,?]/);
            for (let i in x) {
              if (x[i] == id) {
                x.splice(i, 1);
                break;
              }
            }
            mainarray = x;
          }
          for (let i = 0; i <= mainarray.length; i++) {
            if (id === mainarray[i]) {
              return;
            }
            el.lastElementChild.innerText = "Blocked!";
          }
          mainarray.push(id);
          localStorage.setItem("forumblocked", [mainarray]);
        };
      };
      if (blocklist.closest(".comment-wrap")) {
        blocklist.prepend(blocklistSave);
      }
    }
  });
  if(blocklistuserarray !== null){
    checkblock();
  }
}

//Check if user blocked and remove user's comments
function checkblock() {
  let coms = document.querySelectorAll(".comment-wrap .comment");
  if (!coms) {
    setTimeout(checkblock, 100);
    return;
  }
  for (let x = 0; x < coms.length; x++) {
    for (let i = 0; i <= mainarray.length; i++) {
      if (coms[x].children[0].innerText.split("\n")[0] === mainarray[i]) {
        coms[x].parentElement.parentElement.remove();
      }
    }
  }
}

//Get Blocked Users Function
function getblockedlist() {
  let to = document.querySelector(".section.delete-account");
  if (!to) {
    setTimeout(getblockedlist, 200);
    return;
  }
  let ForumblockDiv = create(
    "div",
    {
      class: "ForumblockDiv",
    },
    "<h2>" + "Blocked Forum Users" + "</h2>"
  );
  to.insertAdjacentElement("afterend", ForumblockDiv);
  mainarray.forEach((item) => {
    let itemCon = create("div", {
      class: "ForumBlockItemDiv",
    });
    let itemDiv = create("a", {
      class: "ForumblockItem",
      id: item,
      href: "https://anilist.co/user/" + item,
    });
    let itemDivRemove = create(
      "div",
      {
        class: "button danger",
        id: item,
      },
      "Unblock"
    );
    itemDiv.innerText = item;
    itemDivRemove.onclick = () => {
      removeuser(itemDivRemove.id);
      itemCon.remove();
    };
    itemCon.append(itemDiv, itemDivRemove);
    ForumblockDiv.append(itemCon);
  });
}

//Remove Blocked User Function
function removeuser(id) {
  if (mainarray.length == 1) {
    mainarray = [];
  }
  let blocklistuserarray = window.localStorage.getItem("forumblocked");
  let x = blocklistuserarray.split(/[.,!,?]/);
  for (let i in x) {
    if (x[i] == id) {
      x.splice(i, 1);
      break;
    }
  }
  localStorage.setItem("forumblocked", [x]);
}

//Add Block User Button
var target = document.querySelector("body");
var observer = new MutationObserver(function (mutationsList, observer) {
  for (var mutation of mutationsList) {
    if (/^\/forum\/(thread)\/?([\w-]+)?\/.*?$/.test(location.pathname) &&
      mutation.addedNodes[0] &&
      mutation.addedNodes[0].classList &&
      mutation.addedNodes[0].classList[0] === "comment-wrap"
    ) {
      addSavetoBlockList();
    }

    if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
      if (oldHref != document.location.href) {
        oldHref = document.location.href;
        if (/^\/settings\/(account)\/?([\w-]+)?\/?$/.test(location.pathname)) {
          getblockedlist();
        }
      }
    }
  }
});
observer.observe(target, {
  childList: true,
  subtree: true,
});
