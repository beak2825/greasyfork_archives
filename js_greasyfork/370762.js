// ==UserScript==
// @name         下载微博图片和视频
// @name:en   Download Weibo Images and Video
// @namespace    https://greasyfork.org/zh-CN/users/127123-flao
// @version      1.5.2
// @description  一键下载一条微博中的图片，文件名包含该微博的路径．xxx_wb_uid_wid，可恢复为 https://weibo.com/uid/wid
// @description:en Download images from weibo with user-id and weibo-id in its filename. filname format xxx_wb_uid_wid
// @author       Flao
// @match        https://weibo.com/*
// @match        https://www.weibo.com/*
// @grant        none
// @license      MIT License
// @run-at       document-end
// @connect      *://*.sinaimg.cn
// @downloadURL https://update.greasyfork.org/scripts/370762/%E4%B8%8B%E8%BD%BD%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E5%92%8C%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/370762/%E4%B8%8B%E8%BD%BD%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E5%92%8C%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==


(function() {

   var doDownload = function(blob, filename) {
       var a = document.createElement('a');
       a.download = filename;
       a.href = blob;
       a.click();
  }

// Current blob size limit is around 500MB for browsers
  var download = function (url, filename) {
     if (!filename) filename = url.split('\\').pop().split('/').pop();
     fetch(url, {
        headers: new Headers({
          'Origin': location.origin
      }),
       mode: 'cors'
     })
    .then(response => response.blob())
    .then(blob => {
      let blobUrl = window.URL.createObjectURL(blob);
      doDownload(blobUrl, filename);
    })
    .catch(e => {console.error(e); return false;});

    return true;
  }

  var toast = function(text, duration) {
     if(isNaN(duration)) duration = 1500;
      let _toast = document.createElement('div');
      _toast.innerText = text;
      _toast.style.cssText = 'width: 60%; height:50px; line-height: 50px; min-width:100px;text-align: center; font-size: 15px;' +
      'position: fixed; top: 60%; left: 40%; background: rgb(0,0,0); color:rgb(255,255,255); opacity:0.75; z-index: 999';
      document.body.children[0].appendChild(_toast);

      _toast.style.transition = 'all 0.7s';
      _toast.style.webkitTransition = 'all 0.7s';

      setTimeout(function() {
          _toast.style.opacity = 0;
          setTimeout(()=> { document.body.children[0].removeChild(_toast);},700);

      }, duration);
  }

  // global variables
  var globalValue = "";
  var inputBoxDict = new Map();
  var proceedList = new WeakSet();
  var imgPathReg = new RegExp("(https://[\\S]+/)([\\S]+)(/[\\S]+)");

  var buttonOnClick = function(e) {
      let buttonData = inputBoxDict.get(this); // path
      let inputName = this.previousSibling.value && this.previousSibling.value.split('@')[0];

      let fileName = (inputName && inputName + '_') + 'wb_' + buttonData[0] + '_' + buttonData[1];

      var imgList = this.parentNode.parentNode.getElementsByClassName('media_box')[0].children[0].children; // media_box > ul >li
      //  set the page mask
      let pages = this.previousSibling.value.split('@')[1];
      let temp = /[0-9]*/.exec(pages);
      pages = temp && temp[0];
      let mask = new Uint8Array(imgList.length);
      if(!pages){
         mask.fill(1);
      }
      else {
        console.log(pages, '_', pages.length);
        for(var i = 0; i < pages.length; i++) {
          let num = pages[i] - 1;
          if(num > mask.length || num < 0) continue;
          mask[num] = 1;
        }
      }
      console.log(mask);
      // check if the media is video
      let firstMediaClass = imgList[0].classList[0];
      if(firstMediaClass === 'WB_video') {
          let videoElem = imgList[0].getElementsByTagName('video')[0];
          let result = download(videoElem.src, fileName);
          if(result === false) {toast('下载出错，详见控制台');}
          else {toast('下载开始');}
          return;
      }
      // else download images
      var failedList = [];
      for(var j = 0; j < imgList.length; j++) {
          if(mask[j] === 0) continue;
          let result = true;
          let child = imgList[j].children[0];
          var imgsrc = '';
          // check whether picture or gif
          if(child.tagName === 'IMG') {
              imgsrc = child.src.replace(imgPathReg,'$1large$3'); // replace ....sinaming.cn/XXX/YYY.jpg' with '...sinaimg.cn/large/YYY.jpg'
              result = download(imgsrc, fileName + '_' + j);
          }
          else {
              imgsrc = child.children[0].src.replace(imgPathReg, '$1large$3');
              result = download(imgsrc, fileName + '_' + j + '.gif');
          }
          if(result === false) failedList.push(j+1);
      }
      if(failedList.length !== 0) {
         toast('第 ' + failedList + ' 下失败，详见控制台');
      }
      else {
         toast('全部下载开始');
      }
  }

  var getWeiboPath = function(media_box) {
      var path = "";
      if(media_box.parentNode.nextElementSibling &&
           media_box.parentNode.nextElementSibling.classList.contains('WB_func')) {
         path = media_box.parentNode.nextElementSibling.children[0].children[0].children[0].children[0].children[0].href;
         // let date = media_box.parentNode.nextElementSibling.children[0].children[0].children[0].children[0].children[0].title;
         path = path.split("?")[0].split("/").slice(3,5);
      }
      else {
         path = media_box.parentNode.parentNode.children[1].children[0].href; // in an independent weibo page
         //let date = media_box.parentNode.parentNode.children[1].children[0].title;
         path = path.split("?")[0].split("/").slice(3,5);

      }
      return path;

  }

  var addFunction = function(){
        var lists = document.getElementsByClassName('media_box');
        console.log('media_box list.length = ' + lists.length);
        for( var i = 0; i < lists.length; i++) {
            var list = lists[i].parentNode.parentNode.children[1];
            if(proceedList.has(list)) {
               continue;
            }
            proceedList.add(list);
            var inputBox = document.createElement('input');
            inputBox.style.width = '20%';
            inputBox.style.height = '70%';
            inputBox.style.float = "right";
            inputBox.style.marginLeft = '5px';
            inputBox.style.opacity = "0.2";

            var button = document.createElement('a');
            button.setAttribute('class','S_txt2');
            button.innerText = '下载图片';
            button.href = 'javascript:void(0)';
            button.input = inputBox;

            var path = getWeiboPath(lists[i]);
            button.onclick = buttonOnClick;
            button.style.float = "right";

            inputBoxDict.set(button,path);

            list.appendChild(inputBox);
            list.appendChild(button);
        }
    }
    window.addEventListener ("load", ()=>{
                             setTimeout(addFunction,1000);
    });

   (function () {
    var DOMObserverTimer = false;
    var DOMObserverConfig = {
      attributes: true,
      childList: true,
      subtree: true
    };
    var DOMObserver = new MutationObserver(function () {
      if (DOMObserverTimer !== 'false') {
        clearTimeout(DOMObserverTimer);
      }
      DOMObserverTimer = setTimeout(function () {
        DOMObserver.disconnect();
        addFunction();
        DOMObserver.observe(document.body, DOMObserverConfig);
      }, 1000);
    });
    DOMObserver.observe(document.body, DOMObserverConfig);
  }) ();

})();