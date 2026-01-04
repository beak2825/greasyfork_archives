// ==UserScript==
// @name         7LSure
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  帮助显示是否赠楼者已确认获赠
// @icon         https://keylol.com/favicon-hq.ico
// @author       哦哈哟
// @match        https://keylol.com/plugin.php?id=steamcn_gift:search&q=*&type=create
// @match        https://keylol.com/plugin.php?id=steamcn_gift:search&type=create&q=*&page=*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/368311/7LSure.user.js
// @updateURL https://update.greasyfork.org/scripts/368311/7LSure.meta.js
// ==/UserScript==

(function() {
    'use strict';


$(document).ready(function() {
            var _gwContent = document.getElementById("d_gw_content");
            var createdGiftCollection = _gwContent.getElementsByClassName("d_gw_search_result_right");
            var giftHrefPattern = /https:\/\/keylol\.com\/forum\.php\?mod\=viewthread\&tid\=.+/;
            //var _herf = $(".d_gw_content a").attr("href");
            var _herf = _gwContent.getElementsByTagName("a");
            var skip = 0;
            for(var i=0,count=0;i<_herf.length&&count<createdGiftCollection.length;i++){
                var tempHref = _herf[i].href;
                    if(!giftHrefPattern.test(tempHref)){skip++;continue;}

                var _giftName = createdGiftCollection[i-skip].getElementsByClassName("p_gw_search_result_right_top_name");
                var _giftStatus = createdGiftCollection[i-skip].getElementsByClassName("p_gw_search_result_right_bottom_status");
                var _status = (_giftStatus[0].innerText).toString();
                if (_status.indexOf("进行")>0){
                    _giftName[0].innerHTML += "（进行中）";
                }
                else{
                    count++;
                    (function(i){
                        var _giftName = createdGiftCollection[i-skip].getElementsByClassName("p_gw_search_result_right_top_name");
                    GM_xmlhttpRequest({
                        method:"GET",
                        url:_herf[i].href,
                        onload: function(res){
                            if(res.responseText!=="null"){
                                var resText = res.responseText;
                                var doc = document.createElement("div");
                                doc.innerHTML = resText;
                               var temp = doc.getElementsByClassName("p_gw_status_line_half_first");
                                if (temp[0]!=null){
                                    var value = temp[0].innerText;
                                    if (value.indexOf("已经确认获赠")>0 || value.indexOf("已经提前确认获赠")>0 ){
                                        _giftName[0].innerHTML+="（已确认）";
                                    }
                                    else if (value.indexOf("未寄出")>0){
                                        _giftName[0].innerHTML+="（未寄出）";
                                    }
                                    else if (value.indexOf("未确认")>0){
                                        _giftName[0].innerHTML+="（未确认）";
                                    }
                                }
                                else{
                                    _giftName[0].innerHTML+="（没人参加）";
                                }
                            }
                        }
                    });

                })(i);
                }
            }

 });

})();