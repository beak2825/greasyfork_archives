// ==UserScript==
// @name         rabbit auto big
// @namespace    http://tampermonkey.net/
// @version      0.33
// @description  try to take over the world!
// @author       You
// @match        https://www.rabb.it/*
// @grant        none
// donationsURL paypal.me/JonathanHeindl :3
// @downloadURL https://update.greasyfork.org/scripts/31669/rabbit%20auto%20big.user.js
// @updateURL https://update.greasyfork.org/scripts/31669/rabbit%20auto%20big.meta.js
// ==/UserScript==

var getter = function (string, iF) {
    var obj = this.g.I(string, iF);
    if (!obj) {
        obj = this.g.C(string, iF);
    }
    if (!obj) {
        obj = this.g.T(string, iF);
    }
    return obj;
};
getter.I = function ID(string, iF) {
    if (iF !== undefined) {
        if (iF.localName === "iframe") {
            return iF.contentDocument.getElementById(string);
        }
        return undefined;
    }
    return document.getElementById(string);
};
getter.C = function className(string, iF) {
    var list;
    if (iF !== undefined) {
        if (iF.localName === "iframe") {
            list = iF.contentDocument.getElementsByClassName(string);
        } else {
            list = iF.getElementsByClassName(string);
        }
    } else {
        list = document.getElementsByClassName(string);
    }
    if (list.length === 1) {
        return list[0];
    } else if (list.length === 0) {
        return undefined;
    }
    return list;
};
getter.T = function tag(string, iF) {
    var list;
    if (iF !== undefined) {
        if (iF.localName === "iframe") {
            list = iF.contentDocument.getElementsByTagName(string);
        } else {
            list = iF.getElementsByTagName(string);
        }
    } else {
        list = document.getElementsByTagName(string);
    }
    if (list.length === 1) {
        return list[0];
    } else if (list.length === 0) {
        return undefined;
    }
    return list;
};

var sc={
    g:getter,
    L: LocalStorage = {
        s: function setLS(identifier, element) {
            localStorage.setItem("tampermonkey_" + identifier, JSON.stringify(element));
        },
        g: function getLS(identifier, standard = new Array(0), log = 1) {
            var element = JSON.parse(localStorage.getItem("tampermonkey_" + identifier));
            if (element === null) {
                element = JSON.parse(localStorage.getItem(identifier));
                if (element !== null) {
                    this.s(identifier, element);
                    localStorage.removeItem(identifier);
                    try {
                        localStorage.removeItem("checking");
                    } catch (e) {
                    }
                }
            }
            if (element === null) {
                this.s(identifier, standard);
                return standard;
            }
            return element;
        },
        p: function pushLS(identifier, object, standard) {
            var ar = this.g(identifier, standard);
            if (ar.constructor.name === "Array") {
                ar.push(object);
                this.s(identifier, ar);
            } else {
                sc.D.e("not an array");
            }
        }
    },
    D: debug = {
        aL: function (object, string, fn, value1) {
            function runcaught(a, b, c, d, e, f) {
                try {
                    fn(a, b, c, d, e, f, value1);
                } catch (e) {
                    //sc.D.e(e);
                }
            }
            ;
            if (object === "GM") {
                if (value1 && value1.target.script === "sec") {
                    sc.g.W().sec.l(string, runcaught, value1);
                } else {
                    scripts.listenercontainer.push(sc.G.l(string, runcaught, value1));
                }
            } else if (string === "att") {
                var obs = new MutationObserver(runcaught);
                obs.observe(object, {attributes: true, childList: true, characterData: true});
            } else {
                scripts.listenercontainer.push([object, string, runcaught]);
                object.addEventListener(string, runcaught);
            }

        }
    }
};
(function() {
    'use strict';
    var lastmove = new Date().valueOf();
    var hidden = false;
    document.onmousemove = function (e) {
        lastmove = new Date().valueOf();
        if (hidden === true&&sc.L.g("hideshowenabled",true)) {
            show();
        }
    };
    function hide() {
       sc.g("toolbar").style.visibility="hidden";
        var barbtn = sc.g("toolbarButton moreButton");
        if (barbtn) {
            barbtn.click();
        }
        setTimeout(function () {
            var bbl = sc.g("toolbarMenuItem hideBubblesItem off");
            if (bbl) {
                bbl.click();
                hidden = true;
            }
            setTimeout(function () {
                var barbtn = sc.g("toolbarButton moreButton");
                if (barbtn) {
                    //barbtn.click();
                }
                setTimeout(function () {
                    var fs=sc.g("toolbarMenuItem fullscreenItem off");
                    if(fs){
                       //fs.click(); 
                    }
                }, 10);
            }, 200);
        }, 10);
        
    }
    function show() {
        sc.g("toolbar").style.visibility="visible";
        var barbtn = sc.g("toolbarButton moreButton");
        if (barbtn) {
            barbtn.click();
        }
        setTimeout(function () {
            var bbl = sc.g("toolbarMenuItem hideBubblesItem on");
            if (bbl) {
                bbl.click();
                hidden = false;
            }
            setTimeout(function () {
                var barbtn = sc.g("toolbarButton moreButton");
                if (barbtn) {
                   // barbtn.click();
                }
                setTimeout(function () {
                    var fs=sc.g("toolbarMenuItem fullscreenItem on");
                    if(fs){
                      // fs.click();
                    }
                }, 10);
            }, 200);
        }, 10);
        
    }
    function mcheck() {
        if (new Date().valueOf() - lastmove > 2000) {
            if (hidden === false&&sc.L.g("hideshowenabled",true)) {
                hide();
            }
        }
        setTimeout(mcheck, 2000);
    }
    function addlisten() {
        var obj = sc.g("socialToolbarWrapper");
        if (obj) {
            sc.D.aL(sc.g("socialToolbarWrapper").children[3].children[0], "att", function (evt) {
                if (evt[0].target.className === "toolbarButtonView") {
                    if (sc.g("toolbarButton chatButton on") === undefined) {
                        sc.g("toolbar").style.visibility = "visible";
                        var btn=sc.g("toolbarButton chatButton");
                        if(btn[0]!==undefined){
                           btn=btn[0];
                        }
                        btn.children[0].click();
                        setTimeout(function () {
                            sc.g("toolbar").style.visibility = "hidden";
                            btn.children[0].click();
                        }, 3000);
                    }
                }
            });
        } else {
            setTimeout(addlisten, 1000);
        }
    }
    addlisten();
    setTimeout(mcheck,10000);
    setTimeout(function () {
        //debugger;
        var img2 = document.createElement("img");
        img2.src = "https://www.rabb.it/static/62805/img/emojione.sprites.png";
        var canvas = document.createElement("canvas");

        var ctx = canvas.getContext('2d');
        img2.ctx = ctx;
        img2.length = length;
        img2.cnv = canvas;
        img2.onload = function (event) {
            event.target.cnv.width = event.target.width;
            event.target.cnv.height = event.target.height;
            event.target.ctx.drawImage(event.target, 0, 0);
            event.target.style.display = 'none';
            var width = 64;
            var i = 25;
            var j = 20;
            var data = event.target.ctx.getImageData(i * width, j * width, width, width);
            var data2 = event.target.ctx.getImageData(37 * width, 39 * width, width, width);
            event.target.cnv.width = data.width;
            event.target.cnv.height = data.height;

            event.target.ctx.putImageData(data2, 0, 0);
            var img3 = document.createElement("img");
            img3.src = event.target.cnv.toDataURL("image/png");
            img3.style.position = "relative";
            img3.style.width = img3.style.height = "20px";
            img3.style.top = "10px";
            img3.style.left = "-20px";
            img3.style.cursor = "pointer";
            img3.style.visibility = !sc.L.g("hideshowenabled", true) ? "hidden" : "inherit";
            img3.onclick = function () {
                sc.L.s("hideshowenabled", false);
                img3.style.visibility = "hidden";
            };

            event.target.ctx.putImageData(data, 0, 0);
            var img = document.createElement("img");
            img.src = event.target.cnv.toDataURL("image/png");
            img.style.position = "relative";
            img.style.width = img.style.height = "30px";
            img.style.top = img.style.left = "5px";
            img.style.cursor = "pointer";
            img.onclick = function () {
                sc.L.s("hideshowenabled", true);
                img3.style.visibility = "inherit";
            };
            sc.g("barLeft").appendChild(img);
            sc.g("barLeft").appendChild(img3);
        };
    }, 3 * 1000);
    // Your code here...
})();