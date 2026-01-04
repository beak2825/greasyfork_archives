// ==UserScript==
// @name         octoChargeInfoDecode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解密 octo ChargeInfo
// @author       wdd
// @match        https://octo.mws.sankuai.com/thrift-check*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankuai.com
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @require https://update.greasyfork.org/scripts/476008/1255570/waitForKeyElements%20gist%20port.js
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501643/octoChargeInfoDecode.user.js
// @updateURL https://update.greasyfork.org/scripts/501643/octoChargeInfoDecode.meta.js
// ==/UserScript==

console.log('成功加载本地文件...')
function log(s) {
    console.log("======wdd " + s);
}

var rendererDict = '#json-renderer2 > .json-dict'


function f() {
    log('find dict rendererDict')

    var chargeInfoKw = 'chargeInfo: "&'
    const chargeInfoLiList = $('.json-dict').find('li').filter(function() {
        return $(this).text().startsWith(chargeInfoKw);
      });
    

    log(chargeInfoLiList.length)
    chargeInfoLiList.each(function() {
        var chargeInfoTxt = $(this).text()
        log(chargeInfoTxt)
        if(chargeInfoTxt != 'chargeInfo: null,') {
            var span = $(this).find('span');
            const spanContent = span.text();
            var chargeInfo = spanContent.slice(1, -1);
        
            var link = `https://mlog.51ping.com/log?act=2`+chargeInfo

            log(link)
            var linkElement = $("<a>").text("解密").attr("href", link).attr("target", "_blank")
            .css({'background-color':'yellow','color': 'red'});

            span.before(linkElement)
        }
        
      });

}

waitForKeyElements(rendererDict, f);