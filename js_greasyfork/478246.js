// ==UserScript==
// @name        迭代初始化 1.0
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description An example to upload and read Excel file in Redmine.
// @author      小慢
// @match     
// @grant       GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/478246/%E8%BF%AD%E4%BB%A3%E5%88%9D%E5%A7%8B%E5%8C%96%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/478246/%E8%BF%AD%E4%BB%A3%E5%88%9D%E5%A7%8B%E5%8C%96%2010.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const apiKey = 'c05d327406396c03c8ae43033d66229c886a9af4';

    const redmineUrl = '';


    // 优先级定义
    const priority = {"P0": 1,"P1": 2,"P2": 3,"P3": 4}
    // 需求文档地址前缀
    const issueLinkPrefix = "jojoread.yuque.com"

    // 查询迭代列表的 table
    var buttons = document.querySelectorAll("td.buttons");

    var projectId = 0;
    if (window.location.href.includes("cc_sprint")) {
        projectId = 72;
    }


    for (var buttonItem of buttons) {
        
        var initBtn = document.createElement("input");
        initBtn.setAttribute("class", "init-sprint");
        initBtn.setAttribute("type", "button");
        initBtn.setAttribute("value", "迭代初始化");
        initBtn.style.marginLeft = '5px';

        var editButton = buttonItem.querySelector('a.icon-edit');
        if (editButton) {
            buttonItem.insertBefore(initBtn, editButton.previousSibling);
        } else {
            // 如果没找到编辑按钮，就直接添加到td元素末尾
            buttonItem.appendChild(initBtn);
        }
    }

    var initBtns= ($(".init-sprint"));

   // 按钮点击事件处理函数
   initBtns.click(function() {
        // 创建输入文本框的弹出框及样式设置
        const inputBox = $('<div>').addClass('input-popup').html('<input type="text" id="issueLink" placeholder="需求链接"><br><button id="confirmButton">确定</button><button id="cancelButton">取消</button>');

        // 获取按钮的兄弟节点中的编辑和删除链接的href属性
        var editHref = $(this).siblings('a.icon-edit').attr('href');
        // 从编辑链接的href属性中提取数字
        var matchNum = editHref.match(/(\d+)/);
        
        if (!matchNum) {
            alert("获取迭代ID失败")
        }
        var sprintId = matchNum[1];
        console.log(sprintId);

        // 获取当前按钮所在的行（tr元素）
        var row = $(this).closest('tr');
        // 获取当前行下的第一个td元素中的链接文本内容
        var sprintName = row.find('td:first-child a').text().replace("sprint","SP");
        
        
        const overlay = $('<div>').addClass('overlay').css({
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'background-color': 'rgba(0, 0, 0, 0.5)',
            'z-index': '9998',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center'
        });
        overlay.append(inputBox);
        $('body').append(overlay);

        // 确定按钮点击事件处理函数
        $('#confirmButton').on('click', function() {
            const inputValue = $('#issueLink').val();        
            // 移除弹出框
            overlay.remove();
           var dataArr = buildData(inputValue,sprintId,sprintName);
            for (let data of dataArr) {
                create(data)
            }

        });

        // 取消按钮点击事件处理函数
        $('#cancelButton').on('click', function() {
            // 移除弹出框
            overlay.remove();
        });
    });
    // 样式定义
   $('head').append('<style>.input-popup { background-color: white; padding: 20px; border-radius: 4px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); }.input-popup input { margin-bottom: 10px; width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }.input-popup button { background-color: #4CAF50; color: white; border: none; padding: 5px 18px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 4px; cursor: pointer; margin-right: 10px; }.input-popup button:last-child { margin-right: 0; }</style>');



    function buildData(link, sprintId, springName){
        return  [
            {
                "需求": {
                    "text": "【产品】"+springName+"-值班",
                    "link": link
                },
                "序号": "01",
                "优先级": "P0",
                "迭代": sprintId
            },
             {
                "需求": {
                    "text": "【产品】"+springName+"-杂项",
                    "link": link
                },
                "序号": "02",
                "优先级": "P0",
                "迭代": sprintId
            },
             {
                "需求": {
                    "text": "【产品】"+springName+"-SM日常",
                    "link": link
                },
                "序号": "03",
                "优先级": "P0",
                "迭代": sprintId
            },
       ]
    }


    function create(data){
        var issueSource = "业务需求";
        if (data["需求"]["text"].includes("【技术】")) {
            issueSource = "技术需求";
        }
       if (data["需求"]["text"].includes("【产品】")) {
            issueSource = "产品需求";
        }
        const newIssueData = {
            "issue": {
                // Replace with actual values
                "project_id": projectId, //
                "tracker_id": 1, //
                "subject": data['序号']+data["需求"]["text"],
                "description": '',
                "status_id": 1,  // 1:新建
                "priority_id": priority[data["优先级"]],
                "custom_field_values": {
                    "3": [], // 对应端 ["服务端","iOS","Android","H5","PC"]
                    "4": issueSource,
                    "5": data["需求"]["link"],
                    "6": '',
                    "7": ''
                },
                "agile_data_attributes": {
                    "story_points": 0,
                    "agile_sprint_id": parseInt(data["迭代"])
                }
            }
        };

        
        fetch(`${redmineUrl}issues.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Redmine-API-Key': apiKey
            },
            body: JSON.stringify(newIssueData) 
        })
            .then(response => response.json())
            .then(result => {
            console.log(`创建需求成功：${newIssueData["issue"]["subject"]}，需求号为： ${result.issue.id}`);
            console.log(result)
            var updateIssueData = {
                "sprintId": newIssueData["issue"]["agile_data_attributes"]["agile_sprint_id"]
            }
            update(result,updateIssueData)
        })
    }

    function update(data, updateIssueData){

        // 编辑新建的时候无法调整的字段
        const issueId = data.issue.id; // Replace with actual Issue Id to be updated
        const issueData = {
            "issue": {
                "agile_data_attributes": {
                    "agile_sprint_id": updateIssueData.sprintId // 关联迭代
                }
            }
        };

        fetch(`${redmineUrl}issues/${issueId}.json`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Redmine-API-Key': apiKey
            },
            body: JSON.stringify(issueData) // convert JavaScript object to JSON string
        })
            .then(response => {
            if (response.ok) {
                console.log(`更新需求成功：${data["issue"]["subject"]}，需求号为： ${data.issue.id}`);
            } else {
                console.log(`更新需求接口响应失败： ${data.issue.id}`);
            }
        })
}

})();