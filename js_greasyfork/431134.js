// ==UserScript==
// @name         TRIT
// @namespace    http://tampermonkey.net/
// @version      20.3.13
// @description  make life easy
// @author       JWCT
// @match        http://34.87.111.75/*
// @match        http://fixlogy.com/*
// @match        http://35.197.158.218/*


//// @icon         http://34.87.111.75/pcrt/v9/repair/images/logo.png
// @require      https://code.jquery.com/jquery-3.5.1.min.js

//https://greasyfork.org/en/scripts/431134-trit
//http://34.87.111.75/trit/repair/index.php?pcwo=44159

//https://getcssscan.com/css-buttons-examples
// @grant       none

// @run-at document-end

// @downloadURL https://update.greasyfork.org/scripts/431134/TRIT.user.js
// @updateURL https://update.greasyfork.org/scripts/431134/TRIT.meta.js
// ==/UserScript==
var testmode=0; //9=J , 1=J1 , 0 = defaulty

var txtBranch="";
//var woid="";
var username ="";
var weburl;
var webFurl;
var customerName=customerWO=customerDeviceModel=customerCheckInTime=claimTicketURL="";
var cYear=cMonth=cDay=cHour=cMinute="";
var countchange=0;
var ccc=0;

////Array list
var partName=
[
["2.5 256GB","2.5 SATA SSD Lexar NS100 256GB - 1916"],
["2.5 512GB","2.5 SATA SSD Lexar NS100 512GB - 1797"],
["2.5 1TB","2.5 SATA SSD Lexar NS100 1TB - 2412"],
["NVME 256GB","PCIe SSD NVMe Lexar 256GB - 2468"],
["NVME 512GB","PCIe SSD NVMe SSD Lexar 512GB - 2390"],
["NVME 1TB","PCIe M.2 NVme SSD Lexar 1TB - 2446"]
];

var copyExcelFormatLabel=["TRIT","Techminal","OneStop","FS","TNN","YSMobile","TaiHe","local","oversea","all","FullAll","FAV2"/*,"Testing"*/];

var pickSupplierLabelTRIT=      ["Techminal-34","OneStop-37","Fssocom-29","Local-20","TNN-9","MlExpress-35","YsMobile-30","TaiHe-31","Oversea-21"];
var pickSupplierLabelTechminal= ["OneStop-10","Fssocom-9","Local-16","TNN-12","MlExpress-13","Oversea-7"];
////end item list


window.onload = function exampleFunction()
{
    getCurrentDateTime();
    defaultData();
    
    GenerateNCheckAntiVirusNCleaningService();
    //var tmpinput=$("<input type='text' id='inputTMP' value='0'>");
    //$("body").prepend("<input type='text' id='inputTMP' value='0'>");
}

$( document ).ready(function()
{


    $("body").on("click", "[name='btnCopyReceiptAntiVirusNCleaning']", function()
    {   
        cpyReceiptAntiVirusNCleaning()
    });
    //



    $("body").on("mouseover", "#btnWhatsAppPhoneNumber, #btnWhatsAppSendReadyToCollectTxt", function()
    {
        $(this).css({"border-width": "1px"});
    });
    $("body").on("mouseleave", "#btnWhatsAppPhoneNumber, #btnWhatsAppSendReadyToCollectTxt", function()
    {
        $(this).css({"border-width": "2px"});
    });

    $("body").on("click", ".catchstatuschange, .displayblock, .radiusall, .linkbuttonopaque2, .linkbuttonmedium, .catchstatuschange, .catchloadworkorder, .linkbuttongreen, .linkbuttonsmall, .sbutton, .catchclass, .linkbuttonlarge, .linkbuttonblack", function()
    {
        GenerateWhatsappButton();
        countchange=0;
        removeOldEleIDfacebox();
        
    });
    $("body").on("click", "[name='btnCopyExcelFormat']", function()
    {
        var btnType=$(this).attr("btntype");
        GenerateBtnCopyToExcelFormat(btnType);
    });
    $("body").on("click", "#btnGenerateReceiveNote", function()
    {
        GenerateReceiveNote();
    });
    $("body").on("click", "#btnGenerateSupplierPartNo", function()
    {
        GenerateSupplierPartNo();
    });


    $("body").on("click", "#btntowa", function()
    {
        var wanumber=$("#txtwanumber").val();
        wanumber=PhoneNumberFilter(wanumber);

        var new_window; new_window =window.open("https://api.whatsapp.com/send?phone="+wanumber);
    });
    $("body").on("click", "[name='btnwaadd']", function()
    {
        var branchaddress=$(this).val();
        var wanumber=$("#txtwanumber").val();
        wanumber=PhoneNumberFilter(wanumber);
        var new_window; new_window =window.open(sendAddressToWA(wanumber,branchaddress));
    });

    $("body").on("input click", "#autoinvsearchbox", function()
    {
        PlugOverFlowScrollingToInventoryList();
    });
    $("body").on("click", "#addcnote", function() 
    {
        GenerateNoteTextGeneratorClick("public");  
    });
    $("body").on("click", "#addtnote", function() //
    {
        GenerateNoteTextGeneratorClick("private");  
    });

    $("body").on("click", "[name='cboxForNote']", function()
    {
//\\      

        //console.log("count 1 : "+ccc);
        var cboxcheck="";
        //console.log("count 2 : "+ccc);
        /*
        var days = [];
        $.each($("input[name='cboxForNote']:checked"), function()
        {
            days.push($(this).val());
        });
        */
        //console.log("Selected say(s) are: " + days.join(", "));
        //alert();

        //if($(this).is(":checked"))
        //{
            /*
            if($("#cboxNoteQuotation").is(":checked"))
            {
                console.log("aa");
                if($(this).val()[0]=="+")
                    console.log("checked : +++");
            }
            
            */
            /*if($(this).val()=="IntCleaningMsg" && $("#cboxNoteQuotation").not(":checked"))
            {
                console.log("asd");
                cboxcheck="IntCleaningMsg";
            }
            else
            */ 

            /*if(($("#cboxNoteDisposeMsg").prop("checked")==false || $("#cboxNoteIntCleaningMsg").prop("checked")==false) && $("#cboxNoteQuotation").is(":checked"))
            {
                console.log("aaaaaa");
            }*/


            if($(this).val()=="IntCleaningMsg" || $(this).val()=="DisposeMsg"|| $(this).val()=="LabFee100"|| $(this).val()=="DataCollection")
            {
                if($(this).prop("checked")==false)
                {
                    if($("#cboxNoteQuotation").is(":checked"))
                    {
                        cboxcheck="Quotation"; 
                    }
                }
                else
                {
                    cboxcheck=$(this).val();
                }
            }

            
            /*if($(this).val()=="IntCleaningMsg")
            {
                cboxcheck="IntCleaningMsg";
            }
            else if($(this).val()=="DisposeMsg")
            {
                cboxcheck="DisposeMsg";
            }*/
            else if($("#cboxNoteQuotation").is(":checked"))
            {
                cboxcheck="Quotation";
            }
            else
            {
                console.log("cc : "+$(this).val());
            }

        //}
   


        //$("form#custnoteform > textarea#custnoteta").html(generateQuotaion(cboxcheck));
        //$("form#custnoteform > textarea#custnoteta").change();
        if($(this).attr("notetype")=="public")
        {
            $("form#custnoteform").find("textarea").val(generateQuotaion(cboxcheck,$(this).attr("notetype")));
            $("form#custnoteform").find("textarea").change();
        }
        else if($(this).attr("notetype")=="private")
        {
            $("form#technoteform").find("textarea").val(generateQuotaion(cboxcheck,$(this).attr("notetype")));
            $("form#technoteform").find("textarea").change();
        }

        
       //$("#custnoteta").html(generateQuotaion(cboxcheck));
        //$("#custnoteta").change();

        //console.log("end");
    });   
    $("body").on("click", "#btnGeneratePickSupplier", function()
    {   
        $("[name='sposupplierid']").val($(this).attr("splid"));
    });

    $("body").on("click", "#btnGenerateNameOfPart", function()
    {
        $("[name='spopartname']").val(txtBranch+" - "+$(this).attr("fname"));
    });
    

    $("body").on("click", "#repaircartadd", function()
    {
        //console.log("xxxxxxxx");
        /*
        $("div#repaircartbox > div#repaircartbox2 >table>tbody>tr").children("td:nth-child(1)").children("table:nth-child(3)").next().next().next().next().find("a").attr({"id":"btnAddSpecialOrderPartBtnOnWoPage","name":"btnAddSpecialOrderPartBtnOnWoPage"});
        */
        //$("div#repaircartbox > div#repaircartbox2 >table>tbody>tr").children("td:nth-child(1)").children("table:nth-child(7)").find("a").attr({"id":"btnAddSpecialOrderPartBtnOnWoPage","name":"btnAddSpecialOrderPartBtnOnWoPage","onlick":"javascript:$('#inputTMP').val(1)"});
        
        
        //var ele=$("div#repaircartbox > div#repaircartbox2 >table>tbody>tr").children("td:nth-child(1)").children("table:nth-child(7)").find("a");
        //ele.attr({"id":"btnAddSpecialOrderPartBtnOnWoPage","name":"btnAddSpecialOrderPartBtnOnWoPage"});
        countchange=0; //reset add special order part count
        removeOldEleIDfacebox();
    });




   // $("#facebox").remove();

//if(username=="J")
//{
    /*
    $("body").on("click", "btnAddSpecialOrderPartBtnOnWoPage , [name='btnAddSpecialOrderPartBtnOnWoPage']", function()  
    {
        console.log("test123");
    });
    */
    $("body").on("DOMSubtreeModified", "#facebox", function()  
    {
        /*if($("#inputTMP").val()=="0")
            console.log("0000");
        else
            console.log("1111");
        */
       //$("#facebox >.content").html()
        if(countchange==0)
        {
            //removeOldEleIDfacebox();
            if($("form#catchaddspo").length!=0)
            {
                //console.log('changedv1');
                countchange++;
                //console.log('changedv4 .....'+ countchange);
                GenerateReceiveNoteBtn();
                GeneratePickSupplierBtn();
                /*
                GeneratePickSupplierBtn("Techminal-34");
                GeneratePickSupplierBtn("Fssocom-29");
                GeneratePickSupplierBtn("Local-20");
                GeneratePickSupplierBtn("TNN-9");
                GeneratePickSupplierBtn("MlExpress-35");
                GeneratePickSupplierBtn("YsMobile-30");
                GeneratePickSupplierBtn("Oversea-21");
                */
                //console.log('changedv2');
                /*if(txtBranch!="Techminal")
                {
                    GenerateItemNameBtn();
                    console.log('changedv3');
                }*/
                //$("[name='spopartname']").val("asd");
                //console.log('changedv4');
                var cd = setInterval(function()
                {
                    countchange=0;
                    console.log("reset count change");
                    clearInterval(cd);
                }, 1000);
            }

            
            
        }
        //console.log('changedv5');
        //if(countchange==1)
                //countchange=0;
        
    });
//}

    $("body").on("click", "[name='btnCopyReceiptAndPrices']", function()
    {
        copyReceiptAndPrices();
    });
    $("body").on("click", "[name='btnFilterAndOpenNewTab']", function()
    {
        filterAndOpenInNewTab();
    });
    
    $("body").on("click", "#addnoninvonfloater", function()
    {
        GenerateTypeOfDiscountShopeeLazadaBtn();
    });
    
    $("body").on("click", "[name='btnFillProductName']", function()
    {
        $("#ni_title[name='itemdesc']").val($(this).text());
    });


    
});


function getCurrentDateTime()
{
    new Date().getTime();          // Get the time (milliseconds since January 1, 1970)
    cYear = new Date().getFullYear();      // Get the four digit year (yyyy)
    cMonth = new Date().getMonth() +1;        // Get the month (0-11)
    cDay = new Date().getDate();          // Get the day as a number (1-31)
    cHour = new Date().getHours();         // Get the hour (0-23)
    cMinute = new Date().getMinutes();       // Get the minutes (0-59)
    new Date().getSeconds();       // Get the seconds (0-59)
    new Date().getMilliseconds();  // Get the milliseconds (0-999)
    


    cMonth=((''+cMonth).length<2 ? '0' : '')+cMonth; 
    cDay=((''+cDay).length<2 ? '0' : '')+cDay;

    new Date().getDay();           // Get the weekday as a number (0-6)
}

function defaultData()
{
    username=$(".primary_linkgo_rightnew").text();
    username=username.split("\n ");
    username=username[1].trim();
    if(testmode==9)
        username="J"; //use to test only
    if(testmode==1)
        username="J1"; //use to test only
//alert(username);
    var sBranch = $(".primary_linkgonew").text();

    if(sBranch.indexOf("TRIT AMK")>=0)
        txtBranch="AMK";
    else if(sBranch.indexOf("TRIT Hougang")>=0)
        txtBranch="Hougang";
    else if(sBranch.indexOf("TRIT Tampines")>=0)
        txtBranch="Tampines";
    else if(sBranch.indexOf("TRIT Yishun")>=0)
        txtBranch="Yishun";
    else if(sBranch.indexOf("TECHMINAL")>=0)
        txtBranch="TECHMINAL";

    generateCSS();
    GenerateWhatsappButton();
    PlugColorToSpecialOrder();
    GetURL();

    var func=webFurl.split("php?func=");
    if (~weburl.indexOf("/store/stock.php")&& (func[1].indexOf("editspo")==0 || func[1].indexOf("addspo")==0))
    {
        GenerateReceiveNoteBtn();
        GeneratePickSupplierBtn();
        /*
        GeneratePickSupplierBtn("Techminal-34");
        GeneratePickSupplierBtn("Fssocom-29");
        GeneratePickSupplierBtn("Local-20");
        GeneratePickSupplierBtn("TNN-9");
        GeneratePickSupplierBtn("MlExpress-35");
        GeneratePickSupplierBtn("YsMobile-30");
        GeneratePickSupplierBtn("Oversea-21");
        */
        if(username=="Ljy" || username=="Lyn" ||  username=="J")
            GenerateSupplierPartNoBtn();
        
            if(txtBranch!="Techminal")
                GenerateItemNameBtn();
    }
    

    GenerateCopyBtn();
    /*GenerateCopyBtn("Techminal");
    GenerateCopyBtn("FS");
    GenerateCopyBtn("TNN");
    GenerateCopyBtn("local");
    GenerateCopyBtn("oversea");
    GenerateCopyBtn("all");
    GenerateCopyBtn("FullAll");
    if(username=="Ljy" || username=="Lyn" ||  username=="J")
        GenerateCopyBtn("FAV2");
*/
    GenerateInputWhatsappSlot();

    GenerateDailyReportCopyBtn();
    GenerateFilterForOpenNewTabBtn();

    GenerateShopeeLazadaFillOrderDateBtn();
   

}

function PhoneNumberFilter(phonenumber)
{
    var rtn=phonenumber.replace(/\D/g,''); //filter out non digit character
    rtn=rtn.trim();
    if(rtn.length==8)
        rtn="65"+rtn;
    if(rtn[0]=="+")
        rtn=rtn.substring(1, 9999);
    return rtn;

}
function GetURL()
{
    weburl=window.location.pathname;
    webFurl = window.location.href;
}
function GetCustomerData()
{
    var customerTitle=$("#mainworkorder").find(".colortitletopround").children("span:nth-child(1)").text();
    customerTitle=customerTitle.split(" • ");
    customerName=customerTitle[0];
    //customerDeviceModel=customerTitle[1];
    if(customerTitle.length==3)
        customerDeviceModel=customerTitle[2];
    else
        customerDeviceModel=customerTitle[1];

    if($(".whitemiddle").length!=0)
    {
        claimTicketURL=$(".whitemiddle").find(".nvbar").children(".nvdropdown:nth-child(3)").find("div").children("a:nth-child(1)").attr("href");
        var woele = claimTicketURL.split("woid=");
        customerWO = woele[1];
    }
    if($("#woattarea").length!=0)
    {
        customerCheckInTime=$("#woattarea").next().next().find("tbody").children("tr:nth-child(3)").children("td:nth-child(2)").text();
    }
    

}

function GenerateWhatsappButton()
{

    /*if($("#mainworkorder#mainworkorder").length)
    {
        console.log("bb : "+rcount);
    }
    else 
        console.log("nono"+rcount);
    */

    
    var rcount=0;
    var cd = setInterval(function()
    {
        //getWOID();
        GetCustomerData();
        if($("[name='divExtentionCustomerCallNumber']").length == 0 )
        {
            if($(".fa.fa-home.fa-lg.fa-fw").length)
                GenerateExtentionForCustomerCallNumber(txtBranch,findHomeIconTD());
            if($(".fa.fa-mobile.fa-lg.fa-fw").length)
                GenerateExtentionForCustomerCallNumber(txtBranch,findMobileIconTD());
            if($(".fa.fa-suitcase.fa-lg.fa-fw").length)
                GenerateExtentionForCustomerCallNumber(txtBranch,findSuitcaseIconTD());
                //console.log("check round"+rcount+".1");
        }
       /* else
            console.log("check divExtentionCustomerCallNumber length"+$("[name='divExtentionCustomerCallNumber']").length);*/

        if($("[name='divExtentionCustomerNote']").length == 0 )
        {
            GenerateExtentionForNote(txtBranch,"public");
            //console.log("aa : "+rcount);
           // if(txtBranch=="Yishun")
             //   GenerateExtentionForNote(txtBranch,"private");
            //console.log("check round"+rcount+".2");
          //  console.log("check 1 - "+$("[name='divExtentionCustomerNote']").length);
        }
        if($("[name='divExtentionTechNote']").length == 0 )
        {
            GenerateExtentionForNote(txtBranch,"private");
        }
       // console.log("check 2 - "+$("[name='divExtentionCustomerNote']").length);
        rcount++;
        if(rcount>=10)
            clearInterval(cd);
        //console.log("check round"+rcount);
    }, 200);

}


function GenerateExtentionForNote(branch,notetype)
{
    var custNoteArea;
    var divname;
    if(notetype=="private")
    {
        custNoteArea=$("#technotearea");
        divname="divExtentionTechNote";
    }
    else if(notetype=="public")
    {
        custNoteArea=$("#custnotearea");
        divname="divExtentionCustomerNote";
    }
    custNoteArea=custNoteArea.find(".pillbox");
    var custNoteAreaTR=custNoteArea.find("tr");
    custNoteAreaTR.children("td:nth-child(2)").each(function(index, val)
    {
        var eleSpan=$(this).children("span");
        eleSpan.remove();
        var txtCustNote=$(this).text();
        $(this).append(eleSpan);
        var div=$("<div></div>");
        div.css("display","flex");
        div.attr({"name":divname});
        $(this).append(div);
        $('[id=btnWhatsAppPhoneNumber]').each(function()
        {
            div.append(generateBtnRedirectToWhatsappWithTxt($(this).attr("ph"),txtCustNote));
        });
        removeDuplicateElement(div,"ph","");
    });
}



function encodeStr(txt)
{

    //return encodeURIComponent(txt);


    //function fixedEncodeURIComponent(str) 
    //{
    return encodeURIComponent(txt).replace(/[!'()*]/g, function(c) 
    {
        return '%' + c.charCodeAt(0).toString(16);
    });
    //}
    
}

function generateBtnRedirectToWhatsappWithTxt(phone,txt)
{
    var rphone=PhoneNumberFilter(phone);

    var id="btnWhatsAppSendTxt";
    var btn=$("<button><button>");
    btn.css({"width":"auto","height":"30px","margin-left": "10px","border-style": "solid"});
    btn.text("sWhatsapp "+rphone);
    btn.attr({"id":id,"ph":phone,"onclick":"var new_window; new_window =window.open('https://api.whatsapp.com/send?phone="+rphone+"&text="+encodeStr(txt)+"'); setTimeout(function(){ new_window.close(); }, 1000);"});
    return btn;
}

function GenerateExtentionForCustomerCallNumber(txtBranch,iconTD)
{
    var elePhoneTD =iconTD.next("td");
    var elePhoneStrong = elePhoneTD.find("strong");
    var txtPhoneNo=elePhoneStrong.text();
    var div=$("<div></div>");
    div.attr({"name":"divExtentionCustomerCallNumber"});
    div.css("display","flow-root");
    elePhoneTD.append(div);
    div.append(generateBtnRedirectToWhatsapp(txtPhoneNo));
    div.append(generateBtnRedirectToWhatsappWithReadyToCollectTxt(txtBranch,txtPhoneNo));
    div.append(generateBtnRedirectToWhatsappWithBeyondRepairTxt(txtPhoneNo));
    div.append(generateBtnRedirectToWhatsappWithToFixTxt(txtBranch,txtPhoneNo));
    div.append(generateBtnRedirectToWhatsappWithToOrderTxt(txtBranch,txtPhoneNo));
    div.append(generateBtnRedirectToWhatsappGoogleMapReview1Txt(txtBranch,txtPhoneNo));
    div.append(generateBtnRedirectToWhatsappGoogleMapReview2Txt(txtBranch,txtPhoneNo));
    div.append(generateBtnRedirectClaimTicket());
    div.append(generateBtnRedirectAssetLabel());
    


    
    removeDuplicateElement(div,"id","");
    removeDuobleElement();
}

function removeDuobleElement()
{
    var elename=["btnAssetLabel","btnClaimTicket"];
    for(var i=0;i<elename.length;i++)
    {
        var eleLength = $("[name='"+elename[i]+"']").length;
        if(eleLength>1)
        {
            for(var c=1;c<eleLength;c++)
            {$("[name='"+elename[i]+"']")[c].remove();}
        }

    }
    
}
function removeDuplicateElement(ele,attr,eleid)
{
    var preEleId="";
    var prePhId=""
    var ccount=0;
    if(ele=="noEle")
    {
        $("["+attr+"='"+eleid+"']").each(function() 
        {
            /*if($(this)!=preEleId)
            {
                preEleId=$(this);
                console.log("d1");
            }
            else
            {*/
                //preEleId.remove();
                //preEleId=$(this);
                //console.log("d2");
            //}
            //console.log("dd..."+attr+"....."+eleid+"...."+ccount);
            if(ccount==0)
            {
                preEleId=$(this);
                //console.log("d1");
            }
            else
            {
                preEleId.remove();
                preEleId=$(this);
                //console.log("d2");
            }
            ccount++;
        });
        //$("[name='divTextTemplateGenerator']").remove();
    }
    else
    {
        ele.children().each(function(index, val)
        {
            if($(this).attr(attr)!=preEleId)
                preEleId=$(this).attr(attr);
            else
                $(this).remove();
        });
    }

    //console.log("deleted");
}
function generateBtnRedirectClaimTicket()
{
    var id="btnClaimTicket";
    var btn=$("<button><button>");
    btn.css({"width":"auto","height":"30px","margin-left": "10px","border-style": "solid"});
    btn.text("PTicket");
    btn.attr({"id":id,"name":id,"onclick":"var new_window; new_window =window.open('"+claimTicketURL+"');"});
    return btn;
}

function generateBtnRedirectAssetLabel()
{
    var id="btnAssetLabel";
    var btn=$("<button><button>");
    btn.css({"width":"auto","height":"30px","margin-left": "10px","border-style": "solid"});
    btn.text("ALabel");
    btn.attr({"id":id,"name":id,"onclick":"var new_window; new_window =window.open('"+$(".whitemiddle").find(".nvbar").children(".nvdropdown:nth-child(3)").find("div").children("a:nth-child(8)").attr("href")+"');"});
    return btn;
}
function generateBtnRedirectToWhatsappGoogleMapReview1Txt(branch,phone)
{
    var id="btnWhatsAppSendGoogleMapReview1Txt";
    var btn=$("<button><button>");
    btn.css({"width":"auto","height":"30px","margin-left": "10px","border-style": "solid"});
    btn.text("GReview1");
    btn.attr({"id":id,"ph":phone,"onclick":"var new_window; new_window =window.open('"+rtnTxtGoogleMapReview1(branch,phone)+"'); setTimeout(function(){ new_window.close(); }, 1000);"});
    return btn;
}
function generateBtnRedirectToWhatsappGoogleMapReview2Txt(branch,phone)
{
    var id="btnWhatsAppSendGoogleMapReview2Txt";
    var btn=$("<button><button>");
    btn.css({"width":"auto","height":"30px","margin-left": "10px","border-style": "solid"});
    btn.text("GReview2");
    btn.attr({"id":id,"ph":phone,"onclick":"var new_window; new_window =window.open('"+rtnTxtGoogleMapReview2(branch,phone)+"'); setTimeout(function(){ new_window.close(); }, 1000);"});
    return btn;
}


function generateBtnRedirectToWhatsappWithReadyToCollectTxt(branch,phone)
{
    var id="btnWhatsAppSendReadyToCollectTxt";
    var btn=$("<button><button>");
    btn.css({"width":"auto","height":"30px","margin-left": "10px","border-style": "solid"});
    btn.text("RFCollect");
    btn.attr({"id":id,"ph":phone,"onclick":"var new_window; new_window =window.open('"+rtnTxtReadyForCollection(branch,phone)+"'); setTimeout(function(){ new_window.close(); }, 1000); "});
    //if (confirm('Press a button!')) {pathnameurl=window.location.pathname;window.location.pathname=pathnameurl+'pc.php?func=precalled&woid="+woid+"&status=2';}
    return btn;
}

function generateBtnRedirectToWhatsappWithBeyondRepairTxt(phone)
{
    var id="btnWhatsAppSendBeyondRepairTxt";
    var btn=$("<button><button>");
    btn.css({"width":"auto","height":"30px","margin-left": "10px","border-style": "solid"});
    btn.text("BeyondR");
    btn.attr({"id":id,"ph":phone,"onclick":"var new_window; new_window =window.open('"+rtnTxtBeyondRepair(phone)+"'); setTimeout(function(){ new_window.close(); }, 1000); "});
    //if (confirm('Press a button!')) {pathnameurl=window.location.pathname;window.location.pathname=pathnameurl+'pc.php?func=precalled&woid="+woid+"&status=2';}
    return btn;
}

function confirmationSetCalled()
{
    if (confirm("Press a button!")) {alert("aa");} else {alert("bb");}
}

function generateBtnRedirectToWhatsapp(phone)
{
    var rphone=PhoneNumberFilter(phone);

    var id="btnWhatsAppPhoneNumber";
    var btn=$("<button><button>");
    btn.attr("ph",phone);
    btn.css({"width":"30px","height":"30px","margin-left": "10px","background-image": "url('https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN=s180-rw')","background-size": "contain","border-style": "solid"});
    btn.attr({"id":id,"ph":phone,"onclick":"var new_window; new_window = window.open('https://api.whatsapp.com/send?phone="+rphone+"'); setTimeout(function(){ new_window.close(); }, 1000);"});
    return btn;
}

function findSuitcaseIconTD()
{
    //var ele=$(".fa.fa-suitcase.fa-lg.fa-fw");
    var ele=$("#mainworkorder").find(".whitemiddle").find("table").find("table").find("table").find(".fa.fa-suitcase.fa-lg.fa-fw")
    ele=ele.closest( "td" );
    return ele;
}

function  findMobileIconTD()
{
    //var ele=$(".fa.fa-mobile.fa-lg.fa-fw");
    var ele=$("#mainworkorder").find(".whitemiddle").find("table").find("table").find("table").find(".fa.fa-mobile.fa-lg.fa-fw")
    ele=ele.closest( "td" );
    return ele;
}

function findHomeIconTD()
{
    //var ele=$(".fa.fa-home.fa-lg.fa-fw");
    var ele=$("#mainworkorder").find(".whitemiddle").find("table").find("table").find("table").find(".fa.fa-home.fa-lg.fa-fw")
    ele=ele.closest( "td" );
    return ele;
}

function rtnTxtGoogleMapReview1(branch,phone)
{
    GetCustomerData();
    var rtn="";
   // var uname=$("#mainworkorder").find(".colortitletopround").children("span:nth-child(1)").text();
    //uname=uname.split(" • ");
    var rphone=PhoneNumberFilter(phone);

    if(branch=="AMK")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=Hi%20"+customerName+"%EF%BC%8C%0A%0AThank-You%20for%20your%20trust%20and%20choosing%20TRITcomputer%20for%20your%20recent%20service%20work%0A%20%20%20%20%0AWe%20want%20you%20to%20be%20satisfied%20with%20the%20level%20of%20service%20we%20have%20provided%20you.%0AIf%20you%20have%20any%20further%20issues%20or%20questions%2C%20do%20not%20hesitate%20to%20contact%20us.%0AWe%20want%20you%20to%20be%20100%25%20satisfied%20with%20our%20work.%0A%20%20%20%20%0AWe%20strive%20to%20provide%205%20Star%20service%20with%20every%20service%20work%20we%20deliver.%0A%20%20%20%20%0AIf%20you%20have%20any%20immediate%20issues%20or%20feedback%20though%2C%20be%20sure%20to%20contact%20us%20directly%2C%0Awe%20are%20ready%20and%20eager%20to%20solve%20any%20issue.%0A%20%20%20%20%0AThanks%20Again%20for%20choosing%20us%2C%20and%20please%20remember%20us%20for%20any%20future%20needs.%0A%20%20%20%20%0ASincerely%2C%0ATRIT%20Computer%20-%20AMK%0AApple%20Certified%20Mac%20%26%20iOS%20Technician%0A%20%20%20%20%0A";
    }
    else if(branch=="Hougang")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=Hi%20"+customerName+"%EF%BC%8C%0A%0AThank-You%20for%20your%20trust%20and%20choosing%20TRITcomputer%20for%20your%20recent%20service%20work%0A%20%20%20%20%0AWe%20want%20you%20to%20be%20satisfied%20with%20the%20level%20of%20service%20we%20have%20provided%20you.%0AIf%20you%20have%20any%20further%20issues%20or%20questions%2C%20do%20not%20hesitate%20to%20contact%20us.%0AWe%20want%20you%20to%20be%20100%25%20satisfied%20with%20our%20work.%0A%20%20%20%20%0AWe%20strive%20to%20provide%205%20Star%20service%20with%20every%20service%20work%20we%20deliver.%0A%20%20%20%20%0AIf%20you%20have%20any%20immediate%20issues%20or%20feedback%20though%2C%20be%20sure%20to%20contact%20us%20directly%2C%0Awe%20are%20ready%20and%20eager%20to%20solve%20any%20issue.%0A%20%20%20%20%0AThanks%20Again%20for%20choosing%20us%2C%20and%20please%20remember%20us%20for%20any%20future%20needs.%0A%20%20%20%20%0ASincerely%2C%0ATRIT%20Computer%20-%20Hougang%0AApple%20Certified%20Mac%20%26%20iOS%20Technician%0A%20%20%20%20%0A";
    }
    else if(branch=="Tampines")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=Hi%20"+customerName+"%EF%BC%8C%0A%0AThank-You%20for%20your%20trust%20and%20choosing%20TRITcomputer%20for%20your%20recent%20service%20work%0A%20%20%20%20%0AWe%20want%20you%20to%20be%20satisfied%20with%20the%20level%20of%20service%20we%20have%20provided%20you.%0AIf%20you%20have%20any%20further%20issues%20or%20questions%2C%20do%20not%20hesitate%20to%20contact%20us.%0AWe%20want%20you%20to%20be%20100%25%20satisfied%20with%20our%20work.%0A%20%20%20%20%0AWe%20strive%20to%20provide%205%20Star%20service%20with%20every%20service%20work%20we%20deliver.%0A%20%20%20%20%0AIf%20you%20have%20any%20immediate%20issues%20or%20feedback%20though%2C%20be%20sure%20to%20contact%20us%20directly%2C%0Awe%20are%20ready%20and%20eager%20to%20solve%20any%20issue.%0A%20%20%20%20%0AThanks%20Again%20for%20choosing%20us%2C%20and%20please%20remember%20us%20for%20any%20future%20needs.%0A%20%20%20%20%0ASincerely%2C%0ATRIT%20Computer%20-%20Tampines%0AApple%20Certified%20Mac%20%26%20iOS%20Technician%0A%20%20%20%20%0A";
    }
    else if(branch=="Yishun")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=Hi%20"+customerName+"%EF%BC%8C%0A%0AThank-You%20for%20your%20trust%20and%20choosing%20TRITcomputer%20for%20your%20recent%20service%20work%0A%20%20%20%20%0AWe%20want%20you%20to%20be%20satisfied%20with%20the%20level%20of%20service%20we%20have%20provided%20you.%0AIf%20you%20have%20any%20further%20issues%20or%20questions%2C%20do%20not%20hesitate%20to%20contact%20us.%0AWe%20want%20you%20to%20be%20100%25%20satisfied%20with%20our%20work.%0A%20%20%20%20%0AWe%20strive%20to%20provide%205%20Star%20service%20with%20every%20service%20work%20we%20deliver.%0A%20%20%20%20%0AIf%20you%20have%20any%20immediate%20issues%20or%20feedback%20though%2C%20be%20sure%20to%20contact%20us%20directly%2C%0Awe%20are%20ready%20and%20eager%20to%20solve%20any%20issue.%0A%20%20%20%20%0AThanks%20Again%20for%20choosing%20us%2C%20and%20please%20remember%20us%20for%20any%20future%20needs.%0A%20%20%20%20%0ASincerely%2C%0ATRIT%20Computer%20-%20Yishun%0AApple%20Certified%20Mac%20%26%20iOS%20Technician%0A%20%20%20%20%0A";
    }
    else if(branch=="TECHMINAL")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=Hi%20"+customerName+"%EF%BC%8C%0A%0AThank-You%20for%20your%20trust%20and%20choosing%20Techminal%20for%20your%20recent%20service%20work%0A%20%20%20%20%0AWe%20want%20you%20to%20be%20satisfied%20with%20the%20level%20of%20service%20we%20have%20provided%20you.%0AIf%20you%20have%20any%20further%20issues%20or%20questions%2C%20do%20not%20hesitate%20to%20contact%20us.%0AWe%20want%20you%20to%20be%20100%25%20satisfied%20with%20our%20work.%0A%20%20%20%20%0AWe%20strive%20to%20provide%205%20Star%20service%20with%20every%20service%20work%20we%20deliver.%0A%20%20%20%20%0AIf%20you%20have%20any%20immediate%20issues%20or%20feedback%20though%2C%20be%20sure%20to%20contact%20us%20directly%2C%0Awe%20are%20ready%20and%20eager%20to%20solve%20any%20issue.%0A%20%20%20%20%0AThanks%20Again%20for%20choosing%20us%2C%20and%20please%20remember%20us%20for%20any%20future%20needs.%0A%20%20%20%20%0ASincerely%2C%0ATechminal%0AApple%20Certified%20Mac%20%26%20iOS%20Technician%0A%20%20%20%20%0A";
    }

    return rtn;
}

function rtnTxtGoogleMapReview2(branch,phone)
{
    GetCustomerData();
    var rtn="";
    var rphone=PhoneNumberFilter(phone);

    if(branch=="AMK")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=It%20will%20be%20great%20if%20you%20can%20help%20to%20Click%20the%20link%20below%20to%20rate%20and%20leave%20us%20your%20valuable%20review.%20Thank%20you!%0Ahttps%3A%2F%2Fg.page%2Fr%2FCS51tQqVBkLHEBM%2Freview%20";
    }
    if(branch=="Hougang")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=It%20will%20be%20great%20if%20you%20can%20help%20to%20Click%20the%20link%20below%20to%20rate%20and%20leave%20us%20your%20valuable%20review.%20Thank%20you!%0Ahttps%3A%2F%2Fg.page%2Fr%2FCSCMXrB0DnG4EBM%2Freview%20";
    }
    if(branch=="Tampines")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=It%20will%20be%20great%20if%20you%20can%20help%20to%20Click%20the%20link%20below%20to%20rate%20and%20leave%20us%20your%20valuable%20review.%20Thank%20you!%0Ahttps%3A%2F%2Fg.page%2Fr%2FCcf28hpDS6QNEBM%2Freview%20";
    }
    if(branch=="Yishun")
    {
        //rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=It%20will%20be%20great%20if%20you%20can%20help%20to%20Click%20the%20link%20below%20to%20rate%20and%20leave%20us%20your%20valuable%20review.%20Thank%20you!%0Ahttps%3A%2F%2Fg.page%2Fr%2FCc2YWe6qsRKMEBM%2Freview%20";
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=Hi%20"+customerName+"%EF%BC%8C%0A%0AThank-You%20for%20your%20trust%20and%20choosing%20TRITcomputer%20for%20your%20recent%20service%20work%0A%0AIt%20will%20be%20great%20if%20you%20can%20help%20to%20Click%20the%20link%20below%20to%20rate%20and%20leave%20us%20your%20valuable%20review.%20Thank%20you!%0A%0Ahttps%3A%2F%2Fgoogle.reviewsg.site";
    }
    else if(branch=="TECHMINAL")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=It%20will%20be%20great%20if%20you%20can%20help%20to%20Click%20the%20link%20below%20to%20rate%20and%20leave%20us%20your%20valuable%20review.%20Thank%20you!%0Ahttps%3A%2F%2Fg.page%2Fr%2FCVaHFth9XKD6EBM%2Freview%20";
    }

    return rtn;
}

function rtnTxtReadyForCollection(branch,phone)
{
    GetCustomerData();
    var rphone=PhoneNumberFilter(phone);
    

    var rtn="";
    if(branch=="AMK")
    {
        //rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=%5BTRITcomputer%20-%20AMK%5D%0A%0ADear%20"+customerName+"%2C%0AWork Order ID "+customerWO+"%0APhone Number "+rphone+" %0A%0AYour%20Device%20is%20ready%20for%20collection.%20%0A%0APayment%20Mode%3A%0A*PayNow%2C%20PayLah%2C%20Bank%20Transfer%20and%20NETS%20only.*%0A(NO%20CASH%20PAYMENT)%0A%0AKindly%20bring%20along%20your%20Claim%20Ticket%20OR%0Ashow%20us%20your%20E-Claim%20Ticket%20for%20verification.%0A(Check%20your%20Mailbox%20or%20Junk%20Mail)%0A%0ABusiness%20hours%20are%20as%20follows%3A%0A10%3A00am%20to%208%3A00pm%20(%20Weekday%20)%0A12%3A00pm%20to%205%3A00pm%20(%20Weekend%20)%0A*Closed%20on%20Public%20Holiday%E2%80%A8%0A%0AVisit%20our%20website%20for%20more%20details%3A%0Ahttps%3A%2F%2Fwww.tritcomputer.sg%2F%0A%0AJoin%20us%20at%20Facebook%3A%0Ahttps%3A%2F%2Fwww.facebook.com%2Ftritcomputer%2F%0A%0ARegards%2C%0ATRITcomputer%20-%20AMK%0A%0AThank%20you%20%26%20Have%20a%20nice%20day!";
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=%5BTRITcomputer%20-%20AMK%5D%0A%0ADear%20"+customerName+"%2C%0AWork%20Order%20ID%20"+customerWO+"%0APhone%20Number%20"+rphone+"%20%0A%0AYour%20Device%20is%20ready%20for%20collection.%20%0A%0APayment%20Mode%3A%0APayNow%2C%20PayLah%2C%20Bank%20Transfer%20and%20NETS%20only.%0A(NO%20CASH%20PAYMENT)%0A%0AKindly%20bring%20along%20your%20Claim%20Ticket%20OR%0Ashow%20us%20your%20E-Claim%20Ticket%20for%20verification.%0A(Check%20your%20Mailbox%20or%20Junk%20Mail)%0A%0ABusiness%20hours%20are%20as%20follows%3A%0A10%3A00am%20to%208%3A00pm%20(%20Weekday%20)%0A12%3A00pm%20to%205%3A00pm%20(%20Weekend%20)%0A*Closed%20on%20Public%20Holiday%0A%0ALocation%0A720%20Ang%20Mo%20Kio%20Ave%206%2C%20%2301-4104C%2C%20Singapore%20560720%0A%0AGoogle%20Map%20%0Ahttps%3A%2F%2Fmaps.app.goo.gl%2F1P53aRynvReUgobn9%0A%0A%0AVisit%20our%20website%20for%20more%20details%3A%0Ahttps%3A%2F%2Fwww.tritcomputer.sg%2F%0A%0AJoin%20us%20at%20Facebook%3A%0Ahttps%3A%2F%2Fwww.facebook.com%2Ftritcomputer%2F%0A%0ARegards%2C%0ATRITcomputer%20-%20AMK%0A%0AThank%20you%20%26%20Have%20a%20nice%20day!";
    }
    /*else if(branch=="Hougang")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=%5BTRITcomputer%20-%20Hougang%5D%0A%0ADear%20"+customerName+"%2C%0AWork Order ID "+customerWO+"%0APhone Number "+rphone+" %0A%0AYour%20Device%20is%20ready%20for%20collection.%20%0A%0APayment%20Mode%3A%0A*PayNow%2C%20PayLah%2C%20Bank%20Transfer%20and%20NETS%20only.*%0A(NO%20CASH%20PAYMENT)%0A%0AKindly%20bring%20along%20your%20Claim%20Ticket%20OR%0Ashow%20us%20your%20E-Claim%20Ticket%20for%20verification.%0A(Check%20your%20Mailbox%20or%20Junk%20Mail)%0A%0ABusiness%20hours%20are%20as%20follows%3A%0A12%3A00pm%20to%208%3A00pm%20%0A(%20Weekday%20Except%20Tuesday%20)%0A12%3A00pm%20to%205%3A00pm%20(%20Weekend%20)%0A*Closed%20on%20Every%20Tuesday%20and%20Public%20Holiday%E2%80%A8%0A%0AVisit%20our%20website%20for%20more%20details%3A%0Ahttps%3A%2F%2Fwww.tritcomputer.sg%2F%0A%0AJoin%20us%20at%20Facebook%3A%0Ahttps%3A%2F%2Fwww.facebook.com%2Ftritcomputer%2F%0A%0ARegards%2C%0ATRITcomputer%20-%20Hougang%0A%0AThank%20you%20%26%20Have%20a%20nice%20day!";
    }*/
    else if(branch=="Tampines")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=%5BTRITcomputer%20-%20Tampines%5D%0A%0ADear%20"+customerName+"%2C%0AWork Order ID "+customerWO+"%0APhone Number "+rphone+" %0A%0AYour%20Device%20is%20ready%20for%20collection.%20%0A%0APayment%20Mode%3A%0A*PayNow%2C%20PayLah%2C%20Bank%20Transfer%20and%20NETS%20only.*%0A(NO%20CASH%20PAYMENT)%0A%0AKindly%20bring%20along%20your%20Claim%20Ticket%20OR%0Ashow%20us%20your%20E-Claim%20Ticket%20for%20verification.%0A(Check%20your%20Mailbox%20or%20Junk%20Mail)%0A%0ABusiness%20hours%20are%20as%20follows%3A%0A10%3A00am%20to%208%3A00pm%20%0A(%20Weekday%20Except%20Tuesday%20)%0A12%3A00pm%20to%205%3A00pm%20(%20Weekend%20)%0A*Closed%20on%20Every%20Tuesday%20and%20Public%20Holiday%E2%80%A8%0A%0AVisit%20our%20website%20for%20more%20details%3A%0Ahttps%3A%2F%2Fwww.tritcomputer.com%2F%0A%0AJoin%20us%20at%20Facebook%3A%0Ahttps%3A%2F%2Fwww.facebook.com%2Ftritcomputer%2F%0A%0ARegards%2C%0ATRITcomputer%20-%20Tampines%0A%0AThank%20you%20%26%20Have%20a%20nice%20day!";
    }
    else if(branch=="Yishun")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=%5BTRITcomputer%20-%20Yishun%5D%20%0A%0ADear%20"+customerName+"%2C%0AWork Order ID "+customerWO+"%0APhone Number "+rphone+" %0A%0AYour%20Device%20is%20ready%20for%20collection.%20%20%0A%0APayment%20Mode%3A%20%0A*PayNow%2C%20PayLah%2C%20Bank%20Transfer%20and%20NETS%20only.*%20%0A(NO%20CASH%20PAYMENT)%20%0A%0AKindly%20bring%20along%20your%20Claim%20Ticket%20OR%20%0Ashow%20us%20your%20E-Claim%20Ticket%20for%20verification.%20%0A(Check%20your%20Mailbox%20or%20Junk%20Mail)%20%0A%0ABusiness%20hours%20are%20as%20follows%3A%20%0A10%3A00am%20to%208%3A00pm%20(%20Daily%20)%20%20%0A%0AVisit%20our%20website%20for%20more%20details%3A%20%0Ahttps%3A%2F%2Fwww.tritcomputer.com%2F%20%0A%0AJoin%20us%20at%20Facebook%3A%20%0Ahttps%3A%2F%2Fwww.facebook.com%2Ftritcomputer%2F%20%0A%0ARegards%2C%20%0ATRITcomputer%20-%20Yishun%20%0A%0AThank%20you%20%26%20Have%20a%20nice%20day!";
    }
    else if(branch=="TECHMINAL")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=%5BTechminal%5D%0A%0ADear%20Sir%2FMdm%2C%0AYour%20Device%20is%20ready%20for%20collection.%20%0A%0APayment%20Mode%3A%0APayNow%2C%20GrabPay%2C%20PayLah%20and%20Bank%20Transfer.%0A%0A%0AKindly%20bring%20along%20your%20Claim%20Ticket%20OR%0Ashow%20us%20your%20E-Claim%20Ticket%20for%20verification.%0A(Check%20your%20Mailbox%20or%20Junk%20Mail)%0A%0ABusiness%20Hours%0A11%3A30am%20to%208%3A00pm%20(Daily)%0A11%3A30am%20to%205%3A00pm%20(Sunday%20only)%0A%0A%0ARegards%2C%0AYour%20Techminal%20Team%0A(Sim%20Lim%20Square%20%2301-26)%0A(Beside%20Loading%20Bay)%0A%0AThank%20you%20%26%20Have%C2%A0a%C2%A0nice%C2%A0day!";
    }

    return rtn;
}
function rtnTxtBeyondRepair(phone)
{
    GetCustomerData();
    var rphone=PhoneNumberFilter(phone);
    
    
    var rtn="";
    if(txtBranch=="AMK" || txtBranch=="Hougang" || txtBranch=="Tampines" || txtBranch=="Yishun")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=Hi%20%20"+customerName+"%0AWork%20Order%20ID%20"+customerWO+"%0APhone%20Number%20"+rphone+"%20%0A%0A%0ASorry%20to%20inform%20that%20your%20device%20main%20board%20is%20beyond%20repair.%20%20%0AOur%20technician%20have%20tried%20several%20times%2C%20but%20it%20still%20unable%2C%20sometime%20also%20unable%20power%20on.%20%0A%20%0ASo%20we%20will%20return%20It%20back%20to%20you%20without%20charges%20%0A%20%0AThanks.%20%0ATRIT%20Computer%20";
    }
    else if(txtBranch=="TECHMINAL")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=Hi%20%20"+customerName+"%0AWork%20Order%20ID%20"+customerWO+"%0APhone%20Number%20"+rphone+"%20%0A%0A%0ASorry%20to%20inform%20that%20your%20device%20main%20board%20is%20beyond%20repair.%20%20%0AOur%20technician%20have%20tried%20several%20times%2C%20but%20it%20still%20unable%2C%20sometime%20also%20unable%20power%20on.%20%0A%20%0ASo%20we%20will%20return%20It%20back%20to%20you%20without%20charges%20%0A%20%0AThanks.%20%0ATECHMINAL";
    }

    return rtn;
}
function PlugColorToSpecialOrder()
{
    //var weburl=window.location.pathname;
    GetURL();
    if (~weburl.indexOf("/store/stock.php"))
    {
        $(".whitebottom").find("table").find("tr").each(function(index, value)
        {
            //console.log(index +" -->> "+ $(this).children("td:nth-child(8)").children("span:nth-child(1)").text());
            var opSupplier=$(this).children("td:nth-child(3)").text();
            var opStatus=$(this).children("td:nth-child(8)").children("span:nth-child(1)").text();
            var bgColorCode="";

            if(opStatus=="Order Part" && opSupplier=="Fssocom")
            {
                if(username=="Ljy" || username=="Lyn" ||  username=="J")
                    bgColorCode="#edaa7e";
                else
                    bgColorCode="#70e18e";
            }
            else if(opStatus=="Order Part" && opSupplier=="# TECHMINAL PTE. LTD.")
            {
                if(username=="Ljy" || username=="Lyn" ||  username=="J")
                    bgColorCode="ffffff";
                else
                    bgColorCode="#75e93a";
            }
            else if(opStatus=="Order Part" && opSupplier=="#Overseas")
            {
                if(username=="Ljy" || username=="Lyn" ||  username=="J")
                    bgColorCode="#8ed0ff";
                else
                    bgColorCode="#4defb3";
            }
            else if(opStatus=="Order Part" && opSupplier=="TNN")
            {
                if(username=="Ljy" || username=="Lyn" ||  username=="J")
                    bgColorCode="#eded6d";
                else
                    bgColorCode="#97e370";
            }
            else if(opStatus=="Order Part")
            {
                if(username=="Ljy" || username=="Lyn" ||  username=="J")
                {
                    bgColorCode="#ffffff";
                }
                else
                    bgColorCode="#a6ff79";
            }
            else if(opStatus=="Shipped")
            {
                if(username=="Ljy" || username=="Lyn" ||  username=="J")
                    bgColorCode="#8ed0ff";
                else
                    bgColorCode="#8ed0ff";
            }
            else if(opStatus=="Received")
            {
                if(username=="Ljy" || username=="Lyn" || username=="J")
                    bgColorCode="#ffb6b6";
                else
                    bgColorCode="#ffb6b6";
            }

            $(this).closest("tr").css("background-color", bgColorCode);
        });
    }
}
/*
function getWOID()
{
    if($(".whitemiddle").length!=0)
    {
        claimTicketURL=$(".whitemiddle").find(".nvbar").children(".nvdropdown:nth-child(3)").find("div").children("a:nth-child(1)").attr("href");
        //console.log("v2 "+claimTicketURL);
        var wo = claimTicketURL.split("woid=");
        //console.log("v3 "+wo);
        woid = wo[1];
        //console.log("url ..."+woid);

    }
    
}
*/
function GenerateCopyBtn()//GenerateCopyBtn(btnType)
{
    GetURL();
    //var weburl=window.location.pathname;
    //var webFurl = window.location.href;
    var func=webFurl.split("php?func=");
    //func[1];
    //specialorders
   // specialordersall
    var ele=$(".whitebottom").find("table");
    var eleP=$("<p></p>");
    ele.before(eleP);

    if (~weburl.indexOf("/store/stock.php")&& (func[1]=="specialorders"||func[1]=="specialordersall"))
    {
        //if(username=="Ljy" || username=="Lyn" ||  username=="J" )
            //tf=1;
        copyExcelFormatLabel.forEach((copyExcelFormatLabel, index) => 
        {
            if(copyExcelFormatLabel!="FAV2" || (username=="Ljy" || username=="Lyn" ||  username=="J" ))
            {
                eleP.append("<button name='btnCopyExcelFormat' btntype='"+copyExcelFormatLabel+"' class='button-28'>Copy ("+copyExcelFormatLabel+")</button>");
            }
        });

        //$(".whitebottom").find("table").before("<button name='btnCopyExcelFormat' btntype='"+btnType+"' class='button-28'>Copy ("+btnType+")</button>");
        eleP.append("<p><input id='cboxDateOnOff' type='checkbox'>Date OnOff</p>");
        if(username=="aaron" || username=="Ljy" || username=="Lyn" || username=="J")
            $("#cboxDateOnOff").prop("checked", false);
        else
            $("#cboxDateOnOff").prop("checked", true);

    }

    

}
function GenerateItemNameBtn()
{
    if(txtBranch!="TECHMINAL")
    {
        var ele = $("[name='spopartname']").closest("td");
        ele=ele.find("input");
        var spopartnamediv=$("<div></div>");
        ele.before(spopartnamediv);
        partName.forEach((partName, index) => 
        {
            //rtn += "index "+index+" ..."+partName[1]+"<br>";
            
            spopartnamediv.append("<btn id='btnGenerateNameOfPart' class='button-28' fname='"+partName[1]+"'>"+partName[0]+"</btn>");
        });
    }
}

function GeneratePickSupplierBtn()//GeneratePickSupplierBtn(suppliername)
{
    //GetURL();

    

    var ele = $("[name='sposupplierid']").closest( "td" );
    var eleP=$("<p></p>");
    ele.prepend(eleP);
    var pickSupplierLabel;
    if(txtBranch!="TECHMINAL")
    {pickSupplierLabel=pickSupplierLabelTRIT;}
    else
    {pickSupplierLabel=pickSupplierLabelTechminal;}
    
    pickSupplierLabel.forEach((pickSupplierLabel, index) => 
    {
        var splid = pickSupplierLabel.split("-");
        
        eleP.append("<btn id='btnGeneratePickSupplier' class='button-28' splid='"+splid[1]+"'>"+splid[0]+"</btn>");
    });


    


    //var func=webFurl.split("php?func=");
    
    //if (~weburl.indexOf("/store/stock.php")&& (func[1].indexOf("editspo")==0 || func[1].indexOf("addspo")==0))
    //{
        /*var ele = $("[name='sposupplierid']").closest( "td" );
        ele.append("<btn id='btnGeneratePickSupplier' class='button-28' splid='"+splid[1]+"'>"+suppliername+"</btn>");*/
    //}

}





function GenerateReceiveNoteBtn()
{
    //GetURL();
    //var weburl=window.location.pathname;
    //var webFurl = window.location.href;
    //var func=webFurl.split("php?func=");
    
    //if (~weburl.indexOf("/store/stock.php")&& (func[1].indexOf("editspo")==0 || func[1].indexOf("addspo")==0))
    //{
        var ele = $("[name='sponotes']").closest( "td" );
        ele.append("<btn id='btnGenerateReceiveNote' class='button-29'>Order/Received**ByXxX yyyy/mm/dd</btn>");
    //}

}

function GenerateSupplierPartNoBtn()
{
    //GetURL();
    //var weburl=window.location.pathname;
    //var webFurl = window.location.href;
    //var func=webFurl.split("php?func=");
    
    //if (~weburl.indexOf("/store/stock.php")&& (func[1].indexOf("editspo")==0 || func[1].indexOf("addspo")==0))
    //{
        var ele = $("[name='spopartnumber']").closest( "td" );
        ele.append("<btn id='btnGenerateSupplierPartNo' class='button-29'>Order**ByXxX yyyy/mm/dd</btn>");
    //}

}

function GenerateReceiveNote()
{
    GetURL();
    //var weburl=window.location.pathname;
    //var webFurl = window.location.href;
    var func=webFurl.split("php?func=");
    /*
    var d = new Date();

    var month = d.getMonth()+1;
    var day = d.getDate();
    var ymd = d.getFullYear() + '/' +((''+month).length<2 ? '0' : '') + month + '/' +((''+day).length<2 ? '0' : '') + day;
    */
   console.log("......"+func.length);
    var txt="";
    if(func.length>=2)
    {
        if (func[1].indexOf("editspo")==0)
            txt="Received";
        else
            txt="Order";
        if (func[1].indexOf("editspo")==0)
            $("[name='spostatus']").val("2");
        else
            $("[name='spostatus']").val("8");
    }
    else
    {
        txt="Order";
        $("[name='spostatus']").val("8");
    }

    var ymd=cYear+"/"+cMonth+"/"+cDay;
    //var specialOrderEditTable = $("[name=spopartname]").parent().parent().parent().parent();
    var eleTxt = $("[name='spoquantity']").val();
    $("[name='sponotes']").val(txt+" "+eleTxt+" by "+username+" on "+ymd);
   
}

function GenerateSupplierPartNo()
{
    /*
    var d = new Date();

    var month = d.getMonth()+1;
    var day = d.getDate();
    var ymd = d.getFullYear() + '/' +((''+month).length<2 ? '0' : '') + month + '/' +((''+day).length<2 ? '0' : '') + day;
    */
    var ymd=cYear+"/"+cMonth+"/"+cDay;

    var eleTxt = $("[name='spoquantity']").val();
    $("[name='spopartnumber']").val("Order "+eleTxt+" by "+username+" on "+ymd);

    $("[name='spostatus']").val("9");
}

function copyToClipboard(copyTxt)
{
    var bname="";
    if(copyTxt.length==0)
        copyTxt=" ";
    else
    {
        //(username!="Ljy" || username!="Lyn" ||  username!="J1")
        GetURL();
        var func=webFurl.split("php?func=");
        if (~weburl.indexOf("/store/stock.php")&& (func[1]=="specialorders"||func[1]=="specialordersall") && (username!="Ljy" && username!="Lyn" &&  username!="J1"))
        {
            if(txtBranch=="AMK")
                bname="T&R Ideal Tech \n";
            if(txtBranch=="Hougang")
                bname="Fixnology \n";
            if(txtBranch=="Tampines")
                bname="Mac Sync Technology \n";
            if(txtBranch=="Yishun")
                bname="TRIT Computer PTE LTD \n";
            /*if(txtBranch=="TECHMINAL")
       bname="";*/
        }
    }




    var temp=$("<textarea></textarea>");
    $("body").append(temp);
    //temp.text(copyTxt).select();
    temp.text(bname+copyTxt).select();
    document.execCommand("copy");
    temp.remove();
}

function GenerateBtnCopyToExcelFormat(btnType)
{
    GetURL();
    //var weburl=window.location.pathname;
    var rtn="";
    var crow=0;
    $(".whitebottom").find("table").find("tr").each(function(index, value)
    {
        //console.log(index +" -->> "+ $(this).children("td:nth-child(8)").children("span:nth-child(1)").text());
        //$(".whitebottom").find("table").find("tr").children("td:nth-child(8)").children("span:nth-child(3)").css("background-color","red");
        
        var opName=$(this).children("td:nth-child(1)").text();
        var opQuantity=$(this).children("td:nth-child(2)").text();
        opQuantity=opQuantity.split("$");
        opQuantity=opQuantity[0];
        var opSupplier=$(this).children("td:nth-child(3)").text();
        var opSupplierPN=$(this).children("td:nth-child(4)").text();
        var opURL=$(this).children("td:nth-child(5)").text();
        var opTrackingNo=$(this).children("td:nth-child(6)").text();
        var opDate=$(this).children("td:nth-child(7)").find("span").text();
        var opStatus=$(this).children("td:nth-child(8)").children("span:nth-child(1)").text();
        var opRemark=$(this).children("td:nth-child(8)").children("span:nth-child(3)").text();
        var opWO=$(this).children("td:nth-child(9)").find("a").text();
        //var op=$(this).children("td:nth-child(3)").text();
       // alert(opRemark);
       var opDateOnOFf="";
       var opQuantityType="";

        if(opName!="")
        {
            if($("#cboxDateOnOff").is(":checked"))
            {
                opDateOnOFf=opDate+" \t";
                opQuantityType=opQuantity+" \t";
            }
            else
                opQuantityType=opQuantity+" \t";


            if(btnType=="FAV2")
            {
                crow=crow+1;
                rtn+=opName+" \t"+opQuantity+" \t"+opSupplier+" \t"+opSupplierPN+" \t"+opURL+" \t"+opTrackingNo+" \t"+opStatus+" \t"+opWO+" \t"+opRemark+" \n";
            }
            else if(btnType!="FullAll" && opStatus!="Received")
            {
                if(btnType=="TRIT" && (opSupplier=="#AMK"||opSupplier=="#Hougang"||opSupplier=="#TMP"||opSupplier=="#Yishun"||opSupplier=="#TRIT Part#")) //local
                {
                    crow=crow+1;
                    if(username=="aaron" || username=="J")
                        rtn+=crow+". "+opDateOnOFf+opName+" \t x"+opQuantityType+" \n";
                    else if(username=="Ljy" || username=="Lyn" ||  username=="J1")
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opSupplier+" \t"+opWO+" \n";
                    else
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opWO+" \t"+opRemark+" \n";
                }    
                else if(btnType=="FS" && opSupplier=="Fssocom") //local
                {
                    crow=crow+1;
                    if(username=="aaron" || username=="J")
                        rtn+=crow+". "+opDateOnOFf+opName+" \t x"+opQuantityType+" \n";
                    else if(username=="Ljy" || username=="Lyn" ||  username=="J1")
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opSupplier+" \t"+opWO+" \n";
                    else
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opWO+" \t"+opRemark+" \n";
                }
                else if(btnType=="Techminal" && opSupplier=="# TECHMINAL PTE. LTD.") //local
                {
                    crow=crow+1;
                    if(username=="aaron" || username=="J")
                        rtn+=crow+". "+opDateOnOFf+opName+" \t x"+opQuantityType+" \n";
                    else if(username=="Ljy" || username=="Lyn" ||  username=="J1")
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opSupplier+" \t"+opWO+" \n";
                    else
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opWO+" \t"+opRemark+" \n";
                }
                else if(btnType=="OneStop" && opSupplier=="One Stop Part") //local
                {
                    crow=crow+1;
                    if(username=="aaron" || username=="J")
                        rtn+=crow+". "+opDateOnOFf+opName+" \t x"+opQuantityType+" \n";
                    else if(username=="Ljy" || username=="Lyn" ||  username=="J1")
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opSupplier+" \t"+opWO+" \n";
                    else
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opWO+" \t"+opRemark+" \n";
                }
                else if(btnType=="TNN" && opSupplier=="TNN") //local
                {
                    crow=crow+1;
                    if(username=="aaron" || username=="J")
                        rtn+=crow+". "+opDateOnOFf+opName+" \t x"+opQuantityType+" \n";
                    else if(username=="Ljy" || username=="Lyn" ||  username=="J1")
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opSupplier+" \t"+opWO+" \n";
                    else
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opWO+" \t"+opRemark+" \n";
                }
////////////////////
                else if(btnType=="YSMobile" && opSupplier=="YS Mobile Service & Trading") //local
                {
                    crow=crow+1;
                    if(username=="aaron" || username=="J")
                        rtn+=crow+". "+opDateOnOFf+opName+" \t x"+opQuantityType+" \n";
                    else if(username=="Ljy" || username=="Lyn" ||  username=="J1")
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opSupplier+" \t"+opWO+" \n";
                    else
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opWO+" \t"+opRemark+" \n";
                }
                else if(btnType=="TaiHe" && opSupplier=="TAI HE ECLECTRONICS") //local
                {
                    crow=crow+1;
                    if(username=="aaron" || username=="J")
                        rtn+=crow+". "+opDateOnOFf+opName+" \t x"+opQuantityType+" \n";
                    else if(username=="Ljy" || username=="Lyn" ||  username=="J1")
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opSupplier+" \t"+opWO+" \n";
                    else
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opWO+" \t"+opRemark+" \n";
                }




                ///////
                else if(btnType=="local" && (opSupplier!="#Overseas" && opStatus!="Shipped") ) //local
                {
                    crow=crow+1;
                    if(username=="aaron" || username=="J")
                        rtn+=crow+". "+opDateOnOFf+opName+" \t x"+opQuantityType+" \n";
                    else if(username=="Ljy" || username=="Lyn" ||  username=="J1")
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opSupplier+" \t"+opWO+" \n";
                    else
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opWO+" \t"+opRemark+" \n";
                }

                else if(btnType=="oversea" && (opSupplier=="#Overseas" || opStatus=="Shipped")) //overseaOverseas
                {
                    crow=crow+1;
                    if(username=="aaron" || username=="J")
                        rtn+=crow+". "+opDateOnOFf+opName+" \t x"+opQuantityType+" \n";
                    else if(username=="Ljy" || username=="Lyn" ||  username=="J1")
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opSupplier+" \t"+opWO+" \n";
                    else
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opWO+" \t"+opRemark+" \n";
                }
                else if(btnType=="all")// all
                {
                    crow=crow+1;
                    if(username=="aaron" || username=="J")
                        rtn+=crow+". "+opDateOnOFf+opName+" \t x"+opQuantityType+" \n";
                    else if(username=="Ljy" || username=="Lyn" ||  username=="J1")
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opSupplier+" \t"+opWO+" \n";
                    else
                        rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opWO+" \t"+opRemark+" \n";
                }
                /*else if(btnType=="Testing")
                {
                    rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opSupplier+" \t"+opWO+" \n";
                }*/
            }
            else if(btnType=="FullAll") //full all
            {
                crow=crow+1;
                if(username=="aaron" || username=="J")
                    rtn+=opDateOnOFf+opName+" \t"+opSupplier+" \t"+opQuantityType+" \n";
                else if(username=="Ljy" || username=="Lyn" ||  username=="J1")
                    rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opSupplier+" \t"+opWO+" \n";
                else
                    rtn+=opDateOnOFf+opName+" \t"+opQuantityType+opWO+" \t"+opRemark+" \n";
            }
            
        }
    });
    //alert(rtn.length);
    copyToClipboard(rtn);
}

function generateCSS()
{
    var css=$("<style></style>");
    $("body").prepend(css);
    css.html(".button-28 {appearance: none;background-color: transparent;border: 2px solid #1A1A1A;border-radius: 15px;box-sizing: border-box;color: #3B3B3B;cursor: pointer;display: inline-block;font-family: Roobert,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol';font-size: 16px;font-weight: 600;line-height: normal;margin: 0px 20px 10px 0;min-width: 0;outline: none;padding: 3px 10px;text-align: center;text-decoration: none;transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);user-select: none;-webkit-user-select: none;touch-action: manipulation;will-change: transform;}.button-28:disabled {pointer-events: none;}.button-28:hover {color: #fff;background-color: #1A1A1A;box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;transform: translateY(-2px);}.button-28:active {box-shadow: none;transform: translateY(0);}.button-29 {align-items: center;appearance: none;background-image: radial-gradient(100% 100% at 100% 0, #5adaff 0, #5468ff 100%);border: 0;border-radius: 6px;box-shadow: rgba(45, 35, 66, .4) 0 2px 4px,rgba(45, 35, 66, .3) 0 7px 13px -3px,rgba(58, 65, 111, .5) 0 -3px 0 inset;box-sizing: border-box;color: #fff;cursor: pointer;display: inline-flex;font-family: 'JetBrains Mono',monospace;height: 30px;justify-content: center;line-height: 1;list-style: none;overflow: hidden;padding-left: 16px;padding-right: 16px;position: relative;text-align: left;text-decoration: none;transition: box-shadow .15s,transform .15s;user-select: none;-webkit-user-select: none;touch-action: manipulation;white-space: nowrap;will-change: box-shadow,transform;font-size: 18px;margin-left: 5px;}.button-29:focus {box-shadow: #3c4fe0 0 0 0 1.5px inset, rgba(45, 35, 66, .4) 0 2px 4px, rgba(45, 35, 66, .3) 0 7px 13px -3px, #3c4fe0 0 -3px 0 inset;}.button-29:hover {box-shadow: rgba(45, 35, 66, .4) 0 4px 8px, rgba(45, 35, 66, .3) 0 7px 13px -3px, #3c4fe0 0 -3px 0 inset;transform: translateY(-2px);}.button-29:active {box-shadow: #3c4fe0 0 3px 7px inset;transform: translateY(2px);}");
}

function GenerateInputWhatsappSlot()
{
    var txtdata="";
    if(txtBranch!="TECHMINAL")
    {
        txtdata="<input name='btnwaadd' type='button' value='AMK'><input name='btnwaadd' type='button' value='TMP'><input name='btnwaadd' type='button'value='YS'>";
    }
    else
    {
        txtdata="<input name='btnwaadd' type='button'value='TCM'>";
    }
    if($("#topnavbarfixed").length!=0)
    {
        $("#topnavbarfixed > table >tbody > tr ").children("td:nth-child(2)").append("<table style='display: inline;'><tr><td><input id='txtwanumber' type='text' value='+65'><input id='btntowa'type='button' value='go'></td></tr><tr><td>Address : "+txtdata+"</td></tr></table>")
    }
}


function sendAddressToWA(ph,branchaddress)
{
    var rtn="";
    if(branchaddress=="AMK")
        //rtn="https://api.whatsapp.com/send?phone="+ph+"&text=%5BTRITcomputer%20-%20AMK%5D%0A%0ADear%20Sir%2FMdm%2C%0A%0ABusiness%20Hours%0A10%3A00am%20to%208%3A00pm%20(%20Weekday%20)%0A12%3A00nn%20to%205%3A00pm%20(%20Weekend%20)%0A*Closed%20on%20Public%20Holiday%0A%0AWhatsapp%0Ahttps%3A%2F%2Fapi.whatsapp.com%2Fsend%3Fphone%3D6585555522%0A%0ALocation%0A631%20Ang%20Mo%20Kio%20Ave%204%2C%20%2301-922%2C%20Singapore%20560631%0A%0AGoogle%20Map%20%0Ahttps%3A%2F%2Fgoo.gl%2Fmaps%2Fuejdp7CYVDfqxpZg9%0A%0AVisit%20our%20website%20for%20more%20details%3A%0Ahttps%3A%2F%2Fwww.tritcomputer.com%2F%20";
        //rtn="https://api.whatsapp.com/send?phone="+ph+"&text=%5BTRITcomputer%20-%20AMK%5D%0A%0ADear%20Sir%2FMdm%2C%0A%0ABusiness%20Hours%0A10%3A00am%20to%208%3A00pm%20(%20Weekday%20)%0A12%3A00nn%20to%205%3A00pm%20(%20Weekend%20)%0A*Closed%20on%20Public%20Holiday%0A%0AWhatsapp%0Ahttps%3A%2F%2Fapi.whatsapp.com%2Fsend%3Fphone%3D6585555522%0A%0ALocation%0A720%20Ang%20Mo%20Kio%20Ave%206%2C%20%2301-4104C%2C%20Singapore%C2%A0560720%0A%0AGoogle%20Map%20%0Ahttps%3A%2F%2Fmaps.app.goo.gl%2F1P53aRynvReUgobn9%0A%0AVisit%20our%20website%20for%20more%20details%3A%0Ahttps%3A%2F%2Fwww.tritcomputer.com%2F%20";
        //rtn="https://api.whatsapp.com/send?phone="+ph+"&text=%5BTRITcomputer%20-%20AMK%5D%0A%0ADear%20Sir%2FMdm%2C%0A%0ABusiness%20Hours%0A10%3A00am%20to%208%3A00pm%20(%20Weekday%20)%0A12%3A00nn%20to%205%3A00pm%20(%20Weekend%20)%0A*Closed%20on%20Every%20Tuesday%20and%20Public%20Holiday%0A%0A%0AWhatsapp%0Ahttps%3A%2F%2Fapi.whatsapp.com%2Fsend%3Fphone%3D6585555522%0A%0ALocation%0A720%20Ang%20Mo%20Kio%20Ave%206%2C%20%2301-4104C%2C%20Singapore%20560720%0A%0AGoogle%20Map%20%0Ahttps%3A%2F%2Fmaps.app.goo.gl%2F1P53aRynvReUgobn9%0A%0AVisit%20our%20website%20for%20more%20details%3A%0Ahttps%3A%2F%2Fwww.tritcomputer.com%2F";
        rtn="https://api.whatsapp.com/send?phone="+ph+"&text=%5BTRITcomputer%20-%20AMK%5D%0A%0ADear%20Sir%2FMdm%2C%0A%0ABusiness%20Hours%0A10%3A00am%20to%208%3A00pm%20(%20Weekday%20)%0A12%3A00pm%20to%205%3A00pm%20(%20Weekend%20)%0A*Closed%20on%20Public%20Holiday%0A%0A%0AWhatsapp%0Ahttps%3A%2F%2Fapi.whatsapp.com%2Fsend%3Fphone%3D6588000505%0A%0ALocation%0A720%20Ang%20Mo%20Kio%20Ave%206%2C%20%2301-4104C%2C%20Singapore%20560720%0A%0AGoogle%20Map%20%0Ahttps%3A%2F%2Fmaps.app.goo.gl%2F1P53aRynvReUgobn9%0A%0AVisit%20our%20website%20for%20more%20details%3A%0Ahttps%3A%2F%2Fwww.tritcomputer.com%2F%20";
    else if(branchaddress=="HG")
        rtn="https://api.whatsapp.com/send?phone="+ph+"&text=%5BTRITcomputer%20-%20Hougang%5D%0A%0ADear%20Sir%2FMdm%2C%0A%0ABusiness%20Hours%0A12%3A00nn%20to%208%3A00pm%20(%20Weekday%20Except%20Tuesday%20)%0A12%3A00nn%20to%205%3A00pm%20(%20Weekend%20)%0A*Closed%20on%20Every%20Tuesday%20and%20Public%20Holiday%0A%0AWhatsapp%0Ahttps%3A%2F%2Fapi.whatsapp.com%2Fsend%3Fphone%3D6585555500%0A%0ALocation%0A1187%20Upper%20Serangoon%20Rd%2C%20%2302-09%20The%20Midtown%2C%20Singapore%20533971%0A%0AGoogle%20Map%0Ahttps%3A%2F%2Fgoo.gl%2Fmaps%2Fec76LJbA23UcLixn8%0A%0AVisit%20our%20website%20for%20more%20details%3A%0Ahttps%3A%2F%2Fwww.tritcomputer.com%2F%20";
    else if(branchaddress=="TMP")
        rtn="https://api.whatsapp.com/send?phone="+ph+"&text=%5BTRITcomputer%20-%20Tampines%5D%0A%0ADear%20Sir%2FMdm%2C%0A%0ABusiness%20Hours%0A10%3A00am%20to%208%3A00pm%20(%20Weekday%20Except%20Tuesday%20)%0A12%3A00nn%20to%205%3A00pm%20(%20Weekend%20)%0A*Closed%20on%20Every%20Tuesday%20and%20Public%20Holiday%0A%0AWhatsapp%0Ahttps%3A%2F%2Fapi.whatsapp.com%2Fsend%3Fphone%3D6588000707%0A%0ALocation%0ATelepark%2C%205%20Tampines%20Central%206%2C%20%2301-07%2C%20Singapore%20529482%0A%0AGoogle%20Map%0Ahttps%3A%2F%2Fg.page%2FTRITcomputer%3Fshare%0A%0AVisit%20our%20website%20for%20more%20details%3A%0Ahttps%3A%2F%2Fwww.tritcomputer.com%2F";
    else if(branchaddress=="YS")
        rtn="https://api.whatsapp.com/send?phone="+ph+"&text=%5BTRITcomputer%20-%20Yishun%5D%0A%0ADear%20Sir%2FMdm%2C%0A%0ABusiness%20Hours%0A10%3A00am%20to%208%3A00pm%20(%20Everyday%20)%0AWork%20on%20Public%20Holiday%20too%0A%0AWhatsapp%0Ahttps%3A%2F%2Fapi.whatsapp.com%2Fsend%3Fphone%3D6588000606%0A%0ALocation%0A926%20Yishun%20Central%201%2C%20%2301-191%2C%20Singapore%20760926%0A%0AGoogle%20Map%0Ahttps%3A%2F%2Fgoo.gl%2Fmaps%2FPQcD9yF7P8bQr7o8A%0A%0AVisit%20our%20website%20for%20more%20details%3A%0Ahttps%3A%2F%2Fwww.tritcomputer.com%2F";
    else if(branchaddress=="TCM")
        //rtn="https://api.whatsapp.com/send?phone="+ph+"&text=%5BTechminal%5D%0A%0ADear%20Sir%2FMdm%2C%0A%20%20%20%20%0ABusiness%20Hours%0A11%3A00am%20to%208%3A00pm%20%0A%0AWhatsapp%0Ahttps%3A%2F%2Fapi.whatsapp.com%2Fsend%3Fphone%3D6588728988%0A%20%20%20%20%0ALocation%0A1%20Rochor%20Canal%20Rd%2C%20%2301-26%20Beside%20Loading%20Bay%2C%20Sim%20Lim%20Square%2C%20Singapore%20188504%0A%20%20%20%20%0AGoogle%20Map%20%0Ahttps%3A%2F%2Fgoo.gl%2Fmaps%2F5ibuHxkAjhHBDufG6%0A%20%20%20%20%0AVisit%20our%20website%20for%20more%20details%3A%0Ahttps%3A%2F%2Fwww.techminalsg.com%2F";
        rtn="https://api.whatsapp.com/send?phone="+ph+"&text=%5BTechminal%5D%0A%0ADear%20Sir%2FMdm%2C%0A%20%20%20%20%0ABusiness%20Hours%0A11%3A30am%20to%208%3A00pm%20(Daily)%0A11%3A30am%20to%205%3A00pm%20(Sunday%20only)%0A%0AWhatsapp%0Ahttps%3A%2F%2Fapi.whatsapp.com%2Fsend%3Fphone%3D6588728988%0A%20%20%20%20%0ALocation%0A1%20Rochor%20Canal%20Rd%2C%20%2301-26%20Beside%20Loading%20Bay%2C%20Sim%20Lim%20Square%2C%20Singapore%20188504%0A%20%20%20%20%0AGoogle%20Map%20%0Ahttps%3A%2F%2Fgoo.gl%2Fmaps%2F5ibuHxkAjhHBDufG6%0A%20%20%20%20%0AVisit%20our%20website%20for%20more%20details%3A%0Ahttps%3A%2F%2Fwww.techminalsg.com%2F%20";

    return rtn;
}



function PlugOverFlowScrollingToInventoryList()
{
   // var weburl=window.location.pathname;
   // if (~weburl.indexOf("/store/cart.php"))
    //{
    $("div#autoinvsearch").css({"overflow":"scroll","max-height":"300px","width":"98%"});
    //}
}













function GenerateNoteTextGeneratorClick(notetype)
{
    var cd = setInterval(function()
    {
        //console.log("check round");

        //$("#custnoteta")


        //notesarea
        var ele;

        if(notetype=="public")
            ele=$("#custnoteta");
        if(notetype=="private")
            ele=$("#technoteta");

        //var ele=$("#notesarea");
        var div=$("<div></div>");
        div.attr({"name":"divTextTemplateGenerator"+notetype});
        //div.css("display","inline-flex");
        //div.html("btn...");
        div.append(GenerateCheckBoxForNote("Quotation",notetype));
        div.append(GenerateCheckBoxForNote("+ChemicalC",notetype));
        div.append(GenerateCheckBoxForNote("+PSU",notetype));
        div.append(GenerateCheckBoxForNote("+L/M-Board",notetype));
        div.append(GenerateCheckBoxForNote("+SSD",notetype));
		div.append(GenerateCheckBoxForNote("+Ram",notetype));
        div.append(GenerateCheckBoxForNote("+Screen",notetype));
        div.append(GenerateCheckBoxForNote("+Assembly",notetype));
        div.append(GenerateCheckBoxForNote("+Battery",notetype));
        div.append(GenerateCheckBoxForNote("+Touchbar",notetype));
        div.append(GenerateCheckBoxForNote("+Trackpad",notetype));
        div.append(GenerateCheckBoxForNote("+Keyboard",notetype));
        div.append(GenerateCheckBoxForNote("+Speaker",notetype));
        div.append(GenerateCheckBoxForNote("+WifiCard",notetype));
        div.append(GenerateCheckBoxForNote("+CFan",notetype));
        div.append(GenerateCheckBoxForNote("+Recovery",notetype));
        div.append(GenerateCheckBoxForNote("+IntCleaning",notetype));
		div.append(GenerateCheckBoxForNote("+Note",notetype));

        //div.append(GenerateCheckBoxForNote("+2-5Day",notetype));
        div.append(GenerateCheckBoxForNote("+3-7Day",notetype));
        div.append(GenerateCheckBoxForNote("+1-2Week",notetype));


/*
        div.append(GenerateCheckBoxForNote(""));
        div.append(GenerateCheckBoxForNote(""));
        div.append(GenerateCheckBoxForNote(""));
        div.append(GenerateCheckBoxForNote(""));
        div.append(GenerateCheckBoxForNote(""));
        div.append(GenerateCheckBoxForNote(""));
 */     
        div.append(GenerateCheckBoxForNote("DataCollection",notetype));
        div.append(GenerateCheckBoxForNote("LabFee100",notetype));
        div.append(GenerateCheckBoxForNote("IntCleaningMsg",notetype));
        div.append(GenerateCheckBoxForNote("DisposeMsg",notetype));
        ele.before(div);
        

        
        //div.append(generateBtnRedirectToWhatsapp(txtPhoneNo));
        //div.append(generateBtnRedirectToWhatsappWithReadyToCollectTxt(txtBranch,txtPhoneNo));
        //div.append(generateBtnRedirectToWhatsappGoogleMapReviewTxt(txtBranch,txtPhoneNo));
        //div.append(generateBtnRedirectClaimTicket());
        removeDuplicateElement("noEle","name","divTextTemplateGenerator"+notetype);
        //console.log("aaa");



        clearInterval(cd);
    }, 200);

}

function GenerateCheckBoxForNote(cbName,notetype)
{
    var lv=0;
    if(cbName[0]=="+")
        lv=1;
    var lbl=$("<lable></lable>");
    lbl.css({"background-color":"#cecece","border-radius":"12pt","padding":"2px 10px 2px 5px","display": "inline-block"});
    var cbox=$("<input></input>");
    cbox.attr({"id":"cboxNote"+cbName,"name":"cboxForNote","type":"checkbox","value":cbName,"lv":lv,"notetype":notetype});
    lbl.append(cbox);
    lbl.append(cbName);
    return lbl;
}
/*
function generateNoteTextBtn(phone)
{
    var rphone=phone.replace(/\D/g,''); //filter out non digit character
    rphone=rphone.trim();
    if(rphone.length==8)
        rphone="65"+rphone;
    if(rphone[0]=="+")
        rphone=rphone.substring(1, 9999);

    var id="btnWhatsAppPhoneNumber";
    var btn=$("<button><button>");
    btn.attr("ph",phone);
    btn.css({"width":"30px","height":"30px","margin-left": "10px","background-image": "url('https://play-lh.googleusercontent.com/bYtqbOcTYOlgc6gqZ2rwb8lptHuwlNE75zYJu6Bn076-hTmvd96HH-6v7S0YUAAJXoJN=s180-rw')","background-size": "contain","border-style": "solid"});
    btn.attr({"id":id,"ph":phone,"onclick":"var new_window; new_window = window.open('https://api.whatsapp.com/send?phone="+rphone+"'); setTimeout(function(){ new_window.close(); }, 1000);"});
    return btn;
}*/


//test



function generateQuotaion(eleVal,notetype)
{
    var rtn="";
    
    console.log("xxx----"+eleVal+"..."+notetype);


    
    if(eleVal=="LabFee100")
    {
        rtn="Hi, "+customerName+",\nWork Order ID: "+customerWO+"\n\n"; 

        rtn+="Regarding your storage device, we were unable to recover the data through logical recovery. It will need to be sent to a clean room for further assessment. \n\n";
        rtn+="Please note that there is a $100 upfront fee for the clean room assessment, which includes transport and service charges. \n"; 
        rtn+="In such cases, the estimated data recovery cost may range from $600 to $1200, with an estimated turnaround time of 1-2 weeks. \n\n";
        rtn+="Kindly let us know if you would like to proceed? \n";  
    }

    else if(eleVal=="DataCollection")
    {
        rtn="Hi, "+customerName+",\nWork Order ID: "+customerWO+"\n\n"; 
        rtn+="Your data recovery is complete. You may come down to view and transfer the files.We have a spare external hard drive used for the recovery, which is now holding your data. It's available for purchase at $55. If you're okay with that, you can collect it directly.\n\n";
        rtn+="Alternatively, you may bring your own storage device to save the data. \n";
    }
    else if(eleVal=="IntCleaningMsg")
    {
        rtn="Hi, "+customerName+",\nWork Order ID: "+customerWO+"\n\n"; 
        //Your device had not been service for years,\nRecommend to do internal cleaning with thermal compound replacement, it can help to reduce the overheat issue.\nUsual cost is $50, doing together with ...... we can do at $30.\nKindly advice whether to do as well?";
        
        
        rtn+="Your device hasn't been serviced for quite some time. \n";
        rtn+="We recommend performing a ventilation system servicing along with thermal compound replacement. \n";
        rtn+="This can help reduce overheating issues and improve overall performance. \n";
        rtn+="The usual cost is $50, but if done together with the current service, we can offer it at $30. \n";
        rtn+="Kindly advise if you would like to proceed? \n";

        //console.log("check - IntCleaningMsg");
        //console.log("bb");

    }
    else if(eleVal=="DisposeMsg")
    {
        rtn="Dear "+customerName+",\n\n"; 
        //Your computer had been with us since "+customerCheckInTime+", which had reached our 60 days unclaimed storage duration. Due to our storage limitation and high rental, We had to clear the unclaimed devices / $5 of storage fee per month apply for those device beyond storage duration limitation.\n\nIf you wish to collect back without repairing, kindly arrange to collect back within 7 days from now. Else will be deposed off.\n\nIf you wish to repair, 50% of payment required to proceed.\nYou may PayNow or come down to our store to make the payment.\n\nDevice will be arrange to dispose off if there’s no reply from you in 3 days.\n\nPlease confirm and reply to avoid any disappointment.\nThank you for your understanding and cooperation.\n\nFrom:\n";
        


        rtn+="Your computer has been with us since "+customerCheckInTime+", and it has exceeded our 60-day unclaimed storage period. \n\n";
        rtn+="Due to limited storage capacity and high rental costs, we are required to clear unclaimed devices. A $10 monthly storage fee will be applied to devices kept beyond the allowed duration.\n\n";
        rtn+="If you wish to collect the device without repair, please do so within 7 days from today.\n\n";
        rtn+="If you decide to proceed with the repair, a 50% deposit is required. You may make payment via PayNow or in-store.\n\n";
        rtn+="If we do not hear from you within 3 days, the device will be scheduled for disposal.\n\n";
        rtn+="Please confirm your decision soon to avoid any inconvenience.\n";
        rtn+="Thank you for your understanding and cooperation.\n\n";


        if(txtBranch=="TECHMINAL")
            rtn+="Techminal";
        else
            rtn+="TRIT Computer - "+txtBranch;
        //console.log("bb");

    }
    else if(eleVal=="Quotation")
    {
        //console.log("cc");
        var count=0;
        var clen=$("input[name='cboxForNote'][notetype='"+notetype+"']:checked").length;
        clen=clen-1;
        if($("#cboxNoteIntCleaningMsg[notetype='"+notetype+"']").is(":checked"))
            clen=clen-1;
        if($("#cboxNoteDisposeMsg[notetype='"+notetype+"']").is(":checked"))
            clen=clen-1;
        //console.log("length : "+clen);

        rtn="Hi,"+customerName+" ("+customerWO+").\n";
        if(cHour<12)
            rtn+="Good Morning.\n";
        else if(cHour<18)
            rtn+="Good Afternoon.\n";
        else
            rtn+="Good Evening.\n";
        
        rtn+="\n";
        rtn+="Regarding to your "+customerDeviceModel+" \n\n";

        rtn+="This is the estimate for your consideration.  \n";
/*
        rtn+="\n";
        rtn+="\n";
        rtn+="\n";
        rtn+="\n";
        rtn+="\n";
*/

        
        $.each($("input[name='cboxForNote'][notetype='"+notetype+"']:checked"), function()
        {
            //console.log("d1");
            
            if($(this).val()!="IntCleaningMsg" && $(this).val()!="Quotation"&& $(this).val()!="DisposeMsg")
            {
                //console.log("d2");
                count++;
                if($(this).val()=="+ChemicalC")
                {
                    rtn+=count+". Chemical Cleaning - $50\n\n";
                }
                if($(this).val()=="+PSU")
                {
                    if(customerDeviceModel.search(/Apple/i)!=-1)
                        rtn+=count+". PSU Board replacement - $380\n";
                    else
                        rtn+=count+". PSU replacement - $150\n";

                    rtn+="90 days warranty included\n\n";
                }
                if($(this).val()=="+L/M-Board")
                {
                    if(customerDeviceModel.search(/Apple/i)!=-1)
                        rtn+=count+". Logicboard Chipset level repair - $350\n";
                    else
                        rtn+=count+". Motherboard Chipset level repair - $240 \n";
                    if(username=="Samuel" || username=="malcom" || username=="J")
                    {
                        rtn+="\nNOTE :\n";
                        rtn+="-Device other parts and function will test after repair.\n";
                        rtn+="-If system crash will install fresh windows system drive\n";
                        rtn+=" ***All data (software, photo, video, document,.........) will wipe out***\n";
                    }
                    rtn+="90 days warranty included\n\n";
                }
                if($(this).val()=="+SSD")
                {
                    if(customerDeviceModel.search(/Apple/i)!=-1)
                    {
                        rtn+=count+". SSD Replacement with fresh MacOS installation\n";
                        rtn+="-"+count+"a 250GB SSD $200 or\n";
                        rtn+="-"+count+"b 500GB SSD $300 or\n";
                        rtn+="-"+count+"c 1TB SSD $420\n";
                    }
                    else
                    {
                        rtn+=count+". SSD Replacement with fresh Window installation\n";
                        rtn+="-"+count+"a 250GB SSD $180 or\n";
                        rtn+="-"+count+"b 500GB SSD $270 or\n";
						rtn+="-"+count+"c 1TB SSD $390 or\n";
                        rtn+="-"+count+"d 2TB SSD $720\n";
                    }

                    rtn+="90 days warranty included\n\n";
                }
				if($(this).val()=="+Ram")
                {
                    rtn+=count+". Ram Replacement or Add on \n";
                    rtn+="-"+count+"a 8GB Ram $200 or\n";
                    rtn+="-"+count+"b 16GB Ram $370 or\n";
					rtn+="-"+count+"c 32GB Ram $650 \n";

                    rtn+="90 days warranty included\n\n";
                }
                if($(this).val()=="+Screen")
                {
                    rtn+=count+". Screen replacement - $250\n";
                    rtn+="90 days warranty included\n\n";
                }
                if($(this).val()=="+Assembly")
                {
                    rtn+=count+". Screen Assembly replacement - $450\n";
                    rtn+="90 days warranty included\n\n";
                }
                if($(this).val()=="+Battery")
                {
                    rtn+=count+". Battery replacement - $180\n";
                    rtn+="90 days warranty included\n\n";
                }
                if($(this).val()=="+Touchbar")
                {
                    rtn+=count+". Touchbar replacement - $180\n";
                    rtn+="90 days warranty included\n\n";
                }
                if($(this).val()=="+Trackpad")
                {
                    if(customerDeviceModel.search(/Apple/i)!=-1)
                        rtn+=count+". Trackpad replacement - $170\n";
                    else
                        rtn+=count+". Touchpad replacement - $130\n";
                    rtn+="90 days warranty included\n\n";
                }
                if($(this).val()=="+Keyboard")
                {
                    if(customerDeviceModel.search(/Apple/i)!=-1)
                        rtn+=count+". Keyboard replacement - $200\n";
                    else
                        rtn+=count+". Keyboard replacement - $140\n";
                    rtn+="90 days warranty included\n\n";
                }
                if($(this).val()=="+Speaker")
                {
                    if(customerDeviceModel.search(/Apple/i)!=-1)
                        rtn+=count+". Speaker replacement - $180\n";
                    else
                        rtn+=count+". Speaker replacement - $120\n";
                    rtn+="90 days warranty included\n\n";
                }
                if($(this).val()=="+WifiCard")
                {
                    rtn+=count+". Wireless Module Replacement - $120\n";
                    rtn+="90 days warranty included\n\n";
                }
                
                if($(this).val()=="+CFan")
                {
                    rtn+=count+". Ventilation System Smart Fan Replacement - $130\n";
                    rtn+="90 days warranty included\n\n";
                }
                if($(this).val()=="+Recovery")
                {
                    rtn+=count+". Data Recovery $290\n";
                    rtn+="May take 2day to 20day for data recovery\n";
                    //rtn+="Further notice will send to you once the process is done.\n\n";
                }
                if($(this).val()=="+IntCleaning")
                {
                    rtn+=count+". Ventilation System Servicing $80\n";
                    rtn+="Includes thorough cleaning of the ventilation system and replacement of thermal compound.\n";
                    rtn+="This service helps maintain optimal CPU or/and GPU temperatures, improving system stability and extending the lifespan of your device.\n";
                    //rtn+="To maintain your device CPU and GPU temperature in healthy range.\n";
                    rtn+="We recommend internal cleaning every 6 months to 1 year for best performance.\n";
                }
				if($(this).val()=="+Note")
                {
                    rtn+="*(NOTE: The other parts and functions of the device will be tested after the repair.)*\n\n\n";   
                }

                /*if($(this).val()=="+2-5Day")
                {
                    rtn+="Estimated time for repair 2 - 5 days. \n\n";
                }*/
                if($(this).val()=="+3-7Day")
                {
                    rtn+="Repairs usually take 3 - 7 working days; complex cases may require more time.\n\n";
                }
                if($(this).val()=="+1-2Week")
                {
                    rtn+="It may take about 1 to 2 weeks to complete the repairs.\n\n";
                }

                
/*
                if($(this).val()=="")
                {
                    rtn+=count+". \n";
                    rtn+="-90 days warranty\n\n";
                }
                if($(this).val()=="")
                {
                    rtn+=count+". \n";
                    rtn+="\n";
                }
*/
                
                
                //console.log("bb : "+$(this).val());
                //console.log("d3");
            }
            //days.push($(this).val());
                
        });
        //console.log("check - Quotation");
        //rtn+="Estimated time for repair 3 - 7 5 - 15 days. \n\n";
        rtn+="Kindly review and advise whether you would like to proceed?\n\n";
        rtn+="Thanks and Regards,\n";

        if(txtBranch=="TECHMINAL")
            rtn+="Techminal";
        else
            rtn+="TRIT Computer - "+txtBranch;

        //rtn+="TRIT Computer - "+txtBranch;
    }

    //console.log("ee");
    return rtn;
}

function removeOldEleIDfacebox()
{
    var cd = setInterval(function()
    {
                    
        
    var eleCount=0;
    $("div").each(function( index ) 
    {
        
        if($(this).attr("id")=="facebox")
        {
            eleCount++;
            console.log("Index : "+index);
        }
    });
    console.log(".......");
    //if(eleCount!=1 && eleCount!=0)
    //{
        $("div").each(function( index ) 
        {
            if($(this).attr("id")=="facebox")
            {
                if(eleCount>1)
                {
                    eleCount--;
                    $(this).remove();
                    console.log("Deleted Index : "+index +"..."+(eleCount+1));
                }
            }
        });
   // }
        clearInterval(cd);
    }, 1000);
}
function GenerateDailyReportCopyBtn()
{
    if (~webFurl.indexOf("/store/reports.php?func=day_report") && (username=="aaron" || username=="J"))
    {
        $("table.interface > tbody").children("tr:nth-child(2)").children("td:nth-child(2)").find("div.startbox").children("table.standard").eq(0).before("<button name='btnCopyReceiptAndPrices'  class='button-28'>Copy Rec&Total</button>");
    }

}
function copyReceiptAndPrices()
{
    var ele=$("table.interface > tbody").children("tr:nth-child(2)").children("td:nth-child(2)").find("div.startbox").children("table.standard").eq(0);
    
    var eleTbody=ele.find("tbody");
    var eleTR=ele.find("tbody").children("tr");
    
    var eleTRLength = eleTR.length;
    var rtn="";
    for(var c=2;c<=eleTRLength;c++)
    {
        var rec=eleTbody.children("tr:nth-child("+c+")").children("td:nth-child(1)").text().split(" ");
        var tot=eleTbody.children("tr:nth-child("+c+")").children("td:nth-child(6)").text();

        rtn+=rec[0]+" \t"+tot+"\n";
    }
    copyToClipboard(rtn);
}

function GenerateFilterForOpenNewTabBtn()
{
    if (~webFurl.indexOf("/store/reports.php?func=day_report"))
    {
        
        $("table.interface > tbody").children("tr:nth-child(2)").children("td:nth-child(2)").find("div.startbox").children("table.standard").eq(0).before("<p>From<input type='text' id='txtFilterFrom' value='0.00'> to <input type='text' id='txtFilterTo' value='99999.99'>  <button name='btnFilterAndOpenNewTab'  class='button-28'>Filter & Open In New Tab</button></p>");
    }

}
function filterAndOpenInNewTab()
{
    var ele=$("table.interface > tbody").children("tr:nth-child(2)").children("td:nth-child(2)").find("div.startbox").children("table.standard").eq(0);
    
    var eleTbody=ele.find("tbody");
    var eleTR=ele.find("tbody").children("tr");
    var eleTRLength = eleTR.length;

    for(var c=2;c<=eleTRLength;c++)
    {
        var rec=eleTbody.children("tr:nth-child("+c+")").children("td:nth-child(1)").find("a");
        var ahref=rec.attr("href");
        var tot=eleTbody.children("tr:nth-child("+c+")").children("td:nth-child(6)").text();
        tot=tot.split("$")[1];
        var totprices=parseFloat(tot);
        
        if(totprices<=$("#txtFilterTo").val() && totprices>=$("#txtFilterFrom").val())
        {
            window.open(ahref, '_blank');
        }
    }
}


function generateBtnRedirectToWhatsappWithToFixTxt(branch,phone)
{
    var id="btnWhatsAppSendReadyToFixTxt";
    var btn=$("<button><button>");
    btn.css({"width":"auto","height":"30px","margin-left": "10px","border-style": "solid"});
    btn.text("ToFix");
    btn.attr({"id":id,"ph":phone,"onclick":"var new_window; new_window =window.open('"+rtnTxtToFix(phone)+"'); setTimeout(function(){ new_window.close(); }, 1000); "});
    return btn;
}

function generateBtnRedirectToWhatsappWithToOrderTxt(branch,phone)
{
    var id="btnWhatsAppSendReadyToOrderTxt";
    var btn=$("<button><button>");
    btn.css({"width":"auto","height":"30px","margin-left": "10px","border-style": "solid"});
    btn.text("ToOrder");
    btn.attr({"id":id,"ph":phone,"onclick":"var new_window; new_window =window.open('"+rtnTxtToOrder(phone)+"'); setTimeout(function(){ new_window.close(); }, 1000); "});
    return btn;
}

function rtnTxtToFix(phone)
{
    GetCustomerData();
    var rphone=PhoneNumberFilter(phone);
    
    var rtn="";
    if(txtBranch=="AMK" || txtBranch=="Hougang" || txtBranch=="Tampines" || txtBranch=="Yishun" || txtBranch=="TECHMINAL")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=Work%20Order%20ID%20"+customerWO+"%20%0A%0ASure%2C%20We%20shall%20proceed%20to%20fix.%0AWill%20get%20back%20to%20you%20once%20ready.";
    //Hi%20%20"+customerName+"%0A
    }
    return rtn;
}
function rtnTxtToOrder(phone)
{
    GetCustomerData();
    var rphone=PhoneNumberFilter(phone);
    
    var rtn="";
    if(txtBranch=="AMK" || txtBranch=="Hougang" || txtBranch=="Tampines" || txtBranch=="Yishun" || txtBranch=="TECHMINAL")
    {
        rtn="https://api.whatsapp.com/send?phone="+rphone+"&text=Work%20Order%20ID%20"+customerWO+"%20%0A%0ASure%2C%20we%20shall%20proceed%20for%20the%20order.%0AWill%20get%20back%20to%C2%A0you%C2%A0once%C2%A0ready.";
    //Hi%20%20"+customerName+"%0A
    }
    return rtn;
}

function GenerateTypeOfDiscountShopeeLazadaBtn()
{
    GetURL();
    if (~weburl.indexOf("techminal/store/cart.php"))
    {
        var cd = setInterval(function()
        {
            var eleC_positemgrid=$(".positemgrid");//.css("background-color", "red");
            eleC_positemgrid.append("<btn id='btnFillProductName' class='button-28' name='btnFillProductName'>Shipping Subtotal</btn>");
            eleC_positemgrid.append("<btn id='btnFillProductName' class='button-28' name='btnFillProductName'>Fees & Charges</btn>");
            eleC_positemgrid.append("<btn id='btnFillProductName' class='button-28' name='btnFillProductName'>Shipping Fee</btn>");
            eleC_positemgrid.append("<btn id='btnFillProductName' class='button-28' name='btnFillProductName'>Lazada Discount Total</btn>");

            clearInterval(cd);
        }, 300);
    }
}


function GenerateShopeeLazadaFillOrderDateBtn()
{
    getCurrentDateTime();
    GetURL();
    if (weburl==("/techminal/store/LazadaStore.php")|| weburl==("/techminal/store/ShopeeStore.php"))
    {
        var cd = setInterval(function()
        {
            var eleN_orderdate=$("[name='custompaymentinfo[Order Date]']");//.css("background-color", "red");
            eleN_orderdate.val(cYear+"/"+cMonth+"/"+cDay);
            clearInterval(cd);
        }, 500);
    }
}

function GenerateNCheckAntiVirusNCleaningService()
{
    
    GetURL();
    //console.log("aaaaa");
    //console.log(weburl);
    if (weburl==("/trit/store/receipt.php"))
    {
        
        //console.log("bbbb");
        //var taskPrices=[];
        //var taskName=[];
        var taskCount=0;
        //var recTotalPrices="";
        //var ctxt="";

        var cd = setInterval(function()
        {

            

            $('table.pointofsale td').filter(function() 
                {
                    return /Ventilation System Cleaning|Ventilation system servicing|Internal Cleaning|Thermal Paste|Thermal Compound|AV 1 Year |AV 2 Year|AV 3 Year|Anti Virus/i.test($(this).text());
                }).each(function() 
                {
                    //console.log($(this).text());
                    $(this).css("background-color", "#f09c9c");
                    taskCount=taskCount+1;
                }
            );
            






/*

            $('table.pointofsale td:contains("Ventilation system cleaning")').each(function() 
            {
                $(this).css("background-color", "#f09c9c");
               // taskName[taskCount]=$(this).text();
                //taskPrices[taskCount]=$(this).next().next().text();
                taskCount=taskCount+1;
                
            });
            $('table.pointofsale td:contains("AV")').each(function() 
            {
                $(this).css("background-color", "#f09c9c");
                //taskName[taskCount]=$(this).text();
                //taskPrices[taskCount]=$(this).next().next().text();
                taskCount=taskCount+1;
                
            }); 
*/
            if(taskCount>0)
            {
                $(".startbox").prepend($("<button name='btnCopyReceiptAntiVirusNCleaning' btntype='TRIT' class='button-28'>CopyForExcel</button>"));
            }
            

/*
            $('table.pointofsale td:contains("Grand Total:")').each(function() 
            {
                //$(this).next().css("background-color", "#f09c9c");
                recTotalPrices=$(this).next().text();
                
            }); 
            recTotalPrices=recTotalPrices.substring(1, recTotalPrices.length);
            //console.log(recTotalPrices);
            //console.log(taskCount);

            //console.log(taskName.length);
            
            
            
            
            var recDate=$("div.startbox table.standard tbody tr:eq(0) td:eq(1)").text();
            recDate=recDate.split(" ");
            recDate=recDate[1].substring(0, recDate[1].length - 1) +"-"+recDate[0]+"-"+recDate[2].substring(0, recDate[2].length - 1);
            //console.log(recDate);

            var recWO=$("div.startbox table.standard tbody tr:eq(2) td:eq(1)").text();
            recWO=recWO.substring(1, recWO.length);
            //console.log(recWO);


            var recNum=$("div.startbox table tbody tr:eq(0) td:eq(2) span").text(); 
            recNum=recNum.split(" ");
            recNum=recNum[1].substring(1, recNum[1].length);
            //console.log(recNum);


*/

            
         /*
            if(taskName.length!=0)
            {
                
                for(var c=0;c<taskName.length;c++)
                {
                    //console.log(taskName[c]);
                    //console.log(taskPrices[c].substring(1, taskPrices[c].length));
                    
                    ctxt=recDate+"\t"+recWO+"\t"+recNum+"\t"+taskName[c]+"\t"+recTotalPrices+"\t"+taskPrices[c]+"\t"+"20%"+"\n";
                
                
                }
            }
         */   

          //  console.log(ctxt);

/*
            var temp=$("<textarea></textarea>");
            $("body").append(temp);
            //temp.text(copyTxt).select();
            temp.text(ctxt).select();
            document.execCommand("copy");
            temp.remove();

            
*/
            clearInterval(cd);
        }, 1000);

        
    }

}
function cpyReceiptAntiVirusNCleaning()
{
    GetURL();
    //console.log("aaaaa");
    //console.log(weburl);
    if (weburl==("/trit/store/receipt.php"))
    {
        
        //console.log("bbbb");
        var taskPrices=[];
        var taskName=[];
        var taskCount=0;
        var recTotalPrices="";
        var ctxt="";

        var cd = setInterval(function()
        {
            var ftxt="";
            var fpri="";
            $('table.pointofsale tr').each(function(index) 
            {
                var trtext=$(this).text();
                if(trtext.search(/Purchase Items|Labor|Returned Items|No Return Items|Refunded Labor|No Refunded Labor Items|labour warranty|Labour|Discount/i)==-1 && index <=$('table.pointofsale tr').length-15)
                {
                    if(ftxt.length!=0)
                        ftxt+=" , ";
                    var tdL=$('table.pointofsale tr:eq('+index+') td').length;
                    var tdL1txt=$('table.pointofsale tr:eq('+index+') td:eq(1)').text();


                    if(tdL1txt.search(/Ventilation System Cleaning|ventilation system servicing|Internal Cleaning|Thermal Paste|Thermal Compound/i)!==-1) 
                    {
                        ftxt+="InternalCleaning";
                        fpri+=$('table.pointofsale tr:eq('+index+') td:eq(3)').text();
                    }
                    else if(tdL1txt.search(/AV 1 Year |AV 2 Year|AV 3 Year|Anti Virus/i)!==-1)
                    {
                        ftxt+="AntiVirus";
                        fpri+=$('table.pointofsale tr:eq('+index+') td:eq(3)').text();
                    }
                    else if(tdL1txt.search(/Operating System Reload \/ Reformat/i)!==-1)
                        ftxt+="Reformat";
                    else if(tdL1txt.search(/Screen|LCD|Panel/i)!==-1)
                        ftxt+="ScreenReplacement";
                    else if(tdL1txt.search(/Battery/i)!==-1)
                        ftxt+="BatteryReplacement";
                    else if(tdL1txt.search(/Keyboard/i)!==-1)
                        ftxt+="KeyboardReplacement";
                    else if(tdL1txt.search(/Hinge Repair/i)!==-1)
                        ftxt+="HingeRepair";
                    else if(tdL1txt.search(/Logic Board Chip Level Repair|Motherboard Chip Level Repair/i)!==-1)
                        ftxt+="Motherboard repair";
                    else 
                        ftxt+=tdL1txt;





                    //console.log("number of td  ..."+tdL);
                    //console.log("txt of second td ..."+tdL1txt);
                    //console.log(trtext +"......"+ trtext.length+"...."+index);
                
                
                
                }
            });

            fpri=fpri.substring(1, fpri.length);
            //console.log(ftxt+"...."+fpri);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*
            $('table.pointofsale td').filter(function() 
            {
                return /Ventilation System Cleaning|Internal Cleaning|Thermal Paste|Thermal Compound|AV 1 Year |AV 2 Year|AV 3 Year|Anti Virus/i.test($(this).text());
            }).each(function() 
            {
                //console.log($(this).text());
                if($(this).text().search(/Ventilation System Cleaning|Internal Cleaning|Thermal Paste|Thermal Compound/i)!==-1)
                    taskName[taskCount]="InternalCleaning";  
                else   
                    taskName[taskCount]="AntiVirus";
                
                //taskName[taskCount]=$(this).text();
                taskPrices[taskCount]=$(this).next().next().text();
                taskCount=taskCount+1;
            }
        );
*/


/*
            $('table.pointofsale td:contains("Ventilation system cleaning")').each(function() 
            {
                //$(this).css("background-color", "#f09c9c");
                taskName[taskCount]=$(this).text();
                taskPrices[taskCount]=$(this).next().next().text();
                taskCount=taskCount+1;
                
            });
            $('table.pointofsale td:contains("AV")').each(function() 
            {
                //$(this).css("background-color", "#f09c9c");
                taskName[taskCount]=$(this).text();
                taskPrices[taskCount]=$(this).next().next().text();
                taskCount=taskCount+1;
                
            }); 

*/
            $('table.pointofsale td:contains("Grand Total:")').each(function() 
            {
                //$(this).next().css("background-color", "#f09c9c");
                recTotalPrices=$(this).next().text();
                
            }); 
            recTotalPrices=recTotalPrices.substring(1, recTotalPrices.length);
            //console.log(recTotalPrices);
            //console.log(taskCount);

            //console.log(taskName.length);
            
            
            
            
            var recDate=$("div.startbox table.standard tbody tr:eq(0) td:eq(1)").text();
            recDate=recDate.split(" ");
            recDate=recDate[1].substring(0, recDate[1].length - 1) +"-"+recDate[0]+"-"+recDate[2].substring(0, recDate[2].length - 1);
            //console.log(recDate);

            var recWO=$("div.startbox table.standard tbody tr:eq(2) td:eq(1)").text();
            recWO=recWO.substring(1, recWO.length);
            //console.log(recWO);


            var recNum=$("div.startbox table tbody tr:eq(0) td:eq(2) span").text(); 
            recNum=recNum.split(" ");
            recNum=recNum[1].substring(1, recNum[1].length);
            //console.log(recNum);



            ctxt=recDate+"\t"+recWO+"\t"+recNum+"\t"+ftxt+"\t"+recTotalPrices+"\t"+fpri+"\t"+"20%"+"\n";
/*            
            if(taskName.length!=0)
            {
                //$(".startbox").prepend($("<button name='btnCopyReceiptAntiVirusNCleaning' btntype='TRIT' class='button-28'>CopyForExcel</button>"));
                for(var c=0;c<taskName.length;c++)
                {
                    //console.log(taskName[c]);
                    //console.log(taskPrices[c].substring(1, taskPrices[c].length));
                    
                    ctxt=recDate+"\t"+recWO+"\t"+recNum+"\t"+taskName[c]+"\t"+recTotalPrices+"\t"+taskPrices[c]+"\t"+"20%"+"\n";
                
                
                }
            }
  */          

            //console.log(ctxt);


            var temp=$("<textarea></textarea>");
            $("body").append(temp);
            //temp.text(copyTxt).select();
            temp.text(ctxt).select();
            document.execCommand("copy");
            temp.remove();

            

            clearInterval(cd);
        }, 300);

    }
}