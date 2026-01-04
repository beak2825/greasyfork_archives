// ==UserScript==
// @name         AtCoder Performace Graph
// @namespace    wiiiiam104
// @version      0.1.0
// @description  AtCoder のユーザーページでパフォーマンスをグラフ化します
// @author       @Wiiiiam_104
// @match        https://atcoder.jp/users/*
// @downloadURL https://update.greasyfork.org/scripts/473409/AtCoder%20Performace%20Graph.user.js
// @updateURL https://update.greasyfork.org/scripts/473409/AtCoder%20Performace%20Graph.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function getJson(username){
    const xhr=new XMLHttpRequest();
    const url=`https://atcoder.jp/users/${username}/history/json`;
    xhr.open("GET",url);
    xhr.send();
    xhr.onload=()=>drawGraph(JSON.parse(xhr.responseText));
  }getJson(location.pathname.split("/")[2]);

  function drawGraph(data){
    function getColor(p){
      return p<0?"black":p<400?"gray":p<800?"brown":p<1200?"green":p<1600?"cyan":p<2000?"blue":p<2400?"yellow":p<2800?"orange":"red";
    }

    const h=200,w=400;
    function insertCanvas(){
      let div=document.createElement("div");
      div.innerHTML=`
        <canvas id="graph" height="${h}" width="${w}" style="background-color:#ccc;"></canvas>
        <p style="line-height:20px">2本の横線の内 下が真のRating 上がRated参加回数による補正前の値です。参加回数が多いほどこれらは近づきます。</p>
      `
      div.style="padding:10px;"
      document.querySelector("div.mt-2").appendChild(div);
    }insertCanvas();

    let perfs=[];
    for(let i=0;i<data.length;i++) if(data[i].IsRated) perfs.push(data[i].InnerPerformance);

    let ctx=document.querySelector("#graph").getContext("2d");
    ctx.clearRect(0,0,w,h);

    let maxPerf=-Infinity;
    for(let i=0;i<perfs.length;i++){
      if(maxPerf<perfs[i]) maxPerf=perfs[i];
    }

    function toYPosition(perf){
      return h-h*Math.pow(2,perf/400-maxPerf/400);
    }

    // draw color border
    for(let i=0;i<8&&i*400<maxPerf;i++){
      ctx.fillStyle="black";
      ctx.fillRect(0,toYPosition(i*400),w,1);
    }
    // draw data
    for(let i=0;i<perfs.length;i++){
      ctx.fillStyle=getColor(perfs[i]);
      let y=toYPosition(perfs[i]);
      ctx.fillRect(w*(1-Math.pow(0.9,perfs.length-i-1)),y,w/10*Math.pow(0.9,perfs.length-i-1),h-y);
    }

    let rating=data[data.length-1].NewRating;
    ctx.fillStyle=getColor(rating);
    ctx.fillRect(0,toYPosition(rating)-1,w,2);

    let PerfsAve=rating+1200/(Math.sqrt(19)-1)*(Math.sqrt(1-Math.pow(0.81,perfs.length))/(1-Math.pow(0.9,perfs.length))-1);
    ctx.fillStyle=getColor(PerfsAve);
    ctx.fillRect(0,toYPosition(PerfsAve)-1,w,2);
  }
})();