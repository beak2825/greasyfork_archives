// ==UserScript==
// @name AW Autoclaim Script
// @version 1.4
// @namespace aw.bot
// @match https://play.alienworlds.io/
// @description AW autoclaim supported by Anti-captcha
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/426970/AW%20Autoclaim%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/426970/AW%20Autoclaim%20Script.meta.js
// ==/UserScript==
(function () {
  setTimeout(async function () {
    console.log(`%cAW Autoclaim script loaded`, 'color:green');
    try {
        let userAccount = await wax.login()
        let account = userAccount
        let delay = millis => new Promise((resolve, reject) => {
          setTimeout(_ => resolve(), millis)
        });
        await delay(10000)
    
        while (true) {
          let firstMine = true
          let previousMineDone = false
          let minedelay = 1
          do {
            minedelay = await getMineDelay(account)
            await delay(minedelay)
          } while (minedelay !== 0 && (previousMineDone || firstMine))
          let balance = await getBalance(account, wax.api.rpc)

          console.log(`%cbalance: (before mine)${balance}`, 'color:green')
          let mine_work = await background_mine(account)
          console.log(`%c${mine_work.account} Pushing mine results...`, 'color:green')
          let mine_data = {
            miner: mine_work.account,
            nonce: mine_work.rand_str,
          }
          console.log('mine_data', mine_data)
          let actions = [{
            account: mining_account,
            name: 'mine',
            authorization: [{
              actor: mine_work.account,
              permission: 'active',
            }],
            data: mine_data,
          }]
          let result = await wax.api.transact({
            actions,
          }, {
            blocksBehind: 3,
            expireSeconds: 90,
          })
          console.log('result is=', result)
          let amounts = new Map()
          if (result && result.processed) {
            result.processed.action_traces[0].inline_traces.forEach((t) => {
              if (t.act.data.quantity) {
                let mine_amount = t.act.data.quantity
                console.log(`%c${mine_work.account} mined: ${mine_amount} TLM`, 'color:green')
                if (amounts.has(t.act.data.to)) {
                  let obStr = amounts.get(t.act.data.to)
                  obStr = obStr.substring(0, obStr.length - 4)
                  let nbStr = t.act.data.quantity
                  nbStr = nbStr.substring(0, nbStr.length - 4)
                  let balance_inside = (parseFloat(obStr) + parseFloat(nbStr)).toFixed(4)
                  amounts.set(t.act.data.to, `${balance_inside.toString()} TLM`)
                } else {
                  amounts.set(t.act.data.to, t.act.data.quantity)
                }
              }
            })
            firstMine = false
            previousMineDone = true
          }
          balance = await getBalance(account, wax.api.rpc)
          console.log(`%cbalance (after mined): ${balance}`, 'color:green')
          window.location.reload();
        }
    } catch (e) {
      window.location.reload();
    }
  }, 6000);
}())