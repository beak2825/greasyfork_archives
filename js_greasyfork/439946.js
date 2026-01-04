// ==UserScript==
// @name         THZU.cc ads block
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  thzu.cc ads block
// @author       bhlzlx
// @include      http://*th*.cc/*
// @include      https://*th*.cc/*
// @include      */vodplay/*
// @icon         https://www.google.com/s2/favicons?domain=29th.cc
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439946/THZUcc%20ads%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/439946/THZUcc%20ads%20block.meta.js
// ==/UserScript==

function remove_specified_child_for_class( parent, child_name ) {
    var eles = parent.getElementsByClassName(child_name);
    if(null != eles) {
        for (var i = 0; i < eles.length; i++) {
            parent.removeChild(eles[i]);
        }
    }
}

(function() {
    'use strict';
    // console.log("thzu.cc start!");
    var nv_forum = document.getElementById("nv_forum");
    if( null != nv_forum) {
        // remove left/right ads!!!
        remove_specified_child_for_class(nv_forum, "a_fl");
        remove_specified_child_for_class(nv_forum, "a_fl a_cb");
        remove_specified_child_for_class(nv_forum, "a_fr a_cb");
        remove_specified_child_for_class(nv_forum, "a_cn");
        // remove foot ads
        var ft = document.getElementById("ft");
        if( null != ft) {
            ft.parentNode.removeChild(ft);
        }
        // remove top ads
        var diynavtop = document.getElementById("diynavtop");
        if( null != diynavtop) {
            diynavtop.parentNode.removeChild(diynavtop);
        }
        for(var i = 0; i<4; ++i) {
            nv_forum.removeChild(nv_forum.children[0]);
        }
    }
    var ct = document.getElementById("ct");
    if( null != ct ) {
        if(ct.children[0].id == "chart" || ct.children[0].id == "diy_chart" ) {
            for( var idx = 0; idx<ct.children.length; ++idx) {
                if(ct.children[idx].className == "mn") {
                    var mn = ct.children[idx];
                    // if( mn.children[0].tagName == "style") {
                        for(var mnidx = 0; mnidx<4 && mnidx<mn.children.length; ++mnidx ){
                            mn.removeChild(mn.children[0]);
                        }
                    // }
                }
            }
        }
    }
    // console.log("vod!!!");
    var adimgs = document.getElementsByTagName("IMG");
    // console.log(adimgs.length);
    var total = adimgs.length;
    for(i = 0; i<total; ++i) {
        // console.log(i);
        var parent = adimgs[0].parentNode;
        if(parent.tagName == "A" && parent.children.length == 1) {
            parent.parentNode.removeChild(parent);
        }
    }
})();