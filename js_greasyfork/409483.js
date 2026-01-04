// ==UserScript==
// @name         问答版显示 ip
// @version      0.2
// @include      https://www.mcbbs.net/thread-*-1-1.html
// @author       xmdhs
// @description  问答版显示 ip。
// @namespace https://greasyfork.org/users/166541
// @downloadURL https://update.greasyfork.org/scripts/409483/%E9%97%AE%E7%AD%94%E7%89%88%E6%98%BE%E7%A4%BA%20ip.user.js
// @updateURL https://update.greasyfork.org/scripts/409483/%E9%97%AE%E7%AD%94%E7%89%88%E6%98%BE%E7%A4%BA%20ip.meta.js
// ==/UserScript==

(function () {
        var $ = jQuery;
        if ($(".rwdbst").length == 0) {
                return
        }
        var url = window.location.href
        var a = url.indexOf('/thread-') + 8
        var b = url.indexOf('-1-1.html')
        var tid = url.substring(a, b)
        $.ajax({
                url: "api/mobile/index.php?version=4&module=viewthread&tid=" + tid,
                cache: false,
                dataType: "json",
                type: "GET",
                success: function (result) {
                        var ip = result.Variables.special_reward.bestpost.useip
                        var wip = document.getElementsByClassName("mtn")
                        wip[0].childNodes[0].data = ip
                        $.getJSON("https://api.ip.sb/geoip/" + ip,
                                function (json) {
                                        wip[0].childNodes[0].data += " | " + json.country
                                        wip[0].childNodes[0].data += " " + json.region
                                        wip[0].childNodes[0].data += " " + json.city
                                        wip[0].childNodes[0].data += " | " + json.isp
                                }
                        );
                }
        })
}
)();
