window.addEventListener("load", convertMyLinks($('a[class*="spf-link"]')), false);
if(document.readyState == "complete"){
	convertMyLinks($('a[class*="spf-link"]'));
}

function convertMyLinks(elemArray) {
	for (i = 0; i < elemArray.length; i += 1) {
		$(elemArray[i]).attr("href", elemArray[i].href).removeAttr('data-sessionlink').removeAttr('rel').attr('class', $(elemArray[i]).attr('class').split(" spf-link ")[0]);
	}
}