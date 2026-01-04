// ==UserScript==
// @name        更改考研成绩显示【仅限江苏省考试院】
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  进入查询考研成绩的页面，会自动弹窗更改考研成绩，按照步骤操作，总分会自动计算加和
// @author        咩咩怪！
// @match      *gkcx.jseea.cn/yjscx/logon*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527923/%E6%9B%B4%E6%94%B9%E8%80%83%E7%A0%94%E6%88%90%E7%BB%A9%E6%98%BE%E7%A4%BA%E3%80%90%E4%BB%85%E9%99%90%E6%B1%9F%E8%8B%8F%E7%9C%81%E8%80%83%E8%AF%95%E9%99%A2%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/527923/%E6%9B%B4%E6%94%B9%E8%80%83%E7%A0%94%E6%88%90%E7%BB%A9%E6%98%BE%E7%A4%BA%E3%80%90%E4%BB%85%E9%99%90%E6%B1%9F%E8%8B%8F%E7%9C%81%E8%80%83%E8%AF%95%E9%99%A2%E3%80%91.meta.js
// ==/UserScript==

// 创建悬浮窗
var floatWindow = document.createElement("div");
floatWindow.className = "float-window";

// 创建容器
const container = document.createElement('div');
container.id = 'score-input-container';

// 获取第一个 class=watermarkBox 的 div
let watermarkBox = document.getElementsByClassName('watermarkBox')[0];

// 定义两个数组用于存储结果
let subjects = [];
let relevantRows = []; // 提前声明
let rows1; // 提前声明

if (watermarkBox) {
  // 获取第一个 table
  const firstTable = watermarkBox.getElementsByTagName('table')[0];

  if (firstTable) {
    // 获取表格的行（tr）
    rows1 = firstTable.rows;

    console.log(rows1); // 打印结果

    // 获取第三到第六个 tr（索引从 0 开始，所以是 2、3、4、5）
    relevantRows = [
      rows1[2],
      rows1[3],
      rows1[4],
      rows1[5]
    ];

    console.log(relevantRows);

    // 遍历这些行并找到 class=titltT 的元素
    relevantRows.forEach(row => {
      if (row) {
        // 获取 class=titltT 的元素
        const titleElement = row.getElementsByClassName('titleT')[0];
        console.log(titleElement);
        if (titleElement) {
          subjects.push(titleElement.innerHTML);
        }
      }
    });

    console.log(subjects); // 打印结果
  }
}

// 创建每一行
subjects.forEach(subject => {
    const subjectRow = document.createElement('div');
    subjectRow.className = 'subject-row';

    const label = document.createElement('label');
    label.textContent = subject + ':';
    label.style.marginRight = '10px';

    const input = document.createElement('input');
    input.type = 'text';
    input.name = subject;
    input.id = subject;

    subjectRow.appendChild(label);
    subjectRow.appendChild(input);
    container.appendChild(subjectRow);
});

// 创建按钮
const button = document.createElement('button');
button.textContent = '提交';
button.onclick = function() {
    if (!relevantRows || !rows1) { // 检查是否存在
        alert("Error: 未找到相关行，无法提交。");
        return;
    }

    // 遍历所有输入框并获取值
    const values = subjects.map(subject => {
      const value = document.getElementById(subject).value;
      console.log(`${subject}: ${value}`);
      const numValue = parseFloat(value); // 转换为数值
      return isNaN(numValue) ? 0 : numValue; // 非数字时用 0 替代
    });
  
    // 更新表格中的 titlebluT 元素
    relevantRows.forEach((elem, index) => {
        console.log(elem, values[index]);
      elem.getElementsByClassName('titlebluT')[0].innerHTML = values[index]; // 填入对应数值
    });
  
    // 计算总和
    const total = values.reduce((sum, current) => sum + current, 0);
    console.log(`总和为：${total}`);
  
    // 获取第七个 titlebluT 元素的行（假设是第六个 tr，索引为5）
    if (rows1.length > 6) { // 检查索引是否有效
      let seventhRow = rows1[6]; // 第七个 tr 索引为6
      if (seventhRow) {
        const seventhTitlebluT = seventhRow.getElementsByClassName('titlebluT')[0];
        if (seventhTitlebluT) {
          seventhTitlebluT.innerHTML = total; // 更新总和
        }
      }
    }
  
    alert('各科分数已更改，总分已计算更新');
};
container.appendChild(button);

// 将容器添加到悬浮窗
floatWindow.appendChild(container);

// 将悬浮窗添加到body
document.body.appendChild(floatWindow);

// ...之前的代码不变...

// 创建样式
var style = document.createElement("style");
style.innerHTML = `
  .float-window {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(145deg, #4a90e2, #63b5ff);
    border-radius: 15px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    padding: 20px 30px;
    z-index: 9999;
    font-family: 'Segoe UI', system-ui, sans-serif;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255,255,255,0.2);
    min-width: 320px;
  }

  #score-input-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .subject-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .subject-row label {
    color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
    font-size: 14px;
    font-weight: 500;
    min-width: 100px;
    text-align: right;
    margin-right: 15px;
  }

  .subject-row input {
    flex: 1;
    padding: 10px 15px;
    border: none;
    border-radius: 8px;
    background: rgba(255,255,255,0.9);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    font-size: 14px;
    max-width: 150px;
  }

  .subject-row input:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(74,144,226,0.3);
    background: white;
  }

  button {
    align-self: center;
    background: linear-gradient(145deg, #00c853, #00e676);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 25px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0,200,83,0.3);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 10px;
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,200,83,0.4);
  }

  button:active {
    transform: translateY(1px);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, -20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }

  .float-window {
    animation: fadeIn 0.4s ease-out;
  }
`;
document.head.appendChild(style);