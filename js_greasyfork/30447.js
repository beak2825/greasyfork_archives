// ==UserScript==
// @name         【アラタ】ゴリラブロッカーNEO
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *cl2.chocolop.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30447/%E3%80%90%E3%82%A2%E3%83%A9%E3%82%BF%E3%80%91%E3%82%B4%E3%83%AA%E3%83%A9%E3%83%96%E3%83%AD%E3%83%83%E3%82%AB%E3%83%BCNEO.user.js
// @updateURL https://update.greasyfork.org/scripts/30447/%E3%80%90%E3%82%A2%E3%83%A9%E3%82%BF%E3%80%91%E3%82%B4%E3%83%AA%E3%83%A9%E3%83%96%E3%83%AD%E3%83%83%E3%82%AB%E3%83%BCNEO.meta.js
// ==/UserScript==

(function() {

//『CL200XXXX』をブロックしたいＩＤに書き換えてください。足りない場合は追加できます。
var ded = new Array('CL200XXXX','CL200XXXX','CL200XXXX');

//ゴリラを正規表現化
var href = window.location.href;
var ended = '';
var ended2 = '';
for(var de1=0;de1<ded.length;de1++){
    if(de1 === 0){
        ended += 'chara_code='+ded[de1];
        ended2 += ded[de1];
    }else{
        ended += '|chara_code='+ded[de1];
        ended2 += '|'+ded[de1];

    }
}
var gorira = RegExp(ended,'g');//(chara_code=CL2XXXXXX)タイプの正規表現
var gorira2 = RegExp(ended2,'g');//(CL2XXXXXX)タイプの正規表現

//チームページのトップから消し去る
if(href.match(/team.php/)){
    var newwriter = document.getElementsByClassName('responsive_table')[0].getElementsByTagName("td");
    for(var nw1=0;nw1<newwriter.length;nw1++){
        if(newwriter[nw1].innerHTML.match(gorira)){
            newwriter[nw1].style.display = 'none';
            newwriter[nw1].parentNode.innerHTML += '<td>(☝՞ਊ ՞)☝ ウホホウッホゴリラ！</td>';
        }
    }
}

//一言交流掲示板と通常掲示板内から消し去る
if(href.match(/bbs.php|top.php|quest.php|atrie_top.php/)){
    var comment_wrapper = document.getElementsByClassName("comment_wrapper");
    for(var cw1=0;cw1<comment_wrapper.length;cw1++){
        if(comment_wrapper[cw1].innerHTML.match(gorira)){
            comment_wrapper[cw1].style.display = 'none';
            comment_wrapper[cw1].previousSibling.previousSibling.style.display = 'none';
        }
    }

}

//依頼相談掲示板から消し去る
if(href.match(/quest.php/)){
    var list_box3 = document.getElementsByClassName("list-box3");
    for(var li3=0;li3<list_box3.length;li3++){
        if(list_box3[li3].innerHTML.match(gorira)){
            if(list_box3[li3].id.match(/commnet_/)){
                list_box3[li3].style.display = 'none';
            }
        }
    }

}


})();