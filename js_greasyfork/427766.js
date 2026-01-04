// ==UserScript==
// @name         Enhancement Userscript for LIHKG
// @version      0.6.3
// @description  An Enhancement Userscript for LIHKG
// @include        /https?\:\/\/lihkg\.com/
// @icon         https://www.google.com/s2/favicons?domain=lihkg.com
// @grant        GM_addStyle
// @license MIT
// @namespace https://greasyfork.org/users/371179
// @downloadURL https://update.greasyfork.org/scripts/427766/Enhancement%20Userscript%20for%20LIHKG.user.js
// @updateURL https://update.greasyfork.org/scripts/427766/Enhancement%20Userscript%20for%20LIHKG.meta.js
// ==/UserScript==
(function() {
    'use strict';

    GM_addStyle([

`
/*
html.skip-drag-upload .EGBBkGyEbfIEpHMLTW84H{
    display:none !important;
}
*/

/* main textarea */
._2ME7dqW8n0YSe687nDnGvI ._3ILx6bqxXMKzVd1P5DRS9F{
    padding-bottom: 40px;
}


/* div 放開圖片即可上載*/
.EGBBkGyEbfIEpHMLTW84H{
    opacity: 1 !important;
    pointer-events: all !important;
    left: 5%;
    right: 5%;
    top: calc(100% - 35px);
    bottom: 0;
    width: auto;
    height: auto;
}

/* div Preview  ~ div + div 放開圖片即可上載*/
._1TdM0E7HcWQwmxXpfa6yJg ~ ._2ME7dqW8n0YSe687nDnGvI .EGBBkGyEbfIEpHMLTW84H{
    visibility: collapse;
}

`,

// css fix for thread posts positioning
`
body ._21IQKhlBjN2jlHS_TVgI3l:after {left:0.4rem}
body ._21IQKhlBjN2jlHS_TVgI3l .vv9keWAXpwoonDah6rSIU ._3D2lzCKDMcdgEkexZrTSUh{margin-left: -6px;width: 16px;}
`,

// css fix for like and dislike due to js hack of like count and dislike count (reply posts)
`
body label[for*="-dislike-like"] {display:inline-block !important;}
body label[for*="-like-like"] {display:inline-block !important;}
body ._3ExaynSI6tUp5h1U50MHtI ._3imUf8qB9LmLpk_t5PjDm4>div:first-child+div:last-child {margin-left:-6px;}
`,

// css fix for like and dislike due to js hack of like count and dislike count (main thread)
// empty full space char for maintaining padding when the count is not yet shown
`
span[data-tip="正評"]:not([data-score])::after{
    content: "　";
    font-size: .6rem;
    font-weight: 400;
    margin-top: .3rem;
}
span[data-tip="負評"]:not([data-score])::after{
    content: "　";
    font-size: .6rem;
    font-weight: 400;
    margin-top: .3rem;
}
span[data-tip="正評"],span[data-tip="負評"]{
    padding-top:0px !important;
}
`,

// kiwi browser css fix
`
@supports not (padding-bottom: env(safe-area-inset-bottom)){
  ._3dwGLtjqTgI2gc9wpc7FuT {
    padding: 1rem .6rem calc(1rem + 0px) calc(.7rem + 0px);
  }
}
`,

// po reply - userselect for icons
`
html body ._1Ku9qL4qhkBDwAgVLYcQdi[class], html body ._1Ku9qL4qhkBDwAgVLYcQdi[class]:hover {
  user-select:none !important;
}
`
].map(x => x.trim()).join('\n'))


    let isNumCheck = function(n) {
        return n > 0 || n < 0 || n === 0
    }
    let postDetails = {}
    let threadDetails = {}
    let pendingRefreshThread = false;

    let testBlockElm = function(elm) {
        if (elm && elm.nodeType == 1) {
            switch (elm.tagName) {
                case 'DIV':
                case 'P':
                case 'BLOCKQUOTE':
                    return true;

                default:
                    return false;

            }

        }
    }


    document.cssAll = function() {
        return [...document.querySelectorAll.apply(this, arguments)]
    }

    function urlConvert(url) {
        let src = url.replace(/\w+\:\/\//, '')
        let replacements = [...src.matchAll(/[\w\.]+/g)].filter((t) => /\./.test(t))
        if (replacements.length > 1) {
            replacements.length--;

        }
        replacements.forEach((s) => {
            src = src.replace(s, '')
        })

        src = src.replace(/\/+/g, '/')

        return src;

    }

    let emoji = {};
    setTimeout(function() {
        console.log(emoji)
    }, 1500)

    setInterval(() => {

        document.cssAll('img[src*="lihkg.com"][alt]:not([title])').forEach(function(imgElm) {
            let src = imgElm.getAttribute('src');
            let erc = urlConvert(src)
            let imgAlt = imgElm.getAttribute('alt') || "";
            if (/^[\x20-\x7E]+$/.test(imgAlt) && /\W/.test(imgAlt)) {
                emoji[erc] = imgAlt.trim()
            }

            imgElm.setAttribute('title', imgAlt)

        })


        document.cssAll('a[href*="profile/"]:not([href*="//"]):not([title])').forEach(function(aElm) {
            aElm.setAttribute('title', aElm.getAttribute('href'))
        })

        document.cssAll('[data-ic~="hkgmoji"]:not([title])>img[src*="lihkg.com"]:not([alt])').forEach(function(imgElm) {
            let src = imgElm.getAttribute('src');
            let erc = urlConvert(src)
            let text = emoji[erc] ? emoji[erc] : "[img]" + erc + "[/img]"
            imgElm.parentNode.setAttribute('title', text)
            imgElm.setAttribute('alt', text)


        })



        document.cssAll('img[src]:not([alt]),img[src][alt=""]').forEach((el) => {

            if (el.getAttribute('alt') || el.getAttribute('title')) return;

            let text = '';
            if (el.tagName.toLowerCase() == 'img' && el.getAttribute('data-original')) {
                text = '[img]' + el.getAttribute('data-original') + '[/img]';
            } else if (el.tagName.toLowerCase() == 'img' && el.getAttribute('src')) {
                text = '[img]' + el.getAttribute('src') + '[/img]';
            }
            if (text) el.setAttribute('alt', text)
            if (text) el.setAttribute('title', text)

        })




        document.cssAll('[data-post-id]:not([hacked])').forEach((el) => {

            el.setAttribute('hacked', 'true');
            let post_id = el.getAttribute('data-post-id');
            if (!post_id) return;

            //console.log(post_id, postDetails)
            let post_detail = postDetails[post_id]
            if (post_detail) {
                // console.log(55,post_detail)

            }

        })



    }, 33)



    function refreshingThreadEvent(thread_id) {


        console.log("refreshingThreadEvent", threadDetails[thread_id])
        if (thread_id && threadDetails[thread_id]) {


            document.cssAll('span[data-tip="正評"]').forEach((elm) => {

                elm.setAttribute('data-score', threadDetails[thread_id]["like_count"]);
                elm.style.paddingTop = '0px';
            })


            document.cssAll('span[data-tip="負評"]').forEach((elm) => {

                elm.setAttribute('data-score', threadDetails[thread_id]["dislike_count"]);
                elm.style.paddingTop = '0px';
            })



        }


    }


    let cid_refreshingThread = 0;

    function refreshingThreadRunning() {

        if (!cid_refreshingThread) return;


        let titlespan = document.cssAll('a[href^="/category/"]+span');
        if (titlespan.length == 1) {
            let titlespanElm = titlespan[0]

            if (!titlespanElm.querySelector('noscript')) {
                titlespanElm.appendChild(document.createElement('noscript'))


                if (pendingRefreshThread) {

                    let thread_id = pendingRefreshThread === true ? (/thread\/(\d+)\//.exec(location + "") || [null, null])[1] : pendingRefreshThread

                    pendingRefreshThread = false;
                    clearInterval(cid_refreshingThread);
                    cid_refreshingThread = 0;
                    refreshingThreadEvent(thread_id)


                }


            }
        }

    }




    let makePlain = false;


    document.addEventListener("dragstart", function(evt) {
        console.log(evt.target)
        if(!evt || !evt.target) return;

        let type = 0
        if(evt.target.nodeType!==1 && evt.target.parentElement/* && evt.target.parentElement.closest('[data-post-id]')*/){
            type=1;
        }

        if(evt.target.nodeType ===1){
        if(!evt.target.matches('img[alt][src][title]'))return;
        let alt = evt.target.getAttribute('alt')+'';
          if(!alt)return;
        if(/https?\:\/\//.test(alt))return;
        if(/^[a-zA-Z0-9]+$/.test(alt))return;
          if(/[\u0100-\uFFFF]/.test(alt))return;
        type = 2;

            console.log(alt)

            evt.dataTransfer.setData('text/plain', alt);

            evt.stopPropagation()
            evt.stopImmediatePropagation();

        }
        if(type>0){
        evt.dropEffect='copy';
            evt.effectAllowed = "all";

        document.documentElement.classList.add('skip-drag-upload')
        }
    }, true);



function makeRangeFromXY(evt){

    let range=null;
    if (document.caretRangeFromPoint) { // Chrome
        range=document.caretRangeFromPoint(evt.clientX,evt.clientY);
    }
    else if (evt.rangeParent) { // Firefox
        range=document.createRange(); range.setStart(evt.rangeParent,evt.rangeOffset);
    }
return range;
}
    document.addEventListener("drop", function(evt) {

        if(!evt || !evt.target)return;

        let node = evt.target;

        if(node.nodeType!==1 && node.parentNode && node.parentNode.nodeType===1) node= node.parentNode;

        if(node.nodeType===1 &&node.closest('div.ProseMirror[contenteditable]')){
            evt.preventDefault();
let range = makeRangeFromXY(evt)
    var sel = window.getSelection();
    sel.removeAllRanges(); sel.addRange(range);

    let p = sel.anchorNode
    while(p&&p.parentNode){
        if(p.nodeType===1&&p.matches('div.ProseMirror[contenteditable]')){
            p.focus();
            p.classList.add('ProseMirror-focused');
        break;
        }
        p=p.parentNode;
    }

            range.collapse(true);

            let text = evt.dataTransfer.getData('text/plain')
    document.execCommand('insertHTML',false,text);

    //sel.removeAllRanges();

            let mRange = window.getSelection().getRangeAt(0);

            mRange.setStart(mRange.endContainer,mRange.endOffset-text.length);
            mRange.setEnd(mRange.endContainer,mRange.endOffset);

         //   nRange.collapse(true);
   // sel.addRange(nRange)


        }

        document.documentElement.classList.remove('skip-drag-upload')

    },true)


    document.addEventListener("dragend", function(evt) {

        document.documentElement.classList.remove('skip-drag-upload')

        let p = document.querySelector('div.EGBBkGyEbfIEpHMLTW84H[style]')
        if(p){
            p.style.opacity='0';
            p.style.pointerEvents='none';
        }

    },true)

/*
    document.addEventListener("dragover", function(evt) {
        if(!evt || !evt.target)return;
        try{

        if(!evt.target.matches('[contenteditable], textarea, div.EGBBkGyEbfIEpHMLTW84H, div._1xaNo-2jhq5KooKoBBRKwe '))return;
        }catch(e){return;}
        console.log(evt)
        evt.stopPropagation();
    }, true);
    */


    let injection = function() {


        function extractRawURL(thumbnailURL) {

            let u = [...thumbnailURL.matchAll(/[\?\&]\w+\=([\x21-\x25\x27-\x3E\x40-\x7E]+)/g)].map(d => d[1])
            if (u.length) {
                let uMaxT = Math.max(...u.map(t => t.length))
                let u0 = u.filter(t => t.length == uMaxT)[0]

                if (u0) {

                    let v0 = null
                    try {
                        v0 = decodeURIComponent(u0)
                    } catch (e) {}
                    //console.log(v0,u0)
                    if (v0) {
                        return v0
                    }

                }
            }
            return null
        }

        if (!JSON._parse && JSON.parse) {
            JSON._parse = JSON.parse
            JSON.parse = function(text, r) {
/*
                if (text && typeof text == "string" && text.indexOf('display_vote') > 0) {
                    text = text.replace(/([\'\"])display_vote[\'\"]\s*:\s*false/gi, '$1display_vote$1:true')
                }
                */
                let res = JSON._parse.apply(this, arguments)

                let contentFix = (resObj) => {
                    if(!resObj || typeof resObj!='object')return;
                    for (let k in resObj) {
                        if (typeof resObj[k] == 'object') contentFix(resObj[k]);
                        else if (k=='display_vote' && resObj[k]===false){
                        resObj[k]=true;
                        }
                        else if (k == 'msg' && typeof resObj[k] == 'string') {

                            let msg = resObj[k];
                            let replace = false;
                            let bmsg=msg
                            msg = msg.replace(/(\<img\s+src\=\")(https?\:\/\/i\.lih\.kg\/thumbnail\?[^\"]+)(\"[^\>]+\>)/g, function(s, a, b, c) {

                                let v0 = extractRawURL(b)
                                if (v0) {
                                    replace = true;
return s.replace(b,v0).replace(b,v0).replace(b,v0)

                                    /*
                                    console.log(v0, b)

                                    let v1 = '<img src="' + v0 + '" data-thumbnail-src="' + b + '" />';

                                    return v1
*/
                                }

                                return a + b + c

                            })

                            msg = msg.replace(

                                /<a\s+href=\"(https\:\/\/i\.lih\.kg\/thumbnail\?u=[^\?\s\x00-\x20\x7F-\xFF\"]+)\"[^<>]+>\1<\/a>/g,
                                function(_, a) {

                                    let b = extractRawURL(a)
                                    if (b) {
                                        replace = true
                                        return _.replace(a,b).replace(a,b)
                                        /*
                                        let a01 = encodeURIComponent(a)
                                        let a02 = a01.replace(/\%26amp\%3B/gi, '%26')
                                        let b01 = encodeURIComponent(b)
                                        let c = _.replace(a, b).replace(a, b).replace(a02, b01).replace(a01, b01)

                                        return c*/
                                    }
                                    return _
                                })


                            if (replace) {
                                console.log(333,bmsg,msg)
                                resObj[k] = msg;

                            }
                        }
                    }
                }

                contentFix(res)

                return res;
            }
        }

        let api_callback = "uleccyqjstui"

        ;
        ((xmlhr, xmlhr_pt) => {
            if (!xmlhr_pt._open) {
                xmlhr_pt._open = xmlhr_pt.open;


                xmlhr_pt.open = function() {
                    // console.log('xmlhr_open', arguments)
                    if (/https?\:\/\/[\x20-2E\x30-5B\x5D-\x7E]*lihkg\.com\/[\x20-\x7E]*api[\x20-\x7E]+/.test(arguments[1])) {
                        this._url = arguments[1];

                        console.log('_url', this._url)
                    }
                    this._open.apply(this, arguments)
                }
            }



            if (!xmlhr_pt._send) {
                xmlhr_pt._send = xmlhr_pt.send;


                xmlhr_pt.send = function() {
                    if (this._url) {
                        this.addEventListener('load', function() {
                            let resText = this.responseText;
                            let jsonObj = null;
                            if (resText && typeof resText == 'string') {
                                try {
                                    jsonObj = JSON.parse(resText);
                                } catch (e) {}
                            }

                            if (jsonObj) {
                                //like_count

                                let code_num = 0;

                                if (jsonObj.success == 1 && jsonObj.response && jsonObj.response.item_data && jsonObj.response.item_data.length >= 1 && jsonObj.response.item_data[0]["post_id"]) {
                                    code_num |= 16;
                                }
                                if (jsonObj.success == 1 && jsonObj.response && jsonObj.response.thread_id) {
                                    code_num |= 8;
                                }
                                // console.log('code', code_num);
                                let event = new CustomEvent(api_callback, {
                                    detail: {
                                        code: code_num,
                                        responseJSON: jsonObj
                                    }
                                });
                                document.dispatchEvent(event);



                                //console.log(jsonObj)
                            }

                        })
                    }
                    // console.log('xmlhr_send', arguments)
                    this._send.apply(this, arguments)
                }
            }


        })(XMLHttpRequest, XMLHttpRequest.prototype)

    }

    let jsscript = document.createElement('script');
    jsscript.type = 'text/javascript';
    jsscript.innerHTML = '(' + injection + ')()';
    document.documentElement.appendChild(jsscript)

    let api_callback = "uleccyqjstui"
    //data-post-id="5226a9cb7b395fbc182d183a6ee9b35c8adfd2fe"
    document.addEventListener(api_callback, function(e) {
        if (!e || !e.detail) return;
        console.log("API_CALLBACK", e.detail)
        let jsonObj;
        let code_num = e.detail.code
        switch (true) {

            case (code_num & 8) == 8: //main thread

            case (code_num & 16) == 16: //posts


                jsonObj = e.detail.responseJSON;


                if (jsonObj.success == 1 && jsonObj.response && jsonObj.response.item_data && jsonObj.response.item_data.length >= 1 && jsonObj.response.item_data[0]["post_id"]) {
                    let reply_post_fx = (reply_item) => {
                        if ('dislike_count' in reply_item && 'like_count' in reply_item && reply_item["post_id"]) {

                            let like_count = +reply_item['like_count']
                            let dislike_count = +reply_item['dislike_count']
                            let post_id = reply_item['post_id']

                            if (isNumCheck(like_count) && isNumCheck(dislike_count) && post_id) {
                                postDetails[post_id] = {
                                    'like_count': like_count,
                                    'dislike_count': dislike_count
                                }
                            }

                        }
                    };
                    jsonObj.response.item_data.forEach(reply_post_fx)
                    if (jsonObj.response.pinned_post && jsonObj.response.pinned_post["post_id"]) reply_post_fx(jsonObj.response.pinned_post)

                }



                if (jsonObj.success == 1 && jsonObj.response && jsonObj.response.thread_id) {
                    let thread_fx = (thread_item) => {
                        if ('like_count' in thread_item && 'dislike_count' in thread_item && thread_item["thread_id"]) {

                            let like_count = +thread_item['like_count']
                            let dislike_count = +thread_item['dislike_count']
                            let thread_id = thread_item['thread_id']

                            if (isNumCheck(like_count) && isNumCheck(dislike_count) && thread_id) {
                                threadDetails[thread_id] = {
                                    'like_count': like_count,
                                    'dislike_count': dislike_count
                                }
                                pendingRefreshThread = thread_id;
                                if (!cid_refreshingThread) cid_refreshingThread = setInterval(refreshingThreadRunning, 1);
                            }

                        }
                    };
                    thread_fx(jsonObj.response)
                    //console.log(99, threadDetails)

                }

                //console.log(jsonObj)
                break;


            default:
        }

    });

    const makePopup=(obj)=>{
        const {header, content1,content2, placeholder, remarks, btn1, btn2, closeFn, btn1Fn, btn2Fn}=obj;

        let mcontent2=content2?`<br>${content2}<br>`:'';

        let df = document.createElement('div');


        df.innerHTML=
     `
<div class="_34dVbr5A8khk2N65H9Nl-j  ">
  <div class="_27su4Zj_qATokwVdWIbEWB  ">
    <div class="_1nqRVNQ2PyO3vnAwZIISAJ ">
      <div class="_2b5VMoBy8yIXlX-wC8v57F">${header}</div>
      <div class="_10tWW0o-L-5oSH8lCBl9ai"><i class="i-close"></i></div>
    </div>
    <div class="_27SmIe4FGDNnK7apcCB3W7">
      <div class="_3dbMg7zkkTIVJ5VZ3ygu4-">
        <div style="text-align: center; width: 240px;"><span>${content1}</span>${mcontent2}
          <div><input type="text" placeholder="${placeholder}" class=" _2SVsmVSmKfAWFlZGk_5_L8" value=""
              style="margin: 0.5rem 0px 0px;"><span
              style="font-size: 0.8rem; color: rgb(136, 136, 136);">${remarks}</span></div>
        </div>
      </div>
    </div>
    <div class="_2c5AwJ_0ePFIYub8OFE97J _2F7zIQl_1y5nHpDllTwX17"><a href="#">${btn1}</a><a
        href="#">${btn2}</a></div>
  </div>
</div>
`
df.querySelector('._10tWW0o-L-5oSH8lCBl9ai').addEventListener('click', closeFn)
        let btnFns = [btn1Fn, btn2Fn];
for(const [idx,a] of [...df.querySelectorAll('a[href*="#"]')].entries()) a.addEventListener('click', btnFns[idx])
        return df.querySelector('div');

    }


    document.addEventListener('keyup',function(evt){

        if(evt.code=='KeyB'){

            let memberID = getSelection()+""

            let m = null
            if(m=/\s*\#(\d+)\s*/.exec(memberID)){



            let mPopup = makePopup({header:'Block', content1:`Memeber ID:${m[1]}`,content2:'', placeholder:'Type the Reason Here', remarks:'Please be careful', btn1:'Cancel', btn2:'Block',
                                   closeFn:function(){
                                   mPopup.remove()
                                   },
                                    btn1Fn:function(){
                                   mPopup.remove()
                                   },
                                    btn2Fn:function(){
                                        let reason = mPopup.querySelector('input[type="text"]').value || '';

                                  fetch(`https://lihkg.com/api_v2/user/${m[1]}/block?reason=${reason}`)
    .then(response => response.json())
    .then(data => {
                                  if(data&& 'success' in data) alert( data.success?'成功':'失敗');
                          console.log(data)
                                  });

                                   mPopup.remove()
                                   },

                                   })
            document.querySelector('body').appendChild(mPopup)

            }




        }else if(evt.code=='KeyU'){

            let memberID = getSelection()+""

            let m = null
            if(m=/\s*\#(\d+)\s*/.exec(memberID)){
                                  fetch(`https://lihkg.com/api_v2/user/${m[1]}/unblock`)
    .then(response => response.json())
    .then(data => {
                                  if(data&& 'success' in data) alert( data.success?'成功':'失敗');
                          console.log(data)
                                  });
            }





        }

    })


    // Your code here...
})();