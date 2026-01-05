// ==UserScript==
// @name        CMS Extension
// @include     http://*.sharpschool.com/*
// @version     1.0.6
// @grant       none
// @description This script simplifies content migration.
// @namespace https://greasyfork.org/users/14054
// @downloadURL https://update.greasyfork.org/scripts/11531/CMS%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/11531/CMS%20Extension.meta.js
// ==/UserScript==
// This is the server address, used to connect to server.exe
var server = 'http://localhost:9000';
// This is the text area for the HTML editor.
var textArea;
// Initializing a DOM parser
var parser = new DOMParser();
// Initializing a second DOM, synchronized with the source code in the editor
var DOM2;
// Initializing a list used to store URLs
var queue = [];
// Initializing server folder name for ajax call
var serverFolder;

$(document).ready(function() {
    detect()
});


function detect() {
    $.ajax({
        url: server,
        method: 'HEAD',
        success: function() {
            main();
            clearInterval(serverListener)
        }
    })
}

// Detect if server.exe is running every 2000 miliseconds; execute the rest only if the server.exe is on

var serverListener = setInterval(detect, 2000);

// Decides which part will be executed based on the page type
function main() {
    if (Boolean(document.URL.match(/action=edit/i)) && Boolean(document.URL.match(/portletAction=pageedit/i))) {
        execContent();
    } else if (Boolean(document.URL.match(/action=addextlinkpage/i)) || Boolean(document.URL.match(/action=editextlinkpage/i))) {
        execExt();
    };

    function execContent() {

        // Avoid form submission by pressing Ent
        $(document).ready(function() {
            $(window).keydown(function(event) {
                if (event.keyCode == 13) {
                    event.preventDefault();
                    return false;
                }
            });
        });
        // Inject UI when creating or modifying a content space page
        $(window).ready(function() {
            // Inject UI only once
            if (typeof $('div #ExtensionPlaceHolder')[0] == 'undefined') {
                $('div[id*="divInlineEdit"]').after($('<div id="ExtensionPlaceHolder"></div>').load(server))
            }
        });
        // Create an observer instance for editor mode
        (function() {
            var observer = new MutationObserver(function() {
                if ($('a.reMode_html').hasClass('reMode_html reMode_selected')) {
                    $('#overlay').fadeOut();
                } else {
                    $('#overlay').fadeIn();
                }
            });
            var options = {
                'attributes': true,
                'subtree': true
            };
            observer.observe($('.reEditorModes')[0], options)
        })();
        // Button binding
        $(document).on('click', '#startBtn', function() {
            if (queue.length > 0) {
                sendElem(0);
                $("#loadBtn, #stripBtn, #startBtn").prop("disabled", true);
                $(".reEditorModes").fadeOut();
            }

        }).on('click', '#stripBtn', strip).on('click', '#loadBtn', function() {
            textArea = $('td[id*="reEditArea"].reContentCell iframe:last-child')[0].contentDocument.body.childNodes[0];
            updateDOM();
            createDOMObserver();
            displayRows();
        }).on('click', '#loadBtn', function() {
            textArea = $('td[id*="reEditArea"].reContentCell iframe:last-child')[0].contentDocument.body.childNodes[0];
            updateDOM();
            createDOMObserver();
            displayRows();
            sendPageInfo();
        }).on('focus', '.URLBox', function() {
            $(this).css({
                'background-color': '#333333'
            })
        }).on('blur', '.URLBox', function() {
            $(this).blur(function() {
                $(this).css({
                    'background-color': ''
                })
            });
        }).on('mouseover', '.URLBox', function() {
            $(this).css({
                'color': '#AAAAAA'
            })
        }).on('mouseleave', '.URLBox', function() {
            $(this).css({
                'color': ''
            })
        });
    }
}
// Retrieve HTML code in the editor and pass it to DOM2

function updateDOM() {
    DOM2 = parser.parseFromString(textArea.value, 'text/html');
    console.log('DOM Updated.')
}
// Update the text area according to DOM

function updateText() {
    textArea.value = DOM2.body.innerHTML
}
// Create an observer instance for DOM2

function createDOMObserver() {
    observer = new MutationObserver(function() {
        updateText()
    });
    var options = {
        'attributes': true,
        'subtree': true
    };
    observer.observe(DOM2.querySelector('html'), options)
}
// This function removes the HTML formatting once called

function strip() {
    // Remove attributes
    var attrToRemove = [
        'class',
        'id',
        'style',
        'target'
    ];
    for (i = 0; i < attrToRemove.length; i++) {
        $(DOM2).find('*').removeAttr(attrToRemove[i]);
    };
    // Remove the following nodes
    var nodeToRemove = [
        'script',
        'style'
    ];
    for (i = 0; i < nodeToRemove.length; i++) {
        $(DOM2).find(nodeToRemove[i]).each(function() {
            this.remove()
        })
    };
    // Remove the following tags
    tagToRemove = [
        'span',
        'font'
    ];
    for (i = 0; i < tagToRemove.length; i++) {
        $(DOM2).find(tagToRemove[i]).contents().unwrap();
    };
    // Remove comments
    $(DOM2).find('*').contents().each(function() {
        if (this.nodeType == Node.COMMENT_NODE) {
            $(this).remove()
        }
    })
}
// This method returns the last element of an array.

Array.prototype.last = function() {
        return this[this.length - 1]
    }
    // This function returns an array of string, each string represents the page title, from parent to child.

function getPageList() {
    var last = $('#breadcrumbs span:last-child')[0];
    if (last == undefined) {
        return []
    } else {
        var dir = [];
        $('#breadcrumbs a').each(function() {
            dir.push(this.textContent)
        });
        dir.push(last.textContent);
        dir.shift(0);
        return dir
    }
}
// Use ajax to get serverFolder
(function() {
    $.ajax({
        url: 'http://' + document.domain + '/cms/FileAdministration/FileExplorer.aspx',
        dataType: 'html',
        success: function(data) {
            var parser,
                doc,
                address;
            parser = new DOMParser();
            doc = parser.parseFromString(data, 'text/html');
            address = doc.getElementById('radFileExploer_address').value;
            serverFolder = address.split('/')[3]
            console.log("The server folder is: " + serverFolder)
        }
    })
})();
// Returns the ProdX folder based on the domain

function getProdFolder() {
    var domain = document.domain;
    var number = domain.split('.')[1].replace('ss', '');
    return 'Prod' + number
}
// Send page information to server.exe

function sendPageInfo() {
    var info = {
        PAGEINFO: {
            prod: getProdFolder(),
            serverFolder: serverFolder,
            pageList: getPageList()
        }
    };
    $.ajax({
        url: server,
        type: 'POST',
        data: JSON.stringify(info),
        crossDomain: true,
        error: function(res, err) {
            console.log(err)
        },
        success: function() {
            console.log('Page info sent.')
            $(document).find('#stripBtn, #startBtn').prop('disabled', null)
        }
    })
}
// Add one row to the summary table based on a node in DOM2

function addRow(e) {
    var newRow = $('<div class="rowBox"><input class="linktext" readOnly="true" type="text" value=""><input class="URLBox" type="text" value="" readonly="true" onclick="this.readOnly=\'\'"><input type="text" class="status" value="Ready" readonly="true">');
    $(newRow).find('.linktext').val(linkText(e));
    if (e.tagName == 'A') {
        $(newRow).find('.URLBox').val(e.getAttribute('href')).change(function() {
            e.href = $(this).val()
        });
    } else {
        $(newRow).find('.URLBox').val(e.getAttribute('src')).change(function() {
            e.src = $(this).val()
        });
    };
    $('#scrollBox').append(newRow);
    return [$(e),
        newRow
    ]
}
// Get link text from an element

function linkText(e) {
    if (e.tagName == 'A') {
        return e.text.replace(/^[ \n\t\r]*|[ \n\t\r]*$/g, '')
    } else {
        return '<img>'
    }
}

// Scroll to the i-th row
function animatedScrollTo(i) {
    var offset = 140,
        $row1 = $(".URLBox:eq(1)"),
        s = ".URLBox:eq(" + String(i + 2) + ")",
        $scrollBox = $("#scrollBox"),
        $target = $(s);
    try {
        value = $target.get(0).offsetTop - $row1.get(0).offsetTop - offset
    } catch (err) {
        return
    };
    $scrollBox.animate({
        scrollTop: value
    }, 100)
}

// Display rows of URLs in the summary list, tag is either "IMG" or "A"

function displayRows() {
    queue = [];
    $('#scrollBox').html('');
    $(DOM2).find('a').each(function() {
        queue.push(addRow(this))
    });
    $(DOM2).find('img').each(function() {
        queue.push(addRow(this))
    });
}

// Go to the end of the input box once called
function toTheEnd(i) {
    var queryString = ".URLBox:eq(" + i + ")";
    var elem = $(queryString).get(0);
    var len = elem.value.length;
    elem.click()
    elem.selectionStart = len;
    elem.selectionEnd = len;
    elem.blur()
}

// Start Button, i starts from 0 (first URL)

function sendElem(i) {
    animatedScrollTo(i);
    if (queue[i]) {
        $.ajax({
            url: server,
            beforeSend: function(xhr) {
                xhr.overrideMimeType('application/json');
            },
            type: 'POST',
            data: JSON.stringify({
                START: {
                    URL: URLattr(i),
                    tagName: tagName(i)
                }
            }),
            crossDomain: true,
        });
        var realtimeStatus = setInterval(function() {
            checkStatus(function(data) {
                stat = data.status;
                setStatus(i, stat);
                if (stat == 'Skipped' || stat.match(/^Error/i) != null || stat == 'Session Expired' || stat == 'Done') {
                    toTheEnd(i);
                    clearInterval(realtimeStatus);
                    URLattr(i, data.URL);
                    sendElem(i + 1)
                } else {
                    return
                }
            })
        }, 300)
    } else {
        $("#loadBtn, #stripBtn, #startBtn").prop("disabled", false);
        $(".reEditorModes").fadeIn();
    }
}
// Check status

function checkStatus(callback) {
    $.getJSON(server + '/status', function(data) {
        // data = {status: "string"}
        callback(data)
    })
}
// Helper functions to set status tag name and URLs

function setStatus(i, status) {
    var $r = queue[i][1];
    $r.find('.status').val(status)
}
// Return the i-th tag name in queue

function tagName(i) {
    var $e = queue[i][0];
    return $e.prop('tagName')
}
// Return the i-th URL if url is not specified; otherwise change to url

function URLattr(i, url) {
    var $r = queue[i][1];
    var $e = queue[i][0];
    if (url) {
        $r.find('.URLBox').val(url);
        if (tagName(i) == 'A') {
            $e.attr('href', url)
        } else {
            $e.attr('src', url)
        }
    } else {
        if (tagName(i) == 'A') {
            return $e.attr('href')
        } else {
            return $e.attr('src')
        }
    }
}
// The following functions are used for external link editor

function execExt() {
    var $inputBox = $('input[id*="txtUrl"]');
    var $protocol = $('select[id*="ddlProtocol"]')
        // Inject Status Box
    if (typeof $('div #extLinkUI')[0] == 'undefined') {
        $('span[id*="txtUrl_ErrFlag"]').after($('<div style="padding:2px" id="extLinkUI"><button type="button" id="chkBtn">Check</button><input style="border:none; position: relative; cursor: default; font-family: consolas; padding-left: 10px" type="text" readlonly="true" id="statusBox" value="Ready"></div>')).ready(function() {
            $('#chkBtn').click(function() {
                sendPageInfo();
                send()
            })
        })
    }
    // Get the external link in the text box

    function getExternal() {
        if ($inputBox.val().match(new RegExp('^(http://|https://)')) == null) {
            var url = $protocol.val() + $inputBox.val()
        } else {
            var url = $inputBox.val()
        }
        return url
    }
    // Mutates the status

    function setExtStatus(st) {
        $('#statusBox').val(st)
    }
    // Send the information to server.exe

    function send() {
        $.ajax({
            url: server,
            beforeSend: function(xhr) {
                xhr.overrideMimeType('application/json');
            },
            type: 'POST',
            data: JSON.stringify({
                START: {
                    URL: getExternal(),
                    tagName: 'A'
                }
            }),
            error: function(data, err) {
                console.log(err)
            },
            success: function() {
                $("#chkBtn").prop("disabled", true);
            },
            crossDomain: true,
        });
        var realtimeStatus = setInterval(function() {
            checkStatus(function(data) {
                stat = data.status;
                setExtStatus(stat);
                if (stat == 'Skipped' || stat.match('Error') != null) {
                    clearInterval(realtimeStatus);
                    $("#chkBtn").prop("disabled", false);
                } else if (stat == 'Done') {
                    clearInterval(realtimeStatus);
                    $inputBox.val(data.URL);
                    $("#chkBtn").prop("disabled", false);
                    $("input[id*='rblTypes_1']").prop("checked", true);
                }
            })
        }, 200)
    }
}