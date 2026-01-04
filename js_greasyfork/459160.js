// ==UserScript==
// @name         吉他社筛选贝斯谱
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       You
// @match        https://www.jitashe.org/guide/newtab*
// @match        https://www.jitashe.org/guide/hottab*
// @match        https://www.jitashe.org/search/tab*
// @icon         https://www.jitashe.org/favicon-32x32.png
// @grant        none
// @description 筛选贝斯谱
// @downloadURL https://update.greasyfork.org/scripts/459160/%E5%90%89%E4%BB%96%E7%A4%BE%E7%AD%9B%E9%80%89%E8%B4%9D%E6%96%AF%E8%B0%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/459160/%E5%90%89%E4%BB%96%E7%A4%BE%E7%AD%9B%E9%80%89%E8%B4%9D%E6%96%AF%E8%B0%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var a_1 = document.createElement("a");
    a_1.innerHTML = "贝斯谱";
    a_1.onclick = function()
    {
        // 最新吉他谱/热门吉他谱
        var div = document.getElementsByClassName("tbmu cl");
		if(div.length>0)
		{
			div[0].children[0].setAttribute("class", "");
		}


		// 搜索
        var div_2_1 = document.getElementsByClassName("filter-item  active");
		if(div_2_1.length>1)
		{
			div_2_1[1].setAttribute("class", "filter-item ");
		}

        div_2_1 = document.getElementsByClassName("filter-item ");
		if(div_2_1.length>0)
		{
			div_2_1[div_2_1.length-1].setAttribute("class", "filter-item  active");
		}


        // 通用部分
        a_1.setAttribute("class", "a");

        var taglists = document.getElementsByClassName('taglist');
        for( var i_i = taglists.length-1 ; i_i>-1 ; i_i-- )
            // 一次循环一个谱
        {
            var tlcs = taglists[i_i].children;
            var bl_found = new Boolean();
            bl_found = false;
            for( var j_j = 0 ; j_j<tlcs.length ; j_j++ )
                // 一次循环一个tag
            {
                var tlcs_0 = tlcs[j_j];
                if(tlcs_0.innerHTML.includes('贝斯') || tlcs_0.innerHTML.includes('贝司') || tlcs_0.innerHTML.includes('BASS') || tlcs_0.innerHTML.includes('bass') || tlcs_0.innerHTML.includes('Bass'))
                {
                    //console.log(tlcs_0);
                    bl_found = true;
                    break;
                }
            }

            if(!bl_found)
                // 不是贝斯谱
            {
                var pu = taglists[i_i].parentElement.parentElement.parentElement;
                console.log("xxxxxxxx");
                pu.parentElement.removeChild(pu);
            }
        }
    };


    // 最新吉他谱/热门吉他谱
    var div_1 = document.getElementsByClassName("tbmu cl");
    if(div_1.length>0)
    {
        var span_1 = document.createElement("span");
        span_1.setAttribute("class", "pipe");
        span_1.innerHTML = "|";

        div_1[0].appendChild(span_1);
        div_1[0].appendChild(a_1);
    }


    // 搜索
    var div_2 = document.getElementsByClassName("filter-list");
    if(div_2.length>0)
    {

        var li_1 = document.createElement("li");
        li_1.setAttribute("class", "filter-item ");
        li_1.appendChild(a_1);


        div_2[0].appendChild(li_1);
    }
})();