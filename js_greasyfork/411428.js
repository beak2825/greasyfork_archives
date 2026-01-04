// ==UserScript==
// @name         Pokedex 100 watch
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Watch discord for pokedex entry
// @author       Hieudmg
// @match        https://discord.com/channels/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @grant        GM_notification
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/411428/Pokedex%20100%20watch.user.js
// @updateURL https://update.greasyfork.org/scripts/411428/Pokedex%20100%20watch.meta.js
// ==/UserScript==

(function() {
    'use strict';
    jQuery(function($) {
        $(document).ready(function() {
            $("head").append (
                '<link '
                + 'href="//code.jquery.com/ui/1.11.4/themes/dot-luv/jquery-ui.css" '
                + 'rel="stylesheet" type="text/css">'
            );

            function runObserver() {
                var target = $( "#chat-messages" )[0];
                // Create an observer instance
                var observer = new MutationObserver(function( mutations ) {
                    mutations.forEach(function( mutation ) {
                        var newNodes = mutation.addedNodes; // DOM NodeList
                        if( newNodes !== null ) { // If there are new nodes added
                            var $nodes = $( newNodes ); // jQuery set
                            $nodes.each(function() {
                                var node = $( this );
                                var pokeName = node.find('strong').eq(0).text();
                                var text = node.find('div').eq(1).text();
                                var lines = text.split('\n');
                                if (pokeName) {
                                    GM_notification({
                                        title: lines.shift(),
                                        text: lines.join('\n'),
                                        image: node.find('.emoji').eq(1).attr('src'),
                                        timeout: 0,
                                        onclick: function() {
                                            var href = node.find('a[title="Click for Coords"]').attr('href');
                                            GM_openInTab(href, false);
                                        }
                                    });
                                }
                            });
                        }
                    });
                });

                // Configuration of the observer:
                var config = {
                    childList: true
                };

                // Pass in the target node, as well as the observer options
                observer.observe(target, config);

                return observer;
            }
            $("body").append (`
<div id="watcher">
<button id="run-watcher" data-run="false">Run</button>
</div>
`);

            setTimeout(function() {
                $("#run-watcher").dialog ( {
                    modal:      false,
                    title:      "Watcher",
                    position:   {
                        my: "right bottom",
                        at: "right bottom",
                        of: window
                        , collision: "none"
                    },
                    width:      "auto",
                    minWidth:   100,
                    minHeight:  100,
                    zIndex:     3666
                } )
                    .dialog ("widget").draggable ("option", "containment", "none");

                //-- Fix crazy bug in FF! ...
                $("#run-watcher").parent().css ( {
                    position:   "fixed",
                    width:      "100px",
                    height:      "100px",
                    'font-size': '1em'
                } );
            }, 5000);
            var theObserver;
            $('#run-watcher').click(function() {
                if ($('#run-watcher').data('run')) {
                    theObserver.disconnect();
                    $('#run-watcher').text('Run');
                } else {
                    theObserver = runObserver();
                    $('#run-watcher').text('Stop');
                }
                $('#run-watcher').data('run', !$('#run-watcher').data('run'));
            });
        });
    });
})();