// ==UserScript==
// @name        xperteleven Förändringsrapporter 4.0 (FIREFOX)
// @include     *www.xperteleven.com/changeReports.aspx?dh=*&TeamID=*
// @include			*www.xperteleven.com/transfers.aspx*
// @grant       GM_xmlhttpRequest
// @description holla!
// @version 0.0.1.20140714093814
// @namespace https://greasyfork.org/users/3462
// @downloadURL https://update.greasyfork.org/scripts/3284/xperteleven%20F%C3%B6r%C3%A4ndringsrapporter%2040%20%28FIREFOX%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3284/xperteleven%20F%C3%B6r%C3%A4ndringsrapporter%2040%20%28FIREFOX%29.meta.js
// ==/UserScript==

function copyarray(arrayin) {
	
	var arr = [];
	for(var i = 0; i < arrayin.length; i++) arr.push(arrayin[i]);
	return arr;
}

function printvalues() {

	for(var i=0, len=localStorage.length; i<len; i++) {

		var key = localStorage.key(i);
		var value = localStorage[key];
		console.log(key + " => " + value);
	}
}

function twodeci(inpara) {
	
	return Math.round(inpara*100)/100;
}

function inbounds(low, high, ref) {
	
	return Math.round(low) === ref || Math.round(high) === ref;
}

function supports_html5_storage() {
		
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}


function drawbar(lowest, highest, visible) {
	
	var lowbound=Math.round((lowest+0.5-visible)*100);
	var highbound=Math.round((highest+0.5-visible)*100);

	var parent=document.getElementById("mynode2");

	for(var iii=1000;iii<=3000;iii+=1000){
		for(var yyy=0;yyy<100;yyy++)
		{
			var newElement = document.createElement('div');
			newElement.id = yyy;
			newElement.style.backgroundColor = "#cccccc";
			newElement.style.marginLeft = "1px";
			newElement.style.width = "3px";
			newElement.style.height = "15px";
			newElement.style.cssFloat = "left";
			if(yyy >= lowbound && yyy <= highbound)
				newElement.style.backgroundColor = "green";
			if(iii !== 2000)
				newElement.style.backgroundColor = "#F0F0F0";
			if(yyy === 49 && iii !== 2000)
				newElement.style.borderRight = "black 1px solid";
			if(yyy === 49 && iii === 2000)
				newElement.style.borderRight = "#F0F0F0 1px solid";
			if(yyy === 50)
				newElement.style.marginLeft = "0";

			parent.appendChild(newElement);
		}
		newElement = document.createElement('div');
		newElement.style.clear = "both";	
		parent.appendChild(newElement);
	}
}

function dotable(mini, maxi) {
	
	var string = "";
	string += "<table style='border-collapse: collapse;'><tr><th>Min</th><th></th><th>Max</th></tr>";
	string += "<tr><td>" + mini.toFixed(2) + "</td><td>-</td><td>" + maxi.toFixed(2) + "</td></tr></table>";
	return string;
}

function calculate() {
    
	var uglystring = document.getElementsByClassName('tableinsection')[1].innerHTML;
	var arr = uglystring.split('<span nowrap="" title="');

	for(var i = 1; i < arr.length; i++)
	{
		var mess = arr[i].replace( /<\/?[^>]+(>|$)/g, "" );
		mess = mess.replace( '">', '' );
		mess = mess.replace( /\s+/g, ' ' );
		var vals = mess.split(' ');
		skills.push( parseFloat(vals[0]) );
		percentages.push( parseFloat( vals[1].replace('%', '') ) );
	}

	if(skills.length > 0)
	{
		if(supports_html5_storage())
		{
			var dropdownbox = document.getElementById("ctl00_cphMain_dpdPlayers");
			var playerid = dropdownbox.options[dropdownbox.selectedIndex].value;

			var startskill = parseInt(localStorage.getItem(playerid));
			//alert("Skill at purchase: " + startskill + "\nFirst shown skill here: " + firstskill);
			if( isNaN(startskill) || Math.abs(firstskill-startskill) > 2 )
			{
				//Do nothing, not a valid startskill
			}
			else
			{
				skills.push(startskill);
			}
		}
		
		

		//CALC STUFF!!!
		
		/*var newNode = document.createElement("div");
		newNode.id = "mynode2";
		var refNode = document.getElementById('ctl00_cphMain_dpdPlayers');
		refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
		document.getElementById('mynode2').style.cssText = 'background-color: #F0F0F0; border: 1pt solid #DDDDDD; font-family: verdana; font-size: 8pt; padding: 5px; margin-top: 5px;';

		var validresults = new Array();
		var nrofvalidresults = 0;
		for(bb=0; bb<results.length;bb++)
		{
			if(results[bb][1] !== 100)
			{
				nrofvalidresults++;
				validresults.push(results[bb]);
			}
		}
		
		if(nrofvalidresults === 1)
		{
			var r=validresults[0];
			document.getElementById('mynode2').innerHTML += r[1].toFixed(2) + " - " + r[2].toFixed(2) + "<br>";
			drawbar(r[1], r[2], currentskill);
			document.getElementById('mynode2').innerHTML += "<i><span style='color: #666666;'>Spelarens skicklighet före första uppdateringen var <b>" + r[0] + "</b>  &nbsp;(" + r[3].toFixed(2) + " - " + r[4].toFixed(2) + ")</i>";
		}
		if(nrofvalidresults === 2)
		{
			if(validresults[0][1] === validresults[1][1] && validresults[0][2] === validresults[1][2])
			{
				var r=validresults[0];
				document.getElementById('mynode2').innerHTML += r[1].toFixed(2) + " - " + r[2].toFixed(2) + "<br>";
				drawbar(r[1], r[2], currentskill);
				document.getElementById('mynode2').innerHTML += "<br>";
				document.getElementById('mynode2').innerHTML += "<i><span style='color: #666666;'>Spelarens skicklighet före första uppdateringen var <b>" + validresults[0][0] + "</b> eller <b>" + validresults[1][0] + "</b>  &nbsp;(" + validresults[0][3].toFixed(2) + " - " + validresults[1][4].toFixed(2) + ")<br>(spelar ingen roll för beräkningen)</span></i>";
			}
			else
			{
				for(xx=0; xx<nrofvalidresults;xx++)
				{
					var r=validresults[xx];
					document.getElementById('mynode2').innerHTML += "Om spelarens skicklighet före första uppdateringen var <b>" + r[0] + "</b>: " + r[1].toFixed(2) + " - " + r[2].toFixed(2) + "<br>";
					drawbar(r[1], r[2], currentskill);
					document.getElementById('mynode2').innerHTML += "<br>";
				}
				document.getElementById('mynode2').innerHTML += "<i><span style='color: #666666;'>Spelarens skicklighet före första uppdateringen var <b>" + validresults[0][0] + "</b> eller <b>"+ validresults[1][0] + "</b>  &nbsp;(" + validresults[0][3].toFixed(2) + " - " + validresults[1][4].toFixed(2) + ")</i>";
			}
		}
		if(nrofvalidresults === 0)
		{
			document.getElementById('mynode2').innerHTML += "<p>Beräkningen misslyckades!</p>";
		}
		*/

	}
}
	
function readvalues() {

	var table = document.getElementById("ctl00_cphMain_dgTransfers");
	var rows = table.querySelectorAll(".ItemStyleEcon, .AlternatingItemStyleEcon");

	for(i=0; i<rows.length; i++)
	{
		var link = rows[i].getElementsByTagName("td")[1].getElementsByTagName("a")[0].getAttribute("href");
		var linksplit = link.split("playerid=");
		var linksplit1 = linksplit[1].split("&TeamID=");
		var id = linksplit1[0];

		var skill = rows[i].getElementsByTagName("td")[5].getElementsByTagName("span")[0].getAttribute("title");

		localStorage.setItem(id, skill);
	}
	
	var newNode = document.createElement("div");
	newNode.id = "mynode";
	var refNode = document.getElementById('ctl00_cphMain_dgTransfers');
	refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
	document.getElementById('mynode').style.cssText = 'background-color: #19A347; color: white; border: 1pt solid #DDDDDD; font-family: verdana; font-size: 8pt; padding: 5px; margin-top: 5px;'; 
	document.getElementById('mynode').innerHTML = "Spelarvärden inlästa! Tryck på \"Nästa\" för att läsa in fler (om knappen finns)";
}

function whatpage() {
	
	var header = document.getElementById("ctl00_cphMain_lblTitle");
	if(header != undefined) return "cr";
	else return "vals";
}

var skillHistory, skills, histories, percentages;

function calc() {
	
	//Init
	skills = new Array();
	histories = new Array();
	percentages = new Array();
	var result = false;
	var alertString = "";

	//Read vals from document
	var uglystring = document.getElementsByClassName('tableinsection')[1].innerHTML;
	var arr = uglystring.split('<span nowrap="" title="');
	for(var i = 1; i < arr.length; i++)
	{
		var mess = arr[i].replace( /<\/?[^>]+(>|$)/g, "" );
		mess = mess.replace( '">', '' );
		mess = mess.replace( /\s+/g, ' ' );
		var vals = mess.split(' ');
		skills.push( parseInt(vals[0]) );
		percentages.push( parseInt( vals[1].replace('%', '') ) );
	}

	//Calculate if array has values
	if(skills.length > 0) {

		//Add startskill if available
		if(supports_html5_storage()) {

			var firstskill = skills[skills.length-1];

			var dropdownbox = document.getElementById("ctl00_cphMain_dpdPlayers");
			var playerid = dropdownbox.options[dropdownbox.selectedIndex].value;

			var startskill = parseInt(localStorage.getItem(playerid));
			//alert("Skill at purchase: " + startskill + "\nFirst shown skill here: " + firstskill);
			if( isNaN(startskill) || Math.abs(firstskill-startskill) > 2 )
			{
				//Do nothing, not a valid startskill
			}
			else
			{
				skills.push(startskill);
			}
		}

		//for all possible current skill values
		for(var i = getMax(skills[0]); i >= getMin(skills[0]); i--)
		{
			//this isn't very tidy either. Ideally not keen on returning a value and setting
			//the global array, but I cba to write it another way
			skillHistory = new Array();
			//call the recursive function using the history of skill and changes
			if(check(i, 0))
			{
				histories.push(skillHistory);
				result = true;
			}
		}
		
		var newNode = document.createElement("div");
		newNode.id = "mynode2";
		var refNode = document.getElementById('ctl00_cphMain_dpdPlayers');
		refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
		document.getElementById('mynode2').style.cssText = 'background-color: #F0F0F0; border: 1pt solid #DDDDDD; font-family: verdana; font-size: 8pt; padding: 5px; margin-top: 5px;';

		//output the results
		if(result)
		{
			for(var j=0; j<histories.length; j++)
			{
				alertString = alertString + "\n" + histories[j][0] + " (" + formatString(histories[j]) + ")<br>";
			}
			document.getElementById('mynode2').innerHTML += "<p>" + alertString + "</p>";
		}
		else
		{
			document.getElementById('mynode2').innerHTML += "<p>Skill cannot be derived. Check the figures and try again.</p>";
		}
	}
}

//recursive function to do the legwork
function check(susNew, i) {
 //can't parse the data, so we stop and say OK - bit naff
 if(isNaN(skills[i+1]) || isNaN(percentages[i]))
  return true;

 var susOld;
 
 //get the skill range for the old skill value
 for(susOld = getMax(skills[i+1]); susOld >= getMin(skills[i+1]); susOld--)
 {
  //the old and new match with the percentage
  if(match(susNew, susOld, percentages[i]))
  {
   skillHistory[i] = susNew/10;
   skillHistory[i+1] = susOld/10;

   //debug
   //alert("Match: " + susNew + ", " + susOld + ", " + percentages[i] + "%, depth " + i);

   //can recurse deeper
   if(skills.length > i+2)
   {
    //may not match, so this allows checking of other values
    //note that we return here since we only need to check one valid path exists
    if(check(susOld, i+1))
     return true;
   }
   //reached the bottom. Good times.
   else
    return true;
  }
 }
 return false;
}

function getMax(skill) {
 //rounded even
 if(skill % 2 == 0)
  return (skill*10) + 5;
 //not rounded even
 else
  return (skill*10) + 4;
}

function getMin(skill) {
 //rounded even
 if(skill % 2 == 0)
  return (skill*10 - 5);
 //not rounded even
 else
  return (skill*10 - 4);
}

function match(newVal, oldVal, percentage) {
 //get x/y and turn into a percentage difference
 divisor = ((newVal / oldVal)-1) * 100;
 
 //eliminate floating point errors.
 divisor = divisor.toFixed(3);
 
 //I've added this as it looks like we round even
 //e.g. 80 to 90 is 12.5% but appears to display as 12
 if (roundEven(divisor) == percentage)
 {
  //debug
  //alert(newVal + ", " + oldVal + ", " + divisor);
  return true;
 }
 else
  return false;
}

function roundEven(val) {
 //get the base value
 var floorVal = Math.floor(val);
 
 //value = x.5 and x is even
 if(val - 0.5 == floorVal && floorVal%2 == 0)
  return floorVal;
 else
  return Math.round(val);
}

function formatString(arr) {
  var output;
  if(arr.length > 0)
  {
    var count = 1;
    output = arr[0].toString();

    while(count < arr.length)
    {
      output = output + ", " + arr[count].toString();
      count++;
    }
  }
  else
    output = "";

  return output;
}




window.onload = function() {
    
	if(whatpage() === "cr")
	{	
		calc();
	}
	else
	{
		readvalues();
		printvalues();
	}
};
