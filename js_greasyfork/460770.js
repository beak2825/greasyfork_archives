// ==UserScript==
// @name:zh-CN         隐藏搜索页天猫店商品链接，红心等级符号等
// @name               Clean Links on Tmall Store
// @namespace          https://greasyfork.org/en/scripts/460770
// @version            0.2.4
// @description        Clean Links on Tmall Store.
// @description:zh-CN  隐藏搜索页天猫店商品链接，红心等级符号等。
// @author             cilxe
// @match              *://s.taobao.com/*
// @icon               https://www.taobao.com/favicon.ico
// @grant              unsafeWindow
// @run-at             document-start
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/460770/Clean%20Links%20on%20Tmall%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/460770/Clean%20Links%20on%20Tmall%20Store.meta.js
// ==/UserScript==

(() => {
  // 默认为 true： 隐藏无同款的商品，设为 false 时不隐藏。
  const choice = true; // hideRelatelessItems(choice);
  function hideTmalItems() {
    // Tmall link
    const links = document.getElementsByTagName('a');
    for (let i = 0; i < links.length; i += 1) {
      if (links[i].href.includes('detail.tmall.com')) {
        links[i].style.visibility = 'hidden';
      }
    }
    // store rank (黄冠)
    const imgs = document.getElementsByTagName('img');
    // const YellowCrownIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACRUlEQVQ4jXWTMWzTQBSGP0eVepaQsIeiuJuzuWJxJlomylYm0q1dkDKhrGxl7NiBgW50JFsigQRslVhcljpMyRYzYQsQZ6Gqd5GojO4caAr0Sc969+7973/+745qwViwSslquhdXn593KhNznf2G/w9cVQPrNr6miWPAjuM4Kn1R6bQPZY7Cp3ibIqIQAZSjCc2dGC18hNsk2NrH8VuOadBAl8iDqEKe4HV74IUwSfCamrC7i9/dRTSBrCCIIoLOA3T6FPWmZydy5MtuZQrE5hbl4SF8S1E3QspkRDQY2DEn29sEGzGcZahbbYLHPWajY1Tu0VDjdxasJxPk6BhWwv+qpcxnJUSfHtva5XgTNRnSwL9pC+RoDAiUqdSg9SXYxpp6T4BMxjbveoHRwMjkWQqldA2e6X8msDmpFxp7qFKzpPPCLmdBiKnRsqxp/rZzKCmpzBS+X29KxZII15klfZqhx7QA4esab5jydE5vfqOmLgtoxQKyVxC0afhbPb4PBwiR4d+LkFJdClB8tK7mQlxIhR8HCJ2R918TdPZouGv3HbfzjHL4gbg9J1Tz8bOxdRe4UIofZYNww0cnI/zOEc5qy2mYOv/uIwfvITrLWIs1spB1gzyHXNoJvhSatfVzRD5FBzsYYnuRFqWSBxuViJYRYQuizbmYGk7fw+yMn58mfM1dVp8kf3BLVy6LOdJcIOKYsj9AJic2b95EcOc2ZyoA4QHJ5WO60mCaVnK4j06H4AqE589PQJruiHaHoHeE4/o1DvgF/yAxn8aVaqwAAAAASUVORK5CYII=';
    const RedHeartIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACXklEQVQ4jaWTTUiUURSGn3u/b2YaZpzRsjETRC36GUwrsKIQDSUkpAha1KJdq6hFKbSIFkHRokXRokW72oZUUAZRiEFQKC5Ss1HDn2S0Zsb5aZw/5/tu+E1aIq584cDlvue8597DeYVSSrEByOVSdb2DaJXLivzl86i50RXV7GQ/qr19hV/KXYYwo1MqeaIJIWw49vlBgR7MgdcDj+8hNJ3o4XqKtx8kX7nJ4rODw7jL/KinDxHGnQ6legagqRqZLoFtJtjcGH1DaKaX+Nde3PWNaA1VMLlg8SaSzJPnuC5cQsRry5Tn2CkosqOmfoFDYVSXIPNuzJlxlGnHtmM36scEJPMWT+1ejIlp0p960FU0itF8BMO3GdvdR6DpyFQW4XAhq2qQ9iJUYAyicZACEsBAAH3PTszwLHrYUHhiSVRbM5T7YD6GSBuQiln/VyoEsTjoWmFsS2NPJGByhlDOQAqXHePtK7SFLOpkC6TShU6aBqEwhOcL5/+haeSnRnBWViDLr3YS/Pge0dUNDfsxGw/9y1zqqmtrlkTodoIj/ZRf60Q6L15BHW0i8uA+svcz+Hetu1UCidBsRMYH4fRZ5JlzFDbxQzffb92gdDqG93grBH+iMNcU580k6WSKkM9JzbMXILx/BZbQ+5qx2zepyDiwe9zomhNlFkSElORzC8yIMImBIepmIyCLC9wqL+QifKkso+SAH1+mGIfba11nfscJl2b4tuih9eW7VS9b8YIF+xbq5vKM2rYSCI6wuJi1YiI0xnhby5rigonWQd+bLjVc4bTCnA2sl6Y2ZmfgDzT9MTsG1qGfAAAAAElFTkSuQmCC';
    for (let i = 0; i < imgs.length; i += 1) {
      if (imgs[i].src === RedHeartIcon) {
        imgs[i].style.visibility = 'hidden';
      }
    }

    // 检测哈士奇插件，隐藏不含同款的商品
    // function hideRelatelessItems(isHide) {
    //   if (isHide) {
    //     let hasMore;
    //     const items = document.getElementsByClassName('J_MouserOnverReq');
    //     for (let i = 0; i < items.length; i += 1) {
    //       hasMore = true;
    //       const detail = items[i].getElementsByClassName('J_MouseEneterLeave')[1];
    //       const row4 = detail.getElementsByClassName('row-4')[0];
    //       const spans = row4.getElementsByTagName('span');
    //       for (let index = 0; index < spans.length; index += 1) {
    //         // 判断 所有span标签，只要拥有同款则不隐藏
    //         // spans[index].title.includes('哈士奇插件 提供') 
    //         // !spans[index].innerText.includes('有同款')
    //         if (spans[index].innerText.includes('有同款')) {
    //           hasMore = false;
    //           break;
    //         }
    //       }
    //       if (hasMore) {
    //         items[i].style.visibility = 'hidden';
    //       }
    //     }
    //   }
    // }
    // hideRelatelessItems(choice);
  }
  hideTmalItems();
  // Loop execution while scrolling
  setTimeout(() => {
    window.onscroll = () => {
      let topScroll = 0;
      const scrolls = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrolls - topScroll > 120) {
        hideTmalItems();
        topScroll = scrolls;
      }
    };
  }, 2500);
})();
