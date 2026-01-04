// ==UserScript==
// @name         Enable Picture In Picture For Every Sites ( 启用画中画 )
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  enable the picture in picture feature by holding down mouse for 1 second
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388027/Enable%20Picture%20In%20Picture%20For%20Every%20Sites%20%28%20%E5%90%AF%E7%94%A8%E7%94%BB%E4%B8%AD%E7%94%BB%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/388027/Enable%20Picture%20In%20Picture%20For%20Every%20Sites%20%28%20%E5%90%AF%E7%94%A8%E7%94%BB%E4%B8%AD%E7%94%BB%20%29.meta.js
// ==/UserScript==

(function (){
    let videos = [],
        retry = true,
        timer = void(0),
        e_path = [],
        v_exist = false,
        target = void(0);

    function enable_pip(element){
        if (!document.pictureInPictureEnabled) {
            alert('Your Browser Does Not Support Picrue In Picture!')
        }
        element.disablePictureInPicture = false;
        element.requestPictureInPicture().then().catch(()=>{
            if(retry){
                retry = false;
                enable_pip(element);
            }else{
                console.log('unable to enable picture in picture\ncheck the browser');
            }
        })
    }

    function pause(ele){
        if(!window.location.href.includes('bilibili')){
            ele.pause();
        }else{
            ele.pause();
        }
    }

    document.onmousedown = (element)=>{
        timer = setTimeout(()=>{
            if(document.pictureInPictureElement){
                document.exitPictureInPicture();
                pause(target);
            }else{
                e_path = element.path;
                for(let i = 0;i<e_path.length;i++){
                    if(e_path[i].nodeName === 'VIDEO'){
                        v_exist = true;
                        target = e_path[i];
                        enable_pip(target);
                        pause(target);
                        console.log('PIP activated');
                    }
                }
                if(!v_exist){
                    console.log('no video exists in this path')
                }
            }
        },1000)
    }
    document.addEventListener('mouseup',()=>{
        clearTimeout(timer);
    })
})()