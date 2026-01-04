// ==UserScript==
// @name         Lavida 尋找留言 給購物金
// @namespace    http://tampermonkey.net/
// @version      2024.04.11.01
// @description  Lavida 尋找留言 給購物金 功能
// @author       You
// @match        https://www.lavida.tw/adm_PPot4F/plusone/?action=listDispatcher&plusone_id=*
// @match        https://www.lavida.tw/adm_PPot4F/plusone/?page=*&page_size=*&plusone_id=*&*&action=listDispatcher
// @match        https://www.lavida.tw/adm_PPot4F/member/?action=edit&id=*&addmoney=1&money=*&title=*&remark=*
// @match        https://www.lavida.tw/adm_PPot4F/member/?*close=1*
// @match        https://luckypicker.quishop.live/lottery
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lavida.tw
// @license MIT
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/474287/Lavida%20%E5%B0%8B%E6%89%BE%E7%95%99%E8%A8%80%20%E7%B5%A6%E8%B3%BC%E7%89%A9%E9%87%91.user.js
// @updateURL https://update.greasyfork.org/scripts/474287/Lavida%20%E5%B0%8B%E6%89%BE%E7%95%99%E8%A8%80%20%E7%B5%A6%E8%B3%BC%E7%89%A9%E9%87%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.toString().includes("https://www.lavida.tw/adm_PPot4F/plusone/")){
        setTimeout(()=>{
            $('button:contains("查詢")').after(`
        <button type="button" class="btn btn-sm btn-danger" style="float:right" id="searchComment">尋找抽獎留言</button>
        <form>
             <table>
                   金額:<input type="text" name="money" id="money" class="form-control" value="">
                   顯示說明:<input type="text" name="title" id="title" class="form-control" value="">
                   管理備註:<input type="text" name="remark" id="remark" class="form-control" value="">
             <table/>
        <form/>
        `);

            $('#searchComment').click(function(){
                var prizes = prompt("請輸入中獎名單", "");

                console.log(prizes);
                if(!prizes){
                    alert("未輸入中獎名單");
                    return;
                }
                prizes = JSON.parse(prizes);
                if(prizes.length==0){
                    alert("未輸入中獎名單");
                    return;
                }

                var money = $('#money').val();
                var title = $('#title').val();
                var remark = $('#remark').val();

                if(!money || !title || !remark){
                    alert("未輸入購物金資訊");
                    return;
                }

                var postId = prizes[0].postId;
                console.log(postId);
                var posts = [];
                $('table tbody tr').each((index,ele)=>{



                    var tr = $(ele);
                    var url = tr.find('a[href*="https://www.lavida.tw/adm_PPot4F/plusone/?action=listEvent&dispatcher_id="]').attr('href');
                    var postId = tr.find('td:eq(3)').find('a[href*="https://www.facebook.com/"]').attr('href').replace("https://www.facebook.com/","");
                    posts.push({url,postId});
                    //console.log(url);
                    //console.log(postId);
                    //console.log(ele);
                });

                console.log(posts);

                var filterPosts = posts.filter(x=>x.postId==postId);
                if(filterPosts.length==0){
                    alert("尋找不到抽獎貼文");
                    return;
                }
                var filterPost = filterPosts[0];
                console.log(filterPost);
                var commentIds = prizes[0].winnerList.map(x=>x.id);

                var postUrl = filterPost.url;

                var result = [];
                var finalResult = getUserDataByComments(postUrl,commentIds,1,result);

                console.log(result);
                //alert(JSON.stringify(result));



                var event = {money,title,remark};

                var i=0;
                for(var member of result){
                    if(member.email=="未完成配對" || !member.accountId){
                        continue;
                    }

                    (function(i,member,event){

                        setTimeout(()=>{
                            window.open(`https://www.lavida.tw/adm_PPot4F/member/?action=edit&id=${member.accountId}&addmoney=1&money=${event.money}&title=${event.title}&remark=${event.remark}`);
                        },4500*i);
                    }(i,member,event));
                    i++;
                }

                //console.log({money,title,remark});
            });

            function getUserDataByComments(postUrl,commentIds,pageNo,result){

                var firstPage = $.ajax({type: "GET",
                                        url: `${postUrl}&page=${pageNo}`,
                                        async: false}
                                      ).responseText;
                //.responseText;
                //console.log(firstPage);
                var pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
                var matches = pattern.exec(firstPage);
                var bodyString =matches[1];
                //console.log(bodyString);
                var body = $(bodyString);
                //console.log(body);

                //console.log(body.find('row div-table-body'));
                //window.data = body;




                body.find('div.row div.div-table-body').each((index,ele)=>{
                    var table = $(ele);
                    var email=table.find('.dropdown button').text().trim();
                    //if(email!="未完成配對"){
                    var postId=table.find('a[href*="https://www.facebook.com/"]').attr('href').replace("https://www.facebook.com/","");
                    if(table.find('a[href*="https://www.lavida.tw/adm_PPot4F/member/?member_id%5B%5D="]').length>0){
                        var accountId=table.find('a[href*="https://www.lavida.tw/adm_PPot4F/member/?member_id%5B%5D="]').attr('href').replace("https://www.lavida.tw/adm_PPot4F/member/?member_id%5B%5D=","");
                    }
                    if(commentIds.includes(postId)){
                        console.log(postId);
                        console.log(email);
                        result.push({postId,email,accountId});
                    }
                    //}
                });

                var maxPageNo = pageNo;
                //console.log(maxPageNo);
                body.find('ul.pagination a[href*="?page="]').each((index,ele)=>{
                    var a = $(ele);
                    //console.log(a);
                    var page=a.text();
                    if(page>maxPageNo){
                        maxPageNo = parseInt(page);
                    }
                });
                //console.log(maxPageNo);

                console.log(commentIds);
                //console.log(result);
                if(commentIds.length==result.length){
                    return result;
                }else if(pageNo>=maxPageNo){
                    console.log("max");
                    return result;
                }else{
                    return getUserDataByComments(postUrl,commentIds,pageNo+1,result);
                }


            }
        },600);
    }else if (window.location.toString().includes("https://www.lavida.tw/adm_PPot4F/member/")){
        setTimeout(()=>{
            let params = new URLSearchParams(document.location.search);
            let close = params.get("close");

            if(close==1){
                unsafeWindow.close();
            }else{
                let money = params.get("money");
                let title = params.get("title");
                let remark = params.get("remark");


                $('input[name="shopping_money_action"][value="add"]').click();
                $('#shopping_money').val(money);
                $('#shopping_money_title').val(title);
                $('#shopping_money_remark').val(remark);





                console.log({money,title,remark});

                setTimeout(()=>{

                    var action = $('#form_add').attr('action');
                    $('#form_add').attr('action',`${action}&close=1`);
                    $('button[type="submit"]').first().click();
                },500);

            }
        },700);
    }else if (window.location.toString().includes("https://luckypicker.quishop.live/lottery")){
        /*
        var orignConsole = console.log;
        unsafeWindow.console.log = copyConsole;


        function copyConsole(name,content){
            orignConsole(arguments);
            if(name=="newPrizeList:"){

                var results = [];

                for(var item of content){
                    var result = {postId: item.winnerList[0].id.split("_")[0]};
                    var winnerList = item.winnerList.map(x=>({name:x.from.name,id:x.id.split("_")[1],message:x.message}));
                    result.winnerList = winnerList;
                    results.push(result);
                }

                console.log(JSON.stringify(results));
                GM_setClipboard(JSON.stringify(results));
                alert("已複製抽獎名單");
            }
        }*/
        var nativeForEach = Array.prototype.forEach;
        Array.prototype.forEach = function (values){
            if(values.length>1 && this.length==1 && this[0].activityName && this[0].winnerList.length>0){
                //console.log(values);
                //console.log(this);
                
                var results = [];

                for(var item of this){
                    var result = {postId: item.winnerList[0].id.split("_")[0]};
                    var winnerList = item.winnerList.map(x=>({name:x.from.name,id:x.id.split("_")[1],message:x.message}));
                    result.winnerList = winnerList;
                    results.push(result);
                }

                console.log(JSON.stringify(results));
                GM_setClipboard(JSON.stringify(results));                
            }
            nativeForEach.call(this, values);
        }        
    }


    // Your code here...
})();