// ==UserScript==
// @name	 EHG support
// @namespace	 dijoyd&sg
// @version	 0.0.3
// @description	 heheda
// @include http://g.e-hentai.org/g/*
// @include http://r.e-hentai.org/g/*
// @include http://exhentai.org/g/*
// @icon    http://r.e-hentai.org/favicon.ico
// @require http://code.jquery.com/jquery-2.2.0.min.js
// @grant   none
// @downloadURL https://update.greasyfork.org/scripts/16011/EHG%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/16011/EHG%20support.meta.js
// ==/UserScript==

/////////////////////////////////////////////////////////////////////////////////////////////
const refreshtime=1000;
const TagHighEnable=1;
const TagLowEnable=1;
const RenameEnable=1;
const SearchEnable=1;
const ArtistEnable=1;
const ButtonCSSText="position:absolute;left:1285px;width:55px";
/////////////////////////////////////////////////////////////////////////////////////////////

ob=document.createElement('ehgs');
document.body.appendChild(ob);

{//tag high
function tagginghigh()
{  
  if((tagh[i].childNodes[0].className!=="")&&(i<tagh.length-1)){i++;}
  if(tagh[i].childNodes[0].className==="")
  {      
    tagh[i].childNodes[0].click();        
    document.getElementById("tagmenu_act").childNodes[3].click();        
  }
  if(i<tagh.length-1) {timeh=setTimeout(tagginghigh,refreshtime);}
}
if(TagHighEnable==1)
{
  ob1=document.createElement('button');		
  ob1.style.cssText=ButtonCSSText;
  ob1.style.top="50px";
  ob1.innerHTML="high";
  ob.appendChild(ob1);
  //document.body.appendChild(ob1);
  ob1.onclick=function(){tagh=document.getElementsByClassName('gt');i=0;tagginghigh();};
}
}
/////////////////////////////////////////////////////////////////////////////////////////////
{//tag low
function tagginglow()
{   
  if((tagl[i].childNodes[0].className!=="")&&(i<tagl.length-1)){i++;}
  if(tagl[i].childNodes[0].className==="")
  {      
    tagl[i].childNodes[0].click();        
    document.getElementById("tagmenu_act").childNodes[3].click();        
  }  
  if(i<tagl.length-1) {timel=setTimeout(tagginglow,refreshtime);}
}
if(TagLowEnable==1)
{
  ob2=document.createElement('button');	
  ob2.style.cssText=ButtonCSSText;
  ob2.style.top=(50+TagHighEnable*35).toString(10)+"px";
  ob2.innerHTML="low";
  ob.appendChild(ob2);
  //document.body.appendChild(ob2);
  ob2.onclick=function(){tagl=document.getElementsByClassName('gtl');i=0;tagginglow();};
}
}
/////////////////////////////////////////////////////////////////////////////////////////////
{//info
function blank_remove(str)
{
  str=str.slice(Number(str[0]==" "),str.length-Number(str[str.length-1]==" "));
  return(str);
}
/////////////////////////////////////////////////////////////////////////////////////////////
  na_gj_o=document.getElementById("gj").innerHTML;
  na_gn_o=document.getElementById("gn").innerHTML;
/////////////////////////////////////////////////////////////////////////////////////////////
function info()
{  
  na_gj=na_gj_o;
  na_gn=na_gn_o;
  if(na_gj===""){na_gj=na_gn;}
  {
  tempj=na_gj.match(/\[[^[]*\]/g);
  if(tempj!==null)
  {
    if(tempj.length==1){na_gj_title=na_gj.split(tempj[0])[1];}
    if(tempj.length>1){na_gj_title=blank_remove(na_gj.split(tempj[0])[1].split("[")[0]);}
  }
  else{na_gj_title=na_gj;}
  if(na_gj_title.search(/\([^\(\[]*\)/)>0)
  {
    na_gj_name=blank_remove(na_gj_title.split(/\([^\(\[]*\)/)[0]);
    na_gj_parody=blank_remove(na_gj_title.split(na_gj_name)[1]);
  }
  else
  {
    na_gj_name=blank_remove(na_gj_title);
    na_gj_parody="";
  }
  tempj=blank_remove(na_gj.split(na_gj_name)[0]);
  if(tempj[0]=="(")  
  {
    na_gj_event=tempj.match(/\([^\[]*\)/)[0];
    tempj=blank_remove(tempj.split(na_gj_event)[1]);
  }
  else{na_gj_event="";}
  if(tempj.search(/\(/)>-1)
  {
    na_gj_artist=tempj.match(/\([^\(\[\]]*\)/)[0].split("(")[1].split(")")[0];
    na_gj_group=blank_remove(tempj.match(/\[[^\]\)]*\(/)[0].split("[")[1].split("(")[0]);
  }
  else
  {
    na_gj_artist=blank_remove(tempj.split("[")[1].split("]")[0]);
    na_gj_group="";
  }
  if(na_gj_parody===""){tempj=na_gj.split(na_gj_name)[1];}
  else{tempj=na_gj.split(na_gj_parody)[1];}
  tempj=blank_remove(tempj);
  if(tempj.indexOf("[無修正]")!=-1)
  {
    na_gj_uncensored="[無修正]";
    tempj=blank_remove(tempj.replace("[無修正]",""));
  }
  else
  {
    na_gj_uncensored="";
    tempj=blank_remove(tempj);
  }  
  if((tempj.indexOf("[Digital]")!=-1)||(tempj.indexOf("[DL版]")!=-1))
  {
    na_gj_digital="[DL版]";
    tempj=blank_remove(tempj.replace("[Digital]","").replace("[DL版]",""));
  }
  else
  {
    na_gj_digital="";
    tempj=blank_remove(tempj);
  }
  if(tempj.indexOf("[中国翻訳]")!=-1){na_gj_lang="[中国翻訳]";}
  else if(tempj.indexOf("[中国語]")!=-1){na_gj_lang="[中国語]";}
  else if(tempj.indexOf("[中訳]")!=-1){na_gj_lang="[中訳]";}
  else if(tempj.indexOf("[中文]")!=-1){na_gj_lang="[中文]";}  
  else {na_gj_lang="";}
  }
/////////////////////////////////////////////////////////////////////////////////////////////  
  {
  tempn=na_gn.match(/\[[^[]*\]/g);
  if(tempn!==null)
  {
    if(tempn.length==1){na_gn_title=na_gn.split(tempn[0])[1];}
    if(tempn.length>1){na_gn_title=blank_remove(na_gn.split(tempn[0])[1].split("[")[0]);}
  }
  else{na_gn_title=na_gn;}
  if(na_gn_title.search(/\([^\(\[]*\)/)>0)
  {
    na_gn_name=blank_remove(na_gn_title.split(/\([^\(\[]*\)/)[0]);
    na_gn_parody=blank_remove(na_gn_title.split(na_gn_name)[1]);
  }
  else
  {
    na_gn_name=blank_remove(na_gn_title);
    na_gn_parody="";
  }
  tempn=blank_remove(na_gn.split(na_gn_name)[0]);
  if(tempn[0]=="(")  
  {
    na_gn_event=tempn.match(/\([^\[]*\)/)[0];
    tempn=blank_remove(tempn.split(na_gn_event)[1]);
  }
  else{na_gn_event="";}
  if(tempn.search(/\(/)>-1)
  {
    na_gn_artist=tempn.match(/\([^\(\[\]]*\)/)[0].split("(")[1].split(")")[0];
    na_gn_group=blank_remove(tempn.match(/\[[^\]\)]*\(/)[0].split("[")[1].split("(")[0]);
  }
  else
  {
    na_gn_artist=blank_remove(tempn.split("[")[1].split("]")[0]);
    na_gn_group="";
  }
  if(na_gn_parody===""){tempn=na_gn.split(na_gn_name)[1];}
  else{tempn=na_gn.split(na_gn_parody)[1];}
  tempn=blank_remove(tempn);
  if((tempn.indexOf("[Decensored]")!=-1)||(tempn.indexOf("[decensored]")!=-1)||(tempn.indexOf("[DECENSORED]")!=-1)||
     (tempn.indexOf("[Uncensored]")!=-1)||(tempn.indexOf("[uncensored]")!=-1)||(tempn.indexOf("[UNCENSORED]")!=-1))
  {
    na_gn_uncensored="[Decensored]";
    tempn=blank_remove(tempn.replace("[Decensored]","").replace("[decensored]","").replace("[DECENSORED]","")
                            .replace("[Uncensored]","").replace("[uncensored]","").replace("[UNCENSORED]",""));
  }
  else
  {
    na_gn_uncensored="";
    tempn=blank_remove(tempn);
  }  
  if((tempn.indexOf("[Digital]")!=-1)||(tempn.indexOf("[DL版]")!=-1))
  {
    na_gn_digital="[DL版]";
    tempn=blank_remove(tempn.replace("[Digital]","").replace("[DL版]",""));
  }
  else
  {
    na_gn_digital="";
    tempn=blank_remove(tempn);
  }
  if((tempn.indexOf("[Chinese]")!=-1)||(tempn.indexOf("[chinese]")!=-1)||(tempn.indexOf("[CHINESE]")!=-1))
  {
    na_gn_lang="[Chinese]";
    tempn=blank_remove(tempn.replace("[Chinese]","").replace("[chinese]","").replace("[CHINESE]",""));
  }
  else
  {
    na_gn_lang="";
    tempn=blank_remove(tempn);
  }
  na_gn_trans=blank_remove(tempn.replace("【","[").replace("】","]").replace("{","[").replace("}","]"));
  }
}
}
/////////////////////////////////////////////////////////////////////////////////////////////
{//rename
function rename()
{
  info();
  if(na_gj_lang!=="") 
    {document.getElementById("gj").innerHTML=na_gj_o.replace(na_gj_lang,na_gn_trans);}
  else if(na_gn_trans==="")
    {document.getElementById("gj").innerHTML=na_gj_o;}
  else
    {document.getElementById("gj").innerHTML=na_gj_o+" "+na_gn_trans;}
}
if(RenameEnable==1)
{
  ob3=document.createElement('button');
  ob3.style.cssText=ButtonCSSText;
  ob3.style.top=(50+(TagHighEnable+TagLowEnable)*35).toString(10)+"px";
  ob3.innerHTML="rename";
  ob.appendChild(ob3);
  //document.body.appendChild(ob3);
  ob3.onclick=function(){rename();};
}
}
/////////////////////////////////////////////////////////////////////////////////////////////
{//search gallery
function reclass()
{
  rc=document.getElementById("gdc").childNodes[0].childNodes[0].alt;  
  if((rc=="doujinshi")|| ($("[href='http://exhentai.org/tag/reclass%3Adoujinshi']").length>0) ) {rd=1;}  else {rd=0;}
  if((rc=="manga")    || ($("[href='http://exhentai.org/tag/reclass%3Amanga']").length>0) )     {rm=1;}  else {rm=0;}
  if((rc=="artistcg") || ($("[href='http://exhentai.org/tag/reclass%3Aartistcg']").length>0) )  {rac=1;} else {rac=0;}
  if((rc=="gamecg")   || ($("[href='http://exhentai.org/tag/reclass%3Agamecg']").length>0) )    {rg=1;}  else {rg=0;}
  if((rc=="western")  || ($("[href='http://exhentai.org/tag/reclass%3Awestern']").length>0) )   {rw=1;}  else {rw=0;}
  if((rc=="non-h")    || ($("[href='http://exhentai.org/tag/reclass%3Anon-h']").length>0) )     {rn=1;}  else {rn=0;}
  if((rc=="imageset") || ($("[href='http://exhentai.org/tag/reclass%3Aimageset']").length>0) )  {ri=1;}  else {ri=0;}
  if((rc=="cosplay")  || ($("[href='http://exhentai.org/tag/reclass%3Acosplay']").length>0) )   {rcp=1;} else {rcp=0;}
  if((rc=="asianporn")|| ($("[href='http://exhentai.org/tag/reclass%3Aasianporn']").length>0) ) {rap=1;} else {rap=0;}
  if((rc=="misc")     || ($("[href='http://exhentai.org/tag/reclass%3Amisc']").length>0) )      {rmi=1;} else {rmi=0;}
}
/////////////////////////////////////////////////////////////////////////////////////////////
function search()
{
  info();
  reclass();
  SearchUrl=(window.location.href.split("/g/")[0]+
       "/?f_doujinshi="+ rd +"&f_manga="+ rm +"&f_artistcg="+ rac +
       "&f_gamecg="+ rg +"&f_western="+ rw +"&f_non-h="+ rn +"&f_imageset="+ ri +
       "&f_cosplay="+ rcp +"&f_asianporn="+ rap +"&f_misc="+ rmi +
       "&f_apply=Apply+Filter&f_search="+"\""+ na_gj_name +"\"");
  window.open(SearchUrl);
}
if(SearchEnable==1)
{
  ob4=document.createElement('button');
  ob4.style.cssText=ButtonCSSText;
  ob4.style.top=(50+(TagHighEnable+TagLowEnable+RenameEnable)*35).toString(10)+"px";
  ob4.innerHTML="search";
  ob.appendChild(ob4);
  //document.body.appendChild(ob4);
  ob4.onclick=function(){search();};
}
}
/////////////////////////////////////////////////////////////////////////////////////////////
{//artist
function artist()
{
  info();
  ArtistFolderName=na_gj_artist+"("+na_gn_artist.toLowerCase()+")";
  if(na_gj_group!==""){ArtistFolderName=ArtistFolderName+"【"+na_gj_group+"("+na_gn_group.toLowerCase()+")】";}
  document.getElementById("gj").innerHTML=ArtistFolderName;
}
if(ArtistEnable==1)
{
  ob5=document.createElement('button');
  ob5.style.cssText=ButtonCSSText;
  ob5.style.top=(50+(TagHighEnable+TagLowEnable+RenameEnable+SearchEnable)*35).toString(10)+"px";
	ob5.innerHTML="artist";
  ob.appendChild(ob5);
  //document.body.appendChild(ob5);
  ob5.onclick=function(){artist();};
}
}
/////////////////////////////////////////////////////////////////////////////////////////////