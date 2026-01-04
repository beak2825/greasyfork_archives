// ==UserScript==
// @name     FB: Post Tools & Statistics
// @match    https://www.facebook.com/*
// @match    https://*.facebook.com/*
// @match    http://www.facebook.com/*
// @match    http://*.facebook.com/*
// @run-at   document-start
// @grant    GM_addStyle
// @author   JZersche & wOxxOm
// @require  https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @██require  https://momentjs.com/downloads/moment.min.js
// @███require  https://momentjs.com/downloads/moment-with-locales.min.js
// @████require  https://html2canvas.hertzen.com/dist/html2canvas.js
// @version 1.29
// @namespace https://greasyfork.org/users/95175
// @description Shows exact timestamps and post information on Facebook Posts.
// @downloadURL https://update.greasyfork.org/scripts/383114/FB%3A%20Post%20Tools%20%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/383114/FB%3A%20Post%20Tools%20%20Statistics.meta.js
// ==/UserScript==

var options = {
	weekday: 'long',
	year: 'numeric',
	month: 'numeric',
	day: '2-digit'
};

//GM_addStyle('');

// process the already loaded portion of the page if any
expandDates(document.querySelectorAll('abbr[data-utime]'));
RecentTimestamps(document.querySelectorAll('.q_1zif-zjsq'));
RecentPostURLs(document.querySelectorAll('.q_1zif-zjsq, ._5r69, ._6ks'));
ExternalURLs(document.querySelectorAll('._52c6'));
expandPostIDs(document.querySelectorAll('._5pcq'));
document.querySelectorAll('.hasCaption');
// process the stuff added from now on
setMutationHandler(document, 'abbr[data-utime]', expandDates);
setMutationHandler(document, '.q_1zif-zjsq', RecentTimestamps);
setMutationHandler(document, '.q_1zif-zjsq, ._5r69, ._6ks', RecentPostURLs);
setMutationHandler(document, '._52c6', ExternalURLs);
setMutationHandler(document, '._5pcq', expandPostIDs);
/*
html2canvas(document.querySelector('._3576')).then(canvas => {
    document.getElementsByClassName('s2img')[0].addEventListener('click', function(event) {node.insertAdjacentHTML('afterend', canvas.toDataURL());})
});
*/
setMutationHandler({
	target: document.querySelector('._3576'),
	selector: '.s2img',
	handler: nodes => nodes.forEach(node => { 	node.setAttribute("style", "color: red; border: 0px solid red;");
            var Wwidth = window.innerWidth;
            var Wheight = window.innerHeight;
            node.addEventListener('click', function (event) { /* Ends at Line 712 */
			    //node.closest('._5pcp._5lel').setAttribute("style", "font-size: 7px;line-height: 16px;");
			node.setAttribute("style", "color: #5550; border: 1px solid #0000; display:none;");
			node.nextSibling.setAttribute("style", "color: #00ff; border: 0px solid #00ff; display:inline-block;");

                //console.log(event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.className);
                //event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.setAttribute("style", "background:#222;");
			    //////var PageTitleColorPROMPT = '#fff';
            var PageTitleColorPROMPT = prompt('Enter the HTML Hex Color # the Page Title should be:','#fff');
			    /* Name of Page Color Change on Click */
			    /* Likes Information (Hide/Show) */
            var classCheck0 = event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.children;
                console.log('64var classCheck0 = '+event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.children.className);
            var classCheck1 = event.target.parentNode.children;
                console.log('66var classCheck1 = '+event.target.parentNode.children.className);
            var classCheck2 = event.target.parentNode;
                console.log('68var classCheck2 = '+event.target.parentNode.className);


                console.log('classCheck0: '+classCheck0.length+'\n'+'window.innerWidth: '+Wwidth);

        if (classCheck0.length >= 0 && Wwidth<=1440 && window.location.href.match(/(https:\/\/www\.facebook\.com\/(\w+)\/posts\/\d+)/))
        {
            console.log('Line 63 – initialize wWOffset variable');
            var wWOffset;
            if(window.innerWidth == 1440) {wWOffset = 401;} // Check if windows innerWidth is equal to 1440
            else if (window.innerWidth == 1402) {wWOffset = 441;} // Check if windows innerWidth is equal to 1402
            else if (window.innerWidth == 1255) {wWOffset = 312.5;} // Check if windows innerWidth is equal to 1255

            /* Unsupported Resolution Algorithm */ /* Compress this into unreadable confusion later */
            else
            {
            alert('Detected an.... innerWidth of '+window.innerWidth+'! Script hasn\'t been optmized for use with this resolution. Screenshot will be off center.');
            OffsetXs = prompt('Enter a number from 1 to 100 to shift the image to the right.(probably) (Screenshot Offset - Subtract X Axis).'); OffsetXs = OffsetXs*3;
            if (OffsetXs => 100) {wWOffset = window.innerWidth/3-79.0-0.0-OffsetXs;}

                if (OffsetXs <= 0) {
                    OffsetXp = prompt('Enter a number from 1 to 100 to shift the image to the left. (or right possibly) (Screenshot Offset - Add X Axis');
                    wWOffset = window.innerWidth/3-123.0-0.0-OffsetXs+OffsetXp;
                }

            }

        /* * * * * –> Styling */ console.log('URL is supported [Mode 0|1] —> Version. 1.30 :: ' + window.location.href);
        event.target.parentNode.setAttribute("style", "background:purple;");
        event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.setAttribute("style", "color: #fff; background: orange; display:block; border:0px solid #111!important;");
		event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.parentNode.setAttribute("style", "color: #fff; background: blue; display:block; border:0px solid #111!important;");
		event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:block; background:lime;");
		event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].childNodes[0].setAttribute("style", "border-bottom: 2px solid #0000;");
		event.target.closest('.u_1zif-yanm').children[0].children[0].children[1].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
        event.target.closest('.n_1zif-ycce.h_1zif-v9xd').setAttribute("style", "background:cyan;");
        //////////// <– End Styling

        if (document.querySelector('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1] !== undefined)
        {
            node.nextSibling.value = 'Archived Post [Mode: 0]';console.log('╜');console.log('Capture: Mode #0');
            document.querySelectorAll('.n_1zif-ycce.h_1zif-v9xd.clearfix').setAttribute('style','border:1px dashed #f0f');
            node.nextSibling.setAttribute('style','color:#f04;background:#11a0;border:1px solid #f04;text-align:left;:font-size:10px;margin-right:4px');
                        // Insert unnecessary bullshit    //document.querySelector('.s2img').parentNode.parentNode.nextSibling.nextSibling.firstChild.setAttribute('style','background-image: url(/rsrc.php/v3/yX/r/OvSbQLwa0TM.png);');
                        // Insert more unnecessary bullshit    //document.querySelector('.s2img').parentNode.parentNode.nextSibling.setAttribute('style','display:none;');
            event.target.parentNode.parentNode.nextSibling.nextSibling.firstChild.setAttribute('style','background-image: url(https://i.imgur.com/ZL0LHeL.png); background-size: 38px 16px; background-repeat: no-repeat; display: block; height: 20px; width: 43px; background-position: 0px 0px !important; top: -1px;margin-left:0px;');
                        // Hmm    //event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[2].children[0].children[0].children[0].children[2].setAttribute("style", "display:none;");
                        // Hmm    //event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[2].children[0].children[0].children[0].children[3].setAttribute("style", "display:none;");
            // Style Page Title //
                event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
                event.target.parentNode.parentNode.parentNode.parentNode.children[0].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
        } else {
            node.nextSibling.value = 'Archived Post [Mode: 1]';
            node.nextSibling.setAttribute('style','color:#f04;background:cyan;border:1px solid #f04;text-align:left;:font-size:10px;margin-right:4px;');
            console.log('Capture: Mode #1'); console.log('╜╜');
            }
                    var iCapture = event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.parentNode;
			        html2canvas(iCapture, {useCORS: true, backgroundColor: 'lime', logging: true, x: wWOffset, y: 425, width: 510}).then(canvas => {
			            var a = canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");
				        var iNameGen = Math.random().toString(36).substring(2, 15);
				        node.insertAdjacentHTML('afterend', '<span class="SaveAsImageFile"><a href="' + a + '" download="' + iNameGen + '.jpg">Save As Image File</a></span>');
				        node.insertAdjacentHTML('afterend', '<span class="ViewImage"><a href="' + a + '" target="_blank">View Image</a> / </span>');
				        node.insertAdjacentHTML('afterend', '<div class="canvasArea">' + canvas.toDataURL("image/jpg") + '</div>');
				            setTimeout(function () {
					            node.setAttribute("style", "color: red; border: 1px solid red; display:none;");
					            node.nextSibling.nextSibling.setAttribute("style", "color: red;");
                                node.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('style','background: #458B97;color: #f68;float: right;border: 1px solid #9990;');
					            node.nextSibling.nextSibling.nextSibling.nextSibling.value = 'Copy Base641';
					            /* Likes Information (Hide) */
					            event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:none;background:#0f0;");
				                }, 0);
			})
        }
        else if (event.target.parentNode.children.length >= 0 && window.innerWidth <= 1725 && window.location.href.match(/(https:\/\/www\.facebook\.com\/\d+|\D+|\d+\D+|\D+\d+\/photos\/\w\.\d+\/\d+)/)) {
			event.target.closest('.u_1zif-yanm').children[0].children[0].children[1].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
			event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.parentNode.setAttribute("style", "color: #fff; background: #522; display:block; border:0px solid #111!important;"); /* Status Main Background */
            event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.setAttribute("style", "color: #fff; background: #a220; display:block; border:0px solid #111!important;"); /* Status Wrapper for Main Context Information */
            event.target.closest('.n_1zif-ycce.h_1zif-v9xd').setAttribute("style", "background:#a0a; border-radius:10px;"); /* Status Main Context Information*/

            console.log('URL is supported by Mode(s) 2/3. — Script Version 1.18 — OK :) :: ' + window.location.href);

                            if(window.innerWidth == 1440) { wWOffset = 401; }
                            else if (window.innerWidth == 1402) { wWOffset = 382; }
                            else if (window.innerWidth == 1255) { wWOffset = 312.5; alert('147') }

                             /* Unsupported Resolution Algorithm */
                             else { alert('Detected an... innerWidth of '+window.innerWidth+'! Script hasn\'t been optmized for use with this resolution. Screenshot will be off center.');
                             OffsetXs = prompt('Enter a number from 1 to 100 to shift the image to the right. (Screenshot Offset - Subtract X Axis).'); OffsetXs = OffsetXs*3;
                             if (OffsetXs => 100) {wWOffset = window.innerWidth/3-79.0000000000-0.0-OffsetXs;}
                             if (OffsetXs <= 0) { OffsetXp = prompt('Enter a number from 1 to 100 to shift the image to the left. (Screenshot Offset - Add X Axis');
                             wWOffset = window.innerWidth/3-79.0000000000-0.0-OffsetXs+OffsetXp; }
                             }



                      ///////event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.setAttribute("style","background:red;");
			         ///////event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:block; background:green;");
			        ///////event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].childNodes[0].setAttribute("style", "border-bottom: 2px solid #0000;");

            if (document.querySelector('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1] !== undefined)
            {
            // event.target.closest('._4-u2').setAttribute("style", "background:#00f0;");
            node.nextSibling.value = 'Archived Post [Mode: 2]';
            event.target.parentNode.parentNode.parentNode.parentNode.children[0].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
            // node.nextSibling.setAttribute('style','color:#0f4;background:#1110;border:1px solid #0f4;text-align:left;:font-size:10px;');
            document.querySelector('.s2img').parentNode.parentNode.nextSibling.nextSibling.firstChild.setAttribute('style','background-image: url(/rsrc.php/v3/yX/r/OvSbQLwa0TM.png);');
            document.querySelector('.s2img').parentNode.parentNode.nextSibling.setAttribute('style','display:none;');
            //event.target.parentNode.parentNode.nextSibling.nextSibling.firstChild.setAttribute('style','background-image: url(https://i.imgur.com/ZL0LHeL.png); background-size: 38px 16px; background-repeat: no-repeat; display: block; height: 20px; width: 43px; background-position: 0px 0px !important; top: -1px;margin-left:0px;');
            event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[2].children[0].children[0].children[0].children[2].setAttribute("style", "display:none;");
            event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[2].children[0].children[0].children[0].children[3].setAttribute("style", "display:none;");
            event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
            } else {
            //NotNeeded//event.target.closest('._4-u2').setAttribute("style", "background:#f00f;");
            node.nextSibling.value = 'Archived Post [Mode: 3]';
            node.nextSibling.setAttribute('style','color:#40f;background:pink;border:1px solid #40f;text-align:left;:font-size:10px;'); /* Archived Post Label */
            }

	//if(!window.location.href.match(/\d/)) {};
	//node.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.parentNode.children[1].children[2].children[1].children[0].children[0].children[1].children[1].children[0].children[0].children[0].children[2].setAttribute("style", "display:none;");
	//node.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.parentNode.children[1].children[2].children[1].children[0].children[0].children[1].children[1].children[0].children[0].children[0].children[3].setAttribute("style", "display:none;");
                    var iCaptureM3 = event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.parentNode;
//setTimeout(function () {
			        html2canvas(iCaptureM3, {useCORS: true, backgroundColor: '#00f', logging: true, x: wWOffset, y: 425, width: 510}).then(canvas => {
				    var a = canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");
				    var iNameGen = Math.random().toString(36).substring(2, 15);
				    node.insertAdjacentHTML('afterend', '<span class="SaveAsImageFile"><a href="' + a + '" download="' + iNameGen + '.jpg">Save As Image File</a></span>');
				    node.insertAdjacentHTML('afterend', '<span class="ViewImage"><a href="' + a + '" target="_blank">View Image</a> / </span>');
				    node.insertAdjacentHTML('afterend', '<div class="canvasArea">' + canvas.toDataURL("image/jpg") + '</div>');
				      setTimeout(function ()
                        {
					    node.setAttribute("style", "color: red; border: 1px solid red; display:none;");
					    node.nextSibling.nextSibling.setAttribute("style", "color: red;");
                        node.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('style','background: #1110;color: #86f;float: right;border: 1px solid #9990;');
					    node.nextSibling.nextSibling.nextSibling.nextSibling.value = 'Copy Base645';
                        /* Likes Information (Show) */
					    event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:none;background:#0f0;");
                        }, 0);
				    });
//}, 100);

        }


	else if (classCheck0.length >= 0 && window.innerWidth <= 1440 && window.location.href.match(/facebook.com\/.+\w+\/posts\/\d+|facebook\.com\/(\D+|\D+\d+)\/posts\/\d+/) && event.target.parentNode.parentNode.parentNode.parentNode.innerText.match(/[A-Z]\D+\s[A-Z]\D+/)) {
console.log('Line 204');
                 console.log('URL is supported by Mode(s) 4/5. — Script Version 1.11 — OK :) :: ' + window.location.href);

                            if(window.innerWidth == 1440) {wWOffset = 401;}
                            else if (window.innerWidth == 1402) {wWOffset = 371;}
                            else if (window.innerWidth == 1255) {wWOffset = 340;}
                             /* Unsupported Resolution Algorithm */
                             else { alert('Detected an (Line 211) innerWidth of '+window.innerWidth+'! Script hasn\'t been optmized for use with this resolution. Screenshot will be off center.');
                             OffsetXs = prompt('Enter a number from 1 to 100 to shift the image to the right. (Screenshot Offset - Subtract X Axis).'); OffsetXs = OffsetXs*3;
                             if (OffsetXs => 100) {wWOffset = window.innerWidth/3-79.0000000000-0.0-OffsetXs;}
                             if (OffsetXs <= 0) { OffsetXp = prompt('Enter a number from 1 to 100 to shift the image to the left. (Screenshot Offset - Add X Axis');
                             wWOffset = window.innerWidth/3-79.0000000000-0.0-OffsetXs+OffsetXp; }
                             }

if (document.querySelector('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1] !== undefined && window.location.href.match(/Elted/)) {
                              var iCaptureM4 = event.target.closest('._4-u2');
                              node.nextSibling.value = 'Archived Post [Mode: 4]';
                              event.target.parentNode.setAttribute("style", "background:red;");
                              event.target.closest('._1dwg._1w_m._q7o').nextSibling.setAttribute("style","display:none;");

                              event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.setAttribute("style", "color: #fff; background: #EDBB33; display:block; border:0px solid #222!important;");
			                  event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.parentNode.setAttribute("style", "color: #fff; background: blue; display:block; border:0px solid #222!important;");
			                  event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:block; background:#0000;");
                              event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.setAttribute("style", "color: #fff; background: orange; display:block; border:0px solid #222!important;");
			                  event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.parentNode.setAttribute("style", "color: #fff; background: magenta; display:block; border:0px solid #222!important;");
			                  event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:block; background:#0000;");
			                  event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].childNodes[0].setAttribute("style", "border-bottom: 2px solid #0000;");
			                  event.target.closest('.u_1zif-yanm').children[0].children[0].children[1].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
                              event.target.closest('.n_1zif-ycce.h_1zif-v9xd').setAttribute("style", "background:purple;");
                              event.target.closest('._5pcr.userContentWrapper').setAttribute("style", "background:cyan;");
                              event.target.closest('._5pcr.userContentWrapper').parentNode.setAttribute("style", "background:F02AFC;");
                              event.target.closest('._5pcr.userContentWrapper').parentNode.parentNode.setAttribute("style", "background:yellow;");
                              node.nextSibling.setAttribute('style','color:#45d;background:#1110;border:1px solid #45d;text-align:left;:font-size:10px;');

                              document.querySelector('.s2img').parentNode.parentNode.nextSibling.nextSibling.firstChild.setAttribute('style','background-image: url(/rsrc.php/v3/yX/r/OvSbQLwa0TM.png);');
                              document.querySelector('.s2img').parentNode.parentNode.nextSibling.setAttribute('style','display:none;');
                             //event.target.parentNode.parentNode.nextSibling.nextSibling.firstChild.setAttribute('style','background-image: url(https://i.imgur.com/ZL0LHeL.png); background-size: 38px 16px; background-repeat: no-repeat; display: block; height: 20px; width: 43px; background-position: 0px 0px !important; top: -1px;margin-left:0px;');
                              //event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[2].children[0].children[0].children[0].children[2].setAttribute("style", "display:none;");
                              //event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[2].children[0].children[0].children[0].children[3].setAttribute("style", "display:none;");
                              //event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
                              event.target.parentNode.parentNode.parentNode.parentNode.children[0].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
			                  html2canvas(iCaptureM4, {useCORS: true, backgroundColor: '#1f1', logging: true, x: wWOffset, y: 65, width: 509}).then(canvas => {
				              var a = canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");
				              var iNameGen = Math.random().toString(36).substring(2, 15);
				              node.insertAdjacentHTML('afterend', '<span class="SaveAsImageFile"><a href="' + a + '" download="' + iNameGen + '.jpg">Save As Image File</a></span>');
				              node.insertAdjacentHTML('afterend', '<span class="ViewImage"><a href="' + a + '" target="_blank">View Image</a> / </span>');
				              node.insertAdjacentHTML('afterend', '<div class="canvasArea">' + canvas.toDataURL("image/jpg") + '</div>');
				              setTimeout(function () {
					            node.setAttribute("style", "color: red; border: 1px solid red; display:none;");
					            node.nextSibling.nextSibling.setAttribute("style", "color: red;");
                                node.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('style','background: #2220;color: #86f;float: right;border: 1px solid #9990;');
					            node.nextSibling.nextSibling.nextSibling.nextSibling.value = 'Copy Base6411';
                                  /* Likes Information (Show) */
					              event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:none;background:#0f0;");
				                }, 0);
			                 });
                        }





















// Confusing code
// But actually quite simple.

        if (document.querySelector('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1] == undefined)
            {
                    alert('Line 300 querySelector\(n_1zif-ycce.h_1zif-v9xd.clearfix\).nextSibling.nextSibling.children[1] == undefined');
                     if(window.innerWidth == 1440) {wWOffset = 401;}
                     else if (window.innerWidth == 1402) {wWOffset = 388;}
                     else if (window.innerWidth == 1255) {wWOffset = 312.5;}

                    /* Unsupported Resolution Algorithm */
                      else {
                         alert('Detected an (Line 268) innerWidth of '+window.innerWidth+'! Script hasn\'t been optmized for use with this resolution. Screenshot will be off center.');
                         var OffsetXs = prompt('Enter a number from 1 to 100 to shift the image to the right. (Screenshot Offset - Subtract X Axis).'); OffsetXs = OffsetXs*3;
                         if (OffsetXs => 100) {wWOffset = window.innerWidth/3-79.0000000000-0.0-OffsetXs;}
                         if (OffsetXs <= 0) {
                             var OffsetXp = prompt('Enter a number from 1 to 100 to shift the image to the left. (Screenshot Offset - Add X Axis');
                             wWOffset = window.innerWidth/3-79.0000000000-0.0-OffsetXs+OffsetXp;
                             }
                        }

            alert('Line 300-318 '+event.target.parentNode.className);
            node.nextSibling.value = 'Archived Post [Headache Mode: 5]';
            iCaptureM5 = event.target.closest('._1dwg._1w_m._q7o');

                event.target.parentNode.setAttribute("style", "background:#0000;");
                event.target.previousSibling.previousSibling.setAttribute("style", "color:#fff;");
                event.target.closest('._5pcr.userContentWrapper').setAttribute("style", "background:#111;");/*
                                 event.target.closest('._5pcr.userContentWrapper').parentNode.setAttribute("style", "background:#f00;");
                                 event.target.closest('._5pcr.userContentWrapper').parentNode.parentNode.setAttribute("style", "background:blue;");
                event.target.closest('._5pcr.userContentWrapper').setAttribute("style", "background:blue;");
                event.target.closest('._5pcr.userContentWrapper').parentNode.setAttribute("style", "background:magenta;");
                event.target.closest('._5pcr.userContentWrapper').parentNode.parentNode.setAttribute("style", "background:magenta;");
/* Hide */ event.target.closest('._5pcr.userContentWrapper').children[1].setAttribute("style", "display:none;");
                //event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.setAttribute("style", "color: #fff; background: blue; display:block; border:0px solid #222!important;");
			    //event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.parentNode.setAttribute("style", "color: #fff; background: yellow; display:block; border:0px solid #222!important;");
			    //event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:block; background:#0000;");
			    //event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].childNodes[0].setAttribute("style", "border-bottom: 2px solid #0000;");
			    event.target.closest('.u_1zif-yanm').children[0].children[0].children[1].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
                //event.target.closest('.n_1zif-ycce.h_1zif-v9xd').setAttribute("style", "background:cyan;");
                event.target.closest('._1dwg._1w_m._q7o').nextSibling.setAttribute("style","display:none;");
			    event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:block; background:#0000;");
			    //event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].childNodes[0].setAttribute("style", "border-bottom: 2px solid #0000;");
                //event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.setAttribute("style", "color: #fff; background: red; display:block; border:0px solid #222!important;");
			    //event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.parentNode.setAttribute("style", "color: #f0f; background: gray; display:block; border:0px solid #222!important;");
                //event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.setAttribute("style", "color: #fff; background: red; display:block; border:0px solid #222!important;");
			    //event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.parentNode.setAttribute("style", "color: #ff0; background: gray; display:block; border:0px solid #222!important;");			    event.target.closest('.u_1zif-yanm').children[0].children[0].children[1].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
                                 //event.target.closest('.n_1zif-ycce.h_1zif-v9xd').setAttribute("style", "background:orange;");
                                 node.nextSibling.setAttribute('style','color:#29d;background:#1110;border:1px solid #29d;text-align:left;:font-size:10px;');
			                     html2canvas(iCaptureM5, {useCORS: true, backgroundColor: '#f11', logging: true, x: wWOffset, y: 425, width: 502}).then(canvas => {
				                 var a = canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");
				                 var iNameGen = Math.random().toString(36).substring(2, 15);
				                 node.insertAdjacentHTML('afterend', '<span class="SaveAsImageFile"><a href="' + a + '" download="' + iNameGen + '.jpg">Save As Image File</a></span>');
				                 node.insertAdjacentHTML('afterend', '<span class="ViewImage"><a href="' + a + '" target="_blank">View Image</a> / </span>');
				                 node.insertAdjacentHTML('afterend', '<div class="canvasArea">' + canvas.toDataURL("image/jpg") + '</div>');
				                   setTimeout(function () {
					                 node.setAttribute("style", "color: red; border: 1px solid red; display:none;");
					                 node.nextSibling.nextSibling.setAttribute("style", "color: red;");
                                     node.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('style','background: #1110;color: #86f;float: right;border: 1px solid #9990;');
					                 node.nextSibling.nextSibling.nextSibling.nextSibling.value = 'Copy Base64';
                                     /* Likes Information (Show) */
					                 event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:none;background:#0f0;");
				                     }, 0);
			                     });
                           }

                           else {
                            node.nextSibling.value = 'Archived Post [Mode: 6]';
                            event.target.parentNode.parentNode.setAttribute("style", "background:red;");
                            event.target.parentNode.parentNode.parentNode.parentNode.children[0].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
                            node.nextSibling.setAttribute('style','color:#29d;background:#1110;border:1px solid #29d;text-align:left;:font-size:10px;');

                                 if(window.innerWidth == 1440) {wWOffset = 401;}
                                 else if (window.innerWidth == 1402) {wWOffset = 381;}
                                   /* Unsupported Resolution Algorithm */

                                    else {
                                       alert
                                       (
                                       '0 window.innerWidth: ' + window.innerWidth + '\n' +
                                       '1 Script hasn\'t been optmized for use with this resolution.' + '\n' +
                                       '2 Screenshot will be off center.' + '\n' +
                                       '3 node.className: ' + node.className + '\n' +
                                       '4 node.innerHTML: ' + node.innerHTML + '\n' +
                                       '5 node.nextSibling.className: ' + node.nextSibling.className + '\n' +
                                       '6 node.nextSibling.value: ' + node.nextSibling.value + '\n' +
                                       '7 event.target.parentNode.parentNode.className: ' + event.target.parentNode.parentNode.className + '\n' +
                                       //'8 event.target.parentNode.parentNode.innerHTML: ' + event.target.parentNode.parentNode.innerHTML + '\n' +
                                       '8 event.target.parentNode.parentNode.innerText: \n' + event.target.parentNode.parentNode.innerText + '\n'
                                       )
                                       //'event.target.parentNode.parentNode.value: ' + event.target.parentNode.parentNode.value + '10\n');
                                   OffsetXs = prompt('Enter a number from 1 to 100 to shift the image to the right. (Screenshot Offset - Subtract X Axis).'); OffsetXs = OffsetXs*3;
                                   if (OffsetXs => 100) {wWOffset = window.innerWidth/3-79.0000000000-0.0-OffsetXs;}
                                   if (OffsetXs <= 0) { OffsetXp = prompt('Enter a number from 1 to 100 to shift the image to the left. (Screenshot Offset - Add X Axis');
                                   wWOffset = window.innerWidth/3-79.0000000000-0.0-OffsetXs+OffsetXp; }
                                   }

			                 var iCaptureM6 = event.target.closest('._1dwg._1w_m._q7o');
                                 html2canvas(iCaptureM6, {useCORS: true, backgroundColor: '#111', logging: true, x: wWOffset, y: 425, width: 509}).then(canvas => {
				                   var a = canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");
				                   var iNameGen = Math.random().toString(36).substring(2, 15);
				                   node.insertAdjacentHTML('afterend', '<span class="SaveAsImageFile"><a href="' + a + '" download="' + iNameGen + '.jpg">Save As Image File</a></span>');
				                   node.insertAdjacentHTML('afterend', '<span class="ViewImage"><a href="' + a + '" target="_blank">View Image</a> / </span>');
				                   node.insertAdjacentHTML('afterend', '<div class="canvasArea">' + canvas.toDataURL("image/jpg") + '</div>');
				                      setTimeout(function ()
                                           {
					                       node.setAttribute("style", "color: red; border: 1px solid red; display:none;");
					                       node.nextSibling.nextSibling.setAttribute("style", "color: red;");
                                           node.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('style','background: #1110;color: #86f;float: right;border: 1px solid #9990;');
					                       node.nextSibling.nextSibling.nextSibling.nextSibling.value = 'Copy Base640';
                                           /* Likes Information (Show) */ event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:none;background:#0f0;");
				                           }, 0);
			                       });
                      }





















}


	else if (classCheck0.length >= 0 && window.innerWidth <= 1440 && window.location.href.match(/facebook.com\/.+\w+\/posts\/\d+|facebook\.com\/(\D+|\D+\d+)\/posts\/\d+/)) {
console.log('Line 359');
                console.log('URL is supported by Mode(s) 7/8. — Script Version 1.18 — OK :) :: ' + window.location.href);

                    if(window.innerWidth == 1440) {wWOffset = 401;}
                    else if (window.innerWidth == 1402) {wWOffset = 382;}
/* Unsupported Resolution Algorithm */
                             else { alert('Detected an......... innerWidth of '+window.innerWidth+'! Script hasn\'t been optmized for use with this resolution. Screenshot will be off center.');
                             OffsetXs = prompt('Enter a number from 1 to 100 to shift the image to the right. (Screenshot Offset - Subtract X Axis).'); OffsetXs = OffsetXs*3;
                             if (OffsetXs => 100) {wWOffset = window.innerWidth/3-79.0000000000-0.0-OffsetXs;}
                             if (OffsetXs <= 0) { OffsetXp = prompt('Enter a number from 1 to 100 to shift the image to the left. (Screenshot Offset - Add X Axis');
                             wWOffset = window.innerWidth/3-79.0000000000-0.0-OffsetXs+OffsetXp; }
                             }

                event.target.closest('._5pcr.userContentWrapper').children[1].setAttribute("style", "display:none;");
                event.target.parentNode.setAttribute("style", "background:#D96C32;");
                event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.setAttribute("style", "color: #fff; background: red; display:block; border:0px solid #222!important;");
			    event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.parentNode.setAttribute("style", "color: #fff; background: gray; display:block; border:0px solid #222!important;");
			    event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:block; background:#0000;");
			    event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].childNodes[0].setAttribute("style", "border-bottom: 2px solid #0000;");
			    event.target.closest('.u_1zif-yanm').children[0].children[0].children[1].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
                event.target.closest('.n_1zif-ycce.h_1zif-v9xd').setAttribute("style", "background:purple;");
                event.target.closest('._5pcr.userContentWrapper').setAttribute("style", "background:lime;");
                event.target.closest('._5pcr.userContentWrapper').parentNode.setAttribute("style", "background:lime;");
                event.target.closest('._5pcr.userContentWrapper').parentNode.parentNode.setAttribute("style", "background:lime;");

                           if (document.querySelector('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1] !== undefined) {
                             node.nextSibling.value = 'Archived Post [Mode: 7]';
                             node.nextSibling.setAttribute('style','color:#45d;background:#1110;border:1px solid #45d;text-align:left;:font-size:10px;');

                             document.querySelector('.s2img').parentNode.parentNode.nextSibling.nextSibling.firstChild.setAttribute('style','background-image: url(/rsrc.php/v3/yX/r/OvSbQLwa0TM.png);');
                             document.querySelector('.s2img').parentNode.parentNode.nextSibling.setAttribute('style','display:none;');
                             //event.target.parentNode.parentNode.nextSibling.nextSibling.firstChild.setAttribute('style','background-image: url(https://i.imgur.com/ZL0LHeL.png); background-size: 38px 16px; background-repeat: no-repeat; display: block; height: 20px; width: 43px; background-position: 0px 0px !important; top: -1px;margin-left:0px;');
                             ////event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[2].children[0].children[0].children[0].children[2].setAttribute("style", "display:none;");
                             ////event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[2].children[0].children[0].children[0].children[3].setAttribute("style", "display:none;");
                             event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
                             event.target.parentNode.parentNode.parentNode.parentNode.children[0].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
                             }  else { node.nextSibling.value = 'Archived Post [Mode: 8]'; node.nextSibling.setAttribute('style','color:#29d;background:#1110;border:1px solid #29d;text-align:left;:font-size:10px;'); }

                     //var iCaptureM5 = event.target.closest('._4-u2');
                       var iCaptureM5 = event.target.closest('._1dwg._1w_m._q7o');


			         html2canvas(iCaptureM5, {useCORS: true, backgroundColor: '#111', logging: true, x: wWOffset, y: 425, width: 510}).then(canvas => {
				     var a = canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");
				     var iNameGen = Math.random().toString(36).substring(2, 15);
				     event.target.insertAdjacentHTML('afterend', '<span class="SaveAsImageFile"><a href="' + a + '" download="' + iNameGen + '.jpg">Save As Image File</a></span>');
				     node.insertAdjacentHTML('afterend', '<span class="ViewImage"><a href="' + a + '" target="_blank">View Image</a> / </span>');
				     node.insertAdjacentHTML('afterend', '<div class="canvasArea">' + canvas.toDataURL("image/jpg") + '</div>');
				       setTimeout(function () {
					     node.setAttribute("style", "color: red; border: 1px solid red; display:none;");
					     node.nextSibling.nextSibling.setAttribute("style", "color: red;");
                         node.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('style','background: #1110;color: #86f;float: right;border: 1px solid #9990;');
					     node.nextSibling.nextSibling.nextSibling.nextSibling.value = 'Copy Base643';
                         /* Likes Information (Show) */
					     event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:none;background:#0f0;");
				}, 0);
			});

     }


	else if (!classCheck2.length && Wwidth<=1920 && window.location.href.match(/(https:\/\/www\.facebook\.com\/\w+\/\d+\/permalink\/\d+\/)/)) {
console.log('Line 420');

function minusPercent(n,p) {return n - (n * (p/100));}
/* <— (Subtraction) */
/* 200 pixels increase = subtract 33.25 */
/* 1 pixel increase = subtract 0.16625 */
  var w1920 = -8.5;
  var w1725 = 23.689;
  var w1600 = 44.70;
  var w1542 = 54.3425;
  var w1500 = 61.325;
  var w1450 = 69.6375;
  var w1400 = 77.95;
  var w1200 = 111.20;
  var w1172 = 115.63;
/* —> (Addition) */


if (window.innerWidth == 1920) {wWOffset = window.innerWidth / 3 - w1920;}
else if (window.innerWidth == 1725) {wWOffset = window.innerWidth / 3 - w1725;}
else if (window.innerWidth == 1600) {wWOffset = window.innerWidth / 3 - w1600;}
else if (window.innerWidth == 1500) {wWOffset = window.innerWidth / 3 - w1500;}
else if (window.innerWidth == 1542) {wWOffset = window.innerWidth / 3 - w1542;}
else if (window.innerWidth == 1450) {wWOffset = window.innerWidth / 3 - w1450;}
else if (window.innerWidth == 1400) {wWOffset = window.innerWidth / 3 - w1400;}
else if (window.innerWidth == 1200) {wWOffset = window.innerWidth / 3 - w1200;}
else if (window.innerWidth == 1172) {wWOffset = window.innerWidth / 3 - w1172;}

/* Unsupported Resolution Algorithm */
else {
    alert('Detected an....... innerWidth of ' + window.innerWidth + '! Script hasn\'t been optmized for use with this resolution. Screenshot will be off center.');
    OffsetXs = prompt('Enter a number from 1 to 100 to shift the image to the right. (Screenshot Offset - Subtract X Axis).');
    OffsetXs = OffsetXs * 3;
    if (OffsetXs => 100) {
        wWOffset = window.innerWidth / 3 - 79.0000000000 - 0.0 - OffsetXs;
    }
    if (OffsetXs <= 0) {
        OffsetXp = prompt('Enter a number from 1 to 100 to shift the image to the left. (Screenshot Offset - Add X Axis');
        wWOffset = window.innerWidth / 3 - 79.0000000000 - 0.0 - OffsetXs + OffsetXp;
    }
}

console.log('URL is supported 9/10 by script. 1.20 Version. OK :) :: ' + window.location.href);
event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.parentNode.setAttribute("style", "color: #fff; background: lime; display:block; border:0px solid #111!important;"); /* Status Main Background */
event.target.closest('.n_1zif-ycce.h_1zif-v9xd').setAttribute("style", "background:#0000; border-radius:10px;"); /* Status Main Context Information */
//event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.setAttribute("style", "color: #fff; background: #0000; display:block; border:0px solid #111!important;"); /* Status Main Context */
//event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:block; background:#00ff;");
event.target.closest('.u_1zif-yanm').children[0].children[0].children[1].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;

if (document.querySelector('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1] !== undefined) {
    node.nextSibling.value = 'Archived Post [Mode: 9]';
    node.nextSibling.setAttribute('style', 'color:#f04;background:#1110;border:1px solid #f04;text-align:left;:font-size:10px;margin-right:4px;');
    console.log('Capture: Mode #2');
    document.querySelector('.s2img').parentNode.parentNode.nextSibling.nextSibling.firstChild.setAttribute('style', 'background-image: url(/rsrc.php/v3/yX/r/OvSbQLwa0TM.png);');
    document.querySelector('.s2img').parentNode.parentNode.nextSibling.setAttribute('style', 'display:none;');
    event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[2].children[0].children[0].children[0].children[2].setAttribute("style", "display:none;");
    event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[2].children[0].children[0].children[0].children[3].setAttribute("style", "display:none;");
    event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
    event.target.parentNode.parentNode.parentNode.parentNode.children[0].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
}
else {
    node.nextSibling.value = 'Archived Post [Mode: 10]';
    /*Software Used:*/
    if (node.closest('.f_1zif-yant').innerText.match('410933255642572')) {
        node.insertAdjacentHTML('afterend', '<span class="arnold_logo" style="position:relative;left:0px; top:-5px; background:#aaa0;display:inline-block; float:right;"><img src="https://i.imgur.com/5giGcsd.png" width="32px" height="32px"></span>');
        node.nextSibling.nextSibling.setAttribute('style', 'display:block;color:rgb(50,139,142);background:#181818;border:1px solid rgb(75,138,142);text-align:left;:font-size:10px;margin-right:4px;margin-top:4px;');
    }
    else if (node.closest('.f_1zif-yant').innerText.match('183831411996004')) {
        node.insertAdjacentHTML('afterend', '<span class="corona_logo" style="position:relative;left:0px; top:-5px; background:#aaa0;display:inline-block; float:right;"><img src="https://i.imgur.com/dM1XexF.png" width="32px" height="32px"></span>');
        node.nextSibling.nextSibling.setAttribute('style', 'display:block;color:rgb(50,139,142);background:#181818;border:1px solid rgb(75,138,142);text-align:left;:font-size:10px;margin-right:4px;margin-top:4px;');
    }
    else {
        node.insertAdjacentHTML('afterend', '<span class="arnold_logo" style="position:relative;left:0px; top:-5px; background:#aaa0;display:inline-block; float:right;"><img src="https://i.imgur.com/5giGcsd.pnxg" width="32px" height="32px"></span>');
        node.nextSibling.nextSibling.setAttribute('style', 'display:block;color:rgb(50,139,142);background:#181818;border:1px solid rgb(75,138,142);text-align:left;:font-size:10px;margin-right:4px;margin-top:4px;');
    }
    //event.target.parentNode.parentNode.nextSibling.nextSibling.firstChild.setAttribute('style','background-image: url(https://i.imgur.com/ZL0LHeL.png); background-size: 38px 16px; background-repeat: no-repeat; display: block; height: 20px; width: 43px; background-position: 0px 0px !important; top: -1px;margin-left:0px;');
    if (event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.children[0].innerText.match(/\.+/)) {
        //event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.children[0].style.display = "none";
    }
}


                iCapture = event.target.closest('._1dwg._1w_m._q7o');
			         html2canvas(iCapture, {useCORS: true, backgroundColor: '#222', logging: true, x: wWOffset, y: 440, width: 488}).then(canvas => {
			    var a = canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");
				var iNameGen = Math.random().toString(36).substring(2, 15);
				     node.insertAdjacentHTML('afterend', '<span class="SaveAsImageFile"><a href="' + a + '" download="' + iNameGen + '.jpg">Save As Image File</a></span>');
				     node.insertAdjacentHTML('afterend', '<span class="ViewImage"><a href="' + a + '" target="_blank">View Image</a> / </span>');
				     node.insertAdjacentHTML('afterend', '<div class="canvasArea">' + canvas.toDataURL("image/jpg") + '</div>');
				       setTimeout(function () {
					     node.setAttribute("style", "color: red; border: 1px solid red; display:none;");
					     node.nextSibling.nextSibling.setAttribute("style", "color: red;");
                         node.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('style','background: #1110;color: rgb(50,139,142);float: right;border: 1px solid #9990;');
					     node.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.value = 'Copy Status';
					     /* Likes Information (Show) */
					     event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:none;background:#0f0;");
				}, 0);
			})

     }

	else if (classCheck0.length && Wwidth<=1444 && window.location.href.match(/(https:\/\/www\.facebook\.com\/photo\.php\?fbid\=\d+\&\D+\.\d+\&\D+\d)/)) {
console.log('Line 522');
                       if(window.innerWidth == 1440) {wWOffset = window.innerWidth/3-79.0000000000-0.0;}
                          else if (window.innerWidth == 1402) {wWOffset = window.innerWidth/3-79.0000000000-1.3;}

/* Unsupported Resolution Algorithm */
                             else { alert('Detected an...... innerWidth of '+window.innerWidth+'! Script hasn\'t been optmized for use with this resolution. Screenshot will be off center.');
                             OffsetXs = prompt('Enter a number from 1 to 100 to shift the image to the right. (Screenshot Offset - Subtract X Axis).'); OffsetXs = OffsetXs*3;
                             if (OffsetXs => 100) {wWOffset = window.innerWidth/3-79.0000000000-0.0-OffsetXs;}
                             if (OffsetXs <= 0) { OffsetXp = prompt('Enter a number from 1 to 100 to shift the image to the left. (Screenshot Offset - Add X Axis');
                             wWOffset = window.innerWidth/3-79.0000000000-0.0-OffsetXs+OffsetXp; }
                             }

				   console.log('URL is supported 11/12 by script. 1.15 Version. OK :) :: ' + window.location.href);
	                 event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.parentNode.setAttribute("style", "color: #fff; background: #222; display:block; border:0px solid #111!important;"); /* Status Main Background */

                     event.target.closest('.n_1zif-ycce.h_1zif-v9xd').setAttribute("style", "background:#0000; border-radius:10px;"); /* Status Main Context Information */
                     event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.setAttribute("style", "color: #fff; background: #0000; display:block; border:0px solid #111!important;"); /* Status Main Context */

			         //event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:block; background:#00ff;");
			         event.target.closest('.u_1zif-yanm').children[0].children[0].children[1].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;

                    if (document.querySelector('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1] !== undefined) {
                          node.nextSibling.value = 'Archived Post [Mode: 11]';
                          node.nextSibling.setAttribute('style','color:#f04;background:#1110;border:1px solid #f04;text-align:left;:font-size:10px;margin-right:4px;');
                            console.log('Capture: Mode #2');
                          document.querySelector('.s2img').parentNode.parentNode.nextSibling.nextSibling.firstChild.setAttribute('style','background-image: url(/rsrc.php/v3/yX/r/OvSbQLwa0TM.png);');
                          document.querySelector('.s2img').parentNode.parentNode.nextSibling.setAttribute('style','display:none;');
//event.target.parentNode.parentNode.nextSibling.nextSibling.firstChild.setAttribute('style','background-image: url(https://i.imgur.com/ZL0LHeL.png); background-size: 38px 16px; background-repeat: no-repeat; display: block; height: 20px; width: 43px; background-position: 0px 0px !important; top: -1px;margin-left:0px;');
                            event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[2].children[0].children[0].children[0].children[2].setAttribute("style", "display:none;");
                            event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[2].children[0].children[0].children[0].children[3].setAttribute("style", "display:none;");
                            event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
                            event.target.parentNode.parentNode.parentNode.parentNode.children[0].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
                          }
                   else {
                           node.nextSibling.value = 'Archived Post [Mode: 12]';
                           node.nextSibling.setAttribute('style','color:#0e8;background:#181818;border:1px solid #0e8;text-align:left;:font-size:10px;margin-right:4px;');
                            if(event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.children[0].innerText.match(/\.+/)) {
                               event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.children[0].style.display = "none"; }
                          }

                iCapture = event.target.closest('._1dwg._1w_m._q7o');
			         html2canvas(iCapture, {useCORS: true, backgroundColor: '#111', logging: true, x: wWOffset, y: 440, width: 500}).then(canvas => {
			    var a = canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");
				var iNameGen = Math.random().toString(36).substring(2, 15);
				     node.insertAdjacentHTML('afterend', '<span class="SaveAsImageFile"><a href="' + a + '" download="' + iNameGen + '.jpg">Save As Image File</a></span>');
				     node.insertAdjacentHTML('afterend', '<span class="ViewImage"><a href="' + a + '" target="_blank">View Image</a> / </span>');
				     node.insertAdjacentHTML('afterend', '<div class="canvasArea">' + canvas.toDataURL("image/jpg") + '</div>');
				       setTimeout(function () {
					     node.setAttribute("style", "color: red; border: 1px solid red; display:none;");
					     node.nextSibling.nextSibling.setAttribute("style", "color: red;");
                         node.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('style','background: #1110;color: #0e8;float: right;border: 1px solid #9990;');
					     node.nextSibling.nextSibling.nextSibling.nextSibling.value = 'Copy Base644';
					     /* Likes Information (Show) */
					     event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:none;background:#0f0;");
				}, 0);
			})
     }



















/* Groups */
/* ——————> https://www.facebook.com/?????/?????????/permalink/##########/ */

else if (classCheck0.length && Wwidth <= 1440 && window.location.href.match(/(https:\/\/www\.facebook\.com\/\w+\/\w+\/permalink\/\d+)/)) {
    console.log('Line 600');
    if (window.innerWidth == 1440) { wWOffset = window.innerWidth / 3 - 79.0000000000 - 0.0; }
    else if (window.innerWidth == 1402) { wWOffset = window.innerWidth / 3 - 79.0000000000 - 1.3; }
    else if (window.innerWidth == 1255) { wWOffset = window.innerWidth / 3 - 79.0000000000 - 25.0; } /*(LARGER NUMBER WILL SHIFT THE IMAGE TO THE RIGHT)*/

    /* Unsupported Resolution Algorithm */
    else {
        alert('Detected an..... innerWidth of ' + window.innerWidth + '! Script hasn\'t been optmized for use with this resolution. Screenshot will be off center.');
        OffsetXs = prompt('Enter a number from 1 to 100 to shift the image to the right. (Screenshot Offset - Subtract X Axis).'); OffsetXs = OffsetXs * 3;
        if (OffsetXs => 100) { wWOffset = window.innerWidth / 3 - 79.0000000000 - 0.0 - OffsetXs; }
        if (OffsetXs <= 0) {
            OffsetXp = prompt('Enter a number from 1 to 100 to shift the image to the left. (Screenshot Offset - Add X Axis');
            wWOffset = window.innerWidth / 3 - 79.0000000000 - 0.0 - OffsetXs + OffsetXp;
        }
    }

    console.log('URL is supported 13/14 by script. 1.25 Version. OK :) :: ' + window.location.href);
    event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.parentNode.setAttribute("style", "color: #fff; background: #222; display:block; border:0px solid #111!important;"); /* Status Main Background */

    event.target.closest('.n_1zif-ycce.h_1zif-v9xd').setAttribute("style", "background:#7774; border-radius:10px;"); /* Status Main Context Information */
    event.target.closest('.n_1zif-ycce.h_1zif-v9xd').parentNode.setAttribute("style", "color: #fff; background: #5554; border-radius:10px; display:block; border:0px solid #111!important;"); /* Status Main Context */

    //event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:block; background:#00ff;");
    event.target.closest('.u_1zif-yanm').children[0].children[0].children[1].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;

    if (document.querySelector('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1] !== undefined) {
        node.nextSibling.value = 'Archived Post [Mode: 11]';
        node.nextSibling.setAttribute('style', 'color:#004;background:#1110;border:1px solid #004;text-align:left;:font-size:10px;margin-right:4px;');
        console.log('Capture: Mode #13');
        document.querySelector('.s2img').parentNode.parentNode.nextSibling.nextSibling.firstChild.setAttribute('style', 'background-image: url(/rsrc.php/v3/yX/r/OvSbQLwa0TM.png);');
        document.querySelector('.s2img').parentNode.parentNode.nextSibling.setAttribute('style', 'display:none;');
        //event.target.parentNode.parentNode.nextSibling.nextSibling.firstChild.setAttribute('style','background-image: url(https://i.imgur.com/ZL0LHeL.png); background-size: 38px 16px; background-repeat: no-repeat; display: block; height: 20px; width: 43px; background-position: 0px 0px !important; top: -1px;margin-left:0px;');
        event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[2].children[0].children[0].children[0].children[2].setAttribute("style", "display:none;");
        event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[2].children[0].children[0].children[0].children[3].setAttribute("style", "display:none;");
        event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[1].children[0].children[0].children[1].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
        event.target.parentNode.parentNode.parentNode.parentNode.children[0].children[0].children[0].children[0].children[0].style.color = PageTitleColorPROMPT;
    }
    else {
        node.nextSibling.value = 'Archived Post [Mode: 14] {Testing}';
        node.nextSibling.setAttribute('style', 'color:#0e8;background:#181818;border:1px solid #0e8;text-align:left;:font-size:10px;margin-right:4px;');
        if (event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.children[0].innerText.match(/\.+/)) {
            /////event.target.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.children[0].style.display = "none";
        }
    }

    iCapture = event.target.closest('._1dwg._1w_m._q7o');
    html2canvas(iCapture, { useCORS: true, backgroundColor: '#111', logging: true, x: wWOffset, y: 440, width: 500 }).then(canvas => {
        var a = canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");
        var iNameGen = Math.random().toString(36).substring(2, 15);
        node.insertAdjacentHTML('afterend', '<span class="SaveAsImageFile"><a href="' + a + '" download="' + iNameGen + '.jpg">Save As Image File</a></span>');
        node.insertAdjacentHTML('afterend', '<span class="ViewImage"><a href="' + a + '" target="_blank">View Image</a> / </span>');
        node.insertAdjacentHTML('afterend', '<div class="canvasArea">' + canvas.toDataURL("image/jpg") + '</div>');
        setTimeout(function () {
            document.querySelector('._5pcp._5lel._2jyu._232_ .r_1zif-zub1 ._5pcq._10is').setAttribute("style", "top:0px;");
            node.setAttribute("style", "color: red; border: 1px solid red; display:none;");
            node.nextSibling.nextSibling.setAttribute("style", "color: red;");
            node.nextSibling.nextSibling.nextSibling.nextSibling.setAttribute('style', 'background: #1110;color: #0e8;float: right;border: 1px solid #9990;');
            node.nextSibling.nextSibling.nextSibling.nextSibling.value = 'Copy Base64 (Test)';
            /* Likes Information (Show) */
            //////////event.target.closest('._1dwg._1w_m._q7o').nextSibling.childNodes[0].childNodes[4].childNodes[0].nextSibling.childNodes[0].setAttribute("style", "display:none;background:#0f0;");
        }, 0);
    })
}


else {
       console.log('748 URL is ' + window.location.href); console.log('Capturing statuses on this page is NOT supported! ');
       node.setAttribute("style", "color: #700f; border: 1px solid #700f; display:inline-block;");
       node.value = 'Unavailable';
	  }


		}); /* End Line */
	})




});


/* — Insert Copy Text Button — */
setMutationHandler({
	target: document.querySelector('._3576'),
	selector: '.copybtnP',
	handler: nodes => nodes.forEach(node => {
		node.setAttribute("style", "color:blue; border: 0px solid blue;"); /******/
		node.addEventListener('click', function (event) {
			var classCheck = document.getElementsByClassName('canvasArea');
			//console.log(event.target.parentNode.parentNode.nextSibling.nextSibling.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling.className);
			//console.log(event.target.closest("._1dwg._1w_m._q7o").childNodes[0].nextSibling.childNodes[0].nextSibling.className);

			//alert(status_content + ' (Working)');
			//alert(event.target.previousSibling.innerText);
			if (classCheck.length == 0) {
console.log('classcheck length 0');
			getSelection().removeAllRanges();
			var status_content1 = event.target.closest('._1dwg._1w_m._q7o').children[1].children[0];
			var status_content2 = event.target.closest('._1dwg._1w_m._q7o').children[1].children[1];
			var range1 = document.createRange();
			var range2 = document.createRange();
			range1.selectNode(status_content1);
            range2.selectNode(status_content2);
			window.getSelection().addRange(range1);
			window.getSelection().addRange(range2);
			}
///////////////////////////////////
			if (classCheck.length == 1) {
console.log('classcheck length 1');
			getSelection().removeAllRanges();
//console.log(event.target.className);
			var status_content0 = event.target.parentNode.childNodes[3];
			//status_content1 = event.target.parentNode.children[0];
			//status_content2 = event.target.closest('._1dwg._1w_m._q7o').children[1].children[1];

//Base64 -- event.target.parentNode.children[3]
			var range0 = document.createRange();
			//range1 = document.createRange();
			//range2 = document.createRange();
			range0.selectNode(status_content0);
			//range1.selectNode(status_content1);
            //range2.selectNode(status_content2);
			window.getSelection().addRange(range0);
			//window.getSelection().addRange(range1);
			//window.getSelection().addRange(range2);
			}

			try {
				var successful = document.execCommand('copy');
				var msg = successful ? 'successful' : 'unsuccessful';
				//console.log('Copying text command was ' + msg);
			} catch (err) {
				console.log('Oops, unable to copy');
			}
			return false;
		})
	})
});






























    /* — Gather Status Information — */
    var nodeCount = 0;
    var NumIncr = 0;
    setMutationHandler({

	target: document.querySelector('._3576'),
	selector: '._5pcq',
	processExisting: false,
	handler: nodes => nodes.forEach(node => {
        /*._5pcq*/ node.setAttribute("style", "font-size:10.5px;letter-spacing:1px;color:#000;");
                    nodeCount++; /* ———---> */ console.log('Amount of Nodes' + nodeCount);

            /* Delay Script */
            setTimeout(function () {
		        if (!node.parentNode.innerHTML.match(/copybtnP"|s2img"/)) {
				/*uncomment-to-enable/* Node Counter console.log('(' + NumIncr++ + ') ' + node.innerText); */
				  var PosterName = 'Posted By: '+node.closest('._6a._5u5j._6b').children[0].innerText;
                  var PostInformation = node.innerText;
                  var PostCategory = document.getElementsByClassName('_5pcq')[1].parentNode.innerText.replace(' · ','');
                  var PostContent = node.closest('.n_1zif-ycce.h_1zif-v9xd.clearfix').nextSibling.innerText;
                      if(!PostCategory) {console.log(PosterName+'\n'+PostInformation+'\n\n'+PostContent)}
                      else {console.log(PosterName+'\n'+PostInformation+'\n\n'+PostContent+'\n\nPost Category: ['+PostCategory+']')} // Next Next Next Update
                          //console.log('node is'+node.className);
                  if(!node.parentNode.innerHTML.match(/copybtnP"|s2img"/)) {
                    node.insertAdjacentHTML('afterend', '<input type="button" class="copybtnP" name="copyp" value="Copy Text"/>');
                    node.insertAdjacentHTML('afterend', '<br><input type="button" class="s2img" name="s2img" value="Export Status"/>');}
                }
            }, 0);
        })

    });






















































setMutationHandler({
	target: document.querySelector('.fbPhotosPhotoCaption'),
	selector: '.hasCaption',
	handler: nodes => nodes.forEach(node => {
		node.style.color = '#f00';
		var PhotoCaption = document.getElementsByClassName('hasCaption')[0];
		console.log('Current Image: ' + PhotoCaption.innerText);
		if (!document.getElementsByClassName('fbPhotosPhotoCaption')[0].innerHTML.includes('copybtn"')) {
			PhotoCaption.insertAdjacentHTML('afterend', '<input type="button" class="copybtn" name="copy" value="Copy"/>');
		}
		var copyTextareaBtn = document.querySelector('.copybtn');
		copyTextareaBtn.addEventListener('click', function (event) {
			var copy_text = document.getElementsByClassName("hasCaption")[0];
			var range = document.createRange();
			range.selectNode(copy_text);
			window.getSelection().addRange(range);
			try {
				var successful = document.execCommand('copy');
				var msg = successful ? 'successful' : 'unsuccessful';
				console.log('Copying text command was ' + msg);
			} catch (err) {
				console.log('Oops, unable to copy');
			}
		});
	})
});

function pad(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function expandDates(e) {
	for (var t, a = 0; t = e[a++];) t.querySelector(".full-timestamp") || t.insertAdjacentHTML("beforeend", '<span class="full-timestamp"> on ' + moment(new Date(1e3 * t.dataset.utime)).format("l \\at LTS"))
}

function RecentTimestamps(e) {
	for (var t, n = 0; t = e[n++];)
		if (!t.querySelector(".full-timestamp")) {
			if (1 == t.innerText.includes("min")) {
				var a = t.innerText.match(/[0-9]{1,2}/),
					s = parseInt(a, 10);
				t.insertAdjacentHTML("beforeend", '<span class="full-timestamp"> <span style="color:#365899">(' + moment(new Date).subtract(s, "minutes").format("h:mm:ss A") + ' ≃ <span style="color:#365899">ᴀᴘᴘʀᴏxɪᴍᴀᴛᴇ)</span><br>')
			}
			if (1 == t.innerText.includes("hr")) {
				var r = t.innerText.match(/[0-9]{1,2}/),
					m = parseInt(r, 10),
					o = 10 * parseInt(moment(new Date).format("mm") / 10, 10),
					l = 10 * parseInt(moment(new Date).format("ss") / 10, 10);
				t.insertAdjacentHTML("beforeend", '<span class="full-timestamp"> <span style="color:#365899">on ' + moment(new Date).subtract(m, "hours").format("l \\at h:") + pad(o, 2) + ":" + pad(l, 2) + '<span style="color:#365899"> ≃ (ᴀᴘᴘʀᴏxɪᴍᴀᴛᴇ)</span><br>')
			}
		}
}

function RecentPostURLs(e) {
	if (e.parentNode) {
		for (var a = 0; a < e.length; a++) {
			var r = e[a];
			!1 === r.innerHTML.includes("<br>") && "_5r69" != r.className && (r.getElement, r.insertAdjacentHTML("afterend", '<br><span style="color:#9c9dc3">' + r.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.href.replace(/\?fref=nf/, "").replace("&__tn__=", "").replace("&__tn__=m-R", "").replace("7%2Cdm-R-R", "").replace("%2Cdm-R-R", "").replace(/&eid=.+/, "").replace(/xts/, "").match(/facebook.com\/[a-z|A-Z|[0-9|\-|_|.]+.[a-zA-Z|[0-9|\-|_|.|]+[a-zA-Z|[0-9|\-|_|.|?=]+/) + "</span>"))
		}
	}
}

function ExternalURLs(e) {
	for (var n = 0; n < e.length; n++) {
		var r = e[n],
			a = r.href.replace(/https:\/\/l\.facebook.com\/l.php\?u=/, "");
		!1 === r.innerHTML.includes("<br>") && "_5r69" != r.className && r.insertAdjacentHTML("afterend", '<span class="externalURLs">' + decodeURIComponent(a.replace(/\+/g, " ")).replace(/.fbclid=[\D}\d]+/, "").slice(0, 256) + "</span>")
	}
}

function expandPostIDs(e) {
	for (var r = 0; r < e.length; r++)
    {
	var p = e[r];
	!1 === p.innerHTML.includes("<br>") && "_5pcq" === p.className && p.insertAdjacentHTML("beforeend", "<br>" + p.href.replace(/&__xts__%.+/, "").replace(/(\?__xts__%.+|\/\?type=\d&__xts__%.+)/gm, "").replace("permalink.php?", "&nbsp;permalink.php?").replace("/?type=3", "").replace("/groups/", "Group: ").replace("/permalink/", "<br>Post ID: ").slice(24, 100).replace("/", ""))
    /* LINK SANITATIZATION */ p.href = p.href.replace(/(\/\?\S+|\?\S+)/,'');

    /*Hide Public Globe Icon */ setTimeout(function(){ /*alert(e[2].attributes[1].value == "Public"); */ }, 0);
    if( !e[2].parentNode.innerHTML.includes("<span style=\"color:#0b0;\">Public</span>") && window.location.href.match(/\S+\/\d+/) )
       { /* This condition repeats itself twice for whatever reason */
         e[2].insertAdjacentHTML("afterend", "<span style=\"color:#0b0;\">Public</span>");
		 setTimeout(function(){ e[2].setAttribute('style','display:none'); }, 0);
		 if(e.length >1){e[2].nextSibling.nextSibling.remove;}
       }
   }
}