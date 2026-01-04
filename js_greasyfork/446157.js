// ==UserScript==
// @name 1. 各级党委政府
// @namespace Violentmonkey Scripts
// @match *://xfks-study.gdsf.gov.cn/study/*
// @require http://cdn.bootcss.com/jquery/1.11.3/jquery.min.js
// @grant none
// @version 3.0
// @author -
// @description 2022/5/31上午12:15:19
// @downloadURL https://update.greasyfork.org/scripts/446157/1%20%E5%90%84%E7%BA%A7%E5%85%9A%E5%A7%94%E6%94%BF%E5%BA%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/446157/1%20%E5%90%84%E7%BA%A7%E5%85%9A%E5%A7%94%E6%94%BF%E5%BA%9C.meta.js
// ==/UserScript==

var answers_arr=[];

var answers="A,D,B,D,B,A,D,A,B,C,A,C,B,A,B,D,B,A,D,A,ABCD,BC,AC,AB,AD,ABCD,ABCD,ABCD,ABCD,AB,V,V,V,V,V,V,V,V,V,V";

answers_arr=answers.split(",")

var i;

i=0;

var url=$('.item').each(function () {

var str;

var answer;

var type1;

var url;

str=$(this).attr('qid');

//answer=$(this).find('label').attr('val');

type1=$(this).find('input').attr('type');

if(str!=null){

answer=answers_arr[i];

if(type1=="radio"){

//console.log(answer)

$("input:radio[name='option_"+str+"'][value="+answer+"]").attr("checked","checked");

}

if(type1=="checkbox"){

for (var ii=0;ii<answer.length;ii++)

{

answer1=answer.substring(ii,ii+1)

//console.log(ii)

//console.log(answer1)

$("input:checkbox[name='option_"+str+"'][value="+answer1+"]").attr("checked","checked");

}

}

i=i+1;

}

});