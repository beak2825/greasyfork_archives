// ==UserScript==
// @name           fofo_sceaux
// @namespace      www.lesroyaumes.com
// @include        http://forum.lesroyaumes.com/posting*
// @include        http://forum.lesroyaumes.com/privmsg*
// @include        http://forum2.lesroyaumes.com/posting*
// @include        http://forum2.lesroyaumes.com/privmsg*
// @author         LJD Mclegrand
// @license        CC-BY
// @description    add some options in the posts of the RK forum
// @version        2.0
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/13460/fofo_sceaux.user.js
// @updateURL https://update.greasyfork.org/scripts/13460/fofo_sceaux.meta.js
// ==/UserScript==


setTimeout(function(){
  var element = document.evaluate( '//html/body/table/tbody/tr/td/form/table[2]/tbody/tr[5]/td[2]/span/table/tbody/tr[3]/td/table/tbody/tr/td/span',document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue            
             || document.evaluate( '//html/body/table/tbody/tr/td/form/table[3]/tbody/tr[4]/td[2]/span/table/tbody/tr[3]/td/table/tbody/tr/td/span',document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue 
             || document.evaluate( '//html/body/table/tbody/tr/td/form/table[2]/tbody/tr[4]/td[2]/span/table/tbody/tr[3]/td/table/tbody/tr/td/span',document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue 
             || document.evaluate( '//html/body/table/tbody/tr/td/form/table[3]/tbody/tr[5]/td[2]/span/table/tbody/tr[3]/td/table/tbody/tr/td/span',document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
  if(element==null) return;
  var e2 = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.children[1].children[1];

  var texts=["[img]http://img6.imageshack.us/img6/6276/mccontour.png[/img]","[img]http://img15.hostingpics.net/pics/855665sceaumcvert.png[/img]","[img]http://img15.hostingpics.net/pics/565482sceaumcjaune.png[/img]"];

  var descriptions=["Privé","Définitif","Officiel"];

  var couleur_descriptions=["red","green","orange"];
  var a="";

  a="<select onmouseover=\"helpline('s')\" onchange=\"bbfontstyle(this.form.addbbcodemy.options[this.form.addbbcodemy.selectedIndex].value, '');this.selectedIndex=0;\" name=\"addbbcodemy\">	<option class=\"genmed\" value=\"\" style=\"color:black; background-color: #FAFAFA\">Sceau</option>"

  for(i=0;i<texts.length;i++){
    a+="<option class=\"genmed\" value=\""+texts[i]+"\" style=\"color:"+couleur_descriptions[i]+"; background-color: #FAFAFA\">"+descriptions[i]+"</option>";
  }
  a+="</select>";element.innerHTML+=a;
  
 var elts = ["strike","center","right","spoiler","sup","sub","char"];
  a = "";
  for(i=0;i<elts.length;i++){
    a+="<td><span class=\"genmed\"><input type=\"button\" class=\"button\" style=\"width:45px\" value=\""+elts[i]+"\" onclick=\"bbstyle("+bbtags.length+")\" name=\"addbbcode"+bbtags.length+"\"></span></td>" ;
    bbtags.push("["+elts[i]+"]");
    bbtags.push("[/"+elts[i]+"]");
  }
  e2.outerHTML+=a;
  
},1000);

