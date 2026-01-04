/* eslint-disable */
// ==UserScript==
// @name         Any Image Type for Raddle
// @namespace    mailto:maspelnam@protonmail.com
// @version      0.1.0
// @description  Convert images to PNG before submission
// @author       u/maspelnam
// @match        https://raddle.me/submit/*
// @include      https://raddle.me/submit
// @icon         https://www.google.com/s2/favicons?sz=64&domain=raddle.me
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479626/Any%20Image%20Type%20for%20Raddle.user.js
// @updateURL https://update.greasyfork.org/scripts/479626/Any%20Image%20Type%20for%20Raddle.meta.js
// ==/UserScript==
 
 
const getDataURL = blob => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});
 
function makeId(length) {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789_-";
    let id = characters.charAt(Math.floor(Math.random() * 26));
    let i = 1;
    while (i < length) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
        i++;
    }
    return id;
}
 
function getUnusedId() {
    let all = document.getElementsByTagName("*");
    let all_ids = [];
    for (var i = 0; i < all.length; i++) {if (all[i].id != "") all_ids.push(all[i].id)}
    let len = all_ids.map(x => x.length).reduce((a, b) => Math.max(a, b), -Infinity);
    let out = makeId(len);
    while (all_ids.includes(out) == true) {
        len++;
        out = makeId(len);
    }
    return out;
}
 
const submission_input = document.getElementById("submission_image");
submission_input.addEventListener("change", (async function() {
    let name = submission_input.files[0].name;
    let ext = name.slice(name.lastIndexOf('.'));
    if (ext != ".jpeg" && ext != ".png" && ext != ".jpg") { // idk all the image types raddle supports, i just know it does support png and jpeg
        let input_url = await getDataURL(submission_input.files[0]);
        let img = new Image();
 
        img.onload = () => {
            // create canvas
            let canvas_id = getUnusedId();
            $("body").append(`<canvas id='${canvas_id}'>`);
            let canvas = document.getElementById(canvas_id);
            canvas.width = img.width;
            canvas.height = img.height;
 
            // draw image
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
 
            // convert file and edit file input
            canvas.toBlob((blob) => {
                let list = new DataTransfer();
                name = name.slice(0, name.lastIndexOf('.')) + ".png";
                list.items.add(new File([blob], name));
                submission_input.files = list.files;
                console.log(list.files);
                canvas.remove();
            }, 'image/png');
        }
 
        img.src = input_url;
    }
}));
