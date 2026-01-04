// ==UserScript==
// @name         审批助手
// @namespace    http://tampermonkey.net/
// @version      0.3.7
// @description  try to take over the world!
// @author       HeYuJie
// @match        http://192.168.0.253/*
// @match        http://192.168.0.252/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415503/%E5%AE%A1%E6%89%B9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/415503/%E5%AE%A1%E6%89%B9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let style1 = `.hyj-main {
      position:fixed;
      display:inline-block;
      width:50px;
      height:50px;
      border-radius:50%;
      box-shadow:5px 5px 40px rgba(0,0,0,0.5);
      text-align:center;
      background:rgb(19,167,19);
      user-select:none;
      cursor:pointer;
      bottom: 100px;
      left: 0;
      z-index: 9999;
    }
    .hyj-main>span {
      line-height:50px;
    }
    .hyj-menu {
      background-color:white;
      box-shadow:5px 5px 40px rgba(0,0,0,0.5);
      list-style:none;
      padding:0;
      margin:0;
      position:absolute;
      width:max-content;
      left:55px;
      top:0;
      padding:5px;
      display:none;
    }
    .hyj-menu>li {
      padding:5px 15px;
    }
    .hyj-menu>li:hover {
      background-color:#72cc98;
    }
`;
  let style = document.createElement('style');
  style.innerHTML = style1;
  document.body.appendChild(style);

  // 添加节点
  let main = document.createElement('div');
  main.className = 'hyj-main';
  main.innerHTML = '<span>菜单</span><ul class="hyj-menu"></ul>';

  document.body.appendChild(main);

  let menus = main.querySelector('.hyj-menu');

  window.addEventListener('click', () => menus.style.display = 'none');
  main.addEventListener('click', function (e) {
    e.stopPropagation();
    menus.style.display = 'block';
  });


  let menuList = [
    {
      name: '清空缓存', click: () => {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie = '';
      }
    },
    {
      name: '退出登录', click: () => {
        let spans = document.querySelectorAll('.el-dropdown-menu>.el-dropdown-menu__item>span');
        for (let i = 0; i < spans.length; i++) {
          if (spans[i].innerText == '退出') {
            spans[i].click();
            return;
          }
        }
      }
    }
  ];















  // 添加菜单
  for (let i = 0; i < menuList.length; i++) {
    let li = document.createElement('li');
    li.innerText = menuList[i].name;
    li.addEventListener('click', (e) => {
      e.stopPropagation();
      menuList[i].click(e);
    });
    menus.appendChild(li);
  }

  // Your code here...

  function dataURLtoBlob(dataurl, filename) {
    var arr = dataurl.split(',');
    //注意base64的最后面中括号和引号是不转译的
    var _arr = arr[1].substring(0, arr[1].length - 2);
    var mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(_arr),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    if (!filename){
      filename = mime.replace('/', '.')
    }

    // return new Blob([u8arr], {type: mime});
    return new File([u8arr], filename, { type: mime }); // file 类型
  }
  // 验证码功能
  if(location.pathname == '/oauth-service/login'){

      let password = document.querySelector('input[name=password]');
      password.value = 123;
      password.dispatchEvent(new Event('input'))

      var img = document.querySelector('.verify-img');
      img.onload = function () {

          var form = new FormData();
          form.append('file', dataURLtoBlob(img.src))
          $.ajax({
              url: 'http://192.168.0.253:30528/hyj/captcha/dist',
              type: 'post',
              data: form,
              contentType: false,
              processData: false,
              success(res){
                  let input = document.querySelector('input[name=verificationCode]');
                  input.value = res;
                  input.dispatchEvent(new Event('input'))
              }
          });
      }
  }
})();