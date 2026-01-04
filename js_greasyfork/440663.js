// ==UserScript==
// @name         Fix aceship enemy search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  see name
// @author       (You)
// @match        aceship.github.io/AN-EN-Tags/akenemy.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440663/Fix%20aceship%20enemy%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/440663/Fix%20aceship%20enemy%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';
populateEnemy = function(el){
        // console.log(el)
        if(($('#enemyResult').css("display") == "block") &&el=="Browse"){
            // console.log($('#operatorsResult').css("display") == "none" )
            $('#enemyResult').hide();
            return;
        }

        if(el.value != ""||el=="Browse"){
            var result = [];
            $.each(db.enemy,function(_,enemy){
                var languages = [db.enemy, db.enemyEN];
                var found = false;
                var nameTL;
                if(el=="Browse"){
                    found=true;
                }else{
                    var input = el.value.toUpperCase();
                    $.each(languages, function(_,langDB){
                        if (!(enemy.enemyId in langDB))
                            return;
                        var charname = langDB[enemy.enemyId].name.toUpperCase();
                        if(charname.search(input) != -1){
                            nameTL = langDB[enemy.enemyId].name;
                            found = true;
                            return false;
                        }
                    });
                }
                if(found){
                    var id = enemy.enemyId;
                    var name = enemy.name;
                    var sortId = enemy.sortId;
                    result.push({'id':id,'name':name,'sortId':sortId,'nameTL':name == nameTL?null:nameTL});
                }
            });
            // console.log(result)
            let currHtml = []
            result.sort((a,b)=> a.sortId-b.sortId)
            if(result.length > 0){
                $('#enemyResult').empty();
                $('#enemyResult').show();
                for (var i = 0; i < result.length; i++) {
                    let currEnemy = query(db.enemy,"enemyId",result[i].id)
                    let image = `<img style="height:80px;padding:1px" src="./img/enemy/${result[i].id}.png">  `
                    // console.log(currEnemy)

                    if(el=="Browse"){
                        currHtml.push(`<li class="ak-btn ak-enemy" style="display:inline-block;cursor: pointer;width:90px;margin:2px;margin-bottom:2px;padding:1px;border-radius:2px" onclick="selectEnemy('${result[i].id}')">
                        <div class="col-12"style="white-space: nowrap;padding:0px;text-align:center;margin:0px ">
                            <div style="position:absolute;top:-2px;left:2px;white-space: nowrap;padding:3px;padding-top:1px;padding-bottom:0px;margin:0px;background:#222">${currEnemy.enemyIndex}</div>
                            ${image}
                        </div>

                        </li>`)
                    }else{
                        $("#enemyResult").append("<li class=\"ak-shadow-small\" style=\"width:100%;cursor: pointer;margin-bottom:2px; color:#fff;\" onclick=\"selectEnemy('"+result[i].id+"')\">"+image+(result[i].nameTL?result[i].nameTL+" ("+result[i].name+")":result[i].name)+"</li>");
                    }
                }
            } else {
                $('#enemyResult').empty();
                $('#enemyResult').hide();
            }
            $("#enemyResult").append(currHtml.join(""));
        } else {
            $('#enemyResult').empty();
            $('#enemyResult').hide();
        }
    }
})();