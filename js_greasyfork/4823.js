// ==UserScript==
// @name           carma.com.ua and autocarma.org comment form credentials autofill
// @namespace      http://userscripts.org/
// @description    automatically fills name andf email into comment form at carma.com.ua and autocarma.org
// @include        http://carma.com.ua/*
// @include        http://www.carma.com.ua/*
// @include        http://autocarma.org/*
// @include        http://www.autocarma.org/*
// @version 0.0.1.20140904105009
// @downloadURL https://update.greasyfork.org/scripts/4823/carmacomua%20and%20autocarmaorg%20comment%20form%20credentials%20autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/4823/carmacomua%20and%20autocarmaorg%20comment%20form%20credentials%20autofill.meta.js
// ==/UserScript==


function main() {
	var name = "Георгий";
	var email = "ford@yz.kiev.ua";

//	var isCommentForm = document.getElementById("_contacts");
//	if (isCommentForm) {
		var nameBox = document.getElementById("answer_name");
		if (nameBox) {
			nameBox.value = name;
		}

		var emailBox = document.getElementById("answer_email");
		if (emailBox) {
			emailBox.value = email;
		}

                document.getElementById("answer_body").focus();
                document.getElementById("answer_body").select();
//	}
}
main();
