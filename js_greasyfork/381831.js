// ==UserScript==
// @name        Mangadex Preview Post
// @description WhatYouSeeIsWhatYouGet preview generator for MangaDex comments/posts/profile. Shows a formatted preview next to the edit box.
// @namespace   https://github.com/Christopher-McGinnis
// @author      Christopher McGinnis
// @license     MIT
// @icon        https://mangadex.org/favicon-96x96.png
// @version     0.3.15
// @grant       GM_xmlhttpRequest
// @require     https://gitcdn.xyz/cdn/pegjs/pegjs/0b102d29a86254a50275b900706098aeca349740/website/vendor/pegjs/peg.js
// @match       https://mangadex.org/*
// @downloadURL https://update.greasyfork.org/scripts/381831/Mangadex%20Preview%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/381831/Mangadex%20Preview%20Post.meta.js
// ==/UserScript==
/* global $ */

'use strict'

// FIXME: The entire MediaTag code is an ugly mess
const isUserscript = window.GM_xmlhttpRequest !== undefined
// Ensure Console/Bookmarklet is not run on other sites.
if (!isUserscript && !window.location.href.startsWith('https://mangadex.org')) {
  /* eslint-disable-next-line no-alert */
  alert('Mangadex Post Preview script only works on https://mangadex.org')
  throw Error('Mangadex Post Preview script only works on https://mangadex.org')
}
// This is used when run in Browser Console / Bookmarklet mode
// Loads the same scripts used in UserScript.
// Does not run at all in userscript mode.
function loadScript(url) {
  // Adding the script tag to the head as suggested before
  const { head } = document
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.src = url
  // Then bind the event to the callback function.
  // There are several events for cross browser compatibility.
  return new Promise((resolve ,reject) => {
    // script.onreadystatechange = resolve
    script.onload = resolve
    script.onerror = reject
    // Fire the loading
    head.appendChild(script)
  })
}
const imageBlobs = {}
function getImageBlob(url) {
  if (!imageBlobs[url]) {
    imageBlobs[url] = new Promise((ret ,err) => {
      GM_xmlhttpRequest({
        method: 'GET'
        ,url
        ,responseType: 'blob'
        ,onerror: err
        ,ontimeout: err
        ,onload: (response) => {
          if (((response.status >= 200 && response.status <= 299) || response.status === 304)
                        && response.response) {
            imageBlobs[url] = Promise.resolve(response.response)
            return ret(imageBlobs[url])
          }
          return err(response)
        }
      })
    })
  }
  return imageBlobs[url]
}
function getImageObjectURL(url) {
  return getImageBlob(url).then(b => URL.createObjectURL(b))
}
const imgCache = {}
// Clones are made because the same image may be used more than once in a post.
function cloneImageCacheEntry(source) {
  const element = source.element.cloneNode()
  // Take for granted that we are loaded if our source was loaded.
  // Not necessarily true, but things should already be set as if it were
  // since we cloned the values.
  const { loadPromise } = source
  return {
    element ,loadPromise
  }
}
// Firefox Speed Test: Fastest to Slowest
// getImgForURLViaFetch: Caches blobs
// -- No noticable lag or problems with several small images on page.
// -- Very usable with Hell's test, though there is a small bit of lag
// -- (Rebuilds hell in under 1 second.
// -- Does better than getImgForURL does with a normal post with small images)
// getImgForURLViaImg: Caches imgs, clones on reuse
// -- Holding down a key causes noticable shakyness. No real script lag,
// -- but the images width/height seem to start off at 0 and then
// -- suddenly grow. Verry offsetting to look at
// -- Survives Hell's test almost just as well. Very minor additional lag.
// -- As such, I believe this is quite scalable.
// getImgForURLNoCache: Creates new img and sets src like normal
// -- Noticable lag. Preview will not update while a key is being spammed.
// -- Slightly jumpy like above, but not as noticable since the lag
// -- spreads it out.
// -- Survives Hell's test just as well as getImgForURLViaImg.
// -- Whatever benifit we get from cloning may not apply here.
// -- Perhaps due to the fact we are looking up only 1 image several hundrad times.
// BROKEN getImgForURLViaFetchClone: Caches Img of blobs.
// -- Does not work when image is used multiple times, for some reason.
// -- Should be comparable to getImgForURLViaFetch, if it worked.
// -- Failed to render any images for hell's test.
function getImgForURLViaImg(url) {
  if (imgCache[url] !== undefined) {
    return cloneImageCacheEntry(imgCache[url])
  }
  // TODO add images loaded in thread to cache.
  const element = document.createElement('img')
  // element.element.src=LOADING_IMG
  const loadPromise = new Promise((ret ,err) => {
    element.onload = () => ret(element)
    element.onerror = e => err(new Error(e.toString()))
    element.src = url
  })
  imgCache[url] = {
    element ,loadPromise
  }
  // First use. Clone not needed since gaurenteed to be unused
  return imgCache[url]
}
function getImgForURLViaFetch(url) {
  const promise = getImageObjectURL(url)
  const element = document.createElement('img')
  // element.element.src=LOADING_IMG
  const loadPromise = promise.then(e => new Promise((resolve ,reject) => {
    element.onload = () => {
      URL.revokeObjectURL(e)
      resolve(element)
    }
    element.onerror = (err) => {
      URL.revokeObjectURL(e)
      reject(new Error(err.toString()))
    }
    element.src = e
  }))
  // Clone not needed since a new img is generated every time.
  return {
    element ,loadPromise
  }
}
function getImgForURL(url) {
  if (isUserscript) {
    return getImgForURLViaFetch(url)
  }
  return getImgForURLViaImg(url)
}
/* PEG grammer */
// TODO:
// Partial rebuilds! only update what changed
// FIXME:
// Img is text only. not recursive
let generatedBBCodePegParser
function tokensToSimpleAST(tokens) {
  // FIXME Figure out Why pegjs returns null. is it an error, does empty
  // do an early escape? does having none of a token:expresion+
  // return null instead of [] (tested return token? token: [], didn't help)
  if (tokens == null) {
    return []
  }
  // Why did I make a root again?
  const astroot = [
    {
      type: 'root'
      ,content: []
      ,location: [0 ,0]
    }
  ]
  const stack = [astroot[0]]
  let astcur = astroot[0]
  /* eslint-disable prefer-destructuring */
  let mediaStateOpened
  let mediaErrorState = false
  tokens.forEach((token) => {
    if (mediaStateOpened && token.type !== 'linebreak') {
      const openMedia = astcur.content[astcur.content.length - 1]
      if (token.type === 'close' && token.tag === 'img') {
        if (!mediaErrorState) {
          mediaStateOpened.explicitlyClosed = true
          mediaStateOpened.location[1] = token.location[1]
        }
        else {
          if (openMedia.type === 'openmedia') {
            const errorAst = {
              type: 'error'
              ,content: `[${mediaStateOpened.tag}]${mediaStateOpened.content}`
              ,location: mediaStateOpened.location
            }
            astcur.content.pop()
            astcur.content.push(errorAst)
          }
          const errorAst = {
            type: 'error'
            ,content: `[/${token.tag}]`
            ,location: openMedia.location
          }
          astcur.content.push(errorAst)
        }
        mediaErrorState = false
        mediaStateOpened = undefined
        astcur.location[1] = token.location[1]
        return undefined
      }
      if (openMedia.type === 'openmedia') {
        if (openMedia.content === ''
                    && (token.type === 'link' || token.type === 'text')
                    && token.content.match(/^[^ \t\n\r:[\]]+:\/\/[^ \t\n\r[\]]+$/)) {
          openMedia.content = token.content
          astcur.location[1] = token.location[1]
          mediaErrorState = false
          return undefined
        }
        const errorAst = {
          type: 'error'
          ,content: `[${openMedia.tag}]${openMedia.content}`
          ,location: openMedia.location
        }
        astcur.content.pop()
        astcur.content.push(errorAst)
      }
      mediaErrorState = true
      if (token.type === 'open' || token.type === 'prefix'
                || token.type === 'opendata' || token.type === 'openmedia') {
        const errorAst = {
          type: 'error'
          ,content: `[${token.tag}]`
          ,location: token.location
        }
        astcur.content.push(errorAst)
      }
      else if (token.type === 'close') {
        const errorAst = {
          type: 'error'
          ,content: `[/${token.tag}]`
          ,location: token.location
        }
        astcur.content.push(errorAst)
      }
      else if (token.type === 'link') {
        const errorAst = {
          type: 'error'
          ,content: `${token.content}`
          ,location: token.location
        }
        astcur.content.push(errorAst)
      }
      else if (token.type === 'error' || token.type === 'text') {
        const errorAst = {
          type: 'error'
          ,content: `${token.content}`
          ,location: token.location
        }
        astcur.content.push(errorAst)
      }
      astcur.location[1] = token.location[1]
      return undefined
    }
    if (token.type === 'close') {
      let idx = Object.values(stack).reverse().findIndex(e => (e.type === 'open' || e.type === 'opendata' || e.type === 'prefix') && e.tag === token.tag)
      if (idx !== -1) {
        idx += 1
        // NOTE should we set ast location end? Yes!
        for (let i = stack.length - idx; i < stack.length; i++) {
          stack[i].location[1] = token.location[1]
        }
        stack.splice(-idx ,idx)
        astcur.location[1] = token.location[1]
        astcur = stack[stack.length - 1]
      }
      else {
        const thisast = {
          type: 'error'
          ,content: `[/${token.tag}]`
          ,location: token.location
        }
        astcur.location[1] = token.location[1]
        astcur.content.push(thisast)
      }
    }
    else if (token.type === 'open') {
      const thisast = {
        type: token.type
        ,tag: token.tag
        ,content: []
        ,location: token.location
      }
      // Must update end location when tag closes
      astcur.content.push(thisast)
      astcur.location[1] = token.location[1]
      // ;({ location: [,astcur.location[1]] } = token)
      astcur = thisast
      stack.push(thisast)
    }
    else if (token.type === 'prefix') {
      const thisast = {
        type: token.type
        ,tag: token.tag
        ,content: []
        ,location: token.location
      }
      // cannot directly nest bullet in bullet (must have a non-prexix container class)
      if (astcur.type === 'prefix') {
        // FIXME are we supposed to subtract 1 here?
        astcur.location[1] = token.location[0] // - 1
        stack.pop()
        astcur = stack[stack.length - 1]
      }
      astcur.content.push(thisast)
      astcur.location[1] = token.location[1]
      astcur = thisast
      stack.push(thisast)
    }
    else if (token.type === 'opendata') {
      const thisast = {
        type: token.type
        ,tag: token.tag
        ,content: []
        ,location: token.location
      }
      thisast.data = token.attr
      astcur.content.push(thisast)
      astcur.location[1] = token.location[1]
      astcur = thisast
      stack.push(thisast)
    }
    else if (token.type === 'openmedia') {
      const thisast = {
        type: token.type
        ,tag: token.tag
        ,content: ''
        ,location: token.location
        ,explicitlyClosed: false
      }
      astcur.content.push(thisast)
      astcur.location[1] = token.location[1]
      mediaStateOpened = thisast
      mediaErrorState = true
      // astcur = thisast
      // stack.push(thisast)
    }
    else if (token.type === 'linebreak') {
      // TODO should check if prefix instead if prefix is to be expanded appon
      // if (astcur.type === 'prefix') {
      // FIXME are we supposed to subtract 1 here?
      //  astcur.location[1] = token.location[0] // - 1
      // Are Linebreaks added when we are exiting a prefix? Seems like it!
      // Not sure why though...
      //  astcur.content.push(token)
      //  stack.pop()
      //  astcur = stack[stack.length - 1]
      // }
      // else {
      ({ location: [,astcur.location[1]] } = token)
      astcur.content.push(token)
      // }
    }
    else if (token.type === 'link') {
      astcur.location[1] = token.location[1]
      const previousSiblingAst = astcur.content[astcur.content.length - 1]
      if ((astcur.type === 'root' && !previousSiblingAst)
                || (previousSiblingAst && (previousSiblingAst.type === 'linebreak'
                    || (previousSiblingAst.type === 'text' && previousSiblingAst.content.endsWith(' '))))) {
        astcur.content.push(token)
      }
      else {
        astcur.content.push({
          type: 'error'
          ,location: token.location
          ,content: token.content
        })
      }
    }
    else {
      astcur.location[1] = token.location[1]
      astcur.content.push(token)
    }
    return undefined
  })
  // Close all tags (location). Remember we start at 1 bc root is just a container
  for (let i = 1; i < stack.length; i++) {
    stack[i].location[1] = astcur.location[1]
  }
  if (mediaStateOpened) {
    // FIXME make sure this makes sense
    const openMedia = astcur.content[astcur.content.length - 1]
    if (openMedia.type === 'openmedia') {
      const errorAst = {
        type: 'error'
        ,content: `[${mediaStateOpened.tag}]${mediaStateOpened.content}`
        ,location: mediaStateOpened.location
      }
      astcur.content.pop()
      astcur.content.push(errorAst)
    }
    const errorMediaCloseAst = {
      type: 'error'
      ,content: `[/${mediaStateOpened.tag}]` // FIXME should I use token or doErrornousMediaClose location>

      ,location: mediaStateOpened.location
    }
    // astcur.location[1] = token.location[1]
    astcur.content.push(errorMediaCloseAst)
    mediaStateOpened = undefined
  }
  // stack.splice(start, end) not needed
  return astroot[0].content
  /* eslint-enable prefer-destructuring */
}
function simpleAstTrim(ast) {
  let contentStartIndex = ast.findIndex(e => !(e.type === 'linebreak'
        || ((e.type === 'text' || e.type === 'error') && e.content.match(/^ +$/))))
  if (contentStartIndex === -1) contentStartIndex = 0
  let contentEndIndex = ast.slice().reverse().findIndex(e => !(e.type === 'linebreak'
        || ((e.type === 'text' || e.type === 'error') && e.content.match(/^ +$/))))
  if (contentEndIndex === -1) contentEndIndex = 0
  else contentEndIndex = ast.length - contentEndIndex
  return ast.slice(contentStartIndex ,contentEndIndex)
}
function bbcodeTokenizer() {
  if (generatedBBCodePegParser) return generatedBBCodePegParser
  generatedBBCodePegParser = peg.generate(String.raw`
start = tokens:Expressions? {return tokens}
Expressions = tokens:Expression+ {
  return tokens
}
Expression = res:(OpenTag / OpenMediaTag / OpenDataTag / CloseTag / PrefixTag / LineBreak / ImplicitLinkLoose / Text )
/*head:Term tail:(_ ("+" / "-") _ Term)* {
      return tail.reduce(function(result, element) {
        if (element[1] === "+") { return result + element[3]; }
        if (element[1] === "-") { return result - element[3]; }
      }, head);
    }
*/
Tag = tag:(OpenCloseTag / PrefixTag) {return tag}
OpenCloseTag = open:(OpenCloseNormalTag / OpenCloseMediaTag) {
    return {type:open.tag, data:open.attr, content}
}
OpenCloseMediaTag = open:OpenMediaTag content:Expression? close:CloseTag?
  &{
    let hasClose = close != null
    if (false && hasClose && open.tag != close.tag) {
      throw new Error(
          "Expected [/" + open.tag + "] but [/" + close.tag + "] found."
      );
    }
    return true
} {
    return {type:open.tag, content: open.content}
}
OpenCloseNormalTag = open:(OpenTag / OpenDataTag) content:Expression? close:CloseTag?
  &{
    let hasClose = close != null
    if (false && hasClose && open.tag != close.tag) {
      throw new Error(
          "Expected [/" + open.tag + "] but [/" + close.tag + "] found."
      );
    }
    return true
} {
    return {type:open.tag, data:open.attr, content}
}
PrefixTag = "[" tag:PrefixTagList "]" { return {type:"prefix", tag:tag, location:[location().start.offset,location().end.offset]} }

// PrefixTag = "[" tag:PrefixTagList "]" content:(!("[/" ListTags "]" / LineBreak ) .)* { return {type:tag,unparsed:content.join('')} }

ListTags = "list" / "ul" / "ol" / "li"

NormalTagList = "list" / "spoiler" / "center" / "code" / "quote" /  "sub" / "sup" / "left" / "right" / "ol" / "ul" / "h1" / "h2" / "h3" / "h4" / "hr" / "h" / "b" / "s" / "i" / "u"
MediaTagList = "img"
DataTagList = "url"
PrefixTagList = "*"

Data
  = text:(!"]". Data?) {
  /*if(text[2] != null) {
    return {type: "data", content:text[1] + text[2].content }
  }
  return {type: "data", content:text[1] }
  */
  if(text[2] != null) {
    return text[1] + text[2]
  }
  return text[1]
}
OpenTag = "[" tag:NormalTagList "]" { return {type:"open", tag:tag, location:[location().start.offset,location().end.offset] } }
// content:ExplicitLinkLoose
OpenMediaTag = "[" tag:MediaTagList "]" { return {type:"openmedia", tag:tag, location:[location().start.offset,location().end.offset] } }
AttrTagProxy = "=" attr:ExplicitLinkLoose {return attr.content}
OpenDataTag = "[" tag:DataTagList attr:AttrTagProxy  "]" { return {type:"opendata", tag:tag,attr:attr, location:[location().start.offset,location().end.offset]} }

CloseTag = "[/" tag:(DataTagList / MediaTagList / NormalTagList / PrefixTagList ) "]" { return {type:"close", tag:tag, location:[location().start.offset,location().end.offset]} }

// FIXME find actual values
// Explicit URL Links. Regex is something like [a-zA-Z0-9<LOTS OF SPECIAL CHARS>]://[a-zA-Z0-9]
ExplicitLinkAddressStrict
  = text:(!([ \t\n\r\[\]]). ExplicitLinkAddressStrict?)
   {
    return text.join('')
  }
ExplicitLinkProtoStrict
  = text:([a-zA-Z0-9]+)
   {
    return text.join('')
  }
ExplicitLinkStrict
  = text:(ExplicitLinkProtoStrict "://" ExplicitLinkAddressStrict) !([ \t\n\r])
   {
    return {type: "link", content:text.join(''), location:[location().start.offset,location().end.offset] }
  }
ExplicitLinkAddressLoose
  = text:(!([ \t\n\r\[\]]). ExplicitLinkAddressLoose?)
   {
    return text.join('')
  }
ExplicitLinkProtoLoose
  = text:(!([ \t\n\r\[\]\:\/]). ExplicitLinkProtoLoose?)
   {
    return text.join('')
  }
ExplicitLinkLoose
  = text:(ExplicitLinkProtoLoose "://" ExplicitLinkAddressLoose) !([ \t\n\r])
   {
    return {type: "link", content:text.join(''), location:[location().start.offset,location().end.offset] }
  }
// Implicit URL links. At least these are valid. (http|ftp)s?://[a-zA-Z0-9./\-%"':@+]+
ImplicitLinkAddressStrict
  = text:[a-zA-Z0-9./\-%"':@+]+
   {
    return text.join('')
  }
ImplicitLinkStrict
  = text:(
    ("http" / "ftp") "s"?
    "://" ImplicitLinkAddressStrict) !([^ \t\n\r])
   {
    return {type: "link", content:text.join(''), location:[location().start.offset,location().end.offset] }
  }
ImplicitLinkAddressLoose
  = text:(!([ \t\n\r\[\]]). ImplicitLinkAddressLoose?)
   {
    return text.join('')
  }
ImplicitLinkLoose
  = text:(
    ("http" / "ftp") "s"?
    "://" ImplicitLinkAddressLoose) !([^ \t\n\r])
   {
    return {type: "link", content:text.join(''), location:[location().start.offset,location().end.offset] }
  }
Text
  = text:(!(Tag / CloseTag / LineBreak / ImplicitLinkLoose). Text?) {
  if(text[2] != null) {
    return {type: "text", content:text[1] + text[2].content, location:[location().start.offset,text[2].location[1]] }
  }
  return {type: "text", content:text[1], location:[location().start.offset,location().end.offset] }
}
Word
  = text:(!(Tag / CloseTag / LineBreak / " "). Word?) {
  if(text[2] != null) {
    return {type: "word", content:text[1] + text[2].content, location:[location().start.offset,text[2].location[1]] }
  }
  return {type: "word", content:text[1], location:[location().start.offset,location().end.offset] }
}
Space
  = text:(" "+) {
  return {type: "space", content:text.join(''), location:[location().start.offset,location().end.offset] }
}
ContiguousText
  = text:(!(Tag / CloseTag / LineBreak / _ ). ContiguousText?) {
  if(text[2] != null) {
    return {type: "text", content:text[1] + text[2].content, location:[location().start.offset,text[2].location[1]] }
  }
  return {type: "text", content:text[1], location:[location().start.offset,location().end.offset] }
}
LineBreak
  = [\n] {
  return {type: "linebreak", location:[location().start.offset,location().end.offset] }
}
ErrorCatcher
  = errTxt:. {return {type: "error", content: errTxt, location:[location().start.offset,location().end.offset]} }

_ "whitespace"
  = [ \t\n\r]*



`)
  return generatedBBCodePegParser
}
// New steps:
// PegSimpleAST -> AST_WithHTML
// AST_WithHTML + cursor_location -> HtmlElement
// AST_WithHTML + text_change_location_and_range + all_text -> LocalAST_WithHTML_OfChange + local_ast_text_range -> LocalAST_WithHTML -> HtmlElement
function astToHtmlAst(ast) {
  if (ast == null) {
    return []
  }
  if (typeof (ast) !== 'object') {
    // This should never happen
    return []
  }
  function appendText(accum ,htmlAst ,otext) {
    // MD Single spacing
    // FIXME do this in parser
    // let text = otext.replace(/^\n +/ ,'\n')
    // text = otext.replace(/^ +/ ,'')
    if (accum[accum.length - 1]
            && accum[accum.length - 1].element.nodeType === document.TEXT_NODE) {
      /* eslint-disable-next-line no-param-reassign */
      let text = accum[accum.length - 1].element.nodeValue + otext
      text = text.replace(/^\n[ \t]+/ ,'\n')
      text = text.replace(/[ \t]+/g ,' ')
      accum[accum.length - 1].element.nodeValue = text
      return undefined
    }
    const text = otext.replace(/[ \t]+/g ,' ')
    accum.push({
      type: 'text'
      ,element: document.createTextNode(text)
      ,location: htmlAst.location
    })
    return undefined
  }
  const res = ast.reduce((accum ,e) => {
    if (e.type === 'text') {
      appendText(accum ,e ,e.content)
    }
    else if (e.type === 'linebreak') {
      const brAst = {
        element: document.createElement('br')
        ,location: e.location
        ,type: 'container'
        ,contains: []
      }
      accum.push(brAst)
      // NOTE: Why? No clue what the goal was with this, but it is how md does it
      // FIXME prefer br element for scroll
      const newlineTextNode = {
        element: document.createTextNode('\n')
        ,location: e.location
        ,type: 'container'
        ,contains: []
      }
      accum.push(newlineTextNode)
    }
    else if (e.type === 'error') {
      appendText(accum ,e ,e.content)
    }
    else if (e.type === 'link') {
      // accum += `<a href="${e.data}" target="_blank">${pegAstToHtml(e.content)}</a>`
      const linkAst = {
        element: document.createElement('a')
        ,location: e.location
        ,type: 'container'
        ,contains: []
      }
      const linkTextAst = {
        element: document.createTextNode(e.content)
        ,location: e.location
        ,type: 'container'
        ,contains: []
      }
      accum.push(linkAst)
      linkAst.element.target = '_blank'
      linkAst.element.rel = 'nofollow'
      if (e.content) {
        linkAst.element.href = e.content
      }
      linkAst.contains.push(linkTextAst)
      linkAst.contains.forEach((childAstElement) => {
        linkAst.element.appendChild(childAstElement.element)
      })
    }
    else if (e.type === 'openmedia') {
      // FIXME should Only pass url via image when parsing
      const imageCacheEntry = getImgForURL(e.content)
      const element = {
        element: imageCacheEntry.element
        ,location: e.location
        ,type: 'image'
        ,imagePromise: imageCacheEntry.loadPromise.then(() => e.content)
      }
      element.element.classList.add('align-bottom')
      element.element.style.maxWidth = '100%'
      // FIXME Do not do this. Move away from isEqualNode which cares about this space instead
      // Why does .style sometimes add the space on its own? are you screwing with me?
      const styleAttr = element.element.attributes.getNamedItem('style')
      if (styleAttr) styleAttr.value = `${styleAttr.value.trim()} `
      // element.element.src=LOADING_IMG
      accum.push(element)
    }
    // Everything after this must have a tag attribute!
    // not nesting to avoid right shift
    else if (!(e.type === 'open' || e.type === 'prefix' || e.type === 'opendata')) {
      // @ts-ignore: Not a string, but doesn't need to be. Make or edit type
      throw new Error({
        message: 'Unknown AST recieved!' ,child_ast: e ,container_ast: ast
      })
    }
    else if (e.tag === 'u' || e.tag === 's' || e.tag === 'sub'
            || e.tag === 'sup' || e.tag === 'ol' || e.tag === 'code'
            || e.tag === 'h1' || e.tag === 'h2' || e.tag === 'h3'
            || e.tag === 'h4' || e.tag === 'h5' || e.tag === 'h6') {
      const element = {
        element: document.createElement(e.tag)
        ,location: e.location
        ,type: 'container'
        ,contains: []
      }
      accum.push(element)
      element.contains = astToHtmlAst(e.content)
      element.contains.forEach((childAstElement) => {
        element.element.appendChild(childAstElement.element)
      })
    }
    else if (e.tag === 'list' || e.tag === 'ul') {
      const element = {
        element: document.createElement('ul')
        ,location: e.location
        ,type: 'container'
        ,contains: []
      }
      accum.push(element)
      element.contains = astToHtmlAst(e.content)
      element.contains.forEach((childAstElement) => {
        element.element.appendChild(childAstElement.element)
      })
    }
    else if (e.tag === 'hr') {
      const element = {
        element: document.createElement(e.tag)
        ,location: e.location
        ,type: 'container'
        ,contains: []
      }
      accum.push(element)
      // FIXME Contain children, in a non nested fashion
      // element.contains=astToHtmlAst(e.content)
      astToHtmlAst(e.content).forEach((childAstElement) => {
        accum.push(childAstElement)
      })
    }
    else if (e.tag === 'b') {
      const element = {
        element: document.createElement('strong')
        ,location: e.location
        ,type: 'container'
        ,contains: []
      }
      accum.push(element)
      element.contains = astToHtmlAst(e.content)
      element.contains.forEach((childAstElement) => {
        element.element.appendChild(childAstElement.element)
      })
    }
    else if (e.tag === 'i') {
      const element = {
        element: document.createElement('em')
        ,location: e.location
        ,type: 'container'
        ,contains: []
      }
      accum.push(element)
      element.contains = astToHtmlAst(e.content)
      element.contains.forEach((childAstElement) => {
        element.element.appendChild(childAstElement.element)
      })
    }
    else if (e.tag === 'h') {
      const element = {
        element: document.createElement('mark')
        ,location: e.location
        ,type: 'container'
        ,contains: []
      }
      accum.push(element)
      element.contains = astToHtmlAst(e.content)
      element.contains.forEach((childAstElement) => {
        element.element.appendChild(childAstElement.element)
      })
    }
    else if (e.tag === 'url') {
      // accum += `<a href="${e.data}" target="_blank">${pegAstToHtml(e.content)}</a>`
      const element = {
        element: document.createElement('a')
        ,location: e.location
        ,type: 'container'
        ,contains: []
      }
      accum.push(element)
      element.element.target = '_blank'
      if (e.data) {
        element.element.href = e.data
      }
      element.contains = astToHtmlAst(e.content)
      element.contains.forEach((childAstElement) => {
        element.element.appendChild(childAstElement.element)
      })
    }
    else if (e.tag === 'quote') {
      const element = {
        element: document.createElement('div')
        ,location: e.location
        ,type: 'container'
        ,contains: []
      }
      accum.push(element)
      element.element.style.width = '100%'
      element.element.style.display = 'inline-block'
      // FIXME dont use isEqualNode. Fix this compare (style uses 0px automaticly on ff)
      const styleAttr = element.element.attributes.getNamedItem('style')
      if (styleAttr) styleAttr.value += ' margin: 1em 0;'
      else element.element.style.margin = '1em 0'
      element.element.classList.add('well' ,'well-sm')
      element.contains = astToHtmlAst(e.content)
      element.contains.forEach((childAstElement) => {
        element.element.appendChild(childAstElement.element)
      })
    }
    else if (e.tag === 'spoiler') {
      const button = {
        element: document.createElement('button')
        ,location: e.location
        ,type: 'container'
        ,contains: []
      }
      button.element.textContent = 'Spoiler'
      button.element.classList.add('btn' ,'btn-sm' ,'btn-warning' ,'btn-spoiler')
      button.element.type = 'button'
      accum.push(button)
      const element = {
        element: document.createElement('div')
        ,location: e.location
        ,type: 'container'
        ,contains: []
      }
      accum.push(element)
      element.element.classList.add('spoiler' ,'display-none')
      element.contains = astToHtmlAst(e.content)
      // FIXME: [spoiler] and [/spoiler] should scroll to button. set inner location.
      // didnt work though... as if btn location wasnt set exits
      // if (element.contains[0]) {
      //  element.location[0] = element.contains[0].location[0]
      //  element.location[1] = element.contains[element.contains.length - 1].location[1]
      // }
      element.contains.forEach((childAstElement) => {
        element.element.appendChild(childAstElement.element)
      })
      // NOTE: The world was fixed and mended together! This might be equivilent now
      /* In a perfect world. it would work like this... but md is a bit broken
            ;(button.element as HTMLButtonElement).addEventListener('click',()=>{
              ;(element.element as HTMLDivElement).classList.toggle('display-none')
            })
            Code to do this is afer makepreview, to ensure buggieness is preserved */
    }
    else if (e.tag === 'center' || e.tag === 'left' || e.tag === 'right') {
      // accum += `<p class="text-center">${pegAstToHtml(e.content)}</p>`
      const element = {
        element: document.createElement('div')
        ,location: e.location
        ,type: 'container'
        ,contains: []
      }
      accum.push(element)
      element.element.classList.add(`text-${e.tag}`)
      element.contains = astToHtmlAst(e.content)
      element.contains.forEach((childAstElement) => {
        element.element.appendChild(childAstElement.element)
      })
    }
    else if (e.tag === '*') {
      const element = {
        element: document.createElement('li')
        ,location: e.location
        ,type: 'container'
        ,contains: []
      }
      accum.push(element)
      element.contains = astToHtmlAst(e.content)
      element.contains.forEach((childAstElement) => {
        element.element.appendChild(childAstElement.element)
      })
    }
    else if (e.content != null) {
      // FIXME? Is this possible? Root?
      astToHtmlAst(e.content).forEach((childAstElement) => {
        accum.push(childAstElement)
      })
    }
    else {
      // FIXME: Does this even happen?
      throw Error(`Recieved unknown and unhandeled ast entry '${JSON.stringify(e)}'`)
      /* accum.push({
              type: 'text'
              ,element: document.createTextNode(e.content)
              ,location: e.location
            }) */
    }
    return accum
  } ,[])
  /* TODO: Implement bi-directional scrolling. scroll textarea to current visible content
    res.filter(e => e.element.nodeName.toLowerCase() !== 'button')
      .forEach((e) => {
        e.element.addEventListener('click' ,() => {
          selectTextAreaPosition(e.location[0])
        })
      }) */
  return res
}
/* *********************************************
 * Validate Result
 ********************************************* */
function comparePreviewToPost(previewAst ,post) {
  // FIXME work with image blob src
  if (previewAst.length !== post.childNodes.length) {
    console.warn(`Preview children count ${previewAst.length} does not match Post children count ${post.childNodes.length} for post #${post.parentElement.parentElement.id}`)
    console.warn(previewAst)
    return false
  }
  const invalidAstKey = previewAst.findIndex((childAst ,key) => {
    if (!post.childNodes[key].isEqualNode(childAst.element)) {
      return true
    }
    return false
  })
  if (invalidAstKey !== -1) {
    console.warn(`Preview did NOT match post #${post.parentElement.parentElement.id}!`)
    console.warn('Ast Elm')
    console.warn(previewAst[invalidAstKey].element)
    console.warn('Post Elm')
    console.warn(post.childNodes[invalidAstKey])
    return false
  }
  return true
}
/* *********************************************
 * Build Interface
 ********************************************* */
function makePreview(txt) {
  // TODO compare bbcode to old BBCode
  // generate tokens and only for changed region
  // replace changed region html
  const astHtml = astToHtmlAst(simpleAstTrim(tokensToSimpleAST(bbcodeTokenizer().parse(txt))))
  const previewDiv = document.createElement('div')
  previewDiv.style.flexGrow = '1'
  astHtml.forEach(e => previewDiv.appendChild(e.element))
  // Conform to MD style
  previewDiv.classList.add('postbody' ,'mb-3' ,'mt-4')
  // FIXME: Ensure this is equivilent
  // Threads get wordWrap from tr.post
  // Profile gets it from card
  // Not sure why word break is needed, since I don't see it in md's css
  previewDiv.style.wordWrap = 'break-word'
  // previewDiv.style.overflowWrap = 'break-word'
  previewDiv.style.wordBreak = 'break-word'
  return [previewDiv ,astHtml]
}
function createPreviewCallbacks() {
  const nav = document.querySelector('nav.navbar.fixed-top')
  // @ts-ignore
  let navY
  if (nav === null) {
    navY = 0
  }
  else if (nav.getBoxQuads !== undefined) {
    navY = nav.getBoxQuads()[0].p3.y
  }
  else {
    navY = nav.getBoundingClientRect().height
  }
  const navHeight = navY
  // let image_buffers: Map<string, Blob>
  let forms = Object.values(document.querySelectorAll('.post_edit_form'))
  forms = forms.concat(Object.values(document.querySelectorAll('#post_reply_form')))
  forms = forms.concat(Object.values(document.querySelectorAll('#change_profile_form, #start_thread_form')))
  forms.forEach((forum) => {
    // Try to make it side by side
    // e.parentElement.parentElement.insertBefore(previewDiv,e.parentElement)
    // e.parentElement.classList.add("sticky-top", "pt-5", "col-6")
    const textarea = (forum.querySelector('textarea'))
    if (!textarea) {
      // FIXME throw errors. Kind of want to short circit this one though
      return Error('Failed to find text area for forum')
    }
    // Setup variables
    let curDisplayedVersion = 0
    let nextVersion = 1
    let updateTimeout
    let updateTimeoutDelay = 50
    const maxAcceptableDelay = 10000
    const useFallbackPreview = false
    // Prepare form
    if (!forum.parentElement) {
      return undefined
    }
    // Setup our custom styles
    /* eslint-disable no-param-reassign */
    forum.parentElement.style.alignItems = 'flex-start'
    forum.parentElement.classList.add('d-flex')
    forum.parentElement.style.flexDirection = 'row-reverse'
    forum.style.position = 'sticky'
    forum.style.top = '0px'
    // Causes buttons to wrap on resize
    forum.style.width = 'min-content'
    // Padding keeps us from hitting the navbar. Margin lines us back up with the preview
    forum.style.paddingTop = `${navHeight}px`
    forum.style.marginTop = `-${navHeight}px`
    /* eslint-enable no-param-reassign */
    textarea.style.resize = 'both'
    // FIXME set textarea maxheight. form should be 100vh max.
    textarea.style.minWidth = '120px'
    textarea.style.width = '25vw'
    textarea.style.paddingLeft = '0'
    textarea.style.paddingRight = '0'
    // Make Initial Preview
    // FIXME use Update preview for initial preview as well
    let [previewDiv ,astHtml] = makePreview(textarea.value)
    forum.parentElement.insertBefore(previewDiv ,forum)
    // Run sanity check if in console mode
    if (!isUserscript && forum.classList.contains('post_edit_form')) {
      const post = document.querySelector(`#post_${forum.id} .postbody`)
      if (post) comparePreviewToPost(astHtml ,post)
    }
    // Move editor to left column if in a thread.
    const tableLeft = forum.parentElement.parentElement.firstElementChild
    if (tableLeft !== forum.parentElement) {
      if (tableLeft.firstChild.nodeName.toLowerCase() === 'img') {
        // We are a thread post! Lets integrate into the thread
        tableLeft.firstChild.remove()
        tableLeft.appendChild(forum)
        // Conform to MD thread post style
        forum.parentElement.classList.remove('p-3')
        forum.parentElement.classList.add('pb-3')
        forum.parentElement.parentElement.classList.add('post')
        // FIXME: Profile page also needs formating.
        // md's wordWrap is break-word, but it seems to
        // be acting like wordwrap: anywhere for some reason.
      }
      else {
        // Add padding to new posts and profile, so the preview doesn't touch
        // textarea the border
        forum.classList.add('pr-3')
        // Fixes profile interface overlap problem
        if (forum.id === 'change_profile_form') {
          textarea.parentElement.style.flexBasis = '100%'
          textarea.parentElement.style.maxWidth = '100%'
        }
        // FIXME: d-flex is causing preview to affect settings tabs
        // other than the profile tab. Making the entire preview
        // an invisible block that fills the page
        // invisible links can be accidently clicked on as well
      }
    }
    let currentSpoiler
    function searchAst(ast ,cpos) {
      // slice bc reverse is in place
      const a = ast.slice().reverse().find(e => e.location[0] <= cpos && cpos <= e.location[1])
      if (a) {
        if (a.type === 'container') {
          // unhide spoilers
          // Ensure we are not a Text node and that we are a spoiler
          if (!currentSpoiler && a.element.nodeType !== 3
                        && a.element.classList.contains('spoiler')
                        && a.element.style.display !== 'block') {
            currentSpoiler = a.element
            currentSpoiler.style.display = 'block'
          }
          const b = searchAst(a.contains ,cpos)
          if (b) {
            return b
          }
        }
        return a.element
      }
      return undefined
    }
    // Auto scroll into view
    function scrollToPos(pos = textarea.selectionStart) {
      // Hide previous spoiler
      if (currentSpoiler) {
        currentSpoiler.style.display = 'none'
        currentSpoiler = undefined
      }
      // Get element from ast that starts closest to pos
      const elm = searchAst(astHtml ,pos)
      if (elm) {
        // FIXME Scroll pos is a bit hard to find.
        // getBoxQuads, getClientRect, getBoundingClientRect all give the offset from the viewport
        // Height of child elements not calculated in...
        // SAFE for (text)nodes?, not safe for elements with nested content
        if (elm.nodeType === 3) {
          // @ts-ignore
          let y
          if (elm.getBoxQuads !== undefined) {
            y = elm.getBoxQuads()[0].p1.y
          }
          else {
            // if we do not have getBoxQuads, we will have to test from the
            // container element instead of the text node;
            y = elm.parentElement.getBoundingClientRect().top
          }
          // FIXME. Must be a better way to scroll (especialy in case of nested scroll frames)
          // Scroll to top
          document.scrollingElement.scrollBy(0 ,y)
        }
        else {
          // FIXME. Must be a better way to scroll (especialy in case of nested scroll frames)
          // Scroll to ~ center directly
          // const y: number = (elm as HTMLElement).offsetTop
          // document.scrollingElement!.scrollTo({top:y})
          // Scroll to top
          elm.scrollIntoView()
        }
        // Scroll out of nav
        document.scrollingElement.scrollBy(0 ,-navHeight)
        // Add this line to scroll to center
        // document.scrollingElement!.scrollBy(0,-(window.innerHeight-navHeight)/2)
        // Finally, ensure we keep the textarea in view
        const bound = forum.getBoundingClientRect()
        // document.scrollingElement!.scrollBy(0,bound.bottom - bound.height)
        document.scrollingElement.scrollBy(0 ,bound.top)
      }
    }
    textarea.addEventListener('selectionchange' ,() => {
      // Only autoscroll if our ast is in sync with the preview.
      if (curDisplayedVersion === nextVersion - 1
                && astHtml[astHtml.length - 1] != null
                && astHtml[astHtml.length - 1].location[1] === textarea.value.length) {
        scrollToPos()
      }
    })
    function UpdatePreview() {
      // Measure load speed. Used for setting update delay dynamicly.
      const startTime = Date.now()
      // Create a preview buffer
      const thisVersion = nextVersion++
      const [newPreview ,newAstHtml] = makePreview(textarea.value)
      // Setup spoilers the same way md does
      $(newPreview).find('.btn-spoiler').click(function spoilerButton() {
        // @ts-ignore
        $(this).next('.spoiler').toggle()
      })
      // previewDiv, astHtml
      const imgLoadPromises = []
      Object.values(newPreview.querySelectorAll('img')).forEach((img) => {
        imgLoadPromises.push(new Promise((resolve) => {
          img.addEventListener('load' ,resolve)
          // Errors dont really matter to us
          img.addEventListener('error' ,resolve)
          // Esure we are not already done
          if (img.complete) {
            resolve()
          }
        }))
      })
      // Wait for all images to load or error (size calculations needed) before we swap and rescroll
      // This is the part that actualy updates the preview
      Promise.all(imgLoadPromises).then(() => {
        const endTime = Date.now()
        const updateLoadDelay = endTime - startTime
        if (!useFallbackPreview && updateLoadDelay > maxAcceptableDelay) {
          // NOTE: Fallback preview removed. Focusing on speed improvments of normal preview
          // useFallbackPreview = true
          // dbg(`It took ${updateLoadDelay} milli to update. Max acceptable delay was ${maxAcceptableDelay}! Switching to fallback preview!`)
          // We intentionally do not update the timout delay when we swap to fallback preview
        }
        else {
          // average out the times
          updateTimeoutDelay = (updateTimeoutDelay + updateLoadDelay) / 2
          // dbg(`It took ${updateLoadDelay} milli to update. Changing delay to ${updateTimeoutDelay} `)
        }
        // Return if we are older than cur preview
        if (thisVersion < curDisplayedVersion) {
          newPreview.remove()
          return
        }
        curDisplayedVersion = thisVersion
        // Replace the Preview with the buffered content
        previewDiv.parentElement.insertBefore(newPreview ,previewDiv)
        previewDiv.remove()
        previewDiv = newPreview
        astHtml = newAstHtml
        // Scroll to position
        scrollToPos()
      })
    }
    function UpdatePreviewProxy() {
      // dbg(`Reseting timeout with delay ${updateTimeoutDelay} `)
      clearTimeout(updateTimeout)
      updateTimeout = setTimeout(UpdatePreview ,updateTimeoutDelay)
    }
    const buttons = Object.values(forum.querySelectorAll('button'))
    buttons.forEach((btn) => {
      btn.addEventListener('click' ,UpdatePreviewProxy)
    })
    textarea.oninput = UpdatePreviewProxy
    return undefined
  })
}
/* *************************************
 * Run It!
 ************************************* */
if (isUserscript) createPreviewCallbacks()
else {
  // Import and wait for PegJS
  // then createPreviewCallbacks()
  loadScript('https://gitcdn.xyz/cdn/pegjs/pegjs/0b102d29a86254a50275b900706098aeca349740/website/vendor/pegjs/peg.js')
    .then(() => {
      createPreviewCallbacks()
    })
}
