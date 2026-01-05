// ==UserScript==
// @name         THPsupplemental
// @namespace    https://greasyfork.org/en/scripts/13233-thpsupplemental
// @version      0.9
// @description  For those users that enjoy odd hats and questionable writing. Adds a few reasonable features to the THP site.
// @author       kntei
// @include      http://www.touhou-project.com/*
// @run-at       document-end
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/13233/THPsupplemental.user.js
// @updateURL https://update.greasyfork.org/scripts/13233/THPsupplemental.meta.js
// ==/UserScript==

//GLOBAL VARIABLES
var thps = {
    posts: [],
    threads: [],
    intervals: [],
    maxReplies: 3,
    timeThreshold: 1000 * 60 * 60 * 24 * 7, // 7 days
    refreshRSS: 1000 * 60 * 30, // 30 mins
    storyDomains: ["th", "eientei", "forest", "border", "shrine", "sdm", "youkai", "underground", "others", "shorts"],
    allBoards: [ "gensokyo", "i", "at", "th", "eientei", "forest", "border", "shrine", "sdm", "youkai", "underground", "others", "shorts", "blue" ],
    allFullBoards: [ "General Discussion", "Drawing", "18+ Touhou", "General", "Eientei & Lunar Capital", "Forest of Magic & Flower Fields", "Hakurei Border & Afterlife", "Hakurei Shrine, Human Village & Myouren Temple", "Scarlet Devil Mansion & Misty Lake", "Youkai Mountain & Heaven", "Underground & Makai", "Others", "Short Stories", "not a color we know" ]
};

//FUNCTIONS ON GLOBAL VARIABLES

function clearIntervals()
{
    for( var i = 0; i < thps.intervals.length; i++ )
        clearInterval(thps.intervals[i]);
}

function hasLocalPost( id, board )
{
    for( var i = 0; i < thps.posts.length; i++ )
        if( thps.posts[i].postID == id && thps.posts[i].boardStr == board )
            return true;
    return false;
}

function threadIndex( id )
{
    for( var i = 0; i < thps.threads.length; i++ )
        if( thps.threads[i].topicID == id )
            return i;
    return -1;
}

function updateThreads()
{
    thps.threads = [];
    for( var i = 0; i < thps.posts.length; i++ )
    {
        var index = threadIndex(thps.posts[i].topicID);
        if( index === -1 )
        {
            var newthread = new Thread();
            newthread.topicID = thps.posts[i].topicID;
            newthread.latestDate = thps.posts[i].date;
            if( thps.posts[i].topicID != thps.posts[i].postID )
                newthread.numChild = newthread.numChild + 1;
            thps.threads.push( newthread );
        }
        else
        {
            if( thps.threads[index].latestDate.stringToMilli() < thps.posts[i].date.stringToMilli() )
                thps.threads[index].latestDate = thps.posts[i].date;
            if( thps.posts[i].topicID != thps.posts[i].postID )
                thps.threads[index].numChild = thps.threads[index].numChild + 1;
        }
    }
}

function printThreads()
{
    for( var i = 0; i < thps.threads.length; i++ )
    {
        console.log('---');
        console.log( "ID " + thps.threads[i].topicID);
        console.log( "Date " + thps.threads[i].latestDate);
        console.log( "Child " + thps.threads[i].numChild);
    }
}

function sortPostArrayByDate()
{
    thps.posts.sort(
        function( a, b )
        {
            return a.date.stringToMilli() - b.date.stringToMilli();
        }
    );
}

function sortPostArrayByPostNum()
{
    updateThreads();
    thps.posts.sort(
        function( a, b )
        {
            if( thps.threads[threadIndex(a.topicID)].latestDate.stringToMilli() < thps.threads[threadIndex(b.topicID)].latestDate.stringToMilli() )
                return 1;
            if( thps.threads[threadIndex(a.topicID)].latestDate.stringToMilli() > thps.threads[threadIndex(b.topicID)].latestDate.stringToMilli() )
                return -1;
            else if( Number(a.topicID) >  Number(b.topicID) )
                return 1;
            else if( Number(a.topicID) <  Number(b.topicID) )
                return -1;
            else if( Number(a.postID) >  Number(b.postID) )
                return 1;
            else if( Number(a.postID) <  Number(b.postID) )
                return -1;
            else
                return 0;
        }
    );
}

// TIME CONVERSIONS
String.prototype.stringToMilli = function()
{
    var replaced = this.replace(/[^\w\s]/gi, ' ');
    var parsed = replaced.split(" ");

    var d = new Date( parsed[0], Number(parsed[1])-1, parsed[2], parsed[4], parsed[5], 0, 0);

    return d.valueOf();
};

Number.prototype.milliToString = function()
{

    var d = new Date( this );
    var string = "";
    var dayWeek = ["Sun", "Mon", "Tue", "Wen", "Thu", "Fri", "Sat"];

    string += d.getFullYear();
    string += '/';
    string += numPad(d.getMonth()+1, 2);
    string += '/';
    string += numPad(d.getDate(), 2);
    string += '(';
    string += dayWeek[d.getDay()];
    string += ')';
    string += numPad(d.getHours(), 2);
    string += ':';
    string += numPad(d.getMinutes(), 2);

    return string;
};

// XMLHttpRequest CLASS

function RequestThread()
{
    this.client = new XMLHttpRequest();
}

function AJAXLike( url, success, failure )
{
    var client = new XMLHttpRequest();
    var handler = function()
    {
        if (this.readyState === 4)
        {
            if (this.status === 200) //COMPLETE
                success(client);//FUNCTION
            else //ERROR
                failure();
        }
    };
    client.onreadystatechange = handler;
    client.open( "GET", url );
    client.send();
}

RequestThread.prototype.requestHTML = function( url, func, board )
{
    var handler = function()
    {
        if (this.readyState === 4)
        {
            if (this.status === 200) //COMPLETE
            {
                var doc = document.implementation.createHTMLDocument("");
                doc.body.innerHTML = this.response;
                func( doc, board );//FUNCTION
            }
            else //ERROR
                console.log( "ERROR on page " + url );
        }
    };
    this.client.onreadystatechange = handler;
    this.client.open( "GET", url );
    this.client.send();
};

function Thread(){
    this.topicID = "";
    this.latestDate = "";
    this.numChild = 0;
}

// POST CLASS

function Post() {
    this.boardStr = "";
    this.imgNumber = "";
    this.imgType = "";
    this.imgDetails = "";
    this.threadName = "";
    this.posterName = "";
    this.posterTrip = "";
    this.date = "";
    this.topicID = "";
    this.postID = "";
    this.text = "";
}

Post.prototype.isBlank = function()
{
    if( this.text === "" )
        return true;
    return false;
};

Post.prototype.isChild = function()
{
    if( Number(this.topicID) === Number(this.postID) )
        return false;
    return true;
};

Post.prototype.clear = function()
{
    this.boardStr = "";
    this.imgNumber = "";
    this.imgType = "";
    this.imgDetails = "";
    this.threadName = "";
    this.posterName = "";
    this.posterTrip = "";
    this.date = "";
    this.topicID = "";
    this.postID = "";
    this.text = "";
};

Post.prototype.fromSinglePost = function( doc, board )
{
    this.boardStr = board;
    var searchspan = doc.getElementsByTagName( "span" );
    for( var i = 0; i < searchspan.length; i++ )
    {
        if( searchspan[i].className == "filesize" )
        {
            var file = searchspan[i].childNodes;

            var a = file[1].textContent.split(".");
            this.imgNumber = a[0];
            this.imgType = a[1];

            var b = file[2].textContent;
            b.removeWhiteSpace();
            b = b.popFront();
            b = b.popBack();
            this.imgDetails = b;
        }
        if( searchspan[i].className == "filetitle" )
            this.threadName = searchspan[i].innerHTML;
        if( searchspan[i].className == "postername" )
            this.posterName = searchspan[i].innerHTML;
        if( searchspan[i].className == "postertrip" )
            this.posterTrip = searchspan[i].innerHTML;
        if( searchspan[i].className == "reflink" )
        {
            var ref = searchspan[i].innerHTML;
            var breakdown = ref.split('"');
            breakdown = breakdown[1].split(/[.\/#]/g);
            this.topicID = breakdown[breakdown.length-3];
            this.postID = breakdown[breakdown.length-1];
        }
    }

    var searchblock = doc.getElementsByTagName( "blockquote" );
    if( searchblock[0] !== undefined )
        this.text = searchblock[0].innerHTML;

    var searchlabel = doc.getElementsByTagName( "label" );
    if( searchlabel[0] !== undefined )
    {
        var lab = searchlabel[0].childNodes;
        this.date = lab[lab.length-1].textContent.replace(/\s/g, "");
    }
};

function createBreakString( arr )
{
    var s = "";
    var sLength = 0;
    for( var i = 0; i < arr.length; i++ )
    {
        s += "!" + (arr[i].length + sLength);
        sLength += arr[i].length;
    }
    return s;
}

function createDataString( arr )
{
    var s = "";
    for( var i = 0; i < arr.length; i++ )
        s += arr[i];
    return s;
}

Post.prototype.savePost = function()
{
    //breaksSTRING id + board + breaks, "!2!135!18469849!651651"
    //dataSTRING id + board + data, "al;sidjf;aloskjd;falksjdf;lasjkd"

    //GM_deleteValue( id + board + "breaks" );
    //GM_deleteValue( id + board + "data" );

    var id = this.postID;
    var board = this.boardStr;

    var brks = "0" + createBreakString([this.boardStr, this.imgNumber, this.imgType, this.imgDetails, this.threadName, this.posterName, this.posterTrip, this.date, this.topicID, this.postID, this.text]);
    var data =        createDataString([this.boardStr, this.imgNumber, this.imgType, this.imgDetails, this.threadName, this.posterName, this.posterTrip, this.date, this.topicID, this.postID, this.text]);

    //console.log( brks );
    //console.log( data );

    var savB = brks; 
    //var savB = totalencode(brks);
    GM_setValue( id + '!' + board + '!' + "breaks", savB );

    var savD = data;
    //var savD = totalencode(data);
    GM_setValue( id + '!' + board + '!' + "data", savD );
};

function parsePostData( pos, breaks, data )
{
    var string = "";
    var arrBreaks = breaks.split("!");
    string += data.substring(Number(arrBreaks[pos]),Number(arrBreaks[pos+1]));
    return string;
}

Post.prototype.loadPost = function( id, board )
{
    var loadB = GM_getValue( id + '!' + board + '!' + "breaks" );
    var loadD = GM_getValue( id + '!' + board + '!' + "data" );

    //var brks = totaldecode(loadB);
    var brks = loadB;
    //var data = totaldecode(loadD);
    var data = loadD;

    this.boardStr = parsePostData( 0, brks, data );
    this.imgNumber = parsePostData( 1, brks, data );
    this.imgType = parsePostData( 2, brks, data );
    this.imgDetails = parsePostData( 3, brks, data );
    this.threadName = parsePostData( 4, brks, data );
    this.posterName = parsePostData( 5, brks, data );
    this.posterTrip = parsePostData( 6, brks, data );
    this.date = parsePostData( 7, brks, data );
    this.topicID = parsePostData( 8, brks, data );
    this.postID = parsePostData( 9, brks, data );
    this.text = parsePostData( 10, brks, data );
};

function makeOpeningPost( oldhtml )
{
    var html = '';
    html += '<table>';
    html += '<tbody>';
    html += '<tr>';
    html += '<td>';

    html += oldhtml;

    html += '</span>';

    html += '</td>';
    html += '</tr>';
    html += '</tbody>';
    html += '</table>';

    return html;
}

function makeChildPost( oldhtml )
{
    var html = '';
    html += '<table>';
    html += '<tbody>';
    html += '<tr>';
    html += '<td class="reply" style=\'padding:0px 7.5px 0px 7.5px\'">';

    html += oldhtml;

    html += '</span>';

    html += '</td>';
    html += '</tr>';
    html += '</tbody>';
    html += '</table>';

    return html;
}

//////////////////////////////////////////////
// BORROWED SOME KUSABA CODE TO WORK IN FRAMES
//////////////////////////////////////////////
function addPreview(e) {
    var c;
    var d = "srcElement";
    var f = "href";
    this[f] ? c = this : c = e[d];
    ainfo = c.className.split('|');
    var g = getCurrentFrameDoc().createElement('div');
    g.setAttribute("id", "preview" + c.className);
    g.setAttribute('class', 'reflinkpreview');
    g.setAttribute('className', 'reflinkpreview');
    if (e.pageX) {
        g.style.left = '' + (e.pageX + 50) + 'px';
    } else {
        g.style.left = (e.clientX + 50);
    }
    var h = getCurrentFrameDoc().createTextNode('');
    g.appendChild(h);
    var i = c.parentNode;
    var j = i.insertBefore(g, c);
    AJAXLike('http://www.touhou-project.com/read.php?b=' + ainfo[1] + '&t=' + ainfo[2] + '&p=' + ainfo[3] + '&single',
             function(a) {
                 var b = a.responseText || _("something went wrong (blank response)");
                 j.innerHTML = b;
             },
             function() {
                 var response = _("something went wrong (blank response)");
                 newelement.innerHTML = response;
             }
            );
}

function delPreview(e) {
    var a;
    var b = "srcElement";
    var c = "href";
    this[c] ? a = this : a = e[b];
    var d = getCurrentFrameDoc().getElementById("preview" + a.className);
    if (d) {
        d.parentNode.removeChild(d);
    }
}

function parsePreview() {
    var a = getCurrentFrameDoc().getElementsByTagName('a');
    var b;
    var c;
    for (var i = 0; i < a.length; i++) {
        b = a[i];
        if (b.className) {
            if (b.className.substr(0, 4) == "ref|") {
                if (b.addEventListener) {
                    b.addEventListener("mouseover", addPreview, false);
                    b.addEventListener("mouseout", delPreview, false);
                } else if (b.attachEvent) {
                    b.attachEvent("onmouseover", addPreview);
                    b.attachEvent("onmouseout", delPreview);
                }
            }
        }
    }
}

// TEXT SHORTENER

function getCurrentFrameDoc()
{
    if( window.top.frames[1] !== undefined )
        return window.top.frames[1].document;
    else
        return document;
}

function setStyles( style )
{
    var styles = getCurrentFrameDoc().getElementsByTagName('link');
    for( var i = 0; i < styles.length; i++ )
        if( styles[i].type == "text/css" )
            if( styles[i].title == style )
                styles[i].disabled = false;
}

function deleteStyles()
{
    var styles = getCurrentFrameDoc().getElementsByTagName('link');
    for( var i = 0; i < styles.length; i++ )
        if( styles[i].type == "text/css" )
            styles[i].parentNode.removeChild(styles[i]);
}

function disableStyles()
{
    var styles = getCurrentFrameDoc().getElementsByTagName('link');
    for( var i = 0; i < styles.length; i++ )
        if( styles[i].type == "text/css" )
            styles[i].disabled = true;
}

function addStyles()
{
    var head = getCurrentFrameDoc().getElementsByTagName('head')[0];
    
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'http://www.touhou-project.com/css/img_global.css';
    head.appendChild(link);
    
    link = document.createElement('link');
    link.rel = 'alternate stylesheet';
    link.type = 'text/css';
    link.href = 'http://www.touhou-project.com/css/burichan.css';
    link.title = 'Burichan';
    link.disabled = 'true';
    head.appendChild(link);
    
    link = document.createElement('link');
    link.rel = 'alternate stylesheet';
    link.type = 'text/css';
    link.href = 'http://www.touhou-project.com/css/futaba.css';
    link.title = 'Futaba';
    link.disabled = 'true';
    head.appendChild(link);
    
    link = document.createElement('link');
    link.rel = 'alternate stylesheet';
    link.type = 'text/css';
    link.href = 'http://www.touhou-project.com/css/photon.css';
    link.title = 'Photon';
    link.disabled = 'true';
    head.appendChild(link);
    
    link = document.createElement('link');
    link.rel = 'alternate stylesheet';
    link.type = 'text/css';
    link.href = 'http://www.touhou-project.com/css/chernobyl.css';
    link.title = 'Chernobyl';
    link.disabled = 'true';
    head.appendChild(link);
    
    link = document.createElement('link');
    link.rel = 'alternate stylesheet';
    link.type = 'text/css';
    link.href = 'http://www.touhou-project.com/css/darkish.css';
    link.title = 'Darkish';
    link.disabled = 'true';
    head.appendChild(link);
}

function cookieStyle()
{
    var style = cookieValue(' kustyle');
    deleteStyles();
    addStyles();
    if( style !== '' )
        setStyles( style );
    else
        setStyles( "Photon" );
}

function cookieValue(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for( var i = 0; i < ca.length; i++ )
    {
        var s = ca[i].split('=');
        if( cname == s[0] )
            return s[1];
    }
    return "";
}

function toggle_visibility(id)
{
    var arr = id.split('!');
    var short = document.getElementById( arr[0] + arr[1] + "short" );
    var long = document.getElementById( arr[0] + arr[1] + "long" );
    if( short.style.display == 'block' )
    {
        short.style.display = 'none';
        long.style.display = 'block';
    }
    else
    {
        short.style.display = 'block';
        long.style.display = 'none';
    }
};

function cropString( string, delim, times )
{
    var cropstring = string;

    for( var i = 0; i < times; i++ )
    {
        var loc = cropstring.lastIndexOf(delim);
        cropstring = cropstring.substring(0,loc);
    }

    return cropstring;
}

function makeMessageShort( id, board, string )
{
    var html = '';
    var countMax = 12;
    var count = string.split("<br>").length - 1;

    if( count > countMax )
    {
        html += '<div id=\'' + id + board + 'long\' style=\'display:none\'>';
        html += '<blockquote>';
        html += string;
        html += '</blockquote>';
        html += '</div>';

        html += '<div id=\'' + id + board + 'short\'>';
        html += '<blockquote>';
        html += cropString(string, "<br>", count - countMax );
        html += '</blockquote>';
        html += '</div>';

        html += '<a href="javascript:void(0)" onclick="toggle_visibility(\'' + id + '!' + board + '\');">Message too long. Click here to toggle text.</a>';
        return html;
    }
    else
    {
        html += '<blockquote>';
        html += string;
        html += '</blockquote>';
        return html;
    }
}

function getDims( string )
{
    var arr = [0,0];
    var breakdown = string.split(',');
    breakdown = breakdown[1].replace(/\s/g, "").split('x');
    arr[0] = Number(breakdown[0]);
    arr[1] = Number(breakdown[1]);
    return arr;
}

function getScaled( string, maxSize )
{
    var arrDim = getDims( string );
    var arr = [0,0,0,0];
    arr[2] = arrDim[0];
    arr[3] = arrDim[1];
    var scale = 0;

    if( arr[2] <= maxSize && arr[3] <= maxSize )
        return arr;

    if( arr[2] > arr [3] )
    {
        scale = maxSize / arr[2];
        arr[0] = scale * arr[2];
        arr[1] = scale * arr[3];
    }
    else
    {
        scale = maxSize / arr[3];
        arr[0] = scale * arr[2];
        arr[1] = scale * arr[3];
    }

    return arr;
}

function makePost( post, pos )
{
    var html = '';

    if( post.topicID == post.postID )
    {
        html += '<span class="reply" style=\'padding:0px 10px 0px 10px\'>/' + post.boardStr + '/</span><br><br>';
    }

    // HAS IMAGE
    if( post.imgDetails !== "" )
    {
        if( post.topicID == post.postID )
            var thumbDim = getScaled( post.imgDetails, 200 );
        else
            var thumbDim = getScaled( post.imgDetails, 125 );

        // IMAGE
        html += '<a target="_blank" href="http://www.touhou-project.com/' + post.boardStr + '/src/' + post.imgNumber + '.' + post.imgType + '">';
        html += '<span id="thumb' + post.postID + '">';
        html += '<img src="http://www.touhou-project.com/' + post.boardStr + '/thumb/' + post.imgNumber + 's.' + post.imgType + '" alt="' + post.postID + '" class="thumb" height="' + thumbDim[1] + '" width="' + thumbDim[0] + '" />';
        html += '</span>';
        html += '</a>';

        // FILE EXPANDLINK + DETAILS + IQDB
        html += '<span class="filesize">';
        html += 'File ';
        html += '<a href="http://www.touhou-project.com/' + post.boardStr + '/src/' + Number(post.imgNumber) + '.' + post.imgType + '" onclick="javascript:expandimg(\'' + Number(post.postID) + '\', \'http://www.touhou-project.com/' + post.boardStr + '/src/' + Number(post.imgNumber) + '.' + post.imgType + '\', \'http://www.touhou-project.com/' + post.boardStr + '/thumb/' + Number(post.imgNumber) + 's.' + post.imgType + '\', \'' + thumbDim[2] + '\', \'' + thumbDim[3] + '\', \'' + thumbDim[0] + '\', \'' + thumbDim[1] + '\');return false;">' + post.imgNumber + '.' + post.imgType + '</a>';
        html +=  post.imgDetails +  ' ';
        html += '[<a href="http://iqdb.org/?url=http://www.touhou-project.com/' + post.boardStr + '/src/' + post.imgNumber + '.' + post.imgType + '" target="_blank">iqdb</a>]';
        html += '</span>';
        html += '<br/>';
    }

    // TITLE
    html += '<a name="' + post.postID + '"></a>';
    html += '<span class="filetitle">';
    html += post.threadName + ' ';
    html += '</span>';

    // USER
    html += '<span class="postername">' + post.posterName + '</span>';
    html += '<span class="postertrip">' + post.posterTrip + '</span>';
    html += ' ';

    // TIME+DATE
    html += post.date;
    html += ' ';

    // REFLINK
    html += '<span class="reflink">';
    html += '<a href="/' + post.boardStr + '/res/' + post.topicID + '.html#' + post.postID + '" onclick="return highlight("' + post.postID + '");">No.&nbsp;</a>';
    html += '<a href="/' + post.boardStr + '/res/' + post.topicID + '.html#i' + post.postID + '" onclick="return insert(\'>>' + post.postID + '\n\');">' + post.postID + '</a>';
    html += '</span>';

    if( post.topicID == post.postID )
    {
        // REPLY
        html += ' [';
        html += '<a href=\'http://www.touhou-project.com/' + post.boardStr + '/res/' + post.topicID + '.html\'>Reply</a>';
        html += ']';
    }


    // SOME KIND OF ID?
    html += '<span id="dnb-' + post.boardStr + '-' + post.postID + '-y"></span>';
    html += '<br />';

    // BLOCK QUOTE
    html += makeMessageShort( post.postID, post.boardStr, post.text);

    return html;
}

function NavigationBar()
{
    var html = '';

    html += '<div class="navbar">';

    html += '[ ';
    html += '<a title="General Discussion" href="/gensokyo/">gensokyo</a> / ';
    html += '<a title="Drawing" href="/i/">i</a> / ';
    html += '<a title="18+ Touhou" href="/at/">at</a> / ';
    html += '<a title="Words Words Words" href="/words/">words</a>';
    html += ' ] ';

    html += '[ ';
    html += '<a title="General" href="/th/">th</a> / ';
    html += '<a title="Eientei &amp; Lunar Capital" href="/eientei/">eientei</a> / ';
    html += '<a title="Forest of Magic &amp; Flower Fields" href="/forest/">forest</a> / ';
    html += '<a title="Hakurei Border &amp; Afterlife" href="/border/">border</a> / ';
    html += '<a title="Hakurei Shrine, Human Village &amp; Myouren Temple" href="/shrine/">shrine</a> / ';
    html += '<a title="Scarlet Devil Mansion &amp; Misty Lake" href="/sdm/">sdm</a> / ';
    html += '<a title="Youkai Mountain &amp; Heaven" href="/youkai/">youkai</a> / ';
    html += '<a title="Underground &amp; Makai" href="/underground/">underground</a> / ';
    html += '<a title="Others" href="/others/">others</a> / ';
    html += '<a title="Short Stories" href="/shorts/">shorts</a>';
    html += ' ] ';

    html += '[ ';
    html += '<a title="not a color we know" href="/blue/">blue</a> / ';
    html += '<a title="Downloads" href="/rs/">rs</a>';
    html += ' ] ';

    html += '[ ';
    html += '<a title="Story List" href="/storylist.html">Story List</a>';
    html += ' ] ';

    html += '</div>';

    return html;
}

function ScriptInject()
{
    var html = '';

    html += '<script>';

    //General Scripts
    html += getCurrentFrameDoc;

    //Cookie + Style Set Scipt
    html += cookieValue;
    html += cookieStyle;
    
    html += addStyles;
    html += deleteStyles;
    //html += disableStyles;
    html += setStyles;

    //AJAX request for preview
    html += AJAXLike;
    //Preview Script
    html += addPreview;
    html += delPreview;
    html += parsePreview;
    
    html += toggle_visibility;

    html += 'cookieStyle();';
    html += 'parsePreview();';

    html += '</script>';

    return html;
}

function StyleSelect()
{
    var html = '';
    html += '<script type="text/javascript" src="http://www.touhou-project.com//lib/javascript/gettext.js"></script>';
    html += '<script type="text/javascript" src="http://www.touhou-project.com/lib/javascript/protoaculous-compressed.js"></script>';

    html += '<script type="text/javascript"><!--';
    html += 'var ku_boardspath = "http://www.touhou-project.com";';
    html += 'var ku_cgipath = "http://www.touhou-project.com";';
    html += 'var style_cookie = "kustyle";';
    html += 'var ispage = true;';
    html += '//--></script>';

    html += '<script type="text/javascript" src="http://www.touhou-project.com/lib/javascript/kusaba.js"></script>';

    html += '<div class="adminbar">';
    html += '<select onchange="javascript:if(selectedIndex != 0)set_stylesheet(options[selectedIndex].value);return false;">';
    html += '<option>Styles</option>';
    html += '<option value="Burichan">Burichan</option>;';
    html += '<option value="Futaba">Futaba</option>;';
    html += '<option value="Photon">Photon</option>;';
    html += '<option value="Chernobyl">Chernobyl</option>;';
    html += '<option value="Darkish">Darkish</option>;';
    html += '</select>';
    html += '</div>';

    return html;
}

/////////////////////////////
// JAVASCRIPT CREATED PAGES
/////////////////////////////

function sizeLocalStorage()
{
    var arrNames = GM_listValues();
    var size = 0;

    for( var i = 0; i < arrNames.length; i++ )
        size += GM_getValue(arrNames[i]).length;

    return size;
}

function clearLocalStorage()
{
    var arrNames = GM_listValues();

    for( var i = 0; i < arrNames.length; i++ )
        GM_deleteValue(arrNames[i]);
}

function printLocalPosts()
{
    var arrNames = GM_listValues();
    for( var i = 0; i < arrNames.length; i++ )
        console.log( arrNames[i] );
}

function saveLocalPosts( arr )
{
    for( var i = 0; i < arr.length; i++ )
        arr[i].savePost();
}

function loadLocalPosts()
{
    var arr = [];
    var arrNames = GM_listValues();

    var arrbreaks = [];
    var arrdata = [];

    for( var i = 0; i < arrNames.length; i++ )
    {
        if( arrNames[i].indexOf("breaks") !== -1)
            arrbreaks.push(arrNames[i]);
        if( arrNames[i].indexOf("data") !== -1 )
            arrdata.push(arrNames[i]);
    }

    for( var i = 0; i < arrbreaks.length; i++ )
    {
        var breakbrk = arrbreaks[i].split('!');
        for ( var j = 0; j < arrdata.length; j++ )
        {
            var databrk = arrdata[j].split('!');
            if( breakbrk[0] === databrk[0] && breakbrk[1] === databrk[1] )
            {
                var post = new Post();
                post.loadPost( breakbrk[0], breakbrk[1] );
                arr.push(post);
            }
        }

    }

    return arr;
}

function threadSavePost( doc, board )
{
    //console.log( "SAVEPOST: " + board );
    var post = new Post();
    post.fromSinglePost( doc, board );
    post.savePost();
    //console.log(window.location.host);
}

function savePostsRSS( doc, board )
{
    //console.log( "RSS BOARD: " + board );
    var items = doc.getElementsByTagName("item");
    var requestArr = [];
    for( var i = 0; i < items.length; i++ )
    {
        var cn = items[i].childNodes;
        var s = cn[4].textContent.replace(/\s/g,"").split(/[.\/#]/g);

        if( !hasLocalPost( s[s.length-3], board ) && requestArr.indexOf("" + s[s.length-3] + board) === -1 )
        {
            requestArr.push("" + s[s.length-3] + board);
            var thread1 = new RequestThread();
            var url1 = 'http://www.touhou-project.com/read.php?b=' + board + '&t=' + s[s.length-3] + '&p=' + s[s.length-3] + '&single';
            thread1.requestHTML( url1, threadSavePost, board );
        }

        if( !hasLocalPost( s[s.length-1], board ) && requestArr.indexOf("" + s[s.length-1] + board) === -1 )
        {
            requestArr.push("" + s[s.length-1] + board);
            var thread2 = new RequestThread();
            var url2 = 'http://www.touhou-project.com/read.php?b=' + board + '&t=' + s[s.length-3] + '&p=' + s[s.length-1] + '&single';
            thread2.requestHTML( url2, threadSavePost, board );
        }
    }
}

function currentTimeMilli()
{
    var d = new Date();
    return d.valueOf();
}

function AllStoriesPageHTML()
{
    thps.posts = loadLocalPosts();
    sortPostArrayByPostNum();
    //printThreads();

    var html = '';

    html += NavigationBar();
    html += StyleSelect();
    html += '<div class="logo"> RSS Feed </div>';

    var currentthread = "";
    var count = 0;
    for( var i = 0; i < thps.posts.length; i++ )
    {
        var post = thps.posts[i];
        if( !post.isBlank() )
        {
            var thread = thps.threads[threadIndex(post.topicID)];
            if( thread.latestDate.stringToMilli() - currentTimeMilli() + thps.timeThreshold > 0 )
            {
                if( currentthread != post.topicID )
                {
                    currentthread = post.topicID;
                    count = thread.numChild;
                }
                else
                {
                    if( currentthread != post.postID )
                        count -= 1;
                }
                if( post.isChild() && count < (thread.numChild - (thread.numChild - thps.maxReplies)) )
                    html += makeChildPost(makePost( post, 1+i ));
                //else
                //console.log( 'Hidden post - ' + post.postID + ' ' + post.boardStr );
                if( !post.isChild() )
                    html += "<hr>" + makeOpeningPost(makePost( post, 1+i ));
            }
        }
    }
    html += '<hr/>';
    html += NavigationBar();
    html += ScriptInject();

    return html;
}

function WatchedThreadsPage( open )
{
    open.document.write( NavigationBar() );
    open.document.write( StyleSelect() );
    var html = '<div class="logo"> Watched Threads </div><hr /><u1>Work in progress...</u1><hr/>';
    open.document.write( html );
    open.document.write( NavigationBar() );
    open.document.close();
}

function OptionsPageHTML( open )
{
    var html = '';
    html += NavigationBar();
    html += StyleSelect();
    html += '<div class="logo"> Options </div>';
    html += '<hr />';
    html += '<h2>RSS OPTIONS</h2>';
    html += '<u1>Check Boards</u1><br>';
    for( var i = 0; i < thps.allBoards.length; i++ )
        html += '<label><input type="checkbox" value="' + thps.allBoards[i] + '" >/' + thps.allBoards[i] + '/ - ' + thps.allFullBoards[i] + '</label><br>';
    html += '<br><input type="text" id="refreshrate" value="' + thps.refreshRSS/60000 + '" size="1" maxlength="4"><u1> Minutes - Refresh Rate</u1><br>';
    html += '<hr />';
    html += '<h2>THREAD DISPLAY OPTIONS</h2>';
    html += '<input type="text" id="maxreplies" value="' + thps.maxReplies + '" size="1" maxlength="4"><u1> Max visible replies</u1><br><br>';
    html += '<input type="text" id="oldthreshhold" value="' + thps.timeThreshold/86400000 + '" size="1" maxlength="4"><u1> Days - Old thread threshhold</u1><br>';
    html += '<hr />';
    html += '<h2>OFFLINE LOCAL STORAGE</h2>';
    html += '<input type="button" id="ClearCache" value="Clear Cache"><u1> - ' + (sizeLocalStorage()/1048576).toFixed(2) +' MB</u1><br>';
    html += '<hr />';
    html += '<input type="button" id="Save" value="Save">';
    html += '<hr />';
    html += NavigationBar();
    html += ScriptInject();
    return html;
}

function exec_body_scripts(body_el) {
    // Finds and executes scripts in a newly added element's body.
    // Needed since innerHTML does not run scripts.
    //
    // Argument body_el is an element in the dom.

    function nodeName(elem, name) {
        return elem.nodeName && elem.nodeName.toUpperCase() ===
            name.toUpperCase();
    }

    function evalScript(elem) {
        var data = (elem.text || elem.textContent || elem.innerHTML || "" ),
            head = getCurrentFrameDoc().getElementsByTagName("head")[0] ||
            getCurrentFrameDoc().documentElement,
            script = getCurrentFrameDoc().createElement("script");

        script.type = "text/javascript";
        try {
            // doesn't work on ie...
            script.appendChild(getCurrentFrameDoc().createTextNode(data));      
        } catch(e) {
            // IE has funky script nodes
            script.text = data;
        }

        head.insertBefore(script, head.firstChild);
        head.removeChild(script);
    }

    // main section of function
    var scripts = [],
        script,
        children_nodes = body_el.childNodes,
        child,
        i;

    for (i = 0; children_nodes[i]; i++) {
        child = children_nodes[i];
        if (nodeName(child, "script" ) &&
            (!child.type || child.type.toLowerCase() === "text/javascript")) {
            scripts.push(child);
        }
    }

    for (i = 0; scripts[i]; i++) {
        script = scripts[i];
        if (script.parentNode) {script.parentNode.removeChild(script);}
        evalScript(scripts[i]);
    }
}

function parseTextNumber( text, min, multi, def )
{
    var num = def * multi;
    var tonum = Number(text);
    if( !isNaN(tonum) )
    {
        if(tonum >= min )
            num = tonum * multi;
        else
            num = min * multi;
    }
    return num;
}

function optionsLoad()
{
    var s = GM_getValue("settings");
    if( s !== undefined && s!== null )
    {
        thps.storyDomains = [];
        var arr = s.split('!');
        for( var i = 0; i < arr.length; i++ )
        {
            if( i > 0 && i < arr.length - 3 )
                thps.storyDomains.push(arr[i]);
            if( i == arr.length - 3 )
                thps.refreshRSS = Number(arr[i]);
            if( i == arr.length - 2 )
                thps.maxReplies = Number(arr[i]);
            if( i == arr.length - 1 )
                thps.timeThreshold = Number(arr[i]);
        }
    }
}

function optionsSave( focus )
{
    var inputs = focus.getElementsByTagName("input");

    thps.storyDomains = [];

    for( var i = 0; i < inputs.length; i++ )
    {
        if( inputs[i].type == "checkbox" && inputs[i].checked )
            thps.storyDomains.push(inputs[i].value);
        if( inputs[i].id == "refreshrate" )
            thps.refreshRSS = parseTextNumber(inputs[i].value, 5, 60000, 30);
        if( inputs[i].id == "maxreplies" )
            thps.maxReplies = parseTextNumber(inputs[i].value, 0, 1, 3);
        if( inputs[i].id == "oldthreshhold" )
            thps.timeThreshold = parseTextNumber(inputs[i].value, 0, 86400000, 7);
    }
}

function optionsSaveString( focus )
{
    var s = "";
    var inputs = focus.getElementsByTagName("input");

    for( var i = 0; i < inputs.length; i++ )
    {
        if( inputs[i].type == "checkbox" && inputs[i].checked )
            s += '!' + inputs[i].value;
        if( inputs[i].id == "refreshrate" )
            s += '!' + parseTextNumber(inputs[i].value, 5, 60000, 30);
        if( inputs[i].id == "maxreplies" )
            s += '!' + parseTextNumber(inputs[i].value, 0, 1, 3);
        if( inputs[i].id == "oldthreshhold" )
            s += '!' + parseTextNumber(inputs[i].value, 0, 86400000, 7);
    }

    GM_setValue( "settings", s );
}

function OptionsPage( focus )
{    
    clearIntervals();
    optionsLoad();

    var head = focus.getElementsByTagName("head")[0];
    var body = focus.getElementsByTagName("body")[0];
    body.innerHTML = OptionsPageHTML();
    exec_body_scripts( head );
    exec_body_scripts( body );

    var evt = getCurrentFrameDoc().createEvent('Event');  
    evt.initEvent('load', false, false);  
    window.dispatchEvent(evt);
    
    var bar = focus.getElementsByClassName("navbar");
    for( var i = 0; i < bar.length; i++ )
    {
        bar[i].appendChild(document.createTextNode("[ "));
        bar[i].appendChild(NewScriptMenuLink(function(){AllStoriesPage(getCurrentFrameDoc());}, "RSS Feed"));
        //bar[i].appendChild(document.createTextNode(" / "));
        //bar[i].appendChild(NewScriptMenuLink(function(){GetPage(WatchedThreadsPage,"_self");}, "Watched Threads"));
        bar[i].appendChild(document.createTextNode(" / "));
        bar[i].appendChild(NewScriptMenuLink(function(){OptionsPage(getCurrentFrameDoc());}, "Options"));
        bar[i].appendChild(document.createTextNode(" ]"));
    }

    var inputs = focus.getElementsByTagName("input");
    for( var i = 0; i < inputs.length; i++ )
        if( inputs[i].type == "checkbox" && thps.storyDomains.indexOf(inputs[i].value) != -1 )
            inputs[i].checked = true;

    focus.getElementById("ClearCache").onmousedown = function(){clearLocalStorage();};
    focus.getElementById("Save").onmousedown = function(){optionsSaveString(focus); optionsLoad();};
}

function AllStoriesPage( focus )
{
    clearIntervals();
    thps.posts = loadLocalPosts();

    for( var i = 0; i < thps.storyDomains.length; i++ )
    {
        var thread = new RequestThread();
        thread.requestHTML( 'http://www.touhou-project.com/' + thps.storyDomains[i] + '/rss.xml', savePostsRSS, thps.storyDomains[i] );
    }

    var head = focus.getElementsByTagName("head")[0];
    var body = focus.getElementsByTagName("body")[0];
    body.innerHTML = AllStoriesPageHTML();
    exec_body_scripts( head );
    exec_body_scripts( body );

    var evt = getCurrentFrameDoc().createEvent('Event');  
    evt.initEvent('load', false, false);  
    window.dispatchEvent(evt);
    
    var bar = focus.getElementsByClassName("navbar");
    for( var i = 0; i < bar.length; i++ )
    {
        bar[i].appendChild(document.createTextNode("[ "));
        bar[i].appendChild(NewScriptMenuLink(function(){AllStoriesPage(getCurrentFrameDoc());}, "RSS Feed"));
        //bar[i].appendChild(document.createTextNode(" / "));
        //bar[i].appendChild(NewScriptMenuLink(function(){GetPage(WatchedThreadsPage,"_self");}, "Watched Threads"));
        bar[i].appendChild(document.createTextNode(" / "));
        bar[i].appendChild(NewScriptMenuLink(function(){OptionsPage(getCurrentFrameDoc());}, "Options"));
        bar[i].appendChild(document.createTextNode(" ]"));
    }

    thps.intervals.push(setInterval( function(){
        thps.posts = loadLocalPosts();

        for( var i = 0; i < thps.storyDomains.length; i++ )
        {
            var thread = new RequestThread();
            thread.requestHTML( 'http://www.touhou-project.com/' + thps.storyDomains[i] + '/rss.xml', savePostsRSS, thps.storyDomains[i] );
        }
        var offset = window.pageYOffset;
        var head = focus.getElementsByTagName("head")[0];
        var body = focus.getElementsByTagName("body")[0];
        body.innerHTML = AllStoriesPageHTML();
        exec_body_scripts( head );
        exec_body_scripts( body );

        var evt = getCurrentFrameDoc().createEvent('Event');  
        evt.initEvent('load', false, false);  
        window.dispatchEvent(evt);
        
        var bar = focus.getElementsByClassName("navbar");
        for( var i = 0; i < bar.length; i++ )
        {
            bar[i].appendChild(document.createTextNode("[ "));
            bar[i].appendChild(NewScriptMenuLink(function(){AllStoriesPage(getCurrentFrameDoc());}, "RSS Feed"));
            //bar[i].appendChild(document.createTextNode(" / "));
            //bar[i].appendChild(NewScriptMenuLink(function(){GetPage(WatchedThreadsPage,"_self");}, "Watched Threads"));
            bar[i].appendChild(document.createTextNode(" / "));
            bar[i].appendChild(NewScriptMenuLink(function(){OptionsPage(getCurrentFrameDoc());}, "Options"));
            bar[i].appendChild(document.createTextNode(" ]"));
        }
        
        window.scrollTo(0, offset);
    }, thps.refreshRSS ));
}

function GetPage( page, focus )
{
    var open = window.open("", focus);
    page( open );
}

/////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////

String.prototype.removeWhiteSpace = function()
{
    this.replace(/\t|\r|\n|\s/g,"");
    return this;
};

String.prototype.popFront = function()
{
    var size = this.length;
    var remainder = "";
    if( size > 0 )
        remainder = this.substring(1,size);
    return remainder;
};

String.prototype.popBack = function()
{
    var size = this.length;
    var remainder = "";
    if( size > 0 )
        remainder = this.substring(0,size-1);
    return remainder;
};

function nodeHTML( className, html )
{
    var node = document.createElement( "span" );
    node.className = className;
    node.innerHTML = html;
    return node;
}

function numpad( num, pad )
{
    var string = "";
    string += num;
    while (string.length < pad) string = "0" + string;
    return string;
}

function NewScriptMenuLinkBR( script, text )
{
    var line = document.createElement("li");
    var link = document.createElement("a");
    var t = document.createTextNode(text);
    line.appendChild(link);
    link.appendChild(t);
    link.href = "javascript:void(0)";
    link.onclick = script;
    return line;
}

function NewScriptMenuLink( script, text )
{
    var link = document.createElement("a");
    var t = document.createTextNode(text);
    link.appendChild(t);
    link.href = "javascript:void(0)";
    link.onclick = script;
    return link;
}

function CheckForScript( name )
{
    var scripts = document.getElementsByTagName("script");
    for( var i = 0; i < scripts.length; i++ )
        if( scripts[i].src == name )
            return true;
    return false;
}

function PrintByElementTag( doc, tag )
{
    var tags = doc.getElementsByTagName( tag );
    for( var i = 0; i < tags.length; i++ )
        console.log( tags[i] );
}


/////////////////////////////
// MAIN EXECUTION SECTION
/////////////////////////////

//clearLocalStorage();

if( CheckForScript("http://www.touhou-project.com/lib/javascript/menu.js") )
{
    var title = document.createElement("h2");
    var links = document.createElement("u1");
    title.innerHTML = 'THPsupplemental';
    links.appendChild(NewScriptMenuLinkBR(function(){AllStoriesPage(window.top.frames[1].document);}, "RSS Feed"));
    //links.appendChild(NewScriptMenuLinkBR(function(){GetPage(WatchedThreadsPage,"main");}, "Watched Threads"));
    links.appendChild(NewScriptMenuLinkBR(function(){OptionsPage(window.top.frames[1].document);}, "Options"));
    document.body.appendChild(title);
    document.body.appendChild(links);
}

if( CheckForScript("http://www.touhou-project.com/banner.js") )
{    
    var bar = document.getElementsByClassName("navbar");
    for( var i = 0; i < bar.length; i++ )
    {
        bar[i].appendChild(document.createTextNode("[ "));
        bar[i].appendChild(NewScriptMenuLink(function(){AllStoriesPage(document);}, "RSS Feed"));
        //bar[i].appendChild(document.createTextNode(" / "));
        //bar[i].appendChild(NewScriptMenuLink(function(){GetPage(WatchedThreadsPage,"_self");}, "Watched Threads"));
        bar[i].appendChild(document.createTextNode(" / "));
        bar[i].appendChild(NewScriptMenuLink(function(){OptionsPage(document);}, "Options"));
        bar[i].appendChild(document.createTextNode(" ]"));
    }
}