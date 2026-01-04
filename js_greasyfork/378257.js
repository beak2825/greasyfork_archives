// ==UserScript==
// @name         CNKI Sxlib Downloader
// @namespace    elonhhuang@gmail.com
// @version      0.0.3
// @description  从sxlib下载CNKI论文
// @author       ElonH <elonhhuang@gmail.com>
// @license      MIT https://opensource.org/licenses/MIT
// @match        *://kns.cnki.net/KCMS/detail/detail.aspx*
// @match        *://kns.cnki.net/kcms/detail/detail.aspx*
// @match        *://115.239.174.206:8081/login.action*
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378257/CNKI%20Sxlib%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/378257/CNKI%20Sxlib%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var CNKI_sxlib = { // obj name
        //-------- Modification Area -------- start --------
        button_id: 'sxlib_btn',
        button_name: '绍兴图书馆',
        sxlib_paper_link: 'http://115.239.174.206:8081/rwt/301/http/NNYHGLUDN3WXTLUPMW4A/KCMS/detail/detail.aspx',
        add_btn_to: function (btn) { // add button to somewhere
            document.getElementById('DownLoadParts').appendChild(btn);
        },

        extra_info: function () { // button function
            //console.log('extra_info');
            var parm = window.location.search;
            window.open(CNKI_sxlib.sxlib_paper_link + parm);
        },
        //-------- Modification Area --------  end  --------
        add_btn: function () {
            if (document.getElementById(CNKI_sxlib.button_id)) {
                return;
            }
            // create button
            var btn = document.createElement("BUTTON");
            btn.id = CNKI_sxlib.button_id;
            var t = document.createTextNode(CNKI_sxlib.button_name);
            btn.appendChild(t);
            // add button
            CNKI_sxlib.add_btn_to(btn)

            // add listenter
            document.getElementById(CNKI_sxlib.button_id).addEventListener("click", CNKI_sxlib.extra_info);
        },

        check_playlist: function () {
            setInterval(CNKI_sxlib.add_btn, 1000);
            CNKI_sxlib.add_btn();
        }
    }

    // auto login sxlib
    var p = /115\.239\.174\.206\:8081\/login.action/
    if (p.test(location.href)) {
        var cnki_access = "http://115.239.174.206:8081/openurl2?uid=guest&url=http://www.cnki.net&sn=046D2DBC88F88DE37D5C5A0EEC9AE20C&rid=301&locale=zh_CN";
        location.href = cnki_access;
        //console.log(cnki_access);
        return;
    }

    CNKI_sxlib.check_playlist();
})();