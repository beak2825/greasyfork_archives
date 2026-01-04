// ==UserScript==
// @name         chan embedded quote fixer
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Puts embedded quotes in end of post rather than beginning, can also click on checkboxes in posts to remove them, also works on 4channel boards, can tesselate whole thread/inlined posts, can change size of expanded media, can color posts to help keep track of embedded conversations, can hide extra options on each post via toggle (posts/thread), can manually drag posts around page via toggle (posts/thread), can remove (You)s, can change text flow on expanded images
// @author       DUVish
// @match        http://boards.4chan.org/*/thread/*
// @match        https://boards.4chan.org/*/thread/*
// @match        https://boards.4channel.org/*/thread/*
// @match        http://boards.4channel.org/*/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374364/chan%20embedded%20quote%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/374364/chan%20embedded%20quote%20fixer.meta.js
// ==/UserScript==

document.querySelector("head").innerHTML += `
  <style>
    div.post {overflow: visible;}
    div.image-expanded:not(.regularTextFlow) {display: unset !important;}
    div.image-expanded.regularTextFlow {display: table !important;}
  </style>
`;

//window.onload(function() {
    setTimeout(function() {
        let quotesList = Array.from(document.getElementsByClassName("quotelink")).filter(node => window.getComputedStyle(node).getPropertyValue("font-size") === "10.6667px");

        quotesList.forEach(node => {
          node.addEventListener("click", qEV);
        });

        Array.from(document.getElementsByTagName("span")).filter(el => {
            try {
              if (el.children.length > 0 && el.children[0].classList.contains("quotelink")) return true;
            } catch(error) {
              //console.log("custom error in span EL", el);
              return false;
            }
        }).forEach(el => el.addEventListener("click", qSpanClick));

        addRemoveCapability();
        addCollapseAndExpand();
        addTessellationQuotes();
        addQuotedPostsContainer();
        addTessellationThread();
        addThreadWidthToggle();
        addMediaZoom();
        addMediaFlow();
        addColorPostsThread();
        addColorPosts();
        setPostColor();
        addCollapseExtraNodesToggle();
        addPostDraggableTogglePost();
        addPostsDraggableToggleThread();
        addRemoveYousInPost();
        addEditabilityToPost();
        addCollapseExtrasInPosts();
        addExpandExtrasInPosts();
        expandPostsPostOn();
    }, 2500);
//});

let greenTextStyler = `<style>
  blockquote > div > span.quote {
    color: #789922;
  }
</style>`;

document.querySelector("head").innerHTML += greenTextStyler;

//tessellation feature - move element all the way to the right, try and move up - if interfering with getBoundingClientRect in two axes, then move left, then try and move up again - repeat until both up and left are exhausted
  //repeat for all posts - tesselation would not just add display: flex and flex-wrap:wrap to thread container, but also margin/-margin to each individual post - can either add some caching capability by storing data on
  //dome nodes themselves, or just store all of the HTML before, revert on option, and re-compute each time, possibly also add to barchive, also add for within posts themselves

var postColor = '';
var colorDiff = 38;

if (window.location.href.includes("boards.4chan.org")) colorDiff = 28;

function addTessellationThread() {
  let newSpan = document.createElement("span");
  newSpan.innerText = "[Tessellate Thread]";
  newSpan.classList.add("tessellateThread");
  newSpan.classList.add("collapsible");
  newSpan.style.paddingLeft = "6px";
  newSpan.style.paddingRight = "1px";
  newSpan.style.fontSize = "11px";
  newSpan.style.color = "rgb(46, 54, 144)";
  newSpan.style.opacity = "1";
  document.querySelector(".opContainer").querySelector(".postInfo.desktop").insertBefore(newSpan, document.querySelector(".opContainer").querySelector(".postMenuBtn"));
  newSpan.addEventListener("click", tessellateThread);
}

function tessellateThreadAlgorithmic(e) {
  let node = e.target;
  let threadNode = document.querySelector(".thread");
  let posts =  Array.from(document.querySelectorAll(".post.reply"));
  if (e.target.style.opacity === "1") {
    //threadNode.style.maxWidth = "100%";
    //threadNode.style.display = "flex";
    //threadNode.style.flexWrap = "wrap";
    node.style.opacity = "0.55";
    Array.from(document.querySelectorAll(".sideArrows")).forEach(el => {el.style.opacity = "0"; el.style.zIndex = "-1";});
    posts.forEach(el => {el.style.position = "relative"; el.style.bottom = "0px"; el.style.top = "0px"; el.style.left = "0px"; el.style.right = "0px";});
    let topBound = Math.floor(document.querySelector(".postContainer.opContainer").getBoundingClientRect().bottom + window.scrollY);
    let leftBound = 24;
    //console.log("before top-level iteration", topBound, leftBound);
    posts.forEach((post, postIdx) => {
      if (postIdx === 0) return;
      //post.style.left = document.documentElement.clientWidth - post.getBoundingClientRect().right;
      let beginningTop = post.getBoundingClientRect().top + window.scrollY;
      let currentBottomDiff =  0;
      let currentRightDiff =  0;
      let currentLeftDiff =  0;
      let currentTopDiff =  0;
      let currentLeftBound = document.documentElement.clientWidth - post.getBoundingClientRect().right;
      //console.log("before first while loop", beginningTop, currentLeftBound);
      //console.log("collection before while loop", posts, posts.slice(0, postIdx));
      while(!intersectionCheck(post.getBoundingClientRect().top + window.scrollY - currentBottomDiff, currentLeftBound, posts.slice(0, postIdx), topBound, leftBound, post)) {
        currentBottomDiff += 2;
        //post.style.bottom = `${Number(post.style.bottom.match(/(\d+)px/)[1]) + 2}px`;
      }
      post.style.bottom = `${Number(post.style.bottom.match(/(\d+)px/)[1]) + currentBottomDiff}px`;
      let currentTopBound = beginningTop + window.scrollY - currentBottomDiff;
      while(!intersectionCheck(currentTopBound, currentLeftBound - currentRightDiff, posts.slice(0, postIdx), topBound, leftBound, post)) {
        //post.style.right = `${Number(post.style.right.match(/(\d+)px/)[1]) + 2}px`;
        currentRightDiff += 2;
      }
      post.style.left = `${Number(post.style.left.match(/(\d+)px/)[1]) - currentRightDiff + currentLeftBound}px`;
    });
  } else {
    //undo
    node.style.opacity = "1";
    threadNode.style.maxWidth = "";
    Array.from(document.querySelectorAll(".sideArrows")).forEach(el => {el.style.opacity = "1"; el.style.zIndex = "0";});
    posts.forEach(el => {el.style.position = "unset"; el.style.bottom = "0px"; el.style.top = "0px"; el.style.left = "0px"; el.style.right = "0px";});
  }
}

function intersectionCheck(currentTop, currentLeft, collection, topBound, leftBound, post) {
  //console.log("entering intersectionCheck, collection", collection);
  for (let el of collection) {
    //console.log("comparing", post, el, currentTop, currentLeft, topBound, leftBound);
    if (currentTop < el.getBoundingClientRect().bottom + window.scrollY && currentLeft < el.getBoundingClientRect().right ||
        currentTop < topBound || currentLeft < leftBound) return true;
  }
  return false;
}

function tessellateThread(e) {
  let node = e.target;
  let threadNode = document.querySelector(".thread");
  if (threadNode.style.display !== "flex") {
    threadNode.style.display = "flex";
    threadNode.style.flexWrap = "wrap";
    threadNode.style.maxWidth = "100%";
    node.style.opacity = "0.55";
  } else {
    threadNode.style.display = "";
    threadNode.style.flexWrap = "";
    threadNode.style.maxWidth = "";
    node.style.opacity = "1.0";
  }
}

function addThreadWidthToggle() {
  let newSpan = document.createElement("span");
  newSpan.innerText = "[Toggle Thread Width]";
  newSpan.classList.add("threadWidthToggle");
  newSpan.classList.add("collapsible");
  newSpan.style.paddingLeft = "6px";
  newSpan.style.paddingRight = "1px";
  newSpan.style.fontSize = "11px";
  newSpan.style.color = "rgb(46, 54, 144)";
  newSpan.title = "Toggle thread width to and from 100% viewport width (without tessellating)";
  document.querySelector(".opContainer").querySelector(".postInfo.desktop").insertBefore(newSpan, document.querySelector(".opContainer").querySelector(".postMenuBtn"));
  newSpan.addEventListener("click", toggleThreadWidth);
}

function toggleThreadWidth(e) {
  let node = e.target;
  if (Number(node.style.opacity) > 0.95 || !node.style.opacity) {
    document.querySelector(".thread").style.maxWidth = "100%";
    node.style.opacity = "0.55";
  } else {
    document.querySelector(".thread").style.maxWidth = "";
    node.style.opacity = "1.0";
  }
}

function addTessellationQuotes() {
  Array.from(document.getElementsByClassName("postInfo")).forEach(el => {
    if (el.getElementsByClassName("tessellateQuotes").length === 0) {
      let btn = el.querySelector(".postMenuBtn");
      let tesSpan = document.createElement("span");
      tesSpan.innerText = "[Tessellate]";
      tesSpan.classList.add("tessellateQuotes");
      tesSpan.classList.add("collapsible");
      tesSpan.style.paddingLeft = "6px";
      tesSpan.style.paddingRight = "1px";
      tesSpan.style.fontSize = "11px";
      tesSpan.style.color = "rgb(46, 54, 144)";
      el.insertBefore(tesSpan, btn);
      tesSpan.removeEventListener("click", tessellateQuotes);
      tesSpan.addEventListener("click", tessellateQuotes);
    }
  });
}

function tessellateQuotes(e) {
  let tesSpan = e.target;
  let quotesNode = e.target.parentNode.parentNode.querySelector(".quotedPostsContainer");
  if (quotesNode.style.display !== "flex") {
    quotesNode.style.display = "flex";
    quotesNode.style.flexWrap = "wrap";
    tesSpan.style.opacity = "0.55";
  } else {
    quotesNode.style.display = "";
    quotesNode.style.flexWrap = "";
    tesSpan.style.color = "rgb(46, 54, 144)";
    tesSpan.style.opacity = "1.0";
  }
}

function addQuotedPostsContainer() {
  Array.from(document.getElementsByClassName("postMessage")).forEach(el => {
    if (el.getElementsByClassName("quotedPostsContainer").length === 0) {
      let container = document.createElement("span");
      container.classList.add("quotedPostsContainer");
      el.appendChild(container);
    }
  });
}

function addCollapseAndExpand() {
  Array.from(document.querySelectorAll(".post.reply")).forEach(postNode => {
    if (Array.from(postNode.children[1].children).filter(node => node.classList.contains("expandSpan")).length === 0) {
      let expandSpan = document.createElement("span");
      expandSpan.classList.add("expandSpan");
      expandSpan.classList.add("collapsible");
      expandSpan.innerText = "[↓]";
      expandSpan.title = "expand all 'quoted by' posts";
      expandSpan.style.color = "#1019d2e6";
      expandSpan.style.fontSize = "11px";
      expandSpan.style.paddingLeft = "5px";
      expandSpan.style.paddingRight = "5px";
      expandSpan.style.whiteSpace = "nowrap";
      let collapseSpan = document.createElement("span");
      collapseSpan.classList.add("collapseSpan");
      collapseSpan.classList.add("collapsible");
      collapseSpan.style.color = "#1019d2e6";
      collapseSpan.innerText = "[↑]";
      collapseSpan.title = "collapse all 'quoted by' posts";
      collapseSpan.style.fontSize = "11px";
      collapseSpan.style.paddingRight = "0px";
      collapseSpan.style.whiteSpace = "nowrap";
      postNode.children[1].insertBefore(expandSpan, postNode.querySelector(".postMenuBtn"));
      postNode.children[1].insertBefore(collapseSpan, postNode.querySelector(".postMenuBtn"));
    }
    let expand = postNode.querySelector(".expandSpan");
    let collapse = postNode.querySelector(".collapseSpan");
    expand.removeEventListener("click", expandSpanEL);
    expand.addEventListener("click", expandSpanEL);
    collapse.removeEventListener("click", collapseSpanEL);
    collapse.addEventListener("click", collapseSpanEL);
  });
}

function expandSpanEL(e) {
  Array.from(Array.from(e.target.parentNode.children).filter(node => node.classList.contains("backlink"))[0].children).forEach(node => {if (!node.children[0].classList.contains("linkfade")) node.children[0].click();});
}

function collapseSpanEL(e) {
  Array.from(Array.from(e.target.parentNode.children).filter(node => node.classList.contains("backlink"))[0].children).forEach(node => {if (node.children[0].classList.contains("linkfade")) node.children[0].click();});
}

function qSpanClick(e) {
  e.preventDefault();
}

function addMediaZoom() {
  Array.from(document.querySelectorAll(".fileText")).forEach(el => {
    if (Array.from(el.children).filter(el => el.classList.contains("mediaSizeChange")).length === 0) {
      let span = document.createElement("span");
      span.classList.add("mediaSizeChange");
      span.classList.add("collapsible");
      let spanBigger = document.createElement("span");
      let spanSmaller = document.createElement("span");
      let spanBiggerMore = document.createElement("span");
      let spanSmallerMore = document.createElement("span");
      let spanReset = document.createElement("span");
      spanBigger.classList.add("mediaSizeIncrease");
      spanSmaller.classList.add("mediaSizeDecrease");
      spanBiggerMore.classList.add("mediaSizeIncreaseMore");
      spanSmallerMore.classList.add("mediaSizeDecreaseMore");
      spanReset.classList.add("mediaSizeReset");
      spanBigger.innerText = "(++)";
      spanSmaller.innerText = "(--)";
      spanBiggerMore.innerHTML = `(<span style="font-size: 16px; position: relative; top: 1.5px;">++</span>)`;
      spanSmallerMore.innerHTML = `(<span style="font-size: 18px; position: relative; top: 2px;">--</span>)`;
      spanReset.innerText = "(Reset)";
      spanBigger.style.color = "#1019d2e6";
      spanBiggerMore.style.color = "#1019d2e6";
      spanSmaller.style.color = "#1019d2e6";
      spanSmallerMore.style.color = "#1019d2e6";
      spanReset.style.color = "#1019d2e6";
      spanReset.style.fontSize = "10px";
      span.innerHTML = `[ Size - ${spanSmaller.outerHTML} ${spanSmallerMore.outerHTML} | ${spanBigger.outerHTML} ${spanBiggerMore.outerHTML} | ${spanReset.outerHTML} ]`;
      el.appendChild(span);
      span.style.fontSize = "12px";
      span.style.position = "relative";
      span.style.bottom = "1px";
      span.style.paddingRight = "4px";
      span.style.paddingLeft = "4px";
      spanReset.style.position = "relative";
      spanReset.style.bottom = "1px";
    }
    let spanBigger = el.getElementsByClassName("mediaSizeIncrease")[0];
    spanBigger.removeEventListener("click", mediaSizeIncrease);
    let spanSmaller = el.getElementsByClassName("mediaSizeDecrease")[0];
    spanSmaller.removeEventListener("click", mediaSizeDecrease);
    let spanBiggerMore = el.getElementsByClassName("mediaSizeIncreaseMore")[0];
    spanBiggerMore.removeEventListener("click", mediaSizeIncreaseMore);
    let spanSmallerMore = el.getElementsByClassName("mediaSizeDecreaseMore")[0];
    spanSmallerMore.removeEventListener("click", mediaSizeDecreaseMore);
    let spanReset = el.getElementsByClassName("mediaSizeReset")[0];
    spanReset.removeEventListener("click", mediaSizeReset);
    spanBigger.addEventListener("click", mediaSizeIncrease);
    spanSmaller.addEventListener("click", mediaSizeDecrease);
    spanBiggerMore.addEventListener("click", mediaSizeIncreaseMore);
    spanSmallerMore.addEventListener("click", mediaSizeDecreaseMore);
    spanReset.addEventListener("click", mediaSizeReset);
  });
}

function mediaSizeIncrease(e) {
  let min = 0;
  let max = Number(e.target.parentNode.parentNode.parentNode.innerText.match(/\d+x\d+/)[0].split("x")[0]);
  let fileDiv = e.target.parentNode.parentNode.parentNode;
  if (Array.from(fileDiv.children).filter(el => el.tagName === "VIDEO").length !== 0) {
    let vidEl = Array.from(fileDiv.children).filter(el => el.tagName === "VIDEO")[0];
    if (vidEl.style.maxWidth) {
      vidEl.style.width = vidEl.style.maxWidth;
      vidEl.style.maxWidth = "";
      vidEl.style.maxHeight = "";
    }
    vidEl.style.height = "";
    let currentWidth = Number(vidEl.style.width.match(/\d+/));
    currentWidth += 20;
    vidEl.style.width = `${currentWidth}px`;
  } else {
    if (fileDiv.classList.contains("image-expanded")) {
      let img = Array.from(fileDiv.querySelectorAll("img")).filter(el => el.classList.contains("expanded-thumb"))[0];
      if (img) {
        if (img.style.maxWidth) {
          img.style.width = img.style.maxWidth;
          img.style.maxWidth = "";
          img.style.maxHeight = "";
        }
        img.style.height = "";
        let currentWidth = Number(img.style.width.match(/\d+/));
        currentWidth += 20;
        img.style.width = `${currentWidth}px`;
      }
    }
  }
}

function mediaSizeDecrease(e) {
  let min = 0;
  let max = Number(e.target.parentNode.parentNode.innerText.match(/\d+x\d+/)[0].split("x")[0]);
  let fileDiv = e.target.parentNode.parentNode.parentNode;
  if (Array.from(fileDiv.children).filter(el => el.tagName === "VIDEO").length !== 0) {
    let vidEl = Array.from(fileDiv.children).filter(el => el.tagName === "VIDEO")[0];
    if (vidEl.style.maxWidth) {
      vidEl.style.width = vidEl.style.maxWidth;
      vidEl.style.maxWidth = "";
      vidEl.style.maxHeight = "";
    }
    vidEl.style.height = "";
    let currentWidth = Number(vidEl.style.width.match(/\d+/));
    currentWidth -= 20;
    if (currentWidth < 0) {
      vidEl.style.width = `0px`;
      currentWidth = 0;
    } else {
      vidEl.style.width = `${currentWidth}px`;
    }
  } else {
    if (fileDiv.classList.contains("image-expanded")) {
      let img = Array.from(fileDiv.querySelectorAll("img")).filter(el => el.classList.contains("expanded-thumb"))[0];
      if (img) {
        if (img.style.maxWidth) {
          img.style.width = img.style.maxWidth;
          img.style.maxWidth = "";
          img.style.maxHeight = "";
        }
        img.style.height = "";
        let currentWidth = Number(img.style.width.match(/\d+/));
        currentWidth -= 20;
        if (currentWidth < 0) {
          img.style.width = `${max}px}`;
        } else {
          img.style.width = `${currentWidth}px`;
        }
      }
    }
  }
}

function mediaSizeIncreaseMore(e) {
  let min = 0;
  let max = Number(e.target.parentNode.parentNode.parentNode.innerText.match(/\d+x\d+/)[0].split("x")[0]);
  let fileDiv = e.target.parentNode.parentNode.parentNode.parentNode;
  if (Array.from(fileDiv.children).filter(el => el.tagName === "VIDEO").length !== 0) {
    let vidEl = Array.from(fileDiv.children).filter(el => el.tagName === "VIDEO")[0];
    if (vidEl.style.maxWidth) {
      vidEl.style.width = vidEl.style.maxWidth;
      vidEl.style.maxWidth = "";
      vidEl.style.maxHeight = "";
    }
    vidEl.style.height = "";
    let currentWidth = Number(vidEl.style.width.match(/\d+/));
    currentWidth += 100;
    vidEl.style.width = `${currentWidth}px`;
  } else {
    if (fileDiv.classList.contains("image-expanded")) {
      let img = Array.from(fileDiv.querySelectorAll("img")).filter(el => el.classList.contains("expanded-thumb"))[0];
      if (img) {
        if (img.style.maxWidth) {
          img.style.width = img.style.maxWidth;
          img.style.maxWidth = "";
          img.style.maxHeight = "";
        }
        img.style.height = "";
        let currentWidth = Number(img.style.width.match(/\d+/));
        currentWidth += 100;
        img.style.width = `${currentWidth}px`;
      }
    }
  }
}

function mediaSizeDecreaseMore(e) {
  let min = 0;
  let max = Number(e.target.parentNode.parentNode.parentNode.innerText.match(/\d+x\d+/)[0].split("x")[0]);
  let fileDiv = e.target.parentNode.parentNode.parentNode.parentNode;
  if (Array.from(fileDiv.children).filter(el => el.tagName === "VIDEO").length !== 0) {
    let vidEl = Array.from(fileDiv.children).filter(el => el.tagName === "VIDEO")[0];
    if (vidEl.style.maxWidth) {
      vidEl.style.width = vidEl.style.maxWidth;
      vidEl.style.maxWidth = "";
      vidEl.style.maxHeight = "";
    }
    vidEl.style.height = "";
    let currentWidth = Number(vidEl.style.width.match(/\d+/));
    currentWidth -= 100;
    if (currentWidth < 0) {
      vidEl.style.width = `0px`;
      currentWidth = 0;
    } else {
      vidEl.style.width = `${currentWidth}px`;
    }
  } else {
    if (fileDiv.classList.contains("image-expanded")) {
      let img = Array.from(fileDiv.querySelectorAll("img")).filter(el => el.classList.contains("expanded-thumb"))[0];
      if (img) {
        if (img.style.maxWidth) {
          img.style.width = img.style.maxWidth;
          img.style.maxWidth = "";
          img.style.maxHeight = "";
        }
        img.style.height = "";
        let currentWidth = Number(img.style.width.match(/\d+/));
        currentWidth -= 100;
        if (currentWidth < 0) {
          img.style.width = `${max}px}`;
        } else {
          img.style.width = `${currentWidth}px`;
        }
      }
    }
  }
}

function mediaSizeReset(e) {
  let width = Number(e.target.parentNode.parentNode.innerText.match(/\d+x\d+/)[0].split("x")[0]);
  let height = Number(e.target.parentNode.parentNode.innerText.match(/\d+x\d+/)[0].split("x")[1]);
  let fileDiv = e.target.parentNode.parentNode.parentNode;
  if (Array.from(fileDiv.children).filter(el => el.tagName === "VIDEO").length !== 0) {
    let vidEl = Array.from(fileDiv.children).filter(el => el.tagName === "VIDEO")[0];
    vidEl.style.width = `${width}px`;
    vidEl.style.height = `${height}px`;
  } else {
     if (fileDiv.classList.contains("image-expanded")) {
      let img = Array.from(fileDiv.querySelectorAll("img")).filter(el => el.classList.contains("expanded-thumb"))[0];
      if (img) {
        img.style.width = `${width}px`;
        img.style.height = `${height}px`;
      }
    }
  }
}

function addMediaFlow() {
  Array.from(document.querySelectorAll(".fileText")).forEach(el => {
    if (Array.from(el.children).filter(el => el.classList.contains("mediaFlowChange")).length === 0) {
      let span = document.createElement("span");
      span.classList.add("mediaFlowChange");
      span.classList.add("collapsible");
      span.innerText = "[Text flow]";
      el.appendChild(span);
      span.style.fontSize = "10px";
      span.style.color = "#1019d2e6";
      span.style.position = "relative";
      span.style.bottom = "1px";
      span.style.paddingRight = "4px";
      span.style.opacity = "1";
    }
    let spanFlow = el.getElementsByClassName("mediaFlowChange")[0];
    spanFlow.removeEventListener("click", mediaFlowChange);
    spanFlow.addEventListener("click", mediaFlowChange);
  });
}

function mediaFlowChange(e) {
  let flowSpan = e.target;
  let flowSpanOpacity = flowSpan.style.opacity;
  let fileTextSpan = flowSpan.parentNode.parentNode;
  console.log("in MediaFlowChange", flowSpan, fileTextSpan, flowSpanOpacity, typeof flowSpanOpacity, fileTextSpan.classList.contains("image-expanded"), fileTextSpan.style.display);
  if (fileTextSpan.classList.contains("image-expanded")) {
    if (flowSpanOpacity === "1") {
      e.target.style.opacity = "0.55";
      //fileTextSpan.style.display = "table";
      fileTextSpan.classList.add("regularTextFlow");
    } else {
      e.target.style.opacity = "1";
      //fileTextSpan.style.display = "unset";
      fileTextSpan.classList.remove("regularTextFlow");
    }
  }
}

function addYTSizeChangeCapability() {
  //change yt size
}

function addRemoveCapability() {
  //turns all delete checkboxes to simply post removal buttons
  Array.from(document.getElementsByClassName("postInfo desktop")).forEach(el => el.children[0].addEventListener("click", postRemove));
}

function postRemove(e) {
  e.preventDefault();
  e.target.parentNode.parentNode.parentNode.remove();
}

function setPostColor() {
  if (!postColor) {
    if (document.querySelectorAll(".post.reply").length > 0) {
      let post = document.querySelector(".post.reply");
      let rgbStr = window.getComputedStyle(post).backgroundColor;
      let matches = rgbStr.match(/rgb\((\d+),\s?(\d+),\s?(\d+)\)/i);
      postColor = {r: Number(matches[1]), g: Number(matches[2]), b: Number(matches[3])};
    }
  }
}

function addColorPostsThread() {
  let btn = document.querySelector(".op").querySelector(".postMenuBtn");
  let span = document.createElement("span");
  span.classList.add("colorChange");
  span.classList.add("collapsible");
  span.title = "Color all posts in thread";
  let colorOn = document.createElement("span");
  let colorOff = document.createElement("span");
  colorOn.classList.add("colorOnThread");
  colorOff.classList.add("colorOffThread");
  colorOn.innerText = "Color Posts";
  colorOff.innerText = "Off";
  span.innerHTML = `[${colorOn.outerHTML} | ${colorOff.outerHTML}]`;
  btn.parentNode.insertBefore(span, btn);
  span.style.paddingLeft = "6px";
  span.style.paddingRight = "1px";
  span.style.fontSize = "11px";
  span.style.color = "rgb(46, 53, 144)";
  document.querySelector(".colorOnThread").addEventListener("click", colorPostsThreadOn);
  document.querySelector(".colorOffThread").addEventListener("click", colorPostsThreadOff);
}

function colorPostsThreadOn(e) {
  Array.from(document.querySelectorAll(".post.reply")).forEach(el => {
    el.style.backgroundColor = `rgb(${Math.random() > 0.8 ? postColor.r - (Math.random() * (colorDiff / 5)) : postColor.r + (Math.random() * (colorDiff * 1.45))},
    ${Math.random() > 0.8 ? postColor.g - (Math.random() * (colorDiff / 5)) : postColor.g + (Math.random() * (colorDiff * 1.45))},
    ${Math.random() > 0.8 ? postColor.b - (Math.random() * (colorDiff / 5)) : postColor.b + (Math.random() * (colorDiff * 1.45))})`;
  });
}

function colorPostsThreadOff(e) {
  Array.from(document.querySelectorAll(".post.reply")).forEach(el => {
    el.style.backgroundColor = `rgb(${postColor.r}, ${postColor.g}, ${postColor.b})`;
  });
}

function addCollapseExtraNodesToggle() {
  let btn = document.querySelector(".op").querySelector(".postMenuBtn");
  let span = document.createElement("span");
  span.classList.add("collapseExtraNodes");
  span.classList.add("collapsible");
  span.title = "Collapse all extra nodes in thread";
  span.innerText = "[Collapse extras]";
  btn.parentNode.insertBefore(span, btn);
  span.style.paddingLeft = "6px";
  span.style.paddingRight = "1px";
  span.style.fontSize = "11px";
  span.style.color = "rgb(46, 53, 144)";
  span.style.opacity = "1";
  span.addEventListener("click", collapseNodesToggle);
}

let threadNodesCollapsed = false;

function collapseNodesToggle(e) {
  if (!threadNodesCollapsed) {
    Array.from(document.querySelectorAll(".collapsible")).forEach(el => el.style.display = "none");
    threadNodesCollapsed = true;
    //e.target.style.opacity = "0.55";
  } else {
    Array.from(document.querySelectorAll(".collapsible")).forEach(el => el.style.display = "unset");
    threadNodesCollapsed = false;
    //e.target.style.opacity = "1";
  }
}

function addCollapseExtrasInPosts() {
  Array.from(document.querySelectorAll(".postInfo.desktop")).forEach((el, i) => {
    if (i === 0) return;
    if (Array.from(el.children).filter(child => child.classList.contains("collapseExtraNodes")).length === 0) {
      el.parentNode.dataset.originalColor = window.getComputedStyle(el).backgroundColor;
      let span = document.createElement("span");
      span.classList.add("collapseExtraNodes");
      span.classList.add("collapsible");
      span.title = "Collapse all extra nodes of inlined posts within this one, including this - reverse with arrow button";
      span.innerHTML = `[Collapse extras]`;
      el.insertBefore(span, el.querySelector(".postMenuBtn"));
      span.style.paddingLeft = "6px";
      span.style.paddingRight = "1px";
      span.style.fontSize = "11px";
      span.style.color = "rgb(46, 53, 144)";
    }
    let collapseSpan = el.querySelector(".collapseExtraNodes");
    collapseSpan.removeEventListener("click", collapsePostsPostOn);
    collapseSpan.addEventListener("click", collapsePostsPostOn);
  });
}

function collapsePostsPostOn(e) {
  Array.from(e.target.parentNode.parentNode.parentNode.querySelectorAll(".post.reply")).forEach(el => {
    Array.from(el.querySelectorAll(".collapsible")).forEach(collapsibleEl => collapsibleEl.style.display = "none");
  });
}

function addExpandExtrasInPosts() {
  Array.from(document.querySelectorAll(".postInfo.desktop")).forEach((el, i) => {
    if (i === 0) {
      let buttonMenuSpan = el.querySelector(".postMenuBtn");
      buttonMenuSpan.removeEventListener("click", expandPostsThreadOn);
      buttonMenuSpan.addEventListener("click", expandPostsThreadOn);
      return;
    };
    let buttonMenuSpan = el.querySelector(".postMenuBtn");
    buttonMenuSpan.removeEventListener("click", expandPostsPostOn);
    buttonMenuSpan.addEventListener("click", expandPostsPostOn);
  });
}

function expandPostsPostOn(e) {
  Array.from(e.target.parentNode.parentNode.parentNode.querySelectorAll(".post.reply")).forEach(el => {
    Array.from(el.querySelectorAll(".collapsible")).forEach(collapsibleEl => collapsibleEl.style.display = "unset");
  });
}

function expandPostsThreadOn(e) {
  Array.from(document.querySelectorAll(".postInfo.desktop")).forEach(el => {
    Array.from(el.querySelectorAll(".collapsible")).forEach(collapsibleEl => collapsibleEl.style.display = "unset");
  });
}

function addColorPosts() {
  Array.from(document.querySelectorAll(".postInfo.desktop")).forEach((el, i) => {
    if (i === 0) return;
    if (Array.from(el.children).filter(child => child.classList.contains("colorChange")).length === 0) {
      el.parentNode.dataset.originalColor = window.getComputedStyle(el).backgroundColor;
      let span = document.createElement("span");
      span.classList.add("colorChange");
      span.classList.add("collapsible");
      span.title = "Color all inlined posts within this one";
      let colorOn = document.createElement("span");
      let colorOff = document.createElement("span");
      colorOn.classList.add("colorOnPost");
      colorOff.classList.add("colorOffPost");
      colorOn.innerText = "Color Posts";
      colorOff.innerText = "Off";
      span.innerHTML = `[${colorOn.outerHTML} | ${colorOff.outerHTML}]`;
      el.insertBefore(span, el.querySelector(".postMenuBtn"));
      span.style.paddingLeft = "6px";
      span.style.paddingRight = "1px";
      span.style.fontSize = "11px";
      span.style.color = "rgb(46, 53, 144)";
    }
    let colorOn = el.querySelector(".colorOnPost");
    let colorOff = el.querySelector(".colorOffPost");
    colorOn.removeEventListener("click", colorPostsPostOn);
    colorOn.addEventListener("click", colorPostsPostOn);
    colorOff.removeEventListener("click", colorPostsPostOff);
    colorOff.addEventListener("click", colorPostsPostOff);
  });
}

function colorPostsPostOn(e) {
  //console.log("colorPostsPoston", e.target);
  Array.from(e.target.parentNode.parentNode.parentNode.querySelectorAll(".post.reply")).forEach(el => {
    let nums = getTwoToThreeHigherNums();
    let randomDiff = getAtLeastOneQuarterFromRandom();
    let mappedNums = nums.map((num, idx) => num > 0.5 ? getSpecificColorFromMappedNumIdx(idx) + (randomDiff * colorDiff) : getSpecificColorFromMappedNumIdx(idx) - (randomDiff * colorDiff));
    el.style.backgroundColor = `rgb(${mappedNums[0]}, ${mappedNums[1]}, ${mappedNums[2]})`;
  });
}

function colorPostsPostOff(e) {
  Array.from(e.target.parentNode.parentNode.parentNode.querySelectorAll(".post.reply")).forEach(el => {
    el.style.backgroundColor = `rgb(${postColor.r}, ${postColor.g}, ${postColor.b})`;
  });
}

function getTwoToThreeHigherNums() {
    while(true) {
        let arr = [Math.random(), Math.random(), Math.random()];
        let numbersAboveHalf = arr.filter(el => el > 0.5).length;
        if (numbersAboveHalf > 1 && numbersAboveHalf < 4) {
            if (numbersAboveHalf === 3) {
                if (arr.filter(el => el > 0.85).length > 2) return arr;
            } else return arr;
        }
    }
}

function getAtLeastOneQuarterFromRandom() {
  while(true) {
    let num = Math.random();
    if (num > 0.25) return num;
  }
}

function getSpecificColorFromMappedNumIdx(idx) {
   // if (idx === 0) return 215;
   // if (idx === 1) return 215;
   // else return 215;
  if (idx === 0) return postColor.r;
  if (idx === 1) return postColor.g;
  else return postColor.b;
}

function addPostsDraggableToggleThread() {
  let btn = document.querySelector(".op").querySelector(".postMenuBtn");
  let metaSpan = document.createElement("span");
  metaSpan.classList.add("postsDraggableContainer");
  metaSpan.classList.add("collapsible");
  let spanDrag = document.createElement("span");
  let spanDragReset = document.createElement("span");
  spanDragReset.classList.add("postsDraggableReset");
  spanDrag.classList.add("postsDraggableToggle");
  spanDrag.title = "Toggle for whether posts are draggable/movable";
  spanDrag.innerText = "Posts Draggable";
  spanDragReset.title = "Reset positions of all posts";
  spanDragReset.innerText = "Reset";
  metaSpan.innerHTML = `[${spanDrag.outerHTML} | ${spanDragReset.outerHTML}]`;
  btn.parentNode.insertBefore(metaSpan, btn);
  metaSpan.style.paddingLeft = "6px";
  metaSpan.style.paddingRight = "1px";
  metaSpan.style.fontSize = "11px";
  metaSpan.style.color = "rgb(46, 53, 144)";
  spanDrag = document.querySelector(".postsDraggableToggle");
  spanDrag.style.opacity = "1";
  spanDragReset = document.querySelector(".postsDraggableReset");
  spanDrag.addEventListener("click", postsDraggableToggle);
  spanDragReset.addEventListener("click", postsDraggableReset);
}

function postsDraggableReset() {
  let posts = Array.from(document.querySelectorAll(".post.reply"));
  posts.forEach(post => {
    //post.style.position = "unset";
    post.style.top = "";
    post.style.bottom = "";
    post.style.left = "";
    post.style.right = "";
  });
}

let currentStartDragHorizontal = null;
let currentStartDragVertical = null;
let currentStartDragHorizontalDiff = null;
let currentStartDragVerticalDiff = null;
let currentStartDragNode = null;
let currentDragZIndex = 1;

function postsDraggableToggle(e) {
  if (e.target.style.opacity === "1") {
    e.target.style.opacity = "0.55";
    document.addEventListener("dragover", documentDragOver, true);
    document.addEventListener("drop", documentDrop, true);
    let posts = Array.from(document.querySelectorAll(".post.reply"));
    posts.forEach(post => {
      if (post.draggable !== true) {
        post.draggable = true;
        post.addEventListener("dragstart", postDragStart, true);
      }
    });
  } else {
    e.target.style.opacity = "1";
    document.removeEventListener("dragover", documentDragOver);
    document.removeEventListener("drop", documentDrop);
    let posts = Array.from(document.querySelectorAll(".post.reply"));
    posts.forEach(post => {
      if (post.draggable !== false) {
        post.draggable = false;
        post.removeEventListener("dragstart", postDragStart);
      }
    });
  }
}

function addPostDraggableTogglePost() {
  Array.from(document.querySelectorAll(".postInfo.desktop")).forEach((el, i) => {
    if (i === 0) return;
    if (Array.from(el.children).filter(child => child.classList.contains("postsDraggableContainer")).length === 0) {
      el.parentNode.dataset.originalColor = window.getComputedStyle(el).backgroundColor;
      let metaSpan = document.createElement("span");
      metaSpan.classList.add("postsDraggableContainer");
      metaSpan.classList.add("collapsible");
      let spanDrag = document.createElement("span");
      let spanDragReset = document.createElement("span");
      spanDragReset.classList.add("postsDraggableResetPost");
      spanDrag.classList.add("postsDraggableTogglePost");
      spanDrag.title = "Toggle for whether inlined posts are draggable/movable";
      spanDrag.innerText = "Posts Draggable";
      spanDragReset.title = "Reset positions of all inlined posts";
      spanDragReset.innerText = "Reset";
      metaSpan.innerHTML = `[${spanDrag.outerHTML} | ${spanDragReset.outerHTML}]`;
      el.insertBefore(metaSpan, el.querySelector(".postMenuBtn"));
      metaSpan.style.paddingLeft = "6px";
      metaSpan.style.paddingRight = "1px";
      metaSpan.style.fontSize = "11px";
      metaSpan.style.color = "rgb(46, 53, 144)";
    }
    let spanDrag = el.querySelector(".postsDraggableTogglePost");
    spanDrag.style.opacity = "1";
    let spanDragReset = el.querySelector(".postsDraggableResetPost");
    spanDrag.removeEventListener("click", postsDraggableTogglePost);
    spanDragReset.removeEventListener("click", postsDraggableResetPost);
    spanDrag.addEventListener("click", postsDraggableTogglePost);
    spanDragReset.addEventListener("click", postsDraggableResetPost);
  });
}

function postsDraggableResetPost(e) {
  let posts = Array.from(e.target.parentNode.parentNode.parentNode.querySelectorAll(".post.reply"));
  posts.forEach(post => {
    //post.style.position = "unset";
    post.style.top = "";
    post.style.bottom = "";
    post.style.left = "";
    post.style.right = "";
  });
}

function postsDraggableTogglePost(e) {
  if (e.target.style.opacity === "1") {
    e.target.style.opacity = "0.55";
    document.addEventListener("dragover", documentDragOver, true);
    document.addEventListener("drop", documentDrop, true);
    let posts = Array.from(e.target.parentNode.parentNode.parentNode.querySelectorAll(".post.reply"));
    posts.forEach(post => {
      if (post.draggable !== true) {
        post.draggable = true;
        post.addEventListener("dragstart", postDragStart, true);
      }
    });
  } else {
    e.target.style.opacity = "1";
    document.removeEventListener("dragover", documentDragOver);
    document.removeEventListener("drop", documentDrop);
    let posts = Array.from(e.target.parentNode.parentNode.parentNode.querySelectorAll(".post.reply"));
    posts.forEach(post => {
      if (post.draggable !== false) {
        post.draggable = false;
        post.removeEventListener("dragstart", postDragStart);
      }
    });
  }
}

function postDragStart(e) {
  e.dataTransfer.setData("text", e.target.outerHTML);
  //currentStartDragHorizontalDiff = Math.floor(e.clientX - e.target.getBoundingClientRect().left);
  //currentStartDragVerticalDiff = Math.floor(e.clientY - e.target.getBoundingClientRect().top);
  currentStartDragHorizontal = e.clientX;
  currentStartDragVertical = e.clientY + window.scrollY;
  currentStartDragNode = e.target;
  //e.target.style.position = "absolute";
  if (e.target.style.top === "") e.target.style.top = "0px";
  if (e.target.style.left === "") e.target.style.left = "0px";
  e.target.style.zIndex = JSON.stringify(currentDragZIndex);
  currentDragZIndex++;
}

function documentDragOver(e) {
  e.preventDefault();
}

function documentDrop(e) {
  e.preventDefault();
  currentStartDragNode.style.left = `${Number(currentStartDragNode.style.left.match(/([-\.\d]+)px/)[1]) + e.clientX - currentStartDragHorizontal}px`;
  currentStartDragNode.style.top = `${Number(currentStartDragNode.style.top.match(/([-\.\d]+)px/)[1]) + window.scrollY + e.clientY - currentStartDragVertical}px`;
  //currentStartDragNode.style.left = `${e.clientX - currentStartDragHorizontalDiff}px`;
  //currentStartDragNode.style.top = `${window.scrollY + e.clientY - currentStartDragVerticalDiff}px`;
  //currentStartDragNode.style.position = "absolute";
  if (currentStartDragNode.style.position !== "relative") currentStartDragNode.style.position = "relative";
  currentStartDragHorizontalDiff = null;
  currentStartDragVerticalDiff = null;
  currentStartDragNode = null;
}

function addRemoveYousInPost() {
  Array.from(document.querySelectorAll(".postInfo.desktop")).forEach(el => {
    if (Array.from(el.children).filter(el => el.classList.contains("removeYouPost")).length === 0) {
      let btn = el.querySelector(".postMenuBtn");
      let newSpan = document.createElement("span");
      newSpan.innerText = "[Remove (You)s]";
      newSpan.style.paddingLeft = "6px";
      newSpan.style.paddingRight = "1px";
      newSpan.style.fontSize = "11px";
      newSpan.style.color = "rgb(46, 53, 144)";
      newSpan.classList.add("removeYouPost");
      newSpan.classList.add("collapsible");
      newSpan.title = "Remove all (You)s from current post (works recursively downward)";
      btn.parentNode.insertBefore(newSpan, btn);
    }
  });
  Array.from(document.querySelectorAll(".removeYouPost")).forEach(el => {
    el.removeEventListener("click", removeYouPost);
    el.addEventListener("click", removeYouPost);
  });
}

function removeYouPost(e) {
  let post = e.target.parentNode.parentNode;
  Array.from(post.querySelectorAll("a.quotelink")).forEach(el => {
    el.innerText = el.innerText.replace(" (You)", "");
  });
}

function addEditabilityToPost() {
  Array.from(document.querySelectorAll(".postInfo.desktop")).forEach(el => {
    if (Array.from(el.children).filter(el => el.classList.contains("addEditability")).length === 0) {
      let btn = el.querySelector(".postMenuBtn");
      let newSpan = document.createElement("span");
      newSpan.innerText = "[Editable]";
      newSpan.style.paddingLeft = "6px";
      newSpan.style.paddingRight = "1px";
      newSpan.style.fontSize = "11px";
      newSpan.style.color = "rgb(46, 53, 144)";
      newSpan.classList.add("addEditability");
      newSpan.classList.add("collapsible");
      newSpan.title = "Make post type-editable";
      btn.parentNode.insertBefore(newSpan, btn);
    }
  });
  Array.from(document.querySelectorAll(".addEditability")).forEach(el => {
    el.removeEventListener("click", toggleEditabilityForPost);
    el.addEventListener("click", toggleEditabilityForPost);
  });
}

function toggleEditabilityForPost(e) {
  let flag = "false";
  if ((e.target.style.opacity === "1") || !e.target.style.opacity) {
    e.target.style.opacity = "0.55";
    flag = "true";
  } else {
    e.target.style.opacity = "1";
    flag = "false";
  }
    let post = e.target.parentNode.parentNode;
    let allEmbeddedPosts = Array.from(post.querySelectorAll(".postMessage"));
    allEmbeddedPosts.forEach(post => post.contentEditable = flag);
}

function qEV(e, node=e.target) {
  //console.log("quote clicked.");
  e.preventDefault();

  if (!node.classList.contains("linkfade")) {
    //if not grayed out, first time clicking, adding node
    node.classList.add("linkfade");

    //finding post and constructing new post
    let postsArr = Array.from(document.getElementsByClassName("postNum desktop")).filter(el => el.children[1].innerText === node.innerText.slice(2));
    let post = postsArr[0].parentNode.parentNode.parentNode;
    let newPost = post.cloneNode(true);
    //newPost.outerHTML = post.outerHTML;
    newPost.classList.add("inlined");
    newPost.children[1].classList.remove("highlight");
    newPost.style.display = "";
    newPost.style.marginTop = "10px";
    newPost.children[1].style.border = "1px solid rgba(172, 127, 127, 0.6)";
    newPost.children[1].style.borderRadius = "2px";
    newPost.children[0].style.display = "none";

    //adding to parent post
    if (node.parentNode.parentNode.parentNode.parentNode.children[2].classList.contains("file")) {
        Array.from(node.parentNode.parentNode.parentNode.parentNode.children[3].children).filter(el => el.classList.contains("quotedPostsContainer"))[0].appendChild(newPost);
        if (JSON.parse(localStorage.getItem("4chan-settings")).inlineQuotes) setTimeout(function() {node.parentNode.parentNode.parentNode.parentNode.children[3].children[0].remove();});
    } else {
        Array.from(node.parentNode.parentNode.parentNode.parentNode.children[2].children).filter(el => el.classList.contains("quotedPostsContainer"))[0].appendChild(newPost);
        if (JSON.parse(localStorage.getItem("4chan-settings")).inlineQuotes) setTimeout(function() {node.parentNode.parentNode.parentNode.parentNode.children[2].children[0].remove();});
    }
    setTimeout(function(){newPost.style.display = "";}, 10);

    //resetting event listeners
    resetQLEV();
  } else {
    //grayed out, second time clicking, removing node
    node.classList.remove("linkfade");
    let idx = node.parentNode.parentNode.parentNode.parentNode.children[2].classList.contains("file") ? 3 : 2;
    Array.from(node.parentNode.parentNode.parentNode.parentNode.children[idx].children).forEach(innerNode => {
      if (innerNode.classList.contains("quotedPostsContainer")) {
        Array.from(innerNode.children).forEach(el => {
          if (el.classList.contains("inlined") && node.innerText.slice(2) === el.children[1].children[1].children[3].children[1].innerText) el.remove();
        });
      }
    });
  }
}

function resetQLEV() {
  let newQuotesList = Array.from(document.getElementsByClassName("quotelink")).filter(node => window.getComputedStyle(node).getPropertyValue("font-size") === "10.6667px");
  newQuotesList.forEach(node => node.removeEventListener("click", qEV));
  newQuotesList.forEach(node => node.addEventListener("click", qEV));
  let newSpanList = Array.from(document.getElementsByTagName("span")).filter(el => {
        try {
          if (el.children.length > 0 && el.children[0].classList.contains("quotelink")) return true;
        } catch(error) {
          return false;
        }
    });
  newSpanList.forEach(el => el.removeEventListener("click", qSpanClick));
  newSpanList.forEach(el => el.addEventListener("click", qSpanClick));
  Array.from(document.getElementsByClassName("postInfo desktop")).forEach(el => el.children[0].removeEventListener("click", postRemove));
  addRemoveCapability();
  addCollapseAndExpand();
  let tesQuoteSpans = Array.from(document.getElementsByClassName("tessellateQuotes"));
  tesQuoteSpans.forEach(el => el.removeEventListener("click", tessellateQuotes));
  tesQuoteSpans.forEach(el => el.addEventListener("click", tessellateQuotes));
  addTessellationQuotes();
  addQuotedPostsContainer();
  addMediaZoom();
  addMediaFlow();
  addColorPosts();
  setPostColor();
  addPostDraggableTogglePost();
  addRemoveYousInPost();
  addEditabilityToPost();
  addCollapseExtrasInPosts();
  addExpandExtrasInPosts();
  expandPostsPostOn();
}

let observer = new MutationObserver(resetQLEV);
observer.observe(document.getElementsByClassName("thread")[0], {childList: true});

let quotePreviewObserver = new MutationObserver(quotePreviewHandler);
quotePreviewObserver.observe(document.querySelector("body"), {childList: true});

function quotePreviewHandler(newNodes) {
  if (newNodes[0] && newNodes[0].addedNodes.length > 0) newNodes[0].addedNodes.forEach(el => {if (el.id === "quote-preview") el.style.zIndex = currentDragZIndex++;});
}