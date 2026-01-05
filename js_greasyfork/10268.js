// ==UserScript==
// @name         Ex-Hentai: Frame Popups
// @namespace    Org.Jixun
// @version      0.2
// @description  Embed popup window instead of another window.
// @author       Jixun
// @include      http://exhentai.org/g/*
// @include      http://g.e-hentai.org/g/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10268/Ex-Hentai%3A%20Frame%20Popups.user.js
// @updateURL https://update.greasyfork.org/scripts/10268/Ex-Hentai%3A%20Frame%20Popups.meta.js
// ==/UserScript==

////////////////////////////////////////////////
///                                 样式表   ///
////////////////////////////////////////////////
var style = document.createElement('style');
style.textContent = (function(){/*
#lb-oberlay {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 100000;
    overflow: hidden;
    background: rgba(35,35,35,.7);
}

#lb-frame {
    box-shadow: 5px 5px 10px black;
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 100001;
    border: 0;
}
*/}).toString().slice(15,-4);
document.head.appendChild(style);

////////////////////////////////////////////////
///                           重叠元素就绪   ///
////////////////////////////////////////////////
var oberlay = document.createElement('div');
oberlay.id='lb-oberlay';
oberlay.style.display = 'none';

var popup = document.createElement('iframe');
popup.id  = 'lb-frame';
popup.style.display = 'none';
popup.setAttribute('seamless', true);

document.body.appendChild(oberlay);
document.body.appendChild(popup);

////////////////////////////////////////////////
///                           绑定元素事件   ///
////////////////////////////////////////////////
function hideOberlay () {
    oberlay.style.display = popup.style.display = 'none';
}
oberlay.onclick = hideOberlay;
popup.onload = function () {
    var wnd = popup.contentWindow;
    wnd.close = hideOberlay;
    
    [].map.call(wnd.document.querySelectorAll('[style*="height"]'), function (x) {
        x.style.height = '';
    });
};

////////////////////////////////////////////////
///                            仿 LightBox   ///
////////////////////////////////////////////////
window.popUp = function (url, w, h) {
    // 强行重写 /w\
    w += 20;
    h += 20;
    
    if (popup.src != url)
        popup.src = url;
    
    popup.style.width  = w + 'px';
    popup.style.height = h + 'px';
    popup.style.marginLeft = -w/2 + 'px';
    popup.style.marginTop  = -h/2 + 'px';
    oberlay.style.display = popup.style.display = 'block';
};