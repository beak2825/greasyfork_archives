// ==UserScript==
// @name     FB: Full Timestamps 2019
// @match    https://www.facebook.com/*
// @match    https://*.facebook.com/*
// @match    http://www.facebook.com/*
// @match    http://*.facebook.com/*
// @run-at   document-start
// @grant    GM_addStyle
// @author   wOxxOm & JZersche
// @require  https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @[REMOVE]require  https://momentjs.com/downloads/moment.min.js
// @[REMOVE]require  https://momentjs.com/downloads/moment-with-locales.min.js
// @[REMOVE]require  https://html2canvas.hertzen.com/dist/html2canvas.js
// IF YOU DO NOT REMOVE [REMOVE] from the above lines, it will not work!
// @version 3.71
// @namespace https://greasyfork.org/users/95175
// @description Shows full timestamps on Facebook posts
// @downloadURL https://update.greasyfork.org/scripts/371113/FB%3A%20Full%20Timestamps%202019.user.js
// @updateURL https://update.greasyfork.org/scripts/371113/FB%3A%20Full%20Timestamps%202019.meta.js
// ==/UserScript==

var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: '2-digit'
};

GM_addStyle(
    '.full-timestamp { opacity: 0.95; color: #f00!important; }' +
    '.full-timestamp:hover { opacity: 1.0; }' +
    '.full-timestamp:before { content: ""; }' +
    '.full-timestamp:after  { content: ""; }' +
    '.timestampContent { display: none; }' +
    '._5ptz.timestamp.livetimestamp .timestampContent { display: inline-block; }' +
    '.sponsored { color: #06b;}' +
    '.copybtnP { margin-bottom: 8px }' +
    '._3ds9 {border: 2px dashed #e0e !important; border-radius:15px; padding-bottom: 0px !important; margin-bottom: 8px !important;}' +
    '.copybtn, .copybtnP, .s2img { border: 1px solid #e2e4e5; background: #fff; color: #365899; border-radius: 8px; display: block; letter-spacing: 0.05px;font-weight: 700;height: 23px;}' +
    '.canvasArea {height:250px;overflow:auto;color:#f0f;word-break: break-all;display:inline-block;font-size:12px;letter-spacing: -0.15px;font-family: "Segoe UI";line-height: 11px;text-align: justify;margin-top:5px;margin-bottom:5px;background: #00000010;border-radius: 10px;border:1px dashed #f0ff;padding:10px;}' +
    'div._3ekx._29_4 div._6m3._--6 div._59tj._2iau { top: 7px !important;position: relative;}' +
    'span.externalURLs { position: absolute;color: #606770;padding-left: 2px;display: inline-block;top: 4px;width: 489px;font-size: 8px;border-radius: 3px;background: #f2f3f5;left: 3px;white-space: pre;text-overflow: ellipsis;overflow: hidden;border: 1px dashed #bec3c9;}'
);

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
    handler: nodes => nodes.forEach(node => {
        node.setAttribute("style", "color: red; border: 1px solid red; float:left;");
        node.addEventListener('click', function(event) {
            node.setAttribute("style", "color: #5550; border: 0px solid black; float:left;");
            node.nextSibling.setAttribute("style", "color: #5550; border: 0px solid black;");
            var iCapture = document.querySelector('._3576').parentNode.parentNode;
            html2canvas(iCapture, { allowTaint: false, useCORS: true }).then(canvas => {
                node.insertAdjacentHTML('afterend', '<div class="canvasArea">'+canvas.toDataURL("image/png")+'</div>');
                setTimeout(function(){
                    node.setAttribute("style", "color: red; border: 1px solid red; float:left;");
                    node.nextSibling.nextSibling.setAttribute("style", "color: blue; border: 1px solid blue;");
                }, 0);
            })
        });
    })
});


/* — Insert Copy Text Button — */
setMutationHandler({
    target: document.querySelector('._3576'),
    selector: '.copybtnP',
    handler: nodes => nodes.forEach(node => {
        node.setAttribute("style", "color:blue; border: 1px solid blue;");
        node.addEventListener('click', function(event) {
            var classCheck = document.getElementsByClassName('canvasArea');
            var status_content = event.target.previousSibling.previousSibling;

            if (classCheck.length > 0) {
                status_content = event.target.previousSibling.previousSibling.previousSibling;
            }
                    //alert(status_content + ' (Working)');
                    //alert(event.target.previousSibling.innerText);
              getSelection().removeAllRanges();
              var range = document.createRange();
              range.selectNode(status_content);
              window.getSelection().addRange(range);







try { var successful = document.execCommand('copy');
var msg = successful ? 'successful' : 'unsuccessful';
//console.log('Copying text command was ' + msg);
} catch (err) {console.log('Oops, unable to copy');}
              return false;
          })
    })

});

/* — Gather Status Information — */
var nodeCount = 0; var NumIncr = 0;
setMutationHandler({
    target: document.querySelector('._3576'),
    selector: '._3576',
    processExisting: false,
    handler: nodes => nodes.forEach(node => { nodeCount++;
                               /*console.log(nodeCount);*/
        node.style.color = '#f06';
/* Set a delay so script shows last */
        setTimeout(function() {
            if (!node.parentNode.innerHTML.match(/copybtnP"|s2img"/)){
                //console.log('(' + NumIncr++ + ') ' + node.innerText);
                console.log(node.innerText);
node.insertAdjacentHTML('afterend','<input type="button" class="copybtnP" name="copyp" value="Copy Text"/>');
node.insertAdjacentHTML('afterend', '<input type="button" class="s2img" name="s2img" value="Save As Image"/>');}
}, 0);
})

});

setMutationHandler(
{
    target: document.querySelector('.fbPhotosPhotoCaption'),
    selector: '.hasCaption',
    handler: nodes => nodes.forEach( node => {node.style.color = '#f00';
    var PhotoCaption = document.getElementsByClassName('hasCaption')[0]; console.log('Current Image: '+PhotoCaption.innerText);

if (!document.getElementsByClassName('fbPhotosPhotoCaption')[0].innerHTML.includes('copybtn"')){
    PhotoCaption.insertAdjacentHTML('afterend','<input type="button" class="copybtn" name="copy" value="Copy"/>');
}
    var copyTextareaBtn = document.querySelector('.copybtn');
    copyTextareaBtn.addEventListener('click', function(event) {
    var copy_text = document.getElementsByClassName("hasCaption")[0];
    var range = document.createRange();
    range.selectNode(copy_text);
    window.getSelection().addRange(range);

    try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
}
    catch (err) {console.log('Oops, unable to copy');}
});
})
});

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function expandDates(e){for(var t,a=0;t=e[a++];)t.querySelector(".full-timestamp")||t.insertAdjacentHTML("beforeend",'<span class="full-timestamp"> on '+moment(new Date(1e3*t.dataset.utime)).format("l \\at LTS"))}
function RecentTimestamps(e){for(var t,n=0;t=e[n++];)if(!t.querySelector(".full-timestamp")){if(1==t.innerText.includes("min")){var a=t.innerText.match(/[0-9]{1,2}/),s=parseInt(a,10);t.insertAdjacentHTML("beforeend",'<span class="full-timestamp"> <span style="color:#365899">('+moment(new Date).subtract(s,"minutes").format("h:mm:ss A")+' ≃ <span style="color:#365899">ᴀᴘᴘʀᴏxɪᴍᴀᴛᴇ)</span><br>')}if(1==t.innerText.includes("hr")){var r=t.innerText.match(/[0-9]{1,2}/),m=parseInt(r,10),o=10*parseInt(moment(new Date).format("mm")/10,10),l=10*parseInt(moment(new Date).format("ss")/10,10);t.insertAdjacentHTML("beforeend",'<span class="full-timestamp"> <span style="color:#365899">on '+moment(new Date).subtract(m,"hours").format("l \\at h:")+pad(o,2)+":"+pad(l,2)+'<span style="color:#365899"> ≃ (ᴀᴘᴘʀᴏxɪᴍᴀᴛᴇ)</span><br>')}}}
function RecentPostURLs(e){

if(e.parentNode) {
    for(var a=0;a<e.length;a++){
        var r=e[a];
        !1===r.innerHTML.includes("<br>")&&"_5r69"!=r.className&&(r.getElement,r.insertAdjacentHTML("afterend",'<br><span style="color:#9c9dc3">'+r.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling.href.replace(/\?fref=nf/,"").replace("&__tn__=","").replace("&__tn__=m-R","").replace("7%2Cdm-R-R","").replace("%2Cdm-R-R","").replace(/&eid=.+/,"").match(/facebook.com\/[a-z|A-Z|[0-9|\-|_|.]+.[a-zA-Z|[0-9|\-|_|.|]+[a-zA-Z|[0-9|\-|_|.|?=]+/)+"</span>"))}
}

}
function ExternalURLs(e){for(var n=0;n<e.length;n++){var r=e[n],a=r.href.replace(/https:\/\/l\.facebook.com\/l.php\?u=/,"");!1===r.innerHTML.includes("<br>")&&"_5r69"!=r.className&&r.insertAdjacentHTML("afterend",'<span class="externalURLs">'+decodeURIComponent(a.replace(/\+/g," ")).replace(/.fbclid=[\D}\d]+/,"").slice(0, 256)+"</span>")}}
function expandPostIDs(e){for(var r=0;r<e.length;r++){var p=e[r];!1===p.innerHTML.includes("<br>")&&"_5pcq"===p.className&&p.insertAdjacentHTML("beforeend","<br>"+p.href.replace(/(\?__xts__%.+|\/\?type=\d&__xts__%.+)/gm,"").replace("permalink.php?","&nbsp;permalink.php?").replace("/groups/","Group: ").replace("/permalink/","<br>Post ID: ").slice(24,100).replace("/",""))}}
