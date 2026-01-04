// ==UserScript==
// @name         MTK005
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  皆解会005の順位表を表示します
// @author       michirakara
// @match        https://yukicoder.me/problems/no/5007*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464713/MTK005.user.js
// @updateURL https://update.greasyfork.org/scripts/464713/MTK005.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var check_mtk;
    var team1=["Michirakara","eoeo"];
    var team2=["yas_yasyu","Edomonndo365"];
    var team3=["moharan627","dna4_","lud404Qe8lItbFm"];
    var team4=["motoshira","nephrologist","ococonomy1","hotpepsi"];
    var team5=["37kt","prussian_coder","brthyyjp"];
    var team6=["komori3","ssaattoo","tabae326","highjump"];

    window.onload = function(){
        if(location.href=="https://yukicoder.me/problems/no/5007/score?all=on" || location.href=="https://yukicoder.me/problems/no/5007/score?page=2&all=1" || location.href=="https://yukicoder.me/problems/no/5007/score?page=1&all=1"){
            document.querySelector("div.left a.active").className=""
            document.querySelector("div.left a[href=\"/problems/no/5007/score\"]").insertAdjacentHTML("afterend","<a href=\"https://yukicoder.me/problems/no/5007/score?all=on\" class=\"active\">延長戦順位表</a>");

            check_mtk=document.createElement("input");
            check_mtk.type="checkbox";
            check_mtk.id="mtk_ranking";
            check_mtk.addEventListener("change",valueChange);
            var element=document.querySelector("div.box div.body div.line")
            element.insertBefore(check_mtk,element.firstChild);
            var label_check=document.createElement("label");
            label_check.for="mtk_ranking";
            label_check.textContent="皆解会005の順位表を表示する";
            element=document.querySelector("div.box div.body div.line input");
            element.insertAdjacentElement("afterend",label_check);
        }else{
            document.querySelector("div.left a[href=\"/problems/no/5007/score\"]").insertAdjacentHTML("afterend","<a href=\"https://yukicoder.me/problems/no/5007/score?all=on\">延長戦順位表</a>");
        }
    };

    function valueChange(){
        if(check_mtk.checked){
            var lis=document.querySelector("table.table tbody").querySelectorAll("tr");
            for(let i=0;i<lis.length;i++){
                var elem=lis[i].querySelector("td.table_username a")
                var user_name=elem.textContent;
                if(team1.includes(user_name)){
                    elem.textContent=user_name+"(クリエイティブフォース)";
                }else if(team2.includes(user_name)){
                    elem.textContent=user_name+"(writer解を超え隊)";
                }else if(team3.includes(user_name)){
                    elem.textContent=user_name+"(エリマキシュリンプキャッツ)";
                }else if(team4.includes(user_name)){
                    elem.textContent=user_name+"(３代目バベルクライマーズ)";
                }else if(team5.includes(user_name)){
                    elem.textContent=user_name+"(山魚ブルー)";
                }else if(team6.includes(user_name)){
                    elem.textContent=user_name+"(星のローミィ新作転売ヤー大冒険)";
                }else if(user_name=="ainem-m"){
                    elem.textContent=user_name+"✝運営✝"
                }else{
                    lis[i].remove();
                }
            }
        }else{
            window.location.reload();
        }
    }
})();