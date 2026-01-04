// ==UserScript==
// @version 20180403
// @name NC_DownFile_WhyNotAlita
// @namespace NCDownFileWhyNotAlita
// @match https://nc.securecloudinformation.com/InvoiceHistory/default.aspx?PART_CODE=1
// @grant none
// @description NC Download File (WhyNotAlita)!
// @downloadURL https://update.greasyfork.org/scripts/424263/NC_DownFile_WhyNotAlita.user.js
// @updateURL https://update.greasyfork.org/scripts/424263/NC_DownFile_WhyNotAlita.meta.js
// ==/UserScript==
$(function(){
  //13 td filename
  //14 td batch
  $.each($("[ID$=grdMain] tbody tr"),function(i,trdom){
    var filename = $(trdom).find("td:eq(12)").text();
    var dir = $(trdom).find("td:first").attr("dir");    
	  if($(trdom).find("td:first a:first").length>0){
        var pdf = $(trdom).find("td:first a:first").attr("dir");    	  	
        var txt   =pdf.replace(".pdf",".txt");
        var txtAb =pdf.replace(".pdf","-INV.txt");
        var xml   =pdf.replace(".pdf",".xml");
        var invdt =pdf.replace(".pdf","-invdt.png");
        var invno =pdf.replace(".pdf","-invno.png");
        var tlamt =pdf.replace(".pdf","-tlamt.png");
        var shppr =pdf.replace(".pdf","-shppr.png");
        var cnsgn =pdf.replace(".pdf","-cnsgn.png");
        var rmzip =pdf.replace(".pdf","-rmzip.png"); 
        pdf   = '<p><a style="margin-left:2px;" href="'+pdf+'" target="_blank" >'+filename+'</a></p>';

        var links   = '<p><a style="color:blue;" href="'+txt+'" target="_blank" >txt</a>'
        +'<a style="margin-left:2px;color:green;" href="'+txtAb+'" target="_blank" >txtAb</a>'
        +'<a style="margin-left:2px;color:orange;" href="'+xml+'" target="_blank" >xml</a>'
        +'<a style="margin-left:2px;color:brown;" href="'+invdt+'" target="_blank" >invdt</a>'
        +'<a style="margin-left:2px;color:darkgreen;" href="'+invno+'" target="_blank" >invno</a>'
        +'<a style="margin-left:2px;color:darkpink;" href="'+tlamt+'" target="_blank" >tlamt</a>'
        +'<a style="margin-left:2px;color:darkyellow;" href="'+shppr+'" target="_blank" >shppr</a>'
        +'<a style="margin-left:2px;color:red;" href="'+cnsgn+'" target="_blank" >cnsgn</a>'
        +'<a style="margin-left:2px;color:purple ;" href="'+rmzip+'" target="_blank" >rmzip</a></p>';    
        $(trdom).find("td:eq(13)").append(links);
        $(trdom).find("td:eq(12)").html("").append(pdf);
      }
  });
  

  
});