// ==UserScript==
// @name         Project GC PQ Split Data Grab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Stores Project GC PQ Splitter settings for use in the New Pocket Query page on geocaching.com
// @author       delta68
// @match        https://project-gc.com/Tools/PQSplit?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=project-gc.com
// @match       http://www.geocaching.com/pocket/gcquery.aspx*
// @match       http://www.geocaching.com/pocket/urquery.aspx*
// @match       https://www.geocaching.com/pocket/gcquery.aspx*
// @match       https://www.geocaching.com/pocket/urquery.aspx*

// @grant		GM_getValue
// @grant		GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/450908/Project%20GC%20PQ%20Split%20Data%20Grab.user.js
// @updateURL https://update.greasyfork.org/scripts/450908/Project%20GC%20PQ%20Split%20Data%20Grab.meta.js
// ==/UserScript==
var url = document.location.toString();
var changedflag=false;
if(url.indexOf('project-gc.com/Tools/PQSplit') > 0)
{
    storeProjectGCInfo();


}else if(url.indexOf('www.geocaching.com/pocket/gcquery.aspx') > 0)
{
    if(isNewQuery())
    { if(GM_getValue('saveforpq',false)==true)
       {
          addSelector();
          window.addEventListener('submit', newsubmit, true);
      }
    }
}


///////////////

//**********************************************************************//
/** Script for Project GC PQ Split Page **/
 function storeProjectGCInfo()
{//alert('storing');
    //Storing all the PQ slpit information for use in the New PQ page
    var inputlist = document.getElementById('inputlist');
    var li = inputlist.getElementsByTagName('li');

    for(var i=0;i<li.length;i++)
    {//alert(li[i].innerHTML);
        GM_setValue('li'+i,li[i].innerHTML);
    }
    GM_setValue('li'+i,''); //append a blank record

    var t=document.getElementsByClassName("table table-striped table-condensed")
    var tr=t[0].getElementsByTagName('tr');
    var td;
    var j=0;
    var strDateRange='';
    //clear some existing records
     j=tr.length;
     GM_setValue('daterange'+j,'');
    j--;
    GM_setValue('daterange'+j,'');

    //Now store the date ranges
       for(j=1;j<tr.length-1;j++)
       {
           td=tr[j].getElementsByTagName('td');
           strDateRange=td[0].innerHTML + ' - ' + td[1].innerHTML;
           GM_setValue('daterange'+j,strDateRange);

       }

    //add checkbox and label to summary row
    var lastRow = tr[tr.length-1];
    td=lastRow.getElementsByTagName('td');

    var label = document.createElement("label");
    label.innerHTML='&nbsp;Use results in PQ page&nbsp;&nbsp;&nbsp;&nbsp;&nbsp'
    td[0].insertBefore(label, td[0].firstChild);

    var chk=document.createElement("input");
    chk.type = "checkbox";
    chk.id='saveforpq';
    //alert(GM_getValue(chk.id,false));
    chk.checked=GM_getValue(chk.id,false);
    chk.addEventListener('click', saveChkValue, false);
    td[0].insertBefore(chk, td[0].firstChild);

}

function saveChkValue()
{
    GM_setValue(this.id,this.checked);
}


//*********************************************************//






//**********************************************************************//
/** Script for Geocaching New Query Page **/

function addSelector()
{//Add a dropdown to the page
 var p=document.getElementById("ctl00_ContentBody_tbName").parentElement;
 var el=document.createElement("br");
    p.appendChild(el);
    el=document.createElement("label");
    p.appendChild(el);
    el.innerHTML="<b>Project GC PQ Split Settings: </b>";

    el=document.createElement("select");
    p.appendChild(el);

    //Populate dropdown with stored data
    var i=1;
    var str=GM_getValue('daterange'+i,'');
    //alert(str);
    //alert(str.length);
    while(str.length>0)
    {
        var option = document.createElement("option");
        option.text = '#' + i + ' ' + str;
        option.value = i;
        el.appendChild(option);
        i++;
        str=GM_getValue('daterange'+i,'');
    }
    el.addEventListener('click',dropdown_click, false);
    el.addEventListener('change', dropdown_change, false);

    el=document.createElement("br");
    p.appendChild(el);
    el=document.createElement("label");
    p.appendChild(el);
    el.id='feedback';
}

function dropdown_click()
{
    if(changedflag==false){
        populatefields(this.options[this.selectedIndex].value);
    }
}
function dropdown_change()
{
    populatefields( this.options[this.selectedIndex].value);
}


function populatefields(i)
{

    var baseName ='';

    var str=GM_getValue('daterange'+i,'');
    setDateRange(str);

    str=PQName(i);
    settext("ctl00_ContentBody_tbName",str)

    settext("ctl00_ContentBody_tbResults","1000");

    i=0;
    str ='';
    str=GM_getValue('li'+i,'');
    while(str.length>0)
    {
        var s=str.split(':');
        switch(s[0])
        {
            case 'Country': setCountries(s[1].trim());break;
            case 'Type': setTypes(s[1].trim());break;
            case 'Size': setSizes(s[1].trim());break;
            case 'Region': setRegion(s[1].trim());break;
            case 'Difficulty': setDifficulty(s[1].trim());break;
            case 'Terrain': setTerrain(s[1].trim());break;

            case 'Hide found': setHideFound();break;
            case 'Hide owned': setHideOwned();break;
            case 'Hide not found': setHideNotFound();break;
            case 'Hide premium': setHidePremium();break;

            case 'Centre location': setCentreLocation(s[1].trim());break;
            case 'Max distance (mi)': setMaxDistanceMi(s[1].trim());break;

        }

        i++;
        str=GM_getValue('li'+i,'');

    }


	setcheckbox("ctl00_ContentBody_cbIncludePQNameInFileName",true);// include filename
    setradio("ctl00_ContentBody_rbPlacedBetween",true);
    changedflag=true;

}

//******************************************//


//********************************************//
function PQName(i)
{
    var str = gettext("ctl00_ContentBody_tbName");
    var basename='';

    if(str =='New Query')
    {
        basename=GM_getValue("basename",'');
    }else{
        if(str.indexOf(' ')>0) //contains space
        {

            var suffix = str.substr(str.lastIndexOf(' ')).replace("#", "").trim();

            if(isNaN(suffix)==false)
            {//remove numeirc suffix
                basename= str.substr(0,str.lastIndexOf(' '));
               // alert(basename);
            }else{
                basename=str;
            }

        }else{
            basename=str;
        }
        GM_setValue("basename",basename);
    }

    //str= baseName + ' ' + this.selectedIndex
    return basename + ' #' + i;
}
//********************************************//
 function setDifficulty(s)
{
    var d= s.split(',')
setcheckbox("ctl00_ContentBody_cbDifficulty",true);

   // this is complicated. If only one number has been selectd in Project GC, choose 'Equal to'
    // Project GC allows aly combination of numbers eg. 2,4.5 which teh PQ page doesn't
    // if the chosen reatings start at 1 or end at 5, we can choose the greater then /less than option
    // otherwise there is nothing we can do about it


if(d.length==1)
{
    setselect("ctl00_ContentBody_ddDifficulty",'equal to');
    setselect("ctl00_ContentBody_ddDifficultyScore",eval(d[0])); //val() has been used here to trim '.0' from the values where used

}else{
    if(eval(d[0])==1)
    {// eg 1,3 would choose 'less than or equal to 3'
        setselect("ctl00_ContentBody_ddDifficulty",'less than or equal to');
        setselect("ctl00_ContentBody_ddDifficultyScore",eval(d[d.length-1]));
    }else if(eval(d[d.length-1])==5)
    {//eg 2,5 would choose 'greater than or equal to 2'
        setselect("ctl00_ContentBody_ddDifficulty",'greater than or equal to');
        setselect("ctl00_ContentBody_ddDifficultyScore",eval(d[0]));
    }else{
     var feedback=document.getElementById('feedback');
        feedback.innerHTML='<font color=red>* D/T section not possible</font>'
        setcheckbox("ctl00_ContentBody_cbDifficulty",false);

      var dselect=document.getElementById('ctl00_ContentBody_ddDifficultyScore');
      dselect.addEventListener('click', clearFeedback, false);
    }
}
}
//**********************************///
function setTerrain(s)
{
    var d= s.split(',')
    setcheckbox("ctl00_ContentBody_cbTerrain",true);
    // this is complicated. If only one number has been selectd in Project GC, choose 'Equal to'
    // Project GC allows aly combination of numbers eg. 2,4.5 which teh PQ page doesn't
    // if the chosen reatings start at 1 or end at 5, we can choose the greater then /less than option
    // otherwise there is nothing we can do about it

if(d.length==1)
{
    setselect("ctl00_ContentBody_ddTerrain",'equal to');
    setselect("ctl00_ContentBody_ddTerrainScore",eval(d[0]));

}else{
 if(eval(d[0])==1)
    {// eg 1,3 would choose 'less than or equal to 3'
        setselect("ctl00_ContentBody_ddTerrain",'less than or equal to');
        setselect("ctl00_ContentBody_ddTerrainScore",eval(d[d.length-1]));
    }else if(eval(d[d.length-1])==5)
    {//eg 2,5 would choose 'greater than or equal to 2'
        setselect("ctl00_ContentBody_ddTerrain",'greater than or equal to');
        setselect("ctl00_ContentBody_ddTerrainScore",eval(d[0]));
    }else{
     var feedback=document.getElementById('feedback');
        feedback.innerHTML='<font style="color:red">* D/T selection not possible</font>'
        setcheckbox("ctl00_ContentBody_cbTerrain",false);
      var dselect=document.getElementById('ctl00_ContentBody_ddTerrainScore');
      dselect.addEventListener('click', clearFeedback, false);
    }
}

}
//***********************************
function clearFeedback()
{
    var feedback=document.getElementById('feedback');
    feedback.innerHTML='';
}

///***************************///
function setSizes(s)
{
    setradio("ctl00_ContentBody_rbContainerSelect",true)
    var t=s.split(',')
    for(var i=0; i<t.length;i++)
    {
       switch(t[i])
       {
       	case 'Large':
			setcheckbox("ctl00_ContentBody_cbContainers_3",true);//Large
			break;
       	case 'Micro':
			setcheckbox("ctl00_ContentBody_cbContainers_5",true);//Micro
			break;
		case 'Small':
			setcheckbox("ctl00_ContentBody_cbContainers_0",true);//Small
			break;
		case 'Virtual':
			setcheckbox("ctl00_ContentBody_cbContainers_2",true);//Virtual
			break;
		case 'Other':
			setcheckbox("ctl00_ContentBody_cbContainers_1",true);//Other
			break;
		case 'Regular':
			setcheckbox("ctl00_ContentBody_cbContainers_4",true);//Regular
			break;
		case 'Not chosen':
			setcheckbox("ctl00_ContentBody_cbContainers_6",true);//Unknown
			break;
	}//end switch
}//end for

}

//**************************//
function setTypes(s)
{
    setradio("ctl00_ContentBody_rbTypeSelect",true)
    var t=s.split(',')
    for(var i=0; i<t.length;i++)
    {
       switch( t[i])
       {
           case 'Traditional Cache':
               setcheckbox("ctl00_ContentBody_cbTaxonomy_0",true); //Traditional Geocache
               break;

           case 'Multi-cache':
               setcheckbox("ctl00_ContentBody_cbTaxonomy_1",true); //Multi-cache
               break;

           case 'Virtual Cache':
               setcheckbox("ctl00_ContentBody_cbTaxonomy_2",true); //Virtual Cache
               break;

           case 'Letterbox Hybrid':
               setcheckbox("ctl00_ContentBody_cbTaxonomy_3",true); //Letterbox Hybrid
               break;

           case 'Unknown Cache':
               setcheckbox("ctl00_ContentBody_cbTaxonomy_5",true); //Mystery Cache
               break;

           case 'Project APE Cache':
               setcheckbox("ctl00_ContentBody_cbTaxonomy_6",true); //Project APE Cache
               break;

           case 'Webcam Cache':
               setcheckbox("ctl00_ContentBody_cbTaxonomy_7",true); //Webcam Cache
               break;

           case 'Earthcache':
               setcheckbox("ctl00_ContentBody_cbTaxonomy_8",true); //EarthCache
               break;

           case 'GPS Adventures Exhibit':
               setcheckbox("ctl00_ContentBody_cbTaxonomy_9",true); //GPS Adventures Exhibit
               break;

           case 'Wherigo Cache':
               setcheckbox("ctl00_ContentBody_cbTaxonomy_10",true); //Wherigo Cache
               break;

           case 'Locationless (Reverse) Cache':
               //do nothing
               break;


           default:
               setcheckbox("ctl00_ContentBody_cbTaxonomy_4",true); //Event Cache
       }
    }
}
//////////////////////
function setCountries(s)
{setradio("ctl00_ContentBody_rbCountries",true);
    var c=s.split(',')
    for(var i=0; i<c.length;i++)
    {
        setselect("ctl00_ContentBody_lbCountries" ,c[i].trim());
    }
}
//********************************************************//
function setRegion(s)
{setradio("ctl00_ContentBody_rbStates",true);
    var c=s.split(',')
    //alert(c.length);
    for(var i=0; i<c.length;i++)
    {
        var r=c[i].split('|')
        //alert(r[1]);
        setselect("ctl00_ContentBody_lbStates" ,r[1]);
    }
}
//**************************************************************************//
function setDateRange(s)
{
    var d=s.replace(" - ", "/").split("/")

    setselect("ctl00_ContentBody_DateTimeBegin_Month",d[0]);
    setselect("ctl00_ContentBody_DateTimeBegin_Day",d[1]);
    setselect("ctl00_ContentBody_DateTimeBegin_Year",d[2]);
    if(d.length==6)
    {
        setselect("ctl00_ContentBody_DateTimeEnd_Month",d[3]);
        setselect("ctl00_ContentBody_DateTimeEnd_Day",d[4]);
        setselect("ctl00_ContentBody_DateTimeEnd_Year",d[5]);
    }else{
        setselect("ctl00_ContentBody_DateTimeEnd_Month",'December');
        setselect("ctl00_ContentBody_DateTimeEnd_Day",'31');
        var yy = new Date().getFullYear();
        setselect("ctl00_ContentBody_DateTimeEnd_Year",yy);

    }
}

function setHideFound()
{
    setcheckbox("ctl00_ContentBody_cbOptions_0",true); //I haven't found
}
function setHideOwned()
{
    setcheckbox("ctl00_ContentBody_cbOptions_2",true);//I don't own
}
function setHideNotFound()
{//I have found
    setcheckbox("ctl00_ContentBody_cbOptions_1",true);
}
function setHidePremium()
{
//Are available to all users
    setcheckbox("ctl00_ContentBody_cbOptions_4",true);
}



function setCentreLocation(s)
{
    setradio("ctl00_ContentBody_rbOriginWpt",true);
    //Centre location: N 53° 50.236 W 002° 24.147

    var co=s.replace(/°/gi, "").split(' ');

    setselect("ctl00_ContentBody_LatLong:_selectNorthSouth",co[0]);
    settext("ctl00_ContentBody_LatLong__inputLatDegs",co[1]);
    settext("ctl00_ContentBody_LatLong__inputLatMins",co[2]);

    setselect("ctl00_ContentBody_LatLong:_selectEastWest",co[3]);
    settext("ctl00_ContentBody_LatLong__inputLongDegs",co[4]);
    settext("ctl00_ContentBody_LatLong__inputLongMins",co[5]);
}

function setMaxDistanceMi(s)
{
    settext("ctl00_ContentBody_tbRadius",s)
    setradio("ctl00_ContentBody_rbUnitType_0",true); //miles
}

function setMaxDistanceKm(s)
{//untested
    settext("ctl00_ContentBody_tbRadius",s)
    setradio("ctl00_ContentBody_rbUnitType_1" ,true); //km
}





//********************************************************//
function isNewQuery()
{
   var p= document.getElementsByClassName("Success");
    if(p.length==0)
    {
        return(true)
    }else{return(false)}
}
//********************************************************//

function setselect(id,txt)
 {
 var s = document.getElementById(id)
 var l
    for (var i =0;i< s.length;i++)
    { l=s.options[i].text
        if(l==txt )
        { s.options[i].selected = true }
     }
 }


function settext(id,txt)
 {	// try{
		var s = document.getElementById(id)
		s.value=txt
	// }catch(err){ alert('settext error')}
 }

function gettext(id)
 {	// try{
		var s = document.getElementById(id)
		return(s.value)
	// }catch(err){ alert('settext error')}
 }

function setradio(id,value)
 {
 var s = document.getElementById(id)
 s.checked=value
 }

 function setcheckbox(id,value)
 {
 var s = document.getElementById(id)
 s.checked=value
 }

 function newsubmit(event)
{
    var target = event ? event.target : this;

	//var ns = document.getElementById('ctl00_ContentBody_LatLong:_selectNorthSouth').value
	//if(ns==-1){GM_setValue('NorthSouth', 'S')}
	//if(ns==1){GM_setValue('NorthSouth', 'N')}

	//ns = document.getElementById('ctl00_ContentBody_LatLong:_selectEastWest').value
	//if(ns==-1){GM_setValue('EastWest', 'W')}
	//if(ns==1){GM_setValue('EastWest', 'E')}

        // call real submit function
        this._submit();
}


(function() {
    'use strict';

    // Your code here...
})();