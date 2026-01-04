// ==UserScript==
// @name         WME Beta forwarder
// @description  Forward to beta WME
// @version      0.0.3
// @author       Sapozhnik
// @namespace    https://greasyfork.org/ru/users/160654-waze-ukraine
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAJ9SURBVFiFtddNiE5RGAfw31wTxvdOEhljsDJiIVI+sqKxnywsbCSlLKwsLDWmJBaEUkoWZCFKabCwkTIzFpTyFRlZ+GjIjI+xOOetO6/3fefc9/Kvp3Pvuff5/8859znPc26LdMxBNzajC0swLz77hJcYRD9u4EsB7oZYgfP4hvFE+4Zz6Cwj3IY+jBUQrrYx9GJ6UfFleFxCuNoG0ZEqvhrv/6F4xYYj96Qz/x/i+UHUXYk2DBUgG8FJ7MJuXJAWL4NR6y/0FRB/hvYaHGvwIcG/t9pxReLox/ETq6LfTtzCdWzI9aXsjglb9HyB2fdHn3X4lesfweL47GUCzznIhAzXU2M56+FJbLujfwUzsS1eP03g6cHsLBLVDIo6GMsJVuN1bBcm8MzA9lYht5fFOE7jNlZGS8HWTCgsZXAFi7Av3m9Ca6JvV6b2diqCZ/iIjZiGMziW6NsOo4pls+PR+Xiu73dsH2IWpuJdAtf3fBSXQUts12KvEKjXUhwzzR8cftbprxScVwkcnzM8b3IAQ3X6K3lifgLH80woDs3gMh5UE+IUpmBHAsdghrtNDuCHsOUO4iIOC8XoM/ZjeQJHPyEVFznv9UXn9f7OhhkOxMFNxvMVs1qFILyEPYkzvx/bQ0JBuoo3wjffIW3mouZI5abT5OX4YZwdLIgzKJI/8jYqnL4moLeBw4nce3Nxr4T4OI7WWpLpwo6o5TAglM8jeFtSfECDY3qHcHAsI9DIhrG0nngFXf9pEMMKVN4O9T9HM/YoZebVaBMCs8yv2agQcIV/zfLoFA6QRZLVV5xVY6tVo2WyF3KYje3YIlS8dhN/z18IS30HN+WSTCP8AZQZzeVcQO6PAAAAAElFTkSuQmCC
// @match        https://www.waze.com/editor*
// @match        https://waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://waze.com/*/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460099/WME%20Beta%20forwarder.user.js
// @updateURL https://update.greasyfork.org/scripts/460099/WME%20Beta%20forwarder.meta.js
// ==/UserScript==


(function () {
  'use strict'
    let url = window.location.href;
    url = url.replace(/(www\.)?waze\.com/,"beta.waze.com");
    window.location.replace(url);
})()
