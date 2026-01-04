// ==UserScript==
// @name 五子棋脚本原码
// @version 0.1
// @description 棋子棋盘都是纯CSS3画出来
// @namespace bandcamp-random-album
// @license 0BSD
// @match http*://bandcamp.com/*
// @include http*://bandcamp.com/*
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/439654/%E4%BA%94%E5%AD%90%E6%A3%8B%E8%84%9A%E6%9C%AC%E5%8E%9F%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/439654/%E4%BA%94%E5%AD%90%E6%A3%8B%E8%84%9A%E6%9C%AC%E5%8E%9F%E7%A0%81.meta.js
// ==/UserScript==
 
// JavaScript Document
var iBox;
var iArray;
var mouseBox;
var map;
var score;
var score2;
 
function addClass(object,className){
    var classString;
    if(document.all) classString=object.getAttribute("className");
	else classString=object.getAttribute("class");
	if(classString==null){
		if(document.all) object.setAttribute("className",className);
		else object.setAttribute("class",className);
	}
	else{
		classString+=" "+className;
		if(document.all) object.setAttribute("className",classString);
		else object.setAttribute("class",classString);
	}
}
 
function removeClass(object,className){
	var classString;
    if(document.all) classString=object.getAttribute("className");
	else classString=object.getAttribute("class");
	if(classString==null) return false;
	var classArray=classString.split(" ");
	for(var i=0;i<classArray.length;i++){
		if(classArray[i]!=className) continue;
		else{
			classArray.splice(i,1);
		}
	}
	classString=classArray.join(" ");
	if(document.all)object.setAttribute("className",classString);
	else object.setAttribute("class",classString);
}
 
function getElementsByClassName(className,root){
    var list=new Array();
	var temClass;
	if(!root)root=document.body;
	var array=root.getElementsByTagName("*");
	for(var i=0;i<array.length;i++){
	    if(document.all) temClass=array[i].getAttribute("className");
		else temClass=array[i].getAttribute("class");
		if(temClass==null)
			continue;
		var temList=temClass.split(" ");
		for(var j=0;j<temList.length;j++){
			if(temList[j]==className){ 
				list.push(array[i]);
			}
		}
	}
	return list;
}
 
function repeatCheck(checkList){
    for(var i=0;i<checkList.length;i++)
		for(var j=i+1;j<checkList.length;j++)
           if(checkList[i]===checkList[j]) checkList.splice(j,1);
	return checkList;
}
 
function getElement(string,rootArray){
    if(!rootArray){
		rootArray=new Array();
		rootArray[0]=document.body;
	}
	var temArray=string.split(" ");
	if(temArray.length==1){
	    var returnList=new Array();
		string=temArray[0];
	    while(rootArray.length){
			if(string.match(/^\#{1}/)){
				var temId=string.replace(/^\#{1}/,"");
				returnList.push(document.getElementById(temId));
			}
			else if(string.match(/^\.{1}/)){
				var temClass=string.replace(/^\.{1}/,"");
				var classList=getElementsByClassName(temClass,rootArray[0]);
				for(var i=0;i<classList.length;i++){
					returnList.push(classList[i]);
				}
			}
			else{
				var obj=rootArray[0].getElementsByTagName(string);
				if(obj) for(var i=0;i<obj.length;i++) returnList.push(obj[i]);
			}
			rootArray.shift();
		}
		
		return repeatCheck(returnList);
	}
	else{
	    var childArray=new Array();
		for(var i=0;i<rootArray.length;i++){
		        var arr=new Array(rootArray[i]);
				childArray=childArray.concat(getElement(temArray[0],arr));
			}
		if(temArray.length>1){
			temArray.shift();
			string=temArray.join(" ");
			return getElement(string,childArray);
		}
	}
}
 
function createMap(){
	var chessboard=document.createElement("table");
	iArray=new Array();
	chessboard.className="chessboard_bg";
	chessboard.cellPadding=0;
	chessboard.cellSpacing=0;
	var row,cell;
	for(var i=0;i<14;i++){
		row=chessboard.insertRow(-1);
		for(var j=0;j<14;j++){
			cell=row.insertCell(-1);
			cell.innerHTML=i+"*"+j;
		}
	}
	
	iBox=document.createElement("div");
	iBox.className="iBox";
	for(var i=0;i<15;i++)
		for(var j=0;j<15;j++){
			var iObj=document.createElement("i");
			iObj.appendChild(document.createTextNode(i*15+j));
			iObj.style.left=j*41+1+"px";
			iObj.style.top=i*41+1+"px";
			iBox.appendChild(iObj);
			iArray.push(iObj);
	}
	
	chessboardBox.appendChild(chessboard);
	chessboardBox.appendChild(iBox);
}
 
function bindEvent(){
	for(var i=0;i<iArray.length;i++){
		iArray[i].index=i;
		iArray[i].onclick=function(){
			createPiece(iArray[this.index],0);
			setScore();
			playChess();
		}
		iArray[i].onmouseover=function(){
			mouseOverTips(iArray[this.index]);
		}
		iArray[i].onmouseout=function(){
			clearTips(iArray[this.index]);
		}
	}
}
 
function createPiece(obj,num){
	var objLeft=parseInt(obj.style.left);
	var objTop=parseInt(obj.style.top);
	var num10=parseInt(obj.innerHTML/15);
	var num1=parseInt(obj.innerHTML%15);
	var pieceObj=document.createElement("div");
	
	addClass(pieceObj,"piece");
	if(num==0){ addClass(pieceObj,"black"); map[num10][num1]=0;}
	else if(num==1){ addClass(pieceObj,"white"); map[num10][num1]=1;}
	
	pieceObj.style.left=objLeft+12+"px";
	pieceObj.style.top=objTop+12+"px";
	
	pieceObj.appendChild(document.createElement("i"));
	chessboardBox.appendChild(pieceObj);
	
}
 
function startGame(){
	bindEvent();
	init();
}
 
function init(){
	map=new Array();
	score=new Array();
	score2=new Array();
	for(var i=0;i<15;i++){
	    map[i]=new Array();
		score[i]=new Array();
		score2[i]=new Array();
		for(var j=0;j<15;j++){
			map[i][j]=-1;
			score[i][j]=0;
			score2[i][j]=0;
		}
	}
	
}
 
function mouseOverTips(obj){
	var objLeft=parseInt(obj.style.left);
	var objTop=parseInt(obj.style.top);
	if(!mouseBox){
		mouseBox=document.createElement("div");
		addClass(mouseBox,"mouseBox");
		for(var i=0;i<4;i++){
			var iObj=document.createElement("i");
			addClass(iObj,"mouseP");
			switch(i){
			case 0:	addClass(iObj,"mouseLT"); break;
			case 1:	addClass(iObj,"mouseRT"); break;
			case 2:	addClass(iObj,"mouseLB"); break;
			case 3:	addClass(iObj,"mouseRB"); break;
			default: break;
			}
			mouseBox.appendChild(iObj);
		}
		chessboardBox.appendChild(mouseBox);
	}
	mouseBox.style.display="block";
	mouseBox.style.left=objLeft+9+"px";
	mouseBox.style.top=objTop+9+"px";
}
 
function clearTips(){
    mouseBox.style.display="none";
}
 
function playChess(){
	var num=1;
	var ScoreList=new Array();
	var ScoreList2=new Array();
	ScoreList[0]=0;
	ScoreList2[0]=0;
	
	for(var i=0;i<score.length;i++)
		for(var j=0;j<score[i].length;j++){
			if(ScoreList[0]<score[i][j]){
				ScoreList.unshift(score[i][j]);
			}
			if(ScoreList2[0]<score2[i][j]){
				ScoreList2.unshift(score2[i][j]);
			}
		}
		
	
	var maxArray=getMaxArray(ScoreList,ScoreList2);
	
		
	if(maxArray.length==1) createPiece(maxArray[0],num);
	else if(maxArray.length>1) createPiece(maxArray[parseInt(Math.random()*maxArray.length)],num);
	
	setScore();
 
}
// Downloads By http://www.veryhuo.com
function getMaxArray(ScoreList,ScoreList2){
	
	var maxArray=new Array();
	for(var i=0;i<score.length;i++)
		for(var j=0;j<score[i].length;j++){
			if(ScoreList2[0]>=ScoreList[0]){
				if(ScoreList2[0]==score2[i][j]){
					maxArray.push(iArray[i*15+j]);
				}
			}
			else if(ScoreList2[0]<ScoreList[0]){
				if(ScoreList[0]==score[i][j]){
					maxArray.push(iArray[i*15+j]);
				}
			}
		}
	
		if(ScoreList2[0]<ScoreList[0])
		maxArray=checkArray(maxArray);
		
	if(maxArray.length>0){
	return maxArray;}
	else {
		if(ScoreList2[0]>=ScoreList[0]){
			ScoreList2.shift();
			return getMaxArray(ScoreList,ScoreList2);
		}
		else if(ScoreList2[0]<ScoreList[0]){
			ScoreList.shift();
			return getMaxArray(ScoreList,ScoreList2);
		}
	}
}
 
function setScore(){
	var num=0;
	var defenseCount=0;
	var attackCount=0;
	
	if(num==0){ var num2=1;}
	else{ var num2=0;}
	
	for(var i=0;i<15;i++)
		for(var j=0;j<15;j++){
			score[i][j]=0;
			score2[i][j]=0;
		}
		
	for(var i=0;i<15;i++)
		for(var j=0;j<15;j++){//整个棋盘检测
			if(map[i][j]==-1){
				for(var l=0;l<4;l++){//方向检测
					
					for(var m=-4;m<=0;m++){
						defenseCount=0; attackCount=0;
						for(var k=m;k<m+5;k++){//同行检测
						    var k2=k3=k;
							if(l%4==0) k2=0;
							else if(l%4==2) k3=0;
							else if(l%4==3) k3=-k2;
							
							if(map[i+k2]){
								if(map[i+k2][j+k3]==num) defenseCount++;
								else if(map[i+k2][j+k3]==num2) {attackCount++;}
							}
							
						}
						switch (defenseCount){
							case 0: {if(0>score[i][j]) score[i][j]=0;break;}
							case 1: {if(100>score[i][j]) score[i][j]=100;break;}
							case 2: {if(200>score[i][j]) score[i][j]=200;break;}
							case 3: {if(300>score[i][j]) score[i][j]=300;break;}
							case 4: {if(400>score[i][j]) score[i][j]=400;break;}
							default:break;
						}
						
						switch (attackCount){
							case 0: {if(0>score2[i][j]) score2[i][j]=0;break;}
							case 1: {if(100>score2[i][j]) score2[i][j]=100;break;}
							case 2: {if(200>score2[i][j]) score2[i][j]=200;break;}
							case 3: {if(300>score2[i][j]) score2[i][j]=300;break;}
							case 4: {if(400>score2[i][j]) score2[i][j]=400;break;}
							default:break;
						}
					}
					
					
				}
				
				
			}
		}
	sideCheck();
	
	
}
 
function checkArray(maxArray){
	var num10;
	var num1;
	var temArray=new Array();
	var temArray2=new Array();
	
	var num=0;
	if(num==0){var num2=1;}
	else var num2=0;
	
	for(var i=0;i<maxArray.length;i++){
		
		num10=parseInt(maxArray[i].innerHTML/15);
		num1=maxArray[i].innerHTML%15;
		
		var blackCount=new Array();
		var whiteCount=new Array();
		
		for(var j=0;j<9;j++){
			blackCount[j]=0;
			whiteCount[j]=0;
		}
	
		for(var l=0;l<9;l++){
			if(l==4) continue;
			for(var k=1;k<=4;k++){
				var k2=k;
				var k3=k;
				if(parseInt(l/3)==0) k2=-k;
				else if(parseInt(l/3)==1) k2=0;
				
				if(l%3==0) k3=-k;
				else if(l%3==1) k3=0;
				
				if(map[num10+k2]){
					if(map[num10+k2][num1+k3]==num){
						blackCount[l]+=1;
					}
					else if(map[num10+k2][num1+k3]==num2){
						whiteCount[l]+=1;
					}
				}
			}
			
		}
		
		var blackNum=0; var numArray=new Array();
		
		for(var j=0;j<9;j++){
			if(blackNum<blackCount[j]){ blackNum=blackCount[j];}
		}
		
		for(var j=0;j<9;j++){
			if(blackNum==blackCount[j]&&whiteCount[j]==0){  temArray.push(maxArray[i]);}
			if(blackNum==blackCount[j]&&whiteCount[j]==1){
				
				for(var l=0;l<9;l++){
					if(l==4) continue;
					k2=4;
					k3=4;
 
					if(parseInt(l/3)==0) k2=-4;
					else if(parseInt(l/3)==1) k2=0;
					
					if(l%3==0) k3=-4;
					else if(l%3==1) k3=0;
					
					if(map[num10+k2]){
						if(map[num10+k2][num1+k3]==num2){
							temArray2.push(maxArray[i]);
						}
					}
					
				}
				
			}
		}
		
		
		
	}
	
	if(temArray.length==0){
		temArray=temArray2;
	}
	
	return temArray;
}
 
function sideCheck(){
	var num=0;
	
	if(num==0) var num2=1;
	else var num2=0;
	
	for(var i=0;i<15;i++)
		for(var j=0;j<15;j++){
			if(map[i][j]==num||map[i][j]==num2){
				for(var l=0;l<9;l++){
					if(l==4) continue;
					for(var k=1;k<=4;k++){
						var k2=k;
						var k3=k;
						if(parseInt(l/3)==0) k2=-k;
						else if(parseInt(l/3)==1) k2=0;
						
						if(l%3==0) k3=-k;
						else if(l%3==1) k3=0;
						
						if(map[i+k2]){
							if(map[i+k2][j+k3]==-1){
								if(map[i][j]==num)
									score[i+k2][j+k3]+=4-k;
								else{
									score2[i+k2][j+k3]+=4-k;
								}
							}
						}
					}
				}
			}
			
			
		}
		
		
}