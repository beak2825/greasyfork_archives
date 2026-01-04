// ==UserScript==
// @name         הפקח של ניבה
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!!
// @author       Muffin24
// @match        https://www.fxp.co.il/modcp/user.php?do=editsig&u=*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466940/%D7%94%D7%A4%D7%A7%D7%97%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91%D7%94.user.js
// @updateURL https://update.greasyfork.org/scripts/466940/%D7%94%D7%A4%D7%A7%D7%97%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91%D7%94.meta.js
// ==/UserScript==
(async function() {
    if (!confirm('אתה בטוח שאתה רוצה להפעיל צינזור אוטומטי')) {
        return;
    }
    const regex = /<li class="navbit lastnavbit"><span>(.*)<\/span><\/li>/;
    const uid = new URLSearchParams(location.search).get('u');
    const text = document.querySelector('#ta_signature_1').value;
    const response = await fetch('https://www.fxp.co.il/member.php?u=' + uid);
    const html = await response.text();
    const recipients = regex.exec(html).at(1);
    const message = "היי, שים לב שחתימתך הוסרה מכיוון שהחתימה חרגה מהגודל המותר בסעיף ד של חוקי החתימה \n " + text;
    //TODO: request without jQuery
    $.post('https://www.fxp.co.il/ajax.php', {
        towysiwyg: '',
        message: 'צח גדול: \n ' + text,
        do: 'editorswitch',
        allowsmilie: 1,
        parsetype: 'usernote',
        securitytoken: SECURITYTOKEN
    }).done(function(response) {
        $.post("https://www.fxp.co.il/private_chat.php", {
            securitytoken: SECURITYTOKEN,
            do: "insertpm",
            recipients,
            title: "חתימתך צונזרה",
            parseurl: 1,
            frompage: 1,
            message,
            savecopy: 1,
            signature: 1
        })
            .done(function() {
            $('#ta_signature_1').val('[url=http://www.fxp.co.il/showthread.php?t=525654][img]http://images.fxp.co.il/newdesign/hatima.png[/img][/url]');
            $('input[type=submit]').click();
        })
    });
})