// ==UserScript==
// @name         谷歌翻译绕过代码块(适配github,mathworks等)
// @version      0.1
// @description  让谷歌翻译插件翻译网页的时候，绕过代码块和一些无需翻译的元素
// @match        http*://*/*
// @match        localhost:*
// @match        127.0.0.1:*
// @match        *
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/1039753
// @downloadURL https://update.greasyfork.org/scripts/464193/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E7%BB%95%E8%BF%87%E4%BB%A3%E7%A0%81%E5%9D%97%28%E9%80%82%E9%85%8Dgithub%2Cmathworks%E7%AD%89%29.user.js
// @updateURL https://update.greasyfork.org/scripts/464193/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E7%BB%95%E8%BF%87%E4%BB%A3%E7%A0%81%E5%9D%97%28%E9%80%82%E9%85%8Dgithub%2Cmathworks%E7%AD%89%29.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
(function () {
    'use strict'

    function noTranslate (array) {
        array.forEach((name) => {
            [...document.querySelectorAll(name)].forEach(node => {
                if (node.className.indexOf('notranslate') === -1) {
                    node.classList.add('notranslate')
                }
            })
        })
    }

    const bypassSelectorArray = [
        'pre',
        'code',
        '.prism-code',
        '.codeinput',
        '.CodeMirror-sizer',
        '.CodeMirror-lines',
        '.CodeMirror-scroll',
        '.CodeMirror-line',
        '.enlighter'
    ]
    if (window.location.hostname.indexOf("github") !== -1) {
        // 如果是github 还需要处理一些别的元素
        const githubSelector = [
            '.bg-gray-light.pt-3.hide-full-screen.mb-5',
            'summary.btn.css-truncate',
            '.commit-author',
            '.js-navigation-open.link-gray-dark',
            '.Box-title',
            '.d-flex',
            '.file-navigation.mb-3.d-flex',
            '.pt-3',
            '.Box-row',
            '.Box-header',
            '.BorderGrid-cell > div.mt-3 > a.muted-link',
            '.BorderGrid-cell > ul.list-style-none',
        ]
        bypassSelectorArray.push.apply(bypassSelectorArray, githubSelector)

        //如果还有github的插件 还需要延迟追加一些
        setTimeout(function () {
            const githubPluginSelector = [
                '.github-repo-size-div',
                '.octotree-tree-view'
            ]
            noTranslate(githubPluginSelector)
        }, 3000)
    }
    if (window.location.hostname.indexOf("mathworks") !== -1) {
        // 如果是mathworks
        const mathworksSelector = [
            '.codeinput',
            '.code_responsive',
            '.inlineequation',
            'inline'
        ]
        bypassSelectorArray.push.apply(bypassSelectorArray, mathworksSelector)
    }

    if (window.location.hostname.indexOf("threejsfundamentals") !== -1) {

      // 如果是threejsfundamentals
       const mathworksSelector = [
           '.threejs_example_container',
       ]
       bypassSelectorArray.push.apply(bypassSelectorArray, mathworksSelector)
    }

    if (window.location.hostname.indexOf("kodeco.com") !== -1) {

      // 如果是threejsfundamentals
       const mathworksSelector = [
           'pre.language-swift',
       ]
       bypassSelectorArray.push.apply(bypassSelectorArray, mathworksSelector)
    }

    noTranslate(bypassSelectorArray)
    // mathjax延迟加载
    setTimeout(function () {
      const Selector = ['.math','.MathJax','.MathJax_Display','.MathRow','.MathEquation','.CodeBlock']
      noTranslate(Selector)
  }, 4000)
})()