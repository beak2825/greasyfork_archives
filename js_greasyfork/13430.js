// ==UserScript==
// @name		InoReader Starred Articles Sticky Note
// @description Shows a new block which contains the last starred items in the selected feed
// @namespace	http://www.inoreader.com/
// @version		0.12
// @copyright	Zoltan Wacha
// @include		http://www.inoreader.com/*
// @include		https://www.inoreader.com/*
// @require		http://code.jquery.com/jquery-latest.js
// @grant		GM_addStyle
// @grant		GM_setValue
// @grant		GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/13430/InoReader%20Starred%20Articles%20Sticky%20Note.user.js
// @updateURL https://update.greasyfork.org/scripts/13430/InoReader%20Starred%20Articles%20Sticky%20Note.meta.js
// ==/UserScript==

GM_addStyle ( "         								\
  #z_starred_list{ \
    margin: 8px; \
    padding: 12px; \
    background-color: #fffef7; \
	font-size: 12px; \
  }\
  .z_starred_list_item{ \
    padding: 4px; \
    background-color: #fffef7; \
	cursor: pointer; \
  }\
  .z_starred_list_item:hover{ \
    text-decoration: underline; \
  }\
" );

document.getElementById('reader_pane').addEventListener('DOMNodeInserted', gmMain, false);

function gmMain() {
	if(GM_getValue("backLink") == null)
	{
		if($('#reader_pane').length > 0 && ($('#reader_pane #next_articles').length > 0 || $('#reader_pane #no_more_div').length > 0 || $('#reader_pane .reader_pane_message').length > 0) && !$('#reader_pane #z_starred_list').length > 0)
		{
			var str = location.href;
			var res = str.split("/");

            if(res[res.length-2] == 'feed')
            {
                if($('#reader_pane #no_more_div').length > 0)
                {
                    $('<div id="z_starred_list"></div>').insertBefore('#reader_pane #no_more_div');
                }
                else
                {
                    $('<div id="z_starred_list"></div>').prependTo('#reader_pane');
                }

                $.ajax({
                    url: 'https://www.inoreader.com/reader/atom/feed/'+res[res.length-1]+'?it=user/-/state/com.google/starred&output=json&getEncodedArticleIds=1&AppId=1000001306&AppKey=1JOdmPhjRI_un9p1o5sm7lM6qyar2QS8',
                    async:	true,
                    cache:	false,
                    dataType: "json"
                })
                .fail(function() {

                })
                .done(function( data ) {
                    if(data['items'].length > 0)
                    {
                        $('<strong>Starred articles here:</strong>').prependTo('#reader_pane #z_starred_list');
                        $.each(data['items'], function (index, value) {
                            var outputText = $('<textarea />').html(value['title']).text();
                            $('<div/>', {
                                class: 'z_starred_list_item',
                                text: outputText,
                                onclick: 'window.open(\'http://www.inoreader.com/article/'+value['encodedId']+'\');'
                            }).appendTo('#z_starred_list');
                        });
                        var x = document.getElementById('z_starred_list');
                        x.addEventListener('click', setBackLink, false);
                    }
                    else
                    {
                        $('<strong>No starred articles here.</strong>').prependTo('#reader_pane #z_starred_list');
                    }
                });
            }
		}
	}
	else if(!$('#reader_pane #z_starred_list').length > 0)
	{
		$('<div id="z_starred_list"></div>').insertBefore('#reader_pane #no_more_div');
		$('<div/>', {
			class: 'z_starred_list_item',
			text: '<< Back to the feed',
			onclick: 'javascript:window.location.href = \'' + GM_getValue("backLink") + '\''
		}).appendTo('#reader_pane #z_starred_list');
		GM_setValue("backLink", null);
	}
}

function setBackLink() {
	GM_setValue("backLink", location.href);
}
