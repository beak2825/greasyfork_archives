// ==UserScript==
// @name         SUUMOの賃貸物件検索に除外ワードを設定(SUUMO Chintai NG)
// @namespace    SUUMOChintaiNG
// @version      1.0.1
// @description  SUUMOの賃貸物件検索に除外ワードを設定し，物件名にそのワードが含まれる物件を除外/表示します．
// @author       HalsSC
// @match        https://suumo.jp/jj/chintai/ichiran/FR301FC001/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434625/SUUMO%E3%81%AE%E8%B3%83%E8%B2%B8%E7%89%A9%E4%BB%B6%E6%A4%9C%E7%B4%A2%E3%81%AB%E9%99%A4%E5%A4%96%E3%83%AF%E3%83%BC%E3%83%89%E3%82%92%E8%A8%AD%E5%AE%9A%28SUUMO%20Chintai%20NG%29.user.js
// @updateURL https://update.greasyfork.org/scripts/434625/SUUMO%E3%81%AE%E8%B3%83%E8%B2%B8%E7%89%A9%E4%BB%B6%E6%A4%9C%E7%B4%A2%E3%81%AB%E9%99%A4%E5%A4%96%E3%83%AF%E3%83%BC%E3%83%89%E3%82%92%E8%A8%AD%E5%AE%9A%28SUUMO%20Chintai%20NG%29.meta.js
// ==/UserScript==
    
(function (){
    $(".pagecaption").append(`<br>Exclude:<input value='レオパレス' id='excludeName' style="width:100pt">`);
    $(".pagecaption").append(`<input type='submit' value='除外' onClick='(function (){
        const titles=$(".cassetteitem_content-title");
        const exName=$("#excludeName").val();
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
        console.log(cnt+"件の"+exName+"物件を除外");})();'
    >`);
    $(".pagecaption").append(`<input type='submit' value='リセット' onClick='(function (){
            const titles=$(".cassetteitem_content-title");
            for(let i=0;i<titles.length;i++){
                try{
                    titles[i].closest(".cassetteitem").hidden=false;
                }catch(TypeError){
                    {}
                }
            }
			console.log("表示をリセット");
		})();'
    >`);
})();