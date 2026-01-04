// ==UserScript==
// @name         Idle Infinity - Filter
// @namespace    http://dazzyd.org/
// @version      0.4.7
// @description  Idle Infinity
// @author       Dazzy Ding
// @license      MIT
// @grant        GM_addStyle
// @match        https://www.idleinfinity.cn/Config/Query?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idleinfinity.cn
// @downloadURL https://update.greasyfork.org/scripts/458215/Idle%20Infinity%20-%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/458215/Idle%20Infinity%20-%20Filter.meta.js
// ==/UserScript==


const store = {
  load() {
    const saved = JSON.parse(localStorage.getItem(`dd_ui_filter`) || "{}")
    for (const [key, val] of Object.entries(saved)) {
      this[key] = val
    }
  },
  save() {
    localStorage.setItem(`dd_ui_filter`, JSON.stringify(this))
  },
}
const validOptions = {}


class Condition {
  constructor(name, value) {
    this.name = name
    this.value = value
  }

  static fromString(string) {
    const matches = string.match(/^【(.+?)】\s*(>=|=|包含)\s*【?(\d+)】?$/)
    if (matches == null) {
      return null
    }
    const cond = new Condition(matches[1], matches[3])
    if (validOptions.prefix.includes(cond.name) || validOptions.skill.includes(cond.name)) {
      return cond
    }
    return null
  }

  toString() {
    if (this.name === "序号") {
      return `【${this.name}】 = ${this.value}`
    }
    if (this.name === "名称") {
      return `【${this.name}】 包含 【${this.value}】`
    }
    return `【${this.name}】 >= ${this.value}`
  }

  compare(other) {
    // 【技能】排在前面，其他按选项顺序
    const indexOf = name =>
      validOptions.prefixAll.indexOf(name) - (name.includes("技能") ? validOptions.prefixAll.length : 0)
    if (this.name !== other.name) {
      return indexOf(this.name) - indexOf(other.name)
    }
    else {
      return this.value - other.value
    }
  }

  isSame(other) {
    return this.compare(other) === 0
  }

  isSkill() {
    return validOptions.skill.includes(this.name)
  }
}

class Rule {
  constructor(power, type, conditions, dom) {
    this.power = power
    this.type = type
    this.conditions = conditions == null ? [] : conditions.sort((a, b) => a.compare(b))
    this.dom = dom
  }

  static fromString(string) {
    const parts = string.split('|')
    const conds = parts.slice(2).map(s => Condition.fromString(s))
    if (conds.indexOf(null) !== -1) {
      return null
    }
    const rule = new Rule(parts[0], parts[1], conds)
    if (validOptions.power.includes(rule.power) && validOptions.type.includes(rule.type)) {
      return rule
    }
    return null
  }

  toString() {
    const parts = []
    parts.push(this.power)
    parts.push(this.type)
    for (const cond of this.conditions) {
      parts.push(cond.toString())
    }
    return parts.join('|')
  }

  compare(other) {
    if (this.power !== other.power) {
      return validOptions.power.indexOf(this.power) - validOptions.power.indexOf(other.power)
    }
    if (this.type !== other.type) {
      return validOptions.type.indexOf(this.type) - validOptions.type.indexOf(other.type)
    }
    if (this.conditions.length !== other.conditions.length) {
      return this.conditions.length - other.conditions.length
    }
    for (const [i, cond] of this.conditions.entries()) {
      const ret = cond.compare(other.conditions[i])
      if (ret !== 0) return ret
    }
    return 0
  }

  isSame(other) {
    return this.compare(other) === 0
  }
}

function createElementByHTML(html) {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstChild
}


function addRule(rule) {
  function select_value(dom, value) {
    for (const [index, option] of Object.entries(dom.options)) {
      if (option.text === value) {
        dom.selectedIndex = index
        return
      }
    }
    console.error(`无法在DOM${dom}中找到选项${value}`)
  }

  const modal = document.querySelector("#modalConfig")
  setTimeout(step1, 0)

  function step1() {
    const modalOpen = document.querySelector("a[data-target='#modalConfig']")
    modalOpen.click()
    select_value(modal.querySelector("select#power"), rule.power)
    select_value(modal.querySelector("select#type"), rule.type)
    const condDivList = modal.querySelectorAll("div.condition")
    const condAdd = modal.querySelector("button.config-magic-add")
    for (let i = condDivList.length; i < rule.conditions.length; i++) {
      condAdd.click()
    }
    setTimeout(step2, 250)
  }

  function step2() {
    const condDivList = modal.querySelectorAll("div.condition")
    for (const [index, cond] of rule.conditions.entries()) {
      const div = condDivList[index]
      if (cond.isSkill()) {
        select_value(div.querySelector("select.prefix"), "+ 职业指定技能")
        select_value(div.querySelector("select.sk"), cond.name)
      }
      else {
        select_value(div.querySelector("select.prefix"), cond.name)
      }
      div.querySelector("input.min").value = cond.value
    }
    setTimeout(step3, 250)
  }

  function step3() {
    modal.querySelector("button.config-apply").click()
  }
}

function loadCurrentRules() {
  return Array.from(document.querySelectorAll('tbody tr'))
    .map(row => {
      const tds = row.querySelectorAll('td')
      return new Rule(
        tds[1].innerText,
        tds[2].innerText,
        Array.from(tds[3].querySelectorAll('div.col-sm-6')).map(
          div => Condition.fromString(div.innerText)),
        row,
      )
    })
    .sort((a, b) => a.compare(b))
}

function parseRulesByText(text) {
  const rules = []
  const errors = []
  const lines = text.split('\n').map(s => s.trim()).filter(s => s.length > 0)
  for (const [index, line] of lines.entries()) {
    const rule = Rule.fromString(line)
    if (rule != null) {
      rules.push(rule)
    }
    else {
      errors.push([index, line])
    }
  }
  return [rules, errors]
}

function updateTable() {
  if (store.rules == null) {
    return
  }
  const currentRules = loadCurrentRules()
  const [requireRules, _] = parseRulesByText(store.rules)
  let isExactMatch = true

  // 高亮不在配置中的多余规则
  for (const rule of currentRules) {
    if (requireRules.find(other => rule.isSame(other)) != null) {
      continue
    }
    console.log(`多余规则：${rule}`)
    isExactMatch = false
    rule.dom.style.backgroundColor = "#900"
  }

  // 缺少规则
  let firstCurrent = currentRules[0].dom
  for (const rule of requireRules) {
    if (currentRules.find(other => rule.isSame(other)) != null) {
      continue
    }
    console.log(`缺少规则：${rule}`)
    isExactMatch = false
    const row = createElementByHTML(`
    <tr style="background-color: #009">
      <td class="text-center">无效</td>
      <td class="text-center">${rule.power}</td>
      <td class="text-center">${rule.type}</td>
      <td>
        <div class="container-fluid">
          ${rule.conditions.map(cond => `<div class="col-sm-6 col-md-6"><span>${cond.toString()}</span></div>`).join('')}
        </div>
      </td>
      <td>
        <span class="label label-primary rule-add">添加</span>
      </td>
    </tr>
    `)
    firstCurrent.before(row)
    row.getElementsByClassName('rule-add')[0]
      .addEventListener("click", () => {
        addRule(rule)
      })
  }

  // 如果完全匹配，则清空保存的规则
  if (isExactMatch) {
    store.rules = null
    store.save()
  }
}

function updateUI() {
  document.querySelector(".panel-heading > .pull-right").prepend(createElementByHTML(`
  <a class="btn btn-xs btn-danger" id="helper-open" role="button" data-toggle="modal" data-target="#modalHelper">助手</a>
  `))
  document.getElementById("modalImport").after(createElementByHTML(`
  <div class="modal fade" id="modalHelper" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-md" role="document">
      <div class="modal-content model-inverse">
        <div class="modal-header">
          <span class="modal-title">批量管理助手</span>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="control-label">编辑规则文本并提交</label>
            <textarea class="form-control" rows="20" id="helper-rules"></textarea>
          </div>
          <div class="form-group error" id="helper-error"></div>
          <div class="form-group">
            <label>使用说明</label>
            <p>
              蓝底为需要手动增加，红底为需要手动删除。<br>
              清空规则文本可以停用助手。<br>
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary btn-xs" id="helper-submit">提交</button>
          <button type="button" class="btn btn-default btn-xs" data-dismiss="modal">关闭</button>
        </div>
      </div>
    </div>
  </div>
  `))

  document.getElementById("helper-open")
    .addEventListener("click", () => {
      const output = store.rules != null ? store.rules
        : loadCurrentRules().map(rule => rule.toString()).join('\n')
      document.getElementById("helper-rules").value = output
    })
  document.getElementById("helper-submit")
    .addEventListener("click", () => {
      const input = document.getElementById("helper-rules").value
      const [_, errors] = parseRulesByText(input)
      if (errors.length > 0) {
        document.getElementById("helper-error").innerHTML =
          errors.map(([index, line]) => `第${index + 1}行：${line}`).join('<br>')
      }
      else {
        store.rules = input.trim() === "" ? null : input
        store.save()
        location.reload()
      }
    })
}

setTimeout(() => {
  store.load()
  for (const [key, selector] of Object.entries({
    power: "#modalConfig #power option",
    type: "#modalConfig #type option",
    prefix: ".condition-template .prefix option",
    skill: ".condition-template .sk option",
  })) {
    validOptions[key] = Array.from(document.querySelectorAll(selector)).map(
      e => e.innerText.trim())
  }
  validOptions.prefixAll = [].concat(validOptions.prefix, validOptions.skill)

  updateTable()
  updateUI()
}, 0)
