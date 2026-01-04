// ==UserScript==
// @name        BlueCat Address Manager Copy to Clipboard on Hover
// @namespace   *
// @description Add a copy to clipboard button to table cell while hovering over it in Table View in BlueCat Address Manager
// @include     */app*
// @version     4
// @grant       none
// @author      Marius Galm
// @copyright   2018, Marius Galm
// @license		MIT
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-32x32.png
// @require     http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/370412/BlueCat%20Address%20Manager%20Copy%20to%20Clipboard%20on%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/370412/BlueCat%20Address%20Manager%20Copy%20to%20Clipboard%20on%20Hover.meta.js
// ==/UserScript==

//copy function
function copyThis() {
    var btn = document.getElementById("copybtn");
    if (btn !== undefined) {
        var parent = btn.parentNode;
        var text = parent.innerText.trim();
        if (text !== "") {
            copyTextToClipboard(text);
        } else {
            var span = parent.getElementsByTagName("span");
            if (span !== undefined) {
                var spantext = span[0].innerText.trim();
                copyTextToClipboard(spantext);
            }
        }
    }
};

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;
    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        var msgtext = 'Copying text command was ' + msg + '- Copied: "' +text+'"';
        //console.log('Copying text command was ' + msg);
        tempAlert(msgtext,1000);
    } catch (err) {
        console.log('Oops, unable to copy');
    }
    document.body.removeChild(textArea);
}

function tempAlert(msg,duration)
{
 var el = document.createElement("div");
 el.setAttribute("style","position:fixed;top:3%;left:50%;background-color:rgba(0,0,0,0);");
 el.innerHTML = msg;
 setTimeout(function(){
  el.parentNode.removeChild(el);
 },duration);
 document.body.appendChild(el);
}

if (document.readyState === "interactive" ) {

    //button to add
    var img = document.createElement('img');
    img.id = "copybtn";
    img.src = "/images/icons/small/copy.gif";
    img.border="0";
    img.style = "display: inline; height: 75%; padding-top: 2px;";
    img.alt="Copy to clipboard";
    img.title="Copy to clipboard";
    img.addEventListener('click', function () {
        copyThis();
    }, false);
    //console.log(img);

    //jQuery fix - is now broken or not necessary any more
    //this.$ = this.jQuery = jQuery.noConflict(true);

    // object detail fields
    $(".detailsPane-fieldValue").hover(
        function () {
            //console.log($(this));
            if ($(this)[0].innerText.trim() !== "") {
                var text2 = $(this)[0].innerText;
                // if text doesn't contains newline
                //console.log(text2);
                var match = /\r|\n|^No$|^Yes$/.exec(text2);
                if (!match) {
                    if ($(this)[0].scrollWidth > $(this).innerWidth()) {
                        //Text has over-flown, add before the text (will collide with sCC though
                        $(this)[0].insertBefore(img,$(this)[0].firstChild);
                    } else {
                        // append
                        var parHeight = $(this)[0].scrollHeight;
                        if (parHeight >= 25) {
                            img.height = parHeight - 14;
                        } else if (parHeight >= 21) {
                            img.height = parHeight - 9;
                        } else {
                            //img.height = "75%";
                        }
                        $(this)[0].appendChild(img);
                    }
                    //console.log($(this));
                }
            }
        },
        function () {
            $("#copybtn").remove();
        }
    );

    // table values no header
    $("#outerTable tr td").not(':first').hover(
        function () {
            var list = $(this)[0].classList;
            if (list.contains("skinImage")||list.contains("first-selection")||list.contains("percent-bar-used")||list.contains("percent-bar-free")||list.contains("percent-bar")||list.contains("percent-bar-gateway")||list.contains("percent-bar-dhcp-reserved")||list.contains("percent-bar-static")||list.contains("percent-bar-dhcp-allocated")||list.contains("percent-bar-reserved")) {
                // list will probably grow
                //console.log($(this)[0].classList[0]);
            } else {
                if ($(this)[0].innerText.trim() !== "") {
                    var text2 = $(this)[0].innerText;
                    // if text doesn't contains newline
                    //console.log(text2);
                    var match = /\r|\n|^No$|^Yes$/.exec(text2);
                    if (!match) {
                        if ($(this)[0].scrollWidth > $(this).innerWidth()) {
                            //Text has over-flown, add before the text (will collide with sCC though
                            $(this)[0].insertBefore(img,$(this)[0].firstChild);
                        } else {
                            // append
                            var parHeight = $(this)[0].scrollHeight;
                            if (parHeight >= 25) {
                                img.height = parHeight - 14;
                            } else if (parHeight >= 21) {
                                img.height = parHeight - 9;
                            } else {
                                //img.height = "75%";
                            }
                            $(this)[0].appendChild(img);
                        }
                        //console.log($(this));
                    }
                }
            }
        },
        function () {
            $("#copybtn").remove();
        }
    );
}