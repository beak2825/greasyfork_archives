// ==UserScript==
// @name         ImmediateGPA of UCAS
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Update your GPA immediately!
// @author       Sunny Lin
// @match        https://jwxk.ucas.ac.cn/score/bks/all
// @match        https://xkcts.ucas.ac.cn/score/bks/all
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/471709/ImmediateGPA%20of%20UCAS.user.js
// @updateURL https://update.greasyfork.org/scripts/471709/ImmediateGPA%20of%20UCAS.meta.js
// ==/UserScript==

(function () {
  'use strict';

  //Get Elements of Table and Transform it into an Array 'grades'
  var gradesTable = document.querySelector(".table");
  var rowCount = gradesTable.rows.length;
  var grades = [];
  for (var i = 0; i < rowCount; i++) {
    var cellCount = gradesTable.rows[i].cells.length;
    var row = [];
    for (var j = 0; j < cellCount; j++) {
      var cell = gradesTable.rows[i].cells[j].innerHTML;
      row.push(cell);
    }
    grades.push(row);
  }

  //Transform Scores into Grade Points
  function calculateGradePoint(scoreText) {
    if (scoreText == '补考及格'){
      return 1.0;
    }
    else {
      var score = Number(scoreText);
      if (score >= 90) {
        return 4.0;
      }
      else if (score < 90 && score >= 87) {
        return 3.9;
      }
      else if (score < 87 && score >= 85) {
        return 3.8;
      }
      else if (score < 85 && score >= 83) {
        return 3.7;
      }
      else if (score < 83 && score >= 82) {
        return 3.6;
      }
      else if (score < 82 && score >= 80) {
        return 3.5;
      }
      else if (score < 80 && score >= 78) {
        return 3.4;
      }
      else if (score < 78 && score >= 76) {
        return 3.3;
      }
      else if (score < 76 && score >= 75) {
        return 3.2;
      }
      else if (score < 75 && score >= 74) {
        return 3.1;
      }
      else if (score < 74 && score >= 73) {
        return 3.0;
      }
      else if (score < 73 && score >= 72) {
        return 2.9;
      }
      else if (score < 72 && score >= 71) {
        return 2.8;
      }
      else if (score < 71 && score >=69) {
        return 2.7;
     } 
     else if(score<69&&score>=68){
       return 2.6;
     } 
     else if(score<68&&score>=67){
       return 2.5;
     } 
     else if(score<67&&score>=66){
       return 2.4;
     } 
     else if(score<66&&score>=64){
       return 2.3;
     } 
     else if(score<64&&score>=63){
       return 2.2;
     } 
     else if(score<63&&score>=62){
       return 2.1;
     } 
     else if(score<62&&score>=61){
       return 1.8;
     }
     else if(score<61&&score>=60){
       return 1.6;
    } 
   } 
 }

 //Calculate Total
 var totalWeightedScore =0; 
 var totalCredit=0; 
 var totalGradePoint=0; 
 var totalCreditForGPA=0; 
 var semesters=[]; 
 var partialCredit=0; 
 var partialWeightedScore=0; 
 var partialGradePoint=0; 
 var partialCreditForGPA=0;

 //Calculate Average
var prevSemester = "";
for (var i = 1; i < grades.length; i++) {
  var credit = Number(grades[i][3]);
  if ((grades[i][6] != prevSemester & i != 1 )| i == grades.length - 1) {
    partialCredit = totalCredit - partialCredit;
    partialCreditForGPA = totalCreditForGPA - partialCreditForGPA;
    partialWeightedScore = totalWeightedScore - partialWeightedScore;
    partialGradePoint = totalGradePoint - partialGradePoint;
    semesters.push(i);
    grades[semesters[semesters.length - 1]].credit = partialCredit;
    grades[semesters[semesters.length - 1]].scoreAverage =
      partialWeightedScore / partialCreditForGPA;
    grades[semesters[semesters.length - 1]].gradePointAverage =
      partialGradePoint / partialCreditForGPA;
  }
  prevSemester = grades[i][6];
  totalCredit += credit;
  if (grades[i][4] != "合格") {
    var gradePoint = calculateGradePoint(grades[i][4]);
    var score = Number(grades[i][4]);
    var weightedScore = credit * score;
    var weightedGradePoint = credit * gradePoint;
    totalWeightedScore += weightedScore;
    totalGradePoint += weightedGradePoint;
    totalCreditForGPA += credit;
    console.log("gradePoint",gradePoint,i)
    gradesTable.rows[i].cells[5].innerHTML = gradePoint.toFixed(1);
  }
}

 //Calculate Average
 var scoreAverage=totalWeightedScore/totalCreditForGPA; 
 var gradePointAverage=totalGradePoint/totalCreditForGPA; 
 console.log("scoreAverage",scoreAverage)
 console.log("gradePointAverage",gradePointAverage)
 scoreAverage=scoreAverage.toFixed(4); 
 gradePointAverage=gradePointAverage.toFixed(4);

 //Outputs
 var headers = ["", "总体情况", "Total Level", totalCredit, scoreAverage, `GPA: ${gradePointAverage}`, "", "", ""];
 var row = gradesTable.insertRow(0);
 for (var i = 0; i < headers.length; i++) {
   var cell = row.insertCell(i);
   cell.innerHTML = headers[i];
 }
 gradesTable.rows[1].cells[5].innerHTML = "Grade Point";

 for (var j = 0; j < semesters.length; j++) {
   var insertPosition = semesters[j]+j+1;
   if (semesters[j] == grades.length - 1) {
    insertPosition++;
   }
   var row = gradesTable.insertRow(insertPosition);
   var cells = ["", "学期情况", "Semester Level", grades[semesters[j]].credit, grades[semesters[j]].scoreAverage.toFixed(4), `GPAS: ${grades[semesters[j]].gradePointAverage.toFixed(4)}`, "", "", ""];
   for (var i = 0; i < cells.length; i++) {
     var cell = row.insertCell(i);
     cell.innerHTML = cells[i];
   }
 }
 
 console.log(semesters)
}) ()