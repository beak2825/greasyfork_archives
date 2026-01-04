// ==UserScript==
// @name         bitableToJira Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  one-click import jira from bitable
// @author       wuyanchun
// @match        https://bytedance.feishu.cn/*
// @downloadURL https://update.greasyfork.org/scripts/406393/bitableToJira%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/406393/bitableToJira%20Helper.meta.js
// ==/UserScript==

const btn = document.createElement('button');
btn.innerText = '导出数据';
btn.style.color = 'white';
btn.style.backgroundColor = 'green';
btn.style.width = '80px';
btn.style.height = '40px';
btn.style.border = 'none';
btn.style.position = 'fixed';
btn.style.top = '102px';
btn.style.right = '50px';
document.body.appendChild(btn);

const larkcloudUrl = 'https://cloudapi.bytedance.net/faas/services/ttb7r1/invoke/index';

btn.addEventListener('click', () => {
    const data = parseBitable();
    Toast.removeAll();
    Toast.show({
      type: 'info',
      content: '正在处理中...请耐心等待',
      duration: 2000
    })
    fetch(larkcloudUrl, {
      method: 'POST',
      body: JSON.stringify({
        data
      })
    })
    .then(res => res.json()).then(async json => {
      console.log(json);
      if (json.code) {
        // 创建jiraKey字段
        const fieldId = await addField();
        let jiraIssues = json.data;
        jiraIssues = jiraIssues.map(issue => {
          issue.fieldId = fieldId;
          return issue;
        })
        const newRecords = await Promise.all(jiraIssues.map(setRecord));
        Toast.removeAll();
        Toast.show({
          type: 'success',
          content: '创建jira成功',
          duration: 2000
        })
      } else {
        Toast.removeAll();
        Toast.show({
          type: 'error',
          content: `${json.msg}`,
          duration: 2000
        })
        console.log(json.error);
      }
      console.log(json);
    })
    .catch(err => {
      console.error('err', err);
      Toast.removeAll();
      Toast.show({
        type: 'error',
        content: '出现异常',
        duration: 2000
      })
    });
});

async function setRecord(issue) {
  const { fieldId, recordId, key } = issue;
  const table = renderer.getActiveTable();
  const view = renderer.getActiveView();
  const tableId = table.id;
  const viewId = view.id;
  const commandManager = renderer.commandManager;
  return await commandManager.execute({
    cmd: 'SetRecord',
    tableId: tableId,
    viewId: viewId,
    recordId,
    data: {
      [fieldId]: {
        type: 1,
        value: [
          {
            type: 'text',
            text: key
          }
        ]
      }
    }
  })
}

async function addField() {
  const fieldName = 'jiraKey';
  const hasField = isExistField(fieldName)
  if (hasField) return hasField;
  const table = renderer.getActiveTable();
  const view = renderer.getActiveView();
  const tableId = table.id;
  const viewId = view.id;
  const commandManager = renderer.commandManager;
  const field = await commandManager.execute({
    cmd: 'AddField',
    tableId: tableId,
    viewId: viewId,
    data: {
      type: 1,
      name: fieldName, 
      property: null
    }
  })
  return field.data.fieldId;
}

function isExistField(fieldName) {
  const table = renderer.getActiveTable();
  const fields = table.fields;
  const fieldIds = Object.keys(fields);
  let existfFieldId;
  fieldIds.forEach(fieldId => {
    if (fields[fieldId].name === fieldName) {
      existfFieldId = fieldId;
    }
  })
  if (existfFieldId) {
    return existfFieldId;
  }
  return false
}

function parseBitable() {
    const view = renderer.getActiveView();
    const gridWidget = renderer.activeBitableWidget.getGridWidget();
    let fields = {};
    view.property.fields.map(fieldId => {
        fields[fieldId] = view.table.fields[fieldId];
    });

    try {
        const options = Object.values(fields).reduce((acc, curr) => {
            if (curr.property && curr.property.options) {
                const optionsObj = curr.property.options.reduce((obj, option) => {
                    obj[option.id] = option.name;
                    return obj;
                }, {});
                return {...acc, ...optionsObj};
            }
            return acc;
        }, {});
        const selectedRecords = gridWidget.getSelectRecords();
        let records = selectedRecords.length ? selectedRecords : view.property.records;
        records = records.map(recordId => {
          return {
            recordId,
            value: view.table.records[recordId]
          }
        });
        const data = records.map((record, index) => {
            const formattedData = {};
            formattedData.recordId = record.recordId;
            record = record.value;
            for (let key in record) {
              const columnData = record[key].value;
              const field = fields[key];
              let value = '';
              if (typeof columnData === 'string') {   // 选项
                  value = options[columnData];
              }
              if (typeof columnData === 'boolean') {  // 复选框
                  value = columnData
              }
              if (Array.isArray(columnData) && columnData.length) {   
                  value = columnData.reduce((accValue, item) => {
                      let type = item.type || (item.attachmentToken && 'attachment') || typeof item;
                      switch (type) {
                          case 'text':
                              accValue += item.text;
                              break;
                          case 'mention':
                              if (item.mentionType === 0) {
                                  accValue += `${item.name} `;
                              } else if (item.mentionType === 1) {
                                  accValue += item.link;
                              }
                              break;
                          case 'string':
                              accValue += `${options[item]}, `;
                              break;
                          case 'attachment':
                              accValue += `https://internal-api.feishu.cn/space/api/box/stream/download/all/${item.attachmentToken}\n`;
                              break;
                          case 'url':
                              accValue += item.link;
                      }
                      return accValue;
                  }, '');
              }

              if (Object.prototype.toString.call(columnData).slice(8, -1) === 'Object') {
                  const users = columnData.users.map(user => user.name) || [];
                  value = users.join('&');
              }
              field && (formattedData[field.name] = value);
            }
            return formattedData;
        });
        return data;
    } catch(err) {
        console.error(err);
        Toast.removeAll();
        Toast.show({
          type: 'error',
          content: `解析 Bitable 数据出错`,
          duration: 2000
        })
        return [];
    }
}
