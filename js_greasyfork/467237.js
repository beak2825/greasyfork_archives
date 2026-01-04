// ==UserScript==
// @name         Drawaria.online Image Upload
// @version      2024-08-06
// @description  Drawaria.online adds file upload
// @author       Mr Robot
// @match        https://drawaria.online/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/467237/Drawariaonline%20Image%20Upload.user.js
// @updateURL https://update.greasyfork.org/scripts/467237/Drawariaonline%20Image%20Upload.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 30/5/2023
    // Изменить размер холста
    let canvas = document.getElementById('canvas');
    canvas.height = 650;
    canvas.width = 780;

    // Добавить кнопку загрузки файла
    let target = document.getElementById('downloadcanvas');
    // Создать кнопку для переключения звуков с помощью значка материала и текста
    let togglebtn = document.createElement('button');
    togglebtn.id = 'imagebot';
    togglebtn.type = 'button';
    togglebtn.classList.add('btn', 'btn-light', 'btn-sm', 'btn-block');
    togglebtn.innerHTML = '<i class="material-icons" style="font-size: 16px;">&#xe432;</i><span>Upload Image</span>';
   // Добавить стили для семейства шрифтов 'Material Icons"
    let linkElm = document.createElement("link");
    linkElm.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    linkElm.rel="stylesheet";
    document.head.appendChild(linkElm);
    let styleElem=document.createElement("style");
styleElem.textContent=`
    .material-icons {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
    }
`;
  // 8/6/2024
  // холст с изображением
   document.head.appendChild(styleElem);
  togglebtn.addEventListener('click', function() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function() {
      let file = input.files[0];
      let reader = new FileReader();
      reader.onload = function() {
        let img = new Image();
        img.onload = function() {
          let ctx = canvas.getContext('2d');
          let scaleX = canvas.width / img.width;
          let scaleY = canvas.height / img.height;
          let scale = Math.min(scaleX, scaleY);
      let xOffset = (canvas.width - img.width * scale) / 2;
      let yOffset = (canvas.height - img.height * scale) / 2;
       ctx.drawImage(img, xOffset, yOffset, img.width * scale, img.height * scale);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
};
        input.click();
    });
    target.parentNode.insertBefore(togglebtn, target.nextSibling);
})();