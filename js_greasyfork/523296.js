// ==UserScript==
// @name         GGn Trump Helper v2
// @namespace    http://tampermonkey.net/
// @version      2
// @description  A helper script for reporting torrents on GGn
// @match        https://gazellegames.net/torrents.php?id=*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523296/GGn%20Trump%20Helper%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/523296/GGn%20Trump%20Helper%20v2.meta.js
// ==/UserScript==
/* globals jQuery, $ */

const th_predefs = [
    ["Version", "New version"],
    ["Verified", "Trumped by verified dump"],
    ["Caps", "Trumped by upload with track and/or titles following Capitalization Guidelines"],
    ["Bad dir/file name", "Trumped by upload with corrected directory and/or file names"],
];

function add_reports_helper_button(e, label, text) {
    $(e).after('<a href="javascript:;" id="th_'+label+'">'+label+'</a><br/> ');
    $("#th_"+label).click(function() {
        $("#rp_helper #extra").html(text);
    });
}

function add_report_helper() {
    $('a[title="Report"]').each(function() {
        var torrent_id = /&id=([0-9]+)/.exec($(this).attr("href"))[1];
        console.log(torrent_id);
        var token = new Date().getTime();
        var form = `<tr id="rp_helper"><td>
            <form action="/reportsv2.php?action=takereport" enctype="multipart/form-data" method="post" id="report_table">
            <input type="hidden" name="submit" value="true">
            <input type="hidden" name="torrentid" value="`+torrent_id+`">
            <input type="hidden" name="categoryid" value="1">
            <input type="hidden" name="type" value="trump">
            <input type="hidden" name="id_token" value="`+token+`"/>
            <label for="reason">Reason:</label>
            <select id="reason" name="reason">
                <option value="trump">Trump</option>
                <option value="dupe">Dupe</option>
                <option value="wrong_language">Wrong language(s) specified/listed</option>
                <option value="free">Freely Available</option>
                <option value="bad_link">Bad / missing group link</option>
                <option value="tags_lots">Very bad tags / no tags at all</option>
                <option value="discs_missing">Files(s) missing</option>
                <option value="wrong_region">Wrong specified region</option>
                <option value="bad_title">Wrong group title</option>
                <option value="wrong_description">Bad description</option>
                <option value="wrong_group">Wrong group</option>
                <option value="other">Other</option>
            </select>
            <br/>
            <label for="predef">Predefined Comments:</label>
            <select id="predef" name="predef">
                ${th_predefs.map(predef => `<option value="${predef[1]}">${predef[0]}</option>`).join('')}
            </select>
            <br/>
            <label for="sitelink">Permalink:</label>
            <input id="sitelink" type="text" name="sitelink" size="70" value="" placeholder="Permalink of latest torrent"/>
            <br/>
            <label for="extra">Comments:</label>
            <textarea id="extra" rows="5" cols="60" name="extra" placeholder="Please enter a short but accurate description or use one of the predefined options from the drop-down menu above."></textarea>
            <br/>
            <input type="submit" value="Submit report">
            </form></td>
            <td><span id="trumphelper_predefs"></span></td></tr>`;
        $(this).after(
            ' | <a href="javascript:;" title="Trump" id="rp_'
            +torrent_id
            +'">TP');
        $('#rp_'+torrent_id).click(function (event) {
            $("#rp_helper").remove();
            $(this).closest("tr").after(form);
            $("#predef").change(function() {
                $("#extra").val($(this).val());
            });
            $("#sitelink").focus(function() {
                if ($(this).val() === "Permalink of latest torrent") {
                    $(this).val('');
                }
            }).blur(function() {
                if ($(this).val() === '') {
                    $(this).val('Permalink of latest torrent');
                }
            });
        });
    });
}

add_report_helper();