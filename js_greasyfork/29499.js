// ==UserScript==
// @name          Adfree Gelbooru
// @namespace     MB48
// @description	  Cleans a popular anime image catalogue website off all current ads and visual disturbances.
// @author        MB48
// @homepage      https://userstyles.org/styles/141949
// @run-at        document-start
// @version       1.0.2
// @include     http://gelbooru.com/*
// @include     http://youhate.us/*
// @include     https://gelbooru.com/*
// @include     https://youhate.us/*
// @downloadURL https://update.greasyfork.org/scripts/29499/Adfree%20Gelbooru.user.js
// @updateURL https://update.greasyfork.org/scripts/29499/Adfree%20Gelbooru.meta.js
// ==/UserScript==
(function() {var css = "";
if (false || (new RegExp("^(http|https)://(gelbooru|youhate).(com|us)/.*$")).test(document.location.href))
	css += [
		"#tup, #nup, ins, iframe, .noticeError, .alert{",
		"    display: none!important;",
		"  }",
		"   #paginater > :not(.pagination){",
		"     display: none;",
		"  }",
		"  ",
		"  a > .content{",
		"    display: none!important;",
		"  }",
		"   .content > a{",
		"    display: none!important;",
		"  }",
		"  ",
		"  center > a{",
		"    display:none!important;",
		"  }",
		"  a[target=\"_blank\"]{",
		"    display: none!important;",
		"  }",
		"  .content{",
		"    margin-top: -10px!important;",
		"  }",
		"  .aContain, .hidden-sm{",
		"    display:none!important;",
		"  }",
		"  ",
		"  /*cosmetics*/",
		"  .pagination {",
		"    margin-bottom: 30px;",
		"  }",
		"  ",
		"  div#paginater {",
		"    font-size: 16px!important;",
		"  }",
		"  li.current-page a{",
		"    background: linear-gradient(#004FD5, #1974E5);",
		"    color: #fff;",
		"  }",
		"  ",
		"  #tag-list{",
		"    margin-top: 20px!important;",
		"  }"
	].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();