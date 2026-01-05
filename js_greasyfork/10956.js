// ==UserScript==
// @name        Message Notify
// @namespace   PXgamer
// @description Flash for Message/Title Edit
// @include     *kat.cr/*
// @include     *kickass.to/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10956/Message%20Notify.user.js
// @updateURL https://update.greasyfork.org/scripts/10956/Message%20Notify.meta.js
// ==/UserScript==

$('#wrapper').before('<style> '+
'.chat-bar-new {'+
'    width: 100px;'+
'    height: 100px;'+
'    background-color: red;'+
'    -webkit-animation-name: example; /* Chrome, Safari, Opera */'+
'    -webkit-animation-duration: 4s; /* Chrome, Safari, Opera */'+
'    animation-name: example;'+
'    animation-duration: 2s;'+
'    animation-iteration-count: infinite;'+
'}'+
''+
'/* Chrome, Safari, Opera */'+
'@-webkit-keyframes example {'+
'    0%   {background-color: white;}'+
'    25%  {background-color: green;}'+
'    50%  {background-color: white;}'+
'    100% {background-color: green;}'+
'}'+
''+
'/* Standard syntax */'+
'@keyframes example {'+
'    0%   {background-color: white;}'+
'    25%  {background-color: green;}'+
'    50%  {background-color: white;}'+
'    100% {background-color: green;}'+
'}'+
'</style>');