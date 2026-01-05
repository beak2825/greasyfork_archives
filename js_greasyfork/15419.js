// ==UserScript==
// @name         Salesforce New Lead
// @namespace    indow
// @version      1.295
// @description  Dealer lookup from ZIP.
// @author       mat
// @match        https://na65.salesforce.com/*
// @match        https://indow.my.salesforce.com/*
// @match        https://na65.salesforce.com/00Q/*
// @match        https://indow.my.salesforce.com/00Q/*
// @match        https://na65.salesforce.com/_ui/search/*
// @match        https://indow.my.salesforce.com/_ui/search/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15419/Salesforce%20New%20Lead.user.js
// @updateURL https://update.greasyfork.org/scripts/15419/Salesforce%20New%20Lead.meta.js
// ==/UserScript==
/* jshint -W097 */
$('head').append('<style type="text/css">.dataRow {     -webkit-animation: fadein 0.5s; /* Safari, Chrome and Opera > 12.1 */       -moz-animation: fadein 0.5s; /* Firefox < 16 */        -ms-animation: fadein 0.5s; /* Internet Explorer */         -o-animation: fadein 0.5s; /* Opera < 12.1 */            animation: fadein 0.5s;}@keyframes fadein {    from { opacity: 0; filter: blur(5px); -webkit-filter: blur(5px);margin-top: -2em; }    to   { opacity: 1; filter: blur(0px); -webkit-filter: blur(0px);margin-top: 0em;}}/* Firefox < 16 */@-moz-keyframes fadein {    from { opacity: 0; filter: blur(5px); -webkit-filter: blur(5px);margin-top: -2em;;}    to   { opacity: 1; filter: blur(0px); -webkit-filter: blur(0px);margin-top: 0em;}}/* Safari, Chrome and Opera > 12.1 */@-webkit-keyframes fadein {    from { opacity: 0; filter: blur(5px); -webkit-filter: blur(5px);margin-top: -2em;}    to   { opacity: 1; filter: blur(0px); -webkit-filter: blur(0px);margin-top: 0em;}}/* Internet Explorer */@-ms-keyframes fadein {    from { opacity: 0; filter: blur(5px); -webkit-filter: blur(5px);margin-top: -2em;}    to   { opacity: 1; filter: blur(0px); -webkit-filter: blur(0px);margin-top: 0em;}}/* Opera < 12.1 */@-o-keyframes fadein {    from { opacity: 0; filter: blur(5px); -webkit-filter: blur(5px);margin-top: -2em;}to   { opacity: 1; filter: blur(0px); -webkit-filter: blur(0px);margin-top: 0em;}}</style>');
$.extend($.expr[":"], {
    "containsNC": function(elem, i, match, array) {
        return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
    }
});
//$.getScript("/soap/ajax/36.0/connection.js", function(){
//sforce.connection.sessionId = "00DE0000000aVcY!AR4AQNwE1Q67AISu78teBN3Zuw61ECn3qgLS9PlpmB2LnS7m.XQE4SJSPy2FCp2OE5RpS40eYjMV56OtBzALJqCh9Ahoo3rx";

//});

$("#presence_widget").hide();
if (window.location.href.indexOf('/setup/ui/recordtypeselect.jsp?ent=Lead&retURL=%2F00Q%2Fo&save_new_url=%2F00Q%2Fe%3FretURL%3D%252F00Q%252Fo') > 0) {
    document.getElementById("p3").selectedIndex = "0";
    var saveBtn = document.querySelector("input[value='Continue']");
    if (saveBtn) { saveBtn.click(); }
}
if (window.location.href.indexOf("/_ui/search") >= 0) {
    if ($(".messageText").text() == "No matches found") {
        phone = $(".searchResultsTipsContainer a:first").text().slice(0, -1);
        if ($.isNumeric(phone)) { window.location.href = "https://indow.my.salesforce.com/00Q/e?retURL=%2F00Q%2Fo&RecordType=012E0000000f8T9&ent=Lead?" + phone; }

    }

}

function highlight() {
    $.extend($.expr[":"], {
        "containsNC": function(elem, i, match, array) {
            return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
        }
    });
    $('tr.dataRow:containsNC("IW - Self Measure")').css('background-color', '#CACAFF');
    $('tr.dataRow:containsNC("IW - Referral")').css('background-color', '#C6FFDA');
    $('tr.dataRow:containsNC("IW - DealerGen")').css('background-color', '#ffc6c6');


}
if ((window.location.href.indexOf("/00Q/e?retURL=%2F00Q%2Fo&RecordType=012E0000000f8T9&ent=Lead") >= 0) || (window.location.href.indexOf("/00Q/e?ent=Lead&retURL=%2F00Q%2Fo&RecordType=012E0000000f8T9") >= 0)) {
    searchurl = "";
    linkurl = "";

    $("#lea11").keyup(function(f) {
        email = $("#lea11").val();
        if (email.length > 2) {
            $.get("/_ui/search/ui/UnifiedSearchResults?searchType=2&sen=a0V&sen=a0W&sen=00O&sen=001&sen=00Q&sen=a0b&sen=01t&sen=003&sen=00T&sen=005&sen=00U&sen=500&sen=006&sen=a0l&sen=a0n&str=*" + email + "*", function(data2) {
                if ($(data2).find(".messageText").text() == "No matches found") {
                    $("#resultsholder1").empty();
                } else {
                    $("#resultsholder1").empty();
                    $(data2).find("#searchResultsHolderDiv").appendTo("#resultsholder1");
                    highlight();

                }
            });
        } else {

        }
    });
    $('#name_lastlea2, #name_firstlea2').on('keydown', function(event) {
        if (this.selectionStart == 0 && event.keyCode >= 65 && event.keyCode <= 90 && !(event.shiftKey) && !(event.ctrlKey) && !(event.metaKey) && !(event.altKey)) {
            var $t = $(this);
            event.preventDefault();
            var char = String.fromCharCode(event.keyCode);
            $t.val(char + $t.val().slice(this.selectionEnd));
            this.setSelectionRange(1, 1);
        }
    });
    $("#name_lastlea2, #name_firstlea2").keyup(function(g) {
        search();
    });


    function search() {
        lastname = $("#name_lastlea2").val();
        firstname = $("#name_firstlea2").val();
        name = firstname + " " + lastname;
        phone = $("#lea8").val();
        if (lastname.length > 2 || firstname.length > 2 || phone.length > 3) {
            if (searchurl == "https://indow.my.salesforce.com/_ui/search/ui/UnifiedSearchResults?_dc=1455665821852&searchCount=1&cmdType=cmp&cmp=singleEntitySearchResult&fen=003&str=*" + firstname + "*" + lastname + "*+or+*" + lastname + "*+or+*" + phone + "*&initialViewMode=detail&sen=a0V&sen=00O&sen=001&sen=00Q&sen=a0b&sen=01t&sen=003&sen=00T&sen=005&sen=00U&sen=500&sen=006&sen=a0l&sen=a0n&fpg=yw88ozcg&setupid=ContactSearchLayouts") {
                return false;
            }
            searchurl = "https://indow.my.salesforce.com/_ui/search/ui/UnifiedSearchResults?_dc=1455665821852&searchCount=1&cmdType=cmp&cmp=singleEntitySearchResult&fen=003&str=*" + firstname + "*" + lastname + "*+or+*" + lastname + "*+or+*" + phone + "*&initialViewMode=detail&sen=a0V&sen=00O&sen=001&sen=00Q&sen=a0b&sen=01t&sen=003&sen=00T&sen=005&sen=00U&sen=500&sen=006&sen=a0l&sen=a0n&fpg=yw88ozcg&setupid=ContactSearchLayouts";
            $.get(searchurl, function(data3) {
                if ($(data3).find(".messageText").text() == "No matches found") {
                    $("#resultsholder1, #linkholder").empty();
                } else {
                    $("#resultsholder1, #resultsholder3, #linkholder").empty();
                    $(data3).find("#searchResultsHolderDiv").find("table.list").appendTo("#resultsholder1");
                    $(".actionColumn").hide();
                    var namecolumn = $("#resultsholder1 > table.list > tbody > tr.dataRow > th.dataCell");
                    $(namecolumn).each(function() {
                        var links = $(this).find("a");
                        links.attr("linkid", links.attr("data-seclkp"));
                        //  links.attr("href", "#");
                    });

                    $(namecolumn).on("click", function() {
                        var link = $(this).find("a").attr("linkid");
                        if (linkurl == "https://indow.my.salesforce.com" + link + "/p") {
                            return false;
                        }
                        $("#linkholder").animate({ "left": "100%" }, 500);

                        //$(this).off("click");

                        //$(this).on("click", function(){$("#linkholder").slideDown("slow");
                        //                              var thisrow = $(this).parent();
                        //thisrow.css("background-color","rgba(227,147,33,.5)");
                        //$(".dataRow").not(thisrow).removeAttr("style");});
                        var thisrow = $(this).parent();
                        thisrow.css("background-color", "rgba(227,147,33,.5)");
                        $(".dataRow").not(thisrow).removeAttr("style");
                        //.appendTo("#resultsholder3")


                        jQuery.ajaxSetup({ async: true });
                        linkurl = "https://indow.my.salesforce.com" + link + "/p";
                        $.get(linkurl, function(linkdata) {
                            //$("#linkholder").empty().hide();
                            $("#linkholder").empty();
                            $("#linkholder").animate({ "left": "-100%" }, 1);
                            $(linkdata).find(".pbBody").appendTo("#linkholder");
                            $("#linkholder").animate({ "left": "0%" }, 200);
                            //$("#linkholder").slideDown("slow");
                            //  $(linkdata).find("#mainTable").appendTo("#linkholder");
                            highlight();
                        });
                        jQuery.ajaxSetup({ async: true });
                    });

                    //                     $('.dataCell:containsNC("' + name + '")').parent().each(function(){$(this).css("background-color","yellow").prependTo($(this).parent());});
                    if (firstname.length > 0 && lastname.length > 0) {

                        //   $('#resultsholder1 > table.list > tbody > tr.dataRow > .dataCell').each(function(){
                        //     var $row = $(this);
                        //   if((($row).containsNC("' + firstname + '")) && (($row).containsNC("' + lastname + '")))
                        // {
                        // $($row).parent().css("background-color","yellow").prependTo("#resultsholder3");
                        //}
                        $('#resultsholder1 > table.list > tbody > tr.dataRow > th.dataCell:containsNC("' + firstname + '"):containsNC("' + lastname + '")').parent().css("background-color", "yellow").appendTo("#resultsholder3");

                    }
                    if ($("#resultsholder1 > table.list > tbody > tr.dataRow").length > 0) {
                        //$("#resultsholder1 > table.list > tbody > tr.headerRow").replaceWith("Contacts");
                        $("#resultsholder1 > table.list > tbody > tr.headerRow").remove();
                        //                        $("#resultsholder1").prev().append("Contacts")
                    } else { $("#resultsholder1, #linkholder").empty(); }
                    highlight();
                }


            });

            $.get("https://indow.my.salesforce.com/_ui/search/ui/UnifiedSearchResults?_dc=1455668044288&searchCount=1&cmdType=cmp&cmp=singleEntitySearchResult&fen=00Q&str=*" + firstname + "*" + lastname + "*+or+*" + lastname + "*+or+*" + phone + "*&initialViewMode=detail&sen=a0V&sen=a0W&sen=00O&sen=001&sen=00Q&sen=a0b&sen=01t&sen=003&sen=00T&sen=005&sen=00U&sen=500&sen=006&sen=a0l&sen=a0n&fpg=yw8a0k4h&setupid=LeadSearchLayouts", function(data31) {
                if ($(data31).find(".messageText").text() == "No matches found") {

                    $("#resultsholder2, #linkholder").empty();
                } else {
                    $("#resultsholder2, #resultsholder4, #linkholder").empty();

                    $(data31).find("#searchResultsHolderDiv").find("table.list").appendTo("#resultsholder2");
                    highlight();
                    if (firstname.length > 0 && lastname.length > 0) {
                        $('#resultsholder2 > table.list > tbody > tr.dataRow > th.dataCell:containsNC("' + firstname + '"):containsNC("' + lastname + '")').parent().css("background-color", "yellow").prependTo("#resultsholder4");

                    }
                    $('tr.dataRow:containsNC("IW - Self Measure")').css('background-color', '#CACAFF');
                    $('tr.dataRow:containsNC("IW - Referral")').css('background-color', '#C6FFDA');
                    if ($("#resultsholder2 > table.list > tbody > tr.dataRow").length > 0) {
                        //$("#resultsholder2 > table.list > tbody > tr.headerRow").replaceWith("Leads");

                        $("#resultsholder2 > table.list > tbody > tr.headerRow").remove();
                        //                             $("#resultsholder2").prev().append("Leads")
                    } else { $("#resultsholder2, #linkholder").empty(); }
                    $(".actionColumn").hide();
                    var namecolumn = $("#resultsholder2 > table.list > tbody > tr.dataRow > th.dataCell");
                    $(namecolumn).each(function() {
                        var links = $(this).find("a");
                        links.attr("linkid", links.attr("data-seclkp"));
                        //links.attr("href", "#");
                    });


                    $(namecolumn).on("click", function() {
                        var link = $(this).find("a").attr("linkid");
                        if (linkurl == "https://indow.my.salesforce.com" + link + "/p") {
                            return false;
                        }
                        $("#linkholder").animate({ "left": "100%" }, 100);

                        // $(this).off("click");
                        // $(this).on("click", function(){$("#linkholder").slideDown("slow");
                        //                               var thisrow = $(this).parent();
                        // thisrow.css("background-color","rgba(227,147,33,.5)");
                        // $(".dataRow").not(thisrow).removeAttr("style");});
                        //$(this).parent().css("background-color","rgba(227,147,33,.5)");
                        var thisrow = $(this).parent();
                        thisrow.css("background-color", "rgba(227,147,33,.5)");
                        $(".dataRow").not(thisrow).removeAttr("style");
                        //.appendTo("#resultsholder4");
                        jQuery.ajaxSetup({ async: true });
                        linkurl = "https://indow.my.salesforce.com" + link + "/p";
                        $.get(linkurl, function(linkdata) {
                            //$("#linkholder").empty().hide();

                            $("#linkholder").empty();
                            $("#linkholder").animate({ "left": "-100%" }, 1);
                            $(linkdata).find(".pbBody").appendTo("#linkholder");
                            $("#linkholder").animate({ "left": "0%" }, 200);
                            //$("#linkholder").slideDown("slow");
                            //    $(linkdata).find("#mainTable").appendTo("#linkholder");
                        });
                        jQuery.ajaxSetup({ async: true });
                    });


                }

            });
        } else {
            $("#resultsholder1, #resultsholder2, #linkholder").empty();
        }
        if ($("tr.dataRow").size() == 1) {
            $("#resultsholder").find("th.dataCell").click();
        }

    }


    function phonesearch2() {
        phone = $("#lea8").val();
        if (phone.length > 6) {
            $.get("/_ui/search/ui/UnifiedSearchResults?searchType=2&sen=a0V&sen=a0W&sen=00O&sen=001&sen=00Q&sen=a0b&sen=01t&sen=003&sen=00T&sen=005&sen=00U&sen=500&sen=006&sen=a0l&sen=a0n&str=" + phone + "*", function(data4) {
                if ($(data4).find(".messageText").text() == "No matches found") {

                    $("#resultsholder1, #linkholder").empty();
                } else {
                    $("#resultsholder1, #linkholder").empty();
                    $(data4).find("#searchResultsHolderDiv").appendTo("#resultsholder1");
                }
            });
        } else {

        }


    }
    $("#lea8").keyup(function(h) {
        search();
    });



    $(".sidebarCollapsible").css("padding", "0px");
    $(".outer, td.oRight").css("padding", "0px");
    $(".hasMotif").css("margin", "0px");
    $("#contentWrapper").css("min-width", "auto");
    $(".detailList").css("width", "initial");
    $("#name_salutationlea2").hide();
    $("#name_firstlea2").attr("size", "27");
    $(".labelCol:first").hide();
    $("input[type='text'], textarea[type='text']").each(function() {
        $(this).attr("placeholder", $(this).closest("td").prev().text());
        $(this).closest("td").prev().remove();

    });
    $("select").css("width", "243px");
    $("textarea").css("width", "237px");
    $("input").attr("size", "30");
    $("textarea").attr("rows", "1");
    $("#CF00NE00000060HfI").parent().parent().parent().nextAll().hide();
    $(".pbTitle").hide();
    $("#presence_widget").remove();
    $("td.dataCol:nth(4)").parent().remove();
    $("#CF00NE00000060HfI").attr("size", "27");
    $("td.labelCol label").each(function() {
        $(this).parent().hide();
        $(this).appendTo($(this).parent().next());

    });
    $(".bPageFooter").hide();
    $(".pbSubsection:first label").hide();
    $(".pbSubsection:first label[for='lea22']").show();
    $("#editPage .pbSubsection, .editPage .pbSubsection").css({ "padding": "0px", "margin": "0px" });
    $("body .bEditBlock .pbBottomButtons").css({ "margin": "0px", "border": "0px" });
    $(".dataCol").css("padding", "0px");
    $(".bPageTitle").hide();

    $(".pbSubheader").hide();
    document.getElementById("00NE0000002EIJd").selectedIndex = "2";
    document.getElementById("00NE0000006ORdX").selectedIndex = "1";
    document.getElementById("00NE0000005I38R").selectedIndex = "1";
    $("#CF00NE0000006Oc9a_lkid").parent().parent().show();
    $("#lea5").parent().parent().parent().show();
    phone = $(location).attr('href');
    phone = phone.substr(phone.lastIndexOf('?') + 1);

    if ($.isNumeric(phone)) {

        $("#lea8").val(phone);
        search();

    }
    $(".empty").remove();
    $(".detailList").css({ "width": "200px" });
    $(".pbBody").css({ "float": "left", "width": "245px" });

    $(".bPageBlock:first").append("<div id='resultsholder'><table class='list' id='resultsholder3'></table><table class='list' id='resultsholder4'></table><div id='resultsholder1'></div><div id='resultsholder2'></div></div><div style='float:left;background-color: rgba(227,147,33,.5);position:relative;z-index:1;max-width:50%' id='linkholder'></div>");
    $(".pbBottomButtons").appendTo(".bPageBlock:first");
    $("#resultsholder").css({ "float": "left", "max-width": "100%", "position": "relative", "z-index": "5", "background-color": "#fff" });
    $("#resultsholder1, #resultsholder2").css({ "overflow-y": "scroll", "max-height": "35vh", "margin-bottom": "1.5em" });
    //$("#resultsholder").css({"float":"left","max-width":"70%","overflow":"scroll","max-height":"500px"});
    $("#referredlist").css({ "max-width": "50%", "overflow": "scroll", "max-height": "500px" });
    $(".pbSubsection:first").append("<div id='referredlist'></div>");
    $("#referredlist").css({ "max-width": "243px", "overflow": "hidden" });
    $("#00NE0000005HNU3").closest(".pbSubsection").hide();
    $("label[for='00NE0000005I38R']").hide();
    $("#lea16zip").focus();


    flag = true;
    if (flag === true) {
        $("#lea16zip").on('input', function(e) {
            if ($('#lea16zip').val().match(/\d{5}(?:[-\s]\d{4})?/) || $('#lea16zip').val().match(/[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d/i)) {
                $("#name_firstlea2").focus();
                zip = $('#lea16zip').val().match(/\d{5}(?:[-\s]\d{4})?/);
                var cazip = null;
                if (!zip) {
                    cazip = $('#lea16zip').val().match(/[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d/i)[0];
                    zip = cazip.replace(' ', '').substr(0,3).toUpperCase();
                }
                $("#lea16zip > #Dealer_Zipcode_Bridge__c_body").remove();
                $.get("/_ui/search/ui/UnifiedSearchResults?_dc=1450298301312&searchCount=1&cmdType=cmp&cmp=singleEntitySearchResult&fen=a0V&str=" + zip + "&initialViewMode=detail&sen=00Q&sen=001&sen=a0b&sen=003&sen=00T&sen=005&sen=500&sen=00U&sen=006&sen=a0V&sen=a0W&sen=00O&fpg=apcxx72g&setupid=CustomObjects&srtClmn=00NE00000060MJY&srtOrd=2", function(data) {

                    $("#referredlist").empty();
                    $(data).find("#Dealer_Zipcode_Bridge__c_body").appendTo("#referredlist");
                    $("#Dealer_Zipcode_Bridge__c_body .dataRow:not(:contains('Active Dealer')), #Dealer_Zipcode_Bridge__c_body .dataRow:contains('NM-Active Dealer')").remove();
                    $(".actionColumn").hide();
                    firstactive = $("#Dealer_Zipcode_Bridge__c_body .dataCell:contains('Active Dealer'):first");
                    console.log(firstactive.prev().text());
                    if (firstactive.prev().text() != zip) {

                        firstactive.parent().remove();
                    }
                    dealer = firstactive.prev().prev().text();
                    dealerphone = firstactive.next().next().next();
                    flag = false;
                    if (cazip) {
                        $.ajax({
                            url: "https://geocoder.ca/" + $('#lea16zip').val().replace(' ', '') + '?json=1',
                            cache: false,
                            dataType: "json",
                            type: "GET",
                            success: function(result, success) {
                                $("#lea16city").val(result.standard.city);
                                $("#lea16state").val(result.standard.prov);
                                $("#lea16country").val("Canada");
                            }

                        });
                    } else {
                        $.ajax({
                            url: "https://api.zippopotam.us/us/" + zip,
                            cache: false,
                            dataType: "json",
                            type: "GET",
                            success: function(result, success) {
                                places = result['places'][0];
                                country = result['country'];
                                $("#lea16city").val(places['place name']);
                                $("#lea16state").val(places['state abbreviation']);
                                $("#lea16country").val(country);
                            }

                        });
                    }

                    $("#CF00NE00000060HfI").val(dealer);
                    dealerphone.appendTo($("#CF00NE00000060HfI").parent().css("float", "left"));
                    if ($('#Dealer_Zipcode_Bridge__c_body > table > tbody > tr.dataRow:visible:first').is(':visible')) {
                        $("#lea3").val("IW - Referral");
                        $("#00NE0000005I38R, #CF00NE00000060HfI").parent().show();
                    } else {
                        $("#lea3").val("IW - Self Measure");
                        //  $("#CF00NE00000060HfI").val(sforce.connection.query("select First_Name__c from etcd8_LeadRecipient__C Where nextUp__c=True").records.First_Name__c);
                        $("#00NE0000005I38R, #CF00NE00000060HfI").parent().hide();
                        $(".pbBody").append('<div id="queue"></div>');
                        $("#queue").load("https://indow.my.salesforce.com/00OE0000003CMA9 #fchArea>table>tbody tr:not(:first,.grandTotal)");
                        $("#queue tr").css('text-align', 'right');
                        $("#CF00N0L000006B9no").attr('placeholder', 'Assign to User');
                        $("#queue").on("click", "a", function(e) {
                            e.preventDefault();
                            $("#CF00N0L000006B9no").val(e.target.innerText);
                        });
                    }

                });
            }

        });
    }


    $(document).ready(function() {
        //   if($("tr.dataRow").size() == 1){
        //         $("#resultsholder").find("th.dataCell").click();
        //}
        $("#lea16zip").focus();
    });
}


if ($(".bPageTitle").find("h1.pageType:contains('happy / not happy list')").text() == "happy / not happy list") {
    $(".dashWide").css("width", "initial");
    $("#componentContentArea .col3").empty();
    $.get("https://indow.my.salesforce.com/00OE0000002reVO", function(data) {
        $(data).find("#fchArea").appendTo("#componentContentArea .col3");
        $("#fchArea").css("margin-top", "20px");
        $("#headerRow_0>th>span").text(function() {
            return $(this).text().replace("Name", "");
        });
        $("#fchArea #headerRow_0").css("background-color", "rgb(170, 170, 204)");
        $("#fchArea .grandTotal").hide();
        $("#headerRow_0 a").text().replace("Name", "");
        $("#headerRow_0 a").replaceWith(function() {
            return $("<span>" + $(this).html() + "</span>");
        });

        $("#fchArea td, tr").css({ "border": "solid 1px black", "padding": "1px" });
        $("#fchArea table").css("border-collapse", "collapse");

    });


}


zip = $('#lea16_ileinner, #con19_ileinner').text().match(/\d{5}(?:[-\s]\d{4})?(?!.*\d{5}(?:[-\s]\d{4})?)/);
country = $('#lea16country').text();
zipval = $('#lea16_ileinner, #con19_ileinner').text();
cazip = $('#lea16_ileinner').text().match(/[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d/i);
if (zip) {
    $.get("/_ui/search/ui/UnifiedSearchResults?_dc=1450298301312&searchCount=1&cmdType=cmp&cmp=singleEntitySearchResult&fen=a0V&str=" + zip + "&initialViewMode=detail&sen=00Q&sen=001&sen=a0b&sen=003&sen=00T&sen=005&sen=500&sen=00U&sen=006&sen=a0V&sen=a0W&sen=00O&fpg=apcxx72g&setupid=CustomObjects&srtClmn=00NE00000060MJY&srtOrd=2", function(data) {
        $(data).find("#Dealer_Zipcode_Bridge__c_body").appendTo("#head_01BE00000081pCW_ep, #head_01BE00000081pFJ_ep");
        $("#Dealer_Zipcode_Bridge__c_body .dataCell:contains('Dormant')").parent().remove();
        $("#Dealer_Zipcode_Bridge__c_body .dataCell:contains('Canada')").parent().remove();
        $("#Dealer_Zipcode_Bridge__c_body .dataCell:contains('Deactivated')").parent().remove();
        $("#Dealer_Zipcode_Bridge__c_body .dataCell:contains('Pending')").parent().remove();
        //dealer = $("#Dealer_Zipcode_Bridge__c_body .dataCell:contains('Active Dealer')").prev().prev().text();
        firstactive = $("#Dealer_Zipcode_Bridge__c_body .dataCell:contains('Active Dealer'):first");
        dealer = firstactive.prev().prev().text();

    });
}
if (cazip) {
    cazipnospace = cazip.toString().toUpperCase();
    cazipnospace = cazipnospace.replace(/\s/g, "");
    cazipnospace = cazipnospace.replace(/,/g, "");
    $.get("/_ui/search/ui/UnifiedSearchResults?_dc=1450298301312&searchCount=1&cmdType=cmp&cmp=singleEntitySearchResult&fen=a0V&str=" + cazipnospace.substr(0, 3) + "&initialViewMode=detail&sen=00Q&sen=001&sen=a0b&sen=003&sen=00T&sen=005&sen=500&sen=00U&sen=006&sen=a0V&sen=a0W&sen=00O&fpg=apcxx72g&setupid=CustomObjects", function(data) {
        $(data).find("#Dealer_Zipcode_Bridge__c_body").appendTo("#head_01BE00000081pCW_ep");
        $("#Dealer_Zipcode_Bridge__c_body .dataCell:contains('Dormant')").parent().remove();
        $("#Dealer_Zipcode_Bridge__c_body .dataCell:contains('Deactivated')").parent().remove();
        $("#Dealer_Zipcode_Bridge__c_body .dataCell:contains('Pending')").parent().remove();
        firstactive = $("#Dealer_Zipcode_Bridge__c_body .dataCell:contains('Active Dealer'):first");
        dealer = firstactive.prev().prev().text();
        $(".noRowsHeader").parent().parent().parent().parent().remove();

    });
}

$("#CF00NE00000060HfI_ilecell").click(function() {
    sfdcPage.dblClickField(event, this);
    firstactive = $("#Dealer_Zipcode_Bridge__c_body .dataCell:contains('Active Dealer'):first");
    dealer = firstactive.prev().prev().text();
    var assigned_dealer = $("CF00NE00000060HfI_ileinner").text();
    var blank = "&nbsp;";
    $("#CF00NE00000060HfI").val(dealer);

});


$("#InlineEditDialog").click(function() {
    var country = $("#lea16country").val();
    $.ajax({
        url: "https://api.zippopotam.us/CA/" + cazip,
        cache: false,
        dataType: "json",
        type: "GET",
        success: function(result, success) {
            places = result['places'][0];
            country = result['country'];
            $("#lea16city").val(places['place name']);
            $("#lea16state").val(places['state abbreviation']);
        }

    });

});