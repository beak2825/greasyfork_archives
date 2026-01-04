// ==UserScript==
// @name        学城某空间隐藏内容开启
// @namespace   Violentmonkey Scripts
// @match       https://km.sankuai.com/page/*
// @grant       none
// @version     2.4
// @author      K
// @poweredBy   众&康
// @license MIT
// @description 2022/3/29 10:03:44
// @downloadURL https://update.greasyfork.org/scripts/442283/%E5%AD%A6%E5%9F%8E%E6%9F%90%E7%A9%BA%E9%97%B4%E9%9A%90%E8%97%8F%E5%86%85%E5%AE%B9%E5%BC%80%E5%90%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/442283/%E5%AD%A6%E5%9F%8E%E6%9F%90%E7%A9%BA%E9%97%B4%E9%9A%90%E8%97%8F%E5%86%85%E5%AE%B9%E5%BC%80%E5%90%AF.meta.js
// ==/UserScript==
(function(){

  let historyContent = '';
  let timer = '';

  const sniffer = function(){

    // console.log('sniffer is work!')

    const placeholderElement = document.querySelector('.ct-html')
    if(!placeholderElement)return;

    const content = placeholderElement.dataset.content

    if(content == historyContent) return;

    historyContent = content

    if(!content.includes('geekbang')) return;

    makeMagic(placeholderElement);

  }

  function makeMagic(placeholderElement){

    console.log('Magic is work!')

    if(!placeholderElement) return;
    
    const fcontent = placeholderElement.dataset.content.replaceAll(/<(script|Dialog)(.*?)>/g,'&lt;$1$2&gt;')
    const content = fcontent.replaceAll(/<code[\s\S]*?>([\s\S]*?)<\/code>/g, (match, $1) => {
       return $1.replaceAll('<', '&lt').replaceAll('>', "&gt")
    })
    const clearScript = '<script>document.body.innerHTML=""</script>'
    const data = clearScript + content
    const message = JSON.stringify({op:'insert',data})
    document.querySelector('iframe').contentWindow.postMessage(message,'*')

  }
  
  // let`s go!
  timer = setInterval(sniffer, 1000)

})()