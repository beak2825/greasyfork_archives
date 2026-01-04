// ==UserScript==
// @name         beian-killer.js
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  ICP备案网自动域名爬取
// @author       wuuconix
// @match        https://beian.miit.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=beian.miit.gov.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453941/beian-killerjs.user.js
// @updateURL https://update.greasyfork.org/scripts/453941/beian-killerjs.meta.js
// ==/UserScript==

/* 输入睡眠的秒数 */
const sleep = (time) => new Promise((resolve) => {
  setTimeout(resolve, time * 1000)
})

const domains = new Set()
const start = async () => {
  const num = document.querySelector("#app > div > section > div > div > div.listcont > div > div.el-pagination.is-background > span.el-pagination__total").innerText.split(" ")[1]
  console.log(`资产数目: ${num}`)
  if (num > 10) {
    console.log("数目大于10 将切换至40条/页以提升爬取效率")
    const switchLi = document.querySelector("#app > div > section > div > div > div.listcont > div > div.el-pagination.is-background > span.el-pagination__sizes > div > div.el-input.el-input--mini.el-input--suffix")
    switchLi.click()
    await sleep(1)
    const selectedLi = document.querySelector("body > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li.el-select-dropdown__item.selected")
    const fortyLi = document.querySelector("body > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li.el-select-dropdown__item:last-child")
    if (selectedLi != fortyLi) {
      fortyLi.click()
      console.log("自动切换到40条/页")
      await sleep(5)
    } else {
      console.log("已经处于40条/页")
    }
    switchLi.click()
  }
  const nextBtn = document.querySelector("#app > div > section > div > div > div.listcont > div > div.el-pagination.is-background > button.btn-next")
  const pageLi = document.querySelector("#app > div > section > div > div > div.listcont > div > div.el-pagination.is-background > ul > li:last-child")
  const pages = Number(pageLi.textContent) //页数
  console.log(`一共有${pages}页`)
  for (let i = 0; i < pages; i++) {
    console.log(`现在是第${i + 1}页`)
    const detailBtns = document.querySelectorAll("#app > div > section > div > div > div.listcont > div > div.el-table.el-table--fit.el-table--border.el-table--enable-row-hover.el-table--enable-row-transition > div.el-table__body-wrapper.is-scrolling-none > table > tbody > tr > td.el-table_1_column_7.is-center > div > button")
    for (let j = 0; j < detailBtns.length; j++) {
      const btn = detailBtns[j]
      btn.click()
      await sleep(1)
      const domainDiv = document.querySelector("#app > div > section > div > div > div:nth-child(2) > div:nth-child(2) > ul > li:nth-child(1) > div:nth-child(4)")
      if (!domainDiv) { //2秒中还没有加载出来肯定是遇到了 网站恶意检测，故重新进入此页的详情页面
        console.log("检测到网站的恶意检测")
        j--
        continue
      }
      const domain = domainDiv.textContent
      domains.add(domain) //set自动去重
      console.log(`${i * 40 + j + 1}: ${domain}`)
    }
    if (i == pages - 1) {
      console.log(`爬虫完毕! 总共爬取 ${num}个域名，去重和得到 ${domains.size} 个有效域名`)
      const title = document.querySelector("#app > div > header > div.search > div > div > input").value
      const result = `# ${title}\n\n${[...domains].join("\n")}`
      console.log(result)
      await navigator.clipboard.writeText(result)
      console.log("成功复制进入剪切板")
      document.querySelector("#app > div > header > div.search > div > div > input").value = `成功复制进入剪切板 ${domains.size} / ${num}`
      domains.clear()
    } else {
      console.log([...domains].join("\n"))
      nextBtn.click()
      await sleep(5) //到下一页等待5秒中
    }
  }
  const tentyLi = document.querySelector("body > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li.el-select-dropdown__item")
  tentyLi.click()
  console.log("切换回到10条/页 防止之后资产加载不全")
}

window.start = start
const observer = new MutationObserver(() => {
  let stand = document.querySelector("#app > div > div.float-box.float-boxA")
  if (stand) {
    console.log(stand)
    stand.style.width = "100px"
    stand.style.height = "100px"
    stand.style.setProperty("background-color", "red", "important")
    stand.style.setProperty("color", "white", "important")
    stand.innerHTML = ""
    stand.textContent = "点击开始"
    stand.onclick = (e) => {
      e.preventDefault()
      start()
    }
    observer.disconnect()
  }
});

observer.observe(document.body, { childList: true })