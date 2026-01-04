// ==UserScript==
// @name         小説家になろう - ブックマークフィルター
// @namespace    https://github.com/y-muen
// @license      MIT
// @version      0.1.1
// @description  小説家になろうでブックマークを未読のみにフィルターする。
// @author       Yoiduki <y-muen>
// @include      *://syosetu.com/favnovel*
// @icon         https://www.google.com/s2/favicons?domain=syosetu.com
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @supportURL   https://gist.github.com/y-muen/8e94feee3234ed67556a82e1d26ff55e
// @downloadURL https://update.greasyfork.org/scripts/443048/%E5%B0%8F%E8%AA%AC%E5%AE%B6%E3%81%AB%E3%81%AA%E3%82%8D%E3%81%86%20-%20%E3%83%96%E3%83%83%E3%82%AF%E3%83%9E%E3%83%BC%E3%82%AF%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/443048/%E5%B0%8F%E8%AA%AC%E5%AE%B6%E3%81%AB%E3%81%AA%E3%82%8D%E3%81%86%20-%20%E3%83%96%E3%83%83%E3%82%AF%E3%83%9E%E3%83%BC%E3%82%AF%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%83%BC.meta.js
// ==/UserScript==

(function(d, l) {
    'use strict';

    var url=l.href;
    var url_novel;
    var top;
    var color_hover;
    var color_hover2;
    if (String(url).match(/\:\/\/syosetu.com\/favnovelmain\//)){
        url_novel=/https:\/\/ncode.syosetu.com\/([^\/]+?)\/$/;
        top=d.getElementById("home");
        color_hover="#f0f9f9";
        color_hover2="#fdf6f6";
    }else if (String(url).match(/\:\/\/syosetu.com\/favnovelmain18\//)){
        url_novel=/https:\/\/novel18.syosetu.com\/([^\/]+?)\/$/;
        top=d.getElementsByClassName("xuser_top")[0];
        color_hover="#fdf6f6";
        color_hover2="#f0f9f9";
    }

    // ボタン作成
    var rm_status=localStorage.getItem("rm_status");
    var rm_botton = d.createElement('a');
    var lst_botton = d.createElement('a');
    var lst=d.createElement('ul');
    if (top){
        top.appendChild(lst_botton);
        lst_botton.textContent="URLリスト";
        lst_botton.href="javascript:void(0)";

        top.appendChild(lst);
        lst.style.display="none";
        lst.style.paddingBottom="1em";
        lst.accessKey="l";

        top.appendChild(rm_botton);
        rm_botton.textContent="最新を非表示";
        rm_botton.href="javascript:void(0)";
        rm_botton.accessKey="r";
    }

    // 最新話まで既読のものを表示/非表示
    var rmutd=function(){
        var num_unread_novel=0;
        var num_all_novel=0;

        localStorage.setItem("rm_status",rm_status);
        if (rm_status==="none"){
            rm_status="block";
            rm_botton.textContent="フィルタ";
            rm_botton.style.backgroundColor="";
        } else{
            rm_status="none";
            rm_botton.textContent="フィルタ";
            rm_botton.style.backgroundColor=color_hover;
        }

        var novels=d.getElementsByClassName("favnovel");
        for(var i=0;i<novels.length; i++){
            var novel=novels[i].getElementsByClassName("no");
            if(novel.length>0){
                num_all_novel += 1;
                var links=novel[0].getElementsByTagName("a");
                if(links.length > 1){
                    var href_0 = links[0].href;
                    var href_1 = links[1].href;
                    if (href_0===href_1){
                        novels[i].style.display=rm_status;
                        novels[i].style.backgroundColor=color_hover;
                        num_unread_novel += 1;
                    } else {
                        var num_0 = Number(href_0.split("/")[4]);
                        var num_1 = Number(href_1.split("/")[4]);
                        if (num_0 === num_1){
                        novels[i].style.display=rm_status;
                        novels[i].style.backgroundColor=color_hover;
                        num_unread_novel += 1;
                        } else if (num_0>num_1){
                        novels[i].style.display=rm_status;
                        novels[i].style.backgroundColor=color_hover2;
                        num_unread_novel += 1;
                        }
                    }
                }
            }
        }
        rm_botton.textContent += " (" + num_unread_novel + "/" + num_all_novel + ")";
    };

    // 小説のURLをリスト化
    var str="";
    var links=d.links;
    for(var i=0; i<links.length; i++){
        var link= String(links[i]).match(url_novel);
        if (link){
            str+=link[1]+" ";
            var li = d.createElement('li');
            lst.appendChild(li);
            li.textContent=link[1];
            li.style.width="81px";
            li.style.float="left";
            li.style.paddingLeft="10px";
            li.style.marginLeft="auto";
            li.style.marginRight="auto";
        }
    }

    var prlst=function(){
        prompt("ncodes", str);
    };

    var shwlst=function(){
        if(lst.style.display==="block"){
            lst_botton.style.backgroundColor="";
            lst.style.display="none";
        }else{
            lst_botton.style.backgroundColor=color_hover;
            lst.style.display="block";
        }
    };

    // 初期化
    rmutd();

    // キーボードショートカット
    if (top){
        rm_botton.addEventListener('click',rmutd);
        lst_botton.addEventListener('click',shwlst);
        lst.addEventListener('click',prlst);
    }

})(document, location);