// ==UserScript==
// @name         Bitbucket - Add Additional Issue Filters
// @namespace    http://davefive.org/
// @version      1.9
// @description  Adds 'My Open' issue filter and configurable additional dropdown issue filter categories
// @author       davfive
// @match        https://bitbucket.org/*/*/issues*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35060/Bitbucket%20-%20Add%20Additional%20Issue%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/35060/Bitbucket%20-%20Add%20Additional%20Issue%20Filters.meta.js
// ==/UserScript==
//
// Note that if you want to have this run on one specific repository, then change
// the match's */* to acount/repository. I have per repository ones because I
// use the filter (as you can see below) to create pseudo categories (like I have
// in the full JIRA) that allow me to group my filters nicely.
// 
// 1.9 - Added Proposal separate menu. Proposals where showing up everywhere when 
//       they should be on the side to review later
// 1.8 - Too quick on the draw and didn't test first. Forgot & in search appendage
// 1.7 - Changed !resolved for My Open to simply append owner=$(curr_owner) to it
// 1.6 - Added 'Infrastructure' category
// 1.5 - Fix the spelling of Aethetics
// 1.4 - Updated NextRelease to Status Dashboard
// 1.3 - Fix script not showing up on issues page with no search (no trailing ?)
// 1.2 - Fix All Catagories and No Categories searches to be correct
// 1.1 - Abstracted out new_filters dropdown to simplify creation
//     - Added ability to put separators by appending -^ (before) or -v (after) to name
// 1.0 - Initial Release
//     - Added My Open filter
//     - Added Filter dropdowns
//---------------------------------------------------------------------------------------
// User Script stored on Greasy Fork at
//   https://greasyfork.org/en/scripts/35060-bitbucket-add-additional-issue-filters

// Search string ends in: '-^' (above); '-v' (below)
function create_filter(id, name, url, separator) {
    separator = 'none';
    if (/-\^$/.test(name)) {
        separator = 'above';
    } else if (/-v$/.test(name)) {
        separator = 'below';
    }
    if (separator !== 'none') {
        name = name.slice(0, -2);
    }

    lis = '';
    if (separator === 'above') {
        lis += '<li aria-pressed="false"><hr style="margin: 0;"></li>';
    }
    lis += '<li "'+id+'" aria-pressed="false"><a href="'+url+'">'+name+'</a></li>';
    if (separator === 'below') {
        lis +=  '<li aria-pressed="false"><hr style="margin: 0;"></li>';
    }
    return lis;
}

function add_filter(filters, id, name, url) {
    if (id === undefined) {
        id = '';
    } else {
        id = 'id="'+id+'"';
    }
    new_filter = create_filter(id, name, url);
    filters.append(new_filter);
}

function add_filter_dropdown(filters, id, category, new_filters) {
    id='fdd-'+id;
    var dropdown = `
      <div class="aui-buttons">
        <a id="`+id+`" href="#" class="aui-button aui-dropdown2-trigger"
           aria-owns="`+id+`-dropdown" aria-haspopup="true"
           style="background: #fff;"
        >`+category+`</a>
      </li>
      <div id="`+id+`-dropdown" class="aui-dropdown2 aui-style-default"><ul>
    `;
    var counter = 1;
    for (var name in new_filters) {
        var this_id = id+'-'+counter;
        dropdown += create_filter(this_id, name, new_filters[name]);
        counter += 1;
    }
    dropdown += '</ul></div>';
    filters.append(dropdown);

    // Because I set the background to #fff so that the dropdown button
    // background matched the other filter links, , I need to set
    // the text-color to black when the button is clicked, because
    // bitbucket sets the background blue and text white when clicked.
    $('a#'+id).click(function(){
        $(this).css('color', '#000');
        // ARGGGH!!! They use an ::after that I can't get at for their caret and half of it stays white
        // They do some crazy border rotate this for a caret so they don't load a caret img
        // $('a#more'+id+'::after').css('border-top-color', '#000');
    });
}

(function() {
    'use strict';
    var myissues_link = $('li#mine a').attr('href');
    var curr_user = myissues_link.split('?responsible=')[1];

    // Base issue query url https://bitbucket.org/.../issues?
    var search_base = myissues_link.split('?')[0] + '?';

    var filters = $('#issues-list ul.filter-status');

    add_filter(filters, 'proposals', 'Proposals', search_base + 'kind=proposal');
    search_base += 'kind=!proposal'; /* Don't show them anywhere else */

    var open_link = $('li#open a').attr('href');
    add_filter(filters, 'myopen', 'My Open', open_link+'&kind=!proposal&responsible='+curr_user);

    var show_more = true;
    if (show_more === true) {
        var categories = ['Product Dashboard', 'Status Dashboard', 'About Dashboard', 'Site Aesthetics', 'Notifications', 'Infrastructure' ];
        var search_queries = {};
        search_queries['All Categories-v'] = '&status=%21resolved&title=^%5B';
        for (var i in categories) {
            var cat = categories[i];
            search_queries[cat] = '&status=%21resolved&title=^%5B'+ encodeURI(cat) +'%5D';
        }
        search_queries['No Category-^'] = '&status=%21resolved&title=-^%5B';

        var components = {};
        for (var name in search_queries) { components[name] = search_base + search_queries[name]; }
        add_filter_dropdown(filters, 'comps', 'Components', components);

        var mycomponents = {};
        for (name in search_queries) { mycomponents['My '+name] = search_base + search_queries[name] + '&responsible=' + curr_user; }
        add_filter_dropdown(filters, 'mycomps', 'My Components', mycomponents);
    }
})();