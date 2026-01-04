// ==UserScript==
// @name         CC98 Auto SignIn
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  CC98 自动签到
// @author       CarrotsPie
// @match        *://www.cc98.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501126/CC98%20Auto%20SignIn.user.js
// @updateURL https://update.greasyfork.org/scripts/501126/CC98%20Auto%20SignIn.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  async function signIn() {
    const url = 'https://api.cc98.org/me/signin'
    const token = localStorage.getItem('accessToken').split(' ')[1]
    const headers = {
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language':
        'zh-CN,zh-TW;q=0.9,zh;q=0.8,en;q=0.7,en-US;q=0.6,en-GB;q=0.5',
      Authorization: `Bearer ${token}`,
      Origin: 'https://www.cc98.org',
      Referer: 'https://www.cc98.org/',
      'Sec-Ch-Ua':
        '"Not/A)Brand";v="8", "Chromium";v="126", "Microsoft Edge";v="126"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
      'Content-Type': 'application/json',
    }

    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: '签到喵',
      })
    } catch (error) {
      console.error('Error:', error)
    }
    try {
       let response = await fetch(url, {
          method: 'GET',
          headers: headers,
        })
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error:', error)
      return error
    }
  }
  try {
    const id = JSON.parse(localStorage.getItem('userInfo').split('obj-')[1]).id
    console.log(id)
    // 获取当前日期（精确到天）
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0) // 清除时间部分，使其精确到天
    const currentDateString = currentDate.toISOString() // 转换为字符串格式，便于存储

    // 获取上一次缓存的日期
    const previousDateString = localStorage.getItem('previousSignInDate')

    if (!previousDateString || previousDateString != id + currentDateString) {
      // 调用 signIn 并获取结果
      signIn().then((result) => {
        if (result) {
          console.log(result)
          // 在这里使用 result 变量
          try {
            if (result.hasSignedInToday) {
              // 将当前日期缓存到 localStorage
              localStorage.setItem('previousSignInDate', id + currentDateString)
                alert(
                  `获得财富值${result.lastReward}！\n已连续签到${result.lastSignInCount}天`
                )
                console.log('今日已签到')
            }
          } catch (error) {
            console.log('未登录或已签到')
          }
        }
      })
    }
  } catch (error) {
    console.log('未登录或已签到')
  }
})()
