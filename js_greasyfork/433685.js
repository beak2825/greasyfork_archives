// ==UserScript==
// @name        让英伟达显示更多的历史驱动*100条*
// @namespace   作者：72EU https://www.bilibili.com/read/cv9550283 出处：bilibili
// @match       *://*.nvidia.cn/geforce/drivers/
// @grant       none
// @version     1.3
// @description 主要是用在英伟达驱动查询中，默认只能查看最近几个，而这个脚本能获取到最近100个。
// @author      -
// @description 2021/10/11 上午1:27:19
// @downloadURL https://update.greasyfork.org/scripts/433685/%E8%AE%A9%E8%8B%B1%E4%BC%9F%E8%BE%BE%E6%98%BE%E7%A4%BA%E6%9B%B4%E5%A4%9A%E7%9A%84%E5%8E%86%E5%8F%B2%E9%A9%B1%E5%8A%A8%2A100%E6%9D%A1%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/433685/%E8%AE%A9%E8%8B%B1%E4%BC%9F%E8%BE%BE%E6%98%BE%E7%A4%BA%E6%9B%B4%E5%A4%9A%E7%9A%84%E5%8E%86%E5%8F%B2%E9%A9%B1%E5%8A%A8%2A100%E6%9D%A1%2A.meta.js
// ==/UserScript==
SystemScanner.prototype.DriverSearch = function (psid, pfid, osID, langCode, whql, beta, dltype, numresults) {
    numresults = 100
    this.scannerStatusUpdate(GFE_SERVER_CONNECTING)
    theScanner.scannedDevice.downloadInfo = {}
    const requestUrl = this.driverManualLookupUrl + new URLSearchParams({
        psid: psid,
        pfid: pfid,
        osID: osID,
        languageCode: langCode,
        beta: beta,
        isWHQL: whql,
        dltype: dltype,
        sort1: 0,
        numberOfResults: numresults,
    }).toString()
    this.driversLogUIEvent('warn', `SUID:${this.tracker.scanID} BEGIN DriverSearch requestUrl:${requestUrl}`)
    this.debugTrace(requestUrl)
    jQuery.ajax({
        url: requestUrl,
        async: false,
        type: 'GET',
        success: function (response) {
            try {
                theScanner.debugTrace(`The Driver Lookup Service Returned:\n\n(${response})`)
                if (response.length > 0) {
                    theScanner.resetResults()
                    theScanner.resultsList = {}
                    theScanner.resultsList = eval(`(${response})`)
                }
                theScanner.scannerStatus = theScanner.resultsList.Success === 0 ? 'No driver available' : 'Results Ready'
            } catch (e) {
                this.driversLogUIEvent('error', ' FAIL catch DriverSearch')
                theScanner.resetResults()
                theScanner.scannerStatus = 'No driver available'
            }
        },
        error: function (response) {
            theScanner.resetResults()
            theScanner.scannerStatus = 'AJAX Call failed'
        }
    })
    this.driversLogUIEvent('warn', `SUID:${this.tracker.scanID} END DriverSearch requestUrl:${requestUrl}`)
}