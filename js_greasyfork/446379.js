// ==UserScript==
// @name         油管字幕放到视频下方
// @namespace    0xFF336699
// @version      0.1.1
// @description  油管字幕在视频上，看起来不舒服，挪到视频下方了。字幕插件地址 https://chrome.google.com/webstore/detail/language-reactor/hoombieeljmmljlkjmnheibnpciblicm
// @author       You
// @match        https://www.youtube.com/*
// @match        https://www.youtube.com
// @run-at document-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant unsafeWindow
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/446379/%E6%B2%B9%E7%AE%A1%E5%AD%97%E5%B9%95%E6%94%BE%E5%88%B0%E8%A7%86%E9%A2%91%E4%B8%8B%E6%96%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/446379/%E6%B2%B9%E7%AE%A1%E5%AD%97%E5%B9%95%E6%94%BE%E5%88%B0%E8%A7%86%E9%A2%91%E4%B8%8B%E6%96%B9.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Your code here...
    let changed = false;
    let outerHtml;
    let root;
    let bottomParent;
    let caption;
    later();
    function later(){
        setTimeout(()=>{
            checkCaption();
        }, 100 * 3);
    }
    function checkCaption(){
        if(changed)return;
        root = document.querySelector("#primary-inner");
        if(!root)return later();
        //const uncle = document.querySelector("#primary-inner").querySelector("#info");
        var uncle = document.querySelector("#primary-inner").querySelector("#playerclarify-box");
        var player = document.querySelector("#primary-inner").querySelector("#player");
        //console.log('uncle is', uncle);
        //console.log('player is', player);
        uncle = player
        if(!uncle)return later();
        caption = document.querySelector("#lln-bottom-panel");
        if(!caption)return later();
        if(!outerHtml){
            var br = document.createElement('br');
            br.setAttribute(
                'style',
                'background-color:"#FFFFFF";height:"1px";width:"100%";',
            )
            //player.parentNode.insertBefore(br, player.nextSibling);
            //player.appendChild(br);
            outerHtml = caption.interHTML;
        }
        const content = document.querySelector(".lln-youtube .lln-bottom-panel .lln-subs-wrap");
        if(!content)return later();
        const sub = document.querySelector(".lln-bottom-panel #lln-main-subs");
        if(!sub)return later();
        const subWrap = document.querySelector(".lln-bottom-panel .lln-subs-wrap");
        if(!subWrap)return later();
        const youtubebottommain = document.querySelector(".lln-youtube .lln-bottom-panel #lln-main-subs");
        if(!youtubebottommain)return later();
        const adj = document.querySelector(".lln-bottom-panel .lln-subs-font-adjust");
        if(!adj)return later();
        adj.setAttribute('style', 'padding-top:-15px');
        youtubebottommain.setAttribute('style', 'justify-content:flex-start');
        sub.setAttribute('style', 'justify-content:flex-start');
        document.querySelector("#lln-sub-view-wrap").parentElement.removeChild(document.querySelector("#lln-sub-view-wrap"));
        subWrap.setAttribute('style', 'padding-left: 20px;padding-right: 20px');
        content.setAttribute('style', 'padding-top:1px');
        caption.setAttribute('style', 'position:static;background-color:#6F6F6F;height:16rem');
        //root.insertBefore(caption,uncle);
        bottomParent = uncle.parentNode;
        //bottomParent.insertBefore(caption,uncle);
        bottomParent.insertBefore(caption,uncle.nextSibling);
        changed = true;
        console.log('changed');
    }
    function toFull(){
        var n = document.createElement("div");
        n.innerHTML = outerHtml;
        if(caption.parentNode == bottomParent){
            bottomParent.removeChild(caption);
        }
        root.appendChild(n);
    }
    document.addEventListener("fullscreenchange", function() {
        if(document.fullscreen){
            toFull();
        }else{
            changed = false;
            checkCaption();
        }
    });
    addWordMouseListner();
    function addWordMouseListner(){
        $(document).on("click", "span.lln-word.lln-hover-tooltip.top", function(e){
            if(isFullScreen())return;
            var word = e.target.innerText;
            var arr = word.split(/[\s\n]/);
            word = arr[arr.length-1];
            console.log('word is', word);
            var reg = /[^\x00-\x7F]+/
            if(reg.test(word))return;
            if(!word)return;
            var url = `https://dictionary.cambridge.org/dictionary/english-chinese-simplified/` + word;
            url = `https://www.bing.com/dict/search?q=` + word;
            var win = window.open(url, "Dictionary", "width=800,height=2090");
            //let div = document.getElementById('div');
            //let selection = window.getSelection();
            //let range = document.createRange();
            //range.selectNode(e.target);
            //selection.removeAllRanges();
            //selection.addRange(range);
            //selectElement($(e.currentTarget)[0]);
            setTimeout(function(){
                var evt = document.createEvent("MouseEvents");
                // evt.initMouseEvent("click", true, true, document, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
                evt.initMouseEvent("mouseup", true, true);
               // var bl = document.dispatchEvent(evt);
               // console.log('bl is', bl, window.getSelection().toString().trim(),3);
            },50);
        });
    }
    function isFullScreen() {
        return !! (
            document.fullscreen ||
            document.mozFullScreen ||
            document.webkitIsFullScreen ||
            document.webkitFullScreen ||
            document.msFullScreen
        );
    }
    // 窗口的大小和在屏幕中的位置，具体可以根据自己的显示器调整。
    let wo = window.open;
    window.open = open;
    let win
    function open(){
        //if(arguments[0].indexOf('https://dictionary.cambridge.org/dictionary') == -1){
            //return wo.apply(window, arguments);
        //}
        console.log('win open', arguments);
        if(arguments[0].indexOf('youtube.com') > -1){
            return wo.apply(window, arguments);
        }
        arguments[2] = 'width=800,height=2090';
        var w;
        try{
            w = wo.apply(window, arguments);
            if(w){
                win = w
                win.moveTo(3060, 0);
            }
        }catch(e){

        }
        return w;
    }
    window.onbeforeunload = function(){
        if(!win)return;
        win.close();
    }
    function onFullScreenClick(){
        const llnCloseVV = document.querySelector("#llnCloseVV");
        if(!llnCloseVV)return;
        var evt = document.createEvent("MouseEvents");
        // evt.initMouseEvent("click", true, true, document, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
        evt.initMouseEvent("click", true, true);
        var bl = llnCloseVV.dispatchEvent(evt);
    }

    document.addEventListener("fullscreenchange", function (e) {
        if (document.fullscreenElement) {
            console.log('进入全屏')
            onFullScreenClick();
        } else {
            console.log('退出全屏')
            onFullScreenExit();
        }
    })
    function onFullScreenExit(){
        const sidebar = document.querySelector(".lln-vv-toggle-in-sidebar");
        if(!sidebar)return;
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true);
        sidebar.dispatchEvent(evt);
    }
    //console.log('alert is', alert);
    var winAlert = window.alert;
    //window.alert = window.confirm = window.prompt = overrideAlert;
    function overrideAlert(content){
        console.log('on alert', content);
        if(content.indexOf('查看我们的 Facebook 粉丝页以追踪最新消息') > -1){
            console.log('blocked alert', content);
            return;
        }
        winAlert(content);
    }
    //alert('hehe');

    XMLHttpRequest.prototype.myOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        //console.log('url is', arguments);
        this.myOpen.apply(this, arguments);
    };

    function selectElement(element) {
        console.log('element is ', element);
        clearSelection();
        if (window.getSelection) {
            var sel = window.getSelection();
            sel.removeAllRanges();
            var range = document.createRange();
            //range.selectNodeContents(element);

            range.setStart(element, 0);
            range.setEnd(element, 1);
            sel.addRange(range);
        } else if (document.selection) {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(element);
            textRange.select();
        }
    }
    function clearSelection() {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else if (document.selection) {
            document.selection.empty();
        }
    }
})();









