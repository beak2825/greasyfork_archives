// ==UserScript==
// @name         接口文档=>ts代码
// @namespace    http://tampermonkey.net/
// @version      0.1.11
// @description  接口文档=>ts代码，不能完美转化，但是还比较好用
// @author       fangxianli
// @match        https://km.sankuai.com/*
// @icon         https://www.google.com/s2/favicons?domain=undefined.
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432130/%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3%3D%3Ets%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/432130/%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3%3D%3Ets%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
const InterfaceModel = {
  // 字段名
  names: [/名称/, /参数/, /字段/, /属性/, /名字/, /name/i, /key/i],
  // 类型
  types: [/类型/, /type/i],
  // 含义
  means: [/含义/, /意义/, /意思/, /描述/, /解释/, /说明/, /备注/, /返回/, /mean/i],
  // 例子
  examples: [/示例/, /例子/, /举例/, /eg/i, /example/i]
}

// TODO： 做成可配置的
const TYPE_MAP = [
  {
    name: 'number',
    match: [
      /number/i,
      /int/i,
      /数字/,
      /integer/i,
      /float/i,
      /时间/,
      /date/i,
      /整数/,
      /整型/,
      // TODO: 长整型到底用不用字符串🤔，float 和 double 用字符串不
      /长整型/,
      /long/i,
      /float/i,
      /double/i,
    ]
  },
  {
    name: 'string',
    match: [
      /string/i,
      /字符/,
      /字符串/,
    ]
  },
  {
    name: 'boolean',
    match: [
      /Boolean/i,
      /布尔/,
    ]
  },
  {
    name: 'array',
    match: [
      /list<(\w+)>/i
    ]
  },
  {
    name: 'object',
    match: [
      /(\w+)/
    ]
  }
]

/**
 * 获取之前最邻近的文本内容
 * @param {Element} $currentNode
 */
const findPrevText = ($currentNode) => {
  if (!$currentNode) return
  if ($currentNode?.previousElementSibling?.innerText) return $currentNode?.previousElementSibling?.innerText
  return findPrevText($currentNode.parentElement)
}

/**
 * 深度优先遍历节点，获取树上最深的第一个文本节点
 * @param {Element} node
 */
const dfsFindText = (node) => {
  if (!node?.innerText) return
  if (!node?.children.length) return node.innerText
  for (let i = 0; i < node.children.length; i++) {
    const text = dfsFindText(node.children[i])
    if (text !== undefined) return text
  }
}

/**
 *
 * @param {Element} element
 */
const getContent = (element) => {
  if (!element) return
  const tableInTD = element.querySelectorAll('table')[0]
  if (tableInTD) return findPrevText(tableInTD)
  return element?.innerText?.trim()
}

const testInRegExpArray = (testStr, regExpArr = []) => regExpArr.some(regExp => regExp.test(testStr))

/**
 * 从表头里获取对应字段的位置
 * @param {String} name 字段名
 * @param {Element[]} headers 表头
 */
const getPropsIndex = (name, headers) => headers.findIndex(header => testInRegExpArray(header.innerText, InterfaceModel[name]))

/**
 * 将 table 中的数据转化为能够被识别的类型
 * @param {Element} table
 */
const convertTable2Map = (table) => {
  const prevText = findPrevText(table) || ''
  const charStringArray = prevText?.match(/\w+/g)
  const interfaceName = charStringArray ? charStringArray.join('-') : 'UnknownInterface'
  const typeModel = {
    name: interfaceName,
    defineList: [],
    table
  }
  const headers = [...table.querySelectorAll('th')]
  const nameIndex = getPropsIndex('names', headers)
  const typeIndex = getPropsIndex('types', headers)
  const meanIndex = getPropsIndex('means', headers)
  const exampleIndex = getPropsIndex('examples', headers)
  // 找到第一个 display 不为 none 的 body，即为数据表
  const targetTable = [...table.querySelectorAll('tbody')].find(tbody => tbody.style.display !== 'none')
  // 去除表头
  const rows = [...targetTable.children]
  rows.splice(0, 1)
  const defineList = rows.map((row) => {
    return {
    name: getContent(row.children[nameIndex]),
    type: getContent(row.children[typeIndex]),
    mean: getContent(row.children[meanIndex]),
    example: getContent(row.children[exampleIndex]),
  }})

  typeModel.defineList = defineList
  return typeModel
}

const addCommentPrefix = str => ` * ${str}`
const filterEmpty = arr => arr?.filter(x => x)

const preprocessCode2Arr = str => filterEmpty(str?.split('\n') || [])

const getComment = ({mean, example}) => {
  if (!mean && !example) return []
  const meanArr = preprocessCode2Arr(mean).map(addCommentPrefix) || []
  const exampleArr = preprocessCode2Arr(example).map(addCommentPrefix) || []
  if (exampleArr.length) {
    exampleArr.unshift(' * @example', ' * 示例：')
  }
  const comment = [
    `/**`,
    ...meanArr,
    ...exampleArr,
    ` */`
  ]
  return comment
}

const getTSTypeStr = (type) => {
  if (!type) return 'unknown'
  const tsTypeDesc = TYPE_MAP.find(typeMap => {
    return testInRegExpArray(type, typeMap.match)
  })
  const directReturnArr = ['number', 'string', 'boolean']
  const canDirectReturnName = directReturnArr.includes(tsTypeDesc?.name)
  const needMatch = tsTypeDesc?.name === 'array' || tsTypeDesc?.name === 'object'
  if (canDirectReturnName) return tsTypeDesc?.name
  if (needMatch) {
    for (const match of tsTypeDesc.match) {
      const matchResult = type.match(match)
      if (!matchResult?.[1]) continue
      if (tsTypeDesc.name === 'array') return matchResult[1] + '[]'
      return matchResult[1]
    }
  }
  return 'unknown'
}

const getNameDefine = ({name, type}) => {
  const typeStr = getTSTypeStr(type)
  return [`${name}: ${typeStr}`]
}

const addTab = str => `  ${str}`

const convertData2Code = ({name, defineList}) => {
  const getCode = (defineItem) => {
    return [...getComment(defineItem), ...getNameDefine(defineItem)]
  }

  const interfaceDefine = [
    `interface ${name} {`,
    ...defineList.map(getCode).flat(Infinity).map(addTab),
    `}`,
    ''
  ]
  return interfaceDefine
}

const getCode = () => {
  const allTables = document.querySelectorAll('table')
  /**
   * 筛选出接口定义的table
   */
  const defineTable = [...allTables].filter(table => {
    const headers = [...(table.querySelector('tr')?.children || [])]
    const tableRows = table.querySelectorAll('tr')
    const hasNameTableHeader = headers.some(header => testInRegExpArray(header.innerText, InterfaceModel.names))
    return hasNameTableHeader && tableRows.length > 1
  })

  const defineDataList = defineTable.map(convertTable2Map)
  console.log({defineDataList})
  const codeArray = defineDataList.map(convertData2Code)
  console.log(codeArray)
  return codeArray
}

const copyCode = () => {
  const codeArray = getCode()
  const textArea = document.createElement('textarea')
  textArea.value = codeArray.flat(Infinity).join('\n')
  document.body.append(textArea)
  textArea.select()
  document.execCommand('copy')
  // document.body.remove(textArea)
  textArea.style.display = 'none'
}

const logShortKey = () => console.log("%c  试试快捷键[ ⇧ + ⌃ + ⌥ + j] (shift + ctrl + option + j) 将接口文档转化成 ts 代码吧",
  `color: #333;
  font-size: 16px;
  background-image: linear-gradient(to right, #4facfe, #00f2fe);
  padding: 4px;
  border-radius: 20px;`
)

const logFeedback = () => console.log("%c  使用中遇到问题请点击右侧链接联系: https://x.sankuai.com/bridge/chat?uid=1833639275",
  `color: #333;
  font-size: 16px;
  background-image: linear-gradient(to right, #4facfe, #00f2fe);
  padding: 4px;
  border-radius: 20px;`
)

setTimeout(() => {
  logShortKey()
  logFeedback()
}, 1000)

document.addEventListener('keypress', (event) => {
  if (event.code === 'KeyJ' && event.shiftKey && event.altKey && event.ctrlKey) {
    try {
      copyCode()
      alert('转换代码复制成功，快去粘贴吧')
    } catch (err) {
      console.error(err)
    }
    logFeedback()
  }
})

// Your code here...
})();