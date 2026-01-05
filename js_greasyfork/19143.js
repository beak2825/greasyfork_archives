// ==UserScript==
// @name          ripvocab
// @namespace     http:/penple.org/
// @description	  kills vocab.com
// @include       *
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/19143/ripvocab.user.js
// @updateURL https://update.greasyfork.org/scripts/19143/ripvocab.meta.js
// ==/UserScript==

Module = (function() {
    (window.console || (window.console = {
        log: function() {}
    }));
    window.modules = {};
    var modules = {};
    var deferred = [];
    var isIE = !!(window.attachEvent && !window.opera);
    var isOpera = !!window.opera;
    var STATE_INIT = 0,
        STATE_LOADING = 1,
        STATE_LOADED = 2,
        STATE_INVOKING = 3,
        STATE_READY = 4;
    var cssLoadSupport = (function() {
        var isSafari5 = (!!navigator.userAgent.match(" Safari/") && !navigator.userAgent.match(" Chrom") && !!navigator.userAgent.match(" Version/5."));
        if (isSafari5) {
            return false
        }
        var match = navigator.userAgent.match(/\ AppleWebKit\/(\d+)\.(\d+)/);
        if (match) {
            match.shift();
            var major = +match[0],
                minor = +match[1];
            if (major < 535 || major == 535 && minor < 23) {
                return false
            }
        }
        return true
    })();

    function moduleFor(name) {
        return modules[name] || (modules[name] = {
            name: name,
            data: {},
            state: STATE_INIT
        })
    }

    function status() {
        for (var m in modules) {
            console.log(m, modules[m].state)
        }
    }

    function define(packageName, depends, definition) {
        if (arguments.length == 2 && typeof depends == "function") {
            definition = depends;
            depends = []
        }
        var mod = moduleFor(packageName);
        if (mod.state < STATE_LOADED) {
            mod.state = STATE_LOADED;
            mod.depends = depends;
            mod.load = function() {
                delete mod.load;
                if (mod.state < STATE_INVOKING) {
                    mod.state = STATE_INVOKING;
                    after(depends, function() {
                        if (mod.state < STATE_READY) {
                            link(mod.name, mod.data);
                            var data = definition.call(mod.data, mod.data);
                            if (data) {
                                link(mod.name, data)
                            }
                            mod.state = STATE_READY;
                            runDeferred()
                        }
                    })
                }
            };
            runDeferred()
        }
    }

    function runDeferred() {
        var toCall = [];
        for (var i = 0; i < deferred.length; i++) {
            var deps = unsatisfied(deferred[i].depends);
            for (var d = 0; d < deps.length; d++) {
                var mod = modules[deps[d]];
                if (mod && mod.load) {
                    mod.load()
                }
            }
            if (!deps.length) {
                if (deferred[i].fn) {
                    toCall.push(deferred[i].fn)
                }
                deferred.splice(i, 1);
                i--
            }
        }
        for (var i = 0; i < toCall.length; i++) {
            toCall[i]()
        }
    }

    function unsatisfied(deps, level) {
        if (level == undefined) {
            level = STATE_READY
        }
        var usd = [];
        for (var i = 0; i < deps.length; i++) {
            var mod = modules[deps[i]];
            if (!mod || mod.state < level) {
                usd.push(deps[i])
            }
        }
        return usd
    }

    function after(depends, fn) {
        if (typeof depends == "string") {
            depends = [depends]
        }
        var depends = unsatisfied(depends);
        if (depends.length) {
            deferred.push({
                depends: depends,
                fn: fn
            });
            load.apply(window, unsatisfied(depends, STATE_LOADING));
            runDeferred()
        } else {
            if (fn) {
                fn.call(window)
            }
        }
    }

    function use(mnames, scope) {
        if (typeof mnames == "string") {
            mnames = [mnames]
        }
        if (!scope) {
            scope = window
        }
        after(mnames, function() {
            for (var m = 0; m < mnames.length; m++) {
                var mod = modules[mnames[m]];
                if (mod && mod.data) {
                    for (var i in mod.data) {
                        scope[i] = mod.data[i]
                    }
                }
            }
        })
    }

    function load() {
        for (var i = 0; i < arguments.length; i++) {
            var mname = arguments[i];
            if (!mname) {
                continue
            }
            if (Module.aliases && Module.aliases[mname]) {
                mname = Module.aliases[mname]
            }
            var type = "js";
            if (mname.match(/\.css$/i)) {
                type = "css"
            } else {
                if (mname.match(/\.js$/i)) {
                    mname = mname.substring(0, mname.length - 3)
                }
            }
            var pkg = moduleFor(mname);
            if (pkg.state < STATE_LOADING) {
                pkg.state = STATE_LOADING;
                if (type == "js") {
                    loadJs(getResource(Module.base + mname + ".js"))
                } else {
                    if (type == "css") {
                        loadCss(getResource(Module.base + mname), pkg)
                    }
                }
            }
        }
    }

    function loadJs(src) {
        if (!document.body) {
            document.write('<script src="' + src + '" type="text/javascript"><\/script>')
        } else {
            var head = document.getElementsByTagName("head")[0];
            var scriptObj = document.createElement("script");
            scriptObj.type = "text/javascript";
            scriptObj.async = true;
            scriptObj.src = src;
            head.appendChild(scriptObj)
        }
    }

    function loadCss(src, pkg) {
        var loaded = function() {
            if (pkg.state < STATE_READY) {
                pkg.state = STATE_READY;
                runDeferred()
            }
        };
        if (!document.body) {
            document.write('<link rel="stylesheet" type="text/css" href="' + src + '" />');
            loaded()
        } else {
            var head = document.getElementsByTagName("head")[0];
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = src;
            link.media = "all";
            if (cssLoadSupport && "addEventListener" in link && "onload" in link) {
                link.addEventListener("load", loaded)
            } else {
                if (isIE) {
                    link.onreadystatechange = function() {
                        if (/loaded|complete/.test(this.readyState)) {
                            loaded()
                        }
                    }
                } else {
                    var id = "css-" + src;
                    link = document.createElement("style");
                    link.appendChild(document.createTextNode("@import url(" + src + ")"));
                    link.setAttribute("id", id);
                    pollCss(id, loaded)
                }
            }
            head.appendChild(link)
        }
    }

    function pollCss(id, loaded) {
        setTimeout(function() {
            try {
                var sheets = document.styleSheets;
                for (var j = 0, k = sheets.length; j < k; j++) {
                    if (sheets[j].ownerNode.id == id) {
                        sheets[j].cssRules
                    }
                }
                loaded()
            } catch (e) {
                pollCss(id, loaded)
            }
        }, 10)
    }

    function link(mname, module) {
        var parent = window.modules;
        var pkgs = mname.split(/[.\/]/);
        for (var i = 0; i < pkgs.length - 1; i++) {
            if (!parent[pkgs[i]]) {
                parent[pkgs[i]] = {}
            }
            parent = parent[pkgs[i]]
        }
        parent[pkgs[pkgs.length - 1]] = module
    }

    function getResource(url) {
        if (Module.resourceMap && url && url.length && url.charAt(0) == "/") {
            var parts = url.substring(1).split(/\/+/);
            var ptr = Module.resourceMap;
            for (var i = 0; i < parts.length && ptr; i++) {
                ptr = ptr[parts[i]]
            }
            if (typeof ptr == "string") {
                var dot = url.lastIndexOf(".");
                if (dot) {
                    url = Module.host + url.substring(0, dot) + "-" + ptr + url.substring(dot)
                } else {
                    url = Module.host + url + "-" + ptr
                }
            } else {
                console.log("resource not found", url)
            }
        }
        return url
    }
    var ret = {
        load: load,
        define: define,
        use: use,
        after: after,
        getResource: getResource,
        status: status
    };
    try {
        var scripts = (!document.scripts) ? document.getElementsByTagName("script") : document.scripts;
        var script = scripts[scripts.length - 1];
        if (script && script.src) {
            if (script.src.indexOf("//") == 0) {
                var parts = script.src.split(/\/+/);
                ret.host = location.protocol + "//" + parts[0];
                parts.splice(0, 1);
                parts.pop();
                ret.base = (parts.length) ? "/" + parts.join("/") + "/" : "/"
            } else {
                if (script.src.indexOf(":") != -1) {
                    var parts = script.src.split(/\/+/);
                    ret.host = parts[0] + "//" + parts[1];
                    parts.splice(0, 2);
                    parts.pop();
                    ret.base = (parts.length) ? "/" + parts.join("/") + "/" : "/"
                } else {
                    ret.host = document.location.protocol + "//" + document.location.host;
                    var parts = script.src.split(/\/+/);
                    parts.pop();
                    ret.base = (parts.length) ? "/" + parts.join("/") + "/" : "/"
                }
            }
        }
    } catch (e) {
        ret.host = "";
        ret.base = "/js/"
    }
    return ret
})();
Module.resourceMap = {
    "app": {
        "PlayStoreButton.gif": "1ncx8l4",
        "Shelter.png": "bdyl45",
        "Game-Play.png": "1bvrznw",
        "Dictionary-android.png": "6qqpo9",
        "Game-Play-android.png": "d0c43l",
        "AppStoreButton.gif": "wxl6bl",
        "Dictionary.png": "1aokjxq",
        "Shelter-android.png": "d0s9dp"
    },
    "help": {
        "wordfamily.png": "q1w85x"
    },
    "images": {
        "mainbg.png": "3p5tzl",
        "achieve": {
            "L11.gif": "1ly5w2q",
            "M150.gif": "pwl4yd",
            "L03.gif": "qnvv2d",
            "MH.gif": "1d4e98i",
            "MR.gif": "1t8gydo",
            "PRND.gif": "1fxzsxs",
            "L20.gif": "j4liv4",
            "MQ.gif": "1hhbecu",
            "128-alpha": {
                "L14.png": "nn0fio",
                "L08.png": "12xx0vb",
                "L01.png": "1nk52yg",
                "L20.png": "dyhpvd",
                "L12.png": "v64u7g",
                "L11.png": "1tu5q93",
                "L16.png": "1ualhn1",
                "L18.png": "sznpvn",
                "L09.png": "1jyhyh0",
                "L03.png": "1nea2gd",
                "L05.png": "ujf07v",
                "L02.png": "w7zijf",
                "L07.png": "wptnqr",
                "L15.png": "4ark8o",
                "L10.png": "x6e0gp",
                "L13.png": "16uqhei",
                "L17.png": "14np4op",
                "L06.png": "1knhiel",
                "L04.png": "1er40rv",
                "L19.png": "1vs3bra"
            },
            "L12.gif": "1bpsz6n",
            "L04.gif": "ofo5cs",
            "MG.gif": "1q0zj3e",
            "S20.gif": "14zcjlv",
            "M50.gif": "u70qgm",
            "L13.gif": "fx8pf9",
            "M10.gif": "f8agbh",
            "MP.gif": "cil8jv",
            "L01.gif": "umc6l5",
            "ME.gif": "d9fj9j",
            "MO.gif": "1sma549",
            "L14.gif": "ly7dbp",
            "MN.gif": "fg8oga",
            "M100.gif": "q76uc3",
            "128": {
                "MF.png": "195iz4v",
                "L01.png": "1iw6gvd",
                "MY.png": "1sg3bgc",
                "M50.png": "414y9l",
                "MO.png": "1dgymyg",
                "L18.png": "oczxeh",
                "L02.png": "15u7uvf",
                "S10.png": "hyty72",
                "SMW.png": "ousbjw",
                "L10.png": "10d9i8h",
                "MZ.png": "vfa77f",
                "MN.png": "1msutkx",
                "ME.png": "2f1002",
                "L19.png": "tft4l0",
                "MR.png": "19pzxnt",
                "M400.png": "14bhiy4",
                "MW.png": "xq5vpn",
                "VB201410.png": "hwn3w4",
                "VB2014W.png": "1mfie16",
                "L20.png": "1dfefzu",
                "MH.png": "1ril65s",
                "M5.png": "g1l4ql",
                "OMW.png": "9ga0tk",
                "L16.png": "zlbq5n",
                "L03.png": "k5zkbo",
                "OM10.png": "1jq86ze",
                "M150.png": "10rs7mm",
                "SM10.png": "1as9hat",
                "MQ.png": "1utwaxp",
                "MG.png": "1qt10jq",
                "MX.png": "1igacz9",
                "S15.png": "7d1blb",
                "S50.png": "ocmfgg",
                "L17.png": "7s0ng7",
                "MP.png": "2bt9ym",
                "L04.png": "ket7s7",
                "S20.png": "xphv8h",
                "L14.png": "8aehev",
                "MA.png": "j4fqxi",
                "MK.png": "fkwunl",
                "M250.png": "115xnk0",
                "MU.png": "1sld8sg",
                "M500.png": "1fdsp1e",
                "MB.png": "1unh4i6",
                "L05.png": "11lxkff",
                "M100.png": "74fzf0",
                "L07.png": "didigl",
                "MV.png": "2rjd6y",
                "L15.png": "1305x13",
                "M200.png": "1fb6ug6",
                "MJ.png": "15jvclr",
                "MI.png": "1kbxveb",
                "SMR.png": "1q963v0",
                "L06.png": "15glkft",
                "S5.png": "sa2y9k",
                "VB2014R.png": "16dnsi0",
                "L08.png": "1xxps4z",
                "MM.png": "1wkey4b",
                "OMR.png": "foshzt",
                "L12.png": "2dcq6l",
                "L11.png": "32dxni",
                "MD.png": "1z4u8v",
                "S25.png": "16dy4fn",
                "L09.png": "212sxd",
                "MS.png": "1qwv16l",
                "ML.png": "5ow6uf",
                "W.png": "t0bisi",
                "L13.png": "ixmgqn",
                "P.png": "ptuiqv",
                "PRND.png": "ilciyi",
                "MT.png": "1ila1cy",
                "M300.png": "1pfv8e3",
                "MC.png": "61sj50",
                "M10.png": "1f2gwfj"
            },
            "M5.gif": "qw36of",
            "MF.gif": "8zo5fc",
            "S5.gif": "9wej5i",
            "L02.gif": "2yuxgx",
            "L15.gif": "rwf2qn",
            "M400.gif": "1czfn63",
            "L16.gif": "1kd0qtz",
            "MW.gif": "1d29kv8",
            "L08.gif": "jsmz8q",
            "MC.gif": "1v7buxg",
            "MV.gif": "yg6uu1",
            "S15.gif": "176po14",
            "W.gif": "lja5ui",
            "M200.gif": "1hmd13c",
            "MM.gif": "9jln30",
            "L09.gif": "tvwv08",
            "MX.gif": "9y8s35",
            "MD.gif": "10d8n1l",
            "S25.gif": "1grwybh",
            "S50.gif": "13bfkvt",
            "M500.gif": "1kruvse",
            "MU.gif": "1qmzf7e",
            "P.gif": "v7yaxe",
            "L17.gif": "1tc9ea3",
            "ML.gif": "1hnlkog",
            "MY.gif": "1xwtqs4",
            "L05.gif": "3u23ju",
            "MA.gif": "q0om23",
            "MT.gif": "ja9ru4",
            "M300.gif": "1dhhd4d",
            "MK.gif": "x9px62",
            "M250.gif": "o8iub2",
            "L18.gif": "1px6sj7",
            "MZ.gif": "1x8pb0l",
            "L10.gif": "kfzrie",
            "MS.gif": "1nlok2v",
            "MI.gif": "y4ve88",
            "S10.gif": "1l87c31",
            "L07.gif": "14hvvqb",
            "MB.gif": "whtfk4",
            "L06.gif": "181uydk",
            "L19.gif": "1o7xhci",
            "MJ.gif": "10ukyrr"
        },
        "progress-select-arrow.gif": "y7q4sd",
        "logo.gif": "1adt4zk",
        "wordlists": {
            "wl-beefavpriv-icon.gif": "mr5qm2",
            "wl-bee-shared-icon.gif": "l0yzjk",
            "wl-bee-favorite-icon.gif": "keb0o2",
            "plus.gif": "137gmxw",
            "wl-bee-private-icon.gif": "642e8u",
            "plus-add-word.gif": "1kfrl6e",
            "minus.gif": "iwwfai",
            "wl-grab.gif": "5ta1ia",
            "delete-entry.gif": "1oev544",
            "search.gif": "i2kxs1",
            "wl-new.gif": "1krro2w"
        },
        "variants": {
            "uk.png": "1gyhtc1",
            "listen.png": "1sopkdz",
            "us.png": "kbtqz1"
        },
        "login": {
            "check-icon.png": "238owq"
        },
        "clear.gif": "16y9b5d",
        "dialog": {
            "lftshdw.gif": "17kk2xa",
            "formerror.gif": "ov3oav",
            "bg.gif": "j5dr9t",
            "list-circle.gif": "1lm3h04",
            "rulebg.gif": "1s2whph"
        },
        "features": {
            "fun.gif": "n6ditw",
            "business.gif": "gas3qt",
            "fastdict.gif": "1rig5na",
            "dontforget.gif": "14p2x6u",
            "testprep.gif": "zambof",
            "useful.gif": "ziiohc"
        },
        "searchbutton.gif": "ws1inn",
        "common": {
            "prevpage.gif": "ju3vpi",
            "nextpage.gif": "2f57wx"
        },
        "darrow.png": "1ypmjoi",
        "favicons": {
            "favicon-16x16.png": "uf6i7e",
            "favicon.ico": "1hr0fa",
            "favicon-200x200.png": "iulu90",
            "favicon-32x32.png": "2frmtt"
        },
        "listbuilder": {
            "textmode.gif": "132lb90",
            "print.gif": "zv6mf9",
            "alpha.gif": "176g8a7",
            "bee.gif": "tb5rec",
            "open.gif": "mmrtco",
            "listmode.gif": "vscmmq",
            "edit.gif": "17cuf69",
            "delete.gif": "1iz1h2p",
            "copy.gif": "vzygur"
        },
        "definition": {
            "vt.gif": "y9adi6",
            "dictionary-header.png": "gjq279",
            "learn.gif": "1tsqwjx",
            "list.gif": "d51kvs",
            "choose-header-small.png": "188e4a9"
        },
        "progress-mastered-gold.gif": "6vrnnx",
        "email": {
            "thinkmapfooter.gif": "16eke9",
            "logo-1024.png": "189d0eb",
            "AppStoreButton.gif": "wxl6bl",
            "logo.png": "9t3bgw",
            "bullet.gif": "cuir9n",
            "header.gif": "1i70tdv"
        },
        "dropshadow.png": "169xn9d",
        "progress-bar-stripe.gif": "1n831t",
        "tab-bg.png": "6y6cqj",
        "profiles": {
            "bee-badge-sm.gif": "7lmdio",
            "bee-badge.gif": "1xs570t",
            "ctb-badge.gif": "1r8um3v",
            "mod-badge.gif": "bh5klv",
            "tw-badge-sm.gif": "1ir2gsy",
            "tc-badge-sm.gif": "1gp3ju2",
            "favicons": {
                "wikipedia.gif": "5w93t5",
                "vox.gif": "1q0iyya",
                "bloglines.gif": "ddlawt",
                "bebo.gif": "far2i0",
                "digg.gif": "fxux4",
                "ebay.gif": "1qzt4b",
                "squirl.gif": "6zpm5f",
                "typepad.gif": "1yxz5rn",
                "myspace.gif": "uojnv2",
                "magnolia.gif": "ku8m1i",
                "bookmooch.gif": "17h0j2s",
                "facebook.gif": "532uk5",
                "stumbleupon.gif": "12k3n7e",
                "skype.gif": "166soac",
                "furl.gif": "1wb0pga",
                "youtube.gif": "mgaj1v",
                "google.gif": "1e15cl7",
                "goodreads.gif": "83cv0w",
                "writingcom.gif": "1wgw3fz",
                "flickr.gif": "1bq7a5e",
                "aim.gif": "regto2",
                "wordpress.gif": "c5lx9b",
                "bookxing.gif": "9htfhi",
                "delicious.gif": "5scges",
                "43things.gif": "fnor4v",
                "wordie.gif": "qsk2f8",
                "linkedin.gif": "14u0dcf",
                "blogger.gif": "px0dtd",
                "shelfari.gif": "elrtni",
                "librarything.gif": "55sai6",
                "twitter.gif": "r8raj8",
                "metafilter.gif": "13pk8ba",
                "yahoomsgr.gif": "bwz8bb",
                "pownce.gif": "1807v22",
                "livejournal.gif": "1mcr149",
                "lastfm.gif": "11q192v"
            },
            "mod-badge-sm.gif": "yugkxz",
            "tw-badge.gif": "9ogucj",
            "delete.gif": "1hk8189",
            "tc-badge.gif": "zn5s5b",
            "ctb-badge-sm.gif": "1qpta76"
        },
        "logo-dialog.png": "1sz6q0s",
        "progress-check.gif": "1qqdqro",
        "achieve-sm": {
            "M150.gif": "103x0kb",
            "L11.gif": "unnipr",
            "L03.gif": "y5mfmh",
            "MH.gif": "tys1et",
            "MR.gif": "p46p21",
            "PRND.gif": "xlud45",
            "L20.gif": "1opbz6b",
            "MQ.gif": "q5iake",
            "L12.gif": "1nlx23e",
            "L04.gif": "11nfwrn",
            "MG.gif": "nkwzt4",
            "M50.gif": "pnr9w",
            "S20.gif": "j2o5ww",
            "L13.gif": "1g40b3",
            "M10.gif": "zjrj3v",
            "MP.gif": "bb2aim",
            "L01.gif": "3f4dez",
            "ME.gif": "oo4n3h",
            "MO.gif": "14zm5sl",
            "L14.gif": "i60qov",
            "MN.gif": "wcrpoi",
            "M100.gif": "1v88cd6",
            "M5.gif": "10od4lc",
            "MF.gif": "12nufox",
            "S5.gif": "58m4w5",
            "L02.gif": "1tk0uac",
            "L15.gif": "1b2cljs",
            "M400.gif": "d80rnm",
            "L16.gif": "fr9cwc",
            "MW.gif": "n7vo3u",
            "L08.gif": "146sm2l",
            "MC.gif": "1d1y5zd",
            "MV.gif": "1urtoh8",
            "S15.gif": "f8n01e",
            "MM.gif": "lvzqik",
            "M200.gif": "q0ov1a",
            "L09.gif": "xqu5ge",
            "MX.gif": "1iyo3mv",
            "MD.gif": "jesa63",
            "S50.gif": "15n5hep",
            "S25.gif": "1juy2hg",
            "M500.gif": "19bkik3",
            "MU.gif": "1rijvoh",
            "L17.gif": "12scbf7",
            "ML.gif": "1j9ewp",
            "MY.gif": "1gej3ej",
            "L05.gif": "awkrky",
            "MA.gif": "1vndq6y",
            "MT.gif": "69f270",
            "M300.gif": "rkszyb",
            "MK.gif": "1yraj1n",
            "M250.gif": "1txwa26",
            "L18.gif": "12jrjku",
            "MZ.gif": "gg74s8",
            "L10.gif": "hnq2vl",
            "MS.gif": "mn8tcu",
            "MI.gif": "19z1has",
            "S10.gif": "1r67qiz",
            "L07.gif": "1goqeln",
            "MB.gif": "52bw5c",
            "L06.gif": "1jo4upo",
            "L19.gif": "kle5wp",
            "MJ.gif": "100lmti"
        },
        "icons": {
            "ratinghover.gif": "1jghame",
            "facebook-75x75.gif": "1yfr8wi",
            "audio.gif": "yrxp37",
            "white-arrow-right.png": "1f5i2nr",
            "learn-delete.gif": "hg2jhx",
            "edit.gif": "9us7rp",
            "sso": {
                "google-sign-in.png": "mczlyp",
                "clever-square.png": "r16b08",
                "google-sign-in-hover.png": "10rnav7",
                "clever-icon.png": "tuhjw7",
                "fb-icon.png": "12xonx2",
                "google-icon.png": "1bbr7vc",
                "sign-in-with-clever-medium.png": "1ga2fv7",
                "google-apps.png": "mr43yq"
            },
            "hint-wild.gif": "6vrq2l",
            "hint-def.gif": "581t76",
            "progress-60-black.png": "1xmddwb",
            "signup.gif": "qsdgdw",
            "dictionary.png": "1l03i7r",
            "bullet-check.gif": "1ii8e6h",
            "prev.png": "eeml3x",
            "login-with-facebook.gif": "13olav6",
            "listen.gif": "1kvhv9t",
            "vcom-app-icon-128x128.png": "ptuiqv",
            "delete.gif": "8v4vvf",
            "ratingon.gif": "1wzi19t",
            "suggest.gif": "1v5u6u3",
            "email.gif": "hp4s1j",
            "ratinghalf.gif": "108mxdp",
            "add-to-favorites.gif": "ia747d",
            "prevpage.gif": "ju3vpi",
            "white-arrow-left.png": "1o6sz5t",
            "down-ptr.gif": "4e5dsq",
            "x-circle.png": "1fb8zwc",
            "spinner.gif": "vnop7e",
            "lookup.gif": "1l57wkc",
            "progress-128-white.png": "xd640d",
            "prevpage-disabled.gif": "ccsu57",
            "learn-button.png": "lnw0z4",
            "creditcards.gif": "1a1f05l",
            "vt-icon.png": "bb0z7q",
            "redstar.gif": "j0vhv8",
            "print.gif": "1w7pmcs",
            "reportinappropriate.gif": "b3vfcc",
            "learnable.png": "1sfjbar",
            "new-list.gif": "1i0ir9b",
            "learn.png": "q8bzb8",
            "close.gif": "1l2a6o3",
            "comment.gif": "1tu1psi",
            "nextpage-disabled.gif": "13ac6m6",
            "progress-60-green.png": "14hslhe",
            "search.gif": "i2kxs1",
            "greyarrow.gif": "1fviwrv",
            "progress-90-white.png": "i3tz12",
            "arrow-down.png": "1m9at69",
            "edit-lists.gif": "4gx7jn",
            "hint-5050.gif": "o002zp",
            "learn-button-hover.png": "1gja6ql",
            "asterisk.gif": "1pbf350",
            "ratingoff.gif": "s1j681",
            "bee.gif": "1lbrhgi",
            "next.png": "yn09lc",
            "nextpage.gif": "2f57wx"
        },
        "mainbg.gif": "f4c0jb",
        "educator-edition": {
            "crowd.png": "1r5g5rm",
            "crowd-tout.png": "1hyfikt",
            "tyler-walker.jpg": "iwh4gm",
            "raise-data.png": "fanost",
            "raise-question2.png": "1p5x850",
            "ladders.png": "1rj54z9",
            "ben-darby.jpg": "a4k6ru",
            "kelly-ducham.jpg": "1c5idhl",
            "raise.png": "rze84r",
            "daniel-spacher.jpg": "1rl7c60",
            "bus.png": "1c681n6",
            "raise-question.png": "9l6suj"
        },
        "sections": {
            "blogs-sm.png": "1t11go4",
            "wordroutes-sm.png": "77zuw3",
            "tips-and-tricks-med.jpg": "d765xl",
            "wc-sm.png": "1s9ax1g",
            "wordroutes-med.jpg": "zv4ran",
            "edulinks.jpg": "1qr4kai",
            "booknook-sm.png": "1txa8x2",
            "candlepwr-sm.png": "d4vcqt",
            "ll-med.jpg": "1nvvocj",
            "backstory-med.jpg": "f06ywt",
            "wl-sm.png": "ioxf5s",
            "blogs-med.jpg": "yg4ims",
            "wc-med.jpg": "1f2x9te",
            "blogexcerpts-sm.png": "qnu0nh",
            "backstory.jpg": "1atu1f3",
            "announcements.jpg": "19tajwy",
            "wordshop-med.jpg": "n3gehb",
            "ll.jpg": "149ji91",
            "blogexcerpts-med.jpg": "1nmlweg",
            "wc.jpg": "539fog",
            "ll-sm.png": "wtkd1y",
            "announcements-med.jpg": "fd1wx9",
            "backstory-sm.png": "18ys9mt",
            "banners": {
                "ll.jpg": "fonu2n",
                "tasty-morsels.jpg": "1rfw8az",
                "chooseyourwords.jpg": "ld8xtk",
                "wc.jpg": "ubz876",
                "dogeared-2.jpg": "195vdtk",
                "dictionary.jpg": "pt7s05",
                "header.jpg": "1bf65fq",
                "dogeared.jpg": "1i4dc2l",
                "blogexcerpts.jpg": "1hwitkv",
                "evasive.jpg": "xr78qu",
                "wl.jpg": "2kqk50",
                "teachersatwork.jpg": "1asahah",
                "wordshop.jpg": "1bkuf4",
                "vocabulary-shout-out.jpg": "1bwc3b9",
                "tips-and-tricks.jpg": "sc3r77",
                "under-the-hood.jpg": "u4dgbk",
                "ribbon.png": "14u3eag",
                "candlepwr.jpg": "ty6qip",
                "success-stories.jpg": "152urmb",
                "wordroutes.jpg": "1ypk0la",
                "announcements.jpg": "1b3d5r9"
            },
            "edulinks-sm.png": "13tte7f",
            "booknook.jpg": "jybluz",
            "teachersatwork-med.jpg": "guq79l",
            "square": {
                "ll.jpg": "3do4t5",
                "tasty-morsels.jpg": "x503hf",
                "wc.jpg": "1qnhekf",
                "dictionary.jpg": "zbjveg",
                "dogeared.jpg": "1hao826",
                "blogexcerpts.jpg": "o99b7o",
                "wl.jpg": "coydet",
                "evasive.jpg": "f05os",
                "teachersatwork.jpg": "qwx68n",
                "wordshop.jpg": "149futr",
                "vocabulary-shout-out.jpg": "ddu9fv",
                "tips-and-tricks.jpg": "pf3vus",
                "under-the-hood.jpg": "1g1ewtd",
                "wordroutes.jpg": "k79pjb",
                "candlepwr.jpg": "1mm5vco",
                "success-stories.jpg": "r1ztsq",
                "announcements.jpg": "r7kmxp"
            },
            "edulinks-med.jpg": "6j2i56",
            "evasive-sm.png": "1527r4f",
            "evasive-med.jpg": "hvfxik",
            "dictionary-sm.png": "1edy2ay",
            "blogs.jpg": "8iiwh7",
            "teachersatwork-sm.png": "15u2ba",
            "chooseyourwords.jpg": "1yvofs6",
            "wl-med.jpg": "kesqk3",
            "dictionary.jpg": "vyet1u",
            "dogeared.jpg": "gdax0m",
            "evasive.jpg": "16dgbgu",
            "wl.jpg": "12gypzo",
            "dictionary-med.jpg": "10u1mwv",
            "tips-and-tricks.jpg": "2lxex7",
            "topics.jpg": "1uzt2ny",
            "candlepwr.jpg": "197ibqk",
            "booknook-med.jpg": "14j3qzy",
            "announcements-sm.png": "slrl4h",
            "dogeared-med.jpg": "fep6ek",
            "dogeared-sm.png": "1gjse4k",
            "chooseyourwords-sm.png": "1qy4vqy",
            "candlepwr-med.jpg": "1rhvegp",
            "under-the-hood-med.jpg": "1kpv3nu",
            "blogexcerpts.jpg": "10wcgw0",
            "teachersatwork.jpg": "1xvoip0",
            "wordshop.jpg": "t8w99",
            "wordshop-sm.png": "ypats2",
            "under-the-hood.jpg": "10awtki",
            "wordroutes.jpg": "4k2bs4",
            "chooseyourwords-med.jpg": "1fxentn"
        },
        "progress-bar-back.gif": "1uel6d2",
        "logo.png": "1w6vnr6",
        "home": {
            "science.png": "1e3sd67",
            "teacher-tools-array.png": "yubray",
            "ladders.png": "10yzjp4",
            "game.png": "qvnrcc",
            "lists-header-small.png": "1foeoqr",
            "blog-header-small.png": "kuy0qh"
        },
        "dictionary": {
            "cyw-bg.jpg": "o1yyvw",
            "header.jpg": "17tim7j"
        },
        "topscores": {
            "invite-icon.gif": "9ao3z3",
            "fb-15x15.gif": "1dbi6yp"
        },
        "partners": {
            "nytln.png": "be8z6b"
        },
        "lists": {
            "sl-his.png": "16zmih7",
            "SPH.jpg": "19nc2p1",
            "head-his.png": "1ap3n5u",
            "sl-nws.png": "1q84w8z",
            "LIT.jpg": "ijuxvm",
            "TST.jpg": "6aazib",
            "new-plus.png": "nx2p0e",
            "lists-header.png": "14463qv",
            "ROOTS.jpg": "1m5bwxf",
            "head-fun.png": "1ldtb01",
            "head-sph.png": "1njpnt0",
            "NWS.jpg": "1y3jbh5",
            "recommended.gif": "1wgp5qp",
            "HIS.jpg": "272605",
            "home.jpg": "1j2l567",
            "wl-favorite-icon.gif": "r71309",
            "head-vocablists.png": "wnmu0h",
            "sl-roots.png": "5u4ptm",
            "sl-lit.png": "itdwrr",
            "sl-tst.png": "yucteo",
            "search-button.png": "lnoh3j",
            "head-nws.png": "nv4545",
            "head-tst.png": "k6vdi0",
            "vrule.gif": "87n7",
            "FUN.jpg": "lwapuu",
            "wl-favorite-selected.gif": "4te3ul",
            "head-lit.png": "zttxde",
            "head-roots.png": "a084zt",
            "sl-fun.png": "ldsxuc",
            "sl-sph.png": "15snpla"
        },
        "header": {
            "dict-off.png": "urqsa2",
            "dict-on.png": "1f1pvh",
            "play-off.png": "7lggzq",
            "lists-off.png": "sags5d",
            "play-on.png": "2ewtj3",
            "logo.png": "1wobq9i",
            "lists-on.png": "130ou3o"
        },
        "progress": {
            "words.jpg": "sz4r51",
            "progress-circle.gif": "kdsd6t",
            "achieves-callout.jpg": "16hc7s9",
            "stats-chart.jpg": "fpq82k",
            "dropdown.png": "18mrh8x"
        },
        "challenge": {
            "correct.png": "1y4g79w",
            "sm-incorrect.png": "18pc9fb",
            "sm-inactive.png": "oqwoqm",
            "dot.png": "zhx82n",
            "incorrect.png": "ljc21q",
            "bullet-on.png": "68uev",
            "checkstar.png": "nzcij0",
            "bullet.png": "un560i",
            "smallx.png": "1c3c53l",
            "smallcheck.png": "fcm8kx",
            "sm-correct.png": "jk3kxr"
        },
        "magazine": {
            "choose-article-header.png": "2ryrjs",
            "header-home.png": "1w97bc2",
            "blog-article-header.png": "1pu200o",
            "header.png": "1sb8nc6",
            "lists-header.png": "1itd5d0",
            "blog-header.png": "3s4l3g",
            "choose-header.png": "ne5c9i",
            "header-home-sm.png": "1mah4nb"
        },
        "ios-icons": {
            "114x114.png": "off5pn",
            "57x57.png": "1rorzpt",
            "72x72.png": "sncm7"
        },
        "account": {
            "sort-down.gif": "z61mev",
            "icon-account.gif": "1fy534c",
            "button-bg-cancel.gif": "1h31efh",
            "icon-users.gif": "1n6f2yr",
            "action-create.gif": "p7abhi",
            "icon-print.gif": "1qkzhpm",
            "manage-button.gif": "jj9ixy",
            "icon-key.gif": "18924g4",
            "icon-settings.gif": "1w973cu",
            "action-edit.gif": "nka47n",
            "icon-arrowbullet.gif": "1hn9go",
            "icon-history.gif": "60setw",
            "button-downarrow.gif": "1abyh7l",
            "leftnav-selected.gif": "19ls5ya",
            "prevpage.gif": "ju3vpi",
            "signinas_btn.png": "1o3tnks",
            "icon-loginas.gif": "1xaox3z",
            "search.gif": "i2kxs1",
            "button-bg.gif": "nq6hrb",
            "logo-vt-print.gif": "hqe3tq",
            "sort-up.gif": "1s6d1x7",
            "icon-email.gif": "t4all4",
            "icon-add.gif": "1lf03qp",
            "leftnav-header.gif": "134es1l",
            "nextpage.gif": "2f57wx"
        }
    },
    "css": {
        "main2.css": "t0e2wq",
        "quizresults.css": "kijwr9",
        "myaccount.css": "rqi1el",
        "login.css": "1vdtwsv",
        "editlist.css": "11sf6ki",
        "achievements.css": "m00kxd",
        "viewselector.css": "1mrjse4",
        "pie": {
            "PIE_IE678.js": "1djehd6",
            "PIE_IE9.js": "dkaspv"
        },
        "resultslist.css": "u9r8vw",
        "signup.css": "1d7nvlp",
        "ie7.css": "1e3fyxi",
        "fonts": {
            "OpenSans-LightItalic.ttf": "1ohyrxn",
            "levels.woff": "8a8vwc",
            "OpenSans-Italic.ttf": "gd06sc",
            "ss-symbolicons-block.svg": "13vbqf6",
            "OpenSans-ExtraBoldItalic.ttf": "ps4esc",
            "OpenSans-Regular.ttf": "et8l9",
            "ss-symbolicons-block.ttf": "vgrjnk",
            "OpenSans-Light.ttf": "1i59059",
            "ss-standard.eot": "1sjcgaw",
            "levels.eot": "13roes7",
            "ss-social-circle.eot": "okb1yd",
            "OpenSans-ExtraBold.ttf": "1qunvxi",
            "ss-social-circle.css": "1708mdo",
            "ss-standard.woff": "1se8it9",
            "fonts.css": "zwk992",
            "ss-symbolicons-block.css": "1u3l0c5",
            "ss-standard.css": "1nx9nw2",
            "ss-symbolicons.js": "1fnhpk5",
            "ss-social.js": "1246e8y",
            "OpenSans-SemiboldItalic.ttf": "lrrbnt",
            "ss-symbolicons-block.eot": "127czmj",
            "OpenSans-BoldItalic.ttf": "19sd779",
            "ss-standard.ttf": "1auk3og",
            "levels.ttf": "1e8cu3h",
            "ss-social-circle.woff": "1bzllrc",
            "ss-standard.svg": "hhd3l0",
            "ss-symbolicons-block.woff": "bwlxp8",
            "ss-social-circle.svg": "xfjq30",
            "OpenSans-Semibold.ttf": "vpzurc",
            "OpenSans-Bold.ttf": "eomjcv",
            "ss-social-circle.ttf": "1emfc01"
        },
        "leaderboards.css": "163g1yt",
        "forms.css": "3aonit",
        "ie8_2.css": "hgjltb",
        "definition3.css": "w0ft0i",
        "lists.css": "cpstq1",
        "schoolresults.css": "1276uxt",
        "users.css": "uro4hy",
        "responsive.css": "1bpl35i",
        "dictionary.css": "1bui0nk",
        "classresults.css": "dq1o8o",
        "3": {
            "main.css": "dj0hme",
            "forms.css": "1e73adr",
            "header.css": "1em6bxs"
        },
        "magazine2.css": "yzuem1",
        "dialog_ie8.css": "1ecxkw",
        "myaccount2.css": "sd4ntp",
        "progress.css": "zjqx3f",
        "userupload.css": "eihj2z",
        "wordlist2.css": "9epafd",
        "myclasses.css": "1652jjg",
        "dialog.css": "43r13o",
        "store.css": "nxzepm",
        "myprogress.css": "1g3au7t"
    },
    "lists": {
        "lists-learn.png": "or5ui3",
        "lists-learn-add.png": "1r1o4n3",
        "lists-spell-login.png": "1d0b965",
        "lists-learn-complete.png": "kgi0m1",
        "lists-spell-complete.png": "xvudd5",
        "lists-learn-login.png": "1pjus1"
    },
    "howitworks": {
        "vocab-lists2.png": "167ju76",
        "chart-your-progress.png": "ai84d7",
        "personalized-list.png": "1n3lik2",
        "usage-examples.png": "1fotjri",
        "share-your-words.png": "17n1bpz",
        "vocab-lists.png": "1l5pqsq",
        "predictive-magic.png": "1obeivv",
        "attitude.png": "b9s529",
        "magazine.png": "njbw35",
        "hints.png": "4t4rdh",
        "path-to-mastery.png": "1oeis3e",
        "lot-of-learning.png": "1hbo7jq",
        "personal-trainer.png": "1e9px1c",
        "share-your-words2.png": "xzp7ur",
        "magazine2.png": "prnvt9",
        "affect-effect.png": "1c5x0qk",
        "earn-achievements.png": "fzr15a"
    },
    "js": {
        "jquery.waypoints.js": "ne7bpi",
        "jquery.validate.js": "m3fofq",
        "datepicker.css": "pczm0q",
        "jquery.placeholder.js": "zvqokq",
        "ie8.js": "1rsycfg",
        "package.js": "1kzhamg",
        "soundmanager": {
            "package.js": "122k890"
        },
        "datepicker.js": "3hylp1",
        "validation.js": "izco4k",
        "smartbanner": {
            "smartbanner.css": "1e9q0z8",
            "package.js": "vwhg3c"
        },
        "ajax.js": "105azyz",
        "flot": {
            "package.js": "dz7jkv"
        },
        "vcom": {
            "wleditor.js": "1vkyqul",
            "advancedsearch.js": "1mipl9c",
            "classes": {
                "package.js": "10xxoxa"
            },
            "voting": {
                "questionrater.css": "1jz2ua",
                "package.js": "h7dxx6",
                "voting.css": "nlrb2v"
            },
            "accounteditor.js": "bat09r",
            "login": {
                "login.jst": "12jvj3z",
                "login.css": "mk23yf",
                "package.js": "d0rmuu"
            },
            "bee.js": "1uwjt2i",
            "package.js": "tdt4tn",
            "pager.js": "zvq68w",
            "examplebrowser.css": "9rcku1",
            "listbuilder": {
                "listbuilder.css": "rfhkm6",
                "package.js": "1t9v9sf"
            },
            "friendsscores.js": "frqkvb",
            "advancedsearch.jst": "1i20m99",
            "listmaker": {
                "package.js": "apzx3e"
            },
            "calendar.js": "4yua3u",
            "advancedsearch.css": "1jn5s55",
            "autocomplete.css": "1y6q41s",
            "classresults.js": "1ceaw2t",
            "facebook.js": "1l4023e",
            "myprogress": {
                "package.js": "1chh7e0"
            },
            "mywordsinwild.css": "15mrhsx",
            "comments.js": "1bobqja",
            "qpreview.css": "o98fuq",
            "users": {
                "invitemanager.css": "jqt14x",
                "usermanager.css": "1shns77",
                "package.js": "wyvlkj"
            },
            "comments.css": "5d1gca",
            "schoolreports": {
                "package.js": "g9qmi6"
            },
            "bee.css": "rc74d0",
            "progress": {
                "progress.css": "1bx1w1r",
                "package.js": "c48n34"
            },
            "challenge.css": "m5uiu6"
        }
    },
    "favicon.ico": "1hr0fa",
    "bowl": {
        "map.js": "ealafu"
    },
    "educator-edition": {
        "students.jpg": "1xvumsw",
        "culture.jpg": "47vdic",
        "map.png": "97rqgy",
        "banner.jpg": "1jmknt6"
    },
    "email": {
        "backtoschool1": {
            "students.jpg": "1xvumsw",
            "culture.jpg": "1ifa6m",
            "banner.jpg": "1jmknt6"
        },
        "backtoschool2": {
            "unbroken.jpg": "1srfnr9",
            "malala.jpg": "19izm2f",
            "stevejobs.jpg": "oke90y",
            "tippingpoint.jpg": "1sumlg7",
            "intothewild.jpg": "elzafc",
            "incoldblood.jpg": "ojani4"
        },
        "backtoschool3": {
            "students.jpg": "1xvumsw",
            "culture.jpg": "1ifa6m",
            "banner.jpg": "1jmknt6"
        },
        "bowlupdate": {
            "students.jpg": "1xvumsw",
            "culture.jpg": "1ifa6m",
            "banner.jpg": "1jmknt6"
        }
    }
};

Module.aliases = {
    "template": "package.js",
    "vcom/listtools": "vcom/package.js",
    "vcom/myprogress/lists": "vcom/myprogress/package.js",
    "vcom/classes/lists": "vcom/classes/package.js",
    "vcom/wordfamily": "vcom/package.js",
    "vcom/myprogress/words": "vcom/myprogress/package.js",
    "vcom/schoolreports/teachers": "vcom/schoolreports/package.js",
    "flot/excanvas": "flot/package.js",
    "vcom/myprogress/chart": "vcom/myprogress/package.js",
    "clipboard": "package.js",
    "vcom/notifications": "vcom/package.js",
    "vcom/autocomplete": "vcom/package.js",
    "vcom/tools": "vcom/package.js",
    "validation2": "package.js",
    "vcom/login/login": "vcom/login/package.js",
    "vcom/users/invitemanager": "vcom/users/package.js",
    "flot/jquery.flot.time": "flot/package.js",
    "htmlformat": "package.js",
    "flot/jquery.flot": "flot/package.js",
    "vcom/myprogress/periodselector": "vcom/myprogress/package.js",
    "vcom/adslots": "vcom/package.js",
    "vcom/mywordsinwild": "vcom/package.js",
    "vcom/listbuilder/listbuilder": "vcom/listbuilder/package.js",
    "vcom/myprogress/summary": "vcom/myprogress/package.js",
    "vcom/myprogress/svg": "vcom/myprogress/package.js",
    "vcom/users/usermanager": "vcom/users/package.js",
    "vcom/voting/questionrater": "vcom/voting/package.js",
    "vcom/classes/results": "vcom/classes/package.js",
    "vcom/dictionary": "vcom/package.js",
    "vcom/schoolreports/history": "vcom/schoolreports/package.js",
    "vcom/schoolreports/chart": "vcom/schoolreports/package.js",
    "soundmanager/soundmanager": "soundmanager/package.js",
    "vcom/classes/myclasses": "vcom/classes/package.js",
    "vcom/schoolreports/summary": "vcom/schoolreports/package.js",
    "vcom/myprogress/history": "vcom/myprogress/package.js",
    "vcom/examplebrowser": "vcom/package.js",
    "flot/jquery.flot.stack": "flot/package.js",
    "vcom/schoolreports/periodselector": "vcom/schoolreports/package.js",
    "vcom/progress/progress": "vcom/progress/package.js",
    "vcom/classes/words": "vcom/classes/package.js",
    "smartbanner/smartbanner": "smartbanner/package.js",
    "vcom/listmaker/listmaker": "vcom/listmaker/package.js",
    "vcom/voting/voting": "vcom/voting/package.js",
    "vcom/schoolfinder": "vcom/package.js",
    "vcom/schoolreports/students": "vcom/schoolreports/package.js",
    "vcom/topscores": "vcom/package.js",
    "vcom/classes/periodselector": "vcom/classes/package.js",
    "vcom/qpreview": "vcom/package.js"
};
Module.define("ajaxutils", ["jquery"], function() {
    var $ = jQuery;
    $.fn.smartLoad = function(url, params, callback) {
        if (arguments.length === 0) {
            var prev = this.data("smartload.xhr");
            if (prev && prev.xhr) {
                prev.xhr.abort()
            }
            return this
        }
        var selector, response, self = this,
            off = url.indexOf(" ");
        if (off >= 0) {
            selector = url.slice(off);
            url = url.slice(0, off)
        }
        if ($.isFunction(params)) {
            callback = params;
            params = undefined
        }
        if (self.length > 0) {
            var args = {
                url: url,
                type: "GET",
                dataType: "html",
                data: params
            };
            prev = self.data("smartload.xhr");
            if (prev) {
                if ((Date.now() - prev.time) < options.debounceTime && eq(args, prev.args)) {
                    if (callback) {
                        prev.xhr.always(function(jqXHR, status) {
                            self.each(callback, response || [jqXHR.responseText, status, jqXHR])
                        })
                    }
                } else {
                    prev.xhr.abort()
                }
            }
            var xhr = $.ajax(args).done(function(responseText) {
                response = arguments;
                self.html(selector ? $("<div/>").append($.parseHTML(responseText)).find(selector) : responseText)
            }).always(function(jqXHR, status) {
                self.removeData("smartload.xhr");
                if (callback) {
                    self.each(callback, response || [jqXHR.responseText, status, jqXHR])
                }
            });
            self.data("smartload.xhr", {
                xhr: xhr,
                args: args,
                time: Date.now()
            })
        }
        return this
    };
    var options = $.fn.smartLoad.options = {
        debounceTime: 300
    };

    function eq(a, b) {
        if (typeof a === "object" && typeof b === "object") {
            for (var k in a) {
                if (!k in b) {
                    return false
                }
                if (!eq(a[k], b[k])) {
                    return false
                }
            }
            for (var k in b) {
                if (!k in b) {
                    return false
                }
            }
            return true
        } else {
            if (typeof a !== typeof b) {
                return false
            } else {
                return a === b
            }
        }
    }
});
Module.define("base", [], function(module) {
    (String.prototype.trim || (String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "")
    }));
    (String.prototype.stripHTML || (String.prototype.stripHTML = function() {
        return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi, "")
    }));
    (String.prototype.truncateNicely || (String.prototype.truncateNicely = function(length) {
        if (this.length < length) {
            return this
        }
        var ret = "";
        var parts = this.split(" ");
        for (var i = 0; i < parts.length; i++) {
            if (ret.length + parts[i].length > length - 3) {
                break
            }
            ret += ((ret.length > 0) ? " " : "") + parts[i]
        }
        return ret + "..."
    }));
    (Array.prototype.indexOf || (Array.prototype.indexOf = function(obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] == obj) {
                return i
            }
        }
        return -1
    }));
    (Array.prototype.push || (Array.prototype.push = function(x) {
        this[this.length] = x;
        return this.length
    }));
    (Array.prototype.remove || (Array.prototype.remove = function(x) {
        var idx = this.indexOf(x);
        if (idx > -1) {
            this.splice(idx, 1);
            return true
        }
        return false
    }));
    (Array.prototype.contains || (Array.prototype.contains = function(x) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == x) {
                return true
            }
        }
        return false
    }));
    (Array.prototype.map || (Array.prototype.map = function(callback, thisArg) {
        var T, A, k;
        if (this == null) {
            throw new TypeError("this is null or not defined")
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if ({}.toString.call(callback) != "[object Function]") {
            throw new TypeError(callback + " is not a function")
        }
        if (thisArg) {
            T = thisArg
        }
        A = new Array(len);
        k = 0;
        while (k < len) {
            var kValue, mappedValue;
            if (k in O) {
                kValue = O[k];
                mappedValue = callback.call(T, kValue, k, O);
                A[k] = mappedValue
            }
            k++
        }
        return A
    }));
    (Array.prototype.forEach || (Array.prototype.forEach = function(callback, thisArg) {
        if (this == null) {
            throw new TypeError(" this is null or not defined")
        }
        if ({}.toString.call(callback) != "[object Function]") {
            throw new TypeError(callback + " is not a function")
        }
        var T;
        if (thisArg) {
            T = thisArg
        }
        var O = Object(this);
        var len = O.length >>> 0;
        for (var k = 0; k < len; k++) {
            if (k in O) {
                callback.call(T, O[k], k, O)
            }
        }
    }));
    (Function.prototype.extend || (Function.prototype.extend = function(superc, overrides) {
        if (!superc) {
            throw new Error("extend failed, please check that all dependencies are included.")
        }
        var F = function() {};
        F.prototype = superc.prototype;
        this.prototype = new F();
        this.prototype.constructor = this;
        this.superclass = superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor = superc
        }
        if (overrides) {
            for (var i in overrides) {
                this.prototype[i] = overrides[i]
            }
        }
    }));
    (Function.prototype.bind || (Function.prototype.bind = function() {
        var _method = this;
        var args = arguments;
        return (args.length == 0) ? this : function() {
            var nargs = arguments;
            if (args.length > 1 && nargs.length > 0) {
                nargs = args.slice(0);
                for (var i = 0; i < arguments.length; i++) {
                    nargs.push(arguments[i])
                }
            }
            _method.apply(args[0], nargs)
        }
    }));
    (Date.now || (Date.now = function() {
        return +(new Date())
    }));
    (function() {
        var D = new Date("2011-06-02T09:34:29+02:00");
        if (!D || +D !== 1307000069000) {
            Date.fromISO = function(s) {
                var day, tz, rx = /^(\d{4}\-\d\d\-\d\d([tT ][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/,
                    p = rx.exec(s) || [];
                if (p[1]) {
                    day = p[1].split(/\D/);
                    for (var i = 0, L = day.length; i < L; i++) {
                        day[i] = parseInt(day[i], 10) || 0
                    }
                    day[1] -= 1;
                    day = new Date(Date.UTC.apply(Date, day));
                    if (!day.getDate()) {
                        return NaN
                    }
                    if (p[5]) {
                        tz = (parseInt(p[5], 10) * 60);
                        if (p[6]) {
                            tz += parseInt(p[6], 10)
                        }
                        if (p[4] == "+") {
                            tz *= -1
                        }
                        if (tz) {
                            day.setUTCMinutes(day.getUTCMinutes() + tz)
                        }
                    }
                    return day
                }
                return NaN
            }
        } else {
            Date.fromISO = function(s) {
                return new Date(s)
            }
        }
    })();
    (window.$ || (window.$ = function(id) {
        return (id.nodeName) ? id : document.getElementById(id)
    }));
    window.Browser = {
        IE: !!(window.attachEvent && !window.opera),
        Opera: !!window.opera,
        Safari: (navigator.userAgent.indexOf("WebKit/") > -1 && navigator.userAgent.indexOf("Chrome") == -1),
        Firefox: (navigator.userAgent.indexOf("Firefox") > -1),
        Chrome: (navigator.userAgent.indexOf("Chrome") > -1),
        WebKit: navigator.userAgent.indexOf("WebKit/") > -1,
        Gecko: navigator.userAgent.indexOf("Gecko") > -1 && navigator.userAgent.indexOf("KHTML") == -1,
        iOS: (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i))
    };
    if (Browser.IE) {
        Browser.version = parseFloat(navigator.userAgent.split("MSIE")[1]);
        if (document.documentMode) {
            Browser.compatversion = document.documentMode
        } else {
            Browser.compatversion = Browser.version
        }
    } else {
        if (Browser.WebKit) {
            Browser.version = parseFloat(navigator.userAgent.split("WebKit/")[1])
        } else {
            if (Browser.Firefox) {
                Browser.version = parseFloat(navigator.userAgent.split("Firefox/")[1])
            } else {
                if (Browser.Gecko) {
                    Browser.version = parseFloat(navigator.userAgent.split("Gecko/")[1])
                } else {
                    if (Browser.Opera) {
                        Browser.version = parseFloat(navigator.userAgent.split("Opera/")[1])
                    } else {
                        Browser.version = parseFloat(navigator.appVersion)
                    }
                }
            }
        }
    }

    function Event(source, type) {
        this.source = source;
        this.type = type
    }
    module.Event = Event;
    Event.addListener = function(obj, evt, callback, capt) {
        if (!obj) {
            return
        }
        if (obj.addEventListener) {
            obj.addEventListener(evt, callback, capt)
        } else {
            if (obj.attachEvent) {
                obj.attachEvent("on" + evt, callback.__wrapper = function() {
                    var event = window.event;
                    if (!event.target) {
                        event.target = event.srcElement
                    }
                    return callback.call(obj, event)
                })
            } else {
                if (!obj.__listeners) {
                    obj.__listeners = {}
                }
                var listeners = obj.__listeners[evt];
                if (!listeners) {
                    obj.__listeners[evt] = listeners = []
                }
                listeners.push(callback)
            }
        }
    };
    Event.removeListener = function(obj, evt, callback, capt) {
        if (obj.removeEventListener) {
            obj.removeEventListener(evt, callback, capt)
        } else {
            if (obj.detachEvent) {
                obj.detachEvent("on" + evt, callback.__wrapper)
            } else {
                if (obj.__listeners) {
                    var listeners = obj.__listeners[evt];
                    if (listeners) {
                        for (var i = 0; i < listeners.length; i++) {
                            if (listeners[i] == callback) {
                                listeners[i] = null;
                                return
                            }
                        }
                    }
                }
            }
        }
    };
    Event.fire = function(source, type) {
        (new Event(source, type)).fire()
    };
    Event.prototype.fire = function() {
        if (this.source && this.source.__listeners) {
            var listeners = this.source.__listeners[this.type];
            if (listeners) {
                var rebuild = false;
                for (var i = 0; i < listeners.length; i++) {
                    if (listeners[i] != null) {
                        listeners[i].apply(this.source, [this])
                    } else {
                        rebuild = true
                    }
                }
                if (rebuild) {
                    var newlist = [];
                    for (var i = 0, len = listeners.length; i < len; i++) {
                        if (listeners[i]) {
                            newlist.push(listeners[i])
                        }
                    }
                    listeners = newlist
                }
            }
        }
        window.Event = Event
    };
    var DOM = {
        ready: false,
        whenReady: function(listener) {
            if (DOM.ready) {
                listener()
            } else {
                var rdy = function() {
                    Event.removeListener(DOM, "ready", rdy);
                    listener()
                };
                Event.addListener(DOM, "ready", rdy)
            }
        }
    };
    window.DOM = DOM;
    var windowLoaded = function() {
        Event.removeListener(window, "load", windowLoaded);
        if (!DOM.ready) {
            domLoaded()
        }
    };
    var domContentLoaded = function() {
        Event.removeListener(document, "DOMContentLoaded", domLoaded);
        if (!DOM.ready) {
            domLoaded()
        }
    };
    var domLoaded = function(t) {
        if (!DOM.ready) {
            DOM.ready = true;
            Event.fire(DOM, "ready")
        }
    };
    var _dri = null;
    if (Browser.IE) {
        _dri = setInterval(function() {
            var n = document.createElement("p");
            try {
                n.doScroll("left");
                clearInterval(_dri);
                _dri = null;
                domLoaded(true);
                n = null
            } catch (ex) {
                n = null
            }
        }, 20);
        Event.addListener(window, "load", windowLoaded)
    } else {
        if (Browser.WebKit && Browser.version < 525) {
            _dri = setInterval(function() {
                var rs = document.readyState;
                if ("loaded" == rs || "complete" == rs) {
                    clearInterval(_dri);
                    _dri = null;
                    domLoaded()
                }
            }, 20);
            Event.addListener(window, "load", windowLoaded)
        } else {
            Event.addListener(document, "DOMContentLoaded", domContentLoaded)
        }
    }
    EventSource = function() {};
    EventSource.prototype.addEventListener = function(type, callback) {
        if (!this.eventListeners) {
            this.eventListeners = {}
        }
        if (!this.eventListeners[type]) {
            this.eventListeners[type] = []
        }
        this.eventListeners[type].unshift(callback)
    };
    EventSource.prototype.removeEventListener = function(type, callback) {
        if (this.eventListeners && this.eventListeners[type]) {
            this.eventListeners[type].remove(callback)
        }
    };
    EventSource.prototype.fireEvent = function(type) {
        if (this.eventListeners && this.eventListeners[type]) {
            var list = this.eventListeners[type];
            if (arguments.length == 1) {
                for (var i = list.length - 1; i >= 0; i--) {
                    list[i].call(this)
                }
            } else {
                var args = Array.prototype.slice.call(arguments, 1);
                for (var i = list.length - 1; i >= 0; i--) {
                    list[i].apply(this, args)
                }
            }
        }
    };
    module.EventSource = EventSource
});
Module.define("cookie", [], function(module) {
    var Cookie = module.Cookie = {};
    Cookie.set = function(name, value, days, path) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString()
        } else {
            var expires = ""
        }
        if (!path) {
            path = "/"
        }
        document.cookie = name + "=" + value + expires + "; path=" + path
    };
    Cookie.get = function(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1, c.length)
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length)
            }
        }
        return null
    };
    Cookie.remove = function(name) {
        Cookie.set(name, "", -1)
    };
    Cookie.supportsCookies = function() {
        Cookie.set("test", "1", 1);
        if (Cookie.get("test") == "1") {
            Cookie.remove("test");
            return true
        }
        return false
    }
});
Module.define("date", [], function(module) {
    var dateFormat = function() {
        var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function(val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) {
                    val = "0" + val
                }
                return val
            };
        return function(date, mask, utc) {
            var dF = dateFormat;
            if (arguments.length == 1 && (typeof date == "string" || date instanceof String) && !/\d/.test(date)) {
                mask = date;
                date = undefined
            }
            date = date ? new Date(date) : new Date();
            if (isNaN(date)) {
                throw new SyntaxError("invalid date")
            }
            mask = String(dF.masks[mask] || mask || dF.masks["default"]);
            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true
            }
            var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d: d,
                    dd: pad(d),
                    ddd: dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m: m + 1,
                    mm: pad(m + 1),
                    mmm: dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy: String(y).slice(2),
                    yyyy: y,
                    h: H % 12 || 12,
                    hh: pad(H % 12 || 12),
                    H: H,
                    HH: pad(H),
                    M: M,
                    MM: pad(M),
                    s: s,
                    ss: pad(s),
                    l: pad(L, 3),
                    L: pad(L > 99 ? Math.round(L / 10) : L),
                    t: H < 12 ? "a" : "p",
                    tt: H < 12 ? "am" : "pm",
                    T: H < 12 ? "A" : "P",
                    TT: H < 12 ? "AM" : "PM",
                    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };
            return mask.replace(token, function($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1)
            })
        }
    }();
    dateFormat.masks = {
        "default": "ddd mmm dd yyyy HH:MM:ss",
        shortDate: "m/d/yy",
        mediumDate: "mmm d, yyyy",
        longDate: "mmmm d, yyyy",
        fullDate: "dddd, mmmm d, yyyy",
        shortTime: "h:MM TT",
        mediumTime: "h:MM:ss TT",
        longTime: "h:MM:ss TT Z",
        isoDate: "yyyy-mm-dd",
        isoTime: "HH:MM:ss",
        isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };
    dateFormat.i18n = {
        dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    };
    Date.prototype.format = function(mask, utc) {
        return dateFormat(this, mask, utc)
    };
    module.dateFormat = dateFormat
});
Module.define("dotimeout", ["jquery"], function() {
    /*!
     * jQuery doTimeout: Like setTimeout, but better! - v1.0 - 3/3/2010
     * http://benalman.com/projects/jquery-dotimeout-plugin/
     * 
     * Copyright (c) 2010 "Cowboy" Ben Alman
     * Dual licensed under the MIT and GPL licenses.
     * http://benalman.com/about/license/
     */
    (function($) {
        var cache = {},
            doTimeout = "doTimeout",
            aps = Array.prototype.slice;
        $[doTimeout] = function() {
            return p_doTimeout.apply(window, [0].concat(aps.call(arguments)))
        };
        $.fn[doTimeout] = function() {
            var args = aps.call(arguments),
                result = p_doTimeout.apply(this, [doTimeout + args[0]].concat(args));
            return typeof args[0] === "number" || typeof args[1] === "number" ? this : result
        };

        function p_doTimeout(jquery_data_key) {
            var that = this,
                elem, data = {},
                method_base = jquery_data_key ? $.fn : $,
                args = arguments,
                slice_args = 4,
                id = args[1],
                delay = args[2],
                callback = args[3];
            if (typeof id !== "string") {
                slice_args--;
                id = jquery_data_key = 0;
                delay = args[1];
                callback = args[2]
            }
            if (jquery_data_key) {
                elem = that.eq(0);
                elem.data(jquery_data_key, data = elem.data(jquery_data_key) || {})
            } else {
                if (id) {
                    data = cache[id] || (cache[id] = {})
                }
            }
            data.id && clearTimeout(data.id);
            delete data.id;

            function cleanup() {
                if (jquery_data_key) {
                    elem.removeData(jquery_data_key)
                } else {
                    if (id) {
                        delete cache[id]
                    }
                }
            }

            function actually_setTimeout() {
                data.id = setTimeout(function() {
                    data.fn()
                }, delay)
            }
            if (callback) {
                data.fn = function(no_polling_loop) {
                    if (typeof callback === "string") {
                        callback = method_base[callback]
                    }
                    callback.apply(that, aps.call(args, slice_args)) === true && !no_polling_loop ? actually_setTimeout() : cleanup()
                };
                actually_setTimeout()
            } else {
                if (data.fn) {
                    delay === undefined ? cleanup() : data.fn(delay === false);
                    return true
                } else {
                    cleanup()
                }
            }
        }
    })(jQuery)
});
Module.define("jquery", [], function(module) {
    /*! jQuery v1.11.1 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
    ! function(a, b) {
        "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
            if (!a.document) {
                throw new Error("jQuery requires a window with a document")
            }
            return b(a)
        } : b(a)
    }("undefined" != typeof window ? window : this, function(a, b) {
        var c = [],
            d = c.slice,
            e = c.concat,
            f = c.push,
            g = c.indexOf,
            h = {},
            i = h.toString,
            j = h.hasOwnProperty,
            k = {},
            l = "1.11.1",
            m = function(a, b) {
                return new m.fn.init(a, b)
            },
            n = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            o = /^-ms-/,
            p = /-([\da-z])/gi,
            q = function(a, b) {
                return b.toUpperCase()
            };
        m.fn = m.prototype = {
            jquery: l,
            constructor: m,
            selector: "",
            length: 0,
            toArray: function() {
                return d.call(this)
            },
            get: function(a) {
                return null != a ? 0 > a ? this[a + this.length] : this[a] : d.call(this)
            },
            pushStack: function(a) {
                var b = m.merge(this.constructor(), a);
                return b.prevObject = this, b.context = this.context, b
            },
            each: function(a, b) {
                return m.each(this, a, b)
            },
            map: function(a) {
                return this.pushStack(m.map(this, function(b, c) {
                    return a.call(b, c, b)
                }))
            },
            slice: function() {
                return this.pushStack(d.apply(this, arguments))
            },
            first: function() {
                return this.eq(0)
            },
            last: function() {
                return this.eq(-1)
            },
            eq: function(a) {
                var b = this.length,
                    c = +a + (0 > a ? b : 0);
                return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
            },
            end: function() {
                return this.prevObject || this.constructor(null)
            },
            push: f,
            sort: c.sort,
            splice: c.splice
        }, m.extend = m.fn.extend = function() {
            var a, b, c, d, e, f, g = arguments[0] || {},
                h = 1,
                i = arguments.length,
                j = !1;
            for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || m.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++) {
                if (null != (e = arguments[h])) {
                    for (d in e) {
                        a = g[d], c = e[d], g !== c && (j && c && (m.isPlainObject(c) || (b = m.isArray(c))) ? (b ? (b = !1, f = a && m.isArray(a) ? a : []) : f = a && m.isPlainObject(a) ? a : {}, g[d] = m.extend(j, f, c)) : void 0 !== c && (g[d] = c))
                    }
                }
            }
            return g
        }, m.extend({
            expando: "jQuery" + (l + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(a) {
                throw new Error(a)
            },
            noop: function() {},
            isFunction: function(a) {
                return "function" === m.type(a)
            },
            isArray: Array.isArray || function(a) {
                return "array" === m.type(a)
            },
            isWindow: function(a) {
                return null != a && a == a.window
            },
            isNumeric: function(a) {
                return !m.isArray(a) && a - parseFloat(a) >= 0
            },
            isEmptyObject: function(a) {
                var b;
                for (b in a) {
                    return !1
                }
                return !0
            },
            isPlainObject: function(a) {
                var b;
                if (!a || "object" !== m.type(a) || a.nodeType || m.isWindow(a)) {
                    return !1
                }
                try {
                    if (a.constructor && !j.call(a, "constructor") && !j.call(a.constructor.prototype, "isPrototypeOf")) {
                        return !1
                    }
                } catch (c) {
                    return !1
                }
                if (k.ownLast) {
                    for (b in a) {
                        return j.call(a, b)
                    }
                }
                for (b in a) {}
                return void 0 === b || j.call(a, b)
            },
            type: function(a) {
                return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? h[i.call(a)] || "object" : typeof a
            },
            globalEval: function(b) {
                b && m.trim(b) && (a.execScript || function(b) {
                    a.eval.call(a, b)
                })(b)
            },
            camelCase: function(a) {
                return a.replace(o, "ms-").replace(p, q)
            },
            nodeName: function(a, b) {
                return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
            },
            each: function(a, b, c) {
                var d, e = 0,
                    f = a.length,
                    g = r(a);
                if (c) {
                    if (g) {
                        for (; f > e; e++) {
                            if (d = b.apply(a[e], c), d === !1) {
                                break
                            }
                        }
                    } else {
                        for (e in a) {
                            if (d = b.apply(a[e], c), d === !1) {
                                break
                            }
                        }
                    }
                } else {
                    if (g) {
                        for (; f > e; e++) {
                            if (d = b.call(a[e], e, a[e]), d === !1) {
                                break
                            }
                        }
                    } else {
                        for (e in a) {
                            if (d = b.call(a[e], e, a[e]), d === !1) {
                                break
                            }
                        }
                    }
                }
                return a
            },
            trim: function(a) {
                return null == a ? "" : (a + "").replace(n, "")
            },
            makeArray: function(a, b) {
                var c = b || [];
                return null != a && (r(Object(a)) ? m.merge(c, "string" == typeof a ? [a] : a) : f.call(c, a)), c
            },
            inArray: function(a, b, c) {
                var d;
                if (b) {
                    if (g) {
                        return g.call(b, a, c)
                    }
                    for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++) {
                        if (c in b && b[c] === a) {
                            return c
                        }
                    }
                }
                return -1
            },
            merge: function(a, b) {
                var c = +b.length,
                    d = 0,
                    e = a.length;
                while (c > d) {
                    a[e++] = b[d++]
                }
                if (c !== c) {
                    while (void 0 !== b[d]) {
                        a[e++] = b[d++]
                    }
                }
                return a.length = e, a
            },
            grep: function(a, b, c) {
                for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) {
                    d = !b(a[f], f), d !== h && e.push(a[f])
                }
                return e
            },
            map: function(a, b, c) {
                var d, f = 0,
                    g = a.length,
                    h = r(a),
                    i = [];
                if (h) {
                    for (; g > f; f++) {
                        d = b(a[f], f, c), null != d && i.push(d)
                    }
                } else {
                    for (f in a) {
                        d = b(a[f], f, c), null != d && i.push(d)
                    }
                }
                return e.apply([], i)
            },
            guid: 1,
            proxy: function(a, b) {
                var c, e, f;
                return "string" == typeof b && (f = a[b], b = a, a = f), m.isFunction(a) ? (c = d.call(arguments, 2), e = function() {
                    return a.apply(b || this, c.concat(d.call(arguments)))
                }, e.guid = a.guid = a.guid || m.guid++, e) : void 0
            },
            now: function() {
                return +new Date
            },
            support: k
        }), m.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
            h["[object " + b + "]"] = b.toLowerCase()
        });

        function r(a) {
            var b = a.length,
                c = m.type(a);
            return "function" === c || m.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
        }
        var s = function(a) {
            var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u = "sizzle" + -new Date,
                v = a.document,
                w = 0,
                x = 0,
                y = gb(),
                z = gb(),
                A = gb(),
                B = function(a, b) {
                    return a === b && (l = !0), 0
                },
                C = "undefined",
                D = 1 << 31,
                E = {}.hasOwnProperty,
                F = [],
                G = F.pop,
                H = F.push,
                I = F.push,
                J = F.slice,
                K = F.indexOf || function(a) {
                    for (var b = 0, c = this.length; c > b; b++) {
                        if (this[b] === a) {
                            return b
                        }
                    }
                    return -1
                },
                L = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                M = "[\\x20\\t\\r\\n\\f]",
                N = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                O = N.replace("w", "w#"),
                P = "\\[" + M + "*(" + N + ")(?:" + M + "*([*^$|!~]?=)" + M + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + O + "))|)" + M + "*\\]",
                Q = ":(" + N + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + P + ")*)|.*)\\)|)",
                R = new RegExp("^" + M + "+|((?:^|[^\\\\])(?:\\\\.)*)" + M + "+$", "g"),
                S = new RegExp("^" + M + "*," + M + "*"),
                T = new RegExp("^" + M + "*([>+~]|" + M + ")" + M + "*"),
                U = new RegExp("=" + M + "*([^\\]'\"]*?)" + M + "*\\]", "g"),
                V = new RegExp(Q),
                W = new RegExp("^" + O + "$"),
                X = {
                    ID: new RegExp("^#(" + N + ")"),
                    CLASS: new RegExp("^\\.(" + N + ")"),
                    TAG: new RegExp("^(" + N.replace("w", "w*") + ")"),
                    ATTR: new RegExp("^" + P),
                    PSEUDO: new RegExp("^" + Q),
                    CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + M + "*(even|odd|(([+-]|)(\\d*)n|)" + M + "*(?:([+-]|)" + M + "*(\\d+)|))" + M + "*\\)|)", "i"),
                    bool: new RegExp("^(?:" + L + ")$", "i"),
                    needsContext: new RegExp("^" + M + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + M + "*((?:-\\d)?\\d*)" + M + "*\\)|)(?=[^-]|$)", "i")
                },
                Y = /^(?:input|select|textarea|button)$/i,
                Z = /^h\d$/i,
                $ = /^[^{]+\{\s*\[native \w/,
                _ = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                ab = /[+~]/,
                bb = /'|\\/g,
                cb = new RegExp("\\\\([\\da-f]{1,6}" + M + "?|(" + M + ")|.)", "ig"),
                db = function(a, b, c) {
                    var d = "0x" + b - 65536;
                    return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
                };
            try {
                I.apply(F = J.call(v.childNodes), v.childNodes), F[v.childNodes.length].nodeType
            } catch (eb) {
                I = {
                    apply: F.length ? function(a, b) {
                        H.apply(a, J.call(b))
                    } : function(a, b) {
                        var c = a.length,
                            d = 0;
                        while (a[c++] = b[d++]) {}
                        a.length = c - 1
                    }
                }
            }

            function fb(a, b, d, e) {
                var f, h, j, k, l, o, r, s, w, x;
                if ((b ? b.ownerDocument || b : v) !== n && m(b), b = b || n, d = d || [], !a || "string" != typeof a) {
                    return d
                }
                if (1 !== (k = b.nodeType) && 9 !== k) {
                    return []
                }
                if (p && !e) {
                    if (f = _.exec(a)) {
                        if (j = f[1]) {
                            if (9 === k) {
                                if (h = b.getElementById(j), !h || !h.parentNode) {
                                    return d
                                }
                                if (h.id === j) {
                                    return d.push(h), d
                                }
                            } else {
                                if (b.ownerDocument && (h = b.ownerDocument.getElementById(j)) && t(b, h) && h.id === j) {
                                    return d.push(h), d
                                }
                            }
                        } else {
                            if (f[2]) {
                                return I.apply(d, b.getElementsByTagName(a)), d
                            }
                            if ((j = f[3]) && c.getElementsByClassName && b.getElementsByClassName) {
                                return I.apply(d, b.getElementsByClassName(j)), d
                            }
                        }
                    }
                    if (c.qsa && (!q || !q.test(a))) {
                        if (s = r = u, w = b, x = 9 === k && a, 1 === k && "object" !== b.nodeName.toLowerCase()) {
                            o = g(a), (r = b.getAttribute("id")) ? s = r.replace(bb, "\\$&") : b.setAttribute("id", s), s = "[id='" + s + "'] ", l = o.length;
                            while (l--) {
                                o[l] = s + qb(o[l])
                            }
                            w = ab.test(a) && ob(b.parentNode) || b, x = o.join(",")
                        }
                        if (x) {
                            try {
                                return I.apply(d, w.querySelectorAll(x)), d
                            } catch (y) {} finally {
                                r || b.removeAttribute("id")
                            }
                        }
                    }
                }
                return i(a.replace(R, "$1"), b, d, e)
            }

            function gb() {
                var a = [];

                function b(c, e) {
                    return a.push(c + " ") > d.cacheLength && delete b[a.shift()], b[c + " "] = e
                }
                return b
            }

            function hb(a) {
                return a[u] = !0, a
            }

            function ib(a) {
                var b = n.createElement("div");
                try {
                    return !!a(b)
                } catch (c) {
                    return !1
                } finally {
                    b.parentNode && b.parentNode.removeChild(b), b = null
                }
            }

            function jb(a, b) {
                var c = a.split("|"),
                    e = a.length;
                while (e--) {
                    d.attrHandle[c[e]] = b
                }
            }

            function kb(a, b) {
                var c = b && a,
                    d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || D) - (~a.sourceIndex || D);
                if (d) {
                    return d
                }
                if (c) {
                    while (c = c.nextSibling) {
                        if (c === b) {
                            return -1
                        }
                    }
                }
                return a ? 1 : -1
            }

            function lb(a) {
                return function(b) {
                    var c = b.nodeName.toLowerCase();
                    return "input" === c && b.type === a
                }
            }

            function mb(a) {
                return function(b) {
                    var c = b.nodeName.toLowerCase();
                    return ("input" === c || "button" === c) && b.type === a
                }
            }

            function nb(a) {
                return hb(function(b) {
                    return b = +b, hb(function(c, d) {
                        var e, f = a([], c.length, b),
                            g = f.length;
                        while (g--) {
                            c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                        }
                    })
                })
            }

            function ob(a) {
                return a && typeof a.getElementsByTagName !== C && a
            }
            c = fb.support = {}, f = fb.isXML = function(a) {
                var b = a && (a.ownerDocument || a).documentElement;
                return b ? "HTML" !== b.nodeName : !1
            }, m = fb.setDocument = function(a) {
                var b, e = a ? a.ownerDocument || a : v,
                    g = e.defaultView;
                return e !== n && 9 === e.nodeType && e.documentElement ? (n = e, o = e.documentElement, p = !f(e), g && g !== g.top && (g.addEventListener ? g.addEventListener("unload", function() {
                    m()
                }, !1) : g.attachEvent && g.attachEvent("onunload", function() {
                    m()
                })), c.attributes = ib(function(a) {
                    return a.className = "i", !a.getAttribute("className")
                }), c.getElementsByTagName = ib(function(a) {
                    return a.appendChild(e.createComment("")), !a.getElementsByTagName("*").length
                }), c.getElementsByClassName = $.test(e.getElementsByClassName) && ib(function(a) {
                    return a.innerHTML = "<div class='a'></div><div class='a i'></div>", a.firstChild.className = "i", 2 === a.getElementsByClassName("i").length
                }), c.getById = ib(function(a) {
                    return o.appendChild(a).id = u, !e.getElementsByName || !e.getElementsByName(u).length
                }), c.getById ? (d.find.ID = function(a, b) {
                    if (typeof b.getElementById !== C && p) {
                        var c = b.getElementById(a);
                        return c && c.parentNode ? [c] : []
                    }
                }, d.filter.ID = function(a) {
                    var b = a.replace(cb, db);
                    return function(a) {
                        return a.getAttribute("id") === b
                    }
                }) : (delete d.find.ID, d.filter.ID = function(a) {
                    var b = a.replace(cb, db);
                    return function(a) {
                        var c = typeof a.getAttributeNode !== C && a.getAttributeNode("id");
                        return c && c.value === b
                    }
                }), d.find.TAG = c.getElementsByTagName ? function(a, b) {
                    return typeof b.getElementsByTagName !== C ? b.getElementsByTagName(a) : void 0
                } : function(a, b) {
                    var c, d = [],
                        e = 0,
                        f = b.getElementsByTagName(a);
                    if ("*" === a) {
                        while (c = f[e++]) {
                            1 === c.nodeType && d.push(c)
                        }
                        return d
                    }
                    return f
                }, d.find.CLASS = c.getElementsByClassName && function(a, b) {
                    return typeof b.getElementsByClassName !== C && p ? b.getElementsByClassName(a) : void 0
                }, r = [], q = [], (c.qsa = $.test(e.querySelectorAll)) && (ib(function(a) {
                    a.innerHTML = "<select msallowclip=''><option selected=''></option></select>", a.querySelectorAll("[msallowclip^='']").length && q.push("[*^$]=" + M + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || q.push("\\[" + M + "*(?:value|" + L + ")"), a.querySelectorAll(":checked").length || q.push(":checked")
                }), ib(function(a) {
                    var b = e.createElement("input");
                    b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && q.push("name" + M + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || q.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), q.push(",.*:")
                })), (c.matchesSelector = $.test(s = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector)) && ib(function(a) {
                    c.disconnectedMatch = s.call(a, "div"), s.call(a, "[s!='']:x"), r.push("!=", Q)
                }), q = q.length && new RegExp(q.join("|")), r = r.length && new RegExp(r.join("|")), b = $.test(o.compareDocumentPosition), t = b || $.test(o.contains) ? function(a, b) {
                    var c = 9 === a.nodeType ? a.documentElement : a,
                        d = b && b.parentNode;
                    return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
                } : function(a, b) {
                    if (b) {
                        while (b = b.parentNode) {
                            if (b === a) {
                                return !0
                            }
                        }
                    }
                    return !1
                }, B = b ? function(a, b) {
                    if (a === b) {
                        return l = !0, 0
                    }
                    var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
                    return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === e || a.ownerDocument === v && t(v, a) ? -1 : b === e || b.ownerDocument === v && t(v, b) ? 1 : k ? K.call(k, a) - K.call(k, b) : 0 : 4 & d ? -1 : 1)
                } : function(a, b) {
                    if (a === b) {
                        return l = !0, 0
                    }
                    var c, d = 0,
                        f = a.parentNode,
                        g = b.parentNode,
                        h = [a],
                        i = [b];
                    if (!f || !g) {
                        return a === e ? -1 : b === e ? 1 : f ? -1 : g ? 1 : k ? K.call(k, a) - K.call(k, b) : 0
                    }
                    if (f === g) {
                        return kb(a, b)
                    }
                    c = a;
                    while (c = c.parentNode) {
                        h.unshift(c)
                    }
                    c = b;
                    while (c = c.parentNode) {
                        i.unshift(c)
                    }
                    while (h[d] === i[d]) {
                        d++
                    }
                    return d ? kb(h[d], i[d]) : h[d] === v ? -1 : i[d] === v ? 1 : 0
                }, e) : n
            }, fb.matches = function(a, b) {
                return fb(a, null, null, b)
            }, fb.matchesSelector = function(a, b) {
                if ((a.ownerDocument || a) !== n && m(a), b = b.replace(U, "='$1']"), !(!c.matchesSelector || !p || r && r.test(b) || q && q.test(b))) {
                    try {
                        var d = s.call(a, b);
                        if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType) {
                            return d
                        }
                    } catch (e) {}
                }
                return fb(b, n, null, [a]).length > 0
            }, fb.contains = function(a, b) {
                return (a.ownerDocument || a) !== n && m(a), t(a, b)
            }, fb.attr = function(a, b) {
                (a.ownerDocument || a) !== n && m(a);
                var e = d.attrHandle[b.toLowerCase()],
                    f = e && E.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0;
                return void 0 !== f ? f : c.attributes || !p ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null
            }, fb.error = function(a) {
                throw new Error("Syntax error, unrecognized expression: " + a)
            }, fb.uniqueSort = function(a) {
                var b, d = [],
                    e = 0,
                    f = 0;
                if (l = !c.detectDuplicates, k = !c.sortStable && a.slice(0), a.sort(B), l) {
                    while (b = a[f++]) {
                        b === a[f] && (e = d.push(f))
                    }
                    while (e--) {
                        a.splice(d[e], 1)
                    }
                }
                return k = null, a
            }, e = fb.getText = function(a) {
                var b, c = "",
                    d = 0,
                    f = a.nodeType;
                if (f) {
                    if (1 === f || 9 === f || 11 === f) {
                        if ("string" == typeof a.textContent) {
                            return a.textContent
                        }
                        for (a = a.firstChild; a; a = a.nextSibling) {
                            c += e(a)
                        }
                    } else {
                        if (3 === f || 4 === f) {
                            return a.nodeValue
                        }
                    }
                } else {
                    while (b = a[d++]) {
                        c += e(b)
                    }
                }
                return c
            }, d = fb.selectors = {
                cacheLength: 50,
                createPseudo: hb,
                match: X,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(a) {
                        return a[1] = a[1].replace(cb, db), a[3] = (a[3] || a[4] || a[5] || "").replace(cb, db), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
                    },
                    CHILD: function(a) {
                        return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || fb.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && fb.error(a[0]), a
                    },
                    PSEUDO: function(a) {
                        var b, c = !a[6] && a[2];
                        return X.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && V.test(c) && (b = g(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(a) {
                        var b = a.replace(cb, db).toLowerCase();
                        return "*" === a ? function() {
                            return !0
                        } : function(a) {
                            return a.nodeName && a.nodeName.toLowerCase() === b
                        }
                    },
                    CLASS: function(a) {
                        var b = y[a + " "];
                        return b || (b = new RegExp("(^|" + M + ")" + a + "(" + M + "|$)")) && y(a, function(a) {
                            return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== C && a.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(a, b, c) {
                        return function(d) {
                            var e = fb.attr(d, a);
                            return null == e ? "!=" === b : b ? (e += "", "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0
                        }
                    },
                    CHILD: function(a, b, c, d, e) {
                        var f = "nth" !== a.slice(0, 3),
                            g = "last" !== a.slice(-4),
                            h = "of-type" === b;
                        return 1 === d && 0 === e ? function(a) {
                            return !!a.parentNode
                        } : function(b, c, i) {
                            var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling",
                                q = b.parentNode,
                                r = h && b.nodeName.toLowerCase(),
                                s = !i && !h;
                            if (q) {
                                if (f) {
                                    while (p) {
                                        l = b;
                                        while (l = l[p]) {
                                            if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) {
                                                return !1
                                            }
                                        }
                                        o = p = "only" === a && !o && "nextSibling"
                                    }
                                    return !0
                                }
                                if (o = [g ? q.firstChild : q.lastChild], g && s) {
                                    k = q[u] || (q[u] = {}), j = k[a] || [], n = j[0] === w && j[1], m = j[0] === w && j[2], l = n && q.childNodes[n];
                                    while (l = ++n && l && l[p] || (m = n = 0) || o.pop()) {
                                        if (1 === l.nodeType && ++m && l === b) {
                                            k[a] = [w, n, m];
                                            break
                                        }
                                    }
                                } else {
                                    if (s && (j = (b[u] || (b[u] = {}))[a]) && j[0] === w) {
                                        m = j[1]
                                    } else {
                                        while (l = ++n && l && l[p] || (m = n = 0) || o.pop()) {
                                            if ((h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) && ++m && (s && ((l[u] || (l[u] = {}))[a] = [w, m]), l === b)) {
                                                break
                                            }
                                        }
                                    }
                                }
                                return m -= e, m === d || m % d === 0 && m / d >= 0
                            }
                        }
                    },
                    PSEUDO: function(a, b) {
                        var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || fb.error("unsupported pseudo: " + a);
                        return e[u] ? e(b) : e.length > 1 ? (c = [a, a, "", b], d.setFilters.hasOwnProperty(a.toLowerCase()) ? hb(function(a, c) {
                            var d, f = e(a, b),
                                g = f.length;
                            while (g--) {
                                d = K.call(a, f[g]), a[d] = !(c[d] = f[g])
                            }
                        }) : function(a) {
                            return e(a, 0, c)
                        }) : e
                    }
                },
                pseudos: {
                    not: hb(function(a) {
                        var b = [],
                            c = [],
                            d = h(a.replace(R, "$1"));
                        return d[u] ? hb(function(a, b, c, e) {
                            var f, g = d(a, null, e, []),
                                h = a.length;
                            while (h--) {
                                (f = g[h]) && (a[h] = !(b[h] = f))
                            }
                        }) : function(a, e, f) {
                            return b[0] = a, d(b, null, f, c), !c.pop()
                        }
                    }),
                    has: hb(function(a) {
                        return function(b) {
                            return fb(a, b).length > 0
                        }
                    }),
                    contains: hb(function(a) {
                        return function(b) {
                            return (b.textContent || b.innerText || e(b)).indexOf(a) > -1
                        }
                    }),
                    lang: hb(function(a) {
                        return W.test(a || "") || fb.error("unsupported lang: " + a), a = a.replace(cb, db).toLowerCase(),
                            function(b) {
                                var c;
                                do {
                                    if (c = p ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) {
                                        return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-")
                                    }
                                } while ((b = b.parentNode) && 1 === b.nodeType);
                                return !1
                            }
                    }),
                    target: function(b) {
                        var c = a.location && a.location.hash;
                        return c && c.slice(1) === b.id
                    },
                    root: function(a) {
                        return a === o
                    },
                    focus: function(a) {
                        return a === n.activeElement && (!n.hasFocus || n.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
                    },
                    enabled: function(a) {
                        return a.disabled === !1
                    },
                    disabled: function(a) {
                        return a.disabled === !0
                    },
                    checked: function(a) {
                        var b = a.nodeName.toLowerCase();
                        return "input" === b && !!a.checked || "option" === b && !!a.selected
                    },
                    selected: function(a) {
                        return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
                    },
                    empty: function(a) {
                        for (a = a.firstChild; a; a = a.nextSibling) {
                            if (a.nodeType < 6) {
                                return !1
                            }
                        }
                        return !0
                    },
                    parent: function(a) {
                        return !d.pseudos.empty(a)
                    },
                    header: function(a) {
                        return Z.test(a.nodeName)
                    },
                    input: function(a) {
                        return Y.test(a.nodeName)
                    },
                    button: function(a) {
                        var b = a.nodeName.toLowerCase();
                        return "input" === b && "button" === a.type || "button" === b
                    },
                    text: function(a) {
                        var b;
                        return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
                    },
                    first: nb(function() {
                        return [0]
                    }),
                    last: nb(function(a, b) {
                        return [b - 1]
                    }),
                    eq: nb(function(a, b, c) {
                        return [0 > c ? c + b : c]
                    }),
                    even: nb(function(a, b) {
                        for (var c = 0; b > c; c += 2) {
                            a.push(c)
                        }
                        return a
                    }),
                    odd: nb(function(a, b) {
                        for (var c = 1; b > c; c += 2) {
                            a.push(c)
                        }
                        return a
                    }),
                    lt: nb(function(a, b, c) {
                        for (var d = 0 > c ? c + b : c; --d >= 0;) {
                            a.push(d)
                        }
                        return a
                    }),
                    gt: nb(function(a, b, c) {
                        for (var d = 0 > c ? c + b : c; ++d < b;) {
                            a.push(d)
                        }
                        return a
                    })
                }
            }, d.pseudos.nth = d.pseudos.eq;
            for (b in {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0
                }) {
                d.pseudos[b] = lb(b)
            }
            for (b in {
                    submit: !0,
                    reset: !0
                }) {
                d.pseudos[b] = mb(b)
            }

            function pb() {}
            pb.prototype = d.filters = d.pseudos, d.setFilters = new pb, g = fb.tokenize = function(a, b) {
                var c, e, f, g, h, i, j, k = z[a + " "];
                if (k) {
                    return b ? 0 : k.slice(0)
                }
                h = a, i = [], j = d.preFilter;
                while (h) {
                    (!c || (e = S.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), c = !1, (e = T.exec(h)) && (c = e.shift(), f.push({
                        value: c,
                        type: e[0].replace(R, " ")
                    }), h = h.slice(c.length));
                    for (g in d.filter) {
                        !(e = X[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(), f.push({
                            value: c,
                            type: g,
                            matches: e
                        }), h = h.slice(c.length))
                    }
                    if (!c) {
                        break
                    }
                }
                return b ? h.length : h ? fb.error(a) : z(a, i).slice(0)
            };

            function qb(a) {
                for (var b = 0, c = a.length, d = ""; c > b; b++) {
                    d += a[b].value
                }
                return d
            }

            function rb(a, b, c) {
                var d = b.dir,
                    e = c && "parentNode" === d,
                    f = x++;
                return b.first ? function(b, c, f) {
                    while (b = b[d]) {
                        if (1 === b.nodeType || e) {
                            return a(b, c, f)
                        }
                    }
                } : function(b, c, g) {
                    var h, i, j = [w, f];
                    if (g) {
                        while (b = b[d]) {
                            if ((1 === b.nodeType || e) && a(b, c, g)) {
                                return !0
                            }
                        }
                    } else {
                        while (b = b[d]) {
                            if (1 === b.nodeType || e) {
                                if (i = b[u] || (b[u] = {}), (h = i[d]) && h[0] === w && h[1] === f) {
                                    return j[2] = h[2]
                                }
                                if (i[d] = j, j[2] = a(b, c, g)) {
                                    return !0
                                }
                            }
                        }
                    }
                }
            }

            function sb(a) {
                return a.length > 1 ? function(b, c, d) {
                    var e = a.length;
                    while (e--) {
                        if (!a[e](b, c, d)) {
                            return !1
                        }
                    }
                    return !0
                } : a[0]
            }

            function tb(a, b, c) {
                for (var d = 0, e = b.length; e > d; d++) {
                    fb(a, b[d], c)
                }
                return c
            }

            function ub(a, b, c, d, e) {
                for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++) {
                    (f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h))
                }
                return g
            }

            function vb(a, b, c, d, e, f) {
                return d && !d[u] && (d = vb(d)), e && !e[u] && (e = vb(e, f)), hb(function(f, g, h, i) {
                    var j, k, l, m = [],
                        n = [],
                        o = g.length,
                        p = f || tb(b || "*", h.nodeType ? [h] : h, []),
                        q = !a || !f && b ? p : ub(p, m, a, h, i),
                        r = c ? e || (f ? a : o || d) ? [] : g : q;
                    if (c && c(q, r, h, i), d) {
                        j = ub(r, n), d(j, [], h, i), k = j.length;
                        while (k--) {
                            (l = j[k]) && (r[n[k]] = !(q[n[k]] = l))
                        }
                    }
                    if (f) {
                        if (e || a) {
                            if (e) {
                                j = [], k = r.length;
                                while (k--) {
                                    (l = r[k]) && j.push(q[k] = l)
                                }
                                e(null, r = [], j, i)
                            }
                            k = r.length;
                            while (k--) {
                                (l = r[k]) && (j = e ? K.call(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l))
                            }
                        }
                    } else {
                        r = ub(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : I.apply(g, r)
                    }
                })
            }

            function wb(a) {
                for (var b, c, e, f = a.length, g = d.relative[a[0].type], h = g || d.relative[" "], i = g ? 1 : 0, k = rb(function(a) {
                        return a === b
                    }, h, !0), l = rb(function(a) {
                        return K.call(b, a) > -1
                    }, h, !0), m = [function(a, c, d) {
                        return !g && (d || c !== j) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d))
                    }]; f > i; i++) {
                    if (c = d.relative[a[i].type]) {
                        m = [rb(sb(m), c)]
                    } else {
                        if (c = d.filter[a[i].type].apply(null, a[i].matches), c[u]) {
                            for (e = ++i; f > e; e++) {
                                if (d.relative[a[e].type]) {
                                    break
                                }
                            }
                            return vb(i > 1 && sb(m), i > 1 && qb(a.slice(0, i - 1).concat({
                                value: " " === a[i - 2].type ? "*" : ""
                            })).replace(R, "$1"), c, e > i && wb(a.slice(i, e)), f > e && wb(a = a.slice(e)), f > e && qb(a))
                        }
                        m.push(c)
                    }
                }
                return sb(m)
            }

            function xb(a, b) {
                var c = b.length > 0,
                    e = a.length > 0,
                    f = function(f, g, h, i, k) {
                        var l, m, o, p = 0,
                            q = "0",
                            r = f && [],
                            s = [],
                            t = j,
                            u = f || e && d.find.TAG("*", k),
                            v = w += null == t ? 1 : Math.random() || 0.1,
                            x = u.length;
                        for (k && (j = g !== n && g); q !== x && null != (l = u[q]); q++) {
                            if (e && l) {
                                m = 0;
                                while (o = a[m++]) {
                                    if (o(l, g, h)) {
                                        i.push(l);
                                        break
                                    }
                                }
                                k && (w = v)
                            }
                            c && ((l = !o && l) && p--, f && r.push(l))
                        }
                        if (p += q, c && q !== p) {
                            m = 0;
                            while (o = b[m++]) {
                                o(r, s, g, h)
                            }
                            if (f) {
                                if (p > 0) {
                                    while (q--) {
                                        r[q] || s[q] || (s[q] = G.call(i))
                                    }
                                }
                                s = ub(s)
                            }
                            I.apply(i, s), k && !f && s.length > 0 && p + b.length > 1 && fb.uniqueSort(i)
                        }
                        return k && (w = v, j = t), r
                    };
                return c ? hb(f) : f
            }
            return h = fb.compile = function(a, b) {
                var c, d = [],
                    e = [],
                    f = A[a + " "];
                if (!f) {
                    b || (b = g(a)), c = b.length;
                    while (c--) {
                        f = wb(b[c]), f[u] ? d.push(f) : e.push(f)
                    }
                    f = A(a, xb(e, d)), f.selector = a
                }
                return f
            }, i = fb.select = function(a, b, e, f) {
                var i, j, k, l, m, n = "function" == typeof a && a,
                    o = !f && g(a = n.selector || a);
                if (e = e || [], 1 === o.length) {
                    if (j = o[0] = o[0].slice(0), j.length > 2 && "ID" === (k = j[0]).type && c.getById && 9 === b.nodeType && p && d.relative[j[1].type]) {
                        if (b = (d.find.ID(k.matches[0].replace(cb, db), b) || [])[0], !b) {
                            return e
                        }
                        n && (b = b.parentNode), a = a.slice(j.shift().value.length)
                    }
                    i = X.needsContext.test(a) ? 0 : j.length;
                    while (i--) {
                        if (k = j[i], d.relative[l = k.type]) {
                            break
                        }
                        if ((m = d.find[l]) && (f = m(k.matches[0].replace(cb, db), ab.test(j[0].type) && ob(b.parentNode) || b))) {
                            if (j.splice(i, 1), a = f.length && qb(j), !a) {
                                return I.apply(e, f), e
                            }
                            break
                        }
                    }
                }
                return (n || h(a, o))(f, b, !p, e, ab.test(a) && ob(b.parentNode) || b), e
            }, c.sortStable = u.split("").sort(B).join("") === u, c.detectDuplicates = !!l, m(), c.sortDetached = ib(function(a) {
                return 1 & a.compareDocumentPosition(n.createElement("div"))
            }), ib(function(a) {
                return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
            }) || jb("type|href|height|width", function(a, b, c) {
                return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
            }), c.attributes && ib(function(a) {
                return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
            }) || jb("value", function(a, b, c) {
                return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
            }), ib(function(a) {
                return null == a.getAttribute("disabled")
            }) || jb(L, function(a, b, c) {
                var d;
                return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
            }), fb
        }(a);
        m.find = s, m.expr = s.selectors, m.expr[":"] = m.expr.pseudos, m.unique = s.uniqueSort, m.text = s.getText, m.isXMLDoc = s.isXML, m.contains = s.contains;
        var t = m.expr.match.needsContext,
            u = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
            v = /^.[^:#\[\.,]*$/;

        function w(a, b, c) {
            if (m.isFunction(b)) {
                return m.grep(a, function(a, d) {
                    return !!b.call(a, d, a) !== c
                })
            }
            if (b.nodeType) {
                return m.grep(a, function(a) {
                    return a === b !== c
                })
            }
            if ("string" == typeof b) {
                if (v.test(b)) {
                    return m.filter(b, a, c)
                }
                b = m.filter(b, a)
            }
            return m.grep(a, function(a) {
                return m.inArray(a, b) >= 0 !== c
            })
        }
        m.filter = function(a, b, c) {
            var d = b[0];
            return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? m.find.matchesSelector(d, a) ? [d] : [] : m.find.matches(a, m.grep(b, function(a) {
                return 1 === a.nodeType
            }))
        }, m.fn.extend({
            find: function(a) {
                var b, c = [],
                    d = this,
                    e = d.length;
                if ("string" != typeof a) {
                    return this.pushStack(m(a).filter(function() {
                        for (b = 0; e > b; b++) {
                            if (m.contains(d[b], this)) {
                                return !0
                            }
                        }
                    }))
                }
                for (b = 0; e > b; b++) {
                    m.find(a, d[b], c)
                }
                return c = this.pushStack(e > 1 ? m.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, c
            },
            filter: function(a) {
                return this.pushStack(w(this, a || [], !1))
            },
            not: function(a) {
                return this.pushStack(w(this, a || [], !0))
            },
            is: function(a) {
                return !!w(this, "string" == typeof a && t.test(a) ? m(a) : a || [], !1).length
            }
        });
        var x, y = a.document,
            z = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
            A = m.fn.init = function(a, b) {
                var c, d;
                if (!a) {
                    return this
                }
                if ("string" == typeof a) {
                    if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : z.exec(a), !c || !c[1] && b) {
                        return !b || b.jquery ? (b || x).find(a) : this.constructor(b).find(a)
                    }
                    if (c[1]) {
                        if (b = b instanceof m ? b[0] : b, m.merge(this, m.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : y, !0)), u.test(c[1]) && m.isPlainObject(b)) {
                            for (c in b) {
                                m.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c])
                            }
                        }
                        return this
                    }
                    if (d = y.getElementById(c[2]), d && d.parentNode) {
                        if (d.id !== c[2]) {
                            return x.find(a)
                        }
                        this.length = 1, this[0] = d
                    }
                    return this.context = y, this.selector = a, this
                }
                return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : m.isFunction(a) ? "undefined" != typeof x.ready ? x.ready(a) : a(m) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), m.makeArray(a, this))
            };
        A.prototype = m.fn, x = m(y);
        var B = /^(?:parents|prev(?:Until|All))/,
            C = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
        m.extend({
            dir: function(a, b, c) {
                var d = [],
                    e = a[b];
                while (e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !m(e).is(c))) {
                    1 === e.nodeType && d.push(e), e = e[b]
                }
                return d
            },
            sibling: function(a, b) {
                for (var c = []; a; a = a.nextSibling) {
                    1 === a.nodeType && a !== b && c.push(a)
                }
                return c
            }
        }), m.fn.extend({
            has: function(a) {
                var b, c = m(a, this),
                    d = c.length;
                return this.filter(function() {
                    for (b = 0; d > b; b++) {
                        if (m.contains(this, c[b])) {
                            return !0
                        }
                    }
                })
            },
            closest: function(a, b) {
                for (var c, d = 0, e = this.length, f = [], g = t.test(a) || "string" != typeof a ? m(a, b || this.context) : 0; e > d; d++) {
                    for (c = this[d]; c && c !== b; c = c.parentNode) {
                        if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && m.find.matchesSelector(c, a))) {
                            f.push(c);
                            break
                        }
                    }
                }
                return this.pushStack(f.length > 1 ? m.unique(f) : f)
            },
            index: function(a) {
                return a ? "string" == typeof a ? m.inArray(this[0], m(a)) : m.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function(a, b) {
                return this.pushStack(m.unique(m.merge(this.get(), m(a, b))))
            },
            addBack: function(a) {
                return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
            }
        });

        function D(a, b) {
            do {
                a = a[b]
            } while (a && 1 !== a.nodeType);
            return a
        }
        m.each({
            parent: function(a) {
                var b = a.parentNode;
                return b && 11 !== b.nodeType ? b : null
            },
            parents: function(a) {
                return m.dir(a, "parentNode")
            },
            parentsUntil: function(a, b, c) {
                return m.dir(a, "parentNode", c)
            },
            next: function(a) {
                return D(a, "nextSibling")
            },
            prev: function(a) {
                return D(a, "previousSibling")
            },
            nextAll: function(a) {
                return m.dir(a, "nextSibling")
            },
            prevAll: function(a) {
                return m.dir(a, "previousSibling")
            },
            nextUntil: function(a, b, c) {
                return m.dir(a, "nextSibling", c)
            },
            prevUntil: function(a, b, c) {
                return m.dir(a, "previousSibling", c)
            },
            siblings: function(a) {
                return m.sibling((a.parentNode || {}).firstChild, a)
            },
            children: function(a) {
                return m.sibling(a.firstChild)
            },
            contents: function(a) {
                return m.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : m.merge([], a.childNodes)
            }
        }, function(a, b) {
            m.fn[a] = function(c, d) {
                var e = m.map(this, b, c);
                return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = m.filter(d, e)), this.length > 1 && (C[a] || (e = m.unique(e)), B.test(a) && (e = e.reverse())), this.pushStack(e)
            }
        });
        var E = /\S+/g,
            F = {};

        function G(a) {
            var b = F[a] = {};
            return m.each(a.match(E) || [], function(a, c) {
                b[c] = !0
            }), b
        }
        m.Callbacks = function(a) {
            a = "string" == typeof a ? F[a] || G(a) : m.extend({}, a);
            var b, c, d, e, f, g, h = [],
                i = !a.once && [],
                j = function(l) {
                    for (c = a.memory && l, d = !0, f = g || 0, g = 0, e = h.length, b = !0; h && e > f; f++) {
                        if (h[f].apply(l[0], l[1]) === !1 && a.stopOnFalse) {
                            c = !1;
                            break
                        }
                    }
                    b = !1, h && (i ? i.length && j(i.shift()) : c ? h = [] : k.disable())
                },
                k = {
                    add: function() {
                        if (h) {
                            var d = h.length;
                            ! function f(b) {
                                m.each(b, function(b, c) {
                                    var d = m.type(c);
                                    "function" === d ? a.unique && k.has(c) || h.push(c) : c && c.length && "string" !== d && f(c)
                                })
                            }(arguments), b ? e = h.length : c && (g = d, j(c))
                        }
                        return this
                    },
                    remove: function() {
                        return h && m.each(arguments, function(a, c) {
                            var d;
                            while ((d = m.inArray(c, h, d)) > -1) {
                                h.splice(d, 1), b && (e >= d && e--, f >= d && f--)
                            }
                        }), this
                    },
                    has: function(a) {
                        return a ? m.inArray(a, h) > -1 : !(!h || !h.length)
                    },
                    empty: function() {
                        return h = [], e = 0, this
                    },
                    disable: function() {
                        return h = i = c = void 0, this
                    },
                    disabled: function() {
                        return !h
                    },
                    lock: function() {
                        return i = void 0, c || k.disable(), this
                    },
                    locked: function() {
                        return !i
                    },
                    fireWith: function(a, c) {
                        return !h || d && !i || (c = c || [], c = [a, c.slice ? c.slice() : c], b ? i.push(c) : j(c)), this
                    },
                    fire: function() {
                        return k.fireWith(this, arguments), this
                    },
                    fired: function() {
                        return !!d
                    }
                };
            return k
        }, m.extend({
            Deferred: function(a) {
                var b = [
                        ["resolve", "done", m.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", m.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", m.Callbacks("memory")]
                    ],
                    c = "pending",
                    d = {
                        state: function() {
                            return c
                        },
                        always: function() {
                            return e.done(arguments).fail(arguments), this
                        },
                        then: function() {
                            var a = arguments;
                            return m.Deferred(function(c) {
                                m.each(b, function(b, f) {
                                    var g = m.isFunction(a[b]) && a[b];
                                    e[f[1]](function() {
                                        var a = g && g.apply(this, arguments);
                                        a && m.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                                    })
                                }), a = null
                            }).promise()
                        },
                        promise: function(a) {
                            return null != a ? m.extend(a, d) : d
                        }
                    },
                    e = {};
                return d.pipe = d.then, m.each(b, function(a, f) {
                    var g = f[2],
                        h = f[3];
                    d[f[1]] = g.add, h && g.add(function() {
                        c = h
                    }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function() {
                        return e[f[0] + "With"](this === e ? d : this, arguments), this
                    }, e[f[0] + "With"] = g.fireWith
                }), d.promise(e), a && a.call(e, e), e
            },
            when: function(a) {
                var b = 0,
                    c = d.call(arguments),
                    e = c.length,
                    f = 1 !== e || a && m.isFunction(a.promise) ? e : 0,
                    g = 1 === f ? a : m.Deferred(),
                    h = function(a, b, c) {
                        return function(e) {
                            b[a] = this, c[a] = arguments.length > 1 ? d.call(arguments) : e, c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c)
                        }
                    },
                    i, j, k;
                if (e > 1) {
                    for (i = new Array(e), j = new Array(e), k = new Array(e); e > b; b++) {
                        c[b] && m.isFunction(c[b].promise) ? c[b].promise().done(h(b, k, c)).fail(g.reject).progress(h(b, j, i)) : --f
                    }
                }
                return f || g.resolveWith(k, c), g.promise()
            }
        });
        var H;
        m.fn.ready = function(a) {
            return m.ready.promise().done(a), this
        }, m.extend({
            isReady: !1,
            readyWait: 1,
            holdReady: function(a) {
                a ? m.readyWait++ : m.ready(!0)
            },
            ready: function(a) {
                if (a === !0 ? !--m.readyWait : !m.isReady) {
                    if (!y.body) {
                        return setTimeout(m.ready)
                    }
                    m.isReady = !0, a !== !0 && --m.readyWait > 0 || (H.resolveWith(y, [m]), m.fn.triggerHandler && (m(y).triggerHandler("ready"), m(y).off("ready")))
                }
            }
        });

        function I() {
            y.addEventListener ? (y.removeEventListener("DOMContentLoaded", J, !1), a.removeEventListener("load", J, !1)) : (y.detachEvent("onreadystatechange", J), a.detachEvent("onload", J))
        }

        function J() {
            (y.addEventListener || "load" === event.type || "complete" === y.readyState) && (I(), m.ready())
        }
        m.ready.promise = function(b) {
            if (!H) {
                if (H = m.Deferred(), "complete" === y.readyState) {
                    setTimeout(m.ready)
                } else {
                    if (y.addEventListener) {
                        y.addEventListener("DOMContentLoaded", J, !1), a.addEventListener("load", J, !1)
                    } else {
                        y.attachEvent("onreadystatechange", J), a.attachEvent("onload", J);
                        var c = !1;
                        try {
                            c = null == a.frameElement && y.documentElement
                        } catch (d) {}
                        c && c.doScroll && ! function e() {
                            if (!m.isReady) {
                                try {
                                    c.doScroll("left")
                                } catch (a) {
                                    return setTimeout(e, 50)
                                }
                                I(), m.ready()
                            }
                        }()
                    }
                }
            }
            return H.promise(b)
        };
        var K = "undefined",
            L;
        for (L in m(k)) {
            break
        }
        k.ownLast = "0" !== L, k.inlineBlockNeedsLayout = !1, m(function() {
                var a, b, c, d;
                c = y.getElementsByTagName("body")[0], c && c.style && (b = y.createElement("div"), d = y.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), typeof b.style.zoom !== K && (b.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", k.inlineBlockNeedsLayout = a = 3 === b.offsetWidth, a && (c.style.zoom = 1)), c.removeChild(d))
            }),
            function() {
                var a = y.createElement("div");
                if (null == k.deleteExpando) {
                    k.deleteExpando = !0;
                    try {
                        delete a.test
                    } catch (b) {
                        k.deleteExpando = !1
                    }
                }
                a = null
            }(), m.acceptData = function(a) {
                var b = m.noData[(a.nodeName + " ").toLowerCase()],
                    c = +a.nodeType || 1;
                return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b
            };
        var M = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            N = /([A-Z])/g;

        function O(a, b, c) {
            if (void 0 === c && 1 === a.nodeType) {
                var d = "data-" + b.replace(N, "-$1").toLowerCase();
                if (c = a.getAttribute(d), "string" == typeof c) {
                    try {
                        c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : M.test(c) ? m.parseJSON(c) : c
                    } catch (e) {}
                    m.data(a, b, c)
                } else {
                    c = void 0
                }
            }
            return c
        }

        function P(a) {
            var b;
            for (b in a) {
                if (("data" !== b || !m.isEmptyObject(a[b])) && "toJSON" !== b) {
                    return !1
                }
            }
            return !0
        }

        function Q(a, b, d, e) {
            if (m.acceptData(a)) {
                var f, g, h = m.expando,
                    i = a.nodeType,
                    j = i ? m.cache : a,
                    k = i ? a[h] : a[h] && h;
                if (k && j[k] && (e || j[k].data) || void 0 !== d || "string" != typeof b) {
                    return k || (k = i ? a[h] = c.pop() || m.guid++ : h), j[k] || (j[k] = i ? {} : {
                        toJSON: m.noop
                    }), ("object" == typeof b || "function" == typeof b) && (e ? j[k] = m.extend(j[k], b) : j[k].data = m.extend(j[k].data, b)), g = j[k], e || (g.data || (g.data = {}), g = g.data), void 0 !== d && (g[m.camelCase(b)] = d), "string" == typeof b ? (f = g[b], null == f && (f = g[m.camelCase(b)])) : f = g, f
                }
            }
        }

        function R(a, b, c) {
            if (m.acceptData(a)) {
                var d, e, f = a.nodeType,
                    g = f ? m.cache : a,
                    h = f ? a[m.expando] : m.expando;
                if (g[h]) {
                    if (b && (d = c ? g[h] : g[h].data)) {
                        m.isArray(b) ? b = b.concat(m.map(b, m.camelCase)) : b in d ? b = [b] : (b = m.camelCase(b), b = b in d ? [b] : b.split(" ")), e = b.length;
                        while (e--) {
                            delete d[b[e]]
                        }
                        if (c ? !P(d) : !m.isEmptyObject(d)) {
                            return
                        }
                    }(c || (delete g[h].data, P(g[h]))) && (f ? m.cleanData([a], !0) : k.deleteExpando || g != g.window ? delete g[h] : g[h] = null)
                }
            }
        }
        m.extend({
            cache: {},
            noData: {
                "applet ": !0,
                "embed ": !0,
                "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
            },
            hasData: function(a) {
                return a = a.nodeType ? m.cache[a[m.expando]] : a[m.expando], !!a && !P(a)
            },
            data: function(a, b, c) {
                return Q(a, b, c)
            },
            removeData: function(a, b) {
                return R(a, b)
            },
            _data: function(a, b, c) {
                return Q(a, b, c, !0)
            },
            _removeData: function(a, b) {
                return R(a, b, !0)
            }
        }), m.fn.extend({
            data: function(a, b) {
                var c, d, e, f = this[0],
                    g = f && f.attributes;
                if (void 0 === a) {
                    if (this.length && (e = m.data(f), 1 === f.nodeType && !m._data(f, "parsedAttrs"))) {
                        c = g.length;
                        while (c--) {
                            g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = m.camelCase(d.slice(5)), O(f, d, e[d])))
                        }
                        m._data(f, "parsedAttrs", !0)
                    }
                    return e
                }
                return "object" == typeof a ? this.each(function() {
                    m.data(this, a)
                }) : arguments.length > 1 ? this.each(function() {
                    m.data(this, a, b)
                }) : f ? O(f, a, m.data(f, a)) : void 0
            },
            removeData: function(a) {
                return this.each(function() {
                    m.removeData(this, a)
                })
            }
        }), m.extend({
            queue: function(a, b, c) {
                var d;
                return a ? (b = (b || "fx") + "queue", d = m._data(a, b), c && (!d || m.isArray(c) ? d = m._data(a, b, m.makeArray(c)) : d.push(c)), d || []) : void 0
            },
            dequeue: function(a, b) {
                b = b || "fx";
                var c = m.queue(a, b),
                    d = c.length,
                    e = c.shift(),
                    f = m._queueHooks(a, b),
                    g = function() {
                        m.dequeue(a, b)
                    };
                "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
            },
            _queueHooks: function(a, b) {
                var c = b + "queueHooks";
                return m._data(a, c) || m._data(a, c, {
                    empty: m.Callbacks("once memory").add(function() {
                        m._removeData(a, b + "queue"), m._removeData(a, c)
                    })
                })
            }
        }), m.fn.extend({
            queue: function(a, b) {
                var c = 2;
                return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? m.queue(this[0], a) : void 0 === b ? this : this.each(function() {
                    var c = m.queue(this, a, b);
                    m._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && m.dequeue(this, a)
                })
            },
            dequeue: function(a) {
                return this.each(function() {
                    m.dequeue(this, a)
                })
            },
            clearQueue: function(a) {
                return this.queue(a || "fx", [])
            },
            promise: function(a, b) {
                var c, d = 1,
                    e = m.Deferred(),
                    f = this,
                    g = this.length,
                    h = function() {
                        --d || e.resolveWith(f, [f])
                    };
                "string" != typeof a && (b = a, a = void 0), a = a || "fx";
                while (g--) {
                    c = m._data(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h))
                }
                return h(), e.promise(b)
            }
        });
        var S = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            T = ["Top", "Right", "Bottom", "Left"],
            U = function(a, b) {
                return a = b || a, "none" === m.css(a, "display") || !m.contains(a.ownerDocument, a)
            },
            V = m.access = function(a, b, c, d, e, f, g) {
                var h = 0,
                    i = a.length,
                    j = null == c;
                if ("object" === m.type(c)) {
                    e = !0;
                    for (h in c) {
                        m.access(a, b, h, c[h], !0, f, g)
                    }
                } else {
                    if (void 0 !== d && (e = !0, m.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function(a, b, c) {
                            return j.call(m(a), c)
                        })), b)) {
                        for (; i > h; h++) {
                            b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)))
                        }
                    }
                }
                return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
            },
            W = /^(?:checkbox|radio)$/i;
        ! function() {
            var a = y.createElement("input"),
                b = y.createElement("div"),
                c = y.createDocumentFragment();
            if (b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", k.leadingWhitespace = 3 === b.firstChild.nodeType, k.tbody = !b.getElementsByTagName("tbody").length, k.htmlSerialize = !!b.getElementsByTagName("link").length, k.html5Clone = "<:nav></:nav>" !== y.createElement("nav").cloneNode(!0).outerHTML, a.type = "checkbox", a.checked = !0, c.appendChild(a), k.appendChecked = a.checked, b.innerHTML = "<textarea>x</textarea>", k.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue, c.appendChild(b), b.innerHTML = "<input type='radio' checked='checked' name='t'/>", k.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, k.noCloneEvent = !0, b.attachEvent && (b.attachEvent("onclick", function() {
                    k.noCloneEvent = !1
                }), b.cloneNode(!0).click()), null == k.deleteExpando) {
                k.deleteExpando = !0;
                try {
                    delete b.test
                } catch (d) {
                    k.deleteExpando = !1
                }
            }
        }(),
        function() {
            var b, c, d = y.createElement("div");
            for (b in {
                    submit: !0,
                    change: !0,
                    focusin: !0
                }) {
                c = "on" + b, (k[b + "Bubbles"] = c in a) || (d.setAttribute(c, "t"), k[b + "Bubbles"] = d.attributes[c].expando === !1)
            }
            d = null
        }();
        var X = /^(?:input|select|textarea)$/i,
            Y = /^key/,
            Z = /^(?:mouse|pointer|contextmenu)|click/,
            $ = /^(?:focusinfocus|focusoutblur)$/,
            _ = /^([^.]*)(?:\.(.+)|)$/;

        function ab() {
            return !0
        }

        function bb() {
            return !1
        }

        function cb() {
            try {
                return y.activeElement
            } catch (a) {}
        }
        m.event = {
            global: {},
            add: function(a, b, c, d, e) {
                var f, g, h, i, j, k, l, n, o, p, q, r = m._data(a);
                if (r) {
                    c.handler && (i = c, c = i.handler, e = i.selector), c.guid || (c.guid = m.guid++), (g = r.events) || (g = r.events = {}), (k = r.handle) || (k = r.handle = function(a) {
                        return typeof m === K || a && m.event.triggered === a.type ? void 0 : m.event.dispatch.apply(k.elem, arguments)
                    }, k.elem = a), b = (b || "").match(E) || [""], h = b.length;
                    while (h--) {
                        f = _.exec(b[h]) || [], o = q = f[1], p = (f[2] || "").split(".").sort(), o && (j = m.event.special[o] || {}, o = (e ? j.delegateType : j.bindType) || o, j = m.event.special[o] || {}, l = m.extend({
                            type: o,
                            origType: q,
                            data: d,
                            handler: c,
                            guid: c.guid,
                            selector: e,
                            needsContext: e && m.expr.match.needsContext.test(e),
                            namespace: p.join(".")
                        }, i), (n = g[o]) || (n = g[o] = [], n.delegateCount = 0, j.setup && j.setup.call(a, d, p, k) !== !1 || (a.addEventListener ? a.addEventListener(o, k, !1) : a.attachEvent && a.attachEvent("on" + o, k))), j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)), e ? n.splice(n.delegateCount++, 0, l) : n.push(l), m.event.global[o] = !0)
                    }
                    a = null
                }
            },
            remove: function(a, b, c, d, e) {
                var f, g, h, i, j, k, l, n, o, p, q, r = m.hasData(a) && m._data(a);
                if (r && (k = r.events)) {
                    b = (b || "").match(E) || [""], j = b.length;
                    while (j--) {
                        if (h = _.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o) {
                            l = m.event.special[o] || {}, o = (d ? l.delegateType : l.bindType) || o, n = k[o] || [], h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), i = f = n.length;
                            while (f--) {
                                g = n[f], !e && q !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (n.splice(f, 1), g.selector && n.delegateCount--, l.remove && l.remove.call(a, g))
                            }
                            i && !n.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || m.removeEvent(a, o, r.handle), delete k[o])
                        } else {
                            for (o in k) {
                                m.event.remove(a, o + b[j], c, d, !0)
                            }
                        }
                    }
                    m.isEmptyObject(k) && (delete r.handle, m._removeData(a, "events"))
                }
            },
            trigger: function(b, c, d, e) {
                var f, g, h, i, k, l, n, o = [d || y],
                    p = j.call(b, "type") ? b.type : b,
                    q = j.call(b, "namespace") ? b.namespace.split(".") : [];
                if (h = l = d = d || y, 3 !== d.nodeType && 8 !== d.nodeType && !$.test(p + m.event.triggered) && (p.indexOf(".") >= 0 && (q = p.split("."), p = q.shift(), q.sort()), g = p.indexOf(":") < 0 && "on" + p, b = b[m.expando] ? b : new m.Event(p, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = q.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : m.makeArray(c, [b]), k = m.event.special[p] || {}, e || !k.trigger || k.trigger.apply(d, c) !== !1)) {
                    if (!e && !k.noBubble && !m.isWindow(d)) {
                        for (i = k.delegateType || p, $.test(i + p) || (h = h.parentNode); h; h = h.parentNode) {
                            o.push(h), l = h
                        }
                        l === (d.ownerDocument || y) && o.push(l.defaultView || l.parentWindow || a)
                    }
                    n = 0;
                    while ((h = o[n++]) && !b.isPropagationStopped()) {
                        b.type = n > 1 ? i : k.bindType || p, f = (m._data(h, "events") || {})[b.type] && m._data(h, "handle"), f && f.apply(h, c), f = g && h[g], f && f.apply && m.acceptData(h) && (b.result = f.apply(h, c), b.result === !1 && b.preventDefault())
                    }
                    if (b.type = p, !e && !b.isDefaultPrevented() && (!k._default || k._default.apply(o.pop(), c) === !1) && m.acceptData(d) && g && d[p] && !m.isWindow(d)) {
                        l = d[g], l && (d[g] = null), m.event.triggered = p;
                        try {
                            d[p]()
                        } catch (r) {}
                        m.event.triggered = void 0, l && (d[g] = l)
                    }
                    return b.result
                }
            },
            dispatch: function(a) {
                a = m.event.fix(a);
                var b, c, e, f, g, h = [],
                    i = d.call(arguments),
                    j = (m._data(this, "events") || {})[a.type] || [],
                    k = m.event.special[a.type] || {};
                if (i[0] = a, a.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
                    h = m.event.handlers.call(this, a, j), b = 0;
                    while ((f = h[b++]) && !a.isPropagationStopped()) {
                        a.currentTarget = f.elem, g = 0;
                        while ((e = f.handlers[g++]) && !a.isImmediatePropagationStopped()) {
                            (!a.namespace_re || a.namespace_re.test(e.namespace)) && (a.handleObj = e, a.data = e.data, c = ((m.event.special[e.origType] || {}).handle || e.handler).apply(f.elem, i), void 0 !== c && (a.result = c) === !1 && (a.preventDefault(), a.stopPropagation()))
                        }
                    }
                    return k.postDispatch && k.postDispatch.call(this, a), a.result
                }
            },
            handlers: function(a, b) {
                var c, d, e, f, g = [],
                    h = b.delegateCount,
                    i = a.target;
                if (h && i.nodeType && (!a.button || "click" !== a.type)) {
                    for (; i != this; i = i.parentNode || this) {
                        if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                            for (e = [], f = 0; h > f; f++) {
                                d = b[f], c = d.selector + " ", void 0 === e[c] && (e[c] = d.needsContext ? m(c, this).index(i) >= 0 : m.find(c, this, null, [i]).length), e[c] && e.push(d)
                            }
                            e.length && g.push({
                                elem: i,
                                handlers: e
                            })
                        }
                    }
                }
                return h < b.length && g.push({
                    elem: this,
                    handlers: b.slice(h)
                }), g
            },
            fix: function(a) {
                if (a[m.expando]) {
                    return a
                }
                var b, c, d, e = a.type,
                    f = a,
                    g = this.fixHooks[e];
                g || (this.fixHooks[e] = g = Z.test(e) ? this.mouseHooks : Y.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new m.Event(f), b = d.length;
                while (b--) {
                    c = d[b], a[c] = f[c]
                }
                return a.target || (a.target = f.srcElement || y), 3 === a.target.nodeType && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, g.filter ? g.filter(a, f) : a
            },
            props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(a, b) {
                    return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(a, b) {
                    var c, d, e, f = b.button,
                        g = b.fromElement;
                    return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || y, e = d.documentElement, c = d.body, a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0), a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)), !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a
                }
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    trigger: function() {
                        if (this !== cb() && this.focus) {
                            try {
                                return this.focus(), !1
                            } catch (a) {}
                        }
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        return this === cb() && this.blur ? (this.blur(), !1) : void 0
                    },
                    delegateType: "focusout"
                },
                click: {
                    trigger: function() {
                        return m.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
                    },
                    _default: function(a) {
                        return m.nodeName(a.target, "a")
                    }
                },
                beforeunload: {
                    postDispatch: function(a) {
                        void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result)
                    }
                }
            },
            simulate: function(a, b, c, d) {
                var e = m.extend(new m.Event, c, {
                    type: a,
                    isSimulated: !0,
                    originalEvent: {}
                });
                d ? m.event.trigger(e, null, b) : m.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
            }
        }, m.removeEvent = y.removeEventListener ? function(a, b, c) {
            a.removeEventListener && a.removeEventListener(b, c, !1)
        } : function(a, b, c) {
            var d = "on" + b;
            a.detachEvent && (typeof a[d] === K && (a[d] = null), a.detachEvent(d, c))
        }, m.Event = function(a, b) {
            return this instanceof m.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? ab : bb) : this.type = a, b && m.extend(this, b), this.timeStamp = a && a.timeStamp || m.now(), void(this[m.expando] = !0)) : new m.Event(a, b)
        }, m.Event.prototype = {
            isDefaultPrevented: bb,
            isPropagationStopped: bb,
            isImmediatePropagationStopped: bb,
            preventDefault: function() {
                var a = this.originalEvent;
                this.isDefaultPrevented = ab, a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
            },
            stopPropagation: function() {
                var a = this.originalEvent;
                this.isPropagationStopped = ab, a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
            },
            stopImmediatePropagation: function() {
                var a = this.originalEvent;
                this.isImmediatePropagationStopped = ab, a && a.stopImmediatePropagation && a.stopImmediatePropagation(), this.stopPropagation()
            }
        }, m.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function(a, b) {
            m.event.special[a] = {
                delegateType: b,
                bindType: b,
                handle: function(a) {
                    var c, d = this,
                        e = a.relatedTarget,
                        f = a.handleObj;
                    return (!e || e !== d && !m.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
                }
            }
        }), k.submitBubbles || (m.event.special.submit = {
            setup: function() {
                return m.nodeName(this, "form") ? !1 : void m.event.add(this, "click._submit keypress._submit", function(a) {
                    var b = a.target,
                        c = m.nodeName(b, "input") || m.nodeName(b, "button") ? b.form : void 0;
                    c && !m._data(c, "submitBubbles") && (m.event.add(c, "submit._submit", function(a) {
                        a._submit_bubble = !0
                    }), m._data(c, "submitBubbles", !0))
                })
            },
            postDispatch: function(a) {
                a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && m.event.simulate("submit", this.parentNode, a, !0))
            },
            teardown: function() {
                return m.nodeName(this, "form") ? !1 : void m.event.remove(this, "._submit")
            }
        }), k.changeBubbles || (m.event.special.change = {
            setup: function() {
                return X.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (m.event.add(this, "propertychange._change", function(a) {
                    "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
                }), m.event.add(this, "click._change", function(a) {
                    this._just_changed && !a.isTrigger && (this._just_changed = !1), m.event.simulate("change", this, a, !0)
                })), !1) : void m.event.add(this, "beforeactivate._change", function(a) {
                    var b = a.target;
                    X.test(b.nodeName) && !m._data(b, "changeBubbles") && (m.event.add(b, "change._change", function(a) {
                        !this.parentNode || a.isSimulated || a.isTrigger || m.event.simulate("change", this.parentNode, a, !0)
                    }), m._data(b, "changeBubbles", !0))
                })
            },
            handle: function(a) {
                var b = a.target;
                return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0
            },
            teardown: function() {
                return m.event.remove(this, "._change"), !X.test(this.nodeName)
            }
        }), k.focusinBubbles || m.each({
            focus: "focusin",
            blur: "focusout"
        }, function(a, b) {
            var c = function(a) {
                m.event.simulate(b, a.target, m.event.fix(a), !0)
            };
            m.event.special[b] = {
                setup: function() {
                    var d = this.ownerDocument || this,
                        e = m._data(d, b);
                    e || d.addEventListener(a, c, !0), m._data(d, b, (e || 0) + 1)
                },
                teardown: function() {
                    var d = this.ownerDocument || this,
                        e = m._data(d, b) - 1;
                    e ? m._data(d, b, e) : (d.removeEventListener(a, c, !0), m._removeData(d, b))
                }
            }
        }), m.fn.extend({
            on: function(a, b, c, d, e) {
                var f, g;
                if ("object" == typeof a) {
                    "string" != typeof b && (c = c || b, b = void 0);
                    for (f in a) {
                        this.on(f, b, c, a[f], e)
                    }
                    return this
                }
                if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1) {
                    d = bb
                } else {
                    if (!d) {
                        return this
                    }
                }
                return 1 === e && (g = d, d = function(a) {
                    return m().off(a), g.apply(this, arguments)
                }, d.guid = g.guid || (g.guid = m.guid++)), this.each(function() {
                    m.event.add(this, a, d, c, b)
                })
            },
            one: function(a, b, c, d) {
                return this.on(a, b, c, d, 1)
            },
            off: function(a, b, c) {
                var d, e;
                if (a && a.preventDefault && a.handleObj) {
                    return d = a.handleObj, m(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this
                }
                if ("object" == typeof a) {
                    for (e in a) {
                        this.off(e, b, a[e])
                    }
                    return this
                }
                return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = bb), this.each(function() {
                    m.event.remove(this, a, c, b)
                })
            },
            trigger: function(a, b) {
                return this.each(function() {
                    m.event.trigger(a, b, this)
                })
            },
            triggerHandler: function(a, b) {
                var c = this[0];
                return c ? m.event.trigger(a, b, c, !0) : void 0
            }
        });

        function db(a) {
            var b = eb.split("|"),
                c = a.createDocumentFragment();
            if (c.createElement) {
                while (b.length) {
                    c.createElement(b.pop())
                }
            }
            return c
        }
        var eb = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
            fb = / jQuery\d+="(?:null|\d+)"/g,
            gb = new RegExp("<(?:" + eb + ")[\\s/>]", "i"),
            hb = /^\s+/,
            ib = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            jb = /<([\w:]+)/,
            kb = /<tbody/i,
            lb = /<|&#?\w+;/,
            mb = /<(?:script|style|link)/i,
            nb = /checked\s*(?:[^=]|=\s*.checked.)/i,
            ob = /^$|\/(?:java|ecma)script/i,
            pb = /^true\/(.*)/,
            qb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
            rb = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                legend: [1, "<fieldset>", "</fieldset>"],
                area: [1, "<map>", "</map>"],
                param: [1, "<object>", "</object>"],
                thead: [1, "<table>", "</table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                _default: k.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
            },
            sb = db(y),
            tb = sb.appendChild(y.createElement("div"));
        rb.optgroup = rb.option, rb.tbody = rb.tfoot = rb.colgroup = rb.caption = rb.thead, rb.th = rb.td;

        function ub(a, b) {
            var c, d, e = 0,
                f = typeof a.getElementsByTagName !== K ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== K ? a.querySelectorAll(b || "*") : void 0;
            if (!f) {
                for (f = [], c = a.childNodes || a; null != (d = c[e]); e++) {
                    !b || m.nodeName(d, b) ? f.push(d) : m.merge(f, ub(d, b))
                }
            }
            return void 0 === b || b && m.nodeName(a, b) ? m.merge([a], f) : f
        }

        function vb(a) {
            W.test(a.type) && (a.defaultChecked = a.checked)
        }

        function wb(a, b) {
            return m.nodeName(a, "table") && m.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
        }

        function xb(a) {
            return a.type = (null !== m.find.attr(a, "type")) + "/" + a.type, a
        }

        function yb(a) {
            var b = pb.exec(a.type);
            return b ? a.type = b[1] : a.removeAttribute("type"), a
        }

        function zb(a, b) {
            for (var c, d = 0; null != (c = a[d]); d++) {
                m._data(c, "globalEval", !b || m._data(b[d], "globalEval"))
            }
        }

        function Ab(a, b) {
            if (1 === b.nodeType && m.hasData(a)) {
                var c, d, e, f = m._data(a),
                    g = m._data(b, f),
                    h = f.events;
                if (h) {
                    delete g.handle, g.events = {};
                    for (c in h) {
                        for (d = 0, e = h[c].length; e > d; d++) {
                            m.event.add(b, c, h[c][d])
                        }
                    }
                }
                g.data && (g.data = m.extend({}, g.data))
            }
        }

        function Bb(a, b) {
            var c, d, e;
            if (1 === b.nodeType) {
                if (c = b.nodeName.toLowerCase(), !k.noCloneEvent && b[m.expando]) {
                    e = m._data(b);
                    for (d in e.events) {
                        m.removeEvent(b, d, e.handle)
                    }
                    b.removeAttribute(m.expando)
                }
                "script" === c && b.text !== a.text ? (xb(b).text = a.text, yb(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), k.html5Clone && a.innerHTML && !m.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && W.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
            }
        }
        m.extend({
            clone: function(a, b, c) {
                var d, e, f, g, h, i = m.contains(a.ownerDocument, a);
                if (k.html5Clone || m.isXMLDoc(a) || !gb.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (tb.innerHTML = a.outerHTML, tb.removeChild(f = tb.firstChild)), !(k.noCloneEvent && k.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || m.isXMLDoc(a))) {
                    for (d = ub(f), h = ub(a), g = 0; null != (e = h[g]); ++g) {
                        d[g] && Bb(e, d[g])
                    }
                }
                if (b) {
                    if (c) {
                        for (h = h || ub(a), d = d || ub(f), g = 0; null != (e = h[g]); g++) {
                            Ab(e, d[g])
                        }
                    } else {
                        Ab(a, f)
                    }
                }
                return d = ub(f, "script"), d.length > 0 && zb(d, !i && ub(a, "script")), d = h = e = null, f
            },
            buildFragment: function(a, b, c, d) {
                for (var e, f, g, h, i, j, l, n = a.length, o = db(b), p = [], q = 0; n > q; q++) {
                    if (f = a[q], f || 0 === f) {
                        if ("object" === m.type(f)) {
                            m.merge(p, f.nodeType ? [f] : f)
                        } else {
                            if (lb.test(f)) {
                                h = h || o.appendChild(b.createElement("div")), i = (jb.exec(f) || ["", ""])[1].toLowerCase(), l = rb[i] || rb._default, h.innerHTML = l[1] + f.replace(ib, "<$1></$2>") + l[2], e = l[0];
                                while (e--) {
                                    h = h.lastChild
                                }
                                if (!k.leadingWhitespace && hb.test(f) && p.push(b.createTextNode(hb.exec(f)[0])), !k.tbody) {
                                    f = "table" !== i || kb.test(f) ? "<table>" !== l[1] || kb.test(f) ? 0 : h : h.firstChild, e = f && f.childNodes.length;
                                    while (e--) {
                                        m.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j)
                                    }
                                }
                                m.merge(p, h.childNodes), h.textContent = "";
                                while (h.firstChild) {
                                    h.removeChild(h.firstChild)
                                }
                                h = o.lastChild
                            } else {
                                p.push(b.createTextNode(f))
                            }
                        }
                    }
                }
                h && o.removeChild(h), k.appendChecked || m.grep(ub(p, "input"), vb), q = 0;
                while (f = p[q++]) {
                    if ((!d || -1 === m.inArray(f, d)) && (g = m.contains(f.ownerDocument, f), h = ub(o.appendChild(f), "script"), g && zb(h), c)) {
                        e = 0;
                        while (f = h[e++]) {
                            ob.test(f.type || "") && c.push(f)
                        }
                    }
                }
                return h = null, o
            },
            cleanData: function(a, b) {
                for (var d, e, f, g, h = 0, i = m.expando, j = m.cache, l = k.deleteExpando, n = m.event.special; null != (d = a[h]); h++) {
                    if ((b || m.acceptData(d)) && (f = d[i], g = f && j[f])) {
                        if (g.events) {
                            for (e in g.events) {
                                n[e] ? m.event.remove(d, e) : m.removeEvent(d, e, g.handle)
                            }
                        }
                        j[f] && (delete j[f], l ? delete d[i] : typeof d.removeAttribute !== K ? d.removeAttribute(i) : d[i] = null, c.push(f))
                    }
                }
            }
        }), m.fn.extend({
            text: function(a) {
                return V(this, function(a) {
                    return void 0 === a ? m.text(this) : this.empty().append((this[0] && this[0].ownerDocument || y).createTextNode(a))
                }, null, a, arguments.length)
            },
            append: function() {
                return this.domManip(arguments, function(a) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var b = wb(this, a);
                        b.appendChild(a)
                    }
                })
            },
            prepend: function() {
                return this.domManip(arguments, function(a) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var b = wb(this, a);
                        b.insertBefore(a, b.firstChild)
                    }
                })
            },
            before: function() {
                return this.domManip(arguments, function(a) {
                    this.parentNode && this.parentNode.insertBefore(a, this)
                })
            },
            after: function() {
                return this.domManip(arguments, function(a) {
                    this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
                })
            },
            remove: function(a, b) {
                for (var c, d = a ? m.filter(a, this) : this, e = 0; null != (c = d[e]); e++) {
                    b || 1 !== c.nodeType || m.cleanData(ub(c)), c.parentNode && (b && m.contains(c.ownerDocument, c) && zb(ub(c, "script")), c.parentNode.removeChild(c))
                }
                return this
            },
            empty: function() {
                for (var a, b = 0; null != (a = this[b]); b++) {
                    1 === a.nodeType && m.cleanData(ub(a, !1));
                    while (a.firstChild) {
                        a.removeChild(a.firstChild)
                    }
                    a.options && m.nodeName(a, "select") && (a.options.length = 0)
                }
                return this
            },
            clone: function(a, b) {
                return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function() {
                    return m.clone(this, a, b)
                })
            },
            html: function(a) {
                return V(this, function(a) {
                    var b = this[0] || {},
                        c = 0,
                        d = this.length;
                    if (void 0 === a) {
                        return 1 === b.nodeType ? b.innerHTML.replace(fb, "") : void 0
                    }
                    if (!("string" != typeof a || mb.test(a) || !k.htmlSerialize && gb.test(a) || !k.leadingWhitespace && hb.test(a) || rb[(jb.exec(a) || ["", ""])[1].toLowerCase()])) {
                        a = a.replace(ib, "<$1></$2>");
                        try {
                            for (; d > c; c++) {
                                b = this[c] || {}, 1 === b.nodeType && (m.cleanData(ub(b, !1)), b.innerHTML = a)
                            }
                            b = 0
                        } catch (e) {}
                    }
                    b && this.empty().append(a)
                }, null, a, arguments.length)
            },
            replaceWith: function() {
                var a = arguments[0];
                return this.domManip(arguments, function(b) {
                    a = this.parentNode, m.cleanData(ub(this)), a && a.replaceChild(b, this)
                }), a && (a.length || a.nodeType) ? this : this.remove()
            },
            detach: function(a) {
                return this.remove(a, !0)
            },
            domManip: function(a, b) {
                a = e.apply([], a);
                var c, d, f, g, h, i, j = 0,
                    l = this.length,
                    n = this,
                    o = l - 1,
                    p = a[0],
                    q = m.isFunction(p);
                if (q || l > 1 && "string" == typeof p && !k.checkClone && nb.test(p)) {
                    return this.each(function(c) {
                        var d = n.eq(c);
                        q && (a[0] = p.call(this, c, d.html())), d.domManip(a, b)
                    })
                }
                if (l && (i = m.buildFragment(a, this[0].ownerDocument, !1, this), c = i.firstChild, 1 === i.childNodes.length && (i = c), c)) {
                    for (g = m.map(ub(i, "script"), xb), f = g.length; l > j; j++) {
                        d = i, j !== o && (d = m.clone(d, !0, !0), f && m.merge(g, ub(d, "script"))), b.call(this[j], d, j)
                    }
                    if (f) {
                        for (h = g[g.length - 1].ownerDocument, m.map(g, yb), j = 0; f > j; j++) {
                            d = g[j], ob.test(d.type || "") && !m._data(d, "globalEval") && m.contains(h, d) && (d.src ? m._evalUrl && m._evalUrl(d.src) : m.globalEval((d.text || d.textContent || d.innerHTML || "").replace(qb, "")))
                        }
                    }
                    i = c = null
                }
                return this
            }
        }), m.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(a, b) {
            m.fn[a] = function(a) {
                for (var c, d = 0, e = [], g = m(a), h = g.length - 1; h >= d; d++) {
                    c = d === h ? this : this.clone(!0), m(g[d])[b](c), f.apply(e, c.get())
                }
                return this.pushStack(e)
            }
        });
        var Cb, Db = {};

        function Eb(b, c) {
            var d, e = m(c.createElement(b)).appendTo(c.body),
                f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : m.css(e[0], "display");
            return e.detach(), f
        }

        function Fb(a) {
            var b = y,
                c = Db[a];
            return c || (c = Eb(a, b), "none" !== c && c || (Cb = (Cb || m("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = (Cb[0].contentWindow || Cb[0].contentDocument).document, b.write(), b.close(), c = Eb(a, b), Cb.detach()), Db[a] = c), c
        }! function() {
            var a;
            k.shrinkWrapBlocks = function() {
                if (null != a) {
                    return a
                }
                a = !1;
                var b, c, d;
                return c = y.getElementsByTagName("body")[0], c && c.style ? (b = y.createElement("div"), d = y.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), typeof b.style.zoom !== K && (b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", b.appendChild(y.createElement("div")).style.width = "5px", a = 3 !== b.offsetWidth), c.removeChild(d), a) : void 0
            }
        }();
        var Gb = /^margin/,
            Hb = new RegExp("^(" + S + ")(?!px)[a-z%]+$", "i"),
            Ib, Jb, Kb = /^(top|right|bottom|left)$/;
        a.getComputedStyle ? (Ib = function(a) {
            return a.ownerDocument.defaultView.getComputedStyle(a, null)
        }, Jb = function(a, b, c) {
            var d, e, f, g, h = a.style;
            return c = c || Ib(a), g = c ? c.getPropertyValue(b) || c[b] : void 0, c && ("" !== g || m.contains(a.ownerDocument, a) || (g = m.style(a, b)), Hb.test(g) && Gb.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 === g ? g : g + ""
        }) : y.documentElement.currentStyle && (Ib = function(a) {
            return a.currentStyle
        }, Jb = function(a, b, c) {
            var d, e, f, g, h = a.style;
            return c = c || Ib(a), g = c ? c[b] : void 0, null == g && h && h[b] && (g = h[b]), Hb.test(g) && !Kb.test(b) && (d = h.left, e = a.runtimeStyle, f = e && e.left, f && (e.left = a.currentStyle.left), h.left = "fontSize" === b ? "1em" : g, g = h.pixelLeft + "px", h.left = d, f && (e.left = f)), void 0 === g ? g : g + "" || "auto"
        });

        function Lb(a, b) {
            return {
                get: function() {
                    var c = a();
                    if (null != c) {
                        return c ? void delete this.get : (this.get = b).apply(this, arguments)
                    }
                }
            }
        }! function() {
            var b, c, d, e, f, g, h;
            if (b = y.createElement("div"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", d = b.getElementsByTagName("a")[0], c = d && d.style) {
                c.cssText = "float:left;opacity:.5", k.opacity = "0.5" === c.opacity, k.cssFloat = !!c.cssFloat, b.style.backgroundClip = "content-box", b.cloneNode(!0).style.backgroundClip = "", k.clearCloneStyle = "content-box" === b.style.backgroundClip, k.boxSizing = "" === c.boxSizing || "" === c.MozBoxSizing || "" === c.WebkitBoxSizing, m.extend(k, {
                    reliableHiddenOffsets: function() {
                        return null == g && i(), g
                    },
                    boxSizingReliable: function() {
                        return null == f && i(), f
                    },
                    pixelPosition: function() {
                        return null == e && i(), e
                    },
                    reliableMarginRight: function() {
                        return null == h && i(), h
                    }
                });

                function i() {
                    var b, c, d, i;
                    c = y.getElementsByTagName("body")[0], c && c.style && (b = y.createElement("div"), d = y.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), b.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", e = f = !1, h = !0, a.getComputedStyle && (e = "1%" !== (a.getComputedStyle(b, null) || {}).top, f = "4px" === (a.getComputedStyle(b, null) || {
                        width: "4px"
                    }).width, i = b.appendChild(y.createElement("div")), i.style.cssText = b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", i.style.marginRight = i.style.width = "0", b.style.width = "1px", h = !parseFloat((a.getComputedStyle(i, null) || {}).marginRight)), b.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", i = b.getElementsByTagName("td"), i[0].style.cssText = "margin:0;border:0;padding:0;display:none", g = 0 === i[0].offsetHeight, g && (i[0].style.display = "", i[1].style.display = "none", g = 0 === i[0].offsetHeight), c.removeChild(d))
                }
            }
        }(), m.swap = function(a, b, c, d) {
            var e, f, g = {};
            for (f in b) {
                g[f] = a.style[f], a.style[f] = b[f]
            }
            e = c.apply(a, d || []);
            for (f in b) {
                a.style[f] = g[f]
            }
            return e
        };
        var Mb = /alpha\([^)]*\)/i,
            Nb = /opacity\s*=\s*([^)]*)/,
            Ob = /^(none|table(?!-c[ea]).+)/,
            Pb = new RegExp("^(" + S + ")(.*)$", "i"),
            Qb = new RegExp("^([+-])=(" + S + ")", "i"),
            Rb = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            },
            Sb = {
                letterSpacing: "0",
                fontWeight: "400"
            },
            Tb = ["Webkit", "O", "Moz", "ms"];

        function Ub(a, b) {
            if (b in a) {
                return b
            }
            var c = b.charAt(0).toUpperCase() + b.slice(1),
                d = b,
                e = Tb.length;
            while (e--) {
                if (b = Tb[e] + c, b in a) {
                    return b
                }
            }
            return d
        }

        function Vb(a, b) {
            for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) {
                d = a[g], d.style && (f[g] = m._data(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && U(d) && (f[g] = m._data(d, "olddisplay", Fb(d.nodeName)))) : (e = U(d), (c && "none" !== c || !e) && m._data(d, "olddisplay", e ? c : m.css(d, "display"))))
            }
            for (g = 0; h > g; g++) {
                d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"))
            }
            return a
        }

        function Wb(a, b, c) {
            var d = Pb.exec(b);
            return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
        }

        function Xb(a, b, c, d, e) {
            for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) {
                "margin" === c && (g += m.css(a, c + T[f], !0, e)), d ? ("content" === c && (g -= m.css(a, "padding" + T[f], !0, e)), "margin" !== c && (g -= m.css(a, "border" + T[f] + "Width", !0, e))) : (g += m.css(a, "padding" + T[f], !0, e), "padding" !== c && (g += m.css(a, "border" + T[f] + "Width", !0, e)))
            }
            return g
        }

        function Yb(a, b, c) {
            var d = !0,
                e = "width" === b ? a.offsetWidth : a.offsetHeight,
                f = Ib(a),
                g = k.boxSizing && "border-box" === m.css(a, "boxSizing", !1, f);
            if (0 >= e || null == e) {
                if (e = Jb(a, b, f), (0 > e || null == e) && (e = a.style[b]), Hb.test(e)) {
                    return e
                }
                d = g && (k.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0
            }
            return e + Xb(a, b, c || (g ? "border" : "content"), d, f) + "px"
        }
        m.extend({
            cssHooks: {
                opacity: {
                    get: function(a, b) {
                        if (b) {
                            var c = Jb(a, "opacity");
                            return "" === c ? "1" : c
                        }
                    }
                }
            },
            cssNumber: {
                columnCount: !0,
                fillOpacity: !0,
                flexGrow: !0,
                flexShrink: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {
                "float": k.cssFloat ? "cssFloat" : "styleFloat"
            },
            style: function(a, b, c, d) {
                if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                    var e, f, g, h = m.camelCase(b),
                        i = a.style;
                    if (b = m.cssProps[h] || (m.cssProps[h] = Ub(i, h)), g = m.cssHooks[b] || m.cssHooks[h], void 0 === c) {
                        return g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b]
                    }
                    if (f = typeof c, "string" === f && (e = Qb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(m.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || m.cssNumber[h] || (c += "px"), k.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), !(g && "set" in g && void 0 === (c = g.set(a, c, d))))) {
                        try {
                            i[b] = c
                        } catch (j) {}
                    }
                }
            },
            css: function(a, b, c, d) {
                var e, f, g, h = m.camelCase(b);
                return b = m.cssProps[h] || (m.cssProps[h] = Ub(a.style, h)), g = m.cssHooks[b] || m.cssHooks[h], g && "get" in g && (f = g.get(a, !0, c)), void 0 === f && (f = Jb(a, b, d)), "normal" === f && b in Sb && (f = Sb[b]), "" === c || c ? (e = parseFloat(f), c === !0 || m.isNumeric(e) ? e || 0 : f) : f
            }
        }), m.each(["height", "width"], function(a, b) {
            m.cssHooks[b] = {
                get: function(a, c, d) {
                    return c ? Ob.test(m.css(a, "display")) && 0 === a.offsetWidth ? m.swap(a, Rb, function() {
                        return Yb(a, b, d)
                    }) : Yb(a, b, d) : void 0
                },
                set: function(a, c, d) {
                    var e = d && Ib(a);
                    return Wb(a, c, d ? Xb(a, b, d, k.boxSizing && "border-box" === m.css(a, "boxSizing", !1, e), e) : 0)
                }
            }
        }), k.opacity || (m.cssHooks.opacity = {
            get: function(a, b) {
                return Nb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
            },
            set: function(a, b) {
                var c = a.style,
                    d = a.currentStyle,
                    e = m.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "",
                    f = d && d.filter || c.filter || "";
                c.zoom = 1, (b >= 1 || "" === b) && "" === m.trim(f.replace(Mb, "")) && c.removeAttribute && (c.removeAttribute("filter"), "" === b || d && !d.filter) || (c.filter = Mb.test(f) ? f.replace(Mb, e) : f + " " + e)
            }
        }), m.cssHooks.marginRight = Lb(k.reliableMarginRight, function(a, b) {
            return b ? m.swap(a, {
                display: "inline-block"
            }, Jb, [a, "marginRight"]) : void 0
        }), m.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(a, b) {
            m.cssHooks[a + b] = {
                expand: function(c) {
                    for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++) {
                        e[a + T[d] + b] = f[d] || f[d - 2] || f[0]
                    }
                    return e
                }
            }, Gb.test(a) || (m.cssHooks[a + b].set = Wb)
        }), m.fn.extend({
            css: function(a, b) {
                return V(this, function(a, b, c) {
                    var d, e, f = {},
                        g = 0;
                    if (m.isArray(b)) {
                        for (d = Ib(a), e = b.length; e > g; g++) {
                            f[b[g]] = m.css(a, b[g], !1, d)
                        }
                        return f
                    }
                    return void 0 !== c ? m.style(a, b, c) : m.css(a, b)
                }, a, b, arguments.length > 1)
            },
            show: function() {
                return Vb(this, !0)
            },
            hide: function() {
                return Vb(this)
            },
            toggle: function(a) {
                return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                    U(this) ? m(this).show() : m(this).hide()
                })
            }
        });

        function Zb(a, b, c, d, e) {
            return new Zb.prototype.init(a, b, c, d, e)
        }
        m.Tween = Zb, Zb.prototype = {
            constructor: Zb,
            init: function(a, b, c, d, e, f) {
                this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (m.cssNumber[c] ? "" : "px")
            },
            cur: function() {
                var a = Zb.propHooks[this.prop];
                return a && a.get ? a.get(this) : Zb.propHooks._default.get(this)
            },
            run: function(a) {
                var b, c = Zb.propHooks[this.prop];
                return this.pos = b = this.options.duration ? m.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : Zb.propHooks._default.set(this), this
            }
        }, Zb.prototype.init.prototype = Zb.prototype, Zb.propHooks = {
            _default: {
                get: function(a) {
                    var b;
                    return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = m.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
                },
                set: function(a) {
                    m.fx.step[a.prop] ? m.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[m.cssProps[a.prop]] || m.cssHooks[a.prop]) ? m.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
                }
            }
        }, Zb.propHooks.scrollTop = Zb.propHooks.scrollLeft = {
            set: function(a) {
                a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
            }
        }, m.easing = {
            linear: function(a) {
                return a
            },
            swing: function(a) {
                return 0.5 - Math.cos(a * Math.PI) / 2
            }
        }, m.fx = Zb.prototype.init, m.fx.step = {};
        var $b, _b, ac = /^(?:toggle|show|hide)$/,
            bc = new RegExp("^(?:([+-])=|)(" + S + ")([a-z%]*)$", "i"),
            cc = /queueHooks$/,
            dc = [ic],
            ec = {
                "*": [function(a, b) {
                    var c = this.createTween(a, b),
                        d = c.cur(),
                        e = bc.exec(b),
                        f = e && e[3] || (m.cssNumber[a] ? "" : "px"),
                        g = (m.cssNumber[a] || "px" !== f && +d) && bc.exec(m.css(c.elem, a)),
                        h = 1,
                        i = 20;
                    if (g && g[3] !== f) {
                        f = f || g[3], e = e || [], g = +d || 1;
                        do {
                            h = h || ".5", g /= h, m.style(c.elem, a, g + f)
                        } while (h !== (h = c.cur() / d) && 1 !== h && --i)
                    }
                    return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c
                }]
            };

        function fc() {
            return setTimeout(function() {
                $b = void 0
            }), $b = m.now()
        }

        function gc(a, b) {
            var c, d = {
                    height: a
                },
                e = 0;
            for (b = b ? 1 : 0; 4 > e; e += 2 - b) {
                c = T[e], d["margin" + c] = d["padding" + c] = a
            }
            return b && (d.opacity = d.width = a), d
        }

        function hc(a, b, c) {
            for (var d, e = (ec[b] || []).concat(ec["*"]), f = 0, g = e.length; g > f; f++) {
                if (d = e[f].call(c, b, a)) {
                    return d
                }
            }
        }

        function ic(a, b, c) {
            var d, e, f, g, h, i, j, l, n = this,
                o = {},
                p = a.style,
                q = a.nodeType && U(a),
                r = m._data(a, "fxshow");
            c.queue || (h = m._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function() {
                h.unqueued || i()
            }), h.unqueued++, n.always(function() {
                n.always(function() {
                    h.unqueued--, m.queue(a, "fx").length || h.empty.fire()
                })
            })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [p.overflow, p.overflowX, p.overflowY], j = m.css(a, "display"), l = "none" === j ? m._data(a, "olddisplay") || Fb(a.nodeName) : j, "inline" === l && "none" === m.css(a, "float") && (k.inlineBlockNeedsLayout && "inline" !== Fb(a.nodeName) ? p.zoom = 1 : p.display = "inline-block")), c.overflow && (p.overflow = "hidden", k.shrinkWrapBlocks() || n.always(function() {
                p.overflow = c.overflow[0], p.overflowX = c.overflow[1], p.overflowY = c.overflow[2]
            }));
            for (d in b) {
                if (e = b[d], ac.exec(e)) {
                    if (delete b[d], f = f || "toggle" === e, e === (q ? "hide" : "show")) {
                        if ("show" !== e || !r || void 0 === r[d]) {
                            continue
                        }
                        q = !0
                    }
                    o[d] = r && r[d] || m.style(a, d)
                } else {
                    j = void 0
                }
            }
            if (m.isEmptyObject(o)) {
                "inline" === ("none" === j ? Fb(a.nodeName) : j) && (p.display = j)
            } else {
                r ? "hidden" in r && (q = r.hidden) : r = m._data(a, "fxshow", {}), f && (r.hidden = !q), q ? m(a).show() : n.done(function() {
                    m(a).hide()
                }), n.done(function() {
                    var b;
                    m._removeData(a, "fxshow");
                    for (b in o) {
                        m.style(a, b, o[b])
                    }
                });
                for (d in o) {
                    g = hc(q ? r[d] : 0, d, n), d in r || (r[d] = g.start, q && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0))
                }
            }
        }

        function jc(a, b) {
            var c, d, e, f, g;
            for (c in a) {
                if (d = m.camelCase(c), e = b[d], f = a[c], m.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = m.cssHooks[d], g && "expand" in g) {
                    f = g.expand(f), delete a[d];
                    for (c in f) {
                        c in a || (a[c] = f[c], b[c] = e)
                    }
                } else {
                    b[d] = e
                }
            }
        }

        function kc(a, b, c) {
            var d, e, f = 0,
                g = dc.length,
                h = m.Deferred().always(function() {
                    delete i.elem
                }),
                i = function() {
                    if (e) {
                        return !1
                    }
                    for (var b = $b || fc(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) {
                        j.tweens[g].run(f)
                    }
                    return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1)
                },
                j = h.promise({
                    elem: a,
                    props: m.extend({}, b),
                    opts: m.extend(!0, {
                        specialEasing: {}
                    }, c),
                    originalProperties: b,
                    originalOptions: c,
                    startTime: $b || fc(),
                    duration: c.duration,
                    tweens: [],
                    createTween: function(b, c) {
                        var d = m.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                        return j.tweens.push(d), d
                    },
                    stop: function(b) {
                        var c = 0,
                            d = b ? j.tweens.length : 0;
                        if (e) {
                            return this
                        }
                        for (e = !0; d > c; c++) {
                            j.tweens[c].run(1)
                        }
                        return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
                    }
                }),
                k = j.props;
            for (jc(k, j.opts.specialEasing); g > f; f++) {
                if (d = dc[f].call(j, a, k, j.opts)) {
                    return d
                }
            }
            return m.map(k, hc, j), m.isFunction(j.opts.start) && j.opts.start.call(a, j), m.fx.timer(m.extend(i, {
                elem: a,
                anim: j,
                queue: j.opts.queue
            })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
        }
        m.Animation = m.extend(kc, {
                tweener: function(a, b) {
                    m.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
                    for (var c, d = 0, e = a.length; e > d; d++) {
                        c = a[d], ec[c] = ec[c] || [], ec[c].unshift(b)
                    }
                },
                prefilter: function(a, b) {
                    b ? dc.unshift(a) : dc.push(a)
                }
            }), m.speed = function(a, b, c) {
                var d = a && "object" == typeof a ? m.extend({}, a) : {
                    complete: c || !c && b || m.isFunction(a) && a,
                    duration: a,
                    easing: c && b || b && !m.isFunction(b) && b
                };
                return d.duration = m.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in m.fx.speeds ? m.fx.speeds[d.duration] : m.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function() {
                    m.isFunction(d.old) && d.old.call(this), d.queue && m.dequeue(this, d.queue)
                }, d
            }, m.fn.extend({
                fadeTo: function(a, b, c, d) {
                    return this.filter(U).css("opacity", 0).show().end().animate({
                        opacity: b
                    }, a, c, d)
                },
                animate: function(a, b, c, d) {
                    var e = m.isEmptyObject(a),
                        f = m.speed(b, c, d),
                        g = function() {
                            var b = kc(this, m.extend({}, a), f);
                            (e || m._data(this, "finish")) && b.stop(!0)
                        };
                    return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
                },
                stop: function(a, b, c) {
                    var d = function(a) {
                        var b = a.stop;
                        delete a.stop, b(c)
                    };
                    return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function() {
                        var b = !0,
                            e = null != a && a + "queueHooks",
                            f = m.timers,
                            g = m._data(this);
                        if (e) {
                            g[e] && g[e].stop && d(g[e])
                        } else {
                            for (e in g) {
                                g[e] && g[e].stop && cc.test(e) && d(g[e])
                            }
                        }
                        for (e = f.length; e--;) {
                            f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1))
                        }(b || !c) && m.dequeue(this, a)
                    })
                },
                finish: function(a) {
                    return a !== !1 && (a = a || "fx"), this.each(function() {
                        var b, c = m._data(this),
                            d = c[a + "queue"],
                            e = c[a + "queueHooks"],
                            f = m.timers,
                            g = d ? d.length : 0;
                        for (c.finish = !0, m.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;) {
                            f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1))
                        }
                        for (b = 0; g > b; b++) {
                            d[b] && d[b].finish && d[b].finish.call(this)
                        }
                        delete c.finish
                    })
                }
            }), m.each(["toggle", "show", "hide"], function(a, b) {
                var c = m.fn[b];
                m.fn[b] = function(a, d, e) {
                    return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(gc(b, !0), a, d, e)
                }
            }), m.each({
                slideDown: gc("show"),
                slideUp: gc("hide"),
                slideToggle: gc("toggle"),
                fadeIn: {
                    opacity: "show"
                },
                fadeOut: {
                    opacity: "hide"
                },
                fadeToggle: {
                    opacity: "toggle"
                }
            }, function(a, b) {
                m.fn[a] = function(a, c, d) {
                    return this.animate(b, a, c, d)
                }
            }), m.timers = [], m.fx.tick = function() {
                var a, b = m.timers,
                    c = 0;
                for ($b = m.now(); c < b.length; c++) {
                    a = b[c], a() || b[c] !== a || b.splice(c--, 1)
                }
                b.length || m.fx.stop(), $b = void 0
            }, m.fx.timer = function(a) {
                m.timers.push(a), a() ? m.fx.start() : m.timers.pop()
            }, m.fx.interval = 13, m.fx.start = function() {
                _b || (_b = setInterval(m.fx.tick, m.fx.interval))
            }, m.fx.stop = function() {
                clearInterval(_b), _b = null
            }, m.fx.speeds = {
                slow: 600,
                fast: 200,
                _default: 400
            }, m.fn.delay = function(a, b) {
                return a = m.fx ? m.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
                    var d = setTimeout(b, a);
                    c.stop = function() {
                        clearTimeout(d)
                    }
                })
            },
            function() {
                var a, b, c, d, e;
                b = y.createElement("div"), b.setAttribute("className", "t"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", d = b.getElementsByTagName("a")[0], c = y.createElement("select"), e = c.appendChild(y.createElement("option")), a = b.getElementsByTagName("input")[0], d.style.cssText = "top:1px", k.getSetAttribute = "t" !== b.className, k.style = /top/.test(d.getAttribute("style")), k.hrefNormalized = "/a" === d.getAttribute("href"), k.checkOn = !!a.value, k.optSelected = e.selected, k.enctype = !!y.createElement("form").enctype, c.disabled = !0, k.optDisabled = !e.disabled, a = y.createElement("input"), a.setAttribute("value", ""), k.input = "" === a.getAttribute("value"), a.value = "t", a.setAttribute("type", "radio"), k.radioValue = "t" === a.value
            }();
        var lc = /\r/g;
        m.fn.extend({
            val: function(a) {
                var b, c, d, e = this[0];
                if (arguments.length) {
                    return d = m.isFunction(a), this.each(function(c) {
                        var e;
                        1 === this.nodeType && (e = d ? a.call(this, c, m(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : m.isArray(e) && (e = m.map(e, function(a) {
                            return null == a ? "" : a + ""
                        })), b = m.valHooks[this.type] || m.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e))
                    })
                }
                if (e) {
                    return b = m.valHooks[e.type] || m.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(lc, "") : null == c ? "" : c)
                }
            }
        }), m.extend({
            valHooks: {
                option: {
                    get: function(a) {
                        var b = m.find.attr(a, "value");
                        return null != b ? b : m.trim(m.text(a))
                    }
                },
                select: {
                    get: function(a) {
                        for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++) {
                            if (c = d[i], !(!c.selected && i !== e || (k.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && m.nodeName(c.parentNode, "optgroup"))) {
                                if (b = m(c).val(), f) {
                                    return b
                                }
                                g.push(b)
                            }
                        }
                        return g
                    },
                    set: function(a, b) {
                        var c, d, e = a.options,
                            f = m.makeArray(b),
                            g = e.length;
                        while (g--) {
                            if (d = e[g], m.inArray(m.valHooks.option.get(d), f) >= 0) {
                                try {
                                    d.selected = c = !0
                                } catch (h) {
                                    d.scrollHeight
                                }
                            } else {
                                d.selected = !1
                            }
                        }
                        return c || (a.selectedIndex = -1), e
                    }
                }
            }
        }), m.each(["radio", "checkbox"], function() {
            m.valHooks[this] = {
                set: function(a, b) {
                    return m.isArray(b) ? a.checked = m.inArray(m(a).val(), b) >= 0 : void 0
                }
            }, k.checkOn || (m.valHooks[this].get = function(a) {
                return null === a.getAttribute("value") ? "on" : a.value
            })
        });
        var mc, nc, oc = m.expr.attrHandle,
            pc = /^(?:checked|selected)$/i,
            qc = k.getSetAttribute,
            rc = k.input;
        m.fn.extend({
            attr: function(a, b) {
                return V(this, m.attr, a, b, arguments.length > 1)
            },
            removeAttr: function(a) {
                return this.each(function() {
                    m.removeAttr(this, a)
                })
            }
        }), m.extend({
            attr: function(a, b, c) {
                var d, e, f = a.nodeType;
                if (a && 3 !== f && 8 !== f && 2 !== f) {
                    return typeof a.getAttribute === K ? m.prop(a, b, c) : (1 === f && m.isXMLDoc(a) || (b = b.toLowerCase(), d = m.attrHooks[b] || (m.expr.match.bool.test(b) ? nc : mc)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = m.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void m.removeAttr(a, b))
                }
            },
            removeAttr: function(a, b) {
                var c, d, e = 0,
                    f = b && b.match(E);
                if (f && 1 === a.nodeType) {
                    while (c = f[e++]) {
                        d = m.propFix[c] || c, m.expr.match.bool.test(c) ? rc && qc || !pc.test(c) ? a[d] = !1 : a[m.camelCase("default-" + c)] = a[d] = !1 : m.attr(a, c, ""), a.removeAttribute(qc ? c : d)
                    }
                }
            },
            attrHooks: {
                type: {
                    set: function(a, b) {
                        if (!k.radioValue && "radio" === b && m.nodeName(a, "input")) {
                            var c = a.value;
                            return a.setAttribute("type", b), c && (a.value = c), b
                        }
                    }
                }
            }
        }), nc = {
            set: function(a, b, c) {
                return b === !1 ? m.removeAttr(a, c) : rc && qc || !pc.test(c) ? a.setAttribute(!qc && m.propFix[c] || c, c) : a[m.camelCase("default-" + c)] = a[c] = !0, c
            }
        }, m.each(m.expr.match.bool.source.match(/\w+/g), function(a, b) {
            var c = oc[b] || m.find.attr;
            oc[b] = rc && qc || !pc.test(b) ? function(a, b, d) {
                var e, f;
                return d || (f = oc[b], oc[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, oc[b] = f), e
            } : function(a, b, c) {
                return c ? void 0 : a[m.camelCase("default-" + b)] ? b.toLowerCase() : null
            }
        }), rc && qc || (m.attrHooks.value = {
            set: function(a, b, c) {
                return m.nodeName(a, "input") ? void(a.defaultValue = b) : mc && mc.set(a, b, c)
            }
        }), qc || (mc = {
            set: function(a, b, c) {
                var d = a.getAttributeNode(c);
                return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)), d.value = b += "", "value" === c || b === a.getAttribute(c) ? b : void 0
            }
        }, oc.id = oc.name = oc.coords = function(a, b, c) {
            var d;
            return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null
        }, m.valHooks.button = {
            get: function(a, b) {
                var c = a.getAttributeNode(b);
                return c && c.specified ? c.value : void 0
            },
            set: mc.set
        }, m.attrHooks.contenteditable = {
            set: function(a, b, c) {
                mc.set(a, "" === b ? !1 : b, c)
            }
        }, m.each(["width", "height"], function(a, b) {
            m.attrHooks[b] = {
                set: function(a, c) {
                    return "" === c ? (a.setAttribute(b, "auto"), c) : void 0
                }
            }
        })), k.style || (m.attrHooks.style = {
            get: function(a) {
                return a.style.cssText || void 0
            },
            set: function(a, b) {
                return a.style.cssText = b + ""
            }
        });
        var sc = /^(?:input|select|textarea|button|object)$/i,
            tc = /^(?:a|area)$/i;
        m.fn.extend({
            prop: function(a, b) {
                return V(this, m.prop, a, b, arguments.length > 1)
            },
            removeProp: function(a) {
                return a = m.propFix[a] || a, this.each(function() {
                    try {
                        this[a] = void 0, delete this[a]
                    } catch (b) {}
                })
            }
        }), m.extend({
            propFix: {
                "for": "htmlFor",
                "class": "className"
            },
            prop: function(a, b, c) {
                var d, e, f, g = a.nodeType;
                if (a && 3 !== g && 8 !== g && 2 !== g) {
                    return f = 1 !== g || !m.isXMLDoc(a), f && (b = m.propFix[b] || b, e = m.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]
                }
            },
            propHooks: {
                tabIndex: {
                    get: function(a) {
                        var b = m.find.attr(a, "tabindex");
                        return b ? parseInt(b, 10) : sc.test(a.nodeName) || tc.test(a.nodeName) && a.href ? 0 : -1
                    }
                }
            }
        }), k.hrefNormalized || m.each(["href", "src"], function(a, b) {
            m.propHooks[b] = {
                get: function(a) {
                    return a.getAttribute(b, 4)
                }
            }
        }), k.optSelected || (m.propHooks.selected = {
            get: function(a) {
                var b = a.parentNode;
                return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
            }
        }), m.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            m.propFix[this.toLowerCase()] = this
        }), k.enctype || (m.propFix.enctype = "encoding");
        var uc = /[\t\r\n\f]/g;
        m.fn.extend({
            addClass: function(a) {
                var b, c, d, e, f, g, h = 0,
                    i = this.length,
                    j = "string" == typeof a && a;
                if (m.isFunction(a)) {
                    return this.each(function(b) {
                        m(this).addClass(a.call(this, b, this.className))
                    })
                }
                if (j) {
                    for (b = (a || "").match(E) || []; i > h; h++) {
                        if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(uc, " ") : " ")) {
                            f = 0;
                            while (e = b[f++]) {
                                d.indexOf(" " + e + " ") < 0 && (d += e + " ")
                            }
                            g = m.trim(d), c.className !== g && (c.className = g)
                        }
                    }
                }
                return this
            },
            removeClass: function(a) {
                var b, c, d, e, f, g, h = 0,
                    i = this.length,
                    j = 0 === arguments.length || "string" == typeof a && a;
                if (m.isFunction(a)) {
                    return this.each(function(b) {
                        m(this).removeClass(a.call(this, b, this.className))
                    })
                }
                if (j) {
                    for (b = (a || "").match(E) || []; i > h; h++) {
                        if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(uc, " ") : "")) {
                            f = 0;
                            while (e = b[f++]) {
                                while (d.indexOf(" " + e + " ") >= 0) {
                                    d = d.replace(" " + e + " ", " ")
                                }
                            }
                            g = a ? m.trim(d) : "", c.className !== g && (c.className = g)
                        }
                    }
                }
                return this
            },
            toggleClass: function(a, b) {
                var c = typeof a;
                return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(m.isFunction(a) ? function(c) {
                    m(this).toggleClass(a.call(this, c, this.className, b), b)
                } : function() {
                    if ("string" === c) {
                        var b, d = 0,
                            e = m(this),
                            f = a.match(E) || [];
                        while (b = f[d++]) {
                            e.hasClass(b) ? e.removeClass(b) : e.addClass(b)
                        }
                    } else {
                        (c === K || "boolean" === c) && (this.className && m._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : m._data(this, "__className__") || "")
                    }
                })
            },
            hasClass: function(a) {
                for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++) {
                    if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(uc, " ").indexOf(b) >= 0) {
                        return !0
                    }
                }
                return !1
            }
        }), m.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
            m.fn[b] = function(a, c) {
                return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
            }
        }), m.fn.extend({
            hover: function(a, b) {
                return this.mouseenter(a).mouseleave(b || a)
            },
            bind: function(a, b, c) {
                return this.on(a, null, b, c)
            },
            unbind: function(a, b) {
                return this.off(a, null, b)
            },
            delegate: function(a, b, c, d) {
                return this.on(b, a, c, d)
            },
            undelegate: function(a, b, c) {
                return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
            }
        });
        var vc = m.now(),
            wc = /\?/,
            xc = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
        m.parseJSON = function(b) {
            if (a.JSON && a.JSON.parse) {
                return a.JSON.parse(b + "")
            }
            var c, d = null,
                e = m.trim(b + "");
            return e && !m.trim(e.replace(xc, function(a, b, e, f) {
                return c && b && (d = 0), 0 === d ? a : (c = e || b, d += !f - !e, "")
            })) ? Function("return " + e)() : m.error("Invalid JSON: " + b)
        }, m.parseXML = function(b) {
            var c, d;
            if (!b || "string" != typeof b) {
                return null
            }
            try {
                a.DOMParser ? (d = new DOMParser, c = d.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"), c.async = "false", c.loadXML(b))
            } catch (e) {
                c = void 0
            }
            return c && c.documentElement && !c.getElementsByTagName("parsererror").length || m.error("Invalid XML: " + b), c
        };
        var yc, zc, Ac = /#.*$/,
            Bc = /([?&])_=[^&]*/,
            Cc = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
            Dc = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            Ec = /^(?:GET|HEAD)$/,
            Fc = /^\/\//,
            Gc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
            Hc = {},
            Ic = {},
            Jc = "*/".concat("*");
        try {
            zc = location.href
        } catch (Kc) {
            zc = y.createElement("a"), zc.href = "", zc = zc.href
        }
        yc = Gc.exec(zc.toLowerCase()) || [];

        function Lc(a) {
            return function(b, c) {
                "string" != typeof b && (c = b, b = "*");
                var d, e = 0,
                    f = b.toLowerCase().match(E) || [];
                if (m.isFunction(c)) {
                    while (d = f[e++]) {
                        "+" === d.charAt(0) ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
                    }
                }
            }
        }

        function Mc(a, b, c, d) {
            var e = {},
                f = a === Ic;

            function g(h) {
                var i;
                return e[h] = !0, m.each(a[h] || [], function(a, h) {
                    var j = h(b, c, d);
                    return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j), g(j), !1)
                }), i
            }
            return g(b.dataTypes[0]) || !e["*"] && g("*")
        }

        function Nc(a, b) {
            var c, d, e = m.ajaxSettings.flatOptions || {};
            for (d in b) {
                void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d])
            }
            return c && m.extend(!0, a, c), a
        }

        function Oc(a, b, c) {
            var d, e, f, g, h = a.contents,
                i = a.dataTypes;
            while ("*" === i[0]) {
                i.shift(), void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"))
            }
            if (e) {
                for (g in h) {
                    if (h[g] && h[g].test(e)) {
                        i.unshift(g);
                        break
                    }
                }
            }
            if (i[0] in c) {
                f = i[0]
            } else {
                for (g in c) {
                    if (!i[0] || a.converters[g + " " + i[0]]) {
                        f = g;
                        break
                    }
                    d || (d = g)
                }
                f = f || d
            }
            return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0
        }

        function Pc(a, b, c, d) {
            var e, f, g, h, i, j = {},
                k = a.dataTypes.slice();
            if (k[1]) {
                for (g in a.converters) {
                    j[g.toLowerCase()] = a.converters[g]
                }
            }
            f = k.shift();
            while (f) {
                if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift()) {
                    if ("*" === f) {
                        f = i
                    } else {
                        if ("*" !== i && i !== f) {
                            if (g = j[i + " " + f] || j["* " + f], !g) {
                                for (e in j) {
                                    if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                                        g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                                        break
                                    }
                                }
                            }
                            if (g !== !0) {
                                if (g && a["throws"]) {
                                    b = g(b)
                                } else {
                                    try {
                                        b = g(b)
                                    } catch (l) {
                                        return {
                                            state: "parsererror",
                                            error: g ? l : "No conversion from " + i + " to " + f
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return {
                state: "success",
                data: b
            }
        }
        m.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: zc,
                type: "GET",
                isLocal: Dc.test(yc[1]),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": Jc,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /xml/,
                    html: /html/,
                    json: /json/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": m.parseJSON,
                    "text xml": m.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(a, b) {
                return b ? Nc(Nc(a, m.ajaxSettings), b) : Nc(m.ajaxSettings, a)
            },
            ajaxPrefilter: Lc(Hc),
            ajaxTransport: Lc(Ic),
            ajax: function(a, b) {
                "object" == typeof a && (b = a, a = void 0), b = b || {};
                var c, d, e, f, g, h, i, j, k = m.ajaxSetup({}, b),
                    l = k.context || k,
                    n = k.context && (l.nodeType || l.jquery) ? m(l) : m.event,
                    o = m.Deferred(),
                    p = m.Callbacks("once memory"),
                    q = k.statusCode || {},
                    r = {},
                    s = {},
                    t = 0,
                    u = "canceled",
                    v = {
                        readyState: 0,
                        getResponseHeader: function(a) {
                            var b;
                            if (2 === t) {
                                if (!j) {
                                    j = {};
                                    while (b = Cc.exec(f)) {
                                        j[b[1].toLowerCase()] = b[2]
                                    }
                                }
                                b = j[a.toLowerCase()]
                            }
                            return null == b ? null : b
                        },
                        getAllResponseHeaders: function() {
                            return 2 === t ? f : null
                        },
                        setRequestHeader: function(a, b) {
                            var c = a.toLowerCase();
                            return t || (a = s[c] = s[c] || a, r[a] = b), this
                        },
                        overrideMimeType: function(a) {
                            return t || (k.mimeType = a), this
                        },
                        statusCode: function(a) {
                            var b;
                            if (a) {
                                if (2 > t) {
                                    for (b in a) {
                                        q[b] = [q[b], a[b]]
                                    }
                                } else {
                                    v.always(a[v.status])
                                }
                            }
                            return this
                        },
                        abort: function(a) {
                            var b = a || u;
                            return i && i.abort(b), x(0, b), this
                        }
                    };
                if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, k.url = ((a || k.url || zc) + "").replace(Ac, "").replace(Fc, yc[1] + "//"), k.type = b.method || b.type || k.method || k.type, k.dataTypes = m.trim(k.dataType || "*").toLowerCase().match(E) || [""], null == k.crossDomain && (c = Gc.exec(k.url.toLowerCase()), k.crossDomain = !(!c || c[1] === yc[1] && c[2] === yc[2] && (c[3] || ("http:" === c[1] ? "80" : "443")) === (yc[3] || ("http:" === yc[1] ? "80" : "443")))), k.data && k.processData && "string" != typeof k.data && (k.data = m.param(k.data, k.traditional)), Mc(Hc, k, b, v), 2 === t) {
                    return v
                }
                h = k.global, h && 0 === m.active++ && m.event.trigger("ajaxStart"), k.type = k.type.toUpperCase(), k.hasContent = !Ec.test(k.type), e = k.url, k.hasContent || (k.data && (e = k.url += (wc.test(e) ? "&" : "?") + k.data, delete k.data), k.cache === !1 && (k.url = Bc.test(e) ? e.replace(Bc, "$1_=" + vc++) : e + (wc.test(e) ? "&" : "?") + "_=" + vc++)), k.ifModified && (m.lastModified[e] && v.setRequestHeader("If-Modified-Since", m.lastModified[e]), m.etag[e] && v.setRequestHeader("If-None-Match", m.etag[e])), (k.data && k.hasContent && k.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", k.contentType), v.setRequestHeader("Accept", k.dataTypes[0] && k.accepts[k.dataTypes[0]] ? k.accepts[k.dataTypes[0]] + ("*" !== k.dataTypes[0] ? ", " + Jc + "; q=0.01" : "") : k.accepts["*"]);
                for (d in k.headers) {
                    v.setRequestHeader(d, k.headers[d])
                }
                if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t)) {
                    return v.abort()
                }
                u = "abort";
                for (d in {
                        success: 1,
                        error: 1,
                        complete: 1
                    }) {
                    v[d](k[d])
                }
                if (i = Mc(Ic, k, b, v)) {
                    v.readyState = 1, h && n.trigger("ajaxSend", [v, k]), k.async && k.timeout > 0 && (g = setTimeout(function() {
                        v.abort("timeout")
                    }, k.timeout));
                    try {
                        t = 1, i.send(r, x)
                    } catch (w) {
                        if (!(2 > t)) {
                            throw w
                        }
                        x(-1, w)
                    }
                } else {
                    x(-1, "No Transport")
                }

                function x(a, b, c, d) {
                    var j, r, s, u, w, x = b;
                    2 !== t && (t = 2, g && clearTimeout(g), i = void 0, f = d || "", v.readyState = a > 0 ? 4 : 0, j = a >= 200 && 300 > a || 304 === a, c && (u = Oc(k, v, c)), u = Pc(k, u, v, j), j ? (k.ifModified && (w = v.getResponseHeader("Last-Modified"), w && (m.lastModified[e] = w), w = v.getResponseHeader("etag"), w && (m.etag[e] = w)), 204 === a || "HEAD" === k.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = u.state, r = u.data, s = u.error, j = !s)) : (s = x, (a || !x) && (x = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || x) + "", j ? o.resolveWith(l, [r, x, v]) : o.rejectWith(l, [v, x, s]), v.statusCode(q), q = void 0, h && n.trigger(j ? "ajaxSuccess" : "ajaxError", [v, k, j ? r : s]), p.fireWith(l, [v, x]), h && (n.trigger("ajaxComplete", [v, k]), --m.active || m.event.trigger("ajaxStop")))
                }
                return v
            },
            getJSON: function(a, b, c) {
                return m.get(a, b, c, "json")
            },
            getScript: function(a, b) {
                return m.get(a, void 0, b, "script")
            }
        }), m.each(["get", "post"], function(a, b) {
            m[b] = function(a, c, d, e) {
                return m.isFunction(c) && (e = e || d, d = c, c = void 0), m.ajax({
                    url: a,
                    type: b,
                    dataType: e,
                    data: c,
                    success: d
                })
            }
        }), m.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
            m.fn[b] = function(a) {
                return this.on(b, a)
            }
        }), m._evalUrl = function(a) {
            return m.ajax({
                url: a,
                type: "GET",
                dataType: "script",
                async: !1,
                global: !1,
                "throws": !0
            })
        }, m.fn.extend({
            wrapAll: function(a) {
                if (m.isFunction(a)) {
                    return this.each(function(b) {
                        m(this).wrapAll(a.call(this, b))
                    })
                }
                if (this[0]) {
                    var b = m(a, this[0].ownerDocument).eq(0).clone(!0);
                    this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                        var a = this;
                        while (a.firstChild && 1 === a.firstChild.nodeType) {
                            a = a.firstChild
                        }
                        return a
                    }).append(this)
                }
                return this
            },
            wrapInner: function(a) {
                return this.each(m.isFunction(a) ? function(b) {
                    m(this).wrapInner(a.call(this, b))
                } : function() {
                    var b = m(this),
                        c = b.contents();
                    c.length ? c.wrapAll(a) : b.append(a)
                })
            },
            wrap: function(a) {
                var b = m.isFunction(a);
                return this.each(function(c) {
                    m(this).wrapAll(b ? a.call(this, c) : a)
                })
            },
            unwrap: function() {
                return this.parent().each(function() {
                    m.nodeName(this, "body") || m(this).replaceWith(this.childNodes)
                }).end()
            }
        }), m.expr.filters.hidden = function(a) {
            return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !k.reliableHiddenOffsets() && "none" === (a.style && a.style.display || m.css(a, "display"))
        }, m.expr.filters.visible = function(a) {
            return !m.expr.filters.hidden(a)
        };
        var Qc = /%20/g,
            Rc = /\[\]$/,
            Sc = /\r?\n/g,
            Tc = /^(?:submit|button|image|reset|file)$/i,
            Uc = /^(?:input|select|textarea|keygen)/i;

        function Vc(a, b, c, d) {
            var e;
            if (m.isArray(b)) {
                m.each(b, function(b, e) {
                    c || Rc.test(a) ? d(a, e) : Vc(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
                })
            } else {
                if (c || "object" !== m.type(b)) {
                    d(a, b)
                } else {
                    for (e in b) {
                        Vc(a + "[" + e + "]", b[e], c, d)
                    }
                }
            }
        }
        m.param = function(a, b) {
            var c, d = [],
                e = function(a, b) {
                    b = m.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
                };
            if (void 0 === b && (b = m.ajaxSettings && m.ajaxSettings.traditional), m.isArray(a) || a.jquery && !m.isPlainObject(a)) {
                m.each(a, function() {
                    e(this.name, this.value)
                })
            } else {
                for (c in a) {
                    Vc(c, a[c], b, e)
                }
            }
            return d.join("&").replace(Qc, "+")
        }, m.fn.extend({
            serialize: function() {
                return m.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var a = m.prop(this, "elements");
                    return a ? m.makeArray(a) : this
                }).filter(function() {
                    var a = this.type;
                    return this.name && !m(this).is(":disabled") && Uc.test(this.nodeName) && !Tc.test(a) && (this.checked || !W.test(a))
                }).map(function(a, b) {
                    var c = m(this).val();
                    return null == c ? null : m.isArray(c) ? m.map(c, function(a) {
                        return {
                            name: b.name,
                            value: a.replace(Sc, "\r\n")
                        }
                    }) : {
                        name: b.name,
                        value: c.replace(Sc, "\r\n")
                    }
                }).get()
            }
        }), m.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function() {
            return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && Zc() || $c()
        } : Zc;
        var Wc = 0,
            Xc = {},
            Yc = m.ajaxSettings.xhr();
        a.ActiveXObject && m(a).on("unload", function() {
            for (var a in Xc) {
                Xc[a](void 0, !0)
            }
        }), k.cors = !!Yc && "withCredentials" in Yc, Yc = k.ajax = !!Yc, Yc && m.ajaxTransport(function(a) {
            if (!a.crossDomain || k.cors) {
                var b;
                return {
                    send: function(c, d) {
                        var e, f = a.xhr(),
                            g = ++Wc;
                        if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields) {
                            for (e in a.xhrFields) {
                                f[e] = a.xhrFields[e]
                            }
                        }
                        a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                        for (e in c) {
                            void 0 !== c[e] && f.setRequestHeader(e, c[e] + "")
                        }
                        f.send(a.hasContent && a.data || null), b = function(c, e) {
                            var h, i, j;
                            if (b && (e || 4 === f.readyState)) {
                                if (delete Xc[g], b = void 0, f.onreadystatechange = m.noop, e) {
                                    4 !== f.readyState && f.abort()
                                } else {
                                    j = {}, h = f.status, "string" == typeof f.responseText && (j.text = f.responseText);
                                    try {
                                        i = f.statusText
                                    } catch (k) {
                                        i = ""
                                    }
                                    h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404
                                }
                            }
                            j && d(h, i, j, f.getAllResponseHeaders())
                        }, a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = Xc[g] = b : b()
                    },
                    abort: function() {
                        b && b(void 0, !0)
                    }
                }
            }
        });

        function Zc() {
            try {
                return new a.XMLHttpRequest
            } catch (b) {}
        }

        function $c() {
            try {
                return new a.ActiveXObject("Microsoft.XMLHTTP")
            } catch (b) {}
        }
        m.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /(?:java|ecma)script/
            },
            converters: {
                "text script": function(a) {
                    return m.globalEval(a), a
                }
            }
        }), m.ajaxPrefilter("script", function(a) {
            void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
        }), m.ajaxTransport("script", function(a) {
            if (a.crossDomain) {
                var b, c = y.head || m("head")[0] || y.documentElement;
                return {
                    send: function(d, e) {
                        b = y.createElement("script"), b.async = !0, a.scriptCharset && (b.charset = a.scriptCharset), b.src = a.url, b.onload = b.onreadystatechange = function(a, c) {
                            (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null, b.parentNode && b.parentNode.removeChild(b), b = null, c || e(200, "success"))
                        }, c.insertBefore(b, c.firstChild)
                    },
                    abort: function() {
                        b && b.onload(void 0, !0)
                    }
                }
            }
        });
        var _c = [],
            ad = /(=)\?(?=&|$)|\?\?/;
        m.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function() {
                var a = _c.pop() || m.expando + "_" + vc++;
                return this[a] = !0, a
            }
        }), m.ajaxPrefilter("json jsonp", function(b, c, d) {
            var e, f, g, h = b.jsonp !== !1 && (ad.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && ad.test(b.data) && "data");
            return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = m.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(ad, "$1" + e) : b.jsonp !== !1 && (b.url += (wc.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function() {
                return g || m.error(e + " was not called"), g[0]
            }, b.dataTypes[0] = "json", f = a[e], a[e] = function() {
                g = arguments
            }, d.always(function() {
                a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, _c.push(e)), g && m.isFunction(f) && f(g[0]), g = f = void 0
            }), "script") : void 0
        }), m.parseHTML = function(a, b, c) {
            if (!a || "string" != typeof a) {
                return null
            }
            "boolean" == typeof b && (c = b, b = !1), b = b || y;
            var d = u.exec(a),
                e = !c && [];
            return d ? [b.createElement(d[1])] : (d = m.buildFragment([a], b, e), e && e.length && m(e).remove(), m.merge([], d.childNodes))
        };
        var bd = m.fn.load;
        m.fn.load = function(a, b, c) {
            if ("string" != typeof a && bd) {
                return bd.apply(this, arguments)
            }
            var d, e, f, g = this,
                h = a.indexOf(" ");
            return h >= 0 && (d = m.trim(a.slice(h, a.length)), a = a.slice(0, h)), m.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (f = "POST"), g.length > 0 && m.ajax({
                url: a,
                type: f,
                dataType: "html",
                data: b
            }).done(function(a) {
                e = arguments, g.html(d ? m("<div>").append(m.parseHTML(a)).find(d) : a)
            }).complete(c && function(a, b) {
                g.each(c, e || [a.responseText, b, a])
            }), this
        }, m.expr.filters.animated = function(a) {
            return m.grep(m.timers, function(b) {
                return a === b.elem
            }).length
        };
        var cd = a.document.documentElement;

        function dd(a) {
            return m.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
        }
        m.offset = {
            setOffset: function(a, b, c) {
                var d, e, f, g, h, i, j, k = m.css(a, "position"),
                    l = m(a),
                    n = {};
                "static" === k && (a.style.position = "relative"), h = l.offset(), f = m.css(a, "top"), i = m.css(a, "left"), j = ("absolute" === k || "fixed" === k) && m.inArray("auto", [f, i]) > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), m.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (n.top = b.top - h.top + g), null != b.left && (n.left = b.left - h.left + e), "using" in b ? b.using.call(a, n) : l.css(n)
            }
        }, m.fn.extend({
            offset: function(a) {
                if (arguments.length) {
                    return void 0 === a ? this : this.each(function(b) {
                        m.offset.setOffset(this, a, b)
                    })
                }
                var b, c, d = {
                        top: 0,
                        left: 0
                    },
                    e = this[0],
                    f = e && e.ownerDocument;
                if (f) {
                    return b = f.documentElement, m.contains(b, e) ? (typeof e.getBoundingClientRect !== K && (d = e.getBoundingClientRect()), c = dd(f), {
                        top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                        left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
                    }) : d
                }
            },
            position: function() {
                if (this[0]) {
                    var a, b, c = {
                            top: 0,
                            left: 0
                        },
                        d = this[0];
                    return "fixed" === m.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), m.nodeName(a[0], "html") || (c = a.offset()), c.top += m.css(a[0], "borderTopWidth", !0), c.left += m.css(a[0], "borderLeftWidth", !0)), {
                        top: b.top - c.top - m.css(d, "marginTop", !0),
                        left: b.left - c.left - m.css(d, "marginLeft", !0)
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    var a = this.offsetParent || cd;
                    while (a && !m.nodeName(a, "html") && "static" === m.css(a, "position")) {
                        a = a.offsetParent
                    }
                    return a || cd
                })
            }
        }), m.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(a, b) {
            var c = /Y/.test(b);
            m.fn[a] = function(d) {
                return V(this, function(a, d, e) {
                    var f = dd(a);
                    return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void(f ? f.scrollTo(c ? m(f).scrollLeft() : e, c ? e : m(f).scrollTop()) : a[d] = e)
                }, a, d, arguments.length, null)
            }
        }), m.each(["top", "left"], function(a, b) {
            m.cssHooks[b] = Lb(k.pixelPosition, function(a, c) {
                return c ? (c = Jb(a, b), Hb.test(c) ? m(a).position()[b] + "px" : c) : void 0
            })
        }), m.each({
            Height: "height",
            Width: "width"
        }, function(a, b) {
            m.each({
                padding: "inner" + a,
                content: b,
                "": "outer" + a
            }, function(c, d) {
                m.fn[d] = function(d, e) {
                    var f = arguments.length && (c || "boolean" != typeof d),
                        g = c || (d === !0 || e === !0 ? "margin" : "border");
                    return V(this, function(b, c, d) {
                        var e;
                        return m.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? m.css(b, c, g) : m.style(b, c, d, g)
                    }, b, f ? d : void 0, f, null)
                }
            })
        }), m.fn.size = function() {
            return this.length
        }, m.fn.andSelf = m.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
            return m
        });
        var ed = a.jQuery,
            fd = a.$;
        return m.noConflict = function(b) {
            return a.$ === m && (a.$ = fd), b && a.jQuery === m && (a.jQuery = ed), m
        }, typeof b === K && (a.jQuery = a.$ = m), m
    });
    module.jQuery = $;
    $.noConflict()
});
Module.define("params", [], function() {
    this.Params = Params;
    this.parse = function() {
        return new Params(document.location.search)
    };

    function Params(queryString) {
        if (queryString) {
            var keyPairs = queryString.substring(1).split("&");
            for (var i = 0; i < keyPairs.length; i++) {
                var kv = keyPairs[i].split("=");
                if (kv.length == 2) {
                    this[kv[0]] = unescape(kv[1].replace(/\+/g, " "))
                }
            }
        }
    }
    Params.prototype.toString = function() {
        var qs = "";
        for (var i in this) {
            if (typeof this[i] != "function") {
                if (this[i] != null) {
                    if (qs.length > 0) {
                        qs += "&"
                    }
                    qs = qs + i + "=" + escape(this[i])
                }
            }
        }
        return qs
    };
    Params.prototype.asObject = function() {
        var ret = {};
        for (var i in this) {
            var val = this[i];
            if (typeof val != "function") {
                if (val != null) {
                    ret[i] = val
                }
            }
        }
        return ret
    };
    Params.prototype.get = function() {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof this[arguments[i]] != "undefined") {
                return this[arguments[i]]
            }
        }
    };
    Params.prototype.go = function(path) {
        path = path || document.location.pathname;
        document.location.href = path + "?" + this
    };
    Params.get = function() {
        return new Params(document.location.search)
    }
});
Module.define("timezone", [], function(module) {
    var jstz = (function() {
        var HEMISPHERE_SOUTH = "s",
            get_date_offset = function(date) {
                var offset = -date.getTimezoneOffset();
                return (offset !== null ? offset : 0)
            },
            get_date = function(year, month, date) {
                var d = new Date();
                if (year !== undefined) {
                    d.setFullYear(year)
                }
                d.setMonth(month);
                d.setDate(date);
                return d
            },
            get_january_offset = function(year) {
                return get_date_offset(get_date(year, 0, 2))
            },
            get_june_offset = function(year) {
                return get_date_offset(get_date(year, 5, 2))
            },
            date_is_dst = function(date) {
                var is_southern = date.getMonth() > 7,
                    base_offset = is_southern ? get_june_offset(date.getFullYear()) : get_january_offset(date.getFullYear()),
                    date_offset = get_date_offset(date),
                    is_west = base_offset < 0,
                    dst_offset = base_offset - date_offset;
                if (!is_west && !is_southern) {
                    return dst_offset < 0
                }
                return dst_offset !== 0
            },
            lookup_key = function() {
                var january_offset = get_january_offset(),
                    june_offset = get_june_offset(),
                    diff = january_offset - june_offset;
                if (diff < 0) {
                    return january_offset + ",1"
                } else {
                    if (diff > 0) {
                        return june_offset + ",1," + HEMISPHERE_SOUTH
                    }
                }
                return january_offset + ",0"
            },
            determine = function() {
                var key = lookup_key();
                return new jstz.TimeZone(jstz.olson.timezones[key])
            },
            dst_start_for = function(tz_name) {
                var ru_pre_dst_change = new Date(2010, 6, 15, 1, 0, 0, 0),
                    dst_starts = {
                        "America/Denver": new Date(2011, 2, 13, 3, 0, 0, 0),
                        "America/Mazatlan": new Date(2011, 3, 3, 3, 0, 0, 0),
                        "America/Chicago": new Date(2011, 2, 13, 3, 0, 0, 0),
                        "America/Mexico_City": new Date(2011, 3, 3, 3, 0, 0, 0),
                        "America/Asuncion": new Date(2012, 9, 7, 3, 0, 0, 0),
                        "America/Santiago": new Date(2012, 9, 3, 3, 0, 0, 0),
                        "America/Campo_Grande": new Date(2012, 9, 21, 5, 0, 0, 0),
                        "America/Montevideo": new Date(2011, 9, 2, 3, 0, 0, 0),
                        "America/Sao_Paulo": new Date(2011, 9, 16, 5, 0, 0, 0),
                        "America/Los_Angeles": new Date(2011, 2, 13, 8, 0, 0, 0),
                        "America/Santa_Isabel": new Date(2011, 3, 5, 8, 0, 0, 0),
                        "America/Havana": new Date(2012, 2, 10, 2, 0, 0, 0),
                        "America/New_York": new Date(2012, 2, 10, 7, 0, 0, 0),
                        "Europe/Helsinki": new Date(2013, 2, 31, 5, 0, 0, 0),
                        "Pacific/Auckland": new Date(2011, 8, 26, 7, 0, 0, 0),
                        "America/Halifax": new Date(2011, 2, 13, 6, 0, 0, 0),
                        "America/Goose_Bay": new Date(2011, 2, 13, 2, 1, 0, 0),
                        "America/Miquelon": new Date(2011, 2, 13, 5, 0, 0, 0),
                        "America/Godthab": new Date(2011, 2, 27, 1, 0, 0, 0),
                        "Europe/Moscow": ru_pre_dst_change,
                        "Asia/Amman": new Date(2013, 2, 29, 1, 0, 0, 0),
                        "Asia/Beirut": new Date(2013, 2, 31, 2, 0, 0, 0),
                        "Asia/Damascus": new Date(2013, 3, 6, 2, 0, 0, 0),
                        "Asia/Jerusalem": new Date(2013, 2, 29, 5, 0, 0, 0),
                        "Asia/Yekaterinburg": ru_pre_dst_change,
                        "Asia/Omsk": ru_pre_dst_change,
                        "Asia/Krasnoyarsk": ru_pre_dst_change,
                        "Asia/Irkutsk": ru_pre_dst_change,
                        "Asia/Yakutsk": ru_pre_dst_change,
                        "Asia/Vladivostok": ru_pre_dst_change,
                        "Asia/Baku": new Date(2013, 2, 31, 4, 0, 0),
                        "Asia/Yerevan": new Date(2013, 2, 31, 3, 0, 0),
                        "Asia/Kamchatka": ru_pre_dst_change,
                        "Asia/Gaza": new Date(2010, 2, 27, 4, 0, 0),
                        "Africa/Cairo": new Date(2010, 4, 1, 3, 0, 0),
                        "Europe/Minsk": ru_pre_dst_change,
                        "Pacific/Apia": new Date(2010, 10, 1, 1, 0, 0, 0),
                        "Pacific/Fiji": new Date(2010, 11, 1, 0, 0, 0),
                        "Australia/Perth": new Date(2008, 10, 1, 1, 0, 0, 0)
                    };
                return dst_starts[tz_name]
            };
        return {
            determine: determine,
            date_is_dst: date_is_dst,
            dst_start_for: dst_start_for
        }
    }());
    jstz.TimeZone = function(tz_name) {
        var AMBIGUITIES = {
                "America/Denver": ["America/Denver", "America/Mazatlan"],
                "America/Chicago": ["America/Chicago", "America/Mexico_City"],
                "America/Santiago": ["America/Santiago", "America/Asuncion", "America/Campo_Grande"],
                "America/Montevideo": ["America/Montevideo", "America/Sao_Paulo"],
                "Asia/Beirut": ["Asia/Amman", "Asia/Jerusalem", "Asia/Beirut", "Europe/Helsinki", "Asia/Damascus"],
                "Pacific/Auckland": ["Pacific/Auckland", "Pacific/Fiji"],
                "America/Los_Angeles": ["America/Los_Angeles", "America/Santa_Isabel"],
                "America/New_York": ["America/Havana", "America/New_York"],
                "America/Halifax": ["America/Goose_Bay", "America/Halifax"],
                "America/Godthab": ["America/Miquelon", "America/Godthab"],
                "Asia/Dubai": ["Europe/Moscow"],
                "Asia/Dhaka": ["Asia/Yekaterinburg"],
                "Asia/Jakarta": ["Asia/Omsk"],
                "Asia/Shanghai": ["Asia/Krasnoyarsk", "Australia/Perth"],
                "Asia/Tokyo": ["Asia/Irkutsk"],
                "Australia/Brisbane": ["Asia/Yakutsk"],
                "Pacific/Noumea": ["Asia/Vladivostok"],
                "Pacific/Tarawa": ["Asia/Kamchatka", "Pacific/Fiji"],
                "Pacific/Tongatapu": ["Pacific/Apia"],
                "Asia/Baghdad": ["Europe/Minsk"],
                "Asia/Baku": ["Asia/Yerevan", "Asia/Baku"],
                "Africa/Johannesburg": ["Asia/Gaza", "Africa/Cairo"]
            },
            timezone_name = tz_name,
            ambiguity_check = function() {
                var ambiguity_list = AMBIGUITIES[timezone_name],
                    length = ambiguity_list.length,
                    i = 0,
                    tz = ambiguity_list[0];
                for (; i < length; i += 1) {
                    tz = ambiguity_list[i];
                    if (jstz.date_is_dst(jstz.dst_start_for(tz))) {
                        timezone_name = tz;
                        return
                    }
                }
            },
            is_ambiguous = function() {
                return typeof(AMBIGUITIES[timezone_name]) !== "undefined"
            };
        if (is_ambiguous()) {
            ambiguity_check()
        }
        return {
            name: function() {
                return timezone_name
            }
        }
    };
    jstz.olson = {};
    jstz.olson.timezones = {
        "-720,0": "Pacific/Majuro",
        "-660,0": "Pacific/Pago_Pago",
        "-600,1": "America/Adak",
        "-600,0": "Pacific/Honolulu",
        "-570,0": "Pacific/Marquesas",
        "-540,0": "Pacific/Gambier",
        "-540,1": "America/Anchorage",
        "-480,1": "America/Los_Angeles",
        "-480,0": "Pacific/Pitcairn",
        "-420,0": "America/Phoenix",
        "-420,1": "America/Denver",
        "-360,0": "America/Guatemala",
        "-360,1": "America/Chicago",
        "-360,1,s": "Pacific/Easter",
        "-300,0": "America/Bogota",
        "-300,1": "America/New_York",
        "-270,0": "America/Caracas",
        "-240,1": "America/Halifax",
        "-240,0": "America/Santo_Domingo",
        "-240,1,s": "America/Santiago",
        "-210,1": "America/St_Johns",
        "-180,1": "America/Godthab",
        "-180,0": "America/Argentina/Buenos_Aires",
        "-180,1,s": "America/Montevideo",
        "-120,0": "America/Noronha",
        "-120,1": "America/Noronha",
        "-60,1": "Atlantic/Azores",
        "-60,0": "Atlantic/Cape_Verde",
        "0,0": "UTC",
        "0,1": "Europe/London",
        "60,1": "Europe/Berlin",
        "60,0": "Africa/Lagos",
        "60,1,s": "Africa/Windhoek",
        "120,1": "Asia/Beirut",
        "120,0": "Africa/Johannesburg",
        "180,0": "Asia/Baghdad",
        "180,1": "Europe/Moscow",
        "210,1": "Asia/Tehran",
        "240,0": "Asia/Dubai",
        "240,1": "Asia/Baku",
        "270,0": "Asia/Kabul",
        "300,1": "Asia/Yekaterinburg",
        "300,0": "Asia/Karachi",
        "330,0": "Asia/Kolkata",
        "345,0": "Asia/Kathmandu",
        "360,0": "Asia/Dhaka",
        "360,1": "Asia/Omsk",
        "390,0": "Asia/Rangoon",
        "420,1": "Asia/Krasnoyarsk",
        "420,0": "Asia/Jakarta",
        "480,0": "Asia/Shanghai",
        "480,1": "Asia/Irkutsk",
        "525,0": "Australia/Eucla",
        "525,1,s": "Australia/Eucla",
        "540,1": "Asia/Yakutsk",
        "540,0": "Asia/Tokyo",
        "570,0": "Australia/Darwin",
        "570,1,s": "Australia/Adelaide",
        "600,0": "Australia/Brisbane",
        "600,1": "Asia/Vladivostok",
        "600,1,s": "Australia/Sydney",
        "630,1,s": "Australia/Lord_Howe",
        "660,1": "Asia/Kamchatka",
        "660,0": "Pacific/Noumea",
        "690,0": "Pacific/Norfolk",
        "720,1,s": "Pacific/Auckland",
        "720,0": "Pacific/Tarawa",
        "765,1,s": "Pacific/Chatham",
        "780,0": "Pacific/Tongatapu",
        "780,1,s": "Pacific/Apia",
        "840,0": "Pacific/Kiritimati"
    };
    for (var i in jstz) {
        module[i] = jstz[i]
    }
});
Module.define("vcom/challenge", ["base", "jquery", "vcom/latestachievements", "vcom/challenge.css"], function(module) {
    module.Challenge = Challenge;
    module.RoundDisplay = RoundDisplay;
    var $ = window.jQuery;
    Challenge.serviceURL = "/challenge";
    Challenge.animateOffset = -280;
    var POS = {
        n: "a noun",
        v: "a verb",
        a: "an adjective",
        r: "an adverb",
    };
    Challenge.extend(modules.base.EventSource);

    function Challenge(element) {
        var _this = this;
        this.element = element = $(element);
        var pdata = null;
        var shownAt = 0,
            playTime = 0,
            canGoNext = true;
        var questionPane = this.questionPane = $("<div></div>");
        if (window.VCOM && !window.VCOM.challenge) {
            window.VCOM.challenge = this
        }
        questionPane.appendTo(element);
        var nextQuestionButton = $('<button class="nextQuestion">NEXT QUESTION</button>').hide().on("click", function() {
            _this.showNextQuestion();
            this.blur()
        }).appendTo(element);
        this.update = update;

        function update(data) {
            if (data.status == 0 && data.result) {
                var result = data.result;
                if (result.pdata) {
                    _this.pdata = result.pdata
                }
                if (result.auth) {
                    _this.auth = result.auth
                }
                if (result.secret) {
                    _this.secret = result.secret
                }
                element.trigger({
                    type: "challenge.update"
                })
            } else {
                alert("Sorry, your session has expired, we'll need to restart your game.");
                document.location.reload()
            }
        }
        this.saveAnswer = function(question, data) {
            var now = +(new Date());
            data = $.extend({
                secret: _this.secret,
                t: now,
                rt: now - shownAt,
                pt: playTime
            }, data);
            if (element.attr("wlid")) {
                data.wlid = element.attr("wlid")
            }
            return $.post(Challenge.serviceURL + "/saveanswer", data, function(response) {
                update(response);
                if (response && response.result && response.result.adata) {
                    question.data("adata", response.result.adata)
                }
                if (window._gaq) {
                    _gaq.push(["_trackEvent", "challenge", "answer", question.data("mode")])
                }
            }).fail(function() {
                alert("Sorry, we encountered an error saving your answer. We'll need to restart your game.");
                document.location.reload()
            })
        };
        element.on("challenge.questionComplete", function(evt) {
            playTime += new Date().getTime() - shownAt;
            element.removeClass("active");
            if (evt.question) {
                _this.fireEvent("questionAnswered", evt)
            }
            if (!evt.tries || evt.tries == 1) {
                nextQuestionButton.fadeIn().focus()
            }
            canGoNext = true
        });
        this.showNextQuestion = showNextQuestion;

        function showNextQuestion() {
            element.find(":focus").blur();
            if (!canGoNext || element.hasClass("active")) {
                return
            }
            canGoNext = false;
            nextQuestionButton.hide();
            var now = +(new Date());
            setTimeout(function() {
                var post = {
                    t: now,
                    secret: _this.secret
                };
                if (element.attr("wlid")) {
                    post.wlid = element.attr("wlid")
                }
                $.post(Challenge.serviceURL + "/nextquestion", post, function(response) {
                    if (response.status == 0 && response.result) {
                        var result = response.result;
                        var initCall = (_this.pdata == null);
                        update(response);
                        questionPane.html(decodeBase64(result.code));
                        delete result.code;
                        element.addClass("active");
                        var question = questionPane.find(".slide").data(result);
                        createController(question, question.data());
                        shownAt = new Date().getTime();
                        if (initCall) {
                            question.trigger("challenge.init")
                        }
                        if (result.cmd === "newround") {
                            element.trigger("challenge.newround")
                        }
                        question.trigger("challenge.nextQuestion");
                        _this.fireEvent("nextQuestion", question);
                        element.removeClass("loadingnext")
                    }
                })
            }, Math.max(1, 2000 - (now - shownAt)))
        }

        function createController(qdata, data) {
            var factory = function() {};
            if (data.type == "spelling") {
                factory = SpellingQuestion
            }
            if (data.type == "choice") {
                factory = MultipleChoiceQuestion
            }
            if (data.type == "interstitial") {
                factory = Interstitial
            }
            return factory(_this, qdata)
        }
    }

    function RoundDisplay(element, challenge) {
        var root = $('<ol class="roundList"/>');
        for (var i = 0; i < 10; i++) {
            root.append('<li role="button" />')
        }
        root.appendTo(element);
        var children = root.find("li");
        challenge.element.on("challenge.questionComplete", function(evt) {
            if (evt.question && challenge.pdata.round.length) {
                render(challenge.pdata.round, challenge.pdata.round.length - 1)
            }
        }).on("challenge.newround", function() {
            children.empty().attr("class", "").removeAttr("word")
        }).on("challenge.init", function() {
            challenge.pdata.round.forEach(function(item, idx) {
                render(challenge.pdata.round, idx)
            })
        });

        function render(round, idx) {
            var correct = round[idx].cor;
            var wordEle = $(children[idx]).addClass(correct ? "correct" : "incorrect").attr("word", round[idx].prg[0].wrd);
            $("<span/>").text(round[idx].prg[0].wrd).appendTo(wordEle);
            if (correct) {
                var progress = round[idx].prg[0].prg;
                if (progress == 1) {
                    wordEle.addClass("mastered")
                }
                if (window.loginData && loginData.validUser) {
                    $('<div class="barchart"/>').append($('<div class="bar"/>').css("width", (progress * 100) + "%")).attr("title", "Your progress: " + parseInt(progress * 100) + "% mastered.").appendTo(wordEle)
                }
            }
        }
    }

    function ChallengeController(challenge) {
        var blurbShowing = false;
        challenge.element.on("challenge.questionComplete", function(evt) {
            if (!blurbShowing && evt.question && evt.tries > 1) {
                var data = evt.question.data("adata");
                if (data && data.word) {
                    blurbShowing = true;
                    $("#blurbPane").load(Challenge.serviceURL + "/blurb/" + encodeURIComponent(data.word), function() {
                        VCOM.parse(this);
                        $("#challengeContainer").animate({
                            left: Challenge.animateOffset
                        }, 500, "linear");
                        $("#roundDisplay").animate({
                            left: 330,
                            display: "toggle"
                        }, 250, "linear", function() {
                            $(this).hide()
                        });
                        $("#blurbPane").fadeIn(500)
                    })
                }
            }
        });
        var cnt = 0;
        challenge.element.on("challenge.nextQuestion", function() {
            if (blurbShowing) {
                blurbShowing = false;
                $("#challengeContainer").animate({
                    left: 0
                }, 500, "linear");
                $("#roundDisplay").show().animate({
                    left: 510
                }, 250, "linear");
                $("#blurbPane").fadeOut(500)
            }
            if (cnt > 0) {
                $(".welcomeMessage").load(Challenge.serviceURL + "/message", {
                    ts: new Date().getTime()
                })
            }
            cnt++
        })
    }

    function Interstitial(challenge, question) {
        if (!question.hasClass("terminal")) {
            setTimeout(function() {
                question.trigger($.Event("challenge.questionComplete"))
            }, 1000)
        }
    }

    function MultipleChoiceQuestion(challenge, question) {
        var choicesContainer = null;
        var lastPickTime = 0;
        var choices = question.find(".choices a").not(".correct, .incorrect");
        var tries = 4 - choices.length;
        var answerPromise = $.Deferred();
        var progressData = null;
        choices.on("click", function() {
            lastPickTime = +(new Date());
            var choice = $(this).off("click").addClass("loading");
            var evt = {
                tries: ++tries,
                question: question
            };
            answerPromise.then(function(adata) {
                choice.removeClass("loading");
                if (!question.hasClass("complete")) {
                    evt.correct = (choice.attr("nonce") == adata.nonces[0]);
                    evt.correct = true;
                    challenge.fireEvent("pick", evt);
                    question.trigger("challenge.pick");
                    if (evt.correct) {
                        question.addClass("complete");
                        choices.off("click");
                        choice.addClass("correct")
                    } else {
                        choice.addClass("incorrect");
                        if (evt.tries === 1) {
                            question.find(".pointValue").html("0")
                        }
                    }
                    challenge.questionPane.toggleClass("incorrect", !evt.correct);
                    var messages = (evt.correct) ? correctMessages[evt.tries - 1] : wrongMessages[evt.tries - 1];
                    if (evt.correct) {
                        question.trigger($.Event("challenge.questionComplete", evt));
                        if (evt.tries > 1) {
                            question.find(".def").empty().append("In this question,  ").append($("<strong/>").text(progressData.wrd)).append(" is " + POS[progressData.pos] + " that means ").append($("<i></i>").text(((progressData.pos == "v") ? "to " : "") + progressData.def.trim() + ".")).appendTo(question.find(".messagePane"))
                        }
                    }
                    question.find(".messagePane").fadeIn().find(".messages").html("<h3>" + messages[Math.floor(Math.random() * messages.length)] + "</h3>")
                }
            });
            if (evt.tries === 1) {
                challenge.saveAnswer(question, {
                    a: choice.attr("nonce")
                }).then(function(response) {
                    progressData = response.result.prg[0];
                    answerPromise.resolve(question.data("adata"))
                })
            }
        });
        (function() {
            var timeout = null;
            var lifelines = question.find(".lifeLines");
            var content = question.find(".lifeLineContent");
            if (tries == 0) {
                question.one("challenge.pick", function() {
                    if (timeout != null) {
                        clearTimeout(timeout)
                    }
                    lifelines.slideUp().find("a").off("click");
                    content.slideUp()
                });
                timeout = window.setTimeout(function() {
                    timeout = null;
                    lifelines.fadeIn().find("a").one("click", function() {
                        lifelines.slideUp().find("a").off("click");
                        var type = $(this).data("type");
                        var pv = question.find(".pointValue");
                        pv.text(parseInt(pv.text()) / 2);
                        $.post(Challenge.serviceURL + "/hint.json", {
                            secret: challenge.secret,
                            type: type
                        }, function(result) {
                            challenge.update(result);
                            if (result.status == 0 && result.result) {
                                result = result.result;
                                switch (type) {
                                    case "E":
                                        Module.after("vcom/examplebrowser", function() {
                                            var exampleBrowser = new modules.vcom.examplebrowser.ExampleBrowser(null, {
                                                hideDomains: true,
                                                displayWindow: 1
                                            });
                                            content.hide().css("overflow", "hidden").append(exampleBrowser.element);
                                            exampleBrowser.search(result.word);
                                            content.show()
                                        });
                                        break;
                                    case "F":
                                        result.nonces.forEach(function(n) {
                                            $(".choices a[nonce=" + n + "]").addClass("incorrect").off("click")
                                        });
                                        break;
                                    case "D":
                                        content.append(result.def);
                                    default:
                                        content.fadeIn()
                                }
                            }
                        }, "json")
                    })
                }, 7000)
            }
        })();
        var wrongMessages = [
            ["Nope, that wasn't the answer, take another look.", "Strike 1! Give it another try!", "Um, no. What's your second guess?"],
            ["That wasn't it either", "Look at the bright side, now you've got a 50/50 chance!", "You're getting warmer...", "Survey says: you're wrong again."],
            ["Well, it should be pretty easy now, take a wild guess.", "You can't miss now", "Easy enough for you now?", "I guess today isn't your lucky day.", "See if you can spot the right answer now.", "Let me make this real easy for you."]
        ];
        var correctMessages = [
            ["Nice Job!", "Correct!"],
            ["You got it!", "Bingo!", "We knew you'd figure it out!", "We have a winner!"],
            ["Third time's a charm, huh?"],
            ["That's the one!", "You're a genius!"]
        ]
    }

    function SpellingQuestion(challenge, question) {
        var deferredAnswer = $.Deferred();
        var spellingField = $("input.wordspelling", question).on("keypress", function(e) {
            if (e.which == 13) {
                checkSpelling()
            }
        }).focus();
        $(".playword", question).on("click", debounce(function() {
            VCOM.playAudio({
                name: question.data("audio"),
                nodeName: "audio"
            });
            spellingField.focus()
        }, 1200));
        var spellitButton = $("button.spellit", question).on("click", checkSpelling);
        var surrenderButton = $("button.surrender", question).on("click", function() {
            deferredAnswer.then(function(data) {
                showAnswer(data.reveal);
                question.trigger($.Event("challenge.questionComplete", {
                    correct: false,
                    tries: parseInt(question.attr("guesses")) + 1,
                    question: question
                }));
                question.find(".messagePane").fadeIn().find(".messages").html('<h3>The correct spelling is <span class="correctspelling">' + question.data("adata").word + "</span>.</h3>")
            })
        }).hide();
        var sentenceBlanked = $(".questionContent .blanked", question);
        var messagePane = $(".messagePane", question);

        function checkSpelling() {
            var guess = spellingField.val().trim().toLowerCase();
            if (guess.length == 0) {
                $(".playword", question).trigger("click");
                return
            }
            var evt = {
                question: question,
                tries: parseInt(question.attr("guesses") || 0) + 1
            };
            question.attr("guesses", "" + evt.tries);
            deferredAnswer.then(function(data) {
                evt.correct = (data && data.acceptedAnswers.indexOf(guess) != -1);
                question.trigger($.Event("challenge.pick", evt));
                var tries = Math.min(3, evt.tries);
                var messages = (evt.correct) ? correctMessages[tries - 1] : wrongMessages[tries - 1];
                var randmsg = (evt.correct || tries < 3) ? messages[Math.floor(Math.random() * messages.length)] : messages[(evt.tries - 1) % messages.length];
                question.find(".messagePane").fadeIn().find(".messages").html("<h3>" + randmsg + "</h3>");
                if (evt.correct) {
                    showAnswer(data.reveal);
                    question.trigger($.Event("challenge.questionComplete", evt))
                } else {
                    if (evt.tries > 2) {
                        surrenderButton.fadeIn()
                    }
                }
            });
            if (evt.tries == 1) {
                challenge.saveAnswer(question, {
                    a: guess
                }).then(function(response) {
                    var adata = question.data("adata");
                    adata.reveal = response.result.reveal;
                    deferredAnswer.resolve(adata)
                })
            }
        }

        function showAnswer(reveal) {
            spellingField.attr("disabled", true);
            spellingField.blur();
            spellingField.off("keypress focus");
            surrenderButton.off("click");
            spellitButton.off("click");
            var html = sentenceBlanked.text().split(/_+/);
            sentenceBlanked.empty();
            for (var i = 0, r = 0; i < html.length; i++) {
                sentenceBlanked.append(document.createTextNode(html[i]));
                if (r < reveal.length) {
                    sentenceBlanked.append($("<strong/>").text(reveal[r++]))
                }
            }
        }
        var wrongMessages = [
            ["Nope, that wasn't the answer, try again.", "Strike 1! Give it another try!", "Um, no. What's your second guess?"],
            ["That wasn't it either", "Survey says: you're wrong again."],
            ["That's not right.", "Wrong."]
        ];
        var correctMessages = [
            ["Nice Job!", "Correct!"],
            ["You got it!", "Bingo!", "We knew you'd figure it out!", "We have a winner!"],
            ["Third time's a charm, huh?"]
        ]
    }

    function formatNumber(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    $(function() {
        if ($("#questionContainer").length) {
            var challenge = new Challenge($("#questionContainer")[0]);
            var round = new RoundDisplay($("#roundPanel")[0], challenge);
            var ctrl = new ChallengeController(challenge);
            challenge.addEventListener("nextQuestion", function() {
                if (window.VCOM) {
                    VCOM.fireEvent("nextQuestion")
                }
            });
            $("#challengeContainer").on("click", '*[role="button"][word]', function(e) {
                VCOM.displayWord($(this).attr("word"));
                return false
            });
            (function(challenge) {
                var points = null;
                challenge.element.on("challenge.update", function() {
                    if (points == null) {
                        animateScore(points = challenge.pdata.points, points)
                    } else {
                        animateScore(points, points = challenge.pdata.points)
                    }
                    if (challenge.pdata.rn != null) {
                        $("#roundDisplay .roundNumber").text(1 + challenge.pdata.rn)
                    }
                });

                function animateScore(from, to, step) {
                    if (!step) {
                        step = Math.ceil((to - from) / 20)
                    }
                    var s = Math.min(from, to);
                    if (s < to) {
                        setTimeout(function() {
                            animateScore(from + step, to, step)
                        }, 40)
                    }
                    $("#score_points").html(formatNumber(s));
                    if (s == to) {
                        if (window.loginData && loginData.validUser) {
                            panel = $("#roundDisplay .scorePanel").attr("title", "Your Level: " + challenge.pdata.level.name).attr("class", "scorePanel " + challenge.pdata.level.id)
                        }
                    }
                }
            })(challenge);
            var roundTab = $("#roundChalTab").addClass("selected").on("click", function() {
                roundTab.addClass("selected").siblings(".chalRoundTab ").removeClass("selected");
                $("#roundPanel").show().siblings(".panel ").hide()
            });
            challenge.element.on("challenge.questionComplete", function() {
                roundTab.trigger("click")
            });
            var topScores = null;
            var top10Tab = $("#top10ChalTab").on("click", function() {
                Module.after(["vcom/topscores"], function() {
                    if (!topScores) {
                        topScores = new modules.vcom.topscores.TopScores($("#top10Panel"))
                    }
                    $("#top10Panel").one("scoresLoaded", function() {
                        top10Tab.addClass("selected").siblings(".chalRoundTab ").removeClass("selected");
                        $("#top10Panel").show().siblings(".panel ").hide()
                    });
                    topScores.loadTodaysScores()
                })
            });
            var friendsScores = null;
            var friendsTab = $("#friendsChalTab").on("click", function() {
                Module.after(["vcom/friendsscores"], function() {
                    if (!friendsScores) {
                        friendsScores = new modules.vcom.friendsscores.FriendsScores($("#friendsPanel")[0])
                    }
                    friendsScores.addEventListener("scoresLoaded", function scoresLoaded() {
                        friendsTab.addClass("selected").siblings(".chalRoundTab ").removeClass("selected");
                        $("#friendsPanel").show().siblings(".panel ").hide();
                        friendsScores.removeEventListener("scoresLoaded", scoresLoaded)
                    });
                    friendsScores.loadTopFriendScores()
                })
            });
            if (location.hash.indexOf("#choice=") == 0) {
                var choice = location.hash.substring(8);
                $("#questionContainer").one("challenge.init", function() {
                    $(this).find('.choices a[nonce="' + choice + '"]').trigger("click");
                    location.hash = ""
                })
            }
            challenge.showNextQuestion();
            if (window.loginData && loginData.validUser) {
                var la = new modules.vcom.latestachievements.LatestAchievements(roundPanel);
                la.load();
                challenge.addEventListener("questionAnswered", function() {
                    var lastTurn = challenge.pdata.round[challenge.pdata.round.length - 1];
                    if (lastTurn && lastTurn.ach) {
                        la.add(lastTurn.ach)
                    }
                })
            }
            challenge.addEventListener("questionAnswered", function(evt) {
                $('<a class="rateQuestion" href="#">Improve this question</a>').appendTo(evt.target).on("click", function() {
                    var question = $(this).closest(".question");
                    Module.after("vcom/voting/questionrater", function() {
                        modules.vcom.voting.questionrater.rateQuestion(question)
                    });
                    return false
                })
            })
        }
    });

    function r13(s) {
        return s.replace(/[a-zA-Z]/g, function(c) {
            return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
        })
    }

    function decodeBase64(s) {
        var e = {},
            i, b = 0,
            c, x, l = 0,
            a, r = "",
            w = String.fromCharCode,
            L = s.length;
        var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        for (i = 0; i < 64; i++) {
            e[A.charAt(i)] = i
        }
        for (x = 0; x < L; x++) {
            c = e[s.charAt(x)];
            b = (b << 6) + c;
            l += 6;
            while (l >= 8) {
                ((a = (b >>> (l -= 8)) & 255) || (x < (L - 2))) && (r += w(a))
            }
        }
        return decodeURIComponent(escape(r))
    }

    function dcd(s) {
        return (s == null || !s.length) ? undefined : $.parseJSON(r13(decodeBase64(s)))
    }

    function dct(s) {
        return (s == null || !s.length) ? undefined : r13(decodeBase64(s))
    }

    function debounce(fn, minTime) {
        var lastTime = 0;
        return function() {
            var now = +(new Date());
            if (now - lastTime > minTime) {
                fn.apply(this, arguments);
                lastTime = now
            }
        }
    }
});
Module.define("vcom/latestachievements", ["jquery"], function(module) {
    var $ = jQuery;
    this.LatestAchievements = LatestAchievements;

    function LatestAchievements(container) {
        var elm = $('<div class="latestachieves"/>').appendTo(container);
        var hidden = true;
        this.load = load;

        function load() {
            elm.load("/challenge/latestachieves", {
                ts: new Date().getTime()
            }, function() {
                if ($(elm).find(".achieves a").length) {
                    hidden = false;
                    elm.slideDown()
                }
            })
        }
        this.add = add;

        function add(achievements) {
            $.post("/challenge/getachieves", {
                codes: JSON.stringify(achievements)
            }, function(action) {
                var achieves = action.result.results;
                if (achieves && achieves.length) {
                    if (elm.find(".achieves a").length) {
                        elm.find(".achieves").animate({
                            paddingLeft: achieves.length * 33
                        }, 500, function() {
                            add();
                            $(this).css({
                                paddingLeft: 0
                            })
                        })
                    } else {
                        if (hidden) {
                            elm.slideDown(add);
                            hidden = false
                        } else {
                            add()
                        }
                    }
                }

                function add() {
                    var $achieves = elm.find(".achieves").prepend(achieves.map(function(ach) {
                        return $('<a class="achieve">').attr("href", "/leaderboards/today/" + ach.code).attr("title", ach.name).append('<img src="/images/achieve-sm/' + ach.code + '.gif" >').fadeIn(750)
                    }));
                    if ($achieves.length > 5) {
                        $achieves.slice($achieves.length - 5).remove()
                    }
                }
            })
        }
    }
});
(function() {
    var a = document.createElement("audio");
    window.__nativeAudio = !!(a.canPlayType && a.canPlayType("audio/mpeg;").replace(/no/, ""))
})();
Module.define("vcom/maintabs", window.__nativeAudio ? ["jquery", "dotimeout", "base", "params", "cookie"] : ["jquery", "dotimeout", "base", "params", "cookie", "soundmanager/soundmanager"], function(module) {
    var $ = jQuery;
    $.fn.noSelect = function() {
        this.css("user-select", "none").on((typeof document.body.onselectstart === "undefined") ? "mousedown" : "selectstart", function(e) {
            e.preventDefault();
            e.stopPropagation()
        })
    };
    $.fn.resizeText = function() {
        this.css("font-size", "");
        var sizes = [],
            remaining;
        do {
            remaining = this.filter(function() {
                var cw = this.clientWidth,
                    size = parseFloat($(this).css("font-size")),
                    sw = this.scrollWidth;
                if (cw > 0 && cw < sw && size > 1) {
                    sizes.push(size - ((size > 14) ? 2 : 1));
                    return true
                }
            }).css("font-size", function(i) {
                return sizes[i]
            });
            sizes = []
        } while (remaining.length)
    };
    $(function() {
        $(window).trigger("resize");
        $("a[href='/auth/logout']").on("click", function() {
            try {
                window.sessionStorage.clear();
                window.localStorage.clear()
            } catch (e) {}
        });
        $(".dynamictext").resizeText()
    });
    $(window).on("resize orientationchange", function() {
        $("#page").css("min-height", $(window).height() - ($("#pageFooter").height() + $(".pageHeader").height()))
    });
    var Event = modules.base.Event;
    var dictionaryURL = "/dictionary/";
    var VCOM = window.VCOM = new modules.base.EventSource();
    VCOM.login = function() {
        document.location.href = "/login/?success=" + escape(document.location.href)
    };
    VCOM.displayWord = function(word, lang, delay) {
        Module.after("vcom/dictionary", function() {
            if (!VCOM.dictionary) {
                VCOM.dictionary = new modules.vcom.dictionary.Dictionary();
                VCOM.dictionary.addEventListener("load", function(e) {
                    VCOM.fireEvent("dictpageload", e)
                })
            }
            VCOM.dictionary.displayWord(word, lang, delay)
        })
    };
    var lastPlay = null;
    VCOM.playAudio = function(word, lang, pronunIdx) {
        var play = (function(code) {
            var url = "https://audio.vocab.com/1.0/us/" + code + ".mp3";
            if (window.__nativeAudio) {
                var audioElement = document.createElement("audio");
                audioElement.setAttribute("src", url);
                audioElement.play()
            } else {
                if (modules.soundmanager) {
                    modules.soundmanager.play({
                        id: url,
                        url: url
                    })
                }
            }
        });
        if (typeof word == "string") {
            if (lastPlay && lastPlay.word == word) {
                lastPlay.play()
            } else {
                lastPlay = null;
                $.post("/dictionary/audio.json", {
                    word: word,
                    idx: pronunIdx || 0
                }, function(c) {
                    lastPlay = {
                        word: word,
                        play: function() {
                            play(c.result)
                        }
                    };
                    lastPlay.play()
                })
            }
        } else {
            if (word && word.nodeName) {
                play(word.name)
            }
        }
    };
    VCOM.addFavorite = function(id, callback) {
        if (window._gaq) {
            _gaq.push(["_trackEvent", "tools", "addfavorite"])
        }
        $.post("/lists/addfavorite.json", {
            wordlistid: id
        }, function(d) {
            if (callback) {
                callback(d.result)
            }
        })
    };
    VCOM.newList = function() {
        if (window._gaq) {
            _gaq.push(["_trackEvent", "tools", (loginData.validUser) ? "login" : "validuser"])
        }
        if (loginData.validUser) {
            document.location.href = "/lists/new"
        } else {
            if (confirm("You must be logged in to create lists. Would you like to log in now?")) {
                VCOM.login()
            }
        }
    };
    (function() {
        var tags = {
            mywiw: function(elements) {
                Module.after("vcom/mywordsinwild", function() {
                    elements.each(modules.vcom.mywordsinwild.construct)
                })
            },
            examples: function(elements) {
                Module.after("vcom/examplebrowser", function() {
                    elements.each(modules.vcom.examplebrowser.construct)
                })
            },
            wordfamily: function(elements) {
                Module.after("vcom/wordfamily", function() {
                    elements.each(modules.vcom.wordfamily.construct)
                })
            },
            addtolist: function(elements) {
                Module.after("vcom/tools", function() {
                    elements.each(modules.vcom.tools.addToList)
                })
            },
            share: function(elements) {
                Module.after("vcom/tools", function() {
                    elements.each(modules.vcom.tools.share)
                })
            },
            qpreview: function(elements) {
                Module.after("vcom/qpreview", function() {
                    $(elements).each(modules.vcom.qpreview.construct)
                })
            },
            progress: function(elements) {
                Module.after("vcom/progress/progress", function() {
                    $(elements).each(modules.vcom.progress.progress.construct)
                })
            },
            votes: function(elements) {
                Module.after("vcom/voting/voting", function() {
                    modules.vcom.voting.voting.construct(elements)
                })
            },
            mywordlists: function(elements) {
                Module.after("vcom/wlwidget/wlwidget", function() {
                    $(elements).each(modules.vcom.wlwidget.wlwidget.construct)
                })
            },
            commentviewer: function(elements) {
                Module.after("vcom/comments", function() {
                    modules.vcom.comments.construct(elements)
                })
            }
        };
        VCOM.parse = function(element) {
            for (var tag in tags) {
                var elements = $("vcom\\:" + tag, element);
                if (elements.length) {
                    tags[tag](elements)
                }
            }
            $("a[data-audio]", element).on("click", function() {
                var code = $(this).data("audio");
                var url = "https://audio.vocab.com/1.0/us/" + code + ".mp3";
                if (window.__nativeAudio) {
                    var audioElement = document.createElement("audio");
                    audioElement.setAttribute("src", url);
                    audioElement.play()
                } else {
                    if (modules.soundmanager) {
                        modules.soundmanager.play({
                            id: url,
                            url: url
                        })
                    }
                }
            });
            $("a.anchorlink").on("click", function(event) {
                var href = $(this).attr("href");
                $("html:not(:animated),body:not(:animated)").animate({
                    scrollTop: $(href).offset().top
                }, 1000, function() {
                    window.location.hash = href
                });
                return false
            });
            $(".dynamictext").resizeText()
        }
    })();
    VCOM.addEventListener("restore", function() {
        if (window.startWord) {
            VCOM.displayWord(window.startWord, "en")
        } else {
            VCOM.displayWord(null);
            $("#pageContent").hide()
        }
    });
    VCOM.addEventListener("lookup", function() {
        $("#pageContent").hide()
    });
    $(function() {
        $("#challengeTab,#listTab,.subnav").noSelect();
        if ($("#dictionaryTab").hasClass("selected")) {
            var p = new modules.params.Params(document.location.hash.substring(0));
            if (p.word && p.lang && p.lang != "en") {
                window.location.replace(dictionaryURL + p.lang + "/" + p.word);
                return
            } else {
                if (p.word) {
                    window.location.replace(dictionaryURL + p.word);
                    return
                } else {
                    loadAutocomplete()
                }
            }
        } else {
            $("#lookItUp,#search").on("focus click", function() {
                document.location.href = dictionaryURL
            })
        }
        VCOM.parse();
        $("a[href^='http://www.visualthesaurus.com/?']").each(function() {
            var href = this.getAttribute("href");
            var params = new modules.params.Params(href.substring(href.indexOf("?")));
            var word = this.getAttribute("word") || (params.word ? params.word : params.w);
            var lang = this.getAttribute("lang") || params.lang;
            if (!lang) {
                lang = "en"
            }
            if (word) {
                if (params.launch != "true" && params.launch != "1") {
                    this.href = dictionaryURL + (lang != "en" ? (lang + "/") : "") + word
                } else {
                    $(this).on("click", function(evt) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        window.open("http://www.visualthesaurus.com/app/view?word=" + encodeURIComponent(word) + "&lang=" + encodeURIComponent(lang), "applet", "menubar=no,location=no,resizable=yes,scrollbars=no,status=no,directories=no,width=1015,height=680").focus()
                    })
                }
            }
        });
        window.searchvt = function(word, lang) {
            if (lang && lang != "en") {
                document.location.href = dictionaryURL + encodeURI(lang) + "/" + encodeURI(word)
            } else {
                document.location.href = dictionaryURL + encodeURI(word)
            }
        }
    });

    function loadAutocomplete() {
        Module.after(["vcom/autocomplete", "vcom/dictionary"], function() {
            if (!VCOM.dictionary) {
                VCOM.dictionary = new modules.vcom.dictionary.Dictionary();
                VCOM.dictionary.addEventListener("load", function(e) {
                    VCOM.fireEvent("dictpageload", e)
                })
            }
            var isResultsOpen = false;
            var lockText = null;
            var autoComplete = new modules.vcom.autocomplete.Autocomplete($("#results")[0], $("#search")[0]);
            module.autocomplete = autoComplete;
            VCOM.search = function search(query) {
                autoComplete.setText(query)
            };
            var subNav = $("#dictionaryNav");
            subNav.find(".btn-results").on("click", toggleResults);
            subNav.find(".btn-adv-search").on("click", toggleAdvancedSearch);
            subNav.find(".btn-list-tools").on("click", toggleListTools);
            subNav.find(".btn-random").on("click", randomWord);
            autoComplete.addEventListener("selectionchanged", function() {
                var w = autoComplete.getSelectedWord();
                if (w) {
                    openResults();
                    VCOM.displayWord(w.word, w.lang, 500)
                }
            });
            autoComplete.addEventListener("update", function(evt) {
                if (autoComplete.hasWords()) {
                    if (autoComplete.getText() != lockText) {
                        openResults()
                    }
                    if (autoComplete.getText() != lockText) {
                        lockText = null;
                        var w = autoComplete.getWordAt(0);
                        if (w) {
                            VCOM.fireEvent("lookup", w);
                            VCOM.displayWord(w.word, w.lang, 500)
                        }
                    }
                } else {
                    lockText = null;
                    closeResults()
                }
            });
            autoComplete.addEventListener("enter", function(evt) {
                var tw = autoComplete.getSelectedWord();
                if (tw) {
                    document.location.href = dictionaryURL + tw.word
                } else {
                    var text = autoComplete.getText().trim();
                    if (text.length == 0) {
                        lockText = null;
                        VCOM.displayWord(null)
                    } else {
                        if (!autoComplete.isComplex()) {
                            document.location.href = dictionaryURL + encodeURI(text)
                        }
                    }
                }
            });
            autoComplete.addEventListener("click", function(evt) {
                lockText = evt.word;
                VCOM.displayWord(evt.word, evt.lang)
            });
            $("#lookItUp").on("click", function() {
                document.location.href = dictionaryURL + encodeURI(autoComplete.getText())
            });
            $(window).on("popstate", function(e) {
                var m = (/^\/dictionary\/(.+)/).exec(decodeURIComponent(document.location.pathname));
                if (m) {
                    var path = m[1].split("/");
                    closeResults();
                    VCOM.displayWord(path[0], path[1] || "en");
                    $("#pageContent").hide();
                    $("#dictionaryContent").show()
                } else {
                    closeResults();
                    $.get(document.location.pathname, function(html) {
                        $("#pageContent").empty().append($(html).find("#pageContent").children());
                        VCOM.parse($("#pageContent").show());
                        $("#dictionaryContent").hide()
                    })
                }
            });
            $(function() {
                $("head").append("<style>html #results ol {margin-right: -" + getScrollbarWidth() + "px;}</style>")
            });

            function getScrollbarWidth() {
                var outer = document.createElement("div");
                outer.style.visibility = "hidden";
                outer.style.width = "100px";
                outer.style.msOverflowStyle = "scrollbar";
                document.body.appendChild(outer);
                var widthNoScroll = outer.offsetWidth;
                outer.style.overflow = "scroll";
                var inner = document.createElement("div");
                inner.style.width = "100%";
                outer.appendChild(inner);
                var widthWithScroll = inner.offsetWidth;
                outer.parentNode.removeChild(outer);
                return widthNoScroll - widthWithScroll
            }

            function baseWord() {
                if (document.location.pathname.indexOf(dictionaryURL) == 0) {
                    var pn = document.location.pathname.substring(12).split("/");
                    return (pn.length == 2) ? {
                        word: pn[1],
                        lang: pn[0]
                    } : {
                        word: pn[0],
                        lang: "en"
                    }
                }
                return null
            }
            Event.addListener(VCOM, "dictpageload", function(e) {
                var bw = baseWord();
                if (!bw || e.lang != bw.lang || e.word != bw.word) {
                    if (history.pushState) {
                        history.pushState({
                            word: e.word,
                            lang: e.lang
                        }, "", "/dictionary/" + (e.lang == "en" ? encodeURIComponent(e.word) : "/" + e.lang + "/" + encodeURIComponent(e.word)))
                    }
                }
            }, true);

            function randomWord() {
                document.location.href = "/dictionary/randomword"
            }

            function toggleListTools() {
                Module.after("vcom/listbuilder/listbuilder", function() {
                    if (subNav.find(".btn-list-tools").toggleClass("selected").hasClass("selected")) {
                        modules.vcom.listbuilder.listbuilder.open();
                        openResults()
                    } else {
                        modules.vcom.listbuilder.listbuilder.close()
                    }
                })
            }

            function toggleAdvancedSearch() {
                if (subNav.find(".btn-adv-search").toggleClass("selected").hasClass("selected")) {
                    Module.after("vcom/advancedsearch", function() {
                        modules.vcom.advancedsearch.open()
                    })
                } else {
                    if (modules.vcom && modules.vcom.advancedsearch) {
                        modules.vcom.advancedsearch.close()
                    }
                }
            }

            function closeAdvancedSearch() {
                if (subNav.find(".btn-adv-search").hasClass("selected")) {
                    subNav.find(".btn-adv-search").removeClass("selected");
                    if (modules.vcom && modules.vcom.advancedsearch) {
                        modules.vcom.advancedsearch.close()
                    }
                }
            }

            function toggleResults() {
                if (isResultsOpen) {
                    closeResults()
                } else {
                    openResults()
                }
            }

            function closeResults() {
                if (isResultsOpen) {
                    subNav.find(".btn-results").removeClass("selected");
                    isResultsOpen = false;
                    $("#dictionaryNav").removeClass("resultsOpen");
                    $("#listPane").slideUp()
                }
            }
            this.openResults = openResults;

            function openResults() {
                if (!isResultsOpen) {
                    isResultsOpen = true;
                    subNav.find(".btn-results").addClass("selected");
                    $("#dictionaryNav").addClass("resultsOpen");
                    $("#listPane").height(201).animate({
                        height: "show"
                    })
                }
            }
            if ("en" == window.startLang) {
                lockText = window.startWord;
                autoComplete.setText(window.startWord)
            }
        })
    }
});