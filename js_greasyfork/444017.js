// ==UserScript==
// @name         才云小工具
// @namespace    http://tampermonkey.net/
// @version      0.01
// @license MIT
// @description  才云小工具-
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.8.0/jquery.min.js
// @author       You
// @match        https://az.800best.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/444017/%E6%89%8D%E4%BA%91%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/444017/%E6%89%8D%E4%BA%91%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function () {



  var posJosn = []
  const pages = `<div class="mys-page">
    <button class="lin" id='notifi'>
      部署完成提醒
    </button>
    <div class="sid">
     <span style='color:red'>SeaMidTest</span></br>
     <a href='https://az.800best.com/devops/pipeline/sea-sea-global-web-dev?workspace=sea'>global-web-dev</a></br>
     <a href='https://az.800best.com/devops/pipeline/sea-sea-global-web-regress?workspace=sea'>global-web-regress</a></br>
     <a href='https://az.800best.com/devops/pipeline/sea-sea-sorting-web-dev?workspace=sea'>sea-sorting-web-dev</a></br>
     <a href='https://az.800best.com/devops/pipeline/sea-sea-xiehe-web-dev?workspace=sea'>sea-xiehe-web-dev</a></br>
     <a href='https://az.800best.com/devops/pipeline/sea-sea-xiehe-web-uat?workspace=sea'>sea-xiehe-web-uat</a></br>
     <span style='color:red'>SeaTest</span></br>
     <a href='https://az.800best.com/devops/pipeline/sea-express-pipeline-20201215171729?workspace=sea-express'>common-web-test</a></br>
     <a href='https://az.800best.com/devops/pipeline/sea-express-common-web-uat?workspace=sea-express'>common-web-uat</a></br>
     <a href='https://az.800best.com/devops/pipeline/sea-express-vnex-web-uat?limit=10&start=0&status=&subTab=record&workspace=sea-express'>vnex-web-uat</a></br>
     <a href='https://az.800best.com/devops/pipeline/sea-express-vnex-web-dev?subTab=record&workspace=sea-express'>vnex-web-dev</a></br>

    </div>
  </div>`
  $(".cps-container").append(pages)
  var style = document.createElement("style");
  style.type = "text/css";
  var text = document.createTextNode(`  .mys-page{
    width: 200px;
    position: fixed;
    right: -199px;
    top: 200px;
    background-color: rgba(255,255,255,0.7);
    overflow: auto;
    z-index:9999
  }
  .mys-page:hover{
    right: 0px;
  }
  .lin{
    width: 200px;
    height: 30px;
    background-color: #a6dfa8;
  }
  .sid{
    overflow: auto;
    height: 470px;
  }`); /* 这里编写css代码 */
  style.appendChild(text);
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(style);
  // Your code here...

  //prod提醒
  function showMsgNotification(title, msg) {
    var Notification = window.Notification || window.mozNotification || window.webkitNotification;

    if (Notification && Notification.permission === "granted") {
      var instance = new Notification(
        title, {
        body: msg,
        icon: "https://az.800best.com/build//img/favicon.ico"
      }
      );

      instance.onclick = function () {
        // Something to do
      };
      instance.onerror = function () {
        // Something to do
      };
      instance.onshow = function () {
        // Something to do
        // console.log(instance.close);
        setTimeout(instance.close, 3000);
      };
      instance.onclose = function () {
        // Something to do
      };
    } else if (Notification && Notification.permission !== "denied") {
      Notification.requestPermission(function (status) {
        if (Notification.permission !== status) {
          Notification.permission = status;
        }
        // If the user said okay
        if (status === "granted") {
          var instance = new Notification(
            title, {
            body: msg,
            icon: "image_url"
          }
          );

          instance.onclick = function () {
            // Something to do
          };
          instance.onerror = function () {
            // Something to do
          };
          instance.onshow = function () {
            // Something to do
            setTimeout(instance.close, 3000);
          };
          instance.onclose = function () {
            // Something to do
          };

        } else {
          return false
        }
      });
    } else {
      return false;
    }

  }

  let NotifiList = ['sin9-sea-global-web-prod','k9-sea-global-web-prod','my9-sea-global-web-prod','thai9-sea-global-web-prod','v9-sea-global-web-prod',
                    'sin9-common-web-prod','t9-common-web-prod','v9-common-web-prod','my9-common-web-prod','k9-common-web-prod',
                    'sea-sorting-web-prod','sea-xiehe-web-prod']
  let tempList = []
  let timeindex
  function tixing() {
    timeindex=setTimeout(() => {
      fetch("https://az.800best.com/api/graphql", {
        "headers": {
          "accept": "*/*",
          "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
          "content-type": "application/json",
          "sec-ch-ua": "\"Not;ABrand\";v=\"99\",\"GoogleChrome\";v=\"97\",\"Chromium\";v=\"97\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-tenant": "seaprod",
          "x-token": window.localStorage.getItem('user-token')
        },
        "referrer": "https://az.800best.com/overview?cid=user-25ef1b-20200417070107-rpn",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{\"operationName\":\"getPartitionAppList\",\"variables\":{\"cid\":\"user-782801-20200417080117-134v\",\"start\":0,\"limit\":999,\"partition\":\"sea-front\",\"q\":\"\",\"pollInterval\":true},\"query\":\"query getPartitionAppList($cid: String!, $start: Int, $limit: Int, $partition: String, $q: String) {\\n  getPartitionAppList(cid: $cid, start: $start, limit: $limit, partition: $partition, q: $q) {\\n      items {\\n metadata {\\n alias \\n}   status {\\n         phase\\n      }    }\\n  }\\n}\\n\"}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      }).then(response => response.json())
        .then(({ data: { getPartitionAppList: { items } } }) => {
          console.log(items)
          let AppList = {}
          items.forEach(e => {
            AppList[e.metadata.alias] = e.status.phase
          })
          tempList=tempList.filter(e => {
            if (AppList[e] === 'Running') {
              showMsgNotification(e, '部署完成')
            }
            return AppList[e] !== 'Running'
          })
          if (JSON.stringify(tempList) !== '[]') {
            tixing()
          }
        });
    }, 30000);
  }
  $("#notifi").on("click", {}, function (e) {
    clearTimeout(timeindex)
    tempList = NotifiList
    fetch("https://az.800best.com/api/graphql", {
      "headers": {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "content-type": "application/json",
        "sec-ch-ua": "\"Not;ABrand\";v=\"99\",\"GoogleChrome\";v=\"97\",\"Chromium\";v=\"97\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-tenant": "seaprod",
        "x-token": window.localStorage.getItem('user-token')
      },
      "referrer": "https://az.800best.com/overview?cid=user-25ef1b-20200417070107-rpn",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": "{\"operationName\":\"getPartitionAppList\",\"variables\":{\"cid\":\"user-782801-20200417080117-134v\",\"start\":0,\"limit\":999,\"partition\":\"sea-front\",\"q\":\"\",\"pollInterval\":true},\"query\":\"query getPartitionAppList($cid: String!, $start: Int, $limit: Int, $partition: String, $q: String) {\\n  getPartitionAppList(cid: $cid, start: $start, limit: $limit, partition: $partition, q: $q) {\\n      items {\\n metadata {\\n alias \\n}   status {\\n         phase\\n      }    }\\n  }\\n}\\n\"}",
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    }).then(response => response.json())
      .then(({ data: { getPartitionAppList: { items } } }) => {
        console.log(items)
        let AppList = {}
        items.forEach(e => {
          AppList[e.metadata.alias] = e.status.phase
        })
        tempList=tempList.filter(e => {
          return AppList[e] !== 'Running'
        })
        if (JSON.stringify(tempList) !== '[]') {
            showMsgNotification('提醒的项目', tempList)
            tixing()
          }else{
          showMsgNotification('没有需要提醒的项目', '没有需要提醒的项目')
          }
      });

  })
})();