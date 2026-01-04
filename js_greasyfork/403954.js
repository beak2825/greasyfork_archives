// ==UserScript==
// @name        Redirect Reddit to show new posts
// @namespace   Violentmonkey Scripts
// @version     1.2
// @homepage    https://greasyfork.org/en/scripts/403954-redirect-reddit-to-show-new-posts
// @description This script will automatically redirect subreddits to show new posts
// @include     https://reddit.com/r/*
// @include     https://www.reddit.com/r/*
// @author      Aar318
// @description Script to Redirect subreddits to show new posts - 5/16/2020, 12:47:17 PM
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/403954/Redirect%20Reddit%20to%20show%20new%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/403954/Redirect%20Reddit%20to%20show%20new%20posts.meta.js
// ==/UserScript==

  // Redirect Reddit to show new posts //

(function () {
"use strict";

const { pathname, origin, href } = window.location;

if (href.includes("/comments")) return; // comment this out to function again

if (!pathname.includes("/new"))
  window.location.href = `${origin}${pathname}${
    pathname.endsWith("/")
      ? ""
      : "/"
//  }embed?pub=true`;
  }new`; 
})();


setTimeout(function(){
  document.querySelector('button#LayoutSwitch--picker').click();
  console.log("Layout Switcher");
}, 500);

setTimeout(function(){
  document.querySelector('button._10K5i7NW6qcm-UoCtpB3aK._3LwUIE7yX7CZQKmD2L87vf._1F02c6Yw0dfhdWwl99UrYn._1oYEKCssGFjqxQ9jJMNj5G').click();  
  console.log("Classic View");
}, 800);

setTimeout(function(){
  document.querySelector('h1._2yYPPW47QxD4lFQTKpfpLQ').click();  
  console.log("Click off of Picker");
}, 1000);

//button._10K5i7NW6qcm-UoCtpB3aK._3LwUIE7yX7CZQKmD2L87vf._1F02c6Yw0dfhdWwl99UrYn._1oYEKCssGFjqxQ9jJMNj5G //classic
//button#LayoutSwitch--picker._10K5i7NW6qcm-UoCtpB3aK._3LwUIE7yX7CZQKmD2L87vf._1F02c6Yw0dfhdWwl99UrYn._1fiOgAxLiYfEU41C1NOX9B._1IKtbRloF_LV1hPqMzP3MC // picker
