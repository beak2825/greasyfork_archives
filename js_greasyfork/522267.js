// ==UserScript==
// @name         国华升级流程辅助工具
// @namespace    http://tampermonkey.net/
// @version      2024-12-27
// @description  国华需求和缺陷管理平台流程辅助工具，生成项目版本文件，发送紧急升级邮件和生成构建信息
// @author       caizhenyu
// @match        http://10.56.85.198:8066/browse/DATBUG*
// @match        http://10.56.85.198:8066/browse/DSSJ*
// @match        http://jira.ghlife.com.cn:8066/browse/DATBUG*
// @match        http://jira.ghlife.com.cn:8066/browse/DSSJ*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522267/%E5%9B%BD%E5%8D%8E%E5%8D%87%E7%BA%A7%E6%B5%81%E7%A8%8B%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/522267/%E5%9B%BD%E5%8D%8E%E5%8D%87%E7%BA%A7%E6%B5%81%E7%A8%8B%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // Your code here...
  const data = {
    mailOptions: {
      from: '"蔡振宇" <caizy_sinosoft@guohualife.com>', // 发件人地址
      to: '1002062997@qq.com',
      // to: '"鲁英"<luying@guohualife.com>', // 收件人地址
      // cc: '"盛金娣"<shengjd@guohualife.com>, "童雅丽"<tongyl01@guohualife.com>, "严文文"<yanww@guohualife.com>, "罗佳伟"<luojw@guohualife.com>, "苏晓玲"<suxl_tigerobo@guohualife.com>', // 抄送人地址，可以是一个字符串或一个数组
      auth: {
        user: 'caizy_sinosoft@guohualife.com', // 你的邮箱地址
        pass: 'qwer13145!' // 你的邮箱密码或应用专用密码
      }
    },
    mergeUrl: '',
    buildUrl: '',
    product: '',
    DSSJ: '',
    SEQ: '',
    describe: '',
    productDate: '',
    developer: '',
    reason: '',
    tester: '',
    testContent: '',
    testDate: '',
    remark: '升级事务报告人：',
    systemName: ''
  }
  function getBuildInfo() {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:3000/devops/getBuildInfo?projectName=' + data.projectName)
        .then(response => response.json())
        .then(res => {
          if (res.data.length > 0) {
            resolve(res)
          } else {
            alert("未查询到构建信息");
            reject(false)
          }
        })
        .catch((error) => {
          reject(error)
        });
    });
  }
  function bugPageHandle() {
    window.addEventListener('load', function () {
      const trs = document.querySelectorAll('#tab1 tr')
      for (let i = 0; i < trs.length; i++) {
        let itemTxt = (trs[i].innerText).toString();
        if (itemTxt.indexOf('对应的需求号:') !== -1) {
          data.SEQ = itemTxt.replace('对应的需求号:', '').trim()
        } else if (itemTxt.indexOf('测试环境:') !== -1) {
          data.product = itemTxt.replace('测试环境:', '').trim()
        } else if (itemTxt.indexOf('分派开发人员(DAT):') !== -1) {
          data.developer = itemTxt.replace('分派开发人员(DAT):', '').trim()
          data.developer = data.developer.replace(/\w/g, '')
        } else if (itemTxt.indexOf('被分派开发项目经理:') !== -1) {
          data.remark = data.remark + (itemTxt.replace('被分派开发项目经理:', '').trim())
          data.remark = data.remark.replace(/\w/g, '')
        } else if (itemTxt.indexOf('系统分类:') !== -1) {
          data.systemName = itemTxt.replace('系统分类:', '').trim()
        }
      }
      const trss = document.querySelectorAll('#issuedetails tr')
      for (let i = 0; i < trss.length; i++) {
        let itemTxt = (trss[i].innerText).toString();
        if (itemTxt.indexOf('编号:') !== -1) {
          data.testContent = itemTxt.replace('编号:', '').trim()
        } else if (itemTxt.indexOf('报告人:') !== -1) {
          data.tester = itemTxt.replace('报告人:', '').trim()
          data.tester = data.tester.replace(/\w/g, '')
        }
      }

      let seqInfo = {}
      const seqInfoStr = localStorage.getItem(data.SEQ)
      if (seqInfoStr) {
        seqInfo = JSON.parse(seqInfoStr)
      }
      for (const key in seqInfo) {
        if (Object.prototype.hasOwnProperty.call(seqInfo, key)) {
          if (key !== 'buildInfo') {
            if (document.getElementById(key)) {
              document.getElementById(key).value = seqInfo[key]
            }
          }
        }
      }
      const describeText = document.querySelector('h3.formtitle').innerText;
      seqInfo.describe = describeText;
      document.getElementById('describe').value = describeText;

      function checkData() {
        data.DSSJ = seqInfo.sjsw || ''
        data.projectName = seqInfo.projectName || ''
        data.projectUserEmail = seqInfo.projectUserEmail || ''
        if (!data.DSSJ) {
          alert("请输入升级事务号");
          return false;
        }
        if (!data.projectName) {
          alert("请输入项目名称");
          return false;
        }
        if (!data.projectUserEmail) {
          alert("请输入项目经理邮箱");
          return false;
        }
        if (seqInfo.describe) {
          data.describe = seqInfo.describe
        }
        data.mailOptions.cc = data.mailOptions.cc + ', ' + data.projectUserEmail
        return true;
      }
      function sendEmail() {
        const value = checkData();
        if (!value) {
          return value;
        }
        getBuildInfo().then((res) => {
          seqInfo.buildInfo = res.data
          localStorage.setItem(data.SEQ, JSON.stringify(seqInfo))
          if (data.product === 'DAT') {
            data.urlList = seqInfo.buildInfo.map((item) => {
              return {
                buildUrl: item['DAT构建地址（登记一下）'] || '',
                mergeUrl: item['merge-dat'] || ''
              }
            })
          }
          const flag = confirm("你确定要发送紧急升级邮件吗？");
          if (!flag) {
            return false;
          }
          fetch('http://localhost:3000/devops/sendEmail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
            .then(response => response.json())
            .then(data => {
              alert("邮件发送成功！");
              console.log('Success:', data);
            })
            .catch((error) => {
              console.error('Error:', error);
            });
        })
      }
      document.getElementById('send-email').addEventListener('click', sendEmail)
      function handleCopyDDL() {
        const value = checkData();
        if (!value) {
          return value;
        }
        getBuildInfo().then((res) => {
          seqInfo.buildInfo = res.data
          localStorage.setItem(data.SEQ, JSON.stringify(seqInfo))
          if (data.product === 'DAT') {
            data.urlList = seqInfo.buildInfo.map((item) => {
              return {
                buildUrl: item['DAT构建地址（登记一下）'] || '',
                mergeUrl: item['merge-dat'] || ''
              }
            })
          }
          // 获取需要复制的文字
          let copyStr = ''
          if (data.product === 'DAT') {
            copyStr = copyStr + '\n' + data.DSSJ
            data.urlList.forEach((item) => {
              copyStr = copyStr + '\n' + item.mergeUrl + ' 选分支' + data.SEQ + '\n' + item.buildUrl
            })
            copyStr = copyStr + '\n' + data.testContent + ' 邮件已发送， 麻烦构建下'
          }
          // 创建input标签存放需要复制的文字
          const oInput = document.createElement('textarea')
          // 把文字放进input中，供复制
          oInput.value = copyStr
          document.body.appendChild(oInput)
          // 选中创建的input
          oInput.select()
          // 执行复制方法， 该方法返回bool类型的结果，告诉我们是否复制成功
          const copyResult = document.execCommand('copy')
          // 操作中完成后 从Dom中删除创建的input
          document.body.removeChild(oInput)
          // 根据返回的复制结果 给用户不同的提示
          if (copyResult) {
            alert("已复制到粘贴板");
          } else {
            alert("复制失败");
          }
        })
      }
      document.getElementById('copy-content').addEventListener('click', handleCopyDDL)

      function blurEvent(e) {
        seqInfo[e.target.dataset.key] = e.target.value
        localStorage.setItem(data.SEQ, JSON.stringify(seqInfo))
      }
      document.getElementById('sjsw').addEventListener('blur', blurEvent)
      document.getElementById('projectName').addEventListener('blur', blurEvent)
      document.getElementById('describe').addEventListener('blur', blurEvent)
      document.getElementById('reason').addEventListener('blur', blurEvent)
      document.getElementById('projectUserEmail').addEventListener('blur', blurEvent)
    })

    // The HTML string you want to add to the page
    const htmlString = `
      <div id="my-added-div" style="border: 1px solid black; padding: 10px; margin: 10px;">
          <button id="send-email">发送紧急升级邮件</button>
          <button id="copy-content">复制微信流程内容</button>
          <br/>
          <br/>
          <input type="text" id="sjsw" data-key="sjsw" placeholder="请输入升级事务号">
          <input type="text" id="projectName" data-key="projectName"  placeholder="请输入项目名称">
          <input type="text" id="productDate" data-key="productDate" placeholder="请输入上线时间">
          <input type="text" id="projectUserEmail" data-key="projectUserEmail" placeholder="请输入项目经理邮箱" style="width: 325px;">
          <br/>
          <br/>
          <textarea id="describe" data-key="describe" placeholder="请输入简要概述" rows="5" style="width:400px;"></textarea>
          <textarea id="reason" data-key="reason" placeholder="请输入紧急升级原因" rows="5" style="width:400px;"></textarea>
          <div style="padding: 10px;">
      </div>
  `;

    // Select where you want to add the HTML (e.g., the end of the body)
    const targetElement = document.body;

    // Insert the HTML string into the DOM
    targetElement.insertAdjacentHTML('beforeend', htmlString);
  }
  function dssjPageHandle() {
    window.addEventListener('load', function () {
      const trs = document.querySelectorAll('#tab1 tr')
      for (let i = 0; i < trs.length; i++) {
        let itemTxt = (trs[i].innerText).toString();
        if (itemTxt.indexOf('升级事务号:') !== -1) {
          data.SEQ = itemTxt.replace('升级事务号:', '').trim()
        } else if (itemTxt.indexOf('DAT测试开始时间:') !== -1) {
          data.testDate = itemTxt.replace('DAT测试开始时间:', '').trim()
        }
      }
      const trss = document.querySelectorAll('#issuedetails tr')
      for (let i = 0; i < trss.length; i++) {
        let itemTxt = (trss[i].innerText).toString();
        if (itemTxt.indexOf('编号:') !== -1) {
          data.DSSJ = itemTxt.replace('编号:', '').trim()
        }
      }
      let seqInfo = {}
      const seqInfoStr = localStorage.getItem(data.SEQ)
      if (seqInfoStr) {
        seqInfo = JSON.parse(seqInfoStr)
      }
      const describeText = document.querySelector('h3.formtitle').innerText;
      seqInfo.seqName = describeText;
      data.seqName = describeText;
      for (const key in seqInfo) {
        if (Object.prototype.hasOwnProperty.call(seqInfo, key)) {
          if (key !== 'buildInfo') {
            if (document.getElementById(key)) {
              document.getElementById(key).value = seqInfo[key]
            }
          }
        }
      }
      seqInfo.testDate = data.testDate
      localStorage.setItem(data.SEQ, JSON.stringify(seqInfo))
      function createVersionExcel() {
        if (!seqInfo.projectName) {
          alert("请输入项目名称");
          return false;
        }
        data.projectName = seqInfo.projectName
        data.stgBranchName = seqInfo.stgBranchName
        getBuildInfo().then((res) => {
          seqInfo.buildInfo = res.data
          localStorage.setItem(data.SEQ, JSON.stringify(seqInfo))
          let urlList = seqInfo.buildInfo.map((item) => {
            return {
              gitUrl: item['Gitlab地址(登记一下)注意加上.git'],
              mergeDatUrl: item['merge-dat'],
              buildDatUrl: item['DAT构建地址（登记一下）'],
              mergeStgUrl: item['merge-stg'],
              buildStgUrl: item['STG构建地址(登记一下)'],
            }
          })
          const params = {
            urlList:JSON.stringify(urlList),
            DSSJ: data.DSSJ,
            SEQ: data.SEQ,
            seqName: data.seqName,
            projectName: data.projectName,
            stgBranchName: data.stgBranchName
          }
          const flag = confirm("你确定要生成版本文件吗？");
          if (!flag) {
            return false;
          }
          function objectToQueryString(obj) {
            return Object.keys(obj)
              .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
              .join('&');
          }
          const url = 'http://localhost:3000/devops/createVersionExcel';
          const queryString = objectToQueryString(params);
          window.location.href = `${url}?${queryString}`;
        })
      }
      document.getElementById('create-version-excel').addEventListener('click', createVersionExcel)
      function blurEvent(e) {
        seqInfo[e.target.dataset.key] = e.target.value
        localStorage.setItem(data.SEQ, JSON.stringify(seqInfo))
      }
      document.getElementById('projectName').addEventListener('blur', blurEvent)
      document.getElementById('stgBranchName').addEventListener('blur', blurEvent)
      function handleCopyDDL(e) {
        const env = e.target.dataset.env
        if (!seqInfo.projectName) {
          alert("请输入项目名称");
          return false;
        }
        data.projectName = seqInfo.projectName
        getBuildInfo().then((res) => {
          seqInfo.buildInfo = res.data
          localStorage.setItem(data.SEQ, JSON.stringify(seqInfo))
          // 获取需要复制的文字
          let copyStr = ''
          copyStr = copyStr + data.DSSJ
          seqInfo.buildInfo.forEach((item) => {
            if (env === 'DAT') {
              copyStr = copyStr + '\n' + item['merge-dat'] + ' 选分支' + data.SEQ + '\n' + item['DAT构建地址（登记一下）']
            } else if (env === 'STG') {
              copyStr = copyStr + '\n' + item['merge-stg'] + ' 选分支' + data.SEQ + '\n' + item['STG构建地址(登记一下)']
            } else if (env === 'PRD') {
              copyStr = copyStr + '\n' + item['PRD构建地址(登记一下)'] + ' 选分支' + seqInfo.stgBranchName
            }
          })
          copyStr = copyStr + '\n麻烦构建下'
          // 创建input标签存放需要复制的文字
          const oInput = document.createElement('textarea')
          // 把文字放进input中，供复制
          oInput.value = copyStr
          document.body.appendChild(oInput)
          // 选中创建的input
          oInput.select()
          // 执行复制方法， 该方法返回bool类型的结果，告诉我们是否复制成功
          const copyResult = document.execCommand('copy')
          // 操作中完成后 从Dom中删除创建的input
          document.body.removeChild(oInput)
          // 根据返回的复制结果 给用户不同的提示
          if (copyResult) {
            alert("已复制到粘贴板");
          } else {
            alert("复制失败");
          }
        })
      }
      document.getElementById('copy-content-dat').addEventListener('click', handleCopyDDL)
      document.getElementById('copy-content-stg').addEventListener('click', handleCopyDDL)
      document.getElementById('copy-content-prd').addEventListener('click', handleCopyDDL)
    })
    // The HTML string you want to add to the page
    const htmlString = `
       <div id="my-added-div" style="border: 1px solid black; padding: 10px; margin: 10px;">
          <button id="create-version-excel">生成版本文件</button>
          <button id="copy-content-dat" data-env="DAT">复制DAT微信流程内容</button>
          <button id="copy-content-stg" data-env="STG">复制STG微信流程内容</button>
          <button id="copy-content-prd" data-env="PRD">复制PRD微信流程内容</button>
          <input type="text" id="projectName" data-key="projectName"  placeholder="请输入项目名称">
          <input type="text" id="stgBranchName" data-key="stgBranchName"  placeholder="请输入STG分支名称">
       </div>
       <div style="padding: 10px;">
       `;

    // Select where you want to add the HTML (e.g., the end of the body)
    const targetElement = document.body;

    // Insert the HTML string into the DOM
    targetElement.insertAdjacentHTML('beforeend', htmlString);
  }
  // Check the current URL and run the appropriate function
  if (window.location.pathname.includes('DATBUG')) {
    bugPageHandle();
  } else if (window.location.pathname.includes('DSSJ')) {
    dssjPageHandle();
  }
})();