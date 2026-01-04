// ==UserScript==
// @name         Copy A HarttleLand Post
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        *://harttle.land/*.html
// @require      https://cdn.bootcdn.net/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.min.js
// @grant        GM_notification
// @grant        GM_addValueChangeListener
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/418186/Copy%20A%20HarttleLand%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/418186/Copy%20A%20HarttleLand%20Post.meta.js
// ==/UserScript==

(function() {
    let el = createPanel()
    document.body.appendChild(el)

    function copyContent() {
        console.log('copyBody called with', ...arguments)
        let content = document.querySelector('.container .content .md')
        content.querySelectorAll('.MJX_Assistive_MathML').forEach(x => x.remove())

        let jumbo = document.querySelector('.jumbotron')
        jumbo.querySelector('time').remove()
        jumbo.querySelector('.author').remove()
        jumbo.setAttribute('style', 'width: ' + jumbo.clientHeight * 2.35 + 'px; box-sizing: border-box;')
        jumbo.querySelector('.tag-list').setAttribute('style', 'margin-left: 0;')

        html2canvas(jumbo).then(function(canvas) {
            let img = document.createElement('img')
            img.setAttribute('src', canvas.toDataURL())
            content.insertBefore(img, content.firstChild);
            copyElement(content)
        })
    }

    function createPanel() {
        let panel = document.createElement('div')
        panel.style.position = 'fixed'
        panel.style.left = 0
        panel.style.top = 0
        panel.style.zIndex = 100000

        let btnCopy = document.createElement('button')
        btnCopy.innerText = '拷贝内容'
        btnCopy.addEventListener('click', copyContent)
        panel.appendChild(btnCopy)
        return panel
    }

    function copyElement(el) {
        var range = document.createRange();
        range.selectNode(el);
        window.getSelection().addRange(range);
        try {
            // Now that we've selected the anchor text, execute the copy command
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copy email command was ' + msg);
        } catch(err) {
            console.log('Oops, unable to copy');
        }
        // Remove the selections - NOTE: Should use
        // removeRange(range) when it is supported
        window.getSelection().removeAllRanges();
    }
})();