// ==UserScript==
// @name         h5魔塔修改器
// @namespace    https://greasyfork.org/zh-CN/users/325815-monat151
// @license      MIT
// @version      1.1.0
// @description  体验剧情，或者单纯想爽，都行
// @author       monat151
// @match        https://h5mota.com/games/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494659/h5%E9%AD%94%E5%A1%94%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/494659/h5%E9%AD%94%E5%A1%94%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const deal = () => {
        const _STATUSES = [
            { key: 'hp', text: '生命值' },
            // { key: 'mana', text: '当前魔法值' },
            { key: 'atk', text: '攻击力' },
            { key: 'def', text: '防御力' },
            // { key: 'mdef', text: '魔法防御力' },
            { key: 'money', text: '金钱' },
            // { key: 'lv', text: '等级' },
            // { key: 'experience', text: '经验' },
            // { key: 'hpmax', text: '生命值上限' },
            { key: 'yellowKey', text: '黄钥匙数量', type: 'item' },
            { key: 'blueKey', text: '蓝钥匙数量', type: 'item' },
            { key: 'redKey', text: '红钥匙数量', type: 'item' },
            { key: 'greenKey', text: '绿钥匙数量', type: 'item' },
            { key: 'steelKey', text: '铁门钥匙数量', type: 'item' },
            { key: 'bigKey', text: '大黄门钥匙数量', type: 'item' },
            { key: 'coin', text: '幸运金币数量', type: 'item' },
            { key: 'bomb', text: '炸弹数量', type: 'item' },
            { key: 'pickaxe', text: '破墙镐数量', type: 'item' },
            { key: 'earthquake', text: '地震卷轴数量', type: 'item' },
            { key: 'superPotion', text: '圣水数量', type: 'item' },
            { key: 'centerFly', text: '对称飞数量', type: 'item' },
            { key: 'upFly', text: '上楼器数量', type: 'item' },
            { key: 'downFly', text: '下楼器数量', type: 'item' },
        ]

        const getStatus = (key, type) => {
            if (type === 'item') {
                return window.core.itemCount(key)
            } else {
                return window.core.getStatus(key)
            }
        }
        const setStatus = (key, value, type) => {
            if (type === 'item') {
                window.core.setItem(key, value)
            } else {
                window.core.setStatus(key, value)
            }
        }

        const _MODAL_ID = `_H5motaModifier_main-modal`
        const openModal = (event) => {
            if (document.getElementById(_MODAL_ID)) {
                closeModal(event)
            }
            const modal = document.createElement('div')
            modal.id = `_H5motaModifier_main-modal`
            modal.style = `
              display: block;
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background-color: white;
              padding: 20px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              border-radius: 5px;
              z-index: 500;
              max-height: 90%;
              overflow-y: auto;
            `
            const closeBtn = document.createElement('span')
            closeBtn.style = `
              font-size: 30px;
              position: absolute;
              top: 10px;
              right: 10px;
              cursor: pointer;
            `
            closeBtn.innerText = '×'
            closeBtn.onclick = closeModal
            modal.appendChild(closeBtn)
            const h2 = document.createElement('h2')
            h2.innerText = 'H5魔塔修改器'
            modal.appendChild(h2)
            const tip = document.createElement('div')
            tip.innerHTML = '仅供自娱自乐，不要提交分数（不过应该也提交不了）'
            tip.style = `
              color: orange;
              font-size: 13px;
              margin-bottom: 10px;
            `
            modal.appendChild(tip)
            const table = document.createElement('table')
            table.style = `
              font-size: 15px;
            `
            const row1 = document.createElement('tr')
            row1.innerHTML = `
              <th style="text-align: left;">属性</th>
              <th style="min-width: 90px;">当前值</th>
              <th>修改为</th>
            `
            table.appendChild(row1)
            for (let i = 0; i < _STATUSES.length; i++) {
                const statuser = _STATUSES[i]
                const row = document.createElement('tr')
                const cell_statusName = document.createElement('td'); cell_statusName.innerHTML = '<b>'+ statuser.text +'</b>'
                const cell_currentValue = document.createElement('td'); cell_currentValue.innerHTML = getStatus(statuser.key, statuser.type)
                const cell_targetValue = document.createElement('td')
                cell_currentValue.style = 'text-align: center'
                cell_targetValue.style = 'text-align: center'
                const _input = document.createElement('input')
                _input.id = `_H5motaModifier_input-${statuser.key}`
                _input.type = 'number'
                _input.style = `
                  width: 100px;
                  padding: 5px;
                  border: 1px solid #ccc;
                  border-radius: 3px;
                `
                cell_targetValue.appendChild(_input)
                row.appendChild(cell_statusName)
                row.appendChild(cell_currentValue)
                row.appendChild(cell_targetValue)
                table.appendChild(row)
            }
            modal.appendChild(table)
            const clearDebuffCbx = document.createElement('input')
            clearDebuffCbx.id = '_H5motaModifier_cbx-clear_debuffs'
            clearDebuffCbx.type = "checkbox"
            modal.appendChild(clearDebuffCbx)
            const clearDebuffLabel = document.createElement('span')
            clearDebuffLabel.innerHTML = '清除异常状态(中毒、虚弱、诅咒)'
            clearDebuffLabel.style = 'font-size: 14px;'
            modal.appendChild(clearDebuffLabel)
            const saveBtn = document.createElement('button')
            saveBtn.innerText = '保存'
            saveBtn.style = `
              float: right;
              background-color: #28a745;
              color: white;
              border: none;
              margin-top: 15px;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
            `
            const save = event => {
                const changes = []; const err = []
                for (let i = 0; i < _STATUSES.length; i++) {
                    const statuser = _STATUSES[i]
                    const id = `_H5motaModifier_input-${statuser.key}`
                    const value = document.getElementById(id)?.value
                    if (value == undefined || value == null || value == '') continue
                    changes.push({ key: statuser.key, value: Number(value), type: statuser.type, text: statuser.text })
                }
                console.log('clearDebuffCbx:', clearDebuffCbx.checked)
                console.log('[H5motaModifier] changes:', changes)
                if (clearDebuffCbx.checked) {
                    window.core.triggerDebuff('remove', ['poison', 'weak', 'curse'])
                } else if (!changes.length) {
                    window.alert('没有做出任何更改'); return
                }
                changes.forEach(change => {
                    try {
                        setStatus(change.key, change.value, change.type)
                    } catch (e) {
                        err.push(`修改${change.text}失败!${e}`)
                    }
                })
                if (err.length) {
                    window.alert(err.join('\n'))
                } else {
                    const tips = []
                    if (changes.length) tips.push(`修改了${changes.length}个项目`)
                    if (clearDebuffCbx.checked) tips.push('清除了所有异常状态')
                    window.core.drawTip(`(H5魔塔修改器) ${tips.join('并')}`)
                }
                closeModal()
            }
            saveBtn.onclick = save
            modal.appendChild(saveBtn)
            document.body.appendChild(modal)
        }
        const closeModal = (event) => {
            const _modal = document.getElementById(_MODAL_ID)
            _modal?.remove()
        }


        const operateBtn = document.createElement('button')
        operateBtn.innerText = '打开修改窗口'
        operateBtn.onclick = openModal
        operateBtn.style = `
          position: fixed;
          right: 10px;
          bottom: 10px;
          z-index: 9999;
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        `
        document.body.appendChild(operateBtn)
    }
    setTimeout(deal, 500)
})();