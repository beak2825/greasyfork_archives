// ==UserScript==
// @name        add codes in bulk
// @namespace   james0x57.com
// @include     http://gamehacking.org/*
// @version     1
// @grant       none
// @locale      en
// @description bulk add codes to gamehacking.org
// @downloadURL https://update.greasyfork.org/scripts/32740/add%20codes%20in%20bulk.user.js
// @updateURL https://update.greasyfork.org/scripts/32740/add%20codes%20in%20bulk.meta.js
// ==/UserScript==

var $ = unsafeWindow.jQuery;
var hacker = $("#user_greeting a").html().trim();

var parseCodes = function (src) {
  var codes = [];
  src += "\n";
  src.replace(/(?:^|(?:\r?\n)*)([^\r\n]+)\r?\n((?:\S{8} \S{8}\r?\n)+)([\s\S]*?(?=$|[^\r\n]+\r?\n\S{8} \S{8}[\r\n$]))/g, function (x, title, code, note) {
    codes.push({
      title: title,
      code: code,
      note: note
    });
    return "";
  });
  return codes;
};

var observer;
var selectors = [];
var doc = typeof document === "undefined" ? null : document;
var win = typeof window === "undefined" ? unsafeWindow : window;
var MutationObserver = win.MutationObserver || win.WebKitMutationObserver || win.MozMutationObserver;

var checkSelectors = function () {
  var s, selector, sstring, exists;
  var slen = selectors.length;
  for (s = 0; s < slen; s++) {
    selector = selectors[s];
    sstring = selector.string;
    exists = doc.querySelector(sstring);
    if (exists && !selector.exists) {
      selector.exists = true;
      selector.startedExisting.call(null, sstring);
    } else if (!exists && selector.exists) {
      selector.exists = false;
      selector.stoppedExisting.call(null, sstring);
    }
  }
};

var setup = function () {
  if (!observer && MutationObserver) {
    // Watch for changes in the document
    observer = new MutationObserver(checkSelectors);
    observer.observe(doc.documentElement, {
      childList: true,
      subtree: true
    });
  }
};

// add a watch selector for the given selector,
// call inserted as that selector's state changes from doesn't match anything to matches something
// call removed as that selector's state changes from matches something to doesn't match anything
// inserted and removed callbacks are called with the selector string passed in as the only parameter
var onSelector = function (selector, inserted, removed) {
  observer || setup();
  var nullFn = function () {};
  selectors.push({
    string: selector,
    exists: doc && doc.querySelector && !!doc.querySelector(selector),
    startedExisting: inserted || nullFn,
    stoppedExisting: removed || nullFn
  });
};

// remove all watch selectors:
// offSelector( selector ) -> matching that selector
// offSelector( selector, inserted ) -> matching that selector && matching that inserted function
// offSelector( selector, null, removed ) -> matching that selector && matching that removed function
// offSelector( selector, inserted, removed ) -> matching that selector, inserted function, and removed function
var offSelector = function (selector, inserted, removed) {
  var s, selectorObj, selectorMatches, insertedMatches, removedMatches;
  for (s = 0; s < selectors.length; s++) {
    selectorObj = selectors[s];
    selectorMatches = selectorObj.string === selector;
    insertedMatches = !inserted || selectorObj.startedExisting === inserted;
    removedMatches = !removed || selectorObj.stoppedExisting === removed;
    if (selectorMatches && insertedMatches && removedMatches) {
      selectors.splice(s, 1);
      s--;
    }
  }
};

var fcs = fn => {
  return fn.toString().replace(/^(\r?\n|[^\/])*\/\*!?(\r?\n)*|\s*\*\/(\r|\n|.)*$/gi,"");
};

var bulkBoxTemplate = (fcs(function() {/*!
  <div class="modal-content" style="position: absolute; right: 0px; top: 50px;">
    <div class="modal-header">
      <h4 class="modal-title">James0x57 Addon</h4>
    </div>
    <div class="modal-body">
      <div class="panel panel-primary">
        <div class="panel-heading">
          Bulk Add Codes
        </div>
        <div class="panel-body">
          <div class="row">
            <div class="col-sm-12">
              <div class="input-group">
                <span class="input-group-addon">
                  <label for="gamTitle">Codes</label>
                </span>
                <textarea class="form-control" id="jamesBulkCodes" style="height:280px;"></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-primary" onclick="doJamesBulkCodes('addCode')">&lt; &lt; Populate Form</button>
    </div>
  </div>
*/}));

var showBulkBox = function () {
  $("#modalWindow").append(bulkBoxTemplate);
};

var hideBulkBox = function () {
  // Do nothing?
};

unsafeWindow.doJamesBulkCodes = function () {
  var codes = parseCodes($("#jamesBulkCodes")[0].value);
  
  var codeFrom, code;
  for (var c = 0; c < codes.length; c++) {
    code = codes[c];
    cloneNewCode($("form#addCode .panel-primary").last()); // click the + icon on the last code in the form to spawn another
    codeForm = $("form#addCode .panel-primary").last(); // the new code form
    codeForm.find("input[name='name[]']")[0].value = code.title.replace(" [" + hacker + "]", "").trim();
    codeForm.find("textarea[name='codedata[]']")[0].value = code.code.trim();
    codeForm.find("textarea[name='note[]']")[0].value = code.note.trim();
  }
  // click the minus button on the first one since it wasn't used:
  $("form#addCode .panel-primary").first().remove(); // remove the empty code fields at the top
  checkMinuses(); // update the minus sign
};

onSelector(
  "form#addCode",
  showBulkBox,
  hideBulkBox
);

