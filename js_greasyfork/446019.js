// ==UserScript==
// @name         sinopecMagic-cloud
// @namespace   sinopecMagic-cloud
// @version      1.4
// @description  This is a sinopecMagic
// @author       zachMelody
// @match        https://sia.sinopec.com/ept/pages/exam/exam_info.html*
// @match        https://sia.sinopec.com/ac/pages/exam/my_exam.html*
// @match        http://localhost:63342/%E5%B2%97%E4%BD%8D%E7%BB%83%E5%85%B5/%E9%A2%98%E7%9B%AE.html*
// @icon         https://www.google.com/s2/favicons?domain=sinopec.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect 127.0.0.1
// @connect 192.168.3.2
// @connect cn-hn-dx-1.natfrp.cloud
// @connect lb2.980626.xyz
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/446019/sinopecMagic-cloud.user.js
// @updateURL https://update.greasyfork.org/scripts/446019/sinopecMagic-cloud.meta.js
// ==/UserScript==

https: (function () {
  'use strict';
  let API_URL = 'https://lb2.980626.xyz:64505';
  console.log('答题脚本初始化...');

  // 展示答案
  function fetchAnswers() {
    let jsonContent = JSON.stringify($UserExam.examPaperInfo.partitions[0]);
    // 发送题目
    GM_xmlhttpRequest({
      method: 'POST',
      url: `${API_URL}/api`,
      data: jsonContent,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      onload: function (response) {
        let res = JSON.parse(response.response);
        let answers = res.data;
        console.log('请求成功', answers);
        console.log(response.response, typeof response.response);

        drawTableAndChoose(answers);
      },
      onerror: function (response) {
        console.log('请求失败', response);
      },
    });
  }
  // 绘制
  function drawTableAndChoose(answers) {
    let table_html = `
    <table style="position: fixed;
    right: 0;
    top: 0%;
    width: 300px;
    table-layout: fixed;
    background-color: rgb(9 203 255 / 20%);
    ">
      <tr>
          <th>题号</th>
          <th>答案</th>
          <th>题型</th>
          <th>题目</th>
      </tr>
      <style type="text/css">
          td {
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              width: 100px;
          }
      </style>
    </table>
    `;
    $(table_html).prependTo('body');
    console.log(answers);
    answers.forEach(function (element) {
      let tmp_str = `
      <tr>
        <td>${element.num}</td>
        <td style="color: red;">${element.answer}</td>
        <td>${element.question}</td>
        <td>${element.type}</td>
      </tr>`;
      $('table').append(tmp_str);
    });
    let map = new Map();
    map.set('A', 0);
    map.set('B', 1);
    map.set('C', 2);
    map.set('D', 3);
    map.set('对', 0);
    map.set('错', 1);
    answers.forEach(function (element) {
      $(`#que_${element.num}`)
        .children('.row')
        .append(
          `<p style="color:red">${element.answer} --> ${element.choice}</p>`
        );
      try {
        // 选择
        let radio_list = $(`#que_${element.num}`).find('.radio input');
        if (radio_list.length == 0) {
          radio_list = $(`#que_${element.num}`).find('.checkbox input');
        }

        if (radio_list.length >= 1 && radio_list.length <= 6) {
          let answerList = element.answer.split('');
          answerList.forEach(function (element) {
            let idx = map.get(element);
            radio_list[idx].click();
          });
        }
      } catch (error) {
        console.error(error);
      }
    });

    // 搜题

    // for (let i = 1; i <= 50; i++) {
    //   let topic = $(`#que_${i} > div.row > div.col-xs-10`);
    //   let que_str = topic[0].textContent;
    //   let mod_que_str = que_str.substring(10, que_str.length - 9);
    //   let search_url = `https://www.google.com/search?q=${mod_que_str}`;
    //   let search_url2 = `https://www.baidu.com/s?wd=${mod_que_str}`;
    //   $(`#que_${i}`)
    //     .children('.row')
    //     .append(
    //       `<a href="${search_url2}" target="_blank"> 搜题♥百度_____     </a>`
    //     );
    //   $(`#que_${i}`)
    //     .children('.row')
    //     .append(`<a href="${search_url}" target="_blank"> ____搜题♥谷歌 </a>`);
    // }
  }

  const myTimeout = setInterval(() => {
    let submitButtom = document.querySelector(
      '#exam-nav > div:nth-child(1) > div:nth-child(4) > button'
    );
    console.log('检查页面状态：', submitButtom);

    if (submitButtom != null && submitButtom.innerText == '我要交卷') {
      clearInterval(myTimeout);
      fetchAnswers();
    }
  }, 300);

  function getCloudServerStatus(ele) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `${API_URL}/api`,

      onload: function (response) {
        let res = response.response;
        let data = res.data;
        console.log('+ 服务状态：成功', data);
        console.log(typeof response, response);

        alert('✔️ 自动答题');
        setTimeout(() => {
          ele.innerText = '✔️ 自动答题';
          ele.classList.add('btn-success');
        }, 3000);
      },
      onerror: function (response) {
        console.log('- 服务状态：失败', response);
        console.log(typeof response, response);

        alert('⛔需要手动答题⛔');
        setTimeout(() => {
          ele.innerText = '⛔需要手动答题⛔';
          ele.classList.add('btn-danger');
        }, 3000);
      },
    });
  }

  const checkCloudServer = setInterval(() => {
    let submitButtom = document.querySelector('#startExam');
    console.log('检查服务状态：', submitButtom);

    if (submitButtom != null && submitButtom.innerText == '开始') {
      clearInterval(checkCloudServer);
      getCloudServerStatus(submitButtom);
    }
  }, 1000);
})();
