// ==UserScript==
// @name         DOUBAN Movie info for TorrentGalaxy
// @namespace    http://tgx.rs/
// @version      0.7.0
// @description  Adds douban movie info to TorrentGalaxy
// @author       tofuliang
// @match        https://tgx.rs/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.slim.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_download
// @grant        GM_info
// @connect      m.douban.com
// @connect      movie.douban.com
// @downloadURL https://update.greasyfork.org/scripts/17663/DOUBAN%20Movie%20info%20for%20TorrentGalaxy.user.js
// @updateURL https://update.greasyfork.org/scripts/17663/DOUBAN%20Movie%20info%20for%20TorrentGalaxy.meta.js
// ==/UserScript==


function isEmpty(s) {
    return !s || s === 'N/A';
}
function encode(s) {
    let out = [];
    for ( let i = 0; i < s.length; i++ ) {
        out[i] = s.charCodeAt(i);
    }
    return new Uint8Array( out );
}

function combineFiled(a,k){
    let ak=[];
    a.forEach((v) => v.hasOwnProperty(k) && ak.push(v[k]));
    return ak.join(' / ')
}
Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}
let emptyStar = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ5Ljk0IDQ5Ljk0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0OS45NCA0OS45NDsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxwYXRoIGQ9Ik00OC44NTYsMjIuNzMxYzAuOTgzLTAuOTU4LDEuMzMtMi4zNjQsMC45MDYtMy42NzFjLTAuNDI1LTEuMzA3LTEuNTMyLTIuMjQtMi44OTItMi40MzhsLTEyLjA5Mi0xLjc1NyAgYy0wLjUxNS0wLjA3NS0wLjk2LTAuMzk4LTEuMTktMC44NjVMMjguMTgyLDMuMDQzYy0wLjYwNy0xLjIzMS0xLjgzOS0xLjk5Ni0zLjIxMi0xLjk5NmMtMS4zNzIsMC0yLjYwNCwwLjc2NS0zLjIxMSwxLjk5NiAgTDE2LjM1MiwxNGMtMC4yMywwLjQ2Ny0wLjY3NiwwLjc5LTEuMTkxLDAuODY1TDMuMDY5LDE2LjYyM0MxLjcxLDE2LjgyLDAuNjAzLDE3Ljc1MywwLjE3OCwxOS4wNiAgYy0wLjQyNCwxLjMwNy0wLjA3NywyLjcxMywwLjkwNiwzLjY3MWw4Ljc0OSw4LjUyOGMwLjM3MywwLjM2NCwwLjU0NCwwLjg4OCwwLjQ1NiwxLjRMOC4yMjQsNDQuNzAyICBjLTAuMjMyLDEuMzUzLDAuMzEzLDIuNjk0LDEuNDI0LDMuNTAyYzEuMTEsMC44MDksMi41NTUsMC45MTQsMy43NzIsMC4yNzNsMTAuODE0LTUuNjg2YzAuNDYxLTAuMjQyLDEuMDExLTAuMjQyLDEuNDcyLDAgIGwxMC44MTUsNS42ODZjMC41MjgsMC4yNzgsMS4xLDAuNDE1LDEuNjY5LDAuNDE1YzAuNzM5LDAsMS40NzUtMC4yMzEsMi4xMDMtMC42ODhjMS4xMTEtMC44MDgsMS42NTYtMi4xNDksMS40MjQtMy41MDIgIEwzOS42NTEsMzIuNjZjLTAuMDg4LTAuNTEzLDAuMDgzLTEuMDM2LDAuNDU2LTEuNEw0OC44NTYsMjIuNzMxeiBNMzcuNjgxLDMyLjk5OGwyLjA2NSwxMi4wNDJjMC4xMDQsMC42MDYtMC4xMzEsMS4xODUtMC42MjksMS41NDcgIGMtMC40OTksMC4zNjEtMS4xMiwwLjQwNS0xLjY2NSwwLjEyMWwtMTAuODE1LTUuNjg3Yy0wLjUyMS0wLjI3My0xLjA5NS0wLjQxMS0xLjY2Ny0wLjQxMXMtMS4xNDUsMC4xMzgtMS42NjcsMC40MTJsLTEwLjgxMyw1LjY4NiAgYy0wLjU0NywwLjI4NC0xLjE2OCwwLjI0LTEuNjY2LTAuMTIxYy0wLjQ5OC0wLjM2Mi0wLjczMi0wLjk0LTAuNjI5LTEuNTQ3bDIuMDY1LTEyLjA0MmMwLjE5OS0xLjE2Mi0wLjE4Ni0yLjM0OC0xLjAzLTMuMTcgIEwyLjQ4LDIxLjI5OWMtMC40NDEtMC40My0wLjU5MS0xLjAzNi0wLjQtMS42MjFjMC4xOS0wLjU4NiwwLjY2Ny0wLjk4OCwxLjI3Ni0xLjA3N2wxMi4wOTEtMS43NTcgIGMxLjE2Ny0wLjE2OSwyLjE3Ni0wLjkwMSwyLjY5Ny0xLjk1OWw1LjQwNy0xMC45NTdjMC4yNzItMC41NTIsMC44MDMtMC44ODEsMS40MTgtMC44ODFjMC42MTYsMCwxLjE0NiwwLjMyOSwxLjQxOSwwLjg4MSAgbDUuNDA3LDEwLjk1N2MwLjUyMSwxLjA1OCwxLjUyOSwxLjc5LDIuNjk2LDEuOTU5bDEyLjA5MiwxLjc1N2MwLjYwOSwwLjA4OSwxLjA4NiwwLjQ5MSwxLjI3NiwxLjA3NyAgYzAuMTksMC41ODUsMC4wNDEsMS4xOTEtMC40LDEuNjIxbC04Ljc0OSw4LjUyOEMzNy44NjYsMzAuNjUsMzcuNDgxLDMxLjgzNSwzNy42ODEsMzIuOTk4eiIgZmlsbD0iI0ZGREE0NCIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K';
let solidStar = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTEyLjAwMiA1MTIuMDAyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIuMDAyIDUxMi4wMDI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfMV8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMjM2LjkzODIiIHkxPSI0NTguNDI4NCIgeDI9IjIzNi45MzgyIiB5Mj0iLTcxLjE4MTYiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMS4wNjY3IDAgMCAtMS4wNjY3IDMuMjY2NiA1NTcuNTM1MikiPg0KCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkNGOTUiLz4NCgk8c3RvcCAgb2Zmc2V0PSIwLjQyNyIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQzk1NCIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkMyMDAiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBzdHlsZT0iZmlsbDp1cmwoI1NWR0lEXzFfKTsiIGQ9Ik0yNzQuODQsMjMuMjEybDY3LjcyMiwxMzcuMjE4bDE1MS40MjksMjIuMDA0YzE3LjIzMiwyLjUwMywyNC4xMTIsMjMuNjgsMTEuNjQ0LDM1LjgzNQ0KCUwzOTYuMDU4LDMyNS4wNzdsMjUuODY3LDE1MC44MTdjMi45NDQsMTcuMTYyLTE1LjA3LDMwLjI1LTMwLjQ4MiwyMi4xNDdMMjU2LDQyNi44MzVsLTEzNS40NDIsNzEuMjA2DQoJYy0xNS40MTIsOC4xMDItMzMuNDI2LTQuOTg1LTMwLjQ4Mi0yMi4xNDdsMjUuODY3LTE1MC44MTdMNi4zNjcsMjE4LjI2OGMtMTIuNDY5LTEyLjE1NS01LjU4OC0zMy4zMywxMS42NDQtMzUuODM1bDE1MS40MjktMjIuMDA0DQoJbDY3LjcyMS0xMzcuMjE3QzI0NC44NjgsNy41OTcsMjY3LjEzMyw3LjU5NywyNzQuODQsMjMuMjEyeiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8yXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIzNjEuMzM4IiB5MT0iMzkwLjEzMTQiIHgyPSIyMDEuMjM4IiB5Mj0iMzkwLjEzMTQiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMS4wNjY3IDAgMCAtMS4wNjY3IDMuMjY2NiA1NTcuNTM1MikiPg0KCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkMyMDA7c3RvcC1vcGFjaXR5OjAiLz4NCgk8c3RvcCAgb2Zmc2V0PSIwLjIwMyIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQkIwMDtzdG9wLW9wYWNpdHk6MC4yMDMiLz4NCgk8c3RvcCAgb2Zmc2V0PSIwLjQ5OSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQTcwMDtzdG9wLW9wYWNpdHk6MC40OTkiLz4NCgk8c3RvcCAgb2Zmc2V0PSIwLjg1MiIgc3R5bGU9InN0b3AtY29sb3I6I0ZGODgwMDtzdG9wLW9wYWNpdHk6MC44NTIiLz4NCgk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojRkY3ODAwIi8+DQo8L2xpbmVhckdyYWRpZW50Pg0KPHBhdGggc3R5bGU9ImZpbGw6dXJsKCNTVkdJRF8yXyk7IiBkPSJNMzQyLjU2LDE2MC40M0wyNzQuODQsMjMuMjEyYy0zLjg1My03LjgwNy0xMS4zNDYtMTEuNzExLTE4LjgzOS0xMS43MTF2MjU5Ljc4OQ0KCUwzNDIuNTYsMTYwLjQzeiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8zXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIzODguNjg3NCIgeTE9IjE0NC44MzgzIiB4Mj0iMzQ2LjI4NzQiIHkyPSIzNTMuNjM4MyIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjA2NjcgMCAwIC0xLjA2NjcgMy4yNjY2IDU1Ny41MzUyKSI+DQoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQzIwMDtzdG9wLW9wYWNpdHk6MCIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuMjAzIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZCQjAwO3N0b3Atb3BhY2l0eTowLjIwMyIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuNDk5IiBzdHlsZT0ic3RvcC1jb2xvcjojRkZBNzAwO3N0b3Atb3BhY2l0eTowLjQ5OSIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuODUyIiBzdHlsZT0ic3RvcC1jb2xvcjojRkY4ODAwO3N0b3Atb3BhY2l0eTowLjg1MiIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRjc4MDAiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBzdHlsZT0iZmlsbDp1cmwoI1NWR0lEXzNfKTsiIGQ9Ik0zOTYuMDU4LDMyNS4wNzdsMTA5LjU3NS0xMDYuODFjNi4xNTEtNS45OTYsNy41ODYtMTQuMTg1LDUuMzk5LTIxLjI0N0wyNTYsMjcxLjI4OQ0KCUwzOTYuMDU4LDMyNS4wNzd6Ii8+DQo8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzRfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjE4My4wOTc3IiB5MT0iMzUuMTA4NyIgeDI9IjM0OS4xNTc3IiB5Mj0iMjAxLjE2ODciIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMS4wNjY3IDAgMCAtMS4wNjY3IDMuMjY2NiA1NTcuNTM1MikiPg0KCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkMyMDA7c3RvcC1vcGFjaXR5OjAiLz4NCgk8c3RvcCAgb2Zmc2V0PSIwLjIwMyIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQkIwMDtzdG9wLW9wYWNpdHk6MC4yMDMiLz4NCgk8c3RvcCAgb2Zmc2V0PSIwLjQ5OSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQTcwMDtzdG9wLW9wYWNpdHk6MC40OTkiLz4NCgk8c3RvcCAgb2Zmc2V0PSIwLjg1MiIgc3R5bGU9InN0b3AtY29sb3I6I0ZGODgwMDtzdG9wLW9wYWNpdHk6MC44NTIiLz4NCgk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojRkY3ODAwIi8+DQo8L2xpbmVhckdyYWRpZW50Pg0KPHBhdGggc3R5bGU9ImZpbGw6dXJsKCNTVkdJRF80Xyk7IiBkPSJNNDEzLjYzLDQ5Ni4zOTNMMjU2LDI3MS4yODl2MTU1LjU0NmwxMzUuNDQyLDcxLjIwNg0KCUMzOTkuMTc2LDUwMi4xMDcsNDA3LjU2Myw1MDAuODM1LDQxMy42Myw0OTYuMzkzeiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF81XyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSI2NC42Nzc3IiB5MT0iMjQ1LjEwOCIgeDI9IjE4Ny4wNzc3IiB5Mj0iMTQyLjcwOCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjA2NjcgMCAwIC0xLjA2NjcgMy4yNjY2IDU1Ny41MzUyKSI+DQoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQzIwMDtzdG9wLW9wYWNpdHk6MCIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuMjAzIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZCQjAwO3N0b3Atb3BhY2l0eTowLjIwMyIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuNDk5IiBzdHlsZT0ic3RvcC1jb2xvcjojRkZBNzAwO3N0b3Atb3BhY2l0eTowLjQ5OSIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuODUyIiBzdHlsZT0ic3RvcC1jb2xvcjojRkY4ODAwO3N0b3Atb3BhY2l0eTowLjg1MiIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRjc4MDAiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBzdHlsZT0iZmlsbDp1cmwoI1NWR0lEXzVfKTsiIGQ9Ik0yNTYsMjcxLjI4OWwtMTQwLjA1OCw1My43ODhMOTAuMDc2LDQ3NS44OTRjLTEuNDY3LDguNTUsMi4yNzEsMTYuMDg3LDguMjk0LDIwLjQ5OQ0KCUwyNTYsMjcxLjI4OXoiLz4NCjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfNl8iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMTU2LjQzMzQiIHkxPSI0MTQuMDIiIHgyPSIxMDYuODMzNCIgeTI9IjI3My4yMiIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjA2NjcgMCAwIC0xLjA2NjcgMy4yNjY2IDU1Ny41MzUyKSI+DQoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQzIwMDtzdG9wLW9wYWNpdHk6MCIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuMjAzIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZCQjAwO3N0b3Atb3BhY2l0eTowLjIwMyIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuNDk5IiBzdHlsZT0ic3RvcC1jb2xvcjojRkZBNzAwO3N0b3Atb3BhY2l0eTowLjQ5OSIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuODUyIiBzdHlsZT0ic3RvcC1jb2xvcjojRkY4ODAwO3N0b3Atb3BhY2l0eTowLjg1MiIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRjc4MDAiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBzdHlsZT0iZmlsbDp1cmwoI1NWR0lEXzZfKTsiIGQ9Ik0wLjk2OCwxOTcuMDIxTDI1NiwyNzEuMjg5bC04Ni41Ni0xMTAuODZMMTguMDExLDE4Mi40MzQNCglDOS4yOCwxODMuNzAyLDMuMjE0LDE4OS43NjcsMC45NjgsMTk3LjAyMUwwLjk2OCwxOTcuMDIxeiIvPg0KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF83XyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIzNDMuMTM5OSIgeTE9IjM5OS4zMTY0IiB4Mj0iLTIxLjI2MDEiIHkyPSIyNDQuMTE2NCIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjA2NjcgMCAwIC0xLjA2NjcgMy4yNjY2IDU1Ny41MzUyKSI+DQoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6I0ZGQzIwMDtzdG9wLW9wYWNpdHk6MCIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuMjAzIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZCQjAwO3N0b3Atb3BhY2l0eTowLjIwMyIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuNDk5IiBzdHlsZT0ic3RvcC1jb2xvcjojRkZBNzAwO3N0b3Atb3BhY2l0eTowLjQ5OSIvPg0KCTxzdG9wICBvZmZzZXQ9IjAuODUyIiBzdHlsZT0ic3RvcC1jb2xvcjojRkY4ODAwO3N0b3Atb3BhY2l0eTowLjg1MiIvPg0KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRjc4MDAiLz4NCjwvbGluZWFyR3JhZGllbnQ+DQo8cGF0aCBzdHlsZT0iZmlsbDp1cmwoI1NWR0lEXzdfKTsiIGQ9Ik0xMTUuOTQzLDMyNS4wNzdMNi4zNjcsMjE4LjI2OGMtNi4xNTEtNS45OTYtNy41ODYtMTQuMTg1LTUuMzk5LTIxLjI0N0wyNTYsMjcxLjI4OQ0KCUwxMTUuOTQzLDMyNS4wNzd6Ii8+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==';
let staredMovies = GM_getValue("staredMovies", {});
let starMovie = function(starId,date){
    date = date || new Date();
    staredMovies[starId] = +(date);
    GM_setValue('staredMovies',staredMovies);
}
let unStarMovie = function(starId){
    delete staredMovies[starId];
    GM_setValue('staredMovies',staredMovies);
}
let checkMovieStared = function(starId,defaultValue){
    return staredMovies.hasOwnProperty(starId)?staredMovies[starId]:defaultValue;
}
let exportStaredMovies = function(){
    let str = JSON.stringify(staredMovies);
    let data = encode(str);
    let blob = new Blob( [ data ], {
        type: 'application/octet-stream'
    });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', data.name != null ? data.name : 'staredMovies.json');
    document.documentElement.appendChild(a);
    let e = new MouseEvent('click');
    a.dispatchEvent(e);
    document.documentElement.removeChild(a);
    setTimeout(function() {
        URL.revokeObjectURL(url);
        if ('close' in blob) blob.close();
        blob = undefined;
    }, 1000);
    GM_download(url);
}
let importStaredMovies = function(){
    let movies = prompt("请输入从别处导出的已收藏电影",'');
    if (movies !== null) {
        let _movies = JSON.parse(movies);
        for( let movieId in _movies){
            staredMovies[movieId] = _movies[movieId];
        }
        GM_setValue('staredMovies',staredMovies);
        overlib('<span>成功导入'+Object.keys(_movies).length+'部已收藏电影</span>');
        setTimeout(nd,5000);
    }
}

let enableSwitchListAMenuID,disableSwitchListAMenuID,switchListA = function(){
    if(GM_getValue('switchListA',0) === 0){
        GM_setValue('switchListA',1);
        if(disableSwitchListAMenuID){
            GM_unregisterMenuCommand(disableSwitchListAMenuID);
        }
    }else{
        GM_setValue('switchListA',0);
        if(enableSwitchListAMenuID){
            GM_unregisterMenuCommand(enableSwitchListAMenuID);
        }
    }
    window.location.reload();
}
async function asyncGM_xmlhttpRequest(url) {
    return new Promise(function (resolve, reject) {
        GM_xmlhttpRequest({
            headers:{Referer:'https://m.douban.com'},
            method: 'GET',
            url: url,
            onload: function(response) {
                resolve(response);
            },
            onerror: function () {
                reject('你网络有问题...');
            },
            ontimeout: function () {
                reject('请求超时...');
            }
        });
    });
}
async function getDoubanData(imdbId){
    let data = GM_getValue('douBanInfo_' + imdbId, undefined);
    if (undefined !== data && +(new Date()) - data.lastModify < 86400000*7) {
        return data;
    }else{
        try{
            let doubanId = ''
            let response = await asyncGM_xmlhttpRequest('https://m.douban.com/search/?query=' + imdbId );
            let matches = /\/movie\/subject\/(\d+)/.exec(response.responseText);
            if(null !== matches && matches.length>1 && !isEmpty(matches[1])){
                doubanId = matches[1];
            }else{
                overlib('<span>你太潮了,豆瓣都没资料...</span>');
            }
            if(doubanId.length > 1){
                response = await asyncGM_xmlhttpRequest('https://m.douban.com/rexxar/api/v2/movie/' + doubanId);
                if(response.status === 404 && /douban.com\/api\/v2\/tv\/(\d+)/.test(response.finalUrl)){
                    response = await asyncGM_xmlhttpRequest('https://m.douban.com/rexxar/api/v2/tv/' + doubanId);
                    if(0 === response.responseText.indexOf('{') && '}' === response.responseText.slice(-1)){
                        data = JSON.parse(response.responseText);
                        if (!isEmpty(data.title)) {
                            data.lastModify = +(new Date());
                            GM_setValue('douBanInfo_' + imdbId, data);
                            return data;
                        }else if(data.code !==null && data.code !==undefined ){
                            overlib('<span>豆瓣大爷不干了('+response.status + ': '+response.statusText+')</span><span>(搪塞理由:'+data.code+':'+data.msg +')...</span>');
                        }else{
                            overlib('<span>天晓得发生什么事了('+response.status + ': '+response.statusText+')...</span>');
                        }
                    }
                }else if(0 === response.responseText.indexOf('{') && '}' === response.responseText.slice(-1)){
                    data = JSON.parse(response.responseText);
                    if (!isEmpty(data.title)) {
                        data.lastModify = +(new Date());
                        GM_setValue('douBanInfo_' + imdbId, data);
                        return data;
                    }else if(data.code !==null && data.code !==undefined ){
                        overlib('<span>豆瓣大爷不干了('+response.status + ': '+response.statusText+')</span><span>(搪塞理由:'+data.code+':'+data.msg +')...</span>');
                    }
                }else{
                    overlib('<span>天晓得发生什么事了('+response.status + ': '+response.statusText+')...</span>');
                }
            }else{
                overlib('<span>你太潮了,豆瓣都没资料...</span>');
            }

        }catch(e){
            console.log(e)
            overlib('exception',e);
        }
        return false;
    }
}

for (let s of GM_listValues()){
    if(s.indexOf('starInfo_') !== -1){
        starMovie(s.replace('starInfo_',''),GM_getValue(s, +(new Date())));
        GM_deleteValue(s);
    }
}

if(GM_getValue('switchListA',0) === 0){
    enableSwitchListAMenuID = GM_registerMenuCommand("开启推荐项豆瓣信息", switchListA);
}else{
    disableSwitchListAMenuID = GM_registerMenuCommand("取消推荐项豆瓣信息", switchListA);
}


GM_registerMenuCommand("导出已收藏电影", exportStaredMovies);
GM_registerMenuCommand("导入已收藏电影", importStaredMovies);

$('body').on('mouseenter', 'a[data-imdbId]', function() {
    let timer =0, overlibed = 0;
    let imdbId = $(this).attr('data-imdbId');
    let aTag = this;
    timer = setTimeout(function(){
        overlib('<span style="background:#ccc;">数据加载中...</span>');
        function showDouBanInfo(data,aTag) {
            let html = '<style type="text/css"> .db-container {width: 1000px;overflow: hidden;background:#ccc;} .db-title p {font-size: x-large; margin: 5px 0px; text-align: center; font-weight: bolder; } .db-left {width: 150px; float: left; text-align: center; } .db-poster {margin: 10px 10px; text-align: center; } .db-score {margin: 0 10px; } .db-score p {font-size: large; } .db-info {width: 850px; float: right; } </style>';
            html += '<div class="db-container">';
            html += '    <div class="db-title">';
            html += '        <p>' + data.original_title + ' ' + data.title + ' (' + data.year + ')</p>';
            html += '    </div>';
            html += '    <div class="db-left"><div class="db-poster"><img style="max-width: 135px;" src="' + data.pic.normal + '"></div>';
            html += '    <div class="db-score">';
            html += '        <p>' + data.rating.value + ' / ' + data.rating.count + '</p>';
            html += '    </div></div>';
            html += '    <div class="db-info">';
            if (!isEmpty(data.pubdate)) { html += '        <p>上映时间: ' + data.pubdate.join(' / ') + '</p>'; }
            if (!isEmpty(data.duration)) { html += '        <p>片长: ' + data.duration.join(' / ') + '</p>'; }
            if (!isEmpty(data.aka)) { html += '        <p>别名: ' + data.aka.join(' / ') + '</p>'; }
            if (!isEmpty(data.directors)) { html += '        <p>导演: ' + combineFiled(data.directors,'name') + '</p>'; }
            // if (!isEmpty(data.attrs.writer)) { html += '        <p>编剧: ' + data.attrs.writer.join(' / ') + '</p>'; }
            if (!isEmpty(data.actors)) { html += '        <p>主演: ' + combineFiled(data.actors,'name') + ' </p>'; }
            if (!isEmpty(data.genres)) { html += '        <p>类型: ' + data.genres.join(' / ') + '</p>'; }
            if (!isEmpty(data.countries)) { html += '        <p>制片国家/地区: ' + data.countries.join(' / ') + '</p>'; }
            if (!isEmpty(data.languages)) { html += '        <p>语言: ' + data.languages.join(' / ') + '</p>'; }
            if (!isEmpty(data.intro)) { html += '        <p>简介: ' + data.intro + '</p>'; }
            html += '    </div>';
            html += '</div>';

            overlib(html);
            let link = data.url;
            $(aTag).attr('href',link).attr('target','_blank');
        }
        (async () => {
            let data = await getDoubanData(imdbId);
            // debugger
            if(false !== data) showDouBanInfo(data,aTag);
        })();
        overlibed = 1;
    },100);
    $(this).on('mouseleave',function(){
        if(0 === overlibed){
            clearTimeout(timer);
        }
    });
});

$('body').on('mouseenter', 'a[data-starId]', function() {
    let timer =0, overlibed = 0;
    let starId = $(this).attr('data-starId');
    timer = setTimeout(function(){
        let data = checkMovieStared(starId, undefined);
        if (undefined !== data) {
            let date = new Date(data);
            overlib('<span>已于'+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'收藏了此影片,点击取消收藏</span>');
            overlibed=1;
            return;
        }
        overlib('<span>点击收藏此影片</span>');
        overlibed =1;
    },300);
    $(this).on('mouseleave',function(){
        if(overlibed){
            nd();
        }else{
            clearTimeout(timer);
        }
    });
});

$('body').on('click', 'a[data-starId]', function() {
    let starId = $(this).attr('data-starId');
    let stared = $(this).attr('data-stared');

    if ('1' === stared) {
        unStarMovie(starId);
        $(this).attr('data-stared','0');
        $(this).find('img').attr('src',emptyStar).css({'height':'18px'});;
        overlib('<span>已取消收藏</span>');
        setTimeout(nd,800);
    }else{
        let date = new Date();
        starMovie(starId,+(date));
        $(this).attr('data-stared','1');
        $(this).find('img').attr('src',solidStar).css({'height':'18px'});
        overlib('<span>已于'+date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'收藏了此影片,点击取消收藏</span>');
        setTimeout(nd,800);
    }
});

$('body').on('click','tr.stared-list-switch',function(){
    $(this).siblings().toggle();
});
$(document).on('ready AutoPagerize_DOMNodeInserted lista ', function(e) {
    $('a[href^="/torrents.php?imdb="]').each(function(i,e){
        let ee = $(e);
        if(ee.attr('doubaned') ==='doubaned') return;
        let imdbId = $(this).attr('href').split("=").pop();
        let started = checkMovieStared(imdbId, undefined);
        if (undefined === started) {
            ee.after('<a data-starId="'+imdbId+'" style="margin-left:5px;" data-stared="0"><img src="'+emptyStar+'" style="height:18px;"></img></a>')
        }else{
            ee.after('<a data-starId="'+imdbId+'" style="margin-left:5px;" data-stared="1"><img src="'+solidStar+'" style="height:18px;"></img></a>')
        }
        ee.after('<a data-imdbId="'+imdbId+'" style="margin-left:5px;"><img src="https://img3.doubanio.com/favicon.ico" style="height:18px;"></img></a>');
        ee.attr('doubaned','doubaned');
    });
    $('a[href^="/torrents.php?search="]').each(function(i,e){
        let ee = $(e);
        if(ee.attr('doubaned') ==='doubaned') return;
        let imdbId = $(this).attr('href').split("=").pop();
        console.log(imdbId);
        let started = checkMovieStared(imdbId, undefined);
        if (undefined === started) {
            ee.after('<a data-starId="'+imdbId+'" style="margin-left:5px;" data-stared="0"><img src="'+emptyStar+'" style="height:18px;"></img></a>')
        }else{
            ee.after('<a data-starId="'+imdbId+'" style="margin-left:5px;" data-stared="1"><img src="'+solidStar+'" style="height:18px;"></img></a>')
        }
        ee.after('<a data-imdbId="'+imdbId+'" style="margin-left:5px;"><img src="https://img3.doubanio.com/favicon.ico" style="height:18px;"></img></a>');
        ee.attr('doubaned','doubaned');
    });
    $('.lista span:contains("IMDB:")[hightlighted!=1]').each(function() {
        let txt = $(this).text();
        let rate = txt.match(/MDB: ([\d.]+)\/\d+/);
        if (undefined !== rate[1] && 6.0 <= parseFloat(rate[1])) {
            $(this).html($(this).text().replace(rate[1], '<span style="color: rgb(183, 0, 0); font-size: large;">' + rate[1] + '</span>')).attr('hightlighted', 1);
        }
    });
    let thisYear = (new Date()).getFullYear();
    let years = [thisYear - 2, thisYear - 1, thisYear];
    for (let i in years) {
        $('a[href^="/torrent/"]:contains("' + years[i] + '")[hightlighted!=1]').each(function() {
            $(this).html($(this).text().replace(years[i], '<span style="font-size: large; font-weight: bold; color: #CE00B9; ">' + years[i] + '</span>')).attr('hightlighted', 1);
        });
    }
    (function(){
        document.querySelectorAll('a[onmouseover]').forEach(function (a) {
            let overFn = a.getAttribute('onmouseover');
            let timer = 0;
            let overlibed = 0;
            if(overFn.indexOf('overlib') !== -1){
                a.onmouseover = null;
                a.onmouseover = function () {
                    timer = setTimeout(function () {
                        let html = /^return\s+overlib\('(.*)'\)$/.exec(overFn);
                        if(html.length > 1) {
                            overlib(html[1].replace('\\\'','\'').replace("\\'","'"));
                            overlibed = 1;
                        }
                    }, 500);
                }
                let outFn = a.getAttribute('onmouseout');
                a.onmouseout = null;
                a.onmouseout = function(){
                    if(overlibed){
                        nd();
                    }else{
                        clearTimeout(timer);
                    }
                }
            }
        });
    })();
});
$(document).bind("ready", function() {});

$(document).ready(function() {
    if(GM_getValue('switchListA',0) === 1){
        let reg = /<a\s+href="\/torrents.php\?imdb=(\w+)">|https:\/\/www.imdb.com\/title\/(\w+)/;
        $('td.lista[valign="top"] > a').each(function(){
            let that = $(this);
            (async () => {
                let link = GM_getValue('rec_'+$(this).attr('href'),undefined);
                if(undefined === link){
                    let html = await asyncGM_xmlhttpRequest(location.protocol + '//'+ location.host + $(this).attr('href'));
                    let matches = reg.exec(html.responseText);
                    let imdbId=matches[1]||matches[2];
                    link = `<a style="height: 15px; display: inline-block;width:1px;" href="/torrents.php?imdb=${imdbId}"></a>`;
                    GM_setValue('rec_'+$(this).attr('href'),link);
                }
                that.before(link);
                $(document).trigger("lista");
            })();
        });
    }
    (async()=>{
        let list=listTpl='',sortedMovies=[];
        for( let movieId in staredMovies){
            sortedMovies.push([movieId,staredMovies[movieId]]);
        }
        sortedMovies.sort(function(a,b){return b[1] - a[1];});
        for( let index in sortedMovies){
            let data = await getDoubanData(sortedMovies[index][0]);
            listTpl = `<tr class="lista2">
<td align="center" class="lista">
<a onmouseover="return overlib('<img src=\\'${data.pic.normal}\\' border=0>')" onmouseout="return nd();" href="/torrents.php?imdb=${sortedMovies[index][0]}" title="${data.title}.${!isEmpty(data.year)?data.year:''}">${data.original_title}[${data.title}]</a>
<br>
<span style="color:DarkSlateGray">${ !isEmpty(data.genres)?data.genres.join(','):''}  豆瓣评分: ${data.rating.value}/${data.rating.count}</span>
</td>
<td align="center" width="150px" class="lista">${new Date(sortedMovies[index][1]).format("yyyy-MM-dd hh:mm:ss")}</td>
</td>
</tr>
`
            list +=listTpl;
        }
        let table = `<table width="100%" class="lista2t" style="margin-bottom:15px;">
<tr class="stared-list-switch">
<td align="center" class="header6 header header40"><a class="anal tdlinkfull3">电影名(点击隐藏/显示列表)</a></td>
</td>
<td align="center" class="header6 header header40"><a class="anal tdlinkfull3">收藏时间</a></td>
</tr>
${list}
</table>`;
        if(sortedMovies.length > 0){
            $('table.lista2t').prev().before(table);
        }
        $(document).trigger("ready");
    })();
});
