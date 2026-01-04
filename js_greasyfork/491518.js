// ==UserScript==
// @name         For sshipduck who explores galaxy
// @namespace    smilehoho
// @version      1.01
// @description  stupid google translator
// @author       smilehoho
// @match        https://ncode.syosetu.com/*
// @icon         none
// @grant        none
// @license      documents at github
// @downloadURL https://update.greasyfork.org/scripts/491518/For%20sshipduck%20who%20explores%20galaxy.user.js
// @updateURL https://update.greasyfork.org/scripts/491518/For%20sshipduck%20who%20explores%20galaxy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();

/*
document.addEventListener("DOMContentLoaded", function(){
     console.log("DOMContentLoaded");
});
*/

/*
"…".charCodeAt(0)
String.fromCharCode(8230)

".".charCodeAt(0)
String.fromCharCode(46)

"「".charCodeAt(0)
String.fromCharCode(12300)

"」".charCodeAt(0)
String.fromCharCode(12301)

"『".charCodeAt(0)
String.fromCharCode(12302)

"』".charCodeAt(0)
String.fromCharCode(12303)

<span class="notranslate"> </span>
<span translate="no"> </span>
*/

var notranslatetargetarr = [
    String.fromCharCode(12300),
    String.fromCharCode(12301),
    String.fromCharCode(12302),
    String.fromCharCode(12303),

];

var bst1= "<span class="+"\""+"notranslate"+"\""+">";
var ast1= "</span>";

var rest1 = String.fromCharCode(8230)+"+";
var re1 = new RegExp(rest1,"g");

window.addEventListener("load", (e) => {

  console.log("123");

  const whl = document.body.getElementsByTagName("*");

  const leng = whl.length - 1 ;
/*
   for(let i=0; i<=leng; i++){
var targ = document.body.getElementsByTagName("*")[i];
targ.innerText = targ.innerText.replace(rest1 , String.fromCharCode(8230));

}
*/

   for(let i=0; i<=leng; i++){


   var targ = whl[i];



       if(typeof targ == 'undefined'){continue;}
       if(targ.tagName=="P" || targ.tagName=="p"){



   targ.innerText = targ.innerText.replace(re1 , String.fromCharCode(8230));

       // 일본어 문자 … 여러개를 한개의 …로 치환



   targ.innerText = targ.innerText.replace(re1,String.fromCharCode(46)+String.fromCharCode(46)+String.fromCharCode(46));


       //일본어 문자 …를 한국식 ... 점 3개로 치환



      // targ.innerText = targ.innerText.replace("김치","상추");




        targ.innerHTML = addnotranslate(notranslatetargetarr,targ.innerHTML,bst1,ast1);

        /*
       var rwres1 = targ.innerHTML.matchAll(String.fromCharCode(12300));
       var res1 = [...rwres1];
       var rwres2 = targ.innerHTML.matchAll(String.fromCharCode(12301));
       var res2 = [...rwres2];

       if(res1==[]&&res2==[]){continue;}
           else if(res1!=[]&&res2==[]){

            targ.innerHTML = spankickin(res1,targ.innerHTML,bst1,ast1);


           }
           
           else if(res1==[]&&res2!=[]){

            targ.innerHTML = spankickin(res2,targ.innerHTML,bst1,ast1);


           }
           else{
               
               var tempst = spankickin(res1,targ.innerHTML,bst1,ast1);
               
               rwres2 = tempst.matchAll(String.fromCharCode(12301));
               res2 = [...rwres2];
               targ.innerHTML = spankickin(res2,tempst,bst1,ast1);
               
               
           }
           //endofif
           */





       }//endifp

    }//endfor

      console.log("456");

});//end of main




function spankickin2(resarr,mainst,b="<span class="+"\""+"notranslate"+"\""+">",a= "</span>"){
    //only resarr is not a iterate arr from matchall but a simple index 1d arr 
    var ln=resarr.length;
    var inarr=resarr;
    var rtnst = mainst;

for(var i=0;i<ln;i++){

var tgtindex =inarr[ln-1-i];
    
rtnst = rtnst.slice(0,tgtindex) + b + rtnst.slice(tgtindex,tgtindex+1) + a + rtnst.slice(tgtindex+1) ;


}

return rtnst;
}
/*
function spankickin(resarr,mainst,b="<span class="+"\""+"notranslate"+"\""+">",a= "</span>"){

    var ln=resarr.length;
    var inarr=resarr;
    var rtnst = mainst;

for(var i=0;i<ln;i++){

var tgtindex =inarr[ln-1-i].index;
    
rtnst = rtnst.slice(0,tgtindex) + b + rtnst.slice(tgtindex,tgtindex+1) + a + rtnst.slice(tgtindex+1) ;


}
    //아 시부럴 그냥 replace 쓸껄 

return rtnst;
}
*/
/*
역시 나야 이정도는 디버그 없이 원큐에 되지 암 일년만에 다시 JS잡으려니 바닐라함수 다까먹어서 그거 뒤지느라 반나절이나 걸리지
대충 HTMLDoM 문자열 수정정도는 디버그없이 쭉 쓰면 원큐에 된다는 말씀.
근데 진짜 내가 프로그래밍학과도 아니고 전기공학과 나와서 그것도 4학점 이상 우수졸업에 기사자격증 2개나 따고 토익 930점에 토익스피킹까지 
얻어놔도 졸업 2년간 취업 전부 떨어지고 이제 3년째 백수인게 말이 되냐 진짜??? 그래서 졸업 1년차에 배 벅벅긁으면서 자바스크립트 공짜사이트
몇번보며 흥미위주로 셀프독학한걸로 지금 백수 3년째 4월달에 일본 syosetu 소설사이트 구글번역 퀄리티에 빡쳐서 그 라노벨 웹소설 보려고 
이런 자바스크립트나 쓰고 앉아있는게 말이냐 되냐고.
돌아가시겠네.
*/

function addnotranslate(arr,trgstr,bst1,ast1){

    var len = arr.length;
    var tmpstr=trgstr;
    var resarrinarr = [];

    for(var i=0;i<len;i++ ){

        var tmpitr = trgstr.matchAll( arr[i] );

        var temparr = [...tmpitr];
        if(temparr==[]){continue;}
        
        var temparr2 = [];
        for(let ii=0;ii<temparr.length;ii++){

            temparr2[ii] = temparr[ii].index;


        }

        resarrinarr.push( temparr2 );


    }

    if(resarrinarr==[]){return;}

    var indexarr = sort(resarrinarr);

    tmpstr = spankickin2(indexarr,tmpstr,bst1,ast1);

    return tmpstr

}

function sort(arr2d){
    //get 2darray and return sorted merged 1d array


//머지소트 불가능한 이유
//1.sort 타겟 어레이의 개수가 미지수임
//2.sort 각 타겟 어레이의 원소 개수도 미지수임
//3.따라서 포인터의 개수도 미지수인데 미지수의 개수 만큼 
//다이나믹한 변수 선언은 오버헤드임
//따라서 단순 병합 후 정렬로 바꾼다. 답이 안 나오는 문제.
/*
    var len=arr2d.length;
    var a=[];
    for(let i=0;i<len;i++){

        a[i] = arr2d[i].length;
        
    }
    var min = Math.min(...a);
    var max = Math.max(...a);
    
    for(let i=0;i<len;i++){

        ;


    }
*/

var len=arr2d.length;
var a=[];
for(let i=0;i<len;i++){

    a.push(...arr2d[i]);
    
}

//아 몰라 sort쓸꺼야. ->써서 망했음.
//a.sort();

a=dosort2(a);

return a;


}

function dosort(arr){
    //get 1darr and sort then return

    var len=arr.length;
    if(len==1){return arr};
    var pivot=arr[len-1];
    var lp=0;
    var temp;
    var rp=len-2;
    while(lp!=rp){

        if(arr[lp]<pivot){lp=lp+1;}
        if(arr[rp]>pivot){rp=rp-1;}
        if(arr[lp]>=pivot&&arr[rp]<=pivot){}

    }





}

function dosort2(arr){
    //get 1darr and sort then return

    var len=arr.length;
    if(len==1){return arr}
    var temp;

    for(let a=0,i=0;a<len;a++){

        i=a;

        for(;i<len;i++){
            if(arr[a]>arr[i]){temp=arr[a];arr[a]=arr[i];arr[i]=temp;}
        }
    }

    return arr
}

