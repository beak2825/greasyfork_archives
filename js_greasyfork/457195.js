// ==UserScript==
// @name        Background New Article Checker
// @namespace   Scripts
// @match       https://m.cafe.naver.com/ca-fe/web/cafes/27549420/menus/329
// @match       https://m.cafe.naver.com/ca-fe/web/cafes/27549420/menus/89
// @grant       none
// @version     1.5
// @author      -
// @description 2022. 12. 27. 오후 1:30:11
// @downloadURL https://update.greasyfork.org/scripts/457195/Background%20New%20Article%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/457195/Background%20New%20Article%20Checker.meta.js
// ==/UserScript==


let isIng = false;
let poolingTime = 300;

function Checker(){
  document.querySelector('#app > div > div > header > div > div.gnb_l').innerHTML += '<span id="Checker" style="cursor:pointer">Checker</span>';
  document.querySelector('#app > div > div > header > div > div.gnb_l').style.maxWidth = '200px';


  //이벤트 등록
  document.querySelector("#Checker").addEventListener('click', (e) => {
    let checkerEle = e.currentTarget;

    if(isIng){
      checkerEle.style.backgroundColor = "white";
    }else{
      checkerEle.style.backgroundColor = "red";
      pooling();
    }

    isIng = !isIng;


  })

}

function printTime(){
  let today = new Date();
  console.log(`${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}.${today.getMilliseconds()}`);
}

function pooling(){

  let menuId = (() =>{
    let locationInfos = document.location.href.split("/");
    return parseInt(locationInfos[locationInfos.length - 1], 10);
  })();

  let firstAticleId;
  let listUrl = `https://apis.naver.com/cafe-web/cafe2/ArticleList.json?search.clubid=27549420&search.queryType=lastArticle&search.menuid=${menuId}&search.page=1&search.perPage=10&ad=true&uuid=ec89107c-786e-4dcc-82fb-1e28c2e93570&adUnit=MW_CAFE_ARTICLE_LIST_RS`;


  function newAricleCheck() {

    fetch(listUrl, {method : "GET"})
    .then((response) => response.json())
    .then((data) => {

              if(!isIng) return
              if (data.message.status == "200") {
                let item = data.message.result.articleList[0].item;
                let subject = item.subject;
                let cafeId  = item.cafeId;
                let articleId = item.articleId;

                console.log(firstAticleId, articleId, isIng);

                if(!firstAticleId)  {

                  firstAticleId = articleId;
                  newAricleCheck();

                }else if(firstAticleId !== articleId){
                  printTime();
                  let hrefUrl = `https://m.cafe.naver.com/ca-fe/web/cafes/${cafeId}/articles/${articleId}?fromList=true&menuId=${menuId}`
                  window.location.href = hrefUrl;

                }else{
                   setTimeout(newAricleCheck, poolingTime);
                }
              }
    });

  }

  newAricleCheck();

}


setTimeout(Checker, 2000)