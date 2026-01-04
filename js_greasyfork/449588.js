// ==UserScript==
// @name         咚咚
// @namespace    chensuiyi
// @version      1.0.4
// @description  咚咚 - 敲开网络世界的超级门！
// @author       https://yicode.tech
// @match        http://*/*
// @match        https://*/*
// @license      GPL-3.0
// @run-at       document-idle
// @noframes
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_log
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_info
// @require https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.slim.min.js
// @require https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js
// @require https://cdn.jsdelivr.net/npm/pouchdb@7.3.0/dist/pouchdb.min.js
// @downloadURL https://update.greasyfork.org/scripts/449588/%E5%92%9A%E5%92%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/449588/%E5%92%9A%E5%92%9A.meta.js
// ==/UserScript==

(function () {
    try {
        GM_addStyle(`.img-navigation{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAF9UExURUdwTP///4Kq+qjxmUJCQqDwkDMzM0lJSVBQUENDQ8n2v2ZmZoKCgtLS0qbJn/3//Xqe5o3PgFlkVo3FgY7Hgm1/aYvMfjg6O2J6qlJhVpDUgjs+P1Jcbm+cZ2uUY0xXTmN7rF1rgT5CQYfFe2qGvkRJSmiMYNDQ0LDzo15ym4O9d2l5lkJIQ3KhaUNKR3OjapbfiJrmi3KS0nJ2cWB+Wk1UV4G6dp/tj1xsiklTTDc5OFhuU1BgTXGCpHyyclhpVF9zmY/TgnGeaHmMskFHQ7m5uUdMRnCdZ22KxX6l8YK8dm2NZm5zbVhfZHmsbpTchpq6+3Oda0ZMUlFhTvD0+8na/UpNTklTRzo7Ojc4N1VnUs7OzmZyiZHWg6G88eLi4mNoYtbj/avG/JPZhWN8rVVkgGpvaW+bZoqw+ba2tl11W1NkUPT19nOialhkcUFHRmdsZWd/st7p/m6aZltoga2trbKyspq7+2R9rkdNUnic4oyx+sDU/PLy8rjP/ETLdh0AAAAKdFJOUwD////p//+sneeBW/RKAAABJElEQVQ4y73TRXPDQAwF4KxsKcZAmZmZuU2ZmZmZmdvfXnemTqbetY95Fx/et9ZF8vniFL9KXFR/rCfdZM4ETZ3sXjGYJqEzkmYof0Au1VCUgGxPYJIQSPYMCjqruuqy308UsH/tTH8XNda6gYOTBZocYlQvBFsPF3R8trg0O9CJPOgbWafb58u9fQCY6uFAS4R2n77uvz8ATiHU0cqB8PAG+3yxHr9eA3Q3IT9ifG3Hqt8fbw4BmisEAKdXt+Hu7fwIoKEKRQDnljfpan4MoLJEDHBiJUyj1pziQheAONhr9UW56Ara2yyQn+MOsKYcQpkpHgAL8tLS0Qtgala2N0DK4IBqijcqSbWXXhfvZEJ08ckI8P9ITKbYYSgyfziyEq+z/QH70imfoGc4dgAAAABJRU5ErkJggg==")}.img-todo{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAEvUExURUdwTP///////zIyMlBQUP///3h4eEJCQkNDQ0lJSTk5OZNrYzU1NW5ZVTMzM01KSUNBQIeHhzw8POzs7Dw8PJmZmT8/P////2RTUE1NTVxcXP3/+5ubm8TwizMzM/////+VgMnxld32vUtTQqzRfIKCgtLS0mZmZldiSbbJneKHdf7//f+ikN2Fc5SxboqkaK7Tfm59Wrt0ZuGHddHR0Zu7coqKiYKaY0FDPkJEQHSIW//k33Z3dNDQ0P+jkVlhT/+5q1tQS42Njf+lk3B+XVFaRb6+vkRGQpi3cP/Kv//y74afZbnhhJy8c2JkYFJUTnt8eOTNyFljTKNuZFlgT5izdaHCdoSdZG6AV4WUZm5xanReV0hEQVlUTL+/v5GRkaampv+9sLCPiVRHQ2RvVpk4ns8AAAAddFJOUwAvbS6dgL/p56yd/Iz9FOH4tnuG/Kq1f/n044KqranbgwAAAQdJREFUOMtjYKAS4OSQQwMcnMjycupq8qhAW01dDiHPoiqvpCiLChSVVFngCthtlWQxgSY7wgZ5RSwKFBF2yGnLYgNICuSpokBFGRYEyio0sgITsBFSwIpfga+3KHZfQPzg4+ruLyKGxwQXJy9nHQkhnAo8/OQVFBSM+XEqsHdzACrQksOlwNzGGiivwM2FQ4GBhYkd2ABmFAUaID/og1iGZp4gA3h5GDAV6AEZppaBIHkjAT4c3rQKSAQpcBTEFZJBCTpA+eAQRFBzqKGkyZQ4oLxuTCgTItuoo6Tq8HigfHKEEiNSxlHVRDIjLCopOjZSSRw5a7Gww/McG6uwpJSMNBMjtbI1AEl5VUW4a+GSAAAAAElFTkSuQmCC")}.img-online-tool{background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAHpUExURUdwTDc3N29vb0JCQkxMTG1tbWVlZWZmZkFBQXV1dU9PT2NjY0FBQTQ0NDc3N1NTUz4+Pk5OTjIyMj8/PzIyMkVFRW9vb15eXj09PTQ0NFVVVV5eXk5OTjExMVpeZWFlb1BSVGJjZYyRm5OTk2Vna29vb1FRUW9vb4qKikZGRmBgYExMTD4+Pk9PT319fT09PYKq+jMzM/+/gP///zQ0NP/fv2J5qXCPzX6l8X+l8mV+sWN0l2+OynKR0WN8rf/ly6ioqHBzd1pbXldZXIWFhdba4Z69+8DU/IB2bFRUVWZWRtvBpsnDvZl5Wv/37nyLrIOh3oaj3oOQrHyY0XSBnHiHpXyMrmdteYOd05K1+3+f3nyKpn2c2Zu7+5Cv7abD+4KRsYat+p6z3KnE97S+1I2TnaKpuaG/+8TS76y40kVGScfT67jP/KOjo5C0+7jO/LPL/LzAx7Ozs8zd/ZS2+93d3bq6ullVUcPW/aPB+8rR3qamp4et+qrF/KzG/MvR3I+z+5W3++Li4rCwsNXi/VxWUNbW1nl5ecmabIV4a3RqYUlLT9umclZSToB0Z0hLUoCAgJN1V9OhcERGS/a5fVRVWEQ/OaaCXs+ebp99XO6zepJ0V8nJydvb2+mweIxwVfXWuLCJYkE9OCn0ChYAAAAwdFJOUwAXgeD5y8Rx72uOz80xDpolzIBmPYyR2HH+wzmkGv3+8vz7+vLu7f776fLy+Pf7/GsHZ60AAAGiSURBVDjLY2CgLuDlYmbm4sUpzcdv4uDq6mDCz4ddXlhTI9vNwMAtQ9lQGIu0iKBWYYEBGKSnqAqKoEnLyujkFucZwEB8mpqMLLK8BIdeVa0BMkhWkpRAyIvqllXUGKCBJBVRmLyQdmkdRNDS1s7O1hKqIk5BCKqApygfImRl6Ozi4jzZCqoigQeqwNC4BCxg7TTHz97U3sfJGqIg0hCuAMy3cTQ2NQIBU0cbiApUBRaGcxcsnGdkNGv6FO9+CywKzKf6+Roumj1zmqGvkac5FgVmE+yN5hsCwUQjIw8zLArsXIAumGFoOAnoik47LApsne2BUoaGIGeW22JRYGnoA1PQkWWJRYGBlRPQDi8voIJWK1RvcjQ1QgLK0Rtkfk8XNKCiOKAKpBzcISI2hp4efb3d0GAyiJaCKmDXb4OqsDA3MzO3gMpHGLLDopPdpLmlAT26w0zYEQlCWry9vhJFOiZcXBolzYlJVucgyYeaiKEnWgFu9cxEqHSwPLcAlnTNZJIaC5YPMWHCnjEY2RSDAgP85dgYceYtTlYWFlZOKudnACyYgb8hJcMXAAAAAElFTkSuQmCC")}.yigithub-user-script-js{position:fixed;right:0;top:0;bottom:0;left:0;background-color:#fff;z-index:999999999999999 !important;visibility:visible !important;transition:all .2s;display:flex;justify-content:center;align-items:center}.yigithub-user-script-js div,.yigithub-user-script-js span,.yigithub-user-script-js applet,.yigithub-user-script-js object,.yigithub-user-script-js iframe,.yigithub-user-script-js h1,.yigithub-user-script-js h2,.yigithub-user-script-js h3,.yigithub-user-script-js h4,.yigithub-user-script-js h5,.yigithub-user-script-js h6,.yigithub-user-script-js p,.yigithub-user-script-js blockquote,.yigithub-user-script-js pre,.yigithub-user-script-js a,.yigithub-user-script-js abbr,.yigithub-user-script-js acronym,.yigithub-user-script-js address,.yigithub-user-script-js big,.yigithub-user-script-js cite,.yigithub-user-script-js code,.yigithub-user-script-js del,.yigithub-user-script-js dfn,.yigithub-user-script-js em,.yigithub-user-script-js img,.yigithub-user-script-js ins,.yigithub-user-script-js kbd,.yigithub-user-script-js q,.yigithub-user-script-js s,.yigithub-user-script-js samp,.yigithub-user-script-js small,.yigithub-user-script-js strike,.yigithub-user-script-js strong,.yigithub-user-script-js sub,.yigithub-user-script-js sup,.yigithub-user-script-js tt,.yigithub-user-script-js var,.yigithub-user-script-js b,.yigithub-user-script-js u,.yigithub-user-script-js i,.yigithub-user-script-js center,.yigithub-user-script-js dl,.yigithub-user-script-js dt,.yigithub-user-script-js dd,.yigithub-user-script-js ol,.yigithub-user-script-js ul,.yigithub-user-script-js li,.yigithub-user-script-js fieldset,.yigithub-user-script-js form,.yigithub-user-script-js label,.yigithub-user-script-js legend,.yigithub-user-script-js table,.yigithub-user-script-js caption,.yigithub-user-script-js tbody,.yigithub-user-script-js tfoot,.yigithub-user-script-js thead,.yigithub-user-script-js tr,.yigithub-user-script-js th,.yigithub-user-script-js td,.yigithub-user-script-js article,.yigithub-user-script-js aside,.yigithub-user-script-js canvas,.yigithub-user-script-js details,.yigithub-user-script-js embed,.yigithub-user-script-js figure,.yigithub-user-script-js figcaption,.yigithub-user-script-js footer,.yigithub-user-script-js header,.yigithub-user-script-js hgroup,.yigithub-user-script-js menu,.yigithub-user-script-js nav,.yigithub-user-script-js output,.yigithub-user-script-js ruby,.yigithub-user-script-js section,.yigithub-user-script-js summary,.yigithub-user-script-js time,.yigithub-user-script-js mark,.yigithub-user-script-js audio,.yigithub-user-script-js video,.yigithub-user-script-js textarea,.yigithub-user-script-js input,.yigithub-user-script-js select{margin:0;padding:0;border:0;outline:0;box-sizing:border-box}.yigithub-user-script-js a{text-decoration:none;color:inherit}.yigithub-user-script-js .icon{width:1em;height:1em;vertical-align:-0.15em;fill:currentColor;overflow:hidden}.yigithub-user-script-js .layout-app{position:absolute;left:0;top:0;right:0;bottom:0}.yigithub-user-script-js .layout-app .layout-top{position:absolute;top:0;left:0;right:0;height:50px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;background-color:#23263a}.yigithub-user-script-js .layout-app .layout-top .left{display:flex}.yigithub-user-script-js .layout-app .layout-top .left .logo{width:50px;height:50px;padding:8px}.yigithub-user-script-js .layout-app .layout-top .left .logo .logo-inner{width:100%;height:100%;background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAHdUExURUdwTEa1/0i1/0m2/0i1/0i1/0i1/0iz/0e1/068/0i0/0i0/0i1/02r/0i3/0W1/0m1/1Cj/0e1/0yr/0m1/0i1/0i2/0i2/0yx/0uw/0e1/0+k/0ux/0i1/0mz/0qy/0+m/1Cp/0+m/0+n/0i2/0yv/0i1/0yv/02s/1Co/1Cg/+n2/0i1/////02v/1Ch/06s/0+q/06t/0+r/0yw/1Cn/0ux/02u/1Cp/1Cl/1Ck/1Ci/0m0/0qz//7+/0mz//L6/0qy/0uy//7//8/o/+v1/1Cm//z9//n8//j8//z+//D5/8rm/+33//b7/06u/06o/3a8/6rU/+74/0+l//T7/8Ph/3a2/4O9/7LX/63V/9/w/77e/4TD/1it/6LS/+Py/4vG/+Pz/+Dx/8bj/+z3/7/g/9js/7zd/87o/7HY//r9/+j1/12n/7zf/5LF/1qm/7LZ/8Pj/67Y/4vC/2u2/3S6/2Kq/7ja/7jd/9nt/9Pp/+fz/93v/12x/02r/02p/02q/4e//3i3/2W2/2qv/6bQ/0i0/1el/5nK/47C/3y5/5bJ/2m1/5fM/6bT/2+x/3q8/5zP/+Tz/+Px/4/E/1aj/1Sq/5LK/1Kh/1Sr/2Gx/26x/7TY/0qx/28GjN8AAAApdFJOUwA3qSqK3fyAaxd1Y5z2LjCo/nDQs9nsxvTmofzPju2t8/378OXD4vLnP2MAJwAABk1JREFUeNrFmwdDFEcUx0eK0kHs3fTMzA1XgDt0jwicGjiOGkCiAQQBuRy20MSCkMTEGDW9l8+au93Da7v7ZuYd5P8F/r+dV2Z2dx4h+SptPHX84JFDhz1SCncGmwAN+PxtlNI3at9/p6qUuKu0uuZdj7wudLUA5iGfn2bryXs11c4Qe0o8Ku5BVXdTbQFPyR5b+8qyvfLuYfDZm+zcLYX2llUW+leUy9u3g3EPOLqndLmzvCLff5+8fSf88G2u9gbzhjz7NP3DXZB7qNnNnbYaLKWtXAJZ/6+x9vQ8S2swm6BC0h9tf87LWIbgdR5Ulhcp9oD9ZYNl60n5di2USZU9MvXy7RkzOsvS/Uem/pGFlxX8jEb2Wh1Jov+1NyFXv9VgNtoqSfnXwbkPP34bEH2vnT8zPHUyJYB+fLvlt7SZKoQGbO1Bj2+//NYSNCQB3nbvfHDyU63lt1RLSD1y+f26y28VQj1pdO094GlHf/lNeavIKVTxD8XjQ27+XgboADmO8PfFRVJxhD97ixzUT79m01+ImL4/e5Mc0fb3p/2FmNX2Z/vJIYe9p0neX4gxXX9mkMO6/jGRpQVNf+Yluv63RY7u6fkzRjT9P831F5FhPX9bgDDsPyXyFf1Ry98OQCL/J0ShotM6/nYAcP2/FHaK/rANYDAMANj/micTtgCif0Nm/4EA4P5LLwkHPbL2X4YBAPe/AH0sHPVQMQEKAcD9P0QfChfNqyVAAYBEAc67+Yvo1HmGAYAT8FXEFUD0fIEBgM+fK6MC0OItfQCwA4fargtQD/UBWtR2QCf9owsAd4DvZPxF4rkeAByA1W4pANG7pgUAB+CxnL9IDOsAdBUpAKlmwL9VB4Bb0J8dsgARPvuHMgDcgmJCWpx/owoAZuDAdEQeYI7P/K0IAGfgI3l/8RHn99UAwE0wsC7UAPiyEgC4ABv9qgDxXxUA4AWIqfgnc4BL5yGRWoChD5UAUv78wZo0ALwAN5X8IyYA/0oaAFyAaSX/ZCc0tfi9JADYAwI/awHwjyUBwCY4peYvEmkAqS2BwLtA6LoiQD9XWAICb4NfRhUBercBrt2VAQBT8J6iv9mHLH0uAQDXoGoEIq/9ZWJAgkWPQCIDIBED0lT0CIxmACRiAAL4VCOQyUGpGIAAG1H9HEzG4Bka4IWqf5Rn6woWwDePSQHO72AB/NcwEeD8KhaA9ir69+T481kkQID2I2ogqYtIAB9NYFIweS5CAvhpBJOCnP+EBKA0iklBzmdwAAFKezApyPlNHICPqlVBtC8fIIYD8FOq8komOvL9+Sc4gDZKH+htxNK7EQFykMYQGSjzcuAKMJAEWNIvwZR+QQGk/kv/hQkA57dQAOa9gEuyR0GbAMA56A5g/hlf19sELD3HAZi/xlf1E4DztSIA0D6lt6EcLTAcgPULaEynBVtaxgGELIBVeD/qtvcfYziAgfRfuHn1DmxpHAkQSAP81qvcAE1JfaqTAaCuHwi65xz84SM5BJC5oHNNNf2lDsQKAENOJ8NEh6P/xVtFBKDD9ucPZ3vJALgDZF8Rm7Vp/qNzLv53WHEBCn7YRvv7XOwlE0AFIGdXTIz2clctsOIDTC6mrD+IJno65jigO2wHAOjK76BxWiq/byWrwNLLz2Tsx56ynQKgk0uw/9VnbOcAki1p3d3+/hXGigYQsL0iNjHmsvrjjO04AKXTCzN27jMLy4wVFWDA8aLg5MTSg7yX0KvjdxkrMkDI9bbmysSr4dvxGzfiC8Mvxp8yXUmcCV3FsJI4Fe8ogBd+MXGXgQQwyFHElW3Va1u2VzqPIS5NK9/bKtQJclKjEWTfHEQCnCVntOvQkhcHcIA0IusQl4XeKlIaxJXBORTASCkhp3FlgMvCWkJITQsqC1FJYNQkAao7cVmISYLB6tSQowfXjBGtyPCYw48l7agkQGThZkl60CmI6YWt2klgpAedSFn4f0kCb0vZ62G3dkwS6MYgM+xGKpxv8zbvWCFmjfulBh67EJ3A0PPPG7ns3N0YbBUOnbbvYgyMQL5/auw3HNytGBj/Fo79moPP7ZoxUNuQjE3bwWdr9NtmrtRX3BgYg06j3+bwY0XD6aBGL5LdD7wjtQ0VdcAEfn3VmZPHjqqdSuCTodfYf+Lsgar6Arv/ADvJ6W7UKxiaAAAAAElFTkSuQmCC")}.yigithub-user-script-js .layout-app .layout-top .left .title{padding:4px;display:flex}.yigithub-user-script-js .layout-app .layout-top .left .title .main-name{height:100%}.yigithub-user-script-js .layout-app .layout-top .left .title .sub-name{display:flex;align-items:flex-end;font-size:12px;padding-bottom:2px;padding-left:6px;color:#cfcfcf;text-shadow:1px 1px 1px #000}.yigithub-user-script-js .layout-app .layout-menu{position:absolute;left:0;top:50px;bottom:30px;width:180px;border-right:1px solid #eee;background-color:#f9f9f9}.yigithub-user-script-js .layout-app .layout-menu .category{padding:10px}.yigithub-user-script-js .layout-app .layout-menu .category .line{height:38px;display:flex;align-items:center;padding:0 10px;border-radius:6px;cursor:pointer;transition:all .2s;margin-bottom:6px}.yigithub-user-script-js .layout-app .layout-menu .category .line.active,.yigithub-user-script-js .layout-app .layout-menu .category .line:hover{background-color:#e7e7e7}.yigithub-user-script-js .layout-app .layout-menu .category .line .img{flex:0 0 auto;margin-right:4px;margin-top:2px}.yigithub-user-script-js .layout-app .layout-menu .category .line .img .inner{width:20px;height:20px;background-repeat:no-repeat;background-position:center center;background-size:contain}.yigithub-user-script-js .layout-app .layout-menu .category .line .text{flex:1 1 100%}.yigithub-user-script-js .layout-app .layout-category{position:absolute;top:60px;left:190px;bottom:40px;width:180px;border:1px solid #ddd;background-color:#f7faff;border-radius:6px}.yigithub-user-script-js .layout-app .layout-category .line{display:flex;align-items:center;height:40px;padding:0px 10px;cursor:pointer;transition:all .2s;border-bottom:1px solid #eee}.yigithub-user-script-js .layout-app .layout-category .line::after{content:"";display:inline-block;width:0;height:0;position:absolute;right:-40px;border-width:20px;border-style:solid;border-color:rgba(0,0,0,0);transition:all .2s}.yigithub-user-script-js .layout-app .layout-category .line.active,.yigithub-user-script-js .layout-app .layout-category .line:hover{background-color:#d4deef}.yigithub-user-script-js .layout-app .layout-category .line.active::after,.yigithub-user-script-js .layout-app .layout-category .line:hover::after{border-color:rgba(0,0,0,0) rgba(0,0,0,0) rgba(0,0,0,0) #d4deef}.yigithub-user-script-js .layout-app .layout-category .line .dot{width:20px;height:14px;background-color:#abd5f3;margin-right:6px;border-radius:4px}.yigithub-user-script-js .layout-app .layout-category .line .text{font-size:14px}.yigithub-user-script-js .layout-app .layout-side{position:absolute;top:50px;right:0;bottom:30px;width:200px;border-left:1px solid #eee;background-color:#fcfff2}.yigithub-user-script-js .layout-app .layout-side .title{padding:10px;text-align:center;border-bottom:1px solid #f3f3f3;color:#e33;font-size:15px}.yigithub-user-script-js .layout-app .layout-side .line{height:40px;display:flex;align-items:center;padding:0 10px;cursor:pointer;color:#08f}.yigithub-user-script-js .layout-app .layout-side .line:hover{background-color:#f5f5f5}.yigithub-user-script-js .layout-app .layout-side .line .icon{height:12px;width:12px;background-repeat:no-repeat;background-position:center center;background-size:cover;margin-top:3px;margin-right:4px}.yigithub-user-script-js .layout-app .layout-side .line .text{font-size:14px}.yigithub-user-script-js .layout-app .layout-main{position:absolute;top:60px;right:210px;bottom:40px;left:385px}.yigithub-user-script-js .layout-app .layout-main .links{display:flex;flex-wrap:wrap;padding-left:20px;justify-content:space-between}.yigithub-user-script-js .layout-app .layout-main .links .link{display:flex;margin-bottom:10px;margin-right:15px;border:1px solid #eee}.yigithub-user-script-js .layout-app .layout-main .links .link .img{width:30px;height:100%;height:30px}.yigithub-user-script-js .layout-app .layout-main .links .link .img .inner{height:100%;background-color:#f5f5f5}.yigithub-user-script-js .layout-app .layout-main .links .link .name{background-color:#fff;border-left:1px solid #eee;height:30px;line-height:30px;padding:0 10px;font-size:14px}.yigithub-user-script-js .layout-app .layout-main .links .link:last-child{margin-right:auto}.yigithub-user-script-js .layout-app .layout-main .navs{position:absolute;bottom:0;left:50px;right:50px;display:flex;justify-content:center}.yigithub-user-script-js .layout-app .layout-main .navs .wrapper{background-color:#f9f9f9;display:flex;justify-content:center;border-radius:47px;padding:5px}.yigithub-user-script-js .layout-app .layout-main .navs .nav{padding:5px 8px}.yigithub-user-script-js .layout-app .layout-main .navs .nav .box{border:1px solid #ddd;width:100%;border-radius:20px;background-color:#fff;display:flex;justify-content:center;align-items:center;font-size:14px;padding:0 15px;height:40px;background-image:linear-gradient(161deg, #ffffff, #f5f4f4);box-shadow:inset 2px 3px 3px #fff,1px 1px 0px #b9aeae}.yigithub-user-script-js .layout-app .layout-foot{position:absolute;bottom:0;left:0;right:0;height:30px;border-top:1px solid #eee;background-color:#fff0f0}`);
        document.body.insertAdjacentHTML('beforeend', `<div class="yigithub-user-script-js" id="yigithub-user-script-js" v-if="isShow.dongdong === true">
    <div class="layout-app">
        <!-- 顶部 -->
        <div class="layout-top">
            <div class="left">
                <div class="logo">
                    <div class="logo-inner"></div>
                </div>
                <div class="title">
                    <img
                        class="main-name"
                        src="data:image/png;base64,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"
                    />
                    <div class="sub-name">咚咚，敲开网络世界的超级门！</div>
                </div>
            </div>
            <div class="right"></div>
        </div>

        <!-- 左侧菜单 -->
        <div class="layout-menu">
            <div class="category">
                <div class="line active">
                    <div class="img">
                        <div class="inner img-navigation"></div>
                    </div>
                    <div class="text">网站导航</div>
                </div>
                <div class="line">
                    <div class="img">
                        <div class="inner img-todo"></div>
                    </div>
                    <div class="text">待办事项</div>
                </div>
                <div class="line">
                    <div class="img">
                        <div class="inner img-online-tool"></div>
                    </div>
                    <div class="text">在线工具</div>
                </div>
            </div>
        </div>

        <!-- 左侧分类区域 -->
        <div class="layout-category">
            <div class="line active">
                <div class="dot" :style="{ backgroundColor: getRandomLightColor() }"></div>
                <div class="text">我的导航</div>
            </div>
            <div class="line">
                <div class="dot" :style="{ backgroundColor: getRandomLightColor() }"></div>
                <div class="text">编程社区</div>
            </div>
            <div class="line">
                <div class="dot" :style="{ backgroundColor: getRandomLightColor() }"></div>
                <div class="text">图片素材</div>
            </div>
            <div class="line">
                <div class="dot" :style="{ backgroundColor: getRandomLightColor() }"></div>
                <div class="text">在线教程</div>
            </div>
        </div>

        <!-- 主要区域 -->
        <div class="layout-main">
            <div class="links">
                <div class="link">
                    <div class="img">
                        <div class="inner"></div>
                    </div>
                    <div class="name">开源中国</div>
                </div>
                <div class="link">
                    <div class="img">
                        <div class="inner"></div>
                    </div>
                    <div class="name">稀土掘金</div>
                </div>
                <div class="link">
                    <div class="img">
                        <div class="inner"></div>
                    </div>
                    <div class="name">知乎</div>
                </div>
                <div class="link">
                    <div class="img">
                        <div class="inner"></div>
                    </div>
                    <div class="name">iconfont</div>
                </div>
                <div class="link">
                    <div class="img">
                        <div class="inner"></div>
                    </div>
                    <div class="name">博客园</div>
                </div>
                <div class="link">
                    <div class="img">
                        <div class="inner"></div>
                    </div>
                    <div class="name">开源中国</div>
                </div>
                <div class="link">
                    <div class="img">
                        <div class="inner"></div>
                    </div>
                    <div class="name">开源中国</div>
                </div>
                <div class="link">
                    <div class="img">
                        <div class="inner"></div>
                    </div>
                    <div class="name">开源中国</div>
                </div>
                <div class="link">
                    <div class="img">
                        <div class="inner"></div>
                    </div>
                    <div class="name">开源中国</div>
                </div>
                <div class="link">
                    <div class="img">
                        <div class="inner"></div>
                    </div>
                    <div class="name">开源中国</div>
                </div>
                <div class="link">
                    <div class="img">
                        <div class="inner"></div>
                    </div>
                    <div class="name">开源中国</div>
                </div>
                <div class="link">
                    <div class="img">
                        <div class="inner"></div>
                    </div>
                    <div class="name">开源中国</div>
                </div>
                <div class="link">
                    <div class="img">
                        <div class="inner"></div>
                    </div>
                    <div class="name">开源中国</div>
                </div>
                <div class="link">
                    <div class="img">
                        <div class="inner"></div>
                    </div>
                    <div class="name">开源中国</div>
                </div>
            </div>

            <div class="navs">
                <div class="wrapper">
                    <div class="nav">
                        <div class="box">常用</div>
                    </div>
                    <div class="nav">
                        <div class="box">工作</div>
                    </div>
                    <div class="nav">
                        <div class="box">家庭</div>
                    </div>
                    <div class="nav">
                        <div class="box">游戏</div>
                    </div>
                    <div class="nav">
                        <div class="box">娱乐</div>
                    </div>
                    <div class="nav">
                        <div class="box">写作</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="layout-side">
            <div class="title">根据当前网站推荐</div>
            <div class="line" @click="openInVscodeDev">
                <div class="icon" style="background-image: url('https://s2.loli.net/2022/08/15/n6cEtyo8ZD24spV.png')"></div>
                <div class="text">在线编辑器</div>
            </div>
            <a class="line" href="https://www.tampermonkey.net/documentation.php" target="_blank">
                <div class="icon" style="background-image: url('https://s2.loli.net/2022/08/15/9JFPqAlDBzRXcy8.png')"></div>
                <div class="text">油猴文档</div>
            </a>
        </div>

        <!-- 底部状态 -->
        <div class="layout-foot"></div>
    </div>
</div>
`);
        !function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e||self).tinykeys={})}(this,function(e){var t=["Shift","Meta","Alt","Control"],n="object"==typeof navigator&&/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"Meta":"Control";function o(e,t){return"function"==typeof e.getModifierState&&e.getModifierState(t)}function i(e){return e.trim().split(" ").map(function(e){var t=e.split(/\b\+/),o=t.pop();return[t=t.map(function(e){return"$mod"===e?n:e}),o]})}function r(e,n){var r;void 0===n&&(n={});var f=null!=(r=n.timeout)?r:1e3,u=Object.keys(e).map(function(t){return[i(t),e[t]]}),a=new Map,d=null;return function(e){e instanceof KeyboardEvent&&(u.forEach(function(n){var i=n[0],r=n[1],f=a.get(i)||i;!function(e,n){return!(n[1].toUpperCase()!==e.key.toUpperCase()&&n[1]!==e.code||n[0].find(function(t){return!o(e,t)})||t.find(function(t){return!n[0].includes(t)&&n[1]!==t&&o(e,t)}))}(e,f[0])?o(e,e.key)||a.delete(i):f.length>1?a.set(i,f.slice(1)):(a.delete(i),r(e))}),d&&clearTimeout(d),d=setTimeout(a.clear.bind(a),f))}}e.createKeybindingsHandler=r,e.default=function(e,t,n){var o;void 0===n&&(n={});var i=null!=(o=n.event)?o:"keydown",f=r(t,n);return e.addEventListener(i,f),function(){e.removeEventListener(i,f)}},e.parseKeybinding=i});
        "use strict";

var _tinykeys = tinykeys,
    createKeybindingsHandler = _tinykeys.createKeybindingsHandler;
var db = new PouchDB('dongdong');

function getUUID() {
  var nanoid = function nanoid() {
    var t = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 21;
    return crypto.getRandomValues(new Uint8Array(t)).reduce(function (t, e) {
      return t += (e &= 63) < 36 ? e.toString(36) : e < 62 ? (e - 26).toString(36).toUpperCase() : e > 62 ? '-' : '_';
    }, '');
  };

  return nanoid();
} // vue界面和功能区域


var __vm = new Vue({
  el: '#yigithub-user-script-js',
  data: {
    username: 'chensuiyi',
    isShow: {
      dongdong: false
    }
  },
  mounted: function mounted() {
    this.initEvent();
    var todo = {
      _id: getUUID(),
      title: '123',
      completed: false
    }; // db.put(todo, function callback(err, result) {
    //     if (!err) {
    //         console.log('Successfully posted a todo!');
    //     }
    // });

    db.allDocs({
      include_docs: true,
      descending: true
    }, function (err, doc) {
      console.log('🚀 ~ file: index.js ~ line 32 ~ doc', doc);
    });
  },
  methods: {
    // 初始化监听
    initEvent: function initEvent() {
      var _this = this;

      this.$nextTick(function () {
        var that = _this;
        var handler = createKeybindingsHandler({
          'd d': function dD() {
            that.isShow.dongdong = !that.isShow.dongdong;

            if (that.isShow.dongdong === true) {
              $('body').css({
                overflow: 'hidden'
              });
            } else {
              $('body').css({
                overflow: 'auto'
              });
            }
          }
        });
        window.addEventListener('keydown', handler);
      });
    },
    // 在vscode.dev打开当前项目
    openInVscodeDev: function openInVscodeDev() {
      // https://vscode.dev/https://github.com/yicode-team/yiapi
      console.dir(window.location);
      GM_openInTab('https://vscode.dev/' + window.location.href, {
        active: true
      });
    },
    // 获取随机淡色
    getRandomLightColor: function getRandomLightColor() {
      var letters = 'ABCDE'.split('');
      var color = '#';

      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
      }

      return color;
    }
  }
});
    } catch (err) {
        GM_log(err);
    }
})();
