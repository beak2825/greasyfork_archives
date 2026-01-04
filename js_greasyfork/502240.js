// ==UserScript==
// @name ffLogs
// @version 1.0
// @description 显示gcd和能力技间隔是否正常
// @match https://*.fflogs.com/reports/*
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/502240/ffLogs.user.js
// @updateURL https://update.greasyfork.org/scripts/502240/ffLogs.meta.js
// ==/UserScript==
(function() {
   var showSkillGap = function(){
       if(!(/type=casts/.test(location.href) && /view=events/.test(location.href) &&  /source=/.test(location.href) && !/hostility=1/.test(location.href))) return;
       let table = document.getElementsByClassName("summary-table events-table events-grid-view dataTable no-footer dtr-inline")[0];
       if(!table) return;
       let head = table.tHead.rows[0];
       if(head.cells.length != 5) return;
       let cell0 = head.cells[0];
       let cell1 = head.insertCell(1);
       cell1.outerHTML = cell0.outerHTML;
       //cell1.innerHTML = cell0.innerHTML;

       let body = table.tBodies[0];

       let casts = [];
       for(var  i = 0; i < body.rows.length; i++){
           let row = body.rows[i];
           //if(row.cells[2].innerText.indexOf("Canceled") != -1) {continue};//断读条的跳过

           casts[i] = {'time' : time2Ms(row.cells[0].innerHTML),
                       'gcd' : !row.cells[2].classList.contains('indented-cell'),
                       'beginCast' : row.cells[1].innerHTML == "起始施法" || row.cells[1].innerHTML == "Begin Cast",
                       'gcdTime' : 0
                       //,'interrupt' : row.cells[2].innerText.indexOf("Canceled") != -1
                      };
           if(casts[i].beginCast == true){
               casts[i].gcdTime = parseFloat(row.cells[2].querySelector(".event-minor-details").innerText)*1000 + 100 -50;//100是读条税，-50是波动容错
           }

           let newCell = row.insertCell(1);
           let result = getCastGap(casts,i);

           newCell.outerHTML = `<td class="main-table-number" style="${result.showTip?"color:red":""}" tabindex="0">${result.gap}</td>`;

       }
    }

   function getCastGap(casts,i){
       let thisCast = casts[i];
       for(var last = i -1 ; last >=0; last--){
           if(thisCast.gcd == true){
               if(casts[last].gcd == true){
                   if(casts[last].beginCast == false && last -1 >= 0 && casts[last -1].beginCast == true){
                       let gap = thisCast.time - casts[last-1].time; //上一个是读条技能以开始读条时间为gcd开始时间
                       let showTip = gap < casts[last-1].gcdTime; //判断gcd时间是否正常
                       if(showTip){
                           return {"gap":gap,"showTip":true};
                       }else{
                           return {"gap":gap,"showTip":false};
                       }
                   }else{//该技能GCD，上一个瞬发gcd
                       return {"gap":thisCast.time - casts[last].time,"showTip":false};
                   }
               }
           }else{//该技能能力技
               return {"gap":thisCast.time - casts[last].time,"showTip":thisCast.time - casts[last].time < 560};//判断能力技间隔
           }
       }
       return {"gap":0,"showTip":false};
   }

   function time2Ms(time){
       let minus = 1;
       if(time.length == 10 && time.startsWith("-")){
           time = time.substring(1);
           minus = -1;
       }
       if(time.length != 9) return;
       return minus*(parseInt(time.substring(0,2))*60*1000 + parseInt(time.substring(3,5))*1000 + parseInt(time.substring(6,9)));
   }

    setInterval(showSkillGap,500);


})();