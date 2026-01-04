// ==UserScript==
// @name         NT
// @namespace    http://tampermonkey.net/
// @version      2025-01-30
// @description  NT Image Auto Tab
// @author       You
// @match        https://sukebei.nyaa.si/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nyaa.si
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528995/NT.user.js
// @updateURL https://update.greasyfork.org/scripts/528995/NT.meta.js
// ==/UserScript==
// <-------------------------- Lib version 0.0.6 -------------------------->
  var enable_debug = true
  function log(msg, level=7) {
    if (enable_debug) {
      if (level==0) {
        alert(msg);
        console.trace(msg);
      } else {
        console.trace(msg);
      }
    }
  }
  // data type validator
  function isString(value) {
    return typeof value === "string";
  }
  function isNumber(value) {
    return typeof value === "number" && isFinite(value);
  }
  function isArray(a) {
    return (!!a) && (a.constructor === Array);
  }
  function isObject(a) {
    return (!!a) && (a.constructor === Object);
  }
  function isObjectEmpty(a) {
    let out = false;
    if (isObject(a)) {
      out = Array.from(Object.keys(a)).length === 0;
    }
    return out;
  }
  // object manipulator
  function arrayFy(a) {
    if (!(isArray(a))) {
      a = [a];
    }
    return a;
  }
  function setObjDefaultValue(val, key, obj) {
    if (!(key in obj)) {
      obj[key] = val;
    }
    return obj;
  }
  function setDefaultValue(default_val, og_val) {
    if (og_val===undefined) {
      og_val = default_val;
    }
    return og_val;
  }
  function addObjIfExist(key, out_obj, ref_obj) {
    if (key in ref_obj) {
      out_obj[key] = ref_obj[key];
    }
    return out_obj;
  }
  function mergeObj(new_obj, data) {
    for (let key in new_obj) {
      data[key] = new_obj[key];
    }
    return data;
  }
  function deepCopy(obj) {
    var rv;
    switch (typeof obj) {
      case "object":
        if (obj === null) {
          /* null => null */
          rv = null;
        } else {
          switch (toString.call(obj)) {
            case "[object Array]":
              /* It's an array, create a new array with */
              /* deep copies of the entries */
              rv = obj.map(deepCopy);
              break;
            case "[object Date]":
              /* Clone the date */
              rv = new Date(obj);
              break;
            case "[object RegExp]":
              /* Clone the RegExp */
              rv = new RegExp(obj);
              break;
            /* ...probably a few others */
            default:
              /* Some other kind of object, deep-copy its */
              /* properties into a new object */
              rv = Object.keys(obj).reduce(function(prev, key) {
                prev[key] = deepCopy(obj[key]);
                return prev;
              }, {});
              break;
          }
        }
        break;
      default:
        /* It's a primitive, copy via assignment */
        rv = obj;
        break;
    }
    return rv;
  }
  function getSelector(el) {
    let str_out = "";
    if (el.tagName.toLowerCase() == "html") {
      str_out = "html";
    } else {
      var str = el.tagName.toLowerCase();
      str += (el.id != "") ? "#" + el.id : "";
      if (el.className) {
        var classes = el.className.trim().split(/\s+/);
        for (var i = 0; i < classes.length; i++) {
          str += "." + classes[i]
        }
      }
      if (document.querySelectorAll(str).length==1) {
        str_out = str;
      } else {
        str_out = getSelector(el.parentNode) + " > " + str;
      }
    }
    return str_out;
  }
  function doCallback(callback=false) {
    if (typeof callback == "function") {
      callback();
    }
  }
  function formatQ(q) {
    if (isString(q)) {
      q = {"q":q}
    }
    if (isObject(q)) {
      q.qid = setDefaultValue(0,q.qid);
      q.s = setDefaultValue(false,q.s);
      q.el = setDefaultValue(document,q.el);
    }
    return q;
  }
  function formatObjDOM(q,opt={}) {
    opt = formatQ(opt);
    if (isString(q)) {
      q = {"q":q}
    }
    if (isObject(q)) {
      q.qid = setDefaultValue(opt.qid, q.qid);
      q.s = setDefaultValue(opt.s, q.s);
      q.el = setDefaultValue(opt.el, q.el);
    }
    return q;
  }
  function getDOM(q, opt={}, exist=false) {
    q = arrayFy(q);
    if (q.length > 0) {
      let e = q[0];
      e = formatObjDOM(e,opt);
      opt = mergeObj(e,opt);
      let el_list = opt.el.querySelectorAll(e.q);
      if (opt.r) {
        let exist_list = [];
        for (let i = 0; i < el_list.length; i++) {
          let el = el_list[i];
          let client = el.getBoundingClientRect();
          if (opt.s) {
            exist_list.push(true);
          } else if (client.width > 0 && client.height > 0) {
            exist_list.push(true);
          } else {
            exist_list.push(false);
          }
        }
        if (exist_list.indexOf(false)===-1) {
          q.shift();
          opt.el = opt.el.querySelectorAll(e.q);
          let data = getDOM(q,opt,exist);
          exist = data.exist;
          opt.el = data.el;
        }
      } else {
        if (el_list.length > opt.qid) {
          opt.el = el_list[opt.qid];
          opt.client = opt.el.getBoundingClientRect();
          if (opt.s) {
            q.shift();
            let data = getDOM(q,opt,exist);
            exist = data.exist;
            opt.el = data.el;
          } else if (opt.client.width > 0 && opt.client.height > 0) {
            q.shift();
            let data = getDOM(q,opt,exist);
            exist = data.exist;
            opt.el = data.el;
          }
        }
      }
    } else {
      exist = true;
    }
    return {"exist":exist,"el":opt.el};
  }
  function waitDOM(q, callback, n_loop=0) {
    q = arrayFy(q);
    let loop_counter = 0;
    let client_list = {};
    let loop_waitDOM = setInterval(function() {
      let exist_list = [];
      for (let i = 0; i < q.length; i++) {
        let exist = false;
        let e = q[i];
        client_list = setObjDefaultValue({},i,client_list);
        client_list[i] = setObjDefaultValue({"top":-1,"down":-1,"left":-1,"right":-1},"client",client_list[i]);
        e = formatObjDOM(e);
        let el_list = e.el.querySelectorAll(e.q);

        if (e.r) {
          for (let ii = 0; ii < el_list.length; ii++) {
            // log(waitDOM.name+" d:"+getSelector(e.el)+" q:"+e.q+"["+ii+"]");
            let el = el_list[ii];
            let el_client = el.getBoundingClientRect();
            client_list[i] = setObjDefaultValue({},ii,client_list[i]);
            client_list[i][ii] = setObjDefaultValue({"top":-1,"down":-1,"left":-1,"right":-1},"client",client_list[i][ii]);
            if (e.s) {
              exist = true;
            } else if (
              el_client.width > 0 &&
              el_client.height > 0 &&
              el_client.top==client_list[i][ii].client.top &&
              el_client.down==client_list[i][ii].client.down &&
              el_client.left==client_list[i][ii].client.left &&
              el_client.right==client_list[i][ii].client.right
            ) {
              exist = true;
            } else {
              client_list[i][ii].client = el_client;
            }
          }
        } else {
          // log(waitDOM.name+" d:"+getSelector(e.el)+" q:"+e.q+"["+e.qid+"]");
          if (el_list.length > e.qid) {
            let el = el_list[e.qid];
            e.client = el.getBoundingClientRect();
            if (e.s) {
              exist = true;
            } else if (
              e.client.width > 0 &&
              e.client.height > 0 &&
              e.client.top==client_list[i].client.top &&
              e.client.down==client_list[i].client.down &&
              e.client.left==client_list[i].client.left &&
              e.client.right==client_list[i].client.right
            ) {
              exist = true;
            } else {
              client_list[i].client = e.client;
            }
          }
        }

        exist_list.push(exist);
      }
      if (exist_list.indexOf(false)===-1) {
        clearInterval(loop_waitDOM);
        callback();
      }
      if (n_loop > 0) {
        if (loop_counter >= n_loop) {
          clearInterval(loop_waitDOM);
        }
      }
      loop_counter += 1;
    }, 300);
  }
  function readBody(xhr) {
    let data;
    if (!xhr.responseType || xhr.responseType === "text") {
      data = xhr.responseText;
    } else if (xhr.responseType === "document") {
      data = xhr.responseXML;
    } else {
      data = xhr.response;
    }
    let body_text = data.substring(data.indexOf("<body"), data.indexOf("</body>")+7);
    return body_text;
  }
  function strToHtml(str) {
    const el_body = document.createElement('div');
    el_body.innerHTML = str;
    return el_body;
  }
  function htmlDecode(input){
    let e = document.createElement('textarea');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }
  function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
  }
// </------------------------- Lib version 0.0.6 -------------------------->

var qs = {
  "info": {
    "q": "div.container > div.panel.panel-success > div.panel-body",
    "trusted": {"q": "a.text-success[title='Trusted']"},
  },
  "desc": {
    "q": "div#torrent-description",
  }
}

var upns = { // up nushis
  "offkab": {
    "re": /_s\.(jpg|png)/i
  }
}

function getLinks(upn, el) {
  console.log(upn)
  console.log(el)
  el.desc = getDOM(qs.desc.q);
  if (el.desc.exist) {
    el.as = getDOM("a",{"el":el.desc.el, "r": true});
    el.a = null
    for (var i = 0; i < el.as.el.length; i++) {
      console.log(el.as.el[i].innerText.match(upn.re))
      console.log(el.as.el[i].innerText.match(upn.re) != null)
      if (el.as.el[i].innerText.match(upn.re) != null) {
        el.a = el.as.el[i];
      }
    }
    // console.log(el.a.href);
    // window.location.href = el.a.href;
    window.open(el.a, '_blank').focus();
  }

}

function getSubmitter() {
  var el = {"info": getDOM(qs.info.q)};
  if (el.info.exist) {
    el.trusted = getDOM(qs.info.trusted.q, {"el":el.info.el});
    if (el.trusted.el.innerText in upns) {
      getLinks(upns[el.trusted.el.innerText], el)
    }
  }
}

(function() {
  'use strict';

  waitDOM(qs.info.q, getSubmitter);
})();