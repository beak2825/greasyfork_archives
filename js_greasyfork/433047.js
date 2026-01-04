// ==UserScript==
// @name         HDC保种统计
// @namespace    http://tampermonkey.net/
// @version      0.9.3
// @description  Seeds statistics for HDChina
// @author       ootruieo
// @license      GNU GPLv3
// @match        https://hdchina.org/userdetails.php?id=*
// @match        https://hdchina.org/torrents.php?*
// @grant        GM_getValue
// @grant        GM_setValue

// @downloadURL https://update.greasyfork.org/scripts/433047/HDC%E4%BF%9D%E7%A7%8D%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/433047/HDC%E4%BF%9D%E7%A7%8D%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==
//v0.9.3:筛选官种剔除已保种和下载中
//v0.9.2:新增数个官种标签
//v0.9.1:修复[仅官种]按钮失效的bug
//v0.9:自适应种子页面人数过滤
//v0.8:增加种子页面人数过滤功能
//v0.7:增加官组TAICHI
//v0.6:剔除重复统计；新增筛选官种功能
//v0.5:修复名字过长导致的未统计

(function() {
    'use strict';

    // Your code here...

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e)=>{console.log(e);});
    }

    const ShowOfficialTorrents = function()
    {
        var seeding = document.getElementById("ka1").childNodes;
        if(document.getElementById ("cboxOfficialOnly").checked){
            for(var i=1;i<seeding[1].rows.length;i++){
                if(seeding[1].rows[i].id =="unofficial" || seeding[1].rows[i].id =="dunplicate" ){
                    seeding[1].rows[i].setAttribute("style", "display:none");
                }
            }
        }
        else{
            for(var i=1;i<seeding[1].rows.length;i++){
                if(seeding[1].rows[i].id =="unofficial"){
                    seeding[1].rows[i].removeAttribute("style");
                }
            }
        }
    }

    const HighlightOfficialTorrents = function()
    {
        var seeding = document.getElementById("ka1").childNodes;
        if(document.getElementById ("cboxOfficialBgColor").checked){
            for(var i=1;i<seeding[1].rows.length;i++){
                if(seeding[1].rows[i].id =="official5"){
                    seeding[1].rows[i].setAttribute("style", "background:LightGreen !important");
                }
                else if(seeding[1].rows[i].id =="official10"){
                    seeding[1].rows[i].setAttribute("style", "background:LightBLue !important");
                }
                else if(seeding[1].rows[i].id =="official"){
                    seeding[1].rows[i].setAttribute("style", "background:Wheat !important");
                }
                else if(seeding[1].rows[i].id =="dunplicate"){
                    seeding[1].rows[i].setAttribute("style", "background:Grey !important");
                }
            }
        }
        else{
            for(var i=1;i<seeding[1].rows.length;i++){
                if(seeding[1].rows[i].id =="official"){
                    seeding[1].rows[i].removeAttribute("style");
                }
            }
        }
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

    const GetUserDetails = async function(){
        var x = document.querySelectorAll("table>tbody>tr>td>a");
        for (var i = 0; i < x.length; i++) {
            if(x[i].href.indexOf("getusertorrentlistajax") != -1 && x[i].href.indexOf("seeding") != -1) {
                x[i].click();
                var seeding = document.getElementById("ka1");
                var seedingImg = document.getElementById("pica1");
                var seedingNodes = seeding.childNodes;
                var retryCount = 0;
                while(retryCount < 10 && seedingNodes.length ==0){
                    await sleep(1000);
                    retryCount += 1;
                    seedingNodes = seeding.childNodes;
                }
                seeding.setAttribute("style","display: none;");
                seedingImg.setAttribute("class","plus");
                var seedingSize = 0;
                var seedingle5 =0;
                var seedingLe5Size = 0;
                var seedingle10 =0;
                var seedingLe10Size = 0;
                var officialSeedCount = 0;
                var setIds = new Set();
                seedingNodes[1].setAttribute("id",'seedingTable');
                var reg = /[@-]\s?(HDChina|HDCTV|iHD|HDWinG|HDWTV|HDC|TAiCHi|tudou|kevin9611|k9611|K9|Enichi|CBFM|AREY)(|.mkv|.mp4|.ts|.iso)$/i ;
                for(var ti=1;ti<seedingNodes[1].rows.length;ti++){
                    var titleElementA = seedingNodes[1].rows[ti].cells[1].getElementsByTagName('a')[0];
                    if(!setIds.has(titleElementA.href)) {
                        setIds.add(titleElementA.href);
                        var title = titleElementA.title;
                        if(title.match(reg) != null){
                            officialSeedCount += 1;
                            var isLe5 = (parseInt(seedingNodes[1].rows[ti].cells[3].innerText)<=5);
                            var isLe10 = (parseInt(seedingNodes[1].rows[ti].cells[3].innerText)<=10);
                            var size = seedingNodes[1].rows[ti].cells[2].innerText;
                            var sizeValue = SizeToGb(size);

                            if(isLe10){
                                seedingNodes[1].rows[ti].id="official10";
                                seedingle10 += 1;
                                seedingLe10Size += sizeValue;
                            }
                            if(isLe5){
                                seedingNodes[1].rows[ti].id="official5";
                                seedingle5 += 1;
                                seedingLe5Size += sizeValue;
                            }
                            else{
                                seedingNodes[1].rows[ti].id="official";
                            }
                            seedingSize += sizeValue;
                        }
                        else{
                            seedingNodes[1].rows[ti].id="unofficial";
                        }
                    }
                    else{
                        seedingNodes[1].rows[ti].id="dunplicate";
                    }
                }
                x[i].innerHTML +=(`【官种: ${officialSeedCount}(${(seedingSize/1024).toFixed(2)}TB)；<=5人: ${seedingle5}(${(seedingLe5Size/1024).toFixed(2)}TB)；<=10人: ${seedingle10}(${(seedingLe10Size/1024).toFixed(2)}TB)】`);
                var cboxOfficialOnly=document.createElement("input");
                cboxOfficialOnly.setAttribute("type","checkbox");
                cboxOfficialOnly.setAttribute("id",'cboxOfficialOnly');
                cboxOfficialOnly.setAttribute("style", 'margin-left:30px;');
                cboxOfficialOnly.onchange = ShowOfficialTorrents;

                var spanOfficialOnly = document.createElement('span');
                spanOfficialOnly.style.fontWeight = "bold";
                spanOfficialOnly.style.color = "red";
                spanOfficialOnly.appendChild(document.createTextNode(`仅显示官种(${officialSeedCount})`));
                seedingNodes[0].appendChild(cboxOfficialOnly);
                seedingNodes[0].appendChild(spanOfficialOnly);

                var cboxOfficialBgColor=document.createElement("input");
                cboxOfficialBgColor.setAttribute("type","checkbox");
                cboxOfficialBgColor.setAttribute("id",'cboxOfficialBgColor');
                cboxOfficialBgColor.setAttribute("style", 'margin-left:30px;');
                cboxOfficialBgColor.onchange = HighlightOfficialTorrents;

                var spanOfficialBgColor = document.createElement('span');
                spanOfficialBgColor.style.fontWeight = "bold";
                spanOfficialBgColor.style.color = "red";
                spanOfficialBgColor.appendChild(document.createTextNode('突出显示官种'));
                seedingNodes[0].appendChild(cboxOfficialBgColor);
                seedingNodes[0].appendChild(spanOfficialBgColor);

                break;
            }
        }
    }

    const HdcAutoFilterChanged = function(){
        var hdcAutoFilter = document.getElementById('cboxHdcAutoFilter').checked;
        GM_setValue('hdcAutoFilter', hdcAutoFilter);

        var hdcMaxFilter = parseFloat(document.getElementById('txtHdcMaxFilter').value);
        if(isNaN(hdcMaxFilter) || hdcMaxFilter < 1){
            hdcMaxFilter = 1;
        }
        GM_setValue('hdcMaxFilter', hdcMaxFilter);
    }

    const FilterTorrentList = function(){
        var navBar = document.getElementById('ad_seeders');
        if(navBar != null){
            var hdcAutoFilter = GM_getValue('hdcAutoFilter');
            if(hdcAutoFilter === undefined){
                hdcAutoFilter = true;
            }

            var cboxHdcAutoFilter = document.createElement("input");
            cboxHdcAutoFilter.setAttribute("type","checkbox");
            cboxHdcAutoFilter.setAttribute("id",'cboxHdcAutoFilter');
            cboxHdcAutoFilter.setAttribute("title",'是否启用进入页面后的自动过滤功能\n此选项变更后在下一次进入页面生效');
            cboxHdcAutoFilter.setAttribute("style", 'margin-left:20px;');
            if(hdcAutoFilter){
                cboxHdcAutoFilter.setAttribute("checked", true);
            }
            cboxHdcAutoFilter.onchange = HdcAutoFilterChanged;
            navBar.appendChild(cboxHdcAutoFilter);
            navBar.appendChild(document.createTextNode("自动过滤"));

            var hdcMaxFilter = GM_getValue('hdcMaxFilter');
            if(hdcMaxFilter == undefined){
                hdcMaxFilter = 4;
            }

            var txtHdcMaxFilter = document.createElement("input");
            txtHdcMaxFilter.setAttribute("type","text");
            txtHdcMaxFilter.setAttribute("value",hdcMaxFilter);
            txtHdcMaxFilter.setAttribute("id", "txtHdcMaxFilter");
            txtHdcMaxFilter.setAttribute("title", "保留种子最大人数限制值;\n需勾选[自动按钮]保存,并在下一次进入页面生效");
            txtHdcMaxFilter.setAttribute("style", 'width:15px;text-align:center;');
            navBar.appendChild(txtHdcMaxFilter);

            if(hdcAutoFilter){
                var torrents = document.getElementsByClassName('torrent_list');
                if(torrents != null && torrents.length > 0){
                    let filterCount = 0 ;
                    var seederIndex = 5;
                    var leecherIndex = 6;
                    var torrIndex = 1;
                    for(var ci = 0 ;ci < torrents[0].rows[0].cells.length; ci++){
                         if(torrents[0].rows[0].cells[ci].innerHTML.indexOf('class="tbname"') != -1){
                            torrIndex = ci;
                        }else if(torrents[0].rows[0].cells[ci].innerHTML.indexOf('class="seeders"') != -1){
                            seederIndex = ci;
                        }else if(torrents[0].rows[0].cells[ci].innerHTML.indexOf('class="leechers"') != -1){
                            leecherIndex = ci;
                        }
                    }
                    for(var ti = torrents[0].rows.length - 1;ti > 0 ;ti--){
                        var row = torrents[0].rows[ti];
                        var seeder = parseInt(row.cells[seederIndex].innerText);
                        var leecher = parseInt(row.cells[leecherIndex].innerText);
                        if(seeder + leecher > hdcMaxFilter
                           || row.cells[torrIndex].innerHTML.indexOf('="progress_seeding"') != -1
                           || row.cells[torrIndex].innerHTML.indexOf('="progress_downloading"') != -1 ){
                            row.parentNode.removeChild(row);
                            filterCount ++;
                        }
                    }
                    navBar.appendChild(document.createTextNode(`(本页剔除${filterCount}个)`));
                }
            }
        }
    }

    if(location.href.indexOf("userdetails.php")>-1){
        GetUserDetails();
    }else if(location.href.indexOf("torrents.php") > -1 && (location.href.indexOf("team1")  > -1
                                                         || location.href.indexOf("team=1") > -1
                                                         || location.href.indexOf("team=22") > -1
                                                         || location.href.indexOf("team=28") > -1
                                                         || location.href.indexOf("team=31") > -1
                                                         || location.href.indexOf("team=32") > -1)){
        FilterTorrentList();
    }
})();