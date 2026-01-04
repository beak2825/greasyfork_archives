// ==UserScript==
// @name         AutoQSSO
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  try to take over the world!
// @author       aweleey
// @run-at       document-end
// @match        https://qsso.corp.qunar.com/login.php*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.slim.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/392643/AutoQSSO.user.js
// @updateURL https://update.greasyfork.org/scripts/392643/AutoQSSO.meta.js
// ==/UserScript==

jQuery.noConflict();
(function(jq) {
    'use strict';
    var url = GM_getValue('server', 'http://127.0.0.1:9999');
    var pin = GM_getValue('pin', '8888');
    var username = GM_getValue('username', '');
    var smsHide = jq('.sms-hide');
    var tokenAndSettingHtml = `
        <div style="display: flex; float: right;">
            <div id="qsetting-open" style="width: 20px; height: 20px; padding: 6px; border: 1px solid #4d90fe; align-items: center; justify-content: center; margin-right: 6px; border-radius: 2px; cursor: pointer; background: #fff;">
                <svg class="icon" width="20px" height="20.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#4d90fe" d="M487.253333 1018.88a128 128 0 0 1-128-109.653333l-5.546666-47.36a418.56 418.56 0 0 1-75.093334-42.666667l-47.36 19.626667a128 128 0 0 1-157.866666-51.2l-23.893334-38.826667a128 128 0 0 1 31.573334-170.666667l38.4-29.013333v-40.533333a341.333333 341.333333 0 0 1 0-42.666667l-36.693334-27.306667a128 128 0 0 1-35.413333-166.826666l22.613333-39.253334a128 128 0 0 1 157.013334-55.466666l51.2 19.626666a418.56 418.56 0 0 1 75.093333-42.666666l5.546667-42.666667A128 128 0 0 1 484.266667 2.56h50.773333a128 128 0 0 1 128 109.226667l6.826667 47.786666a377.173333 377.173333 0 0 1 75.093333 42.666667l47.36-19.626667a128 128 0 0 1 157.866667 51.2l23.893333 38.826667a128 128 0 0 1-31.573333 170.666667l-38.4 29.013333a346.88 346.88 0 0 1 2.133333 42.666667 337.493333 337.493333 0 0 1-2.133333 40.106666l36.266666 26.88a128 128 0 0 1 35.413334 167.253334l-22.613334 39.253333a128 128 0 0 1-157.013333 55.466667l-51.626667-20.053334a381.013333 381.013333 0 0 1-74.666666 42.666667l-6.826667 46.506667a128 128 0 0 1-125.013333 109.653333h-49.493334z m-206.506666-286.293333a69.12 69.12 0 0 1 42.666666 14.08 317.866667 317.866667 0 0 0 70.4 39.253333 69.546667 69.546667 0 0 1 42.666667 54.613333l8.533333 56.32a42.666667 42.666667 0 0 0 42.666667 36.693334h49.493333a42.666667 42.666667 0 0 0 42.666667-36.693334l8.106667-55.04a69.12 69.12 0 0 1 42.666666-55.466666 291.413333 291.413333 0 0 0 68.693334-38.826667 72.96 72.96 0 0 1 68.693333-9.813333l58.026667 22.186666a42.666667 42.666667 0 0 0 52.48-18.346666l22.613333-39.253334a42.666667 42.666667 0 0 0-11.946667-55.893333l-42.666666-32a68.693333 68.693333 0 0 1-27.733334-64.853333 341.333333 341.333333 0 0 0 2.56-38.826667 328.106667 328.106667 0 0 0-2.56-38.826667 69.12 69.12 0 0 1 27.733334-65.28l44.8-33.706666a42.666667 42.666667 0 0 0 10.24-56.32l-23.466667-38.826667a42.666667 42.666667 0 0 0-52.906667-17.066667l-54.613333 22.613334a71.68 71.68 0 0 1-69.973333-8.96 316.586667 316.586667 0 0 0-69.546667-39.253334 70.4 70.4 0 0 1-42.666667-54.613333l-8.533333-56.746667a42.666667 42.666667 0 0 0-42.666667-36.266666h-51.2a42.666667 42.666667 0 0 0-42.666666 37.546666l-6.826667 53.333334a69.973333 69.973333 0 0 1-42.666667 56.32 325.546667 325.546667 0 0 0-69.12 38.826666A72.106667 72.106667 0 0 1 256 283.306667l-59.733333-22.613334a42.666667 42.666667 0 0 0-52.48 18.773334l-22.613334 39.253333a42.666667 42.666667 0 0 0 11.946667 55.466667l42.666667 32.853333a67.84 67.84 0 0 1 27.733333 65.28 321.706667 321.706667 0 0 0-2.56 38.4 295.253333 295.253333 0 0 0 2.56 38.4 69.12 69.12 0 0 1-27.733333 65.28l-44.8 33.706667a42.666667 42.666667 0 0 0-10.666667 56.746666l23.893333 38.4a42.666667 42.666667 0 0 0 52.906667 17.066667l54.613333-22.613333a77.226667 77.226667 0 0 1 29.013334-5.12z m381.44 132.266666z m-298.666667 0z m308.053333-11.52zM128 546.133333z m0-70.4z m770.56 0z m-777.813333-15.36z m240.64-304.64z m150.613333 554.666667a197.973333 197.973333 0 1 1 140.373333-58.026667A198.826667 198.826667 0 0 1 512 708.693333z m0-311.04A112.64 112.64 0 1 0 625.066667 512 113.066667 113.066667 0 0 0 512 397.653333z" /></svg>
            </div>
            <div id="qsetting-stoken" class="g-button g-button-submit" style="float: right;margin-right: 0;background: #fff;color: #4d90fe;height: 32px;line-height: 32px;font-weight: normal;padding: 0 8px;width: 60px; cursor: pointer;">Token</div>
        </div>
    `;
    var settingPanelHtml = `
        <div id="qsetting-container" class="hide">
            <fieldset id="qsetting-autopager-field" style="border: 1px solid #4d90fe; padding: 12px; border-radius: 3px;">
                <legend title="QSSO Setting">
                    <a href="http://gitlab.corp.qunar.com/aweleey.li/qunar-stoken" target="_blank" style="color: #4d90fe !important;" >&nbsp;&nbsp;QSSO Setting&nbsp;&nbsp;</a>
                </legend>
                <div class="email-div">
                    <label for="uid"><strong class="email-label">default username</strong></label>
                    <input type="text" id="qsso-uid" value="${username}">
                </div>
                <div class="email-div">
                    <label for="server"><strong class="email-label">server</strong></label>
                    <input type="text" name="server" id="qsso-server" value="${url}">
                </div>
                <div class="email-div">
                    <label for="pin"><strong class="email-label">pin code</strong></label>
                    <input type="text" name="pin" id="qsso-pin" value="${pin}">
                </div>
                <div style="width: 257px; display: flex; justify-content: flex-end;">
                    <span id="qsetting-cancelbutton" style="cursor: pointer; padding: 3px 6px; border-radius: 2px; border: 1px solid gray; color: gray">close</span>
                    <span id="qsetting-savebutton" style="cursor: pointer; padding: 3px 6px; border-radius: 2px; border: 1px solid #4d90fe; color: #4d90fe; margin-left: 6px;">save</span>
                </div>
            </fieldset>
        </div>
    `;

    jq('.passwd-label').html('Passcode');
    jq(settingPanelHtml).appendTo('.signin-box');
    jq(tokenAndSettingHtml).appendTo(smsHide);

    function getTokenAndLogin() {
        var signIn = jq('#signIn');
        var pwd = jq('#passCode');
        var userId = jq('#userId');
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(res) {
                if (res.status == 200) {
                    var uid = GM_getValue('username', '');
                    var text = res.responseText;
                    if (uid) userId.val(uid);
                    pwd.val(pin + text);
                    signIn.click();
                }
            }
        });
    }

    var c = jq('#qsetting-container');
    function openSetting() {
        c.attr('style', '');
        c.toggleClass('hide');
        jq('#qsetting-open').toggleClass('hide');
    }

    function closeSetting() {
        c.addClass('hide');
        jq('#qsetting-open').removeClass('hide');
    }

    function saveSetting() {
        GM_setValue('server', jq('#qsso-server').val() || url);
        GM_setValue('pin', jq('#qsso-pin').val() || pin);
        GM_setValue('username', jq('#qsso-uid').val() || '');
        closeSetting();
    }

    jq('#qsetting-cancelbutton').on('click', closeSetting);
    jq('#qsetting-savebutton').on('click', saveSetting);
    jq('#qsetting-stoken').on('click', getTokenAndLogin);
    jq('#qsetting-open').on('click', openSetting);
    getTokenAndLogin();
})(jQuery);
