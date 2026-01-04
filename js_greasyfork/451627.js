// ==UserScript==
// @name         DoLegal Script
// @namespace    http://tampermonkey.net/
// @version      0.20
// @description  Download data and agreements from DF
// @author       @Juanvi78
// @match        https://www.dofinance.eu/en
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://greasyfork.org/scripts/451518-sheet-js-0-8-11/code/Sheet%20JS%200811.js?version=1094747
// @require      https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/451627/DoLegal%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/451627/DoLegal%20Script.meta.js
// ==/UserScript==

(function() {

        'use strict';
        var $ = window.jQuery;
        if (!$("#sslegal").length){
            var summary_data=['',0,0,0,0,0,0,0,0,0,0]; //0 Investor, 1 Auto-invested,2 Auto-interest,3 Manual-invested,4 Manual-interest,5 Invested+interest,6 Available,7 Total,8 Unspecified,9 Requested payout,10 Processing
            var paginas_inversiones=1;
            var paginas_cesiones=1;
            var array_cesiones=[];
            var array_pdfs=[];
            var invested_total=0;
            var invested_cesion=0;
            var nya="";
            var prefijo="";
            $("body").append("<a id='sslegal' style='display: none;'\>");
            $("#loans").before("<div id='auxiliar' style='display: none;' class='loans-section'></div><div id='transa' style='display: none;'></div>");
            $(".summary-table").before("<div id='legal'><img src='https://iili.io/DrgCFe.th.png' border='0' style='float:left'><div style='display: table;'><div id='trans_progreso'></div><div id='inv_progreso'></div><div id='ces_progreso'></div><div id='pdf_progreso'></div><div id='final'><br>Thanks for installing DoFin Claim Recovery Script. If you have already downloaded data successfully, skip this message uninstalling it. Please, do not run script more than once because it overloads DF servers and they may implement some restrictions if they find out we are doing mass downloads.<br><br>&nbsp;&nbsp;<button onclick=$('#legal').hide();>Cancel</button>&nbsp;&nbsp;&nbsp;<button id='start_d''>Start download</button><br><br></div></div></div>");
            $("#start_d")[0].addEventListener("click", screenshots, false);

        }

    function screenshots(){
            $(".opened.program").show();
            $("#legal").hide();
            $("#cookieNotice").hide()
            html2canvas(document.body).then((canvas) => {
                $("#sslegal")[0].href = canvas.toDataURL("image/png");
                summary();
            });
    }

    function summary(){
        $("#legal").show();
        $(".summary-table").hide();
        //$(".summary-table").after("<div id='auxiliar' style='display: none;'></div>");
        $(".summary-table td:last-child").remove();
        summary_data[5]=limpia_euro($(".summary-table tr:nth-child(2) td:last").text());
        $(".summary-table tr:last").remove();
        $(".summary-table td:last-child div").each(function(){
           var cat=$($(this).parent().prev().prev()).text().toLowerCase(),
               est=$($($(this).parent().prev().children())[$(this).index()]).text().toLowerCase(),
               cant=limpia_euro($(this).text());
           if (cat.includes("manual") && est.includes("invested")) summary_data[3]+=cant;
           else if (cat.includes("manual") && est.includes("interest")) summary_data[4]+=cant;
           else if (cat.includes("%") && est.includes("invested")) summary_data[1]+=cant;
           else if (cat.includes("%") && est.includes("interest")) summary_data[2]+=cant;
           else if (cat.includes("%") && est.includes("processing")) summary_data[10]+=cant;
        });
        if (summary_data[5]-summary_data[1]-summary_data[2]-summary_data[10]>0.01) {
            mensaje("There is an error in the Summary Page. Please contact @Juanvi78 and send a screenshot of the table below. Thanks!");
        } else if(summary_data[3] || summary_data[4]) mensaje("You have manual investments. Manual investments are not processed currently because we didn't find any investor to test with. Please contact @Juanvi78 to help code that part in the script. Thanks!");
        else {
            mensaje("");
            if ($(".summary-table tr:last td:first").text().toLowerCase().includes("available")){
                summary_data[6]=limpia_euro($(".summary-table td:last").text());
            } else if ($(".summary-table tr:last td:first").text().toLowerCase().includes("payout") && $(".summary-table tr:nth-last-child(2) td:first").text().toLowerCase().includes("available")){
                summary_data[6]=limpia_euro($(".summary-table tr:nth-last-child(2) td:last").text());
                summary_data[9]=limpia_euro($(".summary-table td:last").text());
            }
            summary_data[7]=summary_data[5]+summary_data[6];
            $("body").append("<table id='tablainversiones' style='display:none'></table>");
            $("body").append("<table id='tablacesiones' style='display:none'></table>");
            $("#auxiliar").load("/en/users/profile .table-my-data tbody tr:first td:last,tr:last td:last", function(){
                try{
                    summary_data[0]= $("#auxiliar td:last").text().trim();
                    nya=$("#auxiliar td:first").text().trim().replaceAll(" ","-").toUpperCase().normalize('NFKD').replace(/[\u0300-\u036F]/g, '');
                    prefijo=nya+"-"+summary_data[0];
                    transactions();
                }catch (e){
                    pintaerror(e);
                }
            });
        }
    }

    function transactions(){
                    $('#trans_progreso').text("-Downloading transactions statements");
                    $("#transa").load("/en/users/statement form",function(){
                        try{
                            $("#date-from").val("01.01.2017");
                            $("[name='pdf']").click();
                            cargapaginainversiones(1);
                        }catch (e){
                            pintaerror(e);
                        }
                    })
    }

    function cargapaginainversiones(pagina){
         $("#auxiliar").load("/en/investments/auto?page="+pagina+" .block-content", function(){
           try{
             paginas_inversiones=$("#auxiliar .pagination li:last").text();
             if (!paginas_inversiones) paginas_inversiones=1;
             $('#inv_progreso').text("-Processing Portfolio: Page "+pagina+" of "+paginas_inversiones);
             array_cesiones=[];
             $("#auxiliar tr.auto-basic").each(function(){
                 var $celdas=$(this).find("td");
                 if($celdas.length && $($celdas[7]).html().trim()!="Completed"){
                     $(this).prepend("<td>"+summary_data[0]+"</td>");
                     $("#tablainversiones").append($(this));
                     var id = $($celdas[0]).text().match(/\((\d*)\)/)[1];
                     $($celdas[0]).text(id);
                     $($celdas[3]).text(limpia_euro($($celdas[3]).text()));
                     $($celdas[4]).text(limpia_euro($($celdas[4]).text()));
                     $($celdas[6]).text(limpia_euro($($celdas[6]).text()));
                     array_cesiones.push([id,$($celdas[6]).text()*1 || $($celdas[3]).text()*1]);
                 }
             });
             if (array_cesiones.length) cargapaginacesiones(0,1,pagina);
             else if (pagina<paginas_inversiones) cargapaginainversiones(pagina+1)
             else excel();
          }catch (e){
            pintaerror(e);
          }
         });
     }

     function cargapaginacesiones(indice,pagina,paginainversiones){
             $("#auxiliar").load("/en/investments/cessions/"+array_cesiones[indice][0]+"?page="+pagina+" .block-content", function(){
             try{
                 if (pagina==1){
                     invested_cesion=0;
                 }
                 paginas_cesiones=$("#auxiliar .pagination li:last").text();
                 if (!paginas_cesiones) paginas_cesiones=1;
                 $("#auxiliar tr").each(function(){
                     var $celdas=$(this).find("td");
                     if($celdas.length && $($celdas[4]).html().trim()!="Completed"){
                         $($celdas[0]).find("dl").remove();
                         var id=$($celdas[0]).text().trim();
                         $($celdas[0]).text(id);
                         $($celdas[1]).text($($celdas[1]).text().trim());
                         var inv=limpia_euro($($celdas[3]).text());
                         invested_total+=inv;
                         invested_cesion+=inv;
                         $($celdas[3]).text(inv);
                         $($celdas[6]).remove();
                         $($celdas[7]).remove();
                         $($celdas[1]).after("<td id='loan-"+id+"'></td>");
                         $($celdas[1]).after("<td id='pdf-"+id+"'></td>");
                         $(this).prepend("<td>"+array_cesiones[indice][0]+"</td>");
                         $(this).prepend("<td>"+summary_data[0]+"</td>");
                         $("#tablacesiones").append($(this));
                         array_pdfs.push(id);
                     }
                     ;
                 });
                 $('#ces_progreso').text("-Processing Cessions: "+invested_total+" € of "+summary_data[1]+" €");
                 if (invested_cesion<array_cesiones[indice][1] && pagina<paginas_cesiones) cargapaginacesiones(indice,pagina+1,paginainversiones);
                 else if (indice<array_cesiones.length-1) cargapaginacesiones(indice+1,1,paginainversiones);
                 else if (paginainversiones<paginas_inversiones) cargapaginainversiones(paginainversiones+1)
                 else excel();
             }catch (e){
                 pintaerror(e);
             }
         });
     }


    function cargaPdf(indice){
     summary_data[8]=Math.round((summary_data[1]-invested_total) * 100) / 100;
     $('#pdf_progreso').text("-Downloading and parsing agreements: "+(indice+1)+" of "+array_pdfs.length);
     pdfjsLib.getDocument("/en/contracts/download/pdf/en/cession/id/"+array_pdfs[indice]+".pdf").promise.then(function (pdf) {
      getPageText(1, pdf).then(function (pageText) {
			var match=pageText.match(/Attracted Loan Agreement: ([\s\S]+) 8/);
			if (match){
                $("#pdf-"+array_pdfs[indice]).text("SIA Alfa Finance/Hopetech PTE");
                $("#loan-"+array_pdfs[indice]).text(match[1]);
			}else{
                match=pageText.match(/The Assignee([\s\S]+)Name/);
                $("#pdf-"+array_pdfs[indice]).text(match?match[1]:"Not found in pdf");
                match=pageText.match(/Loan agreement number: ([\s\S]+) 3/);
                $("#loan-"+array_pdfs[indice]).text(match?match[1]:"Not found in pdf");
			}
            pdf.getData().then(function (array) {
             download(array,prefijo+"-AGREEMENT-"+array_pdfs[indice]+'.pdf');
             pdf.cleanup();
             if (indice<array_pdfs.length-1) cargaPdf(indice+1)
             //if (indice<3) cargaPdf(indice+1)
             else excel();
            });
       });
      });
    }

    function excel(){
        $("#tablainversiones").prepend("<tr><th>Investor</th><th>Investment plan</th><th>Sign date</th><th>Due date</th><th>Investment</th><th>Income</th><th>Active Portfolio</th><th>Open Portfolio</th><th>Status</th></tr>");
        $("#tablacesiones").prepend("<tr><th>Investor</th><th>Investment plan</th><th>Cession No.</th><th>Country</th><th>Assignor</th><th>Loan No.</th><th>Cession Created Date</th><th>Invested</th><th>Status</th><th>Loan Due Date</th></tr>");
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.aoa_to_sheet([["Investor","Auto-invested","Auto-interest","Manual-invested","Manual-interest","Invested+interest","Available","Total","Unspecified","Requested payout","Processing"],summary_data]);
        wb.SheetNames.push("Summary");
        wb.Sheets["Summary"] = ws;
        ws = XLSX.utils.table_to_sheet(document.getElementById("tablainversiones"));
        wb.SheetNames.push("Investment Plans");
        wb.Sheets["Investment Plans"] = ws;
        ws = XLSX.utils.table_to_sheet(document.getElementById("tablacesiones"));
        wb.SheetNames.push("Cessions");
        wb.Sheets["Cessions"] = ws;
        XLSX.writeFile(wb, prefijo+"-INVESTMENTS.xlsx");
        $("#sslegal")[0].download = prefijo+"-SCREENSHOT.png";
        $("#sslegal")[0].click();
        $("[name='xls']").click();
        $('#final').html("-Excel file created and downloaded<br>-Summary page screenshot taken<br><br><span style='background-color: #74ef74;'>The process was completed succesfully.</span><br>-Total funds: "+summary_data[7].toFixed(2)+" €<br>-Available funds: "+summary_data[6].toFixed(2)+" €<br>-Interest in auto-invest: "+summary_data[2].toFixed(2)+" €<br>-Auto-invest principal (summary page): "+summary_data[1].toFixed(2)+" €<br>-Auto-invest principal (cessions found): "+invested_total.toFixed(2)+" €<br>"+(summary_data[8]?"You have an <span style='background-color: #eb9679;'>unspecified amount</span> of: "+summary_data[8].toFixed(2)+" € <br>(i.e open investment plans without underlying open cessions)<br>":"")+"<br><b>In your download folder you should find now:</b><br><br>&nbsp;-1 file named Statement_2017-01-01...pdf which is full statement of transactions  <br><br>&nbsp;-1 file named Statement_2017-01-01...xls which is full statement of transactions  <br><br>&nbsp;-1 file named "+prefijo+"-SCREENSHOT.png with a screenshot of your Summary Page<br><br>&nbsp;-1 file named "+prefijo+"-INVESTMENTS.xlsx with 3 sheets for summary, plan investments and cessions data.<br><br><br><br><br>" );
     }


    function getPageText(pageNum, PDFDocumentInstance) {
        // Return a Promise that is solved once the text of the page is retrieven
        return new Promise(function (resolve, reject) {
            PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
                // The main trick to obtain the text of the PDF page, use the getTextContent method
                pdfPage.getTextContent().then(function (textContent) {
                    var textItems = textContent.items;
                    var finalString = "";

                    // Concatenate the string of the item to the final string
                    for (var i = 0; i < textItems.length; i++) {
                        var item = textItems[i];

                        finalString += item.str + " ";
                    }

                    // Solve promise with the text retrieven from the page
                    resolve(finalString);
                });
            });
        });
    }

    function download(data, filename) {
        var file = new Blob([data], {type:'application/pdf'});
        if (window.navigator.msSaveOrOpenBlob) {// IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        } else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    function pintaerror(e){
        mensaje("Something went wrong. Please screenshot & report to @Juanvi78 in order to debug it.<br><br>"+e.stack);
        throw e;
    }

    function mensaje(e){
        $("#final").html(e);
    }

    function limpia_euro(e) {
            e=e.replaceAll("-","");
            return e?Math.round(e.replace("€","").replace(",","").trim()*100)/100:0;
     }


})();