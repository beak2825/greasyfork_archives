// ==UserScript==
// @name     FB: Post Tools & Statistics DEBUG
// @match    https://www.facebook.com/*
// @match    https://*.facebook.com/*
// @match    http://www.facebook.com/*
// @match    http://*.facebook.com/*
// @run-at   document-start
// @grant    GM_addStyle
// @author   JZersche & wOxxOm
// @require  https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @   require  https://momentjs.com/downloads/moment.min.js
// @   require  https://momentjs.com/downloads/moment-with-locales.min.js
// @   require  https://html2canvas.hertzen.com/dist/html2canvas.js
// @version 0.0.1 DEBUG VERSION
// @namespace https://greasyfork.org/users/95175
// @description Shows exact timestamps and post information on Facebook Posts.
// @downloadURL https://update.greasyfork.org/scripts/408525/FB%3A%20Post%20Tools%20%20Statistics%20DEBUG.user.js
// @updateURL https://update.greasyfork.org/scripts/408525/FB%3A%20Post%20Tools%20%20Statistics%20DEBUG.meta.js
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
ExternalURLs(document.querySelectorAll('._52c6'))
//expandSeeMoreText(document.querySelectorAll('.mtm ._5pco'))

document.querySelectorAll('.hasCaption');
// process the stuff added from now on
setMutationHandler(document, 'abbr[data-utime]', expandDates);
setMutationHandler(document, '.q_1zif-zjsq', RecentTimestamps);
setMutationHandler(document, '.q_1zif-zjsq, ._5r69, ._6ks', RecentPostURLs);
setMutationHandler(document, '._52c6', ExternalURLs);


setMutationHandler({
    target: document.querySelector('._5pcr'),
    selector: '.mtm._5pco, ._5pbx.userContent._3576',
    handler: nodes => nodes.forEach(node => {
        console.log('Before —> '+node.childNodes[0].classList);
        let _seemore = node.childNodes[0];
        if(_seemore.classList.length == 1 && _seemore.innerText.match(/\w+\s/)) {
            _seemore.classList.add('text_exposed');
            console.log('After —> '+node.childNodes[0].classList);
        }
    })
})



setMutationHandler({
    target: document.querySelector('._n9'),
    selector: '._n3',
    handler: nodes => nodes.forEach(node => {
        console.log('Before —> '+node.childNodes[1]);
        //if() {

        //}
    })
})

/* — Copy Text Button Functionality — */
setMutationHandler({
    target: document.querySelector('._3576'),
    selector: '.copybtnP',
    handler: nodes => nodes.forEach(node => {
        //node.setAttribute("style", "");
        node.addEventListener('click', function (event) {
            var classCheck = document.getElementsByClassName('canvasArea');
			//console.log(event.target.parentNode.parentNode.nextSibling.nextSibling.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling.className);
			//console.log(event.target.closest("._1dwg._1w_m._q7o").childNodes[0].nextSibling.childNodes[0].nextSibling.className);
			//alert(event.target.previousSibling.innerText);
            if (classCheck.length == 0) {

                //node.parentNode.appendChild(eTxT1);
                getSelection().removeAllRanges();
                var status_content1 = event.target.closest('._1dwg._1w_m._q7o');

                var sName = event.target.closest('._6a._5u5j._6b').children[0].children[0].children[0].children[0];var sTime = event.target.closest('._6a._5u5j._6b').children[1].children[0].children[0].children[0].children[0];
                var sURL = event.target.closest('._6a._5u5j._6b').children[1].children[0].children[0].children[0].children[0].nextSibling.nextSibling;
                var sContent = event.target.closest('.n_1zif-ycce._5eit.h_1zif-v9xd.clearfix').nextSibling;

                var shared_sName = event.target.closest('.n_1zif-ycce._5eit.h_1zif-v9xd.clearfix').nextSibling.nextSibling.nextSibling.children[0].nextSibling.children[0].children[0].children[1].children[0].children[0]

                //var status_content2 = event.target.closest('._1dwg._1w_m._q7o').children[1].children[1];
                var range1 = document.createRange();
                var range2 = document.createRange();
                var range3 = document.createRange();
                var range4 = document.createRange();
                var range5 = document.createRange();

                range1.selectNodeContents(sName);
                range2.selectNodeContents(sTime);
                range3.selectNodeContents(sURL);
                range4.selectNodeContents(sContent);
                range5.selectNodeContents(shared_sName);

                window.getSelection().addRange(range1);
                window.getSelection().addRange(range2);
                window.getSelection().addRange(range3);
                window.getSelection().addRange(range4);
                window.getSelection().addRange(range5);

                var eTxT1 = document.createElement("span"); eTxT1.classList.add("nSpan");
                var eTxT1_class = document.getElementsByClassName("nSpan")[0];
                //var eTxT1_text = document.createTextNode("<br>");
                //eTxT1.appendChild(eTxT1_text);
                node.parentNode.appendChild(eTxT1);

console.log(node);
console.log(document.getElementsByClassName("nSpan")[0].className);
                let ranges = [];
                var selection = window.getSelection();

                for(let i = 0; i < selection.rangeCount; i++) {
                    ranges[i] = selection.getRangeAt(i);
                }

                selection.getRangeAt(3).insertNode(eTxT1); console.log(ranges);


                //alert(window.getSelection() + ' (Workings)');
                ////////var rCon = event.target.closest('._1dwg._1w_m._q7o').textContent = range1.toString() + '<br />' + range2.toString() + '<br />' + range3.toString() + '<br />' + range4.toString();
                //var ts = range1.toString().replace('·','');
                //window.getSelection().addRange(range2);
                //alert(status_content1 + ' (Working)');
            }

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

/* — Insert Copy Text/HTML Button — */
    var nodeCount = 0;
    var NumIncr = 0;

    setMutationHandler({
	target: document.querySelector('._3576'),
	selector: '._5pcp',
	processExisting: false,
	handler: nodes => nodes.forEach(node => {
        /*._5pcq*/ /* node.setAttribute("style", ""); */
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
                  if(!node.parentNode.parentNode.outerHTML.match(/copybtnP"|copybtnHTML"|s2img"/)) {
                    node.insertAdjacentHTML('afterend', '<input type="button" class="copybtnP" name="copyp" value="Copy Text"/>');
                    node.insertAdjacentHTML('afterend', '<input type="button" class="copybtnHTML" name="copyHTML" value="Copy HTML"/>');
                    node.insertAdjacentHTML('afterend', '<input type="button" class="s2img" name="s2img" value="Export Status"/>');console.log(node.parentNode);}
                }
            }, 0);
        })

    });











/* — Copy Test/HTML Button Functionality — */
setMutationHandler({
    target: document.querySelector('._3576'),
    selector: '.copybtnHTML',
    handler: nodes => nodes.forEach(node => {
        //node.setAttribute("style", "");
        nodeCount++;
        try {
               if(node.parentNode.parentNode.closest('.n_1zif-ycce').nextSibling.nextSibling.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0])
               {
                   var youtube_attach = node.parentNode.parentNode.closest('.n_1zif-ycce').nextSibling.nextSibling.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0];
                   //console.log(youtube_attach);
                   if(youtube_attach.href.match(/youtube/)[0] == "youtube")
                   {
                       youtube_attach.parentNode.parentNode.nextSibling.setAttribute("style","position: absolute;top: 0px;height: 72px;left: 170px;padding: 2px;z-index: 0;width: 340px");
                       youtube_attach.children[0].nextSibling.children[0].setAttribute("style", "width: 160px;height: auto;max-width: 175px;max-height: 90px;left: 8px; border-radius:8px; overflow: hidden");
                       youtube_attach.children[1].setAttribute('style','background: #0000;');
                   }
               }
            } catch (Error) {var Error = {name:"YouTube Link not Found ", message:nodeCount}; console.log(Error.name + Error.message);}

        node.addEventListener('click', function (event) {
            var classCheck = document.getElementsByClassName('canvasArea');
			//console.log(event.target.parentNode.parentNode.nextSibling.nextSibling.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.nextSibling.className);
			//console.log(event.target.closest("._1dwg._1w_m._q7o").childNodes[0].nextSibling.childNodes[0].nextSibling.className);
			//alert(event.target.previousSibling.innerText);
            if (classCheck.length == 0) {
                console.log('LENGTH IS 0 [Line 231]');
                //node.parentNode.appendChild(eTxT1);
                getSelection().removeAllRanges();
                var status_content1 = event.target.closest('._1dwg._1w_m._q7o');

                var sName = event.target.closest('._6a._5u5j._6b').children[0].children[0].children[0].children[0];
var sNr = sName.innerHTML;
                event.target.closest('._6a._5u5j._6b').children[0].children[0].children[0].children[0].innerHTML = '&lt;/span class="status_uname"&gt'+sNr+'&lt;/span&gt&lt;br&gt;';

                var sTime = event.target.closest('._6a._5u5j._6b').children[1].children[0].children[0].children[0].children[0];
var sTr = sTime.innerHTML;
                event.target.closest('._6a._5u5j._6b').children[1].children[0].children[0].children[0].children[0].innerHTML = '&lt;span class="status_time"&gt'+sTr+'&lt;/span&gt';

                var sURL = event.target.closest('._6a._5u5j._6b').children[1].children[0].children[0].children[0].children[2];
var sURLr = sURL.innerHTML;
                event.target.closest('._6a._5u5j._6b').children[1].children[0].children[0].children[0].children[2].innerHTML = '<br style="display:block;">&lt;br&gt;&lt;span class=&quot;_hrefURL&quot;&gt'+event.target.closest('._6a._5u5j._6b').children[1].children[0].children[0].children[0].children[2].innerHTML+'&lt;&#47;span&gt';

                var sContent = event.target.closest('.n_1zif-ycce._5eit.h_1zif-v9xd.clearfix').nextSibling;
var sCont = sContent.innerHTML;
                event.target.closest('.n_1zif-ycce._5eit.h_1zif-v9xd.clearfix').nextSibling.innerHTML = '&lt;span class="status_text"&gt'+sCont+'&lt;/span&gt';


                var shared_sName = event.target.closest('.n_1zif-ycce._5eit.h_1zif-v9xd.clearfix').nextSibling.nextSibling.children[0].nextSibling.children[0].children[0].children[1].children[0];

                //var status_content2 = event.target.closest('._1dwg._1w_m._q7o').children[1].children[1];
                var range0 = document.createRange();
                var range1 = document.createRange();
                var range2 = document.createRange();
                var range3 = document.createRange();
                var range4 = document.createRange();
                var range5 = document.createRange();

                range0.selectNodeContents(sName);
                range1.selectNodeContents(sTime);
                range2.selectNodeContents(sURL);
                range3.selectNodeContents(sContent);//range3.collapse(true);
                range4.selectNodeContents(sContent.nextSibling);
range4.setStartAfter(sContent);
range4.setEndBefore(sContent.nextSibling);
                range5.selectNodeContents(shared_sName);
                //range4.collapse(true);

                window.getSelection().addRange(range0);
                window.getSelection().addRange(range1);
                window.getSelection().addRange(range2);
                window.getSelection().addRange(range3);
                window.getSelection().addRange(range4);
                window.getSelection().addRange(range5);

                var r_ins_before = document.createElement("span");
                r_ins_before.classList.add("range_ins_Before");
                var r_ins_before_text = document.createTextNode("BEFORE");
                r_ins_before.appendChild(r_ins_before_text);

                var r_ins_after = document.createElement("span");
                r_ins_after.classList.add("range_ins_After");
                var r_ins_after_text = document.createTextNode("AFTER");
                r_ins_after.appendChild(r_ins_after_text);

                //node.parentNode.appendChild(eTxT1);

                let ranges = [];
                var selection = window.getSelection();

                for(let i = 0; i < selection.rangeCount; i++) {
                    ranges[i] = selection.getRangeAt(i);
                }

                selection.getRangeAt(0).insertNode(r_ins_before);
                selection.getRangeAt(4).insertNode(r_ins_after);
                console.log(ranges);
                console.log(range4.endOffset)


                //alert(window.getSelection() + ' (Workings)');
                ////////var rCon = event.target.closest('._1dwg._1w_m._q7o').textContent = range1.toString() + '<br />' + range2.toString() + '<br />' + range3.toString() + '<br />' + range4.toString();
                //var ts = range1.toString().replace('·','');
                //window.getSelection().addRange(range2);
                //alert(status_content1 + ' (Working)');
 /**********/event.target.closest('._1dwg._1w_m._q7o').insertAdjacentHTML('afterend','<textarea style="max-width: 100%;resize: none;border: none;font-size: 10px !important;line-height: 10px;background-color: #000;color: #262 !important;height: 100px">sdasds</textarea>');
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
	for (var t, a = 0; t = e[a++];)
	{
	  t.querySelector(".full-timestamp") || t.insertAdjacentHTML("beforeend", '<span class="full-timestamp"> on ' + moment(new Date(1e3 * t.dataset.utime)).format("l \\at LTS") + '</span>');
	  if(t.children[0].innerText.match(/[A-Z]\D+\s\d{1,2}\s\D{2}\s\d{1,2}\:\d{2}\s(A|P)M/)) {t.removeChild(t.children[0])}
	};
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
        var r = e[n], a = r.href.replace(/https:\/\/l\.facebook.com\/l.php\?u=/, "");
        console.log('log '+e.length);
        if(r.parentNode.innerHTML.match(/external/) == null) {
            r.parentNode.insertAdjacentHTML("afterend", '<div class="externalURLs">' + decodeURIComponent(a.replace(/\+/g, " ")).replace(/.fbclid=[\D}\d]+/, "").slice(0, 256) + "</div>"); break;
        } else {break;}
    }
}

setMutationHandler({
    target: document.querySelector('.f_1zif-zmj1'),
    selector: '.q_1zif-zjsq',
    handler: nodes => nodes.forEach(node => {
        if(node) {
            var event1 = new MouseEvent('mouseover');
            node.dispatchEvent(event1);
            var _newsfeed__fulltimes = event1.target.title;
            console.log(_newsfeed__fulltimes);
            //if(!node.parentNode.innerHTML.includes(/timess/)) { alert('test');

                //alert(node.parentNode.innerHTML);
setTimeout( function() {
                if(!node.parentNode.innerHTML.includes('timess')) {
                    node.insertAdjacentHTML("beforebegin", "<span class='timess' style='color:#f00;margin-left:0px;'>" + event1.target.title + '</span>');
                    node.parentNode.childNodes[0].parentNode.childNodes[1].setAttribute('style','margin-left:3px;color:#fff!important;background:#000;border-radius:0px;border-left:0px solid #bbb;padding-right:2px;padding-left:4px!important;z-index: 0;font-weight: 600;font-family: \'Segoe UI\';font-size:13px;');
                }
}, 1000)
            //alert(node.parentNode.innerHTML);
            //node.previousSibling.setAttribute('style','background:red!important;border-radius:6px!important;');
            //var ago_formatter = node.parentNode.childNodes[1].parentNode.childNodes[1].innerText.match(/([0-9]{1,2}\D)/);
            //alert(node.parentNode.childNodes[0].parentNode.childNodes[1].innerHTML.length);
            //node.parentNode.innerText = ago_formatter;

        }
    })

});

setMutationHandler({
    target: document.querySelector('._1dwg._1w_m._q7o'),
    selector: '._5ptz',
    handler: nodes => nodes.forEach(node => {
        if(!node.parentNode.innerHTML.includes("<br>")) {
            /* DISPLAYED URL SANITIZATION */ var hrefp = node.parentNode.href.replace(/(\?__xts__%\S+)/,"<span style='color:lime!important;display:none;'> $1 </span>").replace(/(\&__xts__\S+)/,"<span style='color:red!important;display:none;'> $1 </span>").replace(/(https:\/\/www.facebook.com\/#)/,"<span style='display:none!important;color:orange!important;display:none;'> $1</span>").replace(/(https:\/\/www.facebook.com\/)/,"<span style='color:indigo!important;display:none;'> $1</span>").replace(/(\/\?story_token=S%3A_)/,"<span style='color:#f0f!important;display:;'><br>Story Token: </span>").replace(/(\w+)(\%3A)(\w+)/,"<span style='color:#f0f!important;'>$1:$3</span>");
            /* HREF LINK SANITIZATION */ node.parentNode.href = node.parentNode.href.replace(/(.__xts__.+)/,"#FBTools");
            node.parentNode.setAttribute('style','background:red!important;border-radius:6px!important;');
            node.insertAdjacentHTML("beforeend", "<br><span class='_hrefURL'>" + hrefp + '</span>');

        }
    })

});

setMutationHandler({
    target: document.querySelector('._5pcp._5lel._2jyu._232_'),
    selector: '._5pcq',
    handler: nodes => nodes.forEach(node => {
        if(!node.innerHTML.includes("<br>")) {
            if(!window.location.href.match(/Galactic/)){
            /* DISPLAYED URL SANITIZATION */ var hrefp = node.href.replace(/(\?__xts__%\S+)/,"<span style='color:lime!important;display:none;'> $1 </span>").replace(/(\&__xts__\S+)/,"<span style='color:red!important;display:;'> $1 </span>").replace(/(https:\/\/www.facebook.com\/#)/,"<span style='display:none!important;color:orange!important;display:;'> $1</span>").replace(/(https:\/\/www.facebook.com)(\/\S+#)/,"<span style='color:#f64!important;display:none;'>aaaa</span>").replace(/(\/\?story_token=S%3A_)/,"<span style='color:#f0f!important;display:;'><br>Story Token: </span>").replace(/(\w+)(\%3A)(\w+)/,"<span style='color:#f0f!important;'>$1:$3</span>").replace(/\/\?type=3/,'<br>FB Post Tools 2020');
                node.insertAdjacentHTML("beforeend", "<br><span class='_hrefURL'>" + hrefp + '</span>');
}

            /* HREF LINK SANITIZATION */ node.href = node.href.replace(/(.__xts__.+)/,"#FBTools");
            node.setAttribute('style','border:0px solid #fff!important;border-radius:12px;line-height:14px!important;letter-spacing:-0.15px!important;');
            //node.insertAdjacentHTML("beforeend", "<br><span class='_hrefURL'>" + hrefp + '</span>');

        }
    })

});

