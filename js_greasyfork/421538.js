// ==UserScript==
// @name     StopTVP-highlight
// @description Block TVPis users on Wykop.pl
// @version  0.0.1
// @match    *://www.wykop.pl/*
// @run-at   document-end
// @namespace https://greasyfork.org/users/736355
// @downloadURL https://update.greasyfork.org/scripts/421538/StopTVP-highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/421538/StopTVP-highlight.meta.js
// ==/UserScript==
 
/* jshint esversion: 6 */
 

function initCSS() {
  const ele= document.createElement('style');
  ele.type = 'text/css';
  ele.innerHTML = `
    .tvpis-highlight {
        border: 2px solid #ff6c6c !important;
				position: relative;
				background-color: #fff1f1 !important;
    }
    .tvpis-highlight .article:before {
        position: absolute;
				display: block;
				left: 0;
				top:0;
				content: '';
				background-image: url('data:image/svg+xml,%3Csvg%20version%3D%221.1%22%20id%3D%22Layer_2%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20x%3D%220px%22%20y%3D%220px%22%0A%20%20%20%20%20%20%20%20%20viewBox%3D%220%200%20512%20512%22%20enable-background%3D%22new%200%200%20512%20512%22%20xml%3Aspace%3D%22preserve%22%3E%0A%20%20%20%20%20%20%3Cpath%20fill%3D%22%23ff6c6c%22%20d%3D%22M305.486%2C405.211c0%2C27.191-21.752%2C49.486-49.486%2C49.486c-27.734%2C0-49.486-22.295-49.486-49.486%0A%20%20%20%20%20%20%20%20c0-27.19%2C21.752-49.485%2C49.486-49.485C283.734%2C355.726%2C305.486%2C378.022%2C305.486%2C405.211z%20M278.678%2C306.24h-45.873%0A%20%20%20%20%20%20%20%20c-6.8%2C0-12.398-5.347-12.708-12.14l-9.711-212.197c-0.332-7.247%2C5.454-13.303%2C12.708-13.303h65.781%0A%20%20%20%20%20%20%20%20c7.266%2C0%2C13.056%2C6.075%2C12.707%2C13.332l-10.197%2C212.197C291.06%2C300.91%2C285.467%2C306.24%2C278.678%2C306.24z%22%2F%3E%0A%20%20%20%20%20%20%3C%2Fsvg%3E');
         background-repeat: no-repeat;
        width: 30px;
        height: 100%;
        background-position-x: -5px;
        background-position-y: 50%;
    }
  `;
  document.head.appendChild(ele);
}

initCSS();

const stopProfiles = ['tvp_info', 'TYG0DNIK', 'info_news', 'regiony', 'Rambabas', 'Wojcista', 'filmem', 'frufru', 'paniagata', 'pipi2018', 'emirza', 'Djangobango', 'grzegorz-zajaczkowski', 'wGospodarce', 'DoRzeczy', '300GOSPODARKA'];
 
const articles = document.querySelectorAll('.article[data-type="link"] .fix-tagline');
 
let highlighted = 0;
for (let i = 0; i < articles.length; i++) {
    const profileElement = articles[i].firstElementChild;
 
    if (profileElement) {
        const profileUrl = profileElement.getAttribute('href');
        if (isProfileBanned(profileUrl)) {
            articles[i].closest('li').classList.add("tvpis-highlight");
            highlighted++;
        }
 
    }
}
 
if (highlighted > 0) {
console.info(`Podświetlono ${highlighted} pisowskich znalezisk`);
}
 
function isProfileBanned(profileUrl) {
    if (!profileUrl) {
        return false;
    }
 
    for (let i = 0; i < stopProfiles.length; i++) {
        if (profileUrl.endsWith(`/${stopProfiles[i]}/`)) {
            return true;
        }
    }
    return false;
}