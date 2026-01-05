// ==UserScript==
// @name         Google Search Linklist
// @namespace    dummbroesel.google
// @version      1.0.1
// @description  testender test
// @author       Dummbroesel
// @include     http://www.google.*/search*
// @include     https://www.google.*/search*
// @include     https://www.google.*/*
// @include     https://encrypted.google.*/search*
// @include     https://encrypted.google.*/*
// @include     https://spmbt.github.io/googleSearchExtraButtons/saveYourLocalStorage.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29252/Google%20Search%20Linklist.user.js
// @updateURL https://update.greasyfork.org/scripts/29252/Google%20Search%20Linklist.meta.js
// ==/UserScript==

function isEmpty( input ) {
    if (typeof input === 'undefined' || input === null || input === '' || (typeof input === 'string' && !input.match(/(\S)+/g))) return true;
    return false;
}

Array.prototype.sortBy = function() {
    function _sortByAttr(attr) {
        var sortOrder = 1;
        if (attr[0] == "-") {
            sortOrder = -1;
            attr = attr.substr(1);
        }
        return function(a, b) {
            var result = (a[attr] < b[attr]) ? -1 : (a[attr] > b[attr]) ? 1 : 0;
            return result * sortOrder;
        };
    }
    function _getSortFunc() {
        if (arguments.length == 0) {
            throw "Zero length arguments not allowed for Array.sortBy()";
        }
        var args = arguments;
        return function(a, b) {
            for (var result = 0, i = 0; result == 0 && i < args.length; i++) {
                result = _sortByAttr(args[i])(a, b);
            }
            return result;
        };
    }
    return this.sort(_getSortFunc.apply(null, arguments));
}

Array.prototype.print = function(title) {
    title = (isEmpty(title)) ? 'Google Link List' : title;
    
    console.log("************************************************************************");
    console.log("**** "+title);
    console.log("************************************************************************");
    for (var i = 0; i < this.length; i++) {
        console.log("URL: "+this[i].url);//, this[i].LastName, "Age: "+this[i].Age);
    }
}

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

function main() {
    console.info('JQuery loaded.');
    jQ(document).keydown(function( event ) {
      if ( event.which == 192 ) {
        var output = [];
        for(var i=0;i<document.getElementsByClassName('rc').length;i++) {
            output.push({url: jQ('.rc .r a')[i].href});  //output + document.getElementsByClassName('_Rm')[i].textContent + "\n";
        }
        output.sortBy('url').print();
      }
    });
}
addJQuery(main);