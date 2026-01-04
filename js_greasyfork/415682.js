// ==UserScript==
// @name         DI Extension
// @namespace    http://tampermonkey.net/
// @version      2.2.3
// @description  Tools for VP officers
// @author       rax
// @match        https://*.dmginc.gg/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/415682/DI%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/415682/DI%20Extension.meta.js
// ==/UserScript==

(async () => {

    console.log('%cDI extension - version 2.2.3', 'color: white; font: 1em \'Menlo\', monospace;');

    const main = 'extension_div';
    const editor = 'cke_wysiwyg_div';
    const reEvent = /^\S*forum\.dmginc\.gg\/topic\/\d+-(?:casual|community|competitive)-event-event-date-\d{2}-\S{3}-\S+$/gi;
    const reAway = /^\S*forum\.dmginc\.gg\/topic\/\d+-(?:activated-)?accepted-away-start-\S+$/gi;
    const reAdmin = /^\S*forum\.dmginc\.gg\/admin\/\?adsess=(\S{26})&app=core&module=members&controller=members\S*$/gi;

    const escape = string => string
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    if (window.location.href === 'https://forum.dmginc.gg/forum/76-probation/?do=add') {
        const menu = '.ipsColumn_wide';
        const title = '#elInput_topic_title';
        const content = `
<div id=${main} class="ipsAreaBackground ipsPad">
    <ul class="ipsList_inline">
        <li id="elInput_Member_inputItem">
            <input type="text" placeholder="Member">
        </li>
    </ul>
    <br>
    <select>
        <option value="-1" selected disabled hidden>Probation reason</option>
        <option value="0">Activity</option>
        <option value="1">10 points</option>
        <option value="2">Negative rep</option>
        <option value="3">Previous</option>
    </select> <br>
    <div class="buttons">
        <button type="button" class="ipsButton ipsButton_primary">Fill</button>
        <button type="button" class="ipsButton ipsButton_primary">Fill & Submit</button>
    </div>
</div>`;
        const post = `
<p>
    Dear [TAG],
</p>

<p>
    You have been placed on probation due to <span style="color:#f1c40f">[REASON]</span>. This is your notification of Probation start.
</p>

<p>
    In order to be reinstated to your former rank in DI, you must complete probation. Pass all Activity Checks [TIME].
</p>

<p>
    <u>Your requirements per month:</u>
</p>

<ul>
    <li>
        100 REP
    </li>
    <li>
        Do not leave our Discord Server for more than 48 hours.
    </li>
    <li>
        Do not receive a behavioural strike.
    </li>
</ul>
<p>
    Failing to complete these terms by the deadline will result in being set to Inactive.
</p>

<p>
    Please acknowledge your requirements.<br>
    If you no longer wish to be a part of Damage Inc, you can request to be set to inactive under <a href="https://forum.dmginc.gg/topic/114547-inactive-request/">this topic</a>.
</p>

<p>
    If you successfully complete your probation, we will return you to your original rank and everything will return to normal.
</p>

<p>
    If you have any questions or concerns, please feel free to contact us.
</p>

<p>
    The Officers of the Prestigious Order of Vetus Praesidio
</p>`;
        const reasons = [
            'failing a second consecutive month of activity requirements',
            'accumulating 10 strike points',
            'falling into negative Reputation',
            'having previously failed Probation'
        ];

        $(menu).append(content);

        const text = $(`#${main} input`);
        text.on('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                return false;
            }
        });

        const update = async () => {
            const url = `https://forum.dmginc.gg/index.php?app=core&module=system&controller=ajax&do=findMember&input=${text.val()}`;
            const member = (await fetch(url).then(data => data.json()))[0];
            const option = +$(`#${main} select`).val();

            if (option < 0 || member === void 0 || member.name === '') {
                $(`.${editor}`).html('');
                $(title).val('');
                return;
            }

            const profile = `https://forum.dmginc.gg/profile/${member.id}-${member.name}/`;
            const time = option == 2 ? 'until you reach +300 REP' : 'for <span style="color:#f1c40f">4/8/12/16</span> weeks';
            const tag = `<a contenteditable="false" data-ipshover="" data-ipshover-target="${profile}?do=hovercard"
                 data-mentionid="${member.id}" href="${profile}">@${member.name}</a>`;
            $(`.${editor}`).html(post.replace('[REASON]', reasons[option]).replace('[TAG]', tag).replace('[TIME]', time));

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const date = new Date(Date.now() + new Date().getTimezoneOffset() * 6e4 + 24192e5 - 18e6);
            $(title).val(`${member.name} [Member] [Due: ${date.getDate()} ${months[date.getMonth()]}]`);
        };

        const buttons = $(`#${main} button[type='button']`);
        buttons.first().on('click', async () => await update());
        buttons.last().on('click', async () => {
            await update();
            $('form').trigger('submit');
        });

        GM_addStyle(`
            #extension_div {
                display: flex;
                flex-direction: column;
                line-height: 1;
            }
            #extension_div li {
                width: 100%;
            }
            #extension_div button {
                margin: 0.2em 0;
            }
        `);
    } else if (reEvent.test(window.location.href)) {
        const endpoint = 'https://api.dmginc.gg/v3/vp/issue_rep';
        const content = `
<li style="max-width: 80%">
    <div id="${main}">
        <input type="text" id="reason" placeholder="What is the award for?">
        <input type="text" id="members" placeholder="Members to be issued awards, separated by spaces">
        <select id="token">
            <option value="-1" selected disabled hidden>Select token type</option>
            <option value="1">Casual Event</option>
            <option value="3">Community Event</option>
            <option value="113">Comp Token</option>
            <option value="2">Event Host Token</option>
        </select>
        <button id='awardIssue' class='ipsButton ipsButton_important' type='button'>Issue rep</button>
        <p id="error"></p>
    </div>
</li>`;

        $('#ipsLayout_mainArea > ul').append(content);
        $('#awardIssue').on('click', async function () {
            const reason = $('#reason').val();
            const membersValue = $('#members').val();
            const members = membersValue.split(' ');
            const token = Number($('#token').val());

            $('#extension_div #reason').removeClass('error');
            $('#extension_div #members').removeClass('error');
            $('#extension_div #token').removeClass('error');

            const errorFields = [];
            const errorMessages = [];
            if (token === 0) {
                $('#extension_div #token').addClass('error');
                errorMessages.push('Please select a token type');
            }
            if (reason === '') {
                $('#extension_div #reason').addClass('error');
                errorMessages.push('Please type out a reason');
            }
            if (membersValue === '') {
                $('#extension_div #members').addClass('error');
                errorFields.push('members');
                errorMessages.push('Please type out the target members');
            }

            if (errorFields.length > 0) {
                $('#extension_div #error').text(errorMessages.join(', '));
                return;
            }

            if ($('#extension_div #awardIssue').hasClass('loading')) return;

            $('#extension_div #awardIssue').addClass('loading');

            await fetch(endpoint, {
                body: JSON.stringify({
                    memberNames: members,
                    awardId: token,
                    reason: escape(reason)
                }),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': '1XJN_b-0MCHCN$bR'
                }
            });
            this.innerText = 'Issued!';
            $('#extension_div #error').text('');
            $('#extension_div #awardIssue').removeClass('loading');
        });
        GM_addStyle(`
            #extension_div {
                display: flex;
                flex-wrap: wrap;
            }
            #extension_div > * {
                margin: 0 0.5em;
                min-width: 10rem;
            }
            #extension_div > .error {
                border: 1px solid rgba(192, 17, 19, 0.8);;
            }
            #extension_div > #reason {
                width: 8rem;
            }
            #extension_div > #members {
                min-width: 22rem;
            }
            #extension_div #error {
                flex-basis: 100%;
                color: rgba(192, 17, 19, 0.8);
            }
            #awardIssue {
                width: initial;
            }
            #awardIssue.loading {
                cursor: wait;
                opacity: 0.5;
            }
        `);
    } else if (reAway.test(window.location.href)) {

        const target = 'award_div';
        const url = 'https://forum.dmginc.gg/awards/award/new/?catid=3&awid=1';
        const content = `
<li>
    <div id="${main}">
        <div id="left">
            <input type="text" id="reason" placeholder="What is the token for?">
            <input type="text" id="member" placeholder="Member to be issued awards">
            <input type="number" id="amount" placeholder="Token count">
            <select id="token">
                <option value="21">Spend 50 REP</option>
                <option value="22" selected>Spend 100 REP</option>
                <option value="23">Spend 250 REP</option>
                <option value="24">Spend 1000 REP</option>
                <option value="151">Spend 5000 REP</option>
                <option value="152">Spend 25000 REP</option>
            </select>
        </div>
        <div id="right">
            <button id='awardIssue' class='ipsButton ipsButton_important' type='button'>Issue tokens</button>
            <div id="progress">
                <div id="progressBar"></div>
            </div>
        </div>
    </div>
</li>`;
        const post = `
<div class="ipsDialog" id="${target}" style="z-index: 5300; top: 0; display: none;" role="dialog" aria-label="Award" animating="false">
    <div>
        <h3 class="ipsDialog_title">New Award</h3>
        <hr class="ipsHr">
        <a href="#" class="ipsDialog_close" data-action="dialogClose">×</a>
        <div class="ipsDialog_content" style="display: block;">[HTML]</div>
    </div>
</div>`;

        let waiting = false;

        const html = await (await fetch(url, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })).text();
        $('body').append(post.replace('[HTML]', html));

        $('#ipsLayout_mainArea > ul').append(content);
        $('#awardIssue').on('click', async e => {
            if (waiting) return;

            const self = e.target;
            let reason = $('#reason').val();
            const member = $('#member').val().split(' ');
            const amount = $('#amount').val();
            const token = $('#token').val();

            if (+token === -1 || ![reason, member, amount].every(a => a !== '')) return;

            waiting = true;
            self.disabled = true;
            self.innerText = 'Loading...';

            reason = escape(reason).trim();
            const maxWidth = +getComputedStyle(e.target).width.slice(0, -2);
            const step = maxWidth / amount;

            const progress = $('#progress');
            const progressBar = $('#progressBar');
            progress.fadeIn(200);

            for (let i = 1; i <= amount;) {
                $(`#${target} textarea[name='awarded_reason']`).val(`${reason} (${i}/${amount})`);
                $(`#${target} textarea[name='awarded_member']`).val(member);
                const data = $('.ipsDialog_content form').serialize();
                await (await fetch(url, {
                    body: data.replace('award_id=1', `award_id=${token}`),
                    method: 'post',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })).text();
                progressBar.width(step * i++);
            }
            progress.fadeOut(200, () => {
                waiting = false;
                self.removeAttribute('disabled');
                self.innerText = 'Issue tokens';
                progressBar.width(0);
            });
        });
        GM_addStyle(`
            #extension_div {
                display: flex;
                align-items: center;
            }
            #left > * {
                margin: 0.3em 0.2em;
            }
            #left > select {
                max-width: 350px;
                width: 100%;
            }
            #progress {
                height: 4px;
                border-radius: 10px;
                margin-top: 10px;
            }
            #progressBar {
                width: 0px;
                height: 4px;
                border-radius: 10px;
                background: #b64240;
            }
        `);
    } else if (window.location.href === 'https://forum.dmginc.gg/last-active/') {
        const update = e => e.replace('https://dmginc.gg', 'https://forum.dmginc.gg');
        const profiles = 'tr > td > div > ul > li a';
        const button = `
<div id="${main}">
    <button id="refresh" class="ipsButton ipsButton_primary" type="button">Refresh</button>
    <button id="open" class="ipsButton ipsButton_primary" type="button">Open in new tab</button>
</div>`;
        const divs = `
<div class='first' style="margin: 10px 0;">
    <input type='checkbox' class="chkbx" id="[ID]">
</div>
<div class='second' style="display: flex;margin: 0;justify-content: space-around"></div>`;

        const hover = 'data-ipsHover-target';
        let last = null;
        let waiting = false;

        $('body').append(button);
        $('#refresh').on('click', e => {
            if (waiting) return;

            const self = e.target;
            let i = 1;
            waiting = true;
            self.disabled = 'true';
            self.innerText = 'Loading...';

            $(profiles).each(function () {
                const self = $(this);
                self.attr('href', update(self.attr('href')));
                self.attr(hover, update(self.attr(hover)));

                const img = self.find('img');
                if (img.length !== 0) img.attr('src', update(img.attr('src')));

                const parent = self.parent();
                if (parent.prop('tagName') === 'LI') {
                    const children = parent.children();
                    parent.prepend(divs.replace('[ID]', i++));
                    children.appendTo(parent.find('.second'));
                }
            });

            const checkboxes = $('.chkbx');
            const open = $('#open');

            checkboxes.on('click', function (e) {
                Array.from(checkboxes).every(box => !box.checked) ? open.hide() : open.show();
                if (!last) {
                    last = this;
                    return;
                }
                if (e.shiftKey) {
                    const start = checkboxes.index(this);
                    const end = checkboxes.index(last);
                    checkboxes.slice(Math.min(start, end), Math.max(start, end) + 1).prop('checked', last.checked);
                }
                last = this;
            });
            open.on('click', () => {
                const checked = Array.from(checkboxes).filter(box => box.checked);
                checked.forEach(box => {
                    const a = $(box).parent().parent().find('a')
                        .first();
                    window.open(a.attr('href'), '_blank');
                });
            });
            waiting = false;
            self.removeAttribute('disabled');
            self.innerText = 'Refresh';
        });
        GM_addStyle(`
            #extension_div {
                position: fixed;
                bottom: 1.2em;
                width: 100%;
                display: flex;
                justify-content: center;
                z-index: 10;
            }
            #open {
                display: none;
            }
            #extension_div button {
                margin: 0.2em;
            }
            table ul > li {
                display: flex;
            }
        `);
    } else if (reAdmin.test(window.location.href)) {
        const target = 'group_div';
        const post = `
<div class="ipsDialog" id="${target}" style="z-index: 5300; top: 0; display: none;" role="dialog" aria-label="Award" animating="false">
    <div>
        <h3 class="ipsDialog_title">Change rank</h3>
        <hr class="ipsHr">
        <a href="#" class="ipsDialog_close" data-action="dialogClose">×</a>
        <div class="ipsDialog_content" style="display: block;">[HTML]</div>
    </div>
</div>`;
        let link = 'https://forum.dmginc.gg/admin/?adsess=[SESSION]&app=core&module=members&controller=members&do=view&id=[ID]';
        let url = 'https://forum.dmginc.gg/admin/?adsess=[SESSION]&app=core&module=members&controller=members&do=editBlock&block=IPS%5Ccore%5Cextensions%5Ccore%5CMemberACPProfileBlocks%5CGroups&id=[ID]';
        const session = window.location.href.substring(38, 26);
        const input = '<input type=\'text\' id=\'customInput\' class=\'ipsPos_right acpTable_search ipsJS_show\' placeholder=\'Member IDs\'>';
        const rankCheck = '<span id=\'rankCheckContainer\'>Set to inactive <input id=\'rankCheck\' type=\'checkbox\'></span>';

        link = link.replace('[SESSION]', session);
        url = url.replace('[SESSION]', session);
        const html = await (await fetch(url.replace('[ID]', '302'), { headers: { 'X-Requested-With': 'XMLHttpRequest' } })).text();
        $('body').append(post.replace('[HTML]', html));

        $('div.acpBlock.ipsClear > div.ipsClearfix.ipsClear.acpWidgetToolbar > input').after(rankCheck).after(input);
        $('#customInput').on('keypress', async function (e) {
            if (e.key !== 'Enter') return;
            const ids = this.value.split(' ');
            const groupChange = $('#rankCheck').prop('checked');
            if (groupChange) {
                for (const id of ids) {
                    $(`#${target} select[name="group"]`).val('18');
                    const data = $('.ipsDialog_content form').serialize();
                    await (await fetch(url.replace('[ID]', id), {
                        body: data.replace(/(\S*group=)\d+(\S*)/, '$118$2'),
                        method: 'post',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })).text();
                }
            } else {
                ids.forEach(id => {
                    window.open(link.replace('[ID]', id), '_blank');
                });
            }
        });
        GM_addStyle(`
            #rankCheckContainer {
                float: right;
                vertical-align: middle;
                padding: 7px;
                font-size: 14px;
            }
        `);
    } else if (window.location.href === 'https://forum.dmginc.gg/search/') {
        $('ul[role=\'tablist\']').append('<li><a href=\'#\' id=\'elTab_searchTwitch\' class=\'ipsTabs_item ipsType_center\' title=\'Search through twitch links\' role=\'tab\'>Twitch Search</a></li>');
        $('#elTabs_search_content').append(`
<div id="ipsTabs_elTabs_search_elTab_searchTwitch_panel" class="ipsTabs_panel" data-tabtype="twitch" aria-hidden="true" style="display: none">
    <div class="ipsPad_double">
        <h3 class="ipsType_reset ipsType_large cStreamForm_title ipsSpacer_bottom ipsSpacer_half">Twitch links</h3>
        <div class="ipsFieldRow_fullWidth">
            <textarea id="twitchLinks" rows="10" placeholder="Separate twitch links with new lines"></textarea>
        </div>
        <button id="twitchSearch" type="button" class="ipsButton ipsButton_primary ipsButton_medium" style="margin: 2em">Check links</button>
        <div id="progress">
            <div id="progressBar"></div>
        </div>
        <div class="ipsType_large" style="display: flex; justify-content: space-evenly; line-height: 24px">
            <div id="twitchNames" style="padding: 0 10%"></div>
            <div id="twitchIds" style="padding: 0 10%"></div>
        </div>
    </div>
</div>`);
        const url = 'https://forum.dmginc.gg/search/?type=core_members&joinedDate=any&core_pfield_17=';
        let waiting = false;
        $('#twitchSearch').on('click', async e => {
            if (waiting) return;
            const self = e.target;
            const names = []; const
                ids = [];
            const linksInput = $('#twitchLinks');
            const links = linksInput.val().split('\n');

            const maxWidth = +getComputedStyle(e.target).width.slice(0, -2);
            const step = maxWidth / links.length;
            let i = 1;

            const progress = $('#progress');
            const progressBar = $('#progressBar');
            progress.fadeIn(200);

            for (const link of links) {
                const data = await fetch(url + link, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
                const result = (await data.json()).content;
                if (result.includes('Found 1 result')) {
                    const reId = /^\D+(\d+)+-\S+/gi;
                    const doc = new DOMParser().parseFromString(result, 'text/html');
                    const target = doc.querySelector('h2 a ~ a');
                    const name = target.querySelector('span:last-of-type').innerText;
                    const id = reId.exec(target.getAttribute('href'))[1];
                    names.push(name);
                    ids.push(id);
                    progressBar.width(step * i++);
                }
            }
            $('#twitchNames').html(names.join('<br>'));
            $('#twitchIds').html(ids.join('<br>'));
            progress.fadeOut(200, () => {
                waiting = false;
                self.removeAttribute('disabled');
                self.innerText = 'Check links';
                progressBar.width(0);
            });
        });
        GM_addStyle(`
            #progress {
                height: 4px;
                border-radius: 10px;
                margin-top: 10px;
            }
            #progressBar {
                width: 0px;
                height: 4px;
                border-radius: 10px;
                background: #b64240;
            }
        `);
    }
})();
