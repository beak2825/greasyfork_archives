// ==UserScript==
// @name         bcy(半次元)查看原图&下载原图
// @version      1.1.0
// @description    在每张图片下面增加查看原图&下载原图
// @author       opentdoor
// @match        http://bcy.net/*/detail/*
// @match        https://bcy.net/*/detail/*
// @grant        none
// @namespace https://greasyfork.org/users/92069
// @downloadURL https://update.greasyfork.org/scripts/26281/bcy%28%E5%8D%8A%E6%AC%A1%E5%85%83%29%E6%9F%A5%E7%9C%8B%E5%8E%9F%E5%9B%BE%E4%B8%8B%E8%BD%BD%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/26281/bcy%28%E5%8D%8A%E6%AC%A1%E5%85%83%29%E6%9F%A5%E7%9C%8B%E5%8E%9F%E5%9B%BE%E4%B8%8B%E8%BD%BD%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==
function GetOPath(url)
{
    if(window.__ssr_data)
    {
        var dic=window.__ssr_data.detail.post_data.multi;
        if(dic){
            let rs=dic.filter((v,i)=>v.path==url);
            if(rs&&rs.length>0){
                return rs[0].original_path
            }
        }
    }
    return url.replace(/p\d{1,2}\-bcy\.byteimg\.com\/img\/banciyuan/ig, 'img-bcy-qn.pstatp.com').replace('~tplv-banciyuan-w650.image', '');

}
function GM_Pload() {
  'use strict';
  var imgs = document.querySelectorAll(".img-wrap img");
  var i = 1;
  var title = document.title.replace(/\|.*$/i, '').replace(/(^\s*|\s*$)/ig, "");
  var cn = document.querySelector(".detail-user-info .user-name").innerText;
  if (cn) title += "-cn_" + cn;
  title = title.replace(/[\\\/\?\<\>\|\*"]/ig, '_');
  imgs.forEach(function (v,i) {
      console.log(v);
    var $this = v;
    var url = GetOPath(v.src)
    var av = document.createElement('a');
       var p=v ;
     while(p.parentElement!=null){
         p=p.parentElement;
        if(p.classList.contains('img-wrap')){
            break;
        }
     }
    p.style.position="relative";
    p.style.marginBottom="32px";
    var container=document.createElement('div');
    av.href =url;
    av.target = "_blank";
    av.title = title + (i > 9 ? i : '0' + i);
    av.innerHTML = "查看原图";
    var complete = v.complete;
    if (!complete) {
      $this.addEventListener('load', function () {
        setTimeout(function () {
          var right = Number(((p.clientWidth - $this.clientWidth) / 2).toFixed(0));
          ad.style.right = right + "px";
          av.style.right = (right + 66) + "px";
        }, 80);
      });
    }
    var right = Number(((p.clientWidth - Math.max($this.clientWidth, 132)) / 2).toFixed(0));
    av.style.cssText = "z-index:999;position:absolute;width:66px;font-size:12px;text-align:center;bottom:-21px;right:" + (right + 66) + "px;background:rgba(255,255,255,0.6);";
    container.appendChild(av);
    var ad = av.cloneNode(true);
    ad.style.right = right + "px";
    ad.innerHTML = "下载原图";
    var ex = /\.\w+$/i.exec(url);
    ad.download = ad.title + (ex && ex.length ? ex[0]=='.image'?'.jpg':ex[0]: ".jpg");
    container.appendChild(ad);
    p.appendChild(container);
    i++;
  });
  function Download(a) {
    var xhr = new XMLHttpRequest();
    var oldhtml = a.innerHTML;
    xhr.open("GET", a.href, true);
    xhr.responseType = 'blob';
    xhr.onprogress = function (e) {
      if (e.lengthComputable) {
        a.innerHTML = (e.loaded / e.total * 100).toFixed(2) + "%";
      }
    };
    xhr.onload = function (e) {
      if (this.status == 200) {
        var blob = this.response;
        saveFile(blob, a.download);
        a.innerHTML = oldhtml;
        a.isDownload = false;
      }
    };
    xhr.send(null);
  }
  function saveFile(blob, filename) {
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, filename);
    } else {
      var a = document.createElement("a");
      var url = URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, true);
        a.dispatchEvent(evt);
      URL.revokeObjectURL(url);
    }
  }
  var ars = document.querySelectorAll("a[href][download]");
  for (var j = 0; j < ars.length; j++) {
    var a = ars[j];
    a.addEventListener("click", function (e) {
      e.preventDefault();
      if (!this.isDownload) Download(this);
      this.isDownload = true;
      return false;
    }, true);
  }
};
if(document.querySelectorAll(".img-wrap img").length)
{
  GM_Pload();
}else{
    window.onload=GM_Pload;
}
