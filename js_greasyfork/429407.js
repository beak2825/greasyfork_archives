// ==UserScript==
// @name         OTM Transmission
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Otm tran
// @author       You
// @match        https://otmgtm-test-vertivotm.otmgtm.us-phoenix-1.ocs.oraclecloud.com/GC3/glog.webserver.transmission.ITransmissionManagementServlet*
// @match        https://otmgtm-vertivotm.otmgtm.us-phoenix-1.ocs.oraclecloud.com/GC3/glog.webserver.transmission.ITransmissionManagementServlet*
// @icon         https://www.google.com/s2/favicons?domain=oraclecloud.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429407/OTM%20Transmission.user.js
// @updateURL https://update.greasyfork.org/scripts/429407/OTM%20Transmission.meta.js
// ==/UserScript==
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
    }
(function() {
    'use strict';
    var transNo = document.createElement('div');
    transNo.innerHTML = '<input style="text-align:center" placeholder="Transmission No" autofocus="autofocus" id="transNo"/>';
    document.getElementsByClassName("bodyHeaderCont")[0].append(transNo);
    if(!!getQueryString("pk")){
        document.getElementById("transNo").value = getQueryString("pk");
    }
    var objectGid = document.createElement('div');
    objectGid.innerHTML = '<input style="text-align:center" placeholder="Object Gid" autofocus="autofocus" id="objectGid"/>';
    document.getElementsByClassName("bodyHeaderCont")[0].append(objectGid);
    var finder = document.createElement('div');
    finder.innerHTML = '<input type="button" style="text-align:center" value="Go Finder" id="transFinder"/>';
    document.getElementsByClassName("bodyHeaderCont")[0].append(finder);

    document.getElementById("objectGid").addEventListener('keydown',function (e) {
        if(e.key == 'Enter'){
            e.preventDefault();
            window.location.href='/GC3/glog.webserver.finder.ResultServlet?query_name=glog.server.query.transmission.ITransmissionQuery&finder_set_gid=I_TRANSMISSION&i_transmission/trx/object_gid_operator=contains&i_transmission/trx/object_gid='+this.value;
        }
    });
    document.getElementById("transNo").addEventListener('keydown',function (e) {
        if(e.key == 'Enter'){
            e.preventDefault();
            window.location.href='glog.webserver.transmission.ITransmissionManagementServlet?pk='+this.value;
        }
    });
    document.getElementById("transFinder").onclick = function(){
        window.location.href='glog.webserver.finder.FinderServlet?query_name=glog.server.query.transmission.ITransmissionQuery';
    };
})();