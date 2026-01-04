// ==UserScript==
// @name          wsxy_autoLogin
// @namespace     Vionlentmonkey
// @version       0.5.4
// @description   网上学院函数库：自动登录
// ==/UserScript==

/**
 * 从 QQ 等打开地址后会被加上奇葩后缀
 * http://218.94.1.179:8087/sfxzwsxy/#?tdsourcetag=s_pctim_aiomsg
 */
const uniformURLs = () => {
  const tracks = [
    // QQ
    '?tdsourcetag=s_pctim_aiomsg',
    // Weixin
    '?from=groupmessage',
    '&from=groupmessage',
    '?from=singlemessage',
    '&from=singlemessage',
    '?from=timeline',
    '&from=timeline',
    '/type/WeixinReadCount',
  ];
  for (const track of tracks) {
    if (!location.href.endsWith(track)) continue;
    location.href = location.href.replace(track, '');
  }
  /**
   * 若不统一到对应 IP 上，打开课程等页面似乎会出错
   * http://218-94-1-181.sft.ipv6.jiangsu.gov.cn:8087/sfxzwsxy/#?tdsourcetag=s_pctim_aiomsg
   * http://218-94-1-179.sft.ipv6.jiangsu.gov.cn:8087/sfxzwsxy/#?tdsourcetag=s_pctim_aiomsg
   * http://218-94-1-175.sft.ipv6.jiangsu.gov.cn:8087/sfxzwsxy/#?tdsourcetag=s_pctim_aiomsg
   */
  if (!location.host.endsWith('.sft.ipv6.jiangsu.gov.cn:8087')) return;
  location.host = location.host.replace('.sft.ipv6.jiangsu.gov.cn', '').split('-').join('.');
};

/**
 * 自动选择最空服务器
 */
const autoServerSelect = () => {
  const servers = document.getElementsByClassName('num');
  if (servers.length === 0) return;
  let servers_str = [];
  let notificationText = '';
  for (const s of servers) {
    servers_str.push(s.textContent);
    notificationText += `服务器${servers_str.length}使用程度：${s.textContent}%\n`;
  }
  // 将字符串元素转为数字
  const servers_num = servers_str.map(Number);
  // 全满则自动刷新，否则选择最空服务器
  const mostFree = Math.min(...servers_num);
  if (mostFree === 100) {
    if (!GM_config.get('unlimited')) return;
    // https://developer.mozilla.org/docs/Web/API/Location/reload
    location.reload();
  } else {
    document.getElementsByClassName('entrybtn')[servers_num.indexOf(mostFree)].click();
    GM_notification(
      notificationText,
      '自动选择最空闲的服务器！',
      'https://www.skynj.com/theme/theme_443/images/sinosoft.ico'
    );
  }
};

/**
 * 在原函数的基础上，去掉验证码识别，去除 isBlank 函数依赖
 */
const check = () => {
  if (document.getElementById('loginName').value === '') {
    alert('请输入用户名');
    document.getElementById('loginName').focus();
    return;
  }
  if (document.getElementById('pwd').value === '') {
    alert('请输入密码');
    document.getElementById('pwd').focus();
    return;
  }
  document.getElementById('form1').submit();
};

/**
 * 去除登陆验证码校验
 * 曾使用 OCR 识别法，参考了 https://www.cnblogs.com/ziyunfei/archive/2012/10/05/2710349.html 但准确度有限。
 */
const autoLogin = () => {
  // 重新绑定点击事件
  document.getElementById('Submit').onclick = check;
  // 移除验证码并提示
  document.getElementById('verifyCode').remove();
  document.getElementById('imgCode').value = '已去除验证码可直接登录';
  // 以下尝试自动登录
  document.getElementById('loginName').value = GM_config.get('loginName'); // 写入预先设置的用户名
  document.getElementById('pwd').value = GM_config.get('pwd'); // 写入预先设置的密码
  // 自动获取用户名密码输入框焦点
  if (document.getElementById('loginName').value === '') {
    document.getElementById('loginName').focus();
  } else if (document.getElementById('pwd').value === '') {
    document.getElementById('pwd').focus();
  } else {
    // 用户名密码均已填写时才自动登录
    document.getElementById('Submit').click();
  }
};
