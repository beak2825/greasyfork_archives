// ==UserScript==
// @name         MyGooglePager
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add page buttons to google search for those who missed origin ones
// @author       Jennings
// @match        https://www.google.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/478385/MyGooglePager.user.js
// @updateURL https://update.greasyfork.org/scripts/478385/MyGooglePager.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var PageText = '<div id="gfn"><a id="jpageup" href="javascript:void(0); "style="font-size: 20px;">&lt;上一页</a><input id="jpagenum" type="text" style="width: 50px;text-align: center;font-size: 20px;margin: 0 10px;" value="0"><a id="jpagedown" href="javascript:void(0);" style="font-size: 20px;">下一页&gt;</a></div>';
    var MAUrl = function(urlstr, parameter, value)
    {
        var url = new URL(urlstr);
        // Create a new URLSearchParams object from the URL.
        const searchParams = new URLSearchParams(url.search);

        // If the parameter already exists, update its value.
        if (searchParams.has(parameter)) {
            searchParams.set(parameter, value);
        } else {
            // Otherwise, append the parameter with the given value.
            searchParams.append(parameter, value);
        }

        url.search = searchParams.toString();

        // Return the new URL with the updated query string.
        return url.toString()
    };

    window.onload = function() {
        var gfn = document.getElementById("gfn");
        //var page_pattern = /\D+[0-9\,]+[^0-9\,]+(\d+)\D+[\(（]+/;
        //var page_str = document.getElementById("result-stats").innerText;
        //var page_s = page_str.match(page_pattern);
        //var page = (page_s==null || page_s[1]==null)?0:parseInt(page_s[1])/10;



        let url = new URL(window.location.href); // URLを取得
        let params = url.searchParams; // URLSearchParamsオブジェクトを取得
        var page_s2 = params.get('start');
        var page = page_s2==null?0:parseInt(page_s2)/10;
        page += 1;


        if(gfn.innerHTML == "")
        {
            gfn.innerHTML = PageText;
            var pu = document.getElementById("jpageup");
            var pn = document.getElementById("jpagenum");
            var pd = document.getElementById("jpagedown");

            pn.value = page;

            pu.addEventListener('click', function() {
                if(page > 1)
                {
                    var rt = MAUrl(location.href,"start",10*(page-2));
                    location.href = rt;
                }
            });
             pd.addEventListener('click', function() {
                if(page >= 0)
                {
                    var rt = MAUrl(location.href,"start",10*(page));
                    location.href = rt;
                }
            });

            pn.addEventListener("keydown", function(event) {
                if (event.key === "Enter") {
                    // 回车键被按下
                    event.preventDefault(); // 阻止默认的回车行为（如提交表单）
                    var val = parseInt(pn.value)
                    var rt = MAUrl(location.href,"start",10*(val-1));
                    location.href = rt;
                }
            });

        }

    };




    // Your code here...
})();