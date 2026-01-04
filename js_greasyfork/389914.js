// ==UserScript==
// @name         subhd direct download
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  讓subhd的下載按鈕變成真正的下載按鈕 
// @author       axzxc1236
// @match        https://subhd.tv/do*
// @match        https://www.subhd.tv/do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389914/subhd%20direct%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/389914/subhd%20direct%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function dl(aurl) {
        console.log(aurl);
        $.ajax({
            type: "GET",
            url: aurl,
            cache:true,
            success: function(data){
                let match = data.match(/sid="(.*)" dtoken="(.*)" onclick/);
                let send = {sub_id:match[1],dtoken:match[2]};
                $.ajax({
                    type: "POST",
                    url: "/ajax/down_ajax",
                    cache:true,
                    dataType:"json",
                    data:send,
                    success: function(data){
                        if(data.success == true){
                            window.location.href=data.url;
                        }else{
                            alert(data.msg);
                        }
                    }
                });
            }});
    }

    document.querySelectorAll(".dt_down .black").forEach(function(alink) {
        alink.addEventListener("click", function(event) {
            event.preventDefault();
            dl(alink.href);
        });
    });
})();