// ==UserScript==
// @name         IP Hunter by John2x2016 of VPN5
// @namespace    http://www.symbianize.com/showthread.php?t=1397083
// @version      2.1
// @description  This userscript automatically reconnects the mobile data for some HUAWEI modems until it connects to a matching IP address.
// @author       John2x2016 of VPN5
// @icon         http://www.symbianize.com/images/symb_avatars/avatar456082_9.gif
// @match        http://192.168.8.1/html/home.html
// @match        http://192.168.1.1/html/home.html
// @match        http://192.168.254.254/html/home.html
// @match        http://192.168.22.1/html/home.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26100/IP%20Hunter%20by%20John2x2016%20of%20VPN5.user.js
// @updateURL https://update.greasyfork.org/scripts/26100/IP%20Hunter%20by%20John2x2016%20of%20VPN5.meta.js
// ==/UserScript==

/*
 * IP Hunter of VPN5
 * http://vpn5.net
 *
 * THIS WORK IS COPYRIGHT PROTECTED
 * http://www.copyrighted.com/copyrights/view/v6tm-qzys-ym79-9saw
 *
 * MODIFYING THE TOOL FOR YOUR PERSONAL USE IS PERMITTED
 * HOWEVER, RE-BRANDING OR REMOVING THIS COPYRIGHT NOTICE IS NOT ALLOWED.
 *
 * IF YOU HAVE ANY SUGGESTIONS TO IMPROVE THIS TOOL,
 * YOU CAN PM ME ON SYMBIANIZE OR ON FACEBOOK.
 */

! function() {
    "use strict";

    function t(t) {
        console.log(t), setTimeout(function() {
            var e = $("#ip_hunter_log")[0];
            e.value += "\n" + t, e.scrollTop = e.scrollHeight
        }, 200)
    }

    function e() {
        t("Scanning..."), getAjaxData("api/monitoring/status", function(a) {
            var o = xml2object(a);
            if ("response" == o.type) {
                var i = o.response.WanIPAddress,
                    r = !1;
                i && "" !== i ? (console.info("Current IP: ", i), t("Current IP: " + i), s.split(";").forEach(function(e, a) {
                    !i.startsWith(e) || i.startsWith("10.116") && i.startsWith("100.116") || (r = !0, t("Matched with pattern: " + e)), a + 1 === s.split(";").length && (r ? (t("IP (" + i + ") is valid."), t("Edited by: John2x2016 of VPN5"), t("Hunting successful connect to VPN5 now!!")) : (t("Reconnecting..."), n()))
                })) : setTimeout(function() {
                    e()
                }, 3e3)
            }
        }, {
            sync: !0
        })
    }

    function n() {
        g_network_action = {
            dataswitch: "0"
        }, saveAjaxData("api/dialup/mobile-dataswitch", object2xml("request", g_network_action), function(n) {
            var a = xml2object(n);
            "OK" == a.response && setTimeout(function() {
                g_network_action = {
                    dataswitch: "1"
                }, saveAjaxData("api/dialup/mobile-dataswitch", object2xml("request", g_network_action), function(n) {
                    xml2object(n);
                    t("Connected!!!"), setTimeout(function() {
                        e()
                    }, 3e3)
                })
            }, 3e3)
        })
    }
    var a = [];
    "undefined" == typeof jQuery && a.push("jQuery"), "undefined" == typeof login && a.push("login"), "undefined" == typeof getAjaxData && a.push("getAjaxData"), "undefined" == typeof saveAjaxData && a.push("saveAjaxData"), "undefined" == typeof xml2object && a.push("xml2object"), "undefined" == typeof object2xml && a.push("object2xml"), a.length > 0 && prompt("SORRY, THIS TOOL CURRENTLY DOESN'T SUPPORT YOUR DASHBOARD.\n\nYOU CAN COPY THE ERROR LOG BELOW AND SEND IT TO THE DEVELOPER:", "undefined:" + a.join(";"));
    var o = localStorage.iphUsername || "admin",
        i = localStorage.iphPassword || "",
        s = localStorage.iphPatterns || "10.;100.11;100.12;100.13;100.14;100.15;100.16;100.17;100.18;100.19;100.2";
    $('<input type="hidden" id="username" />').val(o).appendTo("body"), $('<input type="hidden" id="password" />').val(i).appendTo("body");
    var r = $('<div class="wlan_status" />').html('<h2>IP Hunter v2.1 <small>Edited by: <a href="https://www.facebook.com/groups/992860164191043" target="_blank"><font color="green">John2x2016 of VPN5</a></h2></font></small>').append($('<table id="ip_hunter" width="91%" />').append('<tr><td colspan="2" id="err"></td></tr>').append('<tr><td>Username:</td><td><input type="text" id="iph_username" style="width:92%;" /></td></tr>').append('<tr><td>Password:</td><td><input type="password" id="iph_password" style="width:92%;" /></td></tr>').append('<tr><td>IP Patterns:</td><td><input type="text" id="iph_patterns" style="width:92%;" /></td></tr>').append('<tr><td colspan="2"><textarea style="width:95%;height:110px;" id="ip_hunter_log" readonly></textarea></td></tr>').append($("<tr />").html($('<td colspan="2" style="padding: 3px 0;" />').append($('<button style="margin-right: 3px; padding: 3px 10px;" />').text("Save Changes").click(function() {
        localStorage.iphUsername = $("#iph_username").val(), localStorage.iphPassword = $("#iph_password").val(), localStorage.iphPatterns = $("#iph_patterns").val(), t("Changes has been saved."), $("#password").val($("#iph_password").val()), login(g_destnation, function() {
            console.clear(), t("WELCOME TO VPN5 IP HUNTER"), e()
        }), setTimeout(function() {
            $(".error_message").text().length > 1 && (t($(".error_message").text()), $(".error_message").hide())
        }, 300)
    })).append($('<button style="margin-right: 3px; padding: 3px 10px;" />').text("Login").click(function() {
        $("#password").val($("#iph_password").val()), login(g_destnation, function() {
            console.clear(), t("WELCOME TO VPN5 IP HUNTER"), e()
        }), setTimeout(function() {
            $(".error_message").text().length > 1 && (t($(".error_message").text()), $(".error_message").hide())
        }, 300)
    })).append($('<button style="margin-right: 3px; padding: 3px 10px;" />').text("Reconnect").click(function() {
        t("Reconnecting..."), n()
    })))));
    document.querySelector(".login_info") ? r.appendTo(".login_info") : r.css({
        width: "290px",
        background: "white",
        border: "1px solid #eee",
        padding: "10px",
        position: "fixed",
        bottom: "0px",
        left: "0px",
        "z-index": "9999"
    }).appendTo("body").append('<span style="color:red;">*NOTE: This tool might not display well. This is just a work around for your dashboard.</span>'), $("#iph_username").val(o), $("#iph_password").val(i), $("#iph_patterns").val(s), login(g_destnation, function() {
        console.clear(), t("WELCOME TO VPN5 IP HUNTER"), e()
    }), setTimeout(function() {
        $(".error_message").text().length > 1 && (t($(".error_message").text()), $(".error_message").hide())
    }, 300)
}();