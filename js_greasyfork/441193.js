// ==UserScript==
// @name         编程猫社区防沉迷插件
// @namespace    https://shequ.codemao.cn/user/3819961
// @version      0.2
// @description  暂时绕过编程猫社区的防沉迷系统，只是临时方案。
// @author       xxtg666
// @match        https://shequ.codemao.cn/work/*
// @icon         https://shequ.codemao.cn/favicon.ico
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441193/%E7%BC%96%E7%A8%8B%E7%8C%AB%E7%A4%BE%E5%8C%BA%E9%98%B2%E6%B2%89%E8%BF%B7%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/441193/%E7%BC%96%E7%A8%8B%E7%8C%AB%E7%A4%BE%E5%8C%BA%E9%98%B2%E6%B2%89%E8%BF%B7%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var d = new Date();
    var hour= d.getHours();
    var x=hour>=22;
    var y=hour<8;
    var z=window.location.href;
    var lk="https://api.codemao.cn/creation-tools/v1/works/";
    var id=z.replace("https://shequ.codemao.cn/work/","");
    var playerlk="";
    $.ajax({
        type : "get",
        url :lk+id,
        async : false,
        dataType:'json',
        success : function(res){
            var data = res;
            console.log(data);
            console.log(data.type);
            switch(data.type){
                case "KITTEN3":
                    playerlk="https://player.codemao.cn/old/";
                    break;
                case "KITTEN4":
                    playerlk="https://player.codemao.cn/new/we/";
                    break;
                case "NEMO":
                    playerlk="https://nemo.codemao.cn/w/";
                    break;
            }
            console.log(playerlk);
            console.log(id);
            var e=function(){
                var i=function(){
                    document.getElementsByClassName("c-virtual_player--virtual_player")[0].innerHTML='<iframe src="'+playerlk+id+'"></iframe>';
                }
                setTimeout(i,5000);
            }
            if(x){console.warn("十点过了");e();}
            else if(y){console.warn("八点还没到");e();}
            else{console.warn("现在不是防沉迷时间！脚本没有执行")};
        }
    });
})();