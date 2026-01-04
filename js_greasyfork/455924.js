// ==UserScript==
// @name        네이버 관심웹툰 강조
// @namespace   Naver webtoon plus
// @match       https://comic.naver.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @version     1.5
// @author      KENAI
// @license     Beerware
// @description 관심웹툰을 강조해서 상단에 보여줌
// @downloadURL https://update.greasyfork.org/scripts/455924/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EA%B4%80%EC%8B%AC%EC%9B%B9%ED%88%B0%20%EA%B0%95%EC%A1%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/455924/%EB%84%A4%EC%9D%B4%EB%B2%84%20%EA%B4%80%EC%8B%AC%EC%9B%B9%ED%88%B0%20%EA%B0%95%EC%A1%B0.meta.js
// ==/UserScript==


//관심웹툰 추가할때 바로 목록에 추가?
//로그인 체크?
//const mail = document.getElementsByClassName('gnb_mail_address');


GM_addStyle(`
  #wrap {min-width: 760px}
  .BrandBar__gnb_wrap--Nh2jt {width: -webkit-fill-available; max-width: 1190px}
  .GlobalNavigationBar__lnb_wrap--gyzrj {width: -webkit-fill-available; max-width: 1190px}
  .SubNavigationBar__snb_wrap--A5gfM {width: -webkit-fill-available; max-width: 1190px}
  .viewer_toolbar {width: -webkit-fill-available; max-width: 1190px}
  #comic_view_area {width: -webkit-fill-available; min-width: 0px}
  #sectionContWide {width: -webkit-fill-available; min-width: 0px}
`);


const buttons = document.body.appendChild(document.createElement("div"));
css(buttons, {position: 'fixed', bottom: '30px', left: '30px', zIndex: 30});

function createButton(here, id, text, onClick){
  const button = here.appendChild(document.createElement("div"));
  button.id = id;
  button.innerText = text;
  css(button, {display: 'flex', background: '#00dc64', justifyContent: 'center', alignItems: 'center', width: '60px', height: '60px', opacity: 0.5,
                 cursor:'pointer', color:'#fff', margin:'5px 0', borderRadius: '30%', fontSize: '14px', textAlign: 'center'});
  button.addEventListener("click", onClick);
  button.addEventListener('mouseover', () => { button.style.opacity = 1; });
  button.addEventListener('mouseout', () => { button.style.opacity = 0.5; });
  return button;
}

function createTooltip(here, text){
  const tooltip = here.appendChild(document.createElement('div'));
  tooltip.innerText = text;
  css(tooltip, {position: 'fixed', backgroundColor: 'black', color: 'white', padding: '5px', display: 'none'});
  here.addEventListener('mousemove', (event) => {
    tooltip.style.display = 'block';
    tooltip.style.left = event.clientX+20+'px';
    tooltip.style.top = event.clientY+'px';
  });
  here.addEventListener('mouseout', () => {
    tooltip.style.display = 'none';
  });
}

const btn = createButton(buttons, "btn", "관심웹툰\n불러오기", update);
const tooltip = createTooltip(btn, `관심웹툰 목록을 다시 가져와 적용합니다.\n(하루에 한번만 자동으로 가져옵니다.)`)

let favoriteList = [];

const option = {childList: true, subtree: true};
const observer = new MutationObserver(apply)
observer.observe(document, option);

if(isDateChanged()){
  update();
} else {
  console.log("저장된 정보 사용");
  favoriteList = GM_getValue("FavoriteList", "")??[];
  apply();
}

function update(){
  return new Promise(function(resolve, reject){
    getFavoriteList().then(list => {
      Toast.show("정보 업데이트 성공")
      GM_setValue("FavoriteList", favoriteList = list);
      GM_setValue("DateCheck", JSON.stringify(new Date()));
      apply();
    }, fail =>{
      Toast.show("정보 업데이트 실패: "+fail)
    });
  });
}

function apply(){
  observer.disconnect();

  document.querySelectorAll('.WeekdayMainView__daily_list--R52q0').forEach(change); //웹툰홈
  change(document.getElementsByClassName('ContentList__content_list--q5KXY')[0]); //요일별 웹툰
  change(document.getElementsByClassName('BestChallengeView__challenge_list--sUqhh')[0]); //베스트도전
  change(document.getElementsByClassName('ChallengeView__challenge_list--vEhFq')[0]); //도전

  observer.observe(document, option);
}

function change(toon_list){
  try{
    Array.from(toon_list.children).reverse().forEach(t=>{
      const id = t.innerHTML.split(`titleId=`)[1].split(`"`)[0];

      const fav = favoriteList.includes(id);
      const icon = t.firstChild?.textContent == '관심';

      if(fav && !icon) {
        toon_list.prepend(t);
        const sticker = document.createElement('STICKER')
        t.insertBefore(sticker, t.firstChild);
        css(sticker, {display: 'flex', position: 'absolute', backgroundColor: '#00dc64', color: 'white', padding: '5px', zIndex: 30, transform: 'translate(-20%, -20%)', borderRadius: '5px'})
        sticker.textContent = "관심";
      } else if (!fav && icon) {
        t.firstChild.remove();
      }

    })
  } catch(e){

  }
}


function getFavoriteList(){
  return new Promise(function(resolve, reject){
      GM_xmlhttpRequest({
        url: `https://m.comic.naver.com/mypage/favorite`,
        method: "GET",
        onload: function(response){
          clearTimeout(timeout);
          try{
            const list = (response.responseText.match(/titleId":(\d+)/g)??[]).map(t => t.match(/\d+/)[0]);
            resolve(list);
          } catch(e){
            reject(e);
          }
        }
      });
      const timeout = setTimeout(()=>{
        reject("연결 시간 초과");
      }, 5000);
		});
}

//ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

function css(element, style){ for(prop in style) element.style[prop] = style[prop] }

function isDateChanged(){
	const storedDate = new Date(GM_getValue("DateCheck", "").replaceAll(`"`,'')).toDateString()
	return storedDate !== new Date().toDateString();
}

//토스트 메시지ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
class Toast{
  static show(...messages){
    const toastBox = document.body.appendChild(document.createElement("div"));
    toastBox.appendChild(document.createElement('div'));
    css(toastBox, {opacity : 0, display: 'none', position: 'fixed',bottom: '30%', justifyContent: 'center', width: '100%', zIndex:99999999});
    css(toastBox.firstChild, {background : '#595959', color : 'white',  padding : '1rem 3.5rem 1rem 3.5rem', borderRadius:'1rem', fontSize: '200%', textAlign: 'center'});

    const message = messages.join(`\n`)
    console.log('Toast: ' + message);

    toastBox.firstChild.innerText = message;
    toastBox.style.display = "flex";

    let opacity = 0;
    window.requestAnimationFrame(fadeIn);
    function fadeIn(){
      opacity += 0.03;
      toastBox.style.opacity = opacity;
      if(opacity<1.5) window.requestAnimationFrame(fadeIn);
      else window.requestAnimationFrame(fadeOut);
    }
    function fadeOut(){
      opacity -= 0.03;
      toastBox.style.opacity = opacity;
      if(opacity>0) window.requestAnimationFrame(fadeOut);
      else {
        toastBox.remove();
      }
    }
  }
}






