// ==UserScript==
// @name         ClassDojo Crown Marker
// @namespace    https://github.com/IceLeiYu
// @version      1.0
// @description  point out the highest score person in your class!
// @author       XinShou#4767
// @match        https://teach.classdojo.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=classdojo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464700/ClassDojo%20Crown%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/464700/ClassDojo%20Crown%20Marker.meta.js
// ==/UserScript==



function arraysEqual(arr1, arr2) {
  // 判斷陣列的長度是否相等
  if (arr1.length !== arr2.length) {
    return false;
  }

  // 判斷陣列的每個元素是否相等
  return arr1.every((element, index) => {
    return element === arr2[index];
  });
}


let maxElements = [];

function mark() {
    let greenElements = document.getElementsByClassName("css-27mawu");
    let tmpMaxElements = [];
    let maxNumber = -1;

    // Loop through all elements found
    for (let i = 1; i < greenElements.length; i++) {
        let element = greenElements[i];
        let number = parseInt(element.innerHTML, 10);
        if (!isNaN(number)) {
            if (number > maxNumber) {
                maxNumber = number;
                tmpMaxElements.length = 0;
                tmpMaxElements.push(element);
            } else if (number === maxNumber) {
                tmpMaxElements.push(element)
            }
        }
    }

    if (arraysEqual(maxElements, tmpMaxElements)) {
        return;
    }

    let diff = [...new Set(tmpMaxElements.concat(maxElements))].filter(x => !tmpMaxElements.includes(x) || !maxElements.includes(x));

    for (let i = 0; i < diff.length; i++) {
        let element = diff[i];

        if (maxElements.includes(element)) { // remove
            let images = element.querySelectorAll('img'); // 選擇所有的 img 元素
            images.forEach(img => {
                img.style.width = "0%";
                setTimeout(() => {
                    img.remove();
                }, 200);

            }); // 移除所有 img 元素
        } else { // add
            let img = document.createElement('img'); // 創建一個新的 img 元素
            img.src = 'https://cdn-icons-png.flaticon.com/512/6941/6941697.png'; // 設定圖片 URL
            // 計算圖片大小，以符合元素高度比例
            let elementHeight = element.getBoundingClientRect().height; // 取得元素高度
            let imgSize = elementHeight * 1.5; // 計算圖片高度

            // 創建圖片元素
            let myImage = document.createElement("img");
            myImage.src = "https://media.discordapp.net/attachments/883638446684504074/1099696194290208848/qweqwe.png?width=467&height=468";
            myImage.id = "myImage";

            // 定義圖片的樣式
            myImage.style.position = 'absolute';
            myImage.style.top = `${-imgSize}px`; // 將圖片置於元素上方
            myImage.style.left = `0`;
            myImage.style.width = `${imgSize}px`;
            myImage.style.transition = "all 0.2s linear";

            setTimeout(() => {
                myImage.style.width = "80%";
                myImage.style.transform = `rotate(45deg)`;
            }, 50);

            setTimeout(() => {
                myImage.style.width = "200%";
            }, 150);

            setTimeout(() => {
                myImage.style.width = "100%";
            }, 225);

            setTimeout(() => {
                myImage.style.width = `${imgSize}px`;
            }, 400);


            element.appendChild(myImage);
        }
    }

    maxElements = tmpMaxElements;
}

(function() {
    'use strict';
    window.addEventListener("load", () => {
        setTimeout(() => {
            const refresh = setInterval(mark, 500);


        }, 3000);
    });
})();