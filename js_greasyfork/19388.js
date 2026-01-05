// ==UserScript==
// @name        GC Event Calendar Filter
// @namespace   delta68.gc_event_calendar_filter
// @include     https://www.geocaching.com/calendar/default.aspx*
// @include     https://www.geocaching.com/calendar/*
// @include     https://www.geocaching.com/cito/calendar.aspx
// @version     1.04
// @description Country/US state filter for the geocaching.com event calendar page
// @grant		GM_getValue
// @grant		GM_setValue

// @downloadURL https://update.greasyfork.org/scripts/19388/GC%20Event%20Calendar%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/19388/GC%20Event%20Calendar%20Filter.meta.js
// ==/UserScript==

var countriesInPage=[];
var countries=GM_getValue('countries','');
var version = '1.04';
var country=countries.split(',');
var chcito=GM_getValue('chcito','');

listCountriesInPage();


//update page heading if filtered for CITOs
if(chcito==true)
{
  var h=getElementByInnerHTML("h2","Geocaching Event Calendar");
  h.innerHTML='Geocaching Event Calendar - Filtered for CITOs';
  setMonthHeading();
}

applyFilter();

//add in link for filter editor
if(document.title.length >0)
{
var p=document.getElementsByTagName("p");
//p[1].innerHTML+= " <br><a href='#' id='edit_filter'>Edit Filter</a>";
p[1].innerHTML+= " <br><button type='button' id='edit_filter'>Edit Filter</button>";
var elem = document.getElementById('edit_filter');
elem.addEventListener('click', createFilterEditor, false);
}


function applyFilter()
{
		//single day event list
		var table = document.getElementsByClassName("CacheCalendarTable Table");
		var tr='';
        var i=0;
var dataflag=false;

		try{
			tr=table[0].getElementsByTagName("tr");
			for(i=0;i<tr.length;i++)
			{
					if(isWanted(tr[i].innerHTML)!=1)
					{
					 	tr[i].innerHTML='';
					}else{dataflag=true;}
			}
            if((chcito==true) && (dataflag==false))
            {
                tr[0].innerHTML='There are no CITO events on this date';
            }
		 }catch(err){
				//Handle errors here
		}

		//calendar table
		table=document.getElementById("ctl00_ContentBody_CalendarEvents");
		tr=table.getElementsByTagName("tr");
		for(i=3;i<tr.length;i++)
		{
			var td= tr[i].getElementsByTagName("td");
			for(var j=0;j<td.length;j++)
			{
				var str=td[j].innerHTML.replace(/<span\>/gi,'');
					str=str.replace(/<\/span\>/gi,'');
				var c = str.split("<br>");
				var newtext='';//c[0] + "<br>";

				for(var k = 1;k<c.length;k++)
				{

						if(isWanted(c[k])==1)
						{
                            //var tc=removeCount(c[k]);
                            var tc=c[k];
                           // if(newtext.indexOf(tc)==-1)
                            //{
                                newtext = newtext + tc+ '|';
                            //}
						}

				}

				td[j].innerHTML=c[0]+ "<br>" + formatOutput(newtext);
			}
		}
}

// functions

function removeCount(c)
{
	var pos=c.indexOf('(');
	if(pos>-1)
	{
		return(c.substring(0,pos).trim());
	}else{
		return(c);
	}
}

function getCount(c)
{	var count=0;
	var posA=c.indexOf('(');
	var posB=c.indexOf(')');

	var strOut='';
	if(posA>-1)
	{	count=c.substring(posA+1,posB);
	}else{
		count=1;
	}
	return(count);
}

function makeRegion(Name, Count) {
    this.name = Name;
    this.count = Count;
}

function formatOutput(ss)
{
var j=0;
var s= ss.split('|');
var region=[]
region[0]=new makeRegion('',0);

var rname='';
var rcount='';
var flag=false;
var strout='';
for(var i=0;i<s.length;i++)
{	flag=false;
	rname = removeCount(s[i]);
	rcount = eval(getCount(s[i]));

 	for(j=0;j<region.length;j++)
	{	if(region[j].name==rname)
		{
			region[j].count = region[j].count+ rcount;
			flag=true;
			break;
		}
	}

	if(flag==false)
	{
		region[region.length]=new makeRegion(rname,rcount);
	}
}

for(j=1;j<region.length;j++)
{
strout +=region[j].name + ' (' + region[j].count + ')<br>'

}
return(strout);

}




function isWanted(s)
{var retval=0;
 if(chcito==true)
 {
     if(s.indexOf('6.gif')>-1)
	{
				return 0;
	}
 }

 if(country.length==1)
 {
	retval=1;
 }else{

	for(var l=0;l<country.length;l++)
	{
		if(country[l].length>0)
		{
			if(s.indexOf(country[l])>-1)
			{
				retval=1;
			}
		}
	}
 }
		return retval;
}

function listCountriesInPage()
{
	//calendar table
	var table=document.getElementById("ctl00_ContentBody_CalendarEvents");
	var tr=table.getElementsByTagName("tr");
	for(var i=3;i<tr.length;i++)
	{
		var td= tr[i].getElementsByTagName("td");
		for(var j=0;j<td.length;j++)
		{
			var str=td[j].innerHTML.replace(/<span\>/gi,'');
			str=str.replace(/<\/span\>/gi,'');
			var s = str.split('<br');
			for(var k=0;k<s.length;k++)
			{
				var c = cleanUpCountry(s[k]);
                if(isNaN(c)){
                    //alert(s[k] + '!!!!' + c)
                    if(countriesInPage.indexOf(c)==-1)
                    {
                        countriesInPage.push(c);
                    }
                }
			}
		}
	}
	countriesInPage.sort();

}

function cleanUpCountry(strIn)
{
	var strOut='';

	if(strIn.indexOf('$CalendarEvents')>0)
	{
		return('');
	}else{
		strOut=strIn.replace(/>/gi,'');
        if(strOut.indexOf('(')>0)
        {
            strOut=strOut.substring(0,strOut.indexOf('(')).trim();
        }
		return(strOut);
	}
}

function displayCountries()
{
	var str='';
	for(var i=0;i<countriesInPage.length;i++)
	{
		str+=countriesInPage[i] + '\n';
	}
alert(str);
}


function closeFilterEditor()
{
	try{
	var element = document.getElementById("filtereditordiv");
	element.parentNode.removeChild(element);
	}catch(err){}
}


function createFilterEditor()
{
	closeFilterEditor();

	var div = document.createElement("div");
	div.id="filtereditordiv";
 	div.style.position = "absolute";
	div.style.zIndex = 10000;
	div.style.left = "50px";
	div.style.top = "20px";
	div.style.background = "lightgray";
	div.style.border = "2px solid #82aa13";
	div.style.color = "black";
	var str='';
	str='<b>Select Countries/States</b><br>';
	//listCountriesInPage()
	//displayCountries()
	for(var i=0;i<countriesInPage.length;i++)
	{
		if(countriesInPage[i].length>0)
		{
			str+="<input type='checkbox' name='ch' value='" + countriesInPage[i] + "' id='ch" + i + "'" + selected(countriesInPage[i]) + ">" + countriesInPage[i] + "<br>";
		}
	}
    str = str +"<br><input type='checkbox' value='CITOs Only' id='chcito'" + setChCito(chcito) + ">Show CITOs Only<br>";
	str = str +"<input type='button' value='Cancel' id='cancel'><input type='button' value='Save Changes' id='savechanges'>";

	div.innerHTML = str;

	document.body.appendChild(div);

	elem = document.getElementById('cancel');
	elem.addEventListener('click', closeFilterEditor, false);

	elem = document.getElementById('savechanges');
	elem.addEventListener('click', saveChanges, false);

}

function saveChanges()
{
	var ch = document.getElementsByName('ch');
	var str='';
	for(var i=0;i<ch.length;i++)
	{
		if(ch[i].checked){
		str+=ch[i].value + ',';
		}
	}
	GM_setValue('countries',str);
    ch=document.getElementById('chcito');
    GM_setValue('chcito',ch.checked);

closeFilterEditor();
//location.reload();
location.href='https://www.geocaching.com/calendar/default.aspx'
}


function selected(cIn){
	if(country.indexOf(cIn) >-1)
	{return(' checked');
	}else{return('');}
}


function setChCito(cIn){
    if(cIn==true)
	{return(' checked');
	}else{return('');}
}



function getElementByInnerHTML(tag,html)
{
	var el = document.getElementsByTagName(tag);
	for(var i=0;i<el.length;i++)
	{
        if(el[i].innerHTML.trim()==html)
        {
		 return(el[i]);
        }
	}
}

function setMonthHeading()
{
 var table = document.getElementById('ctl00_ContentBody_CalendarEvents')
 var td =table.getElementsByTagName("td");
 //alert(td[2].innerHTML);
    td[2].innerHTML += ' (day counts include all Event types)'

}
