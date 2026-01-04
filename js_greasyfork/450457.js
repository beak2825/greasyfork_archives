// ==UserScript==
// @name        Naver Bloger
// @namespace   Violentmonkey Scripts
// @match       *://*.naver.com/*
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
// @version     1.0
// @author      KENAI
// @license     MIT
// @description 2022. 8. 12. 오전 2:10:57
// @downloadURL https://update.greasyfork.org/scripts/450457/Naver%20Bloger.user.js
// @updateURL https://update.greasyfork.org/scripts/450457/Naver%20Bloger.meta.js
// ==/UserScript==

(function(){

  const textColor = '#666666';
  const backColor = '#FFDF0E';
  const blogAddress = "https://blog.naver.com/";
  const mblogAddress = "https://m.blog.naver.com/"
  const allList = "?categoryNo=0"


  function MyBlog() {
    this.date =  0;
    this.uid =  "";
    this.friends = {};
  }
  function Friend(){
    this.comments = [];
    this.hearts = [];
  }

  function HisBlog() {
    this.date = 0;
    this.hid = "";
    this.comments = [];
    this.hearts = [];
  }
  
  function Comment(postNumber, text){
    this.postNumber = postNumber;
    this.text = text
  }
  function Heart(postNumber){
    this.postNumber = postNumber;
  }

  function asd(k){ return JSON.parse(JSON.stringify(k));}

  let myBlog;
  let tDate;
  let uid;
  //const document = window.document;

  function mblog(id){ return "https://m.blog.naver.com/" + id + "?categoryNo=0" }

  //----------------------------------------------------------------------------------------------------
  
  function uidCheck(){
    return new Promise(function(resolve, reject){
      GM_xmlhttpRequest({
        url: `https://www.naver.com/my.html#test`,
        method: "GET",
        onload: function(response){
          clearTimeout(timeout);
          uid = response.responseText.split(`userId: "`)[1].split(`"`)[0];
          console.log("My ID: " + uid);
          if(uid != "(none)"){ resolve(uid); } else {reject("ID Check failure: no id"); }
        }
      });
      
      const timeout = setTimeout(()=>{
        //GM_removeValueChangeListener(listenerId);
        reject("ID Check failure: timeout");
      }, 5000);
		});
  }

  async function getMyBlog(){
    //내 블로그 정보 불러오기
    myBlog = GM_getValue("myBlog", null)

    if (!myBlog || myBlog.uid != uid){//내 정보 없거나 아이디 바뀜
      console.log("Bloger Data is Initialized");
      GM_listValues().forEach(key => GM_deleteValue(key));
      return await updateMyBlog();
    } else { 
      myBlog.date = new Date(myBlog.date);//날짜형식맞춤
      if (myBlog.date < tDate){ //오래된 정보
        GM_listValues().forEach(key => GM_deleteValue(key));
        return await updateMyBlog();
      } else {
        console.log("My Blog last updated date: " + myBlog.date.toLocaleString());
        console.log(myBlog)
        return myBlog;
      }
    }
  }
  
  function updateMyBlog(){
    return new Promise(function(resolve, reject){
      //resolve("pass");
      //return;
      myBlog = new MyBlog();
      myBlog.uid = uid;
      myBlog.date = new Date();

      const xmlRequest = GM_xmlhttpRequest({
        url: `https://rss.blog.naver.com/${uid}.xml`,
        method: "GET",
        onload: function(response){
          const promises = [];
          
          const responseXML = new DOMParser().parseFromString(response.responseText, "text/xml");
          const posts = Array.from(responseXML.getElementsByTagName("item"));
          console.log(uid + ": " + posts.length + " posts");
          posts.forEach(function(post){
            const postNumber = post.getElementsByTagName("link")[0].innerHTML.split("/")[4];
            
            const t = new Promise(function(res, rej){
              GM_xmlhttpRequest({
                url: `https://m.blog.naver.com/SympathyHistoryList.naver?blogId=${uid}&logNo=${postNumber}#getHearts`,
                method: "GET",
                onload: function(response){
                  const responseXML = new DOMParser().parseFromString(response.responseText, "text/html");
                  Array.from(responseXML.getElementsByClassName("item___0lBl")).forEach(function(heart){
                    const hid = heart.firstChild.firstChild.firstChild.href.split("/")[3];
                    //if( !isNaN(hid) ){return;}
                    if(!myBlog.friends[hid]) myBlog.friends[hid] = new Friend();
                    myBlog.friends[hid].hearts.push(new Heart(postNumber));
                  });
                  res("done");
                }
              });
            })
            promises.push(t);
            
            const m = new Promise(function(res, rej){
              const url = `https://m.blog.naver.com/CommentList.naver?blogId=${uid}&logNo=${postNumber}#getComments`
              const tabControl = GM_openInTab(url, {active:false});
              const listenerId = GM_addValueChangeListener(url, function(name, oldValue, newValue, remote){
                GM_removeValueChangeListener(listenerId);
                GM_deleteValue(url);
                newValue.forEach(data => {
                  const hid = data[0];
                  //if( !isNaN(hid) ){return;}
                  const text = data[2];
                  if(!myBlog.friends[hid]) myBlog.friends[hid] = new Friend();
                  myBlog.friends[hid].comments.push(new Comment(postNumber, text));
                })
                res("done");
              });
            })
            promises.push(m);
          });
          
          Promise.all(promises).then(()=>{
            //clearTimeout(timeout);
            console.log(myBlog)
            GM_setValue("myBlog", myBlog);
            console.log("My Blog new updated date: " + myBlog.date.toLocaleString());
            resolve(myBlog);
          });
        }
      });

      //const timeout = setTimeout(function(){ reject("mb Timeout") }, 10000);
    });
  }
  
  //https://admin.blog.naver.com/BuddyListManage.naver?blogId=mukamaka96&currentPage=1&searchText=&orderType=adddate
  //https://admin.blog.naver.com/BuddyMeManage.naver?relation=all&blogId=mukamaka96&currentPage=1
  function getfriends() {
    return new Promise(function(res, rej){
      GM_xmlhttpRequest({
        url: `https://m.blog.naver.com/CommentList.naver?blogId=mukamaka96&logNo=222854165945`,
        method: "GET",
        onload: function(response){
          const friends = [];
          const lists = response.responseText.split("cboxPostMention")[1].split('blogId":"');
          lists.shift();
          lists.forEach(list => { friends.push(list.split('"')[0]); })
          console.log(friends)
          res(friends)
        }
      });
    })
  } 

  
  function getTheirBlog(lists){
    return new Promise(async function(resolve, reject){
      //const promises = [];
      const lists2 = lists;
      lists = [lists[0]];
      console.log(lists)
      
      for(list of lists){
        const hid = list[0];
        const nick = list[1];
        const a = list[2];
        const hisBlog = GM_getValue(hid, null)
        
        if (!hisBlog){//정보 없거나
          await updateHisBlog(hid)
        } else { 
          hisBlog.date = new Date(hisBlog.date);//날짜형식맞춤
          if (hisBlog.date < tDate){ //오래된 정보
             await updateHisBlog(hid) ;
          } else {
            console.log(nick + "'Blog last updated date: " + myBlog.date.toLocaleString());
            return hisBlog
          }
        }
      }
      
      resolve(lists2);
      /*
      Promise.all(promises).then(()=>{
        //clearTimeout(timeout);
        console.log("all done")

        resolve(lists);
      });
      */
      
      //setTimeout(_=>{reject("tb Timeout")}, 5000);
    });
  }
         
  function updateHisBlog(hid){
    return new Promise(function(resolve, reject){
      const hisBlog = new HisBlog();
      hisBlog.hid = hid;
      hisBlog.date = new Date();

      const xmlRequest = GM_xmlhttpRequest({
        url: `https://rss.blog.naver.com/${hid}.xml`,
        method: "GET",
        onload: function(response){
          const promises = [];
          
          const responseXML = new DOMParser().parseFromString(response.responseText, "text/xml");
          const posts = Array.from(responseXML.getElementsByTagName("item"));
          console.log(hid + ": " + posts.length + " posts");
          
          posts.forEach(function(post){
            const postNumber = post.getElementsByTagName("link")[0].innerHTML.split("/")[4];
            
            const t = new Promise(function(res, rej){
              GM_xmlhttpRequest({
                url: `https://m.blog.naver.com/SympathyHistoryList.naver?blogId=${hid}&logNo=${postNumber}#getHearts`,
                method: "GET",
                onload: function(response){
                  const responseXML = new DOMParser().parseFromString(response.responseText, "text/html");
                  Array.from(responseXML.getElementsByClassName("item___0lBl")).forEach(function(heart){
                    try{
                      if(heart.firstChild.firstChild.firstChild.href.split("/")[3] == uid){
                        hisBlog.hearts.push(new Heart(postNumber));
                      }
                    } catch {
                      console.log(heart)
                    }
                  });
                  res("done");
                }
              });
            })
            promises.push(t);
            
            const m = new Promise(function(res, rej){
              const url = `https://m.blog.naver.com/CommentList.naver?blogId=${hid}&logNo=${postNumber}#getComments`
              const tabControl = GM_openInTab(url, {active:false});
              const listenerId = GM_addValueChangeListener(url, function(name, oldValue, newValue, remote){
                GM_removeValueChangeListener(listenerId);
                GM_deleteValue(url);
                newValue?.forEach(data => {
                  if(data[0] == uid){
                    hisBlog.comments.push(new Comment(postNumber, data[2]));
                  }
                   
                })
                res("done");
              });
            })
            promises.push(m);
            
          });
          
          
          Promise.all(promises).then(()=>{
            //clearTimeout(timeout);
            console.log(hisBlog)
            GM_setValue(hid, hisBlog);
            console.log(hid + "'s Blog new updated date: " + hisBlog.date.toLocaleString());
            resolve(hisBlog);
          });
        }
      });

      //const timeout = setTimeout(function(){ reject("hb Timeout") }, 20000);
    });
  }
  
  
  
  function pageCheck(){
    return new Promise(function(resolve, reject){
      //const target = document.getElementsByClassName('list_post_article');
      const t = document.getElementsByClassName('author');
      
      const option = {attributes: true, childList: true, characterData: true, subtree: true};
			const observer = new MutationObserver(mutations =>{
        if(t.length>0){
          observer.disconnect();
          clearTimeout(timeout);
          const lists = [];
          Array.from(t).forEach(function(e){ //각 포스트별
            //아이디, 닉네임 가져오기
            const hid = e.href.split("/")[3];
            const nick = e.children[1].firstElementChild.innerText;
            lists.push([hid, nick, e]);
          });
          resolve(lists);
        }
			});
			observer.observe(document, option);
      
      const timeout = setTimeout(function(){
        if(t.length>0){
          const lists = [];
          Array.from(t).forEach(function(e){ //각 포스트별
            //아이디, 닉네임 가져오기
            const hid = e.href.split("/")[3];
            const nick = e.children[1].firstElementChild.innerText;
            lists.push([hid, nick, e]);
          });
          resolve(lists);
        } else{
          reject("pc Timeout")
        
        }
        
      }, 10000);
    });
  }
  
  function pageUpdate(lists){
    console.log("pu")
    lists.forEach(list => {
      const hid = list[0];
      const nick = list[1]
      const e = list[2];
      const hisBlog = GM_getValue(hid, null);
      
      a = myBlog.friends[hid]?.comments?.length??0;
      b = myBlog.friends[hid]?.hearts?.length??0;
      c = hisBlog?.comments?.length??0;
      d = hisBlog?.hearts?.length??0;

      const apc = document.createElement("button");
      apc.appendChild( document.createTextNode("받은댓: "+a+" 받은♥: "+b+" 써준댓: "+c+" 준♥: "+d) );
      apc.style.backgroundColor = backColor;
      apc.style.marginLeft = '5px';
      apc.style.color = textColor;
      apc.style.cursor = 'pointer'
      apc.style.border = '2px'
      apc.style.borderRadius = '20px';
      apc.style.padding = '3px'
      apc.addEventListener('click', () => {
        console.log(nick + " click")
        console.log(a)
        console.log(c)
      });
      apc.addEventListener('mouseover', () => {
        console.log(nick + " over");
      });
      apc.addEventListener('mouseout', () => {
        console.log(nick + " out");
      });

      e.after(apc)
    });
  }
  

  function main1(){
    const url = location.href;
    console.log(url);
    tDate = new Date();
    //tDate.setHours(tDate.getHours()-1); //기준 시간 설정

    //블로그 홈
    if(url.includes('https://section.blog.naver.com')) {
      /*
      const p_uidCheck = uidCheck();
      const p_pageCheck = pageCheck();
      const p_getMyBlog = p_uidCheck.then(uid=>{ return getMyBlog(); })
      //const p_getTheirBlog = Promise.all([p_uidCheck, p_pageCheck]).then(_=>{ return getTheirBlog(_[1]); }) //uid, lists
      const p_getTheirBlog = Promise.all([p_getMyBlog, p_pageCheck]).then(_=>{ return getTheirBlog(_[1]); }) //uid, lists
      const p_pageUpdate = Promise.all([p_getMyBlog, p_getTheirBlog]).then(_=>{ return pageUpdate(_[1]); }) //myBlog, lists
      */
    }
    //내 ID 확인
    else if(url.includes('https://www.naver.com/my.html#test')){
      GM_setValue("userId", userId);
      window.close();
    }
    //댓글 긁어오기
    else if(url.includes("getComments")){
      const alrtScope = (typeof unsafeWindow === "undefined")?window:unsafeWindow;
      alrtScope.alert = ()=>{ //댓글 못 쓰는 글
        GM_setValue(url, null)
        window.close();
      };
      
      const comments = document.getElementsByClassName('u_cbox_area');//댓글
      const none = document.getElementsByClassName('u_cbox_contents_none');//노댓글
			
      const option = {attributes: true, childList: true, characterData: true, subtree: true};
			const observer = new MutationObserver(mutations =>{
        if(comments.length>0){
          observer.disconnect();
          const data = [];
          comments.forEach((comment)=>{
            try{
              const id = comment.firstChild.children[1].firstChild.href.split("blogId=")[1];
              const nick = comment.firstChild.children[1].innerText;
              const text = comment.children[1].innerText;
              data.push([id, nick, text]);
            } catch{}
          })
          GM_setValue(url, data)
          window.close();
        } else if(none.length>0){
          GM_setValue(url, null)
          window.close();
        }
			});
			observer.observe(document, option);
    }
    
    //모바일 블로그
    else if(url.includes('https://m.blog.naver.com/')){

      const a = document.getElementsByClassName('btn_popup_da _da-close');
      console.log(a);
			if(!!a[0]){
        console.log("!!")
				console.log(a);
			}
      /*
      setTimeout(function(){
        noticeClose($event);
      }, 5000);
      */
    }


  }
  main1();

  GM_registerMenuCommand("test", ()=>{test()});
  
  GM_registerMenuCommand("update", ()=>{update()});
  
  function test(){
    console.log("test");
    
    GM_xmlhttpRequest({
      url: `https://m.blog.naver.com/SympathyHistoryList.naver?blogId=${uid}&logNo=${postNumber}#getHearts`,
      method: "GET",
      onload: function(response){
        const responseXML = new DOMParser().parseFromString(response.responseText, "text/html");
        Array.from(responseXML.getElementsByClassName("item___0lBl")).forEach(function(heart){
          const hid = heart.firstChild.firstChild.firstChild.href.split("/")[3];
          //if( !isNaN(hid) ){return;}
          if(!myBlog.friends[hid]) myBlog.friends[hid] = new Friend();
          myBlog.friends[hid].hearts.push(new Heart(postNumber));
        });
        res("done");
      }
    });

  }
  
  function update(){
    const p_uidCheck = uidCheck();
    const p_pageCheck = pageCheck();
    const p_getMyBlog = p_uidCheck.then(uid=>{ return getMyBlog(); })
    //const p_getTheirBlog = Promise.all([p_uidCheck, p_pageCheck]).then(_=>{ return getTheirBlog(_[1]); }) //uid, lists
    const p_getTheirBlog = Promise.all([p_getMyBlog, p_pageCheck]).then(([r1, r2])=>{ return getTheirBlog(r2); }) //uid, lists
    const p_pageUpdate = Promise.all([p_getMyBlog, p_getTheirBlog]).then(_=>{ return pageUpdate(_[1]); }) //myBlog, lists
  }
  
})()