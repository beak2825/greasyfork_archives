// ==UserScript==
// @name         WordCoundExpander
// @namespace    https://greasyfork.org/
// @version      2.2.2
// @description  Replace difficulty by actual numbers on floflo
// @author       You! You did it!
// @include      https://floflo.moe/book-list/
// @include      https://floflo.moe/books/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369469/WordCoundExpander.user.js
// @updateURL https://update.greasyfork.org/scripts/369469/WordCoundExpander.meta.js
// ==/UserScript==

let cookiename = "floflowordcountexpander";
let refreshrate = 5;

function dealWithLastColumn(app){
    var tableContent = jQuery(".table").eq(0).children().eq(0).children();
    var index = -1;
    for (var i = 1; i < tableContent.length; i++) {
        do{
            index++;
        }while(app.arr[index]['filteredOut']);
        if (tableContent.eq(i)[0].children.length < 5){
            tableContent.eq(i).append("<td>"+app.arr[index]['unknown_custom']+"</td>");
        } else {
            jQuery(tableContent.eq(i)[0].children).eq(4).html(app.arr[index]['unknown_custom']);
        }
    }
}

function setTableListener() {
    const currentFun = window.bookListApp.sortField;
    const currentInit = window.bookListApp.initializeArr;
    window.bookListApp.fld = window.bookListApp.fld.concat(["@Freq"]);

    function customDataLoad(dat,categories=[], doChart=true){
        currentInit(dat,categories=categories,doChart=doChart);
        Vue.nextTick(function () {
            dealWithLastColumn(window.bookListApp);
        });
    }

    function customSortField(field) {
        if(field == "@Freq"){
            this.lastSort['header'] = '@Freq';
            var zzz = 'unknown_custom';
            for (var i = 0; i < this.arr.length; i++) {
                this.arr[i]['sort'] = this.arr[i][zzz];
            }
            if (this.lastSort['field'] == zzz) {
                this.lastSort['order'] == 'asc' ? this.lastSort['order'] = 'desc' : this.lastSort['order'] = 'asc';
            } else {
                this.lastSort['order'] = 'desc';
                this.lastSort['field'] = zzz;
            }
            if (this.lastSort['order'] == 'asc') {
                this.arr.sort(function(b, a) {
                    if (a.sort < b.sort)
                        return -1;
                    if (a.sort > b.sort)
                        return 1;
                    return 0;
                });
            } else {
                this.arr.sort(function(a, b) {
                    if (a.sort < b.sort)
                        return -1;
                    if (a.sort > b.sort)
                        return 1;
                    return 0;
                });
            }
            jQuery('#fullBookList').find('img').each(function() {
                jQuery(this).remove();
            });
        } else {
            currentFun(field);
        }
        Vue.nextTick(function () {

            dealWithLastColumn(window.bookListApp);
        });
    }
    window.bookListApp.initializeArr = customDataLoad;
    window.bookListApp.sortField = customSortField;
    dealWithLastColumn(window.bookListApp);
}

function createCookie(name, value, min) {
    var expires;

    if (min) {
        var date = new Date();
        date.setTime(date.getTime() + (min * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function setReadingVals(array,target) {
  if(array) {
      var val = array[0]+" ("+array[1]+") /"+array[2];
      target.html(val);
    }
}

function raionusHandleCookie(data, dest = cookiename){
    //JSONify the data and store it as cookie
    var temp = JSON.stringify(data);
    createCookie(dest,temp,refreshrate);
}

function applyChange(cookie){
    jQuery(".elementor-post__card").each(function(){
        var target = jQuery(this).find(".elementor-post__badge");
        var myname = jQuery(this).find(".elementor-post__thumbnail__link").attr("href");
        // extract from "https://floflo.moe/"+line.slug+"/"
        var myRealName = myname.substring(19,myname.length -1)
        setReadingVals(cookie[myname.substring(19,myname.length -1)],target);
    });
}

function loadAndMakeCookie(){
    var newcookie = {};
    let mycookie = readCookie(cookiename);
    console.log("cookie "+mycookie);
    if (mycookie != null){
        newcookie = JSON.parse(mycookie);
        applyChange(newcookie);
    } else {
        jQuery.post(my_personal_script_data.abcd, {
            action: "retreiveAllBookData",
            limit: 999,
            offset: 0
        }, function(data){
            var allDescr = jQuery(".elementor-post__card");
            for (var index = 0; index < data.books.length; index++){
                var line = data.books[index];
                var array = [line.unknown_custom, line.unknown, line.unique];
                var key = (line.slug == "temp-alchemizer")?line.title:line.slug
                newcookie[key] = array;
            }
            //raionusHandleCookie(newcookie);
            applyChange(newcookie);
        });
    }
}

(function() {
    "use strict";
    if(window.location.pathname == '/book-list/'){
        console.log("hi");
        loadAndMakeCookie();
    } else if (window.location.pathname == '/books/'){
        const originalBookList = window.makeBookList;
        function upgradedBookList(name="#fullBookList"){
            originalBookList(name);
            setTableListener();
        }
        window.makeBookList = upgradedBookList;
    }
})();