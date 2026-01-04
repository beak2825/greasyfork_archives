// ==UserScript==
// @name         Nicolive Comment Adapter
// @version      0.8
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        exportFunction
// @grant        GM_addStyle
// @run-at       document-start
// @match        https://live.nicovideo.jp/watch/lv*
// @connect      ext.nicovideo.jp
// @namespace https://greasyfork.org/users/715401
// @description add information to nicolive comment area
// @downloadURL https://update.greasyfork.org/scripts/418764/Nicolive%20Comment%20Adapter.user.js
// @updateURL https://update.greasyfork.org/scripts/418764/Nicolive%20Comment%20Adapter.meta.js
// ==/UserScript==

(function () {
    const w = (typeof unsafeWindow == 'undefined') ? window : unsafeWindow;
    // Style fix
    GM_addStyle(`
span[class^="___table-cell___"] {
    width: 99% !important;
}

span[class^="___comment-time___"] {
    display: initial;
}

span[class^="___comment-author-name___"] {
  display: initial;
  width: 12em;
  margin-right: 1em;\
  overflow-x: hidden;
}
iframe.nca_sm_thumb {
  display: none;
  width: min(60vw, 640px);
  height: min(30vh, 400px);
  position: fixed;
  left: 10%;
  top: 15%;
  z-index: 1001;
}
a.nca_sm_a:hover + iframe.nca_sm_thumb {
  display: block;
}
`)
    // comment adapter
    let user_id_hash = {}
    let user_name_hash = {}
    setInterval( function() {
        let noTexts = document.querySelectorAll("span[class^='___comment-number___']");
//        getElementsByClassName("___comment-number___2Qws3")
        for (let i = 0, len = noTexts.length|0 ; i < len; i = i+1|0) {
            let tNode = noTexts[i]
            let noText = tNode.innerText
            if ( noText && user_id_hash[noText]) {
                let disp = user_name_hash[ user_id_hash[noText] ] || user_id_hash[noText]
                let newHtml
                if ( /^[0-9]+$/i.test(user_id_hash[noText] ) ) {
                    newHtml = '<a target="_blank" href="//nicovideo.jp/user/' +
                        user_id_hash[noText] + '">' + disp + '</a>';
                }
                else {
                    newHtml = disp
                }
                if ( tNode.nextSibling.innerHTML != newHtml) {
                    tNode.nextSibling.innerHTML = newHtml
                }
            }
        }
        let commentTexts = document.querySelectorAll("span[class^='___comment-text___']")
        // .getElementsByClassName("___comment-text___2cPL0")
        for (let i = 0, len = commentTexts.length|0 ; i < len; i = i+1|0) {
            let tNode = commentTexts[i]
            let orgHTML = tNode.innerHTML
            let re = /([sn]m\d+)/
            if ( ! orgHTML.includes("<a ") ) {
                var newText1 = orgHTML.replace( re,
                    '<a class="nca_sm_a" target="_blank" href="//nicovideo.jp/watch/$1">$1</a>' +
                    '<iframe class="nca_sm_thumb" loading="lazy" src="//ext.nicovideo.jp/thumb/$1"' +
                    ' frameborder="0"></iframe>')
                tNode.innerHTML = newText1
            }
        }
    }, 700)


    let _resolve_user_name = function(uid) {
        if ( ! (/^[0-9]+$/i.test(uid)) ) {
            return
        }
        if ( user_name_hash[ uid ] ) {
            return
        }
        let url = "//ext.nicovideo.jp/thumb_user/" + uid
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(resp) {
                try {
                    let text = resp.responseText
                    let name = text.match( /><strong>(.*)<\/strong>/ )[1];
                    if (name) user_name_hash[uid] = name
                }
                catch(ex) {
                }
            }
        })
        return
    }

    // WebSocket interseptor
    let _after_message = function (e, ws) {
        if (typeof e.data !== "string") return
        try {
            let js = JSON.parse( e.data)
//            console.log("after message " + e.data)
            if (js.chat && js.chat.no) {
                user_id_hash["" + js.chat.no] = js.chat.user_id
                _resolve_user_name( js.chat.user_id)
            }
        }
        catch (er) {
            console.log(er.message)
        }
    }

    let _addEventListener = w.WebSocket.prototype.addEventListener
    w.WebSocket.prototype.addEventListener = exportFunction( function() {
        let eventThis = this
        // if eventName is 'message'
        if (arguments[0] === 'message') {
            arguments[1] = (function (userFunc) {
                return function() {
                    userFunc.apply(eventThis, [].slice.call(arguments))
                    _after_message(arguments[0], eventThis)
                }
            })(arguments[1])
        }
        return _addEventListener.apply(this, [].slice.call(arguments))
    } )
})()
