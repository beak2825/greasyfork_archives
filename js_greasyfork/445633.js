// ==UserScript==
// @name         PTer种子筛选
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  筛选PTer 【1-5人&100M-nG】种子
// @author       oo
// @match        https://pterclub.com/music.php*
// @match        https://pterclub.com/torrents.php*
// @match        https://pterclub.com/officialgroup.php*
// @license      GPLv3
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/445633/PTer%E7%A7%8D%E5%AD%90%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/445633/PTer%E7%A7%8D%E5%AD%90%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e)=>{console.log(e);});
    }

    var _sizeUnits = "BKMGTPEZY";
    var _sizeReg = /[KMGTPEZY]/i;
    const SizeToGb = function(size){
        var sizeNum = parseFloat(size);
        var m = size.match(_sizeReg);
        if( m != null){
            return sizeNum * Math.pow(1024, _sizeUnits.indexOf(m[0]) - 3);
        }else
        {
            return sizeNum/1024/1024/1024;
        }
    }

    const FilterTorrents = async function(){
        var torrents = document.getElementsByClassName('torrents');
        if(torrents.length > 0){
            var btnFilterTorrents = document.getElementById ("btnFilterTorrents");
            btnFilterTorrents.setAttribute("disabled","1");
            btnFilterTorrents.setAttribute("value", "正在筛选种子中...");
            btnFilterTorrents.setAttribute("style", 'margin-top:10px;margin-bottom:-5px;font-weight:bold;color:grey');
            var pterMaxFilterSize = parseFloat(GM_getValue('pterMaxFilterSize'));
            var pterNonOfficialOnly = GM_getValue('pterNonOfficialOnly');
            for(var ti = torrents[0].rows.length - 1;ti > 0 ;ti--){
                var row = torrents[0].rows[ti];
                var hidden = true;
                //跳过已下载
                var prog = row.cells[1].innerHTML;
                if(prog.indexOf('<img class="progbargreen') == -1 ){
                    var seeder = parseInt(row.cells[5].innerText);
                    if(seeder > 0 && seeder < 6){
                        var size = SizeToGb(row.cells[4].innerText)
                        if(size > 0.0977 && size < pterMaxFilterSize ){
                            hidden = false;
                        }
                        if(!hidden && pterNonOfficialOnly){
                            var reg = /[@-]\s?(PTERWEB|PTERMV|PTERGAME|PTERTV|PTER)(|.mkv|.mp4|.ts|.iso)$/i ;
                            var title = row.cells[1].getElementsByTagName('a')[0].title;
                            if(title.match(reg) !== null){
                                hidden = true;
                            }
                        }
                    }
                }
                if(hidden){
                    row.parentNode.removeChild(row);
                    await sleep(1);
                }
            }
            btnFilterTorrents.removeAttribute("disabled");
            btnFilterTorrents.setAttribute("value", "筛选本页魔力种子");
            btnFilterTorrents.setAttribute("style", 'margin-top:10px;margin-bottom:-5px;font-weight:bold;color:red');
        }
    }

    const PterMaxFilterSizeChanged = function(){
        var pterMaxFilterSize = parseFloat(document.getElementById('pterMaxFilterSize').value);
        if(pterMaxFilterSize === NaN){
            pterMaxFilterSize = 3;
        }
        GM_setValue('pterMaxFilterSize', pterMaxFilterSize);
    }

    const PterNonOfficialOnlyChanged = function(){
        var pterNonOfficialOnly = document.getElementById('cboxPterNonOfficialOnly').checked;
        GM_setValue('pterNonOfficialOnly', pterNonOfficialOnly);
    }

    const PterAutoFilterChanged = function(){
        var pterAutoFilterList = document.getElementById('cboxPterAutoFilterList').checked;
        GM_setValue('pterAutoFilterList', pterAutoFilterList);
    }

    var x = document.querySelectorAll("td>p>a>b");
    for (var i = 0; i < x.length; i++) {
        if(x[i].innerText.indexOf("上一页") != -1 || x[i].innerText.indexOf("下一页") != -1) {
            x[i].parentNode.parentNode.appendChild(document.createElement("br"));
            var btnFilterTorrents = document.createElement("input");
            btnFilterTorrents.setAttribute("type", "button");
            btnFilterTorrents.setAttribute("value", "筛选本页魔力种子");
            btnFilterTorrents.setAttribute("id", 'btnFilterTorrents');
            btnFilterTorrents.setAttribute("title", '仅显示nG以下，做种人数1-5的种子');
            btnFilterTorrents.setAttribute("style", 'margin-top:10px;margin-bottom:-5px;font-weight:bold;color:red');
            x[i].parentNode.parentNode.appendChild(btnFilterTorrents);
            document.getElementById ("btnFilterTorrents").addEventListener("click", FilterTorrents, false);

            var pterNonOfficialOnly = GM_getValue('pterNonOfficialOnly');
            if(pterNonOfficialOnly === undefined){
                pterNonOfficialOnly = false;
            }
            var cboxPterNonOfficialOnly=document.createElement("input");
            cboxPterNonOfficialOnly.setAttribute("type", "checkbox");
            cboxPterNonOfficialOnly.setAttribute("id",'cboxPterNonOfficialOnly');
            cboxPterNonOfficialOnly.setAttribute("style", 'margin-left:20px;margin-top:15px;margin-bottom:-5px;');
            if(pterNonOfficialOnly){
                cboxPterNonOfficialOnly.setAttribute("checked", true);
            }
            cboxPterNonOfficialOnly.onchange = PterNonOfficialOnlyChanged;
            x[i].parentNode.parentNode.appendChild(cboxPterNonOfficialOnly);
            x[i].parentNode.parentNode.appendChild(document.createTextNode("非官种"));

            var labelPterMaxFilterSize = document.createElement("span");
            labelPterMaxFilterSize.appendChild(document.createTextNode("最大(GB)"));
            labelPterMaxFilterSize.setAttribute("style", 'margin-left:10px;margin-top:10px;margin-bottom:-5px;');
            x[i].parentNode.parentNode.appendChild(labelPterMaxFilterSize);

            var pterMaxFilterSize = GM_getValue('pterMaxFilterSize');
            if(pterMaxFilterSize === undefined ){
                pterMaxFilterSize = 3;
            }
            var txtpterMaxFilterSize = document.createElement("input");
            txtpterMaxFilterSize.setAttribute("type", "text");
            txtpterMaxFilterSize.setAttribute("value", pterMaxFilterSize);
            txtpterMaxFilterSize.setAttribute("id", "pterMaxFilterSize");
            txtpterMaxFilterSize.setAttribute("style", 'width:30px;margin-left:5px;margin-top:10px;margin-bottom:-5px;text-align:center;');
            txtpterMaxFilterSize.onchange = PterMaxFilterSizeChanged;
            x[i].parentNode.parentNode.appendChild(txtpterMaxFilterSize);

            var pterAutoFilterList = GM_getValue('pterAutoFilterList');
            if(pterAutoFilterList === undefined){
                pterAutoFilterList = false;
            }
            var cboxPterAutoFilterList=document.createElement("input");
            cboxPterAutoFilterList.setAttribute("type","checkbox");
            cboxPterAutoFilterList.setAttribute("id",'cboxPterAutoFilterList');
            cboxPterAutoFilterList.setAttribute("title",'当满足勾选此选项且在人数降序的条件时自动筛选种子列表');
            cboxPterAutoFilterList.setAttribute("style", 'margin-left:20px;margin-top:15px;margin-bottom:-5px;');
            if(pterAutoFilterList){
                cboxPterAutoFilterList.setAttribute("checked", true);
            }
            cboxPterAutoFilterList.onchange = PterAutoFilterChanged;
            x[i].parentNode.parentNode.appendChild(cboxPterAutoFilterList);
            x[i].parentNode.parentNode.appendChild(document.createTextNode("自动筛选"));

            if(pterAutoFilterList && location.href.indexOf("sort=7") > -1 && location.href.indexOf("type=desc") > -1 ){
                FilterTorrents();
            }
            break;
        }
    }
})();