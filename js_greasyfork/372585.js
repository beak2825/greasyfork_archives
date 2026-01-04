// ==UserScript==
// @name        Mangadex Autocomplete
// @description Autocompletes @mentions and :titles. Maintains a small history of user posts and manga you recently viewed and searches that for matches. Example image shown in additional info
// @namespace   https://github.com/Christopher-McGinnis
// @author      Christopher McGinnis
// @license     MIT
// @icon        https://mangadex.org/favicon-96x96.png
// @version  0.0.13
// @grant    unsafeWindow
// @grant    GM.getValue
// @grant    GM.setValue
// @grant    GM_getValue
// @grant    GM_setValue
// @require  https://gitcdn.xyz/repo/ichord/Caret.js/341fb20b6126220192b2cd226836cd5d614b3e09/dist/jquery.caret.js
// @require  https://gitcdn.xyz/repo/ichord/At.js/1b7a52011ec2571f73385d0c0d81a61003142050/dist/js/jquery.atwho.js
// @require  https://gitcdn.xyz/repo/Christopher-McGinnis/Mangadex-Userscripts/a480c30b64fba63fad4e161cdae01e093bce1e4c/common.js
// @require  https://gitcdn.xyz/repo/Christopher-McGinnis/Mangadex-Userscripts/21ec54406809722c425c39a0f5b6aad59fb3d88d/uncommon.js
// @require  https://gitcdn.xyz/repo/Christopher-McGinnis/Mangadex-Userscripts/0d46bb0b3fa43f11ea904945e7baef7c6e2a6a5b/settings-ui.js
// @match    https://mangadex.org/*
// @downloadURL https://update.greasyfork.org/scripts/372585/Mangadex%20Autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/372585/Mangadex%20Autocomplete.meta.js
// ==/UserScript==
// FIXME: Move away from dead atwho. Considing https://github.com/zurb/tribute
/* global XPath ,XPath2 ,getUserValues ,setUserValue ,dbg ,$ */
/* global SettingsUI ,SettingsUIValidationError */

'use strict'

const MANGADEX_BASE_URI = 'https://mangadex.org'
const xp = new XPath()
/* *************************************
 * Functions That ought to go in a library
 */
function insertStylesheet(cssText) {
  // const cssId = `css_${cssText.toString().replace(/\W/g ,'_')}`
  const style = document.createElement('style')
  style.type = 'text/css'
  if (style.styleSheet) {
    // This is required for IE8 and below.
    style.styleSheet.cssText = cssText
  }
  else {
    style.appendChild(document.createTextNode(cssText))
  }
  document.head.appendChild(style)
  return style.sheet
}
// For using AtWho's CSS. Disabled since it is difficault to make it use mangadex's active theme
function addCssLink(css_url) {
  const cssId = `css_${css_url.toString().replace(/\W/g ,'_')}`
  if (!document.getElementById(cssId)) {
    const link = document.createElement('link')
    link.id = cssId
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = css_url
    // link.media = 'all';
    document.head.appendChild(link)
    return link.sheet
  }
}
function insertIntoStylesheet({ stylesheet ,selector ,css_text }) {
  if (stylesheet.insertRule) {
    css_text = `${selector} {${css_text}}`
    stylesheet.insertRule(css_text ,stylesheet.cssRules.length)
  }
  else if (stylesheet.addRule) {
    stylesheet.addRule(selector ,css_text)
  }
}
function findCSS_Rules({ classID ,exactProperties = [] ,matchProperties = [] ,ignoredStylesheets = [] }) {
  let resultRule = {}
  let resultCssText = ''
  let exactCssText = ''
  let matchCssText = ''
  let result_stylesheet
  for (let i = 0; i < document.styleSheets.length; i++) {
    // Object.keys(document.styleSheets).forEach((i) => {
    try {
      const stylesheet = document.styleSheets[i]
      if (ignoredStylesheets.indexOf(stylesheet) >= 0) continue
      const style_rules = stylesheet.cssRules ? stylesheet.cssRules : stylesheet.rules
      if (style_rules) {
        result_stylesheet = stylesheet
        // for (let r = 0; r < style_rules.length; r++) {
        Object.keys(style_rules).forEach((r) => {
          if (style_rules[r].selectorText && style_rules[r].selectorText === classID) {
            resultRule = style_rules[r]
            Object.values(style_rules[r].style).forEach((key) => {
              const v = style_rules[r].style[key]
              resultCssText += `${key}: ${v}; `
              if (exactProperties.indexOf(key) >= 0) {
                exactCssText += `${key}: ${v}; `
              }
              matchProperties.forEach((reg) => {
                if (key.startsWith(reg)) matchCssText += `${key}: ${v}; `
              })
            })
            // return { stylesheet, rule: style_rules[r] }
          }
        })
      }
    }
    catch (e) {
      // Rethrow exception if it's not a SecurityError. Note that SecurityError
      // exception is specific to Firefox.
      if (e.name !== 'SecurityError') throw e
      // continue // on as normal
    }
    // })
  }
  // let css_text = Object.enresultRule.reduce( (accum='',[k,v]) => { accum+=v  } )
  return {
    stylesheet: result_stylesheet ,rule: resultRule ,matchCssText ,exactCssText ,resultCssText
  }
}
function duplicate_cssRule({ origSelector ,newSelector ,exactProperties ,matchProperties ,ignoredStylesheets ,targetStylesheet: insertInto }) {
  // if(findCSS_Rule(new_selector)) return true;  // Must have already done this one
  const { stylesheet: origStylesheet ,rule ,matchCssText ,exactCssText ,resultCssText } = findCSS_Rules({
    classID: origSelector ,exactProperties ,matchProperties ,ignoredStylesheets
  })
  let cssText = matchProperties ? matchCssText : resultCssText
  if (!cssText) return false
  let targetStylesheet = insertInto
  if (targetStylesheet == null) targetStylesheet = origStylesheet
  if (targetStylesheet.insertRule) {
    cssText = `${newSelector} {${cssText}}`
    targetStylesheet.insertRule(cssText ,targetStylesheet.cssRules.length)
  }
  else if (targetStylesheet.addRule) {
    targetStylesheet.addRule(newSelector ,cssText)
  }
  return true
}
function stableSort(arr ,cmp = (a ,b) => {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}) {
  const stabilizedThis = arr.map((el ,index) => [el ,index])
  const stableCmp = (a ,b) => {
    const order = cmp(a[0] ,b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  }
  stabilizedThis.sort(stableCmp)
  for (let i = 0; i < arr.length; i++) {
    arr[i] = stabilizedThis[i][0]
  }
  return arr
}
/* *************************************
 * Our crap
 */
function mangadexStyleURIComponent(str) {
  // replace all non-alpha-numeric characters with dashing dashes
  return str.replace(/[^a-zA-Z0-9]/g ,'-')
}
function clipText(text ,max_length) {
  return (text.length > max_length) ? `${text.substr(0 ,max_length - 1)}&hellip;` : text
}
function getVisibleText(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent
  const style = getComputedStyle(node)
  if (style && style.display === 'none') return ''
  let text = ''
  for (let i = 0; i < node.childNodes.length; i++) text += getVisibleText(node.childNodes[i])
  return text
}
// iill use classes once we get private variables
function Manga({ id ,title ,description ,image ,isFollowing ,lastViewedDate }) {
  const manga = this
  if (!(manga instanceof Manga)) {
    return new Manga()
  }
  const privateObject = {
    id
    ,title: title ? title.trim() : undefined
    ,description: description ? description.trim() : undefined
    ,image
    ,isFollowing
    ,lastViewedDate: lastViewedDate || 0
  }
  Object.defineProperties(this ,{
    id: {
      get() {
        return privateObject.id
      }
      ,enumerable: true
    }
    ,title: {
      get() {
        return privateObject.title
      }
      ,set(val) {
        return privateObject.title = val.trim()
      }
      ,enumerable: true
    }
    ,description: {
      get() {
        return privateObject.description
      }
      ,set(val) {
        return privateObject.description = val.trim()
      }
      ,enumerable: true
    }
    ,excerpt: {
      get() {
        return clipText(privateObject.description ,100)
      }
      ,enumerable: true
    }
    ,thumbnail: {
      get() {
        return `${MANGADEX_BASE_URI}/images/manga/${privateObject.id}.thumb.jpg`
      }
      ,enumerable: true
    }
    ,image: {
      get() {
        return privateObject.image || this.thumbnail
      }
      ,set(val) {
        return privateObject.image = val
      }
      ,enumerable: true
    }
    ,isFollowing: {
      get() {
        return privateObject.isFollowing === true
      }
      ,set(val) {
        return privateObject.isFollowing = val
      }
      ,enumerable: true
    }
    ,url: {
      get() {
        // TODO make this gnerate a nicer link. nothing after the id really maters, but its nice to have a readable link
        return `${MANGADEX_BASE_URI}/title/${privateObject.id}/${mangadexStyleURIComponent(privateObject.title)}`
      }
      ,enumerable: true
    }
    ,lastViewedDate: {
      get() {
        return privateObject.lastViewedDate
      }
    }
  })
  this.updateViewedTime = () => {
    privateObject.lastViewedDate = Date.now()
  }
  this.savable = () => privateObject
  return this
}
function AttemptParseMangaTitlePage(mangaList) {
  let id
  try {
    [,id] = window.location.href.match(/^https:\/\/mangadex\.org\/title\/(\d+)/)
  }
  catch (e) {
    return undefined
  }
  // return if this is not a tile page
  if (id == null) return undefined
  // Bulild manga entry
  const titleElm = xp.new(`//*[${XPath2.containsClass('card-header')} and ./span[${XPath2.containsClass('fa-book')}] ]`).getElement()
  const title = titleElm.textContent
  // At the least, we need to know the extention
  const imgElm = xp.new(`//*[${XPath2.containsClass('card-body')}]//img[starts-with(@src,'/images/manga/${id}')]`).getElement()
  const image = imgElm.src
  const descriptionElm = xp.new(`//*[${XPath2.containsClass('card-body')}]//div[./div[1][text() = 'Description:']]/div[2]`).getElement()
  const description = descriptionElm.textContent
  const followingElm = xp.new(`//*[${XPath2.containsClass('card-body')}]//div[./div[1][text() = 'Actions:']]/div[2]/div[${XPath2.containsClass('btn-group')}]/div[${XPath2.containsClass('dropdown-menu')} and ./a/span[@title='Follow'] ]/a[${XPath2.containsClass('disabled')}]`).getElement()
  let isFollowing = false
  if (followingElm) {
    isFollowing = true
  }
  mangaList.push({
    title
    ,id
    ,description
    ,image
    ,isFollowing
    ,updateViewedTime: true
  })
}
function AttemptParseMangaFollowsPage(mangaList) {
  // NOTE id was probably suppose to be titles. Expect it to change
  const entryXpath = `./div[${XPath2.containsClass('row')}]/div[${XPath2.attrHasValueStartingWith('@class' ,'col')}]`
  const titleXpath = `.//a[${XPath2.containsClass('manga_title')} and starts-with(@href,'/title/')]`
  const descXpath = `./div[preceding-sibling::ul[${XPath2.containsClass('list-inline')}] and @style]`
  // const chaptersElm = xp.new("//div[@id='chapters']").getElement()
  // return if this is not a tile page
  // if (chaptersElm == null) return undefined
  // xp.new(`./div[${XPath2.containsClass('row')}]/div[${XPath2.attrHasValueStartingWith('@class' ,'col')}]`)
  //  .forEachElement((chapterElm) => {
  // generic over follows, search, titles, featured pages.
  xp.new(`//div/${entryXpath}[${titleXpath} and ${descXpath}]`)
    .forEachElement((chapterElm) => {
      // Bulild manga entry
      try {
        const titleElm = xp.new(`.//a[${XPath2.containsClass('manga_title')} and starts-with(@href,'/title/')]`).getElement(chapterElm)
        const title = titleElm.textContent
        const match = titleElm.getAttribute('href').match(/\/title\/(\d+)\//)
        if (match == null) return undefined
        const [,id] = match
        if (id == null) return undefined
        const descriptionElm = xp.new(`./div[preceding-sibling::ul[${XPath2.containsClass('list-inline')}] and @style]`).getElement(chapterElm)
        const description = descriptionElm.textContent
        let isFollowing
        if (window.location.href.match(/^https:\/\/mangadex\.org\/follows\//)) {
          isFollowing = true
        }
        mangaList.push({
          title
          ,id
          ,description
          ,isFollowing
          ,updateViewedTime: false
        })
      }
      catch (e) {
        dbg(e)
        throw e
      }
      return undefined
    })
}
function AttemptParseMangaFollowUpdates(mangaList) {
  const isHome = window.location.href.match(/^https:\/\/mangadex\.org(\/[^/]*)?$/) != null
  // return if this is not on home page
  if (!isHome) return undefined
  const entries = xp.new(`//div[@id='follows_update']/div[${XPath2.containsClass('row')}]/div`)
  entries.forEachElement((entry) => {
    const titleElm = xp.new(`.//a[${XPath2.containsClass('manga_title')} and starts-with(@href,'/title/')]`).getElement(entry)
    const [,id] = titleElm.getAttribute('href').match(/\/title\/(\d+)\//)
    if (id == null) return undefined
    const title = titleElm.textContent
    // NOTE No point getting images for thumbnails ATM. we can generate those links
    const isFollowing = true
    mangaList.push({
      title
      ,id
      ,isFollowing
    })
  })
  // Bulild manga entry
}
function MangaList({
  list: loadableList = {
    followed: {} ,unfollowed: {}
  } ,titleHistLimit = 200
}) {
  const mangaList = this
  if (!(mangaList instanceof MangaList)) {
    return new MangaList()
  }
  this.maxSize = titleHistLimit
  mangaList.list = {
    followed: {} ,unfollowed: {}
  }
  const cleanupHistory = () => {
    if (Object.keys(this.list.unfollowed).length <= this.maxSize) return false
    let cnt = 0
    this.list.unfollowed = Object.entries(this.list.unfollowed).sort(([,a] ,[,b]) => a.lastViewedDate > b.lastViewedDate).filter(() => {
      if (this.maxSize > cnt++) return true
      return false
    }).reduce((accum ,[k ,o]) => {
      accum[k] = o
      return accum
    } ,{})
    return true
  }
  this.load = (val) => {
    Object.entries(val.followed).forEach(([k ,v]) => {
      this.list.followed[k] = new Manga(v)
    })
    Object.entries(val.unfollowed).forEach(([k ,v]) => {
      this.list.unfollowed[k] = new Manga(v)
    })
  }
  this.savable = () => {
    cleanupHistory()
    const obj = {
      followed: {} ,unfollowed: {}
    }
    Object.entries(mangaList.list.followed).forEach(([k ,v]) => {
      obj.followed[k] = v.savable()
    })
    Object.entries(mangaList.list.unfollowed).forEach(([k ,v]) => {
      obj.unfollowed[k] = v.savable()
    })
    return obj
  }
  this.push = ({ id ,description ,image ,title ,isFollowing ,updateViewedTime = false ,...mangaArgs }) => {
    const manga = this.list.followed[id] || this.list.unfollowed[id] || new Manga({
      id ,...mangaArgs
    })
    if (description) manga.description = description
    if (image) manga.image = image
    if (title) manga.title = title
    if (isFollowing != null) manga.isFollowing = isFollowing
    if (updateViewedTime) manga.updateViewedTime()
    if (manga.isFollowing) {
      this.list.followed[manga.id] = manga
      delete (this.list.unfollowed[manga.id])
    }
    else {
      this.list.unfollowed[manga.id] = manga
      delete (this.list.followed[manga.id])
    }
  }
  this.autoComplete = (partial_name ,{ case_sensitive = false ,fuzzy = true ,showUnfollowed = 0 } = {}) => {
    let matches = Object.values(this.list.followed).concat(showUnfollowed === 0 ? Object.values(this.list.unfollowed) : []).filter((e) => {
      // If this user is already marked as the highest priority match, dont process them anymore.
      const regex_partial_name = new RegExp(`${fuzzy ? '' : '^'}${partial_name}` ,`${case_sensitive ? '' : 'i'}`)
      if (e.title.match(regex_partial_name)) {
        return true
      }
      return false
    })
    matches = stableSort(matches ,(a ,b) => {
      // List people whos names start with partial before those with partial anywhere in name
      if (fuzzy) {
        const regex_partial_name = new RegExp(`^${partial_name}` ,`${case_sensitive ? '' : 'i'}`)
        const am = a.title.match(regex_partial_name) != null
        const bm = b.title.match(regex_partial_name) != null
        if (am !== bm) {
          return bm
        }
      }
      // List those we are following before those we are not
      {
        const am = a.isFollowing
        const bm = b.isFollowing
        if (am !== bm) {
          return bm
        }
      }
      {
        const am = a.lastViewedDate
        const bm = b.lastViewedDate
        if (am > bm) return -1
        if (am < bm) return 1
      }
      return 0
    })
    return matches
  }
  this.load(loadableList)
  return this
}
function History({ history: loadedHistory = [] ,historySize = 200 } = {}) {
  const uhist = this
  if (!(uhist instanceof History)) {
    return new History()
  }
  function clipText(text ,max_length) {
    return (text.length > max_length) ? `${text.substr(0 ,max_length - 1)}&hellip;` : text
  }
  function getVisibleText(node) {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent
    const style = getComputedStyle(node)
    if (style && style.display === 'none') return ''
    let text = ''
    for (let i = 0; i < node.childNodes.length; i++) text += getVisibleText(node.childNodes[i])
    return text
  }
  const cleanupHistory = () => {
    if (this.history.size > this.max_size) {
      // delete(this.history.entries().next().value[0]);
      this.history.shift()
    }
  }
  this.max_size = historySize
  this.history = loadedHistory
  this.push = (item) => {
    function array_move(arr ,old_index ,new_index) {
      arr.splice(new_index ,0 ,arr.splice(old_index ,1)[0])
      return arr
    }
    let exists = false
    this.history.some((e ,k) => {
      if (e.id === item.id) {
        exists = true
        array_move(this.history ,k ,0)
        return true
      }
      return false
    })
    if (exists) {
      return false
    }
    this.history.unshift(item)
    cleanupHistory()
  }
  this.autoComplete = (partial_name ,{ case_sensitive = false ,fuzzy = true } = {}) => {
    let matches = this.history.filter((e) => {
      // If this user is already marked as the highest priority match, dont process them anymore.
      const regex_partial_name = new RegExp(`${fuzzy ? '' : '^'}${partial_name}` ,`${case_sensitive ? '' : 'i'}`)
      if (e.user_name.match(regex_partial_name)) {
        return true
      }
      return false
    })
    matches = stableSort(matches ,(a ,b) => {
      // List those from this thread before other threads
      {
        const am = a.thread_id === thread_id
        const bm = b.thread_id === thread_id
        if (am !== bm) {
          return bm
        }
      }
      // List people whos names start with partial before those with partial anywhere in name
      if (fuzzy) {
        const regex_partial_name = new RegExp(`^${partial_name}` ,`${case_sensitive ? '' : 'i'}`)
        const am = a.user_name.match(regex_partial_name) != null
        const bm = b.user_name.match(regex_partial_name) != null
        if (am !== bm) {
          return bm
        }
      }
      // List those who mentioned us before those who did not.
      if (a.did_mention !== b.did_mention) {
        return b.did_mention
      }
    })
    const seen = {}
    matches = matches.filter((e) => {
      if (seen[e.user_id]) {
        return false
      }
      seen[e.user_id] = true
      return true
    })
    return matches
  }
  return this
}
const posts = xp.new('//tr').with(xp.new().contains('@class' ,'post'))
// Because Javascript's does not require .sort to be Stable.
// Currently Chrome alone uses Unstable sort. They are now moving to Stable.
// This returns the same results for all browsers,
// userid = Your user ID
function User({ name ,id ,img }) {
  const user = this
  if (!(user instanceof User)) {
    return new User()
  }
  user.name = name
  user.id = id
  user.img = img
  return user
}
function UserList({ list = {} }) {
  const userList = this
  if (!(userList instanceof UserList)) {
    return new UserList()
  }
  userList.list = list
  userList.push = (user) => {
    userList.list[user.id] = user
  }
  return userList
}
function Post({ post_id ,time ,user_id ,thread_id }) {
  const post = this
  if (!(post instanceof Post)) {
    return new Post()
  }
  post.user_id = user_id
  post.thread_id = thread_id
  post.id = post_id
  post.time = time
  return post
}
function Thread({ id ,title ,manga_id }) {
  const thread = this
  if (!(thread instanceof Thread)) {
    return new Thread()
  }
  thread.id = id
  thread.title = title
  thread.manga_id = manga_id
  return thread
}
function UserHistory({ read_posts_history = [] ,user_id ,username ,historySize = 200 } = {}) {
  const uhist = this
  if (!(uhist instanceof UserHistory)) {
    return new UserHistory()
  }
  const cleanupHistory = () => {
    while (this.history.length > this.max_size) {
      // delete(this.history.entries().next().value[0]);
      this.history.pop()
    }
  }
  this.user_id = user_id
  this.username = '' // get from userid
  this.max_size = parseInt(historySize)
  this.history = read_posts_history
  this.push = (post) => {
    const post_id = parseInt(post.id.replace(/^post_/ ,''))
    // this.history.delete(post_id);
    // this.history.set(post_id,{user_id:user_id,user_img:user_img,excerpt:excerpt});
    // this.history.filter((e)=> { e.thread_id === thread_id } );
    function array_move(arr ,old_index ,new_index) {
      arr.splice(new_index ,0 ,arr.splice(old_index ,1)[0])
      return arr
    }
    let exists = false
    this.history.some((e ,k) => {
      if (e.post_id === post_id) {
        exists = true
        array_move(this.history ,k ,0)
        return true
      }
      return false
    })
    if (exists) {
      return false
    }
    let time
    let thread
    let thread_id
    let user
    let user_name
    let user_level
    let user_color
    let user_img
    let postContents
    let did_mention
    try {
      time = xp.new('.//span').with(xp.new('./span').with(xp.new().contains('@class' ,'fa-clock'))).getElement(post).title
      thread = xp.new('./td/span/a').with(xp.new('preceding-sibling::span').with(xp.new().contains('@class' ,'fa-clock'))).getElement(post).href
      thread_id = parseInt(thread.match(/\/thread\/(\d+)\//)[1])
      user = xp.new('.//a[contains(@class,"user_level") and starts-with(@href,"/user/")]').getElement(post)
      user_name = user.textContent
      // TODO: actualy store user level
      user_level = user.className
      user_color = user.style.color
      user_id = parseInt(user.href.match(/\/user\/(\d+)\//)[1])
      user_img = xp.new(`.//img[${XPath2.containsClass('avatar')}]`).getElement(post).src
      postContents = xp.new('.//div').with(xp.new().contains('@class' ,'postbody')).getElement(post)
      did_mention = Boolean(xp.new(`.//a[@href="https://mangadex.org/user/${uhist.user_id}"]`).getElement(postContents))
    }
    catch (e) {
      dbg('Error occured while trying to parse post.')
      dbg(post)
      dbg(e)
      // an error occured
      return undefined
    }
    // cleanText. Hide spoilers and other invisible crap
    const cleanText = getVisibleText(postContents)
    const excerpt = clipText(cleanText ,100)
    this.history.unshift({
      thread_id
      ,user_name
      ,user_level
      ,user_color
      ,user_id
      ,user_img
      ,did_mention
      ,post_id
      ,excerpt
      ,time
    })
    cleanupHistory()
  }
  this.autoComplete = (partial_name ,{ thread_id = 0 ,case_sensitive = false ,fuzzy = true ,showUsersWho = 3 } = {}) => {
    let matches = this.history.filter((e) => {
      // If this user is already marked as the highest priority match, dont process them anymore.
      const regex_partial_name = new RegExp(`${fuzzy ? '' : '^'}${partial_name}` ,`${case_sensitive ? '' : 'i'}`)
      if (e.user_name.match(regex_partial_name)) {
        if (showUsersWho === 2) return true
        if (showUsersWho === 1 && e.did_mention) return true
        if (showUsersWho <= 1 && e.thread_id === thread_id) return true
        return false
      }
      return false
    })
    matches = stableSort(matches ,(a ,b) => {
      // List those from this thread before other threads
      {
        const am = a.thread_id === thread_id
        const bm = b.thread_id === thread_id
        if (am !== bm) {
          return bm
        }
      }
      // List people whos names start with partial before those with partial anywhere in name
      if (fuzzy) {
        const regex_partial_name = new RegExp(`^${partial_name}` ,`${case_sensitive ? '' : 'i'}`)
        const am = a.user_name.match(regex_partial_name) != null
        const bm = b.user_name.match(regex_partial_name) != null
        if (am !== bm) {
          return bm
        }
      }
      // List those who mentioned us before those who did not.
      if (a.did_mention !== b.did_mention) {
        return b.did_mention
      }
    })
    const seen = {}
    matches = matches.filter((e) => {
      if (seen[e.user_id]) {
        return false
      }
      seen[e.user_id] = true
      return true
    })
    return matches
  }
  return this
}
function getCurrentUserID() {
  xp.new('id("navbarSupportedContent")').with(xp.new().contains('@class' ,'navbarSupportedContent'))
  const current_user_id = xp.new('id("navbarSupportedContent")//a[contains(@href,"/user/")]').getElement().href.match(/\/user\/(\d+)\//)[1]
  return parseInt(current_user_id)
}
function initSettingsDialog({ loaded_settings ,atWhoMethods }) {
  const settingsUi = new SettingsUI({
    groupName: 'Auto-Complete'
    ,settingsTreeConfig: {
      saveLocation: 'settings' ,autosave: true
    }
  })
  const autocompleteTypes = settingsUi.addMultiselect({
    title: 'Autocompletes'
    ,key: 'autocompleteTypes'
    ,titleText: 'What all should we will autocomplete?'
    ,placeholder: 'Autocompletion disabled! Click here to re-enable...'
  })
  autocompleteTypes.addOption({
    key: 'usernames'
    ,title: '@Mentions'
    ,settingsTreeConfig: {
      defaultValue: true
      ,onchange: () => {
        atWhoMethods.rebuild()
      }
    }
  })
  autocompleteTypes.addOption({
    key: 'titles'
    ,title: ':Title'
    ,settingsTreeConfig: {
      defaultValue: true
      ,onchange: () => {
        atWhoMethods.rebuild()
      }
    }
  })
  /* const userCompletionCharCount = settingsUi.addTextbox({
      key: 'userCompletionCharCount'
      ,title: 'Minimum username length'
      ,settingsTreeConfig: {
        defaultValue: 0
        ,corrector: newNumberCorrector(0 ,10)
      }
      ,min: 0
      ,max: 10
      ,titleText: 'Mnimum number of characters in the Username you must type before autocompletion starts. Default: 0'
      ,type: 'number'
    }) */
  const showUsersWho = settingsUi.addSelect({
    title: 'Show users who'
    ,key: 'showUsersWho' // ,placeholder: 'Are in this thread'
    // ,branchingSingleselect: true

    ,settingsTreeConfig: { defaultValue: 0 }
  })
  showUsersWho.addOption({
    // key: 'areInThread'
    // key: 0
    title: 'Are in this thread'
    // ,settingsTreeConfig: { defaultValue: true }
  })
  showUsersWho.addOption({
    // key: 'haveMentionedYou'
    title: 'Have @mentioned you'
    // ,settingsTreeConfig: { defaultValue: true }
  })
  showUsersWho.addOption({
    // key: 'everyone'
    title: 'We know exist'
    // ,settingsTreeConfig: { defaultValue: true }
  })
  function newNumberValidator(min ,max) {
    return (textVal) => {
      const val = parseInt(textVal)
      if (textVal.match(/[^0-9]/) || typeof val !== 'number' || val < min || val > max) {
        throw new SettingsUIValidationError({ feedback: `Must be a number between ${min} and ${max}` })
      }
      return true
    }
  }
  function newNumberCorrector(min ,max) {
    return (textVal) => {
      const val = parseInt(textVal)
      if (textVal == null
                || (typeof textVal === 'string' && (textVal.length === 0 || textVal.match(/[^0-9]/)))
                || typeof val !== 'number') {
        return undefined
      }
      if (val < min) return min
      if (val > max) return max
      // dont triger callback via type change.
      return textVal
    }
  }
  const userHistLimit = settingsUi.addTextbox({
    key: 'max_post_history'
    ,title: 'User History Size'
    ,settingsTreeConfig: {
      defaultValue: 200
      ,corrector: newNumberCorrector(20 ,2000)
    }
    ,min: 20
    ,max: 2000
    ,titleText: 'Maximum number of user posts we should remember. Used for @mention autocompletion'
    ,type: 'number'
  })
  const titleCompletionChar = settingsUi.addTextbox({
    key: 'titleCompletionChar'
    ,title: 'Title Completion Trigger'
    ,settingsTreeConfig: {
      defaultValue: ':'
      ,onchange: () => {
        atWhoMethods.rebuild()
      }
      // ,corrector: newNumberCorrector(0 ,2000)
    }
    ,titleText: 'Character(s) you must type in order to trigger Manga Title auto completion. default: colon character <:>'
  })
  /* const titleCompletionCharCount = settingsUi.addTextbox({
      key: 'titleCompletionCharCount'
      ,title: 'Minimum title length'
      ,settingsTreeConfig: {
        defaultValue: 200
        ,corrector: newNumberCorrector(0 ,10)
      }
      ,min: 0
      ,max: 10
      ,titleText: 'Mnimum number of characters in the Title you must type before autocompletion starts. Default: 0'
      ,type: 'number'
    }) */
  const showUnfollowed = settingsUi.addSelect({
    title: 'Unfollowed manga is'
    ,key: 'showUnfollowed' // ,placeholder: 'Are in this thread'
    // ,branchingSingleselect: true

    ,settingsTreeConfig: { defaultValue: 0 }
  })
  showUnfollowed.addOption({
    title: 'Shown'
    // ,value: true
  })
  showUnfollowed.addOption({
    title: 'Hiden'
    // ,value: false
  })
  const autocompleteTitleInto = settingsUi.addMultiselect({
    title: 'Title to bbcode'
    ,key: 'autocompleteTitleInto'
    ,titleText: 'Autocompleted Manga titles can be transformed into bbcode!'
    ,placeholder: 'No Magic! ...Just a title please'
    // ,branchingSingleselect: true
    // ,settingsTreeConfig: { defaultValue: 0 }
  })
  autocompleteTitleInto.addOption({
    key: 'thumbnail'
    ,title: 'Thumbnail'
    ,settingsTreeConfig: { defaultValue: false }
  })
  autocompleteTitleInto.addOption({
    key: 'link'
    ,title: 'Link'
    ,settingsTreeConfig: { defaultValue: true }
  })
  autocompleteTitleInto.addOption({
    key: 'description'
    ,title: 'Description Spoiler' // potentialy way to long to put outside a spoiler
    ,settingsTreeConfig: { defaultValue: false }
  })
  const autocompleteTitleStyle = settingsUi.addMultiselect({
    title: 'Title style'
    ,key: 'autocompleteTitleStyle'
    ,titleText: 'BBCode formating style'
    ,placeholder: 'Let me format it myself!'
    // ,branchingSingleselect: true
    // ,settingsTreeConfig: { defaultValue: 0 }
  })
  autocompleteTitleStyle.addOption({
    key: 'center'
    ,title: 'Center'
    ,settingsTreeConfig: { defaultValue: false }
  })
  const titleHistLimit = settingsUi.addTextbox({
    key: 'max_title_history'
    ,title: 'Unfollowed memory size'
    ,settingsTreeConfig: {
      defaultValue: 10
      ,corrector: newNumberCorrector(0 ,2000)
    }
    ,min: 0
    ,max: 2000
    ,titleText: 'Maximum number of Non-Followed titles we should remember. Used for :Title autocompletion. Added to history when you visit the title page.'
    ,type: 'number'
  })
  // Load our saved settings object into the ui
  // settingsUi.settingsTree.load_all()
  settingsUi.settingsTree.value = loaded_settings
  // return new settings object which is bound to the UI.
  const settings = settingsUi.settingsTree.value
  return settings
}
function formatMangaItem(item) {
  // When getters/setters are present, the object is assigned to name. For some reason
  const obj = item.name
  // TODO text carosel for long names
  return `<li class="dropdown-item px-0 " style="">
  <div class="d-flex justify-content-between align-items-center px-2" style="height:50px; max-width: 400px;"
  title="${obj.description != null ? clipText(obj.description ,1000) : 'Description unavailible until you visit the title page'}">
    <div class="h-100">
    <span class="${obj.isFollowing ? 'far fa-bookmark' : ''}"></span>
    <img src="${obj.image}" class="mh-100 rounded avatar"/>
    </div>
    <span class="manga_title d-inline-block text-truncate" style="">${obj.title}</span>
    </div></li>`
}
function main({ read_posts_history ,mangaTitleHistory ,settings: loaded_settings }) {
  const atWhoMethods = { rebuild: () => undefined }
  const settings = initSettingsDialog({
    loaded_settings ,atWhoMethods
  })
  // Manga  History
  const mangaList = new MangaList({
    list: mangaTitleHistory ,titleHistLimit: settings.max_title_history
  })
  AttemptParseMangaTitlePage(mangaList)
  AttemptParseMangaFollowUpdates(mangaList)
  AttemptParseMangaFollowsPage(mangaList)
  setUserValue('mangaTitleHistory' ,mangaList.savable())
  unsafeWindow.mangaList = mangaList
  // User History
  const user_id = getCurrentUserID()
  const uhist = new UserHistory({
    read_posts_history
    ,user_id // NOTE History size changes will only take effect once a new post is seen.

    ,historySize: settings.max_post_history
  })
  unsafeWindow.uhist = uhist
  unsafeWindow.settings = settings
  // Add current page's posts to history.
  let thread = xp.new(posts).append('//td/span/a').with(xp.new('preceding-sibling::span').with(xp.new().contains('@class' ,'fa-clock'))).getElement()
  if (thread) {
    thread = thread.href
    const thread_id = parseInt(thread.match(/\/thread\/(\d+)\//)[1])
    if (window.location.pathname.startsWith('/thread/')) {
      posts.forEachOrderedElement((post) => {
        uhist.push(post)
      })
    }
    else {
      // Consider more efficient approch
      const snap = posts.getOrderedSnapshot()
      for (let i = snap.snapshotLength - 1; i >= 0; i--) {
        uhist.push(snap.snapshotItem(i))
      }
    }
    setUserValues({ read_posts_history: uhist.history })
    // NOTE there can be more than one textarea. but they all use the same id :O
    function autoComplete(partial_name ,render_view) {
      const r = uhist.autoComplete(partial_name ,{
        thread_id ,case_sensitive: false ,fuzzy: true ,showUsersWho: settings.showUsersWho
      })
      render_view(r)
    }
    function autoCompleteManga(partial_name ,render_view) {
      const r = mangaList.autoComplete(partial_name ,{
        case_sensitive: false ,fuzzy: true ,showUnfollowed: settings.showUnfollowed
      })
      render_view(r)
    }
    function formatDisplayItem(item) {
      return `<li class="dropdown-item px-0 " style=""><div class="d-flex justify-content-between align-items-center px-2" style="height:50px;" title="${item.excerpt}">
        <div class="h-100">
        <span class="">${item.did_mention ? '@' : ''}</span>
        <span class="${item.thread_id === thread_id ? 'far fa-comments' : ''}"></span>
        <img src="${item.user_img}" class="mh-100 rounded avatar"/>
        </div>
        <span class="${item.user_level}" style="color:${item.user_color};">${item.user_name}</span>
        </div></li>`
    }
    atWhoMethods.rebuild = () => {
      $('textarea[id="text"]').atwho('destroy')
      if (settings.autocompleteTypes.usernames) {
        $('textarea[id="text"]').atwho({
          at: '@'
          ,displayTpl: formatDisplayItem
          ,insertTpl: '${atwho-at}${user_name}'
          ,searchKey: 'user_name' // We don't want to use your filter or sorter. remoteFilter is a better fit for us.

          ,data: [] // data: uhist.history,

          ,limit: 200
          ,callbacks: {
            remoteFilter: autoComplete // NoOp

            ,sorter: (_ ,i) => i
          }
        })
      }
      if (settings.autocompleteTypes.titles) {
        $('textarea[id="text"]').atwho({
          at: settings.titleCompletionChar
          ,displayTpl: formatMangaItem
          ,insertTpl: ({ 'atwho-at': atwhoat ,name: item }) => {
            const link = settings.autocompleteTitleInto.link ? {
              open: `[url=${item.url}]` ,close: '[/url]'
            } : {
              open: '' ,close: ''
            }
            const alignment = settings.autocompleteTitleStyle.center
              ? {
                open: '[center]' ,close: '[/center]'
              }
              : {
                open: '' ,close: ''
              }
            const img = settings.autocompleteTitleInto.thumbnail ? `\n${alignment.open}${link.open}[img]${item.thumbnail}[/img]${link.close}${alignment.close}` : ''
            const desc = settings.autocompleteTitleInto.description && item.description != null ? ` | Description: [spoiler]${item.description}[/spoiler]` : ''
            return `${alignment.open}${link.open}${item.title}${link.close}${alignment.close}${desc}${img}`
          }
          ,searchKey: 'title'
          ,data: [] // ,data: [...Object.values(mangaList.list.followed) ,...Object.values(mangaList.list.unfollowed)]

          ,limit: 200
          ,callbacks: {
            remoteFilter: autoCompleteManga // NoOp

            ,sorter: (_ ,i) => i
          }
        })
      }
      $('.atwho-container').addClass('container ')
      $('.atwho-view').css({ display: 'none' })
      $('.atwho-view-ul').addClass('pre-scrollable d-inline-flex flex-column')
    }
    atWhoMethods.rebuild()
    // HACK make atwho use flex instead of block
    // This also works instead of inline flex on ul, but it makes the container visible until atwho is invoked
    // Hide now. atwho changes display between none and whatever it is already set to automaticly
    // $('.atwho-view').css({display:'flex'})
    // $('.atwho-view-ul').addClass('pre-scrollable ')
    // These make atwho dropdown menu use the same color theme as the site
    // const atwhoStylesheet = addCssLink('https://gitcdn.xyz/repo/ichord/At.js/1b7a52011ec2571f73385d0c0d81a61003142050/dist/css/jquery.atwho.css')
    const customStylesheet = insertStylesheet('')
    // HACK dropdown-menu breaks atwho autoscroll somehow. lets just copy parts of the theme
    duplicate_cssRule({
      origSelector: '.dropdown-menu'
      ,newSelector: '.atwho-view-ul'
      ,matchProperties: ['background' ,'color' ,'border' ,'margin' ,'padding'] // ,ignoredStylesheets: [atwhoStylesheet]

      ,targetStylesheet: customStylesheet
    })
    duplicate_cssRule({
      origSelector: '.dropdown-menu.show'
      ,newSelector: '.atwho-view-ul'
      ,matchProperties: ['background' ,'color' ,'border' ,'margin' ,'padding'] // ,ignoredStylesheets: [atwhoStylesheet]

      ,targetStylesheet: customStylesheet
    })
    // make the selected atwho user be highlighted using the same color theme as the site.
    duplicate_cssRule({
      origSelector: '.dropdown-item:hover, .dropdown-item:focus'
      ,newSelector: '.atwho-view .cur'
      ,matchProperties: ['background' ,'color'] // ,ignoredStylesheets: [atwhoStylesheet]

      ,targetStylesheet: customStylesheet
    })
    // For debugging
    // unsafeWindow.uhist = uhist
  }
}
// setTimeout( () => {
getUserValues({
  read_posts_history: []
  ,mangaTitleHistory: {
    followed: {} ,unfollowed: {}
  }
  ,settings: {}
}).then(main)
