// ==UserScript==
// @name Don
// @namespace https://greasyfork.org/users/323892
// @version 0.0.1.20210918210349
// @description Don dio-tools-david1327
// @author David1327
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/426916/Don.user.js
// @updateURL https://update.greasyfork.org/scripts/426916/Don.meta.js
// ==/UserScript==

(function() {
let css = `.text-info {
    color: #3114d2;
    margin-top: 10px;
}

.text-danger {
    color: #a94442;
}

.table-bordered>tbody>tr>td,
.table-bordered>tbody>tr>th,
.table-bordered>tfoot>tr>td,
.table-bordered>tfoot>tr>th,
.table-bordered>thead>tr>td,
.table-bordered>thead>tr>th {
  border: 1px solid #ddd
}

.pagination {
  display: inline-block;
  padding-left: 0;
  margin: 20px 0;
  border-radius: 4px
}

.pagination>li {
  display: inline
}

.pagination>li>a,
.pagination>li>span {
  position: relative;
  float: left;
  padding: 6px 12px;
  margin-left: -1px;
  line-height: 1.42857143;
  color: #337ab7;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid #ddd
}

.pagination>li:first-child>a,
.pagination>li:first-child>span {
  margin-left: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px
}

.pagination>li:last-child>a,
.pagination>li:last-child>span {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px
}

.pagination>li>a:focus,
.pagination>li>a:hover,
.pagination>li>span:focus,
.pagination>li>span:hover {
  z-index: 2;
  color: #23527c;
  background-color: #eee;
  border-color: #ddd
}

.pagination>.active>a,
.pagination>.active>a:focus,
.pagination>.active>a:hover,
.pagination>.active>span,
.pagination>.active>span:focus,
.pagination>.active>span:hover {
  z-index: 3;
  color: #fff;
  cursor: default;
  background-color: #337ab7;
  border-color: #337ab7
}

.pagination>.disabled>a,
.pagination>.disabled>a:focus,
.pagination>.disabled>a:hover,
.pagination>.disabled>span,
.pagination>.disabled>span:focus,
.pagination>.disabled>span:hover {
  color: #777;
  cursor: not-allowed;
  background-color: #fff;
  border-color: #ddd
}

.pagination-lg>li>a,
.pagination-lg>li>span {
  padding: 10px 16px;
  font-size: 18px;
  line-height: 1.3333333
}

.pagination-lg>li:first-child>a,
.pagination-lg>li:first-child>span {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px
}

.pagination-lg>li:last-child>a,
.pagination-lg>li:last-child>span {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px
}

.pagination-sm>li>a,
.pagination-sm>li>span {
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1.5
}

.pagination-sm>li:first-child>a,
.pagination-sm>li:first-child>span {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px
}

.pagination-sm>li:last-child>a,
.pagination-sm>li:last-child>span {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px
}

div.dataTables_wrapper div.dataTables_length label {
  font-weight: normal;
  text-align: left;
  white-space: nowrap
}

div.dataTables_wrapper div.dataTables_length select {
  width: 75px;
  display: inline-block
}

#donations_detail_paginate {
  margin: 0;
  white-space: nowrap;
  text-align: right;
}

#donations_detail_paginate ul.pagination {
  margin: 2px 0;
  white-space: nowrap
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
