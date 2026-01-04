// ==UserScript==
// @name        杭电助手成绩显示优化
// @namespace   Violentmonkey Scripts
// @include     https://app.hduhelp.com/*
// @grant       none
// @version     1.09
// @author      Rainbow Yang
// @description 为每门分数计算等效绩点
// @downloadURL https://update.greasyfork.org/scripts/406859/%E6%9D%AD%E7%94%B5%E5%8A%A9%E6%89%8B%E6%88%90%E7%BB%A9%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/406859/%E6%9D%AD%E7%94%B5%E5%8A%A9%E6%89%8B%E6%88%90%E7%BB%A9%E6%98%BE%E7%A4%BA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

const scoreMap = new Map([
  ['优秀', '5.0'],
  ['良好', '4.0'],
  ['中等', '3.0'],
  ['合格', '3.0'],
  ['及格', '2.0'],
  ['不及格', '0.0'],
  ['不合格', '0.0'],
])

const parseScore = (scoreText) => {
  if (isNaN(scoreText)) {
    return scoreMap.get(scoreText)
  } else {
    let score = parseInt(scoreText)
    let point = (score - 45) / 10
    point = point > 5 ? 5 : point
    return point.toFixed(1)
  }
}

function writeGradePoint() {

  // 来自首页
  [...document.getElementsByClassName("right")]
  .filter(it => !it.innerText.includes("=") &&
      it.innerText.includes('最后总分'))
    .forEach(it => {
      let scoreText = it.innerText.split(" ")[1]
      it.innerText += `（=${parseScore(scoreText)}）`
    });

  [...document.getElementsByClassName('final')]
  .filter(it => !it.innerText.includes("="))
    .forEach(it => {
      let scoreText = it.innerHTML.split('：')[1]
      it.innerHTML += `（=${parseScore(scoreText)}）`
    })
}



function main() {
  writeGradePoint()
  setInterval(writeGradePoint, 1000)
}

main()