// ==UserScript==
// @name         Booru Viewer QoL
// @version      1.2.3
// @description  Booru Viewer Quality-of-Life Tools
// @author       naiethnorp
// @match        https://rule34.xxx/*
// @match        https://xbooru.com/*
// @match        https://danbooru.donmai.us/*
// @namespace    https://greasyfork.org/users/801832
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @require      https://greasyfork.org/scripts/478441/code/Naiethnorp%20Lib%20Tag%20%20Icons.js?version=1278875
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476439/Booru%20Viewer%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/476439/Booru%20Viewer%20QoL.meta.js
// ==/UserScript==
// jshint esversion: 6

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

// <------------------------------ Global Var ----------------------------->
  // <-------------------------------- Tags ------------------------------->
    var grouping_tags = {
      "copyright": {
        "fate/grand_order": "fate",
        "persona_5": "persona",
        "detective_pikachu": "pokemon",
        "attack_on_titan": "shingeki_no_kyojin",
        "nier:_automata": "nier",

        "blacked": "",
        "snapchat": "",

        "atlus": "",
        "blizzard_entertainment": "",
        "capcom": "",
        "cartoon_network": "",
        "cd_projekt_red": "",
        "dc": "",
        "dc_comics": "",
        "disney": "",
        "game_freak": "",
        "hasbro": "",
        "koikatsu": "",
        "konami": "",
        "marvel": "",
        "marvel_cinematic_universe": "",
        "midway": "",
        "milk_factory": "",
        "naughty_dog": "",
        "netherrealm_studios": "",
        "nickelodeon": "",
        "nintendo": "",
        "pixar": "",
        "popcap_games": "",
        "riot_games": "",
        "shounen_jump": "",
        "sony_interactive_entertainment": "",
        "square_enix": "",
        "ubisoft": "",
        "virtual_youtuber": "",
      },
      "character": {
        "ichinose_asuna": "asuna",
        "mina_ashido": "ashido_mina",
        "himiko_toga": "toga_himiko",
        "kara_zor-el": "kara_danvers",
        "kuririn": "krillin",
        "nemo_(pokemon)": "nemona",
        "usj_nomu": "nomu",
        "original_character": "oc",
        "sarada_uchiha": "uchiha_sarada",
        "power_girl": "",
        "anonymous_male": "",
        "supergirl": "",
      },
    }

    var known_tags = {
      "copyright": [
        "baldur's_gate",
        "cyberpunk",
        "danganronpa",
        "dead_or_alive",
        "dragon_ball",
        "final_fantasy",
        "fire_emblem",
        "hero_academia",
        "hololive",
        "jaiden",
        "tekken",
        "the_witcher",
        "mario",
        "monster_musume",
        "naruto",
        "pokemon",
        "rainbow_six",
        "rayman",
        "resident_evil",
        "spider-man",
        "street_fighter",
        "xenoblade",
      ],
      "character": [
        "supergirl",
      ],
    }

    var grouping_ratings = {
    }

    var icons = lib_icons; // eslint-disable-line
    var group_tags = lib_group_tags; // eslint-disable-line
    var lib_group_tags_icons = lib_group_tags_icons; // eslint-disable-line

    var group_tags_icons = {};
    group_tags_icons = mergeObj(lib_group_tags_icons.meta,group_tags_icons);
    group_tags_icons.evil = [group_tags.evil];
    group_tags_icons.hypno = [group_tags.hypno];
    group_tags_icons = mergeObj(lib_group_tags_icons.looks,group_tags_icons);
    group_tags_icons = mergeObj(lib_group_tags_icons.sexuality,group_tags_icons);
    group_tags_icons = mergeObj(lib_group_tags_icons.act,group_tags_icons);
    group_tags_icons = mergeObj(lib_group_tags_icons.position,group_tags_icons);
  // </------------------------------- Tags ------------------------------->

  // <------------------------------ Settings ----------------------------->
    var threshold = {
      "update": {
        "gallery": {
          "infos": 3600,
          "views": 54000,
        },
      },
    };
  // </----------------------------- Settings ----------------------------->
  var unknown = "unknown";
  var g_ = "g_";
  var formats = {
    "video": [".mp4"],
    "image": [".png", ".jpg", ".jpeg", ".gif"],
  }
  var style = {
    "flex": {
      "display": "flex",
      "justify-content": "center",
      "align-items": "center",
      "text-align": "center",
      "z-index": 2,
    },
    "absolute": {
      "position": "absolute",
      "text-align": "center",
      "z-index": 2,
    },
    "bw": {
      "background-color": "rgba(0,0,0,0.6)",
      "color": "#fff",
      "border-radius": "3px",
    }
  }
  var video_keys = ["duration"];
// </----------------------------- Global Var ----------------------------->

// <------------------------------ Unique Var ----------------------------->
  let r34 = {
    "prefix": "r34",
    "q": {
      "root_tags": "#tag-sidebar",
      "root_infos": "#stats",
      "tag": {
        "artist": "li.tag-type-artist.tag",
        "copyright": "li.tag-type-copyright.tag",
        "character": "li.tag-type-character.tag",
        "meta": "li.tag-type-metadata.tag",
        "general": "li.tag-type-general.tag",
      },
      "galleries": {
        "_": "#content",
        "gallery": {
          "_": "span.thumb[id]",
          "href": {"_": "a[id][href]"},
          "img": {"_": "img.preview[src]"},
        },
      },
      "gallery": {
        "_": "#content",
        "image": {"_": "#image"},
        "video": {"_": "#gelcomVideoPlayer"},
        "post": {"_": "#fit-to-screen"},
        "custom_main": {"_": "#status-notices"},
      },
    },
    "f": {
      "parseGalleryUrlToId": parseGalleryUrlToIdParam,
      "parseGalleryTagHtml": r34ParseGalleryTagHtml,
      "parseGalleryInfoHtml": r34ParseGalleryInfoHtml,
      "parseGalleryMetaHtml": r34ParseGalleryMetaHtml,
      "updateGalleryView": r34UpdateGalleryView,
    },
  }

  let r34_fav = {
    "prefix": "r34",
    "q": {
      "root_tags": "#tag-sidebar",
      "root_infos": "#stats",
      "tag": {
        "artist": "li.tag-type-artist.tag",
        "copyright": "li.tag-type-copyright.tag",
        "character": "li.tag-type-character.tag",
        "meta": "li.tag-type-metadata.tag",
        "general": "li.tag-type-general.tag",
      },
      "galleries": {
        "_": "#content",
        "gallery": {
          "_": "span.thumb",
          "href": {"_": "a[id][href]"},
          "img": {"_": "a[id][href]>img"},
        },
      },
      "gallery": {
        "_": "#content",
        "image": {"_": "#image"},
        "video": {"_": "#gelcomVideoPlayer"},
        "post": {"_": "#fit-to-screen"},
        "custom_main": {"_": "#status-notices"},
      },
    },
    "f": r34.f,
  }

  let danbooru = {
    "prefix": "danbooru",
    "q": {
      "root_tags": "#tag-list",
      "root_infos": "#post-information",
      "tag": {
        "artist": "ul.artist-tag-list > li",
        "copyright": "ul.copyright-tag-list > li",
        "character": "ul.character-tag-list > li",
        "meta": "ul.meta-tag-list > li",
        "general": "ul.general-tag-list > li",
      },
      "galleries": {
        "_": "#content",
        "gallery": {
          "_": "article.post-preview[id]",
          "href": {"_": "a.post-preview-link[href]"},
          "img": {"_": "img.post-preview-image[src]"},
        },
      },
      "gallery": {
        "_": "#content",
        "image": {"_": "#image"},
        "video": {"_": "#gelcomVideoPlayer"},
        "post": {"_": ".image-container"},
      },
    },
    "f": {
      "parseGalleryUrlToId": danbooruParseGalleryUrlToId,
      "parseGalleryTagHtml": danbooruParseGalleryTagHtml,
      "parseGalleryInfoHtml": danbooruParseGalleryInfoHtml,
      "parseGalleryMetaHtml": danbooruParseGalleryMetaHtml,
    },
  }
// </----------------------------- Unique Var ----------------------------->

// <----------------------------- Global Func ----------------------------->
  function parseGalleryUrlToIdPath(url,id="last") {
    let path_list = [];
    let temp_obj = url.pathname.split("/");
    for (let i = 0; i < temp_obj.length; i++) {
      if (temp_obj[i]!="") {
        path_list.push(temp_obj[i]);
      }
    }
    if (id=="last") {
      id = path_list.length-1;
    }
    return path_list[id];
  }
  function parseGalleryUrlToIdPath0(url,id=0) {
    return parseGalleryUrlToIdPath(url,id);
  }
  function parseGalleryUrlToIdPath1(url,id=1) {
    return parseGalleryUrlToIdPath(url,id);
  }
  function parseGalleryUrlToIdParam(url,id="id") {
    return url.searchParams.get(id);
  }
  function getMediaFormatFromURL(url) {
    let url_obj = new URL(url);
    let media_format = url_obj.pathname.substring(url_obj.pathname.lastIndexOf("."));
    return media_format;
  }
  function parseRating(rating) {
    rating = rating.toLowerCase();
    if (rating in grouping_ratings) {
      rating = grouping_ratings[rating];
    }
    return rating;
  }
  function formatVidDuration(t) {
    let d = new Date(t * 1000).toISOString().substr(11, 8);
    let s = d.slice(-2);
    let m = d.slice(0,-3);
    m = parseInt(m.slice(-2)).toString();
    m += ":";
    let h = d.slice(0,-6);
    h = parseInt(h).toString();
    if (h=="0") {
      h = "";
    } else {
      h += ":";
    }
    return h+m+s;
  }
  function formatResolution(res_str) {
    if (res_str.indexOf("x") > 0) {
      var res_obj = res_str.split("x");
      if (res_obj.length == 2) {
        var x = parseInt(res_obj[0]);
        var y = parseInt(res_obj[1]);
        if (isNumber(x) && isNumber(y)) {
          if (x>=10240 && y>=4320) {
            res_str = "10K";
          } else if (x>=7680 && y>=4320) {
            res_str = "8K";
          } else if (x>=3840 && y>=2160) {
            res_str = "4K";
          } else if (x>=2048 && y>=1080) {
            res_str = "2K";
          } else if (x>=1080 && y>=1080) {
            res_str = "FHD";
          } else if (x>=720 && y>=720) {
            res_str = "HD";
          } else if (x>=480 && y>=480) {
            res_str = "SD";
          } else {
            res_str = "LD";
          }
        }
      }
    }
    return res_str;
  }
  function generalParseGalleryMetasHtml(html, gallery, q) {
    gallery.metas = {};
    gallery.metas.media_type = unknown;
    gallery.metas.media_url = unknown;
    gallery.metas.media_format = unknown;
    let el_gallery = {};
    el_gallery.vid = getDOM(q.vid,{"el":html,"s":true});
    el_gallery.img = getDOM(q.img,{"el":html,"s":true});
    if (el_gallery.vid.exist) {
      gallery.metas.media_type = "video";
      gallery.metas.media_url = el_gallery.vid.el.src;
      gallery.metas.media_format = getMediaFormatFromURL(gallery.metas.media_url);
    } else if (el_gallery.img.exist) {
      gallery.metas.media_type = "image";
      gallery.metas.media_url = el_gallery.img.el.src;
      gallery.metas.media_format = getMediaFormatFromURL(gallery.metas.media_url);
    }
    return gallery;
  }
// </---------------------------- Global Func ----------------------------->

// <----------------------------- Unique Func ----------------------------->
  function r34ParseGalleryUrlToId(url) {
    return url.searchParams.get("id");
  }
  function r34ParseGalleryTagHtml(html) {
    let el = html.querySelectorAll("a[href]")[1]
    let url = new URL(el.href);
    let tag = url.searchParams.get("tags");
    return tag;
  }
  function r34ParseGalleryInfoHtml(html, gallery) {
    let el_list_li = html.querySelectorAll("ul>li");
    let temp_el;
    let temp_txt;
    let temp_obj;
    gallery.infos = {};
    gallery.infos.rating = unknown;
    gallery.infos.resolution = unknown;
    gallery.infos.score = unknown;
    gallery.infos.source = unknown;
    gallery.infos.timestamp = unknown;
    gallery.infos.uploader = unknown;
    for (let i = 0; i < el_list_li.length; i++) {
      let el_li = el_list_li[i];
      let el_txt = el_li.textContent;
      let el_txt_arr = el_txt.split(": ");
      if (el_txt_arr.length >= 0) {
        let el_txt_prefix = el_txt_arr[0];
        console.log(el_txt_prefix);
        if (el_txt_prefix.indexOf("Rating")>=0) {
          gallery.infos.rating = parseRating(el_txt_arr[1]);
        } else if (el_txt_prefix.indexOf("Size")>=0) {
          gallery.infos.resolution = el_txt_arr[1];
        } else if (el_txt_prefix.indexOf("Score")>=0) {
          gallery.infos.score = parseInt(el_li.querySelector("span").textContent);
        } else if (el_txt_prefix.indexOf("Source")>=0) {
          temp_el = el_li.querySelector("a");
          if (temp_el === null) {
            temp_txt = el_txt_arr[1];
          } else {
            temp_txt = el_li.querySelector("a").href;
            temp_obj = new URL(temp_txt);
            if (["twitter.com", "x.com"].indexOf(temp_obj.host)>=0) {
              temp_txt = temp_obj.origin + temp_obj.pathname;
            }
          }
          gallery.infos.source = temp_txt;
        } else if (el_txt_prefix=="\nPosted") {
          temp_txt = el_txt_arr[1].split("\n");
          gallery.infos.timestamp = temp_txt[0];
          temp_el = el_li.querySelector("a");
          if (temp_el === null) {
            temp_txt = unknown;
          } else {
            temp_txt = temp_el.textContent.trim();
          }
          gallery.infos.uploader = temp_txt;
        }
      }
    }
    return gallery;
  }
  function r34ParseGalleryMetaHtml(html, gallery) {
    gallery = generalParseGalleryMetasHtml(html, gallery, {"vid":"video > source", "img":"#image"});
    let el_gallery = {};
    el_gallery.link_list = getDOM("#post-view > .sidebar > .link-list > ul > li > a[href]",{"el":html,"s":true,"r":true});
    if (el_gallery.link_list.exist) {
      for (let i = 0; i < el_gallery.link_list.el.length; i++) {
        let el_a = el_gallery.link_list.el[i];
        if (el_a.textContent.indexOf("Original image") >= 0) {
          gallery.metas.media_url = el_a.href;
          gallery.metas.media_format = getMediaFormatFromURL(gallery.metas.media_url);
          for (let key in formats) {
            if (formats[key].indexOf(gallery.metas.media_format)>=0) {
              gallery.metas.media_type = key;
              break;
            }
          }
          break;
        }
      }
    }
    return gallery;
  }
  function r34UpdateGalleryView(self, gallery) {
    log({"updateGalleryView":gallery});
    // let self = this;
    // this.f.updateGalleryView(self, gallery, el_gallery);
    gallery.el.style.height = (self.style.gallery.height + 100).toString() + "px";
    let el_gallery_img = getDOM(self.q.galleries.gallery.img._,{"el":gallery.el}).el;
    el_gallery_img.style.maxHeight = self.style.gallery.height + "px";
    let el_caption = {};

    let temp_style = {
      "diplay": "flex",
      "position": "absolute",
      "flex-direction": "column",
      "justify-content": "center",
      "align-items": "center",
      "text-align": "center",
      "margin-top": "0px",
      "width": self.style.gallery.width + "px",
      "z-index": 2,
    }
    let temp_el = self.domGet("caption",gallery.id,{"el":gallery.el});
    if (temp_el.exist) {
      el_caption.root = temp_el.el;
    } else {
      el_caption.root = self.domCreate("caption",gallery.id,{"style":temp_style});
      gallery.el.append(el_caption.root);
    }
    el_caption = self.updateGalleryViewCaption(gallery, "tags", "copyright", el_caption);
    el_caption = self.updateGalleryViewCaption(gallery, "tags", "character", el_caption);
    el_caption = self.updateGalleryViewCaption(gallery, "tags", "artist", el_caption);
    el_caption = self.updateGalleryViewCaption(gallery, "infos", "score", el_caption);
    let el_gallery_media_resolution = self.updateGalleryViewMediaResolution(gallery);
    let el_gallery_media_format = self.updateGalleryViewMediaFormat(gallery);
  }
  function danbooruParseGalleryUrlToId(url) {
    let list_path = url.pathname.split("/");
    return list_path[2];
  }
  function danbooruParseGalleryTagHtml(html) {
    let el = html.querySelector("a.search-tag[href]");
    let url = new URL(el.href);
    let tag = url.searchParams.get("tags");
    return tag;
  }
  function danbooruParseGalleryInfoHtml(html, gallery) {
    let el_list_li = html.querySelectorAll("ul>li");
    gallery.infos = {};
    let temp_el;
    let temp_txt;
    let temp_value;
    let temp_obj;

    // rating
    temp_value = unknown;
    temp_obj = getDOM("#post-info-rating",{"el":html,"s":true});
    if (temp_obj.exist) {
      temp_obj = temp_obj.el.textContent.split(": ");
      temp_value = parseRating(temp_obj[1]);
    }
    gallery.infos.rating = temp_value;


    // resolution
    temp_value = unknown;
    temp_obj = getDOM("#post-info-size",{"el":html,"s":true});
    if (temp_obj.exist) {
      temp_txt = temp_obj.el.textContent;
      temp_value = temp_txt.substring(temp_txt.indexOf("(")+1,temp_txt.indexOf(")"));
    }
    gallery.infos.resolution = temp_value;

    // score
    temp_value = unknown;
    temp_obj = getDOM("#post-info-score",{"el":html,"s":true});
    if (temp_obj.exist) {
      temp_value = parseInt(temp_obj.el.querySelector(".post-score>a").innerText);
    }
    gallery.infos.score = temp_value;

    // source
    temp_value = unknown;
    temp_obj = getDOM("#post-info-source",{"el":html,"s":true});
    if (temp_obj.exist) {
      temp_el = getDOM("a",{"el":temp_obj.el,"s":true});
      if (temp_el.exist) {
        temp_value = temp_el.el.href;
      } else {
        temp_txt = temp_obj.el.textContent.split(": ");
        temp_value = temp_txt[1];
      }
    }
    gallery.infos.source = temp_value;

    // timestamp
    temp_value = unknown;
    temp_obj = getDOM(["#post-info-date","time"],{"el":html,"s":true});
    if (temp_obj.exist) {
      temp_obj = temp_obj.el.getAttribute("title");
      if (!(temp_obj===null)) {
        temp_obj = temp_obj.split(" ");
        temp_value = temp_obj[0]+" "+temp_obj[1];
      }
    }
    gallery.infos.timestamp = temp_value;

    // uploader
    temp_value = unknown;
    temp_obj = getDOM(["#post-info-uploader","a"],{"el":html,"s":true});
    if (temp_obj.exist) {
      temp_obj = temp_obj.el.getAttribute("data-user-name");
      if (!(temp_obj===null)) {
        temp_value = temp_obj;
      }
    }
    gallery.infos.uploader = temp_value;
    return gallery;
  }
  function danbooruParseGalleryMetaHtml(html, gallery) {
    gallery = generalParseGalleryMetasHtml(html, gallery, {"vid":"video#image", "img":"img#image"});
    let el_gallery = {};
    el_gallery.og = getDOM("#post-option-download > a",{"el":html,"s":true});
    if (el_gallery.og.exist) {
      gallery.metas.media_url = el_gallery.og.el.href;
      gallery.metas.media_format = getMediaFormatFromURL(gallery.metas.media_url);
      for (let key in formats) {
        if (formats[key].indexOf(gallery.metas.media_format)>=0) {
          gallery.metas.media_type = key;
          break;
        }
      }
    }
    return gallery;
  }
// </---------------------------- Unique Func ----------------------------->

class cMain {
  constructor(d) {
    this.data_keys = setDefaultValue(["infos","tags","metas"],d.data_keys);
    this.q = d.q;
    this.f = d.f;
    if (d.g_===undefined) {
      this.g_ = g_;
    }
    this.prefix = d.prefix;
    this.el = {};
    this.dom = {};
    this.dom.pre = "cdom";
    this.dom._ = "_";
  }
  domObjCreate(parents, child, el, id_list) {
    let id;
    if (isString(id_list)) {
      id_list = [id_list];
    }
    if (parents.length > 0) {
      let parent = parents[0];
      el = setObjDefaultValue({},parent,el);
      id_list.push(parent);
      id = id_list.join(this.dom._);
      el[parent] = setObjDefaultValue(id,"id",el[parent]);
      parents.shift()
      this.domObjCreate(parents, child, el[parent], id_list);
    } else {
      el = setObjDefaultValue({},child,el);
      id_list.push(child);
      id = id_list.join(this.dom._);
      el[child] = setObjDefaultValue(id,"id",el[child]);
    }
    id = id_list.join(this.dom._);
    return id;
  }
  domCreate(id, parents=[], opt={}) {
    opt = setObjDefaultValue("div","tagName",opt);
    if (isString(parents)) {
      parents = [parents];
    }
    if (isArray(id)) {
      id = id.join(this.dom._);
    }
    let el = document.createElement(opt.tagName);
    if ("style" in opt) {
      if (!(isArray(opt.style))) {
        opt.style = [opt.style];
      }
      for (var i = 0; i < opt.style.length; i++) {
        for (let key in opt.style[i]) {
          el.style[key] = opt.style[i][key];
        }
      }
    }
    el.id = this.domObjCreate(parents,id,this.dom,"#"+this.dom.pre).substring(1);

    return el;
  }
  domObjGet(parents, child, obj) {
    if (parents.length > 0) {
      if (parents[0] in obj) {
        obj = obj[parents[0]];
        parents.shift();
        this.domObjGet(parents, child, obj);
      } else {
        obj = false;
      }
    } else {
      if (child in obj) {
        if ("id" in obj[child]) {
          obj = obj[child].id;
        } else {
          obj = false;
        }
      } else {
        obj = false;
      }
    }
    return obj
  }
  domGet(id, parents=[], opt={}) {
    if (isString(parents)) {
      parents = [parents];
    }
    if (isArray(id)) {
      id = id.join(this.dom._);
    }
    let id_list = ["#"+this.dom.pre].concat(parents);
    id_list.push(id);
    return getDOM(id_list.join(this.dom._),opt);
  }
  checkLastUpdateWithinThreshold(last_update,threshold=86400) {
    return (Math.floor((Date.now() / 1000) - last_update) < threshold);
  }
  checkGalleryDB(gallery) {
    let db_id = this.g_ + gallery.id;
    let data_db = window.localStorage.getItem(db_id);
    let db_valid = false;
    if (!(data_db===null)) {
      data_db = JSON.parse(data_db);
      let list_db_valid = [];
      for (var i = 0; i < this.data_keys.length; i++) {
        list_db_valid.push(this.data_keys[i] in data_db);
      }
      if (list_db_valid.indexOf(false)===-1) {
        if ("last_update" in data_db.metas) {
          db_valid = this.checkLastUpdateWithinThreshold(data_db.metas.last_update,threshold.update.gallery.infos);
        }
      }
    }
    return db_valid;
  }
  checkGalleryVideoData(gallery) {
    var data_video_valid = [];
    if ("metas" in gallery) {
      if ("media_type" in gallery.metas) {
        if ("media_format" in gallery.metas) {
          if (gallery.metas.media_type=="video") {
            for (var i = 0; i < video_keys.length; i++) {
              data_video_valid.push(video_keys[i] in gallery.metas);
            }
          }
        }
      }
    }
    return data_video_valid.indexOf(false)===-1;
  }
  readGalleryDB(gallery) {
    let db_id = this.g_ + gallery.id;
    let data_db = window.localStorage.getItem(db_id);
    if (!(data_db===null)) {
      data_db = JSON.parse(data_db);
      gallery = mergeObj(data_db,gallery);
    }
    gallery = this.getDisplayTags(gallery);
    return gallery;
  }
  formatGalleryToDataDB(gallery,data_db) {
    for (var i = 0; i < this.data_keys.length; i++) {
      data_db = addObjIfExist(this.data_keys[i],data_db,gallery);
    }
    return data_db;
  }
  updateGalleryDB(gallery) {
    let db_id = this.g_ + gallery.id;
    gallery.metas.last_update = Math.floor(new Date().getTime() / 1000);
    let data_db = this.formatGalleryToDataDB(gallery,{});
    if (!(isObjectEmpty(data_db))) {
      window.localStorage.setItem(db_id, JSON.stringify(data_db));
    }
  }
  updateGalleriesEntries() {
    this.el.galleries_main = document.querySelector(this.q.galleries._);
    this.galleries = this.initGalleriesData();
  }
  initGalleryData(url) {
    url = new URL(url);
    let id = this.f.parseGalleryUrlToId(url);
    let gallery = {};
    gallery.id = id;
    gallery.url = url.href;
    gallery = this.readGalleryDB(gallery);
    return gallery;
  }
  initGalleriesData() {
    let galleries = []
    let el_galleries = Array.from(this.el.galleries_main.querySelectorAll(this.q.galleries.gallery._));
    for (let i = 0; i < el_galleries.length; i++) {
      let el_gallery = el_galleries[i];
      let el_gallery_href = el_gallery.querySelector(this.q.galleries.gallery.href._);
      let gallery = this.initGalleryData(el_gallery_href.href);
      gallery.el = el_gallery;
      galleries.push(gallery);
    }
    return galleries;
  }
  getGalleriesData(galleries, fail_count=0) {
    if (galleries.length > 0) {
      let gallery = galleries[0];
      if (this.checkGalleryDB(gallery)) {
        this.rerunGetGalleriesData(galleries);
      } else {
        log("getGalleriesData id: "+gallery.id);
        let xhr = new XMLHttpRequest();
        let request_url = gallery.url;
        let self = this;
        xhr.onreadystatechange = () => {
          if (xhr.readyState == 4) {
            gallery = this.parseGalleryHtml(strToHtml(readBody(xhr)), gallery);
            this.updateGalleryDB(gallery);
            this.rerunGetGalleriesData(galleries);
          }
        };
        xhr.open("GET", request_url, true);
        xhr.onerror = function (e) {
          if (fail_count <= 5) {
            self.getGalleriesData(galleries, fail_count+1);
          } else {
            log("Fail more than 5, url: " + request_url, 0)
          }
        };
        xhr.send(null);
      }
    } else {
      this.updateGalleriesEntries();
      this.getGalleriesVideoData(this.galleries);
    }
  }
  rerunGetGalleriesData(galleries) {
    this.updateGalleryView(galleries[0]);
    galleries.shift();
    this.getGalleriesData(galleries);
  }
  getGalleriesVideoData(galleries) {
    if (galleries.length > 0) {
      let gallery = galleries[0];
      if (gallery.metas.media_type=="video") {
        if (this.checkGalleryVideoData(gallery)) {
          this.rerunGetGalleriesVideoData(galleries);
        } else {
          log("getGalleriesVideoData id: "+gallery.id);
          let el_video = document.createElement('video');
          el_video.src = gallery.metas.media_url;
          let self = this;
          let loop_checkDuration = setInterval(function() {
            log("loop_checkDuration, id:"+gallery.id+", duration:"+el_video.duration,7);
            if (isNumber(el_video.duration)) {
              clearInterval(loop_checkDuration);
              gallery.metas.duration = Math.round(el_video.duration);
              self.updateGalleryDB(gallery);
              self.rerunGetGalleriesVideoData(galleries);
            }
          }, 2000);
        }
      } else {
        this.rerunGetGalleriesVideoData(galleries);
      }
    } else {
      this.updateGalleriesEntries();
      console.log(this);
      console.log("done");
    }
  }
  rerunGetGalleriesVideoData(galleries) {
    this.updateGalleryView(galleries[0]);
    galleries.shift();
    this.getGalleriesVideoData(galleries);
  }
  parseGalleryTagHtml(html, gallery) {
    let el_root_tags = html.querySelector(this.q.root_tags);
    let el_tags = {};
    gallery.tags = {};
    for (let tag_type in this.q.tag) {
      el_tags = el_root_tags.querySelectorAll(this.q.tag[tag_type]);
      gallery.tags[tag_type] = [];
      for (let i = 0; i < el_tags.length; i++) {
        let el_tag = el_tags[i];
        let tag = htmlDecode(this.f.parseGalleryTagHtml(el_tag));
        gallery.tags[tag_type].push(tag);
      }
    }
    return gallery;
  }
  parseGalleryInfoHtml(html, gallery) {
    let el_root_infos = html.querySelector(this.q.root_infos);
    gallery = this.f.parseGalleryInfoHtml(el_root_infos, gallery);
    for (let key in gallery.infos) {
      if (key=="source") {
        continue;
      }
      if (gallery.infos[key]==unknown) {
        log("ERR::parse id: "+gallery.id+" gallery.infos."+key);
      }
    }
    if (gallery.infos.score==unknown) {
      gallery.infos.score = 0;
    }
    if (gallery.infos.timestamp==unknown) {
      gallery.infos.timestamp = "1970-01-01 00:00:01";
    }
    return gallery;
  }
  parseGalleryMetaHtml(html, gallery) {
    gallery = this.f.parseGalleryMetaHtml(html, gallery);
    for (let key in gallery.metas) {
      if (gallery.metas[key]==unknown) {
        log("ERR::parse id: "+gallery.id+" gallery.metas."+key);
      }
    }
    return gallery;
  }
  parseGalleryHtml(html, gallery) {
    gallery = this.parseGalleryTagHtml(html, gallery);
    gallery = this.parseGalleryInfoHtml(html, gallery);
    gallery = this.parseGalleryMetaHtml(html, gallery);
    gallery = this.getDisplayTags(gallery);
    gallery.metas.last_update = Math.floor(new Date().getTime() / 1000);
    return gallery;
  }
  getDisplayTags(gallery) {
    let display_tags = {};
    let grouped_tags = {};
    for (let key in gallery.tags) {
      let tag_list = gallery.tags[key];
      display_tags[key] = [];
      grouped_tags[key] = [];
      let str_len = 0;
      for (var i = 0; i < tag_list.length; i++) {
        let tag = tag_list[i];
        if (key in known_tags) {
          for (var ii = 0; ii < known_tags[key].length; ii++) {
            let known_tag = known_tags[key][ii];
            if (tag.indexOf(known_tag)>=0) {
              tag = known_tag;
            }
          }
        }
        if (key in grouping_tags) {
          if (tag in grouping_tags[key]) {
            tag = grouping_tags[key][tag];
          }
        }
        if (key=="artist" && tag.indexOf("_(artist)") >= 0) {
          tag = tag.substring(0, tag.indexOf("_(artist)"));
        }
        if (key=="copyright" && tag.indexOf("_(series)") >= 0) {
          tag = tag.substring(0, tag.indexOf("_(series)"));
        }
        if (key=="character" && tag.indexOf("_(") >= 0) {
          tag = tag.substring(0, tag.indexOf("_("));
        }
        if (grouped_tags[key].indexOf(tag) === -1 && tag != "") {
          str_len += tag.length;
          grouped_tags[key].push(tag)
          if (str_len <= 45) {
            display_tags[key].push(tag);
          } else {
            if (display_tags[key].indexOf("...") === -1) {
              display_tags[key].push("...");
            }
          }
        }
      }
    }
    gallery.display_tags = display_tags
    gallery.grouped_tags = grouped_tags;
    return gallery;
  }
  updateGalleryTagCaption(gallery, tag_type, el_caption) {
    if (gallery.tags[tag_type].length > 0) {
      let temp_el = this.getEl("div", this.k.caption.pre + tag_type, el_caption.root);
      if (temp_el.exist) {
        el_caption[tag_type] = temp_el.el;
      } else {
        el_caption[tag_type] = this.createEl("div", this.k.caption.pre + tag_type);
        el_caption.root.append(el_caption[tag_type]);
      }
      let tags = [];
      let display_tags = [];
      let str_len = 0;
      for (let i = 0; i < gallery.tags[tag_type].length; i++) {
        let tag = gallery.tags[tag_type][i];
        if (tag in grouping_tags[tag_type]) {
          tag = grouping_tags[tag_type][tag];
        }
        if (tag_type=="copyright" && tag.indexOf("_(series)") >= 0) {
          tag = tag.substring(0, tag.indexOf("_(series)"));
        }
        if (tag_type=="artist" && tag.indexOf("_(artist)") >= 0) {
          tag = tag.substring(0, tag.indexOf("_(artist)"));
        }
        if (tag_type=="character" && tag.indexOf("_(") >= 0) {
          tag = tag.substring(0, tag.indexOf("_("));
        }
        if (tags.indexOf(tag) === -1 && tag != "") {
          str_len += tag.length;
          tags.push(tag);
          if (str_len <= 40) {
            display_tags.push(tag);
          } else {
            if (display_tags.indexOf("...") === -1) {
              display_tags.push("...");
            }
          }
        }
      }
      let tag_str = display_tags.join(", ");
      if (!("g_tags" in gallery)) {
        gallery.g_tags = {};
      }
      gallery.g_tags[tag_type] = tags;
      el_caption[tag_type].innerHTML = "";
      el_caption[tag_type].appendChild(document.createTextNode(tag_str));
      el_caption[tag_type].style.borderBottom = "1px solid black";
    }
    return el_caption;
  }
  updateGalleryViewCaption(data, data_type, data_key, el_caption) {
    if (data_type in data) {
      if (data_key in data[data_type]) {
        let text_value = data[data_type][data_key];
        let caption_str;
        if (data_type=="tags") {
          caption_str = data.display_tags[data_key].join(", ");
        } else {
          caption_str = titleCase([data_key, text_value].join(": "));
        }
        let temp_el = this.domGet(data_key,[data.id,"caption",data_type],{"el":el_caption.root});
        if (temp_el.exist) {
          el_caption[data_key] = temp_el.el;
        } else {
          el_caption[data_key] = this.domCreate(data_key,[data.id,"caption",data_type]);
          if (caption_str.length>0) {
            el_caption.root.append(el_caption[data_key]);
          }
        }
        if (data_type=="tags") {
          el_caption[data_key].style.borderBottom = "1px solid black";
          el_caption[data_key].style.width = "100%";
        }
        el_caption[data_key].innerHTML = "";
        el_caption[data_key].appendChild(document.createTextNode(caption_str));
      }
    }
    return el_caption;
  }
  updateGalleryViewMediaResolution(gallery) {
    let el_gallery_media_format;
    if ("metas" in gallery) {
      if ("media_type" in gallery.metas) {
        if ("media_format" in gallery.metas) {
          if ("resolution" in gallery.infos) {
            let media_format_str = formatResolution(gallery.infos.resolution);
            let temp_el = this.domGet("resolution",[gallery.id,"media"],{"el":gallery.el});
            let el_image = getDOM(this.q.galleries.gallery.img._,{"el":gallery.el}).el;
            if (temp_el.exist) {
              el_gallery_media_format = temp_el.el;
            } else {
              el_gallery_media_format = this.domCreate("resolution",[gallery.id,"media"],{"style":[style.flex,style.absolute,style.bw]});
              el_image.parentElement.insertBefore(el_gallery_media_format, el_image.parentElement.firstChild);
            }
            el_gallery_media_format.innerHTML = media_format_str;
            let gallery_client = gallery.el.getBoundingClientRect();
            let image_client = el_image.getBoundingClientRect();
            let el_gallery_media_format_client = el_gallery_media_format.getBoundingClientRect();
            // console.log({"gallery":gallery.el, "img":el_image, "media_format":el_gallery_media_format});
            el_gallery_media_format.style.fontWeight = "bold";
            el_gallery_media_format.style.marginTop = "5px";
            el_gallery_media_format.style.marginLeft = (((gallery_client.width - image_client.width) / 2) + image_client.width - el_gallery_media_format_client.width-2).toString() + "px";
          }
        }
      }
    }
    return el_gallery_media_format;
  }
  updateGalleryViewMediaFormat(gallery) {
    let el_gallery_media_format;
    if ("metas" in gallery) {
      if ("media_type" in gallery.metas) {
        if ("media_format" in gallery.metas) {
          let media_format_str = gallery.metas.media_format.substring(1);
          if (gallery.metas.media_type=="video") {
            if ("duration" in gallery.metas) {
              media_format_str = formatVidDuration(gallery.metas.duration);
            }
          }
          let temp_el = this.domGet("format",[gallery.id,"media"],{"el":gallery.el});
          let el_image = getDOM(this.q.galleries.gallery.img._,{"el":gallery.el}).el;
          if (temp_el.exist) {
            el_gallery_media_format = temp_el.el;
          } else {
            el_gallery_media_format = this.domCreate("format",[gallery.id,"media"],{"style":[style.flex,style.absolute,style.bw]});
            el_image.parentElement.insertBefore(el_gallery_media_format, el_image.parentElement.firstChild);
          }
          el_gallery_media_format.innerHTML = media_format_str;
          let gallery_client = gallery.el.getBoundingClientRect();
          let image_client = el_image.getBoundingClientRect();
          let el_gallery_media_format_client = el_gallery_media_format.getBoundingClientRect();
          el_gallery_media_format.style.marginTop = (image_client.height - el_gallery_media_format_client.height-5).toString() + "px";
          el_gallery_media_format.style.marginLeft = (((gallery_client.width - image_client.width) / 2) + image_client.width - el_gallery_media_format_client.width-2).toString() + "px";
        }
      }
    }
    return el_gallery_media_format;
  }
  createTagIcons(tag,gallery,el_gallery_media_tags) {
    let el_gallery_media_tags_tag;
    let temp_el = this.domGet(tag,[gallery.id,"media","tags"],{"el":el_gallery_media_tags,"s":true});
    if (temp_el.exist) {
      el_gallery_media_tags_tag = temp_el.el;
    } else {
      el_gallery_media_tags_tag = this.domCreate(tag,[gallery.id,"media","tags"],{"style":style.bw,"tagName":"span"});
      el_gallery_media_tags.append(el_gallery_media_tags_tag);
    }
    el_gallery_media_tags_tag.style.margin = "0px 2px 0px 2px";
    el_gallery_media_tags_tag.style.position = "";
    el_gallery_media_tags_tag.innerHTML = "<img src=\""+icons[tag]+"\" height=\"20px\">";
    return el_gallery_media_tags_tag;
  }
  getValidTags(group_tags,gallery) {
    let tags_valid = [];
    for (let i = 0; i < group_tags.length; i++) {
      let group_tag = group_tags[i];
      let tag_valid = false;
      for (let ii = 0; ii < group_tag.length; ii++) {
        let tag = group_tag[ii];
        if (gallery.tags.general.indexOf(tag)>=0) {
          tag_valid = true;
        }
      }
      tags_valid.push(tag_valid);
    }
    return tags_valid;
  }
  updateGalleryViewMediaTags(gallery) {
    let el_gallery_media_tags;
    if ("general" in gallery.tags) {
      let temp_el = this.domGet("tags",[gallery.id,"media"],{"el":gallery.el,"s":true});
      let el_image = getDOM(this.q.galleries.gallery.img._,{"el":gallery.el}).el;
      let gallery_client = gallery.el.getBoundingClientRect();
      let image_client = el_image.getBoundingClientRect();
      if (temp_el.exist) {
        el_gallery_media_tags = temp_el.el;
      } else {
        el_gallery_media_tags = this.domCreate("tags",[gallery.id,"media"],{"style":[style.absolute,style.flex]});
        el_gallery_media_tags.style.flexWrap = "wrap";
        el_gallery_media_tags.style.maxWidth = (image_client.width-40).toString()+"px";
        el_gallery_media_tags.style.justifyContent = "";
        el_image.parentElement.insertBefore(el_gallery_media_tags, el_image.parentElement.firstChild);
      }
      let no_sound_valid = false;
      for (let i = 0; i < group_tags.no_sound.length; i++) {
        let tag = group_tags.no_sound[i];
        if (gallery.tags.meta.indexOf(tag)>=0) {
          no_sound_valid = true;
        }
      }
      if (no_sound_valid) {
        this.createTagIcons("no_sound",gallery,el_gallery_media_tags);
      }

      for (let key in group_tags_icons) {
        let group_tags = group_tags_icons[key];
        if (isArray(group_tags)) {
          group_tags = {"q":group_tags};
        }
        let tag_valid = this.getValidTags(group_tags.q,gallery);
        let tag_invalid = [];
        if ("pre" in group_tags) {
          tag_invalid = this.getValidTags(group_tags.pre,gallery);
        }
        if (tag_valid.indexOf(false)===-1 && (tag_invalid.length==0 || !(tag_invalid.indexOf(false)===-1))) {
          this.createTagIcons(key,gallery,el_gallery_media_tags);
        }
      }
      el_gallery_media_tags.style.marginTop = "5px";
      el_gallery_media_tags.style.marginLeft = (((gallery_client.width - image_client.width) / 2) + 5).toString() + "px";
    }
  }
  updateGalleryViewMediaViews(gallery) {
    let el_gallery_media_views;
    let temp_el = this.domGet("views",[gallery.id,"media"],{"el":gallery.el});
    let el_image = getDOM(this.q.galleries.gallery.img._,{"el":gallery.el}).el;
    if (temp_el.exist) {
      el_gallery_media_views = temp_el.el;
    } else {
      el_gallery_media_views = this.domCreate("views",[gallery.id,"media"],{"style":[style.flex,style.absolute,style.bw]});
      el_image.parentElement.insertBefore(el_gallery_media_views, el_image.parentElement.firstChild);
    }
    let views = 0;
    if ("views" in gallery.metas) {
      views = gallery.metas.views;
    }
    el_gallery_media_views.innerHTML = "views: "+views.toString();
    let gallery_client = gallery.el.getBoundingClientRect();
      console.log(el_image);
    let image_client = el_image.getBoundingClientRect();
    let el_gallery_media_views_client = el_gallery_media_views.getBoundingClientRect();
    el_gallery_media_views.style.marginLeft = (((gallery_client.width - image_client.width) / 2) + 5).toString() + "px";
    el_gallery_media_views.style.marginTop = (image_client.height - el_gallery_media_views_client.height-5).toString() + "px";
  }
  updateGalleryView(gallery) {
    let self = this;
    // this.f.updateGalleryView(self,gallery);

    // log({"updateGalleryView":gallery});
    // let self = this;
    // this.f.updateGalleryView(self, gallery, el_gallery);
    gallery.el.style.display = "block";
    gallery.el.style.height = (this.style.gallery.height + 100).toString() + "px";
    let el_gallery_img = getDOM(this.q.galleries.gallery.img._,{"el":gallery.el}).el;
    el_gallery_img.style.maxHeight = this.style.gallery.height + "px";
    let el_caption = {};

    let temp_el = this.domGet("caption",gallery.id,{"el":gallery.el});
    if (temp_el.exist) {
      el_caption.root = temp_el.el;
    } else {
      el_caption.root = this.domCreate("caption",gallery.id,{"style":style.basic});
      gallery.el.append(el_caption.root);
    }
    el_caption.root.style.width = this.style.gallery.width + "px";
    el_caption = this.updateGalleryViewCaption(gallery, "tags", "copyright", el_caption);
    el_caption = this.updateGalleryViewCaption(gallery, "tags", "character", el_caption);
    el_caption = this.updateGalleryViewCaption(gallery, "tags", "artist", el_caption);
    el_caption = this.updateGalleryViewCaption(gallery, "infos", "score", el_caption);
    this.updateGalleryViewMediaResolution(gallery);
    this.updateGalleryViewMediaFormat(gallery);
    this.updateGalleryViewMediaTags(gallery);
    this.updateGalleryViewMediaViews(gallery);
  }
  updateGalleriesView() {
    this.updateGalleriesEntries();
    for (let i = 0; i < this.galleries.length; i++) {
      this.updateGalleryView(this.galleries[i]);
    }
  }
}

class cGalleries extends cMain{
  constructor(d) {
    super(d);
    this.init();
  }
  init() {
    console.log("init: " + this.prefix);
    this.updateGalleriesEntries();
    this.style = {}
    this.style.gallery = this.galleries[0].el.getBoundingClientRect();
    this.getGalleriesData(this.galleries);
  }
}

class cGallery extends cMain{
  constructor(d) {
    super(d);
    this.init();
  }
  init() {
    log("init: " + this.prefix);
    this.gallery = this.initGalleryData(window.location.href);
    this.gallery = this.parseGalleryHtml((document.body), this.gallery);
    let data_db = this.readGalleryDB(this.gallery);
    let last_visit = 0;
    if ("metas" in data_db) {
      if ("last_visit" in data_db.metas) {
        last_visit = data_db.metas.last_visit;
        this.gallery.metas.last_visit = last_visit;
      }
      if ("views" in data_db.metas) {
        this.gallery.metas.views = data_db.metas.views;
      }
    }
    if (!(this.checkLastUpdateWithinThreshold(last_visit,threshold.update.gallery.views))) {
      if ("views" in data_db.metas) {
        this.gallery.metas.views = parseInt(this.gallery.metas.views)+1;
      } else {
        this.gallery.metas.views = 1;
      }
      this.gallery.metas.last_visit = Math.floor(new Date().getTime() / 1000);
    }
    if (!("views" in this.gallery.metas)) {
      this.gallery.metas.views = 1;
    }
    this.updateGalleryDB(this.gallery);
    this.updateView();
    console.log("done");
    console.log(this);
  }
  updateView() {
    console.log(this.q.gallery);
    let el_gallery_media_tags = document.querySelector("h4.image-sublinks");
    for (let key in group_tags_icons) {
      let group_tags = group_tags_icons[key];
      if (isArray(group_tags)) {
        group_tags = {"q":group_tags};
      }
      let tag_valid = this.getValidTags(group_tags.q,this.gallery);
      let tag_invalid = [];
      if ("pre" in group_tags) {
        tag_invalid = this.getValidTags(group_tags.pre,this.gallery);
      }
      if (tag_valid.indexOf(false)===-1 && (tag_invalid.length==0 || !(tag_invalid.indexOf(false)===-1))) {
        this.createTagIcons(key,this.gallery,el_gallery_media_tags);
      }
    }
    let el_gallery = getDOM(this.q.gallery[this.gallery.metas.media_type]._);
    if (el_gallery.exist) {
      el_gallery.el.style.maxHeight = "95vh";
      el_gallery.el.style.maxWidth = "95vw";
      if (this.gallery.metas.media_type=="video") {
        let el_video = el_gallery.el;
        let self = this;
        let loop_checkDuration = setInterval(function() {
          log("loop_checkDuration, id:"+self.gallery.id+", duration:"+el_video.duration,7);
          if (isNumber(el_video.duration)) {
            clearInterval(loop_checkDuration);
            self.gallery.metas.duration = Math.round(el_video.duration);
            el_video.volume = 1;
            self.updateGalleryDB(self.gallery);
          }
        }, 1000);
      }
      window.scrollTo(0,window.pageYOffset + el_gallery.el.getBoundingClientRect().top - 2);
    } else {
      let tagName = this.gallery.metas.media_type;
      if (tagName=="image") {
        tagName = "img";
      }
      let el_custom_media = this.domCreate("media",this.gallery.id,{"tagName":tagName});
      let el_custom_main = getDOM(this.q.gallery.custom_main._).el;
      el_custom_media.src = this.gallery.metas.media_url;
      if (this.gallery.metas.media_type=="video") {
        el_custom_media.controls = true;
      }
      el_custom_media.style.maxHeight = "95vh";
      el_custom_media.style.maxWidth = "95vh";
      el_custom_main.append(el_custom_media);
    }
    // let el_vid = document.querySelector(q_vid);
    // let el_img = document.querySelector(q_img_v);

    // if (el_vid != null) {
    //     el_vid.style.maxHeight = "95vh";
    //     el_vid.style.maxWidth = "95vw";

    //     el_vid.parentElement.style.maxHeight = "95vh";
    //     el_vid.parentElement.style.maxWidth = "95vw";
  }
}


function initGalleries(d) {
  let el_galleries_main;
  let galleries_class;
  let processGalleries = function() {
    galleries_class = new cGalleries(d);
    var override_styles = `
    .thumb a {
    display: block;
    max-height: 200px; 
}
`

    var styleSheet = document.createElement("style");
    styleSheet.textContent = override_styles;
    document.head.appendChild(styleSheet);
  }
  let checkGalleries = function() {
    el_galleries_main = getDOM(d.q.galleries._).el;
    waitDOM({"q":d.q.galleries.gallery._,"r":true,"el":el_galleries_main}, processGalleries);
  }
  waitDOM(d.q.galleries._, checkGalleries);
}

function initGallery(d) {
  let el_gallery_main;
  let gallery_class;
  let processGallery = function() {
    gallery_class = new cGallery(d);
  }
  let checkGallery = function() {
    el_gallery_main = getDOM(d.q.gallery._).el;
    waitDOM({"q":d.q.gallery.post._,"r":true,"el":el_gallery_main}, processGallery);
  }
  waitDOM(d.q.gallery._, checkGallery);
}


(function() {
  'use strict';

  var url_obj = new URL(window.location.href);
  if (["rule34.xxx", "xbooru.com"].indexOf(url_obj.host) >= 0) {
    url_obj.page = url_obj.searchParams.get("page");
    url_obj.s = url_obj.searchParams.get("s");
    if (url_obj.page == "post") {
      if (url_obj.s == "list") {
        initGalleries(r34);
      } else if (url_obj.s == "view") {
          console.log("test");
        initGallery(r34);
        // initChangeVideo();
      }
    } else if (url_obj.page == "favorites") {
      if (url_obj.s == "view") {
        initGalleries(r34_fav);
      }
    }
  } else if (url_obj.host == "danbooru.donmai.us") {
    if (url_obj.pathname == "/" || url_obj.pathname == "/posts") {
      initGalleries(danbooru);
    }
  }
})();