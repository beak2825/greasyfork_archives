// ==UserScript==
// @name          Custom_GS_Lightning
// @namespace     https://greasyfork.org/en/scripts/421993-custom-gs-lightning
// @description	  Changes the GS Lightning interface slightly
// @author        VatzU
// @include       https://*force.com/*
// @grant   	  none
// @version       1.4
// @downloadURL https://update.greasyfork.org/scripts/421993/Custom_GS_Lightning.user.js
// @updateURL https://update.greasyfork.org/scripts/421993/Custom_GS_Lightning.meta.js
// ==/UserScript==


( new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
    // code//-------------find the fields
    var aTags = document.getElementsByTagName("span");
    //define fields for which to enable copy to clipboard
    var searchText = ["Case Number", "Entitlement Account Number", "Contact Phone", "Preferred Phone Number"];
    var found;

    for (var i = 0; i < aTags.length; i++) {
        if (searchText.includes(aTags[i].textContent) && aTags[i].parentNode.nextSibling.firstChild.lastChild.tagName != "BUTTON") {
            found = aTags[i];
            //break;
//            alert("iter: " + aTags[i].parentNode.nextSibling.firstChild.lastChild.tagName);
//           observer.disconnect();

            var butt = document.createElement('button');
            butt.setAttribute("class","ctc");
            butt.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"></path>  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"></path></svg>';
            found.parentNode.nextSibling.firstChild.appendChild(butt);

            butt.addEventListener("click", function(){
                var str = this.previousSibling.innerText;
                const el = document.createElement('textarea');
                el.value = str;
                el.setAttribute('readonly', '');
                el.style.position = 'absolute';
                el.style.left = '-9999px';
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
//                alert("copied " + this.previousSibling.innerText);
            });
        }
    }
//------------------OLD EMAIL COMPOSER and RICH TEXT FIELDS RESIZER---------------------
    var resize_el = document.getElementById("cke_editor");
    if (resize_el != null) {
        if(resize_el.lastChild.id != 'resize_line') {
            var m_pos;

            const line = document.createElement('div');
            line.setAttribute('id','resize_line');
            var resize_line = resize_el.appendChild(line);
            function resize(e){
                //finding the node to resize
                var parent = resize_line.previousSibling.childNodes[1];
                //iframe node needs to resize along
                var parent2 = window.frameElement;
                var dy = m_pos - e.clientY;
                m_pos = e.clientY;
                parent.style.height = (parseInt(getComputedStyle(parent, '').height) - dy) + "px";
                parent2.style.height = (parseInt(getComputedStyle(parent2, '').height) - dy) + "px";
            }
            resize_line.addEventListener("mousedown", function(e){
                m_pos = e.clientY;
                //quieting down the iframe listeners
                resize_line.previousSibling.childNodes[1].childNodes[1].setAttribute('style','pointer-events: none;height:100%;width:100%;');
                document.addEventListener("mousemove", resize, false);
                document.addEventListener("mouseup", function(){
                    document.removeEventListener("mousemove", resize, false);
                    resize_line.previousSibling.childNodes[1].childNodes[1].setAttribute('style','pointer-events: all;height:100%;width:100%;');
                }, false);
            }, false);
        }
    }

//------------------NEW EMAIL COMPOSER RESIZER---------------------
    var resize_email = document.getElementsByClassName("tox tox-tinymce")[0];
    if (resize_email != null) {
        if(resize_email.lastChild.id != 'resize_line_e') {
            var mo_pos;

            const line = document.createElement('div');
            line.setAttribute('id','resize_line_e');
            var resize_line_e = resize_email.appendChild(line);
            function resize(e){
                var parent = resize_line_e.parentNode;
                var dy = mo_pos - e.clientY;
                mo_pos = e.clientY;
                parent.style.height = (parseInt(getComputedStyle(parent, '').height) - dy) + "px";
            }
            resize_line_e.addEventListener("mousedown", function(e){
                mo_pos = e.clientY;
                resize_line_e.parentNode.childNodes[0].childNodes[1].childNodes[0].childNodes[0].setAttribute('style','pointer-events: none;height:100%;width:100%;');
                document.addEventListener("mousemove", resize, false);
                document.addEventListener("mouseup", function(){
                    document.removeEventListener("mousemove", resize, false);
                    resize_line_e.parentNode.childNodes[0].childNodes[1].childNodes[0].childNodes[0].setAttribute('style','pointer-events: all;height:100%;width:100%;');
                }, false);
            }, false);
        }
    }
    //---------------------EXPAND ALL IN FEED --------------------------
    var Sections = document.getElementsByClassName("scrollable slds-scrollable_y uiScrollerWrapper");
    var scrollTop = Sections[1].offsetTop;
    var ButTags = document.getElementsByClassName("slds-p-horizontal--medium slds-p-vertical--x-small slds-grid cuf-showMoreComments showMoreComments-top");
    for (var z = 0; z < ButTags.length; z++) {
        if (ButTags[z].children[0].shadowRoot.children[0].shadowRoot.childNodes[0].shadowRoot.childNodes[0].textContent == "More comments") {
            ButTags[z].children[0].shadowRoot.children[0].shadowRoot.childNodes[0].shadowRoot.childNodes[0].click();
            Sections[1].scrollTop = scrollTop;
        }
    }
    var aaTags = document.getElementsByTagName("a");
    for (z = 0; z < aaTags.length; z++) {
        if (aaTags[z].textContent == "Expand Post") {
            aaTags[z].click();
            Sections[1].scrollTop = scrollTop;
        }
    }


}






(function(){

	var css = '';
	var txt = '';
	var mo_timeout;
	var pbHead = document.getElementsByClassName('pbSubheader');
	
//--------bigger emial editor--------
    css+="[title='CK Editor Container'] {height:750px ; min-height:255px;}";
    css+="[id='cke_1_contents'] {height:672px ;min-height:197px}"
//-------------copy-to-clipboard button
    css+=".ctc {background-color: Transparent;    background-repeat:no-repeat;    border: none;    cursor:pointer;    overflow: hidden;    outline:none;}";
//-------------bigger post editor
   // css+=".forceChatterBasePublisher.forceChatterTextPostDesktop .activeState .lightningInputRichText {max-height: 30rem;}";
   // css+=".slds-rich-text-area__content {max-height:27rem;}";
//---------------- bigger richt text
    //css+="[id='cke_1_contents'] {    height: 750px !important;}";
 //----------resize items-----
    css+="#resize_line {    background-color: #ccc;       width: 100%;    height: 6px;    cursor: s-resize;}";
    css+="#resize_line_e {    background-color: #ccc;       width: 100%;    height: 6px;    cursor: s-resize;}";





	if(typeof GM_addStyle != "undefined") {
		GM_addStyle(css);
	}else if(typeof PRO_addStyle != "undefined") {
		PRO_addStyle(css);
	}else if(typeof addStyle != "undefined") {
		addStyle(css);
	}else{
		var heads = document.getElementsByTagName("head");
		if (heads.length > 0) {
			var node = document.createElement("style");
			node.type = "text/css";
			node.appendChild(document.createTextNode(css));
			heads[0].appendChild(node); 

		}
	}
		
	
})();