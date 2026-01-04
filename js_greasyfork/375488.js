// ==UserScript==
// @name         PR Files Collapser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  It collapses files on Github PR view
// @author       Alex. U
// @match        https://github.com/*
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/375488/PR%20Files%20Collapser.user.js
// @updateURL https://update.greasyfork.org/scripts/375488/PR%20Files%20Collapser.meta.js
// ==/UserScript==

var filesLandingPage = () => {
    if (window.location.href.includes('files')) {
        renderCollapseAll()
    }
}

var setListener = () => {
  $(document).on('pjax:success', function(event, data, status, xhr, options) {
    if (window.location.href.match(/https:\/\/github.com\/[\D]+\/[\d]+\/files/g)) {
      renderCollapseAll()
    }
  });
}

var renderCollapseAll = () => {
    var zNode = document.createElement ('details')
    zNode.innerHTML = '<summary id="collapseAll" class="btn btn-sm" style="margin-left: 20px;"> Collapse all</summary>'

    $('.pr-review-tools')[0].append(zNode)
    $('.pr-review-tools').css('display', 'flex')

    document.getElementById('collapseAll').addEventListener('click', (event) => {
        document.querySelectorAll('button.js-details-target').forEach(button => button.click())
    })
}

(() => {
    console.info("Github Files Collapser Injected")
    filesLandingPage()
    setListener()
})()