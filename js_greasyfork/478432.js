// ==UserScript==
// @name          评论历史记录与评论收藏(哔哩哔哩|B站|bilibili)
// @namespace     https://greasyfork.org/zh-CN/users/1196880-ling2ling4
// @version       2.8.17
// @author        Ling2Ling4
// @description   记录点赞的评论, 发送过的历史评论, Ctrl+双击可收藏页面中的评论, 双击评论记录可跳转到评论来源页面
// @license       AGPL-3.0-or-later
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAN0AAADICAYAAABs3+QyAAAAAXNSR0IArs4c6QAAEXlJREFUeF7tXUuPHUcVrmqckFhxlBlHBCUWnuvIUqRIWSBFsEDYRog10cTskGcEKyR+Atgj5TewQpoxLGEEbFnEYyk7EAtW3thzE4EUJL+UmMhEzi10+t7u6e7b3fXoquqqrq+lkSG3qrrqO+fTeVVVc4bHKwJ/On60RS98xthWxlj+v9liQf+eLyYiON/ixW8dsxOMzdt+4kLQf/94kWVH9PspxubvzTZa23pdOF5WIsCBhRsE/nD86HJOqoJQnF9mEiK5mclyVMFYTkKQ0iXKamODdGo4dbYiy7Vg7HIo5DJZDhGSC3GbrCMsowmCen1AOj282OHxox22WFxiI1suzWlrNQcJteDSbgzSSSBbkWxLcH6Jk0VL85lTDMk5v5kxdoQYcZgSgHQt+BHRhBDXEiZZr1aRJRSc78EVNSMfSLfCreI27phBmWYvEFBf7kmTDkTTV5h+EygOFll2ExawH9ckSXd498H+lBMhlqlkNpwQB1mW7SH+W4cvGdLldbPF4hrjHO6jGY2MepH7+TXOd0G+E/gmTzokRYy4Yr1TEftdnW3kRfqUn8mSLo/XhLg+5i6QlBWra+0gH2OTIx3IFgfV8wJ8onW/yZCOYjYuxHXU1uIgXWWWc8b5XkpF9+hJB7JFR7LWCafkdkZNuj/ee3gLlm0apCtWkUK2M0rS5el/IW5NS92wmhoCQuxlWXYwxVJDVKSjYzRfCbEP65YMQecLznenVmaIhnSrrOR+MuqGhZYITM3lDJ50sG5g3wn7puFyBk06xG4gXAsC84zzKzHHesGS7vDugxuMc9pRggcIrCMgxN72m2dvxAhNkKRDKSBGVfI/51hjvaBIt3InKVmyvJoODxCQIxCduxkM6ZCdlGsXWvQgEFFdLwjSIX4DnWwgEIu7OTrpVqe4cbDUhtZhDEIgeHdzVNIhYQKWOEOA893t2caBs/EHDDwa6UC4AVJDVzUEAiWed9Jhh4mavqCVJQQCrOd5JR0IZ0mRMIweAoERzyvp4FLq6QpaW0QgoJKCN9KBcBYVCEOZIRAI8byQDoQz0xH0so9ACLU856RDHc6+4mDEgQiMHOM5JR0IN1A50N0dAiMSzxnpsJfSnb5gZEsIjEQ8J6TLPwksxLElaDAMEHCGwILzK77vYLFOuhXh6KYuHM9xpioY2CYCGecznyfRrZMOmUqb6oCxPCHgdZO0VdLhiI4nFcFrXCDgjXjWSIdLhFzoAcb0ioCnxIoV0iFx4lU18DKXCHggnhXSIY5zqQUY2zcCrhMrg0kHt9K3SuB9HhBwGt8NIh3cSg/ixyvGQcChmzmIdNjmNY4+4K1+EHDlZhqTDm6lH8HjLaMi4MTNNCId3MpRFQEv94mAAzfTiHQogvuU+nTe9eoLp9i3XnqenT6V5X/3nz5jdx4/ZV88WwS9SNtupjbpYOWC1o8gJ0dEoz8iXdvz1399FjrxrLqZ2qSDlQtSr4ObVEEy+lf2kLWjv6Afi26mFulg5YJWi9EnV7iP9C+5j6oPuZdk7QJ/rFk7LdJh50ngajHS9GTuo8q0/jx/rNJs3DaWrJ0y6WDlxpV3aG/XcR9lc4/E0uXLsJFUUSYdrJxMdab/u6n7KEOGspgfffpE1iyM3y1YOyXSwcqFIe+xZkFW7a1XXtCK03TmGkUipbKgodZOiXTY7qWjQtNoayNOU0WCrBxZu1geujvz/QubV0znKyUdrJwptPH1sxmn6aw+iiRKY0FDrJ2UdKjL6ahPnG1du499qMSURKmtQ4iD7TfP7ppIvJd0sHImkMbRx6f72IdIbPFcdS2m1q6XdLBycRBIdZZUsKaEiG7xWnV8k3YRbAHrXpZhJrOfdPce0oWxuL/SRJsC6hOKVWtCEq1rOTCT2Uk6nJcLiDUGUylqaip7Hw2Gt9IlZteyBMDA2nWSDmUCK3rlfZAxkyK6i42tVNCxvvn2hc2ZztpbSYcEig6E47cdK9U/ZOVTcC3L9XO+uz3bOFDFo5V0SKCowjduO0qKFIdCx52J/tsn4Vqulq1bLO8i3T7jfEcfSvRwjUCoSRHddU+JdLR2nfLBGungWuqqj5/2McVqKojEuAuld10aCZU10sG1VFEZP21ijNVUkJlUPGfgYraRDq6liuY4bDM1q9aEamquZbE+VRezRjq4lg6ZJBk6hrqaLXQm51oWwCi6mDXSoSBuS63Ux5m6VWsiEdWBVXUx5i1Vs5g10iGe00TZsHlKVq0J0T/uf8E+efKlIXLhd1NxMWukw5UMboU6lXS/KUpTTKCsYaHgYtYt3b2HwhRQ9OtGIOYitk25TjWBUsVIxcUsSYckik31YuWNxiFvOLa7YvloUR/jkS+vbCFzMUvSIZ7TQLWnaWqJEVXUknAtCzAkezFL0iGeU1Wf9XbF4VBYtW4MU3Aty9VLrnI4sXSI57RZl3piRAewydbmOkDYvrDZeWwu/wHxnI76LOM1l/dA6s0m/NZJuZYrcfTFdTnpUBRXU9xvv3o6JxwePQSSci0V4rqcdEiidCtRyoVsPWq1t07RyuVI9MR1IF2HZiFes0E5ln93Lvhvz9lZ6tooXXFdTjpkLk/wQrxmVwNTqc21odYV1y0tHTKXDPGaXbLRaMm6lpK4jqecuUS8Zp9o1RGnvrlZil5HXJck6YhsxU3HUuDQwAiB5K1cz1Effnj8aIcJsW+EbGSdkBzxJ7CUEyhVlNviOp5CuQBk80e24k2p7UDpQjg50iET6Z9s9EZYuQruLZufJ2npQLZxyFa8dSLXpdsBsSWZQqSbzO1fIJsdPRkyChIodfTaDrXyKRTGcTJ7CE3s9oVruY5nc2dK1KQjstEfnjAQgJVrl0MzmcIPI/zwI9zIMEjWnAWsXIdcGskUIl00lxHRCW3arkXFbTzhIZDyPsteacRMuu998yUQLjyu5TOCa9kjmEYGMxr3kqzcj869HKjKYVrJ77Ps4xxjR+9f2LxSNImGdDRhIh2RD09YCMDK9cujWTaIinQoDYRFtmI2SKDI5VItG0RFOloaJVEomQKLJxe0rxbYZylHulo2iI50xfJw6FQuaB8tYOXUUJ4E6WD11ITtuhXKBIoIV8oG0Vq66lJRLFcUvOVmSKBoADo10lVdTor5EO9pKMOApigTaIBX+YRW1Hsv25aMqxg0FGFAU1g5TfAqBfJJHe2pwoAsp6ZSaDZHAkUTsBRIV0AC8mkqh0JzWDkFkBpNqgXyZC4mAvn0FaWrB6ycPpZJkg6WT19R2nrAyhnjON++sDmj3jzVL/bA8pkpD6ycGW7Uq9gKluRls6jxmSsOtnyZY1fsSsG3DFYYYluZXJlg5eQY9bVoku6YMbY1bMj4e+POlX4ZYsvXMB2vk25C1/ANgwVn9rrwQwJlqGYxBtJ1YEj7OMnVxFNHAFu+hmtEnXQJfUREBTqcUK+jBCunojXyNjXSpfyNujaokFSpo4IEipxQKi0WnF+5Ots4yrOX9MR4/6XKQk3awMU8QQ1WzkSD2vuskW4K16vbg4exH2+9YnO4aMeClbMnunVLhwxmDV3EdbjL0h7dliOtkw7JlBrGiOvwnTnnpENcV4c49bgOsZxtyrVYOnoF4roToGlDNF3jnuqDWM6+5GslgzKDeffBDcb5dfuvi3PElJMp2NhsX2dbSZfqMZ8ueE2SKbf//Tn7+YfH7PzLz7Pvv36G/frdN+xLz/GIsHJuAC6P9jSHR73uBBGTZMpzv/lbDdJfvft6dMSDlfNNOpQOSsR1SUcW7uad+2sS2zrzdfbbH8zYpTfOuJGmxVFh5SyC2Riq29KhdFBCpZvBbFq5pvhisHqwcs5Id3JdQ9sr4GIuUdHJYP7uzn32sw/pWGL/Q1bvp2+dDdLlhJWTSW/Q7xLSwcUs0VVNpvzwL3cYJVFUnxBdThxSVZWeUbt+0iGLeQKqCumIbEQ6k+eD755jv3zntdGvgoeVM5Geep/aFXxd3eBiLpFRSaZ0JVBURHLjO+fY22dfZGN/8BJWTkVaA9pUb3juJB0K5Tk0KskUWQKlC+OrFzfZTy6eLX+mD58U5BsgXu2usHLakOl3qH5ApKv36mDrrdQvLJIlU1QTKE2cybqRlWt7fN/JCSunzyHtHiqko0GxF3MJbV9cp5tAofH6CFcVpo/v7t1/+ox99OkTbR1CBz0EimM91Ks8Od42xCFqdr1xnUkCRZVwVXlQXOnqu3uwcnrkMW2tTDp6ARIqLI+z6K/56CZQmjGcjgCJdGT56M/WAytnC0n5OMVuFKmly0mHhEpnkVw1gfKNF59jv3jntdytHPrY/OglrNxQaaj31yIdrF17XKdq5UzcSRVRDk22wMqpoGytTVkYV7J0sHZL4JsupszKkXW7dO5MrSRgTYSVgUyTLbByLqTRPma1MK5MOli7urWTlQmGxG6mqqCTbEFdzhRlw36VcoEe6RDblbtTLv7+n2z++f9qEvBl2WRil+1sgVspQ9DB75zvbs82DoqRe0sGzdennsmkOOre46e10wShkK0pqyLhQrtc6I+eT558yeibBHj8IlAtF2hZOsR2S0H9/T//Zfc+e8re3jxtJRvpQ/wF6eiGLzz+EahmLrVJh9jOv8DwxugRqGUujUi3Ovazn/qezOhVAQvwgkAzc2lEOriZXmSFl0wFgUbm0ph0OIEwFY3AOlwj0EyiGJMO1s61qDD+VBBoJlEGkQ5JlamoBdbhEIG1JMpg0sHNdCguDB0/Ai3x3GDSwc2MXy+wAocIuCLdinj7jPMdh9PH0EAgOgSKD4Y0J661Daxr1XAzo9MHTNg9Aq3xnBX3spg7rnZwL0W8IR4E2orixeytWLqSeDiJEI9WYKZuEeiI56xaumIFuEHMrSwxehwItNXnnFi60uLde0hf0tiKAx7MEghYR6AznnNi6WhQJFasCxEDxoRAj2vpjHQ0ME4jxKQlmKtNBPpcS6eko8FxfZ9NUWKsSBDodS2dkw7Ei0RNME17CEhcSy+kA/HsyRMjhY+AzLX0RjoQL3xlwQytICB1Lb2SDsSzIlQMEjICCq6ld9KBeCFrDOY2EAElKzcK6UC8gaJF9zARULRyo5EOxAtTbzArYwSUrdyopKsQ7xq2jBkLGx1DQEDDyo1OOpoAdq6EoDWYwwAEtKxcEKSjSWCv5gCRo+u4CGhauWBIB+KNqzd4uzEC2lYuKNIVyz68+wD3rRjrADp6RcDAygVJujzBcvxohwlxHQkWryqEl2kg0Hcdg2wYq9c1yF6m8zvFeV8Jsc8Zu6zTD22BgAcEjNzKYl7Bkq7ibt5gnKOs4EGT8Ao1BNq+T6DWc9kqeNLRJFFW0BEp2jpFwDCOq84pCtI1kizkbuL+FaeahcHbEBgSx0VLusLqcSGuI9YDMTwjMCiOi5p0pdVDhtOzzqX9uqFx3CRIB5czbRL4XL1NwkWTSJEBTIkWuJwylPC7CQK2CTcZ0hVggnwmaoU+HQjMF5zvXp1tHNlGKKrsperiQT5VpNDON+EmZ+maAFbIRyUGlBnAMRUErGUpu142SUvXRr5ssbjGOEeNT0XtEm1jqw4ngy8J0lVBgOspU4kkf3cWv7WhmRzpqkkXWL8kCVZftIVtXbooJku6pvUDAXVVJ+725EoKzvdcZCdlyIB0DYTyzdWLxWWcbJCpTsS/j2DdqmiBdD26UxBQcH6JL7OfyIBGyjWybJzzm9uzjYOxlwDSaUgAJNQAK5SmQhwssuzmGG5k0iUDl/IHEV2iazz2nHG+F4JVQ/bSWIbqHemaiWeMbVFcCLdUHbfBLYU4YFl2O2Ps6L3ZxnzweA4HgHvpENxi6IKI9P/zJA1j5wXnW6s4kf4zYkVdOUREsubSQDpdYTtor0DKVIk5Z0IsNxxn2e38nwgsmUxFQDoZQoH9TgSlKZELW0wto/+9WFSt5XnJtD9WXJZsnHwYstqK4zEuRNP1W84ly/L/TqSif0N3EVXX29YOpBuCHvoCAQME/g8ZPlBBSTh+ZwAAAABJRU5ErkJggg==
// @match         *://*.bilibili.com/*
// @run-at        document-end
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @noframes
// @compatible    chrome
// @compatible    edge
// @compatible    firefox
// @downloadURL https://update.greasyfork.org/scripts/478432/%E8%AF%84%E8%AE%BA%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E4%B8%8E%E8%AF%84%E8%AE%BA%E6%94%B6%E8%97%8F%28%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%7CB%E7%AB%99%7Cbilibili%29.user.js
// @updateURL https://update.greasyfork.org/scripts/478432/%E8%AF%84%E8%AE%BA%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E4%B8%8E%E8%AF%84%E8%AE%BA%E6%94%B6%E8%97%8F%28%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%7CB%E7%AB%99%7Cbilibili%29.meta.js
// ==/UserScript==

(() => {
  "use strict";
  function getBiliPageType() {
    const url = window.location.href,
      hostname = window.location.hostname,
      pathname = window.location.pathname;
    return "www.bilibili.com" !== hostname ||
      ("/" !== pathname && "/index.html" !== pathname)
      ? url.includes("www.bilibili.com/video") ||
        url.includes("www.bilibili.com/list")
        ? "视频"
        : "search.bilibili.com" === hostname
        ? "搜索"
        : "space.bilibili.com" === hostname
        ? "主页"
        : url.includes("t.bilibili.com") ||
          url.includes("www.bilibili.com/opus")
        ? "动态"
        : url.includes("www.bilibili.com/read")
        ? "专栏"
        : url.includes("www.bilibili.com/bangumi")
        ? "番剧"
        : "live.bilibili.com" === hostname
        ? "直播"
        : "message.bilibili.com" === hostname && "/" === pathname
        ? "消息"
        : "其他"
      : "首页";
  }
  function addCss(cssText, box = document.body, id = "") {
    const style = document.createElement("style");
    return (
      id && (style.id = id),
      box.appendChild(style),
      (style.innerHTML = cssText),
      style
    );
  }
  const className = "emoji-small",
    emoji = {
      "[14周年]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/53148f85bb7e2d8bada8cea57ee4b1f36f48237d.png@48w_48h.webp" alt="[2023]">`,
      "[2023]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/fa6dda8b876ed38609de38aa604be5ad109b8591.png@48w_48h.webp" alt="[兔年]">`,
      "[兔年]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/9cb6ee2c42986c56ec361d21d5ccbd096aefab0a.png@48w_48h.webp" alt="[14周年]">`,
      "[脱单doge]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/bf7e00ecab02171f8461ee8cf439c73db9797748.png@48w_48h.webp" alt="[脱单doge]">`,
      "[微笑]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/685612eadc33f6bc233776c6241813385844f182.png@48w_48h.webp" alt="[微笑]">`,
      "[口罩]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/3ad2f66b151496d2a5fb0a8ea75f32265d778dd3.png@48w_48h.webp" alt="[口罩]">`,
      "[doge]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/3087d273a78ccaff4bb1e9972e2ba2a7583c9f11.png@48w_48h.webp" alt="[doge]">`,
      "[妙啊]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/b4cb77159d58614a9b787b91b1cd22a81f383535.png@48w_48h.webp" alt="[妙啊]">`,
      "[OK]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/4683fd9ffc925fa6423110979d7dcac5eda297f4.png@48w_48h.webp" alt="[OK]">`,
      "[星星眼]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/63c9d1a31c0da745b61cdb35e0ecb28635675db2.png@48w_48h.webp" alt="[星星眼]">`,
      "[辣眼睛]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/35d62c496d1e4ea9e091243fa812866f5fecc101.png@48w_48h.webp" alt="[辣眼睛]">`,
      "[吃瓜]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/4191ce3c44c2b3df8fd97c33f85d3ab15f4f3c84.png@48w_48h.webp" alt="[吃瓜]">`,
      "[滑稽]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/d15121545a99ac46774f1f4465b895fe2d1411c3.png@48w_48h.webp" alt="[滑稽]">`,
      "[呲牙]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/b5a5898491944a4268360f2e7a84623149672eb6.png@48w_48h.webp" alt="[呲牙]">`,
      "[打call]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/431432c43da3ee5aab5b0e4f8931953e649e9975.png@48w_48h.webp" alt="[打call]">`,
      "[歪嘴]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/4384050fbab0586259acdd170b510fe262f08a17.png@48w_48h.webp" alt="[歪嘴]">`,
      "[调皮]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/8290b7308325e3179d2154327c85640af1528617.png@48w_48h.webp" alt="[调皮]">`,
      "[豹富]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/3d1dbe52ea16e12ff7b1c371196f728a4097fb33.png@48w_48h.webp" alt="[豹富]">`,
      "[嗑瓜子]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/28a91da1685d90124cfeead74622e1ebb417c0eb.png@48w_48h.webp" alt="[嗑瓜子]">`,
      "[笑哭]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/c3043ba94babf824dea03ce500d0e73763bf4f40.png@48w_48h.webp" alt="[笑哭]">`,
      "[藏狐]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/ba0937ef6f3ccca85e2e0047e6263f3b4da37201.png@48w_48h.webp" alt="[藏狐]">`,
      "[脸红]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/0922c375da40e6b69002bd89b858572f424dcfca.png@48w_48h.webp" alt="[脸红]">`,
      "[给心心]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/1597302b98827463f5b75c7cac1f29ea6ce572c4.png@48w_48h.webp" alt="[给心心]">`,
      "[嘟嘟]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/abd7404537d8162720ccbba9e0a8cdf75547e07a.png@48w_48h.webp" alt="[嘟嘟]">`,
      "[哦呼]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/362bded07ea5434886271d23fa25f5d85d8af06c.png@48w_48h.webp" alt="[哦呼]">`,
      "[喜欢]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/8a10a4d73a89f665feff3d46ca56e83dc68f9eb8.png@48w_48h.webp" alt="[喜欢]">`,
      "[酸了]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/92b1c8cbceea3ae0e8e32253ea414783e8ba7806.png@48w_48h.webp" alt="[酸了]">`,
      "[嫌弃]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/de4c0783aaa60ec03de0a2b90858927bfad7154b.png@48w_48h.webp" alt="[嫌弃]">`,
      "[害羞]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/9d2ec4e1fbd6cb1b4d12d2bbbdd124ccb83ddfda.png@48w_48h.webp" alt="[害羞]">`,
      "[大哭]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/2caafee2e5db4db72104650d87810cc2c123fc86.png@48w_48h.webp" alt="[大哭]">`,
      "[疑惑]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/b7840db4b1f9f4726b7cb23c0972720c1698d661.png@48w_48h.webp" alt="[疑惑]">`,
      "[喜极而泣]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/485a7e0c01c2d70707daae53bee4a9e2e31ef1ed.png@48w_48h.webp" alt="[喜极而泣]">`,
      "[笑]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/81edf17314cea3b48674312b4364df44d5c01f17.png@48w_48h.webp" alt="[笑]">`,
      "[偷笑]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/6c49d226e76c42cd8002abc47b3112bc5a92f66a.png@48w_48h.webp" alt="[偷笑]">`,
      "[惊讶]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/f8e9a59cad52ae1a19622805696a35f0a0d853f3.png@48w_48h.webp" alt="[惊讶]">`,
      "[捂脸]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/6921bb43f0c634870b92f4a8ad41dada94a5296d.png@48w_48h.webp" alt="[捂脸]">`,
      "[阴险]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/ba8d5f8e7d136d59aab52c40fd3b8a43419eb03c.png@48w_48h.webp" alt="[阴险]">`,
      "[呆]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/33ad6000d9f9f168a0976bc60937786f239e5d8c.png@48w_48h.webp" alt="[呆]">`,
      "[抠鼻]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/cb89184c97e3f6d50acfd7961c313ce50360d70f.png@48w_48h.webp" alt="[抠鼻]">`,
      "[大笑]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/ca94ad1c7e6dac895eb5b33b7836b634c614d1c0.png@48w_48h.webp" alt="[大笑]">`,
      "[惊喜]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/0afecaf3a3499479af946f29749e1a6c285b6f65.png@48w_48h.webp" alt="[惊喜]">`,
      "[无语]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/44667b7d9349957e903b1b62cb91fb9b13720f04.png@48w_48h.webp" alt="[无语]">`,
      "[点赞]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/1a67265993913f4c35d15a6028a30724e83e7d35.png@48w_48h.webp" alt="[点赞]">`,
      "[鼓掌]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/895d1fc616b4b6c830cf96012880818c0e1de00d.png@48w_48h.webp" alt="[鼓掌]">`,
      "[尴尬]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/cb321684ed5ce6eacdc2699092ab8fe7679e4fda.png@48w_48h.webp" alt="[尴尬]">`,
      "[灵魂出窍]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/43d3db7d97343c01b47e22cfabeca84b4251f35a.png@48w_48h.webp" alt="[灵魂出窍]">`,
      "[委屈]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/d2f26cbdd6c96960320af03f5514c5b524990840.png@48w_48h.webp" alt="[委屈]">`,
      "[傲娇]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/010540d0f61220a0db4922e4a679a1d8eca94f4e.png@48w_48h.webp" alt="[傲娇]">`,
      "[疼]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/905fd9a99ec316e353b9bd4ecd49a5f0a301eabf.png@48w_48h.webp" alt="[疼]">`,
      "[冷]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/cb0ebbd0668640f07ebfc0e03f7a18a8cd00b4ed.png@48w_48h.webp" alt="[冷]">`,
      "[热]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/4e58a2a6f5f1580ac33df2d2cf7ecad7d9ab3635.png@48w_48h.webp" alt="[热]">`,
      "[生病]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/0f25ce04ae1d7baf98650986454c634f6612cb76.png@48w_48h.webp" alt="[生病]">`,
      "[捂眼]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/c5c6d6982e1e53e478daae554b239f2b227b172b.png@48w_48h.webp" alt="[捂眼]">`,
      "[嘘声]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/e64af664d20716e090f10411496998095f62f844.png@48w_48h.webp" alt="[嘘声]">`,
      "[思考]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/cfa9b7e89e4bfe04bbcd34ccb1b0df37f4fa905c.png@48w_48h.webp" alt="[思考]">`,
      "[再见]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/fc510306bae26c9aec7e287cdf201ded27b065b9.png@48w_48h.webp" alt="[再见]">`,
      "[翻白眼]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/eba54707c7168925b18f6f8b1f48d532fe08c2b1.png@48w_48h.webp" alt="[翻白眼]">`,
      "[哈欠]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/888d877729cbec444ddbd1cf4c9af155a7a06086.png@48w_48h.webp" alt="[哈欠]">`,
      "[奋斗]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/bb2060c15dba7d3fd731c35079d1617f1afe3376.png@48w_48h.webp" alt="[奋斗]">`,
      "[墨镜]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/3a03aebfc06339d86a68c2d893303b46f4b85771.png@48w_48h.webp" alt="[墨镜]">`,
      "[难过]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/a651db36701610aa70a781fa98c07c9789b11543.png@48w_48h.webp" alt="[难过]">`,
      "[撇嘴]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/531863568e5668c5ac181d395508a0eeb1f0cda4.png@48w_48h.webp" alt="[撇嘴]">`,
      "[抓狂]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/4c87afff88c22439c45b79e9d2035d21d5622eba.png@48w_48h.webp" alt="[抓狂]">`,
      "[生气]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/3195714219c4b582a4fb02033dd1519913d0246d.png@48w_48h.webp" alt="[生气]">`,
      "[水稻]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/d530fcaa5100ba12a17a79b55bad342d530c54e3.png@48w_48h.webp" alt="[水稻]">`,
      "[奶茶干杯]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/d5a491990be551ce69f9660da948050df4eab331.png@48w_48h.webp" alt="[奶茶干杯]">`,
      "[汤圆]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/93609633a9d194cf336687eb19c01dca95bde719.png@48w_48h.webp" alt="[汤圆]">`,
      "[锦鲤]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/643d6c19c8164ffd89e3e9cdf093cf5d773d979c.png@48w_48h.webp" alt="[锦鲤]">`,
      "[福到了]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/5de5373d354c373cf1617b6b836f3a8d53c5a655.png@48w_48h.webp" alt="[福到了]">`,
      "[鸡腿]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/c7860392815d345fa69c4f00ef18d67dccfbd574.png@48w_48h.webp" alt="[鸡腿]">`,
      "[雪花]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/a41813c4edf8782047e172c884ebd4507ce5e449.png@48w_48h.webp" alt="[雪花]">`,
      "[视频卫星]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/dce6fc7d6dfeafff01241924db60f8251cca5307.png@48w_48h.webp" alt="[视频卫星]">`,
      "[干杯]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/8da12d5f55a2c7e9778dcc05b40571979fe208e6.png@48w_48h.webp" alt="[干杯]">`,
      "[黑洞]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/c4e9f0e3f35961d5037cb071b16ddba2170b262c.png@48w_48h.webp" alt="[黑洞]">`,
      "[爱心]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/ed04066ea7124106d17ffcaf75600700e5442f5c.png@48w_48h.webp" alt="[爱心]">`,
      "[胜利]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/b49fa9f4b1e7c3477918153b82c60b114d87347c.png@48w_48h.webp" alt="[胜利]">`,
      "[加油]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/c7aaeacb21e107292d3bb053e5abde4a4459ed30.png@48w_48h.webp" alt="[加油]">`,
      "[抱拳]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/89516218158dbea18ab78e8873060bf95d33bbbe.png@48w_48h.webp" alt="[抱拳]">`,
      "[响指]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/1b5c53cf14336903e1d2ae3527ca380a1256a077.png@48w_48h.webp" alt="[响指]">`,
      "[保佑]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/fafe8d3de0dc139ebe995491d2dac458a865fb30.png@48w_48h.webp" alt="[保佑]">`,
      "[福]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/802429a301ac5b35a0480d9526a070ce67cd8097.png@48w_48h.webp" alt="[福]">`,
      "[支持]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/3c210366a5585706c09d4c686a9d942b39feeb50.png@48w_48h.webp" alt="[支持]">`,
      "[拥抱]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/41780a4254750cdaaccb20735730a36044e98ef3.png@48w_48h.webp" alt="[拥抱]">`,
      "[跪了]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/f2b3aee7e521de7799d4e3aa379b01be032698ac.png@48w_48h.webp" alt="[跪了]">`,
      "[怪我咯]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/07cc6077f7f7d75b8d2c722dd9d9828a9fb9e46d.png@48w_48h.webp" alt="[怪我咯]">`,
      "[香格里拉边境]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/80e53d32b4abd12232126f03c68de7c1a67a1e9f.png@48w_48h.webp" alt="[香格里拉边境]">`,
      "[老鼠]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/8e6fb491eb1bb0d5862e7ec8ccf9a3da12b6c155.png@48w_48h.webp" alt="[老鼠]">`,
      "[牛年]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/9275275ff1f2659310648221107d20bc4970f106.png@48w_48h.webp" alt="[牛年]">`,
      "[三星堆]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/fc7dadaa6986e75b813aa26f3eff3281d5f1a6d1.png@48w_48h.webp" alt="[三星堆]">`,
      "[桃源_给花花]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/085d41d0fa25453b58fdc87dc2df538183fea11e.png@48w_48h.webp" alt="[桃源_给花花]">`,
      "[桃源_缘分]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/cf1c441507689342713623965035f9bed72b1b17.png@48w_48h.webp" alt="[桃源_缘分]">`,
      "[桃源_傲娇]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/ce8314c9c2cfdbe235c239c28b819698e29a02d3.png@48w_48h.webp" alt="[桃源_傲娇]">`,
      "[桃源_欢呼]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/1f439878d8160bd64a4464904064a10df880c921.png@48w_48h.webp" alt="[桃源_欢呼]">`,
      "[桃源_乖巧]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/57d087b6437002c2ca9e225dcac0ef226d1f2654.png@48w_48h.webp" alt="[桃源_乖巧]">`,
      "[洛天依]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/9fe06f3594d9afaf4ee2b74770f1c3086ae0ba11.png@48w_48h.webp" alt="[洛天依]">`,
      "[坎公骑冠剑_吃鸡]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/c4248a7b6ab326d66c83fd1fb58f1a50f99df332.png@48w_48h.webp" alt="[坎公骑冠剑_吃鸡]">`,
      "[坎公骑冠剑_钻石]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/0b97c7e50e0cc963370e62fbb9b55f51bbe7f8ab.png@48w_48h.webp" alt="[坎公骑冠剑_钻石]">`,
      "[坎公骑冠剑_无语]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/80eba0ce64c3fc1279b4daede2f1979cb2380e78.png@48w_48h.webp" alt="[坎公骑冠剑_无语]">`,
      "[来古-疑问]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/032fdc0d9d9fe6334776f6c39518a959b73b98f4.png@48w_48h.webp" alt="[来古-疑问]">`,
      "[来古-沉思]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/4ee07ff03266d62b246be0b950bebb2abf3d997c.png@48w_48h.webp" alt="[来古-沉思]">`,
      "[来古-呆滞]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/9a70b365e523f2379f395031ceefcebb75a45903.png@48w_48h.webp" alt="[来古-呆滞]">`,
      "[来古-震撼]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/8b40f228675602a317d32007de6b795c101135ec.png@48w_48h.webp" alt="[来古-震撼]">`,
      "[来古-注意]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/4b671ba32a2581cf40e5cd41c67b111eb8010de0.png@48w_48h.webp" alt="[来古-注意]">`,
      "[FGO_耶]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/cb57c18365601d277e5a5d52b0957616d034f04c.png@48w_48h.webp" alt="[FGO_耶]">`,
      "[FGO_开心]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/300dadb9ec3cf14cf5ed55e2542947fe6e4f0295.png@48w_48h.webp" alt="[FGO_开心]">`,
      "[FGO_汗]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/93d8a770a22914ade2354ca928bb1799b2260d00.png@48w_48h.webp" alt="[FGO_汗]">`,
      "[FGO_怒]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/75ee235f331b3c714e1cfb264fff9e562b20944b.png@48w_48h.webp" alt="[FGO_怒]">`,
      "[FGO_偷看]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/b2d752b135b72a93c13b26bb0e272070a906257b.png@48w_48h.webp" alt="[FGO_偷看]">`,
      "[初音未来_大笑]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/8e7f71cda83ce407b0684702983399f8ed982f17.png@48w_48h.webp" alt="[初音未来_大笑]">`,
      "[原神_哇]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/8188ddf95bace929d382c7a83214afde79d83bfc.png@48w_48h.webp" alt="[原神_哇]">`,
      "[原神_哼]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/91ed33b74bc36873c3ac8b2648f70d7ab6d8ab78.png@48w_48h.webp" alt="[原神_哼]">`,
      "[原神_嗯]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/8b0a87e414f453a29730b6e0f45ca61f2f898688.png@48w_48h.webp" alt="[原神_嗯]">`,
      "[原神_欸嘿]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/8fba438fcbe0550877b04efd768d857082307c5e.png@48w_48h.webp" alt="[原神_欸嘿]">`,
      "[原神_喝茶]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/1de5789fbb3526ef7823c54db7081790a38e7044.png@48w_48h.webp" alt="[原神_喝茶]">`,
      "[原神_生气]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/90a38c34742899f8e84138ed55f56cad3ba611fb.png@48w_48h.webp" alt="[原神_生气]">`,
      "[保卫萝卜_白眼]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/9fce63f38288700bf7be84f3be336cf895ba0902.png@48w_48h.webp" alt="[保卫萝卜_白眼]">`,
      "[保卫萝卜_笔芯]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/5ff2ed5cb71b02010018cc5910ac7052a03769af.png@48w_48h.webp" alt="[保卫萝卜_笔芯]">`,
      "[保卫萝卜_哭哭]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/7d249f7c990111d3e2982f7477af15b7eb29cbd9.png@48w_48h.webp" alt="[保卫萝卜_哭哭]">`,
      "[保卫萝卜_哇]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/5f2370e561c32d841245f7b1aab2eef43aeb9544.png@48w_48h.webp" alt="[保卫萝卜_哇]">`,
      "[保卫萝卜_问号]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/41eb93f09fc4a4d0692a310e8a1f85ba60e96060.png@48w_48h.webp" alt="[保卫萝卜_问号]">`,
      "[无悔华夏_不愧是你]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/c58002c32ee78d45366e126f294cb3149dd64ac2.png@48w_48h.webp" alt="[无悔华夏_不愧是你]">`,
      "[无悔华夏_吃瓜]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/273dcff577551bafff4f1eae18561f871e73a6ba.png@48w_48h.webp" alt="[无悔华夏_吃瓜]">`,
      "[无悔华夏_达咩]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/cffab383f47bab7f6736ba9c8d6ac098113410d9.png@48w_48h.webp" alt="[无悔华夏_达咩]">`,
      "[无悔华夏_点赞]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/b0f2e8db405ec667c3e6aaabd7c15155b6ea8710.png@48w_48h.webp" alt="[无悔华夏_点赞]">`,
      "[无悔华夏_好耶]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/324cd79784aeb37dbf2f47f68bbe8ed5d01f975e.png@48w_48h.webp" alt="[无悔华夏_好耶]">`,
      "[奥比岛_搬砖]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/1fab697214918d91087373a999cc7ef8040ddf85.png@48w_48h.webp" alt="[奥比岛_搬砖]">`,
      "[奥比岛_点赞]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/fb0b476fe2ff30cd59385ea7d616627ac114161f.png@48w_48h.webp" alt="[奥比岛_点赞]">`,
      "[奥比岛_击爪]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/35bba1bb8f164c5e844155548438248e6eaa8382.png@48w_48h.webp" alt="[奥比岛_击爪]">`,
      "[奥比岛_委屈]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/fda155e7c33b40dbb94c24644e0635d47b6ef3cc.png@48w_48h.webp" alt="[奥比岛_委屈]">`,
      "[奥比岛_喜欢]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/ed64e0c81ee194138bd9df30c65077ed978fb88c.png@48w_48h.webp" alt="[奥比岛_喜欢]">`,
      "[黎明觉醒_怒了鸦]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/078991ad7546f2fefb79c05894d5f0431736d1e7.png@48w_48h.webp" alt="[黎明觉醒_怒了鸦]">`,
      "[黎明觉醒_石化鸦]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/40bc09683e3b93390995b9ea5dc64f982b34e347.png@48w_48h.webp" alt="[黎明觉醒_石化鸦]">`,
      "[黎明觉醒_摊手鸦]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/883e4caa8e1745f48de0671c6441810faa4a56ed.png@48w_48h.webp" alt="[黎明觉醒_摊手鸦]">`,
      "[黎明觉醒_比心鸦]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/e25f5442c5bce2a54b9c757e3032f44398f1a7df.png@48w_48h.webp" alt="[黎明觉醒_比心鸦]">`,
      "[黎明觉醒_哼白眼鸦]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/36de90dbaffeb32477dffdac612ad69da4e19b76.png@48w_48h.webp" alt="[黎明觉醒_哼白眼鸦]">`,
      "[以闪亮之名_哎？！]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/5fafe7d9992e12c756da909a545ddb27486987af.png@48w_48h.webp" alt="[以闪亮之名_哎？！]">`,
      "[以闪亮之名_爱你哦]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/835c3bff4fc686a78f49db1eb68e4d04c0963195.png@48w_48h.webp" alt="[以闪亮之名_爱你哦]">`,
      "[以闪亮之名_吃瓜]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/ebfdda8501e48c2434297e4a9f15218aadf07747.png@48w_48h.webp" alt="[以闪亮之名_吃瓜]">`,
      "[以闪亮之名_好耶!]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/fd0c2bbb806265c468eca83b7a90b0d5fcaa4cec.png@48w_48h.webp" alt="[以闪亮之名_好耶!]">`,
      "[以闪亮之名_星星眼]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/a44a291ffe9334712ba130aa3fca0b940f32908d.png@48w_48h.webp" alt="[以闪亮之名_星星眼]">`,
      "[以闪亮之名_针不戳]": `<img class="${className}" src="https://i0.hdslb.com/bfs/emote/cad39e954972bbd93f0a777978b2f77078b8cf4a.png@48w_48h.webp" alt="[以闪亮之名_针不戳]">`,
    };
  function replaceEmojis(str, obj) {
    if (obj && str) {
      str = str.replaceAll('alt="[', "$_alt_$");
      for (const key in obj) str = str.replaceAll(key, obj[key]);
      str = str.replaceAll("$_alt_$", 'alt="[');
    }
    return str;
  }
  const keyBase = "ll_comment_history_",
    settings = {
      isHiddenBtn: {
        value: !1,
        base: !1,
        valType: "boolean",
        key: keyBase + "isHiddenBtn",
        txt: "是否隐藏按钮 (隐藏整个区域), 隐藏后鼠标移入时会显示出来",
        type: "显示设置",
        compType: "radio",
        valueText: { true: "隐藏", false: "显示" },
      },
      isRetractList: {
        value: !0,
        base: !0,
        valType: "boolean",
        key: keyBase + "isRetractList",
        txt: "是否在鼠标移出列表区域后自动收起列表",
        type: "显示设置",
        compType: "radio",
        valueText: { true: "自动收起", false: "不收起" },
      },
      position: {
        value: "4, 4",
        base: "4, 4",
        valType: "string",
        key: keyBase + "position",
        txt: "设置按钮的显示位置 (左侧 和 顶部的距离), 可以为负值, 中间用 , 分隔\n如: 10,50 表示距离左侧10像素距离顶部50像素",
        type: "显示设置",
        compType: "textarea",
        compH: "30px",
      },
      scale: {
        value: 1,
        base: 1,
        valType: "number",
        key: keyBase + "scale",
        txt: "设置整个区域的缩放倍率 (大于1则放大,小于1则缩小)",
        type: "显示设置",
        compType: "textarea",
        compH: "30px",
      },
      hiddenBtnTime: {
        value: 5,
        base: 5,
        valType: "number",
        key: keyBase + "hiddenBtnTime",
        txt: "加载页面后隐藏按钮的时间 (秒)\n0表示按钮初始隐藏",
        type: "显示设置",
        compType: "textarea",
        compH: "30px",
      },
      closeListTime: {
        value: 0,
        base: 0,
        valType: "number",
        key: keyBase + "closeListTime",
        txt: "自动收起列表的等待时间 (秒)\n0表示鼠标移开后立马收起列表",
        type: "显示设置",
        compType: "textarea",
        compH: "30px",
      },
      zanListIsDesc: {
        value: !0,
        base: !0,
        valType: "boolean",
        key: keyBase + "zanListIsDesc",
        txt: "点赞评论的列表是否倒序显示, 倒序则新评论将显示在列表顶部",
        type: "列表设置",
        compType: "radio",
        valueText: { true: "倒序显示", false: "顺序显示" },
      },
      histListIsDesc: {
        value: !0,
        base: !0,
        valType: "boolean",
        key: keyBase + "histListIsDesc",
        txt: "历史评论的列表是否倒序显示",
        type: "列表设置",
        compType: "radio",
        valueText: { true: "倒序显示", false: "顺序显示" },
      },
      sukiListIsDesc: {
        value: !0,
        base: !0,
        valType: "boolean",
        key: keyBase + "sukiListIsDesc",
        txt: "收藏列表是否倒序显示",
        type: "列表设置",
        compType: "radio",
        valueText: { true: "倒序显示", false: "顺序显示" },
      },
      isConfirm: {
        value: !0,
        base: !0,
        valType: "boolean",
        key: keyBase + "isConfirm",
        txt: "点击删除按钮时是否进行弹窗确认",
        type: "列表设置",
        compType: "radio",
        valueText: { true: "弹窗确认", false: "直接删除" },
      },
      editWrapClose: {
        value: !0,
        base: !0,
        valType: "boolean",
        key: keyBase + "editWrapClose",
        txt: "是否在点击编辑区外的背景时取消编辑",
        type: "列表设置",
        compType: "radio",
        valueText: { true: "点击背景时取消编辑", false: "点击背景时无操作" },
      },
      isHiddenList: {
        value: !1,
        base: !1,
        valType: "boolean",
        key: keyBase + "isHiddenList",
        txt: "是否在双击列表的一条评论记录后收起列表",
        type: "列表设置",
        compType: "radio",
        valueText: { true: "双击后收起", false: "不收起" },
      },
      listSize: {
        value: "400x500",
        base: "400x500",
        valType: "string",
        key: keyBase + "listSize",
        txt: "设置列表的宽度和最大高度, 中间用 x 分隔\n如: 400x300 表示列表宽度400像素, 列表最大高度300像素",
        type: "列表设置",
        compType: "textarea",
        compH: "30px",
      },
      zanListMaxLen: {
        value: 1500,
        base: 1500,
        valType: "number",
        key: keyBase + "zanListMaxLen",
        txt: "点赞列表的最大长度, 超出时最早的数据会被删除, 0表示无长度上限 (收藏列表默认无长度上限). 点赞列表过长时会影响列表初次加载的速度",
        type: "列表设置",
        compType: "textarea",
        compH: "30px",
      },
      listMaxLen: {
        value: 0,
        base: 0,
        valType: "number",
        key: keyBase + "listMaxLen",
        txt: "历史列表的最大长度",
        type: "列表设置",
        compType: "textarea",
        compH: "30px",
      },
      liMaxHeight: {
        value: 220,
        base: 220,
        valType: "number",
        key: keyBase + "liMaxHeight",
        txt: "设置列表项的最大高度(像素), 0表示不限制高度, 完全显示每一项",
        type: "列表设置",
        compType: "textarea",
        compH: "30px",
      },
      titleFormat: {
        title: "标题格式",
        value: "[评论日期] [网页标题]",
        base: "[评论日期] [网页标题]",
        valType: "string",
        key: keyBase + "titleFormat",
        txt: '设置新增列表项的标题格式, 可根据需要调整格式, 增减内容, 新增列表项的标题将按照设定的格式生成\n示例: "[评论日期]-[评论来源]: [评论用户]", 则会生成如"2023.12.08-视频: 零泠丶"格式的标题\n可选:\n[评论日期]: 评论的 点赞/发布/收藏 日期, 如: 2023.12.08\n[评论来源]: 评论来自于B站的什么模块, 视频/专栏/动态 ...\n[网页标题]: 视频的标题 / 动态的标题 / 专栏的标题 ...\n[视频ID]: 评论对应的视频的ID (如果是视频页的评论)\n[视频标签]: 评论对应的 视频/专栏 的标签\n[评论用户]: 发布该评论的用户的名称, 自己发布的则显示\'自己\'\n[评论内容]: 评论的内容\n[回复用户]: 回复的用户的名称\n[楼主名称]: 楼中楼的评论对应的楼主的名称\n[楼主评论]: 楼主的评论内容\n',
        type: "列表设置",
        compType: "textarea",
        compH: "30px",
      },
      sendKeys: {
        title: "评论快捷键",
        value: "ctrl+enter",
        base: "ctrl+enter",
        valType: "string",
        key: keyBase + "sendKeys",
        txt: "设置发送消息时的快捷键, 每个键用 + 分隔, 特殊字符请用英文符号 (不支持shift+enter)\n例如: ctrl + enter 表示按下ctrl和回车键发送消息\n可使用单个按键, 支持 ctrl shift alt win/meta 字母 数字 等的组合键",
        type: "快捷键设置",
        compType: "textarea",
        compH: "30px",
      },
      addItemKeys: {
        title: "收藏组合键",
        value: "ctrl",
        base: "ctrl",
        valType: "string",
        key: keyBase + "addItemKeys",
        txt: "设置评论加入评论收藏的组合键, 每个键用 + 分隔, 按下组合键后'双击'评论的文本可将文本添加到评论收藏的列表中\n仅支持 ctrl shift alt win/meta 的组合键",
        type: "快捷键设置",
        compType: "textarea",
        compH: "30px",
      },
      isHiddenMenu: {
        value: !1,
        base: !1,
        valType: "boolean",
        key: keyBase + "isHiddenMenu",
        txt: "鼠标移出整个区域后, 是否自动收起菜单栏",
        type: "其他设置",
        compType: "radio",
        valueText: { true: "收起菜单", false: "不收起" },
      },
      isFormatOut: {
        value: !0,
        base: !0,
        valType: "boolean",
        key: keyBase + "isFormatOut",
        txt: "是否格式化导出评论数据, 格式化后导出的文件便于阅读, 但少数时候格式化数据导入时可能会导入失败",
        type: "其他设置",
        compType: "radio",
        valueText: { true: "格式化导出", false: "标准导出" },
      },
      isDoubleOut: {
        value: !0,
        base: !0,
        valType: "boolean",
        key: keyBase + "isDoubleOut",
        txt: "格式化导出时是否再进行一次标准导出, 以防格式化数据可能导入失败",
        type: "其他设置",
        compType: "radio",
        valueText: { true: "导出两份数据", false: "仅导出一份数据" },
      },
      lazyLoadListPages: {
        title: "列表延迟加载",
        value: [
          "首页",
          "视频",
          "搜索",
          "主页",
          "动态",
          "专栏",
          "番剧",
          "直播",
          "消息",
        ],
        base: [
          "首页",
          "视频",
          "搜索",
          "主页",
          "动态",
          "专栏",
          "番剧",
          "直播",
          "消息",
        ],
        valType: "array",
        key: keyBase + "lazyLoadListPages",
        txt: "设置哪些页面对评论列表进行延迟加载. 延迟加载时, 鼠标移入按钮区域后才对评论列表进行加载, 若评论内容过多则评论列表的菜单栏展开时会有一定卡顿(仅初次展开时有影响); 若不延迟加载, 则加载页面时就加载评论列表, 若评论内容过多则会影响页面初始加载的速度",
        type: "其他设置",
        compType: "checkbox",
        valueText: {
          首页: "首页",
          视频: "视频",
          搜索: "搜索",
          主页: "主页",
          动态: "动态",
          专栏: "专栏",
          番剧: "番剧",
          直播: "直播",
          消息: "消息",
        },
      },
      imageLazyLoad: {
        title: "图片懒加载",
        value: !0,
        base: !0,
        valType: "boolean",
        key: keyBase + "imageLazyLoad",
        txt: "是否动态加载图片, 动态加载图片时只有可见区域内的图片才会被加载, 列表图片过多时能提高页面响应速度",
        type: "其他设置",
        compType: "radio",
        valueText: { true: "动态加载图片", false: "每次加载全部图片" },
        dis: 80,
      },
      imgType: {
        title: "图片下载格式",
        value: "auto",
        base: "auto",
        valType: "string",
        key: keyBase + "imgType",
        txt: "设置图片下载的格式, 设为auto时将自动识别图片格式\npng: 质量高 体积大\njpg: 质量较高 体积较小\nwebp: 质量较高 体积小",
        type: "其他设置",
        compType: "radio",
        valueText: { png: "png", jpg: "jpg", webp: "webp", auto: "auto" },
      },
      isSaveEmoji: {
        title: "评论表情",
        value: !0,
        base: !0,
        valType: "boolean",
        key: keyBase + "isSaveEmoji",
        descTt:
          "删除评论数据不会影响已经记录的表情, 因此可发送一系列表情的评论, 然后点赞保存到点赞列表中, 接着删除它, 之后就可以显示这些表情了",
        txt: "是否使用基础的小黄脸表情, 并记录新增评论中的表情, 所有列表中对应的表情文本将显示为表情图片(包括之前未显示为表情图片的表情文本), 修改评论内容时可用表情文本表示一个表情, 如: [doge]\n注: 评论数据和表情记录过多时可能在一定程度上影响插件运行的流畅度, 可定期导出数据后清空列表",
        type: "其他设置",
        compType: "radio",
        valueText: {
          true: "使用小黄脸表情并记录新表情",
          false: "仅显示评论内原有的表情",
        },
      },
      autoSave: {
        title: "自动备份",
        value: 10,
        base: 10,
        valType: "number",
        key: keyBase + "autoSave",
        txt: "设置自动备份列表数据的间隔天数, 0表示关闭自动备份",
        type: "其他设置",
        compType: "textarea",
        compH: "30px",
      },
    },
    cfg_keyBase = "ll_comment_history_",
    info = {
      version: "2.8.17",
      commentVersion: "",
      pageType: "",
      keyBase: cfg_keyBase,
      cssId: cfg_keyBase + "css",
      settingsArea: null,
      notRecordCommentPages: ["首页", "搜索", "直播"],
      personalHome: "https://space.bilibili.com/",
      doms: {},
      saveData: {
        zanList: {
          value: [],
          base: [],
          key: cfg_keyBase + "zanList",
          valType: "array",
        },
        list: {
          value: [],
          base: [],
          key: cfg_keyBase + "list",
          valType: "array",
        },
        sukiList: {
          value: [],
          base: [],
          key: cfg_keyBase + "sukiList",
          valType: "array",
        },
        emojiList: {
          value: emoji,
          base: emoji,
          key: cfg_keyBase + "emojiList",
          valType: "object",
        },
        autoSaveTime: {
          value: 0,
          base: new Date().getTime(),
          key: cfg_keyBase + "autoSaveTime",
          valType: "number",
        },
      },
      settings,
      history: {
        isListCreated: !1,
        searchZIndex: 12e3,
        editZIndex: 12e3,
        msgZIndex: 12e3,
        width: 30,
        height: 30,
        fontSize: 14,
        imgSuffix: "!web-comment-note.avif",
        lazyBaseImage:
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        imgSize: { w: [110, 165], h: [110, 165] },
        txt: {
          searchTT:
            "搜索所有评论的内容, 若要按标题搜索请先输入'标题=', 按描述搜索输入'描述=', 按日期搜索输入'日期='. 若含有==>或===则表示替换, 如: 标题=A==>B, 表示将列表中所有标题中的A替换为B",
          saveImgText: "是否下载该列表中的所有图片？(包括表情)",
          editPhTT: "请输入标题",
          editPhDesc:
            "请输入描述\n鼠标对准标题时将显示描述信息\n鼠标对准序号时将显示日期",
          editPhValue: "请 输 入 内 容",
          listTT: "双击跳转到评论来源的页面",
          toBottomTT: "滚动到列表底部. 双击评论序号可回到顶部",
          settings: "打开插件设置界面",
        },
        replaceObj: {},
        zan_info: { saveName: cfg_keyBase + "zanList", callback: {} },
        data: { saveName: cfg_keyBase + "list", callback: {} },
        suki_info: { saveName: cfg_keyBase + "sukiList", callback: {} },
        color: {
          main: "#addeee",
          bd: "#dfedfe",
          font: "#4f4f4f",
          h_font: "#75beff",
          listBtnObj: {
            bg: "#fff",
            bd: "",
            hover: "#75b3ff",
            hover_bg: "#fff",
            hover_bd: "",
            click: "#75b3ff",
            click_bg: "#fff",
            click_bd: "",
          },
        },
        classList: { imageLazyLoad: "image-lazy", imageLoaded: "image-loaded" },
        doms: {
          box: { id: cfg_keyBase + "box", title: "" },
          btn: { class: "btn", title: "评论管理工具-2.8.17" },
          options: { class: "options", title: "" },
          zan_comment: {
            option: { text: "点赞评论", class: "zan-comment" },
            list: { class: "ll_comment_zanList" },
          },
          comment: {
            option: { text: "历史评论", class: "hist-comment" },
            list: { class: "ll_comment_list" },
          },
          suki_comment: {
            option: { text: "评论收藏", class: "suki-comment" },
            list: { class: "ll_comment_cukiList" },
          },
        },
      },
      customKeys: {
        isBtnClickEvent: !0,
        curDoms: {},
        curClassList: {},
        comment_container: null,
        classList: {
          versions: [
            {
              type: "id",
              class: "",
              selector: "#commentapp",
              id: "commentapp",
              version: "v240713",
            },
            {
              type: "class",
              class: "comment-container",
              selector: ".comment-container",
              version: "v231123",
            },
            {
              type: "id",
              id: "link-message-container",
              selector: "#link-message-container",
              version: "v231123",
            },
          ],
          focus: "focus",
          noteIcon: "note-prefix",
          icon: "icon",
          smallEmoji: "emoji-small",
          largeEmoji: "emoji-large",
          commentTop: "top-icon",
          image: "image-exhibition",
          search: "search-word",
          v240713: {
            container: {
              type: "id",
              selector: "#commentapp",
              value: "commentapp",
            },
            smallEmojiSize: "1.4em",
            largeEmojiSize: "50px",
            searchDataset: { name: "type", value: "search" },
            replyUserDataset: {
              name: "type",
              value: "mention",
              uid: "userProfileId",
            },
            tagObj: {
              视频: {
                box: { selector: ".video-tag-container" },
                btn: { selector: ".tag-link" },
              },
              专栏: {
                box: { selector: ".article-tags" },
                btn: { selector: ".tag-item" },
              },
            },
            sendPositionEle: {
              type: "id",
              selector: "#comment-area",
              value: "comment-area",
            },
            textarea: {
              type: "class",
              selector: ".brt-editor",
              value: "brt-editor",
              shadowRootPath_position: [
                [
                  {
                    type: "ele",
                    selector: "bili-comment-rich-textarea",
                    value: "bili-comment-rich-textarea",
                  },
                ],
              ],
              shadowRootPath_focus: [
                [
                  {
                    type: "ele",
                    selector: "bili-comment-rich-textarea",
                    value: "bili-comment-rich-textarea",
                  },
                ],
              ],
              focus: {
                value: "active",
                type: "class",
                class: "",
                id: "editor",
                selector: "#editor.active",
                shadowRootPath: [
                  [
                    {
                      type: "ele",
                      selector: "bili-comments",
                      value: "bili-comments",
                    },
                    {
                      type: "ele",
                      selector: "bili-comments-header-renderer",
                      value: "bili-comments-header-renderer",
                    },
                    {
                      type: "ele",
                      selector: "bili-comment-box",
                      value: "bili-comment-box",
                    },
                  ],
                  [
                    {
                      type: "ele",
                      selector: "bili-comments",
                      value: "bili-comments",
                    },
                    {
                      type: "ele",
                      selector: "bili-comment-thread-renderer",
                      value: "bili-comment-thread-renderer",
                      multiple: !0,
                    },
                    {
                      type: "ele",
                      selector: "bili-comment-box",
                      value: "bili-comment-box",
                    },
                  ],
                ],
              },
              placeholder: {
                type: "class",
                selector: ".brt-placeholder",
                value: "brt-placeholder",
              },
            },
            sendBtn: {
              type: "ele",
              selector: "button",
              value: "button",
              text: "发布",
              shadowRootPath_position: [
                [{ type: "id", selector: "#pub", value: "pub" }],
              ],
              focus: { value: "active", id: "editor" },
            },
            commentPositionEle: {
              type: "id",
              selector: "#body",
              value: "body",
            },
            reply: {
              type: "id",
              selector: "#body",
              value: "body",
              shadowRootPath: [
                [
                  {
                    type: "ele",
                    selector: "bili-comments",
                    value: "bili-comments",
                  },
                  {
                    type: "ele",
                    selector: "bili-comment-thread-renderer",
                    value: "bili-comment-thread-renderer",
                    multiple: !0,
                  },
                  {
                    type: "ele",
                    selector: "bili-comment-renderer",
                    value: "bili-comment-renderer",
                  },
                ],
                [
                  {
                    type: "ele",
                    selector: "bili-comments",
                    value: "bili-comments",
                  },
                  {
                    type: "ele",
                    selector: "bili-comment-thread-renderer",
                    value: "bili-comment-thread-renderer",
                    multiple: !0,
                  },
                  {
                    type: "ele",
                    selector: "bili-comment-replies-renderer",
                    value: "bili-comment-replies-renderer",
                  },
                  {
                    type: "ele",
                    selector: "bili-comment-reply-renderer",
                    value: "bili-comment-reply-renderer",
                    multiple: !0,
                  },
                ],
              ],
            },
            replyText: {
              type: "id",
              selector: "#contents",
              value: "contents",
              shadowRootPath_reply: [
                [
                  {
                    type: "ele",
                    selector: "bili-rich-text",
                    value: "bili-rich-text",
                  },
                ],
              ],
            },
            user: {
              type: "id",
              selector: "#user-name",
              value: "user-name",
              uid: "userProfileId",
              shadowRootPath_reply: [
                [
                  {
                    type: "ele",
                    selector: "bili-comment-user-info",
                    value: "bili-comment-user-info",
                  },
                ],
              ],
            },
            images: {
              type: "id",
              selector: "#content",
              value: "content",
              shadowRootPath_reply: [
                [
                  {
                    type: "ele",
                    selector: "bili-comment-pictures-renderer",
                    value: "bili-comment-pictures-renderer",
                  },
                ],
              ],
            },
          },
          视频: {
            replyItem: "reply-item",
            poster: "root-reply-container",
            focusDom: "reply-box-textarea",
            box: "reply-box",
            textarea: "reply-box-textarea",
            sendBtn: "reply-box-send",
            reply: "reply-content",
            subReply: "reply-content",
            subReplyP: "sub-reply-content",
            user: "user-name",
            subUser: "sub-user-name",
            replyUser: { class: "user", uid: "userId" },
            likeBtn: "reply-like",
            subLikeBtn: "sub-reply-like",
            liked: "liked",
            tagBox: { type: "id", value: "v_tag", selector: "#v_tag" },
            tag: "tag-link",
          },
          番剧: {
            replyItem: "reply-item",
            poster: "root-reply-container",
            focusDom: "reply-box-textarea",
            box: "reply-box",
            textarea: "reply-box-textarea",
            sendBtn: "reply-box-send",
            reply: "reply-content",
            subReply: "reply-content",
            subReplyP: "sub-reply-content",
            user: "user-name",
            subUser: "sub-user-name",
            replyUser: { class: "user", uid: "userId" },
            likeBtn: "reply-like",
            subLikeBtn: "sub-reply-like",
            liked: "liked",
          },
          主页: {
            replyItem: "reply-item",
            poster: "root-reply-container",
            focusDom: "reply-box-textarea",
            box: "reply-box",
            textarea: "reply-box-textarea",
            sendBtn: "reply-box-send",
            reply: "reply-content",
            subReply: "reply-content",
            subReplyP: "sub-reply-content",
            user: "user-name",
            subUser: "sub-user-name",
            replyUser: { class: "user", uid: "userId" },
            likeBtn: "reply-like",
            subLikeBtn: "sub-reply-like",
            liked: "liked",
          },
          动态: {
            replyItem: "reply-item",
            poster: "root-reply-container",
            focusDom: "reply-box-textarea",
            box: "reply-box",
            textarea: "reply-box-textarea",
            sendBtn: "reply-box-send",
            reply: "reply-content",
            subReply: "reply-content",
            subReplyP: "sub-reply-content",
            user: "user-name",
            subUser: "sub-user-name",
            replyUser: { class: "user", uid: "userId" },
            likeBtn: "reply-like",
            subLikeBtn: "sub-reply-like",
            liked: "liked",
            cjDetailsId: "bp-app",
          },
          专栏: {
            replyItem: "reply-item",
            poster: "root-reply-container",
            focusDom: "reply-box-textarea",
            box: "reply-box",
            textarea: "reply-box-textarea",
            sendBtn: "reply-box-send",
            reply: "reply-content",
            subReply: "reply-content",
            subReplyP: "sub-reply-content",
            user: "user-name",
            subUser: "sub-user-name",
            replyUser: { class: "user", uid: "userId" },
            likeBtn: "reply-like",
            subLikeBtn: "sub-reply-like",
            liked: "liked",
            tagObj: {
              专栏: {
                box: { selector: ".article-tags" },
                btn: { selector: ".tag-item" },
              },
            },
          },
          消息: {
            focusDom: "",
            box: "reply-box",
            textarea: "reply-textarea",
            sendBtn: "send-button",
            reply: "real-reply",
            orginalReply: "orginal-reply",
            user: "name-field",
            replyUser: { class: "at", uid: "userId" },
            likeBtn: "action-button",
            likeText: "点赞",
            liked: "active",
          },
        },
      },
    },
    hist = info.history;
  function getValue_getValue({
    base,
    key,
    valType = "string",
    isReSet = !0,
    getValue = null,
    setValue = null,
    getVal = null,
    setVal = null,
  } = {}) {
    getValue && (getVal = getValue), setValue && (setVal = setValue);
    let val = getVal ? getVal(key) : localStorage.getItem(key);
    return (
      void 0 !== base &&
        null == val &&
        ((val = base),
        isReSet &&
          ("string" != typeof base && (base = JSON.stringify(base)),
          setVal ? setVal(key, base) : localStorage.setItem(key, base))),
      (valType = valType.toLowerCase()),
      "string" == typeof val
        ? "string" === valType
          ? val
          : "boolean" === valType || "number" === valType
          ? JSON.parse(val)
          : "object" === valType
          ? val
            ? JSON.parse(val)
            : {}
          : "array" === valType
          ? val
            ? JSON.parse(val)
            : []
          : val
        : val
    );
  }
  function getData() {
    const settings = info.settings;
    for (const valName in settings) {
      const setting = settings[valName];
      setting.value = getValue_getValue({
        base: setting.base,
        key: setting.key,
        valType: setting.valType,
        getVal: GM_getValue,
        setVal: GM_setValue,
      });
    }
    return (
      (function getSaveData() {
        const saveData = info.saveData;
        for (const valName in saveData) {
          const setting = saveData[valName];
          setting.value = getValue_getValue({
            base: setting.base,
            key: setting.key,
            valType: setting.valType,
            getVal: GM_getValue,
            setVal: GM_setValue,
          });
        }
      })(),
      info.settings
    );
  }
  hist.zan_info.suki_info = hist.data.suki_info = hist.suki_info;
  const curInfo = info.history,
    doms = curInfo.doms,
    css_settings = info.settings,
    css_history = info.history;
  function setValue({
    value,
    base,
    key,
    verification = null,
    getValue = null,
    setValue = null,
    getVal = null,
    setVal = null,
  } = {}) {
    getValue && (getVal = getValue), setValue && (setVal = setValue);
    let f = !1;
    try {
      (getVal !== GM_getValue && setVal !== GM_setValue) || (f = !0);
    } catch (e) {}
    let newVal = value,
      oldVal = getVal ? getVal(key) : localStorage.getItem(key);
    return (
      void 0 !== base &&
        null == oldVal &&
        ((oldVal = base),
        "string" == typeof base || f || (base = JSON.stringify(base)),
        setVal ? setVal(key, base) : localStorage.setItem(key, base)),
      null !== newVal &&
        ("function" != typeof verification ||
          ((newVal = verification(newVal, oldVal, base)), null !== newVal)) &&
        newVal !== oldVal &&
        ("string" == typeof newVal || f || (newVal = JSON.stringify(newVal)),
        setVal ? setVal(key, newVal) : localStorage.setItem(key, newVal),
        !0)
    );
  }
  function createEle({
    className = "",
    id = "",
    title = "",
    css,
    box = document.body,
    type = "div",
  } = {}) {
    const ele = document.createElement(type);
    return (
      id && (ele.id = id),
      className && (ele.className = className),
      title && (ele.title = title),
      css && (ele.style.cssText = css),
      box.appendChild(ele),
      ele
    );
  }
  const baseCfg = {
      state: "",
      isEditing: !1,
      hasSelectedPage: !1,
      param: {
        id: "ll_edit_wrap",
        box: document.body,
        classBase: "ll_edit_",
        w: "500px",
        h: "",
        contentH: "450px",
        bg: "rgba(0, 0, 0, 0.15)",
        color: "#333",
        fontSize: "15px",
        fontFamily:
          "PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif",
        zIndex: 11e3,
        resetTt: "重置当前页的所有设置为默认值",
        isShowMenu: !1,
        isScrollStyle: !0,
        isResetBtn: !0,
        isOnlyResetCurPage: !0,
        showPage: void 0,
        isIntervalRun: !1,
        interval: 1e3,
        page: [],
        callback: {
          resetBefore: null,
          reset: null,
          confirmBefore: null,
          finished: null,
          interval: null,
          cancelBefore: null,
          cancelled: null,
        },
      },
    },
    cfg = {
      version: "v1.2.2",
      isEditing: baseCfg.isEditing,
      hasSelectedPage: baseCfg.hasSelectedPage,
      timer: null,
      interval: 1e3,
      param: {},
      tempParam: {},
      allData: {},
      oldData: {},
      lastData: {},
      baseData: {},
      controls: {},
      doms: { page: [] },
      editText: {},
    };
  const css = function css_getCss() {
    const param = cfg.param,
      cBase = (param.page, param.classBase),
      baseStart = `#${param.id} .${cBase}`,
      fSize = param.fontSize ? param.fontSize : "14px",
      css = `#${
        param.id
      } {\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  z-index: ${
        param.zIndex || 11e3
      };\n  background: ${
        param.bg || "rgba(0, 0, 0, 0.12)"
      };\n  display: none;\n}\n${baseStart}box {\n  text-align: initial;\n  letter-spacing: 1px;\n  position: relative;\n  width: ${
        param.w || "450px"
      };\n  ${
        param.h ? "max-height:" + param.h : ""
      };\n  margin: auto;\n  color: ${
        param.color || "#333"
      };\n  background: #fff;\n  font-size: ${fSize};\n  line-height: normal;\n  font-family: ${
        param.fontFamily ||
        "PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif"
      };\n  border: 3px solid #dfedfe;\n  border-radius: 10px;\n  box-sizing: border-box;\n  padding: 14px 8px 10px 15px;\n  overflow: hidden;\n  overflow-y: auto;\n}\n${baseStart}menu {\n  font-weight: bold;\n  font-size: ${
        parseInt(fSize) + 1
      }px;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0 8px;\n}\n${baseStart}menu-item {\n  margin-bottom: 8px;\n  border: 1px solid #dfedfe;\n  color: #9ecaff;\n  background: #eef6ff;\n  border-radius: 6px;\n  padding: 6px 10px;\n  cursor: pointer;\n}\n${baseStart}menu-item:hover {\n  color: #65aaff;\n  background: #dfedfe;\n  border: 1px solid #dfedfe;\n}\n${baseStart}menu-item.active {\n  color: #65aaff;\n  background: #dfedfe;\n  border: 1px solid #dfedfe;\n}\n${baseStart}page-box {\n  max-height: ${
        param.contentH || ""
      };\n  padding-right: 7px;\n  margin-bottom: 8px;\n  overflow: hidden;\n  overflow-y: auto;\n}\n${baseStart}page {\n  display: none;\n}\n${baseStart}page.curPage {\n  display: block;\n}\n${baseStart}comp {\n  margin-bottom: 8px;\n}\n${baseStart}comp:last-child {\n  margin-bottom: 2px;\n}\n${baseStart}tt {\n  font-weight: bold;\n  font-size: ${
        parseInt(fSize) + 6
      }px;\n  margin-top: 4px;\n}\n${baseStart}tt2 {\n  font-weight: bold;\n  font-size: ${
        parseInt(fSize) + 4
      }px;\n  margin-top: 3px;\n  margin-bottom: 7px;\n}\n${baseStart}tt3 {\n  font-weight: bold;\n  font-size: ${
        parseInt(fSize) + 2
      }px;\n  margin-top: 2px;\n  margin-bottom: 6px;\n}\n${baseStart}desc {\n  line-height: 1.5;\n}\n${baseStart}comp-tt {\n  font-weight: bold;\n  font-size: ${
        parseInt(fSize) + 1
      }px;\n  line-height: 1.5;\n}\n${baseStart}comp-desc {\n  line-height: 1.5;\n}\n${baseStart}rd-arr {\n  line-height: 22px;\n}\n${baseStart}rd-arr label {\n  margin-right: 6px;\n  cursor: pointer;\n}\n${baseStart}rd-arr input {\n  vertical-align: -2px;\n  cursor: pointer;\n}\n${baseStart}rd-arr span {\n  color: #666;\n  margin-left: 2px;\n}\n#${
        param.id
      } textarea {\n  width: 100%;\n  max-width: 100%;\n  max-height: 300px;\n  border-radius: 6px;\n  line-height: normal;\n  padding: 5px 7px;\n  outline-color: #cee4ff;\n  border: 1px solid #aaa;\n  box-sizing: border-box;\n  font-size: ${
        parseInt(fSize) - 2
      }px;\n  font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;\n  /* 保留空格 */\n  white-space: pre-wrap;\n  /* 允许词内换行 */\n  word-break: break-all;\n  letter-spacing: 1px;\n  overflow: hidden;\n  overflow-y: auto;\n}\n#${
        param.id
      } textarea::placeholder {\n  color: #bbb;\n}\n${baseStart}ta-desc {\n  margin-bottom: 3px;\n}\n${baseStart}btn-box {\n  display: flex;\n  justify-content: flex-end;\n}\n${baseStart}btn-box button {\n  font-size: 16px;\n  line-height: normal;\n  color: #65aaff;\n  background: #dfedfe;\n  outline: none;\n  border: none;\n  border-radius: 6px;\n  padding: 8px 16px;\n  box-sizing: border-box;\n  cursor: pointer;\n}\n${baseStart}btn-box .${cBase}reset-btn {\n  position: absolute;\n  left: 15px;\n  bottom: 10px;\n  color: #888;\n  background: #f4f4f4;\n  margin-right: 15px;\n}\n${baseStart}btn-box .${cBase}reset-btn:hover {\n  color: #666;\n  background: #eee;\n}\n${baseStart}btn-box .${cBase}cancel-btn {\n  color: #888;\n  background: #f4f4f4;\n  margin-right: 15px;\n}\n${baseStart}btn-box .${cBase}cancel-btn:hover {\n  color: #666;\n  background: #eee;\n}\n${baseStart}btn-box .${cBase}confirm-btn {\n  margin-right: 7px;\n}\n${baseStart}btn-box .${cBase}confirm-btn:hover {\n  background: #cee4ff;\n}\n`;
    return param.isScrollStyle
      ? css +
          "\n.ll-scroll-style-1::-webkit-scrollbar,\n.ll-scroll-style-1 ::-webkit-scrollbar {\n  width: 8px;\n}\n.ll-scroll-style-1-size-2::-webkit-scrollbar,\n.ll-scroll-style-1 .ll-scroll-style-1-size-2::-webkit-scrollbar {\n  width: 10px;\n}\n.ll-scroll-style-1-size-3::-webkit-scrollbar,\n.ll-scroll-style-1 .ll-scroll-style-1-size-3::-webkit-scrollbar {\n  width: 12px;\n}\n.ll-scroll-style-1::-webkit-scrollbar-thumb,\n.ll-scroll-style-1 ::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.05);\n  opacity: 0.2;\n  background: #daedff;\n}\n.ll-scroll-style-1::-webkit-scrollbar-track,\n.ll-scroll-style-1 ::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.08);\n  border-radius: 0;\n  background: #fff;\n  border-radius: 5px;\n}"
      : css;
  };
  const editArea_html = function getHTML() {
      function getCompHTML({ info, active = "", id }) {
        let type = info.type;
        if (
          ((type = {
            menuTitle: "mtt",
            title: "tt",
            title2: "tt2",
            title3: "tt3",
            desc: "ds",
            radio: "rd",
            checkbox: "cb",
            textarea: "ta",
            mtt: "mtt",
            tt: "tt",
            tt2: "tt2",
            tt3: "tt3",
            ds: "ds",
            rd: "rd",
            cb: "cb",
            ta: "ta",
          }[type]),
          (id = 0 === id ? "0" : id || ""),
          0 === info.value && (info.value = "0"),
          !type)
        )
          return console.log("不存在的组件类型"), !1;
        let title = "",
          desc = "",
          ctrlTt = "";
        switch (
          (["tt", "tt2", "tt3", "ds", "mtt"].includes(type) ||
            ((title = info.title
              ? `<div class="${cBase}comp-tt ${cBase}${type}-tt" title="${
                  info.tt || ""
                }">${info.title}</div>`
              : ""),
            (desc = info.desc
              ? `<div class="${cBase}comp-desc ${cBase}${type}-desc">${info.desc}</div>`
              : "")),
          type)
        ) {
          case "mtt":
            return (
              (info.value = info.value || ""),
              info.value
                ? `<div class="${cBase}menu-item ${active || ""}" title="${
                    info.tt || ""
                  }">${info.value}</div>`
                : ""
            );
          case "tt":
          case "tt2":
          case "tt3":
            return (
              (info.value = info.value || ""),
              info.value
                ? `<div class="${cBase}${type} ${cBase}comp" title="${
                    info.tt || ""
                  }">${info.value}</div>`
                : ""
            );
          case "ds":
            return (
              (info.value = info.value || ""),
              info.value
                ? `<div class="${cBase}desc ${cBase}comp" title="${
                    info.descTt || ""
                  }">${info.value}</div>`
                : ""
            );
          case "rd":
            const name = info.name || info.id + new Date().getTime();
            (ctrlTt = info.ctrlTt || ""),
              ctrlTt && (ctrlTt = `title="${ctrlTt}"`);
            let radio = `<div class="${cBase}rd ${cBase}rd-arr" ${ctrlTt}>`;
            if (void 0 === info.value && info.radioList[0]) {
              const obj = info.radioList[0];
              info.value = void 0 === obj.value ? obj.text : obj.value;
            }
            return (
              info.radioList.forEach((item, i) => {
                void 0 === item.value && (info.radioList[i].value = item.text),
                  void 0 === item.text && (info.radioList[i].text = item.value);
                const value = item.value;
                let tt = item.tt || "";
                tt && (tt = `title="${tt}"`);
                let selected = "";
                info.value + "" == item.value + "" && (selected = "checked"),
                  (radio += `<label ${tt}><input ${selected} type="radio" name="${name}" data-val="${value}" data-cpid="${id}"><span>${item.text}</span></label>`);
              }),
              (radio += "</div>"),
              `<div class="${cBase}comp ${cBase}ctrl ${cBase}rd-box" data-type="${type}" data-cpid="${id}">${title}${desc}${radio}</div>`
            );
          case "cb":
            const name2 = info.name || new Date().getTime();
            if (
              ((ctrlTt = info.ctrlTt || ""),
              ctrlTt && (ctrlTt = `title="${ctrlTt}"`),
              void 0 === info.value && info.radioList[0])
            ) {
              const obj = info.radioList[0];
              info.value = void 0 === obj.value ? obj.text : obj.value;
            }
            let checkbox = `<div class="${cBase}cb ${cBase}rd-arr" ${ctrlTt}>`;
            return (
              info.radioList.forEach((item, i) => {
                void 0 === item.value && (info.radioList[i].value = item.text),
                  void 0 === item.text && (info.radioList[i].text = item.value);
                const value = item.value;
                let tt = item.tt || "";
                tt && (tt = `title="${tt}"`);
                let selected = "";
                info.value.includes(value) && (selected = "checked"),
                  (checkbox += `<label ${tt}><input ${selected} type="checkbox" name="${name2}" data-val="${value}" data-cpid="${id}"><span>${item.text}</span></label>`);
              }),
              (checkbox += "</div>"),
              `<div class="${cBase}comp ${cBase}ctrl ${cBase}cb-box" data-type="${type}" data-cpid="${id}">${title}${desc}${checkbox}</div>`
            );
          case "ta":
            const taH = `height:${info.height || "30px"};`,
              style = `style="${
                info.width ? "width:" + info.width + ";" : ""
              }${taH}${
                info.fontSize ? "font-size:" + info.fontSize + ";" : ""
              }${
                info.fontFamily ? "font-family:" + info.fontFamily + ";" : ""
              }"`,
              textarea = `<textarea class="${cBase}ta" ${style} data-cpid="${id}" placeholder="${
                info.ph || ""
              }" title="${info.ctrlTt || "拖动右下角可调节宽高"}"></textarea>`;
            return `<div class="${cBase}comp ${cBase}ctrl ${cBase}ta-box" data-type="${type}"  data-cpid="${id}">${title}${desc}${textarea}</div>`;
        }
      }
      const param = cfg.param,
        page = param.page,
        cBase = param.classBase,
        isMenu = 1 !== page.length;
      let menu = `<div class="${cBase}menu">`,
        pageHTML = `<div class="${cBase}page-box ll-scroll-style-1 ll-scroll-style-1-size-2">`;
      page.forEach((curPage, index) => {
        let pgid = curPage.id || index;
        (pgid += ""), (cfg.allData[pgid] = {}), (cfg.baseData[pgid] = {});
        let pageFlag = "";
        if (
          (cfg.hasSelectedPage ||
            ((void 0 === param.showPage || pgid === param.showPage + "") &&
              ((pageFlag = "curPage"), (cfg.hasSelectedPage = !0))),
          (pageHTML += `<div class="${cBase}page ${pageFlag}" data-pgid="${pgid}">`),
          curPage.components)
        ) {
          let compIndex = 0;
          if (isMenu || param.isShowMenu) {
            let curMenu = curPage.components.find(
              (item) => "menuTitle" === item.type
            );
            curMenu || (curMenu = { type: "menuTitle", value: pgid }),
              (menu += getCompHTML({
                info: curMenu,
                active: pageFlag ? "active" : "",
              }));
          }
          curPage.components.forEach((item) => {
            const cpid = item.id || compIndex;
            "menuTitle" !== item.type &&
              (pageHTML += getCompHTML({ info: item, id: cpid })),
              ["title", "title2", "title3", "desc", "menuTitle"].includes(
                item.type
              ) ||
                ((item.base = void 0 === item.base ? item.value : item.base),
                (cfg.allData[pgid][cpid] = item.value),
                (cfg.baseData[pgid][cpid] = item.base),
                compIndex++);
          });
        }
        pageHTML += "</div>";
      }),
        (pageHTML += "</div>"),
        isMenu || param.isShowMenu ? (menu += "</div>") : (menu = "");
      const resetBtn = param.isResetBtn
          ? `<button class="${cBase}reset-btn" title="${
              param.resetTt || "重置所有设置为默认值"
            }">重置</button>`
          : "",
        btnBox = `<div class="${cBase}btn-box">\n${resetBtn}\n<button class="${cBase}cancel-btn">取 消</button>\n<button class="${cBase}confirm-btn">确 认</button>\n</div>`;
      return `<div class="${cBase}box ll-scroll-style-1 ll-scroll-style-1-size-3" data-version="${cfg.version}">\n${menu}\n${pageHTML}\n${btnBox}\n</div>`;
    },
    baseParam = baseCfg.param,
    controls = cfg.controls,
    editArea_doms = cfg.doms;
  function createEditEle({
    id = baseParam.id,
    box = baseParam.box,
    classBase = baseParam.classBase,
    w = baseParam.w,
    h = baseParam.h,
    contentH = baseParam.contentH,
    bg = baseParam.bg,
    color = baseParam.color,
    fontSize = baseParam.fontSize,
    fontFamily = baseParam.fontFamily,
    zIndex = baseParam.zIndex,
    resetTt = baseParam.resetTt,
    isShowMenu = baseParam.isShowMenu,
    isScrollStyle = baseParam.isScrollStyle,
    isResetBtn = baseParam.isResetBtn,
    isOnlyResetCurPage = baseParam.isOnlyResetCurPage,
    showPage = baseParam.showPage,
    isIntervalRun = baseParam.isIntervalRun,
    interval = baseParam.interval,
    page = [],
    callback = baseParam.callback,
  } = {}) {
    (cfg.state = baseCfg.state),
      (cfg.isEditing = baseCfg.isEditing),
      (cfg.hasSelectedPage = baseCfg.hasSelectedPage),
      (cfg.param = { ...baseParam });
    const param = cfg.param;
    (box = box || document.body),
      (param.id = id),
      (param.box = box),
      (param.classBase = classBase),
      (param.w = w),
      (param.h = h),
      (param.contentH = contentH),
      (param.bg = bg),
      (param.color = color),
      (param.fontSize = fontSize),
      (param.fontFamily = fontFamily),
      (param.zIndex = zIndex),
      (param.resetTt = resetTt),
      (param.isShowMenu = isShowMenu),
      (param.isScrollStyle = isScrollStyle),
      (param.isResetBtn = isResetBtn),
      (param.isOnlyResetCurPage = isOnlyResetCurPage),
      (param.showPage = showPage),
      (param.isIntervalRun = isIntervalRun),
      (param.interval = interval),
      (param.page = page),
      (param.callback = callback),
      (cfg.interval = interval),
      (cfg.callback = callback);
    const html = editArea_html();
    return (
      box.querySelector(`#${param.classBase}${param.id}-css`) ||
        addCss(css(), box, param.classBase + param.id + "-css"),
      (editArea_doms.wrap = createEle({ className: id, id })),
      (editArea_doms.wrap.innerHTML = html),
      (function getDoms() {
        const param = cfg.param,
          cBase = param.classBase;
        (editArea_doms.box = editArea_doms.wrap.querySelector(`.${cBase}box`)),
          (editArea_doms.cancel = editArea_doms.box.querySelector(
            `.${cBase}cancel-btn`
          )),
          (editArea_doms.confirm = editArea_doms.box.querySelector(
            `.${cBase}confirm-btn`
          ));
        const isMenu = 1 !== param.page.length;
        (isMenu || param.isShowMenu) &&
          ((editArea_doms.menu = editArea_doms.box.querySelector(
            `.${cBase}menu`
          )),
          (editArea_doms.menus = [].slice.call(
            editArea_doms.menu.querySelectorAll(`.${cBase}menu-item`)
          )));
        const pages = [].slice.call(
          editArea_doms.box.querySelectorAll(`.${cBase}page`)
        );
        (editArea_doms.page = []),
          param.isResetBtn &&
            (editArea_doms.reset = editArea_doms.box.querySelector(
              `.${cBase}reset-btn`
            ));
        pages.forEach((curPage, index) => {
          cfg.hasSelectedPage ||
            (curPage.classList.add("curPage"),
            (isMenu || param.isShowMenu) &&
              editArea_doms.menus[0].classList.add("active"),
            (cfg.hasSelectedPage = !0));
          const page = {},
            pgid = curPage.dataset.pgid;
          (page.pgid = curPage.pgid = pgid),
            (page.controls = [].slice.call(
              curPage.querySelectorAll(`.${cBase}ctrl`)
            )),
            (page.ele = curPage),
            editArea_doms.page.push(page),
            (isMenu || param.isShowMenu) &&
              (editArea_doms.menus[index].settingsPage = curPage);
          const ctrls = {};
          (controls[pgid] = ctrls),
            page.controls.forEach((item, i) => {
              const cpid = item.dataset.cpid,
                cType = item.dataset.type;
              let dom;
              (item.cpid = cpid),
                "rd" === cType || "cb" === cType
                  ? ((dom = [].slice.call(item.querySelectorAll("input"))),
                    (dom.compType = cType))
                  : "ta" === cType &&
                    ((dom = item.querySelector("textarea")),
                    (dom.compType = cType),
                    (dom.value = cfg.allData[pgid][cpid])),
                (ctrls[cpid] = dom);
            });
        });
      })(),
      cfg.timer && clearInterval(cfg.timer),
      (function bindEvents() {
        const param = cfg.param;
        function menuHandle(e) {
          const dom = e.target,
            cBase = param.classBase;
          if (dom.classList.contains(`${cBase}menu-item`)) {
            const old = editArea_doms.menu.querySelector(".active");
            old.classList.remove("active"),
              old.settingsPage.classList.remove("curPage"),
              dom.classList.add("active"),
              dom.settingsPage.classList.add("curPage");
          }
        }
        function cancelEdit(e) {
          const cBase = param.classBase;
          if (
            (e.stopPropagation(),
            e.target.className !== `${cBase}wrap` &&
              e.target.className !== `${cBase}cancel-btn`)
          )
            return;
          const callback = cfg.callback;
          !1 !== runCallback(callback.cancelBefore) &&
            (showEditArea(!1),
            setCompValue(cfg.oldData),
            param.isIntervalRun &&
              (setCompValue(cfg.oldData), (cfg.allData = cfg.oldData)),
            runCallback(callback.cancelled));
        }
        function confirmEdit() {
          const callback = cfg.callback,
            data = getAllData();
          (cfg.allData = data),
            !1 !== runCallback(callback.confirmBefore, data) &&
              (showEditArea(!1),
              (cfg.state = "finished"),
              runCallback(callback.finished, data),
              (cfg.state = ""));
        }
        function resetEdit() {
          const callback = cfg.callback,
            data = getAllData();
          !1 !== runCallback(callback.resetBefore, data) &&
            (!(function resetEditData(isOnlyPage = !1) {
              const param = cfg.param;
              if (param.isResetBtn)
                if (isOnlyPage) {
                  const data = getAllData(),
                    curMenu = editArea_doms.menu.querySelector(".active");
                  (data[curMenu.innerText] = cfg.baseData[curMenu.innerText]),
                    setCompValue(data);
                } else setCompValue(cfg.baseData);
            })(param.isOnlyResetCurPage),
            runCallback(callback.reset, data));
        }
        editArea_doms.menu &&
          editArea_doms.menu.addEventListener("click", menuHandle),
          editArea_doms.wrap.addEventListener("click", cancelEdit),
          editArea_doms.cancel.addEventListener("click", cancelEdit),
          editArea_doms.confirm.addEventListener("click", confirmEdit),
          editArea_doms.reset &&
            editArea_doms.reset.addEventListener("click", resetEdit);
      })(),
      (cfg.state = "created"),
      cfg
    );
  }
  function getAllData() {
    function getCompItem(pgid, cpid) {
      if (!controls[pgid]) return;
      const ctrl = controls[pgid][cpid];
      if (ctrl) {
        if (!Array.isArray(ctrl)) return ctrl.value;
        if ("rd" === ctrl.compType) {
          const result = ctrl.find((item) => item.checked).dataset.val;
          return "false" !== result && ("true" === result || result);
        }
        if ("cb" === ctrl.compType) {
          return ctrl
            .filter((item) => item.checked)
            .map((item) => {
              const value = item.dataset.val;
              return "false" !== value && ("true" === value || value);
            });
        }
      }
    }
    const data = {};
    if (0 === arguments.length) {
      for (const key in controls) {
        const page = controls[key];
        data[key] = {};
        for (const key2 in page) data[key][key2] = getCompItem(key, key2);
      }
      return data;
    }
    if (1 === arguments.length) {
      const ctrls = arguments[0];
      for (const pgid in ctrls) {
        data[pgid] = {};
        controls[pgid].forEach((cpid) => {
          data[pgid][cpid] = getCompItem(pgid, cpid);
        });
      }
      return cfg.allData;
    }
    return getCompItem(arguments[0], arguments[1]);
  }
  function setCompValue() {
    function setCompItem(pgid, cpid, value) {
      if (!controls[pgid]) return;
      const ctrl = controls[pgid][cpid];
      if (ctrl)
        if (Array.isArray(ctrl)) {
          if ("rd" === ctrl.compType) {
            const selected = ctrl.find((item) => item.checked);
            selected && (selected.checked = !1);
            const select = ctrl.find((item) => item.dataset.val === value + "");
            select && (select.checked = !0);
          } else if ("cb" === ctrl.compType) {
            if (
              (ctrl
                .filter((item) => item.checked)
                .forEach((item) => {
                  item.checked = !1;
                }),
              Array.isArray(value))
            )
              value.forEach((val) => {
                const select = ctrl.find(
                  (item) => item.dataset.val === val + ""
                );
                select && (select.checked = !0);
              });
            else {
              const select = ctrl.find(
                (item) => item.dataset.val === value + ""
              );
              select && (select.checked = !0);
            }
          }
        } else ctrl.value = value;
    }
    if (1 === arguments.length) {
      const data = arguments[0];
      for (const key in data) {
        const pageData = data[key];
        for (const key2 in pageData) {
          setCompItem(key, key2, pageData[key2]);
        }
      }
    } else {
      setCompItem(arguments[0], arguments[1], arguments[2]);
    }
  }
  function showEditArea(isShow = !0, callback = null) {
    if (
      (cfg.param.isIntervalRun &&
        (cfg.timer && clearInterval(cfg.timer),
        (cfg.timer = setInterval(() => {
          const data = getAllData(),
            oldType = cfg.state;
          (cfg.state = "interval"),
            runCallback(cfg.callback.interval, data),
            (cfg.state = oldType),
            (cfg.lastData = data);
        }, cfg.interval))),
      (cfg.state = "created"),
      isShow)
    ) {
      if (((cfg.oldData = getAllData()), "function" == typeof callback)) {
        if (!1 === callback(cfg.oldData, cfg.oldData, cfg.baseData)) return;
      }
      cfg.state = "show";
    }
    (cfg.isEditing = isShow),
      (editArea_doms.wrap.style.display = isShow ? "block" : "none"),
      isShow &&
        !editArea_doms.box.style.top &&
        (editArea_doms.box.style.top =
          window.innerHeight / 2 - editArea_doms.box.clientHeight / 2 + "px"),
      callback && (cfg.callback = callback);
  }
  function runCallback(callback, data) {
    let result;
    if (callback) {
      data || (data = getAllData());
      const func = callback;
      Array.isArray(func)
        ? func.curFn
          ? ((result = func[curFn](data, cfg.oldData, cfg.baseData)),
            (func.curFn = null))
          : func.forEach((fn) => {
              result = fn(data, cfg.oldData, cfg.baseData);
            })
        : "function" == typeof callback &&
          (result = func(data, cfg.oldData, cfg.baseData));
    }
    return result;
  }
  function toPageObj({ settings, param = {}, otherPageName = "无分类" } = {}) {
    param = { ...param };
    const pageArr = [],
      menuList = [];
    let isOtherType = !1;
    for (let key in settings) {
      const item = settings[key];
      item.type
        ? menuList.includes(item.type) || menuList.push(item.type)
        : isOtherType || (isOtherType = !0);
    }
    return (
      isOtherType && menuList.push(otherPageName),
      menuList.forEach((menuTt) => {
        const components = [],
          page = { id: menuTt, components },
          arr = [];
        for (let key in settings) {
          const item = settings[key];
          menuTt === otherPageName
            ? item.type || arr.push(item)
            : item.type === menuTt && arr.push(item);
        }
        arr.forEach((item) => {
          let desc = item.desc || item.txt || "";
          desc && (desc = desc.replaceAll("\n", "<br>").trim());
          let comp,
            base = item.base;
          if (
            (Array.isArray(base) && (base = base.join(", ")), item.groupTitle1)
          ) {
            const comp = {
              id: item.key + "-gTt1",
              type: "title",
              value: item.groupTitle1,
            };
            components.push(comp);
          }
          if (item.groupTitle2) {
            const comp = {
              id: item.key + "-gTt2",
              type: "title2",
              value: item.groupTitle2,
            };
            components.push(comp);
          }
          if (item.groupTitle3) {
            const comp = {
              id: item.key + "-gTt3",
              type: "title3",
              value: item.groupTitle3,
            };
            components.push(comp);
          }
          if (item.groupDesc) {
            const comp = {
              id: item.key + "-gDesc",
              type: "desc",
              value: item.groupDesc,
            };
            components.push(comp);
          }
          if (
            (["menuTitle", "title", "desc", "title2", "title3"].includes(
              item.compType
            )
              ? ((comp = { ...item }),
                (comp.type = comp.compType),
                (comp.desc = desc))
              : (comp = {
                  id: item.key,
                  type: item.compType,
                  tt: item.tt || "",
                  title: item.title || "",
                  desc,
                  descTt: item.descTt || "",
                  name: item.key,
                  value: item.value,
                  base: item.base,
                }),
            "textarea" === comp.type)
          )
            (comp.ph = base),
              (comp.width = item.compW),
              (comp.height = item.compH),
              (comp.ctrlTt = "默认: " + base);
          else if ("radio" === comp.type || "checkbox" === comp.type) {
            let str = "默认: ";
            if ("checkbox" === comp.type) {
              let arr = item.base;
              Array.isArray(arr) || (arr = arr.split(/,|，/)),
                arr.forEach((val, i) => {
                  0 !== i && (str += ", "), (val = val.trim());
                  let valTxt = item.valueText[val];
                  void 0 === valTxt && (valTxt = val), (str += valTxt);
                });
            } else {
              let val = item.valueText[item.base];
              void 0 === val && (val = item.base), (str += val);
            }
            comp.ctrlTt = str;
          }
          if (item.valueText) {
            comp.radioList = [];
            for (let key in item.valueText) {
              const rd = { text: item.valueText[key], value: key };
              comp.radioList.push(rd);
            }
          }
          components.push(comp);
        }),
          pageArr.push(page);
      }),
      (param.page = pageArr),
      param
    );
  }
  function showSettings() {
    const settings = info.settings;
    (info.settingsArea = (function createEdit({
      settings,
      param = {},
      oldEditCfg,
      updateDataFn,
      isNewEdit = !0,
      isSyncOtherPage = !0,
      otherPageName = "无分类",
    } = {}) {
      let oldSettings, curSettings;
      updateDataFn &&
        isSyncOtherPage &&
        ((oldSettings = JSON.stringify(settings)),
        (settings = updateDataFn() || settings),
        (curSettings = JSON.stringify(settings)));
      const editInfo = { settings, param, otherPageName };
      if (oldEditCfg) {
        if (isNewEdit)
          return (
            oldEditCfg.doms.wrap.remove(), createEditEle(toPageObj(editInfo))
          );
        isSyncOtherPage &&
          updateDataFn &&
          oldSettings !== curSettings &&
          (oldEditCfg.doms.wrap.remove(),
          (oldEditCfg = createEditEle(toPageObj(editInfo)))),
          isSyncOtherPage &&
            !updateDataFn &&
            (oldEditCfg.doms.wrap.remove(),
            (oldEditCfg = createEditEle(toPageObj(editInfo))));
      } else oldEditCfg = createEditEle(toPageObj(editInfo));
      return oldEditCfg;
    })({ settings, oldEditCfg: info.settingsArea, updateDataFn: getData })),
      (function setShowPage(pageId) {
        const old = editArea_doms.menu.querySelector(".active");
        if (!old) return void console.log("不存在菜单栏, 无法切换菜单页");
        let page, menu;
        if (
          (old.classList.remove("active"),
          old.settingsPage.classList.remove("curPage"),
          "number" == typeof pageId)
        ) {
          if (((menu = editArea_doms.menus[pageId]), !menu))
            return void console.log(`不存在第${pageId + 1}项菜单页`);
        } else if (
          ((menu = editArea_doms.menus.find(
            (item) => item.innerHTML === pageId
          )),
          !menu)
        )
          return void console.log(`不存在'${pageId}'的菜单页`);
        (page = menu.settingsPage),
          menu.classList.add("active"),
          page.classList.add("curPage");
      })(0);
    showEditArea(!0, {
      resetBefore: () => confirm("是否重置当前页的所有设置为默认值?"),
      confirmBefore: () => {},
      finished: (data) => {
        console.log(data);
        if (
          (function isValueChange(type = "auto") {
            const param = cfg.param,
              curData = getAllData(),
              curDataStr = JSON.stringify(curData);
            let oldDataStr;
            return (
              "auto" === type &&
                ("interval" === cfg.state &&
                  param.isIntervalRun &&
                  (type = "interval_current"),
                "finished" === cfg.state && (type = "auto")),
              (oldDataStr =
                "interval_current" === type
                  ? JSON.stringify(cfg.lastData)
                  : "base_current" === type
                  ? JSON.stringify(cfg.baseData)
                  : JSON.stringify(cfg.oldData)),
              "{}" !== oldDataStr && curDataStr !== oldDataStr
            );
          })()
        ) {
          for (const pageName in data) {
            const page = data[pageName];
            for (const key in page) {
              const value = page[key],
                flag = key.replace(info.keyBase, ""),
                item = settings[flag];
              let verifyFn;
              switch (key) {
                case settings.position.key:
                  verifyFn = (newVal) => newVal || settings.position.base;
                  break;
                case settings.hiddenBtnTime.key:
                  verifyFn = (newVal, oldVal, base) => (
                    newVal > 500 && (newVal = base || 5),
                    (newVal = +newVal) || 0 === newVal
                      ? newVal
                      : settings.hiddenBtnTime.base
                  );
                  break;
                case settings.closeListTime.key:
                  verifyFn = (newVal, oldVal, base) => (
                    newVal > 500 && (newVal = base || 5),
                    (newVal = +newVal) || 0 === newVal
                      ? newVal
                      : settings.closeListTime.base
                  );
                  break;
                case settings.listSize.key:
                  verifyFn = (newVal) => {
                    const arr = newVal.split(/,|，|x|X/);
                    let f;
                    return 1 === arr.length
                      ? ((f = +arr[0].trim() > 150),
                        f ? newVal : settings.listSize.base)
                      : ((f = +arr[0].trim() >= 150 && +arr[1].trim() >= 100),
                        f ? newVal : settings.listSize.base);
                  };
                  break;
                case settings.liMaxHeight.key:
                  verifyFn = (newVal) =>
                    0 === (newVal = +newVal) || newVal >= 50
                      ? newVal
                      : settings.liMaxHeight.base;
                  break;
                case settings.scale.key:
                  verifyFn = (newVal) =>
                    +newVal ? newVal : settings.scale.base;
                  break;
                case settings.zanListMaxLen.key:
                  verifyFn = (newVal) =>
                    0 === (newVal = +newVal) || newVal >= 10
                      ? newVal
                      : settings.zanListMaxLen.base;
                  break;
                case settings.listMaxLen.key:
                  verifyFn = (newVal) =>
                    0 === (newVal = +newVal) || newVal >= 10
                      ? newVal
                      : settings.listMaxLen.base;
                  break;
                case settings.titleFormat.key:
                  verifyFn = (newVal) => newVal || settings.titleFormat.base;
                  break;
                case settings.sendKeys.key:
                case settings.addItemKeys.key:
                  verifyFn = (newVal) =>
                    newVal.replaceAll(" ", "").toLowerCase();
                  break;
                case settings.autoSave.key:
                  verifyFn = (newVal) =>
                    (newVal = +newVal) && newVal > 0
                      ? newVal
                      : settings.autoSave.base;
              }
              if (!item)
                return void console.log("设置的数据对应的对象获取失败");
              setValue({
                value,
                base: item.base,
                key,
                verification: verifyFn,
                getValue: GM_getValue,
                setValue: GM_setValue,
              });
            }
          }
          history.go(0);
        }
      },
    });
  }
  function imageLazyLoad({
    box,
    boxRect,
    imgDom,
    imageClass = "image-lazy",
    loadedClass = "image-loaded",
    dis = 50,
  } = {}) {
    if (!imgDom) return;
    if (!imgDom.classList.contains(imageClass)) return;
    boxRect || (boxRect = box.getBoundingClientRect());
    const boxH = boxRect.height;
    if (0 === boxH) return;
    const imgRect = imgDom.getBoundingClientRect(),
      h = imgRect.height,
      top = imgRect.top - boxRect.top;
    if (top + h > 0 - dis && top < boxH + dis) {
      const dataset = imgDom.dataset;
      return (
        (imgDom.src = dataset.src),
        imgDom.classList.add(loadedClass),
        imgDom.classList.remove(imageClass),
        !0
      );
    }
  }
  const classList = info.history.classList;
  function loadImage(img) {
    img.classList.contains(classList.imageLazyLoad) &&
      ((img.src = img.dataset.src),
      img.classList.remove(classList.imageLazyLoad),
      img.classList.add(classList.imageLoaded));
  }
  function listImgLazyLoad(curList, loadItemNum = 0) {
    if (0 === loadItemNum && !curList.classList.contains("opened")) return;
    const lazyLoadClass = classList.imageLazyLoad;
    if (loadItemNum > 0) {
      const listEle = curList.children[2];
      listEle.children.length < loadItemNum &&
        (loadItemNum = listEle.children.length);
      const len = listEle.children.length;
      for (let i = 0; i < loadItemNum && !(i + 1 > len); i++) {
        const item = listEle.children[i];
        if ("none" === item.style.display) {
          loadItemNum++;
          continue;
        }
        let imgArr = item.querySelectorAll(`img.${lazyLoadClass}`);
        (imgArr = [].slice.call(imgArr)),
          imgArr.forEach((img) => {
            loadImage(img);
          });
      }
    } else {
      let isShowed = !1;
      const imgArr = curList.querySelectorAll(`img.${lazyLoadClass}`),
        len = imgArr.length,
        boxRect = curList.getBoundingClientRect();
      for (let i = 0; i < len; i++) {
        const result = imageLazyLoad({
          box: curList,
          boxRect,
          imgDom: imgArr[i],
          imageClass: lazyLoadClass,
          loadedClass: classList.imageLoaded,
          dis: settings.imageLazyLoad.dis,
        });
        if (((isShowed = isShowed && result), isShowed && !result)) break;
      }
    }
  }
  function getWhStyle(src, wh = [], aspectRatio = 1) {
    aspectRatio = aspectRatio || 1;
    const rangeWh = info.history.imgSize;
    if (((wh[0] && wh[1]) || (wh = []), 0 === wh.length)) {
      wh = [];
      let srcSuffix = src.split("@")[1];
      if (srcSuffix) {
        let isH = !1;
        srcSuffix.includes("h_") &&
          ((isH = !0), (srcSuffix = srcSuffix.split("h_")[0]));
        const result = srcSuffix.split("w_");
        srcSuffix.includes("w_")
          ? isH
            ? ((wh[0] = result[0]), (wh[1] = result[1]))
            : (wh[0] = result[0])
          : isH && (wh[1] = srcSuffix);
      }
      wh[0] && !wh[1] && (wh[1] = Math.floor(wh[0] / aspectRatio)),
        !wh[0] && wh[1] && (wh[0] = Math.floor(wh[1] * aspectRatio));
    }
    let finalwh = (function adjustSize(wh) {
      let w = wh[0],
        h = wh[1],
        isAdjustW = !1,
        isAdjustH = !1;
      return (
        w > rangeWh.w[1]
          ? ((w = rangeWh.w[1]), (isAdjustH = !0))
          : w < rangeWh.w[0] && ((w = rangeWh.w[0]), (isAdjustH = !0)),
        h > rangeWh.h[1]
          ? ((h = rangeWh.h[1]), (isAdjustW = !0))
          : h < rangeWh.h[0] && ((h = rangeWh.h[0]), (isAdjustW = !0)),
        isAdjustH &&
          ((h = Math.floor(w / aspectRatio)),
          h < rangeWh.h[0] && (h = rangeWh.h[0])),
        isAdjustW &&
          ((w = Math.floor(h * aspectRatio)),
          w < rangeWh.w[0] && (w = rangeWh.w[0])),
        [w, h]
      );
    })(wh);
    return `width:${finalwh[0]}px;height:${finalwh[1]}px;`;
  }
  function minImgToBigImg(src) {
    return src.split("@")[0] + "@" + info.history.imgSuffix;
  }
  function formatDate({
    timestamp,
    isYear = !0,
    isExact = !1,
    delimiter = ".",
    midDelimiter = " ",
    delimiter2 = ":",
  } = {}) {
    if (!timestamp) return -1;
    const date = new Date(timestamp),
      year = isYear ? date.getFullYear() : "",
      month = (date.getMonth() + 1).toString().padStart(2, "0"),
      day = date.getDate().toString().padStart(2, "0");
    let leftTime;
    leftTime =
      3 === delimiter.length
        ? `${isYear ? year + delimiter[0] : ""}${month}${delimiter[1]}${day}${
            delimiter[2]
          }`
        : `${isYear ? year + delimiter : ""}${month}${delimiter}${day}`;
    let rigthTime = "";
    if (isExact) {
      const hour = date.getHours().toString().padStart(2, "0"),
        minute = date.getMinutes().toString().padStart(2, "0"),
        second = date.getSeconds().toString().padStart(2, "0");
      rigthTime =
        3 === delimiter2.length
          ? `${midDelimiter}${hour}${delimiter2[0]}${minute}${delimiter2[1]}${second}${delimiter2[2]}`
          : `${midDelimiter}${hour}${delimiter2}${minute}${delimiter2}${second}`;
    }
    return leftTime + rigthTime;
  }
  function domToText(ele) {
    const dom = document.createElement("div");
    document.body.appendChild(dom), (dom.innerHTML = ele.innerHTML);
    const arr = [].slice.call(dom.children);
    for (let i = 0; i < arr.length; i++) {
      const node = arr[i];
      if ("img" === (node.nodeName ? node.nodeName.toLowerCase() : "")) {
        const newDom = document.createTextNode(node.alt || "");
        dom.replaceChild(newDom, node);
      }
    }
    const str = dom.innerText;
    return dom.remove(), str;
  }
  let searchBox,
    searchEndTimerId,
    msgBox,
    msgDom,
    msgId,
    searchCallback = {};
  function createSearch({
    id = "history-search-box",
    box = document.body,
    title = "以'标题='开头表示按标题搜索, '内容='表示按内容搜索, '描述='表示按描述搜索, '日期='表示按日期搜索. 若含有==>或===则表示替换, 如: 标题=A==>B, 表示将列表中所有标题中的A替换为B",
    width = 200,
    height = 30,
    color = "#333",
    bg = "#fff",
    fontSize = 13,
    bd = "1px solid #aaa",
    hover_bdColor = "#cee4ff",
    pd = "0 8px",
    radius = 5,
    transition = 0.5,
    btnText = "搜索",
    btn_class = "",
    btn_fontSize = 13,
    btn_color = "#65aaff",
    btn_bg = "#dfedfe",
    btn_bd = "1px solid #dfedfe",
    btn_pd = "0 10px",
    btn_radius = 6,
    btn_hover = "#65aaff",
    btn_hover_bg = "#cee4ff",
    btn_hover_bd = "1px solid #dfedfe",
    zIndex = 901,
    placeholder = "请输入搜索的内容",
    isBtn = !0,
    isAutoSearch = !0,
    interval = 500,
    callback = null,
  } = {}) {
    const ele = document.createElement("div");
    (ele.id = id),
      (ele.isAutoSearch = isAutoSearch),
      (ele.interval = interval),
      (ele.transition = transition),
      (ele.style.cssText = `display: flex;\nopacity: 0;\nposition: absolute;\nleft: -2000px;\ntop: 0;\nz-index: ${zIndex};\ntransition: opacity ${transition}s`);
    const text_css = `width: ${width}px;\nheight: ${height}px;\nline-height: ${height}px;\ncolor: ${color};\nborder: ${bd};\npadding: ${pd};\nborder-radius: ${radius}px;\noutline: ${hover_bdColor};\nbox-sizing: border-box;`;
    ele.innerHTML = `<input class="search-text ll-scroll-style-1" style="${text_css}"></input>${
      isBtn ? "<div class='search-btn'></div>" : ""
    }`;
    const textEle = ele.querySelector(".search-text");
    (ele.title = title),
      (ele.textEle = textEle),
      (textEle.placeholder = placeholder),
      (textEle.style.fontSize = fontSize + "px"),
      (textEle.style.background = bg),
      (textEle.style.fontFamily = "math");
    const btnEle = ele.querySelector(".search-btn");
    return (
      btnEle &&
        ((btnEle.style.cssText = `height: ${height}px;\nline-height: ${height}px;\nfont-size: ${btn_fontSize}px;\ncolor: ${btn_color};\nbackground: ${btn_bg};\nborder: ${btn_bd};\npadding: ${btn_pd};\nborder-radius: ${btn_radius}px;\nbox-sizing: border-box;\nwhite-space: nowrap;\nfont-family: math;\ncursor:pointer;`),
        (btnEle.className += " " + btn_class),
        (btnEle.innerHTML = btnText),
        (btnEle.style.fontSize = btn_fontSize),
        (btnEle.style.color = btn_color),
        (btnEle.style.fontSize = fontSize + "px"),
        (ele.btnEle = btnEle),
        btnEle.addEventListener("mouseenter", () => {
          (btnEle.style.color = btn_hover),
            (btnEle.style.background = btn_hover_bg),
            (btnEle.style.border = btn_hover_bd);
        }),
        btnEle.addEventListener("mouseleave", () => {
          (btnEle.style.color = btn_color),
            (btnEle.style.background = btn_bg),
            (btnEle.style.border = btn_bd);
        })),
      (searchBox = ele),
      box.appendChild(ele),
      callback && (searchCallback = callback),
      (ele.search_info = {}),
      (function bindSearchEvents(ele) {
        const inputEle = ele.textEle,
          searchBtn = ele.btnEle,
          search_info = ele.search_info,
          replacedEvent = new CustomEvent("replaced", {
            detail: { search_info },
          });
        function replaceAllItem() {
          const sType = search_info.searchType;
          if ("日期" === sType) return;
          const list_info = ele.listEle.list_info,
            oldVal = search_info.oldVal,
            newVal = search_info.newVal;
          if (
            confirm(
              `是否将所有列表项的${sType}中的'${oldVal}'替换为'${newVal}'`
            )
          ) {
            const dataList = list_info.dataList;
            dataList.forEach((item, i) => {
              "标题" === sType
                ? (dataList[i].title = item.title.replaceAll(oldVal, newVal))
                : "描述" === sType
                ? (dataList[i].desc = item.desc.replaceAll(oldVal, newVal))
                : "内容" === sType &&
                  (dataList[i].value = item.value.replaceAll(oldVal, newVal));
            }),
              ele.dispatchEvent(replacedEvent);
          }
        }
        let timerId;
        searchBtn.addEventListener("click", () => {
          if (searchCallback.searchBefore) {
            if (!1 === searchCallback.searchBefore(inputEle.value)) return;
          }
          searchEle(),
            search_info.isReplace && replaceAllItem(),
            searchCallback.searchAfter &&
              searchCallback.searchAfter(inputEle.value);
        }),
          inputEle.addEventListener("keydown", (e) => {
            if (
              (13 === e.keyCode || "enter" === e.key.toLowerCase()) &&
              0 != +ele.style.opacity
            ) {
              if (searchCallback.searchBefore) {
                if (!1 === searchCallback.searchBefore(inputEle.value)) return;
              }
              searchEle(),
                search_info.isReplace && replaceAllItem(),
                searchCallback.searchAfter &&
                  searchCallback.searchAfter(inputEle.value);
            }
          }),
          inputEle.addEventListener("input", () => {
            ele.isAutoSearch &&
              (clearTimeout(timerId),
              (timerId = setTimeout(() => {
                if (searchCallback.searchBefore) {
                  if (!1 === searchCallback.searchBefore(inputEle.value))
                    return;
                }
                searchEle(),
                  searchCallback.searchAfter &&
                    searchCallback.searchAfter(inputEle.value);
              }, ele.interval)));
          });
      })(ele),
      ele
    );
  }
  function showSearchBox(isShow = !0, originEle = null, position = "relative") {
    const ele = searchBox;
    if (isShow) {
      let left, top, scrollTop;
      if ((ele.textEle.focus(), clearTimeout(searchEndTimerId), originEle)) {
        const rect = originEle.getBoundingClientRect();
        (left = rect.left),
          (top = rect.top),
          "fixed" === position ||
            ("relative" === position &&
              (scrollTop = document.documentElement.scrollTop));
      }
      const h = parseInt(ele.textEle.style.height);
      left && top
        ? ((ele.style.left = left + "px"),
          (ele.style.top = top + scrollTop - h - 12 + "px"))
        : ((ele.style.left = ""),
          (ele.style.right = "12px"),
          (ele.style.top = "12px")),
        (ele.style.opacity = 1);
    } else
      (ele.style.opacity = 0),
        clearTimeout(searchEndTimerId),
        (searchEndTimerId = setTimeout(() => {
          ele.style.left = "-2000px";
        }, 1e3 * ele.transition)),
        hiddenEle(ele.listEle, "");
  }
  function hiddenEle(listEle, text, searchType = "标题") {
    if (!listEle) return;
    "时间" === searchType && (searchType = "日期");
    const info = searchBox.search_info;
    info.searchType = searchType;
    const replaceArr = text.split(/==>|===/);
    replaceArr.length > 1
      ? ((info.oldVal = replaceArr[0]),
        (info.newVal = replaceArr[1]),
        (info.isReplace = !0),
        (text = info.oldVal) &&
          console.log(`搜索: 将'${info.oldVal}'替换为'${info.newVal}'`))
      : text &&
        ((info.isReplace = !1), console.log("搜索" + searchType + ": " + text));
    const liArr = listEle.querySelectorAll(".item-box"),
      len = liArr.length;
    for (let i = 0; i < len; i++) {
      const item = liArr[i];
      if (text) {
        const ttDom = item.querySelector(".item-tt"),
          textDom = item.querySelector(".hItem");
        ("标题" === searchType && domToText(ttDom).includes(text)) ||
        ("描述" === searchType && ttDom.title.includes(text)) ||
        ("内容" === searchType && domToText(textDom).includes(text)) ||
        ("日期" === searchType &&
          item.querySelector(".item-control").title.includes(text))
          ? (item.style.display = "block")
          : (item.style.display = "none");
      } else item.style.display = "block";
    }
  }
  function searchEle() {
    const textEle = searchBox.textEle,
      listEle = searchBox.listEle;
    if (!listEle) return;
    let text = textEle.value,
      searchType = text.slice(0, 3);
    ["标题=", "描述=", "内容=", "日期=", "时间="].includes(searchType)
      ? ((searchType = searchType.slice(0, 2)),
        (text = text.slice(3, text.length)))
      : (searchType = textEle.searchType ? textEle.searchType : "标题"),
      hiddenEle(listEle, text, searchType);
  }
  let msgZIndex,
    msgTimerId,
    msgEndTimerId,
    useOne = !0;
  function message({
    ele,
    title = "",
    content = "",
    msg = "",
    isTitle = !0,
    maxWidth,
    color,
    fontSize,
    tt_color,
    tt_fontSize,
    bg,
    bd,
    pd,
    radius,
    time = "auto",
    disTime = 0,
    postion = "right-top",
    isOnce = useOne,
    fn,
  } = {}) {
    isOnce && (msgDom = null),
      ele ||
        (ele = msgDom) ||
        (msgId &&
          !isOnce &&
          (ele = msgDom = document.querySelector("#" + msgId)),
        ele ||
          (ele = msgDom =
            (function createMsg({
              id = "ll-autoCloseMsg",
              box = document.body,
              type = "right",
              isUseOne = !0,
              maxWidth = 224,
              color = "#666",
              fontSize = 14,
              tt_color = "#333",
              tt_fontSize = 16,
              bg = "#fff",
              bd = "2px solid #dfedfe",
              pd = "7px 12px",
              radius = 7,
              zIndex = 1100,
              transition = 0.8,
              isTitle = !0,
            } = {}) {
              const ele = document.createElement("div");
              (ele.title = "点击关闭该弹窗"),
                (ele.id = id),
                (ele.className = id),
                (msgId = id),
                (ele.style.cssText = `max-width:${maxWidth}px;\nline-height:1.5;\nbackground:${bg};\nmargin-bottom:10px;\nborder:${bd};\npadding:${pd};\nbox-sizing:border-box;\nborder-radius:${radius}px;\nword-break:break-all;\ncursor:pointer;\nopacity:0;\ntransition:opacity ${transition}s;\nletter-spacing:1px;`),
                (ele.innerHTML =
                  '<div class="title" style="margin-bottom:5px;font-weight:bold;"></div><div class="msg"></div>'),
                (ele.transition = transition);
              const ttEle = ele.querySelector(".title");
              isTitle
                ? ((ele.ttEle = ttEle),
                  (ttEle.style.color = tt_color),
                  (ttEle.style.fontSize = tt_fontSize + "px"))
                : (ttEle.style.display = "none");
              const msgEle = ele.querySelector(".msg");
              return (
                (ele.msgEle = msgEle),
                (msgEle.style.color = color),
                (msgEle.style.fontSize = fontSize + "px"),
                (useOne = isUseOne),
                (ele.isUseOne = isUseOne),
                (msgDom = ele),
                msgBox ||
                  ((msgBox = document.createElement("div")),
                  (msgBox.id = id + "-box"),
                  (msgBox.style.cssText = `\ndisplay:flex;\nflex-direction:column;\nalign-items:${
                    "right" === type ? "flex-end" : "flex-start"
                  };\nposition:fixed;\nleft:-2000px;\ntop:0;\nz-index:${
                    isUseOne ? msgZIndex : zIndex
                  };`),
                  box.appendChild(msgBox)),
                msgBox.appendChild(ele),
                ele.addEventListener("click", () => {
                  ele.remove();
                }),
                ele
              );
            })({ type: postion.split(/-|_/)[0] }))),
      (msg = content || msg);
    const msgEle = ele.msgEle;
    (msgEle.innerText = msg),
      maxWidth && (ele.style.maxWidth = maxWidth + "px"),
      bd && (ele.style.border = bd),
      pd && (ele.style.padding = pd),
      bg && (ele.style.background = bg),
      radius && (ele.style.borderRadius = radius + "px"),
      color && (msgEle.style.color = color),
      fontSize && (msgEle.style.fontSize = fontSize + "px"),
      isTitle || (ele.ttEle.style.display = "none"),
      (msgBox.style.left = "");
    const placeArr = postion.split(/-|_/);
    if (
      ((msgBox.style[placeArr[0]] = placeArr[0] ? "12px" : ""),
      (msgBox.style[placeArr[1]] = placeArr[1] ? "12px" : ""),
      title)
    ) {
      const ttEle = ele.ttEle;
      (ttEle.innerHTML = title),
        tt_color && (ttEle.style.color = tt_color),
        tt_fontSize && (ttEle.style.fontSize = tt_fontSize + "px");
    }
    "auto" === time
      ? (time = (function getShowTime(text) {
          return 410 * text.length + 1500;
        })(msg))
      : (time *= 1e3),
      (time += disTime),
      useOne || (clearTimeout(msgTimerId), clearTimeout(msgEndTimerId)),
      (ele.style.opacity = 1);
    let isClosed = !1;
    function close(callback) {
      (isClosed = !0),
        (callback = callback || fn),
        (ele.style.opacity = 0),
        (msgEndTimerId = setTimeout(() => {
          (msgBox.style.left = -ele.maxWidth - 100 + "px"),
            callback && callback(),
            useOne && ele.remove();
        }, 1e3 * ele.transition));
    }
    return (
      (msgTimerId = setTimeout(() => {
        !isClosed && close();
      }, time)),
      {
        ele,
        close: (fn) => {
          close(fn);
        },
      }
    );
  }
  function saveJson({
    data = "",
    fileName = "outData",
    type = "json",
    isFormat = !1,
    space = 2,
    isDoubleOut = !0,
    addText = "-格式化",
  } = {}) {
    "string" != typeof data &&
      "json" === type &&
      (isFormat
        ? (isDoubleOut &&
            saveJson({
              data,
              fileName,
              type,
              isFormat: !1,
              space,
              isDoubleOut: !1,
            }),
          (fileName += addText),
          (data = JSON.stringify(data, null, space)))
        : (data = JSON.stringify(data)));
    const blob = new Blob(
        [data],
        "json" === type ? { type: "application/json" } : { type: "text/plain" }
      ),
      href = URL.createObjectURL(blob),
      alink = document.createElement("a");
    (alink.style.display = "none"),
      (fileName += "." + type),
      (alink.download = fileName),
      (alink.href = href),
      document.body.appendChild(alink),
      alink.click(),
      document.body.removeChild(alink),
      URL.revokeObjectURL(href);
  }
  const downloadImage = (imgsrc, name, type = "png") => {
      "jpg" === type && (type = "jpeg");
      let image = new Image();
      image.setAttribute("crossOrigin", "anonymous"),
        (image.onload = function () {
          let canvas = document.createElement("canvas");
          (canvas.width = image.width), (canvas.height = image.height);
          let context = canvas.getContext("2d");
          context?.drawImage(image, 0, 0, image.width, image.height);
          let url = canvas.toDataURL(`image/${type}`),
            a = document.createElement("a"),
            event = new MouseEvent("click");
          (a.download = name || "pic"), (a.href = url), a.dispatchEvent(event);
        }),
        (image.src = imgsrc);
    },
    editHTML =
      '<div class="edit-box">\n  <div class="edit-item name-box">\n    <div class="name title">标 题</div>\n    <textarea class="edit-name" placeholder="" title="拖动右下角可调节宽高"></textarea>\n  </div>\n  <div class="edit-item desc-box">\n    <div class="desc title">描 述</div>\n    <textarea class="edit-desc" placeholder="" title="拖动右下角可调节宽高"></textarea>\n  </div>\n  <div class="content content-box">\n    <div class="desc title">内 容</div>\n    <textarea class="edit-content" placeholder="" title="拖动右下角可调节宽高"></textarea>\n  </div>\n  <div class="edit-item btn-box">\n    <button class="cancel-btn">取 消</button>\n    <button class="confirm-btn">确 认</button>\n  </div>\n</div>',
    edit = {
      isEditing: !1,
      editText: {},
      eleList: {},
      callback: { confirmBefore: null, finished: null },
    },
    eleList = edit.eleList;
  function editArea_createEditEle({
    id,
    box,
    placeholder = {
      title: "请输入标题",
      desc: "请输入描述",
      value: "请输入内容",
    },
    zIndex = 2e3,
    clickWrapClose = !0,
  } = {}) {
    return (
      addCss(
        `.ll-edit-wrap {\n  position: fixed;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  z-index: ${zIndex};\n  background: rgba(0, 0, 0, 0.12);\n}\n.ll-edit-wrap .edit-box {\n  position: relative;\n  width: 480px;\n  top: calc(50% - 250px);\n  margin: auto;\n  color: #333;\n  background: #fff;\n  font-size: 16px;\n  font-family: math;\n  border: 3px solid #dfedfe;\n  border-radius: 10px;\n  box-sizing: border-box;\n  padding: 20px;\n}\n.ll-edit-wrap .edit-box > div {\n  margin-bottom: 15px;\n}\n.ll-edit-wrap .edit-box .edit-item {\n  display: flex;\n}\n.ll-edit-wrap .edit-box textarea {\n  width: 100%;\n  line-height: 18px;\n  border-radius: 6px;\n  padding: 5px 7px;\n  outline-color: #cee4ff;\n  border: 1px solid #aaa;\n  box-sizing: border-box;\n  font-size: 13px;\n  font-family: math;\n  /* 保留空格 */\n  white-space: pre-wrap;\n  /* 允许词内换行 */\n  word-break: break-all;\n  letter-spacing: 1px;\n}\n.ll-edit-wrap .edit-box textarea::placeholder {\n  color: #bbb;\n}\n.ll-edit-wrap .edit-box .title {\n  width: 15%;\n  font-weight: bold;\n  font-size: 18px;\n}\n.ll-edit-wrap .edit-box .content-box .title {\n  width: 100%;\n  margin-bottom: 8px;\n}\n.ll-edit-wrap .edit-box .name-box textarea {\n  height: 30px;\n}\n.ll-edit-wrap .edit-box .desc-box textarea {\n  height: 100px;\n}\n.ll-edit-wrap .edit-box .content-box textarea {\n  width: 100%;\n  height: 200px;\n}\n.ll-edit-wrap .edit-box .btn-box {\n  justify-content: flex-end;\n  margin-bottom: 0;\n}\n.ll-edit-wrap .edit-box .btn-box button {\n  font-size: 16px;\n  color: #65aaff;\n  background: #dfedfe;\n  outline: none;\n  border: none;\n  border-radius: 6px;\n  padding: 8px 16px;\n  box-sizing: border-box;\n  cursor: pointer;\n}\n.ll-edit-wrap .edit-box .btn-box .cancel-btn {\n  color: #888;\n  background: #f4f4f4;\n  margin-right: 20px;\n}\n.ll-edit-wrap .edit-box .btn-box .cancel-btn:hover {\n  color: #666;\n  background: #eee;\n}\n.ll-edit-wrap .edit-box .btn-box .confirm-btn:hover {\n  background: #cee4ff;\n}`
      ),
      (eleList.wrap = createEle({ className: "ll-edit-wrap", box })),
      (eleList.wrap.id = id || ""),
      (eleList.wrap.innerHTML = editHTML),
      (eleList.wrap.style.display = "none"),
      (eleList.wrap.clickWrapClose = clickWrapClose),
      (eleList.box = eleList.wrap.children[0]),
      (eleList.box.className = eleList.box.className + " ll-scroll-style-1"),
      (eleList.title = eleList.box.querySelector(".edit-name")),
      (eleList.desc = eleList.box.querySelector(".edit-desc")),
      (eleList.value = eleList.box.querySelector(".edit-content")),
      (eleList.cancel = eleList.box.querySelector(".cancel-btn")),
      (eleList.confirm = eleList.box.querySelector(".confirm-btn")),
      (eleList.title.placeholder = placeholder.title),
      (eleList.desc.placeholder = placeholder.desc),
      (eleList.value.placeholder = placeholder.value),
      (function editArea_bindEvents() {
        function cancelEdit(e) {
          const dom = e.target,
            className = dom.className;
          if ("ll-edit-wrap" === className || "cancel-btn" === className) {
            if ("ll-edit-wrap" === className && !dom.clickWrapClose) return;
            editArea_showEditArea(!1), clearEditData();
          }
        }
        function confirmEdit() {
          const data = (function getEditData() {
            return {
              title: eleList.title.value,
              desc: eleList.desc.value,
              value: eleList.value.value,
            };
          })();
          if (edit.callback.confirmBefore) {
            let result;
            const func = edit.callback.confirmBefore;
            if (
              (Array.isArray(func)
                ? func.curFn
                  ? ((result = func[curFn](data)), (func.curFn = null))
                  : func.forEach((fn) => {
                      result = fn(data);
                    })
                : (result = func(data)),
              !1 === result)
            )
              return;
          }
          if (eleList.value.value) {
            if (
              (editArea_showEditArea(!1),
              clearEditData(),
              edit.callback.finished)
            ) {
              const func = edit.callback.finished;
              Array.isArray(func)
                ? func.curFn
                  ? (func[curFn](data), (func.curFn = null))
                  : func.forEach((fn) => {
                      fn(data);
                    })
                : func(data);
            }
          } else alert(edit.msg.noneText || "请填写内容！！");
        }
        eleList.wrap.addEventListener("click", cancelEdit),
          eleList.cancel.addEventListener("click", cancelEdit),
          eleList.confirm.addEventListener("click", confirmEdit);
      })(),
      edit
    );
  }
  function editArea_showEditArea(isShow = !0) {
    (edit.isEditing = isShow),
      (eleList.wrap.style.display = isShow ? "block" : "none");
  }
  function clearEditData() {
    (eleList.title.value = ""),
      (eleList.desc.value = ""),
      (eleList.value.value = "");
  }
  function changeShow(controlObj, isShow = "") {
    for (let key in controlObj) {
      const curStyle = controlObj[key].style;
      curStyle.display =
        "" === isShow
          ? "none" === curStyle.display
            ? "block"
            : "none"
          : isShow
          ? "block"
          : "none";
    }
  }
  function showItemControlEvent(control, info) {
    const listEle = info.listEle,
      list_info = listEle.list_info,
      moveBox = control.eleList.move_control;
    changeShow(control.move_eleList, !1),
      listEle.addEventListener("click", (e) => {
        const item = e.target;
        if (item.classList.contains("hItem")) {
          const oldId = listEle.curClickEle && +listEle.curClickEle.id;
          if (
            (+item.id === oldId
              ? changeShow(control.move_eleList)
              : changeShow(control.move_eleList, !0),
            (moveBox.style.top =
              item.offsetTop - control.cfg.move_height - 3 + "px"),
            (listEle.oldClickEle = listEle.curClickEle),
            (listEle.curClickEle = item),
            (listEle.curId = item.id),
            control.info.move &&
              control.info.move.isMoving &&
              item !== listEle.oldClickEle)
          ) {
            const move = control.info.move;
            (!move.warnText || confirm(move.warnText)) &&
              (!(function moveItem({ info, ele, toEle, id, toId } = {}) {
                const listEle = info.listEle;
                !ele && id
                  ? (ele = listEle.querySelector(`[id='${id}']`))
                  : ele || id || (ele = listEle.oldClickEle);
                !toEle && toId
                  ? (toEle = listEle.querySelector(`[id='${id}']`))
                  : toEle || toId || (toEle = listEle.curClickEle);
                !id && (id = +ele.id), !toId && (toId = +toEle.id);
                const list_info = listEle.list_info,
                  newDataList = updateDataList(info),
                  flag = updateReplaceObj(info),
                  dataList = info.dataList,
                  index = dataList.map((item) => +item.id).indexOf(id);
                if (-1 === index)
                  return (
                    console.log("操作失败, 当前项的数据可能在其他页面中已删除"),
                    void message({
                      title: "移动",
                      msg: info.listEle.list_info.errorSyncText,
                    })
                  );
                const data = dataList.splice(index, 1)[0];
                let toIndex = dataList.map((item) => +item.id).indexOf(toId);
                list_info.isAddUp && (toIndex += 1),
                  dataList.splice(toIndex, 0, data),
                  updateDateFlag(info),
                  flag || newDataList
                    ? initHisListDom(info)
                    : (listEle.insertBefore(
                        ele.parentElement,
                        toEle.parentElement
                      ),
                      resetNum(listEle));
                (ele = toEle = null),
                  list_info.setValue
                    ? list_info.setValue(
                        list_info.saveName,
                        JSON.stringify(dataList)
                      )
                    : localStorage.setItem(
                        list_info.saveName,
                        JSON.stringify(dataList)
                      );
              })({ info }),
              list_info.curMoveMsgObj && list_info.curMoveMsgObj.close(),
              (list_info.curMoveMsgObj = null),
              message({ title: move.text, msg: move.endText }),
              changeShow(control.move_eleList, !1)),
              (move.isMoving = !1);
          }
          if (
            control.info.changePlace &&
            control.info.changePlace.isChangePlaceing &&
            item !== listEle.oldClickEle
          ) {
            const changeP = control.info.changePlace;
            (!changeP.warnText || confirm(changeP.warnText)) &&
              (!(function changePlace({ info, ele, toEle, id, toId } = {}) {
                const listEle = info.listEle;
                !ele && id
                  ? (ele = listEle.querySelector(`[id='${id}']`))
                  : ele || (ele = listEle.oldClickEle);
                !toEle && toId
                  ? (toEle = listEle.querySelector(`[id='${id}']`))
                  : toEle || (toEle = listEle.curClickEle);
                if (
                  (!id && (id = +ele.id),
                  !toId && (toId = +toEle.id),
                  ele && toEle)
                ) {
                  const eleData = getItemData({ info, ele }),
                    toEleData = getItemData({ info, ele: toEle });
                  if (!eleData || !toEleData)
                    return void console.log("数据获取失败");
                  toEleData.id = 1234;
                  const changeInfo = updateItem({
                    info,
                    ele,
                    data: toEleData,
                    isSave: !1,
                  });
                  updateItem({ info, ele: toEle, data: eleData, isSave: !1 }),
                    (info.dataList[changeInfo.index].id = toId),
                    (changeInfo.ele.id = toId),
                    resetNum(listEle);
                  const list_info = listEle.list_info;
                  list_info.setValue
                    ? list_info.setValue(
                        list_info.saveName,
                        JSON.stringify(info.dataList)
                      )
                    : localStorage.setItem(
                        list_info.saveName,
                        JSON.stringify(info.dataList)
                      );
                }
              })({ info }),
              list_info.curChangePlaceMsgObj &&
                list_info.curChangePlaceMsgObj.close(),
              (list_info.curChangePlaceMsgObj = null),
              message({ title: move.text, msg: move.endText }),
              changeShow(control.move_eleList, !1)),
              (changeP.isChangePlaceing = !1);
          }
        }
        e.stopPropagation();
      });
  }
  function controlEvents(control, info, searchEle, editInfo) {
    if (!control) return;
    const listEle = info.listEle,
      list_info = listEle.list_info,
      control_info = control.info;
    if (
      ((list_info.dataList = info.dataList),
      showItemControlEvent(control, info),
      control_info.add &&
        control_info.add.ele.addEventListener("click", (e) => {
          editArea_showEditArea(),
            (editInfo.msg = { noneText: control_info.add.noneText }),
            (editInfo.callback.finished = (data) => {
              addItem({
                title: data.title,
                desc: data.desc,
                value: data.value,
                info,
              }),
                message({
                  title: control_info.add.text,
                  msg: control_info.add.endText,
                });
            }),
            e.stopPropagation();
        }),
      control_info.clear &&
        control_info.clear.ele.addEventListener("click", (e) => {
          if (confirm(control_info.clear.warnText)) {
            confirm(control_info.clear.twoWarnText) &&
              (!(function clearList(info) {
                (info.listEle.innerHTML = ""),
                  (info.dataList = []),
                  bottomText(info),
                  updateDateFlag(info);
                const list_info = info.listEle.list_info;
                list_info.setValue
                  ? list_info.setValue(list_info.saveName, "[]")
                  : localStorage.removeItem(list_info.saveName);
              })(info),
              changeShow(control.move_eleList, !1));
          }
          e.stopPropagation();
        }),
      control_info.search)
    ) {
      const search = control_info.search;
      (search.eleList = {}),
        search.ele.addEventListener("click", (e) => {
          let isShow = 0 == +searchEle.style.opacity;
          if ((listEle !== searchEle.listEle && (isShow = !0), isShow)) {
            const newDataList = updateDataList(info),
              flag = updateReplaceObj(info);
            (newDataList || flag) && initHisListDom(info),
              message({ title: search.text, msg: search.title, maxWidth: 280 });
          }
          (searchEle.textEle.value = ""),
            (searchEle.listEle = listEle),
            (searchEle.textEle.searchType = search.searchType),
            showSearchBox(isShow, search.ele, search.position),
            e.stopPropagation();
        });
      const inputEle = searchEle.textEle;
      searchEle.btnEle.addEventListener("click", () => {
        changeShow(control.move_eleList, !1);
      }),
        inputEle.addEventListener("keydown", (e) => {
          13 === e.keyCode &&
            0 != +searchEle.style.opacity &&
            changeShow(control.move_eleList, !1);
        }),
        inputEle.addEventListener("input", () => {
          searchEle.isAutoSearch && changeShow(control.move_eleList, !1);
        }),
        searchEle.addEventListener("replaced", (e) => {
          if (listEle !== searchEle.listEle) return;
          list_info.setValue(list_info.saveName, list_info.dataList),
            updateDateFlag(info),
            initHisListDom(info);
          const search_info = e.detail.search_info,
            sType = search_info.searchType,
            oldVal = search_info.oldVal,
            newVal = search_info.newVal;
          message({
            title: "替换",
            msg: search.replacedText
              .replace("searchType", sType)
              .replace("oldVal", oldVal)
              .replace("newVal", newVal),
          });
        });
    }
    if (control_info.import) {
      const uploadFile = control_info.import;
      uploadFile.ele.addEventListener("click", (e) => {
        if (uploadFile.isUploading)
          return (
            message({ title: uploadFile.text, msg: uploadFile.uploadingText }),
            void console.log(uploadFile.uploadingText)
          );
        const isCover = confirm(uploadFile.warnText);
        message({ title: uploadFile.text, msg: uploadFile.startTipText }),
          (function fileUpload_fileUpload({
            uploadObj = {},
            startTt = "上传",
            startText = "开始上传",
            endTt = "上传",
            endText = "上传完成",
            errorTt = "文件上传",
            errorMsg = "上传失败",
            startFn,
            finishFn,
            errorFn,
            timeoutFn,
          } = {}) {
            let input = document.createElement("input");
            (input.type = "file"),
              input.click(),
              input.addEventListener("change", (e) => {
                startText && message({ title: startTt, msg: startText });
                const fileObj = e.target.files[0],
                  reader = new FileReader();
                reader.readAsText(fileObj);
                const data = { info: fileObj, data: {} };
                (startFn && null === startFn(data)) ||
                  (uploadObj.timer && clearTimeout(uploadObj.timer),
                  (uploadObj.timer = setTimeout(() => {
                    void 0 !== uploadObj.isUploading &&
                      uploadObj.isUploading &&
                      (timeoutFn && timeoutFn(),
                      message({
                        title: errorTt,
                        msg: "'" + fileObj.name + "'" + errorMsg,
                      }),
                      console.log("文件上传超时"));
                  }, 12e4)),
                  (reader.onload = function (readRes) {
                    try {
                      data.data = readRes.target.result;
                      const msg = "'" + fileObj.name + "'" + endText;
                      endText && message({ title: endTt, msg }),
                        console.log("上传成功: ", data.data),
                        finishFn && finishFn(data);
                    } catch (e) {
                      errorFn && errorFn(data),
                        message({
                          title: errorTt,
                          msg: "'" + fileObj.name + "'" + errorMsg,
                        });
                    } finally {
                      clearTimeout(uploadObj.timer);
                    }
                  }),
                  (reader.onerror = (e) => {
                    (data.data = e),
                      errorFn && errorFn(data),
                      message({
                        title: errorTt,
                        msg: "'" + fileObj.name + "'" + errorMsg,
                      }),
                      console.log(e),
                      clearTimeout(uploadObj.timer);
                  }));
              }),
              input.remove();
          })({
            uploadObj: uploadFile,
            startTt: uploadFile.text,
            startText: "开始上传",
            endTt: uploadFile.text,
            endText: "上传完成",
            errorTt: uploadFile.text,
            errorMsg: "数据导入失败",
            startFn: () => {
              uploadFile.isUploading = !0;
            },
            finishFn: (data) => {
              let sbText;
              (uploadFile.isUploading = !1),
                (sbText = isCover
                  ? uploadFile.coverSubmitText
                  : uploadFile.submitText);
              if (!confirm(sbText)) return;
              let dataObj, newDataList;
              try {
                dataObj = JSON.parse(data.data || null) || {};
              } catch (e) {
                console.log(e);
                try {
                  dataObj =
                    (function jsonCharsHandle(str) {
                      let obj = {};
                      return (
                        str &&
                          "[object String]" ===
                            Object.prototype.toString.call(str) &&
                          "null" !== str &&
                          ((str = (str = (str = str.replace(
                            /\r/g,
                            " "
                          )).replace(/\n/g, " ")).replace(/\t/g, " ")),
                          (obj = JSON.parse(str))),
                        obj
                      );
                    })(data.data || null) || {};
                } catch (e) {
                  return void console.log("导入失败:", e);
                }
              }
              if (Array.isArray(dataObj)) newDataList = dataObj;
              else {
                newDataList = dataObj.dataList;
                const replaceObj = dataObj.replaceObj;
                if (list_info.isCoverRepObj) list_info.replaceObj = replaceObj;
                else
                  for (const key in replaceObj)
                    list_info.replaceObj[key] = replaceObj[key];
              }
              isCover
                ? Array.isArray(dataObj)
                  ? (info.dataList = dataObj)
                  : (info.dataList = dataObj.dataList)
                : list_info.isDesc
                ? (info.dataList = [...newDataList, ...info.dataList])
                : (info.dataList = [...info.dataList, ...newDataList]),
                list_info.setValue(
                  list_info.saveName,
                  JSON.stringify(info.dataList)
                ),
                updateDateFlag(info),
                initHisListDom(info),
                message({ title: uploadFile.text, msg: uploadFile.endText }),
                console.log(uploadFile.endText);
            },
            errorFn: () => {
              uploadFile.isUploading = !1;
            },
            timeoutFn: () => {
              uploadFile.isUploading = !1;
            },
          }),
          e.stopPropagation();
      });
    }
    if (control_info.out) {
      const outFile = control_info.out;
      outFile.ele.addEventListener("click", (e) => {
        let outName = list_info.outName || list_info.saveName || "dataList";
        outFile.isTime &&
          (outName =
            formatDate({
              timestamp: new Date().getTime(),
              isExact: !0,
              midDelimiter: "-",
              delimiter2: ".",
            }) +
            " " +
            outName);
        const newDataList = updateDataList(info),
          flag = updateReplaceObj(info);
        (newDataList || flag) && initHisListDom(info),
          info.dataList.forEach((item) => {
            item.desc = item.desc
              .replaceAll("&apos;", "'")
              .replaceAll("&quot;", '"');
          });
        const dataObj = { dataList: info.dataList };
        list_info.replaceObj && (dataObj.replaceObj = list_info.replaceObj),
          saveJson({
            data: dataObj,
            fileName: outName,
            isFormat: outFile.isFormat,
            isDoubleOut: outFile.isDoubleOut,
          }),
          message({ title: outFile.text, msg: outFile.startText }),
          e.stopPropagation();
      });
    }
    if ((control_info.skip, control_info.fold)) {
      function setLineH(
        isFold = null,
        listEle = info.listEle,
        fold = control.info.fold
      ) {
        fold.ele.innerText = fold.isFold ? fold.noFoldText : fold.text;
        const textArr = listEle.querySelectorAll(".hItem"),
          len = textArr.length;
        let newH = fold.isFold ? fold.maxHeight : fold.oldMaxH;
        null !== isFold &&
          ((newH = isFold ? fold.maxHeight : fold.oldMaxH),
          (fold.isFold = isFold)),
          (listEle.list_info.liMaxHeight = newH),
          (newH += "px"),
          (listEle.display = "none");
        for (let i = 0; i < len; i++) {
          const item = textArr[i];
          item.style.maxHeight = "0px" === newH ? "initial" : newH;
        }
        listEle.display = "block";
      }
      const fold = control_info.fold;
      let isFold;
      (fold.oldMaxH = list_info.liMaxHeight),
        (isFold = list_info.getValue
          ? list_info.getValue(listEle.list_info.list_id + "_" + fold.name)
          : localStorage.getItem(listEle.list_info.list_id + "_" + fold.name)),
        (fold.isFold = null != isFold && JSON.parse(isFold)),
        setLineH(),
        fold.ele.addEventListener("click", (e) => {
          (fold.isFold = !fold.isFold),
            setLineH(),
            list_info.setValue
              ? list_info.setValue(
                  list_info.list_id + "_" + fold.name,
                  JSON.stringify(fold.isFold)
                )
              : localStorage.setItem(
                  list_info.list_id + "_" + fold.name,
                  JSON.stringify(fold.isFold)
                ),
            bottomText(info),
            changeShow(control.move_eleList, !1),
            e.stopPropagation();
        });
    }
    if (control_info.delete) {
      const del = control_info.delete;
      del.ele.addEventListener("click", (e) => {
        let isDelete = !0;
        del.isConfirm && (isDelete = confirm(del.warnText)),
          isDelete &&
            (!(function delItem({ info, id, ele } = {}) {
              const newDataList = updateDataList(info),
                flag = updateReplaceObj(info),
                listEle = info.listEle,
                dataList = info.dataList;
              if (!id && !ele && !(ele = listEle.curClickEle)) return;
              ele
                ? (id = ele.id)
                : (ele = listEle.querySelector(`[id='${id}']`));
              let delIndex = -1;
              const len = dataList.length;
              for (let i = 0; i < len; i++)
                if (+dataList[i].id == +id) {
                  delIndex = i;
                  const del = dataList.splice(i, 1);
                  console.log("删除一项", del[0]);
                  break;
                }
              updateDateFlag(info),
                flag || newDataList
                  ? initHisListDom(info)
                  : (ele.parentElement.remove(),
                    resetNum(listEle, [], info, "delete", delIndex),
                    bottomText(info));
              const list_info = listEle.list_info;
              list_info.setValue
                ? list_info.setValue(
                    list_info.saveName,
                    JSON.stringify(dataList)
                  )
                : localStorage.setItem(
                    list_info.saveName,
                    JSON.stringify(dataList)
                  );
            })({ info }),
            message({ title: del.text, msg: del.endText }),
            changeShow(control.move_eleList, !1)),
          e.stopPropagation();
      });
    }
    if (control_info.update) {
      const update = control_info.update;
      update.ele.addEventListener("click", (e) => {
        editInfo.msg = { noneText: control_info.add.noneText };
        const itemData = getItemData({ info, ele: info.listEle.curClickEle });
        itemData
          ? ((itemData.desc = itemData.desc
              .replaceAll("&apos;", "'")
              .replaceAll("&quot;", '"')),
            (function inputEditData({
              title = "",
              desc = "",
              value = "",
              data = {},
            } = {}) {
              (eleList.title.value = data.title || title),
                (eleList.desc.value = data.desc || desc),
                (eleList.value.value = data.value || value);
            })(itemData),
            (editInfo.callback.finished = (data) => {
              updateItem({ info, data }),
                message({ title: update.text, msg: update.endText }),
                changeShow(control.move_eleList, !1);
            }),
            editArea_showEditArea(!0),
            e.stopPropagation())
          : console.log("未获取到当前修改项的数据");
      });
    }
    if (control_info.move) {
      const move = control_info.move;
      move.ele.addEventListener("click", (e) => {
        if (!move.isMoving)
          return (
            (move.isMoving = !0),
            void (list_info.curMoveMsgObj = message({
              title: move.text,
              msg: move.tipText + "\n请在提示存在期间完成该操作",
              fn: () => {
                (move.isMoving = !1), (list_info.curMoveMsgObj = null);
              },
            }))
          );
        message({ title: move.text, msg: "已取消" + move.text + "操作" }),
          (move.isMoving = !1),
          e.stopPropagation();
      });
    }
    if (control_info.changePlace) {
      const changeP = control_info.changePlace;
      changeP.ele.addEventListener("click", (e) => {
        if (!changeP.isChangePlaceing)
          return (
            (changeP.isChangePlaceing = !0),
            void (list_info.curChangePlaceMsgObj = message({
              title: changeP.text,
              msg: changeP.tipText + "\n请在提示存在期间完成该操作",
              fn: () => {
                (changeP.isChangePlaceing = !1),
                  (list_info.curChangePlaceMsgObj = null);
              },
            }))
          );
        message({ title: changeP.text, msg: "已取消" + changeP.text + "操作" }),
          (changeP.isChangePlaceing = !1),
          e.stopPropagation();
      });
    }
    if ((control_info.desc, control_info.toSuki)) {
      const toSuki = control_info.toSuki;
      toSuki.ele.addEventListener("click", (e) => {
        !(function itemToSuki({ info, ele, id } = {}) {
          if (!id && !ele && !(ele = info.listEle.curClickEle)) return;
          let data = getItemData({ info, ele, id });
          if (!data)
            return (
              console.log(info.listEle.list_info.control.info.toSuki.errorText),
              void message({
                title: "收藏",
                msg: info.listEle.list_info.control.info.toSuki.errorText,
              })
            );
          if (info.callback && info.callback.toSuki) {
            let newData;
            const func = info.callback.toSuki;
            Array.isArray(func)
              ? func.curFn
                ? ((newData = func[curFn](data)), (func.curFn = null))
                : func.forEach((fn) => {
                    newData = fn(data);
                  })
              : (newData = func(data)),
              (data = newData || data);
          }
          addItem({ info: info.suki_info, data });
        })({ info }),
          message({ title: toSuki.text, msg: toSuki.endText }),
          e.stopPropagation();
      });
    }
    if (
      (control_info.copy &&
        control_info.copy.ele.addEventListener("click", (e) => {
          !(function copyText(text) {
            const ele = document.createElement("textarea");
            document.body.appendChild(ele),
              (ele.value = text),
              ele.select(),
              ele.setSelectionRange(0, ele.value.length),
              document.execCommand("copy"),
              ele.remove();
          })(domToText(listEle.curClickEle)),
            message({
              title: control_info.copy.text,
              msg: control_info.copy.endText,
            }),
            e.stopPropagation();
        }),
      control_info.toBottom &&
        control_info.toBottom.ele.addEventListener("click", (e) => {
          (info.listEle.parentElement.scrollTop =
            info.listEle.parentElement.scrollHeight),
            e.stopPropagation();
        }),
      control_info.saveImg)
    ) {
      const saveImg = control_info.saveImg;
      saveImg.ele.addEventListener("click", (e) => {
        if (!confirm(saveImg.warnText)) return;
        let imgs = listEle.querySelectorAll("img");
        if (!imgs) return;
        imgs = [].slice.call(imgs);
        const outImgs = [];
        if (
          (imgs.forEach((img) => {
            outImgs.find((i) => i.src === img.src) || outImgs.push(img);
          }),
          0 === outImgs.length)
        )
          return;
        let num = 1;
        outImgs.forEach((img) => {
          let url = img.src;
          if (
            (img.dataset && img.dataset.bigimg && (url = img.dataset.bigimg),
            url)
          ) {
            let imgName,
              imgType = "png";
            if ("auto" === saveImg.saveType) {
              const arr = img.src.split(".");
              arr.length > 1 && (imgType = arr[arr.length - 1]);
            } else imgType = saveImg.saveType;
            img.alt
              ? (imgName = img.alt)
              : ((imgName = saveImg.baseName + num), num++),
              downloadImage(url, imgName, imgType);
          }
        }),
          e.stopPropagation();
      });
    }
    if (control_info.custom) {
      const custom = control_info.custom;
      custom.ele.addEventListener("click", (e) => {
        custom.callback && custom.callback(), e.stopPropagation();
      });
    }
    if (control_info.customBtnList) {
      control_info.customBtnList.forEach((custom) => {
        custom.ele.addEventListener("click", (e) => {
          custom.callback && custom.callback(), e.stopPropagation();
        });
      });
    }
  }
  function setBtnColor(listEle, btnEle, isClicked = "") {
    if (!listEle && !btnEle) return;
    let transformText;
    const btn_info = btnEle.btn_info;
    btn_info.isChangeColor &&
      ("" === isClicked &&
        ((transformText = listEle.parentElement.style.transform),
        (isClicked = "scaleY(1)" === transformText),
        (btnEle.isClicked = isClicked)),
      isClicked
        ? isClicked &&
          ((btnEle.style.color = btn_info.click),
          (btnEle.style.background = btn_info.click_bg),
          (btnEle.style.border = btn_info.click_bd),
          btn_info.isSvg &&
            btnEle.children[0] &&
            (btnEle.children[0].style.fill = btn_info.click))
        : btnEle.isHover
        ? ((btnEle.style.color = btn_info.hover),
          (btnEle.style.background = btn_info.hover_bg),
          btn_info.bd && (btnEle.style.border = btn_info.hover_bd),
          btn_info.isSvg &&
            btnEle.children[0] &&
            (btnEle.children[0].style.fill = btn_info.hover))
        : ((btnEle.style.color = btn_info.color),
          (btnEle.style.background = btn_info.bg),
          btn_info.bd && (btnEle.style.border = btn_info.bd),
          btn_info.isSvg &&
            btnEle.children[0] &&
            (btnEle.children[0].style.fill = btn_info.color)));
  }
  function getTitle({ text, isGetTt = !1, maxLen, addText = "..." } = {}) {
    if (!text) return "";
    let title = text,
      isZs = !1,
      isEnd_l = !1;
    if (isGetTt) {
      "\n" === text[0] && (text = text.slice(1, text.length));
      title = text.split(/(?<=[|\n\r])/)[0].trim();
    }
    return (
      "/" === title[0] &&
        "/" === title[1] &&
        "|" === title[title.length - 1] &&
        ((title = title.slice(2, title.length - 1).trim()), (isZs = !0)),
      "\n\r".includes(title[title.length - 1]) &&
        (title = title.slice(0, title.length - 1)),
      (title = title.replaceAll("\n", " ").replaceAll("\r", " ")),
      maxLen &&
        title.length >= maxLen &&
        (title = title.slice(0, maxLen) + addText),
      "|" === title[title.length - 1] &&
        ((title = title.slice(0, title.length - 1).trim()), (isEnd_l = !0)),
      title.length < 8 &&
        !isZs &&
        !isEnd_l &&
        (title = text
          .trim()
          .replaceAll("\n", " ")
          .replaceAll("\r", " ")
          .slice(0, 8)),
      title
    );
  }
  function getNum(isDesc, isAddUp, len, index) {
    return (isDesc && !isAddUp) || (!isDesc && isAddUp)
      ? len - index
      : index + 1;
  }
  function isResetNum({ info, type = "add", index = -1, oldLen = 0 } = {}) {
    if (null === info || "" === type || -1 === index) return !0;
    const list_info = info.listEle.list_info,
      isDesc = list_info.isDesc,
      isAddUp = list_info.isAddUp;
    if ("add" === type) return !(!isAddUp || isDesc) || !(isAddUp || !isDesc);
    if ("delete" === type) {
      const len = oldLen || info.dataList.length + 1;
      return getNum(isDesc, isAddUp, len, index) !== len;
    }
    return !1;
  }
  function resetNum(listEle, liArr = [], info = null, type = "", index = -1) {
    if (!isResetNum({ info, type, index })) return !1;
    const isDesc = listEle.list_info.isDesc;
    if (0 === liArr.length) {
      const numArr = listEle.getElementsByClassName("num"),
        len = numArr.length;
      for (let i = 0; i < len; i++) {
        const num = getNum(isDesc, !1, len, i),
          target = numArr[i];
        target.innerText !== num && (target.innerText = num);
      }
    } else {
      const len = liArr.length;
      for (let i = 0; i < len; i++) {
        const num = getNum(isDesc, !1, len, i),
          target = liArr[i].querySelector(".num");
        target.innerText !== num && (target.innerText = num);
      }
    }
    return !0;
  }
  function bottomText(info) {
    const listEle = info.listEle,
      dataList = info.dataList,
      list_info = listEle.list_info;
    let bt_box = listEle.querySelector(".bottom_text");
    if (bt_box) {
      let text = list_info.bottomText;
      if (!text) return;
      let isAdd = 50 * dataList.length > list_info.maxHeight - 5;
      isAdd ||
        (isAdd =
          listEle.offsetHeight + list_info.control.offsetHeight >=
          list_info.maxHeight - 5),
        isAdd
          ? (bt_box.innerText = text)
          : bt_box &&
            ((text = list_info.initialText),
            0 === dataList.length
              ? (bt_box.innerHTML = text)
              : bt_box.remove());
    } else if (0 === dataList.length) {
      const text = list_info.initialText;
      text &&
        (listEle.innerHTML = `<div class="bottom_text" title="${list_info.bottomTT}">${text}</div>`);
    } else {
      const text = list_info.bottomText;
      if (!text) return;
      let isAdd = 50 * dataList.length > list_info.maxHeight - 5;
      isAdd ||
        (isAdd =
          listEle.offsetHeight + list_info.control.offsetHeight >=
          list_info.maxHeight - 5),
        isAdd &&
          ((bt_box = document.createElement("div")),
          (bt_box.className = "bottom_text"),
          (bt_box.title = list_info.bottomTT),
          (bt_box.innerText = text),
          listEle.appendChild(bt_box));
    }
  }
  function hiddenBtnList(info, name = "") {
    const listEle = info.listEle,
      listBox = listEle.parentElement;
    "btn" === name
      ? (info.btnEle.style.display = "none")
      : "list" === name
      ? ((listBox.style.transform = "scaleY(0)"),
        listBox.classList.remove("opened"))
      : ("显示" !== info.btnEle.btn_info.showMode &&
          (info.btnEle.style.display = "none"),
        (listBox.style.transform = "scaleY(0)"),
        listBox.classList.remove("opened")),
      setBtnColor(listEle, info.btnEle),
      showSearchBox(!1),
      changeShow(listEle.list_info.control.move_eleList, !1);
  }
  function txtReplaceAll(str, obj) {
    if (obj && str) for (const key in obj) str = str.replaceAll(key, obj[key]);
    return str;
  }
  function initHisListDom(info) {
    const listEle = info.listEle;
    let dataList = info.dataList;
    listEle.innerHTML = "";
    let curHtml = "";
    const list_info = listEle.list_info;
    dataList ||
      (console.log("本地读取数据"),
      list_info.getValue
        ? (info.dataList =
            JSON.parse(list_info.getValue(list_info.saveName) || null) || [])
        : (info.dataList =
            JSON.parse(localStorage.getItem(list_info.saveName) || null) ||
            []));
    const maxLen = list_info.maxLen;
    if (list_info.isDelete && dataList.length > maxLen) {
      const delArr = dataList.splice(0, dataList.length - maxLen);
      console.log("列表过长, 删除一组数据", delArr);
    }
    const isDesc = list_info.isDesc,
      isAddUp = list_info.isAddUp;
    let htmlItem;
    const len = dataList.length,
      liMaxH = list_info.liMaxHeight
        ? `max-height:${list_info.liMaxHeight}px`
        : "",
      num_color = list_info.num_color,
      tt_color = list_info.tt_color,
      initItemFn = info.callback.initListItem,
      rpFn = list_info.replaceObjFn;
    dataList.forEach((item, i) => {
      if (initItemFn) {
        const newVal = initItemFn(item);
        newVal && (item = dataList[i] = newVal);
      }
      let curTxt = item.value,
        title = item.title || "";
      !item.id && (item.id = new Date().getTime()),
        (title = txtReplaceAll(title, item.replaceObj)),
        (curTxt = txtReplaceAll(curTxt, item.replaceObj));
      const rpObj = list_info.replaceObj;
      rpFn
        ? ((title = rpFn(title, rpObj)), (curTxt = rpFn(curTxt, rpObj)))
        : ((title = txtReplaceAll(title, rpObj)),
          (curTxt = txtReplaceAll(curTxt, rpObj))),
        (curTxt = curTxt.replaceAll("\n", "<br>"));
      const desc = item.desc
        .replaceAll("'", "&apos;")
        .replaceAll('"', "&quot;");
      (htmlItem = `<div class="item-box"><div class="item-control" title="${formatDate(
        { timestamp: item.id, isExact: !0, delimiter2: "时分秒" }
      )}" style="color:${num_color}"><span class="num">${getNum(
        isDesc,
        isAddUp,
        len,
        i
      )}</span> <span title="${desc}" class="item-tt" style="color:${tt_color}">${title}</span></div><div id="${
        item.id
      }" class="hItem" style="${liMaxH}">${curTxt}</div></div>`),
        isAddUp ? (curHtml = htmlItem + curHtml) : (curHtml += htmlItem);
    }),
      (listEle.innerHTML = curHtml),
      bottomText(info),
      info.updateDate ||
        (info.updateDate = getValue_getValue({
          base: new Date().getTime(),
          key: list_info.list_id + "_updateDate",
          getVal: list_info.getValue,
          setVal: list_info.setValue,
        })),
      info.replaceObjDate ||
        (info.replaceObjDate = getValue_getValue({
          base: new Date().getTime(),
          key: list_info.replaceObjKey + "_date",
          getVal: list_info.getValue,
          setVal: list_info.setValue,
        }));
  }
  function addItem({
    info,
    title = "",
    desc = "",
    value,
    id,
    data,
    isUpdateDom = !0,
    isGetTt = !0,
  } = {}) {
    if (!value && !data) return -1;
    const newDataList = updateDataList(info),
      flag = updateReplaceObj(info);
    (newDataList || flag) && initHisListDom(info);
    const listEle = info.listEle,
      dataList = info.dataList;
    let deleteId,
      curItem,
      isOverLenDel = !1;
    if (
      (data
        ? ((value = data.value),
          (title = data.title || ""),
          (desc = data.desc || ""),
          (data.title = title),
          (data.desc = desc),
          (id = data.id || new Date().getTime()),
          (curItem = { ...data }),
          (curItem.id = id))
        : (curItem = { value, id: id || new Date().getTime(), desc }),
      !curItem.value)
    )
      return -1;
    const initItemFn = info.callback.initListItem;
    if (initItemFn) {
      const newVal = initItemFn(item);
      newVal && (curItem = newVal);
    }
    console.log("添加一项", curItem),
      (curItem.title = getTitle({ text: title || curItem.value, isGetTt }));
    const list_info = listEle.list_info;
    if (list_info.isDelRepeat)
      for (let i = 0; i < dataList.length; i++) {
        const cur = dataList[i];
        if (
          cur.value === value &&
          (!list_info.isDataStrict ||
            (cur.title === curItem.title && cur.desc === desc))
        ) {
          (deleteId = cur.id), dataList.splice(i, 1);
          break;
        }
      }
    if (
      (dataList.push(curItem),
      list_info.isDelete &&
        dataList.length > list_info.maxLen &&
        (console.log("列表过长, 删除一项", dataList[0]),
        dataList.shift(),
        (isOverLenDel = !0)),
      list_info.setValue
        ? list_info.setValue(list_info.saveName, JSON.stringify(dataList))
        : localStorage.setItem(list_info.saveName, JSON.stringify(dataList)),
      updateDateFlag(info),
      isUpdateDom)
    ) {
      let liArr;
      if (
        ((deleteId || isOverLenDel) &&
          (liArr = listEle.getElementsByClassName("item-box")),
        deleteId &&
          listEle.querySelector(`[id='${deleteId}']`).parentElement.remove(),
        isOverLenDel)
      ) {
        list_info.isDesc ? liArr[liArr.length - 1].remove() : liArr[0].remove();
      }
      !(function addLi(info, item, isOverLenDel = !1) {
        if (!item.value) return;
        const listEle = info.listEle,
          dataList = info.dataList,
          list_info = listEle.list_info;
        let curTxt = item.value,
          title = item.title || "";
        !item.id && (item.id = new Date().getTime()),
          (title = txtReplaceAll(title, item.replaceObj)),
          (curTxt = txtReplaceAll(curTxt, item.replaceObj));
        const replaceObjFn = list_info.replaceObjFn;
        replaceObjFn
          ? ((title = replaceObjFn(title, list_info.replaceObj)),
            (curTxt = replaceObjFn(curTxt, list_info.replaceObj)))
          : ((title = txtReplaceAll(title, list_info.replaceObj)),
            (curTxt = txtReplaceAll(curTxt, list_info.replaceObj))),
          (curTxt = curTxt.replaceAll("\n", "<br>"));
        const isDesc = list_info.isDesc,
          isAddUp = list_info.isAddUp,
          liMaxH = list_info.liMaxHeight
            ? `max-height:${list_info.liMaxHeight}px`
            : "",
          hItem = document.createElement("div"),
          desc = item.desc.replaceAll("'", "&apos;").replaceAll('"', "&quot;");
        hItem.className = "item-box";
        let curHtml = `<div class="item-control" title="${formatDate({
          timestamp: item.id,
          isExact: !0,
          delimiter2: "时分秒",
        })}" style="color:${list_info.tt_color};"><span class="num">${getNum(
          isDesc,
          isAddUp,
          dataList.length,
          dataList.length - 1
        )}</span> <span title="${desc}" class="item-tt" style="color:${
          list_info.tt_color
        }">${title}</span></div><div id="${
          item.id
        }" class="hItem" style="${liMaxH}">${curTxt}</div>`;
        hItem.innerHTML = curHtml;
        const opened = listEle.parentElement.classList.contains("opened");
        opened || (listEle.style.display = "none"),
          isAddUp
            ? listEle.insertBefore(hItem, listEle.children[0])
            : listEle.querySelector(".bottom_text")
            ? listEle.insertBefore(
                hItem,
                listEle.children[listEle.children.length - 1]
              )
            : listEle.appendChild(hItem);
        let isReset;
        opened && (isReset = resetNum(listEle, [], info, "add", 0)),
          !isReset &&
            isOverLenDel &&
            isResetNum({
              info,
              type: "delete",
              index: 0,
              oldLen: info.dataList.length,
            }) &&
            (opened ? resetNum(listEle) : (list_info.isResetNum = !0));
        bottomText(info), opened || (listEle.style.display = "block");
      })(info, curItem, isOverLenDel);
    }
    return { deleteId, isOverLenDel };
  }
  function getItemData({ info, id, ele } = {}) {
    const newDataList = updateDataList(info),
      flag = updateReplaceObj(info);
    if (
      ((newDataList || flag) && initHisListDom(info),
      !id && !ele && !(ele = info.listEle.curClickEle))
    )
      return;
    ele && (id = +ele.id);
    const data = info.dataList.find((i) => +i.id == +id);
    return data
      ? { ...data }
      : (console.log("操作失败, 当前项的数据可能在其他页面中已删除"), null);
  }
  function updateItem({
    info,
    id,
    ele,
    newId,
    title = "",
    desc = "",
    value = "",
    replaceObj,
    data = {},
    isSave = !0,
  } = {}) {
    if (!id && !ele && !(ele = info.listEle.curClickEle))
      return void console.log("未获取到需要修改的列表项的dom");
    data && (newId = +data.id),
      ele ? (id = +ele.id) : (ele = info.listEle.querySelector(`[id='${id}']`));
    const newDataList = updateDataList(info),
      flag = updateReplaceObj(info);
    (newDataList || flag) && initHisListDom(info);
    const oldData = getItemData({ info, id });
    if (
      ((replaceObj = (data = {
        id,
        title,
        desc,
        value,
        replaceObj,
        ...oldData,
        ...data,
      }).replaceObj),
      info.callback && info.callback.updateBefore)
    ) {
      let newData;
      const func = info.callback.updateBefore;
      if (
        (Array.isArray(func)
          ? func.curFn
            ? ((newData = func[curFn](data)), (func.curFn = null))
            : func.forEach((fn) => {
                newData = fn(data);
              })
          : (newData = func(data)),
        null === newData)
      )
        return;
      data !== newData && (replaceObj = (data = newData || data).replaceObj);
    }
    const dataList = info.dataList;
    let index;
    const len = dataList.length;
    for (let i = 0; i < len; i++)
      if (+dataList[i].id == +id) {
        (data.id = dataList[i].id),
          (dataList[i] = data),
          newId && (dataList[i].id = +newId),
          (index = i);
        break;
      }
    updateDateFlag(info);
    const list_info = info.listEle.list_info;
    if (!newDataList) {
      const tt = ele.parentElement.querySelector(".item-tt");
      tt.title = data.desc.replaceAll("'", "&apos;").replaceAll('"', "&quot;");
      let curTxt = data.value;
      (data.title = txtReplaceAll(data.title, replaceObj)),
        (curTxt = txtReplaceAll(curTxt, replaceObj));
      const replaceObjFn = list_info.replaceObjFn;
      replaceObjFn
        ? ((data.title = replaceObjFn(data.title, list_info.replaceObj)),
          (curTxt = replaceObjFn(curTxt, list_info.replaceObj)))
        : ((data.title = txtReplaceAll(data.title, list_info.replaceObj)),
          (curTxt = txtReplaceAll(curTxt, list_info.replaceObj))),
        (curTxt = curTxt.replaceAll("\n", "<br>")),
        (tt.innerHTML = getTitle({ text: data.title })),
        (ele.innerHTML = curTxt),
        newId && (ele.id = newId);
    }
    if (
      (isSave &&
        (list_info.setValue
          ? list_info.setValue(list_info.saveName, JSON.stringify(dataList))
          : localStorage.setItem(list_info.saveName, JSON.stringify(dataList))),
      info.callback && info.callback.updateFinished)
    ) {
      const func = info.callback.updateFinished;
      Array.isArray(func)
        ? func.curFn
          ? (func[curFn](data), (func.curFn = null))
          : func.forEach((fn) => {
              fn(data);
            })
        : func(data);
    }
    return { index, ele };
  }
  function updateDateFlag(info) {
    const list_info = info.listEle.list_info;
    if (!list_info.isDataSync) return;
    const time = new Date().getTime();
    (info.updateDate = time),
      setValue({
        value: time,
        base: time,
        key: list_info.list_id + "_updateDate",
        getValue: list_info.getValue,
        setValue: list_info.setValue,
      });
    const replaceObj = getValue_getValue({
      key: list_info.replaceObjKey,
      base: {},
      valType: "object",
      getVal: list_info.getValue,
      setVal: list_info.setValue,
    });
    JSON.stringify(replaceObj) !== JSON.stringify(list_info.replaceObj) &&
      ((info.replaceObjDate = time),
      setValue({
        value: time,
        base: time,
        key: list_info.replaceObjKey + "_date",
        getValue: list_info.getValue,
        setValue: list_info.setValue,
      }),
      setValue({
        value: list_info.replaceObj,
        base: list_info.replaceObj,
        key: list_info.replaceObjKey,
        getValue: list_info.getValue,
        setValue: list_info.setValue,
      }));
  }
  function updateDataList(info) {
    let list_info = info.listEle.list_info;
    if (!list_info.isDataSync) return !1;
    const time = new Date().getTime(),
      myUpdateDate = info.updateDate,
      updateDate = getValue_getValue({
        base: time,
        key: list_info.list_id + "_updateDate",
        getVal: list_info.getValue,
        setVal: list_info.setValue,
      });
    if (+updateDate > +myUpdateDate) {
      (info.updateDate = updateDate),
        changeShow(list_info.control.move_eleList, !1);
      let dataList = getValue_getValue({
        key: list_info.saveName,
        base: "[]",
        valType: "array",
        getVal: list_info.getValue,
        setVal: list_info.setValue,
      });
      return (info.dataList = dataList), dataList;
    }
    return !1;
  }
  function updateReplaceObj(info) {
    let list_info = info.listEle.list_info;
    if (!list_info.isDataSync) return !1;
    const replaceObjDate = getValue_getValue({
      base: new Date().getTime(),
      key: list_info.replaceObjKey + "_date",
      getVal: list_info.getValue,
      setVal: list_info.setValue,
    });
    if (+replaceObjDate > +info.replaceObjDate) {
      info.replaceObjDate = replaceObjDate;
      const replaceObj = getValue_getValue({
        key: list_info.replaceObjKey,
        base: {},
        valType: "object",
        getVal: list_info.getValue,
        setVal: list_info.setValue,
      });
      for (const key in replaceObj) list_info.replaceObj[key] = replaceObj[key];
      return changeShow(list_info.control.move_eleList, !1), !0;
    }
    return !1;
  }
  function bindHistoryEvents(info) {
    const textEle = info.textEle,
      btnEle = info.btnEle,
      listEle = info.listEle;
    let mode = btnEle.btn_info.showMode;
    if ("显示" !== mode) {
      let eventName = "click";
      "单击" === mode
        ? (eventName = "click")
        : "双击" === mode && (eventName = "dblclick"),
        textEle &&
          textEle.addEventListener(eventName, function historyBtn(e) {
            if (this !== e.target) return;
            !(function btnShow(isShow) {
              (btnEle.style.display = isShow ? "block" : "none"),
                (listEle.parentElement.style.transform = "scaleY(0)"),
                isShow || showSearchBox(!1),
                setBtnColor(listEle, btnEle);
            })("none" === btnEle.style.display),
              e && e.stopPropagation();
          });
    }
    btnEle.addEventListener("click", function historyList(e) {
      if (
        this !== e.target &&
        "svg" !== e.target.tagName.toLowerCase() &&
        "path" !== e.target.tagName.toLowerCase()
      )
        return;
      const isClicked = "scaleY(0)" === listEle.parentElement.style.transform;
      if (((btnEle.isClicked = isClicked), isClicked)) {
        const list_info = listEle.list_info;
        list_info.isResetNum &&
          (resetNum(listEle), (list_info.isResetNum = !1)),
          (function openList(info) {
            const newDataList = updateDataList(info),
              flag = updateReplaceObj(info);
            (newDataList || flag) && initHisListDom(info);
            const listEle = info.listEle,
              listBox = listEle.parentElement;
            "none" === listBox.style.display &&
              ((listBox.style.display = "block"), listBox.offsetHeight),
              (listBox.style.transform = "scaleY(1)"),
              listBox.classList.add("opened"),
              setBtnColor(listEle, info.btnEle),
              showSearchBox(!1),
              changeShow(listEle.list_info.control.move_eleList, !1);
          })(info);
      } else hiddenBtnList(info, "list");
      e && e.stopPropagation();
    }),
      listEle.list_info.isOut &&
        listEle.addEventListener("dblclick", function useHistoryText(e) {
          const item = e.target;
          if ("hItem" === item.className) {
            const clickText = item.innerText;
            if (
              (textEle &&
                ((textEle.value = clickText),
                listEle.list_info.isExit &&
                  (function emitEvent(ele, eventType) {
                    try {
                      if (ele.dispatchEvent) {
                        var evt = new Event(eventType, {
                          bubbles: !1,
                          cancelable: !1,
                        });
                        ele.dispatchEvent(evt);
                      } else ele.fireEvent && ele.fireEvent("on" + eventType);
                    } catch (e) {}
                  })(textEle, "input")),
              info.callback && info.callback.clickItem)
            ) {
              const itemId = +item.id,
                data = info.dataList.find((i) => i.id === itemId),
                func = info.callback.clickItem;
              Array.isArray(func)
                ? func.curFn
                  ? (func[curFn](data), (func.curFn = null))
                  : func.forEach((fn) => {
                      fn(data);
                    })
                : func(data);
            }
            listEle.list_info.isClickClose &&
              ((listEle.parentElement.style.transform = "scaleY(0)"),
              setBtnColor(listEle, btnEle),
              showSearchBox(!1),
              changeShow(listEle.list_info.control.move_eleList, !1));
          } else listEle.parentElement.scrollTop = 0;
          e.stopPropagation();
        }),
      listEle.addEventListener("click", function listClickHandle(e) {
        const dom = e.target;
        if ("bottom_text" === dom.className)
          listEle.parentElement.scrollTop = 0;
        else if ("img" === dom.tagName.toLowerCase()) {
          let src = dom.src;
          const dataset = dom.dataset;
          dataset.url
            ? (src = dataset.url)
            : dataset.bigimg && (src = dataset.bigimg),
            src &&
              "//" === src.slice(0, 2) &&
              (src = window.location.protocol + src),
            src && window.open(src);
        }
      }),
      listEle.parentElement.addEventListener("dblclick", (e) => {
        (listEle.parentElement.scrollTop = 0), e.stopPropagation();
      });
  }
  const searchUpDom = (dom, value, type = "class", num = 5) => {
    let parent = dom;
    for (let i = 0; i < num; i++) {
      if (((parent = parent.parentNode), !parent)) return !1;
      if ((parent.host && (parent = parent.host), "class" === type)) {
        if (parent.classList.contains(value)) return parent;
      } else if ("id" === type) {
        if (parent.id === value) return parent;
      } else if ("ele" === type && parent.tagName.toLowerCase() === value)
        return parent;
    }
    return !1;
  };
  function getPathDom(classObj, pathArr, baseDom = document, isGetAll = !1) {
    if (!pathArr) return;
    const resultArr = [];
    let target;
    0 === pathArr.length && pathArr.push([]), (pathArr = [...pathArr]);
    for (let i = 0; i < pathArr.length; i++) {
      const path = pathArr[i];
      let dom = path.baseDom || baseDom || document,
        isContinue = !1;
      for (let j = 0; j < path.length; j++) {
        const item = path[j];
        if (item.multiple) {
          let doms = dom.querySelectorAll(item.selector);
          if (0 === doms.length) break;
          doms = [].slice.call(doms);
          const addArr = path.slice(j + 1);
          doms.forEach((addBaseDom) => {
            const curAddArr = [...addArr];
            (curAddArr.baseDom = addBaseDom.shadowRoot || addBaseDom),
              pathArr.push(curAddArr);
          }),
            (isContinue = !0);
          break;
        }
        if (((dom = dom.querySelector(item.selector)), !dom)) break;
        dom = dom.shadowRoot || dom;
      }
      if (
        dom &&
        !isContinue &&
        ((target = dom.querySelector(classObj.selector)), target)
      ) {
        if (!isGetAll) return target;
        resultArr.push(target);
      }
    }
    return isGetAll ? resultArr : target;
  }
  const listCss =
      "\n.ll-history-list {\n  transition: all 0.4s cubic-bezier(0.32, 0.1, 0.16, 1) 0s;\n  transform-origin: top;\n  scroll-behavior: smooth;\n  overflow-y: auto;\n}\n.ll-history-list .history-list {\n  word-break: break-all;\n  white-space: pre-wrap;\n}\n.ll-history-list .history-list .item-control {\n  word-break: initial;\n}\n.ll-history-list .history-list .item-control {\n  display: flex;\n  gap: 4px;\n  height: 25px;\n  line-height: 25px;\n  font-size: 17px;\n  border-bottom: 1px solid #ccc;\n  overflow: hidden;\n  cursor: default;\n}\n.ll-history-list .history-list .hItem {\n  font-size: 13px;\n  cursor: pointer;\n  padding: 6px 0;\n  overflow-y: auto\n}\n.ll-history-list .history-list .num {\n  user-select: none;\n}\n.ll-history-list .history-list .item-tt {\n  font-size: 13px;\n  line-height: 27px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n.ll-history-list .history-list .bottom_text {\n  padding: 8px 0;\n  text-align: center;\n  color: #aaa;\n  cursor: pointer;\n}\n.ll-history-list .history-list img {\n  min-width: 110px;\n  max-width: 165px;\n  min-height: 110px;\n  max-height: 165px;\n  display: inline-block;\n  margin: 5px 5px 0 0;\n  border-radius: 6px;\n  object-fit: cover;\n}\n.ll-history-list .history-list a {\n  text-decoration: none;\n  background-color: transparent;\n  color: #3d91c0;\n  cursor: pointer;\n}\n.ll-history-list .history-list a:hover {\n  color: #40b2f1;\n}\n.ll-history-list .list-control > div {\n  user-select: none;\n}\n",
    scrollCss =
      "\n.ll-scroll-style-1::-webkit-scrollbar,\n.ll-scroll-style-1 ::-webkit-scrollbar {\n  width: 8px;\n}\n.ll-scroll-style-1-size-2::-webkit-scrollbar,\n.ll-scroll-style-1 .ll-scroll-style-1-size-2::-webkit-scrollbar {\n  width: 10px;\n}\n.ll-scroll-style-1-size-3::-webkit-scrollbar,\n.ll-scroll-style-1 .ll-scroll-style-1-size-3::-webkit-scrollbar {\n  width: 12px;\n}\n.ll-scroll-style-1::-webkit-scrollbar-thumb,\n.ll-scroll-style-1 ::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.05);\n  opacity: 0.2;\n  background: #daedff;\n}\n.ll-scroll-style-1::-webkit-scrollbar-track,\n.ll-scroll-style-1 ::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.08);\n  border-radius: 0;\n  background: #fff;\n  border-radius: 5px;\n}",
    defaControls = {
      add: {
        name: "add",
        text: "添加",
        type: "top",
        title: "添加一项记录至列表末尾",
        class: "control-add",
        noneText: "请填写内容！！",
        endText: "添加成功",
      },
      search: {
        name: "search",
        text: "搜索",
        type: "top",
        searchType: "标题",
        title:
          "搜索所有记录的标题, 若要按描述搜索请先输入'描述=', 按内容搜索输入'内容=', 按日期搜索输入'日期='. 若含有==>或===则表示替换, 如: 标题=A==>B, 表示将列表中所有标题中的A替换为B",
        class: "control-search",
        position: "relative",
        replacedText: "已将所有列表项的searchType中的'oldVal'替换为'newVal'",
      },
      clear: {
        name: "clear",
        text: "清空",
        type: "top",
        title: "清空列表所有记录",
        class: "control-clear",
        hover_bg: "#fff",
        warnText: "是否清空列表？",
        twoWarnText:
          "请再次确认是否清空列表？清空数据后将无法复原！建议清空前先备份数据",
      },
      import: {
        name: "import",
        text: "导入",
        type: "top",
        title: "导入含数据记录的json文件",
        class: "control-import",
        warnText:
          "导入数据后是否覆盖原数据, 不覆盖则导入的数据将合并到原数据中",
        startTipText: "导入数据前建议先备份数据",
        submitText: "导入数据的数据将会和当前列表数据合并, 是否确认导入？",
        coverSubmitText:
          "导入数据后当前列表数据将会被覆盖, 建议导入数据前先备份数据, 是否确认导入？",
        uploadingText: "当前已存在上传任务",
        timeoutText: "文件上传超时",
        endText: "导入成功",
        isUploading: !1,
      },
      out: {
        name: "out",
        text: "导出",
        type: "top",
        title: "将列表的所有记录导出为json文件",
        class: "control-out",
        startText: "开始下载",
        isTime: !0,
        isFormat: !1,
        isDoubleOut: !0,
      },
      skip: {
        name: "skip",
        text: "跳转",
        type: "top",
        title: "快速跳转到对应名称的记录的位置",
        class: "control-skip",
      },
      fold: {
        name: "fold",
        text: "折叠",
        maxHeight: 45,
        noFoldText: "展开",
        type: "top",
        title: "将每条记录收起, 以节省空间",
        class: "control-fold",
        isFold: !1,
      },
      delete: {
        name: "delete",
        text: "删除",
        type: "move",
        title: "删除此条记录",
        class: "control-delete",
        bg: "#fff",
        hover: "#ff8b8b",
        hover_bg: "#fff",
        hover_bd: "1px solid #ffd4d4",
        warnText: "是否确认删除？",
        endText: "删除成功",
        isConfirm: !0,
      },
      update: {
        name: "update",
        text: "修改",
        type: "move",
        title: "修改此条记录",
        class: "control-update",
        noneText: "请填写内容！！",
        submitText: "是否确认修改？",
        endText: "修改成功",
      },
      move: {
        name: "move",
        text: "移动",
        type: "move",
        title: "将当前列表项移动到下次点击的列表项的上方",
        class: "control-move",
        tipText: "请点击目标位置的列表项",
        warnText: "是否将当前项移动到该项之前？",
        endText: "移动完成",
        isMoving: !1,
      },
      changePlace: {
        name: "changePlace",
        text: "换位",
        type: "move",
        title: "将当前项和点击的另一项进行位置交换",
        class: "control-changePlace",
        tipText: "请选择需要交换位置的项",
        warnText: "是否交换两项的位置？",
        endText: "换位成功",
        isChangePlaceing: !1,
      },
      desc: {
        name: "desc",
        text: "描述",
        type: "move",
        title: "当前记录的描述文本",
        class: "control-desc",
      },
      toSuki: {
        name: "toSuki",
        text: "收藏",
        type: "move",
        title: "将当前记录添加到收藏列表中",
        class: "control-toSuki",
        endText: "已添加至收藏",
      },
      copy: {
        name: "copy",
        text: "复制",
        type: "move",
        title: "复制内容到剪贴板",
        class: "control-copy",
        endText: "已复制到剪贴板",
      },
      toTop: {
        width: 20,
        height: 20,
        name: "toTop",
        text: "^",
        type: "other",
        title: "返回顶部",
        class: "control-toTop",
        bg: "#fff",
        hover_bg: "#fff",
        bd: "1px solid #dfedfe",
        color: "#65aaff",
        hover: "#65aaff",
        hover_bd: "1px solid #65aaff",
        fontSize: 14,
        pd: "3px 0 0 0",
        isCenter: !0,
        css: "position:absolute; bottom:4px; right:4px;",
      },
      toBottom: {
        name: "toBottom",
        text: "底部",
        type: "top",
        title: "滚动到列表底部, 双击列表项序号可以回到顶部",
        class: "control-toBottom",
      },
      saveImg: {
        name: "saveImg",
        text: "图片下载",
        type: "top",
        title: "下载列表中的所有图片",
        class: "control-saveImg",
        warnText: "是否下载该列表中的所有图片？",
        saveType: "auto",
        baseName: "image",
      },
      custom: {
        name: "custom",
        text: "未定",
        type: "top",
        class: "control-custom",
      },
    };
  function createSwitchBtn({
    box,
    svg,
    text = ">",
    size = 25,
    lineHeight,
    top = 1,
    right = -28,
    titleText = "显示/隐藏历史记录",
    className = "",
    fontSize = 14,
    fontWeight = 400,
    zIndex = 900,
    color = "#65aaff",
    bg = "#fff",
    bd = "1px solid #b7cffe",
    hover = "#65aaff",
    hover_bg = "#f7fbff",
    hover_bd = "1px solid #b7cffe",
    click = "#65aaff",
    click_bg = "#f7fbff",
    click_bd = "1px solid #b7cffe",
    fontFamily = "initial",
    showMode = "单击",
    isChangeColor = !0,
    isPosition = !0,
    child,
  } = {}) {
    if (!box) return;
    let width = size,
      height = size;
    if ("string" == typeof size && size.includes("x")) {
      const sizeArr = size.split("x");
      (width = sizeArr[0]), (height = sizeArr[1]);
    }
    const btnEle = document.createElement("div");
    (btnEle.innerHTML = svg || text),
      child && btnEle.appendChild(child),
      (btnEle.title = titleText),
      (btnEle.className = className + " ll-history-btn");
    const positionCss = isPosition
      ? `\nposition: absolute;\nz-index: ${zIndex};\ntop: ${top}px;\nright: ${right}px;`
      : "";
    (btnEle.style.cssText =
      `${child ? "display: flex;" : ""}\nmin-width: 10px;\nwidth: ${
        "auto" === width ? "auto" : width + "px"
      };\nheight: ${
        "auto" === height ? "auto" : height + "px"
      };\nline-height: ${
        lineHeight || parseInt(height) - 3
      }px;\nfont-size: ${fontSize}px;\nfont-weight: ${fontWeight};\ntext-align: center;\ncolor: ${color};\nbackground: ${bg};\n${
        bd ? "border:" + bd + ";" : ""
      }\nborder-radius: 6px;\nbox-sizing: border-box;\ncursor: pointer;\ndisplay: ${
        "显示" === showMode ? "block" : "none"
      };\nfont-family: ${fontFamily};\nuser-select: none;` + positionCss),
      (btnEle.btn_info = {
        isSvg: !!svg,
        showMode,
        isChangeColor,
        color,
        bg,
        bd,
        hover,
        hover_bg,
        hover_bd,
        click,
        click_bg,
        click_bd,
      });
    const btn_info = btnEle.btn_info;
    return (
      btnEle.addEventListener("mouseenter", () => {
        btn_info.isChangeColor &&
          ((btnEle.style.color = hover),
          (btnEle.style.fill = hover),
          (btnEle.style.background = hover_bg),
          bd && (btnEle.style.border = hover_bd),
          (btnEle.isHover = !0),
          btn_info.isSvg &&
            btnEle.children[0] &&
            (btnEle.children[0].style.fill = btn_info.hover));
      }),
      btnEle.addEventListener("mouseleave", () => {
        btn_info.isChangeColor &&
          (btnEle.isClicked ||
            ((btnEle.style.color = color),
            (btnEle.style.fill = color),
            (btnEle.style.background = bg),
            bd && (btnEle.style.border = bd),
            btn_info.isSvg &&
              btnEle.children[0] &&
              (btnEle.children[0].style.fill = btn_info.color)),
          (btnEle.isHover = !1));
      }),
      box.appendChild(btnEle),
      btnEle
    );
  }
  function createHistoryList({
    list_id = "SD_list_1",
    box,
    width = 350,
    maxHeight = 500,
    liMaxHeight = 220,
    top = 1,
    right = -382,
    fontSize = 12,
    maxLen = 100,
    title = "双击返回顶部",
    cssText = "",
    hoverColor = "#f7fbff",
    num_color = "#b5d6ff",
    tt_color = "#b5d6ff",
    tt_maxLen,
    saveName = "ll-history-list",
    outName = "列表数据",
    controlTitle = "这里是工具栏",
    listTitle = "双击一条记录即可使用",
    bottomTT = "点击返回顶部",
    className = "",
    initialText = "无历史记录",
    bottomText = "没有更多的数据了",
    dataSyncText = "正在同步其他页面的数据, 请稍后再试",
    syncEndText = "数据同步完成, 请重新操作",
    errorSyncText = "操作失败, 当前项的数据可能在其他页面中已删除",
    zIndex = 900,
    color = "#333",
    bg = "#fff",
    bd = "3px solid #dfedfe",
    pd = "6px 5px 6px 10px",
    fontFamily = "math",
    isCenter = !1,
    isDelete = !0,
    isDelRepeat = !0,
    isExit = !1,
    isOut = !0,
    isClickClose = !0,
    isDesc = !0,
    isAddUp = !0,
    isDataStrict = !0,
    isScrollStyle = !0,
    isDataSync = !1,
    isHidden = !1,
    controlCfg,
    controlArr = [],
    getValue,
    setValue,
    replaceObj,
    replaceObjKey,
    replaceObjFn,
    isCoverRepObj = !0,
  } = {}) {
    if (!box) return;
    if (
      (getValue || (getValue = localStorage.getItem),
      setValue || (setValue = localStorage.setItem),
      !replaceObjKey)
    ) {
      replaceObj = [
        ...getValue_getValue({
          base: {},
          key: (replaceObjKey = list_id + "_replaceObj"),
          valType: "object",
          getVal: getValue,
          setVal: setValue,
        }),
        ...replaceObj,
      ];
    }
    "relative" !== box.style.position &&
      "absolute" !== box.style.position &&
      "fixed" !== box.style.position &&
      (box.style.position = "relative");
    const hList = document.createElement("div");
    (hList.id = list_id || ""),
      (hList.className =
        className +
        " ll-history-list ll-scroll-style-1 ll-scroll-style-1-size-2"),
      (hList.title = title),
      (hList.style.scrollBehavior = "smooth"),
      (hList.innerHTML =
        '<div class="list-control"></div><div class="move-control-box"></div><div class="history-list text-list"></div>');
    const control = hList.querySelector(".list-control"),
      moveControlBox = hList.querySelector(".move-control-box"),
      listEle = hList.querySelector(".text-list");
    (control.title = controlTitle), (listEle.title = listTitle);
    const topEle = document.createElement("div");
    return (
      (topEle.className = "to-top"),
      (topEle.innerHTML = "^"),
      (listEle.list_info = {
        className,
        saveName,
        outName,
        maxLen,
        maxHeight,
        liMaxHeight,
        num_color,
        tt_color,
        tt_maxLen,
        initialText,
        bottomText,
        dataSyncText,
        syncEndText,
        errorSyncText,
        isDelete,
        isDelRepeat,
        isExit,
        isOut,
        isClickClose,
        isDesc,
        isAddUp,
        isDataStrict,
        isDataSync,
        control,
        bottomTT,
        list_id,
        setValue,
        getValue,
        replaceObj,
        replaceObjKey,
        replaceObjFn,
        isCoverRepObj,
      }),
      (control.eleList = { move_control: moveControlBox }),
      (control.info = {}),
      (control.style.cssText = "display: flex;\nflex-wrap: wrap;"),
      (moveControlBox.style.cssText =
        "display: flex;\nposition: absolute;\nright: 0;\ntop: 0;"),
      (hList.style.cssText = `${
        isHidden ? "display:none" : "display:block"
      };\nwidth: ${width}px;\nmax-height: ${maxHeight}px;\nline-height: ${
        fontSize + 5
      }px;\nfont-size: ${fontSize}px;\ncolor: ${color};\nbackground: ${bg};\nposition: absolute;\nz-index: ${zIndex};\ntop: ${top}px;\nright: ${right}px;\nbox-sizing: border-box;\nborder: ${bd};\nborder-radius: 8px;\npadding: ${pd};\ntransform: scaleY(0);\nfont-family: ${fontFamily};`),
      (listEle.style.cssText = `\n  ${isCenter ? "text-align: center" : ""};`),
      "none" !== cssText &&
        (isScrollStyle
          ? addCss(cssText + listCss + scrollCss, box, "ll-scroll-style-1")
          : addCss(cssText + listCss, box)),
      (control.cfg = {
        name: "cfg",
        height: 24,
        fontSize: 12,
        color: "#65aaff",
        bg: "#dfedfe",
        mg: "0 2px 4px 2px",
        bd: "1px solid #dfedfe",
        pd: "0 5px",
        radius: 6,
        hover: "#65aaff",
        hover_bg: "#cee4ff",
        hover_bd: "1px solid #dfedfe",
        move_height: 24,
        move_fontSize: 12,
        move_mg: "0 4px 0 0",
        move_pd: "0 5px",
        move_radius: 5,
        ...controlCfg,
      }),
      controlArr.forEach((item) => {
        control.info[item.name] = { ...defaControls[item.name], ...item };
      }),
      (control.top_eleList = {}),
      (control.move_eleList = {}),
      (control.other_eleList = {}),
      listEle.addEventListener("mouseover", (e) => {
        const item = e.target;
        item.classList.contains("hItem") &&
          (item.style.backgroundColor = hoverColor);
      }),
      listEle.addEventListener("mouseout", (e) => {
        const item = e.target;
        item.classList.contains("hItem") &&
          (item.style.backgroundColor = "#fff");
      }),
      (function addControlDom(control) {
        function createControl({ obj, box, type } = {}) {
          (type = type ? type + "_" : ""), (box = box || obj.box || null);
          const dom = document.createElement("div"),
            cfg = control.cfg;
          (dom.className = obj.class),
            (dom.title = obj.title),
            (dom.innerText = obj.text);
          const width = obj.width || cfg[type + "width"] || cfg.width;
          return (
            (dom.style.cssText = `\nheight: ${
              obj.height || cfg[type + "height"] || cfg.height
            }px;\nline-height: ${
              obj.height || cfg[type + "height"] || cfg.height
            }px;\nwidth: ${width ? width + "px" : "auto"};\nfont-size: ${
              obj.fontSize || cfg[type + "fontSize"] || cfg.fontSize
            }px;\ncolor: ${
              obj.color || cfg[type + "color"] || cfg.color
            };\nbackground: ${obj.bg || cfg[type + "bg"] || cfg.bg};\nmargin: ${
              ("move_" === type ? obj[type + "mg"] : obj.mg) || cfg.mg
            };\nborder: ${
              obj.bd || cfg[type + "bd"] || cfg.bd
            };\nborder-radius: ${
              obj.radius || cfg[type + "radius"] || cfg.radius
            }px;\nbox-sizing: border-box;\npadding: ${
              obj.pd || cfg[type + "pd"] || cfg.pd
            };\ncursor:pointer;\n${
              obj.isCenter ? "text-align: center;" : ""
            }\n${obj.css ? obj.css : ""}`),
            dom.addEventListener("mouseenter", () => {
              (dom.style.color = obj.hover || cfg.hover),
                (dom.style.background = obj.hover_bg || cfg.hover_bg),
                (dom.style.border = obj.hover_bd || cfg.hover_bd);
            }),
            dom.addEventListener("mouseleave", () => {
              (dom.style.color = obj.color || cfg.color),
                (dom.style.background = obj.bg || cfg.bg),
                (dom.style.border = obj.bd || cfg.bd);
            }),
            box ? box.appendChild(dom) : control.appendChild(dom),
            dom
          );
        }
        const info = control.info;
        if (!control.info) return;
        for (let key in info) {
          const item = info[key];
          "move" === item.type
            ? ((item.ele = createControl({
                obj: item,
                box: control.eleList.move_control,
                type: item.type,
              })),
              (item.ele.info = item))
            : (item.ele = createControl({ obj: item })),
            (control[item.type + "_eleList"][key] = item.ele);
        }
      })(control),
      box.appendChild(hList),
      {
        value: listEle,
        list_info: listEle.list_info,
        control,
        control_info: control.info,
      }
    );
  }
  const autoSave = (info) => {
      const list_info = info.listEle.list_info;
      let outName = list_info.outName || list_info.saveName || "dataList";
      (outName =
        formatDate({
          timestamp: new Date().getTime(),
          isExact: !0,
          midDelimiter: "-",
          delimiter2: ".",
        }) +
        " " +
        outName),
        info.dataList.forEach((item) => {
          item.desc = item.desc
            .replaceAll("&apos;", "'")
            .replaceAll("&quot;", '"');
        });
      const dataObj = { dataList: info.dataList };
      list_info.replaceObj && (dataObj.replaceObj = list_info.replaceObj);
      const outFile = list_info.control.info.out;
      saveJson({
        data: dataObj,
        fileName: outName,
        isFormat: outFile.isFormat,
        isDoubleOut: outFile.isDoubleOut,
      });
    },
    icons = {
      base: {
        color: "#666",
        width: "100%",
        height: "80%",
        marginTop: "10%",
        html: "",
      },
      lishi: {
        color: "#8a8a8a",
        width: "100%",
        height: "80%",
        marginTop: "10%",
        html: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1700314086069" style="svgStyleFlag" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4255" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M512.5 98.29c-227.84 0-412.54 184.7-412.54 412.54s184.7 412.54 412.54 412.54 412.54-184.7 412.54-412.54S740.34 98.29 512.5 98.29z m249.28 661.82c-32.4 32.4-70.1 57.82-112.08 75.58-43.42 18.37-89.59 27.68-137.21 27.68-47.62 0-93.78-9.31-137.2-27.68-41.97-17.75-79.68-43.18-112.08-75.58-32.4-32.4-57.82-70.1-75.58-112.08-18.37-43.42-27.68-89.59-27.68-137.21 0-47.62 9.31-93.78 27.68-137.21 17.75-41.97 43.18-79.68 75.58-112.08s70.1-57.82 112.08-75.58c43.42-18.37 89.59-27.68 137.21-27.68 47.62 0 93.78 9.31 137.21 27.68 41.97 17.75 79.68 43.18 112.08 75.58s57.82 70.1 75.58 112.08c18.37 43.42 27.68 89.59 27.68 137.21 0 47.62-9.31 93.78-27.68 137.21-17.77 41.97-43.19 79.68-75.59 112.08z" p-id="4256"></path><path d="M738.68 674.81L542 497.48V248.27c0-16.57-13.43-30-30-30s-30 13.43-30 30v262.55c0 8.5 3.6 16.59 9.91 22.28L698.5 719.37a29.906 29.906 0 0 0 20.08 7.72c8.2 0 16.37-3.34 22.29-9.91 11.1-12.3 10.12-31.27-2.19-42.37z" p-id="4257"></path></svg>',
      },
      shoucang: {
        color: "#fe9850",
        width: "100%",
        height: "80%",
        marginTop: "10%",
        html: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1700314090785" style="svgStyleFlag" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4405" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M949.888 457.258667c26.069333-29.824 13.866667-67.52-24.789333-76.309334L681.728 325.546667l-127.786667-214.677334c-20.266667-34.069333-59.925333-34.090667-80.213333 0l-127.786667 214.677334-243.370666 55.381333c-38.442667 8.746667-50.858667 46.506667-24.789334 76.309333l164.394667 188.053334-22.613333 248.917333c-3.584 39.466667 28.458667 62.805333 64.896 47.146667l237.781333-102.037334a21.333333 21.333333 0 0 0-16.810667-39.210666L267.626667 902.186667c-6.698667 2.88-6.229333 3.221333-5.568-4.096l24.277333-267.093334-176.426667-201.813333c-4.757333-5.461333-4.906667-5.034667 2.133334-6.634667l261.205333-59.434666 137.152-230.4c3.733333-6.293333 3.136-6.293333 6.869333 0l137.173334 230.4 261.205333 59.434666c7.125333 1.621333 6.954667 1.088 2.133333 6.613334l-176.426666 201.813333 24.256 267.093333a21.333333 21.333333 0 1 0 42.496-3.84l-22.613334-248.917333 164.394667-188.053333z" p-id="4406"></path></svg>',
      },
    };
  const commentHistory_curInfo = info.history,
    commentHistory_doms = commentHistory_curInfo.doms,
    svg = (function getIconHTML({
      name = "",
      svg,
      color,
      width,
      height,
      marginTop,
      css = "",
    } = {}) {
      let icon;
      if (
        (svg
          ? ((icon = { ...icons.base }), (icon.html = svg))
          : (icon = icons[name]),
        icon)
      )
        return (
          (css += `\nfill:${color || icon.color || icons.base.fill};\nwidth:${
            width || icon.width || icons.base.width
          };\nheight:${
            height || icon.height || icons.base.height
          };\nmargin-top:${
            marginTop || icon.marginTop || icons.base.marginTop
          };`),
          icon.html.replace("svgStyleFlag", css)
        );
    })({
      svg: '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1700396681111" style="svgStyleFlag" class="" viewBox="0 0 1129 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15893" xmlns:xlink="http://www.w3.org/1999/xlink" width="220.5078125" height="200"><path d="M669.489367 1016.496894c-85.292857 2.785872-189.356466-2.386815-292.381021-29.349537C148.937907 927.424287-6.152335 732.202431 0.187406 497.45884 6.73797 255.283749 172.038056 65.520695 404.560478 15.774058 576.109953-20.939216 737.517347 5.669626 884.799618 103.822669c122.465423 81.618517 190.493403 199.45337 219.790235 340.855193 24.922259 120.206608 25.04273 240.84992-6.166565 360.265943-36.434687 139.368889-127.359522 201.350774-265.990532 211.026032-47.427587 3.312929-95.284349 0.527057-162.93586 0.527057" fill="#ADDEEE" p-id="15894"></path><path d="M389.795357 745.070147c-21.594272-42.932545-21.669566-91.391657-33.761756-136.816428-5.391039-20.231454-13.831478-27.903895-30.65212-35.674219-29.417301-13.605596-58.277429-28.890245-85.73709-46.079827-29.010715-18.145814-27.949072-26.74437 3.056929-42.480782 107.090422-54.339561 218.374711-99.222216 329.576176-144.112401 69.435975-28.024365 139.820652-53.729681 210.145095-79.434996 13.138774-4.796217 30.441298-15.322295 41.426668-3.91528 10.089374 10.488431 4.39716 28.536364 0.639997 43.128309-20.63804 80.135229-54.866618 155.316123-86.723439 231.174663-25.148141 59.873658-54.550384 117.98544-83.064159 176.405926-20.841334 42.691605-25.012612 44.235128-68.299038 22.414975-31.096354-15.676177-60.747066-34.168342-91.037776-51.410631-6.159036 2.763284-12.129837 1.355289-18.017815-0.873408-41.637491-15.774058-41.276081-15.623471-59.331542 26.87237-6.490329 15.314766-7.604677 35.011633-28.22013 40.801729" fill="#FDFEFE" p-id="15895"></path><path d="M389.795357 745.070147c11.858779-26.99284 25.931197-53.277918 34.921281-81.204401 7.785383-24.18438 16.173116-22.324622 32.654936-8.606086 11.24137 9.366553 25.223435 15.457824 37.99327 23.009796-11.72325 28.58154-75.256188 68.788448-105.569487 66.800691" fill="#0294C9" p-id="15896"></path></svg>',
    });
  function useData() {
    const saveData = info.saveData;
    for (const key in saveData) {
      const list = saveData[key].value,
        len = list.length;
      if (["zanList", "sukiList"].includes(key))
        for (let i = 0; i < len; i++) {
          const rpArr = list[i].replaceArr;
          if (rpArr) {
            const replaceObj = {};
            rpArr.forEach((item) => {
              replaceObj[item.flag] = item.value;
            }),
              (list[i].replaceObj = replaceObj),
              delete list[i].replaceArr;
          }
        }
      if (settings.imageLazyLoad.value)
        for (let i = 0; i < len; i++) {
          const rpObj = list[i].replaceObj;
          if (rpObj)
            for (let key in rpObj) {
              const lazyClass = commentHistory_curInfo.classList.imageLazyLoad;
              let src = rpObj[key].split('<img class="img-item" src="');
              if (1 === src.length) continue;
              src = src[1].split('"')[0];
              let style = getWhStyle(src);
              style = style ? `style="${style}"` : "";
              const lazyBaseImage = info.history.lazyBaseImage;
              rpObj[key] = rpObj[key].replace(
                '<img class="img-item" src="',
                `<img class="img-item ${lazyClass}" ${style} src="${lazyBaseImage}" data-src="`
              );
            }
        }
    }
    (commentHistory_curInfo.zan_info.dataList = saveData.zanList.value),
      (commentHistory_curInfo.data.dataList = saveData.list.value),
      (commentHistory_curInfo.suki_info.dataList = saveData.sukiList.value);
  }
  function createHisBtnList() {
    const colorObj = commentHistory_curInfo.color.listBtnObj,
      zan_listBtn = createSwitchBtn({
        titleText: "点赞过的评论都在这里！",
        color: commentHistory_curInfo.color.font,
        fontSize: commentHistory_curInfo.fontSize,
        size: "autoxauto",
        text: commentHistory_doms.zan_comment.option.text,
        box: commentHistory_doms.options.ele,
        ...colorObj,
        showMode: "显示",
        isPosition: !1,
      }),
      listBtn = createSwitchBtn({
        titleText: `按下${settings.sendKeys.value}即可发送评论`,
        color: commentHistory_curInfo.color.font,
        fontSize: commentHistory_curInfo.fontSize,
        size: "autoxauto",
        text: commentHistory_doms.comment.option.text,
        box: commentHistory_doms.options.ele,
        ...colorObj,
        showMode: "显示",
        isPosition: !1,
      }),
      suki_listBtn = createSwitchBtn({
        titleText: `按下${settings.addItemKeys.value}后双击页面中的一条评论即可加入收藏`,
        color: commentHistory_curInfo.color.font,
        fontSize: commentHistory_curInfo.fontSize,
        size: "autoxauto",
        text: commentHistory_doms.suki_comment.option.text,
        box: commentHistory_doms.options.ele,
        ...colorObj,
        showMode: "显示",
        isPosition: !1,
      });
    (zan_listBtn.style.lineHeight = commentHistory_curInfo.height - 3 + "px"),
      (listBtn.style.lineHeight = commentHistory_curInfo.height - 3 + "px"),
      (suki_listBtn.style.lineHeight =
        commentHistory_curInfo.height - 3 + "px");
    const wh = settings.listSize.value.split(/,|，|x|X/),
      whBase = settings.listSize.base.split(/x|X/),
      wBase = +whBase[0].trim(),
      hBase = +whBase[1].trim();
    let w, h;
    1 === wh.length
      ? (w = h = +wh[0].trim() || wBase)
      : ((w = +wh[0].trim() || wBase), (h = +wh[1].trim() || hBase));
    const disW = w - wBase;
    let replaceObj = null;
    settings.isSaveEmoji.value && (replaceObj = info.saveData.emojiList.value);
    let zan_commentListInfo = createHistoryList({
        list_id: commentHistory_doms.zan_comment.list.class,
        box: commentHistory_doms.options.ele,
        width: w,
        maxHeight: h,
        fontSize: commentHistory_curInfo.fontSize - 2,
        right: -170 - disW,
        top: 35,
        liMaxHeight: settings.liMaxHeight.value,
        saveName: commentHistory_curInfo.zan_info.saveName,
        outName: commentHistory_doms.zan_comment.option.text,
        maxLen: settings.zanListMaxLen.value,
        listTitle: commentHistory_curInfo.txt.listTT,
        initialText: "暂无评论记录",
        isDesc: settings.zanListIsDesc.value,
        isAddUp: settings.zanListIsDesc.value,
        isDelete: !!settings.zanListMaxLen.value,
        isScrollStyle: !1,
        isDataSync: !0,
        isClickClose: settings.isHiddenList.value,
        replaceObj,
        isCoverRepObj: !1,
        isHidden: !0,
        replaceObjFn: replaceEmojis,
        replaceObjKey: info.saveData.emojiList.key,
        setValue: GM_setValue,
        getValue: GM_getValue,
        controlArr: [
          { name: "add" },
          {
            name: "search",
            position: "fixed",
            searchType: "内容",
            title: commentHistory_curInfo.txt.searchTT,
          },
          { name: "clear" },
          {
            name: "out",
            isFormat: settings.isFormatOut.value,
            isDoubleOut: settings.isDoubleOut.value,
          },
          { name: "import" },
          { name: "fold" },
          { name: "toBottom", title: commentHistory_curInfo.txt.toBottomTT },
          {
            name: "saveImg",
            text: "图片",
            class: "control-saveImg",
            warnText: commentHistory_curInfo.txt.saveImgText,
            saveType: settings.imgType.value,
          },
          {
            name: "custom",
            text: "设置",
            callback: showSettings,
            title: commentHistory_curInfo.txt.settings,
          },
          { name: "update" },
          { name: "move", warnText: "" },
          { name: "toSuki" },
          { name: "copy" },
          { name: "delete", isConfirm: settings.isConfirm.value },
        ],
      }),
      commentListInfo = createHistoryList({
        list_id: commentHistory_doms.comment.list.class,
        box: commentHistory_doms.options.ele,
        width: w,
        maxHeight: h,
        fontSize: commentHistory_curInfo.fontSize - 2,
        right: -244 - disW,
        top: 35,
        cssText: "none",
        liMaxHeight: settings.liMaxHeight.value,
        saveName: commentHistory_curInfo.data.saveName,
        outName: commentHistory_doms.comment.option.text,
        maxLen: settings.listMaxLen.value,
        listTitle: commentHistory_curInfo.txt.listTT,
        initialText: "暂无评论记录",
        isDesc: settings.histListIsDesc.value,
        isAddUp: settings.histListIsDesc.value,
        isDelete: !!settings.listMaxLen.value,
        isScrollStyle: !1,
        isDataSync: !0,
        isClickClose: settings.isHiddenList.value,
        replaceObj,
        isCoverRepObj: !1,
        isHidden: !0,
        replaceObjFn: replaceEmojis,
        replaceObjKey: info.saveData.emojiList.key,
        setValue: GM_setValue,
        getValue: GM_getValue,
        controlArr: [
          { name: "add" },
          {
            name: "search",
            position: "fixed",
            searchType: "内容",
            title: commentHistory_curInfo.txt.searchTT,
          },
          { name: "clear" },
          {
            name: "out",
            isFormat: settings.isFormatOut.value,
            isDoubleOut: settings.isDoubleOut.value,
          },
          { name: "import" },
          { name: "fold" },
          { name: "toBottom", title: commentHistory_curInfo.txt.toBottomTT },
          {
            name: "saveImg",
            text: "图片",
            class: "control-saveImg",
            warnText: commentHistory_curInfo.txt.saveImgText,
            saveType: settings.imgType.value,
          },
          {
            name: "custom",
            text: "设置",
            callback: showSettings,
            title: commentHistory_curInfo.txt.settings,
          },
          { name: "update" },
          { name: "move", warnText: "" },
          { name: "toSuki" },
          { name: "copy" },
          { name: "delete", isConfirm: settings.isConfirm.value },
        ],
      }),
      suki_commentListInfo = createHistoryList({
        list_id: commentHistory_doms.suki_comment.list.class,
        box: commentHistory_doms.options.ele,
        width: w,
        maxHeight: h,
        fontSize: commentHistory_curInfo.fontSize - 2,
        right: -315 - disW,
        top: 35,
        cssText: "none",
        liMaxHeight: settings.liMaxHeight.value,
        saveName: commentHistory_curInfo.suki_info.saveName,
        outName: commentHistory_doms.suki_comment.option.text,
        listTitle: commentHistory_curInfo.txt.listTT,
        initialText: "暂无收藏评论",
        isDesc: settings.sukiListIsDesc.value,
        isAddUp: settings.sukiListIsDesc.value,
        isDelete: !1,
        isScrollStyle: !1,
        isDataSync: !0,
        isClickClose: settings.isHiddenList.value,
        replaceObj,
        isCoverRepObj: !1,
        isHidden: !0,
        replaceObjFn: replaceEmojis,
        replaceObjKey: info.saveData.emojiList.key,
        setValue: GM_setValue,
        getValue: GM_getValue,
        controlArr: [
          { name: "add" },
          {
            name: "search",
            position: "fixed",
            searchType: "内容",
            title: commentHistory_curInfo.txt.searchTT,
          },
          { name: "clear" },
          {
            name: "out",
            isFormat: settings.isFormatOut.value,
            isDoubleOut: settings.isDoubleOut.value,
          },
          { name: "import" },
          { name: "fold" },
          { name: "toBottom", title: commentHistory_curInfo.txt.toBottomTT },
          {
            name: "saveImg",
            text: "图片",
            class: "control-saveImg",
            warnText: commentHistory_curInfo.txt.saveImgText,
            saveType: settings.imgType.value,
          },
          {
            name: "custom",
            text: "设置",
            callback: showSettings,
            title: commentHistory_curInfo.txt.settings,
          },
          { name: "update" },
          { name: "move", warnText: "" },
          { name: "copy" },
          { name: "delete", isConfirm: settings.isConfirm.value },
        ],
      });
    (commentHistory_curInfo.zan_info.btnEle = zan_listBtn),
      (commentHistory_curInfo.data.btnEle = listBtn),
      (commentHistory_curInfo.suki_info.btnEle = suki_listBtn),
      (commentHistory_curInfo.zan_info.listEle = zan_commentListInfo.value),
      (commentHistory_curInfo.data.listEle = commentListInfo.value),
      (commentHistory_curInfo.suki_info.listEle = suki_commentListInfo.value),
      initHisListDom(commentHistory_curInfo.zan_info),
      initHisListDom(commentHistory_curInfo.data),
      initHisListDom(commentHistory_curInfo.suki_info),
      bindHistoryEvents(commentHistory_curInfo.zan_info),
      bindHistoryEvents(commentHistory_curInfo.data),
      bindHistoryEvents(commentHistory_curInfo.suki_info),
      controlEvents(
        zan_commentListInfo.control,
        commentHistory_curInfo.zan_info,
        info.searchEle,
        info.edit
      ),
      controlEvents(
        commentListInfo.control,
        commentHistory_curInfo.data,
        info.searchEle,
        info.edit
      ),
      controlEvents(
        suki_commentListInfo.control,
        commentHistory_curInfo.suki_info,
        info.searchEle,
        info.edit
      ),
      (commentHistory_curInfo.zan_info.listEle.parentElement.style.opacity = 0),
      (commentHistory_curInfo.data.listEle.parentElement.style.opacity = 0),
      (commentHistory_curInfo.suki_info.listEle.parentElement.style.opacity = 0),
      (commentHistory_curInfo.isListCreated = !0);
  }
  function setToSukiCallback() {
    info.history.zan_info.callback.toSuki = info.history.data.callback.toSuki =
      (data) => {
        const sukiDate = formatDate({
          timestamp: new Date().getTime(),
          isExact: !0,
          delimiter2: "时分秒",
        });
        return (
          data.desc && data.desc.includes("评论的相关信息:")
            ? (data.desc = data.desc.replace(
                "评论的相关信息:",
                `评论的相关信息:\n收藏日期: ${sukiDate}`
              ))
            : (data.desc += `\n收藏日期: ${sukiDate}`),
          data
        );
      };
  }
  function getMenuIsOpened() {
    return commentHistory_doms.options.ele.classList.contains("opened");
  }
  function openMenu(isOpen = !0) {
    isOpen
      ? (commentHistory_doms.btn.ele.classList.add("opened"),
        commentHistory_doms.options.ele.classList.add("opened"))
      : (commentHistory_doms.btn.ele.classList.remove("opened"),
        commentHistory_doms.options.ele.classList.remove("opened"),
        closeAllList()),
      commentHistory_curInfo.isListCreated &&
        (isOpen
          ? ((commentHistory_curInfo.zan_info.listEle.parentElement.style.opacity = 1),
            (commentHistory_curInfo.data.listEle.parentElement.style.opacity = 1),
            (commentHistory_curInfo.suki_info.listEle.parentElement.style.opacity = 1))
          : ((commentHistory_curInfo.zan_info.listEle.parentElement.style.opacity = 0),
            (commentHistory_curInfo.data.listEle.parentElement.style.opacity = 0),
            (commentHistory_curInfo.suki_info.listEle.parentElement.style.opacity = 0)));
  }
  function closeAllList() {
    commentHistory_curInfo.isListCreated &&
      (hiddenBtnList(commentHistory_curInfo.zan_info),
      hiddenBtnList(commentHistory_curInfo.data),
      hiddenBtnList(commentHistory_curInfo.suki_info));
  }
  function bindListEvents() {
    function menuBtnClick(listInfo) {
      if (!commentHistory_curInfo.isListCreated) return;
      listInfo === commentHistory_curInfo.zan_info
        ? (hiddenBtnList(commentHistory_curInfo.data),
          hiddenBtnList(commentHistory_curInfo.suki_info))
        : listInfo === commentHistory_curInfo.data
        ? (hiddenBtnList(commentHistory_curInfo.zan_info),
          hiddenBtnList(commentHistory_curInfo.suki_info))
        : listInfo === commentHistory_curInfo.suki_info &&
          (hiddenBtnList(commentHistory_curInfo.zan_info),
          hiddenBtnList(commentHistory_curInfo.data));
      const listBox = listInfo.listEle.parentElement;
      (!listInfo.old_updateDate ||
        +listInfo.updateDate > +listInfo.old_updateDate) &&
        ((listInfo.old_updateDate = listInfo.updateDate),
        settings.imageLazyLoad.value
          ? ((listInfo.listEle.parentElement.scrollTop = 0),
            listImgLazyLoad(listBox, 7))
          : (function loadAllLazyImage(dom) {
              if (
                ((dom = dom || info.history.doms.box.ele),
                !settings.imageLazyLoad.value)
              ) {
                let imgArr = dom.querySelectorAll(
                  `img.${classList.imageLazyLoad}`
                );
                (imgArr = [].slice.call(imgArr)),
                  imgArr.forEach((img) => {
                    loadImage(img);
                  });
              }
            })(listInfo.listEle));
    }
    const listBoxs = [
      commentHistory_curInfo.zan_info.listEle.parentElement,
      commentHistory_curInfo.data.listEle.parentElement,
      commentHistory_curInfo.suki_info.listEle.parentElement,
    ];
    !(function setSearchCallback(obj) {
      searchCallback = obj;
    })({
      searchAfter: () => {
        listImgLazyLoad(info.searchEle.listEle.parentElement, 7);
      },
    });
    const throttleImgLoad = (function throttleDebounce(fn, interval) {
      let lastTime = 0;
      return function () {
        let nowTime = new Date().getTime();
        const args = arguments;
        let timer;
        interval - (nowTime - lastTime) <= 0
          ? (clearTimeout(timer), fn.apply(this, args), (lastTime = nowTime))
          : (clearTimeout(timer),
            (timer = setTimeout(() => {
              fn.apply(this, args), (lastTime = nowTime);
            }, interval)));
      };
    })(listImgLazyLoad, 400);
    settings.imageLazyLoad.value &&
      listBoxs.forEach((listDom) => {
        listDom.addEventListener("scroll", () => {
          throttleImgLoad(listDom);
        });
      }),
      commentHistory_curInfo.zan_info.btnEle.addEventListener("click", () => {
        menuBtnClick(commentHistory_curInfo.zan_info);
      }),
      commentHistory_curInfo.data.btnEle.addEventListener("click", () => {
        menuBtnClick(commentHistory_curInfo.data);
      }),
      commentHistory_curInfo.suki_info.btnEle.addEventListener("click", () => {
        menuBtnClick(commentHistory_curInfo.suki_info);
      }),
      (commentHistory_curInfo.zan_info.callback.clickItem =
        commentHistory_curInfo.data.callback.clickItem =
        commentHistory_curInfo.suki_info.callback.clickItem =
          (data) => {
            let url = data.url;
            if (!url) {
              const arr = data.desc.split(/(评论地址:)|(评论地址：)/);
              arr.length > 1 &&
                ((url = arr[arr.length - 1].trim()),
                (url = url.split("\n")[0]));
            }
            url && window.open(url);
          }),
      (commentHistory_curInfo.zan_info.callback.updateFinished =
        commentHistory_curInfo.data.callback.updateFinished =
        commentHistory_curInfo.suki_info.callback.updateFinished =
          (data) => {
            !(function itemImgLazyLoad({ box, ele, id, isLazyLoad = !1 }) {
              !ele &&
                id &&
                (ele = info.history.doms.options.ele.querySelector(
                  `[id='${id}']`
                )),
                box || (box = ele.parentElement.parentElement.parentElement);
              const lazyLoadClass = classList.imageLazyLoad;
              let imgArr = ele.querySelectorAll(`img.${lazyLoadClass}`);
              const boxRect = box.getBoundingClientRect();
              if (isLazyLoad)
                for (let i = 0; i < imgArr.length; i++)
                  imageLazyLoad({
                    box,
                    boxRect,
                    imgDom: imgArr[i],
                    imageClass: lazyLoadClass,
                    loadedClass: classList.imageLoaded,
                    dis: settings.imageLazyLoad.dis,
                  });
              else
                (imgArr = [].slice.call(imgArr)),
                  imgArr.forEach((img) => {
                    loadImage(img);
                  });
            })({ id: data.id });
          });
    let isListHidden = !1;
    const resizeHandleDebounce = (function debounce2(fn, duration = 300) {
      let flag = !0,
        timer = null;
      return function (...args) {
        flag && ((flag = !1), fn(...args)),
          clearTimeout(timer),
          (timer = setTimeout(() => {
            (flag = !0), fn(...args);
          }, duration));
      };
    })(() => {
      isListHidden
        ? (listBoxs.forEach((box) => {
            "none" === box.style.display && (box.style.display = "block");
          }),
          (isListHidden = !1))
        : (listBoxs.forEach((box) => {
            box.classList.contains("opened") || (box.style.display = "none");
          }),
          (isListHidden = !0));
    }, 1200);
    window.addEventListener("resize", resizeHandleDebounce);
  }
  function main() {
    useData(),
      (function createDoms() {
        const box = createEle({
            id: commentHistory_doms.box.id,
            title: commentHistory_doms.box.title,
          }),
          btn = createEle({
            className: commentHistory_doms.btn.class,
            title: commentHistory_doms.btn.title,
            box,
          }),
          options = createEle({
            className: commentHistory_doms.options.class,
            title: commentHistory_doms.options.title,
            box,
          });
        (btn.innerHTML = svg),
          (commentHistory_doms.box.ele = box),
          (commentHistory_doms.btn.ele = btn),
          (commentHistory_doms.options.ele = options);
      })(),
      (info.searchEle = createSearch({
        box: commentHistory_doms.box.ele,
        zIndex: commentHistory_curInfo.searchZIndex,
      })),
      settings.lazyLoadListPages.value.includes(info.pageType) ||
        (createHisBtnList(), bindListEvents(), setToSukiCallback()),
      (function autoSaveAll() {
        const interval = settings.autoSave.value;
        if (0 == +interval) return;
        if (
          0 === commentHistory_curInfo.zan_info.length &&
          0 === commentHistory_curInfo.data.length &&
          0 === commentHistory_curInfo.suki_info.length
        )
          return;
        const oldTime = info.saveData.autoSaveTime.value,
          curTime = info.saveData.autoSaveTime.base;
        let dis = +curTime - +oldTime;
        (dis = dis / 1e3 / 60 / 60 / 24),
          dis >= interval &&
            (commentHistory_curInfo.isListCreated ||
              (getData(),
              useData(),
              createHisBtnList(),
              bindListEvents(),
              setToSukiCallback()),
            autoSave(commentHistory_curInfo.zan_info),
            autoSave(commentHistory_curInfo.data),
            autoSave(commentHistory_curInfo.suki_info),
            message({
              title: "自动备份",
              msg: "已备份点赞评论 历史评论 评论收藏的数据",
            }),
            setValue({
              value: curTime,
              base: curTime,
              key: info.saveData.autoSaveTime.key,
              getVal: GM_getValue,
              setVal: GM_setValue,
            }));
      })(),
      (function commentHistory_bindEvents() {
        let startTimer,
          startTime = 1e3 * +settings.hiddenBtnTime.value,
          closeListTime = 1e3 * +settings.closeListTime.value;
        settings.isHiddenBtn.value &&
          startTime > 0 &&
          (startTimer = setTimeout(() => {
            commentHistory_doms.box.ele.style.opacity = 0;
          }, startTime));
        let timer,
          btnNoneTimer,
          listBoxs,
          btnClickNum = 0;
        const btnToNone = () => {
          !getMenuIsOpened() &&
            listBoxs &&
            listBoxs.forEach((box) => {
              box.style.display = "none";
            });
        };
        commentHistory_doms.box.ele.addEventListener("mouseenter", () => {
          clearTimeout(btnNoneTimer),
            (commentHistory_doms.box.ele.style.opacity = 1),
            timer && clearTimeout(timer),
            startTimer && clearTimeout(startTimer),
            commentHistory_curInfo.isListCreated ||
              (getData(),
              useData(),
              createHisBtnList(),
              bindListEvents(),
              setToSukiCallback(),
              (listBoxs = [
                commentHistory_curInfo.zan_info.listEle.parentElement,
                commentHistory_curInfo.data.listEle.parentElement,
                commentHistory_curInfo.suki_info.listEle.parentElement,
              ])),
            listBoxs &&
              listBoxs.forEach((box) => {
                "none" === box.style.display && (box.style.display = "block");
              });
        }),
          commentHistory_doms.box.ele.addEventListener("mouseleave", () => {
            settings.isHiddenBtn.value &&
              (commentHistory_doms.box.ele.style.opacity = 0),
              (settings.isRetractList.value || settings.isHiddenMenu.value) &&
                (closeListTime > 0
                  ? (timer = setTimeout(() => {
                      settings.isRetractList.value && closeAllList(),
                        settings.isHiddenMenu.value && openMenu(!1);
                    }, closeListTime))
                  : (settings.isRetractList.value && closeAllList(),
                    settings.isHiddenMenu.value && openMenu(!1))),
              (btnClickNum = 0),
              (btnNoneTimer = setTimeout(btnToNone, 1500));
          }),
          commentHistory_doms.btn.ele.addEventListener("click", () => {
            btnClickNum++,
              btnClickNum >= 10 && (document.comment_list_info = info),
              commentHistory_curInfo.isListCreated ||
                (getData(),
                useData(),
                createHisBtnList(),
                bindListEvents(),
                setToSukiCallback(),
                (listBoxs = [
                  commentHistory_curInfo.zan_info.listEle.parentElement,
                  commentHistory_curInfo.data.listEle.parentElement,
                  commentHistory_curInfo.suki_info.listEle.parentElement,
                ]),
                commentHistory_doms.box.ele.offsetHeight),
              listBoxs &&
                listBoxs.forEach((box) => {
                  "none" === box.style.display && (box.style.display = "block");
                });
            const isOpen = !getMenuIsOpened();
            isOpen &&
              commentHistory_curInfo.isListCreated &&
              listBoxs &&
              listBoxs.forEach((box) => {
                "none" === box.style.display && (box.style.display = "block");
              }),
              openMenu(isOpen);
          });
      })();
  }
  function customCommentSend_main() {
    let comment_v = info.commentVersion;
    const pageType = info.pageType,
      curInfo = info.customKeys,
      allDoms = info.doms,
      saveData = (curInfo.classList.v240713, info.saveData),
      history = info.history,
      classList = curInfo.classList;
    (curInfo.curClassList = classList[pageType]),
      "v240713" === comment_v &&
        (curInfo.curClassList =
          classList.v240713[pageType] || classList.v240713);
    let curClass = curInfo.curClassList,
      isVersion = !1;
    function getVersion() {
      let v;
      const versions = info.customKeys.classList.versions;
      for (let i = 0; i < versions.length; i++) {
        const item = versions[i];
        if (document.querySelector(item.selector)) {
          v = item.version;
          break;
        }
      }
      return (
        v || (v = versions[0].version),
        (info.commentVersion = v),
        (comment_v = v),
        v
      );
    }
    function setVar() {
      (comment_v = info.commentVersion),
        "v240713" === comment_v
          ? (curInfo.curClassList =
              classList.v240713[pageType] || classList.v240713)
          : "v231123" === comment_v &&
            (curInfo.curClassList = classList[pageType]),
        (curClass = curInfo.curClassList);
    }
    function isTargetDom(dom, value, type = "class") {
      if ("id" === type) {
        if (dom.id == value) return !0;
      } else if ("class" === type) {
        if (dom.classList.contains(value)) return !0;
      } else if ("ele" === type && dom.tagName.toLowerCase() == value)
        return !0;
      return !1;
    }
    function genericGetTextarea({ box = null, range = {} } = {}) {
      let textarea;
      if ("v240713" === comment_v) {
        const obj = curClass.textarea;
        if (obj.shadowRootPath) {
          textarea = getPathDom(
            obj,
            obj.shadowRootPath,
            allDoms.comment_container,
            !1
          );
        }
        return textarea && (curInfo.curDoms.textarea = textarea), textarea;
      }
      if (box) textarea = box.querySelector(`.${curClass.textarea}`);
      else {
        const focus = document.activeElement;
        textarea = focus.classList.contains(curClass.textarea) ? focus : null;
      }
      return textarea;
    }
    function getTextarea({ box = null, range = {} } = {}) {
      let textarea;
      if ("v240713" === comment_v) {
        const obj = curClass.textarea;
        if (
          (box &&
            obj.shadowRootPath_position &&
            (textarea = getPathDom(obj, obj.shadowRootPath_position, box)),
          !textarea && obj.focus)
        ) {
          const focus = getPathDom(
            obj.focus,
            obj.focus.shadowRootPath,
            allDoms.comment_container
          );
          focus &&
            (textarea = getPathDom(obj, obj.shadowRootPath_focus, focus));
        }
        return (
          textarea || (textarea = genericGetTextarea({ range })),
          textarea && (curInfo.curDoms.textarea = textarea),
          { box, value: textarea }
        );
      }
      return (
        curClass.focusDom &&
          (textarea =
            curClass.focusDom === curClass.box
              ? (box =
                  box ||
                  document.querySelector(
                    `.${curClass.box}.${classList.focus}`
                  ) ||
                  document).querySelector(`.${curClass.textarea}`)
              : box
              ? box.querySelector(`.${curClass.textarea}.${classList.focus}`)
              : document.querySelector(
                  `.${curClass.textarea}.${classList.focus}`
                )),
        (textarea = textarea || genericGetTextarea({ box })),
        textarea && (curInfo.curDoms.textarea = textarea),
        { box, value: textarea }
      );
    }
    function getContainer(dom, type = "class", num = 4) {
      if ("v240713" === comment_v) {
        let box,
          positionEle = dom.offsetParent,
          obj = curClass.sendPositionEle;
        if (positionEle && obj) {
          let flag = isTargetDom(positionEle, obj.value, obj.type);
          flag
            ? (box = positionEle)
            : ((positionEle = positionEle.offsetParent),
              (flag = isTargetDom(positionEle, obj.value, obj.type)),
              flag && (box = positionEle));
        }
        return (
          box || (box = searchUpDom(dom, obj.value, obj.type, num)),
          (box = box || positionEle || dom),
          (curInfo.curDoms.box = box),
          box
        );
      }
      let box = searchUpDom(dom, curClass.box, type, num);
      return (
        (box = box || dom.offsetParent || dom), (curInfo.curDoms.box = box), box
      );
    }
    function getBtn(box) {
      if ("v240713" === comment_v) {
        const btn = getPathDom(
          curClass.sendBtn,
          curClass.sendBtn.shadowRootPath_position,
          box
        );
        return btn && (curInfo.curDoms.btn = btn), btn;
      }
      let btn = !1,
        dom = box.querySelector(`.${curClass.sendBtn}`);
      if (dom) btn = dom;
      else if (((dom = box.querySelector("button")), dom)) btn = dom;
      else {
        const divArr = box.querySelectorAll("div");
        for (let i = 0; i < divArr.length; i++) {
          const div = divArr[i],
            className = div.className;
          if (
            ["send", "submit", "btn", "button"].some((item) =>
              className.includes(item)
            )
          ) {
            btn = div;
            break;
          }
        }
      }
      return btn && (curInfo.curDoms.btn = btn), btn;
    }
    function getSendDoms({ textarea = null, btn = null, range = {} } = {}) {
      let box, doms;
      if ("v240713" === comment_v)
        return (
          textarea || (textarea = getTextarea().value),
          textarea
            ? ((box = getContainer(textarea)),
              (doms = { box, textarea, btn: getBtn(box) }),
              (curInfo.curDoms = doms),
              doms)
            : {}
        );
      if (textarea || btn)
        !textarea && btn
          ? ((box = getContainer(btn)),
            (doms = {
              box,
              textarea: (textarea = getTextarea({ box }).value),
              btn,
            }))
          : textarea &&
            !btn &&
            ((box = getContainer(textarea)),
            (doms = { box, textarea, btn: getBtn(box) }));
      else {
        const result = getTextarea();
        if (((box = result.box), !(textarea = result.value))) return {};
        (box = box || getContainer(textarea)),
          (doms = { box, textarea, btn: getBtn(box) });
      }
      return (curInfo.curDoms = doms), doms;
    }
    function verifyKeys(e, key, keys, canShiftEnter = !0) {
      if (!keys) return console.log("未设置快捷键"), !1;
      let keyArr = keys.split("+");
      if (key && key !== keyArr[keyArr.length - 1]) return;
      const keyObj = {
        control: e.ctrlKey,
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey,
        meta: e.metaKey,
        win: e.metaKey,
        window: e.metaKey,
      };
      if (
        !canShiftEnter &&
        "enter" === key &&
        keyObj.shift &&
        !keyObj.control &&
        !keyObj.ctrl &&
        !keyObj.alt &&
        !keyObj.meta &&
        !keyObj.win &&
        !keyObj.window
      )
        return !1;
      for (let i = 0; i < keyArr.length; i++) {
        const item = keyArr[i];
        if (void 0 !== keyObj[item] && !keyObj[item]) return !1;
      }
      return !0;
    }
    function getCommentInfo(allData = {}) {
      const location = window.location,
        host = location.hostname,
        path = location.pathname.split("/"),
        pageType = getBiliPageType(),
        data = {
          id: new Date().getTime(),
          pageType,
          url: location.href,
          ...allData.data,
        },
        longTime = formatDate({
          timestamp: data.id,
          isExact: !0,
          delimiter2: "时分秒",
        }),
        shortTime = formatDate({ timestamp: data.id }),
        pageTitle = document.head.querySelector("title").innerText;
      let listTitle;
      if ("视频" === pageType) {
        const bv = path.find((i) => "BV" === i.slice(0, 2)) || "",
          h1 = document.querySelector("h1");
        (data.bv = bv),
          (listTitle = h1 ? h1.innerText : pageTitle.split("_哔哩哔哩")[0]);
      } else if ("主页" === pageType)
        listTitle = pageTitle.split("-哔哩哔哩")[0];
      else if ("动态" === pageType)
        listTitle = pageTitle.split("的动态")[0] + "的动态";
      else if ("专栏" === pageType) {
        const h1 = document.querySelector("h1");
        listTitle = h1 ? h1.innerText : host;
      } else
        listTitle =
          "番剧" === pageType
            ? pageTitle.split("-番剧")[0]
            : "消息" === pageType
            ? "消息中心"
            : host;
      let ttTmp = settings.titleFormat.value;
      (ttTmp = ttTmp
        .replace("[评论日期]", shortTime)
        .replace("[评论来源]", pageType)
        .replace("[网页标题]", listTitle)
        .replace("[评论内容]", data.value)),
        (data.desc = "评论的相关信息:"),
        "收藏" === allData.originType
          ? (data.desc += "\n收藏日期: " + longTime)
          : "点赞" === allData.originType
          ? (data.desc += "\n点赞日期: " + longTime)
          : (data.desc += "\n评论日期: " + longTime),
        (data.desc += "\n评论来源: " + data.pageType),
        "视频" === pageType
          ? ((data.desc += "\n视频标题: " + listTitle),
            (data.desc += "\n视频ID: " + data.bv),
            (ttTmp = ttTmp.replace("[视频ID]", data.bv)))
          : ((ttTmp = ttTmp.replace("[视频ID]", "")),
            "主页" === pageType
              ? (data.desc += "\n主页名称: " + listTitle)
              : "动态" === pageType
              ? (data.desc += "\n动态名称: " + listTitle)
              : "专栏" === pageType
              ? (data.desc += "\n专栏名称: " + listTitle)
              : "番剧" === pageType &&
                (data.desc += "\n番剧名称: " + listTitle));
      const tagStr = getTags() || "";
      if (
        ("专栏" === pageType
          ? (tagStr && (data.desc += "\n专栏标签: " + tagStr),
            (ttTmp = ttTmp.replace("[视频标签]", tagStr)))
          : (tagStr && (data.desc += "\n视频标签: " + tagStr),
            (ttTmp = ttTmp.replace("[视频标签]", tagStr))),
        data.user
          ? ((data.desc += `\n评论用户: ${data.user}`),
            (ttTmp = ttTmp.replace("[评论用户]", data.user)))
          : null !== data.user
          ? ((data.desc += "\n评论用户: 自己"),
            (ttTmp = ttTmp.replace("[评论用户]", "自己")))
          : (ttTmp = ttTmp.replace("[评论用户]", "")),
        data.uid && (data.desc += `\nUID: ${data.uid}`),
        allData.replyUser
          ? ((data.desc += `\n回复用户: ${allData.replyUser}`),
            (ttTmp = ttTmp.replace("[回复用户]", allData.replyUser)),
            allData.replyUid && (data.desc += `\nUID: ${allData.replyUid}`))
          : (ttTmp = ttTmp.replace("[回复用户]", "")),
        allData.replyText && (data.desc += `\n回复评论: ${allData.replyText}`),
        allData.imgArr && allData.imgArr.length > 0)
      )
        if (1 === allData.imgArr.length)
          data.desc += "\n图片地址: " + allData.imgArr[0];
        else {
          const str = allData.imgArr.join("\n");
          data.desc += "\n图片地址: \n" + str;
        }
      return (
        allData.posterUser
          ? ((data.desc += `\n楼主名称: ${allData.posterUser}`),
            (ttTmp = ttTmp.replace("[楼主名称]", allData.posterUser)))
          : (ttTmp = ttTmp.replace("[楼主名称]", "")),
        allData.posterUid && (data.desc += `\n楼主UID: ${allData.posterUid}`),
        allData.posterText
          ? ((data.desc += `\n楼主评论: ${allData.posterText}`),
            (ttTmp = ttTmp.replace("[楼主评论]", allData.posterText)))
          : (ttTmp = ttTmp.replace("[楼主评论]", "")),
        (data.desc += "\n评论地址: " + data.url),
        (data.title = ttTmp),
        data
      );
    }
    function getTags() {
      if (!curClass.tagObj) return;
      let tagBox = info.doms.tagBox;
      const curTagObj = curClass.tagObj[pageType] || curClass.tagObj["视频"];
      if (
        !tagBox &&
        ((tagBox = document.querySelector(`${curTagObj.box.selector}`)),
        !tagBox)
      )
        return void console.log("未获取到标签元素");
      info.doms.tagBox = tagBox;
      let tagArr = tagBox.querySelectorAll(curTagObj.btn.selector);
      if (tagArr.length > 0) {
        (tagArr = [].slice.call(tagArr)),
          tagArr.forEach((item, i) => {
            tagArr[i] = item.innerText;
          });
        return tagArr.join("、");
      }
    }
    function getText(dom) {
      let nodeArr, image;
      const allData = { data: {}, imgArr: [] };
      let text = "";
      const pType = pageType,
        classList = curInfo.classList,
        curClass = curInfo.curClassList,
        replaceObj = {};
      if ("v240713" === comment_v) {
        const obj = curClass.replyText,
          contentDom = getPathDom(obj, obj.shadowRootPath_reply, dom);
        if (!contentDom)
          return (
            console.log("未获取到评论内容的元素"),
            (allData.data.value = text),
            allData
          );
        const imgObj = curClass.images;
        (image = getPathDom(imgObj, imgObj.shadowRootPath_reply, dom)),
          (nodeArr = contentDom.childNodes);
      } else nodeArr = dom.childNodes;
      let imgNum = 0,
        iconNum = 0;
      if ("消息" === pType) {
        text += dom.textContent;
        const orginalReply = dom.parentElement.querySelector(
          "." + curClass.orginalReply
        );
        orginalReply && (allData.replyText = orginalReply.textContent);
      } else {
        for (let i = 0; i < nodeArr.length; i++) {
          const node = nodeArr[i],
            nClassList = node.classList,
            tag = node.nodeName ? node.nodeName.toLowerCase() : "";
          if (
            !nClassList ||
            (!nClassList.contains(classList.noteIcon) &&
              !nClassList.contains(classList.commentTop))
          )
            if ("br" === tag) text += "\n";
            else if ("img" === tag) {
              let className = "img-item",
                src = node.src,
                flag = node.alt;
              "//" === src.slice(0, 2) &&
                (src = window.location.protocol + src);
              const imgSmall = curClass.smallEmoji || classList.smallEmoji,
                imgBig = curClass.largeEmoji || classList.largeEmoji,
                icon = classList.icon;
              let isEmoji = !1;
              if ("v240713" === comment_v) {
                const style = node.getAttribute("style");
                style.includes(curClass.smallEmojiSize)
                  ? ((className = classList.smallEmoji), (isEmoji = !0))
                  : style.includes(curClass.largeEmojiSize)
                  ? ((className = classList.largeEmoji), (isEmoji = !0))
                  : nClassList && nClassList.contains(icon)
                  ? (iconNum++,
                    (className = icon + "-item"),
                    (flag = `[icon--${iconNum}]`))
                  : (imgNum++,
                    (flag = `[image--${imgNum}]`),
                    allData.imgArr.push(src));
              }
              nClassList &&
                "v240713" !== comment_v &&
                (nClassList.contains(imgSmall)
                  ? ((className = classList.smallEmoji), (isEmoji = !0))
                  : nClassList.contains(imgBig)
                  ? ((className = classList.largeEmoji), (isEmoji = !0))
                  : nClassList.contains(icon)
                  ? (iconNum++,
                    (className = icon + "-item"),
                    (flag = `[icon--${iconNum}]`))
                  : (imgNum++,
                    (flag = `[image--${imgNum}]`),
                    allData.imgArr.push(src)));
              let value = `<img class="${className}" src="${src}" alt="${flag}">`;
              (replaceObj[flag] = value),
                isEmoji && (info.saveData.emojiList.value[flag] = value),
                (text += flag);
            } else if ("a" === tag) {
              if ("v240713" === comment_v) {
                const search = curClass.searchDataset;
                if (
                  node.dataset &&
                  node.dataset[search.name] === search.value
                ) {
                  text += node.textContent;
                  continue;
                }
              } else {
                const search = classList.search;
                if (nClassList.contains(search)) {
                  text += node.textContent;
                  continue;
                }
              }
              let url = node.href || node.dataset.url || window.location.href;
              if ("v240713" === comment_v) {
                const dataset = curClass.replyUserDataset;
                node.dataset &&
                  node.dataset[dataset.name] === dataset.value &&
                  (allData.replyUser = node.textContent.replace("@", ""));
              } else
                nClassList &&
                  nClassList.contains(curClass.replyUser.class) &&
                  (allData.replyUser = node.textContent.replace("@", ""));
              if (node.dataset) {
                let uid;
                if ("v240713" === comment_v) {
                  const dataset = curClass.replyUserDataset;
                  uid = node.dataset[dataset.uid];
                } else uid = node.dataset[curClass.replyUser.uid];
                uid &&
                  ((url = info.personalHome + uid), (allData.replyUid = uid));
              }
              "//" === url.slice(0, 2) &&
                (url = window.location.protocol + url);
              const className = "a-item",
                flag = `[${node.textContent}]`,
                value = `<a class="${className}" href="${
                  url || ""
                }" target="_blank" title="点击跳转到链接地址">${
                  node.textContent
                }</a>`;
              (replaceObj[flag] = value), (text += flag);
            } else text += node.textContent;
        }
        if ("v240713" !== comment_v) {
          image = dom.parentElement.parentElement.querySelector(
            "." + curInfo.classList.image
          );
        }
        if (image) {
          const imgs = image.querySelectorAll("img");
          if (0 === imgs.length) return;
          for (let i = 0; i < imgs.length; i++) {
            imgNum++;
            const img = imgs[i];
            let src = img.src,
              br = "";
            "//" === src.slice(0, 2) && (src = window.location.protocol + src),
              0 === i && text && (br = "<br>");
            const bigImgUrl = minImgToBigImg(src);
            allData.imgArr.push(bigImgUrl);
            const flag = `[image--${imgNum}]`;
            let value;
            if (settings.imageLazyLoad.value) {
              const lazyClass = info.history.classList.imageLazyLoad,
                wh = [img.width, img.height];
              let style = getWhStyle(src, wh, wh[0] / wh[1]);
              style = style ? `style="${style}"` : "";
              value = `${br}<img class="img-item ${lazyClass}" ${style} src="${info.history.lazyBaseImage}" data-src="${src}" data-bigimg="${bigImgUrl}" alt="${img.alt}" title="点击查看原图">`;
            } else
              value = `${br}<img class="img-item" src="${src}" data-bigimg="${bigImgUrl}" alt="${img.alt}" title="点击查看原图">`;
            (replaceObj[flag] = value), (text += flag);
          }
        }
      }
      return (
        (allData.data.value = text),
        0 !== Object.keys(replaceObj).length &&
          (allData.data.replaceObj = replaceObj),
        allData
      );
    }
    function getUserDom({ replyDom, replyBox, isSub } = {}) {
      const curClass = curInfo.curClassList;
      let userDom;
      if ("v240713" === comment_v) {
        const obj = curClass.user;
        return (
          (userDom = getPathDom(obj, obj.shadowRootPath_reply, replyDom)),
          userDom
        );
      }
      if (replyBox)
        userDom = isSub
          ? replyBox.querySelector("." + curClass.subUser)
          : replyBox.querySelector("." + curClass.user);
      else {
        let box = replyDom.parentElement;
        userDom = isSub
          ? (replyBox = box.parentElement).querySelector("." + curClass.subUser)
          : (replyBox = box.parentElement.parentElement).querySelector(
              "." + curClass.user
            );
      }
      return userDom;
    }
    function getPosterInfo(dom, isUpdateUrl = !1) {
      if (!["视频", "番剧", "动态", "主页", "专栏"].includes(pageType)) return;
      const replyItem = searchUpDom(dom, curClass.replyItem, "class", 7);
      if (!replyItem) return void console.log("未获取到该楼的元素");
      const replyBox = replyItem.querySelector(`.${curClass.poster}`);
      if (!replyBox) return void console.log("未获取到楼主的元素");
      let reply, userDom;
      if (
        ((userDom = replyBox.querySelector(`.${curClass.user}`)),
        (reply = replyBox.querySelector(`.${curClass.reply}`)),
        !reply)
      )
        return void console.log("未获取到评论内容的元素");
      const data = {};
      if (
        ((data.posterText = domToText(reply)),
        userDom
          ? ((data.posterUser = userDom.innerText),
            (data.posterUid = userDom.dataset[curClass.replyUser.uid]))
          : console.log("未获取到楼主信息的元素"),
        isUpdateUrl)
      ) {
        const location = window.location;
        let curUrl = location.href;
        const rootId = userDom.dataset.rootReplyId;
        if (rootId) {
          if (location.hash) {
            const urlArr = curUrl.split("#reply");
            1 === urlArr.length
              ? (curUrl += `#reply${rootId}`)
              : (curUrl = urlArr[0] + "#reply" + rootId);
          } else curUrl += `#reply${rootId}`;
          data.newUrl = curUrl;
        }
      }
      return data;
    }
    function getMsgPageUserInfo(userDom) {
      const data = {};
      data.user = userDom.textContent;
      const userUrlArr = userDom.querySelector("a").href.split("/");
      return userUrlArr && (data.uid = userUrlArr[userUrlArr.length - 1]), data;
    }
    function getReplyDom(replyBox, isSub) {
      let replyDom,
        data = {};
      return (
        (replyDom = isSub
          ? replyBox.querySelector("." + curClass.subReply)
          : replyBox.querySelector("." + curClass.reply)),
        replyDom ||
          ((replyDom = document.activeElement.parentElement), (data.flag = 2)),
        (data.value = replyDom),
        data
      );
    }
    function addComment({
      flag = "list",
      info,
      doms,
      event,
      replyDom,
      replyBox,
      isSub,
      originType,
    } = {}) {
      let allData = { data: {} };
      const curClass = curInfo.curClassList;
      let data;
      if (replyDom || replyBox || event) {
        if ("v240713" === comment_v) {
          const obj = curClass.reply,
            replyDomList = getPathDom(
              obj,
              obj.shadowRootPath,
              allDoms.comment_container,
              !0
            );
          if (
            (replyDomList &&
              (replyDom = replyDomList.find((dom) =>
                (function isInsideEle(event, dom) {
                  const rect = dom.getBoundingClientRect(),
                    x = event.clientX,
                    y = event.clientY;
                  return (
                    x >= rect.left &&
                    x <= rect.right &&
                    y >= rect.top &&
                    y <= rect.bottom
                  );
                })(event, dom)
              )),
            !replyDom)
          )
            return void console.log("评论的文本区域的元素获取失败");
        }
        if (!replyDom && replyBox && "v240713" !== comment_v) {
          const replyDomInfo = getReplyDom(replyBox, isSub);
          if (
            ((replyDom = replyDomInfo.value),
            2 === replyDomInfo.flag &&
              (console.log("评论的文本区域的元素获取失败"),
              (allData.data.user = null)),
            !replyDom)
          )
            return;
        }
        const userDom = getUserDom({ replyDom, replyBox, isSub });
        if (userDom)
          if ("消息" === pageType) {
            const userInfo = getMsgPageUserInfo(userDom);
            (allData.data.user = userInfo.user),
              (allData.data.uid = userInfo.uid || "");
          } else {
            const location = window.location;
            let rootId,
              curUrl = location.href;
            if (
              ((allData.data.user = userDom.innerText),
              (allData.data.url = curUrl),
              "v240713" === comment_v
                ? (allData.data.uid = userDom.dataset[curClass.user.uid])
                : ((allData.data.uid = userDom.dataset[curClass.replyUser.uid]),
                  (rootId = userDom.dataset.rootReplyId)),
              rootId)
            ) {
              if (location.hash) {
                const urlArr = curUrl.split("#reply");
                1 === urlArr.length
                  ? (curUrl += `#reply${rootId}`)
                  : (curUrl = urlArr[0] + "#reply" + rootId);
              } else curUrl += `#reply${rootId}`;
              allData.data.url = curUrl;
            }
          }
        else console.log("评论用户的数据获取失败"), (allData.data.user = null);
        allData.originType = originType || "收藏";
        const commentInfo = getText(replyDom);
        if (
          ((allData.replyUser = commentInfo.replyUser),
          (allData.replyUid = commentInfo.replyUid),
          (allData.replyText = commentInfo.replyText),
          (allData.imgArr = commentInfo.imgArr),
          (allData.data.value = commentInfo.data.value),
          commentInfo.data.replaceObj &&
            (allData.data.replaceObj = commentInfo.data.replaceObj),
          "消息" !== pageType && isSub && "v240713" !== comment_v)
        ) {
          const posterData = getPosterInfo(replyDom);
          posterData &&
            ((allData.posterText = posterData.posterText),
            (allData.posterUser = posterData.posterUser),
            (allData.posterUid = posterData.posterUid));
        }
        data = getCommentInfo(allData);
      } else {
        if (((allData.originType = "评论"), "消息" === pageType)) {
          replyDom = getReplyDom(
            (replyBox = curInfo.curDoms.box.parentElement)
          ).value;
          const userInfo = getMsgPageUserInfo(getUserDom({ replyBox })),
            replyUserInfo = getText(replyDom);
          (allData.replyUser = userInfo.user),
            (allData.replyUid = userInfo.uid || ""),
            (allData.replyText = replyUserInfo.data.value);
        }
        allData.data = {
          value:
            doms.textarea.value ||
            domToText(doms.textarea) ||
            doms.textarea.textContent,
        };
        let ph = doms.textarea.placeholder;
        if (!ph) {
          const textarea = doms.textarea;
          if (textarea.classList.contains("brt-editor")) {
            const phDom = textarea.parentElement.querySelector(
              curClass.textarea.placeholder.selector
            );
            phDom && (ph = phDom.innerText);
          }
        }
        ph &&
          ph.includes("回复 @") &&
          ph.includes(" : ") &&
          (allData.replyUser = ph.replace("回复 @", "").replace(" : ", ""));
        const posterData = getPosterInfo(doms.textarea, !0);
        posterData &&
          ((allData.posterText = posterData.posterText),
          (allData.posterUser = posterData.posterUser),
          (allData.posterUid = posterData.posterUid),
          posterData.newUrl && (allData.data.url = posterData.newUrl)),
          (data = getCommentInfo(allData));
      }
      if (history.isListCreated) {
        const listEle = info.listEle;
        if (
          (addItem({ info, data, isGetTt: !1 }),
          allData.imgArr && allData.imgArr.length > 0)
        ) {
          const item = listEle.querySelector(`[id='${data.id}']`);
          if (!item) return void console.log("未获取到新添加的评论内容的元素");
          const lazyLoadClass = history.classList.imageLazyLoad;
          let imgs = item.querySelectorAll(`img.${lazyLoadClass}`);
          (imgs = [].slice.call(imgs)),
            imgs.forEach((img) => {
              (img.src = img.dataset.src), img.classList.remove(lazyLoadClass);
            });
        }
        return !0;
      }
      {
        data.id = new Date().getTime();
        const curObj = saveData[flag];
        if (!curObj) return;
        const curList = getValue_getValue({
          base: curObj.base,
          key: curObj.key,
          valType: curObj.valType,
          getVal: GM_getValue,
          setVal: GM_setValue,
        });
        return (
          curList.push(data),
          console.log("添加一项", data),
          setValue({
            value: curList,
            base: curList,
            key: info.saveName,
            getVal: GM_getValue,
            setVal: GM_setValue,
          }),
          !0
        );
      }
    }
    function isLikeBtn(dom) {
      if (!dom.classList) return { value: !1 };
      const tag = dom.tagName.toLowerCase();
      let parent,
        replyBox,
        flag = !1,
        isSub = !1;
      const curClass = curInfo.curClassList;
      if ("消息" === pageType) {
        if ("path" === tag) parent = dom.parentElement.parentElement;
        else if ("svg" === tag) parent = dom.parentElement;
        else {
          if ("button" !== tag) return { value: !1 };
          parent = dom;
        }
        if (parent.classList.contains(curClass.liked)) return { value: !1 };
        parent.classList.contains(curClass.likeBtn) &&
          curClass.likeText &&
          parent.innerText.includes(curClass.likeText) &&
          ((flag = !0),
          (replyBox = parent.parentElement.parentElement.parentElement));
      } else {
        if ("path" === tag)
          parent = dom.parentElement.parentElement.parentElement;
        else if ("svg" === tag) parent = dom.parentElement.parentElement;
        else {
          if ("span" !== tag) return { value: !1 };
          dom.classList.contains(curClass.likeBtn)
            ? ((parent = dom), (flag = !0))
            : dom.classList.contains(curClass.subLikeBtn)
            ? ((parent = dom), (flag = isSub = !0))
            : (parent = dom.parentElement);
        }
        let likeDom = parent.querySelector("i");
        if (likeDom && likeDom.classList.contains(curClass.liked))
          return { value: !1 };
        parent.classList.contains(curClass.likeBtn)
          ? ((flag = !0),
            (replyBox = parent.parentElement.parentElement.parentElement))
          : parent.classList.contains(curClass.subLikeBtn) &&
            ((flag = isSub = !0),
            (replyBox = parent.parentElement.parentElement));
      }
      return { value: flag, replyBox, isSub };
    }
    function dblClickHandle(e) {
      if (
        (isVersion || (getVersion(), setVar(), (isVersion = !0)),
        "v240713" === comment_v)
      ) {
        if (!verifyKeys(e, null, settings.addItemKeys.value)) return;
        return void (
          addComment({
            flag: "sukiList",
            info: info.history.suki_info,
            event: e,
            originType: "收藏",
          }) && message({ title: "收藏", msg: "已添加评论到收藏列表" })
        );
      }
      const curClass = curInfo.curClassList;
      let isSub = !1,
        target = e.target,
        flag = target.classList.contains(curClass.reply);
      flag ||
        curClass.reply === curClass.subReply ||
        ((flag = target.classList.contains(curClass.subReply)), (isSub = flag));
      let replyDom = flag ? target : null;
      if (
        (replyDom ||
          ((flag = target.parentElement.classList.contains(curClass.subReply)),
          flag
            ? curClass.reply !== curClass.subReply && (isSub = !0)
            : (flag = target.parentElement.classList.contains(curClass.reply)),
          (replyDom = flag ? target.parentElement : null)),
        replyDom ||
          ((replyDom = target.querySelector(`.${curClass.subReply}`)),
          replyDom
            ? curClass.reply !== curClass.subReply && (isSub = !0)
            : (replyDom = target.querySelector(`.${curClass.reply}`)),
          (flag = !!replyDom)),
        replyDom && !isSub && curClass.reply === curClass.subReply)
      ) {
        let sub = replyDom.parentElement.classList.contains(curClass.subReplyP);
        isSub = isSub || sub;
      }
      if (flag) {
        if (!verifyKeys(e, null, settings.addItemKeys.value)) return;
        addComment({
          flag: "sukiList",
          info: info.history.suki_info,
          replyDom,
          isSub,
          originType: "收藏",
        }) && message({ title: "收藏", msg: "已添加评论到收藏列表" });
      }
    }
    function handleKeyDown(e) {
      const key = (function getKeyDown(e) {
        const keyCode = e.keyCode || e.which || e.charCode;
        let key = e.key || String.fromCharCode(keyCode);
        return (key = key.toLowerCase()), console.log("按下", key), key;
      })(e);
      if (!key) return;
      if (!verifyKeys(e, key, settings.sendKeys.value, !1)) return;
      let doms;
      if ("v240713" === comment_v) {
        let textarea = getTextarea().value;
        if (!textarea) return;
        if (
          textarea.className.includes("edit") &&
          !textarea.className.includes("editor")
        )
          return;
        (doms = getSendDoms({ textarea })), (curInfo.curDoms = doms);
      } else doms = getSendDoms();
      const btn = doms.btn;
      btn &&
        (document.activeElement.blur(),
        doms.textarea.blur(),
        (curInfo.isBtnClickEvent = !1),
        btn.click(),
        addComment({ flag: "list", info: info.history.data, doms }),
        setTimeout(() => {
          curInfo.isBtnClickEvent = !0;
        }, 0));
    }
    function clickBtn() {
      curInfo.isBtnClickEvent &&
        addComment({
          flag: "list",
          info: info.history.data,
          doms: curInfo.curDoms,
        });
    }
    function clickHandle(e) {
      if (
        (isVersion || (getVersion(), setVar(), (isVersion = !0)),
        "v240713" === comment_v)
      ) {
        let textarea = getTextarea().value;
        if (textarea) {
          if (
            textarea.className.includes("edit") &&
            !textarea.className.includes("editor")
          )
            return;
          if (textarea === curInfo.oldTextarea) return;
          let doms = curInfo.curDoms;
          return (
            (curInfo.oldTextarea = textarea),
            (curInfo.curDoms = getSendDoms({ textarea })),
            (doms = curInfo.curDoms),
            doms.btn
              ? ((curInfo.oldSendBtn = doms.btn),
                void doms.btn.addEventListener("click", clickBtn, !0))
              : void (curInfo.oldTextarea = null)
          );
        }
        return;
      }
      let target = e.target;
      const result = isLikeBtn(target);
      if (result.value)
        return void addComment({
          flag: "zanList",
          info: info.history.zan_info,
          replyBox: result.replyBox,
          isSub: result.isSub,
          originType: "点赞",
        });
      let textarea,
        flag = "textarea" === target.tagName.toLowerCase();
      if (
        (flag || ((textarea = genericGetTextarea()), (flag = flag || textarea)),
        flag)
      ) {
        if (
          target.className.includes("edit") &&
          !target.className.includes("editor")
        )
          return;
        if (
          target === curInfo.oldTextarea ||
          (textarea === curInfo.oldTextarea && textarea)
        )
          return;
        let doms = curInfo.curDoms;
        return (
          (curInfo.oldTextarea = textarea || target),
          (curInfo.curDoms = getSendDoms({ textarea: curInfo.oldTextarea })),
          (doms = curInfo.curDoms),
          doms.btn
            ? ((curInfo.oldSendBtn = doms.btn),
              void doms.btn.addEventListener("click", clickBtn, !0))
            : void (curInfo.oldTextarea = null)
        );
      }
      if (
        ((flag = target.classList.contains(curClass.sendBtn)),
        flag ||
          ((target = target.parentElement),
          (flag = target.classList.contains(curClass.sendBtn))),
        flag && curInfo.oldSendBtn !== target)
      ) {
        curInfo.oldSendBtn = target;
        const doms = getSendDoms({ btn: target });
        if (!doms.textarea) return void console.log("评论的文本框获取失败");
        (curInfo.curDoms = doms), clickBtn();
      }
    }
    function msgClickHandle(e) {
      if (
        (isVersion || (getVersion(), setVar(), (isVersion = !0)),
        !curInfo.isBtnClickEvent)
      )
        return;
      const target = e.target,
        result = isLikeBtn(target);
      if (result.value)
        addComment({
          flag: "zanList",
          info: info.history.zan_info,
          replyBox: result.replyBox,
          isSub: result.isSub,
          originType: "点赞",
        });
      else if ("button" === target.tagName.toLowerCase()) {
        const btn = target,
          doms = getSendDoms({ btn });
        if (!doms.textarea) return void console.log("评论的文本框获取失败");
        if (!doms.textarea.value) return;
        (curInfo.oldSendBtn = btn),
          addComment({ flag: "list", info: info.history.data, doms });
      }
    }
    !(function init() {
      getVersion(),
        setVar(),
        (function getDoms() {
          "v240713" === comment_v &&
            (allDoms.comment_container = document.querySelector(
              curClass.container.selector
            ));
        })();
      const clickFn = "消息" === pageType ? msgClickHandle : clickHandle;
      document.addEventListener("click", clickFn, !0),
        document.addEventListener("dblclick", dblClickHandle, !0),
        document.addEventListener("keydown", handleKeyDown, !0);
    })();
  }
  function bilibili_comment_history_main() {
    const pageType = getBiliPageType();
    if ("其他" === pageType) return;
    const id = info.history.doms.box.id;
    if (!document.querySelector("#" + id)) {
      if ("动态" === pageType) {
        const curClass = info.customKeys.classList[pageType];
        if (curClass.cjDetailsId) {
          if (document.querySelector("#" + curClass.cjDetailsId)) return;
        }
      }
      console.log("当前页面:", pageType),
        (info.pageType = pageType),
        getData(),
        addCss(
          (function getCss() {
            const position = css_settings.position.value.split(/,|，|x|X/),
              pBase = css_settings.position.base.split(/,|，/);
            let left, right;
            return (
              1 === position.length
                ? (left = right = +position[0].trim() || +pBase[0].trim())
                : ((left = +position[0].trim() || +pBase[0].trim()),
                  (right = +position[1].trim() || +pBase[1].trim())),
              `\n#${doms.box.id} {\n  height:0;\n  opacity:${
                +css_settings.hiddenBtnTime.value <= 0 ? 0 : 1
              };\n  transform:scale(${
                css_settings.scale.value
              });\n  transform-origin:left top;\n  transition:ease 1s 3s all;\n  display:flex;\n  position:fixed;\n  z-index:11000;\n  left:${left}px;\n  top:${right}px;\n  font-family:math;\n  gap:${Math.floor(
                curInfo.height / 4
              )}px;\n}\n#${
                doms.box.id
              }:hover {\n  transition: ease 1s all;\n}\n#${doms.box.id} .${
                doms.btn.class
              } {\n  width:${curInfo.width}px;\n  height:${
                curInfo.height
              }px;\n  background:#fff;\n  border:1px solid #ccc;\n  border-radius:6px;\n  box-sizing:border-box;\n  cursor:pointer;\n}\n#${
                doms.box.id
              } .${doms.btn.class}:hover {\n  border:1px solid ${
                curInfo.color.main
              };\n}\n#${doms.box.id} .${
                doms.options.class
              } {\n  position:relative;\n  display:flex;\n  height:${
                curInfo.height
              }px;\n  line-height:${curInfo.height + 1}px;\n  font-size:${
                curInfo.height - 9
              }px;\n  background:#fff;\n  border:2px solid ${
                curInfo.color.bd
              };\n  border-radius:${Math.floor(
                curInfo.height / 6
              )}px;\n  box-sizing:border-box;\n  padding:0 ${Math.floor(
                curInfo.height / 2
              )}px;\n  gap:${Math.floor(
                curInfo.height / 2
              )}px;\n  transition:opacity 0.5s,transform 0.5s;\n  transform:scaleX(0);\n  transform-origin:left top;\n}\n#${
                doms.box.id
              } .${
                doms.options.class
              }::before {\n  content:"";\n  position:absolute;\n  bottom:-12px;\n  left:0px;\n  display:block;\n  width:100%;\n  height:14px;\n  background:transparent;\n}\n#${
                doms.box.id
              } .${doms.btn.class}.opened {\n  border:1px solid ${
                curInfo.color.main
              };\n}\n#${doms.box.id} .${
                doms.options.class
              }.opened {\n  transform:scaleX(1);\n}\n#${
                doms.box.id
              } img {\n  min-width: initial;\n  max-width: initial;\n  min-height: initial;\n  max-height: initial;\n  display: inline-block;\n  margin: 0;\n}\n#${
                doms.box.id
              } .icon-item,\n#${doms.box.id} .emoji-small {\n  width: ${
                curInfo.fontSize + 5
              }px;\n  height: ${
                curInfo.fontSize + 5
              }px;\n  vertical-align: -5px;\n  border-radius: initial;\n}\n#${
                doms.box.id
              } .emoji-large {\n  width: ${
                3 * curInfo.fontSize + 5
              }px;\n  height: ${
                3 * curInfo.fontSize + 5
              }px;\n  vertical-align: text-bottom;\n    border-radius: initial;\n}\n#${
                doms.box.id
              } .img-item {\n  min-width: ${
                css_history.imgSize.w[0]
              }px;\n  max-width: ${
                css_history.imgSize.w[1]
              }px;\n  min-height: ${
                css_history.imgSize.h[0]
              }px;\n  max-height: ${
                css_history.imgSize.h[1]
              }px;\n  display: inline-block;\n  margin: 5px 5px 0 0;\n  border-radius: 6px;\n  cursor: zoom-in;\n  object-fit: cover;\n  background: #eaf7ff;\n}\n#${
                doms.box.id
              } .a-item {\n  text-decoration: none;\n  background-color: transparent;\n  color: #3d91c0;\n  cursor: pointer;\n}\n#${
                doms.box.id
              } .a-item:hover {\n  color: #40b2f1;\n}\n.ll-scroll-style-1::-webkit-scrollbar,\n.ll-scroll-style-1 ::-webkit-scrollbar {\n  width: 8px;\n}\n.ll-scroll-style-1-size-2::-webkit-scrollbar,\n.ll-scroll-style-1 .ll-scroll-style-1-size-2::-webkit-scrollbar {\n  width: 10px;\n}\n.ll-scroll-style-1-size-3::-webkit-scrollbar,\n.ll-scroll-style-1 .ll-scroll-style-1-size-3::-webkit-scrollbar {\n  width: 12px;\n}\n.ll-scroll-style-1::-webkit-scrollbar-thumb,\n.ll-scroll-style-1 ::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.05);\n  opacity: 0.2;\n  background: #daedff;\n}\n.ll-scroll-style-1::-webkit-scrollbar-track,\n.ll-scroll-style-1 ::-webkit-scrollbar-track {\n  -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.08);\n  border-radius: 0;\n  background: #fff;\n  border-radius: 5px;\n}\n`
            );
          })()
        ),
        GM_registerMenuCommand("设置", () => {
          showSettings();
        }),
        (function setZIndex(val) {
          msgZIndex = val;
        })(info.history.msgZIndex),
        (info.edit = editArea_createEditEle({
          placeholder: {
            title: info.history.txt.editPhTT,
            desc: info.history.txt.editPhDesc,
            value: info.history.txt.editPhValue,
          },
          zIndex: info.history.editZIndex,
          clickWrapClose: info.settings.editWrapClose.value,
        })),
        info.notRecordCommentPages.includes(pageType) ||
          customCommentSend_main(),
        main();
    }
  }
  setTimeout(() => {
    bilibili_comment_history_main();
  }, 100);
})();