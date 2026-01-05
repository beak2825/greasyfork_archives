// ==UserScript==
// @name        Inoreader Enchance
// @namespace   https://greasyfork.org/en/users/37676
// @description View URL For Nyaa+Anidex + Fix Scroll
// @match       *://*.inoreader.com/*
// @run-at      document-end
// @version     1.1.8
// @grant       none
// @license     Creative Commons Attribution 4.0 International Public License; http://creativecommons.org/licenses/by/4.0/
// @downloadURL https://update.greasyfork.org/scripts/18703/Inoreader%20Enchance.user.js
// @updateURL https://update.greasyfork.org/scripts/18703/Inoreader%20Enchance.meta.js
// ==/UserScript==

var linkObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        var totalNode = mutation.addedNodes.length;
		var articleURL = '';
		
        for (var i=0; i < totalNode; i++)
        {
            var node = mutation.addedNodes[i];
            
            if (node.nodeType === Node.ELEMENT_NODE)
            {
                if (node.matches('.article_content'))
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
                            
                            node.innerHTML += '<br />View: <a class="underlink bluelink" target="_blank" href="'+newLink+'">'+newLink+'</a>';
                        }
                    }
                    
                    else if (node.innerHTML.indexOf('anidex.info') > -1)
                    node.innerHTML += getViewURL(node, 'anidex.info', /\/dl\//g, '/?page=torrent&id=');    
					
                    //else if (node.innerHTML.indexOf('anidex.moe') > -1)
                    //node.innerHTML += getViewURL(node, 'anidex.moe', /anidex.moe\/dl\//g, 'anidex.info/?page=torrent&id=');
                    
					else if (node.innerHTML.indexOf('tokyotosho.info') > -1)
                    node.innerHTML = node.innerHTML.replace(/(?![^<]*>|[^<>]*<\/)((https?:)\/\/[a-z0-9&#=;.\/\-?_]+)/gi, '<a href="$1">$1</a> ');
				
					if (articleURL)
					node.innerHTML += '<hr /><div><a href="'+articleURL+'" target="_blank">Open</a></div>';
                }
                
				else if (node.matches('.article_title'))
                {
					var titleLink = node.querySelector(".article_title_link");
                    
                    if (titleLink)
                    {
						titleLink.style.fontSize = '21px';
						
						if (titleLink.href.indexOf('kompas.com') > -1)
						titleLink.href += '?page=all';
						
						articleURL = titleLink.href;
                    }
                }
				
                else if (node.matches('#no_more_div')) //fix biar bisa skrol ke bawah kalo pake adblock
                node.innerHTML += '<div style="height: 300px;"></div>';
            }
        }
    });    
});

linkObserver.observe(document.querySelector('#reader_pane'), { 
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
