// ==UserScript==
// @name            howfile_DL
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @version			1.2
// @description     howfile分别指定高速通道
// @include         http://howfile.com/file/*
// @include         http://hf928.com/file/*
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/18038/howfile_DL.user.js
// @updateURL https://update.greasyfork.org/scripts/18038/howfile_DL.meta.js
// ==/UserScript==
(function () {
  	$('#downloadtable a:eq(1)').attr('href','http://dl2'+$('#downloadtable a:eq(1)').attr('href').slice($('#downloadtable a:eq(1)').attr('href').indexOf('.')));
    $('#downloadtable a:eq(2)').attr('href','http://dl12'+$('#downloadtable a:eq(2)').attr('href').slice($('#downloadtable a:eq(2)').attr('href').indexOf('.')));
  	$('#downloadtable a:eq(0)').attr('href','http://dl22'+$('#downloadtable a:eq(1)').attr('href').slice($('#downloadtable a:eq(1)').attr('href').indexOf('.')));
}) ();