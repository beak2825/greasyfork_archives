// ==UserScript==
// @name         XをTwitterに戻すスクリプト
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  X
// @author       Other
// @match       https://twitter.com/*
 // @license MIT
// @icon         https://pbs.twimg.com/profile_images/1673255453667790852/KjZYxju0_400x400.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472724/X%E3%82%92Twitter%E3%81%AB%E6%88%BB%E3%81%99%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/472724/X%E3%82%92Twitter%E3%81%AB%E6%88%BB%E3%81%99%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

const color = '#1DA1F2';
const Icon = "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";
const tw_Icon = "M 17.085938 2.296875 C 18.921875 2.007812 20.523438 2.476562 21.894531 3.714844 C 22.910156 3.492188 23.859375 3.097656 24.730469 2.535156 C 24.511719 3.539062 23.972656 4.386719 23.109375 5.070312 C 23.898438 4.980469 24.667969 4.824219 25.425781 4.597656 C 24.792969 5.515625 24.042969 6.320312 23.167969 7.011719 C 23.003906 10.390625 22.039062 13.492188 20.273438 16.324219 C 17.039062 20.171875 12.929688 21.960938 7.933594 21.6875 C 5.847656 21.464844 3.917969 20.796875 2.144531 19.683594 C 4.636719 19.78125 6.878906 19.074219 8.863281 17.5625 C 6.84375 17.179688 5.375 16.058594 4.460938 14.203125 C 5.132812 14.140625 5.789062 14.042969 6.429688 13.910156 C 4.128906 13.160156 2.890625 11.570312 2.722656 9.136719 C 3.117188 9.238281 3.503906 9.375 3.878906 9.546875 C 4.152344 9.625 4.421875 9.625 4.691406 9.546875 C 2.695312 7.753906 2.289062 5.652344 3.476562 3.242188 C 5.40625 5.492188 7.78125 7.042969 10.597656 7.898438 C 11.515625 8.113281 12.441406 8.210938 13.378906 8.191406 C 13.046875 5.167969 14.28125 3.203125 17.085938 2.296875 Z M 17.085938 2.296875";
const favicon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAeFBMVEUAAAAcl+8cm/Adm/Adm/AdmvAdmvEYl+8Qn+8bmu8bme8em/Ecme8dmu8emvAgl+8bmu8cm/Acm/EdnPAem/AcmvAdnO8dmu8cmu8Zme8ZnO8gn+8em+8cm+8cmu8gmu8enPAeme8cm+8em+8dmu8dmu8dme8gn++31JfqAAAAKHRSTlMAQL/v/9+fIBBgcH+AsN8gMM9/3++vUGCQUFAgcODAMN9wQIDQwKAQsFNO+QAAALZJREFUeAHUzsUBhEAUA9AMZN3dcei/Q5zxBvYdvwZ/SgQhZ/MFALFEb7WGZsPBdh3MMdhxDWlFaX84onciz5hcOLneLnc5wJlAT1DzwODJTvCyPvCN0efKXnhbizOVA0bLL72WGP2CCz1CTJ70ijCJ6fWE5M9whPJI/B+k9Hml7QFNRscchpyW/QGmR0FDBkd89QWQ4nNI6ZpBd19t5xdqSud/abQzuD7prriS16JKm6kPxXwGAM9DDGV/J75tAAAAAElFTkSuQmCC"
let select;
let cnt = 0;
let interval = setInterval(svgChange,50);

document.querySelector('link[rel="shortcut icon"]').setAttribute('href',favicon)
function svgChange(){
    select = document.querySelector('path[d="' + Icon + '"]')
    if(select){
    select.setAttribute('d',tw_Icon);
    select.setAttribute('fill',color);
        cnt++;
        if(cnt > 1){clearInterval(interval)};

    }
}