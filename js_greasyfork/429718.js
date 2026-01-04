// ==UserScript==
// @name         GYB+SYB
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @author       tao
// @include      https://jiangxi.zhipeizaixian.com/study/*
// @description  针对江西省补贴性线上职业技能培训官网
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429718/GYB%2BSYB.user.js
// @updateURL https://update.greasyfork.org/scripts/429718/GYB%2BSYB.meta.js
// ==/UserScript==
function queryRootClassName() {
  let regex = /content_wrap.*/;
  for (let i of document.querySelectorAll("div")) {
    if (regex.test(i.className)) {
      return i.className;
    }
  }
}
const regexUnitId = /unit_id=(\d.*)(&+)/;

const waitVideoList = setInterval(() => {
  const rootClassName = queryRootClassName();
  if (rootClassName == undefined) {
    console.log("等待网页加载");
    return;
  }
  const linkTagList = document.querySelectorAll("." + rootClassName + " a");
  const lastUnitId =
    linkTagList[linkTagList.length - 1].href.match(regexUnitId)[1];
  const check = setInterval(() => {
    let currentVideo = document.querySelector("video");
    const currentUnitId = location.search.match(regexUnitId)[1];
    let currnetIndex = 0;
    linkTagList.forEach((tag, index) => {
      if (
        (tag != undefined && tag.href != undefined) ||
        tag.href.indexOf("unit_id") != -1
      ) {
        let unitId = tag.href.match(regexUnitId)[1];
        if (unitId == currentUnitId) currnetIndex = index;
      }
    });
    if (currentVideo.readyState === 4) {
      currentVideo.play();
      const timeout = currentVideo.duration - currentVideo.currentTime;
      console.log(
        "共有" +
          linkTagList.length +
          "个视频,当前位于第" +
          currnetIndex +
          "个, 下一个视频在 " +
          timeout +
          " 秒后播放"
      );
      if (timeout == 0) {
        if (currentUnitId == lastUnitId) {
          console.log("视频观看结束");
          clearInterval(check);
        } else {
          location.href = linkTagList[currnetIndex + 1].href;
        }
      }
    } else {
      console.log("等待视频载入");
    }
  }, 1000);
  clearInterval(waitVideoList);
}, 1000);
