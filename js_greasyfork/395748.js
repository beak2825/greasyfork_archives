// ==UserScript==
// @name          wsxy_getData
// @namespace     Vionlentmonkey
// @version       0.6
// @description   网上学院函数库：获取数据
// ==/UserScript==

// 课程学分学时等信息
const getCourseInfo = async coursePk => {
  const viewURL = `${location.origin}/sfxzwsxy//jypxks/modules/train/course/course_view.jsp?coursePk=${coursePk}`;
  const response = await fetch(viewURL, {
    method: 'POST',
    body: 'blob'
  });
  const blob = await response.blob();
  const csInfoHtml = await binary2Text(blob);
  const elements = htmlToElements(csInfoHtml);
  const courseCredit = Number(elements.querySelectorAll('#subjectInfo td')[7].textContent.trim());
  const courseTime = Number(elements.querySelectorAll('#extendInfo td')[3].textContent.trim());
  const courseInfo = {
    courseCredit,
    courseTime
  };
  return courseInfo;
};

// 获取课程对应的 iframe 资源地址，为获取播放器类型做准备。
const getFrameURL = async applyPk => {
  const trainURL =
    location.origin +
    '/sfxzwsxy/jypxks/modules/train/ware/course_ware_view.jsp?applyPk=' +
    applyPk +
    '&courseType=1';
  const response = await fetch(trainURL, {
    method: 'POST',
    body: 'blob'
  });
  const blob = await response.blob();
  const csInfoHtml = await binary2Text(blob);
  const elements = htmlToElements(csInfoHtml);
  const warePath = elements.getElementById('warePath').value;
  const iframeURL = 'http://218.94.1.181:5088/unzipapp/project/ware' + warePath;
  //console.log('iframeURL: ' + iframeURL);
  return iframeURL;
};

// 部分少见的新型播放器会弹出 confirm，避开为宜。
const checkVideoPlayerType = async (applyPk, callback) => {
  // 未报名课程 applyPk === ''
  if (!applyPk) {
    console.log('未传入有效参数 applyPk');
  }
  const iframeVideoPlayerType = {
    method: 'POST',
    // Fetch 不能获取跨域数据
    url: await getFrameURL(applyPk),
    onload: response => {
      const csInfoHtml = response.responseText;
      const elements = htmlToElements(csInfoHtml);
      const isNewPlayer = elements.getElementById('video');
      // return 永远为 undefined，以回调处理
      callback(isNewPlayer, applyPk);
    }
  };
  GM_xmlhttpRequest(iframeVideoPlayerType);
};
