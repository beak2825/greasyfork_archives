// ==UserScript==
// @name         importShell
// @namespace    http://github.com/2943102883
// @version      1.0.1
// @description  一个控制台导包工具
// @author       SunShineGo
// @license MIT
// @include      *://*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457157/importShell.user.js
// @updateURL https://update.greasyfork.org/scripts/457157/importShell.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  defaultInsert.pkg = name => {
    insertJS(name, 'pkg')
  }
  defaultInsert.cdn = name => {
    insertJS(name, 'cdn')
  }
  defaultInsert.esm = name => {
    insertJS(name, 'esm')
  }
  window.$i = defaultInsert
})()

function defaultInsert(name) {
  insertJS(name, 'pkg')
}
async function insertJS(name, type = 'pkg') {
  if (!help(name)) return
  const linkDir = {
    pkg: await pkg(name),
    cdn: await cdn(name),
    esm: await esm(name)
  }
  if (typeof name != 'string') throw new Error('请输入正确的包名')
  // 引入js
  var script = document.createElement('script')
  script.type = 'text/javascript'
  const link = linkDir[type]
  script.src = link
  console.log('%c[script]:加载中...', 'color:red')
  script.onload = function () {
    console.log(
      `%c [script]: %c${name} %c加载成功`,
      'color:blue',
      'color:blue;font-weight:600;font-size: 15px',
      'color: blue'
    )
  }
  script.onerror = function () {
    console.error(
      `%c [script]: %c${name} %c无效的包名或加载失败`,
      'color:blue',
      'color:red;font-weight:600;font-size: 15px',
      'color: blue'
    )
  }
  document.head.appendChild(script)
}

function pkg(name) {
  return new Promise((resolve, reject) => {
    resolve(`https://unpkg.com/${name}`)
  })
}

function cdn(name) {
  return new Promise((resolve, reject) => {
    fetch(`https://api.cdnjs.com/libraries?search=${name}`, { referrerPolicy: 'no-referrer' })
      .then(t => t.json())
      .then(res => {
        if (res.results && res.results.length > 0) resolve(res.results[0].latest)
        else resolve(false)
      })
  })
}

function esm(name) {
  return new Promise((resolve, reject) => {
    resolve(`https://cdn.jsdelivr.net/npm/${name}`)
  })
}

function help(code) {
  switch (code) {
    case '--help':
      console.group('使用手册')
      console.group('示例')
      console.log(`$i('--help')       查看帮助`)
      console.log(`$i("--version")    查看版本`)
      console.log(`$i("--info")       查看作者信息`)
      console.log(`$i("vue")          加载包`)
      console.groupEnd('示例')
      console.group('切换源')
      console.log(`$i.pkg('vue')`)
      console.log(`$i.esm('vue')`)
      console.log(`$i.cdn('vue')`)
      console.table([
        {
          cdn: '$import.cdn(packageName)',
          pkg: '$import.pkg(packageName)',
          esm: '$import.esm(packageName)'
        },
        {
          cdn: '使用CDNJS加载数据',
          pkg: '使用UNPKG加载数据(默认)',
          esm: '使用ESM加载数据'
        }
      ])
      console.groupEnd('切换源')
      console.groupEnd('使用手册')
      return false
      break
    case '--version':
      console.log('v1.0.1')
      return false
      break
    case '--info':
      console.log('作者: sunShineGo\n更新时间: 2022-12-26')
      return false
      break

    default:
      return true
      break
  }
}
