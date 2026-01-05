// ==UserScript==
// @name         MTurk HIT Database Mk.II
// @author       feihtality
// @namespace    https://greasyfork.org/en/users/12709
// @version      5.9.016
// @description  Keep track of the HITs you've done (and more!). Cross browser compatible.
// @include      /^https://www\.mturk\.com/mturk/(dash|view|sort|find|prev|search|accept|cont).*/
// @exclude      https://www.mturk.com/mturk/findhits?*hit_scraper
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12997/MTurk%20HIT%20Database%20MkII.user.js
// @updateURL https://update.greasyfork.org/scripts/12997/MTurk%20HIT%20Database%20MkII.meta.js
// ==/UserScript==

/**\
 ** 
 ** This is a complete rewrite of the MTurk HIT Database script from the ground up, which
 ** eliminates obsolete methods, fixes many bugs, and brings this script up-to-date 
 ** with the current modern browser environment.
 **
\**/ 


/*
 * TODO
 *   misc refactoring
 *   tagging (?)
 *
 */



const DB_VERSION = 4;
const DB_NAME = 'HITDB_TESTING';
const MTURK_BASE = 'https://www.mturk.com/mturk/';

/***************************      Native code modifications      *******************************/
if (!NodeList.prototype[Symbol.iterator]) NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
Number.prototype.toPadded = function(length) { // format leading zeros
  'use strict';
  length = length || 2;
  return ("0000000"+this).substr(-length);
};
Math.decRound = function(v, shift) { // decimal rounding
  'use strict';
  v = Math.round(+(v+"e"+shift));
  return +(v+"e"+-shift);
};
Date.prototype.toLocalISOString = function() { // ISOString by local timezone
  'use strict';
  var pad = function(num) { return Number(num).toPadded(); },
      offset = pad(Math.floor(this.getTimezoneOffset()/60)) + pad(this.getTimezoneOffset()%60),
      timezone = this.getTimezoneOffset() > 0 ? "-" + offset : "+" + offset;
  return this.getFullYear() + "-" + pad(this.getMonth()+1) + "-" + pad(this.getDate()) +
    "T" + pad(this.getHours()) + ":" + pad(this.getMinutes()) + ":" + pad(this.getSeconds()) + timezone;
};
/***********************************************************************************************/

(function() { // simplify strict scoping
  'use strict';

  var qc = { 
    extraDays: !!localStorage.getItem("hitdb_extraDays") || false, 
    fetchData: document.location.pathname === "/mturk/dashboard" ? JSON.parse(localStorage.getItem("hitdb_fetchData") || "{}") : null,
    seen: {},
    aat: ~document.location.pathname.search(/(dash|accept|cont)/) ? JSON.parse(localStorage.getItem("hitdb_autoAppTemp") || "{}") : null,
    save: function(key, name, isObj) {
      if (isObj) 
        localStorage.setItem(name, JSON.stringify(this[key]));
      else 
        localStorage.setItem(name, this[key]);
    }
  },
      metrics = {};

  var 
  HITStorage = { //{{{
    data: {}, db: null,

    versionChange: function hsversionChange() { //{{{
      var db = this.result;
      db.onversionchange = function(e) { console.log("detected version change??",console.dir(e)); db.close(); };
      this.onsuccess = function() { db.close(); };
      var dbo;

      console.groupCollapsed("HITStorage.versionChange::onupgradeneeded");

      if (!db.objectStoreNames.contains("HIT")) { 
        console.log("creating HIT OS");
        dbo = db.createObjectStore("HIT", { keyPath: "hitId" });
        dbo.createIndex("date", "date", { unique: false });
        dbo.createIndex("requesterName", "requesterName", { unique: false});
        dbo.createIndex("title", "title", { unique: false });
        dbo.createIndex("reward", "reward", { unique: false });
        dbo.createIndex("status", "status", { unique: false });
        dbo.createIndex("requesterId", "requesterId", { unique: false });

        localStorage.setItem("hitdb_extraDays", true);
        qc.extraDays = true;
      }
      
      if (!db.objectStoreNames.contains("STATS")) {
        console.log("creating STATS OS");
        dbo = db.createObjectStore("STATS", { keyPath: "date" });
      }
      if (this.transaction.objectStore("STATS").indexNames.length < 5) { // new in v5: schema additions
        this.transaction.objectStore("STATS").createIndex("approved", "approved", { unique: false });
        this.transaction.objectStore("STATS").createIndex("earnings", "earnings", { unique: false });
        this.transaction.objectStore("STATS").createIndex("pending", "pending", { unique: false });
        this.transaction.objectStore("STATS").createIndex("rejected", "rejected", { unique: false });
        this.transaction.objectStore("STATS").createIndex("submitted", "submitted", { unique: false });
      }

      (function _updateNotes(dbt) { // new in v5: schema change
        if (!db.objectStoreNames.contains("NOTES")) {
          console.log("creating NOTES OS");
          dbo = db.createObjectStore("NOTES", { keyPath: "id", autoIncrement: true });
          dbo.createIndex("hitId", "hitId", { unique: false });
          dbo.createIndex("requesterId", "requesterId", { unique: false });
          dbo.createIndex("tags", "tags", { unique: false, multiEntry: true });
          dbo.createIndex("date", "date", { unique: false });
        }
        if (db.objectStoreNames.contains("NOTES") && dbt.objectStore("NOTES").indexNames.length < 3) {
            _mv(db, dbt, "NOTES", "NOTES", _updateNotes);
        }
      })(this.transaction);

      if (db.objectStoreNames.contains("BLOCKS")) {
        console.log("migrating BLOCKS to NOTES");
        var temp = [];
        this.transaction.objectStore("BLOCKS").openCursor().onsuccess = function() {
          var cursor = this.result;
          if (cursor) {
            temp.push( {
              requesterId: cursor.value.requesterId,
              tags: "Blocked",
              note: "This requester was blocked under the old HitDB. Blocking has been deprecated and removed "+
                "from HIT Databse. All blocks have been converted to a Note."
            } );
            cursor.continue();
          } else {
            console.log("deleting blocks");
            db.deleteObjectStore("BLOCKS");
            for (var entry of temp)
              this.transaction.objectStore("NOTES").add(entry);
          }
        };
      }

      function _mv(db, transaction, source, dest, fn) { //{{{
        var _data = [];
        transaction.objectStore(source).openCursor().onsuccess = function() {
          var cursor = this.result;
            if (cursor) {
              _data.push(cursor.value);
              cursor.continue();
            } else {
              db.deleteObjectStore(source);
              fn(transaction);
              if (_data.length)
                for (var i=0;i<_data.length;i++)
                  transaction.objectStore(dest).add(_data[i]);
                //console.dir(_data);
            }
        };
      } //}}}

      console.groupEnd();
    }, // }}} versionChange

    parseDOM: function(doc) {//{{{
      Status.color = "black";

      var errorCheck = doc.querySelector('td[class="error_title"]');

      if (doc.title.search(/Status$/) > 0)            // status overview
        parseStatus();
      else if (doc.querySelector('td[colspan="4"]'))  // valid status detail, but no data
        parseMisc("next");
      else if (doc.title.search(/Status Detail/) > 0) // status detail with data
        parseDetail();
      else if (errorCheck) {                          // encountered an error page
        // hit max request rate
        if (~errorCheck.textContent.indexOf("page request rate")) {
          var _d = doc.documentURI.match(/\d{8}/)[0],
              _p = doc.documentURI.match(/ber=(\d+)/)[1];
          metrics.dbupdate.mark("[PRE]"+_d+"p"+_p, "start");
          console.log("exceeded max requests; refetching %sp%s", _d, _p);
          Status.node.innerHTML = "Exceeded maximum server requests; retrying "+Utils.ISODate(_d)+" page "+_p+"."+
            "<br>Please wait...";
          setTimeout(HITStorage.fetch, 950, doc.documentURI);
          return;
        }
        // no more staus details left in range
        else if (qc.extraDays)
          parseMisc("end");
      }
      else 
        Utils.errorHandler(new Error("Unhandled document received with URI '" + doc.docuemntURI + "'"));


      function parseStatus() {//{{{
        HITStorage.data = { HIT: [], STATS: [] };
        qc.seen = {};
        ProjectedEarnings.clear();

        // reload auto-approval data to cover not refreshing the dashboard before running an update
        qc.aat = JSON.parse(localStorage.getItem("hitdb_autoAppTemp") || "{}");
        qc.aac = JSON.parse(localStorage.getItem("hitdb_autoAppCollection") || "{}");

        var _pastDataExists = Boolean(Object.keys(qc.fetchData).length);
        var raw = { 
          day: doc.querySelectorAll(".statusDateColumnValue"), 
          sub: doc.querySelectorAll(".statusSubmittedColumnValue"),
          app: doc.querySelectorAll(".statusApprovedColumnValue"),
          rej: doc.querySelectorAll(".statusRejectedColumnValue"),
          pen: doc.querySelectorAll(".statusPendingColumnValue"),
          pay: doc.querySelectorAll(".statusEarningsColumnValue") 
        };
        
        var timeout = 0;
        for (var i=0;i<raw.day.length;i++) {
          var d = {};
          var _date = raw.day[i].childNodes[1].href.substr(53);
          d.date      = Utils.ISODate(_date);
          d.submitted = +raw.sub[i].textContent;
          d.approved  = +raw.app[i].textContent;
          d.rejected  = +raw.rej[i].textContent;
          d.pending   = +raw.pen[i].textContent;
          d.earnings  = +raw.pay[i].textContent.substr(1);
          HITStorage.data.STATS.push(d);

          // check whether or not we need to get status detail pages for date, then
          // fetch status detail pages per date in range and slightly slow
          // down GET requests to avoid making too many in too short an interval
          var payload = { encodedDate: _date, pageNumber: 1, sortType: "All" };
          if (_pastDataExists) {
            // date not in range but is new date (or old date but we need updates)
            // lastDate stored in ISO format, fetchData date keys stored in mturk's URI ecnodedDate format
            if ( (d.date > qc.fetchData.lastDate) || ~(Object.keys(qc.fetchData).indexOf(_date)) ) {
              setTimeout(HITStorage.fetch, timeout, MTURK_BASE+"statusdetail", payload);
              timeout += 380;

              qc.fetchData[_date] = { submitted: d.submitted, pending: d.pending };
            } 
          } else { // get everything
            setTimeout(HITStorage.fetch, timeout, MTURK_BASE+"statusdetail", payload);
            timeout += 380;

            qc.fetchData[_date] = { submitted: d.submitted, pending: d.pending };
          }
        } // for
        qc.fetchData.expectedTotal = _calcTotals(qc.fetchData);

        // try for extra days
        if (qc.extraDays === true) {
          localStorage.removeItem("hitdb_extraDays");
          d = _decDate(HITStorage.data.STATS[HITStorage.data.STATS.length-1].date);
          qc.extraDays = d; // repurpose extraDays for QC
          payload = { encodedDate: d, pageNumber: 1, sortType: "All" };
          setTimeout(HITStorage.fetch, 1000, MTURK_BASE+"statusdetail", payload);
        }
        console.log(HITStorage.data);
        qc.fetchData.lastDate = HITStorage.data.STATS[0].date; // most recent date seen
        qc.save("fetchData", "hitdb_fetchData", true);

      }//}}} parseStatus

      function parseDetail() {//{{{
        var _date = doc.documentURI.replace(/.+(\d{8}).+/, "$1");
        var _page = doc.documentURI.replace(/.+ber=(\d+).+/, "$1");

        metrics.dbupdate.mark("[PRE]"+_date+"p"+_page, "end");
        Status.message = "Processing "+Utils.ISODate(_date)+" page "+_page;
        var raw = {
          req:      doc.querySelectorAll(".statusdetailRequesterColumnValue"),
          title:    doc.querySelectorAll(".statusdetailTitleColumnValue"),
          pay:      doc.querySelectorAll(".statusdetailAmountColumnValue"),
          status:   doc.querySelectorAll(".statusdetailStatusColumnValue"),
          feedback: doc.querySelectorAll(".statusdetailRequesterFeedbackColumnValue")
        };

        for (var i=0;i<raw.req.length;i++) {
          var d = {};
          d.date          = Utils.ISODate(_date);
          d.feedback      = raw.feedback[i].textContent.trim();
          d.hitId         = raw.req[i].childNodes[1].href.replace(/.+HIT\+(.+)/, "$1");
          d.requesterId   = raw.req[i].childNodes[1].href.replace(/.+rId=(.+?)&.+/, "$1");
          d.requesterName = raw.req[i].textContent.trim();
          d.reward        = +raw.pay[i].textContent.substr(1);
          d.status        = raw.status[i].textContent.replace(/\s/g, " "); // replace char160 spaces with char32 spaces
          d.title         = raw.title[i].textContent.trim();

          // mturk apparently never marks $0.00 HITs as 'Paid' so we fix that
          if (!d.reward && ~d.status.search(/approved/i)) d.status = "Paid";
          // insert autoApproval times
          d.autoAppTime = HITStorage.autoApprovals.getTime(_date,d.hitId);

          HITStorage.data.HIT.push(d);

          if (!qc.seen[_date]) qc.seen[_date] = {};
          qc.seen[_date] = { 
            submitted:   qc.seen[_date].submitted + 1 || 1,
            pending: ~d.status.search(/pending/i)  ? 
              (qc.seen[_date].pending + 1 || 1) : (qc.seen[_date].pending || 0)
          };

          ProjectedEarnings.updateValues(d);
        }

        // additional pages remain; get them
        if (doc.querySelector('img[src="/media/right_dbl_arrow.gif"]')) {
          var payload = { encodedDate: _date, pageNumber: +_page+1, sortType: "All" };
          setTimeout(HITStorage.fetch, 250, MTURK_BASE+"statusdetail", payload);
          return;
        }

        if (!qc.extraDays) { // not fetching extra days
          //no longer any more useful data here, don't need to keep rechecking this date
          if (Utils.ISODate(_date) !== qc.fetchData.lastDate &&
              qc.seen[_date].submitted === qc.fetchData[_date].submitted && 
              qc.seen[_date].pending === 0) {
            console.log("no more pending hits, removing",_date,"from fetchData");
            delete qc.fetchData[_date];
            qc.save("fetchData", "hitdb_fetchData", true);
            HITStorage.autoApprovals.purge(_date);
          }
          // finished scraping; start writing
          console.log("date:", _date, "pages:", _page, "totals:", _calcTotals(qc.seen), "of", qc.fetchData.expectedTotal);
          Status.message += " [ "+_calcTotals(qc.seen)+"/"+ qc.fetchData.expectedTotal+" ]";
          if (_calcTotals(qc.seen) === qc.fetchData.expectedTotal) {
            Status.message = "Writing to database...";
            HITStorage.autoApprovals.purge();
            HITStorage.write(HITStorage.data, "update");
          }
        } else if (_date <= qc.extraDays) { // day is older than default range and still fetching extra days
          parseMisc("next");
          console.log("fetchrequest for", _decDate(Utils.ISODate(_date)));
        }
      }//}}} parseDetail

      function parseMisc(type) {//{{{
        var _d = doc.documentURI.match(/\d{8}/)[0],
            _p = doc.documentURI.match(/ber=(\d+)/)[1];
        metrics.dbupdate.mark("[PRE]"+_d+"p"+_p, "end");
        var payload = { encodedDate: _decDate(Utils.ISODate(_d)), pageNumber: 1, sortType: "All" };

        if (type === "next" && +qc.extraDays > 1) {
          setTimeout(HITStorage.fetch, 250, MTURK_BASE+"statusdetail", payload);
          console.log("going to next page", payload.encodedDate);
        } else if (type === "end" && +qc.extraDays > 1) {
          Status.message = "Writing to database...";
          HITStorage.write(HITStorage.data, "update");
        } else 
          Utils.errorHandler(new TypeError("Failed to execute '"+type+"' in '"+doc.documentURI+"'"));
      }//}}}

      function _decDate(date) {//{{{
        var y = date.substr(0,4);
        var m = date.substr(5,2);
        var d = date.substr(8,2);
        date = new Date(y,m-1,d-1);
        return Number(date.getMonth()+1).toPadded() + Number(date.getDate()).toPadded() + date.getFullYear();
      }//}}}

      function _calcTotals(obj) {//{{{
        var sum = 0;
        for (var k in obj){
          if (obj.hasOwnProperty(k) && !isNaN(+k)) 
            sum += obj[k].submitted;
        }
        return sum;
      }//}}}
    },//}}} parseDOM
    
    autoApprovals: {//{{{
      getTime : function(date, hitId) {
        if (qc.extraDays || (!Object.keys(qc.aac).length && !Object.keys(qc.aat).length)) return "";
        var found = false,
            filter = function(id) { return id === hitId; },
            autoApp = "";

        if (qc.aac[date]) {
          autoApp = qc.aac[date][Object.keys(qc.aac[date]).filter(filter)[0]] || "";
          if (autoApp) found = true;
        }
        if (!found && Object.keys(qc.aat).length) {
          for (var key in qc.aat) { if (qc.aat.hasOwnProperty(key)) { // for all dates in aat
            var id = Object.keys(qc.aat[key]).filter(filter)[0];
            autoApp = qc.aat[key][id] || "";
            if (autoApp) {
              found = true;
              qc.aac[date] = qc.aac[date] || {};
              qc.aac[date][id] = qc.aat[key][id]; // move time from temp var to collection var
              delete qc.aat[key][id];
              qc.save("aat", "hitdb_autoAppTemp", true);
              qc.save("aac", "hitdb_autoAppCollection", true);
              break;
            }
          }} // for key (dates)
        } // if !found && aat not empty
        return autoApp;
      },// getTime
      purge : function(date) {
        if (date) { 
          delete qc.aac[date];
          qc.save("aac", "hitdb_autoAppCollection", true);
          return;
        }

        if (!Object.keys(qc.aat).length) return; // nothing here

        var pad = function(num) { return Number(num).toPadded(); },
            _date = Date.parse(new Date().getFullYear() + "-" + pad(new Date().getMonth()+1) + "-" + pad(new Date().getDate()));

        for (var key of Object.keys(qc.aat)) {
          if (_date - key > 169200000) delete qc.aat[key]; // at least 2 days old, no need to keep it around
        }
        qc.save("aat", "hitdb_autoAppTemp", true);
      } // purge
    },//}}} autoApprovals

    fetch: function(url, payload) { //{{{
      //format GET request with query payload
      if (payload) {
        var args = 0;
        url += "?";
        for (var k in payload) {
          if (payload.hasOwnProperty(k)) {
            if (args++) url += "&";
            url += k + "=" + payload[k];
          }
        }
      }
      // defer XHR to a promise
      var fetch = new Promise( function(fulfill, deny) {
        var urlreq = new XMLHttpRequest();
        urlreq.open("GET", url, true);
        urlreq.responseType = "document";
        urlreq.send();
        urlreq.onload = function() { 
          if (this.status === 200) {
            fulfill(this.response);
          } else {
            deny(new Error(this.status + " - " + this.statusText));
          }
        };
        urlreq.onerror   = function() { deny(new Error(this.status + " - " + this.statusText)); };
        urlreq.ontimeout = function() { deny(new Error(this.status + " - " + this.statusText)); };
      } );
      fetch.then( HITStorage.parseDOM, Utils.errorHandler );

    }, //}}} fetch
    
    write: function(input, statusUpdate) { //{{{
      if (statusUpdate === "update")
        qc.timeoutTimer = setTimeout(Utils.errorHandler, 5555, new Error("database access violation"));
      if (!HITStorage.db) { Utils.errorHandler(new TypeError('Database is not defined')); return; }

      var counts = { requests: 0, total: 0 },
          os = Object.keys(input),
          dbo = [],
          dbt = HITStorage.db.transaction(os, "readwrite");
      for (var i=0;i<os.length;i++) { // cycle object stores
        dbo[i] = dbt.objectStore(os[i]);
        for (var k of input[os[i]]) { // cycle entries to put into object stores
          if (statusUpdate && ++counts.requests)
            dbo[i].put(k).onsuccess = _psfn;
          else
            dbo[i].put(k);
        }
      }

      function _psfn() {
        if (++counts.total === counts.requests) {
          Status.push(statusUpdate === "update" ? "Update Complete!" : 
            statusUpdate === "restore" ? "Restoring " + counts.total + " entries... Done!" : 
            "Done!", "green");
          Progress.hide();

          if (statusUpdate === "update") {
            clearTimeout(qc.timeoutTimer);
            ProjectedEarnings.data.dbUpdated = new Date().toLocalISOString();
            ProjectedEarnings.saveState();
            ProjectedEarnings.draw(false);
            metrics.dbupdate.stop(); metrics.dbupdate.report();
          } else if (statusUpdate === "restore") {
            metrics.dbimport.stop(); metrics.dbimport.report();
          }
        }
      }

    }, //}}} write

    recall: function(store, options) {//{{{
      if (options) {
        var index = options.index  || null,
            range = options.range  || null,
            dir   = options.dir    || "next",
            limit = options.limit  || Infinity;
        if (options.filter) {
          var fs    = options.filter.status !== "*" ? new RegExp(options.filter.status, "i") : false,
              fq    = options.filter.query  !== "*" ? new RegExp(options.filter.query,"i")  : false,
              fd    = options.filter.date || null;
        }
        if (options.progress)
          Progress.show();
      } // if options

      if (!HITStorage.db) { Utils.errorHandler(new TypeError('Database is not defined')); return; }
      var sr = new DBResult(), matches = 0, total = 0;
      return new Promise( function(resolve) {
        var dbo = HITStorage.db.transaction(store, "readonly").objectStore(store), dbq = null;
        if (index) 
          dbq = dbo.index(index).openCursor(range, dir);
        else
          dbq = dbo.openCursor(range, dir);
        dbq.onsuccess = function() {
          var c = this.result;
          if (c && matches < limit) { 
            try { Status.message = "Retrieving data... [ " + matches + " / " + (++total) + " ]"; } catch(e) {}
            if ( fd && (c.value.date < (fd[0] || "0000") || c.value.date > (fd[1] || "9999")) ) {
              c.continue();
              return;
            }
            if ( (!fs && !fq) ||                              // no query filter and no status filter OR
                 (fs && !fq && ~c.value.status.search(fs)) || // status match and no query filter OR
                 (!fs && fq &&                                // query match and no status filter OR
                   (~c.value.title.search(fq) || ~c.value.requesterName.search(fq) || ~c.value.hitId.search(fq)))  ||
                 (fs && fq && ~c.value.status.search(fs) &&   // status match and query match
                   (~c.value.title.search(fq) || ~c.value.requesterName.search(fq) || ~c.value.hitId.search(fq))) ) {
              sr.include(c.value);
              try { Status.message = "Retrieving data... [ " + (++matches) + " / " + total + " ]"; } catch(e) {}
            }
            c.continue();
          } else {
            try { Status.message = "Done."; } catch(e) {}
            resolve(sr);
          }
        }; // IDBCursor
      }); // promise
    },//}}} HITStorage::recall

    backup: function() {//{{{
      var bData = {},
          os    = ["STATS", "NOTES", "HIT"],
          count = 0;

      Progress.show();
      Status.push("Preparing backup...", "black");

      for (var store of os) 
        HITStorage.db.transaction(os, "readonly").objectStore(store).openCursor().onsuccess = populateBackup;

      function populateBackup(e) {
        var cursor = e.target.result;
        if (cursor) {
          if (!bData[cursor.source.name]) bData[cursor.source.name] = [];
          bData[cursor.source.name].push(cursor.value);
          cursor.continue();
        } else 
          if (++count === 3)
            finalizeBackup();
      }
      function finalizeBackup() {
        var backupblob = new Blob([JSON.stringify(bData)], {type:"application/json"});
        var date = new Date();
        var dl = document.createElement("A");
        date = date.getFullYear() + Number(date.getMonth()+1).toPadded() + Number(date.getDate()).toPadded();
        dl.href = URL.createObjectURL(backupblob);
        console.log(dl.href);
        dl.download = "hitdb_"+date+".bak";
        document.body.appendChild(dl); // FF doesn't support forced events unless element is part of the document
        dl.click();                    // so we make it so and click,
        dl.remove();                   // then immediately remove it
        Progress.hide();
        Status.push("Done!", "green");
      }

    }//}}} backup

  }, //}}} HITStorage

  Utils = { //{{{
    ftime : function(t) {//{{{
      if (String(t).length && +t === 0) return "0s";
      if (!t) return "n/a";
      var d = Math.floor(t/86400),
          h = Math.floor(t%86400/3600),
          m = Math.floor(t%86400%3600/60),
          s = t%86400%3600%60;
      return ((d>0) ? d+" day"+(d>1 ? "s " : " ") : "") + ((h>0) ? h+"h " : "") + ((m>0) ? m+"m " : "") + ((s>0) ? s+"s" : "");
    },//}}}ftime

    ISODate: function(date) { //{{{ MMDDYYYY <-> YYYY-MM-DD
      if (date.length === 10)
        return date.substr(5,2)+date.substr(-2)+date.substr(0,4);
      else
        return date.substr(4)+"-"+date.substr(0,2)+"-"+date.substr(2,2);
    },//}}} ISODate

    getPosition: function(element, includeHeight) {//{{{
      var offsets = { x: 0, y: includeHeight ? element.offsetHeight : 0 };
      do {
        offsets.x += element.offsetLeft;
        offsets.y += element.offsetTop;
        element = element.offsetParent;
      } while (element);
      return offsets;
    },//}}} getPosition

    errorHandler: function(err) {//{{{
      try { Status.push(err.name + ": " + err.message, "red"); }
      catch(e) {}
      finally { console.error(err); }
    }//}}}

  }, //}}} Utils

  ProjectedEarnings = {//{{{
    data: JSON.parse(localStorage.getItem("hitdb_projectedEarnings") || "{}"),
    updateDate: function() {//{{{
      var tableList = document.querySelectorAll(".metrics-table"), el, date;
      try {
        el   = tableList[5].rows[1].cells[0].children[0];
        date = el.href.match(/\d{8}/)[0];
      } catch(e1) {
        try {
          el   = tableList[3].rows[1].cells[0].children[0];
          date = el.href.match(/\d{8}/)[0];
        } catch(e2) {
          for (var tbl of tableList) {
            if (tbl.rows.length < 2 || tbl.rows[1].cells.length < 6) continue;
            el   = tbl.rows[1].cells[0].children[0];
            date = el.href.match(/\d{8}/)[0];
          } //for
        }//catch
      }//catch
      var day       = el.textContent,
          isToday   = day === "Today",
          _date     = new Date(),
          pad       = function(num) { return Number(num).toPadded(); },
          weekEnd   = null,
          weekStart = null;

      _date.setDate(_date.getDate() - _date.getDay()); // sunday
      weekStart = Date.parse(_date.getFullYear() + "-" + pad(_date.getMonth()+1) + "-" + pad(_date.getDate()));
      _date.setDate(_date.getDate() + 7); // next sunday
      weekEnd   = Date.parse(_date.getFullYear() + "-" + pad(_date.getMonth()+1) + "-" + pad(_date.getDate()));

      if (!Object.keys(this.data).length) {
        this.data = {
          today: date, weekStart: weekStart, weekEnd: weekEnd, day: new Date().getDay(), dbUpdated: "n/a",
          pending: 0, earnings: {}, target: { day: 0, week: 0 }
        };
      }

      if ( (Date.parse(Utils.ISODate(date)) >= this.data.weekEnd) ||
          (!isToday && new Date().getDay() < this.data.day) ) { // new week
        this.data.earnings = {};
        this.data.weekEnd = weekEnd;
        this.data.weekStart = weekStart;
      }
      if ( (this.data.today === null && isToday) || (this.data.today !== null && (date !== this.data.today || !isToday)) ) { // new day
        this.data.today = date === this.data.today ? null : date;
        this.data.day = new Date().getDay();
      }

      this.saveState();
    },//}}} updateDate
    
    draw: function(init) {//{{{
      var parentTable = document.querySelector("#total_earnings_amount").offsetParent,
          rowPending  = init ? parentTable.insertRow(-1) : parentTable.rows[4],
          rowProjectedDay = init ? parentTable.insertRow(-1) : parentTable.rows[5],
          rowProjectedWeek = init ? parentTable.insertRow(-1) : parentTable.rows[6],
          title = "Click to set/change the target value",
          weekTotal = this.getWeekTotal(),
          dayTotal = this.data.earnings[this.data.today] || 0;

      if (init) {
        rowPending.insertCell(-1);rowPending.insertCell(-1);rowPending.className = "even";
        rowProjectedDay.insertCell(-1);rowProjectedDay.insertCell(-1);rowProjectedDay.className = "odd";
        rowProjectedWeek.insertCell(-1);rowProjectedWeek.insertCell(-1);rowProjectedWeek.className = "even";
        for (var i=0;i<rowPending.cells.length;i++) rowPending.cells[i].style.borderTop = "dotted 1px black";
        rowPending.cells[0].className = "metrics-table-first-value";
        rowProjectedDay.cells[0].className = "metrics-table-first-value";
        rowProjectedWeek.cells[0].className = "metrics-table-first-value";
        rowPending.cells[1].title = "If it isn't pending, it's here.";
      }

      rowPending.cells[0].innerHTML = 'Pending earnings '+
        '<span style="font-family:arial;font-size:10px;" title="Timestamp of last database update">[ ' + this.data.dbUpdated + ' ]</span>';
      rowPending.cells[1].textContent = "$"+Number(this.data.pending).toFixed(2);
      rowProjectedDay.cells[0].innerHTML = 'Projected earnings for the day<br>'+
        '<meter id="projectedDayProgress" style="width:220px;" title="'+title+
          '" value="'+dayTotal+'" max="'+this.data.target.day+'"></meter>'+
        '<span style="color:blue;font-family:arial;font-size:10px;"> ' + Number(dayTotal-this.data.target.day).toFixed(2) + '</span>';
      rowProjectedDay.cells[1].textContent = "$"+Number(dayTotal).toFixed(2);
      rowProjectedWeek.cells[0].innerHTML = 'Projected earnings for the week<br>' +
        '<meter id="projectedWeekProgress" style="width:220px;" title="'+title+
          '" value="'+weekTotal+'" max="'+this.data.target.week+'"></meter>' +
        '<span style="color:blue;font-family:arial;font-size:10px;"> ' + Number(weekTotal-this.data.target.week).toFixed(2) + '</span>';
      rowProjectedWeek.cells[1].textContent = "$"+Number(weekTotal).toFixed(2);

      document.querySelector("#projectedDayProgress").onclick = updateTargets.bind(this, "day");
      document.querySelector("#projectedWeekProgress").onclick = updateTargets.bind(this, "week");

      function updateTargets(span, e) {
        /*jshint validthis:true*/
        var goal = prompt("Set your " + (span === "day" ? "daily" : "weekly") + " target:",
            this.data.target[span === "day" ? "day" : "week"]);
        if (goal && !isNaN(goal)) {
          this.data.target[span === "day" ? "day" : "week"] = goal;
          e.target.max = goal;
          e.target.nextSibling.textContent = " "+Number((span === "day" ? dayTotal : weekTotal) - goal).toFixed(2);
          this.saveState();
        }
      }
    },//}}} draw

    getWeekTotal: function() {
      var totals = 0;
      for (var k of Object.keys(this.data.earnings))
        totals += this.data.earnings[k];

      return Math.decRound(totals, 2);
    },
    
    saveState: function() {
      localStorage.setItem("hitdb_projectedEarnings", JSON.stringify(this.data));
    },

    clear: function() {
      this.data.pending = 0;
      for (var day of Object.keys(this.data.earnings))
        if (day in qc.fetchData || day === this.data.today) this.data.earnings[day] = 0;
    },

    updateValues: function(obj) {
      var vDate = Date.parse(obj.date), iDate = Utils.ISODate(obj.date);

      if (~obj.status.search(/pending approval/i)) // sum pending earnings (include approved until fully cleared as paid)
        this.data.pending = Math.decRound(obj.reward+this.data.pending, 2);
      if (vDate < this.data.weekEnd && vDate >= this.data.weekStart && !~obj.status.search(/rejected/i)){ // sum weekly earnings by day
        this.data.earnings[iDate] = Math.decRound(obj.reward+(this.data.earnings[iDate] || 0), 2 );
      }
    }
  },//}}} ProjectedEarnings

  DBResult = function(resArr, colObj) {//{{{
    this.results = resArr || [];
    this.collation = colObj || null;
    this.formatHTML = function(type, simple) {//{{{
      simple = simple || false;
      var count = 0, htmlTxt = [], entry = null, _trClass = null;

      if (this.results.length < 1) return "<h2>No entries found matching your query.</h2>";

      if (type === "daily") {
        htmlTxt.push('<thead><tr class="hdbHeaderRow"><th></th>'+
            '<th>Date</th><th>Submitted</th><th>Approved</th><th>Rejected</th><th>Pending</th><th>Earnings</th></tr></thead><tbody>');
        var r = this.collate(this.results,"stats");
        for (entry of this.results) {
          _trClass = (count++ % 2 === 0) ? 'class="even"' : 'class="odd"';
          
          htmlTxt.push('<tr '+_trClass+' style="text-align:right">' +
              '<td><span class="hdbExpandRow">[+]</span></td>'+
              '<td style="text-align:center;">' + entry.date + '</td><td>' + entry.submitted + '</td>' +
              '<td>' + entry.approved + '</td><td>' + entry.rejected + '</td><td>' + entry.pending + '</td>' +
              '<td>' + Number(entry.earnings).toFixed(2) + '</td></tr>');
        }
        htmlTxt.push('</tbody><tfoot><tr class="hdbTotalsRow" style="text-align:right;"><td>Totals:</td>' +
            '<td>' + r.totalEntries + ' days</td><td>' + r.totalSub + '</td>' +
            '<td>' + r.totalApp + '</td><td>' + r.totalRej + '</td>' +
            '<td>' + r.totalPen + '</td><td>$' + 
            Number(Math.decRound(r.totalPay,2)).toFixed(2) + '</td></tr></tfoot>');
      } else if (type === "pending" || type === "requester") {
        htmlTxt.push('<thead><tr data-sort="99999" class="hdbHeaderRow"><th>Requester ID</th>' +
            '<th width="500">Requester</th><th>' + (type === "pending" ? 'Pending' : 'HITs') + '</th><th>Rewards</th></tr></thead><tbody>');
        r = this.collate(this.results,"requesterId");
        for (var k in r) {
          if (!~k.search(/total/) && r.hasOwnProperty(k)) {
            var tr = ['<tr data-sort="'+Math.decRound(r[k].pay,2)+'"><td>' +
                '<span class="hdbExpandRow" title="Display all pending HITs from this requester">' +
                '[+]</span> ' + r[k][0].requesterId + '</td><td>' + r[k][0].requesterName + '</td>' +
                '<td style="text-align:center;">' + r[k].length + '</td><td>' + Number(Math.decRound(r[k].pay,2)).toFixed(2) + '</td></tr>'];

            for (var hit of r[k]) {  // hits in range per requester id
              tr.push('<tr data-rid="'+r[k][0].requesterId+'" style="color:#c60000;display:none;"><td style="text-align:right">' + 
                  hit.date + '</td><td width="500" colspan="2">[ <span class="helpSpan" title="Auto-approval time">AA: '+
                  Utils.ftime(hit.autoAppTime).trim()+'</span> ] '+ 
                  hit.title + '</td><td style="text-align:right">' + _parseRewards(hit.reward,"pay") + '</td></tr>');
            }
            htmlTxt.push(tr.join(''));
          }
        }
        htmlTxt.sort(function(a,b) { return +b.substr(15,5).match(/\d+\.?\d*/) - +a.substr(15,5).match(/\d+\.?\d*/); });
        htmlTxt.push('</tbody><tfoot><tr class="hdbTotalsRow"><td style="text-align:right;">Totals:</td>' +
            '<td style="text-align:center;">' + (Object.keys(r).length-7) + ' Requesters</td>' +
            '<td style="text-align:right;">' + r.totalEntries + '</td>'+
            '<td style="text-align:right;">$' + Number(Math.decRound(r.totalPay,2)).toFixed(2) + '</td></tr></tfoot>');
      } else { // default
        if (!simple)
          htmlTxt.push('<thead><tr class="hdbHeaderRow"><th colspan="3"></th>' +
            '<th colspan="2" title="Bonuses must be added in manually.\n\nClick inside' +
            'the cell to edit, click out of the cell to save">Reward</th><th colspan="3"></th></tr>'+
            '<tr class="hdbHeaderRow">' +
            '<th>Date</th><th>Requester</th><th>HIT title</th><th style="font-size:10px;">Pay</th>'+
            '<th style="font-size:10px;"><span class="helpSpan" title="Click the cell to edit.\nIts value is automatically saved">'+
            'Bonus</span></th><th>Status</th><th>'+
            '<span class="helpSpan" title="Auto-approval times">AA</span></th><th>Feedback</th></tr></thead><tbody>');

        for (entry of this.results) {
          _trClass = (count++ % 2 === 0) ? 'class="even"' : 'class="odd"';
          var _stColor = ~entry.status.search(/(paid|approved)/i) ? "green"  :
                         entry.status === "Pending Approval"      ? "orange" : "red";
          var href = MTURK_BASE+'contact?requesterId='+entry.requesterId+'&requesterName='+entry.requesterName+
            '&subject=Regarding+Amazon+Mechanical+Turk+HIT+'+entry.hitId;

          if (!simple)
            htmlTxt.push('<tr '+_trClass+' data-id="'+entry.hitId+'">'+
              '<td width="74px">' + entry.date + '</td><td style="max-width:145px;">' +
              '<a target="_blank" title="Contact this requester" href="'+href+'">' + entry.requesterName + '</a></td>' + 
              '<td width="375px" title="HIT ID:   '+entry.hitId+'">' + 
              '<span title="Add a note" id="note-'+entry.hitId+'" style="cursor:pointer;">&nbsp;&#128221;&nbsp;</span>' + 
              entry.title + '</td><td style="text-align:right">' + _parseRewards(entry.reward,"pay") + '</td>' +
              '<td style="text-align:right" class="bonusCell" title="Click to add/edit" contenteditable="true" data-hitid="'+entry.hitId+'">' + 
              (+_parseRewards(entry.reward,"bonus") ? _parseRewards(entry.reward,"bonus") : "") + 
              '</td><td style="color:'+_stColor+';text-align:center">' + entry.status + '</td>' +
              '<td>' + Utils.ftime(entry.autoAppTime) + '</td><td>' + entry.feedback + '</td></tr>');
          else
            htmlTxt.push('<tr>' + '<td>'+entry.requesterName+'</td>' + 
              '<td>'+entry.title+'</td><td>'+ _parseRewards(entry.reward,"pay") + '</td><td>'+ entry.status+'</td></tr>');
        }

        if (!simple) {
          r = this.collation || this.collate(this.results,"requesterId");
          htmlTxt.push('</tbody><tfoot><tr class="hdbTotalsRow"><td></td>' +
              '<td style="text-align:right">Totals:</td><td style="text-align:center;">' + r.totalEntries + ' HITs</td>' +
              '<td style="text-align:right">$' + Number(Math.decRound(r.totalPay,2)).toFixed(2) + '</td>' +
              '<td style="text-align:right">$' + Number(Math.decRound(r.totalBonus,2)).toFixed(2) + '</td>' +
              '<td colspan="3"></td></tr></tfoot>');
        }
      }
      return htmlTxt.join('');
    };//}}} formatHTML
    this.formatCSV = function(type) {//{{{
      var csvTxt = [], entry = null, delimiter="\t";
      if (type === "daily") {
        csvTxt.push( ["Date", "Submitted", "Approved", "Rejected", "Pending", "Earnings\n"].join(delimiter) );
        for (entry of this.results) {
          csvTxt.push( [entry.date, entry.submitted, entry.approved, entry.rejected, 
              entry.pending, Number(entry.earnings).toFixed(2)+"\n"].join(delimiter) );
        }
        csvToFile(csvTxt, "hitdb_dailyOverview.csv");
      } else if (type === "pending" || type === "requester") {
        csvTxt.push( ["RequesterId","Requester", (type === "pending" ? "Pending" : "HITs"), "Rewards\n"].join(delimiter) );
        var r = this.collation || this.collate(this.results,"requesterId");
        for (var k in r) {
          if (!~k.search(/total/) && r.hasOwnProperty(k))
            csvTxt.push( [k, r[k][0].requesterName, r[k].length, Number(Math.decRound(r[k].pay,2)).toFixed(2)+"\n"].join(delimiter) );
        }
        csvToFile(csvTxt, "hitdb_"+type+"Overview.csv");
      } else {
        csvTxt.push(["hitId","date","requesterName","requesterId","title","pay","bonus","status","autoAppTime","feedback\n"].join(delimiter));
        for (entry of this.results) {
          csvTxt.push([entry.hitId, entry.date, entry.requesterName, entry.requesterId, entry.title, 
              Number(_parseRewards(entry.reward,"pay")).toFixed(2),
              (+_parseRewards(entry.reward,"bonus") ? Number(_parseRewards(entry.reward,"bonus")).toFixed(2) : ""),
              entry.status, entry.autoAppTime, entry.feedback+"\n"].join(delimiter));
        }
        csvToFile(csvTxt, "hitdb_queryResults.csv");
      }

      return "<pre>"+csvTxt.join('')+"</pre>";

      function csvToFile(csv, filename) {
        var blob = new Blob(csv, {type: "text/csv", endings: "native"}),
            dl   = document.createElement("A");
        dl.href = URL.createObjectURL(blob);
        dl.download = filename;
        document.body.appendChild(dl); // FF doesn't support forced events unless element is part of the document
        dl.click();                    // so we make it so and click,
        dl.remove();                   // then immediately remove it
        return dl;
      }
    };//}}} formatCSV
    this.include = function(value) {
      this.results.push(value);
    };
    this.collate = function(data, index) {//{{{
      var r = { 
        totalPay: 0, totalBonus: 0, totalEntries: data.length,
        totalSub: 0, totalApp: 0, totalRej: 0, totalPen: 0
      };
      for (var e of data) {
        if (!r[e[index]]) { 
          r[e[index]] = [];
          Object.defineProperty(r[e[index]], "pay", {value: 0, enumerable: false, configurable: true, writable: true});
        }
        r[e[index]].push(e);

        if (index === "stats") {
          r.totalSub += e.submitted;
          r.totalApp += e.approved;
          r.totalRej += e.rejected;
          r.totalPen += e.pending;
          r.totalPay += e.earnings;
        } else {
          r[e[index]].pay += (+_parseRewards(e.reward,"pay"));
          r.totalPay += (+_parseRewards(e.reward,"pay"));
          r.totalBonus += (+_parseRewards(e.reward,"bonus"));
        }
      }
      return r;
    };//}}} _collate

    function _parseRewards(rewards,value) {//{{{
      if (!isNaN(rewards)) {
        if (value === "pay")
          return Number(rewards).toFixed(2);
        else
          return "0.00";
      } else {
        if (value === "pay")
          return Number(rewards.pay).toFixed(2);
        else
          return Number(rewards.bonus).toFixed(2);
      }
    } //}}} _parse
  },//}}} databaseresult

  DashboardUI = {//{{{
    draw: function() {//{{{
      var controlPanel = document.createElement("TABLE");
      var insertionNode = document.querySelector(".footer_separator").previousSibling;
      document.body.insertBefore(controlPanel, insertionNode);
      controlPanel.width = "760";
      controlPanel.align = "center";
      controlPanel.id = "hdbControlPanel";
      controlPanel.cellSpacing = "0";
      controlPanel.cellPadding = "0";
      controlPanel.innerHTML = '<tr height="25px"><td width="10" bgcolor="#7FB448" style="padding-left: 10px;"></td>' +
        '<td class="white_text_14_bold" style="padding-left:10px; background-color:#7FB448;">' +
          'HIT Database Mk. II&nbsp;<a href="https://greasyfork.org/en/scripts/11733-mturk-hit-database-mk-ii" class="whatis" target="_blank">' +
          '(What\'s this?)</a></td></tr>' +
        '<tr><td class="container-content" colspan="2">' +
        '<div style="text-align:center;" id="hdbDashboardInterface">' +
        '<button id="hdbBackup" title="Export your entire database!\nPerfect for moving between computers or as a periodic backup">Create Backup</button>' +
        '<button id="hdbRestore" title="Restore database from external backup file" style="margin:5px">Restore</button>' +
        '<button id="hdbUpdate" title="Update... the database" style="color:green;">Update Database</button>' +
        '<div id="hdbFileSelector" style="display:none"><input id="hdbFileInput" type="file" /></div>' +
        '<br>' +
        '<button id="hdbPending" title="Summary of all pending HITs\n Can be exported as CSV" style="margin: 0px 5px 5px;">Pending Overview</button>' +
        '<button id="hdbRequester" title="Summary of all requesters\n Can be exported as CSV" style="margin: 0px 5px 5px;">Requester Overview</button>' +
        '<button id="hdbDaily" title="Summary of each day you\'ve worked\nCan be exported as CSV" style="margin:0px 5px 5px;">Daily Overview</button>' +
        '<br>' +
        '<label>Find </label>' +
        '<select id="hdbStatusSelect"><option value="*">ALL</option>' +
        '<option value="Pending Approval" style="color: orange;">Pending Approval</option>' +
        '<option value="Rejected" style="color: red;">Rejected</option>' +
        '<option value="Approved - Pending Payment" style="color:green;">Approved - Pending Payment</option>' +
        '<option value="(Paid|Approved)" style="color:green;">Paid OR Approved</option></select>' +
        '<label> HITs matching: </label><input id="hdbSearchInput" title="Query can be HIT title, HIT ID, or requester name" />' +
        '<button id="hdbSearch">Search</button>' +
        '<br>' +
        '<label>from date </label><input id="hdbMinDate" maxlength="10" size="10" title="Specify a date, or leave blank">' +
        '<label> to </label><input id="hdbMaxDate" malength="10" size="10" title="Specify a date, or leave blank">' +
        '<label for="hdbCSVInput" title="Export results as CSV file" style="margin-left:50px; vertical-align:middle;">export CSV</label>' +
        '<input id="hdbCSVInput" title="Export results as CSV file" type="checkbox" style="vertical-align:middle;">' +
        '<br>' +
        '<label id="hdbStatusText"></label>' +
        '<div id="hdbProgressBar" class="hdbProgressContainer"><div class="hdbProgressOuter"><div class="hdbProgressInner"></div></div></div>' +
        '</div></td></tr>';

      var searchResults = document.createElement("DIV");
      searchResults.align = "center";
      searchResults.id = "hdbSearchResults";
      searchResults.style.display = "block";
      searchResults.innerHTML = 
        '<span class="hdbResControl" id="hdbResClear">[ clear results ]</span>' +
        '<span class="hdbTablePagination" id="hdbPageTop"></span><br>' +
        '<table cellSpacing="0" cellpadding="2" id="hdbResultsTable"></table>' +
        '<span class="hdbResControl" id="hdbVpTop">Back to top</span>' +
        '<span class="hdbTablePagination" id="hdbPageBot"></span><br>';
      document.body.insertBefore(searchResults, insertionNode);
    },//}}} dashboardUI::draw

    initClickables: function() {//{{{
      var updateBtn      = document.getElementById("hdbUpdate"),
          backupBtn      = document.getElementById("hdbBackup"),
          restoreBtn     = document.getElementById("hdbRestore"),
          fileInput      = document.getElementById("hdbFileInput"),
          exportCSVInput = document.getElementById("hdbCSVInput"),
          searchBtn      = document.getElementById("hdbSearch"),
          searchInput    = document.getElementById("hdbSearchInput"),
          pendingBtn     = document.getElementById("hdbPending"),
          reqBtn         = document.getElementById("hdbRequester"),
          dailyBtn       = document.getElementById("hdbDaily"),
          fromdate       = document.getElementById("hdbMinDate"),
          todate         = document.getElementById("hdbMaxDate"),
          statusSelect   = document.getElementById("hdbStatusSelect"),
          searchResults  = document.getElementById("hdbSearchResults"),
          resultsTable   = document.getElementById("hdbResultsTable");

      searchResults.firstChild.onclick = function() { //{{{ clear results
        resultsTable.innerHTML = null;
        for (var d of ["hdbResClear","hdbPageTop","hdbVpTop", "hdbPageBot"]) {
          if (~d.search(/page/i)) d.innerHTML = "";
          document.getElementById(d).style.display = "none";
        }
      };//}}}
      document.getElementById("hdbVpTop").onclick = function() { autoScroll("#hdbControlPanel"); };

      updateBtn.onclick = function() { //{{{
        Progress.show();
        metrics.dbupdate = new Metrics("database_update");
        HITStorage.fetch(MTURK_BASE+"status");
        Status.message = "fetching status page....";
      };//}}}
      exportCSVInput.addEventListener("click", function() {//{{{
        var a = document.getElementById('hdbAnalytics');
        if (a && a.checked) a.click();
        if (exportCSVInput.checked) {
          searchBtn.textContent = "Export CSV";
          pendingBtn.textContent += " (csv)";
          reqBtn.textContent += " (csv)";
          dailyBtn.textContent += " (csv)";
        }
        else {
          searchBtn.textContent = "Search";
          pendingBtn.textContent = pendingBtn.textContent.replace(" (csv)","");
          reqBtn.textContent = reqBtn.textContent.replace(" (csv)","");
          dailyBtn.textContent = dailyBtn.textContent.replace(" (csv)", "");
        }
      });//}}}
      fromdate.addEventListener("focus", function() {//{{{ dates
        var offsets = Utils.getPosition(this, true);
        new Calendar(offsets.x, offsets.y, this).drawCalendar();
      });
      todate.addEventListener("focus", function() {
        var offsets = Utils.getPosition(this, true);
        new Calendar(offsets.x, offsets.y, this).drawCalendar();
      });//}}} dates

      backupBtn.onclick = HITStorage.backup;
      restoreBtn.onclick = function() { fileInput.click(); };
      fileInput.onchange = processFile;

      searchBtn.addEventListener('click', function(e) {//{{{
        if (!/^[se]/i.test(e.target.textContent)) return;
        qc.sr = []; // clear prev pagination
        var r = this.getRange();
        var _filter = { status: statusSelect.value, query: searchInput.value.trim().length > 0 ? searchInput.value : "*" };
        var _opt = { index: r.index, range: r.range, dir: r.dir, filter: _filter, progress: true };

        _dbaccess("search", ["HIT", _opt], function(r) {
          var limiter = 500;
          if (exportCSVInput.checked) 
            resultsTable.innerHTML = r.formatCSV();
          else if (r.results.length > limiter) {
            var collation = r.collate(r.results, "requesterId");
            do { qc.sr.push(new DBResult(r.results.splice(0,limiter), collation)) } while (r.results.length);
            resultConstrain(qc.sr, 0);
          } else
            resultConstrain(r);
        });
      }.bind(this)); //}}} search button click event
      //{{{ overview buttons
      pendingBtn.onclick = function() {
        var _filter = { date: [fromdate.value, todate.value], query: searchInput.value.trim().length > 0 ? searchInput.value : "*" },
            _opt    = { index: "status", dir: "prev", range: window.IDBKeyRange.only("Pending Approval"), filter: _filter, progress: true };

        _dbaccess("pending", ["HIT", _opt], function(r) {
          resultsTable.innerHTML = exportCSVInput.checked ? r.formatCSV("pending") : r.formatHTML("pending");
          var expands = document.querySelectorAll(".hdbExpandRow");
          for (var el of expands)
            el.onclick = showHiddenRows;
        });
      }.bind(this); //pending overview click event
      reqBtn.onclick = function() {
        var r = this.getRange();
        var _opt = { index: r.index, range: r.range, progress: true };

        _dbaccess("requester", ["HIT", _opt], function(r) {
          resultsTable.innerHTML = exportCSVInput.checked ? r.formatCSV("requester") : r.formatHTML("requester");
          var expands = document.querySelectorAll(".hdbExpandRow");
          for (var el of expands) 
            el.onclick = showHiddenRows;
        });
      }.bind(this); //requester overview click event
      dailyBtn.onclick = function() {
        var r = this.getRange("*");
        _dbaccess("daily", ["STATS", { range: r.range, dir: "prev", progress: true }], function(r) {
          resultsTable.innerHTML = exportCSVInput.checked ? r.formatCSV("daily") : r.formatHTML("daily");
          var expands = document.querySelectorAll(".hdbExpandRow");
          for (var el of expands)
            el.onclick = showHitsByDate;
        });
      }.bind(this); //daily overview click event
      //}}}

      function _dbaccess(method, rargs, tfn) {//{{{
        Status.push("Preparing database...", "black");
        metrics.dbrecall = new Metrics("database_recall::"+method);
        metrics.dbrecall.mark("data retrieval", "start");

        HITStorage.recall(rargs[0],rargs[1]).then(function(r) {
          metrics.dbrecall.mark("data retrieval", "end");
          Status.message = "Building HTML...";
          try {
            for (var d of ["hdbResClear","hdbPageTop","hdbVpTop", "hdbPageBot"]) {
              if (~d.search(/page/i) && method !== "search") continue;
              document.getElementById(d).style.display = "initial";
            }
            metrics.dbrecall.mark("HTML construction", "start");
            tfn(r); 
            metrics.dbrecall.mark("HTML construction", "end");
          } catch(e) { 
            Utils.errorHandler(e);
          } finally {
            autoScroll("#hdbSearchResults");
            Status.push("Done!", "green");
            Progress.hide();
            metrics.dbrecall.stop(); metrics.dbrecall.report();
          }
        });
      }//}}} _dbaccess
    },//}}} dashboardUI::initClickables

    getRange: function(status) {//{{{
      var fromdate     = document.getElementById("hdbMinDate"),
          todate       = document.getElementById("hdbMaxDate"),
          statusSelect = document.getElementById("hdbStatusSelect");
      var _min = fromdate.value.length > 3 ? fromdate.value : undefined,
          _max = todate.value.length   > 3 ? todate.value   : undefined;
          status = status || statusSelect.value;
      var _range = 
        (_min === undefined && _max === undefined) ? 
          (status.length > 1 && !~status.search(/\(/) ? window.IDBKeyRange.only(status) : null) :
        (_min === undefined)                       ? window.IDBKeyRange.upperBound(_max) :
        (_max === undefined)                       ? window.IDBKeyRange.lowerBound(_min) :
        (_max < _min)                              ? window.IDBKeyRange.bound(_max,_min) : window.IDBKeyRange.bound(_min,_max),
          _index = _min === undefined && _max === undefined && status.length > 1 && !~status.search(/\(/) ? "status" : "date";
      return { min: _min, max: _max, range: _range, dir: _max < _min ? "prev" : "next", index: _index };
    }//}}} dashboardUI::getRange
  };//}}} dashboard

  /* 
   *
   *
   *
   *
   *///{{{
  // the Set() constructor is never actually used other than to test for Chrome v38+
  // might want to bump requirement up to v45 for those sweet, sweet arrow functions...
  if (!("indexedDB" in window && "Set" in window)) alert("HITDB::Your browser is too outdated or otherwise incompatible with this script!");
  else {
  /* 
    var tdbh = window.indexedDB.open(DB_NAME);
    tdbh.onerror = function(e) { console.log("[TESTDB]",e.target.error.name+":", e.target.error.message, e); };
    tdbh.onsuccess = INFLATEDUMMYVALUES;
    //tdbh.onupgradeneeded = BLANKSLATE;
    var dbh = null;
  */
    
    if (document.location.pathname === "/mturk/dashboard") {
      var dbh = window.indexedDB.open(DB_NAME, DB_VERSION);
      dbh.onerror = function(e) { Utils.errorHandler(e.target.error); };
      dbh.onupgradeneeded = HITStorage.versionChange;
      dbh.onsuccess = function() { HITStorage.db = this.result; };

      DashboardUI.draw();
      DashboardUI.initClickables();

      ProjectedEarnings.updateDate();
      ProjectedEarnings.draw(true);

      var Status = {
        node: document.getElementById("hdbStatusText"),
        get message() { return this.node.textContent; },
        set message(str) { this.node.textContent = str; },
        get color() { return this.node.style.color; },
        set color(c) { this.node.style.color = c; },
        push: function(m,c) { c = c || "black"; this.message = m; this.color = c; }
      };
      var Progress = {
        node: document.getElementById("hdbProgressBar"),
        hide: function() { this.node.style.display = "none"; },
        show: function() { this.node.style.display = "block"; }
      };
      // export some variables for external extensions
      window.Status = Status; window.Progress = Progress, window.Metrics = Metrics;
    } else { // page is not dashboard
      window.indexedDB.open(DB_NAME).onsuccess = function() { HITStorage.db = this.result; beenThereDoneThat(); }
    }
  }
  /*}}}
   *
   *
   *
   *
   */

  // {{{ css injection
  var css = "<style type='text/css'>" +
  ".hitdbRTButtons {border:1px solid; font-size: 10px; height: 18px; padding-left: 5px; padding-right: 5px; background: pink;}" +
  ".hitdbRTButtons-green {background: lightgreen;}" +
  ".hitdbRTButtons-large {width:80px;}" +
  ".hdbProgressContainer {margin:auto; width:500px; height:6px; position:relative; display:none; border-radius:10px; overflow:hidden; background:#d3d8db;}" +
  ".hdbProgressInner {width:100%; position:absolute; left:0;top:0;bottom:0; animation: kfpin 1.4s infinite; background:" +
    "linear-gradient(262deg, rgba(208,69,247,0), rgba(208,69,247,1), rgba(69,197,247,1), rgba(69,197,247,0)); background-size: 300% 500%;}" +
  ".hdbProgressOuter {width:30%; position:absolute; left:0;top:0;bottom:0; animation: kfpout 2s cubic-bezier(0,0.55,0.2,1) infinite;}" +
  "@keyframes kfpout { 0% {left:-100%;} 70%{left:100%;} 100%{left:100%;} }" +
  "@keyframes kfpin { 0%{background-position: 0% 50%} 50%{background-position: 100% 15%} 100%{background-position:0% 30%} }" +
  ".hdbCalControls {cursor:pointer;} .hdbCalControls:hover {color:c27fcf;}" +
  ".hdbCalCells {background:#f0f6f9; height:19px}" +
  ".hdbCalDays {cursor:pointer; text-align:center;} .hdbCalDays:hover {background:#7fb4cf; color:white;}" +
  ".hdbDayHeader {width:26px; text-align:center; font-weight:bold; font-size:12px; background:#f0f6f9;}" +
  ".hdbCalHeader {background:#7fb4cf; color:white; font-weight:bold; text-align:center; font-size:11px; padding:3px 0px;}" +
  "#hdbCalendarPanel {position:absolute; z-index:10; box-shadow:-2px 3px 5px 0px rgba(0,0,0,0.68);}" +
  ".hdbExpandRow {cursor:pointer; color:blue;}" +
  ".hdbTotalsRow {background:#CCC; color:#369; font-weight:bold;}" +
  ".hdbHeaderRow {background:#7FB448; font-size:12px; color:white}" +
  ".helpSpan {border-bottom:1px dotted; cursor:help;}" +
  ".hdbResControl {border-bottom:1px solid; color:#c60; cursor:pointer; display:none;}" +
  ".hdbTablePagination {margin-left:15em; color:#c60; display:none;}" +
  ".spin {animation: kfspin 0.7s infinite linear; font-weight:bold;}" +
  "@keyframes kfspin { 0% { transform: rotate(0deg) } 100% { transform: rotate(359deg) } }" +
  ".spin:before{content:'*'}" +
  "</style>";
  document.head.innerHTML += css;
  // }}}

  function resultConstrain(data, index) {//{{{
    data = data || qc.sr;

    var table  = document.getElementById("hdbResultsTable"),
        rslice = data.length ? data[index].results : data.results,
        pager  = [document.getElementById("hdbPageTop"), document.getElementById("hdbPageBot")],
        sopt   = [];
    pager[0].innerHTML = ''; pager[1].innerHTML = '';

    if (data instanceof DBResult)
      table.innerHTML = data.formatHTML();
    else {
      table.innerHTML = data[index].formatHTML();
      pager[0].innerHTML = '<span style="cursor:pointer;">' + (index > 0 ? '&#9664; Prev' : '') + '</span> ' +
        '<span style="cursor:pointer;">' + (+index+1 === data.length ? '' : 'Next &#9654;') + '</span> &nbsp; || &nbsp; '+
        '<label>Select page: </label><select></select>';
      for (var i=0;i<data.length;i++) {
        if (i === +index)
          sopt.push('<option value="' + i + '" selected="selected">' + (i+1) + '</option>');
        else
          sopt.push('<option value="' + i + '">' + (i+1) + '</option>');
      }
      pager[0].lastChild.innerHTML = sopt.join('');
      pager[2] = pager[0].cloneNode(true);
      pager[2].id = "hdbPageBot";
      for (i of [0,2]) {
        pager[i].children[0].onclick = resultConstrain.bind(null,null,+index-1);
        pager[i].children[1].onclick = resultConstrain.bind(null,null,+index+1);
        pager[i].children[3].onchange = _f;
      }
      pager[0].parentNode.replaceChild(pager[2], pager[1]);
    }

    for (var _r of rslice) { // retrieve and append notes
      HITStorage.recall("NOTES", { index: "hitId", range: window.IDBKeyRange.only(_r.hitId) }).then(noteHandler.bind(null,"attach"));
    }

    var _nodes   = [document.querySelectorAll(".bonusCell"), document.querySelectorAll('span[id^="note-"]')];
    for (i=0;i<_nodes[0].length;i++) {
      var bonus = _nodes[0][i],
          note  = _nodes[1][i];
      bonus.dataset.initial = bonus.textContent;
      bonus.onkeydown = updateBonus;
      bonus.onblur    = updateBonus;
      note.onclick    = noteHandler.bind(null,"new");
    }

    // to avoid defining a function within a loop
    function _f(e) { resultConstrain(null,e.target.value); }
  }//}}} resultConstrain

  function beenThereDoneThat() {//{{{
    if (~document.location.pathname.search(/(accept|continue)/)) {
      if (!document.querySelector('input[name="hitAutoAppDelayInSeconds"]')) return;

      // capture autoapproval times
      var _aa = document.querySelector('input[name="hitAutoAppDelayInSeconds"]').value,
          _hid = document.querySelectorAll('input[name="hitId"]')[1].value,
          pad = function(num) { return Number(num).toPadded(); },
          _d  = Date.parse(new Date().getFullYear() + "-" + pad(new Date().getMonth()+1) + "-" + pad(new Date().getDate()));

      if (!qc.aat[_d]) qc.aat[_d] = {};
      qc.aat[_d][_hid] = _aa;
      qc.save("aat", "hitdb_autoAppTemp", true);
      return;
    }
    var qualNode = document.querySelector('td[colspan="11"]');
    if (qualNode) { // we're on the preview page!
      var requesterid   = document.querySelector('input[name="requesterId"]').value,
          requestername = document.querySelector('input[name="prevRequester"]').value,
          autoApproval  = document.querySelector('input[name="hitAutoAppDelayInSeconds"]').value,
          hitTitle      = document.querySelector('div[style*="ellipsis"]').textContent.trim(),
          insertionNode = qualNode.parentNode.parentNode;
      var row = document.createElement("TR"), cellL = document.createElement("TD"), cellR = document.createElement("TD");
      var resultsTableR = document.createElement("TABLE"),
          resultsTableT = document.createElement("TABLE");
      resultsTableR.dataset.rid = requesterid;
      resultsTableT.dataset.title = hitTitle;
      insertionNode.parentNode.parentNode.appendChild(resultsTableR);
      insertionNode.parentNode.parentNode.appendChild(resultsTableT);

      cellR.innerHTML = '<span class="capsule_field_title">Auto-Approval:</span>&nbsp;&nbsp;'+Utils.ftime(autoApproval);
      var rbutton = document.createElement("BUTTON");
      rbutton.classList.add("hitdbRTButtons","hitdbRTButtons-large");
      rbutton.textContent = "Requester";
      rbutton.onclick = function(e) { e.preventDefault(); showResults.call(resultsTableR, "req", hitTitle); };
      var tbutton = rbutton.cloneNode(false);
      rbutton.title = "Show HITs completed from this requester";
      tbutton.textContent = "HIT Title";
      tbutton.onclick = function(e) { e.preventDefault(); showResults.call(resultsTableT, "title", requestername) };
      HITStorage.recall("HIT", {index: "requesterId", range: window.IDBKeyRange.only(requesterid), limit: 1})
        .then(processResults.bind(rbutton,resultsTableR));
      HITStorage.recall("HIT", {index: "title", range: window.IDBKeyRange.only(hitTitle), limit: 1})
        .then(processResults.bind(tbutton,resultsTableT));
      row.appendChild(cellL);
      row.appendChild(cellR);
      cellL.appendChild(rbutton);
      cellL.appendChild(tbutton);
      cellL.colSpan = "3";
      cellR.colSpan = "8";
      insertionNode.appendChild(row);
    } else { // browsing HITs n sutff 
      var titleNodes = document.querySelectorAll('a[class="capsulelink"]');
      if (titleNodes.length < 1) return; // nothing left to do here!
      var requesterNodes = document.querySelectorAll('a[href*="hitgroups&requester"]');
      var insertionNodes = [];

      for (var i=0;i<titleNodes.length;i++) {
        var _title = titleNodes[i].textContent.trim();
        var _tbutton = document.createElement("BUTTON");
        var _id = requesterNodes[i].href.replace(/.+Id=(.+)/, "$1");
        var _name = requesterNodes[i].textContent;
        var _rbutton = document.createElement("BUTTON");
        var _div = document.createElement("DIV"), _tr = document.createElement("TR");
        resultsTableR = document.createElement("TABLE");
        resultsTableR.dataset.rid = _id;
        resultsTableT = document.createElement("TABLE");
        resultsTableT.dataset.title = _title;
        insertionNodes.push(requesterNodes[i].parentNode.parentNode.parentNode);
        insertionNodes[i].offsetParent.offsetParent.offsetParent.offsetParent.appendChild(resultsTableR);
        insertionNodes[i].offsetParent.offsetParent.offsetParent.offsetParent.appendChild(resultsTableT);

        HITStorage.recall("HIT", {index: "title", range: window.IDBKeyRange.only(_title), limit: 1} )
          .then(processResults.bind(_tbutton,resultsTableT));
        HITStorage.recall("HIT", {index: "requesterId", range: window.IDBKeyRange.only(_id), limit: 1} )
          .then(processResults.bind(_rbutton,resultsTableR));

        _tr.appendChild(_div);
        _div.id = "hitdbRTInjection-"+i;
        _div.appendChild(_rbutton);
        _rbutton.textContent = 'R';
        _rbutton.classList.add("hitdbRTButtons");
        _rbutton.onclick = showResults.bind(resultsTableR, "req", _title);
        _rbutton.title = "Show HITs completed from this requester";
        _div.appendChild(_tbutton);
        _tbutton.textContent = 'T';
        _tbutton.classList.add("hitdbRTButtons");
        _tbutton.onclick = showResults.bind(resultsTableT, "title", _name);
        insertionNodes[i].appendChild(_tr);
      }
    } // else

    function showResults(type, match) {//{{{
      /*jshint validthis: true*/
      if (!this.dataset.hasResults) return;
      if (this.children.length) // table is populated
        this.innerHTML = '';
      else { // need to populate table
        var head = this.createTHead(),
            body = this.createTBody(),
            capt = this.createCaption(),
            style= "font-size:10px;font-weight:bold;text-align:center",
            validKeys = function(obj) { return Object.keys(obj).filter(function(v) { return !~v.search(/total[A-Z]/); }); };

        capt.innerHTML = '<span style="'+style+'">Loading...<label class="spin"></label></span>';

        if (type === "req") {
          HITStorage.recall("HIT", {index:"requesterId", range:window.IDBKeyRange.only(this.dataset.rid)})
            .then( function(r) {
              var cbydate = r.collate(r.results, "date"),
                  kbydate = validKeys(cbydate),
                  cbydatextitle, kbytitle, bodyHTML = [];
              kbydate.forEach(function(date) {
                cbydatextitle = r.collate(cbydate[date], "title");
                kbytitle = validKeys(cbydatextitle);
                kbytitle.forEach(function(title) {
                  bodyHTML.push('<tr style="text-align:center;"><td>'+date+'</td>' +
                      '<td style="text-align:left">'+title.trim()+'</td><td>'+cbydatextitle[title].length+'</td>' +
                      '<td>'+Number(Math.decRound(cbydatextitle[title].pay,2)).toFixed(2)+'</td></tr>');
                });
              });
              var help = "Total number of HITs submitted for a given date with the same title\n" +
                "(aggregates results with the same title to simplify the table and reduce unnecessary spam for batch workers)"; 
              head.innerHTML = '<tr style="'+style+'"><th>Date</th><th>Title</th>' +
                '<th><span class="helpSpan" title="'+help+'">#HITs</span></th><th>Total Rewards</th></tr>';
              body.innerHTML = bodyHTML.sort(function(a,b) {
                return a.match(/\d{4}-\d{2}-\d{2}/)[0] < b.match(/\d{4}-\d{2}-\d{2}/)[0] ? 1 : -1;
              }).join('');
              capt.innerHTML = '<label style="'+style+'">HITs Matching This Requester</label>';

              var mrows = Array.prototype.filter.call(body.rows, function(v) {return v.cells[1].textContent === match});
              for (var row of mrows)
                row.style.background = "lightgreen";
            });
        }
        else if (type === "title") {
          HITStorage.recall("HIT", {index:"title", range:window.IDBKeyRange.only(this.dataset.title)})
            .then( function(r) {
              var cbyreq = r.collate(r.results, "requesterName"),
                  kbyreq = validKeys(cbyreq),
                  bodyHTML = [];
              for (var key of kbyreq)
                bodyHTML.push('<tr style="text-align:center;"><td>'+key+'</td><td>'+cbyreq[key].length+'</td>' +
                    '<td>'+Number(Math.decRound(cbyreq[key].pay,2)).toFixed(2)+'</td></tr>');
              var help = "Total number of HITs matching this title submitted for a given requester\n" +
                "(aggregates results with the same requester name to simplify the table and reduce unnecessary spam for batch workers)";
              head.innerHTML = '<tr style="'+style+'"><th>Requester Name</th>' +
                '<th><span class="helpSpan" title="'+help+'">#HITs</span></th><th>Total Rewards</th></tr>';
              body.innerHTML = bodyHTML.join('');
              capt.innerHTML = '<label style="'+style+'">Reqesters With HITs Matching This Title</label>';

              var mrows = Array.prototype.filter.call(body.rows, function(v) {return v.cells[0].textContent === match});
              for (var row of mrows)
                row.style.background = "lightgreen";
            });
        } //if type === 'title'
      }//populate table
    }//}}} showResults

    function processResults(table, r) {
      /*jshint validthis: true*/
      if (r.results.length) {
        table.dataset.hasResults = "true";
        this.classList.add("hitdbRTButtons-green");
      }
    }
    
  }//}}} btdt

  function showHiddenRows(e) {//{{{
    var rid = e.target.parentNode.textContent.substr(4);
    var nodes = document.querySelectorAll('tr[data-rid="'+rid+'"]'), el = null;
    if (e.target.textContent === "[+]") {
      for (el of nodes)
        el.style.display="table-row";
      e.target.textContent = "[-]";
    } else {
      for (el of nodes)
        el.style.display="none";
      e.target.textContent = "[+]";
    }
  }//}}}

  function showHitsByDate(e) {//{{{
    var date = e.target.parentNode.nextSibling.textContent,
        row  = e.target.parentNode.parentNode,
        table= row.parentNode;

    if (e.target.textContent === "[+]") {
      e.target.textContent = "[-]";
      var nrow = table.insertBefore(document.createElement("TR"), row.nextSibling);
      nrow.className = row.className;
      nrow.innerHTML = '<td><b>Loading...<label class="spin"></label></b></td>';
      HITStorage.recall("HIT", {index: "date", range: window.IDBKeyRange.only(date)}).then( function(r) {
        r.results = r.results.sort(function(a,b) {if (a.requesterName.toLowerCase() > b.requesterName.toLowerCase()) return 1; else return -1;});
        nrow.innerHTML = '<td colspan="7"><table style="width:440;color:#c60;">' + r.formatHTML(null,true) + '</table></td>';
      });
    } else {
      e.target.textContent = "[+]";
      table.removeChild(row.nextSibling);
    }
  }//}}} showHitsByDate

  function updateBonus(e) {//{{{
    if (e instanceof window.KeyboardEvent && e.keyCode === 13) {
      e.target.blur();
      return false;
    } else if (e instanceof window.FocusEvent) {
      var _bonus = +e.target.textContent.replace(/\$/,"");
      if (_bonus !== +e.target.dataset.initial) {
        console.log("updating bonus to",_bonus,"from",e.target.dataset.initial,"("+e.target.dataset.hitid+")");
        e.target.dataset.initial = _bonus;
        var _pay   = +e.target.previousSibling.textContent,
            _range = window.IDBKeyRange.only(e.target.dataset.hitid);

        HITStorage.db.transaction("HIT", "readwrite").objectStore("HIT").openCursor(_range).onsuccess = function() {
          var c = this.result;
          if (c) {
            var v = c.value;
            v.reward = { pay: _pay, bonus: _bonus };
            c.update(v);
          } 
        }; // idbcursor
      } // bonus is new value
    } // keycode
  } //}}} updateBonus

  function noteHandler(type, e) {//{{{
    // 
    // TODO restructure event handling/logic tree
    //      combine save and delete; it's ugly :(
    //      actually this whole thing is messy and in need of refactoring
    //
    if (e instanceof window.KeyboardEvent) {
     if (e.keyCode === 13) {
        e.target.blur();
        return false;
      }
     return;
    }

    if (e instanceof window.FocusEvent) {
      if (e.target.textContent.trim() !== e.target.dataset.initial) {
        if (!e.target.textContent.trim()) { e.target.previousSibling.previousSibling.firstChild.click(); return; }
        var note   = e.target.textContent.trim(),
            _range = window.IDBKeyRange.only(e.target.dataset.id),
            inote  = e.target.dataset.initial,
            hitId  = e.target.dataset.id,
            date   = e.target.previousSibling.textContent;

        e.target.dataset.initial = note;
        HITStorage.db.transaction("NOTES", "readwrite").objectStore("NOTES").index("hitId").openCursor(_range).onsuccess = function() {
          if (this.result) {
            var r = this.result.value;
            if (r.note === inote) {  // note already exists in database, so we update its value
              r.note = note;
              this.result.update(r);
              return;
            }
            this.result.continue();
          } else {
            if (this.source instanceof window.IDBObjectStore)
              this.source.put({ note:note, date:date, hitId:hitId });
            else
              this.source.objectStore.put({ note:note, date:date, hitId:hitId });
          }
        };
      } 
      return; // end of save event; no need to proceed
    }

    if (type === "delete") {
      var tr       = e.target.parentNode.parentNode,
          noteCell = tr.lastChild;
          _range   = window.IDBKeyRange.only(noteCell.dataset.id);
      if (!noteCell.dataset.initial) tr.remove();
      else {
        HITStorage.db.transaction("NOTES", "readwrite").objectStore("NOTES").index("hitId").openCursor(_range).onsuccess = function() {
          if (this.result) {
            if (this.result.value.note === noteCell.dataset.initial) {
              this.result.delete();
              tr.remove();
              return;
            }
            this.result.continue();
          } 
        };
      }
      return; // end of deletion event; no need to proceed
    } else {
      if (type === "attach" && !e.results.length) return;

      var trow  = e instanceof window.MouseEvent ? e.target.parentNode.parentNode : null,
          tbody = trow ? trow.parentNode : null,
          row   = document.createElement("TR"),
          c1    = row.insertCell(0),
          c2    = row.insertCell(1),
          c3    = row.insertCell(2);
          date  = new Date();
          hitId = e instanceof window.MouseEvent ? e.target.id.substr(5) : null;

      c1.innerHTML = '<span class="removeNote" title="Delete this note" style="cursor:pointer;color:crimson;">[x]</span>';
      c1.firstChild.onclick = noteHandler.bind(null,"delete");
      c1.style.textAlign = "right";
      c2.title = "Date on which the note was added";
      c3.style.color = "crimson";
      c3.colSpan = "6";
      c3.contentEditable = "true";
      c3.onblur = noteHandler.bind(null,"blur");
      c3.onkeydown = noteHandler.bind(null, "kb");
      
      if (type === "new") {
        row.classList.add(trow.classList);
        tbody.insertBefore(row, trow.nextSibling);
        c2.textContent = date.getFullYear()+"-"+Number(date.getMonth()+1).toPadded()+"-"+Number(date.getDate()).toPadded();
        c3.dataset.initial = "";
        c3.dataset.id = hitId;
        c3.focus();
        return;
      }

      for (var entry of e.results) {
        trow  = document.querySelector('tr[data-id="'+entry.hitId+'"]');
        tbody = trow.parentNode;
        row   = row.cloneNode(true);
        c1    = row.firstChild;
        c2    = c1.nextSibling;
        c3    = row.lastChild;
        
        row.classList.add(trow.classList);
        tbody.insertBefore(row, trow.nextSibling);

        c1.firstChild.onclick = noteHandler.bind(null,"delete");
        c2.textContent = entry.date;
        c3.textContent = entry.note;
        c3.dataset.initial = entry.note;
        c3.dataset.id = entry.hitId;
        c3.onblur = noteHandler.bind(null,"blur");
        c3.onkeydown = noteHandler.bind(null, "kb");
      }
    } // new/attach
  }//}}} noteHandler

  function processFile(e) {//{{{
    var f = e.target.files;
    if (f.length && ~f[0].name.search(/\.(bak|csv|json)$/)/* && ~f[0].type.search(/(text|json)/)*/) {
      var reader = new FileReader(), testing = true, isCsv = false;
      metrics.dbimport = new Metrics("file_import");

      reader.readAsText(f[0].slice(0,10));
      reader.onload = function(e) { 
        var r = e.target.result;
        if (testing && !~r.search(/(STATS|NOTES|HIT)/)) { // failed json check, test if csv
          console.log("failed json integrity:", r, "\nchecking csv schema...");
          if (!~r.search(/hitId/)) { // failed csv check, return error
            console.log("failed csv integrity:", r, "\naborting");
            return Utils.errorHandler(new TypeError("Invalid data structure"));
          } else { // passed initial csv check, parse full file
            console.log("deferring to csv parser");
            isCsv   = true;
            testing = false;
            Progress.show();
            reader.readAsText(f[0]);
          }
        } else if (testing) {
          testing = false;
          Progress.show();
          reader.readAsText(f[0]);
        } else {
          if (isCsv) // if csv defer to csv parser
            return parseCsv(r);
          // otherwise write the json
          var data = JSON.parse(r);
          console.log(data);
          HITStorage.write(data, "restore");
        }
      }; // reader.onload
    } else if (f.length) {
      Utils.errorHandler(new TypeError("Unsupported file format"));
    }
  }//}}} processFile

  function parseCsv(r) {//{{{
    var validKeys = ["autoAppTime","date","feedback","hitId","requesterId","requesterName","reward","pay","bonus","status","title"],
        delimiter = r.substr(5,1),
        lines     = r.split(/\r?\n/),
        columns   = lines.splice(0,1)[0].split(delimiter),
        data      = { HIT:[] },
        badCsv    = false;

    if (!columns[columns.length-1].length) { badCsv = true; void(columns.splice(columns.length-1)); }
    if (!lines.length) return Utils.errorHandler(new Error("CSV file must contain at least one record"));
    // make sure column keys are valid
    for (var key of columns) {
      if (!~validKeys.indexOf(key)) {
        Progress.hide();
        return Utils.errorHandler(new TypeError("Invalid key '"+key+"' found in column header"));
      }
    }
    // iterate through each line and convert data into a usable object
    var ln = 1;
    for (var line of lines) {
      var record = {};
      line = badCsv ? line.replace(new RegExp(delimiter+"$"),"").split(delimiter) : line.split(delimiter);
      if (line.length <= 1) continue;
      if (++ln && line.length !== columns.length) {
        // attempt to resolve delimiter conflicts within field values
        line = line.join(delimiter).replace(new RegExp('(?:(")'+delimiter+'|'+delimiter+'("))',"g"),'$1\t$2').split(/\t/);
        // resolution failed
        if (line.length !== columns.length)
          return Utils.errorHandler(new RangeError("Number of fields does not match number of columns in line '"+ln+"'"));
      }

      for (var i=0;i<line.length;i++) {
        if (columns[i] === "pay" || columns[i] === "bonus") {
          record.reward = record.reward || {};
          record.reward[columns[i]] = +line[i];
          continue;
        }
        if (columns[i] === "reward")
          record[columns[i]] = +line[i];
        else
          record[columns[i]] = badCsv ? line[i].replace(/(^"|"$)/g,"") : line[i];
      }
      data.HIT.push(record);
    }
    console.log(data);
    HITStorage.write(data, "restore");
  }//}}} parseCsv

  function autoScroll(location, dt) {//{{{
    var target = document.querySelector(location).offsetTop,
        pos    = window.scrollY,
        dpos   = Math.ceil((target - pos)/3);
    dt = dt ? dt-1 : 25; // time step/max recursions

    if (target === pos || dpos === 0 || dt === 0) return;

    window.scrollBy(0, dpos);
    setTimeout(function() { autoScroll(location, dt); }, dt);
  }//}}}

  function Calendar(offsetX, offsetY, caller) {//{{{
    this.date = new Date();
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.caller = caller;
    this.drawCalendar = function(year,month,day) {//{{{
      year = year || this.date.getFullYear();
      month = month || this.date.getMonth()+1;
      day = day || this.date.getDate();
      var longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var date = new Date(year,month-1,day);
      var anchors = _getAnchors(date);

      //make new container if one doesn't already exist
      var container = null;
      if (document.querySelector("#hdbCalendarPanel")) { 
        container = document.querySelector("#hdbCalendarPanel");
        container.removeChild( container.getElementsByTagName("TABLE")[0] );
      }
      else {
        container = document.createElement("DIV");
        container.id = "hdbCalendarPanel";
        document.body.appendChild(container);
      }
      container.style.left = this.offsetX;
      container.style.top = this.offsetY;
      var cal = document.createElement("TABLE");
      cal.cellSpacing = "0";
      cal.cellPadding = "0";
      cal.border = "0";
      container.appendChild(cal);
      cal.innerHTML = '<tr>' +
        '<th class="hdbCalHeader hdbCalControls" title="Previous month" style="text-align:right;"><span>&lt;</span></th>' +
        '<th class="hdbCalHeader hdbCalControls" title="Previous year" style="text-align:center;"><span>&#8810;</span></th>' +
        '<th colspan="3" id="hdbCalTableTitle" class="hdbCalHeader">'+date.getFullYear()+'<br>'+longMonths[date.getMonth()]+'</th>' +
        '<th class="hdbCalHeader hdbCalControls" title="Next year" style="text-align:center;"><span>&#8811;</span></th>' +
        '<th class="hdbCalHeader hdbCalControls" title="Next month" style="text-align:left;"><span>&gt;</span></th>' +
        '</tr><tr><th class="hdbDayHeader" style="color:red;">S</th><th class="hdbDayHeader">M</th>' +
        '<th class="hdbDayHeader">T</th><th class="hdbDayHeader">W</th><th class="hdbDayHeader">T</th>' +
        '<th class="hdbDayHeader">F</th><th class="hdbDayHeader">S</th></tr>';
      
      document.querySelector('th[title="Previous month"]').addEventListener( "click", function() { 
        this.drawCalendar(date.getFullYear(), date.getMonth(), 1);
      }.bind(this) );
      document.querySelector('th[title="Previous year"]').addEventListener( "click", function() {
        this.drawCalendar(date.getFullYear()-1, date.getMonth()+1, 1);
      }.bind(this) );
      document.querySelector('th[title="Next month"]').addEventListener( "click", function() {
        this.drawCalendar(date.getFullYear(), date.getMonth()+2, 1);
      }.bind(this) );
      document.querySelector('th[title="Next year"]').addEventListener( "click", function() {
        this.drawCalendar(date.getFullYear()+1, date.getMonth()+1, 1);
      }.bind(this) );

      var hasDay = false, thisDay = 1;
      for (var i=0;i<6;i++) { // cycle weeks
        var row = document.createElement("TR");
        for (var j=0;j<7;j++) { // cycle days
          if (!hasDay && j === anchors.first && thisDay < anchors.total)
            hasDay = true;
          else if (hasDay && thisDay > anchors.total)
            hasDay = false;

          var cell = document.createElement("TD");
          cell.classList.add("hdbCalCells");
          row.appendChild(cell);
          if (hasDay) {
            cell.classList.add("hdbCalDays");
            cell.textContent = thisDay;
            cell.addEventListener("click", _clickHandler.bind(this));
            cell.dataset.year = date.getFullYear();
            cell.dataset.month = date.getMonth()+1;
            cell.dataset.day = thisDay++;
          }
        } // for j
        cal.appendChild(row);
      } // for i
      var controls = cal.insertRow(-1);
      controls.insertCell(0);
      controls.cells[0].colSpan = "7";
      controls.cells[0].classList.add("hdbCalCells");
      controls.cells[0].innerHTML = ' &nbsp; &nbsp; <a href="javascript:void(0)" style="font-weight:bold;text-decoration:none;">Clear</a>' + 
        ' &nbsp; <a href="javascript:void(0)" style="font-weight:bold;text-decoration:none;">Close</a>';
      controls.cells[0].children[0].onclick = function() { this.caller.value = ""; }.bind(this);
      controls.cells[0].children[1].onclick = this.die;

      function _clickHandler(e) {
        /*jshint validthis:true*/

        var y = e.target.dataset.year;
        var m = Number(e.target.dataset.month).toPadded();
        var d = Number(e.target.dataset.day).toPadded();
        this.caller.value = y+"-"+m+"-"+d;
        this.die();
      }

      function _getAnchors(date) {
        var _anchors = {};
        date.setMonth(date.getMonth()+1);
        date.setDate(0);
        _anchors.total = date.getDate();
        date.setDate(1);
        _anchors.first = date.getDay();
        return _anchors;
      }
    };//}}} drawCalendar

    this.die = function() { document.getElementById('hdbCalendarPanel').remove(); };

  }//}}} Calendar

  // instance metrics apart from window scoped PerformanceTiming API
  function Metrics(name) {//{{{
    this.name = name || "undefined";
    this.marks = {};
    this.start = window.performance.now();
    this.end = null;
    this.stop = function(){
      if (!this.end) 
        this.end = window.performance.now();
      else
        Utils.errorHandler(new Error("Metrics::AccessViolation - end point cannot be overwritten"));
    };
    this.mark = function(name,position) {
      if (position === "end" && (!this.marks[name] || this.marks[name].end)) return;

      if (!this.marks[name])
        this.marks[name] = {};

      this.marks[name][position] = window.performance.now();
    };
    this.report = function() {
      console.group("Metrics for",this.name.toUpperCase());
      console.log("Process completed in",+Number((this.end-this.start)/1000).toFixed(3),"seconds");
      for (var k in this.marks) {
        if (this.marks.hasOwnProperty(k)) {
          console.log(k,"occurred after",+Number((this.marks[k].start-this.start)/1000).toFixed(3),"seconds,",
              "resolving in", +Number((this.marks[k].end-this.marks[k].start)/1000).toFixed(3), "seconds");
        }
      }
      console.groupEnd();
    };
  }//}}}

})(); //scoping

/*
 *
 *
 * * * * * * * * * * * * * TESTING FUNCTIONS -- DELETE BEFORE FINAL RELEASE * * * * * * * * * * * 
 *
 *
 */


function INFLATEDUMMYVALUES() { //{{{
  'use strict';

  var tdb = this.result;
  tdb.onerror = function(e) { console.log("requesterror",e.target.error.name,e.target.error.message,e); };
  tdb.onversionchange = function(e) { console.log("tdb received versionchange request", e); tdb.close(); };
  //console.log(tdb.transaction("HIT").objectStore("HIT").indexNames.contains("date"));
  console.groupCollapsed("Populating test database");
  var tdbt = {};
  //tdbt.trans = tdb.transaction(["HIT", "NOTES", "BLOCKS"], "readwrite");
  tdbt.trans = tdb.transaction("HIT", "readwrite");
  tdbt.hit   = tdbt.trans.objectStore("HIT");
  //tdbt.notes = tdbt.trans.objectStore("NOTES");
  //tdbt.blocks= tdbt.trans.objectStore("BLOCKS");

  var filler = { notes:[], hit:[], blocks:[] };
  for (var n=0;n<100000;n++) {
    filler.hit.push({ date: "2015-08-00", requesterName: "testRequester", title: "Greatest Title Ever #"+(n+1), 
      reward: Number((n+1)%(200/n)+(((n+1)%200)/100)).toFixed(2), status: "moo",
      requesterId: ("RRRRRRR"+n).substr(-7), hitId: ("HHHHHHH"+n).substr(-7) });
    /*if (n%1000 === 0) {
      filler.notes.push({ requesterId: ("RRRRRRR"+n).substr(-7), note: n+1 +
        " Proin vel erat commodo mi interdum rhoncus. Sed lobortis porttitor arcu, et tristique ipsum semper a." +
        " Donec eget aliquet lectus, vel scelerisque ligula." });
      filler.blocks.push({requesterId: ("RRRRRRR"+n).substr(-7)});
    }*/
  }

  _write(tdbt.hit, filler.hit);
  _write(tdbt.notes, filler.notes);
  //_write(tdbt.blocks, filler.blocks);

  function _write(store, obj) {
    if (obj.length) {
      var t = obj.pop();
      store.put(t).onsuccess = function() { _write(store, obj) };
    } else {
      console.log("population complete");
    }
  }

  console.groupEnd();
/*
  var dbh = window.indexedDB.open(DB_NAME, DB_VERSION);
  dbh.onerror = function(e) { console.log("[HITDB]",e.target.error.name+":", e.target.error.message, e); };
  console.log(dbh.readyState, dbh);
  dbh.onupgradeneeded = HITStorage.versionChange;
  dbh.onblocked = function(e) { console.log("blocked event triggered:", e); };
*/
  tdb.close();

}//}}}
/*
function BLANKSLATE() { //{{{ create empty db equivalent to original schema to test upgrade
    'use strict';
    var tdb = this.result;
    if (!tdb.objectStoreNames.contains("HIT")) { 
        console.log("creating HIT OS");
        var dbo = tdb.createObjectStore("HIT", { keyPath: "hitId" });
        dbo.createIndex("date", "date", { unique: false });
        dbo.createIndex("requesterName", "requesterName", { unique: false});
        dbo.createIndex("title", "title", { unique: false });
        dbo.createIndex("reward", "reward", { unique: false });
        dbo.createIndex("status", "status", { unique: false });
        dbo.createIndex("requesterId", "requesterId", { unique: false });

    }
    if (!tdb.objectStoreNames.contains("STATS")) {
        console.log("creating STATS OS");
        dbo = tdb.createObjectStore("STATS", { keyPath: "date" });
    }
    if (!tdb.objectStoreNames.contains("NOTES")) {
        console.log("creating NOTES OS");
        dbo = tdb.createObjectStore("NOTES", { keyPath: "requesterId" });
    }
    if (!tdb.objectStoreNames.contains("BLOCKS")) {
        console.log("creating BLOCKS OS");
        dbo = tdb.createObjectStore("BLOCKS", { keyPath: "id", autoIncrement: true });
        dbo.createIndex("requesterId", "requesterId", { unique: false });
    }
} //}}}
*/


// vim: ts=2:sw=2:et:fdm=marker:noai
