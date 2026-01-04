// ==UserScript==
// @name         Reduce Timer Calling during Youtube Video Playing
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  To reduce the repeating timer calls.
// @author       CY Fung
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429194/Reduce%20Timer%20Calling%20during%20Youtube%20Video%20Playing.user.js
// @updateURL https://update.greasyfork.org/scripts/429194/Reduce%20Timer%20Calling%20during%20Youtube%20Video%20Playing.meta.js
// ==/UserScript==

(function() {
    'use strict';



    function injection(){

        let debug = false;

        let setTimeout=window.setTimeout;
        let clearTimeout=window.clearTimeout;
        let ii=0,jj=0;

        const G = {}

        G.enable={};
        G.repeat=null;
        G.activeVideo=null;

        const TERMINATE_LOWER = 888888888<<1;
        const TERMINATE_UPPER = 898888888<<1;
        const MIN_DELAY = 99;

        /*

       r = 1000*2+1 =  2001

       r>2000(LOWER) => r'_1001 = 1001 + UPPER

       (K+1)+U>K*2+1

       U>K

       U=2K+N>K

        */


        let terminate= 0;
        let promise = Promise.resolve();
        const nf=()=>{};
        window.setTimeout=function(f,d){
            if(terminate>0){
                return terminate + setTimeout.apply(this,arguments);
            }
            let validVideo = G.activeVideo && G.activeVideo.parentNode && !G.activeVideo.paused
            if(validVideo){
                let g=f+"";
                if(g.indexOf('code')<0){
                    jj++;
                    if(d>=MIN_DELAY) {} else {d=MIN_DELAY}
                    let k=g+"|"+d;
                    let T;
                    let h = function(){
                        'code';
                        if(T.r in G.enable){
                            delete G.enable[T.r];
                            if(!G.repeat || G.repeat[T.k]===T.r) {
                                ii++
                                promise=promise.then(T.f).then(nf).catch(console.warn);
                            }
                        }
                        T=null;
                    }
                    let r= ( setTimeout.call(this,h,d) << 1 ) | 1;
                    if(r>TERMINATE_LOWER) terminate=TERMINATE_UPPER;
                    G.repeat[k]=r;
                    G.enable[r]=true;
                    T={r,k,f};
                    return r;
                }

            }else if(G.activeVideo!==null){
                setNull();
            }
            let r = ( setTimeout.apply(this,arguments) << 1 )
            if(r>TERMINATE_LOWER) terminate=TERMINATE_UPPER;
            return r;

        }

        window.clearTimeout=function(c){
            if(terminate >0 && c>terminate) return clearTimeout(c-terminate);

            if((c%2)===1){
                delete G.enable[c];
                //G.enable[c]=false;
            }else{
                clearTimeout(c>>1);
            }

        }


        if(debug){
            setInterval(()=>{
                console.log(ii,jj)
            },1000)
        }

        let cp=0;

        function setNull(){

                G.activeVideo=null;
                G.repeat=null;
        }

        document.addEventListener('playing',function(evt){

            if(G.activeVideo===evt.target) return;

            Promise.resolve(evt).then(evt=>{

                if(!evt || !evt.target || evt.target.nodeName!="VIDEO") return;

                //if(document.querySelector('ytd-player#ytd-player video')!==evt.target) return;

                if(cp)return;

                let em=(G.activeVideo && G.activeVideo.parentNode && !G.activeVideo.paused)

                if(em)return;
                setNull();

                return evt;

            }).then(evt=>{

                if(!evt)return;


                //let count=10;

                let tc=()=>{

                    cp=0;

                    //let p=document.querySelector('#ytd-player .ytp-time-display.ytp-live')

                    //if(!p)return --count?(cp=setTimeout(tc,400)):0;

                    G.repeat={};
                    G.activeVideo=evt.target;

                }
                cp=setTimeout(tc,40)



            })



        },true)


        document.addEventListener('pause',function(evt){

            if(!G.activeVideo) return;

            Promise.resolve(evt).then(evt=>{
                if(!evt || !evt.target || evt.target.nodeName!="VIDEO") return;
                let em=(G.activeVideo && G.activeVideo.parentNode && !G.activeVideo.paused)
                if(!em && evt.target === G.activeVideo) {
                    if(cp>0)cp=clearTimeout(cp);
                    setNull();
                }
            })

        },true)


    }


    let src=document.createElement('script')

    src.type='text/javascript';
    src.textContent = `(${injection+''})()`;

    document.documentElement.appendChild(src);
    src=null;


    // Your code here...
})();