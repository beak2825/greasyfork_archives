// ==UserScript==
// @name         批量下载封面
// @namespace    http://tampermonkey.net/
// @version      0.0
// @description 未完成
// @author       You
// @match        http://i.xiami.com/*/album*
// @match        http://www.xiami.com/artist/album-*
// @match        https://music.163.com/artist/album*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29349/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%B0%81%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/29349/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%B0%81%E9%9D%A2.meta.js
// ==/UserScript==
//var urlRegex = /[\w./+=:]+/ig;

///////////可能是由于跨域的原因，导致下载的图片无法重命名，有待解决。
    var classElements = [];
function getElementsByClassName(n) {
allElements = document.getElementsByTagName('div');
    console.log(allElements);
 //  console.log( classElements);
    for (var i=0; i< allElements.length; i++ )
   {
      console.log(allElements[i].className);
       if (allElements[i].className == n ) {
  classElements[classElements.length] = allElements[i]; 
      }

   }
//console.log(allElements);
 console.log( classElements);
}






function getElementsByClassName88() {
 
    for (var i=0; i< classElements.length; i++ )
   {
     
  //  [3].children[1].textContent
       //[9].childNodes[1].className
//[10].firstElementChild.className[1].childNodes[3].childNodes["0"].text[1].childNodes[3].textContent[3].children[1].textContent
    //       console.log(p);[10].firstElementChild.className[10].firstElementChild.children[1].parentNode.className
//document.body.appendChild(p);[1].childNodes[3].childNodes["0"].innerText
       
 
var name=classElements[i].children[0].childNodes[0].title+'.jpg';
        //   var dizi=classElements[i].children[0].childNodes[0].children[0].currentSrc;
     var dizi=classElements[i].children[0].childNodes[0].children[0].currentSrc.replace(/(http:\/\/img\.xiami\.net\/images\/album\/img[0-9a-z/]{2,})(?:((?:_[0-9]{2,}){2,})|(?:_1))(\.jpe?g)/ig, "$1$2$3");
      // var dizi='http:'+classElements[i].children[0].childNodes[0].children[0].currentSrc.replace(/((?:_?[-0-9a-z=./]{2,}){3})(?:_1)?(\.jpe?g)/ig, "$1$2");
//正则兼容虾米，网易两种封面地址路径规则
           console.log('名字='+name);
          console.log('地址'+dizi);
           console.log(classElements[i].children[2].p);
      // var p= document.createElement("p");
             var a = document.createElement("a");
                   a.href= dizi;
            a.download=name;
                //a.setAttribute("href",dizi); 
       a.innerHTML='下载';
           //        a.classList.add("des");
          //  a.classList.add("s-fc3");
     //    a.setAttribute("download", name);
               //    var br= document.createElement('br');
          //  classElements[i].appendChild(br);
       console.log(a);
     //  p.createElement(a);[2].children[1].outerHTML
          //classElements[i].children[2].appendChild(document.createElement("br"));
        console.log(classElements[i].children[1].outerHTML);
          classElements[i].children[2].appendChild(a);

       //   classElements[i].children[2].setAttribute("href",dizi); 
         // classElements[i].children[2].setAttribute("download", name);
        }


}
getElementsByClassName('album_item100_block');
getElementsByClassName88();