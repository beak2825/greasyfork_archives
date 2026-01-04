// ==UserScript==
// @name         squawkr
// @namespace    http://tampermonkey.net/
// @noframes
// @version      0.1
// @description  Add movies from IDMB to squawkr
// @author       Far Se
// @match        *://www.imdb.com/title/*
// @include      /.*?imdb\.com\/title\/.*?/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34114/squawkr.user.js
// @updateURL https://update.greasyfork.org/scripts/34114/squawkr.meta.js
// ==/UserScript==

    $('.summary_text').prepend(`<button style="    display: block;
    background: #e4bb24;
    font-family: Consolas;
    font-size: 15px;
    color: white;
    text-shadow: 1px 1px 1px dimgrey;
    border: none;
    padding: 5px 10px;" onclick="submitSquawkr()">Add on squawkr</button>
<script type="text/javascript">
function submitSquawkr() {
var title = text = window.getSelection().toString();
if (title === "") title = jQuery('meta[property="og:title"]')[0].content.match(/(^.*?)\\(/)[1];
$.ajax({
        url: 'https://api.themoviedb.org/3/search/movie?query=' + encodeURI(title) + '&api_key=f22e6ce68f5e5002e71c20bcba477e7d'
    })
    .done(function(d) {
        if(d.results.length)
		{
			var id = d.results[0]["id"];
			var year = d["results"][0]["release_date"].split('-')[0];
			var stuff = "<form id='squawkr_add' method='POST' action='https://squawkr.io/userAction.php'>";
			stuff = stuff + "<input name='name' value='"+title+"'>";
			stuff = stuff + "<input name='hiddenimdbID' value='"+id+"'>";
			stuff = stuff + "<input name='hiddenyear' value='"+year+"'>";
			stuff = stuff + "<input name='selQuality' value='none'>";
			stuff = stuff + "<input name='selLanguage' value=''>";
			stuff = stuff + "<input name='action_type' value='add'>";
			stuff = stuff + "<input name='id' value=''>";
			stuff = stuff + "</form>";
			$('body').append(stuff);
			$('#squawkr_add').submit();
		}else console.log(d);
    });
}</script>`);