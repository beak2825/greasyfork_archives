// ==UserScript==
// @name         PurpleLZT
// @namespace    http://tampermonkey.net/
// @version      v1.3
// @description  try to make u smile
// @author       lzt.lol/disa
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @match        https://zelenka.market/*
// @match        https://lolz.market/*
// @icon         https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExampkcms2dW9leW1tZHM2cW5ncmJmenBseTIweW94M2NtaTFndzgwciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/9xuY0UvnJ05lJfTDhn/giphy.gif
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492539/PurpleLZT.user.js
// @updateURL https://update.greasyfork.org/scripts/492539/PurpleLZT.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var style = document.createElement('style');
    style.textContent = `
    #lzt-logo {
        background-color: #272727 !important;
        height: 40px !important;
        width: 40px !important;
        background-size: 100% !important;
        float: left !important;
        margin: 4px 10px 0 0 !important;
        background-image: url("https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExampkcms2dW9leW1tZHM2cW5ncmJmenBseTIweW94M2NtaTFndzgwciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/9xuY0UvnJ05lJfTDhn/giphy.gif") !important;
    }
    body {
    background-image: linear-gradient(rgba(54, 54, 54, .85), rgba(54, 54, 54, .85)), url(https://i.imgur.com/qthmd6t.jpeg);
    background-size: 100%;
    background-attachment: fixed;
    color: rgb(214, 214, 214);
    font: 13 px /1.231 arial, helvetica, clean, sans-serif;
    *font-size: small;
    *font: x-small;
}
    .log_out .pageContent {
    display: flex;
}
    .itemFaveCountIcon::before {
    content: '';
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='16' height='16' stroke='rgb(130, 88, 248)' stroke-width='2' fill='rgb(130, 88, 248)' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1' style='%0A'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'%3E%3C/path%3E%3C/svg%3E");
    background-size: 100%;
    height: 16px;
    width: 16px;
    margin: 0 0 0 4px;
    display: inline-block;
    vertical-align: top;
}
    .navPopup .navigationCogIcon:hover::before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='20' height='20' stroke='rgb(130, 88, 248)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Ccircle cx='12' cy='12' r='3'%3E%3C/circle%3E%3Cpath d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z'%3E%3C/path%3E%3C/svg%3E");
}
    .ToFavouritesButton::before {
    width: 20 px;
    height: 20 px;
    background-size: 100%;
    content: '';
    display: inline-block;
    vertical-align: middle;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='rgb(124 0 124)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'%3E%3C/path%3E%3C/svg%3E");
}
    .message .item.unlike .like2Icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style='&%2310; fill: rgb(130, 88, 248);&%2310;'%3E%3Cpath d='M4 21h1V8H4c-1.104 0-2 .896-2 2v9C2 20.104 2.896 21 4 21zM20 8h-7l1.122-3.368C14.554 3.337 13.59 2 12.225 2H12L7 7.438V21h11l3.912-8.596C21.937 12.291 21.976 12.114 22 12v-2C22 8.896 21.104 8 20 8z'/%3E%3C/svg%3E");
}
    .message .item:hover .postCounterIcon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='rgb(130, 88, 248)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cpath d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'%3E%3C/path%3E%3C/svg%3E");
}
    .page_counter .count {
    font-size: 19px;
    color: rgb(172 89 216);
    padding-bottom: 3px;
    line-height: 21px;
}
    .message .item:hover .hiddenReplyIcon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='rgb(130, 88, 248)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cpath d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'%3E%3C/path%3E%3Cline x1='1' y1='1' x2='23' y2='23'%3E%3C/line%3E%3C/svg%3E");
}

    .message .item:hover .userTagIcon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='rgb(130, 88, 248)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Ccircle cx='12' cy='12' r='4'%3E%3C/circle%3E%3Cpath d='M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94'%3E%3C/path%3E%3C/svg%3E");
}
    .alertLikeButton.likeCounterIcon.liked {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='' stroke-width='2' fill='rgb(118,77,199)' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'%3E%3C/path%3E%3C/svg%3E");
}    .writeToSellerIconTelegram {
    width: 20 px;
    height: 20 px;
    background-image: url("data:image/svg+xml,%3Csvg fill='rgb(255,255,255)' width='24px' height='24px' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xml:space='preserve' xmlns:serif='http://www.serif.com/' style='fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;'%3E%3Cpath id='telegram-1' d='M18.384,22.779c0.322,0.228 0.737,0.285 1.107,0.145c0.37,-0.141 0.642,-0.457 0.724,-0.84c0.869,-4.084 2.977,-14.421 3.768,-18.136c0.06,-0.28 -0.04,-0.571 -0.26,-0.758c-0.22,-0.187 -0.525,-0.241 -0.797,-0.14c-4.193,1.552 -17.106,6.397 -22.384,8.35c-0.335,0.124 -0.553,0.446 -0.542,0.799c0.012,0.354 0.25,0.661 0.593,0.764c2.367,0.708 5.474,1.693 5.474,1.693c0,0 1.452,4.385 2.209,6.615c0.095,0.28 0.314,0.5 0.603,0.576c0.288,0.075 0.596,-0.004 0.811,-0.207c1.216,-1.148 3.096,-2.923 3.096,-2.923c0,0 3.572,2.619 5.598,4.062Zm-11.01,-8.677l1.679,5.538l0.373,-3.507c0,0 6.487,-5.851 10.185,-9.186c0.108,-0.098 0.123,-0.262 0.033,-0.377c-0.089,-0.115 -0.253,-0.142 -0.376,-0.064c-4.286,2.737 -11.894,7.596 -11.894,7.596Z'/%3E%3C/svg%3E");
    display: inline-block;
    vertical-align: sub;
    background-size: 100%;
    margin-right: 8 px;
}
    .searchResult .title>a {
    color: rgb(118, 77, 199);
    font-size: 15px;
    font-weight: 600;
}
    .likeNodes .node .counter {
    display: block;
    font-size: 19px;
    color: rgb(157 119 231);
    padding-bottom: 3px;
}
    .message .item.unlike .likeCounterIcon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='m0 0h24v24h-24z' fill='none'/%3E%3Cpath d='m17 2.9a6.43 6.43 0 0 1 6.4 6.43c0 3.57-1.43 5.36-7.45 10l-2.78 2.16a1.9 1.9 0 0 1 -2.33 0l-2.79-2.12c-6.05-4.68-7.45-6.47-7.45-10.04a6.43 6.43 0 0 1 6.4-6.43 5.7 5.7 0 0 1 5 3.1 5.7 5.7 0 0 1 5-3.1z' fill='%23ff3347' style='&%2310; fill: rgb(130, 88, 248);&%2310;'/%3E%3C/svg%3E");
}
    .alertAction.like::before {
    background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20width%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%2210%22%2F%3E%3Cpath%20d%3D%22m12.1992481%206.5c1.5468126%200%202.8007519%201.20487381%202.8007519%202.69116097%200%201.50097283-.6258611%202.25353543-3.2805047%204.23746743l-1.2078781.9027005c-.3009254.2248948-.72230897.2248948-1.02323438%200l-1.20787815-.9027005c-2.65464356-1.983932-3.28050467-2.7364946-3.28050467-4.23746743%200-1.48628716%201.25393933-2.69116097%202.80075188-2.69116097.82873383%200%201.54924812.4%202.19924812%201.15.65-.75%201.3705143-1.15%202.1992481-1.15z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E) no-repeat, linear-gradient(to bottom right, #ec52ff, #3633ff);
}
    .alertAction.quote::before, .alertAction.insert::before, .alertAction.alerts::before, .alertAction.other_commenter::before, .alertAction.your_thread::before, .alertAction.your_profile::before, .alertAction.insert_edited::before, .alertAction.profile_post_edit::before, .alertAction.open_ticket::before, .alertAction.new_ticket::before, .alertAction.reopen_ticket::before, .alertAction.edit::before, .alertAction.reply::before {
    background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20width%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%2210%22%2F%3E%3Cpath%20d%3D%22m8%2013.5h-1.0770861c-.66863905%200-.91110373-.0696192-1.15554818-.2003495-.24444444-.1307303-.43628587-.3225718-.56701619-.5670162-.13073032-.2444445-.20034953-.4869091-.20034953-1.1555482v-3.6541722c0-.66863905.06961921-.91110373.20034953-1.15554818.13073032-.24444444.32257175-.43628587.56701619-.56701619.24444445-.13073032.48690913-.20034953%201.15554818-.20034953h6.1541722c.6686391%200%20.9111037.06961921%201.1555482.20034953.2444444.13073032.4362859.32257175.5670162.56701619.1307303.24444445.2003495.48690913.2003495%201.15554818v3.6541722c0%20.6686391-.0696192.9111037-.2003495%201.1555482-.1307303.2444444-.3225718.4362859-.5670162.5670162-.2444445.1307303-.4869091.2003495-1.1555482.2003495h-2.0770861l-2.06109127%202.0610913c-.21478836.2147883-.5630291.2147883-.77781746%200-.10314501-.103145-.16109127-.2430397-.16109127-.3889088z%22%20fill%3D%22%23fff%22%20fill-rule%3D%22nonzero%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E) no-repeat, linear-gradient(to bottom right, #cb1292, #261279);
}
    .alertAction.your_post::before {
    background: url(data:image/svg+xml;charset=utf-8,%3Csvg%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20width%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%2210%22%2F%3E%3Cpath%20d%3D%22m12.7295033%2012.6518428c.1573607-.1645417.2922725-.3512837.4031892-.55868.2396723-.4481481.3673075-.8926667.3673075-2.11850495v-2.97465785h.8975718c.5571992%200%20.7592531.05801601.9629568.16695794s.3635715.26880979.4725135.4725135c.1089419.2037037.1669579.4057576.1669579.96295681v6.04498595c0%20.0925828-.0366826.181394-.1020172.2469909-.1364093.1369572-.3580166.1374013-.4949737.000992l-1.9030091-1.8953971h-.760689c-.082779-.0001153-.1498847-.067221-.1498847-.15%200-.0425665.0180989-.0831254.0497799-.1115546.0351388-.0315322.0652378-.0603998.0902971-.0866026zm-6.2295033-.6518428-1.90300909%201.8953971c-.13695714.1364093-.35856444.1359652-.49497375-.000992-.06533456-.0655969-.10201716-.1544081-.10201716-.2469909v-6.04498595c0-.55719921.05801601-.75925311.16695794-.96295681.10894193-.20370371.26880979-.36357157.4725135-.4725135.2037037-.10894193.4057576-.16695794.96295681-.16695794h4.79514355c.5571992%200%20.7592531.05801601.9629568.16695794s.3635715.26880979.4725135.4725135c.1089419.2037037.1669579.4057576.1669579.96295681v2.79514355c0%20.5571992-.058016.7592531-.1669579.9629568-.108942.2037037-.2688098.3635715-.4725135.4725135-.2037037.1089419-.4057576.1669579-.9629568.1669579z%22%20fill%3D%22%23fff%22%20fill-rule%3D%22nonzero%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E) no-repeat, linear-gradient(to bottom right, #1b1e23, #c000ff);
}
    .universalSearchForm:before {
    font-family: "Font Awesome 5 Pro";
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    font-weight: 600;
    color: rgb(145 109 189);
    content: "\f002";
    float: left;
    font-size: 15px;
    line-height: 50px;
    left: 20px;
    pointer-events: none;
    position: absolute;
}
    .conversationItem .tc-lucmc-unreadCounter {
    padding: 0px 4px 0px 4px;
    border: 2px solid rgb(54, 54, 54);
    border-radius: 12px;
    color: #f5f5f5;
    font-size: 11px;
    height: 18px;
    line-height: 18px;
    min-width: 10px;
    background-color: rgb(94 84 151);
    text-align: center;
    float: right;
}
    .node82.node.current .nodeText .nodeTitle a::before, a.internalNodeLink.node82::before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='rgb(118,77,199)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cpath d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z'%3E%3C/path%3E%3C/svg%3E")
}
    #conversationJumpUp {
    margin-bottom: 65 px;
    background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiMyMjhlNWQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGlkPSJwYXRoMiIgZD0iTSAzLDIwIDAsMTYuOTQzIDEyLDUgMjQsMTYuOTQzIDIxLDIwIDEyLDExIFoiLz48L3N2Zz4=") center center no-repeat rgb(45, 45, 45);
    filter: hue-rotate(103deg);
}
    .node239.node.current .nodeText .nodeTitle a::before, a.internalNodeLink.node239::before {
     background-image: url("data:image/svg+xml,%3Csvg width='41' height='50' viewBox='0 0 41 50' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.5 27.3334C11.6941 27.3334 4.55557 34.472 4.55557 43.2778V47.8335C4.55557 49.0914 3.53577 50.1111 2.27778 50.1111C1.01981 50.1111 0 49.0914 0 47.8335V43.2778C0 31.956 9.17818 22.7778 20.5 22.7778C31.8219 22.7778 41 31.956 41 43.2778V47.8335C41 49.0914 39.9803 50.1111 38.7222 50.1111C37.4642 50.1111 36.4445 49.0914 36.4445 47.8335V43.2778C36.4445 34.472 29.3059 27.3334 20.5 27.3334Z' fill='rgb(118,77,199)'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20.5 22.7778C25.5319 22.7778 29.6111 18.6986 29.6111 13.6667C29.6111 8.63474 25.5319 4.55556 20.5 4.55556C15.4681 4.55556 11.3889 8.63474 11.3889 13.6667C11.3889 18.6986 15.4681 22.7778 20.5 22.7778ZM20.5 27.3334C28.0479 27.3334 34.1667 21.2146 34.1667 13.6667C34.1667 6.11878 28.0479 0 20.5 0C12.9521 0 6.83337 6.11878 6.83337 13.6667C6.83337 21.2146 12.9521 27.3334 20.5 27.3334Z' fill='rgb(118,77,199)'/%3E%3C/svg%3E%0A");
}
    .node104.node.current .nodeText .nodeTitle a::before, a.internalNodeLink.node104::before {
    background-image: url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0.73223 27.6255C1.70855 26.6492 3.29146 26.6492 4.26778 27.6255L12.5001 35.8578C13.4764 36.8341 13.4764 38.417 12.5001 39.3933C11.5237 40.3696 9.94078 40.3696 8.96447 39.3933L0.73223 31.161C-0.244077 30.1847 -0.244077 28.6018 0.73223 27.6255Z' fill='rgb(118,77,199)'/%3E%3Cpath d='M49.337 8.58909C50.2735 7.57449 50.2102 5.99283 49.1956 5.05631C48.1811 4.11981 46.5995 4.18307 45.6629 5.19762L17.3586 35.8607C16.422 36.8753 16.4853 38.4569 17.4999 39.3934C18.5145 40.3299 20.0962 40.2666 21.0326 39.252L38.2897 20.557C38.7712 20.0353 39.5901 20.0189 40.092 20.5209L43.2323 23.6611C44.2086 24.6374 45.7916 24.6374 46.7679 23.6611C47.7442 22.6848 47.7442 21.1019 46.7679 20.1256L43.4155 16.7732C42.9411 16.2988 42.9258 15.5345 43.3808 15.0414L49.337 8.58909Z' fill='rgb(118,77,199)'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9.69663 26.5902L5.30328 22.1968C2.37433 19.2678 2.37433 14.519 5.30327 11.5901L14.6967 2.1967C17.6256 -0.732241 22.3744 -0.732229 25.3033 2.1967L29.6967 6.59016C32.6257 9.51908 32.6257 14.2678 29.6968 17.1967L20.3033 26.5902C17.3744 29.5191 12.6257 29.5191 9.69663 26.5902ZM8.83886 18.6612L13.2322 23.0546C14.2085 24.0309 15.7914 24.0309 16.7677 23.0546L26.1612 13.6612C27.1375 12.6849 27.1375 11.1019 26.1612 10.1256L21.7678 5.73225C20.7915 4.75593 19.2085 4.75593 18.2322 5.73224L8.83886 15.1257C7.86255 16.102 7.86255 17.6849 8.83886 18.6612Z' fill='rgb(118,77,199)'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M15 44.3933C16.3808 44.3933 17.5 43.2741 17.5 41.8934C17.5 40.5126 16.3808 39.3934 15 39.3934C13.6193 39.3934 12.5001 40.5126 12.5001 41.8934C12.5001 43.2741 13.6193 44.3933 15 44.3933ZM15 49.3934C19.1421 49.3934 22.5001 46.0355 22.5001 41.8934C22.5001 37.7512 19.1421 34.3933 15 34.3933C10.8579 34.3933 7.5 37.7512 7.5 41.8934C7.5 46.0355 10.8579 49.3934 15 49.3934Z' fill='rgb(118,77,199)'/%3E%3C/svg%3E%0A");
}    .node.current .nodeText .nodeTitle a::before {
    background-image: url("data:image/svg+xml,%3Csvg width='50' height='49' viewBox='0 0 50 49' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12.4057 34.4911V42.167L24.9656 34.7452L26.2784 34.7237C31.4985 34.6382 36.1963 34.1127 39.7089 33.5782C41.9258 33.2409 43.4662 31.6938 43.8008 29.7511C44.265 27.0564 44.6604 23.6425 44.6604 19.8491C44.6604 16.0556 44.265 12.6416 43.8008 9.94696C43.4662 8.00437 41.9258 6.45717 39.7089 6.11987C35.867 5.5353 30.613 4.96227 24.8113 4.96227C19.0096 4.96227 13.7556 5.5353 9.91363 6.11987C7.69679 6.45717 6.15643 8.00437 5.8218 9.94696C5.35766 12.6417 4.96226 16.0556 4.96226 19.8491C4.96226 23.6425 5.35766 27.0564 5.8218 29.7511C6.11239 31.4381 7.29087 32.7902 9.0092 33.3616L12.4057 34.4911ZM0.931562 9.10461C1.65156 4.92474 4.97398 1.85211 9.16726 1.21409C13.185 0.602746 18.6967 0 24.8113 0C30.9258 0 36.4376 0.602746 40.4554 1.21409C44.6486 1.85211 47.971 4.92474 48.691 9.10461C49.1928 12.0178 49.6225 15.7186 49.6225 19.8491C49.6225 23.9795 49.1928 27.6802 48.691 30.5934C47.971 34.7733 44.6486 37.846 40.4554 38.484C36.7797 39.0432 31.8537 39.5953 26.3597 39.6854L11.1867 48.6511C9.53276 49.6285 7.44336 48.4363 7.44336 46.5151V38.0703C4.08533 36.9537 1.54962 34.1815 0.931562 30.5934C0.429763 27.6802 0 23.9795 0 19.8491C0 15.7186 0.429763 12.0178 0.931562 9.10461Z' fill='rgb(118,77,199)'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12.4057 12.4058C11.0354 12.4058 9.9245 13.5167 9.9245 14.8869C9.9245 16.2572 11.0354 17.3681 12.4057 17.3681H37.217C38.5872 17.3681 39.6981 16.2572 39.6981 14.8869C39.6981 13.5167 38.5872 12.4058 37.217 12.4058H12.4057ZM12.4057 22.3303C11.0354 22.3303 9.9245 23.4412 9.9245 24.8114C9.9245 26.1818 11.0354 27.2926 12.4057 27.2926H22.3302C23.7005 27.2926 24.8113 26.1818 24.8113 24.8114C24.8113 23.4412 23.7005 22.3303 22.3302 22.3303H12.4057Z' fill='rgb(118,77,199)'/%3E%3C/svg%3E%0A");
}    .message .item:hover .likeCounterIcon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' height='100%25' width='100%25'%3E%3Ctitle%3Elike_outline_24%3C/title%3E%3Cpath d='M0,0H24V24H0Z' fill='none'/%3E%3Cpath d='M17,2.9A6.43,6.43,0,0,1,23.4,9.33c0,3.57-1.43,5.36-7.45,10l-2.78,2.16a1.9,1.9,0,0,1-2.33,0L8.05,19.37C2,14.69.6,12.9.6,9.33A6.43,6.43,0,0,1,7,2.9a6.46,6.46,0,0,1,5,2.54A6.46,6.46,0,0,1,17,2.9ZM7,4.7A4.63,4.63,0,0,0,2.4,9.33c0,2.82,1.15,4.26,6.76,8.63l2.78,2.16a.1.1,0,0,0,.12,0L14.84,18c5.61-4.36,6.76-5.8,6.76-8.63A4.63,4.63,0,0,0,17,4.7c-1.56,0-3,.88-4.23,2.73L12,8.5l-.74-1.07C10,5.58,8.58,4.7,7,4.7Z' fill='%23828a99' style='&%2310; fill: rgb(130, 88, 248);&%2310;'/%3E%3C/svg%3E")
}
    .node9.node.current .nodeText .nodeTitle a::before, a.internalNodeLink.node9::before {
    background-image: url("data:image/svg+xml,%3Csvg width='50' height='48' viewBox='0 0 50 48' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M2.50006 25C2.50006 23.6193 3.61935 22.5 5.00005 22.5H45.0001C46.3808 22.5 47.5001 23.6193 47.5001 25V37.5001C47.5001 43.0229 43.023 47.5 37.5001 47.5H12.5001C6.97722 47.5 2.50006 43.0229 2.50006 37.5001V25ZM8.75009 27.5001C8.05975 27.5001 7.50001 28.0597 7.50001 28.75V37.5001C7.50001 40.2614 9.73858 42.5 12.5001 42.5H37.5001C40.2615 42.5 42.5001 40.2614 42.5001 37.5001V28.75C42.5001 28.0597 41.9404 27.5001 41.2501 27.5001H8.75009Z' fill='rgb(118,77,199)'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M42.5 14.9999H7.49999C6.11929 14.9999 5 16.1193 5 17.5V20C5 21.3807 6.11929 22.4999 7.49999 22.4999H42.5C43.8807 22.4999 45.0001 21.3807 45.0001 20V17.5C45.0001 16.1193 43.8807 14.9999 42.5 14.9999ZM7.49999 10C3.35786 10 0 13.3578 0 17.5V20C0 24.142 3.35786 27.5 7.49999 27.5H42.5C46.6422 27.5 50 24.142 50 20V17.5C50 13.3578 46.6422 10 42.5 10H7.49999Z' fill='rgb(118,77,199)'/%3E%3Cpath d='M22.5001 10H27.5V47.4999H22.5001V10Z' fill='rgb(118,77,199)'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M20 15C15.858 15 12.5001 11.6422 12.5001 7.50004C12.5001 3.35787 15.858 0 20 0C21.9209 0 23.6732 0.722144 25.0001 1.90973C26.327 0.722144 28.0792 0 30 0C34.1422 0 37.5001 3.35787 37.5001 7.50004C37.5001 11.6422 34.1422 15 30 15H20ZM20 5.00001C21.3808 5.00001 22.5001 6.1193 22.5001 7.50004V10.0001H20C18.6193 10.0001 17.5001 8.88072 17.5001 7.50004C17.5001 6.1193 18.6193 5.00001 20 5.00001ZM27.5001 10.0001H30C31.3808 10.0001 32.5001 8.88072 32.5001 7.50004C32.5001 6.1193 31.3808 5.00001 30 5.00001C28.6193 5.00001 27.5001 6.1193 27.5001 7.50004V10.0001Z' fill='rgb(118,77,199)'/%3E%3C/svg%3E%0A");
}    .likeCounterIcon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' height='100%25' width='100%25'%3E%3Ctitle%3Elike_outline_24%3C/title%3E%3Cpath d='M0,0H24V24H0Z' fill='none'/%3E%3Cpath d='M17,2.9A6.43,6.43,0,0,1,23.4,9.33c0,3.57-1.43,5.36-7.45,10l-2.78,2.16a1.9,1.9,0,0,1-2.33,0L8.05,19.37C2,14.69.6,12.9.6,9.33A6.43,6.43,0,0,1,7,2.9a6.46,6.46,0,0,1,5,2.54A6.46,6.46,0,0,1,17,2.9ZM7,4.7A4.63,4.63,0,0,0,2.4,9.33c0,2.82,1.15,4.26,6.76,8.63l2.78,2.16a.1.1,0,0,0,.12,0L14.84,18c5.61-4.36,6.76-5.8,6.76-8.63A4.63,4.63,0,0,0,17,4.7c-1.56,0-3,.88-4.23,2.73L12,8.5l-.74-1.07C10,5.58,8.58,4.7,7,4.7Z' fill='%23828a99' style='&%2310; fill: rgb(140 140 140);&%2310;'/%3E%3C/svg%3E");
}
    .node105.node.current .nodeText .nodeTitle a::before, a.internalNodeLink.node105::before {
     background-image: url("data:image/svg+xml,%3Csvg width='41' height='50' viewBox='0 0 41 50' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9.11108 4.55542C4.07916 4.55542 0 8.63456 0 13.6665V40.9999C0 46.0318 4.07916 50.1109 9.11108 50.1109H31.8888C36.9207 50.1109 41 46.0318 41 40.9999V13.6665C41 8.63456 36.9207 4.55542 31.8888 4.55542V9.11096C34.4048 9.11096 36.4443 11.1506 36.4443 13.6665V40.9999C36.4443 43.5158 34.4048 45.5554 31.8888 45.5554H9.11108C6.59518 45.5554 4.55555 43.5158 4.55555 40.9999V13.6665C4.55555 11.1506 6.59518 9.11096 9.11108 9.11096V4.55542Z' fill='rgb(118,77,199)'/%3E%3Cpath d='M11.389 22.7774C12.647 22.7774 13.6669 21.7577 13.6669 20.4997C13.6669 19.2417 12.647 18.2219 11.389 18.2219C10.1311 18.2219 9.11133 19.2417 9.11133 20.4997C9.11133 21.7577 10.1311 22.7774 11.389 22.7774Z' fill='rgb(118,77,199)'/%3E%3Cpath d='M20.5002 18.2219C19.2421 18.2219 18.2224 19.2417 18.2224 20.4997C18.2224 21.7577 19.2421 22.7774 20.5002 22.7774H29.6112C30.8692 22.7774 31.8891 21.7577 31.8891 20.4997C31.8891 19.2417 30.8692 18.2219 29.6112 18.2219H20.5002Z' fill='rgb(118,77,199)'/%3E%3Cpath d='M20.5002 27.3333C19.2421 27.3333 18.2224 28.353 18.2224 29.611C18.2224 30.8689 19.2421 31.8888 20.5002 31.8888H29.6112C30.8692 31.8888 31.8891 30.8689 31.8891 29.611C31.8891 28.353 30.8692 27.3333 29.6112 27.3333H20.5002Z' fill='rgb(118,77,199)'/%3E%3Cpath d='M18.2224 38.7219C18.2224 37.4638 19.2421 36.4441 20.5002 36.4441H25.0557C26.3137 36.4441 27.3334 37.4638 27.3334 38.7219C27.3334 39.9799 26.3137 40.9996 25.0557 40.9996H20.5002C19.2421 40.9996 18.2224 39.9799 18.2224 38.7219Z' fill='rgb(118,77,199)'/%3E%3Cpath d='M13.6669 29.611C13.6669 30.8689 12.647 31.8888 11.389 31.8888C10.1311 31.8888 9.11133 30.8689 9.11133 29.611C9.11133 28.353 10.1311 27.3333 11.389 27.3333C12.647 27.3333 13.6669 28.353 13.6669 29.611Z' fill='rgb(118,77,199)'/%3E%3Cpath d='M11.389 40.9996C12.647 40.9996 13.6669 39.9799 13.6669 38.7219C13.6669 37.4638 12.647 36.4441 11.389 36.4441C10.1311 36.4441 9.11133 37.4638 9.11133 38.7219C9.11133 39.9799 10.1311 40.9996 11.389 40.9996Z' fill='rgb(118,77,199)'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M27.3342 4.55555H13.6675C12.4095 4.55555 11.3898 5.5754 11.3898 6.83335C11.3898 8.0913 12.4095 9.11105 13.6675 9.11105H27.3342C28.5921 9.11105 29.612 8.0913 29.612 6.83335C29.612 5.5754 28.5921 4.55555 27.3342 4.55555ZM13.6675 0C9.89361 0 6.83411 3.05939 6.83411 6.83335C6.83411 10.6073 9.89361 13.6667 13.6675 13.6667H27.3342C31.1081 13.6667 34.1675 10.6073 34.1675 6.83335C34.1675 3.05939 31.1081 0 27.3342 0H13.6675Z' fill='rgb(118,77,199)'/%3E%3C/svg%3E%0A");
     background-size: 83%;
}

    .personalTabviewedthreads.node.current .nodeText .nodeTitle a::before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='rgb(118,77,199)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cpath d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'%3E%3C/path%3E%3Ccircle cx='12' cy='12' r='3'%3E%3C/circle%3E%3C/svg%3E");
}
    .personalTabfave.node.current .nodeText .nodeTitle a::before {
    background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='22' height='22' stroke='rgb(118,77,199)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'><polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'></polygon></svg>");
}
    .message a.like:hover .like2Icon {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style='&%2310; fill: rgb(118,77,199);&%2310;'%3E%3Cpath d='M20,8h-5.612l1.123-3.367c0.202-0.608,0.1-1.282-0.275-1.802S14.253,2,13.612,2H12c-0.297,0-0.578,0.132-0.769,0.36 L6.531,8H4c-1.103,0-2,0.897-2,2v9c0,1.103,0.897,2,2,2h3h10.307c0.829,0,1.581-0.521,1.873-1.298l2.757-7.351 C21.979,12.239,22,12.12,22,12v-2C22,8.897,21.103,8,20,8z M4,10h2v9H4V10z M20,11.819L17.307,19H8V9.362L12.468,4l1.146,0 l-1.562,4.683c-0.103,0.305-0.051,0.64,0.137,0.901C12.377,9.846,12.679,10,13,10h7V11.819z'/%3E%3C/svg%3E");
}
    .personalTabmythreads.node.current .nodeText .nodeTitle a::before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='22' height='22' stroke='rgb(118,77,199)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cline x1='17' y1='10' x2='3' y2='10'%3E%3C/line%3E%3Cline x1='21' y1='6' x2='3' y2='6'%3E%3C/line%3E%3Cline x1='21' y1='14' x2='3' y2='14'%3E%3C/line%3E%3Cline x1='17' y1='18' x2='3' y2='18'%3E%3C/line%3E%3C/svg%3E");
}    .contactToSellerButtons .writeToSellerIcon {
    width: 22 px;
    height: 22 px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='rgb(255 255 255)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cpath d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z'%3E%3C/path%3E%3C/svg%3E");
    display: inline-block;
    vertical-align: middle;
    background-size: 100%;
}
    .counter-container svg {
    width: 22px;
    height: 22px;
    color: rgb(77,77,77);
}
    .navTabs .navTab.PopupClosed .navLink:hover .counter-container svg, .navTabs .navTab.PopupOpen .navLink .counter-container svg {
    color: rgb(130, 88, 248);
}
    .listItemText a {
    color: rgb(118, 77, 199);
}
    .button.primary {
    color: #f5f5f5;
    background-color: rgb(118, 77, 199);
}
    .button.primary:hover{
    background-color: rgb(118, 77, 199);
}
    .chat2-button.lztng-1a57w7i {
    position: fixed;
    bottom: 15px;
    right: 15px;
    width: 60px;
    height: 60px;
    background: rgb(118, 77, 199);
    border-radius: 50%;
    text-align: center;
    cursor: pointer;
}
    .username .style23 {
    color: #b35ede;
    text-shadow: 0 0 5px #ab35ff, 0 0 5px #ff51fa, 0 0 5px #1000ffc7;
}
    .node .nodeTitle>a:hover {
    color: rgb(118, 77, 199);
    text-decoration: none;
    cursor: pointer;
}
    .button {
    font-size: 13px;
    color: rgb(214, 214, 214);
    text-decoration: none;
    background-color: rgb(118 77 199);
    background-position: center;
    padding: 0px 15px;
    border-style: none;
    border-radius: 6px;
    user-select: none;
    font-style: normal;
    text-align: center;
    outline: none;
    line-height: 34px;
    display: inline-block;
    cursor: pointer;
    box-sizing: border-box;
    vertical-align: top;
    -webkit-appearance: none !important;
    font-weight: 600;
    transition: background 0.8s;
    overflow: hidden;
    height: 34px;
}
    .button:hover {
        font-size: 13px;
    color: rgb(214, 214, 214);
    text-decoration: none;
    background-color: rgb(118 77 199);
    background-position: center;
    padding: 0px 15px;
    border-style: none;
    border-radius: 6px;
    user-select: none;
    font-style: normal;
    text-align: center;
    outline: none;
    line-height: 34px;
    display: inline-block;
    cursor: pointer;
    box-sizing: border-box;
    vertical-align: top;
    -webkit-appearance: none !important;
    font-weight: 600;
    transition: background 0.8s;
    overflow: hidden;
    height: 34px;
}
    .navPopup .AlertsClear:hover::before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='rgb(130, 88, 248)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cpolyline points='3 6 5 6 21 6'%3E%3C/polyline%3E%3Cpath d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'%3E%3C/path%3E%3Cline x1='10' y1='11' x2='10' y2='17'%3E%3C/line%3E%3Cline x1='14' y1='11' x2='14' y2='17'%3E%3C/line%3E%3C/svg%3E");
}
    .resellButton:hover::before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='16' height='16' stroke='rgb(255, 255, 255)' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Ccircle cx='9' cy='21' r='1'%3E%3C/circle%3E%3Ccircle cx='20' cy='21' r='1'%3E%3C/circle%3E%3Cpath d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'%3E%3C/path%3E%3C/svg%3E");
}
    .chat2-sendMessage.lztng-zaclod.lztng-zaclod {
    position: absolute;
    font-weight: 600;
    line-height: 34px;
    outline: none;
    width: 22px;
    height: 38px;
    display: inline-block;
    right: 10px;
    border: none;
    background: url(data:image/svg+xml,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27><path fill=%27rgb%2891,51,132%29%27 d=%27M4.7 15.8c-.7 1.9-1.1 3.2-1.3 3.9-.6 2.4-1 2.9 1.1 1.8 2.1-1.1 12-6.7 14.3-7.9 2.9-1.6 2.9-1.5-.2-3.2-2.3-1.4-12.2-6.8-14-7.9s-1.7-.6-1.2 1.8c.2.8.6 2.1 1.3 3.9.5 1.3 1.6 2.3 3 2.5l5.8 1.1c.1 0 .1.1.1.1s0 .1-.1.1l-5.8 1.1c-1.3.4-2.5 1.3-3 2.7z%27/></svg>) 50% no-repeat;
    cursor: pointer;
}
    input.textCtrl:focus, select.textCtrl:focus, textarea.textCtrl:focus, .select2-selection--multiple:has(input:focus), div.textCtrl:focus-within {
    box-shadow: 0 0 0px 2px rgb(56 56 57 / 51%);
}
    .text_Ads .discussionListItem.item .title {
    color: rgb(132, 105, 186);
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
}
    input[type="radio"]:before {
    background: rgb(109 65 161);
    position: absolute;
    top: 1px;
    left: 1px;
    -webkit-transform: scale(0);
    -ms-transform: scale(0);
    -webkit-transform: scale(0);
    -ms-transform: scale(0);
    transform: scale(0);
}
    #searchBar .primaryControls:before {
    color: rgb(145 109 189);
    display: inline-block;
    font-family: "Font Awesome 5 Pro";
    font-weight: 600;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: "\f002";
    float: left;
    margin-right: -36px;
    width: 36px;
    text-align: center;
    position: relative;
    line-height: 30px;
    font-size: 16px;
    pointer-events: none;
}
    .xenOverlay .formOverlay .heading {
    font-size: 16px;
    color: rgb(118, 77, 199);
    padding: 5px 10px;
    margin-bottom: 10px;
    border-radius: 0;
    font-weight: 600;
}
    .chosen-container.chosen-container-active {
    box-shadow: 0 0 0px 2px rgb(34 14 65);
}
    div.textCtrl:focus-within {
    box-shadow: 0 0 0px 2px rgb(34 14 65 / 30%);
}
    .xenOverlay .section .heading, .xenOverlay .sectionMain .heading, .xenOverlay .errorOverlay .heading {
    background: rgb(118 77 199);
    color: #f5f5f5;
    border-radius: 10px 10px 0 0;
    padding: 18px 60px 18px 20px;
    font-weight: normal;
}
    .forum_view .titleBar, .forum_list .titleBar {
    padding: 15px 20px;
    background: rgb(39 39 39 / 51%);
    border-radius: 10px 10px 0 0;
}
    .limitCounter>.backgroundCounter {
    position: absolute;
    width: 69%;
    background: rgb(118, 77, 199);
    border-radius: 25px;
    height: 35px;
}
    .messageList .message {
    background-color: rgb(39 39 39 / 51%);
    padding: 15px 20px;
    border-top: 1px solid rgb(45, 45, 45);
}
    .thread_view .titleBar {
    background: rgb(39 39 39 / 51%);
    padding: 15px 20px;
    border-radius: 10px;
    height: auto;
}
    .pageNavLinkGroup {
    border-radius: 0px 0px 0px 0px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    background-color: rgb(39 39 39 / 51%);
    padding: 9px 20px;
    border-bottom: 1px solid rgb(45, 45, 45);
    clear: both;
}
    .limitCounter>.backgroundCounter {
    position: absolute;
    width: 69%;
    background: rgb(118, 77, 199);
    border-radius: 25px;
    height: 35px;
}
    .nodeList .node.current > .nodeInfo > .nodeText > .nodeTitle > a, .nodeList .node .current>div>.nodeTitle>a {
    background: rgb(45, 45, 45);
    color: rgb(118, 77, 199);
    font-weight: 600;
}
    .node.current .ForumSearch:before, .ForumSearch_active:before {
    color: rgb(118, 77, 199);
}
    .hasUnreadArticles {
    border-radius: 50%;
    display: inline-block;
    background: rgb(118, 77, 199);
    width: 8px;
    height: 8px;
    margin-left: 4px;
}
    .forumSearchThreads--Link--Icon {
    border-radius: 6px;
    padding: 0 14px;
    background: rgb(206 107 255);
    color: rgb(255 255 255);
    line-height: 30px;
    height: 30px;
    display: inline-block;
    font-size: 14px;
}
    .nodeList .node.current > .nodeInfo > .nodeText > .nodeTitle > a, .nodeList .node .current>div>.nodeTitle>a {
    background: rgb(45, 45, 45);
    color: rgb(130, 88, 248);
    font-weight: 600;
    text-shadow: 1px 0px 7px rgb(130, 88, 248), 0px -2px 1px rgb(255 0 0 / 0%);
}
    .discussionList {
    padding: 15px 20px;
    background: rgb(39 39 39 / 53%);
}
.discussionListItem {
    background: rgb(39 39 39 / 0%);
}
    input[type="checkbox"]:checked:after {
    background-color: rgb(131, 88, 202);
    border-color: rgb(131, 88, 202);
}
    .monthMaecenas .donationAmount {
    margin: 5px 0 0;
    font-weight: 600;
    font-size: 14px;
    color: rgb(149 115 247);
}
    .nodeList .node.current > .nodeInfo > .nodeText > .nodeTitle > a, .nodeList .node .current>div>.nodeTitle>a {
    background: rgb(45, 45, 45);
    color: rgb(118, 77, 199);
    font-weight: 600;
}
    .navTabs .navLink .itemCount {
    padding: 1px 4px 1px 5px;
    border: 2px solid rgb(54, 54, 54);
    border-radius: 12px;
    color: #f5f5f5;
    font-size: 9px;
    height: 11px;
    line-height: 11px;
    min-width: 5px;
    top: 1px;
    left: 11px;
    background-color: rgb(118, 77, 199);
    text-align: center;
    position: absolute;
}
    .PageNav a.currentPage {
    color: #f5f5f5;
    background-color: rgb(118, 77, 199);
    position: relative;
}
    #pageDescription>a, #pageDescription>a>abbr {
    color: rgb(118, 77, 199);
}
    .limitCounter>.backgroundCounter {
    position: absolute;
    width: 69%;
    background: rgb(118, 77, 199);
    border-radius: 25px;
    height: 35px;
}
    .breadcrumb .crust:last-child a.crumb {
    color: rgb(118, 77, 199);
}
    .conversationItem .messageStateIcon {
    float: right;
    margin-right: 6px;
    color: rgb(118, 77, 199);
    font-size: 15px;
}
    .actionButton--sendMoney {
    display: inline-block;
    background-image: url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='%23f5f5f5' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cline x1='12' y1='1' x2='12' y2='23'/%3E%3Cpath d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'/%3E%3C/svg%3E);
    background-size: 18px 18px;
    width: 34px;
    height: 34px;
    background-repeat: no-repeat;
    background-color: rgb(118, 77, 199);
    border-radius: 6px;
    background-position: center;
    border-left: 1px solid rgb(18, 76, 50);
}
    .node585.node.current .nodeText .nodeTitle a::before, a.internalNodeLink.node585::before {
    background-image: url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M25 45C36.0456 45 45.0001 36.0457 45.0001 25.0001C45.0001 13.9544 36.0456 5.00001 25 5.00001C13.9543 5.00001 5 13.9544 5 25.0001C5 36.0457 13.9543 45 25 45ZM25 50C38.8071 50 50 38.8071 50 25.0001C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25.0001C0 38.8071 11.1929 50 25 50Z' fill='rgb(118, 77, 199)'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M22.8332 18.7517C22.1418 19.9469 20.6125 20.3553 19.4174 19.664C18.2222 18.9726 17.8138 17.4432 18.5052 16.2482C19.7982 14.0129 22.2211 12.4999 25.0002 12.4999C29.1424 12.4999 32.5003 15.8578 32.5003 20C32.5002 22.7443 30.8168 24.9849 28.7503 26.25C27.0903 27.266 28.1252 30 24.9938 30C23.613 30 22.4937 28.8806 22.4937 27.4999C22.4937 27.4121 22.4982 27.3254 22.507 27.2399C22.5764 25.9178 23.1659 24.842 23.8078 24.0598C24.4858 23.2336 25.377 22.5593 26.0586 22.154C29.8504 19.9 25.2257 15.2884 22.8332 18.7517ZM24.9938 32.5C23.613 32.5 22.4937 33.6192 22.4937 34.9999C22.4937 36.3807 23.613 37.4999 24.9938 37.4999C26.3744 37.4999 27.4937 36.3807 27.4937 34.9999C27.4937 33.6192 26.3744 32.5 24.9938 32.5Z' fill='rgb(118, 77, 199)'/%3E%3C/svg%3E%0A");
}
    .node421.node.current .nodeText .nodeTitle a::before {
    background-image: url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M5 9.09088C5 4.07014 9.07015 0 14.0909 0H33.0526C35.4636 0 37.776 0.957791 39.4809 2.66266L43.2465 6.42824C44.9513 8.13312 45.9091 10.4454 45.9091 12.8565V40.9091C45.9091 45.9299 41.839 50 36.8182 50H14.0909C9.07015 50 5 45.9299 5 40.9091V9.09088ZM41.3636 15.9091V40.9091C41.3636 43.4195 39.3286 45.4546 36.8182 45.4546H14.0909C11.5805 45.4546 9.54541 43.4195 9.54541 40.9091V9.09088C9.54541 6.58052 11.5805 4.54545 14.0909 4.54545H30V9.09088C30 12.8565 33.0526 15.9091 36.8182 15.9091H41.3636ZM41.1115 11.3636C40.8884 10.7219 40.522 10.132 40.0323 9.64241L36.2667 5.87679C35.7771 5.38716 35.1872 5.02078 34.5455 4.79759V9.09088C34.5455 10.3462 35.563 11.3636 36.8182 11.3636H41.1115Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M28.1827 23.1819C29.4379 23.1819 30.4555 24.1994 30.4555 25.4546C30.4555 26.7098 29.4379 27.7274 28.1827 27.7273H16.8191C15.5639 27.7273 14.5464 26.7098 14.5464 25.4546C14.5464 24.1994 15.5639 23.1819 16.8191 23.1819H28.1827Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M21.3646 14.0911C22.6198 14.0911 23.6374 15.1085 23.6374 16.3638C23.6374 17.619 22.6198 18.6365 21.3646 18.6365H16.8191C15.5639 18.6365 14.5464 17.619 14.5464 16.3638C14.5464 15.1085 15.5639 14.0911 16.8191 14.0911H21.3646Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M34.0918 34.5456C34.0918 33.2904 33.0744 32.2728 31.8191 32.2728H16.8191C15.5639 32.2728 14.5463 33.2904 14.5463 34.5456C14.5463 35.8007 15.5639 36.8183 16.8191 36.8183H31.8191C33.0744 36.8183 34.0918 35.8007 34.0918 34.5456Z' fill='rgb(118, 77, 199)'/%3E%3C/svg%3E%0A");
}
    .actionButton--sendMoney:hover {
    background-color: rgb(118, 77, 199)
}
    .mainc {
    color: rgb(149 115 247);
}
    .node435.node.current .nodeText .nodeTitle a::before {
    background-image: url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_33_106)'%3E%3Cpath d='M38.8911 15.8911V34.1089C38.8911 36.4675 38.8901 38.1423 38.8075 39.4626C38.7259 40.7666 38.5703 41.587 38.3218 42.2472C37.421 44.6408 35.5319 46.5299 33.1383 47.4307C32.4781 47.6792 31.6577 47.8348 30.3537 47.9164C29.0334 47.999 27.3586 48 25 48C22.6414 48 20.9666 47.999 19.6463 47.9164C18.3423 47.8348 17.5219 47.6792 16.8617 47.4307C14.4681 46.5299 12.579 44.6408 11.6782 42.2472C11.4297 41.587 11.2741 40.7666 11.1925 39.4626C11.1099 38.1423 11.1089 36.4675 11.1089 34.1089V15.8911C11.1089 13.5325 11.1099 11.8576 11.1925 10.5374C11.2741 9.23341 11.4297 8.41293 11.6782 7.75279C12.579 5.35917 14.4681 3.47012 16.8617 2.56923C17.5219 2.32078 18.3423 2.16519 19.6463 2.08358C20.9666 2.00093 22.6414 2 25 2C27.3586 2 29.0334 2.00093 30.3537 2.08358C31.6577 2.16519 32.4781 2.32078 33.1383 2.56923C35.5319 3.47012 37.421 5.35917 38.3218 7.75279C38.5703 8.41293 38.7259 9.23341 38.8075 10.5374C38.8901 11.8576 38.8911 13.5325 38.8911 15.8911Z' stroke='rgb(118, 77, 199)' stroke-width='4.09901'/%3E%3Cpath d='M20.4476 40.9409H29.5565' stroke='rgb(118, 77, 199)' stroke-width='4.09901' stroke-linecap='round'/%3E%3Cpath d='M26.1567 7.92072H23.8438C21.7757 7.92072 20.7417 7.92072 19.9975 7.33401C19.2533 6.74728 19.012 5.74181 18.5293 3.73085L18.1686 2.22766H25.0003H31.8319L31.4711 3.73085C30.9886 5.74181 30.7472 6.74728 30.003 7.33401C29.2589 7.92072 28.2248 7.92072 26.1567 7.92072Z' fill='rgb(118, 77, 199)'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_33_106'%3E%3Crect width='50' height='50' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
}
    .node86.node.current .nodeText .nodeTitle a::before {
    background: url("data:image/svg+xml,%3Csvg width='50' height='34' viewBox='0 0 50 34' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M41.6452 4.47746H8.84398C6.57953 4.47746 4.74383 6.31316 4.74383 8.57766V24.9783C4.74383 27.2427 6.57953 29.0784 8.84399 29.0784H41.6452C43.9097 29.0784 45.7454 27.2427 45.7454 24.9783V8.57766C45.7454 6.31316 43.9097 4.47746 41.6452 4.47746ZM8.84398 0.377319C4.31508 0.377319 0.643677 4.04876 0.643677 8.57766V24.9783C0.643677 29.5072 4.31508 33.1786 8.84399 33.1786H41.6452C46.1741 33.1786 49.8455 29.5072 49.8455 24.9783V8.57766C49.8455 4.04876 46.1741 0.377319 41.6452 0.377319H8.84398Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M33.4449 12.6779C33.4449 11.5456 34.3628 10.6278 35.495 10.6278H39.5951C40.7274 10.6278 41.6452 11.5456 41.6452 12.6779C41.6452 13.8101 40.7274 14.7279 39.5951 14.7279H35.495C34.3628 14.7279 33.4449 13.8101 33.4449 12.6779Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M8.84399 20.8781C8.84399 19.7458 9.76184 18.828 10.8941 18.828C12.0263 18.828 12.9441 19.7458 12.9441 20.8781C12.9441 22.0103 12.0263 22.9281 10.8941 22.9281C9.76184 22.9281 8.84399 22.0103 8.84399 20.8781Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M17.0443 20.8781C17.0443 19.7458 17.9622 18.828 19.0944 18.828H31.3948C32.5271 18.828 33.4449 19.7458 33.4449 20.8781C33.4449 22.0103 32.5271 22.9281 31.3948 22.9281H19.0944C17.9622 22.9281 17.0443 22.0103 17.0443 20.8781Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M39.5951 18.828C38.4629 18.828 37.5451 19.7458 37.5451 20.8781C37.5451 22.0103 38.4629 22.9281 39.5951 22.9281C40.7274 22.9281 41.6452 22.0103 41.6452 20.8781C41.6452 19.7458 40.7274 18.828 39.5951 18.828Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M27.2947 10.6278C26.1625 10.6278 25.2446 11.5456 25.2446 12.6779C25.2446 13.8101 26.1625 14.7279 27.2947 14.7279C28.4269 14.7279 29.3448 13.8101 29.3448 12.6779C29.3448 11.5456 28.4269 10.6278 27.2947 10.6278Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M17.0443 12.6779C17.0443 11.5456 17.9622 10.6278 19.0944 10.6278C20.2266 10.6278 21.1445 11.5456 21.1445 12.6779C21.1445 13.8101 20.2266 14.7279 19.0944 14.7279C17.9622 14.7279 17.0443 13.8101 17.0443 12.6779Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M10.8941 10.6278C9.76184 10.6278 8.84399 11.5456 8.84399 12.6779C8.84399 13.8101 9.76184 14.7279 10.8941 14.7279C12.0263 14.7279 12.9441 13.8101 12.9441 12.6779C12.9441 11.5456 12.0263 10.6278 10.8941 10.6278Z' fill='rgb(118, 77, 199)'/%3E%3C/svg%3E%0A") 50% no-repeat;
    background-size: 100%;
}
    .node88.node.current .nodeText .nodeTitle a::before {
    background: url("data:image/svg+xml,%3Csvg width='39' height='50' viewBox='0 0 39 50' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 30.7622V28.4382C36 23.066 33.2152 17.4153 29.463 12.5469C26.1524 8.25129 22.2891 4.82429 19.4999 3C16.7109 4.82429 12.8475 8.25129 9.53684 12.5469C5.78466 17.4153 3 23.066 3 28.4382V30.7622C3 39.8749 10.3873 47.2621 19.4999 47.2621C28.6126 47.2621 36 39.8749 36 30.7622Z' stroke='rgb(130, 88, 248)' stroke-width='4.1831'/%3E%3Cpath d='M31.1205 28.4384V30.7624C31.1205 35.2438 28.5835 39.1327 24.8675 41.0712C23.0804 42.0034 22.1869 42.4695 20.8438 41.6553C19.5007 40.8411 19.5007 39.4956 19.5007 36.8046V19.6978C19.5007 15.6478 19.5007 13.6229 21.4147 12.9905C23.3286 12.3582 24.3953 13.7965 26.5289 16.673C29.0578 20.0826 31.1205 24.2811 31.1205 28.4384Z' fill='rgb(130, 88, 248)'/%3E%3C/svg%3E%0A") 50% no-repeat;
    background-size: 82%;
}
    .node4.node.current .nodeText .nodeTitle a::before {
    background: url("data:image/svg+xml,%3Csvg width='50' height='41' viewBox='0 0 50 41' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M26.5737 8.90245C25.6942 9.74632 24.3058 9.74632 23.4264 8.90245L21.8528 7.3923C20.0109 5.62474 17.5226 4.54551 14.7728 4.54551C9.12433 4.54551 4.54547 9.12439 4.54547 14.7727C4.54547 20.1878 7.47679 24.6592 11.7086 28.3331C15.9439 32.0101 21.0077 34.4487 24.0333 35.6934C24.6659 35.9536 25.3342 35.9536 25.9667 35.6934C28.9923 34.4487 34.0561 32.0101 38.2915 28.3331C42.5232 24.6592 45.4546 20.1878 45.4546 14.7727C45.4546 9.12439 40.8757 4.54551 35.2273 4.54551C32.4775 4.54551 29.9892 5.62474 28.1473 7.3923L26.5737 8.90245ZM25 4.11271C22.3457 1.56546 18.7421 0 14.7728 0C6.61398 0 0 6.61395 0 14.7727C0 29.246 15.8417 37.2387 22.3041 39.8971C24.0445 40.6129 25.9555 40.6129 27.6959 39.897C34.1583 37.2387 50 29.246 50 14.7727C50 6.61395 43.3861 0 35.2273 0C31.258 0 27.6544 1.56546 25 4.11271Z' fill='rgb(130, 88, 248)'/%3E%3C/svg%3E%0A") 50% no-repeat;
    background-size: 100%;
}
    .node85.node.current .nodeText .nodeTitle a::before {
    background-image: url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_33_94)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M35.0001 12.4999H15C13.6193 12.4999 12.5001 13.6193 12.5001 15V34.9999C12.5001 36.3806 13.6193 37.5 15 37.5H35.0001C36.3808 37.5 37.5 36.3806 37.5 34.9999V15C37.5 13.6193 36.3808 12.4999 35.0001 12.4999ZM15 7.5C10.8579 7.5 7.5 10.8578 7.5 15V34.9999C7.5 39.1421 10.8579 42.4999 15 42.4999H35.0001C39.1421 42.4999 42.5 39.1421 42.5 34.9999V15C42.5 10.8578 39.1421 7.5 35.0001 7.5H15Z' fill='rgb(118, 77, 199)'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M22.5001 22.4999V27.4999H27.5V22.4999H22.5001ZM20 17.4999C18.6193 17.4999 17.5 18.6192 17.5 19.9999V29.9999C17.5 31.3806 18.6193 32.4999 20 32.4999H30C31.3807 32.4999 32.5001 31.3806 32.5001 29.9999V19.9999C32.5001 18.6192 31.3807 17.4999 30 17.4999H20Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M17.5 0C16.1193 0 14.9999 1.11929 14.9999 2.49999V7.50003H20V2.49999C20 1.11929 18.8806 0 17.5 0Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M20 47.4999V42.5H14.9999V47.4999C14.9999 48.8806 16.1193 50 17.5 50C18.8806 50 20 48.8806 20 47.4999Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M30.0001 2.49999C30.0001 1.11929 31.1193 0 32.5001 0C33.8808 0 35 1.11929 35 2.49999V7.50003H30.0001V2.49999Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M35 47.4999V42.5H30.0001V47.4999C30.0001 48.8806 31.1193 50 32.5001 50C33.8808 50 35 48.8806 35 47.4999Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M47.4999 15C48.8807 15 50 16.1193 50 17.5C50 18.8807 48.8807 20.0001 47.4999 20.0001H42.5V15H47.4999Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M2.5 20.0001H7.5V15H2.5C1.11929 15 0 16.1193 0 17.5C0 18.8807 1.11929 20.0001 2.5 20.0001Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M47.4999 30C48.8807 30 50 31.1192 50 32.4999C50 33.8807 48.8807 34.9999 47.4999 34.9999H42.5V30H47.4999Z' fill='rgb(118, 77, 199)'/%3E%3Cpath d='M2.5 34.9999H7.5V30H2.5C1.11929 30 0 31.1192 0 32.4999C0 33.8807 1.11929 34.9999 2.5 34.9999Z' fill='rgb(118, 77, 199)'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_33_94'%3E%3Crect width='50' height='50' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
}
    .node8.node.current .nodeText .nodeTitle a::before, a.internalNodeLink.node8::before {
    background-image: url("data:image/svg+xml,%3Csvg width='42' height='51' viewBox='0 0 42 51' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 48.934C0 47.6575 1.0348 46.6228 2.31129 46.6228H39.2921C40.5686 46.6228 41.6034 47.6575 41.6034 48.934C41.6034 50.2106 40.5686 51.2453 39.2921 51.2453H2.3113C1.0348 51.2453 0 50.2106 0 48.934Z' fill='rgb(118, 77, 199)'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M31.6812 5.29956C30.7786 4.39695 29.3152 4.39695 28.4126 5.29956L26.3818 7.33039L34.6696 15.6182L36.7004 13.5874C37.603 12.6848 37.603 11.2213 36.7004 10.3187L31.6812 5.29956ZM9.047 24.6651L23.1131 10.5991L31.401 18.8869L17.3348 32.953L9.047 24.6651ZM5.77827 27.9339L4.62255 29.0896V37.3774H12.9105L14.0662 36.2216L5.77827 27.9339ZM25.1439 2.0309C27.8517 -0.676966 32.242 -0.676966 34.95 2.0309L39.9691 7.05006C42.677 9.75791 42.677 14.1482 39.969 16.856L16.1791 40.6461C15.3122 41.513 14.1364 42 12.9105 42H4.62255C2.06961 42 0 39.9304 0 37.3774V29.0896C0 27.8635 0.487024 26.6877 1.35392 25.8208L25.1439 2.0309Z' fill='rgb(118, 77, 199)'/%3E%3C/svg%3E%0A");
}
    .node587.node.current .nodeText .nodeTitle a::before {
    background-image: url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_33_111)'%3E%3Cpath d='M17.5001 40H22.5001V44.9999H27.5V40H32.5001V44.9999H35.0001C36.3808 44.9999 37.5 46.1193 37.5 47.5C37.5 48.8806 36.3808 50 35.0001 50H15C13.6193 50 12.5001 48.8806 12.5001 47.5C12.5001 46.1193 13.6193 44.9999 15 44.9999H17.5001V40Z' fill='rgb(118, 77, 199)'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M4.99999 10V30C4.99999 32.7614 7.23858 35 9.99994 35H40C42.7614 35 45 32.7614 45 30V10C45 7.23857 42.7614 5.00001 40 5.00001H9.99994C7.23858 5.00001 4.99999 7.23857 4.99999 10ZM0 30C0 35.5229 4.47715 40 9.99994 40H40C45.5229 40 50 35.5229 50 30V10C50 4.47716 45.5229 0 40 0L9.99994 1.22112e-05C4.47715 1.22112e-05 0 4.47716 0 10V30Z' fill='rgb(118, 77, 199)'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_33_111'%3E%3Crect width='50' height='50' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
}
    .node974.node.current .nodeText .nodeTitle a::before, a.internalNodeLink.node974::before {
    background-image: url("data:image/svg+xml,%3Csvg fill='rgb(118, 77, 199)' width='800px' height='800px' viewBox='0 0 24 24' role='img' xmlns='http://www.w3.org/2000/svg'%3E%3Ctitle%3EOpenAI icon%3C/title%3E%3Cpath d='M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z'/%3E%3C/svg%3E");
}    .actionButton--sendMoney {
    display: inline-block;
    background-image: url(data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='%23f5f5f5' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round' class='css-i6dzq1'%3E%3Cline x1='12' y1='1' x2='12' y2='23'/%3E%3Cpath d='M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6'/%3E%3C/svg%3E);
    background-size: 18px 18px;
    width: 34px;
    height: 34px;
    background-repeat: no-repeat;
    background-color: rgb(118, 77, 199);
    border-radius: 6px;
    background-position: center;
    border-left: 1px solid rgb(18, 76, 50);
    .navTabs .navLink .itemCount {
    padding: 1px 4px 1px 5px;
    border: 2px solid rgb(54, 54, 54);
    border-radius: 12px;
    color: #f5f5f5;
    font-size: 9px;
    height: 11px;
    line-height: 11px;
    min-width: 5px;
    top: 1px;
    left: 11px;
    background-color: rgb(118, 77, 199);
    text-align: center;
    position: absolute;
    `;
    document.head.appendChild(style);
})();

