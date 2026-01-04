// ==UserScript==
// @name         Amazon.com LibGen integration
// @namespace    https://greasyfork.org/en/users/221281-klaufir
// @version      2.0.22
// @description  Library Genesis ISBN search links for Amazon.com book pages
// @license      MIT
// @author       klaufir
// @match        https://www.amazon.com/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406924/Amazoncom%20LibGen%20integration.user.js
// @updateURL https://update.greasyfork.org/scripts/406924/Amazoncom%20LibGen%20integration.meta.js
// ==/UserScript==

(function() {
    console.log('----- Amazon.com LibGen integration  -----')

    var LIBGEN_ICON = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4gPHN2ZyB2ZXJzaW9uPSIxLjEi" +
          "IGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhs" +
          "aW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0Jv" +
          "eD0iMCAwIDU3OCA4MTQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU3OCA4MTQ7" +
          "IiB4bWw6c3BhY2U9InByZXNlcnZlIj48c3R5bGUgdHlwZT0idGV4dC9jc3MiPiAuc3Qwe2ZpbGw6" +
          "IzBBNDM4Njt9PC9zdHlsZT48Zz4gPHBhdGggY2xhc3M9InN0MCIgZD0iTTQ0Mi4xNzcwMDIsNjE3" +
          "LjA1NjM5NmM0NC42OTk1ODUsMTEuMzcxMzk5LDUwLjI2Mjk3LDExMC4zMDUxNzYtMTAuOTMwNzI1" +
          "LDE2NS4zNjEwODQgYy0yOS4yMDA5ODksMjYuMjcyMTU2LTc3LjkyNTM4NSwyOC4wNDAyMjItMTQx" +
          "LjEzMDE1NywzMC43MTc0MDdjLTE4Mi45MDkyNzEsNy43NDc0MzctMTcwLjA2ODA2OS01NC4wMjE2" +
          "MDYtMTcwLjA2ODA2OS04OS4wMzU2NDUgczIyLjAwODgwNC0zNS4wMTQwMzgsMjIuMDA4ODA0LTM1" +
          "LjAxNDAzOEMzNzYuMTUwNTc0LDY5MC4wODU2MzIsNDQyLjE3NzAwMiw2MTcuMDU2Mzk2LDQ0Mi4x" +
          "NzcwMDIsNjE3LjA1NjM5NnoiLz4gPHBhdGggY2xhc3M9InN0MCIgZD0iTTE1OC44NTY5NzksMzQw" +
          "Ljg4OTQwNGM2OC4zOTAyODktOS45MjkwNDcsMTQ2LjE1MTkwMS0xNC45NDk1MjQsMjMyLjI5OTU3" +
          "Ni0xNC45NDk1MjQgYzI2LjUwMDI0NCwwLDQ5LjI1NTkyLDAuNjYzMTQ3LDY5LjA1ODM1LDIuMDcw" +
          "MzQzYzIzLjEwMDAwNi0yMi4zODQ2NDQsMjYuOTY2NDkyLTYyLjQ5Nzc0MiwyNi45NjY0OTItODYu" +
          "MTU4MDM1IGMwLTI4LjAxMTItMjMuNTkwNDU0LTgyLjk3OTE4Ny0xNTMuMDQ3NjM4LTgyLjk3OTE4" +
          "N2MtMjE3LjI3NjE4NCwwLTI4MS41MDQ2NjksMzQuMDEzNjExLTI4MS41MDQ2NjksMzQuMDEzNjEx" +
          "IEMxMDguMTY3OTMxLDIyNi43NzY1ODEsMTQ3LjAyODY0MSwzMTIuMjE5NDIxLDE1OC44NTY5Nzks" +
          "MzQwLjg4OTQwNHoiLz4gPHBhdGggY2xhc3M9InN0MCIgZD0iTTAsNDMzLjk4MzEyNGMwLDAsMTA0" +
          "LjA0MTY0MS01OC4wMjMyMjQsMzkxLjE1NjU1NS01OC4wMjMyMjQgYzEyOC4wMjI4ODgsMCwxNjIu" +
          "OTg2MjA2LDE1Ljc2NDA5OSwxNzkuNzE1MzMyLDU4Ljk4MTE3MWMxNy43MjMxNDUsNDUuNzg0NzI5" +
          "LDIuMzU3NTQ0LDEzNi4wOTY4OTMtNDUuNjYxNjgyLDE1OS4xMDYxMSBjMCwwLDEuMDAwNDI3LTE3" +
          "LjAwNjc3NS0xMDQuMDQxNjI2LTE3LjAwNjc3NXMtMjY2LjEwNjUwNiw1OC4wMjMxOTMtMjY2LjEw" +
          "NjUwNiw1OC4wMjMxOTNTOTQuMDM3NjQzLDQ3MS45OTgzMjIsMCw0MzMuOTgzMTI0eiIvPiA8cGF0" +
          "aCBjbGFzcz0ic3QwIiBkPSJNMjA1LjY0NDgwNiwxMTMuMzgwMTE5YzM4LjgwMTM2MS0zLjAxMDcy" +
          "Nyw4MS43MjA4MjUtNC41MjcxNDUsMTI4LjQ4ODk1My00LjUyNzE0NSBjMjIuNTMzNzIyLDAsNDMu" +
          "MzQxOTE5LDEuNTQyMTgzLDYyLjM5NDY1Myw0LjU5Mjc4MWMtNC4zODgzNjctMjEuMjEyMTY2LTE0" +
          "LjA2MzY5LTUxLjg4NzU4OS0zNS4zODM4NS04MS42MjM2MTEgQzMwNy44MzA2MjcsMTEuNzIxNDQ1" +
          "LDE5Ny42MzI5OTYtMTQuNTYzMzA3LDE0NS4wNTgwNiw5LjgxMzMzM0MxNDUuMDU4MDYsOS44MTMz" +
          "MzMsMTg3Ljc4NTY3NSw0Ni4xMDgxMzUsMjA1LjY0NDgwNiwxMTMuMzgwMTE5eiIgLz48L2c+PC9z" +
          "dmc+";

    // add string.format polyfill
    String.prototype.dformat = function() {
        var args = arguments;
        var dict = args[0];
        return this.replace(/{(\w+)}/g, function(match, key) {
            return encodeURIComponent(dict[key]);
        });
    };

    String.prototype.dkeys = function() {
        return this.matchAll(/{(\w+)}/g).map(e => e[1]).toArray();
    };

    var search_engines = {
      /*
        'libgen.rs (sci-tech)': {
          'Author + Title': "https://libgen.rs/search.php?req={author}%20{title}&open=0&res=25&view=simple&phrase=1&column=def",
          'Title': "https://libgen.rs/search.php?req={title}&open=0&res=25&view=simple&phrase=1&column=title",
          'Author': "https://libgen.rs/search.php?req={author}&open=0&res=25&view=simple&phrase=1&column=author",
          'ISBN-10': 'https://libgen.rs/search.php?req={isbn10}5&open=0&res=25&view=simple&phrase=1&column=identifier',
          'ISBN-13': 'https://libgen.rs/search.php?req={isbn13}&open=0&res=25&view=simple&phrase=1&column=identifier'
        },
        'libgen.rs (fiction)': {
          'Author + Title': "https://libgen.rs/fiction/?q={author}%20{title}",
          'Title': "https://libgen.rs/fiction/?q={title}",
          'Author': "https://libgen.rs/fiction/?q={author}"
        },
        */
        'libgen.li': {
            'Author + Title': "https://libgen.li/index.php?req={author}%20{title}&columns%5B%5D=t&columns%5B%5D=a&objects%5B%5D=f&objects%5B%5D=e&objects%5B%5D=s&objects%5B%5D=a&objects%5B%5D=p&objects%5B%5D=w&topics%5B%5D=l&topics%5B%5D=c&topics%5B%5D=f&topics%5B%5D=a&topics%5B%5D=m&topics%5B%5D=r&topics%5B%5D=s&res=100&filesuns=all",
            'Title': 'https://libgen.li/index.php?req={title}&columns%5B%5D=t&objects%5B%5D=f&objects%5B%5D=e&objects%5B%5D=s&objects%5B%5D=a&objects%5B%5D=p&objects%5B%5D=w&topics%5B%5D=l&topics%5B%5D=c&topics%5B%5D=f&topics%5B%5D=a&topics%5B%5D=m&topics%5B%5D=r&topics%5B%5D=s&res=100&filesuns=all',
            'Author': 'https://libgen.li/index.php?req={author}&columns%5B%5D=a&objects%5B%5D=f&objects%5B%5D=e&objects%5B%5D=s&objects%5B%5D=a&objects%5B%5D=p&objects%5B%5D=w&topics%5B%5D=l&topics%5B%5D=c&topics%5B%5D=f&topics%5B%5D=a&topics%5B%5D=m&topics%5B%5D=r&topics%5B%5D=s&res=100&filesuns=all',
            'ISBN-10': 'https://libgen.li/index.php?req={isbn10}&columns%5B%5D=i&objects%5B%5D=f&objects%5B%5D=e&objects%5B%5D=s&objects%5B%5D=a&objects%5B%5D=p&objects%5B%5D=w&topics%5B%5D=l&topics%5B%5D=c&topics%5B%5D=f&topics%5B%5D=a&topics%5B%5D=m&topics%5B%5D=r&topics%5B%5D=s&res=100&filesuns=all',
            'ISBN-13': 'https://libgen.li/index.php?req={isbn13}&columns%5B%5D=i&objects%5B%5D=f&objects%5B%5D=e&objects%5B%5D=s&objects%5B%5D=a&objects%5B%5D=p&objects%5B%5D=w&topics%5B%5D=l&topics%5B%5D=c&topics%5B%5D=f&topics%5B%5D=a&topics%5B%5D=m&topics%5B%5D=r&topics%5B%5D=s&res=100&filesuns=all'        },
        'Z-Library': {
            'Author + Title': "https://en.z-library.sk/s/{author}%20{title}",
            'Title': "https://en.z-library.sk/s/{title}",
            'Author': "https://en.z-library.sk/s/{author}",
            'ISBN-10': 'https://en.z-library.sk/s/{isbn10}',
            'ISBN-13': 'https://en.z-library.sk/s/{isbn13}'
        },
        "Anna's Archive": {
            'Author + Title': 'https://annas-archive.org/search?q={author}%20{title}',
            'Title': 'https://annas-archive.org/search?q={title}',
            'Author': 'https://annas-archive.org/search?q={author}',
            'ISBN-10': 'https://annas-archive.org/search?q={isbn10}',
            'ISBN-13': 'https://annas-archive.org/search?q={isbn13}'
        },
        "Liber3": {
          'Author + Title': 'https://liber3.eth.limo/#/search?q={author}%20{title}',
          'Title': 'https://liber3.eth.limo/#/search?q={title}',
          'Author': 'https://liber3.eth.limo/#/search?q={author}'
        }
    }

    // category check

    function getNodeId(aelem) {
        return new URLSearchParams(new URL(aelem?.href ?? "https://_")?.search).get('node');
    }

    function getNodeIds() {
        var nodeIds = Array.from(document.querySelectorAll('div#wayfinding-breadcrumbs_feature_div a')).map(getNodeId);
        var subNavIds = Array.from(document.querySelectorAll('div#nav-subnav a'))?.map(getNodeId)
        if (subNavIds)
            nodeIds = nodeIds.concat(subNavIds);
        return nodeIds.filter(e => e);
    }

    function hasBookCategory() {
        var book_categories = [
            "154606011", "283155",  // www.amazon.com
            "341689031", "266239",  // www.amazon.co.uk
            "530886031", "186606",  // www.amazon.de
            "695398031", "301061",  // www.amazon.fr
            "2980423011", "916520", // www.amazon.ca
            "976389031", "1634753031" // www.amazon.in
        ]
        var nodeids = getNodeIds();
        return new Set(nodeids).intersection(new Set(book_categories)).size > 0;
    }

    function hasBookElements() {
        return (
          document.querySelector('div#nav-progressive-subnav div.celwidget div a')?.getAttribute('data-id') === '/amz-books/store'
          || document.querySelector('span.book_details-fiona_pages')
          || document.querySelector('span.book_details-isbn10')
          || document.querySelector('span.book_details-isbn13')
        ) != null;
    }


    // element getters
    function getTitleElem() {
        return document.getElementById('productTitle') ||
            document.getElementById('title') ||
            document.getElementById('ebooksTitle');
    }

    // data getters
    function getAuthor() {
        var author = Array.from(document.querySelectorAll('span.author a')).map(e => e.innerText).join(', ') ||
            Array.from(document.querySelectorAll('div.authorName')).map(e => e.innerText).join(', ');
        return author;
    }

    function getTitle() {
        var titleElem = getTitleElem();
        return titleElem.innerText.match(new RegExp("([^(\[)]+)"))[0].trim();
    }

    function getISBN10() {
        var result = document.querySelector('div#rpi-attribute-book_details-isbn10 div.rpi-attribute-value span')?.innerHTML
          || Array.from(document.querySelectorAll('span.a-list-item')).filter(e=>e.childElementCount==2).filter(a=>a.children?.[0]?.innerText?.startsWith('ISBN-10')).map(a=>a?.children?.[1]?.innerText)?.[0];
      return result?.replace('-', '');
    }

    function getISBN13() {
        var result = document.querySelector('div#rpi-attribute-book_details-isbn13 div.rpi-attribute-value span')?.innerHTML
            || Array.from(document.querySelectorAll('span.a-list-item')).filter(e=>e.childElementCount==2).filter(a=>a.children?.[0]?.innerText?.startsWith('ISBN-13')).map(a=>a?.children?.[1]?.innerText)?.[0];
        return result?.replace('-', '')
    }

    function getPageData() {
        pageData = {
            'author': getAuthor(),
            'title': getTitle(),
            'isbn10': getISBN10(),
            'isbn13': getISBN13()
        };
        return Object.fromEntries(Object.entries(pageData).filter(([key, value]) => value));
    }

    function createIconElement() {
      var img = document.createElement('img');
      img.setAttribute('src', LIBGEN_ICON);
      img.style.height = '2em';
      return img;
    }

    function createMainDiv() {
        var outerDiv = document.createElement('div');
        outerDiv.className = 'a-size-base';


        if (document.getElementById('dp') && document.getElementById('dp').className.trim() == 'ebooks_mobile') {
            outerDiv.style.margin = '20px';
            document.getElementById('dp').insertBefore(outerDiv, document.getElementsByClassName('a-container')[0]);
        } else {
            outerDiv.style.margin = "5px";
            var title = getTitleElem();
            title.parentNode.prepend(outerDiv);
        }
        outerDiv.style.padding = ".5em";
        outerDiv.style.border = "2px solid rgb(128, 0, 0)";

        var heading_div = document.createElement('div');
        heading_div.style.marginBottom = "1em";
        var heading_span = document.createElement('span');
        heading_span.innerText = "LibGen & alts Search";
        heading_span.style.fontSize = "x-large";
        heading_span.style.marginLeft = "0.25em";
        heading_span.style.verticalAlign = "middle";
        var icon_elem = createIconElement();
        icon_elem.style.verticalAlign = "middle";
        heading_div.appendChild(icon_elem);
        heading_div.appendChild(heading_span)
        outerDiv.appendChild(heading_div);

        return outerDiv;
    }

    function createEngineDiv(outerDiv, engine_id) {
        if (document.getElementById(engine_id)) {
            document.getElementById(engine_id).remove();
        }
        var engineDiv = document.createElement('div');
        engineDiv.style.marginTop = ".4em";
        engineDiv.style.marginBottom = ".4em";
        engineDiv.id = engine_id;
        var b3 = document.createElement('b');
        b3.innerText = engine_id + ": ";
        b3.style.paddingLeft = "5px";
        engineDiv.appendChild(b3);
        outerDiv.appendChild(engineDiv);
    }

    function createLink(href, text) {
        var outerContainer = document.createElement('span');
        var innerContainer = document.createElement('span');
        innerContainer.style.border = "1px solid rgb(127, 127, 127)";
        innerContainer.style.paddingLeft = "5px";
        innerContainer.style.paddingRight = "5px";
        innerContainer.style.lineHeight = '1.5';

        var a = document.createElement('a');
        a.href = href;
        a.innerText = text;
        a.style.whiteSpace = "nowrap";
        innerContainer.appendChild(a);
        outerContainer.appendChild(innerContainer);
        var closingSpaceSpan = document.createElement('span');
        closingSpaceSpan.innerText = ' ';
        outerContainer.appendChild(closingSpaceSpan);
        return outerContainer;
    }

    function addLinkElem(id, elem) {
        document.getElementById(id).appendChild(elem);
    }

    if (!hasBookCategory() && !hasBookElements())
      return;

    var outerMainDiv = createMainDiv();
    var pageData = getPageData();


    var pageDataKeys = new Set(Object.keys(pageData));

    for (let search_engine_name in search_engines) {
        createEngineDiv(outerMainDiv, search_engine_name);
        var rules = search_engines[search_engine_name]
        for (let rule_name in rules) {
            var rule = rules[rule_name];
            if (pageDataKeys.isSupersetOf(new Set(rule.dkeys()))) {
                var link_url = rule.dformat(pageData);
                addLinkElem(search_engine_name, createLink(link_url, rule_name));
            }
        }
    }

    console.log('----- Amazon.com LibGen integration  END -----')
})();
