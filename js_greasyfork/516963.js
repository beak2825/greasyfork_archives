// ==UserScript==
// @name         蓝奏云手机网页直接下载
// @namespace    蓝奏云手机网页免vip
// @version      1.7
// @description  蓝奏云手机网页免vip载
// @author       jj
// @match        *://*.lanzouw.com/*
// @match        *://*.lanzoub.com/*
// @match        *://*.lanzoue.com/*
// @include      *.lanzou*.com/*
// @exclude      https://baidu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516963/%E8%93%9D%E5%A5%8F%E4%BA%91%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/516963/%E8%93%9D%E5%A5%8F%E4%BA%91%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  //判断是手机还是电脑
  if (getDeviceType() == 'desktop') {
    return
  }
  //判断是不是tp,是的话就返回
  const containsTp = location.href.includes("/tp");
  if (containsTp) {
    return
  }

  //把链接转换,有无提取码各走分支
  changeTP(location.href)
})();



//判断ua是电脑还是手机,手机才执行
function getDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/mobile/i.test(userAgent)) {
    return 'mobile'; // 表示移动设备
  } else {
    return 'desktop'; // 表示桌面设备
  }
}
//把链接转换,有无提取码各走分支
function changeTP(url ) {
  //处理带tp的才好爬虫
  const oldurl = new URL(url);
  let pathname = '/tp' + oldurl.pathname
  let newUrl = oldurl.origin + pathname
  return fetch(newUrl, {
    "credentials": "include",
    "headers": {
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Pragma": "no-cache",
      "Cache-Control": "no-cache"
    },
    "method": "GET",
    "mode": "cors"
  }).then(res => res.text()).then(res => {
    //假设没有提取码情况
      // 正则表达式,找出hyggid
      const regexhyggid = /hyggid\s*=\s*'([^']+)'/;
      // 执行匹配
      const matchhyggid = res.match(regexhyggid);
      // 正则表达式,找出vkjxld
      const regexvkjxld = /vkjxld\s*=\s*'([^']+)'/;
      // 执行匹配
      const matchvkjxld = res.match(regexvkjxld);
      //找到后直接跳转下载
      if (!matchvkjxld || !matchvkjxld[1] || !matchhyggid || !matchhyggid[1]) {
       console.log('应该是需要验证码页面');
            //找vidksek
   let   pwd = prompt("请输入提取码")
   if (pwd === null) {
    console.log("用户点击了取消");
    return
}
      let match = res.match(/var\s+vidksek\s*=\s*'([^']+)'/);
      let fValue = ''
      if (match) {
        console.log(match[1]); // 输出 vidksek 的值
      } else {
        console.log("未找到 vidksek 变量");
      }
      //找vidksek
      // 找id
      var parser = new DOMParser();
      var doc = parser.parseFromString(res, 'text/html');
      const spans = doc.querySelectorAll('.mt2');
      // 检查是否有至少三个 'mt2' 类的 span 标签
      if (spans.length >= 3) {
        const thirdSpan = spans[2];  // 注意：索引是从 0 开始的，第三个元素是索引 2
        // 在第三个 span 标签中查找 a 标签
        const aTag = thirdSpan.querySelector('a');
        // 如果找到了 a 标签，则获取其 href 属性
        if (aTag) {
          const href = aTag.getAttribute('href');
          // console.log(href);  // 输出 href 属性值
          const urlParams = new URLSearchParams(href.split('?')[1]);
          // 获取 'f' 参数的值
          fValue = urlParams.get('f');
          console.log(fValue)
        } else {
          console.log('第三个 span 标签下没有 a 标签');
        }
      } else {
        console.log('没有找到足够的类名为 mt2 的 span 标签');
      }
      let urldy = new URL(newUrl).origin
      // 有提取码就请求多一次获取真正的下载链接
      getFile(urldy, fValue, match[1], pwd)


    }
      location.href = matchvkjxld[1] + matchhyggid[1]

    //有提取码的分支

  })
}

//有提取码情况获取链接
function getFile(url, id, vidksek, pwd) {
  fetch(`${url}/ajaxm.php?file=${id}`, {
    "headers": {
      "accept": "application/json, text/javascript, */*",
      "accept-language": "zh-CN,zh;q=0.9",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded",
      "pragma": "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest"
    },
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": `action=downprocess&sign=${vidksek}&p=${pwd}&kd=1`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  }).then(res => res.text()).then(res => {
    console.log(res);
    let data = JSON.parse(res)
    if (!data.url) {
      alert('密码应该输错了')
      return
    }
    location.href = data.dom + "/file/" + data.url
  })
}