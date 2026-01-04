// ==UserScript==
// @name         自动创建任务表单
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Fill Vue form automatically
// @author       大旭
// @match        https://energyfuture.top/energyFutureBusiness/staging/myTask/index
// @grant        none
// @license      MIT
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/487586/%E8%87%AA%E5%8A%A8%E5%88%9B%E5%BB%BA%E4%BB%BB%E5%8A%A1%E8%A1%A8%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/487586/%E8%87%AA%E5%8A%A8%E5%88%9B%E5%BB%BA%E4%BB%BB%E5%8A%A1%E8%A1%A8%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var isAlreadyHandling = false;
    var changeSource= "01"; // 来自商机
    var taskType = "07"; // 类型（编码）
    var projectPhase = "04"; //阶段（编码）
    var currentUser = "夏东旭";
    var businessName = "";
    var businessAddList = [
        {
            "businessId": "660",
            "businessName": "安徽数字皖电",
        },
        {

            "businessId": "702",
            "businessName": "安徽数字皖电移动应用",
        },
         {
            "businessId": "703",
            "businessName": "安徽数字皖电二期",

        }
    ]
    var taskTypeArr = [
        {
            "dictLabel": "技术交流",
            "dictValue": "01"
        },
        {
            "dictLabel": "现场勘察",
            "dictValue": "02",
        },
        {
            "dictLabel": "需求调研",
            "dictValue": "03",
        },
        {
            "dictLabel": "原型制作",
            "dictValue": "04"
        },
        {
            "dictLabel": "可研及评审",
            "dictValue": "05",
        },
        {
            "dictLabel": "商务招投标",
            "dictValue": "06",
        },
        {
            "dictLabel": "其它",
            "dictValue": "07",
        },
        {
            "dictLabel": "同上",
            "dictValue": "T"
        }
    ]
    $(document).on('DOMSubtreeModified', '.task-top', function() {
      if (!isAlreadyHandling) {
          isAlreadyHandling = true;
          setTimeout(function() {
              isAlreadyHandling = false;
          }, 1000);
          const vueInstance = document.querySelector('.el-form').__vue__;
          // 如果没有找到Vue实例或者批量删除没有打开
          if(!vueInstance || !vueInstance.$parent.$data.batchShow){
            return;
          }
              console.log(vueInstance,'vueInstance')
        // 创建一个固定容器
        var fixedContainer = $('<div>').addClass('fixed-container');
        // 设置容器的样式，使其固定在右侧
        fixedContainer.css({
          position: 'fixed',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          padding: '10px',
          background: 'none',
          zIndex: 1000 // 确保容器在页面上的其他内容之上
        });

        // 创建一个按钮并添加到固定容器中
        var button = $('<button>').text('粘贴导入').addClass('my-button');
        button.css({
          padding: '10px 20px',
          border: 'none',
          background: 'linear-gradient(to right, #fc6174, #ff9a45)',
          color: '#fff',
          borderRadius: '20px'
        })
        fixedContainer.append(button);

        // 将固定容器添加到页面中
        $('.pms-nationwide-main-box').append(fixedContainer);

        // 为按钮添加点击事件处理器
       button.click(function() {
          navigator.clipboard.readText().then(text => {
              let result = parseStringIntoArray(text);
              let batchData = [];
              let memberArr = [
                {
                    "userBy": "648c3f05-2e3e-4e73-b0d4-749605641202",
                    "userName": "解政",
                },
                {
                    "userBy": "b5874069-206b-49bc-a6e9-1751a46ac04a",
                    "userName": "夏东旭",
                },
                {
                    "userBy": "d3c90380-ad80-4c61-a348-a62663273da6",
                    "userName": "程哲",
                }
            ];
              for (let i = 0; i < result.length-1; i++) {
                  batchData.push({
                      planTargetId: "T",
                      taskType: "T",
                      projectPhase: "T",
                      taskContent: result[i].content,
                      taskStartTime: result[i].time,
                      taskEndTime: result[i].time,
                      expectManDay: "1",
                      taskHeadBy: memberArr.filter(item => item.userName == currentUser)[0].userBy
                    })
                  if(i == 0){
                    batchData[i].taskType = taskType;
                    batchData[i].projectPhase = projectPhase;
                    batchData[i].planTargetId = "/"
                    let content = result[i].content;
                    businessName = content.split("：")[0];
                  }

              }
   
              // 修改表单数据
              vueInstance.$parent.$data.batchForm.changeSource= changeSource;
              vueInstance.$parent.$data.businessAddList = businessAddList;
              vueInstance.$parent.$data.batchForm.businessId = businessAddList.filter(item => item.businessName.indexOf(businessName) > -1)[0].businessId; // 安徽数字皖电二期
              vueInstance.$parent.$data.memberArr = memberArr;
              vueInstance.$parent.$data.taskTypeArr = taskTypeArr;
              vueInstance.$parent.$data.seaList.tableData = batchData;
              // 强制Vue重新渲染
              vueInstance.$forceUpdate();
          })
        });
      }
  });

  function parseStringIntoArray(inputString) {
  // 去除空格和回车符
  const cleanedString = inputString.replace(/\s/g, '').replace(/\n/g, '');

  // 按照句号进行分割
  const separatedArray = cleanedString.split('。');

  // 创建最终的数组，包含时间和内容
  const resultArray = [];

  // 遍历分割后的数组
  for (let i = 0; i < separatedArray.length; i++) {
    // 去除每一项的前后空格
    const trimmedItem = separatedArray[i].trim();

    // 分割时间和内容，这里假设日期位于每一段的最前面，且格式为YYYY-MM-DD
    const timeMatch = trimmedItem.match(/^(\d{4}-\d{2}-\d{2})/);
    let time = '';
    let content = trimmedItem;

    // 如果找到时间，将其提取出来
    if (timeMatch) {
      time = timeMatch[0];
      // 去除时间后的剩余部分作为内容
      content = trimmedItem.substring(time.length).trim();
    }

    // 将时间和内容作为对象添加到结果数组中
    resultArray.push({ time, content });
  }

  return resultArray;
}
})();


