// ==UserScript==
// @name         CHD低保种子筛选
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  筛选CHD 【5人以下 3G以上】种子
// @author       ootruieo
// @license      GNU GPLv3
// @match        https://chdbits.co/torrents.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/444129/CHD%E4%BD%8E%E4%BF%9D%E7%A7%8D%E5%AD%90%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/444129/CHD%E4%BD%8E%E4%BF%9D%E7%A7%8D%E5%AD%90%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e)=>{console.log(e);});
    }

    const FilterTorrents = async function(){
        var torrents = document.getElementsByClassName('torrents');
        if(torrents.length > 0){
            var btnFilterTorrents = document.getElementById ("btnFilterTorrents");
            btnFilterTorrents.setAttribute("disabled","1");
            var maxFilterSize = parseFloat(document.getElementById('maxFilterSize').value);
            if(isNaN(maxFilterSize) || maxFilterSize <= 3){
                maxFilterSize = 3.1;
            }
            GM_setValue('maxFilterSize', maxFilterSize);

            var chdOfficial = document.getElementById('cboxChdOfficial').checked;
            GM_setValue('chdOfficial', chdOfficial);

            var chdUnofficial = document.getElementById('cboxChdUnofficial').checked;
            GM_setValue('chdUnofficial', chdUnofficial);

            for(var ti = torrents[0].rows.length - 1;ti > 0 ;ti--){
                var row = torrents[0].rows[ti];
                var hidden = true;
                if(row.cells[9].innerText== "--" && row.cells[4].innerText.indexOf('GB') != -1){
                    var size = parseFloat(row.cells[4].innerText);
                    if(size > 3 && size < maxFilterSize ){
                        var seeder = parseInt(row.cells[5].innerText);
                        if(seeder > 0 && seeder < 4){
                            hidden = false;
                        }
                    }
                    if(chdOfficial && chdUnofficial){
                    }
                    else if(chdOfficial){
                        if(row.cells[1].innerText.indexOf('tag-gf') !== -1){
                            hidden = true;
                        }
                    }else if(chdUnofficial){
                        if(row.cells[1].innerText.indexOf('tag-gf') === -1){
                            hidden = true;
                        }
                    }else{
                        hidden = true;
                    }
                }
                if(hidden){
                    row.parentNode.removeChild(row);
                    await sleep(5);
                }
            }
            btnFilterTorrents.removeAttribute("disabled");
        }
    }

    var x = document.querySelectorAll("td>p>a>b");
    for (var i = 0; i < x.length; i++) {
        if(x[i].innerText.indexOf("上一页") != -1 || x[i].innerText.indexOf("下一页") != -1) {
            x[i].parentNode.parentNode.appendChild(document.createElement("br"));
            var btnFilterTorrents = document.createElement("input");
            btnFilterTorrents.setAttribute("type","button");
            btnFilterTorrents.setAttribute("value","筛选本页魔力种子");
            btnFilterTorrents.setAttribute("id",'btnFilterTorrents');
            btnFilterTorrents.setAttribute("title",'仅显示3G以上nG以下，做种人数1-4的种子');
            btnFilterTorrents.setAttribute("style", 'margin-top:10px;margin-bottom:-5px;font-weight:bold;color:red');
            x[i].parentNode.parentNode.appendChild(btnFilterTorrents);
            document.getElementById ("btnFilterTorrents").addEventListener("click", FilterTorrents, false);

            var chdOfficial = GM_getValue('chdOfficial');
            if(chdOfficial === undefined){
                chdOfficial = true;
            }
            var cboxChdOfficial = document.createElement("input");
            cboxChdOfficial.setAttribute("type","checkbox");
            cboxChdOfficial.setAttribute("id",'cboxChdOfficial');
            cboxChdOfficial.setAttribute("style", 'margin-left:20px;margin-top:15px;margin-bottom:-5px;');
            if(chdOfficial){
                cboxChdOfficial.setAttribute("checked", true);
            }
            x[i].parentNode.parentNode.appendChild(cboxChdOfficial);
            x[i].parentNode.parentNode.appendChild(document.createTextNode("官种"));

            var chdUnofficial = GM_getValue('chdUnofficial');
            if(chdUnofficial === undefined){
                chdUnofficial = true;
            }
            var cboxChdUnofficial = document.createElement("input");
            cboxChdUnofficial.setAttribute("type","checkbox");
            cboxChdUnofficial.setAttribute("id",'cboxChdUnofficial');
            cboxChdUnofficial.setAttribute("style", 'margin-left:20px;margin-top:15px;margin-bottom:-5px;');
            if(chdUnofficial){
                cboxChdUnofficial.setAttribute("checked", true);
            }
            x[i].parentNode.parentNode.appendChild(cboxChdUnofficial);
            x[i].parentNode.parentNode.appendChild(document.createTextNode("非官种"));

            var labelMaxFilterSize = document.createElement("span");
            labelMaxFilterSize.appendChild(document.createTextNode("最大(GB)"));
            labelMaxFilterSize.setAttribute("style", 'margin-left:20px;margin-top:10px;margin-bottom:-5px;');
            x[i].parentNode.parentNode.appendChild(labelMaxFilterSize);

            var maxFilterSize = GM_getValue('maxFilterSize');
            if(maxFilterSize == undefined || maxFilterSize <= 3){
                maxFilterSize = 5;
            }
            var txtMaxFilterSize = document.createElement("input");
            txtMaxFilterSize.setAttribute("type","text");
            txtMaxFilterSize.setAttribute("value",maxFilterSize);
            txtMaxFilterSize.setAttribute("id", "maxFilterSize");
            txtMaxFilterSize.setAttribute("title", "根据魔力规则需大于3，限数字");
            txtMaxFilterSize.setAttribute("style", 'width:30px;margin-left:5px;margin-top:10px;margin-bottom:-5px;text-align:center;');
            x[i].parentNode.parentNode.appendChild(txtMaxFilterSize);
            break;
        }
    }
})();