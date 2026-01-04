// ==UserScript==
// @name         Rupashree Audit
// @namespace    http://tampermonkey.net/
// @version      1 (Beta)
// @description  Rupashree Helper helps you to make your work more simple
// @author       Ashis Biswas
// @match 		 https://wbrupashree.gov.in/admin/form_entry/BasicFormEntry/save_groom_photo/
// @match 		 https://wbrupashree.gov.in/admin/form_entry/BasicFormEntry/groomBasicEntry/*
// @match 		 http://wbrupashree.gov.in/admin/form_entry/BasicFormEntry/groomBasicEntry/*
// @match 		 https://wbrupashree.gov.in/admin/beneficiary/Beneficiary_list/beneficiary_details/*
// @match 		 http://wbrupashree.gov.in/admin/beneficiary/Beneficiary_list/beneficiary_details/*
// @match 		 https://wbrupashree.gov.in/admin/beneficiary/Beneficiary_list/*
// @match 		 http://wbrupashree.gov.in/admin/beneficiary/Beneficiary_list/*
// @match 		 https://wbrupashree.gov.in/admin/beneficiary/Beneficiary_list
// @require		 https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439751/Rupashree%20Audit.user.js
// @updateURL https://update.greasyfork.org/scripts/439751/Rupashree%20Audit.meta.js
// ==/UserScript==

$(document).ready(function(){
	
	//new column add
    $('<th align="center">Father</th>').insertBefore("#example tr:first-child th:last-child");
	$('<th align="center">Husband</th>').insertBefore("#example tr:first-child th:last-child");
	$('<th align="center">DOB</th>').insertBefore("#example tr:first-child th:last-child");
    $('<th align="center">IFSC</th>').insertBefore("#example tr:first-child th:last-child");
	$('<th align="center">ACC</th>').insertBefore("#example tr:first-child th:last-child");
	$('<th align="center">GP</th>').insertBefore("#example tr:first-child th:last-child");
	$('<th align="center">Block</th>').insertBefore("#example tr:first-child th:last-child");
    
    $('<td align="center"></tr>').insertBefore("#example tr td:last-child");
    $('<td align="center"></tr>').insertBefore("#example tr td:last-child");
	$('<td align="center"></tr>').insertBefore("#example tr td:last-child");
	$('<td align="center"></tr>').insertBefore("#example tr td:last-child");
    $('<td align="center"></tr>').insertBefore("#example tr td:last-child");
	$('<td align="center"></tr>').insertBefore("#example tr td:last-child");
	$('<td align="center"></tr>').insertBefore("#example tr td:last-child");
	
	$('#example tr td:last-child').append('<a class="fetchBtn btn btn-info btn-xs"><span class="glyphicon glyphicon-refresh"></span> Fetch</a>');
	
	$('#example_wrapper>div').prepend('<a class="mrBtn btn btn-info btn-sm"><span class="glyphicon glyphicon-list-alt"></span> Download Excel</a>');
	
	$('#example_wrapper>div').prepend('<a class="fetchAllBtn btn btn-success btn-sm mr-5"><span class="glyphicon glyphicon-list-alt"></span> FetchAll</a>');
	
	
	$('.fetchAllBtn').on( 'click', function(e){
		
		e.preventDefault();
		
		var ajax_request = function(rup_link, el) {
			var deferred = $.Deferred();
			var parentTR = el;
			$.ajax({
				url : rup_link,
				type: "GET",
				dataType: "text",
				success: function(data) {

					//app details
					var uFather = $(data).find("#app_basic_details table tr").eq(4);
					var uFatherTxt = uFather.find('td:eq(1)').text();
					parentTR.find('td:eq(-8)').text(uFatherTxt);
					
					
					var uHusband = $(data).find("#groom_details table tr").eq(1);
					var uHusbandTxt = uHusband.find('td:eq(1)').text();
					parentTR.find('td:eq(-7)').text(uHusbandTxt);
					
					
					var uDob = $(data).find("#app_basic_details table tr").eq(5);
					var uDobTxt = uDob.find('td:eq(1)').text();
					parentTR.find('td:eq(-6)').text(uDobTxt);
					
					
					var uBank = $(data).find("#app_contact_details table tr").eq(24);
					var uBankTxt = uBank.find('td:eq(1)').text();
					parentTR.find('td:eq(-5)').text(uBankTxt);
					
					
					var uAcc = $(data).find("#app_contact_details table tr").eq(22);
					var uAccTxt = uAcc.find('td:eq(1)').text();
					parentTR.find('td:eq(-4)').text(uAccTxt);
					
					
					var uGp = $(data).find("#app_contact_details table tr").eq(5);
					var uGpTxt = uGp.find('td:eq(1)').text();
					parentTR.find('td:eq(-3)').text(uGpTxt);
					
					
					var uBlock = $(data).find("#app_contact_details table tr").eq(7);
					var uBlockTxt = uBlock.find('td:eq(1)').text();
					parentTR.find('td:eq(-2)').text(uBlockTxt);

					deferred.resolve(data);
				},
				error: function(error) {
					deferred.reject(error);
				}
			});

			return deferred.promise();
		};//end of ajax request
		
		var looper = $.Deferred().resolve();

		$.when.apply($, $( "#example tbody tr" ).each(function( index ) {

			var rup_link = $( this ).find('td a.btn-success').attr('href');
			var pTR = $( this );
			
			looper = looper.then(function() {
				return ajax_request( rup_link, pTR );
				//console.log( rup_link );
			});

			return looper;
		})

		).then(function() {
					  
		  // run this after all ajax calls have completed
		  console.log('Done!');

		});
		
		
	});//end of fetch
	
	
	
	
	
	
	
	$('.fetchBtn').on('click', function(e){
        e.preventDefault();

        var parentTD = $(this).parent();
        var parentTR = parentTD.parent();

        var url = parentTD.find('.btn-success').attr('href');

        //Ajax Load data from ajax
        $.ajax({
            url : url,
            type: "GET",
            dataType: "text",
            success: function(data)
            {
				//app details
				var uFather = $(data).find("#app_basic_details table tr").eq(4);
                var uFatherTxt = uFather.find('td:eq(1)').text();
                parentTR.find('td:eq(-8)').text(uFatherTxt);
				
				
				var uHusband = $(data).find("#groom_details table tr").eq(1);
                var uHusbandTxt = uHusband.find('td:eq(1)').text();
                parentTR.find('td:eq(-7)').text(uHusbandTxt);
				
				
				var uDob = $(data).find("#app_basic_details table tr").eq(5);
                var uDobTxt = uDob.find('td:eq(1)').text();
                parentTR.find('td:eq(-6)').text(uDobTxt);
				
				
				var uBank = $(data).find("#app_contact_details table tr").eq(24);
                var uBankTxt = uBank.find('td:eq(1)').text();
                parentTR.find('td:eq(-5)').text(uBankTxt);
				
				
				var uAcc = $(data).find("#app_contact_details table tr").eq(22);
                var uAccTxt = uAcc.find('td:eq(1)').text();
                parentTR.find('td:eq(-4)').text(uAccTxt);
				
				
				var uGp = $(data).find("#app_contact_details table tr").eq(5);
                var uGpTxt = uGp.find('td:eq(1)').text();
                parentTR.find('td:eq(-3)').text(uGpTxt);
				
				
				var uBlock = $(data).find("#app_contact_details table tr").eq(7);
                var uBlockTxt = uBlock.find('td:eq(1)').text();
                parentTR.find('td:eq(-2)').text(uBlockTxt);
				


            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert('Error get data from ajax');
            }
        });

    });
	
	
	
	
	$(".mrBtn").on("click", function(){
        mrTable = '<table><tr><th>Applcation Id</th><th>Beneficiary Name</th><th>Status</th><th>Age</th><th>Fathers Name</th>		<th>Proposed Husbands Name</th><th>Amount</th><th>Bank IFSC</th><th>Bank Account NO</th><th>Block/Municipality</th><th>GP/Ward Name</th></tr>';

        $('#example tr').each(function(i, el){
            mrTable += '<tr>';
			mrTable += '<td>' + $(this).find('td:eq(1)').text() + '</td>';
			mrTable += '<td>' + $(this).find('td:eq(2)').text() + '</td>';
			mrTable += '<td>' + $(this).find('td:eq(5)').text() + '</td>';
			mrTable += '<td>' + $(this).find('td:eq(9)').text() + '</td>';
			mrTable += '<td>' + $(this).find('td:eq(7)').text() + '</td>';
			mrTable += '<td>' + $(this).find('td:eq(8)').text() + '</td>';
			mrTable += '<td>25000</td>';
			mrTable += '<td>' + $(this).find('td:eq(10)').text() + '</td>';
			mrTable += '<td>' + $(this).find('td:eq(11)').text() + '</td>';
			mrTable += '<td>' + $(this).find('td:eq(13)').text() + '</td>';
			mrTable += '<td>' + $(this).find('td:eq(12)').text() + '</td>';
			mrTable += '</tr>';
        });
        mrTable += '</table>';
        exportToExcel(mrTable);
    });



    function exportToExcel(table){
        var htmls = "";
        var uri = 'data:application/vnd.ms-excel;base64,';
        var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
        var base64 = function(s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        };

        var format = function(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) {
                return c[p];
            })
        };

        htmls = table;

        var ctx = {
            worksheet : 'Worksheet',
            table : htmls
        }


        var link = document.createElement("a");
        link.download = "export.xls";
        link.href = uri + base64(format(template, ctx));
        link.click();
    }
	
});