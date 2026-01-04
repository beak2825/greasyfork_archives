// ==UserScript==
// @name         De-embed AusPost PDFs
// @namespace    mailto:Roy-Orbison@users.noreply.github.com
// @esversion    6
// @version      1.0
// @description  The Australia Post eParcel site wraps label PDF downloads in an <object> tag that interferes with browsers' normal PDF display and printing. This script "unwraps" those PDF links.
// @author       Roy-Orbison
// @include      https://eparcel.auspost.com.au/eParcel/merchant/auth/viewLabelsDownload.do
// @include      https://online.auspost.com.au/eParcel/merchant/auth/viewLabelsDownload.do
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/427327/De-embed%20AusPost%20PDFs.user.js
// @updateURL https://update.greasyfork.org/scripts/427327/De-embed%20AusPost%20PDFs.meta.js
// ==/UserScript==

(function(pdfPath, loc) {
    pdfPath = loc.protocol + '//' + loc.host + pdfPath;
    unsafeWindow.openPDFWindow = function(indirectReference) {
        unsafeWindow.open(pdfPath + indirectReference);
    };
    unsafeWindow.replaceWindowWithPDF = function(indirectReference) {
        unsafeWindow.location = pdfPath + indirectReference;
    };
})('/eParcel/merchant/auth/submitLabelsDownload.do?autoPrint=true&temporaryPdfSysId=', unsafeWindow.location);