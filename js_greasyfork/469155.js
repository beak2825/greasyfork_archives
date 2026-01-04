// ==UserScript==
// @name         qBittorrent copy error message
// @namespace    http://192.168.2.100:8085/
// @description  zh-cn
// @version      0.2
// @author       Relax-87
// @match        http://192.168.2.100:8085/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2.100
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @connect     *
// @require     https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @grant       GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469155/qBittorrent%20copy%20error%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/469155/qBittorrent%20copy%20error%20message.meta.js
// ==/UserScript==

(function() {
     function copyText(text) {

        var oInput = document.createElement('input');

        oInput.value = text;

        document.body.appendChild(oInput);

        oInput.select();

        document.execCommand("Copy");

        oInput.className = 'oInput';

        oInput.style.display = 'none';

    }

    var msg_key_debug = false
    var url_key = -1
    var msg_key = -1
    var getcolumn_message_number = function(){
        var dynamicTableFixedHeaderDiv = jQuery("div#torrentTrackersTableFixedHeaderDiv.dynamicTableFixedHeaderDiv")
        var ths = jQuery(dynamicTableFixedHeaderDiv).find("tr.dynamicTableHeader").find("th")
        ths.each(function(key,value){
            if (jQuery(value)[0].title == "URL"){
                url_key = key
                if (msg_key_debug){
                    console.log("url_key: " + url_key)
                }
            }
            if (jQuery(value)[0].title == "消息" || jQuery(value)[0].title == "Message"){
                msg_key = key
                if (msg_key_debug){
                    console.log("msg_key: " + msg_key)
                }
            }
        })
    }

    var get_torrent_table_msg = function(){
        var torrentTrackersTableDiv_dynamicTableDiv = jQuery("#torrentTrackersTableDiv.dynamicTableDiv")
        var tttddtd = jQuery(torrentTrackersTableDiv_dynamicTableDiv)
        var tbody = tttddtd.find("tbody")
        var tr_list = jQuery(jQuery(tbody).find("tr"))
        tr_list.each(function(tr_key,tr_value){
            if (jQuery(jQuery(tr_value).children()[url_key])[0].innerText.indexOf("http") > -1){
                var msg_c = jQuery(jQuery(tr_value).children()[msg_key])
                if (msg_c[0].innerText != undefined && msg_c[0].innerText != ""){
                    if (!msg_c.attr("cl")){
                        msg_c.attr("cl",true)
                        msg_c.attr("style","background-color:#ffa3b3")
                        msg_c.on("click",function(){
                            var msg = msg_c[0].innerText
                            copyText(msg)
                            var html = "已将下列内容复制到剪切板:\n"+msg
                            alert(html)
                        })
                    }
                }
            }
        })
    }
    setInterval(getcolumn_message_number, 100);
    setInterval(get_torrent_table_msg, 100);
})();














