// ==UserScript==
// @name     Mobile to Desktop Gmail
// @namespace https://abacasonline.com
// @license  MIT
// @include  https://mail.google.com/mail/mu/mp/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @version     1.0
// @icon https://ssl.gstatic.com/ui/v1/icons/mail/images/favicon5.ico
// @author      AbacasOnline
// @description makes mobile gmail desktop kinda
// @downloadURL https://update.greasyfork.org/scripts/501540/Mobile%20to%20Desktop%20Gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/501540/Mobile%20to%20Desktop%20Gmail.meta.js
// ==/UserScript==
//--- The @grant directive is used to restore the proper sandbox.

//remove loading screen
var element = document.getElementById("apploadingdiv");
element.parentNode.removeChild(element);

var element = document.getElementById("sdppromo");
element.parentNode.removeChild(element);

var element = document.getElementById("viewsloadingdiv");
element.parentNode.removeChild(element);

//add required styles
document.head.innerHTML += `
<style>
body {
    background-color:white;
}

.OM62re {
    background:lightgrey;
    height: calc(100vh - 110px);
    overflow-y: auto; /* relevant part */
}

.lNFyP img {
    margin-top:-52px;
}

.rR7YN {
    padding: 11px 0 17px 0;
    width:calc(100vw - 600px);
    margin:auto;
    border:1px solid gray;
}

.I2nW4d {
    min-height: 400px;
    padding: 6px;
}

#tl_, .q0ceu, .wwdYBe {
    background:#0000;

}



#views {
    margin:auto;

}

#header {
    display:block;
    position: relative;
    max-height:42px
    top: 0;
    box-shadow: 1px 1px 16px #0006;
}

.QFYg4 {
    display:block;
    position: relative;
    max-height:42px
    top: 0;
    box-shadow: 1px 1px 16px #0006;
}

#tl_ {
    width:calc(100vw - 300px);
    padding-left:220px;
    height: calc(100vh - 44px);
    overflow-y: auto; /* relevant part */
    background:none;
}

.Atp2Qd {
    width:800px;
    margin:auto;
}

.VDvclb {
    background:none;
}

.LuRb0e {
    padding-left:190px;
}

.th5Fjd, .gtMPIf {
    display:block;
    position:static;
}

.aLzX3d {
    display:flex;
    width:120px;
}

.CqrfPb, .UgTiZc, .DxbtB {
    padding: 11px 11px 17px 300px;
}

.sidebar {
    width:190px;
    height:calc(100vh - 45px);
    float:left;
    background:#ededed;
    position:absolute;
    z-index:1;
    border-right:1px solid grey;
}

.sidebar a {
    display: flex;
    max-width:190px;
    background:linear-gradient(to bottom, white, #eeeeee);
    padding:6px 12px;
    margin:6px;
    font-size:18px;
    color: #666;
    box-shadow:1px 1px 4px black;
}

.sidebar a:hover {
    background:white;
    box-shadow:1px 1px 6px #000a;
}

.sidebar a:active, a:focus {
    background:linear-gradient(to bottom, grey, lightgrey);
    box-shadow:1px 1px 3px black;
}

h2 {
    color:#666;
    text-align:center;
}

.spacer {
    height:20px;
}

.ksQvef {
    max-width:100%;
    margin:5px;
    background:linear-gradient(to bottom, white, #eeeeee);
    border:1px solid lightgrey;
}

.SwrrMc {
    margin: 0 12px 12px 12px;
    border:1px solid gray;
    background:linear-gradient(to bottom, lightgrey 0%, white 10%, white 100%);
}

.lYsjW {
    margin: 0 12px;
    border:1px solid gray;
    background:linear-gradient(to bottom, grey 0%, white 2%, white 100%);
}
</style>
`;

//build custom navigation sidebar
  var elements = document.querySelectorAll('.ctjNef');

  if (elements.length) {
    elements[0].id = 'header';
  }

let div = document.getElementById('header');
div.insertAdjacentHTML('afterend', `
<div class="sidebar">
  <a href="https://mail.google.com/mail/mu/mp/749/#tl/Inbox" style="margin-top: 32px;">Inbox</a>
  <a href="https://mail.google.com/mail/mu/mp/749/#tl/Starred">Starred</a>
  <a href="https://mail.google.com/mail/mu/mp/749/#tl/Sent%20Mail">Sent Mail</a>
  <a href="https://mail.google.com/mail/mu/mp/749/#tl/Drafts">Drafts</a>
  <div class="spacer"></div>
  <a href="https://mail.google.com/mail/mu/mp/749/#tl/Important">Important</a>
  <a href="https://mail.google.com/mail/mu/mp/749/#tl/All%20Mail">All Mail</a>
  <a href="https://mail.google.com/mail/mu/mp/749/#tl/Trash">Trash</a>
  <a href="https://mail.google.com/mail/mu/mp/749/#tl/Spam">Spam</a>
</div>
`);

//add compose heading to compose page
  var compose = document.querySelectorAll('.rR7YN');

  if (compose.length) {
    compose[0].id = 'compose';
  }

let heading = document.getElementById('compose');
heading.insertAdjacentHTML('afterbegin', `
<h2>Compose Email:</h2>
`);