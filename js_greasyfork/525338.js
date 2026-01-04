// ==UserScript==
// @name        responsive dcinside
// @namespace   Violentmonkey Scripts
// @match       https://gall.dcinside.com/*board/*
// @grant       none
// @version     2.5
// @author      -
// @license     MIT
// @description 2025. 2. 1.
// @downloadURL https://update.greasyfork.org/scripts/525338/responsive%20dcinside.user.js
// @updateURL https://update.greasyfork.org/scripts/525338/responsive%20dcinside.meta.js
// ==/UserScript==

////////////
// loaded //
////////////

// reset scroll
window.scrollTo(0,0);

// adjust left margin (responsive)
try{
  if (!window.location.href.includes('board/write')){
    // remove unnecessary left margin
    document.getElementById('top').style.margin = '0 -150px'
    document.getElementsByClassName('wrap_inner')[0].style.width = '1160px'
  }
} catch (e) {
  console.error(e);
}

/////////////
// handler //
/////////////

// window resize
var prev = 10000;

window.onload = onLoad
window.onresize = onResize

function onLoad() {
  onResize()
}

function onResize() {
  let w = window.innerWidth

  if ((w < 1200 && prev >= 1200) || (w >= 1200 && prev < 1200)) {
    commonLayout()
    contentLayout()
    commentLayout()
  }

  if ((w < 1200 && prev >= 1200) || (w >= 1200 && prev < 1200) || prev > 9999) {
    writeLayout()
  }

  prev = w
}

// comment loaded, updated
try{
  if (window.location.href.includes('board/view')){
    // resize comment on loading
    new MutationObserver(commentLayout).
    observe(document.querySelector('.comment_wrap'), {
      childList: true,
      subtree: true,
    })
  }
} catch (e) {
  console.error(e);
}

////////////
// common //
////////////

// switch 1160 and 840 layout
function commonLayout() {
  var narrow = window.innerWidth < 1200
  try{
    // header
    document.getElementsByClassName('dchead')[0].style.width            = narrow ? '840px' : '1160px'
    document.getElementsByClassName('dchead')[0].style.paddingRight     = narrow ? '320px' : '0'
    document.getElementsByClassName('area_links')[0].style.paddingRight = narrow ? '320px' : '0'
    document.getElementsByClassName('gnb')[0].style.width               = narrow ? '840px' : '1160px'
    document.getElementsByClassName('gnb')[0].style.paddingRight        = narrow ? '320px' : '0'
    document.getElementsByClassName('gnb_list')[0].style.width          = narrow ? '520px' : '840px'

    document.getElementById('search_wrap').style.left                       = narrow ? '100%' : '50%'
    document.getElementById('search_wrap').style.marginLeft                 = narrow ? '-684px' : '-182px'
    document.getElementsByClassName('visit_bookmark')[0].style.width        = narrow ? '840px' : '1160px'
    document.getElementsByClassName('visit_bookmark')[0].style.paddingRight = narrow ? '320px' : '0'

    // content
    if (!window.location.href.includes('board/write')){
      document.getElementsByClassName('right_content')[0].style.marginTop = narrow ? '-40px' : '0'
    }
  } catch (e) {
    console.error(e)
  }
}

///////////////
// view page //
///////////////

// switch 1160 and 840 layout for content
function contentLayout() {
  if (!window.location.href.includes('board/view')){
    return
  }
  var narrow = window.innerWidth < 1200

  try{
    // change content size
    var sections = document.getElementById('container').children[0].children
    for (let i=0; i<3 && i<sections.length; i++) {
      sections[i].style.width = narrow ? '840px' : '1160px'
    }

    document.getElementsByClassName('write_div')[0].style.width   = narrow ? '840px' : '900px'
  } catch (e) {
    console.error(e);
  }
}

// switch 1160 and 840 layout for comment
function commentLayout() {
  if (!window.location.href.includes('board/view')){
    return
  }
  var narrow = window.innerWidth < 1200

  try{
    var textbox = document.querySelectorAll('.cmt_txtbox')
    for (const e of textbox) {
      e.style.width = narrow ? '500px' : '820px'
    }

    var text = document.getElementsByClassName('usertxt')
    for (const e of text) {
      e.style.width = narrow ? '500px' : '820px'
    }

    var writebox = document.getElementsByClassName('cmt_write')
    for (const e of writebox) {
      currentWidth = e.getElementsByTagName('textarea')[0].clientWidth - 26
      if(narrow && currentWidth > 700){
        e.getElementsByTagName('textarea')[0].style.width = (currentWidth - 320) +'px'
      }
      if(!narrow && currentWidth < 700){
        e.getElementsByTagName('textarea')[0].style.width = (currentWidth + 320) +'px'
      }
    }
  } catch (e) {
    console.error(e);
  }
}

////////////////
// write page //
////////////////


// switch 1160 and 840 layout for write
function writeLayout() {
  if (!window.location.href.includes('board/write')){
    return
  }
  var narrow = window.innerWidth < 1200

  try{
    document.getElementById('top').style.marginLeft  = narrow ? '20px' : 'auto'
    document.getElementById('container').style.width = narrow ? '840px' : '1160px'
    document.getElementById('container').style.marginLeft = narrow ? '0' : 'auto'
    document.getElementsByClassName('gnb_bar')[0].style.marginLeft  = narrow ? '-20px' : '0'
    document.getElementsByClassName('gnb_bar')[0].style.paddingLeft = narrow ? '20px' : '0'

    if (document.getElementsByClassName('write_subject')[0]){
      document.getElementsByClassName('write_subject')[0].style.width  = narrow ? '785px' : '1009px'
    }
    document.getElementById('subject').style.width = narrow ? '772px' : '996px'

    document.getElementById('write_wrap').style.width   = narrow ? '796px' : 'auto'
    document.getElementById('write_wrap').style.padding = narrow ? '20px' : '33px 68px 40px'

    document.getElementsByClassName('note-toolbar')[0].children[0].children[0].style.left = narrow ? '700px' : '940px'
    document.getElementsByClassName('ipt_box')[0].style.width = narrow ? '645px' : '885px'
  } catch (e) {
    console.error(e);
  }
}
