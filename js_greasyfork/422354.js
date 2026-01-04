// ==UserScript==
// @name         Hide related videos youtube
// @namespace    https://github.com/drelocatelli/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        www.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422354/Hide%20related%20videos%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/422354/Hide%20related%20videos%20youtube.meta.js
// ==/UserScript==

(function() {
setTimeout(function(){
        let relatedbtn = document.createElement('button')
        relatedbtn.style = 'background: brown; border: 0; padding: 5px 13px; cursor: pointer; color: white; border-radius: 4px; outline:none;'
        let relatedVideos = [
            document.querySelector('#items > ytd-item-section-renderer'),
            document.querySelector("#contents > ytd-compact-video-renderer")
        ]
        document.querySelector('#start').appendChild(relatedbtn)
        //document.querySelector('#start').prepend(relatedbtn)

        relatedbtn.textContent = 'Show related'


        function toggleRelated(opt){
            if(opt == 'hide'){
                relatedVideos.forEach(function(i){
                    i.style.visibility = 'hidden'
                    i.dataset.toggle = 'hide'
                    relatedbtn.textContent = 'Show related'
                })
            }else if(opt == 'show'){
                relatedVideos.forEach(function(i){
                    i.style.visibility = 'visible'
                    i.dataset.toggle = 'show'
                    relatedbtn.textContent = 'Hide related'
                })

            }

        }
    toggleRelated('hide')
    relatedVideos.forEach(function(i){
            i.dataset.toggle = 'hide'
         relatedbtn.onclick = function(){
            if(i.dataset.toggle == 'show'){
                toggleRelated('hide')
            }else if(i.dataset.toggle == 'hide'){
                toggleRelated('show')
            }
        }

        })   
    },3000)
})();