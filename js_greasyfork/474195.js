// ==UserScript==
// @name  永久刪除雲端硬碟
// @description 對象：各google雲端硬碟
// @version 1.1.59
// @match https://drive.google.com/drive/*
// @exclude https://drive.google.com/drive*/preload
// @ 上行由@include改成@match，避免警告
// @ 目前系統預設為：grant unsafeWindow(沙盒模式，高階API可用)，全域變數用unsafeWindow.age=48；若設定grant none(無沙盒，高階API不可用)，全域變數用window.age=48。不管哪種模式，全域變數直接用age=48亦可，tampermonkey會自己調適。
// @namespace https://greasyfork.org/users/857147
// @downloadURL https://update.greasyfork.org/scripts/474195/%E6%B0%B8%E4%B9%85%E5%88%AA%E9%99%A4%E9%9B%B2%E7%AB%AF%E7%A1%AC%E7%A2%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/474195/%E6%B0%B8%E4%B9%85%E5%88%AA%E9%99%A4%E9%9B%B2%E7%AB%AF%E7%A1%AC%E7%A2%9F.meta.js
// ==/UserScript==
var onibgObj={},quantity=0,oldText=''
document.onvisibilitychange=()=>{if(document.visibilityState=='visible'){//頁面從隱藏變可見，立即讀取當前剪貼簿文字//2025/11/16加入
 setTimeout(()=>navigator.clipboard.readText().then(text=>oldText=text).catch(err=>console.error('讀取剪貼簿錯誤',err)),1000)//延遲1000ms以便獲取頁面焦點，使能正常讀取剪貼簿，避免錯誤
}}
start()
function start(){
 const controller=new AbortController()
 const timeout=setTimeout(()=>{controller.abort();start()},30000)//請求超時30秒處理
 fetch('https://script.google.com/macros/s/AKfycbxn74EUmgbR5Ub2eawJJewv1GKKc8LnOGIEIHZ-M6gYOcaqNk9y8bZodDxlkBiiQGks/exec?onibg',{signal:controller.signal})
 .then(res=>{clearTimeout(timeout);return res.text()})
 .then(data=>{
  data=data.split('\n')
  for(const item of data){
   const mail_url=item.split(',')
   if(!mail_url[1].startsWith('https://'))continue
   onibgObj[mail_url[0]]={}
   onibgObj[mail_url[0]].url=mail_url[1]
   quantity++;getToken(mail_url)
  }
 })
}
function getToken(mail_url){
 const controller=new AbortController()
 const timeout=setTimeout(()=>{controller.abort();getToken(mail_url)},30000)//請求超時30秒處理
 fetch(mail_url[1],{signal:controller.signal})
 .then(res=>{clearTimeout(timeout);return res.text()})
 .then(data=>{
  if(!onibgObj[mail_url[0]].token){onibgObj[mail_url[0]].token=data;getRemain(mail_url)}
  else onibgObj[mail_url[0]].token=data
 })
}
async function getRemain(mail_url){
 let res=500,i=-100,Res
 while(res>=400){await delay(i+=100)
  Res=await fetch('https://www.googleapis.com/drive/v3/about?fields=storageQuota&'+mail_url[0],{headers:{Authorization:'Bearer '+onibgObj[mail_url[0]].token}})
  res=Res.status
 }
 Res=await Res.json()
 quantity--;const remain=Res.storageQuota.limit-Res.storageQuota.usage
 onibgObj[mail_url[0]].remain=remain
 if(quantity==0){console.log('就緒')
//↓2024/9/23加入，先將別人雲端硬碟的資料夾或檔案複製，再讀取剪貼簿內容，重建至我的雲端硬碟當前目錄
  const nav=document.querySelector('nav[role="navigation"]')
  const newDiv=document.createElement('div')
  newDiv.style.backgroundColor='red'
  newDiv.style.textAlign='center'
  newDiv.textContent='重建剪貼簿內容至當前目錄'
  newDiv.onclick=function(){
   thisFolder=document.querySelector('[data-parent]').getAttribute('data-parent')//location.href.split('folders/')[1]||''
   createClipboard()
  }
  nav.appendChild(newDiv)
 }
}
async function updateRemain(mail,size){
 let res=500,i=-100,Res
 while(res>=400){await delay(i+=100)
  Res=await fetch('https://www.googleapis.com/drive/v3/about?fields=storageQuota&'+mail,{headers:{Authorization:'Bearer '+onibgObj[mail].token}})
  res=Res.status
 }
 Res=await Res.json()
 onibgObj[mail].remain=Res.storageQuota.limit-Res.storageQuota.usage
 if(onibgObj[mail].remain>=size)onibgObj[mail].remain=size-1//2024/5/3，google drive產生矛盾，讀取remain>=size卻仍溢出，只好讓remain=size-1
}
setInterval(()=>{
 for(var mail in onibgObj){getToken([mail,onibgObj[mail].url])}
},3000000)
function chooseMail(size){
 if(!size)return
 let result,lastDiff=Infinity
 for(const mail in onibgObj){
  if(mail.includes('@gmail.com')&&mail!='delicadiesel@gmail.com'){
   const diff=onibgObj[mail].remain-+size
   if(diff>=0&&diff<lastDiff){result=mail;lastDiff=diff}
  }
 }
 return result
/*
 const remainArr=[]
 for(var mail in onibgObj)
 {if(mail.includes('@gmail.com')&&mail!='delicadiesel@gmail.com')remainArr.push([mail,onibgObj[mail].remain])}
 remainArr.sort(function(a,b){return a[1]-b[1]})
 //console.log(remainArr)
 const index=remainArr.findIndex(item=>+size<=item[1])
 if(index!=-1)return remainArr[index][0]
*/
}
var idObj={}
XMLHttpRequest.prototype._open=XMLHttpRequest.prototype.open
XMLHttpRequest.prototype.open=function(method,url,async,user,password){
 this._open(method,url,async,user,password)
 this.addEventListener('load',function(){
  if(url.includes('v2internal')){
   const arr=this.response.split('"id": "')
   for(let item of arr){
    let tmp=item.split('"title": "')
    if(tmp.length==2){
     tmp[0]=tmp[0].split('"')[0]
     tmp[1]=tmp[1].match(/"modifiedDate": "(.*)",/)[1]
     tmp[1]=new Date(tmp[1]).toLocaleString('zh-TW',{timeZone:'Asia/Taipei',hour12:false})
     idObj[tmp[0]]=tmp[1]
    }
   }
  }
 })
}
var Gmail=document.getElementById('gb').querySelectorAll('a')[3].getAttribute('aria-label').split('(')[1].slice(0,-1)//網頁登入的Gmail
var thisFolder//2024/9/23加入，先將別人雲端硬碟的資料夾或檔案複製，再讀取剪貼簿內容，重建至我的雲端硬碟當前目錄
var ele=document.getElementById('IaVadb')
var data,flag=true
var idArr=()=>{//ele.onclick
 let arr=data.split(',')
 arr.forEach((element,index)=>{element=element.replace('script','/script');arr[index]=element.split('/')[5].split('?')[0]})//Apps Script網址特別處理
 return arr
}
var delFunction=async(arr)=>{
 let num=0
 for(const id of arr){
  num++;if(num<50){del(id)}else await del(id)
 }
 arr=false
 async function del(id){
  let res=500,i=-100,Res
  while(res>=400){await delay(i+=100)
   Res=await fetch(`https://www.googleapis.com/drive/v3/files/${id}?fields=owners,size`,{headers:{Authorization:'Bearer '+onibgObj[Gmail].token}})
   res=Res.status
  };res=500;i=-100
  const{owners:[{emailAddress:owner}],size}=await Res.json()
  onibgObj[owner].remain-=+size||0
  while(res>=400){await delay(i+=100)
  ;({status:res}=await fetch('https://www.googleapis.com/drive/v3/files/'+id,{method:'DELETE',headers:{'Authorization':'Bearer '+onibgObj[owner].token}}))
   if(res==404)break//猜想有時檔案已經正常刪除，但卻回傳錯誤訊息，再刪除時，檔案已不存在！
  }
  num--;if(num==0&&!arr)console.log('全部刪除完成')
 }
/*arr.forEach(async(element)=>{
                             //const res=await fetch(`https://drive.google.com/file/d/${element}/view`);const body=await res.text();const thisMail=JSON.parse(body.match(/itemJson:(.*?)};/)[1])[45]
                               const res=await fetch(`https://www.googleapis.com/drive/v2/files/${element}`,{headers:{'Authorization':'Bearer '+onibgObj[Gmail].token}})
                               const thisMail=(await res.json()).owners[0].emailAddress
                               const xhr=new XMLHttpRequest()
                               xhr.open('DELETE','https://www.googleapis.com/drive/v3/files/'+element,true)
                               xhr.responseType='json'
                               xhr.setRequestHeader('Authorization','Bearer '+onibgObj[thisMail].token)
                               xhr.send()
                               xhr.onload=()=>{console.log(thisMail,xhr.response||'永久刪除成功')}
                              })*/
}
var ownerFunction=async(arr,Mail)=>{
 if(!Mail){
  let Num=prompt("輸入數字對應mail，0為略過(自動指定)\n-1為delicadiesel@gmail.com\n-2為horngmiin@st.tc.edu.tw\n-3為miinmail@gm.ahjh.tc.edu.tw\n-4為horngmiin@go.edu.tw\n資料夾不變，內部檔案擁有者更改為對應mail\n滑鼠右鍵會紅色：不遞迴裡層","00000")
  if(Num===null)return//取消
  Num=+Num
  if(Num){
   if(Num==-1)Mail='delicadiesel@gmail.com'
   else if(Num==-2)Mail='horngmiin@st.tc.edu.tw'
   else if(Num==-3)Mail='miinmail@gm.ahjh.tc.edu.tw'
   else if(Num==-4)Mail='horngmiin@go.edu.tw'
   else Mail=Object.keys(onibgObj).filter(key=>key.replace(/\D/g,'')==Num)[0]
  }
  if(!Mail)Mail='any'
 }
 if(!arr.length){console.log('全部轉移完成');return}
 const oldId=arr[0];arr.splice(0,1)
 var sourceName
 const id=await first(oldId)
 if(!id){console.log(sourceName+'檔案轉移擁有者完成');ownerFunction(arr,Mail);return}
 let missions=await second(id),num=0
 third()
 async function first(oldId){
  let res=500,i=-100,Res,mail
  while(res>=400){await delay(i+=100)
   Res=await fetch(`https://www.googleapis.com/drive/v3/files/${oldId}?fields=mimeType,modifiedTime,owners,parents,resourceKey,size`,{headers:{Authorization:'Bearer '+onibgObj[Gmail].token}})
   res=Res.status
  };res=500;i=-100
  const{mimeType,modifiedTime,owners:[{emailAddress:owner}],parents,resourceKey,size}=await Res.json();sourceName=await path(oldId)//取舊資料夾或檔案資訊
  if(mimeType=='application/vnd.google-apps.folder')return oldId
  else{
   if(Mail=='any'){mail=chooseMail(size)}else mail=Mail
   if(!mail)mail=owner
   if(mail==owner)return
   onibgObj[mail].remain-=+size||0
   if(mail.split('@')[1]==owner.split('@')[1]){
    while(res>400){await delay(i+=100)//允許發生400錯誤
    ;({status:res}=await fetch(`https://www.googleapis.com/drive/v2/files/${oldId}/permissions`,{method:"POST",headers:{Authorization:'Bearer '+onibgObj[owner].token,'Content-Type':'application/json'}
     ,body:JSON.stringify({role:'writer',type:'user',value:mail,pendingOwner:true})}))
    };res=500;i=-100
    while(res>400){await delay(i+=100)//允許發生400錯誤
    ;({status:res}=await fetch(`https://www.googleapis.com/drive/v2/files/${oldId}/permissions`,{method:"POST",headers:{Authorization:'Bearer '+onibgObj[mail].token,'Content-Type':'application/json'}
     ,body:JSON.stringify({role:'owner',type:'user',value:mail})}))
    };res=500;i=-100
    while(res>=400){await delay(i+=100)
    ;({status:res}=await fetch(`https://www.googleapis.com/drive/v3/files/${oldId}`,{method:"PATCH",headers:{Authorization:'Bearer '+onibgObj[Gmail].token,'Content-Type':'application/json'}
     ,body:JSON.stringify({modifiedTime:modifiedTime})}))
    }
   }
   else{
    while(res>=400){await delay(i+=100)
     Res=await fetch(`https://www.googleapis.com/drive/v3/files/${oldId}/copy`,{method:"POST",headers:{"X-Goog-Drive-Resource-Keys":resourceKey?`${oldId}/${resourceKey}`:'',Authorization:'Bearer '+onibgObj[mail].token,'Content-Type':'application/json'}
     ,body:JSON.stringify({modifiedTime:modifiedTime,parents:parents})})//複製舊檔案
     res=Res.status
     if(res==404){res=-500;sourceName='可疑檔案 '+sourceName;onibgObj[mail].remain+=+size||0}//404代表找不到檔案，可能是：可疑檔案||未提供檔案resourceKey||未提供parents的resourceKey
     else if(res==403&&(await Res.json()).error.message.includes('storage quota has been exceeded')){
      await updateRemain(mail,size)
      mail=chooseMail(size)
     }//else if溢出
    };res+=500;i=-100
    sourceName+='\n'+mail
    while(res>=400){await delay(i+=100)
    ;({status:res}=await fetch(`https://www.googleapis.com/drive/v3/files/${oldId}`,{method:"DELETE",headers:{Authorization:'Bearer '+onibgObj[owner].token}}))//刪除舊檔案
     if(res==404)break//猜想有時檔案已經正常刪除，但卻回傳錯誤訊息，再刪除時，檔案已不存在！
    }
   }
  }
 }
 async function second(id){
  let res=500,i=-100,Res,data,arr=[]
  return await loop('')
  async function loop(pageToken){
   while(res>=400){await delay(i+=100)
    Res=await fetch(`https://www.googleapis.com/drive/v3/files?q='${id}' in parents and trashed=false&fields=nextPageToken,files(name,mimeType,id,modifiedTime,owners,resourceKey,size)&pageSize=1000&pageToken=${pageToken}`//sharedWithMeTime
    ,{headers:{Authorization:'Bearer '+onibgObj[Gmail].token}})
    res=Res.status
   };res=500;i=-100
   data=await Res.json()
   arr=arr.concat(data.files)
   if(data.nextPageToken)return await loop(data.nextPageToken)
   else for(const i in arr){arr[i].parents=[id]};return arr
  }
 }
 async function third(){
  console.clear();console.log(num,missions)
  if(missions.length==0){if(num==0){console.log(sourceName+'\n'+Mail+'資料夾中檔案轉移擁有者完成');ownerFunction(arr,Mail)};return}
  const{name,mimeType,id,modifiedTime,parents,owners:[{emailAddress:owner}],resourceKey,size}=missions[0]
  let late=true;num++
  let res=500,i=-100,Res,mail
  if(Mail=='any'){
   if(owner==Gmail){if(size)mail=chooseMail(size)}//************************
  }else mail=Mail
  if(!mail)mail=owner
//**************************************************************************
  if(mail==owner||owner!=Gmail);//都不做
  else onibgObj[mail].remain-=+size||0
//**************************************************************************
  if(num<50){late=false;missions.splice(0,1);third()}//數字暫定50，減少403
  if(mimeType=='application/vnd.google-apps.folder'){
 //missions=missions.concat(await second(id))//會先將missions保留值；等待second(id)傳回期間，若missions有改變，則被忽略(很糟糕)，second(id)傳回後是和一開始missions保留值合併，改良如下！
  if(flag!='不遞迴裡層'){const tmp=await second(id);missions=missions.concat(tmp)}//註解則不遞迴裡層
  }
  else{
//**************************************************************************
   if(mail==owner||owner!=Gmail);//都不做
//**************************************************************************
   else{
    while(res>=400){await delay(i+=100)
     Res=await fetch(`https://www.googleapis.com/drive/v3/files/${id}/copy`,{method:"POST",headers:{"X-Goog-Drive-Resource-Keys":resourceKey?`${id}/${resourceKey}`:'',Authorization:'Bearer '+onibgObj[mail].token,'Content-Type':'application/json'}
     ,body:JSON.stringify({modifiedTime:modifiedTime,parents:parents})})//複製舊檔案
     res=Res.status
     if(res==404){res=-500;const tmp=await path(parents[0]);sourceName+='\n可疑檔案 '+tmp+'/'+name;onibgObj[mail].remain+=+size||0}//404代表找不到檔案，可能是：可疑檔案||未提供檔案resourceKey||未提供parents的resourceKey
     else if(res==403&&(await Res.json()).error.message.includes('storage quota has been exceeded')){
      await updateRemain(mail,size)
      mail=chooseMail(size)
     }//else if溢出
    };res+=500;i=-100
    while(res>=400){await delay(i+=100)
    ;({status:res}=await fetch(`https://www.googleapis.com/drive/v3/files/${id}`,{method:"DELETE",headers:{Authorization:'Bearer '+onibgObj[owner].token}}))//刪除舊檔案
     if(res==404)break//猜想有時檔案已經正常刪除，但卻回傳錯誤訊息，再刪除時，檔案已不存在！
    }
   }
  }
  num--;if(late){missions.splice(0,1);third()}else{if(num==0)third()}
 }//third()
/*let num=prompt("onibg.00000@gmail.com","00000"),newOwnerMail//='onibg.'+num.padStart(5,'0')+'@gmail.com'
 num=+num//num.padStart(5,'0')+'@gmail.com'
 newOwnerMail=Object.keys(onibgObj).filter(key=>key.replace(/\D/g,'')==num)[0]//for(const key in onibgObj){if(key.includes(num)){newOwnerMail=key;break}}
 arr.forEach(async(element)=>{//https://gist.github.com/tanaikech/685929fd4e739c943ab0b4c53348a4af
                              let res=await fetch(`https://www.googleapis.com/drive/v2/files/${element}`,{headers:{'Authorization':'Bearer '+onibgObj[Gmail].token}})
                              let body=await res.json()
                              const thisMail=body.owners[0].emailAddress
                              const {modifiedDate}=body
                              res=await fetch(`https://www.googleapis.com/drive/v2/files/${element}/permissions`,{method:"POST",headers:{'Authorization':'Bearer '+onibgObj[thisMail].token,'Content-Type':'application/json'},body:JSON.stringify({role:'writer',type:'user',value:newOwnerMail,pendingOwner:true})})
                              body=await res.json()
                              res=await fetch(`https://www.googleapis.com/drive/v2/files/${element}/permissions`,{method:"POST",headers:{'Authorization':'Bearer '+onibgObj[newOwnerMail].token,'Content-Type':'application/json'},body:JSON.stringify({role:'owner',type:'user',value:newOwnerMail})})
                                                                                                             //?moveToNewOwnersRoot=true
                              body=await res.json()
                              console.log(thisMail,body)
                              fetch(`https://www.googleapis.com/drive/v2/files/${element}?setModifiedDate=true`,{method:"PATCH",headers:{'Authorization':'Bearer '+onibgObj[newOwnerMail].token,'Content-Type':'application/json'},body:JSON.stringify({modifiedDate:modifiedDate})})
                             })*/
}
var createFunction=async(arr,mail)=>{
 if(!mail){
  let Num=prompt("輸入數字對應mail，0為略過(自動指定)\n-1為delicadiesel@gmail.com\n-2為horngmiin@st.tc.edu.tw\n-3為miinmail@gm.ahjh.tc.edu.tw\n-4為horngmiin@go.edu.tw\n以對應mail重建資料夾，搬移原檔案\n滑鼠右鍵會紅色：不搬移而改重建原檔案","00000")
  if(Num===null)return//取消
  const Nums=Num.split('+')
  for(Num of Nums){
   Num=+Num
   if(Num){
    if(Num==-1)mail='delicadiesel@gmail.com'
    else if(Num==-2)mail='horngmiin@st.tc.edu.tw'
    else if(Num==-3)mail='miinmail@gm.ahjh.tc.edu.tw'
    else if(Num==-4)mail='horngmiin@go.edu.tw'
    else mail=Object.keys(onibgObj).filter(key=>key.replace(/\D/g,'')==Num)[0]
   }
   if(!mail)mail='any';createFunction([].concat(arr),mail)
  }
  return
 }
 if(!arr.length){console.log('全部重建完成');thisFolder=null;return}//2024/9/23加入thisFolder=null，先將別人雲端硬碟的資料夾或檔案複製，再讀取剪貼簿內容，重建至我的雲端硬碟當前目錄
 const oldId=arr[0];arr.splice(0,1)
 var sourceName
 const newId=await first(oldId)
 if(!newId){console.log(sourceName+'\n'+mail+'重建檔案完成');createFunction(arr,mail);return}
 let missions=await second(oldId,newId),num=0
 third()
 async function first(oldId){
  let res=500,i=-100,Res
  while(res>=400){await delay(i+=100)
   Res=await fetch(`https://www.googleapis.com/drive/v3/files/${oldId}?fields=mimeType,name,modifiedTime,parents,resourceKey,size,owners`,{headers:{Authorization:'Bearer '+onibgObj[Gmail].token}})
   res=Res.status
  };res=500;i=-100
  let{mimeType,name,modifiedTime,parents,resourceKey,size,owners:[{emailAddress:owner}]}=await Res.json();sourceName=name//取舊資料夾或檔案資訊
  if(thisFolder)parents=[thisFolder]//2024/9/23加入，先將別人雲端硬碟的資料夾或檔案複製，再讀取剪貼簿內容，重建至我的雲端硬碟當前目錄
  if(mail=='any')mail=chooseMail(size)
  if(!mail)mail=owner
  onibgObj[mail].remain-=+size||0
  if(mimeType=='application/vnd.google-apps.folder'){
   while(res>=400){await delay(i+=100)
    Res=await fetch(`https://www.googleapis.com/drive/v3/files?${Math.random()}`,{method:"POST",headers:{Authorization:'Bearer '+onibgObj[mail].token,'Content-Type':'application/json'}
    ,body:JSON.stringify({mimeType:mimeType,name:name,modifiedTime:modifiedTime,parents:parents})})//建立新資料夾
    res=Res.status
   }
   return(await Res.json()).id
  }
  else{
   while(res>=400){await delay(i+=100)
    Res=await fetch(`https://www.googleapis.com/drive/v3/files/${oldId}/copy`,{method:"POST",headers:{"X-Goog-Drive-Resource-Keys":resourceKey?`${oldId}/${resourceKey}`:'',Authorization:'Bearer '+onibgObj[mail].token,'Content-Type':'application/json'}
    ,body:JSON.stringify({modifiedTime:modifiedTime,parents:parents})})//複製舊檔案
    res=Res.status
    if(res==403&&(await Res.json()).error.message.includes('storage quota has been exceeded')){
     await updateRemain(mail,size)
     mail=chooseMail(size)
    }//if溢出
   }
  }
 }
 async function second(oldId,newId){
  let res=500,i=-100,Res,data,arr=[]
  return await loop('')
  async function loop(pageToken){
   while(res>=400){await delay(i+=100)
    Res=await fetch(`https://www.googleapis.com/drive/v3/files?q='${oldId}' in parents and trashed=false&fields=nextPageToken,files(name,mimeType,id,modifiedTime,resourceKey,size)&pageSize=1000&pageToken=${pageToken}`
    ,{headers:{Authorization:'Bearer '+onibgObj[Gmail].token}})
    res=Res.status
   };res=500;i=-100
   data=await Res.json()
   arr=arr.concat(data.files)
   if(data.nextPageToken)return await loop(data.nextPageToken)
   else for(const i in arr){arr[i].parents=[oldId,newId]};return arr
  }
 }
 async function third(){
  console.clear();console.log(num,missions)
  if(missions.length==0){if(num==0){console.log(sourceName+'\n'+mail+'重建資料夾並搬移(重建)原檔案完成');createFunction(arr,mail)};return}
  const{name,mimeType,id,modifiedTime,parents,resourceKey,size}=missions[0]
  let late=true;num++
  let res=500,i=-100,Res
  if(num<50){late=false;missions.splice(0,1);third()}//數字暫定50，減少403
  if(mimeType=='application/vnd.google-apps.folder'){
   while(res>=400){await delay(i+=100)
    Res=await fetch(`https://www.googleapis.com/drive/v3/files?${Math.random()}`,{method:"POST",headers:{Authorization:'Bearer '+onibgObj[mail].token,'Content-Type':'application/json'}
    ,body:JSON.stringify({mimeType:mimeType,name:name,modifiedTime:modifiedTime,parents:[parents[1]]})})//建立新資料夾
    res=Res.status
   }
   const tmp=await second(id,(await Res.json()).id);missions=missions.concat(tmp)
  }
  else{
   if(flag!='不搬移而改重建原檔案'&&!thisFolder){//2024/9/23加入&&!thisFolder，先將別人雲端硬碟的資料夾或檔案複製，再讀取剪貼簿內容，重建至我的雲端硬碟當前目錄
    while(res>=400){await delay(i+=100)
    ;({status:res}=await fetch(`https://www.googleapis.com/drive/v3/files/${id}?removeParents=${parents[0]}&addParents=${parents[1]}`
     ,{method:"PATCH",headers:{Authorization:'Bearer '+onibgObj[Gmail].token,'Content-Type':'application/json'}}))//搬移舊檔案
    }}
   else{
    while(res>=400){await delay(i+=100)
     Res=await fetch(`https://www.googleapis.com/drive/v3/files/${id}/copy?${Math.random()}`,{method:"POST",headers:{"X-Goog-Drive-Resource-Keys":resourceKey?`${id}/${resourceKey}`:'',Authorization:'Bearer '+onibgObj[mail].token,'Content-Type':'application/json'}
     ,body:JSON.stringify({modifiedTime:modifiedTime,parents:[parents[1]]})})//複製舊檔案
     res=Res.status
     if(res==403&&(await Res.json()).error.message.includes('storage quota has been exceeded')){
      await updateRemain(mail,size)
      mail=chooseMail(size)
     }//if溢出
    }
   }
  }
  num--;if(late){missions.splice(0,1);third()}else{if(num==0)third()}
 }//third()
/*let num=prompt("onibg.00000@gmail.com","00000"),newOwnerMail//='onibg.'+num.padStart(5,'0')+'@gmail.com'
 num=+num//num.padStart(5,'0')+'@gmail.com'
 newOwnerMail=Object.keys(onibgObj).filter(key=>key.replace(/\D/g,'')==num)[0]//for(const key in onibgObj){if(key.includes(num)){newOwnerMail=key;break}}
 arr.forEach(async(element)=>{//https://gist.github.com/tanaikech/685929fd4e739c943ab0b4c53348a4af
                              const res=await fetch(`https://www.googleapis.com/drive/v2/files/${element}`,{headers:{'Authorization':'Bearer '+onibgObj[Gmail].token}})
                              const{parents,modifiedDate}=await res.json()
                              await fetch(`https://www.googleapis.com/drive/v2/files/${element}/copy`,{method:"POST",headers:{'Authorization':'Bearer '+onibgObj[newOwnerMail].token,'Content-Type':'application/json'},body:JSON.stringify({modifiedDate:modifiedDate,parents:parents})})
                              if(isRemove){fetch(`https://www.googleapis.com/drive/v3/files/${element}`,{method:"DELETE",headers:{'Authorization':'Bearer '+onibgObj[Gmail].token}})}
                             })*/
}
var repeatFunction=async()=>{
 let Num=prompt("輸入數字對應mail，0為略過\n-1為delicadiesel@gmail.com\n-2為horngmiin@st.tc.edu.tw\n-3為miinmail@gm.ahjh.tc.edu.tw\n-4為horngmiin@go.edu.tw\n輸出包含對應mail擁有的檔案","00000"),mail
 if(Num===null)return//取消
 Num=+Num
 if(Num){
  if(Num==-1)mail='delicadiesel@gmail.com'
  else if(Num==-2)mail='horngmiin@st.tc.edu.tw'
  else if(Num==-3)mail='miinmail@gm.ahjh.tc.edu.tw'
  else if(Num==-4)mail='horngmiin@go.edu.tw'
  else mail=Object.keys(onibgObj).filter(key=>key.replace(/\D/g,'')==Num)[0]
 }
 let oldId=data.split(',')[0]
 oldId=oldId.replace('script','/script');oldId=oldId.split('/')[5].split('?')[0]//Apps Script網址特別處理
 //const xhr=new XMLHttpRequest();xhr.open('GET',obj[Gmail]+'?repeat='+id,true);xhr.send();xhr.onload=()=>{alert(xhr.response)}
 var sourceName,Size=0,foldersCount=0,filesCount=0,result=''
 var foldersObj={},filesObj={},delArr=[],canCopyFalse=[]
 const{id,name}=await first(oldId)
 if(!id){alert(sourceName);return}
 sourceName=`來源名稱：${name}`
 let missions=await second(id,name),num=0
 third()
 async function first(oldId){
  let res=500,i=-100,Res
  while(res>=400){await delay(i+=100)
   Res=await fetch(`https://www.googleapis.com/drive/v3/files/${oldId}?fields=mimeType,size,owners,capabilities/canCopy`,{headers:{Authorization:'Bearer '+onibgObj[Gmail].token}})
   res=Res.status
  }
  const{mimeType,size,owners:[{emailAddress:owner}],capabilities}=await Res.json();Size+=+size||0
  const name=await path(oldId)
  if(mimeType=='application/vnd.google-apps.folder')return{id:oldId,name:name}
  else{
   if(!capabilities.canCopy)console.log('canCopyFalse',name)
   sourceName=
`來源名稱：${name}
size:${Size}
資料夾:0個
檔案:1個
重複資料夾：{}
重複檔案：{}
↓擁有者為：${mail}
${owner==mail?name:''}`
   return ''
  }
 }
 async function second(id,folderName){
  let res=500,i=-100,Res,data,arr=[]
  return await loop('')
  async function loop(pageToken){
   while(res>=400){await delay(i+=100)
    Res=await fetch(`https://www.googleapis.com/drive/v3/files?q='${id}' in parents and trashed=false&orderBy=folder,createdTime desc&fields=nextPageToken,files(mimeType,name,size,id,owners,capabilities/canCopy)&pageSize=1000&pageToken=${pageToken}`
    ,{headers:{Authorization:'Bearer '+onibgObj[Gmail].token}})//一定要orderBy=folder，使用「desc」修飾符反向排序，使createdTime由晚→早
    res=Res.status
   };res=500;i=-100
   data=await Res.json()
   arr=arr.concat(data.files)
   if(data.nextPageToken)return await loop(data.nextPageToken)
   else{
    let foldersNum=arr.findIndex(item=>item.mimeType!='application/vnd.google-apps.folder')
    if(foldersNum==-1)foldersNum=arr.length
    let filesNum=arr.length-foldersNum
    foldersCount+=foldersNum;filesCount+=filesNum
    const foldersArr=[],filesArr=[]
    arr.forEach((item,index)=>{
     const fullName=folderName+'/'+item.name
     if(index<foldersNum){
      if(foldersArr.includes(item.name)){foldersObj[fullName]=foldersObj[fullName]?++foldersObj[fullName]:1}else{foldersArr.push(item.name)}
      arr[index].name=fullName
     }
     else{
      if(item.capabilities.canCopy===false)canCopyFalse.push(item.id)
      if(item.owners[0].emailAddress==mail){result+='\n'+fullName}
      Size+=+item.size||0
      if(filesArr.includes(item.name)){filesObj[fullName]=filesObj[fullName]?++filesObj[fullName]:1;delArr.push([item.id,item.owners[0].emailAddress,item.size])}else{filesArr.push(item.name)}
     }
    })
    return arr.splice(0,foldersNum)
   }
  }
 }
 async function third(){
  console.clear();console.log(num,missions)
  if(missions.length==0){
   if(num==0){
    alert(sourceName+`
size:${Size}
資料夾:${foldersCount}個
檔案:${filesCount}個
可疑檔案:${canCopyFalse.length}個
重複資料夾：${JSON.stringify(foldersObj)}
重複檔案：${JSON.stringify(filesObj)}
↓擁有者為：${mail}${result}`)
    const canCopyFalsePath=()=>canCopyFalse.forEach(async item=>console.log('canCopyFalse',await path(item)))
    var OK;if(delArr.length)OK=confirm('確定要刪除createdTime較早的重複檔？')
    canCopyFalsePath()
    if(!OK)return
    for(const id_owner of delArr){
     num++;if(num<50){del(id_owner)}else await del(id_owner)//數字暫定50，減少403
    }
    OK=false
    async function del(arr2){
     onibgObj[arr2[1]].remain-=+arr2[2]||0
     let res=500,i=-100
     while(res>=400){await delay(i+=100)
     ;({status:res}=await fetch('https://www.googleapis.com/drive/v3/files/'+arr2[0],{method:'DELETE',headers:{Authorization:'Bearer '+onibgObj[arr2[1]].token}}))
      if(res==404)break//猜想有時檔案已經正常刪除，但卻回傳錯誤訊息，再刪除時，檔案已不存在！
     }
     num--;if(num==0&&!OK)console.log('刪除重複檔完成')
    }
   }//num==0
   return
  }
  const{id,name}=missions[0]
  let late=true;num++
  if(num<50){late=false;missions.splice(0,1);third()}//數字暫定50，減少403
  const tmp=await second(id,name);missions=missions.concat(tmp)//註解則不遞迴裡層
  num--;if(late){missions.splice(0,1);third()}else{if(num==0)third()}
 }//third()

 /*const xhr=new XMLHttpRequest()
 let arr=[]
 loop('')
 function loop(pageToken){
  xhr.open('GET',`https://www.googleapis.com/drive/v3/files?q='${id}' in parents and trashed=false&orderBy=folder&fields=nextPageToken,files(mimeType,name)&pageSize=1000&pageToken=${pageToken}`,true)
  xhr.responseType='json'
  xhr.setRequestHeader('Authorization','Bearer '+onibgObj[Gmail].token)
  xhr.send()
  xhr.onload=()=>{
   arr=arr.concat(xhr.response.files)
   if(xhr.response.nextPageToken){loop(xhr.response.nextPageToken)}
   else
   {
    let foldersCount=arr.findIndex(item=>item.mimeType!='application/vnd.google-apps.folder')
    if(foldersCount==-1)foldersCount=arr.length
    let filesCount=arr.length-foldersCount
    const foldersObj={},filesObj={}
    const foldersArr=[],filesArr=[]
    arr.forEach((item,index)=>{
     if(index<foldersCount)
     {if(foldersArr.includes(item.name)){foldersObj[item.name]=foldersObj[item.name]?++foldersObj[item.name]:1}else{foldersArr.push(item.name)}}
     else
     {if(filesArr.includes(item.name)){filesObj[item.name]=filesObj[item.name]?++filesObj[item.name]:1}else{filesArr.push(item.name)}}
    })
alert(
`資料夾:${foldersCount}個
檔案:${filesCount}個
重複資料夾：${JSON.stringify(foldersObj)}
重複檔案：${JSON.stringify(filesObj)}`)
   }
  }
 }
*/
}
var changeDateFunction=async()=>{
 if(oldText){
  try{await navigator.clipboard.writeText(oldText)}catch(err){console.error("寫入剪貼簿錯誤",err)}
 }
 let theId=data.split(',')[0]
 theId=theId.replace('script','/script');theId=theId.split('/')[5].split('?')[0]//Apps Script網址特別處理
 let theDate=prompt("更改為以下日期")
 if(theDate===null)return//取消
 theDate=new Date(theDate).toISOString()
 let res=500,i=-100
 while(res>=400){await delay(i+=100)
 ;({status:res}=await fetch(`https://www.googleapis.com/drive/v3/files/${theId}`,{method:"PATCH",headers:{Authorization:'Bearer '+onibgObj[Gmail].token,'Content-Type':'application/json'}
                ,body:JSON.stringify({modifiedTime:theDate})}))
 }
}
var renameFunction=async()=>{if(oldText)navigator.clipboard.writeText(oldText).catch(err=>console.error("寫入剪貼簿錯誤",err))
 let theId=data.split(',')[0]
 theId=theId.replace('script','/script');theId=theId.split('/')[5].split('?')[0]//Apps Script網址特別處理
 let res=500,i=-100,Res
 while(res>=400){await delay(i+=100)
  Res=await fetch(`https://www.googleapis.com/drive/v3/files/${theId}?fields=name,modifiedTime`,{headers:{Authorization:'Bearer '+onibgObj[Gmail].token}})
  res=Res.status
  };res=500;i=-100
 const{name,modifiedTime}=await Res.json()
 let theName=prompt("更改為以下名稱",name)
 if(theName===null)return//取消
 while(res>=400){await delay(i+=100)
 ;({status:res}=await fetch(`https://www.googleapis.com/drive/v3/files/${theId}`,{method:"PATCH",headers:{Authorization:'Bearer '+onibgObj[Gmail].token,'Content-Type':'application/json'}
                ,body:JSON.stringify({name:theName,modifiedTime})}))
 }
}
unsafeWindow.shareParent=async(mail,id)=>{//fetch(`https://script.google.com/macros/s/AKfycbxHSWHtQg_qH-CSJGAbo5jUFqm6udTABUlweLugH1hpJVJnEo0/exec?editor=${newOwnerMail}$${element}`)//與我共用(v2internal?)
 let parent,owner,modifiedTime,permissionId
 ,res=await fetch(`https://www.googleapis.com/drive/v3/files/${id}?fields=parents`,{headers:{'Authorization':'Bearer '+onibgObj[Gmail].token}})
 ;({parents:[parent]}=await res.json())//由原id，取父資料夾id
 res=await fetch(`https://www.googleapis.com/drive/v3/files/${parent}?fields=modifiedTime,owners`,{headers:{'Authorization':'Bearer '+onibgObj[Gmail].token}})
 ;({modifiedTime,owners:[{emailAddress:owner}]}=await res.json())//由父資料夾id，取其時間、擁有者mail
 fetch(`https://www.googleapis.com/drive/v3/files/${parent}/permissions/anyoneWithLink`,{method:"PATCH",headers:{'Authorization':'Bearer '+onibgObj[owner].token,'Content-Type':'application/json'}
 ,body:JSON.stringify({role:'writer'})})//由父資料夾id，將其知道連結的任何人，權限改編輯者
 res=await fetch(`https://www.googleapis.com/drive/v3/files/${parent}/permissions`,{method:"POST",headers:{'Authorization':'Bearer '+onibgObj[owner].token,'Content-Type':'application/json'}
 ,body:JSON.stringify({role:'writer',type:'user',emailAddress:mail})})//由父資料夾id，將其新增使用者共用
 ;({id:permissionId}=await res.json())
 await fetch(`https://www.googleapis.com/drive/v3/files/${parent}/permissions/${permissionId}`,{method:"DELETE",headers:{'Authorization':'Bearer '+onibgObj[owner].token}})//由父資料夾id，刪除該使用者共用
 fetch(`https://www.googleapis.com/drive/v3/files/${parent}`,{method:"PATCH",headers:{'Authorization':'Bearer '+onibgObj[owner].token,'Content-Type':'application/json'}
 ,body:JSON.stringify({modifiedTime:modifiedTime,folderColorRgb:"#f83a22"})})//由父資料夾id，將其改回原時間、設紅色
}
var observer=new MutationObserver(function(mutations){
//console.log(mutations)
 if(ele.innerText&&!ele.innerText.includes('刪除')&&flag){flag=false
  navigator.clipboard.readText().then(async text=>{
   data=text
   text=text.split(',')[0].replace('script','/script')
   text=text.split('/')[5].split('?')[0]
   if(text.length<28)throw new Error('id長度小於28')//2024/9/25加入，text長度小於28不合理，丟錯不處理
   let status=500,i=-100,res
   while(status>=400){await delay(i+=100)
    res=await fetch(`https://www.googleapis.com/drive/v3/files/${text}?fields=name,id,owners,size,modifiedTime`,{headers:{Authorization:'Bearer '+onibgObj[Gmail].token}})
    status=res.status
    if(status==404)throw new Error('此id已不存在')//有時檔案已經刪除，但剪貼簿仍有此id，應跳脫處理！
   }
   res=await res.json()
   ele.innerHTML=`<button>刪除</button>　<button>轉移</button>　<button>重建</button>　<button>內容</button>　<button>改期</button>　<button>改名</button><br><span style="user-select:all">${res.name}</span><br><span style="user-select:all">${res.id}</span><br><span style="user-select:all;color:fuchsia">${res.owners[0].emailAddress}</span><br><span style="user-select:all;color:red">${res.size}</span>`
   flag=true
   ele.innerHTML+=`<br><span style="user-select:all;color:yellow">${new Date(res.modifiedTime).toLocaleString('zh-TW',{timeZone:'Asia/Taipei',hour12:false})}</span>`
   const buttons=ele.querySelectorAll('button')
   buttons[0].onclick=()=>delFunction(idArr());buttons[1].onclick=()=>ownerFunction(idArr());buttons[2].onclick=()=>createFunction(idArr());buttons[3].onclick=()=>repeatFunction();buttons[4].onclick=()=>changeDateFunction();buttons[5].onclick=()=>renameFunction()
                                               buttons[1].oncontextmenu=function(){flag='不遞迴裡層';this.style.backgroundColor='red'};buttons[2].oncontextmenu=function(){flag='不搬移而改重建原檔案';this.style.backgroundColor='red'}
  ;(()=>{let remove//不再執行，改用以上
   fetch(`https://drive.google.com/file/d/${text}/view`)
   .then(res=>{return res.text()})
   .then(body=>{
    let configJson=JSON.parse(body.match(/configJson:(.*?),\s/)[1])
    let itemJson=JSON.parse(body.match(/itemJson:(.*?)};/)[1])
    ele.innerHTML=`<button>刪除</button>　<button>轉移</button>　<button>轉建</button>　<button>內容</button><br><span style="user-select:all">${itemJson[1]}</span><br><span style="user-select:all;color:fuchsia">${itemJson[45]}</span><br><span style="user-select:all;color:red">${itemJson[25].pop()}</span>`
    flag=true
    let xhr=new XMLHttpRequest()
    xhr.open('GET','https://content.googleapis.com/drive/v2beta/files/'+text+'?key='+configJson[11][9],true)
    let resourcekey=itemJson[16].split('resourcekey=')[1]
    if(resourcekey){xhr.setRequestHeader('X-Goog-Drive-Resource-Keys',`${text}/${resourcekey}`)}
    xhr.responseType='json'
    xhr.onload=()=>{
     ele.innerHTML+=`<br><span style="user-select:all;color:yellow">${new Date(xhr.response.modifiedDate).toLocaleString('zh-TW',{timeZone:'Asia/Taipei',hour12:false})}</span>`
     ele.innerHTML+=`<br><span style="user-select:all;color:yellow">${idObj[text]}</span>`
     const buttons=ele.querySelectorAll('button')
     buttons[0].onclick=()=>delFunction(idArr());buttons[1].onclick=()=>ownerFunction(idArr());buttons[2].onclick=()=>createFunction(idArr(),remove);buttons[3].onclick=()=>repeatFunction()
                                                                                               buttons[2].oncontextmenu=function(){remove=true;this.style.backgroundColor='red'}
   //const eleS=ele.querySelectorAll('span');eleS[0].onclick=eleS[1].onclick=eleS[2].onclick=eleS[3].onclick=function(){event.stopPropagation()}
    }
    xhr.send()
  /*var range=document.createRange()
    range.selectNodeContents(this)
    var selectedText=getSelection()
    selectedText.removeAllRanges()
    selectedText.addRange(range)*/
   }).catch(error=>{flag=true})//2023/12/6加入，因text有時為空
        })//不再執行()，改用以上
                                                  }).catch(e=>{flag=true})
 }
})
observer.observe(ele,{
//childList:true,
  //subtree:true,
 attributes:true
})
async function delay(i){return new Promise(resolve=>setTimeout(resolve,i))}
const pathObj={}
async function path(id){
 if(pathObj[id]){return pathObj[id]}
 let res=500,i=-100,Res,Path=''
 while(id){
  while(res>=400){await delay(i+=100)
   Res=await fetch(`https://www.googleapis.com/drive/v3/files/${id}?fields=parents,name`,{headers:{Authorization:'Bearer '+onibgObj[Gmail].token}})
   res=Res.status
  };res=500;i=-100
  Res=await Res.json()
  Path=Res.name+'/'+Path
  id=Res.parents?Res.parents[0]:''
 }
 Path=Path.slice(0,-1)
 pathObj[id]=Path;return Path
}
//↓2024/9/23加入，先將別人雲端硬碟的資料夾或檔案複製，再讀取剪貼簿內容，重建至我的雲端硬碟當前目錄
function createClipboard(){
 navigator.clipboard.readText().then(async text=>{
  data=text
  text=text.split(',')[0].replace('script','/script')
  text=text.split('/')[5].split('?')[0]
  if(text.length<28)throw new Error('id長度小於28')//2024/9/25加入，text長度小於28不合理，丟錯不處理
  createFunction(idArr(),Gmail)
                                                 }).catch(e=>console.log('讀取剪貼簿錯誤',e))
}
