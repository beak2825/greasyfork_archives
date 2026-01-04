// ==UserScript==
// @name        마나토끼 북마크
// @namespace   Violentmonkey Scripts
// @match       *://manatoki*.net/*
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.0
// @author      KENAI
// @license     MIT
// @description 2023. 1. 27. 오후 8:52:45
// @downloadURL https://update.greasyfork.org/scripts/458963/%EB%A7%88%EB%82%98%ED%86%A0%EB%81%BC%20%EB%B6%81%EB%A7%88%ED%81%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/458963/%EB%A7%88%EB%82%98%ED%86%A0%EB%81%BC%20%EB%B6%81%EB%A7%88%ED%81%AC.meta.js
// ==/UserScript==


// 버튼 생성ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
if(document.getElementsByClassName('toon-nav').length) { //만화 페이지에서만
  GM_registerMenuCommand("북마크 등록", ()=>{regBookMark()});
}
GM_registerMenuCommand("북마크 보기", ()=>{listBookMark()});
GM_registerMenuCommand("북마크 삭제", ()=>{delBookMark()});


//북마크 목록ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
//{ 만화코드 / 만화제목 / 페이지코드 / 화수 }
function BookMark(manaCode, manaTitle, pageCode, episode, recent){
  this.manaCode = manaCode;
  this.manaTitle = manaTitle;
  this.pageCode = pageCode;
  this.episode = episode;
  this.recent = recent;
}

var bookMarks = JSON.parse(GM_getValue('bookMarks', null))??[];
console.log(bookMarks);


//최신화 체크ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
//dateCheck();
//update();

async function dateCheck(){
	const bDate = new Date(GM_getValue("dateCheck", "").split("\"")[1]);
	const tDate = new Date();
	if(!compareDate(bDate, tDate)) {
    await updateRecent();
    GM_setValue("dateCheck", JSON.stringify(new Date()));
  }
}
function compareDate(a,b){
	return a.getFullYear() == b.getFullYear() && a.getMonth() == b.getMonth() && a.getDate() == b.getDate();
}
function updateRecent(){
  console.log('update need')
  bookMarks.forEach(bm => {
    check(bm.manaCode).then(xml => {
      bm.recent = xml.getElementsByClassName('wr-subject')[1].children[0].childNodes[2].nodeValue.split(bm.manaTitle)[1].trim();
    })
  })
}

function check(manaCode){
  return new Promise(function(resolve, reject){
      GM_xmlhttpRequest({
        url: location.href.split(`.net`)[0] + '.net/comic/' + manaCode,
        method: "GET",
        onload: function(response){
          clearTimeout(timeout);
          resolve(response.responseXML)
        }
      });

      const timeout = setTimeout(()=>{
        reject("실패");
      }, 5000);
		});
}


//북마크 등록ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
async function regBookMark(){
  //{ 만화코드 / 만화제목 / 페이지코드 / 화수 } 가져옴
  const manaCode = document.getElementsByClassName('toon-nav')[0].lastElementChild.href.split("/").pop().split('?')[0];
  const pageCode = location.href.split("/").pop().split('?')[0];
  var manaTitle = "";
  var episode = "";
  var recent = "";

  const bm = bookMarks.filter(bm => bm.manaCode == manaCode)[0];
  console.log(bm);
  if(bm) {
    manaTitle = bm.manaTitle;
    recent = bm.recent;
  } else {
    await check(manaCode).then(xml =>{
      manaTitle = xml.getElementsByClassName('view-content')[1].innerText.trim();
      recent = xml.getElementsByClassName('wr-subject')[1].children[0].childNodes[2].nodeValue.split(manaTitle)[1].trim();
    })
  }
  episode = document.getElementsByClassName('page-desc')[0].innerText.split(manaTitle)[1].trim();

  //console.log(manaCode, manaTitle, pageCode, episode);

  //북마크 목록에서 만화제목 있는지 확인해서 삭제
  bookMarks = bookMarks.filter(bm => bm.manaCode != manaCode)

  //목록 맨 앞에 새로 추가
  bookMarks.unshift(new BookMark(manaCode, manaTitle, pageCode, episode, recent));
  GM_setValue('bookMarks', JSON.stringify(bookMarks));
  console.log(bookMarks);
}


//북마크 보기 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
function listBookMark(){
  //순번 / 만화제목 / 화수 / 최신화수
  var msg = "북마크 목록\n\n";
  msg = msg.concat(
    bookMarks.map((bm, index) => {
      return index+1 + ' | ' + bm.manaTitle + ' | ' + bm.episode //+ ' | ' + bm.recent;
    }).join('\n')
  )

  //순번 입력 받아서 이동
  msg += "\n\n이동할 만화 번호를 입력해주세요."
  const num = Number(window.prompt(msg, ''))-1;
  if(num<0 || num> bookMarks.length-1) return
  console.log(bookMarks[num].manaTitle + ' '+ bookMarks[num].episode + '로 이동합니다.');
  location.href = location.href.split(`.net`)[0] + '.net/comic/' + bookMarks[num].pageCode
}


//북마크 삭제 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
function delBookMark(){
  //순번 / 만화제목 / 화수
  var msg = "북마크 목록\n\n"
  msg = msg.concat(
    bookMarks.map((bm, index) => {
      return index+1 + ' | ' + bm.manaTitle + ' | ' + bm.episode;
    }).join('\n')
  )

  //순번 입력 받아서 목록에서 삭제
  msg += "\n\n삭제할 만화 번호를 입력해주세요."
  const num = Number(window.prompt(msg, ''))-1;
  if(num<0 || num> bookMarks.length-1) return
  bookMarks.splice(num, 1);
  GM_setValue('bookMarks', JSON.stringify(bookMarks));
  console.log(bookMarks);
}
