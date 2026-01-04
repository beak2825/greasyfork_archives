// ==UserScript==
// @name         red-mine图片查看
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  red-mine可查看图片、预览、旋转、缩放等。
// @author       zaugazeon
// @match        https://redmine-beta.banggood.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/458151/red-mine%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/458151/red-mine%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
  class ViewImage {
    /*
    obj = {
      srcList: [],
      selector: ''
    }
    */
    scale = 1;
    rotate = 0;
    srcArr = [];
    constructor(obj) {
      if (obj.srcList) {
        this.srcArr = obj.srcList;
      }
      if (obj.selector) {
        let allImgNode = document.querySelectorAll(obj.selector);
        if (allImgNode) {
          for (const value of allImgNode) {
            this.srcArr.push(value.src);
            value.addEventListener('click', () => {
              this.open(value.src);
            });
          }
        }
      }
      this.run(this.srcArr);
    }
    run(srcArr) {
      this.addStyleAndHTML();
      this.mainImgMove();
      this.imgItemEvent(srcArr);
      let close = document.querySelector('.gg-view-image .close');
      let toLeft = document.querySelector('.gg-view-image .to-left');
      let toRight = document.querySelector('.gg-view-image .to-right');
      let prev = document.querySelector('.gg-view-image .footer .left');
      let next = document.querySelector('.gg-view-image .footer .right');
      close.addEventListener('click', () => {
        this.close();
      });
      toLeft.addEventListener('click', () => {
        this.toRotate(true);
      });
      toRight.addEventListener('click', () => {
        this.toRotate(false);
      });
      prev.addEventListener('click', () => {
        this.next('pre');
      });
      next.addEventListener('click', () => {
        this.next('next');
      });
      document.body.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
          this.close();
        }
      });
    }


    addStyleAndHTML() {
      let div = document.createElement('div');
      div.innerHTML = `
    <div class="gg-view-image">
      <div class="bar">
        <span class="to-left"></span>
        <span class="to-right"></span>
        <span class="close"></span>
      </div>
      <div class="main">
        <img src="" alt="">
      </div>
      <div class="footer">
        <div class="left"></div>
        <div class="group"></div>
        <div class="right"></div>
      </div>
    </div>
    `;
      let style = document.createElement('style')
      style.innerText = `
      @font-face {
          font-family: 'iconfont';  /* Project id 2054658 */
          src: url('https://at.alicdn.com/t/c/font_2054658_w7uet2h92sh.woff2?t=1669966857101') format('woff2'),
              url('https://at.alicdn.com/t/c/font_2054658_w7uet2h92sh.woff?t=1669966857101') format('woff'),
              url('https://at.alicdn.com/t/c/font_2054658_w7uet2h92sh.ttf?t=1669966857101') format('truetype');
        }
      .gg-view-image {
        display: none;
        position: fixed;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        top: 0;
        left: 0;
        width: 100%;
        transition: transform 0.3s ease 0s;
      }

      .gg-view-image .main {
        flex-grow: 1;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .gg-view-image .main img {
        margin-left: 0px;
        margin-top: 0px;
        max-height: 100%;
        max-width: 100%;
        cursor: grab;
        transition: transform 0.3s ease 0s;
      }

      .gg-view-image .footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        height: 100px;
        width: 100%;
        line-height: 100px;
        color: #fff;
        background: #11111133;
        font-family: "iconfont";
        font-size: 18px;
        font-weight: 900;
        user-select: none;
      }
      .gg-view-image .footer .left {
        cursor: pointer;
      }
      .gg-view-image .footer .right {
        cursor: pointer;
      }
      .gg-view-image .footer .left::after {
        content: '\\e659';
      }
      .gg-view-image .footer .right::after {
        content: '\\e667';
      }
      .gg-view-image .footer .left:hover {
        color: #1890ff;
      }
      .gg-view-image .footer .right:hover {
        color: #1890ff;
      }
      .gg-view-image .footer .group .group-item {
        height: 80px;
        margin: 8px;
        border: 2px solid rgba(255, 255, 255, 0);
      }

      .item-active {
        border: 2px solid #1890ff !important;
      }
      .gg-view-image .bar {
        color: #ccc;
        font-size: 30px;
        position: fixed;
        z-index: 10000;
        top: 0;
        right: 0;
        margin: 10px;
        cursor: pointer;
        font-family: "iconfont";
        background: #11111133;
        border-radius: 20px;
        user-select: none;
      }
      .bar span {
        margin: auto 5px;
      }
      .bar span:hover {
        color: #333;
      }
      .bar .close::after {
        content: "\\e685";
      }
      .bar .to-left::after {
        content: "\\e69a";
      }
      .bar .to-right::after {
        content: "\\e69b";
      }
    `;
      document.head.appendChild(style);
      document.body.appendChild(div);
    }

    mainImgMove() {
      let imgNode = document.querySelector('.gg-view-image .main img');
      let isDrag = false;
      let mouse = null;
      imgNode.addEventListener('dragstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });

      imgNode.addEventListener('mousedown', (e) => {
        imgNode.style.cursor = 'grabbing';
        isDrag = true;
        mouse = e;
      });

      imgNode.addEventListener('mousemove', (e) => {
        if (isDrag === true) {
          let { marginLeft, marginTop } = e.target.style;
          let left = +marginLeft.split('px')[0];
          let top = +marginTop.split('px')[0];
          let moveX = e.offsetX - mouse.offsetX;
          let moveY = e.offsetY - mouse.offsetY;
          if (this.rotate === 0) { }
          let rotate = this.rotate / 360 % 1;
          if (rotate === 0) {
            imgNode.style.marginLeft = left + moveX + 'px';
            imgNode.style.marginTop = top + moveY + 'px';
          } else if (rotate === 0.25 || rotate === -0.75) {
            imgNode.style.marginLeft = left - moveY + 'px';
            imgNode.style.marginTop = top + moveX + 'px';
          } else if (rotate === -0.25 || rotate === 0.75) {
            imgNode.style.marginLeft = left + moveY + 'px';
            imgNode.style.marginTop = top - moveX + 'px';
          } else if (rotate === 0.5 || rotate === -0.5) {
            imgNode.style.marginLeft = left - moveX + 'px';
            imgNode.style.marginTop = top - moveY + 'px';
          }
        }
      });
      imgNode.addEventListener('mouseleave', (e) => {
        if (isDrag === true) {
          imgNode.style.cursor = 'grab';
          isDrag = false;
        }
      });
      imgNode.addEventListener('mouseup', (e) => {
        if (isDrag === true) {
          imgNode.style.cursor = 'grab';
          isDrag = false;
        }
      });
    }

    imgItemEvent(imgList) {
      let groupNode = document.querySelector('.gg-view-image .footer .group');
      let imgNode = document.createElement('img');
      imgNode.className = 'group-item';
      imgList.forEach(src => {
        let item = imgNode.cloneNode(true);
        item.src = src;
        item.addEventListener('click', (e) => {
          this.resetMainImage();
          this.close();
          this.open(e.target.src);
        });
        groupNode.appendChild(item);
      });
    }

    resetMainImage() {
      this.scale = 1;
      this.rotate = 0;
      let img = document.querySelector('.gg-view-image .main img');
      let { width, height } = img;
      img.setAttribute('style', '');
      img.onmousewheel = null;
    }

    open(src) {
      src = src ? src : this.srcArr[0];
      let container = document.querySelector('.gg-view-image');
      let imgNode = document.querySelector('.gg-view-image .main img');
      let groupItemList = document.querySelectorAll('.gg-view-image .footer .group .group-item');
      container.style.display = 'block';
      container.style.height = window.innerHeight + 'px';
      imgNode.src = src;
      for (const item of groupItemList) {
        if (item.src === src) {
          item.className = 'group-item item-active';
        } else {
          item.className = 'group-item';
        }
      }
      setTimeout(() => {
        // 打开图片后...
        let { width, height } = imgNode;
        imgNode.onmousewheel = (e) => {
          e.preventDefault();
          e.stopPropagation();
          let transform = imgNode.style.transform || 'scale(1) rotate(0deg)';
          if (e.deltaY > 0) {
            if (this.scale > 0.3) {
              this.scale -= 0.05;
              transform = transform.replace(/(?<=scale\()\S+(?=\))/g, this.scale + '');
              imgNode.style.transform = transform;
            }
          }
          if (e.deltaY < 0) {
            if (this.scale < 10) {
              this.scale += 0.05;
              transform = transform.replace(/(?<=scale\()\S+(?=\))/g, this.scale + '');
              imgNode.style.transform = transform;
            }
          }
        }
      }, 10);
    }
    toRotate(isLeft) {
      this.rotate = isLeft ? this.rotate - 90 : this.rotate + 90;
      let imgNode = document.querySelector('.gg-view-image .main img');
      let transform = imgNode.style.transform;
      if (transform) {
        transform = transform.replace(/(?<=rotate\()\S+(?=\))/g, this.rotate + 'deg');
        imgNode.style.transform = transform;
      } else {
        imgNode.style.transform = 'scale(1) rotate(' + this.rotate + 'deg)';
      }
    }
    close() {
      let container = document.querySelector('.gg-view-image');
      container.style.display = 'none';
      this.resetMainImage();
    }
    next(dire) {
      let group = document.querySelectorAll('.gg-view-image .footer .group-item');
      let activeItem;
      group.forEach(v => {
        let cls = v.getAttribute('class');
        if (cls.split(' ').includes('item-active')) {
          activeItem = v;
        }
      });
      let s = dire === 'next' ? 'nextSibling' : 'previousSibling';
      let item = activeItem[s];
      if (item) {
        item.click();
      }
    }
  }

    new ViewImage({selector: '.wiki img'})
})();