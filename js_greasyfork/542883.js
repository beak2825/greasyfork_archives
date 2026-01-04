// ==UserScript==
// @name ezmovie
// @description 入口：https://ers.nlpi.edu.tw/sendURLApiV3/?dbid=LDB0317&mode=click
// @version 1.0.14
// @match https://ers.nlpi.edu.tw/*
// @match https://www-ezmovie-tw.ers.nlpi.edu.tw/*
// @run-at document-start
// @grant GM_xmlhttpRequest
// @ 註解中…目前系統預設為：grant unsafeWindow(沙盒模式，高階API可用)，全域變數用unsafeWindow.age=48；若設定grant none(無沙盒，高階API不可用)，全域變數用window.age=48。不管哪種模式，全域變數直接用age=48亦可，tampermonkey會自己調適。
// @namespace https://greasyfork.org/users/857147
// @downloadURL https://update.greasyfork.org/scripts/542883/ezmovie.user.js
// @updateURL https://update.greasyfork.org/scripts/542883/ezmovie.meta.js
// ==/UserScript==
if(location.pathname.includes('sendURLApiV3')){
 const observer=new MutationObserver(()=>{
  const submit=document.querySelector('input[type="submit"]')
  if(submit){
   observer.disconnect()
   const username=document.getElementById('username'),password=document.getElementById('password')
   username.focus()
   username.setRangeText('Q121946390')
   username.dispatchEvent(new Event('input',{bubbles:true}))
   password.focus()
   password.setRangeText('book192590')
   password.dispatchEvent(new Event('input',{bubbles:true}))
   unsafeWindow.alert=message=>console.log('被攔截的alert',message)
   submit.click()
  }
 })
 observer.observe(document.body,{childList:true,subtree:true})
}
else if(location.pathname=='/'){
 onload=()=>{
  document.querySelector('.header-links').style.right="-200px"
  document.getElementById('main-menu').insertAdjacentHTML('beforeend','<select id="playlist" style="margin-top:-1px;text-align:center" class="menu-item" onclick="playlist.selectedIndex=0"><option selected disabled>🎬播放清單</option></select>')
  const playlist=document.getElementById('playlist')
  playlist.onchange=()=>{
   const option=playlist.options[playlist.selectedIndex]
   //const time=+localStorage.getItem(playlist.value)||0
   if(!localStorage.getItem(playlist.value))localStorage.setItem(playlist.value,`time=0&mainText=${option.text}&subText=${option.dataset.subText}&imdb=${option.dataset.imdb}&red=${option.dataset.red}&blue=${option.dataset.blue}&bd=${option.dataset.bd}&releaseDate=${option.dataset.releaseDate}&length=${option.dataset.length}&rated=${option.dataset.rated}&resourcekey=${option.dataset.resourcekey||''}`)
   //location.href=document.querySelector('a.main-text').href.replace('films/info','playfilm')+`?id=${playlist.value}`//因films/info後面的亂數與playfilm後面的亂數不同，故2025/8/30改以下
   location.href=`${location.origin}/playfilm/689ab0a556807?id=${playlist.value}`
  }
  fetch('https://www-ezmovie-tw.onrender.com/VmpGa05HRnJOVlpOV0ZKVFlrZG9XRmx0.html').then(res=>res.text()).then(html=>playlist.insertAdjacentHTML('beforeend',html))//讀取播放清單
 }
}
else if(location.search.includes('?id=')){
 const mySetTimeout=unsafeWindow.setTimeout//備份setTimeout，後面再加.bind(unsafeWindow)指定其this對應window會更穩
 unsafeWindow.setTimeout=()=>0//讓原頁面所有setTimeout失效
 document.head.appendChild(Object.assign(document.createElement('style'),{textContent:`::cue{font-size:140%;color:white;background-color:rgba(0,0,0,0.5)}`}))
 document.documentElement.style.display="none"
 onload=()=>{
  const id=location.search.slice(4)
  let getItemId=localStorage.getItem(id)
  const params=new URLSearchParams(getItemId)
  getItemId=getItemId.replace(/time=[^&]*/,'')
  document.querySelector('.main-text').textContent=params.get("mainText")
  document.querySelector('.sub-text').textContent=params.get("subText")
  document.querySelector('.score').textContent=params.get("imdb")
  const red=params.get("red").split(";"),blue=params.get("blue").split(";")
  let innerHTML=''
  red.forEach(item=>innerHTML+=`<a class="tag tag--red">${item}</a>`)
  blue.forEach(item=>innerHTML+=`<a class="tag">${item}</a>`)
  document.querySelector('.tags').innerHTML=innerHTML
  const bd=document.querySelectorAll('.bd'),bdData=params.get("bd").split(";")
  bdData.forEach((item,index)=>bd[index].textContent=item)
  document.querySelector('.release-date').textContent="上架日期："+params.get("releaseDate")
  document.querySelector('.length').textContent=` ${params.get("length")} `
  document.querySelector('.rated').textContent=params.get("rated")

  //document.querySelector('video').outerHTML=`<video style="width:100%" src="https://id-oa.onrender.com/${id}" controls controlsList="nodownload"><track id="sub" label="繁中字幕" default></video><button style="display:none" onclick="this.style.display='none';this.parentElement.className='';this.previousElementSibling.play()" class="vjs-big-play-button" type="button" title="Play Video" aria-disabled="false"><span class="vjs-icon-placeholder" aria-hidden="true"></span></button>`
  document.querySelector('video').outerHTML=`<video style="width:100%;height:100%;position:absolute" src="https://id.f2f.workers.dev/${id}?video=${navigator.userAgent}" controls controlsList="nodownload"><track id="sub" label="繁中字幕" default></video><button style="display:none" onclick="this.style.display='none';this.parentElement.className='';this.previousElementSibling.play()" class="vjs-big-play-button" type="button" title="Play Video" aria-disabled="false"><span class="vjs-icon-placeholder" aria-hidden="true"></span></button>`
  const video=document.querySelector('video'),videoParent=video.parentElement
  videoParent.style.width="100%"
  video.addEventListener("mousewheel",function(e){e.preventDefault();if(e.wheelDelta>0){video.currentTime-=1}else{video.currentTime+=1}})
  video.onloadedmetadata=()=>{
   if(lastTime){video.currentTime=lastTime;return}else video.currentTime=params.get("time")-5
   video.nextElementSibling.style.display=""
   videoParent.className='video-js vjs-fluid'//顯示<button>
   video.style.position='relative'
  }
  var lastTime
  video.ontimeupdate=function(){
   const intTime=Math.floor(video.currentTime)
   if(intTime&&intTime!=lastTime){lastTime=intTime;localStorage.setItem(id,'time='+intTime+getItemId)}
  }
  document.addEventListener("keydown",function(e){
   e.preventDefault()
   if(e.code=='KeyP'){
    if(video.paused)video.play();else video.pause()
   }
   else if(e.code=='KeyF'){
    if(document.fullscreenElement)document.exitFullscreen();else video.requestFullscreen()
   }
  })
  /*var xhr=new XMLHttpRequest()//xhr.responseType="json"//設定回傳資料為json格式，預設為text
  xhr.open('GET',"https://id-oa.onrender.com/"+id+".vtt",true)//預設就是true(異步)
  xhr.open('GET',"https://id.f2f.workers.dev/"+id+"?track",true)//預設就是true(異步)
  xhr.send()
  xhr.onerror=function(){alert('有錯誤！')}
  xhr.onload=function(){
   var data=xhr.response,split=data.split("\n")
   var v=false//true
   var text=""//"WEBVTT\n\n"
   for(var i=1;i<split.length;i++){
    if(v&&split[i]!=""){v=false;split[i]+=" line:95%"}//split[i]=split[i].replace(/,/," --> ")+" line:95%"}
    if(split[i]==""){v=true}
    text+=split[i]+"\n"
   }
   document.getElementById("sub").src=URL.createObjectURL(new Blob([text.slice(0,-1)],{type:"text/plain;charset=utf-8"}))
   video.currentTime=time-5
  }*/
  GM_xmlhttpRequest({
   method:'GET',
   url:`https://drive.google.com/timedtext?type=track&id=${id}&fmt=vtt&lang=zh-Hant&resourcekey=${params.get("resourcekey")}`,
   //headers:{'User-Agent':navigator.userAgent},//預設就會加上該瀏覽器的User-Agent
   onload:function(res){
    const arr=res.responseText.split("\n")
    arr.forEach((item,index)=>{if(item.includes(" --> "))arr[index]=item+" line:95%"})
    document.getElementById("sub").src=URL.createObjectURL(new Blob([arr.join("\n")],{type:"text/plain;charset=utf-8"}))
    //video.currentTime=time-5
   }
  })
  document.documentElement.style.display=""
 }
}
