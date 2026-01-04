// ==UserScript==
// @name         五邑大学信息查询
// @description   五邑大学信息查询查询
// @description:en 五邑大学信息查询查询
// @version       0.7.2
// @description  try to take over the world!
// @author       chancoki
// @match        https://jxgl.wyu.edu.cn/login!welcome.action
// @grant        none
// @namespace https://greasyfork.org/users/754467
// @downloadURL https://update.greasyfork.org/scripts/427056/%E4%BA%94%E9%82%91%E5%A4%A7%E5%AD%A6%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/427056/%E4%BA%94%E9%82%91%E5%A4%A7%E5%AD%A6%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
let isShow = true
let isGo = true
var body = document.body;
var p = document.createElement("p");
var ul = document.createElement("ul");
body.appendChild(p);
body.appendChild(ul)
ul.className='itemList '
p.innerHTML=`
<div class="nav">
      <button id="two">第二课堂</button>
      <button id="work">上课任务</button>
      <button id="grade">成绩查询</button>
      <button id="exam">考试安排</button>
</div>
<style>
.nav {
  height: 26px;
  width: 300px;
  border-radius: 5px;
  background-color: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 65px;
  right: 97px;
}
.nav button {
  outline: none;
  border: 0;
  border: 1px solid #E0ECFF;
  background-color: #E0ECFF;
  color: #2E2D3E;
  font-size: 12px;
  border-radius: 3px;
  border-bottom:none;
}
.nav button:hover{
 border: 1px solid #95B8E7;
 background-color: #EAF2FF;
 border-bottom:none;
}
.itemList {
  max-height: 265px;
  width: 300px;
  overflow: auto;
  position: fixed;
  top: 79px;
  right: 97px;
  display: none;
  box-shadow: 0 0 5px #bbb;
  padding: 0;

}
.itemList li:nth-child(2n) {
  background-color: #FAFAFA;
}
.itemList li:nth-child(2n-1) {
  background-color: #FFFFFF;
}
.itemList li:last-child{
 border-bottom: 1px dotted #CCCCCC;
}
.itemList li {
  padding-left: 5px;
  list-style: none;
  display: flex;
  font-size: 12px;
  line-height: 27px;
  border: 1px dotted #CCCCCC;
  border-bottom:none;
}
.itemList li p {
  text-align: left;
  box-sizing: border-box;
  padding: 0 5px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.itemList li p:first-child {
  flex: 1.2;
}
.itemList li p:nth-child(2) {
  flex: .7;
}
.itemList li p:nth-child(3) {
  flex: 2;

}

</style>
`
const nav = document.querySelector('.nav')
nav.addEventListener('click',e=>{
  const id = e.target.id
  if(id==='two'){
    if(isGo){
       ul.style.display='block'
      isShow = true
      isGo = false
      two()
    }
      
  }else if(id === 'work'){
       if(isGo){
      ul.style.display='block'
      isShow = true
      isGo = false
      work()
      }
  }else if(id==='grade'){
    if(isGo){
      ul.style.display='block'
      isShow = true
      isGo = false
      grade()
    }
  }else if(id === 'exam'){
     if(isGo){
      ul.style.display='block'
      isShow = true
      isGo = false
      exam()
    }
  }else{
   ul.style.display= !isShow ? 'block': 'none'
  isShow = !isShow
  }

})
async function two(){
    ul.innerHTML=''
  const {rows} = await P('https://jxgl.wyu.edu.cn/xscxxfxx!getDataList.action')
    ul.innerHTML=add(rows,'xsbh','xsxm','xmfl','rdxf')
}
async function work(){
    ul.innerHTML=''
  const {rows} = await P('https://jxgl.wyu.edu.cn/xskktzd!getDataList.action?xnxqdm='+nowTime())
  ul.innerHTML=add(rows,'kcdlmc','teaxm','kcmc','xdfsmc')

}
async function grade(){
    ul.innerHTML=''
  const {rows} = await P('https://jxgl.wyu.edu.cn/xskccjxx!getDataList.action?xnxqdm='+nowTime())
  ul.innerHTML=add(rows,'kcdlmc','zcj','kcmc','cjjd')

}
async function exam(){
    ul.innerHTML=''
  const {rows} = await P('http://jxgl.wyu.edu.cn/xsksap!getDataList.action?xnxqdm='+nowTime())
  ul.innerHTML=add(rows,'kssj','jkteaxms','kcmc','kscdmc')

}

function add(data,n1,n2,n3,n4){
  let li = ''
  for(let i of data){
  li+=`<li>
          <p title='${i[n1]}'>${i[n1]}</p>
          <p title='${i[n2]}'>${i[n2]}</p>
          <p title='${i[n3]}'>${i[n3]}</p>
          <p title='${i[n4]}'>${i[n4]}</p>
        </li>`
  }
return li
}
function nowTime() {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  if (month <= 2 || month >= 9) {
    if (month == 1 || month == 2) {
      return year-1+'01'
    }
    return year-1+'01'
  } else {
    return (year-1)+'02'
  }
}

function P(url) {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.responseType = "json";
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          res(xhr.response);
            isGo = true
        }
      }
    };
  });
}
    // Your code here...
})();