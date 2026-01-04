// ==UserScript==
// @name         いいね保存マシン
// @namespace    http://tampermonkey.net/
// @version      2024-01-20
// @description  保存
// @author       You
// @license MIT
// @match        https://typing-tube.net/my/movies/liked*
// @match      https://typing-tube.net/user/6963/80per_movies*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typing-tube.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503172/%E3%81%84%E3%81%84%E3%81%AD%E4%BF%9D%E5%AD%98%E3%83%9E%E3%82%B7%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/503172/%E3%81%84%E3%81%84%E3%81%AD%E4%BF%9D%E5%AD%98%E3%83%9E%E3%82%B7%E3%83%B3.meta.js
// ==/UserScript==

function JsonDownload(){
    /*
    const item = JSON.stringify(localStorage.getItem('iineList'));
    const blob = new Blob([item], {
        type: "application\/json"
     });
    */
    let item = localStorage.getItem('iineList');
    const blob = new Blob([item], {
              type: "text/plan"
     });
     const a = document.createElement('a');
     a.href = URL.createObjectURL(blob);
     a.download = 'TypingTube.json';
     a.click();
}

async function main(){
    async function page(){
        const nextBtn = document.querySelector('li.page-item.pagination-next > a[rel="next"]');
        if(nextBtn){
        nextBtn.click();
        }else{
            JsonDownload();
        }
    }
    async function itemGetter(){
        let arr = [];
        const divs = document.querySelectorAll('.col-md-3.col-sm-6.admin_movie_box.mt-2');
        divs.forEach((d)=>{
            const imgInfo = d.querySelector('.image-info.pb-1');
            const imgInfoA = imgInfo.querySelector('a');
            const title = imgInfoA.textContent;
            const url = imgInfoA.href;
            //タイトル、URL取得
            const Data = imgInfo.querySelectorAll('.mt-2.ml-2.row > span');
            let [star,level,len,avg] = Array.from(Data).map(e => e.textContent);
            [len,star] = [len,star].map(s => s.replace(/[ \n]/g, ''));
            //スペース・改行削除
            //レベル、謎のレベル、長さ、平均取得
            const img = d.querySelector('img').src;
            arr.push({
                "TITLE": title,
                "URL": url,
                "STAR": star,
                "LEVEL": level,
                "LEN": len,
                "AVG": avg,
                "IMG": img
            });
        });
        return arr;
    }
    let D = await itemGetter();
    if(!localStorage.getItem('iineList')){
        localStorage.setItem('iineList',JSON.stringify(D));
    }else{
        const item = JSON.parse(localStorage.getItem('iineList'));
        const arrItem = item.concat(D);
        localStorage.setItem('iineList',JSON.stringify(arrItem));
    }
    await page();

}
setTimeout(main,5000);
