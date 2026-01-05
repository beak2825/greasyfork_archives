// ==UserScript==
// @name         Kongregate Broadcast
// @description  Send messages to multiple users
// @namespace    resterman
// @version      0.1
// @author       resterman
// @match        http://www.kongregate.com/accounts/*/messages
// @match        http://www.kongregate.com/accounts/*/private_messages
// @downloadURL https://update.greasyfork.org/scripts/21668/Kongregate%20Broadcast.user.js
// @updateURL https://update.greasyfork.org/scripts/21668/Kongregate%20Broadcast.meta.js
// ==/UserScript==

function sendPrivateMessage(user, content, token) {
    new Ajax.Request(`/accounts/${user}/messages`, {
        method: 'post',
        parameters: {
            'utf8': '✓',
            'shout[private]': true,
            'shout[content]': content,
            'authenticity_token': token
        }
    });
}

(function main() {

    let htmlForm = `
<div class="leave_message">
    <div class="clear"></div>
    <form accept-charset="UTF-8" id="private_broadcast_form" method="post">
        <dl>
            <dd class="form_block" id="shout_content_block">
                <dl>
                    <span class="error_block error"
                          id="shout_content_error_block"></span>
                    <dd class="label_block" id="shout_content_label_block"></dd>
                    <dd id="shout_content_control_block" class="input_block">
                        <textarea class="hintable hinted_value" cols="112"
                                  id="shout_content" name="shout[content]" rows="2"
                                  title="Leave a private message for NomuitJargon"></textarea>
                    </dd>
                </dl>
            </dd>
        </dl>
        <input class="submission_button" id="shout_form_submit"
               onclick="" type="submit" value="Send"/>
        <span class="spinner spinner_gray" id="shout_form_submit_spinner"
              style="display:none" title="loading…"></span>
        <div class="clear"></div>
    </form>
</div>`;
    let form = new Element('div').update(htmlForm).down('div');

    form.observe('submit', function (e) {
        e.stop();

        let form = $('private_broadcast_form');
        let content = form['shout_content'].getValue();
        let users = prompt('Enter users separated by comma:').split(',');
        let token = $$('meta[name=csrf-token]')[0].readAttribute('content');

        users.map(function (u) {
            sendPrivateMessage(u, content, token);
        });
    });

    $('shouts_table').select('h3')[0].insert({after: form});
})();
