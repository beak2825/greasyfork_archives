// ==UserScript==
// @name         Fanatical Get Key
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  F站刮key
// @author       Ku Mi
// @match        https://www.fanatical.com/*
// @icon         https://cdn.fanatical.com/production/icons/favicon-32x32.png
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/430370/Fanatical%20Get%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/430370/Fanatical%20Get%20Key.meta.js
// ==/UserScript==
(function() {
    let gameCount = 0
    let isRun = false
    const render = (obj) => {
      let str = ''
      Object.keys(obj).forEach(bundleName => {
          str += (str ? '\n' : '') + '【' + bundleName + '】\n'
          const arr = Object.keys(obj[bundleName])
          arr.forEach(item => {
            const gameArr = obj[bundleName][item]
            str += gameArr.reduce((str, item2) => (str += item + ',' + item2.key + '\n'),'')
        })
        //   if(flag) {
        //       let longArrName = arr.reduce((a, b) => {
        //           return obj[bundleName][a].length >= obj[bundleName][b].length ? a : b
        //       })
        //       arr.splice(arr.findIndex(item => item === longArrName), 1)
        //       str += [longArrName, ...arr].join('\t') + '\n'
        //       const longArr = obj[bundleName][longArrName]
        //       longArr.forEach((item, index) => {
        //           const keyArr = []
        //           keyArr.push(item.key)
        //           arr.forEach(item2 => {
        //               const data = obj[bundleName][item2][index]
        //               if(data) {
        //                   keyArr.push(data.key || '')
        //               } else {
        //                   keyArr.push('')
        //               }
        //           })
        //           str += keyArr.join('\t') + '\n'
        //       })
        //   } else {
        //       arr.forEach(item => {
        //           const gameArr = obj[bundleName][item]
        //           str += gameArr.reduce((str, item2) => (str += item + ',' + item2.key + '\n'),'')
        //       })
        //   }
      })
      const input = document.querySelector('.zf-redeem-text')
      input.value = str
    }
    const myPromise = (item) => {
        return new Promise(async (resolve) => {
            if(item.key) {
                item.key += `(已刮过)`
                resolve(item)
            } else {
                delete item.key
                try {
                    resolve(await request(`https://www.fanatical.com/api/user/orders/redeem`, { method: 'POST', body: JSON.stringify(item) }))
                } catch(e) {
                    resolve({key: '请求失败'})
                }
            }
        })
    }
    const redeem = async (data, obj, count, ele) => {
        const result = await Promise.all(data.map(item => myPromise(item)))
        result.forEach((item, index) => {
            gameCount--
            data[index].key = item.key
            if(ele) ele.innerHTML = `一键刮key(${count} / ${count - gameCount})`
        })
        if(gameCount <= 0) {
            render(obj)
            gameCount = 0
            isRun = false
        }
    }
    const func = (obj, name, item, atok, order_id, bid) => {
        if(item.status === 'refunded' || item.type === 'software') return
        if(!obj[name][item.name]) {
            obj[name][item.name] = []
        }
        gameCount++
        obj[name][item.name].push(Object.assign({
            atok,
            oid: order_id,
            iid: item.iid,
            serialId: item.serialId,
            key: item.key
        }, bid ? {bid} : null))
    }
    const getData = ({status, _id : order_id, items: orderList}, obj = {}) => {
      if(status !== 'COMPLETE') return alert('订单未完成')
      const atok = window.localStorage.bsatok
      orderList.forEach(item => {
          if(item.status === 'refunded') return
          if(item.pickAndMix) {
              if(!obj[item.pickAndMix]) {
                  obj[item.pickAndMix] = {}
              }
              if(item.bundles.length) {
                  item.bundles.forEach(gameList => {
                      gameList.games.forEach(item2 => {
                          func(obj, item.pickAndMix, item2, atok, order_id)
                      })
                  })
              } else {
                  func(obj, item.pickAndMix, item, atok, order_id)
              }

          } else {
              if(item.bundles.length) {
                  if(!obj[item.name]) {
                      obj[item.name] = {}
                  }
                  item.bundles.forEach(item2 => {
                      item2.games.forEach(item3 => {
                          func(obj, item.name, item3, atok, order_id, item._id)
                      })
                  })
              } else {
                  if(!obj['单个游戏']) {
                      obj['单个游戏'] = {}
                  }
                  func(obj, '单个游戏', item, atok, order_id)
              }
          }
      })
      return obj
    }
    const request = async (url, {method = 'GET', body = null} = {}) => {
        const result = await fetch(url, {
            method,
            body,
            headers: {
                anonid: JSON.parse(window.localStorage.bsanonymous).id,
                authorization: JSON.parse(window.localStorage.bsauth).token,
                'content-type': 'application/json; charset=utf-8'
            }
        })
        return await result.json()
    }
    async function clickEvent(order) {
        if(isRun) return
        isRun = true
        this.innerHTML = `一键刮key中...`
        const obj = getData(await request(`https://www.fanatical.com/api/user/orders/${order}`))
        this.innerHTML = `一键刮key(${gameCount} / 0)`
        let count = gameCount
        for(let name in obj) {
            for(let item in obj[name]) {
                await redeem(obj[name][item], obj, count, this)
            }
        }
    }
      const init = (list) => {
          setTimeout(() => {
              list.forEach(item => {
                  if(item.previousElementSibling.innerText === 'COMPLETE' && item.childElementCount === 1) {
                      item.classList.add('zf-has')
                      const [, order] = item.parentElement.parentElement.href.match(/orders\/(\w+)/)
                      const me = document.querySelector(`.v-${order}`)
                      if(me) return
                      const div = document.createElement('div')
                      div.className = `zf-wrap v-${order}`
                      div.style = `position: absolute;right: 20px;top: ${item.offsetTop}px;`
                      div.innerHTML = '<div class="zf-coustom">一键刮key</div>'
                      div.firstElementChild.onclick = clickEvent.bind(div.firstElementChild, order)
                      document.documentElement.appendChild(div)
                  }
              })
          }, 1000)
      }
      const initRedeem = (container) => {
          const ele = document.createElement('div')
          ele.className = 'zf-redeem-wrap'
          ele.innerHTML = `
           <textarea class="zf-redeem-text" placeholder="兑换礼品码(适用于整包，单游戏, 一个ip最多10个，有冷却)"></textarea>
           <button class="btn btn-primary zf-redeem">兑换</button>
         `
          container.insertBefore(ele, container.firstElementChild)
          ele.querySelector('.zf-redeem').onclick = async () => {
              if(isRun) return
              const codes = ele.firstElementChild.value.split('\n').filter(item => {
                const code = item.trim()
                return /\w{14}/.test(code)
              }).slice(0, 10)
              let flag = window.confirm(`一次最多兑换10个，数量：${codes.length}\n${codes.join('\n')}`)
              if(!flag || !codes.length) return
              isRun = true
              let messageList = []
              for(let i = 0; i < codes.length; i++) {
                  let msg = codes[i]
                  let id
                  try {
                      const { _id, message } = await request('https://www.fanatical.com/api/user/redeem-code/redeem', {method: 'POST', body: JSON.stringify({code: codes[i]})})
                      if(_id) {
                       msg += '-----成功'
                       id =_id
                      }
                      if(message) msg += `-----${message}`
                  } catch(e) {
                      msg += `-----${e}`
                      console.error(e)
                  }
                  messageList.push({msg, id})
              }
              flag = window.confirm(`兑换详情:\n是否需要兑换key\n${messageList.map(item => item.msg).join('\n')}`)
              if(!flag) return
              messageList = messageList.filter(item => item.id)
              const obj = {}
              for(let i = 0; i < messageList.length; i ++) {
                 const item = messageList[i]
                 getData(await request(`https://www.fanatical.com/api/user/orders/${item.id}`), obj)
              }
              let count = gameCount
              for(let name in obj) {
                  for(let item in obj[name]) {
                   await redeem(obj[name][item], obj, count)
                  }
              }
          }
      }
        const content = document.querySelector('#root')
        const observer = new MutationObserver((mutationsList) => {
            if(!/orders\/?$/.test(location.pathname)) {
              document.querySelectorAll('.zf-wrap').forEach(item => item.remove())
              return
            }
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    const list = mutation.target.querySelectorAll('.d-none.d-md-block.action-col:not(.zf-has)')
                    if(list.length) init(list)
                    const container = mutation.target.querySelector('.account-content.orders-and-keys')
                    if(!container) continue
                    if(container.querySelector('.zf-redeem-wrap')) continue
                    initRedeem(container)
                } else if(mutation.type === 'childList' && mutation.removedNodes.length) {
                   mutation.removedNodes.forEach(item => {
                     if(item.className = 'table-item' && item.firstElementChild && item.firstElementChild.nodeName === 'A') {
                       const [, order] = item.firstElementChild.href.match(/orders\/(\w+)/)
                       const me = document.querySelector(`.v-${order}`)
                       if(me) me.remove()
                     }
                   })
                }
            }
        })
        const config = { childList: true, subtree: true }
        observer.observe(content, config)
  GM_addStyle(`
  .zf-coustom {
   padding: 5px 15px;
   border-radius: 5px;
   background-color: #212121;
   cursor: pointer;
   font-size: 14px;
   text-align: center;
   color: #fff;
   margin-top: 10px;
  }
  .zf-coustom:hover {
   opacity: 0.5;
  }
  .zf-redeem-wrap {
   display: flex;
   align-items: flex-end;
  }
  .zf-redeem-text {
    width: 500px;
    height: 250px;
    margin-right: 20px;
    outline: none;
  }
  `)
  })();
