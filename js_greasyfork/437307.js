// ==UserScript==
// @name         Twitch clips auto player
// @namespace    http://tampermonkey.net/
// @version      69.4201
// @description  Auto plays twich clips
// @author       lazylion2
// @match        https://*.twitch.tv/*

// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437307/Twitch%20clips%20auto%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/437307/Twitch%20clips%20auto%20player.meta.js
// ==/UserScript==

(function main () {
    var clips_in_url= 0;
    check_for_clip_in_url()
    var started = 0
    function nextvideo() {
        if (started){
        //console.log('next')
        var curUrl = window.location.href.match("clip/(.*)-")[1]
        var allCards = document.querySelectorAll('[data-a-target^="clips-card"]')
        for (var i=0;i<allCards.length;i++){
            //console.log('i =',i)
            var ref = $(allCards[i]).find('div a:first')[0].href

            if(ref.indexOf(curUrl)>-1){
               // console.log("i = ",i,"all=",allCards.length)
                if (i+1 == allCards.length){
                   // console.log("i == all")
                    allCards[i].scrollIntoView();
                    setTimeout(() => {
                        var newref = document.querySelectorAll('[data-a-target^="clips-card"]')
                        $(newref[i+1]).find('div a:first')[0].click()

                    }, 1000);
                    started = 0
                    break;


                }
                else{
               // console.log(allCards[i+1] )
                         setTimeout(() => {
                        $(allCards[i+1]).find('div a:first')[0].click()
                    }, 1000);
                    started = 0

                  }
                break;
            }
        }
        }

    }
    function findvideo() {
        const videoPlayer = document.getElementsByTagName('video')[0];
        //console.log(videoPlayer)
        videoPlayer.addEventListener('pause', (event) => {
            //console.log('paused')

        })
        videoPlayer.addEventListener('ended', (event) => {
            //console.log('ended')
            if(clips_in_url){
                nextvideo()
            }

        })
        videoPlayer.addEventListener('play', (event) => {
            //console.log('started')
            started = 1

        })
    }


    let observer = new MutationObserver(mutationRecords => {
        mutationRecords.forEach(function(mutation) {
            var v = document.body.getElementsByTagName("video")
            if (v.length >0){
                started = 1
                //console.log('f')
                findvideo()
                observer.disconnect()



            }


        });
    });
    function startObserver(){
        observer.observe(document.querySelector('body'), { childList: true, subtree: true });
    }
    startObserver()

// all this to detect url change -_-
    history.pushState = ( f => function pushState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.pushState);

    history.replaceState = ( f => function replaceState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate',()=>{
        window.dispatchEvent(new Event('locationchange'))
});
    window.addEventListener('locationchange', function(){
    check_for_clip_in_url()


})
    function check_for_clip_in_url(){
        const url = window.location.href
        if (url.includes("/clip")){
            if (!clips_in_url){
                clips_in_url =1;
                startObserver()
            }

            //console.log('clips ON')
        }
        else{
            if (clips_in_url){
                clips_in_url =0;
                if(observer) {
                    observer.disconnect()
                }
            }

            //console.log('clips OFF')

        }
    }
})();
