// ==UserScript==
// @name         mws-favicon
// @namespace    https://rachpt.cn/
// @version      1.0.8
// @description  Modify MWS sub-site Icon
// @author       rachpt
// @match        http*://*.mws.sankuai.com/*
// @match        http*://rhino.sankuai.com/*
// @match        http*://*.inf.st.sankuai.com/*
// @match        http*://*.mws-test.sankuai.com/*
// @match        http*://*.inf.dev.sankuai.com/*
// @match        http*://*.mws.cloud.test.sankuai.com/*
// @icon         https://mws.sankuai.com/favicon.ico
// @require      https://greasyfork.org/scripts/445645-mws/code/mws.js?version=1124334
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444290/mws-favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/444290/mws-favicon.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const base =
        'https://s3plus.meituan.net/v1/mss_491cda809310478f898d7e10a9bb68ec';
  const icon = {
    avatar: `${base}/pub_image8/6e849ee9-a398-4762-9096-9e5a9f866028`,
    raptor: `${base}/pub_image3/eeecde5e-a9f2-4986-a652-446bfda3f71e`,
    lion: `${base}/pub_image12/fb800ab5-854f-472a-b5b3-895dbe4bea80`,
    radar: `${base}/pub_image12/c462b0e7-a837-46cd-a06e-62158205488d_200_200`,
    octo: `${base}/pub_image13/2a76f7c8-9d86-4b64-967a-bd6325e50a5c_162_162`,
    plus: `${base}/pub_image9/f1dc356f-b514-4009-97f3-c24c5967f88f_200_200`,
    seer: `${base}/pub_image6/78c4a6cd-e54e-48d1-b1cf-77da9ccb34c6_200_200`,
    mcm: `${base}/pub_image6/1f087fc8-0b77-4433-8af5-d5fa7eb4022c_200_194`,
    cloudtrail: `${base}/pub_image6/1f087fc8-0b77-4433-8af5-d5fa7eb4022c_200_194`,
    rhino: `${base}/pub_file3/3d69553e-faf7-4256-b26c-cacdff461e46`,
    dayu: `${base}/pub_image14/bf204caa-e5e3-4540-8348-f0bb3dd054ab_200_200`,
    alarm: `${base}/pub_image5/905a4319-780a-43c8-af3e-ac3a1485e9e7`,
    logan: `${base}/pub_image13/6149d0d7-764d-4d1c-8a5b-9c6e9e19ddb0_200_200`,
    oceanus: `${base}/pub_image1/6b16d1d7-e7f6-4cc0-a9c7-30bb2d51a0c5_200_200`,
    dora: `${base}/pub_image15/7b217243-aba1-4fd0-a7d5-10ea353d1b13_200_200`,
    billing: `${base}/pub_image1/ccae211b-ceb8-4f7b-942e-34e97c903083_200_200`,
    rds: `${base}/pub_image15/f0e745d4-b53b-48ae-ba32-128455359e23`,
    squirrel: `${base}/pub_image13/13a3def5-dc50-4227-b56b-861ff68f03de`,
    cellar: `${base}/pub_image12/3633892b-4960-4b0c-a90e-b7a0630b4ce7_200_124`,
    // crane: `${base}/pub_image1/9ac6f5c0-0df3-4804-9832-77080e75ae6a_199_200`,
    crane: 'https://p0.meituan.net/travelcube/fae862bd8662b640f42edadb12e651a820465.png',
    mdp: `${base}/pub_image8/e849c529-fd12-49ae-8361-eae5a657d5cb`,
    monkey: `${base}/pub_image3/d173f538-aeae-499d-b9dd-0824905e0262`,
    camel: `${base}/pub_image2/5b787b7e-e1bf-4e71-acf6-379825947ebe`,
    xframe: `${base}/pub_image6/e789fd54-6557-47a8-9873-6a2eea213497`,
    mafka: `${base}/profile15/b1832c80-df2b-44be-ab3d-024d54991b96`,
    shepherd: `${base}/pub_image5/91a76d69-301d-409a-a658-1d92f4958d80`,
    shark: `${base}/pub_image7/fa90e41a-19ba-4376-9fc2-3533f98a9acd_200_200`,
    hulk: `${base}/pub_image10/8ead7266-43e9-4374-9116-ddbafa53a822`,
    coe: `${base}/pub_image1/8d5d1cee-41a3-4d99-b143-0a4cde6fad6a`,
    lijian: `${base}/pub_image9/5f42e651-f5af-42b3-bc19-cc6b14418927_200_124`,
  };


  const changeFavicon = async () => {
    const site = location.hostname.split('.')[0].split('-')[0].toLowerCase();

    if (Object.keys(icon).includes(site)) {
      let env = null, bgColor = null, color = null;
      const { hostname } = location;
      if (hostname.endsWith('.mws-test.sankuai.com') || hostname.endsWith('.mws.cloud.test.sankuai.com')) {
        env = 'test';
        color = '#fff';
        bgColor = '#9c27b0';
      } else if (hostname.endsWith('-st.mws.sankuai.com') || hostname.endsWith('.inf.st.sankuai.com')) {
        env = 'st';
        color = '#fff';
        bgColor = '#f44336';
      } else if (hostname.endsWith('.inf.dev.sankuai.com')) {
        env = 'dev';
        color = '#fff';
        bgColor = '#3330dc';
      }
      const badgedIcon = env ? await mws.genBadgedFavicon(icon[site], env, color, bgColor) : icon[site];
      let favicon = document.querySelector('link[rel="icon"]');
      const inner = () => {
        if (favicon) {
          favicon.href = badgedIcon;
        } else {
          favicon = document.createElement('link');
          favicon.rel = 'icon';
          favicon.href = badgedIcon;
          document.head.appendChild(favicon);
        }
      };
      inner();
      setTimeout(inner, 500);
      setTimeout(inner, 1000);
      setTimeout(inner, 1500);
      setTimeout(inner, 2000);
      if (env) document.title = `${site}-${env}`;
    }
  };
  window.addEventListener('load',  changeFavicon);
  window.addEventListener('popstate', changeFavicon);
  // window.addEventListener('hashchange', changeFavicon);

  // 自动关闭提示消息
  setTimeout(() => {
    (async () => (await mws.wait('#onecloud-noticeboard .portalnavfont-close', 50, 100, false))?.click())();  // 删除公告
    (async () => (await mws.wait('.notice-body .mtdicon-close-thick', 50, 100, false))?.click())();
    (async () => (await mws.wait('.el-alert__closebtn .el-icon-close',50, 100, false))?.click())();
    (async () => (await mws.wait('#onecloud-rate-container',100, 50, false))?.remove())();  // 删除问卷调查
    (async () => (await mws.wait('div#mwsnav-operation-bar', 100, 50, false))?.remove())();  // 移除新版MWS悬浮栏
  }, 100);
})();