// ==UserScript==
// @name         zorome
// @namespace    https://www.2chan.net/
// @version      1.11
// @description  ふたクロ使用時連番の投稿Noを強調表示する
// @author       toniste
// @match        http://*.2chan.net/b/res/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373696/zorome.user.js
// @updateURL https://update.greasyfork.org/scripts/373696/zorome.meta.js
// ==/UserScript==

function renban(){
    $(".no_quote").each(function(){
        let idArray = $(this).html().slice(3).split("");
        let id = "";
        let counter = 0;
        for(let i = 1; i < idArray.length; i++){
            if(idArray[idArray.length - i] == idArray[idArray.length - i - 1]){
                counter = i;
            } else if(counter == 0){
                break;
            } else {
                for(let j = 0; j < idArray.length - counter - 1; j++){
                    id = id + idArray[j];
                }
                id = "No." + id + "<font color='red'>"
                for(let j = idArray.length - counter - 1; j < idArray.length; j++){
                    id = id + idArray[j];
                }
                id = id + "</font>";
                $(this).html(id);
                break;
            }
        }
    });
}

(function() {
    renban();
})();


let refleshObserver = new MutationObserver(function(mutationRecords, _observer){
    renban();
});
refleshObserver.observe($('body').get(0), {childList:true, subtree:true});