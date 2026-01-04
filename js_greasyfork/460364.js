// ==UserScript==
// @name         ECP自动填充ping码
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description   配合浏览器的自动填充账号密码功能，实现电子商务平台（ECP2.0）及电工交易专区（SGCCETP）的自动登录及自动输入ping码
// @author       coccvo
// @match        https://sgccetp.com.cn/*
// @match        https://ecp.sgcc.com.cn/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAASFBMVEX////0+fnr9PPm8O/b6unQ5OPD3dy519Wt0tCjy8qZxcSQwcCJvLqAubd5tLJrratdp6VQnZs/l5UxjIkZkI0XfXkChIEBc3AL2gttAAABRklEQVR42kWRWxLjIAwEsS30RgIckvvfdB3Huzuf3YyqkMov+354Ao44ylb+Z6uh4IMuAUjHP77vNBJRmYSrGWxPCaKhGAFqZFNjYPmVcExFAuDo8zVTMDre4pAmCAeyX+L9Gmb6bWxYgajuRyXP8Xp/1lCAuhVohkSwHfCIz0rUBgWbshAcUOURn1M1sUhjMYZaUVuft1ipKaU5W0gl/E463z/BzYqZRDcSknwKn0EUUdSlzybONi7+vt+zmH9HtZlyqdfF19lVsrNoQSa0bsbce89mlnMlUS3oQizcGuZlxpjznKYOpUZopLLUNu6cZ2dvUDZN83lmSI1+4bWmkvJWSvXQy5yTYn0/MU2N7i1SKFk/V3Jf6+wmkfV3QGQRaX0YtnTVaLT9PbmYqagSk7j7lz8G2Hs0t/RwOm7+ZAc2s0hnePAftu8WygIayDMAAAAASUVORK5CYII=
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460364/ECP%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85ping%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/460364/ECP%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85ping%E7%A0%81.meta.js
// ==/UserScript==

(function() {
  "use strict";

  console.log("location.hostname:",location.hostname)

  if(location.href.match('https://sgccetp.com.cn/isc/newlogin.html'))//电工交易专区登录页面
  {
    setInterval(function(){var button = document.getElementById("register"); button.click();}, 300); //切换手机登录到Ukey登录
    if(document.querySelector("input#uKeyPin") != null && document.querySelector("input#cipher") != null)
    {
      setTimeout(function(){
        document.querySelector('button[onclick="newLogin()"]').click();
      }, 1100);//点击登录按钮
      setInterval(function(){
        document.querySelector("input.pin").value='1234';
          setTimeout(function(){
          document.querySelector('.sure.none').removeAttribute('disabled');
          document.querySelector('.sure.none').click();
          }, 500);
      }, 1000);//输入ping，点确定
    };
  }

  if(location.href.match('https://ecp.sgcc.com.cn/isc/newlogin.html'))//ECP2.0平台登录页面
  {
    setTimeout(function(){var button = document.getElementById("register"); button.click();}, 300); //切换手机登录到Ukey登录
    setTimeout(function(){
      document.querySelector('button[class="fa btn btn-primary btn-sm"]').click();
    }, 1000);//点击登录按钮
    setInterval(function(){
      document.querySelector("input.pin").value='1234';
         setTimeout(function(){
          document.querySelector('.sure.none').removeAttribute('disabled');
          document.querySelector('.sure.none').click();
          }, 500);
    }, 1000);//输入ping，点确定
  }

    if (location.href.match('https://sgccetp.com.cn/purchase') || location.href.match('https://ecp.sgcc.com.cn/ecp2.0/purchase'))
  {
    setInterval(function() {
    let spans = document.querySelectorAll('span');
      for (let i = 0; i < spans.length; i++) {
        if (spans[i].innerText === '用户PIN:') {
          setTimeout(function() {
            let pinInput = document.querySelector('.pin');
            let sureButton = document.querySelector('.sure.none');
            pinInput.value = '1234';
            setTimeout(function() {
              sureButton.removeAttribute('disabled');
              if (pinInput.value = '1234'){
                sureButton.click();}
            }, 500);
          }, 800);
        }
      }
    }, 5000);
  }
    const closeButtons = document.querySelectorAll('.dx-icon.dx-icon-close');

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.click();
        });
    });
    document.addEventListener('keydown', event => {
        if (event.keyCode === 27) {
            event.preventDefault();
            closeButtons.forEach(button => {
                button.click();
            });
        }
    });
})();