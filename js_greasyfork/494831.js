// ==UserScript==
// @name         东油教务系统一键自动教师评论
// @namespace    https://jwgl.webvpn.nepu.edu.cn/new/student/teapj#
// @namespace    https://jwgl.webvpn.nepu.edu.cn/new/welcome.page
// @version      0.5
// @description  一键教师评论
// @author       cat3399
// @grant       GM_xmlhttpRequest
// @require     https://update.greasyfork.org/scripts/494830/%E4%B8%9C%E6%B2%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E9%9C%80%E8%A6%81%E7%9A%84js.user.js
// @license      GNU GPLv3
// @match        https://jwgl.webvpn.nepu.edu.cn/new/*
// @icon         https://bkimg.cdn.bcebos.com/pic/4bed2e738bd4b31cbe08739d80d6277f9e2ff8e4?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080

// @downloadURL https://update.greasyfork.org/scripts/494831/%E4%B8%9C%E6%B2%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E8%87%AA%E5%8A%A8%E6%95%99%E5%B8%88%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/494831/%E4%B8%9C%E6%B2%B9%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E8%87%AA%E5%8A%A8%E6%95%99%E5%B8%88%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==


(function () {
  'use strict';
  console.log('nmsl')

  function createButton() {
    console.log('nmsl')
    // 创建跳转链接的按钮
    var linkButton = document.createElement("button");
    linkButton.innerHTML = "跳转到一键评价界面";
    linkButton.style.backgroundColor = "red";
    linkButton.addEventListener("click", function () {
      window.location.href = "https://jwgl.webvpn.nepu.edu.cn/new/student/teapj#";
    });
    if (document.querySelector("#m1_container")) {
      document.querySelector("#m1_container").insertAdjacentElement('beforebegin', linkButton);
    }
  }

  createButton();


  function yijian() {
    return function () {
      let len = document.querySelector("#searchpage > div.panel.datagrid > div > div.datagrid-view > div.datagrid-view2 > div.datagrid-body > table > tbody").children.length;
      for (let i = 0; i < len; i++) {
        let jspath = '#datagrid-row-r1-2-' + i;
        const str = document.querySelector(jspath).innerHTML;
        const regex = /pj\('(\d+)','(\d+)'/;
        const match = str.match(regex);

        if (match) {
          const dgksdm = match[1];
          const teadm = match[2];
          let url = `https://jwgl.webvpn.nepu.edu.cn/new/student/teapj/pj.page?teadm=${teadm}&dgksdm=${dgksdm}`;
          fetch(url)
            .then(response => response.text())
            .then(data => {
              const parser = new DOMParser();
              const data_dom = parser.parseFromString(data, 'text/html');
              const str = data;
              const regex = /xnxqdm:'([^']*)',\s*pjlxdm:'([^']*)',\s*teadm:'([^']*)',\s*teabh:'([^']*)',\s*teaxm:'([^']*)',\s*wjdm:'([^']*)',\s*kcrwdm:'([^']*)',\s*kcptdm:'([^']*)',\s*kcdm:'([^']*)',\s*dgksdm:'([^']*)',\s*jxhjdm:'([^']*)'/;
              const regex_pj = /data-zbdm:'([^']*)',\s*data-txdm:'([^']*)'/;
              const match = str.match(regex);

              if (match) {
                let answer = [];
                for (let j = 1; j <= 11; j++) {
                  if (j != 11) {
                    const tmp_dom = data_dom.querySelector(`#container > div:nth-child(${j})`);
                    let zbxmdm_dom = tmp_dom.querySelector("input:nth-child(2)");
                    if (j == 10) {
                      zbxmdm_dom = tmp_dom.querySelector("input:nth-child(3)");
                    }
                    const zbxmdm = zbxmdm_dom.getAttribute("value");
                    const zbdm = tmp_dom.getAttribute('data-zbdm');
                    const txdm = tmp_dom.getAttribute('data-txdm');
                    const fz = zbxmdm_dom.getAttribute('data-fz');
                    const mc = zbxmdm_dom.getAttribute('data-mc');
                    const zbmc = tmp_dom.querySelector("h3").innerHTML;
                    let answer1 = `{"txdm":${txdm},"zbdm":${zbdm},"zbmc":"${zbmc}","zbxmdm":"${zbxmdm}","fz":${fz},dtjg:${mc}}`;
                    answer.push({
                      'txdm': parseInt(txdm),
                      'zbdm': parseInt(zbdm),
                      'zbmc': zbmc,
                      'zbxmdm': zbxmdm,
                      'fz': parseInt(fz) + 0.5,
                      'dtjg': mc
                    });
                  }
                  if (j == 11) {
                    const tmp_dom = data_dom.querySelector(`#container > div:nth-child(${j})`);
                    const zbdm = tmp_dom.getAttribute('data-zbdm');
                    const txdm = tmp_dom.getAttribute('data-txdm');
                    const zbmc = tmp_dom.querySelector("h3").innerHTML;
                    answer.push({
                      'txdm': parseInt(txdm),
                      'zbdm': parseInt(zbdm),
                      'zbmc': zbmc,
                      'fz': 0,
                      'dtjg': "好"
                    });
                  }
                }

                let num = 94;
                console.log('nmsl')

                entss.post(
                  '/new/student/teapj/savePj',
                  {
                    "xnxqdm": match[1],
                    "pjlxdm": match[2],
                    "teadm": match[3],
                    "teabh": match[4],
                    "teaxm": match[5],
                    "wjdm": match[6],
                    "kcrwdm": match[7],
                    "kcptdm": match[8],
                    "kcdm": match[9],
                    "dgksdm": match[10],
                    "jxhjdm": match[11],
                    "wtpf": num.toFixed(2),
                    "dt": JSON.stringify(answer)

                  })

              } else {
                console.log("No match found");
              }
            })
            .catch(error => console.error('请求失败', error));
        } else {
          console.log("No match found");
        }
      }
      alert("评价完成，刷新网页查看结果")


    }
  }

  function createButton1() {
    var linkButton = document.createElement("button");
    linkButton.innerHTML = "一键评价";
    linkButton.addEventListener("click", yijian());
    linkButton.style.marginLeft = "10px";
    linkButton.style.backgroundColor = "red";
    linkButton.style.color = "white";
    document.querySelector("#tb > table > tbody > tr > td:nth-child(3)").insertAdjacentElement('afterend', linkButton);
  }

  createButton1();
})();


















