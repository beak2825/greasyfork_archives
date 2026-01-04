// ==UserScript==
// @name         ElonH Userscript Template
// @namespace    elonhhuang@gmail.com
// @version      0.0.1
// @description  This is ElonH Userscript Template.
// @author       ElonH <elonhhuang@gmail.com>
// @license      MIT https://opensource.org/licenses/MIT
// @match        *
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378256/ElonH%20Userscript%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/378256/ElonH%20Userscript%20Template.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ElonH_template={ // obj name
        //-------- Modification Area -------- start --------
        button_id:'elonh_btn',
        button_name: 'ElonH button',
        add_btn_to:function(btn){ // add button to somewhere
            document.getElementById('search').appendChild(btn);
        },

        extra_info: function (){ // button function
            console.log('extra_info');
        },
        //-------- Modification Area --------  end  --------
        add_btn:function (){
            if(document.getElementById(ElonH_template.button_id)){
                return;
            }
            // create button
            var btn=document.createElement("BUTTON");
            btn.id=ElonH_template.button_id;
            var t=document.createTextNode(ElonH_template.button_name);
            btn.appendChild(t);
            // add button
            ElonH_template.add_btn_to(btn)

            // add listenter
            document.getElementById(ElonH_template.button_id).addEventListener("click", ElonH_template.extra_info);
        },

        check_playlist: function (){
            setInterval(ElonH_template.add_btn,1000);
            ElonH_template.add_btn();
        }
    }
    ElonH_template.check_playlist();
})();