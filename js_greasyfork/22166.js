// ==UserScript==
// @name         Anime on AP
// @description  Quickly search for anime thru ap
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       SentientCrab
// @include      htt*://www.anime-planet.com/anime/*
// @exclude      htt*://www.anime-planet.com/anime/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22166/Anime%20on%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/22166/Anime%20on%20AP.meta.js
// ==/UserScript==

function findFirstDescendant(parent, tagname)
{
   parent = document.getElementById(parent);
   var descendants = parent.getElementsByTagName(tagname);
   if ( descendants.length )
      return descendants[0];
   return null;
}

function findFirstDescendant2(parent, tagname)
{
   parent = document.getElementsByClassName(parent)[0];
   var descendants = parent.getElementsByTagName(tagname);
   if ( descendants.length )
      return descendants[0];
   return null;
}


(function() {
    var header = findFirstDescendant("siteContainer", "h1");
    var anime_enc=header.innerHTML;
    var years=findFirstDescendant2("iconYear", "a");
    var year=years.innerHTML;
    var subNav=document.getElementsByClassName("subNav2")[0];
    var link = '<li><a target="_blank" title="Search '+anime_enc+' ('+year+') on animebytes.tv" href="http://animebytes.tv/torrents.php?searchstr=' + anime_enc+ '&year=' + year + '"><img src=data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAACMuAAAjLgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAIbhcwCG5PMAhuejAIbncwCG5LMAhuLDAIbk8wCG56MAhuhzAIbocwCG6HMAhuhzAIbnowCG5PMAhuFwAAAAAwCG5PMAhu0DAIbvowCG76MAhu0TAIbpkwCG7UMAhu+zAIbv4wCG7+MAhu/jAIbv4wCG77MAhu2jAIbnMwCG4WMAhueTAIbvptFe3/axXp/zAIb/8wCG7zPQuJ/20V7P9tFe3/bRXt/20V7f9tFe3/bRXt/z0LiP8wCG7YMAhuTTAIbnQwCG74bBvk/3Ec7f9HD5r/MAhu/0MOk/9xHO3/cBzs/1gUvP9SErD/YxjR/3Ec7f9vHOr/MAhu+jAIbnkwCG5PMAhu31EWqv92Je3/diXt/3Yl7f92Je3/diXt/2og2P8wCG7/MAhu/zAIbv92Je3/diXt/zAIbvswCG59MAhuITAIbqk+D4X+ey7r/3su6/98L+3/dizj/3wv7f9xKdr/MAhu/1AYo/9wKdr/fC/t/2Miw/8wCG7qMAhuXTAIbgYwCG5nMAhu7GUowf+COe3/WSGu/zAIbv+BOOz/dTLa/z8Rhf+AOOr/gjnt/3kz3/8wCG7/MAhuzzAIbkEAAAAAMAhuLjAIbrtIGJH/h0Lt/1Adnf8wCG7/hUDq/3w73f8wCG7/MAhu/3I0z/+HQu3/Xyiz/zAIbuEwCG5SAAAAADAIbgowCG55MAhu9Xk90/+MS+3/aDG8/4tK6/+DReH/RxmO/zEJb/9ZJqb/jEvt/4ZG5P8wCG7zMAhuaAAAAAAAAAAAMAhuQzAIbtVXJqH/kFPt/5BT7f+QU+3/kFPt/5BT7f+QU+3/kFPt/5BT7f9oNLj/MAhu4zAIblQAAAAAAAAAADAIbh8wCG6kRRmJ/pBV6P+UWO3/lFjt/5RY7f+UWO3/lFjt/5RY7f+UWO3/RhmJ/jAIbq4wCG4mAAAAAAAAAAAwCG4IMAhuWjAIbtAwCG76MAhu/jAIbv4wCG7+MAhu/jAIbv4wCG7+MAhu+zAIbtQwCG5cMAhuCAAAAAAAAAAAAAAAADAIbhYwCG5LMAhudzAIboYwCG6HMAhuhzAIbocwCG6HMAhuhzAIbnowCG5PMAhuFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAD/DwAAgAMAAIABAACAAQAAgAEAAIABAADAAQAAwAEAAOABAADgAQAA4AEAAPADAAD8DwAA//8AAA==></a>';
/*nyaa*/    link += '</li><li> <a target="_blank" title="Search '+anime_enc+' ('+year+') on nyaa.se" href="https://nyaa.si/?f=0&c=0_0&q=' + anime_enc + '"><img src=data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACLPAb/tY5w/7ebhP+3m4T/t5uD/7ODXP+3m4T/t5uD/7WSdP+3m4T/t5Z7/7SHX/+1jWn/r3NC/69hF/+NSxT/p0sO//K7lf/////////////////3y6n//O3g/////v/65ND//vn1///////86tf/+96//+2dVv/tiCb/tWsa/6lSDf/mhj3//vn2///+/v/4zq7/851Z//OQQP/6z6v/+97D//3x5f/99/D//O/i//zq1f/91qf/8Ktq/7JsI/+pUg3/4mwR/+mTUf/mhDn/4nQh/+Z5Jv/leyn/534p/+yMPv/62r3/+86e//vkyf/73br///r1//79/P+2iFj/qVIN/+JsEf/ibBH/4mwR/+N1IP/jcBf/4m4V/+iHOP/phDH/8qln///48f/+9+////v2//737P//////tZRz/6lSDf/ibBH/4mwR/+JsEf/jdSD/4m0S/+FvF//ofin/84on//qxZf////////////////////////7+/7aMWP+oVBH/4m0T/+JsEf/ibBH/4m0T/+JtEv/mfiv/4m0T//SEG//+q03////////////+9+3///v1///+/f+1kF//qFUT/+V6KP/jcBj/4mwR/+JsEf/ibBH/43AW/+N0Hv/tlEP//psk//7z5f/8xXb//N6y//3Mff/+8tP/tph3/6pVFP/oeCP/7XQV/+RyG//ibBH/4mwR/+FtFP/jcxr/76dk//ylOP/9v2v/+sBt//vRk//85rj//tM9/7eRRf+tUQf/7nER//B2EP/tehv/43Yf/+JsEf/ibBH/4mwR/+mFLf/9rkP//6Uk//zFdf/847b//vbd//3iVP+3kCD/sFEE//JwAP/1cgD/9ngF//p8Bv/tgiP/4mwS/+JsEf/siyz//rRN//+nKP/+tDz//cpK//7mg//+7WX/t5Qj/7FTBP/0cgD/9nYA//l5AP/8fwD//okK/+6EIv/jcBf/74wl//2uO//+s0H//700///TNv//4zn///A//7eYJP+rVQ3/6nUT//J8E//4fQb//oUD//+NCP//lRD//Zwe//mhKf/+qSz//7Y2///MNf//3jn//+w9///3QP+3myX/qVcV/+R3Iv/jcBb/4m0T/+NzGv/ofB3/9pMf//+iH///qCj//7Ax//7NWP/93Ez//+c6///zPv/+/UL/tJsn/6tbGv/ibRL/4mwR/+JsEf/ibBH/4mwR/+JtEv/rhyj/8505//u3OP/5yVP/871L/++tLP/zyDf/9+9E/6+EI/+NSA//qVQR/6lSDf+pUg3/qVIN/6lSDf+pUg3/qVIN/6pZFf+rXRj/toks/65uLP+pUg3/qVIN/6lUD/+MRAr/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==></a>';
/*baka*/    link +='</li><li> <a target="_blank" title="Search '+anime_enc+' ('+year+') on baka.bt" href="https://bakabt.me/browse.php?only=0&hentai=1&incomplete=1&lossless=1&hd=1&multiaudio=1&bonus=1&c1=1&c2=1&c5=1&c8=1&reorder=1&q=' + anime_enc + '"><img src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAABnRSTlMA/wD/AP83WBt9AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABH0lEQVR4nGP8//8/AymAiSTVDAwMLGj8PSUlaCIuPT3IXEa4kyBKbTML0DQcnj4BWRtUw56SEkylaNogephwqf74+TMywzazAOIE7J7++Plzfn3Vx8+f4QyE3O7i4h93HsPRtwvXv52+9P3yrR93Hkf4Bbw8f+3l+WsRfgE/7jz+fvnW7uJilFD69/79n6eP/335wiQgyCqvgCz19+2bv8+eMaAF678f3/99/Pj/799/H97/F5eY2NjGz8vLwMAwsbHt3+tXf9+/Q/cDEwcnEx8/Ixsbk4AgAysrRDUDAwMfJycjJycTFxe6DUyCgiysrAy/fzOwsjLx8MDFGVlYmAUEGdnYGE4fY/z//z/BSIAASFQgIo6gBkjEMdI8tQIAXqGRwXIuXhcAAAAASUVORK5CYII=></a></li>';
    subNav.innerHTML+=link;
})();