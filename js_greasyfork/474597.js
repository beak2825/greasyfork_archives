// ==UserScript==
// @name         Better atcoder friend problemset
// @namespace    https://atcoder.jp
// @version      0.4
// @description  Show friend's accepted submissions.
// @author       Ftt2333
// @match        https://atcoder.jp/*
// @connect      kenkoooo.com
// @connect      atcoder.jp
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474597/Better%20atcoder%20friend%20problemset.user.js
// @updateURL https://update.greasyfork.org/scripts/474597/Better%20atcoder%20friend%20problemset.meta.js
// ==/UserScript==

var userList
var contestId, problemId

let GetColorByRating = (rating) => {
  if (rating < 400) return 'user-gray';
  if (400 <= rating && rating < 800) return 'user-brown'
  if (800 <= rating && rating < 1200) return 'user-green'
  if (1200 <= rating && rating < 1600) return 'user-cyan'
  if (1600 <= rating && rating < 2000) return 'user-blue'
  if (2000 <= rating && rating < 2400) return 'user-yellow'
  if (2400 <= rating && rating < 2800) return 'user-orange'
  if (2800 <= rating) return 'user-red'
}

var result = [], base, node, counter

let Display = () => {
  console.log(result)
  let str1 = "Solved by " + result.length.toString() + " friend" + (result.length > 1 ? "s. " : ". ")
  let str2 = ""
  for (let i = 0; i < result.length; i++) {
    str2 += `<span class = "` + result[i].color + `">` + result[i].userId + "</span>"
    if (i + 1 != result.length) str2 += ", "
  }
  let str = `<br><span style = "font-size: 16px; color: grey;">` + str1 + str2 + (counter == 0 ? "(finished)" : "") + ".</span>"
  node.innerHTML = base + str
}

let GetUserColor = async (userId) => {
  let tmp = {}, cnt = 10
  let url = "https://atcoder.jp/users/" + userId
  while (cnt >= 0 && tmp.status != 200) tmp = await fetch(url), cnt--
  tmp.text().then((data) => {
    let tmp = /<tr><th class="no-break">Rating<\/th><td><span class='user-(\w*)'>(\d*)<\/span>/
    let arr = tmp.exec(data)
    if (arr != null) result.push({userId : userId, color : GetColorByRating(parseInt(arr[2]))})
    else result.push({userId : userId, color : "user-unrated"})
    Display()
  })
}

let CheckIfAvailable = async (userId) => {
  let tmp = {}, cnt = 10
  let url = "https://atcoder.jp/contests/" + contestId + "/submissions?f.Task=" + problemId + "&f.LanguageName=&f.Status=AC&f.User=" + userId
  while (cnt >= 0 && tmp.status != 200) tmp = await fetch(url), cnt--
  tmp.text().then((data) => {
    let tmp = /<span class='label label-success' data-toggle='tooltip' data-placement='top' title="Accepted">AC<\/span>/
    let arr = tmp.exec(data)
    if (arr != null) GetUserColor(userId)
    counter--
  })
}
let GetAvailableUsers = async () => {
  counter = userList.length
  Display()
  for (let i = 0; i < userList.length; i++) await CheckIfAvailable(userList[i])
}

let Init = () => {
  let tmp1 = /atcoder.jp\/contests\/([\w-]*)\/tasks\/([\w-]*)/
  let tmp2 = tmp1.exec(location.href)
  if (tmp2 == null) return
  contestId = tmp2[1], problemId = tmp2[2]
  userList = JSON.parse(localStorage.fav)
  node = document.querySelector(`#main-div > div.container > div.row > div:nth-child\(2\) > span`)
  base = node.innerHTML
  GetAvailableUsers()
}

Init()