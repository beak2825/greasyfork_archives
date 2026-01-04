// ==UserScript==
// @name         LZT Next
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  script for lolz.guru
// @author       zoto_ff
// @match        *.lolz.guru/*
// @icon         https://www.google.com/s2/favicons?domain=lolz.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443841/LZT%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/443841/LZT%20Next.meta.js
// ==/UserScript==

const account_username = $(".accountUsername span").text()
var my_nick_style = localStorage.getItem("uniq-style") || 'background: linear-gradient(20deg, #006eff, #00ff81 52%, #fff 50%, #93cbff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-shadow: 0 0 7px #00ffcf80;'

function updateUniqs () {
    Array.from($(".username span")).forEach((item)=>{
        item = $(item)
        if(item.text() == account_username){
            item.removeAttr('class')
            item.attr('style', my_nick_style)
        }
    })
}
updateUniqs()

function closeUniqModal () {
    $('#lolznextmodal').modal('toggle')
    $('.modal-backdrop').remove()
}

function updateUniq () {
    let el = $("#lolznext-style_field")
    localStorage.setItem('uniq-style', el.val())
    my_nick_style = el.val()
    updateUniqs()
    closeUniqModal()
}

const menu = document.createElement('div')
menu.className = "modal fade"
menu.id = "lolznextmodal"
menu.style.display = "none"
menu.innerHTML = `<div class="xenOverlay selectForumOverlay" style="top: 10%;"><div class="scroll-wrapper sectionMain scrollbar-macosx scrollbar-dynamic" style="position: relative;"><div class="sectionMain scrollbar-macosx scrollbar-dynamic scroll-content" id="SelectForumOverlayScrollbar" style="height: auto; margin-bottom: 0px; margin-right: 0px; max-height: 332px;"><h1 class="heading h1" style="font-size: 1.5em; text-align: center; font-weight: 600; padding: 14px;">LZT Next</h1><a class="close OverlayCloser"></a><div style="padding: 20px;"><div class="textHeading" style="margin-top: 0">Стиль ника:</div><textarea name="username_css" class="UsernameCss textCtrl" style="width: 100%; min-height: 150px;" id="lolznext-style_field">`+my_nick_style+`</textarea><button class="button primary" style="margin-top: 20px;" id="lolznextsave">Сохранить</button></div></div></div></div>`
document.body.append(menu)
$('#AccountMenu > a:nth-child(10)').after('<a onclick="$(\'#lolznextmodal\').modal()">LZT Next</a>')
$(document).ready(()=>{
    $("#lolznextmodal .OverlayCloser").on('click', closeUniqModal)
    $("#lolznextsave").on('click', updateUniq)
})