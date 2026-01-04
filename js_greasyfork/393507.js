// ==UserScript==
// @name         阿里邮箱自动阅读邮件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  原理：根据邮件标题是否加粗找到未读邮件，然后模拟点击，并停留5秒（时间过短无法触发已读）
// @author       auroraeffect
// @match        http://mail.hichina.com/alimail/
// @downloadURL https://update.greasyfork.org/scripts/393507/%E9%98%BF%E9%87%8C%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E9%82%AE%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/393507/%E9%98%BF%E9%87%8C%E9%82%AE%E7%AE%B1%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E9%82%AE%E4%BB%B6.meta.js
// ==/UserScript==

function clickUnreadEmail() {
    const htmlElements = document.getElementsByClassName('maillist_item_wrap e_list_item mail_tag_hover mail_from_hover maillist_item_hassummary')
    const elemets = Array.from(htmlElements)

    for(let i=0 ;i<elemets.length;i++ ){
        const mail = elemets[i].querySelector("div")

        const boldElements = mail.querySelector('span.e_ellipsis.e_fs12.maillist_item_subject.mail_from_subject.e_bold')

        if(boldElements){
            boldElements.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
            boldElements.click()
            console.log(new Date())
            console.log(boldElements.innerText)
            return
        }

    }
}

setInterval(()=>{clickUnreadEmail()},5000)