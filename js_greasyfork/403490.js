// ==UserScript==
// @name Google Image Reminder
// @namespace aoshushier
// @version 1.9.9.1
// @include *.deviantart.com*
// @include *.google.*tbm=isch*
// @include *.google.*tbm=vid*
// @include *.google.*tbs=sbi*
// @include *.google.*imgurl*
// @include https://commons.wikimedia.org/*

// @include https://fitgirl-repacks.site/*
// @include https://fmovies.to/*
// @include https://fmovies.wtf/*
// @include https://bflix.to/*
// @include https://pahe.ph/*

// @grant none
// @require https://cdn.jsdelivr.net/npm/sweetalert2@10.5.1
// @icon https://www.google.com/favicon.ico
// @description Google Image reminder with confirm delay and show delay after confirmation.
// @downloadURL https://update.greasyfork.org/scripts/403490/Google%20Image%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/403490/Google%20Image%20Reminder.meta.js
// ==/UserScript==

init({
    delay_minutes: 15,
    show_button_delay_ms: 5000
})

function init(settings) {

    if (unsafeWindow.localStorage.aoshushier && Date.now() - JSON.parse(unsafeWindow.localStorage.aoshushier) < settings.delay_minutes * 60 * 1000)
        return
    
    let title = 'Effort Pact - Want over Should'
    let text = 'Do I essentially want this, or does Paul?'
    let confirmButtonText = 'Ever Ruler'

    Swal.fire({
        width: "36em",
        title,
        text,
        confirmButtonText,
        showDenyButton: false,
        backdrop: `rgb(0,0,0,1)`,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        onBeforeOpen: () => {
            document.getElementsByClassName('swal2-title')[0].style.lineHeight = '1.5em'

            var button_area = document.getElementsByClassName('swal2-actions')[0]
            button_area.style.visibility = "hidden"

            setTimeout(function() {
                button_area.style.visibility = "visible"
            }, settings.show_button_delay_ms)
        },
    }).then((res) => {
        if (res.isConfirmed) {
            unsafeWindow.localStorage.aoshushier = JSON.stringify(Date.now())
        }
        
    })

}