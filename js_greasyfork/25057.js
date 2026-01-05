// ==UserScript==
// @name        PAUSE
// @namespace   https://sourceforge.net/u/van-de-bugger/
// @description Semantic markup for file lists in pause.perl.org
// @include     https://pause.perl.org/pause/authenquery
// @include     https://pause.perl.org/pause/authenquery?ACTION=show_files
// @include     https://pause.perl.org/pause/authenquery?ACTION=delete_files
// @include     https://pause.perl.org/pause/authenquery?ACTION=reindex
// @version     0.1.2
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/25057/PAUSE.user.js
// @updateURL https://update.greasyfork.org/scripts/25057/PAUSE.meta.js
// ==/UserScript==

/*
    ------------------------------------------------------------------------------------------------

    Copyright (C) 2016 Van de Bugger

    License GPLv3+: The GNU General Public License version 3 or later
    <http://www.gnu.org/licenses/gpl-3.0.txt>.

    This is free software: you are free to change and redistribute it. There is NO WARRANTY, to the
    extent permitted by law.

    ------------------------------------------------------------------------------------------------
*/

/**

This is a Greasemonkey script for [PAUSE](https://pause.perl.org/).

## Problem

File lists displayed in "Show my files" and "Delete files" are err… too spartan.

If you have a dozen of distributions and few releases (let me say, 3) for every distribution, your
file list will include more than hundred files. The list is badly aligned (if you have file names
longer than ~50 characters). It would be nice to group files by releases and distributions, use
color highlighting for denoting trial releases and files scheduled for deletion. But spartan list
markup does not allow applying user style sheet because entire list is just a single `PRE` element
without a structure.

The list on "Delete files" page has 3-color highlighting, but it does not help because coloring is
not semantic: first line highlighted with red, the second with green, the third with blue
regardless of files shown in these lines. Usually release consist of 3 files (.meta, .readme and
.tar.gz), so at the top of the list .meta files are red, .readme are green, and tarballs are blue,
but trial releases (which includes only tarball with no .meta and no .readme) and special file
`CHECKSUMS` break the system.

Deleting a release is not trivial because you have to mark 3 files to delete. Color highlighting
dazzles and it is so easy to mark a file from adjacent release. (Thanks they are not deleted
immediatelly.)

## Solution

This script parses original file list and re-creates it with semantic markup. Every file has name,
size and date. Files are grouped into releases, releases are grouped into distributions.

Semantic markup allows using user style sheet to highlight files, releases, or distributions, group
releases and/or distributions visually, add headings, etc.

Also, the script makes two changes in list behavior:

1. The script adds two buttons: "Show tarballs only" and "Show all files". Pressing the first
button hides non-tarball files making the list 3 times shorter. Pressing the second button shows
hidden files back. The buttons are added to both "Show my files" and "Delete files" pages.

2. The script automates selecting releases to delete. When you change state of tarball file
checkbox, the change is automatically propagated to all files of the release containing this
tarball. So, the most frequent operation (selecting a release to delete) now requires just one
click instead of 3 clicks. It also eliminates risk to mistakenly select 2 files from one release
and a file from adjacent release. (Selecting individual files is still possible, though.)

Both behavioral changes work together nicely: You can hide non-tarball files to have more
compact list of tarballs, select a tarball from the list — accompanying (and currently
invisible) meta and readme files will be selected automatically.

*Note:* The script does *not* provide any style sheet. I made it intentionally because my color
preferences may not be suitable for everybody. You may try [my style
sheet](https://userstyles.org/styles/135527/pause).

## Details

    <pre id="fileList" class="fileList">
        <span id="Foo" class="distribution">
            <span id="Foo-v0.1.2" class="release">
                <span id="Foo.meta" class="file meta">
                    <!-- checkbox in case of "Delete files" page -->
                    <span class="name">Foo.meta</span>
                    <span class="namePad">       </span>
                    <span class="sizePad"> </span>
                    <span class="size">2 300</span>
                    <span class="date">2016-11-11T12:00:05Z</span>
                    <span class="eof"><!-- newline character --></span>
                </span>
                <!-- More files of this release -->
            </span>
            <!-- More releases of this distribution -->
        </span>
        <!-- More distributions -->
        <span id="special" class="special">
            <span id="CHECKSUMS" class="file">
                <span class="name">CHECKSUMS</span>
                <span class="namePad">   </span>
                <span class="sizePad"></span>
                <span class="size">34 895</span>
                <span class="date">2016-11-11T12:00:15Z</span>
                <span class="eof"><!-- newline character --></span>
            </span>
        </span>
    </pre>

The sample is splitted into multiple lines and indented for the sake of readability, actual `PRE`
element has only `SPAN`s children. Text nodes appears only in the bottom level `SPAN`s (name, size,
date, etc).

The list generated for "Delete files" page also has `INPUT` elements (checkboxes) taken from the
original list.

Trial releases have additional class `trial`. Files sheduled for deletion — class `delete`,
files with ".tar.gz" suffix — `tarball`, files with ".readme" suffix — `readme`, files with
".meta" suffix — `meta` (shown in example above).

Dates are converted to ISO fomat (with dropped second fraction part). Digits in file sizes are
groped by inserting blanks.

It is assumed the element is displayed using monospaced font.

## History Log

* v0.1.0 — Initial release, "Show my files" and "Delete files" are processed.

* v0.1.1 — Page detection implemented to avoid unintentional processing other pages. "Force
    reindexing" page is processed too.

* v0.1.2 — Buttons functionality does not require external style sheet, buttons work out-of-the-box
    now.

**/

function assert( condition, message ) {
    if ( ! condition ) {
        console.log( "throwing: " + message );
        throw message;
    };
};

function getCookie( name ) {
    var prefix = name + "=";
    var item;
    if ( document.cookie.length > 0 ) {
        var list = document.cookie.split( ";" );
        item = list.find( function ( item ) {
            return item.startsWith( prefix );
        } );
    };
    if ( item == null ) {
        return null;
    };
    return item.substr( prefix.length );
};

function setCookie( name, value ) {
    var prefix = name + "=";
    var list;
    if ( document.cookie.length > 0 ) {
        list = document.cookie.split( ";" );
        list = list.filter( function ( item ) {
            return ! item.startsWith( prefix );
        } );
    } else {
        list = [];
    };
    list.push( prefix + value );
    document.cookie = list.join( ";" );
};

/**
    Calls func for each element of the list. list can be either array or NodeList object (which is
    array-like but does not have forEach method). The func is called with 3 arguments: element,
    index, and list.
**/
function forEach( list, func ) {
    if ( list != null ) {
        for ( var i = 0; i < list.length; ++ i ) {
            func( list[ i ], i, list );
        };
    };
};

/**
   Adds class addClassName to all elements with className.
**/
function addClass( className, addClassName ) {
    forEach( document.getElementsByClassName( className ), function ( elem ) {
        elem.classList.add( addClassName );
    } );
};

/**
   Removes class remClassName from all elements with className.
**/
function remClass( className, remClassName ) {
    forEach( document.getElementsByClassName( className ), function ( elem ) {
        elem.classList.remove( remClassName );
    } );
};

/**
    Returns true iff the version is trial one.
**/
function isTrial( version ) {
    return version.includes( "_" );
};

/**
    Splits filename into 3 parts: distribution name, version number, and file type (aka suffix).
    Returns an object with 3 fields: dist, ver, and type. ver does not contain leading dash,
    suffix does not contain leading dot.
**/
function parseFilename( name ) {
    var type, ver;
    // Find file type and drop it from name:
    name = name.replace( /(\.meta|\.readme|\.tar.gz)$/, function ( found ) {
        type = found.replace( /^\./, "" );
        return "";
    } );
    // Find version and drop it from name:
    name = name.replace( /-[^-]*$/, function ( found ) {
        ver = found.replace( /^-/, "" );
        return "";
    } );
    return {
        dist : name,
        ver  : ver,
        type : type,
    };
};

/**
    Groups digits of the specified number (by inserting blanks into the number). Number must be a
    string made of digits only (no sign nor fractional part is allowed).
**/
function groupDigits( number ) {
    if ( number != null && number.match( /^\d+$/ ) ) {
        var groups = [];
        var rem = number.length % 3;
        var pos = 0;
        if ( rem > 0 ) {
            groups.push( number.substr( pos, rem ) );
            pos += rem;
        };
        while ( pos < number.length ) {
            groups.push( number.substr( pos, 3 ) );
            pos += 3;
        };
        return groups.join( " " );
    };
    return number;
};

/**
    Format of dates used by PAUSE.
**/
var dateRe = /[A-Z][a-z][a-z], \d\d [A-Z][a-z][a-z] \d\d\d\d \d\d:\d\d:\d\d GMT/;

/**
    Searches string for a first date, and converts found date to the ISO format.
**/
function isoDate( string ) {
    return string == null ? null : string.replace( dateRe, function ( found ) {
        var date = new Date( found );
        return date.toISOString().replace( /\.000Z$/, "Z" );
    } );
};

/**
    Creates a DOM element.
**/
function createElement( tag, attrs, content ) {
    var elem = document.createElement( tag );
    for ( var attr in attrs ) {
        elem.setAttribute( attr, attrs[ attr ] );
    };
    if ( typeof content == "string" ) {
        elem.appendChild( document.createTextNode( content ) );
    } else {
        forEach( content, function ( item ) {
            if ( item != null ) {
                elem.appendChild( item );
            };
        } );
    };
    return elem;
};

/**
    Creates SPAN elelment representing a file.
**/
function createFile( file, nameWidth, sizeWidth ) {
    var classList = [ "file" ];
    if ( file.name.endsWith( ".meta" )  ) {
        classList.push( "meta" );
    };
    if ( file.name.endsWith( ".readme" )  ) {
        classList.push( "readme" );
    };
    if ( file.name.endsWith( ".tar.gz" )  ) {
        classList.push( "tarball" );
    };
    if ( file.date != null && file.date.includes( "Scheduled for deletion" ) ) {
        classList.push( "delete" );
    };
    var size = file.size == null ? null : groupDigits( file.size );
    var date = file.date == null ? null : isoDate( file.date );
    var file = createElement( "span", {
        class : classList.join( " " ),
    }, [
        ( "input" in file ? file.input : null ),
        createElement( "span", { class: "name" }, file.name ),
        size == null && date == null ? (
            null
        ) : (
            createElement( "span", { class: "namePad" }, " ".repeat( nameWidth - file.name.length ) )
        ),
        size == null ? (
            null
        ) : (
            createElement( "span", { class: "sizePad" }, " ".repeat( sizeWidth - size.length ) )
        ),
        size == null ? null : createElement( "span", { class: "size" }, size ),
        date == null ? null : createElement( "span", { class: "date" }, date ),
        createElement( "span", { class: "eof" }, "\n" ),
    ] );
    return file;
};

/**
    Splits given string into file name, size, and date.
**/
function parseLine( line ) {
    var items = line.trim().split( /\s\s+/ );
    return {
        name : items[ 0 ],
        size : items[ 1 ],
        date : items[ 2 ],
    };
};

/**
    Creates a SPAN element with two buttons: "Show tarballs only" and "Show all files". The first
    button hides all non-tarball files (by adding class "hidden"), the second button shows that
    files back (by removing class "hidden").
**/
function createButtons() {
    var hide = createElement( "input", {
        id    : "showTarballsOnly",
        type  : "button",
        value : "Show tarballs only",
    }, [] );
    var show = createElement( "input", {
        id       : "showAllFiles",
        type     : "button",
        value    : "Show all files",
        disabled : "disabled",
    }, [] );
    hide.onclick = function () {
        addClass( "special",   "hidden" );
        addClass( "meta",      "hidden" );
        addClass( "readme",    "hidden" );
        show.disabled = "";
        hide.disabled = "disabled";
        setCookie( "showMode", this.id );
    };
    show.onclick = function () {
        remClass( "special",   "hidden" );
        remClass( "meta",      "hidden" );
        remClass( "readme",    "hidden" );
        show.disabled = "disabled";
        hide.disabled = "";
        setCookie( "showMode", this.id );
    };
    var showMode = getCookie( "showMode" );
    if ( showMode == hide.id ) {
        hide.onclick();
    };
    return createElement( "span", { id : "showMode" }, [
        hide, show
    ] );
};

/**
    Parses a file list taken from "Show my files" page. Returns array of objects. Each object
    represents one file and has fileds: name, size, and date.

    File list on "Show my files" page looks like:

        <pre> name      size  date<br> name     size  date<br>...</pre>

**/
function parseShowFiles( element ) {
    var files = [];
    forEach( element.childNodes, function ( child ) {
        if ( child.nodeType == 3 ) {
            files.push( parseLine( child.textContent ) );
        } else if ( child.nodeType == 1 && child.tagName == "BR" ) {
            // Ignore BR elements.
        } else {
            assert( 0, "unexpected node" );
        };
    } );
    return files;
};

/**
    Parses a file list taken from "Delete files" page. Returns array of objects. Each object
    represents one file and has fileds: name, size, date, and input. Input is an DOM INPUT element
    *removed* from the tree.

    File list on "Delete files" page looks like:

        <pre>
        <span><input> name      size  date</span>
        <span><input> name      size  date</span>
        ...
        </pre>

**/
function parseDeleteFiles( element ) {
    var files = [];
    forEach( element.childNodes, function ( child ) {
        if ( child.nodeType == 1 && child.tagName == "SPAN" ) {
            var file   = parseLine( child.childNodes[ 1 ].textContent );
            file.input = child.removeChild( child.childNodes[ 0 ] );
            files.push( file );
        } else if ( child.nodeType == 3 && child.textContent.trim() == "" ) {
            // Ignore whitespace-only text nodes.
        } else {
            assert( 0, "unexpected node" );
        };
    } );
    return files;
};

/**
    Group plain list of files into hierarchy: Files are groped into releases, releases are grouped
    into distributions. Returns an object:

        {
            distros : {
                distro_name : {
                    release_version : {
                        file_type : file,
                        another_type : athoter_file,
                        ...,
                    },
                    another_release_version : {
                        ...
                    },
                    ...,
                },
                another_distro_name : {
                    ...
                },
                ...,
            },
            special : [
                special_file, another_special_file,
            ],
        }

**/
function groupFiles( files ) {
    var registry = {
        distros : {},
        special : [],
    };
    files.forEach( function ( file ) {
        var name = parseFilename( file.name );
        if ( file.name == "CHECKSUMS" ) {
            registry.special.push( file );
        } else {
            if ( ! ( name.dist in registry.distros ) ) {
                registry.distros[ name.dist ] = {};
            };
            if ( ! ( name.ver in registry.distros[ name.dist ] ) ) {
                registry.distros[ name.dist ][ name.ver ] = {};
            };
            registry.distros[ name.dist ][ name.ver ][ name.type ] = file;
        };
    } );
    return registry;
};

/**
    Generates a DOM elelent, representing the file list with semantic markup.
**/
function generateList( files ) {
    var distributions = [];
    var nameWidth = files.reduce( function ( width, file ) {
        return Math.max( width, file.name.length );
    }, 0 );
    var sizeWidth = files.reduce( function ( width, file ) {
        return Math.max( width, file.size == null ? 0 : file.size.length );
    }, 0 );
    sizeWidth = groupDigits( "9".repeat( sizeWidth ) ).length;
    var registry = groupFiles( files );
    for ( var dist in registry.distros ) {
        var releases = [];
        for ( var release in registry.distros[ dist ] ) {
            var files = [];
            for ( var type in registry.distros[ dist ][ release ] ) {
                var file = registry.distros[ dist ][ release ][ type ];
                files.push( createFile( file, nameWidth, sizeWidth ) );
            };
            releases.push( createElement(
                "span",
                {
                    id    : dist + "-" + release,
                    class : "release" + ( isTrial( release ) ? " trial" : "" ),
                },
                files
            ) );
        };
        distributions.push( createElement( "span",
            {
                id      : dist,
                class   : "distribution",
            },
            releases
        ) );
    };
    if ( registry.special.length > 0 ) {
        var special = [];
        registry.special.forEach( function ( file ) {
            special.push( createFile( file, nameWidth, sizeWidth ) );
        } );
        distributions.push( createElement( "span",
            {
                id      : "special",
                class   : "special",
            },
            special
        ) );
    };
    return createElement( "pre", { id: "fileList", class : "fileList" }, distributions );
};

/**
    Automates checkboxes. When a tarball checkbox changed, synchronize other checkboxes of the same
    release with the tarball checkbox.
**/
function automateCheckboxes( element ) {
    forEach( element.getElementsByTagName( "input" ), function ( checkbox ) {
        if ( checkbox.value.endsWith( ".tar.gz" ) ) {
            checkbox.onchange = function () {
                var state = this.checked;   // New state of the current checkbox.
                var files = this.parentElement.parentElement.childNodes;
                    // List of files of this release.
                for ( var i = 0; i < files.length; ++ i ) {
                    files[ i ].getElementsByTagName( "input" )[ 0 ].checked = state;
                };
            };
        };
    } );
};

var pre = document.getElementsByTagName( "pre" )[ 0 ];
var files;

/*
    Detect page by element with "firstheader" class. Page address cannot be used for that, because
    page with address <https://pause.perl.org/pause/authenquery?ACTION=delete_files> after pressing
    the button "Delete" becomes the page with address <https://pause.perl.org/pause/authenquery/>.
*/
var firstHeader = document.getElementsByClassName( "firstheader" )[ 0 ];
assert( firstHeader != null, "Can't find element of 'firstheader' class" );
var title = firstHeader.textContent;

//  Parsing depends on the page.
if ( title.toLowerCase() == "show my files" ) {
    files = parseShowFiles( pre );
} else if ( title.toLowerCase() == "delete files" ) {
    files = parseDeleteFiles( pre );
} else if ( title.toLowerCase() == "force reindexing" ) {
    files = parseDeleteFiles( pre );
};
assert( files != null, "Do not know how to parse '" + title + "' page" );

// Recreate file list.
var list = generateList( files );
pre.parentElement.replaceChild( list, pre );
var buttons = createButtons();
list.parentElement.insertBefore( buttons, list );
automateCheckboxes( list );

GM_addStyle( ".fileList .hidden { display: none; }" );

// end of file //
