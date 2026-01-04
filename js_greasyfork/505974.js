// ==UserScript==
// @name         三阶勋章用公糖查询
// @namespace    https://sstm.moe/profile/197610-367ddd/
// @version      0.1
// @description  查询180天内，自己得到的含有一次性30节操以上且总节操数大于30的公糖记录
// @author       367ddd(叫我牛顿吧)
// @license MIT
// @match        https://sstm.moe/notifications/*
// @icon         https://s.sstmlt.com/board/monthly_2017_06/logo_1479532980294_5d1829.png.7c198e484115f85daaf0f04963f81954.png.418af10c64761f5ef969fe30c7992a40.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505974/%E4%B8%89%E9%98%B6%E5%8B%8B%E7%AB%A0%E7%94%A8%E5%85%AC%E7%B3%96%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/505974/%E4%B8%89%E9%98%B6%E5%8B%8B%E7%AB%A0%E7%94%A8%E5%85%AC%E7%B3%96%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let publicfundid=0;
    let nowtime=new Date();
    let inpage=1;
    var setint = null;
    let selectgoal=1;
    let selectnums=0;
    var allpages=$('.ipsPagination_last>a').length>0?parseInt($('.ipsPagination_last>a').attr('data-page')):1;
    let idsarray=new Array();
    function deldot(str){
        const regex = /,/g;
        return str.replace(regex, '');
    }
    function autosubmit(link,object,time){
        var xhr = new XMLHttpRequest();
        var doc = null;
        xhr.open('GET', link, true);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                var response = this.response;
                var parser = new DOMParser();
                doc = parser.parseFromString(response, 'text/html');
                if(doc==null){console.error();}
                let dataid=0;
                let jiecao=0;
                let maxjiecao=0;
                let output='';
                dataid=link.match(/\d+/g).pop();
                $(doc).find('[data-commentid="'+dataid+'"]').find('tr.ratePublicFund').each(function(){
                    if(this.children[1].innerText.includes('节操')){
                        output+=(deldot(this.children[1].innerText)+'--》'+this.children[2].innerText+'<br>'+'\n');
                        maxjiecao=parseInt(deldot(this.children[1].innerText))>maxjiecao?parseInt(deldot(this.children[1].innerText)):maxjiecao;
                        jiecao+=parseInt(deldot(this.children[1].innerText));
                    }
                });
                selectnums++;
                if(jiecao>30&&maxjiecao>30){
                    idsarray.push([object,time]);
                    $('<div>'+output.trim()+'</div>').insertAfter($('#'+object).find('a.ipsDataItem_title')[0]);
                    return(true);
                }else{
                    $('#'+object)[0].remove();
                    return(false);
                }
            } else {
                console.error(this.statusText);
            }
        };
        xhr.send();
    }
    function selectfunds(){
        $('ol[data-role="tableRows"]>li').each(function(){
            let link=$(this).find('a.ipsDataItem_title')[0];
            if(link.innerText.match(/被评分$/)!=null){
                let temptime=new Date($(this).find('time').attr('datetime'));
                if((nowtime-temptime)>=1000*3600*24*183){
                    this.remove();
                    return;
                }
                this.id=publicfundid;
                autosubmit(link.href,publicfundid,temptime);
                publicfundid++;
            }
        });
    }
    function addpage(page){
        var xhr = new XMLHttpRequest();
        var doc = null;
        xhr.open('GET','https://sstm.moe/notifications/?page='+page, true);
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                var response = this.response;
                var parser = new DOMParser();
                doc = parser.parseFromString(response, 'text/html');
                if(doc==null){console.error();}
                $(doc).find('ol[data-role="tableRows"]>li').each(function(){
                    let temptime=new Date($(this).find('time').attr('datetime'));
                    if((nowtime-temptime)>=1000*3600*24*180){
                        inpage=allpages+1;
                        return;
                    }
                    if($(this).find('a.ipsDataItem_title')[0].innerText.match(/被评分$/)!=null){
                        $('ol[data-role="tableRows"]').append(this);
                    }
                });
                inpage++;
            } else {
                console.error(this.statusText);
            }
        };
        xhr.send();
    }
    function addpages(){
        let outpage=1;
        /*setint= setInterval(function(){
            if(inpage>allpages){
                clearInterval(setint);
                selectfunds();
                alert('评分记录插入完成，公糖评分查询中');
            }
            if(inpage==outpage&&inpage<=allpages){
                addpage(inpage);
                outpage++;
            }
        },200);*/
        setint= setInterval(function(){
            if(outpage<=allpages){
                addpage(outpage);
                outpage++;
            }
            else if(inpage>allpages){
                clearInterval(setint);
                setint= setInterval(function(){if(selectnums>=selectgoal){
                    clearInterval(setint);
                    idsarray.sort(function(a,b){if(a[1]>b[1]){return(-1);}else{return(1);}});
                    let i=0;
                    for(;i<idsarray.length;i++){
                        $('ol[data-role="tableRows"]').append($('#'+idsarray[i][0])[0]);
                    }
                    alert('查询结束');
                }},200);
                selectgoal=$('ol[data-role="tableRows"]>li').length;
                selectfunds();
            }

        },20);
    }
    $('div[data-role="tablePagination"]')[0].append($('<div><button id=fundsbutton>三阶勋章用公糖查询</button></div>')[0]);
    $('#fundsbutton')[0].addEventListener("click",function(){
        $('ol[data-role="tableRows"]>li').each(function(){this.remove();});
        addpages();
        $('#fundsbutton')[0].remove();
    });
    // Your code here...
})();