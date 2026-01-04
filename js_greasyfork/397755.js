// ==UserScript==
// @name Google Image Reminder
// @namespace eiou
// @version 1.3.1
// @include *.google.*tbm=isch*
// @include *.google.*tbm=vid*
// @include *.google.*tbs=sbi*
// @include *.google.*imgurl*
// @grant none
// @require https://cdn.jsdelivr.net/npm/sweetalert2@9
// @icon https://www.google.com/favicon.ico
// @description Google Image reminder
// @downloadURL https://update.greasyfork.org/scripts/397755/Google%20Image%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/397755/Google%20Image%20Reminder.meta.js
// ==/UserScript==

// P*RN Ki Maa Ka
// const images = `https://i.imgur.com/TTI8KOl.jpg
// https://i.imgur.com/jerTuqV.jpg
// https://i.imgur.com/rSmWR0P.jpg
// https://i.imgur.com/RVZhOMb.jpg
// https://i.imgur.com/sz4W4II.jpg
// https://i.imgur.com/t3UNcpT.jpg
// https://i.imgur.com/HZJfKAL.jpg
// https://i.imgur.com/1cozQFb.png
// https://i.imgur.com/Nhkohnl.jpg
// https://i.imgur.com/v48hRbR.jpg
// https://i.imgur.com/3oM0D7d.jpg
// https://i.imgur.com/q0ch16J.jpg
// https://i.imgur.com/OyKAXRe.jpg
// https://i.imgur.com/SRMWubV.jpg
// https://i.imgur.com/QXuh3Eq.jpg
// https://i.imgur.com/4XpzhAY.jpg
// https://i.imgur.com/0ssTUXv.jpg
// https://i.imgur.com/lh7K5k8.jpg
// https://i.imgur.com/FdHQhGu.png
// https://i.imgur.com/4EYrVnN.jpg
// https://i.imgur.com/mmRfp1Q.jpg
// https://i.imgur.com/LLi5gpT.jpg
// https://i.imgur.com/QW8qATl.jpg
// https://i.imgur.com/R6qErNV.jpg
// https://i.imgur.com/JQom9jY.jpg
// https://i.imgur.com/NFIZE2d.jpg
// https://i.imgur.com/zHixZel.jpg
// https://i.imgur.com/IJcQCkd.jpg
// https://i.imgur.com/6ktPt56.jpg
// https://i.imgur.com/2qW59WJ.jpg`.split('\n')

// NASA
const images = `https://www.nasa.gov/sites/default/files/thumbnails/image/heic1501b_0.jpg
https://www.nasa.gov/sites/default/files/thumbnails/image/pia22692.jpg
https://www.nasa.gov/sites/default/files/thumbnails/image/potw2013a.jpg
https://www.nasa.gov/sites/default/files/thumbnails/image/potw2012a.jpg
https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/potw2014a.jpg
https://www.nasa.gov/sites/default/files/thumbnails/image/rosette_herschel_hi.jpg`.split('\n')

const image = images[Math.floor(Math.random() * images.length)]

Swal.fire({
    icon: 'warning',
    title: `Field training: Take 5 deep, slow breaths.`,
    // title: 'This site always leads to relapse.',
    // text: "This is a delay to make it more difficult to slip and easier to live according to my true essence.",
    // confirmButtonText: 'I will do my best stay alert and be careful, and report to AP if I feel out of control.',
    //     html: `Is this a masculine (creative, educational)
    // <br>or feminine activity (distracted, stimulation)?
    // <br><br>Preserve my juice, yeah...
    // <br>P*RN Industry Screw you.
    // <br>No more sex trafficking!`,
    text: `I'm a compassionate, confident leader who constantly breaks out of homeostasis, creating a positive impact around the whole world.`,
    imageUrl: image,
    width: 1280,
    confirmButtonText: 'Emergency',
    confirmButtonColor: 'rgb(241, 70, 104)',
    showCancelButton: true,
    cancelButtonText: 'This aligns with my values and will make me extraordinary.',
    cancelButtonColor: 'rgb(50, 152, 220)',
    backdrop: `rgb(0,0,0,1)`,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
  })
  .then(res => {
    // console.log(res)
    if (res.value)
      window.location.href = 'https://insighttimer.com/denisegour/guided-meditations/urge-surfing-meditation'

  })

var confirm = document.getElementsByClassName('swal2-cancel')[0]
confirm.style.visibility = "hidden"

setTimeout(function () {
  confirm.style.visibility = "visible"
}, 3000)