// ==UserScript==
// @name         学堂云强制播放
// @namespace    http://ynotme.cn/
// @version      0.12
// @description  try to take over the world!
// @author       You
// @match        https://buaa.xuetangx.com/lms
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372681/%E5%AD%A6%E5%A0%82%E4%BA%91%E5%BC%BA%E5%88%B6%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/372681/%E5%AD%A6%E5%A0%82%E4%BA%91%E5%BC%BA%E5%88%B6%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
setTimeout(function(){
        $("li[data-speed='2']").click();
    },2500);
    var courseData = [{unit:'1aa47957-0413-431b-a4c2-f599bf3fe437',max:5275},
                      {unit:'64e4c7d9-7799-45ef-b042-9af3f1ee154d',max:5280},
                      {unit:'3bbc28d6-dbf1-4b7a-82c1-ce3fd395cb57',max:5283},
                      {unit:'00d05359-4edd-46b3-b790-c4847445b991',max:5287},
                      {unit:'9382d46d-4d21-46f6-9226-ed6bfe27c44a',max:5293},
                      {unit:'28c51f18-0a99-4e7a-b396-15aa675e3017',max:5296},
                      {unit:'2e2b16d8-7c7c-4deb-899e-6f5eb3c0cbf5',max:5302},
                      {unit:'25be8170-d5c3-48e6-aad1-76713e17dd26',max:5306},
                      {unit:'624fe9b8-3bb2-4451-8f40-b1fcf163ae91',max:5313},
                      {unit:'7a0533a4-11b1-445a-99da-a32805ee96af',max:5321},
                      {unit:'9338fb4e-2669-428f-9447-7e5a072e2830',max:5326}]
    var timeInterval = setInterval(function(){
        var video = $("#video")[0]
        var paused = video.paused;
        var ended = video.ended;
        if(paused && !ended)
        {
            video.play();
        }
        else if(ended){
            clearInterval(timeInterval)
            var urls = window.location.href.split('/')
            var now = parseInt(urls[8]);
            urls[8] = (now+1).toString()
            var i =0;
            while(i<11){
                if(courseData[i].max>now){
                    urls[7]=courseData[i].unit;
                    break;
                }
                i++;
            }
            var newUrl = urls.join('/')
            window.location.href = newUrl
        }
    },300)
    // Your code here...
    })();