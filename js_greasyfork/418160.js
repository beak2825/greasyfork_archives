// ==UserScript==
// @name         Web工具箱
// @namespace    https://github.com/zhchjiang95/WebPage-Tools
// @version      1.0.5
// @description  按需调整或精简了网站。
// @author       zhchjiang95 <i@fiume.cn>
// @include	     *://www.baidu.com/*
// @include	     *://segmentfault.com*
// @include        *://www.yuque.com/*
// @include        *://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418160/Web%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/418160/Web%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==


window.onload = () => {
    switch(location.host){
       case 'www.baidu.com':
            var num = true
            var flag = location.pathname !== '/s'
            var repair = () => {
                if(location.pathname !== '/s') return
                num = false
                var s = document.createElement('style')
                s.innerHTML = 'a{text-decoration: none}'
                document.body.append(s)
                document.querySelector('#content_left').style.width = '100%'
                document.querySelector('#s_tab').style.paddingTop = '76px'
                document.querySelector('#head').style.boxShadow = '0 0 2px #e6e6e6'
                document.querySelector('.new-pmd.c-container').classList.add('fiume-cn')
                document.querySelectorAll('.new-pmd.c-container').forEach(v => {
                    v.style.width = '100%'
                    v.style.borderBottom = '1px solid #f1f0f6'
                    v.style.paddingBottom = '14px'
                })
                document.querySelector('#content_right')?.remove()
                document.querySelector('#foot')?.remove()
                document.querySelector('.result-op.c-container.new-pmd')?.remove()
                setTimeout(() => num = true, flag = false, 0)
            };
            var _self = document.createElement('iframe')
            document.body.append(_self)
            window.MutationObserver = _self.contentWindow.MutationObserver
            _self.remove()
            new MutationObserver(() => { num&&(flag?setTimeout(() => {repair()}, 1000):repair()) }).observe(document.body, { childList: true, attributes: true })
       break;
       case 'segmentfault.com':
            document.querySelector('div').id = 'SFUserId'
       break;
       case 'www.yuque.com':
            if(window.appData.settings.disableDocumentCopy){
                var el = document.querySelector('.WithToc-module_article_2_rhk')
                var html = el.innerHTML
                el.id = 'fiumeCn'
                el.childNodes[0].remove()
                setTimeout(() => el.innerHTML = html, 600)
            }
       break;
       case 'www.bilibili.com':
            var menu = null
            new MutationObserver(() => {
                menu = document.querySelector('.bilibili-player-video-btn-speed-menu')
                if(menu){
                    if(menu.dataset.jt === 'fiume.cn') return
                    var speed = ['0.5','0.75','1','1.25','1.5','2','2.5','3','3.5']
                    menu.dataset.jt = 'fiume.cn'
                    while(menu.hasChildNodes()){ menu.removeChild(menu.firstChild) }
                    menu.onclick = function(e){
                        this.querySelector('.bilibili-player-active')?.classList.remove('bilibili-player-active')
                        e.target.classList.add('bilibili-player-active')
                        document.querySelector('video').playbackRate = e.target.dataset.value
                        document.querySelector('.bilibili-player-video-btn-speed-name').innerText = e.target.innerText
                    }
                    speed.forEach(function(v){
                        var li = document.createElement('li')
                        li.classList.add('bilibili-player-video-btn-speed-menu-list')
                        li.dataset.value = v
                        li.innerText = v + 'x'
                        menu.prepend(li)
                    })
                }
            }).observe(document.body, { childList: true })
       break;
    }
}