// ==UserScript==
// @name         GGn Autofill from torrent
// @version      1.0.0
// @homepageURL  https://greasyfork.org/en/scripts/457868-ggn-autofill-from-torrent
// @description  Attempt to read the .torrent file and fill in the artist and album
// @license      MIT
// @match        http*://gazellegames.net/upload.php*
// @grant        none
// @run-at       document-idle
// @namespace autofill
// @downloadURL https://update.greasyfork.org/scripts/457868/GGn%20Autofill%20from%20torrent.user.js
// @updateURL https://update.greasyfork.org/scripts/457868/GGn%20Autofill%20from%20torrent.meta.js
// ==/UserScript==

const pageHasLoaded = () => document.getElementById('bitrate') != null
var hasInitialized = false

function waitForLoad(){
    if (document.getElementById('categories').options[document.getElementById('categories').selectedIndex].value == 'OST' && !hasInitialized) {
        const intervalHolder = setInterval(() => {
            if( pageHasLoaded() ) {
                clearInterval(intervalHolder);
                init()
            }
        }, 100);
        hasInitialized = true
    }
    else {
        var a = document.getElementById('autofill')
        if(a.innerHTML.indexOf('On') != -1) {
            toggle(a)
        }
    }
};

if (!pageHasLoaded()) {
    document.getElementById('categories').addEventListener('change', waitForLoad)
}

function init() {
    'use strict';

    var a=document.createElement('a');
    a.id = 'autofill'
    a.innerHTML = 'Auto-fill from torrent: On';
    if(window.location.href.indexOf('groupid=') != -1)
        a.innerHTML = 'Auto-fill from torrent: Off';
    a.href='javascript:void(0);';
    a.addEventListener('click', toggle.bind(undefined, a), false);
    a.setAttribute('style', 'display: block; text-align: center;');
    var before=document.getElementById('upload_table');
    before.parentNode.insertBefore(a, before);

    var format=document.getElementById('format');
    var bitrate=document.getElementById('bitrate');

    document.getElementById('file').addEventListener('change', fileAdded.bind(undefined, a, format, bitrate, true), false);

    addToExisting(a);

    // select the target node
    var target = document.getElementById('upload_table');

    // create an observer instance
    var observer = new MutationObserver(addedToTable.bind(undefined, a));

    // configuration of the observer:
    var config = { childList: true, subtree: true };

    // pass in the target node, as well as the observer options
    observer.observe(target, config);
};

function addToExisting(a)
{
    var tr=document.getElementById('extra_format_row_1');
    var index=1;
    while(tr)
    {
        var input=tr.getElementsByTagName('input')[0];
        var format=tr.getElementsByTagName('select');
        var bitrate=format[1];
        format=format[0];

        input.addEventListener('change', fileAdded.bind(undefined, a, format, bitrate, false), false);

        index++;
        tr=document.getElementById('extra_format_row_'+index);
    }
}

function addedToTable(a, mutations)
{
    for(var i=0; i<mutations.length; i++)
    {
        var m=mutations[i];
        if(m.addedNodes.length == 1)
        {
            var id=m.addedNodes[0].getAttribute('id');
            if(id && id.indexOf('extra_format_row') != -1)
            {
                var tr=m.addedNodes[0];
                var input=tr.getElementsByTagName('input')[0];
                var format=tr.getElementsByTagName('select');
                var bitrate=format[1];
                format=format[0];

                input.addEventListener('change', fileAdded.bind(undefined, a, format, bitrate, false), false);
            }
        }
    }
}

function toggle(a)
{
    if(a.innerHTML.indexOf('On') != -1)
    {
        a.innerHTML=a.innerHTML.replace('On', 'Off');
    }
    else
    {
        a.innerHTML=a.innerHTML.replace('Off', 'On');
    }
}

function fileAdded(a, format, bitrate, full, event)
{
    if(a.innerHTML.indexOf('Off') != -1)
        return;
    var file=event.target.files[0];
    if(!file)
        return;

    if(full)
    {
        var spl=file.name.replace(/ - [0-9][0-9][0-9][0-9]/, '').split(' - ');
        if(spl.length == 1)
        {
            var fn=file.name;
            var length=4;
            var search=fn.search(/[0-9][0-9][0-9][0-9]/);
            if(search != -1)
            {
                if(fn[search-1] == '(')
                {
                    search--;
                    length=6;
                }
                spl=[];
                spl.push(fn.substring(0, search).trim());
                spl.push(fn.substring(search+length).trim());
            }
        }
        var artist=spl[0].split('] ');
        if(artist.length > 2)
            artist='Various Artists';
        else if (artist.length == 1)
            artist=artist[0] + ' & ' + artist[1];
        else
            artist=artist[0];
        var album=spl[1].split(' (')[0].split(' [')[0].split(' {')[0].replace(/.torrent$/, '');
        document.getElementById('title').value=album + ' by ' + artist;

        var yadg=document.getElementById('yadg_input');
        if(yadg)
        {
            yadg.value=artist+' '+album;
            document.getElementById('yadg_submit').click();
        }
    }

    var f=file.name.toLowerCase();

    var formatTemp;
    var bitrateTemp;

    if(f.indexOf('mp3') != -1)
    {
        formatTemp=1;
    }
    else if(f.indexOf('flac') != -1)
    {
        formatTemp=2;
        bitrateTemp=7;
    }
    else
    {
        formatTemp=3;
    }

    if(f.indexOf('v0') != -1)
    {
        bitrateTemp=5;
        formatTemp=1;
    }
    else if(f.indexOf('v1') != -1)
    {
        bitrateTemp=3;
        formatTemp=1;
    }
    else if(f.indexOf('v2') != -1)
    {
        bitrateTemp=2;
        formatTemp=1;
    }
    else if(f.indexOf('192') != -1)
    {
        bitrateTemp=1;
        formatTemp=1;
    }
    else if(f.indexOf('256') != -1)
    {
        bitrateTemp=4;
        formatTemp=1;
    }
    else if(f.indexOf('320') != -1)
    {
        bitrateTemp=6;
        formatTemp=1;
    }
    else
    {
        bitrateTemp=9;
    }

    format.selectedIndex=formatTemp;
    triggerChange(format);

    bitrate.selectedIndex=bitrateTemp;
    triggerChange(bitrate);

    var r=new FileReader();
    r.onload=readFile;
    r.readAsText(file);
}

function readFile(event)
{
    var contents=event.target.result;
    //console.log(contents);
    var paths=contents.split('piece length')[0].split('filesld')[1].split(':path');
    var desc=document.getElementById('album_desc');
    if(desc.value !== '')
        return;
    var extensions=[];
    var tracks=[];
    for(var i=1; i<paths.length-1; i++)
    {
        var p=paths[i];
        p=p.substring(p.indexOf(':')+1).split('eed6:length')[0];
        var extension=p.substring(p.lastIndexOf('.'));
        var hasE=false;
        for(var j=0; j<extensions.length; j++)
        {
            if(extension == extensions[j].extension)
            {
                hasE=true;
                extensions[j].count++;
            }
        }
        if(!hasE)
        {
            extensions.push({extension:extension, count:1});
        }
        tracks.push({track:p, extension:extension});
        //p=p.substring(0, p.lastIndexOf('.'));
        //console.log(p);
        //desc.value+='\r'+p;
    }
    var highCount=0;
    var index=-1;
    for(var i=0; i<extensions.length; i++)
    {
        if(extensions[i].count > highCount)
        {
            highCount=extensions[i].count;
            index=i;
        }
    }
    var finalTracks=[];
    for(var i=0; i<tracks.length; i++)
    {
        var t=tracks[i];
        if(t.extension != extensions[index].extension)
            continue;
        finalTracks.push(t.track);
    }
    finalTracks.sort();

    desc.value='Track list:';
    for(var i=0; i<finalTracks.length; i++)
    {
        var f=finalTracks[i];
        f=f.replace(/^[0-9][0-9]?[0-9]?\.?[\s-_]?[\s-_]?[\s-_]/, '');
        f=f.substring(0, f.lastIndexOf('.'));
        desc.value+='\r[#]'+f;
    }
}

function triggerChange(input)
{
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    input.dispatchEvent(evt);
}
