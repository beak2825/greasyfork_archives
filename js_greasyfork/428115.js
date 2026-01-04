// ==UserScript==
// @name         bilibili网页版空间勋章墙
// @namespace    medal_info
// @version      0.12
// @description  打开个人空间页面即可，需要登录
// @author       xiaoso
// @match        https://space.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/428115/bilibili%E7%BD%91%E9%A1%B5%E7%89%88%E7%A9%BA%E9%97%B4%E5%8B%8B%E7%AB%A0%E5%A2%99.user.js
// @updateURL https://update.greasyfork.org/scripts/428115/bilibili%E7%BD%91%E9%A1%B5%E7%89%88%E7%A9%BA%E9%97%B4%E5%8B%8B%E7%AB%A0%E5%A2%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let roomId = window.location.pathname.replace(/[^0-9]/ig,"");
    function createBtn(value,url,wearing_status){
        let myBtn = document.createElement("input");
        myBtn.type = "button";
        myBtn.value = value;
        myBtn.onclick = function(){
            window.open(url);
        }
        if(wearing_status===1){
            myBtn.style = "margin:2px;padding:3px;border:1.5px solid #31B404;background:none";
        }else{
            myBtn.style = "margin:2px;padding:3px;border:1.5px solid #96c2f1;background:none";
        }


        return myBtn;

    }
    function addInfo(){
        let info = document.getElementsByClassName("col-2")[0];
        let newDiv = document.createElement("div");
        info.append(newDiv);

        $.ajax({
            url:"https://api.live.bilibili.com/xlive/web-ucenter/user/MedalWall?target_id="+roomId,
            type: "get",
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
                //console.log("请求成功");
                //console.log(data.data);
                let count = data.data.count;
                for(let i=0;i<count;i++){
                    let node = data.data.list[i];
                    let medal_name = node.medal_info.medal_name;
                    let level = node.medal_info.level;
                    let url = node.link;
                    newDiv.append(createBtn(medal_name+" "+level,url,node.medal_info.wearing_status));

                }
                let status;
                if(data.data.close_space_medal===1){
                    status = createBtn("勋章墙非公开","",1);
                }else if(data.data.only_show_wearing===1){
                    status = createBtn("公开正在佩戴的勋章","",1);
                }else{
                    status = createBtn("公开所有勋章","",1);

                }
                newDiv.append(status);

            },
        })

    }
    setTimeout(addInfo,3000);
})();