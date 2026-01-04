// ==UserScript==
// @name         hulunoteLinkAreaSwitch
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  切换 葫芦笔记下面的链接区的显示与否
// @author       You
// @match        https://www.hulunote.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418116/hulunoteLinkAreaSwitch.user.js
// @updateURL https://update.greasyfork.org/scripts/418116/hulunoteLinkAreaSwitch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("hulunoteLinkAreaSwitch ... ...");
    var findEditorHandle=null;
    function findEditor() {
        var element=document.querySelector("div#link-pages");
        if(null !== element) {
            console.log("found");
            if(null !== findEditorHandle) {
                window.clearInterval(findEditorHandle);
            }
            findDoubleLinkDiv(element);
        }
        console.log("not found");
    }
    //李锋:#main-editor.div+div
    var eyeOpen="<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAKxJREFUOI1jYBgKgIVUDeJA/BGI/2PBbYQ070JSvA2IOYB4LpLYWSjNi03zTSC+CGWDFLFjccEpIFbBZkgxEL+CspmgCuZiMeA1VI0GlA8HT4E4DomPzf8gXImmBgWABBSh7BAsmn8iqQW5ZBa6AUJQhRlQvigQnwDiF0BcARVjhhq0D10zundABrUDsRrUoAAgvg8V98WnGQZAAdnCAImZl0C8FYgtidE4EgEA2S0+kWawhvwAAAAASUVORK5CYII=' />";
    var eyeClose="<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAHtJREFUOI1jYBgFVANryNCzAZnjCMT/gZiNCI3MULWO6BKaUIkYPJp9oGqUsEmCJEyA+DmUXQXEQkAsCMQlULFbQGwMZTMia3YHYgckPisQ/wPia1D8D02DPRBb4HEpQwsQtyLxm4C4Hp8GdNDHAAksGADZXkiKASMJAABzlRXGuzPfsQAAAABJRU5ErkJggg==' />";
    var btn=null;
    function findDoubleLinkDiv(editor) {
        var targetBtn=document.querySelector("#btnLinkAreaSwitch");
        console.log(targetBtn);
        if(null===targetBtn) {
            btn=document.createElement("div");
            btn.id="btnLinkAreaSwitch";
            btn.className="mt3";
            btn.innerHTML=eyeOpen;
            btn.addEventListener("click", function(){
                updateStatus(this);
            });
            editor.insertBefore(btn,editor.childNodes[0]);
        }
        restoreStatus(btn);
    }
    function updateStatus(btn) {
        var content=btn.nextSibling;
        var disp=localStorage.getItem('hulunoteLinkAreaDisp');
        if(null===disp) {
            disp="";
        }
        if("none"!==disp) {
            disp="none";
            btn.innerHTML=eyeClose;
        } else {
            disp="";
            btn.innerHTML=eyeOpen;
        }
        content.style.display=disp;
        localStorage.setItem('hulunoteLinkAreaDisp', disp);
    }
    function restoreStatus(btn) {
        var content=btn.nextSibling;
        var disp=localStorage.getItem('hulunoteLinkAreaDisp');
        if(null===disp) {
            disp="";
        }
        if("none"===disp) {
            btn.innerHTML=eyeClose;
        } else {
            btn.innerHTML=eyeOpen;
        }
        content.style.display=disp;
    }
    function check() {
        var url=window.location.href;
        //console.log(url);
        //var pattern = /https://www.hulunote.com/(.^/)/([\w-])+/show/([\w-])+/([\w-])+/;
        //var pattern = /([\w-])+/show/([\w-])+/([\w-])+/g;
        //console.log(pattern.test(url));

        if(url.indexOf('/show/')==(-1)) {
            //console.log('not target page');
            return;
        }
        //console.log('find target page');
        findEditorHandle=window.setInterval(findEditor,1000);
    }

    window.addEventListener('hashchange',function(event){
        //console.log('hashchange' + event);
        check()
    })
    /*window.addEventListener('pushState', function(e) {
        console.log('change pushState');
    });
    window.addEventListener('replaceState', function(e) {
        console.log('change replaceState');
    });*/
    check();
})();