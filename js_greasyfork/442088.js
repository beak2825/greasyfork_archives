// ==UserScript==
// @name        Hacker News: Chan Reply Format
// @namespace   jvbf Userscripts
// @match       https://news.ycombinator.com/item
// @grant       none
// @version     1.0
// @author      jvbf
// @description Make Hacker News have a chan style reply structure/format!
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442088/Hacker%20News%3A%20Chan%20Reply%20Format.user.js
// @updateURL https://update.greasyfork.org/scripts/442088/Hacker%20News%3A%20Chan%20Reply%20Format.meta.js
// ==/UserScript==

var commentlist = document.getElementsByClassName('athing comtr')
for (var i = 0; i < commentlist.length; i++){

    let indents = commentlist[i].getElementsByClassName("ind")
    if (indents.length > 0) {
        for (var j = 0; j < indents.length; j++) {
            indents[j].remove()
        }
    }

    let parentlink = document.evaluate(".//a[text()='parent']", commentlist[i], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    if (parentlink != null) {
        parentlink = parentlink.href
        let textnode = commentlist[i].getElementsByClassName("commtext")[0]
        textnode.innerHTML = `<a data-this='${parentlink.split('#')[1]}' onmouseover='replyPopupOver(event, this)' onmouseout='replyPopupOut(event, this)' href=${parentlink}>&gt;&gt;${parentlink.split('#')[1]}</a><br>${textnode.innerHTML}`
    }

    let navs = commentlist[i].getElementsByClassName('navs')[0]
    navs.innerHTML = ` | No.${commentlist[i].id}`

    for (var j = 0; j < commentlist.length; j++) {
        let parentlink = document.evaluate(".//a[text()='parent']", commentlist[j], null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        if (parentlink != null && parentlink.href.split('#')[1] == commentlist[i].id) {
            navs.innerHTML += ` <a data-this='${commentlist[j].id}' onmouseover='replyPopupOver(event, this)' onmouseout='replyPopupOut(event, this)' href='${parentlink.href.split('#')[0]}#${commentlist[j].id}'>&gt;&gt;${commentlist[j].id}</a>`
        }
    }
}

commentarray = Array.prototype.slice.call(commentlist);
commentarray.sort(function(a, b){
    return a.id.localeCompare(b.id);
});
for (var i = 0; i < commentarray.length; i++) {
    var parent = commentarray[i].parentNode
    var curitem = parent.removeChild(commentarray[i])
    parent.appendChild(curitem)
}

var popup = document.createElement('div')
document.body.appendChild(popup)
popup.style.display = 'none'

unsafeWindow.replyPopupOver = function(ev, el) {
    let reply = document.getElementById(el.dataset.this).cloneNode(true)
    popup.style.display = 'inline'
    popup.style.position = 'fixed'
    popup.style.top = ev.clientY+20;
    popup.style.left = ev.clientX+20;
    popup.style.backgroundColor = '#f6f6ef'
    popup.style.border = 'solid black 1px'
    popup.appendChild(reply)
}

unsafeWindow.replyPopupOut = function(ev, el) {
    popup.style.display = 'none'
    popup.innerHTML = ''
}