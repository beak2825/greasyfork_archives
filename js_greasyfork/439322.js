// ==UserScript==
// @name 球队年龄结构图
// @description   在球队概览界面显示球队的年龄结构柱状图 暂不兼容国家队页面详细插件
// @version       v1.3
// @author        魔力联
// @include         https://static.trophymanager.com/club/*/squad/*
// @include         https://www.trophymanager.com/club/*/squad/*
// @include         https://trophymanager.com/club/*/squad/*
// @include         https://fb.static.trophymanager.com/club/*/squad/*
// @include         https://fb.trophymanager.com/club/*/squad/*
// @include         https://fb.trophymanager.com/club/*/squad/*
// @include         https://trophymanager.com/national-teams/*/squad/
// @include         https://trophymanager.com/national-teams/*/squad/*
// 




// @grant none
// @namespace https://greasyfork.org/users/792929
// @downloadURL https://update.greasyfork.org/scripts/439322/%E7%90%83%E9%98%9F%E5%B9%B4%E9%BE%84%E7%BB%93%E6%9E%84%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/439322/%E7%90%83%E9%98%9F%E5%B9%B4%E9%BE%84%E7%BB%93%E6%9E%84%E5%9B%BE.meta.js
// ==/UserScript==


var a=document.getElementById("player_table").getElementsByTagName("tr")[5].getElementsByClassName("align_center")[1];

var b=document.getElementById("player_table").getElementsByTagName("tr");//[i].getElementsByClassName("normal")[0];


var i;

var c;
for (i=1;i<document.getElementById("player_table").getElementsByTagName("tr").length; i++){
	if (b[i].getElementsByClassName("normal")[0].innerHTML=="U21"){
		c=i;
	    break;
	}	
	else{
		c=-1;
	}
}	
var y15_18=0;
var y19_22=0;
var y23_26=0;
var y27_30=0;
var y31_34=0;
var y35_38=0;

for (i=1;i<document.getElementById("player_table").getElementsByTagName("tr").length; i++){
	if (i!=c){
		var yr=b[i].getElementsByClassName("align_center")[1].innerHTML;

		if (yr<19){
			y15_18+=1;
		}
		else if(yr<23){
			y19_22+=1;
		}
		else if(yr<27){
			y23_26+=1;
		}
		else if(yr<31){
			y27_30+=1;
		}
		else if(yr<35){
			y31_34+=1;
		}
		else if(yr<39){
			y35_38+=1;
		}
		
	}	

}	

var link=document.getElementsByClassName("large")[0].innerHTML;








var str="&nbsp;&nbsp;&nbsp;&nbsp;";
var str2="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
var column0='<div style="position:relative;left:170px;">'+link+'</div>';
var column =" <div class=\"content_menu\" align='center'>球队年龄结构图</div >";

var	column1  = '<canvas id=\"myCanvas\" width=\"30\" height="'+10*y15_18+'" style="border:2px solid #d3d3d3;    position:relative; left: 60px; 	top: 10px; 	background:#578229;	" />';
	column1 += '<canvas id=\"myCanvas\" width=\"30\" height="'+10*y19_22+'" style="border:2px solid #d3d3d3;  	position:relative; left: 75px; 	top: 10px;  background:#578229;    " />';
	column1 += '<canvas id=\"myCanvas\" width=\"30\" height="'+10*y23_26+'" style="border:2px solid #d3d3d3;  	position:relative; left: 90px; 	top: 10px;  background:#578229; 	" />';
	column1 += '<canvas id=\"myCanvas\" width=\"30\" height="'+10*y27_30+'" style="border:2px solid #d3d3d3;   	position:relative; left: 105px; 	top: 10px;  background:#578229;  	" />';
	column1 += '<canvas id=\"myCanvas\" width=\"30\" height="'+10*y31_34+'" style="border:2px solid #d3d3d3;   	position:relative; left: 120px; 	top: 10px;  background:#578229;    " />';
	column1 += '<canvas id=\"myCanvas\" width=\"30\" height="'+10*y35_38+'" style="border:2px solid #d3d3d3;   	position:relative; left: 135px; 	top: 10px;  background:#578229;    " />';

var column2  ='<div class="jqplot-axis jqplot-xaxis" style="position: relative; width: 300px; height: 40px; left: 0px; top: 10px;"><div style="position: relative; left: 180px; bottom: 0px;" class="jqplot-xaxis-label">年龄段</div><div class="jqplot-xaxis-tick" style="position: relative; left: 60px;">15-18'+str+'19-22'+str+'23-26'+str+'27-30'+str+'31-34'+str+'35-38 </div></div>'

var column3  ='<div class="jqplot-axis jqplot-xaxis" style="position: relative; width: 300px; height: 50px; left: 0px; top: 10px;"><div style="position: relative; left: 175px; bottom: 0px;" class="jqplot-xaxis-label">球员数目</div><div class="jqplot-xaxis-tick" style="position: relative; left: 58px;">'+y15_18+''+str2+''+y19_22+''+str2+''+y23_26+''+str2+''+y27_30+''+str2+''+y31_34+''+str2+''+y35_38+' </div></div>'



$(".column2_a").append(column0);
$(".column2_a").append(column);  
$(".column2_a").append(column1);
$(".column2_a").append(column2);
$(".column2_a").append(column3);
