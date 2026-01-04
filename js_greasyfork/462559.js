// ==UserScript==
// @name         牛客反引流
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  阐述ylg的梦
// @author       You
// @match        https://www.nowcoder.com/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nowcoder.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462559/%E7%89%9B%E5%AE%A2%E5%8F%8D%E5%BC%95%E6%B5%81.user.js
// @updateURL https://update.greasyfork.org/scripts/462559/%E7%89%9B%E5%AE%A2%E5%8F%8D%E5%BC%95%E6%B5%81.meta.js
// ==/UserScript==



//添加需要ban掉的文字
var banned_words = ["OPPO","引流","得物","美的","SONY","医疗","银行"]

//添加各类对话框的ClassName
var FrameClassList = ["tw-bg-white tw-rounded-b-xl","tw-bg-white tw-mt-3 tw-rounded-xl",'tw-px-5 tw-pb-5 tw-pt-5']

//添加各类Text的ClassName
var TextClass = 'vue-ellipsis-js-content-text'



/*
判断文本框内是否有禁止的文字
*/
function checkText(text_Field){
    for (var i in text_Field){
        var content = text_Field[i].innerText
        if (content == undefined){
            return false
        }
        content = content.toLocaleUpperCase()
      //  console.log(content)
        for (var j in banned_words){
            if(content.search(banned_words[j]) != -1){
                return true
            }
        }
    }
    return false
}

function RemoveFrame(frame){
    frame.parentElement.removeChild(frame)
}

function Clear(FrameClass, TextClass){
    var Frames = document.getElementsByClassName(FrameClass)

    //等页面加载出来
    if(Frames.length <= 3) return

    for (var i in FrameClass){
        var frame = Frames[i]
        if(frame == undefined){
            continue
        }
        var text_field = frame.getElementsByClassName(TextClass)

        if(checkText(text_field)){
            RemoveFrame(frame)
        }
    }
    Frames = document.getElementsByClassName(FrameClass)
    return Frames.length
}



function MainThread(){
    var len = 0
    for (var i in FrameClassList){
        var FrameClass = FrameClassList[i]
        len += Clear(FrameClass, TextClass)
    }
   // console.log(len)

}


//1秒1次
(function x() {
    MainThread()
    setInterval(MainThread, 1000)
})();