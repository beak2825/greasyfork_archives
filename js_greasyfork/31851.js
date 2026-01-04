// ==UserScript==
// @name        Telegram-Web Image Display Switch
// @namespace   zunsthy@gmail.com
// @description none
// @include     https://web.telegram.org/*
// @match       https://web.telegram.org/*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31851/Telegram-Web%20Image%20Display%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/31851/Telegram-Web%20Image%20Display%20Switch.meta.js
// ==/UserScript==


const createStyleElement = (css) => {
  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    styleElement.textContent = css;
  }

  return styleElement;
};

(() => {
  const container = document.querySelector('head');

  const css = `
div[ng-switch-when="sticker"],
a.im_message_photo_thumb,
a.im_message_video_thumb,
div.img_gif_image_wrap,
div.im_message_webpage_wrap {
  position: relative;
}
div[ng-switch-when="sticker"]::after {
  content: "【贴图已隐藏】";
}
a.im_message_photo_thumb::after {
  content: "【图片已隐藏】";
}
a.im_message_video_thumb::after {
  content: "【视频已隐藏】";
}
div.img_gif_image_wrap::after {
  content: "【GIF已隐藏】";
}
div.im_message_webpage_wrap::after {
  content: "【链接预览已隐藏】";
}
div[ng-switch-when="sticker"]::after,
a.im_message_photo_thumb::after,
a.im_message_video_thumb::after,
div.img_gif_image_wrap::after,
div.im_message_webpage_wrap::after {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  color: white;
  background-color: rgba(0, 0, 0, .9);
}
  `;
  
  const style = createStyleElement(css);

  container.appendChild(style);
  
  window.CoverImage = () => {
    container.appendChild(style);
  };
  window.DisplayImage = () => {
    container.removeChild(style);
  };
})();
