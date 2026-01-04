// ==UserScript==
// @version        2020.06.01
// @name        USL
// @namespace   USLogistics
// @author	      fengguan.ld~gmail。com
// @include     *.aljex.com/*
// @encoding       utf-8
// @grant          unsafeWindow
// grant          GM_openInTab
// @description USLogistics BPO Tool
// @require      https://code.jquery.com/jquery-1.12.4.min.js

// @downloadURL https://update.greasyfork.org/scripts/398023/USL.user.js
// @updateURL https://update.greasyfork.org/scripts/398023/USL.meta.js
// ==/UserScript==
$(document).ready(function(){
    //------加载护眼色---------//
    $("body,table,html").css("background-color", "#C7EDCC");
    //Global Params
    var regUser = /telamon[0-9]/;
    var regProNUM = /\d{3,10}/;
    //------PRO NUMBER PAGE---------//
    if ($('#dtypc').length > 0) {
      var invdate=$("#inv_date").val();
      $("#headlbl").after('<span style="color:#000;margin-left:10px;">Invoiced:</span><span class="headidno">'+invdate+'</span>').parent().css("width","700px");
        var sPageTitle = $("title:first").html();        
        $("title:first").html(regProNUM.exec(sPageTitle)+" Goto");
         $(".headrow").removeClass("headrow"); //to remove it's darkblue bkg color of .headrow css
        $("#locktop1").parent().parent().parent().parent().remove();
        $("#gotopro").hide();
        $("#gotopro1").attr("style", "width:1000px;height:60px;font-size:48px;background-color:#DBE0E0;");
        $('#dtypc').attr("size", 3).css({ "width": "1170px", "height": "120px" });

        var carrier = $("#whopay2").parent().parent().parent().next().find("td:eq(0)").html();
        var eletb = $('#headpro').closest("table");
        //append dtypc to elebt's after position ,then re-do for carrire.
        $(eletb).css("width", "500px").after($('#dtypc')).after($('<span style="color:black;float:left;min-width:500px">Carrier:<span><span style="font-size:26px;font-weight:bold;color:darkgreen;background-color:lightyellow;">' + carrier + '<span><br/>'));
        //$(eletb).after($('#docdivto')); //20200316, customer website has been changed, docdivto nolonger exists
        $("#wrtchangedtxt").before($('#newgoto'));
        $("#navbar").remove();
        //$('#headpro').after($('<span style="font-size=16px;font-weight:bold;">Carrier:<span><span style="font-size=22px;font-weight:bold;color:darkgreen;">'+carrier+'<span>'));
        //$('#docdivto').appendTo($('#headpro'));

        //DIV
        $("#wrtchangedtxt").css("display", "block").css({ "margin-left": "135px", "width": "800px" }).html("").attr("title", "TBPS BPO SIMPLIFIED Form").append($(eletb).parent());
        $("table.tab").remove();
        $("#buttonrow2,#buttonrow").remove();
        $("#menulimit").remove();
        $("table[width=1400]").css("width", "800");
        $('#dtypc option:eq(1)').attr("style", "width:100%;font-size:32px;background-color:lightblue;color:Green;");
        $('#dtypc option:eq(2)').attr("style", "width:100%;font-size:32px;background-color: lightyellow;color: darkred;");
       
    }

    //------UPLOAD PAGE---------//
    $("div.twelve-columns-tablet").append('<span id="invtype"></span>');
    //凸显公私类型
    if ($("div.twelve-columns-tablet").length > 0) {
        //Set Legend Title text
        var legendtitle = $("legend.legend:first").text();
        var curuser = regUser.exec(legendtitle);
        var pronum = regProNUM.exec(legendtitle);
        
      
        var invtype = "";
        if (legendtitle.indexOf("invoice_private") > -1) {
            invtype = "PRV";
        }
        else if (legendtitle.indexOf("invoice_public") > -1) {
            invtype = "PUB";
        }
        //legendtitle=$.trim(legendtitle.replace("Document Management","").replace("invoice_private","prv").replace("invoice_public","PUB").replace(" "+curuser,""));
        var newtitle = invtype + " " + pronum;
        $("legend.legend:first").text(newtitle).attr("style", "font-size:26px;");
        //Set webpage title text
        $("title:first").html(newtitle);

        if (invtype=="PRV") {
            $("#docdrop").css({ "background-color": "lightyellow", "color": "darkred" });
            $("#invtype").html("**PRIVATE**").attr("style", "font-size:30px;line-height: 32px;font-weight:bold;background-color:yellow;color:darkred;");
        }        
        else if (invtype == "PUB") {
            $("#invtype").html("**PUBLIC**").attr("style", "font-size:32px;line-height: 32px;font-weight:bold;background-color:lightblue;color:Green;");
        }
       
        //remote Print button
        $("input[value=Print]").parent().remove();
        $("legend.legend").after('<table><tr><td><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKMSURBVFhHzZY7TBNxHMf/+IhiGhETEgejMQ5GjdHEwcFBEwcHV0dXi+KLlkJfpFp8weCgLLqSOBkHFAX6og+gaFutTlWTBpA4NGkqtNoHLV97Ta65u/6v9++D1Es+y/+uv8/netd/SooHWgwB1lrD/x+QyafwOHwOjz6fxcNPZ/AgdBr3QycxFDwOa+AI7gUO4+7Hg7B82I/BhX0w+7tg8u+Fcb4DI8Gj1JlCmALqkRvnVBguXkObKYQaMPLlIobDF+q+c05umN0F/exODPh2oN+7HTrPNvS5t8Lk6xS5qAGbJdfObIHRu0fkogZsllzjaoPBwxCwWfJeZxv07g6RixrQDDl3SOV3HAT6GYaARuUbKJSQym/bCQZcDAGNyAvIlZHKb9kI+p0MAXLyPNKycst8V+m8EKn85jSBzsEQIHfnOSRLSOV6X3v5nBCp/MYUQZ+dIUDua88gUUYoF67z0OQ9kwRaG0OA3DNPIyZicK6zYo1DTn79PYFmmiFA7oX7g1+KVJNfe0fQO8UQQJPzzzyJZVmU5N0TxYBJhgA5Of9TW0W0AhZ591sCg/2AyEUNqCbnt9ff+FGGVa5+Q/A8cFnkogaYuYAqcn6HSyBSk/zqOMFiIihyUQNsS1ZFOW2TUZKPhdUiDwc1gONl5EpT5Vb3KeTyfys8sgGFjTxefVc3Tb6WiVU4OGQDeLwrT4v/YnbXLX+2cAmpbJw6m0MxgCOejmI0dL4mec9EO5zRUeo8IUwBPK6lJ9A5VYpyi+sYVla/UmdIqSmAI5mN4XVEC41NVSE3OQ7Bs/gC64Us9bM0ag7gSeXiGP9mLu3tQ+4T8P8cK724tGurUXcAT2Y9SV1npeGARikHtA6Cf+Jk4soZCBssAAAAAElFTkSuQmCC" width="32px" height="32px" /></td><td><textarea  rows="3" cols="60" id="pdflink" style="font-size:24px; line-height: 28px;"></textarea></td></tr></table>');
        $("#pdflink").click(function () {
            //alert("click textarea");
            $("#pdflink").val("");
        });

        $("#pdflink").blur(function () {
            var curLink = $("#pdflink").val();
            //pronum already definited on above lines
            //var pronum=$.trim($("legend.legend:first").text().replace("prv","").replace("PUB","").replace("(","").replace(")",""));
            if (curLink.length > 0 && curLink.indexOf(pronum) < 0) {
                $("body,table,html").css("background-color", "#660000");
                $("#invtype").html($("#invtype").html() + "<br/>**Pro# unmatched!**");
            }
            else if (curLink.length > 0 && (curLink.indexOf("_private.pdf") > 0 && invtype == "PUB") || (curLink.indexOf("_public.pdf") > 0 && invtype == "PRV")) {
                $("body,table,html").css("background-color", "#CC9900");
                $("#invtype").html($("#invtype").html() + "<br/>**Type unmatched!**");
            }
            else {
                $("body,table,html").css("background-color", "#C7EDCC");
                $("#invtype").html("<br/>**" + pagetype + "**");
            }
        });

        //$("div.twelve-columns-tablet").append('<label>File Name:</label><input type="textbox" id="pdfname" style="width:300px;"></input><br/><label>Magic Path:</label><input type="textbox" id="pdfurl" style="width:1000px;"></input><br/><span id="pdfmsg"></span>');

        $("#pdfname").keyup(function () {
            var pname = $(this).val();
            var preurl = "http://ap.telamonglobal.com/8FE6DB8F-D67F-448B-8834-B22E57B3D3FE/";
            var fullurl = "";
            if (pname != "") {
                fullurl = preurl + pname;
                $("#pdfurl").val(fullurl);
                //$("#pdfmsg").html("Note: The matic path of "+pname+" has been generated.");				
                $("#pdfurl").focus().select();
                $(this).val("");
            }
        });
    }

});
