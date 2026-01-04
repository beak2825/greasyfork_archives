// ==UserScript==
// @name         WME Client Level Simulator
// @description  Shows how WME would look like for different levels of editor.
// @namespace    https://greasyfork.org/users/gad_m/wme_cls
// @version      1.8
// @author       gad_m
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAAJdnBBZwAAAEAAAABAAOrz+GAAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDEtMTlUMTk6MDM6MzUrMDA6MDCorThTAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTAxLTE5VDE5OjAzOjM1KzAwOjAw2fCA7wAAABF0RVh0anBlZzpjb2xvcnNwYWNlADIsdVWfAAAAIHRFWHRqcGVnOnNhbXBsaW5nLWZhY3RvcgAxeDEsMXgxLDF4MemV/HAAABbwSURBVHhexVsLdFTltf5mMplMJpm8EwKBhPBSBISAT+ShIlYBUVuvZVn7UKtVtBddale1d7XXqvWu29reWq3U1oqtLqktWBSrSLFXnj6aAPJQ3iREiJDHJJNM5pm5397nnGQymclDtPcLh3PmnP/8Z3/fv/f+938mscUIJEBOyGm7zaaf2wNBHGj24UibH8f9YbSEuuCPdiHYBUTYLgqbtrfJXu/44iAWxfhjo21p3Du4z7AD7jQ78p12jHCnozLHjfEFHmS7MvSeLrGN7Qw2vdFHAPkoJ4R8vdeHv9c1YU97GAF7OuwOB+z2NF60G52ZAv2/w7QZXV38F0VXJAJXVxiTstNxWXkhRuZ5DBHYRISIRy8B5FAahMIRrN5Xj83eEBxuD+xpaaZ6bCoPi5Ms7nBAzPjBBvOof1Q/Os88GhjxdJSb8Z/a1RWNIuL3YVaeE18+YySc6Y5ujha6BbAuNLX7sXzXMZx0ZCGdLhRjJ7Euko67abAYLOGBMBRBLJAYbHa6PQcvzBAuiXTg9imjUJjt7iWCCmCdaPR14H92HkNHVh4cdPOokB8i8c+LdCoMVQwRIo0iRBgeWR1e3D11FIo8Wd0i2BgbMaEYDIfxePVhnMrIRRqVi3LUh4IvmngihiqExak42Ip7Z4xBRnq6homNJ2O8hpW7j2BbIJ1x4lS1Bot/NfFEDEUI8epQOIQLXWEsmVzJxGiGQG1zK3669yScOXmc1yKDcvvPQnywxn5RfUs4gDNZqM2L+88qQUVBriHA8x8ewfaIS91kMJ4/FAOH6qqJ+LyfJd4uoVDlCOCbZ1fC5u3wxx7b+QlC7hyZNxgX/Y/+YAw6XdKp8Hk8WydI1jJOfxsemFoGW80np2K/r2uHM9PNIqL/2B/IgCERF3fkZjmcFXVy2oJOVUnC8XTtsEsu6PTj5vJs2FZ9VBd7p90GB7NiVz/+399DB01cCHOz0QC7Ix02B6tKjomNj2UNZ7QhlLjow2m4K8qcxH0yMT6rTXbGQYTF3tzsLtierDkUOxjL1JOp+J82eXNY7U4nCxMHogE/wi3NCDQ2INzahGh7O6LhgJK2cSAcWdlIzy2As3AYXAUlSMvkvC0lbigonbERi38Tn8U2yQMy2ONsnbA9vG1/rMmVoxkyGf/TIm/2meZ0yQd0Hq+F78BudNQeQrDpJAIdHQhzWopaoSeNaZy4aDqzdYbbTQGK4S4fh5wzJsE9spLX09AV7DQamh4xVBvlLpnpCgNtsH1/y8exoJvTXxIBTod8jKTUzVl/tx85iJbqzeg4uh8dbW0Ik29mlgvFhYUYXlKMwoJ8ZGVmSjCgs7MTTd5WNJxqxKeNjeigdzhosdvjQVb5GBSeMxfZY87ggieMGKdsCSfBUGxV2ShAht8L2z2b9sXgoQA0OF6A0yXvcGXqfHty0zq07a1BO0fb5nBi/JhKzD5nKs6ZPAkVZSOQzVFOhkAwgLrjDajZ8zE2flCNvQcPIxYKIIvtPROrMGzuFaxb8hEJ0I2HKIIKIPf4KMBdGz+OpecU0OiIdUmRqrOByIuQaVlutO3/CA1vvQI/4zzImK2aOBHXL7gc50+djHTGuQVJirqZn8UCrdHjEp6sSWp278XK19fhg1174Iyxri8qwfArrkP22DO44vMPKEJvuyUROxBua4btjo37Yi4qGWO2HSimBkWeI9RUvRUnN7yKDrpzbn4+br3+Wlw5dzYLLbuS7SIBcfdEovHoFoab5ARpJ8dvvrMJy1euRmuLF26GUen861A49VyEO+lhgxWB/UgyDrS1gHfwIbRhoPJ3IPLi9gb5Lfj0rdX6FumMCePw1I8ewKJL5spjNNkJkTQWIhapVJBr0kZWcnIsNYoIcOXFc/Dkj76P8ePGoN3fiYY3/4SmXf+Eg88WGwQD2irP1UfLW684txf0F0epoORdLrTt242T6znyoQhdfQp+/sB9GFk6TImnpZGMOUKfBSKGbNLXqOGl+PmD92LapInoCIbx6bq/MMEeUBti9K5U6MVNNaDIOvOoInQx2SdBv4qKizLbh1u9aFj/CtqZvCadOQH/uWypZnYZudMhngjpS0TwZGXh4bvvwrjK0fB30BPWrWYuaFfXFptS2WyMvvA03hqZL/eMFHTOg3/X/dBAATjVndryFvxNp1DIqe3B22+BO9Ol5GXU4hFDHTYueBEv9Nk280pvyP1CVlw/HoYIUeR6svHA7TchKzcHvobjaNyyAWlczie2j0cvjuRO6ww1Ugz+wKOfnoGOT2rR+tFOhJjtv3XNIsPtmbkTydf97EW8uGBTH6IGag1hfmZctZKf5T19RUjTZ4yrqMCNi6+A1Ije3R+g88QxFl4Zalsq2y0n0BBQ+inIDwQ1iknKt7sGfp8PZ44dgysunsVRNl5DxaP15dex8W3zQ394exPWvtyq5P6x7T2semM9GpnxJUwTRZCXtYJr5s/DeIZCR2sbWj58nyHJ2YY/qTDjgR4vsHeRvDSNPzlYyAvHaLsP7azwIuxk/kUX6hulrmjCw+t3Y9MKr/mBSNuBJ91voHpmPZa8+lXc+LdFmDrGvEZ4V+zCcytX4cHHn8DPnv0Dvvdfj8PXzmkuQQQZNwkRV0YGFsydBdaF6Dj8MYKtrRSHuYDMUuYCbsLd8K8UHlD9k8vMoySgIZL8go0n0NnSBA/j8NwpZ+klWVjFw7v1KCz6rdnVWFnaiWGFBazy9mH3/oM8m4tJTyyME6EWzeu3IS8nB6XFBThw5Bje3fGhXpH3+/GwvryZOX2qltT+lkaGQZ3apk1Tubd5WpNgwnh1Q86nmhlkJGyc2oJMfEEWPGXDSlDG2BforBKHtrpW82gEPs4Ls94PsNQNwsH7JZEpbLmYfGOFcUzkIZ+FVADBEGt+rpfzKbAg0RrLK0aUlGDM6ArawntO1Mso6PX+uElnFDB1QWKdTl0kcV3ta0WEVWRJUYGu4BLjVFB+39dww9ob6OqXYMEN/4ac7Cz9kuKW669B5aiReo+MpG1kHn3BwLDLr8Hw4iI+IYYbFi/AOVMm6fnExCqwvGLsqDLmjhiCLad0BhECYnr1Y309ecb963iNtYV8mH7fm3oyHjWPzVdhLO4iQi8heChFR8Tfxj1QQHcVJLqoBX3fQKOkklvx00fw/E9/QmKLlHz3ANR7YfhKLsbOnYpnH3tI2y392hJ91kAoLSpUUl2sB2RtY/Ur2T4VWAglN9i6J14EQY8I3HfFEGXJKz3kZJuu3A+s0cvl0rYgL7c3eVLf9UKtcXjp2ZhcFkM2F1VFjGtpIsQGQqZUgiJ0OEzbWHZLnas3mw0SINzpecmvSoa00COCUJW1g9GxvKWJBrkS409/AlhO0extwfot25jR2/Vz/LNbX96MnYflKA9Tl5TrNS2EOB1u37MXnzR8qu2ShZgFaasmUmghbyGeSzzkGclCSqEEpRPTSPncvfGziCAvJaJ+Tk/y1XSeEQLJYLnv86tfw3cfegyr1hlTbkQMFry7Ga+Z02TFDxdiykgZQKOK3PnRfnznPx7Go7/+rfYjz08Fb5uPbViAcVqUaVCHy7Q5GcSp+gkBST8iqNFCW3V3ZCwno51+hDt8yGDlNaygQK8ke5T1BI87C/nMFRvfq4afM4dD6ogtm/DCjw3Xr/jh1zD7AoO8ZdeaDf/QZa64t4RBMg+wnllHLxGr5f0GRAAKpt/7pYDMLnZrDZ0MopwoaCyX5QwfLgbQQAezeLCpAcG2dnhysnUatO5JhDVXz591AQo4nR2qr8cTz78E78tr8dKjUvrS7X9zA2adb5CTPqTUffGva7Hln9vh5Oyy6NI5ei2ZAOIpoVAIR+rqjXeJxaX0XorFx6o9SWwSkDw9IMVFC90dyINlHc91tyPboyPUuvNd/a5tLOvxYhY2vZNaD+ScjGrFyDJ8/eqFCDN0Dr6RgbUrJOcX4KI1l2PKKMNV5XX1viNH8MiTv8GKv6xBOz3lyrkX4ZILztP+E2PWmnX2H61F3fHjyMzyIKOs3JwF+k+cwt2RKqnY0jjyZkkrlGzypWlnB1p3VyMW8KOj9iDaDx9AlJ1cfelcbZdKAIEYLiIsWTwF4eWs7eWk7RDWFLyD//3Ru1oZiimnmptRe7wBrb52/Qb36svm4t6bv8nGYkvfvvUlCENpw7vvw8/kOmz8GXCXlvV6YZpYmVpQQeOzZS8wPnQakWMxPhzEsT8/h7pXXsCh117G8Q93wMcp8BvXXoU555/TnbT6g91ej01cDWqfVaNRM9MFHxPorn0H8ObGrVi3aSs+5LEoce7ks/DQsju43P22vkOkNRRXu+mGEJBFV31DA97e+h4y2c5z1jTYuBQXYWQwlJ9885IEyu/OmiMxV34Bpi19zTzdg5pffIlzCx+S4UbLnhrUvfQ7OHNyMaGiHIX5uZh34Xm4YNrUfke+B3VKXtPdJbNx4/3lKtrhY/XYd/gomrzGLFCYyyJodDmXuaOYJB3q4tJzsv4t0X/8q+VYv2kLCoaXofKmZZwFXJqnoF88GeSn37NO9/F499GLjNVgSuiTqbQtijR3Jtf+6ej0d+LCaZPxgztuxXlTz1YjBibPIucuk/ylPeTlvnEUc+Elc+hJi3VbyHA6c0ylJkElKKOYpH+ZQoX8mnVvY8O295HtdKJo1nw4KCCvMoS5E/K8NRn57U9fpfWBbenOozFXbj6q7ujrAdt/eSVHl0qy4rPxAcf/uhKN729BmPlg2Y1LcO2XLtPlqJjXn/vLuwBrnh8s8r61CIuut1YGPRBvk2fKFLr5g2r8+MlngFAQ+VXnYdR1NyIaClAw0xZTvKplbxif41CzfDGC3mZZDVKlVElC/tNqgc2iXRi+6CvIOXMynMziv/zjSjz351XyDCUvoyWb3mcaaZzz4ujGoZEXSB+yxfcrezkn5OVlySPLn0WMq8qsijEYftVXtDAT8uoxMiDcJ49+uSzDzySo0yD/1Ty90LzUg+miHK9JR/ounzFZvuQm5J51torw3Kq1uO+xx3GwtlZFiC9U5FWWnLMfr8cxLXGHBiEhm/bBTXKB7KX/FatfxcNP/w5dHR3IHllOm74JB4sx9Va2EXuNTkwOSaAFnjxj6e7amCsvn+pFMeOO183LPaj51QJ1Eq3MJBQogqDhrVfRvG0j1+xBuD1ZmDfzAlw9by4mVI7Wr8He3LgFe/YfhNR0EtNXzJmla3qNXcvABAg5yer7Dh/Bus1bcfJUMzxcOs8+twozp1dh18f78MzLq7Bj7z642YVnwkSMuO7rSM/iOkQWQCKQdMRrpKaF0PTv/k37jkf10wsgv/QZ4NrEdqcIwFkgynlzxu19BRBsf3KhdqzfIDMUROE0VyZ8e3fi0w1voqP+KPzBMIuQLFSdNREtra3Yc/Agq7J0NSYSjqKirBQP3X0nxo+uUKKJic06J+uEp/74EvlEKIadgnWxHnCosIeOfYIA53pPtht5589CyfyryDkNMRZjOvKE9BETJ+BP1V3J+VQvX8hKmQK0NFOAvXWxDAogv14647a1ZpPeqH7KCA/9EkG8QWpseoN8ARoNdMK745/w1ryHzoYT6GRCEsN1aUpSAgkHLwubMawEv/3VL6sHyEhr2DAWpZ2TM0zd8RP4xXN/VOH05YrEvgjF653BkL5EcY8chZKLr4Rn/ER0MeFpG3V7g7RVtou80+9MIcAzi9QDgiLAUlMArZz4sOm39p0NBNW/XkgPkG5FAeMcsxIJkIS8i+fSuHHjBpxc/7r+IoQkLFeGU5sFaby0C9ETghTMGCtCyEmXFvg5U78mJyceZ7CfMO0KR2kb6xGHx4Nxd94PO0txWYXKW2GtEhL6EDNnLE0+mDW/vcrwNlMA0d+4X27krpoNkoLXtaoyN3GzGEdaIKtCIS0FiLyMkIQlIyijKptUcrJWT3fYkMtVY25pKXKKi5FTVARPoWyF8BQUIoshJKMt97tcGbwvTUWkxEoqTPHCPi55JduTvNosdogZLN0N28RWNasPhJuOnXCRHT8xgozWMvrWlgwz7lhLI8Ql2QVjwWqrs4iDIyG3iTDaszFriNISLvJLy2JwpDOAggvmYNy/P4DRty5D5XfuwZjb7kblbfdg3NL74CwepgJKvxEmZd6uwmk/2q14G5OwPpfEue+22bRL9mJrMlhttT0h3O3pxjEhjzBQ87vF5lFvTJckad4sa2nVTgZC1KerZo8Zr2WzhIb8Ll4Hq0Y/SUdkCiUJibvsCWeyDUfXk6Mu7cjhPjsb6eINGtcMF4oV5F6+Xu/keoMJQ+f7zBEj4SwqpiAiKJ+p1Z5pi4C2qY1J0JuT0V642zOEUJwqA2H6d6iuxL20t7IiD6OREDJGlKH44nmI+NqM3/DiVV1Q8r9QWysKL7oYmeWjEQ528i7+SAKTjeJESLZg5hy4R1UgwllEbIpQRBnlqJ8hxpAovYIuzLBTf1BzuTe9UWxS2wYBbc9/GbJ75EB9rNmTJ781Ld1p57IXUad/+1W9IRm2P9OTK6xsL3tZLzS98zYT4tsIt/vURvmtr4KZs1FyqSyujNAQgsZN3OSQQtiZTENtzTixZhV8Bz7i9BYhrzRkDB/OSu/LyBo7AVGKZy1z4wet6rbkyVsgo2+EpvwzvhKXvFHgYx3w1KH62CF3LsOXcSutxTj5x8Zi6IxbUosgGVWgHPif9ZtmUiOEWWQEuEyV/jKGlcCZX6hTpnRvGNIDOaVnJFSkdiDBYMNxekKbLsJc9CwRpyvAOl89gE3j+kg1cwmqn13cSyhBmnClIWP9rbCtPtYQ22TPhIPxGRXr1BqDiIIH029ZY37oi/hZQ0Vg57oWZ2JUMoTODN11Ok9IO71iPs4CT1reJN86Sy6QeI/pa266OoWR6zqaJmb0Q77m2at7HkRYQogAEeas2V2ckitdVJbGaTEhkDZsIFOPQYgd/Z4dpYAYIB1r5+YsoO/mWRdE6K6ySY0gZHRpKz/S1tyse7vPiR3cJKdEgn5NiiKJ9KnEubfa90ueNktz4aBcpG8L7F84C3eb198Z++8TXoRy8jRx9RqROIjy029O7QmCZLOHNaLJYJmUuoVoEme4if5ykwUVIMm9KgoHw9nmxfeGM/fRwNgfak9gpyvHiA026DZaOognwMOqm/9qfkiNalOIvo83IOelV+t6/LEg7okK6/OMQRDf/tw15lFfiCDi5xLqUwNt+EbFcEOAulYfHm/sgJOrwmR/MNEtiImqmwYWwUKiV1jxK66ZeCxPkVPyOR6DGXFBKvKWJ0iS1hKYCfreoiyU53qkxI5pJfmno8fxnjObpatTC5dkiBdiKCJY6C+XxGOgUEuGRPLJ3N/BJCyv8c8PteOro0eot/f6o6mfH2lAU16hhoLOCClwukJ8nognnoy0BYtTkbcJ91SW9vzRFMkoH7m3kaXrL4+dQmd+0aD/bM4S418thEW8P9ICcXtZessfgmW2NGLZqGIUsbawOKsA0tA60UwRltefQmN2HtJZs+vMwIsDCWFh2rdeMY++GOxYca151D803mmzZPww1xFF7V7cPrIYBXHkzXaGAALrQoiJ8JVPTmErywMHFy3yTStnYaMBt+4bCP0kJxIFYrtpn5NX7JDRTtK/ZExSNE/oR6MdN9LXvzaRdclM1mPXlhXrd4wWRwu9BBDIBznDegP1vnZsaPLhoygQYHKUXzzSX01jeAzkeskw9RurzKP+sfMPXzGPBg+lQTeXpbcUOS4mu4k0dV6hByM92VJIGtqY7S30EUAQL4KgnS500OfHkUAIJ0JRtPBBHbzOhass9BBlO6MXs1r7AmFMkeLeTGw8llWxk5+zuM/nwAx3pmmFN9bjhochLEhFHgD+DzkdtOgX2diJAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/398891/WME%20Client%20Level%20Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/398891/WME%20Client%20Level%20Simulator.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */

(function () {
    'use strict';
    console.debug("wme-client-level-simulator: loading...");
    var WME_CLIENT_LEVEL_SIMULATOR_EVENTS_REGISTERED = false;
    var WME_CLIENT_LEVEL_SIMULATOR_RETRY_COUNT = 5000;
    var WME_CLIENT_LEVEL_SIMULATOR_RETRY_INTERVAL_MS = 5;
    var WME_CLIENT_LEVEL_SIMULATOR_requestedLevel = localStorage.getItem('WME_CllientSimulator_Level');
    var WME_CLIENT_LEVEL_SIMULATOR_requestedLevelAsInt;

    var ALL_PERMISSIONS = -1;
    var NO_PERMISSIONS = 0;
    var SEGMENT_PERMISSIONS = {EDIT_GEOMETRY:1,EDIT_PROPERTIES:2,DELETE:4,EDIT_EMPTY_STREET:8,SPLIT_DIRECTIONS:16,SET_UNKNOWN_DIRECTIONS:32,EDIT_HOUSE_NUMBERS:64,FORCE_HOUSE_NUMBERS:128,EDIT_CONNECTIONS:256,EDIT_ROUTING_ROAD_TYPES:512,EDIT_CLOSURES:1024,EDIT_HEADLIGHTS_REMINDER:2048, EDIT_AVERAGE_SPEED_CAMERA:4096, EDIT_LANES:8192};
    var NODE_PERMISSIONS = {EDIT_GEOMETRY:1,DELETE:2,EDIT_OPEN_TURNS:4,EDIT_CLOSE_TURNS:8};
    var VENUE_PERMISSIONS = {EDIT_GEOMETRY: 1, EDIT_PROPERTIES: 2, DELETE: 4, EDIT_UPDATE_REQUESTS: 8, EDIT_EXTERNAL_PROVIDERS: 16};
    var BIG_JUNCTION_PERMISSIONS = {DELETE: 1, UPDATE: 2};
    var CITIES_PERMISSIONS = {EDIT_PROPERTIES: 1};
    var MAP_PROBLEM_PERMISSIONS = {EDIT:1,FORCE_CLOSE:2};
    var SPEED_CAMERA_PERMISSIONS = {EDIT_GEOMETRY:1, EDIT_PROPERTIES:2, DELETE:4};
    var UPDATE_REQUEST_PERMISSIONS = {EDIT:1, FORCE_CLOSE:2};
    var COMMENT_PERMISSIONS = {EDIT_GEOMETRY:1, EDIT_PROPERTIES:2, DELETE:4};
    var RESTRICTED_DRIVING_AREA_PERMISSIONS = {EDIT_GEOMETRY: 1, EDIT_PROPERTIES: 2, DELETE: 4};
    var RAILROAD_CROSSING_PERMISSIONS = {EDIT_GEOMETRY: 1, EDIT_PROPERTIES: 2, DELETE: 4};
    var MAJOR_TRAFIC_EVENT_PERMISSIONS = {EDIT_PROPERTIES: 1,MANIPULATE_PARTNERS: 2,PUBLISH: 4,EDIT_TWEET_TEXT: 16};

    //TODO set proper values
    var WME_CLIENT_LEVEL_SIMULATOR_PER_LEVEL_PERMISSIONS = {
        "7": {
            "segment": ALL_PERMISSIONS,
            "node": ALL_PERMISSIONS,
            "venue": ALL_PERMISSIONS,
            "roadClousers": ALL_PERMISSIONS,
            "problems": ALL_PERMISSIONS,
            "mapUpdateRequests": ALL_PERMISSIONS,
            "camera": ALL_PERMISSIONS,
            "bigJunction": ALL_PERMISSIONS,
            "city": ALL_PERMISSIONS,
            "mapComment": ALL_PERMISSIONS,
            "railroadCrossing": ALL_PERMISSIONS
        },
        "6": {
            "segment": -33,
            "node": ALL_PERMISSIONS,
            "venue": ALL_PERMISSIONS,
            "roadClousers": ALL_PERMISSIONS,
            "problems": ALL_PERMISSIONS,
            "mapUpdateRequests": ALL_PERMISSIONS,
            "camera": ALL_PERMISSIONS,
            "bigJunction": ALL_PERMISSIONS,
            "city": ALL_PERMISSIONS,
            "mapComment": ALL_PERMISSIONS,
            "railroadCrossing": ALL_PERMISSIONS
        },
        "5": {
            "segment": ~20513,
            "node": 0,
            "venue": ALL_PERMISSIONS,
            "problems": ALL_PERMISSIONS,
            "mapUpdateRequests": -3,
            "camera": NO_PERMISSIONS,
            "bigJunction": ALL_PERMISSIONS,
            "city": ALL_PERMISSIONS,
            "mapComment": 0,
            "railroadCrossing": 0
        },
        "4": {
            "segment": -545,
            "node": 0,
            "venue": -1,
            "problems": -1,
            "mapUpdateRequests": -1,
            "camera": NO_PERMISSIONS,
            "bigJunction": NO_PERMISSIONS,
            "city": NO_PERMISSIONS,
            "mapComment": 0,
            "railroadCrossing": NO_PERMISSIONS
        },
        "3": {
            "segment": -33,
            "node": -1,
            "venue": -1,
            "roadClousers": -1,
            "problems": -1,
            "mapUpdateRequests": -1,
            "camera": NO_PERMISSIONS,
            "bigJunction": NO_PERMISSIONS,
            "city": NO_PERMISSIONS,
            "mapComment": 0,
            "railroadCrossing": NO_PERMISSIONS
        },
        "2": {
            "segment": -33,
            "node": -1,
            "venue": -17,
            "roadClousers": -1,
            "problems": -1,
            "mapUpdateRequests": -1,
            "camera": NO_PERMISSIONS,
            "bigJunction": NO_PERMISSIONS,
            "city": NO_PERMISSIONS,
            "mapComment": 0,
            "railroadCrossing": NO_PERMISSIONS
        },
        "1": {
            "segment": ~(SEGMENT_PERMISSIONS.SET_UNKNOWN_DIRECTIONS | SEGMENT_PERMISSIONS.FORCE_HOUSE_NUMBERS | SEGMENT_PERMISSIONS.EDIT_ROUTING_ROAD_TYPES | SEGMENT_PERMISSIONS.EDIT_CLOSURES),
            "node": ALL_PERMISSIONS,
            "venue": ~(VENUE_PERMISSIONS.EDIT_UPDATE_REQUESTS | VENUE_PERMISSIONS.EDIT_EXTERNAL_PROVIDERS),
            "roadClousers": -1,
            "problems": ~(MAP_PROBLEM_PERMISSIONS.FORCE_CLOSE),
            "mapUpdateRequests":  ~(UPDATE_REQUEST_PERMISSIONS.FORCE_CLOSE),
            "camera": NO_PERMISSIONS,
            "bigJunction": NO_PERMISSIONS,
            "city": NO_PERMISSIONS,
            "mapComment": 0,
            "railroadCrossing": NO_PERMISSIONS
        }
    };

    function wme_clientLevelSimulator_bootstrap(retry) {
        //debugger;
        if (W && W.loginManager && W.loginManager.events && W.loginManager.events.register && !WME_CLIENT_LEVEL_SIMULATOR_EVENTS_REGISTERED) {
            wme_clientLevelSimulator_registerEvents();
            WME_CLIENT_LEVEL_SIMULATOR_EVENTS_REGISTERED = true;
        }
        if (W && W.loginManager && W.loginManager.events && W.loginManager.events.register && W.loginManager.user) {
            console.debug("wme-client-level-simulator: initialized after retry #" + retry);
            wme_clientLevelSimulator_setup();
        } else {
            if (retry < WME_CLIENT_LEVEL_SIMULATOR_RETRY_COUNT) {
                //console.debug("wme-client-level-simulator: not yet initialized retry #" + retry);
                setTimeout(function () {
                    wme_clientLevelSimulator_bootstrap(retry + 1);
                }, WME_CLIENT_LEVEL_SIMULATOR_RETRY_INTERVAL_MS);
            } else if (WME_CLIENT_LEVEL_SIMULATOR_requestedLevel) {
                setTimeout(function () {
                    wme_clientLevelSimulator_bootstrap(retry);
                }, WME_CLIENT_LEVEL_SIMULATOR_RETRY_INTERVAL_MS);
            } else {
                console.error("wme-client-level-simulator: failed to init (wait " + WME_CLIENT_LEVEL_SIMULATOR_RETRY_COUNT + " times " + WME_CLIENT_LEVEL_SIMULATOR_RETRY_INTERVAL_MS + " ms)");
                return;
            }
        }
    };

    function wme_clientLevelSimulator_registerEvents() {
        // for top left panel (where it state user's rank)
        W.loginManager.events.registerPriority('login',this, wme_clientLevelSimulator_loginEvent);
    };

    function wme_clientLevelSimulator_loginEvent() {
        console.debug("wme-client-level-simulator: wme_clientLevelSimulator_loginEvent()");
        if (WME_CLIENT_LEVEL_SIMULATOR_requestedLevel) {
            if (WME_CLIENT_LEVEL_SIMULATOR_requestedLevel === 'Staff') {
                W.loginManager.user.isStaff = true;
                WME_CLIENT_LEVEL_SIMULATOR_requestedLevelAsInt = 7;
            } else if (WME_CLIENT_LEVEL_SIMULATOR_requestedLevel === 'AdOperator') {
                W.loginManager.user.adOperator = true;
                //TODO?
                WME_CLIENT_LEVEL_SIMULATOR_requestedLevelAsInt = W.loginManager.user.normalizedLevel;
            } else {
                WME_CLIENT_LEVEL_SIMULATOR_requestedLevelAsInt = parseInt(WME_CLIENT_LEVEL_SIMULATOR_requestedLevel);
            }
            W.loginManager.user.normalizedLevel = WME_CLIENT_LEVEL_SIMULATOR_requestedLevelAsInt;
            W.loginManager.user.attributes.rank = (WME_CLIENT_LEVEL_SIMULATOR_requestedLevelAsInt -1);
        }
        //Gadi: return false;
        return true;
    };

    // main init method
    function wme_clientLevelSimulator_setup() {
        console.debug("wme-client-level-simulator: wme_clientLevelSimulator_setup()");
        // adds extension UI to select the level
        var topBar = jQuery('.topbar')[0];
        var newDiv = document.createElement('div');
        newDiv.id = "wme_client_level_simulators";
        newDiv.style = 'color:white; background-color: black; position:absolute; left: 20%; padding: 5px; font-family: &quot;Open Sans&quot;,&quot;Alef&quot;,helvetica,sans-serif';
        newDiv.innerHTML = 'What if I was level';
        for (var i=1; i<7; i++) {
            addLevel(newDiv, '' + i);
        }
        //TODO support ad operator?
        //addLevel(newDiv, 'AdOperator');
        addLevel(newDiv, 'Staff');
        addLevel(newDiv, 'MyLevel');
        topBar.appendChild(newDiv);
        jQuery('.clientsimulatorclass').click(clientsimulatorLevelClick);
        // if level was already selected
        if (WME_CLIENT_LEVEL_SIMULATOR_requestedLevel) {
            jQuery('.clientsimulatorclass.'+WME_CLIENT_LEVEL_SIMULATOR_requestedLevel).css('background-color', 'white', 'important');
            if (WME_CLIENT_LEVEL_SIMULATOR_requestedLevel == 'MyLevel') {
                // nothing to to do - reset to my current level
                return;
            }
            // hide me in chat - not to confuse other users
            W.model.chat.attributes.visible = false;
            // since 'refresh' doesn't go through 'log in', the panel will be reset to my real level. hence this extension will work until browser refresh.
            // TODO
            //jQuery(window).unload(function() {
            //localStorage.removeItem('WME_CllientSimulator_Level');
            //});
            W.selectionManager.events.registerPriority('selectionchanged', this, selectionChanged);
            W.map.events.register("moveend", null, updateObjectsPermissions);
        } else {
            jQuery('.clientsimulatorclass.MyLevel').css('background-color', 'white', 'important');
        }
    };

    function updateObjectsPermissions() {
        if (W.model.problems.objects) {
            Object.keys(W.model.problems.objects).forEach(id => {
                W.model.problems.objects[id].attributes.permissions = WME_CLIENT_LEVEL_SIMULATOR_PER_LEVEL_PERMISSIONS[WME_CLIENT_LEVEL_SIMULATOR_requestedLevelAsInt]['problems'];
            });
        }
        if (W.model.mapUpdateRequests.objects) {
            Object.keys(W.model.mapUpdateRequests.objects).forEach(id => {
                W.model.mapUpdateRequests.objects[id].attributes.permissions = WME_CLIENT_LEVEL_SIMULATOR_PER_LEVEL_PERMISSIONS[WME_CLIENT_LEVEL_SIMULATOR_requestedLevelAsInt]['mapUpdateRequests'];
            });
        }
    }

    // changes permissions of selected item(s)
    function selectionChanged(obj) {
        if (obj.selected.length > 0) {
            for (var i=0; i<obj.selected.length; i++) {
                var type = obj.selected[i].model.type;
                if (type === 'segment' || type === 'node' || type === 'venue' || type === 'bigJunction' || type === 'camera' || type === 'mapComment' || type === 'city' || type === 'railroadCrossing') {
                    var id = obj.selected[i].model.attributes.id;
                    var modelKey = type=="city"?"cities":type+'s';
                    W.model[modelKey].objects[id].attributes.permissions = getPermissions(type);
                } else {
                    console.debug("wme-client-level-simulator: selectionChanged() selected: " + type + ' not supported');
                }
            }
        }
    }

    function getPermissions (objectType) {
        return WME_CLIENT_LEVEL_SIMULATOR_PER_LEVEL_PERMISSIONS[WME_CLIENT_LEVEL_SIMULATOR_requestedLevelAsInt][objectType];
    };

    function addLevel (theDiv, val) {
        var newA = document.createElement('a');
        newA.innerHTML = val;
        newA.className = 'clientsimulatorclass ' + val;
        newA.style = 'cursor:pointer; padding-left: 8px; padding-right: 8px';
        theDiv.appendChild(newA);
    };

    function clientsimulatorLevelClick(level) {
        var value = this.innerHTML;
        console.debug("wme-client-level-simulator: clientsimulatorLevelClick() value: " + value);
        var result = confirm('Will logout to take effect. OK?');
        if (result) {
            localStorage.setItem('WME_CllientSimulator_Level', value);
            W.loginManager.logout();
        }
    };

    // call init method
    wme_clientLevelSimulator_bootstrap(1);

})();

/**
 * Models:
 * bigJunctions
 * segments
 * cameras
 * cities
 * majorTrafficEvents
 * mapComments
 * mapUpdateRequests
 * nodes
 * problems
 * railroadCrossings
 * venues
 *
 * Selection Types:
 * "city"
 * "node"
 * "venue"
 * "segment"
 * "bigJunction"
 * "camera"
 * "mapComment"
 * "railroadCrossing"
 *
 * Objects permissions without selection:
 * roadClousers
 * problems
 * mapUpdateRequests
 **/