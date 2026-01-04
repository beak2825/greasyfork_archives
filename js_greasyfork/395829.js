// ==UserScript==
// @name        Feedly Enchance
// @namespace   https://greasyfork.org/en/users/37676
// @description View URL For Nyaa+Anidex
// @match       *://*.feedly.com/*
// @run-at      document-end
// @version     1.0.0
// @grant       none
// @license     Creative Commons Attribution 4.0 International Public License; http://creativecommons.org/licenses/by/4.0/
// @downloadURL https://update.greasyfork.org/scripts/395829/Feedly%20Enchance.user.js
// @updateURL https://update.greasyfork.org/scripts/395829/Feedly%20Enchance.meta.js
// ==/UserScript==

var linkObserver = new MutationObserver(function(mutations, observer) {
	for (var mutation of mutations)
	{
        var totalNode = mutation.addedNodes.length;
        
        for (var i=0; i < totalNode; i++)
        {
            var node = mutation.addedNodes[i];
			
            if (node.nodeType === Node.ELEMENT_NODE)
            {
                if (node.id.indexOf('_main') > -1)
                {
                    var titleLink = node.querySelector('.entryTitle');
					
                    if (titleLink)
                    {
                        if (titleLink.href.indexOf('kompas.com') > -1)
						titleLink.href += '?page=all';
						
						else
						{
							var nodeBody = node.querySelector('.entryBody');
							
							if (nodeBody)
							{
								if (node.innerHTML.indexOf('nyaa.si') > -1)
								{
									var URLElement = node.querySelector('a[href*="nyaa.si"]');

									if (URLElement)
									{
										var newLink = '';

										if (URLElement.href.indexOf('download') > -1)
										{
											newLink = URLElement.href.replace(/download/g, 'view');
											newLink = newLink.replace(/\.torrent/g, '');
										}

										else
										newLink = URLElement.href.replace(/\/torrent/g, '');

										nodeBody.innerHTML += '<br />View: <a class="underlink bluelink" target="_blank" href="'+newLink+'">'+newLink+'</a>';
									}
								}
								
								else if (node.innerHTML.indexOf('anidex.info') > -1)
								nodeBody.innerHTML += getViewURL(node, 'anidex.info', /\/dl\//g, '/?page=torrent&id=');    
								
								//else if (node.innerHTML.indexOf('anidex.moe') > -1)
								//nodeBody.innerHTML += getViewURL(node, 'anidex.moe', /anidex.moe\/dl\//g, 'anidex.info/?page=torrent&id=');
								
								else if (node.innerHTML.indexOf('tokyotosho.info') > -1)
								node.innerHTML = node.innerHTML.replace(/(?![^<]*>|[^<>]*<\/)((https?:)\/\/[a-z0-9&#=;.\/\-?_]+)/gi, '<a href="$1">$1</a> ');
							}
						}
                    }
                }
            }
        }
    }
});

linkObserver.observe(document.querySelector('#box'), { 
    childList: true,
    subtree: true
});

function getViewURL(node, domain, pattern, replacement)
{
    var viewURL = '';
    
    if (node.innerHTML.indexOf(domain) > -1)
    {
        var URLElement = node.querySelector('a[href*="'+domain+'"]');
        
        if (URLElement)
        {
            if (URLElement.href.indexOf('magnet:') < 0)
            {
                var newLink = URLElement.href.replace(pattern, replacement);
                viewURL = '<br />View: <a class="underlink bluelink" target="_blank" href="'+newLink+'">'+newLink+'</a>';
            }
        }
    }
    
    return viewURL;
}
