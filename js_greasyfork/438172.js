// ==UserScript==
// @name         Show GeoIP Info on TCM
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.2
// @description  显示 TCM 页面中 IP 的 GeoIP 信息
// @author       Julydate
// @match        trace.speedtest6.club
// @icon         https://www.google.com/s2/favicons?domain=speedtest6.club
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438172/Show%20GeoIP%20Info%20on%20TCM.user.js
// @updateURL https://update.greasyfork.org/scripts/438172/Show%20GeoIP%20Info%20on%20TCM.meta.js
// ==/UserScript==

(function() {
    'use strict';

// 增加显示 IP 信息按钮
var showInfoBtn = document.createElement("button");
showInfoBtn.setAttribute("class", "el-button el-button--primary");
showInfoBtn.setAttribute("type", "button");
showInfoBtn.setAttribute(
  "style",
  "--el-button-bg-color:#409eff; --el-button-border-color:#409eff; --el-button-hover-bg-color:rgb(102, 177, 255); --el-button-hover-border-color:rgb(102, 177, 255); --el-button-active-bg-color:rgb(58, 142, 230); --el-button-active-border-color:rgb(58, 142, 230);"
);
showInfoBtn.setAttribute("onclick", "showIPInfo()");
showInfoBtn.innerHTML = '<span class="">显示 IP 信息</span>';
document.querySelector(".trace_button").appendChild(showInfoBtn);
// 增加显示 IP 信息脚本
var showInfoScript = document.createElement("script");
showInfoScript.setAttribute("type", "text/javascript");
showInfoScript.innerHTML = 'function showIPInfo(){var ipv4Reg=new RegExp(/\\((((2(5[0-5]|[0-4]\d))|[0-1]?\\d{1,2})(\\.((2(5[0-5]|[0-4]\\d))|[0-1]?\\d{1,2})){3})\\)/,"i");var infoReg=new RegExp(/ms.*/,"i");document.querySelectorAll(".card-res").forEach(function(e){let ips=e.innerHTML.split("\\n");for(const i in ips){let ip=ips[i].match(ipv4Reg);if(ip&&ip[1])fetch("https://api.ip.sb/geoip/"+ip[1]).then(function(res){return res.json()}).then(function(data){let info=(data.asn?"AS"+data.asn+", ":"")+(data.country?data.country+", ":"")+(data.region?data.region+", ":(data.city?data.city+", ":""))+(data.isp?data.isp:(data.asn_organization?data.asn_organization:""));ips[i]=ips[i].replace(infoReg,"ms "+info);e.innerHTML=ips.join("\\n")})}})}';
document.getElementsByTagName('head')[0].appendChild(showInfoScript);
//脚本备份
/* function showIPInfo() {
    var ipv4Reg = new RegExp(
        /\((((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3})\)/,
        "i"
    );
    var infoReg = new RegExp(/(ms.*)/, "i");
    document.querySelectorAll(".card-res").forEach(function (e) {
        let ips = e.innerHTML.split("\n");
        for (const i in ips) {
            let ip = ips[i].match(ipv4Reg)
            if (ip && ip[1]) fetch("https://api.ip.sb/geoip/" + ip[1])
                .then(function (res) {
                    return res.json();
                })
                .then(function (data) {
                    let info =
                        (data.asn ? "AS" + data.asn + ", " : "") +
                        (data.country ? data.country + ", " : "") +
                        (data.region ? data.region + ", " : (data.city ? data.city + ", " : "")) +
                        (data.isp ? data.isp : (data.asn_organization ? data.asn_organization : ""));
                    ips[i] = ips[i].replace(infoReg, "ms " + info);
                    e.innerHTML = ips.join("\n");
                });
        }
    });
}  */
})();