// ==UserScript==
// @name         知乎小助手
// @namespace    http://tampermonkey.net/
// @version      0.1.4.1
// @description  进入知乎问题页后自动删除标题及右侧广告,方便提高上班工作效率
// @author       深呼吸啊
// @match        https://www.zhihu.com/*
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423754/%E7%9F%A5%E4%B9%8E%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/423754/%E7%9F%A5%E4%B9%8E%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';
  setTimeout(() => {
    try {
      const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="137" height="52" viewBox="0 0 137 28" fill="none">
      <path d="M17.5865 17.3955H17.5902L28.5163 8.77432L25.5528 6.39453L17.5902 12.6808H17.5865L17.5828 12.6845L9.62018 6.40201L6.6604 8.78181L17.5828 17.3992L17.5865 17.3955Z" fill="#1E80FF"/>
      <path d="M17.5872 6.77268L21.823 3.40505L17.5872 0.00748237L17.5835 0L13.3552 3.39757L17.5835 6.76894L17.5872 6.77268Z" fill="#1E80FF"/>
      <path d="M17.5865 23.2854L17.5828 23.2891L2.95977 11.7531L0 14.1291L0.284376 14.3574L17.5865 28L28.5238 19.3752L35.1768 14.1254L32.2133 11.7456L17.5865 23.2854Z" fill="#1E80FF"/>
      <path d="M133.287 18.4172H131.162L129.923 23.0758H126.825V16.7559H135.364V14.7315H126.825V11.1469H133.074V9.12256H118.454V11.1469H124.703V14.7315H116.164V16.7559H124.703V23.0758H121.601L120.363 18.4172H118.237L119.487 23.0758H115.543V25.1001H135.985V23.0758H132.041L133.287 18.4172Z" fill="#323232"/>
      <path d="M130.522 3.3151L130.2 2.94092H121.321L120.999 3.3151C119.298 5.2467 117.378 6.97337 115.278 8.46009V10.9522C116.206 10.3573 120.183 7.72295 122.327 4.98768H129.235C131.375 7.72295 135.356 10.3573 136.284 10.9522V8.46009C134.169 6.97586 132.235 5.2491 130.522 3.3151Z" fill="#323232"/>
      <path d="M94.9037 8.53127H96.494V6.50323H94.9037V2.88867H92.9056V6.50323H91.3303V8.53127H92.9094V14.7914L91.3303 15.3377V17.5828L92.9094 17.0365V20.7371C92.8414 22.2391 92.5579 23.7236 92.0674 25.145H94.1629C94.6112 23.7165 94.863 22.2335 94.9112 20.7371V16.3442L96.5053 15.7904V13.5229L94.9112 14.0767L94.9037 8.53127Z" fill="#323232"/>
      <path d="M99.1875 2.88867H97.6608V20.7446C97.6727 22.2359 97.4852 23.7221 97.1033 25.1637H99.1875C99.5206 23.7145 99.6851 22.2316 99.6776 20.7446V9.77357H112.321V2.88867H99.1875ZM110.308 7.75303H99.6851V4.91671H110.304L110.308 7.75303Z" fill="#323232"/>
      <path d="M110.305 23.405H107.566V17.6838H110.021H110.702H111.91V11.8166H110.021V15.9363H107.566V11.1431H105.676V15.9363H103.27V11.8166H101.381V17.6838H102.298H103.27H105.676V23.405H102.967V19.173H101.074V25.1524H102.286H102.967H110.305H110.683H112.195V19.173H110.305V23.405Z" fill="#323232"/>
      <path d="M53.0024 2.91846V4.83801L56.5908 6.11397L53.0024 7.38618V9.30573L59.2887 7.07187L65.5749 9.30573V7.38618L61.9865 6.11397L65.5749 4.83801V2.91846L59.2887 5.15232L53.0024 2.91846Z" fill="#323232"/>
      <path d="M79.9508 11.697H88.5944V9.47813H79.9508V2.80273H77.5299V9.47813H68.8863V11.697H77.5299V22.9823H67.76V25.2012H89.7207V22.9823H79.9508V11.697Z" fill="#323232"/>
      <path d="M48.9461 5.39227L52.2913 5.18272V3.24072L43.6813 3.78328V5.72529L47.0265 5.512V8.50545H43.5803V10.4213H47.0265V25.164H48.9461V10.4213H52.3923V8.50545H48.9461V5.39227Z" fill="#323232"/>
      <path d="M57.6539 9.01025H55.6595L55.1768 10.3648H52.9991V12.2357H54.5145L52.55 17.7662H53.8821V24.1534H55.7007V16.8457H58.6642V25.1787H60.5837V16.8457H63.4612V21.059C63.4534 22.1374 63.181 23.1974 62.6679 24.146H64.7147C65.1423 23.173 65.3627 22.1217 65.362 21.059V15.6932V15.1282H60.5837V13.2572H58.6642V15.1282H55.4836L56.5313 12.2245H65.594V10.3536H57.1749L57.6539 9.01025Z" fill="#323232"/>
      <path d="M43.562 24.6246H45.4591L46.2786 11.4272H44.3815L43.562 24.6246Z" fill="#323232"/>
      <path d="M49.7849 11.4272L50.3499 23.2963H52.247L51.682 11.4272H49.7849Z" fill="#323232"/>
      </svg>`
      //更换logo
      if (window.location.host == "www.zhihu.com") {
        if (document.querySelector('.AppHeader')) {
          // 获取搜索框
          // let search = document.querySelector(".css-1acwmmj")
          // 背景颜色
          document.querySelector('.AppHeader').style.backgroundColor = '#fff'
          // document.querySelector('.AppHeader').innerHTML = `<div style="width:1200px;margin:0 auto;background-color:#fff;display: flex;align-items: center;justify-content: space-between;">${logoSvg}${search.innerHTML}</div>`
        }
        // 更改logo
        let logoWrapper = document.querySelector('.css-nxq4uo')
        if (logoWrapper) {
          logoWrapper.children[0].innerHTML = logoSvg
        }
        // 删除顶部广告
        if (document.querySelector('.Topstory') && document.querySelector('.Topstory').children && document.querySelector('.Topstory').children[0]) {
          document.querySelector('.Topstory').children[0].remove();
        }
      } else {
        document.getElementsByTagName('header')[0] && document.getElementsByTagName('header')[0].remove();
        document.getElementsByClassName('Question-sideColumn')[0] && document.getElementsByClassName('Question-sideColumn')[0].remove();
        document.getElementsByClassName('ColumnPageHeader')[0] && document.getElementsByClassName('ColumnPageHeader')[0].remove();
      }
      console.log('已成功进入简洁模式,啦啦啦')
    } catch (err) {
      console.log('进化失败,请查看以下报错信息~~~')
      console.log(err)
    }
  }, 200)
  // Your code here...
})();