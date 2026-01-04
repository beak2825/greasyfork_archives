// ==UserScript==
// @namespace https://greasyfork.org/es/users/161767
// @name ipv4info.user.js
// @description This script export ipv4info tables to CSV
// @license MIT; https://opensource.org/licenses/MIT
// @version 1.0.3
// @match *://ipv4info.com/*
// @match *://*.ipv4info.com/*
// @exclude http://ipv4info.com/tools/*
// @exclude http://ipv4info.com/store/*
// @exclude http://ipv4info.com/stat/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436282/ipv4infouserjs.user.js
// @updateURL https://update.greasyfork.org/scripts/436282/ipv4infouserjs.meta.js
// ==/UserScript==

// Modified from https://codepen.io/kostas-krevatas/pen/mJyBwp

window.xport = {
  _fallbacktoCSV: true,  
  toXLS: function(tableId, filename, n) {
    var n = (typeof n === 'undefined') ? 0 : n;
    this._filename = (typeof filename == 'undefined') ? tableId : filename;
    
    //var ieVersion = this._getMsieVersion();
    //Fallback to CSV for IE & Edge
    if ((this._getMsieVersion() || this._isFirefox()) && this._fallbacktoCSV) {
      return this.toCSV(tableId);
    } else if (this._getMsieVersion() || this._isFirefox()) {
      alert("Not supported browser");
    }

    //Other Browser can download xls
    var table = document.getElementById(tableId);
    table = (table == null) ? document.getElementsByClassName(tableId)[n] : table;
    
    if(typeof table == "undefined"){
      return false;
    }

    var html = table.outerHTML;

    this._downloadAnchor("data:application/vnd.ms-excel" + encodeURIComponent(html), 'xls'); 
  },
  toCSV: function(tableId, filename, n) {
    var n = (typeof n === 'undefined') ? 0 : n;
    this._filename = (typeof filename === 'undefined') ? tableId : filename;

    var table = document.getElementById(tableId);
    table = (table == null) ? document.getElementsByClassName(tableId)[n] : table;
    console.log(table, typeof table);
    
    if(typeof table == "undefined"){
      return false;
    }

    // Generate our CSV string from out HTML Table
    var csv = this._tableToCSV(table);
    // Create a CSV Blob
    var blob = new Blob([csv], { type: "text/csv" });

    // Determine which approach to take for the download
    if (navigator.msSaveOrOpenBlob) {
      // Works for Internet Explorer and Microsoft Edge
      navigator.msSaveOrOpenBlob(blob, this._filename + ".csv");
    } else {      
      this._downloadAnchor(URL.createObjectURL(blob), 'csv');      
    }
  },
  _getMsieVersion: function() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf("MSIE ");
    if (msie > 0) {
      // IE 10 or older => return version number
      return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10);
    }

    var trident = ua.indexOf("Trident/");
    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf("rv:");
      return parseInt(ua.substring(rv + 3, ua.indexOf(".", rv)), 10);
    }

    var edge = ua.indexOf("Edge/");
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return parseInt(ua.substring(edge + 5, ua.indexOf(".", edge)), 10);
    }

    // other browser
    return false;
  },
  _isFirefox: function(){
    if (navigator.userAgent.indexOf("Firefox") > 0) {
      return 1;
    }
    
    return 0;
  },
  _downloadAnchor: function(content, ext) {
      var anchor = document.createElement("a");
      anchor.style = "display:none !important";
      anchor.id = "downloadanchor";
      document.body.appendChild(anchor);

      // If the [download] attribute is supported, try to use it
      
      if ("download" in anchor) {
        anchor.download = this._filename + "." + ext;
      }
      anchor.href = content;
      anchor.click();
      anchor.remove();
  },
  create_link_btn: function(obj_id, n){
    var n = (typeof n === 'undefined') ? 0 : n;
    var table = document.getElementById(obj_id);
    table = (table == null) ? document.getElementsByClassName(obj_id)[n] : table;
    console.log(table, typeof table);
    if(typeof table == "undefined"){
      return false;
    }
    var parent_div = table.parentNode;
    var link = document.createElement("a");
    link.id = "download_btn";
    link.href = "#download";
    link.onclick = function(e){
      e.preventDefault();
      console.log(e, obj_id);
      var file_name = window.location.pathname.split("/").pop().replace(".html", "")
      window.xport.toCSV(obj_id,file_name,n);
    };
    link.innerText = "Export to CSV";
    link.style = "position:absolute;z-index:1000;border:1px solid #f0f0f0;padding:10px;color:#fff;background-color:#333;";    
    parent_div.insertBefore(link, table);
  },
  _tableToCSV: function(table) {
    var slice = Array.prototype.slice;

    return slice.call(table.rows).map(function(row){
      return slice.call(row.cells).map(function(cell){
        return cell.innerText.trim();
      }).join(","); 
    }).join("\r\n");
  }
};

document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    if(!xport.create_link_btn('main_table')){
      if(!xport.create_link_btn('TB2')){
          xport.create_link_btn('TB2_90pr', 3); // Select third class element
      }
    }
  }
}