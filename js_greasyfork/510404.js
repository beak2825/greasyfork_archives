// ==UserScript==
// @name         DFX工作台助手
// @namespace    https://aboucide.github.io/blog/note/software-use/DFX-GZT.html
// @version      1.4.4
// @description  用于高中工作台，自动发送作业。
// @author       Tiger
// @license      MIT
// @match        https://we.xdf.cn/*
// @icon         https://we.xdf.cn/static/img/icon-center-teacher-logo.2b63420.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510404/DFX%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/510404/DFX%E5%B7%A5%E4%BD%9C%E5%8F%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 定义CSS样式
  const css = `
  .floating-window {
      position: fixed;
      cursor: grab;
      padding: 10px;
      background-color: #4CAF50;
      color: white;
      border-radius: 50%;
      text-align: center;
      font-size: 24px;
      z-index: 10000;
      top: 0;
      left: 0;
      transition: transform 0.1s ease;
  }
  .floating-window:active {
      cursor: grabbing;
  }
  `;

  // 创建<style>标签并将CSS样式添加到<head>
{ const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}

  // 创建悬浮窗<div>元素
{ const floatingWindow = document.createElement('div');
  floatingWindow.className = 'floating-window';
  floatingWindow.textContent = '☀️';
  floatingWindow.style.left = '0';
  floatingWindow.style.top = '0';
  document.body.appendChild(floatingWindow);

  // 初始化变量
  let isDragging = false;
  let clickEnabled = true;
  let mouseXOffset = 0;
  let mouseYOffset = 0;

  // 处理鼠标按下事件，开始拖动
  floatingWindow.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    clickEnabled = false;
    mouseXOffset = e.clientX - floatingWindow.getBoundingClientRect().left;
    mouseYOffset = e.clientY - floatingWindow.getBoundingClientRect().top;
    //document.body.style.cursor = 'grabbing';
  });

  // 处理鼠标移动事件，更新悬浮窗的位置
  document.addEventListener('mousemove', (e) => {
    if (isDragging && !clickEnabled) {
      floatingWindow.style.left = (e.clientX - mouseXOffset) + 'px';
      floatingWindow.style.top = (e.clientY - mouseYOffset) + 'px';
    }
  });

  // 处理鼠标松开事件，结束拖动
  document.addEventListener('mouseup', (e) => {
    if (isDragging) {
      isDragging = false;
      setTimeout(() => {
        clickEnabled = true;
        //document.body.style.cursor = 'grab';
      }, 100);
    }
  });

  // 处理点击事件，当悬浮窗被点击时触发
  floatingWindow.addEventListener('click', (e) => {
    let result = prompt("请问您想布置几次作业", 5);
    if(result !==null)
    {
      // 创建悬浮日志窗口
      const logWindowContent = createLogWindow();
      result = parseInt(result, 10);  //将用户输入的值转为10进制数字。
      setTimeout(() => { main(result); }, 1500);
      logMessage("开始发布作业，共计【" + result + "】次作业");
    }
    else
    {
      alert('已取消运行');
    }
  });
}

//程序运行主程序，x是用户输入的运行次数
function main(x)
{
  //logMessage("即将开始发布【"+ x + "】次作业");
  //logMessage("当前时间："+new Date().toLocaleTimeString());
  DJsjk();//点击【试卷库】
  logMessage("当前时间："+new Date().toLocaleTimeString());
  logMessage("延迟5秒后继续操作");
  setTimeout(() =>
  {
    for (let i = 0; i < x ; i++)
    {
         setTimeout(() =>
         { let iii = i+1;
           logMessage('***开始第【' + iii +'】 次,大约要耗时45秒***');
           onepaper();
         }, i*(50000*(1+(i+1)/(25+i))));   //设置每50秒运行一次布置作业
    }
  }, 1000);


}



//选年份、选试卷、选学生、发送试卷
function onepaper()
{
  logMessage("【本次开始】时间："+new Date().toLocaleTimeString());
  setTimeout(() => {
    //这里会等待10秒，再往下执行
    jinsannian(); //随机选取近三年中的某一年
    setTimeout(() => {
      setTimeout(() => {
        logMessage("开始随机保存当前页面中随机一份试卷");
        SJpaper();

        setTimeout(() => {
          DJcksj();//点击查看试卷
          setTimeout(() => {
            clickPublishToMiniProgramButton();//点击【发布至小程序】

            setTimeout(() => {
              clickHomeworkCategory();//点击课后作业
              setTimeout(() => {
                DJsubmit();  //点击提交
                setTimeout(() => {
                  clickEditSpan();  //点击编辑
                  setTimeout(() => {
                    clickLastPlaceholderSelect();//点击最后一个选择框
                    setTimeout(() => {
                      clickLastExclusiveItem("专属型");

                      setTimeout(() => {
                        clickLastPlaceholderSelect();
                        setTimeout(() => {
                          clickLastExclusiveItem("按学员发布");
                          setTimeout(() => {
                            clickLastSelectStudentButton();//点击选择学员
                            setTimeout(() => {
                              countAndClickCheckbox(); //勾选学员
                              setTimeout(() => {
                                countAndClickConfirmButton();  //点击确认学员
                                setTimeout(() => {
                                  countAndClickReleaseButton(); //点击发布
                                  setTimeout(() => {
                                    setTimeout(() =>
                                    {
                                        pageback(); //返回【试题库】
                                        setTimeout(() =>
                                        {
                                        logMessage("现在返回到【试卷库】");
                                        logMessage("【结束】时间："+new Date().toLocaleTimeString());
                                        logMessage("*******完成一次作业布置*******");
                                        }, 2500);
                                    }, 2000);//等待2秒


                                  }, 1000);//17、等待1秒后，返回试卷页

                                }, 1000);//16、等待1秒后，点击【发布】

                              }, 2000);//15、等待2秒后，点击【确认】学员


                            }, 4000);//14、等待4秒后，点击学员类型【未开课】、【开课中】

                          }, 1000);//13、等待1秒后，点击【选择学员】

                        }, 1000);//12、等待1秒后，点击【按学员发布】

                      }, 2000);//11、等待2秒后，点击最后一个【选择】，选择发布对象

                    }, 1000);//10、等待1秒后，点击最后一个【专属型】

                  }, 1000);//9、等待1秒后，点击最后一个【选择】,选择发布类型

                }, 2000);//8、等待2秒后，点击【编辑】

              }, 2000);//7、等待2秒后，点击【提交】

            }, 3000);//6、等待3秒后，点击【课后作业】

          }, 4000);//5、等待4秒后，点击【发布至小程序】

        }, 3000);//4、等待3秒后，点击【查看试卷】

      }, 1000);//3、等待1秒后随机点击一份【试卷保存】。

    }, 3000);//2、随机点击【年份】的按钮后，等待3秒。

  }, 5000);// 1、点击【试卷库之后】等待5秒后，等待页面加载完成，随机点击近三年的某一年
}




  // 点击“试卷库”
  function DJsjk() {
    // 点击具有文本“试卷库”的<li>元素
    const targetElement = Array.from(document.querySelectorAll('li.el-menu-item')).find(element => element.textContent.trim() === '试卷库');
    if (targetElement)
    {
      // 1、点击【试卷库之后】，延迟10秒
      targetElement.click();
      logMessage("已点击【试卷库】");
    }
    else
    {
      console.error('未找到【试卷库】,你当前真的在【XDF高中工作台】的首页吗？');
      alert('未找到【试卷库】,你当前真的在【XDF高中工作台】的首页吗？')
    }

  }



// 随机点击近三年年份按钮
function jinsannian() {
  // 设置超时时间和轮询间隔
  let timeout = 10000; // 10秒
  let interval = 1000; // 每1秒检查一次

  // 定义一个变量来记录开始时间
  let startTime = Date.now();

  // 使用setInterval来循环检查元素
  let intervalId = setInterval(() => {
    // 选择所有包含年份文本的<button>元素
    const yearButtons = Array.from(document.querySelectorAll('button.el-button'))
      .filter(button => /^\d{4}年$/.test(button.querySelector('span')?.textContent.trim()));

    // 获取前6个匹配的元素
    const topThreeYearButtons = yearButtons.slice(1, 7);

    // 如果找到了元素
    if (topThreeYearButtons.length > 0) {
      //logMessage("开始随机点击【近6年】");

      // 随机选择一个按钮
      const randomIndex = Math.floor(Math.random() * topThreeYearButtons.length);
      const randomButton = topThreeYearButtons[randomIndex];

      // 触发点击事件
      randomButton.click();

      logMessage(`随机选择【${randomButton.querySelector('span').textContent.trim()}】年份`);

      clearInterval(intervalId); // 清除循环
    } else if (Date.now() - startTime > timeout) {
      // 如果超过超时时间，停止循环
      logMessage('等待8秒，超时，未找到【年份】按钮');
      window.history.back();
      clearInterval(intervalId);
    }
  }, interval);
}



// 随机选取一份试卷
function SJpaper() {
  // 设置超时时间和轮询间隔
  let timeout = 8000; // 8秒
  let interval = 1000; // 每500毫秒检查一次

  // 定义一个变量来记录开始时间
  let startTime = Date.now();

  // 使用setInterval来循环检查元素
  let intervalId = setInterval(() => {
    // 选择所有包含文本“保存”的<span>元素
    const saveButtons = Array.from(document.querySelectorAll('span.btn-right'))
      .filter(span => span.textContent.trim() === '保存');

    // 获取匹配的元素数量
    const saveButtonCount = saveButtons.length;

    // 如果找到了元素
    if (saveButtonCount > 0) {
      //logMessage(`找到 ${saveButtonCount} 个文本为【保存】的按钮`);

      // 随机选择一个按钮
      const randomIndex = Math.floor(Math.random() * saveButtonCount);
      const randomSaveButton = saveButtons[randomIndex];

      // 触发点击事件
      randomSaveButton.click();

      logMessage(`随机【保存】第 ${randomIndex + 1} 张试卷`);

      clearInterval(intervalId); // 清除循环
    } else if (Date.now() - startTime > timeout) {
      // 如果超过超时时间，停止循环
      logMessage('等待8秒，超时，未找到【保存】按钮');
      clearInterval(intervalId);
    }
  }, interval);
}




  //点击【查看试卷】
  function DJcksj() {
    // 设置超时时间和轮询间隔
    let timeout = 8000; // 5秒
    let interval = 1000; // 每500毫秒检查一次

    // 定义一个变量来记录开始时间
    let startTime = Date.now();

    // 使用setInterval来循环检查元素
    let intervalId = setInterval(() => {
      // 使用querySelectorAll来获取所有匹配的按钮元素
      let buttons = document.querySelectorAll('button.btn-primary');

      // 如果找到了元素
      if (buttons.length > 0) {
        //logMessage(`点击【查看试卷】`);

        // 过滤出包含文本为“查看试卷”的按钮
        let targetButtons = Array.from(buttons).filter(button => {
          let span = button.querySelector('span');
          return span && span.textContent.trim() === "查看试卷";
        });

        if (targetButtons.length > 0) {
          //logMessage(`找到 ${targetButtons.length} 个文本为'查看试卷'的按钮`);

          // 遍历所有符合条件的按钮并点击
          targetButtons.forEach((button, index) => {
            logMessage(`点击【查看试卷】`);
            button.click();
          });
        }

        clearInterval(intervalId); // 清除循环
      } else if (Date.now() - startTime > timeout) {
        // 如果超过超时时间，停止循环
        logMessage('等待超时，未找到元素');
        clearInterval(intervalId);
      }
    }, interval);
  }

  //点击【打印预览/下载】
  function DJprint() {
    // 设置超时时间和轮询间隔
    let timeout = 8000; // 8秒
    let interval = 1000; // 每1000毫秒检查一次

    // 定义一个变量来记录开始时间
    let startTime = Date.now();

    // 使用setInterval来循环检查元素
    let intervalId = setInterval(() => {
      // 使用querySelectorAll来获取所有匹配的按钮元素
      // 更新选择器以匹配提供的按钮类名
      let buttons = document.querySelectorAll('button.el-button.el-button--default.el-button--mini');

      // 如果找到了元素
      if (buttons.length > 0) {
        logMessage(`点击【打印预览/下载】`);

        // 过滤出包含文本为“打印预览/下载”的按钮
        let targetButtons = Array.from(buttons).filter(button => {
          let span = button.querySelector('span');
          return span && span.textContent.trim() === "打印预览/下载";
        });

        if (targetButtons.length > 0) {
          //logMessage(`找到 ${targetButtons.length} 个文本为'打印预览/下载'的按钮`);

          // 遍历所有符合条件的按钮并点击
          targetButtons.forEach((button, index) => {
            //logMessage(`点击第 ${index + 1} 个按钮`);
            button.click();
          });
        }

        clearInterval(intervalId); // 清除循环
      } else if (Date.now() - startTime > timeout) {
        // 如果超过超时时间，停止循环
        logMessage('等待8秒，超时，未找到【打印预览/下载】按钮');
        clearInterval(intervalId);
      }
    }, interval);
  }

  //点击【发布至小程序】
  function clickPublishToMiniProgramButton() {
    // 设置超时时间和轮询间隔
    let timeout = 8000; // 8秒
    let interval = 1000; // 每1000毫秒检查一次

    // 定义一个变量来记录开始时间
    let startTime = Date.now();

    // 使用setInterval来循环检查元素
    let intervalId = setInterval(() => {
      // 使用querySelectorAll来获取所有匹配的按钮元素
      let buttons = document.querySelectorAll('button.el-button.el-button--default.el-button--mini');

      // 过滤出包含文本为“发布至小程序”的按钮
      let publishButton = Array.from(buttons).filter(button => {
        let span = button.querySelector('span');
        return span && span.textContent.trim() === "发布至小程序";
      })[0]; // 取第一个匹配的按钮

      // 如果找到了元素
      if (publishButton) {
        logMessage(`点击【发布至小程序】`);

        // 点击找到的按钮
        publishButton.click();
        clearInterval(intervalId); // 清除循环
      } else if (Date.now() - startTime > timeout) {
        // 如果超过超时时间，停止循环
        logMessage('等待8秒，超时，未找到【发布至小程序】按钮');
        clearInterval(intervalId);
      }
    }, interval);
  }



  //点击【课后作业】
  function clickHomeworkCategory() {
    // 设置超时时间和轮询间隔
    let timeout = 8000; // 8秒
    let interval = 1000; // 每1000毫秒检查一次

    // 定义一个变量来记录开始时间
    let startTime = Date.now();

    // 使用setInterval来循环检查元素
    let intervalId = setInterval(() => {
      // 使用querySelectorAll来获取所有匹配的category-item元素
      let categoryItems = document.querySelectorAll('.category-item');

      // 过滤出包含文本为“课后作业”的category-item元素
      let homeworkCategory = Array.from(categoryItems).filter(item => item.textContent.trim() === "课后作业")[0];

      // 如果找到了元素
      if (homeworkCategory) {
        logMessage(`点击【课后作业】`);

        // 点击找到的元素
        homeworkCategory.click();
        clearInterval(intervalId); // 清除循环
      } else if (Date.now() - startTime > timeout) {
        // 如果超过超时时间，停止循环
        logMessage('等待8秒，超时，未找到【课后作业】');
        clearInterval(intervalId);
      }
    }, interval);
  }


 // 点击【提交】
function DJsubmit() {
  // 设置超时时间和轮询间隔
  let timeout = 8000; // 8秒
  let interval = 1000; // 每1000毫秒检查一次

  // 定义一个变量来记录开始时间
  let startTime = Date.now();

  // 使用setInterval来循环检查元素
  let intervalId = setInterval(() => {
    // 使用querySelectorAll来获取所有匹配的按钮元素
    let buttons = document.querySelectorAll('.dialog-footer .el-button.el-button--primary');

    // 过滤出包含文本为“提交”的按钮
    let submitButtons = Array.from(buttons).filter(button => {
      let span = button.querySelector('span');
      return span && span.textContent.trim() === "提交";
    });

    // 如果找到至少一个按钮
    if (submitButtons.length > 0) {
      // 输出找到的按钮数量
      //logMessage(`找到 ${submitButtons.length} 个文本为'提交'的按钮`);

      // 点击第一个按钮
      submitButtons[0].click();
      logMessage(`点击【提交】`);

      clearInterval(intervalId); // 清除循环
    } else if (Date.now() - startTime > timeout) {
      // 如果超过超时时间，停止循环
      logMessage('等待8秒，超时，未找到"提交"的按钮');
      clearInterval(intervalId);
    }
  }, interval);
}


  // 点击【编辑】
function clickEditSpan() {
  // 设置超时时间和轮询间隔
  let timeout = 8000; // 8秒
  let interval = 1000; // 每1秒检查一次

  // 定义一个变量来记录开始时间
  let startTime = Date.now();

  // 使用setInterval来循环检查元素
  let intervalId = setInterval(() => {
    // 使用querySelectorAll来获取所有匹配的span元素
    let editSpans = document.querySelectorAll('span.edit');

    // 过滤出包含文本为“编辑”的span
    let targetEditSpans = Array.from(editSpans).filter(span => {
      return span.textContent.trim() === "编辑";
    });

    // 如果找到至少一个span
    if (targetEditSpans.length > 0) {
      // 输出找到的span数量
      //logMessage(`找到 ${targetEditSpans.length} 个文本为'编辑'的span`);

      // 点击第一个span
      targetEditSpans[0].click();
      logMessage(`点击【编辑】`);

      clearInterval(intervalId); // 清除循环
    } else if (Date.now() - startTime > timeout) {
      // 如果超过超时时间，停止循环
      logMessage('等待8秒，超时，没有找到"编辑"');
      clearInterval(intervalId);
    }
  }, interval);
}

// 点击最后一个【请选择】的下拉箭头
function clickLastPlaceholderSelect() {
  // 设置超时时间和轮询间隔
  let timeout = 8000; // 8秒
  let interval = 1000; // 每1000毫秒检查一次

  // 定义一个变量来记录开始时间
  let startTime = Date.now();

  // 使用setInterval来循环检查元素
  let intervalId = setInterval(() => {
    // 使用querySelectorAll来获取所有匹配的输入框元素
    let inputs = document.querySelectorAll('input[placeholder="请选择"]');

    // 统计找到的输入框数量
    let count = inputs.length;
    //logMessage(`总共找到 ${count} 个占位符为'请选择'的输入框`);

    // 检查是否找到至少一个输入框
    if (count > 0) {
      // 获取最后一个输入框
      let input = inputs[count - 1];

      // 获取输入框旁边的下拉箭头元素
      let suffix = input.parentElement.querySelector('.el-input__suffix-inner .el-icon-arrow-up');
      if (suffix) {
        // 模拟点击下拉箭头
        suffix.click();
        //logMessage(`开始设置类型`);
        clearInterval(intervalId); // 清除循环
      } else {
        logMessage(`最后一个输入框没有找到下拉箭头`);
        clearInterval(intervalId); // 清除循环
      }
    } else if (Date.now() - startTime > timeout) {
      // 如果超过超时时间，停止循环
      logMessage('等待8秒，超时，没有找到"请选择"');
      clearInterval(intervalId);
    }
  }, interval);
}

  //点击弹出的选择列表为xxx的选项
  function clickLastExclusiveItem(xxx) {
    // 使用querySelectorAll来获取所有匹配的li元素
    let items = document.querySelectorAll('li.el-select-dropdown__item');

    // 检查是否找到至少一个li元素
    if (items.length > 0) {
      // 从找到的li元素中筛选出包含文本“专属型”的元素
      let exclusiveItems = Array.from(items).filter(item => {
        return item.querySelector('span') && item.querySelector('span').textContent.trim() === xxx;
      });

      // 检查是否找到至少一个包含“专属型”文本的li元素
      if (exclusiveItems.length > 0) {
        // 获取最后一个匹配的li元素
        let lastExclusiveItem = exclusiveItems[exclusiveItems.length - 1];

        // 模拟点击最后一个匹配的li元素
        lastExclusiveItem.click();
        logMessage(`设置类型为：【` + xxx + `】`);
      } else {
        logMessage(`没有找到文本为【` + xxx + `】`);
      }
    } else {
      logMessage('页面上没有找到【'+ xxx+ '】,是因为没出现多选框的列表吗？');
    }
  }

  //点击【选择学员】
  function clickLastSelectStudentButton() {
    // 使用querySelectorAll来获取所有匹配的按钮元素
    let buttons = document.querySelectorAll('button.el-button.el-button--primary');

    // 筛选出包含文本“选择学员”的按钮
    let selectStudentButtons = Array.from(buttons).filter(button => {
      return button.querySelector('span') && button.querySelector('span').textContent.trim() === '选择学员';
    });

    // 统计找到的按钮数量
    let count = selectStudentButtons.length;
    //logMessage(`总共找到 ${count} 个文本为'选择学员'的按钮`);

    // 检查是否找到至少一个按钮
    if (count > 0) {
      // 获取最后一个匹配的按钮
      let lastSelectStudentButton = selectStudentButtons[count - 1];

      // 模拟点击最后一个匹配的按钮
      lastSelectStudentButton.click();
      logMessage(`点击【选择学员】按钮`);
    } else {
      // 如果没有找到按钮，输出提示信息
      logMessage('没有找到文本为"选择学员"的按钮');
    }
  }

  //点击第前两项项复选框【开课中】、【未开课】
  function countAndClickCheckbox() {
    // 使用querySelectorAll来获取所有匹配的复选框元素
    let checkboxes = document.querySelectorAll('input[type="checkbox"].el-checkbox__original');

    // 统计找到的复选框数量
    let count = checkboxes.length;
    //logMessage(`总共找到 ${count} 个复选框`);

    // 检查是否找到至少一个复选框
    if (count > 0) {
      // 获取并点击第1和第2个复选框
      //第一个复选框是【开课中】学员
      //第二个复选框是【未开课】学员
      //如果先勾选的学员数为0，则勾选下一个复选框的时候会自动把刚刚那个取消掉。问题不大。
      let firstCheckbox = checkboxes[2];
      firstCheckbox.click();
      firstCheckbox = checkboxes[1];
      firstCheckbox.click();
      firstCheckbox = checkboxes[0];
      firstCheckbox.click();

      logMessage(`点击前3个复选框`);
    } else {
      // 如果没有找到复选框，输出提示信息
      logMessage('没有找到复选框');
    }
  }

  //点击【确认学员】
  function countAndClickConfirmButton() {
    // 使用querySelectorAll来获取所有匹配的按钮元素
    let buttons = document.querySelectorAll('button.el-button.btn.btn-primary.el-button--primary');

    // 统计找到的按钮数量
    let count = buttons.length;
    //logMessage(`总共找到 ${count} 个文本为'确认'的按钮`);

    // 检查是否找到至少一个按钮
    if (count > 0) {
      // 获取第一个按钮并检查其文本内容
      let firstButton = buttons[0];
      if (firstButton.querySelector('span') && firstButton.querySelector('span').textContent.trim() === '确认') {
        // 点击第一个按钮
        firstButton.click();
        logMessage(`点击【学员确认】`);
      } else {
        logMessage('第一个按钮的文本不是"确认"');
      }
    } else {
      // 如果没有找到按钮，输出提示信息
      logMessage('没有找到文本为"确认"的按钮');
    }
  }

  //点击【发布】
  function countAndClickReleaseButton() {
    // 使用querySelectorAll来获取所有匹配的按钮元素
    let buttons = document.querySelectorAll('button.el-button.release.el-button--primary');

    // 统计找到的按钮数量
    let count = buttons.length;
    //logMessage(`总共找到 ${count} 个文本为'发布'的按钮`);

    // 检查是否找到至少一个按钮
    if (count > 0) {
      // 获取第一个按钮并检查其文本内容
      let firstButton = buttons[0];
      if (firstButton.querySelector('span') && firstButton.querySelector('span').textContent.trim() === '发布') {
        // 点击第一个按钮
        firstButton.click();
        logMessage(`点击【发布】`);
      } else {
        logMessage('第一个按钮的文本不是"发布"');
      }
    } else {
      // 如果没有找到按钮，输出提示信息
      logMessage('没有找到文本为"发布"的按钮');
    }
  }

  //回退页面到【试卷库】
  function pageback() {
    setTimeout(() =>
        {
          logMessage('返回上一页，共2次');
          window.history.back();
          logMessage('返回上一页，第1次');
            setTimeout(() =>
            {
              window.history.back();
              logMessage('返回上一页，第2次');
            }, 1000);
        }, 1000);



  }

})();

// 创建悬浮窗口的函数
function createLogWindow() {
  // 创建悬浮窗口的容器
  const logWindow = document.createElement('div');
  logWindow.id = 'logWindow';
  logWindow.style.position = 'fixed';
  logWindow.style.top = '50px';
  logWindow.style.left = '0px';
  logWindow.style.width = '300px';
  logWindow.style.height = '600px';
  logWindow.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // 半透明背景
  logWindow.style.border = '1px solid #ccc';
  logWindow.style.padding = '10px';
  logWindow.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
  logWindow.style.zIndex = '1000';
  logWindow.style.overflowY = 'auto'; // 允许内容滚动
  logWindow.style.display = 'block';

  // 创建头部
  const logHeader = document.createElement('div');
  logHeader.className = 'log-header';
  logHeader.innerText = '脚本日志';
  logHeader.style.color = 'blue'; // 头部文字颜色

  // 创建关闭按钮
  const closeButton = document.createElement('button');
  closeButton.innerText = 'X';
  closeButton.style.color = 'red'; // 关闭按钮文字颜色
  closeButton.onclick = function() {
    logWindow.style.display = 'none';
  };

  // 创建复制按钮
  const copyButton = document.createElement('button');
  copyButton.innerText = '复制';
  copyButton.style.color = 'green'; // 复制按钮文字颜色
  copyButton.onclick = function() {
    const logContent = document.querySelector('#logWindow .log-content');
    copyTextToClipboard(logContent.innerText);
    alert('日志已复制到剪贴板');
  };

  // 创建日志内容区域
  const logContent = document.createElement('div');
  logContent.className = 'log-content';
  logContent.style.fontFamily = 'monospace';
  logContent.style.whiteSpace = 'pre-wrap';
  logContent.style.color = 'blue'; // 日志内容文字颜色
  logContent.style.fontSize = '14px'; // 设置字体大小
  logContent.style.overflowY = 'auto'; //设置超出范围自动滚动

  // 组装悬浮窗口
  logHeader.appendChild(closeButton);
  logWindow.appendChild(logHeader);
  logWindow.appendChild(logContent);
  logHeader.appendChild(copyButton); // 将复制按钮添加到头部

  // 将悬浮窗口添加到文档中
  document.body.appendChild(logWindow);

  return logContent;
}

// 向日志窗口添加消息的函数
function logMessage(message) {
  const logContent = document.querySelector('.log-content');
  const newEntry = document.createElement('div');
  newEntry.textContent = message;
  logContent.appendChild(newEntry);
  logContent.scrollTop = logContent.scrollHeight;

}


// 复制文本到剪贴板的函数
function copyTextToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(
      function() {
        console.log('已成功将日志复制到剪贴板');
      },
      function(err) {
        console.error('复制到剪贴板失败', err);
      }
    );
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      console.log('Fallback: Copying to clipboard was successful!');
    } catch (err) {
      console.error('Fallback: Could not copy text: ', err);
    }
    document.body.removeChild(textArea);
  }
}