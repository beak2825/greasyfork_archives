// ==UserScript==
// @name         b站频道入口
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @description  在bilibili首页添加现在已经消失的bilibili频道入口
// @author       louvryaaa
// @match        https://www.bilibili.com/*
// @license      MIT License
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAFR0lEQVRogc2a228VVRTGf+e0lJYitFxaaKFSJFRqDFpB0tASi1gSEzQxQWh4ICYa64P6H5ioj77og0JfDMELKAkh9kFrQBKg9IHrC5dyKaVSCoVKIUXtoe0xa1wzzJnOnMtcgC+ZZM/ea6291uw9e3/7Evuw61NCwkKgCVgB1ACLgDlAMRADRoDbQC/QDRwHDgJ/hlF9fkD9KmArsBmozSA7S5+lQLMt/yywG9gJXPXrSNyn3nLgZ+AK8FkWQaRDrdroUZvL/RjJNZAyYAdwCtgY4EN4+bJRbe/QunJSzhYbtW9v1T4fFWJaR7fWGVogBcA32uwlEQbgRInWuU19SItMgUwH2oEPHoHjXmhVH6anE0oXyDTgd8cI87jQrL5M86rfa/gt0K9Q78fxeUVzqS97kdqSJcyeWmrkDY3e4ezwJboGT3Hjn1t+zIovvwCvAwlnoVcgXwJrc60pL5bHW4uaaShfQcwxHpQXzTGeV+av4ujNk+y92sGDibFcq3gV+Mqtq7t1rU1+/gkJovXZFhrLV04Kwg4pW13+Eu/XtBg6PtCqE3DaQCqA7X6sS0vUzFyckjc6nuDivV7jkbQdS2dWGzo+sU19teDsWl/4GWLnF81lddkK6z0J7L/eSce1QyQmHhh5BfEprF+whnUVq632Ep0jN44zkPs/U6K+bjEz7C1SB7TkalFQX1ZHPPawOx243kl73wErCIGkJW9//xErT3RE1yda1OdJgXzid8ZeVvKMlZYu9Nu1Q56yHf2HU7qZXTdHxNTnlECEcm/wa3FOYamV7rt/PaUlnJAykXHT9QHxudoeyJaQCWDWGJsYD6IuPr+DIxDfuP3vHUu1qrjC+LG9IGUiY+KvxN2g32KTGYis7JYFsXRu+LKVnppXwPrKRk/Z5spGQ8ZE992eIFWjC7XFcT8zuBNdt04xkUxauesqG9iwcC1T4g9Hd0lL3muVDVae6AhlCQFN+brGDoSBvwfpHDxBY/n/pmQ4EYfXzHuZq/f7jbyniytTWkIgOqIbAl7I16YJjL29HZQVzkqZ3cXxpTOqXU1fuHvF0AkJNdK1fA/kdownx9l+fheHbx4jSdJTTso6b56grXuXoRMSFkuLzM3WVjb0fM+VXw3aUV9eR+3MJcwuLDUcHhodNn5skZPuFDLVL5F9Le/Pp0hHz03Il86Gnodpy4ZExkkwTHoeJdWXQO6lEwiTnkdI9UfkH5HOOMOtNEx6HjHVvyMtctmrNEx6HjHV75FALniVhknPI6b63XHdFXdFmPQ8Yqp/WgL5I5OUHwSk5ynIwtbBuJ5PnHMrDZOeR0j1L5r/iOAHN4kw6XmEVP8nbAsrCWTCKREmPY+I6ovP32LbDurVLdI37VJh0vOIqH67HjaRt+rdJjNT+tp7zp0UadbqpxakjBz58TyD6MkjaTuEnn93aZ8rAw7Tls6pskQfcAYyoGuT51Olk5wcOkPxlCKqpldkJHrfX97HmAc9D9MWsAv42nxxnurKUHHGa7dRaEYmep4tAtoaBp4DrMnG7Xh6s0b7JKNFT4ItuNH43X43sh8R2pxBkGZT7uOoZvyAEJ8+cjPhFUhCh+KuJygI8eUNt9MqMmyTjtjO7h43zLPM+15+ZFrqjuhGcdtjDKRNfRhJJ5TNxnVCj7ve1mHvUWFY93VbvbpTroGY2KO3fnbqrBoVklpHjV4YyAq5HiUM6vWKOg1sEtEMALG1R21v1bqyht9rTqe1q5nXnFoC7OifB34Mes0p6H2tPuBzfSQoIW4rlbOZF8/Mqxf2i2eyT3BML56JjWAA/gNVDKshsYnN1AAAAABJRU5ErkJggg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484879/b%E7%AB%99%E9%A2%91%E9%81%93%E5%85%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/484879/b%E7%AB%99%E9%A2%91%E9%81%93%E5%85%A5%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var main = document.createElement("a");
    main.setAttribute("class", "channel-icons__item");
    main.setAttribute("href", "//www.bilibili.com/v/channel/undefined/");//将main元素链接指向b站频道URL
    main.setAttribute("target", "_blank");
    var divpo1 = document.createElement("div");
    divpo1.setAttribute("class", "icon-bg icon-bg__dynamic");
    var divpo2 = document.createElement("picture");
    divpo2.setAttribute("class", "v-img icon-bg--up");
    var imgbg = document.createElement("img");
    imgbg.setAttribute("src", "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iX+WbvuWxgl82IiBkYXRhLW5hbWU9IuWbvuWxgiA2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NS4wNiA1NS4wNiI+CiAgPGRlZnM+CiAgICA8c3R5bGU+CiAgICAgIC5jbHMtMSB7CiAgICAgICAgZmlsbDogIzZkYzc4MTsKICAgICAgfQoKICAgICAgLmNscy0yIHsKICAgICAgICBmaWxsOiBub25lOwogICAgICAgIHN0cm9rZTogI2ZmZjsKICAgICAgICBzdHJva2UtbWl0ZXJsaW1pdDogMTA7CiAgICAgICAgc3Ryb2tlLXdpZHRoOiAzLjVweDsKICAgICAgfQogICAgPC9zdHlsZT4KICA8L2RlZnM+CiAgPGNpcmNsZSBjbGFzcz0iY2xzLTEiIGN4PSIyNy41MyIgY3k9IjI3LjUzIiByPSIyNy41MyIvPgogIDxjaXJjbGUgY2xhc3M9ImNscy0yIiBjeD0iMjYuNzUiIGN5PSIxOS40MiIgcj0iNi40MiIvPgogIDxjaXJjbGUgY2xhc3M9ImNscy0yIiBjeD0iMzUuMTQiIGN5PSIzMy45NSIgcj0iNi40MiIvPgogIDxjaXJjbGUgY2xhc3M9ImNscy0yIiBjeD0iMTguMjUiIGN5PSIzMy45NSIgcj0iNi40MiIvPgo8L3N2Zz4=");
    //注：这里用到的矢量图是自己按照印象画的，可能和原版有些不同
    imgbg.setAttribute("alt", "");
    imgbg.setAttribute("loading", "lazy");
    imgbg.setAttribute("onload", "");
    imgbg.setAttribute("onerror", "typeof window.imgOnError === 'function' && window.imgOnError(this)");
    divpo2.appendChild(imgbg);
    divpo1.appendChild(divpo2);
    main.appendChild(divpo1);
    var imgbg_size = document.createElement("size");
    imgbg_size.setAttribute("class", "channel-notify");
    imgbg_size.setAttribute("style", "top: 0px; bottom: initial;");//设置main元素的样式
    main.appendChild(imgbg_size);
    var title = document.createElement("span");
    title.setAttribute("class", "icon-title");
    title.appendChild(document.createTextNode("频道"));
    main.appendChild(title);
    let po = document.querySelector("#i_cecream > div.bili-feed4 > div.bili-header.large-header > div.bili-header__channel > div.channel-icons ");//设置main元素在b站首页的位置
    po.appendChild(main);
})();
