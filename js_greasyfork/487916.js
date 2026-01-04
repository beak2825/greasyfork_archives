// ==UserScript==
// @name         樱花去两侧广告
// @namespace    http://tampermonkey.net/
// @version      2024-02-06
// @description  樱花去广告(除播放器外)
// @author       天宇大哥
// @match        http://www.iyinghua.io/v/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iyinghua.io
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/487916/%E6%A8%B1%E8%8A%B1%E5%8E%BB%E4%B8%A4%E4%BE%A7%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/487916/%E6%A8%B1%E8%8A%B1%E5%8E%BB%E4%B8%A4%E4%BE%A7%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

GM_addStyle(`
     #adv_wrap_hh > a,#HMimageleft,#HMimageright,divz {
         display:none!important;
     }
     .play{
         display:flex;
     }
     .play .area{
         margin:0!important;
     }
     .mylist{
         flex:1;
         padding: 5px 10px;
         overflow-y: auto;
     }
     .mylist::-webkit-scrollbar {
        width: 4px;
        height: 4px;
     }

     .mylist::-webkit-scrollbar-thumb {
        border-radius: 5px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background-color: #99a9bf;
     }

     .mylist::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 5px;
        background-color: #d3dce6;
     }
     .mybtn{
         color:#fff;
         padding: 10px 0;
         border:1px solid #fff;
         cursor:pointer;
         margin-top:10px;
     }
     .mylist2 > div{
         position:relative;
         display:flex;
         justify-content: center;
         align-items: center;
         color:#fff;
         padding: 10px 0;
         border:1px solid #fff;
         cursor:pointer;
         margin-top:10px;
     }
     .mylist2 .delitem{
         position: absolute;
         right: 10px;
     }
     .mylist2 .delitem:hover{
         color:red;
     }
     .mylist2 a{
         color:#fff;
     }
   `);


function setLs(name,value){
    localStorage.setItem(name,value);
}
function getLs(name){
    return localStorage.getItem(name);
}
function delLs(name){
    localStorage.removeItem(name);
}

(function() {
    //delLs("mylist");
    let playDom = document.querySelector('.play');
    let listDom = document.createElement('div');
    let listDom2 = document.createElement('div');
    getList();
    console.log(listDom2,1);
    listDom.className = "mylist";
    listDom2.className = "mylist2";
    //listDom.innerHTML = 12345;
    playDom.appendChild(listDom);
    let btnAdd = document.createElement('div');
    btnAdd.className = "mybtn";
    btnAdd.innerHTML = "添加收藏";
    btnAdd.onclick = function(){
        let mylistStr = getLs("mylist");
        let mylist = [];
        if(mylistStr){
            mylist = JSON.parse(mylistStr);
        }
        console.log(mylist,3);
        let url = window.location.href;
        let txt = document.querySelector('.gohome h1 a').innerHTML + document.querySelector('.gohome h1 span').innerHTML;
        //let aStr = `<a href="${url}">${name}</a>`;
        let aObj = {
            url:url,
            txt:txt,
        };
        mylist.push(aObj);
        let res = JSON.stringify(mylist);
        setLs("mylist",res);
        getList();
    }
    listDom.appendChild(btnAdd);
    listDom.appendChild(listDom2);

    function getList(){
        listDom2.innerHTML = "";
        let mylistStr = getLs("mylist");
        console.log(mylistStr,221);
        let mylist = []
        if(mylistStr){
            console.log(mylistStr,334);
            mylist = JSON.parse(mylistStr);
        }
        console.log(mylist,4);
        mylist.forEach((item)=>{
            let itemDom = document.createElement('div');
            let itemA = document.createElement('a');
            let delA = document.createElement('div');
            delA.className = 'delitem';
            delA.innerHTML = "删除";
            delA.onclick = function(){
                delItem(item.txt);
            }
            itemA.href = item.url;
            itemA.innerHTML = item.txt;
            itemDom.append(itemA);
            itemDom.append(delA);
            listDom2.appendChild(itemDom);
        });
    }

    function delItem(txt){
        console.log(txt);
        let mylist = JSON.parse(getLs("mylist"));
        mylist = mylist.filter(item=>item.txt != txt);
        let res = JSON.stringify(mylist);
        setLs("mylist",res);
        getList();
    }


    //gohome


})();