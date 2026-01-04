// ==UserScript==
// @name 　　　Replace Full width bang to half width
// @name:zh-CN  　替换全角！到半角!
// @namespace https://github.com/fengkx/
// @match     https://duckduckgo.com/*
// @match     https://start.duckduckgo.com/*
// @version 0.1
// @description       Replace Full width bang！ to half width!
// @description:en    Replace Full width bang！ to half width!
// @description:zh    替换全角bang！到半角bang!
// @description:zh-CN 替换全角bang！到半角bang!
// @grant none
//@run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/376508/Replace%20Full%20width%20bang%20to%20half%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/376508/Replace%20Full%20width%20bang%20to%20half%20width.meta.js
// ==/UserScript==

var $input = document.getElementById('search_form_input_homepage') || document.getElementById('search_form_input') ;
$input && $input.addEventListener('input', function (e) {
    if($input.value.search(/^！/) === 0) {
      var start = $input.selectionStart;
      var end = $input.selectionEnd;
      this.value = this.value.replace(/^！/, '!');
      $input.selectionStart=start;
      $input.selectionEnd=end;
    }
	
})
