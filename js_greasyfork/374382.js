// ==UserScript==
// @name         barchive image and quote fixer
// @namespace    thebarchive
// @version      0.9
// @description  replaces thumbnails with full image or webm on click, inlines "quoted by" posts on click, can also remove posts, tessellate inlined posts, tessellate entire thread, and expand/collapse all 'quoted by' posts, can color posts recursively downward or entire thread (helps keep track of deeply-embedded conversations), can hide all extra options on posts (to make them smaller/simpler) via toggle in OP, can change media size when expanded, can drag posts around via toggle and reset
// @author       DUVish
// @match        https://thebarchive.com/b/thread/*
// @match        https://archived.moe/*/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374382/barchive%20image%20and%20quote%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/374382/barchive%20image%20and%20quote%20fixer.meta.js
// ==/UserScript==

$(".thread_image_link").on("click", function(e) {
  e.preventDefault();
});

Array.from($(".post_data")).forEach(el => {
    el.innerHTML += `<span class="expandAllQuotes collapsible" style="font-size: 10px;position: relative;top: -2px;padding-left: 1px;color: #7fa5c6;opacity: 0.95;padding-right: 0px;" title="Expand all 'quoted by' posts">[↓]</span>`;
});

Array.from($(".post_data")).forEach(el => {
    el.innerHTML += `<span class="collapseAllQuotes collapsible" style="font-size: 10px;position: relative;top: -2px;padding-left: 3px;color: #7fa5c6;opacity: 0.95;padding-right: 6px;" title="Collapse all 'quoted by' posts">[↑]</span>`;
});

Array.from($(".post_data")).forEach(el => {
    el.innerHTML += '<span class="tessellatePost collapsible" style="font-size: 10px;position: relative;top: -2px;padding-left: 4px;color: #7fa5c6;opacity: 0.95;padding-right: 13px;">[Tessellate]</span>';
});

document.querySelector(".post_data").innerHTML += '<span class="tessellateThread" style="font-size: 10px;position: relative;top: -2px;padding-left: 2px;color: #7fa5c6;opacity: 0.95;padding-right: 11px;">[Tessellate Thread]</span>';

document.querySelector(".post_data").innerHTML += '<span class="colorPosts" style="font-size: 10px;position: relative;top: -2px;padding-left: 2px;color: #7fa5c6;opacity: 0.95;padding-right: 11px;" title="Color all posts in thread">[<span class="colorOn">Color Posts</span> | <span class="colorOff">Off</span>]</span>';

Array.from($(".post_data")).forEach((el, i) => {
    if (i === 0) return;
    el.innerHTML += '<span class="colorPosts collapsible" style="font-size: 10px;position: relative;top: -2px;padding-left: 0px;color: #7fa5c6;opacity: 0.95;padding-right: 8px;right:2px" title="Color all posts in thread">[<span class="colorPostOn">Color Posts</span> | <span class="colorPostOff">Off</span>]</span>';
});

Array.from($(".post_data")).forEach(el => {
    el.children[8].children[0].style.paddingLeft = "0px";
    el.children[8].children[0].style.marginLeft = "-3px";
    el.innerHTML += '<span class="postRemove collapsible" style="font-size: 9.5px;position: relative;top: -2px;padding-left: 3px;color: darkgrey;opacity: 0.45;">Remove</span>';
});

Array.from(document.querySelectorAll(".text")).forEach(el => el.innerHTML += '<span class="inlinedQuotesContainer"></span>');

setTimeout(function() {document.querySelector(".colorOn").addEventListener("click", function(e) {
  Array.from(document.getElementsByClassName("post_wrapper")).forEach(el => {el.style.backgroundColor = `rgb(${Math.random() < 0.5 ? 40 - Math.floor(Math.random() * 16) : 40 + Math.floor(Math.random() * 16)}, ${Math.random() < 0.5 ? 42 - Math.floor(Math.random() * 16) : 42 + Math.floor(Math.random() * 16)}, ${Math.random() < 0.5 ? 46 - Math.floor(Math.random() * 16) : 46 + Math.floor(Math.random() * 16)})`;});
});}, 1800);

setTimeout(function() {document.querySelector(".colorOff").addEventListener("click", function(e) {
  Array.from(document.getElementsByClassName("post_wrapper")).forEach(el => {el.style.backgroundColor = `#282a2e`;});
});}, 1800);

$(".colorPostOn").on("click", function(e) {
  Array.from(e.target.parentNode.parentNode.parentNode.parentNode.querySelectorAll(".post_wrapper")).forEach(el => {el.style.backgroundColor = `rgb(${Math.random() < 0.5 ? 40 - Math.floor(Math.random() * 16) : 40 + Math.floor(Math.random() * 16)}, ${Math.random() < 0.5 ? 42 - Math.floor(Math.random() * 16) : 42 + Math.floor(Math.random() * 16)}, ${Math.random() < 0.5 ? 46 - Math.floor(Math.random() * 16) : 46 + Math.floor(Math.random() * 16)})`;});
});

$(".colorPostOff").on("click", function(e) {
  Array.from(e.target.parentNode.parentNode.parentNode.parentNode.querySelectorAll(".post_wrapper")).forEach(el => {el.style.backgroundColor = `#282a2e`;});
});

$(".postRemove").on("click", function(e) {
    postRemove(e, this);
});

$(".backlink").on("click", function(e) {
    inOnClickFunc(e, this);
});

function postRemove(e, node) {
    let possibleThread = node.parentNode.parentNode.parentNode.parentNode.parentNode;
    let possibleArticle = node.parentNode.parentNode.parentNode.parentNode;
    node.parentNode.parentNode.parentNode.remove();
    possibleArticle.style.display = "none";
    //if (possibleThread.tagName === "ASIDE");
}

function inOnClickFunc(e, node) {
    e.preventDefault();
    backlinkClick(e, node);
    backlinkReset(e, node);
}

document.querySelector("head").innerHTML += '<style>.clicked {opacity: 0.3;}</style>';

document.querySelector("title").innerText = "/b/ - " + document.querySelector(".text").innerText;

$(".tessellatePost").on("click", function(e) {
    tessellatePost(e, this);
});


setTimeout(function() {document.querySelector(".tessellateThread").addEventListener("click", function(e) {
    tessellateThread(e);
});}, 1500);

function tessellatePost(e, node) {
  let container = node.parentNode.parentNode.parentNode.parentNode.querySelector(".inlinedQuotesContainer");
  let tesSpan = node.parentNode.parentNode.parentNode.parentNode.querySelector(".tessellatePost");
  if (container.style.display !== "flex") {
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    tesSpan.style.opacity = "0.45";
    tesSpan.style.color = "darkgrey";
  } else {
    container.style.display = "";
    container.style.flexWrap = "";
    tesSpan.style.opacity = "0.95";
    tesSpan.style.color = "#7fa5c6";
  }
}

function tessellateThread(e) {
  let container = document.querySelector(".posts");
  let tesSpan = e.target;
  if (container.style.display !== "flex") {
    let threadImgBottomBound = document.querySelector(".thread_image_box").getBoundingClientRect().bottom;
    let dividerTopBound = document.querySelector(".thread_tools_bottom").getBoundingClientRect().top;
    let diff = threadImgBottomBound - dividerTopBound;
    if (threadImgBottomBound > dividerTopBound)  document.querySelector(".thread_tools_bottom").style.paddingBottom = `${diff + 10}px`;
    Array.from(document.getElementsByClassName("post_controls")).forEach(el => el.children[0].style.display = "none");
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    tesSpan.style.opacity = "0.45";
    tesSpan.style.color = "darkgrey";
  } else {
    Array.from(document.getElementsByClassName("post_controls")).forEach(el => el.children[0].style.display = "");
    document.querySelector(".thread_tools_bottom").style.paddingBottom = "";
    container.style.display = "";
    container.style.flexWrap = "";
    tesSpan.style.opacity = "0.95";
    tesSpan.style.color = "#7fa5c6";
  }
}

$(".expandAllQuotes").on("click", function(e) {
  expandAllQuotes(e, this);
});

$(".collapseAllQuotes").on("click", function(e) {
  collapseAllQuotes(e, this);
});

function expandAllQuotes(e, node) {
  Array.from(node.parentNode.parentNode.parentNode.querySelector(".backlink_list").children[0].children).filter(el => !el.classList.contains("clicked")).forEach(el => $(el).trigger("click"));
}

function collapseAllQuotes(e, node) {
  Array.from(node.parentNode.parentNode.parentNode.querySelector(".backlink_list").children[0].children).filter(el => el.classList.contains("clicked")).forEach(el => $(el).trigger("click"));
}

function backlinkClick(e, node) {
    e.preventDefault();
    let targetID = node.innerHTML.slice(8);
    if (!node.classList.contains("clicked")) {
        node.classList.add("clicked");
        //console.log("targetID is", targetID, $("#"+targetID));
        let newPost = $("#"+targetID)[0].cloneNode(true);
        newPost.style.border = "1px solid #0b0e1580";
        newPost.style.borderRadius = "6px";
        newPost.style.marginTop = "13px";
        setTimeout(function(){newPost.classList.remove("highlight");}, 10);
        node.parentNode.parentNode.parentNode.children[node.parentNode.parentNode.parentNode.children[0].classList.contains("post_file") ? 4 : 2].getElementsByClassName("inlinedQuotesContainer")[0].appendChild(newPost);
    } else {
        node.classList.remove("clicked");
        Array.from(node.parentNode.parentNode.parentNode.children[node.parentNode.parentNode.parentNode.children[0].classList.contains("post_file") ? 4 : 2].getElementsByClassName("inlinedQuotesContainer")[0].children)
            .filter(el => el.id === targetID).forEach(el => el.remove());
    }
}

function backlinkReset(e, node) {
    $(".backlink").off();
    $(".backlink").on("click", function(e) {
        inOnClickFunc(e, this);
    });
    $(".post_image").off();
    $(".post_image").on("click", function(e) {
        settingClickHandler(e, this);
    });
    $(".tessellatePost").off();
    $(".tessellatePost").on("click", function(e) {
        tessellatePost(e, this);
    });
    $(".postRemove").off();
    $(".postRemove").on("click", function(e) {
        postRemove(e, this);
    });
    $(".expandAllQuotes").off();
    $(".expandAllQuotes").on("click", function(e) {
      expandAllQuotes(e, this);
    });
    $(".collapseAllQuotes").off();
    $(".collapseAllQuotes").on("click", function(e) {
      collapseAllQuotes(e, this);
    });
}

$(".post_image").on("click", function(e) {
    settingClickHandler(e, this);
});

function settingClickHandler(e, node) {
    e.preventDefault();
    if (node === document.getElementsByClassName("post_image")[0]) {
        node.src = node.parentNode.href;
        node.attributes.removeNamedItem("height");
        node.attributes.removeNamedItem("width");
    } else {
        if (node.src.split("/")[5] === "thumb") {
            let fileRow = node.parentNode.parentNode.parentNode.querySelector(".post_file");
            let widthHeightArr = fileRow.children[2].innerText.split(", ")[1].trim().split("x");
            if (fileRow.children[1].href.slice(-4) === "webm") {
                let newVideoNode = document.createElement("video");
                newVideoNode.src = fileRow.children[1].href;
                newVideoNode.controls = true;
                newVideoNode.autoplay = true;
                newVideoNode.loop = true;
                newVideoNode.width = widthHeightArr[0];
                node.parentNode.insertBefore(newVideoNode, node);
                node.style.display = "none";
                let newSpan = document.createElement("span");
                newSpan.style.paddingLeft = "5px";
                newSpan.style.color = "#81a2be";
                newSpan.innerText = "[close webm]";
                fileRow.appendChild(newSpan);
                let sizeSpan = document.createElement("span");
                let increaseSize = document.createElement("span");
                increaseSize.classList.add("videoIncreaseSize");
                let decreaseSize = document.createElement("span");
                decreaseSize.classList.add("videoDecreaseSize");
                let increaseSizeMore = document.createElement("span");
                increaseSizeMore.classList.add("videoIncreaseSizeMore");
                increaseSizeMore.innerHTML = `(<span style="font-size: 17px; position: relative; top: 2px">++</span>)`;
                let decreaseSizeMore = document.createElement("span");
                decreaseSizeMore.classList.add("videoDecreaseSizeMore");
                decreaseSizeMore.innerHTML = `(<span style="font-size: 24px; position: relative; top: 3.5px">--</span>)`;
                decreaseSizeMore.style.paddingRight = "4px";
                sizeSpan.classList.add("sizeSpan");
                increaseSize.innerText = "(++)";
                increaseSize.style.padding = "0px 4px";
                decreaseSize.innerText = "(--)";
                decreaseSize.style.padding = "0px 4px";
                sizeSpan.style.paddingLeft = "5px";
                sizeSpan.style.color = "#81a2be";
                let resetSpan = document.createElement("span");
                resetSpan.innerText = "Reset";
                resetSpan.classList.add("resetMediaSize");
                resetSpan.style.paddingLeft = "4px";
                resetSpan.style.position = "relative";
                resetSpan.style.top = "1px";
                sizeSpan.innerHTML = `[Size - ${decreaseSize.outerHTML} ${decreaseSizeMore.outerHTML} | ${increaseSize.outerHTML} ${increaseSizeMore.outerHTML} | ${resetSpan.outerHTML} ]`;
                fileRow.appendChild(sizeSpan);
                newVideoNode.addEventListener("click", function(e) {
                  if (e.target.paused) e.target.play();
                  else e.target.pause();
                }, false);
                newSpan.addEventListener("click", function(e) {
                  newVideoNode.remove();
                  node.style.display = "";
                  newSpan.remove();
                  sizeSpan.remove();
                });
                fileRow.querySelector(".resetMediaSize").addEventListener("click", function(e) {
                  newVideoNode.width = widthHeightArr[0];
                });
                fileRow.querySelector(".videoIncreaseSize").addEventListener("click", function(e) {
                  let numWidth = Number(newVideoNode.width);
                  newVideoNode.width = `${(numWidth + 10)}`;
                });
                fileRow.querySelector(".videoDecreaseSize").addEventListener("click", function(e) {
                  let numWidth = Number(newVideoNode.width);
                  newVideoNode.width = numWidth > 10 ? `${(numWidth - 10)}` : "0";
                });
                fileRow.querySelector(".videoIncreaseSizeMore").addEventListener("click", function(e) {
                  let numWidth = Number(newVideoNode.width);
                  newVideoNode.width = `${(numWidth + 100)}`;
                });
                fileRow.querySelector(".videoDecreaseSizeMore").addEventListener("click", function(e) {
                  let numWidth = Number(newVideoNode.width);
                  newVideoNode.width = numWidth > 100 ? `${(numWidth - 100)}` : "0";
                });
                return;
            }
            let fileExt = fileRow.children[1].href.split(".")[2];
            node.dataset.originalSrc = node.src;
            node.src = node.parentNode.href;
            node.style.width = widthHeightArr[0] + "px";
            node.style.height = widthHeightArr[1] + "px";
            let sizeSpan = document.createElement("span");
            sizeSpan.classList.add("mediaChangeSize");
            let increaseSize = document.createElement("span");
            increaseSize.classList.add("mediaIncreaseSize");
            increaseSize.style.padding = "0px 4px";
            let decreaseSize = document.createElement("span");
            decreaseSize.classList.add("mediaDecreaseSize");
            let increaseSizeMore = document.createElement("span");
            increaseSizeMore.classList.add("mediaIncreaseSizeMore");
            increaseSizeMore.innerHTML = `(<span style="font-size: 17px; position: relative; top: 2px">++</span>)`;
            let decreaseSizeMore = document.createElement("span");
            decreaseSizeMore.classList.add("mediaDecreaseSizeMore");
            decreaseSizeMore.innerHTML = `(<span style="font-size: 24px; position: relative; top: 3.5px">--</span>)`;
            decreaseSizeMore.style.padding = "0px 4px";
            decreaseSize.style.paddingLeft = "4px";
            increaseSize.innerText = "(++)";
            decreaseSize.innerText = "(--)";
            let resetSpan = document.createElement("span");
            resetSpan.innerText = "Reset";
            resetSpan.classList.add("resetMediaSize");
            resetSpan.style.paddingLeft = "4px";
            resetSpan.style.position = "relative";
            resetSpan.style.top = "1px";
            sizeSpan.innerHTML = `[Size - ${decreaseSize.outerHTML} ${decreaseSizeMore.outerHTML} | ${increaseSize.outerHTML} ${increaseSizeMore.outerHTML} | ${resetSpan.outerHTML} ]`;
            sizeSpan.style.paddingLeft = "5px";
            sizeSpan.style.color = "#81a2be";
            fileRow.appendChild(sizeSpan);
            fileRow.querySelector(".resetMediaSize").addEventListener("click", function(e) {
              node.style.width = widthHeightArr[0] + "px";
              node.style.height = widthHeightArr[1] + "px";
            });
            fileRow.querySelector(".mediaIncreaseSize").addEventListener("click", function(e) {
              let numWidth = Number(node.style.width.match(/(\d+)px/)[1]);
              let numHeight = Number(node.style.height.match(/(\d+)px/)[1]);
              node.style.width = `${numWidth + 10}px`;
              node.style.height = `${numHeight + 10}px`;
            });
            fileRow.querySelector(".mediaDecreaseSize").addEventListener("click", function(e) {
              let numWidth = Number(node.style.width.match(/(\d+)px/)[1]);
              node.style.width = numWidth > 10 ? `${numWidth - 10}px` : "0px";
              let numHeight = Number(node.style.height.match(/(\d+)px/)[1]);
              node.style.height = numHeight > 10 ? `${numHeight - 10}px` : "0px";
            });
            fileRow.querySelector(".mediaIncreaseSizeMore").addEventListener("click", function(e) {
              let numWidth = Number(node.style.width.match(/(\d+)px/)[1]);
              let numHeight = Number(node.style.height.match(/(\d+)px/)[1]);
              node.style.width = `${numWidth + 100}px`;
              node.style.height = `${numHeight + 100}px`;
            });
            fileRow.querySelector(".mediaDecreaseSizeMore").addEventListener("click", function(e) {
              let numWidth = Number(node.style.width.match(/(\d+)px/)[1]);
              node.style.width = numWidth > 100 ? `${numWidth - 100}px` : "0px";
              let numHeight = Number(node.style.height.match(/(\d+)px/)[1]);
              node.style.height = numHeight > 100 ? `${numHeight - 100}px` : "0px";
            });
        } else {
            node.src = node.dataset.originalSrc;
            node.style.width = "";
            node.style.height = "";
            node.parentNode.parentNode.parentNode.querySelector(".mediaChangeSize").remove();
        }
    }
}

Array.from(document.querySelectorAll(".backlink.op")).forEach(el => el.innerText += "  (OP)");

function addRemoveExtras() {
  let removeExtrasSpan = document.createElement("span");
  removeExtrasSpan.innerText = "[Remove Extras]";
  removeExtrasSpan.title = "Remove extra options from all posts";
  removeExtrasSpan.classList.add("removeExtras");
  removeExtrasSpan.style.fontSize = "10px";
  removeExtrasSpan.style.position = "relative";
  removeExtrasSpan.style.top = "-2px";
  removeExtrasSpan.style.paddingLeft = "11px";
  removeExtrasSpan.style.paddingRight = "6px";
  removeExtrasSpan.style.opacity = "0.95";
  removeExtrasSpan.style.color = "#7fa5c6";

  document.querySelector(".post_data").appendChild(removeExtrasSpan);

  setTimeout(function() {document.querySelector(".removeExtras").addEventListener("click", function(e) {
    if (e.target.style.opacity === "0.95") {
      e.target.style.opacity = "0.55";
      Array.from(document.querySelectorAll(".collapsible")).forEach(el => el.style.display = "none");
    } else {
      e.target.style.opacity = "0.95";
      Array.from(document.querySelectorAll(".collapsible")).forEach(el => el.style.display = "unset");
    }
  }, false)}, 1800);
}

addRemoveExtras();

document.querySelector(".post_data").innerHTML += `<span class="postsDraggableContainer" style="font-size: 10px;position: relative;top: -2px;padding-left: 8px;color: #7fa5c6;opacity: 0.95;padding-right: 11px;">[<span class="postsDraggableToggle" style="opacity: 0.95;">Posts Draggable</span> | <span class="postsDraggableReset">Reset</span>]</span>`;

let currentNode = null;
let startDragX = null;
let startDragY = null;
let currentZIndex = 1;

document.querySelector(".postsDraggableToggle").addEventListener("click", function(e) {
  if (e.target.style.opacity === "0.95") {
    e.target.style.opacity = "0.55";
    Array.from(document.querySelectorAll("article.post")).forEach(el => {
      el.draggable = true;
      el.ondragstart = function(e) {
        e.stopPropagation();
        e.dataTransfer.setData("postData", e.target.innerHTML);
        currentNode = e.target;
        startDragX = e.clientX;
        startDragY = window.scrollY + e.clientY;
        e.target.style.position = "relative";
        if (e.target.style.top === "") e.target.style.top = "0px";
        if (e.target.style.left === "") e.target.style.left = "0px";
      };
    });
    document.addEventListener("dragover", docDragOver);
    document.addEventListener("drop", postDrop);
  } else {
    e.target.style.opacity = "0.95";
    Array.from(document.querySelectorAll("article.post")).forEach(el => el.draggable = false);
    document.removeEventListener("dragover", docDragOver);
    document.removeEventListener("drop", postDrop);
  }
});

function docDragOver(e) {
  e.preventDefault();
}

function postDrop(e) {
  let currentX = e.clientX;
  let currentY = window.scrollY + e.clientY;
  let newX = currentX - startDragX;
  let newY = currentY - startDragY;
  currentNode.style.top = `${Number(currentNode.style.top.match(/(-?\d+)px/)[1]) + newY}px`;
  currentNode.style.left = `${Number(currentNode.style.left.match(/(-?\d+)px/)[1]) + newX}px`;
  currentNode.style.zIndex = `${currentZIndex++}`;
  currentNode = null;
  startDragX = null;
  startDragY = null;
}

document.querySelector(".postsDraggableReset").addEventListener("click", function(e) {
  Array.from(document.querySelectorAll("article.post")).forEach(el => {
    el.style.top = "0px";
    el.style.left = "0px";
    el.style.zIndex = "";
  });
});

document.querySelector(".thread_tools_bottom").style.paddingBottom = "150px";

Array.from(document.querySelectorAll("iframe")).forEach(el => {
  if (el.src.match(/syndication\.exosrv/gi)) el.remove();
});