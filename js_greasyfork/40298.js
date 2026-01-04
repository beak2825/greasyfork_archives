// ==UserScript==
// @name         Kickstarter Message Template
// @author       Deparsoul
// @namespace    https://greasyfork.org/users/726
// @version      0.1
// @description  Auto fill kickstarter messages based on a given template
// @match        https://www.kickstarter.com/projects/*/backers/report/index*
// @icon         https://d3mlfyygrfdi2i.cloudfront.net/favicon.png?v=2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40298/Kickstarter%20Message%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/40298/Kickstarter%20Message%20Template.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    $('.result-info').after(`
Message Template
<textarea id="msg-template" style="width:40em;height:20em;display:block;margin-bottom:1em;">
Dear [Baker],

Your [Reward]
</textarea>
`);
    setInterval(()=>{
        let template = $('#msg-template').val().trim();
        if(!template) return;
        $('textarea[name="message[body]"]').each(function(){
            let t = $(this);
            if(t.val()===''){
                let m = t.closest('.modal_dialog_body');
                let baker = m.find('.f3.mb3').text().trim();
                let reward = m.find('.reward>h4').eq(1).text().trim().match(/Reward: (.*) \(.*?\)/)[1];
                t.val(template.replace(/\[Baker]/gi, baker).replace(/\[Reward]/gi, reward));
            }
        });
    }, 1000);
})(jQuery);