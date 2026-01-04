// ==UserScript==
// @name            水球清单自动同步
// @namespace       http://tampermonkey.net/
// @version         0.1
// @description     水球清单自动定时同步，可自定义同步间隔时间。
// @author          Priate
// @match           https://waterdo.cn/zh-CN/tasks/
// @match           https://waterdo.app/zh-CN/tasks/
// @icon            https://www.google.com/s2/favicons?sz=64&domain=waterdo.cn
// @contributionURL https://afdian.net/@cyberubbish
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/459847/%E6%B0%B4%E7%90%83%E6%B8%85%E5%8D%95%E8%87%AA%E5%8A%A8%E5%90%8C%E6%AD%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/459847/%E6%B0%B4%E7%90%83%E6%B8%85%E5%8D%95%E8%87%AA%E5%8A%A8%E5%90%8C%E6%AD%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const config = {
        // 同步间隔
        'interval' : 10
    }

    async function Sleep(sleepSecs) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, sleepSecs)
        })
    }
    async function openSidebar(){
        if(!document.querySelector('div[data-side="bottom"]')){
            document.querySelector('button[aria-controls="radix-:r3:"]').click()
        }
    }

    async function closeSidebar(){
        if(document.querySelector('div[data-side="bottom"]')){
            document.querySelector('button[aria-controls="radix-:r3:"]').click()
        }
    }
    async function sync(){
        console.log('sync')
        await openSidebar()
        document.querySelector('div[id="radix-:r3:"]').parentElement.style.zIndex = -100
        document.querySelector('button[aria-controls="radix-:r3:"]').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><g style="transform-box:fill-box; transform-origin:center;"><animateTransform attributeName="transform" type="rotate" form="0" to="360" dur="3s" repeatCount="indefinite" /><path fill="none" d="M0 0h24v24H0z"/><path d="M12 2a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 15a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0v-3a1 1 0 0 1 1-1zm8.66-10a1 1 0 0 1-.366 1.366l-2.598 1.5a1 1 0 1 1-1-1.732l2.598-1.5A1 1 0 0 1 20.66 7zM7.67 14.5a1 1 0 0 1-.366 1.366l-2.598 1.5a1 1 0 1 1-1-1.732l2.598-1.5a1 1 0 0 1 1.366.366zM20.66 17a1 1 0 0 1-1.366.366l-2.598-1.5a1 1 0 0 1 1-1.732l2.598 1.5A1 1 0 0 1 20.66 17zM7.67 9.5a1 1 0 0 1-1.366.366l-2.598-1.5a1 1 0 1 1 1-1.732l2.598 1.5A1 1 0 0 1 7.67 9.5z"/></g></svg>'
        var cloudSync = document.querySelector('div[data-side="bottom"]').children[0].querySelector('div')
        cloudSync.click()
        await Sleep(100)
        while(cloudSync.children[1].innerText.indexOf('同步中') >= 0){
            await Sleep(500)
        }
        document.querySelector('button[aria-controls="radix-:r3:"]').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%; transform: translate3d(0px, 0px, 0px); content-visibility: visible;"><defs><clipPath id="__lottie_element_2"><rect width="20" height="20" x="0" y="0"></rect></clipPath></defs><g clip-path="url(#__lottie_element_2)"><g transform="matrix(-0.8660253882408142,-0.5,0.5,-0.8660253882408142,13.642932891845703,23.650253295898438)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,14.855999946594238,6.396999835968018)"><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" stroke="rgb(102,102,102)" stroke-opacity="1" stroke-width="1.5" d="M0 0"></path></g><g opacity="1" transform="matrix(1,0,0,1,5.103000164031982,13.602999687194824)"><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" stroke="rgb(102,102,102)" stroke-opacity="1" stroke-width="1.5" d="M0 0"></path></g><g opacity="1" transform="matrix(1,0,0,1,9.979999542236328,14.375)"><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" stroke="rgb(102,102,102)" stroke-opacity="1" stroke-width="1.5" d="M0 0"></path></g><g opacity="1" transform="matrix(1,0,0,1,9.979999542236328,5.625)"><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" stroke="rgb(102,102,102)" stroke-opacity="1" stroke-width="1.5" d="M0 0"></path></g></g><g transform="matrix(1,0,0,1,0.19800090789794922,2.553999900817871)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,9.295999526977539,8.26200008392334)"><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" stroke="rgb(47,143,190)" stroke-opacity="1" stroke-width="1.5" d=" M-3.8910000324249268,0.7039999961853027 C-2.493000030517578,2.4159998893737793 -0.7799999713897705,4.51200008392334 -0.7799999713897705,4.51200008392334 C-0.7799999713897705,4.51200008392334 5.546000003814697,-4.51200008392334 5.546000003814697,-4.51200008392334"></path></g></g><g transform="matrix(1,0,0,1,14.289999961853027,1.3380000591278076)" opacity="1" style="display: block;"><g opacity="1" transform="matrix(1,0,0,1,2.2279999256134033,2.8580000400543213)"><path stroke-linecap="round" stroke-linejoin="round" fill-opacity="0" stroke="rgb(47,143,190)" stroke-opacity="1" stroke-width="1.5" d="M0 0"></path></g></g></g></svg>'
        await closeSidebar()
    }
    async function prepare(){
        var divs = document.querySelectorAll('div[class]')
        var flag = false
        for(var div in divs){
            if(divs[div].innerText == '待排程'){
                var unReady = divs[div]
                if(unReady.nextElementSibling.children.length > 1) flag = true
                break
            }
        }
        if(!flag) {
            console.log('prepare')
            await Sleep(1000)
            await prepare()
        }
    }
    async function main(){
        await prepare()
        await sync()
        setInterval(async function(){
            await sync()
        }, config.interval * 1000)

    }
    main()
})();