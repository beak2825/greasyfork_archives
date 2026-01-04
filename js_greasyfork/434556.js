// ==UserScript==
// @name         SUUMOからレオパレス物件を除外(Exclude Leopalace from SUUMO)
// @namespace    ExcludeLeopalaceFromSUUMO
// @version      1.4.1
// @description  SUUMOの賃貸物件検索から物件名に"レオパレス"が含まれる物件を除外します．
// @author       HalsSC
// @match        https://suumo.jp/jj/chintai/ichiran/FR301FC001/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434556/SUUMO%E3%81%8B%E3%82%89%E3%83%AC%E3%82%AA%E3%83%91%E3%83%AC%E3%82%B9%E7%89%A9%E4%BB%B6%E3%82%92%E9%99%A4%E5%A4%96%28Exclude%20Leopalace%20from%20SUUMO%29.user.js
// @updateURL https://update.greasyfork.org/scripts/434556/SUUMO%E3%81%8B%E3%82%89%E3%83%AC%E3%82%AA%E3%83%91%E3%83%AC%E3%82%B9%E7%89%A9%E4%BB%B6%E3%82%92%E9%99%A4%E5%A4%96%28Exclude%20Leopalace%20from%20SUUMO%29.meta.js
// ==/UserScript==
    
(function (){
    const titles=$(".cassetteitem_content-title");
    const exName=$("レオパレス").val();
    let cnt=0;
    for(let i=0;i<titles.length;i++){
        try{
			let item=titles[i].closest(".cassetteitem");
            if(titles[i].textContent.includes(exName) && !item.hidden){
                item.hidden=true;
                cnt++;
            }
        }catch(TypeError){
            {}
        }
    }
    console.log(cnt+"件の"+exName+"物件を除外");
})();