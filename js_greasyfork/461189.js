// ==UserScript==
// @name         Floatplane minimize Sidebar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script to minimize and maximize the sidebar on Floatplane.com as it is distractingly large
// @author       namesaregreat
// @match        https://www.floatplane.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=floatplane.com
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461189/Floatplane%20minimize%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/461189/Floatplane%20minimize%20Sidebar.meta.js
// ==/UserScript==

GM_addStyle ( `
    .menu-btn {
      float: left;
  width: 1.25rem;
  height: 1.25rem;
  display: inline-block;
  position: relative;
  margin: 0 1rem;
      margin-left: 60px;
    margin-top: 23px;
        transition: margin 0.8s ease-in-out;
}

.menu-btn span {
}
.menu-btn.left span:nth-child(4) {
  transform: rotate(-45deg);
}
.menu-btn.left span:nth-child(5) {
  transform: rotate(45deg);
}
.menu-btn.right span:nth-child(1) {
  transform: rotate(-45deg);
}
.menu-btn.right span:nth-child(2) {
  transform: rotate(45deg);
}
.menu-btn span {
  position: absolute;
  height: 0.1rem;
  background-color: #efefef;
  transition: transform 0.7s ease;
}
.menu-btn span:nth-child(1),
.menu-btn span:nth-child(2),
.menu-btn span:nth-child(4),
.menu-btn span:nth-child(5) {
  width: 0.625rem;
  top: 0.625rem;
}
.menu-btn span:nth-child(1) {
  right: 0;
  transform-origin: bottom right;
}
.menu-btn span:nth-child(2) {
  right: 0;
  transform-origin: top right;
}
.menu-btn span:nth-child(3) {
  width: 1.25rem;
  top: 0.625rem;
}
.menu-btn span:nth-child(4) {
  left: 0;
  transform-origin: bottom left;
}
.menu-btn span:nth-child(5) {
  left: 0;
  transform-origin: top left;
}
    .LeftBarHeader .logo-link {
        float:left !important;
        padding-left: 15px;
    }
.page-wrapper.menu-close .LeftBarHeader .logo-full {
    width: 0px;
    opacity: 0;
}

.LeftBarHeader .logo-full {
    transition: width 0.8s ease-in-out;
}
.page-wrapper.menu-close .sidebar {
    width: 120px;
}
.page-wrapper.menu-close {
    padding-left: 90px;
}
.page-wrapper.menu-close .navbars .sidebar-inner-main-nav {
    bottom: 70px;
}

.page-wrapper.menu-close .LeftBarHeader .logo-link {
        height:70px
    }

.page-wrapper.menu-close .nav-subscription-item {
        height:70px
    }
.page-wrapper.menu-close .nav-subscription-item .channel-image {
        width:40px;
        height: 40px
    }
.page-wrapper.menu-close .nav-subscription-item .login-icon {
        left:30px;
        top: 20px;
        width: 30px;
        height: 30px
    }
.page-wrapper.menu-close .nav-subscription-item .videos-count {
        top:40px;
        right: 25px;
        width: 20px;
        border-radius: 30px;
        text-indent: 1px;
        font-size: 11px
    }
.page-wrapper.menu-close .nav-subscription-item .channel-name {
        width:0;
        color: transparent!important
    }
.page-wrapper.menu-close .nav-subscription-item.active .videos-count {
        background:#00afec
    }
.page-wrapper.menu-close .nav-subscription-item .channel-image.is-icon i {
    font-size: 20px;
    line-height: 40px;
}
.page-wrapper.menu-close .LeftBarHeader .logo-icon {
    display: block;
    margin-left: 10px;
    visibility: visible;
    transition: visibility 2s;
    transition-delay: 0.8s;
   }

.page-wrapper.menu-close .menu-btn {
   margin: 0 0;
   margin-left: 15px;
   margin-top: 23px;
}
.sidebar {
    transition: width 0.8s ease-in-out;
    overflow: hidden;
    white-space: nowrap;
}

.page-wrapper {
    transition: padding 0.8s ease-in-out;
}

.page-wrapper.menu-close .left-nav-user-area .dropup-item {
    height: 70px;
    padding-left: 0px;
    padding-right: 23px;
    line-height: 30px;
    text-align: center;
    }
.page-wrapper.menu-close .left-nav-user-area .dropup-item>i {
     position: static;
    }
@media (max-width: 1200px) {
    .menu-btn {
        display: none;
    }
    .left-nav-user-area .dropup {
        .2s opacity ease,.7s background cubic-bezier(.25,1,.25,1);
    }
    .LeftBarHeader .logo-icon {
       margin-left: 10px;
    }
}

.left-nav-user-area .dropup {
    transition: none;
}

.nav-subscription-item .channel-name {
    transition-delay: 0.4s;
}
@media (min-width: 1201px){
.LeftBarHeader .logo-icon {
    display: inherit;
    visibility: hidden;
    }
}
.LeftBarHeader .logo-icon {
    display: inherit;
` );

var menuBtn = document.createElement("div");
menuBtn.classList.add("menu-btn");
menuBtn.classList.add("left");
var spanOne = document.createElement("span");
menuBtn.appendChild(spanOne);
var spanTwo = document.createElement("span");
menuBtn.appendChild(spanTwo);
var spanThree = document.createElement("span");
menuBtn.appendChild(spanThree);
var spanFour = document.createElement("span");
menuBtn.appendChild(spanFour);
var spanFive = document.createElement("span");
menuBtn.appendChild(spanFive);

/*const leftBarHeader =
        document.getElementsByClassName('LeftBarHeader');

leftBarHeader.appendChild(menuBtn);*/

const leftBarHeader = document.querySelector(".LeftBarHeader");
const pageWrapper = document.querySelector(".page-wrapper");
const leftUserMenu = document.querySelector(".left-nav-user-area");

leftBarHeader.appendChild(menuBtn);

menuBtn.addEventListener("click", toggleMenu);

let showMenu = false;

function toggleMenu() {
        if (!showMenu) {
            menuBtn.classList.remove("left");
            menuBtn.classList.add("right");
            pageWrapper.classList.add("menu-close");
            leftUserMenu.classList.add("toggle-open");
            showMenu = true;
        } else {
            menuBtn.classList.remove("right");
            menuBtn.classList.add("left");
            pageWrapper.classList.remove("menu-close");
            leftUserMenu.classList.remove("toggle-open");
            showMenu = false;
        }
    }