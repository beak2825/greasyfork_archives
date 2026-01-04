// ==UserScript==
// @name            ruNews Printable page
// @namespace       PSV_TMS
// @version         0.12.20
// @description     Clean URL from unncessessary parts (utm_*, etc), and dropping url to printable versions, if possible
// @author          PSV
// @match           *://*/*
// @icon            data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0ODIuNSA0ODIuNSI+PHBhdGggZD0iTTM5OS4yNSA5OC45aC0xMi40VjcxLjNjMC0zOS4zLTMyLTcxLjMtNzEuMy03MS4zaC0xNDkuN2MtMzkuMyAwLTcxLjMgMzItNzEuMyA3MS4zdjI3LjZoLTExLjNjLTM5LjMgMC03MS4zIDMyLTcxLjMgNzEuM3YxMTVjMCAzOS4zIDMyIDcxLjMgNzEuMyA3MS4zaDExLjJ2OTAuNGMwIDE5LjYgMTYgMzUuNiAzNS42IDM1LjZoMjIxLjFjMTkuNiAwIDM1LjYtMTYgMzUuNi0zNS42di05MC40aDEyLjVjMzkuMyAwIDcxLjMtMzIgNzEuMy03MS4zdi0xMTVjMC0zOS4zLTMyLTcxLjMtNzEuMy03MS4zem0tMjc3LjgtMjcuNmMwLTI0LjQgMTkuOS00NC4zIDQ0LjMtNDQuM2gxNDkuNmMyNC40IDAgNDQuMyAxOS45IDQ0LjMgNDQuM3YyNy42aC0yMzguMlY3MS4zem0yMzguMyAzNzUuOGMwIDQuNy0zLjkgOC42LTguNiA4LjZoLTIyMS4xYy00LjcgMC04LjYtMy45LTguNi04LjZWMjk4aDIzOC4zdjE0OS4xem04My44LTE2MS44YzAgMjQuNC0xOS45IDQ0LjMtNDQuMyA0NC4zaC0xMi40VjI5OGgxNy44YzcuNSAwIDEzLjUtNiAxMy41LTEzLjVzLTYtMTMuNS0xMy41LTEzLjVoLTMzMGMtNy41IDAtMTMuNSA2LTEzLjUgMTMuNXM2IDEzLjUgMTMuNSAxMy41aDE5Ljl2MzEuNmgtMTEuM2MtMjQuNCAwLTQ0LjMtMTkuOS00NC4zLTQ0LjN2LTExNWMwLTI0LjQgMTkuOS00NC4zIDQ0LjMtNDQuM2gzMTZjMjQuNCAwIDQ0LjMgMTkuOSA0NC4zIDQ0LjN2MTE1eiIvPjxwYXRoIGQ9Ik0xNTQuMTUgMzY0LjRoMTcxLjljNy41IDAgMTMuNS02IDEzLjUtMTMuNXMtNi0xMy41LTEzLjUtMTMuNWgtMTcxLjljLTcuNSAwLTEzLjUgNi0xMy41IDEzLjVzNi4xIDEzLjUgMTMuNSAxMy41em0xNzMgMjguMmgtMTcyYy03LjUgMC0xMy41IDYtMTMuNSAxMy41czYgMTMuNSAxMy41IDEzLjVoMTcxLjljNy41IDAgMTMuNS02IDEzLjUtMTMuNXMtNi0xMy41LTEzLjQtMTMuNXptNzEuOC0yNDAuN2gtMjcuNGMtNy41IDAtMTMuNSA2LTEzLjUgMTMuNXM2IDEzLjUgMTMuNSAxMy41aDI3LjRjNy41IDAgMTMuNS02IDEzLjUtMTMuNXMtNi0xMy41LTEzLjUtMTMuNXoiLz48L3N2Zz4=
// @homepage        https://greasyfork.org/ru/scripts/460304-runews-printable-page
// @source          https://github.com/PhantomCity/GS/blob/master/ruNewsPrintable/ruNewsPrintable.user.js
// @supportURL		https://greasyfork.org/ru/scripts/460304-runews-printable-page/feedback
// @run-at          document-start
// @grant           none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/460304/ruNews%20Printable%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/460304/ruNews%20Printable%20page.meta.js
// ==/UserScript==

/*
0.12.20             Added ndn.info source;
0.11.19             Added v102 source;
0.10.18             Added noframes command;
0.10.17             Changed RunAt property
0.10.16             Added git Source page

*/

let domMap = {};


domMap["www.kommersant.ru"] = {
    "Title":"kommersant",
    "Function": redirPath,
    "Param":{
        "Source": /\S*kommersant\.ru\/doc\/(\d+)\S*/,
        "Target": 'https://kommersant.ru/amp/$UID/'
    }
};


domMap["fedpress.ru"] = {
    "Title":"fedpress",
    "Function": redirPath,
    "Param":{
        "Source": /\S*fedpress\.ru\/news\/[\w-]+\/[\w-]+\/(\d+)\??\S*/,
        "Target": 'https://fedpress.ru/print?id=$UID'
    }
};


domMap["www.fontanka.ru"] = {
    "Title":"fontanka",
    "Function": redirPath,
    "Param":{
        "Source": /\S*fontanka\.ru\/(\d{4}\/\d{2}\/\d{2}\/\d+)\/(?!print|all\.comments)\S*/,
        "Target": 'https://www.fontanka.ru/$UID/print.html/'
    }
};


domMap["govoritmoskva.ru"] = {
    "Title":"govoritmoskva",
    "Function": redirPath,
    "Param":{
        "Source": /\S*govoritmoskva\.ru\/news\/(\d+)\/\S*/,
        "Target": 'https://govoritmoskva.ru/news/$UID/?print=1'
    }
};


domMap["realnoevremya.ru"] = {
    "Title":"realnoevremya",
    "Function": redirPath,
    "Param":{
        "Source": /\S*realnoevremya\.ru\/news\/(\d+)\-\S*/,
        "Target": 'https://realnoevremya.ru/news/$UID/print'
    }
};


domMap["www.klerk.ru"] = {
    "Title":"klerk",
    "Function": redirPath,
    "Param":{
        "Source": /\S*klerk\.ru\/\S*\/(\d+)\//,
        "Target": 'https://www.klerk.ru/print/$UID/'
    }
};


domMap["www.infox.ru"] = {
    "Title":"infox",
    "Function": redirPath,
    "Param":{
        "Source": /\S*infox\.ru\/news\/(\d+\/[\w-]+)/,
        "Target": 'https://www.infox.ru/news/$UID/print'
    }
};


domMap["www.trud.ru"] = {
    "Title":"trud",
    "Function": redirPath,
    "Param":{
        "Source": /\S*trud\.ru\/article\/(\S*).html([?]\S*)?/,
        "Target": 'https://www.trud.ru/article/$UID/print/'
    }
};


domMap["www.evening-kazan.ru"] = {
    "Title":"evening-kazan",
    "Function": redirPath,
    "Param":{
        "Source": /\S*evening-kazan\.ru\/news\/(\S*.html)([?#]\S*)?/,
        "Target": 'https://www.evening-kazan.ru/print/news/$UID'
    }
};


domMap["dddkursk.ru"] = {
    "Title":"dddkursk",
    "Function": redirPath,
    "Param":{
        "Source": /\S*dddkursk\.ru\/lenta\/(\w+\/\w+\/\w+\/\w+)\/(?!print)\S*/,
        "Target": 'https://dddkursk.ru/lenta/$UID/print/'
    }
};

domMap["v102.ru"] = {
    "Title":"v102",
    "Function": redirPath,
    "Param":{
        "Source": /\S*v102\.ru\/news\/(\d*.html)([?#]\S*)?/,
        "Target": 'https://v102.ru/print/$UID'
    }
};


domMap["ndn.info"] = {
    "Title":"ndn.info",
    "Function": redirPath,
    "Param":{
        "Source": /\S*ndn\.info\/novosti\/(\d+-\S+)\/(?!\??print=)\S*/,
        "Target": 'https://ndn.info/novosti/$UID/?print=print'
    }
};



// https://dddkursk.ru/lenta/2023/02/17/095012/
// https://dddkursk.ru/lenta/2023/02/17/095012/print/



function redirPath(sourceUrl, Rule)
{
    const re = new RegExp(Rule.Source, "gi");
    let found = re.exec(sourceUrl);
    console.log(JSON.stringify( found ));

    let ret = sourceUrl;
    if (found)
    {
        console.log("UID :" + found[1]);

        ret = Rule.Target.replace('$UID', found[1]);
        return ret;
    }
    return false;
}



//https://stackoverflow.com/a/46893240/3419904
let encodeDataToURL = (data) => {
    return Object
        .keys(data)
        .map(value => `${value}=${encodeURIComponent(data[value])}`)
        .join('&');
}


function preClearUTM(url)
{
    let newUrl = new URL(url);
    const searchParams = new URLSearchParams(url.search.toString());

    let cleanParamList = {'utm_medium':"", 'utm_source':"", 'utm_campaign':"", "utm_referrer":"", "from":"ya_news"};
    let cleanParamLKeys = Object.keys(cleanParamList);

    let cleaner = {};
    let srcParams = {};
    for (const [key, value] of searchParams.entries())
    {
        srcParams[key] = value;
        if ( cleanParamLKeys.indexOf(key) != -1 )
        {
           console.log('Clean, param found: ' + key);
           console.log('Clean, value: "' + cleanParamList[key] +'"');

            if (cleanParamList[key] == '')
            {
                continue;
            }

            if (cleanParamList[key] == value)
            {
                continue;
                cleaner[key] = value;
            }
        }
        cleaner[key] = value;
    }

    console.log('Src: ' + JSON.stringify(srcParams));
    console.log('cleaner: '+JSON.stringify(cleaner));

    if (Object.keys(srcParams).join(',') != Object.keys(cleaner).join(','))
    {
        newUrl.search = encodeDataToURL(cleaner);
        console.log('replace: ' + JSON.stringify(newUrl));
    }

    //console.log(`${key}, ${value}`);
    return newUrl.toString();
}

function useRule()
{

}

function WorkOnURL()
{
    console.log("P-Da: urlSimplifier here");

    let url = preClearUTM( document.location );

    let idx = Object.keys(domMap).indexOf(document.location.host);
    if (idx != -1 )
    {
        let profile = domMap[document.location.host];
        console.log("doing:");
        console.log(JSON.stringify(profile));

        let redir = profile.Function(url , profile.Param);
        console.log("Gone:" + redir);
        if ((redir!== false) &&( redir != url))
        {
            console.log("acting to :" + redir);
            document.location.href = redir;
        }
    }
    else if (url != document.location.toString() )
    {
        console.log("acting to :" + (url));
        document.location.href = (url);
    }
}

function findOurHrefs()
{
    let allLinks = document.getElementsByTagName('a');

    for (const aLink of allLinks)
    {
        aLink.addEventListener('contextmenu', function (e){
            //document.body.innerHTML += '<p>Right-click is disabled</p>'
            if (e.ctrlKey)
            {
                e.preventDefault();
                alert(e.target.href);
            }
        }, false);
    }
}

(function()
 {
    'use strict';

    // Your code here...

    window.addEventListener('load', (event) => {
        findOurHrefs();
        //WorkOnURL();
    });

    WorkOnURL();

})();
