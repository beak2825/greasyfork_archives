// ==UserScript==
// @name         Verify chinese
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  detect tradational chinese
// @author       cloud.he@iherb.com
// @match        http://localhost:9933/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/rxjs/6.6.2/rxjs.umd.min.js
// @downloadURL https://update.greasyfork.org/scripts/409969/Verify%20chinese.user.js
// @updateURL https://update.greasyfork.org/scripts/409969/Verify%20chinese.meta.js
// ==/UserScript==
// https://greasyfork.org/
(function() {
    'use strict';
    const { fromEvent, of, interval } = rxjs;
    const { ajax } = rxjs.ajax;
    const { debounceTime, map, catchError, delay } = rxjs.operators;

    let init = false;
    //const source = fromEvent(document, 'click');
    const froalaEditor$ = fromEvent(document, 'click').pipe(
        map(() => document.getElementById('FroalaEditorzh-TW'))
    );

    froalaEditor$.pipe(delay(500)).subscribe(val => {
        if(!init && val){
            init = true;
            bindDom(val);
        }else if(init && !val){
            init = false;
        }
        //console.log('val',val)
    });

    const bindDom = (targetTextarea) => {
        const setLoadImg = (targetDom) => {
            const loadImg = document.createElement('img');
            loadImg.id = 'cloud-loading-image';
            loadImg.src = 'https://www.cloudshadow.me/al30.png';
            loadImg.style.cssText =`position: absolute;top: ${targetDom.offsetTop + targetDom.offsetHeight - 30 }px;left: ${targetDom.offsetLeft + targetDom.offsetWidth - 30 }px`;
            targetDom.parentNode.insertBefore(loadImg, targetDom.nextSibling);
        };
        setLoadImg(targetTextarea);

        const targetTextarea$ = fromEvent(targetTextarea,'keyup') .pipe(debounceTime(2000));
        const ajaxRequest$ = ajax(`https://api.github.com/users?per_page=5`);
        targetTextarea$.subscribe(
            element => {
                document.getElementById('cloud-loading-image').animate([
                    // keyframes
                    { transform: 'rotate(0deg)' },
                    { transform: 'rotate(180deg)' },
                    { transform: 'rotate(360deg)' }
                ], {
                    // timing options
                    duration: 1000,
                    iterations: Infinity
                });
                const reg = new RegExp(`[\u4e00-\u9fa5]`, 'ig');
                const tradationalArray = targetTextarea.innerText.match(reg);
                document.getElementById('cloud-error-msg')?document.getElementById('cloud-error-msg').remove():'';
                setTimeout(()=>{
                    ajaxRequest$.subscribe(
                        res => {
                            document.getElementById('cloud-loading-image').remove();
                            setLoadImg(targetTextarea);
                            const errorMsg = document.createElement('div');
                            errorMsg.id = 'cloud-error-msg';
                            errorMsg.style.cssText = 'border: 1px solid #ccc;border-radius: 3px';
                            errorMsg.innerHTML = `<div>${tradationalArray.join(',')}</div>`;
                            targetTextarea.parentNode.insertBefore(errorMsg, targetTextarea.nextSibling);
                        },
                        err => console.error('err',err)
                    );
                },3000);
            }
        );
    }
})();
