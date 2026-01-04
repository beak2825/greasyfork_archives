// ==UserScript==
// @name        NPS_RUSH
// @namespace   maskokot
// @include     https://tellus.*
// @version     1.01
// @grant       none
// @description:en NPS Script
// allow pasting
// @description NPS Script
// @downloadURL https://update.greasyfork.org/scripts/368127/NPS_RUSH.user.js
// @updateURL https://update.greasyfork.org/scripts/368127/NPS_RUSH.meta.js
// ==/UserScript==

function TT(name){ // check if the text is on the page to identify page
  return ( ( document.documentElement.textContent || document.documentElement.innerText ).indexOf(name) > -1 ) ;
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}


function getRandomDateInFormat(){ 
   var d = new Date();    
   d.setDate(d.getDate() - Math.floor((Math.random() * 5) +1 ));
  
   var m = d.getMonth()+1;
     if( m<10 ) { m = "0" + m }
   /*
   var mm;
   if( m==1) { mm="Jan" }
   if( m==2) { mm="Feb" }
   if( m==3) { mm="Mar" }
   if( m==4) { mm="Apr" }
   if( m==5) { mm="May" }
   if( m==6) { mm="Jun" }
   if( m==7) { mm="Jul" }
   if( m==8) { mm="Aug" }
   if( m==9) { mm="Sep" }
   if( m==10){ mm="Oct" }
   if( m==11){ mm="Nov" }
   if( m==12){ mm="Dec" }
     */
  
   var da = d.getDate();
   if( da<10 ) { da = "0" + da }
   // return da + " " + mm + " " + d.getFullYear(); 
  return d.getFullYear()+ "-" + m + "-" + da;
  
} 

function advancePage(){
   var e = document.getElementsByTagName("button");
   e[5].click();
}

function answerQuestionChoice(q,name,data){
   if ( TT(q) ) {           
     var qInputList = document.getElementsByName(name); // list of all inputs that ansver this question;

     for( var i = 0; i<data.length; i++){ 
       var roll = randomIntFromInterval(1,99);
       if ( data[i] > roll ) {
         qInputList[i].checked = true;
         return ;
       }       
     }     
   }
}

if ( (localStorage.Automatic!= undefined) && (localStorage.Automatic >0 ) ){
  
  // 01 Page **********************************************************************************************  
  if ( TT('When did you visit us?') ) {
    var e = document.getElementById("question_383874048");
    e.value = getRandomDateInFormat();
  }
  answerQuestionChoice('What time did you visit us?',"question_596738093",[0,30,30,30,30,100]); 
      
  // 02 Page **********************************************************************************************  
  answerQuestionChoice('What did you have when you visited us?',"question_934066950",[30,0,100]);
   
  // 03 Page **********************************************************************************************  
  answerQuestionChoice('Based on this visit, how likely or unlikely are you to recommend',"question_399727069",[0,0,0,0,0,0,0,0,0,10,100]);

  // 04 Page **********************************************************************************************  
  answerQuestionChoice('Overall, I was satisfied with my visit',"question_961881193_638104697",[0,0,0,5,100]);
  answerQuestionChoice('I found it good value for money',"question_961881193_720135844",[0,0,0,15,100]);
  answerQuestionChoice('I was satisfied with the service provided',"question_961881193_970348281",[0,0,0,0,100]);
  answerQuestionChoice('I was satisfied with the food quality',"question_961881193_815689542",[0,0,0,5,100]);
  answerQuestionChoice('I was satisfied with the drinks quality',"question_961881193_944709295",[0,0,0,15,100]);
  answerQuestionChoice('I enjoyed the atmosphere',"question_961881193_145713622",[0,0,0,0,100]);
  answerQuestionChoice('The outside was welcoming and attractive',"question_961881193_431303323",[0,0,0,15,100]);
  answerQuestionChoice('The inside was clean and well maintained',"question_961881193_402933923",[0,0,0,15,100]);
  answerQuestionChoice('I was satisfied with the cleanliness of the toilets',"question_961881193_408656790",[0,0,0,15,100]);

   
  // 06 Page **********************************************************************************************  
  answerQuestionChoice('I received a warm and genuine welcome',"question_630553448_325072735",[0,0,0,3,100]);
  answerQuestionChoice('The team were friendly',"question_630553448_510499303",[0,0,0,4,100]);
  answerQuestionChoice('The team were clearly enjoying their jobs',"question_630553448_871677261",[0,0,0,5,100]);
  answerQuestionChoice('The team were knowledgeable about the food',"question_630553448_567531845",[0,0,0,5,100]);
  answerQuestionChoice('The team were knowledgeable about the drinks',"question_630553448_536887101",[0,0,0,5,100]);
  answerQuestionChoice('I was able to pay quickly when ready',"question_630553448_536752220",[0,0,0,5,100]);
  answerQuestionChoice('The team made me feel like a valued guest',"question_630553448_501580861",[0,0,0,5,100]);
  answerQuestionChoice('There were enough staff available to suit my needs',"question_630553448_707354702",[0,0,0,5,100]);
  

   
  // 07 Page **********************************************************************************************  
  answerQuestionChoice('There was a good selection of food on the menu',"question_899355469_864761913",[0,0,0,5,100]);
  answerQuestionChoice('My food was served in an appropriate time',"question_899355469_226664545",[0,0,0,5,100]);
  answerQuestionChoice('I was satisfied with the portion size of the food',"question_899355469_618416511",[0,0,0,5,100]);
  answerQuestionChoice('I was impressed with the presentation of the food',"question_899355469_115148838",[0,0,0,5,100]);
  answerQuestionChoice('The food that I purchased was good value for money',"question_899355469_257814857",[0,0,0,10,100]);
  answerQuestionChoice('The food items that I wanted were available',"question_899355469_579379873",[0,0,0,5,100]);


  // 07 Page **********************************************************************************************  
  answerQuestionChoice('During your visit, did you look at the printed drinks menu before ordering',"question_864044382",[60,0,100]);
  answerQuestionChoice('There was a good range of drinks to choose from',"question_135312497_914174378",[0,0,0,10,100]);
  answerQuestionChoice('The team gave me guidance when ordering my drink',"question_135312497_734156382",[0,0,0,5,100]);
  answerQuestionChoice('My drinks were served in an appropriate amount of time',"question_135312497_103107351",[0,0,0,10,100]);
  answerQuestionChoice('The drinks that I purchased were good value for money',"question_135312497_465183147",[0,0,0,30,100]);
  
  // 08 Page **********************************************************************************************  
  answerQuestionChoice('We always like to recognise our team when they’ve done a great job.',"question_610181768",[0,100]);

  // 09 Page **********************************************************************************************  
  answerQuestionChoice('How often do you visit',"question_656678743",[70,10,20,30,100]);
  
   
  // 10 Page **********************************************************************************************
  if ( TT('Thank you, please press the button below to finish the survey.') ) {
    localStorage.Automatic = 0;
    var e = document.getElementsByTagName("button");
    e[2].click();
  }
  
  // ERROR ! **********************************************************************************************
  if ( TT('Sorry, one or more required questions have not been completed. Please complete them and try again.') ) {
    localStorage.Automatic = 0;
     if (confirm('Are you sure you want to go Automatic ?')) {
        localStorage.Automatic = 1;      
     }
  }
  
  
  var deldel = randomIntFromInterval(3000,10000);
  setTimeout( function(){ advancePage(); }, deldel);

  
}else{
  
   // 00 Page **********************************************************************************************    
  if ( TT('Your views and opinions will be used to ensure we continue to provide you with a great pub experience.') ) {      
     //if (confirm('Are you sure you want to go Automatic ?')) {
        localStorage.Automatic = 1;  
        setTimeout( function(){ advancePage(); },4000);          
     //} else {
     //   localStorage.Automatic = 0;  
     //} 
  }     
}


// First Page