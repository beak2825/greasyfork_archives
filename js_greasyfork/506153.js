// ==UserScript==
// @name        expend pics
// @namespace   twitter
// @name:zh-TW  縮圖放大
// @match       https://x.com/*
// @grant       none
// @icon        https://twitter.com/favicon.ico
// @version     2025/9/6 下午04:22:59
// @author      qq
// @license     MIT
// @description expend thumbnail
// @description:zh-TW 將縮圖放大
// @downloadURL https://update.greasyfork.org/scripts/506153/expend%20pics.user.js
// @updateURL https://update.greasyfork.org/scripts/506153/expend%20pics.meta.js
// ==/UserScript==

function transformHTML(element) {
  try {
    const mainDiv = element.querySelector('div[id][aria-labelledby]');
    if (!mainDiv) return;

    const containsVideo = mainDiv ? mainDiv.outerHTML.includes('video') : false;
    if (containsVideo) return;


    const newStructure = document.createElement('div');
    newStructure.className = mainDiv.className || '';
    newStructure.id = mainDiv.id || '';
    newStructure.setAttribute('aria-labelledby', mainDiv.getAttribute('aria-labelledby') || '');
    newStructure.setAttribute('aria-labelledbydone', 'true');

    const divClasses = [
      'css-175oi2r r-9aw3ui'
      ,'css-175oi2r'
      ,'css-175oi2r r-k200y'
      ,'css-175oi2r r-1kqtdi0 r-1phboty r-rs99b7 r-1867qdf r-1udh08x r-o7ynqc r-6416eg r-1ny4l3l'
      ,'css-175oi2r r-1mlwlqe r-1udh08x r-417010 r-aqfbo4 r-agouwx r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af'
      ,'css-175oi2r'
    ];
    const nestedDivs = divClasses.reduce((acc, className) => {
      const div = document.createElement('div');
      div.className = className;
      if (acc) acc.appendChild(div);
      return div;
    }, null);

    const imageContainer = document.createElement('div');
    imageContainer.className = 'css-175oi2r r-16y2uox r-1pi2tsx r-13qz1uu';

    //imageContainer.className = 'css-175oi2r r-1mlwlqe r-1udh08x r-417010 r-aqfbo4 r-agouwx r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af';


    // 處理每個圖片鏈接
    mainDiv.querySelectorAll('a').forEach(aa => {
      if (!aa) return; // 跳過無效的元素

      try {
        const newA = aa.cloneNode(false);
        newA.className = 'css-175oi2r r-1pi2tsx r-1ny4l3l r-1loqt21';

        const innerDiv = document.createElement('div');
        innerDiv.className = 'css-175oi2r r-1adg3ll r-1udh08x';
        innerDiv.style.width = '522px';
        innerDiv.style.height = '100%';

        // 添加 padding-bottom div
        const paddingDiv = document.createElement('div');
        paddingDiv.className = 'r-1adg3ll r-13qz1uu';
        paddingDiv.style.paddingBottom = '125.031%';
        innerDiv.appendChild(paddingDiv);

        // 添加包含圖片的 div
        const imageWrapperDiv = document.createElement('div');
        imageWrapperDiv.className = 'r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu';

        const imageDiv = aa.querySelector('div[aria-label]');
        if (!imageDiv) {
          console.log('Image div not found aa=');
          console.log(aa.outerHTML);
          // throw new Error('Image div not found');
        }//if (!imageDiv)
        else {
          const clonedImageDiv = imageDiv.cloneNode(true);

          // 修改背景圖片的 URL
          const bgDiv = clonedImageDiv.querySelector('div[style*="background-image"]');
          if (bgDiv && bgDiv.style.backgroundImage) {
            let bgUrl = bgDiv.style.backgroundImage;
            //bgUrl = bgUrl.replace(/name=\w+/, 'name=small');
            bgUrl = bgUrl.replace(/name=\w+/, '');
            bgDiv.style.backgroundImage = bgUrl;
          }

          // 修改 img 標籤的 src
          const img = clonedImageDiv.querySelector('img');
          if (img && img.src) {
            console.log('****img.src****');
            console.log(img.src);
            //img.src = img.src.replace(/name=\w+/, 'name=small');
            img.src = img.src.replace(/name=\w+/, '');
          }

          imageWrapperDiv.appendChild(clonedImageDiv);
          innerDiv.appendChild(imageWrapperDiv);
          newA.appendChild(innerDiv);
          imageContainer.appendChild(newA);
        }


      } catch (error) {
        console.error('Error processing image link:', error);
      }
    });

    nestedDivs.appendChild(imageContainer);
    // newStructure.appendChild(divClasses[0] === nestedDivs.className ? nestedDivs : nestedDivs.firstChild);
    newStructure.appendChild(nestedDivs);

    // 替換原始的 HTML
    if (mainDiv.parentNode) {
      mainDiv.parentNode.replaceChild(newStructure, mainDiv);
    }
  } catch (error) {
    console.error('Error in transformHTML:', error);
  }
}

setTimeout(function(){

  document.querySelectorAll('div[id][aria-labelledby]:not([aria-labelledbydone])').forEach(div => {
    if (div.parentElement) transformHTML(div.parentElement);
    // if (!!div) transformHTML(div);
  });
},1000);



function handleScroll() {
  // document.querySelectorAll('div[id][aria-labelledby]').forEach(div => {
  setTimeout(function(){

    document.querySelectorAll('div[id][aria-labelledby]:not([aria-labelledbydone])').forEach(div => {
      if (div.parentElement) transformHTML(div.parentElement);
      // if (!!div) transformHTML(div);
    });
  }, 3000)

}

// // 添加滾輪事件監聽器
// window.addEventListener('wheel', handleScroll);



// 創建一個 MutationObserver 實例
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // 檢查新增的元素是否包含目標結構
          // const targetDiv = node.querySelector('div[id][aria-labelledby]');
          const targetDiv = node.querySelector('div[id][aria-labelledby]:not([aria-labelledbydone])');
          if (!!targetDiv) {
            console.log('-------------targetDiv-------------');
            console.log(targetDiv);
            console.log('node');
            console.log(node);
            setTimeout(function(){
              transformHTML(node);
            }, 3000);
          }
        }
      });
    }
  });
});

// 配置 observer
const config = { childList: true, subtree: true };

// 開始觀察目標節點（例如 body 或主要內容容器）
observer.observe(document.body, config);