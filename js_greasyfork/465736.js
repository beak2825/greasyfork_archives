// ==UserScript==
// @name         Youtube快捷鍵 for safari
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  a d q e f 快捷键
// @author       artlana
// @include      https://www.youtube.com/watch?*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @run-at       document-end
// @license MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465736/Youtube%E5%BF%AB%E6%8D%B7%E9%8D%B5%20for%20safari.user.js
// @updateURL https://update.greasyfork.org/scripts/465736/Youtube%E5%BF%AB%E6%8D%B7%E9%8D%B5%20for%20safari.meta.js
// ==/UserScript==

var timer

window.addEventListener("keydown", function(e) { //(用keydown因为要连续发)
    if ( e.keyCode == 13 ){                        //全屏鍵
        if (e.target.querySelector('video')){
            var fullSCRN = document.querySelector('button.ytp-fullscreen-button');
            fullSCRN.click();
        }
    }
    else if ( e.keyCode == 83 || (e.keyCode == 16 && e.location == 2) || e.keyCode == 73){                //s发暂停或播放  or shift
        if (e.target.querySelector('video')){
            vipau();
        }
        else{
            if (e.target.querySelector('#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container > div.ytp-progress-bar > div.ytp-chapters-container')){  //进度条激活
                vipau();
            }
            else if (e.target.querySelector('div.ytp-volume-slider')){
                vipau();
            }
            else if(e.target instanceof HTMLButtonElement){  //按钮激活
                vipau();
            }
        }
    }
    else if ( e.keyCode == 65 ){                    //a发左键
        if (e.target.querySelector('video')){
            vimi();
        }
        else{
            if (e.target.querySelector('#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container > div.ytp-progress-bar > div.ytp-chapters-container')){
                vimi();
            }
            else if (e.target.querySelector('div.ytp-volume-slider')){
                vipau();
            }
            else if(e.target instanceof HTMLButtonElement){
                vimi();
            }
        }
    }
    else if ( e.keyCode == 68 ){                //d发右键
        if (e.target.querySelector('video')){
            vipl();
        }
        else{
            if (e.target.querySelector('#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container > div.ytp-progress-bar > div.ytp-chapters-container')){
                vipl();
            }
            else if (e.target.querySelector('div.ytp-volume-slider')){
                vipau();
            }
            else if(e.target instanceof HTMLButtonElement){
                vipl();
            }
        }
    }
    else if ( e.keyCode == 81 ){                //q音量低
        if (e.target.querySelector('video')){
            vivoldn();
        }
        else{
            if (e.target.querySelector('#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container > div.ytp-progress-bar > div.ytp-chapters-container')){
                vivoldn();
            }
            else if (e.target.querySelector('div.ytp-volume-slider')){
                vivoldn();
            }
            else if(e.target instanceof HTMLButtonElement){
                vivoldn();
            }
        }
    }
    else if ( e.keyCode == 69 ){                //e音量高
        if (e.target.querySelector('video')){
            vivolup();
        }
        else{
            if (e.target.querySelector('#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container > div.ytp-progress-bar > div.ytp-chapters-container')){
                vivolup();
            }
            else if (e.target.querySelector('div.ytp-volume-slider')){
                vivolup();
            }
            else if(e.target instanceof HTMLButtonElement){
                vivolup();
            }
        }
    }
    /*else if (e.keycode == 71){  //liner聚焦笔记  h键        这个键是不是被占用了，没反应？？？？？？？
         setTimeout(function() {
            document.querySelector("#movie_player > div.lytb-comment-box").style.display="block";
        }, 0);
        setTimeout(function() {
            document.querySelector("#movie_player > div.lytb-comment-box").focus();     focus不行？？？？？？
        }, 100);
    }*/

    //j l 74 76

    else if ( e.keyCode == 85 ){                //u发右键
        if (e.target.querySelector('#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container > div.ytp-progress-bar > div.ytp-chapters-container')){
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.cancelBubble = true;
            vimi3();
        }
    }
    else if ( e.keyCode == 79 ){                //o发右键
        if (e.target.querySelector('#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container > div.ytp-progress-bar > div.ytp-chapters-container')){
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.cancelBubble = true;
            vipl3();
        }

    }
});


function vimi(){
    event.preventDefault();
    var vi = document.querySelector("#movie_player > div.html5-video-container > video")
    var vit=vi.currentTime;
    vi.currentTime=vit-5;

    blinking(vi);
}

function vipl(){
    event.preventDefault();
    var vi = document.querySelector("#movie_player > div.html5-video-container > video")
    var vit=vi.currentTime;
    vi.currentTime=vit+5;

    blinking(vi);
}

function vipau (){
    event.preventDefault();
    var vi = document.querySelector("#movie_player > div.html5-video-container > video")
    if(vi.paused){
        vi.play();
    }else{
        vi.pause();
    }

    blinking(vi);
}

function vivoldn(){
    event.preventDefault();
    var vi = document.getElementsByClassName("video-stream")[0]
    try{
        var vit = vi.volume;
        vi.volume=vit-0.15;
    }
    catch{  //超過就直接設邊界值
        vi.volume=0;
    }
}
function vivolup(){
    event.preventDefault();
    var vi = document.getElementsByClassName("video-stream")[0]
    try{
        var vit = vi.volume;
        vi.volume=vit+0.15;
    }
    catch{
        vi.volume=1;
    }
}


function vitextup(){
    event.preventDefault();
    var caption = document.querySelector("#caption-window-1 > span >span>span");
    try{
        var size = caption.style.fontSize;
        size=size.replace('px', '');
        size=parseInt(size);
        size=size+10 + 'px';
        caption.style.fontSize=size;
    }
    catch{
        vi.volume=1;
    }
}

/*
function vimi2(){
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    var vi = document.querySelector("#movie_player > div.html5-video-container > video")
    var vit=vi.currentTime;
    vi.currentTime=vit-1;

    blinking(vi);
}

function vipl2(){
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    var vi = document.querySelector("#movie_player > div.html5-video-container > video")
    var vit=vi.currentTime;
    vi.currentTime=vit+1;

    blinking(vi);
}*/

function vimi3(){
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    var vi = document.querySelector("#movie_player > div.html5-video-container > video")
    var vit=vi.currentTime;
    vi.currentTime=vit-0.3;

    blinking(vi);
}

function vipl3(){
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    var vi = document.querySelector("#movie_player > div.html5-video-container > video")
    var vit=vi.currentTime;
    vi.currentTime=vit+0.3;

    blinking(vi);
}

function blinking(vi){
    var timer = setTimeout(function(){
        vi.style.opacity=0.9
    }, 10);
    var timer2 = setTimeout(function(){
        vi.style.opacity=1
    }, 100);
}

//data64 音效接口
function beep() {
    var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
}

/*
//聚焦文本框鍵        //但是会ALTTAB时触发
window.addEventListener("keyup", function(e) {
    if ( e.keyCode == 9 ){
        document.querySelector('input#search.ytd-searchbox').focus();
    }

});
*/