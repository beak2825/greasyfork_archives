// ==UserScript==
// @name         Google Search hotkeys
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Quick-select from google search using numbers 1-9. Does not work on sub-results. Adds numbers for reference. Also does NOT yet work on complex results such as yt vids/twitter posts.
// @author       You
// @include      /(https?:(www\.)?\/\/)?google\.com\/search\?.*
// @run-at       document-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437447/Google%20Search%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/437447/Google%20Search%20hotkeys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let cycleno=0;
    let cycle=setInterval(update,100)
    let search_dict = {}
    let queue=[]
    setup_listeners()

    function update(){
        //var startTime = performance.now()
        if(cycleno==10){
            clearInterval(cycle)
            (()=>{
                if(queue.length>0){
                    search_dict[queue[0]].click()
                }
            })()
        }
        cycleno+=1
        let linkno=1;
        let search_results = document.querySelectorAll('.g')
        let gtags=[]
        for(let i=0; i<search_results.length; ++i){
            if(search_results[i].className=='g'){
                gtags.push(search_results[i])
            }
        }
        let htags=[]
        let atags=[]
        for(let i=0; i<gtags.length; ++i){
            let htag=gtags[i].getElementsByTagName('h3')
            if(htag.length>0){
                htags.push(htag[0])
                atags.push(htag[0].parentElement)
            }
        }

        let headers=[]
        for(let i=0; i<atags.length; ++i){
            if(atags[i].parentNode.children.length>1){
                let svgtag=atags[i].parentNode.getElementsByTagName('svg')
                if(svgtag.length>0){
                    headers.push(atags[i])
                }
            }
        }
        let hrefs=[]
        let headers2=[]
        for(const header of headers){
            if(hrefs.includes(header.getAttribute('href'))){

            }
            else{
                hrefs.push(header.getAttribute('href'))
                headers2.push(header)
            }
        }
        for(const tag of headers2){
            let cites=tag.getElementsByTagName('cite');
            if(cites.length==1){
                if(!cites[0].textContent.startsWith(linkno)){
                    cites[0].textContent=linkno+' '+cites[0].textContent
                }
                linkno++
            }
        }

        headers2.forEach((key,i)=>{search_dict[i+1]=key})
        //var endTime = performance.now()
        //console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
    }

    function setup_listeners(){
        for(let i=1; i<10; ++i){
            if(document.querySelector('body')){
                console.log('body found')
                document.body.addEventListener('keydown',(e)=>{
                    if(e.key==i && document.activeElement.tagName!='INPUT'){
                        let index=parseInt(i)
                        if(search_dict.hasOwnProperty(index)){
                            search_dict[index].click()

                        }
                        else {
                            queue.push(index)
                        }
                    }
                })
            }
            else {
                console.log('body not found')
                setTimeout(setup_listeners,100)
            }
        }
     }
    // Your code here...
})();