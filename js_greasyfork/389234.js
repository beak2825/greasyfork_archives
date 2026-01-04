// ==UserScript==
// @name         数据工场
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://dp.pt.xiaomi.com/task/2*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389234/%E6%95%B0%E6%8D%AE%E5%B7%A5%E5%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/389234/%E6%95%B0%E6%8D%AE%E5%B7%A5%E5%9C%BA.meta.js
// ==/UserScript==
function getApplicationId() {
    var line = $('#p2')[0].innerHTML.split("\n").slice(-1)[0];
    var applicationId = line.match(/application(_\d+){2}/);
    if (applicationId != null) {
        applicationId = applicationId[0];
    }

    return applicationId;
}

function zjy13url(applicationId) {
    return `http://zjy-hadoop-prc-ct13.bj:20701/cluster/app/${applicationId}`
}

function zjy12url(applicationId) {
    return `http://zjy-hadoop-prc-ct12.bj:20701/cluster/app/${applicationId}`
}

function sparkLog(applicationId) {
    return `http://zjy-hadoop-prc-ct11.bj:21001/proxy/${applicationId}/?proxyapproved=true`
}

(function() {
	'use strict';
	var anchor = $('.page-breadcrumb');

    var applicationId = getApplicationId();

    var sparklog = $(`<a class='custom-add' target='_blank' href='${sparkLog(applicationId)}'>spark log</a>`);

    var zjy13 = $(`<a class='custom-add' target='_blank' href='${zjy13url(applicationId)}'>zjy13:${applicationId}</a>`);
    var zjy12 = $(`<a class='custom-add' target='_blank' href='${zjy12url(applicationId)}'>zjy12:${applicationId}</a>`);
    var log = $(`<div class='custom-add'/>`);

    zjy13.css("display","block");
    zjy12.css("display","block");
    sparklog.css("display","block");
    log.css("display","block");

    anchor.append(sparklog);

    anchor.append(zjy12);
    anchor.append(zjy13);
    anchor.append(log);

	var refresh = window.setInterval(function() {
		var applicationId = getApplicationId();

        zjy13.attr("href", `${zjy13url(applicationId)}`);
        zjy13.text(`zjy13:${applicationId}`);

        zjy12.attr("href", `${zjy12url(applicationId)}`);
        zjy12.text(`zjy12:${applicationId}`);

        sparklog.attr("href", `${sparkLog(applicationId)}`);

        if (applicationId != null) {
            window.clearInterval(refresh)
        }

	}, 300);


    var refreshLog = window.setInterval(function() {
		var line = $('#p2')[0].innerHTML.split("\n").slice(-1)[0];
        log.text(line);
	}, 5000);
})();