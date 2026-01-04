// ==UserScript==
// @name     			Calendar Data
// @description 	Extract the data from the school calendar website add sends it to my server
// @version  			1.0
// @match  			https://berseva.iscool.co.il/default.aspx
// @require 			https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @author 				Popick
// @license       Etay S.
// @namespace https://greasyfork.org/users/892638
// @downloadURL https://update.greasyfork.org/scripts/453597/Calendar%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/453597/Calendar%20Data.meta.js
// ==/UserScript==

var tableHeader = $(".skinheader > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)");
var mainTable = $("#dnn_ctr689_TimeTableView_PlaceHolder > div:nth-child(1) > table:nth-child(4) > tbody:nth-child(1)");
var classSelectedNumber = $("#dnn_ctr689_TimeTableView_ClassesList").val();
var tableItem;
var indvTeacher;
var indvClass = [];
var indvDayDict = {};
var finalDayDict={};
var classNumber,gradeNumber
$("#Body").prepend('<button id="updateBtn" >לחץ עלי בשביל לעדכן</button>');


function update(){
  var k=1;
  for (let i=3;i<12;i++){
      var leng = $("#dnn_ctr689_TimeTableView_PlaceHolder > div:nth-child(1) > table:nth-child(4) > tbody:nth-child(1) > tr:nth-child("+i+") > td:nth-child(2)").children().length;
    for (let j=2;j<=leng;j++){
  		indvTeacher = $("#dnn_ctr689_TimeTableView_PlaceHolder > div:nth-child(1) > table:nth-child(4) > tbody:nth-child(1) > tr:nth-child("+i+") > td:nth-child(2) > div:nth-child("+j+")").html();
      indvClass.push(indvTeacher);
     }

      if (indvClass.length!=0){
          indvDayDict["hour"+k]=(indvClass);
      }else{
          console.log((indvClass));

      }
      indvClass=[]
      k++;
  }
    console.log(indvDayDict);
    convert();
}

function convert(){

    if (classSelectedNumber == "1"){ classNumber = 1; gradeNumber = 7}
    else if (classSelectedNumber == "2"){ classNumber = 2; gradeNumber = 7}
    else if (classSelectedNumber == "3"){ classNumber = 3; gradeNumber = 7}
    else if (classSelectedNumber == "4"){ classNumber = 4; gradeNumber = 7}
    else if (classSelectedNumber == "5"){ classNumber = 5; gradeNumber = 7}
    else if (classSelectedNumber == "6"){ classNumber = 6; gradeNumber = 7}
    else if (classSelectedNumber == "83"){ classNumber = 7; gradeNumber = 7}
    else if (classSelectedNumber == "88"){ classNumber = 8; gradeNumber = 7}

    else if (classSelectedNumber == "10"){ classNumber = 1; gradeNumber = 8}
    else if (classSelectedNumber == "11"){ classNumber = 2; gradeNumber = 8}
    else if (classSelectedNumber == "12"){ classNumber = 3; gradeNumber = 8}
    else if (classSelectedNumber == "13"){ classNumber = 4; gradeNumber = 8}
    else if (classSelectedNumber == "14"){ classNumber = 5; gradeNumber = 8}
    else if (classSelectedNumber == "15"){ classNumber = 6; gradeNumber = 8}
    else if (classSelectedNumber == "16"){ classNumber = 7; gradeNumber = 8}
    else if (classSelectedNumber == "87"){ classNumber = 8; gradeNumber = 8}

    else if (classSelectedNumber == "22"){ classNumber = 1; gradeNumber = 9}
    else if (classSelectedNumber == "23"){ classNumber = 2; gradeNumber = 9}
    else if (classSelectedNumber == "24"){ classNumber = 3; gradeNumber = 9}
    else if (classSelectedNumber == "25"){ classNumber = 4; gradeNumber = 9}
    else if (classSelectedNumber == "26"){ classNumber = 5; gradeNumber = 9}
    else if (classSelectedNumber == "27"){ classNumber = 6; gradeNumber = 9}
    else if (classSelectedNumber == "89"){ classNumber = 7; gradeNumber = 9}
    else if (classSelectedNumber == "91"){ classNumber = 8; gradeNumber = 9}
    else if (classSelectedNumber == "92"){ classNumber = 9; gradeNumber = 9}

    else if (classSelectedNumber == "31"){ classNumber = 1; gradeNumber = 10}
    else if (classSelectedNumber == "32"){ classNumber = 3; gradeNumber = 10}
    else if (classSelectedNumber == "33"){ classNumber = 4; gradeNumber = 10}
    else if (classSelectedNumber == "34"){ classNumber = 5; gradeNumber = 10}
    else if (classSelectedNumber == "35"){ classNumber = 6; gradeNumber = 10}
    else if (classSelectedNumber == "37"){ classNumber = 8; gradeNumber = 10}

    else if (classSelectedNumber == "39"){ classNumber = 1; gradeNumber = 11}
    else if (classSelectedNumber == "40"){ classNumber = 3; gradeNumber = 11}
    else if (classSelectedNumber == "41"){ classNumber = 4; gradeNumber = 11}
    else if (classSelectedNumber == "42"){ classNumber = 5; gradeNumber = 11}
    else if (classSelectedNumber == "43"){ classNumber = 6; gradeNumber = 11}
    else if (classSelectedNumber == "44"){ classNumber = 7; gradeNumber = 11}
    else if (classSelectedNumber == "45"){ classNumber = 8; gradeNumber = 11}
    else if (classSelectedNumber == "46"){ classNumber = 9; gradeNumber = 11}

    else if (classSelectedNumber == "48"){ classNumber = 1; gradeNumber = 12}
    else if (classSelectedNumber == "49"){ classNumber = 3; gradeNumber = 12}
    else if (classSelectedNumber == "50"){ classNumber = 4; gradeNumber = 12}
    else if (classSelectedNumber == "51"){ classNumber = 5; gradeNumber = 12}
    else if (classSelectedNumber == "52"){ classNumber = 6; gradeNumber = 12}
    else if (classSelectedNumber == "53"){ classNumber = 7; gradeNumber = 12}
    else if (classSelectedNumber == "54"){ classNumber = 8; gradeNumber = 12}
    else if (classSelectedNumber == "55"){ classNumber = 9; gradeNumber = 12}
//    console.log(indvDayDict["hour3"][1]);
    var hoursList = (Object.keys(indvDayDict));
    for (let i=0;i<hoursList.length;i++){
        finalDayDict[hoursList[i]]=[];
    }

    for (let i=1;i<12;i++){
        if (hoursList.includes("hour"+i)){
            for (let j=0;j<indvDayDict["hour"+i].length;j++){
                if (indvDayDict["hour"+i][j].includes("סורין")){
                    finalDayDict['hour'+i].push(30)
                }
                else if (indvDayDict["hour"+i][j].includes("גל אלכסנדרה")){
                    finalDayDict['hour'+i].push(60)
                }else if (indvDayDict["hour"+i][j].includes("שושן אלי")){
                    finalDayDict['hour'+i].push(61)
                }else if (indvDayDict["hour"+i][j].includes("דבח שושנה")){
                    finalDayDict['hour'+i].push(62)
                }else if (indvDayDict["hour"+i][j].includes("פרקל טל")){
                    finalDayDict['hour'+i].push(40)
                }else if (indvDayDict["hour"+i][j].includes("גירשקין מרינה")){
                    finalDayDict['hour'+i].push(41)
                }else if (indvDayDict["hour"+i][j].includes("מסלטי ויקי")){
                    finalDayDict['hour'+i].push(42)
                }
                else{
                    console.log(indvDayDict["hour"+i][j]);
                }
            }
     }
  }

    console.log(finalDayDict)
}







class Week {
  constructor(sunday, monday, tuesday, wednesday, thursday, friday){
    this.sunday = sunday;
    this.monday = monday;
    this.tuesday = tuesday;
    this.wednesday = wednesday;
    this.thursday = thursday;
    this.friday = friday;
  }
}

class Day{
  constructor(dayDictionary){
    this.dayDictionary = dayDictionary;
  }

  setDayDict(dayDictionary){
    this.dayDictionary = dayDictionary;
  }
}



let sunday = new Day()












$("#updateBtn").css({
//   "float":"right",
  "position": "absolute",
  "border": "5px solid white",
  "text-align": "center",
  "cursor": "pointer",
  "padding": "0px 16px",
  "border-radius": "2px",
  "min-width": "80px",
  "height": "32px",
  "background-color": "rgb(0, 120, 212)",
  "color": "rgb(255, 255, 255)",
  "font-size": "14px",
  "font-weight": "400",
  "box-sizing": "border-box",
  "border": "1px solid rgb(0, 120, 212)",
  "margin":"40px",
  "z-index":"10"
});



document.getElementById("updateBtn").onclick = update;
