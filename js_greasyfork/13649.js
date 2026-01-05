// ==UserScript==
// @name           Redmine Ticket Preset
// @description:en Autofill new ticket fields.
// @version        0.2
// @namespace      http://twitter.com/foldrr/
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @match          http://*/redmine/projects/*/issues/new
// @description Autofill new ticket fields.
// @downloadURL https://update.greasyfork.org/scripts/13649/Redmine%20Ticket%20Preset.user.js
// @updateURL https://update.greasyfork.org/scripts/13649/Redmine%20Ticket%20Preset.meta.js
// ==/UserScript==

(function(){
    var config = {
        'project1': {
            'private' : true,
            'tracker' : '開発',
            'assigned': 'Steve',
            'version' : 'v1.0.0',
        },
        'project2': {
            'private' : false,
            'tracker' : '開発',
            'assigned': 'Woz',
            'version' : 'v1.1.0',
        },
    };
    var project_name = (location.href.match(/projects\/([^\/]+)/) || [])[1];
    if(! project_name) return;
    if(! config[project_name]) return;
    
    var setCheck = function(id, key){
        var value = config[project_name][key];
        if(! value) return;
        
        $('input[id="' + id + '"]').prop('checked', !!value);
    };
    
    var setSelect = function(id, key){
        var text = config[project_name][key];
        if(! text) return;
        
        value = $('select[id="' + id + '"] option:contains("' + text + '")').val();
        $('select[id="' + id + '"]').val(value);
    };
    
    setCheck ("issue_is_private"      , "private" );
    setSelect("issue_tracker_id"      , "tracker" );
    setSelect("issue_assigned_to_id"  , "assigned");
    setSelect("issue_fixed_version_id", "version" );
})();
