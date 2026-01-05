// ==UserScript==
// @name					Ola
// @namespace				iu9girls
// @description				Add Search Image context menu
// @author					iu9girls
// @license					GPL
// @include					*
// @version					0.0.1
// @icon					http://lkytal.qiniudn.com/ic.ico
// @grant					GM_openInTab
// @homepageURL				https://git.oschina.net/coldfire/GM
// @downloadURL https://update.greasyfork.org/scripts/13529/Ola.user.js
// @updateURL https://update.greasyfork.org/scripts/13529/Ola.meta.js
// ==/UserScript==

if (!("contextMenu" in document.documentElement && "HTMLMenuItemElement" in window)) return;

var body = document.body;
body.addEventListener("contextmenu", initMenu, false);

var menu = body.appendChild(document.createElement("menu"));
menu.outerHTML = '<menu id="userscript-search-by-image" type="context">\
					<menuitem id="DownloadOla" label="Down Ola"></menuitem>\
				</menu>';
document.querySelector("#DownloadOla").addEventListener("click", downola, false);

function initMenu(aEvent)
{
	// Executed when user right click on web page body
	// aEvent.target is the element you right click on
	var node = aEvent.target;
	var item = document.querySelectorAll("#userscript-search-by-image menuitem");

	if (node.localName == "img")
	{
		body.setAttribute("contextmenu", "userscript-search-by-image");

		for (var i = item.length - 1; i > -1; i--)
		{
			item[i].setAttribute("imageURL", node.src);
		}
	}
	else
	{
		body.removeAttribute("contextmenu");
		//item.removeAttribute("imageURL");
	}
}

function addParamsToForm(aForm, aKey, aValue)
{
	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", aKey);
	hiddenField.setAttribute("value", aValue);
	aForm.appendChild(hiddenField);
}

function searchImage(aEvent)
{
	// Executed when user click on menuitem
  // aEvent.target is the <menuitem> element
  /*var imageURL = aEvent.target.getAttribute("imageURL");
  if (imageURL.indexOf("data:") == 0) {
    var base64Offset = imageURL.indexOf(",");
    if (base64Offset != -1) {
      var inlineImage = imageURL.substring(base64Offset + 1)
                                 .replace(/\+/g, "-")
                                 .replace(/\//g, "_")
                                 .replace(/\./g, "=");

      var form = document.createElement("form");
      form.setAttribute("method", "POST");
      form.setAttribute("action", "//www.google.com/searchbyimage/upload");
      form.setAttribute("enctype", "multipart/form-data");
      form.setAttribute("target", "_blank");
      addParamsToForm(form, "image_content", inlineImage);
      addParamsToForm(form, "filename", "");
      addParamsToForm(form, "image_url", "");
      body.appendChild(form);
      form.submit();
    }
  } else {
    GM_openInTab("https://www.google.com/searchbyimage?image_url=" +
                 encodeURIComponent(imageURL));
  }*/
}

function search_baidu(aEvent)
{
	var imageURL = aEvent.target.getAttribute("imageURL");

	GM_openInTab("http://stu.baidu.com/i?objurl=" + encodeURIComponent(imageURL) + "&filename=&rt=0&rn=10&ftn=searchstu&ct=1&stt=0&tn=shituresult");
}

function downola(aEvent)
{
	// Executed when user click on menuitem
	// aEvent.target is the <menuitem> element
	var imageURL = aEvent.target.getAttribute("imageURL");
    var pic = imageURL.split('&w=');
	var full = pic[0];
	GM_openInTab(full);
	//insertLocation.html(insertLocation.html() + full);
	    //alert('imageURL ko co'+full);
	/*function saveImageAs (full) {
    if (typeof full == 'object')
      full = full.src;
    window.win = open (full);
    //setTimeout('win.document.execCommand("SaveAs")', 500);
    }*/

}