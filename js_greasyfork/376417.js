// ==UserScript==
// @name         AO3 Review + Last Chapter Shortcut + Kudos-sortable Bookmarks
// @namespace    saxamaphone
// @version      2.2
// @description  Adds shortcuts for last chapter and a floaty review box, sorts bookmarks by kudos (slow) and allows filter by complete only, download link to listing
// @author       You
// @match        http://archiveofourown.org/*
// @match        https://archiveofourown.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376417/AO3%20Review%20%2B%20Last%20Chapter%20Shortcut%20%2B%20Kudos-sortable%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/376417/AO3%20Review%20%2B%20Last%20Chapter%20Shortcut%20%2B%20Kudos-sortable%20Bookmarks.meta.js
// ==/UserScript==

// Change here to pick what filetype you want the default download to be
var sTypeWanted = 'epub';

var oTypeMapping = {
    'mobi': 1,
    'epub': 2,
    'pdf': 3,
    'html': 4
};

// From http://stackoverflow.com/a/1909997/584004
(function (jQuery, undefined) {
    jQuery.fn.getCursorPosition = function() {
        var el = jQuery(this).get(0);
        var pos = 0;
        if('selectionStart' in el) {
            pos = el.selectionStart;
        } else if('selection' in document) {
            el.focus();
            var Sel = document.selection.createRange();
            var SelLength = document.selection.createRange().text.length;
            Sel.moveStart('character', -el.value.length);
            pos = Sel.text.length - SelLength;
        }
        return pos;
    };
})(jQuery);

// From http://stackoverflow.com/a/841121/584004
(function (jQuery, undefined) {
    jQuery.fn.selectRange = function(start, end) {
        if(end === undefined) {
            end = start;
        }
        return this.each(function() {
            if('selectionStart' in this) {
                this.selectionStart = start;
                this.selectionEnd = end;
            } else if(this.setSelectionRange) {
                this.setSelectionRange(start, end);
            } else if(this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        });
    };
})(jQuery);

// From http://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513, modified to allow [] in params
function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search.replace(/\[/g, '%5B').replace(/\]/g, '%5D')) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function getStoryId()
{
    var aMatch = window.location.pathname.match(/works\/(\d+)/);
    if(aMatch !== null)
        return aMatch[1];
    else
        return jQuery('#chapter_index li form').attr('action').match(/works\/(\d+)/)[1];
}

function getBookmarks(sNextPath, aBookmarks, oDeferred) {
    jQuery.get(sNextPath, function(oData) {
        aBookmarks = jQuery.merge(aBookmarks, jQuery(oData).find('li.bookmark'));
        if(jQuery(oData).find('.next a').length)
            getBookmarks(jQuery(oData).find('.next').first().find('a').attr('href'), aBookmarks, oDeferred);
        else
            oDeferred.resolve();
    });
}

jQuery(window).ready(function() {
    // Process bookmarks first because of extra sorting steps. Once this is done, handle everything else
    var oBookmarksProcessed = jQuery.Deferred();
    
    // If on the bookmarks page, add option to sort by kudos
    if(window.location.pathname.indexOf('/bookmarks') != -1)
    {
        // Wait to handle the bookmarks after they're loaded
        var oBookmarksLoaded = jQuery.Deferred();
        
        var bKudos = false, bComplete = false;
        
        // Add options for Kudos sorting and Complete works only
        jQuery('#bookmark_search_sort_column').append('<option value="kudos_count">Kudos</option>');
        jQuery('#bookmark_search_with_notes').parent().after('<dt>Status</dt><dd><input id="work_search_complete" name="work_search[complete]" type="checkbox" value="1"/><label for="work_search_complete">Complete only</label></dd>');
        
        if(getURLParameter('bookmark_search%5Bsort_column%5D') == 'kudos_count')
        {
            jQuery('#bookmark_search_sort_column').val('kudos_count');
            bKudos = true;
        }
        
        if(getURLParameter('work_search%5Bcomplete%5D') == '1')
        {
            jQuery('#work_search_complete').attr('checked', 'checked');
            bComplete = true;
        }
        
        // If either option has been selected, we perform our own process
        if(bKudos || bComplete)
        {
            // Get bookmarks, this takes at least a few seconds so we have to wait for that to finish
            var aBookmarks = [];
            getBookmarks(window.location.href.replace(/&page=\d+/, ''), aBookmarks, oBookmarksLoaded);
            
            jQuery.when(oBookmarksLoaded).done(function () {
                if(bKudos)
                {
                    aBookmarks.sort(function(oA, oB) {
                        return (parseInt(jQuery(oB).find('dd.kudos').find('a').html()) || 0) - (parseInt(jQuery(oA).find('dd.kudos').find('a').html()) || 0);
                    });
                }
                
                if(bComplete)
                {
                    jQuery.each(aBookmarks, function(iArrayIndex) {
                        var sChapters = jQuery(this).find('dd.chapters').html();
                        if(sChapters !== undefined)
                        {
                            var aChapters = sChapters.split('\/');
                            if(aChapters[0] != aChapters[1])
                                aBookmarks.splice(iArrayIndex, 1);
                        }
                        else if (jQuery(this).find('.stats').length === 0)
                            aBookmarks.splice(iArrayIndex, 1);
                    });
                }

                var iPage = getURLParameter('page');
                if(iPage === null)
                    iPage = 1;

                jQuery('li.bookmark').remove();

                var iIndex;
                var iNumBookmarks = aBookmarks.length;
                for(iIndex = (iPage-1) * 20; iIndex < (iPage*20) && iIndex < iNumBookmarks; iIndex++)
                {
                    jQuery('ol.bookmark').append(aBookmarks[iIndex]);
                }
                
                // If bookmarks are limited by Complete, change the number displayed
                if(bComplete)
                {
                    var sPrevHeading = jQuery('h2.heading').html();
                    jQuery('h2.heading').html(sPrevHeading.replace(/\d+ - \d+ of \d+/, (iPage-1)*20+1 + ' - ' + iIndex + ' of ' + aBookmarks.length));
                    
                    // Repaginate if necessary
                    var iFinalPage = jQuery('ol.pagination').first().find('li').not('.previous, .next').last().text();
                    var iNewFinalPage = Math.ceil(iNumBookmarks/20);
                    if(iFinalPage > iNewFinalPage)
                    {
                        // Rules for AO3 pagination are way too complicated for me to bother replicating, so just going to remove extra pages
                        var aPageLinks = jQuery('ol.pagination').first().find('li');
                        jQuery('ol.pagination').find('li a').each(function () {
                            if(jQuery.isNumeric(jQuery(this).text()) && jQuery(this).text() > iNewFinalPage) 
                                jQuery(this).parent().remove();
                        });
                        
                        // Deactivate the last Next link if necessary
                        if(iPage == iNewFinalPage)
                           jQuery('ol.pagination').find('li.next').html('<li class="next" title="next"><span class="disabled">Next →</span></li>');
                    }
                }
                
                oBookmarksProcessed.resolve();
            });
        }
        else
            oBookmarksProcessed.resolve();
    }
    else
        oBookmarksProcessed.resolve();
    
    jQuery.when(oBookmarksProcessed).done(function() {
        // Check if you're on a story or a list
        // If not a story page, presume an index page (tags, collections, author, bookmarks, series) and process each work individually, add last chapter link to the end
        if(jQuery('.header h4.heading').length)
        {
            // Near as I can figure, the best way of identifying actual stories in an index page is with the h4 tag with class 'heading' within a list of type 'header' 
            jQuery('.header h4.heading').each(function() {
                var sStoryPath = jQuery(this).find('a').first().attr('href');
                var oHeader = this;

                // If link is from collections, get proper link
                var aMatch = sStoryPath.match(/works\/(\d+)/);
                if(aMatch !== null)
                {
                    var iStoryId = aMatch[1];
console.log('hi');
                    // Access first chapter of story to get last chapter and download links
                    jQuery.get('https://archiveofourown.org/works/' + iStoryId, function(oData) {
                        console.log(oData);
                        var iLastChapterId = jQuery(oData).find('#selected_id option').last().val();
                        jQuery(oHeader).append(' <a href="/works/' + iStoryId + '/chapters/' + iLastChapterId +'" title="Jump to last chapter">»</a>');
                        
                        // Use the chosen filetype from the beginning
                        var sDownloadLink = jQuery(oData).find('.download ul li:nth-child(' + oTypeMapping[sTypeWanted] + ') a').attr('href');
                        console.log('link: '+sDownloadLink);
                        jQuery(oHeader).append(' <a href="' + sDownloadLink + '" title="Download work">↡</a>');
                    }).fail(function() {
                        console.log('failed');
                    });
                }
            });
        }
        // Review box and last chapter buttons are story-specific
        else if(jQuery('ul.work'))
        {
            // HTML to define layout of popup box
            // Include x button to close box
            var sHtml = '<p class="close actions" id="close_floaty"><a aria-label="cancel" style="display: inline-block;">×</a></p>';
            // Button to insert highlighted text and for a help list
            sHtml += '<ul class="actions" style="float: left; margin-top: 10px;"><li id="insert_floaty_text"><a>Insert</a></li><li id="pop_up_review_tips"><a>Review Tips</a></li></ul>';
            // Textarea
            sHtml += '<textarea style="margin: 5px; width: 99%;" id="floaty_textarea"></textarea>';

            // Create popup box
            jQuery("<div/>", {
                id: "reviewTextArea",
                width:600, // Change for dimensions
                height:300, // Change for dimensions
                css: {
                    backgroundColor:"#ffffff",
                    opacity: 0.75,
                    border: "thin solid black",
                    display: "inline-block",
                    "padding-right": 10,
                    position: "fixed",
                    top: 150,
                    right: 5
                },
                html: sHtml
            }).resizable().draggable().appendTo("body");

            // Hide the popup box by default (comment out line below if you want it to always appear by adding // before it)
            jQuery('#reviewTextArea').hide();

            // To close the box
            jQuery('#close_floaty').click(function() {
                jQuery('#reviewTextArea').hide();
            });

            // Anything you type in the box gets inserted into the real comment box below
            jQuery('#floaty_textarea').on('input', function() {
                jQuery('.comment_form').val(jQuery('#floaty_textarea').val());
            });

            // Add Float review box button to the top
            jQuery('ul.work').prepend('<li id="floaty_review_box"><a>Floaty Review Box</a></li>');

            // If the above button is clicked, display the review box
            jQuery('#floaty_review_box').click(function() {
                jQuery('#reviewTextArea').show();
            });

            // Insert highlighted/selected text into textarea when Insert button is clicked
            jQuery('#insert_floaty_text').click(function() {
                var sInitialText = jQuery('#floaty_textarea').val();
                var iPosition = jQuery('#floaty_textarea').getCursorPosition();

                var sHighlightedText = window.getSelection().toString();

                var sNewText = sInitialText.substr(0, iPosition) + '<i>"' + sHighlightedText + '"</i>\n' + sInitialText.substr(iPosition);
                jQuery('#floaty_textarea').val(sNewText);
                jQuery('#floaty_textarea').focus();
                jQuery('#floaty_textarea').selectRange(iPosition+sHighlightedText.length+10);

                // Copy into real comment box
                jQuery('.comment_form').val(jQuery('#floaty_textarea').val());
            });
            
            // Create the review tips box
            sReviewTipsHtml = '<p class="close actions" id="close_review_tips"><a aria-label="cancel" style="display: inline-block;">×</a></p>' + 
                    'Writers will love any love you give them. If you&#39;re looking for things to help jumpstart a review, there are lots of different things you could focus on.<br />' + 
                    '<ul><li>Quotes you liked</li><li>Scenes you liked</li><li>What&#39;s your feeling at the end of the chapter (did it move you?)</li><li>What are you most looking forward to next?</li>' +
                    '<li>Do you have any predictions for the next chapters you want to share?</li><li>Did this chapter give you any questions you can&#39;t wait to find out the answers for?</li>' +
                    '<li>How would you describe the fic to a friend if you were recommending it?</li><li>Is there something unique about the story that you like?</li><li>Does the author have a style that really works for you?</li>' + 
                    '<li>Did the author leave any comments in the notes that said what they wanted feedback on?</li>' + 
                    '<li>Even if all you have are &quot;incoherent screams of delight&quot;, and can&#39;t come up with a real comment at the moment, authors love to hear that as well</li></ul>';
            jQuery("<div/>", {
                id: "reviewTips",
                width:600, // Change for dimensions
                height:300, // Change for dimensions
                css: {
                    backgroundColor:"#ffffff",
                    border: "thin solid black",
                    'font-size': '80%',
                    padding: '10px 10px 0 10px',
                    position: "fixed",
                    top: 150,
                    right: 620
                },
                html: sReviewTipsHtml
            }).resizable().draggable().appendTo("body");
            jQuery('#reviewTips li').css('list-style', 'circle inside none');
            jQuery('#reviewTips').hide();
            
            // Pop up list of review tips
            jQuery('#pop_up_review_tips').click(function() {
                jQuery('#reviewTips').show();
            });
            
            jQuery('#close_review_tips').click(function() {
                jQuery('#reviewTips').hide();
            });

            // Before adding button for Last Chapter, make sure we're not on the last (or only) chapter already
            if(jQuery('.next').length)
            {
                // Add button for Last Chapter
                jQuery('ul.work').prepend('<li id="go_to_last_chap"><a>Last Chapter</a></li>');

                // If the above button is clicked, go to last chapter
                jQuery('#go_to_last_chap').click(function() {
                    window.location.href = '/works/' + getStoryId() + '/chapters/' + jQuery('#selected_id option').last().val();
                });
            }

            // Adding a First Chapter button
            if(jQuery('.previous').length)
            {
                // Add button for First Chapter
                jQuery('ul.work').prepend('<li id="go_to_first_chap"><a>First Chapter</a></li>');

                // If the above button is clicked, go to first chapter
                jQuery('#go_to_first_chap').click(function() {
                    window.location.href = '/works/' + getStoryId();
                });
            }
        }
    });
});