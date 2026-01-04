// ==UserScript==
// @name         自动讲解
// @namespace    http://tampermonkey.net/
// @version      2025-02-05
// @license      GNU GPLv3
// @description  抖音直播间自动讲解
// @author       You
// @match        https://buyin.jinritemai.com/dashboard/live/*
// @match        https://fxg.jinritemai.com/ffa/buyin/dashboard/live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jinritemai.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533782/%E8%87%AA%E5%8A%A8%E8%AE%B2%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/533782/%E8%87%AA%E5%8A%A8%E8%AE%B2%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function configFunc () {
        const style = document.createElement('style');
        style.textContent = `
  /* 主控按钮样式 */
  #controlBtn {
    position: fixed;
    left: 20px;
    top: 100px;
    z-index: 1000;
    padding: 8px 12px;
    background: linear-gradient(135deg, #6B73FF 0%, #000DFF 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  #controlBtn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,13,255,0.25);
  }

  #controlBtn:active {
    transform: translateY(0);
    background: linear-gradient(135deg, #5B63EE 0%, #0000EE 100%);
  }

  /* 弹窗样式 */
  .modal {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 10px 50px rgba(0,0,0,0.2);
    z-index: 1001;
    min-width: 320px;
    font-family: 'Segoe UI', system-ui;
  }

  .modal.active {
    display: block;
    animation: modalSlide 0.3s ease;
  }

  @keyframes modalSlide {
    from { opacity: 0; transform: translate(-50%, -60%); }
    to { opacity: 1; transform: translate(-50%, -50%); }
  }

  /* 单选按钮样式 */
  .radio-group label {
    display: flex;
    align-items: center;
    padding: 12px;
    margin: 8px 0;
    border-radius: 8px;
    transition: background 0.2s;
    cursor: pointer;
  }

  .radio-group label:hover {
    background: #f5f6ff;
  }

  input[type="radio"] {
    width: 18px;
    height: 18px;
    margin-right: 12px;
    accent-color: #4d55ff;
  }

  /* 输入框样式 */
  #indexInput {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s;
  }

  #indexInput:focus {
    outline: none;
    border-color: #6B73FF;
    box-shadow: 0 0 0 3px rgba(107, 115, 255, 0.1);
  }

  /* 操作按钮组 */
  .button-group {
    margin-top: 20px;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  .action-btn {
    padding: 10px 24px;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  #saveBtn {
    background: linear-gradient(135deg, #6B73FF, #4d55ff);
    color: white;
  }

  #saveBtn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  #cancelBtn {
    background: #f4f4f4;
    color: #666;
  }

  #cancelBtn:hover {
    background: #e0e0e0;
  }
`;
        document.head.appendChild(style);

        // 创建控制按钮（带图标）
        const controlBtn = document.createElement('button');
        controlBtn.id = 'controlBtn';
        controlBtn.innerHTML = `
  点击配置
`;
        document.body.appendChild(controlBtn);

        // 创建弹窗内容
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
  <div class="radio-group">
    <label>
      <input type="radio" name="mode" value="index" checked="checked">
      序号点击模式
    </label>
  </div>
  <div class="input-group">
    <input type="text" id="indexInput" placeholder="输入点击序号">
  </div>
  <div class="button-group">
    <button class="action-btn" id="saveBtn">保存设置</button>
    <button class="action-btn" id="cancelBtn">取消</button>
  </div>
`;
        document.body.appendChild(modal);

        // 交互逻辑
        const inputGroup = modal.querySelector('.input-group');
        const indexInput = modal.querySelector('#indexInput');
        let selectedMode = 'index';

        // 显示弹窗
        controlBtn.addEventListener('click', () => {
            modal.classList.add('active');
        });

        // 模式切换
        modal.querySelectorAll('input[name="mode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {

                selectedMode = e.target.value;
                console.log(selectedMode)
                inputGroup.style.display = e.target.value === 'index' ? 'block' : 'none';
            });
        });

        // 保存逻辑
        modal.querySelector('#saveBtn').addEventListener('click', () => {
            if (selectedMode === 'index') {
                if (!indexInput.value || parseInt(indexInput.value) < 1) {
                    alert('请输入有效序号');
                    return;
                }
                localStorage.setItem('ac_config', JSON.stringify({
                    mode: 'specified',
                    value: indexInput.value
                }))
            } else {
                localStorage.setItem('ac_config', JSON.stringify({
                    mode: 'loop'
                }))
            }
            window.location.reload()
            modal.classList.remove('active');
        });

        // 取消逻辑
        modal.querySelector('#cancelBtn').addEventListener('click', () => {
            modal.classList.remove('active');
            // modal.querySelector('input[value="loop"]').checked = true;
            inputGroup.style.display = 'none';
            indexInput.value = '';
        });

        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (!modal.contains(e.target) && e.target !== controlBtn) {
                modal.classList.remove('active');
            }
        });
    }
    configFunc()

    const delay = (time) => {
        return new Promise(function (resolve) {
            setTimeout(resolve, time)
        });
    }

    var handleBtn = async function () {
        // 从缓存中获取配置
        var config = JSON.parse(localStorage.getItem('ac_config'))
        var mode = ''
        var value = ''
        if (!config) {
            config = {
                mode: 'specified',
                value: '1'
            }
        }
        mode = config.mode
        value = config.value
        var indexList = value.split(',')
        var items = document.querySelectorAll('.rpa_lc__live-goods__goods-item')
        if (!items.length) {
            setTimeout(() => {
                handleBtn()
            }, 3000)
            return
        } else {
            console.log('获取到items', items)
        }
        for (let i = 0; i < items.length; i++) {
            let _ = items[i]
            let index = _.querySelector('input').value
            if (indexList.includes(index)) {
                var btns = _.querySelectorAll('.lvc2-grey-btn-wrapper')
                btns.forEach(item => {
                    if (item.innerText === '讲解') {
                        console.log(index, '开始讲解')
                        item.querySelector('button').click()
                    }
                    if (item.innerText === '取消讲解') {
                        console.log(index, '取消讲解')
                        item.querySelector('button').click()
                        setTimeout(() => {
                            item.querySelector('button').click()
                        }, 1300)
                    }
                })
            }
            await delay(13000)
        }
        await handleBtn()
    }

    handleBtn()
})();