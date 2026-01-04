// ==UserScript==
// @name         BIT-Programming-Detect
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  通过提交C语言程序，逐字符确定测试用例。为符合编程人员的习惯，字符默认从第0个开始。文本框中输入Enter键可以直接开始探测。在结束文本框输入非数字时，会持续探测。探测到所有的测试用例都OF时探测会结束。支持的测试用例字符：ASCII -1, 8-13, 32-126。
// @license      GPL-3.0-or-later
// @supportURL   https://github.com/YDX-2147483647/BIT-enhanced/issues
// @author       CJJ (https://github.com/CJJ-amateur-programmer/Detect_BIT_OJ_getchar)
// @author       JWJ, python “getchar” version
// @author       Y.D.X., original python version
// @match        https://lexue.bit.edu.cn/mod/programming/*.php?id=*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/488587/BIT-Programming-Detect.user.js
// @updateURL https://update.greasyfork.org/scripts/488587/BIT-Programming-Detect.meta.js
// ==/UserScript==

(function () {
  'use strict'
  /* global GM_registerMenuCommand */

  /** 提示“正在探测”的顶部提示栏 */
  const reminder = document.createElement('b')
  /** 弹出窗口的灰色背景 */
  const popup_cover = document.createElement('div')
  /** 弹出窗口 */
  const popup = document.createElement('div')
  /** 鼠标点击到弹窗上边沿时的X位置 */
  let mousestartX
  /** 鼠标点击到弹窗上边沿时的Y位置 */
  let mousestartY
  /** 提交的表单数据，包括页面id、代码内容等 */
  let fm
  /** 弹窗跟随鼠标移动 */
  const movePopup = (e) => {
    popup.style.left = (e.clientX - mousestartX) + 'px'
    popup.style.top = (e.clientY - mousestartY) + 'px'
  }
  /** 停止弹窗随鼠标移动 */
  const stopMove = () => {
    document.removeEventListener('mousemove', movePopup)
    document.removeEventListener('mouseup', stopMove)
  }
  /** 防止在探测时页面刷新 */
  const preventClosing = (e) => {
    e.preventDefault()
  }
  /** 关闭弹窗 */
  function closePopup () {
    document.body.removeChild(popup_cover)
    document.body.removeChild(popup)
  }
  /** 显示消息，然后隐藏顶部提示 */
  async function hideReminder (msg) {
    if (msg) {
      reminder.innerHTML = msg
    }
    await new Promise(resolve => setTimeout(resolve, 2000))
    reminder.style.opacity = '0'
    await new Promise(resolve => setTimeout(resolve, 300))
    document.body.removeChild(reminder)
    window.removeEventListener('beforeunload', preventClosing)
  }
  function downloadTXT (content, filename) {
    const downloadLink = document.createElement('a')
    // 创建txt
    downloadLink.href = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
    // 命名txt
    downloadLink.download = filename
    downloadLink.click()
  }
  /**
   * 将测试输入打印成人类易读的形式
   * @param arguments_ 记录了所有测试输入的词典，格式为 {<编号>: [<测试输入每一位的ASCII>]}
   */
  function print_arguments (arguments_) {
    let result = ' No.  |测试输入\n'
    for (const key in arguments_) {
      result += ('   ' + key).slice(-4) + '  |' + String.fromCharCode(...arguments_[key])
        .replaceAll('\b', '\\b')
        .replaceAll('\t', '\\t')
        .replaceAll('\n', '\\n')
        .replaceAll('\v', '\\v')
        .replaceAll('\f', '\\f')
        .replaceAll('\r', '\\r') +
        '\n'
    }
    return result
  }
  function show_results (results) {
    popup_cover.style = 'width:100%;height:100%;background-color:rgba(0,0,0,0.6);position:fixed;inset:0px;z-index:2000'
    // 双击弹窗灰色背景时关闭它
    popup_cover.setAttribute('ondblclick', 'this.style.display="none";')

    popup.style = 'background-color:white;color:black;box-shadow:rgb(153,153,153) 0px 0px 2px;transform:translate(-50%,-50%);position:fixed;border:3px solid rgba(0,0,0,0.6);font-size:16px;overflow:hidden;z-index:3000;left:50%;top:50%;width:40%;text-align:center;'
    popup.innerHTML = `<style>
#popup_title{
    width:100%;
    height:40px;
    line-height:40px;
    box-sizing:border-box;
    background-color:rgb(255,77,64);
    color:rgb(255,255,255);
    font-weight:700;
    font-size:20px;
    cursor:move;
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}
#close_popup{
    text-decoration:none;
    color:rgb(255,255,255);
    position:absolute;
    right:10px;
    top:0px;
    font-size:25px;
    display:inline-block;
    cursor:pointer;
}
</style><div id="popup_title">探测结果
<div id="close_popup">×</div>
</div>
<pre style="overflow:auto;text-align:left;max-height:80vh;">${results}</pre></div>`
    popup.querySelector('#popup_title').addEventListener('mousedown', e => {
      // 记录鼠标在弹出窗口的相对位置
      mousestartX = e.clientX - parseInt(window.getComputedStyle(popup).getPropertyValue('left'))
      mousestartY = e.clientY - parseInt(window.getComputedStyle(popup).getPropertyValue('top'))
      // 鼠标移动时移动弹窗
      document.addEventListener('mousemove', movePopup)
      // 鼠标松开时结束移动
      document.addEventListener('mouseup', stopMove)
    })
    // 点击关闭按钮，关闭窗口
    popup.querySelector('#close_popup').onclick = () => closePopup()

    document.body.append(popup_cover)
    document.body.append(popup)
  }
  /**
   * 探测保密测试用例
   * @param start 从第几个字符开始探测。如果不是数字，比如文本框留空，则当成0
   * @param end 探测到第几个字符为止。如果不是数字，比如文本框留空，则不断探测，直到全部都OF
   */
  async function detect (start, end) {
    start = start || 0 // 当start不是数字时重新赋值为0
    if (start > end || start < 0 || end < 0) { // 当end不是数字时表达式也是false
      alert('输入无效！')
      return
    }
    closePopup()
    window.addEventListener('beforeunload', preventClosing)// 防止探测时页面刷新
    document.body.append(reminder)
    reminder.style.opacity = '1'
    fm = await new Promise((resolve, reject) => { // 等待从submit.php获取表单数据
      const submit_xhr = new XMLHttpRequest()
      submit_xhr.open('GET', document.querySelector("[title='提交']").href, true)
      submit_xhr.onreadystatechange = async function () {
        if (submit_xhr.readyState === 4) { // 请求完成
          if (submit_xhr.status === 200) { // 请求正常，并且还能提交
            try {
              resolve(new FormData(new DOMParser().parseFromString(submit_xhr.responseText, 'text/html').querySelector('form[action="https://lexue.bit.edu.cn/mod/programming/submit.php"]')))
            } catch (error) { // 迟交的程序会找不到表单数据
              hideReminder('时间已到，您不能再提交程序了！')
              reject(Error('FormData Error:' + error.message))
            }
          } else {
            hideReminder('网络错误！')
            reject(Error('Network Error'))
          }
        }
      }
      submit_xhr.send()
    })
    /**
     * ```
     * arguments_ = {
     *   '3': [65, 12],
     *   '4': [5, 7, 534, 1, 543, 3, 2, 4, 6, 12, 3, 45, 3, 2, 13, 22, 1, 33, 56],
     *   '5': [4, 5, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 2, 3, 4, 5, 1, 3, 4]
     * }
     * ```
     * 变量arguments_将会变成类似的格式，冒号前面的代表题号，后面的数组代表每一位字符的ASCII数值。
     */
    const arguments_ = {}
    let not_all_OF = true
    let i = start
    for (; (isNaN(end) || i <= end) && not_all_OF; i++) {
      reminder.innerHTML = `正在探测第${i}个字符<button style="float:right;" onclick="this.parentNode.innerHTML='正在停止'">停止</button>`
      // 以下生成C语言代码：
      // delay函数用于拖延时间。程序的正常输入输出耗时误差只出现在运行时间的最后一位，因此最后一位舍弃，只拖延前两位的时间；
      // ASCII -1意味着OF，返回1/0报“FPE”来读取；
      // ASCII 32-126能够正常显示，统一减去32以显示在耗时的前两位上，对应0-94；
      // ASCII 8-13是特殊符号\b\t\n\v\f\r，保险起见也放进来，对应95-100，其中100一般会报“TLE”；如果无时间限制则会显示“1.001”左右的数字，同样可以读取。
      // 这样，常用的字符能够全部表示在运行结果页面上，类似于加密。
      fm.set('code', '#include<stdio.h>\n#include<time.h>\nvoid delay(int seconds){clock_t start = clock();clock_t lay=(clock_t)seconds*CLOCKS_PER_SEC/1000;while((clock()-start)<lay);}int main(){int x;long long i;for(i=0;i<' +
                   i + ';i++)getchar();x=getchar()-32;if(x==-33)return 1/0;else if(x<-18&&x>-25)x+=119;delay(x*10);return 0;}')
      const xhr = new XMLHttpRequest()
      xhr.open('POST', 'https://lexue.bit.edu.cn/mod/programming/submit.php', true)
      xhr.send(fm)
      let result = await new Promise(resolve => {
        // 不断查看运行结果页面，直到“程序处理完毕”
        const int = setInterval(() => {
          const x = new XMLHttpRequest()
          x.open('GET', 'https://lexue.bit.edu.cn/mod/programming/result.php?id=' + fm.get('id'), true)
          x.onreadystatechange = function () {
            if (x.readyState === 4) {
              if (x.status === 200) {
                if (x.responseText.match('当前状态：程序已处理完毕。')) {
                  clearInterval(int)
                  return resolve(x.responseText)
                } else if (!x.responseText.match('当前状态：程序已提交，正等待编译。')) {
                  clearInterval(int)
                  reminder.innerHTML = '编译错误！'
                  return resolve(false)
                }
              } else {
                clearInterval(int)
                reminder.innerHTML = '网络错误！'
                return resolve(false)
              }
            }
          }
          x.send()
        },
        // 1000意味着每1秒查看一次运行结果页面
        1000)
      })
      if (!result) { // 出错
        const partial_content = document.querySelector('title').innerText + ' 保密测试用例(字符：' + start + '~' + (i - 1) + ')\n探测于' + new Date().toLocaleString() + '\n' + print_arguments(arguments_)// 写入txt的探测内容
        downloadTXT(partial_content, document.querySelector('title').innerText + ' 保密测试用例(字符：' + start + '~' + (i - 1) + ').txt')
        hideReminder()
        show_results(partial_content)
        return
      }
      const rows = new DOMParser().parseFromString(result, 'text/html').querySelectorAll('#test-result-detail tbody > tr'); let // 结果表格的所有行
        OF_count = 0 // OF的样例个数
      for (let r = 0; r < rows.length; r++) {
        const row_number = rows[r].querySelector("[class~='c0']").innerText; const // 测试用例编号
          error = rows[r].querySelector("[class~='c12']").innerText.split(':')[0]// 错误类型
        if (error === 'FPE') { // 1/0的情况，意味着已经OF了
          ++OF_count
          continue
        }
        if (rows[r].querySelector("[class~='c4']").innerText === '保密') {
          if (i === start) { // i是start，说明是第一次循环，需要将json初始化为空数组[]。
            arguments_[row_number] = []
          }
          /* 接下来对结果进行解密 */
          if (error === 'TLE') {
            // 对应的是ASCII 13 的\r
            arguments_[row_number][i] = 13
            continue
          }
          result = Math.floor(parseFloat(rows[r].querySelector("[class~='c8']").innerText) * 100 + 32)
          if (result > 126) {
            // ASCII 8-12
            result -= 119
          }
          arguments_[row_number][i] = result
        }
      }
      if (reminder.innerHTML === '正在停止') {
        break
      }
      if (OF_count === rows.length) { // 全部都OF了
        not_all_OF = false
      }
    }
    hideReminder('已探明全部参数。')
    let content
    if (not_all_OF) {
      content = document.querySelector('title').innerText + ' 保密测试用例(字符：' + start + '~' + i + ')\n探测于' + new Date().toLocaleString() + '\n' + print_arguments(arguments_)// 写入txt的探测内容
      downloadTXT(content, document.querySelector('title').innerText + ' 保密测试用例(字符：' + start + '~' + i + ').txt')
    } else {
      content = document.querySelector('title').innerText + ' 保密测试用例(字符：' + start + '~end)\n探测于' + new Date().toLocaleString() + '\n' + print_arguments(arguments_)// 写入txt的探测内容
      downloadTXT(content, document.querySelector('title').innerText + ' 保密测试用例(字符：' + start + '~end).txt')
    }
    show_results(content)
  }

  GM_registerMenuCommand('获取保密测试用例', function () { // 脚本菜单
    reminder.style = 'width:100%;color:white;position:fixed;left:0;top:0;text-align:center;opacity:100%;background-color:rgb(255,127,127);font-size:2vh;line-height:150%;opacity:0;line-height:4vh;transition:opacity 0.3s;z-index:4000;'
    reminder.innerHTML = '准备开始探测'
    popup_cover.style = 'width:100%;height:100%;background-color:rgba(0,0,0,0.6);position:fixed;inset:0px;z-index:2000'
    popup_cover.setAttribute('ondblclick', 'this.style.display="none";')// 双击弹窗灰色背景时关闭它
    popup.style = 'background-color:white;color:black;box-shadow:rgb(153,153,153) 0px 0px 2px;transform:translate(-50%,-50%);position:fixed;border:3px solid rgba(0,0,0,0.6);font-size:16px;overflow:hidden;z-index:3000;left:50%;top:50%;width:40%;text-align:center;'
    popup.innerHTML = `<style>
#popup_title{
    width:100%;
    height:40px;
    line-height:40px;
    box-sizing:border-box;
    background-color:rgb(255,77,64);
    color:rgb(255,255,255);
    font-weight:700;
    font-size:20px;
    cursor:move;
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}
#close_popup{
    text-decoration:none;
    color:rgb(255,255,255);
    position:absolute;
    right:10px;
    top:0px;
    font-size:25px;
    display:inline-block;
    cursor:pointer;
}
</style><div id="popup_title">编辑测试用例格式
<div id="close_popup">×</div>
</div>
<div style="line-height:150%;"><br>从第<input type="number" id="char_start" style="width:20%;" value="0" placeholder="0"></input>个字符探测到第<input type="number" id="char_end" style="width:20%;"></input>个字符<br>
</div><button id="start_detect" style="margin:5% 5% 5% 5%;">开始探测</button></div>`
    popup.querySelector('#popup_title').addEventListener('mousedown', e => {
      // 记录鼠标在弹出窗口的相对位置
      mousestartX = e.clientX - parseInt(window.getComputedStyle(popup).getPropertyValue('left'))
      mousestartY = e.clientY - parseInt(window.getComputedStyle(popup).getPropertyValue('top'))
      // 鼠标移动时移动弹窗
      document.addEventListener('mousemove', movePopup)
      // 鼠标松开时结束移动
      document.addEventListener('mouseup', stopMove)
    })
    popup.querySelector('#close_popup').onclick = () => closePopup()// 点击关闭按钮，关闭窗口
    popup.querySelector('#start_detect').onclick = () => detect(parseInt(popup.querySelector('#char_start').value), parseInt(popup.querySelector('#char_end').value))
    document.body.append(popup_cover)
    document.body.append(popup)
    popup.querySelector('#char_end').focus()
    popup.querySelector('#char_start').addEventListener('keydown', function (e) {
      if (e.keyCode === 13) { // 按下Enter键
        detect(parseInt(popup.querySelector('#char_start').value), parseInt(popup.querySelector('#char_end').value))
      }
    })
    popup.querySelector('#char_end').addEventListener('keydown', function (e) {
      if (e.keyCode === 13) { // 按下Enter键
        detect(parseInt(popup.querySelector('#char_start').value), parseInt(popup.querySelector('#char_end').value))
      }
    })
  })
})()
