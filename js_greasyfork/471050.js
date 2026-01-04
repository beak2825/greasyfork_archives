// ==UserScript==
// @name         少数派屏蔽用户
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  请自行编辑屏蔽列表 blockedUsers，内容为用户主页地址，比如 https://sspai.com/u/vistaing/updates 中的 vistaing
// @author       duckmouse
// @match        https://sspai.com/
// @match        https://sspai.com/post/*
// @match        https://sspai.com/t/*
// @match        https://sspai.com/community
// @match        https://sspai.com/community/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sspai.com
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/471050/%E5%B0%91%E6%95%B0%E6%B4%BE%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/471050/%E5%B0%91%E6%95%B0%E6%B4%BE%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  // TODO: article tag, emoji reaction

  const blockedUsers=new Set(GM_getValue('list',['tgwbddu0','5ayuq8jn','feverlife','o9azstw9','9hde6zq2','1ulv3hnm','4ea7t2zo','kiens',]))
  console.log('blocking users:',[...blockedUsers])

  GM_registerMenuCommand('配置屏蔽用户',()=>{
    const oldList=GM_getValue('list',[...blockedUsers])
    const input=prompt('请输入用户的主页地址，以逗号分隔',oldList.join(','))
    const list=input.split(',').map(s=>s.split('，')).flat()
    GM_setValue('list',list)
    alert('刷新后生效')
  })


  await waitFor(mounted)

  const vue=unsafeWindow.$vue

  filter()
  vue.$router.afterEach(()=>{
    setTimeout(filter,1000)
  })

  function filter(){
    console.log('开始过滤')
    const routes=vue.$router.getRoutes()
    const homePage=routes.find(r=>r.name==='home')?.instances.default
    const postPage=routes.find(r=>r.name==='article')?.instances.default
    const communityPage=routes.find(r=>r.name==='communityTopic')?.instances.default
    const communityHome=routes.find(r=>r.name==='communityHome')?.instances.default
    const community=routes.filter(r=>r.path.startsWith('/community')).find(r=>r.name===$vue.$route.name)?.instances.default

    // 首页文章列表
    if(homePage){
      homePage.$watch('articleListData', val=>{
        const newVal=val.filter(
          article=>{
            const shouldHide=blockedUsers.has(article.author?.slug)
            if(shouldHide)console.log(`blocked: ${article.title} by ${article.author.nickname}`)
            return !shouldHide
          }
        )
        if(newVal.length!==val.length) homePage.articleListData=newVal
      }, {immediate:true})
    }

    // 文章页
    if(postPage){
      // 文章评论区
      const commentsComp=postPage.$children.map(c=>c.$children).flat(Infinity).find(c=>c.$options.name==='comment')
      commentsComp.$watch('comments', val=>{
        const newVal=val.filter(
          comment=>{
            const newReplies=comment.reply?.filter(reply=>{
              const shouldHide=blockedUsers.has(reply.user.slug)
              if(shouldHide)console.log(`blocked: ${reply.comment} by ${reply.user.nickname}`)
              return !shouldHide
            })
            if(newReplies.length!==comment.reply?.length)comment.reply=newReplies

            const shouldHide=blockedUsers.has(comment.user?.slug)
            if(shouldHide)console.log(`blocked: ${comment.comment} by ${comment.user.nickname}`)
            return !shouldHide
          }
        )
        if(newVal.length!==val.length)commentsComp.comments=newVal
      }, {immediate:true})

      // 文章作者 页面标红
      if(blockedUsers.has(postPage.articleInfo.author.slug))mask()
    }

    // 社区主题内容
    if(communityPage){
      // 主题作者 页面标红
      if(blockedUsers.has(communityPage.userInfo.slug))mask()

      // 评论
      communityPage.$watch('comments', val=>{
        const newVal=val.filter(
          comment=>{
            const newReplies=comment.reply?.filter(reply=>{
              const shouldHide=blockedUsers.has(reply.author.slug)
              if(shouldHide)console.log(`blocked: ${reply.comment} by ${reply.author.nickname}`)
              return !shouldHide
            })
            if(newReplies.length!==comment.reply?.length)comment.reply=newReplies

            const shouldHide=blockedUsers.has(comment.author?.slug)
            if(shouldHide)console.log(`blocked: ${comment.comment} by ${comment.author.nickname}`)
            return !shouldHide
          }
        )
        if(newVal.length!==val.length)communityPage.comments=newVal
      }, {immediate:true})
    }

    // 社区主题列表
    if(community){
      community.$watch('collection', val=>{
        const newVal=val.filter(
          topic=>{
            const shouldHide=blockedUsers.has(topic.author?.slug)
            if(shouldHide)console.log(`blocked: ${topic.title} by ${topic.author.nickname}`)
            return !shouldHide
          }
        )
        if(newVal.length!==val.length)
          community.$store.commit('communityChannel/setCollection',{collection:newVal})
      }, {immediate:true})
    }
  }

  function mounted(){
    return unsafeWindow.$vue?._isMounted
  }

  function waitFor(check){
    return new Promise(ok=>{
      const id=setInterval(()=>{
        if(check()){
          clearInterval(id)
          ok()
        }
      },1000); // 篡改猴自带的编辑器在括号后看到分号才能正常缩进下一行
    })
  }

  function mask(){
    const div=document.createElement('div')
    div.style.width='100vw'
    div.style.height='100vh'
    div.style.position='fixed'
    div.style.top=0
    div.style.left=0
    div.style.zIndex=99 // 刚好不遮盖导航栏
    div.style.backgroundColor='darkred'

    document.body.appendChild(div)
  }
})();