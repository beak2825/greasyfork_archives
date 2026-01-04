// ==UserScript==
// @name               中大自动验证码认证
// @name:en            SYSU CAS Auto Captcha Login
// @name:zh            中大自动验证码认证
// @namespace          https://github.com/KumaTea
// @namespace          https://greasyfork.org/en/users/169784-kumatea
// @homepage           https://github.com/KumaTea/SYSU-CAS
// @version            1.2.0.0
// @description        中山大学身份验证系统自动识别验证码登录
// @description:en     Automatic Script for Solving captcha of CAS (Central Authentication Service) of Sun Yat-sen University
// @description:zh     中山大学身份验证系统自动识别验证码登录
// @description:zh-cn  中山大学身份验证系统自动识别验证码登录
// @author             KumaTea
// @match              https://cas.sysu.edu.cn/cas/login*
// @match              https://cas-443.webvpn.sysu.edu.cn/cas/login*
// @license            GPLv3
// @require            https://greasyfork.org/scripts/437298-tesseract-fast-min-js/code/tesseract-fastminjs.js
// @require            https://cdn.jsdelivr.net/npm/sweetalert2@11.3.0/dist/sweetalert2.all.min.js
// @downloadURL https://update.greasyfork.org/scripts/419757/%E4%B8%AD%E5%A4%A7%E8%87%AA%E5%8A%A8%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AE%A4%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/419757/%E4%B8%AD%E5%A4%A7%E8%87%AA%E5%8A%A8%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AE%A4%E8%AF%81.meta.js
// ==/UserScript==

/*
为省去手动激活页面的操作
请在此输入您的 NetID 账号密码
此操作不会上传任何信息
*/

const username = '';
const password = '';

/*
Whoa! You found here!
Please replace "tesseract-fastminjs.js" with this link before reading the following instructions:
https://gitee.com/kumatea/tesseract-dist/raw/master/2.1.5/tesseract-fast.min.js

Use fast trained data (1.89 MB) by default.
If you want to use the better trained data (10.4 MB),
replace the "tesseract-fast.min.js" with "tesseract.min.js"
in the '@require' section above.
There is also a best version: "tesseract-best.min.js".

默认使用精简训练数据（1.89 MB）。
如果你想使用标准训练数据（10.4 MB），在上面的 '@require' 部分
把 "tesseract-fast.min.js" 替换为 "tesseract.min.js"。
另有一个最佳版本："tesseract-best.min.js"。
 */


/* jshint esversion: 8 */
// "use strict";


const delay = 2*1000;
const captcha_regex = /[A-Za-z0-9]/g;
const black_threshold = 50;
console.log("Fetching: https://raw.github.cnpmjs.org/naptha/tessdata/gh-pages/4.0.0_fast/eng.traineddata.gz")


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const mouseClickEvents = ['mousedown', 'click', 'mouseup'];
function simulateMouseClick(element) {
  // https://stackoverflow.com/a/54316368
  // https://stackoverflow.com/a/69977098
  mouseClickEvents.forEach(mouseEventType =>
    element.dispatchEvent(
      new MouseEvent(mouseEventType)
    )
  );
}


function react_input(component, value) {
  // Credit: https://github.com/facebook/react/issues/11488#issuecomment-347775628
  let last_value = component.value;
  component.value = value;
  let event = new Event("input", {bubbles: true});
  // React 15
  event.simulated = true;
  // React 16
  let tracker = component._valueTracker;
  if (tracker) {
    tracker.setValue(last_value);
  }
  component.dispatchEvent(event);
}


function load_js(src) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = src;
  document.head.appendChild(script);
}


function replace_color_in_canvas(canvas) {
  let ctx = canvas.getContext("2d");
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;
  let len = data.length / 3;
  let first_pixel_array = [data[0], data[1], data[2]];
  for (let i = 0; i < len; i += 1) {
    let r = data[i * 3];
    let g = data[i * 3 + 1];
    let b = data[i * 3 + 2];
    if (r + g < black_threshold || r + b < black_threshold || g + b < black_threshold) {
      data[i*3] = first_pixel_array[0];
      data[i*3 + 1] = first_pixel_array[1];
      data[i*3 + 2] = first_pixel_array[2];
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return ctx;
}


function img_src_to_base64(img) {
  // Ref: https://stackoverflow.com/a/22172860/10714490
  let canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  ctx = replace_color_in_canvas(ctx.canvas);
  return ctx.canvas.toDataURL("image/png");
}


function clone_image(img) {
  let new_img = document.createElement("img");
  new_img.src = img_src_to_base64(img)
  return new_img;
}


async function recognize() {
  let result = "";
  await Tesseract.recognize(clone_image(document.getElementById('captchaImg')), "eng")
      .then(({ data: { text } }) => {result = text.match(captcha_regex).join("");});
  console.log("Recognized: " + result);
  return result;
}


async function solve() {
  if (document.getElementById("captcha")) {
    Swal.fire({title: "正在加载识别组件……", showConfirmButton: false, timer: 3000});
    react_input(document.getElementById("captcha"), "正在加载识别组件，请耐心等待……");

    let result = await recognize();
    react_input(document.getElementById("captcha"), result);

    if (result.length !== 4) {
      location.reload();
    }

    console.log("Submitting: " + result);

    if (document.querySelector("input.btn.btn-submit.btn-block").disabled) {
      if (username && password) {
        react_input(document.getElementById("username"), username);
        react_input(document.getElementById("password"), password);
      } else {
        while (document.querySelector("input.btn.btn-submit.btn-block").disabled) {
          console.log("Login button is not clickable!");
          Swal.fire({title: "请点击网页以激活登录按钮", showConfirmButton: false, timer: 1000});
          await sleep(delay);
        }
      }
    }

    document.querySelector("input.btn.btn-submit.btn-block").click();
    // simulateMouseClick(document.querySelector("input.btn.btn-submit.btn-block"));
  }
}

solve();
