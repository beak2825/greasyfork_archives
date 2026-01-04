// ==UserScript==
// @name         TV开仓计算器
// @namespace    https://cn.tradingview.com/activeliang-tv-calculator
// @version      0.3.7
// @description  tradingview辅助工具，在目标止损位，速查亏损金额对应开仓数量。警报相关优化。
// @author       超人不会飞
// @match        https://*.tradingview.com/chart/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_addElement
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @connect      *
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAArlJREFUeF7tW8Fx4zAMXPoeSR3XwTUQ25145r73SAeJO7gGMuNOLOeZTzq4OpJHzBsqkuMoJAWCyAgaw1+BpLBcgtACdrjwn7tw/2EAGAMuHAE7AhIEuN5vVlhg5R2WEvONzeE8DsHmZbm7H7Mde17FgOC4/4E7eKzGFvqO5w7Y1oJQBcDV42Y/lfMnQB2a15vdmgswG4Drw+beA3fchSXHuSPWL+tdw5mTDYCK3e89rmABH4DDxg8R98CTc+6JsxNFY7z/M7R/Xe5YvrAGhcWvIgAAuIXHvyJnSo0dfgL4awAMEDAG2BGwGMCKZ6xBFgTtFrBr0PKARCL0ACyeS3ObMvvjLwC/tSZCZb4IWmtJhARdKpvKAFCSCZZtm6C1MUALA3p15iSUJlSjoOfhiCYoOVl1yaFxb9iO2algwFCkbEXTBfYxpg9fOKUwce2op0v0WyCmzcUci6m5URZEpK4UqCoYgMgLRxMmqh2AIaip46IDgPDCnVY/VjPoY0Cgara2EGJAKIQc0bTFl0RMUQMA9exJ2xkAWq5B6Z2lzmcMMAboEEXDNdBmbrmI3dL6zK69CVJ1RqKdiiNQlQnGK01f8gBqxkiNHbKZYKReT80Eo47NLROMpbjUTJCa4VHtJmHA+9H+6NrIfeWx7Ao+riYDgLpwsZ1Dk+tGUREEi50SHGAAWCKkJRESpHXJVHqOQAhW4TbomhkpTox2m3WaQM5OBQA1jYuJUtuna7Utyyd6E+cPANEx1ZpgTcMiWRRNNGiqYEBMFKXEgJx8PjxWqo9A72wreBJ/bYf5WLN1F1h1ZYIaGqU/EGc3TLM/h3O0JW6+mFnN7cMGIHcliXlGmaiiUbr7eqWskraZtG3+rHDK9aKKAf2ik/xlpqsscx0/C9i1U8x7vAgD5gyBATDn3ZN4d2OABIpznuM/A5D7UKDXsDIAAAAASUVORK5CYII=
// @license      GNU GPLv3
// @require https://update.greasyfork.org/scripts/486241/1321368/MonkeyConfig-branch.js
// @downloadURL https://update.greasyfork.org/scripts/486242/TV%E5%BC%80%E4%BB%93%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/486242/TV%E5%BC%80%E4%BB%93%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  let binanceSymbolInfo
  let okxSymbolInfo

  // 加载外部资源
  async function loadExternalResources() {
    // 添加Toastify的CSS
    GM_addElement('link', {
      href: 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/toastify-js/1.11.2/toastify.min.css',
      rel: 'stylesheet',
      type: 'text/css'
    });

    // 添加Toastify的JS
    await GM_addElement('script', {
      src: 'https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/toastify-js/1.11.2/toastify.min.js',
      type: 'text/javascript'
    });
  }

  // 创建配置界面
  function createConfigUI() {
    const configOpts = {
      title: '开仓计算器-设置',
      menuCommand: true,
      params: {
        minLossCalculation: {
          label: '计算亏损范围起始值',
          type: 'number',
          default: 0
        },
        maxLossCalculation: {
          label: '计算亏损范围结束值',
          type: 'number',
          default: 10
        },
        quantityPrecisionExchange: {
          label: '数量精度优先参考的交易所',
          info: '比如BTC，币安最小支持0.001，欧易0.01，请选择你想优先参考的交易所',
          type: 'select',
          choices: ['Binance', 'Okx'],
          default: 'Binance'
        },
        doubleClickDefaultMarketOrder: {
          label: '双击下单类型默认市价单',
          info: 'TV的交易面板默认是限价单，勾选此项，双击下单时自动切换选择市价单',
          type: 'checkbox',
          default: false
        },
        removeChartTimeRangePrefixEnable: {
          label: '移除图表下方时间导航条',
          info: '左下角时间范围导航条有点占屏幕，可以移走它，保存后刷新页面生效',
          type: 'checkbox',
          default: true
        },
        alertContentNickname: {
          label: '警报内容加上专属昵称',
          info: '可选，留空代表不加',
          type: 'text',
          default: '我的'
        },
        alertContentAddTimePeriodPrefixEnable: {
          label: '警报内容加上时间周期',
          info: '自动加上当前图表的时间周期，比如30分、4小时',
          type: 'checkbox',
          default: true
        },
        alertProcessSimplifyEnable: {
          label: '警报一键添加（beta版）',
          info: `开启后设警报更加便捷，减少了鼠标使用次数，推荐使用快捷键唤起: ${navigator.userAgent.includes("Macintosh") ? '⌥' : 'Alt'} + A\n（beta测试版，可能不稳定，若出错请关闭此功能）`,
          type: 'checkbox',
          default: false
        },
        alertRoomNumber: {
          label: "警报房间号",
          info: '仅当警报Webhook URL不带房间号(小黑哥版本)时，才需要填',
          type: 'text',
          default: '',
          hide: false
        }
      },
      onSave: async e => {
        document.querySelector('.chart-controls-bar').style.display = e.removeChartTimeRangePrefixEnable ? 'none' : ''
        resizeWindow()
        updateSymbolInfo(e)
      }
    }
    return new MonkeyConfig(configOpts);
  }

  // 拦截和处理fetch请求
  function interceptFetch(cfg) {
    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function (...args) {
      let url = args[0];
      let options = args[1];

      // 检查是否为POST请求且URL符合特定条件
      if (options && options.method === 'POST' && url.includes('https://alerts.tradingview.com/alerts') && url.includes('log_username') && url.includes('maintenance_unset_reason') && url.includes(`log_method=create_alert`)) {
        Toastify({
          text: "正在添加警报...",
          position: 'center',
          duration: 3000,
          style: {
            background: "#03A9F4",
          }
        }).showToast();
        // 执行原始的fetch函数
        return originalFetch.apply(this, args).then(response => {
          console.log('Fetch completed: ', response);
          Toastify({
            text: "警报已添加~",
            position: 'center',
            duration: 3000,
            style: {
              background: "#12c99b",
            }
          }).showToast();
          return response;
        }).catch(error => {
          Toastify({
            text: "添加警报出错! 请稍候重试，或联系程序员",
            position: 'center',
            duration: 3000,
            style: {
              background: "#EC407A",
            }
          }).showToast();
          console.log('Fetch error: ', error);
          throw error;
        });
      } else {
        // 对于不符合条件的请求，直接调用原始fetch函数
        return originalFetch.apply(this, args);
      }
    };
  }

  // 生成本地时间字符串
  function generateLocalTimeString() {
    // 获取本地时间
    var localDate = new Date();
    // 获取年、月、日、小时和分钟
    var year = localDate.getFullYear();
    var month = ('0' + (localDate.getMonth() + 1)).slice(-2);
    var day = ('0' + localDate.getDate()).slice(-2);
    var hours = ('0' + localDate.getHours()).slice(-2);
    var minutes = ('0' + localDate.getMinutes()).slice(-2);
    // 拼接时间字符串
    var timeString = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
    return timeString;
  }

  function setInputWithSetter(targetInput, newValue) {
    const valueSetter = Object.getOwnPropertyDescriptor(targetInput, 'value').set;
    const prototype = Object.getPrototypeOf(targetInput);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(targetInput, newValue);
    } else {
      valueSetter.call(targetInput, newValue);
    }
    targetInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // 监控DOM变化
  function observeDOMChanges(cfg) {
    const bodyObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach(async function (node) {
            if (node.id === 'overlap-manager-root') {
              observeDivChanges(node, cfg);
            }
            if (node.nodeType === Node.ELEMENT_NODE) {
              const brokerBtn = node.querySelector('button[name="broker-login-submit-button"][type="submit"]')
              if (brokerBtn && brokerBtn.disabled) {
                brokerBtn.disabled = fasle
                console.info(`设置了连接经纪商按钮的可用性...`)
              }
            }
            // 检查node是否是目标div
            if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('[data-name="alerts-create-edit-dialog"]') && (node.getAttribute('data-id') || node.getAttribute('style'))) {
              // 不相关的事件不干扰
              const headerText = node.querySelector('[data-name="alerts-create-edit-dialog"] div').innerText
              if (!headerText.includes(`创建`)) return // 只处理新增的警报。
              if (headerText.match(/\,\s*\d/) && !node.querySelector('textarea[id="alert-message"]')?.value?.includes(`线`)) return // 只处理价格警报和线段类型的警报
              // 隐藏目标警报元素
              if (cfg.get('alertProcessSimplifyEnable')) {
                console.info(`隐藏了元素: `, node)
                node.style.display = 'none';
              }
              try {
                // 显示prompt
                const targetInput = node.querySelector('textarea')
                const targetPrice = node.querySelector('textarea[id="alert-message"]')?.value?.includes(`线`) ? '某线' : targetInput.value.match(/\d+[\.]\d+/)[0]
                const targetPair = document.title.split(' ')[0].replace('.P', '')
                let promptRemark = null
                if (cfg.get('alertProcessSimplifyEnable')) {
                  promptRemark = prompt(`添加备注，警报${targetPair.toUpperCase()}价格穿过${targetPrice}`)
                  if (promptRemark == null) {
                    node.querySelector('button[name="cancel"]').click()
                    return
                  }
                }
                // 获取当前图表的时间周期
                const customInterval = Array.prototype.slice.call(document.querySelectorAll('#header-toolbar-intervals button')).find(i => i.className.includes(`isActive-`))?.innerText
                const currentNickName = cfg.get('alertContentNickname').replace(/^\s*$/, '')
                // const newValueObject = { "wxid": "7777777777@chatroom", "msg": `【我的】${targetPair}:${promptRemark}\n价格:{{close}}, [级别:${customInterval}]` }
                // const newValueObject = (currentNickName.length ? `【${currentNickName}】` : '') + `${targetPair}:${promptRemark}, 价格:{{close}}` + (cfg.get('alertContentAddTimePeriodPrefixEnable') ? `, [级别:${customInterval}]` : '')
                let newValueObject = (currentNickName.length ? `【${currentNickName}】` : '') + `${targetPair}:{{close}}` + (cfg.get('alertContentAddTimePeriodPrefixEnable') ? `[${customInterval}]` : '')
                // 处理简化流程
                if (cfg.get('alertProcessSimplifyEnable')) {
                  // 获取当前webhook url的设置
                  const currentWebhookUrl = TVSettings.getValue("alerts.creating.webhook_url")
                  const subContent = (currentNickName.length ? `【${currentNickName}】` : '') + `${targetPair}:${promptRemark}, 价格:{{close}}` + (cfg.get('alertContentAddTimePeriodPrefixEnable') ? `, [级别:${customInterval}]` : '') + `\n设警报时间: ${generateLocalTimeString()}`
                  if (currentWebhookUrl.includes(`xiaoheige`) && currentWebhookUrl.match(/send_msg$/)) {
                    const currentRoomNumber = cfg.get('alertRoomNumber') || ''
                    if (currentRoomNumber.replace(/^\s*$/, '')?.length == 0) {
                      alert(`你的警报里webhook url看起来是（小黑哥的）需要房间号的，请在打开的设置中，添加房间号，保存后重试。（如何关闭此功能：进入设置，关闭『警报一键添加』）`)
                      node.querySelector('button[name="cancel"]').click()
                      cfg.setHide('alertRoomNumber', false)
                      cfg.open()
                      return
                    }
                    newValueObject = JSON.stringify({ "wxid": `${currentRoomNumber}@chatroom`, "msg": subContent })
                  } else if (currentWebhookUrl.length == 0) {
                    // Toastify({
                    //   text: "你的警报没有设置webhook url请知悉",
                    //   position: 'center',
                    //   duration: 5000,
                    //   style: {
                    //     background: "#EC407A",
                    //   }
                    // }).showToast();
                  } else {
                    newValueObject = subContent
                  }
                }
                const newValue = newValueObject
                setInputWithSetter(targetInput, newValue)
                if (cfg.get('alertProcessSimplifyEnable')) setTimeout(_ => {
                  node.querySelector('button[type="submit"]').click()
                  setTimeout(_ => node.style.display = '', 400)
                }, 200)
              } catch (err) {
                node.style.display = ''
                console.info('tv计算器脚本出错: ', err)
              }
            }
          });
        }
      });
    });
    document.addEventListener("DOMContentLoaded", (event) => {
      bodyObserver.observe(document.body, { childList: true, subtree: true });
    });
  }

  // 监控指定div的变化
  function observeDivChanges(div, cfg) {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length >= 1) {
          modifyAndSetEvent(div, cfg);
        }
      });
    });
    observer.observe(div, { childList: true, subtree: true });
  }

  function simpleQuantityPrecision(pair, cfg) {
    const targetPrecisionList = cfg.get('quantityPrecisionExchange') == 'Binance' ? binanceSymbolInfo : okxSymbolInfo
    const t = targetPrecisionList && typeof targetPrecisionList[pair] === 'number' ? targetPrecisionList[pair] : 3
    // console.info('simpleQuantityPrecision: ', t, targetPrecisionList, pair, cfg.get('quantityPrecisionExchange'))
    return t
  }

  // 修改添加开仓计算器选项，并设置点击事件
  function modifyAndSetEvent(div, cfg) {
    const tbody = div.querySelector('tbody');
    if (!tbody) return;

    let latestText = ''; // 用于存储最新的以“以”开头的tr的文本
    // 查找最新的以“以”开头的tr并更新latestText
    const trs = Array.from(tbody.querySelectorAll('tr'));
    trs.forEach(function (tr) {
      if (tr.textContent.trim().startsWith('复制')) latestText = tr.textContent.trim();
    });

    if (latestText) {
      const firstTr = tbody.querySelector('tr');
      if (!firstTr) return; // 如果tbody中没有tr，则退出函数
      const priceTr = trs.find(tr => tr.textContent.trim().startsWith('复制价格'));
      if (!priceTr) return;
      const clonedTr2 = priceTr.cloneNode(true);
      clonedTr2.querySelector('td:nth-child(2)').innerHTML = `<div style="padding-left: 6px;" class="content-GJX1EXhk"><span class="label-GJX1EXhk" data-label="true">开仓计算器，当止损在${latestText.match(/\d+\.?\d*/)[0]}时</span><span class="arrowIcon-GJX1EXhk" data-submenu-arrow="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16" width="10" height="16"><path d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"></path></svg></span></div>`
      // 只插入一次
      if (!firstTr.alreadyModified) {
        clonedTr2.addEventListener('mouseover', e => {
          if (window.diyTpslCalcToolTimer) clearTimeout(window.diyTpslCalcToolTimer)
          if (document.querySelector('#diy_tpsl_calc_tool')) return
          const newTr = document.createElement('tr');
          const selfPos = document.querySelector('#overlap-manager-root tbody tr:nth-child(2)').getBoundingClientRect().toJSON()
          const stopLossPrice = Number(latestText.match(/\d+[\.]\d+/))
          const currentPrice = Number(document.title.split(' ').find(i => i.match(/\d+[\.]\d+/)))
          const currentSymbol = document.title.split(' ')[0].replace('.P', '')
          const minLoss = Number(cfg.get('minLossCalculation'))
          const maxLoss = Number(cfg.get('maxLossCalculation'))
          const stepLoss = Number((Math.abs(minLoss - maxLoss) / 20).toFixed(1))
          const targetMinLoss = minLoss > maxLoss ? maxLoss : minLoss
          const targetMaxLoss = minLoss < maxLoss ? maxLoss : minLoss
          let resultItems = []
          for (let targetLoss = targetMinLoss; targetLoss <= targetMaxLoss; targetLoss += stepLoss) {
            if (targetLoss == 0) continue
            // console.info(`检查当前参数: `, targetLoss, stopLossPrice, currentPrice)
            const targetPrecision = simpleQuantityPrecision(currentSymbol, cfg)
            const finallyAmount = (targetLoss / (Math.abs(stopLossPrice - currentPrice))).toFixed(targetPrecision)
            const finallyLoss = (Math.abs(stopLossPrice - currentPrice) * finallyAmount).toFixed(1)
            const finallyNominalVaue = (finallyAmount * currentPrice).toFixed(1)
            if (finallyLoss != 0) resultItems.push({ loss: finallyLoss, pairAmount: finallyAmount, nominalValue: finallyNominalVaue })
          }
          resultItems = resultItems.filter((value, index, self) => self.findIndex(i => i.loss == value.loss) === index);
          const leftPos = (unsafeWindow.innerWidth - selfPos.x - selfPos.width < 270) ? (selfPos.x - 270) : (selfPos.x + selfPos.width)
          // console.info('leftPos: ', leftPos, unsafeWindow.innerWidth, selfPos)
          const cssScope = document.querySelector("#overlap-manager-root table").closest('div').classList[0].split('-')[1]
          newTr.innerHTML = `<td>
            <div class="menu-Tx5xMZww context-menu menuWrap-${cssScope}" id="containerDiv" style="position: fixed; left: ${leftPos}px; top: ${selfPos.y}px;">
              <div class="scrollWrap-${cssScope}" style="overflow-y: auto;">
                <div class="menuBox-${cssScope}" data-name="menu-inner">
                  <table>
                    <tbody>
                    <tr data-role="menuitem" class="accessible-rm8yeqY4 item-GJX1EXhk interactive-GJX1EXhk normal-GJX1EXhk" data-action-name="theme-switch-to-dark" tabindex="-1" style="cursor: pointer">
                        <td>
                          <div class="content-GJX1EXhk" style="padding: 0 20px; margin-left: 1px;"><span class="label-GJX1EXhk checked-GJX1EXhk" data-label="true">现价${currentPrice}开${stopLossPrice > currentPrice ? '空' : '多'}，止损回撤${(Math.abs(stopLossPrice - currentPrice) / currentPrice * 100).toFixed(2)}%</span></div>
                        </td>
                      </tr>
                      <tr><td><div style="height: 1px; margin: 6px 0; background: var(--tv-color-popup-element-divider-background,#434651);"></div></td></tr>
                      ${resultItems.map(i => `<tr title="点击复制、双击开单" data-role="menuitem" data-side="${stopLossPrice > currentPrice ? 'short' : 'long'}" data-nominal-value="${i.nominalValue}" data-loss="${i.loss}" data-current-price="${currentPrice}" data-stop-loss-price="${stopLossPrice}" data-amount="${i.pairAmount}" class="accessible-rm8yeqY4 item-GJX1EXhk interactive-GJX1EXhk normal-GJX1EXhk" data-action-name="theme-switch-to-dark" tabindex="-1" style="cursor: pointer">
                        <td>
                          <div class="content-GJX1EXhk" style="padding: 0 20px; margin-left: 1px;"><span class="label-GJX1EXhk checked-GJX1EXhk" data-label="true">亏${i.loss}u, 开:${i.pairAmount}, 名义值:${i.nominalValue}u</span></div>
                        </td>
                      </tr>`).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </td>`
          newTr.id = 'diy_tpsl_calc_tool'
          newTr.style.cursor = 'pointer'
          newTr.addEventListener('mouseover', e => {
            if (window.diyTpslCalcToolTimer) clearTimeout(window.diyTpslCalcToolTimer)
          })
          newTr.addEventListener('mouseout', e => {
            window.diyTpslCalcToolTimer = setTimeout(_ => {
              const targetEl = document.querySelector('#diy_tpsl_calc_tool')
              if (targetEl) targetEl.remove()
            }, 200)
          })
          tbody.appendChild(newTr)
          // 再次计算和修复目标位置Pos
          const targetDiv = document.querySelector('#containerDiv')
          const currentMenuListPos = targetDiv.getBoundingClientRect().toJSON()
          const offsetY = window.innerHeight - selfPos.y - currentMenuListPos.height
          if (offsetY < 0) targetDiv.style.top = `${window.innerHeight - currentMenuListPos.height}px`
          targetDiv.style.left = `${(unsafeWindow.innerWidth - selfPos.x - selfPos.width < currentMenuListPos.width) ? (selfPos.x - currentMenuListPos.width) : (selfPos.x + selfPos.width)}px`

          // 监听点击事件，复制数据
          let clickTimer = null
          document.querySelectorAll('#diy_tpsl_calc_tool tr').forEach(tr => {
            if (!tr.getAttribute('data-amount')) return
            // 监听点击事件
            tr.addEventListener('click', function () {
              if (clickTimer) clearTimeout(clickTimer)
              clickTimer = setTimeout(() => {
                const textToCopy = this.getAttribute('data-amount');
                navigator.clipboard.writeText(textToCopy).then(() => {
                  console.log('文字已复制: ' + textToCopy);
                  Toastify({
                    text: `已复制: ${textToCopy}`,
                    position: 'center',
                    duration: 3000,
                    style: {
                      background: "#12c99b",
                    }
                  }).showToast();
                }).catch(err => {
                  console.error('无法复制文字: ', err);
                });
              }, 200);
            });
            // 监听双击事件
            tr.addEventListener('dblclick', async function (e) {
              clearTimeout(clickTimer)
              console.info(e)
              TradingViewApi.trading().setOrderPanelVisibility(true) // 打开交易panel
              const targetTr = e.target.closest('tr')
              await new Promise(res => setTimeout(res, 100))
              const tradeInfo = targetTr.dataset
              console.info(tradeInfo)
              // 弹出通知提示
              Toastify({
                text: `亏${tradeInfo.loss}, 开:${tradeInfo.amount}, 名义值:${tradeInfo.nominalValue}`,
                position: 'center',
                duration: 3000,
                style: {
                  background: "#2962ff",
                }
              }).showToast();
              // 隐藏菜单栏
              document.querySelector("#overlap-manager-root").innerHTML = null
              if (!document.querySelector('div.trading-panel-content')) return
              // 设置开单方向
              document.querySelector(`div.trading-panel-content div[data-name="side-control-${tradeInfo.side == 'long' ? 'buy' : 'sell'}"]`).click()
              await new Promise(res => setTimeout(res, 100))
              // 检查是否设置了默认市价订单
              if (cfg.get('doubleClickDefaultMarketOrder')) {
                console.info(`设置了市价订单类型`)
                document.querySelector('button[id="Market"]').click()
              }
              await new Promise(res => setTimeout(res, 100))
              // 查询当前订单类型
              const currentOrderTypeBtn = document.querySelector('#id_order-type-tabs_tablist button[aria-selected="true"]')
              console.info('currentOrderTypeBtn.id: ', currentOrderTypeBtn.id)
              if (!['Market', 'Limit'].includes(currentOrderTypeBtn.id)) {
                console.info('检查到当前订单类型不是市价或限价，正在切换为市价')
                // 设置下单类型
                document.querySelector(`#id_order-type-tabs_tablist #Market`).click() // 暂时不需要设置下单类型了，因为我发现tradingview会缓存你的操作。
                await new Promise(res => setTimeout(res, 100))
              }
              // 尝试设置价格
              const targetPriceInput = document.querySelector('[class^="absolutePriceControl"] input')
              if (targetPriceInput) {
                setInputWithSetter(targetPriceInput, tradeInfo.currentPrice)
                console.info('设置了价格...')
              }
              // 尝试设置开仓数量 
              const targetAmountInput = document.querySelector('[class^="quantityWrapper"] input')
              if (targetAmountInput) {
                setInputWithSetter(targetAmountInput, tradeInfo.amount)
                console.info('设置了数量...')
              }
              // 设置止损价格
              const targetStopLossPriceInput = document.querySelectorAll('[class*="bracketInPrice"] input')[1]
              if (targetStopLossPriceInput) {
                setInputWithSetter(targetStopLossPriceInput, tradeInfo.stopLossPrice)
                console.info('设置了止损价格...')
              }
            })
          });
        })

        clonedTr2.addEventListener('mouseout', function () {
          window.diyTpslCalcToolTimer = setTimeout(_ => {
            const targetEl = document.querySelector('#diy_tpsl_calc_tool')
            if (targetEl) targetEl.remove()
          }, 200)
        });
        tbody.insertBefore(clonedTr2, firstTr.nextSibling);
        firstTr.alreadyModified = true;
      }
    }
  }

  // 重置窗口 
  function resizeWindow() {
    // 创建一个Event对象
    var resizeEvent = new Event('resize');
    // 获取window对象
    var windowObject = window;
    // 触发resize事件
    windowObject.dispatchEvent(resizeEvent);
  }

  // 移除图表下文时间范围条-开关
  async function removeChartTimeRange(cfg) {
    if (cfg.get('removeChartTimeRangePrefixEnable')) {
      const timeout = 60000;
      const startAt = Date.now()
      while (!document.querySelector('.chart-controls-bar') && Date.now() - startAt < timeout) {
        await new Promise(res => setTimeout(res, 500))
      }
      document.querySelector('.chart-controls-bar').style.display = 'none'
      resizeWindow()
    }
  }

  async function sendApiRequest(url) {
    return new Promise((res, rej) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: { "Content-Type": "application/json" },
        onload: function (response) {
          return res(response)
        },
        onerror: function (err) {
          return rej(err)
        }
      });
    })
  }

  // 获取币安的交易对信息
  async function getBinanceSymbolInfo() {
    return fetch('https://fapi.binance.com/fapi/v1/exchangeInfo').then(async d => {
      if (!d.ok) {
        console.info('开仓计算脚本：无法获取币安交易对信息，这可能是梯子ip所属地美国问题，正在通过中转获取...')
        return fetch('https://qjzr9oefo4.execute-api.ap-southeast-1.amazonaws.com/default/getUmSymbols?exchange=binance').then(d => d.json())
      }
      return d.json()
    }).then(res => {
      const result = Object.fromEntries(res.symbols.filter(i => i.symbol.endsWith('USDT')).map(i => { return [i.symbol, i.quantityPrecision] }))
      console.info('getBinanceSymbolInfo: ', result)
      return result
    }).catch(err => {
      console.info('errorr bn', err)
    })
  }

  // 获取欧易的交易对信息
  async function getOkxSymbolInfo() {
    return fetch('https://www.okx.com/api/v5/public/instruments?instType=SWAP').then(d => d.json()).then(res => {
      const result = Object.fromEntries(res.data.filter(symbol => symbol.settleCcy === 'USDT' && symbol.instFamily.endsWith('USDT')).map(i => {
        const n = Number(i.ctVal)
        const size = n >= 1 ? 0 : n.toString().split('.')[1].toString().length
        return [i.instFamily.replace('-', ''), size]
      }))
      console.info('getOkxSymbolInfo: ', result)
      return result
    })
  }

  async function updateSymbolInfo(cfg) {

    if (cfg.get && cfg.get('quantityPrecisionExchange') == 'Binance' || cfg['quantityPrecisionExchange'] == 'Binance') {
      binanceSymbolInfo = await getBinanceSymbolInfo()
    } else {
      okxSymbolInfo = await getOkxSymbolInfo()
    }
  }

  // 主执行函数
  async function main() {
    await loadExternalResources();
    const cfg = createConfigUI();

    updateSymbolInfo(cfg);

    interceptFetch(cfg);
    observeDOMChanges(cfg);
    removeChartTimeRange(cfg);
  }

  // 执行主函数
  main();
})();