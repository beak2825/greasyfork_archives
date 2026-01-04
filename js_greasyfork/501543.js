// ==UserScript==
// @name         Archive.ph Resave
// @namespace    http://tampermonkey.net/
// @version      2025-073-27-14-01
// @description  Resave the web page again on archive.ph
// @author       hangjeff
// @match        https://archive.is/*
// @match        https://archive.ph/*
// @match        https://archive.md/*
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501543/Archiveph%20Resave.user.js
// @updateURL https://update.greasyfork.org/scripts/501543/Archiveph%20Resave.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let savedPage = $('input[name="q"]').val();
    if($('center').find('#HEADER').length){
        if(savedPage.includes('?')){
            if(savedPage.includes('archiveParameter')){
                let archiveParameter = new URLSearchParams(
                    new URL(savedPage).search).get('archiveParameter');
                archiveParameter = parseInt(archiveParameter) + 1;

                let params = new URLSearchParams(new URL(savedPage).search);
                params.set('archiveParameter', archiveParameter);
                savedPage = savedPage.substring(0, savedPage.lastIndexOf('?') + 1) + params.toString();
                Form_Create(savedPage);
            }
            else{
                Form_Create(savedPage + '&archiveParameter=1');
            }
        }
        else{
            Form_Create(savedPage + '?archiveParameter=1');
        }
    }



    function Form_Create(myUrl){
        let Bootstrap = $('<link>', {
                	href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
                    rel: 'stylesheet'
             }).appendTo('head');

        let form = $('<form>', {
        			id: 'submiturl',
        			action: 'https://archive.is/submit/',
        			method: 'GET',
                    class: 'col-2'
    			});

        form.append(
        			$('<input>', {
                		id: 'url',
                		type: 'hidden',
                		name: 'url',
                		value: myUrl
            		})
    			);
        form.append(
        			$('<input>', {
                		type: 'submit',
                		value: 'Save to archive.is again',
                		tabindex: '1',
                        class: 'btn btn-primary'
            		})
    			);

        let btn_Back = $('<button class = "col-2 col-sm-2 btn btn-secondary">Go Back to the Page</button>');
        btn_Back.on('click', function(){
           window.open($('input[name="q"]').val());
        })

        let myDiv = $('<div>', {
              class: 'row justify-content-center'
        });
        myDiv.append(form);
        myDiv.append(btn_Back);
        $('#HEADER').prepend(myDiv);

        $('form[action="https://archive.is/search/"]').css('padding', '15px').css('height', '30px');
        $('#search').css('height', '75px');
    }
})();