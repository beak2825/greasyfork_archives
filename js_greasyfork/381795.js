// ==UserScript==
// @name        HSPTV!BBS GetIP(Velgail fork)
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description HSPTV!掲示板の記事のIPアドレスを取得します。
// @author      Velgail
// @include     *://hsp.tv/play/pforum.php?mode=*&num=*
// @downloadURL https://update.greasyfork.org/scripts/381795/HSPTV%21BBS%20GetIP%28Velgail%20fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/381795/HSPTV%21BBS%20GetIP%28Velgail%20fork%29.meta.js
// ==/UserScript==

    var pforumSource = document.getElementsByTagName("html")[0].innerHTML;
    var pforumResult = pforumSource.match( /\<!--.*--><br><br>/g );
    var pforumCount = 0;
    var pforumInfos = document.querySelectorAll("div>table>tbody>tr>td>table>tbody>tr>td>div#info>table>tbody")
    var nameIpList=new Array(pforumResult.length);
    for ( pforumCount = 0; pforumCount < pforumResult.length; pforumCount++ ) {
        pforumResult[pforumCount] = pforumResult[pforumCount].replace( new RegExp( "<!--", "g" ), "" );
        pforumResult[pforumCount] = pforumResult[pforumCount].replace( new RegExp( "--><br><br>", "g" ), "" );
        if(pforumResult[pforumCount]!==""){
            pforumInfos[pforumCount].innerHTML+="<tr><td align=\"center\" valign=\"middle\" bgcolor=\"white\" width=\"130\"><p class=\"classes_name\">IP:" + pforumResult[pforumCount] + "</p></td></tr>";
        }
        nameIpList[pforumCount]={name:null,ip:null};
        nameIpList[pforumCount].name=pforumInfos[pforumCount].querySelectorAll("table>tbody>tr")[0].querySelectorAll("p")[0].innerText;
        nameIpList[pforumCount].ip=pforumInfos[pforumCount].querySelectorAll("table>tbody>tr")[1].querySelectorAll("p")[0].innerText;
    }

    //同名異IP判定・別名同IP判定
    for ( pforumCount = 0; pforumCount < pforumResult.length; pforumCount++ ) {
        if (nameIpList.some(value=>{
            if((value.name==nameIpList[pforumCount].name)&&(value.ip!=nameIpList[pforumCount].ip)){
                return true;
            }
            return false;
        })){
            pforumInfos[pforumCount].querySelectorAll("table>tbody>tr")[0].querySelectorAll("p")[0].style="background:#f88;"
        }
        if (nameIpList.some(value=>{
            if((value.ip==nameIpList[pforumCount].ip)&&(value.name!=nameIpList[pforumCount].name)){
                return true;
            }
            return false;
        })){
            pforumInfos[pforumCount].querySelectorAll("table>tbody>tr")[1].querySelectorAll("p")[0].style="background:#ff8;"
        }
    }


