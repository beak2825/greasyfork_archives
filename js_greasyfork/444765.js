// ==UserScript==
// @name        amazonReviewWall
// @namespace   https://github.com/deltabravozulu/usefulUserScripts
// @version     420.69.2022-05-12T14:28:42
// @author      DeltaBravoZulu
// @description View Amazon review images in a zoomable wall
// @homepage    https://github.com/deltabravozulu/usefulUserScripts/tree/main/amazonReviewWall
// @icon        https://raw.githubusercontent.com/deltabravozulu/usefulUserScripts/main/amazonReviewWall/images/amazonReviewWall_small.png
// @icon64      https://raw.githubusercontent.com/deltabravozulu/usefulUserScripts/main/amazonReviewWall/images/amazonReviewWall_small.png
// @supportURL  https://github.com/deltabravozulu/usefulUserScripts
// @include     /^https?:\/\/(www|smile)\.amazon\.(cn|in|co\.jp|sg|ae|fr|de|it|nl|es|co\.uk|ca|com(\.(mx|au|br|tr))?)\/.*(dp|gp\/(product|video)|exec\/obidos\/ASIN|o\/ASIN)\/.*$/
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       window.close
// @grant       window.focus
// @run-at      document-idle
// @license     PayMe
// @downloadURL https://update.greasyfork.org/scripts/444765/amazonReviewWall.user.js
// @updateURL https://update.greasyfork.org/scripts/444765/amazonReviewWall.meta.js
// ==/UserScript==
  ///////////////////////////////////////
 //      Amazon Review Photowall      //
///////////////////////////////////////
/*
 ** Makes a zoomable photo wall from Amazon review pictures
 */
async function theStuff() {
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    function appendHTML() {
        var wrapper = document.createElement("body");
        wrapper.innerHTML =
'\
<style>\
html,body {\
margin: 0;\
padding: 0;\
}\
body { background-color: black; }\
header {\
padding: 1em;\
background-color: #333;\
text-align: center;\
}\
h1 { color:#fff;}\
a:link,\
a:visited {\
text-decoration: none;\
font-family: sans-serif;\
color: white;\
}\
a:hover { color: #ddd; }\
#author { float: left; }\
#repo { float: right; }\
#title {\
display: inline-block;\
font-weight: bold;\
}\
.zoomwall {\
font-size: 0;\
overflow: hidden; \
}\
.zoomwall img {\
height: 15vw;\
opacity: 1;\
vertical-align: top;\
\
transform-origin: 0% 0%;\
transition-property: transform, opacity;\
transition-duration: 0.3s;\
transition-timing-function: ease-out;\
-webkit-transform-origin: 0% 0%;\
-webkit-transition-property: transform, opacity;\
-webkit-transition-duration: 0.3s;\
-webkit-transition-timing-function: ease-out;\
}\
.zoomwall.lightbox img {\
transition-timing-function: ease-in;\
-webkit-transition-timing-function: ease-in;\
}\
.zoomwall.lightbox img {\
opacity: 0.3;\
}\
.zoomwall.lightbox img.active {\
opacity: 1;\
}\
</style>\
<div id="zoomwall" class="zoomwall"></div>\
';
        document.appendChild(wrapper);
    }
    await sleep(1000);
    //https://stackoverflow.com/a/58316317/8398127
    function getChunks(selector, strStart, strEnd) {
        const html = document.querySelector(selector).innerHTML;
        const start = html.indexOf(strStart);
        const end = html.indexOf(strEnd, start);
        if (start == -1 || end == -1) return;
        return {
            before: html.substr(0, start),
            match: html.substr(start, end - start + strEnd.length),
            after: html.substr(end + strEnd.length, html.length - end),
        };
    }
    let chunkSelector = "#reviews-image-gallery-container > script";
    let chunkStart = "data, ";
    let chunkEnd = '");';
    chunks = getChunks(chunkSelector, chunkStart, chunkEnd).match;
    dataAndCSRF = chunks
        .replaceAll(");", "")
        .replaceAll('"', "")
        .replaceAll(" ", "");
    dataAndCSRFArray = dataAndCSRF.split(",");
    data = dataAndCSRFArray[1];
    firstReviewIds = dataAndCSRFArray[3];
    asin = data;
    csrfToken = firstReviewIds;
    let text = "";
    let date = new Date().toISOString();
    function AppendToLocalStorage(name, value) {
        let n = 0;
        while (localStorage.getItem(name + "-" + n)) {
            n++;
        }
        localStorage.setItem(name + "-" + n, value); //add item at first available index number
    }
    function GetLocalStorage(name) {
        let n = 0;
        let data = [];
        while (localStorage.getItem(name + "-" + n)) {
            data.push(localStorage.getItem(name + "-" + n++));
        }
        return data;
    }
    function AppendToGMStorage(name, value) {
        let n = 0;
        while (GM_getValue(name + "-" + n, "")) {
            n++;
        }
        GM_setValue(name + "-" + n, value); //add item at first available index number
    }
    function GetGMStorage(name) {
        let n = 0;
        let data = [];
        while (GM_getValue(name + "-" + n, "")) {
            data.push(GM_getValue(name + "-" + n++));
        }
        return data;
    }
    //https://www.amazon.com/hz/reviews-render/get-reviews-with-media?mediaType=image&asin=B08DKK2KD1&csrfToken=guMT%2B0nYuIuyIIE6DbwfM0%2BcGnpEsbBr8SAKSRIAAAABAAAAAGJ5vEhyYXcAAAAA%2B4kUEk%2F7iMGR3xPcX6iU
    function loadReviews() {
        url =
            "https://www.amazon.com/hz/reviews-render/get-reviews-with-media?mediaType=image&asin=" +
            asin +
            "&csrfToken=" +
            csrfToken;
        function getJSON(url) {
            var resp;
            var xmlHttp;
            resp = "";
            xmlHttp = new XMLHttpRequest();
            if (xmlHttp != null) {
                xmlHttp.open("GET", url, false);
                xmlHttp.send(null);
                resp = xmlHttp.responseText;
            }
            return resp;
        }
        jsonGot = getJSON(url);
        jsonParsed = JSON.parse(jsonGot);
        //need to keep doing this until all pages are hit
        csrfToken = jsonParsed.csrfToken;
        reviews = jsonParsed.reviewsWithMediaList;
        reviewKeys = Object.keys(reviews);
        reviewCount = reviewKeys.length;
        for (var r = 0; r < reviewCount; r++) {
            reviewKey = reviewKeys[r];
            review = reviews[reviewKey];
            //console.log(review)
            reviewId = review.reviewId;
            reviewUrl =
                "https://www.amazon.com/gp/customer-reviews/" + reviewId;
            profileUrl = "https://www.amazon.com" + review.customerProfileLink;
            AppendToGMStorage(asin, profileUrl);
            AppendToLocalStorage(asin, profileUrl);
            for (var j = 0; j < review.images.length; j++) {
                imgUrl = review.images[j].source;
                text +=
                    '<img src="' +
                    imgUrl +
                    '" reviewurl="' +
                    reviewUrl +
                    '" profileurl="' +
                    profileUrl +
                    '"></img>';
                console.log(
                    "imgUrl: " +
                        imgUrl +
                        ", reviewUrl: " +
                        reviewUrl +
                        ", profileUrl: " +
                        profileUrl
                );
                //console.log(csrfToken)
            }
        }
    }
    loadReviews();
    await sleep(3000);
    var newDoc = document.open("text/html", "replace");
    appendHTML();
    await sleep(1000);
    document.getElementById("zoomwall").innerHTML = text;
    await sleep(1000);
    var zoomwall = {
        create: function (blocks, enableKeys) {
            zoomwall.resize(blocks.children);
            blocks.classList.remove("loading");
            // shrink blocks if an empty space is clicked
            blocks.addEventListener("click", function () {
                if (this.children && this.children.length > 0) {
                    zoomwall.shrink(this.children[0]);
                }
            });
            // add click listeners to blocks
            for (var i = 0; i < blocks.children.length; i++) {
                blocks.children[i].addEventListener("click", zoomwall.animate);
            }
            // add key down listener
            if (enableKeys) {
                var keyPager = function (event) {
                    which = event.which;
                    keyCode = event.keyCode;
                    shiftKey = event.shiftKey;
                    altKey = event.altKey;
                    ctrlKey = event.ctrlKey;
                    metaKey = event.metaKey;
                    key = event.key;
                    defaultPrevented = event.defaultPrevented;
                    //[prevent key codes from working when shift,alt,ctrl,cmd,windows,super,etc. keys are working ]
                    if (
                        defaultPrevented ||
                        shiftKey ||
                        altKey ||
                        ctrlKey ||
                        metaKey
                    ) {
                        console.log(key);
                        return;
                    }
                    //[ESC] = zoom out
                    else if (keyCode === 27) {
                        console.log(key);
                        if (blocks.children && blocks.children.length > 0) {
                            zoomwall.shrink(blocks.children[0]);
                        }
                        event.preventDefault();
                    }
                    //[⬅] = previous
                    else if (keyCode === 37) {
                        console.log(key);
                        zoomwall.page(blocks, false);
                        event.preventDefault();
                    }
                    //[➡] = next
                    else if (keyCode === 39) {
                        console.log(key);
                        zoomwall.page(blocks, true);
                        event.preventDefault();
                    }
                    //[space]||[⬆]||[r] = open review
                    else if (
                        keyCode === 32 ||
                        keyCode === 38 ||
                        keyCode === 82
                    ) {
                        console.log(key);
                        zoomwall.reviewUrl(blocks);
                        event.preventDefault();
                    }
                    //[⬇]||[p] = open profile
                    else if (keyCode === 40 || keyCode === 80) {
                        console.log(key);
                        zoomwall.profileUrl(blocks);
                        event.preventDefault();
                    } else {
                        console.log(key);
                        return;
                    }
                };
                document.addEventListener("keydown", keyPager);
            }
        },
        resizeRow: function (row, width) {
            if (row && row.length > 1) {
                for (var i in row) {
                    row[i].style.width =
                        (parseInt(window.getComputedStyle(row[i]).width, 10) /
                            width) *
                            100 +
                        "%";
                    row[i].style.height = "auto";
                }
            }
        },
        calcRowWidth: function (row) {
            var width = 0;
            for (var i in row) {
                width += parseInt(window.getComputedStyle(row[i]).width, 10);
            }
            return width;
        },
        resize: function (blocks) {
            var row = [];
            var top = -1;
            for (var c = 0; c < blocks.length; c++) {
                var block = blocks[c];
                if (block) {
                    if (top == -1) {
                        top = block.offsetTop;
                    } else if (block.offsetTop != top) {
                        zoomwall.resizeRow(row, zoomwall.calcRowWidth(row));
                        row = [];
                        top = block.offsetTop;
                    }
                    row.push(block);
                }
            }
            zoomwall.resizeRow(row, zoomwall.calcRowWidth(row));
        },
        reset: function (block) {
            block.style.transform = "translate(0, 0) scale(1)";
            block.style.webkitTransform = "translate(0, 0) scale(1)";
            block.classList.remove("active");
        },
        shrink: function (block) {
            block.parentNode.classList.remove("lightbox");
            // reset all blocks
            zoomwall.reset(block);
            var prev = block.previousElementSibling;
            while (prev) {
                zoomwall.reset(prev);
                prev = prev.previousElementSibling;
            }
            var next = block.nextElementSibling;
            while (next) {
                zoomwall.reset(next);
                next = next.nextElementSibling;
            }
            // swap images
            if (block.dataset.lowres) {
                block.src = block.dataset.lowres;
            }
        },
        expand: function (block) {
            block.classList.add("active");
            block.parentNode.classList.add("lightbox");
            // parent dimensions
            var parentStyle = window.getComputedStyle(block.parentNode);
            var parentWidth = parseInt(parentStyle.width, 10);
            var parentHeight = parseInt(parentStyle.height, 10);
            var parentTop = block.parentNode.getBoundingClientRect().top;
            // block dimensions
            var blockStyle = window.getComputedStyle(block);
            var blockWidth = parseInt(blockStyle.width, 10);
            var blockHeight = parseInt(blockStyle.height, 10);
            // determine maximum height
            var targetHeight = window.innerHeight;
            if (parentHeight < window.innerHeight) {
                targetHeight = parentHeight;
            } else if (parentTop > 0) {
                targetHeight -= parentTop;
            }
            // swap images
            if (block.dataset.highres) {
                if (
                    block.src != block.dataset.highres &&
                    block.dataset.lowres === undefined
                ) {
                    block.dataset.lowres = block.src;
                }
                block.src = block.dataset.highres;
            }
            // determine what blocks are on this row
            var row = [];
            row.push(block);
            var next = block.nextElementSibling;
            while (next && next.offsetTop == block.offsetTop) {
                row.push(next);
                next = next.nextElementSibling;
            }
            var prev = block.previousElementSibling;
            while (prev && prev.offsetTop == block.offsetTop) {
                row.unshift(prev);
                prev = prev.previousElementSibling;
            }
            // calculate scale
            var scale = targetHeight / blockHeight;
            if (blockWidth * scale > parentWidth) {
                scale = parentWidth / blockWidth;
            }
            // determine offset
            var offsetY =
                parentTop - block.parentNode.offsetTop + block.offsetTop;
            if (offsetY > 0) {
                if (parentHeight < window.innerHeight) {
                    offsetY -= targetHeight / 2 - (blockHeight * scale) / 2;
                }
                if (parentTop > 0) {
                    offsetY -= parentTop;
                }
            }
            var leftOffsetX = 0; // shift in current row
            for (var i = 0; i < row.length && row[i] != block; i++) {
                leftOffsetX +=
                    parseInt(window.getComputedStyle(row[i]).width, 10) * scale;
            }
            leftOffsetX =
                parentWidth / 2 - (blockWidth * scale) / 2 - leftOffsetX;
            var rightOffsetX = 0; // shift in current row
            for (var i = row.length - 1; i >= 0 && row[i] != block; i--) {
                rightOffsetX +=
                    parseInt(window.getComputedStyle(row[i]).width, 10) * scale;
            }
            rightOffsetX =
                parentWidth / 2 - (blockWidth * scale) / 2 - rightOffsetX;
            // transform current row
            var itemOffset = 0; // offset due to scaling of previous items
            var prevWidth = 0;
            for (var i = 0; i < row.length; i++) {
                itemOffset += prevWidth * scale - prevWidth;
                prevWidth = parseInt(window.getComputedStyle(row[i]).width, 10);
                var percentageOffsetX =
                    ((itemOffset + leftOffsetX) / prevWidth) * 100;
                var percentageOffsetY =
                    (-offsetY /
                        parseInt(window.getComputedStyle(row[i]).height, 10)) *
                    100;
                row[i].style.transformOrigin = "0% 0%";
                row[i].style.webkitTransformOrigin = "0% 0%";
                row[i].style.transform =
                    "translate(" +
                    percentageOffsetX.toFixed(8) +
                    "%, " +
                    percentageOffsetY.toFixed(8) +
                    "%) scale(" +
                    scale.toFixed(8) +
                    ")";
                row[i].style.webkitTransform =
                    "translate(" +
                    percentageOffsetX.toFixed(8) +
                    "%, " +
                    percentageOffsetY.toFixed(8) +
                    "%) scale(" +
                    scale.toFixed(8) +
                    ")";
            }
            // transform items after
            var nextOffsetY = blockHeight * (scale - 1) - offsetY;
            var prevHeight;
            itemOffset = 0; // offset due to scaling of previous items
            prevWidth = 0;
            var next = row[row.length - 1].nextElementSibling;
            var nextRowTop = -1;
            while (next) {
                var curTop = next.offsetTop;
                if (curTop == nextRowTop) {
                    itemOffset += prevWidth * scale - prevWidth;
                } else {
                    if (nextRowTop != -1) {
                        itemOffset = 0;
                        nextOffsetY += prevHeight * (scale - 1);
                    }
                    nextRowTop = curTop;
                }
                prevWidth = parseInt(window.getComputedStyle(next).width, 10);
                prevHeight = parseInt(window.getComputedStyle(next).height, 10);
                var percentageOffsetX =
                    ((itemOffset + leftOffsetX) / prevWidth) * 100;
                var percentageOffsetY = (nextOffsetY / prevHeight) * 100;
                next.style.transformOrigin = "0% 0%";
                next.style.webkitTransformOrigin = "0% 0%";
                next.style.transform =
                    "translate(" +
                    percentageOffsetX.toFixed(8) +
                    "%, " +
                    percentageOffsetY.toFixed(8) +
                    "%) scale(" +
                    scale.toFixed(8) +
                    ")";
                next.style.webkitTransform =
                    "translate(" +
                    percentageOffsetX.toFixed(8) +
                    "%, " +
                    percentageOffsetY.toFixed(8) +
                    "%) scale(" +
                    scale.toFixed(8) +
                    ")";
                next = next.nextElementSibling;
            }
            // transform items before
            var prevOffsetY = -offsetY;
            itemOffset = 0; // offset due to scaling of previous items
            prevWidth = 0;
            var prev = row[0].previousElementSibling;
            var prevRowTop = -1;
            while (prev) {
                var curTop = prev.offsetTop;
                if (curTop == prevRowTop) {
                    itemOffset -= prevWidth * scale - prevWidth;
                } else {
                    itemOffset = 0;
                    prevOffsetY -=
                        parseInt(window.getComputedStyle(prev).height, 10) *
                        (scale - 1);
                    prevRowTop = curTop;
                }
                prevWidth = parseInt(window.getComputedStyle(prev).width, 10);
                var percentageOffsetX =
                    ((itemOffset - rightOffsetX) / prevWidth) * 100;
                var percentageOffsetY =
                    (prevOffsetY /
                        parseInt(window.getComputedStyle(prev).height, 10)) *
                    100;
                prev.style.transformOrigin = "100% 0%";
                prev.style.webkitTransformOrigin = "100% 0%";
                prev.style.transform =
                    "translate(" +
                    percentageOffsetX.toFixed(8) +
                    "%, " +
                    percentageOffsetY.toFixed(8) +
                    "%) scale(" +
                    scale.toFixed(8) +
                    ")";
                prev.style.webkitTransform =
                    "translate(" +
                    percentageOffsetX.toFixed(8) +
                    "%, " +
                    percentageOffsetY.toFixed(8) +
                    "%) scale(" +
                    scale.toFixed(8) +
                    ")";
                prev = prev.previousElementSibling;
            }
        },
        animate: function (e) {
            if (this.classList.contains("active")) {
                zoomwall.shrink(this);
            } else {
                var actives = this.parentNode.getElementsByClassName("active");
                for (var i = 0; i < actives.length; i++) {
                    actives[i].classList.remove("active");
                }
                zoomwall.expand(this);
            }
            e.stopPropagation();
        },
        reviewUrl: function (blocks) {
            var actives = blocks.getElementsByClassName("active");
            if (actives && actives.length > 0) {
                var current = actives[0];
            }
            window.open(current.attributes.reviewurl.value, "_blank").blur();
            self.focus();
        },
        profileUrl: function (blocks) {
            var actives = blocks.getElementsByClassName("active");
            if (actives && actives.length > 0) {
                var current = actives[0];
            }
            window.open(current.attributes.profileurl.value, "_blank").blur();
            self.focus();
        },
        page: function (blocks, isNext) {
            var actives = blocks.getElementsByClassName("active");
            if (actives && actives.length > 0) {
                var current = actives[0];
                var next;
                if (isNext) {
                    next = current.nextElementSibling;
                } else {
                    next = current.previousElementSibling;
                }
                if (next) {
                    current.classList.remove("active");
                    // swap images
                    if (current.dataset.lowres) {
                        current.src = current.dataset.lowres;
                    }
                    zoomwall.expand(next);
                }
            }
        },
    };
    await sleep(1000);
    zoomwall.create(document.getElementById("zoomwall"), true);
    await sleep(1000);
    newDoc.close();
}
  ///////////////////////////////////////
 //         Button Injections         //
///////////////////////////////////////
/*
 ** Adds button to process start
 */
function addButts() {
    console.log("Adding Button");
    var oldButtons = document.querySelector("#productTitle");
    var newButtons = oldButtons.parentElement;
    var iconHtml =
        '<button type="button" class="default icon-only" id="ImageWallButton" title="See review images in a wall"><img height="40px" width="40px" src="data:image/png;base64,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"></img></button>';
    newButtons.insertAdjacentHTML("beforeend", iconHtml);
    document
        .getElementById("ImageWallButton")
        .addEventListener("click", theStuff);
    console.log("Added Button");
}
addButts();
