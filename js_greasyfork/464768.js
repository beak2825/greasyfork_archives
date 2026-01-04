

    // ==UserScript==
    // @name         基础教育教师培训网 仅4倍速播放
    // @namespace    https://greasyfork.org/
    // @version      0.0.3
    // @license      GPL
    // @description  https://jx19qy.gpa.enetedu.com/
    // @author       Zed Wong
    // @match        https://jx19qy.gpa.enetedu.com/mycourse/MyCourse/MyEventList*
    // @match        https://jx19qy.gpa.enetedu.com/Event/MyjoinEvent*
    // @match        https://jx19qy.gpa.enetedu.com/Event/CourseWare*
    // @match        https://jx19qy.gpa.enetedu.com/MyCourse/Process*
// @downloadURL https://update.greasyfork.org/scripts/464768/%E5%9F%BA%E7%A1%80%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E7%BD%91%20%E4%BB%854%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/464768/%E5%9F%BA%E7%A1%80%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E7%BD%91%20%E4%BB%854%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
    // ==/UserScript==

(function() {
    console.log('启动了')
    setTimeout(function(){
      document.getElementsByTagName('iframe')[0].contentDocument.getElementsByTagName("video")[0].playbackRate=4
      console.log('加速了')
      document.getElementsByClassName('qplayer-center-btn')[0].click()
      console.log('开始了')
    }, 5000)
})()

console.log("Mute")
document.getElementsByClassName('qplayer-volumebtn')[0].click()

console.log("Set 16x speed at video page")
document.getElementsByTagName('iframe')[0].contentDocument.getElementsByTagName("video")[0].playbackRate=16

console.log("Start/Pause playing video")
document.getElementsByClassName('qplayer-playbtn')[0].children[0].click()
// document.getElementsByClassName('qplayer-playbtn')[0].children[1].click()

const checkState = () => {
        console.log("Get current percentage")
        const state = document.getElementsByClassName('qplayer-barcurr')[0].style.cssText.replaceAll("background: rgb(250, 250, 250); width: ",'').replaceAll("%;", '')

        // Check if 100%
        if (parseInt(state) == 100) {
                // Go to next page, or next chapter

                // The link of the next page
                const linkNext = document.getElementsByClassName('tishivalju')[1].href
                if (linkNext == undefined) {
                        console.log('Go to next chapter')
                } else {
                        console.log('Go to next page')
                        location.href = linkNext
                }
        }
}

// Run every 5s
const interval = setInterval(function() {
        checkState()
 }, 5000);

//clearInterval(interval);
