// ==UserScript==
// @name     Expand raddle images inline
// @description Adds a button to choose between full-size display (Card layout), collapsed display and default display for image posts
// @version  1.2
// @grant    none
// @include  https://raddle.me*
// @license  MIT
// @namespace https://greasyfork.org/users/1097123
// @downloadURL https://update.greasyfork.org/scripts/468505/Expand%20raddle%20images%20inline.user.js
// @updateURL https://update.greasyfork.org/scripts/468505/Expand%20raddle%20images%20inline.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  let posts = document.querySelectorAll("article");
  for(let post of posts) {
    if (post.classList != null && post.classList.contains("submission--has-thumbnail")) {
      let img = post.querySelector("img.submission__thumb");
      let thumbUrls = img.src.split("/");
      let imageName = thumbUrls[thumbUrls.length-1];
      let imageUrl = "https://raddle.me/submission_images/" + imageName;
          
      //Add a new node that contains the full-size image
      let div = document.createElement("div");
      div.classList.add("userscript_submission__expanded_image");
      div.classList.add("hidden_fullsize_image");
      let imgNode = document.createElement("img");
      imgNode.src = imageUrl;
      imgNode.classList.add("userscript_expanded_image");
      div.appendChild(imgNode);
          
      post.appendChild(div);
      
      let expandLinkItem = document.createElement("li");
      let expandLink = document.createElement("a");
      let strongText = document.createElement("strong");
      expandLink.href = "javascript:void(0);";
      expandLink.classList.add("text-sm");
      strongText.innerText = "expand";
      strongText.classList.add("userscript_expand_button_text");
      expandLink.appendChild(strongText);
      expandLink.onclick = function() {
        if(div.classList.contains("hidden_fullsize_image")) {
          div.classList.remove("hidden_fullsize_image");
          strongText.innerText = "collapse";
        } else {
          div.classList.add("hidden_fullsize_image");
          strongText.innerText = "expand";
        }
      };
      expandLinkItem.appendChild(expandLink);
      expandLinkItem.classList.add("userscript_expand_button");
      let navList = post.querySelector("nav.submission__nav ul");
      navList.insertBefore(expandLinkItem, navList.firstChild);
    }
  }
  
  let head = document.getElementsByTagName("head")[0];
  let style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = ".userscript_expanded_image { display: block; margin:auto; max-width: 100%; } .userscript_submission__expanded_image { margin: 1em 0 5em 0; } .hidden_fullsize_image { display: none; } .hidden_expand_button { display: none; }";
  head.appendChild(style);
  
  
  let pageNav = document.querySelector("main > nav");
  let ul = document.createElement("ul");
  ul.classList.add("unlistify", "flex");
  let li = document.createElement("li");
  li.classList.add("dropdown");
  let button = document.createElement("button");
  button.classList.add("dropdown__toggle", "tab", "no-underline", "unbuttonize");
  button.type = "button";
  button.innerHTML = '<span class="icon  "><svg width="16" height="16"><use xlink:href="/build/images/icons.64b6a2fd.svg#sort"></use></svg></span><span class="no-underline__exempt userscript_button_text">Collapsed</span><span class="dropdown__arrow"></span>';
  
  let optionsList = document.createElement("ul");
  optionsList.classList.add("dropdown__menu", "dropdown-card", "unlistify");
  let optionDefault = document.createElement("li");
  let optionCollapse = document.createElement("li");
  let optionCard = document.createElement("li");
  
  let linkDefault = document.createElement("a");
  let linkCollapse = document.createElement("a");
  let linkCard = document.createElement("a");
  
  
  
  
  
  
  const setViewDefault = function() {
    let buttons = document.querySelectorAll("li.userscript_expand_button");
    for(let button of buttons) {
      if(!button.classList.contains("hidden_expand_button")) {
        button.classList.add("hidden_expand_button");
      }
    }
    
    let images = document.querySelectorAll("div.userscript_submission__expanded_image");
    for(let image of images) {
      if(!image.classList.contains("hidden_fullsize_image")) {
        image.classList.add("hidden_fullsize_image");
      }
    }
    
    document.querySelector(".userscript_button_text").innerText = "Raddle";
    if(!linkDefault.classList.contains("menu-item--active")) linkDefault.classList.add("menu-item--active");
    linkCollapse.classList.remove("menu-item--active");
    linkCard.classList.remove("menu-item--active");
    window.localStorage.setItem("userscript_raddle_fullsize_view", 1);
  };
  linkDefault.href = "javascript:void(0);";
  linkDefault.classList.add("no-wrap", "menu-item");
  linkDefault.onclick = () => setViewDefault();
  linkDefault.innerText = "Raddle";
  optionDefault.appendChild(linkDefault);
  
  
  
  
  
  const setViewCollapsed = function() {
    let buttons = document.querySelectorAll("li.userscript_expand_button");
    for(let button of buttons) {
      if(button.classList.contains("hidden_expand_button")) {
        button.classList.remove("hidden_expand_button");
      }
    }
    
    let images = document.querySelectorAll("div.userscript_submission__expanded_image");
    for(let image of images) {
      if(!image.classList.contains("hidden_fullsize_image")) {
        image.classList.add("hidden_fullsize_image");
      }
    }
    
    let texts = document.querySelectorAll("strong.userscript_expand_button_text");
    for(let text of texts) {
      text.innerText = "expand";
    }
    
    document.querySelector(".userscript_button_text").innerText = "Collapsed";
    linkDefault.classList.remove("menu-item--active");
    if(!linkCollapse.classList.contains("menu-item--active")) linkCollapse.classList.add("menu-item--active");
    linkCard.classList.remove("menu-item--active");
    window.localStorage.setItem("userscript_raddle_fullsize_view", 2);
  };
  linkCollapse.href = "javascript:void(0);";
  linkCollapse.classList.add("no-wrap", "menu-item", "menu-item--active");
  linkCollapse.onclick = () => setViewCollapsed();
  linkCollapse.innerText = "Collapsed";
  optionCollapse.appendChild(linkCollapse);
  
  
  
  
  const setViewCard = function() {
    let buttons = document.querySelectorAll("li.userscript_expand_button");
    for(let button of buttons) {
      if(!button.classList.contains("hidden_expand_button")) {
        button.classList.add("hidden_expand_button");
      }
    }
    
    let images = document.querySelectorAll("div.userscript_submission__expanded_image");
    for(let image of images) {
      if(image.classList.contains("hidden_fullsize_image")) {
        image.classList.remove("hidden_fullsize_image");
      }
    }
    
    document.querySelector(".userscript_button_text").innerText = "Card";
    linkDefault.classList.remove("menu-item--active");
    linkCollapse.classList.remove("menu-item--active");
    if(!linkCard.classList.contains("menu-item--active")) linkCard.classList.add("menu-item--active");
    window.localStorage.setItem("userscript_raddle_fullsize_view", 3);
  };
  linkCard.href = "javascript:void(0);";
  linkCard.classList.add("no-wrap", "menu-item");
  linkCard.onclick = () => setViewCard();
  linkCard.innerText = "Card";
  optionCard.appendChild(linkCard);
  
  
  
  optionsList.appendChild(optionDefault);
  optionsList.appendChild(optionCollapse);
  optionsList.appendChild(optionCard);
  
  li.appendChild(button);
  li.appendChild(optionsList);
  
  ul.appendChild(li);
  pageNav.appendChild(ul);

 
  let number = window.localStorage.getItem("userscript_raddle_fullsize_view");
  
  if(number == 1) {
    setViewDefault();
  } else if(number == 3) {
    setViewCard();
  } else {
    setViewCollapsed();
  }
  
})();
