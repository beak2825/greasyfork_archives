// ==UserScript==
// @name         Gmail Abuse Link on original message
// @namespace    https://andrealazzarotto.com/
// @version      1.3.2
// @description  Create a standard abuse report from an original message on Gmail
// @author       Andrea Lazzarotto
// @license      GPLv3
// @match        https://mail.google.com/mail/u/*&view=om&*
// @match        https://mail.google.com/mail/u/*&gmailcomposer*
// @match        https://support.google.com/mail/contact/abuse*
// @match        https://support.google.com/code/contact/cloud_platform_report*
// @match        https://console.scaleway.com/support/abuses/create/*
// @icon         https://www.google.com/s2/favicons?domain=gmail.com
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @require      https://cdnjs.cloudflare.com/ajax/libs/cash/8.1.0/cash.min.js
// @downloadURL https://update.greasyfork.org/scripts/428983/Gmail%20Abuse%20Link%20on%20original%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/428983/Gmail%20Abuse%20Link%20on%20original%20message.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Periodic clean-up
    const cleanUp = function() {
        const moment = + new Date();
        const one_hour_ago = moment - 3600000;
        GM.listValues().then(values => {
            values.forEach(value => {
                if (value < one_hour_ago) { GM.deleteValue(value) }
            });
        });
    };

    // Every five minutes
    setInterval(cleanUp, 300000);
    cleanUp();

    const fixEmail = (email) => {
        switch (email) {
            case 'audit@firstbyte.ru':
                return 'support@firstbyte.ru;abuse@firstbyte.ru';
            default:
                return email;
        }
    };

    const contactAddress = async (ip) => {
        const content = await fetch("https://ipinfo.io/products/ip-abuse-contact-api?value=" + encodeURIComponent(ip) + "&dataset=abuse-contact", {
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
                "Accept": "*/*",
                "Accept-Language": "it-IT,it;q=0.8,en-US;q=0.5,en;q=0.3",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "Sec-GPC": "1"
            },
            "referrer": "https://ipinfo.io/products/ip-abuse-contact-api",
            "method": "POST",
            "mode": "cors"
        });
        const result = await content.json();
        return result.data;
    };

    const handleGmail = (target, identifier) => {
        target.append('&nbsp;&mdash; <a target="_blank" href="https://support.google.com/mail/contact/abuse?spamid=' + identifier + '">SPAM REPORT for Gmail</a>');
    };

    const handleGoogleCloud = (target, identifier) => {
        target.append('&nbsp;&mdash; <a target="_blank" href="https://support.google.com/code/contact/cloud_platform_report?spamid=' + identifier + '">SPAM REPORT for Google Cloud</a>');
    };

    const handleScaleway = (target, identifier) => {
        target.append('&nbsp;&mdash; <a target="_blank" href="https://console.scaleway.com/support/abuses/create/?spamid=' + identifier + '">SPAM REPORT for Scaleway</a>');
    };

    // We are on the Gmail original message page
    if (location.href.indexOf('mail.google.com/mail/u') > 0 && location.href.indexOf('view=om') > 0) {
        // We want to gather the IP address and all other useful data
        const spf_result = $('.authresult').parent().text();
        const expression = /(([0-9a-fA-F]+[\.:])+[0-9a-fA-F]+)/;
        var matches = spf_result.match(expression);

        if (!matches.length) {
            return;
        }

        const ip = matches[0];

        const email_text = $('#raw_message_text').text();
        matches = email_text.match(/From: .*<(.*)>|From: ([^\s]*@[^\s]*)/);
        let sender, recipient;
        try {
            sender = matches[1] || matches[2];
        } catch {
            sender = '';
        }
        matches = email_text.match(/Delivered-To: .*<(.*)>|Delivered-To: ([^\s]*@[^\s]*)/);
        try {
            recipient = matches[1] || matches[2];
        } catch {
            recipient = '';
        }

        const pieces = email_text.split('\n\n');
        const headers = pieces[0];
        const content = pieces.slice(1).join('\n\n');

        matches = email_text.match(/Subject: ([^\n]*(\n\s+.*)*)/);
        const subject = matches[1];

        const abuseData = {
            ip: ip,
            sender: sender,
            recipient: recipient,
            subject: subject,
            headers: headers,
            content: content,
            email_text: email_text,
        };

        const encoded = JSON.stringify(abuseData);
        const identifier = + new Date();

        GM.setValue(identifier, encoded);

        contactAddress(ip).then(data => {
            const fixed = fixEmail(data.email);
            const target = $('.authresult').parent();

            if (fixed === 'network-abuse@google.com' && sender.indexOf('@gmail.com') > 0) {
                return handleGmail(target, identifier);
            }
            if (fixed === 'network-abuse@google.com' && sender.indexOf('@gmail.com') < 0) {
                return handleGoogleCloud(target, identifier);
            }
            if (fixed === 'abuse@online.net') {
                return handleScaleway(target, identifier);
            }

            const user_id = location.href.split('mail/u/')[1].split('/')[0];
            let url = 'to=INSERT_EMAIL&su=Abuse%20report%20for%20IP%20INSERT_IP&body=Hello%20there%2C%0A%0Aplease%20investigate%20the%20following%20spam%20coming%20from%20IP%20INSERT_IP.%0A%0AThank%20you.%0ABest%20regards%0A%0A%0AINSERT_BODY';
            url = url.replace(/INSERT_EMAIL/, fixed).replace(/INSERT_IP/g, ip);
            target.append('&nbsp;&mdash; <a target="_blank" href="https://mail.google.com/mail/u/' + user_id + '/?fs=1&tf=cm&gmailcomposer&spamid=' + identifier + '&source=mailto&' + url + '">SPAM REPORT ' + fixed + '</a>');
        });

        return;
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const spamid = urlParams.get('spamid');
    if (!spamid) {
        return;
    }

    GM.getValue(spamid).then(encoded => {
        const abuseData = JSON.parse(encoded);

        // Handle Gmail report
        if (location.href.indexOf('support.google.com/mail/contact/abuse') > 0) {
            $('#contact_email').val(abuseData.recipient);
            $('#03_abuser_gmail').val(abuseData.sender);
            $('#05_headers').val(abuseData.headers);
            $('#04_orig_subject').val(abuseData.subject);
            $('#06_content').val(abuseData.content);
            $('#02_impersonating_google--false').prop('checked', true);
        }

        // Handle Google Cloud report
        if (location.href.indexOf('support.google.com/code/contact/cloud_platform_report') > 0) {
            $('#email_prefill_req').val(abuseData.recipient);
            $('#Google_Cloud_Platform_Service--n_a').prop('checked', true);
            $('#abuse_details').text('Spam from IP ' + abuseData.ip + ' - ' + abuseData.sender + ' (see attachment)');
        }

        // Handle Scaleway report - Work in progress
        if (location.href.indexOf('console.scaleway.com/support/abuses') > 0) {
            setTimeout(() => {
                $('input[name=service]').trigger('focus').val(abuseData.ip);
                /*$('input[name=mail]').val(abuseData.recipient).trigger('keyup');
                $('input[name=type]').val('spam').trigger('keyup');
                $('textarea[name=content]').val(abuseData.email_text).trigger('keyup');*/
            }, 5000);
        }

        // Handle email report
        if (location.href.indexOf('&gmailcomposer') > 0) {
            let html_content = abuseData.email_text.replace(/</g, '&lt;');
            let done = false;
            const updater = () => {
                let element = $('table[id=":pi"] .editable');
                let content = element.html();
                if (element && content && content.indexOf('INSERT_BODY') > 0) {
                    content = content.replace('INSERT_BODY', '<pre>' + html_content + '</pre>');
                    element.html(content);
                } else {
                    setTimeout(updater, 200);
                }
            }
            setTimeout(updater, 200);
        }
    });

})();