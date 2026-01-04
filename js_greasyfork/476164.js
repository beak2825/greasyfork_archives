// ==UserScript==
// @name         E-hentai Scraper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  a simple scraper in e-hentai or exhentai you can simply export filelink with this plugging and suggest to use it with idman
// @author       jack2002jack
// @match        https://e-hentai.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @require https://code.jquery.com/jquery-3.7.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476164/E-hentai%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/476164/E-hentai%20Scraper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let reg="return popUp\\('(.*?)',"
    let chk_value = [];
    let result=[];
    $("body > div.ido > div:nth-child(2) > table > tbody > tr:nth-child(1) > th:nth-child(2)").after("<th>download</th>")
    $("td.gl2c").after('<td style="text-align:center"><input/ type="checkbox" style="height:15px;width:15px" class="download"></td>')
    $("div.searchnav:last-child").append('<div><button id="selectAll">selectAll</button><button id="start" style="margin-left:8px;">start-downloader</button></div>')
    $("#start").click(() => {
        $("table.itg").find('input.download:checked').each(function () {
            let url = $(this).parent().next().children().attr('href')
            chk_value.push(url);
        });
       chk_value.forEach((value) => {
            $.ajax({
                url: value,
                method: 'get'

            }).done((data) => {
               let  detail=$(data).find("#gd5 > p:nth-child(2) > a").attr('onclick').match(reg)[1]
                $.post(detail,{dltype:"org",dlcheck:"Download Original Archive"}).done((data)=>{
                    let real_url=data.match('(https:.*\\.hath.*?)"')[1]
                    result.push(real_url+"?start=1\n")
                    if (result.length==chk_value.length){

                        let elink=document.createElement("a")
                        elink.style.display="none"
                        elink.href=window.URL.createObjectURL(new Blob(result,{type:"text/plain"}))
                        elink.download="export.txt"
                        document.body.appendChild(elink)
                        elink.click()
                        document.body.removeChild(elink)
                    }
                })
            })
        })

    })
    $("#selectAll").click(() => {
        $("input.download").each(function(){
            $(this).prop('checked', !$(this).prop('checked'))
        })
    })

})();