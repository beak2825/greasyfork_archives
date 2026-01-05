// ==UserScript==
// @name        JCCC Library JSON
// @namespace   JCCC Library JSON
// @description Using https://library.jccc.edu/home/?newlibrary this script interacts with http://jccc.summon.serialssolutions.com/api/search to get all results as quickly as possible for a particular query. It can handle 1000 results total, because that is where the api cuts it off.
// @include     about:blank?jccclibrary
// @include     chrome://blank/?library
// @include     https://library.jccc.edu/home/?newlibrary
// @match       http://jccc.summon.serialssolutions.com/api/*
// @version     0.2
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/12456/JCCC%20Library%20JSON.user.js
// @updateURL https://update.greasyfork.org/scripts/12456/JCCC%20Library%20JSON.meta.js
// ==/UserScript==
///////////////////////////////////////////////////////////////
// In order for this script to work in google chrome you must
// have tampermonkey or another script manager that emulates 
// the greasemonkey api.
// Reduce default 'referer' header granularity must be enabled
// in chrome://flags
//////////////////////////////////////////////////////////////
var q = '';
var requestTimeout = 100;
var resultsPerPage = 10;

var startFuncVar = function () {

start();
};
var stopFuncVar = function () {stop();};
//disable all existing stylesheets
for (i=0;i<document.styleSheets.length;i++) {
document.styleSheets[i].disabled=true;

}

// start with a fresh body
document.body.innerHTML='';
// create de
deciplineSelectElem = document.createElement('select')
deciplineSelectElem.multiple=true
deciplineSelectElem.style.resize="both";
deciplineSelectElem.style.width="28em";
deciplineSelectElem.style.height="10em";
//deciplineSelectElem.style.fontFamily="monospace";
deciplineOptionArray = ["agriculture","anatomy & physiology","anthropology","applied sciences","architecture","astronomy & astrophysics","biology","botany","business","chemistry","computer science","dance","dentistry","diet & clinical nutrition","drama","ecology","economics","education","engineering","environmental sciences","film","forestry","geography","geology","government","history & archaeology","international relations","journalism & communications","languages & literatures","law","library & information science","mathematics","medicine","meteorology & climatology","military & naval science","music","nursing","occupational therapy & rehabilitation","oceanography","parapsychology & occult sciences","pharmacy, therapeutics, & pharmacology","philosophy","physical therapy","physics","political science","psychology","public health","recreation & sports","religion","sciences","social sciences","social welfare & social work","sociology & social history","statistics","veterinary medicine","visual arts","women's studies","zoology"];
newOption=document.createElement("option");
// Create 'any' option
	newOption.value='';
	newOption.innerHTML='Any';
	newOption.selected=true;
	deciplineSelectElem.appendChild(newOption);
// loop to populate the decipline select
for (i in deciplineOptionArray) {
	newOption=document.createElement("option");
	newOption.value=deciplineOptionArray[i];
	newOption.innerHTML=deciplineOptionArray[i];
	deciplineSelectElem.appendChild(newOption);
}
// start, information, results, and query elements
containerElem = document.createElement("div");
startElem = document.createElement("input");
startElem.setAttribute("value","Start");
startElem.setAttribute("type","button");
startElem.addEventListener("click",startFuncVar,false);


stopElem = document.createElement("input");
stopElem.setAttribute("value","STOP");
stopElem.setAttribute("type","button");
stopElem.addEventListener("click",stopFuncVar,false);
/*
stopElem = document.createElement("input");
stopElem.setAttribute("value","STOP");
stopElem.setAttribute("type","button");
stopElem.addEventListener("click",function () {
		for (j=0;j<timeoutarray.length;j++) {
			clearTimeout(timeoutarray[j]);
		}
		});
*/
infoElem = document.createElement("div");
infoElem.style.display="inline";
queryElem = document.createElement("input");
queryElem.setAttribute("type","text");


stopping=true;
stillrequesting=false;
deciplinechange=false;
var queryNumber = 0;
//queryNumberLast = 0;
//onpage = '<span id="onpage"></span>';
//options = '<select id="categories"><option value="">Any</option><option value="agriculture">agriculture</option><option value="anatomy & physiology">anatomy & physiology</option><option value="anthropology">anthropology</option><option value="applied sciences">applied sciences</option><option value="architecture">architecture</option><option value="astronomy & astrophysics">astronomy & astrophysics</option><option value="biology">biology</option><option value="botany">botany</option><option value="business">business</option><option value="chemistry">chemistry</option><option value="computer science">computer science</option><option value="dance">dance</option><option value="dentistry">dentistry</option><option value="diet & clinical nutrition">diet & clinical nutrition</option><option value="drama">drama</option><option value="ecology">ecology</option><option value="economics">economics</option><option value="education">education</option><option value="engineering">engineering</option><option value="environmental sciences">environmental sciences</option><option value="film">film</option><option value="forestry">forestry</option><option value="geography">geography</option><option value="geology">geology</option><option value="government">government</option><option value="history & archaeology">history & archaeology</option><option value="international relations">international relations</option><option value="journalism & communications">journalism & communications</option><option value="languages & literatures">languages & literatures</option><option value="law">law</option><option value="library & information science">library & information science</option><option value="mathematics">mathematics</option><option value="medicine">medicine</option><option value="meteorology & climatology">meteorology & climatology</option><option value="military & naval science">military & naval science</option><option value="music">music</option><option value="nursing">nursing</option><option value="occupational therapy & rehabilitation">occupational therapy & rehabilitation</option><option value="oceanography">oceanography</option><option value="parapsychology & occult sciences">parapsychology & occult sciences</option><option value="pharmacy, therapeutics, & pharmacology">pharmacy, therapeutics, & pharmacology</option><option value="philosophy">philosophy</option><option value="physical therapy">physical therapy</option><option value="physics">physics</option><option value="political science">political science</option><option value="psychology">psychology</option><option value="public health">public health</option><option value="recreation & sports">recreation & sports</option><option value="religion">religion</option><option value="sciences">sciences</option><option value="social sciences">social sciences</option><option value="social welfare & social work">social welfare & social work</option><option value="sociology & social history">sociology & social history</option><option value="statistics">statistics</option><option value="veterinary medicine">veterinary medicine</option><option value="visual arts">visual arts</option><option value="women\'s studies">women\'s studies</option><option value="zoology">zoology</option></select>';
/*document.body.innerHTML='<input type="text" id="query">'; //<input type="button" value="start" id="start">'+onpage+'<br>'+options+'<br><input type="button" value=" . stop . " id="stop"><span id="total"></span><br>';
q = document.getElementById('query').value;
//document.getElementById('start').addEventListener("click",function () {start();});
*/
checkKeyFuncVarisStopped = function (event) {checkkey(event,false);}
checkKeyFuncVarisStarted = function (event) {checkkey(event,true);}
checkMouseFuncVarisStopped = function (event) {checkmouse(false);}
checkMouseFuncVarisStarted = function (event) {checkmouse(true);}
queryElem.addEventListener("keyup",checkKeyFuncVarisStopped);
queryElem.addEventListener("keyup",checkKeyFuncVarisStopped);
startElem.addEventListener("click",checkMouseFuncVarisStopped);
queryElem.addEventListener("keyup",function () {changeButtonText(); });
queryElem.addEventListener("keydown",function () {changeButtonText(); });

queryElem.addEventListener("keypress",function () {changeButtonText(); });
deciplineSelectElem.addEventListener("change",function () {
	changeButtonText("Start");
	deciplinechange=true;
	changeButtonText();

});
queryElem.accessKey="s";
/*
document.getElementById("stop").addEventListener("click",function () {
		for (j=0;j<timeoutarray.length;j++) {
			clearTimeout(timeoutarray[j]);
		}
		});
*/
timeoutarray = [];
while (timeoutarray.length>0) {
			clearTimeout(timeoutarray.pop());
			
}




//append all elements
containerElem.appendChild(stopElem);
containerElem.appendChild(queryElem);

containerElem.appendChild(startElem);

containerElem.appendChild(infoElem);

document.body.appendChild(containerElem);
//document.body.appendChild(stopElem);
document.body.appendChild(deciplineSelectElem);
queryElem.focus();
function changeButtonText(setText) {
if (setText!=undefined && setText!=null && setText!=NaN) {
	startElem.setAttribute("value",setText);
} else {
	if (deciplinechange==true) {
		startElem.setAttribute("value","Start");
		makeStartEvent();
	} else {
		if (((otherii<(500/resultsPerPage)+1) && q!=queryElem.value) || q=='') {
			makeStartEvent();
			startElem.setAttribute("value","Start");
		} else if ((otherii<(500/resultsPerPage)+1) && q==queryElem.value && stopping==true) {
			startElem.setAttribute("value","Resume");
		} else if ((otherii<(500/resultsPerPage)+1) && q==queryElem.value && stopping==false) {
			startElem.setAttribute("value","Stop");
		} else if (q==queryElem.value && requestingdone==true) {
			startElem.setAttribute("value","Done");
		} else if (stopping=false) {
			startElem.setAttribute("value","Stop");
		}
	}
}

}
//setInterval(changeButtonText(),250);
function makeStartEvent() {
		startElem.removeEventListener("click",checkMouseFuncVarisStarted);
		queryElem.removeEventListener("keyup",checkKeyFuncVarisStarted);
		deciplineSelectElem.addEventListener("keyup",checkKeyFuncVarisStarted);
		startElem.addEventListener("click",checkMouseFuncVarisStopped);
		queryElem.addEventListener("keyup",checkKeyFuncVarisStopped);
		deciplineSelectElem.addEventListener("keyup",checkKeyFuncVarisStopped);
}
function makeStopEvent() {
	queryElem.removeEventListener("keyup",checkKeyFuncVarisStopped);
	startElem.removeEventListener("click",checkMouseFuncVarisStopped);
	deciplineSelectElem.removeEventListener("keyup",checkKeyFuncVarisStopped);
	queryElem.addEventListener("keyup",checkKeyFuncVarisStarted);
	startElem.addEventListener("click",checkMouseFuncVarisStarted);
	deciplineSelectElem.addEventListener("keyup",checkKeyFuncVarisStarted);

}
function stop() {

		stopping=true;
		while (timeoutarray.length>0) {
			clearTimeout(timeoutarray.pop());
			
		}
		startElem.setAttribute("value","Start");
		if ((otherii<(500/resultsPerPage)+1) && q==queryElem.value) {
			startElem.setAttribute("value","Resume");
		} else {		
			startElem.setAttribute("value","Start");
		}
		startElem.removeEventListener("click",checkMouseFuncVarisStarted);
		queryElem.removeEventListener("keyup",checkKeyFuncVarisStarted);
		
		startElem.addEventListener("click",checkMouseFuncVarisStopped);
		queryElem.addEventListener("keyup",checkKeyFuncVarisStopped);
		
		//queryElem.addEventListener("keyup",checkKeyFuncVarisStopped);
		changeButtonText();
		
}
function makeDiciplineQuery() {
diciplineQuery="";
//console.log("makediciplinequery");
for (i=0; i<deciplineSelectElem.options.length; i++) {
			if (deciplineSelectElem.options[i].selected===true && deciplineSelectElem.options[i].value==='') {
				//console.log("break");
				break;
			}
			if (deciplineSelectElem.options[i].selected===true) {
				//console.log("selected");
				//console.log(typeof(diciplineQuery)+"//q");
				//console.log(deciplineSelectElem.options[i]);
				diciplineQuery+='&fvf[]=Discipline,'+deciplineSelectElem.options[i].value.replace(/\s/g,'+').replace(/&/g,'%26')+',f';
				//console.log(typeof(diciplineQuery)+"//q");
			}
}
return diciplineQuery;
}

function start() {

while (timeoutarray.length>0) {
			//alert(timeoutarray.length);
			clearTimeout(timeoutarray.pop());
			
}
stopping=false;
if ((otherii<(500/resultsPerPage)+1) && q==queryElem.value && deciplinechange==false) {
timeoutarray[timeoutarray.length]=setTimeout(apireq(otherii,queryNumber),0);
changeButtonText("Stop");
makeStopEvent();

}

if (q==queryElem.value && deciplinechange==false) {
		return false;
}
//queryElem.removeEventListener("keyup",checkKeyFuncVarisStopped);
//sstartElem.removeEventListener("click",checkMouseFuncVarisStopped);
//queryElem.removeEventListener("keyup",checkKeyFuncVarisStopped);
//queryElem.addEventListener("keyup",checkKeyFuncVarisStarted);
//startElem.addEventListener("click",checkMouseFuncVarisStarted)
//queryElem.addEventListener("keyup",checkKeyFuncVarisStarted);

makeStopEvent();

deciplinechange=false;
allResults = document.getElementsByClassName("resultdiv");
while (allResults.length>0) {

	document.body.removeChild(allResults[0]);
}


startElem.setAttribute("value","STOP");
//startElem.removeEventListener("click",startFuncVar,false);
//startElem.addEventListener("click",stopFuncVar,false);
//deciplineQuery="";
	stopping=true;
	//q = document.getElementById('query').value;
	
	q = queryElem.value;
/*
		for (i=0; i<deciplineSelectElem.options.length; i++) {
			if (deciplineSelectElem.options[i].selected===true && deciplineSelectElem.options[i].value==='') {
				break;
			}
			if (deciplineSelectElem.options[i].selected===true) {
				//console.log(deciplineSelectElem.options[i]);
				deciplineQuery+='&fvf[]=Discipline,'+deciplineSelectElem.options[i].value.replace(/\s/g,'+').replace(/&/g,'%26')+',f'
			}
		}
*/
	deciplineQuery=makeDiciplineQuery();
	console.log(deciplineQuery);

	//decipline = '&fvf[]=Discipline,'+decipline.replace(/\s/g,'+').replace(/&/g,'%26')+',f';
	//document.body.innerHTML+='<input type="text" id="query">'
	//document.body.innerHTML='<input type="text" id="query" value="'+q.replace(/"/g,'&quot;')+'"><input type="button" value="start" id="start">'+onpage+'<br>'+options+'<br><input type="button" value=" . stop . " id="stop"><span id="total"></span><br>';
	//document.getElementById('start').addEventListener("click",function () {start();});
	//document.getElementById('query').addEventListener("keydown",function (event) {checkkey(event);});
	//document.getElementById('query').addEventListener("keyup",function (event) {checkkey(event);});
	//document.getElementById("stop").addEventListener("click",function () {
		//for (j=0;j<timeoutarray.length;j++) {
		//	clearTimeout(timeoutarray[j]);
		//}
		//stopping=true;
		//});
	/*
	alloptions = document.getElementsByTagName("option");
	for (o in alloptions) {
		if (alloptions[o].value==decipline) {
			alloptions[o].selected=true;
		}
	}
	*/
	ii=1;
	otherii=1;
	totalpages = 51;
	linksarray = [];
	function linksa(link) {
	linksarray.push(link);
	}
	arrayi = [];
	for (i=0;i<totalpages;i++) {
	arrayi[i]=i;
	}
	i=0;
	for (j=0;j<timeoutarray.length;j++) {
			clearTimeout(timeoutarray[j]);
	}
	//for (i=0;i<totalpages;i++) {

	
	//timeoutarray[i]=setTimeout(function (i) {
		stopping=false;
		requestingdone=false;
		resultnumber = 0;
		//document.getElementById("onpage").innerHTML="Requesting Page 1";
		queryNumber++;
		timeoutarray[timeoutarray.length]=setTimeout(apireq(ii,queryNumber),0);
		//apireqsingle(1);
		

	
	//},(timeoutForEachRequest*arrayi.shift()));


	//}
}

var otherii;
var otherii2;
var resultnumber = 0;
function apireq(ii,queryNumberF) {

infoElem.innerHTML=" Requesting Page "+ii;
GM_xmlhttpRequest({
	  method: "GET",
	  url: 'http://jccc.summon.serialssolutions.com/api/search?pn='+(ii)+'&ho=t'+deciplineQuery+'&fvf[]=IsFullText,true,f&l=en&ps='+resultsPerPage+'&q='+q,
	  data: "",
	  headers: {
		"Host": "jccc.summon.serialssolutions.com",
		"User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:37.0) Gecko/20100101 Firefox/37.0",
	   	"Accept": "application/json, text/plain, */*",
	   	"Accept-Language": "en-US,en;q=0.5",
	   	"Accept-Encoding": "gzip, deflate",
	   	"SUMMON_SID": "",
	   	"Referer": "http://jccc.summon.serialssolutions.com/search",
	   	"Cookie": "Summon-Two=true; hasSavedItems=1",
	   	"Connection": "keep-alive"
	  },
	  onload: function(response) {
	  if (queryNumberF==queryNumber) {
		console.log('onload');
		//document.body.innerHTML="<pre>"+response.responseText+"</pre>"
		pages =	JSON.parse(response.responseText);
		
		//document.body.innerHTML="<pre>"+pages.full_text_link+"</pre>";
		//document.body.innerHTML="";
		/*
		findobj = pages;
		for (key in findobj) {
			document.body.innerHTML+="<br>"+key+":\n"+findobj[key]+"<br>";
		}
		*/
		if (pages.documents=='') {
				requestingdone=true;
		}
		//document.getElementById("total").innerHTML=" Total Records "+pages.record_count;
		for (key in pages.documents) {
			resultnumber++;
			//console.log(resultnumber);
			newh3 = document.createElement("h3");
			newh3.setAttribute("class","result");
			newh3.innerHTML=pages.documents[key]["full_title"];
			newh3.style.display="inline";
			newh4 = document.createElement("h4");
			newh4.setAttribute("class","result");
			if (resultnumber<10) {
				zeros="00";
			} else if (resultnumber<100) {
				zeros="0";
			} else {
				zeros="";
			}
			newh4.innerHTML=zeros+resultnumber+" ";
			newh4.style.display="inline-block";
			//newh4.style.height="100%";
			//newh4.style.width="3em";
			newh4.style.margin="0";
			newh4.style.paddingRight="1em";
			newdiv2 = newdiv = document.createElement("div");
			
			newa = document.createElement("a");
			newa.setAttribute("class","result");
			newa.setAttribute("href",pages.documents[key]["fulltext_link"]);
			newa.appendChild(newh3);
			newspan2 = document.createElement("span");
			if (pages.documents[key]["publication_title"]!=undefined) {
			newspan2.innerHTML = ' &rarr; '+pages.documents[key]["publication_title"];
			}
			if (pages.documents[key]["publisher"]!=undefined) {
			newspan2.innerHTML += ' &rarr; '+pages.documents[key]["publisher"];
			}
			newspan2.style.fontStyle="italic";
			newdiv2.appendChild(newh4);
			newdiv2.appendChild(newa);
			newdiv2.appendChild(newspan2);
			newa.style.display="inline";
			newdiv = document.createElement("div");
			newdiv.setAttribute("class",ii);
			//newdiv.innerHTML=pages.documents[key]["snippet"];
			newdiv.style.padding="2px";
			newdiv2.style.padding="2px";
			newdiv2.style.borderTop="1px solid #000000";
			newdiv.setAttribute("class","result");
			newdiv2.setAttribute("class","resultdiv");
			if ((resultnumber%2)==0) {
				newdiv2.style.backgroundColor="#e9e9e9";
				newdiv.style.backgroundColor="#e9e9e9";
			}
			document.body.appendChild(newdiv2);
			
			newspan = document.createElement("span");
			newspan.setAttribute("class","result");
			if (pages.documents[key]["snippet"]==undefined) {
				newspan.innerHTML=''
			} else {
				newspan.innerHTML=pages.documents[key]["snippet"];
			}
			newspan.style.paddingLeft="1em";
			newdiv.appendChild(newspan);
			
			newdiv2.appendChild(newdiv);
			
			
			
			//document.body.innerHTML+='<h3>'+pages.documents[key]["full_title"]+'</h3><br><a href="'+pages.documents[key]["fulltext_link"]+'">'+pages.documents[key]["fulltext_link"]+'</a><br>'+pages.documents[key]["snippet"]+"<br><br>";
		
		}
		/*
		console.log(ii+","+q+","+decipline.replace(/\s/g,'+'));
		if (ii<20) {
		document.getElementById("onpage").innerHTML="Last Requested Page "+ii;
		} else {
		document.getElementById("onpage").innerHTML="Requesting Done Page "+ii;
		//alert("'"+pages.documents+"'");
		}
		if (requestingdone==true) {
			document.getElementById("onpage").innerHTML="Requesting Done Page "+ii;
		}
		*/
		otherii = (ii+1);
		if (otherii<(500/resultsPerPage)+1 && stopping==false && requestingdone==false) {
		
		if (requestingdone==false) {

//////////////////////// timeout recursive download ////////////////////////
		
			console.log("queryNumberF "+queryNumberF);
			timeoutarray[timeoutarray.length]=setTimeout(apireq(otherii,queryNumberF),requestTimeout);
		



		}
		} else {
			stop();
			infoElem.innerHTML=" Stopped Requesting on Page "+ii;
		}
		if (requestingdone==true) {
			stop();
			infoElem.innerHTML=" Done Requesting on Page "+ii;
		}
	
	  }
	  }
	});

}

function checkkey(event,isStarted) {
	thekey = event.which || event.keyCode;
	if (thekey==13 && isStarted==false) {
		console.log("1");
		start();
		return true;
	}
	
	if (thekey==13 && isStarted==true) {
		console.log("2");
		stop();
		return true;
	}
}

function checkmouse(isStarted) {
	if (isStarted==true) {
		console.log("3");
		stop();
		return true;
	}

	if (isStarted==false) {
		console.log("4");
		start();
		return true;
	}
}
