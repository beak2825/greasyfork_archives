// ==UserScript==
// @name        美团-导出表格
// @namespace   Violentmonkey Scripts
// @match       https://km.sankuai.com/page/*
// @grant       none
// @version     2.0
// @author      -
// @description 2021/8/25 下午8:16:44
// @require https://cdn.bootcdn.net/ajax/libs/exceljs/4.2.1/exceljs.min.js
// @downloadURL https://update.greasyfork.org/scripts/431217/%E7%BE%8E%E5%9B%A2-%E5%AF%BC%E5%87%BA%E8%A1%A8%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/431217/%E7%BE%8E%E5%9B%A2-%E5%AF%BC%E5%87%BA%E8%A1%A8%E6%A0%BC.meta.js
// ==/UserScript==


(function () {
  'use strict';
  let exportBtn = null;
  const createUserList = ['杨佳丽', '庞布斯', 'pangbusi', 'yangjiali03'];
  let timerStart = +new Date();
  let reqId = null;
  // Your code here...
  function init() {
    if (+new Date() > timerStart + 5000) {
      cancelAnimationFrame(reqId)
    } else {
      try {
        let createUser = document.getElementsByClassName('ct-user-name')[0].innerText;
        if (createUserList.includes(createUser)) {
          exportBtn = document.createElement("button");
          exportBtn.innerText = "导出"
          exportBtn.style.width = "180px";
          exportBtn.style.height = "80px";
          exportBtn.style.align = "center";
          exportBtn.style.background = "#6496c8";
          exportBtn.style.border = "none";//52
          exportBtn.style.borderRadius = "10px"
          exportBtn.style.color = "#fff";
          exportBtn.style.position = "absolute"
          exportBtn.style.left = "1000px"
          exportBtn.style.top = "100px"
          exportBtn.id = "but"
          document.querySelector('body').appendChild(exportBtn)
        }
        cancelAnimationFrame(reqId)
      } catch(e) {
        reqId = requestAnimationFrame(init)
      }
    }
  }

  function exportExcel(retData) {
    const workbook = new ExcelJS.Workbook();
    // 在加载时强制工作簿计算属性
    workbook.calcProperties.fullCalcOnLoad = true;

    // 创建一个具有属性的可写的新工作表
    const worksheet = workbook.addWorksheet('sheet', { properties: { outlineLevelCol: 1 } });
    // 使工作表可见
    worksheet.state = 'visible';
    // 之后调整属性（工作表读写器不支持该操作）
    worksheet.properties.outlineLevelCol = 2;
    worksheet.properties.defaultRowHeight = 15;

    // 添加列标题并定义列键和宽度
    // 注意：这些列结构仅是构建工作簿的方便之处，除了列宽之外，它们不会完全保留。
    worksheet.columns = [
      { header: '姓名', key: 'name', width: 20 },
      { header: '出勤天数系数（标准值：5天）', key: 'attend', width: 40 },
      { header: '5', key: 'coefficient_1', width: 10, outlineLevel: 1 },
      { header: '一面数1（来自业务侧和Recruiter侧简历的安排一面数）', key: 'interview_1', width: 60 },
      { header: '50', key: 'coefficient_2', width: 10 },
      { header: '有效简历数（自主Sourcing简历评审通过数量）', key: 'valid_resume', width: 60 },
      { header: '50', key: 'coefficient_3', width: 10 },
      { header: '一面数2（自主Sourcing简历的安排一面数）', key: 'interview_2', width: 60 },
      { header: '25', key: 'coefficient_4', width: 10 },
      { header: '面试通过数（自主Sourcing简历通过数量）', key: 'count_pass', width: 60 },
      { header: '1', key: 'coefficient_5', width: 10 },
      { header: '总计完成度', key: 'total_completion', width: 20 },
      { header: '', key: 'pass_interviewer', width: 50 },
    ];

    retData.forEach((item) => {
      worksheet.addRow(item);
    })
    // 设置每一列样式 居中
    const row = worksheet.getRow(1);
    row.eachCell((cell, rowNumber) => {
      worksheet.getColumn(rowNumber).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      writeFile('数据.xlsx', buffer);
    });

    // 将二进制转为Excel并下载
    const writeFile = (fileName, content) => {
      let a = document.createElement("a");
      let blob = new Blob([content], { type: "text/plain" });

      a.download = fileName;
      a.href = URL.createObjectURL(blob);
      a.click();
    };
  }
  function bindExportEvent(exportBtn) {
    exportBtn.onclick = function () {
      // read & deal Data
      const tbs = [...document.getElementsByTagName('table')].slice(1);
      const [data, indicator] = [...tbs]
      const data_trs = [...data.children[2].children].slice(1);
      // 第二张表，未用到
      // const indicator_trs = [...data.children[2].children].slice(1);


      let retData = []
      const originData = []
      data_trs.forEach(item => {
        let temp_Arr = []
        item.children.forEach(value => {
          temp_Arr.push(value.innerText)
        })
        originData.push(temp_Arr)
        // let formula = temp_Arr[3] / temp_Arr[4] * 0.4 + temp_Arr[5] / temp_Arr[6] * 0.1 + temp_Arr[7] / temp_Arr[8] * 0.4 + Number(temp_Arr[9]) !== 0 ? Number(temp_Arr[9]) * 0.1 : 0
      })

      originData.forEach(item => {
        let ret = []
        ret[0] = item[0]
        ret[1] = item[1]
        ret[2] = item[1] / 5
        ret[3] = item[2]
        ret[4] = 50 * item[1] / 5
        ret[5] = item[3]
        ret[6] = 50 * item[1] / 5
        ret[7] = item[4]
        ret[8] = 25 * item[1] / 5
        ret[9] = item[5] !== "" ? item[5].split('（')[0] : ""
        ret[10] = 1
        ret[11] = (item[2] / ret[4] * 0.4) + (item[3] / ret[6] * 0.1) + (item[4] / ret[8] * 0.4) + (item[5] !== "" ? Number(ret[9]) / ret[2]  * 0.1 : 0)
        console.log(ret, item, 123);
        ret[11] = (ret[11] * 100).toFixed(0)
        ret[12] = item[5] !== "" ? item[5].slice(1) : ""
        retData.push(ret)
      })

      retData = retData.sort((a, b) => parseFloat(b[11] - parseFloat(a[11])))
      retData.forEach(item => {
        item[11] += "%"
      })
    }
  }
  

  // 主流程
  init()
  if (exportBtn) {
    bindExportEvent(exportBtn) 
  }

})();