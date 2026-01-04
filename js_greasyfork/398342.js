// ==UserScript==
// @name         ArchiveFap
// @namespace    Horniness
// @version      1.0.2
// @description  A userscript that adds an Expand All Images button to Barchive and Archived.moe
// @author       Glint
// @match        https://thebarchive.com/b/thread/*
// @match        https://archived.moe/*/thread/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398342/ArchiveFap.user.js
// @updateURL https://update.greasyfork.org/scripts/398342/ArchiveFap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Compatibility for existing instances of jQuery on site.
    var j = $.noConflict();

    j(".post_image").on("click", function(e) {
        settingClickHandler(e, this);
    });

    document.querySelector(".post_data").innerHTML += '<a style="color:#9999FF;" id="archivefap_expand_all" href="#">Expand all images!</a>';

    j("#archivefap_expand_all").on("click", function(e) {
        j(".post_image").each(function(i, obj){
            settingClickHandler(e, obj);
        });
    });

function settingClickHandler(e, node) {
    //e.preventDefault();
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

    document.onkeydown = checkKey;

    //Handles behaviour when keys are pressed
    function checkKey(e){
        e = e || window.event;

        // -- FILE SET NAVIGATION --
        //If you press left or A, go to the previous file
        
        //nice
        if(e.keyCode == '69'){
            j(".post_image").each(function(i, obj){
                    settingClickHandler(e, obj);
            }
        );
        }
    }
})();