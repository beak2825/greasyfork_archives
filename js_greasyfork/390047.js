// ==UserScript==
// @namespace com.hxb.custom
// @name     work_calc
// @description  work_calc_description 
// @version  13
// @grant    none
// @match    https://work.fzzqxf.com/*
// @downloadURL https://update.greasyfork.org/scripts/390047/work_calc.user.js
// @updateURL https://update.greasyfork.org/scripts/390047/work_calc.meta.js
// ==/UserScript==


window.onload = function(){
  
  var array = document.getElementsByClassName("bglbk1");
  var table = array[0];
  
  var trArray = table.getElementsByTagName("tr")
  
  //alert(trArray.length);
  
  //总加班时间(分钟)
  var totalOverTimeMinute = 0;
  //总调休时间（分钟）
  var totalRestMinute = 0;
  
  //计算的起止日期
  var startDate = null;
  var endDate = null;
  
  for (i = 0; i < trArray.length; i++) { 
    var tr = trArray[i];
	var tdArray = tr.getElementsByTagName("td");
	
	//加班时间的td
	var overTimeTd = tdArray[13];
	totalOverTimeMinute += getMinuteByStr(overTimeTd); 
	
	//调休时间的td
	var restTimeTd = tdArray[14];
	totalRestMinute += getMinuteByStr(restTimeTd);
	
	//给起止日期赋值
	if(i === 1){
	    endDate = tdArray[1].innerHTML;
	}else if(i === trArray.length-1){
	    startDate = tdArray[1].innerHTML;
	}
	
  }
  
  //总加班时间(小时)
  var totalOverTimeHour = parseInt(totalOverTimeMinute / 60);
  //总调休时间（小时）
  var totalRestHour = parseInt(totalRestMinute / 60);
  
  var availableRestHour = totalOverTimeHour - totalRestHour;

  alert(startDate+"  至 "+ endDate +"\n\n"+"单位：小时\n\n"+"总共加班时间： " + totalOverTimeHour + "\n"+"总共已调休时间： "+totalRestHour + "\n" + "总共剩下可用调休时间： "+ availableRestHour);
  
  
};



//根据时间数的标签来提取分钟数
function getMinuteByStr(timeLabel){
   var timeStr = timeLabel.innerHTML;
   
   if(timeStr == "00:00:00"){
       return 0;
   }else{
       var array = timeStr.split(":");
	   if(array.length == 3){
       
        var hour = parseInt(array[0]);
        if(hour >= 1){
          var minute = parseInt(array[1]);       
	        return hour * 60 + minute;
        }else{
          return 0;
        }

	   }else{
	      return 0;
	   }
   }
  
}


