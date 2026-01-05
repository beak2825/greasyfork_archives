// ==UserScript==
// @name         MyAnimeList(MAL) - Tag Updater
// @version      1.1.3
// @description  Adds any series information of your choice to the Tags column of your own anime/mangalist + You can sort the tag column.
// @include      /^http.*\:\/\/myanimelist\.net\/animelist\/[^\/]+/
// @include      /^http.*\:\/\/myanimelist\.net\/mangalist\/[^\/]+/
// @author       Cptmathix
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.25.2/js/jquery.tablesorter.js
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/16285/MyAnimeList%28MAL%29%20-%20Tag%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/16285/MyAnimeList%28MAL%29%20-%20Tag%20Updater.meta.js
// ==/UserScript==

//--------------------------------//
//          Initialize            //
//--------------------------------//

var getValueOf;
var updateType; // true = update all tags, false = update empty tags

var href = document.location.href;
var user;
if (href.indexOf('?') > -1)
    user = href.substr(href.lastIndexOf('/') + 1, href.indexOf('?') - href.lastIndexOf('/') - 1);
else
    user = href.substr(href.lastIndexOf('/') + 1);

var currentUser = $('#mal_cs_listinfo > div:nth-child(1) > strong > a > strong')[0].innerHTML;

var type;
if(window.location.href.indexOf("mangalist") > -1) {
    type = ["manga", "380px;", "-190px;"];
} else {
    type = ["anime", "462px;", "-231px;"];
}

var INTERVAL = 500;

//--------------------------------//
//    Create Update Tag Links     //
//--------------------------------//

if (user == currentUser && $('span[id^="tagLinks"]').length != 0) {
    $('#mal_cs_otherlinks > div:nth-child(2)')[0].innerHTML += "&nbsp;&nbsp;" + '<a href="javascript:void(0);" id="tagUpdater" title="Update All Tags">Update All Tags</a>';
    $('#mal_cs_otherlinks > div:nth-child(2)')[0].innerHTML += "&nbsp;&nbsp;" + '<a href="javascript:void(0);" id="partialTagUpdater" title="Update Empty Tags">Update Empty Tags</a>';
    $('#tagUpdater')[0].addEventListener('click', popupFunction(true), true);
    $('#partialTagUpdater')[0].addEventListener('click', popupFunction(false), true);
}

//--------------------------------//
//     Create Sort Tags Link      //
//--------------------------------//

$('.table_header').each(function() {
    if (this.textContent.indexOf("Tags") > -1) {
        this.innerHTML = '<a href="javascript:void(0);" class="table_headerLink"><strong>Tags</strong></a>';
        this.addEventListener('click', initSort(), true);
    }
});

//--------------------------------//
//           Initialise           //
//--------------------------------//

function popupFunction(all) {
    return function () {
        $("#gmPopupContainer").show();
        updateType = all;
    };
}

function init(all) {
    var counter = 0;
    $('span[id^="tagLinks"]').each(function(index) {
        if ((! all && this.innerHTML == '' || this.innerHTML == '&nbsp;' || this.textContent == '?') || all) {
            var animeid = parseInt(this.id.split('tagLinks')[1]);

            setTimeout(function() {
                getAnimeInfo(animeid);
            }, (index - counter) * INTERVAL);
        } else {
            counter += 1;
        }
    });
}

//--------------------------------//
//       Get Data Function        //
//--------------------------------//

function getAnimeInfo(animeid) {
    if (getValueOf == 'Empty')
        tag_showEdit(animeid, '');
    else {    
        $.get('/' + type[0] + '/' + animeid, function(data) {
            var value;
            $(data).find('#content > table > tbody > tr > td.borderClass > div > div:nth-child(n) > span').each(function() {
                var item = this.textContent.replace(/:/g,"");
                if (item == getValueOf)
                    value = getValue(item, this);  
            });        
            // score is a little bit different to get with manga -.-
            if (getValueOf == 'Score' && type[0] == "manga") {
                $(data).find('#content > table > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(1) > td > span').each(function() {
                    value = this.innerHTML;
                });
            }

            if (value === undefined || value == "N/A" || value == "add some" || value.indexOf("Unknown") > -1)
                value = '';

            tag_showEdit(animeid, value);
        });
    }
}

function getValue(item, data) {
    if (isNaN(item) && (data.nextElementSibling === null || item == "Ranked")) {
        return data.nextSibling.textContent;
    } else if (isNaN(item) && item.indexOf(',') == -1) {
        var information = data.parentNode.children[1].innerHTML;      
        for(var i = 2; i < data.parentNode.children.length && item != "Score"; i++) { 
            information += ", " + data.parentNode.children[i].innerHTML;
        }
        return information;
    }
}

//--------------------------------//
//    Edit/Save Tag Functions     //
//--------------------------------//

function tag_showEdit(aid, value)
{
	var oldTags = document.getElementById("tagRow"+aid).innerHTML;
	document.getElementById("tagLinks"+aid).style.display = 'none';
	document.getElementById("tagChangeRow"+aid).style.display = 'none';
	
	var tagRowEditObj = document.getElementById("tagRowEdit"+aid);
	tagRowEditObj.style.display = 'block';
	tagRowEditObj.innerHTML = '<textarea id="tagInfo'+aid+'" class="inputtext" cols="12" rows="3">'+ value + '</textarea><div style="margin-top: 3px;"><span style="float: right;"><input type="button" value="Save" onclick="tag_add('+aid+','+type+')"></span><span style="float: left;"><input type="button" value="Cancel" onclick="tag_cancelAdd('+aid+')"></span></div>';
	document.getElementById("tagInfo"+aid).focus();
    tag_add(aid);
}

function tag_add(aid)
{
    var url;
    var tagString = document.getElementById("tagInfo"+aid).value;
    document.getElementById("tagRowEdit"+aid).style.display = 'none';
    document.getElementById("tagLinks"+aid).style.display = 'block';
    document.getElementById("tagLinks"+aid).innerHTML = 'Saving...';
    document.getElementById("tagRow"+aid).innerHTML = tagString;

    if (type[0] == "anime") {
        url = "/includes/ajax.inc.php?t=22&aid="+aid+"&tags="+encodeURIComponent(tagString);
    } else {
        url = "/includes/ajax.inc.php?t=30&mid="+aid+"&tags="+encodeURIComponent(tagString);
    }

    $.get(url, function(data) {
        //alert(data);
        document.getElementById("tagLinks"+aid).innerHTML = data;
        document.getElementById("tagLinks"+aid).style.display = 'block';
        document.getElementById("tagChangeRow"+aid).style.display = 'block';
    });
}

//--------------------------------//
//        Sort Functions          //
//--------------------------------//

function initSort() {
    return function () {
        var cwHeader = $('#list_surround > table.header_cw')[0];
        var compHeader = $('#list_surround > table.header_completed')[0];
        var ohHeader = $('#list_surround > table.header_onhold')[0];
        var dropHeader = $('#list_surround > table.header_dropped')[0];
        var ptwHeader = $('#list_surround > table.header_ptw')[0];

        if (cwHeader)
            remakeTable(cwHeader);
        if (compHeader)
            remakeTable(compHeader);
        if (ohHeader)
            remakeTable(ohHeader);
        if (dropHeader)
            remakeTable(dropHeader);
        if (ptwHeader)
            remakeTable(ptwHeader);

        $('.table_headerLink').each(function() {
            $(this).contents().unwrap();
        });
        
        $('.tablesorter-header-inner').each(function() {
           $(this).css('cursor', 'pointer');
           $(this).prop('title', 'Click to sort');
        });
                    
        $("[id^=xmenu]").each(function() {
            $(this.previousSibling).remove();
            $(this).hide();
        });
    };
}

function remakeTable(header) {
    var table = header.nextElementSibling;
    table.className += "tablesorter";
    
    // change tbody to thead
    table.children[0].outerHTML = table.children[0].outerHTML.replace(/tbody/g,"thead").replace(/td/g,"th");
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);

    var next = table.nextElementSibling;
    for(var i = 0; next.nextElementSibling.nodeName != "BR" && next.nextElementSibling.id != "inlineContent"; i++) {
        tbody.appendChild(next.children[0].children[0]);
        next = next.nextElementSibling.nextElementSibling;
    }

    $(table).tablesorter({
        // third click on the header will reset column to default - unsorted
        sortReset   : true,
        // Resets the sort direction so that clicking on an unsorted column will sort in the sortInitialOrder direction.
        sortRestart : true,
        // first sort direction is always ascending
        sortInitialOrder: 'asc',
        // first sort direction is descending with score column
        headers : {
            2 : { sortInitialOrder: 'desc' }
        }
    });
}


//--------------------------------//
//     Create Popup Functions     //
//--------------------------------//

var strVar = '';

strVar += '<div id="gmPopupContainer" style="display: none;">';
strVar += '    <form>';

strVar += '        <input type="radio" name="Option" id="English"> English<br>';
strVar += '        <input type="radio" name="Option" id="Japanese"> Japanese<br>';
strVar += '        <input type="radio" name="Option" id="Synonyms"> Synonyms<br><br>';

strVar += '        <input type="radio" name="Option" id="Score"> Score<br>';
strVar += '        <input type="radio" name="Option" id="Ranked"> Ranked<br>';
strVar += '        <input type="radio" name="Option" id="Popularity"> Popularity<br>';
strVar += '        <input type="radio" name="Option" id="Members"> Members<br>';
strVar += '        <input type="radio" name="Option" id="Favorites"> Favorites<br><br>';
strVar += '        <input type="radio" name="Option" id="Type"> Type<br>';
strVar += '        <input type="radio" name="Option" id="Status"> Status<br>';
strVar += '        <input type="radio" name="Option" id="Genres"> Genres<br>';

if (type[0] == "anime") { 
    strVar += '    <input type="radio" name="Option" id="Episodes"> Episodes<br>';
    strVar += '    <input type="radio" name="Option" id="Aired"> Aired<br>';
    strVar += '    <input type="radio" name="Option" id="Premiered"> Season<br>';
    strVar += '    <input type="radio" name="Option" id="Broadcast"> Broadcast (JST)<br>';
    strVar += '    <input type="radio" name="Option" id="Duration"> Duration<br>';
    strVar += '    <input type="radio" name="Option" id="Producers"> Producers<br>';
    strVar += '    <input type="radio" name="Option" id="Licensors"> Licensors<br>';
    strVar += '    <input type="radio" name="Option" id="Studios"> Studios<br>';
    strVar += '    <input type="radio" name="Option" id="Rating"> Rating<br>';
    strVar += '    <input type="radio" name="Option" id="Source"> Source<br><br>';
} else if (type[0] == "manga") {
    strVar += '    <input type="radio" name="Option" id="Chapters"> Chapters<br>';
    strVar += '    <input type="radio" name="Option" id="Volumes"> Volumes<br>';
    strVar += '    <input type="radio" name="Option" id="Published"> Published<br>';
    strVar += '    <input type="radio" name="Option" id="Authors"> Authors<br>';
    strVar += '    <input type="radio" name="Option" id="Serialization"> Serialization<br><br>';
}

strVar += '        <input type="radio" name="Option" id="Empty"> Clear all tags<br>';

strVar += '        <button id="gmSubmit" type="button">Submit</button>';
strVar += '        <button id="gmClosePopup" type="button">Cancel</button>';
strVar += '    </form>';
strVar += '</div>';

$("body").append(strVar);

$("#gmSubmit").click ( function () {
    $("#gmPopupContainer").hide ();
    var category = document.getElementsByName("Option");
    var choice;
    for(var i=0;i<category.length;i++){
        if(category[i].checked){
            getValueOf = category[i].id;
            init(updateType);
            break;
        }
    }
} );

$("#gmClosePopup").click ( function () {
    $("#gmPopupContainer").hide ();
} );

GM_addStyle ( "                                                 \
    #gmPopupContainer {                                         \
        position:               fixed;                          \
        width:                  170px;                           \
        height:                 " + type[1] + "                 \
        margin-left:            -85px;                          \
        margin-top:             " + type[2] + "                 \
        top:                    50%;                            \
        left:                   50%;                            \
        padding:                20px;                           \
        background:             white;                          \
        border:                 3px double black;               \
        border-radius:          1ex;                            \
        z-index:                777;                            \
    }                                                           \
    #gmPopupContainer button{                                   \
        cursor:                 pointer;                        \
        margin:                 1em 1em 0;                      \
        border:                 1px outset buttonface;          \
    }                                                           \
" );
