// ==UserScript==
// @name         抓取详情
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Check data from list
// @author       TIANLU
// @match        https://www.douban.com/*
// @match        https://zju.date/goaccess-notes/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.6.0/js/bootstrap.js
// @connect      https://xinxue.meirixinxue.com
// @connect      https://meirixinxue.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/428716/%E6%8A%93%E5%8F%96%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/428716/%E6%8A%93%E5%8F%96%E8%AF%A6%E6%83%85.meta.js
  // ==/UserScript==

(function () {
  "use strict";
    const rawUrl = window.location.href;
    const apiUrl = GM_getValue('apiUrl')
    const authToken = GM_getValue('authToken')

    const loadCss = (url) => {
        let script = document.createElement('link');
        script.setAttribute('rel', 'stylesheet');
        script.setAttribute('type', 'text/css');
        script.href = url
        document.documentElement.appendChild(script);
    }
    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    unsafeWindow.GM_notification = GM_notification
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest
    loadCss('https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.6.0/css/bootstrap.min.css');


    const filterBody = () => {
      const url = window.location.href;
      let main_content = {type: 'class', content: ''}
      if(url.match('zju.date') && url.match('goaccess')) {
        main_content = {type: 'id', content: "main" }
      } else {

      }
      if(main_content.type === 'id') {
        $(`#${main_content.content}`).addClass('alert alert-success')
        return $(`#${main_content.content}`)
      } else {
        return $(`#${main_content.content}`)
      }
    }

    const saveData = (html) => {
      const url  = apiUrl
      console.log('apuUrl', apiUrl, 'authToken', authToken)
      const data = {
          body: "xxx",
          raw_url: url,
          api_auth_token: authToken
        }
      $.ajax({
          url: url,
          method: 'post',
          data: data,
          success: (res) => {
             console.log('res', res);
             if(res.error) {
              unsafeWindow.GM_notification({text: "失败[点击复制链接]", title: res.error, image: '', highlight: true, timeout: 10000, onclick: () => {
                  GM_setClipboard(`${rawUrl} error ${res.error}`)
              }})
            } else {
              unsafeWindow.GM_notification({text: "保存成功", title: 'good', highlight: true, timeout: 3000})
            }
          }
      })
    }
    const addSaveBtn = () => {
        var body = filterBody();
        if(!body) {
          return
        }
        const text =
        `
         <button type="button" class="btn btn-outline-primary" id="save_data">保存</button>
        `
        body.prepend(text)
        $("#save_data").click(function(){
           // 保存数据
           saveData(body.html())
        });
    }

    GM_registerMenuCommand(`设置token ${authToken}`, () => {
      sleep(1000).then(async () => {
        var apiUrl=prompt("链接地址","https://xxxxx.com/");
        var authToken = prompt("请输入token","xxxx");
        console.log('auth_token', authToken )
        if (apiUrl!== null && authToken !== ""){
          GM_setValue('apiUrl', apiUrl)
          GM_setValue('authToken', authToken)
          unsafeWindow.GM_notification("设置完成", '重新刷新网页')
        }
      });
    });


    filterBody();
    addSaveBtn();

    function getItemData(url = '') {
      // url = 'https://www.douban.com/group/topic/231836463/'
      GM_xmlhttpRequest({
        method: 'get',
        url: rawUrl,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        onload: function (response) {
          console.log("response", response);

          // const data = response.response
          // $('#modal-content').html(data)
          // $('#modal').modal('show')
        },
        onerror: function (response) {
          console.log("请求失败");
        },
      });
    }



    // function send_data(url, method, data) {
    //   GM_xmlhttpRequest({
    //     method: method,
    //     url: url,
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    //     },

    //     onload: function (response) {
    //       console.log("response", response);
    //     },
    //     onerror: function (response) {
    //       console.log("请求失败");
    //     },
    //   });
    // }

    function getQueryString(e) {
      var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)");
      var a = window.location.search.substr(1).match(t);
      if (a != null) return a[2];
      return "";
    }
  }
)();
