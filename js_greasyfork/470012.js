// ==UserScript==
// @name         Domain Redirector
// @namespace    Domain Redirector
// @author       小集
// @license      MIT
// @version      1.1
// @icon         https://i.postimg.cc/QMmRWcTG/image.png
// @description  Redirects specific domains to new domain
// @match        *://jamanetwork.com/*
// @match        *://journals.lww.com/*
// @match        *://www.eurekaselect.com/*
// @match        *://www.emerald.com/*
// @match        *://aacrjournals.org/*
// @match        *://onepetro.org/*
// @match        *://www.cambridge.org/*
// @match        *://pubs.geoscienceworld.org/*
// @match        *://journals.aps.org/*.
// @match        *://www.jbe-platform.com/*
// @match        *://opg.optica.org/*
// @match        *://muse.jhu.edu/*
// @match        *://www.taylorfrancis.com/*
// @match        *://pubs.aip.org/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/470012/Domain%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/470012/Domain%20Redirector.meta.js
// ==/UserScript==

// 定义特定域名的重定向链接。
const redirectLinks = {
  'jamanetwork.com': 'https://webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421faf64c9d29357c47711a82e29b5a2e',
  'journals.lww.com': 'https://webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421faf8548e2931644330049ebbd6562c38',
  'www.eurekaselect.com': 'https://webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d222257a5575099aa99450202187c92634',
  'www.emerald.com': 'https://webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d2223d6d427f048de29b5a2e',
  'aacrjournals.org': 'https://eproxy.lib.tsinghua.edu.cn/https/KKwxGrEnf4GkiPrCInUHOpnZCHYqyCBa5iuCQWg',
  'onepetro.org': 'https://eproxy.lib.tsinghua.edu.cn/https/4xlza6h9uX37XxtPowvxNhecWysTilelLZ',
  'www.cambridge.org': 'https://webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d2243165526c018dab9d1b2c2702',
  'www.taylorfrancis.com': 'https://webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d23331715c711a8fbe995b203cb81e8525f7',
  'pubs.geoscienceworld.org': 'https://eproxy.lib.tsinghua.edu.cn/https/8KDHx1bhIBshu7vdD338loyrlm11xMLBSW0dIJONKNHAmhVXwT',
  'journals.aps.org': ' https://eproxy.lib.tsinghua.edu.cn/https/MECSaWVsXzcRLbtdXcsOvH4rY3ej1HJLAsNibZ8',
  'www.jbe-platform.com': 'https://webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421e7e056d22d326d1d6e0488b89e5a31388ed296ad',
  'opg.optica.org': 'https://webvpn.shsmu.edu.cn/https/77726476706e69737468656265737421ffe746d228207c597d09c7a38a52',
  'muse.jhu.edu': 'https://eproxy.lib.tsinghua.edu.cn/https/4sKDpUXcEduEeuy2AbZI07ulkR1wQaNQdN',
  'pubs.aip.org': 'https://eproxy.lib.tsinghua.edu.cn/https/50buZaw9jbKBCmpMiWl03SaMlskj2gmg1h',
};

// 获取当前页面的域名，'window.location.hostname'提供当前URL的主机名部分。
  const currentDomain = window.location.hostname;

// 检查替换后的域名是否包含"webvpn.zju.edu.cn"，如果是，则使用HTTP协议
  const isWebvpnDomain = currentDomain.includes('webvpn.zju.edu.cn');
  if (isWebvpnDomain) {
    currentDomain = currentDomain.replace('https', 'http');
  }

// 检查当前域名是否在'redirectLinks'对象中。
  if (currentDomain in redirectLinks) {
    try {
    // 获取当前域名的重定向链接。
      const redirectLink = redirectLinks[currentDomain];

    // 创建完整的重定向URL，包括重定向链接、当前路径和查询参数。
      const redirectUrl = `${redirectLink}${window.location.pathname}${window.location.search}`;

    // 重定向页面到新的URL。
    // 'window.location.replace()'会用指定的URL替换当前页面。
      window.location.replace(redirectUrl);

  } catch (error) {
    // 如果在重定向过程中发生错误，将错误记录到控制台。
    console.error(error);
  }
};
