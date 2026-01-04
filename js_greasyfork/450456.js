// ==UserScript==
// @name        네이버 해피빈 자동수집
// @namespace   Naver HappyBean Auto
// @match       *://*.naver.com/*
// @noframes
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @version     1.3
// @author      KENAI
// @license     MIT
// @description 네이버 해피빈을 자동으로 수집해줌
// @downloadURL https://update.greasyfork.org/scripts/450456/%EB%84%A4%EC%9D%B4%EB%B2%84%20%ED%95%B4%ED%94%BC%EB%B9%88%20%EC%9E%90%EB%8F%99%EC%88%98%EC%A7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/450456/%EB%84%A4%EC%9D%B4%EB%B2%84%20%ED%95%B4%ED%94%BC%EB%B9%88%20%EC%9E%90%EB%8F%99%EC%88%98%EC%A7%91.meta.js
// ==/UserScript==

main();
GM_registerMenuCommand("init", ()=>{init()});

function main(){
  if(isDateChanged()) init();


	const url = location.href;
	const option = {attributes: true, childList: true, characterData: true, subtree: true};

	//해피빈 페이지
	if(url.includes('https://happybean.naver.com')) {
		console.log("해피빈 페이지");
		const observer = new MutationObserver(() => {
      const a = document.querySelector('.api_ly');
      if (a) {
        observer.disconnect();
        window.close(); //창 닫기
      }
    });

    observer.observe(document, { childList: true, subtree: true });
	}
	//블로그 홈
	else if(url.includes('https://section.blog.naver.com')) {
		console.log("해피빈: 블로그 홈");

    const observer = new MutationObserver(() =>{
      try{
        //console.log(document.documentElement.innerHTML.split(`expansionBannerContent += \"<a data-ssp=\\\"clk\\\" href=\\\"`)[1])
        const link = document.documentElement.innerHTML.split(`expansionBannerContent += \"<a data-ssp=\\\"clk\\\" href=\\\"`)[1].split(`\" s`)[0];
        observer.disconnect();
        const banner = document.getElementById('floatingda_home');
        const name = banner.firstChild.firstChild.firstChild.alt;
        const message = document.createElement("div");
        if(!GM_getValue(name, null)){
					console.log("새로운 배너 > 클릭");
          GM_setValue(name, "true");
          message.innerText = "해피빈 클릭됨"
          const tab = GM_openInTab(link, {active: false});
				} else{
					console.log("클릭한 배너 > 닫기")
          message.textContent = "클릭한 해피빈"
				}
        //banner.style.display = 'none'; //배너 숨기기
        banner.before(message);
      } catch(e) {console.log(e);}
		});
		observer.observe(document, option);
	}
	//블로그, 카페 글쓰기
	else if(url.includes('https://blog.naver.com/') || url.includes('https://cafe.naver.com/')){
		console.log("해피빈: 블로그, 카페");

		const observers = [];

		function finder(target){ //재귀로 iframe 포함해서 전부 찾기
			const observer = new MutationObserver(mutatinos =>{
				const banner = target.getElementById('floatingda_content');
        //console.log(asd(banner))
        //console.log(banner)
        //console.log(document.getElementById('floatingda_content'))
				if(!!(banner?.firstChild)){
          console.log("배너 > 클릭")
          const link = document.documentElement.innerHTML.split("clickAd")[2].split("getCookie")[0].split("\"")[1];

          //banner.style.display = 'none';
          const message = document.createElement("div");
          message.textContent = "해피빈 클릭함";
          banner.prepend(message);

          const tab = GM_openInTab(link, {active: false});
					observers.forEach(o => o.disconnect());
				}
			});
			observer.observe(target, option);
			observers.push(observer);

			if (!!target.getElementsByTagName('iframe')){
				Array.from(target.getElementsByTagName('iframe')).forEach(fr => {
          finder(fr.contentDocument);
        })
			}
		}

		finder(document);
	}
  //모바일 블로그
  else if(url.includes('https://m.blog.naver.com/') && url.includes('afterWebWrite=true')){
    console.log("해피빈: 모바일 블로그");

    const a = target.getElementsByClass('HappyBean');


  }

}




function isDateChanged(){
	const storedDate = new Date(GM_getValue("DateCheck", "").replaceAll(`"`,'')).toDateString()
	return storedDate !== new Date().toDateString();
}

function init(){
  console.log("해피빈 정보 초기화");
  GM_listValues().forEach(key => GM_deleteValue(key));
  GM_setValue("DateCheck", JSON.stringify(new Date()));
}

function asd(k){ return JSON.parse(JSON.stringify(k));}