// ==UserScript==
// @name         白兔一键认领
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Seeds statistics for Hares
// @author       龘龗鱻爩
// @match        https://club.hares.top/userdetails.php?id=*
// @grant        GM.xmlHttpRequest
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/450906/%E7%99%BD%E5%85%94%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.user.js
// @updateURL https://update.greasyfork.org/scripts/450906/%E7%99%BD%E5%85%94%E4%B8%80%E9%94%AE%E8%AE%A4%E9%A2%86.meta.js
// ==/UserScript==
//更新记录
//v0.1 分页后的一键认领

(function() {
    'use strict';

    // Your code here...

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e)=>{console.log(e);});
    }

    const GetTorrentList = async function(page){
        let resp = await new Promise((resolve, reject) => {
               GM.xmlHttpRequest({
                   method: 'GET',
                   url: `https://club.hares.top/getusertorrentlistajax.php?page=${page}&limit=50&uid=${uid}&type=seeding`,
                   headers: {
                       'Accept': 'application/json, text/javascript, */*; q=0.01',
                   },
                   dataType: 'json',
                   onload: function(response){
                       resolve(response.responseText);
                   },
                })
            });
           if(resp != ''){
               return JSON.parse(resp);
           }
    }

    const ClaimAllTorrents = async function(){
        if(uid == '') return;
        var isOfficial = document.getElementById("cboxOfficialOnly").checked;
        var msg = `确定要认领全部${isOfficial ? '官种' : '种子'}吗？ \n\n请勿短时间内多次点击！\n请勿短时间内多次点击！\n请勿短时间内多次点击！`;
        if (confirm(msg)==true){
            var btnClaimTorrents = document.getElementById("btnClaimTorrents");
            btnClaimTorrents.setAttribute("disabled","1");
            var p = document.getElementById('rerer');
            let total = parseInt(p.childNodes[0].nodeValue.substring(6));
            if(total == 0) return;
            var official = 0, success = 0, claimed = 0;
            var reg = /[@-]\s?(HaresWEB|HaresTV|HaresMV|Hares)(|.mkv|.mp4|.ts|.iso)<\/a>/i ;
            var divLog = document.getElementById("divLog");
            for(var i = 1;i <= Math.ceil(total/50);i++){
                var ret = await GetTorrentList(i);
                if(ret.msg == "获取成功" && ret.data.length > 0){
                    for(var j = 0;j < ret.data.length;j++){
                        divLog.innerText = `认领中${i * 50 + j + 1}/${total}`;
                        if(isOfficial){
                            if(ret.data[j].name.match(reg) == null){if(ret.data[j].name.indexOf('Hares')!=-1){console.log(ret.data[j].name);};
                                continue;
                            }
                            official++;
                        }
                        if(ret.data[j].operation.indexOf('取消认领') == -1){
                            var torrentid = ret.data[j].torrent;
                            var result = ajax.gets(`claim.php?act=add&torrentid=${torrentid}`);
                            if (result.indexOf("false") == -1) {
                                success += 1;
                                console.log(`认领[${torrentid}]成功`);
                                await sleep(10);
                            }
                        }else{
                            claimed++;
                        }
                    }
                }
                await sleep(500);
            }
            divLog.innerText = `${isOfficial ? `${official}个官种` : `${total}个种子`},已认领${claimed}个,本次成功${success}个`;
            btnClaimTorrents.removeAttribute("disabled");
        }
    }

    const InjectOneKeyClaim = async function(){
        var p = document.getElementById('rerer');
        if(p != null && document.getElementById('btnClaimTorrents') == null){
            var divClaim = document.createElement('div');
            divClaim.setAttribute("id",'divClaim');
            divClaim.setAttribute("style",'white-space:nowrap;');

            var btnClaimTorrents = document.createElement("input");
            btnClaimTorrents.setAttribute("type","button");
            btnClaimTorrents.setAttribute("value","一键认领");
            btnClaimTorrents.setAttribute("id",'btnClaimTorrents');
            btnClaimTorrents.setAttribute("class", 'layui-btn layui-btn-xs layui-bg-black hvr-icon-drop');
            btnClaimTorrents.setAttribute("style",'margin-left:2px;margin-bottom:5px;');
            btnClaimTorrents.onclick = ClaimAllTorrents;
            divClaim.appendChild(btnClaimTorrents);

            var cboxOfficialOnly=document.createElement("input");
            cboxOfficialOnly.setAttribute("type","checkbox");
            cboxOfficialOnly.setAttribute("id",'cboxOfficialOnly');
            cboxOfficialOnly.setAttribute("class", 'layui-form-checkbox');
            cboxOfficialOnly.setAttribute("style",'margin-left:15px;margin-right:2px;margin-bottom:5px;');
            divClaim.appendChild(cboxOfficialOnly);
            divClaim.appendChild(document.createTextNode('仅官种'));

            var divLog =document.createElement('div');
            divLog.setAttribute("id",'divLog');
            divLog.setAttribute("style",'margin-left:15px;margin-right:2px;margin-bottom:5px;display:inline-block;');
            divClaim.appendChild(divLog);
            p.parentNode.insertBefore(divClaim, p.nextSibling);
        }
    }

    var uid = '';
    var uids = document.querySelectorAll("span>a");
    for (var i = 0; i < uids.length; i++) {
        if(uids[i].innerText.indexOf('UID') > -1){
            uid = uids[i].innerText.substring(4);
            break;
        }
    }
    if(uid == '') return;
    var seeding = document.querySelectorAll("li>a");
        for (var j = 0; j < seeding.length; j++) {
            if(seeding[j].innerText == '当前做种'){
                var oce = seeding[j].onclick.toString();
                if(oce != null && oce.indexOf(uid) != -1){
                    seeding[j].addEventListener('click', function(e) { InjectOneKeyClaim(); });
                }
                break;
            }
        }
})();