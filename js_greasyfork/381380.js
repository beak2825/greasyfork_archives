// ==UserScript==
// @name           GC Event Day
// @namespace      delta68.gc_event_day
// @include        http://www.geocaching.com/geocache/*
// @include        https://www.geocaching.com/geocache/*
// @include        http://www.geocaching.com/seek/cache_details.aspx*
// @include        http://www.geocaching.com/calendar/default.aspx*
// @include        http://www.geocaching.com/CITO/calendar.aspx
// @include        http://www.geocaching.com/seek/nearest.aspx*
// @include        https://www.geocaching.com/seek/cache_details.aspx*
// @include        https://www.geocaching.com/calendar/default.aspx*
// @include        https://www.geocaching.com/CITO/calendar.aspx
// @include        https://www.geocaching.com/seek/nearest.aspx*
// @include        https://www.geocaching.com/calendar/
// @grant       GM_getValue
// @grant       GM_setValue
// @version 1.00
// @description Adds weekday to event pages plus other stuff
// @downloadURL https://update.greasyfork.org/scripts/381380/GC%20Event%20Day.user.js
// @updateURL https://update.greasyfork.org/scripts/381380/GC%20Event%20Day.meta.js
// ==/UserScript==
var m=new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/')+1);
var body = document.body.innerHTML;
var pos =body.indexOf('eventCacheData');

// this section is for the date on the actual event page
if(pos>0)
{
	var strtemp = body.substring(pos+18);
	pos =strtemp.indexOf('}');
	strtemp = strtemp.substring(0,pos);
	var ecd = strtemp.split('\n');
	pos =ecd[1].indexOf('(');
	ecd[1]=ecd[1].substring(pos+1);
	pos =ecd[1].indexOf(')');
	ecd[1]=ecd[1].substring(0,pos).replace(/,/g,'');
	var dd =ecd[1].split(' ');
	var date= new Date(dd[1]+ '/' + dd[2] + '/' + dd[0]);
	var span_date = getDateSpan();
	span_date.innerHTML= "Event Date: " + date.toDateString();
}

/*************************************************************/
// this is for the list of caches from a PQ preview
if(filename=='nearest.aspx')
{
	if(document.title.length >0)
	{
        var t =getTable();
        var row = t.getElementsByTagName("tr");
        for(var i=0;i<row.length;i++)
        {
            if(row.item(i).innerHTML.indexOf('Event')>0){ // only want events
                var cell = row.item(i).getElementsByTagName("td");


                var dnd = cell.item(1).innerHTML;
                var guid = getGCcode1(cell.item(4).innerHTML);


                GM_setValue(guid,dnd);

                var j=8;
                if(cell.item(j).innerHTML.indexOf("/images/new3.gif") > 0)
                {
                    var s = cell.item(j).innerHTML.replace(/\//g,' ').replace(/-/g,' ').split(' ');
                    var d =normDate(s[53] + '/' + s[54] + '/' + s[55]);
                    cell.item(j).innerHTML="<span class='small'>" + d + "&nbsp;<img src='/images/new3.gif' alt='New!' title='New!' /></span>";
                }
            }
        }
	}
}

/*************************************************************/
//Display distances on calender page if known
if((filename=='default.aspx')||(filename=='calendar.aspx'))
{
	if(document.title.length >0)
	{
		//single day event list
		var table = document.getElementsByClassName("CacheCalendarTable Table");

		try{
			var tr=table[0].getElementsByTagName("tr");
			for(i=0;i<tr.length;i++)
			{
                var td=tr[i].getElementsByTagName("td");
                td[2].innerHTML= GM_getValue(getGCcode2(td[5].innerHTML),'');
			}
		 }catch(err){
				//Handle errors here
		}

	}
}

/*************************************************************/
// functions

function getGuid(s)
{
    var g = s.substring(s.indexOf('/geocache/')+10);
    return g.substring(0,g.indexOf('"'));
}

function getGCcode1(s)
{ //for use in nearest.aspx
    var g = s.substring(s.indexOf('/geocache/')+10);
    return g.substring(0,g.indexOf('_'));
}

function getGCcode2(s)
{//for use in calender page
    var g = s.substring(s.indexOf('(GC')+1);
    return g.substring(0,g.indexOf(')'));
}


function getDateSpan()
{
    var s=document.getElementById("ctl00_ContentBody_mcd2");
	return(s);
}



function getM(strin)
{
	for(var j=0;j<m.length;j++)
	{
		if(m[j]==strin)
		{
			return j+1;
		}
	}
}


function getTable()
{
    var s=document.getElementsByTagName("table");

	for(var i=0;i<s.length;i++)
	{
		if(s.item(i).getAttribute("class")=="SearchResultsTable Table")
		{
	        return(s.item(i));
		}
	}
}



function normDate(strDate)
{
/*posibilities
2011-10-13
2011/10/13
10/13/2011 //can't be sure
13/10/2011 //can't be sure
13/Oct/2011
Oct/13/2011
13 Oct 11
*/

var strtemp = strDate.replace(/-/g, '/');
strtemp=strtemp.replace(/ /g, '/');
var s=strtemp.split('/');
var d='';
if(s[0].length==4)
{
	d = new Date(Number(s[1]) + '/' + Number(s[2]) + '/' +s[0]);
	return d.toDateString();
}else if(s[0].length==3){
	 d = new Date(getM(s[0]) + '/' + Number(s[1]) + '/' +s[2]);
	return d.toDateString();
}else if(s[1].length==3){
	d = new Date(getM(s[1]) + '/' + Number(s[0]) + '/20' +s[2]);
	return d.toDateString();
}else{
	return strDate;
}

}



function getItemByInnerHTML(tag,html)
{
	var t = document.getElementsByTagName(tag);

	for(var i=0;i<t.length;i++)
	{
		if(t[i].innerHTML.trim()==html)
		{//alert('x')
		  return(t[i]);
		}
	}
}
