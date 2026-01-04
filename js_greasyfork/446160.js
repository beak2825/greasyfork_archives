// ==UserScript==
// @name        1. 当事人 2. 党的十九届
// @namespace   Violentmonkey Scripts
// @match       *://xfks-study.gdsf.gov.cn/study/*
// @require     http://cdn.bootcss.com/jquery/1.11.3/jquery.min.js
// @grant       none
// @version     3.0
// @author      -
// @description 2022/5/31上午12:15:19
// ==/UserScript==

var answers_arr=[];

var answers="C,B,A,A,D,D,B,C,A,D,C,B,C,A,B,D,A,B,D,C,AB,ABC,ABCD,ABCD,AB,ABC,ABCD,AB,AB,AD,V,V,V,V,V,V,V,V,V,V";

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