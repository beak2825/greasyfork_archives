// ==UserScript==
// @name            Feeder - Paste Upload
// @name:ja         Feeder - 貼り付けてアップロード
// @description     User script for uploading files from the clipboard in Feeder chat.
// @description:ja  Feederチャットでクリップボードからファイルをアップロードするためのユーザースクリプトです。
// @version         2.0.3
// @icon            data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABQ/wQAUP8GAAAAAAAAAAAASv4qAD//dgBL/qoBUf+yAFD/jwBQ/koAUP8FAAAAAABQ/wQAUP8FAE/+AABQ/wUAAAAAAAAAAAAAAAAATP9wA1L/6x5k//8LV//+AE3+/gBP//8AUP//AFD/qwBQ/h4AAAAAAAAAAAAAAAAAT/+UAFD+gQBQ/1kATv+MAEj//hxj//+rxf//SIH//wBF//8ATv//AE/+/wBQ//8AUP+8AFD/XQBQ/3EAUP+NAE/+aQBP/3wAUP+uAE7+/wBH//8tb//+3uj//l+R//8AQP7/AEn//gBO/v4AUP7/AFD//wBQ/tMAUP+HAE//eQBQ/jcAUP4uAE//mgBO/v8AR///K23//tTi//9YjP/+AD3//gBG//8ATf7/AFD+/wBQ//8AUP/KAE/+UABP/i0AUP+OAFD/gABQ/8kAT///AEf+/iBm///W4//+1+P//5q6/v+Utf/+Pnr+/gBK/v8ATv7/AFD/7wBQ/5kAUP5/AFD/EwBQ/wQAUP+OAE/+/wBH//8iZ//+0+H//sLV/v+Wt/7/ia7//ips//8ASP//AE7+/wBQ/tgAT/8yAFD/AAAAAAAAT/4SAFD+uwBO//8ARv//Km3//9zn//5+pv//F2D+/y5v//4rbf//BFL+/wBO/v8AT//zAE/+TwAAAAAAAAAAAFD+hwBP/v8AT/7/AEf//xZf/v7B1f/+5+7+/rrQ/v/P3v/+l7j+/ghW/v4ASv7/AE/+/wBQ/9MAUP4nAFD+LgBQ/98AT/7/AE/+/wBN//4AT///OHb//2CS/v9pmP7/Voz//x9l/v8ATP7+AE7+/gBP//8AT/7/AFD/aQBQ/0kAUP//AFD//wBQ//4AUP//AE///wBI//8ARf//AEb//wBG//8ASv7/AFD+/wBQ//4AUP//AFD//wBQ/5cAT/5NAFD//wBQ//8AUP//AFD//wBP//kAT/6AAE//ZgBP/3AAT/5pAE//xgBQ//8AUP//AFD+/wBQ//8AUP+eAFD/OABP/+sAUP7/AFD//wBQ/+YAT/5iAAAAAAAAAAAAAAAAAAAAAABQ/ygAUP+4AE/+/wBQ//8AUP//AFD/eABQ/w4AT/6BAFD+vABQ/3gAT/4nAAAAAAAAAAAAUP8FAE//AwBQ/wIAAAAAAFD/DABP/lYAT/+mAE/+tQBQ/jEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP4/AAD4DwAAIAYAAMABAADAAwAAAAEAAMADAADAAwAAgAEAAIABAACAAAAAgcAAAIfhAACf+QAA//8AAA==
// @match           https://*.x-feeder.info/*/
// @exclude         https://*.x-feeder.info/*/*/*
// @namespace       https://github.com/sqrtox/userscript-feeder-paste-upload
// @author          sqrtox
// @license         MIT
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/427097/Feeder%20-%20Paste%20Upload.user.js
// @updateURL https://update.greasyfork.org/scripts/427097/Feeder%20-%20Paste%20Upload.meta.js
// ==/UserScript==
"use strict";
(() => {
  // src/utils/ElementIds.ts
  var ElementIds = {
    DropzoneArea: "picture_drop_zone_area",
    OpenDropzoneAreaButton: "post_picture",
    ImageSizeSelect: "frame_size",
    PostFormSingle: "post_form_single",
    PostFormMultiline: "post_form_multi"
  };

  // src/utils/getElement.ts
  var getElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`Element with id "${id}" not found`);
    }
    return element;
  };

  // src/utils/ImageSizes.ts
  var ImageSizes = {
    Original: "0",
    Small: "1",
    Medium: "2",
    Large: "3",
    ExtraLarge: "4",
    Largest: "5"
  };

  // src/utils/openDropzoneArea.ts
  var openDropzoneArea = () => {
    const dropzoneArea = getElement(ElementIds.DropzoneArea);
    const dropzoneAreaIsHidden = !dropzoneArea.style.display || dropzoneArea.style.display === "none";
    if (dropzoneAreaIsHidden) {
      const openDropzoneAreaButton = getElement(ElementIds.OpenDropzoneAreaButton);
      openDropzoneAreaButton.click();
      const imageSizeSelect = getElement(ElementIds.ImageSizeSelect);
      imageSizeSelect.value = ImageSizes.Original;
    }
  };

  // src/utils/getDropzone.ts
  var getDropzone = () => {
    const dropzone = unsafeWindow.Dropzone.instances[0];
    if (!dropzone) {
      throw new Error("Dropzone instance not found");
    }
    return dropzone;
  };

  // src/utils/handlePaste.ts
  var handlePaste = ({ clipboardData }) => {
    if (!clipboardData) {
      return;
    }
    const file = clipboardData.files[0];
    if (!file) {
      return;
    }
    openDropzoneArea();
    const dropzone = getDropzone();
    dropzone.addFile(file);
  };

  // src/utils/applyHandlePaste.ts
  var applyHandlePaste = () => {
    const postFormSingle = getElement(ElementIds.PostFormSingle);
    const postFormMultiline = getElement(ElementIds.PostFormMultiline);
    postFormSingle.addEventListener("paste", handlePaste);
    postFormMultiline.addEventListener("paste", handlePaste);
  };

  // src/index.ts
  applyHandlePaste();
})();
