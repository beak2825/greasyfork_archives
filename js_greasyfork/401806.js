// ==UserScript==
// @name         Grupeer bulk download agreements 2
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Download all Grupeer agreements PDFs
// @author       Alberizo
// @match        https://www.grupeer.com/my-investments*
// @match        https://www.grupeer.com/*/my-investments*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/401806/Grupeer%20bulk%20download%20agreements%202.user.js
// @updateURL https://update.greasyfork.org/scripts/401806/Grupeer%20bulk%20download%20agreements%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    if($){
        const grupeer_url = new URL(window.location.href);
        var page_search = window.location.search;
        var page = 1;
        var auto = false;

        if(page_search){
            page = parseInt(grupeer_url.searchParams.get('page'));
            auto = grupeer_url.searchParams.get('auto');
        }

        var $table_investments = $('.table-investments');
        var $table_header = $table_investments.find('.head');

        $table_header.children('.flex-block:last').append('<div id="downloadpdf"><span class="savepdfs" style="cursor:pointer" title="Download all agreements of this page">💾</span></div>');
        var $downloadpdf = $table_header.find('#downloadpdf');
        $downloadpdf.find('.savepdfs').click(function(){
            action_save_pdfs();
            $downloadpdf.text('Wait.. ⌛');
        });

        if(auto){
            action_save_pdfs();
            $downloadpdf.text('Wait.. ⌛');
        }

        function download_pdf(url, filename){
            var req = new XMLHttpRequest();
                req.open('GET', url, true);
                req.responseType = 'blob';
                req.onreadystatechange = function () {
                    if (req.readyState === 4 && req.status === 200) {
                        if (typeof window.chrome !== 'undefined') {
                            // Chrome version
                            var link = document.createElement('a');
                            link.href = window.URL.createObjectURL(req.response);
                            link.download = filename;
                            link.click();
                        } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                            // IE version
                            var blob = new Blob([req.response], { type: 'application/pdf' });
                            window.navigator.msSaveBlob(blob, filename);
                        } else {
                            // Firefox version
                            var file = new File([req.response], filename, { type: 'application/force-download' });
                            window.open(URL.createObjectURL(file));
                        }

                    }
                };
                req.send();
        }

        function pause(msec) {
            return new Promise(
                (resolve, reject) => {
                    setTimeout(resolve, msec || 1000);
                }
            );
        }

        async function action_save_pdfs(){
            var $loans = $('.table-investments > .flex-container:not(.head)');
            var number_loans = $loans.length;
            var counter_loans = 1;
            var counter_limit_download_chrome = 0

            for(var i=0; i<number_loans; i++){
                var $loan_row = $($loans[i]);
                var url_pdf = $loan_row.find('.flex-block-pdf a').attr('href');
                var loan_originator = $loan_row.find('.lo-partners .flex-block-deals-content').text().trim()
                var project_id = $loan_row.find('.flex-block:first a').text().trim();
                var agreement_id = Number(url_pdf.substr(url_pdf.lastIndexOf('/') + 1)) + 1000;

                var url_project = $loan_row.find('.flex-block.md a').attr('href');
                var projectName = "";
                if (url_project.startsWith("project/")) {
                   projectName = getProjectNameFromUrl(url_project);
                }

                if(counter_loans == number_loans){
                    setTimeout(function(){
                        var redirect_url = '?page='+ (page+1) + '&auto=true';

                        if (typeof window.chrome !== 'undefined') {
                            location.href = redirect_url;
                        }

                        $('#downloadpdf').html('<a href="'+redirect_url+'" title="">Goto page '+ (page+1) +'</a>');
                    }, number_loans*250);
                }

                download_pdf(url_pdf, 'Grupeer Agreement - ' + agreement_id + ' - ' + project_id + ' (' + loan_originator + projectName + ').pdf');

                if (++counter_limit_download_chrome >= 3){
                    await pause(1500);
                    counter_limit_download_chrome = 0;
                }

                counter_loans++;
            }
        }

        function getProjectNameFromUrl(url) {
            var projectName = "";
            $.ajaxSetup({async:false});
            $.get( url, function( data ) {
                projectName = /<title>(.*?)<\/title>/.exec(data)[1].replace("Invest in the development project ", "_");
            });
            $.ajaxSetup({async:true});
            return projectName;
        }
    }
})();