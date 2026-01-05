// ==UserScript==
// @name        /HG/ Ayumi's script 2nd gen
// @namespace   brantsteele
// @include     http://brantsteele.net/hungergames/*
// @version     3
// @grant       none
// @description:en layout for brantsteele
// @description layout for brantsteele
// @downloadURL https://update.greasyfork.org/scripts/27359/HG%20Ayumi%27s%20script%202nd%20gen.user.js
// @updateURL https://update.greasyfork.org/scripts/27359/HG%20Ayumi%27s%20script%202nd%20gen.meta.js
// ==/UserScript==





//background- Link to the background.
//backgroundResize- if true, fill by x-axis.
//headerBackground- Background of header.
//headerFontColor- Font color of header.
//foreground- Color of panels. 
//foreborder- Panels borders.
//textborder- Borders of text.
//background = "url('https://i.ytimg.com/vi/SLtM4OObCp4/maxresdefault.jpg')";
background = "url('http://seoblognik.ru/wp-content/uploads/2016/03/fon-dlja-tvittera-3.jpg')";
backgroundResize = true;
headerBackground = "rgba(0, 80, 150, 0.8)";
headerFontColor = "rgba(255, 208, 40, 1.0)";
headerFontBorder = "-1px -1px 1px rgb(0, 0, 0), 1px -1px 1px rgb(0, 0, 0), -1px 1px 1px rgb(0, 0, 0), 1px 1px 1px rgb(0, 0, 0)";
foreground =  "rgba(00, 36, 80, 0.9) none repeat scroll 0% 0%";
foreborder = "border: 1px solid rgba(0, 0, 0, 1.0)";   
textborder = "-1px -1px 1px rgb(0, 0, 0), 1px -1px 1px rgb(0, 0, 0), -1px 1px 1px rgb(0, 0, 0), 1px 1px 1px rgb(0, 0, 0)";
imageborder = "2px solid black";

///
///
///

//Not recoment to go down.

///
///
///








//inb4: i know im bad coder;







//get url of page
currentUrl = window.location.href;
var logoimg = document.getElementsByTagName('img')[0]
document.getElementById("header").remove();
document.getElementById("middle").remove();
document.getElementById("sideLeft").remove();
document.getElementById("sideLeft2").remove();
document.getElementById("sideLeft3").remove();




document.body.style.backgroundImage = background;
if(backgroundResize){
	document.body.style.backgroundSize = "100% auto";
}
var titlelink = document.styleSheets[0].cssRules[54];
titlelink.style.background = headerBackground;
titlelink.style.color = headerFontColor;
titlelink.style.textShadow = headerFontBorder;



logoimg.style.float = "left"
logoimg.style.width = "auto"
logoimg.style.height = "150px"
//logoimg.style.border = "1px solid white"


document.getElementById("wrapper").style.minWidth = "1350px"

document.getElementById("seasonHolder").style.top = "0px";
document.getElementById("seasonHolder").style.width = "auto"
document.getElementById("seasonHolder").style.left = "0px"

document.getElementsByTagName('div')[3].style.margin = "auto"
document.getElementsByTagName('div')[3].style.font = "50px Arial"
document.getElementsByTagName('div')[3].style.lineHeight = "150px"
document.getElementsByTagName('div')[3].style.width = "100%"
document.getElementsByTagName('div')[3].style.padding = "0px"
document.getElementsByTagName('div')[3].style.display = "inline-block"
document.getElementsByTagName('div')[3].appendChild(logoimg)
document.getElementsByTagName('div')[3].style.background = ""



document.getElementById("titleHolder").style.top = "0px"
document.getElementById("titleHolder").style.left = "0px"
document.getElementById("titleHolder").style.width = "300px"
document.getElementById("titleHolder").style.height = "auto"
document.getElementById("titleHolder").style.background = "transparent"
document.getElementById("titleHolder").style.float = ""
document.getElementsByTagName('div')[4].style.display = "flex"



document.getElementsByTagName('div')[6].style.display = "inline-block"
document.getElementsByTagName('div')[6].style.width = "300px"
document.getElementsByTagName('div')[6].style.height = "100%"
document.getElementsByTagName('div')[6].style.margin = "auto"
document.getElementsByTagName("div")[6].style.font = "34px Arial"
document.getElementsByTagName("div")[5].style.margin = "unset"
document.getElementsByTagName("div")[6].style.height = "inherit"
document.getElementsByTagName("div")[6].style.lineHeight = "60px"
document.getElementsByTagName("div")[6].style.padding = "unset"



document.getElementById("container").style.minWidth = "1300px"
document.getElementById("container").style.textAlign = "center"



document.getElementById("content").style.top = "80px"
document.getElementById("content").style.left = "0px"
document.getElementById("content").style.position = "relative"
document.getElementById("content").style.float = "unset"
document.getElementById("content").style.verticalAlign = "top"
document.getElementById("content").style.margin = "10px, 0px"
document.getElementById("content").style.textShadow = textborder
document.getElementById("content").style.minWidth = "1300px"
document.getElementById("content").style.display = "flex"
document.getElementById("content").style.flexWrap = "wrap"
document.getElementById("content").style.justifyContent = "space-between"


var info = document.getElementById("titleHolder").cloneNode(true)
info.style.height = "auto"
info.style.width = "100%"
document.getElementsByTagName('div')[4].appendChild(info)


var proceedbutton = document.getElementById("titleHolder").cloneNode(true)
document.getElementsByTagName('div')[4].appendChild(proceedbutton)


var playerDiv1 = document.getElementById("content");
playerDiv1.name = "playerDiv1"


for(i = 0; i < playerDiv1.getElementsByTagName('table').length; i++)
    {
      
        playerDiv1.getElementsByTagName('table')[i].style.backgroundColor = "transparent"
        
    }


for(i = 0; i < playerDiv1.getElementsByTagName('img').length; i++)
    {
      
        playerDiv1.getElementsByTagName('img')[i].style.border = imageborder;
        playerDiv1.getElementsByTagName('img')[i].style.borderRadius = "20px"

    }


//sssss


var brquantity = playerDiv1.getElementsByTagName('br');
var brreleatedtoevents;



var eventquantity = Math.round(brquantity.length/3);



var lines = document.getElementById("content").innerHTML.split(/<br>/);
var fullListOfEvents="";


for (i = 0; i < lines.length; i++) {
    fullListOfEvents += lines[i] + "<br>";
}




var leftborder = 0;
var halfoflines = 0;
var rightborder = 0;


var deleted =""
while (lines[0].includes('table') == false) {   //Вот тут удаляю предисловие
    deleted+=lines.splice(0, 1)
}
if (deleted == "")
{
    deleted = "Nothing special."
    if(currentUrl.includes('winner')){
        deleted = "Congratulations!"
    }
    
}
info.innerHTML = '<div id="title">' + deleted + '</div>'
document.getElementsByTagName('div')[8].style.display = "inline-block"
document.getElementsByTagName('div')[8].style.width = "inherit"
document.getElementsByTagName('div')[8].style.padding = "0px"
document.getElementsByTagName('div')[8].style.margin = "auto"
document.getElementsByTagName('div')[8].style.height = "auto"
document.getElementsByTagName('div')[8].style.font = "34px/60px Arial"


deleted = lines.splice(-1, 1)   //Вот тут удаляю Просид
proceedbutton.innerHTML = deleted
document.getElementsByTagName('a')[0].id = "title"
document.getElementsByTagName('a')[0].style.display = "inline-block"
document.getElementsByTagName('a')[0].style.margin = "auto"
document.getElementsByTagName('a')[0].style.height = "inherit"
document.getElementsByTagName('a')[0].style.width = "inherit"
document.getElementsByTagName('a')[0].style.padding = "0px"
document.getElementsByTagName('a')[0].style.font = "34px/60px Arial"


//====================================================================
if(currentUrl.includes('bloodbath')||
  currentUrl.includes('day')||
  currentUrl.includes('night')||
  currentUrl.includes('fallentributes')||
  currentUrl.includes('feast')||
  currentUrl.includes('arena')||
  currentUrl.includes('winner')){
//alert("True");


leftborder = 0;
rightborder = lines.length;
halfoflines = Math.round( (lines.length - leftborder)/2);    


var eventquant = 0;

for(i = 0; i < lines.length; i++){
  if(lines[i].includes('table'))
    {
      eventquant += 1;
    }
}


var cache = "";


var firsthalf = "";
var secondhalf = "";


for(var q = 0; q < eventquant-1; q++){


        if(lines[0].includes('table')){


        //Нарезание

        cache += lines[0];
        lines.splice(0,1);

        while( lines[0].includes('table') != true && lines.length > 0)
        {
          cache += lines[0];
          lines.splice(0,1);
        }


        //Оформление

        firsthalf +="<div style=\"margin: 2px;padding: 10px;" + foreborder + ";flex-grow: 1;  background:" + foreground + " \">";

        for(var j = 0; j < cache.length; j++)
        {
          firsthalf += cache[j];
        }

        firsthalf += "</div>";

        
        cache = "";
        }

}


firsthalf +="<div style=\"margin: 2px;padding: 10px;" + foreborder + "; flex-grow: 1;  background:" + foreground + " \">";

for(var q = 0; q < lines.length; q++){
    
    firsthalf += lines[q];
    
        
}

firsthalf += "</div>";


playerDiv1.innerHTML = firsthalf;

}


//=============================================================
if(currentUrl.includes('reaping'))
{
    document.getElementsByTagName("div")[6].outerHTML = "<a href=\"AdjustSize.php\">Adjust Size</a>";
    document.getElementsByTagName('a')[0].id = "title";
    document.getElementsByTagName('a')[0].style.display = "inline-block";
    document.getElementsByTagName('a')[0].style.margin = "auto";
    document.getElementsByTagName('a')[0].style.height = "inherit";
    document.getElementsByTagName('a')[0].style.width = "inherit";
    document.getElementsByTagName('a')[0].style.padding = "0px";
    document.getElementsByTagName('a')[0].style.font = "34px/60px Arial";



    document.getElementsByTagName("div")[7].outerHTML = "<a href=\"edit.php\">Edit Cast</a>";
    document.getElementsByTagName('a')[1].style.width = "inherit";
    document.getElementsByTagName('a')[1].id = "title";
    document.getElementsByTagName('a')[1].style.display = "inline-block";
    document.getElementsByTagName('a')[1].style.margin = "auto";
    document.getElementsByTagName('a')[1].style.height = "inherit";
    document.getElementsByTagName('a')[1].style.padding = "0px";
    document.getElementsByTagName('a')[1].style.font = "34px/60px Arial";


    //Очистка от мусора
    content = document.getElementById('content').innerHTML.split(/table>/);


    content.splice(content.length-1, 1);


    for (var i = 0; i < content.length; i++)
    {
        content[i] += "table>";
    }

    var desk = "";
    var toPaste = "";
    var imagesArray = document.getElementsByTagName('tr')[1];

    for (var i = 0; i < 1/*content.length*/; i++)
    {
        desk += content[i];
    }

    //desk += content[0];

    //ss

	var sef;
    var currentTG = 0;
	var tributesPerDistrict = document.getElementsByTagName('td')[0].colSpan;
	var tributesPerDistrictStr;
	var districtsPerTR = "";
	var skl = "";
	
	if(tributesPerDistrict == 2)
	{
		districtsPerTR = 3;
		tributesPerDistrictStr = "two";
	}
	
	if(tributesPerDistrict == 3)
	{
		districtsPerTR = 2;
		tributesPerDistrictStr = "three";
	}
	
	if(tributesPerDistrict == 4)
	{
		districtsPerTR = 1;
		tributesPerDistrictStr = "four";
	}
	
	skl = 12/districtsPerTR;
	
	
	for (var o = 0; o < skl; o++)
	{
		for (var i = 0; i < districtsPerTR; i++)
		{
			toPaste +="<div style=\"margin: 2px;padding: 10px; "+ foreborder + ";flex-grow: 1;  background:" + foreground + " \"><table class=\" " + tributesPerDistrictStr + " \" style=\"background-color: transparent;\"><tbody>";
			toPaste += "<tr>";

			sef = document.getElementsByTagName('td')[currentTG].outerHTML;
			toPaste += sef;
			toPaste += "</tr>";

			currentTG += districtsPerTR;
			if( i == 1)
			{
				currentTG += 1;

				if(districtsPerTR == 2)
				{
					currentTG += 1;
				}

			}
			if( i == 2)
			{
				currentTG += 2;
			}
			

			toPaste += "<tr>";

			for(var j = 0; j < tributesPerDistrict; j++){
				sef = document.getElementsByTagName('td')[currentTG].outerHTML;
				toPaste += sef;
				currentTG += 1;
			}
			


			toPaste += "</tr>";
			toPaste += "<tr>";


			if(districtsPerTR == 3)
			{
				currentTG += 4;//стало 3
			}

			if(districtsPerTR == 2)
			{
				currentTG += 3;
			}




			for(var j = 0; j < tributesPerDistrict; j++){
				sef = document.getElementsByTagName('td')[currentTG].outerHTML;
				toPaste += sef;
				currentTG += 1;
			}
			

			toPaste += "</tr>";
			toPaste += "</tbody></table></div>";


			if( i == 0 || i == 1 )
			{
				currentTG -= 10;
			}


			if( i == 1 && districtsPerTR==3)
			{
				currentTG -= 1;


			}







			if( i == 1 && districtsPerTR==2)
			{
				//currentTG -= 15;
				//должно быть 14

			}

		}
		
		if(districtsPerTR !=3)
		{
			currentTG = currentTG  +10;
		}




	}
    document.getElementById('content').innerHTML = toPaste;
    //document.getElementById('content').innerHTML = desk;
}


//=============================================================
if(currentUrl.includes('placements'))
{
	
	
	
	
	
	
	//Очистка от мусора
    content = document.getElementById('content').innerHTML.split(/table>/);
    content.splice(content.length-1, 1);
	
	
	for (var i = 0; i < content.length; i++)
    {
        content[i] += "table>";
    }
	
	var desk = " ";
	var toPaste = " ";
	var currentID = 0;
	var tributesInTable = document.getElementsByTagName("table")[0].rows[0].cells.length;
	
	
	
	
	for(var h = 0; h < content.length; h++)
	{
		desk += content[h];
	}
	
	
	
	for(var k = 0; k < content.length; k++)
	{
		for(var q = 0; q < tributesInTable; q++)
		{

			toPaste +="<div style=\"margin: 2px;padding: 10px; "+ foreborder + ";flex-grow: 1; background:" + foreground + " \">";

			
			toPaste +=" <table style=\"width: 100%;\">";
			toPaste +="	<tbody>"
			toPaste +="	<tr>"
			toPaste +="	<td>"
			sef = document.getElementsByTagName('td')[currentID].innerHTML;
			toPaste += sef;
			toPaste +=" </td>"
			toPaste +=" </tr>"
			toPaste +=" <tr>"
			toPaste +=" <td>"
			sef = document.getElementsByTagName('td')[currentID + tributesInTable ].innerHTML;
			toPaste += sef;
			toPaste +=" </td>"
			toPaste +=" </tr>"
			toPaste +=" </tbody>"
			toPaste +=" </table>"
			
			

			toPaste +="</div>";

			currentID += 1;
		}

		currentID += tributesInTable;


	}
	
	
	

	document.getElementById('content').innerHTML = toPaste;
	
	
}



