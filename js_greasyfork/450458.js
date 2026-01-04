// ==UserScript==
// @name        포블로그 도우미
// @namespace   Violentmonkey Scripts
// @match       *://4blog.net/*
// @noframes
// @grant       GM_addValueChangeListener
// @grant       GM_removeValueChangeListener
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @version     1.2
// @author      KENAI
// @license     MIT
// @description 포블로그
// @downloadURL https://update.greasyfork.org/scripts/450458/%ED%8F%AC%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%8F%84%EC%9A%B0%EB%AF%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/450458/%ED%8F%AC%EB%B8%94%EB%A1%9C%EA%B7%B8%20%EB%8F%84%EC%9A%B0%EB%AF%B8.meta.js
// ==/UserScript==

//(()=>{


function dataclean(){
  const data = GM_getValue('data', new Data() );
  for(const e in data){
    if(e != e.trim()) delete data[e]
  }
  GM_setValue('data', data)
}
//dataclean()


//키워드-----------------------------------------------------------------
const keyword = GM_getValue('keyword','')
const nkeyword = GM_getValue('nkeyword', '')
const apply_keyword = GM_getValue('apply_keyword', false);

function keywordCheck(txt){
  return !apply_keyword || keyword?.split('/').every(k => txt.includes(k) ) && !nkeyword?.split('/').some(k => k.trim() != '' && txt.includes(k) );
}

GM_registerMenuCommand("키워드 설정", ()=>{setKeyword()});
GM_registerMenuCommand("키워드: " + apply_keyword, ()=>{toggleKeyword()});

function setKeyword(){
  GM_setValue('keyword', window.prompt('포함할 단어(/로구분)', keyword)??keyword);
  GM_setValue('nkeyword', window.prompt('제외할 단어(/로구분)', nkeyword)??nkeyword);
  window.location.reload();
}
function toggleKeyword(){
  GM_setValue('apply_keyword', !apply_keyword);
  window.location.reload();
}


//스테이터스 설정----------------------------------------------------------------------
function Status(){
  this.box = document.createElement("div");
  this.box.style.textAlign = 'center';
  this.box.style.padding = '3px';
  this.box.style.margin = '3px';
  this.box.style.border = '2px'
  this.box.style.borderRadius = '20px';
  
  this.set = function(status, count){
     switch (status) { //캠페인 상태
      case "신청함":
        this.box.innerText = "신청함";
        this.box.style.color = 'rgb(0,0,0)';
        this.box.style.backgroundColor = 'rgba(255, 200, 200, 0.9)';
        break;
      case "신청 안함":
        this.box.innerText = "신청 안함";
        this.box.style.color = 'rgb(255,255,255)';
        this.box.style.backgroundColor = 'rgba(255, 50, 50, 0.9)';
        break;
      case "선정자 체크됨":
        this.box.innerText = "선정자 체크됨: " + count;
        this.box.style.color = 'rgb(0,0,0)';
        this.box.style.backgroundColor = 'rgba(200, 200, 200, 0.9)';
        break;
      case "선정자 체크 필요":
        this.box.innerText = "선정자 체크 필요";
        this.box.style.color = 'rgb(255,255,255)';
        this.box.style.backgroundColor = 'rgba(255, 50, 50, 0.9)';
        break;
      default:
        this.box.innerText = "-";
        this.box.style.color = 'rgb(255,255,255)';
        this.box.style.backgroundColor = 'rgba(255, 50, 50, 0.9)';
    }
  }
}

/*
const box = document.createElement("div");
  box.style.textAlign = 'center';
  box.style.padding = '3px';
  box.style.margin = '3px';
  box.style.border = '2px'
  box.style.borderRadius = '20px';
*/


//주소별 동작---------------------------------------------------------------------
const url = location.href;
console.log(url);

//리스트
if(url.includes("4blog.net/list") || url.includes("4blog.net/user/campaigns/")){
  console.log("list")
  
  const btn_more = document.getElementById('showMoreBtn');
  const data = GM_getValue('data', new Data() );
  
  const statusList = {};
  const lists = Array.from(document.getElementsByClassName('nounderline')); // 캠페인 목록
  let dest = (lists[0].firstElementChild.firstElementChild.tagName=="IMG") // 붙일 위치 확인
  
  const target = document.getElementById('campaignContainer');
  const observer = new MutationObserver( mutations => {
    apply(Array.from(mutations[0].addedNodes));
    btn_more?.click();
  });
  if(!!target) observer.observe(target, { childList: true });
  
  apply(lists);
  dest = false;
  setTimeout(()=>{ btn_more?.click() }, 100)
  
  function apply(lists){
    lists.forEach(e => {
      if(!keywordCheck(e.innerText) ) { e.style.display = 'none'; return; } //키워드 체크

      let name = (dest?e.lastElementChild.firstElementChild.innerText:e.firstElementChild.lastElementChild.firstElementChild.innerText);
      name = name.split(/\s\d*차/)[0].trim().replace('  ', ' ');
      const number = e.href.split("campaign/")[1].split("/")[0];
      
      if(data[name]?.[number]?.status == "신청함" && new Date(data[name]?.[number]?.end) < new Date() ){
        console.log(`시간지난거`);
        data[name][number].status == "선정자 체크 필요"
      }
      
      const s = new Status();
      (dest?e.firstElementChild:e.firstElementChild.firstElementChild).append(s.box);
      s.set(data[name]?.[number]?.status, data[name]?.[number]?.comments?.length);
      
      statusList[number] = s;
      
    });
  }
  
  GM_addValueChangeListener('change', (n,ov,nv,rm) => statusList[nv[0]]?.set(nv[1], nv[2]) )
}

//페이지 동시에 열 때 공유데이터 문제 해결해야함.
//캠페인
else if(url.includes("4blog.net/campaign/")){
  console.log("campaign");

  let data = GM_getValue('data', new Data() );
  const name = document.getElementsByClassName('campaignInfo-title')[0].innerText.split(/\s\d*차/)[0].trim().replace('  ', ' ');
  const number = cid.value;

  //저장된 선정자 댓글 표시
  const ct = document.createElement("div");
  for(const campaign in data[name]){
    for(const cmt of data[name][campaign].comments){
      const t = document.createElement("div");
      t.innerText = cmt[0] + " : " + cmt[1];
      ct.appendChild(t);
    }
  }
  document.getElementById("comments").before(ct);
  
  setTimeout(()=>{
    const btn_std = document.getElementById('selected');
    const btn_req = document.getElementById('requests');
    const btn_more = document.getElementById('showMoreBtn');
    
    // 선정자 활성화
    if(btn_std.className == "active"){
      const s = new Status();
      let stat = '';
      btn_std.append(s.box);
      
      const cmts = document.getElementsByClassName('media-body borderd');
      const std_names = Array.from(cmts).map(i => i.firstChild.innerText);
      
      let checked = (std_names.length == data[name]?.[number]?.comments.length);
      if(!checked) {
        stat = "선정자 체크 필요"
        console.log(stat)
        s.set(stat, 0);
        
        data = GM_getValue('data', new Data()); // 공유데이터문제해결
        if (!data[name]) data[name] = {};
        if( !data[name][number]) data[name][number] = new Campaigns();
        data[name][number].status = stat;
        GM_setValue('data', data);
        GM_setValue('change', [number, stat]);
      } else {
        stat = "선정자 체크됨"
        console.log(stat)
        s.set(stat, std_names.length);
      }
      
      const target = document.getElementById('commentDiv');
      const observer = new MutationObserver( mutations => {
        console.log(mutations)
        
        if( btn_std.className != "active"){ //전체 댓글 확인 중
          const std_cmts = multiDimensionalUnique(
            Array.from(cmts)
            .filter(i => std_names.includes(i.firstChild.innerText) )
            .map(i => {
              i.style.backgroundColor = 'rgba(255, 200, 200, 1)';
              return [i.firstChild.innerText, i.lastChild.innerText];
            }) 
          );

          if(!checked && std_cmts.length == std_names.length){
            //확인 필요, 선정자 댓글 확인 완료
            checked = true;
            stat = "선정자 체크됨"
            console.log(stat)
            s.set(stat, std_cmts.length)
            
            data = GM_getValue('data', new Data()); // 공유데이터문제해결
            if (!data[name]) data[name] = {};
            if( !data[name][number]) data[name][number] = new Campaigns();
            data[name][number].status = stat;
            data[name][number].comments = std_cmts;
            GM_setValue('data', data);
            GM_setValue('change', [number, stat, std_cmts.length]);
          } else {
            btn_more.click();
          }
        }
      });
      observer.observe(target, { childList: true });
      
    btn_req.click();
    
    }
    else {
      if (!data[name]) data[name] = {};
      
      const stat = ( !!document.getElementById('cancelReqForm') )? "신청함" : "신청 안함" ;
      const end = document.documentElement.innerHTML.split(`마감"`)[1].split(`'`)[1];
      console.log(stat);

      data[name][number] = new Campaigns(stat);
      data[name][number].end = end;
      GM_setValue('data', data);
      GM_setValue('change', [number, stat]);
    }
  
  }, 100)

}
//로그인
else if(url.includes("http://4blog.net/login")){
  document.getElementById('imgBtn').click();
}

function multiDimensionalUnique(arr) {
   var uniques = [];
   var itemsFound = {};
   for(var i = 0, l = arr.length; i < l; i++) {
      var stringified = JSON.stringify(arr[i]);
      if(itemsFound[stringified]) { continue; }
      uniques.push(arr[i]);
      itemsFound[stringified] = true;
   }
   return uniques;
}


function Data(){
  return this;
}

function Campaigns(status){
  this.status =  status;
  this.comments = [];
}

//})();

