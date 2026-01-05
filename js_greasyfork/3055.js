// ==UserScript==
// @name        巴哈公會表符統計 II
// @namespace   http://mfish.twbbs.org/
// @include     http://guild.gamer.com.tw/guild.php?sn=*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js#0
// @require     http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/jquery-ui.min.js#0
// @version     0.1.1
// @description 統計巴哈公會表符用的腳本
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/3055/%E5%B7%B4%E5%93%88%E5%85%AC%E6%9C%83%E8%A1%A8%E7%AC%A6%E7%B5%B1%E8%A8%88%20II.user.js
// @updateURL https://update.greasyfork.org/scripts/3055/%E5%B7%B4%E5%93%88%E5%85%AC%E6%9C%83%E8%A1%A8%E7%AC%A6%E7%B5%B1%E8%A8%88%20II.meta.js
// ==/UserScript==

this.$ = this.jQuery = $.noConflict();
/*
$('head').append(
    $('<style></style>').html(
        GM_getResourceText('jQueryUICss')
    )
);*/
$('head').append(
    $('<link></link>')
    .attr('type', 'text/css')
    .attr('rel', 'stylesheet')
    .attr('href', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/themes/smoothness/jquery-ui.css')
)

function preventDialogScroll () {
    if ($(".ui-widget-overlay")) //the dialog has popped up in modal view
    {
        //fix the overlay so it scrolls down with the page
        $(".ui-widget-overlay").css({
            position: 'fixed',
            top: '0'
        });

        //get the current popup position of the dialog box
        var pos = $(".ui-dialog").position();
        var bodyPosY = $(document).scrollTop();
        var top = pos.top - bodyPosY;
        console.log(pos);
        console.log(bodyPosY);
        console.log(top);
        if (pos) {
            //adjust the dialog box so that it scrolls as you scroll the page
            $(".ui-dialog").filter(function(){
               return $(this).css('position') !== 'fixed';
            }).css({
                position: 'fixed',
                top: top
            });
        }
    }
}
$('head').append('<style>.ui-dialog img {max-width:40px !important;max-height:40px !important;}</style>')

var  dialog;
dialog = $('<div></div>').attr('id', 'mmis-dialog').attr('title', '統計').css({'z-index': '99999', 'position' : 'relative'}).appendTo('body');

var initDialog = function () { 
    var inited = false;
    function _initDialog() {
        if (inited) {return;}
        inited = true;
        dialog.dialog({ 
            autoOpen: false,
            width: 500 < $(window).width() - 50 ? 500 : $(window).width() - 50,
            height : $(window).height() - 50
        });
        preventDialogScroll();
    }
    return _initDialog;
}();

function parse (url) {
    var rule = /http:\/\/p2\.bahamut\.com\.tw\/B\/GUILD\/e\/0\/\d+_(\w+)\.GIF/g;
    //http://p2.bahamut.com.tw/B/GUILD/e/0/7540_14dc.GIF
}

function objectToArray (arr) {
    var temp = [];
    for (var i in arr) {
        if (arr.hasOwnProperty(i)) {
            temp.push([i, arr[i]]);
        }
    }
    return temp;
}

function main () {
    $('.msgreport.BC2>a[onclick^="readAllReply"]').trigger('click')
    function show () {
        console.log( $('.msgreport.BC2>a[onclick^="readAllReply"]') );
        initDialog();
        var temp = []
        $('.msgright div[id^=allReply] div[id^=r-]').each(function(){
            var name, img
            name = $(this).find('div>.msgname:first-child').text();
            /*dialog.append($('<p>').text(name))*/
            img = $(this).find('div>a>img')
            img.each(function(){
                url = $(this).attr('src');
                temp.push([name, url]);
            })
            /*dialog.append(img)*/
            img = $(this).find('div>img')
            img.each(function(){
                url = $(this).attr('src');
                temp.push([name, url]);
            })
            /*dialog.append(img)*/
        })
        var counts = {};
        for (var i = 0; i < temp.length; i++) {
            var name = temp[i][0];
            var url = temp[i][1];
            if (!counts[name]) {
                counts[name] = {};
            }
            if (!counts[name][url]) {
                counts[name][url] = 0;
            }
            if (!counts[name].all) {
                counts[name].all = 0;
            }
            counts[name][url]++;
            counts[name].all++;
        }
        console.log(counts);
        var sortedCounts = [];
        
        for (i in counts) {
           if (counts.hasOwnProperty(i)) {
               sortedCounts.push([i, counts[i]]);
           }
        }
        
        sortedCounts.sort(function(a, b) {
            return b[1].all - a[1].all;
        });
        console.log(sortedCounts);
        var table = $('<table></table>').css(
           {
               width: '100%'
           }
        );
        var tbody = $('<tbody>').appendTo(table);
        sortedCounts.forEach(function(p){
            var row = $('<tr>');
            var counts = p[1];
            var image, count, div;
            row.append($('<td>').text(p[0]));
            var imageCounts = $('<td>');
            var arr_counts = objectToArray(counts)
            arr_counts.sort(function(a, b) {
                return b[1] - a[1];
            });
            arr_counts.forEach(function(count){
                if (count[0] === 'all') {return;}
                image = $('<img>').attr('src', count[0]);
                count = count[1];
                div = $('<div>')
                .append(image)
                .append($('<span>').text(count));
                imageCounts.append(div);
            });
            row.append(imageCounts);
            tbody.append(row);
        });
        table.find('td').css('border-bottom', ' 1px solid #cccccc');
        dialog.find('*').remove();
        dialog.append(table);
        dialog.dialog( "open" );
    }
    function wait() {
        if ($('.msgreport.BC2>a[onclick^="readAllReply"]').get(0)) {
            setTimeout(wait, 2000)
        } else {
            $("html, body").animate({ scrollTop: $(document).height() }, 1000, 'swing', function(){
                show ()
            });

        }
    }
    setTimeout(wait, 5000)
}
GM_registerMenuCommand( '統計II!!', main);

//main();