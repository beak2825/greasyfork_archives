// ==UserScript==
// @name         acfun评论下载
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  单击左下角下载按钮下载为JSON文件，手动导入到Excel进行各种操作。
// @author       泥壕
// @match        https://www.acfun.cn/v/*
// @match        https://www.acfun.cn/a/*
// @grant        none
// @license      GPL-3.0 license
// @downloadURL https://update.greasyfork.org/scripts/458943/acfun%E8%AF%84%E8%AE%BA%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/458943/acfun%E8%AF%84%E8%AE%BA%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {

  // 你的UID
  const yourUid = 620132
  // 你回复的关键词
  const commentKey = '有效参与'
  const sourceId = location.pathname.split('/ac')[1]

  // 页面按钮
  const button = document.createElement('button')
  button.style.left = '0'
  button.style.bottom = '100px'
  button.style.position = 'fixed'
  button.style.padding = '12px'
  button.innerText = '下载评论'
  document.body.append(button)
  button.setAttribute('id', 'downloadCommit')
  button.addEventListener('click', e => {
    getComment()
  })

  /**
   * 根据页码获取主评论
   * @param {Number} page 页码
   */
  async function fetchComment (page = 1) {
    return await fetch(`https://www.acfun.cn/rest/pc-direct/comment/list?sourceId=${sourceId}&sourceType=3&page=${page}&pivotCommentId=0&newPivotCommentId=&t=${new Date().getTime()}&supportZtEmot=true`)
      .then(res => res.json())
  }

  /**
   * 根据页码获取楼中楼评论
   * @param {Number} page 页码
   */
  async function fetchSubComment (rootCommentId, page = 1) {
    return await fetch(`https://www.acfun.cn/rest/pc-direct/comment/sublist?sourceId=${sourceId}&sourceType=3&rootCommentId=${rootCommentId}&page=${page}&t=${new Date().getTime()}&supportZtEmot=true`)
      .then(res => res.json())
  }

  /**
   * 处理主要评论楼层
   * @param {Number} page 页码
   */
  function getComment (page = 1, list = []) {
    // console.log('getComment', page, list);
    button.setAttribute('disabled', 'disabled')
    button.innerText = `正在下载第${page}页`
    fetchComment(page)
      .then(res => {
        res.rootComments.forEach(async element => {
          let subComment = res.subCommentsMap[element.commentId]
          let subCommentList = []
          let checked = false
          if (subComment !== undefined) {
            // 评论包含楼中楼
            if (subComment.pcursor === 'no_more') {
              // 无更多分页
              subCommentList = subComment.subComments
            } else {
              subCommentList = await getsubComment(element.commentId)
            }
            // console.log('subComment', subCommentList);
            const target = subCommentList.find(e => e.userId === yourUid && e.content.includes(commentKey))
            checked = target !== undefined
          }
          list.push({
            commentId: element.commentId,
            userId: element.userId,
            userName: element.userName,
            floor: element.floor,
            timestamp: getDateTime(element.timestamp),
            content: element.content,
            checked
          })
        });

        if (page < res.totalPage) {
          getComment(page + 1, list)
        } else {
          downloadFile(list)
        }
      })
  }

  /**
   * 格式化日期
   * @param {Number} timestamp 时间戳
   * @returns 高可读性的日期文本
   */
  function getDateTime (timestamp) {
    const date = new Date(timestamp)
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }

  /**
   * 查询某一楼层的所有楼中楼评论
   * @param {Number} rootCommentId 楼中楼主楼ID
   * @param {Number} page 页码
   */
  function getsubComment (rootCommentId, page = 1, list = []) {
    // console.log('getsubComment', page, list);
    return fetchSubComment(rootCommentId)
      .then(async res => {
        list = list.concat(res.subComments)
        // console.log(list);
        if (page < res.totalPage) {
          return await getsubComment(rootCommentId, page + 1, list)
        } else {
          return list
        }
      })
  }

  // 下载JSON文件
  function downloadFile (list) {
    // console.log('downloadFile');
    button.removeAttribute('disabled')
    button.innerText = `下载评论`
    const blob = new Blob([JSON.stringify(list, undefined, 4)], { type: 'text/json' })
    const a = document.createElement('a')
    a.download = `ac${sourceId}.json`
    a.href = window.URL.createObjectURL(blob)
    a.click()
    setTimeout(() => {
      window.URL.revokeObjectURL(blob)
      a.remove()
    }, 0)
  }

})();