// ==UserScript==
// @name         GC Lab Cache Download
// @namespace    delta68.labcachedownloader
// @version      0.4
// @description  try to take over the world!
// @author       Delta68
// @include        https://www.geocaching.com/geocache/*
// @include        https://labs.geocaching.com/logs
// @grant		GM_getValue
// @grant		GM_setValue


// @downloadURL https://update.greasyfork.org/scripts/407112/GC%20Lab%20Cache%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/407112/GC%20Lab%20Cache%20Download.meta.js
// ==/UserScript==
var limit=GM_getValue('limit','all');

var loadOnlyLast=1000000;
if(limit!='all')
{
    loadOnlyLast=eval(limit);
}

var url = document.location.toString();
var wpt='';
var findsData= new Array();
var d='';
 var finderid='';
 var findername='';
/*****************************************************************/
if(url.indexOf('www.geocaching.com/geocache/') > 0)
{
    //finder details for use inlogs
    d =document.documentElement.innerHTML;
   finderid=d.substring(d.indexOf('{userId:')+8);
   finderid=finderid.substring(0,finderid.indexOf('}')).trim();

    findername=d.substring(d.indexOf('user-name')+11);
    findername= findername.substring(0,findername.indexOf('<'));

//fill in waypoint location and owner information
   // var placedByGUID=d.substring(d.indexOf('profile/?guid=')+14);
    var placedByGUID=d.substring(d.indexOf('/p/?guid=')+9);
    var placedby = placedByGUID.substring(placedByGUID.indexOf('">')+2);
    placedby = placedby.substring(0,placedby.indexOf('<'));
    //alert(placedby);

    var ownername=d.substring(d.indexOf('"/seek/nearest.aspx?u=')+22);
    ownername=ownername.substring(0,ownername.indexOf('"'));
    ownername=ownername.replaceAll("%20", " ");
    //alert(ownername);

    placedByGUID=placedByGUID.substring(0,placedByGUID.indexOf('&'));
    //alert(placedByGUID);
    var ownerid=''
    var pos=d.indexOf('"AccountGuid":"' + placedByGUID);
    //"AccountGuid":"
    if(pos>-1)
    {
        ownerid = d.substring(pos-100);
        ownerid =ownerid.substring(ownerid.indexOf('"AccountID":')+12);
        ownerid =ownerid.substring(0,ownerid.indexOf(','));
    }else{
        ownerid=placedByGUID;
    }
    //alert(ownerid);

    //var lat=53.545717, lng=-2.6325,
    var lat=d.substring(d.indexOf('lat=')+4);
    lat=lat.substring(0,lat.indexOf(','));

    var lng=d.substring(d.indexOf('lng=')+4);
    lng=lng.substring(0,lng.indexOf(','));
   // alert(lat);
   // alert(lng);
    var state=d.substring(d.indexOf('ctl00_ContentBody_Location">In ')+31);
    state =state.substring(0,state.indexOf('</'));
    if(state.indexOf('>')>-1){
        state=state.substring(state.indexOf('>')+1);
    }
    //alert(state);
    var country=state.substring(state.indexOf(',')+1).trim();
    state=state.substring(0,state.indexOf(','));
    //ctl00_ContentBody_Location
//alert(state);
    //alert(country);
    wpt=wptTemplate()
    wpt=wpt.replace('$LAT$',lat);
    wpt=wpt.replace('$LNG$',lng);
    wpt=wpt.replace('$STATE$',state);
    wpt=wpt.replace('$COUNTRY$',country);
    wpt=wpt.replace('$PLACEDBY$',placedby);
    wpt=wpt.replace('$OWNERNAME$',ownername);
    wpt=wpt.replace('$OWNERID$',ownerid);
    //alert(userid);
    //alert(username);

 dropdownListOfAdventures();

    return;
}


////////////////////////////////////////////
if(url.indexOf('labs.geocaching.com/logs') > 0)
{
    addLimitSelect();

   	var sec= document.getElementsByTagName('section');
	//alert(sec.length);
    var stopAt=loadOnlyLast;
    if(stopAt>sec.length){stopAt=sec.length};

    var strAllFindsData='';
	for(var i=0;i<stopAt;i++)
	{
       //process finds data
        var li = sec[i].getElementsByTagName('li');

        var adventuretitle = sec[i].innerHTML;
        adventuretitle=adventuretitle.substring(adventuretitle.indexOf('adventure-title-text')+22);
        adventuretitle=adventuretitle.substring(0,adventuretitle.indexOf('<'));
        //alert(adventuretitle);

        var allDataForThisAdventure=adventuretitle;

        for(var j=0;j<li.length;j++)
        {
            var litxt = li[j].innerHTML;
            var labName = litxt.substring(litxt.indexOf('cache-title')+13)
            labName = labName.substring(0,labName.indexOf('<'));

            var labLogDate = litxt.substring(litxt.indexOf('log-date')+10)
            labLogDate = fixdate(labLogDate .substring(0,labLogDate.indexOf('<')));
            var logid =litxt.substring(litxt.indexOf('?logId=')+7)
            logid= logid.substring(0,logid.indexOf('"'));
           // alert(labName + '||' + labLogDate + '||' + logid);
            allDataForThisAdventure+='~~'+ labName + '||' + labLogDate + '||' + logid;
        }

        strAllFindsData+=allDataForThisAdventure + '$$';
	}
    GM_setValue('AllLabFindsData',strAllFindsData);

}
/////////////////////////////////////////////////////////////////////


function download()
{
    var e=document.getElementById('lab');
    var n = e.options[e.selectedIndex].value;
    var fd=findsData[n].split('~~');
    var filename=fd[0] + '.gpx';
    var text =gpxHeader();

    for(var k=1;k<fd.length;k++)
       { var loginfo=fd[k].split('||');
        var wtptemp = wpt;
        wtptemp=wtptemp.replace('$CODE$','LC' + loginfo[2]);
        wtptemp=wtptemp.replace('$NAME$',fd[0] + ': ' + loginfo[0]);
        wtptemp=wtptemp.replace('$CACHEID$',loginfo[2]);

        var logtext = '<groundspeak:log id="' + loginfo[2] + '">\n'
        logtext +='<groundspeak:date>' + loginfo[1] + '</groundspeak:date>\n'
        logtext +='<groundspeak:type>Found it</groundspeak:type>\n'
        logtext +='<groundspeak:finder id="' + finderid + '">' + findername + '</groundspeak:finder>\n'
        logtext +='<groundspeak:text encoded="False">TFTC</groundspeak:text>\n'
        logtext += '</groundspeak:log>\n'

        wtptemp=wtptemp.replace('$LOG$',logtext);
        text += wtptemp + '\n'
       }
    text += gpxFooter() + '\n'
    text = text.replace(/\n/g, String.fromCharCode(10,13));

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function dropdownListOfAdventures()
{
    var strAllFindsData=GM_getValue('AllLabFindsData','');
    var div=getElementByClassName('div','DownloadLinks');
    var dl=document.createElement('dl');
    var dt=document.createElement('dt');

    dl.appendChild(dt);
    div.appendChild(dl);

    if(strAllFindsData.length>0)
    {
        var selectText='<select id="lab">';
        findsData= strAllFindsData.split('$$');

        var stopAt = loadOnlyLast;
        if(stopAt>findsData.length){stopAt=findsData.length-1};

        for(var n=0;n<stopAt;n++)
        {
            var fd=findsData[n].split('~~');
            selectText+='<option value="' + n + '">' + fd[0] + '</option>\n';
        }
        selectText+='</select>';

        dt.innerHTML='Adventure Lab logs Download:'+ selectText;

        //creata download link
        var a = document.createElement('a');
        a.title = 'Download GPX';
        a.href='#';
        a.addEventListener('click', download.bind(null), false);
        dt.appendChild(a);
        var img=new Image();
        a.appendChild(img);
        img.src='https://www.geocaching.com/images/icons/16/download.png';
    }else{
        dt.innerHTML='Adventure Lab logs Download: <a href="https://labs.geocaching.com/logs">Please visit log page first</a>';
    }
}

function fixdate(strin)
{//change the date to the format used in gpx files
    //Completed: 8/10/2019 UTC
    //2019-08-18T19:00:00Z
    var sout = strin.trim().replace(/[/]/g, ' ');
    var s = sout.split(' ');
    sout =s[3] + "-" + right('00' +s[1],2) +'-'+ right('00' +s[2],2) + 'T12:00:00Z';
    return sout;
}

function right(str,chr)
{
    return str.substr(str.length-chr,str.length)
}


function gpxHeader()
{
return '<?xml version="1.0" encoding="utf-8"?>\n<gpx xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0" creator="Groundspeak Pocket Query" xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd http://www.groundspeak.com/cache/1/0/1 http://www.groundspeak.com/cache/1/0/1/cache.xsd" xmlns="http://www.topografix.com/GPX/1/0">'
}

function gpxFooter()
{
    return '</gpx>';
}

function wptTemplate()
{
    var wptt='<wpt xmlns="http://www.topografix.com/GPX/1/0" lat="$LAT$" lon="$LNG$">\n';
    wptt+='<name>$CODE$</name>\n';
    wptt+='<sym>Geocache</sym>\n';
    wptt+='<type>Geocache|Lab Cache|Found</type>\n';
    wptt+='<groundspeak:cache id="$CACHEID$" available="True" archived="False" xmlns:groundspeak="http://www.groundspeak.com/cache/1/0/1">\n';
    wptt+='  <groundspeak:name>$NAME$</groundspeak:name>\n';
    wptt+=' <groundspeak:placed_by>$PLACEDBY$</groundspeak:placed_by>\n';
    wptt+=' <groundspeak:owner id="$OWNERID$">$OWNERNAME$</groundspeak:owner>\n';
    wptt+='  <groundspeak:container>Other</groundspeak:container>\n';
    wptt+=' <groundspeak:difficulty>1.5</groundspeak:difficulty>\n';
    wptt+=' <groundspeak:terrain>1.5</groundspeak:terrain>\n';
    wptt+=' <groundspeak:country>$COUNTRY$</groundspeak:country>\n';
    wptt+=' <groundspeak:state>$STATE$</groundspeak:state>\n';
    wptt+=' <groundspeak:logs>$LOG$</groundspeak:logs>\n';
    wptt+='</groundspeak:cache>\n';
    wptt+=' </wpt>\n';
    return wptt;
}

function getElementByClassName(elementType,classname)
{//returns the first element where type and class name match
    var el = document.getElementsByTagName(elementType);
	for(var i=0;i<el.length;i++)
	{
        if(el[i].className==classname)
        {
            return(el[i]);
        }
	}
}


function addLimitSelect()
{
var ul = document.getElementsByTagName('ul');
var li=document.createElement('li');


//var select=document.createElement('select');
var s="&nbsp;Process <select id='limit'>"
s+="<option value='10'" + setselected('10') + ">10</option>"
s+="<option value='100'" + setselected('100') + ">100</option>"
s+="<option value='all'" + setselected('all') + ">All</option></select> Adventures&nbsp;"

ul[0].appendChild(li);
li.innerHTML=s;
var elem = document.getElementById('limit');
elem.addEventListener('change', saveChanges, false);
}
//li.appendChild(select);

function setselected(n)
{
    if(limit==n)
    {return(' selected');
    }else{return('');}
}

function saveChanges()
{var x = document.getElementById('limit').value;
 GM_setValue('limit',x);
 var m = document.getElementsByClassName("li-user-toggle");
 m[0].click();
 location.reload();
}



(function() {
    'use strict';

    // Your code here...
})();