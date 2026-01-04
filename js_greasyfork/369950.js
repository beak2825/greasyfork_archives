// ==UserScript==
// @name            GraphFi
// @description     My first GM script from a bookmarklet
// @include         https://*.metafilter.com/*
// @exclude         https://www.metafilter.com/
// @exclude         https://ask.metafilter.com/
// @exclude         https://metatalk.metafilter.com/
// @exclude         https://fanfare.metafilter.com/
// @exclude         https://www.metafilter.com/user/*
// @exclude         https://www.metafilter.com/contribute/*
// @exclude         https://*.metafilter.com/favorited/*

// @version 0.0.1.20180701222836
// @namespace https://greasyfork.org/users/6524
// @downloadURL https://update.greasyfork.org/scripts/369950/GraphFi.user.js
// @updateURL https://update.greasyfork.org/scripts/369950/GraphFi.meta.js
// ==/UserScript==

(function() {

var selectingShadowColor = "#444"
var classicTheme = !!$("#body").length;
var background = classicTheme ? "inherit" : $("body > .content").css("background-color");

var bar = $("<div/>").css({
    'position': 'fixed',
    'top': '0',
    'left': '0',
    'width': '150px',
    'height': '100%',
    'color': 'white',
    'zIndex': 100,
}).append(
    // background for bar container.
    $("<div/>").css({
        'position': 'absolute',
        'width': '100%',
        'height': '100%',
        'background-color': 'black',
        'opacity': '0.8',
        'z-index': -1
    })
);
var tooltip = $("<div/>").css({
    "position": "absolute",
    "padding": "1em",
    "border": "1px solid black",
    "margin-top": "-0.5em",
    "box-shadow": "0px 0px 12px #000",
    "width": "80%",
    "opacity": "0.95",
    "left": classicTheme ? bar.width() + "px" : "0px",
    "font-size": classicTheme ? "12px" : "90%",
    "display": "none",
    "background-color": background ,
    "z-index": 10000
}).html("&nbsp;").addClass("content");

$("body").append(tooltip);
var canvasHolder = $("<div/>").css({
    'position': 'absolute',
    'box-sizing': 'border-box',
    'border-top': '37px solid #595959',
    'width': '100%',
    'height': '100%',
    'bottom': 0,
    'z-index': 0
});
bar.append(canvasHolder);
// Close everything.
bar.append(
    $("<div>GraphFi</div>").css({
        'border-top': "3px solid #9cc754",
        'position': "absolute",
        'font-weight': 'bold',
        "top": 0,
        "left": 0,
        "width": "100%"
    })
);
bar.append(
    $("<a/>").attr( "href", "").click(function() {
        // Lazy reset -- just refresh page.
        window.location.reload();
        return false;
    }).html("&times;").css({
        "position": "absolute",
        "color": "#eee",
        "top": 0,
        "right": 0
    })
);

$("body").append(bar);
$("body").css({"margin-left": "150px"});
var loading = $("<div/>").html("Loading GraphFi...").css({
    "position": "absolute",
    "top": "2em",
    "padding": "1em",
    "left": "0em",
    "background-color": "black",
    "color": "white",
    "font-weight": "bold",
    "z-index": 100
});
$(bar).append(loading);

var comments = [];
var minBarHeight = 5;
var max_num_favs = 1;
var minComment = 0;
// bar dimensions
var cChunk, cWidth, cHeight, maxCommentsAtOnce;
// page dimensions
var viewportHeight, canvasPageHeight, canvasPageY, 
    minCommentInViewport, maxCommentInViewport;
// canvas
var canvas, ctx, selected, hovered;

// Redirect through setTimeout to allow loading message to show before blocking
window.setTimeout(initialize, 0);
function initialize() {
    loading.show();
    loadComments();
    window.setTimeout(function() {
        extractQuotes();
    }, 0);
}
function initialize2() {
    // These are called after the lengthy "extractQuotes" operation finishes.
    loading.html("Adding references...");
    window.setTimeout(function() {
        addReferences();
        getOffsets();
        loading.html("Doing a jig...");
        window.setTimeout(function() {
            setUpCanvas();
            setUpInteraction();
            $(window).scroll(); // triggers drawing update.
            if (comments.length > 0) {
                loading.hide();
            }
        }, 0);
    }, 0);
}

/****************************************************
* Parse the page.
****************************************************/
var cdata = [];
function loadComments() {
    // Get all the comments, and extract data on favorites, author, time, and text.
    $("div.comments").each(function(i, comment) {
        if (i < comments.length) {
            // If we've already parsed this comment, no need to do it again.
            return;
        }
        var c = $(comment);
        var anchor = c.prev("a");
        if (anchor.length > 0) {
            var num = 0;
            var author = "";
            var time = "";
            c.find("span.smallcopy a").each(function(i, a) {
                var href = $(a).attr("href");
                if (href) {
                    if (href.indexOf("/favorited/") != -1) {
                        var txt = $(a).text()
                        num = parseInt($(a).text().replace(/[^\d]/, ""));
                    } else if (href.indexOf("/user/") != -1) {
                        author = $(a).text();
                    } else if (href.indexOf("#") != -1) {
                        time = $(a).text();
                    }
                }
            });
            max_num_favs = Math.max(num, max_num_favs);
            cdata.push({
                "favorites": num,
                "link": "#" + $(anchor).attr("name"),
                "author": author,
                "time": time,
                "text": $.trim(c.text()).replace(/\s+/g, " ")
            });
            comments.push(c);
        }
    });
}
var extractedUpTo = 0;
function extractQuotes() {
    // Get quotes in comments.
    loading.html("Parsing comments: " + extractedUpTo + "/" + comments.length);
    var i = extractedUpTo;
    while(i < comments.length) {
        var c = comments[i];
        // list of comment indices that this comment quotes
        var quotes = []; 
        // map of quote indices to quoting elements
        var quoteElements = {};
        // "replies" is a map of quote indices that quote this comment
        function logReply(orig) {
            var replies = cdata[orig].replies;
            if (replies == undefined) {
                replies = [];
            }
            replies.push(i);
            cdata[orig].replies = replies;
        }
        // get plain text quotes
        c.children("blockquote, i, em").each(function(k, el) {
            var text = $.trim($(el).text().replace(/\s+/g, " "));
            // heuristic: avoid short things that are probably just emphasis
            if (text.length > 20) {
                for (var j = 0; j < i; j++) {
                    if (i == j) {
                        continue;
                    }
                    if ($.inArray(j, quotes) == -1) {
                        if (cdata[j].text.indexOf(text) != -1) {
                            // quote match found.
                            logReply(j);
                            quotes.push(j);
                            quoteElements[j] = $(el);
                            break;
                        }
                   }
                }
            }
        });
        // get linked references that lack textual references
        c.children("a").each(function(k, el) {
            var href = $(el).attr("href");
            if (href && href.indexOf("#") != -1) {
                var ref_id = "#" + href.split("#")[1];
                for (var j = 0; j < i; j++) {
                    var link = cdata[j].link;
                    if (link == ref_id) {
                        if ($.inArray(j, quotes) == -1) {
                            logReply(j);
                            quotes.push(j);
                            break;
                        }
                    }
                }
            }
        });
        cdata[i].quotes = quotes;
        cdata[i].quoteElements = quoteElements;
        i++;
        if (i % 100 == 0) {
            extractedUpTo = i;
            window.setTimeout(extractQuotes, 0);
            return;
        }
    }
    extractedUpTo = i;
    initialize2();
}
function addReferences() {
    // Add quote references inline in comments.
    $(".graphfi").remove();
    $.each(comments, function(i, comment) {
        // back references
        var quoteElements = cdata[i].quoteElements;
        if (!quoteElements) {
            return false;
        }
        for (var q in quoteElements) {
            (function(q) {
                var backReference = $("<a/>").attr({
                    "class": "graphfi",
                    //"title": cdata[q].author,
                    "href": cdata[q].link
                }).html("&gt;&nbsp;")
                backReference.hover(function() {
                    tooltip.show();
                    tooltip.html(comments[q].html());
                    tooltip.css("top", (backReference.offset().top + 25) + "px");
                }, function() {
                    tooltip.hide();
                });
                quoteElements[q].before(backReference);
            })(q);
        }
        // forward references
        var replies = cdata[i].replies;
        if (replies && replies.length > 0) {
            var a = $("<a/>").attr({
                "href": "",
                "class": "graphfi replies"
            }).html(
                replies.length + (replies.length > 1 ? " replies" : " reply")
            );
            a.click(function() {
                var replyBoxClass = "graphfi-replies-c" + i;
                function removeIt() {
                    $("." + replyBoxClass).remove();
                    comment.removeClass("graphfi-replies-open");
                    return false;
                }
                if (comment.hasClass("graphfi-replies-open")) {
                  return removeIt();
                }
                comment.addClass("graphfi-replies-open");
                var left = comment.offset().left;
                if (!classicTheme) {
                    left -= bar.width();
                }
                var div = $("<div/>").css({
                    "position": "absolute",
                    "left": left + "px",
                    "top": (comment.offset().top + comment.height()) + "px",
                    "width": (comment.width() - 25) + "px",
                    //"border-top": "1px dotted black",
                    "box-shadow": "0px 12px 12px " + selectingShadowColor,
                    "background-color": background,
                    "z-index": 10,
                    "padding": "1em"
                }).addClass(replyBoxClass).addClass("content");
                div.append($("<a/>").html("close (X)").attr("href", "").click(
                    removeIt
                ).css({
                    "position": "absolute",
                    "right": "1em",
                    "top": "1em",
                    "font-size": classicTheme ? "12px" : "90%",
                    "z-index": 1
                }));
                $.each(replies, function(r, replyIndex) {
                    var reply = comments[replyIndex];
                    var clone = reply.clone(true);
                    clone.addClass("graphfi-clone content");
                    clone.find("a.replies").click(function() {
                        div.remove();
                        window.location.href = cdata[replyIndex].link;
                        $(reply).mouseover();
                        return false;
                    });
                    clone.bind('click.graphfi', function() {
                        $(".graphfi-clone").css("box-shadow", "none");
                        clone.css({
                            "box-shadow": "0px 0px 12px " + selectingShadowColor
                        });
                    });
                    div.append(clone);
                    div.append("<br/><br/>");
                });
                div.append($("<a/>").html("close (X)").attr("href", "").click(
                    removeIt
                ).css({
                    "position": "absolute",
                    "right": "1em",
                    "bottom": "1em",
                    "font-size": classicTheme ? "12px" : "90%"
                }));
                $("body").append(div);
                return false;
            });
            comment.find("span.smallcopy").append(
                $("<span/>").attr("class", "graphfi").append(
                    "[", a, "]"
                )
            );
        }
    });
}
function getOffsets() {
    // Do this after all dom insertions have happened so we can be less likely
    // to have changing positions.
    for (var i = 0; i < comments.length; i++) {
        cdata[i].offset = comments[i].offset().top;
    }
}

function setUpCanvas() {
    if (comments.length == 0) {
        loading.html("Uh oh!  No comments yet!");
        loading.show();
    }
    maxCommentsAtOnce = Math.min(comments.length, parseInt(Math.floor(canvasHolder.height() / minBarHeight)));
    cChunk = comments.length ? canvasHolder.height() / maxCommentsAtOnce : canvasHolder.height();
    cWidth = 150;
    cHeight = cChunk * maxCommentsAtOnce;
    if (!canvas) {
        canvas = $("<canvas/>").css({
            'width': '100%',
            'height': '100%',
            'position': 'absolute',
            'left': '0',
            'top': '0',
            'cursor': 'pointer',
            'z-index': -1 
        }).attr({
            "width": cWidth,  // width and height of graphics context
            "height": cHeight // (not the display size of canvas element)
        });
        canvasHolder.append(canvas);
        ctx = canvas[0].getContext("2d");
    } else {
        canvas.attr({"width": cWidth, "height": cHeight});
    }
    canvasPageHeight = canvas.height();
    viewportHeight = $(window).height();
}

/**************************************************
* Draw
***************************************************/

function draw() {
    $(".graphfi-clone").css("box-shadow", "none");
    ctx.clearRect(0, 0, cWidth, cHeight);
    // draw bars
    for (var i = 0; i < maxCommentsAtOnce; i++) {
        var cIndex = i + minComment;
        var comment = comments[cIndex];
        var hovering = hovered == i;
        var selecting = selected == i;
        var barHeight = cChunk;
        var barWidth = cWidth * (cdata[cIndex].favorites / max_num_favs);
        var x = 0;
        var y = cChunk * i;
        if (selecting) {
            ctx.fillStyle = "rgba(66, 0, 0, 255)";
            comment.css({ 
                "box-shadow": "0px 0px 12px " + selectingShadowColor
            });
        } else if (hovering) {
            ctx.fillStyle = "rgba(66, 33, 0, 255)";
            comment.css({ 
                "box-shadow": "0px 0px 12px #966"
            });
        } else {
            comment.css({ 
                "box-shadow": "none"
            });
        }
        ctx.strokeStyle = "black";
        if (selecting || hovering) {
            ctx.beginPath();
            ctx.rect(x + barWidth, y, cWidth - barWidth, barHeight);
            ctx.fill();
        } else if (cIndex >= minCommentInViewport && cIndex < maxCommentInViewport) {
            ctx.strokeStyle = "rgba(0,66,99,255)";
            ctx.fillStyle = "rgba(0,66,99,255)";
            ctx.beginPath();
            ctx.rect(x + barWidth, y, cWidth - barWidth, barHeight);
            ctx.fill();
            ctx.stroke();
        }
        if (selecting) {
            ctx.fillStyle = "rgba(255, 0, 0, 255)";
        } else if (hovering) {
            ctx.fillStyle = "rgba(255, 128, 0, 255)";
        } else {
            ctx.fillStyle = "rgba(128, 128, 128, 128)";
        }
        ctx.beginPath();
        ctx.rect(x, y, barWidth, barHeight);
        ctx.fill();
    }

    // draw arcs
    for (var i = 0; i < comments.length; i++) {
        var quotes = cdata[i].quotes;
        for (var j = 0; j < quotes.length; j++) {
            var q = quotes[j];
            if (q != i) {
                ctx.beginPath();
                if ((q - minComment) == selected || (i - minComment) == selected) {
                    ctx.strokeStyle = "red";
                } else if ((q - minComment) == hovered || (i - minComment) == hovered) {
                    ctx.strokeStyle = "orange";
                } else {
                    ctx.strokeStyle = "gray";
                }
                var midPoint = (i - q) * 0.5 + q;
                var yOffset = -minComment * cChunk + cChunk / 2;
                ctx.moveTo(cWidth, yOffset + q * cChunk); 
                ctx.quadraticCurveTo(cWidth*0.5 -cWidth * ((i - q + 1) / comments.length),
                                     yOffset + midPoint * cChunk, 
                                     cWidth, yOffset + i * cChunk);
                ctx.stroke();
            }
        }
    }
}
function getCommentsInViewport() {
    var top = $(window).scrollTop();
    var bottom = top + viewportHeight;
    // binary search for top in-viewport comment.
    var min = -1; var max = comments.length - 1; 
    var mid = -1;
    while (min < max) {
        mid = Math.floor((max - min) / 2) + min;
        if (cdata[mid] && cdata[mid].offset < top) {
            min = mid + 1;
            continue;
        }
        if (cdata[mid] && cdata[mid].offset > top) {
            max = mid - 1;
            continue;
        }
        break;
    }
    minCommentInViewport = Math.min(mid, comments.length - 1);
    maxCommentInViewport = Math.min(mid + 1, comments.length - 1);
    while (cdata[maxCommentInViewport] && 
           cdata[maxCommentInViewport].offset < bottom) {
        maxCommentInViewport++;
    }
}

/****************************************************
* Interaction
****************************************************/
function setUpInteraction() {
    canvas.unbind('.graphfi');
    canvas.bind('mouseout.graphfi', function() {
        hovered = null;
        draw();
        tooltip.hide();
    });
    canvas.bind('mousemove.graphfi', function(evt) {
        if (comments.length == 0) {
            return;
        }
        var y = evt.pageY - canvasPageY;
        var transformed = y * (cHeight / canvasPageHeight);
        var newhovered = parseInt(transformed / cChunk);
        if (newhovered != hovered) {
            hovered = newhovered;
            draw();
            var c = comments[hovered + minComment]; 
            tooltip.show();
            tooltip.html(c.html());
            var tooltipY;
            if (y > canvasHolder.height()/2 || y + tooltip.height() > canvasHolder.height()) {
                tooltipY = Math.max(canvasPageY, evt.pageY - tooltip.height());
            } else {
                tooltipY = evt.pageY;
            }
            tooltip.css("top", tooltipY + "px");
        }
    });
    canvas.bind('click.graphfi', function(evt) {
        var y = evt.pageY - canvasPageY;
        var transformed = y * (cHeight / canvasPageHeight);
        var newselected = parseInt(transformed / cChunk);
        if (newselected != selected) {
            selected = newselected;
            draw();
        }
        if (selected != null) {
            $(window).scrollTop(comments[selected + minComment].offset().top - 57);
        }
        tooltip.hide();
    });
    $(comments).unbind('.graphfi');
    $(comments).each(function(i, el) {
//   Dubious value and really slow.....
//        $(el).bind('mouseover.graphfi', function() {
//            var pos = i - minComment;
//            if (pos != hovered) {
//                hovered = pos;
//                draw();
//            }
//        });
//        $(el).bind('mouseout.graphfi', function() {
//            hovered = null;
//        });
        $(el).bind('click.graphfi', function() {
            var pos = i - minComment;
            if (pos != selected) {
                selected = pos;
                draw();
            }
        });
    });
    $(window).unbind('.graphfi');
    var scrollRedraw;
    $(window).bind('scroll.graphfi', function(evt) {
        canvasPageY = canvas.offset().top;
        getCommentsInViewport();
        if (maxCommentsAtOnce < comments.length) {
            if (minCommentInViewport > 0) {
                var pos = Math.max(0, 
                    Math.min(comments.length - maxCommentsAtOnce - 1, 
                             minCommentInViewport - 10)
                );
                if (!isNaN(pos) && pos != minComment) {
                    selected += minComment - pos;
                    minComment = pos;
                }
            }
        } else {
            minComment = 0;
        }
        draw();
    });
    $(window).bind('resize.graphfi', function() {
        setUpCanvas(); // establishes new "maxCommentsAtOnce"
        $(window).scroll(); // establishes new "minComment"
        getOffsets(); // re-acquires positions
        draw(); //
    });
    var nodeInsertedTimeout;
    $(window).bind('DOMNodeInserted.graphfi', function(event) {
        if ($(event.relatedNode).is("#newcomments")) {
            if (nodeInsertedTimeout) {
                clearTimeout(nodeInsertedTimeout);
            }
            nodeInsertedTimeout = window.setTimeout(initialize, 10);
        }
    });
}
})()