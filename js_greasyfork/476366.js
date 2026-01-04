// ==UserScript==
// @name			Ancestry.com Additional Hint Categories
// @description		Adds additional hint category filters based on card catalog database ID
// @author			Ira Pearson
// @version			1.0.3
// @match			https://*.ancestry.com/hints/tree/285440/*
// @icon			https://www.google.com/s2/favicons?sz=64&domain=ancestry.com
// @license         MIT
// @namespace https://greasyfork.org/users/1183973
// @downloadURL https://update.greasyfork.org/scripts/476366/Ancestrycom%20Additional%20Hint%20Categories.user.js
// @updateURL https://update.greasyfork.org/scripts/476366/Ancestrycom%20Additional%20Hint%20Categories.meta.js
// ==/UserScript==

const dbid = [
  {name: '1940 U.S. Census',    short: 'hintscensus1940', id: 2442},
  {name: '1930 U.S. Census',    short: 'hintscensus1930', id: 6224},
  {name: '1920 U.S. Census',    short: 'hintscensus1920', id: 6061},
  {name: '1910 U.S. Census',    short: 'hintscensus1910', id: 7884},
  {name: '1900 U.S. Census',    short: 'hintscensus1900', id: 7602},
  {name: '1880 U.S. Census',    short: 'hintscensus1880', id: 6742},
  {name: '1870 U.S. Census',    short: 'hintscensus1870', id: 7163},
  {name: '1860 U.S. Census',    short: 'hintscensus1860', id: 7667},
  {name: '1850 U.S. Census',    short: 'hintscensus1850', id: 8054},
  {name: '1840 U.S. Census',    short: 'hintscensus1840', id: 8057},
  {name: '1830 U.S. Census',    short: 'hintscensus1830', id: 8058},
  {name: '1820 U.S. Census',    short: 'hintscensus1820', id: 7734},
  {name: '1810 U.S. Census',    short: 'hintscensus1810', id: 7613},
  {name: '1800 U.S. Census',    short: 'hintscensus1800', id: 7590},
  {name: '1790 U.S. Census',    short: 'hintscensus1790', id: 5058},
  {name: 'Yearbooks',           short: 'hintsyearbooks', id: 1265},
  {name: 'Indiana Marriages',   short: 'hintsmarriagesin', id: 61009},
  {name: 'Indiana Deaths',      short: 'hintsdeathsin', id: 60716},
  {name: 'Indiana Births',      short: 'hintsbirthsin', id: 60871},
  {name: 'WWII Draft Cards',    short: 'hintswwiidraft', id: 2238},
  {name: 'WWI Draft Cards',     short: 'hintswwidraft', id: 6482},
  {name: 'Family Histories',    short: 'hintshistories', id: 61157},
  
];

let finished = false;

document.addEventListener("DOMNodeInserted", function(event) {

    if(!finished && event?.target?.classList?.contains('allHintsNavItem')) {
        
        const nav1 = document.getElementById('allHintsNav');
        
        if(nav1) {
            
            finished = true;
         	
         	const nav2 = document.createElement('div');
         	nav2.className = 'tabs tabsVertical tabs480 allHintsNav';
         	nav2.id = 'customHintsNav';
         	nav2.role = 'tablist';
         	nav2.setAttribute('data-tab', 'vertical-tabs');
         	nav2.setAttribute('aria-orientation', 'vertical');
         	nav2.style.marginTop = '10px';
            
            nav1.after(nav2);
            
         	for(let btn of dbid) {
                
                nav2.innerHTML += ('<button role="tab" class="tab textNoWrap allHintsNavItem" tabindex="-1" title="Show only '
                    + btn.name + ' hints" onclick="location.href=\'/hints/tree/285440/hints?hf=record&hs=recent&hdbid='
                    + btn.id + '\'" aria-controls="hints-contents" aria-selected="false" aria-expanded="false" id="'
                    + btn.short + '"><span aria-hidden="true" class="icon iconDocument"></span><span id="activeTabLabel">'
                    + btn.name + '</span></button>');
                
         	}
            
        }
        
    }

}, false);
