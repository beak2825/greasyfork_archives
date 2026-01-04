// ==UserScript==
// @name         Снежный Новогодний Пикабу
// @namespace    https://pikabu.ru/
// @version      0.1
// @description  Новогодние оформление сайта Пикабу
// @author       @SpaceRook
// @include      http://pikabu.ru/*
// @include      https://pikabu.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481662/%D0%A1%D0%BD%D0%B5%D0%B6%D0%BD%D1%8B%D0%B9%20%D0%9D%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%D0%B4%D0%BD%D0%B8%D0%B9%20%D0%9F%D0%B8%D0%BA%D0%B0%D0%B1%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/481662/%D0%A1%D0%BD%D0%B5%D0%B6%D0%BD%D1%8B%D0%B9%20%D0%9D%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%D0%B4%D0%BD%D0%B8%D0%B9%20%D0%9F%D0%B8%D0%BA%D0%B0%D0%B1%D1%83.meta.js
// ==/UserScript==

(function() {
  setTimeout(() => {
  const str1 =
  `
<div class="snow"></div>
  `
  const str =
  `
<style>
html {
  background-size: 100%;
  height: 100%;
  background: #123 ;
}
.snow, .snow:before, .snow:after {
  position:fixed;
  top:0;
  width:100%;
  z-index: -1;
  top: -600px;
  left: 0;
  bottom: 0;
  right: 0;
  background-image: radial-gradient(4px 4px at 78px 587px, white 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 153px 46px, rgba(255, 255, 255, 0.9) 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 504px 39px, white 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 463px 596px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 185px 359px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 352px 248px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 273px 573px, white 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 421px 286px, rgba(255, 255, 255, 0.7) 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 368px 497px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 556px 373px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(5px 5px at 414px 517px, rgba(255, 255, 255, 0.7) 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 236px 477px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 94px 102px, white 50%, rgba(0, 0, 0, 0)), radial-gradient(5px 5px at 35px 341px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(5px 5px at 566px 37px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(5px 5px at 411px 557px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(5px 5px at 125px 136px, white 50%, rgba(0, 0, 0, 0)), radial-gradient(5px 5px at 493px 529px, rgba(255, 255, 255, 0.7) 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 595px 56px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 543px 92px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 299px 466px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 513px 293px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 535px 126px, white 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 7px 240px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 259px 381px, white 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 333px 570px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 524px 367px, rgba(255, 255, 255, 0.9) 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 57px 419px, rgba(255, 255, 255, 0.7) 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 66px 541px, white 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 294px 47px, rgba(255, 255, 255, 0.7) 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 50px 14px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 302px 164px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 450px 7px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 133px 252px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(5px 5px at 430px 327px, white 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 167px 244px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(5px 5px at 190px 393px, rgba(255, 255, 255, 0.9) 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 518px 521px, rgba(255, 255, 255, 0.7) 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 33px 154px, rgba(255, 255, 255, 0.9) 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 375px 403px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 237px 337px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 572px 289px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 367px 467px, rgba(255, 255, 255, 0.9) 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 42px 453px, rgba(255, 255, 255, 0.7) 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 440px 108px, rgba(255, 255, 255, 0.9) 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 472px 542px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 379px 18px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 283px 425px, white 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 212px 39px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 143px 164px, rgba(255, 255, 255, 0.9) 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 268px 417px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 558px 535px, rgba(255, 255, 255, 0.9) 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 142px 426px, rgba(255, 255, 255, 0.7) 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 451px 427px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(5px 5px at 440px 258px, rgba(255, 255, 255, 0.7) 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 181px 193px, white 50%, rgba(0, 0, 0, 0)), radial-gradient(5px 5px at 315px 154px, white 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 357px 408px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 495px 215px, white 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 455px 130px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 478px 376px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(5px 5px at 180px 543px, white 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 119px 334px, rgba(255, 255, 255, 0.9) 50%, rgba(0, 0, 0, 0)), radial-gradient(5px 5px at 377px 323px, white 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 538px 65px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 336px 122px, rgba(255, 255, 255, 0.7) 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 403px 38px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(6px 6px at 284px 235px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0)), radial-gradient(4px 4px at 246px 126px, rgba(255, 255, 255, 0.6) 50%, rgba(0, 0, 0, 0)), radial-gradient(3px 3px at 271px 573px, rgba(255, 255, 255, 0.8) 50%, rgba(0, 0, 0, 0));
  background-size: 600px 600px;
  animation: snow 3s linear infinite;
  content: "";
}

.snow:after {
  margin-left: -200px;
  opacity: 0.4;
  animation-duration: 6s;
  animation-direction: reverse;
  filter: blur(3px);
}

.snow:before {
  animation-duration: 9s;
  animation-direction: reverse;
  margin-left: -300px;
  opacity: 0.65;
  filter: blur(1.5px);
}

@keyframes snow {
  to {
    transform: translateY(600px);
  }
}
</style>
<style>
    .story__left_no-padding > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) {color: #fff;}
    .story__rating-plus, .story__rating-down {border: 0px;}
    .story__rating-plus, .story__rating-down, .comment__content, .app__inner, .story__header, .comment__header {filter:drop-shadow(5px 5px 5px rgba(0, 0, 0, 0.7));}
    .comment__content{background: #9191910f;padding:9px;margin-top:4px;margin-bottom:4px;border-radius:4px;}
    .comment__body{padding:9px;margin-top:4px;margin-bottom:4px;border-radius:4px;}
    .app__inner {width: 2%;}
    * {
    background-repeat: inherit;}
    html[data-theme-dark] {
  --color-black-300: #131a2152;
}
</style>
  `;

  // Create an element outside the document to parse the string with
  const head = document.createElement("head");
  const body = document.createElement("body");
  // Parse the string
  head.innerHTML = str;
  body.innerHTML = str1;
  // Copy those nodes to the real `head`, duplicating script elements so
  // they get processed
  let node = head.firstChild;
  let node1 = body.firstChild;

  while (node) {
    const next = node.nextSibling;
    if (node.tagName === "SCRIPT") {
      // Just appending this element wouldn't run it, we have to make a fresh copy
      const newNode = document.createElement("script");
      if (node.src) {
        newNode.src = node.src;
      }
      while (node.firstChild) {
        // Note we have to clone these nodes
        newNode.appendChild(node.firstChild.cloneNode(true));
        node.removeChild(node.firstChild);
      }
      node = newNode;
    }
    document.head.appendChild(node);
    node = next;
  }
 while (node1) {
    const next1 = node1.nextSibling;
    if (node1.tagName === "SCRIPT1") {
      // Just appending this element wouldn't run it, we have to make a fresh copy
      const newNode1 = document.createElement("script1");
      if (node1.src1) {
        newNode1.src1 = node1.src1;
      }
      while (node1.firstChild) {
        // Note we have to clone these nodes
        newNode1.appendChild(node1.firstChild.cloneNode(true));
        node1.removeChild(node1.firstChild);
      }
      node1 = newNode1;
    }
    document.body.appendChild(node1);
    node1 = next1;
  }
}, 0.00001);
})();