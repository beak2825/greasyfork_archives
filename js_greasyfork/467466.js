// ==UserScript== 
// @name         Tobacco Cinema
// @description  Watch xxx media contents without ads or distractions and with a little tweak (fortune cookie style). For any matter not related to design or technicality please refer to Schimon Jehudah, Adv. (L.N 63708 IL)
// @author       Christina D. Savitsky (WAP member, 1991), Chuvashia (RUSSIA)
// @collaborator Aika Kamijo, JAPAN
// @collaborator Alex James Anderson (American Dissident Voices member, 1995), Massachusetts (USA)
// @collaborator David J. Millard, Massachusetts (USA)
// @collaborator Georgio Puerta Díaz Fierro, MEXICO
// @collaborator Gumako Tiyawa Jackson, LIBERIA (TWP for life)
// @collaborator Hajra Khan, PAKISTAN
// @collaborator Jerard Alvefur, Massachusetts (USA)
// @collaborator Jessica M. Haller (WAP member, 1989), Colorado (USA)
// @collaborator José Cobos Camil de Camacho, MEXICO
// @collaborator Laura Stapelberg (Pink Cross Foundation member, 2014), BELARUS
// @collaborator Mai Thongmee, TAIWAN
// @collaborator Nimrit Neha Pillai, INDIA
// @collaborator Ranee Jirayungyurn, THAILAND
// @consultant   Schimon Z. Jehudah, IRAQ
// @namespace    xxx-clear-cinema-video
// @homepageURL  https://sleazyfork.org/scripts/467466-tobacco-cinema
// @supportURL   https://sleazyfork.org/scripts/467466-tobacco-cinema/feedback
// @noframes
// @version      9.1.1
// @codename     Dahlia.Sky.31.2021 // signed 2022-04-20 // released 2023-02-29
// @require      https://unpkg.com/hls.js@1.4.4/dist/hls.js
// @license      BSD-2
// @run-at       document-start
// @exclude      *#utm
// @match        *://*/*
// @icon        data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCEtLSBDcmVhdGVkIHdpdGggSW5rc2NhcGUgKGh0dHA6Ly93d3cuaW5rc2NhcGUub3JnLykgLS0+Cjxzdmcgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAxMi43IDEyLjciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogPGRlZnM+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXJHcmFkaWVudDM0MDE0IiB4MT0iMjYuNTQiIHgyPSIzNS43MDMiIHkxPSI2LjE0MjIiIHkyPSI2LjE0MjIiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMS40NDIzIDAgMCAxLjIzMjIgLTM4LjUyNSAtMS4yNzYxKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgogICA8c3RvcCBvZmZzZXQ9IjAiLz4KICA8L2xpbmVhckdyYWRpZW50PgogIDxsaW5lYXJHcmFkaWVudCBpZD0ibGluZWFyR3JhZGllbnQzNDc3NyIgeDE9IjIuMjU3OCIgeDI9IjUwLjc2NiIgeTE9IjI3LjczOCIgeTI9IjI3LjczOCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCguMjcyMDQgMCAwIC4yNTgzNiAtLjg1MTY3IC0uODc0MDYpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgIDxzdG9wIHN0b3Atb3BhY2l0eT0iMCIgb2Zmc2V0PSIwIi8+CiAgPC9saW5lYXJHcmFkaWVudD4KIDwvZGVmcz4KIDxnPgogIDxyZWN0IHdpZHRoPSIxMi43IiBoZWlnaHQ9IjEyLjciIGZpbGw9IiNlNmU2ZTYiIHN0cm9rZS13aWR0aD0iLjA1MjUwMyIvPgogIDxnIGZpbGw9IiMwMDAwMDAiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj4KICAgPHRleHQgdHJhbnNmb3JtPSJzY2FsZSguMjY0NTgpIiB4PSIxODMuNDMxODUiIHk9IjE2Mi4xMDE3NSIgZG9taW5hbnQtYmFzZWxpbmU9ImF1dG8iIGZvbnQtc2l6ZT0iMzJweCIgc3RvcC1jb2xvcj0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIxLjI3OTgiIHN0eWxlPSJmb250LWZlYXR1cmUtc2V0dGluZ3M6bm9ybWFsO2ZvbnQtdmFyaWFudC1hbHRlcm5hdGVzOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LWVhc3QtYXNpYW46bm9ybWFsO2ZvbnQtdmFyaWFudC1saWdhdHVyZXM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtcG9zaXRpb246bm9ybWFsO2lubGluZS1zaXplOjA7bGluZS1oZWlnaHQ6MS4zNTtzaGFwZS1tYXJnaW46MDtzaGFwZS1wYWRkaW5nOjA7dGV4dC1kZWNvcmF0aW9uLWNvbG9yOiMwMDAwMDA7dGV4dC1kZWNvcmF0aW9uLWxpbmU6bm9uZTt0ZXh0LWRlY29yYXRpb24tc3R5bGU6c29saWQ7dGV4dC1pbmRlbnQ6MDt0ZXh0LW9yaWVudGF0aW9uOm1peGVkO3RleHQtdHJhbnNmb3JtOm5vbmU7d2hpdGUtc3BhY2U6bm9ybWFsIiB4bWw6c3BhY2U9InByZXNlcnZlIj48dHNwYW4geD0iMTgzLjQzMTg1IiB5PSIxNjIuMTAxNzUiLz48L3RleHQ+CiAgIDx0ZXh0IHRyYW5zZm9ybT0ic2NhbGUoLjI2NDU4KSIgZG9taW5hbnQtYmFzZWxpbmU9ImF1dG8iIGZvbnQtc2l6ZT0iMzJweCIgc3RvcC1jb2xvcj0iIzAwMDAwMCIgc3R5bGU9ImZvbnQtZmVhdHVyZS1zZXR0aW5nczpub3JtYWw7Zm9udC12YXJpYW50LWFsdGVybmF0ZXM6bm9ybWFsO2ZvbnQtdmFyaWFudC1jYXBzOm5vcm1hbDtmb250LXZhcmlhbnQtZWFzdC1hc2lhbjpub3JtYWw7Zm9udC12YXJpYW50LWxpZ2F0dXJlczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1wb3NpdGlvbjpub3JtYWw7aW5saW5lLXNpemU6MDtsaW5lLWhlaWdodDoxLjM1O3NoYXBlLWluc2lkZTp1cmwoI3JlY3QyMDc5MCk7c2hhcGUtbWFyZ2luOjA7c2hhcGUtcGFkZGluZzowO3RleHQtZGVjb3JhdGlvbi1jb2xvcjojMDAwMDAwO3RleHQtZGVjb3JhdGlvbi1saW5lOm5vbmU7dGV4dC1kZWNvcmF0aW9uLXN0eWxlOnNvbGlkO3RleHQtaW5kZW50OjA7dGV4dC1vcmllbnRhdGlvbjptaXhlZDt0ZXh0LXRyYW5zZm9ybTpub25lO3doaXRlLXNwYWNlOnByZSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIvPgogICA8dGV4dCB0cmFuc2Zvcm09Im1hdHJpeCguMDc2NTYyIDAgMCAuMDc1ODM4IC0xMy41MzEgLTQuNTM2MSkiIHg9IjE5NC4xMDM3IiB5PSIxODYuNDEwOTgiIGRvbWluYW50LWJhc2VsaW5lPSJhdXRvIiBmb250LXNpemU9IjExMS4xMXB4IiBmb250LXdlaWdodD0iYm9sZCIgc3RvcC1jb2xvcj0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIxLjI3OTgiIHN0eWxlPSJmb250LWZlYXR1cmUtc2V0dGluZ3M6bm9ybWFsO2ZvbnQtdmFyaWFudC1hbHRlcm5hdGVzOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LWVhc3QtYXNpYW46bm9ybWFsO2ZvbnQtdmFyaWFudC1saWdhdHVyZXM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtcG9zaXRpb246bm9ybWFsO2lubGluZS1zaXplOjA7bGluZS1oZWlnaHQ6MS4zNTtzaGFwZS1tYXJnaW46MDtzaGFwZS1wYWRkaW5nOjA7dGV4dC1kZWNvcmF0aW9uLWNvbG9yOiMwMDAwMDA7dGV4dC1kZWNvcmF0aW9uLWxpbmU6bm9uZTt0ZXh0LWRlY29yYXRpb24tc3R5bGU6c29saWQ7dGV4dC1pbmRlbnQ6MDt0ZXh0LW9yaWVudGF0aW9uOm1peGVkO3RleHQtdHJhbnNmb3JtOm5vbmU7d2hpdGUtc3BhY2U6bm9ybWFsIiB4bWw6c3BhY2U9InByZXNlcnZlIj48dHNwYW4geD0iMTk0LjEwMzciIHk9IjE4Ni40MTA5OCI+VEM8L3RzcGFuPjwvdGV4dD4KICAgPHRleHQgdHJhbnNmb3JtPSJzY2FsZSguMjY0NTgpIiBkb21pbmFudC1iYXNlbGluZT0iYXV0byIgZm9udC1zaXplPSIzMnB4IiBzdG9wLWNvbG9yPSIjMDAwMDAwIiBzdHlsZT0iZm9udC1mZWF0dXJlLXNldHRpbmdzOm5vcm1hbDtmb250LXZhcmlhbnQtYWx0ZXJuYXRlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1lYXN0LWFzaWFuOm5vcm1hbDtmb250LXZhcmlhbnQtbGlnYXR1cmVzOm5vcm1hbDtmb250LXZhcmlhbnQtbnVtZXJpYzpub3JtYWw7Zm9udC12YXJpYW50LXBvc2l0aW9uOm5vcm1hbDtpbmxpbmUtc2l6ZTowO2xpbmUtaGVpZ2h0OjEuMzU7c2hhcGUtaW5zaWRlOnVybCgjcmVjdDI4NTA0KTtzaGFwZS1tYXJnaW46MDtzaGFwZS1wYWRkaW5nOjA7dGV4dC1kZWNvcmF0aW9uLWNvbG9yOiMwMDAwMDA7dGV4dC1kZWNvcmF0aW9uLWxpbmU6bm9uZTt0ZXh0LWRlY29yYXRpb24tc3R5bGU6c29saWQ7dGV4dC1pbmRlbnQ6MDt0ZXh0LW9yaWVudGF0aW9uOm1peGVkO3RleHQtdHJhbnNmb3JtOm5vbmU7d2hpdGUtc3BhY2U6cHJlIiB4bWw6c3BhY2U9InByZXNlcnZlIi8+CiAgPC9nPgogIDxyZWN0IHg9Ii40Njc4OSIgeT0iLjQ2Nzg5IiB3aWR0aD0iMTEuNzY0IiBoZWlnaHQ9IjExLjc2NCIgcng9IjcuNDIxZS0xOCIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudDM0Nzc3KSIgc3Ryb2tlPSJ1cmwoI2xpbmVhckdyYWRpZW50MzQwMTQpIiBzdHJva2Utd2lkdGg9Ii45MzU3OSIvPgogPC9nPgo8L3N2Zz4K
// @downloadURL https://update.greasyfork.org/scripts/467466/Tobacco%20Cinema.user.js
// @updateURL https://update.greasyfork.org/scripts/467466/Tobacco%20Cinema.meta.js
// ==/UserScript==

// TODO
// preferences
// choose to enable ads


var
  jsonData, jsonFile, script, scriptData,
  secondIndexOf, secondLastIndexOf,
  isHLS, resolution, video, videoLink, videoName, frame,
  title, calendar,
  motd, warning;

const
  participants = [],
  vidsLink = [], vidsSize = [];

const deceased = { "people" : [
  { 'pref' : 'Ms.',
    'name' : 'Melissa Kay Sims',
    'exec' : 'Dahlia Sky',
    'year' : '31',
    'date' : 'June 30, 2021',
    //'died' : 'Self-inflicted gunshot wound (suicide)',
    //'luck' : 'to my greatest luck',
    //'kids' : 'a single child', // to my luck, I have gave birth to ...
    //'copy' : 'Brand uses intellectual property',
  },
  { 'pref' : 'Ms.',
    'name' : 'Melissa Kay Sims',
    'exec' : 'Bailey Blue',
    'year' : '31',
    'date' : 'June 30, 2021',
  },
  { 'pref' : 'Ms.',
    'name' : 'Melissa Kay Sims',
    'exec' : 'Buxom',
    'year' : '31',
    'date' : 'June 30, 2021',
  },
  { 'pref' : 'Ms.',
    'name' : 'Melissa Kay Sims',
    'exec' : 'Comely',
    'year' : '31',
    'date' : 'June 30, 2021',
  },
  { 'pref' : 'Ms.',
    'name' : 'Kristina Lisina',
    'exec' : 'Kris the Foxx',
    'year' : '29',
    'date' : 'June 29, 2021',
  },
  { 'pref' : 'Ms.',
    'name' : 'Kristina Lisina',
    'exec' : 'Kristi Fox',
    'year' : '29',
    'date' : 'June 29, 2021',
  },
  { 'pref' : 'Ms.',
    'name' : 'Kristina Lisina',
    'exec' : 'Kristina the Foxx',
    'year' : '29',
    'date' : 'June 29, 2021',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Lauren Kaye Scott',
    'exec' : 'Dakota Doll',
    'year' : '27',
    'date' : 'June 9, 2021',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Lauren Kaye Scott',
    'exec' : 'Dakota Green',
    'year' : '27',
    'date' : 'June 9, 2021',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Lauren Kaye Scott',
    'exec' : 'Koda Skye',
    'year' : '27',
    'date' : 'June 9, 2021',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Lauren Kaye Scott',
    'exec' : 'Kota Skye',
    'year' : '27',
    'date' : 'June 9, 2021',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Lauren Kaye Scott',
    'exec' : 'Dakota Skye',
    'year' : '27',
    'date' : 'June 9, 2021',
  },
  { 'pref' : 'Mr.',
    'name' : 'Jordan Avery Blust',
    'exec' : 'Jordan Ash',
    'year' : '42',
    'date' : 'October 19, 2020',
  },
  { 'pref' : 'Ms.',
    'name' : 'Anastasia Knight',
    'exec' : 'Anastasia Knight',
    'year' : '20',
    'date' : 'August 12, 2020',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Campbell',
    'exec' : 'Zoe Parker',
    'year' : '24',
    'date' : 'September 12, 2020',
  },
  { 'pref' : 'Ms.',
    'name' : 'Jessica Redding',
    'exec' : 'Jessica Jaymes',
    'year' : '40',
    'date' : 'September 17, 2019',
  },
  { 'pref' : 'Ms.',
    'name' : 'Jazmine Nicole Dominguez',
    'exec' : 'Violet Rain',
    'year' : '19',
    'date' : 'March 13, 2019',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Deven Augustina Schuette',
    'exec' : 'Casper',
    'year' : '39',
    'date' : 'August 17, 2018',
  },
  //{ 'pref' : 'Mrs.',
  //  'name' : 'Deven Augustina Schuette',
  //  'exec' : 'Dev',
  //  'year' : '39',
  //  'date' : 'August 17, 2018',
  //},
  { 'pref' : 'Mrs.',
    'name' : 'Deven Augustina Schuette',
    'exec' : 'Devvy',
    'year' : '39',
    'date' : 'August 17, 2018',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Deven Augustina Schuette',
    'exec' : 'Deven Davis',
    'year' : '39',
    'date' : 'August 17, 2018',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Deven Augustina Schuette',
    'exec' : 'Kirstin Thompson',
    'year' : '39',
    'date' : 'August 17, 2018',
  },
  { 'pref' : 'Ms.',
    'name' : 'Lexi Rose Forte',
    'exec' : 'Alexis Forte',
    'year' : '20',
    'date' : 'January 7, 2018',
  },
  { 'pref' : 'Ms.',
    'name' : 'Lexi Rose Forte',
    'exec' : 'Olivia Nova',
    'year' : '20',
    'date' : 'January 7, 2018',
  },
  { 'pref' : 'Ms.',
    'name' : 'Yurizan Beltrán Lebanue',
    'exec' : 'Yurizan Beltran',
    'year' : '31',
    'date' : 'December 13, 2017',
  },
  { 'pref' : 'Ms.',
    'name' : 'Yurizan Beltrán Lebanue',
    'exec' : 'Sweet Yurizan',
    'year' : '31',
    'date' : 'December 13, 2017',
  },
  { 'pref' : 'Ms.',
    'name' : 'Yurizan Beltrán Lebanue',
    'exec' : 'Yuri Love',
    'year' : '31',
    'date' : 'December 13, 2017',
  },
  { 'pref' : 'Ms.',
    'name' : 'Yurizan Beltrán Lebanue',
    'exec' : 'Yurizan',
    'year' : '31',
    'date' : 'December 13, 2017',
  },
  { 'pref' : 'Ms.',
    'name' : 'Mercedes Grabowski',
    'exec' : 'August Ames',
    'year' : '23',
    'date' : 'December 5, 2017',
  },
  { 'pref' : 'Ms.',
    'name' : 'Amanda Friedland',
    'exec' : 'Amanda Auclair',
    'year' : '35',
    'date' : 'November 9, 2017',
  },
  { 'pref' : 'Ms.',
    'name' : 'Amanda Friedland',
    'exec' : 'Shyla Styles',
    'year' : '35',
    'date' : 'November 9, 2017',
  },
  { 'pref' : 'Ms.',
    'name' : 'Amanda Friedland',
    'exec' : 'Shyla Stylez',
    'year' : '35',
    'date' : 'November 9, 2017',
  },
  { 'pref' : 'Ms.',
    'name' : 'Amanda Friedland',
    'exec' : 'Shyla Stylex',
    'year' : '35',
    'date' : 'November 9, 2017',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Malinda Gayle McCready',
    'exec' : 'Mindy McCready',
    'year' : '37',
    'date' : 'February 17, 2013',
  },
  { 'pref' : 'Ms.',
    'name' : 'Kathryn Sue Johnston',
    'exec' : 'Hunter Bryce',
    'year' : '30',
    'date' : 'April 13, 2011',
  },
  { 'pref' : 'Ms.',
    'name' : 'Elena R. Martushev',
    'exec' : 'Anastasia Blue',
    'year' : '28',
    'date' : 'July 19, 2008',
  },
  { 'pref' : 'Ms.',
    'name' : 'Elena R. Martushev',
    'exec' : 'Anesthesia',
    'year' : '28',
    'date' : 'July 19, 2008',
  },
  { 'pref' : 'Ms.',
    'name' : 'Elena R. Martushev',
    'exec' : 'Elena Behm',
    'year' : '28',
    'date' : 'July 19, 2008',
  },
  { 'pref' : 'Ms.',
    'name' : 'Emily Irene Sander',
    'exec' : 'Zoey Zane',
    'year' : '18',
    'date' : 'November 24, 2007',
  },
  { 'pref' : 'Mr.',
    'name' : 'Ben Grey',
    'exec' : 'Kent North',
    'year' : '35',
    'date' : 'July 4, 2007',
  },
  // http://www.mydeathspace.com/article/2006/10/19/Angela_Devi_(30)_committed_suicide_by_Asphyxiation_using_a_plaid_flannel_belt
  // 
  { 'pref' : 'Ms.',
    'name' : 'Angela Shunali Dhingra',
    'exec' : 'Angela Devi',
    'year' : '30',
    'date' : 'March 31, 2006',
  },
  { 'pref' : 'Ms.',
    'name' : 'Angela Shunali Dhingra',
    'exec' : 'Angela Tracy',
    'year' : '30',
    'date' : 'March 31, 2006',
  },
  { 'pref' : 'Mr.',
    'name' : 'Alessandro Caetano Kothenborger',
    'exec' : 'Camilla DeCastro',
    'year' : '26',
    'date' : 'July 26, 2005',
  },
  { 'pref' : 'Mr.',
    'name' : 'Bradford Thomas Wagner',
    'exec' : 'Tim Barnett',
    'year' : '37',
    'date' : 'July 13, 2005',
  },
  { 'pref' : 'Mr.',
    'name' : 'Rex Hickok',
    'exec' : 'Lance Heywood',
    'year' : '40',
    'date' : 'April 28, 2005',
  },
  { 'pref' : 'Mr.',
    'name' : 'Barry Rogers',
    'exec' : 'J.T.',
    'year' : '39',
    'date' : 'November 7, 2004',
  },
  { 'pref' : 'Mr.',
    'name' : 'Barry Rogers',
    'exec' : 'Johnny Rahm',
    'year' : '39',
    'date' : 'November 7, 2004',
  },
  { 'pref' : 'Ms.',
    'name' : 'Natel King',
    'exec' : 'Taylor Sumers',
    'year' : '23',
    'date' : 'February, 2004',
  },
  { 'pref' : 'Ms.',
    'name' : 'Natel King',
    'exec' : 'Taylor Summers',
    'year' : '23',
    'date' : 'February, 2004',
  },
  { 'pref' : 'Ms.',
    'name' : 'Megan Joy Serbian',
    'exec' : 'Naughtia',
    'year' : '22',
    'date' : 'January 7, 2002',
  },
  { 'pref' : 'Ms.',
    'name' : 'Megan Joy Serbian',
    'exec' : 'Naughtia Childs',
    'year' : '22',
    'date' : 'January 7, 2002',
  },
  { 'pref' : 'Ms.',
    'name' : 'Megan Joy Serbian',
    'exec' : 'Naughtie',
    'year' : '22',
    'date' : 'January 7, 2002',
  },
  { 'pref' : 'Ms.',
    'name' : 'Megan Joy Serbian',
    'exec' : 'Naughtie Childs',
    'year' : '22',
    'date' : 'January 7, 2002',
  },
  { 'pref' : 'Mr.',
    'name' : 'Jeffrey James Vickers',
    'exec' : 'Jon Vincent',
    'year' : '39',
    'date' : 'May 3, 2000',
  },
  { 'pref' : 'Mr.',
    'name' : 'William Paul Lawrence',
    'exec' : 'Brad Chase',
    'year' : '29',
    'date' : 'April 19, 2000',
  },
  { 'pref' : 'Mr.',
    'name' : 'William Paul Lawrence',
    'exec' : 'William Hobbs',
    'year' : '29',
    'date' : 'April 19, 2000',
  },
  { 'pref' : 'Mr.',
    'name' : 'Russell Charles McCoy',
    'exec' : 'Kyle McKenna',
    'year' : '31',
    'date' : 'March 14, 2000',
  },
  { 'pref' : 'Mr.',
    'name' : 'Russell Charles McCoy',
    'exec' : 'Russ McCoy',
    'year' : '31',
    'date' : 'March 14, 2000',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Wendy Orleans Williams',
    'exec' : 'Wendy O. Williams',
    'year' : '48',
    'date' : 'April 6, 1998',
  },
  { 'pref' : 'Mr.',
    'name' : 'Rommel Eugene Hunt',
    'exec' : 'Steve Fox',
    'year' : '31',
    'date' : 'October 23, 1997',
  },
  { 'pref' : 'Mr.',
    'name' : 'Christopher John McLaughlin',
    'exec' : 'Christian Fox',
    'year' : '22',
    'date' : 'September 20, 1996',
  },
  { 'pref' : 'Mr.',
    'name' : 'Christopher John McLaughlin',
    'exec' : 'Christopher Cox',
    'year' : '22',
    'date' : 'September 20, 1996',
  },
  { 'pref' : 'Ms.',
    'name' : 'Karen Elizabeth Mereness',
    'exec' : 'Alex Jordan',
    'year' : '31',
    'date' : 'July 2, 1995',
  },
  { 'pref' : 'Mr.',
    'name' : 'Cal Jammer',
    'exec' : 'Randy Layne Potes',
    'year' : '34',
    'date' : 'January 25, 1995',
  },
  // FIXME Accidentally works for any Savannah
  { 'pref' : 'Ms.',
    'name' : 'Shannon Michelle Wilsey',
    'exec' : 'Savannah',
    'year' : '23',
    'date' : 'July 11, 1994',
  },
  { 'pref' : 'Ms.',
    'name' : 'Shannon Michelle Wilsey',
    'exec' : 'Savvy',
    'year' : '23',
    'date' : 'July 11, 1994',
  },
  { 'pref' : 'Mr.',
    'name' : 'Gregory Leslie Patton',
    'exec' : 'Rod Phillips',
    'year' : '32',
    'date' : 'May 24, 1993',
  },
  { 'pref' : 'Mr.',
    'name' : 'Allan Dean Wiebe',
    'exec' : 'Alan Lambert',
    'year' : '25',
    'date' : 'December 20, 1992',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Kelly Jean Van Dyke',
    'exec' : 'Kelly Van Dyke',
    'year' : '33',
    'date' : 'November 17, 1991',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Kelly Jean Van Dyke',
    'exec' : 'Nance Kellee',
    'year' : '33',
    'date' : 'November 17, 1991',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Kelly Jean Van Dyke',
    'exec' : 'Nancee Kellee',
    'year' : '33',
    'date' : 'November 17, 1991',
  },
  { 'pref' : 'Ms.',
    'name' : 'Michelle Marie Schei',
    'exec' : 'Megan Leigh',
    'year' : '26',
    'date' : 'June 16, 1990',
  },
  { 'pref' : 'Mr.',
    'name' : 'John Curtis Holmes',
    'exec' : 'John Holmes',
    'year' : '43',
    'date' : 'March 13, 1988',
  },
  { 'pref' : 'Mr.',
    'name' : 'John Curtis Holmes',
    'exec' : 'Johnny Wadd',
    'year' : '43',
    'date' : 'March 13, 1988',
  },
  { 'pref' : 'Ms.',
    'name' : 'Linda Carol Seki',
    'exec' : 'Linda Ching',
    'year' : '36',
    'date' : 'December 17, 1987',
  },
  { 'pref' : 'Ms.',
    'name' : 'Linda Carol Seki',
    'exec' : 'Linda Wong',
    'year' : '36',
    'date' : 'December 17, 1987',
  },
  { 'pref' : 'Ms.',
    'name' : 'Linda Carol Seki',
    'exec' : 'Sandy Strain',
    'year' : '36',
    'date' : 'December 17, 1987',
  },
  { 'pref' : 'Ms.',
    'name' : 'Colleen Marie Applegate',
    'exec' : 'Jillian Ladd',
    'year' : '20',
    'date' : 'March 21, 1984',
  },
  { 'pref' : 'Ms.',
    'name' : 'Colleen Marie Applegate',
    'exec' : 'Shauna Grant',
    'year' : '20',
    'date' : 'March 21, 1984',
  },
]};
  /*
  { 'name' : '',
    'exec' : '',
    'year' : '',
    'date' : '',
  },
  */

// TODO when finding keyword or title of 18 or 19, select #18 or #19
// TODO when finding ... coach, select sports messages
// TODO when interracial, refer to Muhamad Ali and White men
// TODO instead of "started in the industry" as if it is
// a career or legitimate, find a sentense that manifests
// being a victim led to hell (e.g. subject to atrocities)
const commercial = [
  '👁 [AD] “It took a lot of courage to admit to one of my best friends that I had this problem and thankfully he was very understanding and willing to help.” ~ Covenant Eyes Member|https://www.covenanteyes.com/?promocode=PinkCross',
  '👁 [AD] Porn Is a Human Problem, We Provide a Human Solution. Get CovenantEyes™|https://www.covenanteyes.com/?promocode=PinkCross',
  '👁 [AD] Protect Your Family; Guard Your Heart. Get CovenantEyes™|https://www.covenanteyes.com/?promocode=PinkCross',
  '👁 [AD] CovenantEyes® Keeping families safe on the Web.|https://www.covenanteyes.com/?promocode=PinkCross',
  '👁 [AD] Protect Your Family; Guard Your Heart. get CovenantEyes®|https://www.covenanteyes.com/?promocode=PinkCross',
  '👁 [AD] Get Free. Stay Free. Get CovenantEyes™|https://www.covenanteyes.com/?promocode=PinkCross',
  '👁 [AD] Protect your family on the Internet with CovenantEyes™|https://www.covenanteyes.com/?promocode=PinkCross',
  '👁 [AD] Is your family safe on the Internet? Get CovenantEyes™|https://www.covenanteyes.com/?promocode=PinkCross',
  '👁 [AD] Remove Online Temptation ...with Covenant Eyes|https://www.covenanteyes.com/?promocode=PinkCross',
  '🗽 Defeat Porn. Together. <covenanteyes.com>|https://www.covenanteyes.com/?promocode=PinkCross',
  '💪️ Start the Covenant Eyes challenge to quit porn <covenanteyes.com>|https://www.covenanteyes.com/?promocode=PinkCross',
  '💪️ Take the quit porn challenge <covenanteyes.com>|https://www.covenanteyes.com/?promocode=PinkCross',
  '🗽 Porn consumes you, eh? Take the challenge to quit porn <covenanteyes.com>|https://www.covenanteyes.com/?promocode=PinkCross',
  '🗽 Porn consumes you, eh? Take the challenge to quit porn <strive21.com>|https://www.strive21.com/?promocode=PinkCross',
  '💪️ Start the STRIVE challenge to quit porn. <strive21.com>|https://www.strive21.com/?promocode=PinkCross',
]

const homo = [
  '🤔️ If "gender" is a social construct, why do you need medical procedures to "confirm" it?|https://farside.link/nitter/JosephSciambra/status/1626066353923981317',
  '👬 Gays Against Groomers is a coalition of gay people who oppose the recent trend of indoctrinating and sexualizing children under the guise of “LGBTQIA+” <GaysAgainstGroomers.com>|https://www.gaysagainstgroomers.com/?ref=tc',
  '👬 Gays Against Groomers <GaysAgainstGroomers.com>|https://farside.link/nitter/againstgrmrs',
  '🤵 [READ] I Was the Other Man: An Insider’s Look at Why Gay Marriage Will Never Work|https://www.churchmilitant.com/news/article/i-was-the-other-man-an-insiders-look-at-why-gay-marriage-will-never-work',
  '🧑‍⚕️ FACT: The only reason the medical industry encourages children to transition is because it creates pharmaceutical customers for life|https://farside.link/nitter/againstgrmrs/status/1626091866058895361',
  '🩺 FACT: The only reason the medical industry encourages children to transition is because it creates pharmaceutical customers for life|https://farside.link/nitter/againstgrmrs/status/1626091866058895361',
  '👪 FACT: The only reason the medical industry encourages children to transition is because it creates pharmaceutical customers for life|https://farside.link/nitter/againstgrmrs/status/1626091866058895361',
  '🤻 Gays Against Groomers <GaysAgainstGroomers.com>|https://www.gaysagainstgroomers.com/?ref=tc',
  '👬 Gays Against Groomers <GaysAgainstGroomers.com>|https://www.gaysagainstgroomers.com/?ref=tc',
  '👬 [READ] Jesus Loves You|https://josephsciambra.com/jesus-loves-gay-men/',
  '👬 Jesus Loves You - Joseph Sciambra|https://josephsciambra.com/jesus-loves-gay-men/',
  '🏳️‍🌈⃠ YOU ARE NOT A HOMOSEXUAL! You are a son of a king, so snap out of it already!',
  '☦ Sons of St. Joseph <SonsofSaintJoseph.com>|http://www.sonsofsaintjoseph.com/?ref=tc',
  '☦ Sons of St. Joseph <JosephSciambra.com>|https://josephsciambra.com/?ref=tc',
]

const promotion = [
  '➕ 10 Pornstars Who Gave Their Life to Christ After Years Of Living In Sin|https://listwand.com/10-pornstars-who-gave-their-life-to-christ-after-years-of-living-in-sin/',
  '🫵 Addicted? Seek help here.|https://read.easypeasymethod.org/',
  '🫵 [READ] EasyPeasy|https://read.easypeasymethod.org/',
  '🫵 Use XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '🫵 I want you to get XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '🫵 Get Jabber <xmpp.org>|https://xmpp.org/software/clients/',
  '💡 Get Jabber <xmpp.org>|https://xmpp.org/software/clients/',
  '🫵 Get XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '🦋 Get XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '🪽 Get XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '🗣️ Start using XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '🫵 Start using XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '💡 Let’s get it on with Jabber <xmpp.org>|https://xmpp.org/software/clients/',
  '😉 Let’s get it on with XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '☎️ Are you looking for a private instant messaging system? <xmpp.org>|https://xmpp.org/software/clients/',
  '🧐️ Are you looking for a discreet telecom system? <xmpp.org>|https://xmpp.org/software/clients/',
  '🧐️ Are you looking for a discreet VoIP system? <xmpp.org>|https://xmpp.org/software/clients/',
  '🧐️ Are you looking for a discreet voip system? <xmpp.org>|https://xmpp.org/software/clients/',
  '🧐️ Are you looking for a discreet instant messaging system? <xmpp.org>|https://xmpp.org/software/clients/',
  '🧐️ Are you looking for a private instant messaging system? <xmpp.org>|https://xmpp.org/software/clients/',
  '🙊 The private instant messaging system they don’t want you to know about <xmpp.org>|https://xmpp.org/software/clients/',
  '🏛️ The private instant messaging system the government doesn’t want you to know about <xmpp.org>|https://xmpp.org/software/clients/',
  '🧑🏽‍⚖️ The private instant messaging system the judges don’t want you to know about <xmpp.org>|https://xmpp.org/software/clients/',
  '👮 The private instant messaging system the police doesn’t want you to know about <xmpp.org>|https://xmpp.org/software/clients/',
  '🏴‍☠️ The Pirate Bay <thepiratebay.org>|https://thepiratebay.org/',
  '🏴‍☠️ Long Live The Pirate Bay! <thepiratebay.org>|https://thepiratebay.org/',
  '🏴‍☠️ Long Live The Pirate Bay! <tpb.party>|https://tpb.party/',
  '🙊 Looking for a private instant messaging system? <xmpp.org>|https://xmpp.org/software/clients/',
  '🤔️ Looking for a private instant messaging system? <xmpp.org>|https://xmpp.org/software/clients/',
  '🫵 Connect to XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '💬 Get Jabber/XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '💬 The most secure instant messaging system <xmpp.org>|https://xmpp.org/software/clients/',
  '🏫 IFERS <ifers.123.st>|https://ifers.forumotion.com/',
  '🏫 IFERS - Exposing the ’Global’ Conspiracy From Atlantis to Zion|https://ifers.forumotion.com/',
  '🏫 IFERS - The International Flat Earth Research Society|https://ifers.forumotion.com/',
  '☮ [LISTEN] Bott Radio Network|https://bottradionetwork.com/audio-player/?ref=tc',
  '✝ [LISTEN] Bott Radio Network|https://bottradionetwork.com/audio-player/?ref=tc',
  '♱ [LISTEN] Bott Radio Network - Getting the Word of God into the People of God|https://bottradionetwork.com/audio-player/?ref=tc',
  '🎙 [LISTEN] Bott Radio Network|https://bottradionetwork.com/audio-player/?ref=tc',
  '📚 [READ] What do you mean the earth is shaped like a pizza?!!|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] Did you say earth is not spining?!!|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] Did you say earth is not a spining fireball?!!|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] Did you say earth is not a ball?!!|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] Did you say earth is horizontal?!!|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] Did you say earth is shaped like a disc?!!|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] Did you know earth is horizontal? (i.e. earth is flat)|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] WTF earth is shaped like a pizza?!!|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] 108 books on “Is earth a pizza?”|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] 108 Earthly Books|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] 108 Horizontal Earth Books|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  'ᛋᛋ [WATCH] Think Different|magnet:?xt=urn:btih:bc0b911654e2795536370f8cae59d123db4b95b4&dn=The%20Greatest%20Story%20Never%20Told',
  '卐 [WATCH] Think Different|magnet:?xt=urn:btih:bc0b911654e2795536370f8cae59d123db4b95b4&dn=The%20Greatest%20Story%20Never%20Told',
  '🪖 [WATCH] The Greatest Story NEVER Told!|https://webtor.io/#/show?file=TGSNTtvPart01.mp4&pwd=%2FThe%20Greatest%20Story%20Never%20Told&magnet=magnet%3A%3Fxt%3Durn%3Abtih%3Abc0b911654e2795536370f8cae59d123db4b95b4%26dn%3DThe%2BGreatest%2BStory%2BNever%2BTold%26tr%3Dudp%253A%252F%252Ftracker.coppersurfer.tk%253A6969%252Fannounce%26tr%3Dudp%253A%252F%252Ftracker.openbittorrent.com%253A6969%252Fannounce%26tr%3Dudp%253A%252F%252F9.rarbg.to%253A2710%252Fannounce%26tr%3Dudp%253A%252F%252F9.rarbg.me%253A2780%252Fannounce%26tr%3Dudp%253A%252F%252F9.rarbg.to%253A2730%252Fannounce%26tr%3Dudp%253A%252F%252Ftracker.opentrackr.org%253A1337%26tr%3Dhttp%253A%252F%252Fp4p.arenabg.com%253A1337%252Fannounce%26tr%3Dudp%253A%252F%252Ftracker.torrent.eu.org%253A451%252Fannounce%26tr%3Dudp%253A%252F%252Ftracker.tiny-vps.com%253A6969%252Fannounce%26tr%3Dudp%253A%252F%252Fopen.stealth.si%253A80%252Fannounce',
  '✊ [WATCH] The Greatest Story Never Told|magnet:?xt=urn:btih:bc0b911654e2795536370f8cae59d123db4b95b4&dn=The%20Greatest%20Story%20Never%20Told',
  '🗺️ [WATCH] Happy Earth Day|magnet:?xt=urn:btih:edaa17296268eb6f6b209faa7ff55346e17351a0&dn=Happy%20Flat%20Earth%20Day%20Documentary%20Pack',
  '🚫️💰️ Abolish usury',
  '🚫️🏦 Abolish usury',
  '📉 Abolish usury',
  '📚 Anna’s Archive <annas-archive.org>|https://annas-archive.org/',
  '📚 When was the last time you’ve read a good book? <annas-archive.org>|https://annas-archive.org/',
  '🏦 END THE FED!',
  '🚫️🏦 END THE FED!',
  '🏦 END THE FED',
  '🧠 The word ”Government” actually means “Mind Control”. “guvernare“ means “to control” and “mentis“ means “mind”.',
  '🏫 Fuck School!',
  '🏫 Fuck School',
  '🏫 Fuck Indoctrination!',
  '🚫️🏫 Fuck School!',
  '🏫 If you already know reading, writing and arithmetic, then it’s time for you to leave school. #fuckschool',
  '🏫 If you already know reading, writing and arithmetic, then it’s time for you to leave school. #ignoreschool',
  '🏫 If you know reading, writing and arithmetic, then it’s time for you to leave school. #fuckschool',
  '🏫 If you know reading, writing and arithmetic, then it’s time for you to leave school. #ignoreschool',
  '🏫 If you know how to read and math, then it’s time for you to leave school. #fuckschool',
  '🏫 If you know how to read and math, then it’s time for you to leave school. #ignoreschool',
  '🏫 If your children know reading, writing and arithmetic, then it’s time for them to leave school. #ignoreschool',
  '🏫 If your children know reading, writing and arithmetic, then it’s time for you to get them out of school. #ignoreschool',
  '👨‍🏫️ Alliance Defending Freedom #join #adf|https://adflegal.org/',
  '👨‍🏫️ We Are Hiring! #adf|https://adflegal.org/about-us/careers',
  '👨‍🏫️ ADF Is Hiring! #adf|https://adflegal.org/about-us/careers',
  '☯ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '◭ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '▢ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '◐ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '◓ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '▣ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '□ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '△ “It’s not about the shape, it’s about the lie; and it’s about the paradigm shift of exposing the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '▲ “It’s not about the shape, it’s about the lie; and it’s about the paradigm shift of exposing the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '➠ “It’s not about the shape, it’s about the lie; and it’s about the paradigm shift of exposing the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🔁 “It’s not about the shape, it’s about the lie; and it’s about the paradigm shift of exposing the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '♻️ “It’s not about the shape, it’s about the lie; and it’s about the paradigm shift of exposing the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '♲ “It’s not about the shape, it’s about the lie; and it’s about the paradigm shift of exposing the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🌐 “It’s not about the shape of the earth, it’s about the lie. It’s about realizing that you’ve been lied to about something so fundamental for so long.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🌐 “It’s not about the shape of the earth, it’s about the lie. It’s about realizing that you’ve been lied to about something so fundamental for so long.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '👶👦👧 “SCREW CHILDREN! That’s the mantra of the world. Instead of burying them with a national debt, shoving them in shitty schools, drugging them if they don’t comply, hitting them, yelling at them, indoctrinating them with religion and statism and patriotism and military worship, what if we just did what was right for them? The whole world is built on “screw children”, and if we changed that, this would be an alien world to us.” -- Stefan Molyneux #ignoreschool',
  //'👶👦👧 “SCREW CHILDREN! That’s the mantra of the world. Instead of burying them with a national debt, shoving them in shitty schools, drugging them if they don’t comply, hitting them, yelling at them, indoctrinating them with religion and statism and patriotism and military worship, what if we just did what was right for them? The whole world is built on “screw children”, and if we changed that, this would be an alien plane(t) to us.” -- Stefan Molyneux #ignoreschool',
  '💔 “Deep pockets and empty hearts rule the world. We unleash them at our peril.” -- Stefan Molyneux #ignoreschool',
  '☀️ “There is nothing that is going to make people hate you more, and love you more, than telling the truth.” -- Stefan Molyneux',
  '☀️ “Mental anguish always results from the avoidance of legitimate suffering.” -- Stefan Molyneux',
  '☀️ “Those who make conversations impossible, make escalation inevitable.” -- Stefan Molyneux',
  '☀️ “As the old saying went in the Soviet Union, “They pretend to pay us, and we pretend to work.” -- Stefan Molyneux',
  '☀️ “Remember: If a hypothesis cannot possibly be disproved, it can be irrefutably dismissed.” -- Stefan Molyneux',
  '☀️ “The only part of you that hurts when you are given the truth is the part that lives on lies.” -- Stefan Molyneux',
  '🎙️ [LISTEN] Freedomain with Stefan Molyneux|https://fdrpodcasts.com/?ref=tc',
  '🎙️ [LISTEN] Freedomain Podcast|https://fdrpodcasts.com/?ref=tc',
  '📻 [LISTEN] Freedomain Radio|https://fdrpodcasts.com/?ref=tc',
  '👨‍🏫️ [LISTEN] Freedomain|https://freedomain.com/?ref=tc',
  '👨‍🏫️ Freedomain: Essential Philosophy|https://freedomain.com/?ref=tc',
  '💰️ Act against to central banking!',
  '💰️ Say no to central banking!',
  '☀️ Godsend',
  '☀️ Black Suɲ',
  '☀️ God Bless',
  '☀️ May God bless You and Your loved ones',
  '⚡ Leaked Pornhub Emails Show Shocking Policies!|https://endsexualexploitation.org/articles/leaked-pornhub-emails-show-shocking-policies/',
  '🎃 The Halloween Documents|http://catb.org/~esr/halloween/',
  '🎃 [READ] The Halloween Documents|http://catb.org/~esr/halloween/',
  '🎃 The Halloween Documents. What Silicon Valley doesn’t want you to know...|http://catb.org/~esr/halloween/',
  '🎃 [READ] The cables that Silicon Valley doesn’t want you to see...|http://catb.org/~esr/halloween/',
  '🎃 [READ] The memorandums that Silicon Valley doesn’t want you to read...|http://catb.org/~esr/halloween/',
  '🎃 [READ] The memos that Silicon Valley doesn’t want you to see...|http://catb.org/~esr/halloween/',
  '🎃 [READ] The protocols that Silicon Valley doesn’t want you to read...|http://catb.org/~esr/halloween/',
  '🎃 [READ] The documents that Silicon Valley doesn’t want you to read...|http://catb.org/~esr/halloween/',
  '🎃 [READ] What Silicon Valley doesn’t want you to know...|http://catb.org/~esr/halloween/',
  '🏢 Leaked Silicon Valley memo outlines anti-Software strategy|http://www.theregister.co.uk/981103-000001.html',
  '🏢 Leaked Silicon Valley memo outlines anti-Open Source strategy|http://www.theregister.co.uk/981103-000001.html',
  '🏢 Leaked Silicon Valley memo outlines anti-Linux strategy|http://www.theregister.co.uk/981103-000001.html',
  '🛩️ STOP SPRAYING US! <ActualActivists.com>|https://actualactivists.com/?ref=tc',
  '✈️ STOP SPRAYING US! <StopSprayingUs.com>|http://www.stopsprayingus.com/?ref=tc',
  '🛩️ Stop Spraying Us! <StopSprayingUs.com>|http://www.stopsprayingus.com/?ref=tc',
  '✈️ STOP SPRAYING US! <ClimateChangeAgenda.com>|http://climatechangeagenda.com/?ref=tc',
  '⛅ Our Weather Is Controlled <ClimateChangeAgenda.com>|http://climatechangeagenda.com/?ref=tc',
  '🌫 Our Weather Is Controlled <ClimateChangeAgenda.com>|http://climatechangeagenda.com/?ref=tc',
  //'🌫 STOP SPRAYING US! <ByeByeBlueSky.com.com>|http://byebyebluesky.com/?ref=tc',
  '🧟‍♂️ [WATCH] FrankenSkies (2017)|magnet:?xt=urn:btih:418546e67fcde04a5ad914d63bdcea09cadd0012&dn=FrankenSkies%20-%20Chemtrails-Geoengineering%20Documentary%20720p%20%282017%29%20-%20roflcopter2110',
  '🧟‍♀ [WATCH] FrankenSkies (2017)|magnet:?xt=urn:btih:418546e67fcde04a5ad914d63bdcea09cadd0012&dn=FrankenSkies%20-%20Chemtrails-Geoengineering%20Documentary%20720p%20%282017%29%20-%20roflcopter2110',
  '🧟 [WATCH] FrankenSkies (2017)|magnet:?xt=urn:btih:418546e67fcde04a5ad914d63bdcea09cadd0012&dn=FrankenSkies%20-%20Chemtrails-Geoengineering%20Documentary%20720p%20%282017%29%20-%20roflcopter2110',
  '☠️ [WATCH] FrankenSkies - Chemtrails & Geoengineering Documentary|magnet:?xt=urn:btih:418546e67fcde04a5ad914d63bdcea09cadd0012&dn=FrankenSkies%20-%20Chemtrails-Geoengineering%20Documentary%20720p%20%282017%29%20-%20roflcopter2110',
  '🔩 [WATCH] FrankenSkies - Geoengineering Documentary|magnet:?xt=urn:btih:418546e67fcde04a5ad914d63bdcea09cadd0012&dn=FrankenSkies%20-%20Chemtrails-Geoengineering%20Documentary%20720p%20%282017%29%20-%20roflcopter2110',
  '⚡️ [WATCH] FrankenSkies (2017)|magnet:?xt=urn:btih:418546e67fcde04a5ad914d63bdcea09cadd0012&dn=FrankenSkies%20-%20Chemtrails-Geoengineering%20Documentary%20720p%20%282017%29%20-%20roflcopter2110',
  '🧬 [WATCH] FrankenSkies (2017)|magnet:?xt=urn:btih:418546e67fcde04a5ad914d63bdcea09cadd0012&dn=FrankenSkies%20-%20Chemtrails-Geoengineering%20Documentary%20720p%20%282017%29%20-%20roflcopter2110',
  '🎞️ [WATCH] FrankenSkies - Chemtrails Documentary|magnet:?xt=urn:btih:418546e67fcde04a5ad914d63bdcea09cadd0012&dn=FrankenSkies%20-%20Chemtrails-Geoengineering%20Documentary%20720p%20%282017%29%20-%20roflcopter2110',
  '☦ Sons of St. Joseph <SonsofSaintJoseph.com>|http://www.sonsofsaintjoseph.com/?ref=tc',
  '☦ Sons of St. Joseph <JosephSciambra.com>|https://josephsciambra.com/?ref=tc',
  '🗽 [WATCH] YOUR GUIDE TO 5TH-GENERATION WARFARE|https://www.corbettreport.com/5thgen/',
  '✚ Pink Cross Foundation|https://farside.link/nitter/pinkcrossfound',
  '✚ Pink Cross Foundation|https://pinkcross.org.au/?ref=tc',
  '✚ Pink Cross Foundation <pinkcross.org.au>|https://pinkcross.org.au/?ref=tc',
  '🎤 Voice of Change <voicesofchange.net>|http://www.voicesofchange.net/?ref=tc',
  '🏥 Real Change in Sexual Feelings Through Therapy that Works! <voicesofchange.net>|http://www.voicesofchange.net/?ref=tc',
  //'📶 STOP 5G | Stay connected but protected|https://signstop5g.eu/', // globe propaganda
  '📶 Stop 5G (CZ)|https://stop5g.cz/us/',
  '📶 Stop 5G Global|https://stop5gglobal.org/', // globe propaganda?
  '📶 Stop 5G Together Illinois|https://stop5gtogetherillinois.com/',
  '📶 Stránka nenalezena - Stop 5G|https://stop5g.cz/',
  '📶 STOP 5G NOW|https://stop5gnow.com/',
  '📶 STOP 5G (UK)|https://stop5g.co.uk/',
  '⚖️ A Judicial Review to STOP a 5G MAST in Bluebell|https://www.gofundme.com/f/a-judicial-review-to-stop-a-5g-mast-in-bluebell',
  '🧑‍⚖️ A Judicial Review to STOP a 5G MAST in Bluebell|https://www.gofundme.com/f/a-judicial-review-to-stop-a-5g-mast-in-bluebell',
  '📱 STOP 5G - An Emergency Appeal to the World’s Governments by Scientists, Doctors, Environmental Organizations and Others|https://www.5gspaceappeal.org/',
  '📝 Petition: Stop 5G in Sarasota County|https://www.change.org/p/dept-of-health-sarasota-environmental-health-services-stop-5g-in-sarasota-county',
  '✒️ Petition: Stop 5G in Sarasota County|https://www.change.org/p/dept-of-health-sarasota-environmental-health-services-stop-5g-in-sarasota-county',
  '☣️ Electromagnetic Radiation Safety|https://www.saferemr.com/',
  '📡 How to oppose 5G “small cell” towers|http://emfsafetynetwork.org/how-to-oppose-small-cell-5g-towers/',
  '📡 How to Protect Yourself from 5G Radiation|https://www.irda.org/5g-radiation',
  '📡 How to Stop 5G: Worldwide Opposition to 5G Technology|https://www.shieldyourbody.com/stop-5g/',
  '📡 10 ACTIONS TO HELP STOP 5G|http://www.electrosmogprevention.org/stop-5g-action-plan/10-actions-to-help-stop-5g/',
  '🇺🇳 STOP!! SDGs|https://stopsdgs.076.moe/',
  '🪖 Don’t join the military!',
  '🚫️🎖️ Fuck the army!',
  '🚫️🏵️ Fuck the military!',
  '🚫️🏶 Fuck the military!',
  '🚫️🇺🇳 Abolish the UN!',
  '🚫️🇺🇳 Boycott the UN!',
  '🤵‍♀️ Mami’s Shit',
  '🤵 Mami’s Shit',
  '💩 Mami’s Shit',
  '🤔 Mami’s Shit',
  '🏆 Mami’s Shit',
  '➠ Oracle Broadcasting Network',
  '➠ Oracle Broadcasting Network. The home of cutting edge talk radio',
  '➠ Oracle Broadcasting Radio Network. The home of cutting edge talk radio',
  '➠ Oracle Broadcasting Radio Network. The Home Of Cutting Edge Talk Radio',
  '🚪 Knock! Knock! Mr. Logers... Lee Rogers, we think you gave up too soon, yet we sense it is not over yet. OBN... Long live the revolution! (everything is broken... ta na na na...)',
  '🚪 Knock! Knock! Mr. Cohen... Doug Owen, we think you gave up too soon, yet we sense it is not over yet. OBN... Long live the revolution! (everything is broken... ta na na na...)',
  '📰 Black Listed News|https://www.blacklistednews.com/',
  //'📻 Black Listed Radio|https://www.blacklistedradio.com/',
  '🚫️🇺🇳 Abolish the United Nations!',
  '🥕 Produce food, not war <foodnotbombs.net>|http://foodnotbombs.net/',
  '🥕 Food Not Bombs <foodnotbombs.net>|http://foodnotbombs.net/',
  '✊ Food Not Bombs <foodnotbombs.net>|http://foodnotbombs.net/',
  '👨‍🌾 [VISIT] Open Source Ecology|https://opensourceecology.org/',
  '👩‍🌾 [VISIT] Open Source Ecology|https://opensourceecology.org/',
  '🚜 [VISIT] Open Source Ecology|https://opensourceecology.org/',
  '🛞 [VISIT] Open Source Ecology|https://opensourceecology.org/',
  '⚙️ [VISIT] Open Source Ecology|https://opensourceecology.org/',
  '👪 [AD] Helping to Preserve Family Values <familysafe.com>|https://www.familysafe.com/?ref=tc',
  '👪 [AD] Family Safe: Helping to Preserve Family Values <familysafe.com>|https://www.familysafe.com/?ref=tc',
  '🐺️ [APP] Get LibreWolf|https://librewolf.net',
  '🦦 [APP] Otter Browser. Controlled by the user, not vice versa|https://otter-browser.org/?ref=tc',
  '🦁 [APP] 4 Reasons To Ditch Your Browser and Use Brave (and yes, one of them is Bitcoin)|https://thetinhat.com/blog/thoughts/brave-browser.html?ref=tc',
  '🦁 [APP] Reclaim Your Web. Get Brave|https://brave.com/?ref=tc',
  '🦁 [APP] Take Back Your Privacy. Get Brave|https://brave.com/?ref=tc',
  '🦁 [APP] Restore Privacy. Get Brave|https://brave.com/?ref=tc',
  '🦁 [APP] Take Back Your Web. Get Brave|https://brave.com/?ref=tc',
  '🦁 [APP] Get Brave|https://brave.com/?ref=tc',
  '🐧️ MX Linux <mxlinux.org>|https://mxlinux.org/?ref=tc',
  '🦁 [APP] Get Brave Browser|https://brave.com/?ref=tc',
  '🕴️ [APP] Get Tribler P2P|https://tribler.org/?ref=tc',
  '🈸 [APP] Get Tribler P2P|https://tribler.org/?ref=tc',
  '🧡️ [APP] Get Tribler P2P|https://tribler.org/?ref=tc',
  '🕊️ [APP] Get Tribler P2P|https://tribler.org/?ref=tc',
  '🕴️ [APP] Get Tribler BitTorrent|https://tribler.org/?ref=tc',
  '🈸 [APP] Get Tribler BitTorrent|https://tribler.org/?ref=tc',
  '🧡️ [APP] Get Tribler BitTorrent|https://tribler.org/?ref=tc',
  '🕊️ [APP] Get Tribler BitTorrent|https://tribler.org/?ref=tc',
  '🕴️ [APP] Get Tribler BitTorrent P2P|https://tribler.org/?ref=tc',
  '🈸 [APP] Get Tribler BitTorrent P2P|https://tribler.org/?ref=tc',
  '🧡️ [APP] Get Tribler BitTorrent P2P|https://tribler.org/?ref=tc',
  '🕊️ [APP] Get Tribler BitTorrent P2P|https://tribler.org/?ref=tc',
  '🕴️ [APP] Get Tribler P2P BitTorrent|https://tribler.org/?ref=tc',
  '🈸 [APP] Get Tribler P2P BitTorrent|https://tribler.org/?ref=tc',
  '🧡️ [APP] Get Tribler P2P BitTorrent|https://tribler.org/?ref=tc',
  '🕊️ [APP] Get Tribler P2P BitTorrent|https://tribler.org/?ref=tc',
  '🐧️ [APP] Get MX Linux|https://mxlinux.org/?ref=tc',
  '🐧️ Get MX Linux (even for old PCs) <mxlinux.org>|https://mxlinux.org/?ref=tc',
  '🐧️ Get MX Linux OS for free (old and new PCs) <mxlinux.org>|https://mxlinux.org/?ref=tc',
  '🐧️ Say “hello” to a better operating system for your PC <mxlinux.org>|https://mxlinux.org/?ref=tc',
  '🐧️ Get MX Linux for free. Say “hello” to a better operating system for your PC <mxlinux.org>|https://mxlinux.org/?ref=tc',
  '🔁 [APP] Your Data, Yours Only.|https://www.etesync.com/?ref=tc',
  '🌀️ [APP] Get Ungoogled-Chromium|https://github.com/ungoogled-software/ungoogled-chromium',
  '🦊️ (fire)Fox in Pythagorean Numerology is 666. Set yourself free. Get LibreWolf.|https://librewolf.net',
  '🦊️ (fire)Fox in Pythagorean Numerology is 666. Drop Firebeast. Get LibreWolf.|https://librewolf.net',
  '🐺 Firefox? Are you kidding? Get LibreWolf.|https://librewolf.net',
  '🦁 Firefox? Are you kidding? Get Brave.|https://brave.com/?ref=tc',
  '🦁 Firefox has no privacy, just pseudo-privacy. Get Brave, for true privacy.|https://brave.com/?ref=tc',
  '🦁 Firefox has no privacy, it has pseudo-privacy. Get Brave, for true privacy.|https://brave.com/?ref=tc',
  '🐺 Firefox has no privacy, just pseudo-privacy. Get LibreWolf, for true privacy.|https://librewolf.net',
  '🐺 Firefox has no privacy, it has pseudo-privacy. Get LibreWolf, for true privacy.|https://librewolf.net',
  '🧑‍⚕️ Free or cheap Energy & Transport conspiracy|http://whale.to/b/free_energy_h.html',
  '🚰 Say NO to Fluoridation <fluoridealert.org>|https://fluoridealert.org/?ref=tc',
  '💧 Act AGAINST water Fluoridation <fluoridealert.org>|https://fluoridealert.org/?ref=tc',
  '💧 Resist water Fluoridation <fluoridealert.org>|https://fluoridealert.org/?ref=tc',
  '🚰 Fluoride Action Network - Broadening Public Awareness on Fluoride. <fluoridealert.org>|https://fluoridealert.org/?ref=tc',
  '⛲ Fluoride Action Network <fluoridealert.org>|https://fluoridealert.org/?ref=tc',
  '🇺🇦 Support Ukraine',
  '🇷🇺 Support Russia',
  '🫵 Support You',
  '⛅ Heaven and Earth 🌙|https://annas-archive.org/md5/f766821578c71af2105bdb6f2cd9803a',
  '⛅ [BOOK] Heaven and Earth 🌙|https://annas-archive.org/md5/f766821578c71af2105bdb6f2cd9803a',
  '⛅ [BOOK] Heaven and Earth by Gabrielle Henriet 🌙|https://annas-archive.org/md5/f766821578c71af2105bdb6f2cd9803a',
  '⛅ [BOOK] Heaven and Earth by Gabrielle Henriet 🌙|ipfs://bafykbzacedcvoo4hpstmfkvancm5ylqtbn3vse6kdsyh3h4ioc5ubk2kl5od6',
  '👨‍🔬 You’ve got me Eric -- Albert Einstein <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '👨‍🔬 You’ve got me Eric -- Albert Einstein <atlanteanconspiracy.com>|http://www.atlanteanconspiracy.com/?ref=tc',
  '🧑‍🔬 You’ve got me Eric -- Albert Einstein on Eric Dubay <atlanteanconspiracy.com>|http://www.atlanteanconspiracy.com/?ref=tc',
  '🌄 Eric Dubay <atlanteanconspiracy.com>|http://www.atlanteanconspiracy.com/?ref=tc',
  '🌅 Eric Dubay <atlanteanconspiracy.com>|http://www.atlanteanconspiracy.com/?ref=tc',
  '🧑‍🔬 Eric Dubay <atlanteanconspiracy.com>|http://www.atlanteanconspiracy.com/?ref=tc',
  '🧑‍🔬 True science with Eric <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '🗽 Eric Dubay <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '🧘 Eric Dubay <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '🌞 Eric Dubay <atlanteanconspiracy.com>|http://www.atlanteanconspiracy.com/?ref=tc',
  '🧘 DGHF <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '🧘 Do Good. Have Fun. <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '😎 DGHF. Eric Dubay. <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '😎 Do Good. Have Fun. Eric Dubay. <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '😎 EricDubay.com – Do Good, Have Fun. <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '😎 Eric Dubay. Do Good. Have Fun. <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '🏝️ Eric Dubay <atlanteanconspiracy.com>|http://www.atlanteanconspiracy.com/?ref=tc',
]

const widsom = [
  '🏌️ “A slave is one who waits for someone to come and free him.” --Ezra Pound',
  '🏌️ “Free Men Are Not Equal” and “Equal Men Are Not Free.” --William Luther Pierce',
  '🏌️ “We like to watch what’s happening around us, but we don’t like to participate, we don’t like to get involved; that’s why I hate spectators’ force, and have great contempt for sports fans.” --William Luther Pierce',
  '👴🏻 “We like to watch what’s happening around us, but we don’t like to participate, we don’t like to get involved; that’s why I hate spectators’ force, and have great contempt for sports fans.” --William Luther Pierce',
  '🧑🏻‍🏫 “We like to watch what’s happening around us, but we don’t like to participate, we don’t like to get involved; sitting on your couch and watching other people do things, isn’t healthy.” --William Luther Pierce',
  '🧑🏻‍🏫 “Sitting on your couch and watching other people do things, isn’t healthy.” --William Luther Pierce',
  '🛋️ “Sitting on your couch and watching other people do things, isn’t healthy.” --William Luther Pierce',
  '🛋️‍⃠ “Sitting on your couch and watching other people do things, isn’t healthy.” --William Luther Pierce',
  '🚫️👮 Fuck teh Police!',
  '🚫️🚔 Fuck teh Police!',
  '🚫️🚨 Fuck teh Police!',
  '🚫️👮 Fuck the Police!',
  '🚫️🚔 Fuck the Police!',
  '🚫️🚨 Fuck the Police!',
  '🗣️ Call him Mister Vain...',
  '🗣️ Call him Mr. Vain...',
  '📞 Calling Mr. Vain...',
  '🛰️ Satellites are hoax!',
  '🪖 The war on terror is a hoax!',
  '📺 Disconnect from cable and "satellite" TV',
  '👨‍🌾 Grow your own food',
  '👨‍🌾 Buy your food from a local farmer',
  '👨‍🌾 Buy food from a local farmer',
  '👩‍🌾 Buy your food from your local farmer',
  '🚜 Buy food from your local farmer',
  '🎞️ [WATCH] They Live (1988)|magnet:?xt=urn:btih:A2A67F4CF35C0FA4D2BC78B9CEB89F6AB2F9D69F&tr=udp%3A%2F%2Fwww.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2F9.rarbg.com%3A2920%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&dn=They+Live+(1988)+%5B790MB%5D',
  '🎞️ [WATCH] They Live, We Sleep|magnet:?xt=urn:btih:A2A67F4CF35C0FA4D2BC78B9CEB89F6AB2F9D69F&tr=udp%3A%2F%2Fwww.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2F9.rarbg.com%3A2920%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&dn=They+Live+(1988)+%5B790MB%5D',
  '🎞️ [WATCH] They Live, We Sleep|https://webtor.io/#/show?file=They.Live.1988.720p.BluRay.x264.YIFY.mp4&pwd=%2FThey%20Live%20%281988%29&magnet=magnet%3A%3Fxt%3Durn%3Abtih%3Aa2a67f4cf35c0fa4d2bc78b9ceb89f6ab2f9d69f%26dn%3DThey%2BLive%2B%281988%29%26tr%3Dudp%253A%252F%252Fopen.demonii.com%253A1337%26tr%3Dudp%253A%252F%252Ftracker.coppersurfer.tk%253A6969%26tr%3Dudp%253A%252F%252Ftracker.leechers-paradise.org%253A6969%26tr%3Dudp%253A%252F%252Ftracker.pomf.se%253A80%26tr%3Dudp%253A%252F%252Ftracker.publicbt.com%253A80%26tr%3Dudp%253A%252F%252Ftracker.openbittorrent.com%253A80%26tr%3Dudp%253A%252F%252Ftracker.istole.it%253A80',
  '💀 THEY LIVE, WE SLEEP',
  '💀 They Live, We Sleep',
  '👺 They Live, We Sleep',
  '🎭 They Live, We Sleep',
  '☣ They Live, We Sleep',
  '☠ They Live, We Sleep',
  '😴 They Live, We Sleep',
  '🛌 They Live, We Sleep',
  '💤 They Live, We Sleep',
  '🤖 They Live, We Sleep',
  '🌴 “The best time to plant a tree was 20 years ago. The second best time is now.” -- Chinese Proverb',
  '🌲 “The best time to plant a tree was 20 years ago. The second best time is now.” -- Chinese Proverb',
  '🌳 “The best time to plant a tree was 20 years ago. The second best time is now.” -- Chinese Proverb',
  '🔌 “Almost everything will work again if you unplug it for a few minutes, including you.” -- Anne Lamott',
  '☕ Be mindful when drinking tea. Taking a mindful tea break is a powerful way to stop the racing mind and come to the present moment. Make a tea and as you drink it bring your attention fully to the experience by tuning into your senses. Feel the warmth of the cup in your hands, taste the tea with each sip, notice the sounds around you. When you feel your mind wandering, let go of thoughts and come back to the sensation of the warmth of the tea cup in your hands.',
  '🍵 Be mindful when drinking tea. Taking a mindful tea break is a powerful way to stop the racing mind and come to the present moment. Make a tea and as you drink it bring your attention fully to the experience by tuning into your senses. Feel the warmth of the cup in your hands, taste the tea with each sip, notice the sounds around you. When you feel your mind wandering, let go of thoughts and come back to the sensation of the warmth of the tea cup in your hands.',
  '🥬 Get smelly.  Garlic, onions, spring onions and leeks all contain material that’s good for you. A study at the Child’s Health Institute in Cape Town found that eating raw garlic helped fight serious childhood infections.',
  '🧅 Get smelly.  Garlic, onions, spring onions and leeks all contain material that’s good for you. A study at the Child’s Health Institute in Cape Town found that eating raw garlic helped fight serious childhood infections.',
  '🧄 Get smelly.  Garlic, onions, spring onions and leeks all contain substance that’s good for you. A study at the Child’s Health Institute in Cape Town found that eating raw garlic helped fight serious childhood infections.',
  '🦾️ Strong people go for help. Ask for assistance. Gnashing your teeth in the dark will not get you extra brownie points. It is a sign of strength to ask for assistance and people will respect you for it.',
]

const motds = [
  '🚿 Save steamy scenes for the bedroom. Showering or bathing in water that’s too hot will dry out your skin and cause it to age prematurely. Warm water is much better.',
  '👨‍👩‍👦 [READ] Children, devices, and going online. A guide to security and privacy.|https://www.lookout.net/articles/children-online-privacy-and-security-guide.html',
  '👹️ X X X = 6 6 6|https://www.dcode.fr/pythagorean-numerology',
  '👹️ Hebrew Gematria א 1 ב 2 ג 3 ד 4 ה 5 ו 6 ז 7 ח 8 ט 9 י 10 כ 20 ל 30 מ 40 נ 50 ס 60 ע 70 פ 80 צ 90 ק 100 ר 200 ש 300 ת 400 ך 500 ם 600 ן 700 ף 800 ץ 900 (WWW = ווו = 666)',
  '👹️ Pythagorean Alphabet Numerology A 1 B 2 C 3 D 4 E 5 F 6 G 7 H 8 I 9 J 1 K 2 L 3 M 4 N 5 O 6 P 7 Q 8 R 9 S 1 T 2 U 3 V 4 W 5 X 6 Y 7 Z 8 (XXX = 666)',
  '🤔️ If you KNEW that by watching porn, you’re being played by the beast, would you still watch porn? (XXX = 666)|https://www.dcode.fr/pythagorean-numerology',
  '👹️ If you KNEW that by watching this, you’re being played by the beast, would you still watch this? (XXX = 666)|https://www.dcode.fr/pythagorean-numerology',
  '👹️ If you KNEW that by watching porn, you’re being played by the beast, would you still watch it? (XXX = 666)|https://www.dcode.fr/pythagorean-numerology',
  '👹️ If you KNEW that you’re being played by the beast, would you still watch porn? (XXX = 666)|https://www.dcode.fr/pythagorean-numerology',
  '👹️ XXX = 666 |https://www.dcode.fr/pythagorean-numerology',
  '👹️ XXX = 666. Did you ever wonder why “XXX”?|https://www.dcode.fr/pythagorean-numerology',
  '🤔️ Did you ever wonder why “XXX”? (XXX = 666)|https://www.dcode.fr/pythagorean-numerology',
  '👹️ Did you ever wonder why “XXX”? (XXX is 666)|https://www.dcode.fr/pythagorean-numerology',
  '👹️ Did you ever wonder why “XXX”? (XXX in Pythagorean Numerology is 666)|https://www.dcode.fr/pythagorean-numerology',
  '👩️ [READ] Former porn star Jennie Ketcham has written a memoir about her struggles with sex and cocaine addiction and her decision to leave porn for good.|https://www.buzzfeed.com/annanorth/ex-porn-star-speaks-out-about-sex-addiction-in-por',
  '👩️ [READ] Contact a porn performer and ask if you can help... It’s easy|https://web.archive.org/web/20100504081834if_/http://www.thepinkcross.org/pinkcross-blogs/shelley-lubben/december-2009/urgent-please-help-ex-porn-star-mommy',
  '👩️ [READ] Contact a porn actress or actor and ask if you can help them out of porn... It’s easy|https://web.archive.org/web/20100504081834if_/http://www.thepinkcross.org/pinkcross-blogs/shelley-lubben/december-2009/urgent-please-help-ex-porn-star-mommy',
  '👩️ [READ] Contact a porn actress or actor and ask if you can help them retire... It’s easy|https://web.archive.org/web/20100504081834if_/http://www.thepinkcross.org/pinkcross-blogs/shelley-lubben/december-2009/urgent-please-help-ex-porn-star-mommy',
  '📖 [BOOK] Merchants of Sin.|https://web.archive.org/web/20170930160005/https://merchants-of-sin.com/',
  '🏝️ [BOOK] Earth is not a globe. You might want to read about it.|magnet:?xt=urn:btih:78979a58b4dddf80f161bbd1b2348040f96a2947&dn=William+Carpenter+-+One+Hundred+Proofs+that+the+Earth+is+not+a+Globe+(1885)+-+pdf+%5BTKRG%5D&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '🌄️ [PDF] Earth is round and horizontal. You might want to look into it.|magnet:?xt=urn:btih:78979a58b4dddf80f161bbd1b2348040f96a2947&dn=William+Carpenter+-+One+Hundred+Proofs+that+the+Earth+is+not+a+Globe+(1885)+-+pdf+%5BTKRG%5D&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '👹️ “Also it causes all, both small and great, both rich and poor, both free and slave, to be marked on the right hand or the forehead, so that no one can buy or sell unless he has the mark, that is, the name of the beast or the number of its name. This calls for wisdom: let the one who has understanding calculate the number of the beast, for it is the number of a man, and his number is 666.” (Revelation 13:16-18) XXX = 666|https://www.dcode.fr/pythagorean-numerology',
  '👹️ XXX = 666. Mark of the beast. (Revelation 13:16-18)|https://www.dcode.fr/pythagorean-numerology',
  '👹️ XXX = 666. The mark of the beast.|https://www.dcode.fr/pythagorean-numerology',
  '👹️ XXX = 666. The mark of the beast. Did you ever wonder?|https://www.dcode.fr/pythagorean-numerology',
  '👹️ WWW in Hebrew Gematria is 666. The mark of the beast. Did you ever wonder?',
  '🦊️ FOX in Pythagorean Numerology is 666|https://www.dcode.fr/pythagorean-numerology',
  '📽️ These scense are obscene. This is not reality.',
  '📽️ These scense are obscene',
  '📽️ This is not reality',
  '🧔‍♂️️👩️ [WATCH] Racial identity matters!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '👩️👨️ [WATCH] Racial identity matters!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '👩🏻👨🏻 [WATCH] Racial identity matters!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '🧑🏾👩🏾 [WATCH] Racial identity matters!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '🧑🏿👩🏿 DON’T FUCKING MIX!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '👩🏿👨🏿 [WATCH] Racial identity matters!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '👩🏾👨🏾 [WATCH] Racial identity matters!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '👩🏼👨🏼 [WATCH] Racial identity matters!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '👩🏼👨🏼 KEEP THE RACE!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '🏎️ KEEP THE RACE!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '🙅🏻‍♀️️🙅🏻️🙅🏻‍♂️️ DON’T MIX!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '🙅🏻‍♀️️🙅🏻‍♂️️ DON’T MIX!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '🙅🏾‍♂️️🙅🏾‍♀️️ DON’T MIX!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '👩🏼👩🏿👩🏻 Treasures <iamatreasure.com>|https://www.iamatreasure.com/?ref=tc',
  '👩🏻 Mindful living. You’ve probably heard the old adage that life’s too short to stuff a mushroom. But perhaps you should consider the opposite: that life’s simply too short NOT to focus on the simple tasks. By slowing down and concentrating on basic things, you’ll clear your mind of everything that worries you.',
  '👩🏻 Be aware of your connection to the universe. Live with the awareness that everything you are end everything you do directly or indirectly affects everything and everyone around you. Small or big, what you choose to do can alter the course or destiny of living or non-living things that come your way. As you realize this, you will take more responsibility for your actions and influence, and will never take spiritual things lightly.',
  '👩🏻 [READ] Former Porn Star Alexa Milano Story (aka Melissa)|https://farside.link/nitter/pinkcrossfound',
  '👩🏻 [WATCH] EX PORN STAR DR. SHELLEY LUBBEN PRESENTATION AT THE SEX SEMINAR PT. 2|https://farside.link/invidious/watch?v=mXmqcjMrPcI',
  '👨🏼 [WATCH] In my opinion, most pornography online is utterly degrading and even violent. The time has come for us, as men, to realise the damage we are doing by watching it. God bless. -- doubts|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👨🏼 [WATCH] Pray for these women as well that they realize they are loved by God and should be treated like treasure. -- Steve Alexander|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👨🏼 [WATCH] Pray for these women as well that they realize they are loved by God and should be treated like treasure... not toilet paper. -- Steve Alexander|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👨🏼 [WATCH] Don’t let them steal it from you. Rise Up!|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👨🏼 [WATCH] You were born to lead. Rise Up!|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👨🏼 [WATCH] You were born to lead, not to masturbate to porn. Rise Up!|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👨🏼 [WATCH] What are you doing?!! Rise Up!|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👨🏼 [WATCH] Ex Porn Star’s Husband Exhorts Men to Rise Up!|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👨🏼 [WATCH] Ex Porn Star’s Husband Exhorts Men to Rise Up! #shelleylubben|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👩🏻 [WATCH] Sex Trafficking Victim Empowering Others (story of Morgan Stacy)|https://farside.link/invidious/watch?v=wENslFkl3H8',
  '♀️ We love you Shelley (Pink Cross Foundation) #shelleylubben|http://www.youtube.com/slubben',
  '♀️ We are proud of you, our dear and beloved Shelley (Pink Cross Foundation) #shelleylubben',
  '♀️ We are proud of you, dear and beloved Shelley (Pink Cross Foundation) #shelleylubben',
  '♀️ Thank you Shelley Lubben (Pink Cross Foundation) #shelleylubben',
  '👩 EX PORN STAR LOVING PEOPLE OUT OF PORN! #shelleylubben|https://web.archive.org/web/20100714123949if_/http://www.myspace.com/shelleylubben',
  '✊️ EX PORN STAR LOVING PEOPLE OUT OF PORN! #shelleylubben|https://web.archive.org/web/20100714123949if_/http://www.myspace.com/shelleylubben',
  '🦸‍♀️ EX PORN STAR LOVING PEOPLE OUT OF PORN! #shelleylubben|https://web.archive.org/web/20100714123949if_/http://www.myspace.com/shelleylubben',
  '👩 [READ] Shelley’s Story|https://web.archive.org/web/20100504101757if_/http://shelleylubben.com/shelleys-story',
  '📊 [READ] The Internet pornography industry generates $12 billion dollars in annual revenue, larger than the combined annual revenues of ABC, NBC, and CBS (Family Safe Media, January 10, 2006)|https://www.familysafe.com/pornography-statistics/',
  '👨‍👩‍👦 [READ] The largest group of viewers of Internet porn is children between ages 12 and 17 (Family Safe Media, December 15, 2005)|https://www.familysafe.com/pornography-statistics/',
  '👩 [READ] If God can heal a porn star, He can heal anyone. --Shelley Lubben|https://web.archive.org/web/20100504101757if_/http://shelleylubben.com/shelleys-story',
  '👩 [READ] PORN IS NOT GLAMOROUS. GET THE FACTS. GET HELP.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '👩 [READ] Porn is not glamorous. Get the facts. Get help.|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] Porn is not glamorous. Get the facts. Get help.|https://web.archive.org/web/20130425002816if_/https://www.shelleylubben.com/porn-industry',
  '👩 [READ] “I did over 100 xxx hardcore movies where I was slapped, hit, choked and forced to to sex scenes I never agreed to. As I did more and more scenes I abused prescription pills which were given to me anytime I wanted by several Doctors in the San Fernando Valley. I was given Vicodin, Xanax, Norcos, Prozac and Zoloft.” -- Michelle Avanti|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] My first movie I was treated very roughly by 3 guys. They pounded on me, gagged me with their penises, and tossed me around like I was a ball! I was sore, hurting and could barely walk. My insides burned and hurt so badly. I could barely pee and to try to have a bowel movement was out of the question. I was hurting so bad from the physical abuse from these 3 male porn stars! -- Alexa Milano|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] “People in the porn industry are numb to real life and are like zombies walking around. The abuse that goes on in this industry is completely ridiculous. The way these young ladies are treated is totally sick and brainwashing. I left due to the trauma I experienced even though I was there only a short time.” -- Jessie Jewels|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] “I had bodily fluids all over my face that had to stay on my face for ten minutes. The abuse and degradation was rough. I sweated and was in deep pain. On top of the horrifying experience, my whole body ached, and I was irritable the whole day. The director didn’t really care how I felt; he only wanted to finish the video.” -- Genevieve|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] “They told me if had my AIDS test that I’d be safe. I arrived on the set with my test and did a hardcore scene with two men. Within that week I was very sick with a fever of 104 and blisters all over my mouth, throat and private area. I looked like a monster. The doctor told me I had the non-curable disease Genital Herpes. I wanted to die.” -- Roxy aka Shelley Lubben|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] “The truth is I let my lifestyle get the best of me. I hate life. I’m a mess. A disaster. I’ve attempted suicide many times.  No one cares about a dead porn star or stripper.” -- Neesa|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] “Guys punching you in the face. You have semen from many guys all over your face, in your eyes. You get ripped. Your insides can come out of you. It’s never ending.” -- Jersey Jaxin|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] “I found out 2 days later that I had caught gonorrhea in my first scene! As quick as that the glamour of being a porn star was gone. In the five years I was shooting I caught Gonorrhea and Chlamydia many times. Sometimes both at the same time about every 3-5 months.” -- Nadia Styles|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] “My first scene was one of the worst experiences of my life. It was very scary. It was a very rough scene. My agent didn’t let me know ahead of time... I did it and I was crying and they didn’t stop. It was really violent. He was hitting me. It hurt. It scared me more than anything. They wouldn’t stop. They just kept rolling.  Drugs are huge. They’re using viagra. It’s unnatural. The girls will be on xanax and vicodin.” -- Sierra Sinn|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] “As for myself, I ended up paying the price from working in the porn industry. In 2006, not even 9 months in, I caught a moderate form of dysplasia of the cervix (which is a form of HPV, a sexually transmitted disease) and later that day, I also found out I was pregnant. I had only 1 choice which was to abort the baby during my first month. It was extremely painful emotionally and physically. When it was all over, I cried my eyes out.” -- Tamra Toryn|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '🌌 Good night, sweetheart. Rest heals the body and has been shown to lessen the risk of heart trouble and psychological problems.',
  '🧘 Explore your spiritual core. By exploring your spiritual core, you are simply asking yourself questions about the person you are and your meaning. Ask yourself: Who am I? What is my purpose? What do I value most? These questions will lead you down a road where you will think more in-depth about yourself and allow you to notice things about yourself that will help you achieve fulfillment.',
  '👨‍👩‍👦 Love family, not porn',
  '👶👦👧 Make life, not porn',
  '👼 Make babies, not porn',
  '👶👦👧 Make children, not porn',
  '👼 Babies are joy',
  '🏌️ “We like to watch what’s happening around us, but we don’t like to participate, we don’t like to get involved; that’s why I hate spectators’ force, and have great contempt for sports fans.” --William Luther Pierce',
  '👴🏻 “We like to watch what’s happening around us, but we don’t like to participate, we don’t like to get involved; that’s why I hate spectators’ force, and have great contempt for sports fans.” --William Luther Pierce',
  '🧑🏻‍🏫 “We like to watch what’s happening around us, but we don’t like to participate, we don’t like to get involved; sitting on your couch and watching other people do things, isn’t healthy.” --William Luther Pierce',
  '🧑🏻‍🏫 “Sitting on your couch and watching other people do things, isn’t healthy.” --William Luther Pierce',
  '🛋️ “Sitting on your couch and watching other people do things, isn’t healthy.” --William Luther Pierce',
  '🛋️‍⃠ “Sitting on your couch and watching other people do things, isn’t healthy.” --William Luther Pierce',
  //'( • )( • ) Do self-checks. Do regular self-examinations of your breasts. Most partners are more than happy to help, not just because breast cancer is the most common cancer among women. The best time to examine your breasts is in the week after your period.',
  //'🤱 Do self-checks. Do regular self-examinations of your breasts. Most partners are more than happy to help, not just because breast cancer is the most common cancer among women. The best time to examine your breasts is in the week after your period.',
  '🧘 Do yoga, not porn.',
  '🌶️ Curry favour. Hot, spicy foods containing chillies or cayenne pepper trigger endorphins, the feel-good hormones. Endorphins have a powerful, almost narcotic, effect and make you feel good after exercising.',
  '🍽️ Don’t skip breakfast. Studies show that eating a proper breakfast is one of the most positive things you can do if you are trying to lose weight. Breakfast skippers tend to gain weight.',
  '🥗 Don’t skip breakfast. Studies show that eating a proper breakfast is one of the most positive things you can do if you are trying to lose weight. Breakfast skippers tend to gain weight.',
  '🌅 Don’t skip breakfast. Studies show that eating a proper breakfast is one of the most positive things you can do if you are trying to lose weight. Breakfast skippers tend to gain weight.',
  '📖 Here are some verses from the Bible that you should read: John 3:16, Rom. 3:23, Rom. 5:8, Rom. 10:13, Rev. 3:20, Mark 2:17, James 4:8|https://web.archive.org/web/20100619230602if_/http://thepinkcross.org/page/gods-help',
  '♱ You were made for greater things than porn or sex work! Jesus said so. “For you are God’s masterpiece. Created to be made new in Christ Jesus to do good works which God prepared in advanced for you to do”. Ephesians 2:10; God has something awesome for you to do and it isn’t viewing or doing porn!|https://web.archive.org/web/20100619230602if_/http://thepinkcross.org/page/gods-help',
  '👩 [READ] I was a porn star living the glamorous life. Drug overdoses, Herpes, suicide attempts and abuse on the porn set. I nearly died but by the grace of God I survived. Many didn’t.|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 A MILLION thanks to Shelley for helping me through this along with the everyone who supports The Pink Cross Foundation. With their help, I was recently able to gain strength after quitting my job at the tanning salon because I needed to step outside of myself to see the bigger picture and self medicating yourself with marijuana does nothing but kill you spirit (yes, porn does effect your life after you leave no matter what you are doing outside of the industry). I’m sober now and feel amazing! The truth really does set you free and I’m thankful to God everyday for my new life. -- Tammie, former porn star Tamra Toryn|https://web.archive.org/web/20100619224136if_/http://thepinkcross.org/page/testimonies',
  '👩 Shelley Lubben is one of the most compassionate people I have ever met. Her love, support, and guidance in my life has been of countless value. -- Karly, former porn star Becca Bratt|https://web.archive.org/web/20100619224136if_/http://thepinkcross.org/page/testimonies',
  '👩 Thank you for restoring my faith Shelley and showing me the Way. You have helped me more than you know. I love you and look up to you. I hope that one day I can help people too! -- Julie, former porn star Sierra Sinn|https://web.archive.org/web/20100619224136if_/http://thepinkcross.org/page/testimonies',
  '👩 I am so grateful for Pink Cross Foundation for reaching out to me and helping me better myself. I’m now strong enough to stand up and say, “I’m done with this horrible industry!” Thank you Shelley and the Pink Cross Foundation for loving me and seeing me as the great woman I am. -- Amanda, former porn star Erin Moore|https://web.archive.org/web/20100619224136if_/http://thepinkcross.org/page/testimonies',
  '👩 Ex-Porn Star Tells the Truth About the Porn Industry by Shelley Lubben (aka Roxy) of Pink Cross Foundation|https://www.covenanteyes.com/2008/10/28/ex-porn-star-tells-the-truth-about-the-porn-industry/',
  '👩 Porn is not glamorous. Get the facts. Get help.|https://web.archive.org/web/20130424091914if_/http://thepinkcross.org/page/meet-our-president',
  // There is no such thing as hard for something that is not substantial
  //'👩 Fighting porn is hard. Helping people out of porn is even harder.',
  '💰️ The porn industry, is the region where you wish to become a millionaire but you’re more likely to end up dead or as a crack addict on welfare. #boycottporn',
  '💰️ They (the victims a.k.a “participants” or “talents” so-called) wish to become millionaires but they are more likely to end up dead or as crack addicts on welfare',
  '💰️ The porn industry, is the region where you wish to get by and then get a real job, but you never knew that you will end up your life in pornography, because once you’re in that industry, you’re not likely to ever find a proper job, nor to sustain a meaningful and strong relationship. #boycottporn',
  '🤮️ They just want to get by and then get a real job, but no one told them that they are more likely to end up in pornography for life, not because of qualification, but because they have a mark of disgrace which goes along with them, and that is why they have higher chances to remain in that disgusting industry for life. #savedignity',
  '🥺️ Dear Viewer, please have mercy on them, those people are subjected to higher rates of abortion, cancer, divorce, drug addiction, loneliness, mortality and suicide.  May God and You have mercy on them. #boycottporn',
  '💊️ A large portion of those men and women are using drugs in order to depress their senses and be able to participate in these scenes.  They are likely to end up as drug addicts because otherwise they’ll just disfunction without high doses of drugs, as they might get used to it over time.  YOU HAVE THE POWER TO PREVENT IT.  TURN IT OFF!',
  '💊️ It is unnatural to watch and even to participate.  A large portion of those men and women are using drugs in order to depress their senses and be able to participate in these scenes.  They are likely to end up as drug addicts because otherwise they’ll just disfunction without high doses of drugs, as they might get used to it over time.',
  '🧑 “If you want things in your life to change, you’ve got to change things in your life” -- Kevin Trudeau #dontstayhome',
  '🤵 “If you want things in your life to change, you’ve got to change things in your life” -- Kevin Trudeau #dontstayhome',
  '🆘️ Viewer, help yourself by helping them. Turn this fictional nonsense off.',
  '🆘️ Viewer, help yourself by helping them. Turn off this fictional nonsense.',
  '❤️ Pay attention. Our only role in this world is to be awake. Consciously do things to bring yourself into the moment. If you’re with someone and not paying attention, stop and zone in on that person and be with them fully. Start to eliminate background noises and sights until it’s just you and them. If this is difficult, while you’re alone, practise removing other senses so you begin to focus on one thing. Close your eyes for a minute and focus on a single noise or cover your ears and look at a single object.',
  '❤️ Viewer, love them as you love yourself. Turn off this fictional nonsense and boycott this industry. #boycottporn',
  '💕️ Viewer, love them as you love family. Would you support it, if it was your sister or brother on that screen? #boycottporn',
  '🤵 “It is not fun to do it alone” #dontstayhome',
  '🧔 “It is not fun to do it alone” Go out and find a mate #dontstayhome',
  '🧔‍♂️ “It is not as fun when you do it alone” Go out and find a woman #dontstayhome #getmarried',
  '🤵 “It is not fun to do sex alone” #dontstayhome',
  '🚫️ Boycott the Porn Industry #boycottporn',
  '🚫️ Ignore the Porn Industry #boycottporn',
  '🚫️ Ignore Pornography #boycottporn',
  '🚑 [READ] PUBLIC HEALTH HARMS OF PORNOGRAPHY #boycottporn|https://endsexualexploitation.org/issues/pornography/',
  '🩺 [PDF] Pornography & Public Health Research Summary #boycottporn|https://endsexualexploitation.org/wp-content/uploads/NCOSE_Jan-2019_Research-Summary_Pornography-PublicHealth_FINAL.pdf',
  '🏥 [PDF] Public health harms of pornography #boycottporn|https://endsexualexploitation.org/wp-content/uploads/NCOSE_Jan-2019_Research-Summary_Pornography-PublicHealth_FINAL.pdf',
  '👦👧 Get help to stop watching porn: consult your acquaintance',
  '👦👧 Get help to stop watching porn: consult your sibling',
  '👦👧 Get help to stop watching porn: consult your mother',
  '👦👧 Get help to stop watching porn: consult your father',
  '👦👧 Get help to stop watching porn: consult your family',
  '👦👧 Get help to stop watching porn: consult your friend',
  '👦👧 Porn seriously harms you and others around you',
  '👦👧 Smoking seriously harms you and others around you',
  '🧔‍♂️ A manly male does’t watch porn',
  '🦲 Porno makes you bald',
  '🧑‍🦲 Porno makes you bald',
  '👩‍🦲 Porno causes baldness also in women',
  '🦀 Medical research determine: 85% of overhaul brain cancer are caused due to porn',
  '🦀 Medical research determine: 85% of overhaul brain cancer are caused due to excessive consumption of porn',
  '🦀 Medical research determine: 85% of all brain cancer are caused due to porn',
  '🦀 Medical research determine: 85% of all brain cancer are caused due to excessive porn consumption',
  '🦀 Medical research determine: 85% of all lung cancer are caused due to smoking',
  '👦👧 [PDF] THE MOST DANGEROUS PLAYGROUND IS NOW ... IN OUR KIDS’ POCKETS #boycottporn|https://endsexualexploitation.org/wp-content/uploads/Most-Dangerous-Playground_NCOSE_2023.pdf',
  '🚫️ AntiPornography.org Nonreligious - Nonpartisan <antipornography.org>|https://www.antipornography.org/home.html?ref=tc',
  '👩️ [READ] Jenna Jameson’s 25 Good Reasons Why No One Would Ever Want To Become a Porn Star|https://www.antipornography.org/jenna_jamesons_25_reasons.html?ref=tc',
  '👩️ [WATCH] Two EX PORN STARS Say Working In Porn Is A DEAD END TRIP to Nowhere. Jessie Rogers & Vanessa Belmond|https://farside.link/invidious/watch?v=AIvj2ib6Qs0',
  '👩️ [READ] Ex Porn Star "Jessie Rogers" Exposes Shocking Abuses of the Porn Industry and Tells Her Story|https://www.antipornography.org/ex-porn-star-jessie-rogers-exposes-shocking-abuse.html?ref=tc',
  '📺 [WATCH] Documentary Films and Television Programs on Pornography, Prostitution, and Sex Trafficking, etc.|https://www.antipornography.org/documentaries.html?ref=tc',
  '📺 Viewer discretion is advised.',
  // Pornography Industry Factoid 2008 from Shelley Lubben
  // Suicide Deaths in the U.S. Pornography Industry since 1970
  '🪦️ In memory of Jessica Redding aka Jessica Jaymes. CAUSE OF DEATH: Seizure and chronic alcohol abuse – September 17, 2019|https://nypost.com/2019/11/04/porn-star-jessica-jaymes-cause-of-death-revealed/',
  '🪦️ In memory of Emily Irene Sander aka Zoey Zane. CAUSE OF DEATH: Murder – November 24, 2007|https://www.thepitchkc.com/israel-mireles-guilty-in-murder-of-emily-sander-zoey-zane/',
  '🪦️ In memory of Anastasia Blue. CAUSE OF DEATH: Tylenol overdose/suicide July 19, 2008',
  '🪦️ In memory of Deven Augustina Schuette aka Deven Davis (April 6, 1979 - August 17, 2018). Mrs. Davis had struggled with drug addiction for over 20 years; Nitrous-oxide, Cocaine and Norco. #RIP #20 #39',
  '🪦️ In memory of Deven Augustina Schuette aka Deven Davis. CAUSE OF DEATH: Accidental drug overdose – February 21, 1976 - August 17, 2018', // Born at April 6, 1979 perhaps
  '🪦️ In memory of Anastasia Blue. CAUSE OF DEATH: Tylenol overdose/suicide – July 19, 2008',
  '🪦️ In memory of Kent North. CAUSE OF DEATH: Drug overdose/suicide July 4, 2007',
  '🪦️ In memory of Chico Wang Porn director and porn actor. CAUSE OF DEATH: Drug overdose/suicide – September 29, 2007',
  '🪦️ In memory of Jon Dough. CAUSE OF DEATH: Suicide by hanging – August 27, 2006, in Chatsworth, California',
  '🪦️ In memory of Tim Barnett. CAUSE OF DEATH: Suicide by hanging – July 13, 2005',
  '🪦️ In memory of Lance Heywood. CAUSE OF DEATH: Jumped off a building – April 29, 2005',
  '🪦️ In memory of Karen Lancaume. CAUSE OF DEATH: Drug overdose/suicide – January 28, 2005',
  '🪦️ In memory of Camilla De Castro. CAUSE OF DEATH: Drug overdose/suicide – July 26, 2005',
  '🪦️ In memory of Johnny Rahm. CAUSE OF DEATH: Suicide by hanging – November 7, 2004',
  '🪦️ In memory of Megan Joy Serbian aka Naughtia Childs. CAUSE OF DEATH: Jumped off balcony – 	October 5, 1979 - January 7, 2002',
  '🪦️ In memory of Naughtia Childs. CAUSE OF DEATH: Jumped off balcony – January 7, 2002',
  '🪦️ In memory of Jon Vincent. CAUSE OF DEATH: Drug overdose/suicide – May 3, 2000',
  '🪦️ In memory of Brad Chase. CAUSE OF DEATH: Suicide by hanging – April 19, 2000',
  '🪦️ In memory of Kyle McKenna. CAUSE OF DEATH: Drug overdose/suicide – March 14, 2000',
  '🪦️ In memory of Malinda Gayle McCready aka Mindy McCready. CAUSE OF DEATH: Self-inflicted gunshot wound – February 17, 2013 (suicide)',
  '🪦️ In memory of Wendy O. Williams. CAUSE OF DEATH: Self-inflicted gunshot wound – April 7, 1998 (suicide)',
  '🪦️ In memory of Steve Fox. CAUSE OF DEATH: Suffered from mental illness and committed suicide October 23, 1997',
  '🪦️ In memory of Christian Fox. CAUSE OF DEATH: Left suicide note and overdosed on drugs October, 1996',
  '🪦️ In memory of Alex Jordan. CAUSE OF DEATH: Suicide by hanging – July 2, 1995',
  '🪦️ In memory of Cal Jammer. CAUSE OF DEATH: Self-inflicted gunshot wound - January 25, 1995 (suicide)',
  '🪦️ In memory of Savannah. CAUSE OF DEATH: Self-inflicted gunshot wound – July 11, 1994 (suicide)',
  '🪦️ In memory of Rod Phillips. CAUSE OF DEATH: Drug overdose/suicide as he lay dying of AIDS – June 7, 1993',
  '🪦️ In memory of Nancee Kellee (Daughter of actor Jerry Van Dyke). CAUSE OF DEATH: Self-inflicted asphyxiation by hanging – November 17, 1991 (suicide)',
  '🪦️ In memory of Kristina Lisina|https://www.thesun.co.uk/news/15498206/who-onlyfans-kristina-lisina-cause-of-death/',
  '🪦️ In memory of Alan Lambert. CAUSE OF DEATH: Self-inflicted gunshot wound – December 20, 1992 (suicide)',
  '🪦️ In memory of Megan Leigh. CAUSE OF DEATH: Self-inflicted gunshot wound – June 16, 1990 (suicide)',
  '🪦️ In memory of Shauna Grant. CAUSE OF DEATH: Self-inflicted gunshot wound - March 23, 1984 (suicide)',
  '🪦️ In memory of Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  Dakota Skye’s growing drug addiction, breakups, and a diminishing supply of work in the industry, led to her downward spiral and subsequent death.  Mrs. Scott was 27 years old at her death. #RIP #27|https://www.dailystar.co.uk/news/world-news/tragic-life-porn-star-dakota-24602938',
  '🪦️ In memory of Angela Shunali Dhingra aka Angela Devi. CAUSE OF DEATH: Suicide by asphyxiation - July 30, 1975 - March 31, 2006',
  '🪦️ In memory of Lauren Scott aka Dakota Skye. CAUSE OF DEATH: Acute multidrug intoxication - April 17, 1994 - June 9, 2021',
  '🤢 FACT: Addictions increase by an average of 92% in parents to porn performers, Lauren Scott’s (Dakota Skye) mother died in 2019 due to "addiction and alcoholism"',
  '🤢 FACT: Substance abuse increases by an average of 85% in parents to porn performers, Lauren Scott’s (Dakota Skye) mother died in 2019 due to "addiction and alcoholism"',
  '🍹 Alcohol abuse may increase by 78% in parents to porn performers, Lauren Scott’s (Dakota Skye) mother died in 2019 due to "addiction and alcoholism"',
  '🍹 Alcohol abuse may increase by 78% in parents to porn performers, Lauren Scott’s (Dakota Skye) mother died in 2019 due to "addiction and alcoholism"',
  '🍹 Parents to porn performers have 78% chances to develop alcohol addiction, Lauren Scott’s (Dakota Skye) mother died in 2019 due to "addiction and alcoholism"',
  '🪦️ THEY ARE MORE DEPENDENT THAN THEY APPEAR: Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  In 2019, her mother died of "addiction and alcoholism". In 2020, two of her grandparents died of flu, she found herself homeless. #RIP #19 #27',
  '🪦️ THEY ARE MORE FRAGILE THAN THEY APPEAR: Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  In 2019, her mother died of "addiction and alcoholism". In 2020, two of her grandparents died of flu, she found herself homeless, and her pet dog died. In spring 2021 she was working as an escort. #RIP #19 #27',
  '🪦️ In memory of Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  Mrs. Scott died due to accidental overdose; her body was discovered at her Los Angeles motorhome by her husband.  Mrs. Scott was 27 years old at her death. #RIP #19 #27|https://web.archive.org/web/20210612221620if_/https://news.yahoo.com/porn-star-dakota-skye-received-171405012.html',
  '🪦️ In memory of Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  An official at the Los Angeles County Medical Examiner’s Office confirmed to that they are currently investigating the death of a woman named Lauren Scott who died on June 9. She was 27 and listed as "homeless," the office said.  Mrs. Scott (div.) was 27 years old at her death. #RIP #19 #27|https://web.archive.org/web/20210612221620if_/https://news.yahoo.com/porn-star-dakota-skye-received-171405012.html',
  '🪦️ In memory of Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  Her aunt, Linda Arden, told in an interview "Lauren was a product of a highly dysfunctional family involving drugs, alcohol, physical, emotional, verbal and sexual abuse,".  Mrs. Scott (div.) was 27 years old at her death. #RIP #19 #27|https://web.archive.org/web/20210612221620if_/https://news.yahoo.com/porn-star-dakota-skye-received-171405012.html',
  '🪦️ In memory of Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  In 2019, her mother died of "addiction and alcoholism". In 2020, two of her grandparents died of flu, she found herself homeless, and her pet dog died. In spring 2021 she was working as an escort.  Mrs. Scott (div.) was 27 years old at her death. #RIP #19 #27',
  '🪦️ In memory of Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  Her growing drug addiction, breakups, and a diminishing supply of work in the industry, led to her downward spiral and subsequent death.  Mrs. Scott (div.) was 27 years old at her death. #RIP #19 #27|https://www.dailystar.co.uk/news/world-news/tragic-life-porn-star-dakota-24602938',
  '🪦️ In memory of Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  Dakota Skye was homeless and had a severe fentanyl addiction at the time of her untimely death.  Mrs. Scott was 27 years old at her death. #RIP #27|https://meaww.com/porn-star-dakota-skye-27-homeless-battling-fentanyl-addiction-when-she-died-topless-george-floyd-pic',
  '🪦️ In memory of Melissa Kay Sims. CAUSE OF DEATH: Self-inflicted gunshot wound - June 30, 2021 (suicide)|https://www.thesun.co.uk/news/15605229/dahlia-sky-porn-star-suicide-death/',
  '🪦️ In memory of Melissa Kay Sims aka Dahlia Sky (August 10, 1989 - June 30, 2021).  According to family, before her death, Ms. Sims was completely homeless and she was living in her car.  Ms. Sims was 31 years old at her death.  May heaven help our fellow humans. #RIP #30 #20|https://www.thesun.co.uk/news/15605229/dahlia-sky-porn-star-suicide-death/',
  '🪦️ In memory of Dahlia Sky (August 10, 1989 - June 30, 2021).  According to family, before her death, Ms. Sky was completely homeless and she was living in her car.  Ms. Sky was 31 years old at her death.  May heaven help our fellow humans. #RIP #30 #20|https://www.thesun.co.uk/news/15605229/dahlia-sky-porn-star-suicide-death/',
  '🪦️ In memory of Taylor Summers. CAUSE OF DEATH: Murder, duiring a bondage scene – February, 2004',
  '🪦️ In memory of Natel King (aka Taylor Summers). She was missing for three weeks before government agencies found her body near the Schuykill River in Pennsylvania. Her body was found while bondage gear was bound onto it, and she had suffered multiple stab wounds to her chest, neck and hands.',
  '🪦️ Natel King (aka Taylor Sumers) was murdered duiring a bondage scene.  Ms. King was 23 years old at her death. #RIP|http://davidkfrasier.blogspot.com/2014/05/natel-king-blood-does-flow-part-i.html',
  '🪦️ Linda Wong died from drug and alcohol overdose in December 17, 1987.  Linda was 36 years old at her death. #RIP',
  // TODO https://www.famousfix.com/list/dead-porn-stars-94289207
  // TODO https://pornstardeaths.com/porn-star-deaths/
  // TODO https://www.imdb.com/list/ls573820022/
  // TODO https://web.archive.org/web/20130425020324if_/https://www.shelleylubben.com/dead-pornstars
  // TODO https://web.archive.org/web/20130424020527if_/http://thepinkcross.org/pinkcross-blogs/march-2013/adultcon-outreach
  '👩‍🏫 [READ] Former adult film actress forced to leave teaching job again #dontdestroyherfuture #boycottporn|https://en.wikinews.org/wiki/Former_adult_film_actress_forced_to_leave_teaching_job_again',
  '👩‍🏫 [READ] Jr. High Teacher at All-Girls School Fired for Being Forced Into Porn Years Ago (Ressa Woodward) #dontdestroyherfuture #boycottporn|https://fightthenewdrug.org/how-a-teachers-porn-past-destroyed-her-future/',
  '👩‍🏫 [READ] The sad thing is that if these girls find out that I’m being punished for something that I did nearly 20 years ago and had no control of and fought to get out of, well, what does that say about empowerment? (Ressa Woodward) #dontdestroyherfuture #boycottporn|https://nypost.com/2017/02/01/teacher-fired-because-she-used-to-work-in-porn/',
  '👩‍🏫 [READ] Porn Past Cost Kentucky Teacher Her Job (Tericka Dye) #dontdestroyherfuture #boycottporn|https://alchetron.com/Tericka-Dye',
  '👩‍🏫 [READ] Teacher Who Lost Job Over Porn Films Says She Deserves to Get Her Job Back (Tericka Dye) #dontdestroyherfuture #boycottporn|https://www.foxnews.com/story/teacher-who-lost-job-over-porn-films-says-she-deserves-to-get-her-job-back',
  '👩‍🏫 [READ] “Although (Halas’) pornography career has concluded, the ongoing availability of her pornographic materials on the Internet will continue to impede her from being an effective teacher and respected colleague,” #dontdestroyherfuture #boycottporn|https://uproxx.com/filmdrunk/stacey-halas-tiffany-six-fired-porn-star-teacher-loses-appeal/',
  '👩‍🏫 [READ] Fired Porn Star Teacher Loses Her Appeal (Stacie Halas) #dontdestroyherfuture #boycottporn|https://uproxx.com/filmdrunk/stacey-halas-tiffany-six-fired-porn-star-teacher-loses-appeal/',
  '👩‍🏫 [READ] Teacher quits after pupils find porn page she made to pay for sick son’s care (Kirsty Buchan) #dontdestroyherfuture #boycottporn|https://www.mirror.co.uk/news/uk-news/teacher-quits-after-pupils-find-28624048',
  '👩‍🏫 [READ] A 73-year-old Canadian teacher was fired in July from a position she held for 15 years because she starred in softcore porn films in the ’70s (Jacqueline Laurent-Auger) #dontdestroyherfuture #boycottporn|https://tonpetitlook.com/2014/10/20/le-cas-jacqueline-laurent-auger-ou-les-dangers-de-la-tendance-soft-sexu/',
  '👩‍🏫 [READ] Montreal teacher, 73, loses job over film nudity more than 40 years ago (Jacqueline Laurent-Auger) #dontdestroyherfuture #boycottporn|https://www.huffpost.com/archive/ca/entry/montreal-teacher-jacqueline-laurent-auger-fired-after-students-f_n_6021150',
  '👩‍🏫 [READ] Montreal teacher, 73, loses job over film nudity more than 40 years ago (Jacqueline Laurent-Auger) #dontdestroyherfuture #boycottporn|https://www.theglobeandmail.com/news/national/montreal-teacher-73-loses-job-over-film-nudity-more-than-40-years-ago/article21183669/',
  '👩‍🏫 [READ] Southern California Teacher Fired Over Porn Video (Stacie Halas) #dontdestroyherfuture #boycottporn|https://www.theskanner.com/news/usa/14016-southern-california-teacher-fired-over-porn-video-2012-04-19',
  '👩‍🏫 [READ] Teacher sacked after bosses learned of porn career past wants her job back (Resa Woodward) #dontdestroyherfuture #boycottporn|https://www.mirror.co.uk/news/world-news/teacher-sacked-after-bosses-learned-9842637',
  '👩‍🏫 Teacher punished for her past, even though she was abused (Tericka Dye) #dontdestroyherfuture #boycottporn',
  '👩‍🏫 Though she used the professional pseudonym Rikki Anderson during her adult industry days, students were still able to dig up tapes of her X-rated past, leading her to resign from her job as a teacher #dontdestroyherfuture #boycottporn',
  '👩‍🏫 Teacher fired for porn star past (Tericka Dye) #dontdestroyherfuture #boycottporn',
  '卐 Arbeit macht frei (Work sets you free)',
  '卐 Arbeit macht frei (Work makes one free)',
  '☭ Arbeit macht frei (Work makes one free)',
  '🏳️‍🌈⃠ Reject Degeneracy|https://legiochristi.com/yes-corporations-honestly-love-degeneracy-pride-stop-pretending-they-do-not/',
  '🚫️🏳️‍🌈️ Reject Degeneracy|https://legiochristi.com/yes-corporations-honestly-love-degeneracy-pride-stop-pretending-they-do-not/',
  '🏳️‍🌈⃠ Reject Degeneracy|https://legiochristi.com/yes-corporations-honestly-love-degeneracy-pride-stop-pretending-they-do-not/',
  '🚫 [READ] Reject Degeneracy|https://legiochristi.com/yes-corporations-honestly-love-degeneracy-pride-stop-pretending-they-do-not/',
  '🚫️🏳️‍⚧️️ Reject Degeneracy|https://legiochristi.com/yes-corporations-honestly-love-degeneracy-pride-stop-pretending-they-do-not/',
  '🏳️‍⚧️️ Reject Degeneracy|https://legiochristi.com/yes-corporations-honestly-love-degeneracy-pride-stop-pretending-they-do-not/',
  '🚫️⚧️️ Reject Degeneracy|https://legiochristi.com/yes-corporations-honestly-love-degeneracy-pride-stop-pretending-they-do-not/',
  '⚧️️  Reject Degeneracy|https://legiochristi.com/yes-corporations-honestly-love-degeneracy-pride-stop-pretending-they-do-not/',
  '🪦️ Smoking kills|https://web.archive.org/web/20070103075858if_/http://nosmoking.virtue.nu/',
  '💀 Smoking kills',
  '🚭 Smoking kills',
  '🚬 Smoking kills|https://web.archive.org/web/20010815084915if_/http://www.virtue.nu:80/nosmoking/',
  '🪦️ Porn kills',
  '💀 Porn kills',
  '🔞 Porn kills',
  '🚭 Porn kills',
  '🚬 Porn kills',
  '🪦️ Porno kills',
  '💀 Porno kills',
  '🚭 Porno kills',
  '🚬 Porno kills',
  '🪦️ Pornography kills',
  '💀 Pornography kills',
  '🚭 Pornography kills',
  '🚬 Pornography kills',
  '🔞 Pornography kills',
  '🔞 Porn emasculates',
  '🔞 Pornography emasculates',
  '🏀 I’ve heard there’s a great basketball court in your neighborhood #dontstayhome',
  '🐶 Sure, years of internet porn have left you unable to become aroused by anything that doesn’t involve a dog fucking a transexual.  FOR HEAVEN SAKES, TURN IT OFF ALREADY!',
  '🐕 Sure, years of internet porn have left you unable to become aroused by anything that doesn’t involve a dog. #ignoreporn',
  '🐴 Sure, years of internet porn have left you unable to become aroused by anything that doesn’t involve a donkey. #fuckporn',
  '👪 S.L.A.A. You are not alone <slaafws.org>|https://slaafws.org/?ref=tc',
  '👨‍👩‍👦 S.L.A.A. Sex and Love Addicts Anonymous is a Twelve Step, Twelve Tradition oriented fellowship based on the model pioneered by Alcoholics Anonymous. <slaafws.org>|https://slaafws.org/?ref=tc',
  '🚭 Porno kills',
  '🚬 Porno kills',
  '💀 Porno kills',
  '💊️ Fight the New Drug <fightthenewdrug.org>|https://fightthenewdrug.org/?ref=tc',
  '👨‍👩‍👦 Pornography and Sex Addiction Recovery & Online Safety <safefamilies.org>|http://www.safefamilies.org/?ref=tc',
  '👨‍👩‍👦 Safe Families Program <safefamilies.org>|http://www.safefamilies.org/?ref=tc',
  '😒 Porno makes you dull',
  '😒 Porno makes you boring',
  '👺 Porno makes you ugly',
  '👹 Porno makes you ugly',
  '🦙 [WATCH] Sex is for making life|https://imgur.com/wwRkjk8',
  '🦙 [WATCH] Sex is for making babies|https://imgur.com/wwRkjk8',
  '👶 [WATCH] Did you know that sex is for making babies?|https://imgur.com/wwRkjk8',
  '👶 [WATCH] Sex is for making babies|https://imgur.com/wwRkjk8',
  '👶 [WATCH] Sex is for making new life|https://imgur.com/wwRkjk8',
  '👶 [WATCH] Sex is for creating new life|https://imgur.com/wwRkjk8',
  '🧑‍⚕️ Sex Inc|http://whale.to/b/sex_inc.html',
  '🧑‍⚕️ Sex Inc.|http://whale.to/b/sex_inc.html',
  '🧑‍⚕️ SEX MAFIA|http://whale.to/b/sex_inc.html',
  '🧑‍⚕️ HIV-AIDS RACKET (AIDS INC)|http://whale.to/aids.html',
  '⛪ [PDF] Porn-Free Church|https://faithconnector.s3.amazonaws.com/nlcwh/downloads/covenant_eyes_porn_free_church.pdf',
  '🤤 Porno makes you stupid',
  '🤢 Average life expectancy of a porn star is 36.2 years',
  '🤢 Porno makes you docile',
  '🤮️ Porno isn’t healthy',
  '🤮️ Porn is unhealthy',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🤢 Pornography is unhealthy',
  '🤢 Pornography is bad for you',
  '🤮️ 66% of porn performers have Herpes, a non-curable disease.',
  '🤮️ Porno makes you sick',
  '😴 Porno makes you weak',
  '👩‍❤️‍👩 Porno makes you gay',
  '👨‍❤️‍👨 Porno makes you gay',
  '🤰 Smoking when pregnant harms your baby',
  '🤰 Watching porno when pregnant harms your baby',
  '🤰 Porno makes you to hate women',
  '🫁 Practise mindful breaths. Use the four parts of the breath to bring you into the present. Inhale and bring everything in, then at the top of the breath with full lungs, consciously accept that it’s there. Then, as you exhale, let it all go until your lungs are completely empty of air. Before your next inhale, take a second to enjoy that everything is okay and you’re still you, regardless of what’s happening. The breath is very powerful in helping us think about what we’re taking in and what we’ll let go of.',
  '🫁 Smoking causes heart diseases and lung cancer',
  '🫀 Smoking causes heart diseases and lung cancer',
  '🫀🫁 Smoking causes heart diseases and lung cancer',
  '🧠🫀 Porno causes stroke and heart diseases',
  '🫀 Porno causes stroke and heart diseases',
  '🧠 Porno causes stroke and heart diseases',
  '🤯 Porno causes stroke and heart diseases',
  '📺 Porno causes stroke and heart diseases',
  '🩺 Porno causes stroke and heart diseases -- Ministry of Health',
  '🚭 Smoking is highly addictive, DON’T START',
  '🚭 Smoking is highly addictive, don’t start',
  '🔞 Porno is highly addictive, DON’T START',
  '🔞 Porno is highly addictive, don’t start',
  '🔪️ [READ] Inside porn’s dark side as Lana Rhoades says “traumatic” scenes left her suicidal|https://www.dailystar.co.uk/love-sex/inside-porns-dark-side-lana-23898531',
  '🙅‍♀️️ [READ] When asked whether she regrets her time in the industry, Rhoades said: “I do. I honestly tell people, if I could go back, I would give up everything to have my dignity and respect back, and for people not to be able to see me in that way.” -- Lana Rhoades #savedignity|https://www.ladbible.com/news/tv-and-film-ex-adult-film-star-lana-rhoades-wants-all-her-videos-deleted-20210616',
  '🕊️ [READ] Simplicity and Peace: Surviving Sex, Porn, and Fap Addictions|https://josephsciambra.com/simplicity-and-peace-surviving-sex-porn-and-fap-addictions/',
  '👩‍👧️ [READ] Porn star Lana Rhoades says she is against adult industry after being “taken advantage of”|https://www.indy100.com/news/lana-rhoades-porn-industry',
  '🚭 WARNING: Smoking causes impotence',
  '🌾 WARNING: Porno causes impotence',
  '🌾 WARNING: Porno harms your potency',
  '⚠️ WARNING: Porno harms your happiness',
  '🌾 WARNING: Porno harms your virility',
  '🧑 WARNING: Porno harms your masculinity',
  '🌾 WARNING: Porno harms your strength',
  '⚠️ WARNING: Porno harms your physical fitness',
  '🌾 WARNING: Porno makes people impotence',
  '👴🏻 WARNING: Porno causes premature ageing',
  '👴🏻 WARNING: Porno causes premature ageing of facial skin',
  '🌾 RESEARCH SAYS: Porno causes impotency',
  '🩺 WARNING: Porno causes impotency -- Ministry of Health',
  '⚠️ WARNING: Porno causes disease and premature death',
  '⚠️ FACT: Porno causes disease and premature death',
  '⚠️ RESEARCH SAYS: Porno causes disease and premature death',
  '⚠️ RESEARCH SAYS: Earth is Horizontal|magnet:?xt=urn:btih:78979a58b4dddf80f161bbd1b2348040f96a2947&dn=William+Carpenter+-+One+Hundred+Proofs+that+the+Earth+is+not+a+Globe+(1885)+-+pdf+%5BTKRG%5D&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '🌄️ RESEARCH SAYS: Earth is Horizontal|magnet:?xt=urn:btih:78979a58b4dddf80f161bbd1b2348040f96a2947&dn=William+Carpenter+-+One+Hundred+Proofs+that+the+Earth+is+not+a+Globe+(1885)+-+pdf+%5BTKRG%5D&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '🌐 RESEARCH SAYS: Earth is not a globe|magnet:?xt=urn:btih:78979a58b4dddf80f161bbd1b2348040f96a2947&dn=William+Carpenter+-+One+Hundred+Proofs+that+the+Earth+is+not+a+Globe+(1885)+-+pdf+%5BTKRG%5D&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '🚬 Cigarette smoke harms those around you',
  '🚬 Smoking harms those around you',
  '🌬 Pornography harms those around you',
  '🌬 Cigarette smoke harms those around you',
  '🌬 Pornography contents harm those around you',
  '😞 Porno clogs the mind and causes mental depression',
  '🧠 Porno clogs the mind and causes mental depression',
  '🫀 Smoking clogs the arteries and causes heart attacks and strokes',
  '👯️ Playboy? Playmate? No, this is not honorific.',
  '🥩️ This is a slaughterhouse for humans, not a productive entertainment house.',
  '寧 Please don’t assist in destroying their dignity.  Turn it off. #boycottporn #dignity',
  '🎗️ Please don’t assist in destroying their dignity.  Turn it off. #boycottporn #dignity',
  '† In memory of Mercedes Grabowski aka August Ames (August 23, 1994 - December 5, 2017) she died from asphyxia due to hanging after refusing to shoot a sex scene with another victim who had done gay porn.  She began in the slaughterhouse in 2013 and died in 2017 while she was inside that industry. #RIP #19 #23|https://www.nydailynews.com/entertainment/porn-star-august-ames-dead-23-article-1.3681554',
  '† In memory of Mercedes Grabowski aka August Ames (August 23, 1994 - December 5, 2017) she died from asphyxia due to hanging after refusing to shoot a sex scene with another victim who had done gay porn.  She began in the slaughterhouse in 2013 and died in 2017 while she was inside that industry. #RIP #19 #23|https://theblast.com/c/pornstar-august-ames-dies-dead-23/',
  '† In memory of Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021) she died from combined drug intoxication (accidental overdose) after being criticized for a photo she posted on the internet showing her flashing her breasts to the camera while standing in front of a mural of a deceased person. #RIP #19 #27|https://web.archive.org/web/20210612221620if_/https://news.yahoo.com/porn-star-dakota-skye-received-171405012.html',
  '🪦️ #1 suicide method among porn stars is by hanging',
  '🪦️ 205 porn stars died prematurely from aids, drugs, suicide, homicide, accidental and medical. (2013)',
  '🪦️ 208 porn stars died prematurely from aids, drugs, suicide, homicide, accidental and medical. (2014)',
  '✚ 2,396 cases of Chlamydia and 1,389 cases of Gonorrhea reported among performers between 2004 - 2013',
  '🪦️ Over 100 straight and gay performers died from AIDS (2013)',
  '🪦️ 36 porn stars that we know of died from HIV, suicide, homicide and drugs between 2007 and 2010.',
  '👦👧 Of all known child abuse domains, 48 percent are housed in the United States.',
  '✚ 26 cases of HIV reported by Adult Industry Medical Healthcare Foundation (AIM), between 2004 - 2013',
  '✚ 70% of sexually transmitted infections in the porn industry occur in females according to County of Los Angeles Public Health',
  '👦👧 Child pornography is one of the fastest growing businesses online, and the content is becoming much worse. In 2008, Internet Watch Foundation found 1,536 individual child abuse domains.',
  '🤵 Of 1351 pastors surveyed, 54% had viewed Internet pornography within the year 2012',
  '💻 There are 4.2 million pornographic websites, 420 million pornographic web pages, and 68 million daily search engine requests. (2013)',
  '⛪ 50% of men and 20% of women in the church regularly view porn',
  '💰 Worldwide pornography revenue in 2006 was $97.06 billion. Of that, approximately $13 billion was in the United States.',
  '📺 More than 11 million teens regularly view porn online',
  '👦👧 The largest group viewing online pornography is ages 12 to 17',
  '👦👧 73% of teens have consumed pornography|https://fightthenewdrug.org/how-many-students-watch-porn-at-school/',
  '✚ Chlamydia and Gonorrhea among performers is 10x greater than that of LA County 20-24 year olds',
  '💔 78% of children to divorced parents are subjected to addiction to pornography',
  '🤦‍♂️ I used to look up to my father before I’ve found out he looks at porn; now, I can’t even look at him.',
  '🤦‍♀️ I used to look up to my father before I’ve found out he looks at porn; now, I can’t even look at him.',
  '🤦 I used to look up to my father before I’ve found out he looks at porn; now, I can’t even look at him.',
  '🤦‍♂️ I’ve found out that my dad looks at porn, I used to look up to him; now, I can’t even look at him. I thought he was a better man.',
  '🤦‍♂️ I’ve found out that my dad looks at porn, I used to look up to him; now, I can’t even look at him. I’ve thought he was a better man.',
  '👧 Ever since I’ve found out that my dad looks at porn, I used to look up to him; now, I can’t look at him. I’ve thought he was a better man than that.',
  '👧 Ever since I’ve found out my father watching at porn, I can’t look at him.',
  '👦 I used to look up to my father before I’ve found out he looks at porn; now, I can’t even look at him.',
  '👧 I used to look up to my father before I’ve found out he looks at porn; now, I can’t even look at him.',
  '👦👧 78% of children to divorced parents are subjected to addiction to pornography. Please, think of your children.',
  '💔 58% of divorce rate is due to porn',
  '💔 58% of divorce rate is due to porn. DO NOT ENDANGER YOUR MARRIAGE',
  '💔 86% of children to divorced parents are subjected to alcohol and drug addiction;  58% of divorce rate is due to porn. DO NOT ENDANGER YOUR MARRIAGE',
  '💔 86% of children to divorced parents are subjected to alcohol and drug addiction;  58% of divorce rate is due to porn. DEAR PARENT, THINK OF WHAT YOU’RE DOING RIGHT NOW AND EXCLUDE YOURSELF FROM THIS UNFORTUNATE STATISTICS',
  '💔 At the 2003 meeting of the American Academy of Matrimonial Lawyers, a gathering of the nation’s divorce lawyers, attendees revealed that 58% of their divorces were a result of a spouse looking at excessive amounts of pornography online.',
  '🪦️ In memory of Mercedes Grabowski aka August Ames (August 23, 1994 - December 5, 2017) she died from asphyxia due to hanging after refusing to shoot a sex scene with another victim who had done gay porn.  She began in the slaughterhouse in 2013 and died in 2017 while she was inside that industry.  Ms. Grabowski was 23 years old at her death. #RIP #19 #23|https://theblast.com/c/pornstar-august-ames-dies-dead-23/',
  '🪦️ In memory of teenager Jazmine Nicole Dominguez aka Violet Rain (July 2, 1999 - March 13, 2019) CAUSE OF DEATH: combined effects of cocaine, ethanol.  She began in the industry in 2018 and died in 2019 while she was inside that slaughterhouse (in less than a year!).  Ms. Dominguez was only 19 years of age. #RIP #19 #18|https://mikesouth.com/porn-deaths/violet-rain-her-cause-of-death-and-new-details-of-her-final-weeks-revealed-51137/',
  '†  In memory of teenager Jazmine Nicole Dominguez aka Violet Rain (July 2, 1999 - March 13, 2019) CAUSE OF DEATH: combined effects of cocaine, ethanol.  She began in the industry in 2018 and died in 2019 while she was inside that slaughterhouse (in less than a year!).  Ms. Dominguez was only 19 years of age. #RIP #19 #18|https://mikesouth.com/porn-deaths/violet-rain-her-cause-of-death-and-new-details-of-her-final-weeks-revealed-51137/',
  '🪦️ [READ] Out of about 1,500 performers in California, 27 people that we know of died from AIDS, suicide, homicide and drug related deaths between 2007 and 2009. 17 more died from medical causes to include lung disease, heart failure and cancer. These are only the deaths. There are many more living with diseases and cancers which are too numerous to count. That’s a total of 44 porn performers in twenty-three months between January, 2007 and December, 2009 who died prematurely from HIV, suicide, drugs, murder and medical illnesses. No other industry has these kinds of statistics, not even the music industry which is at least 10x bigger than the porn industry.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ [READ] Out of about 1,500 performers in California, 27 people that we know of died from AIDS, suicide, homicide and drug related deaths between 2007 and 2009. 17 more died from medical causes to include lung disease, heart failure and cancer. These are only the deaths. There are many more living with diseases and cancers which are too numerous to count. That’s a total of 44 porn performers in twenty-three months between January, 2007 and December, 2009 who died prematurely from HIV, suicide, drugs, murder and medical illnesses. No other industry has these kinds of statistics, not even the music industry which is at least ten times bigger than the porn industry.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ The average life expectancy of a porn performer is only 37.43 years whereas the average life expectancy of an American is 78.1 years.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ The performers are subjected to premature deaths from such causes as drugs, suicide, murder, alcohol abuse, accidental death, and disease.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ The performers are subjected to premature deaths from such causes as drugs, suicide, murder, alcohol abuse, drug abuse, accidental death, and disease.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ The performers are subjected to premature deaths from such causes as drugs, suicide, murder, alcohol abuse, accidental death, and disease. It was also discovered that the average life expectancy of a porn performer is only 37.43 years whereas the average life expectancy of an American is 78.1 years.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ [READ] When the deaths of 129 porn performers over a period of roughly 20 years were analyzed it was discovered that were an unusually large number of premature deaths from such causes as drugs, suicide, murder, alcohol abuse, accidental death, and disease. It was also discovered that the average life expectancy of a porn performer is only 37.43 years whereas the average life expectancy of an American is 78.1 years.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ [READ] Out of about 1,500 performers in California, 27 people that we know of died from AIDS, suicide, homicide and drug related deaths between 2007 and 2009. 17 more died from medical causes to include lung disease, heart failure and cancer. These are only the deaths. There are many more living with diseases and cancers which are too numerous to count.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ [READ] Pornography is big ugly business|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ In memory of teenager Jazmine Nicole Dominguez aka Violet Rain (July 2, 1999 - March 13, 2019) CAUSE OF DEATH: combined effects of cocaine, ethanol.|https://farside.link/invidious/watch?v=fb8OvnyoRrc',
  '📄 [READ] Sexual violence as a sexual script in mainstream online pornography|https://academic.oup.com/bjc/article/61/5/1243/6208896',
  '📄 [READ] Commentary on: Compulsive sexual behaviour disorder|https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6174588/',
  '🫰 Do you really think this content is completely for free?',
  '📈 Do you really think this content is completely for free?  Think again, the more you watch, the more you make that industry to grow stronger and by that you give it more strength to reach out and join YOUR family members into it.  This is true, heaven forbid!  DON’T FEED THE BEAST. #boycottporn',
  '🤔️ Do you really think this content is completely for free?  Think again, the more you watch, the more you make that industry to grow stronger and by that you give it more strength to reach out and join YOUR family members into it.  This is true, heaven forbid!  Don’t Feed The Beast. #boycottporn',
  '🧐️ Did you notice that most of the newcomers are from the poorest areas of Eastern Europe, Russia and South America?  Ask yourself, are they sincerely wanting to be a part of this industry or were they deceived? #boycottporn #dignity',
  '🦸 I want you to support the pornstars featured on this page and LOVE THEM OUT OF PORN!',
  '🦸 I want you to support the performers featured on this page and LOVE THEM OUT OF PORN!',
  '🦸 I want you to LOVE THEM OUT OF PORN! #shelleylubben',
  '🫵 I want you to LOVE THEM OUT OF PORN! #shelleylubben',
  '🫵 I want you to support the pornstars featured on this page and LOVE THEM OUT OF PORN!',
  '🫵 I want you to support a pornstar and LOVE HER OUT OF PORN!',
  '🦸 I want you to support a pornstar and LOVE HER OUT OF PORN ❣ #shelleylubben',
  '🦸 I want you to support a pornstar and LOVE HIM OUT OF PORN! #shelleylubben',
  '❣ I want you to support a pornstar and LOVE HIM OUT OF PORN! #shelleylubben',
  '🫵 I want you to support a pornstar and LOVE HIM OUT OF PORN!',
  '🫶 Love Them Out Of Porn! #shelleylubben',
  '🫶 Love them out of porn',
  '👦 [READ] Porn star writes letter to her unborn child|https://web.archive.org/web/20160828092933im_/https://lifesite-cache.s3.amazonaws.com/images/made/images/remote/https_s3.amazonaws.com/lifesite/Miscellaneous/porn_star_letter_645_3297_55.jpg',
  '📊 [READ] Statistics on Pornography, Sexual Addiction and Online Perpetrators|http://www.safefamilies.org/sfStats.php',
  '💰️ Who are the real beneficiaries of these contents?  Most of the people on stage are getting pennies. #boycottporn',
  '💰️ Who are the real highest beneficiaries of these so-called professionally made contents?  Most of the people on stage are getting pennies. #boycottporn',
  '🔞️🕵️‍♂️ Did you ever ask yourself...  How come those ladies start so early at just the age of 18?  Did you know that agents of the pornography industry visit bars and go to parties where they find girls as young as 15 years old and tell them to call them once they turn exactly 18?  This is seducing into prostitution of a minor (no less!). #18 #boycottporn',
  '☦ In memory of Zoe Parker (March 27, 1996 - September 12, 2020) CAUSE OF DEATH: mixed drug toxicity (ethanol, fentanyl, bupropion) #RIP #20 #18',
  '🪦️ In memory of Jordan Ash (May 27, 1978 - October 19, 2020) CAUSE OF DEATH: brain cancer #RIP #27 #42|https://mikesouth.com/porn-deaths/male-performer-jordan-ash-has-passed-away-rip-66689/',
  '🧠 In memory of Jordan Ash (May 27, 1978 - October 19, 2020) CAUSE OF DEATH: brain cancer #RIP #27 #42|https://mikesouth.com/porn-deaths/male-performer-jordan-ash-has-passed-away-rip-66689/',
  '🪦️ In memory of Zoe Parker (March 27, 1996 - September 12, 2020) CAUSE OF DEATH: mixed drug toxicity (ethanol, fentanyl, bupropion) #RIP #20 #18',
  '☦ In memory of Zoe Parker (March 27, 1996 - September 12, 2020).  She passed away in her sleep, less than a year after she retired.  She was in the industry for 5 years.  Ms. Parker was 24 years old at her death. #RIP #20 #18|https://www.dailymail.co.uk/news/article-8731689/Ex-porn-star-Zoe-Parker-dies-sleep-age-24-just-months-leaving-industry.html',
  '🪦️ In memory of Zoe Parker (March 27, 1996 - September 12, 2020).  She passed away in her sleep, less than a year after she retired.  She was in the industry for 5 years.  Ms. Parker was 24 years old at her death. #RIP #20 #18|https://www.dailymail.co.uk/news/article-8731689/Ex-porn-star-Zoe-Parker-dies-sleep-age-24-just-months-leaving-industry.html',
  '⚔️ Just because there are no guns, does not mean there is no war.  There is a war against you and your unborn children.  What would you choose to do?',
  '👶 Just because there are no guns, does not mean there is no war.  There is a war against you and your unborn children.  What would you choose to do?',
  '⚔️ Just because there are no guns, doesn’t mean there’s no war.  There is a war against you and your unborn children.  What would you choose to do?',
  '👶 Just because there are no guns, doesn’t mean there’s no war.  There is a war against you and your unborn children.  What would you choose to do?',
  '🧠 Relevant Research and Articles About the Studies|https://www.yourbrainonporn.com/relevant-research-and-articles-about-the-studies/',
  '🚫️ Ban pornography|https://denshi.org/antiporn',
  '🚫️ Ban Porn|https://denshi.org/antiporn',
  '👨‍🏫️ “The only things that I learned in school that are worth learning were reading, writing and arithmetic.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '👨‍🏫️ “The only things that I learned in school that are worth learning were reading, writing and arithmetic; and pretty much everything else was complete brainwashing.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '👨‍🏫️ “The only things that I learned in school that are worth learning were reading, writing and arithmetic; and pretty much everything else was complete brainwashing.” (and you can learn so much more on your own) -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🤵 “I learned much more, once I’ve finally got out of college, than I’ve ever did in my entire life in elementary, middle school, high school, university.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🧑 “I learned much more, once I’ve finally got out of college, than I’ve ever did in my entire life in elementary, middle school, high school, university. All that did was waste my time.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '👨‍🏫️ “I learned much more, once I’ve finally got out of college, than I’ve ever did in my entire life in elementary, middle school, high school, university. All that did was waste my time, making me learn a bunch of subjects that either were completely irrelevant to my life or just lying, just completely wrong.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '👨‍🏫️ “I learned much more, once I’ve finally got out of college, than I’ve ever did in my entire life in elementary, middle school, high school, university. All that did was waste my time, making me learn a bunch of subjects that either were completely irrelevant to my life or just completely wrong.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '👨‍🏫️ “The whole education system is teaching us not to believe our senses.” -- Eric Dubay interview by Greg Carlwood of THC (The Higherside Chats) show #ignoreschool|https://www.thehighersidechats.com/eric-dubay-the-flat-earth-theory/',
  '🌴 “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🌄 “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🌅 “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🏝️ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '◊ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '👨‍🏫️ “It’s no wonder that so many people get so heated about these topics, because of this 20 years of indoctrination/education” -- Sean Condon of Truth Seekers Farm show, in an interview with Eric Dubay #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '👨‍🏫️ “It’s no wonder that so many people get so heated about these topics, because of this 20 years of indoctrination/education. Not everyone has the spark in them to question things.” -- Sean Condon of Truth Seekers Farm show, in an interview with Eric Dubay #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🏛️ [READ] Psychological and Forensic Challenges Regarding Youth Consumption of Pornography: A Narrative Review|https://www.mdpi.com/2673-7051/1/2/9',
  '🚫️👙️ Abolish porn',
  '🚫️👙️ Abolish XXX',
  '🚫️👹️ Abolish XXX',
  '🚫️👹️ Abolish 666',
  '🚫️🧑‍🚀 Abolish NASA(T) -> SA(T)AN',
  '🚫️👹️ Abolish the beast',
  '🚫️👿 Abolish satan',
  '🧑‍🚀 It’s all Fake! Even your porn|https://fakeotube.com/video/5946/tranquilizer---this-is-one-of-the-best-that-you-can-see-going-against-nasa-and-their-bs.-of-course-the-governor-won-t-do-jack-shit.-and-the-same-fraud-goes-for-elon-and-his-spacex.-it-...',
  '🧑‍🚀 Space is Fake! And so is your porn...|https://fakeotube.com/video/5946/tranquilizer---this-is-one-of-the-best-that-you-can-see-going-against-nasa-and-their-bs.-of-course-the-governor-won-t-do-jack-shit.-and-the-same-fraud-goes-for-elon-and-his-spacex.-it-...',
  '🧑‍🚀 Space is Fake!|https://fakeotube.com/video/5946/tranquilizer---this-is-one-of-the-best-that-you-can-see-going-against-nasa-and-their-bs.-of-course-the-governor-won-t-do-jack-shit.-and-the-same-fraud-goes-for-elon-and-his-spacex.-it-...',
  '🧑‍🚀 It’s all CGI!|https://fakeologist.com/blog/2023/04/28/bringing-nasa-lies-to-the-county-commissioners/',
  '🧑‍🚀 It’s all Fake!|https://fakeotube.com/video/5946/tranquilizer---this-is-one-of-the-best-that-you-can-see-going-against-nasa-and-their-bs.-of-course-the-governor-won-t-do-jack-shit.-and-the-same-fraud-goes-for-elon-and-his-spacex.-it-...',
  '💰️ There is no money as pension; FAMILY IS THE PENSION!',
  '💰️ There is no such thing as money as pension; FAMILY IS THE PENSION!',
  '💰️ Fuck money as pension; FAMILY IS TRUE PENSION!',
  '💸️ Fuck paper money as pension; FAMILY IS THE REAL PENSION!',
  '💸️ Money is a fake pension; FAMILY IS THE REAL PENSION!',
  '💸️ Money is a fake pension; FAMILY IS THE PENSION!',
  '💸️ Money is a fake pension; FAMILY IS THE ACTUAL PENSION!',
  '💸️ Money is a fake pension; FAMILY IS REALLY YOUR PENSION!',
  '👨‍👩‍👦 Money as pension is false; FAMILY IS THE TRUE PENSION!',
  '👨‍👩‍👦 Money as pension is fake; FAMILY IS THE REAL PENSION!',
  '👨‍👩‍👦 Money as pension is fake; FAMILY IS YOUR REAL PENSION!',
  '👨‍👩‍👦 Money as pension is a joke; FAMILY IS THE REAL PENSION!',
  '👨‍👩‍👦 Money as pension is a fraud; FAMILY IS THE REAL PENSION!',
  '👨‍👩‍👦 Money as pension is a fraud; CHILDREN ARE THE REAL PENSION!',
  '👨‍👩‍👦 Money as pension is a fraud; KIDS ARE THE REAL PENSION!',
  '👶 Dad, please turn it off, find Mom, get married and make me a reality.',
  '👦 Dad, please turn it off, find Mom, get married and make me a reality.',
  '👧 Dad, please turn it off, find Mom, get married and make me a reality.',
  '👦 Mom, please turn it off, find Dad, get married and make me a reality.',
  '👶 Mom, please turn it off, find Dad, get married and make me a reality.',
  '👧 Mom, please turn it off, find Dad, get married and make me a reality.',
  '👶 Dad, please turn it off! With love, your unborn child.',
  '👶👦 Dad, please turn it off! With love, your loving (yet unborn) children.',
  '👶👧 Dad, please turn it off! With love, your loving (yet unborn) children.',
  '👶👦👧 Dad, please turn it off! With love, your loving (yet unborn) children.',
  '👶👦👧 FACT: An Orthodox Jewish family enumerates 10 children in average, some have even 20 children. It is never too late for you to make at least 5 children, even if you are 40. START TODAY! #dontstayhome',
  '👶👦👧 FACT: An Orthodox Amish family enumerates 10 children in average, some have even 20 children. It is never too late for you to make at least 5 children, even if you are 40. START TODAY! #dontstayhome',
  '👶👦👧 FACT: An Orthodox Anabaptist family enumerates 10 children in average, some have even 20 children. It is never too late for you to make at least 5 children, even if you are 40. START TODAY! #dontstayhome',
  '👶👦👧 FACT: An Orthodox Christian family enumerates 10 children in average, some have even 20 children. It is never too late for you to make at least 5 children, even if you are 40. START NOW! #dontstayhome',
  '👶👦👧 Kids are fun! GET MARRIED AND START NOW! #dontstayhome',
  '😊 Kids are fun! GET MARRIED AND START TODAY! #dontstayhome',
  '😁 Kids are fun! GET MARRIED AND START NOW! #dontstayhome',
  '😃 Kids are fun! GET MARRIED AND START NOW! #dontstayhome',
  '☺️ Kids are fun! GET MARRIED AND START NOW! #dontstayhome',
  '😊 Kids are fun! GET MARRIED AND START NOW! #dontstayhome',
  '🤱 Kids are fun! GET MARRIED AND START NOW! #dontstayhome',
  '👶👦👧 Kids are your only hope! GET MARRIED AND START NOW! #dontstayhome',
  '🤱 Kids are our hope! GET MARRIED AND START TODAY! #dontstayhome',
  '👶 Dad, please turn it off! What would you choose to do?',
  '👶 Mom, please turn it off! With love, your unborn child.',
  '👶👦 Mom, please turn it off! With love, your loving (yet unborn) children.',
  '👶👧 Mom, please turn it off! With love, your loving (yet unborn) children.',
  '👶👦👧 Mom, please turn it off! With love, your loving (yet unborn) children.',
  '👶 Mom, please turn it off! What would you choose to do?',
  '✝️ In memory of Kathryn Sue Johnston aka Hunter Bryce (October 9, 1980 - April 13, 2011), Ms. Johnston was 30 at her death.  She was discovered dead at her home.  In an interview (2008) Ms. Johnston said she thought she would become a college professor teaching literature someday.  Unfortunately, for us, it didn’t happen. Ms. Johnston graduated double major in non-fiction writing and literature #RIP #30 #26|https://porninthevalley.wordpress.com/2011/05/28/adult-performer-hunter-bryce-has-passed-away-her-agent-confirmed-wednesday/',
  '🪦️ In memory of Kathryn Sue Johnston aka Hunter Bryce (October 9, 1980 - April 13, 2011), Ms. Johnston was 30 at her death.  She was discovered dead at her home.  In an interview (2008) Ms. Johnston said she thought she would become a college professor teaching literature someday.  Hunter was a graduate of the University of Pittsburgh, her hometown, where she completed a double major in non-fiction writing and literature.  Her stage name was in part a nod to her favorite author, journalist Hunter S. Thompson. #RIP #30 #26|https://porninthevalley.wordpress.com/2011/05/28/adult-performer-hunter-bryce-has-passed-away-her-agent-confirmed-wednesday/',
  '☨ In memory of Kathryn Sue Johnston aka Hunter Bryce (October 9, 1980 - April 13, 2011), Ms. Johnston was 30 at her death.  She was discovered dead at her home.  In an interview (2008) Ms. Johnston said she thought she would become a college professor teaching literature someday.  Hunter was a graduate of the University of Pittsburgh, her hometown, where she completed a double major in non-fiction writing and literature.  Her stage name was in part a nod to her favorite author, journalist Hunter S. Thompson. #RIP #30 #26|https://porninthevalley.wordpress.com/2011/05/28/adult-performer-hunter-bryce-has-passed-away-her-agent-confirmed-wednesday/',
  '👹️ [WATCH] Ex Porn Star Veronica Lain Attacked by Demons|https://farside.link/invidious/watch?v=j0CO-q2ztZk',
  '⛩️ Porn In The Valley – What Happens in Porn Affects Us All <porninthevalley.wordpress.com>|https://porninthevalley.wordpress.com',
  '🧑‍🏫️ She died because she was exploited in the Sex Industry as Mentally Defective Sex Slave.  No woman can survive after being gang-raped for 100 times. -- Jane Doe on Hunter Bryce. #RIP',
  '🧑‍🏫️ She died because she had been exploited in the Sex Industry as Mentally Defective Sex Slave.  No woman can survive after being gang-raped for 100 times. -- Jane Doe on Hunter Bryce. #RIP',
  '✞ In memory of Amanda Friedland aka Shyla Stylez (September 23, 1982 - November 9, 2017).   Ms. Friedland (div.) was found unresponsive in her bed by her mother, who was visiting her.  She was a subject to the atrocities of the industry for over 16 years.  She divorced in less than a year of marriage in 2003.  Ms. Friedland was 35 at her death. #RIP #35 #20 #18|https://wikiless.org/wiki/Shyla_Stylez#Death',
  '🪦️ In memory of Amanda Friedland aka Shyla Stylez (September 23, 1982 - November 9, 2017).   Ms. Friedland was 35 at her death. #RIP #35 #20 #18|https://wikiless.org/wiki/Shyla_Stylez#Death',
  '🪦️ In memory of Amanda Friedland aka Shyla Stylez (September 23, 1982 - November 9, 2017).   Ms. Friedland (div.) was found unresponsive in her bed by her mother, who was visiting her.  Ms. Friedland was 35 at her death. #RIP #35 #20 #18|https://wikiless.org/wiki/Shyla_Stylez#Death',
  '🪦️ In memory of Amanda Friedland aka Shyla Stylez (September 23, 1982 - November 9, 2017).   Ms. Friedland (div.) was found unresponsive in her bed by her mother, who was visiting her.  She was a subject to the atrocities of the industry for over 16 years.  She divorced in less than a year of marriage in 2003.  Ms. Friedland was 35 at her death. #RIP #35 #20 #18|https://wikiless.org/wiki/Shyla_Stylez#Death',
  '🤵👰‍♀️ Find a REAL BRIDE, not shadow, digital, imaginary brides. #dontstayhome',
  '👨👰‍♀️ Find a REAL BRIDE, not shadow, digital, imaginary brides. #dontstayhome',
  '👩🤵 Find a REAL GROOM, not shadow, digital, imaginary bridegrooms. #dontstayhome',
  '👰‍♀️🤵 Find a REAL GROOM, not shadow, digital, imaginary bridegrooms. #dontstayhome',
  '👩🤵 Get a real man #dontstayhome',
  '👰‍♀️🤵 Get a true man #dontstayhome',
  '👰‍♀️🤵 Get a real groom #dontstayhome',
  '👩🤵 Get a real groom #dontstayhome',
  '👨👰‍♀️ Get a real woman #dontstayhome',
  '🤵👰‍♀️ Get a real woman #dontstayhome',
  '🤵👰‍♀️ Get a true woman #dontstayhome',
  '👨👰‍♀️ Get a real bride #dontstayhome',
  '⚠️ WARNING: Sex trafficking and sexual violence are interlaced with pornography',
  '🙈️ Don’t ignore.  Sex trafficking and sexual violence are deeply connected to pornography.  There’s no way around it.',
  '👩️ #WAP and #WAVPM are back online!|https://wikiless.org/wiki/Women_Against_Violence_in_Pornography_and_Media',
  '👩️ Women Against Pornography (WAP) est. 1978 #NYC #WAP|https://wikiless.org/wiki/Women_Against_Pornography',
  '🫵 I want YOU to find a groom #dontstayhome',
  '🫵 I want YOU to get a bridegroom #dontstayhome',
  '🫵 I want YOU to find a bride #dontstayhome',
  '🫵 I want YOU to get a bride #dontstayhome',
  '⚠️ WARNING! You are in the verge of demasculinise yourself.  Go out for a jog 🏃️🏃‍♀️️ #dontstayhome',
  '⚠️ WARNING! You are in the verge of demasculinise yourself.  Go out for a jog 🏃‍♀️️🏃️ #dontstayhome',
  '🏃‍♀️️🏃️🏃‍♀️️ Jogging will make the ladies chase you.  In order to keep your manhood, we advise you to press [Ctrl+W] and get outdoor for some good sports. #dontstayhome',
  '🎂 Happy Birthday! to your unborn child #ignoreporn',
  '🎂 Happy Birthday! to your unborn child #dontstayhome',
  '🗓 Next week is the birthday of your unborn child #ignoreporn #dontstayhome',
  '🗓 Next week is the birthday of your 7 years old unborn child #ignoreporn #dontstayhome',
  '🗓 Next week is the 20th birthday of your unborn child. It’s still not too late to make children #ignoreporn #dontstayhome',
  '🗓 Next week is the 20th birthday of your unborn child. It’s still not too late to get married #ignoreporn #dontstayhome',
  '🗓 Next week is the birthday of your 20 years old unborn child #ignoreporn #dontstayhome',
  '🗓 Your time is running out.  Before you know it, you might find yourself single at the age of 50 Without Your Unborn 15yo - 30yo Children.  What are you doing watching this?! #dontstayhome',
  '⌛️ Your time is running out.  Before you know it, you might find yourself still single at the age of 50 Without Your Unborn 15yo - 30yo Children.  What are you doing watching this?! #dontstayhome',
  '🪄️ Press [Ctrl+Q] or [Ctrl+W] to let the magic come to you|javascript:window.close()',
  '🤵💭️ I don’t understand... Where is she? (Hey sis.. the man of your dreams is waiting for you.  Don’t let him wait any longer) #dontstayhome',
  '👰‍♀️💭️ I don’t understand... Where is he? (Hey bro.. the woman of your dreams is waiting for you.  Don’t let her wait any longer) #dontstayhome',
  '💸️ Where the pornography money really goes to?  Melissa Kay Sims aka Dahlia Sky (RIP) had an overhaul of 80 million views for her work in the course of 10 years.  How did she end up homeless living in her car?|https://torontosun.com/entertainment/celebrity/porn-star-dahlia-sky-dies-from-gunshot-after-terminal-cancer-diagnosis',
  '🎞️ [WATCH] Detox by Jason Evert|https://farside.link/invidious/watch?v=SPxlDPQYSag',
  '☣️ Got Detox?|https://farside.link/invidious/watch?v=SPxlDPQYSag',
  '☣️ Detox|https://farside.link/invidious/watch?v=SPxlDPQYSag',
  '🎦 [WATCH] A little of Detox dose from Jason Evert wouldn’t harm you ;-)|https://farside.link/invidious/watch?v=SPxlDPQYSag',
  '🏠️ Don’t stay home #dontstayhome',
  '🙏️ When you stop, please pray for the participants of this video to stop too.',
  '🧒 [READ] 7 Steps if You Have a Child Addicted to Porn|https://www.imom.com/steps-if-child-addicted-to-porn/',
  '👩️ [READ] Popular Porn Performer Lisa Ann Describes Extreme Abuse New Performers Endure|https://fightthenewdrug.org/hall-of-fame-ex-porn-star-talks-extreme-damage-done-to-new-performers/',
  '👊️ [READ] 10 Ways to Fight Pornography|https://www.allprodad.com/10-ways-to-fight-pornography/',
  '💁‍ #1 Technology Can Be a Fish or a Snake [4 Important Reminders About Helping Someone Quit Porn]|https://www.covenanteyes.com/2022/12/19/4-important-reminders-about-helping-someone-quit-porn/',
  '🐟 #1 Technology Can Be a Fish or a Snake [4 Important Reminders About Helping Someone Quit Porn]|https://www.covenanteyes.com/2022/12/19/4-important-reminders-about-helping-someone-quit-porn/',
  '🐍 #1 Technology Can Be a Fish or a Snake [4 Important Reminders About Helping Someone Quit Porn]|https://www.covenanteyes.com/2022/12/19/4-important-reminders-about-helping-someone-quit-porn/',
  '🎳 #2 Bumpers Can’t Make You a Better Bowler [4 Important Reminders About Helping Someone Quit Porn]|https://www.covenanteyes.com/2022/12/19/4-important-reminders-about-helping-someone-quit-porn/',
  '🐑 #3 We Should Smell Like the Sheep [4 Important Reminders About Helping Someone Quit Porn]|https://www.covenanteyes.com/2022/12/19/4-important-reminders-about-helping-someone-quit-porn/',
  '💁‍ #4 What’s Your Role in a Porn Struggler’s Life? [4 Important Reminders About Helping Someone Quit Porn]|https://www.covenanteyes.com/2022/12/19/4-important-reminders-about-helping-someone-quit-porn/',
  '💁‍ #1 Admit you have a problem [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#admit',
  '🫂 #2 Invite trusted friends to encourage you and hold you accountable [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#invite',
  '🗓 #3 Online accountability [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#accountability',
  '📱 #4 Set boundaries with your mobile device [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#boundaries',
  '🚮 #5 If you have offline pornography at your disposal, destroy it [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#disposal',
  '📺 #6 Take all forms of media seriously [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#media',
  '💁‍♂️️ #7 If you are married, take a step back and think on your marriage [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#married',
  '💁‍♀️️ #8 Realize that you didn’t just become addicted to porn [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#realize',
  '🤔 #9 Take a second and think beyond the images or videos you’re looking at [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#think',
  '🧐 #9 Take a second and think beyond the images or videos you’re looking at [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#think',
  '💁‍♀️️ #9 Take a second and think beyond the images or videos you’re looking at [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#think',
  '⛓️ #9 Take a second and think beyond the images or videos you’re looking at: This is a person, a real woman, a human being created by God, just like you. She’s somebody’s daughter, sister, or even mother. Think of what her life must be like in front of the camera day after day, exploited and made insanely vulnerable. Chances are good that she’s a sex trafficking victim and your addiction is helping to fund this multibillion-dollar crime. She does not exist for your enjoyment. She is being held captive and more than likely is crying out for help.|https://www.allprodad.com/10-ways-to-fight-pornography/#think',
  '💁‍♀️️ #10 Your pornography addiction is a heart issue first and foremost [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#issue',
  '✊️ [READ] 3 Reasons Why Giving Up Porn Can Give You More Independence|https://fightthenewdrug.org/fighting-against-porn-isnt-only-for-couples/',
  '💁‍♀️️ #1 Not watching can make you happier [3 Reasons Why Giving Up Porn Can Give You More Independence]|https://fightthenewdrug.org/fighting-against-porn-isnt-only-for-couples/#happier',
  '😃 #1 Not watching can make you happier [3 Reasons Why Giving Up Porn Can Give You More Independence]|https://fightthenewdrug.org/fighting-against-porn-isnt-only-for-couples/#happier',
  '💁‍♂️️ #2 Ditching porn can make you freer [3 Reasons Why Giving Up Porn Can Give You More Independence]|https://fightthenewdrug.org/fighting-against-porn-isnt-only-for-couples/#freer',
  '💁️ #3 Elimitate sex trafficking and sexual violence at mass scale [3 Reasons Why Giving Up Porn Can Give You More Independence]|https://fightthenewdrug.org/fighting-against-porn-isnt-only-for-couples/#violence',
  '✊️ [READ] The First 90 Days: Recovery from Porn and Sex Addiction|https://www.blazinggrace.org/first-90-days/',
  '🎓 Porn (noun) The traditional way for young female Americans to afford university education (those not from wealthy families). "America is the land of opportunity - everyone can succeed if they are willing to involve themselves in some porn to get their university education." -- Stuart October 12, 2003 #ignoreschool #boycottporn',
  '👩‍❤️‍👨 [READ] When a Wife Must Confront Her Husband (Make sure your wife sees this article. It can save your marriage)|https://www.blazinggrace.org/wife-must-confront-husband/',
  '👩‍❤️‍👨 [READ] When a Wife Must Confront Her Husband (Make sure your wife see this article. It can save your life)|https://www.blazinggrace.org/wife-must-confront-husband/',
  '👩‍❤️‍💋‍👨 [READ] When a Wife Must Confront Her Husband (Send this article to your wife, directly or indirectly via a friend)|https://www.blazinggrace.org/wife-must-confront-husband/',
  '👩‍❤️‍👨 [READ] When a Wife Must Confront Her Husband|https://www.blazinggrace.org/wife-must-confront-husband/',
  '🦾️ BE A MAN, NOT A PUSSY! TURN IT OFF!',
  '🦾️ Turn it off to RESTORE YOUR MANHOOD!',
  '✊️ Turn it off to TAKE CONTROL OF YOUR LIFE!',
  '✊️ Turn it off to take control of your LIFE!',
  '✊️ Turn it off to take control of your Life!',
  '✊️ Turn it off to take control of your life!',
  '✊️ TAKE CONTROL OF YOUR LIFE!',
  '✊️ TAKE CONTROL OF YOUR LIFE! #fuckporn',
  '✊️ TAKE CONTROL OF YOUR LIFE! #ignoreporn',
  '✊️ TAKE CONTROL OF YOUR LIFE! #boycottporn',
  '💀 [NOTICE] You might be watching naked people who are now naked in a coffin #RIP',
  '💿 [NOTICE] Some of the girls you are watching were created by CGI (i.e. not human)',
  '🤖 [NOTICE] Some of the girls in porn are created by CGI (i.e. not real human)',
  '📀 [NOTICE] Some of the girls in porn, aren’t human (created by CGI, same way NASA fakes space)',
  '💽 [NOTICE] Some of the girls in porn, aren’t even real (created by CGI, same way NASA fakes space)',
  '🖥️ [NOTICE] Some of the girls in porn, aren’t even human (created by CGI, same way NASA fakes space)',
  '⚰️ [NOTICE] Some of the girls in porn, aren’t even alive. #RIP',
  '⚰️ [NOTICE] Some of the people in porn, aren’t even alive. #RIP',
  '⚰️ [NOTICE] You might be watching naked people who are now naked in a coffin #RIP',
  '🪦️ [READ] I see dead pornstars|https://www.sfgate.com/national/article/Another-porn-actress-dies-way-too-young-4th-in-12485728.php',
  '⚰️ [READ] I see dead pornstars|https://www.sfgate.com/national/article/Another-porn-actress-dies-way-too-young-4th-in-12485728.php',
  '💀 [READ] I see dead pornstars|https://www.sfgate.com/national/article/Another-porn-actress-dies-way-too-young-4th-in-12485728.php',
  '❓ Does this really help you in any way?',
  '❓ Ask yourself... Does this really help you in any way?',
  '❓ Struggle?|https://www.covenanteyes.com/2022/12/19/4-important-reminders-about-helping-someone-quit-porn/',
  '❓ [READ] Is Porn Bad?: 10 Things to Consider Before Watching|https://www.covenanteyes.com/2022/09/12/is-porn-bad-10-things-to-consider-before-watching/',
  '👙️ It isn’t natural to undress in front of strangers. Then, what makes you think watching this is normal?',
  '👙️ You are at a bordel (whorehouse)',
  '👙️ It isn’t natural to undress in front of strangers.  What are you doing watching this?',
  '🩲️ If it’s unnatural to undress in front of strangers. Then, what are you doing watching this?',
  '👩 [READ] Former Porn Actress: The Lure of Pornography by Dorian Tardiff (aka Ava Lauren)|https://www.iamatreasure.com/blog/former-porn-actress-expose',
  '🚪🛋️ The only thing good that may come out of this human butchery is ideas for Interior Design',
  '🪟 The only thing good that may come out of this human butchery is ideas for Interior Design',
  '🪅️ If any of the participants is to commit suicide tomorrow, then Congratulations!  You’re also responsible. #boycottporn',
  '🔪️ You’re killing the participants by using this website #boycottporn',
  '🗡️ You’re killing the participants by using this website #boycottporn',
  '🔫️ You’re killing the participants by using this website',
  '😥️🔫️ The participants of this video might be exactly in this unfortunate state of affairs.  You have the power to prevent it by turning this off.  Close this window with [Ctrl+W]. #rememberdahliasky #boycottporn',
  '🥎️ So... when was the last time you played Tennis?',
  '🎾️ So... when was the last time you played Tennis?',
  '😢️🔫️ Remember Dahlia Sky #rememberdahliasky',
  '🥺️🔫️ Remember Dahlia Sky #rememberdahliasky',
  '🔫️ Remember Dahlia Sky #rememberdahliasky',
  '❤️‍🔥️ Porn kills Love',
  '🌈️ This is my symbol in the sky. For I gave you the firmament 😶‍🌫️️',
  '🌈️ This is my symbol in the sky. For I gave you the firmament 👁️‍🗨️️',
  '👁️‍🗨️️ I thought you have done with this already.  Fear not, for I still love and believe in you.  With love and care, GOD',
  '👁️‍🗨️️ I thought you have done with this already.  I still love and believe in you.  You are FREE to make up your WILL.  I am still waiting for you.  I am always with you and I will always be with you, because you are my child.  With love, GOD',
  '👁️‍🗨️️ I am waiting for you.  I give you sufficient time, but not unlimited time.  What really legitimizes the existence of both good and evil is FREEWILL.  The existence of free will, the ability of humans to make a choice and bear the consequences is what makes you free.  It Is True Liberty.  If I intervened and controlled the outcome, then you wouldn’t have autonomy.  With respect, GOD',
  '👁️‍🗨️️ I am waiting for you.  I give you sufficient time, but not unlimited time.  What really legitimizes the existence of both good and evil is FREEWILL.  The existence of free will, the ability of humans to make a choice and bear the consequences is what makes you free.  IT IS TRUE LIBERTY.  If I intervened and controlled the outcome, then you wouldn’t have autonomy.  With respect, GOD',
  '😇 The Good and The Bad 😈',
  '👿 What really legitimizes the existence of both good and evil is FREEWILL.  The existence of free will, the ability of humans to make a choice and bear the consequences is what makes you free.  It is true liberty.  If I intervened and controlled the outcome, then you wouldn’t have autonomy.  With respect, GOD',
  '😇 What really legitimizes the existence of both good and evil is FREEWILL.  The existence of free will, the ability of humans to make a choice and bear the consequences is what makes you free.  It is true liberty.  If I intervened and controlled the outcome, then you wouldn’t have autonomy.  With respect, GOD',
  '🎭️ What really legitimizes the existence of both good and evil is FREEWILL.  The existence of free will, the ability of humans to make a choice and bear the consequences is what makes you free.  It is true liberty.  If I intervened and controlled the outcome, then you wouldn’t have autonomy.  With respect, GOD',
  '👩‍❤️‍👨️ Porn kills Romance',
  '🔞 Porno is bad for you',
  '🚭 Porno is bad for you',
  //'🚀️ NoFap Porn Addiction Recovery <nofap.com>|https://nofap.com',
  //'🚀️ Join #NoFap|https://nofap.com',
  '🧓👴 I guess your grandparents would not be proud, if they knew that you watch porn... #boycottporn',
  '👦👧 Would your grandchildren be proud, if they knew that you watch porn??? #boycottporn',
  '👦👧 Would your children be proud of you, if they knew that you watch porn??? #boycottporn',
  '👨👩 Would your parents be proud, if they knew that you watch porn??? #boycottporn',
  '🧓👴 Would your grandparents be proud, if they knew that you watch porn??? #boycottporn',
  '👄️ Welcome to the Scoff Industry',
  '💩 Welcome to the Smut Industry',
  '🦵️ Welcome to the Human Flesh Industry',
  '🥩️ Welcome to the contemporary Meat Industry',
  '🥩️ Welcome to the modern Meat Industry',
  '🥩️ Welcome to the new Meat Industry',
  '🥩️ Welcome to the Meat Industry',
  '🗡️ Welcome to the Human Butchery Industry',
  '🔫️ Welcome to the Human Butchery Industry',
  '🔪 Welcome to the Human Butchery Industry',
  '🐏️ Welcome to the Human Butchery Industry',
  '🕸 Do you understand where you are now?',
  '⛓️ Welcome to the Human Trafficking Industry',
  '📿️ Welcome to the Sex Trafficking Industry',
  '⌚️ Wasting time will always lead to consequences.  YOU are The One to bear the consequences.  Avoid consequences by turning this off.',
  '👁️‍🗨️️ Follow my lead.  Go out and get a bride. #dontstayhome',
  '👁️‍🗨️️ When I ask you to join my side, I mean it mentally and spiritually.  I didn’t ask you to join to your local religious fan club.  I want you to recognize that I am with you all the time.  The real temple is inside of you.  YOUR body is THE TEMPLE.',
  '👁️‍🗨️️ I am not the one allowing it.  I don’t restrict Your choice.  Because otherwise, I am a dictator.  I gave you the realm, the sky, the earth, the firmament and the days.  I gave you the good and I gave you the bad.  I gave you Free Will to choose between good and bad.  And I beg you to join my side, the side of good.  Dearly beloved, GOD.',
  '🏝️ Seriously?  Are you really submitting to this cheap nonsense?  THE WORLD IS YOURS.  Go out and get a bride. #dontstayhome',
  '🐏️ Like lambs to slaughter.  Can you not see it?! #boycottporn',
  '🐏️ Like lambs to the slaughter.  Can you not see it?! #boycottporn',
  '🐏️ Like lambs to the slaughterhouse.  Can you not see it?! #boycottporn',
  '🗺️ Fuck the world, not yourself!  Stop watching porn. #dontstayhome',
  '🗺️ Fuck the world - not yourself!  Stop watching porn #dontstayhome',
  '🗺️ Fuck the world. Not yourself!  Stop watching porn #dontstayhome',
  '🗺️ Fuck the world. Not yourself -  Stop watching porn! #dontstayhome',
  '👦 Knowledge For Men <knowledgeformen.com>|https://www.knowledgeformen.com/?ref=tc',
  '💪️ Knowledge For Men <knowledgeformen.com>|https://www.knowledgeformen.com/?ref=tc',
  '🗽 WORKING TO END MODERN DAY SLAVERY <worthwhilewear.org>|https://worthwhilewear.org/?ref=tc',
  '✊ WORKING TO END MODERN DAY SLAVERY <worthwhilewear.org>|https://worthwhilewear.org/?ref=tc',
  '📿️ Human trafficking is the second-largest criminal industry in the world, with over 800,000 people trafficked against their will across international borders each year.|https://worthwhilewear.org/?ref=tc',
  '🎲 By watching porn, you are betting on your life #dontstayhome',
  '🎲 By watching porn, you are betting on your family #dontstayhome',
  '🎲 By watching porn, you are betting your family. Go out, find a mate and reproduce. #dontstayhome',
  '🏝️ Beach time! Go out now! #dontstayhome',
  '🐚 Let’s go to the beach! #dontstayhome',
  '🐬 Let’s go to the beach! #dontstayhome',
  '🐟 Let’s go to the beach! #dontstayhome',
  '🤿 Let’s go to the beach! #dontstayhome',
  '🏝️ Let’s go to the beach! #dontstayhome',
  '🏄 Let’s go to the beach! #dontstayhome',
  '⚓ Beach time! Go out now! #dontstayhome',
  '🏄 Beach time! Go out now! #dontstayhome',
  '🏸 Badminton time! Go out now! #dontstayhome',
  '🎾 Tennis time! Go out now! #dontstayhome',
  '🏄 Surfing time! Go out now! #dontstayhome',
  '🏐 Volleyball time! Go out now! #dontstayhome',
  '🎳 Bowling time! Go out now! #dontstayhome',
  '🥽 Swimming time! Go out now! #dontstayhome',
  '🤿 Diving time! Go out now! #dontstayhome',
  '⛷️ Ski time! Go out now! #dontstayhome',
  '⚽ Soccer time! Go out now! #dontstayhome',
  '⚽ Football time! Go out now! #dontstayhome',
  '⚾ Baseball time! Go out now! #dontstayhome',
  '🏈 Football time! Go out now! #dontstayhome',
  '💡 [TIP] Going out increases your chances to have naked fun with a true mate #dontstayhome',
  '💡 [TIP] Going out will increase your chances to have naked fun with a true mate #dontstayhome',
  '🎙️ [LISTEN] Stop Porn Addiction|magnet:?xt=urn:btih:f57c6250754409149d68758da59c384de1f9a38d&dn=Stop+Your+Porn+Addiction&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  // I've intentionally wrote Mouses, even though the plural of mouse is mice
  '👨‍💻 Mouses look at porn... Are you a Mouse or a Lion?',
  '👨‍💻 Mice look at porn... Are you a Mouse or a Lion?',
  '👩‍💻 Only mice look at porn... Are you a Mouse or a Lion?',
  '🐁 Only mice look at porn... Are you a Mouse or a Lion?',
  '🦁 Only mice look at porn... Are you a Mouse or a Lion?',
  '🫵 Only mice look at porn... BE A LION, or be a cute little mouse... You decide!',
  '🦁 Only mice look at porn... BE A LION?',
  '🎙️ [LISTEN] Detox|magnet:?xt=urn:btih:f57c6250754409149d68758da59c384de1f9a38d&dn=Stop+Your+Porn+Addiction&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '🎙️ [LISTEN] Stop Porn Addiction|magnet:?xt=urn:btih:f57c6250754409149d68758da59c384de1f9a38d&dn=Stop+Your+Porn+Addiction&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '🎙️ [LISTEN] Stop Your Porn Addiction|magnet:?xt=urn:btih:f57c6250754409149d68758da59c384de1f9a38d&dn=Stop+Your+Porn+Addiction&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '🎙 Got Unrestrained?|https://www.knowledgeformen.com/trash-your-porn-quit-masturbating-and-crush-life/?ref=tc',
  '🎙 Got Indulged?|https://www.knowledgeformen.com/trash-your-porn-quit-masturbating-and-crush-life/?ref=tc',
  '🎙 Got Binged?|https://www.knowledgeformen.com/trash-your-porn-quit-masturbating-and-crush-life/?ref=tc',
  '🎙 [LISTEN] How to Stop Masturbating Now and Beat Porn for Good|https://www.knowledgeformen.com/trash-your-porn-quit-masturbating-and-crush-life/?ref=tc',
  '👨‍🏫️ [WATCH] Are you being subverted?|https://farside.link/invidious/watch?v=Or9CeuqcfMY',
  '👨‍🏫️ Got Indulged?|https://farside.link/invidious/watch?v=Or9CeuqcfMY',
  '👨‍🏫️ Got Subverted?|https://farside.link/invidious/watch?v=Or9CeuqcfMY',
  '🗜️ Stressed?|https://farside.link/invidious/watch?v=Or9CeuqcfMY',
  '👨‍🏫️ Subverted?|https://farside.link/invidious/watch?v=Or9CeuqcfMY',
  '👨‍🏫️ [WATCH] “Pornography is de-facto subversion against the free world” --Tomas Schuman aka Yuri Bezmenov #boycottporn|https://farside.link/invidious/watch?v=Or9CeuqcfMY',
  '👰‍♀️❤️‍🤵️ “Sex is The Wedding Vows.” -- Jason Evert|https://farside.link/invidious/watch?v=SPxlDPQYSag',
  '👰‍♀️❤️‍🤵️ Sex is The Wedding Vows|https://farside.link/invidious/watch?v=SPxlDPQYSag',
  '👰‍♀️❤️‍🤵️ Sex is The Wedding Vows, not a sellotape!|https://farside.link/invidious/watch?v=SPxlDPQYSag',
  '📹 [WATCH] The demise of guys - Philip Zimbardo|https://ed.ted.com/lessons/philip-zimbardo-the-demise-of-guys',
  '📼 [WATCH] The great porn experiment - Gary Wilson|https://farside.link/invidious/watch?v=wSF82AwSDiU',
  '🎥 [READ] The great porn experiment - Gary Wilson|https://singjupost.com/gary-wilson-discusses-great-porn-experiment-transcript/',
  '📺 [WATCH] How porn is destroying young men - Gary Wilson|https://farside.link/invidious/watch?v=3adhnLRoxig'
];

arr = location.hostname;
arr = arr.split('.');
len = arr.length;
mkw = arr[len-2];

const indexer = [
  //'1337x,https://www.1337xx.to/?search=',
  //'Kickass Torrents,https://katcr.to/usearch/', // Turn off due to no magnet for the unregistered
  //'LimeTorrents,https://www.limetorrents.to/search/all/', // Too much div ads.  Can't blame them
  //'Lovetorrent,https://lovetorrent.net/index.php?do=search&story=', // Search is fixed at Showing 166204 submitted torrent
  //'MyPorn.Club,https://myporn.club/s/', // TODO Convert space to hyphen
  //'PornChil,https://pornchil.com/?s=', // SiteRips not relevant
  'PornLeech,https://pornleech.ch/index.php?page=torrents&search=',
  'RARBG,https://www.rarbggo.to/search/?search=',
  //'SxyPrn,https://sxyprn.net/', // TODO Convert space to hyphen
  'The Pirate Bay,https://tpb.party/search/',
  'The Porn Bay,https://www1.thepiratebay3.to/s/?porn=on&category=0&q=',
  'Torrents Download,https://www.torrentdownload.info/search?q=',
  //'Torrents Seeker,https://torrentseeker.com/search.php?q=', // Turn off due to CIA spy machine from USA
  //'TRUPORNOLABS,https://trupornolabs.org/search/',
  'xXxAdultTorrent,https://xxxadulttorrent.org/search/',
  //'Yahoo!,https://search.yahoo.com/search?p=torrent%20' + mkw + '%20',
  //'NudeVista,https://www.nudevista.com/?q=', // TODO This one's also of the americans
  ];

backgroundImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

posterImage = 'data:image/webp;base64,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';

// newDoc
const htmlPage = `<html><head><link type="image/svg+xml" rel="shortcut icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚭</text></svg>"><title>Tobacco Cinema</title><meta http-equiv="content-type" content="text/html;charset=utf-8" /><meta name="generator" content="Clear Cinema Player" /><style>*{font-family: system-ui;}body {background-color: #efefef; max-height: 90%; max-width: 100%; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 14px; cursor: default; user-select: none;} body > * {max-width: 100%; outline: none;} #title {font-size: 18px; font-weight: 300; letter-spacing: -1px; text-align: justify; margin: 0; line-height: 30px; display: block; font-size: 2em; margin-block-start: 0.67em; margin-block-end: 0.67em; margin-inline-start: 0px; margin-inline-end: 0px;user-select: text;} #helper {font-size: 25px; line-height: 25px; height: auto; color: #F83600; font-weight: bold; text-transform: uppercase; text-decoration: none; display: block; height: 34px; position: relative; white-space: nowrap; overflow: hidden; text-align: center;} #sub {font-size: 9px; color: #D5D; color:#969696; transform: rotate(-29deg); text-transform: lowercase;} .key {color: #333; font-weight: bold; line-height: 1.42857143;} /* .link {width: 44%;} We can use this space */ .link, .link > a {color: #a94442; font-size: 14px; font-weight: normal;} .link > a:visited {color: DarkRed;} .recommend {background: #fff; border:0.4em solid; padding: 6px; margin: 42px 20% 12px 20%; font-weight: bold; font-size: 142%;} .recommend > div > a {color: #5e2591; font-weight: bold;} .centerm {display: block; margin-left: auto; margin-right: auto; width: 100%;} .centero {margin: auto; width: 50%; /* border: 3px solid green; */ padding: 10px;} .centert {padding: 6px 0px 6px 0px; text-align: center; /* border: 3px solid green; */} .flip {display: inline-block; transform: scaleX(-1); -moz-transform: scaleX(-1); -o-transform: scaleX(-1); -webkit-transform: scaleX(-1); filter: FlipH; -ms-filter: FlipH;} a {padding: 3px;} video {max-height: 80vh; /* outline: auto; */ border-radius: 5px;}.shadow{filter: drop-shadow(2px 4px 6px red);}#fact {font-weight: bold; font-size: 90%; left = 0px; right = 0px; top = 0px; z-index: 10; position: fixed; background-color: #efefef; padding: 3px; border-top: 2px solid red;} .sm {font-size: 80%;} .footer.recommend {user-select: text;max-height:300px;overflow:auto} .quote {color: #efefef; font-style: italic;} .quote:hover {color: #000;} .out {width: 6em} .out:hover .in {display: none;} .out:hover:before {color: #000; content: "liberating";} #deceased {color: BlueViolet; color: DarkRed; /* background: #fff; border: DarkRed 0.3em solid; margin-left: 20%; margin-right: 20%; padding: 9px; */} #deceased {animation: blinker 7.5s linear infinite;} @keyframes blinker{50%{opacity: 0;}}</style></head><body><div scrolldelay="100" id="helper" class="centert">🚭 Tobacco Cinema <span id="sub" title="(bêta)">βῆτᾰ</span></div><video class="centerm" download controls="true" muted="true" preload="none">Your browser does not support the video tag. Install Brave or LibreWolf web browser to play videos.</video><div id="title" title="Click to get another fortune" class="centert"></div><div id="date-key" class="key"> Posted: <div id="date" class="link"> </div></div><div class="key"> Torrents: <div id="torrents" class="link button"></div></div><div id="victims" class="key"><div id="models" class="link"> </div></div><div id="videos" class="key"><div id="downloads" class="link button"></div></div><div id="niche" class="key"><div id="tags" class="link button"></div></div><div class="footer recommend"> <div class="centert sm" title="Double click to hide this message">  For best experience and more privacy, security and speed, we recommend using Brave or LibreWolf web browser </div></div><div class="quote centert sm">  "There is nothing more <span class="out"><span class="in">dangerous</span></span> than personal initiative: if it has genius behind it" </div><hr><div class="footer centert sm"><span class="flip">&copy;</span> The Clear Cinema Team | <a href="https://sleazyfork.org/scripts/467466-tobacco-cinema/feedback">Report issue</a> or visit <a href="${location.href}#utm">original page</a> | <span id="time"> Page loaded at <span id="clock"></span></span></div></body></html>`
// const htmlPage = '<html><head><title>Tobacco Cinema</title><meta http-equiv="content-type" content="text/html;charset=utf-8" /><meta name="generator" content="Clear Cinema Player" /><style>body {background-color: #efefef; max-height: 90%; max-width: 100%; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 14px;}body > * {max-width: 100%;}#title {font-size: 18px; font-weight: 300; letter-spacing: -1px; text-align: justify; margin: 0; line-height: 30px; display: block; font-size: 2em; margin-block-start: 0.67em; margin-block-end: 0.67em; margin-inline-start: 0px; margin-inline-end: 0px;}#helper {font-size: 25px; line-height: 25px; height: auto; color: #F83600; font-weight: bold; text-transform: uppercase; text-decoration: none; display: block; height: 34px; position: relative; white-space: nowrap; overflow: hidden; text-align: center;}.key {color: #333; font-weight: bold; line-height: 1.42857143;} /* .link {width: 44%;} We can use this space */ .link, .link > a {color: #a94442; font-size: 14px; font-weight: lighter;} .link > a:visited {color: DarkRed;} .recommend {background: #fff; border:0.4em solid; padding: 6px; margin: 42px 20% 12px 20%; font-weight: bold; font-size: 142%;}.recommend > div > a {color: #5e2591; font-weight: bold;}.centerm {display: block; margin-left: auto; margin-right: auto; width: 100%;}.centero {margin: auto; width: 50%; /* border: 3px solid green; */ padding: 10px;}.centert {padding: 6px 0px 6px 0px; text-align: center; /* border: 3px solid green; */}.flip {display: inline-block; transform: scaleX(-1); -moz-transform: scaleX(-1); -o-transform: scaleX(-1); -webkit-transform: scaleX(-1); filter: FlipH; -ms-filter: FlipH;} a {padding: 3px;} video {max-height: 560px} #fact {font-weight: bold; font-size: 90%; left = 0px; right = 0px; top = 0px; z-index: 10; position: fixed; background-color: #efefef; padding: 9px; border-bottom: 3px solid red;} .quote {font-style: italic;}</style></head><body><div scrolldelay="100" id="helper" class="centert">🚭 Tobacco Cinema (Beta)</div><video class="centerm" download controls="true" muted="true" preload="none">Your browser does not support the video tag.</video><div id="title" class="centert"></div><div class="footer recommend"> <div class="centert" title="Double click to hide this message">  For best experience and more privacy, security and speed, we recommend using Brave or LibreWolf web browser </div></div><div class="key"> Date: <div id="date" class="link"> </div></div><div class="key"> Torrents: <div id="torrents" class="link button"></div></div><div id="victims" class="key"><div id="models" class="link"> </div></div><div id="videos" class="key"><div id="downloads" class="link button"></div></div><div id="niche" class="key"><div id="tags" class="link button"></div></div><div class="quote centert">  "There is nothing more dangerous than personal initiative: if it has genius behind it" </div><div class="footer centert">  <span class="flip">&copy;</span> The Clear Cinema Team </div><div id="time" class="centert"> Page loaded at <span id="clock" class="centert"></span></div></body></html>'

// progress{max-width:50%;height:3em;}
// <progress class="centerm"></progress>

const introPage = `<html><head><link type="image/svg+xml" rel="shortcut icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐒</text></svg>"><title>Tobacco Cinema</title><meta http-equiv="content-type" content="text/html;charset=utf-8" /><meta name="generator" content="Clear Cinema Player" /><style>*{font-family: system-ui;}body{background-color:#efefef;font-family:"Helvetica Neue", Helvetica,Arial,sans-serif; cursor: default; user-select: none;max-height:100%;max-width:100%;}div{font-size:2.3em;font-weight:bold;}#icon-tc:before{content:"🚭";font-size:4em;display:flow-root;text-align:center;}.shadow{filter: drop-shadow(2px 4px 6px red);}#icon-tc{font-size:3em;}#main{font-size:2em;color:#F83600;text-transform:uppercase;position:relative;text-align:center;}#title:after{content:"TOBACCO CINEMA";}#main{border: solid red;background:#333;}#intro:before{content:"Thank you for choosing Tobacco Cinema"}#wait:before{content:"Please wait while our monkeys prepare the theater"}#loader:after{content:"Loading..."}#loader{font-style: italic;animation:flickerAnimation 1s infinite;} #wait, #reload, #footer {font-size:14px;font-weight:normal;} #wait {font-style: italic;} #reload:after{content:"If you still see this page, reolad page or disable Javascript and reload with [Ctrl + Shift + R] to bypass cache."} .centerm {display:block;margin-left:auto;margin-right:auto;width:100%;}.center{padding:1em 0px 1em 0px;text-align:center;/* border: 3px solid green; */}#fact{background-color: #fff;border:0.4em solid;margin:0 15% 0 15%;font-weight:bold;padding:18px;}@keyframes flickerAnimation {0%{opacity:1;}50%{opacity:0;}100% {opacity:1;}}.flip {display: inline-block; transform: scaleX(-1); -moz-transform: scaleX(-1); -o-transform: scaleX(-1); -webkit-transform: scaleX(-1); filter: FlipH; -ms-filter: FlipH;}</style></head><body><div id="main" class="center shadow"><div id="title"></div></div><div id="intro" class="center"></div><div id="icon-tc" class="shadow"></div><div id="loader" class="center"></div><div id="fact" class="center">For best experience, better privacy, security and speed, we recommend using Brave or LibreWolf web browser.</div><div id="wait" class="center"></div><div id="reload" class="center" onclick="(function(){document.location = document.location})();"></div><div id="footer" class="center"><span class="flip">&copy;</span> The Clear Cinema Team | <a href="https://sleazyfork.org/scripts/467466-tobacco-cinema/feedback">Report issue</a> or visit <a href="${location.href}#utm">original page</a></div></body></html>`

const errorPage = `<html><head><link type="image/svg+xml" rel="shortcut icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚫</text></svg>"><title>Tobacco Cinema</title><meta http-equiv="content-type" content="text/html;charset=utf-8" /><meta name="generator" content="Clear Cinema Player" /><style>*{font-family: system-ui;}body{background-color:#efefef;font-family:"Helvetica Neue", Helvetica,Arial,sans-serif; cursor: default; user-select: none;max-height:100%;max-width:100%;}div{font-size:2.3em;font-weight:bold;}#icon-tc:before{content:"🚭";font-size:4em;display:flow-root;text-align:center;}.shadow{filter: drop-shadow(2px 4px 6px red);}#icon-tc{font-size:3em;}#main{font-size:2em;color:#F83600;text-transform:uppercase;position:relative;text-align:center;}#title:after{content:"TOBACCO CINEMA";}#main{border: solid red;background:#333;}#intro:before{content:"Thank you for choosing Tobacco Cinema"}#loader:after{content:"Error encountered"}#loader{font-style: italic;animation:flickerAnimation 1s infinite;}#error:before{content:"Details: "} #type, #promo, #footer {font-size:14px;font-weight:normal;} #type {font-style: italic;} .centerm {display:block;margin-left:auto;margin-right:auto;width:100%;}.center{padding:1em 0px 1em 0px;text-align:center;/* border: 3px solid green; */}#error{overflow: auto;background-color: #fff;border:0.4em solid;margin:0 15% 0 15%;font-weight:bold;padding:18px;}.flip {display: inline-block; transform: scaleX(-1); -moz-transform: scaleX(-1); -o-transform: scaleX(-1); -webkit-transform: scaleX(-1); filter: FlipH; -ms-filter: FlipH;}</style></head><body><div id="main" class="center shadow"><div id="title"></div></div><div id="intro" class="center"></div><div id="icon-tc" class="shadow"></div><div id="loader" class="center"></div><div id="error" class="center" style="user-select: all;"></div><div id="type" class="center"></div><div id="promo" class="center">For best experience, better privacy, security and speed, we recommend using Brave or LibreWolf web browser</div><div id="footer" class="center"><span class="flip">&copy;</span> The Clear Cinema Team | <a href="https://sleazyfork.org/scripts/467466-tobacco-cinema/feedback">Report issue</a> or visit <a href="${location.href}#utm">original page</a></div></body></html>`

//const cssIntro = 'body {background-color:#efefef;font-family:"Helvetica Neue", Helvetica,Arial,sans-serif;}body{max-height:100%;max-width:100%}div{font-size: 2.3em;font-weight: bold;}#icon-tc{font-size:3em;}#main {font-size: 2em;color: #F83600;text-transform:uppercase;position:relative;text-align:center;}#intro,#wait{font-style:italic;font-weight: normal;}#wait{padding-top:0}#loader{font-style: italic;font-weight:normal;}.centerm {display: block;margin-left:auto;margin-right:auto;width: 100%;}.center {padding:1em 0px 1em 0px;text-align: center;/* border: 3px solid green; */}#fact {background-color: #fff;border: solid;margin: 0 15% 0 15%;font-weight: bold;padding: 18px;}'

//const fragIntro = '<div id="main" class="center"><div id="icon-tc">🚭</div><div id="title">Tobacco Cinema</div></div><div id="intro" class="center">Welcome to Tobacco Cinema!</div><div id="wait" class="center">Please wait while the monkey prepars your video</div><div id="fact" class="center">For best experience and more privacy, security and speed, we recommend using Brave or LibreWolf web browser.</div><div id="loader" class="center">Loading...</div>'

// Message of the day
//motd = motds[Math.floor(Math.random()*motds.length)];
//motdMsg = motd.split('|')[0];
//console.log(motdMsg)

// Loader (loading...)
// Swimming in the sea does help to think of ideas
//let loader = document.createElement('div');
//loader.id = 'fact';
//loader.style.bottom = 0;
//loader.style.left = 0;
//loader.style.right = 0;
//loader.style.top = 0;
//loader.style.zIndex = 10000000000;
//loader.innerHTML = motdMsg;
//let body = document.createElement('body');

//const html = document.querySelector('html');

//html.prepend(body);
//body.prepend(loader);

//document.body.prepend(loader);

// Javascript implementation of Java’s String.hashCode() method
String.prototype.hashCode = function(){
  var hash = 0;
  if (this.length == 0) return hash;
  for (i = 0; i < this.length; i++) {
    char = this.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
// Manwe Security Consulting

/*
// https://openuserjs.org/src/libs/sjehuda/Hash_Code.js
Because of the nature of this program, to make the user to avoid from addiction
case, and among other different reasons the author has chose to hash the
supported hostnames so that once users are recovered from addiction, they
wouldn't use this program to find a different niche that might (god forbid)
restore an addiction case.
*/

// TODO hash paths
const excluded = { 'urls' : [
{ 'hostname' : 1939201903,
  'pathname' : [
  '/chat', '/galleries', '/girls', '/groups', '/images', '/live',
  '/login', '/m', '/random', '/search', '/shouts', '/store',
  '/term', '/upload', '/videos'
  ],
  'pathtype' : 'starts',
  'pagecode' : '#media-media > #mediaspace-image-wrapper > a > #motherless-media-image',
},
{ 'hostname' : -719239027,
  'pathname' : [
  '/categories', '/contents', '/images', '/models',
  '/most-popular', '/new-movies', '/top-rated', '/upload',
  ],
  'pathtype' : 'starts',
  'pagecode' : '#media-media > #mediaspace-image-wrapper > a > #motherless-media-image',
},
{ 'hostname' : -1633001694,
  'pathname' : [
  '/%D7%A1%D7%A8%D7%98%D7%99-%D7%A1%D7%A7%D7%A1-%D7%99%D7%A9%D7%A8%D7%90%D7%9C%D7%99',
  '/%D7%AA%D7%9E%D7%95%D7%A0%D7%95%D7%AA-%D7%A1%D7%A7%D7%A1',
  '/%D7%A1%D7%99%D7%A4%D7%95%D7%A8%D7%99-%D7%A1%D7%A7%D7%A1',
  '/wp-content/'
  ],
  'pathtype' : 'starts',
},
{ 'hostname' : 161994028,
  // TODO 'pathtype' : 'absolute' for pathnames that don
  'pathname' : [
  '/categories', '/channel/', '/partners',
  '/straight', '/channels', '/newest', '/upload'
  ],
  'pathtype' : 'starts',
},
{ 'hostname' : 1312665594,
  'pathname' : [
  '/%D7%A1%D7%A8%D7%98%D7%99-%D7%A1%D7%A7%D7%A1-'
  ],
  'pathtype' : 'starts',
}, // FIXME
{ 'hostname' : -1059113202,
  'pathname' : ['/tag', '/watch'],
  'pathtype' : 'starts',
},
{ 'hostname' : 597898866,
  'pathname' : ['/actor/', '/actors/', '/categories/', '/?s=',],
  'pathtype' : 'starts',
},
{ 'hostname' : 1487350944,
  'pathname' : [
  '/search/', '/categories/', '/channels/', '/stars/',
  '/most-popular/', '/latest-updates/', '/get_file/',
  ],
  'pathtype' : 'starts',
},
{ 'hostname' : -1584194694,
  'pathname' : [
  '/popular/', '/categories/', '/newest/',
  '/search/', '/channels/', '/models/',
  ],
  'pathtype' : 'starts',
},
]};

const included = { 'urls' : [
{ 'hostname' : [
  -1633001694, 1939201903, 1487350944, 161994028,
  -1059113202, 1312665594, -719239027, 597898866,
  -1584194694
  ],
  'pathname' : '/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  1175500525, -468498755, -1903471555, -541491283, 508927357, 150697176,
  1318382313, -549200690, -1607352929, -900812627, 938688328, 231257079,
  1034387597, -322927218, -1570856665, -190628261, 260185968, 113843530,
  2009112007, -541491283, -1457966992, -549200690, 649758119, 726866450,
  1567421844, -322927218, -1821354961, -886418475, 519808330, 245600365,
  1940681512, 1567421844, -1614161126, -468498755, 938688328, 260185968,
  1034491021, -886418475, -1439611482, -900812627, 303903006, 349950473,
  1381019812, 1544611679, -1903471555, -504675209, -60537139, 60433162,
  1479980214, 1020027461, -2044898019, -1455267443, 30281162, -3998427,
  -1240686689, -1512731398
  ],
  'pathname' : '/videos/',
  'pathtype' : 'starts',
},
{ 'hostname' : [-49226400],
  'pathname' : '/movies/',
  'pathtype' : 'starts',
},
{ 'hostname' : [1011086976, -1680029367],
  'pathname' : '/video-*',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  1188431011, 1156913250, -1016825242, -81088632, 811446339, 1964929165,
  1178226912, 1261614485, -1597517923, 313217573, 639613426, 1405205629,
  -426571524, 574913413, -1211908368
  ],
  'pathname' : '/video/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  224542341, -1636726546, -1073731548, 932917002, 1132279251,
  210365742, -1468843954, -1221284475, 516511168
  ],
  'pathname' : '/watch/',
  'pathtype' : 'starts',
},
/*
{ 'hostname' : [129388118, 98006476],
  'pathname' : '/view_video.php',
  'pathtype' : 'starts',
},
*/
/*
{ 'hostname' : [1428415544],
  'pathname' : '-',
  'pathtype' : 'starts',
},
*/
/*
{ 'hostname' : [-1117847037],
  'pathname' : '/application/watch-page/',
  'pathtype' : 'starts',
},
*/
{ 'hostname' : [-819587284],
  'pathname' : '/v/',
  'pathtype' : 'starts',
},
{ 'hostname' : [-1005701525, -315317259],
  'pathname' : '/gal/',
  'pathtype' : 'starts',
},
{ 'hostname' : [396670300],
  'pathname' : '/VideoPage.aspx?VideoID=',
  'pathtype' : 'starts',
},
{ 'hostname' : [-298399834],
  'pathname' : '/porn-videos/',
  'pathtype' : 'starts',
},
{ 'hostname' : [977517469],
  'pathname' : '/ktm/',
  'pathtype' : 'starts',
},
{ 'hostname' : [-1680029367],
  'pathname' : '/hd-porn/',
  'pathtype' : 'starts',
},
{ 'hostname' : [1873419916, -491772566, -469933],
  'pathname' : '/video',
  'pathtype' : 'starts',
}
]};

// ad sites
// limp-wonder.com
// adspopup.click
hashes_ads = [
  -1305324075,
   -490129151,
    961025689,
  -1610602340,
   1347521369,
  -1157174274,
   1591289753,
   -296661293,
    364181920,
    282306958,
  -1142704877,
  -2101640355,
  -2039236813,
  -2027276020,
  -1838594368,
   1761787538,
  -1539051342,
  -1450605308,
//-1439611482,
   -949608250,
   -911501668,
   -911365632,
   -895403061,
   -845662836,
   -751829743,
   -683145040,
   -656766403,
   -525204187,
   -470993225,
   -440733687,
   -207642069,
   -186382406,
    155288174,
    372322176,
    494231154,
    870004354,
    894707159,
    950208521,
   1054326805,
   1121463404,
   1202831695,
   1344374929,
   1358490619,
   1454774071,
   1514249915,
   1664245810,
   2022393036,
   2046036781,
   2123373562,
]

hashes_tld = [
  -1587421496,
  -1044038468,
    207755749,
    951321706,
   1792338240,
]

// NOTE We want hostname, not top-level domain
tld = window.location.hostname.split('.')
add = tld[tld.length-2] + '.' + tld[tld.length-1]
ths = add.hashCode()
console.info(ths + ', // ' + add)

// TODO Button or top bar to torrent search
// Seperate to different script
if (hashes_tld.includes(ths)) {

  if (location.pathname != '/') {
    title = null
    tags = ['h1', 'h2', 'h3']
    for (let i = 0; i < tags.length; i++) {
      if (!title) {
        try {
          title =
            document
            .querySelector(tags[i])
            .outerText;
            console.info('Title: ' + title);
            //continue
        } catch (err) {
            console.warn('No ' + tags[i]);
          }
      }
    }
  }

  if (title) {
    keywords = title
  } else {
    keywords = tld[tld.length-2]
  }

  // first attempt
  location.href = 'https://tpb.party/search/' + keywords

  // second attempt
  url = 'https://tpb.party/search/' + keywords
  window.top.document.location.replace(url)

}

hash = window.location.hostname.hashCode()
console.info(hash + ', // ' + window.location.origin + '/*')
//alert(hash + ', // ' + window.location.origin + '/*')

if (hashes_ads.includes(hash)) {

  for (const meta of document.querySelectorAll('meta')) {
    console.log(meta)
    meta.remove();
  }

  // first attempt
  location.href = 'https://www.knowledgeformen.com/?ref=tc'

  // second attempt
  //url = 'https://www.knowledgeformen.com/?ref=tc'
  //window.top.document.location.replace(url)

}

// TODO add event listener (click, mousemove, mouseup)
// and promise due to websites that only change url.
// NOTE Bettre use setInterval of several seconds.
// see -1059113202
// https://stackoverflow.com/questions/48832495/wait-and-stop-executing-code-till-an-event-handler-fires
if (location.pathname == '/') return // Exit if path = root

/*
// this is where we check whether we execute script
if (hashes_tbe.includes(hash)) {
  if (location.pathname.includes('/embed/')) {
    console.log("embedded")
    // Redirect if page is embedded video
    // TODO try/catch and replace /embed/ by /video/
    location.href = 
      document
      .querySelector('link[rel="canonical"]')
      .href
  }
} else {
  //console.log("exit")
  return; // exit
}
*/

let executer = false;
const pathname = window.location.pathname;

for (let i = 0; i < excluded.urls.length; i++) {
  if (hash == excluded.urls[i].hostname) {
    for (let j = 0; j < excluded.urls[i].pathname.length; j++) {
      if (pathname.startsWith(excluded.urls[i].pathname[j])) {
        return; // exit
      }
    }
  }
}

for (let i = 0; i < included.urls.length; i++) {
  if (pathname.startsWith(included.urls[i].pathname) &&
      included.urls[i].hostname.includes(hash))
      executer = true;
      continue;
}

if (!executer) {return;} // exit

/*
window.onbeforescriptexecute = (event) => {
  for (const scriptElement of document.querySelectorAll('script')) {
    console.log('scriptElement')
    console.log(scriptElement)
    scriptElement.remove()
    scripts.push(scriptElement)
  }
}
*/

window.onprogress = (event) => {
  introPageLoader()
}

let contentReady = new Promise(function(resolve, reject) {
  let request = new XMLHttpRequest();
  request.open('GET', location.href);
  request.onload = function() {
    if (request.status == 200) {
      resolve(request);
    } else {
      // TODO Catch and pass error
      console.log('onload error');
      console.log(request.status);
      disable = location.href + '#utm';
      message = 'Network error'
      reject(errorPageLoader(request.status, message));
    }
  };
  //request.onprogress = function() {introPageLoader()};
  request.onprogress = (event) => {introPageLoader()};
  //request.onerror = function(e) {errorPageLoader(e, message)};
  request.onerror = function() {
    console.log(request.status);
    disable = location.href + '#utm';
    message = 'Network error';
    if (request.status == 403) {
      console.log('onerror 403')
      reject(errorPageLoader(request.status, message));
    } else if (request.status == 404) {
      console.log('onerror 404');
      reject(errorPageLoader(request.status, message));
    } else {
      // TODO Catch and pass error
      console.log('onerror error');
      reject(errorPageLoader(error, message));
    }
  };
  request.send();
});

contentReady.then(
  function(request) {
    const domParser = new DOMParser();
    const rawDocument = domParser.parseFromString(request.responseText, 'text/html');
    try {
      buildPage(rawDocument)
    } catch (error) {
      disable = location.href + '#utm';
      // TODO make this to reload
      // Currently it works the same as <a href="${disable}"
      message = `Please report this error to the developers or continue to
                 <u><span color="blue"; onclick="window.open('${disable}','_self')">
                 original page</span></u>`
      errorPageLoader(error, message)
      console.error(error)
    }
  },
  // TODO Catch and pass error
  function(error) {
    console.log('contentReady error');
    //console.log(request.status); // <-- Why 'errorPageLoader(error, message)' WORKS! when placing this line???
    //console.log(error);
    message = 'Network error';
    errorPageLoader(request.status, message);
  }
);

/*
// NOTE Cookies
// Click button
buttons = ['button[data-role="confirm"]']
for (let i = 0; i < buttons.length; i++) {
  try {
    document.querySelector(buttons[i]).click()
  } catch {
  }
}
*/

// rawDoc
//const rawDocument = document.cloneNode(true);

// Erase header and body too
// NOTE doing so, at this stage, requires JS to be enabled
//document.head.remove()
//document.body.remove()

/* TODO Intro screen
window.loadstart = (event) => {
  const domParser = new DOMParser();
  const splDocument = domParser.parseFromString(introPage, 'text/html');
  insertDocument = document.importNode(splDocument.documentElement, true);
  removeDocument = document.documentElement;
  document.replaceChild(insertDocument, removeDocument);
}
*/

function buildPage(rawDocument) {

// rawDoc
//const rawDocument = document.cloneNode(true);
//console.warn(rawDocument)
//document.body.innerHTML ='' // Failed
//document.body.remove() // Failed

// TODO if rawDocument is unresolved, Add the following as a box (maybe in iframe)
//var box = document.createElement('iframe');
//box.innerHTML = introPage
//document.body.prepend(box)

// Data collection
// switch (true) {
// case window.location.hostname.endsWith:
switch (hash) {

case -719239027:

// Set video
videoLink =
  rawDocument
  .querySelector('video > source')
  .src;

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName =
  location.hostname + '_' + docURI[3] + '_' + title + '.mp4';

// Get date
calendar =
  rawDocument
  .querySelector('span[itemprop="uploadDate"]')
  .getAttribute('content');

// Get list of participants
for (const participant of rawDocument.querySelectorAll('.last > a[href*="/models/"]')) {
  participants.push(participant);
}

break;

case -819587284:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName =
  location.hostname + '_' + docURI[4] + '_' + title + '.mp4';

// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes(".mp4'")) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract links
scriptData = rawScript[0].textContent;
scriptData = scriptData.split('\n')

// Get list of video qualities (Proof of concept: No parser nor regex)
for (let i = 0; i < scriptData.length; i++) {
  if (scriptData[i].includes(".mp4/'")) {
    vidsSize.push('480p');
    vidsLink.push(scriptData[i].slice(
      scriptData[i].indexOf('video_url:')+12,
      scriptData[i].indexOf('.mp4/')+5)
    );
    if (scriptData[i].includes('video_alt_url')) {
      vidsSize.push('720p');
      vidsLink.push(scriptData[i].slice(
        scriptData[i].indexOf('video_alt_url:')+16,
        scriptData[i].lastIndexOf('.mp4/')+5)
      );
    }
  }
}

// Set video
videoLink = vidsLink[vidsLink.length-1];

break;

case 1939201903:

// Get list of video qualities
for (const source of rawDocument.querySelectorAll('video > source')) {
  vidsSize.push(source.getAttribute('res'));
  vidsLink.push(source.src);
}

// Preferred video resolutions
preferredResolutions = [
  '720p', '480p', '360p'];

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      resolution = preferredResolutions[i];
      videoLink =
        rawDocument
        .querySelector('video > source[res="' + resolution + '"]')
        .src;
    }
  } catch (err) {
      console.warn('No resolution of ' + resolution + ' is available');
      videoLink = null;
    }
}

// Set video
if(!videoLink) {
  videoLink =
    rawDocument
    .querySelector('video > source')
    .src;
}

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName =
  location.hostname + '_' + docURI[3] + '_' + title + '.mp4';

// Get date
calendar =
  rawDocument
  .querySelector('.media-meta-stats > span:nth-child(3)')
  .textContent;

break;

case 574913413:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName =
  location.hostname + '_' + docURI[4] + '_' + title + '.mp4';

// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('landingVideo')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract links
scriptData = rawScript[0].textContent;
scriptData = scriptData.substring(
  scriptData.indexOf('{"'),
  scriptData.lastIndexOf('"}}')+3
);

// Parse JSON
jsonFile = JSON.parse(scriptData);

// Get list of video qualities
resolutions = jsonFile.data.urls_CDN;

// Resolutions
qualities = jsonFile.data.quality; // NOTE Object.keys is not needed

// Find link to file
for (let i = 0; i < qualities.length; i++) {
  if (jsonFile.data.urls_CDN[qualities[i]]) {
    vidsLink.push(jsonFile.data.urls_CDN[qualities[i]]);
    vidsSize.push(qualities[i] + 'p');
  }
}

// Preferred video resolutions
preferredResolutions = [
  '720', '480', '360'];

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      videoLink = jsonFile.data.urls_CDN[preferredResolutions[i]];
    }
  } catch (err) {
      console.warn('No resolution of ' + preferredResolutions[i] + ' is available');
      videoLink = null;
    }
}

break;

case 639613426:

// Set video
videoLink =
  rawDocument
  .querySelector('meta[itemprop="contentUrl"]')
  .content;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName =
  location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get date
calendar =
  rawDocument
  .querySelector('div > div:nth-child(5)')
  .textContent;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('a.movie-actor-item[href*="/pornstars-profile/"]')) {
  do {
    element = participant.querySelector('*');
    participant.removeChild(element);
    } while (participant.querySelector('*'));
  participants.push(participant);
}

break;

case -1457966992:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .textContent;

// Set video
videoLink =
  rawDocument
  .querySelector('video > source')
  .src;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName =
  location.hostname + '_' + docURI[4] + '.mp4';

// Get date
calendar =
  rawDocument
  .querySelector('span[itemprop="uploadDate"]')
  .content;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('.info_row > a[href*="/models/"]')) {
  participants.push(participant);
}

break;

case -504675209:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .textContent;

// Set video
videoLink =
  rawDocument
  .querySelector('a[href*=".mp4/"]')
  .href;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName =
  location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

// Get date
calendar =
  rawDocument
  .querySelector('.item:nth-child(7) > em')
  .textContent;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('.item > a[href$=".pornstar"]')) {
  participants.push(participant);
}

break;

/*
case 977517469:

// Get title
title =
  rawDocument
  .querySelector('meta[property="og:description"]')
  .content;

// Set video
videoLink =
  rawDocument
  .querySelector('video')
  .src;

break;
*/

case -298399834:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName =
  location.hostname + '_' + docURI[5] + '_' + docURI[4] + '.mp4';

// Get name of participant
participants.push(docURI[4].replace('-',' '));

// Get list of video qualities
for (const source of rawDocument.querySelectorAll('a[href*="/Trailers/"]')) {
  vidsSize.push(source.outerText);
  vidsLink.push(source.href);
}

// Preferred video resolutions
preferredResolutions = [
  '720', '450', '480', '360'];

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      resolution = preferredResolutions[i];
      videoLink =
        rawDocument
        .querySelector('a[href*="x' + resolution + '"]')
        .href;
    }
  } catch (err) {
      console.warn('No resolution of ' + resolution + ' is available');
      videoLink = null;
    }
}

break;

case 726866450:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName =
  location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';
  
// Set video
videoLink =
  rawDocument
  .querySelector('video')
  .src;

// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('flashvars.video_url')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract links
scriptData = rawScript[0].textContent;
scriptData = scriptData.split('\n')

// Preferred video resolutions
preferredResolutions = [
  'flashvars.video_url',
  'flashvars.video_alt_url'];

// Get list of video qualities
for (let i = 0; i < preferredResolutions.length; i++) {
  for (let j = 0; j < scriptData.length; j++) {
    if ((vidsLink.length < 2)
    && (scriptData[j].includes(preferredResolutions[i]))
    && (!scriptData[j].includes('_text'))
       ) {
      firstIndexOf = scriptData[j].indexOf(preferredResolutions[i])+preferredResolutions[i].length+4;
      lastindexOf = scriptData[j].lastIndexOf("'");
      vlink = scriptData[j].substring(firstIndexOf ,lastindexOf)
      vidsLink.push(vlink);
      if (vlink.includes('320')) {vquality = 'Low'} else {vquality = 'High'}
      vidsSize.push(vquality);
    }
  }
}

break;

case 1487350944:

// Get title
title =
  rawDocument
  .querySelector('h2')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName =
  location.hostname + '_' + docURI[3] + '_' + title + '.mp4';

// Get list of participants
ele = rawDocument.querySelector('.player_meta > p:nth-child(6)')
if (ele) {
  participants.push(
    ele
    .outerText
    .slice(8)
  );
}

// Get list of video qualities
for (const source of rawDocument.querySelectorAll('video > source')) {
  vidsSize.push(source.title);
  vidsLink.push(source.src);
}

// Preferred video resolutions
preferredResolutions = [
  'HQ', 'LQ'];

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      resolution = preferredResolutions[i];
      videoLink =
        rawDocument
        .querySelector('video > source[title="' + resolution + '"]')
        .src;
    }
  } catch (err) {
      console.warn('No resolution of ' + resolution + ' is available');
      videoLink = null;
    }
}

break;

case 1479980214:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName =
  location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

// Get list of participants
for (const participant of rawDocument.querySelectorAll('.row-links > a[href*="/performers/"]')) {
  if (participant.querySelector('div')) {
    participant.querySelector('div').remove();
  }
  participants.push(participant);
}

// Get list of video qualities
for (const source of rawDocument.querySelectorAll('video > source')) {
  vidsSize.push(source.title);
  vidsLink.push(source.src);
}

// Find script in which JSON data is stored
rawScript = [];
//scriptElement = rawDocument.querySelectorAll('script')[14];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('video_url')) { // video_alt_url
    rawScript.push(scriptElement);
  }
}

// Process result and extract links
scriptData = rawScript[0].textContent;
scriptData = scriptData.split('\n')

var qualities;
// Get list of video qualities (Proof of concept: No parser nor regex)
for (let i = 0; i < scriptData.length; i++) {
  if (scriptData[i].includes('video_url')) {
    firstIndexOf = scriptData[i].indexOf("'")+1;
    lastindexOf = scriptData[i].lastIndexOf("'");
    videoLink = scriptData[i].substring(firstIndexOf ,lastindexOf);
    break;
  }
}

break;

case -1439611482:

// Get title
title =
  rawDocument
  .querySelector('h2')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName =
  location.hostname + '_' + docURI[4] + '_' + title + '.mp4';

// Get list of participants
for (const participant of rawDocument.querySelectorAll('.models > a')) {
  participants.push(participant);
}

// Get list of video qualities
for (const source of rawDocument.querySelectorAll('video > source')) {
  vidsSize.push(source.title);
  vidsLink.push(source.src);
}

// Preferred video resolutions
preferredResolutions = [
  'HQ', 'LQ'];

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      resolution = preferredResolutions[i];
      videoLink =
        rawDocument
        .querySelector('video > source[title="' + resolution + '"]')
        .src;
    }
  } catch (err) {
      console.warn('No resolution of ' + resolution + ' is available');
      videoLink = null;
    }
}

break;

case -1584194694:

// Preferred video resolutions
preferredResolutions = [
  720, 360];

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName =
  location.hostname + '_' + docURI[3] + '_' + title + '.mp4';

// Get date
calendar =
  rawDocument
  .querySelector('.item > span:nth-child(2) > em')
  .textContent;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('a[href*="/models/"]')) {
  participants.push(participant);
}

// NOTE bravoplayer
// Find script in which JSON data is stored
rawScript = [];
//scriptElement = rawDocument.querySelectorAll('script')[14];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes("'video/mp4'")) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract links
scriptData = rawScript[0].textContent;
scriptData = scriptData.split('\n')

var qualities;
// Get list of video qualities (Proof of concept: No parser nor regex)
for (let i = 0; i < scriptData.length; i++) {
  if (scriptData[i].includes('http')) {
    // This works in console
    // 360 : 'https://',
    // 720 : 'https://'
    // TODO Find how this can be built via this code (i.e. by concatenating brackets)
    // NOTE Perhaps "eval" might help
    // jsonFile = { 360 : 'https://', 720 : 'https://' }
    jsonData = '{' + scriptData[i] + '}';
    continue;
  }
}

// Correct JSON dataset
jsonData = jsonData.replace(/ /g,'');
jsonData = jsonData.replace(/'/g,'"');
jsonData = jsonData.replace('{','{"');
jsonData = jsonData.replace(',',',"');
//jsonData = jsonData.replace(/\d:{1}/g,'":');
//jsonData = jsonData.replace(/:(?=\d)/g,'":');
//jsonData = jsonData.replace(/:+(?=\d)/g,'":');

// Look-ahead and Look-behind — (?=) and (?<=)
jsonData = jsonData.replace(/(?<=\d):/g,'":');

// Parse JSON
jsonFile = JSON.parse(jsonData);

for (let i = 0; i < preferredResolutions.length; i++) {
console.warn(preferredResolutions[i])
console.warn(jsonFile[preferredResolutions[i]])
  vidsSize.push(preferredResolutions[i] + 'p');
  vidsLink.push(jsonFile[preferredResolutions[i]]);
}

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      resolution = preferredResolutions[i];
      videoLink = jsonFile[preferredResolutions[i]];
    }
  } catch (err) {
      console.warn('No resolution of ' + preferredResolutions[i] + ' is available');
      videoLink = null;
    }
}

break;

case -60537139:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName =
  location.hostname + '_' + docURI[4] + '.mp4';

// Get date
calendar =
  rawDocument
  .querySelector('.date-holder > div > b')
  .textContent;
calendar = calendar
           .slice(0, calendar.length-10)

// Get list of participants
for (const participant of rawDocument.querySelectorAll('.date-holder > div > a')) {
  participants.push(participant);
}

// Get list of video qualities
for (const source of rawDocument.querySelectorAll('video > source')) {
  vidsSize.push(source.title);
  vidsLink.push(source.src);
}

// Preferred video resolutions
preferredResolutions = [
  '720', '480', '360'];

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      resolution = preferredResolutions[i];
      videoLink =
        rawDocument
        .querySelector('video > source[title="' + resolution + 'p' + '"]')
        .src;
    }
  } catch (err) {
      console.warn('No resolution of ' + resolution + ' is available');
      videoLink = null;
    }
}

break;

case 113843530:

// Get title
title =
  rawDocument
  .querySelector('h3')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName =
  location.hostname + '_' + docURI[4] + '.mp4';

// Get date
calendar =
  rawDocument
  .querySelector('.column > strong')
  .textContent;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('.models > strong')) {
  participants.push(participant.textContent);
}

// Get list of video qualities
for (const source of rawDocument.querySelectorAll('video > source')) {
  vidsSize.push(source.title);
  vidsLink.push(source.src);
}

// Preferred video resolutions
preferredResolutions = [
  '720', '480', '360'];

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      resolution = preferredResolutions[i];
      videoLink =
        rawDocument
        .querySelector('video > source[title="' + resolution + 'p' + '"]')
        .src;
    }
  } catch (err) {
      console.warn('No resolution of ' + resolution + ' is available');
      videoLink = null;
    }
}

break;

case 649758119:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName =
  location.hostname + '_' + docURI[4] + '_' + title + '.mp4';

// Get list of video qualities
for (const source of rawDocument.querySelectorAll('a[no-load-content]')) {
  vidsSize.push(source.outerText);
  vidsLink.push(source.href);
}

// Preferred video resolutions
preferredResolutions = [
  '720', '480', '360'];

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      resolution = preferredResolutions[i];
      videoLink =
        rawDocument
        .querySelector('a[href*="' + resolution + 'm"]')
        .href;
    }
  } catch (err) {
      console.warn('No resolution of ' + resolution + ' is available');
      videoLink = null;
  }
}

break;

case 1020027461:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

// Get date
//calendar =
//  rawDocument
//  .querySelector('.date-added')
//  .textContent;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('.pornstars > h3 > a')) {
  participants.push(participant);
}

preferredResolutions = [
  '720p', '480p', '360p'];

// Get list of video qualities
for (const source of rawDocument.querySelectorAll('button.label')) {
  vidsSize.push(source.outerText + 'p');
  //vidsLink.push(source.href); // TODO HTTP Headers
}

// Set video
// Skim list of preferred video resolutions against array
for (let i = 0; i < preferredResolutions.length; i++) {
  for (let j = 0; j < vidsSize.length; j++) {
    if (!videoLink) {
      if (preferredResolutions[i] = vidsSize[j]) {
        videoLink = vidsLink[j];
      };
    } else {
        console.warn('No resolution of ' + preferredResolutions[i] + ' is available');
        videoLink = null;
    }
  }
}

break;

case 1548303330:

// Set video
//videoLink = rawDocument.querySelector('video').lastChild.src;
videoLink =
  rawDocument
  .querySelector('.video-download-url')
  .href;

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[3] + '_' + title + '.mp4';

// Get date
calendar =
  rawDocument
  .querySelector('.player-block__date')
  .textContent;

break;

case -1211908368:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('a[href*="/pornstar/"]')) {
  participants.push(participant);
}

// Set video
// TODO Add EventListener to document or autostar
videoLink =
  rawDocument
  .querySelector('video')
  .src;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

break;

case -1318382313:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get date
calendar =
  rawDocument
  .querySelector('.date')
  .textContent;

// Set video
// TODO Add EventListener to document
videoLink =
  rawDocument
  .querySelector('video')
  .src;

// CY Fung https://sleazyfork.org/en/discussions/development/185718-parsing-javascript-on-html-pages-retrieved-with-xhr#comment-402359

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

break;

case 597898866:

// Set video
//videoLink = rawDocument.querySelector('video').lastChild.src;
videoLink =
 rawDocument
 .querySelector('meta[itemprop="contentURL"]')
 .content;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[3] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get date
calendar =
  rawDocument
  .querySelector('meta[itemprop="uploadDate"]')
  .content
  .slice(0,10);

// Get list of participants
for (const participant of rawDocument.querySelectorAll('a[href*="/actor/"]')) {
  participants.push(participant);
}

break;

case 1188431011:

// Set video
videoLink =
  rawDocument
  .querySelector('video > source')
  .src;

// Get title
title =
  rawDocument
  .querySelector('h2')
  .outerText;

// Get date
calendar =
  rawDocument
  .querySelector('div > p')
  .textContent;
calendar = calendar.split(' ');
calendar = calendar[4];

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '.mp4';

break;

case 264219864:

// Set video
videoLink =
  rawDocument
  .querySelector('meta[itemprop="contentUrl"]')
  .content;

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get date
calendar =
  rawDocument
  .querySelector('meta[itemprop="uploadDate"]')
  .content
  .slice(0,10);

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[5].slice(5) + '_' + docURI[4] + '.mp4';

// Get list of participants
for (const participant of rawDocument.querySelectorAll('.clear > a[href*="/profile/"]')) {
  participant.removeAttribute('style');
  participants.push(participant);
}

break;

// FIXME Handle hls (play .ts) HTTP HEADER
case -1850088612:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

// Get list of participants
for (const participant of rawDocument.querySelectorAll('a[href*="/pornstar/"]')) {
  participants.push(participant);
}

break;

case 1156913250:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get date
calendar =
  rawDocument
  //.querySelector('.stat > span:nth-child(3)')
  .querySelector('.item > span:nth-child(3)')
  .outerText
  .slice(10);

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '.mp4';

// NOTE VideoPlayer
// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes(".mp4'")) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract links
scriptData = rawScript[0].textContent;
scriptData = scriptData.split('\n')

// Set video (Proof of concept: No parser nor regex)
for (let i = 0; i < scriptData.length; i++) {
  if (scriptData[i].includes(".mp4'")) {
    firstIndexOf = scriptData[i].indexOf('desktopFile')+15;
    lastindexOf = scriptData[i].indexOf(".mp4'")+4;
    videoLink = scriptData[i].substring(firstIndexOf ,lastindexOf);
  }
}

break;

case 161994028:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

if (title.indexOf('→') > -1) {
  title =
    title
    .slice(title.lastIndexOf('→')+2)
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[3] + '_' + docURI[4] + '.mp4';

// NOTE VideoPlayer
// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('video/mp4')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract links
scriptData = rawScript[0].textContent;
scriptData = scriptData.split('\n')

// Set video (Proof of concept: No parser nor regex)
for (let i = 0; i < scriptData.length; i++) {
  if (scriptData[i].includes('video/mp4')) {
    firstIndexOf = scriptData[i].indexOf('src')+5;
    lastindexOf = scriptData[i].lastIndexOf("',");
    videoLink = scriptData[i].substring(firstIndexOf ,lastindexOf);
  }
}

break;

case 1011086976:

// Preferred video resolutions
preferredResolutions = [
  'setVideoUrlHigh',
  'setVideoUrlLow'];

// NOTE html5player
// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('setVideoTitle')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract links
scriptData = rawScript[0].textContent;
scriptData = scriptData.split('\n')

// Set video (Proof of concept: No parser nor regex)
for (let i = 0; i < scriptData.length; i++) {
  if (scriptData[i].includes('setVideoHLS')) {
    firstIndexOf = scriptData[i].indexOf('(')+2;
    lastindexOf = scriptData[i].lastIndexOf(')')-1;
    videoLink = scriptData[i].substring(firstIndexOf ,lastindexOf);
    isHLS = true;
  } else if (scriptData[i].includes('setVideoUrlHigh')) {
    firstIndexOf = scriptData[i].indexOf('(')+2;
    lastindexOf = scriptData[i].lastIndexOf(')')-1;
    videoLink = scriptData[i].substring(firstIndexOf ,lastindexOf);
  } else if (scriptData[i].includes('setVideoUrlLow')) {
      firstIndexOf = scriptData[i].indexOf('(')+2;
      lastindexOf = scriptData[i].lastIndexOf(')')-1;
      videoLink = scriptData[i].substring(firstIndexOf ,lastindexOf);
  }
}

// Get list of video qualities
for (let i = 0; i < preferredResolutions.length; i++) {
  for (let j = 0; j < scriptData.length; j++) {
    if (scriptData[j].includes(preferredResolutions[i])) {
      firstIndexOf = scriptData[j].indexOf('(')+2;
      lastindexOf = scriptData[j].lastIndexOf(')')-1;
      vidsSize.push(preferredResolutions[i].slice(11));
      vidsLink.push(scriptData[j].substring(firstIndexOf ,lastindexOf));
    }
  }
}

// Get title
title =
  rawDocument
  .querySelector('.clear-infobar > strong')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '.mp4';

// Get list of participants
for (const participant of rawDocument.querySelectorAll('.is-pornstar')) {
  participants.push(participant);
}

break;

case -49226400:

// Set video
videoLink =
  rawDocument
  .querySelector('video > source')
  .src;

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('.row-item > span')) {
  participants.push(participant);
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '.mp4';

break;

// FIXME Handle hls (play .ts) HTTP HEADER
case 1428415544:

// Get title
title =
  rawDocument
  .querySelector('.v-list-item__title')
  .outerText;

// Get date
calendar =
  rawDocument
  .querySelector('.v-list-item__subtitle > span:nth-child(2)')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[3] + '_' + title + '.mp4';

break;

case -1059113202:

// Set video
videoLink =
  rawDocument
  .querySelector('video > source')
  .src;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[3] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

break;

// FIXME
case 2132501037:

// Set video
// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('getEmbed')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract JSON dataset
scriptData = rawScript[0].textContent;
jsonData = scriptData.substring(
  scriptData.indexOf('s =')+4,
  scriptData.indexOf('};')+1
);

// Correct JSON dataset
jsonData = jsonData.replace(/\s\s+/g,' ');
jsonData = jsonData.replace("{ ","{'");
jsonData = jsonData.replace(/:\s/g,"':");
jsonData = jsonData.replace(/',\s/g,"','");
jsonData = jsonData.replace(/'/g,'"');

// Parse JSON
jsonFile = JSON.parse(jsonData);

// Set video
// TODO Solve string /get_file/1/DYNAMIC_STRING/0000/0000/0000.mp4
// NOTE We might redirect to autoplay and take the URL from HTTP Header
//videoLink = jsonFile["video_url"].slice(11) + '&rnd=' + jsonFile["rnd"]
videoLink = jsonFile["video_url"].slice(11)

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

break;

case 811446339:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('.cast > a')) {
  text = participant.outerText
  do {
    element = participant.querySelector('*');
    participant.removeChild(element);
    } while (participant.querySelector('*'));
  participant.textContent = text;
  participants.push(participant);
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '.mp4';

// Set video
// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('qualitySelector')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract JSON dataset
scriptData = rawScript[0].textContent;
jsonData = scriptData.substring(
  scriptData.indexOf('poster')-2,
  scriptData.lastIndexOf('}}')+2
);

// Parse JSON
jsonFile = JSON.parse(jsonData);

// Get list of video qualities
resolutions = jsonFile['qualitySelector']['qualities'].split(',');

// Find link to file
for (let i = 0; i < resolutions.length; i++) {
  vidsLink.push(jsonFile['qualitySelector']['streamingUrl'] + '/' + resolutions[i] + '.mp4');
  vidsSize.push(resolutions[i]);
}

preferredResolutions = [
  '720p', '480p', '360p'];

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      videoLink = jsonFile['qualitySelector']['streamingUrl'] + '/' + resolutions[i] + '.mp4';
      resolution = preferredResolutions[i];
    }
  } catch (err) {
      console.warn('No resolution of ' + preferredResolutions[i] + ' is available');
      videoLink = null;
    }
}

//videoLink = jsonFile['src'][i]['src'];

break;

case 30281162:

preferredResolutions = [
  '720p', '480p'];

// Set video
try {
  videoLink =
    rawDocument
    .querySelector('video > source')
    .src;
} catch (err) {
  // Redirect to login page
  console.warn('LOGIN REQUIRED. READIRECTING NOW.')
  location.href =
    document
    .querySelector('a[href*="/login/"]')
    .href;
}

// NOTE initPlayer (videoplayer-1.5.33)
// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('VideoPlayer')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract JSON dataset
scriptData =
  rawScript[0]
  .textContent;

jsonData =
  scriptData.substring(
    scriptData.indexOf('{mp4'),
    scriptData.indexOf('}]}')+3
  );

// Correct JSON dataset
jsonData =
  jsonData
  .replace('mp4','"mp4"');

root = 'mp4'

// Parse JSON
jsonFile = JSON.parse(jsonData);

// Get list of video qualities
resolutions = Object.keys(jsonFile[root]);

// Find link to file
for (let i = 0; i < resolutions.length; i++) {
  if(jsonFile[root][resolutions[i]]) {
    vidsSize.push(jsonFile[root][resolutions[i]].desc);
    vidsLink.push(jsonFile[root][resolutions[i]].src);
  }
}

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      videoLink = jsonFile[root][preferredResolutions[i]][0]['src'];
      resolution = preferredResolutions[i];
    }
  } catch (err) {
      console.warn('No resolution of ' + preferredResolutions[i] + ' is available');
      videoLink = null;
    }
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get date
calendar =
  rawDocument
  .querySelector('.views-count-add.text-muted')
  .outerText
  .slice(6);

// Get list of participants
for (const participant of rawDocument.querySelectorAll('div.models-wrapper > div > a[href*="/model/"]')) {
  do {
    element = participant.querySelector('*');
    participant.removeChild(element);
    } while (participant.querySelector('*'));
  participants.push(participant);
}

break;

// FIXME
case 98006476:
case 129388118:

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docID = url.searchParams.get("viewkey")
videoName = location.hostname + '_' + docID + '_' + title + '.mp4';

// Get date
calendar =
  rawDocument
  .querySelector('.videoInfo')
  .outerText;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('a[href*="/pornstar/"]')) {
  participants.push(participant);
}

break;

// FIXME Retrieve file via HTTP Header
case -549200690:

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1.video-page__title')
  .outerText;

// Get date
calendar =
  rawDocument
  .querySelector('.posted-date')
  .outerText;

break;

// FIXME Retrieve file via HTTP Header
case -1841457601:

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get date
calendar =
  rawDocument
  .querySelector('.underplayer__item > span')
  .outerText;

break;

case 1405205629:

// Set video
videoLink =
  rawDocument
  .querySelector('video > source')
  .src;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get date
calendar =
  rawDocument
  .querySelector('ul > li:nth-child(3) > span:nth-child(2)')
  .outerText;

break;

case 303903006:

// Set video
videoLink =
  rawDocument
  .querySelector('video > source')
  .src;

// Get list of video qualities
for (const source of rawDocument.querySelectorAll('a[class="download"]')) {
  vidsSize.push(source.outerText.slice(14));
  vidsLink.push(source.href);
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

break;

case -1636726546:

// Set video
videoLink =
  rawDocument
  .querySelector('video > source')
  .src;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

break;

case 1338265317:

// Set video
videoLink =
  rawDocument
  .querySelector('video > source')
  .src;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[3] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

break;

case -1597517923:

isHLS = 1;

// Set video
videoLink =
  rawDocument
  .querySelector('link[itemprop="contentUrl"]')
  .href;

// Get title
title =
  rawDocument
  .querySelector('title')
  .outerText;

title =
  title
  .slice(0,title.lastIndexOf('-')-1);

// Get date
calendar =
  rawDocument
  .querySelector('meta[itemprop="uploadDate"]')
  .content
  .slice(0,10);

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + title + '.mp4';

break;

case 1178226912:
case -2127927781:

isHLS = 1;

// Set video
videoLink =
  rawDocument
  .querySelector('link[itemprop="contentUrl"]')
  .href;

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + title + '.mp4';

// Get list of participants
for (const participant of rawDocument.querySelectorAll('a.chip[href*="/model/"]')) {
  participants.push(participant);
}

break;

case -1633001694:

isHLS = 1;

// Set video
videoLink =
  rawDocument
  .querySelector('meta[itemprop="contentUrl"]')
  .content;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[3] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

break;

// FIXME Redirect to iframe, then (in separate case) to original URL
case -1455267443:
case 977517469: // FIXME CORS
case 313217573:
case 1034387597:
case 1312665594:
case 1430795739:

/* Redirect to iframe
console.warn('READIRECTING TO ORIGINAL SOURCE.')
location.href = frame
*/

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

frame =
  rawDocument
  .querySelector('iframe')
  .src;

window
  .location
  .replace(frame);

break;

case 396670300:

// Set video
videoLink =
  rawDocument
  .querySelector('video > source')
  .src;

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Set filename
url = new URL(rawDocument.documentURI);
docID = url.searchParams.get("VideoID")
videoName = location.hostname + '_' + docID + title + '.mp4';

break;

case -744732632:

// Set video
videoLink =
  rawDocument
  .querySelector('video > source')
  .src;

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[5] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('.block-head')
  .outerText;

break;

case -900812627:

preferredResolutions = [
  'video_alt_url',
  'video_url'];

// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('flashvars')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract JSON dataset
scriptData = rawScript[0].textContent;
scriptData = scriptData.replace(/\s\s+/g,' ');
jsonData = scriptData.substring(
  scriptData.indexOf('= {')+2,
  scriptData.indexOf('};')+1
);

// Correct JSON dataset
jsonData = jsonData.replace(/:\s/g,'":');
jsonData = jsonData.replace(/',\s/g,'", "');
jsonData = jsonData.replace(/:'/g,':"');
jsonData = jsonData.replace('{ ','{"');
jsonData = jsonData.replace(/'/g,'"');

// Parse JSON
jsonFile = JSON.parse(jsonData);

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  if(jsonFile[preferredResolutions[i]]) {
    videoLink = jsonFile[preferredResolutions[i]];
  }
}

// Get list of video qualities
for (let i = 0; i < preferredResolutions.length; i++) {
  if(jsonFile[preferredResolutions[i]]) {
    vidsSize.push(jsonFile[preferredResolutions[i] + '_text']);
    vidsLink.push(jsonFile[preferredResolutions[i]]);
  }
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[5] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h2')
  .outerText;

// Get date
calendar =
  rawDocument
  .querySelector('li[class="hp-when-added"]')
  .outerText;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('.info > div > div > a[href*="/models/"]')) {
  participants.push(participant);
}

break;

// FIXME
// NOTE This website pulls data from other domains
// TODO Redirect
case -1117847037:

// Preferred video resolutions
preferredResolutions = [
  'hd', 'master',
  'vga', 'web'];

// TODO Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('canShowImages')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract JSON dataset
scriptData = rawScript[0].textContent;
secondIndexOf = scriptData.indexOf('{')+1;
secondLastIndexOf = scriptData.lastIndexOf('}')-1;
jsonData = scriptData.substring(
  scriptData.indexOf('{', secondIndexOf), 
  scriptData.lastIndexOf('}', secondLastIndexOf) + 1
);

// Parse JSON
jsonFile = JSON.parse(jsonData);

// Because not all sets of resolutions are available,
// we need to make checks and circumvent errors from
// a higher to a lower resolution
for (let i = 0; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      videoLink = jsonFile['clip']['fallback'][preferredResolutions[i]][0]['src'];
      resolution = preferredResolutions[i];
    }
  } catch (err) {
      console.warn('No resolution of ' + preferredResolutions[i] + ' is available');
      videoLink = null;
    }
}

// Get list of video qualities
resolutions = Object.keys(jsonFile['clip']['fallback']);

// Find link to file
for (let i = 0; i < resolutions.length; i++) {
  vidsSize.push(jsonFile['clip']['fallback'][resolutions[i]][0]['quality']);
  vidsLink.push(jsonFile['clip']['fallback'][resolutions[i]][0]['src']);
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get date
calendar =
  rawDocument
  .querySelector('span[title="Release date"] > a')
  .outerText;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('dd > a[href*="www"]')) {
  participants.push(participant);
}

break;

case -1073731548:
case 224542341: 

/*
"clip":{"fallback":{"hd":[{"src":"","quality":""}]}}

"clip":{
   "fallback":{
      "hd":[
         {
            "src":"",
            "quality":"",
         }
      ],

"[]" this is an array at index "0"
To find link, use:
['clip']['fallback']['hd'][0].['src']
*/

/*
// Preferred video resolutions
preferredResolutions = [
  'hd', 'master',
  'vga', 'web'];

// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('canShowImages')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract JSON dataset
scriptData = rawScript[0].textContent;
secondIndexOf = scriptData.indexOf('{')+1;
secondLastIndexOf = scriptData.lastIndexOf('}')-1;
jsonData = scriptData.substring(
  scriptData.indexOf('{', secondIndexOf), 
  scriptData.lastIndexOf('}', secondLastIndexOf) + 1
);

// Parse JSON
jsonFile = JSON.parse(jsonData);

// Get list of video qualities
//resolutions = Object.keys(jsonFile['clip']['fallback']);
resolutions = Object.keys(jsonFile['clip']['qualities']);

// Because not all sets of resolutions are available,
// we need to make checks and circumvent errors from
// a higher to a lower resolution
for (let i = 0; i < preferredResolutions.length; i++) {
  resolution = preferredResolutions[i];
  if(!videoLink) {
    //videoLink = jsonFile['clip']['fallback'][preferredResolutions[i]][0]['src'];
    //resolution = preferredResolutions[i];
    for (let j = 0; j < resolutions.length; j++) {
      quality = jsonFile['clip']['qualities'][j]['quality'];
      if (quality == resolution) {
        videoLink = jsonFile['clip']['qualities'][j]['src'];
      } else {
        console.warn('No resolution of ' + preferredResolutions[i] + ' is available');
      }
    }
  }
}

// Find link to file
for (let i = 0; i < resolutions.length; i++) {
  //vidsSize.push(jsonFile['clip']['fallback'][resolutions[i]][0]['quality']);
  vidsSize.push(jsonFile['clip']['qualities'][i]['quality']);
  //vidsLink.push(jsonFile['clip']['fallback'][resolutions[i]][0]['src']);
  vidsLink.push(jsonFile['clip']['qualities'][i]['src']);
}
*/

// Preferred video resolutions
preferredResolutions = [
  '720', '1080',
  '576', '360'];

// Get list of video qualities
for (const source of rawDocument.querySelectorAll('video source')) {
  resolution = source.getAttribute('size');
  if(!videoLink) {
    for (let i = 0; i < preferredResolutions.length; i++) {
      if (preferredResolutions[i] == resolution) {
        videoLink = source.src;
      } else {
        console.warn('No resolution of ' + resolution + ' is available');
      }
    }
  }
}

// Find link to file
for (const source of rawDocument.querySelectorAll('video source')) {
  vidsSize.push(source.getAttribute('size'));
  vidsLink.push(source.src);
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get date
calendar =
  rawDocument
  .querySelector('.bi.bi-calendar3.me-5')
  .outerText;

// Get list of participants
//for (const participant of rawDocument.querySelectorAll('dd > a[href*="www"]')) {
for (const participant of rawDocument.querySelectorAll('h1 a, watch__featuring_models a')) {
  participants.push(participant);
}

break;

case 1179917960: 

// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('thumbnails')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract JSON dataset
scriptData = rawScript[0].textContent;
jsonData = scriptData.substring(
  scriptData.indexOf('['),
  scriptData.lastIndexOf(']')+1
);

// Correct JSON dataset
// Thank you Malvineous
// https://stackoverflow.com/users/308237/malvineous
// https://stackoverflow.com/questions/9637517/parsing-relaxed-json-without-eval
// 
jsonData = jsonData
  // Replace ":" with "@colon@" if it's between double-quotes
  .replace(/:\s*"([^"]*)"/g, function(match, p1) {
    return ': "' + p1.replace(/:/g, '@colon@') + '"';
  })

  // Replace ":" with "@colon@" if it's between single-quotes
  .replace(/:\s*'([^']*)'/g, function(match, p1) {
    return ': "' + p1.replace(/:/g, '@colon@') + '"';
  })

  // Add double-quotes around any tokens before the remaining ":"
  .replace(/(['"])?([a-z0-9A-Z_]+)(['"])?\s*:/g, '"$2": ')

  // Turn "@colon@" back into ":"
  .replace(/@colon@/g, ':');

// Parse JSON
jsonFile = JSON.parse(jsonData);

// Set video
videoLink = jsonFile[0]["sources"][0]["file"];

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = url.hostname + '_' + docURI[5] + '.mp4';

// Get title
// TODO Consider XPath
// @meta[name="description"]/@content
title =
  rawDocument
  .querySelector('h1')
  .outerText

// Get date
//calendar = new URL(videoLink);
//calendar = calendar.pathname.substring(1,9);

//query = '.video_desc > p'
//calendar = rawDocument.querySelector(query);
//calendar = calendar.textContent;
//calendar = calendar.split(' ');
//calendar = calendar[7];

// Get list of participants
//for (const participant of rawDocument.querySelectorAll('p > a[href*="/search.php?query="]')) {
//  participants.push(participant);
//}

break;

case -1860626880:

isHLS = true;

// Preferred video resolutions
preferredResolutions = [
  '2160', '1080', '720', '480', '360'];

// Set video
for (let i = 2; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      query = 'video'
      resolution = preferredResolutions[i];
      videoLink =
        rawDocument
        .querySelector(query)
        .getAttribute('data-hls-src' + resolution);
    }
  } catch (err) {
      console.warn('No resolution of ' + resolution + ' is available');
      videoLink = null;
    }
}

videoSource =
  rawDocument
  .querySelector(query);

// Get list of video qualities
for (let i = 0; i < preferredResolutions.length; i++) {
  resolution = preferredResolutions[i];
  try {
    source = videoSource.getAttribute('data-hls-src' + resolution);
  } catch (err) {
      console.warn('No resolution of ' + resolution + ' is available');
    }
  if(source) {
    vidsSize.push(resolution + 'p (m3u8)');
    vidsLink.push(source);
  }
}

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('.detail-video > li > a[href*="/pornstar/"]')) {
  participants.push(participant);
}

break;

case -1680029367:

//if (location.href.includes('/hd-porn/')) {
//  vidID = location.href.split('/')[4];
//  location.href = location.origin + '/video-' + vidID;
//}

// Get title
title =
  rawDocument
  .querySelector('h1')
  .firstChild
  .data

// Get list of participants
for (const participant of rawDocument.querySelectorAll('.vit-pornstar > a')) {
  participants.push(participant);
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = url.hostname + '_' + docURI[3].slice(6) + '_' + docURI[4] + '.mp4';

// Get list of video qualities
for (const source of rawDocument.querySelectorAll('a[href*="/dload/"]')) {
  vidsSize.push(source.outerText.slice(14,source.outerText.length-1));
  vidsLink.push(source.href);
}

// Preferred video resolutions
preferredResolutions = [
  '720p', '480p', '360p'];

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      resolution = preferredResolutions[i];
      videoLink =
        rawDocument
        .querySelector('.dloaddivcol > a[href*="' + resolution + '"]')
        .href;
    }
  } catch (err) {
      console.warn('No resolution of ' + resolution + ' is available');
      videoLink = null;
    }
}

break;

case -1016825242:

// Preferred video resolutions
preferredResolutions = [
  '720p', '480p'];

// Set video
// NOTE See 932917002
query = 'a[class="download-link"][href*="720p.mp4"]'
if(rawDocument.querySelector(query)) {
  videoLink = rawDocument.querySelector(query);
} else {
query = 'a[class="download-link"]'
  videoLink = rawDocument.querySelector(query);
}

// Get list of video qualities
for (const source of rawDocument.querySelectorAll('a[class="download-link"]')) {
  vidsSize.push(source.outerText);
  vidsLink.push(source.href);
}

/*

preferredResolutions = [
  'video_alt_url',
  'video_url'];

// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('flashvars')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract JSON dataset
scriptData = rawScript[0].textContent;
jsonData = scriptData.substring(
  scriptData.indexOf('{'),
  scriptData.indexOf('};')+1
);

// Correct JSON dataset
jsonData = jsonData.replace(/:\s/g,'":');
jsonData = jsonData.replace(/\s\s+/g,' ');
jsonData = jsonData.replace(/,\s/g,', "');
jsonData = jsonData.replace(/'/g,'"');
jsonData = jsonData.replace('{ ','{"');

// Parse JSON
jsonFile = JSON.parse(jsonData);

// Get list of video qualities
for (let i = 0; i < preferredResolutions.length; i++) {
  if(jsonFile[preferredResolutions[i]]) {
    videoLink = jsonFile[preferredResolutions[i]].slice(11);
    resolution = jsonFile[preferredResolutions[i] + '_text'];
    vidsSize.push(resolution);
    vidsLink.push(videoLink);
  }
}

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  if(jsonFile[preferredResolutions[i]]) {
    videoLink = jsonFile[preferredResolutions[i]].slice(11);
  }
}

*/

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = url.hostname + '_' + docURI[4] + '.mp4';

// Get title
// TODO Consider XPath
title =
  rawDocument
  .querySelector('.desc')
  .outerText

// Get date
calendar =
  rawDocument
  .querySelector('ul.video-meta > li:nth-child(3)')
  .outerText;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('div.video-link > a[href*="/models/"]')) {
  participants.push(participant);
}

break;

case -426571524:

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = url.hostname + '_' + docURI[4] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText

if (!title) {
  title =
    rawDocument
    .querySelector('div.desc')
    .outerText
  }

// Get date
calendar =
  rawDocument
  .querySelector('ul.video-meta > li:nth-child(3)')
  .outerText;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('div.video-link > a[href*="/models/"]')) {
  participants.push(participant);
}

// Preferred video resolutions
preferredResolutions = [
  '720p', '480p'];

// Set video
// NOTE See pornworld.com
query = 'a[class="download-link"][href*="720p.mp4"]'
if(rawDocument.querySelector(query)) {
  videoLink = rawDocument.querySelector(query);
} else {
query = 'a[class="download-link"]'
  videoLink = rawDocument.querySelector(query);
}

// Get list of video qualities
for (const source of rawDocument.querySelectorAll('a[class="download-link"]')) {
  vidsSize.push(source.outerText);
  vidsLink.push(source.href);
}

break;

case 1261614485:

// Set video
query = 'div[class="col download_link"] > a'
if(rawDocument.querySelector(query)) {
  videoLink = rawDocument.querySelector(query);
}

// Get list of video qualities
for (const source of rawDocument.querySelectorAll('div[class="col download_link"] > a')) {
  vidsSize.push(source.outerText);
  vidsLink.push(source.href);
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = url.hostname + '_' + docURI[4] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h2')
  .outerText

// Get date
calendar =
  rawDocument
  .querySelector('.information > div > div:nth-last-child(1) > div > div');

element =
  calendar.querySelector('span');
  calendar.removeChild(element);

// Get list of participants
for (const participant of rawDocument.querySelectorAll('.information > div > div > div > div')) {
  span = participant.querySelector('span')
  if (span) {
    if (span.outerText === 'Pornstars:') {
      for (const participantc of participant.querySelectorAll('a[href*="/search?"]')) {
        participants.push(participantc);
      }
      break;
    }
  }
}

break;

case -1005701525:

// Preferred video resolutions
preferredResolutions = [
  '720p', '480p', '360p'];

// NOTE 144 240 360 480 720 1080
// Get list of video qualities
for (const source of rawDocument.querySelectorAll('.download-link')) {
  vidsSize.push(source.textContent);
  vidsLink.push(source.href);
}

// Set video
// Skim list of preferred video resolutions against array
for (let j = 0; j < vidsLink.length; j++) {
  for (let i = 0; i < preferredResolutions.length; i++) {
    try {
      if(!videoLink) {
        resolution = preferredResolutions[i];
        if (vidsLink[j].includes(resolution)) {
          videoLink = vidsLink[j];
        }
      }
    } catch (err) {
        console.warn('No resolution of ' + resolution + ' is available');
        videoLink = null;
      }
  }
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('.desc')
  .outerText;

// Get date
calendar =
  rawDocument
  .querySelector('ul.video-meta > li:nth-child(3) > span')
  .outerText;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('div.video-link > a[href*="/pornstars/"]')) {
  participants.push(participant);
}

break;

case -315317259:

// Preferred video resolutions
preferredResolutions = [
  '720p', '360p'];

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      resolution = preferredResolutions[i];
      videoLink =
        rawDocument
        .querySelector('video > source[label*="' + resolution + '"]')
        .src;
      //videoLink = rawDocument.querySelector('a[class="video-links__link"][href*="' + resolution + '"]').src;
    }
  } catch (err) {
      console.warn('No resolution of ' + resolution + ' is available');
      videoLink = null;
    }
}

// NOTE 144 240 360 480 720 1080
// Get list of video qualities
for (const source of rawDocument.querySelectorAll('video > source')) {
  vidsSize.push(source.getAttribute('label'));
  vidsLink.push(source.src);
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get date
calendar =
  rawDocument
  .querySelector('.video__info_common')
  .outerText;

calendar =
  calendar.substring(
    calendar.indexOf(':')+2,
    calendar.indexOf('|')-3
  )

break;

case 245600365:
case 349950473:
case -1512731398:

// Preferred video resolutions
preferredResolutions = [
  //'720m.mp4', '480m.mp4'];
  '720p', '480p'];

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      resolution = preferredResolutions[i];
      videoLink =
        rawDocument
        .querySelector('video > source[label*="' + resolution + '"]')
        .src;
      //videoLink = rawDocument.querySelector('a[class="video-links__link"][href*="' + resolution + '"]').src;
    }
  } catch (err) {
      console.warn('No resolution of ' + resolution + ' is available');
      videoLink = null;
    }
}

// Get list of video qualities
//for (const source of rawDocument.querySelectorAll('video > source')) {
//  vidsSize.push(source.getAttribute('label'));
//  vidsLink.push(source.src);
//}
for (const source of rawDocument.querySelectorAll('a[class="video-links__link"][href*=".mp4/"]')) {
  vidsSize.push(source.outerText);
  vidsLink.push(source.href);
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('a[class="video-links__link"][href*="/models/"]')) {
  participants.push(participant);
}

break;

// FIXME Retrieve file via HTTP Header
case 1964929165:

// Preferred video resolutions
preferredResolutions = [
  '720p', '480p', '360'];

// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('VideoObject')) {
    rawScript.push(scriptElement);
  }
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get date
// JSON uploadDate

// Get list of participants
for (const participant of rawDocument.querySelectorAll('a[href*="/pornstar/"]')) {
  participants.push(participant);
}

break;

case 932917002: 
case 210365742: 
case 516511168: 
case 1132279251: 
case -1221284475:
case -1468843954:

// Preferred video resolutions
preferredResolutions = [
  '720', '576', '360'];

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  try {
    if(!videoLink) {
      resolution = preferredResolutions[i];
      videoLink =
        rawDocument
        .querySelector('source[size="' + resolution + '"]')
        .src;
    }
  } catch (err) {
      console.warn('No resolution of ' + resolution + ' is available');
      videoLink = null;
    }
}

// Get list of video qualities
for (const source of rawDocument.querySelectorAll('video > source')) {
  vidsSize.push(source.getAttribute('size') + 'p');
  vidsLink.push(source.src);
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4] + '_' + docURI[5] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get date
calendar =
  rawDocument
  .querySelector('i[class*="calendar3"]')
  .outerText;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('a[href*="/model/"]')) {
  participants.push(participant);
}

break;

case 508927357:
case -468498755:
case -541491283:
case 260185968: 
case 1567421844: 
case 1034491021: 
case 1544611679: 
case -886418475:
case -1821354961:
case -1570856665:
case -190628261:
case -322927218:
case 1940681512: 
case 150697176: 
case 1175500525: 
case 938688328: 
case -1607352929:
case 519808330: 
case -1903471555:
case -3998427:
case 2009112007:
case -2044898019:
case -1240686689:

// TODO Execute after page is ready
itemsToRemove = ['.dialog-desktop-container', '.desktop-dialog-open'];

// "vr":{"sources":{"1920p":{"url":"","title":""}}}
//
// "vr":{
//   "sources":{
//      "1920p":{
//         "url":"",
//         "downloadUrl":"",
//         "key":"",
//         "title":""
//      },
//   },
// },

// Preferred video resolutions
preferredResolutions = [
  '1440p', '960p', '720p',
  '480p', '240p', '144p'];

// Find script in which JSON data is stored
rawScript =
  rawDocument
  .getElementById('initials-script');

// Process result and extract JSON dataset
scriptData = rawScript.textContent;
jsonData =
  scriptData.substring(
    scriptData.indexOf('{'),
    scriptData.lastIndexOf(';')
  );

// Parse JSON
jsonFile = JSON.parse(jsonData);

// Set video
try{
  videoLink =
    rawDocument
    .querySelector('link[as="fetch"]')
    .href;
} catch (err) {
      console.warn('No M3U8 was found');
  }

if (videoLink) {
  isHLS = true;
} else {
  for (let i = 2; i < preferredResolutions.length; i++) {
    try {
      if(!videoLink) {
        if (jsonFile['vr']) {
          videoLink = jsonFile['vr']['sources'][preferredResolutions[i]]['url'];
          resolution = preferredResolutions[i];
        } else {
          videoLink = jsonFile['videoModel']['sources']['mp4'][preferredResolutions[i]];
          resolution = preferredResolutions[i];
        }
      }
    } catch (err) {
        console.warn('No resolution of ' + preferredResolutions[i] + ' is available');
        videoLink = null;
      }
  }
}

if((!videoLink) && (jsonFile['vr'])) {
  videoLink =
    rawDocument
    .querySelector('video[class="player-container__no-script-video"]')
    .src;
}

// TODO Check this segment of code below
// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  if(jsonFile[preferredResolutions[i]]) {
    videoLink = jsonFile[preferredResolutions[i]];
  }
}
// TODO Check this segment of code above

// Get list of video qualities
if (jsonFile['vr']) {
  resolutions = Object.keys(jsonFile['vr']['sources']);
} else {
  try {
    resolutions = Object.keys(jsonFile['videoModel']['sources']['mp4']);
  } catch (err) {
      //setTimeout(() => {
      //  location.href = location.href + '?x_platform_switch=desktop';
      //}, 1000);

      //hostParted = location.host.split('.');
      //tld = hostParted[hostParted.length-2] + '.' + hostParted[hostParted.length-1];
      // NOTE 'server=.' + tld; doesn't work
      //document.cookie='x_platform_switch=desktop;path=/;server=.' + tld;

      sleep(5000)
      window.open(
        location.href + '?x_platform_switch=desktop',
        '_self');
  }
}

// Find link to file
for (let i = 0; i < resolutions.length; i++) {
  if (jsonFile['vr']) {
    vidsSize.push(jsonFile['vr']['sources'][resolutions[i]]['title']);
    vidsLink.push(jsonFile['vr']['sources'][resolutions[i]]['url']);
  } else {
    vidsSize.push(resolutions[i]);
    vidsLink.push(jsonFile['videoModel']['sources']['mp4'][resolutions[i]]);
  }
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = url.hostname + '_' + docURI[4] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText

// Get date
calendar =
  rawDocument
  .querySelector('div[class*="entity-info-container__date"]')
  .dataset['tooltip']
  .slice(0,10);

// Get list of participants
//for (const participant of rawDocument.querySelectorAll('a[href*="/pornstars/"][rel="bookmark"]')) {
//for (const participant of rawDocument.querySelectorAll('a[href*="/pornstars/"][rel="tag"]')) {
for (const participant of rawDocument.querySelectorAll('a.video-tag[href*="/pornstars/"], a.video-tag[href*="/creators/"]')) {
  do {
    element = participant.querySelector('*');
    participant.removeChild(element);
    } while (participant.querySelector('*'));
  participants.push(participant);
}

break;

case 231257079:

preferredResolutions = [
  'video_alt_url',
  'video_url'];

// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('flashvars')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract JSON dataset
scriptData = rawScript[0].textContent;
scriptData = scriptData.replace(/\s\s+/g,' ');
jsonData = scriptData.substring(
  scriptData.indexOf('= {')+2,
  scriptData.indexOf('};')+1
);

// Correct JSON dataset
jsonData = jsonData.replace(/:\s/g,'":');
jsonData = jsonData.replace(/',\s/g,'", "');
jsonData = jsonData.replace(/:'/g,':"');
jsonData = jsonData.replace('{ ','{"');
jsonData = jsonData.replace(/'/g,'"');

// Parse JSON
jsonFile = JSON.parse(jsonData);

// Set video
for (let i = 0; i < preferredResolutions.length; i++) {
  if(jsonFile[preferredResolutions[i]]) {
    videoLink = jsonFile[preferredResolutions[i]];
  }
}

// Get list of video qualities
for (let i = 0; i < preferredResolutions.length; i++) {
  if(jsonFile[preferredResolutions[i]]) {
    vidsSize.push(jsonFile[preferredResolutions[i] + '_text']);
    vidsLink.push(jsonFile[preferredResolutions[i]]);
  }
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = url.hostname + '_' + docURI[5] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h1')
  .outerText

// Get date
calendar =
  rawDocument
  .querySelector('span:nth-child(2) > em')
  .outerText;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('div > a[href*="/models/"]')) {
  participants.push(participant);
}

break;

case -469933:

// Preferred video resolutions
preferredResolutions = [
  'setVideoUrlHigh',
  'setVideoUrlLow'];

// NOTE html5player
// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('setVideoTitle')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract links
scriptData = rawScript[0].textContent;
scriptData = scriptData.split('\n')

// Set video (Proof of concept: No parser nor regex)
for (let i = 0; i < scriptData.length; i++) {
  if (scriptData[i].includes('setVideoHLS')) {
    firstIndexOf = scriptData[i].indexOf('(')+2;
    lastindexOf = scriptData[i].lastIndexOf(')')-1;
    videoLink = scriptData[i].substring(firstIndexOf ,lastindexOf);
    isHLS = true;
  } else if (scriptData[i].includes('setVideoUrlHigh')) {
    firstIndexOf = scriptData[i].indexOf('(')+2;
    lastindexOf = scriptData[i].lastIndexOf(')')-1;
    videoLink = scriptData[i].substring(firstIndexOf ,lastindexOf);
  } else if (scriptData[i].includes('setVideoUrlLow')) {
      firstIndexOf = scriptData[i].indexOf('(')+2;
      lastindexOf = scriptData[i].lastIndexOf(')')-1;
      videoLink = scriptData[i].substring(firstIndexOf ,lastindexOf);
  }
}

// Get list of video qualities
for (let i = 0; i < preferredResolutions.length; i++) {
  for (let j = 0; j < scriptData.length; j++) {
    if (scriptData[j].includes(preferredResolutions[i])) {
      firstIndexOf = scriptData[j].indexOf('(')+2;
      lastindexOf = scriptData[j].lastIndexOf(')')-1;
      vidsSize.push(preferredResolutions[i].slice(11));
      vidsLink.push(scriptData[j].substring(firstIndexOf ,lastindexOf));
    }
  }
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = url.hostname + '_' + docURI[4] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h2')
  do {
    element = title.querySelector('*');
    title.removeChild(element);
    } while (title.querySelector('*'));

title =
  title
  .textContent;

break;

case -491772566:
case 1873419916:
case 60433162:

// if (location.hostname.endsWith('.la')) {
//   location.href = location.href.replace('.la/', '.com/');
// }

// Preferred video resolutions
preferredResolutions = [
  'setVideoUrlHigh',
  'setVideoUrlLow'];
//  'setVideoHLS', 'setVideoUrlHigh', 'setVideoUrlLow'];

// TODO
//  Open setVideoHLS m3u8 file
//  Play m3u8 with hls.js
//  Better yet, just link to an online service
//  '720p', '480p', '360p', '250p'];

// NOTE html5player
// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('setVideoTitle') ||
      scriptElement.textContent.includes('contentUrl')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract links
scriptData = rawScript[0].textContent;
scriptData = scriptData.split('\n')

// Set video (Proof of concept: No parser nor regex)
for (let i = 0; i < scriptData.length; i++) {
  if (scriptData[i].includes('setVideoHLS')) {
    firstIndexOf = scriptData[i].indexOf('(')+2;
    lastindexOf = scriptData[i].lastIndexOf(')')-1;
    videoLink = scriptData[i].substring(firstIndexOf ,lastindexOf);
    isHLS = true;
  } else if (scriptData[i].includes('setVideoUrlHigh')) {
    firstIndexOf = scriptData[i].indexOf('(')+2;
    lastindexOf = scriptData[i].lastIndexOf(')')-1;
    videoLink = scriptData[i].substring(firstIndexOf ,lastindexOf);
  } else if (scriptData[i].includes('setVideoUrlLow')) {
      firstIndexOf = scriptData[i].indexOf('(')+2;
      lastindexOf = scriptData[i].lastIndexOf(')')-1;
      videoLink = scriptData[i].substring(firstIndexOf ,lastindexOf);
  } else if (scriptData[i].includes('contentUrl')) {
      firstIndexOf = scriptData[i].indexOf(': "')+3;
      lastindexOf = scriptData[i].lastIndexOf('",');
      videoLink = scriptData[i].substring(firstIndexOf ,lastindexOf);
  }
}

// Get list of video qualities
for (let i = 0; i < preferredResolutions.length; i++) {
  for (let j = 0; j < scriptData.length; j++) {
    if (scriptData[j].includes(preferredResolutions[i])) {
      firstIndexOf = scriptData[j].indexOf('(')+2;
      lastindexOf = scriptData[j].lastIndexOf(')')-1;
      vidsSize.push(preferredResolutions[i].slice(11));
      vidsLink.push(scriptData[j].substring(firstIndexOf ,lastindexOf));
    }
  }
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = url.hostname + '_' + docURI[4] + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('meta[property="og:title"]')
  .content;

// Get list of participants
kew = ['amateur-channel', 'amateur-channels', 'model', 'model-channels', 'models',
       'pornstar-channels', 'pornstars', 'star','star-channel'];
for (let i = 0; i < kew.length; i++) {
  for (const participant of rawDocument.querySelectorAll('li > a[href*="/' + kew[i] + '/"]')) {
    element = participant.querySelector('span[class*="user-subscribe"]');
    if (element) {participant.removeChild(element);}
    participants.push(participant);
  }
}

break;

case -81088632:

isHLS = true;

// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('spriteSources')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract links
// Set video
scriptData =
  rawScript[0]
  .textContent;

videoLink =
  scriptData
  .substring(
    scriptData.indexOf("source ='"),
    scriptData.indexOf("';")
  );

// Get title
title =
  rawDocument
  .querySelector('.title')
  .textContent;

// Get date
calendar =
  rawDocument
  .querySelector('.video__date')
  .textContent;

// Get list of participants
for (const participant of rawDocument.querySelectorAll('a.video__actor[href*="/model/"]')) {
  participants.push(participant);
}

break;

case -1614161126:
case 1381019812:

// Preferred video resolutions
preferredResolutions = [
  '240', '272', '288',
  '360', '480', '720'];

// Find script in which JSON data is stored
rawScript = [];
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('mp4Encodings')) {
    rawScript.push(scriptElement);
  }
}

// Process result and extract JSON dataset
scriptData = rawScript[0].textContent;
jsonData = scriptData.substring(
  scriptData.indexOf('[')-1,
  scriptData.indexOf(']')+1
);

// Parse JSON
jsonFile = JSON.parse(jsonData);

// Set video
for (let j = 0; j < preferredResolutions.length; j++) {
  for (let i = 0; i < jsonFile.length; i++) {
    resolution = jsonFile[i]['quality'];
    m3u8 = jsonFile[i]['filename'].includes('master.m3u8')
    if(resolution === preferredResolutions[j] && !m3u8) {
      videoLink = jsonFile[i]['filename'];
      resolution = jsonFile[i]['name'];
    }
  }
}

// Get list of video qualities
resolutions = Object.keys(jsonFile);

// Find link to file
for (let i = 0; i < resolutions.length; i++) {
  m3u8 = jsonFile[i]['filename'].includes('master.m3u8')
  if (!m3u8) {
    vidsSize.push(jsonFile[i]['name']);
    vidsLink.push(jsonFile[i]['filename']);
  }
}

// Set filename
url = new URL(rawDocument.documentURI);
docURI = url.origin + url.pathname
docURI = docURI.split("/");
videoName = location.hostname + '_' + docURI[4].slice(null,-5) + '.mp4';

// Get title
title =
  rawDocument
  .querySelector('h3');

  do {
    element = title.querySelector('*');
    title.removeChild(element);
    } while (title.querySelector('*'));

title =
  title
  .outerText;

// Get date
//calendar = rawDocument.querySelector('span.pretty-date').outerText;
//scriptData =
//  calendar[0]
//  .textContent;
var calendar;
for (const scriptElement of rawDocument.querySelectorAll('script')) {
  if (scriptElement.textContent.includes('date_added:')) {
    calendar = scriptElement;
    calendar = calendar.textContent;
    calendar = calendar.split('\n');
    for (let i = 0; i < calendar.length; i++) {
      if (calendar[i].includes('date_added:')) {
        calendar = calendar[i].slice(29,39);
      }
    }
  }
}

// date_added: always indicates 2009-01-01
//calendar = scriptData.substring(
//  scriptData.indexOf('date_added: ')+13,
//  scriptData.indexOf('date_added: ')+23
//);

//calendar =
//  scriptData.substring(
//    scriptData.indexOf('date_added_mobile: ')+20,
//    scriptData.indexOf('date_added_mobile: ')+30
//  );

// Get list of participants
//for (const participant of rawDocument.querySelectorAll('a[href*="/tags/"][href*=" "]')) {
//  participants.push(participant);
//}

break;

}

// Get list of featured participants
const featured = [];
for (const feature of rawDocument.querySelectorAll('h1 > a')) {
  featured.push(feature);
}

/*
// Get list of tags
const niches = [];
for (const niche of rawDocument.querySelectorAll('dd > a[href^="/niche/"]')) {
  niches.push(niche);
}
*/

// Clear scripts and stylesheets
// Hack 40. Remove All Page Styles on Selected Sites
// https://flylib.com/books/en/4.281.1.68/1/
//
// disable all externally linked stylesheets
//for (var i = document.styleSheets.length - 1; i >= 0; i--) {
//  document.styleSheets[i].disabled = true;
//}
//
//var arAllElements = (typeof document.all != 'undefined') ?
//document.all : document.getElementsByTagName('*');
//for (var i = arAllElements.length - 1; i >= 0; i--) {
//  var elmOne = arAllElements[i];
//  if (elmOne.nodeName.toUpperCase() == 'STYLE') {
//    // remove <style> elements defined in the page <head>
//    elmOne.parentNode.removeChild(element);
//    } else {
//      // remove per-element styles and style-related attributes
//      elmOne.setAttribute('style', '');
//      elmOne.setAttribute('size', '');
//      elmOne.setAttribute('face', '');
//      elmOne.setAttribute('color', '');
//      elmOne.setAttribute('bgcolor', '');
//      elmOne.setAttribute('background', '');
//    }
//}
//

/*

An attempt to overcome 597898866
This appears to be addressed to Falkon

for (const style of document.querySelectorAll('style')) {
  style.remove();
}

for (const element of document.querySelectorAll('*')) {
  element.style.all = 'unset';
}

for (const style of rawDocument.querySelectorAll('style')) {
  style.remove();
}

for (const element of rawDocument.querySelectorAll('*')) {
  element.style.all = 'unset';
}

*/

// TODO Clear scripts
for (var i = document.styleSheets.length - 1; i >= 0; i--) {
  document.styleSheets[i].disabled = true;
}

for (var i = document.scripts.length - 1; i >= 0; i--) {
  document.scripts[i].disabled = true;
}

for (const script of document.querySelectorAll('script')) {
  script.remove();
}

// rawDoc
for (const script of rawDocument.querySelectorAll('script')) {
  script.remove();
}

// Build a new page
const domParser = new DOMParser();
const newDocument = domParser.parseFromString(htmlPage, 'text/html');

// Place video
// Photo from Felix Mooneeram @felixmooneeram
// Source: https://unsplash.com/photos/evlkOfkQ5rE
// Background poster manipulation
// https://stackoverflow.com/questions/10826784/make-html5-video-poster-be-same-size-as-video-itself#36035198
if (videoLink) {
  let video = newDocument.querySelector('video');
      video.src = videoLink;
      video.poster = posterImage;
      video.style.background = 'url(' + backgroundImage + ') 50% 50% / cover no-repeat';

// Adapt to M3U8 media
  if (isHLS) {
    var hls = new Hls();
    hls.loadSource(video.src);
    hls.attachMedia(video);
  }

} else
if (frame) {
  let video = newDocument.querySelector('body > video');
  const iframe = document.createElement("iframe");
        iframe.style.minHeight = '560px'
        iframe.className = "centerm"
        iframe.src = frame
  video.replaceWith(iframe);
}

// Place title
//if (!title) {title = document.title}
newTitle = newDocument.getElementById('title');
  newTitle.append(title);
  newDocument.title = title;

// Place date
cal = newDocument.getElementById('date');
if (calendar) {
  cal.append(calendar); // TODO reset href and preserve style
} else {
  //cal.append('N/A');
  //newDocument.querySelector('div:has(#date)').remove();
  newDocument.getElementById('date-key').remove();
  
};

// Place participants
if (participants.length) {

  for (let i = 0; i < participants.length; i++) {
    //let a = newDocument.createElement('a');
      //a.href = participants[i].href;
      //a.append(participants[i].outerText);
    let model = newDocument.getElementById('models');
    model.append(participants[i]);
  //    models.append(a);
  }

  let victims = newDocument.getElementById('victims');
  victims.prepend(participants.length + ' Participants:');
}

/*
// Place tags
for (let i = 0; i < niches.length; i++) {
  let a = newDocument.createElement('a');
    a.href = niches[i].href;
    a.append(niches[i].outerText);

  let tag = newDocument.getElementById('tags');
    tag.append(a);
}

let tags = newDocument.getElementById('niche');
tags.prepend(niches.length) + ' Tags:';
*/

// Place video links
if (vidsLink.length > 1) {
  let download = newDocument.getElementById('downloads');
  for (let i = 0; i < vidsLink.length; i++) {
    let a = newDocument.createElement('a');
    a.title = 'Right-click: Save link as...';
    a.download = videoName; // FIXME
    a.href = vidsLink[i];
    a.textContent = vidsSize[i];
    download.append(a);
  }
  // Place video links
  let videos = newDocument.getElementById('videos');
  videos.prepend(vidsLink.length + ' Resolutions:');
}

// Get time [hour:minute]
const date = new Date();
minute = date.getMinutes();
hour = date.getHours();
if (date.getMinutes() < 10) {minute = '0' + minute;}
time = hour + ':' + minute;

// Build clock
let clock = newDocument.getElementById('clock');
clock.append(time);

// Set Keywords
// Try ID
keyword = title;
//regex = /([^\s*])[A-Z].[0-9]{1,}$/g;
regex = /([^\s*])[A-Z].[0-9]{1,}/g;
keyword = keyword.match(regex);

// Try featured participants
if (!keyword && featured.length > 1) {
  keyword = ''
  featured.forEach(feature => keyword = keyword + ' ' + feature.outerText)
  keyword = keyword.trim();
}

// Try match title participants
if (!keyword) {
  keyword = title;
  const chars = [/'s/, /'/, /0%/, /%/, /!/, /(?!\/)(?!\ )(?!\-)(\W)/ig, '(', ')']
  chars.forEach(char => keyword = keyword.replace(char, ' '));
  //keyword = keyword.replace(/(?!\/)(?!\ )(?!\-)(\W)/ig, ' ')
  titleClean = keyword; // We need it when search by entire title
  //console.log('keyword')
  //console.log(keyword)
  keywords = keyword.split(' ');
  //console.log('keywords')
  //console.log(keywords)
  keyword = ''
  let names = [];
  participants.forEach(participant => names.push(participant.outerText));
  //console.log(names)
  names = names.toString().split(' ');
  //console.log(names)
  names = names.toString().split(',');
  //console.log(names)
  for (let i = 0; i < names.length; i++) {
    name = names[i];
    //console.log('name')
    //console.log(name)
    //console.log('names')
    //console.log(names)
    for (let j = 0; j < keywords.length; j++) {
      // We can also attempt to perform a 100% match
      // by splitting each participants[i].split(' ')
      //console.log(name)
      if (keywords[j].includes(name)) {
        if (!keyword.includes(keywords[j])) {
          keyword = keyword + ' ' + keywords[j];
          //console.log('keywords')
          //console.log(keywords)
          //console.log('keyword')
          //console.log(keyword)
        }
      }
    }
  }
  keyword = keyword.trim();
  //if (keyword === keyword.split(' ').toString()) {
  if (keyword.split(' ').length < 2) {
    keyword = '';
  }
  for (let i = 0; i < participants.length; i++) {
    if (keyword.match(participants[i].outerText)) {
      keyword = '';
      break;
    }
  }
}

// Set Title as keyword
if (!keyword) {
  keyword = titleClean;
}

// Place torrent indexers
for (let i = 0; i < indexer.length; i++) {
  torrent = indexer[i].split(',');
  let a = newDocument.createElement('a');
  a.href = torrent[1] + keyword;
  a.append(torrent[0]);

  let torrents= newDocument.getElementById('torrents');
  torrents.append(a);
}

// Place deceased
//ele = newDocument.getElementById('deceased')
if (participants.length) {
  let names = [], warnings = [];
  for (let i = 0; i < participants.length; i++) {
    for (let j = 0; j < deceased.people.length; j++) {
      if (deceased.people[j].exec.includes(participants[i].textContent)) {
        names.push(participants[i].textContent);
        //participants[i].textContent += ' (deceased)'
        participants[i].textContent = `🪦️ ${participants[i].textContent}`
      }
    }
  }
  if (names.length) {
    if (names.length == 1) {
      warnings = [
        //'Attention: ',
       `WARNING! At least one person in this video is not alive; ${names} has died prematurely.`,
       `Did you know that ${names}, who is featured in this video, is dead?`,
       `${names} is dead. Did you know?`,
       `${names} has left the building!`,
       `${names} has left the building! (${names} is dead). Did you know that?`,
       `${names} is dead`,
       //`WARNING! At least one person in this video is not alive; ${deceased.people[i].pref} ${deceased.people[i].name} aka ${deceased.people[i].exec} has died prematurely at the age of ${deceased.people[i].year} (${deceased.people[i].date})`,
       //`Did you know that ${deceased.people[i].name} aka ${deceased.people[i].exec}, who is featured in this video, is dead since ${deceased.people[i].date}? ${deceased.people[i].pref} ${deceased.people[i].name} has deceased at ${deceased.people[i].year} years of age.`,
       //`${deceased.people[i].pref} ${deceased.people[i].name} aka ${deceased.people[i].exec} is dead since ${deceased.people[i].date}. Did you know that?`,
      ];
    } else
    if (names.length == participants.length) {
      name = names.join(' and ');
      warnings = [
       `${name} are dead. Did you know?`,
       `ATTENTION: You are watching dead people (${name})`,
       `ATTENTION: This video features deceased people (${name})`,
       `I see dead people (${name} are not alive)`,
       `ATTENTION: All the people featured in this video are dead`,
       `ALL of the people who are featured in this video are dead`,
      ];
    } else
    if (names.length > 1) {
      name = names.join(' and ');
      warnings = [
       `${name} are dead. Did you know?`,
       `Attention: You are watching dead people (${name})`,
       `Attention: This video features deceased people (${name})`,
       `I see dead people (${name} are not alive)`,
       `ATTENTION! At least ${names.length} people in this video are not alive; ${name} have died prematurely.`,
      ];
    }
      warning = warnings[Math.floor(Math.random()*warnings.length)];
      war = newDocument.createElement('div');
      war.id = 'deceased';
      //war.className = 'centert';
      war.textContent = '>>> This video features deceased people';
      ele = newDocument.getElementById('victims');
      ele.append(war);
  }
}

if (warning) {
  let icons = ['🪦️', '⚰️', '💀'];
  let icon = icons[Math.floor(Math.random()*icons.length)];
  motdMsg = `${icon} ${warning}`;
  motdHrf = false;
} else {
  // Message of the day
  motd = motds[Math.floor(Math.random()*motds.length)];
  //motdEmg = motd.split('|')[0];
  motdMsg = motd.split('|')[0];
  motdHrf = motd.split('|')[1];
  console.info(motdMsg + ' ' + motdHrf)
}

let a = newDocument.createElement('a');
  a.id = 'motd';
  a.addEventListener("click", spin, false);
  a.style.textDecoration = 'none';
  a.style.fontWeight = 'inherit';
  a.style.color = 'black';
  a.textContent = motdMsg;
  if (motdHrf) {
    a.href = motdHrf;
    a.rel = 'noreferrer';
    a.style.color = 'blue';
  }

let div = newDocument.createElement('div');
  div.className = 'centert';
  div.append(a)

//let e = newDocument.createElement('div');
//  e.innerHTML = motdEmg;
//  e.style.fontSize = '6em'
//  a.append(e)

// Get footer
footer = newDocument.querySelector('body > div.footer.recommend > div');
  footer.replaceWith(div)
//footer.textContent = motdMsg;
//footer.href = motdHrf;

let o = newDocument.createElement('marquee');
  // FIXME start/stop not working
  o.onmouseover = 'this.stop()';
  o.onmouseout = 'this.start()';
  o.scrollAmount = '3';
  o.scrollDelay = '26';
  o.textContent = motdMsg;
  o.loop = '3';

let d = newDocument.createElement('div');
  d.className = 'centert shadow';
  d.id = 'fact';
  d.style.left = 0; //
  d.style.right = 0; //
  //d.style.top = 0; //
  d.style.bottom = 0; //
  //FIXME onclick not working
  d.onclick = () => {
    document.getElementById('fact').remove();
    document.getElementById('motd').scrollIntoView();
    //window.scrollTo(0, document.body.scrollHeight);
  }
  d.append(o);

const top = newDocument.querySelector('body');
  top.prepend(d);

// Replace the old with the new
//insertDocument = document.adoptNode(newDocument.documentElement, true);
insertDocument = document.importNode(newDocument.documentElement, true);
removeDocument = document.documentElement;

// Erase page
document.head.remove()
//document.body.remove()

// Replace page
document
  .replaceChild(insertDocument, removeDocument);

// NOTE the background mught be of use
document
  .querySelector('video')
  .onplay = () => {
    document
      .querySelector('video')
      .style.background = 'black'; // 'none'
  }

document
  .getElementById('fact')
  .onclick = () => {
    document.getElementById('fact').remove();
    document.getElementById('motd').scrollIntoView();
    //window.scrollTo(0, document.body.scrollHeight);
  }


// Count down
// https://stackoverflow.com/questions/27406765/hide-div-after-x-amount-of-seconds

var secs = 120;
function timeOut() {
  secs -= 1;
  if (secs == 0 &&
      document.getElementById('fact')) {
    document.getElementById('fact').remove();
    return;
  }
  else {
    setTimeout(timeOut, 1000);
  }
}
timeOut();

cssSelectors = ['#title', '.quote']
for (let i = 0; i < cssSelectors.length; i++) {
  for (element of document.querySelectorAll(cssSelectors[i])) {
    element.onclick = () => {spin()};
  }
}

}; // End of window.onload = (event) // Perhaps should be DOMContentLoaded

function introPageLoader(){
// FIXME [NOTE onloadstart]
//window.onprogress = (event) => {
  const domParser = new DOMParser();
  const splDocument = domParser.parseFromString(introPage, 'text/html');
  insertDocument = document.importNode(splDocument.documentElement, true);
  removeDocument = document.documentElement;
  document.replaceChild(insertDocument, removeDocument);
//}
}

function errorPageLoader(error, message){
  const domParser = new DOMParser();
  const errDocument = domParser.parseFromString(errorPage, 'text/html');
  errDocument.getElementById('type').innerHTML = message;
  if (error == 404) {
    error  = 'Video has either been removed or is waiting for moderation; it is also possible that the page address is invalid.'
  } else if (error == 403) {
    error = 'Access forbidden'
  }
  errDocument.getElementById('error').innerHTML = error;
  insertDocument = document.importNode(errDocument.documentElement, true);
  removeDocument = document.documentElement;
  document.replaceChild(insertDocument, removeDocument);
}

// Detect inactivity
// https://www.brcline.com/blog/detecting-inactivity-in-javascript
// https://stackoverflow.com/questions/24338450/how-to-detect-user-inactivity-with-javascript

onInactive(50000, function () {
    console.log('Inactivity detected')
    if (document.querySelector('video')) {
      if (document.querySelector('video').paused) {
        document.body.style.filter = 'blur(13px)';
        //window.scrollTo(0, document.body.scrollHeight);
        document.getElementById('motd').scrollIntoView();
      }
    } else {
      location.href = location.href;
    }
});

window.addEventListener('wheel',event => {
  document.body.style.filter = 'unset';
  removeSrc();
}, {passive: true});

window.addEventListener('keydown',event => {
  document.body.style.filter = 'unset';
  removeSrc();
}, {passive: true});

window.addEventListener('mousemove',event => {
  document.body.style.filter = 'unset';
  removeSrc();
}, {passive: true});

window.addEventListener('hashchange', event => {
  url = new URL(location.href);
  if (url.hash === '#utm') {
    location.reload();
  }
}, {passive: true});

function removeSrc(){
  // image
  for (const image of document.querySelectorAll('img.emoji')) {
    //image.removeAttribute('role');
    //image.removeAttribute('draggable');
    //image.removeAttribute('class');
    //image.height = '25px';
    //image.width = '25px';
    //
    //image.removeAttribute('src');
    image.style.display = 'none';
    //
    //image.src = '';
    //if (!image.parentElement.textContent.includes(image.alt)) {
    //  image.parentElement.prepend(image.alt);
    //  image.remove();
    //}
    //
    //if (!image.parentElement.textContent.includes(image.alt)) {
    //  image.parentElement.textContent = image.alt + ' ' + image.parentElement.textContent;
    //  image.remove();
    //}
  }

  // video
  vElement = document.querySelector('video');
  vElement.poster = posterImage;
  vElement.style.background = 'unset';
}

function onInactive(ms, cb) {
  var wait = setTimeout(cb, ms);
  document.onmousemove = 
  document.onmousedown = 
  document.onmouseup = 
  document.onkeydown = 
  document.onkeyup = 
  document.onfocus = 
  function () {
    clearTimeout(wait);
    wait = setTimeout(cb, ms);
  };
}

// TODO
// Consider reset counter upon mouse activity
// https://stackoverflow.com/questions/24338450/how-to-detect-user-inactivity-with-javascript
// Interval
// https://stackoverflow.com/questions/13304471/javascript-get-code-to-run-every-minute
setInterval(function() {
  spin()
}, 180 * 1000); // 180 * 1000 milsec


// Message of the day
// TODO https://stackoverflow.com/questions/55177513/how-to-copy-a-variable-into-the-clipboard
function spin() {
  motd = motds[Math.floor(Math.random()*motds.length)];
  motdMsg = motd.split('|')[0];
  motdHrf = motd.split('|')[1];
  motd = document.getElementById('motd')
  motd.textContent = motdMsg;
  if (motdHrf) {
    motd.href = motdHrf;
    motd.rel = 'noreferrer';
    motd.style.color = 'blue'; //#A40000 //#204A87 //DarkRed //#204A87 //#5C3566 //#75507B
    //motd.style.fontStyle = 'italic'
  } else {
    motd.removeAttribute('href');
    motd.style.color = 'black';
    //motd.style.fontStyle = 'normal'
  }
}

//motd = document.getElementById('motd')
//motd.addEventListener("click", spin, false);

// https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

/* TODO Screen change on inactivity

time = 6000
const domParser = new DOMParser();
const splDocument = domParser.parseFromString(introPage, 'text/html');
introScreen()

function startIntro() {
  console.log("startIntro")
  insertDocument = document.importNode(splDocument.documentElement, true);
  removeDocument = document.documentElement;
  document.replaceChild(insertDocument, removeDocument);
}

function resetCount() {
  console.log("resetCount")
  window.clearTimeout(to);
  to = window.setTimeout(startIntro, time);
}

function introScreen() {
  console.log("introScreen")
  to = window.setTimeout(startIntro, time);
  window.addEventListener("click", resetCount, false);
  window.addEventListener("keyup", resetCount, false);
}

*/
