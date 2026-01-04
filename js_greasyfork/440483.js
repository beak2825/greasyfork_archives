// ==UserScript==
// @name         💊 百度clear
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  百度清理、界面美化
// @author       zhangzhihao
// @license MIT
// @match        https://www.baidu.com/*
// @match        http://www.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440483/%F0%9F%92%8A%20%E7%99%BE%E5%BA%A6clear.user.js
// @updateURL https://update.greasyfork.org/scripts/440483/%F0%9F%92%8A%20%E7%99%BE%E5%BA%A6clear.meta.js
// ==/UserScript==
(function(){
    const stylesheet = `
    *::-webkit-scrollbar {
        width: 16px;
        height: 16px;
    }
    *::-webkit-scrollbar-track:hover {
        visibility: visible;
        background: #f1f1f1;
    }
    *::-webkit-scrollbar-thumb:hover {
        visibility: visible;
        background: #a8a8a8;
    }
    *::-webkit-scrollbar-thumb {
        visibility: visible;
        background: #c1c1c1;
    }
    *::-webkit-scrollbar-track {
        visibility: visible;
        background: #f1f1f1;
    }
    #wrapper>#iframe--result-item {
      position: fixed;
      display: none;
      top: 70px;
      right: 20px;
      width: calc(100% - 800px);
      height: calc(100% - 70px);
      border: none;
      outline: none;
      background: white;
    }
    #content_left>* {
      top:0;
      transform: scale(1);
      transition:all 0.5s;
    }
    #content_left>*:hover {
      top:-6px;
      transform: scale(1.04);
    }
    `
    
    const init = () => {
        // 图片浏览器能打开，但img标签加载提示403
        const $meta = document.querySelector('meta[name="referrer"]') || document.createElement('meta')
        const $head = document.querySelector('head')
        $meta.name = 'referrer'
        $meta.content = "no-referrer"
        $head.insertBefore($meta, $head.children[0])
        // 加载个样式表好控制
        const $style = document.createElement('style')
        $style.innerText = stylesheet
        $head.appendChild($style)
        // 加个背景图
        const $wrapperWrapper = document.querySelector('#wrapper_wrapper')
        const $resultMolecule = document.querySelector('.result-molecule')
        Object.assign(
            $wrapperWrapper.style,
            {
                background: "#2b334a radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 2px) center center / 20px 20px repeat"
            }
        )
        Object.assign(
            $resultMolecule.style,
            {
                mixBlendMode: 'screen'
            }
        )
        // 结果栏加些样式
        const $adLeft = document.querySelector('#content_left')
        Object.assign(
            $adLeft.style,
            {
                "mix-blend-mode": 'hard-light'
            }
        )
        // 加个iframe用于快捷展示搜索结果内容
        const $wrapper = document.querySelector('#wrapper')
        const $detail = document.createElement('iframe')
        $detail.id = 'iframe--result-item'
        $detail.onload = e => {
            if ($detail.src) {
                $detail.style.display = 'block'
            }
        }
        $wrapper.appendChild($detail)
    }
    
    const clearAd = () => {
    
        const isSearchPortal = location.href.includes('www.baidu.com/s?')
    
        if (!isSearchPortal) return
    
        const $adRight = document.querySelector('#content_right')
        const $adLeft = document.querySelector('#content_left')
    
        // 左侧搜索结果列表去除广告
        $adLeft && Array.from($adLeft.querySelectorAll('*')).filter($a => $a.innerText === '广告').forEach($a => {
           const searchList = Array.from($adLeft.children)
           const $containedItem = searchList.find($item => $item.contains($a))
           $containedItem && $adLeft.removeChild($containedItem);
        })
        // 搜索结果列表beautify
        $adLeft && Array.from($adLeft.children).forEach($item => {
            // 所属网站
           const $avatar = $item.querySelector('.user-avatar')
           const $avatarLink = $avatar && $avatar.querySelector('a')
           const iconUrl = $avatarLink?.querySelector('img')?.src || '' // 有些已经提供了图标不用单独请求
           // 标题
           const $t = $item.querySelector('.t')
           const $tLink = $t && $t.querySelector('a')
           const $isAdded = $item.querySelector('#CUSTOM_ICO')
           // 为标题添加ico
           if (($tLink && $tLink.href || iconUrl) && !$isAdded){
               const link = $tLink.href
               const $ico = document.createElement('img')
               $ico.src = iconUrl
               $ico.id = 'CUSTOM_ICO'
               $ico.style = `
               position: absolute;
               right: 8px;
               bottom: 8px;
               height: 32px;
               width: auto;
               cursor: pointer;`
               $ico.onclick = e => {
                   const $detail = document.querySelector('#iframe--result-item')
                   $detail.style.display = 'none'
                   $detail.src = link
               }
               $ico.onerror = e => {
                   $ico.src = ''
               }
               $item.appendChild($ico)
               if (!iconUrl) {
                   const controller = new AbortController();
                   const signal = controller.signal;
                   // 资源请求失败会导致导致浏览器tab一直提示加载，5s手动关闭
                   setTimeout(window.stop, 5000);
                   const fetchIcon = fetch(link, { signal }).then(async res => {
                       const { url: targetLink } = res
                       const { origin, protocol } = new URL(targetLink)
                       const htmlStr = await res.text()
                       const icoUrl = htmlStr.match(/<link [^<>]*rel="\w*\s?icon\s*" [^<>]+\/?>/gim)?.pop()?.replace(/.*\s+href="([^""'']+)".*/gim, '$1')
                       if (icoUrl){
                           const isAbsolute = icoUrl.startsWith('http')
                           const isMissProtocol = icoUrl.startsWith('//') // 没有写协议头
                           const urlTmp = isAbsolute ? icoUrl : isMissProtocol ? `${protocol}${icoUrl}` : new URL(icoUrl, origin).href
                           $ico.src = urlTmp
                       } else {
                           // 瞎蒙一个，没有设置声明的浏览器会自动找这个路径去展示，还显示不了拉倒
                           $ico.src = `${origin}/favicon.ico`
                       }
                   }).catch(e => {
                       // 获取不到目标页面直接删掉这条记录，无意义
                       $item.parentNode.removeChild($item)
                   })
                   Promise.race([
                       fetchIcon,
                       new Promise((resolve, reject) => setTimeout(reject, 5000))
                   ]).catch(_ => {
                       // 请求超时关闭请求
                       controller.abort()
                   })
               }
           }
           // 修改搜索结果标题样式
           if ( $t) {
               if ($tLink) {
                   //$tLink.innerHTML = $tLink.innerText
               }
               Object.assign(
                   $t.style,
                   {
                       fontWeight: 'bold',
                   }
               )
           }
            // 修改搜索结果项样式
            Object.assign(
                $item.style,
                {
                    position: 'relative',
                    borderRadius: "12px",
                    padding: "16px",
                    minWidth:"560px",
                    background: "#fff"
                }
            )
        })
    
        // 右侧推广栏清除
        $adRight && $adRight.parentNode && $adRight.parentNode.removeChild($adRight)
    }
    if (MutationObserver) {
        const observer = new MutationObserver(clearAd)
        const target = document.querySelector('#content_left') || document.body
        observer.observe(target, {
            childList: true
        })
    } else {
       document.addEventListener('DOMNodeInserted',clearAd )
    }
    self.requestAnimationFrame(() => {
        init()
        clearAd()
    });
})();