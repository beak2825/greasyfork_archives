// ==UserScript==
// @name         GoMagic course quizzes
// @description  Utility for better access to course quizzes on gomagic.org
// @author       TPReal
// @namespace    https://greasyfork.org/users/9113
// @version      0.1.3
// @match        *://gomagic.org/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481687/GoMagic%20course%20quizzes.user.js
// @updateURL https://update.greasyfork.org/scripts/481687/GoMagic%20course%20quizzes.meta.js
// ==/UserScript==

/* jshint ignore:start */
(()=>{
'use strict';

function load(key){
  const val=localStorage.getItem(key);
  return val?JSON.parse(val):undefined;
}

function save(key,value){
  localStorage.setItem(key,JSON.stringify(value));
}

const NEW_SCORE_WEIGHT=0.3;

function addScore(scoreData,newScore){
  const {runAvg=0,count=0}=scoreData||{};
  const newCount=count+1;
  const newScoreWeight=Math.max(1/newCount,NEW_SCORE_WEIGHT);
  return {
    runAvg:newScoreWeight*newScore+(1-newScoreWeight)*runAvg,
    count:newCount,
    lastTime:new Date().toISOString(),
  };
}

function getStats(scoreData){
  const {runAvg,count=0,lastTime}=scoreData||{};
  return {mean:runAvg,count,lastTime};
}

function getScoreSortValue(scoreData){
  const {runAvg=0,count=0}=scoreData||{};
  return runAvg-1/Math.min(Math.max(count,1),10);
}

class Quizzes{

  static KEY="__course_quizzes_data";

  static VERSION=1;

  constructor(){
    let loaded=load(Quizzes.KEY);
    if(loaded?.version!==Quizzes.VERSION)
      loaded=undefined;
    this.map=new Map();
    for(const quiz of loaded?.quizzes||[])
      this.map.set(quiz.url,quiz);
  }

  save(){
    save(Quizzes.KEY,{
      version:Quizzes.VERSION,
      quizzes:this.asList(),
    });
  }

  asList(){
    return [...this.map.values()];
  }

  get(url){
    return this.map.get(url);
  }

  set(url,quiz){
    quiz={url,...quiz};
    this.map.set(url,quiz);
    this.save();
    return quiz;
  }

  update(url,update){
    const quiz=this.get(url);
    return this.set(url,{url,...quiz,...typeof update==="function"?update(quiz):update});
  }

  getQuizzes(courseURL=undefined){
    return this.asList().filter(q=>!courseURL||q.courseURL===courseURL);
  }

  count(courseURL=undefined){
    const quizzes=this.getQuizzes(courseURL);
    const enabledQuizzes=quizzes.filter(q=>q.enabled);
    const stats=enabledQuizzes.map(q=>getStats(q.scoreData));
    const statsWithAttempts=stats.filter(s=>s.count);
    return {
      all:quizzes.length,
      disabled:quizzes.length-enabledQuizzes.length,
      enabled:enabledQuizzes.length,
      attempts:statsWithAttempts.reduce((a,s)=>a+s.count,0),
      meanScore:statsWithAttempts.length?statsWithAttempts.reduce((a,s)=>a+s.mean,0)/statsWithAttempts.length:undefined,
      minScore:statsWithAttempts.length?Math.min(...statsWithAttempts.map(s=>s.mean,0)):undefined,
      lastTime:statsWithAttempts.length?new Date(Math.max(...statsWithAttempts.map(s=>new Date(s.lastTime).getTime()))).toISOString():undefined,
    };
  }

  addScore(url,newScore){
    this.update(url,q=>({scoreData:addScore(q?.scoreData,newScore)}));
  }

  selectNextQuiz(courseURL=undefined){
    return this.getQuizzes(courseURL)
      .filter(q=>q.enabled)
      .sort(()=>Math.random()-0.5)
      .sort((a,b)=>getScoreSortValue(a.scoreData)-getScoreSortValue(b.scoreData))
      [0];
  }

}

function text(text){
  return String(text)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll("\"","&quot;")
    .replaceAll("'","&#039;");
}

const TIME_FORMATTER=new Intl.DateTimeFormat(undefined,
  {year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"});

function formatTime(date){
  return date?TIME_FORMATTER.format(new Date(date)):"-";
}

function formatScore(score){
  return score===undefined?"-%":`${Math.round(100*score)}%`;
}

function start(){
  const path=location.pathname;
  function connectQuizButtons(quizzes,base=document){
    const onQuizButtonClick=({target})=>{
      const quiz=quizzes.selectNextQuiz(target.dataset.courseUrl)
      if(quiz)
        location.href=quiz.url;
    };
    for(const button of base.querySelectorAll("button.__quizNow"))
      button.addEventListener("click",onQuizButtonClick);
  }
  if(path==="/courses/"||path==="/course-categories/"){
    const quizzes=new Quizzes();
    const count=quizzes.count();
    document.querySelector("main").insertAdjacentHTML("afterbegin",`
      <div style="
          display: inline-block;
          padding: 0 0.5rem;
          border: solid 1px black;
          border-radius: 5px;
          max-height: 10rem;
          overflow-y: auto;
        "
      >
        Saved quizzes: ${count.all}${count.disabled?` (disabled: ${count.disabled})`:""}, attempts: ${count.attempts}<br>
        Average score: ${formatScore(count.meanScore)}, min score: ${formatScore(count.minScore)}, last attempt: ${formatTime(count.lastTime)}<br>
        ${count.enabled?`
          <button type="button" class="__quizNow" style="
              all: revert;
              margin: 0.5rem 0;
            "
          >
            Take a quiz now!
          </button>
        `:""}
      </div>
    `);
    for(const courseItem of document.querySelectorAll(".bb-card-course-details")){
      const courseURL=courseItem.querySelector(".bb-course-title > a")?.href;
      if(!courseURL)
        continue;
      const count=quizzes.count(courseURL);
      if(!count.all)
        continue;
      courseItem.querySelector(".bb-course-title").insertAdjacentHTML("afterend",`
        <div style="
            padding: 0 0.25rem;
            border: solid 1px black;
            border-radius: 5px;
            align-self: end;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            font-size: 0.8em;
          "
          title="Saved quizzes info\nLast attempt: ${formatTime(count.lastTime)}"
        >
          <span>
            ${count.all}${count.disabled?` (d: ${count.disabled})`:""}, att: ${count.attempts},
            avg: ${formatScore(count.meanScore)}, min: ${formatScore(count.minScore)}
          </span>
          ${count.enabled?`
            <button type="button" class="__quizNow" data-course-url="${courseURL}" style="
                all: revert;
                margin: 0.25rem 0;
              "
            >
              Quiz!
            </button>
          `:""}
        </div>
      `);
    }
    connectQuizButtons(quizzes);
  }else if(path.startsWith("/lessons/")||path.startsWith("/quizzes/")){
    const quizzes=new Quizzes();
    for(const quizItem of document.querySelectorAll(".lms-quiz-item")){
      const link=quizItem.querySelector("a");
      const url=link.href;
      let quiz=quizzes.update(url,q=>q||{
        name:link.title,
        courseURL:document.querySelector(".course-entry-link").href,
        courseName:document.querySelector(".course-entry-title").textContent,
        enabled:!!quizItem.querySelector(".i-progress.i-progress-completed"),
      });
      if(location.href===quiz.url)
        quiz=quizzes.update(quiz.url,{enabled:true});
      const stats=getStats(quiz.scoreData);
      link.insertAdjacentHTML("afterbegin",`
        <div style="
            display: flex;
            gap: 0.25rem;
            margin-right: 0.25rem;
          "
        >
          <input
            type="checkbox"
            ${quiz.enabled?"checked":""}
            title="Include in the saved quizzes"
          >
          <span title="Average score from ${stats.count} attempt${stats.count===1?"":"s"}
Last attempt: ${formatTime(quiz.scoreData?.lastTime)}">
            ${formatScore(stats.mean)}
          </span>
        </div>
      `);
      const checkbox=link.querySelector("input[type='checkbox']");
      checkbox.addEventListener("click",()=>quizzes.update(url,{enabled:checkbox.checked}));
    }
    if(path.startsWith("/quizzes/")){
      const quiz=quizzes.get(location.href);
      if(quiz){
        const interval=setInterval(()=>{
          const quizResultItem=document.querySelector("._m_quiz_total_percent");
          if(!quizResultItem)
            return;
          const score=Number(quizResultItem.textContent.trim().slice(0,-1))/100;
          quizzes.addScore(quiz.url,score);
          quizResultItem.insertAdjacentHTML("afterend",`
            <div
              style="
                display: inline-block;
                padding: 0 0.25rem;
                border: solid 1px black;
                border-radius: 5px;
              "
            >
              Result saved<br>
              <div style="
                  margin: 0.25rem 0;
                  display: flex;
                  gap: 0.25rem;
                "
              >
                <button type="button" class="__quizNow" data-course-url="${quiz.courseURL}" style="all: revert;">
                  Another quiz!
                </button>
                <button type="button" class="__quizNow" style="all: revert;">
                  Quiz from <span style="font-style: italic;">any</span> course!
                </button>
              </div>
            </div>
          `);
          connectQuizButtons(quizzes,quizResultItem.parent);
          clearInterval(interval);
        },1000);
      }
    }
  }
}

async function onLoaded(){
  try{
    await start();
  }catch(e){
    console.error(e);
  }
}

if(document.readyState==="loading")
  document.addEventListener("DOMContentLoaded",onLoaded,false);
else
  onLoaded();

})();
