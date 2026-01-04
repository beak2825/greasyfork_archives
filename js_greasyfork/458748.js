// ==UserScript==
// @name        Kitsun manual lesson importer
// @namespace   bspar
// @match       https://kitsun.io/*
// @grant       GM.xmlHttpRequest
// @version     0.1
// @author      bspar
// @license     MIT; http://opensource.org/licenses/MIT
// @description Adds a button to import a list of words to add to the beginning of the leson queue
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require https://cdnjs.cloudflare.com/ajax/libs/lokijs/1.5.12/lokijs.min.js
// @downloadURL https://update.greasyfork.org/scripts/458748/Kitsun%20manual%20lesson%20importer.user.js
// @updateURL https://update.greasyfork.org/scripts/458748/Kitsun%20manual%20lesson%20importer.meta.js
// ==/UserScript==
var style = `
.bspar-button {
  background: var(--primary);
  color: white;
  border-radius: 5px;
  padding: 10px;
  cursor: pointer;
}
.bspar-inputbox {
  -webkit-appearance: none;
  width: 100%;
  height: 36px;
  border-radius: 5px;
  border: none;
  padding-left: 10px;
  padding-right: 10px;
  border: 1px solid var(--midlight);
  color: var(--dark-text);
  font-size: 0.9rem;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: var(--input-bg);
}
.importPopup {
  display: none;
  position: fixed;
  left: 45%;
  top: 5%;
  transform: translate(-50%, 5%);
  border: 3px solid #999999;
  z-index: 9;
}
.formPopup {
  max-width: 300px;
  padding: 20px;
  background-color: #CCC;
}
`
var styleSheet = document.createElement("style");
styleSheet.innerText = style;
document.head.appendChild(styleSheet);

var db;
function databaseInitialize() {
  var test = db.getCollection('timestamps');
  if(!test) {
    console.log('still cannot open :(');
    // test = db.addCollection('ssCache');
    // test.insert({reading: 'meow', meaning: 'woem'});
    // db.saveDatabase();
  } else {
    console.log('loaded DB!!');
  }
}

function reportResults(queueResults) {
  var resultsBox = document.getElementById('resultsText');
  resultsBox.textContent = 'Successfully queued the following words - copy between the "===" and import to MM.\n';
  resultsBox.textContent += '===\n';
  var successes = [];
  var failures = {}; // {'word' : 'reason'}
  for(var [key, value] of Object.entries(queueResults)) {
    if(value === true) successes.push(key);
    else failures[key] = value;
  }
  successes.forEach((item) => resultsBox.textContent += `${item}\n`);
  resultsBox.textContent += '===\n';
  resultsBox.textContent += 'The following failed - if there is more than one match found, you should check each one and queue the cards manually.\n';
  resultsBox.textContent += '===\n';
  for(var [key, value] of Object.entries(failures)) {
    resultsBox.textContent += `${key}  -  ${value}\n`;
  };
  resultsBox.textContent += '===\n';
  resultsBox.textContent += 'Words that you imported into "known words" on kitsun will still show up in lessons. Use the above search bar to filter on "known" and "manual lesson" (under status). Those words can probably be safely hibernated.';
  resultsBox.textContent += 'Refresh the page (after saving these results) if you want to verify cards were added to the queue (and to hibernate known words).';
}

function queueWords(cards) {
  GM.xmlHttpRequest({
    method: "POST",
    url: "https://api.kitsun.io/cards/addtolessons",
    data: JSON.stringify(cards),
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    },
    onload: (response) => {
      console.log(`queue POST response: ${response.responseText}`);
    }
  });
}

function doImport() {
  console.log('Doing import...');
  var words = document.getElementById('importData').value.trim().split(/\r?\n/);
  databaseInitialize();
  var deck = window.location.href.match(/deck\/([\w-]*)\/cards/)[1]
  var collection = '';
  db.collections.forEach((item) => {
    if(item['name'].includes(deck)) collection = item['name']
  });
  console.log(`collection: ${collection}`)
  cardsdb = db.getCollection(collection);
  lessonCards = {};
  words.forEach((word) => {
    console.log(word);
    lessonCards[word] = cardsdb.where((obj) => {
      var match = false;
      obj['cardFields'].forEach((item) => {
        if(item['value'] == word) match = true;
      });
      return match;
    });
  });
  console.log(`lessonCards: ${lessonCards}`);
  var cardsForQueue = {};
  var queueResults = {};
  cardsForQueue['deckId'] = deck;
  cardsForQueue['ids'] = [];
  for(var [key, value] of Object.entries(lessonCards)) {
    console.log(`${key} - value.length: ${value.length}`);
    if(value.length == 1) {
      cardsForQueue['ids'].push(value[0]['_id']);
      queueResults[key] = true;
    }
    else if(value.length > 1) queueResults[key] = 'More than one match found';
    else if(value.length == 0) queueResults[key] = 'No match found';
    else queueResults[key] = 'Unknown error';
  }
  queueWords(cardsForQueue);
  reportResults(queueResults);
}

function closeForm() {
  document.querySelector(".importPopup").style.display = "none";
}

function importClip() {
  document.querySelector(".importPopup").style.display = "block";
}

// wait for the document to load
const disconnect = VM.observe(document.body, () => {
  // Find the table
  const node = document.querySelector('.results');
  var parent = document.querySelector('.search_wrapper');

  // find the header
  if(node) {
    const importBtn = document.createElement('div');
    importBtn.classList.add('bspar-button');
    importBtn.textContent = 'Import lessons from clipboard';
    importBtn.addEventListener('click', importClip);
    parent.insertBefore(importBtn, node);
    return true;
  }
});





// https://www.w3docs.com/tools/code-editor/12095
var modalHTML = `
<div class="importPopup">
  <div class="formPopup" id="popupForm">
    <h2>Import to front of lesson queue</h2>
    <textarea id="importData" class="bspar-inputbox" rows="5" cols="80" name="text" placeholder="Paste the data"></textarea>
    <button id="gobtn" type="button" class="btn">GO!</button>
    <button id="closebtn" type="button" class="btn cancel">Close</button>
    <textarea id="resultsText" class="bspar-inputbox" rows="5" cols="80" name="text" placeholder="Import results"></textarea>
  </div>
</div>
`
var inputmodal = document.createElement("div");
inputmodal.innerHTML = modalHTML;
document.body.appendChild(inputmodal);
document.getElementById("closebtn").addEventListener('click', closeForm);
document.getElementById("gobtn").addEventListener('click', doImport);

// LokiIndexedAdapter

var e = "undefined" != typeof window && !!window.__loki_incremental_idb_debug;

function t(e) {
    if (this.mode = "incremental", this.options = e || {}, this.chunkSize = 100, this.megachunkCount = this.options.megachunkCount || 20, this.idb = null, this._prevLokiVersionId = null, this._prevCollectionVersionIds = {}, !(this.megachunkCount >= 4 && this.megachunkCount % 2 == 0)) throw new Error("megachunkCount must be >=4 and divisible by 2")
}

function n(e, t) {
    if (e.value = JSON.parse(e.value), t) {
        var n = e.key.split(".");
        if (3 === n.length && "chunk" === n[1]) {
            var r = n[0];
            e.value = t(r, e.value)
        }
    }
}

function r() {
    return Math.random().toString(36).substring(2)
}

function i(e) {
    var t = e.key;
    if (t.includes(".")) {
        var n = t.split(".");
        if (3 === n.length && "chunk" === n[1]) return parseInt(n[2], 10)
    }
    return -1
}

function o(e, t, n) {
    return e.onsuccess = function(e) {
        try {
            return t(e)
        } catch (e) {
            n(e)
        }
    }, e.onerror = n, e
}
t.prototype._getChunk = function(e, t) {
    var n = t * this.chunkSize,
        r = n + this.chunkSize - 1;
    e.ensureId();
    for (var i, o = e.idIndex, a = null, s = o.length - 1, l = 0; o[l] < o[s];) o[i = l + s >> 1] < n ? l = i + 1 : s = i;
    if (s === l && o[l] >= n && o[l] <= r && (a = l), null === a) return [];
    for (var u = null, c = a + this.chunkSize - 1; c >= a; c--)
        if (o[c] <= r) {
            u = c;
            break
        } var f = e.data[a];
    if (!(f && f.$loki >= n && f.$loki <= r)) throw new Error("broken invariant firstelement");
    var p = e.data[u];
    if (!(p && p.$loki >= n && p.$loki <= r)) throw new Error("broken invariant lastElement");
    var d = e.data.slice(a, u + 1);
    if (d.length > this.chunkSize) throw new Error("broken invariant - chunk size");
    return d
}

t.prototype.saveDatabase = function(t, n, r) {
    var i = this;
    if (this.idb) {
        if (this.operationInProgress) throw new Error("Error while saving to database - another operation is already in progress. Please use throttledSaves=true option on Loki object");
        this.operationInProgress = !0, e && console.log("saveDatabase - begin"), e && console.time("saveDatabase");
        try {
            var a = function() {
                    console.error("Unexpected successful tx - cannot update previous version ids")
                },
                s = !1,
                l = this.idb.transaction(["LokiIncrementalData"], "readwrite");
            l.oncomplete = function() {
                a(), p(), s && i.options.onDidOverwrite && i.options.onDidOverwrite()
            }, l.onerror = function(e) {
                p(e)
            }, l.onabort = function(e) {
                p(e)
            };
            var u = l.objectStore("LokiIncrementalData"),
                c = function(e) {
                    try {
                        var t = !e,
                            r = i._putInChunks(u, n(), t, e);
                        a = function() {
                            i._prevLokiVersionId = r.lokiVersionId, r.collectionVersionIds.forEach((function(e) {
                                i._prevCollectionVersionIds[e.name] = e.versionId
                            }))
                        }, l.commit && l.commit()
                    } catch (e) {
                        console.error("idb performSave failed: ", e), l.abort()
                    }
                },
                f = function() {
                    o(u.getAllKeys(), (function(e) {
                        var t = function(e) {
                            var t = {};
                            return e.forEach((function(e) {
                                var n = e.split(".");
                                if (3 === n.length && "chunk" === n[1]) {
                                    var r = n[0],
                                        i = parseInt(n[2]) || 0,
                                        o = t[r];
                                    (!o || i > o) && (t[r] = i)
                                }
                            })), t
                        }(e.target.result);
                        c(t)
                    }), (function(e) {
                        console.error("Getting all keys failed: ", e), l.abort()
                    }))
                };
            o(u.get("loki"), (function(t) {
                (function(e) {
                    try {
                        return e && JSON.parse(e.value).idbVersionId || null
                    } catch (e) {
                        return console.error("Error while parsing loki chunk", e), null
                    }
                })(t.target.result) === i._prevLokiVersionId ? c() : (e && console.warn("Another writer changed Loki IDB, using slow path..."), s = !0, f())
            }), (function(e) {
                console.error("Getting loki chunk failed: ", e), l.abort()
            }))
        } catch (e) {
            p(e)
        }
    } else this._initializeIDB(t, r, (function() {
        i.saveDatabase(t, n, r)
    }));

    function p(t) {
        e && t && console.error(t), e && console.timeEnd("saveDatabase"), i.operationInProgress = !1, r(t)
    }
}

t.prototype._putInChunks = function(t, n, i, o) {
    var a = this,
        s = [],
        l = 0;
    n.collections.forEach((function(u, c) {
        var f = new Set;
        i && u.dirtyIds.forEach((function(e) {
            var t = e / a.chunkSize | 0;
            f.add(t)
        })), u.dirtyIds = [];
        var p = function(n) {
            var r = a._getChunk(u, n);
            a.options.serializeChunk && (r = a.options.serializeChunk(u.name, r)), r = JSON.stringify(r), l += r.length, e && i && console.log("Saving: " + u.name + ".chunk." + n), t.put({
                key: u.name + ".chunk." + n,
                value: r
            })
        };
        if (i) f.forEach(p);
        else {
            for (var d = u.maxId / a.chunkSize | 0, h = 0; h <= d; h += 1) p(h);
            for (var v = o[u.name] || 0, m = d + 1; m <= v; m += 1) {
                var g = u.name + ".chunk." + m;
                t.delete(g), e && console.warn("Deleted chunk: " + g)
            }
        }
        if (u.dirty || f.size || !i) {
            u.idIndex = [], u.data = [], u.idbVersionId = r(), s.push({
                name: u.name,
                versionId: u.idbVersionId
            });
            var b = JSON.stringify(u);
            l += b.length, e && i && console.log("Saving: " + u.name + ".metadata"), t.put({
                key: u.name + ".metadata",
                value: b
            })
        }
        n.collections[c] = {
            name: u.name
        }
    })), n.idbVersionId = r();
    var u = JSON.stringify(n);
    return l += u.length, e && i && console.log("Saving: loki"), t.put({
        key: "loki",
        value: u
    }), e && console.log("saved size: " + l), {
        lokiVersionId: n.idbVersionId,
        collectionVersionIds: s
    }
}

t.prototype.loadDatabase = function(t, n) {
    var r = this;
    if (this.operationInProgress) throw new Error("Error while loading database - another operation is already in progress. Please use throttledSaves=true option on Loki object");
    this.operationInProgress = !0, e && console.log("loadDatabase - begin"), e && console.time("loadDatabase");
    var o = function(t) {
        e && console.timeEnd("loadDatabase"), r.operationInProgress = !1, n(t)
    };
    this._getAllChunks(t, (function(t) {
        try {
            if (!Array.isArray(t)) throw t;
            if (!t.length) return o(null);
            e && console.log("Found chunks:", t.length);
            var n = (t = function(e) {
                var t, n = {};
                if (function(e) {
                        e.sort((function(e, t) {
                            var n = i(e),
                                r = i(t);
                            return n < r ? -1 : n > r ? 1 : 0
                        }))
                    }(e), e.forEach((function(e) {
                        var r = e.key,
                            i = e.value;
                        if ("loki" !== r) {
                            if (r.includes(".")) {
                                var o = r.split(".");
                                if (3 === o.length && "chunk" === o[1]) {
                                    var a = o[0];
                                    return void(n[a] ? n[a].dataChunks.push(i) : n[a] = {
                                        metadata: null,
                                        dataChunks: [i]
                                    })
                                }
                                if (2 === o.length && "metadata" === o[1]) {
                                    var s = o[0];
                                    return void(n[s] ? n[s].metadata = i : n[s] = {
                                        metadata: i,
                                        dataChunks: []
                                    })
                                }
                            }
                            throw console.error("Unknown chunk " + r), new Error("Corrupted database - unknown chunk found")
                        }
                        t = i
                    })), !t) throw new Error("Corrupted database - missing database metadata");
                return {
                    loki: t,
                    chunkMap: n
                }
            }(t)).loki;
            return t.loki = null,
                function(e, t) {
                    e.collections.forEach((function(n, r) {
                        var i = t[n.name];
                        if (i) {
                            if (!i.metadata) throw new Error("Corrupted database - missing metadata chunk for " + n.name);
                            var o = i.metadata;
                            i.metadata = null, e.collections[r] = o;
                            var a = i.dataChunks;
                            a.forEach((function(e, t) {
                                e.forEach((function(e) {
                                    o.data.push(e)
                                })), a[t] = null
                            }))
                        }
                    }))
                }(n, t.chunkMap), t = null, r._prevLokiVersionId = n.idbVersionId || null, r._prevCollectionVersionIds = {}, n.collections.forEach((function(e) {
                    r._prevCollectionVersionIds[e.name] = e.idbVersionId || null
                })), o(n)
        } catch (e) {
            return r._prevLokiVersionId = null, r._prevCollectionVersionIds = {}, o(e)
        }
    }))
}

t.prototype._initializeIDB = function(t, n, r) {
    var i = this;
    if (e && console.log("initializing idb"), this.idbInitInProgress) throw new Error("Cannot open IndexedDB because open is already in progress");
    this.idbInitInProgress = !0;
    var o = indexedDB.open(t, 1);
    o.onupgradeneeded = function(t) {
        var n = t.target.result;
        if (e && console.log("onupgradeneeded, old version: " + t.oldVersion), !(t.oldVersion < 1)) throw new Error("Invalid old version " + t.oldVersion + " for IndexedDB upgrade");
        n.createObjectStore("LokiIncrementalData", {
            keyPath: "key"
        })
    }, o.onsuccess = function(o) {
        i.idbInitInProgress = !1;
        var a = o.target.result;
        if (i.idb = a, !a.objectStoreNames.contains("LokiIncrementalData")) return n(new Error("Missing LokiIncrementalData")), void i.deleteDatabase(t);
        e && console.log("init success"), a.onversionchange = function(t) {
            i.idb === a && (e && console.log("IDB version change", t), i.idb.close(), i.idb = null, i.options.onversionchange && i.options.onversionchange(t))
        }, r()
    }, o.onblocked = function(e) {
        console.error("IndexedDB open is blocked", e), n(new Error("IndexedDB open is blocked by open connection"))
    }, o.onerror = function(e) {
        i.idbInitInProgress = !1, console.error("IndexedDB open error", e), n(e)
    }
}

t.prototype._getAllChunks = function(e, t) {
    var r = this;
    if (this.idb) {
        var i = this.idb.transaction(["LokiIncrementalData"], "readonly").objectStore("LokiIncrementalData"),
            a = this.options.deserializeChunk;
        o(i.getAllKeys(), (function(e) {
            var r = e.target.result.sort();
            r.length > 100 ? s(r) : o(i.getAll(), (function(e) {
                var r = e.target.result;
                r.forEach((function(e) {
                    n(e, a)
                })), t(r)
            }), (function(e) {
                t(e)
            }))
        }), (function(e) {
            t(e)
        })), r.options.onFetchStart && r.options.onFetchStart()
    } else this._initializeIDB(e, t, (function() {
        r._getAllChunks(e, t)
    }));

    function s(e) {
        var s = r.megachunkCount,
            l = function(e, t) {
                for (var n, r, i = Math.floor(e.length / t), o = [], a = 0; a < t; a += 1) n = e[i * a], r = e[i * (a + 1)], 0 === a ? o.push(IDBKeyRange.upperBound(r, !0)) : a === t - 1 ? o.push(IDBKeyRange.lowerBound(n)) : o.push(IDBKeyRange.bound(n, r, !1, !0));
                return o
            }(e, s),
            u = [],
            c = 0;

        function f(e) {
            var r = l[e];
            o(i.getAll(r), (function(r) {
                e < s / 2 && f(e + s / 2),
                    function(e, r, i) {
                        var o = e.target.result;
                        o.forEach((function(e, t) {
                            n(e, a), u.push(e), o[t] = null
                        })), (c += 1) === s && t(u)
                    }(r)
            }), (function(e) {
                t(e)
            }))
        }
        for (var p = 0; p < s / 2; p += 1) f(p)
    }
}

t.prototype.deleteDatabase = function(t, n) {
    if (this.operationInProgress) throw new Error("Error while deleting database - another operation is already in progress. Please use throttledSaves=true option on Loki object");
    this.operationInProgress = !0;
    var r = this;
    e && console.log("deleteDatabase - begin"), e && console.time("deleteDatabase"), this._prevLokiVersionId = null, this._prevCollectionVersionIds = {}, this.idb && (this.idb.close(), this.idb = null);
    var i = indexedDB.deleteDatabase(t);
    i.onsuccess = function() {
        r.operationInProgress = !1, e && console.timeEnd("deleteDatabase"), n({
            success: !0
        })
    }, i.onerror = function(e) {
        r.operationInProgress = !1, console.error("Error while deleting database", e), n({
            success: !1
        })
    }, i.onblocked = function(e) {
        console.error("Deleting database failed because it's blocked by another connection", e)
    }
}

var LokiIndexedAdapter = t;

var adapter = new LokiIndexedAdapter();
db = new loki('cards', {
  adapter: adapter,
  autoload: true,
  autoloadCallback : databaseInitialize,
  autosave: false
  // autosaveInterval: 4000
});

