// ==UserScript==
// @name     theomism_remover
// @include  https://tjournal.ru/*
// @description ~
// @version 0.0.1.20170717104102
// @namespace https://greasyfork.org/users/140838
// @downloadURL https://update.greasyfork.org/scripts/31452/theomism_remover.user.js
// @updateURL https://update.greasyfork.org/scripts/31452/theomism_remover.meta.js
// ==/UserScript==

var vocabulary = ['теом', 'все сон', 'всё сон', 'сосни', '~', 'потенциальности',
                  'theomism', 'воля возможного', 'гносеологич', 'онтологич', 'предположение, гипотеза',
                  'потенциально,', 'teo-om', 'призрачном сне', 'только предполагать', 'не то, чем кажется'];

for (var word of vocabulary)
{
    var term = word.toLowerCase();
    $(".b-comment__text").each(function()
    {
  		if($(this).html().toLowerCase().indexOf(term) > -1)
  		{
     		$(this).text("THEOMISM DETECTED");
     	}
	});
}