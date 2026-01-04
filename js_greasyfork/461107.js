// ==UserScript==
// @name         Download as Photo Collage
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  A user script to allow user to select any images online then download them as a photo collage.
// @author       Lamonkey
// @match        *://*/*
// @match        https://twitter.com/*
// @match        https://www.instagram.com/*
// @match        https://www.facebook.com/*
// @match        https://www.pinterest.com/*
// @match        https://www.tumblr.com/*
// @match        https://www.reddit.com/*
// @match        https://www.flickr.com/*
// @icon         https://cdn-icons-png.flaticon.com/512/9813/9813564.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461107/Download%20as%20Photo%20Collage.user.js
// @updateURL https://update.greasyfork.org/scripts/461107/Download%20as%20Photo%20Collage.meta.js
// ==/UserScript==
(function () {
  "use strict";
  //create floating circle
  const floatingCircle = document.createElement("div");
  floatingCircle.setAttribute("id", "floating-circle");
  const floatingCircleContent = document.createElement("div");
  floatingCircleContent.setAttribute("id", "floating-circle-content");
  const counterDisplay = document.createElement("h1");
  counterDisplay.innerText = "count";
  // set the CSS styles for floatingCircle
  floatingCircle.style.position = "fixed";
  floatingCircle.style.top = "1em";
  floatingCircle.style.right = "1em";
  floatingCircle.style.zIndex = "10000";
  floatingCircle.style.height = "100px";
  floatingCircle.style.width = "100px";
  floatingCircle.style.backgroundColor = "aquamarine";
  floatingCircle.style.opacity = "0.6";
  floatingCircle.style.borderRadius = "50%";
  floatingCircle.style.display = "flex";
  floatingCircle.style.color = "white";
  floatingCircle.style.alignItems = "center";
  floatingCircle.style.justifyContent = "center";
  //css for floating-circle-content
  floatingCircleContent.style.display = "flex";
  floatingCircleContent.style.flexDirection = "column";
  floatingCircleContent.style.alignItems = "center";
  floatingCircleContent.style.justifyContent = "center";
  floatingCircleContent.style.height = "100%";
  floatingCircleContent.style.width = "100%";
  //add floating circle to DOM
  floatingCircle.appendChild(floatingCircleContent);
  floatingCircleContent.appendChild(counterDisplay);
  document.body.appendChild(floatingCircle);

  //create modal component
  const modalBox = document.createElement("div");
  modalBox.setAttribute("class", "modalBox");
  const modalNav = document.createElement("div");
  modalNav.setAttribute("class", "modalNav");
  const modalClose = document.createElement("span");
  modalClose.setAttribute("class", "modalClose");
  modalClose.innerHTML = "&times"; // x symbol
  const modalContent = document.createElement("div");
  modalContent.setAttribute("class", "modalContent");
  const photosContainer = document.createElement("ol");
  photosContainer.setAttribute("class", "photosContainer");
  const modalCanvas = document.createElement("canvas");
  modalCanvas.class = "modalCanvas";
  //style for modelBox
  modalBox.style.position = "fixed";
  modalBox.style.zIndex = "10000";
  modalBox.style.display = "none";
  modalBox.style.flexDirection = "column";
  modalBox.style.left = "20%";
  modalBox.style.top = "10%";
  modalBox.style.width = "60vw";
  modalBox.style.height = "60vh";
  modalBox.style.backgroundColor = "rgba(255,255,255,0.4)";
  //styling modalContent
  modalContent.style.zIndex = "10000";
  // modalContent.style.padding = "0";
  modalContent.style.height = "100%";
  modalContent.style.overflowY = "auto";
  modalContent.style.overflowX = "auto";
  modalContent.style.display = "block";
  modalContent.style.flexWrap = "wrap";
  modalContent.style.alignItems = "flex-start";
  //styling modalNav
  modalNav.style.backgroundColor = "white";
  modalNav.style.display = "flex";
  modalNav.style.justifyContent = "end";
  //close styleing
  modalClose.style.marginLeft = "10px";
  modalClose.style.color = "rgb(48, 56, 71)";
  modalClose.style.fontSize = "28px";
  modalClose.style.fontWeight = "bold";
  modalClose.style.cursor = "pointer";
  //photosContainer styling
  photosContainer.style.display = "flex";
  photosContainer.style.flexWrap = "wrap";
  photosContainer.style.margin = "2%";
  //clone a photo container for canvas
  const layoutContent = photosContainer.cloneNode();
  layoutContent.className = "layoutContent";
  const layoutContainer = modalContent.cloneNode();
  layoutContainer.className = "layoutContainer";
  layoutContainer.appendChild(layoutContent);
  layoutContainer.style.display = "none";
  //nav button
  const creatCanvas = document.createElement("button");
  creatCanvas.style.border = "none";
  creatCanvas.style.backgroundColor = "white";
  creatCanvas.className = "createCanvas";
  creatCanvas.innerText = `${String.fromCodePoint(0x1f304)}Create Collage`;
  const canvasContainner = modalContent.cloneNode();
  //styling nav button
  creatCanvas.style.marginLeft = "10px";
  creatCanvas.style.color = "rgb(48, 56, 71)";
  creatCanvas.style.fontSize = "28px";
  creatCanvas.style.fontWeight = "bold";
  canvasContainner.style.display = "none";
  //add modalBox to DOM
  modalContent.appendChild(photosContainer);
  modalBox.appendChild(modalNav);
  canvasContainner.appendChild(modalCanvas);
  modalBox.appendChild(canvasContainner);
  modalBox.appendChild(modalContent);
  modalBox.appendChild(layoutContainer);
  document.body.appendChild(modalBox);
  //create check image
  const checkImages = creatCanvas.cloneNode();
  checkImages.className = "checkImages";
  // checkImages.innerHTML = String.fromCodePoint(0x1f5bc);
  checkImages.innerText = `${String.fromCodePoint(0x1f5bc)}Check Images`;
  modalNav.appendChild(checkImages);
  modalNav.appendChild(creatCanvas);
  modalNav.appendChild(modalClose);

  //glable setting
  var imageSourceMap = new Map();
  var imagesSrcList = [];
  var imagePerRow = 1;
  var highlightedImages = [];
  var maxImgheight = 1000;
  var padding_between_images = 10;

  //utility function
  function getRenderedSize(contains, cWidth, cHeight, width, height, pos) {
    //get the size of the image after being rendered
    var oRatio = width / height,
      cRatio = cWidth / cHeight;
    return function () {
      if (contains ? oRatio > cRatio : oRatio < cRatio) {
        this.width = cWidth;
        this.height = cWidth / oRatio;
      } else {
        this.width = cHeight * oRatio;
        this.height = cHeight;
      }
      this.left = (cWidth - this.width) * (pos / 100);
      this.right = this.width + this.left;
      return this;
    }.call({});
  }
  function getImgSizeInfo(img) {
    //interface for getrenderSize
    var pos = window
      .getComputedStyle(img)
      .getPropertyValue("object-position")
      .split(" ");
    return getRenderedSize(
      true,
      img.width,
      img.height,
      img.naturalWidth,
      img.naturalHeight,
      parseInt(pos[0])
    );
  }
  function putImageIntoRow() {
    //put images into different row, key is row number value is list of imgs
    let row = new Map();
    for (let i = 0; i < highlightedImages.length; i++) {
      let y = Math.floor(highlightedImages[i].getBoundingClientRect().y);
      if (row.has(y)) {
        row.get(y).push(highlightedImages[i]);
      } else {
        row.set(y, [highlightedImages[i]]);
      }
    }
    return row;
  }
  function toggle_images(event) {
    /**
     * toggle the image border and add to or remove from hightlightedImages
     */
    let selected_image = event.target;
    console.log(event.target.getBoundingClientRect());
    console.log(getImgSizeInfo(selected_image));
    //unselect
    if (selected_image.classList.contains("selected")) {
      const index = highlightedImages.indexOf(event.target);
      if (index > -1) {
        highlightedImages.splice(index, 1);
      }
      selected_image.style.border = "";
      selected_image.classList.remove("selected");
      //also mark the containner
      selected_image.parentElement.classList("selected");
    }
    //select
    else {
      selected_image.style.border = "2px solid red";
      selected_image.classList.add("selected");
      //also mark the containner
      selected_image.parentElement.classList.add("selected");
      highlightedImages.push(event.target);
    }
  }
  function resize_canvas(setting) {
    /**
     * resize the canvas based on setting
     * */
    const ctx = modalCanvas.getContext("2d");
    modalCanvas.width = setting.width;
    modalCanvas.height = setting.height;
    ctx.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
    modalCanvas.style.border = "1px solid black";
  }

  function get_canvas_height_and_width() {
    /**
     * return the size of the canvas based on the layout of layoutContainner
     */
    //TODO: maybe could just simply get the size of the layoutcontainer
    let smallestX = Infinity;
    let smallestY = Infinity;
    for (let i = 0; i < highlightedImages.length; i++) {
      let x = highlightedImages[i].getBoundingClientRect().x;
      let y = highlightedImages[i].getBoundingClientRect().y;
      if (x < smallestX) {
        smallestX = x;
      }
      if (y < smallestY) {
        smallestY = y;
      }
    }
    //find the ending position which is the largest x and y + width and height
    let largestX = 0;
    let largestY = 0;
    for (let i = 0; i < highlightedImages.length; i++) {
      let x = highlightedImages[i].getBoundingClientRect().x;
      let y = highlightedImages[i].getBoundingClientRect().y;
      let width = highlightedImages[i].getBoundingClientRect().width;
      let height = highlightedImages[i].getBoundingClientRect().height;
      if (x + width > largestX) {
        largestX = x + width;
      }
      if (y + height > largestY) {
        largestY = y + height;
      }
    }
    let width = largestX - smallestX;
    let height = largestY - smallestY;
    return {
      height: Math.floor(height),
      width: Math.floor(width),
      startingPoint: { x: smallestX, y: smallestY },
    };
  }

  //factor method
  function wrap_image(imgSrc) {
    //return a containner that contains an image
    const img_li = document.createElement("li");
    const img = document.createElement("img");
    img.src = imgSrc;
    img_li.appendChild(img);
    //styling img_li
    img_li.style.height = "20vh";
    img_li.style.flexGrow = "1";
    img_li.style.margin = "10px";
    //styling img
    img.style.maxHeight = "100%";
    img.style.minWidth = "100%";
    img.style.objectFit = "scale-down";
    img.style.verticalAlign = "bottom";
    img.style.borderRadius = "1%";
    // img_li.style.backgroundColor = "red";
    img_li.classList.add("modalImage");
    img.classList.add("modalImage");

    return img_li;
  }

  function resize_canvas(setting) {
    const ctx = modalCanvas.getContext("2d");
    modalCanvas.width = setting.width;
    modalCanvas.height = setting.height;
    ctx.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
    modalCanvas.style.border = "1px solid black";
  }

  function generate_photo_grid(startingPoint) {
    let rows = putImageIntoRow();
    const ctx = modalCanvas.getContext("2d");

    // ctx.clearRect(0,0, modalCanvas.width, modalCanvas.height);
    for (let [key, imgs] of rows) {
      // let current_position = highlightedImages[i].getBoundingClientRect();
      let x = 0;
      let y = key - Math.floor(startingPoint.y);
      for (let i = 0; i < imgs.length; i++) {
        let image_size = getImgSizeInfo(imgs[i]);
        ctx.drawImage(imgs[i], x, y, image_size.width, image_size.height);
        x += image_size.width + 10;
      }
    }
  }

  function countAndAddImages() {
    let newImages = document.getElementsByTagName("img");
    for (let i = 0; i < newImages.length; i++) {
      //   create a new newImage from source
      if (imageSourceMap.has(newImages[i].src)) {
        continue;
      }
      imageSourceMap.set(newImages[i].src, true);
      let newImageSrc = newImages[i].src;
      imagesSrcList.push(newImageSrc);
    }

    return imagesSrcList.length;
  }

  function add_count_to_view(imageCount) {
    counterDisplay.innerHTML = imageCount;
  }
  function close_modal() {
    modalBox.style.display = "none";
    while (photosContainer.firstChild) {
      photosContainer.removeChild(photosContainer.firstChild);
    }
  }
  document.addEventListener("scroll", async () => {
    //add number of image to the floating window
    const imageCount = countAndAddImages();
    const scrollPosition = window.innerHeight + window.scrollY;
    const bodyHeight = document.body.offsetHeight;
    if (scrollPosition >= bodyHeight) {
      add_count_to_view(imageCount);
    }
  });
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target === floatingCircleContent || target === counterDisplay) {
      //render selected image to image containner
      modalBox.style.display = "flex";
      imagesSrcList.forEach((src) => {
        const img = wrap_image(src);
        photosContainer.appendChild(img);
      });
    } else if (event.target == modalClose) {
      close_modal();
    } else if (event.target == creatCanvas) {
      //show the canvas and hide content and unhighlighted images
      const modalImages = document.querySelectorAll(
        ".modalImage:not(.selected)"
      );
      modalImages.forEach((image) => {
        image.style.display = "none";
      });
      //wait one sec for the images to be hidden
      setTimeout(function () {
        const canvasSetting = get_canvas_height_and_width();
        resize_canvas(canvasSetting);
        generate_photo_grid(canvasSetting.startingPoint);
        canvasContainner.style.display = "";
        modalContent.style.display = "none";
      }, 1000);
    } else if (event.target == checkImages) {
      const modalImages = document.querySelectorAll(
        ".modalImage:not(.selected)"
      );
      modalImages.forEach((image) => {
        image.style.display = "block";
      });
      modalContent.style.display = "block";
      canvasContainner.style.display = "none";
    } else if (event.target.classList.contains("modalImage")) {
      toggle_images(event);
    }
  });

  // set a once second delay
  setTimeout(function () {
    const count = countAndAddImages();
    add_count_to_view(count);
  }, 1000);
})();