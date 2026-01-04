// ==UserScript==
// @name         学校一键认领
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一键认领学校已保种
// @author       ootruieo
// @match        https://pt.btschool.club/userdetails.php?id=*
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523541/%E5%AD%A6%E6%A0%A1%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.user.js
// @updateURL https://update.greasyfork.org/scripts/523541/%E5%AD%A6%E6%A0%A1%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e)=>{console.log(e);});
    }

    window.onload = function(){
        var rows = document.querySelectorAll("tr");
        for (var i = 0; i < rows.length; i++) {
            if(rows[i].childElementCount==2 && rows[i].cells[0].innerText=="当前做种"){
                var idClaim = document.getElementById("claimAllTorrents");
                if(idClaim == null){
                    rows[i].cells[1].innerHTML+=('<a id="claimAllTorrents" href="javascript:void(0);" onclick="window.manualClaimTorrents();" style="margin-left:10px;font-weight:bold;color:red" title="认领全部当前做种（运行后无法停止，强制停止可关闭页面）">一键认领</a>');
                    break;
                }
            }
        }
    }

    unsafeWindow.manualClaimTorrents = async function(){
        var msg = "确定要认领全部种子吗？\n\n严正警告：\n请勿短时间内多次点击，否则后果自负！\n请勿短时间内多次点击，否则后果自负！\n请勿短时间内多次点击，否则后果自负！";
        if (confirm(msg)==true){
            var x = document.querySelectorAll("a");
            for (var i = 0; i < x.length; i++) {
                if(x[i].href.indexOf("getusertorrentlistajax") != -1 && x[i].href.indexOf("seeding") != -1) {
                    eval(x[i].href);
                    var seedingNodes = document.getElementById("ka1").childNodes;
                    var maxClaim = 500;
                    var result = await unsafeWindow.ClassificationClaimTorrents(seedingNodes[3], true, maxClaim);
                    var total = result.total;
                    var success = result.success;
                    if(success < maxClaim && total - success > 0){
                        result = await unsafeWindow.ClassificationClaimTorrents(seedingNodes[3], false, maxClaim - success);
                        success += result.success;
                    }
                    alert(`共计${total}个种子，本次成功认领${success}个。`);
                    var idClaim = document.getElementById("claimAllTorrents");
                    idClaim.parentNode.removeChild(idClaim);
                }
            }
        }
    }

    unsafeWindow.ClassificationClaimTorrents = async function(element, official, maxClaim)
    {
        var total = 0, success = 0;
        var reg = /[@-]\s?(FFansBD|OPS|FFansTV|FFansWEB|FFans)(|.mkv|.mp4)$/i ;
        for(var ti=1;ti<element.rows.length;ti++){
            if(success >= maxClaim) {
                alert("最多只能认领500个种子！");
                break;
            }
            var titleElementA = element.rows[ti].cells[1].getElementsByTagName('a')[0];
            total += 1;
            var matchOfficial = titleElementA.title.match(reg);
            if((matchOfficial == null && official) || (matchOfficial != null && !official)){
                continue;
            }
            var torrentid = titleElementA.href.replace("https://pt.btschool.club/","").replace("details.php?id=","").replace("&hit=1","");
            var result = ajax.gets('viewclaims.php?add_torrent_id=' + torrentid);
            if (result && !result.includes("添加成功")) {
                element.rows[ti].setAttribute("style", "background:LightPink !important");
            } else {
                element.rows[ti].setAttribute("style", "background:LightGreen !important");
                success += 1;
            }
            await sleep(1000);
        }
        return{
            total:total,
            success:success
        }
    }
})();