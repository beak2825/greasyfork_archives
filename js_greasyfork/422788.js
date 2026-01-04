// ==UserScript==
// @name        在线计算器
// @namespace   police
// @version     8.8.8
// @description 统计计算：可计算一系列数据的和，平均值  科学计算：可进行函数、对数运算，以及阶乘、幂运算
// @icon        http://www.makepic.net/uploads/2021030701/2021030701383520.png
// @match  *://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/422788/%E5%9C%A8%E7%BA%BF%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/422788/%E5%9C%A8%E7%BA%BF%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==
/*
Calculator Original Design https://dribbble.com/shots/3467471-DailyUI-004-Calculator

Hey there, this time i made an easy basic calculator to practice my first meeting with JS, i am so excited to learn more about it. 

ON DESKTOP: Click on the preview area to be able to use the keyboard and write faster. 

I seriously wanted to include this boy below and others that could had been awesome, but the project was spreading more than i thought, maybe for a next time. 

function thRootOf(n, x){
  if(n%2==0&&x<0){showingError=true; return 'InvalidInput'}
  if(x<0){x=-x; return Math.pow(x,1/n)*-1}
  return Math.pow(x,1/n);
}
*/
const panel = document.getElementsByClassName("mainPanel").item(0);
const secondPanel = document.getElementsByClassName("secondPanel").item(0);
const clearStorage = () => {mainArray=[]; secondPanel.innerHTML=''; specialExist=false; showingError=false}
var mainArray = [];
var showingResult = false, specialExist = false; showingError=false;
function globalKey(event){
  switch(event.key){
    case '1': global(document.getElementsByClassName('numOne').item(0)); break;
    case '2': global(document.getElementsByClassName('numTwo').item(0)); break;
    case '3': global(document.getElementsByClassName('numThree').item(0)); break;
    case '4': global(document.getElementsByClassName('numFour').item(0)); break;
    case '5': global(document.getElementsByClassName('numFive').item(0)); break;
    case '6': global(document.getElementsByClassName('numSix').item(0)); break;
    case '7': global(document.getElementsByClassName('numSeven').item(0)); break;
    case '8': global(document.getElementsByClassName('numEight').item(0)); break;
    case '9': global(document.getElementsByClassName('numNine').item(0)); break;
    case '0': global(document.getElementsByClassName('numZero').item(0)); break;
    case '.': dotChecker(); break;
    case '+': operators('+'); break;
    case '-': operators('-'); break;
    case '*': operators('\u00D7'); break;
    case '/': operators('\u00F7'); break;
    case 'Enter': result(); break;
    case 'Backspace': delElement(); break;
    case 'c': clearPanels(); break;
  }
}

function solver(){
  if(!specialExist){
    secondPanel.innerHTML+=panel.innerHTML;
    mainArray.push(panel.innerHTML);
  }
  specialExist=false;
  if(mainArray.length==1){return mainArray[0]}
  var result=0;
  while(mainArray.length!=1){
    var actualSign = mainArray[1];
    switch(actualSign){
      case '+':
        result=Number(mainArray[0])+Number(mainArray[2]); break;
      case '-':
        result=Number(mainArray[0])-Number(mainArray[2]); break;
      case '\u00D7':
        result=Number(mainArray[0])*Number(mainArray[2]); break;
      case '\u00F7':
        result=Number(mainArray[0])/Number(mainArray[2]); break;
      case 'Mod':
        result=Number(mainArray[0])%Number(mainArray[2]); break;
      default:
        showingError=true;
				result="NotAnOperator";
    }
    mainArray.splice(0, 3);
    mainArray.unshift(result);
  }
    return result;
  }

function voidDecimalChecker(){
  var tempArray = secondPanel.innerHTML.split(" ").map((value)=>{
    if(isNaN(Number(value))){return value;}
    return Number(value);
  })
  for(var i=1; i<tempArray.length; i+=2){
    tempArray.splice(i,0," ");
  }
  secondPanel.innerHTML=tempArray.toString().replace(/,/g,'');
}

function clearPanels(){
  if(panel.innerHTML=='0'&&secondPanel!=''){clearStorage()}
  else{panel.innerHTML='0', showingError=false;}
}

function delElement(){
  if(panel.innerHTML!='0'&&panel.innerHTML.length!=1){
    panel.innerHTML=panel.innerHTML.split('').slice(0, (panel.innerHTML.length - 1)).toString().replace(/,/g, '');
  } 
  else if (panel.innerHTML!='0') {panel.innerHTML='0'}
}

function dotChecker(){
  if(secondPanel.innerHTML.includes('=')){secondPanel.innerHTML=''}
  if(showingResult){clearPanels(); showingResult=false;}
  if(!panel.innerHTML.includes('.')){panel.innerHTML+='.'}
}

function changeSign(){
  if(showingResult){clearStorage()}
  if(panel.innerHTML!='0'){
    panel.innerHTML=Number(panel.innerHTML)*-1;
  }
}

function global(element){
  if(specialExist){secondPanel}
  if(secondPanel.innerHTML.includes('=')){secondPanel.innerHTML=''; mainArray=[]}
  if((element.innerHTML!='0'&&panel.innerHTML=='0')||showingResult==true){
    panel.innerHTML=element.innerHTML;
    showingResult=false;  
  }
  else if(panel.innerHTML!='0'){
    panel.innerHTML+=element.innerHTML;
  }
}

function result(){
  if(!secondPanel.innerHTML.includes('=')){
    panel.innerHTML=solver();
    secondPanel.innerHTML+=' = ';
    showingResult=true;
  }
}

function operators(operator){
  if(showingError){clearPanels();}
  if(secondPanel.innerHTML!=''&&!secondPanel.innerHTML.includes('=')){
    panel.innerHTML=solver();
    secondPanel.innerHTML+=' '+operator+' ';
    mainArray.push(operator);
    showingResult=true;
  }
  else{
    mainArray=[]; mainArray.push(panel.innerHTML);
    secondPanel.innerHTML=panel.innerHTML;
    voidDecimalChecker();
    secondPanel.innerHTML+=' '+operator+' '
    mainArray.push(operator);
    panel.innerHTML='0';
  }
}

function specialSolver(calc){
  if(!secondPanel.innerHTML.includes(' ')){clearStorage();}
  secondPanel.innerHTML.includes('=') ? (secondPanel.innerHTML=calc+'('+panel.innerHTML+')', mainArray=[]) : secondPanel.innerHTML+=calc+'('+panel.innerHTML+')';
  switch(calc){
    case 'fact': 
      const fact = num => num<0||!Number.isSafeInteger(Number(num)) ? (showingError=true,"NotSupported") : num<=1 ? 1 : num*fact(num-1);
      panel.innerHTML = fact(panel.innerHTML);
      break;
    case '1/':
      const frac1x = num => 1/num;
      panel.innerHTML = frac1x(panel.innerHTML);
      break;
    case 'sqr':
      panel.innerHTML = Math.pow(panel.innerHTML, 2)
    break;
    case '√':
      panel.innerHTML = Math.sqrt(panel.innerHTML);
    break;
    default: panel.innerHTML="No_a_special_operator_detected"; showingError=true;
  }
  mainArray.push(panel.innerHTML);
  showingResult=true;
  specialExist=true;
}