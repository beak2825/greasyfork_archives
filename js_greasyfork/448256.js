// ==UserScript==
// @name               Skip MoneyZ, leitup and many more
// @description        Fuck Ads
// @author             FLXXX
// @version            1.3
// @license            MIT
// @namespace          https://greasyfork.org/ru/users/938036-flxxx
// @match              *://*moneyz.fun/*
// @match              *://*leitup.com/*
// @match              *://*oxy.st/*
// @match              *://*oxy.cloud/*
// @match              *://*healthyteeth.tips/*
// @match              *://*download.oxy.st/*
// @match              *://*download.oxy.cloud/*
// @match              *://*download.healthyteeth.tips/*
// @match              *://*questunlock.com/*
// @match              *://*qus.su/*
// @match              *://*recutservice.com/*
// @match              *://*rekonise.com/*
// @connect            api.rekonise.com
// @icon               https://i.ibb.co/pKzH6DT/icon.png
// @require            https://code.jquery.com/jquery-3.6.0.min.js
// @grant              GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/448256/Skip%20MoneyZ%2C%20leitup%20and%20many%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/448256/Skip%20MoneyZ%2C%20leitup%20and%20many%20more.meta.js
// ==/UserScript==
/* eslint-env jquery */
$(document).ready(function(){
    'use strict';
    var pathName = window.location.pathname;
    var hostName = location.hostname;
    if (hostName.endsWith("moneyz.fun") && /^\/\w{6}$/gm.exec(pathName) != null) {
        var link_key = $.trim($('#page_link_key').val()), link_full_val = $.trim($('#page_link_full_val').val());
        $.ajax({
            type:'post', url: 'https://moneyz.fun/action.php', data: {'click_link_key': link_key},
            success: function(response) {
                window.location.replace("//" + JSON.parse(response).link_full_val.replace(/(https?:)?\/\//i,''));
            }
        })
    }
    if (hostName.endsWith("leitup.com") && /^\/\w{4}$/gm.exec(pathName) != null) {
        window.location.replace(document.getElementsByClassName("form-control")[0].placeholder);
    }
    if ((hostName.endsWith("oxy.cloud") || hostName.endsWith("oxy.st")) && /^\/d\/\w{2,8}$/gm.exec(pathName) != null) {
        window.location.replace($('a.btn.btn-primary.btn-lg').attr('href'));
    }
    if (hostName.endsWith("healthyteeth.tips") && /^\/d\/\w{2,8}(\?|)$/gm.exec(pathName) != null) {
        window.location.replace($('a.btn.btn-primary.btn-lg').attr('href'));
    }
    if ((hostName.endsWith("oxy.cloud") || hostName.endsWith("oxy.st")) && /^\/d\/\w{2,8}\/2\/[a-f\d]{32}$/gm.exec(pathName) != null) {
        window.location.replace("//" + /(download\.)?oxy\.(cloud|st)\/get\/[\da-f]{32}/gm.exec(document.scripts[10].outerHTML)[0]);
    }
    if (hostName.endsWith("healthyteeth.tips") && /^\/d\/\w{2,8}\/2\/[a-f\d]{32}$/gm.exec(pathName) != null) {
        window.location.replace("//" + /healthyteeth\.tips\/get\/[\da-f]{32}/gm.exec(document.scripts[13].outerHTML));
    }
    if (hostName.endsWith("questunlock.com") && /^\/q\/\w{2,8}$/gm.exec(pathName) != null) {
        window.location.replace("https://qus.su/quest" + /\/\w{2,8}$/gm.exec(pathName));
    }
    if (hostName.endsWith("qus.su") && /^\/quest\/\w{2,8}$/gm.exec(pathName) != null) {
        window.location.replace(/https?:\/\/([\w\-]+\.)+[\w\-]+\/.*?"/gm.exec(document.scripts[17].outerHTML)[0].replace("\"",""));
    }
    if (hostName.endsWith("rekonise.com") && /^\/[\w-]+\-[a-z\d]+$/gm.exec(pathName) != null) {
        GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.rekonise.com/social-unlocks" + window.location.pathname,
        onload: function(response) {
            if (response.status === 200) {
                const data = JSON.parse(response.responseText);
                const extractedUrl = data.url;
                window.location.replace(extractedUrl);
            } else {
                console.error("Error fetching data:", response.statusText);
            }
        }, onerror: function(error) {
            console.error("Request failed:", error);
        }
    });
    }
    /*if (hostName.endsWith("recutservice.com") && /^\/q\/\w{2,8}$/gm.exec(pathName) != null) {
        window.location.replace("https://qus.su/quest" + /\/\w{2,8}$/gm.exec(pathName));
    }*/
})();