// ==UserScript==
// @name         Pace OE
// @namespace    http://w.amazon.com
// @version      0.2
// @description  OE
// @author       yajian/wzy
// @match        https://w.amazon.com/*
// @run-at       document-end
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457284/Pace%20OE.user.js
// @updateURL https://update.greasyfork.org/scripts/457284/Pace%20OE.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function GetCCUri() {
        return "https://jpcx-internal-tool.integ.amazon.com/code/intech-jp-pace/amzn1.abacus.team.bily46kfc5tobnkdpuga?blacklist=CERRetailWebApp,CERAggregatorServiceMonitoringCDK,CERContractFulfillmentServiceTests,CERAggregatorServiceMonitoringCDK,CERGenericActionProducerCDK,MDEWebAppWebsite,CERMilestoneProducerCDK,ReferralProcessorLambdaCDK,ReferralManagementAAA,CERContractFulfillmentServiceInfrastructureCDK,CERSolitaireCardsCDK,CERDataViewPrecomputeCDK,CERActionTrackerMonitoringCDK,JPCXInternalToolNode";
    }
    function GetPipelineUri() {
        return "https://jpcx-internal-tool.integ.amazon.com/pipelines/INTech-JP-PACE?blacklist=no_now";
    }

    $("#pace_pipeline").append('<iframe width="90%" height="800" src=' + GetPipelineUri() +' frameborder="0" allowfullscreen=""></iframe>');
    $("#pace_cc").append('<iframe width="100%" height="800" src=' + GetCCUri() +' frameborder="0" allowfullscreen=""></iframe>');
})();