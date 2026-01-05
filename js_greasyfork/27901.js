// ==UserScript==
// @author         r3b31 
// @license        GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @name           PlanetDP
// @version        4.7.1
// @description    Adds title search links to the most popular torrent sites.
// @include        http://www.imdb.*/title/*
// @include        http://imdb.*/title/*
// @include        http://akas.imdb.*/title/*
// @include        http://www.akas.imdb.*/title/*
// @include        *rarbg.to*
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant   	   GM_addStyle
//original script by mungushume forked by r3b31, includes code from other open source scripts
// @namespace https://greasyfork.org/users/3202
// @downloadURL https://update.greasyfork.org/scripts/27901/PlanetDP.user.js
// @updateURL https://update.greasyfork.org/scripts/27901/PlanetDP.meta.js
// ==/UserScript==

//Remove ads
var divs = document.getElementsByTagName('div');
for (var i = 0; i < divs.length; i++)
    {
	if ((divs[i].id == 'injected_billboard')||(divs[i].id == 'injected_navstrip')||(divs[i].id == 'navboard')||(divs[i].id == 'top_ad')||(divs[i].id == 'top_rhs')||(divs[i].class == 'article native-ad-promoted-provider'))
	    divs[i].style.display = 'none';
     }

// Remove all iframes (only used for ads)
var iframes = document.getElementsByTagName('iframe');
for (var i = 0; i < iframes.length; i++)
    iframes[i].style.display = 'none';
//end of ad remover code

//Rarbg - remove sponsored results by Gingerbread Man
//https://greasyfork.org/en/scripts/5755-rarbg-remove-sponsored-results
var rarbg = document.querySelectorAll('[onclick="dd_pp_f_d();"]');
if (rarbg.length > 0) {
  for (i = 0, j = rarbg.length; i < j; i++) {
    var eachrow = rarbg[i].parentNode.parentNode;
    eachrow.parentNode.removeChild(eachrow);
  }
}

//gets the title and year of the movie
function getTitle () { 
   var metas = document.getElementsByTagName('meta'); 

   for (i=0; i<metas.length; i++) { 
      if (metas[i].getAttribute("property") == "og:title") { 
         return metas[i].getAttribute("content"); 
      } 
   } 
    return "";
}

//gets imdb code
var imdb_regex = /\/title\/tt(\d{7})\//;
var id = imdb_regex.exec(window.location.href)[1];

//where to display the icons
var div = document.evaluate ("//div[@class='subtext']", document, null,
XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

//get title only
var title = document.evaluate ("//div[@class='title_wrapper']//h1", document, null,
XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

var year = getTitle();



if(div && title && year){

    title = title.cloneNode(true);

    var spant = document.evaluate (".//span", title, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if(spant)
    {
        title.removeChild(spant);
    }

    var titlet = title.innerHTML;
    var yeart = year;

    titlet = titlet.replace("&nbsp;",""); //delete nobreak space
    titlet = titlet.replace(/\<br\>[\s\S]*/g, ""); //remove original title
    titlet = titlet.replace(/^\s+|\s+$/g, ''); //trim the title
    titlet = titlet.replace(/[\/\\#,+()$~%.'":*?<>{}]/g, ""); //remove bad chars
    titlet = titlet.replace("&amp;","%26");//replace & with code  
    yeart = yeart.replace(/[^0-9.]/g, "");//keep numbers only
  
    if( getTitle().indexOf("TV Series") >= 0){var txt = titlet;}
    else{var txt = (titlet+" "+yeart);}//only use year in movies

    var tab = div.insertBefore(document.createElement("table"), div.firstChild);

    tab.id = "gm_links";
    _addStyle("@namespace url(http://www.w3.org/1999/xhtml); #gm_links td { width:50px; padding:0px } #gm_links img { margin:0 1px 0 0 } #gm_links a { vertical-align:top; font-weight:bold };");

    var tr = tab.appendChild(document.createElement("tr"));
    
    
	
     //extratorrent

    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAA"+
"AAAAAADIvb7/xry9/8e8vf/Ivb7/yL2+/8i9vv/Ivb7/yL2+/8i9vv/Ivb7/yL2+/8i9vv/Ivb7/"+
"x7y9/8a8vf/Ivb7/xry9//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+"+
"/v7//v7+//7+/v/+/v7/xry9/8e8vf/8/Pz//Pz8/5OTkv9qSRj/akkY/2tKGf9rShn/a0oZ/2tK"+
"GP9qSRj/Tzoc/4iEff/8/Pz//Pz8/8e8vf/HvL3/+/v7//v7+/+Hf3P/4bd0/+G3dP/ht3T/4bd0"+
"/+G3dP/ht3T/4bd0/3hgOv9xbmr/+/v7//v7+//HvL3/x7y9//f4+P/3+Pj/hHxx/+zAfP/swHz/"+
"7MB8/3xzaP9yal3/cmpd/3JqXf98c2b/xcPB//f4+P/3+Pj/x7y9/8e8vf/29vb/9vb2/4V9cf/t"+
"xYX/7cWF/2RSNv/Nz8//zs/R/87P0P/Mzs7/29va//f39//29vb/9vb2/8e8vf/HvL3/8/Pz//Pz"+
"8/+IgHP/78yU/+/MlP94YDr/8vLy//Ly8v/y8vL/8vLy//Ly8v/09PT/8/T0//Lz8//HvL3/x7y9"+
"//Ly8v/y8vL/h4F5/+/Pnf/vz53/kHdP/3hgOv94YDr/eWE7/3hgOv9USDf/5eLd//Ly8v/y8vL/"+
"x7y9/8e8vf/w8PD/8PDw/4eBef/t0Kf/7dCn/+3Qp//t0Kf/7dCn/+3Qp//t0Kf/VEg3/9vb2v/w"+
"7+//8PDw/8e8vf/HvL3/7u3u/+7t7v+Gg33/7dm8/+3ZvP/Txa7/cW5r/3Fua/9xbmv/d3Rv/62r"+
"qf/o5+f/7u3u/+7t7v/HvL3/x7y9/+vr6//r6+v/h4F4/+/l0P/v5dD/XFVM/8XHx//Fx8f/xcfH"+
"/8TGxv/r7Ov/6+vr/+vr6//r6+v/x7y9/8e8vf/p6un/6erp/4eAeP/58+b/+fPm/4iEff93dG7/"+
"fXl0/356df99eXT/bGlj/5OTkf/p6un/6erp/8e8vf/HvL3/6Ofn/+fn5/+GgHj/5uPd/+bj3f/m"+
"493/5uPd/+bj3f/m493/5uPd/3Z2df9vb2//6Ofn/+fn5//HvL3/x7y9/+fn5//n5+f/raqo/3Z2"+
"df94eHj/d3d2/3h4ef95eXn/eHh4/3h4eP94eHj/ramo/+fn5//n5+f/x7y9/8a8vf/l5eX/5eXl"+
"/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/+Xl5f/l5eX/5eXl/8a8vf/Ivb7/"+
"xry9/8e8vf/Ivb7/yL2+/8i9vv/Ivb7/yL2+/8i9vv/Ivb7/yL2+/8i9vv/Ivb7/x7y9/8a8vf/I"+
"vb7/AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA"+
"//8AAP//AAD//w==";

    buildCell(tr, "ExtraTorrent","http://extratorrent.cc/search/?search="+titlet+"&new=1&x=0&y=0", img);
             
    //OpenSubtitles

    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAAEgAAABIAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/"+
"//////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAD///////8AAAD/"+
"//////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACqqqr///////+qqqoAAAAAAADMzMzu7u7///////9V"+
"VVUAAAAAAAAAAAAAAAB3d3eZmZkAAAAAAACZmZmIiIgAAACIiIgAAAAAAABERETd3d0AAAAAAAAA"+
"AAAAAADu7u4REREAAAAAAAARERHu7u4AAABERET////////d3d0zMzMAAAAAAAAAAAAAAADd3d0i"+
"IiIAAAAAAAARERHd3d0AAADd3d1EREQAAAAAAAAAAAAAAAAAAAAAAAAAAAB3d3eZmZkAAAAAAACq"+
"qqp3d3cAAADMzMxEREQAAAARERHd3d0AAAAAAAAAAAAAAAAAAACZmZn///////+qqqoAAAAAAAAi"+
"IiLu7u7////////u7u4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAD/////"+
"//8AAAD///////8AAAD///////8AAAD///////8AAAD///////8AAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

    buildCell(tr, "OpenSubtitles","http://www.opensubtitles.org/en/search/sublanguageid-all/imdbid-"+id, img);
    
    //Eksi
    
    img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABbklEQVR42mNgwAMC1zkLh65y4GEgEzBGbnP1Dd/sGmE805iVZN0B6x0EorZ6TInc6rElaJuDDMkGhO9004ne7nEvepvHh4jNLs6k6a5nYIre5lYQvc3rb/Q2z/9RWz1nhq4KZSZaf+gqLbaore4nY7Z7/QfhqO2eP9xXWQoRbUDYRie76O2e/2AGgA3Z5t5KdOin7Q7dVn+08H/evrj/IC+ADACGx1PPVbaiBHUHb3GzWn593s8HH+7833V/0//cfbFQAzz/RW51LSNoQOQ2jyVHn+z//+/fv/9X31z8X3owDeGNrZ7nvZfaCOIJPQbmqO0eV9N3h/1fc2vR/+bjZf+RwwEYpQ9Dt7oaEHLBHmRNqAHpedNvg7UU/gS03TUUGHCf0TWDwiB6i9skUCDjNcD4DAMrMMrKo7e534VFJdDmtxFb3eZEE5ukHeYrcIRtc7GI2O4eG7nVPSVis4ezzzIHEdLzIzBJh65iwJuEAUCOyHpeLFiIAAAAAElFTkSuQmCC";
    
    buildCell(tr, "Eksi","http://eksisozluk.com/?q="+titlet, img);

    //PirateBay

    img = "data:text/html;charset=utf-8;base64,Qk04AwAAAAAAADYAAAAoAAAAEAAAABAAAAABABgAAAAAAAAAAADgTAAA4EwAAAAAAAAAAAAA////"+
"/////////////////////////////////////////////////v7+/////////////Pz8vb297Ozs"+
"////////////////////////////////4uLiSUlJ3d3d////////8/PzEhIScnJy8fHx////////"+
"////////////8fHxwsLCWFhYAAAAyMjI////////5+fnEBAQICAgQkJCV1dXZWVli4uLiYmJUlJS"+
"KioqPT09bm5uHh4eYWFhwcHBubm5bGxsQEBAp6end3d3FBQUAAAAFBQUOTk5ISEhGRkZPT09WVlZ"+
"QkJCKioqJycnenp6AAAAQUFBPz8/YGBgjo6O0dHR+/v7////////7+/vxcXFnZ2dg4ODExMTQEBA"+
"v7+/AAAAgoKCjo6OpaWltra2qqqqpqampaWlpKSkra2tr6+vsbGx5eXll5eXW1tb1NTUcXFxmJiY"+
"AwMDAAAANzc3VFRUGxsbAAAAX19fPDw8ERERAAAAQUFB/v7+/Pz8////////nJycAAAAAAAAAAAA"+
"Hx8fCwsLAAAAJiYmBQUFAAAAAAAAKysr+vr6////////////nJycAAAAAAAADw8PAAAAAAAAAAAA"+
"AAAADQ0NAwMDAAAANjY2+vr6////////////rq6uAAAANjY25eXlWVlZHx8fJycnIyMj0dHRhoaG"+
"AAAAV1dX////////////////r6+vAAAALS0t0tLSX19fsrKy2dnZZWVlsrKyiIiIAAAAWVlZ////"+
"////////////r6+vAAAAAAAABQUFAgICExMTEBAQAwMDAwMDAQEBAAAAWlpa////////////////"+
"q6urAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVFRU////////////////19fXSUlJQUFB"+
"Q0NDQ0NDQ0NDQ0NDQ0NDQ0NDQkJCQkJCqKio/////////////////////////v7+/v7+/v7+/v7+"+
"/v7+/v7+/v7+/v7+/v7+////////////AAA=";

    buildCell(tr, "PirateBay","http://thepiratebay.se/search/"+titlet+"/0/99/200", img);
             
    //RARBG

    img = "data:text/html;charset=utf-8;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAflJREFU"+
"OI2F0z9oXEcQx/HPCSWY22DcvFe4CK9KoYOQIhZxE1/j5lQLUpig2lIVIhchsY1xZadIYR8uXKhX"+
"fZUhnFOeXAVOhBDCI+XbJjHsEozRpjid/OdsMrDMsMN+5/eDnV4ppYePcQ0f4cRq/IWf8cdKp5Ry"+
"uZTypPx//FNK+aGU8kEppbc86/gCn0/nnfFBS3hzQB9VFWwNq/PDQX0HF/Dtsr++LFKijVk/k9Nb"+
"Mtvs6VG0v8P2sL6Ox/jtDUBAPyzypUFl60oFJkfR8XGUMJm2RsP6XODLFQCE/iI3DcPNGk42mnpt"+
"bzwjZRmpI9QurlhYqng7ck76MqgCoQZ/vhOwpMQumc46Kee16VEnp6SLjIaVwHP88h5AInEUo8On"+
"x2dXsD3asLM1gAdoVwApZ/PjVkpZXfc1/WDexoWo0F8+fo6D10eunXlNSdu2Yuxc2qhNDnZsDRsx"+
"dmJs7d4/hPP4CR+uABZaMykuPgXu7Y8MmiClbDqZ2r19CCPcfAcgyynKOUsL4y9DCP8+uLcjnMLH"+
"40MPDybwHb7G+hkgZcSO1Mk5w9+4uzloXtza35bzord3Y2wyncEdfNUrpVzF3a5Lm23bymjqStPU"+
"v+Iz/IhvZvM5iYwqBINB8zu+752u86e47tU6n2CMmcU+3cAneHlq+wUe4dl/EuoEoSZWymEAAAAA"+
"SUVORK5CYII=";

    buildCell(tr, "RARBG","http://rarbg.to/torrents.php?search=tt"+id, img);
                           
    //TorrentDay
    
    img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB8UlEQVR42mNgGBxAxZNd0jiNixBmkAnlBKpmRNVs7MMlYZUYIm2b2kYIS9qktIhbJxVIWqfYMjCEMoP1C1rHyknZpq6Xtk/9TxS2S/klZZf6UNwuKRmonYmBwSGBQ9QqwUDCOslR3DqlSsou5Y+kXeo7cct4Z2m71DsgTZJ2KTNB8qJW8cFAV+wGqvknZZd8VsQ2RhLFNxK2SQlgDbbJN4B+YwUqvAi07bekdXI6TI2IcYwkUPyTlH3qD0nbRCMUAyRtkqtBBojbpOwSN4tVBDr3LtCA1+JWiU4o6uxSrkIsSnVHdYFd8gqQhKh1YryEbbK3tH3Ke6ABVxjU/XiR1UnZptyAqEvyRHWBbcoDoOm/GeS8BYHsAohfUy4CA4oFpoZHL1YMKPYTaPAncaskHaTojBQBCv4FSr4HxTXQoAqQLUC/nke2BBiNVWBx25TD4laxYnAJIesEC7CEXfItUPSI2ya3gfgS1omTYWpEzYGxYJv8Amjobwmb1HKURCVuk5gHCZikJQyWoZxALxyBGJjyXtIu+RlQ/KWUfcofoAXfpGxSNgsah/KjBqBN8lSg4mvi1glRolqhPECbTgNtug7HdinngYZuELdJzsfQDA4cw0RRIfMUGQaFBA6Q04QcUmSQsYhtmqSAQ4IAJPVREQAAGhK/XYFu+R4AAAAASUVORK5CYII=";
    
    buildCell(tr, "TorrentDay","http://www.torrentday.com/browse.php?search="+titlet, img);

    //Hd-T
    
    img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAADtklEQVRYw+1Xv0srSxT+Zn8kGhITo4VgOgOCQgqxsEiEqIWoIZJCa1ERLQQbwc7/wFKtVLBVUQsrRRDE1koQrJQkxLis+cHuZndnXnFv5mVN4vNeHtg4cJidM7NzvvOdc2Z2gW9u5HfPvguA8N0M/AD4ASB9NkkIQSwWQ3t7OyilIITwOUopKKWwbZs/U0rB2K+CYoxBEAQoioL7+/vmNn73dWXo8/mwvr6OcrmMdDoNURQhCALfvGrQNE3Yts2BMMYc0tXVBQDY39+HaZpNgbCPsrKywpLJJGs096eSSqVYKpVqONcwBwKBAFwuF05PT/+XOJ+fnyMcDsPtdn8tB4LBIHK5HB+Hw2EkEgns7e1BVVUAwODgIOLxOLa2tjA8PIxoNAqv1wtVVXF7e4vr62v+vmmaoJQiGAwik8k4bDWtAsuy+HNPTw+Wl5fh9/u5bmBgAGtra5BlGfPz81haWkIkEkEymcTx8TF2dnbQ0tLC14uiCFEU6+w0BEAIgcvlcnigqioopVxXLpeRzWbBGINlWTg5OcH4+DhisRhWV1cxMzODhYUFvr62Qv4TgCiK8Hg8fCzLMnw+H0qlEtdpmgbbtkEIgWEYMAwDAFCpVHB4eIiDgwNMTU1xRwzDcDjwaQ5IkuQAIEkSAoEAJicnkclkQClFJBKBruucodqQAcDV1RUikQg6OzuRTqehaVpDBhoCEAQBsiw7dG1tbdjd3YVpmjAMA8ViEY+PjwDAz4Ha9v7+Dk3T/o6BKohaBgBgbm4OLy8vsG0b8XgcY2NjnPZKpeJ43+PxwDAMzpJlWV9nAEAdWl3XcXl5ibe3NwBAR0cHhoaGAPxKSE3THOt7e3uRz+ehKMqnAIRmxms9MgwDuVwOra2tXGfbNrLZLAdQm6B9fX2IRqO4ubnh+zSivykDlFKe1VWKX19fHR5YlgVd10EIgWmaCIVCmJiYQCgUwsjICJ6ennB2dtaU0U8BMMYcSVUoFPDw8OBgRdd1FAoF2LYNVVXR39+P2dlZlMtlXFxc4OjoyMFKo0PIYbNWgsEg29jY+PfCEAQmyzIjhHCdKIrM5XIxAEySJOb1epnP52OiKNZdOJIkscXFReZ2u792GSmKAsMwMD09zekzTdMRAtu2OSOWZaFUKqFYLNaVIwAkEgm+58fW9HvA7/djc3MTiqLg+fkZhJC6u742ZNW+KtWPle7ubhBCsL29/WcAqnEbHR1FIBDgZfTRWC2I6riacIIgIJ/P4+7urmnsf35MfgD8APgH845RCGnnQ5wAAAAASUVORK5CYII=";
    
    buildCell(tr, "Hd-T","https://hd-torrents.org/torrents.php?search=tt"+id, img);
                                
    //RuTracker
    
    img = "data:text/html;charset=utf-8;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg4ODLy8vd3d0AAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAAAAAAAAAADPz8+KioqgoKDb29vj4+Pf39/q6uoAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AADe3t7b29vS0tL29vZOTk5paWlycnJ8fHy8vLwAAAAAAADt7e3c3Nzg4ODc3NympqbDw8OIiIjj"+
"4+PtTUD8393///////////+8vLwAAAAAAADU1NSgoKCampqUlJSCgoLz8/NKSUni4uLpJxnqOCrw"+
"Z1z2oZvj4+PPz88AAAAAAADr6+vx8fGmpqaurq7P9dn///9paWm9WlPhIBLpIRLpIRL///9XV1fO"+
"zMwAAAAAAADg4OD///9D1miK5qEQyz////8+PT1GLCuTFQvNHhHhIBLrtrPPz8+kpKQAAAAAAADh"+
"4eH8/PwTzEEQyz8Qyz+M5qL///9sbGxWEQyZJBy9WlO7cmzU1NSioqIAAAAAAADDw8P///8Qyz8Q"+
"yz8Qyz8Qyz9r34j///+emZk+PT1lZWTS0tKmpqbg4OAAAAAAAADY2NiP56V74pVh3YAQyz////+m"+
"pqZYN9DDtfT///+zoPbf39+xsbEAAAAAAAAAAAAAAAAAAAAAAAAAAAA31F/t7e2YmJhMIedAEulR"+
"J+uhivSYmJi8vLwAAAAAAAAAAAAAAAAAAAAAAADj4+P+/v7IyMh2XdBAEulAEulAEunHuflKSUmY"+
"mJgAAAAAAAAAAAAAAAAAAAAAAAAAAADg4ODt7e329vZaM+tAEulAEulRJ+v///9+fn7d3d0AAAAA"+
"AAAAAAAAAAAAAAAAAAAAAAAAAADd3d2plPV4WO/////////////e3t7j4+MAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAAAAAADr6+v///////+/v7/i4uLu7u4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+
"AAAAAAAAAADV1dXp6ekAAAAAAAAAAAAAAAAAAAAAAAD+PwAA/gMAAPgDAAAAAwAAAAMAAAADAAAA"+
"AwAAAAMAAAADAAAABwAA8AcAAOAHAADwAwAA/AMAAPwPAAD/PwAA";
    
    buildCell(tr, "RuTracker","http://rutracker.org/forum/tracker.php?nm="+titlet, img);

    //Zamunda
    
    img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAYAAADUryzEAAACGUlEQVR42oWT32oTQRTGRwj1DfoM3nnnjfgUmsYUrLWpShUK3lRvShAURbzqhRcVQaVJN5uW+AdrrUqkEEVtNTZrW9LKtq4xpCFFsphkdzPncyZJSTdJzYHDzJn5zm8/djiM7YvEJnrXMpXR3B/ro1myiw4HWVVws0y5vInIh83ScU1DD+sUwWDcoxn2/bLNyzggKpZDa1l7Um2FxOPwfM84SRKBLiE16R3S5jZwuNb86pvZmzTsq61Cp0qYWibcfkfQsu0g7Vd5vAZI56ojxb+21SpYSBP6QvW8HCOULLe5igMs6dYRpu9UFludy3LsRRMgc/GHW2MJh0mDX2cJnZe2C+7LrV2Cd8oNSOhuzUae40uGVllwATz1m8PYrWLPyfNVd7PMl+tNQL7oIJXluPeebNavgB58IkjIz4KDKidEku2APQcF0xbNhGWDMBAhMF8IttwoXwnnxDq7wvHos+NqPvlYnhO2Clx8iGqAm28J/rAA+KdJ7wsBAZWwJKiBKOHGm3YHMqXTFQF4LV7IJ+r+MK2zQQUhCZCC8XnCQyEaUDoDpoXLpxrhdLhe+8P8DhuO4oSvAZA5+qRurRPgyjOxNl7nlFjH5nGMeVX0DKq41qnhfzkUxd1904BDgShS3hBRt0apORtBamKuMQvNaYRneIbf6ga4FKPJoHrASMu4OIujIzFMnJ+h7TNK/YdeEHt5NiTuWvX/AFk3I000Ir6cAAAAAElFTkSuQmCC";
    
    buildCell(tr, "Zamunda","http://www.zamunda.net/browse.php?search=tt"+id+"&incldead=1&field=descr", img);    

    //IPT
    
    img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABo0lEQVQ4jZ2QsU4bQRCGv13cUJDyxAkoQu2jiQRFKIh8SKSAKibCThnbj4DFC0BF/ABRREVS0xqEQYl8FGlwuLQuLuJAlosz3nAYdilILBAuOP5qZqTvm9EIgLm5N6+llDMkiNb6qFbb/yEWFt5Oa23qQgiZRGCM0b3e1Yw0hsWkMIAQQgoh30tgKCl8TzKc+t/MuxlcN8NqeY1SscDk5EsA6nWP6u4e3W53oKR/umVZOOk0QB8GKBY+8iGfA2Dry2fyuZWHAq31QPPxcYPV8hqed4TjpCkVC1iWxbyboVQsAGCMNjIMw0tjzCPB1JRDPreC4zg0Gr+o7u7dif/VxhjOzs7jVKvVulJKoZQCoN1uc927xrZHmZgYZ7NS4fDgkM7FBQDNZhPP84iiCKVULwWglKLT6QAQBAFxHLP99RubnyoDPg9hGD5+4lPi+79ZzmZZzr7rz4ZGRl7MAi7ibnvd8wA48X2CIHggqNUOuIxjoijixPcBvgvbHisD60kuuZcNCdw8Ewb4K4HqMyU3wI4AsO2xV8ASMPpEOAR2Tk///LwFay2vA+9SBSUAAAAASUVORK5CYII=";
    
    buildCell(tr, "IPT","http://www.iptorrents.com/t?q=tt"+id, img);

    //Filelist
    
    img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAk0lEQVQ4jWPUaVn6n4ECwMLAwMDAsLKLPN3hZQxMlNjOwMAwCAxgQeb8lddh+BZWhaKAa1Ubw7ewKgbe7ijCBsAAsuK/8jp4XUDQC38lFPHKo3oBqvhz6TIGBgaI8wkBVAPElRgYGFC98EvfGa8BKF7g3DQRQwFM7HPpMjjG6QJ02/GJYXUBOWDgDYCEQXgZ2QYAACWYIncYotQHAAAAAElFTkSuQmCC";
    
    buildCell(tr, "Filelist","http://filelist.ro/browse.php?search=tt"+id, img);

    //IcheckMovies
    
    img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACzElEQVR42pVTXUiTURg+FwVFhdFdF+bmnG5uzv0o5tT92H7a1v7a3MrQUOgm0LVFP0Zhed1FZP5cdVFEUGipoYg6yfCiQAWRQqygEPHCBHN/urWncw6kBXXR+XjO4Xzv+zzv837nfITQEQwG4fP5/guMw7jE7XYjEAjA7/fvgCWw9w6Hg8PlcvF3PO6jcbq6gwHcqLSAC3i9Xk7weDycYLPZEImE0d3did7eLrS1XYfT6YTdZofL64Gb5nVKdRjL0YCwAKvAVovFgubmJszNvUMmEweQQjbLkMTS0ntErl7BKctJPMrTYvxIOS5Um0DsdjsYzGYzGhsbsLa2QskJxGLru9hcR5qKra18wbO8agwfVuO8wYpahw3EarXyyjqdHtPTr8FG4kcCiUxsRyCe3OAib/RnMXJIiSa9GQabFWaTGcRkMkGv16OBVk9tbWKh4x6i5R58ftJHa24hFl9Hkj5vz11CPxFgpX8Y1+7cQnVVFYxGI4jBYEBFxXFELoeRzWxj5uJNvCRiDO6T4dPj58hQRx/u9qKPHMNcuIM77Ol5gLKycupaB1JTU0M3ZQiFWpGlFVPYxmzoNgb2SDBytBIfHz7FqxwVJlRO2sY3Sk+jq+s+lEoVqqgLotVqodFo6DmfRir1nffLMFnpw9BBBYYOKDC4X47lsUkk6WmAFgmFWlBaWkqdV4CwiQkUFxcjGh3lCewjLo9GMbBXihekgPefpN7S6TgWFxegUqmgVqu5c8ImpVLJBUymE1hd/crPP57awGxrO2Zb2rGxuowMvQ9J6qy+/gyKioo4h4EwNblcDplMBpGoALW1RkxNTfALtDvSmJ+f4W3m5+fzXMYpKSkBUSgUkEqlkEgkHCKRCAKBkN5OJ+81HG5FXZ0fYrEYQqFwJ49xmBBhG2apsLDwD7Dk3NxcDoFAwAV+j//i8D+S9f83kX+B5TIHjPsTZhVHT7FwsBcAAAAASUVORK5CYII=";
    
    buildCell(tr, "IcheckMovies","http://www.icheckmovies.com/search/movies/?query=tt"+id, img);
    
    //TürkçeAltyazı
    
    img = "data:image/png;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAADo7PAUbqPajmKg3ppioN6aYqDemmKg3ppioN6aYqDemmKg3ppioN6aYqDemmKg3ppioN6aYqDemmyj2pDk6e4Ygq3aewB8+v0Affv9AH37/QB7+P0AefX9AHn1/QB59f0AefX9AHn1/QB59f0Ae/n9AH37/QB9+/0AfPr9eKnahmih3JQAffv9AH37/QB8+f2VueP91d/u/dXf7v3V3+791d/u/dXf7v3U3+79gLDl/QB8+v0Affv9AH37/WKg35pioN+aAH37/QB9+/0AfPr9C3rt/anG6P3////9/////f////3////9lLrm/Ql67/0Affv9AH37/QB9+/1ioN+aYqDfmgB9+/0Affv9AH37/QB9+/2Gtej9/////f////3////9/////Wem6f0Affv9AH37/QB9+/0Affv9YqDfmmKg35oAffv9AH37/QB9+/0Affv9hrXo/f////3////9/////f////1npun9AH37/QB9+/0Affv9AH37/WKg35pioN+aAH37/QB9+/0Affv9AH37/Ya16P3////9/////f////3////9Z6bp/QB9+/0Affv9AH37/QB9+/1ioN+aYqDfmgB9+/0Affv9AH37/QB9+/2Gtej9/////f////3////9/////Wem6f0Affv9AH37/QB9+/0Affv9YqDfmmKg35oAffv9AHz6/QB9+/0Affv9hrXo/f////3////9/////f////1npun9AH37/QB9+/0AfPr9AH37/WKg35pioN+aF4Hu/Y+66v0Pfe/9AH37/Ya16P3////9/////f////3////9Z6bp/QB9+/0zjOr9gLHn/QB69v1ioN+aYqDfmkST5/3////9XJ/n/QB8+v2Gtej9/////f////3////9/////Wem6f0AfPn9qMbp/e7x9/0Cdu79YqDfmmKg35pFk+f9/////cna7/0Hee/9hrXo/f////3////9/////f////1npen9LIXk/ff5+/3u8fb9Anbt/WKg35pioN+aRZPn/f////3////9nMDp/Ya16f3////9/////f////3////9baDc/env9v3////97vH3/QJ27v1ioN+aZqHdlhSB8f1Llub9S5bm/TOL6f0niOz9S5bm/UuW5v1Llub9S5bm/SGD6v1Jlef9S5bm/UaU5/0Ae/f9YqDfmn6r2n4AfPr9AH37/QB9+/0Affv9AH37/QB9+/0Affv9AH37/QB9+/0Affv9AH37/QB9+/0Affv9AHz6/XKl2org5uwcWJjYpUKP3rtCj967Qo/eu0KP3rtCj967Qo/eu0KP3rtCj967Qo/eu0KP3rtCj967Qo/eu1SV2Kjc5OwhgAEAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAgAEAAA==";
    
    buildCell(tr, "TürkçeAltyazı","http://www.turkcealtyazi.org/find.php?cat=sub&find=%tt"+id, img);

    //PlanetDP
    
    img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABYlBMVEX/////4AD72QD/0QD/3gD92wL52AP/0wD/2gH92QT81QP/0Rf/yQ3/1gX81gb50gb4zAf/2wD90gr90Av/0wf90gf5zQb1yQn/qgD90Az90Av/0A7/zwn7zwn1ywr5yQr/zAD9yxD9zA34xwv8ywv3yQ36xw7/zBH8xhL+zg7/uRfsvQ78yQ/8xBD/wRL8wxb/yhH7xBDptxL3whD+xxH/xw77whP/wRX/whn8wxHyuxL8wxP/xRLouRf8vhfxuBb9vxX8wRT1sxP2uRfssxf7vBf9vRf9vBjvrRb+vRn9uhn4tRr9uBr/vBb1sxn8uBv/uxn3tBr/uRv/1wX/1Qf/0Qj/0gr/1Ar+zgv+zQz/zwz+yw3+yQ7/zA/+yw7/yw7/zA7/yBD/yhH+yBH+xhH/xxP9wxP9wBX9wRb/xBX+wBX/wBj/wRf+vhf+vBn8uhn/vRn9uxn+uhr+uRr/uRv///9zB1iBAAAAU3RSTlMBKUkLRZ1bF7vpTwsTa+ctIwfRj9PDKVEDres3ccUxfwWP1cG9PakPcdcLbVXRHVH9QTnpxzfzMUexteNHC2OB6VsbcUP3/Xcv/ZlFpxdlxyljcTO/9roAAAABYktHRACIBR1IAAAAs0lEQVQY02NgYGRiZkAFLKxsaCLsHJxcyHxuHgbeYD5+OF9AUEiYgUEkRFQMKiAuIRkqJc0gExYuKwcWkFdQjIiMVGLgVo6KUlGVYGBQU9eIjonV1GLQjotPiNNhYNDV0080MGQwMk5KTjExBWoxM7ewZGCwSk1Ns7YBGWGbbsfAYJ+RmeXgCLHEKdvZxTUn180d5gyPvHzPgkIvLbi7vIuKin18kRzuV+IfgOKzwCBUnwIAihMcuFqH+AgAAAAASUVORK5CYII%3D";
    
    buildCell(tr, "PlanetDP","https://www.planetdp.org/movie/search?title=tt"+id, img);

    
}

function buildCell(container, title, href, image){
    var a = document.createElement("a");

    if ((title == "Subs4free")||(title == "Btscene")||(title == "Podnapisi")) {
	href = href.replace(/\s/g, "+"); //replace spaces with +'s
	}
    
	a.href = href; 
    a.setAttribute("target","_blank");
	a.title=title;	
    var img = document.createElement("img");
    img.src = image;
	img.setAttribute("height","16");//needed for Chrome
	img.setAttribute("witdh","16");//needed for Chrome

    a.appendChild(img);
    var cell = container.insertCell(0);
    cell.appendChild(a);
}

function _addStyle(css){
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            var node = document.createElement("style");
            node.type = "text/css";
            node.innerHTML = css;
            heads[0].appendChild(node); 
        }
    }
}