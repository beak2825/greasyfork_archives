// ==UserScript==
// @name         Rule34 Image Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  makes easier to download images from rule34.xxx
// @author       mainCharacter
// @match        https://rule34.xxx/*
// @icon         https://www.google.com/s2/favicons?domain=rule34.xxx
// @connect      https://rule34.xxx/*
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/435222/Rule34%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/435222/Rule34%20Image%20Downloader.meta.js
// ==/UserScript==

function download_image(image_page_link){
  console.log("Downloading image: "+image_page_link);
  let xhr = new XMLHttpRequest();
  xhr.open('GET', image_page_link, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
       let tmp = document.createElement('div');
       tmp.innerHTML = xhr.responseText;
       let imgLink = tmp.querySelector("img#image").src;
       console.log(imgLink);
       let fileName = getFilenameFromLink(imgLink);
       GM_download({
         url:imgLink,
         name:fileName,
         saveAs:false
       });
    }
  }

}
function getFilenameFromLink(link){
  let result = link.slice(link.lastIndexOf("/")+1,link.lastIndexOf("?"));
  return result;
}
(function() {
    'use strict';

    let content_div = document.querySelector("div.content div");
    let posts = content_div.querySelectorAll("span");
    if(document.location.href.indexOf("s=view") !== -1){
     return;
    }
    //Download individual image
    posts.forEach(function(post){
        let button = document.createElement("button");
        button.innerHTML="<p  style='margin: 2px; font-size: 13px;' >"+"Donwload"+"</p>";
        button.style="color: white;	background-color: #1da1f2;	border: 0px white;	border-radius: 5px;margin: 2px;height: 32px;width: 100px";
        let link = post.querySelector("a").href;
        button.onclick=function() {
            download_image(link);
        }
        post.prepend(button);
    });
    //Download all images on the page
    let buttonAll = document.createElement("button");
    buttonAll.innerHTML="<p  style='margin: 2px; font-size: 13px;' >"+"Donwload All"+"</p>";
    buttonAll.style="color: white;	background-color: #5c12b8;	border: 0px white;	border-radius: 5px;margin: 2px;height: 50px;width: 100%";
    buttonAll.onclick=function() {
      posts.forEach(function(post){
      let post_a = post.querySelector("a");
      console.log(post_a.href);
      let xhr = new XMLHttpRequest();
      xhr.open('GET', post_a.href, true);
      xhr.send();

      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            let tmp = document.createElement('div');
            tmp.innerHTML = xhr.responseText;
            let imgLink = tmp.querySelector("img#image").src;
            console.log(imgLink);
            let fileName = getFilenameFromLink(imgLink);

            GM_download({
              url:imgLink,
              name:fileName,
              saveAs:false
            });

        }
      }
    });
  }
    document.querySelector("div.content").prepend(buttonAll);

})();