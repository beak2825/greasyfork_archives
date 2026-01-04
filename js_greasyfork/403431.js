// ==UserScript==
// @name         解决blur
// @namespace    http://pan.newday.me/
// @version      0.0.1
// @icon         http://pan.newday.me/pan/favicon.ico
// @author       Kael
// @description  kael 工具
// @match        *://ct-edu.com.cn*
// @connect      api.newday.me
// @connect      ypsuperkey.meek.com.cn
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/snap.svg/0.5.1/snap.svg-min.js
// @require      https://cdn.staticfile.org/vue/2.6.6/vue.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/403431/%E8%A7%A3%E5%86%B3blur.user.js
// @updateURL https://update.greasyfork.org/scripts/403431/%E8%A7%A3%E5%86%B3blur.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.removeEventListener("blur",
                function() {
                    f && a && (J = !0, f.pause(), f.exitFullscreen(), layer.confirm("离开页面，视频播放被暂停", {
                        icon: 0,
                        title: "温馨提示",
                        btn: ["继续播放", "知道了"],
                        cancel: function() {
                            J = !1,
                            $("body").focus()
                        }
                    },
                    function(e) {
                        layer.close(e),
                        J = !1,
                        $("body").focus(),
                        f.play()
                    },
                    function() {
                        J = !1,
                        $("body").focus()
                    }))
                })
    
})();