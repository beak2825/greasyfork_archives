// ==UserScript==
// @name         LeetCode 刷题小助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  查询LeetCode考题最近的考察频率、显示codeTop评论
// @author       Leochens
// @match        https://leetcode.cn/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @connect *
// @downloadURL https://update.greasyfork.org/scripts/444881/LeetCode%20%E5%88%B7%E9%A2%98%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/444881/LeetCode%20%E5%88%B7%E9%A2%98%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var listeners = []
var doc = document
var MutationObserver = MutationObserver || window.WebKitMutationObserver
var observer
let setTokenMenuId
let problemId
let anchor;
function observerEleReady(selector, fn) {
  // 储存选择器和回调函数
  listeners.push({
    selector: selector,
    fn: fn
  })
  if (!observer) {
    // 监听document变化
    observer = new MutationObserver(check)
    observer.observe(doc.documentElement, {
      childList: true,
      subtree: true
    })
  }
  // 检查该节点是否已经在DOM中
  check()
}
function check() {
  // 检查是否匹配已储存的节点
  for (var i = 0; i < listeners.length; i++) {
    var listener = listeners[i]
    // 检查指定节点是否有匹配
    var elements = document.querySelectorAll(listener.selector)
    for (var j = 0; j < elements.length; j++) {
      var element = elements[j]
      // 确保回调函数只会对该元素调用一次
      if (!element.ready) {
        element.ready = true
        // 对该节点调用回调函数
        listener.fn.call(element, element)
      }
    }
  }
}
function fmtDate(utcdate) {
  let dateee
  if (utcdate) {
    dateee = new Date(utcdate).toJSON()
  } else {
    dateee = new Date().toJSON()
  }
  return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ')
    .replace(/\.[\d]{3}Z/, '')
}
function insert() {

    return new Promise((resolve,reject)=>{
        observerEleReady('h4[data-cypress="QuestionTitle"]', () => {
            const title = document.querySelector('h4[data-cypress="QuestionTitle"]')
            const titleText = title.innerText
            const container = title.parentNode
            anchor = container;
            const codeTop = document.createElement('span')

            codeTop.setAttribute('id', 'codeTop')
            codeTop.setAttribute('style', 'display: inline-block;vertical-align: middle;margin-left: 20px;font-size: 12px;font-weight: 500;color: #666')

            container.insertBefore(codeTop, container.lastChild)

            // 获取codeTop数据
            GM_xmlhttpRequest({
                method: 'get',
                url: `https://codetop.cc/api/questions/?page=1&search=${encodeURI(titleText).replace('.', '')}&ordering=-frequency`,
                //    data: 'typeName=XXX&content=XXX&options=XXX',
                headers: { 'Content-Type': 'application/json' },
                onload: function(res) {
                    // code
                    if (res.status === 200) {
                        const obj = JSON.parse(res.response)
                        console.log(obj)
                        const value = obj.list[0].value
                        const time = obj.list[0].time
                        problemId = obj.list[0].id
                        let color = 'green'
                        if (value > 50) color = 'orange'
                        if (value > 100) color = 'red'
                        codeTop.innerHTML = '本题考察频率: ' +
                            `<span style="display: inline-block;font-size: 16px;font-weight: 500; color: ${color}"> ${value} </span>` + ' 最近考察时间：' + fmtDate(time)
                        resolve(1);
                    } else {
                        console.log('获取codeTop数据失败！')
                        reject(0)
                    }
                },
                onerror: function(e) {
                    console.log('获取codeTop数据失败！')
                    reject(0)
                }
    })
  })

    })

}

function setToken() {
  const token = prompt('请输入从codeTop获得的用户token')
  if(!token) return;
  GM_setValue('token', token)
  alert('设置token成功！')
  if (setTokenMenuId) {
    GM_unregisterMenuCommand(setTokenMenuId)
  }
  setTokenMenuId = GM_registerMenuCommand('已设置token,点击重新设置' + token, setToken)
}
function initMenu() {
  const token = GM_getValue('token')
  if (token) {
    setTokenMenuId = GM_registerMenuCommand('已设置token,点击重新设置' + token, setToken)
  } else {
    setTokenMenuId = GM_registerMenuCommand('暂无token，点击设置token', setToken)
  }
}
async function initFrequency() {
  const firstTab = document.querySelector("[data-key='description']>a")
  try{
      await insert()
  }catch(e){}
  firstTab.onclick = insert
}
function closeCommentList(){
    const commentList = document.getElementById('codetop-comment-list')
    if(!commentList) return console.log("未找到元素！");

    commentList.style.display = 'none';
}
function openCommentList(){
    const commentList = document.getElementById('codetop-comment-list')
    if(!commentList) return alert("未找到相关元素 请刷新后再试！");
    commentList.style.display = 'block';
}

function renderCommentList(comments){
   const ul = document.createElement('ul');
   const ulStyle = `
    position: absolute;
    display:none;
    width: 700px;
    list-style: none;
    height: 400px;
    z-index: 1;
    background-color: rgb(255, 255, 255);
    border: 1px solid rgb(221, 221, 221);
    border-radius: 4px;
    inset: 0px;
    overflow: aoto;
    margin: 100px auto;
    box-shadow: 4px 3px 5px 1px #efefef;
    padding: 20px;`
   ul.style = ulStyle;
   ul.setAttribute('id','codetop-comment-list');
   const closeBtn = document.createElement('button');
   closeBtn.innerHTML = "关闭";
   closeBtn.onclick = closeCommentList;
   closeBtn.style = `
    border: 1px solid #ddd;
    font-size: 12px;
    border-radius: 2px
    margin-left: 20px;
    background-color: #fff;
    position:absolute;
    top: 0px;
    right: 0px;
    cursor: pointer;`
   ul.append(closeBtn)
   let li;
   for(let comment of comments){
     li = document.createElement('li');
       li.style="font-size:15px;margin-bottom:10px"
     li.innerHTML = `<img crossorigin="true" style="width: 20px;   border-radius: 10px;" src="${comment.avatar}" /> <span style="color: #aaa;">${comment.username}:</span> <span  style="color: #333;">${comment.content}</span>
     <span style="font-size:12px;color:#ccc"> ${fmtDate(comment.time)}</span>
     `
     ul.append(li)
   }
    const app = document.getElementById('app')
    app.prepend(ul);
    return ul;
}
function initComments() {
  const token = GM_getValue('token')
  if (!token) {
    return console.log('未配置codeTop的token！不能获取评论')
  }
  GM_xmlhttpRequest({
    method: 'get',
    url: `https://codetop.cc/api/comments/?leetcode=${problemId}&page=1&ordering=-like_num,-time`,
    //    data: 'typeName=XXX&content=XXX&options=XXX',
    headers: { 'Content-Type': 'application/json', 'authorization': `Token ${token}` },
    onload: function(res) {
      // code
      if (res.status === 200) {
        const obj = JSON.parse(res.response)
        console.log(obj)
        const comments = obj.results;
        renderCommentList(comments);



      } else {
        console.log('获取codeTopp评论数据失败！',res)
      }
    },
    onerror: function(e) {
      console.log(e);
      console.log('获取codeTop评论数据失败！ 可能是token失效！请重新配置!')
    }
  })
  const openCommentListBtn = document.createElement("button");
  openCommentListBtn.innerHTML="查看codeTop评论"
  openCommentListBtn.onclick =openCommentList;
  openCommentListBtn.style = `
    border: 1px solid #ddd;
    font-size: 12px;
    border-radius: 2px
    margin-left: 20px;
    background-color: #fff;
    cursor: pointer;`
  if(!anchor)return console.log("未找到anchor挂载点")

  anchor.insertBefore(openCommentListBtn, anchor.lastChild)
}

async function launch(){
   // 初始化考频显示
  await initFrequency()
  // 初始化菜单
  initMenu()
  // 初始化评论
  initComments()
}
window.onload =async function() {
  'use strict'
  await launch();
}
