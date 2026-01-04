// ==UserScript==
// @name         bilibili copy comment link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  b站评论留档链接生成
// @author       Rain
// @match        https://t.bilibili.com/*
// @license      GNU General Public License v3.0
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/453594/bilibili%20copy%20comment%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/453594/bilibili%20copy%20comment%20link.meta.js
// ==/UserScript==

window.addEventListener('load', () => {
    console.log("test")
    var url = window.location.href;
    //console.log(url)
    var reg1 =new RegExp("https://t.bilibili.com/[0-9].*")  //dynamic
    var reg2 = new RegExp("https://www.bilibili.com/video/.*") 
    const DEBUG = true;
    function debug(description = '', msg = '', force = false) {
        if (DEBUG || force) {
          console.log(`${description}`, msg)
        }
      }
    function attachEl(item) {
      let injectWrap = item.querySelector('.con .info');

         if(url.match(reg2)) injectWrap = item.querySelector('.root-reply-container .content-warp .root-reply .reply-info') 
         if(url.match(reg2)) console.log("NULL")
    
        // .text - comment content
        // .text-con - reply content
        //let content = item.querySelector('.con .text') || item.querySelector('.reply-con .text-con');
        //let id = item.dataset.id;
    
        // Simple way to attach element on replies initially loaded with comment
        // which wouldn't trigger mutation inside observeComments
        let replies = item.querySelectorAll('.con .reply-box .reply-item');
        if (replies.length > 0) {
          [...replies].map(reply => {
            attachEl(reply);
          });
        }
        
        if (injectWrap.querySelector('.asoulcnki')) {
          debug('already loaded for this comment');
        } else {
                // Insert asoulcnki check button
                let copyButton = document.createElement('span');

                copyButton.classList.add('asoulcnki', 'btn-hover', 'btn-highlight');
                copyButton.innerHTML = '复制链接';
                let oid = ""
                let root = ""
                //prepare url
                  var pageType = "17"
                  if(url.match(reg1)) {
                    let mrShow = item.getAttribute('mr-show')
                    //let obj = eval(mrShow
                    let jsonTmp = JSON.stringify(mrShow) //convert to string
                    if(mrShow) console.log(jsonTmp)
                    var index = jsonTmp.indexOf("oid")
                    console.log(index)
                    for(var i = index+ 8;i < jsonTmp.length; i ++) {
                      if(isNaN(jsonTmp[i])) break
                      oid += jsonTmp[i]
                    }
                    console.log(oid) 
                    // let reg = /\d+/
                    // var o = reg.exec(url)
                    // console.log(o[0])
                    //oid = o[0]
                    root = item.getAttribute('data-id')
                    console.log("root in reg1")
                    
                } else if(url.match(reg2)) {
                  // refer to https://www.zhihu.com/question/381784377/answer/1099438784
                  var regUrl = new RegExp("https://www.bilibili.com/video/BV(.*)/.*") 
                  var o = regUrl.exec(url)
                 // oid = 0[0]
                  
                    const bv2av = bv => {
                      if (!bv) return;
                      
                      const pos = [11, 10, 3, 8, 4, 6];
                      const base = 'fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF';
                      const table = {};
                      for (let i = 0; i < base.length; i++) table[base[i]] = i;

                      let r = 0;
                      for (let i = 0; i < pos.length; i++) r += table[bv[pos[i]]] * 58 ** i;
                      return (r - 8728348608) ^ 177451812;
                  };
                  
                  let tmp = item.querySelector('.root-reply-container .root-reply-avatar')
                  root = tmp.getAttribute('data-root-reply-id')
                  oid = bv2av(o[0])
                  console.log("av: ",oid)
                  pageType = "1"
                }
                copyButton.addEventListener('click', e => {
                

                var commentUrl = "https://www.bilibili.com/h5/comment/sub?oid=" + oid + "&pageType="+pageType + "&root="+root
                navigator.clipboard.writeText(commentUrl)
            })
            //if(url.match(reg1))
            if(url.match(reg1)) injectWrap.querySelector('.operation').before(copyButton);
            else if(url.match(reg2))injectWrap.querySelector('.reply-operation-warp').before(copyButton);

        }
    }

    function observeComments(wrapper) {
        // .comment-list - general list for video, zhuanlan, and dongtai
        // .reply-box - replies attached to specific comment
        let commentLists = wrapper ? wrapper.querySelectorAll('.comment-list, .reply-list') : document.querySelectorAll('.comment-list, .reply-list');
    
        if (commentLists) {
    
          [...commentLists].map(commentList => {
    
            // Directly attach elements for pure static server side rendered comments
            // and replies list. Used by zhuanlan posts with reply hash in URL.
            // TODO: need a better solution
            [...commentList.querySelectorAll('.list-item, .reply-item')].map(item => {  //list item
              attachEl(item);
              //console.log(item)
            });
    
            const observer = new MutationObserver((mutationsList, observer) => {
    
              for (const mutation of mutationsList) {
    
                if (mutation.type === 'childList') {
    
                  //('observed mutations', [...mutation.addedNodes].length);
    
                  [...mutation.addedNodes].map(item => {
                    attachEl(item);
    
                    // Check if the comment has replies
                    // I check replies here to make sure I can disable subtree option for
                    // MutationObserver to get better performance.
                    let replies = item.querySelectorAll('.con .reply-box .reply-item');
    
                    if (replies.length > 0) {
                      observeComments(item)
                     // debug(item.dataset.id + ' has rendered reply(ies)', replies.length);
                    }
                  })
                }
              }
            });
            observer.observe(commentList, { attributes: false, childList: true, subtree: false });
          });
        }
      }
      observeComments();
    const wrapperObserver = new MutationObserver((mutationsList, observer) => {

        for (const mutation of mutationsList) {
    
          if (mutation.type === 'childList') {
    
            [...mutation.addedNodes].map(item => {
              //debug('mutation wrapper added', item);
    
              if (item.classList?.contains('bb-comment')) {
                //debug('mutation wrapper added (found target)', item);
    
                observeComments(item);
    
                // Stop observing
                // TODO: when observer stops it won't work for dynamic homepage ie. https://space.bilibili.com/703007996/dynamic
                // so disable it here. This may have some performance impact on low-end machines.
                // wrapperObserver.disconnect();
              }
            })
          }
        }
      });
      wrapperObserver.observe(document.body, { attributes: false, childList: true, subtree: true });


}, false);