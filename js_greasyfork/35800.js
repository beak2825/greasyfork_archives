// ==UserScript==
// @name         BTN Sort Torrents
// @version      0.3
// @description  Sort torrents by SD/HD, then source, then resolution, then origin, then by size
// @author       Nealefelaen
// @include      http*://broadcasthe.net/series.php?id=*
// @include      http*://broadcasthe.net/torrents.php?*id=*
// @grant        none
// @namespace https://greasyfork.org/users/161187
// @downloadURL https://update.greasyfork.org/scripts/35800/BTN%20Sort%20Torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/35800/BTN%20Sort%20Torrents.meta.js
// ==/UserScript==

var torrent_tables = document.getElementsByClassName('torrent_table');

var lbox = document.getElementsByClassName('linkbox')[0];
var a = document.createElement('a');
a.innerHTML = '[Sort Settings]';
a.href = 'javascript:void(0);';
a.addEventListener('click', settings, false);
lbox.appendChild(document.createTextNode(' '));
lbox.appendChild(a);

function settings()
{
    var div = document.createElement('div');
    div.setAttribute('style', 'position: absolute; top: 200px; left: 0; right: 0; margin: auto; background: black; border-radius: 20px; width: 900px; text-align: center;');
    document.body.appendChild(div);

    var order_explanations = [
        ["Definition", "Sort into Standard Definition and High Definition (this likely needs to stay first)"],
        ["Quality", "Sort by resolution (SD, 720p, 1080p, etc)"],
        ["Source", "Sort by order of where the rip came from (HDTV, WEBRip, Bluray, etc)"],
        ["Origin", "Sort by where the rip originated (User, Scene, P2P, etc)"],
        ["Size", "Sort by the size of the torrent"],
    ];
    var order = window.localStorage.sort_order;
    if(!order)
    {
        order = [0, 1, 2, 3, 4];
    }
    else
    {
        order = JSON.parse(order);
    }

    var h1 = document.createElement('h1');
    div.appendChild(h1);
    h1.innerHTML = 'Sort Settings';
    var h2 = document.createElement('h2');
    div.appendChild(h2);
    h2.innerHTML = 'Sort Order';
    var order_div = document.createElement('div');
    div.appendChild(order_div);
    for(var i=0; i<order.length; i++)
    {
        var d = document.createElement('div');
        d.setAttribute('order', order[i]);
        order_div.appendChild(d);
        var a = document.createElement('a');
        d.appendChild(a);
        a.innerHTML = '<img src="https://cdn.broadcasthe.net/styles/smptev3/images/seeders.png"  alt="Move Up" title="Move Up">';
        a.href = 'javascript:void(0);';
        a.addEventListener('click', moveUp.bind(undefined, d), false);
        d.appendChild(document.createTextNode(' '));
        var a = document.createElement('a');
        d.appendChild(a);
        a.innerHTML = '<img src="https://cdn.broadcasthe.net/styles/smptev3/images/leechers.png"  alt="Move Down" title="Move Down">';
        a.href = 'javascript:void(0);';
        a.addEventListener('click', moveDown.bind(undefined, d), false);

        var s = document.createElement('span');
        d.appendChild(s);
        s.setAttribute('style', 'width: 100px; display: inline-block;');
        s.innerHTML = order_explanations[order[i]][0];

        var s = document.createElement('span');
        d.appendChild(s);
        s.setAttribute('style', 'width: 500px; display: inline-block;');
        s.innerHTML = order_explanations[order[i]][1];
    }

    div.appendChild(document.createElement('br'));
    div.appendChild(document.createElement('br'));

    var label = document.createElement('span');
    div.appendChild(label);
    label.innerHTML = 'Definition Headings: ';
    var headings = window.localStorage.headings;
    if(!headings)
        headings = true;
    else
        headings = JSON.parse(headings);

    var check = document.createElement('input');
    check.type = 'checkbox';
    div.appendChild(check);
    check.checked = headings;

    div.appendChild(document.createElement('br'));

    var label = document.createElement('span');
    div.appendChild(label);
    label.innerHTML = 'SD first: ';
    var sdfirst = window.localStorage.sdfirst;
    if(!sdfirst)
        sdfirst = true;
    else
        sdfirst = JSON.parse(sdfirst);

    var sdf = document.createElement('input');
    sdf.type = 'checkbox';
    div.appendChild(sdf);
    sdf.checked = sdfirst;

    div.appendChild(document.createElement('br'));

    var label = document.createElement('span');
    div.appendChild(label);
    label.innerHTML = 'Heading colour: ';
    var colour = window.localStorage.colour;
    if(!colour)
        colour = "#ffffff";
    else
        colour = JSON.parse(colour);

    var colouri = document.createElement('input');
    div.appendChild(colouri);
    colouri.value = colour;

    div.appendChild(document.createElement('br'));

    var label = document.createElement('span');
    div.appendChild(label);
    label.innerHTML = 'Use \'Ultra High Definition\' Header: ';
    var uhd = window.localStorage.uhd;
    if(!uhd)
        uhd = false;
    else
        uhd = JSON.parse(uhd);

    var uhdc = document.createElement('input');
    uhdc.type = 'checkbox';
    div.appendChild(uhdc);
    uhdc.checked = uhd;


    div.appendChild(document.createElement('br'));
    div.appendChild(document.createElement('br'));
    var a = document.createElement('a');
    a.innerHTML = '[Save]';
    a.href = 'javascript:void(0);';
    a.addEventListener('click', save.bind(undefined, div, order_div, check, sdf, colouri, uhdc), false);
    div.appendChild(a);
    div.appendChild(document.createTextNode(' '));
    var a = document.createElement('a');
    a.innerHTML = '[Cancel]';
    a.href = 'javascript:void(0);';
    a.addEventListener('click', cancel.bind(undefined, div), false);
    div.appendChild(a);
}

function moveUp(div)
{
    if(div.previousElementSibling)
        div.parentNode.insertBefore(div, div.previousElementSibling);
}

function moveDown(div)
{
    if(div.nextElementSibling.nextElementSibling)
        div.parentNode.insertBefore(div, div.nextElementSibling.nextElementSibling);
    else
        div.parentNode.appendChild(div);
}

function save(div, orders, check, sdf, colour, uhd)
{
    var o=orders.getElementsByTagName('div');
    var sort_order = [];
    for(var i=0; i<o.length; i++)
    {
        sort_order.push(o[i].getAttribute('order'));
    }
    window.localStorage.sort_order = JSON.stringify(sort_order);

    window.localStorage.headings = JSON.stringify(check.checked);

    window.localStorage.sdfirst = JSON.stringify(sdf.checked);

    window.localStorage.colour = JSON.stringify(colour.value);

    window.localStorage.uhd = JSON.stringify(uhd.checked);

    cancel(div);
}

function cancel(div)
{
    document.body.removeChild(div);
}

for(var i=0; i<torrent_tables.length; i++)
{
    var t=torrent_tables[i];


    if(window.location.pathname == '/torrents.php')
    {
        var trs = t.querySelectorAll('.torrent_table > tbody > tr');
        sort_trs(trs);
    }
    else
    {
        var trs = t.querySelectorAll('tr');
        var j=0;
        for(j=0; j<trs.length; )
        {
            j = sort_section(trs, j);
            if(j == -1)
                break;
        }
    }

    var trs = t.getElementsByTagName('tr');
    if(trs.length > 0)
        trs[1].setAttribute('style', 'border-top: none;');
}

function sort_trs(trs)
{
    var quality_rankings = {
        aSD:3,
        a720p:2,
        a1080i:1,
        a1080p:0,
        a2160i:-1,
        a2160p:-2};

    var section = [];
    for(var i=1; i<trs.length; i=i+3)
    {
        trs[i].setAttribute('originalIndex', i);
        section.push(trs[i]);
    }
    if(section.length == 1)
        section[0].setAttribute('details', JSON.stringify(get_details(section[0])));

    section.sort(sort_func);


    var headings = window.localStorage.headings;
    if(!headings)
        headings = true;
    else
        headings = JSON.parse(headings);

    var header = 'High Definition';
    var qual = JSON.parse(section[0].getAttribute('details')).quality;
    if(qual == 'SD')
        header = 'Standard Definition';
    else if(qual == '2160p')
        header = 'Ultra High Definition';

    var colour = window.localStorage.colour;
    if(!colour)
        colour = "#ffffff";
    else
        colour = JSON.parse(colour);

    if(headings)
    {
        var tr = document.createElement('tr');
        //tr.setAttribute('class', 'group_torrent');
        var td = document.createElement('td');
        tr.appendChild(td);
        td.setAttribute('colspan', 5);
        td.innerHTML = header;
        td.setAttribute('style', 'font-weight: bold; text-align: center; color: '+colour+';');
        section[0].parentNode.appendChild(tr);
    }

    var uhdHeadings = window.localStorage.uhd;
    if(uhdHeadings)
        uhdHeadings = JSON.parse(uhdHeadings);

    for(var i=0; i<section.length; i++)
    {
        var quality = JSON.parse(section[i].getAttribute('details')).quality;
        if(headings)
        {
            var set = false;
            if(header != 'Standard Definition' && quality == 'SD')
            {
                header = 'Standard Definition';
                set = true;
            }
            else if(header != 'High Definition' && quality != 'SD' && !(uhdHeadings && quality == '2160p'))
            {
                header = 'High Definition';
                set = true;
            }
            else if(uhdHeadings && header != 'Ultra High Definition' && quality == '2160p')
            {
                header = 'Ultra High Definition';
                set = true;
            }
            if(typeof(quality_rankings['a'+quality]) == 'undefined')
            {
                header = 'Unknown';
                set = true;
            }
            if(set)
            {
                var tr = document.createElement('tr');
                var td = document.createElement('td');
                tr.appendChild(td);
                td.setAttribute('colspan', 5);
                td.innerHTML = header;
                td.setAttribute('style', 'font-weight: bold; text-align: center; color: '+colour+';');
                section[i].parentNode.appendChild(tr);
            }
        }


        var originalIndex = parseInt(section[i].getAttribute('originalIndex'));
        for(var j=0; j<3; j++)
        {
            trs[originalIndex].parentNode.appendChild(trs[originalIndex+j]);
        }
    }
}

function sort_section(trs, start)
{
    // this is duplicated in the sort_func function, global variables aren't working for me
    var quality_rankings = {
        aSD:3,
        a720p:2,
        a1080i:1,
        a1080p:0,
        a2160i:-1,
        a2160p:-2};

    var end=trs.length;

    if(trs[start].getAttribute('class').indexOf('colhead_dark') != -1)
        start++;

    if(trs[start].getAttribute('class').indexOf('first') == -1)
    {
        console.log('BTN Sort Torrents: Error: start tr does not have "first" class');
        console.log(trs[start].innerHTML);
        return -1;
    }

    for(var i=start+1; i<trs.length; i++)
    {
        if(trs[i].getAttribute('class').indexOf('first') != -1)
        {
            end = i;
            break;
        }
    }

    var section = [];
    for(var i=start; i<end; i++)
    {
        if(trs[i].getElementsByTagName('td').length !== 0)
            section.push(trs[i]);
    }
    if(section.length === 0)
        return end;
    else if(section.length == 1)
        section[0].setAttribute('details', JSON.stringify(get_details(section[0])));

    section.sort(sort_func);
    //switch_first(trs, section, start);

    var headings = window.localStorage.headings;
    if(!headings)
        headings = true;
    else
        headings = JSON.parse(headings);

    var colour = window.localStorage.colour;
    if(!colour)
        colour = "#ffffff";
    else
        colour = JSON.parse(colour);

    var header = 'High Definition';
    var qual = JSON.parse(section[0].getAttribute('details')).quality;
    if(qual == 'SD')
        header = 'Standard Definition';
    else if(qual == '2160p')
        header = 'Ultra High Definition';

    var t = trs[start].getElementsByTagName('td')[0];
    trs[start].setAttribute('class', trs[start].getAttribute('class').split(' first')[0]);
    if(headings)
    {
        t.setAttribute('rowspan', parseInt(t.getAttribute('rowspan'))+1);
        var tr = document.createElement('tr');
        //tr.setAttribute('class', 'group_torrent discog first');
        tr.setAttribute('class', 'discog first');
        tr.appendChild(t);
        var td = document.createElement('td');
        tr.appendChild(td);
        td.setAttribute('colspan', 5);
        td.innerHTML = header;
        td.setAttribute('style', 'font-weight: bold; text-align: center; color: '+colour+';');
        section[0].parentNode.appendChild(tr);
    }
    else
    {
        section[0].insertBefore(t, section[0].firstElementChild);
    }

    var uhdHeadings = window.localStorage.uhd;
    if(uhdHeadings)
        uhdHeadings = JSON.parse(uhdHeadings);

    for(var i=0; i<section.length; i++)
    {
        var quality = JSON.parse(section[i].getAttribute('details')).quality;
        if(headings)
        {
            var set = false;
            if(header != 'Standard Definition' && quality == 'SD')
            {
                header = 'Standard Definition';
                set = true;
            }
            else if(header != 'High Definition' && quality != 'SD' && !(uhdHeadings && quality == '2160p'))
            {
                header = 'High Definition';
                set = true;
            }
            else if(uhdHeadings && header != 'Ultra High Definition' && quality == '2160p')
            {
                header = 'Ultra High Definition';
                set = true;
            }
            if(typeof(quality_rankings['a'+quality]) == 'undefined')
            {
                header = 'Unknown';
                set = true;
            }
            if(set)
            {
                var tr = document.createElement('tr');
                var td = document.createElement('td');
                tr.appendChild(td);
                td.setAttribute('colspan', 5);
                td.innerHTML = header;
                td.setAttribute('style', 'font-weight: bold; text-align: center; color: '+colour+';');
                section[i].parentNode.appendChild(tr);
                t.setAttribute('rowspan', parseInt(t.getAttribute('rowspan'))+1);
            }
        }
        section[i].parentNode.appendChild(section[i]);
    }

    return end;
}

function sort_definition(a, b)
{
    var sdfirst = window.localStorage.sdfirst;
    if(!sdfirst)
        sdfirst = true;
    else
        sdfirst = JSON.parse(sdfirst);

    // Split SD and HD
    if(a.quality == 'SD')
    {
        if(b.quality != 'SD')
            if(sdfirst)
                return -1;
            else
                return 1;
    }
    else if(b.quality == 'SD')
    {
        if(a.quality != 'SD')
            if(sdfirst)
                return 1;
            else
                return -1;
    }

    return "no";
}

function sort_source(a, b)
{
    var source_rankings = {
        PDTV:0,
        HDTV:1,
        DVD:2,
        WEBDL:3,
        WEBRip:4,
        WEBDL:5,
        BluRay:6};

    // Start compare source
    var both_undefined = false;
    if(typeof(source_rankings[a.source]) == "undefined")
    {
        if(typeof(source_rankings[b.source]) != "undefined")
            return 1;
        else
            both_undefined = true;
    }
    else if(typeof(source_rankings[b.source]) == "undefined")
    {
        return -1;
    }
    if(!both_undefined)
    {
        if(source_rankings[a.source] < source_rankings[b.source])
            return -1;
        else if(source_rankings[a.source] > source_rankings[b.source])
            return 1;
    }
    // End compare source

    return "no";
}

function sort_quality(a, b)
{
    // this is duplicated in the sort_section function, global variables aren't working for me
    var quality_rankings = {
        aSD:0,
        a720p:1,
        a1080i:2,
        a1080p:3,
        a2160i:4,
        a2160p:5};

    // Start compare quality
    var both_undefined = false;
    if(typeof(quality_rankings['a'+a.quality]) == "undefined")
    {
        if(typeof(quality_rankings['a'+b.quality]) != "undefined")
            return 1;
        else
            both_undefined = true;
    }
    else if(typeof(quality_rankings['a'+b.quality]) == "undefined")
    {
        return -1;
    }    
    if(!both_undefined)
    {
        if(quality_rankings['a'+a.quality] < quality_rankings['a'+b.quality])
            return -1;
        else if(quality_rankings['a'+a.quality] > quality_rankings['a'+b.quality])
            return 1;
    }
    // End compare quality

    return "no";
}

function sort_origin(a, b)
{
    var origins = {
        None:0,
        User:1,
        Scene:2,
        P2P:3};
    // Start compare origin
    var both_undefined = false;
    if(typeof(origins[a.origin]) == "undefined")
    {
        if(typeof(origins[b.origin]) != "undefined")
            return 1;
        else
            both_undefined = true;
    }
    else if(typeof(origins[b.origin]) == "undefined")
    {
        return -1;
    }    
    if(!both_undefined)
    {
        if(origins[a.origin] < origins[b.origin])
            return -1;
        else if(origins[a.origin] > origins[b.origin])
            return 1;
    }
    // End compare origin

    return "no";
}

function sort_size(a, b)
{
    // Start compare size
    if(a.size < b.size)
        return -1;
    else if(a.size > b.size)
        return 1;
    // End compare size

    return "no";
}

function sort_func(a, b)
{
    var sort_order = [
        sort_definition, // Sort into Standard Definition and High Definition (this likely needs to stay first)
        sort_quality, // Sort by resolution (SD, 720p, 1080p, etc)
        sort_source, // Sort by order of where the rip came from (HDTV, WEBRip, Bluray, etc)
        sort_origin, // Sort by where the rip originated (User, Scene, P2P, etc)
        sort_size, // Sort by the size of the torrent
    ];


    var a_details = JSON.parse(a.getAttribute('details'));
    var b_details = JSON.parse(b.getAttribute('details'));

    if(!a_details)
    {
        a_details = get_details(a);
        a.setAttribute('details', JSON.stringify(a_details));
    }
    if(!b_details)
    {
        b_details = get_details(b);
        b.setAttribute('details', JSON.stringify(b_details));
    }

    var order = window.localStorage.sort_order;
    if(!order)
    {
        order = [0, 1, 2, 3, 4];
    }
    else
    {
        order = JSON.parse(order);
    }

    for(var i=0; i<order.length; i++)
    {
        var s = sort_order[order[i]](a_details, b_details);
        if( s != "no")
            return s;
    }

    return 0;
}

function switch_first(trs, section, start)
{
    section[0].insertBefore(trs[start].getElementsByTagName('td')[0], section[0].childNodes[0]);
}

function get_details(tr)
{
    var result = {};

    var offset = 0;
    var tds = tr.getElementsByTagName('td');
    if(tds[0].getAttribute('class') !== null)
        offset = 1;

    var as = tds[offset].getElementsByTagName('a');
    var torrent_meta = as[as.length-1].textContent.split(' / ');
    var meta_offset = 0;
    if(torrent_meta[2] == 'NFO')
        meta_offset = 1;
    result.quality = torrent_meta[3+meta_offset];
    result.source = torrent_meta[2+meta_offset].replace(/-/g, '');    
    result.origin = torrent_meta[4+meta_offset];

    var size_text = tds[offset+1].innerHTML;
    var size = parseFloat(size_text);
    if(size_text.indexOf('GB') != -1)
        size *= 1024;
    else if(size_text.indexOf('KB') != -1)
        size /= 1024;
    result.size = size;

    return result;
}
