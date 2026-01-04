// ==UserScript==
// @name           	MunzeePrint
// @namespace      	Nerjuz
// @author         	Nerjuz <userscripts@ite.lt>
// @version		1.1
// @namespace   	http://qr.ite.lt
// @description 	Print munzees easy
// @include     	*www.munzee.com*
// @grant       	none
// @downloadURL https://update.greasyfork.org/scripts/391450/MunzeePrint.user.js
// @updateURL https://update.greasyfork.org/scripts/391450/MunzeePrint.meta.js
// ==/UserScript==
var versija = 0.2;
jQuery(document).ready(function($) {
    /*
// Analytic

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga2');

  ga2('create', 'UA-3267689-24', 'ite.lt');
  ga2('send', 'pageview');
*/
    // Top menu
//    $('.navbar-right').append(' <li class="nav-short tooltip-helper" data-toggle="tooltip" data-placement="bottom" title="Print Munzees"><a href="/print/"><i class="fa fa-print"></i><span class="visible-xs">Print</span></a></li>');
    var usermenu_logged_in = document.getElementsByClassName('user')[0];
    if(usermenu_logged_in) usermenu_logged_in.insertAdjacentHTML('beforebegin',' <li class="nav-short tooltip-helper" data-toggle="tooltip" data-placement="bottom" title="Print Munzees"><a href="/print/"><i class="fa fa-print"></i><span class="visible-xs">Print</span></a></li>');
    // EOF Top menu
    //Bach print
    var thisRegex = new RegExp('com\/print');
    if (thisRegex.test(document.URL)) {

        //$('.tooltip-holder div.col-lg-6').wrapInner('<div id="extra-wrapper"></div>');
        //$('#extra-wrapper').hide();

        //$('.tooltip-holder div.col-lg-6 .row').wrapInner('<div id="extra-wrapper2"></div>');
        //$('#extra-wrapper2').hide();

        $('.tooltip-holder').wrap('<form target="_blank" action="" method="POST" id="formPDF"></form>');
        $('.tooltip-holder div.col-lg-3').append(
            '<div id="sidebarPDF" style="padding: 10px 0;">'+
            '<h3>Advanced printing</h3>'+
            '<div id="countMunzee" style="font-weight:bold !important">Selected munzees: <span>0</span></div><div>'+
            '<input placeholder="Type to filter" type="text" class="form-control  search" style="width:85%; margin-bottom: 7px;">'+
            '<input id="select_all_pdf" class="btn btn-info" style="width:42%; margin-bottom:7px;" type="button" value="Check visible">'+
            '<input id="deselect_all_pdf" class="btn btn-info" type="button" value="Uncheck visible" style="width:42%; margin-bottom:7px;">'+
            '<input id="go_pdf" class="btn btn-danger goprint" style="width:84%; margin-bottom:7px;"type="button" data-link="http://qr.ite.lt/" value="Go to PDF print">'+
            '<input class="btn btn-success goprint" style="width:84%; margin-bottom:7px;" type="button" data-arej="1" data-link="http://www.munzeeskinmachine.com/theskinmachine.php" value="Go to Skin Machine">'+
            '<input class="form-control"  style="border-radius:6px 0 0 6px ;text-align:center;float:left;padding: 0;width:20%; margin-bottom:7px;" type="text"  id="msize"  value="150" >'+
            '<input class="btn green goprint_off" style="padding-bottom: 8px;border-radius:0 6px 6px 0 ;width:64%; margin-bottom:7px;" type="button"  data-arej="1" id="drawqrzee_batch" data-link="" value="drawQRzee Batchprint" >'+
            '<input class="btn green " style="width:84%; margin-bottom:7px;" type="button" data-link="" value="Get barcodes values" id="gvalues">'
            /* '<h3>Genuine printing</h3>'+
        '<div class="col-xs-12 col-md-6"  style="padding: 0; width: 43%">'+
        '<label for="size">QR Size</label>'+
        '<input id="size" class="form-control" type="text" value="180" size="30" name="size">'+
        '</div>'+
        '<div class="col-xs-12 col-md-6" style="padding: 0; width: 43%">'+
        '<label for="margin">Margin</label>'+
        '<input id="margin" class="form-control" type="text" value="10" size="30" name="margin">'+
        '</div>'+
        '<input class="btn green goprint" style="width:84%; margin-bottom:7px;" type="button" data-link="" value="Batch print">'*/

        );


        $('.tooltip-holder div.col-lg-6 .panel p').hide();

        $('.tooltip-holder div.col-lg-6').removeClass('col-lg-6').addClass('col-lg-9');
        // $('form.form .row').html('');
        $('form.form .row').first().attr('id','listPDF');

        $('#listPDF').prepend('<div id="codeslist"></div>');
        $('#sidebarPDF').prepend('<input type="hidden" name="codes" id="codesPDF" />');

        var myString = $('form.form .row').first().find('.col-xs-12');
        //console.log(myString);
        $.each(myString,function(index,data) {
            //console.log(index);
            // console.log(data);
            $(this).removeClass('col-lg-9').addClass('col-lg-4');
        });
        //  var myArray = myString.split('<br>');
        $('#gvalues').click(function() {
            var codes = '';
            $("#listPDF input").each(function() {

                var rr = $(this);
                //console.log(rr);
                if (rr.is(':checked')) {
                    console.log(rr.val());
                    qr = rr.val()+"\n";
                    codes += qr;
                }
            });
            $('#codeslist').html('<textarea rows="15" style="width:98%">'+codes+'</textarea><hr>');
        });
        $('.goprint').click(function() {
            $('#formPDF').attr('action', $(this).data('link'));
            // if ($(this).data('arej') != 1) {
            //     $('#codesPDF').attr('name', 'tempas');
            // } else {
            $('#codesPDF').attr('name', 'codes');
            //  }
            $('#formPDF').submit();
        });

        // display the result in myDiv
        /*
    for (var i = 0; i < myArray.length; i++) { 
    var ocject = myArray[i];

        var url = ocject.match('(http|ftp|https)://[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?'); 

        if(url){

            var numberis = url[0].split('/'); 

            $('#listPDF').append('<div class="munzee_list col-lg-3">' + myArray[i] + " ["+numberis[5]+"]</div>"); 
        }
    }
*/
        $('#select_all_pdf').click(function() {
            var checkboxes = $('#listPDF').find(':checkbox');
            $.each(checkboxes, function(e) {
                if ($(this).is(':visible')) {

                    $(this).attr('checked', 'checked');
                }
            });
            cekSkinM();
        });
        $('#deselect_all_pdf').click(function() {
            var checkboxes = $('#listPDF').find(':checkbox');
            $.each(checkboxes, function(e) {
                if ($(this).is(':visible')) {

                    $(this).removeAttr('checked');
                }
            });
            cekSkinM();
        });

        $(".search").keyup(function() {
            // Retrieve the input field text and reset the count to zero
            var filter = $(this).val(), count = 0;
            // Loop through the comment list
            $("#listPDF .col-xs-12").not('.hidden').each(function() {
                // If the list item does not contain the text phrase fade it out
                if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                    $(this).hide();
                    // Show the list item if the phrase matches and increase the count by 1
                } else {
                    $(this).show();
                    count++;
                }
            });
            // Update the count

        });
        $('input').change(function() {
            cekSkinM();
        });

        $('#drawqrzee_batch').click(function() {
            var batchwindow = window.open('', 'Batchprint', '');
            var bd = batchwindow.document;
            bd.write('<meta http-equiv="content-type" content="text/html; charset=iso-8859-1"> <HEAD> <TITLE>Batchprint</TITLE> </HEAD> <BODY>');
            //console.log(getBatchprintCodes());
            bd.write(getBatchprintCodes());

            bd.close();
        });
        function cekSkinM() {

            var checkboxesskin = $('#listPDF').find(':checkbox');
            var valToSkinM = '';
            var i = 0;
            $.each(checkboxesskin, function(e) {
                if ($(this).is(':checked')) {
                    //  if ($(this).is(':visible')) {
                    valToSkinM = valToSkinM + $(this).val() + ';"",';
                    i++;
                    //  }
                }
            });
            $('#codesPDF').val(valToSkinM);
            $('#countMunzee span').html(i);
        }
        function prepareAnnotateText(txt, name) {
            return txt.replace("%%name", name);
        }
        function getSpecificText(playername, number) {
            var arr = null;
            if (arr != null) {
                arr = JSON.parse(arr);
                var j = inMtxtArray(playername + "/" + number, arr);
                if (j > -1) {
                    return arr[j][1];
                } else {
                    return '';
                }
            } else {
                return '';
            }
        }
        function getBatchprintCodes() {
            var codes = '';
            var msize = $('#msize').val();
            $("#listPDF input").each(function() {
                var rr = $(this);
                if (rr.is(':checked')) {
                    // console.log(rr);
                    //do we have a specific text?
                    var splurl = rr.val().split("/");

                    var txt = prepareAnnotateText(getSpecificText(splurl[4], splurl[5]), rr.next().html());
                    qr = "<a href='http://da-fi.de/public/munzee/qrDrawer.php?disp=1&ecc=H&back_c=FFFFFF&front_c=000000&nr=1&size=150&cut=0&text=&url=" + rr.val() + "'><img style='margin: 0px;' src='http://da-fi.de/public/munzee/qrDrawer.php?nr=1&ecc=H&back_c=FFFFFF&front_c=000000&size="+ msize +"&cut=0&text=&url=" + rr.val() + "'/>";
                    qr += "</a>\n";
                    codes += qr;
                }
            });
            return codes;
        }
        $('#extra-wrapper').remove();
        $('#listPDF').append('<div style="clear:both;">&nbsp;</div>');

/*        $('#sidebarPDF').append('<div style="padding-top:25px;"><h3>Like this script?</h3><form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">'+
                                '<input type="hidden" name="cmd" value="_s-xclick">'+
                                '<input type="hidden" name="hosted_button_id" value="EVCE68LXNRUU4">'+
                                '<input type="image" src="http://qr.ite.lt/img/donate.png" border="0" name="submit" alt="Like this script? Buy me a beer!">'+
                                '<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">'+
                                '</form></div>');
*/
    }




    // EOF Bach print
});