// ==UserScript==
// @name         mteam馒头优化
// @namespace    http://tampermonkey.net/
// @version      2024.7.2
// @description  mteam  根据评论数高亮颜色, 筛选，隐藏0评论的种子，骑兵
// @author       plexpt
// @match        https://kp.m-team.cc/*
// @grant        GM_log
// @license      MIT
// @run-at document-end
// @supportURL https://greasyfork.org/en/scripts/409983
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     bootstrapcss https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css
// @resource     facss   https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js
// @downloadURL https://update.greasyfork.org/scripts/409983/mteam%E9%A6%92%E5%A4%B4%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/409983/mteam%E9%A6%92%E5%A4%B4%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  try {
    console.log("开始执行mteam馒头优化脚本");
    // var bootstrapcss = GM_getResourceText("bootstrapcss");
    // GM_addStyle(bootstrapcss);
    // var facss = GM_getResourceText("facss");
    // GM_addStyle(facss);
    //代码添加上面两行代码，让油猴解析CSS

    // 定义变量，用于统计隐藏的0评论种子数量
    let totalHide = 0;
    // 定义变量，用于统计隐藏的骑兵种子数量
    let totalHideCensored = 0;

    // 根据评论数和是否为骑兵来隐藏或显示表格行的函数
    function hideOrShowRows(displayValue, hideZeroComment, hideCensored) {
      // 获取页面中的表格元素
      const mainTable = document.querySelector(".table-fixed")
      // 获取表格中的所有行
      const rows = mainTable.querySelectorAll('tr');

      rows.forEach((row, index) => {
        // 跳过表头，从第二行开始遍历
        if (index > 1) {
          // 获取当前行的第三列（评论数）
          const commentCell = row.cells[2];
          // 将评论数转换为整数
          const commentNum = parseInt(commentCell.innerText);

          // 获取当前行的第一列中的链接
          const categoryLink = row.cells[0].querySelector("a").href;

          row.style.display = '';

          // 检查评论数是否为0或1，并且用户选择隐藏0评论的种子
          if (hideZeroComment && commentNum <= 2) {
            totalHide++;
            // 隐藏行
            row.style.display = displayValue;
            return;
          }
          // 检查分类链接是否包含骑兵相关的分类ID，并且用户选择隐藏骑兵种子
          if (hideCensored && (categoryLink.includes("cat=431") || categoryLink.includes("cat=424") || categoryLink.includes("cat=410") || categoryLink.includes("cat=437"))) {
            totalHide++;
            // 隐藏行
            row.style.display = displayValue;
            return;
          }

        }
      });
    }

    // 封装将div添加到body元素中的函数
    function appendDivToBody() {

      const divall = document.createElement("div");

      // 设置div的样式
      divall.style.cssText = "position: fixed; top: 0; left: 50%; transform: translateX(-50%); padding: 10px 20px; font-size: 14px; background: #409EFF; color: #fff; z-index: 9999; border-radius: 5px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center;";
      // 设置div的文本内容，显示隐藏的种子数量
      divall.textContent = `已隐藏无评论的种子${totalHide}个，骑兵种子${totalHideCensored}个`;
      // 创建一个按钮，用于隐藏0评论的种子
      const buttonHideZeroComment = document.createElement("button");
      // 设置按钮的样式
      buttonHideZeroComment.style.cssText = "color: #409eff; background: #ecf5ff; border-color: #b3d8ff; display: inline-block; line-height: 1; white-space: nowrap; cursor: pointer; -webkit-appearance: none; text-align: center; box-sizing: border-box; outline: none; margin: 0 8px; transition: .1s; font-weight: 300; padding: 6px 10px; font-size: 14px; border-radius: 4px;";
      // 设置按钮的文本内容
      buttonHideZeroComment.innerText = "隐藏0评论种子";
      // 为按钮添加点击事件监听
      buttonHideZeroComment.addEventListener('click', function () {
        // 根据按钮的文本内容切换隐藏或显示0评论种子，并更新按钮的文本和状态
        hideOrShowRows(buttonHideZeroComment.innerText === "隐藏0评论种子" ? 'none' : '', !buttonHideZeroComment.classList.contains('hidden'), buttonHideCensored.classList.contains('hidden'));
        buttonHideZeroComment.innerText = buttonHideZeroComment.innerText === "隐藏0评论种子" ? "显示0评论种子" : "隐藏0评论种子";
        buttonHideZeroComment.classList.toggle('hidden');
      }, false);

      // 创建一个按钮，用于隐藏骑兵种子
      const buttonHideCensored = document.createElement("button");
      // 设置按钮的样式
      buttonHideCensored.style.cssText = "color: #409eff; background: #ecf5ff; border-color: #b3d8ff; display: inline-block; line-height: 1; white-space: nowrap; cursor: pointer; -webkit-appearance: none; text-align: center; box-sizing: border-box; outline: none; margin: 0 8px; transition: .1s; font-weight: 300; padding: 6px 10px; font-size: 14px; border-radius: 4px;";
      // 设置按钮的文本内容
      buttonHideCensored.innerText = "隐藏骑兵种子";
      // 为按钮添加点击事件监听
      buttonHideCensored.addEventListener('click', function () {
        // 根据按钮的文本内容切换隐藏或显示骑兵种子，并更新按钮的文本和状态
        hideOrShowRows(buttonHideCensored.innerText === "隐藏骑兵种子" ? 'none' : '', buttonHideZeroComment.classList.contains('hidden'), !buttonHideCensored.classList.contains('hidden'));
        buttonHideCensored.innerText = buttonHideCensored.innerText === "隐藏骑兵种子" ? "显示骑兵种子" : "隐藏骑兵种子";
        buttonHideCensored.classList.toggle('hidden');
      }, false);

      // 将按钮添加到div中
      divall.appendChild(buttonHideZeroComment);
      divall.appendChild(buttonHideCensored);

      // 获取页面的body元素
      const bodyElement = document.querySelector("#app-content > div");
      // 获取页面中的主表格元素
      const tableElement = document.querySelector("#app-content > div > div.ant-card.ant-card-small.css-1gwm2nm");
      console.log("tableElement", tableElement);

      // 检查bodyElement和tableElement是否存在，然后再插入div
      if (bodyElement) {
        // 将div添加到body元素中，位于主表格之前
        // bodyElement.insertBefore(divall, tableElement);
        document.body.appendChild(divall);

      } else {
        console.error("mteam馒头优化：无法找到body元素或主表格元素，1秒后重试");
        setTimeout(appendDivToBody, 1000);
      }

    }

    // 定义一个函数用于选择并修改“下一页”按钮
    function modifyNextButton(css) {
      // 使用CSS选择器选择符合条件的分页“下一页”按钮
      const nextButton = document.querySelector(css);

      // 检查元素是否存在
      if (nextButton) {
        // 修改按钮的宽度
        nextButton.style.width = '20%'; // 根据需要增加宽度
        nextButton.style.backgroundColor = '#f0f0f0'; // 可选，改变背景颜色
      }
    }

    // 定义一个函数用于模拟点击“下一页”按钮
    function clickNextButton() {
      const nextButton = document.querySelector('.ant-pagination-next');
      if (nextButton) {
        nextButton.click();
      }
    }

    // 定义一个函数用于模拟点击“上一页”按钮
    function clickPrevButton() {
      const prevButton = document.querySelector('.ant-pagination-prev');
      if (prevButton) {
        prevButton.click();
      }
    }


    // 运行函数修改按钮样式
    modifyNextButton();

    // 观察DOM变化以便在内容动态加载时应用修改
    const observer = new MutationObserver(() => {
      modifyNextButton(".ant-pagination-prev");
      modifyNextButton(".ant-pagination-next");
    });

    // 开始观察文档的变化
    observer.observe(document.body, {childList: true, subtree: true});


    //   hideOrShowRows('', false, false);

    // 如果页面上有异步加载的内容，你可能还需要监听window的load事件
    window.addEventListener('load', (event) => {
      // 在这里处理那些需要等待所有资源（如图片）加载完成后的任务
      console.log("mteam馒头优化 load ");
      appendDivToBody();

    });

    // 监听键盘按键事件，添加左右箭头键翻页功能
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        // 按下右箭头键时点击“下一页”按钮
        clickNextButton();
      } else if (event.key === 'ArrowLeft') {
        // 按下左箭头键时点击“上一页”按钮
        clickPrevButton();
      }
    });

  } catch (e) {
    console.error("mteam馒头优化出错了", e);
  }
})();
