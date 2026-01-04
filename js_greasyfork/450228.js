// ==UserScript==
// @name         Board Game Geek - One page auction geeklists
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Loads all geeklist items into a single view simmilar to Peyo61's external tool.
// @author       Kempeth @ boardgamegeek
// @match        https://boardgamegeek.com/geeklist/*
// @icon         https://cf.geekdo-static.com/icons/favicon2.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450228/Board%20Game%20Geek%20-%20One%20page%20auction%20geeklists.user.js
// @updateURL https://update.greasyfork.org/scripts/450228/Board%20Game%20Geek%20-%20One%20page%20auction%20geeklists.meta.js
// ==/UserScript==

const FETCHLIMIT = 20000;
const SUBNODE_LIMIT = 1000;

var nodeBtnConvert;
var nodeProgressFull;
var nodeProgressEmpty;
var nodeItemList;

var geeklistid;
var taggedItems = []; // list of ids
var items = []; // data from api
var currentUser = null;

var progressData = { done: 0, total: 0};

(function() {
    'use strict';

    getCurrentUser();

    //console.log('root function');
    UT_extractEndDate();

    init();
})();

function retry(f)
{
    window.setTimeout(f, 500);
}

function init()
{
    var els = document.getElementsByTagName('gg-geeklist-page-ui');
    if (els.length == 0) { retry(init); return; }

    els = els[0].getElementsByTagName('header');
    if (els.length == 0) { retry(init); return; }

    els = els[0].getElementsByTagName('nav');
    if (els.length == 0) { retry(init); return; }

    var el = els[0];
    nodeBtnConvert = document.createElement('button');
    nodeBtnConvert.innerHTML = "One Page Auction";
    nodeBtnConvert.className = "btn btn-warning";
    nodeBtnConvert.onclick = convert;
    el.append(nodeBtnConvert);
}

function getCurrentUser()
{
    fetch('https://boardgamegeek.com/api/users/current')
        .then(response => response.json())
        .then(
        data => {
            if (data.loggedIn && data.userid > 0)
            {
                currentUser = data;
            }
        }
    );
}

function updateProgressUI()
{
    // This should ensure that the values are not changed during the execution of this method
    var copy = progressData;

    var percentage = copy.total > 0 ? (copy.done * 100.0 / copy.total) : 0;
    nodeProgressFull.style.width = percentage + '%';
    nodeProgressEmpty.style.width = (100 - percentage) + '%';
    nodeProgressFull.setAttribute('aria-valuemax', copy.total);
    nodeProgressFull.setAttribute('aria-valuenow', copy.done);
    if (percentage > 50)
    {
        nodeProgressFull.innerHTML = copy.done + ' / ' + copy.total;
        nodeProgressEmpty.innerHTML = '';
    }
    else
    {
        nodeProgressEmpty.innerHTML = copy.done + ' / ' + copy.total;
        nodeProgressFull.innerHTML = '';
    }
}

function setProgress(done, total)
{
    progressData = { done: done, total: total };
}

function setProgressAsync(done, total)
{
    return new Promise(res => {
        setProgress(done, total);
        //    res();
        window.setTimeout(() => {
            res();
        }, 0);
    });
}

function convert()
{
    var els = document.getElementsByTagName('gg-geeklist-page-ui');
    if (els.length == 0) { retry(convert); return; }

    els = els[0].getElementsByTagName('div');
    if (els.length == 0) { retry(convert); return; }

    var footerNav = els[0].getElementsByTagName('nav');
    if (els.length == 0) { retry(convert); return; }
    footerNav = footerNav[footerNav.length - 1];

    els = els[0].getElementsByTagName('header');
    if (els.length == 0) { retry(convert); return; }

    els = els[0].getElementsByTagName('nav');
    if (els.length == 0) { retry(convert); return; }
    var headerNav = els[0];

    els = document.getElementsByTagName('gg-geeklist-items-ui');
    if (els.length == 0) { retry(convert); return; }

    els = els[0].getElementsByTagName('div');
    if (els.length == 0) { retry(convert); return; }
    nodeItemList = els[0];

    // remove header items
    for (var child of headerNav.childNodes)
    {
        if (child.tagName != 'GG-THUMBS-GEEKGOLD-GIVEN' && child.tagName != 'GG-SUBSCRIPTION-BUTTON')
        {
            headerNav.removeChild(child);
        }
    }

    // add header items
    var progress = document.createElement('div');
    progress.className = "progress";
    progress.style.height = "32px";
    progress.style.width = "256px";
    headerNav.appendChild(progress);

    nodeProgressFull = document.createElement('div');
    nodeProgressFull.className = "progress-bar";
    nodeProgressFull.setAttribute('role', 'progressbar');
    nodeProgressFull.setAttribute('aria-valuemin', 0);
    nodeProgressFull.setAttribute('aria-valuemax', 0);
    nodeProgressFull.setAttribute('aria-valuenow', 0);
    nodeProgressFull.style.width = '0%';
    nodeProgressFull.innerHTML = '';
    progress.appendChild(nodeProgressFull);

    nodeProgressEmpty = document.createElement('div');
    nodeProgressEmpty.className = "progress-bar bg-secondary";
    nodeProgressEmpty.setAttribute('role', 'progressbar');
    nodeProgressEmpty.style.width = '100%';
    nodeProgressEmpty.innerHTML = '0 / ???';
    progress.appendChild(nodeProgressEmpty);

    var btn = document.createElement('button');
    btn.innerHTML = "Refresh";
    btn.className = "btn btn-primary";
    headerNav.appendChild(btn);

    // Sort Dropdown
    var ddSort = document.createElement('div');
    ddSort.className = "dropdown";
    headerNav.appendChild(ddSort);

    var ddSortBtn = document.createElement('button');
    ddSortBtn.innerText = "Sort ";
    ddSortBtn.className = "btn btn-secondary dropdown-toggle";
    ddSort.appendChild(ddSortBtn);

    var ddSortList = document.createElement('ul');
    ddSortList.className = "dropdown-menu";
    ddSort.appendChild(ddSortList);

    ddSortBtn.onclick = () => {
        ddSortList.style.display = (ddSortList.style.display == "block") ? "none" : "block";
    };
    ddSortBtn.onblur = () => {
        window.setTimeout(() => {
            ddSortList.style.display = "none";
        }, 200);
    };

    var ddSortPosted = document.createElement('li');
    ddSortPosted.innerHTML = "<button type=\"button\" class=\"dropdown-item\">Posted</button>";
    ddSortPosted.onclick = () => {
        console.log('sorting by default', new Date());
        sortBy('');
    };
    ddSortList.appendChild(ddSortPosted);

    var ddSortName = document.createElement('li');
    ddSortName.innerHTML = "<button type=\"button\" class=\"dropdown-item\">Name</button>";
    ddSortName.onclick = () => {
        console.log('sorting by name', new Date());
        sortBy('name');
    };
    ddSortList.appendChild(ddSortName);

    var ddSortDate = document.createElement('li');
    ddSortDate.innerHTML = "<button type=\"button\" class=\"dropdown-item\">Closing Date</button>";
    ddSortDate.onclick = () => {
        console.log('sorting by closing date', new Date());
        sortBy('closing');
    };
    ddSortList.appendChild(ddSortDate);

    // Filter Dropdown
    var ddFilter = document.createElement('div');
    ddFilter.className = "dropdown";
    headerNav.appendChild(ddFilter);

    var ddFilterBtn = document.createElement('button');
    ddFilterBtn.innerText = "Filter ";
    ddFilterBtn.className = "btn btn-secondary dropdown-toggle";
    ddFilter.appendChild(ddFilterBtn);

    var ddFilterList = document.createElement('ul');
    ddFilterList.className = "dropdown-menu";
    ddFilter.appendChild(ddFilterList);

    ddFilterBtn.onclick = () => {
        ddFilterList.style.display = (ddFilterList.style.display == "block") ? "none" : "block";
    };
    ddFilterBtn.onblur = () => {
        window.setTimeout(() => {
            ddFilterList.style.display = "none";
        }, 200);
    };

    var ddFilterBoardgames = document.createElement('li');
    ddFilterBoardgames.className = "dropdown-item";
    ddFilterBoardgames.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" value=\"\" checked id=\"filterBoardgames\"> " +
      "<label class=\"form-check-label\" for=\"filterBoardgames\">Boardgames</label>";
    ddFilterList.appendChild(ddFilterBoardgames);
    document.getElementById('filterBoardgames').onclick = () => {
        window.setTimeout(() => {
            filterList();
        }, 400);
    };

    var ddFilterExpansions = document.createElement('li');
    ddFilterExpansions.className = "dropdown-item";
    ddFilterExpansions.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" value=\"\" checked id=\"filterExpansions\"> " +
      "<label class=\"form-check-label\" for=\"filterExpansions\">Expansions</label>";
    ddFilterList.appendChild(ddFilterExpansions);
    document.getElementById('filterExpansions').onclick = () => {
        window.setTimeout(() => {
            filterList();
        }, 400);
    };

    var ddFilterDivider = document.createElement('li');
    ddFilterDivider.innerHTML = "<hr class=\"dropdown-divider\">";
    ddFilterList.appendChild(ddFilterDivider);

    var ddFilterUntagged = document.createElement('li');
    ddFilterUntagged.className = "dropdown-item";
    ddFilterUntagged.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" value=\"\" checked id=\"filterUntagged\"> " +
      "<label class=\"form-check-label\" for=\"filterUntagged\">Untagged</label>";
    ddFilterList.appendChild(ddFilterUntagged);
    document.getElementById('filterUntagged').onclick = () => {
        window.setTimeout(() => {
            filterList();
        }, 400);
    };

    var ddFilterTagged = document.createElement('li');
    ddFilterTagged.className = "dropdown-item";
    ddFilterTagged.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" value=\"\" checked id=\"filterTagged\"> " +
      "<label class=\"form-check-label\" for=\"filterTagged\">Tagged</label>";
    ddFilterList.appendChild(ddFilterTagged);
    document.getElementById('filterTagged').onclick = () => {
        window.setTimeout(() => {
            filterList();
        }, 400);
    };

    ddFilterDivider = document.createElement('li');
    ddFilterDivider.innerHTML = "<hr class=\"dropdown-divider\">";
    ddFilterList.appendChild(ddFilterDivider);

    var ddFilterClosed = document.createElement('li');
    ddFilterClosed.className = "dropdown-item";
    ddFilterClosed.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" value=\"\" checked id=\"filterClosed\"> " +
      "<label class=\"form-check-label\" for=\"filterClosed\">Closed</label>";
    ddFilterList.appendChild(ddFilterClosed);
    document.getElementById('filterClosed').onclick = () => {
        window.setTimeout(() => {
            filterList();
        }, 400);
    };

    var ddFilterSold = document.createElement('li');
    ddFilterSold.className = "dropdown-item";
    ddFilterSold.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" value=\"\" checked id=\"filterSold\"> " +
      "<label class=\"form-check-label\" for=\"filterSold\">Sold</label>";
    ddFilterList.appendChild(ddFilterSold);
    document.getElementById('filterSold').onclick = () => {
        window.setTimeout(() => {
            filterList();
        }, 400);
    };

    var ddFilterNotSold = document.createElement('li');
    ddFilterNotSold.className = "dropdown-item";
    ddFilterNotSold.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" value=\"\" checked id=\"filterNotSold\"> " +
      "<label class=\"form-check-label\" for=\"filterNotSold\">Not Sold</label>";
    ddFilterList.appendChild(ddFilterNotSold);
    document.getElementById('filterNotSold').onclick = () => {
        window.setTimeout(() => {
            filterList();
        }, 400);
    };

    var ddFilterOpen = document.createElement('li');
    ddFilterOpen.className = "dropdown-item";
    ddFilterOpen.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" value=\"\" checked id=\"filterOpen\"> " +
      "<label class=\"form-check-label\" for=\"filterOpen\">Open</label>";
    ddFilterList.appendChild(ddFilterOpen);
    document.getElementById('filterOpen').onclick = () => {
        window.setTimeout(() => {
            filterList();
        }, 400);
    };

    if (currentUser != null)
    {

        ddFilterDivider = document.createElement('li');
        ddFilterDivider.innerHTML = "<hr class=\"dropdown-divider\">";
        ddFilterList.appendChild(ddFilterDivider);

        var ddFilterMine = document.createElement('li');
        ddFilterMine.className = "dropdown-item";
        ddFilterMine.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" value=\"\" checked id=\"filterMine\"> " +
            "<label class=\"form-check-label\" for=\"filterMine\">Mine</label>";
        ddFilterList.appendChild(ddFilterMine);
        document.getElementById('filterMine').onclick = () => {
            window.setTimeout(() => {
                filterList();
            }, 400);
        };

        var ddFilterOthers = document.createElement('li');
        ddFilterOthers.className = "dropdown-item";
        ddFilterOthers.innerHTML = "<input class=\"form-check-input\" type=\"checkbox\" value=\"\" checked id=\"filterOthers\"> " +
            "<label class=\"form-check-label\" for=\"filterOthers\">Others</label>";
        ddFilterList.appendChild(ddFilterOthers);
        document.getElementById('filterOthers').onclick = () => {
            window.setTimeout(() => {
                filterList();
            }, 400);
        };
    }

    // remove convert button
    nodeBtnConvert.parentNode.removeChild(nodeBtnConvert);

    // remove geeklist items
    nodeItemList.innerHTML = '';

    nodeItemList.className = "tw-grid tw-gap-2";

    // remove footer nav
    //footerNav.parentNode.removeChild(footerNav);
    footerNav.innerHTML = '';

    geeklistid = window.location.pathname.split('/')[2];

    window.setInterval(updateProgressUI, 250);
    getTaggedItems();
    items = [];
    fetchPage(1);
}

function fetchPage(page)
{
    // https://api.geekdo.com/api/listitems?page=1&listid=301669
    var url = "https://api.geekdo.com/api/listitems?page=" + page + "&listid=" + geeklistid;

    fetch(url)
        .then(response => response.json())
        .then(
        data => {
            var nr = (data.pagination.pageid - 1) * data.pagination.perPage;
            for (var item of data.data)
            {
                items[nr] = item;
                nr++;
                makeRow(nr, item);
            }
            setProgress(nr, data.pagination.total);

            if (data.data.length < data.pagination.perPage)
            {
                //console.log("last page");
            }
            else if (page < FETCHLIMIT)
            {
                //console.log("more pages");
                fetchPage(page + 1);
            }
        }
    );
}

function makeRow(nr, item)
{
    var row = document.createElement('span');
    row.className = "tw-relative tw-flex tw-flex-wrap tw-items-center tw-gap-x-1.5 tw-gap-y-2 tw-rounded-md tw-border tw-border-gray-400 tw-bg-gray-100 tw-p-2";

    const thingtype = item.item.href.split('/')[1];
    const bodylower = item.body.toLowerCase();
    const notsold = bodylower.includes("not sold");
    const unsold = bodylower.includes("unsold");
    const soldto = bodylower.includes("sold to");
    const sold = bodylower.includes("sold");
    const auctionclosed = bodylower.includes("auction closed");

    var today = new Date();
    today.setHours(23, 59, 59, 999);
    const auctionends = extractEndDate(item, false);
    if (!auctionends) console.warn(item.body);
    item.auctionends = auctionends;

    var struckout = getStruckoutTextLength(item, false);


    var tagButton = document.createElement("button");
    if (taggedItems.includes(item.id))
    {
        tagButton.className = "btn btn-sm btn-primary";
        tagButton.innerText = "Tagged";
    }
    else
    {
        tagButton.className = "btn btn-sm btn-outline-primary";
        tagButton.innerText = "Tag";
    }
    tagButton.onclick = () => {
        toggleTaggedItem(tagButton, item.id);
    };
    row.appendChild(tagButton);

    var tagGeeklistLink = document.createElement("a");
    tagGeeklistLink.href = "/geeklist/" + geeklistid + "/test?itemid=" + item.id + "#" + item.id;
    tagGeeklistLink.target = "_blank";
    tagGeeklistLink.innerText = nr + ".";
    row.appendChild(tagGeeklistLink);

    var txtThingType = document.createTextNode(thingtype == "boardgame" ? "Boardgame" : thingtype == "boardgameexpansion" ? "Expansion" : "Other");
    row.appendChild(txtThingType);

    var tagGeeklistItemLink = document.createElement("a");
    tagGeeklistItemLink.href = item.item.href;
    tagGeeklistItemLink.target = "_blank";
    tagGeeklistItemLink.style.maxWidth = "50%";
    tagGeeklistItemLink.style.textOverflow = "ellipsis";
    tagGeeklistItemLink.style.overflow = "hidden";
    tagGeeklistItemLink.style.whiteSpace = "nowrap";
    tagGeeklistItemLink.innerText = item.item.name;
    row.appendChild(tagGeeklistItemLink);

    var tagState = document.createElement("span");
    if (notsold || unsold)
    {
        item.state = "not sold";
        tagState.innerText = "not sold";
        tagState.className = "badge bg-danger";
    }
    else if (soldto || (sold && struckout > 100))
    {
        item.state = "sold";
        tagState.innerText = "sold";
        tagState.className = "badge bg-danger";
    }
    else if (auctionclosed || (auctionends && auctionends < today) || struckout > 150)
    {
        item.state = "closed";
        tagState.innerText = "closed";
        tagState.className = "badge bg-secondary";
    }
    else
    {
        item.state = "open";
        tagState.innerText = "open";
        tagState.className = "badge bg-success";
    }
    row.appendChild(tagState);

    if (auctionends)
    {
        var tagClosing = document.createElement("span");
        tagClosing.style.color = "gray";
        tagClosing.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\" style=\"height: 1em; vertical-align: -0.125em;\" fill=\"currentColor\">"+
            "<!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->"+
            "<path d=\"M152 64H296V24C296 10.75 306.7 0 320 0C333.3 0 344 10.75 344 24V64H384C419.3 64 448 92.65 448 128V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V128C0 92.65 28.65 64 64 64H104V24C104 10.75 114.7 0 128 0C141.3 0 152 10.75 152 24V64zM48 448C48 456.8 55.16 464 64 464H384C392.8 464 400 456.8 400 448V192H48V448z\"></path></svg>"+
            " " + auctionends.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        row.appendChild(tagClosing);
    }

    var spanRight = document.createElement('span');
    spanRight.className = "tw-ml-auto tw-hidden tw-pr-0.5 tw-text-sm tw-text-muted md:tw-inline";
    row.appendChild(spanRight);

    var btnPreview = document.createElement('button');
    btnPreview.className = "btn btn-sm text-bg-secondary";
    btnPreview.innerText = "Preview";
    btnPreview.onclick = () => {
        if (btnPreview.data != null)
        {
            btnPreview.data.parentNode.removeChild(btnPreview.data);
            btnPreview.data = null;
        }
        else
        {
            makePreview(item, btnPreview);
        }
    };
    spanRight.appendChild(btnPreview);

    appendListNode(row);
    item.node = row;
}

function appendListNode(node)
{
    if (nodeItemList.childNodes.length == 0 || nodeItemList.lastChild.childNodes.length >= SUBNODE_LIMIT)
    {
        var sublist = document.createElement('div');
        nodeItemList.appendChild(sublist);
    }
    nodeItemList.lastChild.appendChild(node);
}

function makePreview(item, btn)
{
    var gli = document.createElement('div');
    gli.className = "geeklist-item tw-grid tw-items-start tw-gap-2.5 sm:tw-grid-cols-[minmax(auto,_185px)_minmax(65%,_1fr)] lg:tw-gap-3 lg:tw-gap-x-4";
    if (item.node.nextSibling)
    {
        item.node.parentNode.insertBefore(gli, item.node.nextSibling);
    }
    else
    {
        item.node.parentNode.appendChild(gli);
    }
    btn.data = gli;

    const gliImg = makeItemImage(item);
    gli.appendChild(gliImg);

    var gliDiv = document.createElement('div');
    gliDiv.className = "tw-min-w-0 sm:tw-mt-0";
    gli.appendChild(gliDiv);

    const gliDivBody = makeItemBody(item);
    gliDiv.appendChild(gliDivBody);
}

function makeItemUser(item)
{
}

function makeItemBody(item)
{
    var body = document.createElement('div');

    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(item.bodyXml, "text/xml");

    const onlysafehtml = convertItemBody(body, xmlDoc.firstChild);
    if (!onlysafehtml)
    {
        var warn = document.createElement('div');
        warn.className = "alert alert-warning";
        warn.innerText = "This item contains elements (like item links, geek images or user profiles) that are tricky for one page auction script to display. If something looks off please refer to the original item.";
        body.appendChild(warn);
    }

    return body;
}

function convertItemBody(parentHtml, parentXml)
{
    var onlysafehtml = true;
    for (var child of parentXml.childNodes)
    {
        console.log(child);
        if (child.nodeName == 'safehtml')
        {
            var safehtml = document.createElement('span');
            safehtml.innerHTML = child.firstChild.data;
            parentHtml.appendChild(safehtml);
        }
        else if (child.nodeName == 'item-link')
        {
            var itemlink = document.createElement('a');
            var itemtype = child.getAttribute('type');
            if (itemtype == 'things') itemtype = 'thing';
            itemlink.href = '/' + itemtype + '/' + child.getAttribute('id');
            itemlink.target = '_blank';
            parentHtml.appendChild(itemlink);
            onlysafehtml &= convertItemBody(itemlink, child);
        }
        else if (child.nodeName == 'geekimage')
        {
            var geekimage = document.createElement('img');
            geekimage.style.display = 'block';
            parentHtml.appendChild(geekimage);
            loadImage(geekimage, child.getAttribute('id'), child.getAttribute('size'));
            onlysafehtml = false;
        }
        else if (child.nodeName == 'user')
        {
            var user = document.createElement('div');
            user.className = "tw-inline";
            user.innerText = "User Id " + child.getAttribute('userid');
            parentHtml.appendChild(user);
            loadUserLink(user, child.getAttribute('userid'));
            onlysafehtml = false;
        }
        else
        {
            var node = document.createElement(child.nodeName);
            onlysafehtml &= convertItemBody(node, child);
            parentHtml.appendChild(node);
            onlysafehtml = false;
        }
    }
    return onlysafehtml;
}

function loadUserLink(node, id)
{
    fetch('https://api.geekdo.com/api/users/' + id)
        .then(response => response.json())
        .then(
        data => {
            var html = "<a href=\"" + data.href + "\" target=\"_blank\">"+
                "  <div class=\"user-embed tw-my-1 tw-mr-2 tw-inline-flex tw-items-center tw-rounded tw-border tw-border-gray-400 tw-bg-white tw-pr-3 tw-align-middle\">";

            if (data.avatar)
            {
                html +=
                    "    <gg-avatar-image-dumb size=\"md\" class=\"user-embed__avatar tw-m-1.5\">"+
                    "      <img loading=\"lazy\" class=\"img-fluid\""+
                    "        src=\"" + data.avatar.urls.md + "\""+
                    "        srcset=\"" + data.avatar.urls.md + "\""+
                    "        alt=\"" + data.username + " Avatar\" width=\"35\">"+
                    "    </gg-avatar-image-dumb>";
            }
            else
            {
                html +=
                    "    <gg-avatar-image-dumb size=\"md\" class=\"user-embed__avatar tw-m-1.5\">"+
                    "      <gg-avatar-letter>"+
                    "        <span role=\"presentation\" class=\"avatar-letter tw-mx-auto tw-block tw-text-center tw-font-normal tw-text-white size-md\" aria-label=\""+
                               data.username + " avatar\" style=\"background-color: rgb(44, 133, 95); width: 30px; height: 30px; line-height: 30px\"> " + data.username.substring(0,1).toUpperCase() + " </span>"+
                    "      </gg-avatar-letter>"+
                    "    </gg-avatar-image-dumb>";
            }
            html += "    <div class=\"user-embed__body tw-min-w-0 tw-flex-1\">"+
                "      <p class=\"tw-mb-0 tw-text-sm tw-font-bold tw-leading-none\"> " + data.firstname + " " + data.lastname + " </p>"+
                "      <p class=\"tw-mb-0 tw-text-xs tw-leading-tight tw-text-muted\"> @" + data.username + " </p>"+
                "    </div>"+
                "  </div>"+
                "</a>";
            node.innerHTML = html;
        }
    );
}

function loadImage(node, id, size)
{
    fetch('https://api.geekdo.com/api/images/' + id)
        .then(response => response.json())
        .then(
        data => {
            node.src = data.images[size].src;
        }
    );
}

function makeItemImage(item)
{
    var gliImg = document.createElement('a');
    gliImg.className = "geeklist-item__img-link tw-relative tw-block tw-overflow-hidden tw-rounded-md tw-bg-gray-100";
    gliImg.href = item.linkedImage.href;

    var gliImgDiv = document.createElement('div');
    gliImgDiv.className = "tw-h-44 tw-w-full sm:tw-aspect-w-1 sm:tw-aspect-h-1";
    gliImg.appendChild(gliImgDiv);

    var gliImgDivImg = document.createElement('img');
    gliImgDivImg.className = "img-fluid geeklist-item__img tw-absolute tw-w-full tw-h-full tw-p-2.5 md:tw-p-3.5 tw-object-contain tw-z-10";
    gliImgDivImg.loading = "lazy";
    gliImgDivImg.style.display = "inherit";
    gliImgDivImg.src = item.item.imageSets.square100.src;
    gliImgDivImg.srcset = item.item.imageSets.square100.src + " 1x," + item.item.imageSets.square100["src@2x"] + " 2x";
    gliImgDivImg.alt = item.linkedImage.alt;
    gliImgDivImg.sizes = "";
    gliImgDiv.appendChild(gliImgDivImg);

    gliImgDivImg = document.createElement('img');
    gliImgDivImg.className = "img-fluid tw-absolute tw-w-full tw-h-full tw-object-cover tw-scale-125 tw-opacity-30 tw-blur-xl tw-bg-white";
    gliImgDivImg.loading = "lazy";
    gliImgDivImg.style.display = "inherit";
    gliImgDivImg.src = item.item.imageSets.square100.src;
    gliImgDivImg.srcset = item.item.imageSets.square100.src + " 1x," + item.item.imageSets.square100["src@2x"] + " 2x";
    gliImgDivImg.sizes = "";
    gliImgDiv.appendChild(gliImgDivImg);

    if (item.stats)
    {
        gliImgDiv = document.createElement('div');
        gliImgDiv.className = "tw-absolute tw-right-2 tw-bottom-2 tw-z-20";
        gliImgDiv.innerHTML = "<gg-rating-indicator tooltip=\"Avg. Rating\" shape=\"hex\" size=\"md\">" +
            "<span container=\"body\" class=\"hex rating--" + Math.floor(item.stats.average) + " tw-flex tw-font-semibold tw-h-[var(--hex-h)] tw-items-center tw-justify-center tw-text-white tw-text-xs tw-w-[var(--hex-w)]\"" +
            " style=\"background:" + getColorFromRating(item.stats.average) + "; --hex-w: 1.625rem; --hex-h: 1.875rem; -webkit-clip-path: polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%); clip-path: polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);\">" +
            "<span class=\"tw-pb-px\"> " + (Math.round(item.stats.average * 10) / 10) + " </span>" +
            "</span>" +
            "</gg-rating-indicator>";
        gliImg.appendChild(gliImgDiv);
    }

    return gliImg;
}

function encodeWithTextNode(htmlstring) {
	let textarea = document.createElement('textarea');
	let text = document.createTextNode(htmlstring);
	textarea.appendChild(text);
	return textarea.innerHTML;
}

function getTaggedItems()
{
    taggedItems = JSON.parse(GM_getValue("TaggedItems_" + geeklistid, "[]"));
}

function toggleTaggedItem(btn, itemid)
{
    if (taggedItems.includes(itemid))
    {
        taggedItems = taggedItems.filter(i => i != itemid);
        btn.className = "btn btn-sm btn-outline-primary";
        btn.innerText = "Tag";
    }
    else
    {
        taggedItems[taggedItems.length] = itemid;
        btn.className = "btn btn-sm btn-primary";
        btn.innerText = "Tagged";
    }
    GM_setValue("TaggedItems_" + geeklistid, JSON.stringify(taggedItems));
}

async function sortBy(type)
{
    await setProgressAsync(0, items.length);

    var sorted;
    if (type == null || type == '' || type == 'default')
    {
        sorted = items;
    }
    else if (type == 'name')
    {
        sorted = [...items];
        sorted = sorted.sort((a,b) => {
            var r = a.item.name > b.item.name ? 1 : -1;
            return r;
        });
    }
    else if (type == 'closing')
    {
        sorted = [...items];
        sorted = sorted.sort((a,b) => {
            var r = a.auctionends > b.auctionends ? 1 : -1;
            return r;
        });
    }

    nodeItemList.innerHTML = '';
    sortChunks(sorted, 0);
}

function sortChunks(sorted, start)
{
    sortAChunk(sorted, start)
        .then(async data => {
			//console.log(data.next, data.sorted.length);
            await setProgressAsync(data.next, data.sorted.length);

            if (data.next >= data.sorted.length)
            {
                console.log("sorting finished", new Date());
            }
            else
            {
                sortChunks(data.sorted, data.next);
            }
        }
    );
}

function sortAChunk(sorted, start)
{
    const chunk = 250;

	return new Promise(res => {
		window.setTimeout(() => {
			//console.log(start);
			for (var i = 0; i < chunk && start + i < sorted.length; i++)
			{
				var item = sorted[start + i];

                appendListNode(item.node);
			}
			res({
				sorted: sorted,
				next: start + i
			});
		}, 0);
	});
}

function filterList()
{
    console.log("filtering list");
    const fBg = document.getElementById('filterBoardgames').checked;
    const fEx = document.getElementById('filterExpansions').checked;
    const fUT = document.getElementById('filterUntagged').checked;
    const fTg = document.getElementById('filterTagged').checked;
    const fCl = document.getElementById('filterClosed').checked;
    const fSo = document.getElementById('filterSold').checked;
    const fNS = document.getElementById('filterNotSold').checked;
    const fOp = document.getElementById('filterOpen').checked;
    const fMe = document.getElementById('filterMine').checked;
    const fOt = document.getElementById('filterOthers').checked;

    for (var i = 0; i < items.length; i++)
    {
        var show = true;
        var item = items[i];
        const thingtype = item.item.href.split('/')[1];
        const tagged = taggedItems.includes(item.id);
        if (!fBg && thingtype == 'boardgame') show = false;
        if (!fEx && thingtype == 'boardgameexpansion') show = false;
        if (!fUT && !tagged) show = false;
        if (!fTg && tagged) show = false;

        if (!fCl && item.state == 'closed') show = false;
        if (!fSo && item.state == 'sold') show = false;
        if (!fNS && item.state == 'not sold') show = false;
        if (!fOp && item.state == 'open') show = false;
        if (currentUser != null)
        {
            if (!fMe && item.author == currentUser.userid) show = false;
            if (!fOt && item.author != currentUser.userid) show = false;
        }

        var cls = (show ? "tw-relative tw-flex tw-flex-wrap tw-items-center tw-gap-x-1.5 tw-gap-y-2 tw-rounded-md tw-border tw-border-gray-400 tw-bg-gray-100 tw-p-2" : "tw-relative d-none tw-flex-wrap tw-items-center tw-gap-x-1.5 tw-gap-y-2 tw-rounded-md tw-border tw-border-gray-400 tw-bg-gray-100 tw-p-2");
        item.node.className = cls;

        if ((i + 1) % 100 == 0 || i == items.length - 1)
        {
            setProgress(i+1, items.length);
        }
    }
}

function getColorFromRating(rating)
{
    const i = Math.floor(rating);
    switch (i)
    {
        case 1:
        case 2: return "#b2151f";
        case 3:
        case 4: return "#d71925";
        case 5:
        case 6: return "#5369a2";
        case 7: return "#1978b3";
        case 8: return "#1d804c";
        case 9:
        case 10: return "#186b40";
        default: return "#666e75";
    }
}

function UT_extractEndDate()
{
    const september = 8;
    const october = 9;
    const cases = [
        {
            expected: new Date(2022, september, 25),
            item: {
                postdate: "2022-08-31T13:03:45+00:00",
                body: "Bar\n\nAuction ends: Sunday 25th September, random time\n\nFoo."
            }
        },
        {
            expected: new Date(2022, september, 30),
            item: {
                postdate: "2022-08-31T13:03:45+00:00",
                body: "Bar\n\n[b]Auction ends:[/b] [b][COLOR=#0066FF]September 30 at random time[/COLOR][/b]\nFoo"
            }
        },
        {
            expected: new Date(2022, october, 2),
            item: {
                postdate: "2022-08-31T13:03:45+00:00",
                body: "Bar\n\nAuction ends: Sun 2 Oct, \nFoo"
            }
        },
        {
            expected: new Date(2022, september, 30),
            item: {
                postdate: "2022-08-31T13:03:45+00:00",
                body: "Bar\n\n[size=12][b]Auction ends[/b]: [COLOR=#FF0000]Fri 30 Sept[/COLOR] [-][COLOR=#6699FF][b]Wed 5 Oct[/b][/COLOR][/-], random time.[/size]\nFoo"
            }
        },
        {
            expected: new Date(2022, september, 18),
            item: {
                postdate: "2022-08-31T13:03:45+00:00",
                body: "Bar\n\n[b]End of Auction: 18.09.2022\n[/b]\nFoo"
            }
        },
        {
            expected: new Date(2022, september, 30),
            item: {
                postdate: "2022-08-31T13:03:45+00:00",
                body: "Bar\n\n[-][size=12][b]Auction ends[/b]: [COLOR=#6699FF][b]Fry 30 Sep, random time[/b][/COLOR][/size][/-]\nFoo"
            }
        },
        {
            expected: new Date(2022, october, 1),
            item: {
                postdate: "2022-08-31T13:03:45+00:00",
                body: "Bar\n\nAuction ends: 1 of Okt, random time\nFoo"
            }
        }
    ];

    for (var test of cases)
    {
        var res = extractEndDate(test.item, false);

        if ((res instanceof Date && res.getTime() != test.expected.getTime()) || ( !(res instanceof Date) && res != test.expected))
        {
            console.warn("Expected|Actual|Data", test.expected, res, test.item);
            extractEndDate(test.item, true);
        }
    }
    console.info("Unit Test for extractEndDate are complete");
}

function extractEndDate(item, debug)
{
    var auctionends = false;
    var parsed;

    const posted = new Date(item.postdate);
    const bodytext = item.body.toLowerCase()
        //.replaceAll(/\[-\].*?\[\/-\]/gi, '') // remove all struck out information
        .replaceAll(/\[[^\]]+\]/gi, ''); // remove all tags
    if (debug) console.log(bodytext);

    // find and extract the line of the auction end date
    var linematch = /(?:auction ends|end of auction)(?: (?:on|at))?(?:\:)?(.+)/i.exec(bodytext);
    if (debug) console.log(linematch);

    if (linematch && linematch.length > 1)
    {
        var line = linematch[1]
            .replaceAll(/\[-\].*?\[\/-\]/gi, ''); // remove all struck out information. We do this only now in case the whole line was struck out. Otherwise we would lose the information

        //try obvious formats
        var datematch;

        datematch = /(\d\d)\.(\d\d)\.(\d\d\d\d)/.exec(line);
        if (datematch)
        {
            if (debug) console.log(datematch);
            return new Date(parseInt(datematch[3]), parseInt(datematch[2])-1, parseInt(datematch[1]));
        }

        // (Mon) 1 Jan
        datematch = /\d\d? (of )?\w{3}/.exec(line);
        if (datematch)
        {
            if (debug) console.log(datematch);
            var datetext = datematch[0]
                .replace(/of/i, '')
                .replace(/Okt/i, 'Oct');
            // Subbing year from post
            parsed = Date.parse(datetext + " " + posted.getFullYear());
            if (!isNaN(parsed))
            {
                // It's possible the end date is something like january X and the item is posted december Y
                if (new Date(parsed) < posted)
                {
                    // so we need to increment the supplied year
                    parsed = Date.parse(datetext + " " + (posted.getFullYear() + 1));
                }
                if (debug) console.log(parsed);
                return new Date(parsed);
            }
        }

        line = line.replace(/(\.|,)/gi, ''); // don't need these
        line = line.replaceAll(/(\d+)(th|nd|rd|st)/g, '$1'); // Cannot parse days like 25th, numbers only!
        line = line.replaceAll(/(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Wed|Thu|Fri|Sat|Sun|Fry)/gi, ''); // Don't need the weekday
        line = line.replaceAll(/Okt(ober)?/gi, 'October'); // german
        line = line.replaceAll(/(at )?random time/gi, ''); // remove random time
        line = line.replaceAll(/at .+/gi, ''); // remove specific time
        line = line.replaceAll(/\d\d?(:\d\d)?\s*(am|pm)(\s+\w{3,4})?/gi, ''); // remove time without leading words
        line = line.replaceAll(/\d\d?:\d\d(\s+\w{3,4})?/gi, ''); // remove time without leading words
        if (debug) console.log(line);

        var ms = Date.parse(line);
        if (isNaN(ms))
        {
            // There probably isn't a year supplied. Subbing year from post
            ms = Date.parse(line + " " + posted.getFullYear());
            if (!isNaN(ms))
            {
                // It's possible the end date is something like january X and the item is posted december Y
                if (new Date(ms) < posted)
                {
                    // so we need to increment the supplied year
                    ms = Date.parse(line + " " + (posted.getFullYear() + 1));
                }
                auctionends = new Date(ms);
            }
        }
        else
        {
            auctionends = new Date(ms);
        }
    }

    return auctionends;
}

function getStruckoutTextLength(item, debug)
{
    var bodytext = item.body.toLowerCase();
    var struckout = 0;
    var struckoutstart = bodytext.indexOf("[-]");
    var struckoutend = bodytext.indexOf("[/-]");
    while (struckoutstart >= 0 && struckoutend >= 0)
    {
        var text = bodytext.substring(struckoutstart+3, struckoutend)
            .replaceAll(/\[[^\]]+\]/gi, ''); // remove tags
        struckout += text.length;
        struckoutstart = bodytext.indexOf("[-]", struckoutstart + 1);
        struckoutend = bodytext.indexOf("[/-]", struckoutend + 1);
    }
    return struckout;
}

