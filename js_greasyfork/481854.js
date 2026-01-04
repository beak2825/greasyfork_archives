// ==UserScript==
// @name         b站自律脚本
// @namespace    http://tampermonkey.net/
// @version      0.6.2
// @description  1.除了搜索、视频页、私信页、个人主页、专栏之外的任何页都会被重定向到搜索页；2.视频页去掉相关推荐，并且非自己的视频去掉评论；3.新增配置项支持自行添加重定向的列表。(使用时请打开"设置"-"通用"-"仅在顶层页面（框架）运行"，否则会加载次数过多)
// @author       shandianchengzi
// @match        https://*.bilibili.com/*
// @icon         https://cdn2.iconfinder.com/data/icons/project-management-24/48/62-1024.png
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/481854/b%E7%AB%99%E8%87%AA%E5%BE%8B%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/481854/b%E7%AB%99%E8%87%AA%E5%BE%8B%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var default_skips = {
  // 默认的不重定向的网站的列表，可以在配置中添加或者删除
  2: ['message.bilibili.com', 'member.bilibili.com', 'account.bilibili.com'], // 这些是个人消息管理的一些域名，我是UP主，所以需要查看这些，所以不禁用这些域名
  3: ['opus', 'read', 'list', '437662663', '3404595'] // opus and read is 专栏不禁用, list 是收藏夹的播放列表，我自己的b站和周深的b站不禁用（注：周深的b站是用于测试，我没有办法自己测自己）
};

var skips = GM_getValue('skips', JSON.parse(JSON.stringify(default_skips)));

var ad_class = ['vcd', 'ad-floor-cover', 'inside-wrp', 'activity_vote', 'pop-live-small-mode', 'ad-floor-exp'];

const defaultSettings = {
  blockRecommendations: true,
  blockComments: true,
  blockAds: true
};

// Toast function for displaying messages
function Toast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.fontFamily = 'siyuan';
    m.style.maxWidth = '60%';
    m.style.minWidth = '150px';
    m.style.padding = '0 14px';
    m.style.height = 'auto';
    m.style.color = 'rgb(255, 255, 255)';
    m.style.lineHeight = '1.5';
    m.style.textAlign = 'center';
    m.style.borderRadius = '4px';
    m.style.position = 'fixed';
    m.style.top = '50%';
    m.style.left = '50%';
    m.style.transform = 'translate(-50%, -50%)';
    m.style.zIndex = '999999';
    m.style.background = 'rgba(0, 0, 0, 0.7)';
    m.style.fontSize = '16px';
    document.body.appendChild(m);
    setTimeout(function() {
        m.style.transition = 'opacity 0.5s ease-in';
        m.style.opacity = '0';
        setTimeout(function() {
            document.body.removeChild(m);
        }, 500);
    }, duration);
}

const userSettings = GM_getValue('userSettings', defaultSettings);

function saveSettings(newSettings) {
    GM_setValue('userSettings', newSettings);
}

// 新增函数：配置skip变量
function configureSkips() {
    const configWindow = document.createElement('div');
    configWindow.style.position = 'fixed';
    configWindow.style.top = '50%';
    configWindow.style.left = '50%';
    configWindow.style.transform = 'translate(-50%, -50%)';
    configWindow.style.backgroundColor = '#f9f9f9';
    configWindow.style.padding = '20px';
    configWindow.style.border = '1px solid #ddd';
    configWindow.style.borderRadius = '8px';
    configWindow.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
    configWindow.style.zIndex = '10000';
    configWindow.style.width = '400px';
    configWindow.style.fontFamily = 'Arial, sans-serif';

    configWindow.innerHTML = `
        <h3 style="margin-top: 0; font-size: 18px; color: #333;">配置跳过规则</h3>
        <p style="font-size: 12px; color: #666; margin-top: 0;">
            键表示URL分割后的索引位置，值表示要跳过的域名或路径片段<br>
            例如：索引2表示URL分割后的第三部分(从0开始)
        </p>
        <textarea id="skipConfig" style="width: 100%; height: 200px; margin: 10px 0; font-family: monospace;">${JSON.stringify(skips, null, 2)}</textarea>
        <div style="text-align: right; margin-top: 20px;">
            <button id="saveSkips" style="padding: 5px 10px; margin-right: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
            <button id="cancelSkips" style="padding: 5px 10px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">取消</button>
        </div>
    `;

    document.body.appendChild(configWindow);

    document.getElementById('saveSkips').addEventListener('click', () => {
        try {
            const newSkips = JSON.parse(document.getElementById('skipConfig').value);
            GM_setValue('skips', newSkips);
            skips = newSkips;
            document.body.removeChild(configWindow);
            Toast('跳过规则已保存！刷新页面以应用更改。', 1500);
        } catch (e) {
            Toast('保存失败：JSON格式错误', 2000);
        }
    });

    document.getElementById('cancelSkips').addEventListener('click', () => {
        document.body.removeChild(configWindow);
    });
}

// 新增函数：恢复默认skip设置
function resetSkips() {
    GM_setValue('skips', JSON.parse(JSON.stringify(default_skips)));
    skips = JSON.parse(JSON.stringify(default_skips));
    Toast('已恢复默认跳过规则！刷新页面以应用更改。', 1500);
}

function configureSettings() {
    const configWindow = document.createElement('div');
    configWindow.style.position = 'fixed';
    configWindow.style.top = '50%';
    configWindow.style.left = '50%';
    configWindow.style.transform = 'translate(-50%, -50%)';
    configWindow.style.backgroundColor = '#f9f9f9';
    configWindow.style.padding = '20px';
    configWindow.style.border = '1px solid #ddd';
    configWindow.style.borderRadius = '8px';
    configWindow.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3)';
    configWindow.style.zIndex = '10000';
    configWindow.style.width = '300px';
    configWindow.style.fontFamily = 'Arial, sans-serif';

    configWindow.innerHTML = `
        <h3 style="margin-top: 0; font-size: 18px; color: #333;">配置设置</h3>
        <label style="display: block; margin: 10px 0;"><input type="checkbox" id="blockRecommendations" ${userSettings.blockRecommendations ? 'checked' : ''}> 屏蔽相关推荐</label>
        <label style="display: block; margin: 10px 0;"><input type="checkbox" id="blockComments" ${userSettings.blockComments ? 'checked' : ''}> 屏蔽评论</label>
        <label style="display: block; margin: 10px 0;"><input type="checkbox" id="blockAds" ${userSettings.blockAds ? 'checked' : ''}> 屏蔽广告</label>
        <div style="text-align: right; margin-top: 20px;">
            <button id="saveSettings" style="padding: 5px 10px; margin-right: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
            <button id="cancelSettings" style="padding: 5px 10px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">取消</button>
        </div>
    `;

    document.body.appendChild(configWindow);

    document.getElementById('saveSettings').addEventListener('click', () => {
        const newSettings = {
            blockRecommendations: document.getElementById('blockRecommendations').checked,
            blockComments: document.getElementById('blockComments').checked,
            blockAds: document.getElementById('blockAds').checked
        };
        saveSettings(newSettings);
        document.body.removeChild(configWindow);
        Toast('设置已保存！刷新页面以应用更改。', 1500);
    });

    document.getElementById('cancelSettings').addEventListener('click', () => {
        document.body.removeChild(configWindow);
    });
}

// 注册菜单命令
GM_registerMenuCommand('配置设置', configureSettings);
GM_registerMenuCommand('配置重定向规则', configureSkips);
GM_registerMenuCommand('恢复默认重定向规则', resetSkips);

async function removeAds() {
  if (!userSettings.blockAds) return;
  var isMyVideoPage = await checkMyVideoPage();
  // 等commentapp加载完毕, 每秒检查一次内容不为空或者不是在自己的视频里面的时候，再删除广告节点, 删除时连续删除5次
  var interval_func = setInterval(function () {
        var commentapp = document.getElementById('commentapp');
        if (commentapp != null) {
            if (commentapp.innerHTML != '' || isMyVideoPage == false) {
                for (var ii = 0; ii < 5; ii++) {
                    setTimeout(function () {
                        for (var i = 0; i < ad_class.length; i++) {
                            var ad = document.getElementsByClassName(ad_class[i]);
                            if (ad.length > 0) {
                                for (var j = 0; j < ad.length; j++) {
                                    // 直接把这个节点删除
                                    ad[j].parentNode.removeChild(ad[j]);
                                }
                            }
                        }
                    }, 1000 * ii);
                }
                console.log('removeAds success');
                // remove interval
                clearInterval(interval_func);
            }
        }
  }
        , 1000);
}


// check if it is my space page, use the link and cookie to check
async function checkSpaceLink(link) {
  var checkSpaceLink = false;
  var uidArr = link.split('space.bilibili.com/');
  // use '/' or '?' to split the link
  var uid = uidArr[1].split('/')[0].split('?')[0];
  console.log('Check uid', uid);
  // get cookie
  var cookie = document.cookie;
  // get DedeUserID
  var DedeUserID = cookie.split('DedeUserID=')[1].split(';')[0];
  console.log('DedeUserID', DedeUserID);
  // compare uid and DedeUserID
  if (DedeUserID == uid) {
        checkSpaceLink = true;
  }
  return checkSpaceLink;
}


// check if it is my video page, use the href of class 'up-avatar' and 'header-entry-avatar' to check
async function checkMyVideoPage() {
  return new Promise((resolve, reject) => {
        console.log('checkMyVideoPage');
        var myVideoPage = false;
        // get the href of class 'up-avatar'
        var upAvatar = document.getElementsByClassName('up-avatar');
        var upAvatarHref = upAvatar[0].href;
        console.log('upAvatarHref', upAvatarHref);
        // split the href to get the uid
        myVideoPage = checkSpaceLink(upAvatarHref);
        resolve(myVideoPage);
  });
}

// try again 3 seconds later, max 10 times
async function try_catch_function(func) {
    var count = 0;
    var maxCount = 10;
    var interval = 3000;
    while (count < maxCount) {
        try {
            var result = await func();
            console.log('try_catch_function success');
            break;
        } catch (err) {
            console.log('try_catch_function failed', err);
            count += 1;
            if (count < maxCount) {
                await sleep(interval);
            }
        }
    }
}

async function mainFunc() {
  // for bilibili
  // not redirect:
  // 1. search: https://search.bilibili.com/
  // 2. video: https://www.bilibili.com/video/
  // 3. message: https://message.bilibili.com/
  // 4. space: https://space.bilibili.com/
  console.log('usualFunc');
  var url = window.location.href;
  var urlArr = url.split('/');
  // 1. for search page,
  if (urlArr[2] == 'search.bilibili.com') {
    console.log('search page');
    return;
  }
  // 2. for video page, 或者收藏夹 page
  else if (urlArr[3] == 'video' || urlArr[3] == 'list') {
    console.log('video page');
    // remove related videos and other nouseful things
    if (userSettings.blockRecommendations) {
      var relatedVideos = document.getElementById('reco_list') || document.getElementsByClassName('recommend-list-v1') ;
      if (relatedVideos.length != undefined && relatedVideos.length == 0) {
        relatedVideos = document.getElementsByClassName('recommend-list-container');
      }
      // 如果得到的结果是个列表就取第一个，但是如果没有length属性，就不是列表，就不用取第一个；空列表就不取
      if (relatedVideos.length != undefined && relatedVideos.length > 0) {
          relatedVideos[0].style.visibility = 'hidden';
      } else if (relatedVideos.length== undefined) {
          relatedVideos.style.visibility = 'hidden';
      } else {
          console.log('no related videos in video page, it is strange!');
      }
    }
    // 2.2 remove ads
    await try_catch_function(removeAds);
    var isMyVideoPage = await checkMyVideoPage();
    // 2.3 for not my video page and need to remove comment, remove comments
    if (userSettings.blockComments && isMyVideoPage == false) {
        console.log('start to remove comments');
        // remove //*[@id="comment"]
        var comment = document.getElementById('comment') || document.getElementById('commentapp');
        if (comment) comment.style.display = 'none';
    }
    // 2.4 remove slide_ad
    var slide_ad = document.getElementById('slide_ad');
    if (slide_ad != null) {
        slide_ad.style.display = 'none';
    }
  }
  // for other pages
  else{
      // 3. for all the skip pages and skip domains,
      for (var key in skips) {
          for (var i = 0; i < skips[key].length; i++) {
              if (urlArr[key] == skips[key][i]) {
                  console.log('skip page');
                  // do nothing
                  return;
              }
          }
      }
      // 4. for space page,
      if (urlArr[2] == 'space.bilibili.com') {
          var isMyPage = await checkSpaceLink(url);
          // for my space page, do nothing
          if (isMyPage == true) {
              console.log('my space page');
              // do nothing
          }
          // for other space page, redirect to search page
          else if (isMyPage == false) {
              window.location.href = 'https://search.bilibili.com/';
          }
      }
      // for other pages, redirect to search page
      else {
          console.log('other page');
          window.location.href = 'https://search.bilibili.com/';
      }
  }
}

(function() {
  'use strict';
  // 只在顶层页面运行
  if (window.top !== window.self) {
      return;
  }
  // add mainFunc to onload
  console.log('add mainFunc to onload');
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
      mainFunc();
  }
  else {
      window.onload = function() {
          oldonload();
          console.log('oldonload success');
          mainFunc();
          console.log('mainFunc success');
      }
  }
  // Your code here...
})();