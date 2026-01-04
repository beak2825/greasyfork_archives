// ==UserScript==
// @name         知乎自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.3
// @description  ZHIHU auto Login
// @include      https://www.zhihu.com/*
// @exclude      https://zhuanlan.zhihu.com/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/403233/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/403233/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
 
(async () => {
    //获取当前所有cookie
  var strCookies = document.cookie;        
  if (strCookies.indexOf("8888")==-1) {
    document.cookie="tst=r;domain=.zhihu.com;path=/;";
    document.cookie="KLBRSID=0a401b23e8a71b70de2f4b37f5b4e379|1636471862|1636471852;domain=www.zhihu.com;path=/;";
    document.cookie="theme=dark;domain=www.zhihu.com;path=/;";
    document.cookie="_9755xjdesxxd_=32;domain=www.zhihu.com;path=/;";
    document.cookie="z_c0=\"2|1:0|10:1636471859|4:z_c0|92:Mi4xdDUzZkF3QUFBQUFBa0I5blhtZ0JGQ1lBQUFCZ0FsVk5NLUozWWdBMHcxZHFBMjl1am0yODBtcGJkc0liV1ZvWEdn|3f168e808d3ca7573be2b277aa613b5fde8de6555b7bc7c9ed45ea653f27b667\";domain=.zhihu.com;path=/;";
    document.cookie="gdxidpyhxdE=wvWkG3Cmy27N9j0T4A1cVd402DTQ7NjRtRG%2Br7u4%5Cx%2FzolSfTzA%2BJOACbjNz9dNmpP8zcE7iGj9KcHRM12I8wtNgZsMJrLt5anSU9dKPfCy39nlVy96iRs3tTIHs98OMOIcdwmPg30D3lRyy%5CBS3YUQlr253b1Ce1vm49SRO281yVkQs%3A1636472771982;domain=www.zhihu.com;path=/;";
    document.cookie="_xsrf=f0b6c9cc-6301-4603-8f02-722de9dfa0e1;domain=.zhihu.com;path=/;";
    document.cookie="captcha_ticket_v2=\"2|1:0|10:1636471859|17:captcha_ticket_v2|704:eyJ2YWxpZGF0ZSI6IkNOMzFfNjRLTVBZd3JSTDlYWlBBRGxOVFFBMTFDbTRybmtGdG55d05GZkVaLWE5Yk1zTUZHalpoQnUxS25uc0o0VU90dkhXQ1RhUDRmUkNmRi1JeDl6T3VDa1VaWEE3Qm94dHJIUlExOVFPX0ptbDVkVHJ5MTAwaGlBZWRnaFBCaFVoOGZ6bW1JVjlfS3pHaklib1V4T0JYemhqcllpVVNfbkVyaklNd0g1cGZGeExPQkQ3VW5DRXNuLXdVbnM5em90Z2NWUHJ0RE96SjJwNWloUldRX3Axd29jRkxlYlhUOS5ldmNScnQxbzFYTF9yS1F3ZE56V3JsYlN3Nnd1a1BmMlhWYktiUjJmai00WTB0aEtUdzV1RHJpT2x6QWxVOXdTSHJkNVlrS3VnNG1LZkFOWlBvc0F3QmVFcDR0Q0hMU21mRUttbWFrXzJhblZkamsxMjViMEkxdGxBeTQ3bFhGSzIuRjI4T3ctS3Zlb2xrZDZnZGJBOFpJMU13WHhzbzJPNVVZLlRvX0tYdTJQdkZmdUVvUGhwb08uLjE2dmFfd3VkSVVTeVRzdVg0dVpiOVRfWmV2WmJNSlRlbXlvbDBrTUJqa1BneVdoR2RMWlBnNTRQaFlxQWdBQnU3cGE2ZHliX1AxRG9wOWxZSTc4c2dUdXd6X2tEQVNhTVZDa1FjMyJ9|bea72f631ddbb8115076e1c1370989311bfc433a73e95a0ed26433dc27e0205b\";domain=.zhihu.com;path=/;";
    document.cookie="captcha_session_v2=\"2|1:0|10:1636471854|18:captcha_session_v2|88:MTlVbE43VVhlOTFPVCtJcVZZNy9qWlNVcE9XU0JxcVk2T1dhTGU3eVlkMVdNSU5XeGo5THQvOEZKUlJYKzZINw==|b560004c57d61f5e1c6bacc81c6e048f4c7eb8d9acffbb2ca2613040e6b7f0d5\";domain=.zhihu.com;path=/;";
    document.cookie="NOT_UNREGISTER_WAITING=1;domain=.zhihu.com;path=/;";
    document.cookie="__snaker__id=7T5Ja4uxeAezTMXH;domain=www.zhihu.com;path=/;";
    document.cookie="_zap=c138492b-37bb-4940-92fd-cbefc7401226;domain=.zhihu.com;path=/;";
    document.cookie="d_c0=\"AJAfZ15oARSPTqHkOHvC4Qk2n8aCEfbo1es=|1636471852\";domain=.zhihu.com;path=/;";
    document.cookie="SESSIONID=Jqqf9avENlerCyXUk8zKoqJLSz572yF0nHdh3GY6ouK;domain=www.zhihu.com;path=/;";
    document.cookie="YD00517437729195%3AWM_TID=8lWk1rxIQD5EUBQEUEd%2B5gV3Mlw8gdKm;domain=www.zhihu.com;path=/;";
    document.cookie="8888=8888;domain=www.zhihu.com;path=/;";
    location.reload();
  }   
}) ();