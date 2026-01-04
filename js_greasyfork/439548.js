// ==UserScript==
// @name         谷变饼 -- Google 使用 Bing 壁纸
// @namespace    http://tampermonkey.net/
// @version      0.6-20240314
// @description  Google 使用 Bing 壁纸。
// @license      AGPL-3.0 License
// @author       plasma
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      global.bing.com
// @connect      www.bing.com
// @connect      cn.bing.com
// @include      *://www.google.com/
// @exclude      /^https?://www\.google\.com(\.[a-z]+)/.*search?q=.+/
// @exclude      /^https?://www\.google\.com(\.[a-z]+)/.*&q=.+/
// @exclude      /^https?://www\.google\.com\.hk/.*&q=.+/
// @exclude      /^https?://www.google.com/#newwindow=1&q=
// @exclude      /^https?://www.google.com.hk/#newwindow=1&q=

// @downloadURL https://update.greasyfork.org/scripts/439548/%E8%B0%B7%E5%8F%98%E9%A5%BC%20--%20Google%20%E4%BD%BF%E7%94%A8%20Bing%20%E5%A3%81%E7%BA%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/439548/%E8%B0%B7%E5%8F%98%E9%A5%BC%20--%20Google%20%E4%BD%BF%E7%94%A8%20Bing%20%E5%A3%81%E7%BA%B8.meta.js
// ==/UserScript==

function removeElement(className) {
  try {
    let elements = document.getElementsByClassName(className);
    if (elements.length > 0) elements[0].remove();
  } catch(e) {
    console.error(`Error removing element with class ${className}:`, e);
  }
}

(function() {

    'use strict';

    //block float element
    removeElement("FPdoLc lJ9FBc");
    removeElement("vcVZ7d");
    removeElement("o3j99 c93Gbe");
    removeElement("LX3sZb");
    removeElement("lJ9FBc");
    removeElement("oBa0Fe aciXEb");
    try{
        document.getElementsByClassName("lnXdpd")[0].style.borderRadius='30px'
    } catch(e){
        console.error(`BorderRadiusError`);
    }
    //block end


    // Google2Bing, codes referenced from here:
    // https://greasyfork.org/zh-CN/scripts/30152-google%E8%B0%83%E7%94%A8bing%E5%A3%81%E7%BA%B8
    // https://greasyfork.org/zh-CN/scripts/25202-%E7%99%BEbing%E5%9B%BE

    var url="https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US"; //or 'mkt=zh-cn'

    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            var jsonData = null;
            jsonData = JSON.parse(response.responseText);
            var bgUrl=jsonData.images[0].url;
            if(!/^https?:\/\//.test(bgUrl)){
                bgUrl="https://cn.bing.com"+bgUrl;
            }
            var newHTML = document.createElement ('div');
            newHTML.innerHTML = '<div id="cpBackgroundDiv" style="position: fixed;top: 0%;left: 0%; width: 100%;height: 100%;z-index: -1; visibility: visible;"><img id="cpBackgroundImg" src="'+bgUrl+'" style="width: 100%;height: 100%;"></div>';
            document.body.appendChild (newHTML);
        }
    });

})();