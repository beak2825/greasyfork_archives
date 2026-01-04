// ==UserScript==
// @name        【维尔驾服】样式优化 & 学员上报
// @namespace   维尔驾服
// @match       https://school.welldrive.cn/*
// @match       https://jx.welldrive.cn/*
// @grant       none
// @version     3.0
// @author      -
// @description 2022/11/12 15:58:21
// @downloadURL https://update.greasyfork.org/scripts/454655/%E3%80%90%E7%BB%B4%E5%B0%94%E9%A9%BE%E6%9C%8D%E3%80%91%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96%20%20%E5%AD%A6%E5%91%98%E4%B8%8A%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/454655/%E3%80%90%E7%BB%B4%E5%B0%94%E9%A9%BE%E6%9C%8D%E3%80%91%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96%20%20%E5%AD%A6%E5%91%98%E4%B8%8A%E6%8A%A5.meta.js
// ==/UserScript==

// 样式改造
const style = document.createElement('style');
style.innerHTML = `
  /* 隐藏所有滚动条 */
  html, body {
    width: 100vw;
    min-width: 100vw;
    max-width: 100vw;
    height: 100vh;
    min-height: 100vh;
    max-height: 100vh;
    overflow: hidden;
  }

  /* 【登录页】把登录框放到视窗大小 */
  .loginBox {
    background-image: none;
    background-color: white;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    white-space: nowrap;
    padding: 0;
    padding-top: 30px;
  }

  /* 【首页】把登录框放到视窗大小 */
  header.ant-layout-header > div {
    background-color: white;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    white-space: nowrap;
  }
  header.ant-layout-header > div > * {
    flex-grow: 0 !important;
    min-width: 0 !important;
  }
`;
document.head.append(style);

// 自动勾选协议
document.getElementById('privacy')?.click();

// 密码框现形
document.getElementById('password')?.removeAttribute('type');

// 登录时记录用户名和密码
document.getElementById('login')?.setAttribute('onclick', `
  cookieStore.set('username', document.getElementById('username').value);
  cookieStore.set('password', document.getElementById('password').value);
  window.onLogin();
`);

// 增加上报按钮
(async () => {
  const cookieUsername = (await cookieStore.get('username'))?.value;
  const localStorageUsername = localStorage.getItem('username');
  if (cookieUsername && localStorageUsername && cookieUsername === localStorageUsername) {
    const button = document.createElement('button');
    document.querySelector('header.ant-layout-header > div')?.append(button);
    button.innerText = '上报';
    button.setAttribute('class', 'ant-btn ant-btn-primary');
    button.addEventListener('click', async () => {
      button.setAttribute('disabled', 'disabled');
      try {
        const username = (await cookieStore.get('username')).value;
        const password = (await cookieStore.get('password')).value;
        if (!username || !password) {
          throw '存在 cookie 里的用户名和密码丢失';
        }

        const devid = await fetch('https://www.uuidgenerator.net/api/version4').then(res => res.text());
        if (!/[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12}/.test(devid)) {
          throw '获取到的 devid 格式有误';
        }

        const { data: userInfo } = await fetch(
          `${window.REACT_APP_USER_CENTER_URL}/api/jp-train-core-svc/v1/student/getBaseInfo?userId=${encodeURIComponent(localStorage.getItem('userIdString'))}`,
          {
            method: "GET",
            mode: "cors",
            credentials: "include",
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              schoolid: localStorage.getItem('schoolId'),
              authorization: "bearer" + localStorage.getItem('token'),
              username: localStorage.getItem('username'),
            },
          }
        ).then(res => res.json());
        if (!userInfo) {
          throw '获取到用户数据失败';
        }

        const { data: companyData } = await fetch(
          `${window.REACT_APP_USER_CENTER_URL}/api/usercenter/user/defaultCompany?userType=STUDENT`,
          {
            method: "GET",
              mode: "cors",
              credentials: "include",
              headers: {
                accept: "application/json",
                "content-type": "application/json",
                schoolid: localStorage.getItem('schoolId'),
                authorization: "bearer" + localStorage.getItem('token'),
                username: localStorage.getItem('username'),
              },
          }
        ).then(res => res.json());
        if (!companyData) {
          throw '获取驾校信息失败';
        }

        const { data: cityList } = await fetch(`${window.REACT_APP_USER_CENTER_URL}/openapi/usercenter/v1/city/selectAllHotCity`).then(res => res.json());
        const { storageServerUrl } = cityList.find(city => city.code === userInfo.cityCode);
        if (!storageServerUrl) {
          throw "未获取到 storageServerUrl";
        }

        console.group('上报信息如下 👇')
        console.log('👉 username >>> ', username);
        console.log('👉 password >>> ', password);
        console.log('👉 devid >>> ', devid);
        console.log('👉 storageServerUrl >>> ', storageServerUrl);
        console.log('👉 userInfo >>> ', userInfo);
        console.log('👉 companyData >>> ', companyData);
        console.groupEnd();

        const url = new URL('https://xueche.deno.dev/welldrive/save');
        url.searchParams.set('username', username);
        url.searchParams.set('password', password);
        url.searchParams.set('devid', devid);
        url.searchParams.set('storageServerUrl', storageServerUrl);
        const uploadResult = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({ user: userInfo, company: companyData  }),
          mode: 'cors',
        }).then(res => res.text());

        if (uploadResult.endsWith('操作成功')) {
          button.remove();
        }
        throw uploadResult;
      } catch(e) {
        alert(e);
        button.removeAttribute('disabled');
      }
    });
  }
})();