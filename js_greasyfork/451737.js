// ==UserScript==
// @name        批量取消关注 - douyin.com
// @namespace   Violentmonkey Scripts
// @match       https://creator.douyin.com/creator-micro/data/following/following
// @require https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant       none
// @license     Jone
// @version     1.1
// @author      -
// @description 2022/9/21 10:48:08
// @downloadURL https://update.greasyfork.org/scripts/451737/%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8%20-%20douyincom.user.js
// @updateURL https://update.greasyfork.org/scripts/451737/%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8%20-%20douyincom.meta.js
// ==/UserScript==

async function cancelFollowing(user_id) {
  const ret = await Promise.resolve($.ajax({
      url: "https://creator.douyin.com/aweme/v1/creator/relation/following/cancel",
      contentType : 'application/json',
      type : 'POST',
      data: JSON.stringify({user_id: user_id})
   }))
  return ret
}

async function getAllFollowing(cursor) {
  const data = await Promise.resolve($.get(`https://creator.douyin.com/aweme/v1/creator/relation/following/list/?cursor=${cursor}&count=20`))
  var user_info_list = data.user_info_list || []
  const next_cursor = data.cursor
  if (next_cursor !== 0) {
    const next_cursor = data.cursor
    const next_list = await getAllFollowing(next_cursor)
    user_info_list.concat(next_list)
  }
  return user_info_list
}

async function doWork() {
  const list = await getAllFollowing(null)
  const total = list.length
  $("#cancelAll").text(`批量取消关注(0/${total})`)
  for (var index in list) {
    const cur_index = parseInt(index) + 1
    $("#cancelAll").text(`批量取消关注(${cur_index}/${total})`)
    const item = list[index]
    const user_id = item.user_id
    const ret = await cancelFollowing(user_id)
  }
  document.location.reload()
}

function addButton() {
  const btn = $(
    `
    <button id="cancelAll" style="background-color:#225eff" class="semi-button semi-button-primary semi-button-size-large semi-button-block" type="button" style="margin: 0px;">
      <span class="semi-button-content">批量取消关注</span>
    </button>
    `
  )
  $(".container--2z-xy").prepend(btn)
  $(document).on("click", "#cancelAll", doWork)
}

setTimeout(addButton, 2000)