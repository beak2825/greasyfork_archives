// ==UserScript==
// @name        Visual Studio扩展快捷下载
// @namespace   PeCode
// @match       https://marketplace.visualstudio.com/items?itemName=*
// @grant       none
// @version     1.0
// @author      PCL-AaCin
// @description 2021/12/26 下午4:55:50
// @downloadURL https://update.greasyfork.org/scripts/437601/Visual%20Studio%E6%89%A9%E5%B1%95%E5%BF%AB%E6%8D%B7%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/437601/Visual%20Studio%E6%89%A9%E5%B1%95%E5%BF%AB%E6%8D%B7%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

var dbun = document.createElement("div");

dbun.style.cursor = "pointer";
dbun.style.width = "120px";
dbun.style.height = "32px";
dbun.style.lineHeight = "32px";
dbun.style.userSelect = "none";
dbun.style.textAlign = "center";
dbun.style.backgroundColor = "#0099FF";
dbun.style.color = "white";
dbun.style.marginLeft = "8px";
dbun.style.display = "inline-block";
dbun.style.verticalAlign = "top";
dbun.innerText = "Download";
dbun.classList = [ "download" ];

setInterval(function(){
  if(document.getElementsByClassName("install")[0].parentNode.getElementsByClassName("download").length == 0) document.getElementsByClassName("install")[0].parentNode.insertBefore(dbun,document.getElementsByClassName("install")[0].nextElementSibling);
},1000);

dbun.onclick = function(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://' + window.location.search.replace(/.*\=/, "").split(".")[0] + '.gallery.vsassets.io/_apis/public/gallery/publisher/' + window.location.search.replace(/.*\=/, "").split(".")[0] + '/extension/' + window.location.search.replace(/.*\=/, "").split(".")[1] + '/' + document.getElementById("version").nextElementSibling.innerText + '/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage', true);
  xhr.responseType = 'blob';
  
  var bar = document.createElement("div");
  
  bar.style.position = "fixed";
  bar.style.left = "0px";
  bar.style.top = "0px";
  bar.style.lineHeight = "25px";
  bar.style.textAlign = "left";
  bar.style.width = "140px";
  bar.style.padding = "8px 15px";
  bar.style.backgroundColor = "white";
  bar.style.boxShadow = "0px 0px 10px rgb(0 0 0 / 10%)";
  
  document.body.appendChild(bar);
  
  xhr.addEventListener("progress",
  function(evt) {
    if (evt.lengthComputable) {
      bar.innerText = "缓存中：" + String((evt.loaded / evt.total * 100).toFixed(2)) + "%"
    }
  },
  false);
  
  xhr.onload = function() {
    if (xhr.status === 200) {
      document.body.removeChild(bar);
      
      var down = document.createElement("a");
      down.download = window.location.search.replace(/.*\=/, "") + "-" + document.getElementById("version").nextElementSibling.innerText + ".VSIXPackage";
      down.href = window.URL.createObjectURL(new Blob([window.URL.createObjectURL]));
      down.click()
    }
  }
  xhr.send();
}