// ==UserScript==
// @name tddh
// @namespace http://tampermonkey.net/
// @version 0.1
// @description tddhkhihipguck
// @author 小李子
// @grant none
// ==/UserScript==
const a="123"
const duti=()=>{
let vi=document.querySelector("video")
vi.play()
vi.currentTime=vi.duration+1
document.getElementsByClassName("vjs-big-play-button")[0].click()
}