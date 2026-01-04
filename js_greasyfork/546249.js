// ==UserScript==
// @name         Toggle Trains
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Display enhancements for Real Time Trains and Rail Advent Railtours pages
// @author       Mark Sreeves
// @match        https://www.railadvent.co.uk/steam-locomotives-on-the-mainline*
// @match        https://www.railadvent.co.uk/railtours*
// @match        https://www.railadvent.co.uk/events/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=railadvent.co.uk
// @match       https://www.realtimetrains.co.uk/*
// @grant		GM_getValue
// @grant		GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/546249/Toggle%20Trains.user.js
// @updateURL https://update.greasyfork.org/scripts/546249/Toggle%20Trains.meta.js
// ==/UserScript==

   var url=document.URL;

    //Variables for the state of each button
    var flag=[false,false,false,false];
   var adState='block';
    var tocFlag='';
    var tocArray='';
var hiddenElementList='';
var hideRTTads=true;

window.addEventListener('load', function () {
  // do something here ...

    loadSavedSettings();
}, false);

 if(url.indexOf('railadvent.co.uk/events')>0)
    {
        addLink()
    }else if(url.indexOf('www.railadvent.co.uk')>0)
    {
       railadvent_create_buttons();

       railadvent_createMissingSubTitles()


    }else if(url.indexOf('realtimetrains.co.uk')>0)
    {
        run_rtt_functions()

    }


/*******************************************************************/

function run_rtt_functions()
{try{

         rtt_setDefaultValues()
         rtt_listTOCs()

         realtimetrains_create_buttons();

        if(url.indexOf('service')>0)
        {rtt_highlightRow()}


      }
  catch(err) {
  alert(err.message + ' run_rtt_functions');
 }
}
/*******************************************************************/
function rtt_listTOCs()
{
    try{
        var el=document.getElementsByClassName('servicelist');
        if(el.length>0)
        {
            var a=el[0].getElementsByTagName('a');
            var strout='';
        if(document.body.innerHTML.indexOf('(Q)') > 0)
        {
            strout+='(Q),'
        }

        if(document.body.innerHTML.indexOf('>Cancel<') > 0)
        {
            strout+='Cancel,'
        }

        for(var i=0;i<a.length;i++)
        {
            var toc=a[i].getElementsByClassName('toc');

              if(toc.length>0){
                var t=toc[0].innerHTML
                if(strout.indexOf(t)<0)
                {
                    strout+=t+','
                }
            }
        }

        tocArray= strout.split(',').sort();

        tocFlag=new Array(tocArray.length)

        for (i=0; i<tocFlag.length;i++)
        {
            tocFlag[i] = false;
        }
        }
    }
  catch(err) {
  alert(err.message + ' rtt_listTOCs()');
 }
}



/*******************************************************************/

function realtimetrains_create_buttons()
{
    try{
    //var el=document.getElementsByClassName('clearfix hour_buttons');'

        var el=document.getElementsByClassName('hour_buttons');
        if (typeof el[0] == 'undefined') {return}
        /* List styles for development
        var styles = window.getComputedStyle(el[0]);
        var strout=''
       for (var i = 0; i < styles.length; i++) {
            var key=styles[i]
            var value = styles.getPropertyValue(key)
            strout+=key +' ' + value +'\n'
           }
        alert(strout)
       */

        //Remove style parts to make buttons align to the left
       // el[0].style.setProperty('-moz-box-pack', 'unset')
        //el[0].style.setProperty('justify-content', 'unset')

        el[0].style.setProperty('display', 'flex')
        el[0].style.setProperty('flex-wrap', 'wrap')
        //el[0].style.setProperty('gap', '0.5em')
        el[0].style.setProperty('gap', '0')
        el[0].style.setProperty('justify-content', 'flex-start')

        el[0].innerHTML='' // Remove the existing buttons and banner


        //Add buttons to the web page

       var bu = document.createElement('a');
       /*
       bu.innerHTML='Toggle Ads';
       bu.id='google';
       bu.className='hollow button small float-left'
        bu.addEventListener('click', RTT_hideAds_buttonClick, false);
       el[0].append(bu);

         bu = document.createElement('a');
         */
        bu.innerHTML='Unhide All';
        bu.id='x';
        bu.title='Unhide All';
        bu.className='hollow button small float-left'
        bu.addEventListener('click', realtimetrains_ToggleElements, false);
        el[0].append(bu);




    //Add buttons to the web page
    for(var i=1;i<tocArray.length;i++)
    {
        bu = document.createElement('a');
        bu.innerHTML='Toggle ' + tocArray[i];
        bu.id=i;
        bu.title='Toggle ' + tocArray[i];
        bu.className='hollow button small float-left'
        bu.addEventListener('click', realtimetrains_ToggleElements, false);
        el[0].append(bu);
    }

      }
  catch(err) {
  alert(err.message + ' realtimetrains_create_buttons()');
 }

}

/*******************************************************************/

function realtimetrains_ToggleElements()
{
    try{
    if(this.id=='x')
    {hiddenElementList='';
        for(var i=0;i<tocFlag.length;i++)
        {tocFlag[i]=false}

    }else{

        tocFlag[this.id]=!tocFlag[this.id];
        if(tocFlag[this.id]==true)
        {
            hiddenElementList += ',' + tocArray[this.id]
        }else{
            hiddenElementList = hiddenElementList.replaceAll(',' + tocArray[this.id],'');
        }
    }
    GM_setValue('rtt_hiddenElementList',hiddenElementList);
    realtimetrains_ShowHideElements();

         }
  catch(err) {
  alert(err.message + ' realtimetrains_ToggleElements()');
 }
}

function realtimetrains_ShowHideElements()
{
    try{
    var eventList=document.getElementsByClassName('servicelist');
    if (typeof eventList[0] == 'undefined') {return}

    var elm = eventList[0].getElementsByTagName('a');
    var hide=false;


   //  alert(flag[this.id])
   // GM_setValue('rttflag'+this.id,flag[this.id]);

        for(var i=0;i<elm.length;i++)
        {
            hide=false;
            for(var j=0;j<tocArray.length;j++)//
            {
                //alert(tocArray[j] + ' ' + tocFlag[j])
            //alert(elm[i].innerHTML);

                if(elm[i].innerHTML.indexOf('>'+tocArray[j]+'<')>0)
                {
                    hide=hide||tocFlag[j];
                }
            }

            if (hide==false) {
                if(elm[i].style.display == 'none'){
                    elm[i].style.display = ''
                }
                //elm[i].style.display = "inline-block";
            } else {
                elm[i].style.display = 'none'; // Hide
            }
       }//end of for


         }
  catch(err) {
  alert(err.message + ' realtimetrains_ShowHideElements()');
 }


}//end of function


/*******************************************************************/

function loadSavedSettings()
{try{
    if(url.indexOf('www.railadvent.co.uk')>0)
    {
      // removed because teh page takes too log to load
      // flag[0]=GM_getValue('raflag0',false);
      // flag[1]=GM_getValue('raflag1',false);
      // flag[2]=GM_getValue('raflag2',false);
      // flag[3]=GM_getValue('raflag3',false);
       //alert(flag[0] + ' ' + flag[1] + ' ' + flag[2]+ ' ' + flag[3])
      // railadvent_ShowHideElements();

    }else if(url.indexOf('realtimetrains.co.uk')>0)
    {
        hiddenElementList = GM_getValue('rtt_hiddenElementList',hiddenElementList);
        for(var i=0;i<tocArray.length;i++)
        {
            tocFlag[i]=hiddenElementList.indexOf(tocArray[i])>0;
        }
        realtimetrains_ShowHideElements()

        //hideRTTads=GM_getValue('hideRTTads',false);
        if(hideRTTads==true){RTT_hideAds()}
    }


      }
  catch(err) {
  alert(err.message + ' loadSavedSettings()');
 }
}



/********** Rail Advent Railtours Page *******************************************/
function railadvent_create_buttons()
{//Add buttons to the web page
    var el=document.getElementsByClassName('evo_cal_above_content');
    var caption=["Jacobite", "\'Timings?: No\'", "Passed","Cancelled"];

    var bu = document.createElement('button');
        bu.innerHTML='Unhide All';
        bu.id='x';
        bu.addEventListener('click', railadvent_ToggleElements, false);
    //bu.addEventListener('click', railadvent_fix_style, false);

        el[0].append(bu);

    for(var i=0;i<caption.length;i++)
    {
        bu = document.createElement('button');
        bu.innerHTML='Toggle ' + caption[i];
        //bu.innerHTML='Toggle ' + caption[i] + ' ' + i + ' ' + flag[i]
        bu.id=i;
        bu.addEventListener('click', railadvent_ToggleElements, false);
        el[0].append(bu);
   }
    //hide ads
    bu = document.createElement('button');
    bu.innerHTML='Toggle Ads';
    //bu.id=i;
    bu.addEventListener('click', railadvent_ShowHideAds, false);
    el[0].append(bu);



}

/*******************************************************************/
function railadvent_ToggleElements()
{//alert(this.id);
     if(this.id=='x')
     {
         for(var i=0;i<flag.length;i++)
         {
             flag[i]=false;
          //   GM_setValue('raflag'+i,flag[i]);
         }
     }else{

    flag[this.id]=!flag[this.id];


   // GM_setValue('raflag'+this.id,flag[this.id]);
         //alert('raflag'+this.id + '' + GM_getValue('raflag'+this.id,'xxx'));
     }
    railadvent_ShowHideElements()
}



/*******************************************************************/
function railadvent_fix_style()
{

    try{
        var eventList=document.getElementById('evcal_list');
    var elm = eventList.getElementsByTagName('div');
    var a
    var classText=''
        for(var i=0;i<elm.length;i++)
        {
            a=elm[i].getElementsByTagName('a');
            for(var j=0;j<a.length;j++)
            {
             classText=a[j].className.replaceAll('desc_trig','');
               a[j].className= classText;
            }


        }
 }
  catch(err) {
  alert(err.message);
 }
}


function railadvent_ShowHideAds()
{
    if(adState=='block')
    {adState='none'}else{adState='block'}


    //var eventList=document.getElementById('evcal_list');
    var elm = document.getElementsByTagName('div');
     for(var i=0;i<elm.length;i++)
        {
            if(elm[i].className.indexOf('raila')>-1)
            {//alert('x')
             elm[i].style.display = adState;
            }
        }

         elm=document.getElementById('onesignal-bell-container')
        if(elm!=null){elm.style.display = adState}

        elm=document.getElementById('mys-wrapper')
        if(elm!=null){elm.style.display = adState}

    elm=document.getElementsByClassName('google-auto-placed');
    for( i=0;i<elm.length;i++)
        {
             elm[i].style.display = adState;
        }




}
/*******************************************************************/
function railadvent_ShowHideElements()
{
        var eventList=document.getElementById('evcal_list');
        var elm = eventList.getElementsByTagName('div');
        var hide=false;

        for(var i=0;i<elm.length;i++)
        {
            hide=false;
            if(elm[i].innerHTML.indexOf('Jacobite')>0){hide=hide||flag[0];}

            if(elm[i].innerHTML.indexOf('>No<')>0){hide=hide||flag[1];}

            if(elm[i].className.indexOf('past_event')>0){hide=hide||flag[2];}

            if(elm[i].className.indexOf('cancelled')>0){hide=hide||flag[3];}

            if (hide==false) {
               elm[i].style.display = "block";
             } else {
               elm[i].style.display = "none";
             }
         }//end of for

    }//end of function

/*******************************************************************/






function showDetails()
{
var d=document.getElementsByClassName('eventon_full_description');
var strBody = document.body.innerHTML;
d[0].innerHTML= eventDetailHeading() + getDescription(strBody)
}

/////////////////////////////////////////////////////////////////////

function getDescription(strin)
{try{
   var pos=strin.indexOf('"description":')
    var retval=strin.substring(pos+15)
    pos=retval.indexOf('"}')
    retval=retval.substring(0, pos)
   // alert(retval)
   // alert(retval.length)
    return retval;

}catch(err) {
  alert(err.message);
 }
}
/*******************************************/
function getRRTUrl()
{

try{
   var strBody = document.body.innerHTML;
    var rrtUrl=''
 var pos=strBody.indexOf('realtimetrains.co.uk')
 if(pos>0){
     rrtUrl=strBody.substring(pos)
     rrtUrl='http://www.' + rrtUrl
     rrtUrl= rrtUrl.substring(0, rrtUrl.indexOf('>')-1)
     return rrtUrl
 }

}catch(err) {
  alert(err.message);
 }
}

function eventDetailHeading(){
    return '<h3 class="padb5 evo_h3"><span class="evcal_evdata_icons"><i class="fa fa-align-justify"></i></span>Event Details<br></h3>'
}

function addLink()
{try{

    var el=document.getElementsByClassName('padb5 evo_h3');
    //alert(el.length)
    var a = document.createElement('a');
    var linkText = document.createTextNode('Show Details');
    a.appendChild(linkText);
     a.href='#';
	a.addEventListener('click', showDetails, false);
    el[1].appendChild(document.createTextNode (" "));
    el[1].append(a);
    //el[0].prepend(a)

 }
  catch(err) {
  alert(err.message);
 }
}

///////////////////
function eventSubTitle(strin)
{
    var strout ='<span class="evoet_subtitle evo_below_title">\n'
		strout+='<span class="evcal_event_subtitle ">\n'
		strout+=strin +'\n'
		strout+='</span>\n'
	strout+='</span>\n'
    return strout
}


function cleanup(strin)
{
 var pos=strin.indexOf('detailed')

    var retval=strin.substring(pos)
    retval=retval.replaceAll('<strong>','')
    pos=retval.indexOf('>')
    retval= retval.substring(pos+1)
    pos=retval.indexOf('<')
    return retval.substring(0, pos)
}


//////////////////////////////////////////////////
function railadvent_createMissingSubTitles()
{try{


//var evo=document.getElementsByClassName('evo_event_schema');
    var eventList=document.getElementById('evcal_list');
        var elm = eventList.getElementsByTagName('div');
   var span=''
var d=''
for(var i=0;i<elm.length;i++)
{
    if(elm[i].className.indexOf('eventon_list_event')>-1)
    {

        if(elm[i].innerHTML.indexOf('evoet_subtitle evo_below_title')<=0)
           {//no subtitle
               span=elm[i].getElementsByTagName('span');
               for(var j=0;j<span.length;j++)
               {
                   d=cleanup(getDescription(elm[i].innerHTML))
                   if(span[j].className.indexOf('evoet_c3')>-1)
                   {
                       span[j].appendChild(document.createTextNode (d));
                   }
               }
           }

}
}


}catch(err) {
  alert(err.message);
 }
}




function RTT_hideAds_buttonClick(){
hideRTTads=!hideRTTads;
     GM_setValue('hideRTTads',hideRTTads);
if(hideRTTads==true)
{
    RTT_hideAds()
}
}
function RTT_hideAds(){
    var elm = document.getElementsByTagName('div');
        for(var i=0;i<elm.length;i++)
        {
            if(elm[i].innerHTML.indexOf('data-google')>0){
            //elm[i].style.display = "none";
            }

            if(elm[i].className.indexOf('ad-wrapper')>-1){

            elm[i].style.display = "none";
            }
             if(elm[i].className.indexOf('ad-unit stickyspacer')>-1){

            elm[i].style.display = "none";
            }
            if(elm[i].className.indexOf('ci-bg')>-1){

            elm[i].style.display = "none";
            }

        }
//if(hideRTTads==true){
    var myTimeout = setTimeout(RTT_hideAds, 1000);
//}
}




function rtt_addMenuItem(){
    try{
    var menu=document.getElementsByClassName('menu');
        //alert(menu.length)
        if(menu[0]!=null)
        {
            var li = document.createElement('li');
            var linkText = document.createTextNode('Toggle Adverts');
            li.appendChild(linkText);
            li.title = 'Toggle Adverts';
            li.href='#';
            li.addEventListener('click', RTT_hideAds_buttonClick, false);

            menu[0].appendChild(li)
        }




   }catch(err) {
  alert(err.message);
 }
}

function rtt_setDefaultValues()
{try{

    var pos = url.indexOf('.co.uk');
    var urlpath = ''
    if (pos !== -1)
    {
        urlpath = url.substring(pos +6);

        //This is the bare url so redirect to saved location
        if(urlpath=='/')
        {
            let today = new Date().toISOString().split('T')[0];
            let loc= GM_getValue('loc',null)
            if(loc!=null){
                window.location.href= url + 'search/detailed/gb-nr:'+ loc +'/'+ today +'/0000-2359?stp=WVS&show=all&order=wtt'
            }
        }

    }

    pos = url.indexOf('search');
//We don't want to save the info from a 'service' page
     if (pos !== -1)
    {
        const match = url.match(/gb-nr:([^/?]+)/);
        var loc= match ? match[1] :null;

        GM_setValue('loc',loc)

    }
   }catch(err) {
  alert(err.message);
 }
}







function rtt_highlightRow()
{try{

    var loc= GM_getValue('loc','XXXXXX')
    var row=document.getElementsByClassName('location')
    if(row.length>0){
        for(var i=0;i<row.length;i++)
        {
            if(row[i].innerHTML.indexOf('gb-nr:'+ loc)>=0)
            {
                row[i].style.backgroundColor = "yellow";
            }
        }
    }

 }
  catch(err) {
  alert(err.message + '  highlightRow()');
 }
}





