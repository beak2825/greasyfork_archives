// ==UserScript==
// @id             medicaldupeng
// @name           新浪微博上显示每篇博文的真实地址并点按钮复制方便传播 + 新浪微博视频下载
// @version        0.1.4
// @author         medicaldupeng
// @namespace      http://www.medicaldupeng.com/zh
// @description    渣浪微博上显示每篇博文的真实地址并点按钮复制方便传播 + 渣浪微博视频下载！作家方方：“微博有一种技术：就是你以为你发出去了，但其实没有人能看得到。自从知道有此一技术后，方明白：高科技作起恶来，一点不比瘟疫弱。”
// @include        *weibo.com*
// @exclude        *service*.weibo.com/*
// @exclude        *api.weibo.com*
// @grant          GM_setClipboard
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/399848/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E4%B8%8A%E6%98%BE%E7%A4%BA%E6%AF%8F%E7%AF%87%E5%8D%9A%E6%96%87%E7%9A%84%E7%9C%9F%E5%AE%9E%E5%9C%B0%E5%9D%80%E5%B9%B6%E7%82%B9%E6%8C%89%E9%92%AE%E5%A4%8D%E5%88%B6%E6%96%B9%E4%BE%BF%E4%BC%A0%E6%92%AD%20%2B%20%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/399848/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E4%B8%8A%E6%98%BE%E7%A4%BA%E6%AF%8F%E7%AF%87%E5%8D%9A%E6%96%87%E7%9A%84%E7%9C%9F%E5%AE%9E%E5%9C%B0%E5%9D%80%E5%B9%B6%E7%82%B9%E6%8C%89%E9%92%AE%E5%A4%8D%E5%88%B6%E6%96%B9%E4%BE%BF%E4%BC%A0%E6%92%AD%20%2B%20%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this.addEventListener('load', function() {
            console.log('XHR finished loading', method, url);
            display();
        });

        this.addEventListener('error', function() {
            console.log('XHR errored out', method, url);
        });
        origOpen.apply(this, arguments);
    };
})();

unsafeWindow.copyOut = function(thisNode){
    let code = thisNode.previousElementSibling.textContent.trim();
    GM_setClipboard(code);
}

function display(){
    var weiboNodes = document.querySelectorAll('div.WB_handle');

    for (var i=0; i<weiboNodes.length; i++){
        try {
            var eachUrl = weiboNodes[i].querySelector('ul > li:nth-child(2) > a').getAttribute('action-data').split('&url=')[1].split('&')[0].trim();
            var eachMid = weiboNodes[i].querySelector('ul > li:nth-child(2) > a').getAttribute('action-data').split('&mid=')[1].split('&')[0].trim();
            if (weiboNodes[i].querySelector('span.each') == null){
                weiboNodes[i].innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;<span class="each">' + eachUrl + '</span>&nbsp;&nbsp;&nbsp;&nbsp;<button onclick = "copyOut(this); this.style.background=\'rgba(252,180,41,0.8)\';">拷此微博链接</button>';
                weiboNodes[i].innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;<a style="color: rgba(252,180,41,0.8);" href="javascript:void(0);" node-type="" action-type="fl_reEdit" action-data="isReEdit=1&amp;mid=' + eachMid + '&amp;domain=&amp;is_ori=1&amp;can_edit=1" suda-uatrack="">编辑微博</a>';
            }
            if (weiboNodes[i].parentNode.previousElementSibling.querySelector('li.WB_video') != null){

                let videoUrl = decodeURIComponent(decodeURIComponent(weiboNodes[i].parentNode.previousElementSibling.querySelector('li.WB_video').getAttribute('video-sources').replace('fluency=','')));

                //let pattern = /http.+&480=(http.+,video?)&720=(http.+,video?)*&1080=(http.+,video?)*.+/g;
                let pattern = /(http.+,video)?&\d+=(http.+,video)?&\d+=(http.+,video)?&\d+=.+/g;
                let videoUrlList = pattern.exec(videoUrl);
                videoUrl = videoUrlList[videoUrlList.length - 1] == undefined ? videoUrlList[videoUrlList.length - 2] : videoUrlList[videoUrlList.length - 1];
                console.log(videoUrl);
                if (weiboNodes[i].querySelector('a.gotVideo') == null){
                    weiboNodes[i].innerHTML += '&nbsp;&nbsp;&nbsp;&nbsp;<a class="gotVideo" href="' + videoUrl + '" target="_blank" title="方方：“微博有一种技术：就是你以为你发出去了，但其实没有人能看得到。自从知道有此一技术后，方明白：高科技作起恶来，一点不比瘟疫弱。”">⇩ 视频下载 ⇩</a>';
                }
            }
        }
        catch(err){
            var eUrl = weiboNodes[i].querySelector('ul > li:nth-child(2) > a');
            console.info(eUrl);
        }
    }
}