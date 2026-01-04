// ==UserScript==
// @name         MT批量下载整页种子，刷魔好帮手
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       You
// @match        https://tp.m-team.cc/torrents.php?sort=5&type=asc
// @match        https://tp.m-team.cc/adult.php?sort=5&type=asc
// @grant        none
// @require        http://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/32261/MT%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E6%95%B4%E9%A1%B5%E7%A7%8D%E5%AD%90%EF%BC%8C%E5%88%B7%E9%AD%94%E5%A5%BD%E5%B8%AE%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/32261/MT%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E6%95%B4%E9%A1%B5%E7%A7%8D%E5%AD%90%EF%BC%8C%E5%88%B7%E9%AD%94%E5%A5%BD%E5%B8%AE%E6%89%8B.meta.js
// ==/UserScript==

(function() {

    var j=2;
    var pages=100;            //下载种子页数限制
    var count=1000;           //下载种子数目限制
    var size=400;             //下载种子大小限制（MB）
    var sizeflag=false;       //文件大小限制启动标志(不进行设置为下载小于400m)
    var pageflag=false;       //种子页数限制启动标志
    var countflag=false;      //种子数目限制启动标志
    var p=1;                  //当前页数
    var c=0;                  //当前下载数
    var shutdown=false;             //条件满足结束
    size=prompt("下载所有大小小于 X MB的种子");
    size=parseInt(size);
    sizeflag=true;
    if(isNaN(size)){
        sizeflag=false;
    }
    if(size < 0){
        sizeflag=false;
    }
    console.log(sizeflag);
    console.log(size);
    if(!sizeflag){
        count=prompt("总共下载多少个种子");
        count=parseInt(count);
        countflag=true;
        if(isNaN(count)){
            countflag=false;
        }
        if(count < 0){
            countflag=false;
        }
    }


    console.log(sizeflag);
    console.log(size);
    if(!(countflag||sizeflag)){
        pages=prompt("总共下载多少页种子");
        pages=parseInt(pages);
        pageflag=true;
        if(isNaN(pages)){
            pageflag=false;
            console.log('nan?');
        }
        if(pages < 0){
            pageflag=false;
            console.log('<0?');
        }
    }


    console.log(sizeflag);
    console.log(size);

    console.log(countflag);
    console.log(count);

    console.log(pageflag);
    console.log(pages);

    if((pageflag||countflag||sizeflag))
    {
        if(window.location.href=="https://tp.m-team.cc/adult.php?sort=5&type=asc")
            current="https://tp.m-team.cc/adult.php?inclbookmarked=0&incldead=1&spstate=0&&sort=5&type=asc&page=0";
        if(window.location.href=="https://tp.m-team.cc/torrents.php?sort=5&type=asc")
            current="https://tp.m-team.cc/torrents.php?inclbookmarked=0&incldead=1&spstate=0&&sort=5&type=asc&page=0";
        fr4me='<frameset cols=\'63%,37%\'>\n';
        fr4me+='<frame name = dealing src=\''+current+'\'/>';
        //fr4me+='<frame name = funcing src=\''+current+'\'/>';
        fr4me+='<frame name = funcing />';
        fr4me+='</frameset>';
        with(document){write(fr4me);void(close());};

        testing();

    }

    //var dealing = window.frames["dealing"].document;
    //var funcing = window.frames["funcing"].document;


    function testing(){
        try{
            console.log("testing");
            e = $(window.frames["dealing"].document).find('#form_torrent > table > tbody > tr:nth-child(100) > td:nth-child(9)')[0].outerText;
            console.log(e);
            setTimeout(function(){working();},100);
        }
        catch(err){
            setTimeout(function(){testing();},500);
            console.log("未完成");
        }
    }
    function working(){

        for( j=2;j<102;j++){
            console.log("准备置顶");
            var sticky=$(window.frames["dealing"].document).find("#form_torrent > table > tbody > tr:nth-child("+j+") > td.torrenttr > table > tbody > tr")[0].className;
            console.log("准备置顶s");
            console.log(j);
            //if(sticky !== null)
            console.log(sticky);
            if(sticky.length == 0){
                console.log("大小");
                sizeHTML = $(window.frames["dealing"].document).find("#form_torrent > table > tbody > tr:nth-child("+j+")> td:nth-child(5)")[0].outerHTML;
                tail=sizeHTML.indexOf("<br>");
                head=sizeHTML.indexOf(">");
                console.log("准备大小");
                var fsize = sizeHTML.slice(head+1,tail);
                if(!sizeflag||(sizeHTML.search("<br>KB</td>")>0||(sizeHTML.search("<br>MB</td>")>0&&fsize<size))){
                    var flag=$(window.frames["dealing"].document).find('#form_torrent > table > tbody > tr:nth-child('+j+') > td:nth-child(9)')[0].outerText;
                    console.log("准备进度");
                    if(flag!="--"&&flag!="0.0%"){
                        console.log("skip "+j);
                    }
                    else {
                        console.log("down "+c++);
                        if(countflag&&c>count){
                            console.log("总数完成");
                            shutdown=true;
                            break;
                        }
                        var downurl=$(window.frames["dealing"].document).find('#form_torrent > table > tbody > tr:nth-child('+j+') > td.torrenttr > table > tbody > tr > td:nth-child(3) > a:nth-child(1)')[0].href;
                        var elemIF = window.frames["funcing"].document.createElement("iframe");
                        elemIF.src = downurl;
                        elemIF.style.display = "none";
                        window.frames["funcing"].document.body.appendChild(elemIF);
                    }
                }else{
                    console.log(fsize);
                    console.log(size);
                    console.log(fsize<size);
                    shutdown=true;
                    console.log("大小完成");
                    break;
                }

            }

        }


        if(pageflag&&++p>pages)
        {
            shutdown=true;
            //console.log("页数完成");
        }
        //console.log("完成!!!!!!!!!!");
        console.log(shutdown);
        if(!shutdown){
            var pageurl=$(window.frames["dealing"].document).find('#outer > table > tbody > tr > td > p > a:nth-child(2)')[0].href;
            window.frames["dealing"].document.location.href=pageurl;
            setTimeout(function(){testing();},5000);
        }



    }
    // Your code here...
})();