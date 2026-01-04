// ==UserScript==
// @name         UCAS讲座信息抓取
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  抓取讲座信息并生成JSON到剪贴板，可从页面底部的附加面板上传至google calendar
// @match        https://xkcts.ucas.ac.cn:8443/subject/lecture
// @match        https://xkcts.ucas.ac.cn:8443/subject/humanityLecture
// @grant        GM_getValue
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/515800/UCAS%E8%AE%B2%E5%BA%A7%E4%BF%A1%E6%81%AF%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/515800/UCAS%E8%AE%B2%E5%BA%A7%E4%BF%A1%E6%81%AF%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

function assignIgnoringUndefined(target, ...sources) {
    sources.forEach(source => {
        Object.keys(source).forEach(key => {
            if (source[key] !== undefined) {
                target[key] = source[key];
            }
        });
    });
    return target;
}

    async function fetchDetails(url) {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        // 根据实际情况调整选择器
        const detailsTable = doc.querySelector('table'); // 选择第一个表格
        let details = {};

        if (detailsTable) {
            const rows = detailsTable.querySelectorAll('tr');
            rows.forEach((row,index) => {
                // const cells = Array.from(row.querySelectorAll('td'));
                const plain = row.innerText;
                const regex = {
                    startTime: /.+开始时间：([^\n]+)/,
                    endTime: /.+结束时间：([^\n]+)/,
                    mainVenue: /.+主会场地点：([^\n]+)/,
                };

                // 提取字段
                const extractedFields = {
                    startTime: plain.match(regex.startTime)?.[1]?.trim(),
                    endTime: plain.match(regex.endTime)?.[1]?.trim(),
                    mainVenue: plain.match(regex.mainVenue)?.[1]?.trim(),
                };
                if (plain.includes("讲座介绍")) {
                    extractedFields.introduction = rows[index + 1]?.querySelector('td')?.textContent.trim();
                }
                assignIgnoringUndefined(details,extractedFields);
            });
        }
      console.log(details);
      return details;
    }

    function downloadFile(content, fileName) {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        GM_download({
            url: url,
            name: fileName,
            saveAs: true
        });
    }

    async function scrapeTable() {
        const rows = Array.from(document.querySelectorAll('table tbody tr'));
        const data = [];

        for (const row of rows) {
            const cells = row.querySelectorAll('td');
            const name = cells[0].innerText;
            const time = cells[2].innerText;
            const detailLink = cells[6].querySelector('a').href;
            console.log('detaill in',detailLink);
            const details = await fetchDetails(detailLink);

            data.push({
                name: name,
                time: time,
                details: details
            });
        }

        // const csvContent = '讲座名称,讲座时间,详情\n' + data.map(item => `${item.name},${item.time},"${item.details.replace(/"/g, '""')}"`).join('\n');
        // downloadFile(csvContent, 'lectures.csv');
        const jsonstr = JSON.stringify(data);
        const talksToUpload = jsonstr;
        console.log(jsonstr);
        navigator.clipboard.writeText(jsonstr).then(() => {
            console.log('数据已复制到剪贴板');
            // 打开 t.html
            // window.open('http://localhost:1145/gcalendarSyncLectures.html', '_blank');

          // 创建 iframe 元素
            const iframe = document.createElement('iframe');
            iframe.style.width = '100%';  // 设置宽度
            iframe.style.height = '300px'; // 设置高度
            iframe.style.border = '1px solid black'; // 设置边框
            iframe.style.position = 'fixed'; // 固定位置
            iframe.style.bottom = '10px'; // 距底部 10px
            iframe.style.left = '10px'; // 距左边 10px
            iframe.style.zIndex = '2000'; // 确保在其他元素之上
            iframe.style.background = "white";
            const CLIENT_ID = GM_getValue('CLIENT_ID','');
            const API_KEY = GM_getValue('API_KEY');
            console.log('client',CLIENT_ID,'api',API_KEY);

            // 设定 iframe 的内容
            const iframeContent = `
<!DOCTYPE html>
<html>
  <head>
    <title>Google Calendar API Quickstart</title>
    <meta charset="utf-8" />
  </head>
  <body>
    <p>Google Calendar API Quickstart</p>

    <div>
      <button id="paste_btn">paste</button>
      <p id="pasted" style="height: 2em;overflow: hidden; text-wrap: wrap;"></p>
    </div>
    <!--Add buttons to initiate auth sequence and sign out-->
    <button id="authorize_button" onclick="handleAuthClick()">Authorize</button>
    <button id="signout_button" onclick="handleSignoutClick()">Sign Out</button>

    <pre id="content" style="white-space: pre-wrap;"></pre>

    <button id="upload_btn" onclick="startUpload()">Start Upload</button>

    <script type="text/javascript">
      /* exported gapiLoaded */
      /* exported gisLoaded */
      /* exported handleAuthClick */
      /* exported handleSignoutClick */

      // TODO(developer): Set to client ID and API key from the Developer Console
      let CLIENT_ID = "${CLIENT_ID}";
      let API_KEY = "${API_KEY}";
      const UCAS_CALENDARID = '8b1087cb41e1dbaab08c72e1db5f1c3fdc03c814448ffd2b0dcf0b7f62146e3c@group.calendar.google.com';

      // Discovery doc URL for APIs used by the quickstart
      const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      const SCOPES = 'https://www.googleapis.com/auth/calendar';

      let tokenClient;
      let gapiInited = false;
      let gisInited = false;
      let talkIds = null;
      let talksToUpload = ${talksToUpload};
      document.getElementById('pasted').textContent = JSON.stringify(talksToUpload, null, 2);

      document.getElementById('authorize_button').style.visibility = 'hidden';
      document.getElementById('signout_button').style.visibility = 'hidden';
      document.getElementById('paste_btn').addEventListener('click', () => {
          navigator.clipboard.readText().then(text => {
              const complexData = JSON.parse(text);
              talksToUpload = complexData;
              document.getElementById('pasted').textContent = JSON.stringify(complexData, null, 2);
          }).catch(err => {
              console.error('读取剪贴板失败:', err);
          });
      });

      /**
       * Callback after api.js is loaded.
       */
      async function gapiLoaded() {
//        const resp = await fetch('.cred.json');
//        const data = await resp.json();
//        console.log('Credentials loaded',data);
//        API_KEY = data.API_KEY;
//        CLIENT_ID = data.CLIENT_ID;
        gapi.load('client', initializeGapiClient);
      }

      /**
       * Callback after the API client is loaded. Loads the
       * discovery doc to initialize the API.
       */
      async function initializeGapiClient() {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });

        gapiInited = true;
        maybeEnableButtons();

        const savedToken = sessionStorage.getItem('googleCalendar_access_token');
        if (savedToken) {
          gapi.client.setToken({ access_token: savedToken });
          afterLogin();
        }
      }

      /**
       * Callback after Google Identity Services are loaded.
       */
      function gisLoaded() {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '', // defined later
        });
        gisInited = true;
        maybeEnableButtons();
      }

      /**
       * Enables user interaction after all libraries are loaded.
       */
      function maybeEnableButtons() {
        if (gapiInited && gisInited) {
          document.getElementById('authorize_button').style.visibility = 'visible';
        }
      }
      async function afterLogin() {
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
        const events = await getEvents();
        talkIds = new Map(events.map( e => [e.summary, e.id]));

        if (!events || events.length == 0) {
          document.getElementById('content').innerText = 'No events found.';
          return;
        }
        // Flatten to string to display
        const output = events.reduce(
            (str, event) => \`\${str}\${event.summary} (\${event.start.dateTime || event.start.date})\\n\`,
            'Events:\\n');
        document.getElementById('content').innerText = output;
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick() {
        tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            throw (resp);
          }
          sessionStorage.setItem('googleCalendar_access_token', resp.access_token);
          await afterLogin();
        };

        if (gapi.client.getToken() === null) {
          // Prompt the user to select a Google Account and ask for consent to share their data
          // when establishing a new session.
          tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
          // Skip display of account chooser and consent dialog for an existing session.
          tokenClient.requestAccessToken({prompt: ''});
        }
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
          google.accounts.oauth2.revoke(token.access_token);
          gapi.client.setToken('');
          document.getElementById('content').innerText = '';
          document.getElementById('authorize_button').innerText = 'Authorize';
          document.getElementById('signout_button').style.visibility = 'hidden';
        }
      }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      async function getEvents() {
        const request = {
          'calendarId': UCAS_CALENDARID,
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 200,
          'orderBy': 'startTime',
        };
        const response = await gapi.client.calendar.events.list(request);
        console.log(response);
        return response.result.items;
      }
      function startUpload() {
        const uploadEvent = async (ev)=>{
          const request = {
            'calendarId': UCAS_CALENDARID,
            'resource': ev,
          };
          const resp = await gapi.client.calendar.events.insert(request);
        }
        const patchEvent = async (id,changes)=>{
          await gapi.client.calendar.events.patch({
            calendarId: UCAS_CALENDARID,
            eventId: id,
            changes: changes
          })
        }
        const now = new Date()
        for (let t of talksToUpload) {
          if (t.name.includes("待定"))
            continue;
          const event = {
            summary: t.name,
            start: {
              dateTime: new Date(t.details.startTime).toISOString(),
            },
            end: {
              dateTime: new Date(t.details.endTime).toISOString(),
            },
            location: t.details.mainVenue,
            description: t.details.introduction,
            colorId: t.name.includes("明德")? 7 : undefined,
          }
          if(new Date(t.details.startTime) < now)
            continue;
          if (talkIds.has(event.summary)) {
            const {summary, ...changes} = event
            console.log('patch',event)
            patchEvent(talkIds.get(event.summary), changes)
          } else {
            console.log('create',event)
            uploadEvent(event)

          }
        }
      }
    </script>
    <script async defer src="https://apis.google.com/js/api.js" onload="gapiLoaded()"></script>
    <script async defer src="https://accounts.google.com/gsi/client" onload="gisLoaded()"></script>
  </body>
</html>
            `;

            // 将 iframe 添加到页面中
            document.body.appendChild(iframe);
            // 写入内容
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            console.log(iframe);
            console.log(iframeContent);
            console.log(iframe.contentDocument);
            // doc.open();
            doc.write(iframeContent);
            doc.close();

            const toggleAction = ()=>{
              console.log('toggle pannel',iframe.style.visibility);
              iframe.style.visibility=iframe.style.visibility=='hidden'?'visible':'hidden';
            }
            const toggle = document.createElement('button');
            toggle.innerText = 'Toggle Panel';
            toggle.style.position = 'fixed';
            toggle.style.bottom = '50px';
            toggle.style.right = '10px';
            toggle.style.zIndex = 2001;
            toggle.onclick = toggleAction;
            document.body.appendChild(toggle)

        }).catch(err => {
            console.error('复制失败:', err);
        });
    }

    const button = document.createElement('button');
    button.innerText = '抓取讲座信息';
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.zIndex = 2001;
    button.onclick = scrapeTable;

    document.body.appendChild(button);
})();