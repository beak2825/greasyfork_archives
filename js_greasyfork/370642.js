// ==UserScript==
// @name         CSDC Keyboard shortcuts
// @namespace    ZOFF
// @version      0.0.17
// @description  no need
// @author       Zoff
// @match        https://users.yoroi.company/
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.12.0/moment.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/370642/CSDC%20Keyboard%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/370642/CSDC%20Keyboard%20shortcuts.meta.js
// ==/UserScript==

var jQuery = window.jQuery;

(function() {
    function expandecollapseAll() {
        var btn = jQuery('.btn-board-menu');
        var i;
        for (i = 0; i < btn.length; i++) {
            btn[i].click();
            var kind = 'details';
            var fplink = btn.next().find('a:contains("'+kind+'")');
            fplink[i].click();
        }
    }
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    function setfilter(text, pos, delete_last = 1) {
        console.log('set filter');
        if(curr) {
            // 9 Context
            // 10 Threats
            var txtbox = jQuery('.filter-field')[pos];
            txtbox.className = "filter-field form-control ng-valid ng-touched ng-dirty";
            txtbox.focus();
            txtbox.value = text;
            txtbox.dispatchEvent(new Event('focus'));
            sleep(200).then(() => {
                if (delete_last) {
                    txtbox.value = txtbox.value.slice(0, -1);
                }
            })
        }
    }
    function clearfilters() {
        var i;
        for (i = 1; i < 13; i++) {
            var txtbox = jQuery('.filter-field')[i];
            txtbox.value = '';
            txtbox.className = "filter-field form-control ng-valid ng-touched ng-dirty empty"
            jQuery('.clear-button').click();
        }
    }
    function big_x(text) {
        if(curr) {
            var btnx = jQuery(text);
            btnx[0].click();
        }
    }

    function dblclick(e) {
        e.dispatchEvent(new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        }))
    }

    function up() {
        var open = jQuery('app-ticket-evidences:visible .list-group-item-danger');
        if (open.length > 0) {
            open.prev().click();
        } else {
            jQuery('.details-opened:visible')[0].scrollIntoView(true);
            var e = jQuery('.nav-item:visible:contains("Evidences"):not(.active) a');
            if (e.length > 0) {
                e[0].click();
            }
            jQuery('app-ticket-evidences:visible .list-group-item').click();
        }
    }

    function down() {
        var open = jQuery('app-ticket-evidences:visible .list-group-item-danger');
        if (open.length > 0) {
            open.next().click();
        } else {
            jQuery('.details-opened:visible')[0].scrollIntoView(true);
            var e = jQuery('.nav-item:visible:contains("Evidences"):not(.active) a');
            if (e.length > 0) {
                e[0].click();
            }
            jQuery('app-ticket-evidences:visible .list-group-item').click();
        }
    }

    function prev() {
        var open = jQuery('.details-opened:visible');
        if (open.length > 0) {
            var o = open[0];
            var p = open.prev()[0];
            dblclick(o);
            if (p) {
                dblclick(p);
                p.scrollIntoView(true);
            }
        } else {
            dblclick(jQuery('app-smart-table:visible tbody tr')[0]);
        }
    }

    function next() {
        var open = jQuery('.details-opened:visible');
        if (open.length > 0) {
            var o = open[0];
            var n = open.next().next()[0];
            dblclick(o);
            if (n) {
                dblclick(n);
                n.scrollIntoView(true);
            }
        } else {
            dblclick(jQuery('app-smart-table:visible tbody tr')[0]);
        }
    }

    function fastclose(kind) {
        if (curr) {
            var btn = jQuery('.btn-board-menu', curr);
            btn[0].click();
            setTimeout(function(){
                var fplink = btn.next().find('a:contains("'+kind+'")');
                fplink[0].click();
                btn[0].click();
            }, 100);
        }
    }

    function enableShortcuts() {
        jQuery("body").keydown(function(e) {
            switch (e.keyCode) {
                case 37: // Left
                    prev();
                    break;
                case 38: // Up
                    up();
                    break;
                case 39: // Right
                    next();
                    break;
                case 40: // Down
                    down();
                    break;
                case 49: // 1 (top)
                case 97: // 1 (numpad)
                    fastclose("Safe / Failed");
                    break;
                case 50: // 2 (top)
                case 98: // 2 (numpad)
                    fastclose("Safe / Irrelevant");
                    break;
                case 51: // 3 (top)
                case 99: // 3 (numpad)
                    fastclose("False Positive");
                    break;
            }
            //console.log(e);
            if (e.altKey && e.ctrlKey && (e.keyCode === 67) ) { // c
                clearfilters();
            } else if (e.altKey && e.ctrlKey && (e.keyCode === 69) ) { // e
                expandecollapseAll();
            } else if (e.altKey && e.ctrlKey && (e.keyCode === 82) ) { // r
                console.log('very high');
                setfilter('0.7', 4, 0);
            } else if (e.altKey && e.ctrlKey && (e.keyCode === 65) ) { // a
                jQuery('.sortable.sort.asc')[1].click();;
            }
        });
        window.localStorage.setItem('use-shortcuts', 'true');
        refreshShortcutsIndicator();
    }

    function disableShortcuts() {
        jQuery("body").off('keydown');
        window.localStorage.setItem('use-shortcuts', 'false');
        refreshShortcutsIndicator();
    }

    function shortcutsEnabled() {
        return window.localStorage.getItem('use-shortcuts') === 'true';
    }

    function toggleShortcuts() {
        if (shortcutsEnabled()) {
            disableShortcuts();
        } else {
            enableShortcuts();
        }
        refreshShortcutsIndicator();
    }

    function refreshShortcutsIndicator() {
        jQuery('#kb-shortcuts-indicator').remove();
        let color = '#cc071e';
        let title = 'Click to ENABLE keyboard shortcuts';
        if (shortcutsEnabled()) {
            color = 'green';
            title = 'Click to DISABLE keyboard shortcuts';
        }
        const li = jQuery('<li id="kb-shortcuts-indicator"></li>');
        const a = jQuery(`<a href="#" onclick="return false;" title="${title}"></a>`);
        const indicator = jQuery(`<i class="fa fa-keyboard" style="color: ${color}; font-size: 2em; pointer-events: none;"></i>`);
        a.click(function(ev){
            ev.stopPropagation();
            ev.preventDefault();
            toggleShortcuts();
        });
        a.append(indicator);
        li.append(a);
        jQuery('.top-menu .nav').prepend(li);
    }

    var curr;
    jQuery('body').on('dblclick', 'app-log-request-task-result pre', function(e) {
        const $e = jQuery(this);
        $e.data('beautified', !$e.data('beautified'));
        if ($e.data('beautified')) {
            let data = $e.data('beautified-data');
            if (!data) {
                $e.data('original-data', $e.text());
                data = $e.text().split('\n').map(x => {try { return JSON.stringify(JSON.parse(x),null,2); }catch(e){ return x; }}).join('\n') ;
            }
            $e.text(data);
        } else {
            $e.text($e.data('original-data'));
        }
    });

    // GATHER EMAIL INFO BUTTON
    const geb = jQuery('<button id="geb" class="btn btn-default" style="margin-left: 20px"><i class="fa fa-envelope"></i> GATHER EMAIL INFO</button>');
    geb.click(function(){
        (async function doJob(){
            var ticketId = window.location.hash.match(/[\d\w]{24}/)[0]

            var ticket = await fetch(`https://users.yoroi.company/api/ticket/${ticketId}`).then(x => x.json());

            if (!ticket) {
                console.log('TICKET NOT FOUND');
                return;
            }
            if (!ticket.involved || !ticket.involved.length) {
                console.log('TICKET INVOLVED NOT FOUND');
                return;
            }

            const popup = jQuery(`<div style="z-index: 99999; position: fixed; top: 100px; left: 15%; max-width: 70%; overflow: auto;     background-color: white; padding: 1em; border: solid thin black;">
<span class="btn-close-copy fa fa-window-close" style="color: #cc071e; cursor: pointer; position: absolute; top: 5px; right: 5px; font-size: 2em;"></span>
<h5>Email Details <span class="btn-copy-result btn btn-xs btn-default" data-clipboard-target="#info-result"><i class="fa fa-clipboard"></i></span></h1>
<pre id="info-result" style="overflow: auto; max-height: 600px;">LOADING....</pre>
<div>`)
            jQuery('.btn-close-copy').click(()=>popup.remove());
            popup.dblclick(function(){ popup.remove(); })
            jQuery('body').append(popup);

            var attackIds = ticket.involved.filter(x => x.kind === 'Attack').map(x => x.ref);

            var attacks = await Promise.all(attackIds.map(t => fetch(`https://users.yoroi.company/api/detection/attack/${t}`).then(x => x.json())));

            var emailIds = [];

            attacks.forEach(a => {
                emailIds.push.apply(emailIds,a.detections.filter(x => x.kind === 'EmailDetection').map(x => x.ref));
            });

            var emails = await Promise.all(emailIds.map(t => fetch(`https://users.yoroi.company/api/detection/email/${t}`).then(x => x.json())));

            var result = '';

            emails.forEach(e => {
                result += `
Data: ${e.date}
Oggetto: ${e.subject}
Mittenti: ${e.senders.map(x => x.address).join(', ')}
Destinatari: ${e.recipients.map(x => x.address).join(', ')}
Allegati: ${e.attachments.map(x => x.filename).join(', ')}
`;
            });
            jQuery('.btn-copy-result').click(function(){
                GM_setClipboard(result);
                popup.remove();
            });

            jQuery('#info-result',popup).html(result);
        })();
    });
    var gebInt = setInterval(function(){
        if (!jQuery('#geb').length && jQuery('app-ticket-editor .form-group:first() > div').length>0) {
            jQuery('app-ticket-editor .form-group:first() > div').append(geb);
        }
    },1000);
    // END GATHER EMAIL INFO BUTTON

    jQuery('body').on('dblclick', 'app-attack-details > div > div:nth-child(2) > div:nth-child(4) > div > div', function(e){
        GM_setClipboard(`https://users.yoroi.company/#/csdc/threat-protection/attack/${jQuery(this).text().trim()}`);
    });
    jQuery('body').on('dblclick', 'app-email-detection h4', function(e) {
        const $e = jQuery(this).parent();
        const date = moment(jQuery('.form-group:contains("Date:")', $e).find('.form-control').text(),'MMM DD,YYYY, hh:mm:ss A').format('DD/MM/YYYY HH:mm');
        const subject = jQuery('.form-group:contains("Subject:")', $e).find('.form-control').text();
        const senders = jQuery('.sender', $e).toArray().map(x => jQuery(x).text().trim()).join(', ');//.replace(/</g,'&lt;').replace(/>/g,'&gt;');
        const recipients = jQuery('.recipient', $e).toArray().map(x => jQuery(x).text().trim()).join(', ');
        const attachments = jQuery('.tab-pane .tab-pane:contains("File details") label:contains("Name")', $e).next().toArray().map(x => jQuery(x).text()).join(', ');
        let realAttachmentsIta = '';
        let realAttachmentsEng = '';
        if (attachments) {
            realAttachmentsIta = `Attachments: ${attachments}`;
            realAttachmentsEng = `Allegati: ${attachments}`;
        }
        const infoEng = `Date: ${date}\nSubject: ${subject}\nSenders: ${senders}\nRecipients: ${recipients}\n${realAttachmentsIta}`;
        const infoIta = `Data: ${date}\nOggetto: ${subject}\nMittenti: ${senders}\nDestinatari: ${recipients}\n${realAttachmentsEng}`;
        const popup = jQuery(`<div style="z-index: 99999; position: fixed; top: 100px; left: 35%; max-width: 30%; overflow: auto;     background-color: white; padding: 1em; border: solid thin black;">
<span class="btn-close-copy fa fa-window-close" style="color: #cc071e; cursor: pointer; position: absolute; top: 5px; right: 5px; font-size: 2em;"></span>
<h5>ITALIANO <span class="btn-copy-ita btn btn-xs btn-default" data-clipboard-target="#info-ita"><i class="fa fa-clipboard"></i></span></h1>
<pre id="info-ita">${infoIta.replace(/[\u00A0-\u9999<>\&]/gim, i => '&#'+i.charCodeAt(0)+';')}</pre>
<h5>ENGLISH <span class="btn-copy-eng btn btn-xs btn-default" data-clipboard-target="#info-eng"><i class="fa fa-clipboard"></i></span></h1>
<pre id="info-eng">${infoEng.replace(/[\u00A0-\u9999<>\&]/gim, i => '&#'+i.charCodeAt(0)+';')}</pre>
<div>`)
        popup.dblclick(function(){ popup.remove(); })
        jQuery('body').append(popup);
        jQuery('.btn-close-copy').click(()=>popup.remove());
        jQuery('.btn-copy-ita').click(function(){
            GM_setClipboard(infoIta);
            popup.remove();
        });
        jQuery('.btn-copy-eng').click(function(){
            GM_setClipboard(infoEng);
            popup.remove();
        });
        /* */
    });
    jQuery('body').on('mousemove', 'app-smart-table > table > thead', function(e) {
        curr = null;
    });
    jQuery('body').on('mousemove', 'app-smart-table > table > tbody > tr', function(e) {
        if (curr !== this) {
            curr = this;/*
            function ext(q) {
                return jQuery(q, curr).text().replace(/[\n\r\t]/g,'').trim().substring(0, 20).trim();
            }
            var attackers = ext('td:nth-child(8)');
            var victims = ext('td:nth-child(9)');
            var context = ext('td:nth-child(10)');
            var threat = ext('td:nth-child(11)');
            console.log('>>>>', attackers, 'VIC:', victims, 'CON:', context, 'THR:', threat);*/
        }
    });
    if (shortcutsEnabled()) {
        enableShortcuts();
    }
    setTimeout(refreshShortcutsIndicator, 1500);
    setInterval(refreshShortcutsIndicator, 15000);
})()