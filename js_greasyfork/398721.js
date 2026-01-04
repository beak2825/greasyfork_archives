// ==UserScript==
// @name        nyaa wide 2
// @description makes nyaa wide
// @namespace   http
// @include     https://*.nyaa.si/*
// @include     https://nyaa.si/*
// @version     1.1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/398721/nyaa%20wide%202.user.js
// @updateURL https://update.greasyfork.org/scripts/398721/nyaa%20wide%202.meta.js
// ==/UserScript==

(function(){
    // fix date
    $('td.vtop').each(function() {

        var regex = /^(\d{4})-(\d{2})-(\d{2}), (\d{1,2}):(\d{2}) UTC$/;
        var match = regex.exec(this.innerHTML);
       
        if (match) {
            var date = new Date(Date.UTC(match[1], match[2]-1, match[3], match[4], match[5]));
            $(this).html(date.toLocaleString());
        }
    });

    // make sort by date explicit
    $("table.tlistsortorder > tbody > tr > td > a:contains('Date')").attr('href', function(i, val){
        var thing = val.indexOf("?")>-1?'&':'?';
        return val + thing + 'sort=1';
    });

    color_hierarchy = ['#4267bc', '#9f557a', '#5aa5a2', '#bbb'];

    // group rows
    var categoryMap = {};
    var buttonMap = {};
    
    $('table.torrent-list th').first().remove();
    
    $('table.torrent-list img').each(function(){

        var $parent_tr = $(this).closest('tr');
      //var rowClass = $parent_tr.attr('class');
      //console.log('clazz',clazz);
        
//         var $button = $('a', $(this));
        var category = $(this).attr('alt');
        
//         $(this).remove();
        $(this).closest('td').remove();
        $parent_tr.remove();
        
//         console.log(category, $parent_tr);

            if (typeof(categoryMap[category]) === 'undefined') {
                categoryMap[category] = [];
                buttonMap[category] = $(this).closest('a');
            }
        
           categoryMap[category].push($parent_tr);
        
    });
    
    $('table.torrent-list').after($('<div>', {'class': 'tlist-columns'}));
    
    for (var cat in categoryMap) {
        
        console.log(cat, buttonMap[cat].attr('href'));
        
        var catStr = buttonMap[cat].attr('href').match(/c=[^&]+/)[0];
        var href = window.location.href.replace(/c=[^&]+/, catStr);
        
//         if (href.indexOf("cats=") == -1) {
//             var thing = href.indexOf("?")>-1?'&':'?';
//             href += thing+catStr;
//         }
        
        var $table = $('<table class="table tlist"><tbody></tbody></table>');
//         var $table = $('table.torrent-list');
//         console.log($table);
        $table.append('<tr><th colspan="9" style=""><h3 style="text-transform:uppercase;letter-spacing:0px;color:white"><a href="'+ href + '">' + buttonMap[cat].attr('title')+'</a><h3></th></tr>');
        
        console.log('hello?')
        
        for (var i = 0; i < categoryMap[cat].length; i++) {
            $new_tr1 = $('<tr>', {class: categoryMap[cat][i].attr('class')});
            $new_tr2 = $('<tr>', {class: categoryMap[cat][i].attr('class')});
            //console.log(categoryMap[cat]);
            $tds = categoryMap[cat][i].find('td');
            console.log('hello??')
            $td = $tds.first();
            $td.attr('colspan', 6);
            
            console.log('hello???')
            $innertable = $('<table class="table table-condensed small">')
            $innertbody = $('<tbody>');
            $new_tr2.append($tds.not(':first'));
            $innertbody.append($new_tr2);
            $innertable.append($innertbody);
            console.log('hello????')

            $td.append($innertable);
            $new_tr1.append($td);
            
            $table.append($new_tr1);
//             $table.append($new_tr2);
        }
        
        
        $('.tlist-columns').append($table);
        //            $('table.tlist tbody').append('<tr><th colspan="7">'+buttonMap[cat][0].outerHTML+'</th></tr>');
        //            $('table.tlist tbody').append( categoryMap[cat]);
        
    }
    
    var numCols = Math.min(3, Object.keys(categoryMap).length);
    
    // restructure rows
    
        
    $('.tlisthead').remove();

    $('.tlisticon').attr('rowspan', 2);
    $('.tlistname').attr('colspan', 7);

    $('.tlistfailed').html(function(index,html){
        return html.replace(/Status unknown/g,'???');
    });

    $('.tlistname').each(function(){

        var $parent_tr = $(this).parent('tr');

        var $tr = $('<tr>', {'class' : $parent_tr.attr('class') + ' shit'});

        $tr.append($(this).nextAll('.tlistdownload'));
        $tr.append($(this).nextAll('.tlistsize'));
        $tr.append($(this).nextAll('.tlistfailed'));
        $tr.append($(this).nextAll('.tlistsn'));
        $tr.append($(this).nextAll('.tlistln'));
        $tr.append($(this).nextAll('.tlistdn'));
        $tr.append($(this).nextAll('.tlistmn'));

        $tr.append($('<td class="tlistfiller" style="width:100%;"></td>'));

        $parent_tr.after($tr);
    });

        addGlobalStyle(
    "body{\
        background-color:#fff !important;\
        font-family:\"yu gothic UI\" !important;\
        width:auto !important;\
        min-width:0 !important;\
    }\
    td{\
        padding:0px;\
    }\
    a{\
        color:#00526E;\
        text-decoration:none;\
    }\
    a:hover{\
        color:#00526E;\
        text-decoration:underline;\
    }\
    \.viewdescription, .comment{\
        border:1px solid #999;\
    }\
    \
    div#searchcontainer>input[type=\"text\"],div#searchcontainer>select {\
        background-color:#444;\
        border:1px solid #222;\
        padding:2px;\
        color:#ccc;\
    }\
    \
    div#topbar {\
        background-image:none !important;\
        background-color:#000 !important;\
    }\
    \
    .content{\
        background-color:#fff !important;\
        width:90% !important;\
        margin: 0px 0px 0px 4%;\
        border:none !important;\
        padding:1% !important;\
        border-radius:0px;\
    }\
  div.tlist-columns {\
  -webkit-column-count: "+numCols+";\
  -webkit-column-gap:   5px;\
  -moz-column-count:    "+numCols+";\
  -moz-column-gap:      5px;\
  column-count:         "+numCols+";\
  column-gap:           5px;  \
  }\
@media (max-width: 1000px) {\
  div.tlist-columns {\
  -webkit-column-count: "+Math.min(numCols, 2)+";\
  -webkit-column-gap:   5px;\
  -moz-column-count:    "+Math.min(numCols, 2)+";\
  -moz-column-gap:      5px;\
  column-count:         "+Math.min(numCols, 2)+";\
  column-gap:           5px;  \
  }\
}\
@media (max-width: 500px) {\
  div.tlist-columns {\
  -webkit-column-count: 1;\
  -webkit-column-gap:   5px;\
  -moz-column-count:    1;\
  -moz-column-gap:      5px;\
  column-count:         1;\
  column-gap:           5px;  \
  }\
}\
\
    span.page, a.page {\
        border: 1px solid rgba(0,0,0,.1) !important;\
        background-color:rgba(255,255,255,.3);\
    }\
    \
    #main{\
        width:auto !important;\
        min-width:0 !important;\
        padding-top:40px;\
    }\
    \
    table.tlist {\
        table-layout:auto !important;\
        border: 0px solid rgba(0,0,0,.25) !important;\
        display:inline-block;\
    }\
    \
  \
    \
    td.tlistname {\
        width:100%;\
        padding:0px 0px 0px 10px !important;\
    }\
    \
    td.tlistsize {\
        border:0px !important;\
        white-space:nowrap;\
    }\
    \
    td.tlisticon {\
        padding:5px !important;\
    }\
    \
    .tlistsize, .tlistsn, .tlistln, .tlistdn, .tlistmn, .tlistfailed, .tlistdownload {\
        font-size:80%;\
        padding:0px 5px 5px 10px;\
        margin:0px;\
    }\
    \
    input,select{font-family:\"Yu Gothic UI\" !important;}\
    \
    tr.tlistrow{\
\
        border-top:1px solid rgba(0,0,0,.13);\
        background:#fff;\
        border-bottom:0px;\
    }\
    \
    tr.trusted{\
        background-color:#DFF0D8;\
    }\
    tr.aplus{\
        background-color:#D9EDF7;\
    }\
    tr.remake{\
        background-color:#F2DEDE;\
    }\
    \
     tr.shit {\
        border-top:0px !important;\
        padding:0px 0px 5px 0px !important;\
    }");
    
    var prevRowColor;


    $('tr.tlistrow').each(function() {

        var currRowColor = getColorByRowClass($(this));

        prevRowColor = currRowColor;

        if ($('img[alt*="Non-English"]', this).size() > 0) {
            $(this).fadeTo(500, .13);
            $(this).next().fadeTo(500, .13);
        }
    });

    function compareColors(color1, color2) {

        for (var i = 0; i < color_hierarchy.length; i++) {
            if (color1 == color_hierarchy[i] || color2 == color_hierarchy[i])
                return color_hierarchy[i];
        }

        return color_hierarchy[color_hierarchy.length-1];

    }

    function getColorByRowClass($row) {
       
        if ($row.hasClass('aplus')) {
            return color_hierarchy[0];
        } else if ($row.hasClass('remake')) {
            return color_hierarchy[1];
        } else if ($row.hasClass('trusted')) {
            return color_hierarchy[2];
        }

        return color_hierarchy[3];
    }

        function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
   
})();