// ==UserScript==
// @name         起点自动领经验
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       菠菜
// @match        http://t.qidian.com/Profile/Score.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27377/%E8%B5%B7%E7%82%B9%E8%87%AA%E5%8A%A8%E9%A2%86%E7%BB%8F%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/27377/%E8%B5%B7%E7%82%B9%E8%87%AA%E5%8A%A8%E9%A2%86%E7%BB%8F%E9%AA%8C.meta.js
// ==/UserScript==


(function() {
    'use strict';
    jQuery(function($) {
        $(document).ready(function(){
            var quanbu = $("a.btn").text();
            var ming=quanbu.indexOf("可领取");


            if (ming>0)
            {
                $('a[id^=online-exp-get]').each(function()
                                                {
                    var id = $(this).attr('id');
                    var mins = parseInt(id.replace('online-exp-get', ''), 10);
                    $.closeAllDialog();
                    $.loading();
                    $.ajax(
                        {
                            type: "get",
                            url: "/Ajax/Occupation.php",
                            data: { ajaxMethod: 'getonlineexp', minutes: mins, random: Math.random() },
                            dataType: "json",
                            success: function(result)
                            {
                                $.loadingClose();
                                if (result.returnCode === true)
                                {
                                    location.reload(true);
                                }
                                else
                                {
                                    location.reload(true);
                                }
                            }
                        });
                });
            }

        }
                         );

    })();
})();